//! WebSocket 연결 하나를 처리한다. 연결마다 tokio 작업이 하나씩 생긴다.
//!
//! - `?role=host`  : 관전 화면(OBS). 스냅샷을 받기만 한다.
//! - `?role=player`: 휴대폰. 먼저 `join`을 보내고, 그다음 `input`을 보낸다.
//!
//! 안전장치(클라이언트는 믿지 않는다):
//! - 메시지 하나 1KB까지(넘으면 연결을 끊는다)
//! - 1초에 메시지 30개까지(넘친 것은 버리고, 1초마다 한 번만 알린다)
//! - 10초 동안 아무 메시지도 없으면 끊긴 연결로 보고 정리한다(브라우저는 2초마다 ping을 보낸다).
//!   보내기(쓰기)도 같은 기한 안에 끝나야 한다(아래 `write` 설명).
//! - 닉네임 검사, 입력 방향 길이 ≤ 1(속도 제한은 game-core가 한다)

use std::time::Duration;

use axum::extract::ws::{Message, Utf8Bytes, WebSocket, WebSocketUpgrade};
use axum::extract::{Path, Query, State};
use axum::response::Response;
use game_core::physics::Input;
use game_core::protocol::{
    self, ClientMsg, ErrorCode, MAX_INPUTS_PER_SEC, MAX_MESSAGE_BYTES, PROTOCOL_VERSION, ServerMsg,
};
use game_core::world::PlayerId;
use serde::Deserialize;
use tokio::sync::broadcast;
use tokio::sync::broadcast::error::RecvError;
// tokio의 Instant: 테스트에서 tokio 시계를 멈추면 이 시계도 함께 멈춘다.
use tokio::time::{Instant, sleep_until, timeout, timeout_at};

use crate::app::AppState;
use crate::error::AppError;
use crate::room::RoomHandle;

/// 이 시간 동안 아무 메시지도 오지 않으면 끊긴 연결로 본다(브라우저는 2초마다 ping을 보낸다).
/// 접속한 뒤 join을 기다리는 시간도 같다.
pub const IDLE_TIMEOUT: Duration = Duration::from_secs(10);

#[derive(Debug, Clone, Copy, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Role {
    Host,
    Player,
}

#[derive(Debug, Deserialize)]
pub struct WsParams {
    pub role: Role,
}

/// `GET /ws/{code}?role=host|player` → WebSocket으로 업그레이드
pub async fn ws_handler(
    ws: WebSocketUpgrade,
    Path(code): Path<String>,
    Query(params): Query<WsParams>,
    State(state): State<AppState>,
) -> Result<Response, AppError> {
    // 없는 방이면 업그레이드하지 않고 404로 끝낸다.
    let room = state.rooms.get(&code).ok_or(AppError::RoomNotFound)?;
    let idle = state.idle_timeout;
    let ws = ws
        .max_message_size(MAX_MESSAGE_BYTES)
        .max_frame_size(MAX_MESSAGE_BYTES);
    let response = match params.role {
        Role::Host => ws.on_upgrade(move |socket| host_session(socket, room, idle)),
        Role::Player => ws.on_upgrade(move |socket| player_session(socket, room, idle)),
    };
    Ok(response)
}

// ---------- 관전 화면 ----------

async fn host_session(mut socket: WebSocket, room: RoomHandle, idle: Duration) {
    let mut events = room.subscribe();
    // 마지막으로 소식을 들은 시각 + idle. 이때까지 아무것도 안 오면 끊긴 연결이다.
    let mut deadline = Instant::now() + idle;
    let welcome = ServerMsg::Welcome {
        id: 0, // 관전 화면은 플레이어가 아니라서 0
        room: room.code.clone(),
        protocol: PROTOCOL_VERSION,
    };
    if !send_msg(&mut socket, &welcome, deadline).await {
        return;
    }
    // 관전 화면은 누구나 열 수 있으니(로그인 없음) 같은 빈도 제한을 건다.
    let mut limiter = RateLimiter::new(Instant::now());

    loop {
        tokio::select! {
            event = events.recv() => {
                if !forward(&mut socket, event, deadline).await {
                    break;
                }
            }
            _ = sleep_until(deadline) => break, // 응답 없음 → 정리
            incoming = socket.recv() => {
                let message = match incoming {
                    Some(Ok(Message::Close(_))) | Some(Err(_)) | None => break,
                    Some(Ok(message)) => message,
                };
                deadline = Instant::now() + idle; // 소식이 왔으니 기한을 늘린다
                if matches!(message, Message::Ping(_) | Message::Pong(_)) {
                    continue; // 제어 프레임은 axum이 알아서 답한다
                }
                // 호스트가 보내는 메시지는 지연 측정(ping)뿐이다. 넘친 메시지는 조용히 버린다.
                if limiter.check(Instant::now()) != Rate::Allowed {
                    continue;
                }
                let Message::Text(text) = message else {
                    continue;
                };
                let Ok(ClientMsg::Ping { ts }) = ClientMsg::parse(&text) else {
                    continue;
                };
                if !send_msg(&mut socket, &ServerMsg::Pong { ts }, deadline).await {
                    break; // 답장을 기한 안에 못 보냈다 → 끊긴 연결
                }
            }
        }
    }
}

// ---------- 플레이어 ----------

async fn player_session(mut socket: WebSocket, room: RoomHandle, idle: Duration) {
    // 1) 첫 메시지는 join이어야 한다.
    let Some(raw_name) = wait_for_join(&mut socket, idle).await else {
        return;
    };
    let name = match protocol::validate_name(&raw_name) {
        Ok(name) => name,
        Err(error) => {
            let deadline = Instant::now() + idle;
            close_with_error(&mut socket, ErrorCode::BadName, error.message(), deadline).await;
            return;
        }
    };

    // 2) 방 액터에게 참가를 부탁하고 번호를 받는다.
    let id = match room.join(name).await {
        Ok(id) => id,
        Err(code) => {
            let message = match code {
                ErrorCode::RoomFull => "방이 꽉 찼어요(최대 50명).",
                ErrorCode::NameTaken => {
                    "이미 같은 닉네임이 있어요. 다른 닉네임을 쓰거나 잠시 뒤 다시 시도해 주세요."
                }
                _ => "방이 닫혔어요. 새 방 코드를 받아 주세요.",
            };
            close_with_error(&mut socket, code, message, Instant::now() + idle).await;
            return;
        }
    };

    // 3) 스냅샷 구독 → welcome → 게임
    let mut events = room.subscribe();
    let welcome = ServerMsg::Welcome {
        id,
        room: room.code.clone(),
        protocol: PROTOCOL_VERSION,
    };
    if send_msg(&mut socket, &welcome, Instant::now() + idle).await {
        play(&mut socket, &room, id, &mut events, idle).await;
    }

    // 4) 어떻게 끝났든(닫기·끊김·무응답·오류) 퇴장 처리
    room.leave(id).await;
}

/// `idle` 안에 join이 오면 닉네임을 돌려준다. 아니면 None.
async fn wait_for_join(socket: &mut WebSocket, idle: Duration) -> Option<String> {
    let text = match timeout(idle, socket.recv()).await {
        Ok(Some(Ok(Message::Text(text)))) => text,
        _ => return None, // 시간 초과, 연결 끊김, 1KB 초과, 글자가 아닌 메시지
    };
    match ClientMsg::parse(&text) {
        Ok(ClientMsg::Join { name }) => Some(name),
        _ => {
            let message = "먼저 join을 보내 주세요.";
            close_with_error(
                socket,
                ErrorCode::BadMessage,
                message,
                Instant::now() + idle,
            )
            .await;
            None
        }
    }
}

async fn play(
    socket: &mut WebSocket,
    room: &RoomHandle,
    id: PlayerId,
    events: &mut broadcast::Receiver<Utf8Bytes>,
    idle: Duration,
) {
    let mut limiter = RateLimiter::new(Instant::now());
    let mut last_seq = 0;
    // 마지막으로 휴대폰에서 소식을 들은 시각 + idle.
    // 화면이 꺼지거나 Wi-Fi가 끊긴 휴대폰은 "닫기"도 못 보낸다. 그래서 시간으로 알아챈다.
    let mut deadline = Instant::now() + idle;

    loop {
        tokio::select! {
            // 방에서 온 스냅샷·결과를 휴대폰으로 넘긴다(이 쓰기도 기한 안에 끝나야 한다).
            event = events.recv() => {
                if !forward(socket, event, deadline).await {
                    break;
                }
            }
            // 기한까지 아무 소식이 없으면 연결을 정리한다(유령 플레이어 방지).
            _ = sleep_until(deadline) => {
                tracing::info!(player = id, "응답이 없어서 연결을 정리했어요");
                break;
            }
            // 휴대폰에서 온 메시지
            incoming = socket.recv() => {
                let message = match incoming {
                    // 닫기, 끊김, 1KB 초과(Err) → 연결 끝
                    Some(Ok(Message::Close(_))) | Some(Err(_)) | None => break,
                    Some(Ok(message)) => message,
                };
                deadline = Instant::now() + idle; // 소식이 왔으니 기한을 늘린다
                if matches!(message, Message::Ping(_) | Message::Pong(_)) {
                    continue; // 제어 프레임은 axum이 알아서 답한다
                }

                // 글자든 바이너리든 데이터 프레임은 답하기 전에 먼저 센다(제한을 피해 가지 못하게).
                match limiter.check(Instant::now()) {
                    Rate::Allowed => {}
                    Rate::Dropped { first: true } => {
                        let message = "메시지가 너무 많아서 일부를 버렸어요.";
                        if !send_error(socket, ErrorCode::RateLimited, message, deadline).await {
                            break;
                        }
                        continue;
                    }
                    Rate::Dropped { first: false } => continue,
                }

                let Message::Text(text) = message else {
                    let message = "JSON 글자 메시지만 받아요.";
                    if !send_error(socket, ErrorCode::BadMessage, message, deadline).await {
                        break;
                    }
                    continue;
                };
                let sent = match ClientMsg::parse(&text) {
                    Ok(ClientMsg::Input { seq, dx, dy }) => {
                        // 이미 받은 번호보다 오래된 입력은 버린다
                        if seq > last_seq {
                            last_seq = seq;
                            room.send_input(id, Input::new(dx, dy));
                        }
                        true
                    }
                    Ok(ClientMsg::Ping { ts }) => {
                        send_msg(socket, &ServerMsg::Pong { ts }, deadline).await
                    }
                    Ok(ClientMsg::Join { .. }) => {
                        send_error(socket, ErrorCode::BadMessage, "이미 참가했어요.", deadline).await
                    }
                    Err(_) => {
                        let message = "메시지를 이해하지 못했어요.";
                        send_error(socket, ErrorCode::BadMessage, message, deadline).await
                    }
                };
                if !sent {
                    break; // 답장을 기한 안에 못 보냈다 → 끊긴 연결
                }
            }
        }
    }
}

// ---------- 보내기(쓰기) 도우미: 모든 쓰기는 `write` 하나를 지나간다 ----------

/// 소켓에 프레임 하나를 쓴다. 기한(`deadline`)까지 다 못 쓰면 실패(false)로 본다.
///
/// 왜 쓰기에도 기한이 필요할까? 끊긴 휴대폰은 데이터를 읽지 않는다. 그러면 운영체제의
/// 보내기 버퍼(수십 KB)가 가득 차서 `send`가 끝나지 않고 멈춘다. 그동안 `select!`는
/// 다른 가지(`sleep_until(deadline)`)를 살피지 못하므로, 쓰기를 같은 기한으로 묶지 않으면
/// 무응답 정리가 몇 분씩 늦어진다(그동안 닉네임과 자리도 계속 차지한다).
async fn write(socket: &mut WebSocket, message: Message, deadline: Instant) -> bool {
    finish_by(deadline, socket.send(message)).await
}

/// 쓰기 작업 하나를 기한 안에 끝내 본다. 제때 성공했으면 true.
/// (소켓 없이 테스트할 수 있게 "작업"만 받는다.)
async fn finish_by<E>(deadline: Instant, work: impl Future<Output = Result<(), E>>) -> bool {
    matches!(timeout_at(deadline, work).await, Ok(Ok(())))
}

/// 방 이벤트 하나를 소켓으로 넘긴다. 계속해도 되면 true.
async fn forward(
    socket: &mut WebSocket,
    event: Result<Utf8Bytes, RecvError>,
    deadline: Instant,
) -> bool {
    match event {
        Ok(text) => write(socket, Message::Text(text), deadline).await,
        // 이 연결이 느려서 스냅샷 몇 개를 놓쳤다. 최신 것부터 다시 받으면 된다.
        Err(RecvError::Lagged(skipped)) => {
            tracing::debug!(skipped, "느린 연결: 지난 스냅샷을 건너뜀");
            true
        }
        Err(RecvError::Closed) => false,
    }
}

async fn send_msg(socket: &mut WebSocket, msg: &ServerMsg, deadline: Instant) -> bool {
    let text = serde_json::to_string(msg).expect("ServerMsg는 항상 JSON으로 바뀐다");
    write(socket, Message::Text(text.into()), deadline).await
}

async fn send_error(
    socket: &mut WebSocket,
    code: ErrorCode,
    message: &str,
    deadline: Instant,
) -> bool {
    let msg = ServerMsg::Error {
        code,
        message: message.to_string(),
    };
    send_msg(socket, &msg, deadline).await
}

/// 오류를 알려 준 뒤 연결을 닫는다.
async fn close_with_error(
    socket: &mut WebSocket,
    code: ErrorCode,
    message: &str,
    deadline: Instant,
) {
    if send_error(socket, code, message, deadline).await {
        let _ = write(socket, Message::Close(None), deadline).await; // 어차피 끝내는 길이라 결과는 상관없다
    }
}

/// 1초짜리 창(window)마다 메시지를 센다. 한 창에서 MAX_INPUTS_PER_SEC개를 넘으면 버린다.
struct RateLimiter {
    window_start: Instant,
    count: u32,
}

#[derive(Debug, PartialEq, Eq)]
enum Rate {
    Allowed,
    /// first = 이번 창에서 처음 버리는 메시지(이때만 클라이언트에게 알린다)
    Dropped {
        first: bool,
    },
}

impl RateLimiter {
    fn new(now: Instant) -> RateLimiter {
        RateLimiter {
            window_start: now,
            count: 0,
        }
    }

    fn check(&mut self, now: Instant) -> Rate {
        if now.duration_since(self.window_start) >= Duration::from_secs(1) {
            self.window_start = now; // 새 창 시작
            self.count = 0;
        }
        self.count += 1;
        if self.count <= MAX_INPUTS_PER_SEC {
            Rate::Allowed
        } else {
            Rate::Dropped {
                first: self.count == MAX_INPUTS_PER_SEC + 1,
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn rate_limiter_allows_30_per_second() {
        let start = Instant::now();
        let mut limiter = RateLimiter::new(start);
        for _ in 0..MAX_INPUTS_PER_SEC {
            assert_eq!(limiter.check(start), Rate::Allowed);
        }
        assert_eq!(limiter.check(start), Rate::Dropped { first: true });
        assert_eq!(limiter.check(start), Rate::Dropped { first: false });

        // 1초가 지나면 다시 받는다
        let later = start + Duration::from_millis(1000);
        assert_eq!(limiter.check(later), Rate::Allowed);
    }

    #[tokio::test(start_paused = true)]
    async fn stalled_write_gives_up_at_the_deadline() {
        // 상대가 읽지 않아 영원히 끝나지 않는 쓰기(보내기 버퍼가 가득 찬 상황)
        let started = Instant::now();
        let deadline = started + IDLE_TIMEOUT;
        let stuck = std::future::pending::<Result<(), ()>>();
        // 바깥에 20초짜리 안전 시계를 둔다: 기한을 무시하는 코드라면 여기서 Err가 나서 실패한다.
        let result = timeout(IDLE_TIMEOUT * 2, finish_by(deadline, stuck)).await;
        assert_eq!(result, Ok(false), "기한(10초)에 포기해야 해요");
        assert_eq!(Instant::now() - started, IDLE_TIMEOUT);

        let fresh = Instant::now() + IDLE_TIMEOUT;
        assert!(
            finish_by(fresh, async { Ok::<(), ()>(()) }).await,
            "제때 끝난 쓰기"
        );
        assert!(
            !finish_by(fresh, async { Err::<(), ()>(()) }).await,
            "실패한 쓰기"
        );
    }
}
