//! 서버 라이브러리. `main.rs`는 이것을 조립해서 실행만 하고,
//! 통합 테스트(`tests/`)도 같은 라이브러리로 서버를 띄운다.

pub mod app;
pub mod config;
pub mod db;
pub mod error;
pub mod leaderboard;
pub mod room;
pub mod rooms;
pub mod ws;
