# Task 20 report: P3 reference (Rust workspace + TS client)

Status: **DONE_WITH_CONCERNS** (concerns are about verification limits and file-list additions, not failing checks; see the end).
Commits: none (NO GIT).

## What was implemented

`reference/p3-viewer-arena/` is a complete "viewer arena" answer key that matches the learner folder `C:\dev\viewer-arena`.

- **Workspace** (`Cargo.toml`, edition 2024, `rust-version = 1.94`): every dependency is pinned with `=x.y.z` in `[workspace.dependencies]`, and `Cargo.lock` is committed. Pins follow research §0.3: axum 0.8.9 (`ws`), tokio 1.54.1, serde 1.0.229, serde_json 1.0.154, sqlx 0.9.0 (runtime queries only; `default-features = false`, `runtime-tokio, postgres, macros, migrate`; no TLS), tracing 0.1.44, tracing-subscriber 0.3.23, rand 0.10.3, wasm-bindgen 0.2.130.
- **game-core** (pure: no IO, no tokio; it also builds for `wasm32-unknown-unknown`):
  - `vec2.rs`: Copy struct with operator overloading, `normalize` (zero stays zero) and `clamp_length`.
  - `physics.rs`: `Input` (private field, so it is always sanitized: NaN/inf become 0 and length is capped at 1), `Body`, `integrate` (accel → friction → server speed cap → move), `keep_inside_arena`, `circles_overlap`, `separate_circles`, and `move_body` (shared with WASM). It uses only + − × ÷ and √, so results are bit-identical on native and wasm.
  - `world.rs`: `Phase` state machine waiting(15) → playing(120) → ended(10). The waiting clock only runs when at least one player is present. `World::new(seed)` uses a `StdRng` seeded RNG (rand `std_rng` only, so no getrandom on wasm). Items spawn by rejection sampling, so no trig is needed. `step(&mut self, &[(PlayerId, Input)], dt) -> Option<Vec<RankEntry>>` returns the ranking on the exact tick a round ends. Also `ranking()` (stable sort) and `snapshot()`.
  - `rules.rs`: the brief's constants verbatim (20/10 Hz, 15/120/10 s, 50 players, radius 600/20) plus movement and item constants and the colour palette.
  - `protocol.rs`: `PROTOCOL_VERSION = 1`. `ClientMsg` and `ServerMsg` use `#[serde(tag="t", rename_all="camelCase")]`. Snapshot fields are camelCase (`timeLeft`), phase values are lowercase, and `ErrorCode` is snake_case. `ClientMsg::parse` checks the 1 KB limit before JSON parsing. `validate_name` enforces 1–12 chars (by `chars()`), rejects control characters, and filters banned words (case-insensitive, whitespace-squashed). Safety constants live here too.
- **server** (`lib.rs` + thin `main.rs`):
  - `room.rs`: the actor. One tokio task owns `World`, takes `RoomCommand` over `mpsc` (join/info use `oneshot` replies), runs a 20 Hz `interval`, serializes each snapshot or result once and publishes it on `broadcast<Utf8Bytes>`. Inputs use `try_send`, so they are dropped when the channel is full. Results are saved in a spawned task so DB latency never stalls the loop. A room exits after 60 s with `broadcast.receiver_count() == 0`.
  - `rooms.rs`: registry (`Arc<Mutex<HashMap>>`). Codes are 4 random uppercase letters with unique retry; lookup is case-insensitive; at most 100 rooms; a room removes itself when its actor ends.
  - `ws.rs`: rejects unknown rooms with 404 before upgrade. `max_message_size` and `max_frame_size` are 1024. `role=host` gets `welcome{id:0}`, snapshots and pong. `role=player` must send `join` within 10 s; then name validation → join → welcome → loop. A fixed-window `RateLimiter` allows 30 messages/s per connection (hosts too); excess is dropped and `rate_limited` is sent once per window. Stale `seq` is dropped. Leave is sent on any exit.
  - `app.rs`: routes `POST /api/rooms` (201 `{code}`), `GET /api/rooms/{code}`, `GET /api/leaderboard?period=day|all` (`{enabled, period, entries}`; `enabled:false` with no DB), `GET /ws/{code}`, `GET /healthz`. Everything else falls back to `tower_http::ServeDir(STATIC_DIR)`.
  - `config.rs`: `HOST` (default `127.0.0.1`), `PORT` (8080), `DATABASE_URL` (optional; empty means off) and `STATIC_DIR` (`client/dist`). `from_vars(closure)` exists so config is unit-testable without mutating the environment.
  - `error.rs`: `AppError` → JSON `{code,message}`. `db.rs`: `PgPoolOptions` plus `sqlx::migrate!`. `leaderboard.rs`: transactional `save_result`, and `top()` returns the best score per name over the last 24 h or all time.
  - `migrations/0001_init.sql`: `matches` plus `match_scores`, with identity PKs, FK cascade, a CHECK and indexes. Compatible with PG 16 and 18.
  - `main.rs`: loads `.env` (dotenvy), uses `RUST_LOG`/EnvFilter, and runs `run()`; fatal errors are logged readably and exit with code 1. Without `DATABASE_URL` it logs a warning and runs with the leaderboard disabled. It warns when `client/dist` is missing, prints a LAN-URL hint for `0.0.0.0`, and shuts down gracefully on Ctrl+C or SIGTERM.
- **game-wasm**: `#[wasm_bindgen] predict(state_json, input_json, dt) -> Result<String, String>`, which wraps `physics::move_body`. Native unit tests prove it equals game-core and applies the server limits.
- **client** (Vite 8.3.5 vanilla-ts template config, TypeScript 7.0.2, both pinned exactly):
  - `protocol.ts`: mirrored types and constants.
  - `net.ts`: fetch helpers and a WebSocket wrapper with ping/RTT.
  - `interp.ts`: snapshot buffer with a 150 ms render delay and lerp.
  - `render.ts`: DPR-aware Canvas 2D drawing of world coordinates, cleared transparent.
  - `input.ts`: keyboard plus a pointer-events virtual joystick.
  - `wasm.ts`: `init()` plus `predictBody`.
  - `qr.ts`: qrcode-generator modules drawn on canvas with a 4-module quiet zone.
  - Page scripts `home.ts`, `host.ts`, `play.ts` and a shared `style.css`.
  - `host.html` has transparent `html` and `body` (OBS) and sets `canvas#arena[data-players]`.
  - `play.ts` predicts its own player each frame with the WASM build and corrects on each snapshot (server state is extrapolated by RTT/2; it snaps when the gap is over 80 units, otherwise blends 30%). Other players are interpolated.
  - `npm run wasm` = `cargo build -p game-wasm --target wasm32-unknown-unknown --release && wasm-bindgen --target web --out-dir src/wasm …`. The output is gitignored; it is not committed.
- **Docker**:
  - `Dockerfile` is multi-stage, all on official images: `rust:1.99.1-slim-trixie` (wasm stage) → `node:26.13.0-trixie-slim` (client) → `rust:1.99.1-slim-trixie` (server) → `debian:trixie-slim` runtime (non-root user, 129 MB).
  - `docker-compose.yml`: server plus `postgres:18`, volume at `/var/lib/postgresql`, a `pg_isready` healthcheck, and `depends_on: service_healthy`. Host ports can be overridden with `SERVER_PORT` and `DB_PORT`.
  - `.dockerignore`, `.env.example` (DATABASE_URL is commented out by default so early Days run without a DB), and `.gitignore`.
- **README.md** (Korean, 해요체, 작성 기준일 2026-11) covers:
  - Windows prerequisites: rustup with the "Rust Visual C++ prerequisites" option 1 for VS C++ Build Tools, `rustup target add wasm32-unknown-unknown`, wasm-bindgen-cli 0.2.130, Node, and `--version` checks for each.
  - Running without a DB.
  - LAN play: `HOST=0.0.0.0`, the Windows Firewall prompt (private network, debug and release exe prompt separately, public-profile caveat), and opening the PC page by LAN IP so the QR is reachable.
  - OBS setup.
  - Leaderboard via Docker DB or native PG 18 (winget).
  - Full Docker run, dev mode with the Vite proxy, tests, the env table, rules, safety, the protocol summary, a troubleshooting table with real captured error texts, and a Day → file map for lesson writers.

### Why client-side QR (qrcode-generator 2.0.4, MIT, zero dependencies, ships ESM + `.d.ts`)

It is the simpler one to teach.

- No extra server route: the brief's HTTP route list has no QR endpoint.
- No server crate.
- The server never has to know its public LAN address: the host page builds `location.origin + /play.html?room=CODE` from the address the streamer actually opened.
- Drawing is a loop over `isDark(row, col)` → `fillRect`, which reuses the Canvas 2D lesson.
- The alternative npm `qrcode` pulls in yargs, pngjs and dijkstrajs. A server-side crate would need a new route plus a `PUBLIC_URL` setting.

## Tests and results

Commands (from `reference/p3-viewer-arena`):

| Check | Command | Result |
| :-- | :-- | :-- |
| Rust tests | `TEST_DATABASE_URL=postgres://wzh:wzh@127.0.0.1:5432/viewer_arena_test cargo test --workspace` | **39 passed**: game-core 19, game-wasm 3, server unit 9, ws_flow 6, leaderboard_db 2 |
| Lint | `cargo clippy --workspace --all-targets -- -D warnings` | clean |
| Lint (wasm target) | `cargo clippy -p game-wasm -p game-core --target wasm32-unknown-unknown -- -D warnings` | clean |
| Format | `cargo fmt --all --check` | clean |
| WASM | `cargo build -p game-wasm --target wasm32-unknown-unknown --release` + `wasm-bindgen 0.2.130 --target web` | ok (128 KB `.wasm`) |
| Client | `cd client && npm ci && npm run wasm && npx tsc --noEmit && npm run build` | ok (clean `npm ci` verified; TS 7 defaults are strict, confirmed with a probe) |
| e2e | `node --test tests/reference/p3.e2e.test.mjs` (repo root, after `cargo build -p server --release`) | **3/3 pass**, repeated 3× |

Tests the brief named that exist and pass:

- game-core: `vec2_ops`, `normalize_zero_is_zero`, `circle_collision_separates`, `player_stays_inside_arena`, `item_pickup_scores`, `phase_transitions_waiting_playing_ended`, `step_is_deterministic`.
- protocol: `client_msg_roundtrip_json`, `unknown_type_rejected`.
- ws_flow: `create_room_join_two_players_receive_snapshots`, `oversized_message_closes_or_errors`, `input_flood_is_throttled`, `host_role_receives_snapshots_without_player`.

Tests I added beyond the brief:

- game-core: `players_push_each_other_apart`, `room_is_full_at_max_players`, `ranking_sorts_by_score_then_join_order`, `snapshot_has_players_and_items`, `oversized_text_rejected_before_parsing`, `server_msg_json_shape`, `names_are_validated`; physics input sanitizing, speed cap and arena clamp.
- server unit: config ×4; rooms codes, limit, and 60 s cleanup with a paused tokio clock; rate limiter.
- ws_flow: `bad_name_and_unknown_room_are_rejected`, `http_routes_without_database`.
- leaderboard_db ×2: they skip when `TEST_DATABASE_URL` is unset and clean up their rows.
- game-wasm ×3.

The ws_flow test also asserts that a server input produces velocity, and that a leaving player disappears from snapshots. `input_flood_is_throttled` asserts exactly one `rate_limited` and that the connection stays alive.

The e2e test starts the built release binary on a free port by PID, with no DB (`DATABASE_URL=''` so a stray `.env` cannot enable it). It tears down with SIGTERM to that PID, falling back to SIGKILL after 5 s. It covers three things:

- **Host and two phones.** It creates a room via `POST /api/rooms` and opens `host.html` plus two `play.html` pages (mobile, hasTouch). It asserts transparent `html`/`body`, the QR and join URL, `data-players` 0 → 2, and the "참가 2명" HUD. One phone moves with the keyboard and the other drags the joystick, each toward the arena centre so the walls can't interfere. A raw Node WebSocket host connection confirms both moved more than 40 units in the expected direction. Console errors on all three pages: 0.
- **Home page.** Create room → host and play links, the LAN tip shows on 127.0.0.1, joining with a lower-case code navigates, and room info is correct.
- **Banned nickname.** It shows the error and the retry works.

### TDD evidence

- **RED, game-core.** I wrote the APIs with `todo!()` and all tests first. `cargo test -p game-core` → `test result: FAILED. 1 passed; 18 failed`; every failure is a `todo!()` panic. This was expected because only bodies were missing; `server_msg_json_shape` passed because it is pure serde derive. **GREEN:** `ok. 19 passed`.
- **RED, ws_flow.** `tests/ws_flow.rs` was written against a skeleton router with no routes. `cargo test -p server --test ws_flow` → `FAILED. 0 passed; 6 failed`, all with `left: 404 right: 201` from `POST /api/rooms`. This was expected because no routes existed. **GREEN:** `ok. 6 passed` (stable across 5 repeats, 1.36 s).
- **e2e mutation check.** The e2e was written after the client, so I proved it bites: with `connection.send({t:'input',…})` disabled in `play.ts` and the client rebuilt, the run gave `not ok 1 … '조건에 맞는 스냅샷이 오지 않았어요'`. Restored → pass.
- **Bug found visually, then RED → GREEN.** Screenshots showed the phone's nickname form still visible after joining, because `.page-play form{display:grid}` beat the `[hidden]` attribute. I added e2e assertions first (form hidden, joystick visible): RED, `not ok 1`. Then the fix, a global `[hidden]{display:none!important}`: GREEN 3/3. Screenshots of host (with the result overlay), phone and home were reviewed after the fix.

## Docker verification (Step 6)

The daemon was available; `docker pull` of all official base images succeeded.

**Plain `docker compose up --build` cannot finish in this sandbox.** Inside build containers `rustup target add` fails with `invalid peer certificate: UnknownIssuer`, because the sandbox's TLS-re-terminating egress proxy CA is not trusted inside containers. This is an environment limit, not a Dockerfile error.

I used the workaround documented in `/root/.ccr/README.md` **without changing any committed file**:

1. A scratchpad script generated `Dockerfile.verify`: the committed Dockerfile verbatim, plus, after each of the three build-stage `FROM`s, `COPY --from=ccr ca-bundle.crt` and an `ENV` line with CA and proxy variables. The runtime stage is untouched.
2. I built it with `docker build --network host --build-context ccr=/root/.ccr -f Dockerfile.verify -t wzh-task20-p3-server .`. Every original stage succeeded, including `cargo install wasm-bindgen-cli`, `npm ci`, the Vite build, `cargo build --release --locked`, and the runtime image (129 MB).
3. I ran `SERVER_PORT=18080 DB_PORT=55432 docker compose -p wzh-task20-p3 up -d --no-build` with the real `docker-compose.yml`.

Results:

- db became healthy, then server started.
- `/healthz` → **200 `ok`**; `GET /` → 200 text/html.
- `/api/leaderboard` → `{"enabled":true,…}`.
- Migrations applied on **PostgreSQL 18.6**: `\dt` shows `_sqlx_migrations`, `match_scores` and `matches`.
- **Full round end to end against the Docker stack:** a Node bot joined, chased items, phase went waiting (0 s) → playing (15.0 s) → ended (135.0 s). The bot received `result {"ranking":[{"name":"풀라운드533","score":71}]}`, the server logged "경기 결과 저장", `/api/leaderboard?period=day` returned that entry with score 71, and `psql` showed the `matches` and `match_scores` rows (place 1, score 71) in PG 18.6.
- The stack was then torn down: `down -v`, and the built image was removed.

So the build steps and the compose wiring are verified. The exact `docker compose up --build` invocation is "verified modulo the sandbox CA injection".

## Files created (the controller commits exactly these; 51 files)

```
reference/p3-viewer-arena/.dockerignore
reference/p3-viewer-arena/.env.example
reference/p3-viewer-arena/.gitignore
reference/p3-viewer-arena/Cargo.lock
reference/p3-viewer-arena/Cargo.toml
reference/p3-viewer-arena/Dockerfile
reference/p3-viewer-arena/README.md
reference/p3-viewer-arena/docker-compose.yml
reference/p3-viewer-arena/client/host.html
reference/p3-viewer-arena/client/index.html
reference/p3-viewer-arena/client/package-lock.json
reference/p3-viewer-arena/client/package.json
reference/p3-viewer-arena/client/play.html
reference/p3-viewer-arena/client/public/favicon.svg
reference/p3-viewer-arena/client/src/home.ts
reference/p3-viewer-arena/client/src/host.ts
reference/p3-viewer-arena/client/src/input.ts
reference/p3-viewer-arena/client/src/interp.ts
reference/p3-viewer-arena/client/src/net.ts
reference/p3-viewer-arena/client/src/play.ts
reference/p3-viewer-arena/client/src/protocol.ts
reference/p3-viewer-arena/client/src/qr.ts
reference/p3-viewer-arena/client/src/render.ts
reference/p3-viewer-arena/client/src/style.css
reference/p3-viewer-arena/client/src/wasm.ts
reference/p3-viewer-arena/client/tsconfig.json
reference/p3-viewer-arena/client/vite.config.ts
reference/p3-viewer-arena/crates/game-core/Cargo.toml
reference/p3-viewer-arena/crates/game-core/src/lib.rs
reference/p3-viewer-arena/crates/game-core/src/physics.rs
reference/p3-viewer-arena/crates/game-core/src/protocol.rs
reference/p3-viewer-arena/crates/game-core/src/rules.rs
reference/p3-viewer-arena/crates/game-core/src/vec2.rs
reference/p3-viewer-arena/crates/game-core/src/world.rs
reference/p3-viewer-arena/crates/game-wasm/Cargo.toml
reference/p3-viewer-arena/crates/game-wasm/src/lib.rs
reference/p3-viewer-arena/crates/server/Cargo.toml
reference/p3-viewer-arena/crates/server/migrations/0001_init.sql
reference/p3-viewer-arena/crates/server/src/app.rs
reference/p3-viewer-arena/crates/server/src/config.rs
reference/p3-viewer-arena/crates/server/src/db.rs
reference/p3-viewer-arena/crates/server/src/error.rs
reference/p3-viewer-arena/crates/server/src/leaderboard.rs
reference/p3-viewer-arena/crates/server/src/lib.rs
reference/p3-viewer-arena/crates/server/src/main.rs
reference/p3-viewer-arena/crates/server/src/room.rs
reference/p3-viewer-arena/crates/server/src/rooms.rs
reference/p3-viewer-arena/crates/server/src/ws.rs
reference/p3-viewer-arena/crates/server/tests/leaderboard_db.rs
reference/p3-viewer-arena/crates/server/tests/ws_flow.rs
tests/reference/p3.e2e.test.mjs
```

Build outputs are left on disk but are **not** to be committed. All are gitignored:

- `reference/p3-viewer-arena/target/` and `client/dist/` (root `.gitignore`)
- `client/node_modules/` (root `.gitignore`)
- `client/src/wasm/` (project `.gitignore`)

## Self-review findings (all fixed)

1. The phone's join form stayed visible after joining (`display:grid` beat `[hidden]`). Fixed globally, with an e2e assertion added (see TDD).
2. `Error: PoolTimedOut` and Debug-formatted `Error: Os { code: 98 … }` were unfriendly for learners. `main` now delegates to `run() -> Result<(), String>`, adds context, and never logs the DB URL with its password. Re-captured messages are quoted in the README troubleshooting table.
3. With bindings missing, `tsc` reported a confusing second error from `loadWasm`. Rewritten as `return (loading ??= init());`, so only `TS2307 Cannot find module './wasm/game_wasm.js'` shows.
4. Unauthenticated `role=host` sockets had no message-rate limit. They now share the same `RateLimiter` and drop silently. The doc for `MAX_INPUTS_PER_SEC` now says it counts all messages.
5. `drawScene` could get a negative scale on a tiny canvas. Guarded.
6. clippy lints applied: `sort_by_key(Reverse)` (still stable) and `u64::is_multiple_of` (stable since 1.87, below the 1.94 MSRV).
7. Removed `# syntax=docker/dockerfile:1`. The built-in frontend supports everything used, and it saves learners an extra image pull.

## Concerns / notes for the controller

1. **Files beyond the brief's list.** All are needed:
   - `crates/server/src/lib.rs`: integration tests need a library target; this is idiomatic axum testing.
   - `crates/server/tests/leaderboard_db.rs`: real-SQL coverage.
   - Client entry scripts `client/src/{home,host,play}.ts` plus `style.css`, `public/favicon.svg` (avoids a favicon 404 console error), `vite.config.ts` (MPA input + dev proxy) and `tsconfig.json`.
   - `.gitignore` and `.dockerignore`.
2. **Crates beyond the binding list**, all pinned exactly and none macro-heavy:
   - `tower-http =0.7.1` (`ServeDir` static files; compiles with axum 0.8.9).
   - `dotenvy =0.15.7`: `.env.example` in the brief implies `.env` loading. The e2e passes an empty `DATABASE_URL`, which dotenvy will not override.
   - dev-only: `tokio-tungstenite =0.29.0` (the same version axum uses, so there is no duplicate), `futures-util =0.3.34`, `reqwest =0.13.5` (no TLS).
   - tokio `test-util` in dev-deps, for paused-clock tests.
3. **Docker** is verified through the CA-injection workaround described above, not via the literal `docker compose up --build` (sandbox TLS). The pulled official base images were left in place (`rust:1.99.1-slim-trixie`, `node:26.13.0-trixie-slim`, `debian:trixie-slim`; `postgres:18` was already present). My containers, network, volume and the `wzh-task20-p3-server` image were removed.
4. **Windows-only steps are unverified here (Linux sandbox):**
   - the VS Build Tools flow (wording taken from research §8);
   - Windows Firewall prompt wording (the README hedges it);
   - npm scripts with `&&` and forward-slash paths under cmd.exe (they should work, since cargo and wasm-bindgen accept `/`);
   - the native PG 18 `psql.exe` path (research marks it as presumed).
5. **Protocol limits I designed within:**
   - Snapshots carry no per-player input ack, which is exactly what the brief specifies. Client prediction therefore uses a soft correction (extrapolate the server state by RTT/2, then snap or blend) rather than replaying un-acked inputs. `seq` is used server-side to drop stale inputs. Lessons should present this as "보정 개념", with replay as further reading.
   - The leaderboard `day` period is a rolling 24 h window (`now() - INTERVAL '1 day'`), not a KST calendar day.
   - `/api/leaderboard` without a DB returns 200 `{enabled:false, entries:[]}`.
6. **Other notes:**
   - The e2e expects prebuilt artifacts (release or debug server binary plus `client/dist`) and fails fast with the build commands if they are missing.
   - `predict` errors reach JS as thrown strings (`Result<String, String>`), because `JsError` would make the native unit tests impossible.
   - QR codes use `location.origin`, so the streamer must open the pages via the PC's LAN IP. The page warns when it is opened on 127.0.0.1, and the README explains.

---

# Fix round 1 (review minors promoted by the controller)

Status: **DONE**. All 10 items are addressed. No new files and no new dependencies (`Cargo.lock` is unchanged). NO GIT.

## Changes per item

1. **Speed-cap test is now falsifiable.**
   - Added `physics::max_speed_is_enforced_even_from_huge_velocity`. One `integrate` from `vel=(1000,0)` must give speed ≤ 300; a second case uses `(0,-5000)` while pushing.
   - Added `game-wasm::predict_caps_huge_speed` (`vx=1000` → ≤ 300).
   - The `PLAYER_MAX_SPEED` doc now explains that friction usually settles near A/k, and the clamp is the safety net against pushes, a large dt or bugs.
   - Mutation proof: with `clamp_length(PLAYER_MAX_SPEED)` removed, only the new test fails (`speed_never_exceeds_max` still passes, confirming the review). Then restored.
2. **Dead connections.**
   - `ws.rs` now has `pub const IDLE_TIMEOUT = 10 s`, carried as `AppState.idle_timeout` (pub, so tests can shorten it). Host and player loops use a `deadline` plus a `sleep_until(deadline)` select branch. The deadline is pushed forward on every received frame (client pings every 2 s act as the heartbeat). Outgoing snapshots do **not** reset it; a per-iteration `timeout(recv)` would have been reset by them. The join wait uses the same timeout.
   - On timeout the player loop logs and breaks, and `room.leave(id)` runs as before.
   - The client resends its current input when it changed **or** ≥ 1 s has passed (`RESEND_MS`), so dropped inputs self-repair.
   - `rooms.rs`: a `RemoveOnDrop` guard lives inside the spawned actor task, so a panicking actor still removes its room. `remove` no longer panics (it ignores a poisoned lock because it runs inside `Drop`).
   - `host.ts` now reconnects 3 s after a close. This was not requested, but the always-on OBS page would otherwise die permanently on any timeout or disconnect.
   - Tests:
     - `ws_flow::silent_client_is_removed_but_pinging_client_stays` (idle 0.5 s; the pinging player stays, the silent one is removed and its socket closed);
     - `rooms::room_is_removed_even_if_its_task_panics`. Mutation proof: an empty `drop` body makes this test and `empty_room_is_removed_after_timeout` fail.
     - e2e: an idle joined phone sends 2–5 `input` frames in 2.5 s. Mutation proof: with `RESEND_MS=1e9` it sent `0개`.
3. **Rate limiter bypass.**
   - Every data frame (Text or Binary) now goes through `limiter.check` before any reply; only Ping/Pong control frames skip it.
   - New test `binary_frames_count_toward_the_rate_limit`: 100 binary frames → at least one `rate_limited` and at most 60 `bad_message` replies.
   - README and the module doc now say "1초마다 한 번씩만".
4. **Flaky flood test.** The sleeps before the burst are gone, and the assertion is now `(1..=2).contains(&rate_limited)` plus `bad_message == 0`. A shared `count_errors` helper does the counting. 3 consecutive runs are green.
5. **Label.** `host.html` now reads "최근 24시간 랭킹". The README protocol table defines `day` = rolling last 24 h (not the calendar day), `all` = everything, default `day`, top 10 best score per nickname.
6. **Nicknames.**
   - New `NameError::BadChar` ("보이지 않는 글자나 제어 문자는 닉네임에 쓸 수 없어요."). It covers control chars and `is_invisible` (U+200B–U+200F, U+202A–U+202E, U+2060–U+2064, U+FEFF). Test: `invisible_characters_are_rejected`.
   - Duplicate names: `JoinError::NameTaken` in `World::add_player` (exact match) maps to `ErrorCode::NameTaken` (`"name_taken"`). The friendly message suggests another name or retrying shortly, since a ghost connection clears within 10 s. The TS `ErrorCode` union is updated.
   - Tests: `world::duplicate_names_are_rejected` (rejoining after leaving works) and `ws_flow::duplicate_nickname_in_room_is_rejected`.
7. **Module cycle.** `Phase` moved into `protocol.rs` (it is a wire type, serialized lowercase). `world.rs` imports it, so the dependency is now one-way (world → protocol; protocol uses only serde). `lib.rs` documents the direction. Server and test imports now use `game_core::protocol::Phase`.
8. **Docker caching sentence.** The README now says only unchanged steps are reused (the wasm-bindgen-cli install, and `npm ci` when `package*.json` is unchanged), and that Rust source edits recompile the server and its dependencies.
9. **Wording.**
   - "`.env`를 읽어요" now credits the server's `dotenvy` crate (README and `.env.example`).
   - "관리자" → "유지보수자".
   - A TLS note in the README DB section and next to the sqlx pin in `Cargo.toml`: managed Postgres requiring `sslmode=require` needs an sqlx TLS feature such as `tls-rustls` (Day 41~42).
   - The README Day map now lists `RemoveOnDrop`, `IDLE_TIMEOUT` and the one-way module dependency.
10. **Client edges.**
    - `play.ts` `join()` first calls the new `net.fetchRoom`, with distinct messages for a missing room vs an unreachable server. It then `await loadWasm()` inside try/catch; `wasm.ts` clears the cached promise on failure so a retry really retries.
    - Close before welcome keeps the server's error text if one arrived; otherwise it shows "방에 들어가지 못했어요. 잠시 뒤 다시 눌러 주세요." Either way the button is re-enabled through `joinFailed()`.
    - The host checks the room first and shows "방을 찾을 수 없어요. 방 코드를 확인하거나 첫 화면에서 새 방을 만들어 주세요."
    - `input.ts` calls `preventDefault()` on Arrow keys and ignores keys typed into an `<input>`.
    - New e2e test `an unknown room shows a clear message on the host and play pages`. The only console errors are Chromium's own `404` resource entries from the room check, and the test asserts exactly that.

## TDD evidence

- **RED, game-core.** After adding the tests and new enum variants, `cargo test -p game-core` → `FAILED. 19 passed; 3 failed` (`names_are_validated`, `invisible_characters_are_rejected`, `duplicate_names_are_rejected`). This was expected: the variants existed but the behaviour did not. **GREEN:** `ok. 22 passed`.
- **RED, ws_flow.** `cargo test -p server --test ws_flow` → `FAILED. 7 passed; 2 failed`:
  - `binary_frames_count_toward_the_rate_limit` panicked with "rate_limited가 와야 해요";
  - `silent_client_is_removed_but_pinging_client_stays` failed with `left: Number(2) right: 1`.
  `duplicate_nickname_in_room_is_rejected` was already green through the RED-proven game-core change; ws.rs then got the correct `name_taken` message text. **GREEN:** `ok. 9 passed`, 4 runs, 1.28–1.29 s each.
- **Mutation checks** (all restored afterwards): speed clamp removed; `RemoveOnDrop::drop` emptied; `RESEND_MS=1e9`. Each was caught as described above.

## Final verification (commands and outputs)

From `reference/p3-viewer-arena`:

- `cargo fmt --all --check` → clean.
- `cargo clippy --workspace --all-targets -- -D warnings` → clean.
- `cargo clippy -p game-core -p game-wasm --target wasm32-unknown-unknown -- -D warnings` → clean.
- `TEST_DATABASE_URL=postgres://wzh:wzh@127.0.0.1:5432/viewer_arena_test cargo test --workspace` → game-core **22**, game-wasm **4**, server unit **10**, leaderboard_db **2**, ws_flow **9**: **47 passed, 0 failed**. The test DB holds 0 leftover rows.
- `cd client && npm run wasm && npx tsc --noEmit && npm run build` → ok.
- `cargo build -p server --release`, then from the repo root `node --test tests/reference/p3.e2e.test.mjs` → `# pass 4 # fail 0`, twice.

Docker was not re-run: the Dockerfile and compose are unchanged, and only sources changed.

## Files changed in this round (22; no new files)

```
reference/p3-viewer-arena/.env.example
reference/p3-viewer-arena/Cargo.toml
reference/p3-viewer-arena/README.md
reference/p3-viewer-arena/client/host.html
reference/p3-viewer-arena/client/src/host.ts
reference/p3-viewer-arena/client/src/input.ts
reference/p3-viewer-arena/client/src/net.ts
reference/p3-viewer-arena/client/src/play.ts
reference/p3-viewer-arena/client/src/protocol.ts
reference/p3-viewer-arena/client/src/wasm.ts
reference/p3-viewer-arena/crates/game-core/src/lib.rs
reference/p3-viewer-arena/crates/game-core/src/physics.rs
reference/p3-viewer-arena/crates/game-core/src/protocol.rs
reference/p3-viewer-arena/crates/game-core/src/rules.rs
reference/p3-viewer-arena/crates/game-core/src/world.rs
reference/p3-viewer-arena/crates/game-wasm/src/lib.rs
reference/p3-viewer-arena/crates/server/src/app.rs
reference/p3-viewer-arena/crates/server/src/room.rs
reference/p3-viewer-arena/crates/server/src/rooms.rs
reference/p3-viewer-arena/crates/server/src/ws.rs
reference/p3-viewer-arena/crates/server/tests/ws_flow.rs
tests/reference/p3.e2e.test.mjs
```

## Notes

- The U+200B–U+200F ban includes ZWJ (U+200D), so multi-person emoji built with ZWJ sequences are also refused as nicknames. This was accepted to follow the requested ranges.
- Duplicate-name matching is exact (case-sensitive): one simple rule that is easy to teach.
- `rooms::room_is_removed_even_if_its_task_panics` prints an expected panic message in the test output; the test comment says so.

---

# Fix round 2

Status: **DONE**. NO GIT. No new files and no new dependencies.

## 1. (Important) Idle timeout bypassed by a stalled write — fixed

- In `crates/server/src/ws.rs`, **every socket write now goes through one helper**: `write(socket, message, deadline)` = `finish_by(deadline, socket.send(message))`. `finish_by` wraps the write in `tokio::time::timeout_at(deadline, …)` and returns `true` only for a timely `Ok`.
- `forward`, `send_msg`, `send_error` and `close_with_error` all take the `deadline` and return `bool`. `grep` confirms the only remaining `socket.send` is inside `write`.
- `host_session` and `play` now break on any failed or timed-out write: forwarded snapshots and results, pong, `rate_limited`, `bad_message` and "이미 참가했어요". Previously these used `let _ =`. They pass the same `deadline` that `sleep_until(deadline)` watches ("last heard + idle"). A stalled `send` therefore gives up when the deadline arrives, even though `select!` isn't polling the sleep branch while the arm body runs.
- Pre-loop writes (welcome, `close_with_error` for bad name / room full / name taken / no join) use `Instant::now() + idle`.
- The Korean doc comment on `write` explains why writes need the deadline: a dead phone stops reading, the OS send buffer (tens of KB) fills, `send` hangs, and `select!` cannot see `sleep_until` in the meantime.
- The `play` loop's message `match` now evaluates to `sent: bool`, with one `if !sent { break; }`. Input handling is unchanged: stale `seq` is ignored and inputs are forwarded.
- Host ping handling now uses `let … else` instead of a let-chain, which is easier to read.
- Test: `ws::tests::stalled_write_gives_up_at_the_deadline` (`#[tokio::test(start_paused = true)]`).
  - A `std::future::pending()` write wrapped by `finish_by(started + IDLE_TIMEOUT)` inside an outer 20 s `timeout` must return `Ok(false)` exactly at 10 s (paused clock).
  - Timely `Ok` returns `true`; `Err` returns `false`.
  - Mutation proof: `finish_by` body → `work.await.is_ok()` gives `left: Err(Elapsed(())) right: Ok(false)`, a clean failure rather than a hang. Restored.
- A real-TCP stall integration test was not added: filling the kernel buffers takes minutes and would be flaky. The helper test plus the single write path is the cheap check you suggested.
- The README claim "10초쯤 뒤 정리" is now true.

## 2. Nickname filter (promoted observation) — fixed

- `is_invisible` now additionally rejects:
  - U+00AD soft hyphen
  - U+034F CGJ
  - U+061C ALM
  - U+115F and U+1160 Hangul choseong/jungseong fillers
  - U+2066–U+2069 bidi isolates
  - U+3164 HANGUL FILLER
  - U+FFA0 HALFWIDTH HANGUL FILLER. This one was not on your list; it is the same Hangul-filler trick.
- Each range has a Korean line comment. Variation selectors (U+FE00–U+FE0F) are deliberately **not** banned, and the doc comment says so.
- Tests:
  - `invisible_characters_are_rejected` gains `"ad\u{00AD}min"`, CGJ, ALM and `"\u{2066}철수\u{2069}"`.
  - New `hangul_filler_blank_names_are_rejected`: an all-U+3164 name, U+115F+U+1160, U+FFA0, and `"철수\u{3164}"`.
  - New `emoji_with_variation_selectors_are_allowed`: `"하트\u{2764}\u{FE0F}"` and `"철수🎮"` are accepted.
- RED: `cargo test -p game-core protocol` → 2 failed with `left: Ok("ㅤㅤㅤ") right: Err(BadChar)` and `left: Ok("ad\u{ad}min") right: Err(BadChar)`. GREEN: 24 passed.

## Optional README items

- "OBS에 띄우기" step 5: the host page reconnects on its own every 3 s. A server restart loses rooms because they live in memory only, so the streamer then makes a new room and updates the OBS URL.
- The safety list now names the "blank nickname" Hangul-filler characters.

## Verification

From `reference/p3-viewer-arena`:

- `cargo fmt --all --check` → clean.
- `cargo clippy --workspace --all-targets -- -D warnings` → clean.
- `cargo clippy -p game-core -p game-wasm --target wasm32-unknown-unknown -- -D warnings` → clean.
- `TEST_DATABASE_URL=postgres://wzh:wzh@127.0.0.1:5432/viewer_arena_test cargo test --workspace` → game-core **24**, game-wasm **4**, server unit **11**, leaderboard_db **2**, ws_flow **9**: **50 passed, 0 failed**. 0 leftover rows in the test DB.
- `cd client && npm run wasm && npx tsc --noEmit && npm run build` → ok.
- `cargo build -p server --release`, then from the repo root `node --test tests/reference/p3.e2e.test.mjs` → `# pass 4 # fail 0`, twice.

## Files changed in this round (3)

```
reference/p3-viewer-arena/README.md
reference/p3-viewer-arena/crates/game-core/src/protocol.rs
reference/p3-viewer-arena/crates/server/src/ws.rs
```
