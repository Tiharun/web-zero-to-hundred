# M5 검색 Modal·검색 페이지·잠금 결과·Skeleton 구현 계획서

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ctrl+K와 상단 검색 버튼으로 여는 검색 Modal(combobox + listbox, ↑↓ Enter Esc)을 만들고, `#/search` 페이지를 같은 결과 행으로 바꾸고, 잠긴 결과는 제목과 여는 조건만 보이게 하고, 첫 계산이 느릴 때만 Skeleton을 보인다.

**Architecture:**
- 로직(`search.js`):
  - 지금의 동기 `search`는 그대로 둔다.
  - 시간을 나눠 계산하고 중간에 멈출 수 있는 `searchAsync`를 더한다.
  - 접어 둔 글자(NFC + 소문자)는 항목마다 캐시한다.
- 결과 행 공용 부품(`views/results.js`):
  - 결과를 화면용 모델로 바꾸는 일, 빈 검색어의 바로 가기, 일치 글자 표시, 요약 문장을 맡는다.
  - 목록 갱신(이전 검색 멈춤 + Skeleton)도 여기서 한다.
  - Modal(`views/searchmodal.js`)과 검색 페이지(`views/search.js`)가 이 부품을 같이 쓴다.
- Skeleton 시간 규칙과 자리표시 행은 `views/skeleton.js`에 둔다. M13 3D 그림도 이 파일을 쓴다.

**Tech Stack:** 바닐라 JS(ESM), `<dialog>` `showModal`, WAI-ARIA combobox(`aria-activedescendant`), `AbortController`, `node:test`, 전역 Playwright 1.63.0(CDP `Emulation.setCPUThrottlingRate`), pixelmatch 8.0.0.

**Spec:**
- `docs/superpowers/specs/2026-11-12-unified-roadmap-design.md`: 11.2 M5 행과 넘겨받은 일 2개, 4장(전역 제약), 5장(`search.js`는 순수 함수).
- 개편 설계서 `2026-11-11-textbook-redesign-design.md`: 3.4 "검색 페이지 경로 유지", 3.5 Skeleton 규칙, 5.2 Modal.
- 원 설계서 4장 "검색": 빌드 색인으로 전체 Day 검색, 잠긴 프로젝트 결과는 제목만.
- 모양·값은 `DESIGN.md`를 따른다:
  - Components > Navigation "검색 Modal"
  - Motion "검색"
  - Accessibility(키보드, `role="status"`)
  - Colors(Quest Pink 선택 막대·밑줄, Track 선택 행, Scrim)
  - Shapes(`--radius-btn`·`--radius-card`), Elevation(그림자 없음, 1px `rule`)
- 마크업·CSS·동작의 출발점은 승인 시안 `design-system/web-zero-to-hundred/prototype/src/`다. 이 폴더는 로컬 전용이다.
  - `template.html` 49~61행
  - `style.css` 335~369행
  - `app.js` 190~335행

**M5 완료 기준(스펙 11.2):**
- ① Ctrl+K로 검색이 열리고 ↑↓ Enter로 이동한다
- ② 잠긴 월드의 결과는 제목만 보인다
- ③ 결과가 없으면 안내 문장이 나온다

**넘겨받은 일:**
- (M1에서) Ctrl+K는 지금 검색 화면으로 이동만 한다. Modal로 바꾸고, `aria-keyshortcuts`와 `<kbd>` 표시는 그대로 둔다.
- (M2에서) Modal은 `views/overlay.js`의 `setupDialog`·`openDialog`·`closeDialog`를 쓴다. 서랍이 열린 채 Ctrl+K를 누르는 경로(`shell.js`)도 Modal로 바꾼다.

## Global Constraints

- **토큰만 쓴다.**
  - 색·글꼴·크기·간격·모서리·모션 값은 `DESIGN.md` 토큰(`var(--…)`)으로만 쓴다. 토큰 파일 밖에 색 값(`#hex`, `rgb(`, `hsl(`)이나 `font-family`를 쓰지 않는다.
  - 숫자를 직접 쓰는 예외는 DESIGN.md가 숫자로 정한 것뿐이다:
    - Modal: `margin: 10dvh auto auto`, 폭 `min(40rem, calc(100% - var(--space-xl)))`, 최대 높이 `76dvh`
    - 입력칸 높이 `40px`, 결과 행 최소 `48px`, 선택 막대 `inset 2px 0 0`, 입력 줄 밑선 `inset 0 -2px 0`, 밑줄 두께 `2px`
    - 닫힘 대체 `260`(이미 `DIALOG_CLOSE_FALLBACK_MS`)
    - Skeleton(Task 2에서 DESIGN.md에 더한다): `200`·`300`(JS), 위치 칸 최소 `72px`
- **The One Pink Rule:** 분홍 면을 새로 만들지 않는다. 검색의 분홍은 다음 두 가지뿐이다:
  - 선택 막대(`box-shadow: inset 2px 0 0 var(--color-accent)`)
  - 일치 글자 밑줄(`text-decoration-color: var(--color-accent)`)
- **The Two Icon Rule:** 검색·닫기는 선 아이콘이다(`{{ICON:search}}`, `{{ICON:close}}`, `icon(...)`). 모든 아이콘은 `aria-hidden`이다.
- **Label-Only Pixel:** Galmuri(`--font-label`)는 위치·태그·바로 가기 머리 글자(Label)에만 쓴다. 제목·이유는 Wanted Sans 15px(`--text-ui`)다.
- **그림자 없음:** Modal은 1px `rule` 테두리와 모서리 12px만 쓴다. 결과 행에 턱을 두지 않는다(누르는 면이 아니라 목록 항목이다).
- **The Fluid Rule:**
  - 320px부터 가로 스크롤이 0이어야 한다.
  - 이유 한 줄은 말줄임(`text-overflow: ellipsis`)이다. 제목은 줄바꿈해도 된다(`overflow-wrap: anywhere`).
  - 새 브레이크포인트를 만들지 않는다. 바뀌는 지점은 기존 `(max-width: 40rem)`(검색 버튼이 아이콘만 남는다)뿐이다.
- **동작 줄이기:**
  - Modal은 바로 닫는다(`closeDialog`가 이미 처리한다).
  - `pop-in`과 페이드는 전역 규칙이 0으로 만든다.
  - Skeleton의 반복 움직임은 멈춘다(정지한 회색 행).
- **Real Progress:** 화면의 숫자("찾은 곳 n개", 용어 n개)는 모두 데이터에서 센다.
- **화면 함수와 공용 함수:**
  - 화면 함수의 입력은 `ctx`뿐이다.
  - 공용 함수를 다시 쓴다: `h`, `getPage`, `getProject`, `lockReason`(`common.js`), `navDayState`, `questState`, `isUnlocked`, `projectState`(`progress.js`), `icon`(`icons.js`), `setupDialog`, `openDialog`, `closeDialog`(`overlay.js`).
- **미루지 않는다:** 작은 문제는 미루지 않는다(CLAUDE.md 7장). 다른 마일스톤 화면이 있어야만 되는 일만 로드맵 11장 해당 행에 `(M5에서 넘김: …)`으로 적는다.
- **커밋·push·기준 이미지:**
  - 커밋과 push는 사용자가 요청할 때만 하고, Task 경로만 고른다.
  - 저장소 파일에 모델 식별자나 개인정보를 쓰지 않는다.
  - 기준 이미지는 사용자 승인 뒤에만 갱신한다(Task 5에서 멈춘다).
- **긴 실행:**
  - e2e·시각 테스트 전에 `NODE_PATH`를 `npm root -g` 출력으로 맞춘다.
  - 긴 실행에는 `timeout`을 건다: e2e `timeout 600`, 시각 `timeout 300`, 전 페이지 점검 `timeout 600`.
  - 이름 필터(`--test-name-pattern`)로 여러 파일을 한꺼번에 돌리지 않는다. 걸린 테스트가 0개인 파일이 끝나지 않는다(2026-11-13 측정). 한 파일만 돌릴 때는 `node --test <파일>`을 쓴다.

## 범위 판정 (실행 전에 정한 것)

**색인과 결과 모양**

- **색인은 빌드가 넣은 전체 텍스트 색인(`cur.search`)과 `search.js` 점수를 쓴다.** 시안의 키워드·요약 점수는 쓰지 않는다. 우리 데이터에는 `keywords`·`summary`가 없고, 원 설계서가 "텍스트 색인으로 전체 Day 검색"을 정했다.
- **결과 행 = 위치 | 제목 + 이유 | 태그.** 시안과 DESIGN.md를 따른다.
  - 위치: Day는 `${project.id.toUpperCase()} Day ${num}`(예: `P1 Day 3`, 시안과 같다), 부록은 `부록`.
  - 이유: 열린 항목은 `search()`의 snippet이다. 잠긴 항목은 `lockReason(cur, requires)`(여는 조건 문장)이고, 본문 조각은 화면에도 DOM에도 없다.
  - 태그(Day): `navDayState`가 `locked` `잠김`, `done` `완료`, `today` `오늘`, `draft` `준비 중`, `open` ``(빈 글자)다. 부록은 잠겼으면 `잠김`, 아니면 ``다.
- **잠긴 결과를 고르면 그 주소로 간다.** 그 화면이 잠금 화면(`lockScreen`)으로 이유를 보여 준다. 지금 검색 페이지의 링크 동작과 같다. 사이드바 잠긴 행처럼 Shake + 토스트로 막지 않는다. 검색은 "찾아서 가 보기"이고 도착 화면이 이미 이유를 말한다. 틀렸다면 고칠 곳은 `choose` 한 곳과 테스트 하나다.

**빈 검색어와 문구**

- **빈 검색어 = 바로 가기.** 시안 `runSearch`를 따른다.
  - 첫 줄은 `questState(cur, prog).dayId`의 Day이고, 이유는 `오늘의 퀘스트`다. 모두 끝내서 `dayId`가 `null`이면 이 줄은 없다.
  - 그 뒤에 `cur.pages`를 순서대로 둔다. 이유는 빌드가 `{n}`을 채운 `page.meta`(없으면 ``)이고, 잠긴 부록은 `lockReason`과 태그 `잠김`이다.
  - 머리 글자는 `바로 가기`다. 검색 페이지도 빈 검색어면 같은 바로 가기를 보인다. 지금의 "검색칸에 찾고 싶은 낱말을 입력해 보세요." 문장은 없앤다.
- **문구는 이 계획서의 것을 그대로 쓴다.**

| 자리 | 문구 |
|---|---|
| 머리 글자(결과 있음) | `찾은 곳 ${n}개` |
| 결과 없음 | `‘${q}’에 맞는 내용이 없어요. 다른 낱말로 찾아보세요.` |
| 입력칸 placeholder | `Day 제목이나 낱말로 찾기` |
| 입력칸 `aria-label` | `교재 검색`(검색 페이지와 같다) |
| dialog `aria-label` | `검색` |
| 닫기 버튼 | `검색 닫기` |
| 아래 안내 | `<kbd>↑</kbd> <kbd>↓</kbd> 고르기`, `<kbd>Enter</kbd> 열기`, `<kbd>Esc</kbd> 닫기` |
| 고른 뒤 알림 | `‘${title}’ 화면을 열었어요.`(`ctx.announce`) |

- 결과가 없을 때의 문구에서 "Day"를 "내용"으로 바꿨다. 시안은 "Day가 없어요"였지만 결과에 부록도 들어간다.

**Modal을 여는 경로와 동작**

- **Ctrl+K와 검색 버튼(`#search-open`) 클릭은 한 함수 `openSearch(opener)`로 간다.**
  - `#/search` 화면이면 그 페이지의 입력칸에 포커스한다. 이미 검색 화면이므로 Modal을 겹쳐 띄우지 않는다. 지금 e2e `Ctrl+K opens search…`의 둘째 절반이 이 동작이다.
  - 그 밖의 화면이면 Modal을 연다.
  - 서랍이 열려 있으면 먼저 바로 닫고(`closeDrawer({ focus: null, immediate: true })`) opener를 `#menu-toggle`로 둔다. 테마 메뉴는 `close(false)`.
  - Modal이 이미 열려 있으면 입력칸 포커스만 한다.
  - 버튼은 `<a href="#/search">`로 남긴다. 다음 경우에는 막지 않는다(새 탭이나 JS 없이도 경로가 산다):
    - 수정 키(Ctrl·Meta·Shift·Alt)를 누른 클릭
    - 가운데 버튼 클릭(`button !== 0`)
- **열 때마다 입력칸을 비우고 바로 가기를 보인다**(시안과 같다). 검색어 입력은 기다리지 않고 바로 검색한다. 이전 계산은 `AbortController`로 멈춘다. 검색 페이지는 지금처럼 180ms를 기다린 뒤 검색하고 주소를 바꾼다(e2e 2개가 이 동작을 지킨다).
- **고르기(`choose`):**
  1. `closeDialog(dlg, { restoreFocus: false, immediate: true })`
  2. `ctx.go(href)`: 같은 주소면 다시 그리고 본문에 포커스하고, 다른 주소면 hashchange가 그린다.
  3. `ctx.announce(...)`
- **창·기록과 함께 닫힘:** 뒤로 가기 등으로 화면이 바뀌면 `shell.onRoute`가 Modal을 바로 닫는다(포커스 복귀 없음, 본문으로).
- **키 처리는 순수 함수 `comboKey`가 정한다**(`overlay.js`, node 테스트).
  - ↑↓는 끝에서 돈다.
  - 다음 두 경우에는 아무 일도 하지 않는다: 한글 조합 중(`isComposing`), 결과 0개.
  - `type="search"`는 첫 Esc에 글자만 지운다. 그래서 Esc는 입력칸에서 직접 받아 한 번에 닫는다.
- **ARIA:**
  - 입력칸: `role="combobox"`, `aria-controls="search-results"`, `aria-autocomplete="list"`, `aria-expanded`(결과가 1개 이상이면 `true`), `aria-activedescendant`(고른 행의 id, 없으면 속성 제거).
  - 결과 목록: `ul#search-results[role="listbox"][aria-labelledby="search-hint"]`.
  - 행: `li.result[role="option"][id="search-opt-<i>"][aria-selected]`. 행 안에 링크를 두지 않는다(combobox 패턴).
  - 머리 글자 `p#search-hint.label[role="status"]`가 개수를 알린다.

**Skeleton과 검색 계산**

- **Skeleton은 결과 목록 자리에서만 보인다.** 개편 설계서 3.5를 따른다.
  - 시작 후 200ms 안에 끝나면 보이지 않는다. 한 번 보이면 최소 300ms 보인다.
  - 모양: 결과 행과 같은 48px 행 3개. `track` 바 2개(위치 칸 72px, 제목 칸 나머지 60%), 모서리 `--radius-btn`.
  - 기다리는 동안 목록에 `aria-busy="true"`를 둔다. 행은 `aria-hidden`이다.
- **"반짝임"은 투명도 반복으로 만든다.** 이것은 판정이다:
  - 투명도 `1 → 0.5 → 1`, 1200ms, 무한 반복.
  - 이유: DESIGN.md "움직이는 속성"에 `background-position`이 없다. 빛줄기를 쓸고 지나가게 하면 다크에서 뒤집히는 밝은 색이 하나 더 필요하다.
  - 틀렸다면 고칠 것은 keyframes 하나다.
- **새 값을 DESIGN.md에 더한다.** Skeleton 값(1200ms, 200·300ms, 위치 칸 72px)은 지금 DESIGN.md에 없다.
  - Task 2에서 더할 글은 아래에 그대로 적어 둔다.
  - **이 계획서 승인이 곧 이 DESIGN.md 수정안의 승인이다**(CLAUDE.md 규칙 1). 사용자가 다른 값을 원하면 계획서를 먼저 고친다.
- **`searchAsync`는 8ms마다 쉬어 간다**(`setTimeout(0)`).
  - 측정: 공개 색인 159항목, 본문 1,106,996자. 이 PC에서 `search` 한 번에 5.6~15ms 걸린다.
  - 그래서 지금은 Skeleton이 거의 보이지 않는다. 쉬지 않고 동기로 계산하면 느린 기기에서 Skeleton 타이머가 아예 돌 수 없다.
  - 접은 글자 캐시(`WeakMap` 항목 → `{ title, text }`)가 두 번째 검색부터 계산을 줄인다. 그래서 "첫 계산"이 가장 느리다.

**검색 페이지와 시각 장면**

- **검색 페이지(`#/search?q=`)는 경로·주소 갱신(replace)·180ms 대기를 그대로 둔다.**
  - 모양은 Modal과 같은 입력 줄 + 결과 행이다. 행은 `li > a.result`(링크)이고, 카드(`.card.search-card`) 안에 둔다.
  - `pages.css`의 옛 `.results`·`.result`·`mark` 규칙을 지운다. 그 결과 쓰는 곳이 0이 된 legacy 변수만 `legacy.css`와 `LEGACY_VARS`에서 뺀다(`rg` 확인 뒤).
- **시각 장면 2개를 더한다:**
  - `search`: `#/`에서 `#search-open`을 누른 Modal, 바로 가기, 3폭.
  - `search-page`: `#/search`, 바로 가기, 3폭.
  - 둘 다 빈 검색어다. 본문을 더 쓸 때마다 snippet이 바뀌어 기준 이미지가 흔들리지 않게 하려는 것이다.
  - 기존 40장은 바뀌지 않아야 한다. 새 12장을 더해 52장이 된다.

## DESIGN.md 수정안 (Task 2에서 그대로 넣는다)

1. Components > Navigation "검색 Modal" 항목 끝에 붙인다:
   > 위치 칸은 최소 72px이다. 잠긴 결과는 이유 자리에 여는 조건 문장을 두고 태그를 "잠김"으로 한다. 본문 조각은 보이지 않는다. 결과가 없으면 목록 자리에 "‘검색어’에 맞는 내용이 없어요. 다른 낱말로 찾아보세요."(15px `ink-2`)가 나온다. 검색 페이지(`#/search`)도 같은 입력 줄과 결과 행을 카드 안에 쓴다(행은 링크).
2. Navigation 아래에 새 항목 `### Skeleton`을 둔다:
   > 늦게 준비되는 곳(검색 결과의 첫 계산, 3D 그림)에만 쓴다. 시작 후 200ms 안에 준비되면 보이지 않고, 한 번 보이면 최소 300ms 보인다. 실제 내용과 같은 크기의 자리표시다. 검색은 48px 행 3개이고, 각 행에 `track` 바 2개(위치 72px, 제목 60%)를 둔다. 바의 높이는 `--text-label`, 모서리는 `--radius-btn`이다. 투명도 1 → 0.5 → 1을 `--dur-skeleton`으로 반복한다(동작 줄이기면 정지). 기다리는 목록에 `aria-busy="true"`를 두고, 자리표시는 `aria-hidden`이다.
3. Motion 토큰 표의 `--dur-celebrate` 다음 줄:
   > `| --dur-skeleton | 1200ms | 같음 | Skeleton 반복 |`
4. Motion 기법 표의 `검색` 다음 줄:
   > `| Skeleton | 검색 결과 자리 | 200ms 뒤에 보임, 최소 300ms, 투명도 1 → 0.5 → 1 var(--dur-skeleton) ease-in-out infinite |`

## Review Focus

1. **한글 조합 중 Enter·↑↓:** 조합을 끝내는 Enter가 결과를 고르거나 행을 옮기면 안 된다.
   → Task 4 `comboKey: keys during IME composition do nothing`
2. **지금 보고 있는 화면을 고를 때**(오늘 Day에서 바로 가기 첫 줄): hashchange가 없어도 Modal이 닫히고 본문에 포커스가 가야 한다.
   → Task 4 `choosing the current screen closes the modal and focuses the main`
3. **빨리 치기:** 앞 검색어의 늦은 결과가 뒤 검색어의 결과를 덮으면 안 된다.
   → Task 1 `searchAsync resolves null once aborted`, Task 3 `typing fast shows only the last query's results`
4. **Ctrl+K 겹치기:** Modal이 이미 열렸을 때, 서랍이 열렸을 때, 테마 메뉴가 열렸을 때 Modal은 하나만 열리고 포커스는 입력칸에 있어야 한다. 닫으면 서랍 경우에는 메뉴 버튼으로 돌아간다.
   → Task 4 `Ctrl+K from the open drawer closes it and opens the modal`, `Ctrl+K while the modal is open keeps one modal`
5. **검색어에 HTML·정규식 글자**(`<img src=x onerror=alert(1)>`, `(.*`): 글자 그대로 보여야 하고, 요소가 생기거나 콘솔 오류가 나면 안 된다.
   → Task 3 `typed HTML stays text in the results`

---

### Task 1: `search.js` — 나눠 계산하는 `searchAsync`와 접은 글자 캐시

**Files:**
- Modify: `textbook/src/app/search.js`
- Test: `tests/unit/search.test.mjs`

**Interfaces:**
- Produces:
  - `searchAsync(index, query, isItemLocked = () => false, { limit = 30, signal, budget = 8, now = () => performance.now(), pause = () => new Promise((r) => setTimeout(r, 0)) } = {}) → Promise<Result[] | null>`
    - `Result` 모양은 `search()`와 같다.
    - `signal.aborted`가 되면 다음 쉼에서 `null`로 끝난다.
    - `now() - 시작 ≥ budget`이면 `await pause()` 뒤 시작 시각을 새로 잡는다.
  - `search()`는 결과·시그니처를 바꾸지 않는다.
- 두 함수는 한 파일 안의 `scoreItem(item, terms) → number | null`과 `finish(hits, terms, isItemLocked, limit)`를 같이 쓴다. 접은 글자 `foldOf(item)`은 `WeakMap`으로 캐시한다. 셋 다 export하지 않는다.

- [ ] **Step 1: 실패하는 테스트를 쓴다.** 기존 `INDEX` 픽스처를 다시 쓴다.

```js
test('searchAsync gives the same results as search', async () => {
  for (const q of ['day', '첫', 'zz 없음', 'HTML 태그', '']) {
    assert.deepEqual(await searchAsync(INDEX, q, LOCKED), search(INDEX, q, LOCKED), q);
  }
});
test('searchAsync pauses whenever the time budget is spent', async () => {
  let t = 0;
  let pauses = 0;
  const big = Array.from({ length: 50 }, (_, i) => ({ id: `d${i}`, kind: 'day', project: 'p', title: `제목 ${i}`, text: '낱말' }));
  const result = await searchAsync(big, '낱말', undefined, { budget: 8, now: () => (t += 1), pause: async () => { pauses++; } });
  assert.equal(result.length, 30);
  assert.ok(pauses >= 5, `쉰 횟수 ${pauses}`);
});
test('searchAsync resolves null once aborted', async () => {
  const ac = new AbortController();
  let t = 0;
  const p = searchAsync(INDEX, 'day', undefined, { signal: ac.signal, budget: 1, now: () => (t += 1), pause: async () => ac.abort() });
  assert.equal(await p, null);
  assert.equal(await searchAsync(INDEX, 'day', undefined, { signal: AbortSignal.abort() }), null);
});
```

- [ ] **Step 2: 실패를 확인한다**

Run: `cd textbook && node --test ../tests/unit/search.test.mjs`
Expected: 새 테스트 3개가 FAIL(`searchAsync` is not exported)이고, 기존 17개는 PASS.

- [ ] **Step 3: `searchAsync`를 구현한다.** `search`의 반복문 몸통을 `scoreItem`으로 빼고, 결과 정렬과 snippet 생성을 `finish`로 뺀다. 두 함수가 이 둘을 같이 쓴다. `foldOf(item)`은 처음 볼 때 `{ title: fold(item.title), text: fold(item.text) }`를 만들어 저장한다.

- [ ] **Step 4: 통과를 확인한다**

Run: `cd textbook && npm test`
Expected: 전부 통과(261/261).

- [ ] **Step 5: 커밋**

```bash
git add textbook/src/app/search.js tests/unit/search.test.mjs
git commit -m "feat(search): time-sliced, abortable searchAsync with folded-text cache"
```

---

### Task 2: Skeleton — 시간 규칙, 자리표시 행, 토큰, DESIGN.md

**Files:**
- Create: `textbook/src/app/views/skeleton.js`
- Modify:
  - `textbook/src/styles/tokens.css`(`--dur-skeleton: 1200ms`, 라이트·다크 같은 값이라 한 곳)
  - `textbook/src/styles/components.css`(`.skeleton-row`, `.skeleton-bar`, `@keyframes skeleton-pulse`, 동작 줄이기)
  - `DESIGN.md`(위 "DESIGN.md 수정안" 4곳)
- Test: `tests/unit/skeleton.test.mjs`(새 파일), `tests/unit/styles.test.mjs`(토큰이 있는지)

**Interfaces:**
- Produces:
  - `SKELETON_DELAY = 200`, `SKELETON_MIN = 300`
  - `skeletonGate({ show, hide }, { delay = SKELETON_DELAY, min = SKELETON_MIN, clock = { now: () => performance.now(), setTimeout, clearTimeout } } = {}) → { finish(apply: () => void): void, cancel(): void }`
    - 만들 때 `delay` 타이머를 건다. 시간이 다 되면 `show()`를 부르고, 보인 시각을 적어 둔다.
    - `finish(apply)`:
      - 아직 안 보였으면 타이머를 지우고 `apply()`를 곧바로 부른다(`show`·`hide` 없음).
      - 보였으면 보인 뒤 `min`이 지난 시점에 `hide()`와 `apply()`를 부른다. 이미 지났으면 곧바로 부른다.
    - `cancel()`: 모든 타이머를 지운다. 보였으면 `hide()`를 부르고, `apply`는 부르지 않는다.
    - 두 번째 `finish`·`cancel`은 아무 일도 하지 않는다.
  - `skeletonRows(count = 3) → HTMLLIElement[]`: 각 행은 `li.skeleton-row[aria-hidden="true"]` > `span.skeleton-bar` × 2다.
  - 이 파일은 맨 위에서 `document`를 읽지 않는다(node가 import한다).

- [ ] **Step 1: 실패하는 테스트를 쓴다.** 수동 시계 `fakeClock()`을 테스트 파일 안에 둔다. 이 시계는 `now`, `setTimeout`, `clearTimeout`, `advance(ms)`를 가진다.

```js
test('skeletonGate: work done within 200ms never shows the skeleton', () => {
  const c = fakeClock(); const log = [];
  const gate = skeletonGate({ show: () => log.push('show'), hide: () => log.push('hide') }, { clock: c });
  c.advance(199); gate.finish(() => log.push('apply')); c.advance(1000);
  assert.deepEqual(log, ['apply']);
});
test('skeletonGate: slow work shows at 200ms and stays at least 300ms', () => {
  const c = fakeClock(); const log = [];
  const gate = skeletonGate({ show: () => log.push(['show', c.now()]), hide: () => log.push(['hide', c.now()]) }, { clock: c });
  c.advance(250); gate.finish(() => log.push(['apply', c.now()])); c.advance(1000);
  assert.deepEqual(log, [['show', 200], ['hide', 500], ['apply', 500]]);
});
test('skeletonGate: finishing after the minimum applies at once', () => { /* advance(800) → finish → ['show',200],['hide',800],['apply',800] */ });
test('skeletonGate: cancel hides without applying, and later calls do nothing', () => { /* advance(250) → cancel → finish(apply) → log ['show','hide'] */ });
test('DESIGN skeleton values', () => { assert.equal(SKELETON_DELAY, 200); assert.equal(SKELETON_MIN, 300); });
```

`styles.test.mjs`: 합친 CSS에 `--dur-skeleton: 1200ms`가 있고, `.skeleton-row` 규칙이 `animation: skeleton-pulse var(--dur-skeleton)`을 쓰는지 확인하는 테스트 하나.

- [ ] **Step 2: 실패를 확인한다**

Run: `cd textbook && npm test`
Expected: 새 테스트 6개가 FAIL이다(모듈 없음, 토큰 없음).

- [ ] **Step 3: 구현한다.**
  - `skeleton.js`를 만든다.
  - 토큰을 더한다.
  - CSS를 더한다:
    - `.skeleton-row`: `display: grid; grid-template-columns: 72px minmax(0, 1fr); align-items: center; column-gap: var(--space-sm); min-height: 48px; padding: var(--space-xs) var(--space-sm); animation: skeleton-pulse var(--dur-skeleton) ease-in-out infinite;`
    - `.skeleton-bar`: `height: var(--text-label); border-radius: var(--radius-btn); background: var(--color-track);`, 둘째 바는 `width: 60%`
    - keyframes: `50% { opacity: 0.5; }`
    - `@media (prefers-reduced-motion: reduce) { .skeleton-row { animation: none; } }`
  - DESIGN.md 4곳을 고친다.

- [ ] **Step 4: 통과를 확인한다**

Run: `cd textbook && npm test && npm run check -- --allow-missing`
Expected: 전부 통과(267/267), "검사 통과".

- [ ] **Step 5: 커밋**

```bash
git add textbook/src/app/views/skeleton.js textbook/src/styles/tokens.css textbook/src/styles/components.css DESIGN.md tests/unit/skeleton.test.mjs tests/unit/styles.test.mjs
git commit -m "feat(ui): skeleton gate (200ms delay, 300ms minimum) and placeholder rows"
```

---

### Task 3: 결과 공용 부품과 새 검색 페이지

**Files:**
- Create: `textbook/src/app/views/results.js`
- Modify:
  - `textbook/src/app/views/search.js`(공용 부품으로 다시 쓴다. 경로·180ms·replace는 그대로)
  - `textbook/src/styles/components.css`(결과 행·입력 줄·`mark`)
  - `textbook/src/styles/pages.css`(옛 검색 규칙 삭제, `.search-card`)
  - `textbook/src/styles/legacy.css` + `textbook/lib/styles.mjs`(쓰는 곳이 0이 된 옛 변수만 뺀다)
- Test:
  - `tests/unit/results.test.mjs`(새 파일)
  - `tests/e2e/search.test.mjs`(새 파일, `motion.test.mjs`처럼 픽스처를 빌드하고 `withPage`)
  - `tests/e2e/textbook.test.mjs`(`search hides locked snippet`의 선택자를 고친다)
  - `tests/e2e/layout.test.mjs`(검색 페이지 테스트 2개의 선택자를 확인한다)

**Interfaces:**
- Consumes: Task 1의 `searchAsync`, Task 2의 `skeletonGate`·`skeletonRows`.
- Produces(`views/results.js`, 맨 위에서 `document`를 읽지 않는다):
  - `isItemLocked(ctx, item) → boolean`: 지금 `views/search.js`에 있는 것을 옮긴다.
  - `resultModel(ctx, result) → { id, href, where, title, why, tag, locked }`: 값은 "범위 판정"을 따른다. `why`는 잠기면 `lockReason(...)`, 아니면 `result.snippet`이다.
  - `shortcutModels(ctx) → Model[]`: 오늘의 퀘스트 + 부록.
  - `hintText(q, count) → string`: 빈 검색어 `바로 가기`, 결과 있음 `찾은 곳 ${n}개`, 결과 없음 ``.
  - `emptyText(q) → string`: `‘${q}’에 맞는 내용이 없어요. 다른 낱말로 찾아보세요.`
  - `highlight(text, terms) → (string | HTMLElement)[]`: `<mark>`를 만든다. 글자는 textContent로만 넣는다(지금 함수를 옮긴다).
  - `resultParts(model, terms) → HTMLElement[]`: 다음 세 요소다.
    - `span.result-where.label`
    - `span.result-body` > `span.result-title`(일치 표시) + `span.result-why`(일치 표시, 잠기면 일치 표시 없음)
    - `span.result-tag.label`
  - `createResultsView(ctx, { list, hint, empty, row }) → { update(query: string): Promise<void>, models(): Model[], cancel(): void }`
    - `update`는 앞 계산을 `abort`한다. 그다음 `skeletonGate({ show: () => list.replaceChildren(...skeletonRows()) + list.setAttribute('aria-busy','true'), hide: () => list.removeAttribute('aria-busy') })`와 함께 `searchAsync`를 돌린다.
    - 끝나면(`null`이 아니면) `gate.finish`로 그린다: `list`에 `row(model, terms, i)`, `hint.textContent = hintText`, `empty.hidden`과 `empty.textContent`.
    - 빈 검색어는 계산 없이 곧바로 바로 가기를 그린다.
    - 반환한 `Promise`는 그린 뒤에 풀린다.
- 검색 페이지 마크업:

```text
section.search-view
  h1 "검색"
  .card.search-card
    label.search-field
      icon('search')
      input.search-input
    p#…label[data-testid="search-summary"][role="status"]
    ul.results
      li[data-testid="search-result"][data-id][data-locked]
        a.result[href]
          resultParts
    p.search-empty[hidden]
```

  `input.search-input`의 `data-testid`, `aria-label`, `type`은 지금과 같다.
- CSS(시안 `style.css` 347~369행을 옮긴다):
  - `.search-field`, `.result`(Modal은 `li.result`, 페이지는 `a.result`, 모양은 같다)
  - `.result[aria-selected="true"], a.result:focus-visible`는 `track` + 분홍 막대
  - `.result-title { overflow-wrap: anywhere; }`
  - `mark`: 바탕 없음, `text-decoration: underline 2px var(--color-accent)`, `text-underline-offset: 0.18em`

- [ ] **Step 1: 실패하는 테스트를 쓴다.**

`tests/unit/results.test.mjs`는 직접 만든 작은 `cur`·`prog`로 테스트한다. 월드 `p1`(Day 2개), 월드 `p2`(`requires: ['p1']`, Day 1개), 부록 `start`(`meta`), 잠긴 부록 `secret`(`requires: ['p2']`)을 둔다.

```js
test('resultModel: a day result has where, tag and the snippet as why', …
  // { id:'p1-d1', kind:'day', project:'p1', title:'첫 Day', snippet:'…본문…' }, 진도 없음
  // → { where:'P1 Day 1', tag:'오늘', why:'…본문…', locked:false, href:'#/day/p1-d1' }
test('resultModel: a locked day shows only the title and why it is locked', …
  // p2 Day, snippet null → { locked:true, tag:'잠김', why:'‘…p1 제목…’ 프로젝트를 끝내면 열려요.' }
test('resultModel: done and draft days are tagged', …  // '완료', '준비 중'(ready:false)
test('shortcutModels: today first, then every page; none for today when all done', …
  // 진도 없음 → ids ['p1-d1','start','secret'], whys ['오늘의 퀘스트','교재 쓰는 법…', lockReason]
  // 모두 완료 → ids ['start','secret']
test('hintText and emptyText', …
  // hintText('',0)='바로 가기', hintText('a',3)='찾은 곳 3개', hintText('a',0)=''
  // emptyText('zz')='‘zz’에 맞는 내용이 없어요. 다른 낱말로 찾아보세요.'
```

`tests/e2e/search.test.mjs`(검색 페이지 부분):

```js
test('search page with no query lists the shortcuts', …  // #/search
  // [data-testid=search-summary] '바로 가기'; data-id 순서 ['fa-d01','start','secret','glossary']
  // fa-d01 .result-why '오늘의 퀘스트', .result-tag '오늘'; secret .result-tag '잠김'
test('search page shows the guidance sentence when nothing matches', …  // #/search?q=zzqq없음
  // .search-empty 보임, 글자 '‘zzqq없음’에 맞는 내용이 없어요. 다른 낱말로 찾아보세요.', 결과 0, summary ''
test('search page: a locked day shows its title and lock reason, never its text', …  // q=비밀단어zz
  // fb-d01 data-locked 'true', .result-tag '잠김', .result-why '‘픽스처 프로젝트 A’ 프로젝트를 끝내면 열려요.', innerText 에 '비밀단어zz' 없음
test('typing fast shows only the last query\'s results', …  // pressSequentially('첫 번째', { delay: 0 })
  // 결과가 '첫'·'번째' 둘 다 들어간 것만(fa-d01), 주소 #/search?q=%EC%B2%AB%20%EB%B2%88%EC%A7%B8
test('typed HTML stays text in the results', …  // q=<img src=x onerror=alert(1)> 와 (.*
  // main 안 img 0개, .search-empty 글자에 '<img' 가 그대로, 콘솔 오류 0
test('search page fits 320px with no horizontal scroll', …
```

`textbook.test.mjs` `search hides locked snippet`에서 바꿀 것:
- `.snippet` 개수 0 → `.result-why` 글자가 여는 조건 문장이다.
- 나머지 단언(SECRET이 없음, `/비밀 Day/`, 결과 1개, 잠긴 페이지)은 그대로 둔다.

- [ ] **Step 2: 실패를 확인한다**

Run: `cd textbook && node --test ../tests/unit/results.test.mjs; npm run build && NODE_PATH="$(npm root -g)" timeout 600 node --test ../tests/e2e/search.test.mjs`
Expected: 단위 5개 FAIL(모듈 없음), e2e 6개 FAIL(바로 가기·새 클래스 없음).

- [ ] **Step 3: 구현한다.**
  - `results.js`를 만든다.
  - `search.js`(화면)를 다시 쓴다. 입력 처리는 지금 코드를 남기고, `run()`이 `view.update(input.value)`를 부르게 한다. 화면을 떠날 때 `ctx.onCleanup(view.cancel)`을 건다.
  - CSS를 옮기고 지운다.
  - `rg -n "var\(--(surface-2|tip-bg|tip-line)\)" textbook/src/styles` 등으로 옛 변수가 쓰이는 곳을 확인하고, 0인 것만 `legacy.css`와 `LEGACY_VARS`에서 뺀다.

- [ ] **Step 4: 통과를 확인한다**

Run: `cd textbook && npm test && npm run build && NODE_PATH="$(npm root -g)" timeout 600 npm run test:e2e`
Expected: 단위 전부 통과(272/272), e2e 전부 통과(131/131).

- [ ] **Step 5: 커밋**

```bash
git add textbook/src/app/views/results.js textbook/src/app/views/search.js textbook/src/styles/components.css textbook/src/styles/pages.css textbook/src/styles/legacy.css textbook/lib/styles.mjs tests/unit/results.test.mjs tests/e2e/search.test.mjs tests/e2e/textbook.test.mjs tests/e2e/layout.test.mjs
git commit -m "feat(search): shared result rows, shortcuts and lock reasons; redesigned search page"
```

---

### Task 4: 검색 Modal — 틀, combobox, Ctrl+K·버튼·서랍 경로

**Files:**
- Create: `textbook/src/app/views/searchmodal.js`
- Modify:
  - `textbook/src/template.html`(서랍 `<dialog>` 다음에 검색 dialog)
  - `textbook/src/app/views/overlay.js`(`comboKey`)
  - `textbook/src/app/views/shell.js`(Ctrl+K 처리 교체, 버튼 클릭, `onRoute`)
  - `textbook/src/styles/shell.css`(Modal 틀: 서랍 규칙 옆, 같은 `pop-in`·`fade-*` keyframes)
- Test:
  - `tests/unit/overlay.test.mjs`
  - `tests/e2e/search.test.mjs`
  - `tests/e2e/layout.test.mjs`(`Ctrl+K opens search from any screen…`를 Modal로)
  - `tests/e2e/textbook.test.mjs`(`Ctrl+K from the open drawer goes to search`를 지우고 `search.test.mjs`로 옮긴다)

**Interfaces:**
- Consumes: Task 3의 `createResultsView`·`resultParts`·`shortcutModels`, overlay의 dialog 함수 3개, `ctx.go`, `ctx.announce`.
- Produces:
  - `comboKey(key, { index, count, composing }) → { type: 'move', index } | { type: 'choose' } | { type: 'close' } | null`(`overlay.js`)
    - `ArrowDown`: `(index + 1) % count`
    - `ArrowUp`: `index <= 0 ? count - 1 : index - 1`
    - `Enter`: `index >= 0 && count > 0`이면 `choose`
    - `Escape`: `close`
    - `composing`이거나 `count === 0`이면 ↑↓·Enter가 `null`이다. Esc는 `count`와 상관없이 `close`이고, 조합 중이면 `null`이다.
  - `createSearchModal(ctx, dlg) → { open(opener?: Element): void, close(opts?: { restoreFocus?, immediate? }): void, isOpen(): boolean, focusInput(): void }`
    - `open`은 입력칸을 비우고, `view.update('')`를 부르고, `openDialog`를 부르고, 입력칸에 포커스한다.
    - 행의 클릭과 `choose`는 "범위 판정"을 따른다.
    - 고른 행은 `aria-selected`와 `input[aria-activedescendant]`를 바꾸고, `scrollIntoView({ block: 'nearest' })`를 부른다.
    - 결과를 새로 그리면 고른 행은 0번(없으면 -1)이다.
  - 틀(`template.html`): 시안 49~61행을 따른다.
    - `<dialog id="search-dialog" class="search" data-testid="search-modal" aria-label="검색">`
    - 입력칸: `data-testid="search-modal-input"`, `role="combobox"`, `aria-expanded="false"`, `aria-controls="search-results"`, `aria-autocomplete="list"`, `aria-label="교재 검색"`, `placeholder`, `autocomplete="off"`, `spellcheck="false"`, `enterkeyhint="go"`
    - 닫기 버튼: `#search-close`
    - 몸통: `.search-body` > `p#search-hint` + `ul#search-results` + `p.search-empty[hidden]`
    - 아래 안내: `p.search-foot`
    - `closedby`는 `setupDialog`가 붙인다.
  - 셸:
    - `openSearch(opener)`: "범위 판정"을 따른다.
    - 문서 keydown의 Ctrl/⌘+K 처리(조건은 지금과 같고 `!event.repeat`를 더한다) → `openSearch(document.activeElement)`
    - `#search-open` click(수정 키 없음, `button === 0`) → `preventDefault()` + `openSearch(event.currentTarget)`
    - `onRoute`: Modal이 열려 있으면 `close({ restoreFocus: false, immediate: true })`
- CSS: 시안 336~346행(`.search`, `[open]`, `::backdrop`, `.is-closing`)과 `.search-body`(`overflow-y: auto`), `.search-foot`, `.search-empty`를 옮긴다. 결과 행 규칙은 Task 3의 것을 다시 쓴다.

- [ ] **Step 1: 실패하는 테스트를 쓴다.**

`overlay.test.mjs`:

```js
test('comboKey: arrows wrap, Enter chooses the active option, Escape closes', () => {
  assert.deepEqual(comboKey('ArrowDown', { index: 2, count: 3, composing: false }), { type: 'move', index: 0 });
  assert.deepEqual(comboKey('ArrowUp', { index: 0, count: 3, composing: false }), { type: 'move', index: 2 });
  assert.deepEqual(comboKey('ArrowUp', { index: -1, count: 3, composing: false }), { type: 'move', index: 2 });
  assert.deepEqual(comboKey('Enter', { index: 1, count: 3, composing: false }), { type: 'choose' });
  assert.deepEqual(comboKey('Escape', { index: -1, count: 0, composing: false }), { type: 'close' });
  assert.equal(comboKey('Tab', { index: 0, count: 3, composing: false }), null);
});
test('comboKey: no results means arrows and Enter do nothing', …  // count 0 → ArrowDown·Enter null
test('comboKey: keys during IME composition do nothing', …  // composing true → ArrowDown·Enter·Escape 모두 null
```

`search.test.mjs`(Modal 부분, 도우미 `const modal = (page) => page.getByTestId('search-modal')`, `const opts = (page) => modal(page).locator('[role="option"]')`):

```js
test('Ctrl+K opens the search modal with shortcuts and focus in the input', …  // #/settings, 1280
  // modal open, activeElement testid 'search-modal-input', hash 그대로 '#/settings'
  // #search-hint '바로 가기', opts data-id ['fa-d01','start','secret','glossary']
  // input aria-expanded 'true', aria-activedescendant === 첫 옵션 id, 첫 옵션 aria-selected 'true'
  // #search-open aria-keyshortcuts 'Control+K', kbd 'Ctrl K' 그대로
test('arrow keys move the active option and Enter opens it', …  // 검색어 'Day'
  // ArrowDown → 둘째 aria-selected, activedescendant 둘째 id; ArrowUp 두 번 → 마지막
  // Enter → main[data-hash="#/day/<그 id>"] 또는 '#/page/<id>', modal 닫힘, activeElement id 'main'
  // #live 글자 /화면을 열었어요\.$/
test('locked results in the modal show only the title and why', …  // '비밀단어zz'
  // 옵션 1개 fb-d01, data-locked 'true', 태그 '잠김', 이유 '‘픽스처 프로젝트 A’ 프로젝트를 끝내면 열려요.', 글자에 '비밀단어zz' 없음
test('no results: guidance sentence, collapsed combobox, Enter stays put', …  // 'zzqq없음'
  // .search-empty 문장, opts 0, aria-expanded 'false', aria-activedescendant 없음, Enter 뒤에도 modal open
test('Esc closes at once even with text, and focus returns to the search button', …  // 버튼 클릭으로 열기 → 글자 입력 → Escape 한 번
  // eventually modal closed, activeElement id 'search-open', hash 그대로
test('a plain click on the search button opens the modal, a modified click keeps the link', …
  // 클릭 → modal open, hash '#/'; evaluate 로 ctrlKey click 이벤트를 보내면 defaultPrevented false
test('Ctrl+K from the open drawer closes it and opens the modal', …  // 375
  // drawer 닫힘, modal open, 입력 포커스; Escape → activeElement id 'menu-toggle'
test('Ctrl+K while the modal is open keeps one modal', …  // 두 번 → dialog[open] 1개, 입력 포커스
test('Ctrl+K on the search page focuses the page input instead', …  // #/search, main h1 포커스 → Ctrl+K → activeElement testid 'search-input', modal 닫힘
test('choosing the current screen closes the modal and focuses the main', …  // #/day/fa-d01 에서 Enter(첫 줄 fa-d01)
  // modal 닫힘, activeElement id 'main', 콘솔 오류 0
test('going back closes the modal', …  // #/ → #/settings → Ctrl+K → history.back() → main[data-hash="#/"], modal 닫힘
test('reduced motion closes the modal at once', …  // reducedMotion 'reduce', Escape 직후(대기 없이) open false
test('the modal fits 320px with no horizontal scroll', …  // 폭 = 320 - 32 ± 1, scrollWidth ≤ innerWidth
```

`layout.test.mjs` `Ctrl+K opens search from any screen and focuses the input`를 바꾼다:
- 첫 절반: `#/settings`에서 Ctrl+K → `search-modal` 열림 + `search-modal-input` 포커스.
- 둘째 절반(검색 페이지에서 Ctrl+K → `search-input`)은 그대로 둔다.

- [ ] **Step 2: 실패를 확인한다**

Run: `cd textbook && npm test; npm run build && NODE_PATH="$(npm root -g)" timeout 600 npm run test:e2e`
Expected: 단위 3개 FAIL(`comboKey` 없음). e2e는 Modal 테스트 13개와 layout 1개가 FAIL이다. `Ctrl+K on the search page…`는 지금도 통과할 수 있다(검색 페이지 동작이 이미 같다). 나머지는 통과.

- [ ] **Step 3: 구현한다.**
  - `comboKey`를 만든다.
  - 틀을 더한다.
  - `searchmodal.js`를 만든다. 입력칸 `input` 이벤트마다 `view.update(value)`를 부르고, `keydown`은 `comboKey(event.key, { index, count, composing: event.isComposing || event.keyCode === 229 })`로 정한다.
  - `shell.js`에서 지금 Ctrl+K 코드(129~140행)를 `openSearch`로 바꾼다. `createSearchModal(ctx, $('search-dialog'))`는 셸이 만든다. 테마 메뉴는 `themeMenuCtl.close(false)`로 닫는다.
  - CSS를 더한다.

- [ ] **Step 4: 통과를 확인한다**

Run: `cd textbook && npm test && npm run build && NODE_PATH="$(npm root -g)" timeout 600 npm run test:e2e`
Expected: 단위 전부 통과(275/275), e2e 전부 통과(143/143, `textbook.test` 1개를 옮겼다).

- [ ] **Step 5: 커밋**

```bash
git add textbook/src/app/views/searchmodal.js textbook/src/template.html textbook/src/app/views/overlay.js textbook/src/app/views/shell.js textbook/src/styles/shell.css tests/unit/overlay.test.mjs tests/e2e/search.test.mjs tests/e2e/layout.test.mjs tests/e2e/textbook.test.mjs
git commit -m "feat(search): Ctrl+K search modal with combobox keys, drawer and route handling"
```

---

### Task 5: 느린 기기의 Skeleton, 기준 이미지, 전 페이지 점검, 문서

**Files:**
- Modify:
  - `tests/e2e/search.test.mjs`(실제 교재 빌드로 Skeleton 2개)
  - `tests/visual/visual.test.mjs`(장면 2개, `open` 다음 기다릴 선택자 `waitFor`)
  - `tests/visual/baseline/`(승인 뒤 12장)
  - `docs/CHECKPOINT.md`, `docs/checkpoint/workspace/progress.md`
  - `docs/superpowers/specs/2026-11-12-unified-roadmap-design.md`(M13 행에 `(M5에서 넘김: Skeleton은 views/skeleton.js 의 skeletonGate·skeletonRows 를 쓴다. 값은 DESIGN.md Skeleton)`)

**Interfaces:**
- Consumes: Task 1~4의 모든 것.
- 시각 장면:
  - `{ id: 'search', hash: '#/', progress: P1_FIRST_THREE, open: '#search-open', waitFor: '#search-dialog[open]' }`
  - `{ id: 'search-page', hash: '#/search', progress: P1_FIRST_THREE }`
  - 기존 `drawer` 장면에는 `waitFor: '#drawer[open]'`을 적는다. `shoot()`은 `scene.waitFor`를 기다린다(지금 고정된 `#drawer[open]` 대신).

- [ ] **Step 1: 실패하는 테스트를 쓴다.** `search.test.mjs`에 실제 교재(`textbook/content`, `allowMissing: true`) 빌드를 하나 더 둔다. 이 빌드는 그 테스트 묶음의 `before`에서 만든다.

```js
test('a slow first search shows the skeleton for at least 300ms', …  // 실제 교재, 1280
  // CDP: const cdp = await context.newCDPSession(page); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 30 })
  // Ctrl+K 전에 MutationObserver 로 #search-results 에 .skeleton-row 가 붙고 떨어진 시각을 window.__sk 에 기록
  // 'html' 입력 → 결과가 그려질 때까지 → __sk.shown 있음, __sk.hidden - __sk.shown ≥ 290, 그동안 aria-busy 'true' 였음
test('a fast search never flashes the skeleton', …  // 같은 교재, 감속 없음, 두 번째 검색('css')
  // __sk.shown 없음
```

- [ ] **Step 2: 실패를 확인한다**

Run: `cd textbook && npm run build && NODE_PATH="$(npm root -g)" timeout 600 node --test ../tests/e2e/search.test.mjs`
Expected: Skeleton 테스트가 FAIL하면 원인을 찾는다. Task 3이 이미 Skeleton을 붙였으므로 둘 다 처음부터 통과할 수 있다. 그때는 `SKELETON_DELAY`를 잠시 `99999`로 바꿔서 첫 테스트가 실패하는 것을 본 뒤 되돌린다(테스트가 진짜를 재는지 확인).
- 감속 30배로도 200ms를 넘지 않으면 `rate`를 60으로 올린다. 판정은 원장에 적는다.

- [ ] **Step 3: 시각 장면을 더하고 돌린다.**

Run: `cd textbook && npm run build && NODE_PATH="$(npm root -g)" timeout 300 npm run test:visual`
Expected: 기존 40장은 통과한다(검색 버튼과 셸은 그대로). 새 12장은 "기준 이미지 없음"으로 실패한다.
- 기존 장면이 바뀌었으면 원인을 찾아 고친다.
- 새 장면 스크린샷(`tests/visual/output/`)은 375·768·1280 × 라이트·다크로 사용자에게 보인다(SendUserFile).
- 승인 시안(`prototype/home.html`을 열고 Ctrl+K)의 Modal과 나란히 대조한다.

- [ ] **Step 4: 멈춘다 — 사용자 승인.** 기준 이미지 12장 추가를 묻는다(번호 선택지). 승인을 받으면 아래를 실행한다.

Run: `cd textbook && NODE_PATH="$(npm root -g)" timeout 300 npm run test:visual:update && NODE_PATH="$(npm root -g)" timeout 300 npm run test:visual`
Expected: 54/54 통과(기준 이미지 52장 + 비교 함수 2개).

- [ ] **Step 5: 전체 기준선과 전 페이지 점검.**

Run:

```bash
cd textbook
npm test
npm run check -- --allow-missing
npm run build
NODE_PATH="$(npm root -g)" timeout 600 npm run test:e2e
npm run build:site
```

그다음 `_site`를 로컬 정적 서버로 띄우고 점검한다. 서버는 별도 프로세스이거나 비동기 `spawn`이어야 한다.

```bash
NODE_PATH="$(npm root -g)" timeout 600 npm run check:site -- http://127.0.0.1:<port>/
```

Expected: 단위 전부 통과, "검사 통과", e2e 전부 통과, 4폭 각각 "방문 168개, 문제 0개".

- [ ] **Step 6: 문서를 고치고 커밋한다.**
  - `CHECKPOINT.md`: 상태를 "M5 완료, 다음 M6"으로 바꾸고, 기준선 숫자와 0장 끝난 것에 M5 줄을 넣는다.
  - `progress.md`: M5 완료 줄을 넣는다.
  - 로드맵 M13 행에 넘김을 적는다.

```bash
git add tests/e2e/search.test.mjs tests/visual/visual.test.mjs tests/visual/baseline docs/CHECKPOINT.md docs/checkpoint/workspace/progress.md docs/superpowers/specs/2026-11-12-unified-roadmap-design.md
git commit -m "test(search): slow-device skeleton and search scenes; docs: M5 complete"
```
