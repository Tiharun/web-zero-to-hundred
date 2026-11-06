# Task 15 report: p2-days-01-10

Status: DONE_WITH_CONCERNS (NO GIT, no commits)

## Files written
- textbook/content/p2/day-01.md ... day-10.md
- textbook/content/troubleshooting/p2-days-01-10.md
- docs/verification/p2-days-01-10.md (per-block verification table, deviations, unverified list)
No glossary extra file needed (all owned terms exist in glossary/p2.md; all are bold-defined in their Day).

## Verification
- `cd textbook && npm run check -- --only p2-d01,...,p2-d10` -> passes (0 errors).
- Code blocks extracted from the Day files and run: TS (Days 3-6, node + tsc 7.0.2), Vite project (Days 7-8: real create-vite scaffold, tsc, build, Playwright: light/dark, 360px, console errors 0, slow/blocked/404/empty scenarios), C# (Days 9-10: dotnet 10 build/run, error codes), git flow (local bare remote, CRLF warning reproduced), Day 1 network table (Playwright against reference P1 site).
- Not verifiable: Windows UI, PowerShell 5.1 output text, GitHub login/push, winget/installers, create-vite TTY prompt. Marked "대조/미검증" in verification doc and "버전에 따라 달라요" in text.

## Outline problems / deviations (see verification doc)
1. Day 1: videos.json is requested by contents.html, not index.html (reference contents.js).
2. Day 2: outline says 1 commit at end, assignment 3 makes it 2.
3. Day 3: `npm run` output is `> ts-practice@1.0.0 hello`; npm error format is `npm error`, not `npm ERR!`.
4. Day 4/5: tsc --init defaults replaced by a simplified tsconfig; exactOptionalPropertyTypes pitfall therefore does not occur (explained in :::info). Outline error TS2339 for Platform replaced by real TS2820/TS18047.
5. Day 6: "1/1쪽" avoided (Math.ceil is taught Day 31); "no exported member" is really TS2459.
6. Day 7: HMR is real only for CSS; main.ts triggers auto full reload (outline wording corrected). Firewall prompt may not appear for loopback.
7. Day 8: Offline experiment replaced (page reload fails offline) by Slow 4G + Block request URL; card title uses h3 under h2 section heading (the .card h2 CSS from the outline is included, used from Day 28).
8. Controller checks: 🧯 references verified to exist; assignments that change files after a commit (Days 7, 8) say they go into a later commit.

## Concerns for later writers
- Day 7 end `client` has index.html footer text and main.ts hero buttons from assignments; Day 8 start state assumes them.
- Day 8 `ui.ts` may contain optional `wait` (assignment 1).
