//! game-wasm: game-core의 이동 계산을 브라우저(JavaScript)에서 부를 수 있게 내보낸다.
//!
//! 휴대폰 화면은 서버 스냅샷(초당 10번)을 기다리지 않고, 서버와 **똑같은 코드**로
//! 내 플레이어의 다음 위치를 미리 계산한다(클라이언트 예측).
//!
//! JS에서: `predict('{"x":0,"y":0,"vx":0,"vy":0}', '{"dx":1,"dy":0}', 0.016)`
//!        → `'{"x":0.46,"y":0.0,"vx":28.8,"vy":0.0}'` 같은 JSON 글자
//!
//! 문자열(JSON)로 주고받는 이유: 숫자 몇 개라서 충분히 빠르고, 타입 변환 규칙을 따로 배울 필요가 없다.

use game_core::physics::{self, Body, Input};
use game_core::vec2::Vec2;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

/// 플레이어 몸 상태. 서버 스냅샷의 x, y, vx, vy와 같은 이름이다.
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
struct BodyState {
    x: f32,
    y: f32,
    vx: f32,
    vy: f32,
}

/// 조이스틱 방향. 서버로 보내는 input 메시지의 dx, dy와 같다.
#[derive(Debug, Clone, Copy, Deserialize)]
struct InputState {
    dx: f32,
    dy: f32,
}

/// `dt`초 뒤의 몸 상태를 계산한다. JSON이 잘못되면 JS에서 예외(throw)가 난다.
#[wasm_bindgen]
pub fn predict(state_json: &str, input_json: &str, dt: f32) -> Result<String, String> {
    let state: BodyState = serde_json::from_str(state_json).map_err(|e| format!("state: {e}"))?;
    let input: InputState = serde_json::from_str(input_json).map_err(|e| format!("input: {e}"))?;

    let mut body = Body {
        pos: Vec2::new(state.x, state.y),
        vel: Vec2::new(state.vx, state.vy),
    };
    // 서버의 World::step이 플레이어 한 명에게 하는 일과 같다(Input::new가 길이를 1로 줄인다).
    physics::move_body(&mut body, Input::new(input.dx, input.dy), dt);

    let next = BodyState {
        x: body.pos.x,
        y: body.pos.y,
        vx: body.vel.x,
        vy: body.vel.y,
    };
    Ok(serde_json::to_string(&next).expect("숫자 네 개는 항상 JSON으로 바뀐다"))
}

// 이 테스트는 wasm이 아니라 보통 컴퓨터에서 돈다(cargo test). 같은 Rust 코드라서 결과도 같다.
#[cfg(test)]
mod tests {
    use super::*;
    use game_core::rules::{ARENA_RADIUS, PLAYER_RADIUS, TICK_DT};

    fn parse(json: &str) -> BodyState {
        serde_json::from_str(json).unwrap()
    }

    #[test]
    fn predict_matches_game_core() {
        let out = predict(
            r#"{"x":0,"y":0,"vx":0,"vy":0}"#,
            r#"{"dx":1,"dy":0}"#,
            TICK_DT,
        )
        .unwrap();

        let mut body = Body::default();
        physics::move_body(&mut body, Input::new(1.0, 0.0), TICK_DT);
        assert_eq!(
            parse(&out),
            BodyState {
                x: body.pos.x,
                y: body.pos.y,
                vx: body.vel.x,
                vy: body.vel.y
            }
        );
        assert!(parse(&out).vx > 0.0);
    }

    #[test]
    fn predict_applies_server_limits() {
        // 조이스틱 길이를 100으로 보내도 1로 줄어든다 → 정상 입력과 같은 결과
        let cheat = predict(
            r#"{"x":0,"y":0,"vx":0,"vy":0}"#,
            r#"{"dx":100,"dy":0}"#,
            0.05,
        )
        .unwrap();
        let normal = predict(r#"{"x":0,"y":0,"vx":0,"vy":0}"#, r#"{"dx":1,"dy":0}"#, 0.05).unwrap();
        assert_eq!(cheat, normal);

        // 아레나 밖으로 나가지 않는다
        let edge = predict(
            r#"{"x":700,"y":0,"vx":300,"vy":0}"#,
            r#"{"dx":1,"dy":0}"#,
            0.05,
        )
        .unwrap();
        assert!(parse(&edge).x <= ARENA_RADIUS - PLAYER_RADIUS + 1e-3);
    }

    #[test]
    fn predict_rejects_bad_json() {
        assert!(predict("{}", r#"{"dx":1,"dy":0}"#, 0.05).is_err());
        assert!(predict(r#"{"x":0,"y":0,"vx":0,"vy":0}"#, "nope", 0.05).is_err());
    }
}
