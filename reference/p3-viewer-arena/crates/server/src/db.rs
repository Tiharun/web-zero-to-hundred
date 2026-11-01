//! PostgreSQL 연결 풀과 마이그레이션.

use std::time::Duration;

use sqlx::PgPool;
use sqlx::postgres::PgPoolOptions;

/// 연결 풀을 만들고, 아직 실행하지 않은 마이그레이션(`migrations/*.sql`)을 실행한다.
pub async fn connect(database_url: &str) -> Result<PgPool, sqlx::Error> {
    // 풀(pool): 연결 몇 개를 미리 열어 두고 돌려 쓴다. 요청마다 새로 연결하는 것보다 빠르다.
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .acquire_timeout(Duration::from_secs(5))
        .connect(database_url)
        .await?;

    // migrate!는 컴파일할 때 SQL 파일을 실행 파일 안에 넣어 둔다(DB 접속은 필요 없다).
    // 실행한 기록은 DB의 _sqlx_migrations 표에 남아서, 같은 파일을 두 번 실행하지 않는다.
    sqlx::migrate!("./migrations").run(&pool).await?;
    Ok(pool)
}
