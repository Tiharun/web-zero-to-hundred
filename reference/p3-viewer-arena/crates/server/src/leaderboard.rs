//! 랭킹: 경기 결과 저장과 조회(SQL).
//!
//! SQLx 런타임 쿼리를 쓴다: SQL은 평범한 문자열이고, 값은 `$1`, `$2` 자리에 `.bind()`로 넣는다.
//! (값을 문자열에 직접 이어 붙이지 않으므로 SQL 인젝션이 생기지 않는다.)

use game_core::protocol::RankEntry;
use serde::{Deserialize, Serialize};
use sqlx::PgPool;

/// 랭킹 기간. `day` = 최근 24시간, `all` = 전체.
#[derive(Debug, Clone, Copy, Default, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Period {
    #[default]
    Day,
    All,
}

impl Period {
    fn as_str(self) -> &'static str {
        match self {
            Period::Day => "day",
            Period::All => "all",
        }
    }
}

/// 랭킹 한 줄: 닉네임과 그 기간의 최고 점수.
/// `FromRow`: SELECT 결과의 열 이름(name, score)을 같은 이름의 필드에 넣어 준다.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, sqlx::FromRow)]
pub struct LeaderEntry {
    pub name: String,
    pub score: i32,
}

/// 라운드 한 판의 결과를 저장한다. 트랜잭션이라 전부 저장되거나 하나도 저장되지 않는다.
pub async fn save_result(
    pool: &PgPool,
    room_code: &str,
    ranking: &[RankEntry],
) -> Result<(), sqlx::Error> {
    let mut tx = pool.begin().await?;

    let match_id: i64 =
        sqlx::query_scalar("INSERT INTO matches (room_code) VALUES ($1) RETURNING id")
            .bind(room_code)
            .fetch_one(&mut *tx)
            .await?;

    for (index, entry) in ranking.iter().enumerate() {
        // PostgreSQL에는 부호 없는 정수가 없다 → u32 점수를 i32로 바꿔서 넣는다.
        let score = i32::try_from(entry.score).unwrap_or(i32::MAX);
        sqlx::query(
            "INSERT INTO match_scores (match_id, place, player_name, score) VALUES ($1, $2, $3, $4)",
        )
        .bind(match_id)
        .bind(index as i32 + 1) // 1등부터
        .bind(&entry.name)
        .bind(score)
        .execute(&mut *tx)
        .await?;
    }

    tx.commit().await
}

/// 기간 안에서 닉네임별 최고 점수 상위 `limit`명.
pub async fn top(
    pool: &PgPool,
    period: Period,
    limit: i64,
) -> Result<Vec<LeaderEntry>, sqlx::Error> {
    sqlx::query_as::<_, LeaderEntry>(
        "SELECT s.player_name AS name, MAX(s.score) AS score
         FROM match_scores s
         JOIN matches m ON m.id = s.match_id
         WHERE $1::text = 'all' OR m.ended_at >= now() - INTERVAL '1 day'
         GROUP BY s.player_name
         ORDER BY score DESC, name
         LIMIT $2",
    )
    .bind(period.as_str())
    .bind(limit)
    .fetch_all(pool)
    .await
}
