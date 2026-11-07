# Task 12 step 1 report
Status: DONE. No git.
Implemented: tests/e2e/smoke.test.mjs (builds own index.html to a temp dir with allowMissing, or opens SMOKE_INDEX; injects all-completed progress; visits every Day + page + home/settings/project at 360px; checks 7 h2 in order, copy buttons == figure.code, 0 console errors, no horizontal scroll, 0 external requests; coming-soon Days only checked for errors/scroll).
Day 1: 6 deferred fixes applied (selection wording, step-5 leftover note, switch back to English, inline 계속 -> 예 + return link, 항상 recovery). CONTENT-GUIDE 1.5 heading updated.
Preview: scratch copy at scratchpad/t12/content with p2/p3/sp day files removed; built to /home/user/web-zero-to-hundred/index.html (4.69 MB, 30 Days, 125 coming-soon).
Results: npm test 168 pass; check --allow-missing OK; test:e2e 26 pass (incl. smoke: 49 Days at the time, 1339 code blocks); smoke vs preview: pass (30 Days, 659 code blocks); external requests 0 (asserted in smoke).
Content defects found by smoke: 0 (P1 and the P2 Days present at the time all clean).
Files: tests/e2e/smoke.test.mjs, textbook/content/p1/day-01.md, docs/CONTENT-GUIDE.md, index.html

## Integration fix: pages + Days 1–10

Range: `pages/start.md`, `pages/help.md`, `p1/day-01…10.md`, `tests/e2e/smoke.test.mjs`, `troubleshooting/p1-days-02-10.md`. Evidence log: `docs/verification/p1-integration.md`.

### Fixed
- **smoke I-2** `smoke.test.mjs:112,125-131,166`: P1-only counting (`p1WithFile === 30`), P1 `coming-soon` is a problem; `SMOKE_CONTENT` env to point at a content copy.
- **Critical d07 first push**: `day-07.md` step 7 (copy button keeps `moonbear-dev`, hidden login window, closed window), new 🧯 "푸시 주소·로그인 오류" replacing the `remote origin already exists` item (merged to stay at 6; same text in `troubleshooting/p1-days-02-10.md:552`).
- **d07 rest point** (tip after step 6), signup survey note, README label wording, shell definition (`day-07.md:70`, review-2 M-6), `git add` warning moved up, Korean `git log` garble note in step 8.
- **Preview/refresh chain**: Day 2 step 8 new tip "미리 보기 사용법" (auto-update, no `F5`/`Ctrl+F5` in VS Code, double-click tab needs `F5`, reopen next day); d04 (3 spots + 259), d05 (158,178,180), d08 step 1, d09:118/242/674/686/716/202, d10:92/173/293/634/673/1171, help.md:54.
- **New-file icon** → right-click: d05:116,236, d06:90, d09:85.
- d01 access-denied moved to a warn after step 3 (+ link text); start.md index.html placement; help.md catch-up wording; d03 Ctrl+Z; d04 homepage success box, 321 check method, 660 checklist; d05 profile.jpg cleanup + "여섯 가지"; d06 success box (vertical list), Elements wording; d08 contact check browser, 674 address, 715 folder; d08/09/10 end-state ".git 보존 + 커밋·동기화"; d09 202 search check, 127 Day 4~5, 184 color, 95 numbering, 275 undo; d09/d10 internet line; d10 `Ctrl+A` own-text warn, line-number selection.
- Notes file (Day 1 six items): already done in step 1 of Task 12 (see above).

### Deferred
- d04:259/593 Live Preview "not found" screen wording and 🧯 title: needs real screen (unverified).
- d05:196/d07:255,299,375 `7 files` caveat: removed at source (Day 5 deletes `profile.jpg`).
- d08:239/248 (preview address) resolved by using the browser only; d10 `display` paragraph move to Day 11 (structural, risks Day 10/11 consistency); d10 concept time (no time added elsewhere).
- Notes: Task 8 minors (term order, Day 24, §0.2) are outside this range; Task 9 "방법 1" GitHub rename flow still unverified.
- d06:277,286 `<!DOCTYPE>` case: fixed; Day 7 time stays 120 (rest-point added, no extra work).

### Rejected
- none.

### Commands
- `cd textbook && npm run check -- --only p1-d01..p1-d10` → "검사 통과" (0 errors).
- `npm run test:e2e` → 26 pass, 0 fail (smoke: 50 Days, 1414 code blocks).
- Negative test: `SMOKE_CONTENT=<scratch copy without p1/day-05.md> node --test tests/e2e/smoke.test.mjs` → FAIL "p1-d05: P1 Day 가 준비 중(coming-soon)으로 나와요".
- Concern: Day 7 and Day 14 totals are at the cap; no new steps added. Scratch: `../wzh-scratch/t12`.

## Integration fix: Days 11–20

Range: `p1/day-11…20.md`, `troubleshooting/p1-days-11-20.md`, `pages/help.md`. Evidence: `docs/verification/p1-integration.md`.

### Fixed
- **Full `style.css` at Day 20** (`day-20.md` new answer box "오늘 끝 상태 style.css 전체"): built in scratch by inserting Day 16 `.greeting` (after `.hero-image`, before `.hero-actions`) and Day 20 `.card-body time`/`.badge` (after `.card-body p`) into the Day 14 full text; 330 lines; only `.button-outline {` and one comment line differ from the final reference (later Days change them).
- **Deployment recovery**: new `help.md` section 7 (push check, GitHub file/case check, temp-name double rename, Network 404, Actions re-run, cache). Linked from Day 14 (🧯 404, 그림 깨짐, 고쳤는데 그대로, 8단계), Day 15 and Day 20 (warn box after the deploy check). Day 14 menu-only-404 case added into the existing 404 🧯 (stays 6 items); case-rename trap fixed (d14 그림 item). Mirrored in `troubleshooting/p1-days-11-20.md`.
- **Day 14**: rest point tip after step 6, end-state "커밋·동기화" + own-colour warning, Network tab one-liner, phone fallback (device mode), 되돌렸는지 확인 후 커밋.
- **First-error traps**: d15 🧯 console item rewritten (Failed to load resource for ①②③, ④ defer removed), d15/d16/d19 error-link text (Sources vs VS Code), d15 IME cause (copied curly quotes), d19 console item.
- **Refresh keys**: `Ctrl + F5`/`F5` → "브라우저 탭에서" in d11:1050, d12:745, d13:635/644, d15:837, d16:596, d17:619, d19:630, d20:1081; d11/d12 "더블클릭해도 같아요" corrected; d13:102 DevTools focus; d13:119 common sentence; d16:260 F5 wording.
- d12 new-file icon → right click; d12 360px task moved to Day 13 (answer keeps result); width numbers (800px, 1280 removed); d11 파란→보랏빛, 알약→둥근 사각형, d11:382 note.
- d17:326 variable name; d18:373 code added to task; d18:112 `파일 → 새 창`; d20:231 8줄.
- **End-state sentences** (d11,12,15–20): own-text warning + commit/sync + keep `.git`.
- **Review ②**: I-1 `day-20` innerHTML explanation and answer (`<script>` not executed; `<img onerror>` is the risk); M-5 `noreferrer`; M-6 `day-15` "문장" definition.

### Deferred
- 7 files/120 insertions copy in d11–20 example output (text says numbers may differ).
- d14 "folder one level too deep" fix steps (needs a tested procedure); d15:101/218 IME hint; d16/d20 post-task leftover-change phrase (partly covered by end-state sentence); d12 task order (task 2 required for Day 20) left as is.
- Rename-on-Windows procedure in help §7 and Network tab/Actions wording are not verified on a real screen (marked in the evidence log).
- Days 21–30 items (d21+ F5, d25 etc.) are next range.

### Rejected
- none.

### Commands
- `cd textbook && npm run check -- --only p1-d11,…,p1-d20` → 검사 통과 (0 errors). e2e not run (not requested).

## Integration fix: Days 21–30

Range: `p1/day-21…30.md`, `troubleshooting/p1-days-21-30.md` (+ `day-01.md` checklist line, `day-20.md` blank-line sync). Evidence: `docs/verification/p1-integration.md`.

### Fixed
- **Full `style.css`**: new answer boxes at the end of Day 25 (`day-25.md` "오늘 끝 상태 style.css 전체") and Day 30 (`day-30.md`). Derived in scratch (`../wzh-scratch/t12/apply.py`) by applying Day 21–26, 28 blocks to the Day 20 full text; **Day 30 text is byte-identical to `reference/p1-my-creator-site/css/style.css`** (verified with `==`). One Day-14-origin double blank line was collapsed (also in Day 20's box) to get equality.
- **Day 30 recovery** (`day-30.md:77,104` area): "안 되면" now says old Day end-state code is the old state and must not be pasted; step 2 has a per-file table of where each file's latest full text lives (HTML/favicon/countdown.html → Day 28, style.css → Day 30, main/contents/videos.json → Day 25, contact.js → Day 24, schedule → Day 26, countdown.js/css → Day 27, images → Day 5/6/12) plus an own-text-loss warning and commit/sync reminder; row 1 no longer mentions the overlay; `reference` wording removed; task 1 no longer duplicates step 4; 🧯 Actions item (no unverified "special characters" claim first) and merged "내 컴퓨터에서는 되는데 배포 주소에서만 안 돼요" item (6 items kept).
- **help §7 links** from Day 25, 26, 27, 28, 29, 30 (and 14, 15, 20 earlier). `day-27.md` 🧯 404 now: "변경 0개 ≠ 푸시 완료", commit list, temp-name rename, Actions. d29 README item, d25 404 + stale-data items, d25 success box (Network `videos.json`, already-on-site case).
- **Day 28 Tab**: step 3 and 🧯 now say "F5 후 클릭 없이 Tab" (click moves the Tab start); Lighthouse error item; deploy-vs-local note; `달빛곰` title note; M-2 `:focus-visible` text.
- **Day 완료 button**: no shared place exists in `content/` (the button is app-rendered; text only in `start.md`), so fixed Day 1 (checklist item) and Day 30 (step 7, catch-up instruction) only.
- d21: form restored to Day 15 `<div>` markup (matches reference), time 110→115/65, Day 26 reference, allow-pasting note, focus border wording. d22: step 5 new-window note, 4-page check, new 🧯 `setAttribute` null item, Rendering note. d23 table rows. d24: name-field wording, `role=status`, 2 MDN links. d25 M-3 `localStorage` wording, cancel-button precision, Live Preview note. d26: replace-one-line wording, refresh before console, deploy check. d27: M-7 note, M-1 clamp link, console re-run hint, full-width colon wording. d29: header-↶ warning, F10/F8 laptop keys, 22-file guidance, external console errors.
- M-1 (5 MDN links): d22, d24 ×2, d27, d28 → en-US + "(영어 문서)".
- troubleshooting file mirrored for every changed 🧯 item.

### Deferred (this range)
- M-4 code-comment `role="status" … 같은 뜻` inside contact.html blocks (Day 24/28, equals reference); prose fixed.
- Introducing "변경 내용 취소" before Day 25 (Days 14–16): only explained at first use in Day 25 now.
- Day 28 Tab behavior, laptop key claims, Lighthouse/Network wording: not confirmed on a real screen.
- d21 setInterval mention kept as Day 26; d26/27 minor test-flow items (reload per address) only hinted.

### Combined deferred list (all three ranges)
1. d04:259/593 Live Preview "not found" screen wording and 🧯 title (needs real screen).
2. d10 `display` paragraph move to Day 11 and Day 10 concept-time rebalance.
3. Task 8 minors: Day 10 term order vs glossary, Day 24 "이미 배운 것" order, §0.2 DevTools Day list.
4. Task 9: Day 7 "방법 1" GitHub rename flow unverified against the real UI.
5. `7 files changed, 120 insertions` copied example output in Days 11–20 (text says numbers may differ).
6. d14 "folder one level too deep" repair steps; d15:101/218 IME hint; d16/d20 leftover-change phrase after tasks; d12 task-2 dependency left as is.
7. help §7 rename procedure, Network tab, Actions wording; Windows UI items — unverified on real screens (see evidence log).
8. M-4 code comment (above); "변경 내용 취소" earlier intro (above); Day 28 `Tab`/focus start on current Edge.
9. GitHub new-repo and signup/survey screens (Day 7) — wording hedged, not verified.

### Commands
- `npm run check -- --only p1-d01,p1-d21…d30` → 검사 통과 (0 errors).
- `npm test` → tests 168, pass 168, fail 0.
- `npm run check -- --allow-missing` → 검사 통과 (warning: sp Day files missing, expected).
- `npm run test:e2e` → tests 26, pass 26, fail 0 (smoke: 50 Days, 1419 code blocks).

## Fix round 2
- `day-04.md:128` success box now states real state: 홈→existing menu-less index.html opens, 소개 is current page, 영상/방송 일정/문의 (3 files) do not exist until step 2. Other Day 4 text (line 211 "index.html에는 아직 메뉴가 없어서") already correct.
- `day-28.md:241` F5 targets the Edge tab showing the Live Preview address; how to open it (copy address from preview) or double-click alternative.
- `npm run check -- --only p1-d04,p1-d28` → 검사 통과.
