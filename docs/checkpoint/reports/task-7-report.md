# Task 7 report: P1 reference implementation

Status: DONE_WITH_CONCERNS (concerns are minor, listed at the end). NO GIT used; no commits.

## What was implemented

The finished "달빛곰 방송국" creator site (HTML, CSS and vanilla JS only, no classes or modules, no external requests except YouTube) plus the OBS overlay, the two shared test helpers (ruling R5) and the Playwright test file.

Day mapping, so lessons can be cut straight from the code:

| Day | Where |
|---|---|
| 3-6 | multi-page HTML, relative paths, `images/`, semantic header/nav/main/section/footer |
| 8 | `schedule.html` table, `contact.html` form, `index.html` YouTube iframe |
| 9-14 | `css/style.css`: variables, box model, flex nav, grid cards, mobile-first with a 768px media query, hover/transition |
| 16 | `main.js` time-of-day greeting (if/else, browser local time) |
| 17-20 | `contents.js` and `schedule.js`: loops, functions, `filter`/`forEach`, `createElement` cards |
| 21 | menu toggle, event delegation on `#category-filters` and on the form `input` event |
| 22 | theme toggle, `localStorage` key `theme`, `prefers-color-scheme` |
| 23 | category filter and title search |
| 24 | `contact.js`: JS validation, `aria-invalid`, `aria-live` status |
| 25 | `fetch` + `async/await` + `try/catch` with a friendly error (including the `file://` hint) |
| 26 | `Date`: today's row highlighted, next-broadcast countdown |
| 27 | `overlay/` with URL params, transparent background |
| 28 | lang, description, Open Graph, favicon, labels, alt, skip link, focus styles, contrast checked |
| 29 | `README.md` |

Interfaces follow the brief verbatim:
- Overlay: `?title=<제목>&start=<HH:MM>` is today's Korea time. Once the time has passed it shows `곧 시작해요!`. `html` and `body` backgrounds are `transparent` (computed `rgba(0, 0, 0, 0)`). With a missing or invalid `start` it shows a usage hint.
- `data/videos.json` is `[{id,title,category,youtubeId,date}]` with 6 entries, 2 per category. `data/schedule.json` is `[{day,start,title}]` with 4 entries.
- localStorage key is `theme` (`light` or `dark`).

Decisions worth knowing:
- **YouTube (iframe rule).** Video cards on `contents.html` are plain links to `https://www.youtube.com/watch?v=<id>` with a local SVG placeholder thumbnail, so the list never touches the network. The only iframe is one `loading="lazy"` embed on `index.html`.
  - Without any stubbing, run in this sandbox where YouTube is unreachable (`ERR_TUNNEL_CONNECTION_FAILED`), index.html logged 0 console or page errors with the iframe scrolled in and not.
  - Tests additionally stub every non-`127.0.0.1` request (a fake 200 response) and record the URLs. The links test asserts the only external requests are to YouTube.
- **Korea time is explicit.** `schedule.js` and `overlay/countdown.js` use `Date.now() + 9h` and read it with `getUTC*()`. Behavior is identical whatever the machine's time zone. Tests prove it by opening with the `America/Los_Angeles` and `America/New_York` zones.
- **Schedule table plus JSON.** The table is static HTML (Day 8) and `schedule.json` drives the countdown, so the two are duplicated. The test `schedule table matches schedule.json` keeps them in sync.
- **Theme toggle** sits inside the nav list, so the DOM and visual order match on mobile and desktop.
- **`og:image` is not set.** An Open Graph image needs an absolute URL and SVG is not supported by scrapers, so README and Day 28 should say to add it after deployment. `og:title`, `og:description`, `og:type` and `og:locale` are set.

## Tests

`node --test tests/reference/p1.test.mjs` runs 18 tests, one fresh browser context each (no localStorage leakage):

1. all pages load without console errors (5 pages + overlay)
2. all internal links resolve (every `a[href]`, `img[src]`, `link[href]`, `script[src]`, `iframe[src]` is relative and returns 200 over HTTP; `#anchors` have targets; absolute URLs must be YouTube; external requests are YouTube only)
3. mobile menu toggles at 375px (`aria-expanded`)
4. desktop shows the menu without a toggle button
5. theme toggle persists (click, reload, next page, toggle back; `localStorage.theme`; `aria-pressed`)
6. theme follows the system preference until a choice is saved
7. home greeting matches the time of day (fixed clock)
8. contents render from json and filter by category (also search, empty state, YouTube hrefs)
9. contents shows a friendly message when the json cannot be loaded
10. contact shows validation errors then success (aria-live, focus to first error, live error clearing, form reset)
11. schedule table matches schedule.json
12. schedule highlights today and counts down to the next broadcast (Korea time)
13. overlay shows countdown and transparent background (`?title=테스트&start=23:59`; accepts `HH:MM:SS` or `곧 시작해요!`, so it works whenever it runs)
14. overlay counts down to a start time 2 minutes ahead
15. overlay says it is about to start when the time has already passed
16. overlay explains how to use the url when parameters are missing
17. no horizontal scroll at 360px on every page (also with the mobile menu open, and the overlay with a long title)
18. accessibility and SEO basics on every page (the Lighthouse replacement: `img[alt]` missing 0, `meta[name=description]`, lang, title, viewport, `og:title`, favicon, exactly one h1 and one main, every form field has a label)

Time-dependent tests use the Playwright clock: `page.clock.setFixedTime` for the schedule, greeting and "passed" tests, and `clock.install` + `pauseAt` + `runFor` for the tick test.

**Ruling deviation to note (determinism):** the "2 minutes ahead" test does not use the real current time. The page clock is fixed at 14:00:00 Korea time and `start` is computed from that fake "now" + 2 minutes (`14:02`). A real-now + 2 min start breaks when it crosses Korea midnight. The test then checks `00:01:59`, advances 60 s to `00:00:59`, advances another 60 s to `곧 시작해요!`. The literal `23:59` test (13) uses the real clock and accepts either form.

### RED
Command: `node --test tests/reference/p1.test.mjs`. First run, before the data files existed, crashed on `ENOENT ... data/videos.json`. I then created only the JSON data files (the contract) and re-ran:
```
not ok 1 - all pages load without console errors   (expected: 200, actual: 404)
... not ok 2 through not ok 17 ...
# tests 17
# pass 0
# fail 17
```
Expected: no pages existed yet, so every test failed (404 or timeouts). Test 7 (greeting) was added later, after GREEN.

### GREEN
Command: `node --test tests/reference/p1.test.mjs`
```
# tests 18
# pass 18
# fail 0
# duration_ms ~25000
```
Run repeatedly: 5 consecutive and 2 more consecutive runs under artificial CPU load (4 busy loops on 4 cores), all 18/18.

Two failures hit on the way to GREEN, both fixed:
- The theme test read `background-color` mid-transition (0.2s CSS transition), so the test now waits for the final dark colour.
- `schedule.json` titles did not match the HTML table, which the sync test caught.

Other checks done by hand:
- Screenshots of index (light and dark), contents (375px with the menu open), schedule, contact with errors, and overlay, all inspected.
- WCAG AA contrast ratios computed for every text/background token pair in both themes (minimum 6.04).
- `node --check` on all JS.
- `file://` open: no crashes; contents and schedule show the friendly error; overlay and contact work.
- Static server: content types, 404, traversal (`..%2F..` gives 403; raw `/../../` is normalised and gives 404).

## Files created (the controller commits exactly these)

```
tests/helpers/static-server.mjs
tests/helpers/browser.mjs
tests/reference/p1.test.mjs
reference/p1-my-creator-site/index.html
reference/p1-my-creator-site/about.html
reference/p1-my-creator-site/contents.html
reference/p1-my-creator-site/schedule.html
reference/p1-my-creator-site/contact.html
reference/p1-my-creator-site/favicon.svg
reference/p1-my-creator-site/README.md
reference/p1-my-creator-site/css/style.css
reference/p1-my-creator-site/js/main.js
reference/p1-my-creator-site/js/contents.js
reference/p1-my-creator-site/js/schedule.js
reference/p1-my-creator-site/js/contact.js
reference/p1-my-creator-site/data/videos.json
reference/p1-my-creator-site/data/schedule.json
reference/p1-my-creator-site/images/logo.svg
reference/p1-my-creator-site/images/profile.svg
reference/p1-my-creator-site/images/thumb-game.svg
reference/p1-my-creator-site/images/thumb-talk.svg
reference/p1-my-creator-site/images/thumb-music.svg
reference/p1-my-creator-site/overlay/countdown.html
reference/p1-my-creator-site/overlay/countdown.css
reference/p1-my-creator-site/overlay/countdown.js
```
Only these were touched. Other untracked paths in `git status` (`tests/fixtures/`, `tests/unit/*`) belong to other agents.

## Helper API (R5, exactly as specified)
- `startStaticServer(rootDir)` returns `{ url: 'http://127.0.0.1:<port>/', close() }`.
- `launch()` returns a `Browser`; `collectConsoleErrors(page)` returns a live `string[]` filled from console errors and `pageerror`.

## Self-review and concerns
1. **YouTube IDs are unverified.** Outbound YouTube is blocked here, so I could not check them. The six IDs are Blender open-movie videos I know from memory (`aqz-KE-bpKQ`, `eRsGyueVLvQ`, `R6MlUcmOul8`, `Y-rmzh0PI3c`, `TLkA0RELQ1g`, `WhWc3b3KhnY`), and the titles are fictional. README says the IDs are examples to replace. The lesson text must say the same, and a reviewer with network access should spot-check them.
2. **YouTube embed under `file://`** may refuse to play (referrer requirement). This is noted in README as "may not play". I could not verify it.
3. **Beginner-scope.** All syntax used is within Day 1-30 (no destructuring, spread, optional chaining, classes or modules). Two items come slightly early. `try/catch` appears in the Day 22 theme code (Day 25 teaches it). The Korea-time helper (`Date.now() + 9h` then `getUTC*`) is introduced in Day 26 and copied into the overlay in Day 27. Both are commented in Korean.
4. **Global scope.** Classic scripts share one global scope, so `main.js` and the page script must not declare the same top-level names. They currently do not; this is a useful Day 18 or 29 talking point.
5. **Theme flash.** The theme is applied from the deferred `main.js`, so a dark-mode user may see a brief light flash on load. I accepted it to keep the lesson simple.
6. **Unexplained blip.** One early invocation of a two-iteration shell loop returned only one result block and exit 1. It was probably contention with the other agents' parallel Playwright runs. It did not reproduce in the 5 plain runs, the 2 loaded runs and the other repeated runs afterwards. The suite takes about 25 s, so a parallel runner should leave headroom.
7. The overlay is white text with a dark shadow. It is readable on a white browser page but intended for OBS, and README notes the browser preview looks faded.

---

# Fix round 1 (review findings promoted by the controller)

NO GIT. Only `reference/p1-my-creator-site/` and `tests/reference/p1.test.mjs` were touched (helpers unchanged).

## Changes by finding

1. **Theme button a11y.** `js/main.js` no longer swaps the button text. The label stays "🌙 다크 모드" in all five pages, and only `aria-pressed` changes. Because the text no longer shows the state, `css/style.css` fills the button when `aria-pressed="true"` (same rule as the pressed filter buttons). The theme test now asserts the label is constant and `aria-pressed` toggles `false`, `true`, `false`.
2. **try/catch comment.** `main.js` now says "(try/catch는 Day 25에서 자세히 배워요)" above `getSavedTheme`.
3. **Heading order.** `contents.html` has `<h2>영상 목록</h2>` before the result count and list; cards stay `h3`. The accessibility test now also checks, on every page after rendering, that heading levels never skip.
4. **Local time instead of UTC+9 math.**
   - `schedule.js` and `overlay/countdown.js` use `new Date()`, `getDay()`, `getHours()`, `setHours()` and `setDate()` only. All `Date.UTC`, `getUTC*` and offset code is removed. Both files carry the comment "이 코드는 컴퓨터 시간이 한국 시간이라고 가정해요. 시간대는 P2에서 제대로 배워요."
   - `isValidStart` in the overlay replaces the alternation regex with `split(':')`, `Number()` and range checks (hour 0-23, minute 0-59); a missing `:` or empty parts are rejected.
   - Variables are declared before first use: `timerId` and `targetTime` are declared before `update()`, and the final `if/else` runs last.
   - Tests: all contexts already use `timezoneId: 'Asia/Seoul'`. The LA and New York assertions are removed, and the fixed-clock deterministic tests are kept. The overlay invalid-parameter test now loops over `25:99, 24:00, 12:60, -1:30, abc, ab:cd, 20:, :30, 1230, 10:30:00` (all show the hint) and `00:00, 07:05, 23:59` (all count down or say `곧 시작해요!`).
   - README: the `start` row is now "오늘 방송 시작 시각 `HH:MM`"; it says time is based on the computer clock and Korean time on a Korean PC; it says `schedule.js` and the overlay assume the computer clock is Korea time.
5. **Style consistency.** All four page scripts and the overlay now use template literals for every string built from parts, and arrow functions for every callback (`addEventListener`, `filter`, `forEach`, validators). Named top-level functions remain `function` declarations. The `validators` object now holds arrow functions. No other new syntax; `grep "function ("` and string-concatenation greps find nothing.
6. **Behavior bugs.**
   - (a) `contents.js` has an `isLoaded` flag, and `render()` returns early until `videos.json` has arrived. The "불러오는 중이에요…" text stays, there is no "영상 0개" and no empty message. A category or search chosen meanwhile is remembered and applied on arrival. New test: `contents keeps the loading state until videos.json arrives`, which holds the response with a Playwright route gate.
   - (b) `contact.js` now calls `updateErrorSummary()` from the form `input` handler. It updates "고칠 곳이 N군데" to the remaining count and clears it (text and class) when all errors are fixed. The text is only rewritten when it changed, so screen readers do not re-read the same sentence. The main contact test asserts 3군데, then 2군데, 2군데, 1군데, 1군데 after resubmitting, then cleared.
   - (c) `aria-live="polite"` is removed from `#form-status`, which keeps `role="status"`. The test asserts the role is `status` and `aria-live` is absent. `#result-count` keeps its explicit `aria-live` as the Day 24 example.
7. **`pattern`.** `contact.html` has an optional field "채팅 닉네임 (선택)" with `pattern="[A-Za-z0-9가-힣_]{2,20}"`, a hint paragraph, and an error paragraph, wired by `aria-describedby`. `contact.js` validates it with `input.validity.patternMismatch`, so the HTML attribute is the single source of truth; an empty value is valid. Focus order follows the DOM order name, email, nickname, message. New test: `contact validates the optional nickname with the pattern attribute`. It checks the attribute value, rejects `가`, `a b`, `a!b` and 21 characters, then accepts `달빛_곰2`, clears the summary and succeeds. The empty-nickname case is covered by the main contact test, which sends successfully with the nickname empty.

## Tests

Command: `node --test tests/reference/p1.test.mjs`
```
# tests 20
# pass 20
# fail 0
# duration_ms ~26000
```
Three consecutive full runs after the last edit: 20/20 each, exit 0, no stderr or warning output. Earlier in the round, one run at the same code state also passed 20/20 (the other agent's `pkill -x node` did not affect any run that completed).

Mutation check: each new or changed assertion was shown to fail when the matching code was reverted (and restored afterwards, with the final suite green):
- no `isLoaded` guard: loading-state test fails
- no `updateErrorSummary()`: both contact tests fail
- `pattern` attribute removed: nickname test fails
- label swapped back: theme test fails
- `<h2>` removed from contents: accessibility (heading order) test fails
- hour range loosened to 99: overlay parameter test fails

Visual check: contact page in dark mode with a nickname error; the pressed theme button is clearly filled.

## Files changed in this round
```
reference/p1-my-creator-site/README.md
reference/p1-my-creator-site/contact.html
reference/p1-my-creator-site/contents.html
reference/p1-my-creator-site/css/style.css
reference/p1-my-creator-site/js/main.js
reference/p1-my-creator-site/js/contents.js
reference/p1-my-creator-site/js/schedule.js
reference/p1-my-creator-site/js/contact.js
reference/p1-my-creator-site/overlay/countdown.js
tests/reference/p1.test.mjs
```

## Notes
- Report item 3 of the first round is superseded: `try/catch` is still in the Day 22 code, now with the explicit pointer to Day 25. The Korea-time helper (and the UTC+9 math) no longer exists.
- With local time, the schedule highlight, next-broadcast countdown and overlay depend on the machine clock. The tests open every context with `timezoneId: 'Asia/Seoul'`, so the suite is independent of the test machine's zone.
