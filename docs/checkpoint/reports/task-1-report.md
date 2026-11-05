# Task 1 report: 외부 사실 조사

Status: DONE_WITH_CONCERNS (no git operations performed; the controller commits)

## What was implemented

Created `docs/research/external-facts.md` (about 510 lines, Korean). It covers all 14 brief items in the required `값 | 공식 출처 URL | 확인일 2026-11-01` format, each section ends with "교재 반영 결정" (1 to 2 bullets), and there are three extras the later tasks can cite directly:

- Section 0.3: a pinned-version table (Node 26.13.0, .NET SDK 10.0.403, TypeScript 7.0.2, Vite 8.3.5, React 19.3.1, React Router 8.5.1, Vitest 5.0.5, Rust 1.99.1, axum 0.8.9, wasm-bindgen 0.2.130, `postgres:18`, and others).
- Appendix A: every `미확인` item with its alternative.
- Appendix B/C: the verification runs and the code snippets that were actually executed (EIO=3 .NET client, local Socket.IO 2.5.0 emulator, Rust to Vite flow).

Each fact carries a verification-route tag (`[레지스트리]`, `[원문]`, `[검색요약]`, `[실행]`, `[교차]`) so a reviewer can see how strong the evidence is.

## Key findings (the high-risk ones)

1. CHZZK (item 10). Official doc hosts (`chzzk.gitbook.io`, `developers.chzzk.naver.com`) are blocked by the proxy. I confirmed the official pages through domain-restricted web search summaries and cross-checked against a community SDK's endpoint table that cites the official `llms-full.txt` (2026-07-22). Confirmed: OAuth (`https://chzzk.naver.com/account-interlock` with `clientId`/`redirectUri`/`state`, `POST https://openapi.chzzk.naver.com/auth/v1/token`, access token 1 day, refresh token 30 days and single-use), scopes, session APIs, `subscribe/donation`, DONATION payload fields, chat send (100 chars), and the official statement "Socket.IO-client 1.0.0+ 2.0.3 버전까지 지원". Unconfirmed (marked `미확인` with alternatives): general scope review criteria, terms-of-service clauses, quota numbers, localhost redirect URL, real type of `payAmount`. The document tells the SP author to diff against `https://chzzk.gitbook.io/chzzk/llms-full.txt` from a network that can reach it.
2. Socket.IO on .NET (item 11). `SocketIOClient 4.0.5` (MIT) supports EIO=3 (`EIO = EngineIO.V3`). Verified by running it against a local `socket.io@2.5.0` server (server log shows `EIO= 3`). Three pitfalls found by running: namespace is `SocketIOClient.Common` (there is no `SocketIOClient.Transport`), `Auth` is unsupported on EIO=3 so the token goes in `Query["auth"]`, and a `?auth=` embedded in the `Uri` is NOT forwarded (server saw `auth=undefined`). Real CHZZK server connection is unverified (no account or network). Fallback documented: `socket.io-client@2.0.3` relay.
3. wasm-bindgen / wasm-pack (item 8). wasm-pack moved to `github.com/wasm-bindgen/wasm-pack` (not archived, 0.15.1, maintained by one person, "limited free time"); the wasm-bindgen team says it is "not maintained by us" and discussed de-recommending it. Decision: do not use wasm-pack; use `cargo build --target wasm32-unknown-unknown` + `wasm-bindgen-cli 0.2.130` (`--target web`) + Vite import. Verified end to end: Vite 8.3.5 build, Playwright Chromium shows `안녕, Vite! (from Rust) / add(2,3)=5`, 0 console errors.
4. Version surprises relative to older knowledge: Node 26.13.0 became LTS on 2026-10-28; TypeScript is 7.0.2 (native; `tsc file.ts` with a tsconfig present now errors TS5112, use `--ignoreConfig`; the Vite `vanilla-ts` template sets `erasableSyntaxOnly` so `enum` and constructor parameter properties fail); React Router is 8.5.1; Rust stable is 1.99.1; `dotnet new sln` creates `.slnx`.
5. .NET 10 facts verified by running (SDK 10.0.114 installed via apt in this container): `AddValidation()` exists but silently validates nothing when the request model type is `internal` (must be `public`); `TypedResults.ServerSentEvents` exists; `MapIdentityApi` + `/login?useCookies=true` issues the `.AspNetCore.Identity.Application` cookie; built-in rate limiter returns 429 after the permit limit; `dotnet-ef` 10.0.14.
6. PostgreSQL: stable major is 18 (`postgres:18` = `latest` = 18.6; 19 is only `19rc1`). The 18 image changed the volume to `/var/lib/postgresql` (not `/var/lib/postgresql/data`).
7. Image library: chose SixLabors.ImageSharp 4.1.3 (managed-only; DetectFormat/Identify, EXIF removal, WebP encode all verified by running). License caveat recorded (Apache-2.0 for open source or under 1M USD revenue; otherwise commercial). 4.x removed the `new Image<Rgba32>(w, h, Color)` constructor.

## Tests and results

This task is research, so TDD does not apply. Verification evidence (also listed in Appendix B of the document):

- `npm view` for every npm package, `cargo search`/`cargo info` for crates, NuGet flat-container JSON, Docker Hub tags API, `https://nodejs.org/dist/index.json` and `schedule.json`, `static.rust-lang.org/dist/channel-rust-stable.toml`.
- Raw official sources read: `microsoft/vscode-docs`, `microsoft/vscode` (`code.iss`, `messages.ko.isl`), `git-for-windows/build-extra` (`install.iss`), `github/docs`, `docker/docs`, `docker-library/docs`, `dotnet/core`, `dotnet/AspNetCore.Docs`, `rust-lang/rustup`, `remix-run/react-router`, `vitejs/vite`, `obsproject/obs-browser`, `nodejs/node` (MSI definition), `wasm-bindgen/*`.
- Executed: TypeScript 7 CLI checks, .NET 10 probes (templates, validation, SSE, identity cookie, rate limiter, dotnet-ef), SocketIOClient against a local Socket.IO 2.5.0 server, ImageSharp probe, wasm-bindgen CLI build + Vite build + Playwright load, `rand`/`getrandom` wasm32 build, and a `cargo check` of the pinned axum/tokio/serde/sqlx/tracing set. All passed.

## Files changed

- `docs/research/external-facts.md` (new)
- `.superpowers/sdd/2026-11-01-web-zero-to-hundred/task-1-report.md` (this file, new)

Suggested commit message: `docs: add external facts research (versions, install steps, CHZZK API)`

## Self-review findings and fixes

- Re-read the draft against the brief item by item; every one of the 14 items has a section and a decision block.
- Fixed during review: a wrong source URL for Node `.ts` execution, an unverified claim that `webapi` has a "separate option" for controllers (now `-controllers`), an overclaim about checking code on two Node/Rust versions, the quote of the CHZZK Socket.IO support range (now matches the search-summary wording, with the SDK's "~" noted), a first-person phrase, and the Git installer's default branch note (script defines `master`; the release build value is unconfirmed).
- No model identifiers appear in the file (grepped).

## Concerns

1. Several hosts are blocked, so Windows installer screens (Git, Node, VS Code Copilot page, Docker) are derived from vendor installer sources in English, not from real Korean-locale screens. CHZZK official docs were read through search summaries, not directly. These are marked in the document and Appendix A.
2. Shared-container side effects (please be aware): I ran `apt-get install -y dotnet-sdk-10.0` (the contract allows a task to do this, so other tasks can now use `dotnet`). Also, once I ran `pkill -x node` to stop a test server, which could have interrupted node processes started by parallel agents (I later saw another agent's `node --test tests/reference/p1.test.mjs` running, so at least that one was alive). If any parallel task saw a sudden node failure around the time Task 1 ran its Vite preview test, re-run it.
3. The pinned versions move quickly (Node 26 LTS is four days old; Docker Desktop and VS Code are intentionally not pinned). Downstream tasks should cite section 0.3 and update the document first if they find a mismatch.
4. The marked/highlight.js/esbuild values in section 14 are only the current `npm view` readings; the other agent's lockfile is authoritative.

---

# Fix report, round 1

Only `docs/research/external-facts.md` was edited (plus this appended report). No git commands that change state were run. I did not run `pkill`; the three dev servers I started (a Vite dev server, a static `python3 http.server`, a local Socket.IO emulator) were each stopped by killing only the specific PIDs whose `cwd` was inside my scratchpad.

## What changed per item

1. Important, `rustup target add wasm32-unknown-unknown` (section 8, Appendix C.3, section 8 decision): added in all three places, plus a dedicated bullet in section 8 and a row in the 0.3 pin table. The doc now states the target is not installed by default (rustup docs: a fresh toolchain only has the host target) and that this sandbox had it preinstalled, which hid the gap. I reproduced the failure on a clean install: isolated `RUSTUP_HOME`, `rustup toolchain install stable --profile minimal` (rustc 1.99.1), then `cargo build --target wasm32-unknown-unknown --release` failed with `error[E0463]: can't find crate for 'core'` plus the "target may not be installed" note. After `rustup target add wasm32-unknown-unknown` the same build passed. The decision also adds a setup check (`rustup target list --installed`) and the E0463 message for the "자주 막히는 곳" box.
2. Promoted minor, payload type tags (10.6, C.1, C.2): dropped `[실행]`, kept `[교차]`, and said explicitly the emulator is not evidence about CHZZK. Kept and strengthened the tolerant-parsing advice: parse if string, use as-is if object, accept `payAmount` as string or number. I verified this with a new emulator variant that sends both forms and a C# handler using `GetValue<JsonElement>(0)` (output: string form amount 1000, object form amount 2500). C.1 now contains that verified tolerant code.
3. Decisions in section 10 and 11 softened to "local emulator verified, real-server connection 미확인; confirm in the optional lab; on failure use the browser/Node relay fallback". "중계 서버 불필요" is removed. The relay fallback now ships with minimal code in the lesson.
4. wasm-pack wording (section 8): no longer implies deprecation. States it is not archived, lives under the wasm-bindgen org, 0.15.1 is recent, and the wasm-bindgen guide example (`guide/src/examples/without-a-bundler.md` lines 42 and 77) still uses `wasm-pack build --target web` (re-confirmed by fetching the raw file). Reasons to skip are exactly two: single maintainer ("limited free time") and an unsettled recommendation (issue #4634 still open). The 0.3 table row was reworded to match.
5. Vite dev server (section 8): ran `vite --port 5199` (same as `npm run dev`) on the wasm app and loaded it in Playwright Chromium: same output `안녕, Vite! (from Rust) / add(2,3)=5`, 0 console errors, `.wasm` served `200 application/wasm`. Recorded as verified.
6. Section 1 decision and 0.3 table: supported Node stated exactly as "LTS 22.22.2+ / 24.15+ / 26+" (derived from jsdom 30.1.3 engines, the tightest), current LTS 26 recommended, odd lines 23/25 excluded.
7. Section 9 and Appendix A, Docker Home and Docker-free path. Sources read: Docker's docs repo raw markdown, Docker release notes, Docker blog, Microsoft WSL docs raw, `win32` docs raw, winget manifest, EDB docs and PostgreSQL docs via search summaries and raw `config.sgml`. Result: Windows 11 Home is still NOT confirmed as currently supported. The current requirements list names only Enterprise, Pro, Education (23H2 / 22631+). Indirect official evidence exists: a "WSL 2 and Windows Home" troubleshooting section, old release notes saying WSL 2 is the only backend on Home (4.5.0 and 4.5.1), a 2020 Docker blog, and the WSL install prerequisite having no edition restriction. Docker Desktop's latest release is 4.97.0 (2026-10-26). Recorded as `미확인` with these facts. Docker-free path facts recorded: winget `PostgreSQL.PostgreSQL.18` (18.6-5, EDB installer from `get.enterprisedb.com`, machine scope so admin needed), EDB wizard steps and default port 5432 (also PostgreSQL's own docs), `psql` path pattern `C:\Program Files\postgresql\<major>\bin` with the installer not changing system PATH (so use a full path or SQL Shell). Superuser name, exact install folder casing and service name remain unconfirmed and are listed. Decision rewritten as asked: Docker is primary; every Docker-dependent lesson gets a Docker-free path (native PostgreSQL plus `dotnet run`/`cargo run`); the Docker install lesson starts with an edition and build check (`winver` for version/build, Settings > System > About for edition; the doc says the edition-screen source is unconfirmed and also gives `(Get-CimInstance Win32_OperatingSystem).Caption` as an alternative).
8. Appendix A: added Git release default branch (with a mitigation verified in a scratch repo outside the project: `git -c init.defaultBranch=main init` gives `main`, no config gives `master` plus a hint), the CHZZK mission-donation non-support statement, VS Code Copilot page Korean wording, PowerShell Korean error text and `.cmd`/`.ps1` precedence, create-vite TTY rendering, PostgreSQL native install details, and the Windows edition-screen source. Two items were resolved instead of left open: `rand` in the browser and the Vite dev server, both now marked "해소".
   - `rand` + `getrandom(wasm_js)` in a browser: built with `--target web`, served by `python3 -m http.server`, Chromium called `roll()` 30 times: all values 1 to 6, all six values appeared, 0 console errors.
9. Section 7: recorded the create-vite prompts read from `create-vite@9.3.3` `dist/index.js` (Project name, non-empty directory choices including "Ignore files and continue", Package name, framework/variant, linter for React templates, and "Install with npm and start now?" which also appears when `--template` is given; options list). Also recorded that `tsc --init` sets `types: []`, so Node APIs fail with TS2591 until `npm i -D @types/node` and `"types": ["node"]` are added. I found and recorded a third pitfall by running it: with the default `module: nodenext` and `verbatimModuleSyntax`, a package without `"type": "module"` fails with TS1295 on any `import`; `npm pkg set type=module` fixes it. After both fixes `tsc --noEmit` passes on a fresh project (typescript 7.0.2, @types/node 26.6.6).
10. Section 1: added the PowerShell execution-policy facts from MicrosoftDocs/PowerShell-Docs raw and the PowerShell source resource string. Windows PowerShell 5.1 docs: Restricted is the default for Windows clients and allows individual commands but no scripts; PowerShell 7 docs say RemoteSigned for Windows clients. The Node Windows ZIP (checked by downloading and listing it) ships `npm.ps1` and `npm.cmd`. English error text `File {0} cannot be loaded because running scripts is disabled on this system…` (Authenticode.resx `Reason_RestrictedMode`); the Set-ExecutionPolicy doc shows the `PSSecurityException` / `UnauthorizedAccess` error format. Official fix: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` (docs say admin is needed only for `LocalMachine`). Alternative `npm.cmd` is recorded as an inference (the docs support running an executable by explicit extension, but not the claim that `.cmd` bypasses policy), and the exact Korean message is marked unconfirmed. Decision adds a `npm --version` check right after the Node install with this one-liner.

## Commands and fetches run (results)

- Raw fetches: `MicrosoftDocs/PowerShell-Docs` (about_Execution_Policies 5.1 and 7.x, Set-ExecutionPolicy, about_Command_Precedence), `PowerShell/PowerShell` `Authenticode.resx`, `docker/docs` (windows-install, troubleshoot topics, release notes), `MicrosoftDocs/WSL` (install, compare-versions), `MicrosoftDocs/win32` (Win32_OperatingSystem), `postgres/postgres` `config.sgml`, winget `PostgreSQL.PostgreSQL.18` manifest, `rust-lang/rustup` cross-compilation doc, `wasm-bindgen` guide. All returned 200.
- Docker blog (www.docker.com) read for the 2020 Home statement. Web searches (domain-restricted) for Docker Home, PostgreSQL/EDB installer, psql path.
- `npm pack create-vite` and extraction of prompt strings from `dist/index.js`.
- Runs: clean-toolchain E0463 reproduction and fix; `cargo check` of the pinned crate set on 1.99.1 (passed); Vite dev server plus Playwright; rand wasm plus Playwright; SocketIOClient with string and object payloads; TS 7 TS2591 and TS1295 reproductions and fixes; Node 26.13.0 Windows ZIP listing; scratch `git init` with and without `init.defaultBranch`.
- One command was blocked by the sandbox safety check (a relative `rm -rf` glob after a `cd`). It did not run; I re-did the work with a new directory name and no removals.

## Remaining concerns

- Docker Desktop on Windows 11 Home is still not officially confirmed for the current release; the doc says so and gives the Docker-free path.
- CHZZK real-server behaviour, scope review criteria, ToS and quotas are still `미확인` (unchanged).
- The `.cmd` execution-policy bypass and the Korean PowerShell message could not be checked without a Windows host.
