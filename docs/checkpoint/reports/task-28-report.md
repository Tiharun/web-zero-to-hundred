# Task 28 report — SP reference (React + ASP.NET Core + SignalR + PostgreSQL)

Status: **DONE_WITH_CONCERNS** (main concern: the ImageSharp 4.x license key, see Concerns #1). Commits: none (NO GIT).

## What I implemented

`reference/sp-image-donation/`: a multi-streamer image-donation service that never handles money.

- **Server** (`server/ImageDonation.Api`, net10.0, `.slnx`). Minimal APIs, Identity cookies (`MapIdentityApi` under `/api/auth`), EF Core + Npgsql 10.0.3 with one migration (`InitialCreate`, text[] for BannedWords, timestamptz), and SignalR (typed hubs). Other parts:
  - **States** follow the brief verbatim (`AwaitingCheese/Pending/Approved/Shown/Rejected/Expired`). Every transition is a single conditional `ExecuteUpdate` (`WHERE Status = from`), so a donation can't be approved or matched twice, even concurrently.
  - **Settings** use the brief's names and limits verbatim (`Mode`, `MinCheese`, `AutoApprove`, `DisplaySeconds` 3..30, `MinIntervalSeconds` 0..60, `MaxFileMb` 1..10, `BannedWords`). They are validated with `AddValidation()` on a public record.
  - **Public API**: `GET /api/public/streamers/{slug}` and multipart `POST …/donations` → `{id, status, code?}`. The code is `#` + 4 characters from [A-Z0-9], made with a CSPRNG and unique per streamer among AwaitingCheese donations. The POST is rate-limited per IP (429). There is a per-streamer size check (413) and a global 10MB+64KB request limit. Banned words and blocked senders are rejected. `GET /media/{file}` only serves names that match the GUID.webp pattern.
  - **Dashboard API**: everything in the brief, plus `GET /overlay-token` and `POST /donations/{id}/block`.
  - **Hubs**:
    - `/hubs/overlay?token=` sends `ShowDonation(dto)` and `Clear()`, and accepts `MarkShown(id)` from the overlay (Approved→Shown). A bad token gets 401 before the hub, from middleware in `OverlayHub.CheckTokenAsync`. The group name contains the token, so rotating it cuts off overlays still open on the old URL.
    - `/hubs/dashboard` requires login and sends `DonationCreated` / `DonationUpdated` to that streamer's group.
  - **Image pipeline** (ImageSharp 4.1.3): magic number check → `Identify` (rejects >50M pixels) → decode → `AutoOrient` → longest side resized to ≤1280 (small images are not enlarged) → EXIF/ICC/IPTC/XMP/CICP stripped from the image and every frame → WebP q80 → saved under a random GUID name. **Animated GIF/WebP policy: keep the first frame only** (`MaxFrames = 1`).
  - **Retention** (`RetentionService : BackgroundService`):
    - AwaitingCheese older than 30 min → Expired, and the image is deleted.
    - After 7 days, donations, their files, and DonationEvents are deleted.
    - Orphan files older than 7 days are deleted.
    - Rejected images are deleted right away.
  - **CHZZK**:
    - `ChzzkApiClient`: account-interlock URL, code exchange, refresh with the single-use rotating refresh token (stored again right away; guarded by a semaphore), `users/me`, session URL, subscribe/donation, chat send. Parsing is tolerant: `expiresIn` and `payAmount` may be strings or numbers.
    - Tokens are encrypted at rest with Data Protection.
    - `ChzzkSessionSource : BackgroundService, IDonationEventSource` uses SocketIOClient 4.0.5 with `EIO=V3`, WebSocket, `Query["auth"]` (the URL is split into origin + auth), and no reconnection. It subscribes using the `sessionKey` from `SYSTEM connected`. The DONATION payload may be a JSON string or an object. It reconnects with a new session URL every 60 s if the socket dropped.
    - Login callback: the state cookie is compared in fixed time; the user is found by channel, linked to the current local login, or created; then signed in with the same Identity cookie.
    - Secrets come only from user-secrets or environment variables (`Program.cs` fails fast if the connection string or `Security:IpHashKey` is missing).
  - **Test mode**: `FakeDonationSource` builds the exact CHZZK DONATION JSON and passes it through the same `ChzzkSessionSource.ParseDonation`. Both sources are wired to `DonationService.HandleCheeseEventAsync` in `Program.cs`.
  - **Security headers**: nosniff, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer` (keeps the overlay token from leaking). The sender IP is stored only as an HMAC-SHA256 hash (key `Security:IpHashKey`).
- **Client** (`client`): Vite react-ts template with its default **Oxlint** (no ESLint). React Router 8.5.1 in Declarative mode (`BrowserRouter`), routes `/d/:slug`, `/dashboard`, `/settings`, `/onboarding`, `/login`. `StreamerLayout` checks login and passes `me` to pages through `Outlet` context. `overlay.html` is a separate Vite entry. State uses only useState/useEffect/custom hooks (plus one useRef/useCallback in the overlay connection hook). Never `dangerouslySetInnerHTML`. Korean comments on key lines. Uploads use XHR so they can show progress. The build output goes to `server/ImageDonation.Api/wwwroot` (gitignored), so one server serves the UI and the API.
- **tools/chzzk-emulator**: socket.io@2.5.0 emulator from research Appendix C.2, with a random port and logging of auth/EIO.
- **Docker**: multi-stage `Dockerfile` (`node:26-slim` → `mcr.microsoft.com/dotnet/sdk:10.0` → `aspnet:10.0`, non-root `$APP_UID`, `/data` volume). `docker-compose.yml` runs api + `postgres:18` (volume at `/var/lib/postgresql`) with healthcheck/depends_on. Also `.env.example` and `.dockerignore`.
- **README**: both run paths (Docker; Docker-free with native PostgreSQL 18 + user-secrets + `dotnet run`, ruling R18), test mode walkthrough, CHZZK setup, image/security/license notes, the verification record, and the list of unverified items (Step 7).

## Tests and TDD evidence

RED. I wrote all tests first against stub signatures (`NotImplementedException`) and an app with no endpoints.
- `dotnet test --no-build` → `Failed!  - Failed: 28, Passed: 0, Total: 28`. Units failed with `System.NotImplementedException`; integration tests failed with `HttpRequestException … 404 (Not Found)` because the endpoints didn't exist. This was expected: nothing was implemented yet.
- `npx vitest run` → `FAIL src/pages/DashboardPage.test.tsx … Failed to resolve import "./DashboardPage"` (same for DonatePage). This was expected because the pages didn't exist.
- Later I added the animated-GIF policy test and mutation-checked it: removing `MaxFrames = 1` makes it fail (`Failed: 1`); restoring the line makes it pass.

GREEN (final runs):
- `cd reference/sp-image-donation/server && dotnet test` → `Passed!  - Failed: 0, Passed: 29, Skipped: 0, Total: 29` (3 repeated runs, stable). The brief's tests are all present with the exact names:
  - Unit: `MagicNumber_RejectsRenamedTextFile`, `ImageProcessor_StripsExif_AndResizes`, `CodeMatcher_MatchesCodeInMessage_CaseInsensitive`, `CodeMatcher_IgnoresBelowMinCheese`, `CodeMatcher_IgnoresExpired`, `CodeMatcher_NoDoubleMatch`, `BannedWords_Rejects`, `ChzzkApiClient_RefreshRotatesToken`.
  - Integration: `PublicDonation_FreeMode_CreatesPending`, `Approve_SendsShowDonation_ToOverlayGroup`, `OverlayHub_RejectsBadToken`, `TestDonation_MatchesAwaitingCheese`, `Upload_TooLarge_413`, `RateLimit_429`, `Retention_DeletesOldFiles`.
  - Extras: magic numbers for all 4 formats + SVG rejection, a fake JPEG header with garbage, the animated-GIF first-frame policy, no upscaling, rejecting longer code tokens, code format, refresh failure → `ChzzkApiException(401)`, `ParseDonation` string/object, `SplitSessionUrl`, **`ChzzkSessionSource` against the local Socket.IO 2.5.0 emulator** (EIO=3, auth query, sessionKey, string and object payloads, string and number payAmount), non-image/banned-word/too-long nickname/404, rotating the token cuts off the old overlay, test-donation requires login, and the 30-minute expiry.
  - Integration tests use `TEST_DATABASE_URL`, a fresh schema per factory (`Search Path`), migrations applied by the app itself, and `DROP SCHEMA … CASCADE` afterwards. Checked: no leftover schemas, nothing in `public`.
- `cd client && npm ci && npx tsc -b && npm test && npm run build` → `Test Files 2 passed (2) / Tests 5 passed (5)`, `✓ built`. The brief's `DonatePage_ShowsCodeInCheeseMode` and `Dashboard_ApproveButtonCallsApi` are included, plus free-mode thanks, the client-side size limit, and emergency stop. `npm run lint` (Oxlint): 0 warnings. Test output is clean.
- `node --test tests/reference/sp.e2e.test.mjs` → `ok 1 … # pass 1 # fail 0` (3 runs, ~14 s each).
  - Setup: builds the client and the API, creates its own schema with psql, picks a free port, and runs the built dll by PID with the API serving the built client.
  - Flow in Chromium: dev register/login → onboarding → settings (Cheese, min 1000, 30 s) → open the overlay (waits for `data-status="connected"`) → open the dashboard (realtime) → viewer uploads a code-generated PNG (with an XSS-looking message) → code shown → card appears live as "치즈 대기" → test donation with the lowercase code → "검수 대기" with "치즈 1,000개 확인" → shown in the Pending tab → approve → the overlay shows the image (decoded, naturalWidth 64, nickname) → emergency stop → the overlay figure is detached.
  - Console errors are 0 on all three pages. Teardown kills the process by PID (SIGTERM, then SIGKILL after 10 s), drops the schema, and removes the temp dir. Checked: no leftover process, schema, or temp dir.
- Docker (Step 6), run with a scratch-only Dockerfile variant that adds proxy CA trust lines (needed by this sandbox only; the committed Dockerfile is unchanged) and a compose override for a unique project name and free port:
  - Default `BUILD_CONFIGURATION=Release`: npm ci, client build and `dotnet restore` succeed, then `dotnet publish -c Release` **fails at the ImageSharp license check** (`No Six Labors license found…`).
  - `BUILD_CONFIGURATION=Debug`: the image builds; `docker compose up -d` → db healthy → `/healthz` 200 after 4 s; `/`, `/overlay.html`, SPA fallback 200; unknown `/api/*` 404; register/login/onboard/upload (201)/media 200 (WebP).
  - After `--force-recreate api`, the old cookie still works and media is still served, so the keys and media volume persist.
  - `down -v` and image removed; no `wzh-t28*` containers, volumes or images remain.
  - Note: the base images (node:26-slim, dotnet sdk/aspnet 10.0, postgres:18) stay in the shared Docker cache; they may already have been there.

## Files created (97, controller commits exactly these)

```
reference/sp-image-donation/.dockerignore
reference/sp-image-donation/.env.example
reference/sp-image-donation/.gitignore
reference/sp-image-donation/Dockerfile
reference/sp-image-donation/README.md
reference/sp-image-donation/docker-compose.yml
reference/sp-image-donation/client/.gitignore
reference/sp-image-donation/client/.oxlintrc.json
reference/sp-image-donation/client/index.html
reference/sp-image-donation/client/overlay.html
reference/sp-image-donation/client/package-lock.json
reference/sp-image-donation/client/package.json
reference/sp-image-donation/client/public/favicon.svg
reference/sp-image-donation/client/src/App.tsx
reference/sp-image-donation/client/src/api.ts
reference/sp-image-donation/client/src/components/DonationCard.tsx
reference/sp-image-donation/client/src/components/DonationForm.tsx
reference/sp-image-donation/client/src/components/DonationResult.tsx
reference/sp-image-donation/client/src/components/StreamerLayout.tsx
reference/sp-image-donation/client/src/components/TestDonationPanel.tsx
reference/sp-image-donation/client/src/donationList.ts
reference/sp-image-donation/client/src/hooks/useDashboardHub.ts
reference/sp-image-donation/client/src/hooks/useImagePreview.ts
reference/sp-image-donation/client/src/hooks/useMe.ts
reference/sp-image-donation/client/src/index.css
reference/sp-image-donation/client/src/main.tsx
reference/sp-image-donation/client/src/overlay/Overlay.tsx
reference/sp-image-donation/client/src/overlay/main.tsx
reference/sp-image-donation/client/src/overlay/overlay.css
reference/sp-image-donation/client/src/overlay/useOverlayHub.ts
reference/sp-image-donation/client/src/pages/DashboardPage.test.tsx
reference/sp-image-donation/client/src/pages/DashboardPage.tsx
reference/sp-image-donation/client/src/pages/DonatePage.test.tsx
reference/sp-image-donation/client/src/pages/DonatePage.tsx
reference/sp-image-donation/client/src/pages/LoginPage.tsx
reference/sp-image-donation/client/src/pages/OnboardingPage.tsx
reference/sp-image-donation/client/src/pages/SettingsPage.tsx
reference/sp-image-donation/client/src/test/setup.ts
reference/sp-image-donation/client/tsconfig.app.json
reference/sp-image-donation/client/tsconfig.json
reference/sp-image-donation/client/tsconfig.node.json
reference/sp-image-donation/client/vite.config.ts
reference/sp-image-donation/server/ImageDonation.slnx
reference/sp-image-donation/server/ImageDonation.Api/ImageDonation.Api.csproj
reference/sp-image-donation/server/ImageDonation.Api/Program.cs
reference/sp-image-donation/server/ImageDonation.Api/Properties/launchSettings.json
reference/sp-image-donation/server/ImageDonation.Api/appsettings.json
reference/sp-image-donation/server/ImageDonation.Api/appsettings.Development.json
reference/sp-image-donation/server/ImageDonation.Api/Data/AppDbContext.cs
reference/sp-image-donation/server/ImageDonation.Api/Dtos/AuthDtos.cs
reference/sp-image-donation/server/ImageDonation.Api/Dtos/DonationDtos.cs
reference/sp-image-donation/server/ImageDonation.Api/Dtos/SettingsDto.cs
reference/sp-image-donation/server/ImageDonation.Api/Endpoints/AuthEndpoints.cs
reference/sp-image-donation/server/ImageDonation.Api/Endpoints/ChzzkEndpoints.cs
reference/sp-image-donation/server/ImageDonation.Api/Endpoints/DashboardEndpoints.cs
reference/sp-image-donation/server/ImageDonation.Api/Endpoints/PublicEndpoints.cs
reference/sp-image-donation/server/ImageDonation.Api/Endpoints/TestModeEndpoints.cs
reference/sp-image-donation/server/ImageDonation.Api/Entities/BlockEntry.cs
reference/sp-image-donation/server/ImageDonation.Api/Entities/ChzzkToken.cs
reference/sp-image-donation/server/ImageDonation.Api/Entities/Donation.cs
reference/sp-image-donation/server/ImageDonation.Api/Entities/DonationEvent.cs
reference/sp-image-donation/server/ImageDonation.Api/Entities/Streamer.cs
reference/sp-image-donation/server/ImageDonation.Api/Entities/StreamerSettings.cs
reference/sp-image-donation/server/ImageDonation.Api/Hubs/DashboardHub.cs
reference/sp-image-donation/server/ImageDonation.Api/Hubs/OverlayHub.cs
reference/sp-image-donation/server/ImageDonation.Api/Migrations/20261101062441_InitialCreate.cs
reference/sp-image-donation/server/ImageDonation.Api/Migrations/20261101062441_InitialCreate.Designer.cs
reference/sp-image-donation/server/ImageDonation.Api/Migrations/AppDbContextModelSnapshot.cs
reference/sp-image-donation/server/ImageDonation.Api/Services/BannedWordFilter.cs
reference/sp-image-donation/server/ImageDonation.Api/Services/ChzzkApiClient.cs
reference/sp-image-donation/server/ImageDonation.Api/Services/DonationCodeMatcher.cs
reference/sp-image-donation/server/ImageDonation.Api/Services/DonationService.cs
reference/sp-image-donation/server/ImageDonation.Api/Services/ImageProcessor.cs
reference/sp-image-donation/server/ImageDonation.Api/Services/RetentionService.cs
reference/sp-image-donation/server/ImageDonation.Api/Services/Events/ChzzkSessionSource.cs
reference/sp-image-donation/server/ImageDonation.Api/Services/Events/FakeDonationSource.cs
reference/sp-image-donation/server/ImageDonation.Api/Services/Events/IDonationEventSource.cs
reference/sp-image-donation/server/ImageDonation.Api/Services/Storage/IImageStorage.cs
reference/sp-image-donation/server/ImageDonation.Api/Services/Storage/LocalImageStorage.cs
reference/sp-image-donation/server/ImageDonation.Tests/ImageDonation.Tests.csproj
reference/sp-image-donation/server/ImageDonation.Tests/ApiFactory.cs
reference/sp-image-donation/server/ImageDonation.Tests/BannedWordFilterTests.cs
reference/sp-image-donation/server/ImageDonation.Tests/ChzzkApiClientTests.cs
reference/sp-image-donation/server/ImageDonation.Tests/ChzzkEmulator.cs
reference/sp-image-donation/server/ImageDonation.Tests/ChzzkSessionSourceTests.cs
reference/sp-image-donation/server/ImageDonation.Tests/DonationCodeMatcherTests.cs
reference/sp-image-donation/server/ImageDonation.Tests/ImageProcessorTests.cs
reference/sp-image-donation/server/ImageDonation.Tests/OverlayHubTests.cs
reference/sp-image-donation/server/ImageDonation.Tests/PublicDonationTests.cs
reference/sp-image-donation/server/ImageDonation.Tests/RetentionTests.cs
reference/sp-image-donation/server/ImageDonation.Tests/StubChzzkHandler.cs
reference/sp-image-donation/server/ImageDonation.Tests/TestImages.cs
reference/sp-image-donation/server/ImageDonation.Tests/TestModeTests.cs
reference/sp-image-donation/tools/chzzk-emulator/emulator.cjs
reference/sp-image-donation/tools/chzzk-emulator/package-lock.json
reference/sp-image-donation/tools/chzzk-emulator/package.json
tests/reference/sp.e2e.test.mjs
```
Not committed (gitignored build outputs present on disk): `client/node_modules`, `tools/chzzk-emulator/node_modules`, `server/**/bin|obj`, `server/ImageDonation.Api/wwwroot`. `tests/reference/p3.e2e.test.mjs` is another agent's file; I didn't touch it.

## Self-review findings (fixed)

- The socket client wasn't disposed when `ConnectAsync` threw → now disposed.
- `/api/chzzk/login` without app config returned raw ProblemDetails during a navigation → now redirects to `/login?error=chzzk-config` with a Korean message.
- The overlay with no `?token=` retried forever → `main.tsx` now shows a message instead of connecting.
- `JSON.parse` on a non-JSON error page → made safe with `parseBody`.
- `/api/auth/me` returned 401 for anonymous users → now 204. A 401 shows up as a "Failed to load resource" console error on every login check.
- Oxlint `set-state-in-effect` in the preview hook → rewritten with FileReader plus a derived value.
- A lint-disable for effect deps → replaced by a stable `useCallback`.
- `!ignore && setX()` one-liners → plain `if` statements for beginners.
- The test factory left an empty temp parent dir → now uses a single-level temp dir.
- Npgsql printed a GSSAPI probe error (`libgssapi_krb5.so.2`) in the aspnet container → `GSS Encryption Mode=Disable` in the compose connection string (verified the log is gone).
- The `Image.Identify(...).FrameCount` assertion was wrong (it reports 0 for still WebP) → the test decodes and counts frames instead.

## Concerns / decisions for the controller

1. **ImageSharp 4.1.3 (pinned in research §0.3/§12) needs a Six Labors license key for Release builds.** Research §12 only exercised Debug builds.
   - Source: Six Labors docs (raw `SixLabors/docs` `articles/imagesharp/index.md`): "Projects that directly reference ImageSharp require a valid Six Labors license key at build time from version 3.2.0 in the previous major and 4.0.0 in the current major." The package ships `SixLabors.ImageSharp.targets`, which errors on Release and warns on Debug.
   - Verified here: local `dotnet build -c Release` and Docker `dotnet publish -c Release` both fail. `dotnet build`/`dotnet test` (Debug) show 4 license warnings.
   - What I did: kept the pin; the csproj reads `SixLaborsLicenseKey` from `$(SIXLABORS_LICENSE_KEY)`; the Dockerfile takes `ARG BUILD_CONFIGURATION=Release` and `ARG SIXLABORS_LICENSE_KEY`; `.env.example` sets `BUILD_CONFIGURATION=Debug` so the primary Docker path works for study without a key; README explains it.
   - Options: (a) keep 4.1.3 and teach getting a community key; (b) **pin 3.1.12** (the last line without build enforcement — same API used here, same Split License terms); (c) switch to SkiaSharp (MIT; native assets on Linux; not verified). The research doc §12 should be corrected whichever you pick.
2. **Animated GIF policy**: the brief says it was "decided in Task 1/outline", but I found no such decision in the research doc, spec or plan. I chose **first frame only** (safety and simplicity). It is documented in the README and in the donate-page hint, and pinned by a mutation-checked test.
3. **Additions beyond the brief's API list**, each needed for a listed feature:
   - `POST /api/dashboard/donations/{id}/block` — the only entry point that makes the BlockEntry entity useful.
   - `GET /api/dashboard/overlay-token` — the settings and onboarding pages need to show the URL.
   - Overlay→server hub method `MarkShown(id)` — performs the brief's Approved→Shown transition.
   - `/api/auth/me`, `/api/auth/logout`, `/api/auth/onboarding`, `/api/chzzk/login|callback`, `/healthz`.
   - Extra files beyond the brief's list: `Dtos/*`, `Services/BannedWordFilter.cs`, `tools/chzzk-emulator/*`, client components/hooks.
   - Not implemented: viewer "신고" (report) from spec Day 31 (YAGNI; the streamer moderates everything). The rest of Day 31 is covered (block, banned words, emergency stop).
4. **Facts the research doc should record**:
   - Identity-API register errors come back in English.
   - EF Core logs one `fail: … __EFMigrationsHistory` line on the very first migration (harmless; documented in README).
   - `Image.Identify().FrameCount` is 0 for still WebP.
   - The Npgsql GSS probe in the aspnet image.
   - Container builds in this sandbox need host networking and the proxy CA (verification-only; not in committed files).
5. **Environment differences**: the local test DB is PostgreSQL 16 (Docker verified the `postgres:18` image); SDK 10.0.114 vs the pinned 10.0.403; Node 22.23.4 vs 26 (the Docker client stage used `node:26-slim` successfully).
6. **Unverified** (listed in the README): the whole real CHZZK integration (OAuth, `users/me` field names, session URL, subscribe, real DONATION payload shape and `payAmount` type, chat send), localhost redirect allowance, scope review and quota, a Release build with a real Six Labors key, Windows 11 steps (PowerShell, winget paths, Docker Desktop/Home), and actual OBS compositing.
7. Data Protection keys are stored unencrypted in `/data/keys` (noted in README). The overlay token appears in the URL query, which is inherent to OBS browser sources; `Referrer-Policy: no-referrer` mitigates referrer leaks.

---

## Fix round 1 — Ruling R28: ImageSharp → SkiaSharp (MIT)

Status: DONE. Commits: none (NO GIT). This supersedes Concern #1 above and every ImageSharp/license-key statement in the first report.

### Changes
- **Packages**: removed `SixLabors.ImageSharp` 4.1.3 and pinned the current stable versions from NuGet (newest at the time: 4.155.0-rc.1 and 4.156.0-preview.1 are prereleases):
  - `SkiaSharp` **4.154.0** and `SkiaSharp.NativeAssets.Linux.NoDependencies` **4.154.0**, both MIT per the nuspec.
  - Package graph (nuspec): the net10.0 `SkiaSharp` group depends on `SkiaSharp.NativeAssets.Win32` and `SkiaSharp.NativeAssets.macOS`, so **Windows learners need nothing extra**. The Linux package has no dependencies and no `build/` targets, so there is no license step.
  - Release publish output contains `runtimes/win-x64|win-x86|win-arm64/native/libSkiaSharp.dll` and `runtimes/linux-x64/native/libSkiaSharp.so`.
  - Removed `<SixLaborsLicenseKey>` from the csproj and added a comment explaining the native assets.
- **ImageProcessor** re-implemented with SkiaSharp. The public interface is unchanged (`HasAllowedSignature`, `Process(byte[]) → ProcessedImage(Content, Extension, Width, Height)`, `InvalidImageException`, `MaxLongSide`), so no other code churned. Steps:
  1. Magic-number check first (JPEG/PNG/WebP/GIF).
  2. `SKCodec.Create(SKData)`; `null` means not an image. Then check the format allow-list and the 50M-pixel cap from the header.
  3. Decode **frame 0 only** into sRGB (`SKCodecOptions(0)`; anything but `Success` is rejected, including truncated files).
  4. Resize the longest side to ≤1280 (`SKBitmap.Resize` + Mitchell; no upscaling).
  5. Apply the EXIF orientation (`codec.EncodedOrigin`, all 8 cases via `SKCanvas` translate/rotate/scale) into a bitmap with no colour space, so the encoder attaches no ICC.
  6. `SKImage.Encode(Webp, 80)`. Re-encoding drops all metadata.
  - Every `SKData`, `SKCodec`, `SKBitmap`, `SKImage` and `SKCanvas` is in a `using`, or explicitly disposed on the failure path.
  - Replaced the obsolete `DrawBitmap(x, y)` overload (CS0618) with the `SKSamplingOptions` overload.
- **Tests** (`TestImages.cs` rewritten without ImageSharp):
  - The PNG and JPEG come from SkiaSharp. The JPEG gets an **EXIF APP1 segment written byte by byte** (TIFF IFD0 with Make, Orientation, Software) inserted after SOI.
  - The **3-frame GIF is written byte by byte** (GIF89a, 4-colour table, fixed 3-bit LZW with a Clear every 2 codes), because SkiaSharp can't encode GIF.
  - `ImageProcessor_StripsExif_AndResizes` now proves the input has `Exif` and the secret software string, and that the WebP output (1280×640) has no `Exif`/`EXIF`/`ICCP`/secret.
  - New `ImageProcessor_AppliesExifOrientation`: 200×100 red|blue JPEG with Orientation=6 → output 100×200, red on top, blue at the bottom, and the output origin is TopLeft.
  - `ImageProcessor_AnimatedGif_KeepsFirstFrameOnly`: the input FrameCount is 3; the output is a still image and its pixel is red (the first frame).
- **Docker/config**:
  - Dockerfile: removed `ARG BUILD_CONFIGURATION`/`ARG SIXLABORS_LICENSE_KEY`; it now publishes with `-c Release` unconditionally.
  - Compose: `build: .` (the license build args are gone).
  - `.env.example`: removed the license and BUILD_CONFIGURATION section.
  - `.gitignore`: removed `*.lic`.
- **README**:
  - Docker notes: Release always, no key.
  - Image pipeline rewritten (SkiaSharp steps, how metadata is stripped, the dispose habit).
  - The license section is now "이미지 라이브러리 (SkiaSharp 4.154.0, MIT)": the two packages, Windows needs nothing extra, and why not ImageSharp (build key since 3.2/4.0, Split License revenue threshold).
  - Test-image notes, troubleshooting (removed the Six Labors line), the verification table (30 tests, Release 0 warnings, Docker in Release), and the unverified list (replaced the "Release with a Six Labors key" item with "SkiaSharp not run on Windows; only the package graph and publish output were checked").
- **docs/research/external-facts.md** (§0.3 row and §12 only; diff hunks at lines 37 and 405–432):
  - The pin row is now `SkiaSharp / SkiaSharp.NativeAssets.Linux.NoDependencies | 4.154.0 / 4.154.0 | MIT, ImageSharp not used (R28)`.
  - §12 table: added a "빌드 시 라이선스 키" row and replaced SkiaSharp's 미실행 cells with `[실행]` facts.
  - Added the ImageSharp key-enforcement fact. Source: https://docs.sixlabors.com/articles/imagesharp/index.html `[원문: SixLabors/docs articles/imagesharp/index.md]`, with the exact quote plus the observed Debug warning and Release error, and a note that 3.1.12 ships no `.targets`.
  - Added the SkiaSharp verified facts: package graph, frame-0 decode, still WebP `FrameCount`=0, `EncodedOrigin`, Resize, obsolete `DrawBitmap`, GIF encode returns `null`, the aspnet:10.0 container loads the native lib.
  - Replaced the "선택" with SkiaSharp (reasons and costs) and added 교재 반영 결정 lines.
  - Not touched (outside §0.3/§12) but now stale: **Appendix A row "SkiaSharp·Magick.NET의 판별·EXIF·WebP 기능 | 미실행 확인 | ImageSharp 선택"** (line ~490) and **Appendix B bullet "`SixLabors.ImageSharp 4.1.3` 콘솔 앱 …"** (line ~498). They need a follow-up edit by whoever owns those sections.

### Tests (commands and output)
- RED for the new tests:
  - `ImageProcessor_AnimatedGif_KeepsFirstFrameOnly` first failed on a wrong assertion (`Expected: 1, Actual: 0`: Skia reports FrameCount 0 for still WebP), so I changed the assertion to `InRange(0,1)` plus the pixel check.
  - Mutation checks: `SKCodecOptions(0)`→`(2)` makes the GIF test fail (`첫 장면(빨강)이어야 해요: #ff0000ff`, i.e. blue); `ApplyOrigin(…, TopLeft)` makes the orientation test fail (`Expected (100, 200) Actual (200, 100)`). The code was restored and the restore confirmed.
- `cd reference/sp-image-donation/server && dotnet build -c Release` → `0 Warning(s) 0 Error(s)`. The Debug build also has 0 warnings; the Six Labors warnings are gone.
- `dotnet test` → `Passed!  - Failed: 0, Passed: 30, Skipped: 0, Total: 30`.
- `cd client && npm ci && npx tsc -b && npm test && npm run build && npm run lint` → `Tests 5 passed (5)`, `✓ built`, Oxlint 0 warnings.
- `node --test tests/reference/sp.e2e.test.mjs` → `ok 1 … # pass 1 # fail 0`; console errors 0.
- Scratch probe (SkiaSharp 4.154.0, Linux): encode Webp 86 B / Jpeg 285 B / Png 88 B / **Gif null**; `SKCodec.Create` returns null for text and for a fake JPEG header; still WebP FrameCount 0.
- Docker, using the scratch verify-Dockerfile (committed Dockerfile plus proxy-CA trust lines only, BuildKit `--build-context ccr=/root/.ccr --network host`, proxy build args), default **Release**:
  - Build succeeded (`RUN dotnet publish … -c Release`), and `/app/runtimes/linux-x64/native/libSkiaSharp.so` is present.
  - `docker compose -p wzh-t28-sp … up -d --no-build` → `healthz=200 after 4s`; `register=200 login=200 onboard=201`; `donate={"id":1,"status":"Pending"}`; a text file posted as `x.jpg` → `400`; `media=200 image/webp 88B` with header `RIFF…WEBPVP8`. No exceptions, DllNotFound or gssapi lines in the API log.
  - `down -v` and `docker rmi`: 0 wzh-t28 containers, volumes or images left. No leftover processes, schemas or temp dirs.

### Changed files in this round
```
docs/research/external-facts.md
reference/sp-image-donation/.env.example
reference/sp-image-donation/.gitignore
reference/sp-image-donation/Dockerfile
reference/sp-image-donation/README.md
reference/sp-image-donation/docker-compose.yml
reference/sp-image-donation/server/ImageDonation.Api/ImageDonation.Api.csproj
reference/sp-image-donation/server/ImageDonation.Api/Services/ImageProcessor.cs
reference/sp-image-donation/server/ImageDonation.Tests/ImageProcessorTests.cs
reference/sp-image-donation/server/ImageDonation.Tests/TestImages.cs
```

---

## Fix round 2 — review of the SkiaSharp-updated code (2 Important, report gap, promoted Minors)

Status: DONE. Commits: none (NO GIT).

### Changes, by item
1. **Retention expiry race (Important)**. `RetentionService` now finds candidate IDs with `AsNoTracking` (`FindExpiryCandidatesAsync`). `ExpireAsync` then runs one conditional `ExecuteUpdate` per ID, with `Status == AwaitingCheese && CreatedAt < expireBefore` in the WHERE clause. It deletes the image and notifies the dashboard only when exactly 1 row changed. A match that lands in between now wins.
2. **Approved dead end and a non-persisted emergency stop (Important)**.
   - `OverlayHub.OnConnectedAsync` sends the streamer's backlog to `Clients.Caller`: Approved donations whose `UpdatedAt` falls within `DonationService.OverlayBacklogWindow` = **30 minutes**, ordered by `UpdatedAt` then `Id`. Older approvals are not resent and stay "승인됨" until the 7-day deletion; this is documented.
   - New terminal state **`Cleared`**. `ClearOverlayAsync` moves each of the streamer's Approved donations Approved→Cleared with a conditional transition (one that became Shown meanwhile is left alone), deletes its image, notifies the dashboard, and then sends `Clear()`.
   - Updated the README state diagram, `DonationDto` (no image URL for Cleared), the client status label "긴급 정지됨", and the CSS.
3. **Report (spec Day 31)**.
   - New entity `Report` (DonationId, StreamerId, Reason ≤200, CreatedAt).
   - New `POST /api/dashboard/donations/{id}/report` with body `{reason}` (validated with `[Required, StringLength(200, MinimumLength=1)]`).
   - `DonationService.ReportAsync` runs in **one transaction**: a conditional transition to Rejected (anything except Rejected/Expired), the Report row, and the BlockEntry. The image is deleted after commit when the status actually changed. Another streamer's donation → 404, through the shared `ChangeAsync`.
   - No operator UI; the README has a "신고 확인 (서비스 운영자)" section with a SQL query.
   - Client: a "신고" button on cards (not shown for Expired), using `window.prompt` for the reason.
   - The overlay `<img onError>` skips an image that can no longer load, e.g. one deleted by a report while it sat in the queue.
4. **Token refresh concurrency**. `ChzzkApiClient.GetValidAccessTokenAsync(AppDbContext db, string userId)`:
   - It loads the row and, inside the lock, does `db.Entry(token).ReloadAsync()` and re-checks freshness.
   - Only then does it refresh, and it **saves inside the lock**.
   - Callers are updated (session source and chat).
   - Documented that the lock is per process.
5. **ChzzkSessionSource**:
   - The socket is added to the dictionary *before* `ConnectAsync`, so a SYSTEM handler failure can find and remove it.
   - A subscribe failure, any exception in the SYSTEM handler, or `SYSTEM revoked` → `DisconnectAsync(streamerId, client)`, which removes that exact instance, disconnects and disposes it.
   - `OnDisconnected` (server-initiated) → `TryRemove(KeyValuePair)` + `Dispose`.
   - The DONATION handler is wrapped in try/log.
   - `ParseDonation` returns null for broken JSON and for amounts outside 0..`int.MaxValue` (`TryGetDecimal`/`TryParse`), so a decimal→int overflow is no longer possible.
6. **Data minimisation**:
   - `DonationEvent` no longer has `DonatorNickname`/`DonationText`. A migration drops both columns.
   - Free-mode events are not stored at all.
   - Cheese-mode events store only source, amount, time and `MatchedDonationId`. Matching happens in memory first, then the row is written.
7. **Rotation**. `OverlayHub` remembers the token in `Context.Items`. `MarkShown` re-checks that it is still the streamer's current token; otherwise it calls `Context.Abort()` and does not mark Shown. Old connections were already cut off from receiving by the token-named group.
8. **`"bannedWords":["a",null]`** → 400 ("빈 값(null)") instead of a NullReferenceException 500.
9. **`JsonDocument` disposal**: `using var document = JsonDocument.Parse(...); …RootElement.Clone()` in `ChzzkApiClient.TryParse`, `ChzzkSessionSource.ToObject` and the test stub.
10. **Image memory**:
    - `MaxSourcePixels` = **100,000,000** (header check before decoding).
    - `MaxDecodePixels` = **4096×4096 = 16,777,216 px (64 MB RGBA)** for the bitmap actually decoded.
    - `ChooseDecodeSize` asks `SKCodec.GetScaledDimensions(k/8)` for k = 1..7 and takes the smallest size whose long side is ≥ 1280. Skia rounds JPEG down to 1/8 steps: in the first attempt 2000 px → 1250, which is why it loops. PNG/GIF can't be scaled, so they use full size and are rejected above the cap.
    - A 5000×4000 JPEG now decodes at 1875×1500.
11. **New tests** (listed below).
12. **README**:
    - Consistent counts (52 server, 6 client).
    - A plain CSRF paragraph: bodyless dashboard POSTs rely only on SameSite=Lax; same-site ≠ same-origin; don't co-host untrusted services; Antiforgery is an option.
    - The multicast `await handler(evt)` caveat (also in the `IDonationEventSource` comment).
    - New sections "개인정보 최소 수집" and "신고 확인"; memory caps; backlog/Cleared semantics; socket robustness; per-process refresh lock.
    - `LocalImageStorage` regex `$` → `\z`, with a comment.
13. **Client**:
    - `SettingsPage` and `OnboardingGuide` first loads have `.catch` plus an error UI (`role="alert"`).
    - `handleClear` and `handleRotate` catch rejections and show a notice.
14. **Research doc**: Appendix A line 491 and Appendix B line 499 updated to SkiaSharp, consistent with §12. Diff hunks are exactly `@@ -491 +491 @@` and `@@ -499 +499 @@`.
- (Optional, done) The hand-written LZW GIF encoder is replaced with an embedded **113-byte** GIF literal (4×3 px, 3 frames, commented per section). I generated it once and checked it with an independent decoder (Pillow: 3 frames; pixels red, green, blue).
- New migration `20261101072447_SafetyReportsAndMinimalEvents` (CreateTable Reports + IX_Reports_CreatedAt; DropColumn DonationEvents.DonatorNickname/DonationText). Before I added it, EF's `PendingModelChangesWarning` refused to start the app — a useful guard.
- Test infrastructure: overlay test connections now use **WebSockets** through TestServer (`WebSocketFactory` → `Server.CreateWebSocketClient()`), as in production. With long polling, an old-token connection would have died on its next poll and hidden the `MarkShown` check.

### New / changed tests
- **Overlay**: `Overlay_ConnectingLater_ReceivesApprovedBacklog`; `EmergencyStop_MarksCleared_AndIsNotResentOnReconnect` (Cleared, image 404, reconnect → the first ShowDonation is the new one, a late MarkShown doesn't revive Shown); `OverlayClear_OnlyReachesThatStreamersOverlay`; `RotateToken_OldConnectionIsAbortedOnMarkShown`.
- **SafetyTests**: `Reject_DeletesImageFile`, `Block_ThenNextUploadIsForbidden`, `Report_StoresReport_RejectsAndBlocks`, `Report_ReasonIsRequiredAndLimited`, `OtherStreamersDonation_Is404` (approve/reject/block/report all 404, state unchanged).
- **SettingsTests**: `Settings_OutOfRange_400` (DisplaySeconds 31, MaxFileMb 11, a 31-character word), `Settings_NullBannedWord_400`.
- **TestModeTests**: `CheeseEvents_StoreOnlyWhatMatchingNeeds`.
- **RetentionTests**: `Retention_DoesNotExpireDonationMatchedInTheMeantime` (candidates picked → concurrent match to Pending → `ExpireAsync` returns 0, still Pending, image kept).
- **ChzzkApiClientTests** (now DB-backed): `ChzzkApiClient_RefreshRotatesToken`; `ChzzkApiClient_ConcurrentCallers_RefreshOnce` (two DbContexts, stub delay 300 ms → both get `a2`, `UsedRefreshTokens == ["r1"]`); `ChzzkApiClient_RefreshFailure_Throws`.
- **ChzzkSessionSourceTests**: `ParseDonation_ReturnsNullForBrokenPayloads`. Emulator scenarios (`emulator.cjs [port] [donations|revoked|kick|malformed]`): `SubscribeFailure_DisconnectsSoNextCheckRetries`, `Revoked_Disconnects`, `ServerDisconnect_RemovesSocket`, `MalformedDonations_AreSkipped_SocketKeepsWorking`, `HandlerException_IsCaught_SocketKeepsWorking`.
- **ImageProcessorTests**: `ImageProcessor_RejectsHugeResolutionBeforeDecoding` (crafted PNG headers: 20000² > source cap; 5000×4000 PNG > decode cap); `ImageProcessor_LargeJpeg_IsDecodedScaledDown` (5000×4000 → 1280×1024; only possible through scaled decoding, since a full decode would exceed the cap).
- **Client**: `report asks for a reason and calls the API`.
- **e2e**: after the emergency stop, the card must show "긴급 정지됨".
- **Mutation checks**: removing the status/CreatedAt condition from the expiry UPDATE → the race test fails (`Expected: 0 Actual: 1`); removing `ReloadAsync` from the refresh lock → the concurrency test fails (`ChzzkApiException : INVALID_TOKEN`). Both were restored and the restore confirmed.

### Commands and output
- `cd reference/sp-image-donation/server && dotnet build -c Release` → `0 Warning(s) 0 Error(s)`. The Debug build has no warnings either.
- `dotnet test` → `Passed!  - Failed: 0, Passed: 52, Skipped: 0, Total: 52`, three runs in a row, stable.
- `cd client && npm ci && npx tsc -b && npm test && npm run build && npm run lint` → `Tests 6 passed (6)`, `✓ built`, Oxlint clean.
- `node --test tests/reference/sp.e2e.test.mjs` → `ok 1 … # pass 1 # fail 0`; console errors 0.
- Docker, **Release**, using the scratch verify-Dockerfile (committed Dockerfile plus proxy-CA trust lines only):
  - Build exit 0 (`dotnet publish … -c Release`). `healthz=200 after 3s`.
  - `register=200 login=200 onboard=201`; donate → `{"id":1,"status":"Pending"}`; `media=200 image/webp WEBPVP8`.
  - `approve=200 clear=204 status-after-clear=Cleared None media-after-clear=404`.
  - `report=200 upload-after-report=403`.
  - `__EFMigrationsHistory` holds `InitialCreate` and `SafetyReportsAndMinimalEvents`; `Reports` has 1 row.
  - The only `fail:` log line is the documented first-migration `__EFMigrationsHistory` notice.
  - `down -v` and `rmi` leave 0 wzh-t28 containers, volumes or images. No leftover processes, test schemas or temp dirs.

### Changed files in this round
```
docs/research/external-facts.md                       (Appendix A line 491, Appendix B line 499 only)
reference/sp-image-donation/README.md
reference/sp-image-donation/client/src/api.ts
reference/sp-image-donation/client/src/components/DonationCard.tsx
reference/sp-image-donation/client/src/donationList.ts
reference/sp-image-donation/client/src/index.css
reference/sp-image-donation/client/src/overlay/Overlay.tsx
reference/sp-image-donation/client/src/pages/DashboardPage.test.tsx
reference/sp-image-donation/client/src/pages/DashboardPage.tsx
reference/sp-image-donation/client/src/pages/OnboardingPage.tsx
reference/sp-image-donation/client/src/pages/SettingsPage.tsx
reference/sp-image-donation/server/ImageDonation.Api/Data/AppDbContext.cs
reference/sp-image-donation/server/ImageDonation.Api/Dtos/DonationDtos.cs
reference/sp-image-donation/server/ImageDonation.Api/Endpoints/DashboardEndpoints.cs
reference/sp-image-donation/server/ImageDonation.Api/Entities/Donation.cs
reference/sp-image-donation/server/ImageDonation.Api/Entities/DonationEvent.cs
reference/sp-image-donation/server/ImageDonation.Api/Entities/Report.cs                                   (new)
reference/sp-image-donation/server/ImageDonation.Api/Hubs/OverlayHub.cs
reference/sp-image-donation/server/ImageDonation.Api/Migrations/20261101072447_SafetyReportsAndMinimalEvents.cs           (new)
reference/sp-image-donation/server/ImageDonation.Api/Migrations/20261101072447_SafetyReportsAndMinimalEvents.Designer.cs  (new)
reference/sp-image-donation/server/ImageDonation.Api/Migrations/AppDbContextModelSnapshot.cs
reference/sp-image-donation/server/ImageDonation.Api/Services/ChzzkApiClient.cs
reference/sp-image-donation/server/ImageDonation.Api/Services/DonationService.cs
reference/sp-image-donation/server/ImageDonation.Api/Services/Events/ChzzkSessionSource.cs
reference/sp-image-donation/server/ImageDonation.Api/Services/Events/IDonationEventSource.cs
reference/sp-image-donation/server/ImageDonation.Api/Services/ImageProcessor.cs
reference/sp-image-donation/server/ImageDonation.Api/Services/RetentionService.cs
reference/sp-image-donation/server/ImageDonation.Api/Services/Storage/LocalImageStorage.cs
reference/sp-image-donation/server/ImageDonation.Tests/ApiFactory.cs
reference/sp-image-donation/server/ImageDonation.Tests/ChzzkApiClientTests.cs
reference/sp-image-donation/server/ImageDonation.Tests/ChzzkEmulator.cs
reference/sp-image-donation/server/ImageDonation.Tests/ChzzkSessionSourceTests.cs
reference/sp-image-donation/server/ImageDonation.Tests/ImageProcessorTests.cs
reference/sp-image-donation/server/ImageDonation.Tests/OverlayHubTests.cs
reference/sp-image-donation/server/ImageDonation.Tests/RetentionTests.cs
reference/sp-image-donation/server/ImageDonation.Tests/SafetyTests.cs                                     (new)
reference/sp-image-donation/server/ImageDonation.Tests/SettingsTests.cs                                   (new)
reference/sp-image-donation/server/ImageDonation.Tests/StubChzzkHandler.cs
reference/sp-image-donation/server/ImageDonation.Tests/TestImages.cs
reference/sp-image-donation/server/ImageDonation.Tests/TestModeTests.cs
reference/sp-image-donation/tools/chzzk-emulator/emulator.cjs
tests/reference/sp.e2e.test.mjs
```

### Notes / residual concerns
- Approvals older than the 30-minute backlog window are not resent and stay Approved until the 7-day deletion. This is a documented, deliberate trade-off (the stream may have ended).
- The refresh lock is per process; scaling out would need a DB-level lock (documented).
- Reports keep only DonationId and Reason, per the ruling. The operator must look at the donation row within the 7-day retention, and the image is already deleted at report time (documented).

---

## Addendum — Ruling R35: a reported image is evidence (keep it quarantined until retention)

Status: DONE. Commits: none (NO GIT).

### Changes
- `DonationService.ReportAsync` no longer deletes the image. The rest is unchanged: one transaction with the conditional transition to Rejected, the Report row and the BlockEntry.
- **`GET /media/{file}` now checks the donation's status** before serving. It looks up the donation by `ImageFile` (new index `IX_Donations_ImageFile`). It serves only when `DonationDto.ImageVisible(status)` is true (AwaitingCheese, Pending, Approved, Shown). Rejected (reported or not), Expired, Cleared, or a file that isn't in the DB → 404, for everyone, including the logged-in owner.
  - There was no owner-only media path, so I added none. The operator reads the file straight from storage.
  - Reported images are never resent: Rejected is never in the backlog. The overlay's `onError` skip covers a reported image that was still in the overlay queue.
- `DonationDto.HasImage` → public `ImageVisible`, shared by the DTO and `/media`.
- Retention is unchanged: the reported image is deleted with its donation row after 7 days. Report rows (DonationId, Reason) are kept.
- **Migration**: the uncommitted round-2 migration was regenerated with `dotnet ef migrations remove` + `add` so it also creates `IX_Donations_ImageFile`. **The file name changed**: `20261101072447_SafetyReportsAndMinimalEvents.*` → **`20261101073454_SafetyReportsAndMinimalEvents.cs` / `.Designer.cs`**. The old pair no longer exists. Commit the new pair and the updated `AppDbContextModelSnapshot.cs`.
- README:
  - State section, image section and the "신고 확인 (서비스 운영자)" section: the image is quarantined, not served, and deleted after 7 days.
  - **The operator must review within 7 days.**
  - Where the file lives (`Storage:MediaPath`, default `server\ImageDonation.Api\media`; Docker volume `appdata` → `/data/media`); the SQL now also selects `ImageFile`.
  - `/media` status gate documented; test count updated to 53.
- `Entities/Report.cs` comment updated.

### Test
- New `SafetyTests.Report_KeepsImageAsEvidence_UntilRetention`:
  - report → `storage.Exists(file)` is true, and `GET /media/{file}` is 404 both anonymously and for the logged-in streamer;
  - set the donation's `CreatedAt` to 8 days ago, run `RetentionService.RunOnceAsync()` → the file is gone and the Report row is still there.
- Mutation check: removing the `/media` status gate makes the test fail (`Expected: NotFound Actual: OK`). Restored and the restore confirmed.

### Commands and output
- `dotnet build -c Release` → `0 Warning(s) 0 Error(s)`.
- `dotnet test` → `Passed!  - Failed: 0, Passed: 53, Skipped: 0, Total: 53`.
- `node --test tests/reference/sp.e2e.test.mjs` → `ok 1 … # pass 1 # fail 0`; console errors 0. The overlay image still loads through the gated `/media` for an Approved donation.
- No leftover processes or test schemas.
- I did not re-run Docker for this addendum (not requested). The round-2 Docker smoke was done before the change: the README row says the report-403 check came before the evidence change.

### Files changed in this addendum
```
reference/sp-image-donation/README.md
reference/sp-image-donation/server/ImageDonation.Api/Data/AppDbContext.cs
reference/sp-image-donation/server/ImageDonation.Api/Dtos/DonationDtos.cs
reference/sp-image-donation/server/ImageDonation.Api/Endpoints/PublicEndpoints.cs
reference/sp-image-donation/server/ImageDonation.Api/Entities/Report.cs
reference/sp-image-donation/server/ImageDonation.Api/Services/DonationService.cs
reference/sp-image-donation/server/ImageDonation.Api/Migrations/20261101073454_SafetyReportsAndMinimalEvents.cs           (replaces 20261101072447_*)
reference/sp-image-donation/server/ImageDonation.Api/Migrations/20261101073454_SafetyReportsAndMinimalEvents.Designer.cs  (replaces 20261101072447_*)
reference/sp-image-donation/server/ImageDonation.Api/Migrations/AppDbContextModelSnapshot.cs
reference/sp-image-donation/server/ImageDonation.Tests/SafetyTests.cs
```

---

## Fix round 2 (re-review Minors promoted: emergency stop ordering, report UX, /media name check)

Status: DONE. Commits: none (NO GIT). Base: `21b63fa`. No schema change: "reported" is computed from the `Reports` table.

### Changes
1. **Emergency stop ordering** (`DonationService.ClearOverlayAsync`):
   - `Clear()` is sent to the overlay group **first**.
   - Then each Approved donation is persisted inside its own try/catch: conditional Approved→Cleared, notify the dashboard, then delete the file. A failure (DB error, file locked on Windows) is logged with `LogError` and the loop continues. A Cleared donation whose file couldn't be deleted is still hidden by the `/media` status gate and removed by the 7-day retention.
   - **A second `Clear()` at the end.** Found while debugging a flaky test: SignalR writes the handshake response *before* the hub's `OnConnectedAsync`, which joins the group and sends the backlog, runs. An overlay that connects during the stop can miss the first `Clear()` and receive still-Approved backlog. The final `Clear()` covers that window. Documented in a code comment and the README.
2. **No false success on report failure** (`DashboardPage.tsx`): `act()` now returns `Promise<boolean>`. `handleReport` shows the success notice only `if (ok)`, so the error notice from `act` stays visible.
3. **`/media` name check first** (`PublicEndpoints.GetMedia`): `LocalImageStorage.IsValidFileName(file)` (GUID + `.webp`, `\z` anchor) runs before any DB query → 404.
4. **Report needs evidence**:
   - `DonationDto` gained `Reported` (bool). `GET /api/dashboard/donations` sets it from the `Reports` table, and the report response/hub update sends `reported: true`.
   - The card shows the "신고" button only while `imageUrl !== null`, i.e. the image still exists. So it is hidden for plain Rejected, Cleared, Expired and already-reported donations.
   - A reported card shows "증거로 보관 중 (7일 뒤 삭제)" instead of "이미지 삭제됨", plus a "신고됨" badge. The success notice mentions the 7-day evidence retention.
   - README: the API still accepts reports on image-less donations, but there is then no evidence image.

### Tests
- New server test `OverlayHubTests.EmergencyStop_ClearsOverlayFirst_EvenIfFileDeleteFails`:
  - Uses a storage double `FailingDeleteStorage` (new file) whose `DeleteAsync` always throws `IOException`. It is injected through a new `ApiFactory(replaceServices:)` hook backed by `ConfigureTestServices`.
  - Checks: the overlay receives `Clear`, the endpoint returns 204, **both** approved donations become Cleared, and `/media` is 404 even though the files remain.
  - Mutation check: restoring the old order (`Clear` last, no per-item catch) makes it fail with the `IOException` escaping. Restored.
- Extended:
  - `PublicDonation_FreeMode_CreatesPending`: `Reported == false`; `/media/..%2Fappsettings.json` → 404; `<valid>.webp%0A` → 404.
  - `Report_StoresReport_RejectsAndBlocks`: `Reported == true` in both the response and the list.
- Client tests:
  - New `report failure shows the error, not a success message` (reportDonation rejects with `ApiError(500, …)` → the error text is shown and "신고했어요" is not). Mutation check: ignoring `ok` makes it fail. Restored.
  - New `hides report when the image is already gone` (Rejected/Cleared/Expired show no 신고 button and "이미지 삭제됨").
  - Extended the report test: after reporting the card shows "증거로 보관 중 (7일 뒤 삭제)" and no 신고 button.
- **Flake found and fixed**:
  - One full run failed `OverlayClear_OnlyReachesThatStreamersOverlay` in 11 s (the 10 s wait for `Clear` timed out). It passed 5/5 in isolation, so it was load-dependent.
  - Cause: the handshake-before-`OnConnectedAsync` race above, exposed once `Clear()` moved to the front.
  - Fixes: the production double-`Clear()`, and the test helper `ApiFactory.StartOverlayAsync`, which does `StartAsync()` and then a no-op `InvokeAsync("MarkShown", 0)`. Invocations are processed only after `OnConnectedAsync` completes, so group membership is guaranteed. All overlay tests with valid tokens use it.
  - Verified: 3 sequential full runs plus 2 full suites run **in parallel** (double load), all 54/54. An earlier "Exit 1" in that parallel run was my shell mistake (MSB1003, the `cd` was not applied to the second subshell), not a test failure.

### Commands and output
- `dotnet build -c Release` → `0 Warning(s) 0 Error(s)`.
- `dotnet test` → `Passed!  - Failed: 0, Passed: 54, Skipped: 0, Total: 54` (×3, plus 2 parallel runs).
- `cd client && npx tsc -b && npm test && npm run build && npm run lint` (after `npm ci`) → `Tests 8 passed (8)`, `✓ built`, Oxlint clean.
- `node --test tests/reference/sp.e2e.test.mjs` → `ok 1 … # pass 1 # fail 0`; console errors 0.
- No leftover processes or test schemas.

### Files changed in this round
```
reference/sp-image-donation/README.md
reference/sp-image-donation/client/src/api.ts
reference/sp-image-donation/client/src/components/DonationCard.tsx
reference/sp-image-donation/client/src/pages/DashboardPage.test.tsx
reference/sp-image-donation/client/src/pages/DashboardPage.tsx
reference/sp-image-donation/server/ImageDonation.Api/Dtos/DonationDtos.cs
reference/sp-image-donation/server/ImageDonation.Api/Endpoints/DashboardEndpoints.cs
reference/sp-image-donation/server/ImageDonation.Api/Endpoints/PublicEndpoints.cs
reference/sp-image-donation/server/ImageDonation.Api/Services/DonationService.cs
reference/sp-image-donation/server/ImageDonation.Tests/ApiFactory.cs
reference/sp-image-donation/server/ImageDonation.Tests/FailingDeleteStorage.cs   (new)
reference/sp-image-donation/server/ImageDonation.Tests/OverlayHubTests.cs
reference/sp-image-donation/server/ImageDonation.Tests/PublicDonationTests.cs
reference/sp-image-donation/server/ImageDonation.Tests/SafetyTests.cs
```
