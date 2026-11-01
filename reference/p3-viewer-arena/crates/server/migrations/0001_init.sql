-- 첫 마이그레이션: 경기 결과를 저장하는 표 두 개.
-- 서버가 시작할 때 sqlx가 자동으로 한 번만 실행한다(기록: _sqlx_migrations 표).
-- PostgreSQL 16·18 모두에서 동작한다.

-- 경기(라운드) 한 판
CREATE TABLE matches (
    id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- 자동으로 1, 2, 3 …
    room_code TEXT        NOT NULL,
    ended_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 경기마다 플레이어 한 명의 순위와 점수
CREATE TABLE match_scores (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    match_id    BIGINT  NOT NULL REFERENCES matches (id) ON DELETE CASCADE,
    place       INTEGER NOT NULL,                     -- 1 = 1등
    player_name TEXT    NOT NULL,
    score       INTEGER NOT NULL CHECK (score >= 0)
);

-- 랭킹 조회(JOIN, 기간 조건)를 빠르게
CREATE INDEX match_scores_match_id_idx ON match_scores (match_id);
CREATE INDEX matches_ended_at_idx ON matches (ended_at);
