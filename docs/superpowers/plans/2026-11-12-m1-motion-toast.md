# M1 모션·토스트 구현 계획서

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 교재 앱에 공용 모션 모듈 `motion.js`(Reveal, stagger, Tilt, Magnetic, Shake, 세션 1회 기록)와 토스트 틀 `views/toast.js`를 넣고, 지금 있는 화면에 연결한다.

**Architecture:** `motion.js`는 숫자 계산(순수 함수)과 DOM 적용 함수로 나눈다. DOM 함수는 `env = { reduce, fine }`를 받아 동작 줄이기·마우스 여부를 판단하고, 붙인 것을 떼는 `dispose`를 돌려준다. `main.js`는 화면을 바꿀 때마다 앞 화면의 정리 함수를 부른다(`ctx.onCleanup`). 토스트는 `<body>` 아래 영역 하나(`role="status"`)에 쌓이며, 화면을 옮겨도 남는다. 모션 라이브러리는 쓰지 않는다(CSS와 Web Animations API만).

**Tech Stack:** 바닐라 JS(ESM), CSS, Web Animations API, IntersectionObserver, `node:test`, 전역 Playwright 1.63.0.

**Spec:** `docs/superpowers/specs/2026-11-12-unified-roadmap-design.md` 11.2 M1. 세부 값은 `DESIGN.md` Components > Motion·Buttons, 동작 원칙은 `docs/superpowers/specs/2026-11-11-textbook-redesign-design.md` 5·6장.

**M1 완료 기준(스펙 11.2):** ① 주 버튼이 포인터를 살짝 따라온다(Magnetic) ② 잠긴 것을 누르면 흔들린다 ③ 동작 줄이기를 켜면 모든 움직임이 꺼진다.

## Global Constraints

- 색·글꼴·크기·간격·모서리·턱·모션 값은 `DESIGN.md` 토큰(`var(--…)`)으로만 쓴다. 토큰 파일 밖에 색 값(`#hex`, `rgb(`, `hsl(`)과 `font-family`를 쓰지 않는다. 새 값이 필요하면 멈추고 `DESIGN.md` 수정안을 승인받는다.
- 파일 하나, 외부 요청 0건. 모션 라이브러리와 CDN은 쓰지 않는다.
- 움직이는 속성은 `transform`, `translate`, `opacity`, `box-shadow`(턱), `clip-path`, `stroke-dashoffset`, 색만 쓴다. 레이아웃 속성(폭·높이·위치)은 움직이지 않는다.
- 동작 줄이기(`prefers-reduced-motion: reduce`)이면 JS도 Stagger·Reveal·Tilt·Magnetic·Shake를 건너뛴다. 정보와 기능은 하나도 빠지지 않는다(Shake 대신 이유 문장 알림은 그대로).
- Tilt·Magnetic은 `(hover: hover) and (pointer: fine)`이고 `pointerType === 'mouse'`일 때만 켠다.
- 숨긴 채 시작하는 상태(Reveal 전)는 JS가 붙인 클래스로만 만든다. JS가 실패해도 내용은 보인다.
- 값(DESIGN.md Motion): Stagger `duration 280`, `delay i * 40`, 최대 8개, 아래 8px에서 투명도 0→1, `--ease-out`. Shake 300ms, 좌우 4px 네 번(`translateX(-4px)` ↔ `4px`). Magnetic `PULL = 6`, `REACH = 32`, `translate: var(--mx, 0px) var(--my, 0px)`, 주 버튼에만. Tilt `perspective(1000px)`, 나가면 200ms로 복귀.
- 토스트(개편 설계서 5장): 화면 아래 가운데, 4초 뒤 사라진다, `role="status"`, 마우스를 올리거나 포커스가 있으면 멈춘다.
- 세션 1회 기록은 `sessionStorage`. 그 밖의 상태는 저장하지 않는다.
- 화면 함수의 입력은 `ctx`뿐이다. 같은 모양은 공용으로 올린다.
- 커밋은 Task 경로만 고른다. push는 사용자가 요청할 때만. 저장소 파일에 모델 식별자·개인정보를 쓰지 않는다. 커밋 메시지에 작성자 표기 줄을 넣지 않는다.
- e2e·시각 테스트 전에 `NODE_PATH`를 `npm root -g` 출력으로 맞춘다(`docs/CHECKPOINT.md` 5.2).

## 범위 판정 (실행 전에 정한 것)

- **Tilt는 함수와 단위 테스트까지만.** 대상(퀘스트 카드 2°, 월드 카드 4°)이 M3·M4에서 생긴다. 그때 `tilt(el, 2)`, `tilt(el, 4)`로 붙인다.
- **Magnetic은 본문(`main`) 안의 모든 `.btn-primary`.** DESIGN.md Buttons가 "주 버튼에만"이고, 한 화면에 주 버튼은 하나다.
- **Stagger는 홈 구역(`data-reveal`) 첫 표시, 세션에 한 번.** DESIGN.md Motion 표의 자리 그대로. 서랍 목록 Stagger는 M2.
- **Reveal은 Day 본문의 섹션 제목(`h2[id]`)에만.** 개편 설계서 6.3 "Day 섹션 제목". 홈 월드 카드·그림 틀은 M4·M12에서 붙인다.
- **Shake 대상은 홈 학습 경로의 잠긴 프로젝트 카드.** 지금 화면에서 "잠긴 월드 카드"(DESIGN.md Shake 자리)에 해당한다. 누르면 이동하지 않고 흔들리며, 이유 문장을 토스트로 알린다. 잠긴 Day·"Day 완료" 조건 미충족·복원 실패의 Shake는 각 화면을 고치는 M2·M10·M6에서 붙인다. 주소로 직접 들어오면 지금처럼 잠금 화면이 나온다.
- **토스트 모양은 임시.** DESIGN.md "아직 정하지 않은 것"에 업적 토스트 모양이 있다(M8에서 정한다). M1은 기존 `.card` 토큰(바탕 `card`, 2px `rule` 테두리, `--radius-card`, 턱 `--ledge`)만 써서 틀을 만들고 새 값을 만들지 않는다. 토스트 기준 이미지는 M8 승인 뒤에 만든다.
- **세션 기록 키:** `wzh:v1:motion:<이름>`(진도 키 `wzh:v1:progress`와 같은 규칙).
- **화면 전환 래퍼(Shared Element)는 M11.** 스펙 5장 표는 `motion.js`의 책임에 넣었지만 11.2 M1 내용과 완료 기준에는 없고, M11 "화면 전환(Shared Element)"에 있다.

## Review Focus

1. **터치·펜 포인터:** 휴대폰(375px, 터치)에서 주 버튼이 끌리거나 카드가 기울면 안 된다. → Task 2 e2e `touch context never pulls the primary button`.
2. **화면을 옮긴 뒤 남은 리스너:** 홈에서 다른 화면으로 가면 Magnetic의 `pointermove`와 Reveal 관찰자가 떨어져야 한다. → Task 1 단위 `magnetic dispose removes the listener it added`, Task 2 e2e `leaving home detaches magnetic from the old button`.
3. **`sessionStorage`를 쓸 수 없는 브라우저:** 예외 없이 매번 처음처럼 동작한다. → Task 1 단위 `onceInSession treats a throwing storage as first time`.
4. **잠긴 카드를 연달아 누름:** 흔들림은 처음부터 다시 돌고, 토스트는 3개를 넘게 쌓이지 않는다. 키보드 Enter도 같다. → Task 3 e2e `locked card: rapid clicks keep at most three toasts`, `locked card responds to Enter`.
5. **인쇄와 Reveal 전 상태:** 스크롤하지 않은 Day를 인쇄해도 섹션 제목이 보인다. → Task 2 e2e `print shows headings that have not been revealed yet`.

---

### Task 1: `motion.js` 핵심

**Files:**
- Create: `textbook/src/app/motion.js`
- Test: `tests/unit/motion.test.mjs`

**Interfaces:**
- Consumes: 없음.
- Produces (모두 `textbook/src/app/motion.js`의 named export):
  - 상수 `STAGGER_STEP = 40`, `STAGGER_MAX = 8`, `ENTER_MS = 280`, `SHAKE_MS = 300`, `PULL = 6`, `REACH = 32`, `EASE_OUT = 'cubic-bezier(0.2, 0.8, 0.2, 1)'`
  - `motionEnv(win = globalThis) → { reduce: boolean, fine: boolean }`
  - `staggerDelays(count: number) → number[]`
  - `magneticOffset({ dx, dy, width, height }) → { x: number, y: number, inside: boolean }`
  - `tiltAngles({ px, py }, maxDeg: number) → { rx: number, ry: number }`
  - `onceInSession(name: string, storage = globalThis.sessionStorage) → boolean`
  - `stagger(els: Iterable<Element>, env = motionEnv()) → Animation[]`
  - `shake(el: Element, env = motionEnv()) → Animation | null`
  - `reveal(els: Iterable<Element>, env = motionEnv(), IO = globalThis.IntersectionObserver) → () => void`
  - `magnetic(el: HTMLElement, env = motionEnv(), doc = el.ownerDocument) → () => void`
  - `tilt(el: HTMLElement, maxDeg: number, env = motionEnv()) → () => void`
  - CSS 클래스 이름: `reveal-pending`(Reveal 전), `is-pulling`(Magnetic이 끄는 중)

- [ ] **Step 1: 실패하는 단위 테스트를 쓴다** (`tests/unit/motion.test.mjs`, `import … from '../../textbook/src/app/motion.js'`)

DOM이 없는 Node에서 돈다. 요소는 `{ animate(kf, opt) { calls.push([kf, opt]); return { kf, opt }; }, classList: { add(){}, remove(){} } }` 같은 가짜로 만든다.

```js
test('motionEnv: matchMedia가 없으면 움직이지 않는다', () => {
  assert.deepEqual(motionEnv({}), { reduce: true, fine: false });
});
test('motionEnv reads reduce and fine pointer queries', () => {
  const win = { matchMedia: (q) => ({ matches: q.includes('reduce') ? false : true }) };
  assert.deepEqual(motionEnv(win), { reduce: false, fine: true });
});
test('staggerDelays caps at eight, 40ms apart', () => {
  assert.deepEqual(staggerDelays(3), [0, 40, 80]);
  assert.deepEqual(staggerDelays(20), [0, 40, 80, 120, 160, 200, 240, 280]);
  assert.deepEqual(staggerDelays(0), []);
});
test('magneticOffset pulls at most 6px inside the 32px reach', () => {
  const box = { width: 100, height: 48 };
  assert.deepEqual(magneticOffset({ dx: 0, dy: 0, ...box }), { x: 0, y: 0, inside: true });
  const edge = magneticOffset({ dx: 81.9, dy: 0, ...box }); // 50 + 32 바로 안
  assert.equal(edge.inside, true);
  assert.ok(edge.x > 5.9 && edge.x <= 6);
  assert.deepEqual(magneticOffset({ dx: 82, dy: 0, ...box }), { x: 0, y: 0, inside: false });
  assert.deepEqual(magneticOffset({ dx: 0, dy: 57, ...box }), { x: 0, y: 0, inside: false }); // 24 + 32 넘음
});
test('tiltAngles maps the pointer to ±maxDeg', () => {
  assert.deepEqual(tiltAngles({ px: 0.5, py: -0.5 }, 4), { rx: 4, ry: 4 });
  assert.deepEqual(tiltAngles({ px: 0, py: 0 }, 2), { rx: 0, ry: 0 });
});
test('onceInSession is true only the first time', () => {
  const store = new Map();
  const storage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
  assert.equal(onceInSession('home', storage), true);
  assert.equal(onceInSession('home', storage), false);
  assert.equal(store.has('wzh:v1:motion:home'), true);
});
test('onceInSession treats a throwing storage as first time', () => {
  const storage = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); } };
  assert.equal(onceInSession('home', storage), true);
  assert.equal(onceInSession('home', undefined), true);
});
test('stagger animates the first eight with the DESIGN.md values', () => {
  const els = Array.from({ length: 10 }, fakeEl);
  const runs = stagger(els, { reduce: false, fine: true });
  assert.equal(runs.length, 8);
  assert.deepEqual(els[2].calls[0][0], [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }]);
  assert.deepEqual(els[2].calls[0][1], { duration: 280, delay: 80, easing: EASE_OUT, fill: 'backwards' });
  assert.equal(els[9].calls.length, 0);
});
test('reduced motion: stagger, shake, reveal, magnetic and tilt do nothing', () => {
  const env = { reduce: true, fine: true };
  const el = fakeEl();
  assert.deepEqual(stagger([el], env), []);
  assert.equal(shake(el, env), null);
  let observed = 0;
  const IO = class { observe() { observed++; } disconnect() {} };
  reveal([el], env, IO)();
  assert.equal(observed, 0);
  assert.equal(el.added.length, 0, 'Reveal 전 클래스를 붙이지 않는다');
  const doc = fakeDoc();
  magnetic(el, env, doc)();
  tilt(el, 4, env)();
  assert.equal(doc.listeners.length, 0);
  assert.equal(el.calls.length, 0);
});
test('shake: 300ms, 4px left and right four times', () => {
  const el = fakeEl();
  shake(el, { reduce: false, fine: false });
  const [kf, opt] = el.calls[0];
  assert.deepEqual(kf.map((k) => k.transform), ['none', 'translateX(-4px)', 'translateX(4px)', 'translateX(-4px)', 'translateX(4px)', 'none']);
  assert.equal(opt.duration, 300);
});
test('reveal without IntersectionObserver leaves content visible', () => {
  const el = fakeEl();
  reveal([el], { reduce: false, fine: true }, undefined)();
  assert.equal(el.added.length, 0);
});
test('reveal marks pending and dispose disconnects', () => {
  const el = fakeEl();
  let disconnected = false;
  const IO = class { constructor(cb) { this.cb = cb; } observe() {} unobserve() {} disconnect() { disconnected = true; } };
  const dispose = reveal([el], { reduce: false, fine: true }, IO);
  assert.deepEqual(el.added, ['reveal-pending']);
  dispose();
  assert.equal(disconnected, true);
});
test('magnetic needs a fine pointer', () => {
  const doc = fakeDoc();
  magnetic(fakeEl(), { reduce: false, fine: false }, doc);
  assert.equal(doc.listeners.length, 0);
});
test('magnetic dispose removes the listener it added', () => {
  const doc = fakeDoc();
  const dispose = magnetic(fakeEl(), { reduce: false, fine: true }, doc);
  assert.equal(doc.listeners.length, 1);
  dispose();
  assert.equal(doc.listeners.length, 0);
});
```

`fakeEl()`은 `calls`(animate 기록), `added`(classList.add 기록), `style.setProperty`, `getBoundingClientRect`, `addEventListener`/`removeEventListener`를 가진다. `fakeDoc()`은 `addEventListener`/`removeEventListener`로 `listeners` 배열을 늘리고 줄인다.

- [ ] **Step 2: 실패를 확인한다**

Run: `cd textbook && node --test ../tests/unit/motion.test.mjs`
Expected: FAIL — `Cannot find module …/motion.js`

- [ ] **Step 3: `textbook/src/app/motion.js`를 쓴다**

- 가져올 때(import) `window`·`document`를 건드리지 않는다(단위 테스트가 Node에서 돈다).
- `motionEnv`: `win.matchMedia`가 함수가 아니면 `{ reduce: true, fine: false }`. 있으면 `reduce = matchMedia('(prefers-reduced-motion: reduce)').matches`, `fine = matchMedia('(hover: hover) and (pointer: fine)').matches`.
- `magneticOffset`: `rx = width / 2 + REACH`, `ry = height / 2 + REACH`; `inside = |dx| < rx && |dy| < ry`; 안이면 `x = round2(dx / rx * PULL)`, `y = round2(dy / ry * PULL)`, 밖이면 0. (시안 `prototype/src/app.js` 412~437행과 같은 식)
- `tiltAngles`: `rx = round2(-py * 2 * maxDeg)`, `ry = round2(px * 2 * maxDeg)`. `-0`이 나오지 않게 `+ 0`으로 정리한다.
- `onceInSession`: 키 `wzh:v1:motion:${name}`. `getItem`이 값을 주면 `false`. 아니면 `setItem(key, '1')` 후 `true`. 예외나 `storage` 없음은 `true`.
- `stagger`: `env.reduce`이면 `[]`. 앞 8개 중 `animate`가 함수인 요소만 Step 1의 키프레임·옵션으로 돌린다.
- `shake`: `env.reduce`이거나 `animate`가 없으면 `null`. 같은 요소에 돌고 있는 흔들림은 `getAnimations?.()`에서 `id === 'shake'`인 것을 `cancel()`하고 새로 시작한다(`id: 'shake'`, `easing: EASE_OUT`).
- `reveal`: `env.reduce`이거나 `IO`가 없으면 아무것도 하지 않는 함수를 돌려준다. 아니면 각 요소에 `reveal-pending`을 붙이고 `new IO(cb, { threshold: 0.1 })`로 관찰한다. 보이면 `reveal-pending`을 떼고 Stagger와 같은 키프레임을 `delay: 0`으로 한 번 돌린 뒤 `unobserve`. 돌려주는 함수는 `disconnect()`.
- `magnetic`: `env.reduce || !env.fine`이면 빈 함수. 아니면 `doc`에 `pointermove` 하나를 붙인다. `pointerType !== 'mouse'`이면 무시. `requestAnimationFrame`으로 묶어 `magneticOffset` 결과를 `--mx`·`--my`(`'1.23px'` 꼴)와 `is-pulling` 클래스로 반영한다. 돌려주는 함수는 리스너를 떼고 rAF를 취소하고 `--mx`·`--my`를 `0px`로 되돌린다.
- `tilt`: `env.reduce || !env.fine`이면 빈 함수. 요소의 `pointermove`(mouse만)에서 `tiltAngles`로 `transform = perspective(1000px) rotateX(rx deg) rotateY(ry deg)`, `pointerleave`에서 `transform = ''`. 복귀 200ms는 CSS 전환(`--dur-short`)이 맡는다. 돌려주는 함수는 두 리스너를 뗀다.

- [ ] **Step 4: 통과를 확인한다**

Run: `cd textbook && node --test ../tests/unit/motion.test.mjs`
Expected: PASS, 14개 통과

- [ ] **Step 5: 전체 단위·빌드 테스트**

Run: `cd textbook && npm test`
Expected: `# fail 0` (기존 201 + 14 = 215)

- [ ] **Step 6: 커밋**

```bash
git add textbook/src/app/motion.js tests/unit/motion.test.mjs
git commit -m "feat(motion): reveal, stagger, tilt, magnetic, shake and once-per-session helpers"
```

---

### Task 2: 화면에 연결 — Magnetic, 홈 Stagger, Day Reveal, 동작 줄이기 CSS

**Files:**
- Modify: `textbook/src/app/main.js` (`ctx`에 `onCleanup`, `render`에서 정리와 Magnetic 연결)
- Modify: `textbook/src/app/views/home.js` (홈 구역에 `data-reveal`, 세션 첫 표시에 `stagger`)
- Modify: `textbook/src/app/views/day.js` (본문 `h2[id]`에 `reveal`)
- Modify: `textbook/src/styles/components.css` (`.btn-primary`의 `translate`·`is-pulling`, `.reveal-pending`, 동작 줄이기 블록)
- Modify: `textbook/src/styles/print.css` (`.reveal-pending` 보이기)
- Test: `tests/e2e/motion.test.mjs` (새 파일)

**Interfaces:**
- Consumes: Task 1의 `motionEnv`, `magnetic`, `stagger`, `reveal`, `onceInSession`, 클래스 `reveal-pending`·`is-pulling`.
- Produces: `ctx.onCleanup(fn: () => void)` — 지금 화면을 떠날 때(다음 `render` 시작) 한 번 부른다. `data-reveal` 속성 — 홈에서 Stagger할 구역 표시. e2e 도우미 `withPage(fn, { reducedMotion, hasTouch, viewport, clock })`(이 파일 안).

- [ ] **Step 1: e2e 틀과 실패하는 테스트를 쓴다** (`tests/e2e/motion.test.mjs`)

`tests/e2e/layout.test.mjs`처럼 `before`에서 픽스처(`tests/fixtures/content`)를 빌드해 `startStaticServer`로 띄운다. `withPage`는 `browser.newContext({ viewport, reducedMotion, hasTouch, isMobile: hasTouch, locale: 'ko-KR' })`를 쓰고, 끝에서 `collectConsoleErrors`가 비어 있는지 본다. 기본 `viewport`는 1280×800, 기본 `reducedMotion`은 `'no-preference'`.

테스트(이름과 확인할 것):
- `primary button follows the mouse within 6px`: 홈(`#/`)의 주 버튼(`[data-testid="continue-button"]`, 진도 0이면 글자는 "첫 Day 시작하기") 상자를 재고, 마우스를 오른쪽 끝에서 16px 밖(`right + 16`, 세로 가운데)으로 옮긴다. `eventually`로 `--mx`가 `0 < 값 ≤ 6`이고 클래스 `is-pulling`이 있다. 화면 왼쪽 위 구석(5, 795)으로 옮기면 `--mx`가 `0px`.
- `reduced motion: primary button stays put`: `reducedMotion: 'reduce'`로 같은 동작 → `--mx`가 비었거나 `0px`. 버튼에 마우스를 올린 뒤 `getComputedStyle(btn).transform`이 `none`(떠오름 없음)이고 `translate`가 `none`.
- `touch context never pulls the primary button`: `viewport 375×812`, `hasTouch: true` → 버튼 근처로 `page.mouse.move` 해도 `--mx`가 비었거나 `0px`.
- `leaving home detaches magnetic from the old button`: 홈에서 버튼 요소 핸들을 잡고 `#/settings`로 이동한 뒤 마우스를 옛 버튼 자리 근처로 옮긴다 → 옛 요소의 `--mx`가 `0px`, 콘솔 오류 0.
- `home sections stagger once per session`: 홈을 처음 열면 `[data-reveal]` 요소 중 하나 이상이 `getAnimations().length > 0`. `#/settings`로 갔다가 `#/`로 돌아오면 모든 `[data-reveal]`의 `getAnimations().length === 0`.
- `reduced motion: no stagger and no reveal`: `reducedMotion: 'reduce'`로 홈 → 애니메이션 0. Day(`#/day/fa-d01`) → `.reveal-pending` 요소 0개.
- `day headings reveal when scrolled into view`: 높이 400px 창으로 Day(`#/day/fa-d01`, 섹션 제목 7개)를 연다 → 맨 아래 `h2[id]`가 `reveal-pending`을 가진다(창 밖인지 먼저 `boundingBox`로 확인한다). `scrollIntoView` 뒤 `eventually`로 클래스가 빠진다.
- `print shows headings that have not been revealed yet`: 높이 400px로 Day를 열고 `page.emulateMedia({ media: 'print' })` → 맨 아래 `h2[id]`의 계산된 `opacity`가 `'1'`.

- [ ] **Step 2: 실패를 확인한다**

Run: `cd textbook && node --test ../tests/e2e/motion.test.mjs`
Expected: FAIL — `--mx`가 비어 있음(Magnetic 없음), `[data-reveal]` 없음, `.reveal-pending` 없음 등. `print …`과 `reduced motion …`, `touch …`는 지금도 통과할 수 있다(기능이 없어서). 이 셋은 Step 4에서 기능을 넣은 뒤에도 통과하는지로 본다.

- [ ] **Step 3: 연결을 구현한다**

- `main.js`: `let cleanups = []`. `ctx.onCleanup(fn)`은 `cleanups.push(fn)`. `render` 맨 앞에서 `cleanups.splice(0).forEach((fn) => fn())`(하나가 던져도 나머지를 부르도록 `try`로 감싼다). 화면 함수를 부른 뒤 `const env = motionEnv(); main.querySelectorAll('.btn-primary').forEach((el) => ctx.onCleanup(magnetic(el, env)))`.
- `home.js`: 바깥 `div.home`의 직계 구역(`notice` 줄, `hero`, `progress-grid`, `path`, `appendix`)에 `data-reveal` 속성을 단다. `root.append(...)` 뒤 `if (onceInSession('home')) stagger(root.querySelectorAll('[data-reveal]'))`.
- `day.js`: 본문을 붙인 뒤 `ctx.onCleanup(reveal(body.querySelectorAll('h2[id]')))`(`body`는 `lesson-body`).
- `components.css`:
  - `.btn-primary`에 `translate: var(--mx, 0px) var(--my, 0px);`를 더하고, `transition`에 `translate var(--dur-short) var(--ease-out)`을 더한다.
  - `.btn-primary.is-pulling { transition: background-color var(--dur-micro) var(--ease-out), transform var(--dur-short) var(--ease-bounce), box-shadow var(--dur-short) var(--ease-bounce); }` — 끄는 동안 `translate`는 바로 따라간다(시안 207행).
  - `.reveal-pending { opacity: 0; transform: translateY(8px); }`
  - `@media (prefers-reduced-motion: reduce) { .btn-primary { translate: none; } .btn-primary:hover { transform: none; box-shadow: 0 var(--ledge) 0 var(--color-accent-deep); } .reveal-pending { opacity: 1; transform: none; } }` — DESIGN.md Motion "주 버튼의 끌림과 hover 떠오름을 없앤다". 누름(`:active`)은 그대로 둔다.
- `print.css`: `.reveal-pending { opacity: 1 !important; transform: none !important; }`

- [ ] **Step 4: 통과를 확인한다**

Run: `cd textbook && node --test ../tests/e2e/motion.test.mjs`
Expected: PASS, 8개 통과. 헤드리스 Chromium에서 `(hover: hover) and (pointer: fine)`이 거짓이라 첫 테스트가 실패하면 원인을 재서 판정으로 남긴다(테스트를 약하게 고치지 않는다).

- [ ] **Step 5: 기존 테스트와 시각 비교**

Run: `cd textbook && npm test && npm run test:e2e && npm run test:visual`
Expected: 모두 `# fail 0`. 시각 테스트는 동작 줄이기로 찍으므로 기준 이미지가 바뀌지 않아야 한다(26/26). 바뀌면 원인을 찾는다(기준 이미지를 갱신하지 않는다).

- [ ] **Step 6: 커밋**

```bash
git add textbook/src/app/main.js textbook/src/app/views/home.js textbook/src/app/views/day.js textbook/src/styles/components.css textbook/src/styles/print.css tests/e2e/motion.test.mjs
git commit -m "feat(motion): magnetic primary button, home stagger once per session, day heading reveal"
```

---

### Task 3: 토스트 틀과 잠긴 프로젝트 카드 Shake

**Files:**
- Create: `textbook/src/app/views/toast.js`
- Modify: `textbook/src/app/views/home.js` (`projectCard`의 잠긴 카드)
- Modify: `textbook/src/styles/components.css` (토스트)
- Modify: `textbook/src/styles/print.css` (토스트 숨김)
- Test: `tests/e2e/motion.test.mjs` (테스트 추가)

**Interfaces:**
- Consumes: Task 1의 `shake`, `motionEnv`. Task 2의 `withPage`.
- Produces: `showToast(text: string, { duration = TOAST_MS, doc = document } = {}) → HTMLElement` (`views/toast.js`). 영역 `div.toast-region[data-testid="toast-region"][role="status"][aria-live="polite"]`(문서에 하나), 항목 `p.toast[data-testid="toast"]`. 상수 `TOAST_MS = 4000`, `TOAST_MAX = 3`, `TOAST_EXIT_MS = 180`(DESIGN.md `--dur-exit`과 같은 값). M11 업적 토스트가 이 함수를 쓴다.

- [ ] **Step 1: 실패하는 e2e를 더한다** (`tests/e2e/motion.test.mjs`)

픽스처 홈에서 `fb` 프로젝트는 `fa`를 끝내야 열리므로 잠겨 있다. 카드 선택자: `.path-item[data-project="fb"] .path-card`.

- `locked card shakes and explains instead of opening`: 카드를 누른다 → `location.hash`가 `#/` 그대로. 카드의 `getAnimations().length > 0`. `[data-testid="toast"]` 하나가 보이고 글자가 `/끝내면 열려요/`. 영역의 `role`이 `status`. 카드의 `aria-disabled`가 `"true"`.
- `reduced motion: locked card does not shake but still explains`: `reducedMotion: 'reduce'` → 애니메이션 0, 토스트 글자는 같다.
- `locked card responds to Enter`: 카드에 포커스를 두고 `Enter` → 주소 그대로, 토스트가 뜬다.
- `locked card: rapid clicks keep at most three toasts`: 다섯 번 누른다 → `[data-testid="toast"]` 개수 ≤ 3.
- `toast hides after four seconds and pauses on hover`: 페이지를 열기 전에 `context.clock.install()`. 카드를 눌러 토스트를 띄우고 `page.clock.runFor(3000)` → 보인다. 토스트에 마우스를 올리고 `runFor(5000)` → 아직 보인다. 마우스를 치우고 `runFor(4000)` → 토스트 0개.
- `unlocked card still opens its project`: `fa` 카드를 누르면 주소가 `#/project/fa`.
- `toast survives moving to another screen`: 토스트를 띄우고 `#/settings`로 가도 토스트가 그대로 있다(영역이 `main` 밖).

- [ ] **Step 2: 실패를 확인한다**

Run: `cd textbook && node --test ../tests/e2e/motion.test.mjs`
Expected: FAIL — 잠긴 카드를 누르면 `#/project/fb`로 이동하고 토스트가 없다. `unlocked card still opens its project`는 지금도 통과한다(바뀌면 안 되는 동작의 확인).

- [ ] **Step 3: `views/toast.js`와 잠긴 카드를 구현한다**

- `showToast`: 영역이 없으면 `doc.body`에 만든다. 항목 `p.toast`를 더하고, 항목이 `TOAST_MAX`를 넘으면 가장 오래된 것부터 지운다. 남은 시간 타이머(`setTimeout`)를 두고, 영역에 `pointerenter`·`focusin`이면 멈추고(남은 시간 저장) `pointerleave`·`focusout`이면 다시 시작한다. 시간이 다 되면 `motionEnv().reduce`가 아니면 투명도 1→0을 `TOAST_EXIT_MS`(`--ease-in`과 같은 `cubic-bezier(0.4, 0, 1, 1)`)로 돌린 뒤 지우고, 동작 줄이기이면 바로 지운다. 만든 항목을 돌려준다.
- `home.js` `projectCard`: `state === 'locked'`이면 카드 `<a>`에 `aria-disabled="true"`를 달고 `click` 처리기를 붙인다. 보조 키(`ctrlKey`·`metaKey`·`shiftKey`·`altKey`)나 `button !== 0`이면 그대로 둔다. 아니면 `preventDefault()` → `shake(li 또는 a)` → `showToast(note)`(`note`는 이미 계산한 `‘…’ 프로젝트를 끝내면 열려요.` 문장). `href`는 남겨 둔다(JS가 꺼져도, 새 탭으로 열어도 잠금 화면으로 간다).
- `components.css` 토스트(기존 토큰만):
  - `.toast-region { position: fixed; left: 50%; bottom: var(--space-lg); translate: -50% 0; z-index: var(--z-modal); display: grid; gap: var(--space-xs); justify-items: center; width: max-content; max-width: calc(100% - var(--space-xl)); pointer-events: none; }`
  - `.toast { pointer-events: auto; margin: 0; padding: var(--space-sm) var(--space-md); background: var(--color-card); color: var(--color-ink); border: 2px solid var(--color-rule); border-radius: var(--radius-card); box-shadow: 0 var(--ledge) 0 var(--color-rule); font-size: var(--text-ui); animation: toast-in var(--dur-enter) var(--ease-out); }`
  - `@keyframes toast-in { from { opacity: 0; transform: translateY(8px); } }`
  - `.toast-region:empty { display: none; }`
  - 쓰는 토큰이 `tokens.css`에 없으면(예: `--text-ui`) 멈추고 실제 이름을 `grep`으로 찾아 쓴다. 새 값을 만들지 않는다.
- `print.css`: `.toast-region { display: none !important; }`

- [ ] **Step 4: 통과를 확인한다**

Run: `cd textbook && node --test ../tests/e2e/motion.test.mjs`
Expected: PASS, 15개 통과

- [ ] **Step 5: 기존 테스트, 토큰 검사, 시각 비교**

Run: `cd textbook && npm test && npm run check -- --allow-missing && npm run test:e2e && npm run test:visual`
Expected: 모두 통과. `npm test`의 토큰 검사(`tests/unit/styles.test.mjs`)가 토스트 CSS를 통과한다. 시각 26/26(토스트는 기준 장면에 나오지 않는다).

- [ ] **Step 6: 토스트 모양을 눈으로 확인한다**

`withPage`와 같은 조건으로 잠긴 카드를 눌러 토스트가 뜬 화면을 375·768·1280 × 라이트·다크로 찍어 작업 공간(`.superpowers/sdd/<plan>/`)에 저장한다. 토스트가 화면 아래 가운데에 있고, 375px에서 가로 스크롤이 없고, 다크에서 바탕·글자가 토큰대로 바뀌는지 본다. 기준 이미지는 만들지 않는다(M8에서 모양 확정 뒤).

- [ ] **Step 7: 커밋**

```bash
git add textbook/src/app/views/toast.js textbook/src/app/views/home.js textbook/src/styles/components.css textbook/src/styles/print.css tests/e2e/motion.test.mjs
git commit -m "feat(toast): status toast frame; locked project card shakes and explains"
```

---

### Task 4: 마무리 — 문서, 루트 빌드, 전체 검증

**Files:**
- Modify: `CLAUDE.md` (코드 위치: `motion.js`, `views/toast.js`)
- Modify: `docs/CHECKPOINT.md` (현재 위치: M1 완료, 다음 M2. 기준선 숫자)
- Modify: `docs/checkpoint/workspace/progress.md` (`- M1: complete …` 한 줄)
- Modify: `index.html` (저장소 루트, `node build.mjs --published --allow-missing`로 다시 빌드)

**Interfaces:**
- Consumes: Task 1~3 전부.
- Produces: 없음.

- [ ] **Step 1: 루트 `index.html`을 다시 빌드한다**

Run: `cd textbook && node build.mjs --published --allow-missing`
Expected: 빌드 성공. `git diff --stat ../index.html`에 변경이 있다.

- [ ] **Step 2: 문서를 고친다**

- `CLAUDE.md` 코드 위치의 앱 줄에 `motion.js`(모션 도우미)와 `views/toast.js`(토스트)를 더한다.
- `docs/CHECKPOINT.md` 머리말: "M1 완료, 다음은 M2". 기준선 숫자를 Step 3 결과로 고친다.
- `progress.md`: `- M1: complete (commits <첫 커밋>..<이 커밋>; 단위·빌드 N, e2e N, 시각 N; 계획서 docs/superpowers/plans/2026-11-12-m1-motion-toast.md)`.

- [ ] **Step 3: 공통 완료 조건을 돌린다**

Run: `cd textbook && npm test && npm run check -- --allow-missing && npm run test:e2e && npm run test:visual`
Expected: 모두 통과. 각 출력의 통과 수를 보고에 넣는다.

- [ ] **Step 4: 완료 기준을 눈으로 확인한다**

로컬 서버로 루트 `index.html`을 띄우고(`tests/helpers/static-server.mjs`), 1280px에서:
- ① 마우스를 홈 주 버튼(진도 0이면 "첫 Day 시작하기", 진도가 있으면 "이어서 하기") 옆으로 가져가 끌리는 순간을 찍는다.
- ② 잠긴 프로젝트 카드를 누른 직후(흔들림 중)와 토스트를 찍는다.
- ③ `reducedMotion: 'reduce'`로 같은 조작을 해 끌림·흔들림이 없고 토스트는 뜨는 것을 찍는다.

스크린샷을 사용자에게 보낸다. Safari·Firefox·실기기·화면 낭독기는 "확인하지 못함"으로 적는다.

- [ ] **Step 5: 커밋**

```bash
git add CLAUDE.md docs/CHECKPOINT.md docs/checkpoint/workspace/progress.md index.html
git commit -m "docs: M1 complete — motion helpers and toast frame"
```
