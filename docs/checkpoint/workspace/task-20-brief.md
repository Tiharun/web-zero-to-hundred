### Task 20: P3 레퍼런스(Rust 워크스페이스 + TS 클라이언트)

**Files:**
- Create: `reference/p3-viewer-arena/`
  - `Cargo.toml`(workspace: `crates/game-core`, `crates/server`, `crates/game-wasm`)
  - `crates/game-core/src/{lib.rs,vec2.rs,physics.rs,world.rs,rules.rs,protocol.rs}`
  - `crates/server/src/{main.rs,config.rs,app.rs,ws.rs,room.rs,rooms.rs,db.rs,leaderboard.rs,error.rs}`, `crates/server/migrations/0001_init.sql`, `crates/server/tests/ws_flow.rs`
  - `crates/game-wasm/src/lib.rs`
  - `client/`(Vite TS: `index.html`(방 만들기·참가), `host.html`(OBS 관전), `play.html`(휴대폰 컨트롤러), `src/{net.ts,render.ts,input.ts,interp.ts,wasm.ts,qr.ts,protocol.ts}`)
  - `Dockerfile`(멀티스테이지: client 빌드 → Rust 빌드 → 슬림 런타임), `docker-compose.yml`(server + postgres + volume), `.env.example`, `README.md`
- Test: `cargo test --workspace`, `cargo clippy --workspace -- -D warnings`, `cargo fmt --check`, `tests/reference/p3.e2e.test.mjs`

**Interfaces:**
- Produces:
  - 게임 규칙 상수(`rules.rs`): 틱 20Hz, 스냅샷 10Hz, 대기 15초, 라운드 120초, 결과 10초, 방 최대 50명, 아레나 반지름 600, 플레이어 반지름 20
  - 결정성: `World::step(&mut self, inputs: &[(PlayerId, Input)], dt: f32)`는 같은 입력에 같은 결과를 낸다(난수는 시드 기반)
  - 프로토콜(`protocol.rs`, serde `#[serde(tag = "t", rename_all = "camelCase")]`, `PROTOCOL_VERSION = 1`)
    - ClientMsg: `join{name}`, `input{seq:u32, dx:f32, dy:f32}`(길이 ≤ 1로 정규화), `ping{ts:f64}`
    - ServerMsg: `welcome{id:u32, room:String, protocol:u32}`, `snapshot{tick:u64, phase:"waiting"|"playing"|"ended", timeLeft:f32, players:[{id,name,x,y,vx,vy,score,color}], items:[{id,x,y}]}`, `result{ranking:[{name,score}]}`, `error{code, message}`, `pong{ts}`
  - HTTP: `POST /api/rooms` → `{code}`(영문 대문자 4자), `GET /api/rooms/{code}` → `{code, players, phase}`, `GET /ws/{code}?role=host|player`, `GET /api/leaderboard?period=day|all`, `GET /healthz`
  - 방은 액터로 구현한다(tokio task + `mpsc` 명령 채널 + `broadcast` 스냅샷). 비어 있는 방은 60초 뒤 정리한다.
  - 안전: 메시지 최대 1KB, 초당 입력 최대 30개(초과분은 버림), 닉네임 1~12자 + 금지어 필터, 서버에서 속도를 제한한다.
  - DB: `DATABASE_URL`이 없으면 랭킹을 끄고 경고 로그만 남긴다(Day 33 이전 단계와 호환). SQLx는 런타임 쿼리를 쓴다(컴파일 시 DB 불필요)
  - WASM: `game-wasm`은 `predict(state_json, input_json, dt) -> String`처럼 game-core의 이동 예측을 노출한다. 도구는 Task 1의 결정을 따른다(`cargo install`로 설치할 수 있는 도구)

- [ ] **Step 0: 환경 준비** — `cargo install wasm-bindgen-cli`(game-wasm의 wasm-bindgen 버전과 일치) 또는 Task 1이 정한 도구. Docker 데몬은 `dockerd` 기동을 시도하고, 실패하면 Docker 검증을 "미검증"으로 기록한다. PostgreSQL은 로컬 서버 또는 Docker로 준비한다.
- [ ] **Step 1: 실패하는 테스트를 쓴다**
  - game-core: `vec2_ops`, `normalize_zero_is_zero`, `circle_collision_separates`, `player_stays_inside_arena`, `item_pickup_scores`, `phase_transitions_waiting_playing_ended`, `step_is_deterministic`
  - protocol: `client_msg_roundtrip_json`(`{"t":"input","seq":1,"dx":1,"dy":0}`), `unknown_type_rejected`
  - server `tests/ws_flow.rs`(tokio-tungstenite 봇): `create_room_join_two_players_receive_snapshots`, `oversized_message_closes_or_errors`, `input_flood_is_throttled`, `host_role_receives_snapshots_without_player`
- [ ] **Step 2: 실행해서 실패를 확인한다** — `cargo test --workspace` → FAIL
- [ ] **Step 3: game-core → server 순으로 구현하고** test·clippy·fmt를 통과시킨다.
- [ ] **Step 4: WASM·클라이언트를 구현한다** — wasm32 빌드 + 바인딩 생성 → `client` `npm ci && npx tsc --noEmit && npm run build` 성공
- [ ] **Step 5: e2e** — `tests/reference/p3.e2e.test.mjs`: 서버(빌드된 client 제공) 실행 → 방 생성 → host.html과 play.html 2개를 열기 → play에서 키 입력 → host 캔버스의 플레이어 수 2(디버그용 `data-players` 속성) → 콘솔 오류 0
- [ ] **Step 6: Docker** — 데몬이 있으면 `docker compose up --build -d` → `/healthz` 200 → down. 없으면 미검증으로 기록한다.
- [ ] **Step 7: 커밋** — `feat(reference): P3 viewer arena (Rust + WASM + TS)`

