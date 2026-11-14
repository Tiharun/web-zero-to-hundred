# M12 넓은 화면 가운데 정렬과 강좌 그림 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> 이 프로젝트는 Native 방식이다(통합 로드맵 10장). `executing-plans`로 이 세션이 끝까지 하고, 서브에이전트·자식 세션을 쓰지 않는다. 최종 리뷰도 직접 한다.

**Goal:** 1440·1920px에서 화면 묶음을 본문 영역 가운데에 놓고(첫 Task), `:::figure` 문법·빌드 검증·그림 틀을 만든 뒤 P1 2D 그림 4개(Day 1, 4·5, 7, 11)를 넣는다. 완료 기준은 로드맵 M12 ①~⑤이고, M1·M8에서 넘긴 일(그림 틀 Reveal, DESIGN.md 그림 틀)도 함께 끝낸다.

**Architecture:**
- 가운데 정렬은 CSS만 바꾼다. `.main`의 바로 아래 자식(화면 묶음)이 자기 상한 폭에 `margin-inline: auto`를 갖고, Day·부록의 두 열 격자는 두 열 합(972px)을 상한으로 가운데에 온다. 새 브레이크포인트는 없다.
- 그림은 세 층이다. 빌드(`lib/markdown.mjs`가 `:::figure <id>`를 그림 틀 HTML로 바꾸고 id·캡션·대체 설명을 검사, `lib/figures.mjs`가 등록된 id를 읽음) → 공용 화면 부품(`views/figure.js`: 틀에 그림을 붙이고, 실패하면 대체 설명을 남기고, 단계 버튼·선택 묶음을 만든다) → 그림 코드(`src/figures/<이름>.js`, 등록표 `src/figures/index.js`).
- 그림 코드는 `mount(fig, { reducedMotion }) → dispose` 하나를 내보낸다(개편 설계서 7.2). 순수 계산(상대 경로, Flexbox 축, 단계 표시)은 같은 파일의 export 함수로 두고 단위 테스트한다.

**Tech Stack:** 바닐라 JS(ESM), esbuild 0.28.2, marked 18.1.2, `node:test`, 전역 Playwright 1.63.0 + Chromium, pixelmatch 8.0.0.

**Spec:**
- 기준은 `docs/superpowers/specs/2026-11-12-unified-roadmap-design.md` 11장 M12 행(M1·M8 넘김 메모 포함)과 **11.5(넓은 화면 가운데 정렬: 측정·원인·규칙 1~6·테스트)**다. 7장(그림 오류 → 대체 설명), 8장(figure id 검증 단위·빌드 테스트)도 따른다.
- 세부 기준은 개편 설계서 `2026-11-11-textbook-redesign-design.md` 7.1(등급 G1~G4, 가장 낮은 등급부터), 7.2(작성 문법, `mount → dispose`, 빌드 오류 3종), 7.4(P1 그림 표), 9장(오류는 대체 그림·설명), 10장(움직이는 속성)이다.
- 시각 값의 유일한 기준은 `DESIGN.md`다. 그림 틀은 "Day 부품" **그림 틀** 항목을 따르고, 없는 부분(단계 줄, 선택 묶음, 결과 줄, 대체 설명, 모션)은 Task 1·3의 문안으로 넣는다.

## Global Constraints

- **토큰:** 색·글꼴·크기·간격·모서리·턱·모션 값은 DESIGN.md 토큰(`var(--…)`)으로만 쓴다. 토큰 밖 `#hex`·`rgb(`·`font-family`는 빌드가 막는다. 그림 코드(`src/figures/*.js`, `views/figure.js`)에도 색 값을 쓰지 않고 클래스만 붙인다(Task 4 빌드 테스트).
- **새 값:** Task 1·3의 DESIGN.md 문안과 Task 3의 CONTENT-GUIDE 문안이 수정안이다. **이 계획을 승인하면 그 문안도 승인한 것**으로 본다. 새 토큰은 없다. 44rem(설정)·40rem(검색 카드·잠금·404)은 이미 CSS에 있는 값이다. 그 밖의 새 값이 필요해지면 멈추고 묻는다.
- **글 열:** `--lesson-max` 720px를 넓히지 않는다(로드맵 11.5 규칙 3, WCAG 1.4.8).
- **The Fluid Rule:** 320px부터 가로 스크롤 0. 브레이크포인트는 DESIGN.md 표의 값(`40rem`, `64rem`, `80rem`)만 쓴다. 그림은 글 열 안에서 줄어들고, 그림 폭 최대 30rem이다.
- **The Game Frame Rule:** 그림 틀(아래 줄)이 틀이다. Label "그림 n", 단계 Label, 보조 버튼의 턱이 게임 신호다. 그림 안(그림 무대의 내용)은 글 열이라 도트 그림을 넣지 않는다.
- **Real Progress·One Pink:** 그림 안에 초록(`progress`)과 분홍 면을 쓰지 않는다. 경로·고른 값 강조는 `track` 바탕과 `ink` 800이다.
- **동작 줄이기:** 그림은 처음부터 최종 상태로 보이고, 단계를 바꿔도 애니메이션이 없다. 정보와 기능은 모두 남는다.
- **본문:** Day 제목·요약·본문 어휘는 바꾸지 않는다. 바꾸는 것은 `text` 그림 블록을 `:::figure`로 바꾸는 자리와 그 앞 안내 한 문장뿐이다(아래 문안 그대로).
- **파일과 이름:** 결과는 파일 하나이고 외부 요청 0건이다. 이름·주소는 `curriculum.json`에서만 가져온다.
- **기록 금지:** 저장소 파일에 모델 식별자·개인정보·로컬 사용자 경로를 쓰지 않는다. 고치기 전 스크린샷은 저장소 밖 스크래치 폴더에 둔다.
- **커밋:** 커밋·push는 사용자가 요청할 때만 한다. 아래 "Commit" 단계는 실행 세션을 시작할 때 사용자에게 한 번 확인하고 따른다. 커밋마다 CLAUDE.md 8장의 비밀값 grep을 먼저 돌린다.
- **미루지 않기:** 찾은 작은 문제는 이 마일스톤 안에서 고친다. 다른 마일스톤 화면이 있어야 하는 일만 로드맵 11장 해당 행에 `(M12에서 넘김: …)`으로 적는다.
- **기준 이미지:** 이 PC에서, 사용자 승인 뒤에만 `npm run test:visual:update`로 갱신한다.
- **브라우저 테스트:** 시작 전에 PowerShell에서 `$env:NODE_PATH = (npm root -g)`를 실행한다. Playwright는 `127.0.0.1` 정적 서버로 연다.
- **명령 위치:** 명령은 `textbook/`에서 실행한다.
- **기준선(M11 끝):** unit 315, e2e 238, visual 158(기준 이미지 156), check:site 4폭 각 168/0.

## 결정 기록 (계획 단계)

- **상단 바는 지금처럼 화면 전체 폭**이다(워드마크 왼쪽 끝, 검색·테마 오른쪽 끝). 사이드바도 그대로다. 푸터 안 내용만 `--content-max` 묶음으로 가운데에 둔다. 로드맵 11.5 규칙 4가 "개정안을 보일 때 묻는다"고 했으므로 계획 승인 때 함께 확인한다. 다르게 정하면 Task 1 Step 1 문안만 바꾼다.
- **화면 묶음 상한:** 홈·월드 `--content-max`(1120px). Day·부록은 오른쪽 열이 있을 때(80rem 이상) `calc(var(--lesson-max) + var(--space-xl) + var(--aside-w))`(972px), 없을 때 지금 값(`--lesson-max`, 부록 `calc(var(--measure) + 2rem)`). 설정 44rem, 잠금·404·오류 40rem은 그대로. **검색 페이지 `.search-view`는 40rem**으로 한다. 지금은 묶음이 62rem인데 안의 카드가 40rem이라, 묶음만 가운데로 보내면 보이는 카드는 왼쪽으로 치우치기 때문이다(보이는 폭은 그대로다).
- **1024~1280px도 조금 움직인다:** 본문보다 좁은 묶음(설정, 검색, 오른쪽 열 없는 Day, 부록 글)은 1280px 이하에서도 가운데로 온다(예: 1280px 설정 124px, 768px 설정 8px). 로드맵 11.5 규칙 6의 "320~1280px의 모든 화면이 바뀌지 않는다"는 **배치(열 수·컨테이너 쿼리 결과·sticky·서랍)** 가 바뀌지 않는다는 뜻으로 읽는다. 위치가 바뀌는 기존 기준 이미지는 Task 1에서 고치기 전·후를 보이고 승인받는다(11.5 "시각 테스트"가 이미 예고한 일이다).
- **그림 HTML은 빌드가 만든다:** `figure.figure` > `div.figure-stage` > `div.figure-art[role="img"][aria-label=대체 설명]` 안에 대체 설명 문단 `p.figure-fallback`, 그 뒤 `figcaption.figure-cap`("그림 n" Label + 캡션). JS가 그림을 붙이면 문단을 그림으로 바꾼다. JS가 꺼지거나 그림 코드가 실패하면 대체 설명이 그대로 보인다(로드맵 7장 "그림 오류"). 번호 n은 그 문서 안의 순서다.
- **조작은 `role="img"` 밖에 둔다:** `role="img"`의 자식은 화면 낭독기에 보이지 않으므로, 단계 문장·선택 묶음·결과 줄은 `figure-art` 바깥(무대 안 아래)에 둔다. 단계 버튼은 `figure` 안에서 `figcaption` **앞**에 넣는다(`figcaption`은 figure의 처음이나 끝 자식이어야 한다[검색: HTML Standard figure]). 화면 배치는 figure의 grid가 정한다.
- **id 등록표가 원천이다:** 빌드는 `src/figures/index.js`의 `FIGURES` 키를 import로 읽어 id를 검사한다. Day 4·5의 경로 그림은 **코드 하나(`paths.js`)에 id 둘**(`paths-site`, `paths-dev`)이다. Day 4는 `../`를 아직 배우지 않았으므로 Day 4 끝 폴더(`my-creator-site` 다섯 파일)만, Day 5는 본문 폴더 모양 그대로 보여 준다.
- **본문 `text` 그림 블록:** Day 1(①~④ 흐름), Day 4(같은 폴더 예), Day 5(두 번째 블록: `../` 따라가기), Day 7(add → commit → push), Day 11(주축·교차축) 블록을 `:::figure`로 **바꾼다**. 대체 설명에 그 블록의 정보(단계, 이름, 경로)를 빠짐없이 넣는다. Day 5의 첫 블록(과제에 쓸 폴더 모양)은 과제가 참고하므로 남긴다.
- **조작 부품:** G3 값 고르기는 DESIGN.md Forms의 라디오를 쓰는 `fieldset` 묶음이다(새 select 모양을 만들지 않는다). 라디오 `name`은 figure의 id(`p1-d05-fig1`)와 키로 만들어 한 화면의 그림끼리 겹치지 않는다.
- **단계 그림(G2):** 그림 안 요소에 `data-step="k"`(k단계부터 보임) 또는 `data-step-only="k"`(k단계에만 보임)를 단다. 단계는 1부터 전체까지이고 처음은 1단계다(동작 줄이기면 마지막 단계). 앞으로 갈 때 새로 보이는 선은 `strokeIn`, 그 밖의 요소는 `rise`로 나타난다. 마지막 단계에서 버튼은 "↺ 처음부터"이고 누르면 1단계로 돌아간다(애니메이션 없음).
- **그림은 Day와 부록 모두에서 붙는다:** 둘 다 `renderMarkdown`을 쓰므로 `renderPage`도 `mountFigures`를 부른다(그림이 없으면 아무 일도 없다).

## Review Focus

1. **고친 뒤 1024~1280px 화면 위치 변화**
   - 기대: 열 수·sticky·서랍은 그대로이고, 본문보다 좁은 묶음만 가운데로 온다. 가로 스크롤 0.
   - 확인: Task 1 e2e `wide layout centers each screen`(1280 포함), 시각 테스트 전·후 대조와 승인.
2. **화면을 떠났다 돌아오기(그림 상태와 리스너)**
   - 기대: Day 1에서 3단계까지 간 뒤 다른 화면에 갔다 오면 1단계부터 다시 보이고, 콘솔 오류 0, 남은 리스너·애니메이션이 없다.
   - 확인: Task 5 e2e `figure state resets after leaving the day`.
3. **320px에서 그림과 조작**
   - 기대: 긴 경로(`../../my-creator-site/images/profile.svg`)와 CSS 줄이 줄을 바꾸고, 라디오 줄이 감겨서 페이지 가로 스크롤 0. 그림 무대가 글 열 밖으로 나가지 않는다.
   - 확인: Task 6·7 e2e `figures fit 320px`.
4. **동작 줄이기에서 단계 버튼**
   - 기대: 처음에 마지막 단계(모든 선과 상자가 보임)와 "↺ 처음부터". 누르면 1단계, 다시 누르면 2단계. 어느 때도 그림 안 `getAnimations()`가 0이다.
   - 확인: Task 5 e2e `reduced motion shows the final step and never animates`.
5. **키보드만으로 G3 조작**
   - 기대: 라디오에 포커스하고 화살표로 값을 바꾸면 배치·결과 줄이 바뀌고 포커스는 그 라디오에 남는다(묶음을 다시 그리지 않는다). 결과 줄은 `aria-live="polite"`로 읽힌다.
   - 확인: Task 7 e2e `keyboard changes flex values and keeps focus`.

---

## 파일 구조

| 파일 | 책임 | Task |
|---|---|---|
| `DESIGN.md` | Layout 셸·상한 표·The Fluid Rule(5폭), 그림 틀 문안, Motion 표 | 1, 3 |
| `textbook/src/styles/shell.css`, `day.css`, `pages.css` | 화면 묶음 가운데 정렬, 두 열 상한, 푸터 안쪽 | 1 |
| `tests/helpers/site-check.mjs` | `SITE_WIDTHS`에 1920 | 1 |
| `tests/e2e/wide.test.mjs` (신규) | 넓은 화면 정렬 | 1 |
| `tests/e2e/layout.test.mjs` | `checkSiteWidths` 폭 기대값 | 1 |
| `tests/visual/visual.test.mjs` | 넓은 화면 장면(Task 1), 그림 장면(Task 8) | 1, 8 |
| `CLAUDE.md`, `docs/CHECKPOINT.md` | "4폭" → "5폭", 코드 위치·스타일 순서 | 1, 9 |
| `docs/CONTENT-GUIDE.md` | 1.3 블록 표, 새 1.7 그림 절, 7장 체크리스트 한 줄, 부록 B 오류 코드 | 3 |
| `textbook/lib/markdown.mjs` | `:::figure` 분리·검사·HTML | 2 |
| `textbook/lib/figures.mjs` (신규) | `loadFigureIds(srcDir)` | 2 |
| `textbook/lib/styles.mjs` | `STYLE_ORDER`에 `figures`, `RAW_COLOR` export | 2, 4 |
| `textbook/build.mjs` | id 읽기, Day·부록 렌더에 `figures` 전달 | 2 |
| `textbook/src/figures/index.js` (신규) | `FIGURES` 등록표 | 2, 5~7 |
| `textbook/src/app/views/common.js` | `svg(tag, attrs, ...children)` | 4 |
| `textbook/src/app/motion.js` | `rise`, `strokeIn` | 4 |
| `textbook/src/app/views/figure.js` (신규) | `mountFigures`, `stepView`, `stepFigure`, `choiceName`, `choiceGroup` | 4 |
| `textbook/src/styles/figures.css` (신규) | 그림 틀과 그림 4개 | 4~7 |
| `textbook/src/styles/print.css` | 단계 버튼·선택 묶음 숨김 | 4 |
| `textbook/src/app/views/day.js`, `page.js` | `mountFigures`, 그림 틀 Reveal | 4 |
| `textbook/src/figures/request-response.js`, `git-flow.js`, `paths.js`, `flex-axes.js` (신규) | 그림 4개 | 5~7 |
| `textbook/content/p1/day-01.md`, `day-04.md`, `day-05.md`, `day-07.md`, `day-11.md` | `:::figure` 블록 | 5~7 |
| `tests/unit/markdown.test.mjs`, `tests/unit/figures.test.mjs` (신규), `tests/unit/motion.test.mjs`, `tests/unit/styles.test.mjs`, `tests/build/build.test.mjs` | 문법·검증·순수 계산 | 2, 4~7 |
| `tests/e2e/figures.test.mjs` (신규) | 그림 동작 | 5~7 |

---

### Task 1: 넓은 화면 가운데 정렬

**Files:**
- Modify: `DESIGN.md`(Layout "셸", 크기 토큰 표의 "쓰는 곳", The Fluid Rule), `textbook/src/styles/shell.css:401-445`, `textbook/src/styles/day.css:870-880`, `textbook/src/styles/pages.css`(`.search-view`, `.page-article.has-aside`), `tests/helpers/site-check.mjs:13-14`, `tests/e2e/layout.test.mjs:389-397`, `tests/visual/visual.test.mjs`, `CLAUDE.md`(62·158행), `docs/CHECKPOINT.md`(기준선 check:site 줄)
- Create: `tests/e2e/wide.test.mjs`

**Interfaces:**
- Produces: 화면 묶음 선택자 표(아래 e2e의 `SCREENS`). Task 8이 같은 폭 목록을 쓴다.

- [ ] **Step 1: DESIGN.md Layout "셸"의 "본문"·"홈 열" 두 줄을 아래로 바꾸고, 그 다음에 상한 표를 넣는다**

```markdown
- 본문: `container-type: inline-size`. 안쪽 여백 32·24·64px(위·좌우·아래), 640px 이하에서 16·16·48px.
- 화면 묶음: 본문의 바로 아래 자식(홈 `.home`, Day `.lesson`, 월드 `.world-page`, 부록 `.page-article`, 설정 `.settings`, 검색 `.search-view`, 잠금·404·오류)은 자기 상한 폭 안에서 `margin-inline: auto`로 본문 영역 가운데에 놓인다. 묶음 안의 글·카드는 왼쪽 정렬이다. 글 줄의 시작점이 화면마다 흔들리지 않게 하기 위해서다. 본문이 상한보다 좁으면 묶음이 꽉 차서 그대로다. 새 브레이크포인트는 없다.
- 글 열은 넓히지 않는다: Day 글 열은 넓은 화면에서도 `--lesson-max`(720px)다. 남는 폭은 좌우 여백으로 나눈다(WCAG 1.4.8 줄 폭).
- 상단 바와 사이드바는 화면 전체 폭에 붙는다. 푸터 안 내용은 `padding-inline: max(var(--space-lg), (100% - var(--content-max)) / 2)`로 홈 묶음과 같은 폭에 가운데로 온다.

| 화면 묶음 | 상한 폭 |
|---|---|
| 홈, 월드 | `var(--content-max)` (1120px) |
| Day·부록, 오른쪽 열 있음(80rem 이상) | `calc(var(--lesson-max) + var(--space-xl) + var(--aside-w))` (972px). 두 열 묶음 전체가 가운데에 온다 |
| Day, 오른쪽 열 없음 | `var(--lesson-max)` (720px) |
| 부록 글, 오른쪽 열 없음 | `calc(var(--measure) + 2rem)` |
| 설정 | 44rem |
| 검색 페이지 | 40rem (검색 카드와 같다) |
| 잠금, 404, 오류 | 40rem |
```

  - 크기 토큰 표 `--content-max` 행의 "쓰는 곳"을 `홈·월드 묶음 최대 폭, 푸터 안 내용 폭`으로 바꾼다.
  - The Fluid Rule 끝 문장의 `320·375·768·1280 전 페이지 점검`을 `320·375·768·1280·1920 전 페이지 점검`으로 바꾸고, 그 뒤에 `넓은 화면(1440·1920)은 홈·Day·월드·용어 사전·설정 시각 장면으로 본다.`를 붙인다.

- [ ] **Step 2: 넓은 화면 시각 장면을 먼저 더해 "고치기 전"을 찍는다**

`tests/visual/visual.test.mjs` `SCENES` 끝에 더한다(모두 `widths: [1440, 1920]`):

```js
{ id: 'wide-home', hash: '#/', progress: P1_FIRST_THREE, widths: [1440, 1920], fullPage: true },
{ id: 'wide-day', hash: '#/day/p1-d04', progress: P1_FIRST_THREE, widths: [1440, 1920] },
{ id: 'wide-world', hash: '#/project/p1', progress: P1_FIRST_THREE, widths: [1440, 1920] },
{ id: 'wide-glossary', hash: '#/page/glossary', progress: null, widths: [1440, 1920] },
{ id: 'wide-settings', hash: '#/settings', progress: null, widths: [1440, 1920] },
```

Run: `npm run test:visual`
Expected: 기존 158개 통과, 새 20장은 기준 없음으로 실패하고 `tests/visual/.out`에 실제 이미지가 남는다. 그 20장을 저장소 밖 스크래치 폴더의 `before/`로 복사한다.

- [ ] **Step 3: 실패하는 e2e를 쓴다** — `tests/e2e/wide.test.mjs`

실제 교재(`textbook/content`)를 `build({ contentDir, allowMissing: true })`로 빌드해 정적 서버로 연다(`tests/visual/visual.test.mjs`의 before와 같은 방식). 진도는 `P1_FIRST_THREE`를 `STORAGE_KEY`로 넣는다.

```js
const SCREENS = [
  ['#/', '.home'], ['#/day/p1-d04', '.lesson'], ['#/project/p1', '.world-page'],
  ['#/page/glossary', '.page-article'], ['#/settings', '.settings'], ['#/search', '.search-view'],
];
// 묶음의 좌우 여백 = 본문 안쪽(패딩 안) 기준
const gaps = (sel) => {
  const main = document.querySelector('#main');
  const cs = getComputedStyle(main);
  const r = main.getBoundingClientRect();
  const b = document.querySelector(sel).getBoundingClientRect();
  const de = document.documentElement;
  return { left: b.left - (r.left + parseFloat(cs.paddingLeft)), right: r.right - parseFloat(cs.paddingRight) - b.right, scroll: de.scrollWidth - de.clientWidth };
};

test('wide layout centers each screen', TIMEOUT, async () => {
  for (const width of [1280, 1440, 1920]) {
    for (const [hash, sel] of SCREENS) {
      // viewport { width, height: 900 }, goto(hash), waitForSelector(sel)
      const g = await page.evaluate(gaps, sel);
      assert.ok(Math.abs(g.left - g.right) <= 2, `${width} ${hash}: ${g.left} vs ${g.right}`);
      assert.ok(g.left >= -0.5 && g.right >= -0.5);
      assert.equal(g.scroll, 0);
    }
  }
});

test('1920px day keeps a 720px text column and a 220px sticky quest log', TIMEOUT, async () => {
  // width 1920, '#/day/p1-d04'
  assert.equal(Math.round(await width('.lesson-body')), 720);
  assert.equal(Math.round(await width('.quest-log')), 220);
  // window.scrollTo(0, 1500) 뒤: getComputedStyle(.quest-log).position === 'sticky', top === 56 + 24 (±1)
});

test('footer content lines up with the home column at 1920px', TIMEOUT, async () => {
  // '.footer-brand' left 와 '.home' left 차이 ≤ 2
});
```

Run: `node --test ../tests/e2e/wide.test.mjs`
Expected: FAIL. 1440·1920의 모든 화면에서 `left`가 `right`보다 작다(예: 1920 홈 0 vs 600).

- [ ] **Step 4: CSS를 고친다**
  - `shell.css` `.main > *`: `max-width: var(--content-max); margin-inline: auto;`(62rem를 지운다).
  - `shell.css` `.site-footer`: `padding: var(--space-lg)`를 `padding-block: var(--space-lg); padding-inline: max(var(--space-lg), (100% - var(--content-max)) / 2);`로. 640px 이하 규칙(783~790행)의 푸터 안쪽 여백도 같은 식으로 맞춘다.
  - `day.css` `.lesson.has-aside`(80rem): `justify-content: start; max-width: none;`을 `max-width: calc(var(--lesson-max) + var(--space-xl) + var(--aside-w));`로.
  - `pages.css` `.page-article.has-aside`(80rem): 위와 같다.
  - `pages.css`에 `.search-view { max-width: 40rem; }`(검색 카드 위, 주석: DESIGN.md Layout 화면 묶음).
  - 화면 묶음에 `margin`을 따로 준 규칙이 있으면(`grep -n "margin" `로 `.home`·`.lesson`·`.world-page`·`.page-article`·`.settings`·`.search-view`·`.lock-screen`·`.notfound` 확인) `margin-inline`을 덮지 않게 고친다.

- [ ] **Step 5: 통과 확인**

Run: `node --test ../tests/e2e/wide.test.mjs` 그리고 `npm run test:e2e`
Expected: 새 3개 통과, 기존 238개 통과.

- [ ] **Step 6: 전 페이지 점검 5폭**
  - `site-check.mjs`: `SITE_WIDTHS = [320, 375, 768, 1280, 1920]`, 주석에 `1920 = 넓은 화면(DESIGN.md Layout 화면 묶음)`.
  - `layout.test.mjs` 389행 테스트 이름을 `…320 reflow, 375, 768, 1280, 1920`으로, 393행 기대값을 5폭으로.
  - `CLAUDE.md` 62행 폭 목록과 158행 "4폭"을 "5폭"으로, `docs/CHECKPOINT.md` 기준선 check:site 줄은 Task 9에서 실측 숫자로 고친다.

Run: `npm run build:site` 뒤 `_site`를 로컬 정적 서버로 띄워 `npm run check:site -- <로컬 주소>`
Expected: 5폭 각각 "방문 168개, 문제 0개"

- [ ] **Step 7: 시각 테스트 대조와 승인**

Run: `npm run test:visual`
Expected: 새 20장 기준 없음 + 위치가 바뀐 기존 장면 실패(예상: 1280 설정·확인 Modal·검색 페이지·404·잠금·시작하기·문제 해결, 768 설정 등). 실패 목록을 그대로 적고, `before/`와 새 `.out`을 1440·1920 라이트·다크(홈·Day·월드·설정)로 나란히 사용자에게 보인다. 바뀐 기존 장면도 함께 보인다.

- [ ] **Step 8: 승인 뒤 기준 이미지 갱신**

Run: `npm run test:visual:update` 그리고 `npm run test:visual`
Expected: 178/178 통과(기준 이미지 176장)

- [ ] **Step 9: Commit**

```bash
git add DESIGN.md CLAUDE.md textbook/src/styles tests/e2e/wide.test.mjs tests/e2e/layout.test.mjs tests/helpers/site-check.mjs tests/visual
git commit -m "feat(layout): center each screen bundle on wide screens, check 1920px"
```

---

### Task 2: `:::figure` 문법과 빌드 검증

**Files:**
- Modify: `textbook/lib/markdown.mjs`(`CONTAINER_KINDS`, `renderBox`, `renderMarkdown` ctx), `textbook/build.mjs`(4·5단계 렌더 호출)
- Create: `textbook/lib/figures.mjs`, `textbook/src/figures/index.js`
- Test: `tests/unit/markdown.test.mjs`, `tests/build/build.test.mjs`

**Interfaces:**
- Produces:
  - `renderMarkdown(src, { …, figures: Set<string> })` — `figures`가 없으면 빈 Set. 결과에 `figureCount: number`를 더한다.
  - 그림 HTML(Task 4가 이 모양을 읽는다):
    ```html
    <figure class="figure" id="{prefix}-fig{n}" data-figure="{id}">
    <div class="figure-stage"><div class="figure-art" role="img" aria-label="{alt}"><p class="figure-fallback">{alt}</p></div></div>
    <figcaption class="figure-cap"><span class="label">그림 {n}</span> {caption}</figcaption>
    </figure>
    ```
  - `loadFigureIds(srcDir) → Promise<Set<string>>` — `pathToFileURL(path.join(srcDir, 'figures', 'index.js'))`를 import해 `Object.keys(FIGURES)`.
  - `src/figures/index.js`: `export const FIGURES = {}`(Task 5~7이 채운다). 값은 `mount(fig, { reducedMotion }) → dispose` 함수다. 빌드가 Node에서 이 파일을 import하므로, 그림 코드와 그것이 import하는 모듈은 최상위(모듈을 읽을 때)에서 `document`·`window`를 쓰지 않는다.

- [ ] **Step 1: 실패하는 단위 테스트** — `tests/unit/markdown.test.mjs`

```js
const FIG = new Set(['demo']);
const src = (body) => `:::figure demo\n${body}\n:::\n`;

test('figure block renders the frame with number, caption and alt', () => {
  const r = renderMarkdown(src('캡션: 요청과 응답\n대체 설명: 나 → 서버 "주세요"'), { idPrefix: 'p1-d01', figures: FIG });
  assert.deepEqual(r.errors, []);
  assert.equal(r.figureCount, 1);
  assert.match(r.html, /<figure class="figure" id="p1-d01-fig1" data-figure="demo">/);
  assert.match(r.html, /role="img" aria-label="나 → 서버 &quot;주세요&quot;"/);
  assert.match(r.html, /<p class="figure-fallback">나 → 서버 &quot;주세요&quot;<\/p>/);
  assert.match(r.html, /<figcaption class="figure-cap"><span class="label">그림 1<\/span> 요청과 응답<\/figcaption>/);
  assert.match(r.text, /요청과 응답/); // 검색 색인
});
test('figures are numbered in document order', () => {
  const r = renderMarkdown(src('캡션: 가\n대체 설명: 나') + '\n' + src('캡션: 다\n대체 설명: 라'), { idPrefix: 'x', figures: FIG });
  assert.match(r.html, /id="x-fig2"[\s\S]*그림 2<\/span> 다/);
});
test('figure errors: unknown id, missing id, caption, alt, stray line', () => {
  const codes = (s, figures = FIG) => renderMarkdown(s, { figures }).errors.map((e) => e.code);
  assert.deepEqual(codes(':::figure nope\n캡션: a\n대체 설명: b\n:::\n'), ['E_FIGURE_UNKNOWN']);
  assert.deepEqual(codes(':::figure\n캡션: a\n대체 설명: b\n:::\n'), ['E_FIGURE_ID']);
  assert.deepEqual(codes(src('대체 설명: b')), ['E_FIGURE_CAPTION']);
  assert.deepEqual(codes(src('캡션: a')), ['E_FIGURE_ALT']);
  assert.deepEqual(codes(src('캡션: a\n대체 설명: b\n그냥 글')), ['E_FIGURE_LINE']);
  assert.deepEqual(codes(src('캡션: a\n대체 설명: b'), new Set()), ['E_FIGURE_UNKNOWN']); // figures 를 안 주면 아무 id 도 없다
});
```

- [ ] **Step 2: 실패 확인**

Run: `node --test ../tests/unit/markdown.test.mjs`
Expected: FAIL(`E_CONTAINER_TYPE` 또는 그림 HTML 없음)

- [ ] **Step 3: 구현**
  - `CONTAINER_KINDS`에 `'figure'`를 더한다(1.3 오류 문구의 종류 목록에 자동으로 들어간다).
  - `renderBox`에서 `figure`는 Markdown으로 렌더하지 않는다. 몸통 줄을 하나씩 본다: 빈 줄은 건너뛰고, `/^캡션:\s*(.+)$/`, `/^대체 설명:\s*(.+)$/`이 아니면 `E_FIGURE_LINE`(줄 번호 = `box.bodyLine + i`). id(`box.title`)는 `/^[a-z0-9-]+$/`가 아니면 `E_FIGURE_ID`, 등록표에 없으면 `E_FIGURE_UNKNOWN`(메시지에 등록된 id 목록). 캡션·대체 설명은 글자 그대로 `esc()`한다.
  - 오류 문구:
    - `E_FIGURE_ID`: `:::figure 뒤에 그림 id 를 써 주세요(영문 소문자·숫자·-). 예: :::figure request-response`
    - `E_FIGURE_UNKNOWN`: `없는 그림 id 예요: "${id}" (src/figures/index.js 에 있는 id: ${[...figures].join(', ') || '없음'})`
    - `E_FIGURE_CAPTION`: `그림에 "캡션: …" 줄이 없어요.`
    - `E_FIGURE_ALT`: `그림에 "대체 설명: …" 줄이 없어요. 그림을 못 보는 사람도 같은 내용을 알 수 있게 써 주세요.`
    - `E_FIGURE_LINE`: `그림 블록 안에는 "캡션:"과 "대체 설명:" 줄만 쓸 수 있어요.`
  - `lib/figures.mjs` `loadFigureIds(srcDir)`. `build.mjs`는 1단계 뒤에 한 번 읽어 Day(174행)·부록(191행) `renderMarkdown`에 `figures`로 넘긴다. import가 실패하면 `issue('E_FIGURE_REGISTRY', …)`로 빌드를 멈춘다.

- [ ] **Step 4: 빌드 테스트** — `tests/build/build.test.mjs`

```js
test('build stops on an unknown figure id', async () => {
  // 픽스처를 임시 폴더로 복사하고 fa/day-01.md 개념 절에 ':::figure nope\n캡션: a\n대체 설명: b\n:::' 를 넣는다
  const r = await build({ contentDir: tmpContent, allowMissing: true });
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => e.code === 'E_FIGURE_UNKNOWN' && e.file.endsWith('day-01.md')));
});
test('figure registry ids are kebab-case functions', async () => {
  const { FIGURES } = await import('../../textbook/src/figures/index.js');
  for (const [id, mount] of Object.entries(FIGURES)) {
    assert.match(id, /^[a-z0-9-]+$/);
    assert.equal(typeof mount, 'function');
  }
});
```

- [ ] **Step 5: 통과 확인**

Run: `npm test` 그리고 `npm run check -- --allow-missing`
Expected: 모두 통과, "검사 통과: Day 155개, 페이지 4개"

- [ ] **Step 6: Commit**

```bash
git add textbook/lib textbook/build.mjs textbook/src/figures tests/unit/markdown.test.mjs tests/build/build.test.mjs
git commit -m "feat(build): :::figure block with id, caption and alt checks"
```

---

### Task 3: 그림 문서 (DESIGN.md 그림 틀, CONTENT-GUIDE 그림 절)

**Files:**
- Modify: `DESIGN.md`(Components "Day 부품" 그림 틀, Motion 표·"동작 줄이기", Breakpoints `print` 행, frontmatter `figure`), `docs/CONTENT-GUIDE.md`(목차, 1.3, 새 1.7, 7.1, 부록 B)

**Interfaces:**
- Produces: 아래 문안. Task 4~7이 값을 여기서 가져온다.

- [ ] **Step 1: DESIGN.md "Day 부품"의 **그림 틀** 항목을 아래로 바꾼다**

```markdown
- **그림 틀:** `figure.figure`, `card` 면, 2px `rule` 테두리, 모서리 `--radius-card`, 위아래 `var(--space-lg)`. 2칸 격자: 무대가 윗줄 전체, 아래 줄은 캡션(왼쪽) | 단계 버튼(오른쪽, 있을 때). 아래 줄 안쪽 `var(--space-sm) var(--space-md)`, 위 1px `rule` 선, 칸 사이 `var(--space-sm)`, 좁으면 버튼이 캡션 아래로 감긴다.
  - 무대: `paper` 바탕, 안쪽 `var(--space-lg) var(--space-md)`, 부품 사이 `var(--space-md)`. 그림(`figure-art`)은 폭 `min(100%, 30rem)`, 가운데. 높이는 그림이 정한다. 대체 설명은 그림의 `role="img"` `aria-label`이고, 그림을 붙이기 전·실패했을 때는 같은 글이 그림 자리에 Body(`ink-2`)로 보인다.
  - 그림 안: 상자는 `card` 면에 1px `rule` 테두리(모서리 `var(--space-2xs)`), 글자는 `ink`(이름 800), 선·화살표는 `ink` 2px, 보조 글자는 `ink-2`. 강조(지금 단계, 고른 경로·값)는 `track` 바탕과 `ink` 800이다. 초록·분홍·금색은 쓰지 않는다. 그림 글자는 15px 이상으로 보이게 그린다(SVG `viewBox` 폭 320 기준 글자 15).
  - 캡션: Label "그림 n"(`ink-2`) + 캡션 15px `ink`. n은 그 페이지 안의 순서다.
  - 단계 그림: 무대 아래에 단계 줄(Label "단계 n/전체" + 그 단계 문장 15px `ink`, `aria-live="polite"`). 단계 버튼은 보조 버튼 "▶ 다음 단계", 마지막 단계에서 "↺ 처음부터". 처음은 1단계, 동작 줄이기면 마지막 단계에서 시작한다.
  - 값 고르기 그림: 무대 아래에 선택 묶음(`fieldset`, 테두리 없음, legend는 Label `ink-2`, 라디오는 Forms 라디오, 선택지는 줄바꿈되는 가로 줄, 사이 `var(--space-2xs) var(--space-md)`, 값 글자는 WZH Code `--text-code`)과 결과 줄(15px `ink`, 코드는 인라인 코드 규칙, `aria-live="polite"`). 값을 바꾸면 그림과 결과 줄이 바로 바뀐다.
  - 인쇄: 단계 버튼과 선택 묶음을 숨기고 지금 그림과 결과 줄을 그대로 찍는다.
```

- [ ] **Step 2: Motion 표에 두 행을 더한다(Accordion 행 다음)**

```markdown
| 그림 틀 Reveal | Day·부록의 그림 틀이 처음 화면에 들어올 때 | `reveal()`: 아래 8px에서 올라오며 투명도 0→1, 280ms `--ease-out`, 한 번 |
| 그림 단계 | 단계 그림에서 앞으로 갈 때 새로 보이는 요소 | 선은 `stroke-dashoffset` 1→0(`strokeIn`), 그 밖은 아래 8px에서 올라옴(`rise`). 둘 다 280ms `--ease-out`. 뒤로(처음부터) 갈 때와 값 고르기 그림은 애니메이션 없음 |
```

  - "동작 줄이기"의 JS 건너뛰기 목록에 `그림 단계`를 더하고, 문장 끝에 `그림은 마지막 단계(최종 상태)로 보인다.`를 붙인다.
  - Breakpoints `print` 행에 `그림의 단계 버튼·선택 묶음`을 더한다.
  - frontmatter `figure:`에 `borderColor: "{colors.rule}"`를 더한다.

- [ ] **Step 3: CONTENT-GUIDE**
  - 1.3 표에 행 추가: `| :::figure <id> | 그림 틀(그림 n + 캡션) | 개념 그림. 1.7절 |`. "종류는 위 6개뿐이다"를 "종류는 위 7개뿐이다"로.
  - 목차 1번 줄 설명에 `그림`을 더하고, 새 절 1.7을 1.6 다음에 넣는다:

```markdown
### 1.7 그림 (`:::figure`)

개념 이해 절에서 글과 표로 그리기 어려운 흐름·구조를 보여 줄 때만 쓴다. 그림은 글을 대신하지 않고 돕는다.

| 등급 | 형태 | 예 |
|---|---|---|
| G1 | 움직이지 않는 그림 | 폴더 구조 |
| G2 | 단계 그림: "▶ 다음 단계"로 한 단계씩 | 요청·응답 왕복, Git 흐름 |
| G3 | 값 고르기 그림: 값을 바꾸면 결과가 바로 바뀜 | 상대 경로 계산, Flexbox 정렬 |
| G4 | 3D 그림 (M13부터) | 박스 모델, DOM 트리 |

늘 가장 낮은 등급부터 고른다. 쓰는 법:

````md
:::figure request-response
캡션: 주소를 입력한 뒤 화면이 보이기까지
대체 설명: 왼쪽부터 나, 브라우저, 서버가 있어요. ① …
:::
````

- id는 `textbook/src/figures/index.js`에 등록된 것만 쓴다(없으면 `E_FIGURE_UNKNOWN`). 새 그림은 본문 작성 세션이 아니라 기능 마일스톤에서 그림 코드와 함께 만든다. 작성 세션은 등록된 id만 쓰고, 필요한 그림은 검증 기록에 제안으로 적는다.
- 블록 안에는 `캡션:` 한 줄과 `대체 설명:` 한 줄만 쓴다(`E_FIGURE_CAPTION`, `E_FIGURE_ALT`, `E_FIGURE_LINE`). 둘 다 글자 그대로 나오므로 `**`·백틱·링크를 쓰지 않는다.
- 캡션은 그림이 답하는 질문을 짧은 명사구로 쓴다. 대체 설명은 그림을 못 보는 사람이 같은 내용을 알 수 있게, 그림 속 이름·단계·경로를 빠짐없이 순서대로 쓴다. JS가 꺼지거나 그림이 실패하면 대체 설명이 그림 자리에 보인다.
- `text` 그림 블록을 그림으로 바꿀 때는 그 블록의 정보를 대체 설명에 모두 옮긴다. 과제·정답이 참고하는 `text` 블록(예: 과제 폴더 모양)은 남긴다.
- 단계 그림·값 고르기 그림 앞 문장에서 무엇을 누르거나 바꿔 볼지 한 문장으로 안내한다.
```

  - 7.1 체크리스트에 한 줄: `- [ ] 그림의 대체 설명만 읽어도 그림과 같은 정보를 얻는가? 그림 앞에 무엇을 해 볼지 안내가 있는가?`
  - 부록 B 표에 행 추가: `| E_FIGURE_ID / E_FIGURE_UNKNOWN / E_FIGURE_CAPTION / E_FIGURE_ALT / E_FIGURE_LINE | 그림 id 없음·형식 오류, 등록되지 않은 id, 캡션·대체 설명 줄 없음, 다른 줄 | 1.7절 |`

- [ ] **Step 4: 다시 실행**

Run: `npm test`
Expected: 모두 통과. `tokens.css equals the token block in DESIGN.md` PASS(토큰은 바뀌지 않음).

- [ ] **Step 5: Commit**

```bash
git add DESIGN.md docs/CONTENT-GUIDE.md
git commit -m "docs: figure frame spec and content guide figure section"
```

---

### Task 4: 그림 틀 (공용 부품, 스타일, Reveal)

**Files:**
- Create: `textbook/src/app/views/figure.js`, `textbook/src/styles/figures.css`, `tests/unit/figures.test.mjs`
- Modify: `textbook/src/app/views/common.js`, `textbook/src/app/motion.js`, `textbook/lib/styles.mjs`, `textbook/src/styles/print.css`, `textbook/src/app/views/day.js:310-330`, `textbook/src/app/views/page.js`, `tests/unit/motion.test.mjs`, `tests/unit/styles.test.mjs:13-14`, `tests/build/build.test.mjs`

**Interfaces:**
- Consumes: Task 2 그림 HTML, `FIGURES`.
- Produces:
  - `svg(tag, attrs, ...children) → SVGElement` (common.js, `createElementNS('http://www.w3.org/2000/svg', …)`, 속성은 `setAttribute`, 자식은 `h`와 같은 규칙)
  - `rise(el, env = motionEnv()) → Animation | null`, `strokeIn(path, env = motionEnv()) → Animation | null` (motion.js; `RISE`·`[{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }]`, `ENTER_MS`, `EASE_OUT`, `fill: 'backwards'`. 선은 `pathLength="1"`, `stroke-dasharray: 1`을 CSS로 둔다)
  - `mountFigures(root, figures, env = motionEnv()) → dispose` — 등록표는 부르는 쪽(`day.js`·`page.js`)이 `src/figures/index.js`에서 import해 넘긴다. 그림 코드가 `views/figure.js`를 import하므로, `figure.js`가 등록표를 import하면 순환이 된다
  - `stepView(step, total) → { label: string, button: string, next: number }`
  - `stepFigure(fig, { steps: string[], reducedMotion }) → dispose` — `fig` 안 `[data-step]`·`[data-step-only]`를 단계마다 켜고 끈다(꺼진 요소는 클래스 `is-off`)
  - `choiceName(figId, key) → string`
  - `choiceGroup(fig, { key, legend, options: { value, label }[], value, onChange }) → HTMLFieldSetElement`
  - `STYLE_ORDER` = `[..., 'pages', 'figures', 'print']`, `RAW_COLOR` export

- [ ] **Step 1: 실패하는 단위 테스트** — `tests/unit/figures.test.mjs`, `tests/unit/motion.test.mjs`

```js
test('stepView labels, button text and next step', () => {
  assert.deepEqual(stepView(1, 4), { label: '단계 1/4', button: '▶ 다음 단계', next: 2 });
  assert.deepEqual(stepView(4, 4), { label: '단계 4/4', button: '↺ 처음부터', next: 1 });
});
test('choiceName is unique per figure and key', () => {
  assert.equal(choiceName('p1-d11-fig1', 'justify'), 'p1-d11-fig1-justify');
});
test('mountFigures mounts known figures and keeps the fallback when one throws', () => {
  // 가짜 figure 세 개: { dataset: { figure }, innerHTML, classList: { add } } 와 root.querySelectorAll
  // 등록표 { ok: () => okDispose, bad: () => { throw new Error('x') } }, 세 번째는 등록표에 없는 id
  // 기대: ok 는 한 번 불림(옵션 { reducedMotion: false }), bad 는 innerHTML 이 원래 값으로 돌아오고 'is-fallback',
  //       없는 id 도 'is-fallback'. dispose() 를 부르면 okDispose 가 한 번 불린다
});
// motion.test.mjs
test('rise and strokeIn do nothing under reduced motion or without animate', () => {
  assert.equal(rise({ animate: () => 'a' }, { reduce: true }), null);
  assert.equal(strokeIn({}, { reduce: false }), null);
  assert.equal(strokeIn({ animate: () => 'a' }, { reduce: false }), 'a');
});
```

  - `styles.test.mjs`의 순서 기대값에 `'figures'`를 `'pages'`와 `'print'` 사이에 넣는다.
  - 빌드 테스트 `figure code has no raw colors`: `src/figures/*.js`와 `src/app/views/figure.js`의 원문에 `RAW_COLOR`가 0건.

- [ ] **Step 2: 실패 확인**

Run: `npm test`
Expected: FAIL(모듈·export 없음, 순서 다름)

- [ ] **Step 3: 구현**
  - `mountFigures`: `root.querySelectorAll('figure.figure[data-figure]')`마다 `before = fig.innerHTML`을 저장하고 `figures[id]`를 부른다. 없거나 예외면 `fig.innerHTML = before`, `fig.classList.add('is-fallback')`. 콘솔에 쓰지 않는다(전 페이지 점검의 콘솔 오류 0 유지).
  - `stepFigure`: 무대 끝에 단계 줄(`p.figure-step[aria-live=polite]` > `span.label` + `span`), figcaption 앞에 `button.btn.figure-next[type=button]`. 단계를 바꿀 때 앞으로 가면 이번에 켜진 요소에 `strokeIn`(`path.fig-line`) 또는 `rise`. dispose는 리스너를 떼고 돌고 있는 애니메이션을 `cancel()`한다.
  - `choiceGroup`: `fieldset.figure-choice` > `legend.label` + 선택지마다 `label > input[type=radio][name=choiceName][value] + code`. `change`에서 `onChange(value)`. 묶음은 한 번만 만들고 다시 그리지 않는다.
  - `figures.css`: Task 3 문안의 틀(`.figure`, `.figure-stage`, `.figure-art`, `.figure-fallback`, `.figure-cap`, `.figure-next`, `.figure-step`, `.figure-choice`, `.figure-out`, `.is-off { visibility: hidden }`, `.fig-line { stroke-dasharray: 1 }`). 640px 이하는 DESIGN.md 브레이크포인트 `(max-width: 40rem)`만 쓴다.
  - `print.css`: `.figure-next, .figure-choice { display: none; }`.
  - `day.js`: 본문을 붙인 뒤 `ctx.onCleanup(mountFigures(body, FIGURES))`와 `ctx.onCleanup(reveal(body.querySelectorAll('figure.figure')))`(M1 넘김). `page.js`도 본문에 `mountFigures(body, FIGURES)`.

- [ ] **Step 4: 통과 확인**

Run: `npm test` 그리고 `npm run test:e2e`
Expected: 모두 통과(아직 본문에 그림이 없으므로 e2e는 그대로)

- [ ] **Step 5: Commit**

```bash
git add textbook/src textbook/lib/styles.mjs tests/unit tests/build
git commit -m "feat(figure): figure frame, step and choice controls, fallback and reveal"
```

---

### Task 5: 단계 그림 2개 (Day 1 요청·응답, Day 7 Git 흐름)

**Files:**
- Create: `textbook/src/figures/request-response.js`, `textbook/src/figures/git-flow.js`, `tests/e2e/figures.test.mjs`
- Modify: `textbook/src/figures/index.js`, `textbook/src/styles/figures.css`, `textbook/content/p1/day-01.md:44-57`, `textbook/content/p1/day-07.md:53-65`

**Interfaces:**
- Consumes: `svg`, `stepFigure`(Task 4).
- Produces: `FIGURES['request-response']`, `FIGURES['git-flow']`, 각 파일의 `STEPS: string[]`(아래 문장 그대로).

- [ ] **Step 1: 본문을 바꾼다**
  - Day 1: "주소를 입력한 뒤 화면이 보이기까지는 이런 순서로 일이 일어나요." 다음에 ` 그림의 **▶ 다음 단계**를 눌러 한 단계씩 봐요.`를 붙이고, 바로 아래 `text` 블록(①~④)을 아래로 바꾼다.

```md
:::figure request-response
캡션: 주소를 입력한 뒤 화면이 보이기까지
대체 설명: 왼쪽부터 나, 브라우저, 서버가 있어요. ① 내가 주소(URL)를 입력하면 브라우저가 서버에 "이 페이지 주세요"라고 요청해요. ② 서버가 HTML 파일 hello.html을 보내요. ③ 브라우저가 받은 HTML을 화면에 그려요. ④ 내가 웹페이지를 봐요.
:::
```

  - Day 7: "고친 파일이 GitHub에 올라가기까지의 흐름이에요." 다음에 ` **▶ 다음 단계**를 눌러 따라가 봐요.`를 붙이고 `text` 블록을 바꾼다.

```md
:::figure git-flow
캡션: 고친 파일이 GitHub에 올라가기까지
대체 설명: 위에서 아래로 네 칸이 있어요. 작업 폴더에서 파일을 고치고, git add로 스테이징에 올려 두고, git commit으로 내 컴퓨터의 기록에 남기고, git push로 GitHub(인터넷)에 올려 보내요.
:::
```

- [ ] **Step 2: 실패하는 e2e** — `tests/e2e/figures.test.mjs`

실제 교재를 빌드해 연다(Task 1 `wide.test.mjs`와 같은 준비, 진도 `P1_FIRST_THREE`, 폭 1280, `reducedMotion: 'no-preference'`).

```js
test('day 1 figure steps through the request and response', TIMEOUT, async () => {
  // '#/day/p1-d01', fig = 'figure[data-figure="request-response"]'
  // .figure-art 안에 svg 가 있고 .figure-fallback 은 없다
  // .figure-step .label === '단계 1/4', 버튼 '▶ 다음 단계'
  // 버튼을 세 번 누르면 '단계 4/4', 단계 문장 === STEPS[3], 버튼 '↺ 처음부터'
  // 한 번 더 누르면 '단계 1/4'
  // 단계 k 에서 '[data-step]' 중 data-step ≤ k 인 것만 is-off 가 없다
});
test('reduced motion shows the final step and never animates', TIMEOUT, async () => {
  // reducedMotion: 'reduce'. 처음 '단계 4/4'·'↺ 처음부터', is-off 0개
  // 누르면 '단계 1/4', 다시 누르면 '단계 2/4'. 매번 fig 안 getAnimations().length === 0
});
test('day 7 git figure moves the file down to GitHub', TIMEOUT, async () => {
  // '#/day/p1-d07', 4단계, 4단계에서 GitHub 칸의 파일과 기록 칸의 커밋이 모두 보인다
});
test('figure state resets after leaving the day', TIMEOUT, async () => {
  // Day 1 에서 3단계까지 → '#/' → 뒤로 가기 → '단계 1/4'. 콘솔 오류 0 (collectConsoleErrors)
});
```

Run: `node --test ../tests/e2e/figures.test.mjs`
Expected: FAIL(등록되지 않은 id라 빌드가 멈추거나 대체 설명만 보임)

- [ ] **Step 3: 그림 코드**
  - `request-response.js` `STEPS`:
    1. `나: 주소(URL)를 입력하면 브라우저가 서버에 "이 페이지 주세요"라고 요청해요.`
    2. `서버: 요청받은 HTML 파일(hello.html)을 보내요.`
    3. `브라우저: 받은 HTML을 읽고 화면에 그려요.`
    4. `나: 웹페이지를 봐요.`
  - 그림: `viewBox="0 0 320 200"`, 가로로 상자 셋(나 | 브라우저 | 서버). 화살표 `g.fig-arrow`(선 `path.fig-line[pathLength=1]` + 머리): ① 나 → 서버 "이 페이지 주세요"(`data-step="1"`), ② 서버 → 브라우저 "hello.html"(`data-step="2"`), ③ 브라우저 상자 안 작은 페이지 줄들(`data-step="3"`), ④ 브라우저 → 나 "웹페이지"(`data-step="4"`).
  - `git-flow.js` `STEPS`:
    1. `파일을 고쳤어요. 아직 작업 폴더에만 있어요.`
    2. `git add: 다음 커밋에 넣을 변경을 스테이징에 올려 둬요.`
    3. `git commit: 올려 둔 변경을 메시지와 함께 기록 하나로 남겨요.`
    4. `git push: 내 컴퓨터의 커밋을 GitHub로 올려 보내요.`
  - 그림: `viewBox="0 0 320 300"`, 위에서 아래로 칸 넷("작업 폴더", "스테이징", "내 컴퓨터의 기록", "GitHub (인터넷)"). 칸 사이 화살표 옆에 명령(WZH Code) `git add`(`data-step="2"`), `git commit`(`3`), `git push`(`4`). 파일 표시 "index.html"은 작업 폴더(`data-step-only="1"`)·스테이징(`data-step-only="2"`)에, 기록 칸의 "커밋"은 `data-step="3"`, GitHub 칸의 "커밋"은 `data-step="4"`.
  - 둘 다 `mount(fig, { reducedMotion })`가 그림을 만들어 `figure-art`의 대체 설명 문단을 바꾸고 `stepFigure(fig, { steps: STEPS, reducedMotion })`의 dispose를 돌려준다. 색은 `figures.css` 클래스로만.
  - `index.js`에 두 id를 등록한다.

- [ ] **Step 4: 통과 확인**

Run: `node --test ../tests/e2e/figures.test.mjs`, `npm test`, `npm run check -- --allow-missing`
Expected: 모두 통과

- [ ] **Step 5: Commit**

```bash
git add textbook/src textbook/content/p1/day-01.md textbook/content/p1/day-07.md tests/e2e/figures.test.mjs
git commit -m "feat(figures): request-response (day 1) and git flow (day 7) step figures"
```

---

### Task 6: 경로 그림 (Day 4·5)

**Files:**
- Create: `textbook/src/figures/paths.js`
- Modify: `textbook/src/figures/index.js`, `textbook/src/styles/figures.css`, `textbook/content/p1/day-04.md:51-58`, `textbook/content/p1/day-05.md:68-74`, `tests/unit/figures.test.mjs`, `tests/e2e/figures.test.mjs`

**Interfaces:**
- Consumes: `choiceGroup`(Task 4).
- Produces:
  - `relativePath(from, to) → string` — 둘 다 루트 기준 `/` 경로(`'hello/pages/back.html'`)
  - `routeSteps(root, from, to) → string[]` — 화면에 쓰는 줄 목록
  - `winPath(root, p) → string` — `'C:\\dev\\my-creator-site\\about.html'`
  - `FIGURES['paths-site']`, `FIGURES['paths-dev']`

- [ ] **Step 1: 실패하는 단위 테스트**

```js
test('relativePath', () => {
  assert.equal(relativePath('my-creator-site/index.html', 'my-creator-site/about.html'), 'about.html');
  assert.equal(relativePath('my-creator-site/index.html', 'my-creator-site/images/profile.svg'), 'images/profile.svg');
  assert.equal(relativePath('hello/pages/back.html', 'my-creator-site/images/profile.svg'), '../../my-creator-site/images/profile.svg');
  assert.equal(relativePath('hello/pages/back.html', 'hello/hello.html'), '../hello.html');
  assert.equal(relativePath('hello/hello.html', 'hello/hello.html'), 'hello.html');
});
test('routeSteps follows the day 5 walk', () => {
  assert.deepEqual(routeSteps('C:\\dev', 'hello/pages/back.html', 'my-creator-site/images/profile.svg'), [
    '시작: C:\\dev\\hello\\pages', '../ → C:\\dev\\hello', '../../ → C:\\dev', '내려가기: my-creator-site/images/', 'profile.svg',
  ]);
  assert.deepEqual(routeSteps('C:\\dev\\my-creator-site', 'index.html', 'about.html'), ['시작: C:\\dev\\my-creator-site', 'about.html']);
});
test('winPath', () => {
  assert.equal(winPath('C:\\dev\\my-creator-site', 'about.html'), 'C:\\dev\\my-creator-site\\about.html');
});
```

- [ ] **Step 2: 실패 확인**

Run: `node --test ../tests/unit/figures.test.mjs`
Expected: FAIL(모듈 없음)

- [ ] **Step 3: 본문을 바꾼다**
  - Day 4: "같은 폴더의 파일이면 `about.html`이라고만 써요. 내 사이트 안의 파일끼리 이을 때 써요." 문단은 그대로 두고, 그 아래 `text` 블록을 바꾼다. 블록 앞에 `아래 그림에서 지금 파일과 갈 파일을 바꿔 골라 봐요.` 한 문단을 둔다.

```md
:::figure paths-site
캡션: 같은 폴더의 파일은 파일 이름만 써요
대체 설명: my-creator-site 폴더 안에 index.html, about.html, contents.html, schedule.html, contact.html이 나란히 있어요. 지금 파일과 갈 파일을 고르면 링크에 쓸 상대 경로가 나와요. 예를 들어 index.html에서 about.html로 가는 링크는 href="about.html"이에요. 내 컴퓨터의 전체 경로 C:\dev\my-creator-site\about.html은 링크에 쓰지 않아요.
:::
```

  - Day 5: 첫 `text` 블록(폴더 모양)은 그대로 두고, 두 번째 블록(`시작: C:\dev\hello\pages` …)을 바꾼다. 블록 앞에 `시작 파일과 도착 파일을 바꿔 고르면 길이 다시 계산돼요.` 한 문단을 둔다.

```md
:::figure paths-dev
캡션: back.html에서 profile.svg까지 가는 길
대체 설명: 시작은 C:\dev\hello\pages 폴더의 back.html이에요. ../ 한 번이면 C:\dev\hello, ../../ 두 번이면 C:\dev에 도착해요. 거기서 my-creator-site/images/로 내려가 profile.svg를 찾아요. 그래서 경로는 ../../my-creator-site/images/profile.svg예요. 시작 파일과 도착 파일을 바꿔 고르면 다른 경로도 계산해 볼 수 있어요.
:::
```

- [ ] **Step 4: 그림 코드** — `paths.js`
  - 설정 두 개:
    - `paths-site`: 루트 `C:\dev\my-creator-site`, 파일 `index.html, about.html, contents.html, schedule.html, contact.html`, 시작 후보 = 전부, 기본 `index.html → about.html`, 속성 이름 `href`, 결과 줄 둘: `상대 경로: href="about.html"`, `내 컴퓨터 경로(링크에 쓰지 않아요): C:\dev\my-creator-site\about.html`.
    - `paths-dev`: 루트 `C:\dev`, 파일 `hello/hello.html, hello/pages/back.html, my-creator-site/index.html, my-creator-site/images/profile.svg`, 시작 후보 = `.html` 파일, 기본 `back.html → profile.svg`, 속성 이름 `src`, 결과 줄: `routeSteps` 목록 + `src="../../my-creator-site/images/profile.svg"`.
  - 그림(`figure-art`): 폴더 트리 목록(폴더 `\` 붙임, 깊이마다 들여쓰기 `var(--space-md)`), 시작·도착 행에 Label 표 "시작"·"도착", 길에 지나는 폴더 행은 `track` 바탕. 무대 아래 선택 묶음 둘("지금 파일"·"갈 파일", 값은 파일 이름)과 결과 줄(`p.figure-out[aria-live=polite]`, 경로는 인라인 코드라 아무 데서나 줄을 바꾼다).
  - 값이 바뀌면 트리 표시와 결과 줄만 고친다(선택 묶음은 그대로).
  - `index.js`에 두 id를 등록한다.

- [ ] **Step 5: e2e 추가**

```js
test('day 5 path figure computes the walk and updates on choice', TIMEOUT, async () => {
  // '#/day/p1-d05', 결과 줄에 'src="../../my-creator-site/images/profile.svg"'
  // '갈 파일' 에서 hello.html 을 고르면 '../hello.html', '지금 파일' 을 index.html 로 바꾸면 '../hello/hello.html'
});
test('day 4 path figure shows the file name and the local path not to use', TIMEOUT, async () => {
  // '#/day/p1-d04', 'href="about.html"' 과 'C:\\dev\\my-creator-site\\about.html'
});
test('figures fit 320px', TIMEOUT, async () => {
  // 폭 320 에서 p1-d04·p1-d05·p1-d01·p1-d07 (Task 7 뒤 p1-d11 추가): scrollWidth - clientWidth === 0,
  // 그림 틀의 right ≤ .lesson-body 의 right + 0.5
});
```

- [ ] **Step 6: 통과 확인**

Run: `npm test`, `node --test ../tests/e2e/figures.test.mjs`, `npm run check -- --allow-missing`
Expected: 모두 통과

- [ ] **Step 7: Commit**

```bash
git add textbook/src textbook/content/p1/day-04.md textbook/content/p1/day-05.md tests/unit/figures.test.mjs tests/e2e/figures.test.mjs
git commit -m "feat(figures): relative path figure for day 4 and day 5"
```

---

### Task 7: Flexbox 그림 (Day 11)

**Files:**
- Create: `textbook/src/figures/flex-axes.js`
- Modify: `textbook/src/figures/index.js`, `textbook/src/styles/figures.css`, `textbook/content/p1/day-11.md:37-41`, `tests/unit/figures.test.mjs`, `tests/e2e/figures.test.mjs`

**Interfaces:**
- Consumes: `choiceGroup`(Task 4).
- Produces:
  - `flexAxes(direction) → { main: '가로' | '세로', cross: '가로' | '세로' }`
  - `flexCss({ direction, justify, align }) → string`
  - `FIGURES['flex-axes']`

- [ ] **Step 1: 실패하는 단위 테스트**

```js
test('flexAxes swaps with the direction', () => {
  assert.deepEqual(flexAxes('row'), { main: '가로', cross: '세로' });
  assert.deepEqual(flexAxes('column'), { main: '세로', cross: '가로' });
});
test('flexCss writes the parent rule', () => {
  assert.equal(flexCss({ direction: 'row', justify: 'flex-start', align: 'stretch' }),
    'display: flex; flex-direction: row; justify-content: flex-start; align-items: stretch;');
});
```

- [ ] **Step 2: 실패 확인**

Run: `node --test ../tests/unit/figures.test.mjs`
Expected: FAIL

- [ ] **Step 3: 본문을 바꾼다** — "Flexbox에는 방향이 두 개 있어요." 목록 아래의 `text` 블록을 바꾸고, 블록 앞에 `아래 그림에서 값을 바꿔 보면 자식들이 어떻게 움직이는지 바로 보여요.` 한 문단을 둔다.

```md
:::figure flex-axes
캡션: 주축과 교차축, 그리고 정렬 속성
대체 설명: 부모 상자 안에 로고, 메뉴, 버튼 세 자식이 한 줄로 놓여 있어요. 주축은 자식들이 늘어서는 방향이고 기본값은 가로예요. 교차축은 주축과 직각인 세로예요. flex-direction, justify-content, align-items 값을 바꾸면 자식들의 방향과 주축·교차축 정렬이 바로 바뀌어요.
:::
```

- [ ] **Step 4: 그림 코드** — `flex-axes.js`
  - 그림은 실제 Flexbox다: 부모 `div.flex-demo`(높이 10rem, `card` 면, 1px `rule` 점선 테두리) 안에 자식 셋 "로고"·"메뉴"·"버튼"(글자 길이가 달라 크기가 다르다). 부모 위에 "주축 (가로) →", 옆에 "교차축 (세로) ↓" 글자(방향이 `column`이면 서로 바뀐다, `flexAxes`).
  - 값은 JS가 `style.flexDirection`·`style.justifyContent`·`style.alignItems`로 넣는다(색이 아니므로 토큰 규칙과 무관).
  - 선택 묶음 셋: `flex-direction`(`row`, `column`), `justify-content`(`flex-start`, `center`, `space-between`, `flex-end`), `align-items`(`stretch`, `flex-start`, `center`, `flex-end`). 기본 `row`·`flex-start`·`stretch`. 결과 줄: `.flex-demo { ${flexCss(…)} }`를 인라인 코드로.
  - `index.js`에 등록한다.

- [ ] **Step 5: e2e 추가**

```js
test('day 11 flex figure moves the children when values change', TIMEOUT, async () => {
  // '#/day/p1-d11', 자식 셋의 x 좌표를 잰다. justify-content 'flex-end' 를 고르면 마지막 자식의 right 가 부모 안쪽 right 와 ±1
  // flex-direction 'column' 을 고르면 자식 y 가 증가하고, 축 글자가 '주축 (세로) ↓' 로 바뀐다. 결과 줄에 'flex-direction: column;'
});
test('keyboard changes flex values and keeps focus', TIMEOUT, async () => {
  // justify-content 첫 라디오에 focus → ArrowRight → 'center' 선택, 결과 줄 갱신, activeElement 가 그 묶음의 라디오
});
```

  - `figures fit 320px`에 `p1-d11`을 더한다.

- [ ] **Step 6: 통과 확인**

Run: `npm test`, `node --test ../tests/e2e/figures.test.mjs`, `npm run check -- --allow-missing`
Expected: 모두 통과

- [ ] **Step 7: Commit**

```bash
git add textbook/src textbook/content/p1/day-11.md tests/unit/figures.test.mjs tests/e2e/figures.test.mjs
git commit -m "feat(figures): flexbox axes and alignment figure for day 11"
```

---

### Task 8: 그림 시각 장면과 기준 이미지

**Files:**
- Modify: `tests/visual/visual.test.mjs`
- Create: `tests/visual/baseline/` 새 이미지

**Interfaces:**
- Consumes: 기존 `SCENES` 형식(`scrollTo`, `widths`). 시각 테스트는 동작 줄이기가 켜져 있어 그림은 최종 상태다.

- [ ] **Step 1: 장면 추가**

```js
{ id: 'fig-request', hash: '#/day/p1-d01', progress: P1_FIRST_THREE, scrollTo: 'figure.figure' },
{ id: 'fig-paths-site', hash: '#/day/p1-d04', progress: P1_FIRST_THREE, widths: [375, 1280], scrollTo: 'figure.figure' },
{ id: 'fig-paths-dev', hash: '#/day/p1-d05', progress: P1_FIRST_THREE, scrollTo: 'figure.figure' },
{ id: 'fig-git', hash: '#/day/p1-d07', progress: P1_FIRST_THREE, scrollTo: 'figure.figure' },
{ id: 'fig-flex', hash: '#/day/p1-d11', progress: P1_FIRST_THREE, scrollTo: 'figure.figure' },
```

- [ ] **Step 2: 찍어서 눈으로 대조**

Run: `npm run test:visual`
Expected: Task 1 뒤 176장 중 그림으로 바뀐 장면(예상: `day-code`는 Day 1 첫 코드 블록이 바뀌어서. 그 밖은 실제 결과를 적는다)만 실패, 새 28장은 기준 없음. 새 장면과 바뀐 장면을 DESIGN.md(Task 3 문안)와 대조해 고칠 것을 고친 뒤 사용자에게 보인다(라이트·다크, 375·768·1280).

- [ ] **Step 3: 승인 뒤 기준 이미지 갱신**

Run: `npm run test:visual:update` 그리고 `npm run test:visual`
Expected: 206/206 통과(기준 이미지 204장)

- [ ] **Step 4: Commit**

```bash
git add tests/visual
git commit -m "test(visual): figure scenes for day 1, 4, 5, 7 and 11"
```

---

### Task 9: 전체 검증과 기록

**Files:**
- Modify: `CLAUDE.md`(코드 위치에 `views/figure.js`, `src/figures/`, `lib/figures.mjs`, 스타일 순서에 `figures`), `docs/CHECKPOINT.md`, `docs/checkpoint/workspace/progress.md`, 로드맵 11장(넘김이 생겼을 때만)

- [ ] **Step 1: 기준선 전부**

Run: `npm test`, `npm run check -- --allow-missing`, `npm run test:e2e`, `npm run test:visual`, `npm run build:site` 뒤 `_site`를 로컬 정적 서버로 띄워 `npm run check:site -- <로컬 주소>`
Expected: 모두 통과, check:site 5폭 각 "문제 0개". 출력 숫자를 보고에 넣는다.

- [ ] **Step 2: 완료 기준을 브라우저로 확인(로컬 빌드)**
  - ① Day 1에서 "▶ 다음 단계"로 요청·응답 그림이 4단계까지 진행된다.
  - ② Day 11에서 값을 바꾸면 배치가 바뀐다.
  - ③ 동작 줄이기를 켜면 그림이 최종 상태로 보인다.
  - ④ 1440·1920px에서 홈·Day·월드·용어 사전·설정·검색의 묶음이 가운데에 있고 좌우 여백 차이 ≤ 2px(e2e 출력).
  - ⑤ 1920px Day에서 글 열 720px·퀘스트 로그 220px, 두 열 묶음이 가운데(e2e 출력).
  - 그림 4개(375·1280, 라이트·다크)와 넓은 화면 고치기 전·후 스크린샷을 보고에 넣는다. 확인하지 못한 것(Safari·Firefox, 실기기, 화면 낭독기의 단계 문장 읽기)은 "확인하지 못함"으로 적는다.

- [ ] **Step 3: 최종 리뷰(직접)**
  - `git diff <M12 시작 커밋>..HEAD`를 처음부터 읽는다. Global Constraints와 Review Focus 다섯 줄을 하나씩 대조한다. 찾은 문제는 재현 테스트 → 수정 → 전체 테스트로 이 자리에서 끝낸다.

- [ ] **Step 4: 기록**
  - `progress.md`에 `M12: complete` 줄(테스트 숫자 포함).
  - `CHECKPOINT.md` 머리의 상태·기준선(check:site 5폭)과 0장 "끝난 것"에 M12 줄, "다음은 M13".
  - `CLAUDE.md` 코드 위치·스타일 순서.

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md docs
git commit -m "docs: M12 complete"
```

## 출처
- `figcaption`은 figure의 처음이나 끝 자식: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure , https://lists.w3.org/Archives/Public/www-validator/2020Jun/0001.html
- `role="img"`의 자식은 보조 기술에 표시되지 않고, 안에 포커스 받는 요소를 두면 안 된다: https://www.w3.org/WAI/standards-guidelines/act/rules/307n5z , https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Roles/Img_role
- 줄 폭(WCAG 1.4.8, 로드맵 11.5 규칙 3): https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html
