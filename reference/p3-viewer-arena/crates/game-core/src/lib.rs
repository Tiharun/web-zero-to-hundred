//! game-core: 시청자 참여 아레나의 게임 규칙.
//!
//! 이 크레이트는 순수하다: 파일·네트워크·시계·스레드를 쓰지 않는다.
//! 그래서 서버(Tokio)와 브라우저(WebAssembly)가 같은 코드를 쓰고, 단위 테스트가 쉽다.

// 모듈 사이의 의존은 한 방향이다(서로를 부르는 순환이 없다):
//   world → physics → vec2, rules
//   world → protocol (protocol은 serde만 쓴다)
pub mod physics;
pub mod protocol;
pub mod rules;
pub mod vec2;
pub mod world;
