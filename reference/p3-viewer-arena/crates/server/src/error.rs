//! HTTP 오류를 한 타입으로 모은다.
//! 핸들러가 `Result<_, AppError>`를 돌려주면, axum이 `into_response`로 JSON 응답을 만든다.
//! 응답 모양: `{"code":"room_not_found","message":"…"}`

use axum::Json;
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use serde::Serialize;

#[derive(Debug)]
pub enum AppError {
    RoomNotFound,
    TooManyRooms,
    Database(sqlx::Error),
}

// `?`가 sqlx 오류를 AppError로 바꿔 줄 수 있게 한다.
impl From<sqlx::Error> for AppError {
    fn from(error: sqlx::Error) -> AppError {
        AppError::Database(error)
    }
}

#[derive(Serialize)]
struct ErrorBody {
    code: &'static str,
    message: &'static str,
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, code, message) = match self {
            AppError::RoomNotFound => (
                StatusCode::NOT_FOUND,
                "room_not_found",
                "방을 찾을 수 없어요. 방 코드를 확인해 주세요.",
            ),
            AppError::TooManyRooms => (
                StatusCode::SERVICE_UNAVAILABLE,
                "too_many_rooms",
                "지금은 방을 더 만들 수 없어요. 잠시 후 다시 시도해 주세요.",
            ),
            AppError::Database(error) => {
                // 자세한 내용은 서버 로그에만 남기고, 사용자에게는 짧게 알린다.
                tracing::error!(%error, "DB 오류");
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "database",
                    "랭킹을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.",
                )
            }
        };
        (status, Json(ErrorBody { code, message })).into_response()
    }
}
