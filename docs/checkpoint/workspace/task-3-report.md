# Task 3 report: 커리큘럼 로더, 용어 병합, 조립, 빌드 CLI

Status: DONE_WITH_CONCERNS (concerns are small; see "Concerns").
Commits: none (NO GIT; the controller commits).

## What I implemented

- `textbook/lib/curriculum.mjs` — `loadCurriculum(contentDir) → { curriculum, errors }`
  - Reads `<contentDir>/curriculum.json`, checks the schema, then derives each Day: `id = <pid>-dNN`, `num`, `file = <contentDir>/<pid>/day-NN.md`, `missing` (bool). Projects are returned sorted by `order`.
  - Error objects are `{ code, line:null, message, file }` (`file` absolute). `E_CUR_FILE_MISSING` for a Day also carries `dayId`, `projectId`.
  - `E_CUR_SCHEMA` (all problems reported together, message starts with the JSON path such as `projects[0].days[1].minutes`): bad JSON or missing file, `version !== 1`, field types, `track` enum, id patterns, `validation.minDayChars`, **R3: `minutes` must be an integer in 60..120**, a page needs exactly one of `file` / `generated`, a `generated:'glossary'` page must have id `glossary` (the term links are hard-wired to `#/page/glossary/...`), page `file` cannot leave the content folder.
  - `E_CUR_DUP_ID` (project ids, page ids), `E_CUR_REQUIRES` (unknown project from a project or a page, self reference, cycles reported as `fa → fb → fa`), `E_CUR_FILE_MISSING` (Day files and page files), `E_CUR_ORPHAN_FILE` (`day-\d+.md` in a project folder that the curriculum has no Day for, e.g. `day-3.md`, and `day-NN.md` inside folders that are not projects).
  - `_`-prefixed files and folders are ignored. Page `file` is accepted as `start.md` or `pages/start.md` (both resolve to `content/pages/start.md`).
  - Schema errors return `curriculum: null`. Other errors are returned together with a usable curriculum.
- `textbook/lib/glossary.mjs`
  - `parseGlossary(files)` → `{ entries:[{term, slug, md, file, line}], errors }`. Splits on `### `, ignoring `###` inside code fences. Text before the first `###` is dropped, and `#`/`##` lines end the current entry (usable as grouping headings). `E_TERM_DUPLICATE` is case- and whitespace-insensitive, and the message names the first definition (`a.md:3`). `E_TERM_EMPTY` for `###` with no name. Slugs are `slugify(term)`; a colliding slug gets `-2`, `-3` (the same rule the renderer uses for heading ids; e.g. `C#`, `C++` → `c`, `c-2`).
  - `parseTroubleshooting(files)` → `{ groups:[{project, entries:[{title, md, file, line}]}], errors }`; group = file name prefix before the first `-` or `.` (`p1-html.md` → `p1`); `E_TS_EMPTY`.
  - Beyond the brief (needed for the R-glossary/troubleshooting ruling), the generated pages are rendered here too: `renderGlossaryPage(entries, {terms, routes})` and `renderTroubleshootingPage(groups, projects, {terms, routes})`. Each entry goes through `renderMarkdown` on its own (`## term` / `### symptom` plus body), so term links and escaping are identical to Days, and errors are mapped back to the source file and line. Glossary: sorted by `localeCompare(…, 'ko')`, each entry in `<section class="term-entry" id="term-<slug>">`. Troubleshooting: `<section class="ts-group" id="ts-<prefix>"><h2>project title</h2>` then `<section class="ts-entry">` with an h3 per symptom, groups in project order, non-project prefixes last with the prefix as heading.
- `textbook/lib/assemble.mjs` — `assemble({ templateHtml, css, js, data, templates })`
  - Fills the four placeholders in ONE regex pass with a function replacer (content is never re-expanded; `$&`/`$'` in CSS/JS are inserted literally). Each placeholder must appear exactly once in the template, otherwise it throws.
  - `CSS` becomes `<style>…</style>` (throws on `</style`), `DATA` becomes `<script id="wzh-data" type="application/json">…</script>`, `TEMPLATES` becomes `<template id="…">…</template>` lines, `JS` becomes `<script>…</script>`.
  - Data JSON: `</` → `<\/`, `<!--` → `<!--` (valid JSON, avoids the script "escaped" parser state), U+2028/2029 escaped; it parses back to the original object. JS: `</script` → `<\/script`, `<!--` → `\x3C!--`.
  - Template ids must match `t-day-…` / `t-page-…` and be unique.
- `textbook/build.mjs` — exports `build({contentDir, srcDir, only, allowMissing})` (no file writes) and the CLI `node build.mjs [--check] [--only id1,id2] [--allow-missing] [--content <dir>] [--out <file>]`. Defaults are resolved relative to `build.mjs` (content `textbook/content`, out `<repo>/index.html`), so it works from any cwd. Relative `--content/--out` resolve against the cwd.
  - Flow: load curriculum → stop on structural errors → glossary/troubleshooting merge → route set (`#/`, `#/settings`, `#/project/<pid>`, `#/day/<id>`, `#/page/<id>`, `#/page/glossary/term-<slug>` for known terms; always from the full curriculum) → Days: `validateDaySource` + `renderMarkdown` merged and sorted by line → pages (static pages: `renderMarkdown` only; generated pages as above) → data + templates → esbuild (`bundle`, `iife`, `minify`, `es2020`, `write:false`) → `assemble` → 16 MB check (`E_SIZE_LIMIT`) → write unless `--check`.
  - R4: default is strict (`E_CUR_FILE_MISSING` is an error). `--allow-missing`: a missing Day becomes a warning (printed as one `경고 E_CUR_FILE_MISSING <pid>: Day 파일 N개가 없어 "준비 중" 화면으로 대신해요 (ids…)` line per project) and gets the template body `<p class="coming-soon">이 Day는 아직 준비 중이에요.</p>` (checkCount 0). `--only a,b`: only those Days are rendered/validated; missing files of other Days are ignored; every non-listed Day still gets the placeholder template, so the runtime can rely on every Day having a template. A listed Day that is missing is still an error (or a warning with `--allow-missing`). An unknown `--only` id is `E_ONLY_UNKNOWN`.
  - Output: error lines `relative/path:line CODE message` (or `relative/path CODE message` when there is no line) on stdout, exit 1. Success prints e.g. `빌드 완료: Day 3개, 페이지 3개 → <out> (0.01 MB)` (`검사 통과: …` with `--check`). `--check` writes nothing (not even the output directory).
  - Embedded data exactly as in the brief (no file paths): `{ title, writtenAt, builtAt, projects:[{id,order,track,title,subtitle,folder,stack,requires,summary,outcome, days:[{id,num,title,minutes,summary,checkCount}]}], pages:[{id,title,requires}], search:[{id,kind,project,title,text}] }`. Search has one entry per Day (placeholder Days have `text: ''`) and per page (`project: null`); a generated page's text is all its entries joined.
- `textbook/src/template.html` — shell per spec section 4: `<html lang="ko">`, viewport meta, `<title>웹 제로 투 헌드레드</title>`, `a.skip-link`, `header.topbar` (`#menu-toggle`, `a.brand`, `#search-input`, `#theme-toggle`, `#settings-link`), `nav#sidebar`, `main#main[tabindex=-1]` (with a `<noscript>` note), `div#storage-banner[role=status][hidden]`, then the four placeholders (CSS in head; DATA, TEMPLATES, JS at the end of body). Topbar buttons use text labels (메뉴/테마/설정) so Task 5 can restyle or swap in its own markup.
- `textbook/src/app/main.js` — one-line comment, the empty entry point.
- Fixture `tests/fixtures/content/` per the brief: `curriculum.json` (fa 2 Days requires [], fb 1 Day requires [fa], both `main`, minutes 60/90/75; pages `start`(file), `secret`(file, requires [fb]), `glossary`(generated); `minDayChars: 200`), `fa/day-01.md` (a 320-char one-line code block with a `📄` caption, `<b>굵게아님</b>` in prose, `:::answer`, 3 checklist items, `[[픽스처용어]]`), `fa/day-02.md`, `fb/day-01.md` (`비밀단어zz`), `pages/start.md` (links to `#/day/fa-d01` and `[[픽스처용어]]`), `pages/secret.md` (`비밀페이지zz`), `glossary/fixture.md` (`픽스처용어`, `가나다 용어`).

## Tests

Files: `tests/unit/curriculum.test.mjs` (14), `tests/unit/glossary.test.mjs` (13), `tests/unit/assemble.test.mjs` (7), `tests/build/build.test.mjs` (18). Brief test names are all present (`fixture loads with derived ids`, `requires cycle is an error`, `missing day file is an error`, `orphan day file is an error`, `underscore files are ignored`, `entries are split by h3 and slugged`, `duplicate term across files is an error`, `fixture builds to single file`, `invalid content fails build`, `check mode writes nothing`) plus R4's `allow-missing builds with placeholder` and `only mode ignores other missing days`, and extras: schema/R3 minutes checks, unknown/self requires, page file path rules, duplicate ids, order, glossary slug collisions and CRLF, generated pages (sorting, escaping, error line mapping), assemble safety (`</script>`, `<!--`, U+2028/2029, `$&`, no re-expansion, ids, placeholders), build error line format, `allow-missing does not hide other errors`, `only mode still fails when a listed day is missing or invalid`, only-mode route checks against the full curriculum, curriculum errors, orphan, glossary duplicates, troubleshooting page, 16 MB limit, unknown flags, in-process esbuild bundling plus inline CSS (`src/app` imports, `$&` safe) and `E_JS_BUNDLE` with file and line.

RED (before `curriculum/glossary/assemble.mjs` and `build.mjs` existed), from `/home/user/web-zero-to-hundred/textbook`:

```
$ npm test
# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../textbook/lib/glossary.mjs' imported from .../tests/unit/glossary.test.mjs
# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../textbook/lib/curriculum.mjs' imported from .../tests/unit/curriculum.test.mjs
# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../textbook/lib/assemble.mjs' imported from .../tests/unit/assemble.test.mjs
not ok 1 - fixture builds to single file   (Cannot find module '.../textbook/build.mjs')
... 16 build tests not ok
# tests 64   # pass 45   # fail 19
```
(Expected: the modules did not exist. The 45 passes are Task 2's tests plus build tests that don't need the module.)

The first GREEN attempt had failures that were my own mistakes and were fixed before the final run: (1) the editor wrote literal U+2028/2029 characters into `assemble.mjs` regexes (a syntax error), replaced with ` ` escapes, and the same in `assemble.test.mjs`; (2) my glossary sort test assumed Latin before Hangul, but `localeCompare('ko')` puts Hangul first (test fixed, the brief's `'ko'` comparator kept); (3) a miscounted line number in a glossary test; (4) the fixture's `📄` caption line must directly precede the fence, so a blank line was removed (the build test now asserts the `<figcaption>`).

GREEN, final run (and re-run after the controller's `pkill` notice; identical result):

```
$ cd textbook && npm test
# tests 97
# pass 97
# fail 0
# cancelled 0
# duration_ms ~6600
$ node textbook/build.mjs --check --content tests/fixtures/content
경고 textbook/src/styles.css W_NO_CSS styles.css 가 없어서 CSS 없이 만들어요.
검사 통과: Day 3개, 페이지 3개, 결과 크기 0.01 MB
```

Extra verification: the built fixture `index.html` was opened with Playwright over `file://`. 0 console errors, only the page URL was requested, 6 templates, `<b>` count 0 in the Day template, 3 `data-check` inputs, glossary section ids `term-가나다-용어`, `term-픽스처용어`, data JSON parses.

## Files created (NO modified files; the controller commits exactly these)

- `/home/user/web-zero-to-hundred/textbook/build.mjs`
- `/home/user/web-zero-to-hundred/textbook/lib/curriculum.mjs`
- `/home/user/web-zero-to-hundred/textbook/lib/glossary.mjs`
- `/home/user/web-zero-to-hundred/textbook/lib/assemble.mjs`
- `/home/user/web-zero-to-hundred/textbook/src/template.html`
- `/home/user/web-zero-to-hundred/textbook/src/app/main.js`
- `/home/user/web-zero-to-hundred/tests/unit/curriculum.test.mjs`
- `/home/user/web-zero-to-hundred/tests/unit/glossary.test.mjs`
- `/home/user/web-zero-to-hundred/tests/unit/assemble.test.mjs`
- `/home/user/web-zero-to-hundred/tests/build/build.test.mjs`
- `/home/user/web-zero-to-hundred/tests/fixtures/content/curriculum.json`
- `/home/user/web-zero-to-hundred/tests/fixtures/content/fa/day-01.md`
- `/home/user/web-zero-to-hundred/tests/fixtures/content/fa/day-02.md`
- `/home/user/web-zero-to-hundred/tests/fixtures/content/fb/day-01.md`
- `/home/user/web-zero-to-hundred/tests/fixtures/content/pages/start.md`
- `/home/user/web-zero-to-hundred/tests/fixtures/content/pages/secret.md`
- `/home/user/web-zero-to-hundred/tests/fixtures/content/glossary/fixture.md`

I did not touch `textbook/lib/markdown.mjs`, `validate.mjs`, their tests, `reference/` or `tests/helpers/`. (`docs/research/` in `git status` belongs to another agent.)

## Self-review findings / concerns

1. **`src/styles.css` does not exist yet (Task 5 owns it).** `build.mjs` builds with empty CSS and prints `경고 … W_NO_CSS …` (exit 0) when it is missing. Once Task 5 adds the file the warning disappears. I chose this over creating a stub in Task 5's file.
2. **Placement of the generated-page renderers.** `renderGlossaryPage` / `renderTroubleshootingPage` live in `glossary.mjs` (not listed in the brief's interfaces), so the CLI stays thin and errors map back to source lines. Easy to move if the controller prefers another home.
3. **`--only` still renders and validates all pages** (static and generated), because the glossary and other pages are needed by the shell. Only Days are restricted. Glossary duplicate errors and orphan-file errors are global and also appear in `--only` runs.
4. **Page `file` convention** is not defined by the brief. I accept both `start.md` and `pages/start.md`. Task 6/8 should use either.
5. **`localeCompare('ko')` sorts Hangul before Latin** (so `HTML`, `C#` land after all Korean terms). This follows the brief literally; say if Latin terms should come first.
6. **Glossary text before the first `###` is dropped silently**, and `#`/`##` lines act as separators, so a mistyped `## HTML` (instead of `###`) would not become an entry. Content-guide authors (Task 6) should mention that a term must be an h3.
7. **Search text** for Days includes `:::answer` bodies (carried over from Task 2's deferred note); keywords from curriculum are not embedded or searched (not in the brief's data shape).
8. **Term heading ids** inside the glossary are `th-<slug>-<slugified term>` (ugly but unique and collision-free vs the `term-<slug>` section ids); the section element carries the link target `term-<slug>`.
9. **Model identifiers:** none written anywhere in the files above.
10. Heading levels: generated glossary entries use h2 (page h1 is added by the view); troubleshooting uses h2 groups and h3 symptoms. Task 5's page view should supply the page `title` as h1 for pages.
11. `builtAt` is `new Date().toISOString()`, so repeated builds produce different bytes (committed `index.html` will change on every build).
