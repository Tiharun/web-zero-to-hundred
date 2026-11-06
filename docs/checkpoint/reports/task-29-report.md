# Task 29 report — SP outline, meta, glossary

Status: **DONE_WITH_CONCERNS** (concerns below are reference/plan-level choices for the controller, not failures). Commits: none — NO GIT.

## What I implemented

- `textbook/content/sp/_outline.md` (≈326k chars): header (how to read, 11 SP fixed rules, P1/P2 knowledge map, ports/secrets table), at-a-glance table, 40 Day blocks in the Task 8 format + `레퍼런스 대응`, full file map, term assignment tables, unverified list.
- `textbook/content/sp/_meta.json`: `project` = `id: "sp"`, `order: 4`, `track: "special"`, `requires: ["p2"]`, folder `C:\dev\image-donation`, 40 days (titles = spec 3.4 verbatim, checked by script; minutes 80–120, total 4230), `pages: []`. curriculum.json not touched (R32).
- `textbook/content/glossary/sp.md`: 125 SP-owned terms, each `### 용어` / `- 처음 등장: [SP Day N](#/day/sp-dNN)` / 2–4 sentence 해요체 definition.
- All three files are generated from one data source (scratch generator), so every Day's 시작 상태 is computed from the file map and equals the previous Day's end state by construction. Generator: `/tmp/claude-0/-home-user-web-zero-to-hundred/a3ed5e68-2ed7-58a6-8548-3d657f4039ce/scratchpad/task29/gen.mjs` (data: `files.mjs`, `days1.mjs`, `days2.mjs`, `terms.mjs`, `header.md`, `footer.md` in the same folder). Re-run: `node gen.mjs /home/user/web-zero-to-hundred`.

Mandatory items:
- Money-flow principle: Day 1 goal (as `:::warn`), header rule 1, repeated at cheese Days; project summary/subtitle.
- Test mode as default path Days 21–28: every 끝 상태 확인 is split into **기본 경로(치지직 승인 없이)** / **선택 단계(승인된 앱)**. Test-mode backend (FakeDonationSource + `POST /api/dashboard/test-donation`) moved to Day 26 so Days 26–28 are fully doable without approval; Day 28 adds the UI panel.
- Day 32 states "법률 자문을 대신하지 않아요 … 법률 전문가의 자문을 받아야 해요" as `:::warn`; no legal claims.
- Real 치지직 server integration stated as unverified in rule 3, in Days 21–28, and in section 8.

## Verification

Automated checks inside the generator (all pass): 40 days, minutes 60–120; each term owned by exactly one Day; no SP heading collides (case/space-insensitive) with p1.md/p2.md/p3.md; every `shared` term exists with exact case in p1/p2/p3; every `[[…]]` in the outline resolves; every git-tracked file of `reference/sp-image-donation` (102) appears in the file map (the 4 reference migration files are covered by the learner's 5 migrations + snapshot); no reference file is deleted; no TODO/TBD/FIXME/작성 예정.

Scratch merge (outline-rules item 6, R38): copied `textbook/content` to scratch, merged **all four** `_meta.json` (p1, p2, p3, sp + p1's pages start/help) into curriculum.json, with **all four** glossaries (p1, p2, p3, sp):

```
node build.mjs --check --allow-missing --content <scratch>/content
경고 E_CUR_FILE_MISSING p1: Day 파일 29개가 없어 … / p2 40 / p3 45 / sp 40
검사 통과: Day 155개, 페이지 4개, 결과 크기 0.83 MB      (exit 0, 0 errors)
```
Separate heading scan across p1/p2/p3/sp: 0 duplicates. Spec-title comparison: 40/40 identical.
Note: until the controller merges sp/_meta.json, `npm run check` on the repo will report E_LINK_UNKNOWN for sp.md's `#/day/sp-dNN` links (expected).

Also run in this environment: `npm pack create-vite@9.3.3` (react-ts template file list — Day 3 deletion list and "tsconfig/oxlint/gitignore/favicon identical to reference" come from this); `docker compose run -d --rm --name … -p 127.0.0.1:55432:5432 db` against the reference compose (Compose v5.6.1, postgres 18.6, psql connected; container/volume removed afterwards) — used for Day 37's "back to dev mode" command.

## Files changed (controller commits exactly these)

- textbook/content/sp/_outline.md (new)
- textbook/content/sp/_meta.json (new)
- textbook/content/glossary/sp.md (new)

(`git status` also shows `textbook/content/glossary/p1.md` and `p1/_outline.md` modified — not mine, another agent's.)

## Glossary ownership (R37/R38)

Every term below is defined only in sp.md. P1/P2/P3 headings are never redefined; renamed to avoid collisions: `인덱스`(P1) → not used, P3 owns `데이터베이스 인덱스`; `스코프`(P1) → SP owns `OAuth 스코프`; `리버스 프록시`(P2), `Docker 이미지` → P3 `컨테이너 이미지`, `가상화` → P3 `하드웨어 가상화`, and P3's Docker/PostgreSQL/WebSocket/트랜잭션/Dockerfile/멀티스테이지 빌드/.dockerignore/방송 리허설/.env 파일 are linked, not defined.

### SP-owned terms (term → owning Day)

- SP Day 1: 이미지 후원, 치지직, 치즈 후원, 검수, 결제 대행(PG), 정산, 테스트 모드
- SP Day 2: 아키텍처, 구성도
- SP Day 3: React, 컴포넌트, JSX, TSX, props, Oxlint
- SP Day 4: 훅, useState, 조건부 렌더링, key (React), 불변 업데이트
- SP Day 5: useEffect, 의존성 배열, 정리 함수, 커스텀 훅, 제어 컴포넌트, FileReader
- SP Day 6: React Router, BrowserRouter, Outlet, 레이아웃 라우트
- SP Day 8: Npgsql, 빠른 실패
- SP Day 9: 상태 전이, 배열 열
- SP Day 10: multipart/form-data, IFormFile, GUID, 경로 조작
- SP Day 11: 매직 넘버, 디코딩, 재인코딩, EXIF, WebP, SkiaSharp, 압축 폭탄, 오픈소스 라이선스
- SP Day 12: BackgroundService, 보관 기간, Cache-Control
- SP Day 13: 온보딩, slug, 암호학적 난수, Base64Url
- SP Day 14: HMAC, 공개 API
- SP Day 15: SignalR, 허브, SignalR 그룹
- SP Day 16: 오버레이 토큰, 보안 헤더
- SP Day 17: 조건부 업데이트, ExecuteUpdate, 경쟁 상태
- SP Day 18: 큐, useRef, useCallback, 자동 재연결
- SP Day 19: 보호된 라우트
- SP Day 20: 자동 승인, 금지어, useOutletContext, Clipboard API
- SP Day 21: OAuth 2.0, 인가 코드, 액세스 토큰, 리프레시 토큰, state 값, OAuth 스코프, 리디렉션 URI
- SP Day 22: 치지직 개발자 센터, Client ID, Client Secret, 치지직 Open API
- SP Day 23: 토큰 교환, 계정 연결, 타이밍 공격
- SP Day 24: Data Protection, 토큰 회전, SemaphoreSlim
- SP Day 25: Socket.IO, Engine.IO, 세션 소켓, 에뮬레이터
- SP Day 26: 페이로드, C# 이벤트, 브라우저 중계
- SP Day 27: 후원 코드, 멱등성
- SP Day 28: 할당량
- SP Day 29: XMLHttpRequest, FormData, 업로드 진행률
- SP Day 30: 사용자 여정
- SP Day 31: 신고, 차단, 긴급 정지
- SP Day 32: 개인정보, 최소 수집, 개인정보 처리방침, 이용약관, 초상권
- SP Day 33: 경계값
- SP Day 34: Vitest, Testing Library, jsdom, 모킹, 테스트 스키마
- SP Day 35: 관측성, 헬스 체크, 구조화 로깅
- SP Day 36: 객체 스토리지, S3 호환, 테스트 대역
- SP Day 38: 휘발성 파일 시스템
- SP Day 40: 운영 비용

### Shared terms owned by P3 (SP Day that teaches it from scratch → term)

- SP Day 3: 린터
- SP Day 7: Docker, 컨테이너, 컨테이너 이미지, Docker Hub, Docker Desktop, WSL 2, 하드웨어 가상화, Docker Compose, 볼륨, 포트 매핑, PostgreSQL, psql, .env 파일
- SP Day 9: 데이터베이스 인덱스
- SP Day 15: WebSocket, 프로토콜 업그레이드
- SP Day 25: WebSocket
- SP Day 29: LAN, 사설 IP 주소, Windows 방화벽, 네트워크 프로필
- SP Day 31: 트랜잭션
- SP Day 37: Dockerfile, 멀티스테이지 빌드, 레이어 캐시, .dockerignore, 컨테이너 이미지, Docker Compose, 볼륨
- SP Day 38: 도메인 이름, TLS, 콜드 스타트, 관리형 데이터베이스
- SP Day 39: 방송 리허설

### Shared terms owned by P2 (SP Day that teaches it from scratch → term)

- SP Day 2: 프론트엔드, 백엔드, API, 포트, localhost
- SP Day 3: Vite, 개발 서버, npm, 실행 정책
- SP Day 8: 연결 문자열, user-secrets, EF Core, DbContext, NuGet, 솔루션, launchSettings.json
- SP Day 9: 열거형, 마이그레이션, dotnet-ef, 기본 키
- SP Day 13: ASP.NET Core Identity, 쿠키, 인증, 인가, 검증
- SP Day 14: 요청 제한, 해싱, 서비스 계층, 의존성 주입
- SP Day 15: 폴링, SSE, 프록시
- SP Day 16: 미들웨어
- SP Day 19: XSS, 쿠키, 출처
- SP Day 25: xUnit
- SP Day 33: 단위 테스트, xUnit, Assert
- SP Day 34: 통합 테스트, WebApplicationFactory, 환경 변수
- SP Day 37: wwwroot, dotnet publish, 폴백 라우트, 환경 변수
- SP Day 38: 리버스 프록시, X-Forwarded-For, HTTPS

### Shared terms owned by P1 (SP Day that teaches it from scratch → term)

- SP Day 2: Git, 커밋
- SP Day 16: 오버레이, 브라우저 소스
- SP Day 27: 정규 표현식

The P3 list above is the R38 "shared term → SP Day that teaches it" list: those Days' 목표/이미 배운 것 do not assume P3 (Day 7 teaches Docker/PostgreSQL/psql from zero with the Docker-free path; Day 15 WebSocket; Day 31 트랜잭션; Day 37 Dockerfile/multi-stage). The P1/P2 lists are review links only.

## P2-assumption list (what SP relies on from P2, linked by Day; none re-defined in SP)

P2 Day 1 풀스택·API · Day 2 PowerShell·경로 · Day 3 npm·실행 정책 · Day 4–6 TypeScript·interface·유니온·제네릭·모듈 · Day 7 Vite·`erasableSyntaxOnly`(유니온 대신 enum 금지) · Day 8 async/fetch·로딩/오류 UI · Day 9–15 .NET 10·C#·컬렉션·class/record·interface·LINQ·예외·Task·열거형 · Day 16 HTTP·상태 코드·`.http`(REST Client) · Day 17 Minimal API·포트·dotnet watch · Day 18 CRUD·라우트 매개변수·TypedResults · Day 19 SQL · Day 20 EF Core·DbContext·마이그레이션·dotnet-ef · Day 21 비동기 쿼리 · Day 22 1:N·외래 키·Include · Day 23 DTO·AddValidation(public record 함정)·DI·서비스 계층·MapGroup · Day 24 ProblemDetails·appsettings·ILogger·미들웨어 · Day 25 인증/인가·해싱·쿠키·Identity API(`?useCookies=true`) · Day 26 RequireAuthorization·`/api/me` 204·user-secrets · Day 27 CORS·Vite 프록시·ApiError · Day 28 해시 라우터 · Day 29 UTC vs KST · Day 30 본인만 수정 404 · Day 31 로그인·폼 화면 · Day 33 폴링→SSE·OBS 오버레이 · Day 34 XSS·CSRF·SameSite·HttpOnly·요청 제한 429·HTTPS · Day 35 xUnit · Day 36 WebApplicationFactory·`tsc --noEmit` · Day 37 Git 흐름 · Day 38 vite build→wwwroot·dotnet publish·MapFallbackToFile · Day 39 배포·환경 변수 `__`·리버스 프록시·X-Forwarded-For · Day 40 포트폴리오.
Terms the controller named (포트, localhost, 출처, 상태 코드, Promise) are not defined in SP; they now exist in p2.md and the outline header tells writers to link them. P1 knowledge used: Day 1, 7, 13–14, 17–21, 24–30 (notably 정규 표현식, OBS 브라우저 소스/오버레이).

## Design decisions the controller should know (deviations from a literal reading)

1. **Test project created at Day 25** (spec puts tests at Day 33–34): the socket code can only be run without 치지직 through the emulator test, so Day 25 creates `ImageDonation.Tests` + `ChzzkEmulator.cs` + first `ChzzkSessionSourceTests`. Day 33 = unit tests (matcher, image, banned words), Day 34 = integration + front tests, Day 36 adds FailingDeleteStorage.
2. **Test-mode backend at Day 26** (spec lists 가짜 후원 발생기 at Day 28) so the default path works for Days 26–28; Day 28 keeps the dashboard generator UI, chat notice and failure handling.
3. **Practice folder `C:\dev\sp-practice\` (api.http + images)** outside the project: the reference has no `.http` file, so API practice before the UI exists (Days 10–27) uses REST Client from P2 Day 16 without adding a non-reference file to the project.
4. **Learner migrations**: 5 (InitialCreate D9, AddIdentity D13, AddChzzkTokens D23, AddDonationEvents D26, AddSafety D31) vs reference 2; final schema identical. DonationEvents is created minimal from the start (no nickname/text columns ever stored).
5. **Dev-only intermediates** (each marked 중간 단계 with the Day that replaces it): `GET /api/dbcheck` (D8→D9), `test-stream` SQL row (D9→D13), `.bin` uploads (D10→D11), `public/sample-donations.json` (D5→D19), overlay receiving unmoderated donations via `Clients.All` (D15→D16→D17), `ChzzkInfo.SessionConnected=false` (D23→D26), ChzzkToken without tokens (D23→D24).
6. **Dev 치지직 redirect URI** `http://localhost:5173/api/chzzk/callback` (through the Vite proxy) set in user-secrets during Days 21–36, because the reference default 5080 lands on a server with no built UI until Day 37. Config-only deviation; unverified against the real server.
7. **Docker DB port**: Day 7 compose publishes `127.0.0.1:5432` for development; the final reference compose (Day 37) does not. Day 37 gives the verified one-off dev-DB command (`docker compose run -d --rm --name image-donation-devdb -p 127.0.0.1:5432:5432 db`) and warns to keep `.env` DB values identical to Day 7 (the volume keeps the first password).
8. Spec Day 35 "관리자 통계": the reference has no admin UI → Day 35 covers it with operator SQL in README (plus the reference's report-review query). Spec Day 36 S3: concept/design only, no code (none in reference, unverified).
9. index.css growth per Day is my allocation of the reference's rule blocks; writers should take classes as the Day's components need them.

## Concerns / things for other owners

- **Reference ApiFactory default** `TEST_DATABASE_URL` = `…Username=wzh;Password=wzh` (sandbox creds) will fail on learner PCs. Day 34 tells learners to set `TEST_DATABASE_URL` (user env var) and create `image_donation_test`; the reference owner may want a neutral default.
- **Final compose has no DB port** (see decision 7) — fine for production, but it breaks the Docker dev loop after Day 37; handled in text, flagged in case the reference owner prefers a compose override file.
- Outline is large (≈326k chars) because each Day lists its full start state; writers read only their own block.
- Glossary links in sp.md (`#/day/sp-dNN`) only validate after the controller merges `_meta.json`.
- If any later glossary (e.g. p2/p3 fix rounds) adds a heading that SP owns, re-run the generator: it fails loudly on collisions.

## Could not verify (also listed in outline section 8)

Real 치지직 integration end to end (OAuth, token exchange/refresh, `users/me` fields, session URL, subscribe, DONATION payload shape, `payAmount` type, chat send); whether the developer center accepts `http://localhost` redirect URLs (including the 5173-through-proxy variant); scope review time; quota numbers; 치지직 developer terms; SkiaSharp actually running on Windows; Windows 11 specifics (PowerShell outputs, winget PostgreSQL paths, Docker Desktop on Home, Data Protection key folder, firewall dialogs, REST Client multipart run); OBS compositing; any SP deployment (Day 38 options are documentation-only); exact error-message texts, `dotnet new web` file list and per-Day test counts (Day writers must capture by running).

## Self-review

- Prerequisite order: every concept in a Day's 목표 is either in its 이미 배운 것 (SP Day or P1/P2 link) or marked "오늘 처음". Forward references are only explicit "Day N에서" previews.
- Every reference file appears by Day 37 at latest and reaches its final form by its last event (machine-checked).
- Windows realities scheduled in 자주 막히는 곳: execution policy (D3), installer/UAC/winver/Home/virtualization/WSL (D7), ports 5173/5080/5432/8080 (D3, D7, D8, D37), firewall + network profile (D25, D29, D39), OneDrive/Korean/space paths (D1, D10), CRLF (D2), antivirus/file locks (D10, D12, D31), PowerShell 5.1 `&&` (D8), console encoding (D7, D9), HEIC (D11, D29), power saving (D39).

## Fix round 1

Status: DONE. Commits: none (NO GIT). How: the original data files are unchanged. A new patch module in the generator applies the fixes, and each patch asserts that its target text occurs exactly once. The module is `/tmp/claude-0/-home-user-web-zero-to-hundred/a3ed5e68-2ed7-58a6-8548-3d657f4039ce/scratchpad/task29/fix1.mjs`. The new appendix is `…/task29/appendix.md`. `header.md` and `gen.mjs` are updated. All SP files are regenerated from these, so the 시작 상태 lists still equal the previous Day's end state by construction, and every outline Day heading equals `_meta.json` (checked by script).

### Files changed in this round
- textbook/content/sp/_outline.md (regenerated)
- textbook/content/sp/_meta.json (regenerated: minutes and summaries/keywords for Days 22, 26, 28, 30–36)
- (textbook/content/glossary/sp.md regenerated byte-identical — unchanged this round, still 125 terms)
- reference/sp-image-donation/README.md line 113 only: the PowerShell secret command (R47)

### Per-finding changes (line numbers are in the new `_outline.md`)
1. Spec 2.5 limits are on **Day 25**, L1576, as a `:::warn`: "미션 후원은 받을 수 없다" (the official-doc sentence is unconfirmed; cites external-facts 10.7), and "API로 방송 화면에 미디어를 직접 넣는 기능은 없다 → OBS 브라우저 소스(Day 18)".
2. Day 25's 끝 상태 확인 (L1615–1619) now has three 기본 경로 lines and one 선택 단계 line ("오늘은 없다 … Day 28"). The generator now fails if any Day 21–28 lacks either label.
3. Section 9 appendix of fixed intermediate shapes (L2888–), referenced from the Day blocks and file map:
   - A: sample donations (L2892). Referenced by D4 L~265 and D5.
   - B: `DonationDraft` and `onSubmit` (L2904), plus the Day 5 App, Day 6 alert and Day 29 replacement.
   - C: `useOverlayHub` signature and return value for D15, D16 and D18, the list-version `Overlay.tsx`, and D15 `main.tsx` (L2924).
   - D: `ChzzkSessionSource` constructor on D25 `(logger)`, D26 `(logger, time) : IDonationEventSource`, and D28 the reference 4-arg constructor + BackgroundService. Includes the matching `CreateSource()`s and the registration. Avoids CS9113 unused-parameter warnings (L2966).
   - E: practice test `ChzzkSessionSource_ConnectsToEmulator_GetsSessionKey` with its body (L2995).
   - F: `api.http` (L3023):
     - `@host = http://localhost:5080`. `@slug` is `test-stream` on D10–12, then `my-stream`. `@id` from D17.
     - Requests are named `### N. 설명 (Day N)`, numbered 1–17 across D10, 11, 13, 14, 16, 17, 26 and 27.
     - The boundary is `ImageDonationBoundary`.
     - A D11 event was added to the file map for requests 3 and 4.
   - G: D10 `.bin` `LocalImageStorage` with `[GeneratedRegex("^[0-9a-f]{32}\\.bin\\z")]`, the `IsValidFileName` check, `SaveAsync(byte[], ct)` and the endpoint call (L3121). Day 11 changes it to the reference signature.
   - The skeletons were not compiled or run here (stated at the top of section 9).
4. Rebalancing. This uses the reviewer's default, plus one extra move to lighten D34. The minutes after the change are 22:105, 26:110, 28:110, 30:110, 31:110, 32:110, 33:120, 34:115, 35:95 (item 6) and 36:110. All Days stay within 60–120, and the total is now 4325.
   - D22 L1390 takes `GetSessionUrlAsync`, `SubscribeDonationAsync` and `SendChatAsync`.
   - D28 L1804 takes the BackgroundService conversion (`ExecuteAsync`/`SyncConnectionsAsync`/`SubscribeAsync`, the reference constructor, `AddHostedService`, `Chzzk:SessionCheckSeconds`). D26 keeps `: IDonationEventSource` only. The server-start log check and the optional session-connect check moved to D28.
   - D30 L1942 takes `TestDonationPanel`, the 치즈 대기 tab, `sendTestDonation` and `.panel`/`.inline-form`, with a full no-approval flow check.
   - D32 L2097 takes `/media` status gating and the `ImageFile` index. This adds a new learner migration `AddImageFileIndex`, so there are 6 migrations (header rule 9). D31 now says the reported image URL stays open for one day until D32.
   - D33 L2158 takes `BannedWordFilter` (test written first) and the PublicEndpoints banned-word check. D20's "거르기는 Day 31" now says Day 33.
   - Extra move: `ChzzkApiClientTests` + `StubChzzkHandler` go from D34 to D36 L2375, as a second test double. D24's forward reference was updated. Server test counts: D34 = 50, D36 = 54.
   - D11 L644/648: paste `ImageProcessor` and read it. Learners hand-write only `HasAllowedSignature`; `ChooseDecodeSize`/`ApplyOrigin` are read-only.
   - D19 L1174: LoginPage is pasted (same shape as P2 Day 31). The A/R shortcuts stay on D19 because spec 3.4 lists 단축키 there.
   - D25 `ChzzkEmulator.cs`: paste and read.
5. The PowerShell 5.1-safe key command `$b = New-Object byte[] 32; [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b); [Convert]::ToBase64String($b)` is used in D14 L841 and referenced in D37 L2452 and the `.env` file-map entry. Both places carry "Windows 실기 미확인". The same command is in the reference README L113 (R47). The generator now rejects the old static `GetBytes(` form. I could not run it: there is no PowerShell in this sandbox (`pwsh` is absent).
6. Forward uses, now introduced as "오늘 처음":
   - D10 L583: `byte[]`/`MemoryStream`/`CopyToAsync`, `[GeneratedRegex]` + partial, and `\z`. D27 now back-links to D10.
   - D11 L648: a `:::info 읽기만 해요` box for `ReadOnlySpan<byte>`, `u8`, ranges, collection expressions, `is not (A or B)` and `switch`. The learned line now cites `byte[]`(D10), using 선언(P2 D15) and 패턴 매칭(P2 D13) instead of "P2 Day 11".
   - D19 L1180: `keydown`/`e.key`/`removeEventListener` and `reduce`.
   - D13 L770: `SignInManager.SignOutAsync`. P2 code uses it, but the P2 outline never names it.
   - D23 L1448: `UserManager.FindByIdAsync`/`GetUserAsync`/`CreateAsync` and `SignInManager.SignInAsync`.
   - D35 L2315: `count(*)`, `GROUP BY`, `JOIN`/`LEFT JOIN`, explained on the README query. The learned line is fixed to P2 D19 SELECT/WHERE/ORDER BY.
7. Back-links:
   - D4 L259 → [[전개 구문]] P2 D8 + `Record<K, V>` P2 D6
   - D9 L523 → C# [[열거형]] P2 D10
   - D17 L1064 → AsNoTracking P2 D30
   - D18 L1123 → setTimeout P2 D8 (setInterval P1 D26)
   - D19 L1183 → instanceof P2 D27
   - D25 L1579 → ConcurrentDictionary "오늘 처음"
   - D7 L412 → "[P3 Day 33]~[P3 Day 34]"; D37 L2448 → "[P3 Day 40]"
8. Cookie and port fixes:
   - D19 L1233: the cause is localhost vs 127.0.0.1/LAN IP, because ports don't isolate cookies.
   - D23 L1494: the cause is a host mismatch, or the callback landing on 5080 where there is no UI yet.
9. D10 L582: `big.jpg` is now 7,000,000 bytes, with the reason (it must be larger than the 5 MB setting and smaller than 10 MB + 64 KB). The pitfall now explains the >10 MB case, and the file-map note is updated.
10. D24 L1552: `SetApplicationName` changes the discriminator, so the learner logs in once more; this is also added as a pitfall.
11. D37 L2500: log in with the existing account (shared `pgdata`). Only Docker-free learners sign up fresh. Explained why dev images are 404 in the container (PC `media` vs `/data/media`), and why dev cookies and stored 치지직 tokens are unusable (`%LOCALAPPDATA%` keys vs `/data/keys`).
12. D9 L516: Donation.cs stays equal to the reference, and the Day 14/27 explanation is body text only (no added comments).
13. D26 L1651: no relay code is kept, with the reason stated: the reference has no relay code and it is unverified, so the verified-code-only rule (spec 5.3 / CONTENT-GUIDE) applies. external-facts §11 was not edited.
14. D34 L2228: the Docker-free `TEST_DATABASE_URL` (`Host=localhost;…;Username=postgres;Password=<설치 때 정한 비밀번호>`) sits next to the Docker one.

### Spec 3.4 deviation list (also in outline header rule 13, L26)
Every Day keeps its spec title and core theme.
- Test project created on D25 (spec D33).
- Test-mode backend (`FakeDonationSource`, `POST /api/dashboard/test-donation`) on D26 (spec D28).
- ChzzkApiClient session/subscribe/chat methods on D22.
- Real receiver's BackgroundService conversion on D28 (from D26).
- Dashboard test-mode panel + "치즈 대기" tab on D30 (spec D28 "가짜 후원 발생기" → D30 "테스트 후원").
- `/media` status gating + `ImageFile` index on D32 (from D31).
- `BannedWordFilter` + enforcement on D33 (spec D31 "금지어"; saving stays on D20).
- `ChzzkApiClientTests`/`StubChzzkHandler` on D36 (from D34).
- Paste-and-read instead of typing: D11 `ImageProcessor`, D19 `LoginPage`, D25 `ChzzkEmulator`, and most D34 tests.
- Already approved: C:\dev\sp-practice, the Vite 5173 redirect (config only, unverified), and 6 learner migrations vs 2 in the reference.

### Commands and output
```
$ node gen.mjs /home/user/web-zero-to-hundred
ok: outline 346771자, 용어 125개, shared 83개, 레퍼런스 파일 102개 확인
  (all checks pass: 40 days, 60–120 min, term ownership vs p1/p2/p3, shared terms exist,
   [[…]] resolve, 102 reference files covered, no placeholders, Day 21–28 split, no PS 5.1-incompatible command)

# scratch merge: every on-disk _meta.json (p1, p2, p3, sp) + every glossary (p1, p2, p3, sp)
$ node build.mjs --check --allow-missing --content <scratch>/content
경고 E_CUR_FILE_MISSING p1: Day 파일 18개가 없어 … / p2 40 / p3 45 / sp 40
검사 통과: Day 155개, 페이지 4개, 결과 크기 2.19 MB        (exit 0, 0 errors)
heading duplicates across p1/p2/p3/sp: []
outline Day headings == _meta.json (title, minutes): True; minutes 80–120
```
Still not verified, and still marked in the outline: the appendix skeletons (not compiled here), the PowerShell command on Windows, REST Client multipart, and everything in section 8.
