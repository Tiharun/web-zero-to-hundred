# M9 Day 읽기 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> 이 프로젝트는 Native 방식이다(통합 로드맵 10장): `executing-plans`로 이 세션이 끝까지 하고, 서브에이전트·자식 세션을 쓰지 않는다.

**Goal:** Day 화면의 읽는 부분을 DESIGN.md 모양으로 바꾼다. 대상은 헤더(큰 번호, 제목, 메타 칩), 본문 글, 알림 상자·경로 상자, 표, 인라인 코드, 코드 블록과 복사, 읽기 위치 바다. 완료 기준은 로드맵 M9의 ①~④다.

**Architecture:** 빌드(`lib/markdown.mjs`)가 만드는 본문 HTML은 그대로 두고 `day.css`와 `views/day.js`만 바꾼다. `day.css`의 Day 읽기 부분을 legacy 별칭에서 DESIGN.md 토큰으로 옮긴다. 읽기 위치 바는 새 공용 모듈 `views/readbar.js`에 둔다. 위치 계산은 순수 함수로, DOM 부착은 `mount → dispose`로 나눈다. CSS `animation-timeline: scroll(root)`을 지원하면 그것을 쓰고, 지원하지 않으면 rAF로 `--read`를 쓴다.

**Tech Stack:** 바닐라 JS(ESM), esbuild 0.28.2, `node:test`, 전역 Playwright 1.63.0 + Chromium, pixelmatch 8.0.0.

**Spec:** `docs/superpowers/specs/2026-11-12-unified-roadmap-design.md` 11장 M9 행(넘김 메모 포함). 세부 기준은 개편 설계서 `2026-11-11-textbook-redesign-design.md` 3.3(Day 페이지), 4장(가독성), 6장(모션)이다. 시각 값의 유일한 기준은 `DESIGN.md`다(Components "Day 부품"). 승인 시안은 `design-system/web-zero-to-hundred/prototype/day/`(git 밖, 이 PC에만 있음)이다. 장면은 `top-a`·`callout-a`·`code-a`·`answer-a`·`w320`이고, 대조할 시트는 `prototype/shots/day/sheet-<장면>.png`다.

## Global Constraints

- 색·글꼴·크기·간격·모서리·턱·모션 값은 DESIGN.md 토큰(`var(--…)`)으로만 쓴다. 토큰 밖 `#hex`·`rgb(`·`font-family`는 빌드가 막는다.
- 새 값은 DESIGN.md 수정안 승인 뒤에만 쓴다. Task 1의 문안이 그 수정안이고, **이 계획을 승인하면 그 문안도 승인한 것**으로 본다. 그 밖의 새 값이 필요해지면 멈추고 묻는다.
- One Pink: Day 화면의 분홍 면은 "Day 완료" 주 버튼 하나다. 읽기 위치 바는 `ink`다.
- One Big Number: Display(80px)는 Day 화면에서 머리의 Day 번호 하나다.
- Label-Only Pixel: Galmuri는 12px 라벨("Day", 알림 상자 머리)에만 쓴다.
- The Fluid Rule: 320px부터 가로 스크롤 0이다. 표·코드만 자기 상자 안에서 가로로 스크롤한다. 새 브레이크포인트는 만들지 않는다.
- 파일 하나, 외부 요청 0건. 이름·주소는 `curriculum.json`에서만 가져온다.
- 저장소 파일에 모델 식별자·개인정보·로컬 사용자 경로를 쓰지 않는다. 커밋·push는 사용자가 요청할 때만 한다. 아래 "Commit" 단계는 실행 세션 시작 때 사용자에게 한 번 확인하고 따른다.
- 미루지 않는다. 찾은 작은 문제는 이 마일스톤 안에서 고친다. M10 화면이 있어야 하는 일만 로드맵 11장 M10 행에 `(M9에서 넘김: …)`으로 적는다.
- 기준 이미지는 이 PC에서, 사용자 승인 뒤에만 `npm run test:visual:update`로 갱신한다.
- 브라우저 테스트 전에 PowerShell에서 `$env:NODE_PATH = (npm root -g)`를 실행한다. Playwright는 `file:`이 아니라 `127.0.0.1` 정적 서버로 연다.
- 명령은 `textbook/`에서 실행한다. 단, 완성본 테스트는 저장소 루트에서 실행한다.

## Review Focus

1. **동작 줄이기에서 읽기 위치 바**: `base.css`는 동작 줄이기에서 `animation-duration: 0.01ms !important`를 건다. 바는 위치 값이므로 멈추지 않고 계속 따라가야 한다. Chromium은 스크롤 타임라인에서 time 값 duration을 무시한다고 MDN과 여러 글이 적는다(검색 확인, 아래 출처). 단정하지 않고 Task 5의 e2e로 실측한다.
2. **화면 이동 뒤 바 정리**: Day → 홈, Day → Day, Day → 잠긴 Day로 가면 바가 남거나 두 개가 되면 안 된다. 스크롤 리스너도 남지 않아야 한다. Task 5에서 확인한다.
3. **스크롤할 수 없는 짧은 Day**("준비 중"): 위치 값은 0이고 NaN·Infinity가 아니다. Task 5의 단위 테스트와 e2e에서 확인한다.
4. **320px에서 긴 경로·넓은 표·긴 코드 줄·긴 제목**: 페이지 가로 스크롤 0. 표와 코드만 안에서 스크롤한다. Task 3·4에서 확인한다.
5. **인쇄**: 고정 위치 바가 종이 맨 위에 찍히지 않는다. Task 5에서 확인한다.

---

## 파일 구조

| 파일 | 책임 | Task |
|---|---|---|
| `DESIGN.md`, `textbook/src/styles/tokens.css` | Day 머리·본문·인라인 코드·표·코드 블록 세부, 읽기 위치 바 보강, 토큰 `--lesson-max` | 1 |
| `textbook/src/app/views/day.js` | 머리 조립(`dayHead`), 바 부착 | 2, 5 |
| `textbook/src/styles/day.css` | 머리, 본문 리듬, 인라인 코드, 표, 코드 블록, 읽기 위치 바 | 2~5 |
| `textbook/src/app/views/readbar.js` (신규) | `readRatio`, `mountReadBar` | 5 |
| `textbook/src/styles/print.css` | 인쇄에서 바 숨김 | 5 |
| `textbook/src/styles/legacy.css`, `textbook/lib/styles.mjs` | 쓰이지 않게 된 옛 이름 삭제 | 6 |
| `tests/unit/readbar.test.mjs` (신규) | `readRatio` | 5 |
| `tests/e2e/day.test.mjs` (신규) | 머리, 320px, 복사 성공, 읽기 위치 바 | 2~5 |
| `tests/visual/visual.test.mjs` | `scrollTo` 장면 옵션, `day-code`·`day-table` 장면 | 6 |
| `docs/…` 기록 | progress, CHECKPOINT, 로드맵 M10 넘김 | 7 |

범위 밖: `.day-outline`(M10에서 퀘스트 로그로 바뀐다), 정답 게이트·체크리스트·완료 영역(M10), 1280px 이상 퀘스트 로그 열 격자(M10), 그림 틀(M12).

---

### Task 1: DESIGN.md 보강과 `--lesson-max` 토큰

**Files:**
- Modify: `DESIGN.md` (Layout 크기 토큰 표, 브레이크포인트 `print` 행, z-index `--z-sticky` 행, Typography Named Rules One Big Number, Components "Day 부품", 부록 토큰 원문)
- Modify: `textbook/src/styles/tokens.css` (크기 토큰 줄)
- Test: `tests/unit/styles.test.mjs` (기존 `tokens.css equals the token block in DESIGN.md`)

**Interfaces:**
- Produces: CSS 변수 `--lesson-max: 720px`. Task 2~4가 쓴다.

- [ ] **Step 1: 크기 토큰 추가**: DESIGN.md 크기 토큰 표에 행 `| --lesson-max | 720px | 같음 | Day 글 열 최대 폭 |`을 넣는다. 부록 토큰 원문의 `--content-max` 다음 줄과 `tokens.css`의 같은 자리에 `--lesson-max: 720px;`를 넣는다. 근거는 개편 설계서 2장 "글 열 최대 폭 720px"와 승인 시안이다.

- [ ] **Step 2: 토큰 일치 테스트**

Run: `npm test`
Expected: 모두 통과. `tokens.css equals the token block in DESIGN.md` PASS.

- [ ] **Step 3: "Day 부품" 문안 추가**: Components "Day 부품" 맨 앞에 아래 다섯 항목을 그대로 넣는다. 기존 "읽기 위치 바" 항목은 아래 문안으로 바꾼다.

```markdown
- **Day 머리:** 빵부스러기 → 큰 Day 번호 → 제목 → 메타 칩 줄. 머리 아래 `var(--space-xl)`. 큰 번호는 Display(800, 80px, 줄간격 0.85, `letter-spacing: -0.04em`, 고정폭 숫자, `ink`)이고, 앞에 Galmuri "Day" 라벨(`ink-2`)을 글자 바닥선에 맞춰 붙인다(사이 `var(--space-xs)`, 위 `var(--space-md)`, 아래 `var(--space-xs)`). 큰 번호는 `aria-hidden`이고, h1 안 앞쪽에 `sr-only` "Day n · "를 둔다(읽는 이름 "Day n · 제목"). 제목 h1은 Headline(800, 38px, 줄간격 1.15, `letter-spacing: -0.025em`, `max-width: 20ch`, `text-wrap: balance`), 아래 `var(--space-md)`. 메타 칩은 기술 칩 모양으로 예상 시간, 작업 폴더(WZH Code `--text-code`), 월드 이름 순서다. 그 뒤에 상태 칩 "✅ 완료" 또는 "▶ 다음 할 Day"를 있을 때만 붙인다. 칩 개수 상한은 없다.
- **Day 본문:** 머리·본문·아래쪽을 담는 `.lesson`은 `max-width: var(--lesson-max)`(720px). 글은 Body long(17px, 줄간격 1.75). 섹션 제목 h2는 Title(800, 26px, 줄간격 1.2, `letter-spacing: -0.02em`), 위 `var(--space-3xl)`·아래 `var(--space-md)`, 선이나 카드 상자를 두지 않는다. 첫 h2는 위 0. `scroll-margin-top: calc(var(--topbar-h) + var(--space-lg))`. 단계 제목 h3는 Title small(800, 20px, 줄간격 1.3), 위 `var(--space-xl)`·아래 `var(--space-xs)`. h4는 800 17px, 위 `var(--space-lg)`·아래 `var(--space-2xs)`. 단락·목록 아래 `var(--space-md)`, 목록 항목 사이 `var(--space-2xs)`.
- **인라인 코드:** `track` 바탕, 1px `rule` 테두리, 모서리 `var(--space-2xs)`(`kbd`와 같다), 안쪽 `0 var(--space-2xs)`, WZH Code `--text-code`. 긴 경로는 아무 데서나 줄을 바꾼다(`overflow-wrap: anywhere`). 표 안의 코드만 줄을 바꾸지 않고 표 안에서 스크롤한다.
- **경로 상자:** `path` 알림 상자다("📍 경로", `path` 색). 제목 줄(예: "📂 시작 상태") 아래에 폴더·파일 경로를 목록으로 둔다. 따로 만든 모양은 없고, 경로는 인라인 코드 규칙에 따라 상자 안에서 줄을 바꾼다.
- **표:** 15px(`--text-ui`), 줄간격 1.5, 위아래 `var(--space-lg)`. 칸 안쪽 `var(--space-xs) var(--space-sm)`, 1px `rule` 선, 왼쪽 위 정렬. 머리 행은 `track` 바탕에 800. 모서리 없음. 글 열보다 넓으면 표 안에서만 가로로 스크롤한다(`display: block; overflow-x: auto`).
- **읽기 위치 바:** 상단 바 바로 아래(`position: fixed; top: var(--topbar-h)`, 좌우 끝까지) 3px, `z-sticky`. 채움 `ink`, 빈 곳 투명, `transform: scaleX(var(--read))`, `transform-origin: left`. `animation-timeline: scroll(root)`을 지원하면 그것을 쓰고(`animation` 줄임 속성 뒤에 적는다), 아니면 rAF로 `--read`를 쓴다. 본문을 그린 Day 화면(준비 중 포함)에만 있고 다른 화면으로 가면 없앤다. 스크롤할 수 없으면 0이다. 위치 값이라 동작 줄이기에서도 그대로 따라간다. 장식이라 `aria-hidden`이고 `role="progressbar"`를 두지 않는다(위치는 퀘스트 로그가 글자로 알린다). 인쇄에서 숨긴다.
```

  같은 절의 **코드 블록(밤 코드)** 항목 끝에 이 문장을 더한다. "윗줄 최소 40px, 파일 이름은 WZH Code `--text-code`, 안쪽 `var(--space-xs) var(--space-md)`, 긴 이름은 줄을 바꾼다. 복사 버튼은 윗줄 오른쪽, 최소 72×40px, 15px 800 `code-fg`, 왼쪽 1px `code-border` 선, hover `code-border` 바탕. 누르면 '복사됨'이 2초 보이고 '복사'로 돌아온다. 실패하면 코드를 선택해 두고 '직접 복사해 주세요'를 보인다. 결과는 `role="status"`로도 읽힌다. 코드 안쪽 `var(--space-md)`, 블록 위아래 `var(--space-lg)`."

- [ ] **Step 4: 맞춤 수정**: One Big Number Rule 문장 끝에 "Day 화면에서는 머리의 Day 번호다."를 더한다. z-index 표 `--z-sticky`의 쓰는 곳을 "읽기 위치 바"로 바꾼다. 브레이크포인트 `print` 행에 "읽기 위치 바"를 더한다. "Day 부품"의 "M9에서 화면에 넣는다" 문구를 지운다.

- [ ] **Step 5: 다시 실행**

Run: `npm test`
Expected: 모두 통과(기준선 288 + 0).

- [ ] **Step 6: Commit**

```bash
git add DESIGN.md textbook/src/styles/tokens.css
git commit -m "docs(design): day head, body rhythm, inline code, table, read bar specs; --lesson-max"
```

---

### Task 2: Day 머리(번호, 제목, 메타 칩)

**Files:**
- Modify: `textbook/src/app/views/day.js:194-321` (`renderDay`의 header 조립)
- Modify: `textbook/src/styles/day.css:1-12` (`.lesson`, `.lesson-meta` → 머리 규칙)
- Create: `tests/e2e/day.test.mjs`

**Interfaces:**
- Consumes: `chips(items, max)`, `h`, `minutesText`(`views/common.js`). `.sr-only`(`base.css`). `--lesson-max`(Task 1).
- Produces: `function dayHead(project, day, statusChip): HTMLElement`(`day.js` 안, export 안 함). 결과는 `header.lesson-head > p.lesson-num[aria-hidden] + h1 + ul.chips.lesson-chips`이다. `statusChip`은 `li.lesson-status`이고 `renderFooter`가 글자와 `hidden`을 계속 바꾼다. `.day-outline`(toc)은 그대로 머리 끝에 붙는다.
- Produces (테스트 파일): `tests/e2e/day.test.mjs`의 `before`가 픽스처를 복사한다. 그다음 `prepareContent(content)`로 고쳐 빌드하고 서버를 띄운다(`pages.test.mjs`와 같은 틀). Task 3~5가 이 파일에 테스트를 더하고 `prepareContent`를 넓힌다.

- [ ] **Step 1: 실패하는 테스트 작성**: `tests/e2e/day.test.mjs`에 `test('day head shows big number, title and meta chips')`를 만든다. 진도 없이 `#/day/fa-d01`, 1280×800.

```js
// 단언
assert.equal(await page.locator('.lesson-num').getAttribute('aria-hidden'), 'true');
assert.equal((await page.locator('.lesson-num .num').innerText()).trim(), String(day.num));
assert.equal((await page.locator('.lesson-head h1').textContent()).trim(), `Day ${day.num} · ${day.title}`);
const chips = await page.locator('.lesson-chips > li').allInnerTexts();
assert.deepEqual(chips.slice(0, 3), [minutesText(day.minutes), project.folder, project.title]);
assert.equal(await page.locator('.lesson-chips > li').nth(1).evaluate((el) => el.classList.contains('is-code')), true);
assert.equal(await page.locator('.lesson-status').innerText(), '▶ 다음 할 Day');
// One Big Number: 80px 글자는 하나
assert.equal(await page.evaluate(() => [...document.querySelectorAll('main *')].filter((el) => getComputedStyle(el).fontSize === '80px' && el.childElementCount === 0).length), 1);
```

`day`·`project`는 빌드한 `curriculum.json`의 `fa`·`fa-d01`에서 읽는다. `minutesText`는 `views/common.js`에서 가져온다.

- [ ] **Step 2: 실패 확인**

Run: `node --test ../tests/e2e/day.test.mjs`
Expected: FAIL. `.lesson-num`을 찾지 못한다.

- [ ] **Step 3: 구현**: `dayHead`를 만들고 `renderDay`의 `header`·`lesson-meta`를 바꾼다. 상태 칩은 `h('li', { class: 'lesson-status' })`로 만들어 `chips([...], Infinity)` 결과 끝에 붙이고, 둘째 칩에 `is-code`를 단다. `day.css`에서 `.lesson-meta`를 지우고 Task 1의 "Day 머리" 값으로 `.lesson`(`max-width: var(--lesson-max)`, `line-height: 1.75`), `.lesson-head`, `.lesson-num`, `.lesson-num .label`, `.lesson-head h1`, `.lesson-chips .is-code`를 쓴다. `.page-article`은 지금 규칙(`--measure`)을 유지한다(부록은 M9 범위가 아니다).

- [ ] **Step 4: 통과 확인**

Run: `node --test ../tests/e2e/day.test.mjs` 다음에 `npm run test:e2e`
Expected: 새 테스트 PASS, 기존 e2e 182개 모두 PASS(h1 글자를 보는 기존 테스트도 그대로 통과한다).

- [ ] **Step 5: Commit**

```bash
git add textbook/src/app/views/day.js textbook/src/styles/day.css tests/e2e/day.test.mjs
git commit -m "feat(day): head with big number, headline title and meta chips"
```

---

### Task 3: 본문 글, 알림·경로 상자, 인라인 코드, 표

**Files:**
- Modify: `textbook/src/styles/day.css:47-166`(글·표·인라인 코드), `:337-406`(알림 상자의 legacy 이름)
- Test: `tests/e2e/day.test.mjs`

**Interfaces:**
- Consumes: Task 1 토큰과 문안, Task 2의 `prepareContent`.
- Produces: `prepareContent`가 `fa/day-01.md` 끝(마지막 섹션 안)에 다음을 더한다. Task 4·5도 이것을 쓴다.
  - 경로 상자 하나: 제목 `📂 긴 경로`, 공백 없는 긴 경로 `` `C:\dev\aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\index.html` ``
  - 6열 표 하나: 셀마다 긴 단어와 `` `inline-code-without-spaces` ``
  - 한 줄이 200자인 ` ```html ` 코드 블록 하나
  - 스크롤 길이를 위한 단락 30개(`'긴 설명 단락이에요. '.repeat(20)`)
  - `fa/day-02.md`는 지운다("준비 중" Day가 된다. Task 5가 쓴다).

- [ ] **Step 1: 실패하는 테스트 작성**: 두 테스트를 만든다.
  - `test('day body follows DESIGN.md rhythm')`: 1280px에서 계산된 스타일을 본다.

```js
const s = await page.evaluate(() => {
  const css = (q, p) => getComputedStyle(document.querySelector(q))[p];
  const h2s = document.querySelectorAll('.lesson-body h2');
  return {
    bodyLine: css('.lesson-body p', 'lineHeight'), // 17 × 1.75
    h2Size: css('.lesson-body h2', 'fontSize'),
    h2Top: getComputedStyle(h2s[1]).marginTop,
    h2Border: getComputedStyle(h2s[1]).borderTopStyle,
    lessonMax: css('.lesson', 'maxWidth'),
    th: css('.lesson-body th', 'backgroundColor'),
    track: getComputedStyle(document.documentElement).getPropertyValue('--color-track').trim(),
    codeFont: css('.lesson-body :not(pre) > code', 'fontSize'),
  };
});
assert.equal(s.bodyLine, '29.75px');
assert.equal(s.h2Size, '26px');
assert.equal(s.h2Top, '64px');
assert.equal(s.h2Border, 'none');
assert.equal(s.lessonMax, '720px');
assert.equal(s.codeFont, '14px');
// th 바탕은 track 토큰 색 (hex → rgb 변환은 테스트 안 도우미로)
```

  - `test('day page has no horizontal scroll at 320px')`: 320×640, `#/day/fa-d01`. 페이지 `scrollWidth <= clientWidth`. `main` 안에서 화면 오른쪽 밖으로 나간 요소는 `pre`·`table` 안쪽을 빼고 0개다(`textbook.test.mjs`의 `escaped`와 같은 방식에 `table`을 더한다). `.lesson-body table`은 `scrollWidth > clientWidth`이고 `overflowX`가 `auto`다. 경로 상자 `.callout-path`의 오른쪽 끝이 `.lesson-body` 오른쪽 끝을 넘지 않는다. `.lesson-head h1`도 화면 안에 있다.

- [ ] **Step 2: 실패 확인**

Run: `node --test ../tests/e2e/day.test.mjs`
Expected: rhythm 테스트 FAIL(`h2Top` 등 옛 값). 320px 테스트는 지금도 통과할 수 있다. 통과하면 회귀를 막는 테스트로 남긴다.

- [ ] **Step 3: 구현**: Task 1의 "Day 본문"·"인라인 코드"·"표" 값으로 `day.css`를 고친다. 머리·h2·h3·h4·간격 규칙은 `.lesson-body`에만 둔다. 인라인 코드·표 규칙은 지금처럼 `.lesson-body, .page-body`가 함께 쓴다(부록 시각 장면이 바뀌면 Task 6에서 함께 승인받는다). 이 범위의 `var(--muted|--border|--surface-2|--border-strong|--measure|--link)`와 px·em 리터럴은 DESIGN.md 토큰으로 바꾼다. 알림 상자의 `--tip-bg` 등 legacy 이름도 `--color-tip-bg` 등으로 바로 바꾼다. 지역 변수 `--callout-*`는 유지한다.

- [ ] **Step 4: 통과 확인**

Run: `node --test ../tests/e2e/day.test.mjs` 다음에 `npm run test:e2e` 다음에 `npm test`
Expected: 모두 PASS. 스타일 lint 오류 0.

- [ ] **Step 5: Commit**

```bash
git add textbook/src/styles/day.css tests/e2e/day.test.mjs
git commit -m "feat(day): body rhythm, inline code, path box and tables on DESIGN.md tokens"
```

---

### Task 4: 코드 블록과 복사

**Files:**
- Modify: `textbook/src/styles/day.css:182-262`(코드 블록)
- Test: `tests/e2e/day.test.mjs`(성공 경로). 기존 `textbook.test.mjs`의 `copy falls back when clipboard denied`(실패 경로)는 그대로 둔다.

**Interfaces:**
- Consumes: `bindCopyButtons`(`day.js`, 동작 변경 없음), Task 3의 200자 코드 줄.
- Produces: 없음(모양만 바꾼다).

- [ ] **Step 1: 실패하는 테스트 작성**: `test('copy button copies code and shows 복사됨')`. `browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] })`로 연다.

```js
const button = page.locator('figure.code button.copy').first();
const code = await page.locator('figure.code pre code').first().textContent();
await button.click();
await eventually(async () => assert.equal((await button.innerText()).trim(), '복사됨'));
assert.equal(await page.evaluate(() => navigator.clipboard.readText()), code);
assert.equal(await button.evaluate((el) => getComputedStyle(el).color), await tokenRgb(page, '--color-tok-string'));
const box = await button.boundingBox();
assert.ok(box.width >= 72 && box.height >= 40, JSON.stringify(box));
await eventually(async () => assert.equal((await button.innerText()).trim(), '복사'), 4000);
```

`tokenRgb(page, name)`는 토큰 값을 같은 문서의 임시 요소 `color`에 넣어 계산값(`rgb(...)`)으로 돌려주는 테스트 도우미다.

- [ ] **Step 2: 실패 확인**

Run: `node --test ../tests/e2e/day.test.mjs`
Expected: FAIL. 버튼 높이 또는 색이 legacy 값과 달라 크기·색 단언에서 실패한다. 동작 단언(복사됨, 클립보드 내용)은 지금도 통과해야 한다. 동작 단언이 실패하면 멈추고 원인을 찾는다.

- [ ] **Step 3: 구현**: Task 1의 코드 블록 문장대로 `figure.code` 규칙을 토큰으로 바꾼다. 대상은 윗줄 최소 40px(`grid-template-rows: minmax(40px, auto) auto`), `figcaption`(`--font-code`, `--text-code`, 안쪽 `var(--space-xs) var(--space-md)`), `.copy`(최소 72×40px, `800 var(--text-ui)/1 var(--font-body)`), `pre` 안쪽 `var(--space-md)`, 블록 위아래 `var(--space-lg)`다. `--code-*`·`--tok-*`·`--font-mono`·`--font-sans` legacy 이름은 `--color-code-*`·`--color-tok-*`·`--font-code`·`--font-body`로 바꾼다. `.hljs-*` 규칙의 `--tok-*`도 같이 바꾼다.

- [ ] **Step 4: 통과 확인**

Run: `node --test ../tests/e2e/day.test.mjs` 다음에 `npm run test:e2e`
Expected: 모두 PASS(실패 경로 테스트 포함).

- [ ] **Step 5: Commit**

```bash
git add textbook/src/styles/day.css tests/e2e/day.test.mjs
git commit -m "feat(day): night code block head and copy button on DESIGN.md tokens"
```

---

### Task 5: 읽기 위치 바

**Files:**
- Create: `textbook/src/app/views/readbar.js`
- Modify: `textbook/src/app/views/day.js`(`renderDay`에서 부착), `textbook/src/styles/day.css`(바 규칙), `textbook/src/styles/print.css`
- Test: `tests/unit/readbar.test.mjs`, `tests/e2e/day.test.mjs`

**Interfaces:**
- Produces:
  - `export function readRatio(scrollTop: number, scrollHeight: number, clientHeight: number): number`: 0~1. 스크롤할 수 없거나(`scrollHeight - clientHeight <= 0`) 입력이 유한수가 아니면 0이다. 모듈을 불러올 때 DOM에 손대지 않는다.
  - `export function mountReadBar(): () => void`: `document.body`에 `div.read-bar[aria-hidden="true"] > span.read-bar-fill`을 하나 붙인다. 이미 있으면 먼저 지운다. `CSS.supports('animation-timeline: scroll()')`이 false일 때만 `scroll`·`resize` 리스너(passive)와 rAF로 바 요소에 `--read`를 쓴다. 돌려준 함수는 리스너와 요소를 모두 지운다.
- Consumes: `ctx.onCleanup(fn)`(`main.js`). `renderDay`는 잠금·없는 Day가 아닐 때(본문 또는 준비 중을 그릴 때)만 `ctx.onCleanup(mountReadBar())`를 부른다.

- [ ] **Step 1: 단위 테스트 작성**: `tests/unit/readbar.test.mjs`

```js
test('readRatio maps scroll position to 0..1', () => {
  assert.equal(readRatio(0, 2000, 1000), 0);
  assert.equal(readRatio(500, 2000, 1000), 0.5);
  assert.equal(readRatio(1000, 2000, 1000), 1);
  assert.equal(readRatio(1200, 2000, 1000), 1); // 튕김 스크롤
  assert.equal(readRatio(-30, 2000, 1000), 0);
});
test('readRatio is 0 when the page cannot scroll or input is broken', () => {
  assert.equal(readRatio(0, 800, 1000), 0);
  assert.equal(readRatio(0, 1000, 1000), 0);
  assert.equal(readRatio(NaN, 2000, 1000), 0);
});
```

- [ ] **Step 2: 실패 확인**

Run: `npm test`
Expected: FAIL. `readbar.js` 모듈이 없다.

- [ ] **Step 3: `readRatio` 구현** → `npm test` PASS.

- [ ] **Step 4: e2e 작성**: `tests/e2e/day.test.mjs`에 `scaleOf(page)`를 둔다. `.read-bar-fill`의 계산된 `transform` 행렬에서 a값을 읽고, `none`이면 1을 돌려준다. 375×640에서 다음을 확인한다.
  - `test('read bar fills as the page scrolls')`: 맨 위 `scaleOf ≤ 0.02`. 가운데로 스크롤하면 `0.4~0.6`. 맨 아래면 `≥ 0.98`. 바의 `getBoundingClientRect().top`은 상단 바 높이(56)이고 높이는 3이다. `aria-hidden`은 `true`다.
  - `test('read bar keeps tracking with reduced motion')`: `reducedMotion: 'reduce'` 컨텍스트에서 맨 아래 `≥ 0.98`(Review Focus 1).
  - `test('read bar falls back to --read without scroll timelines')`: `addInitScript`로 `CSS.supports`를 감싸 `animation-timeline` 질의만 false를 돌려주게 한다. 맨 아래로 스크롤한 뒤 `.read-bar`의 `--read`가 `1.0000`이 되기를 기다린다. Chromium은 CSS 쪽 스크롤 타임라인도 지원하므로, 여기서는 transform이 아니라 변수 값을 본다.
  - `test('read bar exists only on day screens')`: `#/day/fa-d01` → `#/` 이면 `.read-bar` 0개. → `#/day/fa-d01` → `#/day/fa-d02`(준비 중)이면 1개이고 `scaleOf ≤ 0.02`. → `#/day/fb-d01`(잠김)이면 0개(Review Focus 2·3).
  - `test('read bar is hidden in print')`: `page.emulateMedia({ media: 'print' })` 뒤 `.read-bar`의 `display`가 `none`이다(Review Focus 5).

- [ ] **Step 5: 실패 확인**

Run: `node --test ../tests/e2e/day.test.mjs`
Expected: 새 테스트 5개 FAIL. `.read-bar`가 없다.

- [ ] **Step 6: 구현**: `mountReadBar`, `renderDay` 부착, `day.css` 규칙을 만든다. 규칙은 Task 1 문안대로 `.read-bar`(fixed, `top: var(--topbar-h)`, `z-index: var(--z-sticky)`, 3px, `pointer-events: none`)와 `.read-bar-fill`(`ink`, `transform: scaleX(var(--read, 0))`, `transform-origin: left`)이다. `@supports (animation-timeline: scroll())` 안에서는 `animation: read-grow linear both;` 다음 줄에 `animation-timeline: scroll(root block);`을 쓴다. `print.css`의 숨김 목록에 `.read-bar`를 더한다.

- [ ] **Step 7: 통과 확인**

Run: `npm test` 다음에 `node --test ../tests/e2e/day.test.mjs` 다음에 `npm run test:e2e`
Expected: 모두 PASS. 동작 줄이기 테스트가 실패하면 `base.css`를 고치지 말고 멈춘다. 측정값과 함께 사용자에게 보고한다(DESIGN.md "동작 줄이기에서도 따라간다"와 충돌하므로).

- [ ] **Step 8: Commit**

```bash
git add textbook/src/app/views/readbar.js textbook/src/app/views/day.js textbook/src/styles/day.css textbook/src/styles/print.css tests/unit/readbar.test.mjs tests/e2e/day.test.mjs
git commit -m "feat(day): reading position bar with scroll timeline and rAF fallback"
```

---

### Task 6: legacy 이름 정리와 시각 장면

**Files:**
- Modify: `textbook/src/styles/legacy.css`, `textbook/lib/styles.mjs`(`LEGACY_VARS`)
- Modify: `tests/visual/visual.test.mjs`(`SCENES`, `shoot`)
- Modify: `tests/visual/baseline/`(승인 뒤 갱신)

**Interfaces:**
- Produces: 장면 옵션 `scrollTo: string`. 찍기 전에 첫 일치 요소에 `el.scrollIntoView({ block: 'start' })`를 부르고, 프레임 두 개를 기다린다.

- [ ] **Step 1: 쓰이지 않는 옛 이름 찾기**: `LEGACY_VARS`의 이름마다 `legacy.css`를 뺀 `textbook/src`에서 `var(--이름)` 사용을 grep한다. 0건인 이름 목록을 만든다.

Run (Git Bash, 저장소 루트): `for v in $(node -e "import('./textbook/lib/styles.mjs').then(m=>console.log([...m.LEGACY_VARS].join(' ')))"); do n=$(grep -rn -- "var(--$v[,)]" textbook/src --include=*.css --include=*.js | grep -v legacy.css | wc -l); [ "$n" = 0 ] && echo "$v"; done`
Expected: 이름 목록(예상: `code-*`, `tok-*`, 알림 5종 `*-bg/line/ink`, `font-mono`, `measure` 등. 실제 출력이 기준이다). `callout-*`는 legacy.css가 아니라 day.css의 지역 변수라 목록에 나와도 지우지 않는다.

- [ ] **Step 2: 삭제**: 그 이름들을 `legacy.css`와 `LEGACY_VARS`에서 지운다(`callout-*` 제외).

Run: `npm test` 다음에 `npm run check -- --allow-missing`
Expected: 모두 통과. "검사 통과: Day 155개, 페이지 4개".

- [ ] **Step 3: 장면 추가**: `SCENES`에 `{ id: 'day-code', hash: '#/day/p1-d01', progress: P1_FIRST_THREE, scrollTo: 'figure.code' }`와 `{ id: 'day-table', hash: '#/day/p1-d01', progress: P1_FIRST_THREE, scrollTo: '.lesson-body table' }`를 넣고, `shoot`에 `scrollTo`를 구현한다.

- [ ] **Step 4: 비교 실행**

Run: `npm run test:visual`
Expected: `day-*` 6장 FAIL(의도한 변경). `day-code`·`day-table` 12장은 기준 이미지가 없다는 실패. 그 밖에 바뀐 장면(인라인 코드·표·코드 블록을 함께 쓰는 `start`·`troubleshooting`·`glossary` 등)이 있으면 이름을 모두 적는다. 바뀐 장면마다 차이 이미지(`tests/visual/.out`)를 열어, 바뀐 곳이 M9 규칙의 범위인지 확인한다.

- [ ] **Step 5: 사용자 승인(멈춤)**: `day`·`day-code`·`day-table`과 Step 4에서 바뀐 장면을 3폭 × 2테마로 사용자에게 보여 준다(SendUserFile). 시안 시트 `sheet-top-a`·`sheet-callout-a`·`sheet-code-a`·`sheet-answer-a`·`sheet-w320`을 옆에 놓고 다른 점을 한 줄씩 적는다(완료 기준 ④). 읽기 위치 바 길이가 스크롤 위치와 맞지 않게 찍혔으면 그 사실도 적는다. Playwright `animations: 'disabled'`가 스크롤 타임라인을 끝 상태로 돌릴 수 있으나 확인되지 않았다. 바 동작의 증거는 Task 5 e2e다. 승인을 받기 전에는 갱신하지 않는다.

- [ ] **Step 6: 기준 이미지 갱신**(승인 뒤)

Run: `npm run test:visual:update` 다음에 `npm run test:visual`
Expected: 전부 PASS(92 + 12 = 104).

- [ ] **Step 7: Commit**

```bash
git add textbook/src/styles/legacy.css textbook/lib/styles.mjs tests/visual/visual.test.mjs tests/visual/baseline
git commit -m "test(visual): day code and table scenes; drop legacy names unused after M9"
```

---

### Task 7: 전체 검증과 기록

**Files:**
- Modify: `index.html`(`npm run build` 결과), `docs/checkpoint/workspace/progress.md`, `docs/CHECKPOINT.md`, `docs/superpowers/specs/2026-11-12-unified-roadmap-design.md` 11장 M10 행

- [ ] **Step 1: 기준선 전체**

Run: `npm test` / `npm run check -- --allow-missing` / `npm run test:e2e` / `npm run test:visual`
Expected: 모두 통과. 각 출력의 통과 수를 보고서에 그대로 적는다.

- [ ] **Step 2: 전 페이지 점검 4폭**: `npm run build:site`를 실행한다. 그다음 `tests/helpers/static-server.mjs`로 `_site`를 띄운다(백그라운드로 실행하고 PID로 종료한다. 같은 프로세스에서 `spawnSync`로 부르지 않는다. CHECKPOINT 기준선 주석). 마지막으로 `npm run check:site -- http://127.0.0.1:<port>/`를 실행한다.
Expected: 320·375·768·1280 각각 "방문 168개, 문제 0개".

- [ ] **Step 3: 완료 기준 증거**: 로드맵 M9의 ①~④에 각각 증거를 붙인다. ①은 Task 5 e2e 출력과 375px 스크롤 중간 스크린샷이다. ②는 Task 4 e2e 출력과 "복사됨" 스크린샷이다. ③은 Task 3 e2e 출력이다. ④는 Task 6 Step 5의 대조표다. 확인하지 못한 것(Safari·Firefox의 스크롤 타임라인, 실기기, 화면 낭독기)은 "확인하지 못함"으로 적는다.

- [ ] **Step 4: 자체 리뷰**: `git diff <M9 시작 커밋>..HEAD`를 처음부터 읽는다. Global Constraints와 Review Focus 5줄을 하나씩 대조하고, 찾은 문제는 재현 테스트 → 수정 → 전체 테스트로 끝낸다.

- [ ] **Step 5: 기록**: 다음을 고친다.
  - `progress.md`: `M9: complete` 줄과 기준선 수치.
  - `CHECKPOINT.md`: 맨 위 상태를 "M9 완료, 다음은 M10"으로 바꾸고, 기준선 수치와 M9 요약 줄을 고친다.
  - 로드맵 11장 M10 행 끝: `(M9에서 넘김: .day-outline 은 아직 legacy 별칭을 쓴다. 퀘스트 로그로 바꿀 때 지운다. 1280px 이상에서는 .lesson 을 grid-template-columns: minmax(0, var(--lesson-max)) 220px 로 나눈다(시안 day.css). 읽기 위치 바는 장식이고 지금 단계는 퀘스트 로그가 글자로 알린다)`
  - `npm run build`로 루트 `index.html`을 다시 만든다.

- [ ] **Step 6: Commit**

```bash
git add index.html docs/checkpoint/workspace/progress.md docs/CHECKPOINT.md docs/superpowers/specs/2026-11-12-unified-roadmap-design.md
git commit -m "docs: M9 complete, hand-off notes for M10"
```

---

## 출처 (Review Focus 1의 검색 근거)

- MDN, Scroll-driven animation timelines(time 값 duration이 스크롤 애니메이션 길이에 영향 없음, Firefox는 0이 아닌 duration 필요): https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations/Timelines
- MDN Blog, Scroll progress animations in CSS(`animation` 줄임 속성이 `animation-timeline`을 초기화하므로 뒤에 적는다): https://developer.mozilla.org/en-US/blog/scroll-progress-animations-in-css
- W3C, Scroll-driven Animations Module Level 1: https://w3.org/TR/scroll-animations-1/
