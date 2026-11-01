# 이미지 후원 서비스 (SP 레퍼런스)

스트리머가 가입하면 **공개 후원 페이지**와 **비밀 OBS 오버레이 주소**가 생기고, 시청자는 이미지·닉네임·메시지를 보내고,
스트리머가 검수해서 승인한 이미지만 SignalR로 방송 화면(OBS 브라우저 소스)에 나타나는 서비스예요.
SP(특별 프로젝트) 40일 교재의 정답 코드입니다. 작성 기준일 2026-11.

## 돈은 다루지 않아요

- 이 서비스는 결제·정산을 **전혀** 하지 않아요.
- **무료 모드(Free)**: 이미지와 메시지만 오가요.
- **치즈 모드(Cheese)**: 시청자가 이미지를 보내면 `#AB12` 같은 **후원 코드**를 받고, 치지직 공식 "치즈 후원" 메시지에 그 코드를 넣어요.
  서버는 치지직 세션 이벤트(DONATION)에서 코드를 찾아(30분 안, 최소 치즈 이상) 확인만 해요. 돈은 치지직이 스트리머에게 직접 정산해요.
- **테스트 모드**: 대시보드의 "가짜 치즈 후원 보내기"가 치지직과 똑같은 모양의 이벤트를 만들어요. 치지직 앱 승인 없이 전체 흐름을 연습할 수 있어요.

## 구성

```
React(Vite) ──HTTP──▶ ASP.NET Core API ──EF Core(Npgsql)──▶ PostgreSQL
   │  ▲                  │   │  └─ 이미지 저장소(로컬 폴더 media, 7일 보관)
   │  └──SignalR─────────┘   └─ 치지직 Open API(OAuth·세션 소켓 Socket.IO 2.x) / 테스트 모드
overlay.html(OBS) ◀──SignalR(토큰)──┘
```

| 폴더 | 내용 |
| :-- | :-- |
| `server/ImageDonation.Api` | API, SignalR 허브, 이미지 처리, 치지직 연동, EF Core 마이그레이션 |
| `server/ImageDonation.Tests` | xUnit 단위·통합 테스트 (WebApplicationFactory + PostgreSQL) |
| `client` | React + React Router(Declarative 모드). 화면 `/d/:slug`, `/dashboard`, `/settings`, `/onboarding`, `/login`, 별도 페이지 `overlay.html` |
| `tools/chzzk-emulator` | 치지직 세션 소켓을 흉내 내는 로컬 Socket.IO 2.5.0 서버 (테스트용, 실제 치지직이 아님) |
| `Dockerfile`, `docker-compose.yml`, `.env.example` | Docker로 API + PostgreSQL 18 실행 |

### 후원 상태

```
무료:  Pending ──승인──▶ Approved ──오버레이 표시 끝──▶ Shown
         └──거절──▶ Rejected
치즈:  AwaitingCheese ──코드 확인──▶ Pending(자동 승인이면 Approved) …
         └──30분 지남──▶ Expired
```

상태는 `WHERE "Status" = '지금 상태'` 조건을 붙인 UPDATE 한 번으로 바꿔서, 같은 후원을 두 번 승인하거나 두 번 매칭할 수 없어요.

### 주요 API

| 메서드·경로 | 설명 |
| :-- | :-- |
| `GET /api/public/streamers/{slug}` | 후원 페이지 정보 |
| `POST /api/public/streamers/{slug}/donations` | multipart: `image`, `nickname`(≤20), `message`(≤100) → `{id, status, code?}`. IP당 요청 제한 |
| `GET /media/{file}` | 처리된 이미지(`GUID.webp`) |
| `GET /api/dashboard/donations?status=` | 내 후원 목록 (로그인 필요) |
| `POST /api/dashboard/donations/{id}/approve` · `/reject` · `/block` | 승인 · 거절 · 보낸 사람 차단 |
| `POST /api/dashboard/overlay/clear` | 긴급 정지 |
| `GET`·`PUT /api/dashboard/settings` | 설정 (`Mode`, `MinCheese`, `AutoApprove`, `DisplaySeconds` 3~30, `MinIntervalSeconds`, `MaxFileMb` ≤10, `BannedWords`) |
| `GET /api/dashboard/overlay-token` · `POST /api/dashboard/overlay-token/rotate` | 오버레이 토큰 보기 · 재발급 |
| `POST /api/dashboard/test-donation` | 테스트 모드: 가짜 치즈 후원 이벤트 |
| `/api/auth/register`, `/api/auth/login?useCookies=true`, `/api/auth/logout`, `/api/auth/me`, `/api/auth/onboarding` | 개발용 로컬 로그인(Identity)과 온보딩 |
| `/api/chzzk/login`, `/api/chzzk/callback` | 치지직 로그인 (OAuth 2.0 인가 코드) |
| SignalR `/hubs/overlay?token=` | 서버→오버레이 `ShowDonation(dto)`, `Clear()` / 오버레이→서버 `MarkShown(id)` |
| SignalR `/hubs/dashboard` | 로그인 필요. 서버→대시보드 `DonationCreated(dto)`, `DonationUpdated(dto)` |
| `GET /healthz` | 상태 확인 |

## 준비물 (작성 기준일 2026-11)

| 도구 | 버전 | 확인 |
| :-- | :-- | :-- |
| .NET SDK | 10.0.x (LTS, 최신 10.0.403) | `dotnet --version` |
| Node.js | LTS 26 권장 (22.22.2+ / 24.15+도 가능) | `node --version` |
| PostgreSQL | 18 (Docker 이미지 `postgres:18` 또는 직접 설치) | `psql --version` |
| Docker Desktop | 선택 (최신) | `docker --version` |

## 실행 방법 A: Docker (기본 경로)

```powershell
cd C:\dev\image-donation
Copy-Item C:\dev\image-donation\.env.example C:\dev\image-donation\.env
notepad C:\dev\image-donation\.env      # POSTGRES_PASSWORD, IP_HASH_KEY를 아무도 모르는 값으로 바꾸기
docker compose up --build -d
```

브라우저에서 `http://localhost:8080/login` 을 열어요. 끌 때는 `docker compose down`(데이터까지 지우려면 `docker compose down -v`).

- PostgreSQL 18 이미지는 볼륨을 `/var/lib/postgresql`에 붙여요(17 이하의 `/var/lib/postgresql/data`가 아님).
- 업로드 이미지와 암호화 키(Data Protection)는 `appdata` 볼륨(`/data`)에 남아서, 컨테이너를 다시 만들어도 로그인과 이미지가 유지돼요.
- 이미지는 항상 Release로 빌드해요. 이미지 라이브러리(SkiaSharp, MIT)는 라이선스 키가 필요 없어요.
- Docker Desktop이 안 되는 PC(예: Windows 11 Home에서 문제가 생길 때)는 실행 방법 B를 쓰세요.

## 실행 방법 B: Docker 없이 (PostgreSQL 직접 설치 + `dotnet run`)

1. PostgreSQL 18 설치: `winget install PostgreSQL.PostgreSQL.18` (관리자 권한, 포트 5432, 설치 중 정한 슈퍼유저 비밀번호를 기억)
2. DB 만들기:
   ```powershell
   & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -p 5432 -c "CREATE DATABASE image_donation;"
   ```
   (`psql.exe` 위치가 다르면 `Get-ChildItem "C:\Program Files\PostgreSQL"`로 찾으세요.)
3. 비밀 값은 user-secrets에 넣어요 (`appsettings.json`에는 비밀 값을 두지 않아요):
   ```powershell
   cd C:\dev\image-donation\server\ImageDonation.Api
   dotnet user-secrets set "ConnectionStrings:Default" "Host=localhost;Port=5432;Database=image_donation;Username=postgres;Password=<설치 때 정한 비밀번호>"
   dotnet user-secrets set "Security:IpHashKey" "<아무도 모르는 긴 문자열>"
   ```
   무작위 문자열은 PowerShell에서 `[Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))`로 만들 수 있어요.
4. 화면을 빌드해서 서버의 `wwwroot`에 넣고, 서버를 실행해요 (처음 실행할 때 테이블을 자동으로 만들어요):
   ```powershell
   cd C:\dev\image-donation\client
   npm ci
   npm run build
   cd C:\dev\image-donation\server\ImageDonation.Api
   dotnet run
   ```
   `http://localhost:5080/login` 을 열어요.
5. 화면을 고치면서 개발할 때는 서버(`dotnet run`)를 켜 둔 채로 다른 터미널에서 `cd C:\dev\image-donation\client` → `npm run dev` →
   `http://localhost:5173` 을 열어요. Vite가 `/api`, `/hubs`, `/media` 요청을 5080 서버로 넘겨줘요.

## 처음 써 보기 (테스트 모드)

1. `/login`에서 "처음이에요 (가입하고 로그인)" → `/onboarding`에서 주소(예: `my-stream`)와 이름 정하기
2. 시작 가이드의 **오버레이 주소**를 OBS 소스 목록 **+** → **브라우저** → **URL**에 넣고 너비 1920, 높이 1080 (오버레이 배경은 투명)
3. `/settings`에서 "치즈 후원 연동"과 최소 치즈를 정하고 저장
4. 휴대폰이나 다른 브라우저로 `/d/my-stream`에서 이미지를 보내면 `#AB12` 같은 코드가 나와요
5. `/dashboard`의 테스트 모드에서 메시지에 그 코드를 넣고 "가짜 치즈 후원 보내기" → 카드가 "검수 대기"로 바뀌면 **승인** → OBS 화면에 표시
6. 문제가 있으면 **긴급 정지**로 오버레이를 바로 비워요. 단축키: `A` 승인, `R` 거절(맨 위 검수 대기)

## 치지직 연동 (선택, 계정·앱 승인 필요)

1. 개발자 센터(`https://developers.chzzk.naver.com`)에서 애플리케이션을 만들고 Client ID/Secret을 받아요.
   앱 이름·ID에 "chzzk", "치지직", "naver", "네이버"를 넣을 수 없어요. 90일 동안 API 사용량이 0이면 앱이 삭제돼요.
2. **로그인 리디렉션 URL**에 `http://localhost:5080/api/chzzk/callback`(Docker는 `http://localhost:8080/api/chzzk/callback`)을 등록해요.
   (`localhost` 허용 여부는 확인하지 못했어요. 개발자 센터 입력칸 안내를 확인하세요.)
3. Scope: **후원 조회**, **유저 정보 조회** (코드 확인 시 채팅 안내를 하려면 **채팅 메시지 쓰기**도)
4. 비밀 값은 user-secrets(또는 Docker는 `.env`)에만:
   ```powershell
   cd C:\dev\image-donation\server\ImageDonation.Api
   dotnet user-secrets set "Chzzk:ClientId" "<Client ID>"
   dotnet user-secrets set "Chzzk:ClientSecret" "<Client Secret>"
   dotnet user-secrets set "Chzzk:RedirectUri" "http://localhost:5080/api/chzzk/callback"
   ```
   채팅 안내를 켜려면 `dotnet user-secrets set "Chzzk:ChatOnMatch" "true"`.
5. `/login`의 "치지직으로 로그인"(또는 설정의 "치지직 계정 연결") → 치지직 동의 → 돌아오면 로그인돼요.
   치즈 모드인 스트리머는 1분 안에 서버가 세션 소켓에 연결해요(설정 화면에 "세션 소켓 연결됨").

구현 요약 (`Services/ChzzkApiClient.cs`, `Services/Events/ChzzkSessionSource.cs`):

- 로그인 `https://chzzk.naver.com/account-interlock?clientId&redirectUri&state` → `POST /auth/v1/token`(`grantType: authorization_code`)
  → `GET /open/v1/users/me`. `state`는 1회용 무작위 값으로 쿠키와 비교해요.
- 토큰은 Data Protection으로 **암호화해서만** DB에 저장해요. Access Token은 1일, Refresh Token은 30일·**1회용**이라
  갱신(`grantType: refresh_token`)할 때마다 새 Refresh Token으로 바로 바꿔 저장해요.
- 세션: `GET /open/v1/sessions/auth`(1회용 URL) → `SocketIOClient 4.0.5`(`EIO = V3`, WebSocket, `Query["auth"]`, 재연결 끔)
  → `SYSTEM`(`connected`)의 `sessionKey`로 `POST /open/v1/sessions/events/subscribe/donation?sessionKey=` → `DONATION` 수신.
  페이로드가 JSON 문자열이든 객체든, `payAmount`·`expiresIn`이 문자열이든 숫자든 받아요. 끊기면 다음 점검(60초) 때 새 세션으로 다시 연결해요.
- 진짜 수신기(`ChzzkSessionSource`)와 테스트 모드(`FakeDonationSource`)는 같은 `IDonationEventSource` 이벤트를 내보내고,
  테스트 모드도 치지직과 같은 JSON을 같은 해석기(`ParseDonation`)에 통과시켜요.

## 이미지 처리 (보안)

업로드 순서: 크기 제한(스트리머 설정 `MaxFileMb`, 서버 전체 상한 10MB → 넘으면 413) → **매직 넘버** 검사(JPEG·PNG·WebP·GIF만,
확장자·Content-Type은 믿지 않음) → `SKCodec.Create`로 머리글만 읽기(형식 확인, 5천만 픽셀 초과 거절) → 첫 장면을 sRGB로 디코딩(가짜·잘린 파일 거절)
→ 긴 변 1280px로 축소(작은 이미지는 키우지 않음) → EXIF 방향(1~8)을 픽셀에 적용 → **WebP(품질 80)로 재인코딩** → 무작위 GUID 파일 이름으로 저장 → `GET /media/{file}`.

- **메타데이터 제거**: 재인코딩은 픽셀만 새 파일로 쓰므로 EXIF(위치·기기 정보)·XMP는 따라가지 않고, 색 공간을 비운 그림으로 저장해서 ICC 프로필도 붙지 않아요.
  테스트가 EXIF 조각(APP1)을 직접 써 넣은 JPEG로 결과 파일에 `Exif`·`ICCP`·소프트웨어 이름이 없는지 확인해요.
- `SKData`·`SKCodec`·`SKBitmap`·`SKImage`·`SKCanvas`는 네이티브 메모리를 쓰므로 모두 `using`으로 바로 돌려줘요.

- **움직이는 GIF·WebP 정책: 첫 장면만** 정지 이미지로 저장해요(디코딩 비용·메모리 폭탄 방지, 결과 형식을 하나로 단순화).
- 거절·만료된 후원의 이미지는 바로 지우고, 나머지는 **7일 뒤** `RetentionService`가 이미지 파일·후원 기록·치즈 이벤트 기록을 지워요.

## 보안 메모

- **오버레이 토큰**: 256비트 무작위 값(Base64Url 43자). 로그인 없이 토큰만으로 접속하므로 비밀번호처럼 다뤄요.
  설정의 **재발급**을 누르면 옛 주소로 열린 오버레이는 아무것도 받지 못해요(허브 그룹 이름에 토큰이 들어 있음). 틀린 토큰은 허브 연결 전에 401.
- **출력 인코딩**: 닉네임·메시지는 React가 글자로 출력해요(`dangerouslySetInnerHTML`을 쓰지 않음). `<script>`를 보내도 글자로 보여요.
- **요청 제한**: 후원 보내기는 IP당 1분 5건(`RateLimit:DonationsPerMinute`), 로그인 API는 20건. 넘으면 429.
  리버스 프록시 뒤에 배포하면 `ForwardedHeaders` 설정이 있어야 실제 IP로 제한돼요(이 레퍼런스는 직접 노출만 가정).
- **금지어**(대소문자 무시, 포함 검사)와 **차단**(보낸 사람 IP의 HMAC-SHA256 해시. IP 원문은 저장하지 않음).
- **비밀 값**: 연결 문자열·`Security:IpHashKey`·치지직 Secret은 user-secrets 또는 환경 변수에만. 커밋된 설정 파일에는 없어요.
- **쿠키**: Identity 쿠키(HttpOnly, SameSite=Lax)라 다른 사이트에서 보낸 POST에는 쿠키가 붙지 않아요. 공개 후원 API만 위조 방지 검사를 꺼요(쿠키를 쓰지 않으므로).
- **Data Protection 키**는 `DataProtection:KeysPath` 폴더에 평문 XML로 저장돼요(시작 로그의 "No XML encryptor configured" 경고). 운영 환경에서는 폴더 권한을 제한하세요.
- 보안 헤더: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`(오버레이 토큰이 다른 사이트로 새지 않게).
- 개발용 로컬 로그인은 `Auth:LocalLoginEnabled`(기본 `true`)로 끌 수 있어요. 인터넷에 공개할 때는 끄고 치지직 로그인만 쓰는 것을 권장해요.

## 이미지 라이브러리 (SkiaSharp 4.154.0, MIT)

- 패키지 두 개를 써요: `SkiaSharp` 4.154.0과 `SkiaSharp.NativeAssets.Linux.NoDependencies` 4.154.0. 둘 다 **MIT** 라이선스라 회사를 차려 돈을 벌어도
  라이선스 비용이나 키가 필요 없어요.
- **Windows에서는 따로 설치할 것이 없어요**: `SkiaSharp`(net10.0)가 `SkiaSharp.NativeAssets.Win32`(win-x64·win-x86·win-arm64의 `libSkiaSharp.dll`)와
  `SkiaSharp.NativeAssets.macOS`를 스스로 함께 받아요. Linux(Docker 컨테이너)용 `libSkiaSharp.so`는 `NativeAssets.Linux.NoDependencies`가 넣어 주고,
  이름처럼 fontconfig 같은 시스템 라이브러리가 없어도 동작해요.
- 이 프로젝트가 SixLabors.ImageSharp를 쓰지 않는 이유: ImageSharp는 3.2.0·4.0.0부터 **빌드할 때 Six Labors 라이선스 키**를 요구해서, 키 없이
  `dotnet publish -c Release`(Docker 빌드)가 실패해요. 또 Split License라 연 매출 100만 달러 이상인 회사는 유료 상용 라이선스가 필요해요.

## 테스트

| 무엇 | 명령 | 준비물 |
| :-- | :-- | :-- |
| 서버 단위·통합 (29개) | `cd C:\dev\image-donation\server` → `dotnet test` | PostgreSQL. 환경 변수 `TEST_DATABASE_URL`(기본 `Host=127.0.0.1;Port=5432;Database=image_donation_test;Username=wzh;Password=wzh`). Node(치지직 에뮬레이터 테스트가 처음 한 번 `tools/chzzk-emulator`에서 `npm ci`를 실행) |
| 화면 (Vitest + Testing Library) | `cd C:\dev\image-donation\client` → `npm ci` → `npx tsc -b` → `npm test` → `npm run build` | Node |
| e2e (이 저장소에서) | 저장소 루트에서 `node --test tests/reference/sp.e2e.test.mjs` | .NET, Node, `psql`, PostgreSQL, Playwright Chromium |

- 통합 테스트는 테스트마다 **새 스키마**(`Search Path`)를 만들어 마이그레이션을 적용하고, 끝나면 스키마째 지워요.
- 테스트 이미지는 파일로 두지 않고 코드로 만들어요: SkiaSharp로 만든 PNG·JPEG에 EXIF(APP1) 조각을 바이트로 직접 끼워 넣은 JPEG,
  바이트로 직접 쓴 3장면 GIF(SkiaSharp은 GIF를 저장하지 못해요).

## 자주 막히는 곳

- `ConnectionStrings:Default가 없어요` / `Security:IpHashKey가 없어요` → 실행 방법 B의 3단계(user-secrets)를 하세요. Docker는 `.env`.
- 처음 실행할 때 로그에 `Failed executing DbCommand … __EFMigrationsHistory`가 한 번 보이는 것은 정상이에요(아직 기록 테이블이 없어서). 바로 다음 줄에서 마이그레이션이 적용돼요.
- 개발 모드(`npm run dev`)의 브라우저 콘솔에 SignalR "stopped during negotiation" 오류가 한 번 보이는 것은 React StrictMode가 effect를 두 번 실행하기 때문이에요. 빌드한 화면에서는 나오지 않아요.
- Docker 연결 문자열 끝의 `GSS Encryption Mode=Disable`은 런타임 이미지에 없는 Kerberos 라이브러리(`libgssapi_krb5.so.2`)를 찾는 경고를 없애요.

## 검증 기록 (2026-11-01, Linux 샌드박스)

| 항목 | 결과 |
| :-- | :-- |
| `dotnet test` (SDK 10.0.114, PostgreSQL 16 로컬 서버) | 30개 통과 (단위: 매직 넘버, EXIF 제거·리사이즈, EXIF 방향 6 적용, GIF 첫 장면, 코드 매칭 4종, 금지어, 토큰 회전 / 통합: 무료 후원, 승인→오버레이 그룹, 잘못된 토큰 401, 토큰 재발급, 테스트 후원 매칭, 413, 429, 보관 기간 정리, 코드 만료 / 에뮬레이터 소켓 수신). `dotnet build -c Release` 경고 0 |
| 화면 `npm ci && npx tsc -b && npm test && npm run build` (Node 22.23.4, TypeScript 7.0.2, Vite 8.3.5, Vitest 5.0.5) | 테스트 5개 통과, 빌드 성공, `npm run lint`(Oxlint) 경고 0 |
| e2e `tests/reference/sp.e2e.test.mjs` (Chromium) | 통과: 개발 로그인 → 온보딩 → 치즈 모드 → 업로드 → 코드 → 테스트 후원 → 검수 대기 → 승인 → 오버레이 표시 → 긴급 정지 → 사라짐, 콘솔 오류 0 |
| `ChzzkSessionSource` ↔ 로컬 Socket.IO 2.5.0 에뮬레이터 | 통과: `EIO=3`, `auth` 쿼리 전달, `SYSTEM connected`의 `sessionKey`, 문자열·객체 두 형태의 `DONATION`과 문자열·숫자 `payAmount` |
| Docker (`postgres:18`, `node:26-slim`, `mcr.microsoft.com/dotnet/sdk:10.0`·`aspnet:10.0`) | Release로 빌드 → `docker compose up` → `/healthz` 200, 가입·로그인·온보딩·업로드(컨테이너 안의 `libSkiaSharp.so`로 WebP 변환)·`/media` 200, 텍스트 파일 업로드 400 → `down -v`. 컨테이너를 다시 만든 뒤에도 쿠키·이미지가 유지되는 것은 이전 라이브러리로 만든 이미지에서 확인(볼륨 구성은 같음) |

### 확인하지 못한 것 (실제 계정·장비가 필요)

- **치지직 실서버 연동 전체**: OAuth 로그인·토큰 교환·갱신, `users/me` 응답 필드(`channelId`, `channelName`), 세션 URL 발급, 후원 구독, 실제 `DONATION` 페이로드 형태(JSON 문자열/객체, `payAmount` 타입), 채팅 전송. API 클라이언트는 가짜 HTTP 처리기로, 소켓 수신은 로컬 에뮬레이터로만 확인했어요. 공식 문서(`https://chzzk.gitbook.io/chzzk`)와 다시 대조해야 해요.
- 개발자 센터의 `http://localhost` 리디렉션 URL 허용 여부, Scope 심사 기간, Quota(429) 수치.
- Windows에서 SkiaSharp 실행: 패키지 구성(`NativeAssets.Win32` 자동 포함)과 게시 결과(`runtimes/win-x64/native/libSkiaSharp.dll`)만 확인했고, Windows에서 실행해 보지는 못했어요.
- Windows 11 실기: PowerShell 명령, `winget` PostgreSQL 설치 경로, Docker Desktop(특히 Home 에디션), Windows의 SSPI 인증.
- OBS 실제 화면(브라우저 소스 투명 합성, 애니메이션). 오버레이 CSS는 배경 투명을 명시했어요.
- 이 샌드박스의 버전 차이: .NET SDK 10.0.114(교재 10.0.403), Node 22.23.4(교재 26), 로컬 테스트 DB는 PostgreSQL 16(Docker 확인은 18).
