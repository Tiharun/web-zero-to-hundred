# Task 21 report: P3 detailed outline, curriculum entry (_meta.json), P3 glossary

Status: **DONE_WITH_CONCERNS** (concerns are verification limits and cross-project reconciliation items, not failing checks).
Commits: none (NO GIT).

## What was implemented

- `textbook/content/p3/_outline.md` (~250 KB): the outline that parallel Day writers can rely on. It has 7 parts:
  - §0 shared rules: block format, start state = previous end state, what "오늘판/중간 단계" means, the rule for tasks (no task may leave non-reference code in the end state), the cargo/npm run-location rule, the logging/config progression, the pinned versions from external-facts §0.3, the Docker-free path, and where the brief's `:::info` items and required pitfalls go.
  - §1 the big flow. §2 a table of all 50 reference files with their first Day and the Day they reach final form. §3 the evolution of multi-Day files (routes, `AppState`, `new_room`/`create`, `ws.rs`, `room.rs`, `main.rs`, `protocol.rs`, test counts per Day, `net.ts`, `protocol.ts`, `play.ts`, html pages, `style.css` sections, both `Cargo.toml`s, compose, `.gitignore`). §4 the P1/P2 knowledge it assumes, as Day links. §5 the term→Day table.
  - §6 has 45 Day blocks in the exact Task 8 format plus `- 레퍼런스 대응:`. Each 시작 상태 lists every committed file as a full Windows path. Build outputs (`target\`, `node_modules\`, `client\src\wasm\`, `client\dist\`), `.git\` and `.env` are on a separate "생성물" line, and tools are listed cumulatively.
- `textbook/content/p3/_meta.json`: `{ "project": {...}, "pages": [] }`.
  - id `p3`, order 3, track `main`, `requires: ["p2"]`, folder `C:\dev\viewer-arena`.
  - 45 days; titles are verbatim from spec §3.3, `minutes` are 90–120 (total 4910), and each has a one-sentence summary and keywords.
  - curriculum.json was not touched.
- `textbook/content/glossary/p3.md`: 162 terms, each with `### 용어`, `- 처음 등장: [P3 Day N](#/day/p3-dNN)` and a 2–4 sentence 해요체 definition.

How I made it consistent: the three files are generated from one data set with a scratch script (`<scratchpad>/task21/gen.py` + `days_a/b/c.py` + `glossary_defs.py`; none of it is in the repo). Before writing, the script fails if any of these is wrong:
- Day numbers 1–45 or a title that differs from spec §3.3;
- minutes outside 60–120;
- a file changed or deleted before it exists, or created twice;
- the Day 45 end state not equal to the reference file set (all 50 present, nothing extra);
- a term assigned twice, a term without a definition, or a definition without a Day;
- a P3 term that already exists as a heading in `glossary/p1.md` or `glossary/p2.md`, or a "링크만" term missing from those files;
- a placeholder word (TODO and the like).

Because the start state is computed cumulatively, it always equals the previous Day's end state.

### Brief-specific rules and how they are honoured

- Rust basics use the game domain:
  - Days 2–5: player HP, score, nickname, WASD.
  - Day 6: `Vec2` + `Player`. Day 7: `Phase`/`ClientMsg`. Day 8: `NameError`/`validate_name`. Day 9: ranking, duplicate names, best scores. Day 10: `Vec2` operators. Day 12: an `Arc<Mutex>` scoreboard.
  - The practice folder is `C:\dev\rust-basics`. Day 11 creates the real `C:\dev\viewer-arena` workspace and moves `vec2.rs`/`protocol.rs` in.
- Days 13–18 complete the local TS game: `client/` via `npm create vite@9.3.3 … vanilla-ts`, and the TS originals live in `client/src/local/*.ts`. Day 19 ports them to `rules.rs`/`physics.rs`/`world.rs`. Day 20 is game-wasm. Day 26 deletes `local/`.
- `:::info` placements:
  - Unity `Update()`/`Time.deltaTime` → Day 13.
  - Unreal dedicated server/replication → Day 21 (again on Days 28 and 45).
  - C++ RAII → Day 4 (again on Day 29 `Drop`), C++ smart pointers and mutex → Day 12.
- Pitfall placements: VS Build Tools → Day 1 (linker errors again on Day 20), Windows Firewall allow → Day 31 (again on Day 39), WSL 2 errors → Day 33.
- task-21-notes facts:
  - The server runs without `DATABASE_URL`: Days 33, 35, 40.
  - `TEST_DATABASE_URL` silently skips: Day 38, with a task to prove it.
  - `HOST` defaults to 127.0.0.1, so phones need `0.0.0.0` + firewall: Day 31.
  - Prediction is soft correction, and reconciliation is taught as a concept: Day 28.
  - The `day` leaderboard is a rolling 24 h window: Day 36.
  - Safety, all on Day 32: 1 KB, 30 frames/s including binary, write deadline (`write`+`timeout_at`), 1–12 chars, the deny-list (U+3164 etc.) vs allow-list trade-off, duplicate names, banned words. The 10 s idle timeout is on Day 26.
  - One-way module deps with `Phase` in protocol.rs: Day 11.
  - dotenvy (not cargo) reads `.env`: Day 37.
  - Docker cache only helps when inputs are unchanged: Day 40.
  - The sqlx TLS feature is explained as optional only: Days 35, 41, 42. The reference has no TLS.
  - The host page reconnects every 3 s, and a server restart means a new OBS URL: Days 30, 43.
  - Spec §3.3 structure is kept.
- Docker Days 33, 34 and 40 always carry the Docker-free path. Day 33 starts with the `winver`/edition check and never claims Home is supported.

### Design decisions (writers depend on these; reviewer please check)

1. A practice folder is used for Days 1–12. Day 39's load-test bots go in `C:\dev\arena-bots\bots.mjs` (Node 22+ global `WebSocket`/`fetch`, no deps), outside the reference, because the reference has no bot program.
2. Interim API shapes are fixed per Day (outline §3). For example `AppState` goes `{visits}` → `{room}` → `{room, idle_timeout}` → `{rooms, idle_timeout}` → `{rooms, db, idle_timeout}`. Routes go `/ws` → `/ws/{code}` → `?role=`, and `connect(handlers)` → `connect(room, handlers)` → `connect(room, role, handlers)`.
3. `ErrorCode` (all 6 variants) and `ServerMsg` are defined in full on Day 24 so the reference test `server_msg_json_shape` can be used as-is. Each variant gets a one-line note saying which Day first uses it.
4. Minimal input sending is on Day 26. Without it, nothing moves on Day 27 and interpolation can't be seen. Day 28 completes input sending (seq, 1 s resend, `round2`) and adds prediction. This shifts spec §3.3 slightly (Day 28 "입력 전송").
5. Logging is `println!` until Day 37 (spec: tracing on Day 37). Config is hard-coded → Day 31 `HOST` only → Day 35 `DATABASE_URL` → Day 37 `config.rs`.
6. Day 25 makes the server loop visible by forwarding snapshots to any `/ws` connection (seen in the DevTools console). That watcher becomes `host_session` on Day 30.
7. README.md is the learner's own text, written on Days 43–45. Day 33 and Day 42 change no project files. Day 21 adds a `?lag=` experiment that is removed on Day 26.
8. Tasks never leave non-reference code: they are write-this-planned-code, observe-only, or experiment-then-revert. The one exception is adding a banned word on Day 32, which is example data.

## Verification

- Generator self-checks: `python3 -I gen.py /home/user/web-zero-to-hundred` → `완료: Day 45개, 용어 162개, 레퍼런스 파일 50개 모두 등장`.
- Outline-rules item 6 (scratch merge):
  - Setup: `cp -r textbook/content <scratch>/content`. Into the scratch `curriculum.json` I merged the real on-disk `p1/_meta.json` (30 days + start/help pages), `p2/_meta.json` (40 days) and my `p3/_meta.json`. The scratch `glossary/` holds the current `p1.md` (170 terms), `p2.md` (214) and `p3.md` (162).
  - Command: `node textbook/build.mjs --check --allow-missing --content <scratch>/content` → `검사 통과: Day 115개, 페이지 4개, 결과 크기 0.72 MB`, exit 0. The only warnings are the expected missing-Day-file ones.
  - Nothing merged was written into the repo.
- The P2 Day titles in the real `p2/_meta.json` match spec §3.2, so the P2 Day links are consistent.

## Files changed (the controller commits exactly these)

```
textbook/content/p3/_outline.md
textbook/content/p3/_meta.json
textbook/content/glossary/p3.md
```

## Glossary: every term → owning Day (162)

Terms that P1/P2 already own are linked with `[[…]]`, never redefined. Per the controller's R37 follow-up I checked against the on-disk `p1.md` and the `p2.md` that has since appeared. I removed 4 overlapping P3 terms that P2 owns: 패턴 매칭 (P2 D13), 열거형 (P2 D10), 직렬화 (P2 D17), 리버스 프록시 (P2 D39). Days 3, 7, 11 and 41 now have a "링크만 거는 기존 용어" line. I do not define 포트, localhost, 출처, 상태 코드 or Promise. They are in `p2.md` (D7, D7, D27, D16, D8), and the outline tells writers to link them.

- Day 1: Rust, rustup, Cargo, 링커, MSVC 빌드 도구, rust-analyzer, 매크로
- Day 2: 불변, 섀도잉, 표현식
- Day 3: (없음)  — 링크만: 패턴 매칭
- Day 4: 소유권, 스택, 힙, 소유권 이동, 가비지 컬렉션, RAII
- Day 5: 빌림, 참조, 가변 참조, 빌림 검사기, 슬라이스, 문자열 슬라이스
- Day 6: 구조체, impl 블록, 연관 함수, 2차원 벡터
- Day 7: Option  — 링크만: 열거형
- Day 8: Result, ? 연산자, panic
- Day 9: Vec, HashMap, 반복자, 클로저
- Day 10: 트레이트, derive, 연산자 오버로딩, 트레이트 경계
- Day 11: 크레이트, 워크스페이스, pub, serde, 역직렬화  — 링크만: 직렬화, 모듈, 단위 테스트
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
- Day 41: 도메인 이름, DNS, TLS, WSS  — 링크만: 리버스 프록시, HTTPS
- Day 42: 관리형 데이터베이스, 콜드 스타트
- Day 43: 방송 리허설
- Day 44: 채팅 명령어, 수평 확장

## P1/P2 concepts P3 assumes, and the Day assumed to teach them

Source: spec §3.1/§3.2, cross-checked against the on-disk `glossary/p1.md`/`p2.md` "처음 등장" lines and the real `p1/_meta.json`/`p2/_meta.json` titles.

- P1:
  - D2 VS Code/extensions; D7 Git·GitHub·commit·push·.gitignore; D8 forms; D10 box model; D13 responsive·viewport·device mode; D14 transform·deploy.
  - D15–D21 JS basics: console, conditionals, template literals, loops, arrays, functions/arrow functions, objects/array methods, DOM, events.
  - D24 form validation·preventDefault; D25 JSON·fetch·async/await·try/catch·Network tab; D26 Date·setInterval/setTimeout·padStart; D27 OBS browser source·transparent overlay·URLSearchParams; D29 README; D30 retrospective.
- P2, part 1 (tooling, TypeScript, C#):
  - D1 full stack, request/response, API; D2 terminal, PowerShell, cd/dir/mkdir, paths; D3 Node, npm, package.json, execution policy, **환경 변수, PATH**.
  - D4 TypeScript, tsc, **컴파일 (term)**; D5 interface/union/literal; D6 function types, generics, modules; D7 Vite, dev server, build, **localhost, 포트**; D8 Promise, async/await, typed fetch.
  - D9 .NET and compiled languages; D10 C# syntax, switch, **열거형**; D11 methods, List/Dictionary, nullable; D12 classes, constructors, record; D13 interfaces, polymorphism, **패턴 매칭**; D14 LINQ, lambdas; D15 exceptions, Task, async.
- P2, part 2 (web API, database, deployment):
  - D16 HTTP, **HTTPS**, REST, status codes, JSON, .http; D17 Minimal API, routes, **직렬화**; D18 CRUD, route params.
  - D19 SQL basics; D20 migrations, connection strings; D21 async DB queries; D22 foreign keys, JOIN; D23 DTO, validation, DI; D24 config, environments, log levels, ProblemDetails; D25 hashing and secrets.
  - D27 CORS, 출처, Vite proxy; D29 UTC vs KST; D30 pagination, query params; D33 polling, SSE, overlay; D34 XSS, CSRF, SQL injection, 요청 제한, HTTPS.
  - D35 unit tests; D36 integration tests, `tsc --noEmit`; D37 formatter, branches, PR; D38 production build, static files (wwwroot), npm ci; D39 deployment, **리버스 프록시**; D40 README, screenshots, retrospective.

Corrections I made after `p2.md` appeared: 환경 변수 is P2 D3 (my spec guess was D24), 포트 is P2 D7 (guess D17), HTTPS is P2 D16 (I also keep the D34 link), 컴파일 is P2 D4 (I also keep the D9 link).

## Concerns / items for the controller and reviewer

1. **Cross-project reconciliation (R37).**
   - P3 owns some terms that P1/P2 might arguably have defined. None are headings on disk now: 가비지 컬렉션 (P3 D4), 스레드 (D12), 클로저 (D9), 린터 (D38), 트랜잭션 (D35), 도메인 이름 (D41), DNS (D41), TLS (D41), 데이터베이스 인덱스 (D36), 역직렬화 (D11). `p2.md` only mentions 역직렬화 inside its 직렬화 definition.
   - SP (later task) also teaches Docker, PostgreSQL and WebSocket (SP D7, D15). P3 owns those terms, so the SP outline must link rather than define them.
2. **Day 45 last-line link `#/page/roadmap`.** That page doesn't exist in curriculum yet (owned by the roadmap task). The outline tells the Day 45 writer to check the link at writing time.
3. **Unverified items.** Writers must verify these or mark them "미확인".
   - From T20 / Windows-only:
     - VS Build Tools installer wording;
     - Windows Firewall prompt and menu wording, and the "앱 허용" path on Day 31;
     - npm `wasm` script (`&&`, `../target`) under cmd.exe;
     - native PG18 `psql.exe` path;
     - WSL error texts (0x80370102 etc.);
     - Docker Desktop wording.
   - Error texts the outline cites from memory that writers must reproduce before printing: the axum 0.8 `/:code` panic text, the sqlx type-mismatch text, the Chrome mixed-content message, the WebSocket close code when the 1 KB limit is hit, the PG18 wrong-volume error.
   - Day 42 hosting facts that are unconfirmed in external-facts §13: Render card requirement, free-tier build time, WebSocket support and idle disconnect, PORT handling.
   - Node global `WebSocket` (Day 39): I confirmed only that it is a function in the sandbox's Node 22.23.4.
   - Whether a Korean or OneDrive user profile breaks rustup: flagged as a candidate only.
4. **Size.** Day blocks are long. Days 19, 24, 25, 26, 29, 30 and 32 are dense at 120 min, because spec §3.3 fixes the scope and the reference code is big. Writers may need to lean on "copy then explain". If a writer finds one over 120 min, splitting needs the controller, since Day ids would shift.
5. **`cargo new` inside a workspace** may rewrite `members` automatically (Days 11, 20, 22). The outline tells writers to confirm the real output and compare with the stated final contents.
6. The generator scripts live only in my scratchpad. If the outline needs edits after review, I will edit the data and regenerate so the start states stay consistent.

## Self-review

- Checked: every Day block has all 10 lines. Start states are full paths. Every reference file appears, and the 50-file table matches. No forward use was found in a manual pass of the "이미 배운 것" lines against the goals (examples: Day 6 introduces derive with a one-line note pointing to Day 10; `'static` is a one-liner on Days 7–8 and explained on Day 12; `Set`, `Math.hypot`, `std::env::var` and regex get one-line notes where first used). Glossary entries contain no `**` and use only existing `[[…]]` targets (직렬화).
- Fixed during review:
  - an awkward `find_player<'a>` phrase on Day 7;
  - start-state lists, which are now sorted;
  - the label for `.git`/`.env` in the 생성물 line;
  - the 4 duplicate terms;
  - the P2 Day links above.
