# P3 상세 개요 — 시청자 참여 실시간 게임 (`C:\dev\viewer-arena`)

작성 기준일 2026-11. 이 파일은 빌드가 무시해요(`_`로 시작). Day 작성자는 **이 개요 + `reference/p3-viewer-arena/` + `docs/CONTENT-GUIDE.md` + 견본 `textbook/content/p1/day-01.md`** 만 보고 자기 Day를 씁니다. 다른 Day 본문을 읽지 않아도 이어지도록 모든 Day 블록에 시작 상태(전체 경로)와 오늘 바뀌는 파일을 적었어요.

## 0. 읽는 법과 공통 규칙

- **블록 형식**(Task 8 형식 + `레퍼런스 대응`): `## Day N — 제목 (minutes)` / 목표 / 이미 배운 것 / 시작 상태 / 오늘 만들/바꿀 파일 / 끝 상태 확인 / 과제 → 정답 요지 / 용어(사전 담당) / 자주 막히는 곳 후보 / 레퍼런스 대응.
- **시작 상태 = 앞 Day의 끝 상태.** 이 개요는 Day별 파일 변경을 누적해 만든 것이라 두 값이 항상 같아요. 목록은 커밋하는 파일만 적고, 다시 만들 수 있는 빌드 결과물(`target\`, `node_modules\`, `client\src\wasm\`, `client\dist\`)과 개인 파일(`.env`)은 "생성물" 줄에 따로 적어요.
- **"레퍼런스와 같음"** 은 `reference/p3-viewer-arena/`의 그 파일과 글자까지 같다는 뜻(주석 포함)이에요. **"오늘판"·"중간 단계"** 는 그날 배운 것만으로 같은 동작을 하는 단순한 판이고, 어느 Day에 최종 모양이 되는지 적었어요(아래 2절 표). 중간 단계 코드도 가이드 6장대로 실행 검증해요.
- **과제 원칙.** 가이드 2.1(d)에 따라 "오늘 끝 상태 전체 코드"는 과제까지 끝낸 상태예요. 그래서 과제는 ① 계획된 코드를 직접 써 보기(정답 = 그 코드), ② 확인만 하고 파일은 바꾸지 않기, ③ 실험한 뒤 **되돌리기** 중 하나로만 냈어요. 레퍼런스에 없는 코드를 끝 상태에 남기는 과제는 없어요(예외: Day 32 과제 1의 금지어 추가 — 예시 데이터라 레퍼런스와 달라도 됨).
- **실행 위치 규칙.** `cargo` 명령은 항상 워크스페이스 폴더 `C:\dev\viewer-arena`에서 `-p <크레이트>`로(Day 30의 `client/dist` 경로와 Day 37의 `.env` 때문), `npm` 명령은 `C:\dev\viewer-arena\client`에서. 서버 창·npm 창·명령 창을 나눠 쓰고, 서버 코드를 고치면 `Ctrl + C` 후 다시 실행해요(Windows는 실행 중인 `server.exe`를 잠가서 재빌드가 실패해요 — Day 22).
- **로그 규칙.** Day 22~36의 서버 로그는 `println!`/`eprintln!`이고, Day 37에서 레퍼런스와 같은 `tracing` 문구로 바꿔요. 서버 설정은 Day 22~30 `127.0.0.1:8080` 고정 → Day 31 `HOST`만 환경 변수 → Day 35 `DATABASE_URL` 추가 → Day 37 `config.rs` + `.env`.
- **버전**(external-facts 0.3 고정표 그대로): Rust 1.99.1(최소 1.94, edition 2024), axum 0.8.9(`ws`), tokio 1.54.1, serde 1.0.229, serde_json 1.0.154, rand 0.10.3, sqlx 0.9.0, tracing 0.1.44, tracing-subscriber 0.3.23, tower-http 0.7.1, dotenvy 0.15.7, wasm-bindgen / wasm-bindgen-cli 0.2.130, tokio-tungstenite 0.29.0, futures-util 0.3.34, reqwest 0.13.5, Node LTS 26.13.0(22.12 이상), TypeScript 7.0.2, Vite 8.3.5, create-vite 9.3.3, qrcode-generator 2.0.4, PostgreSQL 이미지 `postgres:18`, OBS 33.0.1. Cargo는 모두 `=x.y.z`로 고정해요.
- **Docker Day(33·34·40)** 에는 항상 Docker 없는 경로를 둬요(PostgreSQL 18 직접 설치 + `cargo run`). 서버는 `DATABASE_URL` 없이도 돌아가요(랭킹만 꺼짐). Docker 설치 Day는 `winver`·에디션 점검으로 시작하고 Home 지원 여부를 단정하지 않아요.
- **`:::info` 연결(브리프 요구)**: 유니티 `Update()`·`Time.deltaTime` → Day 13, 언리얼 데디케이티드 서버·리플리케이션 → Day 21(Day 28·45에서 다시), C++ RAII → Day 4(Day 29 `Drop`에서 다시), C++ 스마트 포인터·mutex → Day 12, 유니티 GC 스파이크 → Day 4.
- **"자주 막히는 곳" 필수 배정(브리프 요구)**: VS C++ Build Tools 설치 → Day 1(링커 오류는 Day 20에서 다시), Windows 방화벽 허용 → Day 31(Day 39에서 다시), WSL 2 오류 → Day 33.
- 오류 원문은 작성자가 실제로 재현한 것만 실어요(가이드 2.1(e)). 이 개요의 오류 문구는 레퍼런스 README·external-facts·T20 보고서에서 가져온 것과 rustc·tsc의 흔한 원문이에요. 작성자는 실행해서 확인한 뒤 싣고, Windows 전용 문구는 "버전에 따라 다를 수 있어요"를 붙여요.

## 1. 큰 흐름

```text
Day 1~12  Rust 기초(연습 폴더 rust-basics,
          예제는 Vec2·플레이어·메시지)
          Day 11: viewer-arena 워크스페이스
Day 13~18 TS 로컬 게임(client, Canvas)
Day 19    TS 규칙 → Rust game-core 이식
Day 20    game-wasm(WebAssembly)
Day 21~32 네트워크(Axum·WebSocket·
          액터·보간·예측·방·OBS·휴대폰)
Day 33~40 Docker·PostgreSQL·SQLx·랭킹·
          설정·테스트·성능·Docker 묶기
Day 41~45 배포 준비·배포·리허설·
          확장 설계·회고
```

연습 폴더(레퍼런스 밖, 학습자 PC에만 있음): `C:\dev\rust-basics`(Day 1~12), `C:\dev\arena-bots`(Day 39). 레퍼런스 밖 중간 파일: `client\src\local\*.ts`(Day 16~18 생성, Day 26 삭제), Day 21의 지연 흉내 코드(Day 26 삭제).

## 2. 레퍼런스 파일이 처음 생기는 Day와 최종 모양이 되는 Day

레퍼런스 파일 50개(`reference/p3-viewer-arena/` 아래, 빌드 결과물 제외)가 모두 Day 45까지 등장해요. "최종"은 그 파일을 마지막으로 바꾸는 Day예요(그 Day부터 레퍼런스와 같음).

| 파일 | 처음 | 최종 |
|---|---|---|
| `.gitignore` | 11 | 37 |
| `Cargo.lock` | 11 | 38 |
| `Cargo.toml` | 11 | 38 |
| `crates/game-core/Cargo.toml` | 11 | 19 |
| `crates/game-core/src/lib.rs` | 11 | 19 |
| `crates/game-core/src/protocol.rs` | 11 | 32 |
| `crates/game-core/src/vec2.rs` | 11 | 11 |
| `client/index.html` | 13 | 31 |
| `client/package-lock.json` | 13 | 30 |
| `client/package.json` | 13 | 30 |
| `client/play.html` | 13 | 31 |
| `client/public/favicon.svg` | 13 | 13 |
| `client/src/home.ts` | 13 | 31 |
| `client/src/play.ts` | 13 | 30 |
| `client/src/style.css` | 13 | 31 |
| `client/tsconfig.json` | 13 | 13 |
| `client/src/protocol.ts` | 14 | 36 |
| `client/src/render.ts` | 14 | 14 |
| `client/src/input.ts` | 15 | 28 |
| `crates/game-core/src/physics.rs` | 19 | 19 |
| `crates/game-core/src/rules.rs` | 19 | 21 |
| `crates/game-core/src/world.rs` | 19 | 32 |
| `client/src/wasm.ts` | 20 | 20 |
| `crates/game-wasm/Cargo.toml` | 20 | 20 |
| `crates/game-wasm/src/lib.rs` | 20 | 20 |
| `crates/server/Cargo.toml` | 22 | 38 |
| `crates/server/src/app.rs` | 22 | 36 |
| `crates/server/src/lib.rs` | 22 | 37 |
| `crates/server/src/main.rs` | 22 | 37 |
| `client/vite.config.ts` | 23 | 30 |
| `crates/server/src/ws.rs` | 23 | 37 |
| `client/src/net.ts` | 24 | 41 |
| `crates/server/src/room.rs` | 25 | 37 |
| `client/src/interp.ts` | 27 | 27 |
| `crates/server/src/error.rs` | 29 | 37 |
| `crates/server/src/rooms.rs` | 29 | 35 |
| `client/host.html` | 30 | 36 |
| `client/src/host.ts` | 30 | 36 |
| `client/src/qr.ts` | 30 | 30 |
| `docker-compose.yml` | 34 | 40 |
| `crates/server/migrations/0001_init.sql` | 35 | 35 |
| `crates/server/src/db.rs` | 35 | 35 |
| `crates/server/src/leaderboard.rs` | 35 | 36 |
| `.env.example` | 37 | 37 |
| `crates/server/src/config.rs` | 37 | 37 |
| `crates/server/tests/leaderboard_db.rs` | 38 | 38 |
| `crates/server/tests/ws_flow.rs` | 38 | 38 |
| `.dockerignore` | 40 | 40 |
| `Dockerfile` | 40 | 40 |
| `README.md` | 43 | 45 |

README.md는 학습자 글(Day 43~45)이라 내용이 레퍼런스와 달라도 돼요. `Cargo.lock`·`package-lock.json`은 도구가 만들며, 버전을 레퍼런스와 같게 고정했으므로 Day 38·30 이후 같은 내용이 돼야 해요(다르면 보고).

## 3. 중간 단계가 어떻게 바뀌는지 (여러 Day에 걸친 파일)

Day 작성자가 자기 Day의 "오늘판"을 정확히 쓰도록, 자주 바뀌는 부분만 모았어요.

- **서버 주소·라우트**: Day 22 `/healthz`·`/api/visits` → Day 23 `+ /ws`(에코) → Day 25 `/api/room`(방 MAIN 하나) + `/ws`(구독) → Day 26 `/ws`(플레이어 참가) → Day 29 `POST /api/rooms`·`GET /api/rooms/{code}`·`/ws/{code}`(`/api/visits`·`/api/room` 없음) → Day 30 `/ws/{code}?role=host|player` + 정적 파일 → Day 36 `+ /api/leaderboard`.
- **`AppState`**: Day 22 `{ visits: Arc<Mutex<u64>> }` → Day 25 `{ room: RoomHandle }` → Day 26 `{ room, idle_timeout }` + `new(room)` → Day 29 `{ rooms: Rooms, idle_timeout }` + `new()` → Day 35 `{ rooms, db: Option<PgPool>, idle_timeout }` + `new(db)`(최종). `router(state)` → Day 30 `router(state, static_dir: &Path)`(최종).
- **`room::new_room`**: Day 25 `(code, seed)` → Day 35 `(code, seed, db)`. **`Rooms::create`**: Day 29 `create()` → Day 35 `create(db)`.
- **`ws.rs`**: Day 23 에코 → Day 24 parse·ping/pong·bad_message·크기 제한·`send_msg`/`send_error` → Day 25 구독 + `forward` → Day 26 `IDLE_TIMEOUT`·`player_session`·`wait_for_join`·`play`·`close_with_error` → Day 28 `last_seq` → Day 29 `Path(code)` + 404 → Day 30 `Role`·`WsParams`·`host_session` → Day 32 `RateLimiter`·`write`/`finish_by`(모든 쓰기에 기한)·테스트 → Day 37 tracing 2줄(최종).
- **`room.rs`**: Day 25 액터(매 틱 스냅샷) → Day 27 10Hz → Day 29 빈 방 60초 정리 → Day 32 `NameTaken` 매핑 → Day 35 db·`save_result` → Day 37 tracing(최종).
- **`main.rs`**: Day 22 고정 주소 → Day 25 방 MAIN 액터 → Day 26 `AppState::new(room)` → Day 29 `AppState::new()` → Day 30 정적 파일 `client/dist` → Day 31 `HOST`·`lan_ip` → Day 35 `DATABASE_URL`·`db::connect` → Day 37 `run()`·`Config`·dotenvy·tracing·graceful shutdown(최종).
- **game-core `protocol.rs`**: Day 11 `Phase`·`ClientMsg` + serde 왕복 테스트 → Day 19 `Snapshot`·`PlayerState`·`ItemState`·`RankEntry` → Day 24 버전·크기 상수·`ParseError`·`parse`·`ServerMsg`·`ErrorCode`(6개 모두)·테스트 4개 → Day 26 `NAME_MAX_CHARS`·`NameError{Empty,TooLong}`·`validate_name`·`names_are_validated`(4단언) → Day 32 최종(`MAX_INPUTS_PER_SEC`, `BANNED_WORDS`, `BadChar`·`Banned`, `is_invisible`, 테스트 8개).
- **game-core 테스트 수**: Day 11 3 → Day 19 16 → Day 24 19 → Day 26 20 → Day 32 24(최종). game-wasm 4(Day 20). server 단위: Day 29 5 → Day 32 7 → Day 37 11. 통합: Day 38 ws_flow 9 + leaderboard_db 2. 전체 50(Day 38).
- **`client/src/net.ts`**: Day 24 `connect(handlers)`(주소 `/ws`, ping·RTT) → Day 29 `+ normalizeCode`·`roomFromUrl`·`createRoom`·`fetchRoom`, `connect(room, handlers)` → Day 30 `connect(room, role, handlers)` → Day 31 `+ isLocalOnlyAddress` → Day 36 `+ fetchLeaderboard` → Day 41 `wss:`/`ws:` 선택(최종).
- **`client/src/protocol.ts`**: Day 14 상수 3개·`PlayerState`·`ItemState` → Day 18 `Phase`·`RankEntry`·`PHASE_LABEL`·`formatTime` → Day 21 `TICK_HZ`·`SNAPSHOT_HZ` → Day 24 `PROTOCOL_VERSION`·`ErrorCode`·`Snapshot`·`ServerMsg`·`ClientMsg` → Day 29 `RoomInfo` → Day 30 `Role` → Day 36 `Leaderboard`(최종).
- **`client/src/play.ts`**: Day 13 DOM 공 → Day 14 캔버스 장면 → Day 15 입력 → Day 16~18 로컬 물리·규칙(`local/`) → Day 20 내 이동을 WASM으로 → Day 21 `?lag=` 실험 → Day 24 서버 지연 표시 → Day 26 네트워크 컨트롤러로 통째로 교체(`local/` 삭제) → Day 27 보간 → Day 28 입력 완성·예측·보정 → Day 29 방 코드·`fetchRoom`·`joinFailed` → Day 30 `role`(최종).
- **`client/play.html`**: Day 13 `#ball` → Day 14 `canvas#arena` → Day 15 `#stick` → Day 16 `p#status` → Day 18 `header`(`#phase`·`#score`) → Day 26 레퍼런스 구조(폼·`section#game`·`#room-label`) → Day 31 viewport(최종). **`index.html`·`home.ts`**: Day 13 임시 → Day 29 방 만들기·참가 → Day 30 OBS 주소 → Day 31 `#lan-tip`(최종). **`host.html`·`host.ts`**: Day 30 → Day 31 127.0.0.1 경고 → Day 36 랭킹(최종).
- **`client/src/style.css`**(레퍼런스의 구역 주석 순서대로 채움): Day 13 공통 앞부분(`:root`·`*`·`[hidden]`·`body`·`h1, h2`) → Day 14 play 구역 시작 → Day 15 `.small`·`.stick`·`.knob` → Day 16 `.status` → Day 18 `.play-header` → Day 26 `button`·`input`·`.card`·play 폼·`#game` → Day 29 `a`·`button:disabled`·`.row`·`.room-code`·`.visually-hidden`·index 구역 → Day 30 host 구역 → Day 31 `.tip`(최종).
- **루트 `Cargo.toml`**: Day 11 뼈대(game-core·serde·serde_json) → Day 19 rand → Day 20 members에 game-wasm·wasm-bindgen → Day 22 members 최종 순서(game-core, server, game-wasm)·axum·tokio → Day 23 axum `ws` → Day 30 tower-http → Day 35 sqlx → Day 37 tracing·tracing-subscriber·dotenvy → Day 38 테스트 전용 3개(최종). **`crates/server/Cargo.toml`**: Day 22 → Day 25 rand(thread_rng) → Day 29 dev tokio test-util → Day 30 tower-http → Day 35 sqlx → Day 37 tracing·dotenvy → Day 38 dev 3개(최종).
- **`docker-compose.yml`**: Day 34 db만 → Day 40 server 추가(최종). **`.gitignore`**: Day 11 `/target/` → Day 13 client 두 줄 → Day 20 `/client/src/wasm/` → Day 37 `.env`(최종).

## 4. P3가 기대는 P1·P2 지식 (설계서 3.1·3.2 기준 Day)

P3는 P2를 마친 학습자가 시작해요(`requires: ["p2"]`). 각 Day의 "이미 배운 것"에 링크로 다시 적었어요. P1·P2 개요는 병렬로 작성 중이었어요(Day 번호는 설계서 3.1·3.2 기준). 실제 담당 Day가 다르면 링크만 고치면 돼요.

- VS Code 설치·확장·폴더 열기 → [P1 Day 2](#/day/p1-d02)
- Git·GitHub·커밋·푸시·.gitignore → [P1 Day 7](#/day/p1-d07)
- 표·폼(form) → [P1 Day 8](#/day/p1-d08)
- CSS 박스 모델·단위 → [P1 Day 10](#/day/p1-d10)
- 반응형·viewport·기기 모드 → [P1 Day 13](#/day/p1-d13)
- transform·transition·배포(GitHub Pages) → [P1 Day 14](#/day/p1-d14)
- JS 시작·Console·연산자 → [P1 Day 15](#/day/p1-d15)
- 조건문·템플릿 리터럴 → [P1 Day 16](#/day/p1-d16)
- 반복문·배열 → [P1 Day 17](#/day/p1-d17)
- 함수·화살표 함수 → [P1 Day 18](#/day/p1-d18)
- 객체·배열 메서드(map/filter) → [P1 Day 19](#/day/p1-d19)
- DOM(querySelector·textContent·createElement) → [P1 Day 20](#/day/p1-d20)
- 이벤트·addEventListener → [P1 Day 21](#/day/p1-d21)
- 폼 검증·preventDefault → [P1 Day 24](#/day/p1-d24)
- JSON·fetch·async/await·try/catch·Network 탭 → [P1 Day 25](#/day/p1-d25)
- Date·setInterval·setTimeout·padStart → [P1 Day 26](#/day/p1-d26)
- OBS 브라우저 소스·투명 배경·URL 매개변수(URLSearchParams) → [P1 Day 27](#/day/p1-d27)
- README.md → [P1 Day 29](#/day/p1-d29)
- 회고 → [P1 Day 30](#/day/p1-d30)
- 풀스택 큰 그림·요청/응답·API → [P2 Day 1](#/day/p2-d01)
- 터미널·PowerShell·cd/dir/mkdir·경로 → [P2 Day 2](#/day/p2-d02)
- Node.js·npm·package.json·실행 정책·환경 변수·PATH → [P2 Day 3](#/day/p2-d03)
- TypeScript·tsc·기본 타입·컴파일(용어) → [P2 Day 4](#/day/p2-d04)
- interface·union·literal 타입 → [P2 Day 5](#/day/p2-d05)
- 함수 타입·제네릭·import/export 모듈 → [P2 Day 6](#/day/p2-d06)
- Vite(vanilla-ts)·dev 서버·빌드·localhost·포트 → [P2 Day 7](#/day/p2-d07)
- Promise·async/await·타입 있는 fetch → [P2 Day 8](#/day/p2-d08)
- .NET·컴파일·컴파일 언어 → [P2 Day 9](#/day/p2-d09)
- C# 기본 문법·switch·반복·열거형 → [P2 Day 10](#/day/p2-d10)
- 메서드·List/Dictionary·nullable → [P2 Day 11](#/day/p2-d11)
- 클래스·생성자·record → [P2 Day 12](#/day/p2-d12)
- 인터페이스·다형성·패턴 매칭 → [P2 Day 13](#/day/p2-d13)
- LINQ·람다 → [P2 Day 14](#/day/p2-d14)
- 예외·try/catch·Task·async → [P2 Day 15](#/day/p2-d15)
- HTTP·HTTPS·REST·상태 코드·JSON·.http → [P2 Day 16](#/day/p2-d16)
- Minimal API·라우트·직렬화·핸들러 → [P2 Day 17](#/day/p2-d17)
- CRUD·라우트 매개변수 → [P2 Day 18](#/day/p2-d18)
- SQL 기초·표·키·SELECT/INSERT/UPDATE/DELETE → [P2 Day 19](#/day/p2-d19)
- 마이그레이션·연결 문자열 → [P2 Day 20](#/day/p2-d20)
- 비동기 DB 쿼리 → [P2 Day 21](#/day/p2-d21)
- 외래 키·JOIN(Include) → [P2 Day 22](#/day/p2-d22)
- DTO·검증·의존성 주입 → [P2 Day 23](#/day/p2-d23)
- 설정·실행 환경·로그 수준·ProblemDetails → [P2 Day 24](#/day/p2-d24)
- 비밀번호 해시·비밀 값 다루기 → [P2 Day 25](#/day/p2-d25)
- CORS·출처·Vite 프록시 → [P2 Day 27](#/day/p2-d27)
- UTC vs 한국 시간 → [P2 Day 29](#/day/p2-d29)
- 페이지네이션·쿼리 매개변수 → [P2 Day 30](#/day/p2-d30)
- 폴링·SSE·오버레이 → [P2 Day 33](#/day/p2-d33)
- XSS·CSRF·SQL 인젝션·요청 제한·HTTPS → [P2 Day 34](#/day/p2-d34)
- 단위 테스트 → [P2 Day 35](#/day/p2-d35)
- 통합 테스트·tsc --noEmit → [P2 Day 36](#/day/p2-d36)
- 포매터·브랜치·PR → [P2 Day 37](#/day/p2-d37)
- 프로덕션 빌드·정적 파일(wwwroot)·npm ci → [P2 Day 38](#/day/p2-d38)
- 배포 옵션·리버스 프록시·비용 주의 → [P2 Day 39](#/day/p2-d39)
- README·스크린샷·회고 → [P2 Day 40](#/day/p2-d40)

## 5. 용어 배정표 (P3가 처음 가르치는 용어 → 담당 Day)

정의 전문은 `textbook/content/glossary/p3.md`. 담당 Day에서 처음 쓸 때 `**[[용어]]**(원어)` + 한 줄 정의, 다른 Day에서는 `[[용어]]` 링크만. P1·P2가 가르치는 용어(예: JSON, HTTP, API, TypeScript, 터미널, 환경 변수, 마이그레이션, 단위 테스트, HTTPS, 제네릭, 인터페이스, 모듈)는 여기서 정의하지 않고 4절의 Day 링크로 되짚어요. 작성 시점에 디스크에 있는 `glossary/p1.md`(170개)·`glossary/p2.md`(214개)와 겹치는 용어는 P3에서 정의하지 않았어요(예: 패턴 매칭·열거형·직렬화·리버스 프록시는 P2 소유). 두 파일에 있는 제목(정확한 대소문자)은 `[[용어]]`로 바로 링크해요 — 예: `[[패턴 매칭]]`, `[[열거형]]`, `[[직렬화]]`, `[[리버스 프록시]]`, `[[모듈]]`, `[[제네릭]]`, `[[인터페이스]]`, `[[포트]]`, `[[localhost]]`, `[[상태 코드]]`, `[[Promise]]`, `[[환경 변수]]`, `[[마이그레이션]]`, `[[단위 테스트]]`, `[[통합 테스트]]`, `[[HTTPS]]`, `[[요청 제한]]`, `[[정적 파일]]`, `[[오버레이]]`, `[[브라우저 소스]]`. 각 Day 블록의 "링크만 거는 기존 용어" 줄에 그날 특히 쓸 것을 적었어요.

- Day 1: Rust, rustup, Cargo, 링커, MSVC 빌드 도구, rust-analyzer, 매크로
- Day 2: 불변, 섀도잉, 표현식
- Day 4: 소유권, 스택, 힙, 소유권 이동, 가비지 컬렉션, RAII
- Day 5: 빌림, 참조, 가변 참조, 빌림 검사기, 슬라이스, 문자열 슬라이스
- Day 6: 구조체, impl 블록, 연관 함수, 2차원 벡터
- Day 7: Option
- Day 8: Result, ? 연산자, panic
- Day 9: Vec, HashMap, 반복자, 클로저
- Day 10: 트레이트, derive, 연산자 오버로딩, 트레이트 경계
- Day 11: 크레이트, 워크스페이스, pub, serde, 역직렬화
- Day 12: 수명, 스마트 포인터, Arc, Mutex, 스레드, 동시성, 데이터 경쟁
- Day 13: 게임 루프, 프레임, 델타 타임, requestAnimationFrame
- Day 14: Canvas, 렌더링 컨텍스트, 월드 좌표, 기기 픽셀 비율
- Day 15: 포인터 이벤트, 가상 조이스틱
- Day 16: 속도, 가속도, 마찰, 정규화
- Day 17: 충돌 판정, 밀어내기, 내적
- Day 18: 상태 머신
- Day 19: 이식, 고정 틱, 결정성, 시드
- Day 20: WebAssembly, 컴파일 타깃, wasm-bindgen, 바인딩
- Day 21: 권위 서버, 지연 시간, 틱 레이트, RTT, 넷코드, 데디케이티드 서버
- Day 22: Tokio, Future, Axum, 추출기
- Day 23: WebSocket, 프로토콜 업그레이드, 에코 서버
- Day 24: 메시지 프로토콜, 프로토콜 버전, 구별된 유니온
- Day 25: 액터 패턴, 채널, mpsc, oneshot 채널, broadcast 채널, select!
- Day 26: 유휴 타임아웃, 하트비트
- Day 27: 스냅샷, 상태 동기화, 보간
- Day 28: 클라이언트 예측, 서버 보정, 시퀀스 번호
- Day 29: 방 코드, Drop
- Day 30: 관전 화면, QR 코드, 멀티 페이지 앱
- Day 31: LAN, 사설 IP 주소, Windows 방화벽, 네트워크 프로필
- Day 32: 치팅, 거부 목록, 허용 목록, 보이지 않는 문자, 쓰기 마감 시간
- Day 33: Docker, 컨테이너, 컨테이너 이미지, Docker Hub, Docker Desktop, WSL 2, 하드웨어 가상화
- Day 34: PostgreSQL, psql, Docker Compose, 볼륨, 포트 매핑
- Day 35: SQLx, 연결 풀, 트랜잭션
- Day 36: 리더보드, 집계 함수, 데이터베이스 인덱스
- Day 37: tracing, .env 파일, 우아한 종료, 종료 신호
- Day 38: Clippy, rustfmt, 린터
- Day 39: 릴리스 빌드, 부하 테스트, 봇, 대역폭
- Day 40: Dockerfile, 멀티스테이지 빌드, 레이어 캐시, .dockerignore
- Day 41: 도메인 이름, DNS, TLS, WSS
- Day 42: 관리형 데이터베이스, 콜드 스타트
- Day 43: 방송 리허설
- Day 44: 채팅 명령어, 수평 확장

## 6. Day별 블록

## Day 1 — 왜 Rust인가 + 설치 (120분)
- 목표: P3 완성본(OBS 아레나 + 휴대폰 컨트롤러 + Rust 서버)이 어떤 부품으로 이뤄지는지 글 그림으로 설명할 수 있다. `rustup-init.exe`를 실행해 "Rust Visual C++ prerequisites" 화면에서 1번(Quick install via the Visual Studio Community installer)으로 MSVC 링커와 Windows SDK를 설치하고, 기본 설치를 마친다. 새 PowerShell 창에서 `rustc --version`(1.94 이상, 작성 기준일 2026-11 최신 1.99.1), `cargo --version`, `rustup --version`을 확인한다. Day 20에서 쓸 `rustup target add wasm32-unknown-unknown`을 미리 한 번 실행하고 `rustup target list --installed`로 확인한다(한 줄 설명만, 자세한 건 Day 20). VS Code에 rust-analyzer 확장을 설치한다. `C:\dev`에서 `cargo new rust-basics` → `cargo run`으로 `Hello, world!`를 보고, `println!`의 글자를 바꿔 다시 실행한다. `:::info`로 C#(GC 있음)·C++(GC 없음, 언리얼)과 Rust의 위치를 비교하고 "GC 없는 메모리 관리는 Day 4에서" 예고한다.
- 이미 배운 것: PowerShell 창 열기·`cd`·`dir`·`mkdir`·탭 완성([P2 Day 2](#/day/p2-d02)), 설치 프로그램·UAC(관리자 권한 묻는 창) 다루기와 `--version` 확인 습관([P2 Day 3](#/day/p2-d03), [P2 Day 9](#/day/p2-d09)), 컴파일 언어·컴파일러 개념([P2 Day 4](#/day/p2-d04), [P2 Day 9](#/day/p2-d09)), 정적 타입([P2 Day 4](#/day/p2-d04), [P2 Day 10](#/day/p2-d10)), VS Code 확장 설치·폴더 열기([P1 Day 2](#/day/p1-d02)), 웹 서버·API·요청/응답([P2 Day 1](#/day/p2-d01), [P2 Day 17](#/day/p2-d17)), OBS 브라우저 소스([P1 Day 27](#/day/p1-d27)), Git 커밋([P1 Day 7](#/day/p1-d07)).
- 시작 상태: P3의 첫날이라 프로젝트 폴더가 아직 없어요. P1·P2에서 만든 `C:\dev` 폴더와 VS Code, Git, Node.js(P2), 브라우저(Edge 또는 Chrome)가 있으면 돼요. 인터넷 연결이 필요해요(설치 파일 수 GB).
  - 파일 없음(깨끗한 상태). `C:\dev` 폴더만 있어요.
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome
- 오늘 만들/바꿀 파일:
  - 새로 만듦 `C:\dev\rust-basics\Cargo.toml` — `cargo new rust-basics`가 만듦: `[package] name = "rust-basics"`, `version = "0.1.0"`, `edition = "2024"`, `[dependencies]` 비어 있음 (레퍼런스 밖 연습 폴더)
  - 새로 만듦 `C:\dev\rust-basics\src\main.rs` — `fn main() { println!("안녕, 아레나!"); }` (만든 직후 `Hello, world!`를 한 번 보고 바꿈) (레퍼런스 밖 연습 폴더)
  - 새로 만듦 `C:\dev\rust-basics\.gitignore` — `cargo new`가 만듦(`/target`). `cargo new`는 `git init`도 해서 `.git` 폴더가 생긴다는 사실을 한 줄로 알림 (레퍼런스 밖 연습 폴더)
  - 새로 만듦 `C:\dev\rust-basics\Cargo.lock` — 첫 `cargo run`이 만듦(의존성 없음) (레퍼런스 밖 연습 폴더)
  - 오늘 생기는 생성물(커밋 안 함): `C:\dev\rust-basics\target\`, `C:\dev\rust-basics\.git\`
  - 오늘 설치하는 도구: Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치)
- 끝 상태 확인: `C:\dev\rust-basics`에서 `cargo run` → `Compiling rust-basics v0.1.0 (C:\dev\rust-basics)` … `Running `target\debug\rust-basics.exe`` 다음 줄에 `안녕, 아레나!`. `rustup target list --installed` → `wasm32-unknown-unknown`, `x86_64-pc-windows-msvc` 두 줄. VS Code에서 `C:\dev\rust-basics` 폴더를 열면 `fn main` 위에 `▶ Run | Debug`가 보인다.
- 과제:
  1) `println!`을 세 줄로 늘려 내 닉네임·좋아하는 게임·오늘 날짜를 출력하기(쉬움) → 정답 요지: `println!("닉네임: 철수");`처럼 세 줄, 실행 결과 세 줄
  2) `cargo build` 후 `.\target\debug\rust-basics.exe`를 직접 실행하고 `cargo run`과 비교하기(보통) → 정답 요지: build는 만들기만, run은 만들고 실행. exe는 Rust 없이도 실행되는 파일
  3) 세미콜론이나 닫는 따옴표를 일부러 지워 컴파일 오류 원문을 읽고 되돌리기(보통) → 정답 요지: `error: expected `;`` 같은 원문, `-->` 뒤의 파일:줄:칸을 보고 고침
- 용어(사전 담당): Rust, rustup, Cargo, 링커, MSVC 빌드 도구, rust-analyzer, 매크로
- 자주 막히는 곳 후보: "Rust Visual C++ prerequisites" 화면이 무엇인지 몰라 3번(GNU)을 고름 → 다시 `rustup-init.exe` 실행 후 1번 / ``error: linker `link.exe` not found``(빌드 도구 없이 진행) → `rustup-init.exe` 다시 실행해 1번, 또는 Visual Studio Installer에서 "C++를 사용한 데스크톱 개발" 워크로드 설치 / Visual Studio Installer가 수 GB를 받고 재부팅·UAC 창을 띄움 → 기다림, 재부팅 후 새 PowerShell / `cargo : 'cargo' 용어가 cmdlet, 함수, 스크립트 파일 또는 실행할 수 있는 프로그램 이름으로 인식되지 않습니다.` → 설치 전에 열어 둔 창이라 PATH가 옛것. 새 PowerShell 창·VS Code 다시 시작 / Windows 보안(백신)이 첫 빌드를 느리게 함 → 기다림(끄지 않음) / rust-analyzer가 "failed to discover workspace" → `C:\dev`가 아니라 `C:\dev\rust-basics`를 폴더로 엶 / 사용자 폴더가 OneDrive로 옮겨져 있거나 사용자 이름이 한글이면 `C:\Users\<이름>\.cargo` 경로 문제가 생길 수 있음(실기 미확인 후보 — 작성자가 확인하고 확인 못 하면 "버전에 따라 다를 수 있어요"로)
- 레퍼런스 대응: 없음 — 연습 폴더 `C:\dev\rust-basics`(레퍼런스 밖). 설치 절차는 `reference/p3-viewer-arena/README.md`의 "준비물 (Windows 11)" 1) Rust 설치와 2) WebAssembly 도구의 `rustup target add` 줄에 대응(`wasm-bindgen-cli`는 Day 20).

## Day 2 — 변수·타입·함수 (90분)
- 목표: `let`(기본 불변)과 `let mut`의 차이를 오류 E0384로 확인한다. 정수(`i32`·`u32`)·실수(`f32`·`f64`)·`bool`·`char`·튜플 `(f32, f32)`와 문자열 리터럴(자세한 문자열 타입은 Day 5)을 쓴다. `as`로 숫자 타입을 바꾼다. 섀도잉으로 같은 이름에 새 값을 묶는다. `fn damage(hp: i32, amount: i32) -> i32 { hp - amount }`처럼 매개변수·반환 타입이 있는 함수를 만들고, 마지막 줄의 세미콜론 유무(표현식 vs 문)가 반환값을 바꾸는 것을 E0308로 확인한다. `println!`의 `{}`·`{name}`·`{:?}`(튜플 출력)·`{:02}`(두 자리) 자리 표시를 쓴다. 예제는 게임 도메인(플레이어 이름·체력·점수·위치 튜플)으로 쓴다.
- 이미 배운 것: [Day 1](#/day/p3-d01)의 `cargo run`·`println!`·컴파일 오류 읽기, TypeScript·C#의 변수와 기본 타입·함수([P2 Day 4](#/day/p2-d04), [P2 Day 10](#/day/p2-d10), [P2 Day 11](#/day/p2-d11)), 사칙연산·나머지 `%`([P1 Day 15](#/day/p1-d15)).
- 시작 상태: 어제(Day 1) 만든 연습 크레이트가 있어야 해요. 오늘은 `src\main.rs`를 통째로 바꿔요.
  - (Day 1 끝 상태와 같아요. 다르면 [Day 1](#/day/p3-d01)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\.gitignore`
  - `C:\dev\rust-basics\Cargo.lock`
  - `C:\dev\rust-basics\Cargo.toml`
  - `C:\dev\rust-basics\src\main.rs`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\rust-basics\target\`, `C:\dev\rust-basics\.git\`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치)
- 오늘 만들/바꿀 파일:
  - 바꿈 `C:\dev\rust-basics\src\main.rs` — 통째로 바꿈: 플레이어 체력·점수 예제(`let name = "철수";`, `let mut hp = 100;`, 섀도잉으로 `let level = level as f32 * 1.5;`, 블록 표현식 `let bonus = { let base = 10; base * 2 };`, `fn damage`, `fn score_after(score: u32, items: u32) -> u32`, 위치 튜플 `let pos: (f32, f32) = (3.0, 4.0);`) (레퍼런스 밖 연습 폴더)
- 끝 상태 확인: `cargo run` 출력에 `철수 HP: 70`, 점수 계산 결과, `{:?}`로 찍은 `(3.0, 4.0)`이 보이고 경고(warning) 없이 끝난다.
- 과제:
  1) `fn heal(hp: i32, amount: i32) -> i32`를 만들어 결과 출력하기(쉬움) → 정답 요지: 마지막 줄 `hp + amount`(세미콜론 없음)
  2) E0384가 나는 코드(불변 변수에 다시 대입)를 받아 `mut`로 고치기(쉬움) → 정답 요지: `let mut`
  3) 125초를 섀도잉으로 `2:05`로 바꿔 출력하기(보통) → 정답 요지: `let secs = 125; let mins = secs / 60; let secs = secs % 60; println!("{mins}:{secs:02}");`
- 용어(사전 담당): 불변, 섀도잉, 표현식
- 자주 막히는 곳 후보: `error[E0384]: cannot assign twice to immutable variable` → `let mut` / 함수 마지막 줄에 `;`를 붙여 `error[E0308]: mismatched types` … `expected `i32`, found `()`` → 세미콜론 지우기 / `i32 * f32` → ``error[E0277]: cannot multiply `i32` by `f32` `` → `as f32` / `u32` 체력이 0 아래로 내려가 `attempt to subtract with overflow` panic(디버그 빌드) → `i32`를 쓰거나 Day 8에서 다룰 panic이라고 안내 / `warning: unused variable` → 밑줄(`_hp`)로 시작하거나 지움(경고는 실행을 막지 않음) / `'` 와 `"` 혼동(`char`와 문자열) → 한 글자는 작은따옴표
- 레퍼런스 대응: 중간 단계(연습 폴더) — `crates/game-core/src/rules.rs`의 `pub const TICK_DT: f32 = 1.0 / TICK_HZ as f32;` 같은 `as` 변환·`f32`·`u32` 쓰임과 같은 문법.

## Day 3 — 제어 흐름 (90분)
- 목표: `if`가 값을 돌려주는 표현식임을 쓴다(`let label = if hp > 0 { "생존" } else { "탈락" };`). `loop`와 `break 값`, `while`, `for t in (1..=3).rev()` 카운트다운, `0..10`과 `0..=10`의 차이를 확인한다. `match`로 키 글자(`'w'`→`(0, -1)` …)·숫자 범위(`0..=59`)·튜플을 나누고 `_` 가지와 "모든 경우를 다뤄야 한다"(E0004)를 확인한다.
- 이미 배운 것: [Day 2](#/day/p3-d02)의 변수·`mut`·튜플·함수·표현식, JS·C#의 if/else·for·while·switch([P1 Day 16](#/day/p1-d16), [P1 Day 17](#/day/p1-d17), [P2 Day 10](#/day/p2-d10)).
- 시작 상태: 어제(Day 2) 끝 상태 그대로예요. 오늘도 `src\main.rs`를 통째로 바꿔요.
  - (Day 2 끝 상태와 같아요. 다르면 [Day 2](#/day/p3-d02)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\.gitignore`
  - `C:\dev\rust-basics\Cargo.lock`
  - `C:\dev\rust-basics\Cargo.toml`
  - `C:\dev\rust-basics\src\main.rs`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\rust-basics\target\`, `C:\dev\rust-basics\.git\`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치)
- 오늘 만들/바꿀 파일:
  - 바꿈 `C:\dev\rust-basics\src\main.rs` — 통째로 바꿈: 라운드 카운트다운(`for t in (1..=3).rev()` → `시작!`), 생존 라벨 `if` 표현식, `fn key_to_dir(key: char) -> (i32, i32)`(`match`로 w/a/s/d, `_ => (0, 0)`), 남은 초를 구간별 안내로 바꾸는 `match secs { 0 => …, 1..=10 => …, _ => … }`, 속도를 반씩 줄이며 횟수를 세는 `loop` + `break count` (레퍼런스 밖 연습 폴더)
- 끝 상태 확인: `cargo run` 출력에 `3`, `2`, `1`, `시작!` 순서, `w` → `(0, -1)`, 줄인 횟수가 보인다.
- 과제:
  1) 1~20틱 중 5의 배수 틱마다 `아이템 생성!` 출력(쉬움) → 정답 요지: `for tick in 1..=20 { if tick % 5 == 0 { … } }`
  2) `(dx, dy)` 튜플을 `match`해서 `"오른쪽 위"` 같은 8방향 이름 돌려주기(보통) → 정답 요지: `match (dx, dy) { (1, -1) => "오른쪽 위", …, _ => "정지" }`
  3) `loop`로 속도 300을 2로 나누며 1보다 작아질 때까지 몇 번인지 `break`로 돌려받기(보통) → 정답 요지: `let n = loop { … if speed < 1.0 { break count; } };`
- 용어(사전 담당): 없음(새 용어 없이 앞 Day 용어를 다시 써요)
  - 링크만 거는 기존 용어(P1·P2 사전에 이미 있음, 다시 정의하지 않음): `[[패턴 매칭]]`
- 자주 막히는 곳 후보: ``error[E0004]: non-exhaustive patterns: `_` not covered`` → `_ =>` 가지 / `if`/`else` 가지의 타입이 달라 `error[E0308]: `if` and `else` have incompatible types` / `if x = 5` → `error[E0308]: mismatched types` … `expected `bool`` → `==` / `loop`가 끝나지 않음 → 터미널에서 `Ctrl + C` / `0..10`에 10이 안 들어감 → `0..=10`
- 레퍼런스 대응: 중간 단계(연습 폴더) — `crates/game-core/src/world.rs`의 `match self.phase { … }`, `for _ in 0..ITEM_COUNT`와 같은 문법.

## Day 4 — 소유권 ① (100분)
- 목표: 스택(크기가 정해진 값)과 힙(`String`처럼 크기가 바뀌는 값)을 그림(`text`)으로 설명한다. `let a = String::from("철수"); let b = a;` 뒤 `a`를 쓰면 E0382가 나는 것을 보고 "주인은 한 명"을 이해한다. 함수에 넘기면 이동한다(`fn greet(name: String)`), 돌려받는 법(`-> String`), `.clone()`으로 복제하는 법, `i32`·`f32`·`bool`·`char`·이들로 된 튜플은 `Copy`라서 그대로 남는 것을 비교한다. 범위(`{}`)가 끝나면 값이 자동으로 정리(drop)된다는 것을 확인한다. `:::info`: C#(P2)은 가비지 컬렉터가 나중에 치우고(유니티에서 프레임이 끊기는 GC 스파이크의 원인), C++은 RAII와 `std::unique_ptr`·이동 의미론으로 Rust와 같은 생각을 한다(브리프 요구: C++ RAII 연결).
- 이미 배운 것: [Day 2](#/day/p3-d02)·[Day 3](#/day/p3-d03)의 변수·함수·제어 흐름, C# 클래스 객체와 참조 타입([P2 Day 12](#/day/p2-d12)), JS 객체를 변수 두 개가 가리키는 경험([P1 Day 19](#/day/p1-d19)), 문자열 이어 붙이기·템플릿 리터럴([P1 Day 16](#/day/p1-d16)).
- 시작 상태: 어제(Day 3) 끝 상태 그대로예요. 오늘도 `src\main.rs`를 통째로 바꿔요.
  - (Day 3 끝 상태와 같아요. 다르면 [Day 3](#/day/p3-d03)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\.gitignore`
  - `C:\dev\rust-basics\Cargo.lock`
  - `C:\dev\rust-basics\Cargo.toml`
  - `C:\dev\rust-basics\src\main.rs`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\rust-basics\target\`, `C:\dev\rust-basics\.git\`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치)
- 오늘 만들/바꿀 파일:
  - 바꿈 `C:\dev\rust-basics\src\main.rs` — 통째로 바꿈: `String::from`, 이동 후 사용(주석 처리한 E0382 예), `fn greet(name: String)`, `fn add_title(name: String) -> String`(소유권을 돌려받기), `.clone()`, `Copy`인 `(f32, f32)` 위치 튜플, `format!("{name}#{n}")`, 범위가 끝날 때 정리되는 것을 보여 주는 블록 (레퍼런스 밖 연습 폴더)
- 끝 상태 확인: `cargo run`이 경고 없이 끝나고, 이동·복제·Copy 비교 출력이 보인다. 주석을 풀면 E0382 원문이 나오는 것을 한 번 확인하고 다시 주석 처리했다.
- 과제:
  1) E0382가 나는 코드를 ① `.clone()` ② 소유권을 돌려받는 함수 두 가지로 고치기(보통) → 정답 요지: 두 코드와 "복제는 힙 복사라 비용이 든다" 해설
  2) 다섯 줄짜리 코드 중 컴파일되는 것 고르기(`i32`·`String`·튜플)(쉬움) → 정답 요지: Copy 타입만 이동 후에도 쓸 수 있음
  3) `fn make_nickname(base: String, n: u32) -> String`을 `format!`으로 만들기(보통) → 정답 요지: `format!("{base}{n}")` 반환
- 용어(사전 담당): 소유권, 스택, 힙, 소유권 이동, 가비지 컬렉션, RAII
- 자주 막히는 곳 후보: `error[E0382]: borrow of moved value: `name`` + `value moved here` 화살표 읽는 법 / 반복문 안에서 이동: `value moved here, in previous iteration of loop` → 반복마다 `.clone()` 또는 Day 5의 빌림 / `expected `String`, found `&str`` → `"철수".to_string()` 또는 `String::from` / "오류가 나면 무조건 `.clone()`" 습관 → Day 5에서 빌림으로 해결한다고 예고
- 레퍼런스 대응: 중간 단계(연습 폴더) — `crates/game-core/src/world.rs`의 `add_player(&mut self, name: String)`(닉네임 소유권을 넘겨받음)와 `vec2.rs`의 `#[derive(… Clone, Copy …)]`가 오늘 개념의 실제 사용처.

## Day 5 — 소유권 ② 빌림 (110분)
- 목표: `fn print_name(name: &str)`처럼 빌려 쓰면 소유권이 그대로임을 확인한다. `fn add_score(score: &mut u32, points: u32)`로 가변 빌림과 `*score += points`를 쓴다. "읽기 빌림 여러 개 또는 쓰기 빌림 하나"(E0502·E0499)와 `mut` 없는 값을 가변으로 빌릴 때(E0596)를 확인한다. `&[u32]` 슬라이스로 `fn total(scores: &[u32]) -> u32`를 for로 만든다. `String`(내 것, 늘릴 수 있음)과 `&str`(빌린 글자 조각)의 차이, `"철수".len()`이 6(바이트)이고 `.chars().count()`가 2(글자)인 것을 확인한다(Day 8·26 닉네임 검사의 근거). 한글 문자열을 바이트 위치로 자르면 panic하는 것을 본다.
- 이미 배운 것: [Day 4](#/day/p3-d04)의 소유권·이동·clone·Copy, [Day 3](#/day/p3-d03)의 for, 배열([P1 Day 17](#/day/p1-d17)), UTF-8([P1 Day 1](#/day/p1-d01)).
- 시작 상태: 어제(Day 4) 끝 상태 그대로예요. 오늘도 `src\main.rs`를 통째로 바꿔요.
  - (Day 4 끝 상태와 같아요. 다르면 [Day 4](#/day/p3-d04)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\.gitignore`
  - `C:\dev\rust-basics\Cargo.lock`
  - `C:\dev\rust-basics\Cargo.toml`
  - `C:\dev\rust-basics\src\main.rs`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\rust-basics\target\`, `C:\dev\rust-basics\.git\`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치)
- 오늘 만들/바꿀 파일:
  - 바꿈 `C:\dev\rust-basics\src\main.rs` — 통째로 바꿈: `print_name(&String)`·`print_name("리터럴")` 둘 다 받는 `&str` 매개변수, `add_score(&mut u32, u32)`, `total(&[u32])`, `best(&[u32]) -> u32`, 바이트 수 vs 글자 수 비교 출력, 슬라이스 `&scores[1..3]` (레퍼런스 밖 연습 폴더)
- 끝 상태 확인: `cargo run` 출력에 `철수 바이트 6, 글자 2`, 점수 합계·최고점, 가변 빌림 후 늘어난 점수가 보인다.
- 과제:
  1) `fn longest_name(names: &[&str]) -> usize`(가장 긴 닉네임의 글자 수)(보통) → 정답 요지: for + `.chars().count()` + 큰 값 기억
  2) E0502가 나는 코드를 빌림 범위를 줄여 고치기(보통) → 정답 요지: 읽기 빌림을 다 쓴 뒤에 가변 빌림
  3) `fn clamp_hp(hp: &mut i32, max: i32)`로 체력이 max를 넘지 않게(쉬움) → 정답 요지: `if *hp > max { *hp = max; }`
- 용어(사전 담당): 빌림, 참조, 가변 참조, 빌림 검사기, 슬라이스, 문자열 슬라이스
- 자주 막히는 곳 후보: `error[E0502]: cannot borrow `scores` as mutable because it is also borrowed as immutable` / `error[E0499]: cannot borrow `x` as mutable more than once at a time` / `error[E0596]: cannot borrow `score` as mutable, as it is not declared as mutable` → `let mut` / 한글을 바이트로 자름: `byte index 1 is not a char boundary` panic → `.chars()` 사용 / `*`를 빼먹어 `cannot add-assign `u32` to `&mut u32`` → `*score += …` / 함수가 참조를 돌려주려다 `error[E0106]: missing lifetime specifier` → Day 12에서 배운다고 안내하고 오늘은 값을 돌려주게
- 레퍼런스 대응: 중간 단계(연습 폴더) — `crates/game-core/src/physics.rs`의 `integrate(body: &mut Body, …)`, `protocol.rs`의 `validate_name(raw: &str)`와 `.chars().count()` 주석이 실제 사용처.

## Day 6 — 구조체와 메서드 (100분)
- 목표: `struct Vec2 { x: f32, y: f32 }`를 만들고 `#[derive(Debug, Clone, Copy, PartialEq)]`를 붙인다(한 줄 설명: Debug=`{:?}` 출력, Clone·Copy=Day 4의 복사, PartialEq=`==` 비교, 자세한 derive는 Day 10). `impl Vec2`에 `const ZERO`, 연관 함수 `fn new(x, y) -> Vec2`, 메서드 `length_squared(self)`, `length(self)`, `dot(self, other)`, `distance(self, other)`, `normalize(self)`(길이 0이면 `ZERO` — 0으로 나누면 NaN), `clamp_length(self, max)`를 만든다(연산자는 아직 없으니 `Vec2::new(self.x * k, self.y * k)`처럼 손으로). `self`(Copy라서 값으로 받아도 됨)·`&self`·`&mut self`의 차이를 `struct Player { name: String, pos: Vec2, score: u32 }`의 `fn new(name: String) -> Player`, `fn move_by(&mut self, delta: Vec2)`, `fn add_score(&mut self, points: u32)`로 비교한다. 오늘부터 Day 10까지 `main.rs`는 지우지 않고 이어서 쌓는다.
- 이미 배운 것: [Day 5](#/day/p3-d05)의 `&`·`&mut`, [Day 4](#/day/p3-d04)의 Copy, C# 클래스·생성자·속성·메서드([P2 Day 12](#/day/p2-d12)), TS interface로 데이터 모양 정하기([P2 Day 5](#/day/p2-d05)), 피타고라스 거리 √(x²+y²)(오늘 한 줄로 설명).
- 시작 상태: 어제(Day 5) 끝 상태 그대로예요. 오늘 `src\main.rs`를 마지막으로 통째로 바꾸고, Day 7~10은 이 파일에 이어서 붙여요.
  - (Day 5 끝 상태와 같아요. 다르면 [Day 5](#/day/p3-d05)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\.gitignore`
  - `C:\dev\rust-basics\Cargo.lock`
  - `C:\dev\rust-basics\Cargo.toml`
  - `C:\dev\rust-basics\src\main.rs`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\rust-basics\target\`, `C:\dev\rust-basics\.git\`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치)
- 오늘 만들/바꿀 파일:
  - 바꿈 `C:\dev\rust-basics\src\main.rs` — 통째로 바꿈(오늘부터 누적): `Vec2`(derive 4개, `ZERO`, `new`, `length_squared`, `length`, `dot`, `distance`, `normalize`, `clamp_length`)와 `Player`(`new`, `move_by`, `add_score`), `main`에서 `(3, 4)`의 길이 5와 정규화 `(0.6, 0.8)`, `ZERO.normalize()`가 `ZERO`인 것 출력 (레퍼런스 밖 연습 폴더)
- 끝 상태 확인: `cargo run` 출력에 `5`, `Vec2 { x: 0.6, y: 0.8 }`, `Vec2 { x: 0.0, y: 0.0 }`, 이동한 플레이어의 `{:?}`가 보인다.
- 과제:
  1) `fn scaled(self, k: f32) -> Vec2` 추가(쉬움) → 정답 요지: `Vec2::new(self.x * k, self.y * k)` (Day 10에서 `*` 연산자로 바뀐다고 예고)
  2) `Player::add_score`를 직접 쓰고 세 번 불러 점수 확인(쉬움) → 정답 요지: `self.score += points;`
  3) `clamp_length(10.0)`과 `clamp_length(1.0)` 결과 예측 후 확인(보통) → 정답 요지: 짧으면 그대로, 길면 정규화 × max
- 용어(사전 담당): 구조체, impl 블록, 연관 함수, 2차원 벡터
- 자주 막히는 곳 후보: ``error[E0277]: `Vec2` doesn't implement `Debug` `` → `#[derive(Debug)]` / `error[E0599]: no method named `length` found` (철자·`Vec2::length()`처럼 self 없이 부름) / `error[E0063]: missing field `score` in initializer of `Player`` / `&mut self` 메서드를 `let p = Player::new(…)`에 부름 → E0596, `let mut p` / 실수 출력이 `0.6`이 아니라 `0.6000001`처럼 보일 수 있음 → 실수 오차 설명(값 비교는 Day 11 테스트에서 허용 오차)
- 레퍼런스 대응: `crates/game-core/src/vec2.rs`의 struct·impl(연산자 오버로딩·테스트·`pub` 제외) — 중간 단계: Day 10에서 연산자로 다듬고 Day 11에서 그대로 `vec2.rs`로 옮겨요.

## Day 7 — 열거형과 match (100분)
- 목표: `enum Phase { Waiting, Playing, Ended }`(derive Debug·Clone·Copy·PartialEq)와 데이터를 담는 `enum ClientMsg { Join { name: String }, Input { seq: u32, dx: f32, dy: f32 }, Ping { ts: f64 } }`를 만든다. `fn phase_label(phase: Phase) -> &'static str`(`'static`은 "프로그램에 박혀 있는 글자"라는 표시 — 한 줄 설명, 자세한 수명은 Day 12)와 `fn describe(msg: &ClientMsg) -> String`을 `match`로 쓰며 필드를 꺼낸다. `fn find_player(players: &[Player], name: &str) -> Option<&Player>`(for로 찾기)를 만들고 `if let Some(p)`와 `match`로 `None`을 다룬다. `:::info`: C#·TS의 enum과 달리 Rust 열거형은 가지마다 데이터를 가진다(유니티 C# 비교).
- 이미 배운 것: [Day 6](#/day/p3-d06)의 구조체·impl·derive 한 줄 설명, [Day 3](#/day/p3-d03)의 match, [Day 5](#/day/p3-d05)의 참조·슬라이스, null·nullable([P2 Day 11](#/day/p2-d11)), TS 유니온·리터럴 타입([P2 Day 5](#/day/p2-d05)).
- 시작 상태: 어제(Day 6) 끝 상태 그대로예요. 오늘은 `src\main.rs`의 `Vec2`·`Player` 아래에 이어서 붙여요.
  - (Day 6 끝 상태와 같아요. 다르면 [Day 6](#/day/p3-d06)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\.gitignore`
  - `C:\dev\rust-basics\Cargo.lock`
  - `C:\dev\rust-basics\Cargo.toml`
  - `C:\dev\rust-basics\src\main.rs`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\rust-basics\target\`, `C:\dev\rust-basics\.git\`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치)
- 오늘 만들/바꿀 파일:
  - 바꿈 `C:\dev\rust-basics\src\main.rs` — 추가: `Phase`, `phase_label`, `ClientMsg`, `describe`, `find_player`; `main`에 메시지 세 개를 `describe`로 출력하고 이름으로 플레이어 찾기(`Some`/`None`) 출력 (레퍼런스 밖 연습 폴더)
- 끝 상태 확인: `cargo run` 출력에 `참가: 철수`, `조작 #1 (1, 0)`, `지연 측정 12.5`, `대기 중`, 찾은 플레이어 점수와 `없어요`가 보인다.
- 과제:
  1) `describe`가 세 가지 메시지를 모두 다루게 완성(쉬움) → 정답 요지: 가지 세 개 + 필드 구조 분해
  2) `fn next_phase(p: Phase) -> Phase`로 Waiting→Playing→Ended→Waiting(쉬움) → 정답 요지: `match` 세 가지
  3) `find_player` 결과를 `if let`과 `match` 두 방식으로 출력(보통) → 정답 요지: `if let Some(p) = … { … } else { … }`
- 용어(사전 담당): Option
  - 링크만 거는 기존 용어(P1·P2 사전에 이미 있음, 다시 정의하지 않음): `[[열거형]]`
- 자주 막히는 곳 후보: 가지를 추가한 뒤 `error[E0004]: non-exhaustive patterns` → 모든 match에 새 가지 / `Phase.Waiting`(점) → `Phase::Waiting` / `==`로 비교하려는데 `error[E0369]: binary operation `==` cannot be applied to type `Phase`` → `PartialEq` derive / `None`에 `.unwrap()` → `called `Option::unwrap()` on a `None` value` panic / ``error[E0106]: missing lifetime specifier``(입력 참조 없이 `&str` 반환) → `&'static str`
- 레퍼런스 대응: `crates/game-core/src/protocol.rs`의 `ClientMsg`·`Phase` 모양(serde 속성·`parse` 제외) — 중간 단계: Day 11에서 serde를 붙여 game-core로 옮겨요.

## Day 8 — 오류 처리 (100분)
- 목표: `Result<T, E>`와 `Ok`/`Err`, `match`로 결과를 나누는 법을 쓴다. `enum NameError { Empty, TooLong }` + `fn message(self) -> &'static str`를 만들고 `fn validate_name(raw: &str) -> Result<String, NameError>`(앞뒤 공백 `trim`, 비었으면 `Empty`, `.chars().count() > 12`면 `TooLong`, 아니면 `Ok(name.to_string())`)를 만든다. `"12".parse::<u32>()`의 `Result`, `?`로 오류를 위로 넘기는 `fn parse_two(a: &str, b: &str) -> Result<u32, std::num::ParseIntError>`, `unwrap`/`expect`와 panic(복구할 수 없는 버그), 배열 범위 밖 인덱스 panic을 비교한다. "방이 꽉 참 = Result, 프로그램 버그 = panic" 기준을 정한다. `:::info`: C# 예외(P2 Day 15)와 비교.
- 이미 배운 것: [Day 7](#/day/p3-d07)의 열거형·match·Option·`'static` 한 줄 설명, [Day 5](#/day/p3-d05)의 `&str`·`.chars().count()`·`trim` 같은 문자열 메서드, C# try/catch·예외([P2 Day 15](#/day/p2-d15)), 폼 검증 경험([P1 Day 24](#/day/p1-d24)).
- 시작 상태: 어제(Day 7) 끝 상태 그대로예요. 오늘도 `src\main.rs`에 이어서 붙여요.
  - (Day 7 끝 상태와 같아요. 다르면 [Day 7](#/day/p3-d07)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\.gitignore`
  - `C:\dev\rust-basics\Cargo.lock`
  - `C:\dev\rust-basics\Cargo.toml`
  - `C:\dev\rust-basics\src\main.rs`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\rust-basics\target\`, `C:\dev\rust-basics\.git\`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치)
- 오늘 만들/바꿀 파일:
  - 바꿈 `C:\dev\rust-basics\src\main.rs` — 추가: `NameError`(`Empty`, `TooLong`)와 `message`, `validate_name`, `parse_two`(`?` 사용), `main`에서 `"  철수  "`→`Ok("철수")`, `""`→`Empty` 안내 문구, 13자→`TooLong` 출력 (레퍼런스 밖 연습 폴더)
- 끝 상태 확인: `cargo run` 출력에 `Ok("철수")`, `닉네임을 입력해 주세요.`, `닉네임은 12자까지 쓸 수 있어요.`, `parse_two` 합계와 오류 안내가 보인다.
- 과제:
  1) `fn parse_input(dx: &str, dy: &str) -> Result<(f32, f32), String>`을 `match`로(보통) → 정답 요지: 두 `parse::<f32>()`를 match, 실패 시 `Err(format!(…))`
  2) 같은 함수를 `?`와 `std::num::ParseFloatError`로 다시 쓰기(보통) → 정답 요지: `let x = dx.trim().parse::<f32>()?;` … `Ok((x, y))`
  3) 상황 네 개에 Result와 panic 중 무엇을 쓸지 고르고 이유 쓰기(쉬움) → 정답 요지: 사용자 입력·네트워크 = Result, 불가능해야 하는 상태 = panic
- 용어(사전 담당): Result, ? 연산자, panic
- 자주 막히는 곳 후보: ``error[E0277]: `?` couldn't convert the error to `…` `` (오류 타입이 다름) → 반환 타입을 맞추거나 `map_err`(Day 9에서 클로저 배운 뒤) / `main` 안에서 `?` → ``the `?` operator can only be used in a function that returns `Result` or `Option` `` / `called `Result::unwrap()` on an `Err` value: ParseIntError { kind: InvalidDigit }` 원문 읽기(`thread 'main' panicked at src\main.rs:줄:칸`) / `"12".parse()`만 쓰면 `error[E0284]: type annotations needed` → `parse::<u32>()` / 한글 닉네임 길이를 `.len()`으로 재서 4글자 한글이 TooLong이 됨 → `.chars().count()`(Day 5 복습)
- 레퍼런스 대응: `crates/game-core/src/protocol.rs`의 `NameError`·`validate_name`(Empty·TooLong 부분만) — 중간 단계: Day 26에서 game-core로 옮기고 Day 32에서 `BadChar`·`Banned`를 더해요. `crates/server/src/main.rs`의 `run() -> Result<(), String>` 패턴은 Day 37.

## Day 9 — 컬렉션과 반복자 (110분)
- 목표: `Vec<Player>`에 `push`하고 `iter()`(읽기)·`iter_mut()`(쓰기)로 돈다. `players.iter().any(|p| p.name == name)`로 중복 닉네임을, `players.retain(|p| p.id != id)`로 퇴장을, `iter().map(|p| p.score).sum::<u32>()`로 합계를 만든다. 클로저가 바깥 변수를 붙잡는 것(`let min = 3; filter(|p| p.score >= min)`)을 본다. `sort_by_key(|p| std::cmp::Reverse(p.score))`가 안정 정렬이라 동점이면 들어온 순서가 남는 것을 확인하고 `enumerate`로 `1등`부터 출력한다. `HashMap<String, u32>`에 라운드별 기록을 넣고 `entry(name).or_insert(0)`으로 닉네임별 최고점을 만든다(Day 36 SQL `GROUP BY … MAX`의 예고). `Player`에 `id: u32` 필드를 더한다. `:::info`: JS `map/filter`(P1 Day 19), C# LINQ(P2 Day 14)와 같은 생각.
- 이미 배운 것: [Day 6](#/day/p3-d06)~[Day 8](#/day/p3-d08)의 구조체·열거형·Option·Result, [Day 5](#/day/p3-d05)의 빌림, JS 배열 메서드와 화살표 함수([P1 Day 19](#/day/p1-d19)), C# List·Dictionary·LINQ·람다([P2 Day 11](#/day/p2-d11), [P2 Day 14](#/day/p2-d14)).
- 시작 상태: 어제(Day 8) 끝 상태 그대로예요. 오늘도 `src\main.rs`에 이어서 붙여요.
  - (Day 8 끝 상태와 같아요. 다르면 [Day 8](#/day/p3-d08)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\.gitignore`
  - `C:\dev\rust-basics\Cargo.lock`
  - `C:\dev\rust-basics\Cargo.toml`
  - `C:\dev\rust-basics\src\main.rs`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\rust-basics\target\`, `C:\dev\rust-basics\.git\`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치)
- 오늘 만들/바꿀 파일:
  - 바꿈 `C:\dev\rust-basics\src\main.rs` — 추가·수정: `Player`에 `id` 필드, `fn ranking(players: &[Player]) -> Vec<(String, u32)>`(정렬된 복사본), 중복 닉네임 검사 `any`, 퇴장 `retain`, 닉네임별 최고점 `HashMap`, `main`에서 순위표 출력 (레퍼런스 밖 연습 폴더)
- 끝 상태 확인: `cargo run` 출력에 `1등 나 3점`, `2등 가 1점`, `3등 다 1점`(동점은 들어온 순), `이미 있는 닉네임이에요`, 최고점 표가 보인다.
- 과제:
  1) 모든 플레이어 점수 합계를 반복자 한 줄로(쉬움) → 정답 요지: `players.iter().map(|p| p.score).sum::<u32>()`
  2) `(이름, 점수)` 라운드 기록 목록에서 닉네임별 최고점 HashMap 만들기(보통) → 정답 요지: `let best = map.entry(name.clone()).or_insert(0); if score > *best { *best = score; }`
  3) 점수 0인 플레이어를 `retain`으로 지우기(쉬움) → 정답 요지: `players.retain(|p| p.score > 0);`
- 용어(사전 담당): Vec, HashMap, 반복자, 클로저
- 자주 막히는 곳 후보: 반복하면서 같은 Vec에 push → E0502(Day 5 규칙) / `index out of bounds: the len is 3 but the index is 3` panic / `error[E0282]: type annotations needed` (`collect`) → `let v: Vec<_> = …` 또는 `collect::<Vec<_>>()` / ``error[E0507]: cannot move out of index of `Vec<Player>` `` (`players[0].name`을 꺼냄) → `.clone()` 또는 `&` / HashMap을 출력하면 순서가 매번 다름 → 정상(순서 없음) / `iter()`가 주는 것은 참조(`&Player`) → 비교할 때 `p.name == name` 타입 맞추기
- 레퍼런스 대응: `crates/game-core/src/world.rs`의 `add_player`(any)·`remove_player`(retain)·`ranking`(`sort_by_key` + `Reverse`)과 같은 방식 — 중간 단계(연습 폴더).

## Day 10 — 트레이트와 제네릭 (110분)
- 목표: `trait Scored { fn score(&self) -> u32; }`를 `Player`에 구현하고, 제네릭 함수 `fn best<T: Scored>(items: &[T]) -> u32`(트레이트 경계)를 만든다. derive가 "표준 트레이트 구현을 자동으로 써 주는 것"임을 Debug·Clone·Copy·PartialEq·Default로 설명하고 `Vec2`에 `Default`를 더한다. `std::ops`의 `Add`, `Sub`, `Mul<f32>`, `AddAssign`, `SubAssign`을 `Vec2`에 구현한다(레퍼런스 `vec2.rs`와 같은 코드). `distance`를 `(self - other).length()`로, `clamp_length`를 `self.normalize() * max`로 다듬는다. `2.0 * v`는 안 되고 `v * 2.0`만 되는 이유(구현한 방향만 있음)를 본다. `:::info`: 트레이트 ≈ C# 인터페이스(P2 Day 13), 제네릭은 P2 Day 6과 같은 생각, C++ 연산자 오버로딩과 같은 문법적 설탕.
- 이미 배운 것: [Day 6](#/day/p3-d06)의 Vec2·impl·derive 한 줄 설명, [Day 9](#/day/p3-d09)의 Vec·반복자, [Day 4](#/day/p3-d04)의 Copy, C# 인터페이스·다형성([P2 Day 13](#/day/p2-d13)), TS 제네릭([P2 Day 6](#/day/p2-d06)).
- 시작 상태: 어제(Day 9) 끝 상태 그대로예요. 오늘도 `src\main.rs`에 이어서 붙여요.
  - (Day 9 끝 상태와 같아요. 다르면 [Day 9](#/day/p3-d09)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\.gitignore`
  - `C:\dev\rust-basics\Cargo.lock`
  - `C:\dev\rust-basics\Cargo.toml`
  - `C:\dev\rust-basics\src\main.rs`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\rust-basics\target\`, `C:\dev\rust-basics\.git\`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치)
- 오늘 만들/바꿀 파일:
  - 바꿈 `C:\dev\rust-basics\src\main.rs` — 수정·추가: `Vec2` derive에 `Default`, 연산자 구현 5개(`impl Add for Vec2` …), `distance`·`clamp_length`를 연산자로 다듬기, `trait Scored` + `impl Scored for Player`, `fn best<T: Scored>`, `main`에서 `a + b`, `a - b`, `a * 2.0`, `c += b` 출력 (레퍼런스 밖 연습 폴더)
- 끝 상태 확인: `cargo run` 출력에 `Vec2 { x: 4.0, y: 2.0 }`(a+b), `Vec2 { x: 6.0, y: 8.0 }`(a*2), 최고 점수가 보인다. `Vec2` 부분이 레퍼런스 `vec2.rs`의 테스트 앞 코드와 같은 모양이다(`pub`·문서 주석 제외).
- 과제:
  1) `AddAssign`을 보고 `SubAssign`을 직접 구현(쉬움) → 정답 요지: `fn sub_assign(&mut self, other: Vec2) { *self = *self - other; }`
  2) `trait Scored`를 아이템(점수 1)에도 구현하고 `best`에 넣기(보통) → 정답 요지: `struct Item { … }` + `impl Scored for Item`
  3) `#[derive(Default)]`를 붙인 구조체를 `Default::default()`로 만들어 출력(쉬움) → 정답 요지: 숫자 0, 문자열 빈칸
- 용어(사전 담당): 트레이트, derive, 연산자 오버로딩, 트레이트 경계
- 자주 막히는 곳 후보: ``error[E0369]: cannot add `Vec2` to `Vec2` `` → `impl Add for Vec2` / ``error[E0277]: cannot multiply `{float}` by `Vec2` `` (`2.0 * v`) → `v * 2.0` / `String` 필드가 있는 구조체에 `Copy` derive → ``error[E0204]: the trait `Copy` cannot be implemented for this type`` / `use std::ops::{Add, …};` 빠뜨림 → `error[E0405]: cannot find trait `Add` in this scope` / `type Output = Vec2;` 빠뜨림 → `error[E0046]: not all trait items implemented, missing: `Output``
- 레퍼런스 대응: `crates/game-core/src/vec2.rs`의 테스트 앞부분 전체(구조체·메서드·연산자 오버로딩, `pub`·`const fn`·문서 주석 제외) — Day 11에서 그대로 옮겨요.

## Day 11 — 모듈·워크스페이스·테스트 (120분)
- 목표: `mod`·`pub`·`use`·`crate::`와 크레이트·워크스페이스를 설명한다. `C:\dev\viewer-arena` 폴더를 만들고 `git init`, 루트 `Cargo.toml`을 손으로 쓴다(`[workspace] resolver = "3"`, `members = ["crates/game-core"]`, `[workspace.package]` version·edition 2024·`rust-version = "1.94"`·publish false, `[workspace.dependencies]` game-core 경로·`serde = { version = "=1.0.229", features = ["derive"] }`·`serde_json = "=1.0.154"`, `=`로 버전 고정 이유). `cargo new --lib --vcs none crates\game-core`(중첩 `.git` 방지)로 만들고 크레이트 `Cargo.toml`을 `version.workspace = true` 식으로 바꾼다. Day 10의 `Vec2`를 `src\vec2.rs`로 옮겨 `pub`·`pub const fn new`(컴파일할 때도 부를 수 있는 함수 — 한 줄)·문서 주석(`///`, `//!`)을 붙이고 `#[cfg(test)] mod tests`에 `vec2_ops`, `normalize_zero_is_zero`를 쓴다. `src\protocol.rs`에 Day 7의 `Phase`(`#[derive(…, Serialize, Deserialize)] #[serde(rename_all = "lowercase")]`)와 `ClientMsg`(`#[serde(tag = "t", rename_all = "camelCase")]`)를 옮기고 `serde_json::from_str`/`to_string` 왕복 테스트 `client_msg_roundtrip_json`(오늘판: `parse` 없이 `serde_json::from_str` 사용)을 쓴다. `src\lib.rs`에 `pub mod protocol; pub mod vec2;`와 "모듈 의존은 한 방향(protocol은 serde만 쓴다, vec2는 아무것도 안 쓴다)" 주석. `cargo test -p game-core` → 3개 통과. 첫 커밋.
- 이미 배운 것: [Day 6](#/day/p3-d06)~[Day 10](#/day/p3-d10)의 Vec2·열거형·derive·트레이트, [Day 1](#/day/p3-d01)의 cargo, JSON([P1 Day 25](#/day/p1-d25)), import/export 모듈([P2 Day 6](#/day/p2-d06)), 단위 테스트·assert([P2 Day 35](#/day/p2-d35)), package.json·잠금 파일([P2 Day 3](#/day/p2-d03)), Git init·커밋·.gitignore([P1 Day 7](#/day/p1-d07)).
- 시작 상태: 어제(Day 10) 끝 상태예요. 오늘 `C:\dev\viewer-arena`를 새로 만들어요(P3 끝까지 쓰는 진짜 프로젝트 폴더). 인터넷이 필요해요(crates.io에서 serde를 받아요).
  - (Day 10 끝 상태와 같아요. 다르면 [Day 10](#/day/p3-d10)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\.gitignore`
  - `C:\dev\rust-basics\Cargo.lock`
  - `C:\dev\rust-basics\Cargo.toml`
  - `C:\dev\rust-basics\src\main.rs`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\rust-basics\target\`, `C:\dev\rust-basics\.git\`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치)
- 오늘 만들/바꿀 파일:
  - 새로 만듦 `C:\dev\viewer-arena\Cargo.toml` — 워크스페이스 뼈대: 맨 위 주석, `[workspace]` resolver "3"·members `["crates/game-core"]`, `[workspace.package]`, `[workspace.dependencies]` game-core·serde·serde_json만 (레퍼런스 `Cargo.toml`의 앞부분) (레퍼런스 `reference/p3-viewer-arena/Cargo.toml`)
  - 새로 만듦 `C:\dev\viewer-arena\Cargo.lock` — 첫 `cargo build`/`cargo test`가 만듦(커밋함) (레퍼런스 `reference/p3-viewer-arena/Cargo.lock`)
  - 새로 만듦 `C:\dev\viewer-arena\.gitignore` — `/target/` 한 줄(+ 첫 줄 주석 "빌드 결과물은 커밋하지 않아요…") (레퍼런스 `reference/p3-viewer-arena/.gitignore`)
  - 새로 만듦 `C:\dev\viewer-arena\crates\game-core\Cargo.toml` — `[package] name = "game-core"` + `version.workspace = true` 등 4줄, `[dependencies] serde = { workspace = true }`, `serde_json = { workspace = true }` (레퍼런스와 같음, rand 줄 제외) (레퍼런스 `reference/p3-viewer-arena/crates/game-core/Cargo.toml`)
  - 새로 만듦 `C:\dev\viewer-arena\crates\game-core\src\lib.rs` — `//!` 크레이트 설명 + 의존 방향 주석 + `pub mod protocol; pub mod vec2;` (physics·rules·world는 Day 19) (레퍼런스 `reference/p3-viewer-arena/crates/game-core/src/lib.rs`)
  - 새로 만듦 `C:\dev\viewer-arena\crates\game-core\src\vec2.rs` — Day 10의 Vec2 + `pub` + 테스트 2개 — 레퍼런스 `vec2.rs`와 똑같음 (레퍼런스 `reference/p3-viewer-arena/crates/game-core/src/vec2.rs`)
  - 새로 만듦 `C:\dev\viewer-arena\crates\game-core\src\protocol.rs` — 오늘판: `use serde::{Deserialize, Serialize};`, `Phase`(lowercase), `ClientMsg`(tag "t", camelCase), 테스트 `client_msg_roundtrip_json`(`serde_json::from_str` 왕복) (레퍼런스 `reference/p3-viewer-arena/crates/game-core/src/protocol.rs`)
  - 오늘 생기는 생성물(커밋 안 함): `C:\dev\viewer-arena\target\`, `C:\dev\viewer-arena\.git\`
- 끝 상태 확인: `C:\dev\viewer-arena`에서 `cargo test -p game-core` → `running 3 tests` … `test result: ok. 3 passed; 0 failed`. VS Code로 `C:\dev\viewer-arena`를 열면 테스트 위에 `▶ Run Test`가 보인다. `git log --oneline`에 첫 커밋 1개.
- 과제:
  1) `lib.rs`에서 `pub mod vec2`의 `pub`을 지우고 오류(E0603 private module)를 본 뒤 되돌리기(쉬움) → 정답 요지: 크레이트 밖에서 쓰려면 `pub`
  2) `vec2_ops`의 기대값 하나를 일부러 틀리게 바꿔 실패 메시지(`left`/`right`)를 읽고 되돌리기(쉬움) → 정답 요지: `assertion `left == right` failed` 뒤의 두 값 비교
  3) `cargo test -p game-core vec2`로 이름이 맞는 테스트만 돌리고, `protocol`이 `vec2`를 `use`하지 않는 이유 쓰기(보통) → 정답 요지: 2개만 실행, 한 방향 의존이라 서로 부르는 순환이 없음
- 용어(사전 담당): 크레이트, 워크스페이스, pub, serde, 역직렬화
  - 링크만 거는 기존 용어(P1·P2 사전에 이미 있음, 다시 정의하지 않음): `[[직렬화]]`, `[[모듈]]`, `[[단위 테스트]]`
- 자주 막히는 곳 후보: `error: failed to load manifest for workspace member` (members 경로 오타, 백슬래시) → `"crates/game-core"`(슬래시) / `error: current package believes it's in a workspace when it's not` → 루트 Cargo.toml의 members 확인, `C:\dev\viewer-arena`에서 명령 실행 / `--vcs none`을 빠뜨려 `crates\game-core\.git`이 생김 → 그 폴더만 지움(`:::warn`, 전체 경로) / `error[E0433]: failed to resolve: use of unresolved module or unlinked crate `serde_json`` → game-core의 `[dependencies]`에 추가 / `cargo new`가 members 줄을 자동으로 고쳐 중복·형식이 바뀜(작성자가 실제 출력 확인) → 최종 내용을 정답과 비교 / crates.io 다운로드가 회사·학교망에서 막힘 → 다른 네트워크 / edition 2024를 모르는 옛 Rust → `rustc --version`이 1.94 이상인지(Day 1)
- 레퍼런스 대응: `reference/p3-viewer-arena/Cargo.toml`(워크스페이스 뼈대: members는 game-core만, 의존성은 game-core·serde·serde_json만), `crates/game-core/Cargo.toml`(rand 줄 제외), `crates/game-core/src/lib.rs`(protocol·vec2만), `crates/game-core/src/vec2.rs`(최종과 같음), `crates/game-core/src/protocol.rs`(중간 단계: Phase·ClientMsg와 serde 왕복 테스트만 — Day 19·24·26·32에서 채움), `.gitignore`(`/target/`만).

## Day 12 — 수명·스마트 포인터·동시성 맛보기 (120분)
- 목표: `fn longer<'a>(a: &'a str, b: &'a str) -> &'a str`로 E0106을 고치며 수명이 "참조가 얼마나 오래 유효한가"를 컴파일러에게 알려 주는 표시임을 이해한다. `const PLAYER_COLORS: [&'static str; 3]`로 `'static`을 다시 본다. `Box<T>`(힙에 하나), `Rc<T>`(한 스레드에서 여러 주인, `Rc::strong_count`), `Arc<T>`(여러 스레드), `Mutex<T>`(한 번에 한 명만 `lock()`)를 짧은 예제로 비교한다. `std::thread::spawn(move || …)` 4개가 `Arc<Mutex<Vec<u32>>>` 점수판에 점수를 넣고 `join()`으로 기다리는 프로그램을 만든다. E0373(`move` 빠짐)과 `Rc`를 스레드로 보낼 때의 E0277(`Rc<…>` cannot be sent between threads safely)로 Rust가 데이터 경쟁을 컴파일할 때 막는 것을 본다. 예고: Day 22 서버 상태와 Day 29 방 목록은 `Arc<Mutex<…>>`, Day 25 방 하나는 잠금 없이 액터로. `:::info`: C++ `std::shared_ptr`·`std::unique_ptr`·`std::mutex`, 언리얼의 게임 스레드와 비교.
- 이미 배운 것: [Day 4](#/day/p3-d04)·[Day 5](#/day/p3-d05)의 소유권·빌림, [Day 9](#/day/p3-d09)의 클로저·Vec, [Day 10](#/day/p3-d10)의 트레이트, [Day 11](#/day/p3-d11)의 모듈, C# async·Task([P2 Day 15](#/day/p2-d15)).
- 시작 상태: 어제(Day 11) 끝 상태예요. 오늘은 연습 폴더 `C:\dev\rust-basics`의 `src\main.rs`를 통째로 바꿔요(Vec2 등은 어제 viewer-arena로 옮겼어요). `C:\dev\viewer-arena`는 그대로 둬요.
  - (Day 11 끝 상태와 같아요. 다르면 [Day 11](#/day/p3-d11)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\.gitignore`
  - `C:\dev\rust-basics\Cargo.lock`
  - `C:\dev\rust-basics\Cargo.toml`
  - `C:\dev\rust-basics\src\main.rs`
  - `C:\dev\viewer-arena\.gitignore`
  - `C:\dev\viewer-arena\Cargo.lock`
  - `C:\dev\viewer-arena\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-core\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-core\src\lib.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\protocol.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\vec2.rs`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\rust-basics\target\`, `C:\dev\rust-basics\.git\`, `C:\dev\viewer-arena\target\`, `C:\dev\viewer-arena\.git\`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치)
- 오늘 만들/바꿀 파일:
  - 바꿈 `C:\dev\rust-basics\src\main.rs` — 통째로 바꿈: `longer<'a>`, `PLAYER_COLORS`, `Box`·`Rc` 짧은 예, 스레드 4개 + `Arc<Mutex<Vec<u32>>>` 점수판, 합계 출력 (레퍼런스 밖 연습 폴더)
- 끝 상태 확인: `cargo run`(위치 `C:\dev\rust-basics`) 출력에 `더 긴 닉네임: …`, `Rc 주인 수: 2`, 스레드 4개의 작업 줄(순서는 실행마다 다를 수 있음), `점수판 합계: 400`이 보인다.
- 과제:
  1) E0106이 나는 `fn longer(a: &str, b: &str) -> &str`에 수명 붙이기(보통) → 정답 요지: `<'a>`를 세 곳에
  2) `Rc`를 스레드로 보내 E0277을 보고 `Arc`로 고치기(보통) → 정답 요지: `use std::sync::Arc;` + `Arc::clone(&board)`
  3) 1~1000을 스레드 4개가 나눠 `Arc<Mutex<u64>>`에 더해 500500 만들기(도전) → 정답 요지: 구간 4개 + `*total.lock().unwrap() += n`
- 용어(사전 담당): 수명, 스마트 포인터, Arc, Mutex, 스레드, 동시성, 데이터 경쟁
- 자주 막히는 곳 후보: `error[E0106]: missing lifetime specifier` / `error[E0373]: closure may outlive the current function, but it borrows `board`` → `move ||` / ``error[E0277]: `Rc<Mutex<Vec<u32>>>` cannot be sent between threads safely`` → `Arc` / 같은 스레드에서 `lock()`을 두 번 해 프로그램이 멈춤(교착) → `Ctrl + C`, 잠금 범위를 짧게 / 출력 순서가 실행마다 다름 → 정상(스레드는 동시에 돈다) / `join()`을 안 해서 일부 출력이 빠짐
- 레퍼런스 대응: 연습 폴더(레퍼런스 파일 변경 없음) — `crates/server/src/rooms.rs`의 `Arc<Mutex<HashMap<String, RoomHandle>>>`, `crates/game-core/src/world.rs`의 `color: &'static str`, `rules.rs`의 `PLAYER_COLORS: [&str; 12]`를 미리 보는 날.

## Day 13 — 게임 루프의 원리 (110분)
- 목표: 게임 루프(입력 → 갱신(update) → 그리기(render) → 반복)와 프레임·FPS를 설명한다. "프레임마다 5px"는 144Hz 모니터에서 2.4배 빨라지고 "초당 300px × dt"는 어디서나 같다는 것을 계산으로 보인다. `:::info`: 유니티 `Update()`와 `Time.deltaTime`이 정확히 이것(브리프 요구). `C:\dev\viewer-arena`에서 `npm create vite@9.3.3 client -- --template vanilla-ts`(마지막 질문 `Install with npm and start now?` → 아니오) → `package.json`의 name `viewer-arena-client`, version `0.1.0`, `typescript`·`vite`를 `7.0.2`·`8.3.5`로 `^`·`~` 없이 고정 → `cd client` → `npm install`. 템플릿 파일 정리(지움: `src\counter.ts`, `src\main.ts`, `src\assets\` 폴더, `public\icons.svg`, `client\.gitignore` → 루트 `.gitignore`에 두 줄 추가). `public\favicon.svg`를 아레나 아이콘으로 바꾼다. `index.html`은 임시 첫 화면(제목 + `/play.html` 링크), `play.html` + `src\play.ts`는 DOM 상자(`div#ball`, P1의 DOM)를 `requestAnimationFrame` 루프로 좌우 왕복시키고 FPS를 표시한다. `dt = Math.min((now - last) / 1000, 0.1)`로 탭을 다녀와도 순간이동하지 않게 한다. `npm run dev` → `http://localhost:5173/play.html`.
- 이미 배운 것: [P2 Day 7](#/day/p2-d07)의 Vite(vanilla-ts 템플릿·dev 서버·`npm run dev`), TS 기본 타입·함수·모듈([P2 Day 4](#/day/p2-d04)~[P2 Day 6](#/day/p2-d06)), DOM `querySelector`·`style`·`textContent`([P1 Day 20](#/day/p1-d20)), CSS 박스·`transform`·`transition` 감각([P1 Day 10](#/day/p1-d10), [P1 Day 14](#/day/p1-d14)), npm·실행 정책([P2 Day 3](#/day/p2-d03)), `.gitignore`([P1 Day 7](#/day/p1-d07)), [Day 2](#/day/p3-d02)의 dt·초 계산.
- 시작 상태: 어제(Day 12) 끝 상태예요. 오늘부터 Day 18까지는 Rust를 잠시 두고 TypeScript로 로컬 게임을 먼저 완성해요(Day 19에서 Rust로 옮겨요). Node.js는 P2에서 설치했어요(`node --version` 22.12 이상, 권장 26). 인터넷이 필요해요.
  - (Day 12 끝 상태와 같아요. 다르면 [Day 12](#/day/p3-d12)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\` 연습 폴더(Day 12까지 사용, 이후 그대로 둠)
  - `C:\dev\viewer-arena\.gitignore`
  - `C:\dev\viewer-arena\Cargo.lock`
  - `C:\dev\viewer-arena\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-core\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-core\src\lib.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\protocol.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\vec2.rs`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\viewer-arena\target\`, `C:\dev\viewer-arena\.git\`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치)
- 오늘 만들/바꿀 파일:
  - 새로 만듦 `C:\dev\viewer-arena\client\package.json` — 템플릿에서 수정: name `viewer-arena-client`, version `0.1.0`, scripts `dev`·`build`(`tsc && vite build`)·`preview`, devDependencies `typescript: "7.0.2"`, `vite: "8.3.5"` (레퍼런스에서 `wasm` 스크립트·`dependencies` 뺀 모양) (레퍼런스 `reference/p3-viewer-arena/client/package.json`)
  - 새로 만듦 `C:\dev\viewer-arena\client\package-lock.json` — `npm install`이 만듦(커밋함) (레퍼런스 `reference/p3-viewer-arena/client/package-lock.json`)
  - 새로 만듦 `C:\dev\viewer-arena\client\tsconfig.json` — 템플릿 그대로 — 레퍼런스와 같음(`erasableSyntaxOnly`·`noUnusedLocals` 의미 한 줄씩) (레퍼런스 `reference/p3-viewer-arena/client/tsconfig.json`)
  - 새로 만듦 `C:\dev\viewer-arena\client\public\favicon.svg` — 아레나 아이콘(원 + 플레이어 두 개 + 아이템) — 레퍼런스와 같음 (레퍼런스 `reference/p3-viewer-arena/client/public/favicon.svg`)
  - 새로 만듦 `C:\dev\viewer-arena\client\index.html` — 임시 첫 화면: `<html lang="ko">`, title `Viewer Arena`, `body.page-home`, `main.card` 안 `h1` + `/play.html` 링크("로컬 게임 열기"), `<script type="module" src="/src/home.ts">` (레퍼런스 `reference/p3-viewer-arena/client/index.html`)
  - 새로 만듦 `C:\dev\viewer-arena\client\src\home.ts` — 임시: `import './style.css';` 한 줄(Day 29에 방 만들기 화면이 됨) (레퍼런스 `reference/p3-viewer-arena/client/src/home.ts`)
  - 새로 만듦 `C:\dev\viewer-arena\client\play.html` — 임시: title `Viewer Arena · 참가`, `body.page-play`, `main` 안 `div#ball`, `p#fps`, `<script type="module" src="/src/play.ts">` (레퍼런스 `reference/p3-viewer-arena/client/play.html`)
  - 새로 만듦 `C:\dev\viewer-arena\client\src\play.ts` — 임시: `requestAnimationFrame(frame)` 루프, `last`·`dt`(0.1초 상한), `x += speed * dt`, 벽에서 방향 반전, `transform: translateX(...)`, 1초마다 FPS 갱신 (레퍼런스 `reference/p3-viewer-arena/client/src/play.ts`)
  - 새로 만듦 `C:\dev\viewer-arena\client\src\style.css` — 레퍼런스 첫 부분: 맨 위 주석, `:root` 색 변수·글꼴, `* { box-sizing }`, `[hidden] { display: none !important; }`(이유 주석), `body`, `h1, h2`; 임시 `#ball` 스타일 (레퍼런스 `reference/p3-viewer-arena/client/src/style.css`)
  - 바꿈 `C:\dev\viewer-arena\.gitignore` — `/client/node_modules/`, `/client/dist/` 두 줄 추가 (레퍼런스 `reference/p3-viewer-arena/.gitignore`)
  - 오늘 생기는 생성물(커밋 안 함): `C:\dev\viewer-arena\client\node_modules\`
- 끝 상태 확인: `C:\dev\viewer-arena\client`에서 `npm run dev` → `VITE v8.3.5  ready in … ms`, `Local:   http://localhost:5173/`. 브라우저 `http://localhost:5173/play.html`에서 공(상자)이 초당 300px로 좌우 왕복하고 `FPS 60`(모니터에 따라 다름)이 보인다. `http://localhost:5173/`에 링크가 보인다. `npx tsc --noEmit` 오류 없음.
- 과제:
  1) 속도를 초당 200px로 바꾸고 1000px를 가는 데 5초인지 확인 후 300으로 되돌리기(쉬움) → 정답 요지: `const SPEED = 200;`, 시간 = 거리 ÷ 속도
  2) `x += 5`(프레임 고정) 버전과 비교해 왜 dt가 필요한지 쓰기(보통) → 정답 요지: 60Hz·144Hz에서 초당 300px vs 720px
  3) `dt` 상한(0.1)을 지우고 다른 탭을 5초 보고 돌아왔을 때 어떻게 되는지 관찰 후 되돌리기(보통) → 정답 요지: 한 프레임에 1500px 이동 → 상한으로 막음
- 용어(사전 담당): 게임 루프, 프레임, 델타 타임, requestAnimationFrame
- 자주 막히는 곳 후보: `Need to install the following packages: create-vite@9.3.3 Ok to proceed? (y)` → `y` + `Enter` / `npm.ps1 … UnauthorizedAccess` 실행 정책 오류 → P2 Day 3의 `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` / `C:\dev\viewer-arena\client` 안에서 다시 `npm create`를 해 `client\client`가 생김 → 위치 확인(`Get-Location`) / 5173 포트를 다른 dev 서버가 쓰면 Vite가 5174로 바꿈 → 터미널에 찍힌 주소를 씀 / `play.html`을 파일 탐색기에서 더블클릭(`file://`)해 아무것도 안 움직임 → dev 서버 주소로 열기 / 템플릿 파일을 지운 뒤 `index.html`이 여전히 `/src/main.ts`를 불러 404 → 오늘 바꾼 `index.html`인지 확인 / `error TS6133: 'x' is declared but its value is never read.` (noUnusedLocals) → 안 쓰는 변수 지우기
- 레퍼런스 대응: `client/package.json`(중간 단계: `wasm` 스크립트·`qrcode-generator` 없음 — Day 20·30), `client/package-lock.json`, `client/tsconfig.json`(최종과 같음), `client/public/favicon.svg`(최종과 같음), `client/src/style.css` 맨 앞 공통 부분; `client/index.html`·`client/src/home.ts`(Day 29), `client/play.html`·`client/src/play.ts`(Day 26~31)는 중간 단계 — 레퍼런스와 다름. `.gitignore` 두 줄은 최종과 같음.

## Day 14 — Canvas 2D (100분)
- 목표: `<canvas>`와 2D 렌더링 컨텍스트, 캔버스 좌표계(왼쪽 위 0,0, y는 아래가 +)를 설명한다. 게임 세계는 "아레나 중심 (0,0), 반지름 600"인 월드 좌표로 정하고 `translate`·`scale`로 화면에 맞춘다. `fitCanvas`로 캔버스 픽셀 크기를 CSS 크기 × `devicePixelRatio`로 맞추고 `setTransform(dpr, …)`로 CSS 픽셀 단위로 그린다(휴대폰 DPR 2~3에서 흐릿함 방지). `drawScene`으로 아레나 원·노란 아이템·색 원 플레이어·검은 테두리 흰 이름표·내 플레이어 흰 테두리(`meId`)를 그린다(`clearRect`로 투명하게 지우는 이유: OBS, Day 30). `client\src\protocol.ts`를 만들어 화면용 상수 `ARENA_RADIUS`·`PLAYER_RADIUS`·`ITEM_RADIUS`와 `PlayerState`·`ItemState` 인터페이스를 둔다(Rust와 같은 값·모양이라는 주석). `play.ts`는 Day 13의 `#ball` 대신 내 플레이어(id 1, 이름 `나`)를 시간에 따라 원을 그리며 움직이고 아이템 3개를 그린다.
- 이미 배운 것: [Day 13](#/day/p3-d13)의 게임 루프·dt, TS interface·export/import([P2 Day 5](#/day/p2-d05), [P2 Day 6](#/day/p2-d06)), DOM `querySelector`와 `getBoundingClientRect` 같은 요소 크기 읽기([P1 Day 20](#/day/p1-d20)), CSS 크기·`width: 100%`([P1 Day 10](#/day/p1-d10)), 개발자 도구 기기 모드([P1 Day 13](#/day/p1-d13)), `Math.cos`/`Math.sin`은 "원을 그리는 위치 계산"으로 한 줄 설명.
- 시작 상태: 어제(Day 13) 끝 상태예요. `C:\dev\viewer-arena\client`에서 `npm run dev`를 켜 두고 시작해요.
  - (Day 13 끝 상태와 같아요. 다르면 [Day 13](#/day/p3-d13)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\` 연습 폴더(Day 12까지 사용, 이후 그대로 둠)
  - `C:\dev\viewer-arena\.gitignore`
  - `C:\dev\viewer-arena\Cargo.lock`
  - `C:\dev\viewer-arena\Cargo.toml`
  - `C:\dev\viewer-arena\client\index.html`
  - `C:\dev\viewer-arena\client\package-lock.json`
  - `C:\dev\viewer-arena\client\package.json`
  - `C:\dev\viewer-arena\client\play.html`
  - `C:\dev\viewer-arena\client\public\favicon.svg`
  - `C:\dev\viewer-arena\client\src\home.ts`
  - `C:\dev\viewer-arena\client\src\play.ts`
  - `C:\dev\viewer-arena\client\src\style.css`
  - `C:\dev\viewer-arena\client\tsconfig.json`
  - `C:\dev\viewer-arena\crates\game-core\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-core\src\lib.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\protocol.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\vec2.rs`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\viewer-arena\target\`, `C:\dev\viewer-arena\.git\`, `C:\dev\viewer-arena\client\node_modules\`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치)
- 오늘 만들/바꿀 파일:
  - 새로 만듦 `C:\dev\viewer-arena\client\src\protocol.ts` — 오늘판: 맨 위 주석(Rust protocol.rs·rules.rs와 같아야 함), `ARENA_RADIUS = 600`, `PLAYER_RADIUS = 20`, `ITEM_RADIUS = 12`, `PlayerState`(id·name·x·y·vx·vy·score·color), `ItemState`(id·x·y) (레퍼런스 `reference/p3-viewer-arena/client/src/protocol.ts`)
  - 새로 만듦 `C:\dev\viewer-arena\client\src\render.ts` — 레퍼런스와 같음: `fitCanvas`(DPR), `Scene`(players·items·meId?), `drawScene`(투명 지우기·scale·아레나·아이템·플레이어·이름표) (레퍼런스 `reference/p3-viewer-arena/client/src/render.ts`)
  - 바꿈 `C:\dev\viewer-arena\client\play.html` — `div#ball`·`p#fps` 대신 `<canvas id="arena" aria-label="아레나(내 플레이어는 흰 테두리)">` (레퍼런스 `reference/p3-viewer-arena/client/play.html`)
  - 바꿈 `C:\dev\viewer-arena\client\src\play.ts` — 통째로: `import './style.css'`, `fitCanvas`/`drawScene` 사용, 로컬 장면(내 플레이어 1명이 반지름 200 원을 돎, 아이템 3개), 매 프레임 그리기 (레퍼런스 `reference/p3-viewer-arena/client/src/play.ts`)
  - 바꿈 `C:\dev\viewer-arena\client\src\style.css` — `#ball` 임시 스타일 지우고 `/* ---------- play.html (휴대폰) ---------- */` 구역에 `.page-play`·`.page-play main`·`.page-play #arena`(가로 100%, 정사각형) 시작 (레퍼런스 `reference/p3-viewer-arena/client/src/style.css`)
- 끝 상태 확인: `http://localhost:5173/play.html`에 어두운 원형 아레나, 노란 아이템 3개, 흰 테두리 파란 원 `나`가 원을 그리며 돈다. 개발자 도구 기기 모드(DPR 3 기기)로 바꿔도 이름표 글자가 선명하다. `npx tsc --noEmit` 오류 없음.
- 과제:
  1) 아이템을 5개로 늘리고 위치를 월드 좌표로 정해 보기(쉬움) → 정답 요지: `items` 배열에 `{ id, x, y }` 추가(Day 18에서 무작위 생성으로 바뀜)
  2) `fitCanvas`에서 DPR 곱하기를 빼면 무엇이 달라지는지 기기 모드로 비교 후 되돌리기(보통) → 정답 요지: 휴대폰 화면에서 흐릿함
  3) 월드 좌표 (600, 0)이 화면 어디에 그려지는지 계산(보통) → 정답 요지: 중심 + 반지름 × scale = 오른쪽 가장자리
- 용어(사전 담당): Canvas, 렌더링 컨텍스트, 월드 좌표, 기기 픽셀 비율
- 자주 막히는 곳 후보: 캔버스 높이가 0(CSS 없음)이라 아무것도 안 보임 → `.page-play #arena` 크기 / `error TS18047: 'ctx' is possibly 'null'.` → `fitCanvas`처럼 없으면 `throw` / `querySelector<HTMLCanvasElement>(…)!`의 `!` 뜻(“반드시 있음”) 한 줄 설명 / `beginPath()`를 빼 원들이 선으로 이어짐 / y축이 아래로 커져 위아래가 반대로 느껴짐 → 좌표계 그림 / 캔버스 `width`/`height` 속성과 CSS 크기를 혼동해 늘어나 보임
- 레퍼런스 대응: `client/src/render.ts`(최종과 같음); `client/src/protocol.ts`(중간 단계: 상수 3개·PlayerState·ItemState만 — Day 18·21·24·29·30·36에서 채워 최종), `client/play.html`·`client/src/play.ts`·`client/src/style.css`는 중간 단계.

## Day 15 — 입력 처리 (110분)
- 목표: 입력을 "지금 방향을 읽는 함수"(`() => Direction`)로 만드는 이유(게임 루프가 필요할 때 읽음)를 설명한다. `client\src\input.ts`에 `Direction`, `STILL`, `clampLength`(대각선이 더 빠르지 않게 길이 1로), `keyboard()`(`Set`에 `event.code` 저장, 방향키 `preventDefault`, `<input>`에 입력 중이면 무시, 창 `blur` 때 비우기), `joystick(base, knob)`(Pointer Events 하나로 터치·마우스·펜, `setPointerCapture`, 손을 떼거나 `pointercancel`이면 정지, 노브를 반만 움직여 보여 줌), `firstActive(...sources)`를 만든다. `event.key` 대신 `event.code`를 쓰는 이유: 한/영 입력 상태와 상관없이 `KeyW`가 같다. `play.html`에 `#stick > #knob`과 안내 문장, `style.css`에 `.stick`(`touch-action: none`), `.knob`, `.small`을 더한다. `play.ts`는 `firstActive(joystick(stick, knob), keyboard())`로 방향을 읽어 내 플레이어를 초당 300 월드 단위로 움직인다(가속·마찰은 Day 16). 개발자 도구 기기 모드로 터치를 흉내 낸다(휴대폰 실기는 Day 31).
- 이미 배운 것: [Day 14](#/day/p3-d14)의 캔버스·월드 좌표, [Day 13](#/day/p3-d13)의 dt, 이벤트와 `addEventListener`·이벤트 객체([P1 Day 21](#/day/p1-d21)), `Set`은 "중복 없는 모음"으로 한 줄 설명, TS 함수 타입·화살표 함수([P2 Day 6](#/day/p2-d06)), CSS `transform`, 기기 모드([P1 Day 13](#/day/p1-d13)), `Math.hypot`은 "피타고라스 길이"로 한 줄 설명.
- 시작 상태: 어제(Day 14) 끝 상태예요. `npm run dev`를 켜 두고 시작해요.
  - (Day 14 끝 상태와 같아요. 다르면 [Day 14](#/day/p3-d14)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\` 연습 폴더(Day 12까지 사용, 이후 그대로 둠)
  - `C:\dev\viewer-arena\.gitignore`
  - `C:\dev\viewer-arena\Cargo.lock`
  - `C:\dev\viewer-arena\Cargo.toml`
  - `C:\dev\viewer-arena\client\index.html`
  - `C:\dev\viewer-arena\client\package-lock.json`
  - `C:\dev\viewer-arena\client\package.json`
  - `C:\dev\viewer-arena\client\play.html`
  - `C:\dev\viewer-arena\client\public\favicon.svg`
  - `C:\dev\viewer-arena\client\src\home.ts`
  - `C:\dev\viewer-arena\client\src\play.ts`
  - `C:\dev\viewer-arena\client\src\protocol.ts`
  - `C:\dev\viewer-arena\client\src\render.ts`
  - `C:\dev\viewer-arena\client\src\style.css`
  - `C:\dev\viewer-arena\client\tsconfig.json`
  - `C:\dev\viewer-arena\crates\game-core\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-core\src\lib.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\protocol.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\vec2.rs`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\viewer-arena\target\`, `C:\dev\viewer-arena\.git\`, `C:\dev\viewer-arena\client\node_modules\`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치)
- 오늘 만들/바꿀 파일:
  - 새로 만듦 `C:\dev\viewer-arena\client\src\input.ts` — 레퍼런스에서 `round2`만 뺀 모양: `Direction`, `STILL`, `clampLength`, `keyboard`, `joystick`, `firstActive`(+ 맨 위 설명 주석) (레퍼런스 `reference/p3-viewer-arena/client/src/input.ts`)
  - 바꿈 `C:\dev\viewer-arena\client\play.html` — `canvas#arena` 아래에 `<div id="stick" class="stick" aria-label="조이스틱"><div id="knob" class="knob"></div></div>`와 `<p class="small">조이스틱을 끌거나 키보드 WASD·방향키로 움직여요</p>` (레퍼런스 `reference/p3-viewer-arena/client/play.html`)
  - 바꿈 `C:\dev\viewer-arena\client\src\play.ts` — `readStick = firstActive(joystick(stick, knob), keyboard())`, 매 프레임 `me.x += dir.dx * 300 * dt` 식 이동(원 돌기 제거) (레퍼런스 `reference/p3-viewer-arena/client/src/play.ts`)
  - 바꿈 `C:\dev\viewer-arena\client\src\style.css` — 공통에 `.small`, play 구역에 `.stick`(원형 받침, `touch-action: none` 주석), `.knob` (레퍼런스 `reference/p3-viewer-arena/client/src/style.css`)
- 끝 상태 확인: 키보드 WASD·방향키로 `나`가 움직이고 대각선도 같은 속도다. 기기 모드에서 조이스틱을 끌면 노브가 따라 움직이고 놓으면 가운데로 돌아오며 멈춘다. 방향키를 눌러도 페이지가 스크롤되지 않는다. 한/영이 한글 상태여도 WASD가 동작한다.
- 과제:
  1) `clampLength`를 직접 구현(보통) → 정답 요지: 레퍼런스와 같은 `Math.hypot` + 길이 > 1이면 나누기
  2) `console.log(readStick())`로 대각선 값이 `{dx: 0.707…, dy: …}`인지 확인하고 로그 지우기(쉬움) → 정답 요지: 길이 1로 줄어듦
  3) `blur` 처리를 지우고 키를 누른 채 다른 창을 클릭했을 때 생기는 일을 확인 후 되돌리기(보통) → 정답 요지: 키가 계속 눌린 것으로 남아 혼자 움직임
- 용어(사전 담당): 포인터 이벤트, 가상 조이스틱
- 자주 막히는 곳 후보: 방향키로 페이지가 스크롤됨 → `preventDefault` / 손가락이 받침 밖으로 나가면 조이스틱이 멈춤 → `setPointerCapture` / 휴대폰에서 끌 때 화면이 스크롤·확대됨 → `touch-action: none`(확대 방지 viewport는 Day 31) / `event.key`로 검사해 한글 입력 상태에서 `ㅈ`이 와서 안 움직임 → `event.code` / 키보드가 안 먹음 → 포커스가 개발자 도구나 주소 표시줄에 있음, 페이지를 한 번 클릭 / `stick` 요소를 못 찾아 `Cannot read properties of null` → HTML id 철자
- 레퍼런스 대응: `client/src/input.ts`(`round2` 제외 최종과 같음 — `round2`는 Day 28); `client/play.html`의 `#stick`·`#knob`·안내 문장(최종 위치는 Day 26의 `section#game` 안), `client/src/style.css`의 `.stick`·`.knob`·`.small`(최종과 같음), `play.ts`는 중간 단계.

## Day 16 — 벡터와 이동 (100분)
- 목표: 위치·속도·가속도의 관계(위치 += 속도 × dt, 속도 += 가속도 × dt)와 마찰을 설명한다. 오늘부터 Day 18까지 만드는 `client\src\local\` 폴더는 "Day 19에서 Rust로 옮길 원본"이라는 것을 먼저 밝힌다(Rust와 같은 이름·같은 상수). `local\vec2.ts`(`type Vec2 = { x: number; y: number }`, `vec`, `add`, `sub`, `scale`, `length`, `normalize`(길이 0이면 0 — NaN 방지), `clampLength`), `local\rules.ts`(`PLAYER_ACCEL = 1800`, `PLAYER_FRICTION = 6`, `PLAYER_MAX_SPEED = 300`, 최고 속도 ≈ 가속 ÷ 마찰 = 300 주석), `local\physics.ts`(`interface Body { pos: Vec2; vel: Vec2 }`, `integrate(body, dir, dt)`: 가속 → 마찰 `vel × 1/(1 + k·dt)`(dt가 커도 방향이 뒤집히지 않음) → 최고 속도 제한 → 이동)를 만든다. `play.ts`는 내 플레이어를 `Body`로 바꾸고 `integrate`로 움직인다. `play.html`에 `p#status`(최종 화면에도 있는 상태 줄)를 더해 지금 속력을 보여 준다.
- 이미 배운 것: [Day 6](#/day/p3-d06)·[Day 10](#/day/p3-d10)의 Vec2와 정규화·clamp(Rust판), [Day 15](#/day/p3-d15)의 `Direction`·`clampLength`, [Day 13](#/day/p3-d13)의 dt, TS `type`·interface·함수 모듈([P2 Day 5](#/day/p2-d05), [P2 Day 6](#/day/p2-d06)), 객체를 함수에 넘기면 같은 객체가 바뀐다는 JS의 참조 동작([P1 Day 19](#/day/p1-d19)).
- 시작 상태: 어제(Day 15) 끝 상태예요. `npm run dev`를 켜 두고 시작해요.
  - (Day 15 끝 상태와 같아요. 다르면 [Day 15](#/day/p3-d15)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\` 연습 폴더(Day 12까지 사용, 이후 그대로 둠)
  - `C:\dev\viewer-arena\.gitignore`
  - `C:\dev\viewer-arena\Cargo.lock`
  - `C:\dev\viewer-arena\Cargo.toml`
  - `C:\dev\viewer-arena\client\index.html`
  - `C:\dev\viewer-arena\client\package-lock.json`
  - `C:\dev\viewer-arena\client\package.json`
  - `C:\dev\viewer-arena\client\play.html`
  - `C:\dev\viewer-arena\client\public\favicon.svg`
  - `C:\dev\viewer-arena\client\src\home.ts`
  - `C:\dev\viewer-arena\client\src\input.ts`
  - `C:\dev\viewer-arena\client\src\play.ts`
  - `C:\dev\viewer-arena\client\src\protocol.ts`
  - `C:\dev\viewer-arena\client\src\render.ts`
  - `C:\dev\viewer-arena\client\src\style.css`
  - `C:\dev\viewer-arena\client\tsconfig.json`
  - `C:\dev\viewer-arena\crates\game-core\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-core\src\lib.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\protocol.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\vec2.rs`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\viewer-arena\target\`, `C:\dev\viewer-arena\.git\`, `C:\dev\viewer-arena\client\node_modules\`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치)
- 오늘 만들/바꿀 파일:
  - 새로 만듦 `C:\dev\viewer-arena\client\src\local\vec2.ts` — `Vec2` 타입과 `vec`, `add`, `sub`, `scale`, `length`, `normalize`, `clampLength`(TS에는 연산자 오버로딩이 없어 함수로 — Rust Day 10과 비교 주석) (레퍼런스에 없음 — 중간 파일)
  - 새로 만듦 `C:\dev\viewer-arena\client\src\local\rules.ts` — `PLAYER_ACCEL`, `PLAYER_FRICTION`, `PLAYER_MAX_SPEED` (이름·값이 Rust `rules.rs`와 같음) (레퍼런스에 없음 — 중간 파일)
  - 새로 만듦 `C:\dev\viewer-arena\client\src\local\physics.ts` — `Body`, `integrate(body, dir: Direction, dt)` — Rust `physics::integrate`와 같은 4단계 순서 (레퍼런스에 없음 — 중간 파일)
  - 바꿈 `C:\dev\viewer-arena\client\play.html` — `main` 끝에 `<p id="status" class="status" role="status"></p>` (레퍼런스 `reference/p3-viewer-arena/client/play.html`)
  - 바꿈 `C:\dev\viewer-arena\client\src\play.ts` — 내 플레이어 = `Body`, 매 프레임 `integrate(me, readStick(), dt)`, 그릴 때 `PlayerState` 모양으로 바꿈, `#status`에 `속력 287` 같은 글자 (레퍼런스 `reference/p3-viewer-arena/client/src/play.ts`)
  - 바꿈 `C:\dev\viewer-arena\client\src\style.css` — 공통에 `.status`(레퍼런스와 같음) (레퍼런스 `reference/p3-viewer-arena/client/src/style.css`)
- 끝 상태 확인: 조이스틱·키를 누르면 서서히 빨라져 속력이 300 근처에서 멈추고, 놓으면 미끄러지다 멈춘다. 상태 줄의 속력이 300을 넘지 않는다. 대각선도 최고 속력이 같다.
- 과제:
  1) 마찰을 6 → 2로 바꿔 느낌과 최고 속력을 관찰하고 되돌리기(쉬움) → 정답 요지: 더 미끄럽고 최고 속력은 가속 ÷ 마찰이 커져 제한(300)에 걸림
  2) 가속 1800, 마찰 6일 때 최고 속력 손으로 계산(보통) → 정답 요지: 1800 ÷ 6 = 300
  3) `normalize`를 0 검사 없이 쓰면 정지 상태에서 무슨 값이 나오는지 확인(보통) → 정답 요지: `0 / 0 = NaN` → 플레이어가 사라짐
- 용어(사전 담당): 속도, 가속도, 마찰, 정규화
- 자주 막히는 곳 후보: 정지 상태에서 `normalize` → `NaN`, 플레이어가 화면에서 사라짐 → 0 검사 / 마찰을 `vel × (1 - k·dt)`로 써서 dt가 크면(탭 전환) 속도가 뒤집힘 → 나눗셈 꼴 / `const a = me.pos; a.x = 0`이 `me.pos`도 바꿈(같은 객체) → 새 객체를 만드는 함수 사용 / import 경로를 `./local/physics`로 써야 하는데 `../local/physics` 등으로 틀림 → `Cannot find module`
- 레퍼런스 대응: 중간 단계 — 레퍼런스와 다름: `client/src/local/*.ts`는 Rust `crates/game-core/src/vec2.rs`·`rules.rs`(이동 상수)·`physics.rs`(`integrate`)의 TS판이에요. Day 19에서 Rust로 옮기고 Day 26에 지워요. `client/play.html`의 `p#status`, `style.css`의 `.status`는 최종과 같음.

## Day 17 — 충돌 (110분)
- 목표: 원-원 충돌(중심 거리 < 반지름 합)을 제곱끼리 비교해 제곱근 없이 판정한다. 겹친 두 원을 겹친 길이의 반씩 반대 방향으로 밀어내고, 완전히 같은 위치면 (1, 0) 방향으로 가른다(0으로 나누기 방지). 아레나 경계(중심에서 `ARENA_RADIUS - PLAYER_RADIUS`)를 넘으면 가장자리로 되돌리고, 내적으로 "바깥쪽으로 가던 속도 성분"만 지워 벽을 따라 미끄러지게 한다. `local\vec2.ts`에 `dot`, `distance`, `local\physics.ts`에 `keepInsideArena`, `moveBody`(integrate + keepInsideArena), `circlesOverlap`, `separateCircles`를 더한다. `play.ts`는 내 플레이어와 더미 3명(입력 없는 `Body`)을 모두 integrate → 모든 쌍 밀어내기 → 경계 안에 가두기 순서로 갱신한다.
- 이미 배운 것: [Day 16](#/day/p3-d16)의 Vec2 함수·Body·integrate·rules, [Day 6](#/day/p3-d06)의 `dot`·`distance`(Rust판), [Day 14](#/day/p3-d14)의 `ARENA_RADIUS`·`PLAYER_RADIUS`, 이중 for 반복([P1 Day 17](#/day/p1-d17)).
- 시작 상태: 어제(Day 16) 끝 상태예요. `npm run dev`를 켜 두고 시작해요.
  - (Day 16 끝 상태와 같아요. 다르면 [Day 16](#/day/p3-d16)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\` 연습 폴더(Day 12까지 사용, 이후 그대로 둠)
  - `C:\dev\viewer-arena\.gitignore`
  - `C:\dev\viewer-arena\Cargo.lock`
  - `C:\dev\viewer-arena\Cargo.toml`
  - `C:\dev\viewer-arena\client\index.html`
  - `C:\dev\viewer-arena\client\package-lock.json`
  - `C:\dev\viewer-arena\client\package.json`
  - `C:\dev\viewer-arena\client\play.html`
  - `C:\dev\viewer-arena\client\public\favicon.svg`
  - `C:\dev\viewer-arena\client\src\home.ts`
  - `C:\dev\viewer-arena\client\src\input.ts`
  - `C:\dev\viewer-arena\client\src\local\physics.ts`
  - `C:\dev\viewer-arena\client\src\local\rules.ts`
  - `C:\dev\viewer-arena\client\src\local\vec2.ts`
  - `C:\dev\viewer-arena\client\src\play.ts`
  - `C:\dev\viewer-arena\client\src\protocol.ts`
  - `C:\dev\viewer-arena\client\src\render.ts`
  - `C:\dev\viewer-arena\client\src\style.css`
  - `C:\dev\viewer-arena\client\tsconfig.json`
  - `C:\dev\viewer-arena\crates\game-core\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-core\src\lib.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\protocol.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\vec2.rs`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\viewer-arena\target\`, `C:\dev\viewer-arena\.git\`, `C:\dev\viewer-arena\client\node_modules\`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치)
- 오늘 만들/바꿀 파일:
  - 바꿈 `C:\dev\viewer-arena\client\src\local\vec2.ts` — `dot`, `distance` 추가 (레퍼런스에 없음 — 중간 파일)
  - 바꿈 `C:\dev\viewer-arena\client\src\local\physics.ts` — `keepInsideArena`, `moveBody`, `circlesOverlap`, `separateCircles` 추가(Rust `physics.rs`와 같은 이름의 camelCase) (레퍼런스에 없음 — 중간 파일)
  - 바꿈 `C:\dev\viewer-arena\client\src\play.ts` — 더미 3명 추가, 매 프레임 이동 → 쌍마다 `separateCircles` → `keepInsideArena` (레퍼런스 `reference/p3-viewer-arena/client/src/play.ts`)
- 끝 상태 확인: 내 플레이어가 아레나 밖으로 나가지 못하고 벽을 따라 미끄러진다. 더미를 밀면 더미가 밀려나고 서로 겹치지 않는다. 콘솔 오류가 없다.
- 과제:
  1) `circlesOverlap`을 제곱 거리로 직접 구현(보통) → 정답 요지: `(b-a)·(b-a) < (ra+rb)²`
  2) 왜 반씩 밀어내는지, 한쪽만 밀면 어떻게 보이는지 쓰기(쉬움) → 정답 요지: 공평하고 순서에 덜 민감, 한쪽만 밀면 떨림
  3) 두 원이 같은 위치일 때 0 검사가 없으면 생기는 일 설명(보통) → 정답 요지: 방향 0/0 = NaN → 둘 다 사라짐
- 용어(사전 담당): 충돌 판정, 밀어내기, 내적
- 자주 막히는 곳 후보: 벽에서 덜덜 떨림 → 바깥쪽 속도 성분을 지우지 않음(내적 부분) / 아주 빠르면 벽을 뚫고 지나감(터널링) → 최고 속도 제한과 경계 검사를 매 프레임 / 쌍 반복을 `j = 0`부터 해서 같은 쌍을 두 번 밀어냄 → `j = i + 1` / 거리 0에서 `NaN` → (1, 0) 방향
- 레퍼런스 대응: 중간 단계 — 레퍼런스와 다름: `crates/game-core/src/physics.rs`의 `keep_inside_arena`·`move_body`·`circles_overlap`·`separate_circles`와 `world.rs`의 `separate_players` 순서(이동 → 밀어내기 → 가두기)의 TS판(Day 19에서 이식, Day 26에 삭제).

## Day 18 — 게임 규칙 (120분)
- 목표: 라운드를 상태 머신(대기 15초 → 게임 120초 → 결과 10초 → 대기)으로 설계해 `text` 그림으로 그린다. 대기 시간은 플레이어가 1명 이상일 때만 줄어든다. `protocol.ts`에 `Phase = 'waiting' | 'playing' | 'ended'`(TS `enum`은 템플릿 설정 `erasableSyntaxOnly`로 막혀서 문자열 유니온), `RankEntry`, `PHASE_LABEL`, `formatTime`(초 → `1:05`)을 더한다. `local\rules.ts`에 `WAITING_SECS`, `ROUND_SECS`, `RESULT_SECS`, `ITEM_RADIUS`(protocol에서 가져옴), `ITEM_COUNT = 8`, `ITEM_SCORE = 1`, `MAX_PLAYERS = 50`, `PLAYER_COLORS`(12색)를 더한다. `local\world.ts`에 로컬 세계(`phase`, `timeLeft`, 플레이어들, 아이템들)와 `stepWorld(world, inputs, dt)`(입력 저장 → 이동 → 밀어내기 → 가두기 → 게임 중이면 아이템 먹기(먹은 자리 대신 새 위치에 새 번호) → 시간 진행·단계 전환, 라운드가 끝난 그 틱에만 순위 반환), 라운드 시작 시 점수 0·아이템 8개, 아이템 위치는 `Math.random`으로 사각형에서 뽑아 원 밖이면 다시 뽑기(삼각함수 없이), 점수 순 안정 정렬 순위를 만든다. `play.html`에 `header.play-header`(`#phase`, `#score`), `play.ts`는 HUD와 결과 문구(`라운드 끝! 1등 (5점)`)를 보여 준다.
- 이미 배운 것: [Day 17](#/day/p3-d17)의 충돌·밀어내기, [Day 7](#/day/p3-d07)의 Phase 열거형(Rust판), [Day 9](#/day/p3-d09)의 안정 정렬·순위, TS 유니온·리터럴 타입·`Record`([P2 Day 5](#/day/p2-d05), [P2 Day 6](#/day/p2-d06)), `Math.random`·`Math.floor`·`padStart`([P1 Day 26](#/day/p1-d26)의 카운트다운 표시), 배열 `sort`·`slice`([P1 Day 19](#/day/p1-d19)).
- 시작 상태: 어제(Day 17) 끝 상태예요. `npm run dev`를 켜 두고 시작해요.
  - (Day 17 끝 상태와 같아요. 다르면 [Day 17](#/day/p3-d17)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\` 연습 폴더(Day 12까지 사용, 이후 그대로 둠)
  - `C:\dev\viewer-arena\.gitignore`
  - `C:\dev\viewer-arena\Cargo.lock`
  - `C:\dev\viewer-arena\Cargo.toml`
  - `C:\dev\viewer-arena\client\index.html`
  - `C:\dev\viewer-arena\client\package-lock.json`
  - `C:\dev\viewer-arena\client\package.json`
  - `C:\dev\viewer-arena\client\play.html`
  - `C:\dev\viewer-arena\client\public\favicon.svg`
  - `C:\dev\viewer-arena\client\src\home.ts`
  - `C:\dev\viewer-arena\client\src\input.ts`
  - `C:\dev\viewer-arena\client\src\local\physics.ts`
  - `C:\dev\viewer-arena\client\src\local\rules.ts`
  - `C:\dev\viewer-arena\client\src\local\vec2.ts`
  - `C:\dev\viewer-arena\client\src\play.ts`
  - `C:\dev\viewer-arena\client\src\protocol.ts`
  - `C:\dev\viewer-arena\client\src\render.ts`
  - `C:\dev\viewer-arena\client\src\style.css`
  - `C:\dev\viewer-arena\client\tsconfig.json`
  - `C:\dev\viewer-arena\crates\game-core\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-core\src\lib.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\protocol.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\vec2.rs`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\viewer-arena\target\`, `C:\dev\viewer-arena\.git\`, `C:\dev\viewer-arena\client\node_modules\`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치)
- 오늘 만들/바꿀 파일:
  - 새로 만듦 `C:\dev\viewer-arena\client\src\local\world.ts` — 로컬 세계 상태와 `createWorld()`, `stepWorld()`, `ranking()`, 아이템 생성·먹기, 단계 전환(Rust `world.rs`의 TS판) (레퍼런스에 없음 — 중간 파일)
  - 바꿈 `C:\dev\viewer-arena\client\src\local\rules.ts` — 라운드·아이템·인원·색 상수 추가(이름·값이 Rust `rules.rs`와 같음) (레퍼런스에 없음 — 중간 파일)
  - 바꿈 `C:\dev\viewer-arena\client\src\protocol.ts` — `Phase`, `RankEntry`, `PHASE_LABEL`, `formatTime` 추가 — 레퍼런스와 같은 모양 (레퍼런스 `reference/p3-viewer-arena/client/src/protocol.ts`)
  - 바꿈 `C:\dev\viewer-arena\client\play.html` — `main` 맨 위에 `<header class="play-header"><span id="phase"></span><span id="score"></span></header>` (레퍼런스 `reference/p3-viewer-arena/client/play.html`)
  - 바꿈 `C:\dev\viewer-arena\client\src\play.ts` — `stepWorld`로 갱신, HUD에 `PHASE_LABEL[phase] + formatTime(timeLeft)`·내 점수, 라운드 끝 문구를 `#status`에 (레퍼런스 `reference/p3-viewer-arena/client/src/play.ts`)
  - 바꿈 `C:\dev\viewer-arena\client\src\style.css` — play 구역에 `.play-header`(레퍼런스와 같음) (레퍼런스 `reference/p3-viewer-arena/client/src/style.css`)
- 끝 상태 확인: 처음 15초 동안 `대기 중 0:15`가 줄고, `게임 중 2:00`이 되며 노란 아이템 8개가 생긴다. 아이템을 먹으면 `1점`이 오르고 그 자리 대신 다른 곳에 새 아이템이 생긴다. 2분 뒤 `라운드 결과`와 `라운드 끝! 1등 (n점)`, 10초 뒤 다시 대기.
- 과제:
  1) `ROUND_SECS`를 20으로 줄여 한 판을 빨리 확인하고 120으로 되돌리기(쉬움) → 정답 요지: 상수 하나로 게임 느낌이 바뀜
  2) `formatTime`을 직접 구현(보통) → 정답 요지: `Math.ceil` → 분·초, `padStart(2, '0')`
  3) 상태 머신 그림(`text`)에 전환 조건을 적기(쉬움) → 정답 요지: 대기→게임(시간 0, 1명 이상), 게임→결과(시간 0), 결과→대기(시간 0)
- 용어(사전 담당): 상태 머신
- 자주 막히는 곳 후보: 남은 시간이 음수로 보임 → 표시할 때 `max(0)`·`Math.ceil` / 아이템이 아레나 밖에 생김 → 원 밖이면 다시 뽑기 / 새 라운드에 지난 점수가 남음 → 라운드 시작에서 0으로 / TS `enum Phase`를 쓰려다 `error TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.` → 문자열 유니온 / `Math.random` 때문에 같은 조작인데 결과가 매번 다름 → Day 19의 시드·결정성 예고
- 레퍼런스 대응: `client/src/protocol.ts`에 `Phase`·`RankEntry`·`PHASE_LABEL`·`formatTime` 추가(최종과 같은 모양); `client/play.html`의 `header.play-header`(최종에는 `#room-label`도 — Day 26), `style.css`의 `.play-header`(최종과 같음); `client/src/local/world.ts`·`rules.ts`는 중간 단계 — `crates/game-core/src/world.rs`·`rules.rs`의 TS판(Day 19 이식, Day 26 삭제).

## Day 19 — game-core 크레이트 (120분)
- 목표: "TS 로직 → Rust" 대응표(파일·함수·상수 이름)를 먼저 만들고 옮긴다. 고정 틱(서버는 1초에 20번, `TICK_DT = 0.05`로만 계산 — 화면 프레임과 분리)과 결정성(같은 시드 + 같은 입력 = 같은 결과)이 왜 서버·테스트·예측(Day 28)에 필요한지 설명한다. `rules.rs`(`TICK_HZ`, `TICK_DT`, 라운드·인원·아레나·이동·아이템 상수, `PLAYER_COLORS: [&str; 12]` — `SNAPSHOT_HZ`만 Day 21), `physics.rs`(필드가 비공개라 `Input::new`를 거쳐야 하는 `Input`(NaN·무한대 → 0, 길이 > 1 → 1), `Body`, `integrate`, `keep_inside_arena`, `move_body`, `circles_overlap`, `separate_circles`, 사칙연산과 제곱근만 쓰는 이유(네이티브·wasm에서 같은 값), 테스트 5개), `world.rs`(`PlayerId`, `Player`(color `&'static str`), `Item`, `JoinError { RoomFull }`, `World::new(seed)`가 `StdRng::seed_from_u64`, `add_player`, `remove_player`, `step(&[(PlayerId, Input)], dt) -> Option<Vec<RankEntry>>`, `ranking`, `snapshot`, 두 플레이어를 동시에 `&mut`로 빌리지 않으려고 Copy 값을 꺼내 계산하는 `separate_players`, `collect_items`, `advance_phase`, `start_round`, `spawn_item`, `random_point`(거절 표본 추출), 테스트 8개)를 만든다. `protocol.rs`에 스냅샷 모양 `Snapshot`(camelCase → `timeLeft`), `PlayerState`, `ItemState`, `RankEntry`를 더한다. 루트 `Cargo.toml`에 `rand = { version = "=0.10.3", default-features = false }`, game-core에 `rand = { workspace = true, features = ["std_rng"] }`(운영체제 난수 없이 시드 난수만 — wasm 빌드를 위해). `lib.rs`는 다섯 모듈 + 최종 의존 방향 주석. TS 로컬 게임은 그대로 둔다(Day 20에서 이동만 WASM으로 바꿈).
- 이미 배운 것: [Day 16](#/day/p3-d16)~[Day 18](#/day/p3-d18)의 TS 이동·충돌·규칙(원본), [Day 6](#/day/p3-d06)~[Day 12](#/day/p3-d12)의 Rust 문법 전부(구조체·열거형·Result·Vec·클로저·트레이트·`'static`), [Day 11](#/day/p3-d11)의 워크스페이스·`cargo test`·serde.
- 시작 상태: 어제(Day 18) 끝 상태예요(로컬 게임 완성). 오늘은 Rust로 돌아와요. VS Code로 `C:\dev\viewer-arena`를 열어요. 인터넷이 필요해요(rand 크레이트).
  - (Day 18 끝 상태와 같아요. 다르면 [Day 18](#/day/p3-d18)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\` 연습 폴더(Day 12까지 사용, 이후 그대로 둠)
  - `C:\dev\viewer-arena\.gitignore`
  - `C:\dev\viewer-arena\Cargo.lock`
  - `C:\dev\viewer-arena\Cargo.toml`
  - `C:\dev\viewer-arena\client\index.html`
  - `C:\dev\viewer-arena\client\package-lock.json`
  - `C:\dev\viewer-arena\client\package.json`
  - `C:\dev\viewer-arena\client\play.html`
  - `C:\dev\viewer-arena\client\public\favicon.svg`
  - `C:\dev\viewer-arena\client\src\home.ts`
  - `C:\dev\viewer-arena\client\src\input.ts`
  - `C:\dev\viewer-arena\client\src\local\physics.ts`
  - `C:\dev\viewer-arena\client\src\local\rules.ts`
  - `C:\dev\viewer-arena\client\src\local\vec2.ts`
  - `C:\dev\viewer-arena\client\src\local\world.ts`
  - `C:\dev\viewer-arena\client\src\play.ts`
  - `C:\dev\viewer-arena\client\src\protocol.ts`
  - `C:\dev\viewer-arena\client\src\render.ts`
  - `C:\dev\viewer-arena\client\src\style.css`
  - `C:\dev\viewer-arena\client\tsconfig.json`
  - `C:\dev\viewer-arena\crates\game-core\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-core\src\lib.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\protocol.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\vec2.rs`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\viewer-arena\target\`, `C:\dev\viewer-arena\.git\`, `C:\dev\viewer-arena\client\node_modules\`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치)
- 오늘 만들/바꿀 파일:
  - 새로 만듦 `C:\dev\viewer-arena\crates\game-core\src\rules.rs` — `SNAPSHOT_HZ`를 뺀 모든 상수(레퍼런스와 같은 주석·값) (레퍼런스 `reference/p3-viewer-arena/crates/game-core/src/rules.rs`)
  - 새로 만듦 `C:\dev\viewer-arena\crates\game-core\src\physics.rs` — 레퍼런스와 같음(테스트 5개: `circle_collision_separates`, `input_is_clamped_and_sanitized`, `speed_never_exceeds_max`, `max_speed_is_enforced_even_from_huge_velocity`, `keep_inside_arena_pulls_back_to_edge`) (레퍼런스 `reference/p3-viewer-arena/crates/game-core/src/physics.rs`)
  - 새로 만듦 `C:\dev\viewer-arena\crates\game-core\src\world.rs` — 레퍼런스에서 `JoinError::NameTaken`·`add_player`의 중복 닉네임 검사·`duplicate_names_are_rejected` 테스트를 뺀 모양(테스트 8개: `player_stays_inside_arena`, `players_push_each_other_apart`, `item_pickup_scores`, `phase_transitions_waiting_playing_ended`, `room_is_full_at_max_players`, `ranking_sorts_by_score_then_join_order`, `step_is_deterministic`, `snapshot_has_players_and_items`) (레퍼런스 `reference/p3-viewer-arena/crates/game-core/src/world.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\game-core\src\protocol.rs` — `Snapshot`, `PlayerState`, `ItemState`, `RankEntry` 추가(레퍼런스와 같은 derive·serde 속성) (레퍼런스 `reference/p3-viewer-arena/crates/game-core/src/protocol.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\game-core\src\lib.rs` — `pub mod physics; pub mod protocol; pub mod rules; pub mod vec2; pub mod world;` + 의존 방향 주석 — 레퍼런스와 같음 (레퍼런스 `reference/p3-viewer-arena/crates/game-core/src/lib.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\game-core\Cargo.toml` — rand 의존성(주석 포함) — 레퍼런스와 같음 (레퍼런스 `reference/p3-viewer-arena/crates/game-core/Cargo.toml`)
  - 바꿈 `C:\dev\viewer-arena\Cargo.toml` — `[workspace.dependencies]`에 `rand` 추가 (레퍼런스 `reference/p3-viewer-arena/Cargo.toml`)
  - 바꿈 `C:\dev\viewer-arena\Cargo.lock` — rand와 그 의존성이 추가됨(자동) (레퍼런스 `reference/p3-viewer-arena/Cargo.lock`)
- 끝 상태 확인: `cargo test -p game-core` → `test result: ok. 16 passed`(vec2 2 + protocol 1 + physics 5 + world 8). 로컬 TS 게임(`npm run dev`)은 어제와 똑같이 동작한다.
- 과제:
  1) TS → Rust 대응표 채우기(`stepWorld` → `World::step`, `keepInsideArena` → `keep_inside_arena` …)(쉬움) → 정답 요지: 표 한 장(파일 변경 없음)
  2) `step_is_deterministic`의 시드를 바꾸면 무엇이 달라지고 무엇이 같은지 확인 후 되돌리기(보통) → 정답 요지: 아이템 위치가 달라짐, 같은 시드끼리는 항상 같음
  3) `separate_players`가 두 플레이어를 `&mut`로 동시에 빌리지 않는 이유를 E0499와 함께 설명(도전) → 정답 요지: Vec2가 Copy라 값을 꺼내 계산 후 다시 넣음
- 용어(사전 담당): 이식, 고정 틱, 결정성, 시드
- 자주 막히는 곳 후보: `error[E0599]: no method named `random_range` found` → `use rand::RngExt;`(rand 0.10의 이름) / rand 기본 기능을 켜서 Day 20 wasm 빌드 때 getrandom 오류 → `default-features = false` + `std_rng`만 / `error[E0499]: cannot borrow `self.players` as mutable more than once at a time` → Copy 값 꺼내기 패턴 / `f32`와 `f64` 리터럴 섞기 → `1e-3` 등은 문맥상 f32, 타입 오류 원문 확인 / 실수 비교 테스트가 아주 작은 차이로 실패 → `(a - b).abs() < 1e-4` / TS와 Rust에서 아이템 먹기 순서를 다르게 옮겨 테스트 실패 → 원본 순서 그대로
- 레퍼런스 대응: `crates/game-core/src/rules.rs`(`SNAPSHOT_HZ` 제외 — Day 21), `physics.rs`(최종과 같음), `world.rs`(NameTaken·중복 닉네임 제외 — Day 32), `protocol.rs`(+Snapshot·PlayerState·ItemState·RankEntry, 중간 단계), `lib.rs`·`crates/game-core/Cargo.toml`(최종과 같음), `Cargo.toml`(rand 추가).

## Day 20 — WebAssembly (120분)
- 목표: WebAssembly와 컴파일 타깃(`x86_64-pc-windows-msvc` vs `wasm32-unknown-unknown`)을 설명한다. `rustup target list --installed`로 Day 1에 넣은 타깃을 확인(없으면 `rustup target add wasm32-unknown-unknown`). `cargo install wasm-bindgen-cli --version 0.2.130 --locked`(몇 분 걸림, 크레이트 버전과 정확히 같아야 함) → `wasm-bindgen --version`. `cargo new --lib --vcs none crates\game-wasm` → `Cargo.toml`(`crate-type = ["cdylib", "rlib"]` 이유 주석, game-core·wasm-bindgen·serde·serde_json), `src\lib.rs`(`#[wasm_bindgen] pub fn predict(state_json, input_json, dt) -> Result<String, String>`가 `physics::move_body`를 부름, JSON 글자로 주고받는 이유, 네이티브에서 도는 테스트 4개). 루트 `Cargo.toml` members에 `crates/game-wasm`, 의존성에 `wasm-bindgen = "=0.2.130"`. `client\package.json`에 `"wasm"` 스크립트(cargo build → wasm-bindgen `--target web --out-dir src/wasm`) → `npm run wasm` → `client\src\wasm\`에 `game_wasm.js` 등 4개 생성(빌드 결과물이라 `.gitignore`에 `/client/src/wasm/`). `client\src\wasm.ts`(`loadWasm`이 `??=`로 한 번만 받기·실패하면 비우기, `predictBody`). `play.ts`는 시작할 때 `await loadWasm()`, 내 플레이어 이동을 TS `moveBody` 대신 `predictBody`(Rust)로 바꾼다(더미·아이템은 아직 TS). `:::info`: wasm-pack을 쓰지 않는 이유는 "폐기돼서"가 아니라 유지보수자 1인 + wasm-bindgen 팀의 권고 미정(external-facts 8절).
- 이미 배운 것: [Day 19](#/day/p3-d19)의 game-core·`physics::move_body`·`Input::new`, [Day 11](#/day/p3-d11)의 워크스페이스·serde_json, [Day 8](#/day/p3-d08)의 Result·`?`, [Day 1](#/day/p3-d01)의 rustup·타깃 설치, [Day 13](#/day/p3-d13)~[Day 17](#/day/p3-d17)의 TS 로컬 게임, npm 스크립트([P2 Day 3](#/day/p2-d03)), `async`/`await`·Promise([P2 Day 8](#/day/p2-d08)), 개발자 도구 Network 탭([P1 Day 25](#/day/p1-d25)).
- 시작 상태: 어제(Day 19) 끝 상태예요. 인터넷이 필요해요(`wasm-bindgen-cli` 설치). 설치에 몇 분 걸리니 먼저 시작해 두고 개념을 읽어요.
  - (Day 19 끝 상태와 같아요. 다르면 [Day 19](#/day/p3-d19)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\` 연습 폴더(Day 12까지 사용, 이후 그대로 둠)
  - `C:\dev\viewer-arena\.gitignore`
  - `C:\dev\viewer-arena\Cargo.lock`
  - `C:\dev\viewer-arena\Cargo.toml`
  - `C:\dev\viewer-arena\client\index.html`
  - `C:\dev\viewer-arena\client\package-lock.json`
  - `C:\dev\viewer-arena\client\package.json`
  - `C:\dev\viewer-arena\client\play.html`
  - `C:\dev\viewer-arena\client\public\favicon.svg`
  - `C:\dev\viewer-arena\client\src\home.ts`
  - `C:\dev\viewer-arena\client\src\input.ts`
  - `C:\dev\viewer-arena\client\src\local\physics.ts`
  - `C:\dev\viewer-arena\client\src\local\rules.ts`
  - `C:\dev\viewer-arena\client\src\local\vec2.ts`
  - `C:\dev\viewer-arena\client\src\local\world.ts`
  - `C:\dev\viewer-arena\client\src\play.ts`
  - `C:\dev\viewer-arena\client\src\protocol.ts`
  - `C:\dev\viewer-arena\client\src\render.ts`
  - `C:\dev\viewer-arena\client\src\style.css`
  - `C:\dev\viewer-arena\client\tsconfig.json`
  - `C:\dev\viewer-arena\crates\game-core\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-core\src\lib.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\physics.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\protocol.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\rules.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\vec2.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\world.rs`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\viewer-arena\target\`, `C:\dev\viewer-arena\.git\`, `C:\dev\viewer-arena\client\node_modules\`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치)
- 오늘 만들/바꿀 파일:
  - 새로 만듦 `C:\dev\viewer-arena\crates\game-wasm\Cargo.toml` — 레퍼런스와 같음(빌드 명령 주석, `[lib] crate-type`, 의존성 4개) (레퍼런스 `reference/p3-viewer-arena/crates/game-wasm/Cargo.toml`)
  - 새로 만듦 `C:\dev\viewer-arena\crates\game-wasm\src\lib.rs` — 레퍼런스와 같음(`BodyState`, `InputState`, `predict`, 테스트 4개) (레퍼런스 `reference/p3-viewer-arena/crates/game-wasm/src/lib.rs`)
  - 새로 만듦 `C:\dev\viewer-arena\client\src\wasm.ts` — 레퍼런스와 같음(`init`·`predict` import, `BodyState`, `loadWasm`, `predictBody`) (레퍼런스 `reference/p3-viewer-arena/client/src/wasm.ts`)
  - 바꿈 `C:\dev\viewer-arena\Cargo.toml` — members `["crates/game-core", "crates/game-wasm"]`(server는 Day 22에 가운데로), `wasm-bindgen = "=0.2.130"` (레퍼런스 `reference/p3-viewer-arena/Cargo.toml`)
  - 바꿈 `C:\dev\viewer-arena\Cargo.lock` — wasm-bindgen 계열 추가(자동) (레퍼런스 `reference/p3-viewer-arena/Cargo.lock`)
  - 바꿈 `C:\dev\viewer-arena\.gitignore` — `# npm run wasm이 만드는 WebAssembly 바인딩` + `/client/src/wasm/` (레퍼런스 `reference/p3-viewer-arena/.gitignore`)
  - 바꿈 `C:\dev\viewer-arena\client\package.json` — scripts에 `"wasm": "cargo build -p game-wasm --target wasm32-unknown-unknown --release && wasm-bindgen --target web --out-dir src/wasm ../target/wasm32-unknown-unknown/release/game_wasm.wasm"`(npm 스크립트는 cmd에서 돌아서 `&&`가 됨 — PowerShell 5.1 규칙과 구분) (레퍼런스 `reference/p3-viewer-arena/client/package.json`)
  - 바꿈 `C:\dev\viewer-arena\client\src\play.ts` — 시작 시 `await loadWasm()`, 내 플레이어는 `predictBody`로 이동, 상태 줄에 `이동 계산: Rust(WebAssembly)` (레퍼런스 `reference/p3-viewer-arena/client/src/play.ts`)
  - 오늘 생기는 생성물(커밋 안 함): `C:\dev\viewer-arena\client\src\wasm\`
  - 오늘 설치하는 도구: wasm-bindgen-cli 0.2.130(`wasm-bindgen --version`)
- 끝 상태 확인: `cargo test -p game-wasm` → `4 passed`. `C:\dev\viewer-arena\client`에서 `npm run wasm` → `client\src\wasm\game_wasm.js`, `game_wasm.d.ts`, `game_wasm_bg.wasm`, `game_wasm_bg.wasm.d.ts`. `npx tsc --noEmit` 오류 없음. `play.html`에서 움직임이 어제와 같고, 개발자 도구 Network에 `game_wasm_bg.wasm`이 `200`, 형식 `wasm`(application/wasm)으로 보인다. 콘솔 오류 0.
- 과제:
  1) 같은 상태·입력으로 TS `moveBody`와 `predictBody` 결과를 `console.log`로 비교하고 로그 지우기(보통) → 정답 요지: 값이 같거나 실수 끝자리만 다름(같은 규칙)
  2) `rules.rs`의 `PLAYER_MAX_SPEED`를 100으로 바꿔 `npm run wasm` 후 느려지는 것을 확인하고 되돌리기(쉬움) → 정답 요지: Rust를 고치면 wasm을 다시 빌드해야 반영
  3) 왜 숫자 4개를 JSON 글자로 주고받는지, 단점은 무엇인지 쓰기(보통) → 정답 요지: 배울 것이 적고 충분히 빠름, 단점은 변환 비용
- 용어(사전 담당): WebAssembly, 컴파일 타깃, wasm-bindgen, 바인딩
- 자주 막히는 곳 후보: ``error[E0463]: can't find crate for `core` `` + ``note: the `wasm32-unknown-unknown` target may not be installed`` → `rustup target add wasm32-unknown-unknown` / `it looks like the Rust project used to create this Wasm file was linked against version of wasm-bindgen that uses a different bindgen format than this binary` → `cargo install -f wasm-bindgen-cli --version 0.2.130 --locked` / `error TS2307: Cannot find module './wasm/game_wasm.js'` → `npm run wasm` 먼저 / `'wasm-bindgen' 용어가 … 인식되지 않습니다` → 설치 후 새 터미널(`%USERPROFILE%\.cargo\bin` PATH) / `cargo install`이 오래 걸리거나 링커 오류 → Day 1 빌드 도구 확인, 백신이 느리게 함 / npm 스크립트의 `../target`(슬래시)이 Windows cmd에서 동작하는지 — 작성자가 Windows 실기로 확인 못 하면 "미확인" 표시(T20 미검증 항목)
- 레퍼런스 대응: `crates/game-wasm/Cargo.toml`·`src/lib.rs`, `client/src/wasm.ts`(최종과 같음), `client/package.json`(`wasm` 스크립트 추가 — `qrcode-generator`는 Day 30), `.gitignore`(`/client/src/wasm/` 추가 — `.env`는 Day 37), `Cargo.toml`(members 2개 — 중간 단계); `play.ts`는 중간 단계.

## Day 21 — 네트워크 게임의 원리 (90분)
- 목표: 멀티플레이의 세 가지 구조(클라이언트가 결정 / P2P / 권위 서버)를 비교하고 "시청자 휴대폰은 방향만 보내고 계산은 서버만"을 정한다(치팅 방지 — Day 32). 지연 시간·RTT·지터, 틱 레이트(서버 계산 20Hz)와 스냅샷 빈도(보내기 10Hz)를 분리하는 이유(대역폭), 1초에 오가는 바이트를 계산한다. 이번 프로젝트의 큰 그림(`text`: 휴대폰 ─WebSocket─ Rust 서버(방 = 액터 20Hz) ─ OBS 관전 화면, PostgreSQL은 선택)을 그린다. `:::info`: 언리얼 데디케이티드 서버·리플리케이션, 유니티 Netcode for GameObjects와 같은 생각(브리프 요구). 실습: `rules.rs`에 `SNAPSHOT_HZ = 10`, `protocol.ts`에 `TICK_HZ = 20`, `SNAPSHOT_HZ = 10`을 더하고, `play.ts`에 `?lag=200` 주소 매개변수로 입력을 그만큼 늦게 적용하는 "지연 흉내"를 넣어 0·100·300ms의 손맛을 비교한다(이 실험 코드는 Day 26에 통째로 사라짐). PowerShell `ping`으로 실제 RTT를 재 본다.
- 이미 배운 것: [Day 19](#/day/p3-d19)의 고정 틱·결정성, [Day 20](#/day/p3-d20)의 WASM(같은 코드를 두 곳에서), [Day 13](#/day/p3-d13)~[Day 18](#/day/p3-d18)의 로컬 게임, HTTP 요청/응답·폴링·SSE([P2 Day 16](#/day/p2-d16), [P2 Day 33](#/day/p2-d33)), URL 매개변수 `URLSearchParams`([P1 Day 27](#/day/p1-d27)), `setTimeout`·타이머([P1 Day 26](#/day/p1-d26)).
- 시작 상태: 어제(Day 20) 끝 상태예요. `npm run wasm`으로 만든 `client\src\wasm\`가 있어야 해요(없으면 다시 실행).
  - (Day 20 끝 상태와 같아요. 다르면 [Day 20](#/day/p3-d20)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\` 연습 폴더(Day 12까지 사용, 이후 그대로 둠)
  - `C:\dev\viewer-arena\.gitignore`
  - `C:\dev\viewer-arena\Cargo.lock`
  - `C:\dev\viewer-arena\Cargo.toml`
  - `C:\dev\viewer-arena\client\index.html`
  - `C:\dev\viewer-arena\client\package-lock.json`
  - `C:\dev\viewer-arena\client\package.json`
  - `C:\dev\viewer-arena\client\play.html`
  - `C:\dev\viewer-arena\client\public\favicon.svg`
  - `C:\dev\viewer-arena\client\src\home.ts`
  - `C:\dev\viewer-arena\client\src\input.ts`
  - `C:\dev\viewer-arena\client\src\local\physics.ts`
  - `C:\dev\viewer-arena\client\src\local\rules.ts`
  - `C:\dev\viewer-arena\client\src\local\vec2.ts`
  - `C:\dev\viewer-arena\client\src\local\world.ts`
  - `C:\dev\viewer-arena\client\src\play.ts`
  - `C:\dev\viewer-arena\client\src\protocol.ts`
  - `C:\dev\viewer-arena\client\src\render.ts`
  - `C:\dev\viewer-arena\client\src\style.css`
  - `C:\dev\viewer-arena\client\src\wasm.ts`
  - `C:\dev\viewer-arena\client\tsconfig.json`
  - `C:\dev\viewer-arena\crates\game-core\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-core\src\lib.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\physics.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\protocol.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\rules.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\vec2.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\world.rs`
  - `C:\dev\viewer-arena\crates\game-wasm\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-wasm\src\lib.rs`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\viewer-arena\target\`, `C:\dev\viewer-arena\.git\`, `C:\dev\viewer-arena\client\node_modules\`, `C:\dev\viewer-arena\client\src\wasm\`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치), wasm-bindgen-cli 0.2.130(`wasm-bindgen --version`)
- 오늘 만들/바꿀 파일:
  - 바꿈 `C:\dev\viewer-arena\crates\game-core\src\rules.rs` — `SNAPSHOT_HZ: u32 = 10`(주석: 틱의 절반, 2틱마다) 추가 — 최종과 같음 (레퍼런스 `reference/p3-viewer-arena/crates/game-core/src/rules.rs`)
  - 바꿈 `C:\dev\viewer-arena\client\src\protocol.ts` — `TICK_HZ = 20`, `SNAPSHOT_HZ = 10` 추가(주석: rules.rs와 같은 값) (레퍼런스 `reference/p3-viewer-arena/client/src/protocol.ts`)
  - 바꿈 `C:\dev\viewer-arena\client\src\play.ts` — 실험용 `?lag=` 입력 지연(시각과 함께 줄 세웠다가 늦게 적용) — Day 26에 사라짐 (레퍼런스 `reference/p3-viewer-arena/client/src/play.ts`)
- 끝 상태 확인: `play.html?lag=300`에서 조이스틱을 움직이면 0.3초 늦게 반응하고, `play.html`(지연 없음)은 바로 반응한다. `cargo test -p game-core` 여전히 16개 통과.
- 과제:
  1) 스냅샷 1개 400바이트 × 10Hz × 시청자 50명이면 서버가 1초에 보내는 양 계산(보통) → 정답 요지: 400 × 10 × 50 = 200,000바이트 ≈ 200KB/s
  2) 휴대폰이 서버에 보내도 되는 값과 안 되는 값 나누기(쉬움) → 정답 요지: 방향·닉네임만, 위치·점수·속도는 서버가 계산
  3) 지연 0·100·300ms의 느낌과 게임에 주는 영향 쓰기(쉬움) → 정답 요지: 100ms부터 느껴지고 300ms면 조작이 어려움 → 예측(Day 28)
- 용어(사전 담당): 권위 서버, 지연 시간, 틱 레이트, RTT, 넷코드, 데디케이티드 서버
- 자주 막히는 곳 후보: FPS(그리기 횟수)와 ping(ms, 왕복 시간)을 혼동 / `ping`이 `요청 시간이 만료되었습니다.`만 나옴 → 그 서버가 ping을 막음, 다른 주소(예: 공유기 주소) / `?lag=` 철자 틀림 → 아무 효과 없음 / 지연 흉내 코드가 입력만 늦추고 그리기는 바로 해서 헷갈림 → 무엇을 늦췄는지 정확히 설명
- 레퍼런스 대응: `crates/game-core/src/rules.rs`(최종과 같음), `client/src/protocol.ts`(`TICK_HZ`·`SNAPSHOT_HZ` 추가, 중간 단계), `play.ts`의 지연 흉내는 중간 단계 — 레퍼런스에 없음(Day 26에 삭제). 큰 그림은 `reference/p3-viewer-arena/README.md` 맨 위 그림과 같음.

## Day 22 — Tokio와 Axum (110분)
- 목표: Rust의 `async fn`이 Future(“나중에 끝날 일”)를 만들고 Tokio 런타임이 그것을 돌린다는 것을 C#·TS의 async/await와 비교해 설명한다. `cargo new --vcs none crates\server` → 루트 `Cargo.toml` members를 최종 순서 `["crates/game-core", "crates/server", "crates/game-wasm"]`로, 의존성에 `axum = { version = "=0.8.9" }`(ws 기능은 Day 23), `tokio = { version = "=1.54.1", features = ["full"] }`. `crates\server\Cargo.toml`(game-core·axum·tokio·serde·serde_json), `src\lib.rs`(`pub mod app;` — 통합 테스트(Day 38)도 같은 라이브러리를 쓰게), `src\app.rs`(오늘판: `#[derive(Clone)] pub struct AppState { visits: Arc<Mutex<u64>> }`, `pub fn router(state: AppState) -> Router`에 `GET /healthz` → `"ok"`, `GET /api/visits` → `Json({"visits": n})`, 추출기 `State(state)`), `src\main.rs`(오늘판: `#[tokio::main] async fn main()`, `TcpListener::bind("127.0.0.1:8080")`, `println!("서버 시작: http://127.0.0.1:8080")`, `axum::serve(listener, app).await`). 로그는 Day 37까지 `println!`/`eprintln!`으로 쓴다. `cargo run -p server`(워크스페이스 폴더에서) → 브라우저·`curl.exe`로 확인, `Ctrl + C`로 끈다.
- 이미 배운 것: [Day 12](#/day/p3-d12)의 `Arc<Mutex<…>>`·스레드, [Day 11](#/day/p3-d11)의 워크스페이스·`-p`, [Day 8](#/day/p3-d08)의 Result·`unwrap`, serde `Serialize`([Day 11](#/day/p3-d11)), HTTP 메서드·상태 코드·JSON·`.http`/`curl`([P2 Day 16](#/day/p2-d16)), Minimal API의 MapGet·포트·핸들러([P2 Day 17](#/day/p2-d17)), C#·TS async/await([P2 Day 8](#/day/p2-d08), [P2 Day 15](#/day/p2-d15)), 의존성 주입으로 서비스 공유([P2 Day 23](#/day/p2-d23)), PowerShell의 `curl`이 별칭이라 `curl.exe`를 쓰는 규칙.
- 시작 상태: 어제(Day 21) 끝 상태예요. 오늘부터 서버를 만들어요. PowerShell 창을 두 개 쓰면 편해요(서버용 1, 명령용 1). 인터넷이 필요해요(axum·tokio).
  - (Day 21 끝 상태와 같아요. 다르면 [Day 21](#/day/p3-d21)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\` 연습 폴더(Day 12까지 사용, 이후 그대로 둠)
  - `C:\dev\viewer-arena\.gitignore`
  - `C:\dev\viewer-arena\Cargo.lock`
  - `C:\dev\viewer-arena\Cargo.toml`
  - `C:\dev\viewer-arena\client\index.html`
  - `C:\dev\viewer-arena\client\package-lock.json`
  - `C:\dev\viewer-arena\client\package.json`
  - `C:\dev\viewer-arena\client\play.html`
  - `C:\dev\viewer-arena\client\public\favicon.svg`
  - `C:\dev\viewer-arena\client\src\home.ts`
  - `C:\dev\viewer-arena\client\src\input.ts`
  - `C:\dev\viewer-arena\client\src\local\physics.ts`
  - `C:\dev\viewer-arena\client\src\local\rules.ts`
  - `C:\dev\viewer-arena\client\src\local\vec2.ts`
  - `C:\dev\viewer-arena\client\src\local\world.ts`
  - `C:\dev\viewer-arena\client\src\play.ts`
  - `C:\dev\viewer-arena\client\src\protocol.ts`
  - `C:\dev\viewer-arena\client\src\render.ts`
  - `C:\dev\viewer-arena\client\src\style.css`
  - `C:\dev\viewer-arena\client\src\wasm.ts`
  - `C:\dev\viewer-arena\client\tsconfig.json`
  - `C:\dev\viewer-arena\crates\game-core\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-core\src\lib.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\physics.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\protocol.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\rules.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\vec2.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\world.rs`
  - `C:\dev\viewer-arena\crates\game-wasm\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-wasm\src\lib.rs`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\viewer-arena\target\`, `C:\dev\viewer-arena\.git\`, `C:\dev\viewer-arena\client\node_modules\`, `C:\dev\viewer-arena\client\src\wasm\`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치), wasm-bindgen-cli 0.2.130(`wasm-bindgen --version`)
- 오늘 만들/바꿀 파일:
  - 새로 만듦 `C:\dev\viewer-arena\crates\server\Cargo.toml` — `[package] name = "server"`(workspace 상속 4줄) + 맨 위 주석, `[dependencies]` game-core·axum·tokio·serde·serde_json (레퍼런스 `reference/p3-viewer-arena/crates/server/Cargo.toml`)
  - 새로 만듦 `C:\dev\viewer-arena\crates\server\src\lib.rs` — 오늘판: 맨 위 주석 + `pub mod app;` (레퍼런스 `reference/p3-viewer-arena/crates/server/src/lib.rs`)
  - 새로 만듦 `C:\dev\viewer-arena\crates\server\src\app.rs` — 오늘판: `AppState { visits }`, `router(state)`, `healthz`, `visits` 핸들러 — Day 25에 방으로 바뀜 (레퍼런스 `reference/p3-viewer-arena/crates/server/src/app.rs`)
  - 새로 만듦 `C:\dev\viewer-arena\crates\server\src\main.rs` — 오늘판: `#[tokio::main]`, `127.0.0.1:8080` 고정, `println!` (레퍼런스 `reference/p3-viewer-arena/crates/server/src/main.rs`)
  - 바꿈 `C:\dev\viewer-arena\Cargo.toml` — members 최종 순서(3개), `axum`(기능 없음)·`tokio` 추가 (레퍼런스 `reference/p3-viewer-arena/Cargo.toml`)
  - 바꿈 `C:\dev\viewer-arena\Cargo.lock` — axum·tokio 계열 추가(자동) (레퍼런스 `reference/p3-viewer-arena/Cargo.lock`)
- 끝 상태 확인: `C:\dev\viewer-arena`에서 `cargo run -p server` → `서버 시작: http://127.0.0.1:8080`. 브라우저 `http://127.0.0.1:8080/healthz` → `ok`, `/api/visits` → `{"visits":1}`, 새로 고침마다 1씩 오름. `curl.exe -i http://127.0.0.1:8080/healthz` → `HTTP/1.1 200 OK`. 없는 주소는 404.
- 과제:
  1) `curl.exe -i`로 `/healthz`와 없는 주소의 상태 코드 비교(쉬움) → 정답 요지: 200 vs 404
  2) 서버를 켠 채 다른 창에서 한 번 더 `cargo run -p server`를 해서 포트 충돌 오류 원문 읽기(보통) → 정답 요지: `os error 10048`, 먼저 켠 서버를 `Ctrl + C`
  3) `visits` 핸들러를 직접 작성(보통) → 정답 요지: `let mut n = state.visits.lock().unwrap(); *n += 1; Json(serde_json::json!({ "visits": *n }))`(또는 `#[derive(Serialize)]` 구조체)
- 용어(사전 담당): Tokio, Future, Axum, 추출기
- 자주 막히는 곳 후보: `Only one usage of each socket address (protocol/network address/port) is normally permitted. (os error 10048)` → 이미 켠 서버 끄기 또는 다른 프로그램 확인 / 서버가 켜진 채로 `cargo build`/`cargo run` → `error: failed to remove file `C:\dev\viewer-arena\target\debug\server.exe`` … `액세스가 거부되었습니다. (os error 5)`(Windows는 실행 중인 exe를 잠금) → `Ctrl + C`로 끄고 다시 / `.await` 빠짐 → `futures do nothing unless you `.await` or poll them` 경고, 서버가 바로 끝남 / `crates\server`에서 `cargo run`을 해도 되지만 교재는 항상 `C:\dev\viewer-arena` + `-p server`로 통일(Day 30의 정적 파일 경로 때문) / PowerShell에서 `curl -i`가 `Invoke-WebRequest` 오류 → `curl.exe` / 첫 컴파일이 몇 분 걸림 → 정상, 두 번째부터 빠름
- 레퍼런스 대응: `crates/server/Cargo.toml`(game-core·axum·tokio·serde·serde_json만 — 중간 단계), `crates/server/src/lib.rs`(app만), `app.rs`·`main.rs`는 중간 단계(방문 수 예제는 Day 25에 사라짐), `Cargo.toml`(members는 최종과 같음).

## Day 23 — WebSocket 기초 (100분)
- 목표: 폴링·SSE(P2)와 WebSocket(양방향, 연결 유지)을 비교하고, HTTP 요청이 `101 Switching Protocols`로 업그레이드되는 과정을 그림으로 본다. 루트 `Cargo.toml`의 axum에 `features = ["ws"]`를 켠다(기능 플래그). `crates\server\src\ws.rs`(오늘판: `pub async fn ws_handler(ws: WebSocketUpgrade) -> Response { ws.on_upgrade(echo) }`, `async fn echo(mut socket: WebSocket)`이 `while let Some(Ok(msg)) = socket.recv().await`로 받은 `Message::Text`를 그대로 돌려보냄), `app.rs`에 `.route("/ws", any(ws::ws_handler))`(업그레이드는 GET이지만 `any`로 등록), `lib.rs`에 `pub mod ws;`. `client\vite.config.ts`(오늘판: `server.proxy`에 `/api` → `http://127.0.0.1:8080`, `/ws` → `{ target: 'ws://127.0.0.1:8080', ws: true }`)로 5173 페이지에서 8080 서버로 넘기게 한다(P2 Day 27 프록시 복습). 개발자 도구 Console에서 `const s = new WebSocket('ws://' + location.host + '/ws')`, `s.onmessage = (e) => console.log(e.data)`, `s.send('안녕')`으로 확인하고 Network → WS → Messages 탭을 본다.
- 이미 배운 것: [Day 22](#/day/p3-d22)의 Axum 라우터·핸들러·`cargo run -p server`, [Day 8](#/day/p3-d08)의 `while let`과 비슷한 `if let`, [Day 13](#/day/p3-d13)의 Vite dev 서버, 폴링·SSE([P2 Day 33](#/day/p2-d33)), Vite 프록시·CORS([P2 Day 27](#/day/p2-d27)), 개발자 도구 Console·Network([P1 Day 15](#/day/p1-d15), [P1 Day 25](#/day/p1-d25)).
- 시작 상태: 어제(Day 22) 끝 상태예요. 창 두 개: 하나는 `C:\dev\viewer-arena`에서 서버, 하나는 `C:\dev\viewer-arena\client`에서 `npm run dev`.
  - (Day 22 끝 상태와 같아요. 다르면 [Day 22](#/day/p3-d22)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\` 연습 폴더(Day 12까지 사용, 이후 그대로 둠)
  - `C:\dev\viewer-arena\.gitignore`
  - `C:\dev\viewer-arena\Cargo.lock`
  - `C:\dev\viewer-arena\Cargo.toml`
  - `C:\dev\viewer-arena\client\index.html`
  - `C:\dev\viewer-arena\client\package-lock.json`
  - `C:\dev\viewer-arena\client\package.json`
  - `C:\dev\viewer-arena\client\play.html`
  - `C:\dev\viewer-arena\client\public\favicon.svg`
  - `C:\dev\viewer-arena\client\src\home.ts`
  - `C:\dev\viewer-arena\client\src\input.ts`
  - `C:\dev\viewer-arena\client\src\local\physics.ts`
  - `C:\dev\viewer-arena\client\src\local\rules.ts`
  - `C:\dev\viewer-arena\client\src\local\vec2.ts`
  - `C:\dev\viewer-arena\client\src\local\world.ts`
  - `C:\dev\viewer-arena\client\src\play.ts`
  - `C:\dev\viewer-arena\client\src\protocol.ts`
  - `C:\dev\viewer-arena\client\src\render.ts`
  - `C:\dev\viewer-arena\client\src\style.css`
  - `C:\dev\viewer-arena\client\src\wasm.ts`
  - `C:\dev\viewer-arena\client\tsconfig.json`
  - `C:\dev\viewer-arena\crates\game-core\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-core\src\lib.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\physics.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\protocol.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\rules.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\vec2.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\world.rs`
  - `C:\dev\viewer-arena\crates\game-wasm\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-wasm\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\Cargo.toml`
  - `C:\dev\viewer-arena\crates\server\src\app.rs`
  - `C:\dev\viewer-arena\crates\server\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\src\main.rs`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\viewer-arena\target\`, `C:\dev\viewer-arena\.git\`, `C:\dev\viewer-arena\client\node_modules\`, `C:\dev\viewer-arena\client\src\wasm\`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치), wasm-bindgen-cli 0.2.130(`wasm-bindgen --version`)
- 오늘 만들/바꿀 파일:
  - 새로 만듦 `C:\dev\viewer-arena\crates\server\src\ws.rs` — 오늘판: 에코 `ws_handler`·`echo` — Day 24~32에 최종 모양 (레퍼런스 `reference/p3-viewer-arena/crates/server/src/ws.rs`)
  - 새로 만듦 `C:\dev\viewer-arena\client\vite.config.ts` — 오늘판: 맨 위 주석 + `defineConfig({ server: { proxy: {…} } })` — `build` 부분은 Day 30 (레퍼런스 `reference/p3-viewer-arena/client/vite.config.ts`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\src\app.rs` — `/ws` 라우트 추가 (레퍼런스 `reference/p3-viewer-arena/crates/server/src/app.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\src\lib.rs` — `pub mod ws;` 추가 (레퍼런스 `reference/p3-viewer-arena/crates/server/src/lib.rs`)
  - 바꿈 `C:\dev\viewer-arena\Cargo.toml` — axum에 `features = ["ws"]` — 이 줄은 최종과 같음 (레퍼런스 `reference/p3-viewer-arena/Cargo.toml`)
  - 바꿈 `C:\dev\viewer-arena\Cargo.lock` — tokio-tungstenite 등 ws 기능 의존성 추가(자동) (레퍼런스 `reference/p3-viewer-arena/Cargo.lock`)
- 끝 상태 확인: `http://localhost:5173/play.html`의 Console에서 `s.send('안녕')` → `안녕`이 출력된다. Network → WS에서 `ws` 요청의 상태가 `101`, Messages에 보낸 줄(위 화살표)과 받은 줄(아래 화살표)이 보인다. 서버를 끄면 `close` 이벤트가 온다.
- 과제:
  1) 에코가 `서버: 안녕`처럼 앞에 글자를 붙여 돌려주게 바꾸기(쉬움) → 정답 요지: `Message::Text(format!("서버: {text}").into())` (내일 ws.rs를 통째로 바꿈)
  2) Console에서 `s.close()` 후 서버 쪽 반복문이 끝나는 것을 확인(쉬움) → 정답 요지: `recv()`가 `None`
  3) 탭 두 개에서 각각 보내면 서로의 메시지가 안 보이는 이유 쓰기(보통) → 정답 요지: 연결마다 따로 에코, 모두에게 보내기는 Day 25의 broadcast
- 용어(사전 담당): WebSocket, 프로토콜 업그레이드, 에코 서버
- 자주 막히는 곳 후보: ``error[E0432]: unresolved import `axum::extract::ws` `` → `features = ["ws"]` / `vite.config.ts`를 바꾼 뒤 dev 서버를 다시 켜지 않아 프록시가 안 됨 → `Ctrl + C` 후 `npm run dev` / `WebSocket connection to 'ws://localhost:5173/ws' failed` → Rust 서버가 꺼져 있음 / 열리기 전에 `s.send` → `InvalidStateError: Failed to execute 'send' on 'WebSocket': Still in CONNECTING state.` → `onopen` 뒤에 / PowerShell 창을 헷갈려 서버 창에서 `npm`을 침 → 창 제목·현재 위치 확인
- 레퍼런스 대응: `crates/server/src/ws.rs`(중간 단계: 에코), `client/vite.config.ts`(중간 단계: `server.proxy`만 — 최종과 같은 프록시 부분), `Cargo.toml`의 axum `ws` 기능(최종과 같음), `app.rs`·`lib.rs` 중간 단계.

## Day 24 — 메시지 프로토콜 (120분)
- 목표: 메시지 프로토콜을 "서로 약속한 JSON 모양"으로 설명하고 `t` 필드로 종류를 구분하는 태그 방식을 쓴다. `protocol.rs`에 `PROTOCOL_VERSION = 1`(모양이 호환되지 않게 바뀌면 올림), `MAX_MESSAGE_BYTES = 1024`, `ParseError { TooLarge, Invalid(String) }`, `ClientMsg::parse`(크기를 JSON 해석보다 먼저 검사 — 1KB 넘는 글자를 해석하느라 시간을 쓰지 않게), `ServerMsg`(`Welcome { id, room, protocol }`, `Snapshot(Snapshot)`, `Result { ranking }`, `Error { code, message }`, `Pong { ts }`), `ErrorCode`(snake_case 6개: `BadMessage`, `BadName`, `RoomFull`, `RoomClosed`, `NameTaken`, `RateLimited` — 각각 Day 26·29·32에서 실제로 쓰는 곳 한 줄씩)를 더하고, 테스트를 레퍼런스 4개(`client_msg_roundtrip_json`(이제 `parse` 사용), `unknown_type_rejected`, `oversized_text_rejected_before_parsing`, `server_msg_json_shape`)로 맞춘다. `ws.rs`(오늘판): `ws.max_message_size(MAX_MESSAGE_BYTES).max_frame_size(MAX_MESSAGE_BYTES)`, 받은 글자를 `ClientMsg::parse` → `Ping { ts }`면 `Pong { ts }`, 해석 실패면 `Error { code: BadMessage, … }`, 나머지는 아직 무시(Day 26). 보내기 도우미 `send_msg(socket, &ServerMsg) -> bool`, `send_error`. 클라이언트 `protocol.ts`에 `PROTOCOL_VERSION`, `ErrorCode` 유니온, `Snapshot`(`t: 'snapshot'`), `ServerMsg`·`ClientMsg` 구별된 유니온을, 새 파일 `net.ts`(오늘판: `Connection`·`Handlers` 인터페이스와 `connect(handlers)` — `ws://${location.host}/ws`에 연결, 열리면 2초마다 `ping`, `pong`이면 RTT 계산, 나머지는 `onMessage`로)를 만든다. 로컬 게임 `play.ts`는 서버에 연결해 상태 줄에 `서버 지연 12ms`를 보여 준다.
- 이미 배운 것: [Day 23](#/day/p3-d23)의 WebSocket·에코·프록시, [Day 11](#/day/p3-d11)·[Day 19](#/day/p3-d19)의 serde·Snapshot, [Day 7](#/day/p3-d07)의 데이터 있는 열거형, [Day 8](#/day/p3-d08)의 Result·사용자 오류 타입, [Day 21](#/day/p3-d21)의 RTT, TS 유니온·리터럴 타입·`switch`로 좁히기([P2 Day 5](#/day/p2-d05)), `JSON.stringify`/`JSON.parse`([P1 Day 25](#/day/p1-d25)), `setInterval`([P1 Day 26](#/day/p1-d26)), `performance.now()`([Day 13](#/day/p3-d13)).
- 시작 상태: 어제(Day 23) 끝 상태예요. 서버와 `npm run dev`를 둘 다 켜고 시작해요(서버는 코드를 고칠 때마다 `Ctrl + C` 후 다시 `cargo run -p server`).
  - (Day 23 끝 상태와 같아요. 다르면 [Day 23](#/day/p3-d23)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\` 연습 폴더(Day 12까지 사용, 이후 그대로 둠)
  - `C:\dev\viewer-arena\.gitignore`
  - `C:\dev\viewer-arena\Cargo.lock`
  - `C:\dev\viewer-arena\Cargo.toml`
  - `C:\dev\viewer-arena\client\index.html`
  - `C:\dev\viewer-arena\client\package-lock.json`
  - `C:\dev\viewer-arena\client\package.json`
  - `C:\dev\viewer-arena\client\play.html`
  - `C:\dev\viewer-arena\client\public\favicon.svg`
  - `C:\dev\viewer-arena\client\src\home.ts`
  - `C:\dev\viewer-arena\client\src\input.ts`
  - `C:\dev\viewer-arena\client\src\local\physics.ts`
  - `C:\dev\viewer-arena\client\src\local\rules.ts`
  - `C:\dev\viewer-arena\client\src\local\vec2.ts`
  - `C:\dev\viewer-arena\client\src\local\world.ts`
  - `C:\dev\viewer-arena\client\src\play.ts`
  - `C:\dev\viewer-arena\client\src\protocol.ts`
  - `C:\dev\viewer-arena\client\src\render.ts`
  - `C:\dev\viewer-arena\client\src\style.css`
  - `C:\dev\viewer-arena\client\src\wasm.ts`
  - `C:\dev\viewer-arena\client\tsconfig.json`
  - `C:\dev\viewer-arena\client\vite.config.ts`
  - `C:\dev\viewer-arena\crates\game-core\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-core\src\lib.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\physics.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\protocol.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\rules.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\vec2.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\world.rs`
  - `C:\dev\viewer-arena\crates\game-wasm\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-wasm\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\Cargo.toml`
  - `C:\dev\viewer-arena\crates\server\src\app.rs`
  - `C:\dev\viewer-arena\crates\server\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\src\main.rs`
  - `C:\dev\viewer-arena\crates\server\src\ws.rs`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\viewer-arena\target\`, `C:\dev\viewer-arena\.git\`, `C:\dev\viewer-arena\client\node_modules\`, `C:\dev\viewer-arena\client\src\wasm\`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치), wasm-bindgen-cli 0.2.130(`wasm-bindgen --version`)
- 오늘 만들/바꿀 파일:
  - 새로 만듦 `C:\dev\viewer-arena\client\src\net.ts` — 오늘판: 맨 위 주석, `Connection`, `Handlers`, `PING_INTERVAL_MS = 2000`, `connect(handlers)`(주소 `ws://${location.host}/ws` 고정) — 방·역할 인수와 `fetch` 도우미는 Day 29·30·36, `wss:` 선택은 Day 41 (레퍼런스 `reference/p3-viewer-arena/client/src/net.ts`)
  - 바꿈 `C:\dev\viewer-arena\crates\game-core\src\protocol.rs` — 상수 2개(`PROTOCOL_VERSION`, `MAX_MESSAGE_BYTES`), `ParseError`, `parse`, `ServerMsg`, `ErrorCode`, 테스트 4개(레퍼런스와 같음) (레퍼런스 `reference/p3-viewer-arena/crates/game-core/src/protocol.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\src\ws.rs` — 오늘판: 크기 제한, ping→pong, bad_message, `send_msg`·`send_error` (레퍼런스 `reference/p3-viewer-arena/crates/server/src/ws.rs`)
  - 바꿈 `C:\dev\viewer-arena\client\src\protocol.ts` — `PROTOCOL_VERSION`, `ErrorCode`, `Snapshot`, `ServerMsg`, `ClientMsg` 추가(레퍼런스와 같은 모양) (레퍼런스 `reference/p3-viewer-arena/client/src/protocol.ts`)
  - 바꿈 `C:\dev\viewer-arena\client\src\play.ts` — `connect`로 서버에 붙고 상태 줄에 `서버 지연 ${rtt}ms`(로컬 게임은 그대로) (레퍼런스 `reference/p3-viewer-arena/client/src/play.ts`)
- 끝 상태 확인: `cargo test -p game-core` → `19 passed`(protocol 테스트가 4개가 됨). Console에서 `s.send('{"t":"fly"}')` → `{"t":"error","code":"bad_message",…}`, `s.send('{"t":"ping","ts":1.5}')` → `{"t":"pong","ts":1.5}`. `play.html` 상태 줄에 `서버 지연 2ms` 같은 숫자가 2초마다 갱신된다. `npx tsc --noEmit` 오류 없음.
- 과제:
  1) `ServerMsg::Pong { ts: 1.5 }`과 `ErrorCode::RoomFull`의 JSON을 예측하고 테스트로 확인 후 되돌리기(쉬움) → 정답 요지: `{"t":"pong","ts":1.5}`, `"room_full"`
  2) Console에서 2KB짜리 글자를 보내 연결이 닫히는 것과 닫힘 코드 확인(보통) → 정답 요지: 서버가 1KB 제한으로 끊음(`close` 이벤트의 `code`를 읽어 적기 — 작성자가 실제 값 확인)
  3) 버전 필드(`protocol`)가 없으면 앱을 고친 뒤 무슨 일이 생길 수 있는지 쓰기(보통) → 정답 요지: 옛 화면(OBS 캐시)이 새 서버와 다른 모양으로 말해도 알아챌 방법이 없음
- 용어(사전 담당): 메시지 프로토콜, 프로토콜 버전, 구별된 유니온
- 자주 막히는 곳 후보: Rust `time_left`와 TS `timeLeft` 이름이 달라 TS에서 `undefined` → `rename_all = "camelCase"` 확인 / `unknown variant `fly`, expected one of `join`, `input`, `ping`` 같은 serde 오류 원문 읽기 / TS에서 `msg.ts`를 바로 읽어 `error TS2339: Property 'ts' does not exist on type 'ServerMsg'.` → `if (msg.t === 'pong')`로 좁히기 / `15`가 아니라 `15.0`으로 나오는 이유(f32 JSON) → 테스트 기대 문자열 그대로 / 서버 코드를 고치고 다시 켜지 않아 옛 동작 → `Ctrl + C` 후 다시
- 레퍼런스 대응: `crates/game-core/src/protocol.rs`(닉네임 검사·`MAX_INPUTS_PER_SEC`·`NAME_MAX_CHARS` 제외 — Day 26·32), `client/src/protocol.ts`(`Role`·`RoomInfo`·`Leaderboard` 제외 — Day 29·30·36), `client/src/net.ts`(중간 단계: `connect(handlers)` — Day 29·30에 최종 시그니처), `ws.rs`·`play.ts` 중간 단계.

## Day 25 — 서버 게임 루프 (120분)
- 목표: 여러 연결이 같은 `World`를 만지는 두 방법(`Arc<Mutex<World>>` vs 액터)을 비교하고 "작업 하나가 World를 혼자 가지고, 다른 쪽은 채널로 부탁만 한다"를 고른다. `crates\server\src\room.rs`에 `RoomCommand`(`Join { name, reply: oneshot::Sender<…> }`, `Leave { id }`, `Input { id, input }`, `Info { reply }`), `RoomInfo { code, players, phase }`(Serialize), `RoomHandle { code, commands: mpsc::Sender, events: broadcast::Sender<Utf8Bytes> }`와 메서드 `join`(JoinError → ErrorCode, 액터가 끝났으면 `RoomClosed`), `leave`, `send_input`(`try_send` — 꽉 차면 버림, 입력은 최신 값만 중요), `info`, `subscribe`, `RoomActor`(code·commands·events·world·pending), `new_room(code, seed) -> (RoomHandle, RoomActor)`(db 인수는 Day 35), `run`(`interval(50ms)` + `tokio::select!`로 명령 또는 틱), `handle`, `tick`(`std::mem::take`로 입력 꺼내 `world.step`, 라운드가 끝나면 `Result`를 보내고, 오늘은 매 틱 스냅샷 — 10Hz는 Day 27), `broadcast`(JSON을 한 번만 만들어 모두가 같은 바이트를 나눠 씀), 상수 `COMMAND_BUFFER = 256`, `EVENT_BUFFER = 64`, 시작 로그 `println!`. 서버 `Cargo.toml`에 `rand = { workspace = true, features = ["thread_rng"] }`(월드 시드). `app.rs`(오늘판): `AppState { room: RoomHandle }`, `/healthz`, `GET /api/room`(→ `room.info()`, oneshot 답장), `/ws`. `ws.rs`(오늘판): `ws_handler`가 `State`를 받아 연결마다 `room.subscribe()`하고 `select!`로 "방 이벤트 → 소켓으로", "소켓 → ping/pong·bad_message"를 동시에 기다린다(`forward`: `Lagged`면 건너뛰고 계속, `Closed`면 끝). `main.rs`: `room::new_room("MAIN".to_string(), rand::random())` → `tokio::spawn(actor.run())` → `AppState { room }`. 방문 수 예제는 지운다.
- 이미 배운 것: [Day 22](#/day/p3-d22)의 Tokio·Axum·State, [Day 24](#/day/p3-d24)의 ServerMsg·`send_msg`·parse, [Day 19](#/day/p3-d19)의 `World::step`·`TICK_DT`·고정 틱, [Day 12](#/day/p3-d12)의 스레드·Arc·Mutex, [Day 7](#/day/p3-d07)~[Day 9](#/day/p3-d09)의 열거형·Option·Result·`std::mem` 같은 표준 함수, [Day 21](#/day/p3-d21)의 틱 레이트.
- 시작 상태: 어제(Day 24) 끝 상태예요. 서버와 `npm run dev`를 켜고 시작해요.
  - (Day 24 끝 상태와 같아요. 다르면 [Day 24](#/day/p3-d24)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\` 연습 폴더(Day 12까지 사용, 이후 그대로 둠)
  - `C:\dev\viewer-arena\.gitignore`
  - `C:\dev\viewer-arena\Cargo.lock`
  - `C:\dev\viewer-arena\Cargo.toml`
  - `C:\dev\viewer-arena\client\index.html`
  - `C:\dev\viewer-arena\client\package-lock.json`
  - `C:\dev\viewer-arena\client\package.json`
  - `C:\dev\viewer-arena\client\play.html`
  - `C:\dev\viewer-arena\client\public\favicon.svg`
  - `C:\dev\viewer-arena\client\src\home.ts`
  - `C:\dev\viewer-arena\client\src\input.ts`
  - `C:\dev\viewer-arena\client\src\local\physics.ts`
  - `C:\dev\viewer-arena\client\src\local\rules.ts`
  - `C:\dev\viewer-arena\client\src\local\vec2.ts`
  - `C:\dev\viewer-arena\client\src\local\world.ts`
  - `C:\dev\viewer-arena\client\src\net.ts`
  - `C:\dev\viewer-arena\client\src\play.ts`
  - `C:\dev\viewer-arena\client\src\protocol.ts`
  - `C:\dev\viewer-arena\client\src\render.ts`
  - `C:\dev\viewer-arena\client\src\style.css`
  - `C:\dev\viewer-arena\client\src\wasm.ts`
  - `C:\dev\viewer-arena\client\tsconfig.json`
  - `C:\dev\viewer-arena\client\vite.config.ts`
  - `C:\dev\viewer-arena\crates\game-core\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-core\src\lib.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\physics.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\protocol.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\rules.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\vec2.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\world.rs`
  - `C:\dev\viewer-arena\crates\game-wasm\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-wasm\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\Cargo.toml`
  - `C:\dev\viewer-arena\crates\server\src\app.rs`
  - `C:\dev\viewer-arena\crates\server\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\src\main.rs`
  - `C:\dev\viewer-arena\crates\server\src\ws.rs`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\viewer-arena\target\`, `C:\dev\viewer-arena\.git\`, `C:\dev\viewer-arena\client\node_modules\`, `C:\dev\viewer-arena\client\src\wasm\`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치), wasm-bindgen-cli 0.2.130(`wasm-bindgen --version`)
- 오늘 만들/바꿀 파일:
  - 새로 만듦 `C:\dev\viewer-arena\crates\server\src\room.rs` — 오늘판: 맨 위 그림 주석, `RoomCommand`·`RoomInfo`·`RoomHandle`·`RoomActor`·`new_room(code, seed)`·`run`·`handle`·`tick`(매 틱 스냅샷)·`broadcast` — 빈 방 정리(Day 29)·db 저장(Day 35)·10Hz(Day 27)·tracing(Day 37) 없음 (레퍼런스 `reference/p3-viewer-arena/crates/server/src/room.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\Cargo.toml` — `rand`(thread_rng, 주석) 추가 (레퍼런스 `reference/p3-viewer-arena/crates/server/Cargo.toml`)
  - 바꿈 `C:\dev\viewer-arena\Cargo.lock` — rand의 thread_rng 기능 의존성(자동) (레퍼런스 `reference/p3-viewer-arena/Cargo.lock`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\src\lib.rs` — `pub mod room;` 추가 (레퍼런스 `reference/p3-viewer-arena/crates/server/src/lib.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\src\app.rs` — 오늘판: `AppState { room }`, `/healthz`·`/api/room`·`/ws` (방문 수 삭제) (레퍼런스 `reference/p3-viewer-arena/crates/server/src/app.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\src\ws.rs` — 오늘판: 구독해서 스냅샷 넘기기 + ping/pong, `forward` (레퍼런스 `reference/p3-viewer-arena/crates/server/src/ws.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\src\main.rs` — 오늘판: 방 `MAIN` 하나를 만들고 액터 띄우기 (레퍼런스 `reference/p3-viewer-arena/crates/server/src/main.rs`)
- 끝 상태 확인: `curl.exe http://127.0.0.1:8080/api/room` → `{"code":"MAIN","players":0,"phase":"waiting"}`. Console에서 WebSocket을 열면 1초에 약 20개의 `{"t":"snapshot","tick":…,"phase":"waiting","timeLeft":15.0,"players":[],"items":[]}`가 오고 `tick`이 계속 오른다(아무도 없어서 대기 시계는 멈춤). 서버 창에 `[MAIN] 방 시작`.
- 과제:
  1) Console에서 1초 동안 받은 스냅샷 수를 세어 20 근처인지 확인(쉬움) → 정답 요지: `let n = 0; s.onmessage = () => n++; setTimeout(() => console.log(n), 1000)`
  2) 입력만 `try_send`이고 참가는 `send().await`인 이유 쓰기(보통) → 정답 요지: 참가는 꼭 전달·답장 필요, 입력은 다음 것이 곧 옴
  3) `tokio::spawn(actor.run())`을 빼고 `actor.run().await`를 먼저 하면 왜 서버가 응답하지 않는지 설명(도전) → 정답 요지: `run`이 끝나지 않아 `axum::serve`에 도달하지 못함
- 용어(사전 담당): 액터 패턴, 채널, mpsc, oneshot 채널, broadcast 채널, select!
- 자주 막히는 곳 후보: 액터를 `spawn`하지 않고 `await`해서 서버가 안 열림(위 과제 3) / ``error[E0382]: use of moved value: `room` `` → 핸들은 `.clone()`해서 나눠 씀 / 스냅샷이 쌓여 `Lagged`가 나는 상황(느린 탭) → 건너뛰고 계속이 정답 / `interval`의 첫 틱이 바로 오는 것 → 정상 / 서버 재빌드 때 exe 잠김(os error 5) → 먼저 `Ctrl + C` / `rand::random()`에서 `thread_rng` 기능을 안 켜 컴파일 오류 → 서버 `Cargo.toml`의 features
- 레퍼런스 대응: `crates/server/src/room.rs`(빈 방 정리·db·저장·10Hz·tracing 제외 — Day 27·29·35·37), `crates/server/Cargo.toml`(rand 줄은 최종과 같음), `lib.rs`·`app.rs`·`ws.rs`·`main.rs` 중간 단계.

## Day 26 — 입장/퇴장 (120분)
- 목표: 연결 하나의 일생(연결 → 10초 안에 `join` → 닉네임 검사 → 방 참가 → `welcome` → 게임 → 어떻게 끝나든 `leave`)을 그림으로 그린다. game-core `protocol.rs`에 `NAME_MAX_CHARS = 12`, `NameError { Empty, TooLong }` + `message()`, `validate_name`(Day 8 연습판을 옮김: trim, 비었는지, `.chars().count()`)과 테스트 `names_are_validated`(오늘판: 공백 제거·12자 통과·13자 거절·빈칸 거절 4개 단언). `ws.rs`(오늘판): `IDLE_TIMEOUT = 10초`, `/ws`는 이제 플레이어 전용 — `player_session`(`wait_for_join`이 `timeout`으로 10초만 기다림 → `validate_name` 실패면 `close_with_error(BadName)` → `room.join` 실패면 `RoomFull`/`RoomClosed` 안내 후 닫기 → 구독 → `welcome { id, room, protocol }` → `play` 루프 → `room.leave(id)`), `play`는 `deadline = 지금 + idle`을 두고 `select!`로 방 이벤트 넘기기 / `sleep_until(deadline)`이면 정리 / 소켓에서 뭔가 오면 `deadline` 연장 후 `Input { dx, dy }` → `room.send_input(id, Input::new(dx, dy))`, `Ping` → `Pong`, `Join` → `이미 참가했어요.`, 실패 → `bad_message`(브라우저의 2초 ping이 하트비트 역할). 쓰기 기한은 Day 32. `app.rs`: `AppState { room, idle_timeout }` + `AppState::new(room)`(테스트가 바꿀 수 있게 `pub idle_timeout`). 클라이언트: `play.html`을 레퍼런스 모양으로(`header`에 `#room-label`·`#phase`·`#score`, `form#join-form.card`(`#name` maxlength 12, `#join`), `section#game hidden` 안에 `canvas#arena`·`#stick`·안내, `p#status`), `style.css` play 구역 완성(`.card`, `.page-play form`, `.page-play #game` 등), `play.ts`를 통째로 네트워크판으로(폼 제출 → `connect` → 열리면 `join` → `welcome`이면 폼 숨기고 게임 보이기 → 50ms마다 방향이 바뀌었으면 `input`(seq 1, 2, 3…) 보내기 → `snapshot`마다 최신 것을 그대로 그리기(보간은 Day 27) → `result`·`error`·닫힘 안내). `client\src\local\` 폴더(로컬 게임 원본 4개)를 지운다 — 이제 규칙은 서버의 game-core가 계산한다. `wasm.ts`는 남겨 둔다(Day 28).
- 이미 배운 것: [Day 25](#/day/p3-d25)의 액터·RoomHandle·broadcast·select!, [Day 24](#/day/p3-d24)의 메시지·`send_error`, [Day 8](#/day/p3-d08)의 `validate_name` 연습판, [Day 19](#/day/p3-d19)의 `Input::new`·`JoinError`, [Day 14](#/day/p3-d14)·[Day 15](#/day/p3-d15)의 render·input, HTML 폼·`submit`·`preventDefault`·`hidden`([P1 Day 8](#/day/p1-d08), [P1 Day 24](#/day/p1-d24)), `textContent`([P1 Day 20](#/day/p1-d20)).
- 시작 상태: 어제(Day 25) 끝 상태예요. 서버와 `npm run dev`를 켜고 시작해요. 같은 PC에서 브라우저 탭 두 개로 두 명을 흉내 내요.
  - (Day 25 끝 상태와 같아요. 다르면 [Day 25](#/day/p3-d25)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\` 연습 폴더(Day 12까지 사용, 이후 그대로 둠)
  - `C:\dev\viewer-arena\.gitignore`
  - `C:\dev\viewer-arena\Cargo.lock`
  - `C:\dev\viewer-arena\Cargo.toml`
  - `C:\dev\viewer-arena\client\index.html`
  - `C:\dev\viewer-arena\client\package-lock.json`
  - `C:\dev\viewer-arena\client\package.json`
  - `C:\dev\viewer-arena\client\play.html`
  - `C:\dev\viewer-arena\client\public\favicon.svg`
  - `C:\dev\viewer-arena\client\src\home.ts`
  - `C:\dev\viewer-arena\client\src\input.ts`
  - `C:\dev\viewer-arena\client\src\local\physics.ts`
  - `C:\dev\viewer-arena\client\src\local\rules.ts`
  - `C:\dev\viewer-arena\client\src\local\vec2.ts`
  - `C:\dev\viewer-arena\client\src\local\world.ts`
  - `C:\dev\viewer-arena\client\src\net.ts`
  - `C:\dev\viewer-arena\client\src\play.ts`
  - `C:\dev\viewer-arena\client\src\protocol.ts`
  - `C:\dev\viewer-arena\client\src\render.ts`
  - `C:\dev\viewer-arena\client\src\style.css`
  - `C:\dev\viewer-arena\client\src\wasm.ts`
  - `C:\dev\viewer-arena\client\tsconfig.json`
  - `C:\dev\viewer-arena\client\vite.config.ts`
  - `C:\dev\viewer-arena\crates\game-core\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-core\src\lib.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\physics.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\protocol.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\rules.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\vec2.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\world.rs`
  - `C:\dev\viewer-arena\crates\game-wasm\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-wasm\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\Cargo.toml`
  - `C:\dev\viewer-arena\crates\server\src\app.rs`
  - `C:\dev\viewer-arena\crates\server\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\src\main.rs`
  - `C:\dev\viewer-arena\crates\server\src\room.rs`
  - `C:\dev\viewer-arena\crates\server\src\ws.rs`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\viewer-arena\target\`, `C:\dev\viewer-arena\.git\`, `C:\dev\viewer-arena\client\node_modules\`, `C:\dev\viewer-arena\client\src\wasm\`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치), wasm-bindgen-cli 0.2.130(`wasm-bindgen --version`)
- 오늘 만들/바꿀 파일:
  - 바꿈 `C:\dev\viewer-arena\crates\game-core\src\protocol.rs` — `NAME_MAX_CHARS`, `NameError`(Empty·TooLong) + `message`, `validate_name`(오늘판), 테스트 `names_are_validated`(오늘판) (레퍼런스 `reference/p3-viewer-arena/crates/game-core/src/protocol.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\src\ws.rs` — 오늘판: `IDLE_TIMEOUT`, `player_session`, `wait_for_join`, `play`, `forward`, `send_msg`, `send_error`, `close_with_error` (역할·방 코드·빈도 제한·쓰기 기한·seq 검사 없음) (레퍼런스 `reference/p3-viewer-arena/crates/server/src/ws.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\src\app.rs` — `AppState { room, idle_timeout }`, `AppState::new(room)` (레퍼런스 `reference/p3-viewer-arena/crates/server/src/app.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\src\main.rs` — `AppState::new(room)` 사용 (레퍼런스 `reference/p3-viewer-arena/crates/server/src/main.rs`)
  - 바꿈 `C:\dev\viewer-arena\client\play.html` — 레퍼런스와 같음(viewport의 확대 막기만 Day 31) (레퍼런스 `reference/p3-viewer-arena/client/play.html`)
  - 바꿈 `C:\dev\viewer-arena\client\src\play.ts` — 통째로 네트워크판(참가 폼, `connect`, welcome/snapshot/result/error 처리, 50ms 입력 보내기, 최신 스냅샷 그리기) (레퍼런스 `reference/p3-viewer-arena/client/src/play.ts`)
  - 바꿈 `C:\dev\viewer-arena\client\src\style.css` — 공통 `button`·`input`·`.card`, play 구역 `.page-play form`·`.page-play #game`(레퍼런스와 같음) (레퍼런스 `reference/p3-viewer-arena/client/src/style.css`)
  - 지움 `C:\dev\viewer-arena\client\src\local\vec2.ts` — 로컬 게임 원본 — Rust로 옮겼으니 삭제 (레퍼런스에 없음 — 중간 파일)
  - 지움 `C:\dev\viewer-arena\client\src\local\rules.ts` — 삭제 (레퍼런스에 없음 — 중간 파일)
  - 지움 `C:\dev\viewer-arena\client\src\local\physics.ts` — 삭제 (레퍼런스에 없음 — 중간 파일)
  - 지움 `C:\dev\viewer-arena\client\src\local\world.ts` — 삭제(`client\src\local` 폴더째) (레퍼런스에 없음 — 중간 파일)
- 끝 상태 확인: 탭 두 개에서 `철수`, `영희`로 참가하면 둘 다 아레나에 보이고, 한 탭에서 움직이면 다른 탭에서도 (뚝뚝 끊기며) 움직인다. 한 탭을 닫으면 다른 탭에서 사라진다. `/api/room` → `"players":2`. 빈 닉네임 → `닉네임을 입력해 주세요.` `cargo test -p game-core` 20개 통과. `npx tsc --noEmit` 오류 없음.
- 과제:
  1) 13자 닉네임으로 참가해 안내 문구 확인(쉬움) → 정답 요지: `닉네임은 12자까지 쓸 수 있어요.`(입력칸 maxlength를 개발자 도구로 지워야 보낼 수 있음)
  2) Console에서 join만 보내고 ping을 안 보내는 WebSocket을 만들어 10초 뒤 `/api/room`의 players가 줄어드는지 확인(보통) → 정답 요지: 유휴 타임아웃으로 정리
  3) `room.leave(id)`를 `play` 루프 뒤 한 곳에만 두는 이유 쓰기(보통) → 정답 요지: 닫기·끊김·무응답·오류 어떤 길로 끝나도 반드시 지나감
- 용어(사전 담당): 유휴 타임아웃, 하트비트
- 자주 막히는 곳 후보: 열리기 전에 `join`을 보내 참가가 안 됨 → `onOpen`에서 보냄 / `hidden` 속성을 줬는데 폼이 계속 보임(`display: grid`가 이김) → Day 13에 넣은 `[hidden] { display: none !important; }`가 있는지(T20에서 실제로 난 버그) / 같은 닉네임 두 명이 들어가짐 → 정상(오늘은 막지 않음, Day 32) / `client\src\local`을 지운 뒤 남은 import 때문에 `error TS2307` → 오늘 `play.ts`를 통째로 바꿨는지 / 움직임이 뚝뚝 끊김 → 정상(매 스냅샷을 그대로 그림), 내일 보간 / 노트북 절전으로 탭이 멈추면 10초 뒤 정리돼 다시 참가해야 함 → 정상 동작
- 레퍼런스 대응: `client/play.html`(viewport 제외 최종과 같음), `client/src/style.css` play 구역(최종과 같음), `crates/game-core/src/protocol.rs`(NameError Empty·TooLong판 — Day 32), `ws.rs`·`app.rs`·`main.rs`·`play.ts` 중간 단계, `client/src/local/` 삭제(레퍼런스에 없음).

## Day 27 — 상태 동기화 (100분)
- 목표: 상태 동기화 방식(전체 스냅샷 vs 바뀐 것만)을 비교하고 "세계 전체를 1초에 10번"을 고른다. `room.rs`의 `tick`을 "틱 번호가 `TICK_HZ / SNAPSHOT_HZ`(=2)의 배수일 때만 스냅샷"으로 바꾼다(`u64::is_multiple_of`). 받은 그대로 그리면 100ms마다 뚝뚝 끊기는 이유와, 화면을 150ms(한 간격 100 + 흔들림 여유 50) 과거로 그리며 그 시각을 사이에 둔 두 스냅샷을 선형 보간하는 방법을 그림으로 설명한다. `client\src\interp.ts`(`INTERP_DELAY_MS`, `lerp`, `interpolatePlayers`(같은 id끼리, 새 플레이어는 그대로), `SnapshotBuffer`(최근 30개, `push`, `latest`, `playersAt`))를 만들고 `play.ts`는 받은 시각(`performance.now()`)과 함께 버퍼에 넣고 매 프레임 `playersAt(now)`로 그린다. 개발자 도구 WS Messages에서 스냅샷 한 개의 길이와 초당 개수를 잰다.
- 이미 배운 것: [Day 26](#/day/p3-d26)의 네트워크 play.ts·스냅샷 처리, [Day 25](#/day/p3-d25)의 tick·broadcast, [Day 21](#/day/p3-d21)의 틱 레이트·스냅샷 빈도·대역폭, [Day 13](#/day/p3-d13)의 `performance.now()`·rAF, TS 클래스(`private` 필드)·`Map`([P2 Day 5](#/day/p2-d05), [P2 Day 12](#/day/p2-d12)의 클래스 개념), 스프레드 `{ ...p }`·`Array.prototype.at`(한 줄 설명).
- 시작 상태: 어제(Day 26) 끝 상태예요. 서버와 `npm run dev`를 켜고, 탭 두 개로 참가해 두고 시작해요.
  - (Day 26 끝 상태와 같아요. 다르면 [Day 26](#/day/p3-d26)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\` 연습 폴더(Day 12까지 사용, 이후 그대로 둠)
  - `C:\dev\viewer-arena\.gitignore`
  - `C:\dev\viewer-arena\Cargo.lock`
  - `C:\dev\viewer-arena\Cargo.toml`
  - `C:\dev\viewer-arena\client\index.html`
  - `C:\dev\viewer-arena\client\package-lock.json`
  - `C:\dev\viewer-arena\client\package.json`
  - `C:\dev\viewer-arena\client\play.html`
  - `C:\dev\viewer-arena\client\public\favicon.svg`
  - `C:\dev\viewer-arena\client\src\home.ts`
  - `C:\dev\viewer-arena\client\src\input.ts`
  - `C:\dev\viewer-arena\client\src\net.ts`
  - `C:\dev\viewer-arena\client\src\play.ts`
  - `C:\dev\viewer-arena\client\src\protocol.ts`
  - `C:\dev\viewer-arena\client\src\render.ts`
  - `C:\dev\viewer-arena\client\src\style.css`
  - `C:\dev\viewer-arena\client\src\wasm.ts`
  - `C:\dev\viewer-arena\client\tsconfig.json`
  - `C:\dev\viewer-arena\client\vite.config.ts`
  - `C:\dev\viewer-arena\crates\game-core\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-core\src\lib.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\physics.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\protocol.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\rules.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\vec2.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\world.rs`
  - `C:\dev\viewer-arena\crates\game-wasm\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-wasm\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\Cargo.toml`
  - `C:\dev\viewer-arena\crates\server\src\app.rs`
  - `C:\dev\viewer-arena\crates\server\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\src\main.rs`
  - `C:\dev\viewer-arena\crates\server\src\room.rs`
  - `C:\dev\viewer-arena\crates\server\src\ws.rs`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\viewer-arena\target\`, `C:\dev\viewer-arena\.git\`, `C:\dev\viewer-arena\client\node_modules\`, `C:\dev\viewer-arena\client\src\wasm\`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치), wasm-bindgen-cli 0.2.130(`wasm-bindgen --version`)
- 오늘 만들/바꿀 파일:
  - 새로 만듦 `C:\dev\viewer-arena\client\src\interp.ts` — 레퍼런스와 같음(그림 주석 포함) (레퍼런스 `reference/p3-viewer-arena/client/src/interp.ts`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\src\room.rs` — `tick`의 스냅샷 조건을 10Hz로(최종과 같은 `if`) (레퍼런스 `reference/p3-viewer-arena/crates/server/src/room.rs`)
  - 바꿈 `C:\dev\viewer-arena\client\src\play.ts` — `SnapshotBuffer`에 넣고 `playersAt(now)`로 그리기, 아이템은 `latest()` (레퍼런스 `reference/p3-viewer-arena/client/src/play.ts`)
- 끝 상태 확인: 다른 탭의 플레이어가 부드럽게 움직인다. WS Messages에 스냅샷이 1초에 약 10개 온다. 내 플레이어는 여전히 조작보다 늦게 움직인다(내일 예측).
- 과제:
  1) `INTERP_DELAY_MS`를 0으로 바꿔 보고 끊김을 관찰한 뒤 되돌리기(쉬움) → 정답 요지: 그릴 "다음" 스냅샷이 아직 없어 마지막 것에 멈췄다 튐
  2) `lerp(10, 20, 0.6)` 계산(쉬움) → 정답 요지: 16
  3) 참가자 1명·10명일 때 스냅샷 길이를 재서 사람당 몇 바이트 늘어나는지 계산(보통) → 정답 요지: 탭을 늘려 Messages 길이 비교(대략 100바이트 안팎 — 실제 값 적기)
- 용어(사전 담당): 스냅샷, 상태 동기화, 보간
- 자주 막히는 곳 후보: ``error[E0658]``/`no method named `is_multiple_of`` → Rust 1.87 이상 필요(`rustc --version`, Day 1의 1.94 이상이면 됨) / `Date.now()`와 `performance.now()`를 섞어 보간 시각이 엉망 → 하나만 / 새로 들어온 플레이어가 (0,0)에서 날아옴 → 이전 상태가 없으면 그대로 그리기 / 탭이 백그라운드면 rAF가 멈춰 버퍼가 오래됨 → 돌아오면 곧 정상
- 레퍼런스 대응: `client/src/interp.ts`(최종과 같음), `crates/server/src/room.rs`의 10Hz 스냅샷 조건(최종과 같음), `play.ts` 중간 단계.

## Day 28 — 입력과 예측 (120분)
- 목표: 입력 보내기를 완성한다: 1초에 20번(`TICK_HZ`) 방향을 읽어 바뀌었거나 1초(`RESEND_MS`)가 지났으면 `{ t: 'input', seq, dx, dy }`를 보낸다(중간에 사라진 입력이 저절로 고쳐짐), `input.ts`에 `round2`(소수 둘째 자리 — 메시지가 짧아지고 작은 흔들림 무시)를 더한다. 서버 `ws.rs`의 `play`는 `last_seq`보다 작거나 같은 `seq`를 버린다(늦게 도착한 옛 입력). 클라이언트 예측: 서버를 기다리면 손가락보다 화면이 늦으니 내 플레이어만 매 프레임 `predictBody`(Day 20의 WASM — 서버와 같은 `move_body`)로 움직인다. 보정: 스냅샷이 오면 서버 위치를 RTT의 절반만큼 앞으로 계산(`predictBody(server, readInput(), rtt / 2000)`)해 내 예측과 비교, 80 넘게 다르면 바로 맞추고(`SNAP_DISTANCE`), 아니면 차이의 30%씩(`CORRECTION`) 다가간다. 정석 방식(서버가 "몇 번 입력까지 처리했는지" 알려 주면 그 뒤 입력을 다시 적용하는 재적용 보정)은 이 프로토콜에 확인 번호가 없어서 개념으로만 설명한다(브리프 notes). `play.ts`: 참가할 때 `loadWasm()`, `correct()`, `frame`에서 예측 위치로 내 플레이어를 그림. `:::info`: 유니티 Netcode·언리얼 CharacterMovementComponent의 예측·보정과 같은 생각.
- 이미 배운 것: [Day 27](#/day/p3-d27)의 스냅샷 버퍼·보간, [Day 20](#/day/p3-d20)의 `loadWasm`·`predictBody`, [Day 24](#/day/p3-d24)의 RTT(`rttMs`), [Day 21](#/day/p3-d21)의 지연, [Day 19](#/day/p3-d19)의 결정성, [Day 26](#/day/p3-d26)의 입력 보내기·ws `play` 루프, `try`/`catch`([P1 Day 25](#/day/p1-d25)).
- 시작 상태: 어제(Day 27) 끝 상태예요. `client\src\wasm\`가 없으면 `npm run wasm`을 먼저 실행해요. 서버와 `npm run dev`를 켜고 시작해요.
  - (Day 27 끝 상태와 같아요. 다르면 [Day 27](#/day/p3-d27)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\` 연습 폴더(Day 12까지 사용, 이후 그대로 둠)
  - `C:\dev\viewer-arena\.gitignore`
  - `C:\dev\viewer-arena\Cargo.lock`
  - `C:\dev\viewer-arena\Cargo.toml`
  - `C:\dev\viewer-arena\client\index.html`
  - `C:\dev\viewer-arena\client\package-lock.json`
  - `C:\dev\viewer-arena\client\package.json`
  - `C:\dev\viewer-arena\client\play.html`
  - `C:\dev\viewer-arena\client\public\favicon.svg`
  - `C:\dev\viewer-arena\client\src\home.ts`
  - `C:\dev\viewer-arena\client\src\input.ts`
  - `C:\dev\viewer-arena\client\src\interp.ts`
  - `C:\dev\viewer-arena\client\src\net.ts`
  - `C:\dev\viewer-arena\client\src\play.ts`
  - `C:\dev\viewer-arena\client\src\protocol.ts`
  - `C:\dev\viewer-arena\client\src\render.ts`
  - `C:\dev\viewer-arena\client\src\style.css`
  - `C:\dev\viewer-arena\client\src\wasm.ts`
  - `C:\dev\viewer-arena\client\tsconfig.json`
  - `C:\dev\viewer-arena\client\vite.config.ts`
  - `C:\dev\viewer-arena\crates\game-core\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-core\src\lib.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\physics.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\protocol.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\rules.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\vec2.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\world.rs`
  - `C:\dev\viewer-arena\crates\game-wasm\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-wasm\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\Cargo.toml`
  - `C:\dev\viewer-arena\crates\server\src\app.rs`
  - `C:\dev\viewer-arena\crates\server\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\src\main.rs`
  - `C:\dev\viewer-arena\crates\server\src\room.rs`
  - `C:\dev\viewer-arena\crates\server\src\ws.rs`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\viewer-arena\target\`, `C:\dev\viewer-arena\.git\`, `C:\dev\viewer-arena\client\node_modules\`, `C:\dev\viewer-arena\client\src\wasm\`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치), wasm-bindgen-cli 0.2.130(`wasm-bindgen --version`)
- 오늘 만들/바꿀 파일:
  - 바꿈 `C:\dev\viewer-arena\client\src\input.ts` — `round2` 추가 — 최종과 같음 (레퍼런스 `reference/p3-viewer-arena/client/src/input.ts`)
  - 바꿈 `C:\dev\viewer-arena\client\src\play.ts` — `readInput = round2(readStick())`, `startSending`(seq·RESEND_MS·TICK_HZ), `loadWasm`, `correct`(SNAP_DISTANCE·CORRECTION·RTT/2), 예측으로 내 플레이어 그리기 (레퍼런스 `reference/p3-viewer-arena/client/src/play.ts`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\src\ws.rs` — `play`에 `last_seq` — 오래된 입력 버리기(최종과 같은 `if seq > last_seq`) (레퍼런스 `reference/p3-viewer-arena/crates/server/src/ws.rs`)
- 끝 상태 확인: 내 플레이어가 조이스틱·키에 바로 반응하고, 다른 탭에서는 같은 움직임이 부드럽게 보인다. 벽에 부딪혀도 튀지 않는다. 입력을 가만히 두어도 1초마다 `input`이 하나씩 나가는 것이 WS Messages에 보인다.
- 과제:
  1) 예측을 잠시 끄고(스냅샷 위치만 쓰기) 손맛을 비교한 뒤 되돌리기(쉬움) → 정답 요지: 끄면 100~150ms 늦게 움직임
  2) `SNAP_DISTANCE`를 0으로 바꾸면 어떻게 보이는지 관찰 후 되돌리기(보통) → 정답 요지: 스냅샷마다 서버 위치로 순간 이동해 덜컥거림
  3) `seq`가 없으면 생길 수 있는 문제를 한 문장으로(보통) → 정답 요지: 늦게 도착한 옛 방향이 새 방향을 덮어씀
- 용어(사전 담당): 클라이언트 예측, 서버 보정, 시퀀스 번호
- 자주 막히는 곳 후보: 새로 받은 저장소·폴더에서 `error TS2307: Cannot find module './wasm/game_wasm.js'` → `npm run wasm` / `rules.rs`를 고친 뒤 서버만 다시 켜고 wasm을 다시 빌드하지 않아 예측과 서버가 어긋나 계속 당겨짐 → `npm run wasm`도 / 보정 비율이 너무 크면 덜컥, 너무 작으면 늦게 따라옴 → 30%의 이유 / WASM 준비 전에 `predictBody` 호출 → 참가 전에 `await loadWasm()`
- 레퍼런스 대응: `client/src/input.ts`(최종과 같음), `crates/server/src/ws.rs`의 seq 검사(최종과 같음), `play.ts`(방 코드·`fetchRoom`·`joinFailed`는 Day 29 — 중간 단계).

## Day 29 — 방 시스템 (120분)
- 목표: 한 서버에 여러 방송(방)을 동시에 여는 구조를 설계한다. `crates\server\src\rooms.rs`(`MAX_ROOMS = 100`, `Rooms { inner: Arc<Mutex<HashMap<String, RoomHandle>>> }`(잠그는 시간이 짧고 안에서 `.await`하지 않아 표준 Mutex로 충분), `create()`(코드가 겹치면 다시 뽑기, 액터를 `spawn`할 때 `RemoveOnDrop` 경비원을 함께 들려 보냄), `get`(소문자도 대문자로), `remove`(Drop 안에서 불리니 panic 금지), `random_code`(대문자 4자, 26⁴), 테스트 5개(오늘판: `create()`·`new_room(…, 1)` — db 인수는 Day 35))를 만든다. `Drop` 트레이트로 "값이 사라질 때 반드시 실행"을 구현하고 `:::info`로 C++ RAII·소멸자와 연결한다(Day 4 복습). `room.rs`: `EMPTY_ROOM_SECS = 60`, 틱마다 `events.receiver_count() == 0`이면 세고 60초가 차면 `break`, 끝날 때 `빈 방이라 닫았어요` 로그. `error.rs`: `AppError { RoomNotFound, TooManyRooms }` + `IntoResponse`(404·503 + `{"code","message"}` JSON — `Database`는 Day 36). `app.rs`: `AppState { rooms: Rooms, idle_timeout }` + `AppState::new()`, `POST /api/rooms` → `201 {code}`, `GET /api/rooms/{code}` → `RoomInfo` 또는 404, `/ws/{code}`(axum 0.8 경로 문법 `{code}`), `/api/room` 삭제. `ws.rs`: `ws_handler`가 `Path(code)`로 방을 찾고 없으면 업그레이드 전에 404(`Result<Response, AppError>`). `main.rs`: 기본 방 없이 `AppState::new()`. 서버 `Cargo.toml`에 `[dev-dependencies] tokio = { workspace = true, features = ["test-util"] }`(시계를 멈추고 빨리 감는 `#[tokio::test(start_paused = true)]`). 클라이언트: `protocol.ts`에 `RoomInfo`, `net.ts`에 `normalizeCode`, `roomFromUrl`, `createRoom`, `fetchRoom`과 `connect(room, handlers)`(주소 `/ws/${encodeURIComponent(room)}`), `index.html`을 방 만들기·참가 첫 화면으로(`#create`, `#created`의 `#room-code`·`#play-link`, `#join-form`의 `#code`, `#status` — OBS 주소 줄과 127.0.0.1 안내는 Day 30·31), `home.ts`(방 만들기 → 코드·참가 주소, 코드 입력 → `/play.html?room=CODE`, 영문 4자 검사), `play.ts`(주소의 `?room=`, `#room-label`에 `방 ABCD`, 참가 전에 `fetchRoom`으로 방 확인, `joinFailed`로 버튼 되살리기, 서버가 보낸 오류 문구를 지키는 `gotError`), `style.css` 공통(`.row`, `.room-code`, `.visually-hidden`, `a`, `button:disabled`)과 index 구역.
- 이미 배운 것: [Day 25](#/day/p3-d25)·[Day 26](#/day/p3-d26)의 액터·RoomHandle·`subscribe`·ws 세션, [Day 12](#/day/p3-d12)의 `Arc<Mutex>`, [Day 9](#/day/p3-d09)의 HashMap, [Day 4](#/day/p3-d04)의 RAII·drop, [Day 10](#/day/p3-d10)의 트레이트 구현, [Day 24](#/day/p3-d24)의 오류 응답 모양, REST 설계·라우트 매개변수·201/404/503([P2 Day 16](#/day/p2-d16), [P2 Day 18](#/day/p2-d18)), ProblemDetails처럼 오류를 JSON으로([P2 Day 24](#/day/p2-d24)), `fetch` POST·`response.ok`([P2 Day 8](#/day/p2-d08)), `URLSearchParams`·`location.href`([P1 Day 27](#/day/p1-d27)), 정규식 `/^[A-Z]{4}$/`는 한 줄 설명.
- 시작 상태: 어제(Day 28) 끝 상태예요. 서버와 `npm run dev`를 켜고 시작해요. 오늘부터 서버 주소가 바뀌어서 어제의 `play.html`은 방 코드 없이는 들어갈 수 없어요.
  - (Day 28 끝 상태와 같아요. 다르면 [Day 28](#/day/p3-d28)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\` 연습 폴더(Day 12까지 사용, 이후 그대로 둠)
  - `C:\dev\viewer-arena\.gitignore`
  - `C:\dev\viewer-arena\Cargo.lock`
  - `C:\dev\viewer-arena\Cargo.toml`
  - `C:\dev\viewer-arena\client\index.html`
  - `C:\dev\viewer-arena\client\package-lock.json`
  - `C:\dev\viewer-arena\client\package.json`
  - `C:\dev\viewer-arena\client\play.html`
  - `C:\dev\viewer-arena\client\public\favicon.svg`
  - `C:\dev\viewer-arena\client\src\home.ts`
  - `C:\dev\viewer-arena\client\src\input.ts`
  - `C:\dev\viewer-arena\client\src\interp.ts`
  - `C:\dev\viewer-arena\client\src\net.ts`
  - `C:\dev\viewer-arena\client\src\play.ts`
  - `C:\dev\viewer-arena\client\src\protocol.ts`
  - `C:\dev\viewer-arena\client\src\render.ts`
  - `C:\dev\viewer-arena\client\src\style.css`
  - `C:\dev\viewer-arena\client\src\wasm.ts`
  - `C:\dev\viewer-arena\client\tsconfig.json`
  - `C:\dev\viewer-arena\client\vite.config.ts`
  - `C:\dev\viewer-arena\crates\game-core\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-core\src\lib.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\physics.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\protocol.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\rules.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\vec2.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\world.rs`
  - `C:\dev\viewer-arena\crates\game-wasm\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-wasm\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\Cargo.toml`
  - `C:\dev\viewer-arena\crates\server\src\app.rs`
  - `C:\dev\viewer-arena\crates\server\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\src\main.rs`
  - `C:\dev\viewer-arena\crates\server\src\room.rs`
  - `C:\dev\viewer-arena\crates\server\src\ws.rs`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\viewer-arena\target\`, `C:\dev\viewer-arena\.git\`, `C:\dev\viewer-arena\client\node_modules\`, `C:\dev\viewer-arena\client\src\wasm\`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치), wasm-bindgen-cli 0.2.130(`wasm-bindgen --version`)
- 오늘 만들/바꿀 파일:
  - 새로 만듦 `C:\dev\viewer-arena\crates\server\src\rooms.rs` — 레퍼런스에서 db 인수만 뺀 모양(`create()`, 테스트의 `create()`·`new_room("BOOM".to_string(), 1)`) — Day 35에 `db` 추가 (레퍼런스 `reference/p3-viewer-arena/crates/server/src/rooms.rs`)
  - 새로 만듦 `C:\dev\viewer-arena\crates\server\src\error.rs` — 오늘판: `AppError { RoomNotFound, TooManyRooms }`, `ErrorBody`, `IntoResponse` — `Database`·`From<sqlx::Error>`는 Day 36 (레퍼런스 `reference/p3-viewer-arena/crates/server/src/error.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\src\room.rs` — `EMPTY_ROOM_SECS`, 빈 틱 세기, 닫힘 로그 추가 (레퍼런스 `reference/p3-viewer-arena/crates/server/src/room.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\src\app.rs` — `AppState { rooms, idle_timeout }`, `AppState::new()`, `create_room`·`room_info`, 맨 위 주소표 주석(랭킹·정적 파일 줄 제외) (레퍼런스 `reference/p3-viewer-arena/crates/server/src/app.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\src\ws.rs` — `ws_handler`가 `Path(code)` + `State`로 방 찾기, 없으면 `AppError::RoomNotFound` (레퍼런스 `reference/p3-viewer-arena/crates/server/src/ws.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\src\main.rs` — 기본 방 삭제, `AppState::new()` (레퍼런스 `reference/p3-viewer-arena/crates/server/src/main.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\src\lib.rs` — `pub mod error;`, `pub mod rooms;` 추가 (레퍼런스 `reference/p3-viewer-arena/crates/server/src/lib.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\Cargo.toml` — `[dev-dependencies]` tokio `test-util`(주석 포함) (레퍼런스 `reference/p3-viewer-arena/crates/server/Cargo.toml`)
  - 바꿈 `C:\dev\viewer-arena\Cargo.lock` — 변화가 없을 수도 있음(자동) (레퍼런스 `reference/p3-viewer-arena/Cargo.lock`)
  - 바꿈 `C:\dev\viewer-arena\client\src\protocol.ts` — `RoomInfo` 추가 (레퍼런스 `reference/p3-viewer-arena/client/src/protocol.ts`)
  - 바꿈 `C:\dev\viewer-arena\client\src\net.ts` — `normalizeCode`, `roomFromUrl`, `createRoom`, `fetchRoom`, `connect(room, handlers)` (레퍼런스 `reference/p3-viewer-arena/client/src/net.ts`)
  - 바꿈 `C:\dev\viewer-arena\client\index.html` — 방 만들기·참가 첫 화면(레퍼런스에서 `#lan-tip` 문단과 OBS 주소 줄을 뺀 모양) (레퍼런스 `reference/p3-viewer-arena/client/index.html`)
  - 바꿈 `C:\dev\viewer-arena\client\src\home.ts` — 오늘판: 방 만들기·참가(레퍼런스에서 `hostLink`·`lanTip` 줄을 뺀 모양) (레퍼런스 `reference/p3-viewer-arena/client/src/home.ts`)
  - 바꿈 `C:\dev\viewer-arena\client\src\play.ts` — 방 코드 읽기, `fetchRoom` 확인, `joinFailed`, `gotError`, 방 없음 안내 (레퍼런스 `reference/p3-viewer-arena/client/src/play.ts`)
  - 바꿈 `C:\dev\viewer-arena\client\src\style.css` — 공통 `a`·`button:disabled`·`.row`·`.room-code`·`.visually-hidden`, index 구역(`.page-home …`, `.lead`) (레퍼런스 `reference/p3-viewer-arena/client/src/style.css`)
- 끝 상태 확인: `http://localhost:5173/`에서 **방 만들기** → `방 코드 QWER` 같은 4자와 참가 주소가 보인다. 참가 주소를 탭 두 개로 열어 같은 방에서 논다. 방을 하나 더 만들면 서로 안 보인다. `curl.exe -i http://127.0.0.1:8080/api/rooms/ZZZZ` → `404` + `{"code":"room_not_found",…}`. 모든 탭을 닫고 60초 뒤 그 방도 404. `cargo test -p server` → rooms 테스트 5개 통과(panic 메시지가 한 번 찍히는 것은 정상).
- 과제:
  1) `curl.exe -X POST http://127.0.0.1:8080/api/rooms`로 방 3개를 만들고 코드 확인(쉬움) → 정답 요지: `{"code":"…"}` 3번, 상태 201
  2) 소문자 코드(`qwer`)로도 참가되는지 확인하고 어디서 대문자로 바꾸는지 찾기(쉬움) → 정답 요지: 서버 `Rooms::get`의 `to_ascii_uppercase`, 클라이언트 `normalizeCode`
  3) `RemoveOnDrop`이 없으면 액터가 panic했을 때 생기는 일 쓰기(보통) → 정답 요지: 코드는 있는데 아무도 답하지 않는 죽은 방이 목록에 남음
- 용어(사전 담당): 방 코드, Drop
- 자주 막히는 곳 후보: 경로를 `/ws/:code`로 써서 서버가 시작하자마자 panic(axum 0.8은 `{code}`) — 원문 그대로 실어 풀이 / 어제 주소 `/ws`로 연결해 404 → 방 코드가 있는 주소 / 서버를 다시 켜면 방이 모두 사라짐(메모리에만 있음) → 새 방 / `#[tokio::test(start_paused = true)]` 테스트가 `test-util` 기능 없이 컴파일 오류 → dev-dependencies / `Mutex` 잠금 중 panic으로 `PoisonError` → `remove`가 무시하는 이유 / `home.ts`에서 폼 기본 동작으로 페이지가 새로 고침됨 → `preventDefault`
- 레퍼런스 대응: `crates/server/src/rooms.rs`(db 인수 제외 — Day 35), `error.rs`(Database 제외 — Day 36), `room.rs`(빈 방 정리 추가), `Cargo.toml`(server dev-dependencies의 tokio 줄은 최종과 같음); `app.rs`·`ws.rs`·`main.rs`·`client/index.html`·`home.ts`·`net.ts`·`play.ts` 중간 단계, `protocol.ts`의 `RoomInfo`는 최종과 같음.

## Day 30 — 호스트 화면(OBS) (120분)
- 목표: 관전 화면(플레이어가 아니라 보기만 하는 연결)을 설계한다. 서버 `ws.rs`: `Role { Host, Player }`(lowercase), `WsParams { role }`, `ws_handler`가 `Query`로 역할을 받아 나눔, `host_session`(welcome `id: 0`, 방 이벤트 넘기기, 유휴 기한, ping → pong — 빈도 제한은 Day 32). 클라이언트 `protocol.ts`에 `Role`, `net.ts`의 `connect(room, role, handlers)`(주소 `?role=` — 최종 시그니처), `play.ts`는 `'player'`로. `host.html`(레퍼런스에서 랭킹 `aside#board`만 뺀 모양: `html.transparent`, `body.page-host`, `canvas#arena[data-players]`, 왼쪽 위 HUD `#phase`·`#time`·`#count`, 오른쪽 아래 `canvas#qr` + 방 코드 + 참가 주소, `section#result`), `host.ts`(오늘판: 방 확인 → 관전 연결, 스냅샷 보간 그리기, HUD(아무도 없으면 `참가자를 기다려요`), 결과 상위 5명을 `textContent`로(시청자 닉네임이라 innerHTML 금지), 끊기면 3초 뒤 스스로 다시 연결(OBS 화면은 방송 내내 켜 둠) — 랭킹·127.0.0.1 경고는 Day 36·31), `qr.ts`(qrcode-generator가 칸 계산, Canvas로 직접 그림, 흰 바탕·여백 4칸), `npm install qrcode-generator@2.0.4 --save-exact`, `style.css` host 구역(투명 배경, HUD 위치, `.panel`, `.join-box`, `.result`), `index.html`·`home.ts`에 "OBS 브라우저 소스 주소" 링크. 여러 페이지 빌드: `vite.config.ts`에 `build.rolldownOptions.input: ['index.html', 'host.html', 'play.html']`(최종). 서버가 빌드 결과를 서빙: 루트 `Cargo.toml`에 `tower-http = { version = "=0.7.1", features = ["fs"] }`, 서버 `Cargo.toml`에 tower-http, `app.rs`의 `router(state, static_dir: &Path)`에 `.fallback_service(ServeDir::new(static_dir))`(맨 위 주소표 주석의 "그 밖" 줄), `main.rs`는 `router(AppState::new(), Path::new("client/dist"))` + `client/dist/index.html`이 없으면 경고. `npm run build`(wasm이 먼저 있어야 함) → `cargo run -p server`(반드시 `C:\dev\viewer-arena`에서) → `http://127.0.0.1:8080`에서 방 만들기 → OBS **소스 목록 + → 브라우저**, URL에 관전 주소, 너비 1920·높이 1080.
- 이미 배운 것: [Day 26](#/day/p3-d26)~[Day 29](#/day/p3-d29)의 ws 세션·방 코드·`fetchRoom`, [Day 27](#/day/p3-d27)의 `SnapshotBuffer`, [Day 14](#/day/p3-d14)의 `drawScene`(투명 지우기), [Day 22](#/day/p3-d22)의 Axum 라우터, OBS 브라우저 소스·투명 배경 오버레이([P1 Day 27](#/day/p1-d27)), Vite 빌드·`dist`([P2 Day 7](#/day/p2-d07)), 빌드 결과를 서버가 정적 파일로 제공(`wwwroot`, [P2 Day 38](#/day/p2-d38)), XSS와 `textContent`([P2 Day 34](#/day/p2-d34)), `setTimeout`([P1 Day 26](#/day/p1-d26)), npm 패키지 설치([P2 Day 3](#/day/p2-d03)).
- 시작 상태: 어제(Day 29) 끝 상태예요. OBS Studio가 설치되어 있어야 해요(P1 Day 27, 작성 기준일 2026-11 33.0.1). 인터넷이 필요해요(qrcode-generator, tower-http).
  - (Day 29 끝 상태와 같아요. 다르면 [Day 29](#/day/p3-d29)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\` 연습 폴더(Day 12까지 사용, 이후 그대로 둠)
  - `C:\dev\viewer-arena\.gitignore`
  - `C:\dev\viewer-arena\Cargo.lock`
  - `C:\dev\viewer-arena\Cargo.toml`
  - `C:\dev\viewer-arena\client\index.html`
  - `C:\dev\viewer-arena\client\package-lock.json`
  - `C:\dev\viewer-arena\client\package.json`
  - `C:\dev\viewer-arena\client\play.html`
  - `C:\dev\viewer-arena\client\public\favicon.svg`
  - `C:\dev\viewer-arena\client\src\home.ts`
  - `C:\dev\viewer-arena\client\src\input.ts`
  - `C:\dev\viewer-arena\client\src\interp.ts`
  - `C:\dev\viewer-arena\client\src\net.ts`
  - `C:\dev\viewer-arena\client\src\play.ts`
  - `C:\dev\viewer-arena\client\src\protocol.ts`
  - `C:\dev\viewer-arena\client\src\render.ts`
  - `C:\dev\viewer-arena\client\src\style.css`
  - `C:\dev\viewer-arena\client\src\wasm.ts`
  - `C:\dev\viewer-arena\client\tsconfig.json`
  - `C:\dev\viewer-arena\client\vite.config.ts`
  - `C:\dev\viewer-arena\crates\game-core\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-core\src\lib.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\physics.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\protocol.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\rules.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\vec2.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\world.rs`
  - `C:\dev\viewer-arena\crates\game-wasm\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-wasm\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\Cargo.toml`
  - `C:\dev\viewer-arena\crates\server\src\app.rs`
  - `C:\dev\viewer-arena\crates\server\src\error.rs`
  - `C:\dev\viewer-arena\crates\server\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\src\main.rs`
  - `C:\dev\viewer-arena\crates\server\src\room.rs`
  - `C:\dev\viewer-arena\crates\server\src\rooms.rs`
  - `C:\dev\viewer-arena\crates\server\src\ws.rs`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\viewer-arena\target\`, `C:\dev\viewer-arena\.git\`, `C:\dev\viewer-arena\client\node_modules\`, `C:\dev\viewer-arena\client\src\wasm\`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치), wasm-bindgen-cli 0.2.130(`wasm-bindgen --version`)
- 오늘 만들/바꿀 파일:
  - 새로 만듦 `C:\dev\viewer-arena\client\host.html` — 레퍼런스에서 `aside#board`(랭킹)만 뺀 모양 — Day 36에 추가 (레퍼런스 `reference/p3-viewer-arena/client/host.html`)
  - 새로 만듦 `C:\dev\viewer-arena\client\src\host.ts` — 오늘판: `listItem`, `showHud`, `showResult`, `RECONNECT_MS`, `watch`, `start` — `refreshBoard`·`normalStatus`는 Day 36·31 (레퍼런스 `reference/p3-viewer-arena/client/src/host.ts`)
  - 새로 만듦 `C:\dev\viewer-arena\client\src\qr.ts` — 레퍼런스와 같음 (레퍼런스 `reference/p3-viewer-arena/client/src/qr.ts`)
  - 바꿈 `C:\dev\viewer-arena\client\src\protocol.ts` — `Role` 추가 (레퍼런스 `reference/p3-viewer-arena/client/src/protocol.ts`)
  - 바꿈 `C:\dev\viewer-arena\client\src\net.ts` — `connect(room, role, handlers)` — 최종 시그니처 (레퍼런스 `reference/p3-viewer-arena/client/src/net.ts`)
  - 바꿈 `C:\dev\viewer-arena\client\src\play.ts` — `connect(room, 'player', …)` — 이제 레퍼런스와 같음 (레퍼런스 `reference/p3-viewer-arena/client/src/play.ts`)
  - 바꿈 `C:\dev\viewer-arena\client\index.html` — `#created`에 `OBS 브라우저 소스 주소` 링크(`#host-link`) (레퍼런스 `reference/p3-viewer-arena/client/index.html`)
  - 바꿈 `C:\dev\viewer-arena\client\src\home.ts` — `hostLink` 설정 추가 (레퍼런스 `reference/p3-viewer-arena/client/src/home.ts`)
  - 바꿈 `C:\dev\viewer-arena\client\src\style.css` — host 구역 전체(레퍼런스와 같음) (레퍼런스 `reference/p3-viewer-arena/client/src/style.css`)
  - 바꿈 `C:\dev\viewer-arena\client\vite.config.ts` — `build.rolldownOptions.input` 추가 — 최종과 같음 (레퍼런스 `reference/p3-viewer-arena/client/vite.config.ts`)
  - 바꿈 `C:\dev\viewer-arena\client\package.json` — `"dependencies": { "qrcode-generator": "2.0.4" }` — 최종과 같음 (레퍼런스 `reference/p3-viewer-arena/client/package.json`)
  - 바꿈 `C:\dev\viewer-arena\client\package-lock.json` — qrcode-generator 추가(자동) (레퍼런스 `reference/p3-viewer-arena/client/package-lock.json`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\src\ws.rs` — `Role`, `WsParams`, `host_session`, 역할로 나누기 (레퍼런스 `reference/p3-viewer-arena/crates/server/src/ws.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\src\app.rs` — `router(state, static_dir: &Path)` + `ServeDir` 대체 서비스(주소표 주석 갱신) (레퍼런스 `reference/p3-viewer-arena/crates/server/src/app.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\src\main.rs` — `Path::new("client/dist")`로 정적 파일, 없으면 경고 `println!` (레퍼런스 `reference/p3-viewer-arena/crates/server/src/main.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\Cargo.toml` — tower-http 추가 (레퍼런스 `reference/p3-viewer-arena/crates/server/Cargo.toml`)
  - 바꿈 `C:\dev\viewer-arena\Cargo.toml` — `tower-http = { version = "=0.7.1", features = ["fs"] }` (레퍼런스 `reference/p3-viewer-arena/Cargo.toml`)
  - 바꿈 `C:\dev\viewer-arena\Cargo.lock` — tower-http 계열(자동) (레퍼런스 `reference/p3-viewer-arena/Cargo.lock`)
  - 오늘 생기는 생성물(커밋 안 함): `C:\dev\viewer-arena\client\dist\`
  - 오늘 설치하는 도구: OBS Studio(P1에서 설치, 오늘 사용)
- 끝 상태 확인: `npm run build` → `client\dist\index.html`, `host.html`, `play.html`과 `assets\`. `cargo run -p server` 후 `http://127.0.0.1:8080/`에서 방을 만들고 관전 주소를 OBS 브라우저 소스로 열면, 방송 장면 위에 아레나만 투명하게 겹치고 오른쪽 아래에 QR·방 코드가 보인다. 다른 탭으로 참가하면 OBS 화면의 `참가 1명`과 원이 나타나고, 라운드가 끝나면 결과 상자가 뜬다. 서버를 껐다 켜면 관전 화면이 `3초 뒤 다시 연결해요…`를 보이다가 `방을 찾을 수 없어요…`로 바뀐다(방은 메모리에만 있음 → 새 방·새 URL).
- 과제:
  1) 휴대폰으로 OBS 화면의 QR을 찍어 보고 왜 안 열리는지 쓰기(쉬움) → 정답 요지: 주소가 `127.0.0.1` = 휴대폰 자신, Day 31에서 해결
  2) OBS URL의 방 코드를 틀리게 넣었을 때 화면 문구 확인(쉬움) → 정답 요지: `방을 찾을 수 없어요. …`
  3) 결과에 닉네임을 `innerHTML`로 넣으면 왜 위험한지 쓰기(보통) → 정답 요지: 시청자가 `<img onerror=…>` 같은 닉네임으로 방송 화면에 스크립트를 넣을 수 있음(XSS)
- 용어(사전 담당): 관전 화면, QR 코드, 멀티 페이지 앱
- 자주 막히는 곳 후보: OBS에서 배경이 흰색·검은색 → `html`·`body` 투명 확인, OBS 브라우저 소스의 사용자 지정 CSS 기본값 유지 / OBS가 옛 화면을 보여 줌 → 브라우저 소스 속성의 "현재 페이지의 캐시 새로 고침"(메뉴 이름은 버전에 따라 다를 수 있어요) / `npm run build`에서 `error TS2307: Cannot find module './wasm/game_wasm.js'` → `npm run wasm` 먼저 / `crates\server`에서 `cargo run`을 해서 `client/dist`를 못 찾음(경고 + 404) → `C:\dev\viewer-arena`에서 `cargo run -p server` / `/host.html`만 404 → `vite.config.ts`의 `input`에 빠짐 / 코드를 고치고 `npm run build`를 안 해서 8080 화면이 옛것 → 개발 중에는 5173(dev 서버), 확인할 때만 build
- 레퍼런스 대응: `client/host.html`(`#board` 제외 — Day 36), `client/src/host.ts`(랭킹·127.0.0.1 경고 제외), `client/src/qr.ts`·`client/vite.config.ts`·`client/package.json`·`client/src/play.ts`(최종과 같음), `client/src/net.ts`(`isLocalOnlyAddress`·`fetchLeaderboard`·`wss:` 제외), `client/index.html`·`home.ts`(127.0.0.1 안내 제외 — Day 31), `style.css`(`.tip` 제외 — Day 31), `crates/server/src/ws.rs`(빈도 제한·쓰기 기한 제외 — Day 32), `app.rs`(router 시그니처 최종, 랭킹 제외), `Cargo.toml`·`crates/server/Cargo.toml`(tower-http).

## Day 31 — 플레이어 화면(휴대폰) (110분)
- 목표: 127.0.0.1(이 PC 자신)과 0.0.0.0(모든 네트워크 카드에서 듣기), LAN과 사설 IP 주소(192.168.x.x)를 설명한다. `main.rs`(오늘판): `HOST` 환경 변수를 읽어 `IpAddr`로(없으면 `127.0.0.1`, 틀리면 `HOST=… 는 IP 주소가 아니에요` 안내 후 종료), 포트는 아직 8080 고정, `0.0.0.0`이면 `lan_ip()`(UDP 소켓의 connect는 패킷을 보내지 않고 나갈 랜카드만 정함)로 `같은 Wi-Fi의 휴대폰에서는: http://192.168.x.x:8080`, 127.0.0.1이면 `지금은 이 PC에서만 접속돼요. 휴대폰으로 참가하려면 HOST=0.0.0.0`. `$env:HOST="0.0.0.0"`(그 창에서만 유지) → `cargo run -p server` → Windows Defender 방화벽 창에서 개인 네트워크에 체크하고 허용(브리프 요구: 방화벽 허용 단계 — 창 문구는 버전에 따라 다를 수 있어요). Wi-Fi 네트워크 프로필이 공용이면 개인으로 바꾸는 법(설정 → 네트워크 및 인터넷 → Wi-Fi → 연결 이름 → 네트워크 프로필 유형). `ipconfig`의 IPv4 주소와 로그 비교. QR은 지금 페이지 주소로 만들어지므로 PC 브라우저·OBS도 `http://192.168.x.x:8080`으로 연다. 클라이언트: `net.ts`에 `isLocalOnlyAddress()`, `index.html`에 `#lan-tip`(127.0.0.1로 열었을 때 안내), `home.ts`에서 보이기·숨기기, `host.ts`의 `normalStatus`(⚠️ 127.0.0.1 경고), `play.html` viewport에 `maximum-scale=1.0, user-scalable=no`(조이스틱 쓸 때 확대 방지 — 주석), `style.css`에 `.tip`. `npm run build` 후 휴대폰으로 실제 플레이. `:::warn`: 공유기 포트 포워딩으로 인터넷에 직접 열지 않기(배포는 Day 41~42), 방송이 끝나면 `HOST`를 지우거나 창을 닫기.
- 이미 배운 것: [Day 30](#/day/p3-d30)의 관전 화면·QR·`npm run build` + Rust 서빙, [Day 22](#/day/p3-d22)의 바인드 주소, [Day 8](#/day/p3-d08)의 Result로 설정 오류 다루기, 환경 변수와 PowerShell `$env:`([P2 Day 3](#/day/p2-d03), [P2 Day 24](#/day/p2-d24)), 포트([P2 Day 7](#/day/p2-d07)), 반응형 viewport 메타 태그([P1 Day 13](#/day/p1-d13)), `std::env::var`는 한 줄 설명.
- 시작 상태: 어제(Day 30) 끝 상태예요. 휴대폰과 PC가 **같은 Wi-Fi**에 있어야 해요(휴대폰 데이터는 끄기). OBS를 켜 두면 확인이 편해요.
  - (Day 30 끝 상태와 같아요. 다르면 [Day 30](#/day/p3-d30)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\` 연습 폴더(Day 12까지 사용, 이후 그대로 둠)
  - `C:\dev\viewer-arena\.gitignore`
  - `C:\dev\viewer-arena\Cargo.lock`
  - `C:\dev\viewer-arena\Cargo.toml`
  - `C:\dev\viewer-arena\client\host.html`
  - `C:\dev\viewer-arena\client\index.html`
  - `C:\dev\viewer-arena\client\package-lock.json`
  - `C:\dev\viewer-arena\client\package.json`
  - `C:\dev\viewer-arena\client\play.html`
  - `C:\dev\viewer-arena\client\public\favicon.svg`
  - `C:\dev\viewer-arena\client\src\home.ts`
  - `C:\dev\viewer-arena\client\src\host.ts`
  - `C:\dev\viewer-arena\client\src\input.ts`
  - `C:\dev\viewer-arena\client\src\interp.ts`
  - `C:\dev\viewer-arena\client\src\net.ts`
  - `C:\dev\viewer-arena\client\src\play.ts`
  - `C:\dev\viewer-arena\client\src\protocol.ts`
  - `C:\dev\viewer-arena\client\src\qr.ts`
  - `C:\dev\viewer-arena\client\src\render.ts`
  - `C:\dev\viewer-arena\client\src\style.css`
  - `C:\dev\viewer-arena\client\src\wasm.ts`
  - `C:\dev\viewer-arena\client\tsconfig.json`
  - `C:\dev\viewer-arena\client\vite.config.ts`
  - `C:\dev\viewer-arena\crates\game-core\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-core\src\lib.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\physics.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\protocol.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\rules.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\vec2.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\world.rs`
  - `C:\dev\viewer-arena\crates\game-wasm\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-wasm\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\Cargo.toml`
  - `C:\dev\viewer-arena\crates\server\src\app.rs`
  - `C:\dev\viewer-arena\crates\server\src\error.rs`
  - `C:\dev\viewer-arena\crates\server\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\src\main.rs`
  - `C:\dev\viewer-arena\crates\server\src\room.rs`
  - `C:\dev\viewer-arena\crates\server\src\rooms.rs`
  - `C:\dev\viewer-arena\crates\server\src\ws.rs`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\viewer-arena\target\`, `C:\dev\viewer-arena\.git\`, `C:\dev\viewer-arena\client\node_modules\`, `C:\dev\viewer-arena\client\src\wasm\`, `C:\dev\viewer-arena\client\dist\`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치), wasm-bindgen-cli 0.2.130(`wasm-bindgen --version`), OBS Studio(P1에서 설치, 오늘 사용)
- 오늘 만들/바꿀 파일:
  - 바꿈 `C:\dev\viewer-arena\crates\server\src\main.rs` — 오늘판: `HOST` 환경 변수, `lan_ip()`, 안내 로그 — 설정 파일 분리(`config.rs`)는 Day 37 (레퍼런스 `reference/p3-viewer-arena/crates/server/src/main.rs`)
  - 바꿈 `C:\dev\viewer-arena\client\src\net.ts` — `isLocalOnlyAddress` 추가 (레퍼런스 `reference/p3-viewer-arena/client/src/net.ts`)
  - 바꿈 `C:\dev\viewer-arena\client\index.html` — `#lan-tip` 문단 추가 — 최종과 같음 (레퍼런스 `reference/p3-viewer-arena/client/index.html`)
  - 바꿈 `C:\dev\viewer-arena\client\src\home.ts` — `lanTip.hidden = !isLocalOnlyAddress()` — 최종과 같음 (레퍼런스 `reference/p3-viewer-arena/client/src/home.ts`)
  - 바꿈 `C:\dev\viewer-arena\client\src\host.ts` — `normalStatus` 추가(랭킹 제외 최종) (레퍼런스 `reference/p3-viewer-arena/client/src/host.ts`)
  - 바꿈 `C:\dev\viewer-arena\client\play.html` — viewport 메타와 주석 — 최종과 같음 (레퍼런스 `reference/p3-viewer-arena/client/play.html`)
  - 바꿈 `C:\dev\viewer-arena\client\src\style.css` — `.tip` 추가 — 최종과 같음 (레퍼런스 `reference/p3-viewer-arena/client/src/style.css`)
- 끝 상태 확인: `$env:HOST="0.0.0.0"` 후 서버를 켜면 로그에 `같은 Wi-Fi의 휴대폰에서는: http://192.168.0.10:8080`(숫자는 다름)이 보이고 방화벽 창에서 허용했다. PC 브라우저를 그 주소로 열어 방을 만들고, 휴대폰 카메라로 관전 화면의 QR을 찍으면 `play.html?room=…`이 열려 닉네임 참가 → 조이스틱으로 움직이면 PC의 관전 화면에서 내 원이 움직인다. 127.0.0.1로 연 첫 화면에는 노란 안내 문단이 보인다.
- 과제:
  1) `ipconfig`의 무선 LAN 어댑터 Wi-Fi `IPv4 주소`가 서버 로그와 같은지 확인(쉬움) → 정답 요지: 같은 192.168.x.x
  2) 휴대폰 Wi-Fi를 끄고 데이터로 QR을 찍어 보고 왜 안 되는지 쓰기(쉬움) → 정답 요지: 사설 IP는 같은 공유기 안에서만 닿음
  3) 방송이 끝난 뒤 되돌릴 것 두 가지 쓰기(보통) → 정답 요지: HOST를 127.0.0.1로(창 닫기), 방화벽 허용은 개인 네트워크만
- 용어(사전 담당): LAN, 사설 IP 주소, Windows 방화벽, 네트워크 프로필
- 자주 막히는 곳 후보: 방화벽 창에서 실수로 취소 → 휴대폰이 접속 못 함 → Windows 보안 → 방화벽 및 네트워크 보호 → "방화벽에서 앱 허용"에서 `server.exe`를 개인 네트워크 허용(경로·메뉴 이름은 버전에 따라 다를 수 있어요, 방화벽을 끄라고 하지 않음) / `cargo run`(debug)과 `--release`는 exe 경로가 달라 방화벽이 각각 묻는다 / Wi-Fi가 공용 네트워크 프로필 → 개인으로 변경 / 게스트 Wi-Fi·카페 Wi-Fi는 기기끼리 통신을 막음(AP 격리) → 집 Wi-Fi 또는 휴대폰 핫스팟에 PC도 연결 / PC 브라우저를 127.0.0.1로 열어 만든 QR → PC IP 주소로 다시 열기(화면 경고) / VPN·백신의 자체 방화벽이 막음 → 그 프로그램의 허용 목록(끄지 않음) / `HOST=192.168.0.10 `처럼 공백·오타 → 서버가 안내 문구를 내고 종료 / 휴대폰에서 두 손가락으로 확대돼 조이스틱이 밀림 → 오늘의 viewport 설정
- 레퍼런스 대응: `client/play.html`·`client/index.html`·`client/src/home.ts`·`client/src/style.css`(최종과 같음), `client/src/host.ts`(랭킹 제외 — Day 36), `client/src/net.ts`(`fetchLeaderboard`·`wss:` 제외), `crates/server/src/main.rs` 중간 단계(HOST만 환경 변수 — Day 35·37). 레퍼런스 README "휴대폰으로 참가하기"와 같은 절차.

## Day 32 — 치팅과 안전 (120분)
- 목표: 시청자가 할 수 있는 장난(빠른 속도 조작, 메시지 폭탄, 1KB 넘는 메시지, 빈칸처럼 보이는 닉네임, 금지어, 남의 닉네임)과 이미 막은 것(Day 19 `Input::new`로 방향 길이 ≤ 1·NaN 거절, 서버가 속도 제한, Day 24 크기 제한, Day 26 유휴 정리)을 표로 정리한다. `ws.rs`(최종 — 로그 줄만 Day 37에 tracing으로): `RateLimiter`(1초 창마다 세기, 30개 넘으면 버리고 창마다 처음 한 번만 `rate_limited` 알림, 글자·바이너리 프레임 모두 셈, 관전 화면은 조용히 버림), 모든 쓰기를 `write(socket, message, deadline)` 하나로 모으고 `finish_by`가 `timeout_at(deadline, …)`으로 기한 안에만 쓰게(읽지 않는 휴대폰 때문에 보내기 버퍼가 차면 `send`가 멈추고 `select!`가 정리 가지를 못 봄), `forward`·`send_msg`·`send_error`·`close_with_error`가 `deadline`을 받고 `bool`을 돌려줌, `JSON 글자 메시지만 받아요.`, `NameTaken` 안내 문구, 테스트 `rate_limiter_allows_30_per_second`, `stalled_write_gives_up_at_the_deadline`(`start_paused`). game-core `protocol.rs`(최종): `MAX_INPUTS_PER_SEC = 30`, `BANNED_WORDS`(방송에 맞게 늘려 쓰기), `NameError::{BadChar, Banned}` + 문구, `is_invisible`(폭 없는 공백·방향 제어·한글 채움 문자 U+3164·U+115F·U+1160·U+FFA0·BOM 등 — 이모지의 이형 선택자 U+FE00~FE0F는 허용), `validate_name` 완성(제어 문자 `is_control`, 공백을 빼고 소문자로 바꿔 금지어 비교), 테스트 4개 완성. 거부 목록 vs 허용 목록의 장단점(거부 목록: 한글·이모지 닉네임을 넓게 허용하지만 새 꼼수가 나오면 목록을 늘려야 함 / 허용 목록: 안전하지만 정상 닉네임도 막힘)을 설명하고 이 교재는 거부 목록을 고른 이유를 쓴다(브리프 notes). ZWJ(U+200D)를 막아 여러 사람 이모지 닉네임도 거절된다는 한계를 적는다. `world.rs`(최종): `JoinError::NameTaken`, 같은 방 같은 닉네임 거절(대소문자 구분), 테스트 `duplicate_names_are_rejected`. `room.rs`: `JoinError::NameTaken → ErrorCode::NameTaken`.
- 이미 배운 것: [Day 24](#/day/p3-d24)·[Day 26](#/day/p3-d26)·[Day 30](#/day/p3-d30)의 ws 세션·오류 코드·유휴 기한, [Day 19](#/day/p3-d19)의 `Input::new`·속도 제한, [Day 29](#/day/p3-d29)의 `start_paused` 테스트, [Day 5](#/day/p3-d05)의 `char`·`.chars()`, [Day 9](#/day/p3-d09)의 반복자 `any`·`filter`·`collect`, [Day 3](#/day/p3-d03)의 `matches!`와 비슷한 패턴 매칭, 요청 제한·XSS·입력 검증([P2 Day 34](#/day/p2-d34)), 유니코드·UTF-8([P1 Day 1](#/day/p1-d01)).
- 시작 상태: 어제(Day 31) 끝 상태예요. 서버(127.0.0.1이면 충분)와 `npm run dev`를 켜고 시작해요.
  - (Day 31 끝 상태와 같아요. 다르면 [Day 31](#/day/p3-d31)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\` 연습 폴더(Day 12까지 사용, 이후 그대로 둠)
  - `C:\dev\viewer-arena\.gitignore`
  - `C:\dev\viewer-arena\Cargo.lock`
  - `C:\dev\viewer-arena\Cargo.toml`
  - `C:\dev\viewer-arena\client\host.html`
  - `C:\dev\viewer-arena\client\index.html`
  - `C:\dev\viewer-arena\client\package-lock.json`
  - `C:\dev\viewer-arena\client\package.json`
  - `C:\dev\viewer-arena\client\play.html`
  - `C:\dev\viewer-arena\client\public\favicon.svg`
  - `C:\dev\viewer-arena\client\src\home.ts`
  - `C:\dev\viewer-arena\client\src\host.ts`
  - `C:\dev\viewer-arena\client\src\input.ts`
  - `C:\dev\viewer-arena\client\src\interp.ts`
  - `C:\dev\viewer-arena\client\src\net.ts`
  - `C:\dev\viewer-arena\client\src\play.ts`
  - `C:\dev\viewer-arena\client\src\protocol.ts`
  - `C:\dev\viewer-arena\client\src\qr.ts`
  - `C:\dev\viewer-arena\client\src\render.ts`
  - `C:\dev\viewer-arena\client\src\style.css`
  - `C:\dev\viewer-arena\client\src\wasm.ts`
  - `C:\dev\viewer-arena\client\tsconfig.json`
  - `C:\dev\viewer-arena\client\vite.config.ts`
  - `C:\dev\viewer-arena\crates\game-core\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-core\src\lib.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\physics.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\protocol.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\rules.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\vec2.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\world.rs`
  - `C:\dev\viewer-arena\crates\game-wasm\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-wasm\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\Cargo.toml`
  - `C:\dev\viewer-arena\crates\server\src\app.rs`
  - `C:\dev\viewer-arena\crates\server\src\error.rs`
  - `C:\dev\viewer-arena\crates\server\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\src\main.rs`
  - `C:\dev\viewer-arena\crates\server\src\room.rs`
  - `C:\dev\viewer-arena\crates\server\src\rooms.rs`
  - `C:\dev\viewer-arena\crates\server\src\ws.rs`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\viewer-arena\target\`, `C:\dev\viewer-arena\.git\`, `C:\dev\viewer-arena\client\node_modules\`, `C:\dev\viewer-arena\client\src\wasm\`, `C:\dev\viewer-arena\client\dist\`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치), wasm-bindgen-cli 0.2.130(`wasm-bindgen --version`), OBS Studio(P1에서 설치, 오늘 사용)
- 오늘 만들/바꿀 파일:
  - 바꿈 `C:\dev\viewer-arena\crates\game-core\src\protocol.rs` — 닉네임 검사 완성·`MAX_INPUTS_PER_SEC`·테스트 — 최종과 같음 (레퍼런스 `reference/p3-viewer-arena/crates/game-core/src/protocol.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\game-core\src\world.rs` — `JoinError::NameTaken`, 중복 닉네임 검사, 테스트 — 최종과 같음 (레퍼런스 `reference/p3-viewer-arena/crates/game-core/src/world.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\src\ws.rs` — `RateLimiter`·`Rate`, `write`·`finish_by`, 기한을 받는 보내기 도우미, 테스트 2개 — 로그는 `println!`(Day 37에 tracing) (레퍼런스 `reference/p3-viewer-arena/crates/server/src/ws.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\src\room.rs` — `join`에서 `NameTaken` 매핑 (레퍼런스 `reference/p3-viewer-arena/crates/server/src/room.rs`)
- 끝 상태 확인: `cargo test -p game-core` → `24 passed`. `cargo test -p server` → 단위 테스트 7개 통과(rooms 5 + ws 2). Console에서 `for (let i = 0; i < 100; i++) s.send('{"t":"ping","ts":1}')` → `rate_limited` 오류가 한 번만 오고 연결은 유지. 닉네임 `ADMIN`, `시 발` → `쓸 수 없는 닉네임이에요.`, 한글 채움 문자만 넣은 닉네임 → `보이지 않는 글자나 제어 문자는…`, 같은 방 같은 닉네임 → `이미 같은 닉네임이 있어요…`.
- 과제:
  1) 내 방송용 금지어 하나를 `BANNED_WORDS`에 더하고 테스트·화면으로 확인(쉬움, 금지어 내용은 레퍼런스와 달라도 돼요) → 정답 요지: 배열 길이 숫자도 함께 고침, 소문자로 적기
  2) Console에서 1초에 100개를 보내고 받은 `rate_limited` 수를 세기(보통) → 정답 요지: 창마다 1개(1~2개)
  3) 거부 목록과 허용 목록의 장단점을 표로(보통) → 정답 요지: 위 목표의 비교, 이 게임은 한글·이모지 닉네임 때문에 거부 목록
- 용어(사전 담당): 치팅, 거부 목록, 허용 목록, 보이지 않는 문자, 쓰기 마감 시간
- 자주 막히는 곳 후보: Rust 문자열의 유니코드 이스케이프 `"\u{3164}"` 문법(중괄호) 틀림 / 여러 사람 이모지(ZWJ로 이은 것)가 거절됨 → 의도된 한계(U+200D 금지) / `BANNED_WORDS`에 대문자로 적어 안 걸림 → 비교 전에 소문자로 바꾸므로 목록도 소문자 / 배열 타입 `[&str; 8]`의 숫자를 안 고쳐 `error[E0308]: mismatched types` … `expected an array with a size of 8` / 쓰기 기한을 일부만 적용해 끊긴 휴대폰이 몇 분 남음 → 모든 쓰기가 `write`를 지나는지 `send(` 검색 / 방금 끊긴 내 연결이 10초 동안 남아 같은 닉네임으로 재참가 거절 → 안내 문구대로 잠시 뒤
- 레퍼런스 대응: `crates/game-core/src/protocol.rs`·`world.rs`(최종과 같음 → game-core 전체 최종), `crates/server/src/ws.rs`(tracing 로그 2줄 제외 최종 — Day 37), `room.rs`(NameTaken 매핑 — db·tracing 제외). 레퍼런스 README "안전장치 (Day 32)"와 같은 목록.

## Day 33 — Docker 시작 (120분)
- 목표: "내 PC에서는 되는데"를 없애는 컨테이너와 이미지(설치가 끝난 상태를 통째로 담은 틀), Docker Hub, Docker Desktop이 Windows에서 WSL 2의 가벼운 Linux 위에서 컨테이너를 돌린다는 것을 설명한다. 설치 전에 반드시 점검한다(가이드 2.3): `Win + R` → `winver`로 버전·빌드(23H2, 빌드 22631 이상), **설정 → 시스템 → 정보**의 에디션 또는 PowerShell `(Get-CimInstance Win32_OperatingSystem).Caption`, 작업 관리자 → 성능 → CPU의 가상화 "사용", RAM 8 GB. Home이면 `:::warn` "Docker Desktop이 동작하지 않을 수 있으니 안 되면 Docker 없는 경로로 진행해요"(지원 여부를 단정하지 않음, external-facts 9절). `wsl --version`(없으면 관리자 PowerShell `wsl --install` → 재부팅), `wsl --update`. Docker Desktop 설치(기본 per-user, "Use WSL 2 instead of Hyper-V"), 개인 학습은 무료(직원 250명 미만 AND 연매출 1천만 달러 미만 사업체도 무료) 한 줄. `docker --version` → `docker run hello-world`(`Hello from Docker!`) → `docker ps -a`, `docker images`, 정리(`docker rm`, `docker image rm hello-world`). Docker 없는 경로를 오늘 정한다: 랭킹 DB는 Day 34에서 PostgreSQL 18을 Windows에 직접 설치, Day 40의 컨테이너 묶기는 `npm run build` + `cargo run -p server --release`로 대신. 서버는 `DATABASE_URL` 없이도 실행된다(랭킹만 꺼짐, Day 35)는 사실을 먼저 알려 안심시킨다. 오늘은 프로젝트 파일을 바꾸지 않는다.
- 이미 배운 것: [Day 1](#/day/p3-d01)의 설치 프로그램·새 터미널 규칙, [Day 31](#/day/p3-d31)의 `winver` 같은 Windows 도구 감각, 관리자 PowerShell과 UAC([P2 Day 3](#/day/p2-d03)), 배포·서버 실행 환경 차이([P2 Day 39](#/day/p2-d39)), 웹 서버·포트([P2 Day 7](#/day/p2-d07)).
- 시작 상태: 어제(Day 32) 끝 상태예요. 오늘은 도구만 설치해요. 인터넷과 재부팅할 시간이 필요해요(WSL 설치 시). 회사·학교 PC는 설치가 막혀 있을 수 있어요.
  - (Day 32 끝 상태와 같아요. 다르면 [Day 32](#/day/p3-d32)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\` 연습 폴더(Day 12까지 사용, 이후 그대로 둠)
  - `C:\dev\viewer-arena\.gitignore`
  - `C:\dev\viewer-arena\Cargo.lock`
  - `C:\dev\viewer-arena\Cargo.toml`
  - `C:\dev\viewer-arena\client\host.html`
  - `C:\dev\viewer-arena\client\index.html`
  - `C:\dev\viewer-arena\client\package-lock.json`
  - `C:\dev\viewer-arena\client\package.json`
  - `C:\dev\viewer-arena\client\play.html`
  - `C:\dev\viewer-arena\client\public\favicon.svg`
  - `C:\dev\viewer-arena\client\src\home.ts`
  - `C:\dev\viewer-arena\client\src\host.ts`
  - `C:\dev\viewer-arena\client\src\input.ts`
  - `C:\dev\viewer-arena\client\src\interp.ts`
  - `C:\dev\viewer-arena\client\src\net.ts`
  - `C:\dev\viewer-arena\client\src\play.ts`
  - `C:\dev\viewer-arena\client\src\protocol.ts`
  - `C:\dev\viewer-arena\client\src\qr.ts`
  - `C:\dev\viewer-arena\client\src\render.ts`
  - `C:\dev\viewer-arena\client\src\style.css`
  - `C:\dev\viewer-arena\client\src\wasm.ts`
  - `C:\dev\viewer-arena\client\tsconfig.json`
  - `C:\dev\viewer-arena\client\vite.config.ts`
  - `C:\dev\viewer-arena\crates\game-core\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-core\src\lib.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\physics.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\protocol.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\rules.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\vec2.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\world.rs`
  - `C:\dev\viewer-arena\crates\game-wasm\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-wasm\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\Cargo.toml`
  - `C:\dev\viewer-arena\crates\server\src\app.rs`
  - `C:\dev\viewer-arena\crates\server\src\error.rs`
  - `C:\dev\viewer-arena\crates\server\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\src\main.rs`
  - `C:\dev\viewer-arena\crates\server\src\room.rs`
  - `C:\dev\viewer-arena\crates\server\src\rooms.rs`
  - `C:\dev\viewer-arena\crates\server\src\ws.rs`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\viewer-arena\target\`, `C:\dev\viewer-arena\.git\`, `C:\dev\viewer-arena\client\node_modules\`, `C:\dev\viewer-arena\client\src\wasm\`, `C:\dev\viewer-arena\client\dist\`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치), wasm-bindgen-cli 0.2.130(`wasm-bindgen --version`), OBS Studio(P1에서 설치, 오늘 사용)
- 오늘 만들/바꿀 파일: 없음(도구 설치·설정·확인만 하는 날)
  - 오늘 설치하는 도구: WSL 2(`wsl --version`), Docker Desktop(선택 — 안 되면 Docker 없는 경로, `docker --version`)
- 끝 상태 확인: `docker run hello-world` 출력에 `Hello from Docker!`. `docker ps -a`에 끝난(Exited) 컨테이너 1개, 정리 후 0개. Docker가 안 되는 PC라면 점검표에 원인(에디션·가상화·정책)을 적고 "Day 34는 직접 설치 경로"로 표시했다.
- 과제:
  1) `docker run --rm hello-world`를 실행하고 `--rm`이 무엇을 바꾸는지 `docker ps -a`로 확인(쉬움) → 정답 요지: 끝나면 컨테이너가 자동 삭제
  2) 내 PC 점검표(버전·빌드·에디션·가상화·RAM) 채우기(쉬움) → 정답 요지: 다섯 칸 + Docker 경로/직접 설치 경로 선택
  3) 이미지와 컨테이너의 관계를 붕어빵 틀 비유 다음 정확한 정의로 쓰기(보통) → 정답 요지: 이미지 = 읽기 전용 틀(레이어), 컨테이너 = 그 틀로 띄운 실행 중인 격리 프로세스
- 용어(사전 담당): Docker, 컨테이너, 컨테이너 이미지, Docker Hub, Docker Desktop, WSL 2, 하드웨어 가상화
- 자주 막히는 곳 후보: WSL 2 오류(브리프 요구): Docker Desktop이 `WSL needs updating`/`WSL 2 installation is incomplete` 비슷한 문구로 멈춤 → 관리자 PowerShell `wsl --update` 후 Docker Desktop 다시 시작(문구는 버전에 따라 다를 수 있어요) / 가상화가 꺼져 있어 WSL이 `0x80370102` 오류(가상 머신 플랫폼·BIOS 가상화 안내) → PC 제조사 설명서대로 BIOS/UEFI에서 가상화(Intel VT-x·AMD-V/SVM) 켜기(오류 문구 원문은 작성자가 확인) / `wsl --install` 후 재부팅을 안 해서 계속 실패 / `docker: error during connect: … open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.` → Docker Desktop을 켜고 고래 아이콘이 '실행 중'이 될 때까지 기다림 / Windows 11 Home → `:::warn`만, 안 되면 Docker 없는 경로 / Docker Hub 익명 다운로드 횟수 제한(`toomanyrequests`) → 잠시 뒤 또는 Docker 계정 로그인 / C 드라이브 공간 부족(이미지가 수 GB) → 디스크 정리
- 레퍼런스 대응: 레퍼런스 파일 변경 없음(도구 설치) — `reference/p3-viewer-arena/README.md`의 준비물 표 "Docker Desktop: 선택(랭킹·배포 Day부터)", external-facts 9절의 요구 사항.

## Day 34 — PostgreSQL in Docker (110분)
- 목표: SQLite(P2)와 PostgreSQL(서버형 DB)의 차이, Docker Compose로 컨테이너를 파일 하나에 적어 두는 이유를 설명한다. `C:\dev\viewer-arena\docker-compose.yml`(오늘판: 맨 위 명령 주석, `services.db` — `image: postgres:18`, `POSTGRES_USER/PASSWORD/DB = arena/arena/viewer_arena`(연습용 비밀번호 주석), 볼륨 `pgdata:/var/lib/postgresql`(PostgreSQL 18부터 바뀐 위치 — `/var/lib/postgresql/data` 아님), 포트 `"127.0.0.1:${DB_PORT:-5432}:5432"`(이 PC에만), `healthcheck`(`pg_isready`), 맨 아래 `volumes: pgdata:` — server 서비스는 Day 40)를 만든다. `docker compose up -d db` → `docker compose ps`(healthy) → `docker compose logs db` → `docker compose exec db psql -U arena -d viewer_arena` → `\l`, `\dt`, `\d`, `\q`. SQL 복습(P2 Day 19): 연습 표 `practice_scores`를 만들어 INSERT·SELECT(ORDER BY·LIMIT)·UPDATE·DELETE 후 `DROP TABLE practice_scores;`로 지운다(내일 마이그레이션이 깨끗한 DB에서 시작하게). `docker compose down` 후 다시 `up`해도 데이터가 남는 것(볼륨), `down -v`는 지운다는 것(`:::warn`)을 확인한다. Docker 없는 경로: 관리자 PowerShell `winget install PostgreSQL.PostgreSQL.18`(설치 중 슈퍼유저 비밀번호·포트 5432), PATH에 없으니 `Get-ChildItem "C:\Program Files\PostgreSQL"`로 위치를 찾아 `& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -p 5432`(경로는 추정 — 확인), `CREATE USER arena WITH PASSWORD 'arena';`, `CREATE DATABASE viewer_arena OWNER arena;`. SQL은 PostgreSQL 16·18 모두에서 되는 것만 쓴다.
- 이미 배운 것: [Day 33](#/day/p3-d33)의 Docker·컨테이너·이미지, SQL·표·기본 키·SELECT/INSERT/UPDATE/DELETE([P2 Day 19](#/day/p2-d19)), 외래 키·JOIN([P2 Day 22](#/day/p2-d22)), 연결 문자열([P2 Day 20](#/day/p2-d20)), 포트([P2 Day 7](#/day/p2-d07)), YAML은 "들여쓰기로 구조를 나타내는 설정 파일"로 한 줄 설명(스페이스만, 탭 금지).
- 시작 상태: 어제(Day 33) 끝 상태예요. Docker 경로라면 Docker Desktop을 켜 두세요(고래 아이콘이 실행 중). Docker 없는 경로라면 오늘 PostgreSQL을 직접 설치해요. 인터넷이 필요해요(`postgres:18` 이미지 또는 설치 파일).
  - (Day 33 끝 상태와 같아요. 다르면 [Day 33](#/day/p3-d33)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\` 연습 폴더(Day 12까지 사용, 이후 그대로 둠)
  - `C:\dev\viewer-arena\.gitignore`
  - `C:\dev\viewer-arena\Cargo.lock`
  - `C:\dev\viewer-arena\Cargo.toml`
  - `C:\dev\viewer-arena\client\host.html`
  - `C:\dev\viewer-arena\client\index.html`
  - `C:\dev\viewer-arena\client\package-lock.json`
  - `C:\dev\viewer-arena\client\package.json`
  - `C:\dev\viewer-arena\client\play.html`
  - `C:\dev\viewer-arena\client\public\favicon.svg`
  - `C:\dev\viewer-arena\client\src\home.ts`
  - `C:\dev\viewer-arena\client\src\host.ts`
  - `C:\dev\viewer-arena\client\src\input.ts`
  - `C:\dev\viewer-arena\client\src\interp.ts`
  - `C:\dev\viewer-arena\client\src\net.ts`
  - `C:\dev\viewer-arena\client\src\play.ts`
  - `C:\dev\viewer-arena\client\src\protocol.ts`
  - `C:\dev\viewer-arena\client\src\qr.ts`
  - `C:\dev\viewer-arena\client\src\render.ts`
  - `C:\dev\viewer-arena\client\src\style.css`
  - `C:\dev\viewer-arena\client\src\wasm.ts`
  - `C:\dev\viewer-arena\client\tsconfig.json`
  - `C:\dev\viewer-arena\client\vite.config.ts`
  - `C:\dev\viewer-arena\crates\game-core\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-core\src\lib.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\physics.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\protocol.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\rules.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\vec2.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\world.rs`
  - `C:\dev\viewer-arena\crates\game-wasm\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-wasm\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\Cargo.toml`
  - `C:\dev\viewer-arena\crates\server\src\app.rs`
  - `C:\dev\viewer-arena\crates\server\src\error.rs`
  - `C:\dev\viewer-arena\crates\server\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\src\main.rs`
  - `C:\dev\viewer-arena\crates\server\src\room.rs`
  - `C:\dev\viewer-arena\crates\server\src\rooms.rs`
  - `C:\dev\viewer-arena\crates\server\src\ws.rs`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\viewer-arena\target\`, `C:\dev\viewer-arena\.git\`, `C:\dev\viewer-arena\client\node_modules\`, `C:\dev\viewer-arena\client\src\wasm\`, `C:\dev\viewer-arena\client\dist\`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치), wasm-bindgen-cli 0.2.130(`wasm-bindgen --version`), OBS Studio(P1에서 설치, 오늘 사용), WSL 2(`wsl --version`), Docker Desktop(선택 — 안 되면 Docker 없는 경로, `docker --version`)
- 오늘 만들/바꿀 파일:
  - 새로 만듦 `C:\dev\viewer-arena\docker-compose.yml` — 오늘판: 맨 위 사용법 주석, `services.db`(레퍼런스의 db 부분과 같음), `volumes: pgdata:` — `server` 서비스는 Day 40 (레퍼런스 `reference/p3-viewer-arena/docker-compose.yml`)
  - 오늘 설치하는 도구: PostgreSQL 18(Docker 컨테이너 `db` 또는 Windows 직접 설치)
- 끝 상태 확인: `docker compose ps`에 `db`가 `running (healthy)`. psql 프롬프트 `viewer_arena=#`에서 `SELECT version();` → `PostgreSQL 18.x …`. 연습 표를 지운 뒤 `\dt` → `Did not find any relations.` (직접 설치 경로도 같은 프롬프트·결과)
- 과제:
  1) 연습 표에 점수 3개를 넣고 높은 순 2개만 조회(쉬움) → 정답 요지: `SELECT name, score FROM practice_scores ORDER BY score DESC LIMIT 2;`
  2) `docker compose down` → `up -d db` 후 데이터가 남는지 확인하고 표 지우기(보통) → 정답 요지: 볼륨에 남음, `DROP TABLE`
  3) 포트 매핑 `127.0.0.1:5432:5432`의 앞뒤 숫자 뜻과 127.0.0.1을 붙인 이유 쓰기(보통) → 정답 요지: PC 포트:컨테이너 포트, 같은 Wi-Fi의 다른 기기가 DB에 못 붙게
- 용어(사전 담당): PostgreSQL, psql, Docker Compose, 볼륨, 포트 매핑
- 자주 막히는 곳 후보: `Bind for 127.0.0.1:5432 failed: port is already allocated`(직접 설치한 PostgreSQL이나 다른 컨테이너가 5432 사용) → 그 서비스를 끄거나 `$env:DB_PORT="55432"` 후 `docker compose up -d db` / 볼륨을 `/var/lib/postgresql/data`에 마운트해 PostgreSQL 18 컨테이너가 시작하지 못함 → `/var/lib/postgresql`(오류 원문은 작성자가 재현해 실음) / `FATAL:  password authentication failed for user "arena"` → 예전 비밀번호로 만든 볼륨이 남음 → `docker compose down -v`(데이터 삭제 경고) 후 다시 / YAML 들여쓰기에 탭 → `yaml: line N: found character that cannot start any token` / 옛 명령 `docker-compose`(하이픈) → `docker compose` / 직접 설치 경로에서 `psql`을 찾을 수 없음(PATH에 없음) → 전체 경로 + `&` / psql에서 `;`를 빠뜨려 `viewer_arena-#`로 계속 기다림 → `;` 입력
- 레퍼런스 대응: `docker-compose.yml`(중간 단계: db 서비스와 volumes만 — Day 40에 server 서비스 추가). 직접 설치 절차는 레퍼런스 README "Docker 없이 (PostgreSQL 18 직접 설치)"와 같음.

## Day 35 — SQLx 연결 (120분)
- 목표: SQLx의 런타임 쿼리(SQL은 평범한 문자열, 값은 `$1`·`.bind()` — 이어 붙이지 않으므로 SQL 인젝션 없음, P2 Day 34 복습)와 연결 풀을 설명한다. 루트 `Cargo.toml`에 `sqlx = { version = "=0.9.0", default-features = false, features = ["runtime-tokio", "postgres", "macros", "migrate"] }`와 "TLS 기능은 켜지 않았다(로컬·Docker DB용) — 클라우드 DB는 `tls-rustls`(Day 41~42)" 주석. `crates\server\migrations\0001_init.sql`(`matches`: IDENTITY 기본 키·`room_code`·`ended_at TIMESTAMPTZ DEFAULT now()`, `match_scores`: `match_id` 외래 키 `ON DELETE CASCADE`·`place`·`player_name`·`score CHECK (score >= 0)`, 인덱스 2개 — PG 16·18 호환), `src\db.rs`(`PgPoolOptions` 최대 5개·대기 5초, `sqlx::migrate!("./migrations")`는 컴파일할 때 SQL을 실행 파일에 넣고 기록은 `_sqlx_migrations` 표), `src\leaderboard.rs`(오늘판: 맨 위 설명 + `save_result` — `pool.begin()` → `INSERT … RETURNING id` → 순위마다 INSERT(부호 없는 `u32`를 `i32`로) → `commit`, 전부 저장되거나 하나도 안 됨). `room.rs`: `RoomActor`에 `db: Option<PgPool>`, `new_room(code, seed, db)`, 라운드가 끝나면 `save_result`를 `tokio::spawn`으로 따로 띄워 게임 루프가 DB를 기다리지 않게(로그는 `println!`), 빈 순위·DB 없음이면 건너뜀. `rooms.rs`: `create(db)`와 테스트의 `create(None)`·`new_room(…, 1, None)` — 최종. `app.rs`: `AppState { rooms, db, idle_timeout }` + `AppState::new(db)`, `create_room`이 `state.db.clone()`을 넘김. `main.rs`(오늘판): `DATABASE_URL`을 읽어(빈 값은 없음으로) 있으면 `db::connect`(실패하면 `PostgreSQL에 연결하지 못했어요(…). DB가 켜져 있는지, DATABASE_URL이 맞는지 확인하세요.` — 주소에 비밀번호가 있어 출력하지 않음), 없으면 `DATABASE_URL이 없어서 랭킹을 꺼요. 게임은 그대로 할 수 있어요.`(브리프 notes). `$env:DATABASE_URL="postgres://arena:arena@127.0.0.1:5432/viewer_arena"` → 서버 실행 → 탭 두 개로 한 판(대기 15초 + 120초) → psql로 확인.
- 이미 배운 것: [Day 34](#/day/p3-d34)의 PostgreSQL·psql·SQL, [Day 25](#/day/p3-d25)·[Day 29](#/day/p3-d29)의 액터·방 목록·`tokio::spawn`, [Day 31](#/day/p3-d31)의 환경 변수 읽기, [Day 7](#/day/p3-d07)·[Day 8](#/day/p3-d08)의 Option·Result·`?`, [Day 9](#/day/p3-d09)의 `enumerate`, 마이그레이션(dotnet-ef, [P2 Day 20](#/day/p2-d20)), 비동기 쿼리([P2 Day 21](#/day/p2-d21)), 외래 키([P2 Day 22](#/day/p2-d22)), SQL 인젝션과 매개변수([P2 Day 34](#/day/p2-d34)), 연결 문자열([P2 Day 20](#/day/p2-d20)).
- 시작 상태: 어제(Day 34) 끝 상태예요. DB가 켜져 있어야 해요: Docker 경로는 `docker compose up -d db`, 직접 설치 경로는 PostgreSQL 서비스가 실행 중. 인터넷이 필요해요(sqlx). DB 없이 따라오는 경우도 오늘 코드는 똑같이 쓰고 "DB 없이 실행" 단계만 확인해요.
  - (Day 34 끝 상태와 같아요. 다르면 [Day 34](#/day/p3-d34)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\` 연습 폴더(Day 12까지 사용, 이후 그대로 둠)
  - `C:\dev\viewer-arena\.gitignore`
  - `C:\dev\viewer-arena\Cargo.lock`
  - `C:\dev\viewer-arena\Cargo.toml`
  - `C:\dev\viewer-arena\client\host.html`
  - `C:\dev\viewer-arena\client\index.html`
  - `C:\dev\viewer-arena\client\package-lock.json`
  - `C:\dev\viewer-arena\client\package.json`
  - `C:\dev\viewer-arena\client\play.html`
  - `C:\dev\viewer-arena\client\public\favicon.svg`
  - `C:\dev\viewer-arena\client\src\home.ts`
  - `C:\dev\viewer-arena\client\src\host.ts`
  - `C:\dev\viewer-arena\client\src\input.ts`
  - `C:\dev\viewer-arena\client\src\interp.ts`
  - `C:\dev\viewer-arena\client\src\net.ts`
  - `C:\dev\viewer-arena\client\src\play.ts`
  - `C:\dev\viewer-arena\client\src\protocol.ts`
  - `C:\dev\viewer-arena\client\src\qr.ts`
  - `C:\dev\viewer-arena\client\src\render.ts`
  - `C:\dev\viewer-arena\client\src\style.css`
  - `C:\dev\viewer-arena\client\src\wasm.ts`
  - `C:\dev\viewer-arena\client\tsconfig.json`
  - `C:\dev\viewer-arena\client\vite.config.ts`
  - `C:\dev\viewer-arena\crates\game-core\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-core\src\lib.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\physics.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\protocol.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\rules.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\vec2.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\world.rs`
  - `C:\dev\viewer-arena\crates\game-wasm\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-wasm\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\Cargo.toml`
  - `C:\dev\viewer-arena\crates\server\src\app.rs`
  - `C:\dev\viewer-arena\crates\server\src\error.rs`
  - `C:\dev\viewer-arena\crates\server\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\src\main.rs`
  - `C:\dev\viewer-arena\crates\server\src\room.rs`
  - `C:\dev\viewer-arena\crates\server\src\rooms.rs`
  - `C:\dev\viewer-arena\crates\server\src\ws.rs`
  - `C:\dev\viewer-arena\docker-compose.yml`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\viewer-arena\target\`, `C:\dev\viewer-arena\.git\`, `C:\dev\viewer-arena\client\node_modules\`, `C:\dev\viewer-arena\client\src\wasm\`, `C:\dev\viewer-arena\client\dist\`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치), wasm-bindgen-cli 0.2.130(`wasm-bindgen --version`), OBS Studio(P1에서 설치, 오늘 사용), WSL 2(`wsl --version`), Docker Desktop(선택 — 안 되면 Docker 없는 경로, `docker --version`), PostgreSQL 18(Docker 컨테이너 `db` 또는 Windows 직접 설치)
- 오늘 만들/바꿀 파일:
  - 새로 만듦 `C:\dev\viewer-arena\crates\server\migrations\0001_init.sql` — 레퍼런스와 같음 (레퍼런스 `reference/p3-viewer-arena/crates/server/migrations/0001_init.sql`)
  - 새로 만듦 `C:\dev\viewer-arena\crates\server\src\db.rs` — 레퍼런스와 같음 (레퍼런스 `reference/p3-viewer-arena/crates/server/src/db.rs`)
  - 새로 만듦 `C:\dev\viewer-arena\crates\server\src\leaderboard.rs` — 오늘판: 맨 위 설명 주석 + `save_result` — `Period`·`LeaderEntry`·`top`은 Day 36 (레퍼런스 `reference/p3-viewer-arena/crates/server/src/leaderboard.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\src\room.rs` — `db` 필드, `new_room(code, seed, db)`, `save_result`(spawn, `println!` 로그) (레퍼런스 `reference/p3-viewer-arena/crates/server/src/room.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\src\rooms.rs` — `create(db)`·테스트 인수 — 최종과 같음 (레퍼런스 `reference/p3-viewer-arena/crates/server/src/rooms.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\src\app.rs` — `AppState { rooms, db, idle_timeout }`, `AppState::new(db)`, `create_room` (레퍼런스 `reference/p3-viewer-arena/crates/server/src/app.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\src\main.rs` — 오늘판: `DATABASE_URL` 읽기·연결·경고(`println!`/`eprintln!`) (레퍼런스 `reference/p3-viewer-arena/crates/server/src/main.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\src\lib.rs` — `pub mod db;`, `pub mod leaderboard;` 추가 (레퍼런스 `reference/p3-viewer-arena/crates/server/src/lib.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\Cargo.toml` — sqlx 추가 (레퍼런스 `reference/p3-viewer-arena/crates/server/Cargo.toml`)
  - 바꿈 `C:\dev\viewer-arena\Cargo.toml` — sqlx(주석 포함) 추가 (레퍼런스 `reference/p3-viewer-arena/Cargo.toml`)
  - 바꿈 `C:\dev\viewer-arena\Cargo.lock` — sqlx 계열(자동) (레퍼런스 `reference/p3-viewer-arena/Cargo.lock`)
- 끝 상태 확인: `DATABASE_URL`을 넣고 서버를 켜면 `PostgreSQL에 연결했어요. 랭킹이 켜졌어요.`. 한 판이 끝나면 서버 창에 `경기 결과 저장`, psql에서 `\dt` → `_sqlx_migrations`, `match_scores`, `matches`, `SELECT * FROM match_scores;`에 1등 행. 새 PowerShell 창(DATABASE_URL 없음)에서 켜면 `DATABASE_URL이 없어서 랭킹을 꺼요…` 후 게임은 그대로 된다.
- 과제:
  1) DATABASE_URL 없이 서버를 켜고 경고 한 줄과 게임 동작 확인(쉬움) → 정답 요지: 랭킹만 꺼짐(`Option`이 `None`)
  2) 비밀번호를 틀리게 넣어 연결 오류 문구 읽기(보통) → 정답 요지: `PostgreSQL에 연결하지 못했어요(…password authentication failed…)` + 종료
  3) `save_result`에 트랜잭션이 없으면 중간에 실패할 때 무엇이 남는지 쓰기(보통) → 정답 요지: 순위 없는 경기 행 같은 반쪽 기록
- 용어(사전 담당): SQLx, 연결 풀, 트랜잭션
- 자주 막히는 곳 후보: `migrations` 폴더를 `crates\server\src` 안이나 워크스페이스 루트에 둬서 `migrate!`가 못 찾는 컴파일 오류 → `crates\server\migrations` / 적용된 마이그레이션 파일을 고쳐 `migration 1 was previously applied but has been modified` → 파일을 되돌리거나(권장) 연습 DB면 `down -v` / DB가 꺼져 있어 5초 뒤 `pool timed out while waiting for an open connection` → `docker compose ps` / `$env:DATABASE_URL`은 그 창에서만 → 새 창이면 다시 / sqlx 첫 컴파일이 오래 걸림 / 한 판을 기다리기 힘듦 → 120초 라운드는 그대로 두고 그동안 개념을 읽기(상수를 바꾸면 wasm도 다시 빌드해야 하므로 비권장)
- 레퍼런스 대응: `crates/server/migrations/0001_init.sql`·`db.rs`·`rooms.rs`(최종과 같음), `leaderboard.rs`(save_result만 — Day 36), `room.rs`(tracing 제외 — Day 37), `app.rs`(랭킹 라우트 제외 — Day 36), `main.rs` 중간 단계, `Cargo.toml`·`crates/server/Cargo.toml`(sqlx).

## Day 36 — 랭킹 (100분)
- 목표: 리더보드 SQL을 psql에서 먼저 손으로 쓴다: `match_scores`와 `matches`를 JOIN, `GROUP BY s.player_name`과 집계 함수 `MAX(s.score)`, 기간 조건 `$1::text = 'all' OR m.ended_at >= now() - INTERVAL '1 day'`, `ORDER BY score DESC, name`, `LIMIT`. `day`는 "최근 24시간"이지 달력의 오늘(한국 시간 자정)이 아니라는 점을 P2 Day 29(UTC vs 한국 시간)와 연결해 설명한다(브리프 notes). 인덱스(`matches_ended_at_idx` 등, Day 35 마이그레이션)가 이 조회를 빠르게 한다. `leaderboard.rs`(최종): `Period { Day(기본), All }`(lowercase, `as_str`), `LeaderEntry`(`sqlx::FromRow`, `score: i32`), `top(pool, period, limit)`(`query_as`). `error.rs`: `AppError::Database(sqlx::Error)`, `impl From<sqlx::Error> for AppError`(`?`가 바꿔 줌), 500 응답 `랭킹을 불러오지 못했어요…`(자세한 내용은 서버 로그에만 — 오늘은 `eprintln!`, Day 37에 tracing). `app.rs`(최종): `GET /api/leaderboard?period=day|all` — `LeaderboardParams`(`#[serde(default)]`로 생략하면 day), `LeaderboardResponse { enabled, period, entries }`, DB가 없으면 `enabled: false`와 빈 목록, 맨 위 주소표 주석 완성. 클라이언트: `protocol.ts`에 `Leaderboard`, `net.ts`에 `fetchLeaderboard(period)`, `host.html`에 `aside#board.hud.top-right.panel hidden`(`최근 24시간 랭킹` 제목 + `ol#board-list`), `host.ts`에 `refreshBoard`(시작할 때와 결과를 받을 때, DB가 없으면 숨김, 실패해도 게임은 계속).
- 이미 배운 것: [Day 35](#/day/p3-d35)의 SQLx·`bind`·풀·마이그레이션·인덱스, [Day 29](#/day/p3-d29)의 `AppError`·`IntoResponse`, [Day 30](#/day/p3-d30)의 관전 화면·`host.ts`, [Day 9](#/day/p3-d09)의 닉네임별 최고점(HashMap판), SQL JOIN·ORDER BY·LIMIT([P2 Day 19](#/day/p2-d19), [P2 Day 22](#/day/p2-d22)), UTC vs 한국 시간([P2 Day 29](#/day/p2-d29)), 쿼리 문자열([P1 Day 27](#/day/p1-d27)), 페이지네이션·쿼리 매개변수([P2 Day 30](#/day/p2-d30)).
- 시작 상태: 어제(Day 35) 끝 상태예요. DB가 켜져 있고 어제 저장한 경기가 1판 이상 있으면 좋아요(없으면 오늘 한 판 더 해요). 서버를 켤 창에 `$env:DATABASE_URL`을 넣어 두세요.
  - (Day 35 끝 상태와 같아요. 다르면 [Day 35](#/day/p3-d35)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\` 연습 폴더(Day 12까지 사용, 이후 그대로 둠)
  - `C:\dev\viewer-arena\.gitignore`
  - `C:\dev\viewer-arena\Cargo.lock`
  - `C:\dev\viewer-arena\Cargo.toml`
  - `C:\dev\viewer-arena\client\host.html`
  - `C:\dev\viewer-arena\client\index.html`
  - `C:\dev\viewer-arena\client\package-lock.json`
  - `C:\dev\viewer-arena\client\package.json`
  - `C:\dev\viewer-arena\client\play.html`
  - `C:\dev\viewer-arena\client\public\favicon.svg`
  - `C:\dev\viewer-arena\client\src\home.ts`
  - `C:\dev\viewer-arena\client\src\host.ts`
  - `C:\dev\viewer-arena\client\src\input.ts`
  - `C:\dev\viewer-arena\client\src\interp.ts`
  - `C:\dev\viewer-arena\client\src\net.ts`
  - `C:\dev\viewer-arena\client\src\play.ts`
  - `C:\dev\viewer-arena\client\src\protocol.ts`
  - `C:\dev\viewer-arena\client\src\qr.ts`
  - `C:\dev\viewer-arena\client\src\render.ts`
  - `C:\dev\viewer-arena\client\src\style.css`
  - `C:\dev\viewer-arena\client\src\wasm.ts`
  - `C:\dev\viewer-arena\client\tsconfig.json`
  - `C:\dev\viewer-arena\client\vite.config.ts`
  - `C:\dev\viewer-arena\crates\game-core\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-core\src\lib.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\physics.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\protocol.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\rules.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\vec2.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\world.rs`
  - `C:\dev\viewer-arena\crates\game-wasm\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-wasm\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\Cargo.toml`
  - `C:\dev\viewer-arena\crates\server\migrations\0001_init.sql`
  - `C:\dev\viewer-arena\crates\server\src\app.rs`
  - `C:\dev\viewer-arena\crates\server\src\db.rs`
  - `C:\dev\viewer-arena\crates\server\src\error.rs`
  - `C:\dev\viewer-arena\crates\server\src\leaderboard.rs`
  - `C:\dev\viewer-arena\crates\server\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\src\main.rs`
  - `C:\dev\viewer-arena\crates\server\src\room.rs`
  - `C:\dev\viewer-arena\crates\server\src\rooms.rs`
  - `C:\dev\viewer-arena\crates\server\src\ws.rs`
  - `C:\dev\viewer-arena\docker-compose.yml`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\viewer-arena\target\`, `C:\dev\viewer-arena\.git\`, `C:\dev\viewer-arena\client\node_modules\`, `C:\dev\viewer-arena\client\src\wasm\`, `C:\dev\viewer-arena\client\dist\`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치), wasm-bindgen-cli 0.2.130(`wasm-bindgen --version`), OBS Studio(P1에서 설치, 오늘 사용), WSL 2(`wsl --version`), Docker Desktop(선택 — 안 되면 Docker 없는 경로, `docker --version`), PostgreSQL 18(Docker 컨테이너 `db` 또는 Windows 직접 설치)
- 오늘 만들/바꿀 파일:
  - 바꿈 `C:\dev\viewer-arena\crates\server\src\leaderboard.rs` — `Period`, `LeaderEntry`, `top` 추가 — 최종과 같음 (레퍼런스 `reference/p3-viewer-arena/crates/server/src/leaderboard.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\src\error.rs` — `Database` 가지, `From<sqlx::Error>`, 500 응답(`eprintln!` — Day 37에 `tracing::error!`) (레퍼런스 `reference/p3-viewer-arena/crates/server/src/error.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\src\app.rs` — 랭킹 라우트·매개변수·응답 타입, 주소표 주석 — 최종과 같음 (레퍼런스 `reference/p3-viewer-arena/crates/server/src/app.rs`)
  - 바꿈 `C:\dev\viewer-arena\client\src\protocol.ts` — `Leaderboard` 추가 — 최종과 같음 (레퍼런스 `reference/p3-viewer-arena/client/src/protocol.ts`)
  - 바꿈 `C:\dev\viewer-arena\client\src\net.ts` — `fetchLeaderboard` 추가 (레퍼런스 `reference/p3-viewer-arena/client/src/net.ts`)
  - 바꿈 `C:\dev\viewer-arena\client\host.html` — `aside#board` 추가 — 최종과 같음 (레퍼런스 `reference/p3-viewer-arena/client/host.html`)
  - 바꿈 `C:\dev\viewer-arena\client\src\host.ts` — `refreshBoard`와 호출 두 곳 — 최종과 같음 (레퍼런스 `reference/p3-viewer-arena/client/src/host.ts`)
- 끝 상태 확인: `curl.exe "http://127.0.0.1:8080/api/leaderboard?period=all"` → `{"enabled":true,"period":"all","entries":[{"name":"철수","score":5}…]}`. DB 없이 켠 서버는 `{"enabled":false,"period":"day","entries":[]}`. `npm run build` 후 OBS 관전 화면 오른쪽 위에 `최근 24시간 랭킹` 패널이 보이고, 한 판이 끝나면 갱신된다(DB 없으면 패널이 숨겨짐).
- 과제:
  1) `top`의 SQL을 psql에서 `$1`·`$2` 대신 값을 넣어 직접 실행(쉬움) → 정답 요지: `'all'`, `10`으로 바꾼 SELECT와 결과
  2) `ended_at`을 이틀 전으로 넣은 가짜 경기 1건을 만들어 `day`와 `all` 결과가 달라지는지 확인하고 지우기(보통) → 정답 요지: `INSERT … VALUES ('TEST', now() - INTERVAL '2 days')` + 점수 행, 확인 후 `DELETE FROM matches WHERE room_code = 'TEST';`(CASCADE로 점수도 삭제)
  3) `?period=week`를 보내면 어떤 응답이 오는지 확인하고 이유 쓰기(보통) → 정답 요지: 400, `Period`에 없는 값이라 쿼리 문자열 역직렬화 실패(원문 기록)
- 용어(사전 담당): 리더보드, 집계 함수, 데이터베이스 인덱스
- 자주 막히는 곳 후보: `column "s.place" must appear in the GROUP BY clause or be used in an aggregate function` → SELECT에는 GROUP BY 열과 집계만 / Rust 필드 타입이 SQL 타입과 달라 `mismatched types; Rust type `i64` (as SQL type `INT8`) is not compatible with SQL type `INT4`` 같은 오류 → `MAX(integer)`는 `i32` / `$1 = 'all'`에서 타입을 못 정해 오류 → `$1::text` / 랭킹 패널이 안 보임 → DB 없이 켰거나(`enabled:false`) 아직 경기가 없음, 또는 `npm run build`를 안 함 / "오늘 랭킹"이 자정에 안 비워짐 → 의도대로 최근 24시간
- 레퍼런스 대응: `crates/server/src/leaderboard.rs`·`app.rs`(최종과 같음), `error.rs`(tracing 줄 제외 — Day 37), `client/host.html`·`client/src/host.ts`·`client/src/protocol.ts`(최종과 같음), `client/src/net.ts`(`wss:` 선택 제외 — Day 41).

## Day 37 — 설정·로깅·종료 (110분)
- 목표: 설정을 코드에서 분리하는 이유(PC·Docker·배포마다 값이 다름)를 설명하고 `crates\server\src\config.rs`(최종: 맨 위 설정 표 주석, `Config { host, port, database_url, static_dir }`, `from_env()`, `from_vars(get: impl Fn(&str) -> Option<String>)` — 진짜 환경을 바꾸지 않고 테스트할 수 있게 "값을 찾는 함수"를 받음, 빈 문자열은 설정 안 함, 틀린 값은 한국어 안내 `Err`, 기본값 127.0.0.1·8080·없음·`client/dist`, 테스트 4개)를 만든다. `.env.example`(최종: 복사 방법 `Copy-Item .env.example .env`, HOST·PORT·주석 처리한 DATABASE_URL(Day 33 전 단계처럼 DB 없이 돌게)·STATIC_DIR·RUST_LOG·TEST_DATABASE_URL·SERVER_PORT/DB_PORT 설명)와 `.gitignore`의 `.env`(비밀번호가 들어갈 수 있음). `.env`를 읽는 것은 cargo가 아니라 서버의 `dotenvy` 크레이트라는 점(브리프 notes)과, 이미 설정된 환경 변수(`$env:`)는 `.env`가 덮어쓰지 않는다는 점을 설명한다. 로그: `tracing`의 수준(error·warn·info·debug·trace)과 필드(`room = %code`), `tracing_subscriber::fmt().with_env_filter(EnvFilter…)`, `RUST_LOG`(기본 info). `println!`/`eprintln!`을 `room.rs`·`ws.rs`·`error.rs`에서 tracing으로 바꾼다(레퍼런스와 같은 문구). `main.rs`(최종): `dotenvy::dotenv().ok()`, 로그 설정, `run() -> Result<(), String>`에 모든 일을 넣고 `main`은 오류를 `tracing::error!`로 보여 준 뒤 `std::process::exit(1)`, `Config::from_env()?`, DB 연결, `client/dist/index.html` 경고, `router(AppState::new(db), &config.static_dir)`, 바인드 실패 안내, LAN 안내, `axum::serve(…).with_graceful_shutdown(shutdown_signal())`(진행 중인 응답을 마치고 종료), `shutdown_signal`(Ctrl+C, Unix의 SIGTERM = `docker stop` — Windows에는 SIGTERM이 없어서 `#[cfg(not(unix))]`는 끝나지 않는 Future), `lan_ip`. 워크스페이스 의존성에 `tracing = "=0.1.44"`, `tracing-subscriber = { version = "=0.3.23", features = ["env-filter"] }`, `dotenvy = "=0.15.7"`.
- 이미 배운 것: [Day 31](#/day/p3-d31)·[Day 35](#/day/p3-d35)의 환경 변수 읽기(오늘판 이전), [Day 8](#/day/p3-d08)의 `Result<(), String>`·`?`, [Day 9](#/day/p3-d09)의 클로저(`impl Fn`), [Day 11](#/day/p3-d11)의 테스트, [Day 25](#/day/p3-d25)의 `select!`, appsettings·환경·ILogger 로그 수준([P2 Day 24](#/day/p2-d24)), 비밀 값을 커밋하지 않기·`.gitignore`([P2 Day 25](#/day/p2-d25)의 비밀번호 다루기), 파일 확장자 함정([P1 Day 1](#/day/p1-d01)).
- 시작 상태: 어제(Day 36) 끝 상태예요. 인터넷이 필요해요(tracing·dotenvy). 서버를 켤 때 쓰던 `$env:HOST`·`$env:DATABASE_URL`은 오늘부터 `.env`로 옮겨요(새 PowerShell 창에서 시작하면 헷갈리지 않아요).
  - (Day 36 끝 상태와 같아요. 다르면 [Day 36](#/day/p3-d36)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\` 연습 폴더(Day 12까지 사용, 이후 그대로 둠)
  - `C:\dev\viewer-arena\.gitignore`
  - `C:\dev\viewer-arena\Cargo.lock`
  - `C:\dev\viewer-arena\Cargo.toml`
  - `C:\dev\viewer-arena\client\host.html`
  - `C:\dev\viewer-arena\client\index.html`
  - `C:\dev\viewer-arena\client\package-lock.json`
  - `C:\dev\viewer-arena\client\package.json`
  - `C:\dev\viewer-arena\client\play.html`
  - `C:\dev\viewer-arena\client\public\favicon.svg`
  - `C:\dev\viewer-arena\client\src\home.ts`
  - `C:\dev\viewer-arena\client\src\host.ts`
  - `C:\dev\viewer-arena\client\src\input.ts`
  - `C:\dev\viewer-arena\client\src\interp.ts`
  - `C:\dev\viewer-arena\client\src\net.ts`
  - `C:\dev\viewer-arena\client\src\play.ts`
  - `C:\dev\viewer-arena\client\src\protocol.ts`
  - `C:\dev\viewer-arena\client\src\qr.ts`
  - `C:\dev\viewer-arena\client\src\render.ts`
  - `C:\dev\viewer-arena\client\src\style.css`
  - `C:\dev\viewer-arena\client\src\wasm.ts`
  - `C:\dev\viewer-arena\client\tsconfig.json`
  - `C:\dev\viewer-arena\client\vite.config.ts`
  - `C:\dev\viewer-arena\crates\game-core\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-core\src\lib.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\physics.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\protocol.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\rules.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\vec2.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\world.rs`
  - `C:\dev\viewer-arena\crates\game-wasm\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-wasm\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\Cargo.toml`
  - `C:\dev\viewer-arena\crates\server\migrations\0001_init.sql`
  - `C:\dev\viewer-arena\crates\server\src\app.rs`
  - `C:\dev\viewer-arena\crates\server\src\db.rs`
  - `C:\dev\viewer-arena\crates\server\src\error.rs`
  - `C:\dev\viewer-arena\crates\server\src\leaderboard.rs`
  - `C:\dev\viewer-arena\crates\server\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\src\main.rs`
  - `C:\dev\viewer-arena\crates\server\src\room.rs`
  - `C:\dev\viewer-arena\crates\server\src\rooms.rs`
  - `C:\dev\viewer-arena\crates\server\src\ws.rs`
  - `C:\dev\viewer-arena\docker-compose.yml`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\viewer-arena\target\`, `C:\dev\viewer-arena\.git\`, `C:\dev\viewer-arena\client\node_modules\`, `C:\dev\viewer-arena\client\src\wasm\`, `C:\dev\viewer-arena\client\dist\`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치), wasm-bindgen-cli 0.2.130(`wasm-bindgen --version`), OBS Studio(P1에서 설치, 오늘 사용), WSL 2(`wsl --version`), Docker Desktop(선택 — 안 되면 Docker 없는 경로, `docker --version`), PostgreSQL 18(Docker 컨테이너 `db` 또는 Windows 직접 설치)
- 오늘 만들/바꿀 파일:
  - 새로 만듦 `C:\dev\viewer-arena\crates\server\src\config.rs` — 레퍼런스와 같음(테스트 4개) (레퍼런스 `reference/p3-viewer-arena/crates/server/src/config.rs`)
  - 새로 만듦 `C:\dev\viewer-arena\.env.example` — 레퍼런스와 같음 (레퍼런스 `reference/p3-viewer-arena/.env.example`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\src\main.rs` — 최종: dotenvy·tracing·`run`·`Config`·graceful shutdown·`lan_ip` (레퍼런스 `reference/p3-viewer-arena/crates/server/src/main.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\src\room.rs` — 로그를 tracing으로 — 최종과 같음 (레퍼런스 `reference/p3-viewer-arena/crates/server/src/room.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\src\ws.rs` — 로그 2줄을 tracing으로(`응답이 없어서 연결을 정리했어요`, `느린 연결`) — 최종과 같음 (레퍼런스 `reference/p3-viewer-arena/crates/server/src/ws.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\src\error.rs` — `tracing::error!(%error, "DB 오류")` — 최종과 같음 (레퍼런스 `reference/p3-viewer-arena/crates/server/src/error.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\src\lib.rs` — `pub mod config;` 추가 — 최종과 같음 (레퍼런스 `reference/p3-viewer-arena/crates/server/src/lib.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\Cargo.toml` — tracing·tracing-subscriber·dotenvy 추가 (레퍼런스 `reference/p3-viewer-arena/crates/server/Cargo.toml`)
  - 바꿈 `C:\dev\viewer-arena\Cargo.toml` — tracing·tracing-subscriber·dotenvy 추가 (레퍼런스 `reference/p3-viewer-arena/Cargo.toml`)
  - 바꿈 `C:\dev\viewer-arena\Cargo.lock` — 자동 (레퍼런스 `reference/p3-viewer-arena/Cargo.lock`)
  - 바꿈 `C:\dev\viewer-arena\.gitignore` — `# 비밀번호가 들어갈 수 있는 개인 설정` + `.env` — 최종과 같음 (레퍼런스 `reference/p3-viewer-arena/.gitignore`)
  - 오늘 생기는 생성물(커밋 안 함): `C:\dev\viewer-arena\.env`
- 끝 상태 확인: `Copy-Item .env.example .env` 후 `cargo run -p server` → `2026-11-…  INFO server: 서버 시작: http://127.0.0.1:8080`처럼 시각·수준이 붙은 로그. `.env`에서 `HOST=0.0.0.0`으로 바꾸면 LAN 안내가 나온다. `$env:RUST_LOG="debug"`면 더 자세해진다. `Ctrl + C` → `종료 신호를 받았어요.` → `서버를 종료했어요.` `PORT=eighty`면 `PORT=eighty 는 0~65535 사이 숫자여야 해요` 후 `$LASTEXITCODE`가 1. `cargo test -p server` → 단위 테스트 11개(config 4 + rooms 5 + ws 2).
- 과제:
  1) `.env`의 PORT를 `eighty`로 바꿔 오류와 종료 코드를 확인하고 되돌리기(쉬움) → 정답 요지: 안내 문구 + `$LASTEXITCODE` 1
  2) `RUST_LOG=warn`이면 어떤 줄이 사라지는지 보기(쉬움) → 정답 요지: INFO 줄이 안 보이고 WARN·ERROR만
  3) `from_vars`가 진짜 환경 변수를 직접 읽지 않고 함수를 받는 이유 쓰기(보통) → 정답 요지: 테스트가 서로의 환경을 바꾸지 않고 가짜 값을 넣을 수 있음
- 용어(사전 담당): tracing, .env 파일, 우아한 종료, 종료 신호
- 자주 막히는 곳 후보: 메모장으로 만들어 `.env.txt`가 됨(확장자 숨김, P1 Day 1) → 탐색기에서 확장자 확인 또는 `Copy-Item` 명령으로 만들기 / 예전 창의 `$env:DATABASE_URL`이 남아 `.env`를 바꿔도 반영 안 됨(dotenvy는 이미 있는 값을 덮어쓰지 않음) → 새 창 또는 `Remove-Item Env:DATABASE_URL` / `.env`를 커밋할 뻔함 → `git status`에 안 보이면 정상(.gitignore) / `crates\server`에서 실행해 `.env`를 못 찾음(dotenvy는 현재 폴더와 그 위를 찾음 — 워크스페이스 폴더에서 실행이 규칙) / VS Code 터미널에서 `Ctrl + C`를 두 번 눌러 종료 로그를 못 봄 / `Copy-Item`이 이미 있는 `.env`를 덮어씀 → `:::warn`, 있으면 건너뛰기
- 레퍼런스 대응: `crates/server/src/config.rs`·`main.rs`·`room.rs`·`ws.rs`·`error.rs`·`lib.rs`, `.env.example`, `.gitignore`(최종과 같음 — 서버 `src` 전체 최종), `Cargo.toml`·`crates/server/Cargo.toml`(테스트 전용 의존성 제외 — Day 38). `.env`는 학습자 개인 파일(레퍼런스·Git에 없음).

## Day 38 — 테스트와 린트 (120분)
- 목표: 단위 테스트(함수 하나)와 통합 테스트(서버 전체를 띄워 밖에서 접속)를 P2 Day 35·36과 비교한다. 워크스페이스 의존성에 테스트 전용 `tokio-tungstenite = "=0.29.0"`(axum과 같은 버전이라 중복 없음), `futures-util = "=0.3.34"`, `reqwest = { version = "=0.13.5", default-features = false, features = ["json"] }`(TLS 없음)을 더하고 서버 `[dev-dependencies]`에 넣는다. `crates\server\tests\ws_flow.rs`(레퍼런스와 같음: `127.0.0.1:0`(운영체제가 빈 포트를 고름)에 서버를 띄우는 도우미, `AppState::new(None)`과 짧은 `idle_timeout`, 봇 연결 도우미, 테스트 9개 — 두 명 참가·스냅샷, 1KB 초과, 입력 폭탄, 바이너리 프레임, 무응답 정리, 중복 닉네임, 관전 화면, 나쁜 닉네임·없는 방, DB 없는 HTTP 라우트)와 `tests\leaderboard_db.rs`(레퍼런스와 같음: `TEST_DATABASE_URL`이 없으면 `eprintln!` 한 줄만 남기고 **조용히 통과(건너뜀)** — 그래서 "통과"가 "실행됨"이 아님을 꼭 확인, 있으면 고유 꼬리표로 저장·조회·정리)를 만든다(브리프 notes). 테스트 DB: `docker compose exec db psql -U arena -d viewer_arena -c "CREATE DATABASE viewer_arena_test OWNER arena;"`(직접 설치는 psql 전체 경로), `$env:TEST_DATABASE_URL="postgres://arena:arena@127.0.0.1:5432/viewer_arena_test"`. 전체 검사: `cargo test --workspace`, `cargo clippy --workspace --all-targets -- -D warnings`, `cargo clippy -p game-core -p game-wasm --target wasm32-unknown-unknown -- -D warnings`, `cargo fmt --all --check`(고칠 때 `cargo fmt --all`), `client`에서 `npx tsc --noEmit`. clippy가 린터, rustfmt가 포매터임을 P2의 dotnet format·Prettier와 비교한다.
- 이미 배운 것: [Day 11](#/day/p3-d11)·[Day 29](#/day/p3-d29)·[Day 32](#/day/p3-d32)·[Day 37](#/day/p3-d37)의 단위 테스트·`start_paused`, [Day 22](#/day/p3-d22)~[Day 36](#/day/p3-d36)의 서버 전체, [Day 34](#/day/p3-d34)의 psql·`CREATE DATABASE`, 단위·통합 테스트(xUnit, WebApplicationFactory, [P2 Day 35](#/day/p2-d35), [P2 Day 36](#/day/p2-d36)), 포매터·코드 품질([P2 Day 37](#/day/p2-d37)), `tsc --noEmit`([P2 Day 36](#/day/p2-d36)).
- 시작 상태: 어제(Day 37) 끝 상태예요. DB가 켜져 있으면 랭킹 테스트까지 돌릴 수 있어요(없으면 그 테스트는 건너뛰어요). 서버는 꺼 둬도 돼요(테스트가 스스로 띄워요). 인터넷이 필요해요(테스트 전용 크레이트).
  - (Day 37 끝 상태와 같아요. 다르면 [Day 37](#/day/p3-d37)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\` 연습 폴더(Day 12까지 사용, 이후 그대로 둠)
  - `C:\dev\viewer-arena\.env.example`
  - `C:\dev\viewer-arena\.gitignore`
  - `C:\dev\viewer-arena\Cargo.lock`
  - `C:\dev\viewer-arena\Cargo.toml`
  - `C:\dev\viewer-arena\client\host.html`
  - `C:\dev\viewer-arena\client\index.html`
  - `C:\dev\viewer-arena\client\package-lock.json`
  - `C:\dev\viewer-arena\client\package.json`
  - `C:\dev\viewer-arena\client\play.html`
  - `C:\dev\viewer-arena\client\public\favicon.svg`
  - `C:\dev\viewer-arena\client\src\home.ts`
  - `C:\dev\viewer-arena\client\src\host.ts`
  - `C:\dev\viewer-arena\client\src\input.ts`
  - `C:\dev\viewer-arena\client\src\interp.ts`
  - `C:\dev\viewer-arena\client\src\net.ts`
  - `C:\dev\viewer-arena\client\src\play.ts`
  - `C:\dev\viewer-arena\client\src\protocol.ts`
  - `C:\dev\viewer-arena\client\src\qr.ts`
  - `C:\dev\viewer-arena\client\src\render.ts`
  - `C:\dev\viewer-arena\client\src\style.css`
  - `C:\dev\viewer-arena\client\src\wasm.ts`
  - `C:\dev\viewer-arena\client\tsconfig.json`
  - `C:\dev\viewer-arena\client\vite.config.ts`
  - `C:\dev\viewer-arena\crates\game-core\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-core\src\lib.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\physics.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\protocol.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\rules.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\vec2.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\world.rs`
  - `C:\dev\viewer-arena\crates\game-wasm\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-wasm\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\Cargo.toml`
  - `C:\dev\viewer-arena\crates\server\migrations\0001_init.sql`
  - `C:\dev\viewer-arena\crates\server\src\app.rs`
  - `C:\dev\viewer-arena\crates\server\src\config.rs`
  - `C:\dev\viewer-arena\crates\server\src\db.rs`
  - `C:\dev\viewer-arena\crates\server\src\error.rs`
  - `C:\dev\viewer-arena\crates\server\src\leaderboard.rs`
  - `C:\dev\viewer-arena\crates\server\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\src\main.rs`
  - `C:\dev\viewer-arena\crates\server\src\room.rs`
  - `C:\dev\viewer-arena\crates\server\src\rooms.rs`
  - `C:\dev\viewer-arena\crates\server\src\ws.rs`
  - `C:\dev\viewer-arena\docker-compose.yml`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\viewer-arena\target\`, `C:\dev\viewer-arena\.git\`, `C:\dev\viewer-arena\client\node_modules\`, `C:\dev\viewer-arena\client\src\wasm\`, `C:\dev\viewer-arena\client\dist\`, `C:\dev\viewer-arena\.env`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치), wasm-bindgen-cli 0.2.130(`wasm-bindgen --version`), OBS Studio(P1에서 설치, 오늘 사용), WSL 2(`wsl --version`), Docker Desktop(선택 — 안 되면 Docker 없는 경로, `docker --version`), PostgreSQL 18(Docker 컨테이너 `db` 또는 Windows 직접 설치)
- 오늘 만들/바꿀 파일:
  - 새로 만듦 `C:\dev\viewer-arena\crates\server\tests\ws_flow.rs` — 레퍼런스와 같음(테스트 9개) (레퍼런스 `reference/p3-viewer-arena/crates/server/tests/ws_flow.rs`)
  - 새로 만듦 `C:\dev\viewer-arena\crates\server\tests\leaderboard_db.rs` — 레퍼런스와 같음(테스트 2개, `TEST_DATABASE_URL` 없으면 건너뜀) (레퍼런스 `reference/p3-viewer-arena/crates/server/tests/leaderboard_db.rs`)
  - 바꿈 `C:\dev\viewer-arena\crates\server\Cargo.toml` — dev-dependencies에 tokio-tungstenite·futures-util·reqwest — 최종과 같음 (레퍼런스 `reference/p3-viewer-arena/crates/server/Cargo.toml`)
  - 바꿈 `C:\dev\viewer-arena\Cargo.toml` — 테스트 전용 의존성 3개 — 최종과 같음 (레퍼런스 `reference/p3-viewer-arena/Cargo.toml`)
  - 바꿈 `C:\dev\viewer-arena\Cargo.lock` — 자동 — 최종과 같음(레퍼런스와 같은 버전 고정이면 같은 잠금) (레퍼런스 `reference/p3-viewer-arena/Cargo.lock`)
- 끝 상태 확인: `$env:TEST_DATABASE_URL`을 넣고 `cargo test --workspace` → game-core 24, game-wasm 4, server 단위 11, leaderboard_db 2, ws_flow 9 = 50개 통과(panic 메시지 한 줄은 `room_is_removed_even_if_its_task_panics`의 정상 출력). 새 창(TEST_DATABASE_URL 없음)에서 `cargo test -p server --test leaderboard_db -- --nocapture` → `TEST_DATABASE_URL이 없어서 DB 테스트를 건너뛰어요.`가 보이고 2개 "통과". clippy 두 줄과 `cargo fmt --all --check`가 아무 경고 없이 끝나고, `npx tsc --noEmit`도 조용히 끝난다.
- 과제:
  1) 일부러 `return x;`로 끝나는 함수를 만들어 clippy 경고(`needless_return`)를 보고 고치기(쉬움) → 정답 요지: 마지막 표현식으로, 경고 이름으로 검색하는 법
  2) `TEST_DATABASE_URL` 없이 랭킹 테스트를 돌리고 "통과했는데 실제로는 아무것도 안 했다"를 출력으로 증명(보통) → 정답 요지: `--nocapture`로 건너뜀 문장 확인, CI라면 이 변수를 꼭 넣어야 함
  3) `MAX_INPUTS_PER_SEC`를 300으로 바꾸면 어떤 테스트가 실패하는지 예측·확인 후 되돌리기(보통) → 정답 요지: `rate_limiter_allows_30_per_second`·`input_flood_is_throttled` 등(실제 실패 목록 기록)
- 용어(사전 담당): Clippy, rustfmt, 린터
- 자주 막히는 곳 후보: DB 테스트가 항상 통과로 보임 → 변수 없이 건너뛰는 설계(위 과제 2) / `viewer_arena_test` DB를 안 만들어 `database "viewer_arena_test" does not exist` panic / `cargo fmt --all`이 여러 파일을 바꿈 → 정상, 바뀐 내용을 git diff로 확인 / Rust를 업데이트한 뒤 새 clippy 규칙으로 `-D warnings`가 실패 → 메시지의 제안대로 고치기 / 테스트 첫 컴파일이 오래 걸림 / 테스트 중 Windows 방화벽 창 → 테스트는 127.0.0.1에만 열어서 보통 묻지 않음(나오면 취소해도 테스트는 동작 — 실기 미확인 후보)
- 레퍼런스 대응: `crates/server/tests/ws_flow.rs`·`tests/leaderboard_db.rs`·`crates/server/Cargo.toml`·`Cargo.toml`(최종과 같음 — Rust 쪽 전체 최종). 명령은 레퍼런스 README "테스트와 검사"와 같음.

## Day 39 — 성능 (110분)
- 목표: 디버그 빌드(빨리 만들고 검사가 많음)와 릴리스 빌드(최적화, 정수 넘침 검사 없음)를 비교한다: `cargo build -p server --release`의 시간·`target\release\server.exe` 크기, `cargo run -p server --release`. 개발자 도구 WS Messages로 스냅샷 한 개 길이를 참가자 수별로 재고, "길이 × 10Hz × 연결 수"로 서버가 보내는 대역폭을 계산한다(Day 21 복습). 부하 테스트용 연습 폴더 `C:\dev\arena-bots`를 만들고(프로젝트 밖 — 레퍼런스에 없음) `bots.mjs`(의존성 없음: Node 22 이상의 전역 `fetch`·`WebSocket`, 인수로 봇 수와 서버 주소, `POST /api/rooms`로 방을 만들거나 인수로 받은 방에 참가, 봇마다 `봇1`… 닉네임으로 `join`, 100ms마다 무작위 방향 `input`(초당 10개 — 30개 제한 아래), 2초마다 `ping`, 1초마다 "접속 n명, 받은 데이터 n KB/s, 오류 n개" 출력, `Ctrl + C`로 종료)를 쓴다. 관전 화면을 그 방으로 열어 두고 `node C:\dev\arena-bots\bots.mjs 40`을 실행해 작업 관리자에서 `server.exe`의 CPU·메모리를 디버그/릴리스로 비교한다. 51번째 봇은 `room_full`로 거절되는 것을 본다(`MAX_PLAYERS = 50`). `crates/server/tests/ws_flow.rs`의 봇 클라이언트가 같은 원리라는 것을 연결한다.
- 이미 배운 것: [Day 38](#/day/p3-d38)의 봇 통합 테스트, [Day 21](#/day/p3-d21)·[Day 27](#/day/p3-d27)의 대역폭·스냅샷 빈도, [Day 32](#/day/p3-d32)의 빈도 제한, [Day 24](#/day/p3-d24)·[Day 29](#/day/p3-d29)의 메시지·방 API, Node로 스크립트 실행·`process.argv`([P2 Day 3](#/day/p2-d03)), `fetch`·`async`/`await`([P2 Day 8](#/day/p2-d08)), WebSocket 브라우저 API([Day 23](#/day/p3-d23)), 작업 관리자(한 줄 안내).
- 시작 상태: 어제(Day 38) 끝 상태예요. 서버(DB는 있어도 없어도 돼요)를 켜고, `npm run build`로 만든 관전 화면을 브라우저로 열 준비를 해요. `node --version`이 22 이상이어야 해요(P2에서 설치한 26 권장).
  - (Day 38 끝 상태와 같아요. 다르면 [Day 38](#/day/p3-d38)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\` 연습 폴더(Day 12까지 사용, 이후 그대로 둠)
  - `C:\dev\viewer-arena\.env.example`
  - `C:\dev\viewer-arena\.gitignore`
  - `C:\dev\viewer-arena\Cargo.lock`
  - `C:\dev\viewer-arena\Cargo.toml`
  - `C:\dev\viewer-arena\client\host.html`
  - `C:\dev\viewer-arena\client\index.html`
  - `C:\dev\viewer-arena\client\package-lock.json`
  - `C:\dev\viewer-arena\client\package.json`
  - `C:\dev\viewer-arena\client\play.html`
  - `C:\dev\viewer-arena\client\public\favicon.svg`
  - `C:\dev\viewer-arena\client\src\home.ts`
  - `C:\dev\viewer-arena\client\src\host.ts`
  - `C:\dev\viewer-arena\client\src\input.ts`
  - `C:\dev\viewer-arena\client\src\interp.ts`
  - `C:\dev\viewer-arena\client\src\net.ts`
  - `C:\dev\viewer-arena\client\src\play.ts`
  - `C:\dev\viewer-arena\client\src\protocol.ts`
  - `C:\dev\viewer-arena\client\src\qr.ts`
  - `C:\dev\viewer-arena\client\src\render.ts`
  - `C:\dev\viewer-arena\client\src\style.css`
  - `C:\dev\viewer-arena\client\src\wasm.ts`
  - `C:\dev\viewer-arena\client\tsconfig.json`
  - `C:\dev\viewer-arena\client\vite.config.ts`
  - `C:\dev\viewer-arena\crates\game-core\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-core\src\lib.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\physics.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\protocol.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\rules.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\vec2.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\world.rs`
  - `C:\dev\viewer-arena\crates\game-wasm\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-wasm\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\Cargo.toml`
  - `C:\dev\viewer-arena\crates\server\migrations\0001_init.sql`
  - `C:\dev\viewer-arena\crates\server\src\app.rs`
  - `C:\dev\viewer-arena\crates\server\src\config.rs`
  - `C:\dev\viewer-arena\crates\server\src\db.rs`
  - `C:\dev\viewer-arena\crates\server\src\error.rs`
  - `C:\dev\viewer-arena\crates\server\src\leaderboard.rs`
  - `C:\dev\viewer-arena\crates\server\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\src\main.rs`
  - `C:\dev\viewer-arena\crates\server\src\room.rs`
  - `C:\dev\viewer-arena\crates\server\src\rooms.rs`
  - `C:\dev\viewer-arena\crates\server\src\ws.rs`
  - `C:\dev\viewer-arena\crates\server\tests\leaderboard_db.rs`
  - `C:\dev\viewer-arena\crates\server\tests\ws_flow.rs`
  - `C:\dev\viewer-arena\docker-compose.yml`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\viewer-arena\target\`, `C:\dev\viewer-arena\.git\`, `C:\dev\viewer-arena\client\node_modules\`, `C:\dev\viewer-arena\client\src\wasm\`, `C:\dev\viewer-arena\client\dist\`, `C:\dev\viewer-arena\.env`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치), wasm-bindgen-cli 0.2.130(`wasm-bindgen --version`), OBS Studio(P1에서 설치, 오늘 사용), WSL 2(`wsl --version`), Docker Desktop(선택 — 안 되면 Docker 없는 경로, `docker --version`), PostgreSQL 18(Docker 컨테이너 `db` 또는 Windows 직접 설치)
- 오늘 만들/바꿀 파일:
  - 새로 만듦 `C:\dev\arena-bots\bots.mjs` — 부하 테스트 스크립트(연습 폴더, 레퍼런스 밖): 인수 처리, 방 만들기·참가, 봇 N개, 주기적 input·ping, 1초 통계, 오류 세기 (레퍼런스 밖 연습 폴더)
- 끝 상태 확인: `node C:\dev\arena-bots\bots.mjs 40` → `방 ABCD에 봇 40명 접속` 다음 1초마다 `받은 데이터 약 … KB/s` 줄. 관전 화면에 원 40개가 움직이고 `참가 40명`. 51명 이상이면 초과분에 `방이 꽉 찼어요(최대 50명).` 릴리스 서버의 CPU 사용률이 디버그보다 낮다(숫자는 PC마다 다름 — 기록만).
- 과제:
  1) 봇 40명일 때 디버그·릴리스 서버의 CPU를 작업 관리자로 비교해 표로(보통) → 정답 요지: 릴리스가 더 낮음(값은 기록), 방송은 릴리스로
  2) 참가자 1명·10명·40명의 스냅샷 길이를 재서 1명당 늘어나는 바이트와 40명일 때 대역폭 계산(보통) → 정답 요지: 길이 차이 ÷ 인원, × 10 × 연결 수
  3) 봇 60명을 넣어 몇 명이 거절되는지와 그 메시지 확인(쉬움) → 정답 요지: 10명이 `room_full`
- 용어(사전 담당): 릴리스 빌드, 부하 테스트, 봇, 대역폭
- 자주 막히는 곳 후보: `ReferenceError: WebSocket is not defined` → Node가 22보다 낮음(`node --version`) / 봇이 입력을 너무 자주 보내 `rate_limited` → 100ms 간격 이상 / 봇 닉네임이 겹쳐 `name_taken` → 번호 붙이기 / `--release` 서버를 `HOST=0.0.0.0`으로 처음 켜면 방화벽이 다시 묻는다(다른 exe 경로) / 노트북 절전 모드가 CPU 측정을 흔듦 → 전원 연결 / `node bots.mjs`를 다른 폴더에서 실행해 `Cannot find module` → 전체 경로로 실행
- 레퍼런스 대응: 레퍼런스 파일 변경 없음(빌드 명령만). `C:\dev\arena-bots\bots.mjs`는 연습 폴더(레퍼런스 밖)이며 `crates/server/tests/ws_flow.rs`의 봇 클라이언트와 같은 원리. 레퍼런스 README "처음 실행하기"의 `cargo run -p server --release`.

## Day 40 — Docker로 묶기 (120분)
- 목표: Dockerfile 명령과 레이어, 멀티스테이지 빌드(무거운 Rust·Node 도구는 마지막 이미지에 넣지 않음)를 설명하고 `Dockerfile`(레퍼런스와 같음: ① `rust:1.99.1-slim-trixie AS wasm` — 타깃 추가·`wasm-bindgen-cli` 설치·wasm 빌드, ② `node:26.13.0-trixie-slim AS client` — `package*.json`만 먼저 복사해 `npm ci` 층을 캐시, wasm 복사, `npm run build`, ③ `rust AS server` — `cargo build -p server --release --locked`, ④ `debian:trixie-slim` 실행 이미지 — root가 아닌 `arena` 사용자, `HOST=0.0.0.0`(컨테이너 안에서는 모든 주소로 들어야 포트 연결이 됨)·`PORT`·`STATIC_DIR=/srv/client`·`RUST_LOG`, `EXPOSE 8080`, `CMD ["viewer-arena"]`), `.dockerignore`(target·node_modules·dist·wasm·.env·로그 — 빌드 맥락을 작게, 비밀은 이미지에 안 들어가게)를 쓴다. `docker-compose.yml`에 `server` 서비스(최종: `build: .`, `DATABASE_URL`은 서비스 이름 `db`로, 포트 `"${SERVER_PORT:-8080}:8080"`, `depends_on: db: condition: service_healthy`)를 더한다. `docker compose up --build -d`(첫 빌드는 Rust 컴파일과 `wasm-bindgen-cli` 설치로 오래 걸림) → `docker compose logs -f server` → `http://localhost:8080`. 캐시는 그 단계의 입력이 바뀌지 않았을 때만 다시 쓰인다(예: `package*.json`이 그대로면 `npm ci`, Rust 소스를 고치면 서버는 의존성까지 다시 컴파일 — 브리프 notes). 컨테이너 로그의 `172.x.x.x` LAN 안내는 컨테이너 내부 주소라 쓰지 않고 휴대폰은 `ipconfig`의 PC 주소로 들어온다. 끄기 `docker compose down`, 데이터까지 `down -v`(`:::warn`). Docker 없는 경로: `client`에서 `npm run wasm` + `npm run build`, 워크스페이스에서 `cargo run -p server --release`가 같은 결과(Day 39).
- 이미 배운 것: [Day 33](#/day/p3-d33)·[Day 34](#/day/p3-d34)의 Docker·Compose·볼륨·포트 매핑, [Day 20](#/day/p3-d20)·[Day 30](#/day/p3-d30)의 wasm·클라이언트 빌드 순서, [Day 37](#/day/p3-d37)의 환경 변수 설정·`.env`, [Day 39](#/day/p3-d39)의 릴리스 빌드, `npm ci`와 잠금 파일([P2 Day 3](#/day/p2-d03), [P2 Day 38](#/day/p2-d38)), 프로덕션 빌드·단일 앱([P2 Day 38](#/day/p2-d38)).
- 시작 상태: 어제(Day 39) 끝 상태예요. Docker 경로라면 Docker Desktop을 켜고, `cargo run`으로 켠 서버(8080)는 꺼 두세요(포트가 겹쳐요). 인터넷과 시간(첫 빌드 수십 분일 수 있음)이 필요해요.
  - (Day 39 끝 상태와 같아요. 다르면 [Day 39](#/day/p3-d39)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\` 연습 폴더(Day 12까지 사용, 이후 그대로 둠)
  - `C:\dev\arena-bots\bots.mjs`
  - `C:\dev\viewer-arena\.env.example`
  - `C:\dev\viewer-arena\.gitignore`
  - `C:\dev\viewer-arena\Cargo.lock`
  - `C:\dev\viewer-arena\Cargo.toml`
  - `C:\dev\viewer-arena\client\host.html`
  - `C:\dev\viewer-arena\client\index.html`
  - `C:\dev\viewer-arena\client\package-lock.json`
  - `C:\dev\viewer-arena\client\package.json`
  - `C:\dev\viewer-arena\client\play.html`
  - `C:\dev\viewer-arena\client\public\favicon.svg`
  - `C:\dev\viewer-arena\client\src\home.ts`
  - `C:\dev\viewer-arena\client\src\host.ts`
  - `C:\dev\viewer-arena\client\src\input.ts`
  - `C:\dev\viewer-arena\client\src\interp.ts`
  - `C:\dev\viewer-arena\client\src\net.ts`
  - `C:\dev\viewer-arena\client\src\play.ts`
  - `C:\dev\viewer-arena\client\src\protocol.ts`
  - `C:\dev\viewer-arena\client\src\qr.ts`
  - `C:\dev\viewer-arena\client\src\render.ts`
  - `C:\dev\viewer-arena\client\src\style.css`
  - `C:\dev\viewer-arena\client\src\wasm.ts`
  - `C:\dev\viewer-arena\client\tsconfig.json`
  - `C:\dev\viewer-arena\client\vite.config.ts`
  - `C:\dev\viewer-arena\crates\game-core\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-core\src\lib.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\physics.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\protocol.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\rules.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\vec2.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\world.rs`
  - `C:\dev\viewer-arena\crates\game-wasm\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-wasm\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\Cargo.toml`
  - `C:\dev\viewer-arena\crates\server\migrations\0001_init.sql`
  - `C:\dev\viewer-arena\crates\server\src\app.rs`
  - `C:\dev\viewer-arena\crates\server\src\config.rs`
  - `C:\dev\viewer-arena\crates\server\src\db.rs`
  - `C:\dev\viewer-arena\crates\server\src\error.rs`
  - `C:\dev\viewer-arena\crates\server\src\leaderboard.rs`
  - `C:\dev\viewer-arena\crates\server\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\src\main.rs`
  - `C:\dev\viewer-arena\crates\server\src\room.rs`
  - `C:\dev\viewer-arena\crates\server\src\rooms.rs`
  - `C:\dev\viewer-arena\crates\server\src\ws.rs`
  - `C:\dev\viewer-arena\crates\server\tests\leaderboard_db.rs`
  - `C:\dev\viewer-arena\crates\server\tests\ws_flow.rs`
  - `C:\dev\viewer-arena\docker-compose.yml`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\viewer-arena\target\`, `C:\dev\viewer-arena\.git\`, `C:\dev\viewer-arena\client\node_modules\`, `C:\dev\viewer-arena\client\src\wasm\`, `C:\dev\viewer-arena\client\dist\`, `C:\dev\viewer-arena\.env`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치), wasm-bindgen-cli 0.2.130(`wasm-bindgen --version`), OBS Studio(P1에서 설치, 오늘 사용), WSL 2(`wsl --version`), Docker Desktop(선택 — 안 되면 Docker 없는 경로, `docker --version`), PostgreSQL 18(Docker 컨테이너 `db` 또는 Windows 직접 설치)
- 오늘 만들/바꿀 파일:
  - 새로 만듦 `C:\dev\viewer-arena\Dockerfile` — 레퍼런스와 같음(단계 그림 주석 포함) (레퍼런스 `reference/p3-viewer-arena/Dockerfile`)
  - 새로 만듦 `C:\dev\viewer-arena\.dockerignore` — 레퍼런스와 같음 (레퍼런스 `reference/p3-viewer-arena/.dockerignore`)
  - 바꿈 `C:\dev\viewer-arena\docker-compose.yml` — `server` 서비스 추가 — 최종과 같음 (레퍼런스 `reference/p3-viewer-arena/docker-compose.yml`)
- 끝 상태 확인: `docker compose ps`에 `db`(healthy)와 `server`(running). `http://localhost:8080`에서 방 만들기·참가가 되고, `/api/leaderboard` → `"enabled":true`. 한 판 뒤 `docker compose logs server`에 `경기 결과 저장`. `docker images`에 만든 이미지(레퍼런스 기준 약 129 MB). Docker 없는 경로는 `cargo run -p server --release`로 같은 화면.
- 과제:
  1) `client\src\host.ts`의 글자 하나를 바꿔 다시 `--build`할 때 어떤 단계가 다시 도는지 보고 되돌리기(보통) → 정답 요지: client 단계 이후만(`npm ci`는 캐시), Rust 단계는 캐시
  2) README만 바꾸면 이미지가 다시 빌드되는지 예측·확인(보통) → 정답 요지: README는 어느 단계에도 복사되지 않아 모두 캐시(작성자가 실제 출력 확인)
  3) 실행 이미지에 Rust·Node가 없는 이유와 장점 두 가지(쉬움) → 정답 요지: 결과물만 복사 → 작고, 공격받을 도구가 적음
- 용어(사전 담당): Dockerfile, 멀티스테이지 빌드, 레이어 캐시, .dockerignore
- 자주 막히는 곳 후보: `Bind for 0.0.0.0:8080 failed: port is already allocated` → `cargo run` 서버를 끄거나 `.env`에 `SERVER_PORT=18080` / `.dockerignore`가 없어 `transferring context`가 수 GB(target 폴더) → 파일 확인 / 빌드 중 crates.io·npm 다운로드 실패(회사·학교망 프록시, 인증서) → 다른 네트워크(작성 환경의 프록시 우회는 교재에 싣지 않음) / WSL 메모리·디스크 부족으로 Rust 컴파일이 죽음(`no space left on device`, 오래 멈춤) → 디스크 정리, Docker Desktop 리소스 / 이미지 이름·태그 오타 → `failed to resolve source metadata`(원문 확인) / 셸 스크립트를 쓰지 않아 CRLF 문제는 없다는 점(가이드 3.3) 한 줄
- 레퍼런스 대응: `Dockerfile`·`.dockerignore`·`docker-compose.yml`(최종과 같음). 레퍼런스 README "Docker로 전부 실행하기".

## Day 41 — 배포 준비 (90분)
- 목표: 인터넷 공개의 부품을 그림으로 설명한다: 도메인 이름 → DNS가 IP 주소로 바꿈 → 리버스 프록시(호스팅 플랫폼의 입구)가 HTTPS(TLS)를 풀고 우리 서버의 `PORT`로 넘김. Day 23부터 쓴 Vite 개발 서버의 `proxy`가 작은 리버스 프록시였다는 것을 연결한다. https 페이지에서 `ws://`는 혼합 콘텐츠로 막히므로 `net.ts`의 `connect`를 `location.protocol === 'https:' ? 'wss:' : 'ws:'`로 고친다(최종 — 클라이언트 전체 최종). 플랫폼의 헬스 체크용 `/healthz`, 플랫폼이 주는 `PORT` 환경 변수(Day 37 `Config`가 읽음), 방이 메모리에만 있으니 서버는 반드시 한 대(인스턴스 1개)로 운영해야 한다는 점, 공개 전 점검표(DB 비밀번호 바꾸기, DB 포트를 인터넷에 열지 않기, `.env`·비밀을 저장소에 넣지 않기, 금지어 목록 손보기, 로그에 비밀번호가 안 찍히는지)를 만든다. 관리형 PostgreSQL이 TLS(`sslmode=require`)를 요구하면 sqlx에 TLS 기능(`tls-rustls`)을 더해야 한다는 사실은 "필요할 때만 하는 선택 단계"로 설명만 한다(레퍼런스는 TLS 없음 — 브리프 notes).
- 이미 배운 것: [Day 40](#/day/p3-d40)의 Docker 이미지, [Day 37](#/day/p3-d37)의 설정·`PORT`·`.env`, [Day 23](#/day/p3-d23)의 Vite 프록시·WebSocket, [Day 31](#/day/p3-d31)의 IP 주소·LAN, HTTPS([P2 Day 16](#/day/p2-d16), [P2 Day 34](#/day/p2-d34)), 배포 경험([P1 Day 14](#/day/p1-d14), [P2 Day 39](#/day/p2-d39)), 비밀 값 관리([P2 Day 25](#/day/p2-d25)).
- 시작 상태: 어제(Day 40) 끝 상태예요. 오늘은 코드 한 곳만 고치고 나머지는 설계·점검이에요.
  - (Day 40 끝 상태와 같아요. 다르면 [Day 40](#/day/p3-d40)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\` 연습 폴더(Day 12까지 사용, 이후 그대로 둠)
  - `C:\dev\arena-bots\bots.mjs`
  - `C:\dev\viewer-arena\.dockerignore`
  - `C:\dev\viewer-arena\.env.example`
  - `C:\dev\viewer-arena\.gitignore`
  - `C:\dev\viewer-arena\Cargo.lock`
  - `C:\dev\viewer-arena\Cargo.toml`
  - `C:\dev\viewer-arena\client\host.html`
  - `C:\dev\viewer-arena\client\index.html`
  - `C:\dev\viewer-arena\client\package-lock.json`
  - `C:\dev\viewer-arena\client\package.json`
  - `C:\dev\viewer-arena\client\play.html`
  - `C:\dev\viewer-arena\client\public\favicon.svg`
  - `C:\dev\viewer-arena\client\src\home.ts`
  - `C:\dev\viewer-arena\client\src\host.ts`
  - `C:\dev\viewer-arena\client\src\input.ts`
  - `C:\dev\viewer-arena\client\src\interp.ts`
  - `C:\dev\viewer-arena\client\src\net.ts`
  - `C:\dev\viewer-arena\client\src\play.ts`
  - `C:\dev\viewer-arena\client\src\protocol.ts`
  - `C:\dev\viewer-arena\client\src\qr.ts`
  - `C:\dev\viewer-arena\client\src\render.ts`
  - `C:\dev\viewer-arena\client\src\style.css`
  - `C:\dev\viewer-arena\client\src\wasm.ts`
  - `C:\dev\viewer-arena\client\tsconfig.json`
  - `C:\dev\viewer-arena\client\vite.config.ts`
  - `C:\dev\viewer-arena\crates\game-core\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-core\src\lib.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\physics.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\protocol.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\rules.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\vec2.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\world.rs`
  - `C:\dev\viewer-arena\crates\game-wasm\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-wasm\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\Cargo.toml`
  - `C:\dev\viewer-arena\crates\server\migrations\0001_init.sql`
  - `C:\dev\viewer-arena\crates\server\src\app.rs`
  - `C:\dev\viewer-arena\crates\server\src\config.rs`
  - `C:\dev\viewer-arena\crates\server\src\db.rs`
  - `C:\dev\viewer-arena\crates\server\src\error.rs`
  - `C:\dev\viewer-arena\crates\server\src\leaderboard.rs`
  - `C:\dev\viewer-arena\crates\server\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\src\main.rs`
  - `C:\dev\viewer-arena\crates\server\src\room.rs`
  - `C:\dev\viewer-arena\crates\server\src\rooms.rs`
  - `C:\dev\viewer-arena\crates\server\src\ws.rs`
  - `C:\dev\viewer-arena\crates\server\tests\leaderboard_db.rs`
  - `C:\dev\viewer-arena\crates\server\tests\ws_flow.rs`
  - `C:\dev\viewer-arena\docker-compose.yml`
  - `C:\dev\viewer-arena\Dockerfile`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\viewer-arena\target\`, `C:\dev\viewer-arena\.git\`, `C:\dev\viewer-arena\client\node_modules\`, `C:\dev\viewer-arena\client\src\wasm\`, `C:\dev\viewer-arena\client\dist\`, `C:\dev\viewer-arena\.env`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치), wasm-bindgen-cli 0.2.130(`wasm-bindgen --version`), OBS Studio(P1에서 설치, 오늘 사용), WSL 2(`wsl --version`), Docker Desktop(선택 — 안 되면 Docker 없는 경로, `docker --version`), PostgreSQL 18(Docker 컨테이너 `db` 또는 Windows 직접 설치)
- 오늘 만들/바꿀 파일:
  - 바꿈 `C:\dev\viewer-arena\client\src\net.ts` — `connect`의 주소 앞부분을 `wss:`/`ws:` 선택으로 — 최종과 같음 (레퍼런스 `reference/p3-viewer-arena/client/src/net.ts`)
- 끝 상태 확인: `npm run build` 후 로컬(`http://`)에서 여전히 참가·관전이 되고, WS 주소가 `ws://…`로 보인다. 점검표 7줄 이상이 채워졌다.
- 과제:
  1) https 페이지가 `ws://`에 연결하려 할 때 브라우저가 막는 이유를 한 문단으로(쉬움) → 정답 요지: 암호화된 페이지에 암호화 안 된 연결이 섞이면 가로채기 위험(혼합 콘텐츠)
  2) 배포에 필요한 환경 변수 목록과 각각 누가 정하는지(보통) → 정답 요지: PORT(플랫폼), HOST(이미지 0.0.0.0), DATABASE_URL(선택, 비밀), RUST_LOG
  3) 요청 흐름 그림(휴대폰 → DNS → 리버스 프록시 → 서버 → DB)을 `text` 32칸 이하로(보통) → 정답 요지: 위 순서 그림
- 용어(사전 담당): 도메인 이름, DNS, TLS, WSS
  - 링크만 거는 기존 용어(P1·P2 사전에 이미 있음, 다시 정의하지 않음): `[[리버스 프록시]]`, `[[HTTPS]]`
- 자주 막히는 곳 후보: 혼합 콘텐츠 오류 원문(Chrome: `Mixed Content: … attempted to connect to the insecure WebSocket endpoint …`) — 작성자가 실제 문구 확인 후 싣기 / 서버를 여러 대로 늘리면 방이 서버마다 따로라 참가가 안 됨 → 한 대 / LAN 주소(192.168…)용 HTTPS 인증서를 만들려고 함 → 필요 없음(LAN은 http, 인터넷은 플랫폼이 TLS) / 관리형 DB가 TLS를 요구하는데 TLS 기능 없이 연결해 실패 → 오늘은 설명만, 선택 단계
- 레퍼런스 대응: `client/src/net.ts`(최종과 같음 — 이제 `client` 전체가 레퍼런스와 같음). Cargo.toml의 sqlx TLS 주석·README "랭킹 켜기"의 TLS 문단에 대응.

## Day 42 — 배포 (120분)
- 목표: 배포는 선택 실습이고 방송의 본선은 로컬(같은 PC의 OBS + 같은 Wi-Fi 휴대폰, Day 30~31)이라는 것을 맨 위에 밝힌다. external-facts 13절(작성 기준일 2026-11): 1순위 Render 무료 인스턴스(Docker) — 15분 무트래픽이면 슬립, 깨어나는 데 약 1분(콜드 스타트), 디스크 휘발, 무료 Postgres는 생성 30일 뒤 만료, 카드 필요 여부는 공식 문서로 확인 못 함(가입 화면에서 확인); 대안 Google Cloud Run(결제 계정 필요), Fly.io(신규 무료 없음). 순서: GitHub에 비공개 저장소로 푸시(P1 Day 7, `.env`가 안 올라가는지 `git status`) → 호스팅에서 새 웹 서비스·Docker 런타임으로 저장소 연결 → 환경 변수(`RUST_LOG`; `PORT`는 플랫폼이 넣음; `DATABASE_URL`은 넣지 않아 랭킹 없이 — TLS 기능이 없는 레퍼런스 그대로) → 헬스 체크 경로 `/healthz` → 배포 로그 확인 → `https://…` 주소에서 방을 만들고 휴대폰 데이터(LTE)로 QR 참가(wss). 슬립 뒤 방이 사라지는 것(메모리)과 OBS URL 갱신, 다 쓴 뒤 서비스 삭제·비용 알림을 확인한다. 화면 메뉴 이름은 바뀔 수 있으니 "작성 기준일 2026-11" + 위치 묘사.
- 이미 배운 것: [Day 41](#/day/p3-d41)의 도메인·TLS·WSS·리버스 프록시·점검표, [Day 40](#/day/p3-d40)의 Dockerfile, [Day 37](#/day/p3-d37)의 환경 변수·`/healthz`, GitHub 저장소·푸시([P1 Day 7](#/day/p1-d07)), 배포 옵션 고르기·비용 주의([P2 Day 39](#/day/p2-d39)).
- 시작 상태: 어제(Day 41) 끝 상태예요. GitHub 계정과 인터넷이 필요해요. 호스팅 가입이 카드 등록을 요구하면 멈추고 로컬 경로로 마쳐도 돼요(체크리스트에 대체 항목이 있어요).
  - (Day 41 끝 상태와 같아요. 다르면 [Day 41](#/day/p3-d41)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\` 연습 폴더(Day 12까지 사용, 이후 그대로 둠)
  - `C:\dev\arena-bots\bots.mjs`
  - `C:\dev\viewer-arena\.dockerignore`
  - `C:\dev\viewer-arena\.env.example`
  - `C:\dev\viewer-arena\.gitignore`
  - `C:\dev\viewer-arena\Cargo.lock`
  - `C:\dev\viewer-arena\Cargo.toml`
  - `C:\dev\viewer-arena\client\host.html`
  - `C:\dev\viewer-arena\client\index.html`
  - `C:\dev\viewer-arena\client\package-lock.json`
  - `C:\dev\viewer-arena\client\package.json`
  - `C:\dev\viewer-arena\client\play.html`
  - `C:\dev\viewer-arena\client\public\favicon.svg`
  - `C:\dev\viewer-arena\client\src\home.ts`
  - `C:\dev\viewer-arena\client\src\host.ts`
  - `C:\dev\viewer-arena\client\src\input.ts`
  - `C:\dev\viewer-arena\client\src\interp.ts`
  - `C:\dev\viewer-arena\client\src\net.ts`
  - `C:\dev\viewer-arena\client\src\play.ts`
  - `C:\dev\viewer-arena\client\src\protocol.ts`
  - `C:\dev\viewer-arena\client\src\qr.ts`
  - `C:\dev\viewer-arena\client\src\render.ts`
  - `C:\dev\viewer-arena\client\src\style.css`
  - `C:\dev\viewer-arena\client\src\wasm.ts`
  - `C:\dev\viewer-arena\client\tsconfig.json`
  - `C:\dev\viewer-arena\client\vite.config.ts`
  - `C:\dev\viewer-arena\crates\game-core\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-core\src\lib.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\physics.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\protocol.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\rules.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\vec2.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\world.rs`
  - `C:\dev\viewer-arena\crates\game-wasm\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-wasm\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\Cargo.toml`
  - `C:\dev\viewer-arena\crates\server\migrations\0001_init.sql`
  - `C:\dev\viewer-arena\crates\server\src\app.rs`
  - `C:\dev\viewer-arena\crates\server\src\config.rs`
  - `C:\dev\viewer-arena\crates\server\src\db.rs`
  - `C:\dev\viewer-arena\crates\server\src\error.rs`
  - `C:\dev\viewer-arena\crates\server\src\leaderboard.rs`
  - `C:\dev\viewer-arena\crates\server\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\src\main.rs`
  - `C:\dev\viewer-arena\crates\server\src\room.rs`
  - `C:\dev\viewer-arena\crates\server\src\rooms.rs`
  - `C:\dev\viewer-arena\crates\server\src\ws.rs`
  - `C:\dev\viewer-arena\crates\server\tests\leaderboard_db.rs`
  - `C:\dev\viewer-arena\crates\server\tests\ws_flow.rs`
  - `C:\dev\viewer-arena\docker-compose.yml`
  - `C:\dev\viewer-arena\Dockerfile`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\viewer-arena\target\`, `C:\dev\viewer-arena\.git\`, `C:\dev\viewer-arena\client\node_modules\`, `C:\dev\viewer-arena\client\src\wasm\`, `C:\dev\viewer-arena\client\dist\`, `C:\dev\viewer-arena\.env`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치), wasm-bindgen-cli 0.2.130(`wasm-bindgen --version`), OBS Studio(P1에서 설치, 오늘 사용), WSL 2(`wsl --version`), Docker Desktop(선택 — 안 되면 Docker 없는 경로, `docker --version`), PostgreSQL 18(Docker 컨테이너 `db` 또는 Windows 직접 설치)
- 오늘 만들/바꿀 파일: 없음(도구 설치·설정·확인만 하는 날)
- 끝 상태 확인: 배포했다면 `https://<서비스 이름>.onrender.com/healthz`(주소는 다름) → `ok`, 그 주소에서 방을 만들고 휴대폰 데이터로 참가가 된다. 배포하지 않았다면 로컬 대체 확인(같은 Wi-Fi 휴대폰 참가 + OBS)을 체크했다. 비용 확인과 서비스 삭제(또는 유지 이유)를 적었다.
- 과제:
  1) 15분 넘게 두었다가 다시 열어 첫 응답까지 걸린 시간 재기(쉬움) → 정답 요지: 약 1분 안팎(콜드 스타트), 방송 전에 미리 깨우기
  2) 배포 로그에서 `서버 시작:`·`DATABASE_URL이 없어서 랭킹을 꺼요` 줄 찾기(쉬움) → 정답 요지: 우리 tracing 로그가 그대로 보임
  3) 공개 서버를 계속 켜 둘 때의 위험 세 가지와 대응(보통) → 정답 요지: 장난 방 생성(MAX_ROOMS), 닉네임 공격(필터), 비용·약관(무료 한도 확인, 안 쓰면 삭제)
- 용어(사전 담당): 관리형 데이터베이스, 콜드 스타트
- 자주 막히는 곳 후보: 가입 때 카드 등록 요구(미확인 항목) → 멈추고 로컬 경로 / 플랫폼이 포트를 못 찾음 → 서버가 `PORT`를 읽는지(Config), `HOST=0.0.0.0`(Dockerfile) / 무료 빌드 환경에서 Rust 컴파일이 오래 걸리거나 실패할 수 있음(작성 시 미확인) → 로그 확인, 로컬 대체 / 플랫폼의 WebSocket 지원·유휴 연결 끊김 시간(작성 시 미확인 — 작성자가 공식 문서로 확인 후 싣기) / 슬립 뒤 OBS 화면이 `방을 찾을 수 없어요` → 새 방·새 URL / `.env`나 비밀번호가 저장소에 올라감 → 즉시 비밀번호 바꾸기, 커밋 기록에서 지우기는 복잡하니 처음부터 `.gitignore`
- 레퍼런스 대응: 레퍼런스 파일 변경 없음 — 배포 설정은 호스팅 대시보드에서(`Dockerfile`, `/healthz`, `PORT` 환경 변수 사용). external-facts 13절 "Docker 컨테이너(P3 Rust 서버, SP)" 행.

## Day 43 — 방송 리허설 (100분)
- 목표: 리허설을 "실제 방송과 같은 순서로 한 번 끝까지"로 정의한다. OBS: 장면에 브라우저 소스(관전 주소는 PC의 LAN IP로 연 `host.html?room=…`, 너비 1920·높이 1080), 다른 소스 위에 겹치는 순서, 캐시 새로 고침, 녹화로 한 판 남기기. 친구 1~3명(같은 Wi-Fi 또는 Day 42 배포 주소)과 QR로 참가 → 한 판 → 결과·랭킹 확인. 방송 전 체크리스트(DB 켜기 → `.env`의 `HOST=0.0.0.0` → 릴리스 서버 → `client\dist` 최신(`npm run wasm`·`npm run build`) → PC 브라우저를 LAN IP로 열어 방 만들기 → OBS URL 바꾸기 → 휴대폰 한 대로 시험), 방송 중(서버 창의 경고·오류 줄 보기, 닉네임 문제 대응), 사고 대응(서버가 꺼졌다 → 다시 켜기 → 방이 사라졌으니 새 방 → OBS URL 교체 — 방은 메모리에만 있음, 브리프 notes), 방송 후(서버 끄기, `HOST` 되돌리기). 이 체크리스트를 `C:\dev\viewer-arena\README.md`(오늘 처음 만듦 — 내 글로, 레퍼런스 README와 내용이 달라도 됨)의 "방송 전 체크리스트" 절로 남긴다.
- 이미 배운 것: [Day 30](#/day/p3-d30)·[Day 31](#/day/p3-d31)의 관전 화면·LAN·방화벽, [Day 36](#/day/p3-d36)의 랭킹, [Day 37](#/day/p3-d37)의 `.env`·로그, [Day 39](#/day/p3-d39)의 릴리스 빌드, [Day 42](#/day/p3-d42)의 배포(선택), OBS 장면·소스·녹화([P1 Day 27](#/day/p1-d27)), Markdown README([P1 Day 29](#/day/p1-d29)).
- 시작 상태: 어제(Day 42) 끝 상태예요. OBS, 휴대폰, 가능하면 친구 1명 이상(같은 Wi-Fi 또는 배포 주소)이 필요해요.
  - (Day 42 끝 상태와 같아요. 다르면 [Day 42](#/day/p3-d42)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\` 연습 폴더(Day 12까지 사용, 이후 그대로 둠)
  - `C:\dev\arena-bots\bots.mjs`
  - `C:\dev\viewer-arena\.dockerignore`
  - `C:\dev\viewer-arena\.env.example`
  - `C:\dev\viewer-arena\.gitignore`
  - `C:\dev\viewer-arena\Cargo.lock`
  - `C:\dev\viewer-arena\Cargo.toml`
  - `C:\dev\viewer-arena\client\host.html`
  - `C:\dev\viewer-arena\client\index.html`
  - `C:\dev\viewer-arena\client\package-lock.json`
  - `C:\dev\viewer-arena\client\package.json`
  - `C:\dev\viewer-arena\client\play.html`
  - `C:\dev\viewer-arena\client\public\favicon.svg`
  - `C:\dev\viewer-arena\client\src\home.ts`
  - `C:\dev\viewer-arena\client\src\host.ts`
  - `C:\dev\viewer-arena\client\src\input.ts`
  - `C:\dev\viewer-arena\client\src\interp.ts`
  - `C:\dev\viewer-arena\client\src\net.ts`
  - `C:\dev\viewer-arena\client\src\play.ts`
  - `C:\dev\viewer-arena\client\src\protocol.ts`
  - `C:\dev\viewer-arena\client\src\qr.ts`
  - `C:\dev\viewer-arena\client\src\render.ts`
  - `C:\dev\viewer-arena\client\src\style.css`
  - `C:\dev\viewer-arena\client\src\wasm.ts`
  - `C:\dev\viewer-arena\client\tsconfig.json`
  - `C:\dev\viewer-arena\client\vite.config.ts`
  - `C:\dev\viewer-arena\crates\game-core\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-core\src\lib.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\physics.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\protocol.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\rules.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\vec2.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\world.rs`
  - `C:\dev\viewer-arena\crates\game-wasm\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-wasm\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\Cargo.toml`
  - `C:\dev\viewer-arena\crates\server\migrations\0001_init.sql`
  - `C:\dev\viewer-arena\crates\server\src\app.rs`
  - `C:\dev\viewer-arena\crates\server\src\config.rs`
  - `C:\dev\viewer-arena\crates\server\src\db.rs`
  - `C:\dev\viewer-arena\crates\server\src\error.rs`
  - `C:\dev\viewer-arena\crates\server\src\leaderboard.rs`
  - `C:\dev\viewer-arena\crates\server\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\src\main.rs`
  - `C:\dev\viewer-arena\crates\server\src\room.rs`
  - `C:\dev\viewer-arena\crates\server\src\rooms.rs`
  - `C:\dev\viewer-arena\crates\server\src\ws.rs`
  - `C:\dev\viewer-arena\crates\server\tests\leaderboard_db.rs`
  - `C:\dev\viewer-arena\crates\server\tests\ws_flow.rs`
  - `C:\dev\viewer-arena\docker-compose.yml`
  - `C:\dev\viewer-arena\Dockerfile`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\viewer-arena\target\`, `C:\dev\viewer-arena\.git\`, `C:\dev\viewer-arena\client\node_modules\`, `C:\dev\viewer-arena\client\src\wasm\`, `C:\dev\viewer-arena\client\dist\`, `C:\dev\viewer-arena\.env`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치), wasm-bindgen-cli 0.2.130(`wasm-bindgen --version`), OBS Studio(P1에서 설치, 오늘 사용), WSL 2(`wsl --version`), Docker Desktop(선택 — 안 되면 Docker 없는 경로, `docker --version`), PostgreSQL 18(Docker 컨테이너 `db` 또는 Windows 직접 설치)
- 오늘 만들/바꿀 파일:
  - 새로 만듦 `C:\dev\viewer-arena\README.md` — 오늘판: 제목·한 줄 소개 + "방송 전 체크리스트"·"사고 대응" 절(학습자 글) — Day 44·45에 이어 씀 (레퍼런스 `reference/p3-viewer-arena/README.md`)
- 끝 상태 확인: OBS 녹화 파일에 한 판(대기 → 게임 → 결과)이 남았고, 친구의 원이 관전 화면에 보였다. 서버를 일부러 껐다 켜서 1분 안에 새 방 URL로 복구했다. README에 체크리스트가 있다.
- 과제:
  1) 내 체크리스트 쓰기(쉬움) → 정답 요지: 위 목표 순서를 내 PC 경로·명령으로(예시 정답 제공)
  2) 라운드 중 서버를 `Ctrl + C`로 끄고 1분 안에 복구하기(보통) → 정답 요지: 다시 켜기 → 새 방 → OBS 소스 속성의 URL 교체 → 시청자에게 새 QR 안내
  3) 친구가 느낀 지연과 내가 본 화면 차이를 기록(쉬움) → 정답 요지: 휴대폰은 예측으로 즉시, OBS는 150ms 뒤(보간) — 정상
- 용어(사전 담당): 방송 리허설
- 자주 막히는 곳 후보: OBS 화면이 `방을 찾을 수 없어요` → 서버 재시작으로 방이 사라짐, 새 URL / PC 절전·Wi-Fi 절전으로 방송 중 끊김 → 전원 옵션 / 노트북을 다른 Wi-Fi로 옮겨 네트워크 프로필이 공용이 됨 → Day 31 / PC 브라우저를 127.0.0.1로 열어 QR이 틀림 → 화면 경고 확인 / `npm run build`를 안 해 OBS에 옛 화면 → 체크리스트 순서
- 레퍼런스 대응: `README.md`(학습자 글 — 레퍼런스 README와 내용이 달라도 돼요; 레퍼런스 README의 "OBS에 띄우기"·"휴대폰으로 참가하기"·"자주 막히는 곳"이 참고 자료).

## Day 44 — 확장 설계 (90분)
- 목표: "휴대폰 없는 시청자도 채팅으로 참가"를 설계 문서로 쓴다(구현하지 않음): 채팅 명령어 `!join`·`!up`/`!left` 같은 조작 명령, 채팅 이벤트를 받는 쪽(치지직 Open API의 세션 소켓 — 자세한 OAuth·세션은 SP Day 21~26, SP를 아직 안 했어도 이해되게 한 문단 요약, API 승인·약관은 미확인이라 공식 문서 확인 필요), 서버 쪽 추가(예: 채팅 참가자용 `ClientMsg` 변형이나 내부 명령을 스케치), 채팅 닉네임을 Day 32 필터에 그대로 통과시키기, 스팸(`MAX_PLAYERS` 50 → 대기열), 사칭·도배 위험. 확장: 지금은 방이 서버 메모리에만 있어 서버 한 대(Day 41) — 수직 확장(더 좋은 서버) vs 수평 확장(서버 여러 대, 방 코드로 어느 서버인지 정하는 방 단위 분산, 공유 저장소 필요)의 비교 그림. SP(이미지 도네이션)를 하면 얻는 것(OAuth·채팅 이벤트·관리 화면)과 이 게임을 잇는 아이디어. 설계를 `README.md`의 "확장 설계" 절로 남긴다.
- 이미 배운 것: [Day 21](#/day/p3-d21)의 권위 서버, [Day 24](#/day/p3-d24)의 메시지 프로토콜, [Day 29](#/day/p3-d29)의 방 시스템, [Day 32](#/day/p3-d32)의 안전 장치, [Day 41](#/day/p3-d41)의 단일 인스턴스 제약, [Day 43](#/day/p3-d43)의 README, 인증·OAuth는 SP에서 배운다는 안내([SP 개요](#/project/sp)), REST 설계([P2 Day 16](#/day/p2-d16)).
- 시작 상태: 어제(Day 43) 끝 상태예요. 오늘은 코드를 바꾸지 않고 설계만 해요.
  - (Day 43 끝 상태와 같아요. 다르면 [Day 43](#/day/p3-d43)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\` 연습 폴더(Day 12까지 사용, 이후 그대로 둠)
  - `C:\dev\arena-bots\bots.mjs`
  - `C:\dev\viewer-arena\.dockerignore`
  - `C:\dev\viewer-arena\.env.example`
  - `C:\dev\viewer-arena\.gitignore`
  - `C:\dev\viewer-arena\Cargo.lock`
  - `C:\dev\viewer-arena\Cargo.toml`
  - `C:\dev\viewer-arena\client\host.html`
  - `C:\dev\viewer-arena\client\index.html`
  - `C:\dev\viewer-arena\client\package-lock.json`
  - `C:\dev\viewer-arena\client\package.json`
  - `C:\dev\viewer-arena\client\play.html`
  - `C:\dev\viewer-arena\client\public\favicon.svg`
  - `C:\dev\viewer-arena\client\src\home.ts`
  - `C:\dev\viewer-arena\client\src\host.ts`
  - `C:\dev\viewer-arena\client\src\input.ts`
  - `C:\dev\viewer-arena\client\src\interp.ts`
  - `C:\dev\viewer-arena\client\src\net.ts`
  - `C:\dev\viewer-arena\client\src\play.ts`
  - `C:\dev\viewer-arena\client\src\protocol.ts`
  - `C:\dev\viewer-arena\client\src\qr.ts`
  - `C:\dev\viewer-arena\client\src\render.ts`
  - `C:\dev\viewer-arena\client\src\style.css`
  - `C:\dev\viewer-arena\client\src\wasm.ts`
  - `C:\dev\viewer-arena\client\tsconfig.json`
  - `C:\dev\viewer-arena\client\vite.config.ts`
  - `C:\dev\viewer-arena\crates\game-core\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-core\src\lib.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\physics.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\protocol.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\rules.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\vec2.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\world.rs`
  - `C:\dev\viewer-arena\crates\game-wasm\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-wasm\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\Cargo.toml`
  - `C:\dev\viewer-arena\crates\server\migrations\0001_init.sql`
  - `C:\dev\viewer-arena\crates\server\src\app.rs`
  - `C:\dev\viewer-arena\crates\server\src\config.rs`
  - `C:\dev\viewer-arena\crates\server\src\db.rs`
  - `C:\dev\viewer-arena\crates\server\src\error.rs`
  - `C:\dev\viewer-arena\crates\server\src\leaderboard.rs`
  - `C:\dev\viewer-arena\crates\server\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\src\main.rs`
  - `C:\dev\viewer-arena\crates\server\src\room.rs`
  - `C:\dev\viewer-arena\crates\server\src\rooms.rs`
  - `C:\dev\viewer-arena\crates\server\src\ws.rs`
  - `C:\dev\viewer-arena\crates\server\tests\leaderboard_db.rs`
  - `C:\dev\viewer-arena\crates\server\tests\ws_flow.rs`
  - `C:\dev\viewer-arena\docker-compose.yml`
  - `C:\dev\viewer-arena\Dockerfile`
  - `C:\dev\viewer-arena\README.md`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\viewer-arena\target\`, `C:\dev\viewer-arena\.git\`, `C:\dev\viewer-arena\client\node_modules\`, `C:\dev\viewer-arena\client\src\wasm\`, `C:\dev\viewer-arena\client\dist\`, `C:\dev\viewer-arena\.env`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치), wasm-bindgen-cli 0.2.130(`wasm-bindgen --version`), OBS Studio(P1에서 설치, 오늘 사용), WSL 2(`wsl --version`), Docker Desktop(선택 — 안 되면 Docker 없는 경로, `docker --version`), PostgreSQL 18(Docker 컨테이너 `db` 또는 Windows 직접 설치)
- 오늘 만들/바꿀 파일:
  - 바꿈 `C:\dev\viewer-arena\README.md` — "확장 설계" 절 추가(그림·메시지 스케치·위험 목록) (레퍼런스 `reference/p3-viewer-arena/README.md`)
- 끝 상태 확인: README에 `text` 그림(채팅 → 이벤트 수신 → 서버 → 방)과 메시지 스케치, 위험 5개 이상, 수평 확장 그림이 있다.
- 과제:
  1) 채팅 참가용 메시지·명령을 Rust 열거형 스케치로(코드 블록만, 프로젝트에 넣지 않음)(보통) → 정답 요지: 예) `ChatJoin { name }`, `ChatMove { name, dir }`
  2) 채팅 500명이 동시에 `!join`하면 어떻게 할지(보통) → 정답 요지: 50명 제한 → 먼저 온 순 대기열·다음 라운드
  3) 위험 목록(스팸·사칭·약관·토큰 유출·도배)과 대응(쉬움) → 정답 요지: 빈도 제한·닉네임 필터·공식 약관 확인·토큰은 저장소 밖
- 용어(사전 담당): 채팅 명령어, 수평 확장
- 자주 막히는 곳 후보: 설계하다가 바로 구현하고 싶어짐 → 범위(오늘은 문서), 졸업 후 과제로 / 치지직 API 사양·승인 절차를 추측으로 적음 → "미확인, 공식 문서 확인"이라고 표시 / 토큰·Client Secret을 README에 적음 → 절대 금지
- 레퍼런스 대응: `README.md`(학습자 글); 코드 변경 없음. 레퍼런스 README에는 없는 절(학습자 글이라 내용이 달라도 돼요).

## Day 45 — 회고와 졸업 (90분)
- 목표: README를 포트폴리오로 완성한다(소개·기능·기술 스택·폴더 구조·실행 방법(DB 없이 / Docker)·배운 점·스크린샷은 선택). 최종 점검: 내 `C:\dev\viewer-arena`의 파일 목록을 레퍼런스 목록(이 개요 맨 앞의 표, 50개)과 대조하고, 새 폴더에 저장소를 복제한 것처럼 `npm ci` → `npm run wasm` → `npm run build` → `cargo test --workspace` → clippy·fmt·`npx tsc --noEmit` → 서버 실행까지 한 번에 되는지 확인한다(빌드 결과물이 없어도 다시 만들어지는지). `git status`로 `.env`가 없음을 확인하고 커밋·(선택) GitHub 푸시. 회고(KPT: 유지·문제·시도)와 P3에서 배운 개념 지도(Rust 소유권 → 서버 액터 → WASM 예측 → Docker). 다음 길: 유니티(C#) → 언리얼(C++, 데디케이티드 서버·리플리케이션 — Day 21), Rust 게임 엔진 Bevy, C++ RAII(Day 4·29). 마지막 줄은 졸업 로드맵이 열렸다는 사실과 링크(로드맵 페이지 `#/page/roadmap`이 추가된 뒤 유효 — 작성 시 링크 확인)와, 아직 안 했다면 SP 개요(`#/project/sp`).
- 이미 배운 것: P3 Day 1~44 전부, Markdown README·스크린샷([P1 Day 29](#/day/p1-d29), [P2 Day 40](#/day/p2-d40)), 회고([P1 Day 30](#/day/p1-d30), [P2 Day 40](#/day/p2-d40)), Git 커밋·푸시([P1 Day 7](#/day/p1-d07)).
- 시작 상태: 어제(Day 44) 끝 상태예요. 오늘은 마무리와 점검이에요.
  - (Day 44 끝 상태와 같아요. 다르면 [Day 44](#/day/p3-d44)의 "오늘 끝 상태 전체 코드"로 맞추기)
  - `C:\dev\rust-basics\` 연습 폴더(Day 12까지 사용, 이후 그대로 둠)
  - `C:\dev\arena-bots\bots.mjs`
  - `C:\dev\viewer-arena\.dockerignore`
  - `C:\dev\viewer-arena\.env.example`
  - `C:\dev\viewer-arena\.gitignore`
  - `C:\dev\viewer-arena\Cargo.lock`
  - `C:\dev\viewer-arena\Cargo.toml`
  - `C:\dev\viewer-arena\client\host.html`
  - `C:\dev\viewer-arena\client\index.html`
  - `C:\dev\viewer-arena\client\package-lock.json`
  - `C:\dev\viewer-arena\client\package.json`
  - `C:\dev\viewer-arena\client\play.html`
  - `C:\dev\viewer-arena\client\public\favicon.svg`
  - `C:\dev\viewer-arena\client\src\home.ts`
  - `C:\dev\viewer-arena\client\src\host.ts`
  - `C:\dev\viewer-arena\client\src\input.ts`
  - `C:\dev\viewer-arena\client\src\interp.ts`
  - `C:\dev\viewer-arena\client\src\net.ts`
  - `C:\dev\viewer-arena\client\src\play.ts`
  - `C:\dev\viewer-arena\client\src\protocol.ts`
  - `C:\dev\viewer-arena\client\src\qr.ts`
  - `C:\dev\viewer-arena\client\src\render.ts`
  - `C:\dev\viewer-arena\client\src\style.css`
  - `C:\dev\viewer-arena\client\src\wasm.ts`
  - `C:\dev\viewer-arena\client\tsconfig.json`
  - `C:\dev\viewer-arena\client\vite.config.ts`
  - `C:\dev\viewer-arena\crates\game-core\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-core\src\lib.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\physics.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\protocol.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\rules.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\vec2.rs`
  - `C:\dev\viewer-arena\crates\game-core\src\world.rs`
  - `C:\dev\viewer-arena\crates\game-wasm\Cargo.toml`
  - `C:\dev\viewer-arena\crates\game-wasm\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\Cargo.toml`
  - `C:\dev\viewer-arena\crates\server\migrations\0001_init.sql`
  - `C:\dev\viewer-arena\crates\server\src\app.rs`
  - `C:\dev\viewer-arena\crates\server\src\config.rs`
  - `C:\dev\viewer-arena\crates\server\src\db.rs`
  - `C:\dev\viewer-arena\crates\server\src\error.rs`
  - `C:\dev\viewer-arena\crates\server\src\leaderboard.rs`
  - `C:\dev\viewer-arena\crates\server\src\lib.rs`
  - `C:\dev\viewer-arena\crates\server\src\main.rs`
  - `C:\dev\viewer-arena\crates\server\src\room.rs`
  - `C:\dev\viewer-arena\crates\server\src\rooms.rs`
  - `C:\dev\viewer-arena\crates\server\src\ws.rs`
  - `C:\dev\viewer-arena\crates\server\tests\leaderboard_db.rs`
  - `C:\dev\viewer-arena\crates\server\tests\ws_flow.rs`
  - `C:\dev\viewer-arena\docker-compose.yml`
  - `C:\dev\viewer-arena\Dockerfile`
  - `C:\dev\viewer-arena\README.md`
  - 생성물·개인 파일(커밋하지 않음: 빌드 결과물은 다시 만들 수 있고, `.git`은 Git 기록): `C:\dev\viewer-arena\target\`, `C:\dev\viewer-arena\.git\`, `C:\dev\viewer-arena\client\node_modules\`, `C:\dev\viewer-arena\client\src\wasm\`, `C:\dev\viewer-arena\client\dist\`, `C:\dev\viewer-arena\.env`
  - 도구: VS Code·Git·Node.js(P1·P2에서 설치), Edge 또는 Chrome, Rust 툴체인(rustup·rustc·cargo, `rustc --version` 1.94 이상), Visual Studio C++ 빌드 도구(MSVC 링커·Windows SDK), VS Code 확장 rust-analyzer, Rust 대상 `wasm32-unknown-unknown`(미리 설치), wasm-bindgen-cli 0.2.130(`wasm-bindgen --version`), OBS Studio(P1에서 설치, 오늘 사용), WSL 2(`wsl --version`), Docker Desktop(선택 — 안 되면 Docker 없는 경로, `docker --version`), PostgreSQL 18(Docker 컨테이너 `db` 또는 Windows 직접 설치)
- 오늘 만들/바꿀 파일:
  - 바꿈 `C:\dev\viewer-arena\README.md` — 포트폴리오 완성(소개·기능·스택·구조·실행 방법·배운 점; 스크린샷 파일은 선택) (레퍼런스 `reference/p3-viewer-arena/README.md`)
- 끝 상태 확인: 폴더 대조표의 50개 파일이 모두 있고(README 글 내용·금지어 같은 예시 데이터는 달라도 됨), 처음부터 다시 빌드해도 `cargo test --workspace`가 통과하고 서버가 켜진다. `git status`가 깨끗하다. 회고 글이 README 또는 따로 남아 있다.
- 과제:
  1) 폴더 대조: 빠진 파일·남은 연습 코드(예: 지연 흉내) 찾기(쉬움) → 정답 요지: 개요의 최종 파일표와 같아야 함, `client\src\local`이 없어야 함
  2) README 실행 방법만 보고 친구가 따라 할 수 있는지 검토(보통) → 정답 요지: 준비물·명령·예상 화면이 순서대로 있음
  3) KPT 회고 각 3줄(쉬움) → 정답 요지: 예시 회고
- 용어(사전 담당): 없음(새 용어 없이 앞 Day 용어를 다시 써요)
- 자주 막히는 곳 후보: 새로 받은 폴더에서 `npm run build`가 `TS2307` → `npm run wasm` 먼저(빌드 순서) / `.env`가 커밋에 들어감 → `git status`, `.gitignore` 확인 / README의 이미지 경로를 `\`로 씀 → Markdown은 `/` / `target` 폴더(수 GB)를 압축해 공유하려 함 → `.gitignore` 대상, 지워도 다시 만들어짐
- 레퍼런스 대응: 전체 — 끝 상태가 `reference/p3-viewer-arena`와 같아요(README.md의 글 내용, 금지어 같은 예시 데이터 제외). 학습자 PC에만 있는 것: 연습 폴더 `C:\dev\rust-basics`, `C:\dev\arena-bots`, 개인 설정 `.env`, 빌드 결과물.

