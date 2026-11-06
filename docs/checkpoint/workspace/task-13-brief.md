### Task 13: P2 레퍼런스(TypeScript 클라이언트 + C# 서버)

**Files:**
- Create: `reference/p2-streamer-hub/server/StreamerHub.Api/`(`Program.cs`, `Data/AppDbContext.cs`, `Data/SeedData.cs`, `Entities/{Streamer,Schedule,Post,Notice,AppUser}.cs`, `Dtos/*.cs`, `Endpoints/{StreamerEndpoints,ScheduleEndpoints,PostEndpoints,NoticeEndpoints,AuthEndpoints}.cs`, `Services/*.cs`, `Migrations/`, `appsettings.json`, `appsettings.Development.json`, `StreamerHub.Api.http`), `server/StreamerHub.Tests/`, 솔루션 파일(Task 1에서 확인한 기본 형식), `client/`(Vite vanilla-ts: `index.html`, `overlay.html`, `vite.config.ts`, `src/{main.ts,router.ts,api.ts,types.ts,auth.ts,overlay.ts,style.css}`, `src/pages/{home,streamers,streamerDetail,schedule,board,postDetail,postForm,login,register,admin}.ts`), `README.md`
- Test: `dotnet test`(단위+통합), `tests/reference/p2.e2e.test.mjs`

**Interfaces:**
- Produces(개요·Day의 계약):
  - 엔티티
    - `Streamer{Id:int, Name, Platform:"chzzk"|"youtube"|"soop"|"other", ChannelUrl, Bio, AvatarUrl?, CreatedAt}`
    - `Schedule{Id, StreamerId, Title, StartsAt: DateTime(UTC), DurationMinutes}`
    - `Post{Id, AuthorId, Title(≤100), Body(≤5000), CreatedAt, UpdatedAt?}`
    - `Notice{Id, Message(≤200), CreatedAt}`
    - `AppUser : IdentityUser{DisplayName}`
  - API
    - `GET /api/streamers?q=`, `GET /api/streamers/{id}`, `POST|PUT|DELETE /api/streamers/{id?}`(Admin)
    - `GET /api/schedules?from=&to=`(UTC ISO 8601), `POST|PUT|DELETE /api/schedules/{id?}`(Admin)
    - `GET /api/posts?page=1&pageSize=20` → `{items,total,page,pageSize}`, `GET /api/posts/{id}`, `POST /api/posts`(로그인), `PUT|DELETE /api/posts/{id}`(작성자 또는 Admin, 아니면 403)
    - `GET /api/notices/current`, `POST /api/notices`(Admin), `GET /api/notices/stream`(SSE. Task 1에서 .NET 10 API를 확인한다. 없으면 수동 `text/event-stream`)
    - `/api/auth/*` = `MapIdentityApi<AppUser>()`(쿠키 로그인 `?useCookies=true`), `POST /api/auth/logout`, `GET /api/me` → `{email, displayName, roles}`
  - 오류는 ProblemDetails. 쓰기 엔드포인트는 Rate Limiting(고정 창)을 적용한다.
  - 관리자 시드: 설정 `Admin:Email`/`Admin:Password`(Development는 user-secrets, 테스트는 환경 변수). 비밀번호를 코드에 쓰지 않는다.
  - 클라이언트 라우트: `#/`, `#/streamers`, `#/streamers/:id`, `#/schedule`, `#/board`, `#/board/:id`, `#/board/new`, `#/login`, `#/register`, `#/admin`. 개발 중에는 Vite 프록시로 `/api`를 서버로 보낸다. 프로덕션에서는 `vite build` 결과를 `server/StreamerHub.Api/wwwroot`로 복사하고 서버가 제공한다(`UseStaticFiles` + `MapFallbackToFile("index.html")`)
  - 시간: DB와 API는 UTC, 화면은 `Intl.DateTimeFormat('ko-KR', {timeZone:'Asia/Seoul'})`

- [ ] **Step 0: 환경 준비** — `apt-get install -y dotnet-sdk-10.0` → `dotnet --version`이 10.x
- [ ] **Step 1: 실패하는 테스트를 쓴다**(xUnit)
  - 단위: `PostService_Update_ByOtherUser_Forbidden`, `ScheduleQuery_FiltersByUtcRange`, `StreamerValidation_RejectsEmptyName`
  - 통합(WebApplicationFactory, SQLite in-memory): `Anonymous_CannotCreatePost_401`, `Register_Login_CreatePost_201`, `NonAdmin_CannotCreateStreamer_403`, `Admin_CreatesStreamer_201`, `Posts_Paginate`, `Notice_Stream_Sends_Event`, `RateLimit_Returns429`
- [ ] **Step 2: 실행해서 실패를 확인한다** — `cd reference/p2-streamer-hub/server && dotnet test` → FAIL
- [ ] **Step 3: 서버를 구현하고** `dotnet test` → PASS
- [ ] **Step 4: 클라이언트를 구현한다** — `cd ../client && npm ci && npx tsc --noEmit && npm run build` → 성공
- [ ] **Step 5: e2e** — `tests/reference/p2.e2e.test.mjs`를 쓴다. 클라이언트를 빌드해 wwwroot로 복사하고, 서버를 임시 SQLite + 환경 변수 관리자로 실행한 뒤 다음을 확인한다: 가입 → 로그인 → 글 작성 → 목록에 보임, 관리자 로그인 → 스트리머 등록 → 목록에 보임, 공지 등록 → `overlay.html`에 3초 안에 표시, 콘솔 오류 0. 실행 → PASS
- [ ] **Step 6: 커밋** — `feat(reference): P2 streamer hub (TS + ASP.NET Core + SQLite)`

