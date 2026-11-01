//! 방 목록: 방 코드("ABCD") → 방 손잡이.
//! 여러 연결이 동시에 읽고 쓰므로 `Arc<Mutex<…>>`로 감싼다.
//! (잠그는 시간이 아주 짧고 그 안에서 `.await`를 하지 않으므로 표준 `Mutex`로 충분하다.)

use std::collections::HashMap;
use std::sync::{Arc, Mutex};

use rand::RngExt;
use sqlx::PgPool;

use crate::error::AppError;
use crate::room::{self, RoomHandle};

/// 서버 하나에 동시에 열 수 있는 방 수(장난으로 방을 수없이 만드는 것을 막는다).
pub const MAX_ROOMS: usize = 100;

#[derive(Clone, Default)]
pub struct Rooms {
    inner: Arc<Mutex<HashMap<String, RoomHandle>>>,
}

impl Rooms {
    /// 새 방을 만들고 게임 루프(액터)를 띄운다. 방이 비어서 닫히면 목록에서도 지운다.
    pub fn create(&self, db: Option<PgPool>) -> Result<RoomHandle, AppError> {
        let mut rooms = self.inner.lock().expect("방 목록 잠금");
        if rooms.len() >= MAX_ROOMS {
            return Err(AppError::TooManyRooms);
        }
        // 이미 있는 코드와 겹치면 다시 뽑는다(26⁴ = 456,976가지라 거의 안 겹친다).
        let code = loop {
            let candidate = random_code();
            if !rooms.contains_key(&candidate) {
                break candidate;
            }
        };

        let (handle, actor) = room::new_room(code.clone(), rand::random(), db);
        rooms.insert(code.clone(), handle.clone());

        let guard = RemoveOnDrop {
            rooms: self.clone(),
            code,
        };
        tokio::spawn(async move {
            let _guard = guard; // 이 작업이 끝날 때(정상 종료든 panic이든) 같이 사라지며 방을 지운다
            actor.run().await;
        });
        Ok(handle)
    }

    /// 코드로 방을 찾는다. 소문자로 입력해도 찾을 수 있다.
    pub fn get(&self, code: &str) -> Option<RoomHandle> {
        let rooms = self.inner.lock().expect("방 목록 잠금");
        rooms.get(&code.to_ascii_uppercase()).cloned()
    }

    fn remove(&self, code: &str) {
        // Drop 안에서 불리므로 여기서 panic하면 안 된다. 잠금이 망가졌으면(poisoned) 그냥 넘어간다.
        if let Ok(mut rooms) = self.inner.lock() {
            rooms.remove(code);
        }
    }
}

/// 방 작업이 어떻게 끝나든 목록에서 방을 지우는 "경비원".
/// 값이 사라질 때 Rust가 반드시 `drop`을 불러 준다. 작업이 panic으로 풀릴 때(unwind)도 마찬가지다.
/// 그래서 액터에 버그가 있어도 목록에 죽은 방(코드는 있는데 아무도 답하지 않는 방)이 남지 않는다.
struct RemoveOnDrop {
    rooms: Rooms,
    code: String,
}

impl Drop for RemoveOnDrop {
    fn drop(&mut self) {
        self.rooms.remove(&self.code);
    }
}

/// 영문 대문자 4자. 예) "QWER"
fn random_code() -> String {
    let mut rng = rand::rng();
    (0..4)
        .map(|_| char::from(rng.random_range(b'A'..=b'Z')))
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn codes_are_four_uppercase_letters() {
        for _ in 0..100 {
            let code = random_code();
            assert_eq!(code.len(), 4);
            assert!(code.chars().all(|c| c.is_ascii_uppercase()), "{code}");
        }
    }

    #[tokio::test]
    async fn rooms_are_found_case_insensitively_and_limited() {
        let rooms = Rooms::default();
        let room = rooms.create(None).unwrap();
        assert!(rooms.get(&room.code.to_lowercase()).is_some());
        assert!(rooms.get("1234").is_none());

        for _ in 1..MAX_ROOMS {
            rooms.create(None).unwrap();
        }
        assert!(matches!(rooms.create(None), Err(AppError::TooManyRooms)));
    }

    #[tokio::test(start_paused = true)]
    async fn empty_room_is_removed_after_timeout() {
        // start_paused: tokio의 시계를 멈춰 두고 필요한 만큼 "빨리 감기"한다(진짜로 60초 기다리지 않는다).
        let rooms = Rooms::default();
        let code = rooms.create(None).unwrap().code;

        tokio::time::sleep(std::time::Duration::from_secs(30)).await;
        assert!(rooms.get(&code).is_some(), "30초에는 아직 있다");

        tokio::time::sleep(std::time::Duration::from_secs(31)).await;
        assert!(rooms.get(&code).is_none(), "60초가 지나면 정리된다");
    }

    #[tokio::test]
    async fn room_is_removed_even_if_its_task_panics() {
        // 액터 대신 일부러 panic하는 작업에 같은 경비원을 들려 보낸다.
        // (테스트 출력에 panic 메시지가 보이는 것은 정상이다.)
        let rooms = Rooms::default();
        let (handle, _actor) = room::new_room("BOOM".to_string(), 1, None);
        rooms
            .inner
            .lock()
            .unwrap()
            .insert("BOOM".to_string(), handle);
        let guard = RemoveOnDrop {
            rooms: rooms.clone(),
            code: "BOOM".to_string(),
        };

        let task = tokio::spawn(async move {
            let _guard = guard;
            panic!("액터 안에서 버그가 났다고 치자");
        });
        assert!(task.await.unwrap_err().is_panic());
        assert!(
            rooms.get("BOOM").is_none(),
            "panic이 나도 목록에서 지워진다"
        );
    }

    #[tokio::test(start_paused = true)]
    async fn room_with_a_connection_is_kept() {
        let rooms = Rooms::default();
        let room = rooms.create(None).unwrap();
        let _host = room.subscribe(); // 연결 하나가 붙어 있는 것과 같다

        tokio::time::sleep(std::time::Duration::from_secs(120)).await;
        assert!(rooms.get(&room.code).is_some());
    }
}
