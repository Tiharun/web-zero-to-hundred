# Viewer Arena — 시청자 참여 실시간 게임 (P3 완성 코드)

방송 화면(OBS)에 아레나가 뜨고, 시청자가 휴대폰으로 QR 코드를 찍어 들어와 조이스틱으로 움직이는 멀티플레이 웹게임이에요.
교재 P3(45 Day)의 정답 코드이며, 학습자 작업 폴더 `C:\dev\viewer-arena`와 같은 구조예요.

> 작성 기준일 2026-11. 버전은 바뀔 수 있으니 아래 `--version` 명령으로 확인하세요.

```text
 휴대폰(play.html) ──WebSocket──┐                     ┌── OBS(host.html, 투명 배경)
 휴대폰(play.html) ──WebSocket──┤   Rust 서버(Axum)   ├── 스냅샷 10Hz
                                └─▶ 방 = 액터(20Hz) ──┘
                                        │
                                   PostgreSQL(랭킹, 없어도 됨)
```

- **권위 서버**: 게임 계산은 서버만 해요. 휴대폰은 "어느 방향으로 가고 싶다"만 보내요.
- **같은 Rust 코드를 두 번 써요**: `game-core`가 서버에서 돌고, WebAssembly로 컴파일되어 휴대폰에서도 돌아요(클라이언트 예측).

## 폴더 구조

```text
C:\dev\viewer-arena
├─ Cargo.toml            워크스페이스(크레이트 3개, 버전 고정)
├─ Cargo.lock            의존성 잠금 파일(커밋해요)
├─ crates
│  ├─ game-core          게임 규칙. IO 없음 → 서버·WASM이 같이 씀
│  │  └─ src  vec2.rs(벡터) physics.rs(이동·충돌) world.rs(세계·라운드) rules.rs(상수) protocol.rs(메시지)
│  ├─ server             Axum + Tokio 서버
│  │  ├─ src  main.rs config.rs app.rs ws.rs room.rs rooms.rs db.rs leaderboard.rs error.rs lib.rs
│  │  ├─ migrations      0001_init.sql (서버가 시작할 때 자동 실행)
│  │  └─ tests           ws_flow.rs(봇 클라이언트 통합 테스트) leaderboard_db.rs(DB 테스트)
│  └─ game-wasm          game-core의 이동 예측을 브라우저에 내보냄(wasm-bindgen)
├─ client                Vite + TypeScript
│  ├─ index.html         방 만들기·참가
│  ├─ host.html          OBS 관전 화면(투명 배경)
│  ├─ play.html          휴대폰 컨트롤러
│  └─ src  net.ts render.ts input.ts interp.ts wasm.ts qr.ts protocol.ts home.ts host.ts play.ts style.css
├─ Dockerfile            멀티스테이지(wasm → client → server → 실행 이미지)
├─ docker-compose.yml    서버 + PostgreSQL 18
└─ .env.example          설정 예시(.env로 복사해서 사용)
```

## 준비물 (Windows 11)

| 도구 | 확인 명령(PowerShell) | 기준 |
| :-- | :-- | :-- |
| Rust | `rustc --version` | **1.94 이상**(sqlx 0.9 요구). 작성 시점 최신 1.99.1 |
| wasm32 대상 | `rustup target list --installed` | 목록에 `wasm32-unknown-unknown` |
| wasm-bindgen CLI | `wasm-bindgen --version` | **0.2.130**(Cargo.toml의 wasm-bindgen과 같아야 함) |
| Node.js | `node --version` | 22.12 이상(권장: LTS 26) |
| Docker Desktop | `docker --version` | 선택(랭킹·배포 Day부터) |

### 1) Rust 설치

1. https://rustup.rs 에서 `rustup-init.exe`를 받아 실행해요.
2. **Visual Studio C++ 빌드 도구가 없으면** 먼저 `Rust Visual C++ prerequisites` 안내가 나와요. **`1) Quick install via the Visual Studio Community installer`** 를 고르면 필요한 C++ 도구(MSVC 링커, Windows SDK)를 설치해 줘요. 개인·학습용은 무료예요. 이걸 건너뛰면 나중에 ``linker `link.exe` not found`` 오류가 나요.
3. 그다음 기본 설치(엔터)를 진행하고, **새 PowerShell 창**에서 `rustc --version`, `cargo --version`을 확인해요.

### 2) WebAssembly 도구

```powershell
rustup target add wasm32-unknown-unknown
rustup target list --installed
cargo install wasm-bindgen-cli --version 0.2.130 --locked
wasm-bindgen --version
```

- `wasm32-unknown-unknown`은 Rust 기본 설치에 들어 있지 않아요. 꼭 한 번 추가해야 해요.
- `wasm-bindgen-cli`는 컴파일하느라 몇 분 걸려요. 버전은 `Cargo.toml`의 `wasm-bindgen = "=0.2.130"`과 **정확히 같아야** 해요.
- 이 교재는 wasm-pack을 쓰지 않아요(유지보수자가 1명이고 wasm-bindgen 팀의 권장 여부가 정해지지 않아서). `cargo` + `wasm-bindgen` 두 명령으로 충분해요.

## 처음 실행하기 (DB 없이)

```powershell
cd C:\dev\viewer-arena\client
npm ci
npm run wasm
npm run build
cd C:\dev\viewer-arena
cargo run -p server --release
```

- `npm run wasm` = `cargo build -p game-wasm --target wasm32-unknown-unknown --release` + `wasm-bindgen --target web --out-dir src/wasm …`. 결과(`client/src/wasm/`)는 빌드 결과물이라 커밋하지 않아요.
- 서버 로그에 `DATABASE_URL이 없어서 랭킹을 꺼요`가 보이면 정상이에요. 랭킹만 꺼지고 게임은 다 돼요.
- 브라우저에서 http://127.0.0.1:8080 → **방 만들기** → 나오는 두 링크를 각각 새 탭으로 열면 PC 혼자서도 시험할 수 있어요(`play.html`은 키보드 WASD·방향키로 움직여요).

## 휴대폰으로 참가하기 (같은 Wi-Fi)

1. 서버를 모든 네트워크 카드에서 듣게 켜요. 기본값 `127.0.0.1`은 이 PC에서만 들어올 수 있어요.

   ```powershell
   cd C:\dev\viewer-arena
   $env:HOST="0.0.0.0"
   cargo run -p server --release
   ```

   `$env:`로 넣은 값은 그 PowerShell 창에서만 유지돼요. 매번 쓰기 귀찮으면 `.env.example`을 `.env`로 복사하고 `HOST=0.0.0.0`으로 바꿔요(서버가 시작할 때 `dotenvy` 크레이트로 `.env`를 읽어요).
2. **Windows 방화벽**: 서버를 `0.0.0.0`으로 처음 켜면 Windows Defender 방화벽이 `server.exe`의 네트워크 접근을 물어보는 창을 띄워요. **개인 네트워크**에 체크하고 허용해요. `cargo run`(debug)과 `--release`는 실행 파일 경로가 달라서 각각 한 번씩 물어볼 수 있어요. 집 Wi-Fi가 "공용 네트워크"로 잡혀 있으면 휴대폰이 못 들어오니, Windows 설정에서 그 Wi-Fi의 네트워크 프로필을 **개인**으로 바꿔요. (창의 문구와 메뉴 위치는 Windows 버전에 따라 다를 수 있어요.)
3. 서버 로그의 `같은 Wi-Fi의 휴대폰에서는: http://192.168.x.x:8080`을 확인해요(`ipconfig`의 IPv4 주소와 같아요).
4. **PC 브라우저도 그 주소로** 열어서 방을 만들어요. QR 코드는 지금 페이지 주소로 만들어지기 때문에, `127.0.0.1`로 열면 휴대폰이 그 주소로 갈 수 없어요(페이지에 경고가 떠요).
5. 그래도 안 되면: 휴대폰이 같은 Wi-Fi인지, 게스트 Wi-Fi(기기끼리 통신을 막음)가 아닌지 확인해요.

`0.0.0.0`은 공유기 안쪽(같은 Wi-Fi)에만 열려요. 공유기 포트 포워딩으로 인터넷에 직접 열지 마세요(배포는 Day 41~42).

## OBS에 띄우기

1. OBS **소스 목록**의 **+** → **브라우저**
2. **URL**: `http://192.168.x.x:8080/host.html?room=ABCD`(방 만들기에서 나온 "OBS 브라우저 소스 주소")
3. **너비** 1920, **높이** 1080
4. 배경은 투명이에요. `host.html`이 `html`과 `body`의 배경을 `transparent`로 지정해 두었어요.
5. 서버와 연결이 끊기면 관전 화면이 3초마다 스스로 다시 연결해요. 단, 서버를 껐다 켜면 방이 사라지니(방은 메모리에만 있어요) 새 방을 만들고 OBS의 URL을 바꿔요.

## 랭킹 켜기 (PostgreSQL)

### Docker로 DB만 띄우기 (권장)

```powershell
cd C:\dev\viewer-arena
docker compose up -d db
$env:DATABASE_URL="postgres://arena:arena@127.0.0.1:5432/viewer_arena"
cargo run -p server --release
```

- 서버가 시작할 때 `crates/server/migrations/0001_init.sql`을 한 번만 실행해요(기록은 `_sqlx_migrations` 표).
- DB 들여다보기: `docker compose exec db psql -U arena -d viewer_arena` → `\dt`, `SELECT * FROM matches;`
- PostgreSQL 18 이미지는 데이터 위치가 `/var/lib/postgresql`이에요(17 이하의 `/var/lib/postgresql/data`가 아니에요). `docker-compose.yml`도 그렇게 마운트해요.
- 이 서버는 TLS 없이 DB에 붙어요(같은 PC·같은 Docker 네트워크라서 괜찮아요). 클라우드의 관리형 PostgreSQL처럼 TLS(`sslmode=require`)를 요구하는 DB에 붙으려면 `Cargo.toml`의 sqlx 기능에 TLS(예: `tls-rustls`)를 더해야 해요(Day 41~42).

### Docker 없이 (PostgreSQL 18 직접 설치)

관리자 PowerShell에서 `winget install PostgreSQL.PostgreSQL.18`(설치 중 슈퍼유저 비밀번호와 포트 5432를 정해요). 설치 프로그램은 PATH를 바꾸지 않으니 `psql`은 전체 경로로 실행해요(경로는 설치 위치에 따라 달라요).

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -p 5432
```

```sql
CREATE USER arena WITH PASSWORD 'arena';
CREATE DATABASE viewer_arena OWNER arena;
```

그다음은 위와 같이 `DATABASE_URL`을 넣고 `cargo run`이에요.

## Docker로 전부 실행하기

```powershell
cd C:\dev\viewer-arena
docker compose up --build -d
docker compose logs -f server
```

- http://localhost:8080. 첫 빌드는 Rust 컴파일과 `wasm-bindgen-cli` 설치 때문에 오래 걸려요. 다음 빌드에서는 **바뀌지 않은 단계만** 캐시에서 다시 써요(예: `wasm-bindgen-cli` 설치, `package*.json`이 그대로면 `npm ci`). Rust 소스를 고치면 서버는 의존성까지 처음부터 다시 컴파일해요.
- 끄기: `docker compose down` / DB 데이터까지 지우기: `docker compose down -v`
- 포트가 겹치면 `.env`에 `SERVER_PORT=18080`, `DB_PORT=55432`처럼 바꿔요.
- 컨테이너 안의 서버 로그에 찍히는 `같은 Wi-Fi의 휴대폰에서는: http://172.x.x.x:8080`은 컨테이너 내부 주소라서 쓰지 않아요. 휴대폰은 `ipconfig`로 본 PC 주소(예: `http://192.168.0.10:8080`)로 들어와요.

## 개발 모드 (저장하면 바로 반영)

```powershell
# 창 1
cd C:\dev\viewer-arena
cargo run -p server
# 창 2
cd C:\dev\viewer-arena\client
npm run dev
```

http://localhost:5173 으로 열어요. Vite 개발 서버가 `/api`와 `/ws`를 8080 서버로 넘겨 줘요(`vite.config.ts`의 `proxy`). `game-core`나 `game-wasm`을 고쳤으면 `npm run wasm`을 다시 실행해요.

## 테스트와 검사

```powershell
cd C:\dev\viewer-arena
cargo test --workspace
cargo clippy --workspace --all-targets -- -D warnings
cargo fmt --all --check
cd client
npx tsc --noEmit
```

- DB 테스트는 `TEST_DATABASE_URL`이 있을 때만 돌아요(없으면 건너뜀):
  `$env:TEST_DATABASE_URL="postgres://arena:arena@127.0.0.1:5432/viewer_arena_test"` → `cargo test -p server --test leaderboard_db`
  (먼저 `CREATE DATABASE viewer_arena_test OWNER arena;`)
- 브라우저 e2e(교재 저장소): `node --test tests/reference/p3.e2e.test.mjs` — 빌드된 서버를 띄우고 관전 화면 1개 + 휴대폰 화면 2개로 참가·조작을 확인해요.

## 설정 (환경 변수)

| 이름 | 기본값 | 뜻 |
| :-- | :-- | :-- |
| `HOST` | `127.0.0.1` | 듣는 주소. 휴대폰 참가는 `0.0.0.0` |
| `PORT` | `8080` | 포트 |
| `DATABASE_URL` | (없음) | PostgreSQL 주소. 없으면 랭킹 꺼짐 |
| `STATIC_DIR` | `client/dist` | 빌드된 클라이언트 폴더 |
| `RUST_LOG` | `info` | 로그 자세함(`debug`, `trace` …) |
| `TEST_DATABASE_URL` | (없음) | DB 테스트용 주소 |
| `SERVER_PORT`, `DB_PORT` | `8080`, `5432` | docker compose가 PC 쪽에 여는 포트 |

## 게임 규칙 (`crates/game-core/src/rules.rs`)

| 항목 | 값 |
| :-- | :-- |
| 틱 / 스냅샷 | 20Hz / 10Hz |
| 대기 → 라운드 → 결과 | 15초 → 120초 → 10초 (플레이어가 1명 이상일 때 대기 시간이 줄어요) |
| 방 최대 인원 | 50명 |
| 아레나 / 플레이어 반지름 | 600 / 20 |
| 최고 속도 | 300(서버가 강제) |

같은 시드와 같은 입력이면 결과가 항상 같아요(`World::step`, 시드 기반 난수 `StdRng`).

## 안전장치 (Day 32)

- 메시지 하나 최대 **1KB**(넘으면 연결을 끊어요)
- 1초에 메시지 최대 **30개**(글자·바이너리를 모두 세요. 넘친 것은 버리고, 1초마다 한 번씩만 `rate_limited` 오류로 알려요)
- 10초 동안 아무 메시지도 없는 연결은 끊긴 것으로 보고 정리해요(화면이 꺼진 휴대폰이 유령 플레이어로 남지 않게). 브라우저는 2초마다 `ping`을, 1초마다 지금 입력을 다시 보내요
- 닉네임 1~12자, 제어 문자·보이지 않거나 빈칸처럼 보이는 유니코드 글자(폭 없는 공백, 방향 제어, 한글 채움 문자 `U+3164` 같은 "빈 닉네임" 글자 등)·금지어 거절(`protocol.rs`의 `validate_name`, `BANNED_WORDS`), 같은 방에서 같은 닉네임 거절(`name_taken`)
- 입력 방향은 길이 1로 줄이고, 속도는 서버가 제한해요(클라이언트 값을 믿지 않아요)
- 방 코드는 영문 대문자 4자, 서버 하나에 방 최대 100개, 연결이 없는 방은 60초 뒤 정리

## 프로토콜 요약 (`PROTOCOL_VERSION = 1`)

| HTTP | 응답 |
| :-- | :-- |
| `POST /api/rooms` | `201 {"code":"ABCD"}` |
| `GET /api/rooms/{code}` | `{"code","players","phase"}` / 없으면 `404 {"code":"room_not_found",…}` |
| `GET /api/leaderboard?period=day\|all` | `{"enabled","period","entries":[{"name","score"}]}`: 닉네임별 최고 점수 상위 10명. `day` = **최근 24시간**(달력의 오늘이 아님), `all` = 전체, 생략하면 `day`. DB 없으면 `enabled:false` |
| `GET /ws/{code}?role=host\|player` | WebSocket |
| `GET /healthz` | `ok` |

WebSocket 메시지는 JSON이고 `t`가 종류예요.

- 보내는 것: `{"t":"join","name":"철수"}`, `{"t":"input","seq":1,"dx":1,"dy":0}`, `{"t":"ping","ts":123.4}`
- 받는 것: `welcome{id,room,protocol}`(관전 화면은 `id` 0), `snapshot{tick,phase,timeLeft,players[{id,name,x,y,vx,vy,score,color}],items[{id,x,y}]}`, `result{ranking[{name,score}]}`, `error{code,message}`, `pong{ts}`

## 자주 막히는 곳

| 증상 | 해결 |
| :-- | :-- |
| ``linker `link.exe` not found`` | VS C++ 빌드 도구가 없어요. `rustup-init.exe`를 다시 실행해 1번(Quick install)을 고르거나 Visual Studio Installer에서 "C++를 사용한 데스크톱 개발"을 설치해요 |
| ``error[E0463]: can't find crate for `core` `` + ``the `wasm32-unknown-unknown` target may not be installed`` | `rustup target add wasm32-unknown-unknown` |
| `it looks like the Rust project used to create this Wasm file was linked against version of wasm-bindgen that uses a different bindgen format than this binary` | CLI와 크레이트 버전이 달라요. `cargo install -f wasm-bindgen-cli --version 0.2.130 --locked` |
| `npx tsc`/`npm run build`에서 `error TS2307: Cannot find module './wasm/game_wasm.js'` | `npm run wasm`을 먼저 실행해요 |
| 서버 로그 `client/dist에 index.html이 없어요` / 브라우저가 404 | `client`에서 `npm run build`, 또는 `STATIC_DIR` 확인 |
| `…에서 연결을 기다리지 못했어요(…)` | 포트를 다른 프로그램이 쓰고 있어요. `$env:PORT="8081"` |
| `PostgreSQL에 연결하지 못했어요(pool timed out …)` | DB가 꺼져 있거나 `DATABASE_URL`이 틀렸어요. `docker compose ps`로 db 확인. DB 없이 하려면 `DATABASE_URL`을 지워요 |
| 휴대폰에서 페이지가 안 열림 | `HOST=0.0.0.0`, 방화벽 허용(개인 네트워크), 같은 Wi-Fi, PC 주소로 연 페이지의 QR인지 확인 |
| 닉네임을 넣었는데 `쓸 수 없는 닉네임이에요.` | 금지어가 들어 있어요(공백·대소문자를 무시하고 검사해요) |
| `이미 같은 닉네임이 있어요.` | 같은 방에 같은 닉네임이 있어요. 방금 끊긴 내 연결이면 10초쯤 뒤 정리되니 잠시 뒤 다시 참가해요 |

## Day별 지도 (교재 작성용)

| Day | 주제 | 주로 보는 파일 |
| :-- | :-- | :-- |
| 6·10 | 구조체·연산자 오버로딩 | `game-core/src/vec2.rs` |
| 7·24 | enum·serde 메시지 | `game-core/src/protocol.rs`, `client/src/protocol.ts` |
| 8 | 오류 처리 | `server/src/error.rs`, `server/src/main.rs`(`run`) |
| 11·19 | 워크스페이스·모듈(한 방향 의존)·game-core·테스트 | `Cargo.toml`, `game-core/src/lib.rs`, `game-core/src/*.rs`의 `#[cfg(test)]` |
| 13~15 | 게임 루프·Canvas·입력 | `client/src/render.ts`, `client/src/input.ts`, `client/src/play.ts`(`frame`) |
| 16~18 | 이동·충돌·규칙 | `game-core/src/physics.rs`, `world.rs`, `rules.rs` |
| 20·28 | WASM·예측 | `game-wasm/src/lib.rs`, `client/src/wasm.ts`, `client/src/play.ts`(`correct`) |
| 22·23 | Axum·WebSocket | `server/src/app.rs`, `server/src/ws.rs` |
| 25·26·29 | 액터·입퇴장·끊김·방 | `server/src/room.rs`, `server/src/rooms.rs`(`RemoveOnDrop`), `server/src/ws.rs`(무응답 정리 `IDLE_TIMEOUT`) |
| 27 | 스냅샷·보간 | `client/src/interp.ts` |
| 30·31 | 호스트·컨트롤러 화면 | `client/host.html`·`src/host.ts`·`src/qr.ts`, `client/play.html` |
| 32 | 안전 | `server/src/ws.rs`(`RateLimiter`), `protocol.rs`(`validate_name`) |
| 34~36 | PostgreSQL·SQLx·랭킹 | `docker-compose.yml`, `server/migrations/0001_init.sql`, `server/src/db.rs`, `leaderboard.rs` |
| 37 | 설정·로깅·종료 | `server/src/config.rs`, `server/src/main.rs`(`shutdown_signal`) |
| 38 | 통합 테스트 | `server/tests/ws_flow.rs`, `server/tests/leaderboard_db.rs` |
| 40 | Docker | `Dockerfile`, `docker-compose.yml`, `.dockerignore` |
