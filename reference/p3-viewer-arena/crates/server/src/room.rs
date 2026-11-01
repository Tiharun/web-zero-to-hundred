//! 방 하나 = 액터(actor) 하나.
//!
//! - tokio 작업 하나(`RoomActor::run`)가 `World`를 혼자 가지고 게임을 계산한다 → 잠금(Mutex)이 필요 없다.
//! - WebSocket 연결들은 `RoomHandle`로 명령(참가·퇴장·입력)을 `mpsc` 채널에 넣는다.
//! - 액터는 스냅샷·결과를 JSON 글자로 한 번만 만들어 `broadcast` 채널로 모든 연결에 뿌린다.
//!
//! ```text
//!  연결 A ─┐ mpsc(명령)  ┌──────────────┐  broadcast(스냅샷) ┌─▶ 연결 A
//!  연결 B ─┼────────────▶│ RoomActor    │───────────────────┼─▶ 연결 B
//!  호스트 ─┘             │ World + 틱   │                   └─▶ 호스트
//!                        └──────────────┘
//! ```

use std::time::Duration;

use axum::extract::ws::Utf8Bytes;
use game_core::physics::Input;
use game_core::protocol::{ErrorCode, Phase, RankEntry, ServerMsg};
use game_core::rules::{SNAPSHOT_HZ, TICK_DT, TICK_HZ};
use game_core::world::{JoinError, PlayerId, World};
use serde::Serialize;
use sqlx::PgPool;
use tokio::sync::{broadcast, mpsc, oneshot};

use crate::leaderboard;

/// 연결이 하나도 없는 방은 이 시간(초)이 지나면 닫는다.
pub const EMPTY_ROOM_SECS: u32 = 60;
/// 명령 채널에 쌓일 수 있는 최대 개수. 꽉 차면 입력은 버린다(입력은 최신 값만 중요하다).
const COMMAND_BUFFER: usize = 256;
/// 느린 연결이 따라오지 못하면 오래된 스냅샷부터 건너뛴다.
const EVENT_BUFFER: usize = 64;

/// 연결 → 액터 명령. 답이 필요한 명령은 `oneshot` 채널(한 번만 쓰는 답장 봉투)을 같이 보낸다.
pub enum RoomCommand {
    Join {
        name: String,
        reply: oneshot::Sender<Result<PlayerId, JoinError>>,
    },
    Leave {
        id: PlayerId,
    },
    Input {
        id: PlayerId,
        input: Input,
    },
    Info {
        reply: oneshot::Sender<RoomInfo>,
    },
}

/// `GET /api/rooms/{code}`의 응답.
#[derive(Debug, Clone, Serialize)]
pub struct RoomInfo {
    pub code: String,
    pub players: usize,
    pub phase: Phase,
}

/// 방에 명령을 보내는 손잡이. 복제(clone)해서 여러 연결이 같이 쓴다.
#[derive(Clone)]
pub struct RoomHandle {
    pub code: String,
    commands: mpsc::Sender<RoomCommand>,
    events: broadcast::Sender<Utf8Bytes>,
}

impl RoomHandle {
    /// 플레이어로 참가하고 번호를 받는다.
    pub async fn join(&self, name: String) -> Result<PlayerId, ErrorCode> {
        let (reply, answer) = oneshot::channel();
        let command = RoomCommand::Join { name, reply };
        if self.commands.send(command).await.is_err() {
            return Err(ErrorCode::RoomClosed); // 액터가 이미 끝났다
        }
        match answer.await {
            Ok(Ok(id)) => Ok(id),
            Ok(Err(JoinError::RoomFull)) => Err(ErrorCode::RoomFull),
            Ok(Err(JoinError::NameTaken)) => Err(ErrorCode::NameTaken),
            Err(_) => Err(ErrorCode::RoomClosed),
        }
    }

    pub async fn leave(&self, id: PlayerId) {
        let _ = self.commands.send(RoomCommand::Leave { id }).await;
    }

    /// 입력은 기다리지 않는다: 채널이 꽉 찼으면 그냥 버린다(`try_send`).
    pub fn send_input(&self, id: PlayerId, input: Input) {
        let _ = self.commands.try_send(RoomCommand::Input { id, input });
    }

    pub async fn info(&self) -> Option<RoomInfo> {
        let (reply, answer) = oneshot::channel();
        self.commands.send(RoomCommand::Info { reply }).await.ok()?;
        answer.await.ok()
    }

    /// 스냅샷·결과(JSON 글자)를 받는 수신기.
    pub fn subscribe(&self) -> broadcast::Receiver<Utf8Bytes> {
        self.events.subscribe()
    }
}

/// 게임을 실제로 돌리는 쪽. `run`이 끝나면 방도 끝난다.
pub struct RoomActor {
    code: String,
    commands: mpsc::Receiver<RoomCommand>,
    events: broadcast::Sender<Utf8Bytes>,
    db: Option<PgPool>,
    world: World,
    /// 다음 틱에 적용할 입력들
    pending: Vec<(PlayerId, Input)>,
}

/// 방 하나를 만든다. 돌려받은 `RoomActor`는 `tokio::spawn(actor.run())`으로 띄운다.
pub fn new_room(code: String, seed: u64, db: Option<PgPool>) -> (RoomHandle, RoomActor) {
    let (command_tx, command_rx) = mpsc::channel(COMMAND_BUFFER);
    let (event_tx, _) = broadcast::channel(EVENT_BUFFER);
    let handle = RoomHandle {
        code: code.clone(),
        commands: command_tx,
        events: event_tx.clone(),
    };
    let actor = RoomActor {
        code,
        commands: command_rx,
        events: event_tx,
        db,
        world: World::new(seed),
        pending: Vec::new(),
    };
    (handle, actor)
}

impl RoomActor {
    pub async fn run(mut self) {
        // 고정 틱: 50ms(20Hz)마다 깨어나서 한 번 계산한다.
        let mut ticker = tokio::time::interval(Duration::from_millis(1000 / u64::from(TICK_HZ)));
        let mut empty_ticks = 0;
        tracing::info!(room = %self.code, "방 시작");

        loop {
            // 명령이 먼저 오면 명령을, 틱 시간이 되면 틱을 처리한다.
            tokio::select! {
                Some(command) = self.commands.recv() => self.handle(command),
                _ = ticker.tick() => {
                    self.tick();

                    // 연결(호스트 + 플레이어)마다 수신기가 하나씩 있다. 0이면 아무도 없는 방이다.
                    if self.events.receiver_count() == 0 {
                        empty_ticks += 1;
                    } else {
                        empty_ticks = 0;
                    }
                    if empty_ticks >= EMPTY_ROOM_SECS * TICK_HZ {
                        break;
                    }
                }
            }
        }
        tracing::info!(room = %self.code, "빈 방이라 닫았어요");
    }

    fn handle(&mut self, command: RoomCommand) {
        match command {
            RoomCommand::Join { name, reply } => {
                let result = self.world.add_player(name);
                let _ = reply.send(result); // 연결이 그사이 끊겼으면 답장을 못 받는다(괜찮다)
            }
            RoomCommand::Leave { id } => self.world.remove_player(id),
            RoomCommand::Input { id, input } => self.pending.push((id, input)),
            RoomCommand::Info { reply } => {
                let _ = reply.send(RoomInfo {
                    code: self.code.clone(),
                    players: self.world.players.len(),
                    phase: self.world.phase,
                });
            }
        }
    }

    fn tick(&mut self) {
        let inputs = std::mem::take(&mut self.pending); // 모아 둔 입력을 꺼내고 빈 Vec으로 바꾼다
        if let Some(ranking) = self.world.step(&inputs, TICK_DT) {
            self.save_result(ranking.clone());
            self.broadcast(&ServerMsg::Result { ranking });
        }
        // 20Hz 틱 중 2번에 1번만(틱 번호가 2의 배수일 때) 스냅샷을 보낸다(10Hz).
        if self
            .world
            .tick
            .is_multiple_of(u64::from(TICK_HZ / SNAPSHOT_HZ))
        {
            self.broadcast(&ServerMsg::Snapshot(self.world.snapshot()));
        }
    }

    /// JSON으로 한 번만 바꾸고, 모든 연결이 같은 바이트를 나눠 쓴다(복제가 싸다).
    fn broadcast(&self, msg: &ServerMsg) {
        let text = serde_json::to_string(msg).expect("ServerMsg는 항상 JSON으로 바뀐다");
        let _ = self.events.send(Utf8Bytes::from(text)); // 받는 연결이 없으면 Err → 무시
    }

    fn save_result(&self, ranking: Vec<RankEntry>) {
        let Some(pool) = self.db.clone() else {
            return; // 랭킹이 꺼져 있다(DATABASE_URL 없음)
        };
        if ranking.is_empty() {
            return;
        }
        let code = self.code.clone();
        // DB는 느릴 수 있다. 게임 루프가 멈추지 않도록 저장은 따로 띄운다.
        tokio::spawn(async move {
            match leaderboard::save_result(&pool, &code, &ranking).await {
                Ok(()) => tracing::info!(room = %code, players = ranking.len(), "경기 결과 저장"),
                Err(error) => tracing::warn!(room = %code, %error, "경기 결과를 저장하지 못했어요"),
            }
        });
    }
}
