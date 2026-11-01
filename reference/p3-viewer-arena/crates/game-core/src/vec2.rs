//! 2차원 벡터. 위치·속도·방향을 모두 이 타입 하나로 나타낸다.

use std::ops::{Add, AddAssign, Mul, Sub, SubAssign};

/// (x, y) 한 쌍. `Copy`라서 함수에 넘겨도 원래 값이 그대로 남는다(정수처럼 복사된다).
#[derive(Debug, Clone, Copy, PartialEq, Default)]
pub struct Vec2 {
    pub x: f32,
    pub y: f32,
}

impl Vec2 {
    pub const ZERO: Vec2 = Vec2 { x: 0.0, y: 0.0 };

    pub const fn new(x: f32, y: f32) -> Vec2 {
        Vec2 { x, y }
    }

    /// 길이의 제곱. 제곱근을 안 써서 빠르고, 거리 비교에는 이것으로 충분하다.
    pub fn length_squared(self) -> f32 {
        self.x * self.x + self.y * self.y
    }

    /// 길이(크기) = √(x² + y²)
    pub fn length(self) -> f32 {
        self.length_squared().sqrt()
    }

    /// 내적. 두 벡터가 같은 방향이면 양수, 반대면 음수, 직각이면 0.
    pub fn dot(self, other: Vec2) -> f32 {
        self.x * other.x + self.y * other.y
    }

    /// 두 점 사이의 거리.
    pub fn distance(self, other: Vec2) -> f32 {
        (self - other).length()
    }

    /// 방향만 남기고 길이를 1로 만든다(정규화). 길이가 0이면 방향이 없으므로 0을 돌려준다.
    pub fn normalize(self) -> Vec2 {
        let len = self.length();
        if len == 0.0 {
            return Vec2::ZERO; // 0으로 나누면 NaN이 된다 → 먼저 걸러 낸다
        }
        Vec2::new(self.x / len, self.y / len)
    }

    /// 길이가 `max`보다 길면 `max`로 줄인다. 짧으면 그대로 둔다.
    pub fn clamp_length(self, max: f32) -> Vec2 {
        if self.length_squared() > max * max {
            self.normalize() * max
        } else {
            self
        }
    }
}

// 연산자 오버로딩: `a + b`, `a - b`, `v * 2.0`처럼 쓸 수 있게 한다.
impl Add for Vec2 {
    type Output = Vec2;
    fn add(self, other: Vec2) -> Vec2 {
        Vec2::new(self.x + other.x, self.y + other.y)
    }
}

impl Sub for Vec2 {
    type Output = Vec2;
    fn sub(self, other: Vec2) -> Vec2 {
        Vec2::new(self.x - other.x, self.y - other.y)
    }
}

impl Mul<f32> for Vec2 {
    type Output = Vec2;
    fn mul(self, k: f32) -> Vec2 {
        Vec2::new(self.x * k, self.y * k)
    }
}

impl AddAssign for Vec2 {
    fn add_assign(&mut self, other: Vec2) {
        *self = *self + other;
    }
}

impl SubAssign for Vec2 {
    fn sub_assign(&mut self, other: Vec2) {
        *self = *self - other;
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn vec2_ops() {
        let a = Vec2::new(3.0, 4.0);
        let b = Vec2::new(1.0, -2.0);

        assert_eq!(a + b, Vec2::new(4.0, 2.0));
        assert_eq!(a - b, Vec2::new(2.0, 6.0));
        assert_eq!(a * 2.0, Vec2::new(6.0, 8.0));
        assert_eq!(a.length(), 5.0);
        assert_eq!(a.length_squared(), 25.0);
        assert_eq!(a.dot(b), 3.0 - 8.0);
        assert_eq!(a.distance(Vec2::ZERO), 5.0);

        let mut c = a;
        c += b;
        assert_eq!(c, Vec2::new(4.0, 2.0));
        c -= b;
        assert_eq!(c, a);

        assert_eq!(a.normalize(), Vec2::new(0.6, 0.8));
        assert_eq!(a.clamp_length(10.0), a, "짧으면 그대로");
        assert_eq!(a.clamp_length(1.0), Vec2::new(0.6, 0.8), "길면 줄인다");
    }

    #[test]
    fn normalize_zero_is_zero() {
        assert_eq!(Vec2::ZERO.normalize(), Vec2::ZERO);
        assert_eq!(Vec2::ZERO.clamp_length(1.0), Vec2::ZERO);
    }
}
