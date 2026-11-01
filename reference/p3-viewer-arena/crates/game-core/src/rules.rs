//! 게임 규칙 상수. 숫자를 바꾸면 게임의 "느낌"이 바뀐다.
//! 서버와 WASM이 같은 값을 쓰도록 여기 한 곳에만 둔다.
//! (클라이언트 TypeScript `src/protocol.ts`에도 화면용으로 같은 값이 있다.)

/// 서버가 1초에 게임을 몇 번 계산하는지(틱 레이트).
pub const TICK_HZ: u32 = 20;
/// 한 틱의 길이(초). 20Hz면 0.05초.
pub const TICK_DT: f32 = 1.0 / TICK_HZ as f32;
/// 서버가 1초에 스냅샷을 몇 번 보내는지. 틱의 절반이라 2틱마다 한 번 보낸다.
pub const SNAPSHOT_HZ: u32 = 10;

/// 대기 시간(초): 플레이어가 한 명이라도 있으면 이 시간이 지난 뒤 라운드가 시작된다.
pub const WAITING_SECS: f32 = 15.0;
/// 라운드 길이(초).
pub const ROUND_SECS: f32 = 120.0;
/// 결과 화면 시간(초). 끝나면 다시 대기로 돌아간다.
pub const RESULT_SECS: f32 = 10.0;

/// 방 하나에 들어올 수 있는 최대 플레이어 수.
pub const MAX_PLAYERS: usize = 50;

/// 아레나(원) 반지름. 아레나 중심이 (0, 0)이다.
pub const ARENA_RADIUS: f32 = 600.0;
/// 플레이어(원) 반지름.
pub const PLAYER_RADIUS: f32 = 20.0;

/// 가속도(초당 속도 증가량). 입력 방향으로 이만큼 빨라진다.
pub const PLAYER_ACCEL: f32 = 1800.0;
/// 마찰(클수록 빨리 멈춘다). 최고 속도 ≈ PLAYER_ACCEL / PLAYER_FRICTION = 300.
pub const PLAYER_FRICTION: f32 = 6.0;
/// 서버가 강제하는 최고 속도(안전장치). 보통은 마찰 때문에 이 근처에서 저절로 멈추지만,
/// 밀려나기·큰 dt·버그로 속도가 튀어도 `integrate`가 매 틱 이 값으로 잘라 낸다.
/// 클라이언트가 무엇을 보내도 이보다 빨라질 수 없다.
pub const PLAYER_MAX_SPEED: f32 = 300.0;

/// 아이템(원) 반지름, 동시에 떠 있는 아이템 수, 하나 먹을 때 점수.
pub const ITEM_RADIUS: f32 = 12.0;
pub const ITEM_COUNT: usize = 8;
pub const ITEM_SCORE: u32 = 1;

/// 플레이어 색. 플레이어 번호 순서대로 돌아가며 쓴다.
pub const PLAYER_COLORS: [&str; 12] = [
    "#ff6b6b", "#ffa94d", "#ffd43b", "#69db7c", "#38d9a9", "#4dabf7", "#748ffc", "#9775fa",
    "#da77f2", "#f783ac", "#a9e34b", "#66d9e8",
];
