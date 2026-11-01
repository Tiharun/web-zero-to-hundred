//! 라우터와 HTTP 핸들러. 서버의 "주소표"가 이 파일 하나에 다 있다.
//!
//! | 메서드·경로                              | 하는 일 |
//! |------------------------------------------|---------|
//! | `GET  /healthz`                          | 살아 있으면 `ok` |
//! | `POST /api/rooms`                        | 방 만들기 → `{code}` |
//! | `GET  /api/rooms/{code}`                 | 방 상태 → `{code, players, phase}` |
//! | `GET  /api/leaderboard?period=day\|all`  | 랭킹 |
//! | `GET  /ws/{code}?role=host\|player`      | WebSocket |
//! | 그 밖                                    | `client/dist`의 파일(index.html, host.html, play.html …) |

use std::path::Path;

use axum::extract::{Path as UrlPath, Query, State};
use axum::http::StatusCode;
use axum::routing::{any, get, post};
use axum::{Json, Router};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use tower_http::services::ServeDir;

use crate::error::AppError;
use crate::leaderboard::{self, LeaderEntry, Period};
use crate::room::RoomInfo;
use crate::rooms::Rooms;
use crate::ws;

/// 모든 핸들러가 같이 쓰는 상태. 복제가 싸다(안쪽이 Arc·풀이라서).
#[derive(Clone)]
pub struct AppState {
    pub rooms: Rooms,
    /// None이면 랭킹이 꺼진 상태(DATABASE_URL 없음)
    pub db: Option<PgPool>,
}

impl AppState {
    pub fn new(db: Option<PgPool>) -> AppState {
        AppState {
            rooms: Rooms::default(),
            db,
        }
    }
}

pub fn router(state: AppState, static_dir: &Path) -> Router {
    Router::new()
        .route("/healthz", get(healthz))
        .route("/api/rooms", post(create_room))
        .route("/api/rooms/{code}", get(room_info))
        .route("/api/leaderboard", get(get_leaderboard))
        .route("/ws/{code}", any(ws::ws_handler))
        // 위 경로가 아니면 정적 파일을 준다("/"는 index.html).
        .fallback_service(ServeDir::new(static_dir))
        .with_state(state)
}

async fn healthz() -> &'static str {
    "ok"
}

#[derive(Serialize)]
struct CreatedRoom {
    code: String,
}

async fn create_room(
    State(state): State<AppState>,
) -> Result<(StatusCode, Json<CreatedRoom>), AppError> {
    let room = state.rooms.create(state.db.clone())?;
    Ok((StatusCode::CREATED, Json(CreatedRoom { code: room.code })))
}

async fn room_info(
    UrlPath(code): UrlPath<String>,
    State(state): State<AppState>,
) -> Result<Json<RoomInfo>, AppError> {
    let room = state.rooms.get(&code).ok_or(AppError::RoomNotFound)?;
    let info = room.info().await.ok_or(AppError::RoomNotFound)?;
    Ok(Json(info))
}

#[derive(Deserialize)]
struct LeaderboardParams {
    #[serde(default)] // ?period= 를 안 주면 Period::default() = day
    period: Period,
}

#[derive(Serialize)]
struct LeaderboardResponse {
    enabled: bool,
    period: Period,
    entries: Vec<LeaderEntry>,
}

async fn get_leaderboard(
    Query(params): Query<LeaderboardParams>,
    State(state): State<AppState>,
) -> Result<Json<LeaderboardResponse>, AppError> {
    let entries = match &state.db {
        Some(pool) => leaderboard::top(pool, params.period, 10).await?,
        None => Vec::new(), // 랭킹이 꺼져 있으면 빈 목록
    };
    Ok(Json(LeaderboardResponse {
        enabled: state.db.is_some(),
        period: params.period,
        entries,
    }))
}
