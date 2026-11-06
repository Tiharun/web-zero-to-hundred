# Task 5 report: runtime UI, styles and e2e

Status: DONE_WITH_CONCERNS (small structural deviations and unverified-on-Windows items, see Concerns). NO GIT used; nothing committed.

## What was implemented

Browser UI built on the Task 4 logic and the Task 3 embedded data/templates. Only DOM APIs; every string from data goes in through `textContent`/text nodes (no `innerHTML`).

- `textbook/src/app/main.js`: reads `#wzh-data`, creates the store, loads and normalizes progress, builds `ctx`, renders on `hashchange` and moves focus to `#main` (not on the very first load, so the skip link stays first in Tab order). Views render into `#main` and return the window title. `ctx.go(hash, {replace, keepFocus})` is used by the search box so typing never steals focus. A throwing view is caught and shows a friendly message.
- `views/shell.js`: sidebar built once and updated in place (keeps focus and scroll), per-project `<details>` (open for the active/current project, user toggles respected), Day links `a[data-day][data-state=locked|done|next|open]`, locked pages marked, mobile off-canvas drawer (menu button, backdrop, Escape, `main.inert` while open), theme toggle (`system` -> explicit light/dark; settings has all three), storage banner (`store.available` read every time, dismissible), search box with debounce (Enter searches immediately), skip link handler (does not touch the hash), polite live region.
- `views/home.js`: hero, `continue-button` (first Day / continue; all-done message plus roadmap link), `progress-main` and `progress-special` cards (`data-percent`; the special card is rendered only when a special track has Days), learning-path map with state chips, appendix links, one-shot notice (used after reset).
- `views/project.js`: intro, facts (summary, outcome, folder), progress meter, Day list (rows use `data-row`, not `data-day`, so the sidebar contract selector stays unique).
- `views/day.js`: clones `t-day-<id>`; binds checkboxes (`data-check`) to progress, clicking item text also toggles; answer gate (first click on a closed `details.answer` is `preventDefault`ed, `answer-gate` shown before it, `answer-gate-confirm` opens it; confirmation kept only in a module-level `Set`, so a reload asks again); copy buttons (`navigator.clipboard.writeText`, fallback hidden `textarea` + `execCommand('copy')`, last resort selects the code; label becomes `복사됨` for 2 s); footer with `complete-button` (disabled, `aria-describedby` reason text when the previous Day is not done) / `uncomplete-button` (disabled with reason when blocked), `unlock-banner` from `newlyUnlocked`, prev/next cards (`rel=prev|next`), project-complete message; small "이 Day의 순서" outline of h2 buttons (they scroll and focus the heading; plain `#id` links would break the hash router).
- `views/page.js`: appendix pages, anchor scroll for `#/page/<id>/<anchor>` (`is-target` highlight), lock screen when `requires` is unmet.
- `views/search.js`: R21 predicate (day: `projectState === 'locked'`; page: `!isUnlocked(requires)`; unknown item = locked), locked results show title only (`data-locked="true"`, no `.snippet`), matches highlighted with `<mark>` via DOM nodes.
- `views/settings.js`: theme radios, `export-button` (Blob download `web-zero-to-hundred-progress-YYYY-MM-DD.json`), `import-input` (errors go to `import-message`; ok -> `window.confirm` before replacing; reports `dropped`; the device theme is kept), `reset-button` (confirm, then clear, go home with a notice), about line.
- `views/common.js` (extra file, see Concerns): `h()` DOM helper, lookups, meter, breadcrumb, `lockScreen` (`lock-screen`, never attaches body content), `notFoundScreen`.
- `textbook/src/template.html`: `data-testid`s for `search-input`, `theme-toggle`, `storage-banner`; icon+label topbar buttons; `#live` region; a tiny `<script id="theme-init">` in `<head>` that applies a saved explicit theme before first paint (no flash).
- `textbook/src/styles.css`: `:root` tokens, dark values both in `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` and `:root[data-theme="dark"]`; fonts `"Malgun Gothic","Apple SD Gothic Neo",system-ui,sans-serif` / `Consolas,"D2Coding",monospace`; line-height 1.75, `--measure: 72ch`; `word-break: keep-all` with `overflow-wrap: anywhere`; five distinct callout hues with a text label per kind (not color only); code blocks with header bar (file name + copy), `pre { overflow-x:auto }`; `main { min-width:0 }`; off-canvas under 960px; `:focus-visible` 3px outline; `prefers-reduced-motion`; `.coming-soon` styled (dashed box); tables scroll inside themselves; no external fonts or assets.
- R15 in `textbook/build.mjs`: missing `styles.css` is now an error `E_NO_CSS` (build stops, `file` = the css path); `builtAt` is `YYYY-MM-DD` (UTC date).

## Tests and TDD evidence

R15 RED (before the build.mjs change), `cd textbook && node --test ../tests/build/build.test.mjs`:
```
not ok 1 - fixture builds to single file        (builtAt is the date only ...)
not ok 19 - a missing styles.css is an error (E_NO_CSS) ...
not ok 20 - the real src builds the fixture without warnings and without churn on rebuild
# tests 20  # pass 17  # fail 3
```
e2e RED (a placeholder `styles.css` and the empty `main.js`, so the fixture builds and the page opens but no UI exists), `npm run test:e2e`:
```
not ok 1 - home shows 0% and continue goes to fa-d01   error: 'page.waitForFunction: Timeout 10000ms exceeded.'
... (all 19 tests at that point fail the same way)
# tests 19  # pass 0  # fail 19
```
(Without any `styles.css` the `before` hook already fails with `E_NO_CSS`, which is also the R15 behavior.)

GREEN: `cd textbook && npm run test:e2e` -> `# tests 20 # pass 20 # fail 0` (about 13 s; run 4 times, always green). `cd textbook && npm test` -> `# tests 161 # pass 161 # fail 0 # cancelled 0` (includes the R15 build tests).

e2e tests (all 14 required names exactly, plus extras): `home shows 0% and continue goes to fa-d01`, `complete flow unlocks next project`, `complete disabled until previous done`, `locked deep link shows lock screen`, `storage unavailable banner`, `corrupt backup keeps progress`, `answer gate`, `search hides locked snippet`, `theme persists after reload`, `no horizontal page scroll at 360px`, `copy falls back when clipboard denied`, `raw html shown as text`, `reset clears progress after confirm`, `keyboard reachable`; extras: `valid backup imports only after confirmation and reports skipped days` (export download, cancel path, accept path, dropped count), `mobile menu opens as a drawer and closes again`, `code token colors keep 4.5:1 contrast in light and dark themes` (computed from the live stylesheet in 4 scenarios: system light/dark, manual dark over light system, manual light over dark system; also asserts both dark blocks give identical colors), `special track is counted apart and placeholder days are styled` (variant fixture built with `allowMissing`: special project `fs`, `.coming-soon` dashed), `glossary term link scrolls to its entry and unknown routes say so`, `the early theme script reads the same storage key as the app`. Every test uses a fresh context, opens a `file://` URL, and `withPage` asserts at the end: no console errors and zero requests other than file/data/blob/about. The 360px test also scans for elements poking past the viewport outside `pre`, on 8 routes.

Mutation check (each break applied to the real source, the matching e2e test run, then restored): no `overflow-x:auto` on pre; no `preventDefault` in the gate; no clipboard fallback; search lock predicate off (day and page variants); lock check off in Day view; focus outline off; banner never shown; no import confirm; no error branch for bad import; no reset confirm; complete button always enabled; `newlyUnlocked` dropped; progress not saved; one dark token changed in only one of the two dark blocks. All 14 were caught by the intended test. (One planned mutation, a light token swap, did not match the file text and was skipped, so it was not run.)

Visual checks (Playwright screenshots, not committed): home, Day (light/dark/360px), a rich Day with all five callouts, table, three code languages, lock screen, settings, search, project, completion footer + open answer; and a synthetic 155-day curriculum (30 completions through the UI in ~2 s, 155 sidebar links, 0 console errors). Fixed from what I saw: TOC took too much room (now a wrapped row), code blocks without a file name had a stub copy button (header bar always drawn), table cells collapsed narrow words (`overflow-wrap: break-word` + nowrap inline code), callout title spacing, particle forms such as `을(를)`.

## Decisions where the brief left room

- `complete-button` exists only while the Day is not done; a done Day shows `uncomplete-button` (disabled with a reason when blocked). A disabled complete button is wired with `aria-describedby` to the reason text (the e2e reads it).
- Reset clears progress (keeps the theme), then navigates home and shows a one-time notice, so the sequence "reset -> home 0%" holds.
- Import keeps the current device theme instead of the backup's.
- The special progress card is not rendered when there is no special-track Day (the fixture has none; the variant fixture covers it).
- Theme toggle flips the effective theme (light <-> dark); "follow the device" is a radio in settings.
- The storage banner is a dismissible fixed card (bottom right, full width on phones) with a link to settings.
- Search results link to `#/day/<id>` / `#/page/<id>`; the query is in `#/search?q=`; typing on the search page uses `history.replaceState` so Back is not flooded.

## Files changed (the controller commits exactly these)

Created:
- `/home/user/web-zero-to-hundred/textbook/src/styles.css`
- `/home/user/web-zero-to-hundred/textbook/src/app/views/common.js`
- `/home/user/web-zero-to-hundred/textbook/src/app/views/shell.js`
- `/home/user/web-zero-to-hundred/textbook/src/app/views/home.js`
- `/home/user/web-zero-to-hundred/textbook/src/app/views/project.js`
- `/home/user/web-zero-to-hundred/textbook/src/app/views/day.js`
- `/home/user/web-zero-to-hundred/textbook/src/app/views/page.js`
- `/home/user/web-zero-to-hundred/textbook/src/app/views/settings.js`
- `/home/user/web-zero-to-hundred/textbook/src/app/views/search.js`
- `/home/user/web-zero-to-hundred/tests/e2e/textbook.test.mjs`

Modified:
- `/home/user/web-zero-to-hundred/textbook/src/app/main.js`
- `/home/user/web-zero-to-hundred/textbook/src/template.html`
- `/home/user/web-zero-to-hundred/textbook/build.mjs` (R15 only: `E_NO_CSS`, `builtAt` date)
- `/home/user/web-zero-to-hundred/tests/build/build.test.mjs` (R15 only: `builtAt` format, `E_NO_CSS`, rebuild is byte-identical and warning-free)

`tests/helpers/static-server.mjs` and `tests/helpers/browser.mjs` already existed (Task 7); I only consume `launch` and `collectConsoleErrors`, unchanged. The e2e does not use the static server because the brief asks for `file://`.

## Self-review and concerns

- Deviation from the file plan: one extra file `views/common.js` (shared DOM helper, lock/not-found screens). Splitting it into the seven plan files would have duplicated `h()` and the lock screen.
- Template changes beyond test ids: a head `<script id="theme-init">` (key `wzh:v1:progress` is duplicated from `STORAGE_KEY`; a test asserts they match) and a `#live` region. The build test that counts bare `<script>` tags still passes because the new tag carries an id.
- Not verifiable here: Windows 11 Edge with Malgun Gothic/Consolas and Segoe UI Emoji (I checked with Linux Chromium and system fallback fonts; emoji icons in the UI are decorative and `aria-hidden`). The clipboard fallback was proven in Chromium (real `execCommand('copy')` after a rejecting `writeText`), not in Edge.
- Not done on purpose (YAGNI): multi-tab progress sync (`storage` event), print styles, a hidden/dismissed memory for the storage banner across reloads (it reappears each load while storage is unavailable).
- `npm run build` for the real repo cannot be exercised yet (no `textbook/content` exists in the tree); `tests/e2e/smoke.test.mjs` belongs to a later task.
- Body text in real Days is long: line length 72ch is about 40 Hangul syllables at 17px. If the content owner wants wider lines, change `--measure` only.

---

# Fix round 1 (review: 1 Important + promoted Minors 1-3)

Status: DONE. NO GIT; nothing committed.

## Changes

Important
1. First Tab on a fresh load skipped the skip link, top bar and sidebar Home link. Cause confirmed: `scrollIntoView` on the current sidebar link in `shell.js` `onRoute()` moves the browser's sequential-focus start to that link. Fix: new `revealInSidebar(link)` in `textbook/src/app/views/shell.js` adjusts `sidebar.scrollTop` from `getBoundingClientRect()` offsets (8px margin) and never calls `scrollIntoView`. The drawer-open path (`setNav`) uses the same helper, so `shell.js` no longer calls `scrollIntoView` at all.

Promoted Minors
2. Settings theme radios now follow the top-bar toggle: `main.js` gets `ctx.onChange(listener)` (listeners run after every `commit`, and are cleared at the start of each render, so a view's hook disappears when you leave it). `views/settings.js` registers one that re-checks the radio matching `ctx.prog.theme`.
3. `main.js` no longer skips `scrollTo(0,0)` on a bare `document.getElementById(anchor)`. `views/page.js` now exports `anchorTarget(root, anchor)` (target must be inside `.page-body`; `#main`, `#sidebar` and unknown ids give null); `renderPage` and `main.js` both use it. `#/page/start/main` now goes to the top.
4. New test for the early theme script (below), beyond the string include.
5. One-line comment on `main.dataset.hash` in `main.js` (it is only a marker for e2e waits, unused by app logic).

## Tests (tests/e2e/textbook.test.mjs, 5 new; `withPage` got an `initArg` option for `addInitScript`)

- `first Tab reaches skip link`: fresh contexts at `#/`, `#/day/fa-d01`, `#/day/fa-d02`, `#/project/fa`, `#/settings`; first Tab must be `.skip-link`, second `.brand`.
- `sidebar shows the current link without moving the Tab start`: 1280x200 viewport at `#/day/fa-d02`; sidebar `scrollTop > 0`, current link inside the sidebar box, page not scrolled, first Tab still the skip link (this covers the manual scroll logic, which the tall-window case never exercises).
- `settings theme radios follow the top-bar toggle`: toggle twice, pick radios, back to system, leave and re-enter Settings.
- `page anchor that points outside the page body falls back to the top`: after scrolling a Day down, `#/page/start/main`, `/sidebar`, `/nope` end at scrollY 0 with no `.is-target`; `#/page/glossary/term-픽스처용어` still marks its entry.
- `early theme script applies the stored theme before the page body is parsed`: stored dark under a light system, and stored light under a dark system. A MutationObserver (init script) records the first `data-theme` on `<html>` and whether `#main` already existed; the early script must give `{ value, mainExisted: false }`. Mutation check: with the `theme-init` script removed from the template the test fails (`mainExisted: true`, the app bundle sets it later); template restored afterwards.

RED (new tests against the old code), `cd textbook && node --test --test-name-pattern="first Tab|sidebar shows the current|theme radios follow|anchor that points outside|early theme script applies" ../tests/e2e/textbook.test.mjs`:
```
not ok 1 - first Tab reaches skip link   (#/: 첫 Tab 이 건너뛰기 링크가 아니라 summary. 로 갔어요)
not ok 2 - sidebar shows the current link without moving the Tab start
not ok 3 - settings theme radios follow the top-bar toggle   ('system' !== 'dark')
not ok 4 - page anchor that points outside the page body falls back to the top   (#/page/start/main: 맨 위로 가야 해요)
ok 5 - early theme script applies the stored theme before the page body is parsed   (already correct; guarded by the mutation check above)
# tests 5  # pass 1  # fail 4
```
The review's finding reproduced exactly: first Tab landed on the first project summary at `#/`.

GREEN: `cd textbook && npm run test:e2e` -> `# tests 25 # pass 25 # fail 0` (run 4 times, no flakes). `cd textbook && npm test` -> `# tests 161 # pass 161 # fail 0 # cancelled 0`.

## Files changed in this round
- `/home/user/web-zero-to-hundred/textbook/src/app/views/shell.js`
- `/home/user/web-zero-to-hundred/textbook/src/app/views/settings.js`
- `/home/user/web-zero-to-hundred/textbook/src/app/views/page.js`
- `/home/user/web-zero-to-hundred/textbook/src/app/main.js`
- `/home/user/web-zero-to-hundred/tests/e2e/textbook.test.mjs`

No other files touched. No leftover temp files in the repo.
