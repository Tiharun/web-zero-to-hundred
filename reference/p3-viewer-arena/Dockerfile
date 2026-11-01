# 시청자 참여 아레나: 서버 실행 파일 + 빌드된 클라이언트를 이미지 하나에 담아요.
#
# 멀티스테이지 빌드: 앞 단계의 무거운 도구(Rust·Node)는 마지막 이미지에 들어가지 않아요.
#   ① wasm    : Rust game-wasm → WebAssembly + JS 바인딩
#   ② client  : Vite 빌드(①의 wasm 포함) → client/dist
#   ③ server  : Rust 서버 릴리스 빌드
#   ④ runtime : 작은 Debian 이미지에 ②와 ③의 결과만 복사
#
# 보통은 docker compose up --build 로 씁니다(docker-compose.yml).

# ---------- ① wasm ----------
FROM rust:1.99.1-slim-trixie AS wasm
RUN rustup target add wasm32-unknown-unknown \
 && cargo install wasm-bindgen-cli --version 0.2.130 --locked
WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY crates ./crates
RUN cargo build -p game-wasm --target wasm32-unknown-unknown --release --locked \
 && wasm-bindgen --target web --out-dir /wasm target/wasm32-unknown-unknown/release/game_wasm.wasm

# ---------- ② client ----------
FROM node:26.13.0-trixie-slim AS client
WORKDIR /app/client
# package*.json만 먼저 복사: 소스만 바뀌면 npm ci 층을 캐시에서 다시 써요.
COPY client/package.json client/package-lock.json ./
RUN npm ci
COPY client ./
COPY --from=wasm /wasm ./src/wasm
RUN npm run build

# ---------- ③ server ----------
FROM rust:1.99.1-slim-trixie AS server
WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY crates ./crates
RUN cargo build -p server --release --locked

# ---------- ④ runtime ----------
FROM debian:trixie-slim
# root가 아닌 사용자로 실행해요(컨테이너가 뚫려도 피해를 줄이려고).
RUN useradd --system --no-create-home arena
COPY --from=server /app/target/release/server /usr/local/bin/viewer-arena
COPY --from=client /app/client/dist /srv/client
# 컨테이너 안에서는 0.0.0.0으로 들어야 바깥(포트 연결)에서 들어올 수 있어요.
ENV HOST=0.0.0.0 \
    PORT=8080 \
    STATIC_DIR=/srv/client \
    RUST_LOG=info
EXPOSE 8080
USER arena
CMD ["viewer-arena"]
