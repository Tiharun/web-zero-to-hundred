//! WebSocket 연결 하나를 처리한다. 연결마다 tokio 작업이 하나씩 생긴다.
//!
//! - `?role=host`  : 관전 화면(OBS). 스냅샷을 받기만 한다.
//! - `?role=player`: 휴대폰. 먼저 `join`을 보내고, 그다음 `input`을 보낸다.
//!
//! 안전장치(클라이언트는 믿지 않는다):
//! - 메시지 하나 1KB까지(넘으면 연결을 끊는다)
//! - 1초에 메시지 30개까지(넘친 것은 버리고 한 번만 알린다)
//! - 닉네임 검사, 입력 방향 길이 ≤ 1(속도 제한은 game-core가 한다)

use std::time::{Duration, Instant};

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
use tokio::time::timeout;

use crate::app::AppState;
use crate::error::AppError;
use crate::room::RoomHandle;

/// 접속한 뒤 이 시간 안에 join을 보내야 한다.
const JOIN_TIMEOUT: Duration = Duration::from_secs(10);

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
    let ws = ws
        .max_message_size(MAX_MESSAGE_BYTES)
        .max_frame_size(MAX_MESSAGE_BYTES);
    let response = match params.role {
        Role::Host => ws.on_upgrade(move |socket| host_session(socket, room)),
        Role::Player => ws.on_upgrade(move |socket| player_session(socket, room)),
    };
    Ok(response)
}

// ---------- 관전 화면 ----------

async fn host_session(mut socket: WebSocket, room: RoomHandle) {
    let mut events = room.subscribe();
    let welcome = ServerMsg::Welcome {
        id: 0, // 관전 화면은 플레이어가 아니라서 0
        room: room.code.clone(),
        protocol: PROTOCOL_VERSION,
    };
    if send_msg(&mut socket, &welcome).await.is_err() {
        return;
    }
    // 관전 화면은 누구나 열 수 있으니(로그인 없음) 같은 빈도 제한을 건다.
    let mut limiter = RateLimiter::new(Instant::now());
    loop {
        tokio::select! {
            event = events.recv() => {
                if !forward(&mut socket, event).await {
                    break;
                }
            }
            incoming = socket.recv() => match incoming {
                // 호스트가 보내는 메시지는 지연 측정(ping)뿐이다. 넘친 메시지는 조용히 버린다.
                Some(Ok(Message::Text(text))) => {
                    if limiter.check(Instant::now()) != Rate::Allowed {
                        continue;
                    }
                    if let Ok(ClientMsg::Ping { ts }) = ClientMsg::parse(&text) {
                        let _ = send_msg(&mut socket, &ServerMsg::Pong { ts }).await;
                    }
                }
                Some(Ok(Message::Close(_))) | Some(Err(_)) | None => break,
                Some(Ok(_)) => {} // ping·pong 프레임은 axum이 알아서 답한다
            },
        }
    }
}

// ---------- 플레이어 ----------

async fn player_session(mut socket: WebSocket, room: RoomHandle) {
    // 1) 첫 메시지는 join이어야 한다.
    let Some(raw_name) = wait_for_join(&mut socket).await else {
        return;
    };
    let name = match protocol::validate_name(&raw_name) {
        Ok(name) => name,
        Err(error) => {
            close_with_error(&mut socket, ErrorCode::BadName, error.message()).await;
            return;
        }
    };

    // 2) 방 액터에게 참가를 부탁하고 번호를 받는다.
    let id = match room.join(name).await {
        Ok(id) => id,
        Err(code) => {
            let message = match code {
                ErrorCode::RoomFull => "방이 꽉 찼어요(최대 50명).",
                _ => "방이 닫혔어요. 새 방 코드를 받아 주세요.",
            };
            close_with_error(&mut socket, code, message).await;
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
    if send_msg(&mut socket, &welcome).await.is_ok() {
        play(&mut socket, &room, id, &mut events).await;
    }

    // 4) 어떻게 끝났든(닫기·끊김·오류) 퇴장 처리
    room.leave(id).await;
}

/// 10초 안에 join이 오면 닉네임을 돌려준다. 아니면 None.
async fn wait_for_join(socket: &mut WebSocket) -> Option<String> {
    let text = match timeout(JOIN_TIMEOUT, socket.recv()).await {
        Ok(Some(Ok(Message::Text(text)))) => text,
        _ => return None, // 시간 초과, 연결 끊김, 1KB 초과, 글자가 아닌 메시지
    };
    match ClientMsg::parse(&text) {
        Ok(ClientMsg::Join { name }) => Some(name),
        _ => {
            close_with_error(socket, ErrorCode::BadMessage, "먼저 join을 보내 주세요.").await;
            None
        }
    }
}

async fn play(
    socket: &mut WebSocket,
    room: &RoomHandle,
    id: PlayerId,
    events: &mut broadcast::Receiver<Utf8Bytes>,
) {
    let mut limiter = RateLimiter::new(Instant::now());
    let mut last_seq = 0;

    loop {
        tokio::select! {
            // 방에서 온 스냅샷·결과를 휴대폰으로 넘긴다.
            event = events.recv() => {
                if !forward(socket, event).await {
                    break;
                }
            }
            // 휴대폰에서 온 메시지
            incoming = socket.recv() => {
                let text = match incoming {
                    Some(Ok(Message::Text(text))) => text,
                    Some(Ok(Message::Binary(_))) => {
                        let _ = send_error(socket, ErrorCode::BadMessage, "JSON 글자 메시지만 받아요.").await;
                        continue;
                    }
                    // 닫기, 끊김, 1KB 초과(Err) → 연결 끝
                    Some(Ok(Message::Close(_))) | Some(Err(_)) | None => break,
                    Some(Ok(_)) => continue,
                };

                match limiter.check(Instant::now()) {
                    Rate::Allowed => {}
                    Rate::Dropped { first: true } => {
                        let _ = send_error(socket, ErrorCode::RateLimited, "메시지가 너무 많아서 일부를 버렸어요.").await;
                        continue;
                    }
                    Rate::Dropped { first: false } => continue,
                }

                match ClientMsg::parse(&text) {
                    Ok(ClientMsg::Input { seq, dx, dy }) => {
                        if seq <= last_seq {
                            continue; // 이미 받은 번호보다 오래된 입력은 버린다
                        }
                        last_seq = seq;
                        room.send_input(id, Input::new(dx, dy));
                    }
                    Ok(ClientMsg::Ping { ts }) => {
                        let _ = send_msg(socket, &ServerMsg::Pong { ts }).await;
                    }
                    Ok(ClientMsg::Join { .. }) => {
                        let _ = send_error(socket, ErrorCode::BadMessage, "이미 참가했어요.").await;
                    }
                    Err(_) => {
                        let _ = send_error(socket, ErrorCode::BadMessage, "메시지를 이해하지 못했어요.").await;
                    }
                }
            }
        }
    }
}

// ---------- 작은 도우미 ----------

/// 방 이벤트 하나를 소켓으로 넘긴다. 계속해도 되면 true.
async fn forward(socket: &mut WebSocket, event: Result<Utf8Bytes, RecvError>) -> bool {
    match event {
        Ok(text) => socket.send(Message::Text(text)).await.is_ok(),
        // 이 연결이 느려서 스냅샷 몇 개를 놓쳤다. 최신 것부터 다시 받으면 된다.
        Err(RecvError::Lagged(skipped)) => {
            tracing::debug!(skipped, "느린 연결: 지난 스냅샷을 건너뜀");
            true
        }
        Err(RecvError::Closed) => false,
    }
}

async fn send_msg(socket: &mut WebSocket, msg: &ServerMsg) -> Result<(), axum::Error> {
    let text = serde_json::to_string(msg).expect("ServerMsg는 항상 JSON으로 바뀐다");
    socket.send(Message::Text(text.into())).await
}

async fn send_error(
    socket: &mut WebSocket,
    code: ErrorCode,
    message: &str,
) -> Result<(), axum::Error> {
    let msg = ServerMsg::Error {
        code,
        message: message.to_string(),
    };
    send_msg(socket, &msg).await
}

/// 오류를 알려 준 뒤 연결을 닫는다.
async fn close_with_error(socket: &mut WebSocket, code: ErrorCode, message: &str) {
    let _ = send_error(socket, code, message).await;
    let _ = socket.send(Message::Close(None)).await;
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
}
