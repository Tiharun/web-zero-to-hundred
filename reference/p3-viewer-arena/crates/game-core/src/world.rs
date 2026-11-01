//! 게임 세계 하나(방 하나). 서버의 방 액터가 `World`를 소유하고 틱마다 `step`을 부른다.
//!
//! 결정성: 같은 시드와 같은 입력을 주면 언제 실행해도 결과가 똑같다.
//! 그래서 무작위 값도 시드 기반 난수(`StdRng`)로만 만든다.

use rand::rngs::StdRng;
use rand::{RngExt, SeedableRng};
use serde::{Deserialize, Serialize};

use crate::physics::{self, Body, Input};
use crate::protocol::{ItemState, PlayerState, RankEntry, Snapshot};
use crate::rules::{
    ARENA_RADIUS, ITEM_COUNT, ITEM_RADIUS, ITEM_SCORE, MAX_PLAYERS, PLAYER_COLORS, PLAYER_RADIUS,
    RESULT_SECS, ROUND_SECS, WAITING_SECS,
};
use crate::vec2::Vec2;

/// 플레이어 번호. 1부터 차례로 붙인다(0은 관전 화면용으로 비워 둔다).
pub type PlayerId = u32;

/// 라운드 상태 머신: 대기 → 진행 → 결과 → 대기 → …
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Phase {
    Waiting,
    Playing,
    Ended,
}

#[derive(Debug, Clone, PartialEq)]
pub struct Player {
    pub id: PlayerId,
    pub name: String,
    pub body: Body,
    /// 마지막으로 받은 입력. 새 입력이 올 때까지 계속 이 방향으로 움직인다.
    pub input: Input,
    pub score: u32,
    pub color: &'static str,
}

#[derive(Debug, Clone, PartialEq)]
pub struct Item {
    pub id: u32,
    pub pos: Vec2,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum JoinError {
    RoomFull,
}

#[derive(Debug)]
pub struct World {
    pub tick: u64,
    pub phase: Phase,
    /// 현재 단계가 끝날 때까지 남은 시간(초).
    pub time_left: f32,
    pub players: Vec<Player>,
    pub items: Vec<Item>,
    next_player_id: PlayerId,
    next_item_id: u32,
    rng: StdRng,
}

impl World {
    pub fn new(seed: u64) -> World {
        World {
            tick: 0,
            phase: Phase::Waiting,
            time_left: WAITING_SECS,
            players: Vec::new(),
            items: Vec::new(),
            next_player_id: 1,
            next_item_id: 1,
            rng: StdRng::seed_from_u64(seed),
        }
    }

    /// 플레이어를 추가하고 번호를 돌려준다. 방이 꽉 찼으면 오류.
    pub fn add_player(&mut self, name: String) -> Result<PlayerId, JoinError> {
        if self.players.len() >= MAX_PLAYERS {
            return Err(JoinError::RoomFull);
        }
        let id = self.next_player_id;
        self.next_player_id += 1;
        let pos = self.random_point(ARENA_RADIUS - PLAYER_RADIUS * 2.0);
        let color = PLAYER_COLORS[(id as usize - 1) % PLAYER_COLORS.len()];
        self.players.push(Player {
            id,
            name,
            body: Body {
                pos,
                vel: Vec2::ZERO,
            },
            input: Input::default(),
            score: 0,
            color,
        });
        Ok(id)
    }

    pub fn remove_player(&mut self, id: PlayerId) {
        self.players.retain(|p| p.id != id); // id가 다른 플레이어만 남긴다
    }

    /// 한 틱 진행한다. 이번 틱에 라운드가 끝났으면 순위를 돌려준다.
    pub fn step(&mut self, inputs: &[(PlayerId, Input)], dt: f32) -> Option<Vec<RankEntry>> {
        self.tick += 1;

        // 1) 입력 저장: 같은 플레이어가 여러 번 보냈으면 마지막 입력이 남는다.
        for &(id, input) in inputs {
            if let Some(player) = self.players.iter_mut().find(|p| p.id == id) {
                player.input = input;
            }
        }

        // 2) 이동 → 3) 서로 밀어내기 → 4) 아레나 안에 가두기
        for player in &mut self.players {
            physics::integrate(&mut player.body, player.input, dt);
        }
        self.separate_players();
        for player in &mut self.players {
            physics::keep_inside_arena(&mut player.body);
        }

        // 5) 아이템은 라운드 진행 중에만 먹을 수 있다.
        if self.phase == Phase::Playing {
            self.collect_items();
        }

        // 6) 시간이 흐르고, 때가 되면 다음 단계로 넘어간다.
        self.advance_phase(dt)
    }

    /// 점수 높은 순(같으면 먼저 들어온 순).
    pub fn ranking(&self) -> Vec<RankEntry> {
        let mut sorted: Vec<&Player> = self.players.iter().collect();
        // Reverse = 큰 점수가 앞으로. sort_by_key는 안정 정렬이라 점수가 같으면 들어온 순서가 남는다.
        sorted.sort_by_key(|p| std::cmp::Reverse(p.score));
        sorted
            .into_iter()
            .map(|p| RankEntry {
                name: p.name.clone(),
                score: p.score,
            })
            .collect()
    }

    /// 네트워크로 보낼 모양으로 바꾼다.
    pub fn snapshot(&self) -> Snapshot {
        Snapshot {
            tick: self.tick,
            phase: self.phase,
            time_left: self.time_left.max(0.0),
            players: self
                .players
                .iter()
                .map(|p| PlayerState {
                    id: p.id,
                    name: p.name.clone(),
                    x: p.body.pos.x,
                    y: p.body.pos.y,
                    vx: p.body.vel.x,
                    vy: p.body.vel.y,
                    score: p.score,
                    color: p.color.to_string(),
                })
                .collect(),
            items: self
                .items
                .iter()
                .map(|item| ItemState {
                    id: item.id,
                    x: item.pos.x,
                    y: item.pos.y,
                })
                .collect(),
        }
    }

    // ---------- step이 쓰는 작은 도우미들 ----------

    fn separate_players(&mut self) {
        let min_distance = PLAYER_RADIUS * 2.0;
        for i in 0..self.players.len() {
            for j in (i + 1)..self.players.len() {
                // Vec2는 Copy라서 값을 꺼내 계산한 뒤 다시 넣는다.
                // (두 플레이어를 동시에 &mut로 빌리지 않아도 되어서 빌림 검사기와 싸우지 않는다.)
                let (a, b) = physics::separate_circles(
                    self.players[i].body.pos,
                    self.players[j].body.pos,
                    min_distance,
                );
                self.players[i].body.pos = a;
                self.players[j].body.pos = b;
            }
        }
    }

    fn collect_items(&mut self) {
        for p in 0..self.players.len() {
            for k in 0..self.items.len() {
                let touching = physics::circles_overlap(
                    self.players[p].body.pos,
                    PLAYER_RADIUS,
                    self.items[k].pos,
                    ITEM_RADIUS,
                );
                if touching {
                    self.players[p].score += ITEM_SCORE;
                    let new_item = self.spawn_item(); // 먹은 자리 대신 새 위치에 새 아이템
                    self.items[k] = new_item;
                }
            }
        }
    }

    fn advance_phase(&mut self, dt: f32) -> Option<Vec<RankEntry>> {
        match self.phase {
            Phase::Waiting => {
                if self.players.is_empty() {
                    self.time_left = WAITING_SECS; // 아무도 없으면 시계를 멈춘다
                    return None;
                }
                self.time_left -= dt;
                if self.time_left <= 0.0 {
                    self.start_round();
                }
                None
            }
            Phase::Playing => {
                self.time_left -= dt;
                if self.time_left <= 0.0 {
                    self.phase = Phase::Ended;
                    self.time_left = RESULT_SECS;
                    self.items.clear();
                    return Some(self.ranking());
                }
                None
            }
            Phase::Ended => {
                self.time_left -= dt;
                if self.time_left <= 0.0 {
                    self.phase = Phase::Waiting;
                    self.time_left = WAITING_SECS;
                }
                None
            }
        }
    }

    fn start_round(&mut self) {
        self.phase = Phase::Playing;
        self.time_left = ROUND_SECS;
        for player in &mut self.players {
            player.score = 0;
        }
        self.items.clear();
        for _ in 0..ITEM_COUNT {
            let item = self.spawn_item();
            self.items.push(item);
        }
    }

    fn spawn_item(&mut self) -> Item {
        let id = self.next_item_id;
        self.next_item_id += 1;
        let pos = self.random_point(ARENA_RADIUS - ITEM_RADIUS * 3.0);
        Item { id, pos }
    }

    /// 반지름 `max_radius`인 원 안의 무작위 점.
    /// 정사각형 안에서 점을 뽑고, 원 밖이면 다시 뽑는다(거절 샘플링: 삼각함수가 필요 없다).
    fn random_point(&mut self, max_radius: f32) -> Vec2 {
        loop {
            let x = self.rng.random_range(-max_radius..=max_radius);
            let y = self.rng.random_range(-max_radius..=max_radius);
            let point = Vec2::new(x, y);
            if point.length_squared() <= max_radius * max_radius {
                return point;
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::rules::TICK_DT;

    /// `secs`초 동안 같은 입력으로 틱을 돌린다. 그동안 나온 라운드 결과를 모아 돌려준다.
    fn run(world: &mut World, secs: f32, inputs: &[(PlayerId, Input)]) -> Vec<Vec<RankEntry>> {
        let mut results = Vec::new();
        let ticks = (secs / TICK_DT).round() as u32;
        for _ in 0..ticks {
            if let Some(ranking) = world.step(inputs, TICK_DT) {
                results.push(ranking);
            }
        }
        results
    }

    #[test]
    fn player_stays_inside_arena() {
        let mut world = World::new(1);
        let id = world.add_player("벽돌이".to_string()).unwrap();
        let right = [(id, Input::new(1.0, 0.0))];
        for _ in 0..600 {
            world.step(&right, TICK_DT);
            let pos = world.players[0].body.pos;
            assert!(
                pos.length() <= ARENA_RADIUS - PLAYER_RADIUS + 1e-3,
                "아레나 밖: {pos:?}"
            );
        }
        let pos = world.players[0].body.pos;
        assert!(
            pos.length() > ARENA_RADIUS - PLAYER_RADIUS - 1.0,
            "가장자리까지는 간다"
        );
    }

    #[test]
    fn players_push_each_other_apart() {
        let mut world = World::new(1);
        world.add_player("하나".to_string()).unwrap();
        world.add_player("둘".to_string()).unwrap();
        world.players[0].body.pos = Vec2::new(0.0, 0.0);
        world.players[1].body.pos = Vec2::new(5.0, 0.0);
        world.step(&[], TICK_DT);
        let distance = world.players[0]
            .body
            .pos
            .distance(world.players[1].body.pos);
        assert!(distance >= PLAYER_RADIUS * 2.0 - 1e-3);
    }

    #[test]
    fn item_pickup_scores() {
        let mut world = World::new(1);
        let id = world.add_player("먹보".to_string()).unwrap();
        let here = world.players[0].body.pos;

        // 대기 중에는 아이템이 없고 점수도 없다
        assert!(world.items.is_empty());

        world.phase = Phase::Playing;
        world.time_left = ROUND_SECS;
        world.items = vec![Item { id: 99, pos: here }];
        world.step(&[(id, Input::default())], TICK_DT);

        assert_eq!(world.players[0].score, ITEM_SCORE);
        assert_eq!(world.items.len(), 1, "먹은 아이템은 다른 곳에 다시 생긴다");
        assert_ne!(world.items[0].pos, here);
        assert_ne!(world.items[0].id, 99, "새 아이템은 새 번호");
    }

    #[test]
    fn phase_transitions_waiting_playing_ended() {
        let mut world = World::new(7);
        assert_eq!(world.phase, Phase::Waiting);

        // 아무도 없으면 대기 시간이 줄지 않는다
        run(&mut world, 30.0, &[]);
        assert_eq!(world.phase, Phase::Waiting);
        assert_eq!(world.time_left, WAITING_SECS);

        let id = world.add_player("철수".to_string()).unwrap();
        world.players[0].score = 5; // 지난 판 점수는 새 라운드에서 지워진다
        run(&mut world, WAITING_SECS - 1.0, &[]);
        assert_eq!(world.phase, Phase::Waiting);
        run(&mut world, 1.1, &[]);
        assert_eq!(world.phase, Phase::Playing);
        assert_eq!(world.players[0].score, 0);
        assert_eq!(world.items.len(), ITEM_COUNT);

        let results = run(&mut world, ROUND_SECS, &[(id, Input::new(0.3, 0.7))]);
        assert_eq!(world.phase, Phase::Ended);
        assert_eq!(results.len(), 1, "라운드가 끝날 때 결과는 딱 한 번");
        assert_eq!(results[0][0].name, "철수");
        assert!(world.items.is_empty());

        run(&mut world, RESULT_SECS + 0.1, &[]);
        assert_eq!(world.phase, Phase::Waiting);
        assert_eq!(world.snapshot().phase, Phase::Waiting);
    }

    #[test]
    fn room_is_full_at_max_players() {
        let mut world = World::new(1);
        for i in 0..MAX_PLAYERS {
            world.add_player(format!("p{i}")).unwrap();
        }
        assert_eq!(
            world.add_player("하나 더".to_string()),
            Err(JoinError::RoomFull)
        );

        world.remove_player(1);
        assert_eq!(world.players.len(), MAX_PLAYERS - 1);
        let id = world.add_player("하나 더".to_string()).unwrap();
        assert_eq!(id, MAX_PLAYERS as u32 + 1, "번호는 다시 쓰지 않는다");
    }

    #[test]
    fn ranking_sorts_by_score_then_join_order() {
        let mut world = World::new(1);
        for name in ["가", "나", "다"] {
            world.add_player(name.to_string()).unwrap();
        }
        world.players[0].score = 1;
        world.players[1].score = 3;
        world.players[2].score = 1;
        let names: Vec<_> = world.ranking().into_iter().map(|r| r.name).collect();
        assert_eq!(names, ["나", "가", "다"]);
    }

    #[test]
    fn step_is_deterministic() {
        // 같은 시드 + 같은 입력이면 몇천 틱 뒤에도 완전히 같다
        let play = |seed: u64| {
            let mut world = World::new(seed);
            let a = world.add_player("가".to_string()).unwrap();
            let b = world.add_player("나".to_string()).unwrap();
            for tick in 0..2000u32 {
                let t = tick as f32 * 0.01;
                let inputs = [
                    (a, Input::new(1.0 - t % 2.0, 0.5)),
                    (b, Input::new(-0.5, t % 1.0 - 0.5)),
                ];
                world.step(&inputs, TICK_DT);
            }
            world.snapshot()
        };
        let first = play(42);
        assert_eq!(first, play(42));
        assert_eq!(
            first.phase,
            Phase::Playing,
            "2000틱 = 100초 → 라운드 진행 중"
        );
        assert_ne!(
            first.items,
            play(43).items,
            "시드가 다르면 아이템 위치가 다르다"
        );
    }

    #[test]
    fn snapshot_has_players_and_items() {
        let mut world = World::new(3);
        let id = world.add_player("영희".to_string()).unwrap();
        let snap = world.snapshot();
        assert_eq!(snap.players.len(), 1);
        assert_eq!(snap.players[0].id, id);
        assert_eq!(snap.players[0].name, "영희");
        assert_eq!(snap.players[0].color, PLAYER_COLORS[0]);
        assert_eq!(snap.time_left, WAITING_SECS);
    }
}
