//! 이동과 충돌. 서버(World)와 브라우저 예측(game-wasm)이 똑같은 함수를 쓴다.
//!
//! 결정성을 위해 사칙연산과 제곱근만 쓴다(sin·cos·exp 없음).
//! 이 연산들은 IEEE 754가 결과를 정확히 정해 두어서, 네이티브와 wasm32에서 같은 값이 나온다.

use crate::rules::{ARENA_RADIUS, PLAYER_ACCEL, PLAYER_FRICTION, PLAYER_MAX_SPEED, PLAYER_RADIUS};
use crate::vec2::Vec2;

/// 플레이어의 조작 입력(조이스틱 방향).
/// 필드가 비공개라서 `Input::new`를 거쳐야만 만들 수 있다 → 항상 "길이 ≤ 1"이 보장된다.
#[derive(Debug, Clone, Copy, PartialEq, Default)]
pub struct Input {
    dir: Vec2,
}

impl Input {
    /// 클라이언트가 보낸 값을 믿지 않는다.
    /// NaN·무한대는 0으로, 길이가 1보다 길면 1로 줄인다(속도 치트 방지).
    pub fn new(dx: f32, dy: f32) -> Input {
        if !dx.is_finite() || !dy.is_finite() {
            return Input::default();
        }
        Input {
            dir: Vec2::new(dx, dy).clamp_length(1.0),
        }
    }

    pub fn dir(self) -> Vec2 {
        self.dir
    }
}

/// 움직이는 원 하나(플레이어의 몸): 위치와 속도.
#[derive(Debug, Clone, Copy, PartialEq, Default)]
pub struct Body {
    pub pos: Vec2,
    pub vel: Vec2,
}

/// 한 번의 이동 계산: 가속 → 마찰 → 속도 제한 → 위치 이동.
pub fn integrate(body: &mut Body, input: Input, dt: f32) {
    // 1) 가속: 입력 방향으로 속도를 더한다.
    body.vel += input.dir() * (PLAYER_ACCEL * dt);
    // 2) 마찰: 속도를 조금씩 줄인다. 나눗셈 꼴이라 dt가 커도 속도 방향이 뒤집히지 않는다.
    body.vel = body.vel * (1.0 / (1.0 + PLAYER_FRICTION * dt));
    // 3) 속도 제한: 서버가 정한 최고 속도를 넘지 못한다.
    body.vel = body.vel.clamp_length(PLAYER_MAX_SPEED);
    // 4) 위치 = 위치 + 속도 × 시간
    body.pos += body.vel * dt;
}

/// 아레나 밖으로 나가지 않게 가장자리로 되돌리고, 바깥쪽으로 향하던 속도는 없앤다.
pub fn keep_inside_arena(body: &mut Body) {
    let max = ARENA_RADIUS - PLAYER_RADIUS; // 플레이어 중심이 갈 수 있는 최대 거리
    if body.pos.length() <= max {
        return;
    }
    let outward = body.pos.normalize(); // 중심에서 바깥쪽을 가리키는 단위 벡터
    body.pos = outward * max;
    // 속도 중 바깥쪽 성분만 없앤다. 벽을 따라 미끄러지는 성분은 남는다.
    let speed_out = body.vel.dot(outward);
    if speed_out > 0.0 {
        body.vel -= outward * speed_out;
    }
}

/// 플레이어 한 명의 한 틱: 이동한 뒤 아레나 안에 가둔다. 브라우저 예측도 이 함수를 쓴다.
pub fn move_body(body: &mut Body, input: Input, dt: f32) {
    integrate(body, input, dt);
    keep_inside_arena(body);
}

/// 두 원이 겹치는가? (중심 거리 < 반지름 합)
pub fn circles_overlap(a: Vec2, radius_a: f32, b: Vec2, radius_b: f32) -> bool {
    let sum = radius_a + radius_b;
    (b - a).length_squared() < sum * sum // 제곱끼리 비교하면 제곱근이 필요 없다
}

/// 겹친 두 원을 반씩 밀어내서, 중심 거리가 `min_distance`가 되게 한 새 위치를 돌려준다.
/// 겹치지 않았으면 그대로 돌려준다.
pub fn separate_circles(a: Vec2, b: Vec2, min_distance: f32) -> (Vec2, Vec2) {
    let delta = b - a;
    let distance = delta.length();
    if distance >= min_distance {
        return (a, b);
    }
    // 완전히 같은 위치면 방향을 알 수 없으니 x축 방향으로 가른다.
    let normal = if distance == 0.0 {
        Vec2::new(1.0, 0.0)
    } else {
        delta * (1.0 / distance)
    };
    let push = normal * ((min_distance - distance) / 2.0); // 겹친 만큼을 반씩 나눠 민다
    (a - push, b + push)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn circle_collision_separates() {
        let min = PLAYER_RADIUS * 2.0;
        let a = Vec2::new(0.0, 0.0);
        let b = Vec2::new(10.0, 0.0);
        assert!(circles_overlap(a, PLAYER_RADIUS, b, PLAYER_RADIUS));

        let (a2, b2) = separate_circles(a, b, min);
        assert!(
            (a2.distance(b2) - min).abs() < 1e-4,
            "밀어낸 뒤 거리 = 반지름 합"
        );
        assert_eq!(a2, Vec2::new(-15.0, 0.0), "반씩 밀린다");
        assert_eq!(b2, Vec2::new(25.0, 0.0));

        // 완전히 같은 위치여도 정해진 방향으로 갈라진다(0으로 나누지 않는다).
        let (c, d) = separate_circles(a, a, min);
        assert!((c.distance(d) - min).abs() < 1e-4);

        // 겹치지 않으면 그대로
        let far = Vec2::new(100.0, 0.0);
        assert!(!circles_overlap(a, PLAYER_RADIUS, far, PLAYER_RADIUS));
        assert_eq!(separate_circles(a, far, min), (a, far));
    }

    #[test]
    fn input_is_clamped_and_sanitized() {
        assert_eq!(Input::new(3.0, 4.0).dir(), Vec2::new(0.6, 0.8));
        assert_eq!(
            Input::new(0.5, 0.0).dir(),
            Vec2::new(0.5, 0.0),
            "1보다 짧으면 그대로(아날로그 조이스틱)"
        );
        assert_eq!(Input::new(f32::NAN, 1.0).dir(), Vec2::ZERO);
        assert_eq!(Input::new(f32::INFINITY, 0.0).dir(), Vec2::ZERO);
    }

    #[test]
    fn speed_never_exceeds_max() {
        let mut body = Body::default();
        for _ in 0..200 {
            integrate(&mut body, Input::new(1.0, 0.0), 0.05);
            assert!(body.vel.length() <= PLAYER_MAX_SPEED + 1e-3);
        }
        assert!(
            body.vel.x > PLAYER_MAX_SPEED * 0.9,
            "계속 누르면 최고 속도 근처까지 빨라진다"
        );

        // 손을 떼면 마찰로 멈춘다
        for _ in 0..100 {
            integrate(&mut body, Input::default(), 0.05);
        }
        assert!(body.vel.length() < 1.0);
    }

    #[test]
    fn max_speed_is_enforced_even_from_huge_velocity() {
        // 마찰만으로는 한 틱에 1000 → 769로밖에 안 줄어든다. 속도 제한이 있어야 300 이하가 된다.
        let mut body = Body {
            pos: Vec2::ZERO,
            vel: Vec2::new(1000.0, 0.0),
        };
        integrate(&mut body, Input::default(), 0.05);
        assert!(
            body.vel.length() <= PLAYER_MAX_SPEED + 1e-3,
            "{:?}",
            body.vel
        );

        let mut pushed = Body {
            pos: Vec2::ZERO,
            vel: Vec2::new(0.0, -5000.0),
        };
        integrate(&mut pushed, Input::new(0.0, -1.0), 0.05);
        assert!(
            pushed.vel.length() <= PLAYER_MAX_SPEED + 1e-3,
            "{:?}",
            pushed.vel
        );
    }

    #[test]
    fn keep_inside_arena_pulls_back_to_edge() {
        let mut body = Body {
            pos: Vec2::new(ARENA_RADIUS + 50.0, 0.0),
            vel: Vec2::new(100.0, 30.0),
        };
        keep_inside_arena(&mut body);
        assert!((body.pos.length() - (ARENA_RADIUS - PLAYER_RADIUS)).abs() < 1e-3);
        assert_eq!(
            body.vel,
            Vec2::new(0.0, 30.0),
            "바깥쪽 속도만 사라지고 옆 방향 속도는 남는다"
        );
    }
}
