# Task 13 Report — P2 레퍼런스 (스트리머 허브: TypeScript 클라이언트 + C# 서버)

Status: **DONE_WITH_CONCERNS** (all tests pass; concerns are small deviations/additions, listed below, plus one research-doc gap)
Git: none — NO GIT

## What I implemented

`reference/p2-streamer-hub/` = `client/` (Vite vanilla-ts, TS 7.0.2 / Vite 8.3.5, no framework) + `server/` (`StreamerHub.slnx`, `StreamerHub.Api` net10.0 Minimal API + EF Core SQLite + Identity, `StreamerHub.Tests` xUnit), project `.gitignore`, `README.md`; plus `tests/reference/p2.e2e.test.mjs`.

Server (scaffolded with stock `dotnet new sln|web|xunit`, then `dotnet user-secrets init`, `dotnet ef migrations add InitialCreate`):
- Entities exactly per brief (`Streamer`, `Schedule`, `Post` Title≤100/Body≤5000, `Notice` ≤200, `AppUser : IdentityUser { DisplayName }`); `AppDbContext : IdentityDbContext<AppUser>` with a `UtcDateTimeConverter` convention (SQLite loses `DateTimeKind`; without it JSON drops the `Z` — verified `createdAt`/`updatedAt` both come back with `Z`).
- DTOs: request DTOs are **public records with init properties** + DataAnnotations (Korean `ErrorMessage`s); response DTOs are positional records with a static `From(entity)` (the only entity→DTO mapping place; no AutoMapper).
- Endpoints: one file per resource (`Streamer/Schedule/Post/Notice/AuthEndpoints.cs`), `MapGroup`, static handler methods with `TypedResults` / `Results<...>` return types. Admin policy `"Admin"` (= role), `RequireAuthorization`, `RequireRateLimiting("write")` on every write endpoint and on the `/api/auth` group.
- Services only where the brief implies them: `PostService` (author-or-admin rule, paging), `ScheduleQuery` (pure `[from,to)` filter on `IQueryable`), `NoticeBroadcaster` (singleton, one `Channel` per SSE client, completes all channels on `ApplicationStopping` so shutdown is instant).
- `Program.cs`: `AddIdentityApiEndpoints<AppUser>().AddRoles<IdentityRole>().AddEntityFrameworkStores`, cookie `HttpOnly` + `SameSite=Lax` set explicitly, `AddValidation()`, `AddProblemDetails()` + `UseStatusCodePages()` (every 401/403/404/429 is `application/problem+json`), `UseExceptionHandler()` outside Development, per-IP fixed-window rate limiter (429), `UseStaticFiles` + `MapFallbackToFile("index.html")`, and `/api/{**rest}` → 404 so API typos never return index.html.
- `/api/notices/stream` uses `TypedResults.ServerSentEvents(..., eventType: "notice")`.
- `SeedData`: `MigrateAsync()`, Admin role, admin user from config `Admin:Email`/`Admin:Password` (warning + skip if missing, throws with Identity's reasons if the password breaks the rules), 3 fictional sample streamers (`example.com` URLs) + schedules relative to today.
- `appsettings.json` (connection string `Data Source=streamerhub.db`, `RateLimit` 30/60s, EF logging at Warning), `appsettings.Development.json` (SQL command logging on, for Day 19–21), `launchSettings.json` (http only, `http://localhost:5250`, `launchBrowser:false`), `StreamerHub.Api.http`.

Client: `router.ts` (hand-written hash router with `:params` + `?query`; each navigation renders into a fresh detached-safe `view` element so late async renders can't mix pages), `api.ts` (typed functions + `ApiError{status, errors}`), `types.ts`, `auth.ts` (current user via `/api/me`, listener list), `overlay.ts` (EventSource), `ui.ts` (KST formatting via `Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul'})`, UTC↔`datetime-local` helpers, P1's `createElementWithText` now generic), 10 pages exactly as listed, `style.css` (P1 palette, `prefers-color-scheme` dark). All user data goes through `textContent`/`value`/validated `href`; `innerHTML` is used only for static templates (audited: zero interpolations).

## Tests and results

### TDD evidence
- **RED #1** — tests written first, `cd reference/p2-streamer-hub/server && dotnet test` → build FAILED: `error CS0234: The type or namespace name 'Api' does not exist in the namespace 'StreamerHub'`, `CS0246 'StreamerRequest'/'AppDbContext' could not be found` (expected: no API types existed yet).
- **RED #2** — after entities/DTOs/DbContext/migration + service stubs (`throw new NotImplementedException()`) and a Program.cs with no endpoints: `Failed: 10, Passed: 1, Total: 11`. Reasons: `NotImplementedException` (ScheduleQuery, PostService), `404 (Not Found)` from helpers / `Assert.Equal() Failure` on status codes for every API test, `Collections differ` for the 429 sequence (expected: nothing mapped). The 1 pass was `StreamerValidation_RejectsEmptyName` because the DTO (its "implementation") already existed; I proved it can fail by removing `[Required]` from `Name`: `dotnet test --filter StreamerValidation_RejectsEmptyName` → `Assert.False() Failure`, `Failed: 1`; restored.
- **GREEN** — `dotnet test` → `Passed!  - Failed: 0, Passed: 11, Skipped: 0, Total: 11` (final run: 7 s). `dotnet build --no-incremental` → 0 warnings, 0 errors.

Test names: the 3 unit + 7 integration names exactly as in the brief, plus `Admin_CreateStreamer_EmptyName_400` (validation 400 + ProblemDetails `errors.Name`, requested by the dispatch decisions). Integration tests use a `WebApplicationFactory<Program>` subclass (`TestApp`) with a fresh named shared-cache in-memory SQLite DB per test, kept alive by an open connection for the test's lifetime; settings injected with `UseSetting` and environment `Testing` (so a developer's user-secrets are never read).

### Client
`cd client && rm -rf node_modules dist && npm ci && npx tsc --noEmit && npm run build` → ok (`dist/index.html`, `dist/overlay.html`, assets; built in 229 ms).

### e2e
`node --test tests/reference/p2.e2e.test.mjs` → `# tests 5 # pass 5 # fail 0` (~12 s). Flow: `npm run build` (client/dist, ignored) → `dotnet publish -c Release -o <os tmp>/publish` → copy dist into `<tmp>/publish/wwwroot` → run `dotnet StreamerHub.Api.dll --urls http://127.0.0.1:0` (port read from "Now listening on:") with env `ConnectionStrings__Default` (temp SQLite), `Admin__Email`, `Admin__Password`, `ASPNETCORE_ENVIRONMENT=Production` → Chromium. Tests: served pages + API 404 problem+json; fan register → logout → login → write post (title with `<b>` stays text) → visible in list; admin login → create streamer → visible in list; notice → overlay updated in < 3 s over a live SSE connection; KST display with the browser in `America/Los_Angeles`. Console errors asserted `[]` on every page. Teardown stops only the spawned PID (SIGTERM, SIGKILL fallback after 10 s) and removes the temp dir. Captured server log of a run: no warnings/errors; shutdown took 43 ms with SSE clients connected.

### Extra verification (not committed)
- Manual curl smoke run of the real server (all status codes/ProblemDetails, UTC `Z`, search, logout, SSE over Kestrel).
- Documented dev flow: `dotnet user-secrets set Admin:*` → `dotnet run` (5250) + `npx vite` (5173): proxy, cookie login, `/api/me` roles, SSE through the Vite proxy, SQL logging — all worked. Processes stopped by PID; user-secrets cleared afterwards.
- `dotnet format StreamerHub.slnx --verify-no-changes` → exit 0.
- Prettier 3 `--single-quote --print-width 120` → "All matched files use Prettier code style!" (I applied its wrapping; no config committed).
- `dotnet publish` copies a project `wwwroot` into the output (checked in a scratch copy) — README instructions rely on this.

## Files (67 — commit exactly these)
```
reference/p2-streamer-hub/.gitignore
reference/p2-streamer-hub/README.md
reference/p2-streamer-hub/client/.gitignore
reference/p2-streamer-hub/client/index.html
reference/p2-streamer-hub/client/overlay.html
reference/p2-streamer-hub/client/package-lock.json
reference/p2-streamer-hub/client/package.json
reference/p2-streamer-hub/client/public/favicon.svg
reference/p2-streamer-hub/client/src/api.ts
reference/p2-streamer-hub/client/src/auth.ts
reference/p2-streamer-hub/client/src/main.ts
reference/p2-streamer-hub/client/src/overlay.ts
reference/p2-streamer-hub/client/src/pages/admin.ts
reference/p2-streamer-hub/client/src/pages/board.ts
reference/p2-streamer-hub/client/src/pages/home.ts
reference/p2-streamer-hub/client/src/pages/login.ts
reference/p2-streamer-hub/client/src/pages/postDetail.ts
reference/p2-streamer-hub/client/src/pages/postForm.ts
reference/p2-streamer-hub/client/src/pages/register.ts
reference/p2-streamer-hub/client/src/pages/schedule.ts
reference/p2-streamer-hub/client/src/pages/streamerDetail.ts
reference/p2-streamer-hub/client/src/pages/streamers.ts
reference/p2-streamer-hub/client/src/router.ts
reference/p2-streamer-hub/client/src/style.css
reference/p2-streamer-hub/client/src/types.ts
reference/p2-streamer-hub/client/src/ui.ts
reference/p2-streamer-hub/client/tsconfig.json
reference/p2-streamer-hub/client/vite.config.ts
reference/p2-streamer-hub/server/StreamerHub.slnx
reference/p2-streamer-hub/server/StreamerHub.Api/StreamerHub.Api.csproj
reference/p2-streamer-hub/server/StreamerHub.Api/StreamerHub.Api.http
reference/p2-streamer-hub/server/StreamerHub.Api/Program.cs
reference/p2-streamer-hub/server/StreamerHub.Api/appsettings.json
reference/p2-streamer-hub/server/StreamerHub.Api/appsettings.Development.json
reference/p2-streamer-hub/server/StreamerHub.Api/Properties/launchSettings.json
reference/p2-streamer-hub/server/StreamerHub.Api/Data/AppDbContext.cs
reference/p2-streamer-hub/server/StreamerHub.Api/Data/SeedData.cs
reference/p2-streamer-hub/server/StreamerHub.Api/Dtos/AuthDtos.cs
reference/p2-streamer-hub/server/StreamerHub.Api/Dtos/NoticeDtos.cs
reference/p2-streamer-hub/server/StreamerHub.Api/Dtos/PagedResult.cs
reference/p2-streamer-hub/server/StreamerHub.Api/Dtos/PostDtos.cs
reference/p2-streamer-hub/server/StreamerHub.Api/Dtos/ScheduleDtos.cs
reference/p2-streamer-hub/server/StreamerHub.Api/Dtos/StreamerDtos.cs
reference/p2-streamer-hub/server/StreamerHub.Api/Endpoints/AuthEndpoints.cs
reference/p2-streamer-hub/server/StreamerHub.Api/Endpoints/NoticeEndpoints.cs
reference/p2-streamer-hub/server/StreamerHub.Api/Endpoints/PostEndpoints.cs
reference/p2-streamer-hub/server/StreamerHub.Api/Endpoints/ScheduleEndpoints.cs
reference/p2-streamer-hub/server/StreamerHub.Api/Endpoints/StreamerEndpoints.cs
reference/p2-streamer-hub/server/StreamerHub.Api/Entities/AppUser.cs
reference/p2-streamer-hub/server/StreamerHub.Api/Entities/Notice.cs
reference/p2-streamer-hub/server/StreamerHub.Api/Entities/Post.cs
reference/p2-streamer-hub/server/StreamerHub.Api/Entities/Schedule.cs
reference/p2-streamer-hub/server/StreamerHub.Api/Entities/Streamer.cs
reference/p2-streamer-hub/server/StreamerHub.Api/Migrations/20261101055625_InitialCreate.cs
reference/p2-streamer-hub/server/StreamerHub.Api/Migrations/20261101055625_InitialCreate.Designer.cs
reference/p2-streamer-hub/server/StreamerHub.Api/Migrations/AppDbContextModelSnapshot.cs
reference/p2-streamer-hub/server/StreamerHub.Api/Services/NoticeBroadcaster.cs
reference/p2-streamer-hub/server/StreamerHub.Api/Services/PostService.cs
reference/p2-streamer-hub/server/StreamerHub.Api/Services/ScheduleQuery.cs
reference/p2-streamer-hub/server/StreamerHub.Tests/StreamerHub.Tests.csproj
reference/p2-streamer-hub/server/StreamerHub.Tests/ApiTests.cs
reference/p2-streamer-hub/server/StreamerHub.Tests/PostServiceTests.cs
reference/p2-streamer-hub/server/StreamerHub.Tests/ScheduleQueryTests.cs
reference/p2-streamer-hub/server/StreamerHub.Tests/StreamerValidationTests.cs
reference/p2-streamer-hub/server/StreamerHub.Tests/TestApp.cs
reference/p2-streamer-hub/server/StreamerHub.Tests/TestDb.cs
tests/reference/p2.e2e.test.mjs
```
Not committed (ignored): `client/node_modules`, `client/dist`, `server/**/bin`, `server/**/obj`. No `*.db` or `wwwroot` exists in the tree.

## Deviations / additions (decide whether lessons keep them)
1. **`GET /api/me` returns 204 when not logged in** (200 `{email,displayName,roles}` when logged in). A 401 makes Chromium log "Failed to load resource" on every anonymous page load, which breaks the brief's "콘솔 오류 0". Same pattern as `/api/notices/current` (204 = 없음). Protected endpoints still return 401/403.
2. **Added `PUT /api/me` `{displayName}`**: `MapIdentityApi`'s `/register` only accepts email/password, so `AppUser.DisplayName` (default `"새 팬"`) has no other way to be set. The register page does register → cookie login → `PUT /api/me`.
3. **Added client route `#/board/:id/edit`** (handled by `postForm.ts`) — the brief's route list has no edit route, but PUT and Day 31 "수정" need one.
4. **Added `client/src/ui.ts`** (shared KST/time helpers, platform names, avatar, status/error text, `createElementWithText`). The brief's file list has no shared module and these are used by 5+ pages; putting them in an existing listed file would have created circular imports or mixed responsibilities.
5. **Extra test** `Admin_CreateStreamer_EmptyName_400` (per dispatch decision).
6. **SSE sends the current notice first, then new ones.** Verified experimentally that `TypedResults.ServerSentEvents` does not flush headers until the first item, so a stream that only waits would leave a fresh client un-acknowledged (and an integration test racy). Subscribing before reading the current notice makes the test deterministic and lets reconnecting OBS overlays resync. The overlay therefore only needs `EventSource`. (Note for Day 33: with no notices yet, `EventSource` stays CONNECTING until the first event — normal.)
7. **Rate limiting is per-IP fixed window** (`AddPolicy` + `RateLimitPartition.GetFixedWindowLimiter`), not the global `AddFixedWindowLimiter` from the research snippet: a global window lets one client block everyone's logins. Also applied to `/api/auth/*` (login brute force); `RateLimit_Returns429` exercises it with 4 bad logins → `401,401,401,429` under a 3/min test limit.
8. **`POST /api/auth/logout` does not require authorization** (expired cookie must still "log out" cleanly; SameSite=Lax already stops cross-site posts).
9. **UTC rule**: query `from`/`to` accept `Z` or an offset (binder converts to UTC) and reject offset-less values; JSON bodies (`startsAt`) must be `Kind=Utc` (`Z`) — System.Text.Json turns `+09:00` into server-local time, so those are rejected with a Korean 400 message rather than converted. Client always sends `toISOString()`.
10. WAF tests inject settings with `UseSetting` (in-process configuration, environment `Testing`); real environment variables (`Admin__Email`, `Admin__Password`, `ConnectionStrings__Default`) are used in the e2e. I read "env vars in tests" as applying to the separately launched server.
11. Sample seed data (3 fictional streamers) is inserted in every environment when the table is empty.
12. One `InitialCreate` migration (final state); README tells learners their per-Day migrations will differ.

## Concerns
- **Research-doc gap:** `Microsoft.AspNetCore.Mvc.Testing` 10.0.14 is not in external-facts §0.3/§6 (I confirmed it exists on the NuGet flat container; I couldn't edit the research doc because I was limited to my own files and another agent is editing it). Test-template packages are the `dotnet new xunit` defaults: xunit 2.9.3, Microsoft.NET.Test.Sdk 17.14.1 (both in research), xunit.runner.visualstudio 3.1.4, coverlet.collector 6.0.4 (not in research).
- Prettier (3.9.10 at check time) isn't pinned in research; the code passes `--single-quote --print-width 120` but no `.prettierrc` or dependency is committed. The Day 37 writer should pin a version and use those two options (or add a config) so learners' formatting matches the answer key.
- README PowerShell commands (user-secrets, `Copy-Item`, `$env:`) were not run on Windows; the same flow was verified on Linux (dev flow and publish flow).
- Lesson notes: .NET 10 makes the top-level `Program` usable by `WebApplicationFactory<Program>` without `public partial class Program {}` (compiled fine without it). In dev, the server logs `The WebRootPath was not found` twice until the client is built into wwwroot (explained in README).
- Environment side effects outside the repo: installed the global tool `dotnet-ef` 10.0.14 (`~/.dotnet/tools`); user-secrets were set for the dev-flow check and then cleared.
- Early in the session I stopped one scratch experiment server (in the scratchpad, started by me) with a pattern-matched `pkill -f` before I saw the updated contract; every later process (smoke server, dev servers, e2e server) was stopped by PID only.

---

## Fix round 1

Status: **DONE**. NO GIT. I only touched files under `reference/p2-streamer-hub/` plus `tests/reference/p2.e2e.test.mjs`.

### Changes
1. **(Important) Admin seed escalation**: `SeedData.EnsureAdminAsync(provider, email, password)` is now public and takes its values as parameters; `InitializeAsync` reads them from configuration. The flow is:
   - No account exists → create it and add Admin.
   - Already Admin → nothing to do.
   - The account exists but isn't Admin → promote it **only if `CheckPasswordAsync(admin, password)` succeeds**. Otherwise log a warning and leave the role unchanged.
   
   A Korean comment explains the reason: anyone can register, there is no email confirmation, and an attacker can sign up with the future admin email before the admin does.
   
   Tests:
   - `AdminSeed_DoesNotPromote_PreRegisteredAccountWithWrongPassword`: a fan registers the email, the seed re-runs with a different password, and the role in the DB is still not Admin.
   - Counterpart `AdminSeed_Promotes_ExistingAccountWithMatchingPassword`.
2. **URL accuracy**:
   - New `Dtos/HttpUrlAttribute.cs` (`[HttpUrl]`): the URL must be absolute (`Uri.TryCreate`), use the http or https scheme, and have a non-empty host. It replaces `[Url]` on `ChannelUrl`/`AvatarUrl`, and the comments in `StreamerDtos.cs`, README and `streamerDetail.ts` now describe it accurately.
   - Client defense in depth: `ui.ts isHttpUrl()` (uses `new URL()` and accepts only `http:`/`https:`). `createAvatar` falls back to the initial when the check fails, and `streamerDetail` hides the channel link.
   - Tests:
     - unit Theory `StreamerValidation_RejectsNonHttpUrl` (`ftp://…`, `https://`, `javascript:alert(1)`, `example.com/channel`)
     - unit `StreamerValidation_AcceptsHttpsUrl`
     - integration `Admin_CreateStreamer_NonHttpUrl_400` (shows that `AddValidation()` honours the custom attribute: `errors.ChannelUrl` and `errors.AvatarUrl`)
3. **Post authorization over HTTP**: `OtherUser_CannotUpdateOrDeletePost_403` (PUT and DELETE both 403, post unchanged), `Author_UpdatesPost_204` (title changed, `updatedAt` set), `Admin_DeletesAnyPost_204` (then the post returns 404).
4. **Rate limit on a normal write**: `RateLimit_Posts_Returns429` uses a permit limit of 5. Register and login use 2 permits (same IP partition, commented in the test), then 4 POSTs to `/api/posts` return 201, 201, 201, 429. README now explains that per-IP partitioning behind a reverse proxy needs `app.UseForwardedHeaders()` with `KnownProxies`/`KnownIPNetworks` (Day 39). I checked the .NET 10.0.14 reference assembly: `KnownNetworks` is obsolete there (ASPDEPR005), so the README uses `KnownIPNetworks`.
5. **Register flow**:
   - The page trims the nickname and checks 2–20 characters before sending anything, so `" a "` shows "닉네임은 앞뒤 빈칸을 빼고 2~20자로 써 주세요." and no account is created.
   - `auth.ts` now has `registerAndLogin()`, which loads `/api/me` right after login so the header is correct, and `saveDisplayName()`.
   - If only the nickname save fails, the page says "가입은 됐지만 닉네임을 저장하지 못했어요 …", locks the email and password fields, and changes the button to "닉네임 다시 저장" so the user can retry just the nickname.
   - Covered in the e2e: first submit with `' a '` → error, no logged-in header; then the corrected nickname succeeds.
6. **Router**:
   - `matchRoute` treats a `decodeURIComponent` failure as "no match", so the not-found view appears.
   - The whole match-and-render loop is now inside the `try`.
   - There is no client unit-test harness, so this is covered by a new e2e test: `a broken address like #/streamers/% shows the not-found page` (also asserts 0 console errors).
7. **Random test passwords**:
   - `TestApp.AdminPassword`/`FanPassword` are `static readonly` values from `TestApp.NewPassword()` (GUID-based and meets Identity's rules). The wrong-password and different-password cases also use `NewPassword()`.
   - The e2e uses `` `E2e-${randomUUID()}-Aa1!` ``.
   - No password literals remain in tests. The only ones left are the clearly-labelled practice account in `StreamerHub.Api.http`, which learners type themselves.
8. **README, Content-Type note**: a missing or wrong `Content-Type` on an `/api` POST or PUT returns **404**. The JSON endpoint is skipped during routing (it would be 415), and the `/api/{**rest}` catch-all answers. This is harmless and `api.ts` always sends JSON; the README tells `.http` users to check the `Content-Type` line. I confirmed this against the real server: text/plain, form-urlencoded and missing Content-Type on `/api/auth/login` and `/api/posts` all return 404, and JSON returns 401 anonymously.
9. **Teachability**:
   - Client `tsconfig.json` now says `"strict": true` explicitly.
   - `createElementWithText(tagName: string, className: string, text: string): HTMLElement` is no longer generic, and a new `createLink(href, text, className = '')` returns `HTMLAnchorElement`. `<option>` and `<button>` now use `document.createElement` directly, so no `keyof HTMLElementTagNameMap` remains. The README Day 4–6 row now points to `api.ts getJson<T>` / `Paged<T>` for generics.
   - `PostService.ListAsync` now uses a `Select(p => new PostListItem(...))` projection, so it doesn't track entities and doesn't load the body, email or password hash. The now-unused `PostListItem.From` was removed. `GetAsync` adds `AsNoTracking()`.
   - Other: the e2e's `dotnet publish` now passes `--disable-build-servers`, so the test leaves no MSBuild worker processes behind (I checked the dotnet PID list before and after a run).

### TDD evidence
- RED: I temporarily removed the `CheckPasswordAsync` block and switched `[HttpUrl]` back to `[Url]`, then ran `dotnet test --filter "FullyQualifiedName~AdminSeed|FullyQualifiedName~NonHttpUrl|FullyQualifiedName~AcceptsHttpsUrl"` → `Failed: 4, Passed: 4`. The failures were `AdminSeed_DoesNotPromote_PreRegisteredAccountWithWrongPassword`, `Admin_CreateStreamer_NonHttpUrl_400`, and `RejectsNonHttpUrl("https://")` / `("ftp://example.com/channel")`. The `javascript:` and `example.com/channel` cases were already rejected by `[Url]`, which is expected. I then restored the fixes.
- RED: I temporarily removed only the decode guard in `matchRoute` and ran `node --test --test-name-pattern="broken address" tests/reference/p2.e2e.test.mjs` → `not ok 1`. The page showed the generic error text instead of the not-found view. I then restored the guard.
- The post-authorization and posts-429 tests describe behaviour that already existed, so they passed as soon as they were written.

### Commands and results (final)
- `cd reference/p2-streamer-hub/server && dotnet build --no-incremental` → 0 Warning(s), 0 Error(s)
- `dotnet test` → `Passed!  - Failed: 0, Passed: 23, Skipped: 0, Total: 23` (11 before + 12 new cases: 2 seed, 3 post-auth, 1 posts-429, 1 URL 400, 4 Theory cases + 1 accept)
- `dotnet format StreamerHub.slnx --verify-no-changes` → exit 0. The first attempt failed with `WHITESPACE` because of comment lines inside the LINQ chain; I moved the comment above the statement.
- `cd ../client && npx tsc --noEmit && npm run build` → ok (`✓ built in 204ms`). `npx tsc --showConfig` shows `"strict": true`.
- `node --test tests/reference/p2.e2e.test.mjs` → `# tests 6 # pass 6 # fail 0`. No temp dirs and no extra dotnet processes are left.
- Prettier 3 `--single-quote --print-width 120` on the client and the e2e → all files clean. `innerHTML` audit → no interpolations. No model identifiers.

### Files changed in this round (21)
```
reference/p2-streamer-hub/README.md
reference/p2-streamer-hub/client/tsconfig.json
reference/p2-streamer-hub/client/src/auth.ts
reference/p2-streamer-hub/client/src/router.ts
reference/p2-streamer-hub/client/src/ui.ts
reference/p2-streamer-hub/client/src/pages/admin.ts
reference/p2-streamer-hub/client/src/pages/board.ts
reference/p2-streamer-hub/client/src/pages/home.ts
reference/p2-streamer-hub/client/src/pages/register.ts
reference/p2-streamer-hub/client/src/pages/schedule.ts
reference/p2-streamer-hub/client/src/pages/streamerDetail.ts
reference/p2-streamer-hub/client/src/pages/streamers.ts
reference/p2-streamer-hub/server/StreamerHub.Api/Data/SeedData.cs
reference/p2-streamer-hub/server/StreamerHub.Api/Dtos/HttpUrlAttribute.cs   (new)
reference/p2-streamer-hub/server/StreamerHub.Api/Dtos/PostDtos.cs
reference/p2-streamer-hub/server/StreamerHub.Api/Dtos/StreamerDtos.cs
reference/p2-streamer-hub/server/StreamerHub.Api/Services/PostService.cs
reference/p2-streamer-hub/server/StreamerHub.Tests/ApiTests.cs
reference/p2-streamer-hub/server/StreamerHub.Tests/StreamerValidationTests.cs
reference/p2-streamer-hub/server/StreamerHub.Tests/TestApp.cs
tests/reference/p2.e2e.test.mjs
```
(`tests/reference/p3.e2e.test.mjs` and `sp.e2e.test.mjs`, which are untracked in the tree, belong to other agents.)

### Notes
- When registration succeeds but the login step after it fails (rare), a retry hits `DuplicateUserName`, and the page tells the user to log in. The account then keeps the default nickname "새 팬". I didn't add a separate nickname page; it's out of scope.
- Three MSBuild node-reuse `dotnet` processes started before this round are still on the machine. I left them alone because I can't prove they're mine, and other agents build here too. They exit on their own when idle.
