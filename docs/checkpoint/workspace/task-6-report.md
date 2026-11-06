# Task 6 report: content guide and exemplar P1 Day 1

Status: DONE_WITH_CONCERNS (all checks pass; concerns are about Windows UI wording I could not confirm and hand-offs to Task 8)
Git: none (NO GIT). Steps 4 and 5 of the brief (reviewer gate, commit) were skipped as instructed.

## What I implemented

### 1. `docs/CONTENT-GUIDE.md` (the guide every later content writer follows)
- **§0 Top principle.** The learner must never get stuck. It gives three questions a writer asks of every step: where, how do I know it worked, where do I go if it failed.
- **§1 Day format** (all of spec §5):
  - File and id rules, and the exact section h2 table with what goes in each section.
  - The six container blocks, with the auto-labels the CSS adds.
  - The engine rules: column-0 `:::`, exactly three colons, no nesting, callout titles are plain text, the correct way to put a success box between numbered steps (the next list starts at `3.` and renders `<ol start="3">`, verified), and the alternative of using h3 steps.
  - Writing style and notation table: menus, keys, screen positions, paths, version caveats.
  - A Markdown pitfalls section:
    - Raw HTML is escaped.
    - Images are banned; use text diagrams no wider than 32 columns so they fit 360px.
    - The allowed link-target table.
    - Placeholder ban and starter-hint comments.
    - The bold + Korean particle trap: `**x)**는` does not render. I verified this against the engine with a table of good and bad cases.
  - Length and time: `minDayChars` is 4000. The guide explains why.
- **§2 Anti-stuck rules (a) to (g)**, each with how to apply it and an example.
  - Extra rules: one step per screen, every code block must work when pasted, Windows traps, only `C:\dev`, names must match the reference, waiting for external services, network, security habits.
  - **Project-fixed rules:**
    - P1 time code assumes the PC clock is Korea time (P2 Day 29 covers time zones).
    - P1 YouTube IDs are examples.
    - P1 `fetch` needs Live Preview.
    - Terminal days.
    - Docker days always have a Docker-free path and start with a Windows edition/version check that never says Home is or isn't supported.
    - `postgres:18` volume path.
    - SP money-flow and test-mode rules.
- **§3 Code blocks:**
  - The LANG_MAP list and which language to pick when.
  - The `📄 C:\full\path` caption, plus `(일부)` for excerpts.
  - Indentation, line length, no `...` inside copyable blocks.
  - Commands contain no prompt, and the expected output goes directly below.
  - Windows line endings: CRLF is harmless, the Git `LF will be replaced by CRLF` notice, `.sh` files must be LF.
  - Windows PowerShell 5.1 rules: no `&&`, use `curl.exe`, `$env:`, `Remove-Item`, call paths with spaces using `&`, execution policy fix `RemoteSigned -Scope CurrentUser`.
- **§4 Terms:**
  - First use is `**[[term]]**(original word)` plus a one-line definition. This form avoids the bold trap.
  - Exact-case match with the glossary heading.
  - Glossary entry format: `### term` / `- 처음 등장: [P1 Day N](#/day/p1-dNN)` / 2–4 sentences.
  - File naming, and one term per Day.
- **§5 Troubleshooting entry format:** `### symptom or original message` / `- 관련:` / `**원인:**` / `**해결:**` numbered steps. Also file-prefix grouping, and how this differs from a Day's 🧯 section.
- **§6 Verification:**
  - Principle: verify the Day's own blocks exactly as written.
  - Batch procedure and per-project commands (P1 to SP, plus Windows-only steps checked against official docs).
  - The `docs/verification/<batch>.md` table `| Day | 블록(캡션) | 방법 | 결과 |` with the allowed result values.
  - Three scripts, copy-paste ready; each is byte-identical to the file I actually ran:
    - `extract-blocks.mjs` pulls the 📄 blocks out of a Day exactly as written.
    - `verify-p1.mjs` checks pages over static http or `file://`: title, h1, console errors, horizontal scroll at 1280 and 360.
    - `check-bold.mjs` finds bold markers that did not render.
- **§7 Review checklists:**
  - Beginner simulation: the brief's five questions plus 10 more.
  - Technical accuracy: reference/official docs, version pins from external-facts §0.3, a concrete list of bad security habits, verification recorded, links real, check and bold scans clean.
- **Appendices:**
  - A: Day template.
  - B: every build error code with its fix.
  - C: `curriculum.json` rules.
  - D: how writers use `reference/<project>/`. Day code is a progressive slice of the reference. Names and data formats stay identical. Earlier Days use simpler code with only what has been taught. Follow the reference README facts. Report reference bugs instead of quietly diverging.

### 2. `textbook/content/curriculum.json`
- Top level: `version 1`, `writtenAt "2026-11"`, `validation.minDayChars: 4000`.
- Project `p1`: `order 1`, `track "main"`, `requires []`, folder `C:\dev\my-creator-site`.
- All 30 Days, with titles exactly as in spec 3.1, a one-sentence summary each, keywords, and minutes from 90 to 120 (Day 1 is 90).
- Pages are only `glossary` and `troubleshooting` (both generated), per the controller ruling. `start` and `help` are left to Task 8.

### 3. `textbook/content/p1/day-01.md` (about 29.8k characters, 90 minutes)
**Goals and start state.** Goals, a time breakdown (concepts 20, steps 40, tasks 25, wrap-up 5), a "how to read this textbook" tip, and `:::path 📂 시작 상태` as the last block (nothing needed: no install, no network).

**Concepts:**
- Internet vs web, browser, server, URL, web page, website, HTML, code, text editor.
- File, folder, extension (the "last dot" rule and why `hello.html.txt` is a text file), path.
- Why `C:\dev`: no OneDrive, no Korean letters, no spaces.
- Each concept goes analogy → exact definition → real-world context (`:::info 실무에서는`).
- Supporting material: an extension table, a security warning about hidden extensions, two text diagrams that fit 360px, and the `₩` key = `\` note.

**Steps 1–8**, each with **where / what / `:::success`:**
1. Open File Explorer.
2. **보기 → 표시 → 파일 확장명**, with a tip for when the window is too narrow.
3. Create `C:\dev` (**새로 만들기 → 폴더**, `Ctrl + Shift + N`), with a 한/영 warning.
4. Create `C:\dev\hello` and check the address bar.
5. Notepad: **save the empty file first**, so the `.txt` problem shows up immediately.
   - Go to `C:\dev\hello` through the address bar.
   - Set 파일 형식 to 모든 파일 `(*.*)`.
   - Type the name in quotes, `"hello.html"`, and explain why the quotes matter.
   - Check that the encoding is UTF-8.
   - Check the result right after saving, with a stop-and-fix warning if `hello.html.txt` appears.
6. Type the HTML, with a symbol-key table and a meaning list for each line.
7. Open it in Edge, with notes for Edge's first-run screen, the new tab, Chrome via 연결 프로그램 (Chrome is installed on Day 2), and the `file:///` address.
8. The edit → `Ctrl + S` → `F5` loop, with a laptop `Fn` tip.

**Tasks:**
- Task 1 (easy): turn `hello.html` into a self-introduction page.
- Task 2 (medium): build `favorites.html` alone, plus an extension question.

**Answers:** an answer for each task with "왜 이렇게 하나요?", and **오늘 끝 상태 전체 코드** (folder tree plus both full files).

**🧯 section:** 5 issues.
- `hello.html.txt`: the rename fix, with the Korean dialog text and the English original.
- Broken Korean text `�ȳ��ϼ���`, which I reproduced in Chromium.
- Page not updating.
- Destination Folder Access Denied.
- 한/영 input mode.

**End:** 7 checklist items, 3 official links (all confirmed to exist via MDN source repos and Microsoft search results), and the next-Day preview line.

### 4. `textbook/content/glossary/p1.md`
The 15 Day 1 terms in the required format: 인터넷, 웹, 브라우저, 서버, URL, 웹페이지, 웹사이트, HTML, 코드, 텍스트 편집기, 파일, 폴더, 확장자, 경로, UTF-8.

### 5. `textbook/content/troubleshooting/p1.md`
11 Day 1 issues in the `### 증상` / `- 관련:` / `**원인:**` / `**해결:**` format. Error dialogs show the original message plus a Korean gloss. Every HTML-typo symptom was reproduced in Chromium: missing `/`, missing `<`, missing `>`, and a `.txt` file opened in the browser.

### 6. `docs/verification/p1-day-01.md` and the screenshots
This is the exemplar verification record. I added it because spec §7 requires answer code to be verified, and later batches need a filled-in example of the table.
- `docs/verification/p1-day-01.png` (1280 × 15958, full page)
- `docs/verification/p1-day-01-mobile.png` (360 × 22995). Chromium cannot capture a page taller than about 16384 px in one shot, so I scrolled in 4000 px pieces and stitched them. The seams are clean.

## Verification (commands and output)
- `cd textbook && npm run check -- --only p1-d01` → `검사 통과: Day 30개, 페이지 2개, 결과 크기 0.19 MB (--only: 1개 Day만 렌더)`
- `npm run check -- --allow-missing` → passes, with the expected warning that 29 Day files are missing.
- `npm run build -- --allow-missing --out <scratch>/task6/index.html` → `빌드 완료 … (0.19 MB)`. The repo root `index.html` was not created or touched.
- `node <scratch>/check-bold.mjs` on day-01, glossary/p1 and troubleshooting/p1 → `굵게가 풀리지 않은 곳 없음`. It found two real problems along the way, both fixed: `**안녕하세요!**가` and `**⋯**를`.
- Rendered page in Playwright at 1280 and 360, desktop and mobile both:
  - 8 h2 in the right order.
  - 9 code boxes and 9 copy buttons.
  - 7 checkboxes, 3 answers, 15 term links.
  - No horizontal page scroll; the mobile table overflow went away after I turned the per-line HTML table into a list.
  - 0 console errors and 0 external requests.
- I also checked:
  - A term link click lands on the glossary entry (`.is-target`).
  - The troubleshooting and glossary pages render.
  - Search for `hello.html.txt` returns the Day, the troubleshooting page and the glossary.
  - Dark mode at 360px.
- Code blocks, extracted exactly as written (`extract-blocks.mjs`) and opened with `verify-p1.mjs`:
  - Every block passed over both `file://` and http at both widths: titles, h1s and paragraph counts as expected, UTF-8, 0 console errors.
  - The end-state blocks are byte-identical to the task answers (`cmp`).
  - CRLF copies of the files render the same.
- I rendered the screenshots and looked at them myself. Fixes from that review:
  - The text diagrams were too wide at 360px; I narrowed them.
  - The per-line HTML table squeezed on mobile; it is now a list.
  - Troubleshooting `**원인**` ran into its sentence on the same line; it is now `**원인:**` on the same line as the text.
  - The tip block moved before the start-state box, so the start state is truly the last block of 🎯 (rule a).
- `npm test` → 161 pass, 0 fail. That suite uses fixtures and does not touch the new content.

## Files created (the controller commits exactly these)
- `docs/CONTENT-GUIDE.md`
- `docs/verification/p1-day-01.md`
- `docs/verification/p1-day-01.png`
- `docs/verification/p1-day-01-mobile.png`
- `textbook/content/curriculum.json`
- `textbook/content/p1/day-01.md`
- `textbook/content/glossary/p1.md`
- `textbook/content/troubleshooting/p1.md`

## Self-review findings (fixed)
- Wrong claim in the Task 1 explanation: "text inside `<head>` does not show." Chromium actually moves that text into the body and shows it. Now it says the head is not the place to write text.
- Troubleshooting symptom for a missing `>`: the text disappears rather than showing a bracket. This is now its own entry, "제목이나 문장이 통째로 사라졌어요".
- If the keyboard is in English mode, typing `메모장` in Start search fails. Now the step says `메모장` or `notepad`.
- "Notepad always appends `.txt`" softened to "may append", because newer Notepad versions may behave differently.
- "코드" was used without being defined. It is now a Day 1 term.
- `.txt` claims, bold flanking, line references in the verification record, the guide's scripts compared to the files I ran: all re-checked.

## Concerns
1. **Windows UI wording.** `support.microsoft.com` and `techcommunity.microsoft.com` are blocked here (DNS fails), and MDN's site is blocked too. What I could confirm:
   - 보기 → 표시 → 파일 확장명: confirmed through searches restricted to support.microsoft.com, plus Korean how-to guides.
   - 새로 만들기 → 폴더 and `Ctrl + Shift + N`, and the "last dot" rule: confirmed from MDN's raw source on GitHub.
   - Not confirmed: the Save dialog of the newest (Markdown-era) Notepad. That dialog may change between versions, so Day 1 covers it four ways: quotes around the name, the file-type setting, a check right after saving, and a rename fix.
   - Not confirmed: the Korean text of the extension-change, access-denied and save-permission dialogs. All of them carry "문구는 버전에 따라 조금 다를 수 있어요".
   - The verification record marks each of these as 대조 (checked against docs) or 미검증 (unverified).
2. **Hand-offs to Task 8 (the outline):**
   - Task 8 rewrites `glossary/p1.md` with all P1 terms. It must keep these 15 terms assigned to Day 1, or Day 1 must be edited to match.
   - Day 1 promises that Day 2 opens `C:\dev\hello` in VS Code. Day 2 and the outline should agree.
   - The curriculum minutes, summaries and keywords for Days 2–30 are first drafts from spec 3.1 for Task 8 to finalize.
3. **The brief listed pages `start` and `help`.** I followed the controller ruling and left them out. They need to be added together with their `.md` files, or `E_CUR_FILE_MISSING` fires.
4. **A spot in external-facts.md disagrees with spec 3.1.** Its "교재 반영 결정" notes place the VS Code setup choices on "P1 Day 1" and the Git install on "P1 Day 2". Spec 3.1 puts VS Code on Day 2 and Git on Day 7. I followed the spec. Worth fixing before the Day 2 and Day 7 writers read that section.
5. **Possible engine improvement (Task 2's area, out of scope here).** The bold + Korean particle trap gets past `npm run check`. The guide works around it with `check-bold.mjs`, but a validator warning would be more reliable.
6. **Screenshots.** The two PNGs are about 2.1–2.4 MB each. In the desktop full-page capture, the fixed left sidebar only appears at first-screen height; the area below it is blank. That is how full-page capture handles fixed elements, not a page bug, and the record says so.

---

## Fix round 1 (review findings, 4 Important + promoted Minors)

Status: DONE. NO GIT (I deleted the `.webp` from disk only; the controller stages the deletion).

### What changed, item by item

1. **Recovery from `hello.html.txt` now happens in Notepad first.**
   - 5단계: the old warn box is now `:::warn hello.html.txt가 보이거나 hello.html이 안 보이면`, with five numbered steps:
     1. Notepad → **파일 → 다른 이름으로 저장**.
     2. Address bar → `C:\dev\hello` → Enter.
     3. Set 모든 파일 `(*.*)`, type `"hello.html"`, click 저장.
     4. Check that the tab title reads `hello.html`.
     5. Delete the leftover `hello.html.txt` in Explorer (click it, press `Delete`).
   - 🧯 (day-01.md) and `troubleshooting/p1.md` entry 1 now offer two fixes:
     - "메모장에 열려 있을 때 (가장 안전한 방법)": the Notepad Save As steps above. The entry explains why renaming in Explorer re-creates `hello.html.txt` on the next `Ctrl + S`.
     - "메모장에 열려 있지 않은 파일일 때": rename in Explorer.
   - Both say that if the file was already renamed while open, repeat the Notepad Save As and answer **예** when asked to replace.
2. **F2 rename wording.** Pressing F2 selects only the part before the last dot, and typing replaces the whole name. The steps now say: `End` key (or `Fn + →` on laptops), then `Backspace` 4 times. Alternative: `Ctrl + A`, then type `hello.html`. Applied in day-01.md 🧯 and troubleshooting/p1.md.
3. **How to reopen in Notepad.**
   - 7단계 says double-click now opens the browser. A new `:::tip 메모장으로 다시 여는 법` lists:
     - right-click → **연결 프로그램 → 메모장**;
     - if Notepad is not listed, **다른 앱 선택** → **한 번만**, with a warning not to press **항상**;
     - Notepad **파일 → 열기** with the type set to **모든 파일** `(*.*)`.
   - New 🧯 entry and troubleshooting entry: "메모장으로 다시 열고 싶어요 (더블클릭하면 브라우저가 열려요)".
   - The 과제 1 hint and the fixes for "한글 깨짐" and "고쳤는데 그대로" now point to it. "고쳤는데 그대로" also covers a Notepad tab still named `hello.html.txt`.
4. **Recovery when the file was saved in another folder.** Covered by the 5단계 warn box above. New 🧯 entry and troubleshooting entry: "`C:\dev\hello`에 `hello.html`이 안 보여요 (다른 폴더에 저장됐어요)" (Save As → address bar `C:\dev\hello` → `"hello.html"` → confirm in Explorer; files saved in the wrong folder can stay).
5. 3단계 success box now lists `사용자`(영어 Windows는 `Users`).
6. 6단계 symbol table intro now says: symbols and English in English input mode; switch with `한/영` only to type Korean text.
7. 5단계 step 1: "전에 쓰던 글이 보이면 `Ctrl + N`을 눌러 빈 새 탭을 열어요" (Notepad can restore old tabs).
8. 7단계: if a "which app should open this file" prompt appears, choose Microsoft Edge (or Chrome) and press **항상**. The wording carries a version caveat.
9. **Guide bold rules updated to match the new build check:**
   - §1.3: `**` in container or `:::answer` titles is now a build error, `E_BOLD_UNRENDERED`.
   - §1.5: the three cases that fail (unrendered pair, unpaired `**` such as `2**3` without backticks, titles), what the check skips (code, inline code, autolinked URLs), and that `__` is not checked. I confirmed every case against the engine.
   - §6.2 step 5: `npm run check` now catches unrendered bold.
   - §6.3: `check-bold.mjs` is now an optional extra (it also catches `__`).
   - §7.2 checklist updated.
   - Appendix B gains an `E_BOLD_UNRENDERED` row.
10. **Exemplar now follows its own rules.**
    - Guide §2.2: "한 단계 = 한 앱·한 화면" is now "한 단계 = 한 가지 일".
    - 5단계: the why (quotes, UTF-8 with the term definition) now comes before 어디서/무엇을.
    - Guide §2.2 also gains a "복구 경로를 끝까지 설계한다" rule with the four lessons from this review: fix in the editor instead of renaming under an open editor; say how to reopen once double-click opens something else; spell out key-level editing details (F2/End); say which leftover files to delete and which can stay.
    - §7.1 gains a matching checklist item.
11. `troubleshooting/p1.md`: the heading now reads "화면에 `<h1>` 같은 꺾쇠 표시가 글자 그대로 보여요", and "이 페이지 맨 위의 … 항목" now names the entry by its title.
12. `docs/research/external-facts.md`: changed two lines only. "P1 Day 1은 User setup…" became "P1 Day 2(설계서 3.1: 개발 도구 설치)는…", and "P1 Day 2의 Git 설치" became "P1 Day 7(설계서 3.1: Git·GitHub 시작)의 Git 설치". **Note for commit:** this file also holds *another agent's* uncommitted SkiaSharp/ImageSharp changes (section 12 and the version table). I did not touch those. Only these two lines are mine.
13. Deleted `docs/verification/p1-day-01.webp`. No file referenced it.
14. English menu names added:
    - 2단계: **View → Show → File name extensions**.
    - 5단계: **File → Save as** and **Save as type → All files**.
    - Troubleshooting entry "보기 메뉴가 안 보여요".
    - The guide notation table now says to add English names for each Day's key menu.

Also:
- The rare "Destination Folder Access Denied" entry moved from the Day's 🧯 to the troubleshooting page only, so the Day keeps 6 entries (the guide's limit is 3–6). 3단계 now links to [문제 해결 모음](#/page/troubleshooting) for it.
- The verification record has two new 미검증 rows for the Windows-only recovery paths, updated line references (228/344/369/401/418) and an updated screenshot note.

### Commands and output
- `cd textbook && npm run check -- --only p1-d01` → `검사 통과: Day 30개, 페이지 2개, 결과 크기 0.21 MB (--only: 1개 Day만 렌더)`
- `npm run check -- --allow-missing` → `검사 통과 …`
- `npm run build -- --allow-missing --out <scratch>/task6/index.html` → `빌드 완료 … (0.21 MB)`. The repo root `index.html` was not created.
- `npm test` → `# pass 168`, `# fail 0`.
- `check-bold.mjs` on day-01, glossary/p1 and troubleshooting/p1 → `굵게가 풀리지 않은 곳 없음`.
- Code blocks are unchanged. I re-extracted them with `extract-blocks.mjs`:
  - The 6단계 block is byte-identical to the one verified earlier.
  - Both answer blocks are byte-identical to the end-state blocks.
  - `verify-p1.mjs --file` and the http mode both report `통과`.
- Rendered Day 1 at 1280 and 360: 8 h2, 9 code boxes and 9 copy buttons, 7 checkboxes, 3 answers, 15 term links. 360px: scrollWidth 360, no element wider than the viewport outside tables or code. 0 console errors, 0 external requests.
- I looked at 360px views of the new warn box, the reopen tip and the F2 steps (I turned the tip into a list for readability), and at the troubleshooting page.
- The layout changed, so I re-took both JPGs. Each was captured in 4000px pieces and stitched:
  - `p1-day-01.jpg` is 720×10148, quality 82, 840 KB.
  - `p1-day-01-mobile.jpg` is 360×26811, quality 42, 983 KB. I checked a crop; the text is still legible.

### Files changed in this round
- `docs/CONTENT-GUIDE.md`
- `docs/research/external-facts.md` (two lines only; see item 12)
- `docs/verification/p1-day-01.md`
- `docs/verification/p1-day-01.jpg`
- `docs/verification/p1-day-01-mobile.jpg`
- `docs/verification/p1-day-01.webp` (deleted)
- `textbook/content/p1/day-01.md`
- `textbook/content/troubleshooting/p1.md`

### Remaining concerns
- I could not test the new recovery paths on a real Windows machine. The record marks them 미검증. They rest on the reviewer's report and on standard Windows behavior: Notepad remembers the path it opened, F2 pre-selects the name before the extension, the Open With dialog offers 한 번만/항상, and Notepad restores old tabs.
- Day 1 is now about 35k characters. Its time budget is still 90 minutes (5단계 stays at 7 minutes), because the added text is only read when something goes wrong.
