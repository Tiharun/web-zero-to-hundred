# 스트리머 허브 (P2 완성본)

"더 발전된 웹사이트" 프로젝트의 완성 예시예요. 스트리머 목록, 주간 방송 일정, 팬 게시판, 가입·로그인, 관리자 화면, OBS 실시간 공지 오버레이가 있어요.
Day 1~40을 따라 하면 이 모양에 가까운 앱을 `C:\dev\streamer-hub\`에 직접 만들 수 있어요. (작성 기준일 2026-11)

- 클라이언트: TypeScript 7 + Vite 8 (`vanilla-ts` 템플릿, UI 프레임워크 없음)
- 서버: C# · ASP.NET Core Minimal API (.NET 10 LTS), EF Core + SQLite, ASP.NET Core Identity
- 테스트: xUnit(단위 + WebApplicationFactory 통합), `tsc --noEmit`

## 준비물과 버전 확인

| 도구 | 확인 명령 | 이 완성본을 만든 기준 |
| :-- | :-- | :-- |
| .NET SDK | `dotnet --version` → `10.0.`으로 시작 | 10.0.403 (런타임 10.0.14) |
| Node.js | `node --version` → v22.22.2 이상 | v26.13.0 LTS (npm 11.20.0) |
| dotnet-ef (마이그레이션을 새로 만들 때만) | `dotnet-ef --version` | 10.0.14 (`dotnet tool install --global dotnet-ef --version 10.0.14`) |

패키지 버전: TypeScript 7.0.2, Vite 8.3.5, EF Core Sqlite·Identity.EntityFrameworkCore·EF Core Design·Mvc.Testing 10.0.14, xUnit 2.9.3.

## 폴더 구조

```text
streamer-hub/
├─ .gitignore                    *.db, wwwroot(빌드 복사본), bin/obj
├─ client/                       Vite vanilla-ts
│  ├─ index.html                 사이트 틀(머리말 메뉴 + <main id="app">)
│  ├─ overlay.html               OBS 공지 오버레이 (배경 투명)
│  ├─ vite.config.ts             개발 프록시(/api → 5250), 페이지 두 개 빌드
│  ├─ public/favicon.svg
│  └─ src/
│     ├─ main.ts                 시작점: 주소↔화면 연결, 로그인 메뉴
│     ├─ router.ts               해시 라우터 (#/streamers/:id)
│     ├─ api.ts                  타입 있는 API 함수 + ApiError
│     ├─ types.ts                서버 DTO와 같은 모양의 타입
│     ├─ auth.ts                 지금 로그인한 사람(/api/me)
│     ├─ ui.ts                   한국 시간 표시, 링크·글자 요소 만들기, http(s) 주소 확인, 상태 문장 도우미
│     ├─ overlay.ts              SSE(EventSource)로 공지 받기
│     ├─ style.css
│     └─ pages/                  화면 하나 = 파일 하나
│        home · streamers · streamerDetail · schedule · board · postDetail · postForm · login · register · admin
└─ server/
   ├─ StreamerHub.slnx           솔루션(.NET 10 기본 형식)
   ├─ StreamerHub.Api/
   │  ├─ Program.cs              서비스 등록 → 미들웨어 순서 → 주소 연결
   │  ├─ Entities/               Streamer, Schedule, Post, Notice, AppUser (= DB 테이블)
   │  ├─ Dtos/                   주고받는 모양 + 검증 특성([Required], 직접 만든 [HttpUrl] 등)
   │  ├─ Data/                   AppDbContext, SeedData(마이그레이션 적용·관리자·예시 데이터)
   │  ├─ Endpoints/              자원마다 파일 하나: Streamer, Schedule, Post, Notice, Auth
   │  ├─ Services/               PostService(게시판 규칙), ScheduleQuery(UTC 범위), NoticeBroadcaster(SSE)
   │  ├─ Migrations/             dotnet ef migrations add InitialCreate 결과
   │  ├─ Properties/launchSettings.json   http://localhost:5250
   │  ├─ appsettings.json, appsettings.Development.json
   │  └─ StreamerHub.Api.http    요청 연습 파일
   └─ StreamerHub.Tests/         xUnit 단위·통합 테스트
```

여러분이 Day를 따라 만들면 `Migrations` 폴더에 Day마다 마이그레이션 파일이 하나씩 생겨요. 이 완성본은 마지막 모습만 담아서 `InitialCreate` 하나예요. 둘 다 정상이에요.

## 개발 모드로 실행하기

PowerShell 터미널 두 개를 써요. (Windows에서 직접 실행해 보지는 못했고, 같은 흐름을 Linux에서 확인했어요. 작성 기준일 2026-11)

**1) 관리자 계정 정하기 (처음 한 번)** — 비밀번호를 코드나 `appsettings.json`에 쓰지 않고 내 PC의 user-secrets에 넣어요.

```powershell
cd C:\dev\streamer-hub\server\StreamerHub.Api
dotnet user-secrets set "Admin:Email" "admin@example.com"
dotnet user-secrets set "Admin:Password" "<비밀번호>"
```

비밀번호 규칙(ASP.NET Core Identity 기본값): 6자 이상, 영어 대문자·소문자·숫자·기호를 하나 이상씩. 규칙에 맞지 않으면 서버가 켜질 때 "관리자 계정을 만들지 못했어요" 오류를 내요. 설정하지 않으면 경고만 남기고 관리자 없이 켜져요.

**2) 서버 (터미널 1)**

```powershell
cd C:\dev\streamer-hub\server\StreamerHub.Api
dotnet watch
```

- `http://localhost:5250`에서 API가 켜져요. 코드를 저장하면 다시 시작해요.
- 처음 켜면 `streamerhub.db` 파일이 생기고, 마이그레이션이 적용되고, 관리자 계정과 예시 스트리머 3명이 들어가요. (`dotnet ef database update`를 따로 하지 않아도 돼요)
- `The WebRootPath was not found` 경고는 아직 클라이언트를 빌드해 넣지 않았다는 뜻이에요. 개발 중에는 화면을 Vite가 보여 주니 괜찮아요.
- 개발 중에는 실행한 SQL이 터미널에 보여요(`appsettings.Development.json`).

**3) 클라이언트 (터미널 2)**

```powershell
cd C:\dev\streamer-hub\client
npm ci
npm run dev
```

브라우저로 `http://localhost:5173`을 열어요. `/api`로 시작하는 요청은 Vite가 5250번 서버로 넘겨 줘서(프록시) CORS 설정이 필요 없어요.

**OBS 오버레이**: 소스 추가 → 브라우저 → URL에 `http://localhost:5173/overlay.html`(빌드 후에는 서버 주소의 `/overlay.html`). 관리자 화면에서 공지를 올리면 바로 떠요.

## 테스트

```powershell
cd C:\dev\streamer-hub\server
dotnet test

cd C:\dev\streamer-hub\client
npx tsc --noEmit
```

| 종류 | 테스트 이름 | 확인하는 것 |
| :-- | :-- | :-- |
| 단위 | `PostService_Update_ByOtherUser_Forbidden` | 남의 글은 고칠 수 없고 DB도 그대로 |
| 단위 | `ScheduleQuery_FiltersByUtcRange` | 한국 날짜 하루를 UTC 범위로 거르기 |
| 단위 | `StreamerValidation_RejectsEmptyName` | DTO 검증 특성 |
| 단위 | `StreamerValidation_RejectsNonHttpUrl`(Theory), `StreamerValidation_AcceptsHttpsUrl` | `[HttpUrl]`: ftp·`javascript:`·호스트 없는 주소는 거절, https는 통과 |
| 통합 | `Anonymous_CannotCreatePost_401` | 로그인 안 하면 401 |
| 통합 | `Register_Login_CreatePost_201` | 가입 → 쿠키 로그인(HttpOnly, SameSite=Lax) → 글쓰기 201 |
| 통합 | `NonAdmin_CannotCreateStreamer_403` | 팬은 관리자 기능 403 |
| 통합 | `Admin_CreatesStreamer_201` | 관리자 등록 201 + Location, 검색에 보임 |
| 통합 | `Admin_CreateStreamer_EmptyName_400` | `AddValidation()`이 400 + ProblemDetails |
| 통합 | `Admin_CreateStreamer_NonHttpUrl_400` | 직접 만든 `[HttpUrl]`도 `AddValidation()`이 검사 |
| 통합 | `Posts_Paginate` | `{items,total,page,pageSize}`, 최신 글 먼저, pageSize 범위 |
| 통합 | `Notice_Stream_Sends_Event` | SSE: 연결하면 지금 공지, 새 공지도 이벤트로 |
| 통합 | `RateLimit_Returns429` | 로그인 시도 요청 제한 429 + ProblemDetails |
| 통합 | `RateLimit_Posts_Returns429` | 글쓰기 같은 보통 쓰기 요청에도 429 |
| 통합 | `OtherUser_CannotUpdateOrDeletePost_403` | 남의 글 PUT·DELETE는 403, 글은 그대로 |
| 통합 | `Author_UpdatesPost_204` | 작성자는 자기 글을 고칠 수 있음(204) |
| 통합 | `Admin_DeletesAnyPost_204` | 관리자는 누구의 글이든 지울 수 있음(204) |
| 통합 | `AdminSeed_DoesNotPromote_PreRegisteredAccountWithWrongPassword` | 관리자 이메일로 먼저 가입해 둔 남의 계정을 관리자로 올리지 않음 |
| 통합 | `AdminSeed_Promotes_ExistingAccountWithMatchingPassword` | 설정과 비밀번호가 같은 기존 계정(운영자 본인)은 관리자로 올림 |

통합 테스트는 메모리 SQLite를 쓰고, 관리자 계정·요청 제한 값은 테스트 코드가 설정으로 넣어요(`TestApp.cs`). 테스트용 비밀번호도 코드에 적지 않고 실행할 때마다 무작위로 만들어요.

## 하나의 앱으로 빌드하기 (Day 38)

클라이언트를 빌드해서 서버의 `wwwroot`에 넣으면, 서버 하나가 화면과 API를 함께 제공해요.

```powershell
cd C:\dev\streamer-hub\client
npm run build
# 예전 빌드가 있으면 지우고 새로 복사해요
Remove-Item -Recurse -Force C:\dev\streamer-hub\server\StreamerHub.Api\wwwroot -ErrorAction SilentlyContinue
New-Item -ItemType Directory C:\dev\streamer-hub\server\StreamerHub.Api\wwwroot
Copy-Item -Recurse C:\dev\streamer-hub\client\dist\* C:\dev\streamer-hub\server\StreamerHub.Api\wwwroot\

cd C:\dev\streamer-hub\server\StreamerHub.Api
dotnet publish -c Release -o C:\dev\streamer-hub-publish

cd C:\dev\streamer-hub-publish
$env:Admin__Email = "admin@example.com"
$env:Admin__Password = "<비밀번호>"
dotnet StreamerHub.Api.dll --urls http://localhost:5000
```

- 배포한 앱은 user-secrets를 읽지 않아요(개발 환경 전용). 그래서 환경 변수로 넣어요. 설정 이름의 `:`는 환경 변수에서 `__`(밑줄 두 개)로 써요.
- DB 파일은 실행한 폴더의 `streamerhub.db`예요. 다른 곳에 두려면 `$env:ConnectionStrings__Default = "Data Source=C:\data\streamerhub.db"`. 백업은 서버를 끈 뒤 이 파일(과 `-wal`, `-shm`)을 복사해요.
- `UseStaticFiles`가 `wwwroot`의 파일을 보내고, 그 밖의 주소는 `MapFallbackToFile("index.html")`이 받아요. 없는 `/api/...` 주소는 index.html 대신 404예요.
- 인터넷에 올릴 때 앞에 리버스 프록시(Nginx, 클라우드의 부하 분산기 등)를 두면, 서버에는 모든 요청이 프록시의 IP에서 온 것처럼 보여요. 그러면 "IP마다" 세는 요청 제한이 모든 사용자를 한 사람으로 세요. 이때는 `app.UseForwardedHeaders()`로 프록시가 넘겨 주는 `X-Forwarded-For`(진짜 접속 IP)를 읽게 하고, 믿을 수 있는 프록시만 `ForwardedHeadersOptions`의 `KnownProxies`나 `KnownIPNetworks`에 등록해요(.NET 10에서 옛 이름 `KnownNetworks`는 더 쓰지 않아요). (Day 39)

## API 한눈에 보기

시각은 모두 UTC ISO 8601(끝에 `Z`)이에요. 오류는 모두 ProblemDetails(`application/problem+json`)예요.

| 메서드·주소 | 누가 | 응답 |
| :-- | :-- | :-- |
| `GET /api/streamers?q=` | 누구나 | 200 스트리머 목록(이름 검색) |
| `GET /api/streamers/{id}` | 누구나 | 200 상세 + 다가오는 일정, 없으면 404 |
| `POST /api/streamers` | Admin | 201 + Location, 검증 실패 400 |
| `PUT` · `DELETE /api/streamers/{id}` | Admin | 204, 없으면 404 (삭제하면 일정도 함께) |
| `GET /api/schedules?from=&to=` | 누구나 | 200 `[from, to)` 일정. 생략하면 지금부터 7일. `Z` 없는 시각은 400 |
| `POST /api/schedules`, `PUT` · `DELETE /api/schedules/{id}` | Admin | 201 / 204 |
| `GET /api/posts?page=1&pageSize=20` | 누구나 | 200 `{items,total,page,pageSize}` (pageSize 1~50) |
| `GET /api/posts/{id}` | 누구나 | 200 (`canEdit` = 작성자 또는 관리자) |
| `POST /api/posts` | 로그인 | 201, 안 하면 401 |
| `PUT` · `DELETE /api/posts/{id}` | 작성자 또는 Admin | 204, 남의 글이면 403 |
| `GET /api/notices/current` | 누구나 | 200 최근 공지, 없으면 204 |
| `POST /api/notices` | Admin | 201, 연결된 오버레이로 바로 전송 |
| `GET /api/notices/stream` | 누구나 | SSE `event: notice` (연결하면 지금 공지부터) |
| `POST /api/auth/register`, `POST /api/auth/login?useCookies=true` 등 | 누구나 | `MapIdentityApi`가 만든 주소 |
| `POST /api/auth/logout` | 누구나 | 204 (로그인 쿠키 지우기) |
| `GET /api/me` | 누구나 | 로그인했으면 200 `{email,displayName,roles}`, 아니면 204 |
| `PUT /api/me` | 로그인 | 204 (닉네임 바꾸기) |

쓰기 요청(POST·PUT·DELETE)과 `/api/auth/*`에는 IP마다 고정 창 요청 제한(기본 1분에 30번, `appsettings.json`의 `RateLimit`)이 걸려 있어요. 넘으면 429예요.

POST·PUT에 `Content-Type: application/json`을 빼거나 다른 값으로 보내면 **404**가 나와요. JSON 본문을 받는 엔드포인트는 Content-Type이 맞을 때만 "주소가 맞다"고 치기 때문에(원래는 415), 남은 요청을 `/api/{**rest}`가 받아서 404로 답해요. 어느 쪽이든 요청이 처리되지 않는 것은 같아서 문제는 없어요. 화면 코드(`api.ts`)는 항상 JSON으로 보내니, `.http` 파일로 연습하다 404가 나오면 `Content-Type` 줄부터 확인해 주세요.

## 설계 메모 (왜 이렇게 했나)

- **DB와 API는 UTC, 화면만 한국 시간**: SQLite는 DateTime의 "UTC 표시"를 저장하지 못해서, `AppDbContext`가 읽을 때 UTC 표시를 다시 붙여요. 화면은 `Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul' })`로 보여 줘요. 그래서 컴퓨터 시간대가 달라도 한국 시간으로 보여요.
- **요청 DTO는 `public record`**: `AddValidation()`은 public 타입만 검사해요. internal이면 잘못된 값도 조용히 통과해요.
- **닉네임은 가입 직후 `PUT /api/me`로**: Identity의 `/register`는 이메일·비밀번호만 받아요. 가입 화면이 가입 → 로그인 → 닉네임 저장을 차례로 해요.
- **로그인 안 한 `/api/me`는 401이 아니라 204**: 401이면 방문자 브라우저 콘솔에 페이지마다 빨간 오류가 찍혀요. "로그인 안 함"은 오류가 아니라서 "내용 없음"으로 알려요. 진짜로 막아야 하는 주소(글쓰기 등)는 401/403이에요.
- **SSE는 연결하자마자 지금 공지부터 보내요**: OBS를 다시 켜거나 연결이 잠깐 끊겨도 바로 최신 공지가 보여요. 새 공지는 `NoticeBroadcaster`가 연결된 오버레이 모두에게 나눠 줘요.
- **로그인 쿠키**: `HttpOnly`(자바스크립트로 못 읽음) + `SameSite=Lax`(다른 사이트가 보낸 POST에는 안 붙음). 클라이언트는 쿠키를 직접 다루지 않고 `/api/me`로 누구인지 물어요.
- **화면에 사용자 데이터를 넣을 때는 항상 `textContent`/`value`**: `innerHTML`에는 우리가 쓴 고정 글자만 넣어요. 채널·사진 주소는 서버가 직접 만든 `[HttpUrl]` 특성으로 http·https이고 호스트가 있는 주소만 받아요(기본 `[Url]`은 `ftp://`와 `https://`만 쓴 값도 통과시켜요). 화면도 `isHttpUrl`로 한 번 더 확인한 뒤 `href`·`src`에 넣어요.
- **요청 제한은 IP마다 따로 세요**: 모두가 한 창을 같이 쓰면 한 사람이 다른 사람의 로그인까지 막을 수 있어요.
- **관리자 시드는 비밀번호를 확인해요**: 가입은 누구나 할 수 있고 이메일 확인이 없어서, 남이 관리자 이메일로 먼저 가입해 둘 수 있어요. 그래서 이미 있는 계정은 설정의 비밀번호와 맞을 때만 관리자로 올려요.
- **가입 화면은 닉네임을 먼저 검사해요**: 앞뒤 빈칸을 뺀 닉네임이 2~20자가 아니면 가입 요청을 보내지 않아요. 가입·로그인은 됐는데 닉네임 저장만 실패하면, 닉네임만 고쳐서 다시 저장할 수 있어요.

## Day ↔ 코드 지도

| Day | 이 완성본에서 볼 곳 |
| :-- | :-- |
| 1~3 | 이 README의 폴더 구조, `client/package.json`(`npm ci`, `node_modules`) |
| 4~6 | `client/src/types.ts`(interface·유니온·`Paged<T>`), `api.ts`의 `getJson<T>`(제네릭), `ui.ts`의 `createElementWithText`(P1 도우미에 타입 붙이기), 모듈 `import`/`export`, `tsconfig.json`의 `"strict": true` |
| 7 | `client/` 전체(vanilla-ts 템플릿), `index.html`, `vite.config.ts` |
| 8 | `api.ts`(async/await, 타입 있는 fetch, `ApiError`), `home.ts`(`Promise.all`, 불러오는 중·오류 문장) |
| 9~15 | `Entities/*.cs`(클래스·속성), `Dtos/*.cs`(record), `PostService`(생성자·메서드·`async Task`·enum), LINQ(`Where`/`OrderBy`/`Select`), `NoticeBroadcaster`(List·lock) |
| 16 | `StreamerHub.Api.http` |
| 17~18 | `Program.cs` 3부, `Properties/launchSettings.json`, `Endpoints/*.cs`(`{id:int}`, `TypedResults`, `Results<...>`) |
| 19~21 | `Migrations/`(CREATE TABLE), `Data/AppDbContext.cs`, 비동기 EF 쿼리, `SeedData`(MigrateAsync·예시 데이터) |
| 22 | `Schedule.StreamerId`(외래 키), `Include`(스트리머 상세·일정 목록) |
| 23 | DTO + `AddValidation()`, `AddScoped<PostService>()`, `MapGroup` |
| 24 | `AddProblemDetails`·`UseStatusCodePages`·`UseExceptionHandler`, `appsettings*.json`, `ILogger`(SeedData) |
| 25~26 | `AppUser`, `AddIdentityApiEndpoints`·`MapIdentityApi`, `AddRoles`·`Admin` 정책, `EnsureAdminAsync`(user-secrets), `/api/me` |
| 27 | `vite.config.ts` 프록시, `api.ts` |
| 28 | `router.ts`, `main.ts`의 `addRoute`, `streamers.ts`, `streamerDetail.ts` |
| 29 | `ScheduleQuery`, `ScheduleEndpoints`의 UTC 검사, `UtcDateTimeConverter`, `schedule.ts`(한국 시간 주 계산), `ui.ts` 시간 도우미 |
| 30~31 | `PostService`, `PostEndpoints`, `PagedResult<T>` / `board.ts`, `postDetail.ts`, `postForm.ts`(`#/board/:id/edit` 포함), `login.ts`, `register.ts`, `auth.ts` |
| 32 | `admin.ts`, `isAdmin()`와 `#admin-link`(역할 기반 UI) |
| 33 | `NoticeEndpoints`(`/current` 폴링 → `/stream` SSE), `NoticeBroadcaster`, `overlay.html`·`overlay.ts` |
| 34 | `textContent`, `[HttpUrl]`·`isHttpUrl`, 쿠키 옵션, `AddRateLimiter`, EF 매개변수(SQL 인젝션 방지), 관리자 시드의 비밀번호 확인 |
| 35~36 | `StreamerHub.Tests/`(`TestDb`, `TestApp`), `npx tsc --noEmit` |
| 37 | `dotnet format`(이 코드는 변경 없이 통과), Prettier(`--single-quote --print-width 120`로 변경 없이 통과) |
| 38~39 | `UseStaticFiles`·`MapFallbackToFile`, 위의 "하나의 앱으로 빌드하기", DB 파일 위치·환경 변수 |
| 40 | 이 README |

## 이 저장소에서 확인하는 방법 (교재 관리용)

```bash
cd reference/p2-streamer-hub/server && dotnet test
cd reference/p2-streamer-hub/client && npm ci && npx tsc --noEmit && npm run build
node --test tests/reference/p2.e2e.test.mjs   # 저장소 루트에서. 빌드 → publish(임시 폴더) → 서버 실행 → Chromium
```
