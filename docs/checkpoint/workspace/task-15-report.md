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

## Fix round 1
Per-finding changes (textbook/content/p2/):
0. day-01: added `:::tip 이 교재를 읽는 방법` before 시작 상태.
1. day-08: 과제 1 now says to add `wait` to the ./ui.ts import; answer shows the import line and removal of the unused import (noUnusedLocals).
2. day-04 step 4 (item 5): one-sentence explanation of `tags.join(', ')` at first use.
3. day-08 step 5: new items for `append(...)` vs appendChild and `HTMLLIElement`/`HTMLUListElement`.
4. day-04 step 2: `node -e` explained.
5. day-04 step 6: real differences stated ("use strict"; line added, `export {};` absent).
6. day-08 step 7: unblock path is only the Network request blocking pane (opened via ⋮ → More tools), names hedged.
7. day-08 end state: blank line between CSS blocks fixed; note that `.card h2` matches nothing until Day 28.
8. day-06/07/08 end states now show every changed file <=200 lines in full (Day 6 types/data/format; Day 7 favicon/style.css/types/.gitignore; Day 8 JSON x2, ui.ts, api.ts; style.css partial because 244 lines).
9. day-03 step 8: push line `9d8c7b6..2b3c4d5`.
10. day-09 step 4: answer "아니요/나중에" to the C# assets prompt, `.vscode` called harmless, Korean text marked 실기 미확인.
11. day-02 step 6 and day-03 step 5: backtick wording from P1 Day 16; day-02 step 2 mentions `\` shown as ₩.
12. day-07 step 3: main.ts = automatic full reload, CSS edit step added for real HMR.
13. day-08 checklist: `npx tsc --noEmit` removed, `npm run build` kept.
14. day-07 step 7: `Copy-Item` glossed.
15. day-09: "작성 기준일 2026-11" added next to 10.0.403 (two places).
16. day-07 and day-08: new "마무리 · 과제 결과도 커밋하기" step (git add -A / commit / push, clean status); Day 8 step 8 commit text and `6 files changed` updated; old "next commit" sentences removed.
17. day-01 times: steps 5+4+9+4+5+4+9=40, assignments 4+4+2=10 (matches 75).
18. day-02 step 2: ₩ key inline note (🧯 cap kept).
Output: `npm run check -- --only p2-d01..p2-d10` -> 검사 통과 (0 errors). Re-executed code blocks for Days 6, 7, 8 (tsc + build pass). Verification doc appended.
Note: day-08.md was briefly corrupted by a bad edit and rebuilt from the previous content; final file re-checked.
