# M2 사이드바·서랍·월드 전환 구현 계획서

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 사이드바를 월드별 Accordion과 Day 행 상태 5종으로 바꾸고, 1024px 미만에서는 `<dialog>` 서랍으로 열며, 사이드바 머리에 월드 전환 메뉴를 둔다.

**Architecture:** 사이드바 내용(`<nav class="side">`)은 `views/sidebar.js`가 한 벌만 만든다. 넓은 화면에서는 `#sidebar`(aside)에, 서랍을 열면 `#drawer`(dialog) 안으로 옮기고 닫히면 되돌린다(두 벌을 맞추는 코드가 없다). `<dialog>` 열기·닫기와 메뉴 버튼 키보드 처리는 `views/overlay.js` 공용으로 두고 테마 메뉴도 같은 코드를 쓴다. 행 상태는 `progress.js`의 순수 함수 `navDayState`가 계산하고, "준비 중"은 빌드가 Day마다 넣는 `ready` 값으로 안다.

**Tech Stack:** 바닐라 JS(ESM), CSS, `<dialog>`·`showModal()`, Web Animations API(`motion.js`), `node:test`, 전역 Playwright 1.63.0, pixelmatch 8.0.0.

**Spec:** `docs/superpowers/specs/2026-11-12-unified-roadmap-design.md` 11.2 M2. 모양·값은 `DESIGN.md` Navigation·Buttons·Motion·Accessibility, 동작은 `docs/superpowers/specs/2026-11-11-textbook-redesign-design.md` 5.1(Drawer)·5.3(Dropdown)·5.4(Accordion). 마크업과 CSS의 출발점은 승인 시안 `design-system/web-zero-to-hundred/prototype/src/`(`view.mjs` `renderSidebar`, `style.css` "셸"~"Drawer", `app.js` `setupDialog`~"모두 펼치기"). 이 폴더는 로컬 전용이다.

**M2 완료 기준(스펙 11.2):** ① 375px에서 메뉴 버튼으로 서랍이 열리고 ESC·바깥 클릭으로 닫힌다 ② 월드 전환 메뉴로 다른 월드로 간다 ③ 사이드바의 오늘 Day 번호가 분홍 네모다. M1에서 넘긴 일: 서랍 월드 요약 줄 `stagger()`, 잠긴 Day 행을 누르면 `shake()` + `showToast()` 이유.

## Global Constraints

- 색·글꼴·크기·간격·모서리·턱·모션 값은 `DESIGN.md` 토큰(`var(--…)`)으로만 쓴다. 토큰 파일 밖에 색 값(`#hex`, `rgb(`, `hsl(`)과 `font-family`를 쓰지 않는다. 새 값이 필요하면 멈추고 `DESIGN.md` 수정안을 승인받는다. 예외는 DESIGN.md Motion 표가 숫자로 정한 Accordion `160ms`와 검색·서랍 닫힘 대기 `260`뿐이다.
- The One Pink Rule: 분홍 면은 사이드바에서 오늘 Day 번호 네모 하나뿐이다. 고른 메뉴 항목은 분홍 면이 아니라 `accent-text` 선 체크다.
- The Two Icon Rule: 꺾쇠·닫기는 선 아이콘(`icon('chevron')`, `icon('close')`), 완료 체크·자물쇠는 도트 아이콘(`px('check')`, `px('lock')`). 아이콘은 모두 `aria-hidden`, 뜻은 글자(`.sr-only`)가 맡는다.
- The Fluid Rule: 320px부터 가로 스크롤 0. 바뀌는 지점은 `(min-width: 64rem)`, `(pointer: coarse)`, `(prefers-reduced-motion: reduce)`만 쓴다. 서랍 폭 `min(var(--sidebar-w), calc(100% - var(--space-2xl)))`.
- 대상 크기: Day 행 최소 36px(터치 44px), 월드 요약 줄 최소 52px, 아이콘 버튼 40px, 글자 버튼 32px, 메뉴 항목 40px.
- 동작 줄이기: Stagger·Shake·Accordion 등장·서랍 들고남 애니메이션을 건너뛰고 서랍은 바로 닫는다. 이유 토스트는 그대로 나온다.
- 화면 함수의 입력은 `ctx`뿐이다. 같은 모양은 공용(`common.js`, `overlay.js`)으로 올린다.
- 지어낸 수치를 넣지 않는다. 행·요약 줄의 모든 숫자는 `prog`에서 계산한다.
- 커밋은 사용자가 요청할 때만, Task 경로만 고른다. push는 요청이 있을 때만. 저장소 파일에 모델 식별자·개인정보를 쓰지 않는다.
- e2e·시각 테스트 전에 `NODE_PATH`를 `npm root -g` 출력으로 맞춘다(`docs/CHECKPOINT.md` 5.2).

## 범위 판정 (실행 전에 정한 것)

- **"오늘" = `continueTarget(cur, prog)` 하나.** 지금 `dayState`의 `next`는 프로젝트마다 하나씩 생겨 분홍이 여러 개가 된다(One Pink 위반). 사이드바는 새 함수 `navDayState`를 쓰고, 다른 화면이 쓰는 `dayState`는 그대로 둔다.
- **상태 우선순위:** 잠김 > 완료 > 오늘 > 준비 중 > 남음. 시안 `renderSidebar`와 같다.
- **`aria-current` 충돌:** 지금 보는 화면의 행은 `aria-current="page"`, 오늘 행은 `aria-current="step"`. 오늘 행이 지금 화면이면 `page`가 이기고 분홍 네모(`.is-today`)는 그대로 둔다.
- **잠긴 Day 행은 `<button type="button">`.** DESIGN.md "잠김: 링크 없음"을 지키면서 키보드로 눌러 이유를 들을 수 있게 한다. 진도가 바뀌어 행 종류(링크↔버튼)가 바뀌면 그 행만 새로 만들어 바꾼다.
- **월드 전환 메뉴:** 사이드바 머리 가운데 글자 버튼 "월드" + 꺾쇠. 메뉴 버튼 패턴(`role="menu"`, 항목은 `role="menuitem"` 링크 `#/project/<id>`). 고르면 월드 페이지로 간다(사이드바는 기존 `markCurrent({ open: true })`로 그 월드를 펼친다). 잠긴 월드 항목은 홈의 잠긴 카드처럼 이동하지 않고 항목이 흔들리며 이유 토스트가 뜬다(`href`는 남겨 새 탭·JS 없음에서는 잠금 화면).
- **"프로젝트 한눈에 보기" 행은 없앤다.** 시안에 없고 월드 전환 메뉴가 같은 일을 한다.
- **부록 묶음은 유지한다.** 시안에는 없지만 원 설계서의 부록 접근이다. 월드 목록 아래 Label 머리 "부록" + Day 행과 같은 모양(번호 칸 없음).
- **잠김 이유 문장은 하나로.** 홈 잠긴 카드의 문장(`‘A’ 프로젝트를 끝내면 열려요.`)을 `common.js` `lockReason`으로 올려 홈·사이드바 요약 줄·잠긴 행·월드 메뉴가 같이 쓴다.
- **서랍 Stagger는 열 때마다.** DESIGN.md Motion "한 번만" 목록은 홈 첫 표시용이고, Navigation의 서랍은 "열면 … stagger로 나타난다"이다(시안도 매번).
- **`closedby`는 JS가 붙인다.** 지원하면 `closedby="any"`를 붙이고, 지원하지 않으면(Safari: [caniuse](https://caniuse.com/mdn-html_elements_dialog_closedby), [web-features](https://web-platform-dx.github.io/web-features-explorer/features/dialog-closedby), 2026-11 확인) 백드롭 좌표 감지를 붙인다. 템플릿에 속성을 박지 않아야 e2e에서 대체 경로를 진짜로 시험할 수 있다.
- **DESIGN.md 보충(Task 1)은 이 계획서 검토로 승인받는다.** 새 값은 없고, 이미 있는 토큰으로 부품 설명만 더한다.

## Review Focus

1. **Safari처럼 `closedby`가 없는 브라우저의 바깥 클릭:** 서랍이 닫혀야 한다. → Task 5 e2e `drawer backdrop fallback closes without closedBy`.
2. **서랍이 열린 채 창을 1024px 이상으로 넓힘:** 서랍이 닫히고 목록이 `#sidebar`로 돌아오며, 숨은 메뉴 버튼으로 포커스를 보내지 않는다. → Task 5 e2e `drawer closes and returns the nav when the window grows`.
3. **서랍에서 지금 화면의 링크를 다시 누름(hashchange 없음):** 그래도 서랍이 닫힌다. → Task 5 e2e `drawer closes on a link to the current screen`.
4. **잠긴 행을 키보드로 누름:** Enter·Space로도 흔들림과 이유가 나온다. → Task 4 e2e `locked day row explains on click and keyboard`.
5. **진도가 바뀌어 잠긴 행이 열림:** 버튼이던 행이 링크로 바뀌고, 사용자가 접고 편 월드 상태는 유지된다. → Task 4 e2e `sidebar rows show the five states`(2단계).

---

### Task 1: DESIGN.md 보충

**Files:**
- Modify: `DESIGN.md` (Components > Buttons의 "글자 버튼", Navigation의 "사이드바"·"Day 행", 새 줄 "월드 Dropdown")

**Interfaces:**
- Produces: 이후 Task가 따르는 문장. 값은 모두 기존 토큰이다.

- [ ] **Step 1: Navigation "사이드바" 줄을 아래로 바꾼다**

```markdown
- **사이드바:** 머리에 "홈" 링크, "월드" Dropdown 버튼(글자 버튼 + 선 꺾쇠), "모두 펼치기" 글자 버튼(모두 펼쳐져 있으면 "모두 접기"). 월드마다 `<details>` Accordion(지금 월드만 펼침, 사용자가 접고 편 것은 진도가 바뀌어도 유지). 요약 줄은 최소 52px: 월드 태그(Label, "월드 n" 또는 "특별 월드"), 이름(15px 800), 진도 `n / 전체` 또는 자물쇠, 펼침 꺾쇠(열리면 180° 회전). 잠긴 월드는 "무엇을 끝내면 열리는지" 한 줄. 월드 목록 아래에 Label 머리 "부록"과 부록 행(Day 행과 같은 모양, 번호 칸 없음, 잠기면 자물쇠).
```

- [ ] **Step 2: "Day 행" 줄 끝에 문장을 더한다**

```markdown
지금 보고 있는 화면의 행은 `track` 바탕과 `aria-current="page"`(오늘 행이 지금 화면이면 `page`가 우선하고 분홍 네모는 그대로). 잠긴 행은 `<button>`이고 누르면 행이 흔들리며 이유가 토스트로 나온다.
```

- [ ] **Step 3: "사이드바" 다음 줄에 "월드 Dropdown"을 넣는다**

```markdown
- **월드 Dropdown:** 테마 Dropdown과 같은 메뉴 모양과 키보드(메뉴 버튼 패턴, 항목은 `menuitem` 링크). 폭은 내용만큼, 최대 `calc(var(--sidebar-w) - var(--space-lg))`. 항목 40px 이상: 월드 태그(Label) | 이름(15px) | 진도 `n / 전체` 또는 자물쇠. 지금 화면이 속한 월드는 800과 선 체크(`accent-text`). 고르면 그 월드 페이지로 간다. 잠긴 월드는 `ink-2`이고, 누르면 이동하지 않고 항목이 흔들리며 이유가 토스트로 나온다.
```

- [ ] **Step 4: "서랍(Drawer)" 줄 끝에 문장을 더한다**

```markdown
열려 있는 동안 문서 스크롤을 잠근다(`:root:has(.drawer[open]) { overflow: hidden; }`). 사이드바와 서랍은 같은 목록 한 벌을 옮겨 쓴다.
```

- [ ] **Step 5: 확인**

Run: `git diff --stat DESIGN.md`
Expected: `DESIGN.md`만 바뀌고, `#`·`rgb(`·`px` 같은 새 값이 추가 줄에 없다(`git diff DESIGN.md | grep -E '^\+.*(#[0-9a-fA-F]{3}|rgb\()'` 출력 없음).

---

### Task 2: 준비 중 표시와 행 상태 계산

**Files:**
- Modify: `textbook/build.mjs` (Day 렌더 루프, `data.projects[].days[]`)
- Modify: `textbook/src/app/progress.js` (새 export)
- Modify: `textbook/src/app/views/common.js` (새 export)
- Modify: `textbook/src/app/views/home.js:38-46` (`note`의 잠김 문장을 `lockReason`으로)
- Test: `tests/unit/progress.test.mjs`, `tests/unit/common.test.mjs`(새 파일, DOM 없는 함수만), `tests/build/build.test.mjs:115-126`, `:211-225`

**Interfaces:**
- Produces:
  - 내장 데이터의 Day마다 `ready: boolean`. 준비 중(`PLACEHOLDER_HTML`)이면 `false`.
  - `navDayState(cur, prog, dayId, todayId = continueTarget(cur, prog)) → 'locked' | 'done' | 'today' | 'draft' | 'open'` (`progress.js`). `ready`가 없으면 준비된 것으로 본다.
  - `worldLabel(project) → string` (`common.js`): `track === 'special'`이면 `'특별 월드'`, 아니면 `` `월드 ${order}` ``.
  - `lockReason(cur, requires) → string` (`common.js`): `` `${titles.map((t) => `‘${t}’`).join(', ')} 프로젝트를 끝내면 열려요.` ``, 없는 id는 건너뛰고 남는 것이 없으면 `''`.

- [ ] **Step 1: 실패하는 테스트를 쓴다**

`tests/unit/progress.test.mjs`: `day(id, num, checkCount = 3, ready)`로 넷째 인자를 더하고(`undefined`면 객체에 넣지 않는다), `makeCur({ withSpecial = false, readyFa01 = true } = {})`에서 `fa-d01`은 `readyFa01`이 거짓일 때만 `ready: false`, 특별 과정 `sp-d02`는 늘 `ready: false`로 만든다. 기존 테스트는 `sp-d02`의 `ready`를 보지 않으므로 그대로 통과해야 한다.

```js
test('navDayState: one today, draft and locked win in order', () => {
  const cur = makeCur({ withSpecial: true }); // sp-d02 는 ready: false
  const empty = emptyProgress();
  assert.equal(navDayState(cur, empty, 'fa-d01'), 'today');
  assert.equal(navDayState(cur, empty, 'fa-d02'), 'open');
  assert.equal(navDayState(cur, empty, 'fb-d01'), 'locked');
  assert.equal(navDayState(cur, empty, 'sp-d02'), 'locked', '잠김이 준비 중보다 먼저');
  const faDone = { ...empty, completed: { 'fa-d01': 't', 'fa-d02': 't' } };
  assert.equal(navDayState(cur, faDone, 'fa-d01'), 'done');
  assert.equal(navDayState(cur, faDone, 'fb-d01'), 'today');
  assert.equal(navDayState(cur, faDone, 'sp-d01'), 'open', '다른 프로젝트의 첫 Day 는 오늘이 아니다');
  assert.equal(navDayState(cur, faDone, 'sp-d02'), 'draft');
});

test('navDayState: today wins over draft, unknown id is locked', () => {
  const cur = makeCur({ readyFa01: false });
  assert.equal(navDayState(cur, emptyProgress(), 'fa-d01'), 'today');
  assert.equal(navDayState(cur, emptyProgress(), 'nope'), 'locked');
});
```

`tests/unit/common.test.mjs`:

```js
test('worldLabel names main and special worlds', () => {
  assert.equal(worldLabel({ track: 'main', order: 2 }), '월드 2');
  assert.equal(worldLabel({ track: 'special', order: 1 }), '특별 월드');
});

test('lockReason lists required titles and skips unknown ids', () => {
  const cur = { projects: [{ id: 'fa', title: 'A' }, { id: 'fb', title: 'B' }], pages: [] };
  assert.equal(lockReason(cur, ['fa', 'fb']), '‘A’, ‘B’ 프로젝트를 끝내면 열려요.');
  assert.equal(lockReason(cur, ['zz']), '');
  assert.equal(lockReason(cur, undefined), '');
});
```

`tests/build/build.test.mjs`: 115-126의 기대 Day 객체에 `ready: true`를 더하고, `allow-missing builds with placeholder`에 `assert.equal(day.ready, false);`를 더한다.

`common.js`는 `icons.js`를 거쳐 DOM을 쓰지 않는지 먼저 확인한다(`h`는 호출할 때만 `document`를 쓴다). import만으로 실패하면 두 함수를 `textbook/src/app/labels.js`(새 파일)로 두고 `common.js`가 다시 내보낸다.

- [ ] **Step 2: 실패를 확인한다**

Run: `cd textbook && npm test`
Expected: FAIL — `navDayState is not a function`, `worldLabel` import 실패, `ready` 기대 불일치.

- [ ] **Step 3: 구현한다**

- `build.mjs`: `rendered.set(day.id, { …, ready: false })`(준비 중 분기)와 `ready: true`(본문 분기), `days: p.days.map((d) => ({ …, ready: rendered.get(d.id).ready }))`.
- `progress.js`: `navDayState`는 `locateDay`·`isUnlocked`·`isDone`을 재사용한다.
- `common.js`: `worldLabel`, `lockReason`. `home.js`의 잠김 문장은 `lockReason(cur, project.requires)`로 바꾼다(문장이 같으므로 홈 e2e·기준 이미지는 바뀌지 않는다).

- [ ] **Step 4: 통과를 확인한다**

Run: `cd textbook && npm test && npm run check -- --allow-missing`
Expected: 모두 통과, "검사 통과: Day 155개, 페이지 4개".

- [ ] **Step 5: 커밋(요청 시)**

```bash
git add textbook/build.mjs textbook/src/app/progress.js textbook/src/app/views/common.js textbook/src/app/views/home.js tests/unit/progress.test.mjs tests/unit/common.test.mjs tests/build/build.test.mjs
git commit -m "feat(nav): ready flag, single today state and shared lock reason"
```

---

### Task 3: 공용 오버레이 `views/overlay.js`와 테마 메뉴 이전

**Files:**
- Create: `textbook/src/app/views/overlay.js`
- Modify: `textbook/src/app/views/shell.js:199-268` (테마 메뉴를 `menuButton`으로)
- Test: `tests/unit/overlay.test.mjs`, 기존 `tests/e2e/layout.test.mjs:170-190`(테마 메뉴)

**Interfaces:**
- Consumes: `motionEnv()` (`motion.js`).
- Produces (`overlay.js` named export):
  - `DIALOG_CLOSE_FALLBACK_MS = 260`
  - `isOutside(rect, x, y) → boolean` — `rect`는 `{ left, right, top, bottom }`. 경계 위는 안쪽.
  - `menuIndex(key, index, count) → number | null` — `ArrowDown` 다음(끝→0), `ArrowUp` 이전(0→끝, `index`가 -1이면 끝), `Home` 0, `End` count-1, 그 밖 `null`.
  - `setupDialog(dlg, { proto = HTMLDialogElement.prototype } = {}) → void` — `'closedBy' in proto`이면 `closedby="any"`를 붙이고, 아니면 `click`에서 `e.target === dlg && isOutside(dlg.getBoundingClientRect(), e.clientX, e.clientY)`일 때 `closeDialog`. `cancel`(ESC)은 기본 동작을 막고 `closeDialog`. `close`가 오면 `is-closing`을 지우고, 복귀 대상이 있으면 포커스.
  - `openDialog(dlg, opener) → void` — 이미 열렸으면 아무것도 안 한다. 복귀 대상 = `opener ?? document.activeElement`(WeakMap에 둔다).
  - `closeDialog(dlg, { restoreFocus = true, immediate = false, env = motionEnv() } = {}) → void` — `restoreFocus`가 거짓이면 복귀 대상을 지운다. `immediate || env.reduce`면 바로 `close()`, 아니면 `is-closing` 클래스 → `animationend`(대상이 `dlg`일 때) 또는 `DIALOG_CLOSE_FALLBACK_MS` 뒤 `close()`. 닫는 중에 다시 부르면 무시.
  - `menuButton(button, menu, { items, initialIndex = () => 0 }) → { open(index?), close(returnFocus = true), isOpen() }` — `items: () => HTMLElement[]`. 버튼 click 토글, 버튼 ↓/↑로 처음/끝 항목 열기, 메뉴 안 `menuIndex` 이동, Esc(전파 중단)·Tab·바깥 `pointerdown`으로 닫기, `aria-expanded` 동기화, `menu.hidden`으로 보이기. 항목 고르기는 부르는 쪽이 `menu`의 click으로 처리한다.

- [ ] **Step 1: 실패하는 단위 테스트를 쓴다**

```js
test('isOutside: edges count as inside', () => {
  const r = { left: 0, right: 280, top: 0, bottom: 740 };
  assert.equal(isOutside(r, 300, 10), true);
  assert.equal(isOutside(r, 280, 740), false);
  assert.equal(isOutside(r, 10, -1), true);
});

test('menuIndex wraps and jumps', () => {
  assert.equal(menuIndex('ArrowDown', 2, 3), 0);
  assert.equal(menuIndex('ArrowUp', 0, 3), 2);
  assert.equal(menuIndex('ArrowUp', -1, 3), 2);
  assert.equal(menuIndex('Home', 1, 3), 0);
  assert.equal(menuIndex('End', 0, 3), 2);
  assert.equal(menuIndex('Enter', 0, 3), null);
});
```

`overlay.js`는 최상위에서 `HTMLDialogElement`·`document`를 읽지 않는다(기본 인자 안에서만). 그래야 node에서 import된다.

- [ ] **Step 2: 실패 확인** — Run: `cd textbook && npm test` / Expected: FAIL `Cannot find module …overlay.js`.

- [ ] **Step 3: `overlay.js`를 구현하고 `shell.js` 테마 메뉴를 `menuButton(themeBtn, themeMenu, { items: () => themeItems, initialIndex: () => max(checked, 0) })`로 바꾼다.** 테마 고르기(`choose`)와 아이콘 갱신은 `shell.js`에 남긴다. 원 코드의 동작(↓·↑ 열기, Home·End, Esc 복귀, Tab·바깥 닫기)은 하나도 빼지 않는다.

- [ ] **Step 4: 통과 확인**

Run: `cd textbook && npm test` 그리고 `NODE_PATH="$(npm root -g)" node --test ../tests/e2e/layout.test.mjs`
Expected: 단위 모두 통과, layout e2e 모두 통과(테마 메뉴 키보드 테스트 포함).

- [ ] **Step 5: 커밋(요청 시)** — `git add textbook/src/app/views/overlay.js textbook/src/app/views/shell.js tests/unit/overlay.test.mjs` / `refactor(overlay): shared dialog and menu button helpers`

---

### Task 4: 사이드바 Accordion과 Day 행 5종

**Files:**
- Create: `textbook/src/app/views/sidebar.js`
- Modify: `textbook/src/app/views/shell.js` (53-156행의 사이드바 코드를 `createSidebar`로 옮기고 연결)
- Modify: `textbook/src/template.html:29` (`<nav id="sidebar">` → `<aside id="sidebar" class="sidebar"></aside>`)
- Modify: `textbook/src/styles/shell.css` (사이드바 구역 161-290행을 시안 `.side`~`.row` 규칙으로 교체), `textbook/src/styles/components.css` (`.text-btn` 추가: DESIGN.md Buttons "글자 버튼")
- Test: `tests/e2e/textbook.test.mjs` (`sidebarState` 142행, 상태 기대값), 새 e2e

**Interfaces:**
- Consumes: `navDayState`, `continueTarget`, `projectState`, `isUnlocked` (`progress.js`); `h`, `doneCount`, `worldLabel`, `lockReason` (`common.js`); `icon`, `px` (`icons.js`); `shake` (`motion.js`); `showToast` (`toast.js`).
- Produces: `createSidebar(ctx) → { nav, refresh(), markCurrent(route, { open = false } = {}) → Element | null, focusTarget() → Element | null, summaries() → HTMLElement[] }`
  - `nav`: `<nav class="side" aria-label="교재 목차">` 한 벌. 머리 `.side-head`(홈 링크 `a.side-home[data-nav="home"]`, Task 6이 넣을 월드 버튼 자리, `button.text-btn[data-expand-all]`), `.side-worlds`, 부록 `section.side-appendix`.
  - 월드: `details.world[data-project=<id>][data-state=<projectState>]` > `summary`(`.world-tag.label`, `.world-name`, `.world-count`, `icon('chevron','world-chev')`) + 잠기면 `p.world-lock`(= `lockReason`) + `ol.rows`.
  - Day 행: `a.row.is-<state>[href="#/day/<id>"][data-day][data-state]` 또는 잠기면 `button.row.is-locked[type=button][data-day][data-state="locked"]`. 안: `.row-num`(번호만), `.row-title`, `.row-mark`(완료 `px('check')`, 잠김 `px('lock')`, 준비 중 `span.row-draft` "준비 중") + `.sr-only` 상태 글자(완료·오늘·잠김).
  - `focusTarget()`: `.is-today` 행 → `[aria-current="page"]` → 첫 링크.
  - `summaries()`: `.world > summary` 목록(서랍 Stagger용).

- [ ] **Step 1: 기존 e2e를 새 상태 이름에 맞춘다**

`sidebarState`를 `` page.locator(`#sidebar [data-day="${dayId}"]`).getAttribute('data-state') ``로, 기대값 `'next'`를 모두 `'today'`로 바꾼다(168, 187, 202, 261, 559, 639, 646, 649행). 지울 테스트는 없다.

- [ ] **Step 2: 새 e2e를 쓴다 (`tests/e2e/textbook.test.mjs`)**

```js
test('sidebar rows show the five states', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/day/fa-d01');
    const row = (id) => page.locator(`#sidebar [data-day="${id}"]`);
    assert.equal(await sidebarState(page, 'fa-d01'), 'today');
    assert.equal(await row('fa-d01').getAttribute('aria-current'), 'page', '지금 화면이면 page 가 우선');
    assert.match(await row('fa-d01').getAttribute('class'), /is-today/);
    assert.equal(await sidebarState(page, 'fa-d02'), 'open');
    assert.equal(await row('fb-d01').evaluate((el) => el.tagName), 'BUTTON');
    assert.equal(await row('fs-d02').getAttribute('data-state'), 'locked');
    // 1단계: fa-d01 만 끝낸다. 프로젝트 상태(fa active, fs locked)가 그대로이므로 사용자가 편 월드는 유지된다
    const fsWorld = page.locator('#sidebar details.world[data-project="fs"]');
    await fsWorld.locator('> summary').click();
    await completeDay(page, 'fa-d01');
    assert.equal(await sidebarState(page, 'fa-d01'), 'done');
    assert.equal(await sidebarState(page, 'fa-d02'), 'today');
    assert.equal(await fsWorld.evaluate((d) => d.open), true, '사용자가 편 월드는 그대로');
    // 2단계: fa 를 끝내면 fb·fs 가 열린다
    await visit(page, app, '#/day/fa-d02');
    await completeDay(page, 'fa-d02');
    assert.equal(await sidebarState(page, 'fb-d01'), 'today');
    assert.equal(await row('fb-d01').evaluate((el) => el.tagName), 'A', '열리면 링크로 바뀐다');
    assert.equal(await sidebarState(page, 'fs-d01'), 'open', '다른 월드의 첫 Day 는 오늘이 아니다');
    assert.equal(await sidebarState(page, 'fs-d02'), 'draft');
    assert.match(await row('fs-d02').innerText(), /준비 중/);
    assert.equal(await page.locator('#sidebar .row.is-today').count(), 1, '분홍 네모는 하나');
  }, { url: VARIANT_URL });
});

test('today row number is a 24px pink square', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/');
    const r = await page.locator('#sidebar .row.is-today .row-num').evaluate((el) => {
      const probe = document.createElement('i');
      probe.style.background = 'var(--color-accent)';
      document.body.append(probe);
      const pink = getComputedStyle(probe).backgroundColor;
      probe.remove();
      const s = getComputedStyle(el);
      return { bg: s.backgroundColor, pink, w: el.getBoundingClientRect().width, shadow: s.boxShadow };
    });
    assert.equal(r.bg, r.pink);
    assert.equal(Math.round(r.w), 24);
    assert.match(r.shadow, /2px 0px/);
  });
});

test('locked day row explains on click and keyboard', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/');
    const locked = page.locator('#sidebar [data-day="fb-d01"]');
    await page.locator('#sidebar details.world[data-project="fb"] > summary').click();
    await locked.click();
    await until(async () => (await page.locator('.toast').count()) === 1); // 토스트 클래스는 toast.js 를 따른다
    assert.match(await page.locator('.toast').first().innerText(), /프로젝트를 끝내면 열려요/);
    assert.equal(await page.evaluate(() => location.hash), '#/');
    await locked.focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Space');
    await until(async () => (await page.locator('.toast').count()) >= 2);
  });
});

test('expand all opens every world and flips its label', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/');
    const btn = page.locator('#sidebar [data-expand-all]');
    const opens = () => page.locator('#sidebar details.world').evaluateAll((ds) => ds.map((d) => d.open));
    assert.deepEqual(await opens(), [true, false], '지금 월드만 펼침');
    await btn.click();
    assert.deepEqual(await opens(), [true, true]);
    assert.equal(await btn.innerText(), '모두 접기');
    await btn.click();
    assert.deepEqual(await opens(), [false, false]);
    assert.equal(await btn.innerText(), '모두 펼치기');
  });
});
```

도우미 `until`을 도우미 구역에 더한다: `const until = (fn) => eventually(async () => assert.ok(await fn()));` (기존 `eventually`는 예외가 날 때만 다시 시도한다). 동작 줄이기 대체는 `tests/e2e/motion.test.mjs`에 `locked sidebar row: reduced motion still shows the reason`(`reducedMotion: 'reduce'`, 클릭 → 행 `getAnimations().length === 0`, 토스트 1개)을 더한다.

- [ ] **Step 3: 실패 확인** — Run: `cd textbook && npm run build && NODE_PATH="$(npm root -g)" npm run test:e2e` / Expected: 새 테스트와 바꾼 기대값이 FAIL(`today` 대신 `next`, `.row` 없음).

- [ ] **Step 4: 구현한다**

- `sidebar.js`: 위 Produces의 마크업. 행은 `Map(dayId → el)`; `refresh()`에서 `todayId`를 한 번 계산하고, 상태가 바뀐 행만 새로 만들어 `replaceWith`. 월드 기본 펼침은 지금 `shell.js` 107행 규칙(상태가 바뀔 때만 `active`이거나 지금 보는 월드면 펼침)을 그대로 옮긴다. 잠긴 행 click: `shake(row)` + `showToast(lockReason(cur, project.requires))`. `summary` click이면 그 `details`에 `is-animating`을 붙였다 400ms 뒤 뗀다(시안 `animateWorld`). "모두 펼치기"는 전부 펼침/접음 후 글자를 `toggle` 이벤트(capture)로 맞춘다. `aria-pressed`는 쓰지 않는다(글자가 바뀌므로).
- `shell.js`: `createSidebar(ctx)`의 `nav`를 `#sidebar`에 붙이고, `refresh`·`onRoute`에서 `side.refresh()`·`side.markCurrent()`를 부른다. `revealInSidebar`는 스크롤 상자인 `#sidebar`(aside) 기준으로 유지한다. 404 빌드의 링크 바꾸기(300-304행)는 `nav`를 붙인 뒤 그대로 돈다.
- CSS: 시안 `style.css` 274-312행(`.side`~`@media (pointer: coarse)`)을 옮기고, 시안의 `.visually-hidden`은 이 저장소의 `.sr-only`로 쓴다. 더할 규칙: `a.row[aria-current="page"] { background: var(--color-track); }`, `button.row { width: 100%; border: 0; background: none; font: inherit; color: var(--color-ink-2); text-align: start; cursor: pointer; }`, `.side-appendix .row { grid-template-columns: minmax(0, 1fr) auto; }`. 데스크톱 `.sidebar` 규칙은 시안 261-272행. 옛 `#sidebar …`, `.side-project`, `.side-days`, `.side-overview` 규칙은 지운다(좁은 화면 구역은 Task 5에서 바꾼다).
- `print.css`의 `#sidebar` 숨김은 그대로 둔다.

- [ ] **Step 5: 통과 확인**

Run: `cd textbook && npm test && npm run build && NODE_PATH="$(npm root -g)" npm run test:e2e`
Expected: 모두 통과(서랍 e2e `mobile menu opens as a drawer…`는 Task 5에서 다시 쓰므로, 이 시점에 실패하면 실패 내용만 적고 Task 5로 넘어간다).

- [ ] **Step 6: 커밋(요청 시)** — `git add textbook/src/app/views/sidebar.js textbook/src/app/views/shell.js textbook/src/template.html textbook/src/styles/shell.css textbook/src/styles/components.css tests/e2e/textbook.test.mjs tests/e2e/motion.test.mjs` / `feat(nav): world accordion and five day row states`

---

### Task 5: `<dialog>` 서랍

**Files:**
- Modify: `textbook/src/template.html` (메뉴 버튼 속성, `</div><!-- .shell -->` 뒤에 dialog)
- Modify: `textbook/src/app/views/shell.js` (옛 `setNav`·`nav-backdrop`·`body.nav-open`·`main.inert` 제거, 서랍 연결)
- Modify: `textbook/src/styles/shell.css` (380-412행 좁은 화면 구역을 시안 Drawer 규칙으로), `textbook/src/styles/print.css` (`dialog` 숨김)
- Test: `tests/e2e/textbook.test.mjs:654-677` 교체, `tests/e2e/motion.test.mjs`

**Interfaces:**
- Consumes: `setupDialog`, `openDialog`, `closeDialog` (`overlay.js`); `createSidebar` 결과의 `nav`, `focusTarget()`, `summaries()`; `stagger` (`motion.js`).
- Produces: 마크업

```html
<button id="menu-toggle" class="icon-btn menu-btn" type="button" aria-haspopup="dialog" aria-controls="drawer" aria-expanded="false" aria-label="Day 목록 열기">{{ICON:menu}}</button>
…
<dialog id="drawer" class="drawer" aria-labelledby="drawer-title">
  <div class="drawer-head">
    <span id="drawer-title" class="drawer-title">Day 목록</span>
    <button id="drawer-close" class="icon-btn" type="button" aria-label="Day 목록 닫기">{{ICON:close}}</button>
  </div>
  <div class="drawer-body"></div>
</dialog>
```

- [ ] **Step 1: 실패하는 e2e를 쓴다**

`mobile menu opens as a drawer and closes again`을 아래로 바꾼다(375×740).

```js
test('mobile drawer opens as a dialog and closes by Escape, backdrop, button and link', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/');
    const toggle = page.locator('#menu-toggle');
    const isOpen = () => page.locator('#drawer').evaluate((d) => d.open);
    const openIt = async () => { await toggle.click(); await until(isOpen); };
    const closed = () => until(async () => !(await isOpen()));

    await openIt();
    assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
    assert.equal(await page.evaluate(() => document.activeElement.classList.contains('is-today')), true, '오늘 Day 로 포커스');
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).overflow), 'hidden', '문서 스크롤 잠금');
    await page.keyboard.press('Escape'); await closed();
    assert.equal(await page.evaluate(() => document.activeElement.id), 'menu-toggle', '연 버튼으로 복귀');
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false');

    await openIt(); await page.mouse.click(360, 400); await closed(); // 서랍 폭 280px 바깥
    await openIt(); await page.locator('#drawer-close').click(); await closed();
    await openIt(); await page.locator('#drawer [data-day="fa-d01"]').click();
    await waitRoute(page, '#/day/fa-d01'); await closed();
    assert.equal(await page.locator('#sidebar [data-day="fa-d01"]').count(), 1, '닫히면 목록이 사이드바로 돌아온다');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  }, { viewport: { width: 375, height: 740 } });
});

test('drawer backdrop fallback closes without closedBy', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/');
    assert.equal(await page.locator('#drawer').getAttribute('closedby'), null);
    await page.locator('#menu-toggle').click();
    await page.mouse.click(360, 400);
    await until(async () => !(await page.locator('#drawer').evaluate((d) => d.open)));
  }, { viewport: { width: 375, height: 740 }, init: () => { delete HTMLDialogElement.prototype.closedBy; } });
});

test('drawer closes and returns the nav when the window grows', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/');
    await page.locator('#menu-toggle').click();
    await page.setViewportSize({ width: 1280, height: 800 });
    await until(async () => !(await page.locator('#drawer').evaluate((d) => d.open)));
    assert.equal(await page.locator('#sidebar nav.side').count(), 1);
    assert.notEqual(await page.evaluate(() => document.activeElement.id), 'menu-toggle');
  }, { viewport: { width: 375, height: 740 } });
});

test('drawer closes on a link to the current screen and keeps Tab inside', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/');
    await page.locator('#menu-toggle').click();
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press('Tab');
      // 모달 바깥(상단 바·본문·푸터)으로는 가지 않는다. 브라우저 UI 로 잠깐 나가 body 가 되는 것은 허용
      const outside = await page.evaluate(() => {
        const a = document.activeElement;
        return a !== document.body && !document.getElementById('drawer').contains(a);
      });
      assert.equal(outside, false);
    }
    await page.locator('#drawer a.side-home').click(); // 지금 화면(홈)
    await until(async () => !(await page.locator('#drawer').evaluate((d) => d.open)));
  }, { viewport: { width: 375, height: 740 } });
});

test('Ctrl+K from the open drawer goes to search', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/');
    await page.locator('#menu-toggle').click();
    await page.keyboard.press('Control+k');
    await waitRoute(page, '#/search');
    assert.equal(await page.locator('#drawer').evaluate((d) => d.open), false);
  }, { viewport: { width: 375, height: 740 } });
});
```

`tests/e2e/motion.test.mjs`에 두 개를 더한다: `drawer staggers world summaries`(375px, 연 직후 첫 `summary.getAnimations().length > 0`), `reduced motion: drawer closes at once without stagger`(`reducedMotion: 'reduce'`, 연 직후 애니메이션 0, Escape 다음 바로 `open === false`).

- [ ] **Step 2: 실패 확인** — Run: `cd textbook && npm run build && NODE_PATH="$(npm root -g)" npm run test:e2e` / Expected: FAIL(`#drawer` 없음).

- [ ] **Step 3: 구현한다**

- `shell.js`: `setupDialog(drawer)`. 메뉴 버튼 click → `drawerBody.append(side.nav)` → `openDialog(drawer, menuToggle)` → `aria-expanded="true"` → `t = side.focusTarget()`; `t.scrollIntoView({ block: 'center' })`; `t.focus({ preventScroll: true })` → `stagger(side.summaries())`. `drawer`의 `close`(setupDialog 뒤에 등록) → `sidebarEl.append(side.nav)`, `aria-expanded="false"`. 닫기 버튼 → `closeDialog(drawer)`. 서랍 안 `a[href]` click → `closeDialog(drawer, { restoreFocus: false })`(같은 주소여도 닫힌다). `onRoute` → 열려 있으면 `closeDialog(drawer, { restoreFocus: false })`. `matchMedia('(min-width: 64rem)')` change에서 `matches`면 `closeDialog(drawer, { restoreFocus: false, immediate: true })`. Ctrl+K 처리의 `setNav(false…)`는 `closeDialog(drawer, { restoreFocus: false, immediate: true })`로. `MOBILE` 상수와 `main.inert`는 지운다(`showModal`이 바깥을 inert로 만든다).
- CSS: 시안 `style.css` 314-331행(`.drawer`~`@keyframes drawer-out`)을 옮기고 `.drawer-body { flex: 1; overflow-y: auto; overscroll-behavior: contain; }`, `:root:has(.drawer[open]) { overflow: hidden; }`, `@media (min-width: 64rem) { .drawer { display: none; } }`를 더한다. `fade-in`·`fade-out` 키프레임이 없으면 시안에서 함께 옮긴다. 옛 `.nav-backdrop`, `body.nav-open` 규칙을 지운다.
- `print.css`: 숨김 목록에 `dialog`를 더한다(DESIGN.md Layout print).

- [ ] **Step 4: 통과 확인**

Run: `cd textbook && npm test && npm run build && NODE_PATH="$(npm root -g)" npm run test:e2e`
Expected: 모두 통과, 콘솔 오류·외부 요청 0.

- [ ] **Step 5: 커밋(요청 시)** — `git add textbook/src/template.html textbook/src/app/views/shell.js textbook/src/styles/shell.css textbook/src/styles/print.css tests/e2e/textbook.test.mjs tests/e2e/motion.test.mjs` / `feat(nav): dialog drawer under 1024px`

---

### Task 6: 월드 전환 메뉴

**Files:**
- Modify: `textbook/src/app/views/sidebar.js` (`.side-head` 가운데 버튼과 메뉴)
- Modify: `textbook/src/styles/shell.css` (`.side-head { position: relative; }`, `.world-menu` 위치·항목 격자)
- Test: `tests/e2e/textbook.test.mjs`

**Interfaces:**
- Consumes: `menuButton` (`overlay.js`); `projectState`, `doneCount`, `worldLabel`, `lockReason`; `shake`, `showToast`.
- Produces: `button#world-btn.text-btn[aria-haspopup="menu"][aria-controls="world-menu"][aria-expanded]`(글자 "월드" + `icon('chevron')`), `div#world-menu.menu.world-menu[role="menu"][aria-labelledby="world-btn"][hidden]` > `a[role="menuitem"][href="#/project/<id>"][data-project]`(`.label` 태그, 이름, 진도 또는 `px('lock')` + `.sr-only` "잠김"), 잠기면 `aria-disabled="true"`. 지금 화면의 월드 항목은 `aria-current="page"`와 선 체크 `icon('check')`. `refresh()`·`markCurrent()`가 항목 상태를 맞춘다.

- [ ] **Step 1: 실패하는 e2e를 쓴다**

```js
test('world menu moves to another world and explains a locked one', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/');
    const btn = page.locator('#world-btn');
    const item = (id) => page.locator(`#world-menu [data-project="${id}"]`);
    await btn.click();
    assert.equal(await page.locator('#world-menu [role="menuitem"]').count(), 2);
    await item('fb').click();
    await until(async () => (await page.locator('.toast').count()) === 1);
    assert.equal(await page.evaluate(() => location.hash), '#/', '잠긴 월드로는 이동하지 않는다');
    await item('fa').click();
    await waitRoute(page, '#/project/fa');
    assert.equal(await page.locator('#world-menu').isHidden(), true);
    assert.equal(await page.locator('#sidebar details.world[data-project="fa"]').evaluate((d) => d.open), true);
    await btn.click();
    assert.equal(await item('fa').getAttribute('aria-current'), 'page');
  }, { viewport: { width: 1280, height: 800 } });
});

test('world menu keyboard: arrows, End, Escape and Tab', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/');
    const focusedProject = () => page.evaluate(() => document.activeElement.dataset.project ?? document.activeElement.id);
    await page.locator('#world-btn').focus();
    await page.keyboard.press('ArrowDown');
    assert.equal(await focusedProject(), 'fa');
    await page.keyboard.press('End');
    assert.equal(await focusedProject(), 'fb');
    await page.keyboard.press('ArrowDown');
    assert.equal(await focusedProject(), 'fa', '끝에서 처음으로');
    await page.keyboard.press('Escape');
    assert.equal(await focusedProject(), 'world-btn');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await waitRoute(page, '#/project/fa');
  });
});

test('world menu works inside the drawer', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/');
    await page.locator('#menu-toggle').click();
    await page.locator('#drawer #world-btn').click();
    await page.locator('#drawer #world-menu [data-project="fa"]').click();
    await waitRoute(page, '#/project/fa');
    assert.equal(await page.locator('#drawer').evaluate((d) => d.open), false);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  }, { viewport: { width: 320, height: 640 } });
});
```

- [ ] **Step 2: 실패 확인** — Run: e2e / Expected: FAIL(`#world-btn` 없음).

- [ ] **Step 3: 구현한다**

`menuButton(worldBtn, worldMenu, { items: () => [...worldMenu.querySelectorAll('[role="menuitem"]')], initialIndex: () => 지금 월드 항목 index 또는 0 })`. `worldMenu` click: 잠긴 항목이면 `preventDefault()` → `shake(item)` → `showToast(lockReason(cur, project.requires))`(메뉴는 열어 둔다). 아니면 메뉴를 닫고(`close(false)`) 링크 기본 동작으로 이동한다. 서랍 안이면 Task 5의 "서랍 안 링크 click" 처리가 서랍을 닫는다. 메뉴 CSS는 기존 `.menu`를 재사용하고 `.world-menu { left: 50%; translate: -50% 0; max-width: calc(var(--sidebar-w) - var(--space-lg)); }` 정도만 더한다(320px 서랍 폭 272px 안에 들어가는지 위 e2e가 본다).

- [ ] **Step 4: 통과 확인** — Run: `cd textbook && npm test && npm run build && NODE_PATH="$(npm root -g)" npm run test:e2e` / Expected: 모두 통과. 404 빌드 테스트(`layout.test.mjs` `#sidebar a`가 모두 사이트 주소로 시작)도 통과해야 한다(메뉴 링크 포함).

- [ ] **Step 5: 커밋(요청 시)** — `git add textbook/src/app/views/sidebar.js textbook/src/styles/shell.css tests/e2e/textbook.test.mjs` / `feat(nav): world switch menu in the sidebar head`

---

### Task 7: 시각 기준 이미지, 전 페이지 점검, 문서

**Files:**
- Modify: `tests/visual/visual.test.mjs` (`SCENES`에 서랍 장면, 장면별 폭)
- Modify: `tests/visual/baseline/*.png` (사용자 승인 뒤)
- Modify: `docs/CHECKPOINT.md`(머리 상태·기준선 숫자), `docs/checkpoint/workspace/progress.md`(`M2: complete`), `docs/superpowers/specs/2026-11-12-unified-roadmap-design.md` 11장(넘길 일이 생겼을 때만)

**Interfaces:**
- Consumes: Task 4~6의 화면.
- Produces: `SCENES` 항목의 선택 필드 `widths?: number[]`(없으면 `WIDTHS`), `open?: string`(누를 선택자. 누른 뒤 `#drawer[open]`을 기다린다). 새 장면 `{ id: 'drawer', hash: '#/', progress: P1_FIRST_THREE, widths: [375, 768], open: '#menu-toggle' }` → 기준 이미지 4장 추가.

- [ ] **Step 1: 장면을 더하고 비교를 돌린다**

Run: `cd textbook && NODE_PATH="$(npm root -g)" npm run test:visual`
Expected: 1280 장면 8장(사이드바가 보임)과 새 서랍 4장이 FAIL·"기준 이미지 없음". 375·768의 home·day·settings·notfound 12장은 PASS(사이드바가 안 보이므로 바뀌면 안 된다). 바뀌었다면 원인을 찾아 고친다.

- [ ] **Step 2: 사용자에게 보여 준다**

`tests/visual/.out/*.actual.png`(1280 × 2테마 4장면, 서랍 375·768 × 2테마)을 승인 시안(`design-system/web-zero-to-hundred/prototype/home.html`을 같은 폭으로 연 화면)과 나란히 보여 주고 `DESIGN.md` Navigation과 대조한 결과를 적는다. **승인 전에는 기준 이미지를 바꾸지 않는다.**

- [ ] **Step 3: 승인 뒤 기준 이미지를 갱신하고 다시 비교한다**

Run: `cd textbook && NODE_PATH="$(npm root -g)" npm run test:visual:update && NODE_PATH="$(npm root -g)" npm run test:visual`
Expected: 30개 장면 테스트(4×6 + 서랍 4) + 비교 함수 2개 모두 통과.

- [ ] **Step 4: 전체 기준선과 전 페이지 점검**

Run: `cd textbook && npm test && npm run check -- --allow-missing && npm run build && NODE_PATH="$(npm root -g)" npm run test:e2e && npm run build:site`
그다음 로컬 정적 서버를 백그라운드로 띄우고 점검한다.

```bash
node -e "import('../tests/helpers/static-server.mjs').then(async (m) => { const s = await m.startStaticServer('../_site'); console.log(s.url); })"
```

```bash
NODE_PATH="$(npm root -g)" npm run check:site -- <위에서 출력된 주소>
```

Expected: 단위·빌드 전부 통과, "검사 통과: Day 155개, 페이지 4개", e2e 전부 통과, 320·375·768·1280 각각 "문제 0개". 배포본 점검(`https://tiharun.github.io/web-zero-to-hundred/`)은 사용자가 push를 요청한 뒤 Actions가 초록이 되면 같은 명령으로 한다.

- [ ] **Step 5: 화면 증거**

375px(서랍 열림), 768px(서랍 열림), 1280px(사이드바 + 월드 메뉴 열림) × 라이트·다크 스크린샷을 보고에 넣는다. 확인하지 못한 것: Safari(대체 경로는 Chromium에서 `closedBy` 삭제로만 확인), 휴대폰 실기기, 화면 낭독기.

- [ ] **Step 6: 문서**

`progress.md`에 `M2: complete`와 실행한 명령·통과 수. `CHECKPOINT.md` 머리를 "M2 완료, 다음은 M3"과 새 기준선 숫자로. 작업 중 찾은 다른 마일스톤의 일은 로드맵 11장 해당 행에 `(M2에서 넘김: …)`으로 적는다.

- [ ] **Step 7: 커밋(요청 시)** — `git add tests/visual/visual.test.mjs tests/visual/baseline DESIGN.md docs/CHECKPOINT.md docs/superpowers/specs/2026-11-12-unified-roadmap-design.md` / `docs: M2 complete — sidebar accordion, drawer, world menu`. 커밋 전에 `CLAUDE.md` 8장의 비밀값 검사를 돌려 출력이 없어야 한다.
