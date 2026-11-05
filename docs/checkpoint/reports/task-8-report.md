# Task 8 report — P1 상세 개요, _meta.json, 시작·도움 페이지, P1 용어 사전

Status: DONE_WITH_CONCERNS (concerns are cross-project term overlap and items only verifiable on Windows/in real apps; see end).
Git: none — NO GIT (read-only `git status`/`git diff` only).

## What I implemented

1. `textbook/content/p1/_outline.md` (≈197 KB) — the contract for parallel Day writers.
   - §0 P1-wide rules: folders/names/text, how to open pages per Day range (file:// vs Live Preview; fetch pages Live Preview only from Day 25), Git habit from Day 7/8 (`Day N: 요약` messages), time/YouTube/external-host rules, a **`style.css` section map** (reference section comments + which Day creates each, colour hex values used before Day 14), JS file section ordering, and the Day on which each method not named in spec 3.1 is introduced (`String`/`Number` 15, `toggle`/`closest`/`dataset`/`setAttribute`/`querySelectorAll` 21, `matchMedia` 22, `trim`/`toLowerCase`/`includes`/`hidden` 23, `removeAttribute`/`getAttribute`/`contains`/`focus`/`reset` 24, `Math.floor`/`padStart`/`split` 26, `URLSearchParams`/`clearInterval` 27).
   - §1 reference file appearance table: all 22 reference files (+ README) appear by Day 29; "완성" Day for each. Day 30 end state = 22 project files.
   - §2 intermediate-stage table (every Day whose end state differs from the reference, and the Day that upgrades it).
   - §3 glossary assignment table (one owner Day per term) + list of terms that P2 also touches.
   - §4 30 Day blocks in the exact brief format + `레퍼런스 대응:` line. Each block: 목표 / 이미 배운 것 / 시작 상태 / 오늘 만들/바꿀 파일 (exact insertion points) / 끝 상태 확인 / 과제 → 정답 요지 / 용어(사전 담당) / 자주 막히는 곳 후보 (Windows 11 + PowerShell realities) / 레퍼런스 대응.
   - "시작 상태" lists are **generated** from a single file-timeline table (scratch `gen.py`) so Day N start == Day N-1 end exactly (project files, `C:\dev\hello` practice files, tools/accounts, commit state).
   - Honoured task-8-notes: Day 2 continues Day 1's promise (opens `C:\dev\hello` in VS Code); Day 22 theme code without try/catch, Day 25 adds it; local computer time + P2 Day 29 note; YouTube IDs are examples; nickname `pattern` + `validity.patternMismatch` taught Day 24 (Constraint Validation API); overlay `split(':')` + `Number()` + range check Day 27; template literals (16) and arrow callbacks (18) used consistently; fixed label "다크 모드" + `aria-pressed`; contents.html h2 "영상 목록" (Day 20).
   - Key design decisions: project folder starts Day 3; JS practice in `C:\dev\hello\lab.html`/`lab.js` (Days 17–18, no project change those days); static cards in contents.html Day 12 → replaced by JS Day 20; mobile menu visible until Day 21 toggle; category delegation Day 21 logs to console, real filtering Day 23; `aria-live` on result count is a Day 24 exercise; overlay favicon link added Day 28 (`../` review); OBS optional; README Day 29, retrospective section Day 30.
2. `textbook/content/p1/_meta.json` — `{ project: <full p1 object>, pages: [start, help] }`. Titles = spec 3.1 verbatim (asserted). Minutes changed vs current curriculum: D2 90→100, D4 90→100, D21 100→110, D24 100→120, D26 100→110, D28 100→110 (total 3050). Summaries/keywords updated to the outline (e.g. "data 속성" moved to Day 21 where `dataset` is first taught). Pages: `{id:"start",title:"시작하기",file:"start.md"}`, `{id:"help",title:"막혔을 때 탈출 가이드",file:"help.md"}` (order start → help). curriculum.json NOT edited (R32).
3. `textbook/content/pages/start.md` — 교재 사용법 (top bar, sidebar marks 🔒/▶/✅, 이어서 하기, Day 완료/완료 취소 and the previous-Day rule, unlock rules, preview of unlocked Days, checklist saving, search, answer gate with the real button labels "그래도 정답 볼래요"/"조금 더 풀어 볼게요", end-state code), 진도 백업 (⚙ 설정 → 진도 내보내기/불러오기, file name pattern, 진도 모두 지우기 warning, storage-unavailable banner) — labels taken from `textbook/src/app/views/*.js`; 학습 원칙 5 (직접 타이핑, 성공 상자, 30분 규칙, 하루 한 Day, 매일 커밋); 전체 지도 (32-col text diagram, P1/P2/P3/SP/graduation with folders and unlock rules); 준비물.
4. `textbook/content/pages/help.md` (막혔을 때 탈출 가이드) — 5-step flow; 30분 규칙; reading errors (where they appear, 4-part reading with a real Chromium message, real `git` fatal message, keyword table); VS Code compare via Command Palette `File: Compare Active File With...` (+ Explorer fallback); catching up with "오늘 끝 상태 전체 코드" (backup first: commit or folder copy; `(일부)` blocks; use the immediately previous Day); AI/community question template (Day 번호·한 일·기대·실제·오류 원문·코드·해 본 것, screenshot `Win + Shift + S`, remove secrets, verify AI answers, keep names); 쉬어 가기 규칙.
5. `textbook/content/glossary/p1.md` — Day 1's 15 entries untouched (diff is 833 insertions, 0 deletions); 155 new entries appended under `## Day N` separators. Format `### 용어` / `- 처음 등장: [P1 Day N](#/day/p1-dNN)` / 2–4 sentences.

## Verification

- Scratch merge (outline-rules item 6): copied `textbook/content` to `<scratch>/task-8/merge/content`, replaced the p1 project with `_meta.json.project`, prepended `_meta.json.pages`, then
  `node textbook/build.mjs --check --allow-missing --content <scratch>/merge/content` →
  `경고 E_CUR_FILE_MISSING p1: Day 파일 29개가 없어 "준비 중" 화면으로 대신해요 …` / `검사 통과: Day 30개, 페이지 4개, 결과 크기 0.39 MB` — **0 errors** (start.md, help.md, glossary rendered and link/term/bold checks passed).
- Real tree (unmerged): `node textbook/build.mjs --check --allow-missing` → `검사 통과: Day 30개, 페이지 2개` (glossary change does not break the current build). Plain `npm run check` without `--allow-missing` still fails only because Day 2–30 files don't exist yet (pre-existing, Ruling R4).
- `cd textbook && npm test` → `# tests 168 # pass 168 # fail 0`.
- Consistency scripts (scratch): glossary headings (170) == outline §3 table (170) == each Day block's `용어(사전 담당)` line; every glossary `처음 등장` Day matches its owner Day; no case-insensitive duplicates; outline headings' titles/minutes == `_meta.json`; titles == spec 3.1; Day 30 file timeline == 22 reference files; placeholder words grep clean.
- Error originals quoted in help.md were reproduced here: `Uncaught TypeError: Cannot read properties of null (reading 'addEventListener')` (Playwright Chromium, file://) and `fatal: not a git repository (or any of the parent directories): .git` (git on Linux; same text on Git for Windows is expected but not run on Windows).
- No TDD (content task, no code).

## Files changed (controller commits exactly these)

- `textbook/content/p1/_outline.md` (new)
- `textbook/content/p1/_meta.json` (new)
- `textbook/content/pages/start.md` (new; also created the `textbook/content/pages/` folder)
- `textbook/content/pages/help.md` (new)
- `textbook/content/glossary/p1.md` (modified, append-only)

Scratch only (not in repo): `<scratchpad>/task-8/{gen.py,_outline.src.md,glossary-add.md,merge/,errsite/,err.mjs}`. To edit the outline later, edit `_outline.src.md` and rerun `python3 gen.py _outline.src.md textbook/content/p1/_outline.md` (or edit `_outline.md` directly, keeping start states chained).

## Glossary term → owning Day

| Day | Terms |
|---|---|
| 1 | 인터넷, 웹, 브라우저, 서버, URL, 웹페이지, 웹사이트, HTML, 코드, 텍스트 편집기, 파일, 폴더, 확장자, 경로, UTF-8 (unchanged) |
| 2 | VS Code, 확장 프로그램, 명령 팔레트, 자동 저장, Live Preview |
| 3 | 태그, 요소, 속성, DOCTYPE, 주석, Emmet, 들여쓰기 |
| 4 | 링크, 절대 경로, 상대 경로, 목록, 대소문자 구분 |
| 5 | SVG, 대체 텍스트, 접근성, 스크린 리더, 상위 폴더 |
| 6 | 시맨틱 HTML, 블록 요소, 인라인 요소, 문자 참조, 개발자 도구 |
| 7 | 버전 관리, Git, GitHub, 저장소, 원격 저장소, 커밋, 스테이징, 푸시, 브랜치, 터미널, PowerShell |
| 8 | 표, 폼, 레이블, iframe, 임베드 |
| 9 | CSS, 선택자, 클래스, CSS 속성, 색상 코드, 캐시 |
| 10 | 박스 모델, margin, padding, border, box-sizing, px, rem |
| 11 | Flexbox, 주축, 교차축, 속성 선택자, ARIA |
| 12 | Grid, fr, minmax, auto-fit |
| 13 | 반응형 웹, 뷰포트, 미디어 쿼리, 모바일 우선, 브레이크포인트 |
| 14 | CSS 변수, 의사 클래스, 트랜지션, 배포, GitHub Pages |
| 15 | JavaScript, 콘솔, 변수, 자료형, 문자열, 불리언, undefined, null, 연산자, NaN, defer |
| 16 | 조건문, 비교 연산자, 논리 연산자, 템플릿 리터럴, 삼항 연산자, Date |
| 17 | 배열, 인덱스, 반복문, for...of |
| 18 | 함수, 매개변수, 반환값, 화살표 함수, 스코프 |
| 19 | 객체, 키, 메서드, 콜백 함수, 배열 메서드 |
| 20 | DOM, querySelector, textContent, classList, createElement |
| 21 | 이벤트, 이벤트 리스너, 이벤트 위임, 햄버거 메뉴, data 속성 |
| 22 | 다크 모드, localStorage, prefers-color-scheme |
| 23 | input 이벤트, hidden 속성, 문자열 메서드 |
| 24 | 폼 검증, 정규 표현식, 제약 조건 검증 API, preventDefault, aria-live |
| 25 | JSON, fetch, 비동기, async 함수, await, try...catch |
| 26 | setInterval, 밀리초, 의사 요소 |
| 27 | 오버레이, OBS Studio, 브라우저 소스, URL 파라미터, URLSearchParams, vw, clamp |
| 28 | 건너뛰기 링크, SEO, Open Graph, 파비콘, 지연 로딩, Lighthouse |
| 29 | 버그, 디버깅, 중단점, Markdown, README |
| 30 | 회고 |

Total 170 (15 kept + 155 new). Note: CSS breakpoint is "브레이크포인트" (Day 13) and debugger breakpoint is "중단점" (Day 29), deliberately distinct.

## Self-review findings (fixed before reporting)

- Day 10: `img` rule and h1–h3 sizes placed in reference order; Day 10 now creates the section-6 sub-comments (`홈: 소개 영역`, `소개 페이지`, `방송 일정`) that later Days use as anchors.
- Day 10: `img { height: auto }` moved into Day 10 (otherwise the 160px hero image would be an ellipse because of `height="240"`).
- Day 21: 768px `.menu-toggle` rule placed after `h1` (reference order); Day 23 `.toolbar` placed before `.filters`.
- Day 13 now introduces `flex-basis`; Day 24 introduces `:empty`.
- Day 6 removes the Day 3 comment deterministically; Day 8 end-state typo fixed; help.md self-link and Korean "Untitled" naming fixed.

## Concerns / could not verify

1. **Cross-project glossary overlap (R37).** P1 owns 터미널, PowerShell (Day 7), 브랜치 (7), 배포 (14), 비동기/async 함수/await/fetch/JSON (25). P2's outline (parallel) may also define 터미널·PowerShell (P2 Day 2), 브랜치 (P2 Day 37), Promise/fetch (P2 Day 8), 배포 (P2 Day 39) → `E_TERM_DUPLICATE` after merge if so; P2 should link instead. P1 intentionally does NOT define 출처/origin, 포트, localhost, 상태 코드, Promise (left to P2).
2. **Page order on merge.** My scratch merge put `start, help` before `glossary, troubleshooting`; the controller decides the final order.
3. **Not verifiable here (marked "실기 미확인"/"실측 필요" in the outline for Day writers):** VS Code Korean UI labels (Workspace Trust dialog, Live Preview icon, `도움말 → 정보`, Korean name of `File: Compare Active File With...`, Explorer "비교를 위해 선택"/"선택한 항목과 비교", whether an untitled tab appears in the compare quick pick, Korean name of `Untitled-1`); Live Preview default port 3000 and whether a firewall prompt appears; Edge first-F12 prompt; Chrome console "allow pasting" behaviour and let-redeclare behaviour in the console; YouTube embed failure text on file://; Windows Script Host on double-clicking `main.js`; Korean PowerShell "not recognized" wording; Git Credential Manager browser flow; GitHub noreply-email and visibility-change UI; OBS "로컬 파일" + query string, cache-refresh button text; Lighthouse in Edge; Chrome `file://` fetch error text and JSON SyntaxError texts (Day writers must reproduce in Playwright and quote originals).
4. help.md compare procedure (§3) follows VS Code's documented command but the exact quick-pick contents for an untitled editor were not run here; a fallback via the Explorer "열려 있는 편집기" list is given.
5. Brief Step 3 says `npm run check` → 0 errors; that command cannot pass until Day files exist (R4), so verification used outline-rules item 6 as instructed.
6. The reference README's facts were followed; no reference defects found. `.sr-only` exists in the reference CSS but is unused in the reference HTML — the outline (Day 28) teaches it as a utility class "kept for later", which matches the reference as-is.
