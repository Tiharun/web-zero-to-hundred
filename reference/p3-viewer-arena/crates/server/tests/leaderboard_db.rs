//! 랭킹 SQL 통합 테스트(진짜 PostgreSQL이 필요하다).
//! TEST_DATABASE_URL이 없으면 아무것도 하지 않고 통과한다.
//!
//! 실행(PowerShell):
//!   $env:TEST_DATABASE_URL="postgres://arena:arena@127.0.0.1:5432/viewer_arena_test"
//!   cargo test -p server --test leaderboard_db

use std::time::{SystemTime, UNIX_EPOCH};

use game_core::protocol::RankEntry;
use server::app::{AppState, router};
use server::db;
use server::leaderboard::{self, LeaderEntry, Period};
use sqlx::PgPool;
use tokio::net::TcpListener;

async fn test_pool() -> Option<PgPool> {
    let Ok(url) = std::env::var("TEST_DATABASE_URL") else {
        eprintln!("TEST_DATABASE_URL이 없어서 DB 테스트를 건너뛰어요.");
        return None;
    };
    Some(
        db::connect(&url)
            .await
            .expect("테스트 DB에 연결(마이그레이션 포함)"),
    )
}

/// 다른 실행과 섞이지 않게 붙이는 꼬리표. 예) "#48213"
fn unique_tag() -> String {
    let nanos = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .subsec_nanos();
    format!("#{}", nanos % 100_000)
}

fn entry(name: &str, score: u32) -> RankEntry {
    RankEntry {
        name: name.to_string(),
        score,
    }
}

#[tokio::test]
async fn results_are_saved_and_ranked_by_best_score() {
    let Some(pool) = test_pool().await else {
        return;
    };
    let tag = unique_tag();
    let room = format!("T{tag}");
    let (a, b, c) = (format!("가{tag}"), format!("나{tag}"), format!("다{tag}"));

    leaderboard::save_result(&pool, &room, &[entry(&a, 7), entry(&b, 3)])
        .await
        .unwrap();
    leaderboard::save_result(&pool, &room, &[entry(&b, 9), entry(&a, 2)])
        .await
        .unwrap();
    leaderboard::save_result(&pool, &room, &[entry(&c, 100)])
        .await
        .unwrap();
    // c의 경기를 이틀 전으로 옮긴다 → "최근 24시간"에서는 빠져야 한다
    sqlx::query(
        "UPDATE matches SET ended_at = now() - INTERVAL '2 days'
         WHERE id IN (SELECT match_id FROM match_scores WHERE player_name = $1)",
    )
    .bind(&c)
    .execute(&pool)
    .await
    .unwrap();

    let mine = |entries: Vec<LeaderEntry>| -> Vec<(String, i32)> {
        entries
            .into_iter()
            .filter(|e| e.name.ends_with(&tag))
            .map(|e| (e.name, e.score))
            .collect()
    };

    // 닉네임별 최고 점수, 높은 순
    let day = leaderboard::top(&pool, Period::Day, 1000).await.unwrap();
    assert_eq!(mine(day), vec![(b.clone(), 9), (a.clone(), 7)]);

    let all = leaderboard::top(&pool, Period::All, 1000).await.unwrap();
    assert_eq!(
        mine(all),
        vec![(c.clone(), 100), (b.clone(), 9), (a.clone(), 7)]
    );

    // 같은 경기의 순위(place)도 저장된다
    let places: Vec<(String, i32)> = sqlx::query_as(
        "SELECT s.player_name, s.place FROM match_scores s JOIN matches m ON m.id = s.match_id
         WHERE m.room_code = $1 ORDER BY m.id, s.place",
    )
    .bind(&room)
    .fetch_all(&pool)
    .await
    .unwrap();
    assert_eq!(places[0], (a.clone(), 1));
    assert_eq!(places[1], (b.clone(), 2));

    // 뒷정리: matches를 지우면 ON DELETE CASCADE로 match_scores도 지워진다
    sqlx::query("DELETE FROM matches WHERE room_code = $1")
        .bind(&room)
        .execute(&pool)
        .await
        .unwrap();
}

#[tokio::test]
async fn leaderboard_route_is_enabled_with_database() {
    let Some(pool) = test_pool().await else {
        return;
    };
    let tag = unique_tag();
    let room = format!("H{tag}");
    let name = format!("랭커{tag}");
    leaderboard::save_result(&pool, &room, &[entry(&name, 5)])
        .await
        .unwrap();

    let app = router(
        AppState::new(Some(pool.clone())),
        std::path::Path::new("none"),
    );
    let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
    let addr = listener.local_addr().unwrap();
    tokio::spawn(async move { axum::serve(listener, app).await.unwrap() });

    let body: serde_json::Value = reqwest::get(format!("http://{addr}/api/leaderboard?period=all"))
        .await
        .unwrap()
        .json()
        .await
        .unwrap();
    assert_eq!(body["enabled"], true);
    assert_eq!(body["period"], "all");
    let entries = body["entries"].as_array().unwrap();
    assert!(entries.len() <= 10, "상위 10명까지만");
    assert!(entries.contains(&serde_json::json!({ "name": name, "score": 5 })));

    sqlx::query("DELETE FROM matches WHERE room_code = $1")
        .bind(&room)
        .execute(&pool)
        .await
        .unwrap();
}
