# Task 2 report: 콘텐츠 렌더러와 Day 검증기

Status: DONE_WITH_CONCERNS (concerns are small; see "Concerns").
Commits: none (NO GIT; the controller commits).

## What I implemented

- `textbook/package.json`: `type: module`, `private`, `engines.node >=22`, scripts exactly as in the brief, devDependencies pinned to the exact current versions (R8): `marked 18.1.2`, `highlight.js 11.12.0`, `esbuild 0.28.2`. `npm install` produced `textbook/package-lock.json`.
- `textbook/lib/markdown.mjs`
  - Exports: `renderMarkdown`, `slugify` (R1 verbatim), `LANG_MAP` (frozen plain object, exactly the 26 keys of the brief). Extra exports used by `validate.mjs`: `fenceMask(lines)`, `parseContainerOpen(line)`, `normalizeSource(src)`.
  - Pipeline: (1) line pre-pass tracks fence state, splits `:::` boxes, attaches `📄` captions to the next fence; (2) every chunk and every box body is lexed with a per-call `Marked` instance, tokens get `_line` annotations, then rendered with overridden renderers; (3) `[[용어]]` is an inline marked extension.
  - ALL raw HTML (block and inline) is escaped. Marked's `escaped` flag (set after `<script>`/`<pre>` in prose) would otherwise let text through unescaped, so `text()` is overridden to always escape (author-written entities such as `&lt;` keep their CommonMark meaning).
  - Output markup (contract for later tasks):
    - Code: `<figure class="code" data-lang="html"><figcaption>path</figcaption><button class="copy" type="button" aria-label="코드 복사">복사</button><pre><code class="hljs language-xml">...</code></pre></figure>` (figcaption only with a `📄` caption; data-lang only for known languages).
    - Callouts: `<aside class="callout callout-tip"><p class="callout-title">제목</p><div class="callout-body">...</div></aside>` (title element only when a title was written).
    - Answer: `<details class="answer" data-answer="{idPrefix}-a{n}"><summary>제목</summary><div class="answer-body">...</div></details>` (no title falls back to "정답 보기").
    - Tasks: `<li class="task"><input type="checkbox" data-check="{n}" aria-label="항목 글자"> ...</li>`; never `disabled`, never `checked` (the authored `[x]` is ignored, saved progress is the single source of truth). `data-check` is the document-order index; `checkCount` counts them.
    - Terms: `<a class="term" href="#/page/glossary/term-{slug}">용어</a>`.
    - Headings: `<hN id="{idPrefix}-{slugify(text)}">`; duplicates get `-2`, `-3`; empty slug becomes `section`; an empty `idPrefix` gives no leading `-`.
    - Links: `#...` must be in `ctx.routes` (else `E_LINK_UNKNOWN`, still rendered); `http(s)://` gets `target="_blank" rel="noopener noreferrer"`; `mailto:` plain; anything else (`javascript:`, relative, `//host`) is `E_LINK_UNSUPPORTED` and output as plain text.
  - `text` (search text) is derived from the final HTML: copy-button text excluded, tags stripped, entities decoded, whitespace collapsed (code content included, e.g. `<p>x</p>` appears literally).
  - Errors are sorted by line (line-less last). Error lines are original-source lines; verified on 1206 randomly generated errors across lists, blockquotes, tables and boxes with zero mismatches.
- `textbook/lib/validate.mjs`: `validateDaySource(src, { minChars })` using the marked lexer for h1/h2 tokens (so `#` inside fences is ignored) plus line scanning for answer/checklist/placeholder.
  - `E_H1`, `E_SECTION_UNKNOWN`, `E_SECTION_MISSING` (message names the missing heading, `line: null`), `E_SECTION_ORDER` (first offending heading only; a repeated section also lands here), `E_ANSWER_MISSING`, `E_CHECKLIST_SHORT`, `E_PLACEHOLDER` (one per matching line), `E_TOO_SHORT` (`line: null`).
  - Heading comparison ignores U+FE0F on both sides and collapses whitespace. `📚 더 알아보기` is allowed only as the last h2; elsewhere it is `E_SECTION_UNKNOWN`.
  - Length for `minChars` is the CRLF-normalized `src.length`.

## Tests

Files: `tests/unit/markdown.test.mjs` (31 tests), `tests/unit/validate.test.mjs` (12 tests). All brief test names are present, plus extras for slugify, duplicate ids, LANG_MAP, unsafe links/images, captions inside numbered steps, stray `:::`, unclosed fence, CRLF, entities, search-text decoding, validator ordering.

RED (before `lib/` existed), from `/home/user/web-zero-to-hundred/textbook`:

```
$ node --test "../tests/unit/**/*.test.mjs"
# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/user/web-zero-to-hundred/textbook/lib/markdown.mjs' imported from .../tests/unit/markdown.test.mjs
not ok 1 - ../tests/unit/markdown.test.mjs
# Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/user/web-zero-to-hundred/textbook/lib/validate.mjs' imported from .../tests/unit/validate.test.mjs
not ok 2 - ../tests/unit/validate.test.mjs
# tests 2  # pass 0  # fail 2
```

(Expected: modules did not exist yet.) The first GREEN run had 2 failures, both mistakes in my own tests (an `# 제목` heading legitimately renders `<h1>`; the test imported `highlight.js` from outside `textbook/`). I fixed the tests, not the implementation.

GREEN, run through the real script:

```
$ cd textbook && npm test
# tests 43
# pass 43
# fail 0
```

Extra verification (scratch scripts in the scratchpad, not committed):
- XSS fuzz: 20000 random renders from fragments (`<script>`, `javascript:`, quotes, fences, `:::`, tables, images, ...). No exceptions; every output tag is in a fixed whitelist, every attribute is in a fixed whitelist, every `href` starts with `http(s)://`, `mailto:` or `#`, and no unescaped `<` or `<!--` remains.
- Speed: 155 realistic Day renders plus validations take about 0.5 s total.

## Files created (controller commits exactly these)

- `/home/user/web-zero-to-hundred/textbook/package.json`
- `/home/user/web-zero-to-hundred/textbook/package-lock.json`
- `/home/user/web-zero-to-hundred/textbook/lib/markdown.mjs`
- `/home/user/web-zero-to-hundred/textbook/lib/validate.mjs`
- `/home/user/web-zero-to-hundred/tests/unit/markdown.test.mjs`
- `/home/user/web-zero-to-hundred/tests/unit/validate.test.mjs`
- (not for commit) `/home/user/web-zero-to-hundred/textbook/node_modules/` created by `npm install`

## Self-review findings / concerns

1. **Brief Step 3/5 command does not work on Node 22.** `node --test ../tests/unit/` (directory argument) fails with "Cannot find module .../tests/unit" in both RED and GREEN. I used the glob form instead. The specified `npm test` script works unchanged: Node 22.23 silently accepts the unmatched `../tests/build/**` glob (R2 fallback not needed).
2. **`&lt;p&gt;` in the caption test cannot hold literally.** highlight.js wraps tag names in spans (`&lt;<span class="hljs-name">p</span>&gt;`). My test asserts `&lt;`, the `hljs-name` span, and that raw `<p>x</p>` is absent; the literal `&lt;p&gt;x&lt;/p&gt;` is asserted for a ```` ```text ```` fence. The intent (code is escaped) is covered.
3. **`.gitignore` is missing in the repo.** `textbook/node_modules/` is untracked and not ignored; do not commit it (a root `.gitignore` entry is needed; I did not create one since it is outside this task's file list).
4. **Additions beyond the brief, all small and aimed at silent breakage:** `E_CONTAINER_STRAY` (unpaired `:::`), `E_FENCE_UNCLOSED`, `E_LINK_UNSUPPORTED`, `E_IMAGE_UNSUPPORTED` (images are rejected: the book is a single offline file with zero external requests), indented code blocks report `E_FENCE_LANG`, misplaced `📚` reports `E_SECTION_UNKNOWN`, repeated section reports `E_SECTION_ORDER`. Easy to drop if the controller wants stricter adherence.
5. **`E_PLACEHOLDER` scans the whole file, including code fences** (case-sensitive `TODO|TBD|FIXME` with word boundaries, or `작성 예정`). Assignment starter code with a `// TODO` comment will be rejected, so content authors must word such hints differently ("여기에 작성"). Say if code fences should be exempt.
6. Known limits (acceptable): `:::` must start at column 0 (an indented `:::tip` inside a list item is plain text); a `📄` caption inside a blockquote is not attached; authored `[x]` is rendered unchecked; term links are generated from `ctx.terms`, so `#/page/glossary/term-*` is not checked against `ctx.routes` (and an author-typed link to such a route must be in `routes`).
7. Notes for later tasks: the runtime should treat `li.task` (not the tiny checkbox) as the click target if it wants larger touch areas; copy text should come from `figure.code pre code` `textContent`.

---

## Fix round 1 (three Minor findings)

Still NO GIT; nothing committed.

1. **Invisible characters replaced with escapes.**
   - `textbook/lib/markdown.mjs`: `normalizeSource` now uses `/^﻿/` (was a literal BOM in the regex).
   - `textbook/lib/validate.mjs`: `key()` now uses `/️/g`. The two canonical section titles in `REQUIRED_SECTIONS` also held literal U+FE0F; they are now `'🛠️ 따라하기'` and `'✍️ 과제'`.
   - `tests/unit/markdown.test.mjs`: the three `🛠️` literals now use `️`, so the variation-selector case survives an editor that strips invisible characters.
   - Verified with a script that none of the four touched files contain a literal U+FEFF, U+FE0F, U+200B or U+200D any more.
2. **New error `E_CONTAINER_INDENT`** (in `splitBlocks`, outside code fences only; fence lines are handled by the earlier fence branch, so markers inside fences stay ignored):
   - a line matching `/^\s+:::/` (indented open or close marker): "::: 는 줄 맨 앞(들여쓰기 없이)에 써야 해요."
   - a line matching `/^:{4,}/` (`::::tip`, `::::`): "::: 는 콜론이 정확히 3개예요. 4개 이상(::::)은 쓸 수 없어요."
   - The line stays plain text (no container), so there is no cascade beyond these errors. Prose such as `1:::2` or `설명 :::tip` mid-line is not flagged.
   - New tests: `indented container marker is an error` (numbered step, top-level, tab-indented, mid-line colons not flagged), `four colons is an error` (also inside a valid box). `container markers inside code fences are ignored` was extended with indented and four-colon markers inside fences (including a fence inside a numbered step); it still passes.
3. **JSDoc of `renderMarkdown`** now states that `headings[].text` and `text` are plain unescaped text (escape before inserting into HTML, or use textContent), that only `html` is safe to insert as is, and that `text` includes `:::answer` bodies and code content but not the copy-button text.

Command and output (from `/home/user/web-zero-to-hundred/textbook`):

```
$ npm test
# tests 45
# pass 45
# fail 0
```

Re-ran the scratch checks afterwards: 20000-input XSS fuzz OK; line-number accuracy check 1274 errors, 0 mismatches.

Changed files in this round:
- /home/user/web-zero-to-hundred/textbook/lib/markdown.mjs
- /home/user/web-zero-to-hundred/textbook/lib/validate.mjs
- /home/user/web-zero-to-hundred/tests/unit/markdown.test.mjs
- /home/user/web-zero-to-hundred/.superpowers/sdd/2026-11-01-web-zero-to-hundred/task-2-report.md

(`tests/unit/validate.test.mjs` is unchanged. I did not touch curriculum.mjs, glossary.mjs, assemble.mjs, build.mjs or textbook/src/.)

---

## Follow-up (R27): `E_BOLD_UNRENDERED`

Still NO GIT. Touched only `textbook/lib/markdown.mjs` and `tests/unit/markdown.test.mjs`.

- `markdown.mjs`: the inline `text` renderer (prose text only; not code spans, fenced code, raw-HTML tokens or link URLs) now reports `E_BOLD_UNRENDERED` with the token's source line when the text still contains a literal `**`. marked keeps the whole `**x)**는` as one text token, so the check sees it. Message (Korean): 굵게(**)가 적용되지 않았어요, with the cause and the two fixes (end the bold on a letter, or move the bracket outside the bold), plus a hint to write a literal `**` as code. Backslash-escaped `\*\*` is two separate escape tokens and is not flagged. A bare `2 ** 3` in prose is flagged too (use a code span).
- Tests added: `unrendered bold before Korean particle is an error` (`**x)**는`, plus line numbers inside a list, a `:::tip` box and a heading: lines 3, 6, 9), `rendered bold is fine` (`**용어**는`, `**x)** 는`, escaped `\*\*`), `asterisks in code are fine` (inline code `a ** b`, a ```js fence with `2 ** 3`, a URL containing `**`).
- Command and output, from `/home/user/web-zero-to-hundred/textbook`:

```
$ npm test
# tests 164
# pass 164
# fail 0
$ node build.mjs --check --only p1-d01
검사 통과: Day 30개, 페이지 2개, 결과 크기 0.19 MB (--only: 1개 Day만 렌더)     (exit 0)
```

(164 includes tests other agents added; all pass.) A full `node build.mjs --check` currently fails only with `E_CUR_FILE_MISSING` for Day files that do not exist yet (29 errors); there is no `E_BOLD_UNRENDERED` or any other renderer error in the existing content.

---

## R27 fix round 1 (review of 2cb312d)

Still NO GIT. Touched only `textbook/lib/markdown.mjs` and `tests/unit/markdown.test.mjs`.

1. **URL false positive fixed.** `link()` now renders `esc(token.text)` for `token.autolink` (marked's own default does the same) instead of recursing into the text renderer. GFM bare URLs and `<...>` autolinks containing `**` no longer raise `E_BOLD_UNRENDERED`. Normal `[a**b](url)` link text is still checked.
2. **Container titles checked.** Titles of known container kinds (tip, warn, info, path, success, answer) are output verbatim via `esc()`, so any `**` in one now reports `E_BOLD_UNRENDERED` at the box's opening line. Message is a dedicated hoisted const (`BOLD_TITLE_MESSAGE`: titles cannot use bold, remove the `**`), because the particle explanation does not apply to titles that are never parsed as Markdown.
3. **Line numbers inside multi-line paragraphs.** marked keeps a multi-line paragraph as one text token, so the check adds the number of newlines before the first `**` to the token's start line. `첫 줄\n둘째 **x)**는` now reports line 2.
4. **Message variants.** Messages are hoisted consts. A stray `**` with no partner (exactly one `**` in the text, e.g. `2 ** 3`) says it is unpaired and to wrap code or formulas in backticks; a broken pair keeps the particle/punctuation explanation.

New tests: `bare and angle-bracket URLs containing ** are not bold errors`, `bold markers in container titles are errors` (tip and answer), `unrendered bold reports the line it is on`, `stray ** gets a code-wrapping hint, broken pair gets the particle hint`.

```
$ cd textbook && npm test
# tests 168
# pass 168
# fail 0
$ node build.mjs --check --only p1-d01      (exit 0)
```

The earlier XSS fuzz (20000 inputs) and the error-line accuracy check still pass.
