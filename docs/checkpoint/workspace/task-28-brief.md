### Task 28: SP 레퍼런스(React + C# + SignalR + PostgreSQL)

**Files:**
- Create: `reference/sp-image-donation/`
  - `server/ImageDonation.Api/`(`Program.cs`, `Data/AppDbContext.cs`, `Entities/{Streamer,StreamerSettings,Donation,DonationEvent,ChzzkToken,BlockEntry}.cs`, `Endpoints/{PublicEndpoints,DashboardEndpoints,AuthEndpoints,ChzzkEndpoints,TestModeEndpoints}.cs`, `Hubs/{OverlayHub,DashboardHub}.cs`, `Services/{ImageProcessor,DonationService,DonationCodeMatcher,ChzzkApiClient,RetentionService}.cs`, `Services/Events/{IDonationEventSource,ChzzkSessionSource,FakeDonationSource}.cs`, `Services/Storage/{IImageStorage,LocalImageStorage}.cs`, `Migrations/`, `appsettings*.json`)
  - `server/ImageDonation.Tests/`
  - `client/`(Vite react-ts + React Router: 라우트 `/d/:slug`(후원), `/dashboard`(검수), `/settings`, `/onboarding`, `/login`. 별도 엔트리 `overlay.html`)
  - `Dockerfile`, `docker-compose.yml`(api + postgres + 이미지 볼륨), `.env.example`, `README.md`
- Test: `dotnet test`, `client` `npm test`(Vitest), `tests/reference/sp.e2e.test.mjs`

**Interfaces:**
- Produces:
  - 후원 상태: `Pending → Approved → Shown`, `Pending → Rejected`, (치즈 모드) `AwaitingCheese → Pending`(코드 매칭) 또는 `→ Expired`(30분)
  - 설정: `Mode: Free|Cheese`, `MinCheese:int`, `AutoApprove:bool`, `DisplaySeconds(3..30)`, `MinIntervalSeconds`, `MaxFileMb(≤10)`, `BannedWords:string[]`
  - 공개 API: `GET /api/public/streamers/{slug}`, `POST /api/public/streamers/{slug}/donations`(multipart: image, nickname ≤ 20, message ≤ 100) → `{id, status, code?}`(코드 형식 `#` + 영문 대문자·숫자 4자). IP 기준 Rate Limiting
  - 대시보드 API(스트리머 로그인)
    - `GET /api/dashboard/donations?status=`
    - `POST /api/dashboard/donations/{id}/approve|reject`
    - `POST /api/dashboard/overlay/clear`(긴급 정지)
    - `GET|PUT /api/dashboard/settings`
    - `POST /api/dashboard/overlay-token/rotate`
    - `POST /api/dashboard/test-donation`(테스트 모드: FakeDonationSource로 가짜 치즈 후원 이벤트 발행)
  - SignalR
    - `/hubs/overlay?token=<overlayToken>`: 서버→클라이언트 `ShowDonation(dto)`, `Clear()`
    - `/hubs/dashboard`(로그인): `DonationCreated(dto)`, `DonationUpdated(dto)`
  - 이미지
    - 저장 전에 매직 넘버를 검사한다(JPEG·PNG·WebP·GIF).
    - 라이브러리로 디코딩해 검증하고, 긴 변 최대 1280px로 리사이즈하고, 메타데이터(EXIF)를 제거하고, 재인코딩한다(Task 1 결정 라이브러리. 애니메이션 GIF 정책도 Task 1/개요에서 확정).
    - 파일명은 무작위 GUID다. `GET /media/{file}`로 제공한다.
    - 보관 기간은 7일이고 RetentionService가 삭제한다.
  - 치지직: Task 1에서 확인한 OAuth·세션 사양으로 구현한다. Secret은 user-secrets/환경 변수에만 둔다. 토큰은 Data Protection으로 암호화해 저장한다. 리프레시 토큰은 회전을 처리한다. 소켓 수신은 `IDonationEventSource` 뒤에 숨긴다(서버 직접 또는 브라우저 중계. Task 1 결정).
  - 인증: 개발용 로컬 로그인(Identity) + 치지직 로그인. 오버레이는 토큰만으로 접속한다(로그인 불필요).

- [ ] **Step 0: 환경 준비** — PostgreSQL(로컬 서비스 또는 Docker)과 `TEST_DATABASE_URL`
- [ ] **Step 1: 실패하는 테스트를 쓴다**
  - 단위
    - `MagicNumber_RejectsRenamedTextFile`
    - `ImageProcessor_StripsExif_AndResizes`(EXIF가 있는 테스트 JPEG를 코드로 생성)
    - `CodeMatcher_MatchesCodeInMessage_CaseInsensitive`
    - `CodeMatcher_IgnoresBelowMinCheese`
    - `CodeMatcher_IgnoresExpired`
    - `CodeMatcher_NoDoubleMatch`
    - `BannedWords_Rejects`
    - `ChzzkApiClient_RefreshRotatesToken`(stub HttpMessageHandler)
  - 통합(WebApplicationFactory + PostgreSQL)
    - `PublicDonation_FreeMode_CreatesPending`
    - `Approve_SendsShowDonation_ToOverlayGroup`(SignalR 테스트 클라이언트)
    - `OverlayHub_RejectsBadToken`
    - `TestDonation_MatchesAwaitingCheese`
    - `Upload_TooLarge_413`
    - `RateLimit_429`
    - `Retention_DeletesOldFiles`
  - 클라이언트(Vitest + Testing Library): `DonatePage_ShowsCodeInCheeseMode`, `Dashboard_ApproveButtonCallsApi`
- [ ] **Step 2: 실행해서 실패를 확인한다** → FAIL
- [ ] **Step 3: 서버를 구현하고** `dotnet test` → PASS
- [ ] **Step 4: 클라이언트를 구현하고** `npm ci && npx tsc -b && npm test && npm run build` → PASS
- [ ] **Step 5: e2e** — `sp.e2e.test.mjs`: 서버 실행 → 개발 로그인 → 치즈 모드 설정 → 후원 페이지에서 이미지 업로드 → 코드 표시 → 대시보드에서 테스트 후원(코드 포함) → 대기열에 나타남 → 승인 → `overlay.html?token=`에 이미지 표시 → 긴급 정지 → 사라짐 → 콘솔 오류 0
- [ ] **Step 6: Docker** — Task 20 Step 6과 같다.
- [ ] **Step 7: 치지직 실연동 미검증 사항을 README와 검증 기록에 명시한다**
- [ ] **Step 8: 커밋** — `feat(reference): SP image donation service (React + ASP.NET Core + SignalR + PostgreSQL)`

