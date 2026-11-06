### Task 2: 콘텐츠 렌더러와 Day 검증기

**Files:**
- Create: `textbook/package.json`, `textbook/lib/markdown.mjs`, `textbook/lib/validate.mjs`
- Test: `tests/unit/markdown.test.mjs`, `tests/unit/validate.test.mjs`

**Interfaces:**
- Produces:
  - `renderMarkdown(src: string, ctx: { idPrefix: string, terms: Map<string,string> /* 용어 → slug */, routes: Set<string> /* '#/day/p1-d01', '#/page/start' … */ }) → { html: string, text: string, checkCount: number, answerCount: number, headings: {level:number,text:string,id:string}[], errors: BuildError[] }`
  - `slugify(s: string) → string`: 소문자화하고, 공백은 `-`로 바꾸며, `[a-z0-9가-힣-]` 이외의 문자는 제거한다.
  - `validateDaySource(src: string, opts: { minChars: number }) → BuildError[]`
  - `BuildError = { code: string, line: number|null, message: string }`(message는 한국어)
  - `LANG_MAP`: 허용 언어 → highlight.js 이름. `html→xml, xml→xml, css, js/javascript/jsx→javascript, ts/typescript/tsx→typescript, json, powershell, csharp/cs→csharp, sql, rust, toml→ini, dockerfile, yaml/yml→yaml, http, diff, md/markdown→markdown, text/plaintext→plaintext, bash`

- [ ] **Step 1: `textbook/package.json`을 만든다.** `"type":"module"`, `"private":true`, `engines.node ">=22"`, devDependencies는 marked·highlight.js·esbuild(Task 1의 버전으로 정확히 고정). scripts:
  - `"build": "node build.mjs"`
  - `"check": "node build.mjs --check"`
  - `"test": "node --test \"../tests/unit/**/*.test.mjs\" \"../tests/build/**/*.test.mjs\""`
  - `"test:e2e": "node --test \"../tests/e2e/**/*.test.mjs\""`

  그다음 `npm install`을 실행해 `package-lock.json`을 만든다.
- [ ] **Step 2: 실패하는 테스트를 쓴다.** `tests/unit/markdown.test.mjs`:
  - `raw HTML in prose is escaped`: `'문단 <script>alert(1)</script> 끝'` → html에 `<script>`가 없고 `&lt;script&gt;`가 있다. 블록 HTML(`<div>x</div>` 단독 줄)도 escape된다.
  - `container renders with class and title`: `':::tip 꿀팁\n내용\n:::'` → `<aside class="callout callout-tip">`와 제목 `꿀팁`을 포함한다.
  - `answer container renders details`: `':::answer 과제 1 정답\n**굵게**\n:::'` → `<details class="answer" data-answer="p1-d01-a1">`, `<summary>`에 `과제 1 정답`, 내부 `<strong>`. `answerCount === 1`
  - `fence without language is an error`: 오류 code `E_FENCE_LANG`, line은 펜스 시작 줄
  - `unknown fence language is an error`: ` ```cobol ` → `E_FENCE_LANG_UNKNOWN`
  - `file caption attaches to following fence`: `'📄 C:\\dev\\a\\index.html\n```html\n<p>x</p>\n```'` → `<figure class="code"`, `<figcaption>`에 경로, 그 경로 문단은 따로 남지 않음, `&lt;p&gt;`가 있음(코드 escape), `<button class="copy"`
  - `code block is highlighted`: ` ```js\nconst a = 1;\n``` ` → `hljs-keyword` 포함
  - `task list items become tracked checkboxes`: `'- [ ] 하나\n- [ ] 둘'` → `data-check="0"`, `data-check="1"`, `checkCount === 2`, `disabled` 없음
  - `known term links to glossary`: terms `{'HTML'→'html'}`, `'[[HTML]] 배우기'` → `<a class="term" href="#/page/glossary/term-html">HTML</a>`
  - `unknown term is an error`: `E_TERM_UNKNOWN`
  - `internal link to unknown route is an error`: `[x](#/day/p9-d01)` → `E_LINK_UNKNOWN`. 알려진 route는 오류가 없다.
  - `external link opens safely`: `[MDN](https://developer.mozilla.org)` → `target="_blank" rel="noopener noreferrer"`
  - `headings get prefixed ids`: `## 🛠️ 따라하기` → id `p1-d01-따라하기`(slugify를 거친 뒤 이모지 제거)
  - `container markers inside code fences are ignored`: 펜스 안의 `:::`는 블록으로 처리하지 않는다.
  - `nested container is an error` → `E_CONTAINER_NESTED`, `unclosed container` → `E_CONTAINER_UNCLOSED`, `unknown container type` → `E_CONTAINER_TYPE`
  - `text strips markup for search`: text에 태그가 없고, 코드 내용은 포함한다.

  `tests/unit/validate.test.mjs`(최소 유효 Day 픽스처 문자열을 테스트 안에서 만든다):
  - `valid day passes` → `[]`
  - `missing section` → `E_SECTION_MISSING`(누락 제목 포함)
  - `wrong order` → `E_SECTION_ORDER`
  - `variation selector tolerated`: `🛠 따라하기`(U+FE0F 없음)도 통과
  - `extra h2 not allowed` → `E_SECTION_UNKNOWN`. `📚 더 알아보기`는 마지막에만 허용
  - `h1 not allowed` → `E_H1`
  - `answer section needs :::answer` → `E_ANSWER_MISSING`
  - `checklist needs >= 3 items` → `E_CHECKLIST_SHORT`
  - `placeholder text rejected`: `TODO|TBD|FIXME|작성 예정` → `E_PLACEHOLDER`
  - `too short rejected`: 길이 < minChars → `E_TOO_SHORT`
- [ ] **Step 3: 실행해서 실패를 확인한다** — `cd textbook && node --test ../tests/unit/` → 모듈 없음으로 FAIL
- [ ] **Step 4: 구현한다.** 순서는 다음과 같다. ① 줄 단위 전처리: 펜스 상태를 추적하면서 `:::` 블록을 분리하고, `📄 ` 캡션을 다음 펜스에 붙인다. ② 블록 내부는 marked로 재귀 렌더링한다(중첩은 오류). ③ marked renderer를 재정의한다: `html` 토큰은 escape, `code`는 hljs+figure, `listitem`의 task는 체크박스, `link`는 route 검증과 외부 링크 속성, `heading`은 id 부여. ④ `[[용어]]`는 inline extension으로 처리한다. `validateDaySource`는 marked lexer의 h2 토큰과 원문을 정규식으로 검사한다.
- [ ] **Step 5: 실행해서 통과를 확인한다** — 같은 명령, 모두 PASS
- [ ] **Step 6: 커밋** — `feat(textbook): markdown renderer and day validator`

