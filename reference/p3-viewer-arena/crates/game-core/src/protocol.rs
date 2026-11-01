//! 서버와 브라우저가 주고받는 메시지(JSON).
//!
//! `#[serde(tag = "t")]`: 메시지 종류를 `"t"` 필드에 적는다 → `{"t":"input","seq":1,"dx":1,"dy":0}`
//! `rename_all = "camelCase"`: Rust의 `Join`은 JSON에서 `"join"`이 된다.
//! 클라이언트 쪽 같은 타입은 `client/src/protocol.ts`에 있다. 한쪽을 바꾸면 다른 쪽도 바꾼다.

use serde::{Deserialize, Serialize};

use crate::world::Phase;

/// 프로토콜 버전. 메시지 모양을 호환되지 않게 바꾸면 1 올린다.
pub const PROTOCOL_VERSION: u32 = 1;

/// 클라이언트가 보내는 메시지 하나의 최대 크기(바이트).
pub const MAX_MESSAGE_BYTES: usize = 1024;
/// 연결 하나가 1초에 보낼 수 있는 메시지 수(입력·ping 모두 센다). 넘친 것은 버린다.
pub const MAX_INPUTS_PER_SEC: u32 = 30;
/// 닉네임 최대 글자 수(한글 한 글자 = 1).
pub const NAME_MAX_CHARS: usize = 12;

/// 닉네임에 넣을 수 없는 말(소문자·공백 제거 후 비교). 방송에 맞게 늘려서 쓴다.
const BANNED_WORDS: [&str; 8] = [
    "admin",
    "운영자",
    "관리자",
    "씨발",
    "시발",
    "병신",
    "fuck",
    "shit",
];

// ---------- 클라이언트 → 서버 ----------

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(tag = "t", rename_all = "camelCase")]
pub enum ClientMsg {
    /// 참가: 연결한 뒤 가장 먼저 보낸다.
    Join { name: String },
    /// 조작: seq는 입력 번호(1, 2, 3, …), (dx, dy)는 조이스틱 방향.
    Input { seq: u32, dx: f32, dy: f32 },
    /// 지연 측정: 서버는 ts를 그대로 pong으로 돌려준다.
    Ping { ts: f64 },
}

/// 받은 글자를 메시지로 바꾸지 못한 이유.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ParseError {
    TooLarge,
    Invalid(String),
}

impl ClientMsg {
    /// 크기를 먼저 확인한 뒤 JSON을 해석한다. 모르는 `t`나 빠진 필드는 오류다.
    pub fn parse(text: &str) -> Result<ClientMsg, ParseError> {
        if text.len() > MAX_MESSAGE_BYTES {
            return Err(ParseError::TooLarge);
        }
        serde_json::from_str(text).map_err(|e| ParseError::Invalid(e.to_string()))
    }
}

// ---------- 서버 → 클라이언트 ----------

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(tag = "t", rename_all = "camelCase")]
pub enum ServerMsg {
    /// 연결 성공. 플레이어는 자기 번호(id)를 받는다. 관전 화면(host)은 id 0.
    Welcome {
        id: u32,
        room: String,
        protocol: u32,
    },
    /// 게임 상태 전체(초당 10번).
    Snapshot(Snapshot),
    /// 라운드 결과(점수 순).
    Result { ranking: Vec<RankEntry> },
    /// 오류. 연결이 끊기기 전에 이유를 알려 준다.
    Error { code: ErrorCode, message: String },
    /// ping에 대한 답.
    Pong { ts: f64 },
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Snapshot {
    pub tick: u64,
    pub phase: Phase,
    pub time_left: f32,
    pub players: Vec<PlayerState>,
    pub items: Vec<ItemState>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct PlayerState {
    pub id: u32,
    pub name: String,
    pub x: f32,
    pub y: f32,
    pub vx: f32,
    pub vy: f32,
    pub score: u32,
    pub color: String,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ItemState {
    pub id: u32,
    pub x: f32,
    pub y: f32,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct RankEntry {
    pub name: String,
    pub score: u32,
}

/// 오류 종류. JSON에서는 `"bad_name"`처럼 쓴다.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ErrorCode {
    BadMessage,
    BadName,
    RoomFull,
    RoomClosed,
    RateLimited,
}

// ---------- 닉네임 검사 ----------

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum NameError {
    Empty,
    TooLong,
    Banned,
}

impl NameError {
    /// 화면에 그대로 보여 줄 안내 문구.
    pub fn message(self) -> &'static str {
        match self {
            NameError::Empty => "닉네임을 입력해 주세요.",
            NameError::TooLong => "닉네임은 12자까지 쓸 수 있어요.",
            NameError::Banned => "쓸 수 없는 닉네임이에요.",
        }
    }
}

/// 앞뒤 공백을 지운 닉네임을 돌려준다. 1~12자, 제어 문자·금지어는 안 된다.
pub fn validate_name(raw: &str) -> Result<String, NameError> {
    let name = raw.trim();
    if name.is_empty() {
        return Err(NameError::Empty);
    }
    // .len()은 바이트 수라서 한글이 3배로 세어진다. 글자 수는 .chars().count()
    if name.chars().count() > NAME_MAX_CHARS {
        return Err(NameError::TooLong);
    }
    if name.chars().any(char::is_control) {
        return Err(NameError::Banned);
    }
    // "시 발", "ADMIN"처럼 피해 가지 못하게 공백을 빼고 소문자로 바꿔서 비교한다.
    let squashed: String = name
        .chars()
        .filter(|c| !c.is_whitespace())
        .collect::<String>()
        .to_lowercase();
    if BANNED_WORDS.iter().any(|word| squashed.contains(word)) {
        return Err(NameError::Banned);
    }
    Ok(name.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn client_msg_roundtrip_json() {
        let text = r#"{"t":"input","seq":1,"dx":1,"dy":0}"#;
        let msg = ClientMsg::parse(text).unwrap();
        assert_eq!(
            msg,
            ClientMsg::Input {
                seq: 1,
                dx: 1.0,
                dy: 0.0
            }
        );

        // 다시 JSON으로 → 다시 읽기: 같은 값이어야 한다
        let back = serde_json::to_string(&msg).unwrap();
        assert_eq!(ClientMsg::parse(&back).unwrap(), msg);

        assert_eq!(
            ClientMsg::parse(r#"{"t":"join","name":"철수"}"#).unwrap(),
            ClientMsg::Join {
                name: "철수".to_string()
            }
        );
        assert_eq!(
            ClientMsg::parse(r#"{"t":"ping","ts":12.5}"#).unwrap(),
            ClientMsg::Ping { ts: 12.5 }
        );
    }

    #[test]
    fn unknown_type_rejected() {
        assert!(matches!(
            ClientMsg::parse(r#"{"t":"fly","speed":999}"#),
            Err(ParseError::Invalid(_))
        ));
        assert!(
            matches!(
                ClientMsg::parse(r#"{"seq":1,"dx":1,"dy":0}"#),
                Err(ParseError::Invalid(_))
            ),
            "t가 없음"
        );
        assert!(
            matches!(
                ClientMsg::parse(r#"{"t":"input","seq":1}"#),
                Err(ParseError::Invalid(_))
            ),
            "필드가 빠짐"
        );
        assert!(matches!(
            ClientMsg::parse("not json"),
            Err(ParseError::Invalid(_))
        ));
    }

    #[test]
    fn oversized_text_rejected_before_parsing() {
        let name = "가".repeat(400); // 한글 한 글자 = UTF-8 3바이트 → 1200바이트
        let text = format!(r#"{{"t":"join","name":"{name}"}}"#);
        assert_eq!(ClientMsg::parse(&text), Err(ParseError::TooLarge));
    }

    #[test]
    fn server_msg_json_shape() {
        let snapshot = ServerMsg::Snapshot(Snapshot {
            tick: 7,
            phase: Phase::Waiting,
            time_left: 15.0,
            players: vec![],
            items: vec![ItemState {
                id: 1,
                x: 2.0,
                y: 3.0,
            }],
        });
        assert_eq!(
            serde_json::to_string(&snapshot).unwrap(),
            r#"{"t":"snapshot","tick":7,"phase":"waiting","timeLeft":15.0,"players":[],"items":[{"id":1,"x":2.0,"y":3.0}]}"#
        );

        let error = ServerMsg::Error {
            code: ErrorCode::RateLimited,
            message: "천천히".to_string(),
        };
        assert_eq!(
            serde_json::to_string(&error).unwrap(),
            r#"{"t":"error","code":"rate_limited","message":"천천히"}"#
        );

        let welcome = ServerMsg::Welcome {
            id: 3,
            room: "ABCD".to_string(),
            protocol: PROTOCOL_VERSION,
        };
        assert_eq!(
            serde_json::to_string(&welcome).unwrap(),
            r#"{"t":"welcome","id":3,"room":"ABCD","protocol":1}"#
        );
    }

    #[test]
    fn names_are_validated() {
        assert_eq!(validate_name("  철수  "), Ok("철수".to_string()));
        assert_eq!(
            validate_name("가나다라마바사아자차카타"),
            Ok("가나다라마바사아자차카타".to_string()),
            "12자는 된다"
        );
        assert_eq!(
            validate_name("가나다라마바사아자차카타파"),
            Err(NameError::TooLong)
        );
        assert_eq!(validate_name("   "), Err(NameError::Empty));
        assert_eq!(
            validate_name("ADMIN"),
            Err(NameError::Banned),
            "대소문자 무시"
        );
        assert_eq!(
            validate_name("시 발"),
            Err(NameError::Banned),
            "공백을 끼워도 걸린다"
        );
        assert_eq!(
            validate_name("a\u{0007}b"),
            Err(NameError::Banned),
            "제어 문자"
        );
    }
}
