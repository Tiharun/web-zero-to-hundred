# M11 보상과 연결 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> 이 프로젝트는 Native 방식이다(통합 로드맵 10장). `executing-plans`로 이 세션이 끝까지 하고, 서브에이전트·자식 세션을 쓰지 않는다. 최종 리뷰도 직접 한다.

**Goal:** Day를 완료하는 순간의 보상(업적 토스트, 레벨업·월드 클리어 Modal, 축하 조각)과 화면 사이의 연결(용어 미리보기 서랍, Shared Element 화면 전환)을 넣는다. 완료 기준은 로드맵 M11의 ①~③이고, M1·M8에서 넘긴 일도 함께 끝낸다.

**Architecture:**
- 보상 사건은 새 로직 모듈 `src/app/reward.js`가 완료 전후의 `prog`를 비교해 계산한다(순수 함수, DOM 없음, 로드맵 6장 5번).
- 화면 쪽은 두 공용 부품이다. `views/rewardmodal.js`(레벨업·월드 클리어 `<dialog>` 하나)와 `views/termdrawer.js`(오른쪽 용어 서랍 `<dialog>` 하나). 열고 닫기는 기존 `views/overlay.js`를 쓴다.
- `day.js`의 `complete()`가 사건을 받아 Modal → 토스트 순서로 보여 준다.
- 화면 전환은 `motion.js`의 `sharedTransition()` 래퍼다. `main.js`가 hashchange 렌더를 이것으로 감싼다. 짝이 되는 요소(`data-vt`)가 양쪽 화면에 있을 때만 `document.startViewTransition`을 쓴다.

**Tech Stack:** 바닐라 JS(ESM), esbuild 0.28.2, `node:test`, 전역 Playwright 1.63.0 + Chromium, pixelmatch 8.0.0.

**Spec:**
- 기준은 `docs/superpowers/specs/2026-11-12-unified-roadmap-design.md` 11장 M11 행이다(M1·M8 넘김 메모 포함). 6장 5번(보상 사건), 8장(보상 사건 계산 단위 테스트)도 따른다.
- 세부 기준은 개편 설계서 `2026-11-11-textbook-redesign-design.md`의 5.1(용어 미리보기 Drawer), 5.2(축하 Modal은 사건마다 한 번), 5.5(업적 토스트, 레벨업 Modal), 6.3(Shared Element 행), 6.4(기능 감지), 8장(보상 순간에만 축하, 한 번), 9장(저장소 불가여도 축하는 메모리 진도로 동작)이다.
- 시각 값의 유일한 기준은 `DESIGN.md`다. 레벨업 Modal은 "Day 부품"의 항목을 따른다. 월드 클리어 Modal, 용어 서랍, 화면 전환은 DESIGN.md에 없으므로 Task 1에서 문안을 넣는다.

## Global Constraints

- **토큰:** 색·글꼴·크기·간격·모서리·턱·모션 값은 DESIGN.md 토큰(`var(--…)`)으로만 쓴다. 토큰 밖 `#hex`·`rgb(`·`font-family`는 빌드가 막는다.
- **새 값:** Task 1의 DESIGN.md 문안이 수정안이다. **이 계획을 승인하면 그 문안도 승인한 것**으로 본다. 새 토큰은 없다(28rem·24rem은 이미 확인 Modal·토스트·레벨업 Modal이 쓰는 값). 그 밖의 새 값이 필요해지면 멈추고 묻는다.
- **One Pink:** 보상 Modal의 분홍 면은 "계속하기" 주 버튼 하나다. Modal이 열려 있는 동안 뒤 화면은 inert라 한 층에 주 버튼 하나다.
- **Real Progress·지어낸 수치 금지:** Modal·토스트의 숫자(LV, XP, 남은 XP)는 모두 `level.js`로 `prog`에서 계산한다.
- **게임 어휘:** "레벨 업", "월드 클리어", "업적", "보상", "XP"는 라벨·진행 표시에만 쓴다. 용어 정의 본문은 바꾸지 않는다.
- **The Game Frame Rule:** 새 부품마다 게임 신호를 하나 이상 단다. 보상 Modal은 `edge` 턱과 LV 배지·엠블럼 배지, 용어 서랍은 책 도트, 업적 토스트는 트로피 도트다.
- **The Fluid Rule:** 320px부터 가로 스크롤은 0이다. 브레이크포인트는 DESIGN.md 표의 값(`40rem`, `64rem`, `80rem`)만 쓴다.
- **동작 줄이기:** 화면 전환·축하 조각은 건너뛰고 Modal·서랍은 바로 열고 닫는다. 정보와 기능은 모두 남는다.
- **파일과 이름:** 결과는 파일 하나이고 외부 요청은 0건이다. 이름·주소는 `curriculum.json`에서만 가져온다.
- **기록 금지:** 저장소 파일에 모델 식별자·개인정보·로컬 사용자 경로를 쓰지 않는다.
- **커밋:** 커밋·push는 사용자가 요청할 때만 한다. 아래 "Commit" 단계는 실행 세션을 시작할 때 사용자에게 한 번 확인하고 따른다. 커밋마다 CLAUDE.md 8장의 비밀값 grep을 먼저 돌린다.
- **미루지 않기:** 찾은 작은 문제는 이 마일스톤 안에서 고친다. 다른 마일스톤 화면이 있어야 하는 일만 로드맵 11장 해당 행에 `(M11에서 넘김: …)`으로 적는다.
- **기준 이미지:** 이 PC에서, 사용자 승인 뒤에만 `npm run test:visual:update`로 갱신한다.
- **브라우저 테스트:** 시작 전에 PowerShell에서 `$env:NODE_PATH = (npm root -g)`를 실행한다. Playwright는 `127.0.0.1` 정적 서버로 연다.
- **명령 위치:** 명령은 `textbook/`에서 실행한다(완성본 테스트는 저장소 루트).
- **기준선(M10 끝):** unit 302, e2e 218, visual 138(기준 이미지 136), check:site 4폭 각 168/0.

## 결정 기록 (계획 단계)

- **Modal 하나에 두 종류:** 레벨업과 월드 클리어는 같은 `<dialog id="reward-dialog">`를 내용만 바꿔 쓴다. 한 번의 완료에 둘이 같이 나면 **월드 클리어 하나만** 띄우고 그 안에 "LV n 달성" 줄을 넣는다. Modal을 연달아 두 번 띄우지 않기 위해서다.
- **"한 번":** 사건마다 세션에 한 번이다(DESIGN.md Motion "한 번만", 개편 설계서 5.2). 키는 `onceInSession`으로 레벨업 `levelup:<n>`, 월드 클리어 `celebrate:<월드 id>`다. 월드 클리어 키는 홈의 월드 클리어 축하 조각(`home.js`)과 같은 키라 Modal을 본 세션에서는 홈 축하가 다시 돌지 않는다. 같은 세션에서 완료를 취소했다 다시 해도 Modal은 다시 뜨지 않고 토스트만 뜬다.
- **토스트와 Modal의 순서:** Modal이 열리면 바깥은 inert이고 토스트는 백드롭 아래에 깔린다. 그래서 Modal이 있으면 **닫힌 뒤에** 토스트를 띄운다. 없으면 바로 띄운다.
- **완료 알림은 토스트 하나:** 지금 `complete()`의 `ctx.announce('Day n 완료했어요…')`를 토스트 문장으로 바꾼다(토스트 영역이 `role="status"`라 두 번 읽히지 않게).
- **백업 불러오기로 레벨이 올라도 Modal은 없다.** 보상 순간은 Day 완료뿐이다(개편 설계서 8장).
- **용어 서랍 범위:** `#main` 안의 `a.term`을 그냥 누른 클릭만 가로챈다. 수정 키·가운데 버튼, 용어 사전 페이지(`#/page/glossary`) 안의 링크, 용어 사전에 그 항목이 없는 링크는 지금처럼 이동한다. 서랍 안의 용어 링크는 서랍 안에서 그 용어로 바뀐다(기록은 늘리지 않는다).
- **용어 서랍 폭:** 사이드바 서랍의 280px는 정의 글에 좁아서 `min(28rem, calc(100% - var(--space-2xl)))`로 한다(확인 Modal과 같은 28rem). 1024px 이상에서도 열린다.
- **화면 전환 짝:** 키는 `sharedKey(새 경로, 옛 경로)`다. 새 경로가 Day면 `day-<id>`, 월드면 `world-<pid>`이고, 없으면 옛 경로로 같은 규칙을 적용한다(뒤로 가기 반대 방향). 옛 화면에 그 키의 요소가 없으면 전환 없이 바로 그린다. 화면 나머지는 애니메이션 없이 바뀌고(root 애니메이션 없음), 전환 중에도 클릭이 문서에 닿게 `::view-transition { pointer-events: none }`를 둔다[검색: bram.us 2025-01, WPT input-targets-root-while-render-blocked]. 짝이 없는 쪽 그림은 `:only-child`로 애니메이션을 끈다.
- **기능 감지:** `typeof document.startViewTransition === 'function'`(개편 설계서 6.4). 같은 `view-transition-name`이 동시에 둘이면 전환이 건너뛰어지므로[검색: MDN ViewTransition] 이름은 전환 직전에 한 요소에만 붙이고 `finished` 뒤에 뗀다.

## Review Focus

1. **완료 → Modal이 열린 채 뒤로 가기·사이드바 링크·Ctrl+K**
   - 기대: 화면이 바뀌면 Modal은 바로 닫히고(포커스 복귀 없음), 미뤄 둔 토스트는 새 화면에서 뜬다. Modal이 열려 있으면 Ctrl+K는 검색을 열지 않는다.
   - 확인: Task 3 e2e `reward modal closes on navigation and blocks ctrl+k`.
2. **완료 취소 → 다시 완료(같은 세션)**
   - 기대: 토스트는 매번 뜨고, 같은 레벨업·월드 클리어 Modal은 다시 뜨지 않는다.
   - 확인: Task 2 단위(`rewardModal`은 세션과 무관), Task 3 e2e `reward modal shows once per session`.
3. **저장소를 쓸 수 없을 때(localStorage·sessionStorage 차단)**
   - 기대: 메모리 진도로 Modal·토스트가 그대로 뜬다(`onceInSession`은 페이지 메모리로 대신한다).
   - 확인: Task 3 e2e `reward works without storage`.
4. **용어 서랍 안의 용어 링크, 없는 용어, 용어 사전 페이지**
   - 기대: 서랍 안 링크는 서랍 내용을 바꾸고, 항목이 없는 링크와 용어 사전 페이지의 링크는 지금처럼 이동한다. Ctrl+클릭도 이동이다.
   - 확인: Task 4 단위 `termSlug`, e2e `term link inside drawer swaps entry`, `glossary page links still navigate`.
5. **화면 전환 중 연속 클릭·미지원 브라우저·동작 줄이기**
   - 기대: 전환 중에도 다음 링크를 누를 수 있고, `startViewTransition`이 없거나 동작 줄이기면 전환 없이 같은 화면이 그려진다. 콘솔 오류 0.
   - 확인: Task 5 e2e `shared transition falls back`, `clicks pass through during transition`.

---

## 파일 구조

| 파일 | 책임 | Task |
|---|---|---|
| `DESIGN.md` | 보상 Modal·용어 서랍·업적 토스트·화면 전환 문안, Motion 표 | 1 |
| `textbook/src/app/reward.js` (신규) | `rewardEvents`, `rewardModal`, `rewardKey`, `rewardToast` | 2 |
| `tests/unit/reward.test.mjs` (신규) | 보상 사건 계산 | 2 |
| `textbook/src/template.html` | `#reward-dialog`, `#term-drawer` | 3, 4 |
| `textbook/src/app/views/rewardmodal.js` (신규) | `createRewardModal` | 3 |
| `textbook/src/app/views/hud.js` | `lvBadge(level)` 추출 | 3 |
| `textbook/src/app/views/toast.js` | `showToast(text, { icon })` | 3 |
| `textbook/src/app/views/day.js` | `complete()` 연결, `data-vt` | 3, 5 |
| `textbook/src/app/main.js` | 부품 생성, 화면 이동 때 닫기, 용어 클릭 위임, 전환 래퍼 | 3~5 |
| `textbook/src/app/views/shell.js` | Ctrl+K 막기(보상 Modal), 용어 서랍 닫고 검색 | 3, 4 |
| `textbook/src/app/views/termdrawer.js` (신규) | `termSlug`, `createTermDrawer` | 4 |
| `textbook/src/app/motion.js` | `sharedKey`, `sharedTransition` | 5 |
| `textbook/src/app/views/quest.js`, `worlds.js`, `project.js` | `data-vt` | 5 |
| `textbook/src/styles/shell.css` | `.reward`, `.term-drawer`, 화면 전환 | 3~5 |
| `textbook/src/styles/components.css` | `.toast.has-icon` | 3 |
| `textbook/src/styles/print.css` | 보상 Modal·용어 서랍 숨김 | 3, 4 |
| `tests/unit/motion.test.mjs`, `tests/unit/termdrawer.test.mjs` (신규) | 전환 래퍼, 용어 주소 | 4, 5 |
| `tests/e2e/reward.test.mjs` (신규) | 보상·서랍·전환 동작 | 3~5 |
| `tests/e2e/textbook.test.mjs` 외 | 바뀐 동작에 맞춤 | 3, 4 |
| `tests/visual/visual.test.mjs` | 새 장면 | 6 |
| `CLAUDE.md`, `docs/…` 기록 | 코드 위치, progress, CHECKPOINT, 로드맵 | 7 |

---

### Task 1: DESIGN.md 보강

**Files:**
- Modify: `DESIGN.md`(Navigation, Components "Day 부품", Motion 표·"한 번만"·"동작 줄이기", frontmatter `levelup-modal`)

**Interfaces:**
- Produces: 아래 문안. Task 3~5가 값을 여기서 가져온다.

- [ ] **Step 1: "Day 부품"의 **레벨업 Modal** 항목을 아래 두 항목으로 바꾼다**

```markdown
- **보상 Modal(레벨업·월드 클리어):** `<dialog>`(`setupDialog`, `showModal`), 가운데(`margin: auto`), `card` 면, 2px `edge` 테두리와 `--ledge` `edge` 턱, 모서리 `--radius-card`, 안쪽 `var(--space-xl)`(640px 이하 `var(--space-lg)`), 가운데 정렬, 폭 `min(24rem, calc(100% - var(--space-xl)))`, 백드롭 `scrim`, 부품 사이 `var(--space-sm)`. 레벨업: Label "레벨 업" → LV 배지(HUD와 같은 모양, 숫자 32px) → 제목 "레벨이 올랐어요"(Title small) → "다음 레벨까지 XP m"(`ink-2`, m은 800 고정폭) → 주 버튼 "계속하기"(처음 포커스). 월드 클리어: Label "월드 클리어" → 엠블럼 배지(월드 페이지 머리와 같은 모양, 엠블럼 3배) → 제목 "‘월드 이름’ 클리어!"(Title small) → 결과물 문장(`ink-2`) → 같은 완료로 레벨도 올랐으면 "LV n 달성"(`ink` 800) → 주 버튼 "계속하기". 한 번의 완료에 둘이 같이 나면 월드 클리어 하나만 띄운다. 사건마다 세션에 한 번이다(레벨업 `levelup:n`, 월드 클리어 `celebrate:<월드 id>`, 홈 축하와 같은 키). 닫힘: "계속하기", ESC, 백드롭 클릭, 화면 이동. 닫히면 Day 완료 카드 상태 줄로 포커스가 돌아가고 그다음 업적 토스트가 뜬다. 이름은 제목(`aria-labelledby`). 월드 클리어는 열릴 때 엠블럼에서 축하 조각이 튄다.
- **업적 토스트:** 토스트 틀 그대로, 왼쪽에 트로피 도트(2배 16px, 글자와 사이 `var(--space-xs)`). 문장은 "Day n 완료! 보상 +m XP"(분이 숫자가 아니면 "Day n 완료!")이고, 새로 열린 곳이 있으면 " · 새로 열린 곳이 있어요"를 붙인다. Day를 완료할 때마다 뜨며, 이 문장이 완료 알림이다.
```

- [ ] **Step 2: Navigation의 **확인 Modal** 다음에 넣는다**

```markdown
- **용어 서랍:** 본문의 용어 링크(`a.term`)를 그냥 누르면 연다. 모든 폭에서 오른쪽에 붙는 `<dialog>`(`showModal`), 높이 100dvh, 폭 `min(28rem, calc(100% - var(--space-2xl)))`, 왼쪽 1px `rule`, `card` 바탕, 백드롭 `scrim`, 그림자 없음. 머리 56px: 책 도트(2배 16px) + 용어 이름(17px 800, 열면 여기로 포커스) + 닫기 아이콘 버튼("용어 설명 닫기"). 몸통은 용어 사전 항목의 정의(Body, 안쪽 `var(--space-lg) var(--space-md)`, 세로 스크롤은 몸통 안에서만). 정의 안의 용어 링크를 누르면 서랍 안에서 그 용어로 바뀐다. 아래 줄(위 1px `rule`, 안쪽 `var(--space-sm) var(--space-md)`)에 글자 링크 "용어 사전에서 보기 →". 닫힘: ESC, 백드롭 클릭, 닫기 버튼, 화면 이동. 닫히면 누른 용어 링크로 포커스가 돌아간다. 열려 있는 동안 문서 스크롤을 잠근다. 수정 키·가운데 버튼 클릭, 용어 사전 페이지 안의 링크, 사전에 없는 항목은 지금처럼 이동한다.
```

- [ ] **Step 3: Motion 표**
  - **축하 조각** 행의 자리를 `월드 클리어·모두 클리어 상태의 큰 Day 번호, 월드 클리어 Modal의 엠블럼`으로 바꾼다.
  - **서랍** 행 다음에 세 행을 넣는다.

```markdown
| 보상 Modal | 열림 / 닫힘 | `pop-in` 280ms `--ease-out` / 페이드 180ms `--ease-in`(검색과 같음) |
| 용어 서랍 | 열림 / 닫힘 | `transform: translateX(100%)`에서 280ms `--ease-out` / 180ms `--ease-in`, 백드롭은 투명도만 |
| 화면 전환 | 퀘스트 카드 큰 Day 번호 ↔ Day 머리 번호, 월드 카드 엠블럼 ↔ 월드 페이지 머리 엠블럼 | `document.startViewTransition`. 이동하는 곳과 짝인 요소가 지금 화면에 있을 때만 두 요소에 `view-transition-name: wzh-shared`를 잠깐 붙인다. 묶음 이동 280ms `--ease-out`, 화면 나머지는 바로 바뀐다(root 애니메이션 없음), 짝 없는 그림은 애니메이션 없음, 전환 중 클릭은 문서로 간다(`::view-transition { pointer-events: none }`). 미지원이면 바로 바꾼다 |
```

  - "한 번만" 목록에 `보상 Modal`을 더한다.
  - "동작 줄이기"의 JS 건너뛰기 목록에 `화면 전환`을 더하고, `서랍·검색은 바로 닫는다`를 `서랍·검색·보상 Modal·용어 서랍은 바로 열고 닫는다`로 바꾼다.

- [ ] **Step 4: frontmatter**
  - `drawer:` 항목 다음에 `term-drawer:` 항목을 같은 형식으로 넣는다: `backgroundColor: "{colors.card}"`, `width: "min(28rem, calc(100% - 48px))"`. `levelup-modal`은 그대로 둔다.

- [ ] **Step 5: 다시 실행**

Run: `npm test`
Expected: 모두 통과(302). `tokens.css equals the token block in DESIGN.md` PASS(토큰은 바뀌지 않음).

- [ ] **Step 6: Commit**

```bash
git add DESIGN.md
git commit -m "docs(design): reward modal, achievement toast, term drawer and shared transition specs"
```

---

### Task 2: 보상 사건 계산 `reward.js`

**Files:**
- Create: `textbook/src/app/reward.js`
- Test: `tests/unit/reward.test.mjs`

**Interfaces:**
- Consumes: `progress.js` `isProjectComplete(cur, prog, pid)`, `newlyUnlocked(cur, before, after)`; `level.js` `totalXp`, `levelOf`. Day 찾기는 이 파일 안에서 `cur.projects`를 돈다(로직 층은 `views/`를 import하지 않는다).
- Produces:
  - `rewardEvents(cur, before, after, dayId) → { day: { id, num, minutes }, levelUp: { from, to, toNext } | null, worldClear: string | null, unlocked: string[] }`
  - `rewardModal(events) → { kind: 'world', pid, level: number | null } | { kind: 'level', level, toNext } | null`
  - `rewardKey(modal) → 'celebrate:<pid>' | 'levelup:<n>'`
  - `rewardToast(events) → string`

- [ ] **Step 1: 실패하는 테스트**

작은 `cur` 픽스처를 테스트 안에 만든다. 모양은 빌드가 내장하는 `cur`과 같다(Day마다 `id`·`num`·`minutes`, `pages: []`): 월드 `a`(`requires: []`, Day `a1` 120분, `a2` 120분, `a3` 120분, `a4` 60분), 월드 `b`(`requires: ['a']`, Day `b1` 분 `null`). `prog`는 `{ version: 1, completed: {...}, checks: {}, lastDay: null, theme: 'system' }`.

```js
test('rewardEvents: no level, no world', () => {
  const e = rewardEvents(cur, P([]), P(['a1']), 'a1');
  assert.deepEqual(e, { day: { id: 'a1', num: 1, minutes: 120 }, levelUp: null, worldClear: null, unlocked: [] });
});
test('rewardEvents: crossing 300 XP is a level up', () => {
  const e = rewardEvents(cur, P(['a1', 'a2']), P(['a1', 'a2', 'a3']), 'a3');
  assert.deepEqual(e.levelUp, { from: 1, to: 2, toNext: 240 });
  assert.equal(e.worldClear, null);
});
test('rewardEvents: last day of a world clears it and unlocks the next', () => {
  const e = rewardEvents(cur, P(['a1', 'a2', 'a3']), P(['a1', 'a2', 'a3', 'a4']), 'a4');
  assert.equal(e.worldClear, 'a');
  assert.equal(e.levelUp, null);
  assert.deepEqual(e.unlocked, ['b']);
});
test('rewardModal: world wins over level and carries the level', () => {
  assert.deepEqual(rewardModal({ ...base, levelUp: { from: 1, to: 2, toNext: 240 }, worldClear: 'a' }), { kind: 'world', pid: 'a', level: 2 });
  assert.deepEqual(rewardModal({ ...base, levelUp: { from: 1, to: 2, toNext: 240 } }), { kind: 'level', level: 2, toNext: 240 });
  assert.equal(rewardModal(base), null);
});
test('rewardKey', () => {
  assert.equal(rewardKey({ kind: 'world', pid: 'a', level: null }), 'celebrate:a');
  assert.equal(rewardKey({ kind: 'level', level: 3, toNext: 10 }), 'levelup:3');
});
test('rewardToast', () => {
  assert.equal(rewardToast({ ...base, day: { id: 'a1', num: 1, minutes: 120 } }), 'Day 1 완료! 보상 +120 XP');
  assert.equal(rewardToast({ ...base, day: { id: 'b1', num: 1, minutes: null } }), 'Day 1 완료!');
  assert.equal(rewardToast({ ...base, unlocked: ['b'] }), 'Day 1 완료! 보상 +120 XP · 새로 열린 곳이 있어요');
});
```

(`P(ids)`는 완료 맵을 만드는 도우미, `base`는 `{ day: { id: 'a1', num: 1, minutes: 120 }, levelUp: null, worldClear: null, unlocked: [] }`이다.)

- [ ] **Step 2: 실패 확인**

Run: `node --test ../tests/unit/reward.test.mjs`
Expected: FAIL(모듈 없음)

- [ ] **Step 3: 구현**
  - `levelUp`은 `levelOf(totalXp(cur, before)).level < levelOf(totalXp(cur, after)).level`일 때만, `toNext`는 after의 값.
  - `worldClear`는 dayId가 든 월드가 before에서 미완료이고 after에서 완료일 때 그 id.
  - `unlocked`는 `newlyUnlocked` 그대로.

- [ ] **Step 4: 통과 확인**

Run: `npm test`
Expected: 모두 통과(302 + 새 테스트)

- [ ] **Step 5: Commit**

```bash
git add textbook/src/app/reward.js tests/unit/reward.test.mjs
git commit -m "feat(reward): pure reward events from progress before and after"
```

---

### Task 3: 보상 Modal과 Day 완료 연결

**Files:**
- Modify: `textbook/src/template.html`(확인 Modal 다음에 `#reward-dialog`)
- Create: `textbook/src/app/views/rewardmodal.js`
- Modify: `views/hud.js`, `views/toast.js`, `views/day.js`, `main.js`, `views/shell.js`
- Modify: `styles/shell.css`(`.reward`), `styles/components.css`(`.toast.has-icon`), `styles/print.css`
- Create: `tests/e2e/reward.test.mjs`
- Modify: 완료 알림을 `#live`에서 읽던 e2e

**Interfaces:**
- Consumes: Task 2의 네 함수. `overlay.js` `setupDialog`·`openDialog`·`closeDialog`. `motion.js` `onceInSession`, `confetti(card, from)`. `icons.js` `px`, `worldEmblem`.
- Produces:
  - `lvBadge(level: number) → HTMLElement` (`hud.js`, 지금 `levelPanel`의 `p.lv` 그대로. `levelPanel`도 이것을 쓴다)
  - `showToast(text, { duration, doc, icon = null })` — `icon`은 도트 아이콘 이름. 있으면 `px(icon)` + `<span>`글자, 항목에 `has-icon` 클래스. 같은 문장 비교는 지금처럼 `textContent`.
  - `createRewardModal(dlg) → { show(modal, cur, opener): Promise<void>, dismiss(): void, isOpen(): boolean }` — `show`는 닫힐 때(어떤 방법이든) 끝나는 약속. `dismiss`는 열려 있으면 `closeDialog(dlg, { restoreFocus: false, immediate: true })`.
  - 마크업: `<dialog id="reward-dialog" class="reward" aria-labelledby="reward-title" data-testid="reward-modal">`. 안의 제목 `h2#reward-title.reward-title`, 버튼 `button.btn-primary[data-testid="reward-ok"]` "계속하기".
  - `ctx.reward`(main.js가 만든 `createRewardModal` 결과). `render()` 맨 앞에서 `confirmModal.dismiss()` 다음에 `ctx.reward.dismiss()`.

- [ ] **Step 1: e2e 틀과 실패하는 테스트**

`tests/e2e/reward.test.mjs`는 `day.test.mjs`의 `before`·`after`·`newContext`·`withPage`·`seedValue` 틀을 따른다. 픽스처는 Day 3개·225분뿐이라 레벨이 오르지 않으므로 복사본을 고친다(분 범위는 60~120, `lib/curriculum.mjs`).
  - 두 복사본 모두 `fa/day-02.md`를 `fa/day-03.md`·`fa/day-04.md`로 복사하고 `curriculum.json`의 `fa` Day 목록에 두 항목을 더한다(제목만 다르게).
  - 빌드 A(`site/a/index.html`) 분: fa 120·120·120·60, fb 120. fa-d01 완료 = 120 XP(토스트만), fa-d03 완료 = 240 → 360(레벨업만), fa-d04 완료 = 360 → 420(월드 fa 클리어만).
  - 빌드 B(`site/b/index.html`) 분: fa 120·60·60·120. fa-d01~d03 seed(240)에서 fa-d04 완료 = 360(월드 클리어 + 레벨업).
  - 정적 서버 하나로 두 폴더를 연다. 각 빌드의 `r.ok`를 확인한다.

테스트(이름과 확인할 것):
- `day complete shows achievement toast`: 진도 없음, `#/day/fa-d01` → 완료 → `.toast.has-icon` 글자 `Day 1 완료! 보상 +120 XP`, `#reward-dialog`는 닫혀 있음.
- `level up opens reward modal once`: seed fa-d01·d02, `#/day/fa-d03` → 완료 → `#reward-dialog[open]`, 제목 "레벨이 올랐어요", `.lv-value` "2", "다음 레벨까지 XP 240", 포커스가 `reward-ok`. 토스트는 아직 0개. "계속하기" → Modal 닫힘, 포커스가 `#completion-status`, 그다음 토스트 1개.
- `reward modal shows once per session`: 위 다음 "완료 취소" → 다시 완료 → Modal 없음, 토스트 있음.
- `world clear modal`: seed fa-d01~d03, `#/day/fa-d04` → 완료 → 제목 "‘<fa 제목>’ 클리어!", 결과물 문장, "LV" 줄 없음. ESC로 닫힘.
- `world clear with level up`: 빌드 B, seed fa-d01~d03, `#/day/fa-d04` → 완료 → Modal 하나에 "클리어!" 제목과 "LV 2 달성"이 같이 보인다. 닫은 뒤 Modal이 또 열리지 않는다.
- `reward modal closes on navigation and blocks ctrl+k`: 레벨업 Modal이 열린 채 Ctrl+K → `#search-dialog`가 열리지 않음. `history.back()` → Modal 닫힘, 새 화면에 토스트.
- `reward works without storage`: `addInitScript`로 `localStorage`·`sessionStorage` 접근을 예외로 바꾼 컨텍스트에서 fa-d01~d03을 차례로 완료 → d03에서 Modal이 뜬다.
- `reduced motion: modal opens and closes at once, no confetti`: `reducedMotion: 'reduce'`, 월드 클리어 → `.confetti` 0개, ESC 뒤 바로 `open` 아님.
- 모든 테스트에서 콘솔 오류 0(`collectConsoleErrors`).

- [ ] **Step 2: 실패 확인**

Run: `node --test ../tests/e2e/reward.test.mjs`
Expected: FAIL(`.toast.has-icon` 없음, `#reward-dialog` 없음)

- [ ] **Step 3: 부품**
  - `hud.js`에 `lvBadge` 추출, `levelPanel`이 쓴다.
  - `toast.js` `icon` 옵션. 아이콘 SVG는 `aria-hidden`(px가 이미 그렇다면 그대로).
  - `rewardmodal.js`: `show`가 내용을 `h()`로 새로 그린다. 레벨업은 `p.label "레벨 업"` → `lvBadge(level)` → 제목 → `p.reward-next`("다음 레벨까지 XP " + `span.num`) → 버튼. 월드 클리어는 `p.label "월드 클리어"` → `span.badge` + `px(worldEmblem(project), { cls: 'emblem', scale: 3 })` → 제목 → `p.reward-outcome`(`project.outcome`, 없으면 생략) → `level`이 있으면 `p.reward-level` "LV n 달성" → 버튼. 버튼 누름 = `closeDialog(dlg)`. 열고 나서 버튼에 포커스, 월드 클리어면 `confetti(dlg, badge)`.
  - CSS(`shell.css`, 확인 Modal 블록 다음): `.reward`는 Task 1 문안 값. 열림 `pop-in var(--dur-enter) var(--ease-out)`, `.reward.is-closing`과 백드롭은 검색·확인 Modal의 닫힘 규칙 선택자 목록에 더한다. `overflow: visible`(축하 조각이 잘리지 않게), `:root:has(.reward[open]) { overflow: hidden; }`. `.toast.has-icon { display: flex; align-items: center; gap: var(--space-xs); }`. `print.css`에서 `.reward` 숨김.

- [ ] **Step 4: 연결**
  - `main.js`: `ctx.reward = createRewardModal(document.getElementById('reward-dialog'))`, `render()`에서 `ctx.reward.dismiss()`.
  - `shell.js` Ctrl+K: `confirm-dialog`와 같이 `reward-dialog`가 열려 있으면 무시한다.
  - `day.js` `complete()`: 지금 순서(commit → `justUnlocked` → `renderFooter` → 상태 줄 포커스)는 그대로 두고 `ctx.announce(...)`를 지운다. 그다음:

```js
const events = rewardEvents(cur, before, after, dayId);
const modal = rewardModal(events);
const toast = () => showToast(rewardToast(events), { icon: 'trophy' });
if (modal && onceInSession(rewardKey(modal))) ctx.reward.show(modal, cur, document.getElementById('completion-status')).then(toast);
else toast();
```

- [ ] **Step 5: 기존 e2e 맞추기**
  - `grep -n "완료했어요" ../tests/e2e/*.mjs`로 완료 뒤 `#live`를 읽던 곳을 찾아 토스트(`[data-testid="toast"]`)를 읽게 바꾼다. 확인하던 문장 내용은 줄이지 않는다.
  - 실제 콘텐츠로 여러 Day를 완료하는 e2e(`textbook.test.mjs`, `motion.test.mjs`)가 300 XP를 넘기면 Modal이 뒤를 inert로 만든다. 전체 e2e를 돌려 깨지는 곳만 "계속하기"를 눌러 닫는 줄을 더한다.

- [ ] **Step 6: 통과 확인**

Run: `npm test` 그리고 `npm run test:e2e`
Expected: 모두 통과. 새 e2e 8개 포함.

- [ ] **Step 7: Commit**

```bash
git add textbook/src tests/e2e
git commit -m "feat(reward): level up and world clear modal, achievement toast after day complete"
```

---

### Task 4: 용어 미리보기 서랍

**Files:**
- Create: `textbook/src/app/views/termdrawer.js`
- Modify: `template.html`(`#term-drawer`), `main.js`, `views/shell.js`, `styles/shell.css`, `styles/print.css`
- Create: `tests/unit/termdrawer.test.mjs`
- Modify: `tests/e2e/reward.test.mjs`(서랍 테스트), `tests/e2e/textbook.test.mjs:854`(용어 클릭이 이동하던 테스트)

**Interfaces:**
- Consumes: `overlay.js`, `icons.js` `px`·`iconSvg('close')`(지금 닫기 아이콘을 만드는 방식 그대로), `common.js` `h`·`textLink`.
- Produces:
  - `termSlug(href: string | null) → string | null` — `#/page/glossary/term-<slug>`이면 slug, 아니면 null. `href`는 `getAttribute('href')` 값(퍼센트 인코딩 전)이다.
  - `createTermDrawer(dlg, { doc = document } = {}) → { open(slug, opener): boolean, close(opts?): void, isOpen(): boolean }` — `open`은 `#t-page-glossary` 템플릿에 `#term-<slug>`가 없으면 아무것도 하지 않고 false.
  - 마크업: `<dialog id="term-drawer" class="term-drawer" aria-labelledby="term-drawer-title" data-testid="term-drawer">` 안에 `.term-drawer-head`(책 도트, `h2#term-drawer-title tabindex="-1"`, 닫기 버튼 `aria-label="용어 설명 닫기"`), `.term-drawer-body`, `.term-drawer-foot`(링크 `data-testid="term-drawer-more"`).
  - `ctx.terms`(main.js). `render()`에서 `ctx.terms.close({ restoreFocus: false, immediate: true })`.

- [ ] **Step 1: 실패하는 단위 테스트**

```js
test('termSlug', () => {
  assert.equal(termSlug('#/page/glossary/term-html'), 'html');
  assert.equal(termSlug('#/page/glossary/term-픽스처용어'), '픽스처용어');
  assert.equal(termSlug('#/page/glossary/gl-a'), null);
  assert.equal(termSlug('#/page/glossary'), null);
  assert.equal(termSlug('#/day/p1-d01'), null);
  assert.equal(termSlug(null), null);
});
```

- [ ] **Step 2: 실패하는 e2e** (`reward.test.mjs`에 더한다. 픽스처 `fa/day-01.md`에 `[[픽스처용어]]`가 있다)
  - `term link opens right drawer`: `#/day/fa-d01`에서 `main a.term` 클릭 → 주소는 그대로 `#/day/fa-d01`, `#term-drawer[open]`, 제목 "픽스처용어", 몸통에 사전 정의 글, 포커스가 제목. 1280px에서 서랍 오른쪽 끝 = 창 오른쪽 끝, 375px에서 서랍 폭 < 창 폭이고 가로 스크롤 0.
  - `drawer closes and returns focus`: ESC → 닫힘, 포커스가 누른 `a.term`. 백드롭 클릭(서랍 왼쪽 바깥 좌표)도 닫힘.
  - `more link goes to glossary`: `term-drawer-more` 클릭 → `#/page/glossary/term-픽스처용어`, 서랍 닫힘, `#term-픽스처용어.is-target`.
  - `term link inside drawer swaps entry`: 픽스처 용어 정의에 다른 용어 링크가 없으면 `prepareContent`에서 `glossary/fixture.md` 첫 항목 정의에 `[[<두 번째 용어>]]`를 더한다 → 서랍 안 링크 클릭 → 제목이 바뀌고 서랍은 열린 채, 주소 그대로.
  - `glossary page links still navigate`: `#/page/glossary`에서 `a.term` 클릭 → 서랍 없이 이동(주소의 anchor가 바뀜). Ctrl+클릭은 Day에서도 서랍을 열지 않는다(`page.keyboard.down('Control')` 뒤 클릭, `#term-drawer[open]` 0).
  - `ctrl+k from term drawer opens search`: 서랍이 열린 채 Ctrl+K → 서랍 닫힘, `#search-dialog[open]`.
  - `textbook.test.mjs:854`: `main a.term` 클릭 뒤 바로 주소를 기다리던 것을 → 서랍이 열리는지 확인 → `term-drawer-more` 클릭 → 지금 확인하던 주소·항목 강조 그대로.

- [ ] **Step 3: 실패 확인**

Run: `npm test`, `node --test ../tests/e2e/reward.test.mjs`
Expected: FAIL(`termSlug` 없음, 서랍 없음)

- [ ] **Step 4: 구현**
  - `open`: 템플릿 항목을 복제해 첫 제목 요소(h3)는 글자만 머리 제목으로 옮기고 몸통에서 뺀다. 복제본 안의 모든 `id`를 지운다. 더 보기 링크 `href`는 `#/page/glossary/term-<slug>`. 이미 열려 있으면 내용만 바꾸고 opener는 처음 것을 지킨다(`openDialog`가 이미 그렇다).
  - 서랍 안 클릭 위임: `a.term`이고 `termSlug`가 있으면 `preventDefault` 후 `open(slug)`. 서랍 안의 다른 링크(더 보기 포함)는 그대로 이동하고 `render()`가 닫는다.
  - `main.js` 클릭 위임(`#main`): `event.defaultPrevented`, `button !== 0`, 수정 키, 지금 경로가 `page`이고 id가 `glossary`이면 그냥 둔다. 아니면 `termSlug(link.getAttribute('href'))`로 `ctx.terms.open(slug, link)`가 true일 때만 `preventDefault`.
  - `shell.js` `openSearch`: 사이드바 서랍처럼, 용어 서랍이 열려 있으면 `ctx.terms.close({ restoreFocus: false, immediate: true })` 뒤 `opener`를 `#main`으로 바꿔 검색을 연다(검색을 닫으면 본문으로 돌아간다). `main.js`는 `ctx.reward`·`ctx.terms`를 `createShell(ctx)`보다 먼저 만든다.
  - CSS: `.drawer`의 겉모양 규칙(높이, 패딩 0, 바탕, 글자색, overflow, `[open]` flex, 백드롭, 머리·몸통)을 `.drawer, .term-drawer` 선택자 목록으로 묶는다. `.term-drawer`만: `inset: 0 0 0 auto`, 폭 Task 1 값, `border-left: 1px solid var(--color-rule)`, 들어옴 `drawer-end-in`, 나감 `drawer-end-out`(`translateX(100%)`). `@media (min-width: 64rem) { .drawer { display: none } }`은 `.drawer`에만 둔다. `:root:has(.term-drawer[open]) { overflow: hidden; }`. 몸통 글은 `.lesson-body`의 글 규칙을 다시 쓰지 말고 Body 크기·줄간격 토큰만 준다. `print.css`에서 `.term-drawer` 숨김.

- [ ] **Step 5: 통과 확인**

Run: `npm test`, `npm run test:e2e`
Expected: 모두 통과

- [ ] **Step 6: Commit**

```bash
git add textbook/src tests/unit/termdrawer.test.mjs tests/e2e
git commit -m "feat(terms): term links open a right drawer with the glossary entry"
```

---

### Task 5: 화면 전환(Shared Element)

**Files:**
- Modify: `textbook/src/app/motion.js`, `main.js`, `views/quest.js`, `views/day.js`, `views/worlds.js`, `views/project.js`, `styles/shell.css`
- Test: `tests/unit/motion.test.mjs`, `tests/e2e/reward.test.mjs`

**Interfaces:**
- Consumes: `router.js` `parseHash` 결과 `{ name, dayId?, pid? }`.
- Produces:
  - `SHARED_NAME = 'wzh-shared'`
  - `sharedKey(next, prev) → string | null` — `keyOf(r)`: day → `day-<dayId>`, project → `world-<pid>`, 그 밖 null. `keyOf(next) ?? keyOf(prev)`.
  - `sharedTransition(root, key, update, env = motionEnv(), doc = root.ownerDocument) → ViewTransition | null` — `env.reduce`, `!key`, `startViewTransition` 없음, 또는 `root` 안에 `[data-vt="<key>"]`가 없으면 `update()`만 하고 null. 아니면 옛 요소에 이름을 붙이고 `doc.startViewTransition(() => { 옛 이름 떼기; update(); 새 요소에 이름 붙이기 })`, `finished` 뒤(성공·실패 모두) 새 요소 이름을 뗀다.
  - `data-vt` 자리: 퀘스트 카드 `.bignum`(`day-<그 Day id>`), Day 머리 `.lesson-num`(`day-<id>`), 월드 카드 `.wc-title .badge`(`world-<id>`, 졸업 카드 제외), 월드 페이지 `.world-head .badge`(`world-<id>`).

- [ ] **Step 1: 실패하는 단위 테스트**

```js
test('sharedKey', () => {
  assert.equal(sharedKey({ name: 'day', dayId: 'p1-d04' }, { name: 'home' }), 'day-p1-d04');
  assert.equal(sharedKey({ name: 'home' }, { name: 'day', dayId: 'p1-d04' }), 'day-p1-d04');
  assert.equal(sharedKey({ name: 'project', pid: 'p2' }, { name: 'home' }), 'world-p2');
  assert.equal(sharedKey({ name: 'settings' }, { name: 'search' }), null);
});
test('sharedTransition falls back to plain update', () => {
  // 가짜 root/doc: 동작 줄이기, startViewTransition 없음, 짝 요소 없음 → update 한 번, 반환 null
});
test('sharedTransition names old then new element only', () => {
  // 가짜 doc.startViewTransition(cb): 부를 때 옛 요소 이름 === 'wzh-shared' 기록, cb 실행 뒤 옛 이름 '' · 새 이름 'wzh-shared', finished 뒤 새 이름 ''
});
```

(가짜 요소는 `{ dataset: { vt }, style: { viewTransitionName: '' } }`, `root.querySelector`는 지금 들어 있는 요소 목록에서 찾는다. `update`가 목록을 새 요소로 바꾼다.)

- [ ] **Step 2: 실패하는 e2e** (실제 콘텐츠가 아니라 픽스처 빌드. 홈 퀘스트 카드는 fa-d01을 가리킨다)
  - `quest number morphs into day head`: 홈에서 `document.startViewTransition`을 감싸 부를 때 `[style*="view-transition-name"]`의 `data-vt`를 기록 → 퀘스트 카드 주 버튼 클릭 → 기록 `['day-fa-d01']`, Day 화면이 그려지고, `transition.finished` 뒤 이름 붙은 요소 0개.
  - `back from day morphs back`: 위 다음 `page.goBack()` → 기록에 `day-fa-d01` 하나 더.
  - `unrelated navigation has no transition`: 홈 → 설정 → 호출 0.
  - `shared transition falls back`: `addInitScript`로 `delete Document.prototype.startViewTransition` → 같은 클릭 → Day 화면이 그려지고 콘솔 오류 0. `reducedMotion: 'reduce'`에서도 호출 0.
  - `clicks pass through during transition`: CSS `::view-transition-group(wzh-shared)` 시간을 테스트에서 2초로 늘리는 스타일을 넣고 → 클릭 직후 Day 화면의 "다음 →" 링크를 누르면 다음 Day 주소가 된다.

- [ ] **Step 3: 실패 확인**

Run: `npm test`, `node --test ../tests/e2e/reward.test.mjs`
Expected: FAIL

- [ ] **Step 4: 구현**
  - `main.js`: 마지막으로 그린 경로를 `lastRoute`로 둔다. hashchange에서 `sharedTransition(main, sharedKey(parseHash(location.hash), lastRoute), () => render({ focus, scroll: true }))`. 처음 그리기와 `ctx.go`의 `replace`·같은 주소 경로는 감싸지 않는다. 404 빌드도 감싸지 않는다.
  - `data-vt` 네 자리.
  - CSS(`shell.css` 맨 끝, "화면 전환" 주석):

```css
::view-transition { pointer-events: none; }
::view-transition-old(root), ::view-transition-new(root) { animation: none; }
::view-transition-group(wzh-shared) { animation-duration: var(--dur-enter); animation-timing-function: var(--ease-out); }
::view-transition-old(wzh-shared):only-child, ::view-transition-new(wzh-shared):only-child { animation: none; }
```

- [ ] **Step 5: 통과 확인**

Run: `npm test`, `npm run test:e2e`
Expected: 모두 통과

- [ ] **Step 6: 눈으로 확인**
  - `npm run build` 뒤 로컬 정적 서버로 홈 → "이어서 하기", 월드 카드 → 월드 페이지, 뒤로 가기를 1280·375에서 보고, 짝이 끊기거나 깜빡이면 고친다. 스크린샷 두 장(전환 전·후)을 사용자에게 보인다.

- [ ] **Step 7: Commit**

```bash
git add textbook/src tests/unit/motion.test.mjs tests/e2e/reward.test.mjs
git commit -m "feat(motion): shared element transition between quest card and day head, world card and world page"
```

---

### Task 6: 시각 장면과 기준 이미지

**Files:**
- Modify: `tests/visual/visual.test.mjs`
- Create: `tests/visual/baseline/` 새 이미지

**Interfaces:**
- Consumes: 기존 `SCENES` 형식(`open`, `waitFor`, `widths`, `progress`).

- [ ] **Step 1: 장면 추가**
  - 진도 상수 `P1_ALMOST = { completed: P1_CLEAR.completed.slice(0, 29), lastDay: 'p1-d29' }`.
  - `{ id: 'levelup', hash: '#/day/p1-d04', progress: P1_FIRST_THREE, open: '[data-testid="complete-button"]', waitFor: '#reward-dialog[open]' }` — P1 Day 1~3 = 280 XP, Day 4(100분) 완료로 LV 2. 3폭 × 2테마.
  - `{ id: 'world-clear', hash: '#/day/p1-d30', progress: P1_ALMOST, widths: [375, 1280], open: '[data-testid="complete-button"]', waitFor: '#reward-dialog[open]' }` — 2960 → 3050 XP라 "LV 11 달성" 줄도 보인다.
  - `{ id: 'term', hash: '#/day/p1-d01', progress: P1_FIRST_THREE, open: '.lesson-body a.term', waitFor: '#term-drawer[open]' }` — 3폭 × 2테마.
  - `{ id: 'toast-reward', hash: '#/day/p1-d01', progress: null, widths: [375, 1280], open: '[data-testid="complete-button"]', waitFor: '.toast.has-icon' }`.
  - 홈·월드 장면은 `data-vt`만 붙었으므로 그대로 통과해야 한다.

- [ ] **Step 2: 새 장면만 찍어 눈으로 대조**

Run: `npm run test:visual`
Expected: 기존 136장 통과, 새 20장은 기준 없음으로 실패하고 실제 이미지가 남는다. 그 20장을 DESIGN.md(Task 1 문안)와 대조해 고칠 것을 고친 뒤 사용자에게 보인다(라이트·다크, 375·768·1280).

- [ ] **Step 3: 승인 뒤 기준 이미지 갱신**

Run: `npm run test:visual:update` 그리고 `npm run test:visual`
Expected: 158/158 통과(기준 이미지 156장)

- [ ] **Step 4: Commit**

```bash
git add tests/visual
git commit -m "test(visual): level up, world clear, term drawer and achievement toast scenes"
```

---

### Task 7: 전체 검증과 기록

**Files:**
- Modify: `CLAUDE.md`(코드 위치에 `reward.js`, `views/rewardmodal.js`, `views/termdrawer.js`), `docs/CHECKPOINT.md`, `docs/checkpoint/workspace/progress.md`, 로드맵 11장(넘김이 생겼을 때만)

- [ ] **Step 1: 기준선 전부**

Run: `npm test`, `npm run check -- --allow-missing`, `npm run test:e2e`, `npm run test:visual`, `npm run build:site` 뒤 `_site`를 로컬 정적 서버로 띄워 `npm run check:site -- <로컬 주소>`
Expected: 모두 통과, check:site 4폭 각 "문제 0개". 출력 숫자를 보고에 넣는다.

- [ ] **Step 2: 완료 기준을 브라우저로 확인**
  - ① 로컬 빌드에서 Day를 완료하면 업적 토스트가 뜬다.
  - ② P1 Day 1~3 완료 상태에서 Day 4를 완료하면 레벨업 Modal이 한 번 뜨고, 완료 취소 뒤 다시 완료하면 뜨지 않는다.
  - ③ Day 1 본문의 "인터넷" 용어를 누르면 오른쪽 서랍에 정의가 나온다.
  - 각 장면 스크린샷(375·1280, 라이트·다크)을 보고에 넣는다. 확인하지 못한 것(Safari·Firefox의 View Transition, 실기기, 화면 낭독기)은 "확인하지 못함"으로 적는다.

- [ ] **Step 3: 최종 리뷰(직접)**
  - `git diff <M11 시작 커밋>..HEAD`를 처음부터 읽는다. Global Constraints와 Review Focus 다섯 줄을 하나씩 대조한다. 찾은 문제는 재현 테스트 → 수정 → 전체 테스트로 이 자리에서 끝낸다.

- [ ] **Step 4: 기록**
  - `progress.md`에 `M11: complete` 줄(테스트 숫자 포함).
  - `CHECKPOINT.md` 머리의 상태·기준선과 0장 "끝난 것"에 M11 줄, "다음은 M12".
  - `CLAUDE.md` 코드 위치에 새 파일 세 개.

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md docs
git commit -m "docs: M11 complete"
```

## 출처
- ViewTransition `finished`·`skipTransition`, 이름은 한 번에 하나: https://developer.mozilla.org/en-US/docs/Web/API/ViewTransition/finished
- 전환 중 클릭과 `::view-transition { pointer-events: none }`: https://bram.us/2025/01/29/view-transitions-page-interactivity
- 렌더가 멈춘 동안 입력은 root로 간다(WPT): https://chromium.googlesource.com/external/w3c/web-platform-tests.git/+/HEAD/css/css-view-transitions/input-targets-root-while-render-blocked.html
