# M7 월드 페이지·부록 페이지 틀 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. 이 프로젝트는 Native(executing-plans)로 실행한다.

**Goal:** 월드(프로젝트) 페이지를 결과물 문장·기술 칩·Day 목록으로 다시 입히고, 부록 네 페이지(시작하기, 탈출 가이드, 용어 사전, 문제 해결 모음)에 공통 머리와 목차를 주고, 용어 사전에는 ㄱㄴㄷ 색인을, 문제 해결 모음에는 월드·Day 목차와 증상별 Accordion을 붙인다.

**Architecture:** 월드 페이지는 `views/project.js`가 조립만 하고 모양은 DESIGN.md에 새로 넣는 "월드 페이지" 부품을 따른다. 용어 색인과 문제 해결 목차·Accordion은 빌드(`lib/glossary.mjs`)가 HTML로 미리 그린다(JS 없이도 `<details>`가 열린다). 앱(`views/page.js`)은 공통 머리, 찾아온 항목 열기, "모두 펼치기"만 더한다. Accordion 등장 모션은 사이드바와 같은 함수를 `motion.js`로 올려 같이 쓴다.

**Tech Stack:** 바닐라 ESM, `<details>`/`<summary>`, `node:test`, 전역 Playwright 1.63.0(Chromium), pixelmatch 시각 테스트.

**Spec:** `docs/superpowers/specs/2026-11-12-unified-roadmap-design.md` 11장 M7 행, 4장, 7장, 9장(공개 범위). 보조: `docs/superpowers/specs/2026-11-11-textbook-redesign-design.md` 3.4 그 밖의 페이지, 5.4 Accordion. 원 설계서 4장 부록 행.

## Global Constraints

- 색·글꼴·크기·간격·모서리·그림자·모션 값은 DESIGN.md 토큰(`var(--…)`)으로만 쓴다. 토큰 블록 밖에 색 값·`font-family`를 쓰지 않는다.
- DESIGN.md에 없는 부품(월드 페이지, 진도 막대, 부록 머리, 목차 카드, 증상 Accordion, 찾아온 항목)은 아래 "DESIGN.md 추가안"을 이 계획서 승인으로 승인받은 것으로 보고 Task 1~3에서 그대로 넣는다. 그 밖의 새 값이 필요하면 멈추고 승인을 받는다.
- 본문 글(`.page-body`의 h2·p·표 등)의 모양과 줄간격은 M8·M9 범위다. M7은 건드리지 않는다.
- One Pink: 월드 페이지의 분홍은 오늘 Day 번호 네모 하나뿐이다. 오늘 Day가 다른 월드에 있으면 분홍이 없다. 주 버튼을 두지 않는다.
- Real Progress: 초록은 완료한 Day와 완료 비율 막대에만 쓴다.
- 링크 주소는 해시 경로(`#/page/<id>/<anchor>`)로 쓰고, 사이트 이름·주소는 `curriculum.json`의 `title`·`url`만 쓴다.
- 배포본(`--published`)에는 리뷰를 통과한 Day만 넣는다(로드맵 9장, R55). 문제 해결 항목도 같은 규칙을 따른다(범위 판정 3).
- 파일 하나, 외부 요청 0건. 지어낸 수치 금지(개수는 빌드가 센 값). 모델 식별자·개인정보 금지.
- Fluid Rule: 320px부터 가로 스크롤 0. 바뀌는 지점은 DESIGN.md 브레이크포인트(640px 등)만 쓴다.
- 동작 줄이기면 Accordion 등장 모션이 없고 바로 펼쳐진다.
- 기준선: `npm test`, `npm run check -- --allow-missing`, `npm run test:e2e`, `npm run test:visual`, `npm run check:site`가 모두 통과해야 완료다. 시각 기준 이미지는 사용자 승인 뒤에만 갱신한다.
- 커밋은 Task 경로만 고른다. push는 사용자가 요청할 때만 한다.

## Review Focus

1. 문제 해결 항목 하나로 바로 오는 주소(`#/page/troubleshooting/<항목 id>`) → 그 항목이 펼쳐지고 그 자리로 스크롤된다. (Task 3 `a deep link opens and scrolls to that symptom`)
2. 없는 id나 본문 밖 id로 온 주소 → 맨 위에서 열리고 아무 항목도 펼쳐지지 않는다. (Task 3 `an unknown anchor opens the page at the top with everything closed`)
3. 320px에서 긴 증상 제목(코드 포함)·색인·목차 줄이 줄바꿈된다 → 세 페이지와 월드 페이지 모두 가로 스크롤 0. (Task 3 `world and appendix pages have no sideways scroll from 320px up`)
4. 오늘 Day가 다른 월드에 있을 때 월드 페이지 → 분홍 네모가 없다. (Task 1 `no pink square when today is in another world`)
5. 배포본 빌드에서 공개 범위 밖 Day의 증상 → 페이지·목차·개수에서 빠진다. (Task 3 `published build drops symptoms of unpublished days`)

## 범위 판정

1. **"Day 노드 목록"**(개편 설계서 3.4): 월드 페이지에는 홈 월드맵(보드 칸)을 다시 두지 않는다. 사이드바 Day 행을 넓힌 행(번호 | 제목 + 요약 | 시간·상태)으로 상태 5종 중 열린 월드에 나오는 4종(완료·오늘·준비 중·남음)을 보인다. 잠긴 월드는 지금처럼 잠금 화면이다.
2. **"용어로 바로 간다"**: 색인(기호·숫자 → ㄱ~ㅎ 14자 → A~Z, 있는 글자만)으로 그 묶음에 가고, 용어 하나는 지금의 `#/page/glossary/term-<slug>` 주소로 간다(본문 용어 링크·검색과 같다). 거르기 입력칸은 만들지 않는다(검색 Modal이 이미 있다).
3. **문제 해결 공개 범위**: 지금은 `--published` 빌드에도 리뷰 전인 P2 Day 11~20의 증상이 실린다(측정: `published.json`은 `p2: [1, 10]`, `p2-days-11-20.md` 55개). 항목마다 첫 "관련" Day를 읽어, 공개 범위 밖이면 뺀다. 관련 줄이 없는 항목은 둔다(측정: 지금은 0개).
4. **목차 묶음**: 항목을 첫 "관련" Day로 묶는다(측정: 305개 모두 관련 줄이 있고 11개는 Day가 둘 이상 → 첫 Day). 다른 월드의 Day이거나 관련 줄이 없으면 그 월드의 "그 밖의 증상" 묶음 맨 뒤에 둔다.
5. **`<summary>` 안에 제목 태그를 넣지 않는다**: `summary`의 button 역할 때문에 안의 heading이 일부 화면 낭독기에서 사라진다([Scott O'Hara](https://www.scottohara.me/blog/2022/09/12/details-summary.html), [Hassell Inclusion](https://hassellinclusion.com/blog/accessible-accordions-part-2-using-details-summary/)). 그래서 월드(h2)·Day(h3) 묶음 제목이 heading이고, 증상 제목은 `summary`의 글자다.
6. **퀘스트 로그 자리의 목차**(개편 설계서 3.4 "목차가 있을 때만 퀘스트 로그")는 퀘스트 로그를 만드는 M10에서 한다. M7은 본문 맨 위 목차 카드로 둔다. 문제 해결 Accordion의 인쇄 펼침은 인쇄 스타일을 만드는 M14에서 한다. 두 가지를 로드맵 해당 행에 적는다(Task 4).
7. **"모두 펼치기"**(5.4)는 문제 해결 모음에만 둔다. Accordion이 그 페이지에만 있다.
8. 시작하기·탈출 가이드는 공통 머리(도트 그림 + 제목 + 설명)만 바꾼다. 본문은 Markdown 그대로다.

## DESIGN.md 추가안 (Task 1~3에서 나눠 넣는다)

Components > Cards, "준비 중 Day 칸" 다음 줄 (Task 1):

- **월드 페이지:** 빵부스러기 → 머리(월드 카드와 같은 40px 문장 칸 + 엠블럼 3배, 월드 태그 Label, 제목, lead, 설명 Body `ink-2`) → 결과물 카드(기본 카드, 안쪽 `var(--space-lg)`, 640px 이하 `var(--space-md)`, 세로 간격 `var(--space-sm)`: Label 머리 "끝나면 남는 결과물", 결과물 문장 Body `ink` 800, 기술 칩 전부, 사실 줄 작업 폴더·진도 `n / 전체 Day 완료`, 진도 막대) → 제목 "Day 목록" → Day 목록 카드(기본 카드, 안쪽 `var(--space-2xs)`).
- **월드 페이지 Day 행:** `grid-template-columns: 28px minmax(0, 1fr) auto`, 최소 48px, 안쪽 `var(--space-sm)`, 모서리 6px, 행 사이 1px `rule` 선, hover `track`, 누름 `rule`. 번호는 사이드바 Day 행과 같다(오늘은 24px 분홍 네모, 800, `aria-current="step"`). 가운데는 제목(15px 800)과 요약(15px `ink-2`). 오른쪽은 예상 시간 Label과 상태 표시(완료 초록 도트 체크와 제목 `ink-2`, 준비 중 Galmuri "준비 중"). 640px 이하에서 오른쪽 칸은 가운데 칸 아래로 내려간다.
- **진도 막대:** 높이 `var(--space-sm)`, 바탕 `track`, 모서리 `--radius-btn`, 채움 `progress`(완료 비율만). 폭은 움직이지 않는다.

Components > Cards, 위 다음 줄 (Task 2):

- **부록 머리:** 빵부스러기 → 도움말 도트 그림 3배(막혔을 때 칸과 같은 그림) → 제목 → lead(`ink-2`, 페이지 설명). 그림이 없는 페이지는 그림 없이 같다.
- **목차 카드(용어 색인·문제 해결 목차):** 기본 카드, 안쪽 `var(--space-md)`, Label 머리. 색인·Day 링크 칸: 최소 40×40px(`pointer: coarse`에서 44px), 15px 800 `ink`, 모서리 6px, 1px `rule` 테두리, hover `track`, 칸 사이 `var(--space-2xs)`, 줄바꿈 허용.
- **용어 묶음:** 묶음 제목(Title small) 아래 용어 항목. 항목 사이 1px `rule` 선, 위아래 `var(--space-md)`.
- **찾아온 항목:** 주소로 찾아온 용어·증상은 `track` 바탕(사방 `var(--space-xs)` 같은 색 띠)으로 표시하고 2.4초 뒤 사라진다(분홍을 쓰지 않는다).

Components > Cards, 위 다음 줄 (Task 3):

- **증상 Accordion:** `<details>` 한 줄. 요약 줄 최소 48px, 17px 800 줄간격 1.5, 왼쪽에 선 꺾쇠(열리면 180° 회전, 사이드바와 같다), 증상 사이 1px `rule` 선. 펼친 내용은 Body, 아래 `var(--space-md)`. 월드 제목(h2)과 Day 묶음 제목(h3, "Day n · 제목")이 heading이고 요약 줄 안에는 heading을 넣지 않는다. 머리 오른쪽에 "모두 펼치기" 글자 버튼(모두 펼쳐져 있으면 "모두 접기").

Components > Motion 표 "Accordion" 행의 자리 칸을 "사용자가 연 월드의 내용, 사용자가 연 증상"으로 고친다 (Task 3).

---

### Task 1: 월드 페이지

**Files:**
- Modify: `textbook/src/app/views/project.js` (전체 다시 조립)
- Modify: `textbook/src/app/views/common.js` (`meter` 그대로, 주석만 진도 막대로)
- Modify: `textbook/src/styles/pages.css` (월드 페이지·Day 행·진도 막대 규칙 추가)
- Modify: `textbook/src/styles/components.css:231-244` (`.meter` 토큰화, `transition: width` 삭제)
- Modify: `textbook/src/styles/home.css:1026-1102` (`.project-head .lead`, `.facts*`, `.project h2`, `.project-progress`, `.day-list`, `.day-row*`, 600px 블록 삭제. 1014행 h1 선택자 목록은 `.project-head h1` → `.world-head h1`로 바꿔 둔다), `textbook/src/styles/day.css:128` (`.facts code` 선택자 삭제)
- Modify: `DESIGN.md` (Task 1 추가안)
- Create: `tests/e2e/pages.test.mjs`

**Interfaces:**
- Consumes: `navDayState(cur, prog, dayId, todayId)`, `continueTarget(cur, prog)`, `projectState` (`progress.js`), `worldLabel`, `doneCount`, `chips(items, Infinity)`, `breadcrumb`, `meter`, `minutesText`, `lockScreen` (`views/common.js`), `px`, `worldEmblem` (`views/icons.js`)
- Produces (마크업, 다른 Task·M11이 기대는 이름):
  - `article.world-page[data-project=<pid>]` > `breadcrumb` + `header.world-head` > `span.badge` > `px(worldEmblem(project), { cls: 'emblem', scale: 3 })`, `p.label.world-head-tag`(worldLabel), `h1`, `p.lead`(subtitle), `p.world-summary`(summary)
  - `section.card.world-outcome[aria-labelledby=world-outcome-h]` > `h2.label#world-outcome-h` "끝나면 남는 결과물", `p.world-outcome-text`(outcome), `chips(stack, Infinity)`, `dl.world-facts`(dt "작업 폴더" dd `code`(folder) / dt "진도" dd `n / 전체 Day 완료`), `meter(pct, '<제목> 진도')`
  - `h2#world-days-h` "Day 목록" + `ol.card.world-days[aria-labelledby=world-days-h]` > `li` > `a.world-day.is-<state>[data-day][data-state][href="#/day/<id>"]` > `span.row-num`(num), `span.world-day-body` > `span.world-day-title` + `span.world-day-summary`, `span.world-day-meta` > `span.label`(minutesText) + `span.row-mark`(완료 `px('check')`, 준비 중 `span.row-draft` "준비 중") + 상태 `span.sr-only`(완료·오늘)
  - 오늘 행만 `aria-current="step"`. 상태는 `navDayState` 값(`done`·`today`·`draft`·`open`)

- [ ] **Step 1: 실패하는 e2e를 쓴다** — `tests/e2e/pages.test.mjs`. 머리는 `tests/e2e/settings.test.mjs`와 같은 틀(`eventually`, `seedValue`, `newContext`, `openPage`, `withPage(hash, fn, opts)`이고 끝에서 콘솔 오류 0)이다. 다른 점: `before`에서 `cp(FIXTURE, <tmp>/content, { recursive: true })`로 픽스처를 복사하고, 복사본에서 `fa/day-02.md`를 지운 뒤 `build({ contentDir, allowMissing: true })`로 빌드한다(그래서 `fa-d02`는 준비 중이다). Task 2·3이 이 복사본에 내용을 더한다.

```js
test('world page shows the outcome sentence, every stack chip and the day list', TIMEOUT, async () => {
  await withPage('#/project/fa', async (page) => {
    const world = page.locator('.world-page[data-project="fa"]');
    assert.equal(await world.locator('.world-head h1').innerText(), '픽스처 프로젝트 A');
    assert.equal(await world.locator('.world-head-tag').innerText(), '월드 1');
    assert.equal(await world.locator('.world-head .badge .emblem').count(), 1);
    assert.ok((await world.locator('.world-outcome-text').innerText()).length > 0);
    assert.deepEqual(await world.locator('.world-outcome .chips li').allInnerTexts(), ['HTML', 'CSS']);
    assert.deepEqual(await world.locator('.world-day').evaluateAll((els) => els.map((e) => e.dataset.state)), ['today', 'draft']);
    assert.equal(await world.locator('.world-day[aria-current="step"]').getAttribute('data-day'), 'fa-d01');
    assert.match(await world.locator('.world-day.is-draft').innerText(), /준비 중/);
    assert.match(await world.locator('.world-facts').innerText(), /0 \/ 2 Day 완료/);
  });
});

test('a done day turns green and the meter shows the real ratio', TIMEOUT, async () => {
  // progress ['fa-d01'] → fa-d01 data-state 'done' 에 .row-mark .px 1개, fa-d02 'today'
  // .meter aria-valuenow '50', '1 / 2 Day 완료', 채움 span 배경 === getComputedStyle 로 읽은 --color-progress
});

test('no pink square when today is in another world', TIMEOUT, async () => {
  // progress ['fa-d01','fa-d02'] (fb 가 열리고 오늘은 fb-d01) → '#/project/fa' 에 .world-day.is-today 0개, [aria-current="step"] 0개
});

test('world page rows follow DESIGN.md', TIMEOUT, async () => {
  // .world-day: minHeight '48px', borderTopLeftRadius '6px'; .world-days borderTopWidth '2px', boxShadow 에 '4px'
  // 오늘 행 .row-num 배경 === --color-accent 계산값, width '24px'
  // .meter borderTopLeftRadius === --radius-btn 계산값(6px), 999px 아님
});
```

- [ ] **Step 2: 실패를 확인한다**

Run: `cd textbook && NODE_PATH="$(npm root -g)" node --test ../tests/e2e/pages.test.mjs`
Expected: 4개 FAIL(`.world-page`를 찾지 못함).

- [ ] **Step 3: 구현한다** — Interfaces 대로 `project.js`를 다시 쓰고(옛 `DAY_ICON` 이모지 제거), DESIGN.md Task 1 추가안 값으로 CSS를 넣는다. `.world-day`의 번호·오늘 네모·완료 표시는 `shell.css`의 `.row-num`, `.row.is-today .row-num`, `.row.is-done` 값과 같아야 하므로 선택자 묶음에 `.world-day` 쪽을 더해 같이 쓴다(값을 다시 적지 않는다). 지울 legacy 규칙을 쓰는 곳이 남았는지 `grep -rn "day-row\|day-list\|facts\|project-head\|project-progress" textbook/src`로 확인한다(`quest-facts`는 다른 이름이다). DESIGN.md에 Task 1 추가안 세 줄을 넣는다.

- [ ] **Step 4: 통과를 확인한다**

Run: `cd textbook && npm test && NODE_PATH="$(npm root -g)" node --test ../tests/e2e/pages.test.mjs ../tests/e2e/textbook.test.mjs ../tests/e2e/layout.test.mjs`
Expected: 단위·빌드 실패 0, pages 4/4, textbook·layout 실패 0(잠긴 월드 깊은 링크·월드 메뉴 이동 테스트 포함).

- [ ] **Step 5: 커밋**

```bash
git add textbook/src/app/views/project.js textbook/src/app/views/common.js textbook/src/styles/pages.css textbook/src/styles/components.css textbook/src/styles/home.css textbook/src/styles/day.css DESIGN.md tests/e2e/pages.test.mjs
git commit -m "feat(world): world page with outcome, all stack chips and a day list in sidebar row style"
```

### Task 2: 부록 머리와 용어 사전 색인

**Files:**
- Modify: `textbook/src/app/views/icons.js` (`pageArt`)
- Modify: `textbook/src/app/views/helprow.js` (`ORDER`의 그림을 `pageArt`에서)
- Modify: `textbook/src/app/views/page.js` (`header.page-head`)
- Modify: `textbook/lib/glossary.mjs` (`glossaryIndexKey`, `renderGlossaryPage` 색인·묶음)
- Modify: `textbook/src/styles/pages.css` (부록 머리, 목차 카드, 용어 묶음), `textbook/src/styles/day.css:169-178` (`.is-target` → 찾아온 항목 값)
- Modify: `DESIGN.md` (Task 2 추가안)
- Modify: `tests/unit/glossary.test.mjs`, `tests/e2e/pages.test.mjs`

**Interfaces:**
- Produces:
  - `pageArt(id: string) → 'ladder' | 'wrench' | 'words' | 'book' | null` (`help`·`troubleshooting`·`glossary`·`start` 순서, 그 밖은 `null`). `helprow.js`는 `ORDER = ['help', 'troubleshooting', 'glossary', 'start']`와 `pageArt`를 쓴다.
  - `renderPage` 마크업: `article.page-article[data-page]` > `breadcrumb` + `header.page-head` > (`pageArt`가 있으면) `px(art, { cls: 'page-art', scale: 3 })` + `h1` + (`page.meta`가 있으면) `p.lead` + `div.page-body`
  - `glossaryIndexKey(term: string) → { key: string, label: string }` (`lib/glossary.mjs`에서 export): 첫 글자가 한글 음절이면 초성을 겹자음까지 합친 14자(`ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅅ ㅇ ㅈ ㅊ ㅋ ㅌ ㅍ ㅎ`)로 `key: 'ko-1'…'ko-14'`, 라틴 글자면 `key: 'en-a'…`·`label: 'A'…`, 그 밖이면 `{ key: 'etc', label: '기호·숫자' }`. 초성 번호는 `Math.floor((code - 0xAC00) / 588)`이고 ㄲ→ㄱ, ㄸ→ㄷ, ㅃ→ㅂ, ㅆ→ㅅ, ㅉ→ㅈ이다.
  - 용어 사전 HTML: 맨 앞 `nav.toc.gl-index[aria-labelledby=gl-index-h]` > `h2.label#gl-index-h` "ㄱㄴㄷ 색인" + `ul` > `li` > `a[href="#/page/glossary/gl-<key>"][aria-label="<label>, 용어 n개"]`(label). 이어서 묶음마다 `section.gl-group#gl-<key>[aria-labelledby=glh-<key>]` > `h2#glh-<key>`(label) + `section.term-entry#term-<slug>`(용어는 h3). 묶음 순서는 `etc` → `ko-1..14` → `en-a..z`이고 있는 묶음만 만든다. 묶음 안은 지금처럼 `localeCompare(…, 'ko')` 순서다. 항목 id(`term-<slug>`)는 바꾸지 않는다.

- [ ] **Step 1: 실패하는 테스트를 쓴다**

단위(`tests/unit/glossary.test.mjs`):

```js
test('glossaryIndexKey groups by merged initial consonant, Latin letter or symbol', () => {
  assert.deepEqual(glossaryIndexKey('가변 참조'), { key: 'ko-1', label: 'ㄱ' });
  assert.deepEqual(glossaryIndexKey('깃허브'), { key: 'ko-1', label: 'ㄱ' });
  assert.deepEqual(glossaryIndexKey('쓰레드'), { key: 'ko-7', label: 'ㅅ' });
  assert.deepEqual(glossaryIndexKey('후원'), { key: 'ko-14', label: 'ㅎ' });
  assert.deepEqual(glossaryIndexKey('xUnit'), { key: 'en-x', label: 'X' });
  assert.deepEqual(glossaryIndexKey('.NET'), { key: 'etc', label: '기호·숫자' });
  assert.deepEqual(glossaryIndexKey('1:N 관계'), { key: 'etc', label: '기호·숫자' });
});

test('glossary page has an index and groups in symbol, Hangul, Latin order', () => {
  // 용어 'API', '가나다', '.env', '하나' → 묶음 id 순서 ['gl-etc', 'gl-ko-1', 'gl-ko-14', 'gl-en-a']
  // 색인 링크 href 순서도 같고 aria-label 은 'ㄱ, 용어 1개' 꼴, term-entry id 는 그대로 term-<slug>, 용어 제목은 <h3
});
```

기존 `glossary page sorts entries in Korean order and gives each an id`는 그대로 통과해야 한다(id 순서 검사).

e2e(`tests/e2e/pages.test.mjs`). `before`에서 복사본 `glossary/fixture.md` 끝에 `\n### API\n- 처음 등장: [Day 1](#/day/fa-d01)\n\n프로그램끼리 주고받는 약속이에요.\n`를 덧붙인다.

```js
test('appendix pages share one head: dot art, title and description', TIMEOUT, async () => {
  // '#/page/start' → .page-head .page-art 1개, h1 '시작하기', .lead '교재 쓰는 법, 공부 원칙, 준비물'
  // '#/page/glossary' → .page-art 1개, .lead '용어 3개를 한 줄 정의로'
  // '#/page/secret' 은 잠금 화면(그대로), 진도 fa·fb 완료면 .page-art 0개(그림 없는 페이지)
});

test('the glossary index jumps to a group and a term link lands on the term', TIMEOUT, async () => {
  // '#/page/glossary' → .gl-index a 글자 ['ㄱ', 'ㅍ', 'A']
  // 'A' 클릭 → 주소 '#/page/glossary/gl-en-a', #gl-en-a 가 화면 안(boundingBox().y >= 0 이고 상단 바 아래)
  // '#/page/glossary/term-api' → #term-api.is-target 1개, 배경 === --color-track 계산값
});
```

- [ ] **Step 2: 실패를 확인한다**

Run: `cd textbook && npm test -- --test-name-pattern="glossaryIndexKey|index and groups" && NODE_PATH="$(npm root -g)" node --test --test-name-pattern="appendix|glossary index" ../tests/e2e/pages.test.mjs`
Expected: 단위 2개 FAIL(`glossaryIndexKey` 없음), e2e 2개 FAIL(`.page-head` 없음).

- [ ] **Step 3: 구현한다** — Interfaces 대로. 용어 항목은 `renderEntry({ level: 3, … })`로 바꾸고 묶음 HTML로 감싼다. 색인 라벨 글자(ㄱ 등)는 빌드 HTML에 들어가므로 글꼴 서브셋에 자동으로 들어간다. `.is-target`은 DESIGN.md "찾아온 항목" 값(`--color-track`)으로 바꾸고 `--accent-soft`를 쓰지 않는다. DESIGN.md에 Task 2 추가안 네 줄을 넣는다.

- [ ] **Step 4: 통과를 확인한다**

Run: `cd textbook && npm test && NODE_PATH="$(npm root -g)" node --test ../tests/e2e/pages.test.mjs ../tests/e2e/textbook.test.mjs ../tests/e2e/search.test.mjs`
Expected: 단위·빌드 실패 0(빌드 테스트의 `term-entry` id 순서 포함), pages 6/6, textbook(용어 깊은 링크 `is-target`)·search 실패 0.

- [ ] **Step 5: 커밋**

```bash
git add textbook/src/app/views/icons.js textbook/src/app/views/helprow.js textbook/src/app/views/page.js textbook/lib/glossary.mjs textbook/src/styles/pages.css textbook/src/styles/day.css DESIGN.md tests/unit/glossary.test.mjs tests/e2e/pages.test.mjs
git commit -m "feat(appendix): shared page head and a glossary index grouped by initial consonant"
```

### Task 3: 문제 해결 목차와 증상 Accordion

**Files:**
- Modify: `textbook/lib/glossary.mjs` (`parseTroubleshooting`의 `day`, `filterPublished`, `renderTroubleshootingPage`)
- Modify: `textbook/build.mjs:153-205` (공개 범위 거르기, 증상 수, `pageId` 넘기기)
- Modify: `textbook/src/app/motion.js` (`accordionOpened`), `textbook/src/app/views/sidebar.js:162-166` (`animateOpen` → `accordionOpened`)
- Modify: `textbook/src/app/views/page.js` (찾아온 항목 열기, "모두 펼치기")
- Modify: `textbook/src/styles/pages.css` (목차, 증상 Accordion), `textbook/src/styles/shell.css:282-284` (`acc-in` 선택자에 증상 내용 추가)
- Modify: `DESIGN.md` (Task 3 추가안, Motion 표 Accordion 행)
- Modify: `tests/unit/glossary.test.mjs`, `tests/unit/motion.test.mjs`, `tests/build/build.test.mjs`, `tests/e2e/pages.test.mjs`

**Interfaces:**
- Consumes: `slugify` (`lib/markdown.mjs`), `iconSvg` (`src/app/views/icons.js`), Task 2의 `.toc` 목차 카드 규칙, `shell.css`의 `@keyframes acc-in`
- Produces:
  - `parseTroubleshooting(files)`의 항목: `{ title, md, file, line, day: string | null }`. `day`는 본문에서 `/^-\s*관련:.*?\(#\/day\/([^)\s]+)\)/m`의 첫 일치, 없으면 `null`.
  - `filterPublished(groups, ids: Set<string> | null) → groups`: `ids`가 `null`이면 그대로, 아니면 `day`가 있고 `ids`에 없는 항목을 뺀다(빈 그룹은 뺀다).
  - `renderTroubleshootingPage(groups, projects, { terms, routes, pageId = 'troubleshooting' })`: `projects`는 `{ id, title, days: { id, num, title }[] }[]`. 출력 HTML:
    - 맨 앞 `nav.toc.ts-toc[aria-labelledby=ts-toc-h]` > `h2.label#ts-toc-h` "목차" + 월드마다 `div.ts-toc-world` > `a[href="#/page/<pageId>/ts-<gid>"]`(월드 제목) + `span.label`("증상 n개") + `ol` > `li` > `a[href="#/page/<pageId>/ts-<gid>-<day 묶음>"][aria-label="Day n, 증상 m개"]`("Day n", 그 밖의 묶음은 "그 밖의 증상")
    - 월드마다 `section.ts-group#ts-<gid>` > `h2#tsh-<gid>`(월드 제목) > Day 묶음마다 `section.ts-day#ts-<gid>-<d>` > `h3`("Day n · 제목" 또는 "그 밖의 증상") > 증상마다 `details.ts-entry#ts-<gid>-<d>-<i>` > `summary` > `iconSvg('chevron', 'ts-chev')`(`src/app/views/icons.js`, `lib/site.mjs`의 `fillIcons`가 쓰는 것과 같은 함수. 사이드바 꺾쇠와 같은 선 아이콘) + `span.ts-title`(제목을 인라인 HTML로) + `div.ts-body`(본문)
    - `<d>`는 Day id에서 프로젝트 접두어를 뺀 것(`p1-d02` → `d02`), 그 밖은 `etc`. `<i>`는 묶음 안 1부터. 묶음 순서는 그 월드의 Day 순서, `etc`는 맨 뒤.
    - 제목 HTML은 `renderEntry({ level: 3, title, md: '' })` 결과에서 `<h3 …>`·`</h3>` 껍데기를 벗겨 쓴다(용어 링크·escape 규칙이 같다). 본문은 같은 방식으로 따로 렌더한다. 오류의 줄 번호 규칙은 지금과 같다.
  - `build.mjs`: `const troubleGroups = filterPublished(trouble.groups, published)`. 렌더와 `{n}`(증상 수)은 `troubleGroups`로 센다.
  - `accordionOpened(details: HTMLDetailsElement) → void` (`motion.js`, export `ACCORDION_CLEAR_MS = 400`): `is-animating`을 붙이고 400ms 뒤 뗀다. 사이드바는 지역 `animateOpen` 대신 이것을 쓴다.
  - `page.js`:
    - `anchorTarget`은 그대로. 찾아온 대상이 `details`이거나 `details` 안에 있으면 바깥쪽까지 모든 `details` 조상을 `open = true`로 한 뒤 스크롤한다.
    - 본문에 `details.ts-entry`가 있으면 `.page-head`에 `button.text-btn[data-expand-all]`("모두 펼치기"/"모두 접기")을 붙인다. 누르면 모두 열거나 닫고(여는 것마다 `accordionOpened`), `toggle`(capture)마다 글자를 다시 맞춘다. 요약 줄을 눌러 열 때도 `accordionOpened`.

- [ ] **Step 1: 실패하는 테스트를 쓴다**

단위(`tests/unit/glossary.test.mjs`):

```js
test('troubleshooting entries remember their first related day', () => {
  const { groups } = parseTroubleshooting([{ file: '/c/ts/p1.md', src: '### 하나\n- 관련: [P1 Day 2](#/day/p1-d02), [P1 Day 1](#/day/p1-d01)\n\n본문\n\n### 둘\n본문\n' }]);
  assert.deepEqual(groups[0].entries.map((e) => e.day), ['p1-d02', null]);
});

test('filterPublished drops entries of unpublished days and empty groups', () => {
  // p1 항목 day p1-d01·p1-d02·null, sp 항목 day sp-d01 / ids = new Set(['p1-d01'])
  // → p1 entries day [p1-d01, null], sp 그룹은 없음 / ids null 이면 입력 그대로
});

test('troubleshooting page has a toc and day groups of details with no heading inside summary', () => {
  // projects [{ id:'p1', title:'P1', days:[{id:'p1-d01',num:1,title:'첫날'},{id:'p1-d02',num:2,title:'둘째날'}] }]
  // 항목: d02 'A', d01 'B', d01 '`npm` 이 안 돼요', null 'C', 'p9-d01' 'D'
  // section.ts-day id 순서 ['ts-p1-d01', 'ts-p1-d02', 'ts-p1-etc'], h3 글자 ['Day 1 · 첫날', 'Day 2 · 둘째날', '그 밖의 증상']
  // details id 'ts-p1-d01-1', 'ts-p1-d01-2', summary 안에 <code>npm</code>, summary 안에 <h 없음
  // 목차 링크 href '#/page/troubleshooting/ts-p1-d01' 과 aria-label 'Day 1, 증상 2개', 월드 줄 '증상 5개', 'D' 는 etc 묶음
  // pageId 'help' 를 주면 href 가 '#/page/help/...'
});
```

기존 `troubleshooting page groups by project title and keeps authored order`의 `<h3[^>]*>증상 하나</h3>` 검사 두 줄을 `<summary>` 검사로 바꾼다(묶음 h2 순서 검사는 그대로).

단위(`tests/unit/motion.test.mjs`): `accordionOpened adds is-animating and clears it after ACCORDION_CLEAR_MS` — 가짜 `classList`와 `mock.timers`로 확인한다.

빌드(`tests/build/build.test.mjs`):

```js
test('published build drops symptoms of unpublished days', async () => {
  // withContentCopy: troubleshooting 페이지 추가(위 'troubleshooting page is generated…' 와 같은 방식),
  // 항목 fa-d01 하나·fb-d01 하나, published.json { "fa": [1, 2] } → runBuild(['--published', ...])
  // 템플릿에 fb 항목 제목 없음, data.pages 의 meta '증상 1가지…', 목차 링크에 'ts-fb' 없음
  // --published 없이 빌드하면 둘 다 있다
});
```

e2e(`tests/e2e/pages.test.mjs`). `before`에서 복사본 `curriculum.json`의 `pages`에 `{ "id": "troubleshooting", "title": "문제 해결 모음", "meta": "증상 {n}가지와 해결 방법", "generated": "troubleshooting" }`를 더하고 `troubleshooting/fa.md`를 쓴다: Day 1 증상 "화면이 하얘요", Day 2 증상 "`npm` 이 안 돼요 아주 긴 제목 …(한 줄 80자 이상)", 관련 줄 없는 증상 "그 밖의 증상 하나".

```js
test('troubleshooting shows a toc and symptoms open one by one', TIMEOUT, async () => {
  // .ts-toc 의 월드 링크 1개, Day 링크 글자 ['Day 1', 'Day 2', '그 밖의 증상']
  // .ts-entry 3개 모두 닫힘, 첫 summary 클릭 → open, .ts-body 보임, 다시 클릭 → 닫힘
  // 키보드: summary 포커스 후 Enter → open
});

test('expand all opens every symptom and the label follows', TIMEOUT, async () => {
  // [data-expand-all] 글자 '모두 펼치기' → 클릭 → .ts-entry[open] 3개, 글자 '모두 접기' → 클릭 → 0개
  // 하나만 손으로 닫으면 글자가 '모두 펼치기' 로 돌아온다
});

test('a deep link opens and scrolls to that symptom', TIMEOUT, async () => {
  // '#/page/troubleshooting/ts-fa-d02-1' → #ts-fa-d02-1[open], .is-target, 상단 바 아래 화면 안
  // 목차 'Day 2' 클릭 → 주소 '#/page/troubleshooting/ts-fa-d02', #ts-fa-d02 가 화면 안
});

test('an unknown anchor opens the page at the top with everything closed', TIMEOUT, async () => {
  // '#/page/troubleshooting/nope', '#/page/troubleshooting/main' → scrollY 0, .ts-entry[open] 0개, .is-target 0개
});

test('reduced motion: a symptom opens with no animation', TIMEOUT, async () => {
  // reducedMotion 'reduce' → summary 클릭 직후 .ts-body getAnimations().length === 0 (또는 끝난 상태), open
});

test('world and appendix pages have no sideways scroll from 320px up', TIMEOUT, async () => {
  // 320·375·768·1280 × ['#/project/fa', '#/page/start', '#/page/glossary', '#/page/troubleshooting'(모두 펼친 뒤)]
  // documentElement.scrollWidth <= clientWidth
});
```

- [ ] **Step 2: 실패를 확인한다**

Run: `cd textbook && npm test && NODE_PATH="$(npm root -g)" node --test ../tests/e2e/pages.test.mjs`
Expected: 단위 새 4개·바꾼 1개·빌드 새 1개 FAIL, e2e 새 6개 FAIL(`.ts-toc` 없음). Task 1·2의 e2e 6개는 PASS.

- [ ] **Step 3: 구현한다** — Interfaces 대로. 사이드바는 동작이 그대로여야 한다(M2 e2e가 지킨다). CSS는 DESIGN.md Task 3 추가안 값이고, 꺾쇠는 사이드바 `.world-chev`처럼 열리면 180° 돈다(`--dur-short`). `summary`의 기본 삼각형은 `list-style: none`과 `::-webkit-details-marker { display: none }`로 숨긴다. DESIGN.md에 Task 3 추가안과 Motion 표 고침을 넣는다.

- [ ] **Step 4: 통과를 확인한다**

Run: `cd textbook && npm test && npm run check -- --allow-missing && NODE_PATH="$(npm root -g)" node --test ../tests/e2e/pages.test.mjs ../tests/e2e/textbook.test.mjs ../tests/e2e/motion.test.mjs`
Expected: 단위·빌드 실패 0, "검사 통과: Day 155개, 페이지 4개", pages 12/12, textbook·motion(사이드바 Accordion) 실패 0.

- [ ] **Step 5: 실제 교재로 개수를 확인한다**

Run: `cd textbook && node build.mjs --published --allow-missing --out ../../wzh-m7-check.html` 뒤 `node -e` 로 그 파일의 `t-page-troubleshooting`에서 `details.ts-entry` 수와 `data.pages`의 문제 해결 `meta`를 읽는다. 끝나면 그 파일을 지운다.
Expected: 둘 다 250(전체 305 − 첫 관련 Day가 공개 범위 밖인 55. 계획 작성 때 원본을 직접 세어 확인한 값).

- [ ] **Step 6: 커밋**

```bash
git add textbook/lib/glossary.mjs textbook/build.mjs textbook/src/app/motion.js textbook/src/app/views/sidebar.js textbook/src/app/views/page.js textbook/src/styles/pages.css textbook/src/styles/shell.css DESIGN.md tests/unit/glossary.test.mjs tests/unit/motion.test.mjs tests/build/build.test.mjs tests/e2e/pages.test.mjs
git commit -m "feat(troubleshooting): toc by world and day, symptom accordions, expand all, published range"
```

### Task 4: 시각 기준 이미지, 전체 기준선, 문서

**Files:**
- Modify: `tests/visual/visual.test.mjs` (`SCENES`)
- Modify: `tests/visual/baseline/` (승인 뒤)
- Modify: `docs/CHECKPOINT.md`, `docs/checkpoint/workspace/progress.md`, `docs/superpowers/specs/2026-11-12-unified-roadmap-design.md` 11장 M10·M14 행

- [ ] **Step 1: 장면을 더한다**

```js
{ id: 'world', hash: '#/project/p1', progress: P1_FIRST_THREE },
{ id: 'start', hash: '#/page/start', progress: null },
{ id: 'glossary', hash: '#/page/glossary', progress: null },
{ id: 'troubleshooting', hash: '#/page/troubleshooting', progress: null, open: '.ts-entry > summary', waitFor: '.ts-entry[open]' },
```

`open`은 첫 번째 일치만 누른다(기존 `shoot`의 동작을 확인하고, 여러 개를 누르면 `.first()`로 고친다).

- [ ] **Step 2: 새 이미지를 만들어 보여 주고 멈춘다 — 사용자 승인**

Run: `cd textbook && NODE_PATH="$(npm root -g)" npm run test:visual`
Expected: 새 4장면 × 3폭 × 2테마 = 24장은 기준 없음, 기존 62장은 PASS(월드·부록을 찍은 기존 장면이 없으므로). 24장을 DESIGN.md 추가안과 대조한 뒤 사용자에게 보이고 승인을 기다린다.

- [ ] **Step 3: 승인 뒤 기준 이미지를 갱신하고 확인한다**

Run: `cd textbook && NODE_PATH="$(npm root -g)" npm run test:visual:update && NODE_PATH="$(npm root -g)" npm run test:visual`
Expected: 88/88 PASS(장면 이미지 86장 + 비교 단위 2개).

- [ ] **Step 4: 전체 기준선과 전 페이지 점검**

Run: `cd textbook && npm test && npm run check -- --allow-missing && NODE_PATH="$(npm root -g)" npm run test:e2e && npm run build:site`, 그다음 `_site`를 별도 프로세스 정적 서버로 띄워 `NODE_PATH="$(npm root -g)" npm run check:site -- http://127.0.0.1:<port>/`
Expected: 단위·빌드 실패 0, "검사 통과: Day 155개, 페이지 4개", e2e 실패 0(162 + pages 12), check:site 4폭 각 168개 문제 0.

- [ ] **Step 5: 자체 리뷰** — `git diff <M7 시작 커밋>..HEAD`를 Global Constraints·DESIGN.md 추가안과 대조한다(토큰 밖 값, 분홍 두 곳, legacy 별칭 새로 쓴 곳, 지운 CSS를 쓰는 곳). 찾은 문제는 재현 테스트 → 수정 → 전체 테스트로 이 Task 안에서 끝낸다.

- [ ] **Step 6: 문서와 커밋**
  - `CHECKPOINT.md`: "M7 완료, 다음은 M8", 기준선 숫자, 0장 3번에 M7 한 줄.
  - `progress.md`: `M7: complete` 한 줄(커밋 범위, 테스트 수).
  - 로드맵 M10 행 끝: `(M7에서 넘김: 부록 페이지의 목차 카드(용어 색인·문제 해결 목차)를 1280px 이상에서는 퀘스트 로그 자리로 옮긴다. 개편 설계서 3.4)`.
  - 로드맵 M14 행 끝: `(M7에서 넘김: 문제 해결 증상 Accordion(details.ts-entry)을 인쇄에서 펼친다)`.

```bash
git add tests/visual/visual.test.mjs tests/visual/baseline docs/CHECKPOINT.md docs/checkpoint/workspace/progress.md docs/superpowers/specs/2026-11-12-unified-roadmap-design.md
git commit -m "test(visual): world and appendix scenes; docs: M7 complete"
```
