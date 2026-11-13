# M10 Day 조작 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> 이 프로젝트는 Native 방식이다(통합 로드맵 10장). `executing-plans`로 이 세션이 끝까지 하고, 서브에이전트·자식 세션을 쓰지 않는다. 최종 리뷰도 직접 한다.

**Goal:** Day 화면에서 손으로 하는 일을 DESIGN.md 모양과 동작으로 바꾼다. 대상은 퀘스트 로그, 정답 가리기, 🧯 증상 Accordion, 체크리스트 저장, Day 완료, 이전·다음, 키보드 이동이다. 완료 기준은 로드맵 M10의 ①~③이고, M7·M8·M9에서 넘긴 일도 함께 끝낸다.

**Architecture:**
- 🧯 증상 Accordion과 정답 요약 줄의 꺾쇠는 빌드(`lib/markdown.mjs`)가 HTML로 만든다. 그래서 JS 없이도 열린다.
- 퀘스트 로그는 새 모듈 `views/questlog.js`에 둔다. 지금 단계 계산은 순수 함수로, DOM 부착은 `mount → dispose`로 나눈다.
- 마크업은 두 벌이다. `nav.quest-log`(1280px 이상 오른쪽 열)와 `details.quest-mini`(그보다 좁을 때 본문 위)를 둘 다 만들고, 미디어 쿼리로 하나만 보인다. 승인 시안과 같은 방식이다.
- "Day 완료"는 `disabled` 대신 `aria-disabled`를 쓴다. 포커스를 받고, 누르면 흔들리면서 이유를 알린다.
- 부록 목차 카드는 `page.js`가 본문 밖 열로 옮긴다.

**Tech Stack:** 바닐라 JS(ESM), esbuild 0.28.2, marked 18.1.2, `node:test`, 전역 Playwright 1.63.0 + Chromium, pixelmatch 8.0.0.

**Spec:**
- 기준은 `docs/superpowers/specs/2026-11-12-unified-roadmap-design.md` 11장 M10 행이다(M7·M8·M9 넘김 메모 포함).
- 세부 기준은 개편 설계서 `2026-11-11-textbook-redesign-design.md`의 3.3(Day 아래쪽 순서), 3.4(부록 목차 열), 5.2(정답은 인라인 확인), 5.4(Accordion), 5.5(단계 n/8은 위치), 6.3(동작 줄이기, Shake와 `role="status"`)이다. 원 설계서 5.1(정답은 기본으로 접고, 처음 열 때 "먼저 직접 풀어 보세요")도 따른다.
- 시각 값의 유일한 기준은 `DESIGN.md`다.
- 승인 시안은 `design-system/web-zero-to-hundred/prototype/day/`(git 밖)이다. 장면 `quest-mid`, 파일 `day.css`·`proto.js`다.

## Global Constraints

- **토큰:** 색·글꼴·크기·간격·모서리·턱·모션 값은 DESIGN.md 토큰(`var(--…)`)으로만 쓴다. 토큰 밖 `#hex`·`rgb(`·`font-family`는 빌드가 막는다.
- **새 값:** DESIGN.md 수정안을 승인받은 뒤에만 쓴다. Task 1의 문안이 그 수정안이고, **이 계획을 승인하면 그 문안도 승인한 것**으로 본다. 그 밖의 새 값이 필요해지면 멈추고 묻는다.
- **One Pink:** Day 화면의 분홍 면은 "Day 완료" 주 버튼 하나다. 정답 게이트 버튼은 보조 버튼이다.
- **The Fluid Rule:**
  - 320px부터 가로 스크롤은 0이다.
  - 바뀌는 지점은 DESIGN.md 브레이크포인트 표의 값만 쓴다. `(min-width: 80rem)`은 Task 1에서 표에 넣는다.
  - 지금 `day.css`의 `@media (max-width: 600px)`는 표에 없는 값이므로 `(max-width: 40rem)`으로 바꾼다.
- **키보드(사용자 결정):** "Tab·Enter만"이다. 새 단축키는 만들지 않는다. Day의 모든 조작은 Tab으로 가고, Enter로 실행한다. 체크박스는 Space로 바꾼다.
- **파일과 이름:** 결과는 파일 하나이고 외부 요청은 0건이다. 이름·주소는 `curriculum.json`에서만 가져온다.
- **기록 금지:** 저장소 파일에 모델 식별자·개인정보·로컬 사용자 경로를 쓰지 않는다.
- **커밋:** 커밋·push는 사용자가 요청할 때만 한다. 아래 "Commit" 단계는 실행 세션을 시작할 때 사용자에게 한 번 확인하고 따른다. 커밋마다 CLAUDE.md 8장의 비밀값 grep을 먼저 돌린다.
- **미루지 않기:** 찾은 작은 문제는 이 마일스톤 안에서 고친다. 다른 마일스톤 화면이 있어야 하는 일만 로드맵 11장 해당 행에 `(M10에서 넘김: …)`으로 적는다.
- **기준 이미지:** 이 PC에서, 사용자 승인 뒤에만 `npm run test:visual:update`로 갱신한다.
- **브라우저 테스트:** 시작 전에 PowerShell에서 `$env:NODE_PATH = (npm root -g)`를 실행한다. Playwright는 `127.0.0.1` 정적 서버로 연다.
- **명령 위치:** 명령은 `textbook/`에서 실행한다.
- **기준선(M9 끝):** unit 295, e2e 194, visual 104, check:site 672/0.

## 결정 기록 (계획 단계)

- **퀘스트 로그 마크업:** 두 벌 마크업에 미디어 쿼리로 하나만 보인다. 승인 시안 그대로이고, 숨긴 쪽은 `display: none`이라 접근성 트리에 한 벌만 남는다.
- **체크리스트 모션:** 개편 설계서에 있는 체크리스트 Stagger와 체크박스 마이크로 인터랙션은 넣지 않는다. 시각 값의 기준인 DESIGN.md Motion 표에 없기 때문이다.
- **키보드:** Tab·Enter만 쓴다(사용자 선택). WCAG 2.1.4(한 글자 단축키)의 끄기·바꾸기 장치도 필요 없어진다.
- **"완료 취소" 버튼:** 지금처럼 `disabled`를 유지한다. 로드맵 완료 기준 ③은 "Day 완료"에만 걸려 있다.

## Review Focus

1. **페이지 맨 아래의 짧은 마지막 섹션**("📝 오늘의 체크리스트", "📚")
   - 문제: 화면 위쪽 선까지 올라가지 못해 지금 단계가 되지 못할 수 있다.
   - 기대: 맨 아래에 닿으면 마지막 섹션이 지금 단계다.
   - 확인: Task 4의 단위·e2e.
2. **문제 해결 목차가 화면보다 길 때**(1280×720)
   - 기대: sticky 카드 안에서 세로로 스크롤해 마지막 링크까지 닿고, 페이지 가로 스크롤은 0이다.
   - 확인: Task 7.
3. **동작 줄이기**
   - 기대: 퀘스트 로그를 누르면 바로(`auto`) 이동하고 제목에 포커스가 간다. 꺼진 "Day 완료"는 흔들리지 않지만, 이유 문장 강조와 알림은 그대로다.
   - 확인: Task 4·5.
4. **꺼진 "Day 완료" 연타와 Enter**
   - 기대: 이유 문장은 하나뿐이고, 포커스는 버튼에 남고, 진도는 바뀌지 않는다.
   - 확인: Task 5.
5. **🧯 증상 안의 코드 블록·알림 상자·번호 목록, 바로 뒤에 오는 h2**
   - 기대: `<details>`가 제자리에서 닫히고, 다음 섹션이 증상 안으로 들어가지 않는다. JS 없이도 열린다.
   - 확인: Task 2 단위 테스트, 실제 콘텐츠 `check`.

---

## 파일 구조

| 파일 | 책임 | Task |
|---|---|---|
| `DESIGN.md`, `textbook/src/styles/tokens.css` | `--aside-w`, 80rem 행, Shake 자리, Day 부품 문안 | 1 |
| `textbook/lib/markdown.mjs`, `textbook/build.mjs` | 🧯 h3 → `details.ts-entry`, 정답 요약 꺾쇠 | 2 |
| `tests/fixtures/content/fa/day-01.md` | 🧯 증상 h3 두 개 | 2 |
| `textbook/src/app/views/accordion.js` (신규) | `symptomAccordions` (page.js에서 옮김) | 3 |
| `textbook/src/app/views/questlog.js` (신규) | `currentStep`, `mountQuestLog` | 4 |
| `textbook/src/app/views/day.js` | 조립, 완료 버튼 동작, `outline()` 삭제 | 3~6 |
| `textbook/src/app/views/page.js` | 목차를 본문 밖으로, accordion import | 3, 7 |
| `textbook/src/styles/day.css` | 퀘스트 로그, 80rem 격자, 정답·체크리스트·아래쪽 모양 | 4~7 |
| `textbook/src/styles/pages.css` | 목차 선택자 `.page-body .toc` → `.page-article .toc` | 7 |
| `textbook/src/styles/legacy.css`, `textbook/lib/styles.mjs` | 안 쓰이게 된 옛 이름 삭제 | 8 |
| `tests/unit/markdown.test.mjs`, `tests/unit/questlog.test.mjs` (신규) | 빌드·단계 계산 | 2, 4 |
| `tests/e2e/day.test.mjs`, `textbook.test.mjs`, `motion.test.mjs`, `pages.test.mjs` | 화면 동작 | 3~7 |
| `tests/visual/visual.test.mjs` | 새 장면 | 8 |
| `docs/…` 기록 | progress, CHECKPOINT, 로드맵 | 9 |

---

### Task 1: DESIGN.md 보강과 `--aside-w` 토큰

**Files:**
- Modify: `DESIGN.md`(크기 토큰 표, 브레이크포인트 표, Motion 표 Shake 행, Components "Day 부품", 부록 토큰 원문)
- Modify: `textbook/src/styles/tokens.css`
- Test: `tests/unit/styles.test.mjs`(기존 `tokens.css equals the token block in DESIGN.md`)

**Interfaces:**
- Produces: CSS 변수 `--aside-w: 220px`. Task 4·7이 쓴다.

- [ ] **Step 1: 토큰**
  - 크기 토큰 표의 `--lesson-max` 다음에 `| --aside-w | 220px | 같음 | 1280px 이상 오른쪽 열(퀘스트 로그, 부록 목차) |`을 넣는다.
  - 부록 토큰 원문과 `tokens.css`의 같은 자리에 `--aside-w: 220px;`를 넣는다.

- [ ] **Step 2: 표 두 곳**
  - 브레이크포인트 표의 `(min-width: 64rem)` 다음에 이 행을 넣는다.
    `| (min-width: 80rem) (1280px) | Day는 본문 오른쪽에 퀘스트 로그 열이 생기고 본문 위 접힘 카드가 사라진다. 목차가 있는 부록 페이지는 목차 카드가 오른쪽 열로 간다 |`
  - Motion 표 Shake 행의 자리를 `잠긴 월드 카드, 조건이 안 된 "Day 완료" 버튼`으로 바꾼다.

- [ ] **Step 3: "Day 부품" 문안**
  - 기존 **퀘스트 로그** 항목을 아래 첫 항목으로 바꾼다.
  - 나머지 항목은 **읽기 위치 바** 다음에 그대로 넣는다.

```markdown
- **퀘스트 로그:** 1280px 이상은 본문 오른쪽 `var(--aside-w)` 열(사이 `var(--space-xl)`), `position: sticky`(상단 바 + `var(--space-lg)`). 머리는 Label "퀘스트 로그"와 "단계 n/전체"(전체는 섹션 h2 수, 보통 7~8), 목록은 섹션 제목 버튼(15px `ink-2`, 줄간격 1.35, 최소 36px, 안쪽 `var(--space-2xs) var(--space-sm)`, 왼쪽 3px 투명 막대, hover `track`), 지금 단계는 `ink` 800 + 왼쪽 3px `ink` 막대 + `aria-current="step"`. 그보다 좁으면 본문 위 `<details>` 카드(`card` 바탕, 2px `rule` 테두리, 모서리 `--radius-card`, 아래 `var(--space-xl)`, summary 최소 44px·안쪽 `var(--space-xs) var(--space-md)` "퀘스트 로그 · 단계 n/전체" + 오른쪽 `chevron` 아이콘, 열면 180° 회전). 지금 단계는 상단 바 아래 96px 선을 지난 마지막 섹션이고, 페이지 맨 아래에 닿으면 마지막 섹션이다. 누르면 그 제목으로 smooth scroll(동작 줄이기면 `auto`)하고 제목에 포커스. 섹션이 없는 Day(준비 중)에는 두지 않는다.
- **정답 상자:** 알림 상자 틀에 `answer` 색. 요약 줄 최소 48px, 안쪽 `var(--space-xs) var(--space-md)`, 17px 800 `ink`, 앞에 선 꺾쇠(`answer-ink`, 열리면 180° 회전). 펼친 내용 위에 1px 점선 `answer-line`, 안쪽 `var(--space-sm) var(--space-md) var(--space-2xs)`. 처음 펼칠 때는 바로 위에 정답 게이트(알림 상자 틀에 `tip` 색, Body, 보조 버튼 "그래도 정답 볼래요"·"조금 더 풀어 볼게요", 버튼 사이 `var(--space-xs)`)를 보인다. 확인한 정답은 새로 고칠 때까지 다시 묻지 않는다.
- **Day 증상 Accordion:** "🧯 자주 막히는 곳" 안의 h3 하나가 증상 하나다(빌드가 만든다). 모양과 모션은 Cards "증상 Accordion"과 같고, 증상 제목은 heading이 아니다. 첫 증상 앞의 안내 글은 그대로 둔다. 섹션 제목 바로 아래 줄 오른쪽 끝에 "모두 펼치기" 글자 버튼(모두 펼쳐져 있으면 "모두 접기").
- **체크리스트:** 항목 행 최소 44px, 안쪽 `var(--space-2xs) var(--space-xs)`, 모서리 `--radius-btn`, hover `track`. 체크박스는 1.25em, 글자와 사이 `var(--space-xs)`. 글자를 눌러도 체크된다. 체크한 항목은 `ink-2`(줄 긋기 없음). 누르는 즉시 저장되고 새로 고쳐도 남는다.
- **Day 아래쪽:** 위 1px `rule` 선(선 위 `var(--space-3xl)`, 선 아래 `var(--space-xl)`), 부품 사이 `var(--space-lg)`. 순서는 새로 열림 알림(있을 때) → Day 완료 카드 → 이전·다음.
- **Day 완료 카드:** 기본 카드, 안쪽 `var(--space-lg)`(640px 이하 `var(--space-md)`). 상태 줄 17px 800 `ink`("체크리스트 n / 전체" 또는 "오늘 할 일을 마쳤나요?"), 아래 `var(--space-sm)`. 주 버튼 "Day 완료". 이유 문장 15px `ink-2`, 위 `var(--space-sm)`. 이전 Day를 안 끝냈으면 버튼은 `aria-disabled="true"`(투명도 0.4, 턱 없음, 포커스는 받는다)이고 `aria-describedby`로 이유 문장과 잇는다. 누르면 버튼이 Shake하고, 이유 문장이 `ink` 800으로 바뀌고, 같은 문장을 `role="status"`로 알린다(동작 줄이기에서는 흔들림만 없다). 완료한 뒤에는 `success-bg` 바탕, 2px `success-line` 테두리와 같은 색 턱, 상태 줄 "✅ Day n 완료!", 보조 버튼 "완료 취소". 월드를 다 마치면 `success-ink` 800 축하 문장을 더한다.
- **새로 열림 알림:** `success` 알림 상자(머리 "🎉 새로 열렸어요"), `role="status"`, 목록에 새로 열린 월드·부록 링크.
- **이전·다음:** `nav` 2칸 격자(640px 이하 1칸), 사이 `var(--space-sm)`. 칸은 링크 카드(`card` 바탕, 2px `rule` 테두리, 모서리 `--radius-card`, 안쪽 `var(--space-sm) var(--space-md)`, hover `track` 바탕): 위 Label("← 이전", "다음 →", `ink-2`), 아래 제목 15px 800 `ink`. 다음 칸은 오른쪽 정렬(1칸일 때 왼쪽). `rel="prev"`·`rel="next"`.
- **부록 목차 열:** 목차 카드가 있는 부록 페이지는 1280px 이상에서 `minmax(0, var(--lesson-max))`와 `var(--aside-w)` 두 열(사이 `var(--space-xl)`)로 나뉜다. 목차 카드는 오른쪽 열에서 `position: sticky`(상단 바 + `var(--space-lg)`)이고, 높이는 `calc(100dvh - var(--topbar-h) - 2 * var(--space-lg))`까지이며, 넘치면 카드 안에서 세로로 스크롤한다.
```

- [ ] **Step 4: 다시 실행**

Run: `npm test`
Expected: 모두 통과(295). `tokens.css equals the token block in DESIGN.md` PASS.

- [ ] **Step 5: Commit**

```bash
git add DESIGN.md textbook/src/styles/tokens.css
git commit -m "docs(design): quest log, answer, symptoms, checklist, day foot and toc column specs; --aside-w, 80rem"
```

---

### Task 2: 빌드: 🧯 증상 Accordion과 정답 꺾쇠

**Files:**
- Modify: `textbook/lib/markdown.mjs`(`heading` 렌더러, `renderMarkdown`, `renderBox`의 정답 summary)
- Modify: `textbook/build.mjs:174`(Day만 옵션 켜기)
- Modify: `tests/fixtures/content/fa/day-01.md`
- Test: `tests/unit/markdown.test.mjs`

**Interfaces:**
- Produces:
  - `renderMarkdown(src, { idPrefix, terms, routes, symptoms })`. `symptoms: boolean`의 기본값은 false이고, build.mjs는 Day에만 true를 넘긴다.
  - 켜져 있으면 h2 글자가 `🧯`로 시작하는 섹션 안의 h3마다 아래 마크업을 낸다. 모양은 `glossary.mjs renderSymptom`과 같다.
    `<details class="ts-entry" id="<기존 h3 id>"><summary>${iconSvg('chevron','ts-chev')}<span class="ts-title">…인라인…</span></summary><div class="ts-body">`
  - `</div></details>`는 다음 h3, 다음 h2, 문서 끝 중 먼저 오는 곳에서 닫는다.
  - 정답 summary는 `<summary>${iconSvg('chevron','answer-chev')}<span>${제목}</span></summary>`다.
- Consumes: `iconSvg`(`src/app/views/icons.js`. glossary.mjs도 빌드 때 같은 함수를 import한다).

- [ ] **Step 1: 실패 테스트**: `tests/unit/markdown.test.mjs`에 추가한다.
  - `test('symptom h3s under the 🧯 section become ts-entry details')`
    - 입력은 `## 🧯 자주 막히는 곳` → 안내 단락 → `### 증상 A` → 단락 + ```` ```html ```` 코드 블록 → `:::tip` 상자 → `### 증상 B` → 번호 목록 → `## 📝 오늘의 체크리스트` → `- [ ] 하나`. `symptoms: true`, `idPrefix: 'x'`로 렌더한다.
    - 단언 ①: `details.ts-entry`가 2개이고, 각각 `id="x-증상-a"`·`id="x-증상-b"`를 갖는다. 문서 안에 `<h3`이 0개다.
    - 단언 ②: 안내 단락은 첫 `<details` 앞에 있다.
    - 단언 ③: 코드 블록(`figure.code`)과 `aside.callout-tip`이 첫 details 안에 있다. 첫 `</details>` 위치가 그 둘보다 뒤다.
    - 단언 ④: `</details>`가 정확히 2개이고, 둘째 `</details>`가 `id="x-📝-…"` h2보다 앞이다. `<details`와 `</details>`의 수가 같다.
  - `test('h3s stay headings outside the 🧯 section or without the symptoms option')`
    - `## 🛠️ 따라 하기` 아래 `### 단계`는 `<h3 id=`로 남는다.
    - 같은 🧯 입력도 `symptoms` 없이 렌더하면 `ts-entry`가 0개다.
  - `test('a symptom section that ends the document closes its details')`: 🧯 h2 + h3 하나로 끝나는 입력에서 `<details`와 `</details>`가 각각 1개다.
  - `test('answer summary carries a chevron icon')`: `:::answer 과제 1 정답` 블록의 summary에 `class="icon answer-chev"`(iconSvg의 실제 class 형식에 맞춘다)와 `과제 1 정답`이 있다.

- [ ] **Step 2: 실패 확인**

Run: `node --test ../tests/unit/markdown.test.mjs`
Expected: 새 테스트 4개 FAIL. 나머지는 PASS.

- [ ] **Step 3: 구현**
  - `state`에 `symptoms`(옵션), `inTrouble`, `entryOpen`을 둔다.
  - `heading` 렌더러는 depth 2에서 먼저 열린 증상을 닫고, `inTrouble = text.startsWith('🧯')`로 정한다. `symptoms && inTrouble && depth === 3`이면 위 마크업을 낸다. 열린 증상이 있으면 그것부터 닫는다.
  - `renderMarkdown`은 마지막 `html` 끝에서 열린 증상을 닫는다.
  - 증상 h3도 `state.headings`에 지금처럼 넣는다.
  - build.mjs:174 `renderMarkdown(src, { idPrefix: day.id, terms, routes, symptoms: true })`.

- [ ] **Step 4: 통과 확인**

Run: `node --test ../tests/unit/markdown.test.mjs` 다음에 `npm test`
Expected: 모두 PASS.

- [ ] **Step 5: 픽스처와 실제 콘텐츠**
  - `fa/day-01.md`의 🧯 단락을 바꾼다. 안내 단락 한 줄을 두고, 그 아래 `### 증상: 화면이 비어 있어요`, `### 증상: 글자가 깨져요` 두 개(각각 `**원인:**` / `**해결:**` 단락)로 만든다.
  - 실제 콘텐츠에서 🧯 안 h3의 모양을 확인한다. Run(Git Bash, 저장소 루트): `grep -c "^### " textbook/content/p*/day-*.md | head`. 그다음 `npm run check -- --allow-missing`.
  - Expected: "검사 통과". 🧯 밖 h3는 그대로다.

- [ ] **Step 6: e2e 영향 확인**

Run: `npm run test:e2e`
Expected: 194 통과. 픽스처 글자를 세는 테스트가 깨지면, 새 픽스처에 맞게 그 단언만 고치고 이유를 ledger에 적는다.

- [ ] **Step 7: Commit**

```bash
git add textbook/lib/markdown.mjs textbook/build.mjs tests/unit/markdown.test.mjs tests/fixtures/content/fa/day-01.md
git commit -m "feat(build): day symptoms render as accordions; answer summary chevron"
```

---

### Task 3: Day 🧯 Accordion 화면

**Files:**
- Create: `textbook/src/app/views/accordion.js`
- Modify: `textbook/src/app/views/page.js`(함수를 옮기고 import), `textbook/src/app/views/day.js`, `textbook/src/styles/day.css`
- Test: `tests/e2e/day.test.mjs`, 기존 `tests/e2e/pages.test.mjs`

**Interfaces:**
- Produces: `export function symptomAccordions(scope: HTMLElement): HTMLButtonElement | null`. page.js의 지금 함수를 그대로 옮긴다. 증상이 없으면 null이다.
- Day 쪽: `renderDay`가 `symptomAccordions(body)`의 버튼을 `.trouble-tools` 줄(`div`, 오른쪽 정렬)에 담는다. 그 줄은 글자가 `🧯`로 시작하는 `:scope > h2` 바로 뒤에 넣는다.

- [ ] **Step 1: 실패 e2e**: `tests/e2e/day.test.mjs`(fa-d01, 375×640)
  - `test('day symptoms open one by one and expand all follows')`
    - `.lesson-body details.ts-entry` 2개가 닫혀 있다.
    - 첫 summary를 누르면 열린다. `[data-expand-all]` 글자는 "모두 펼치기"다.
    - 버튼을 누르면 둘 다 열리고 "모두 접기"가 된다. 다시 누르면 둘 다 닫힌다.
    - 버튼의 `getBoundingClientRect().top`이 🧯 h2의 bottom 이상이다.
  - `test('day symptoms work from the keyboard')`
    - 첫 summary에 `focus()` → Enter → 열린다.
    - Tab → `[data-expand-all]`보다 뒤의 요소로 간다(순서 확인). Shift+Tab으로 버튼에 와서 Enter → 모두 열린다.

- [ ] **Step 2: 실패 확인**

Run: `node --test ../tests/e2e/day.test.mjs`
Expected: 새 2개 FAIL. 버튼이 없다.

- [ ] **Step 3: 구현**
  - `accordion.js`를 만들고, `page.js`는 import로 바꾼다.
  - `day.js`에서 버튼 줄을 넣는다.
  - `day.css`: `.trouble-tools { display: flex; justify-content: flex-end; margin: 0 0 var(--space-xs); }`. 증상 모양은 `pages.css`의 `.ts-entry` 규칙을 그대로 쓴다. Day 본문의 `h3`·`p` 리듬 규칙이 `.ts-body` 안에서 어긋나면 `.lesson-body .ts-body > :first-child { margin-top: 0 }`처럼 Day 쪽에서만 맞춘다.

- [ ] **Step 4: 통과 확인**

Run: `node --test ../tests/e2e/day.test.mjs` 다음에 `node --test ../tests/e2e/pages.test.mjs`
Expected: 모두 PASS(부록 증상 테스트 4개 포함).

- [ ] **Step 5: Commit**

```bash
git add textbook/src/app/views/accordion.js textbook/src/app/views/page.js textbook/src/app/views/day.js textbook/src/styles/day.css tests/e2e/day.test.mjs
git commit -m "feat(day): symptom accordions with expand all, shared with troubleshooting"
```

---

### Task 4: 퀘스트 로그

**Files:**
- Create: `textbook/src/app/views/questlog.js`, `tests/unit/questlog.test.mjs`
- Modify: `textbook/src/app/views/day.js`(`outline()`와 `dayHead`의 `toc` 인자 삭제, 부착), `textbook/src/styles/day.css`(`.day-outline`·`.outline-title` 삭제, 퀘스트 로그, 80rem 격자)
- Test: `tests/e2e/day.test.mjs`

**Interfaces:**
- Produces:
  - `export function currentStep(tops: number[], line: number, atBottom: boolean): number`
    - `atBottom`이면 마지막 인덱스다.
    - 아니면 `tops[i] <= line`인 마지막 i이고, 그런 i가 없으면 0이다.
    - 빈 배열이면 -1이다.
  - `export const READ_LINE = 96`: 상단 바 아래 기준선(px). 시안 `proto.js` 값이다.
  - `export function mountQuestLog(headings: HTMLElement[], env = motionEnv()): { log: HTMLElement, mini: HTMLDetailsElement, dispose: () => void } | null`
    - 제목이 없으면 null이다. 모듈을 불러올 때 DOM에 손대지 않는다.
    - `log`는 `nav.quest-log[aria-label="퀘스트 로그"]`이다. 안에 `p.label` "퀘스트 로그", `p.quest-step` "단계 n/N", `ol > li > button.quest-item`(글자는 제목 textContent)이 있다.
    - `mini`는 `details.quest-mini > summary`이다. summary 안에 "퀘스트 로그 · 단계 n/N"과 `icon('chevron','quest-chev')`, 같은 목록 한 벌이 있다.
    - `scroll`·`resize`(passive)와 rAF로 단계를 갱신한다. 지금 버튼에 `aria-current="step"`을 붙이고, 단계 글자 두 곳을 바꾼다.
    - 버튼을 누르면 `scrollIntoView({ behavior: env.reduce ? 'auto' : 'smooth', block: 'start' })`를 부른다. 그다음 제목에 `tabindex="-1"`을 주고 `focus({ preventScroll: true })`를 부른다.
    - `dispose`는 리스너와 rAF를 지운다.
- Consumes: `motionEnv`(`motion.js`), `h`(`common.js`), `icon`(`icons.js`), `ctx.onCleanup`.
- 조립:
  - `renderDay`는 `body`의 `:scope > h2[id]`로 `mountQuestLog`를 부른다.
  - `mini`는 `body` 앞에, `log`는 `article.lesson`의 마지막 자식으로 붙인다.
  - `article`에는 `has-aside` 클래스를 더하고, `ctx.onCleanup(dispose)`를 건다.

- [ ] **Step 1: 단위 테스트**: `tests/unit/questlog.test.mjs`

```js
test('currentStep picks the last heading that passed the line', () => {
  assert.equal(currentStep([10, 500, 900], 152, false), 0);
  assert.equal(currentStep([-400, 100, 900], 152, false), 1);
  assert.equal(currentStep([-900, -500, -100], 152, false), 2);
});
test('currentStep is the first step before any heading passes, and the last at the bottom', () => {
  assert.equal(currentStep([300, 800], 152, false), 0);
  assert.equal(currentStep([-400, 100, 400], 152, true), 2); // 짧은 마지막 섹션(Review Focus 1)
  assert.equal(currentStep([], 152, false), -1);
});
```

- [ ] **Step 2: 실패 확인** → Run: `npm test` / Expected: FAIL, `questlog.js`가 없다.

- [ ] **Step 3: `currentStep`·`READ_LINE` 구현** → `npm test` PASS.

- [ ] **Step 4: e2e 작성**: `tests/e2e/day.test.mjs`(fa-d01)
  - `test('quest log marks the section being read at 1280px')`(1280×800)
    - `.quest-log`가 보이고 `.quest-mini`는 `display: none`이다.
    - `.quest-log`의 left가 `.lesson-body`의 right보다 크다.
    - N은 `.lesson-body > h2[id]` 수다(day.test 픽스처는 fa-d01에 내용을 덧붙이므로 고정값을 쓰지 않는다). 단계 글자는 `단계 1/${N}`이고, 첫 버튼만 `aria-current="step"`이다.
    - 넷째 h2를 `scrollIntoView()`하고 프레임 두 개를 기다리면 넷째 버튼이 current, 단계는 `단계 4/${N}`이다.
    - 맨 아래로 스크롤하면 마지막 버튼이 current다(Review Focus 1).
    - 스크롤 중에도 `.quest-log`의 top이 56 + 24 = 80 근처(±2)로 남는다(sticky).
    - 완료 기준 ①의 증거다.
  - `test('quest log button scrolls to the heading and focuses it')`(1280, `reducedMotion: 'reduce'`)
    - 다섯째 버튼을 누르면 곧바로 그 h2가 `document.activeElement`가 된다.
    - h2의 top은 56 + 24 = 80 근처(±4)다(scroll-margin-top).
    - Review Focus 3의 증거다.
  - `test('narrow screens get the quest log as a details card above the body')`(375)
    - `.quest-log`는 숨겨지고, `.quest-mini`는 `.lesson-body` 바로 앞에 있다.
    - summary 글자는 `퀘스트 로그 · 단계 1/${N}`이다.
    - summary에 focus → Enter로 열고, Tab으로 셋째 버튼까지 가서 Enter → 셋째 h2에 포커스가 간다.
  - `test('quest log leaves with the day')`
    - fa-d01 → `#/`이면 `.quest-log`·`.quest-mini`가 0개다.
    - fa-d02(준비 중)도 0개다.
  - `test('old day outline is gone')`: `.day-outline`이 0개다.

- [ ] **Step 5: 실패 확인** → Run: `node --test ../tests/e2e/day.test.mjs` / Expected: 새 5개 FAIL.

- [ ] **Step 6: 구현**
  - `mountQuestLog`를 만들고 조립한다.
  - `outline()`, `dayHead`의 `toc` 인자, `.day-outline`·`.outline-title` CSS를 지운다.
  - 기본 규칙(80rem 미만): `.quest-log { display: none }`, `.quest-mini`는 Task 1 문안대로다.
  - `@media (min-width: 80rem)`:
    - `.lesson.has-aside { max-width: none; display: grid; grid-template-columns: minmax(0, var(--lesson-max)) var(--aside-w); column-gap: var(--space-xl); justify-content: start; }`
    - `.lesson.has-aside > * { grid-column: 1; }`
    - `.quest-log { display: block; grid-column: 2; grid-row: 1 / span 5; align-self: start; position: sticky; top: calc(var(--topbar-h) + var(--space-lg)); }`
    - `.quest-mini { display: none; }`
    - 자식 다섯은 빵부스러기, 머리, quest-mini, 본문, 아래쪽이다.
  - 꺾쇠 회전은 `.quest-mini[open] .quest-chev { transform: rotate(180deg) }`이다. 전환 시간은 기존 꺾쇠(`.ts-chev`)와 같은 토큰을 쓴다.

- [ ] **Step 7: 통과 확인**

Run: `npm test` 다음에 `node --test ../tests/e2e/day.test.mjs` 다음에 `npm run test:e2e`
Expected: 모두 PASS. 옛 목차를 쓰던 기존 테스트가 있으면 퀘스트 로그 기준으로 바꾸고 ledger에 적는다.

- [ ] **Step 8: Commit**

```bash
git add textbook/src/app/views/questlog.js textbook/src/app/views/day.js textbook/src/styles/day.css tests/unit/questlog.test.mjs tests/e2e/day.test.mjs
git commit -m "feat(day): quest log in a right column at 80rem, details card below; drop old outline"
```

---

### Task 5: "Day 완료" 조건과 흔들림

**Files:**
- Modify: `textbook/src/app/views/day.js`(`renderFooter`, `complete`), `textbook/src/styles/day.css`(`.reason.is-alert`)
- Modify: `tests/e2e/textbook.test.mjs:219`('complete disabled until previous done'), `tests/e2e/motion.test.mjs:318`(magnetic 테스트)
- Test: `tests/e2e/day.test.mjs`

**Interfaces:**
- Consumes: `shake(el, env)`(`motion.js`), `ctx.announce(text)`.
- 동작:
  - 조건이 안 되면 버튼은 `aria-disabled="true"`이고 `disabled`는 없다. `aria-describedby="complete-reason"`이다.
  - 누르면(클릭·Enter) `complete()`가 진도를 바꾸지 않는다. 대신 `shake(btn)`을 부르고, `#complete-reason`에 `is-alert`를 붙이고, `ctx.announce(이유 문장)`을 부른다.
  - 이유 문장은 언제나 하나다.

- [ ] **Step 1: 기존 테스트 바꾸기와 새 테스트**
  - `textbook.test.mjs` 'complete disabled until previous done'(이름을 'complete is aria-disabled until previous done'으로 바꾼다)
    - `isDisabled()` 대신 `getAttribute('aria-disabled') === 'true'`와 `isDisabled() === false`를 단언한다.
    - 나머지 단언(이유 연결, "Day 1", "먼저")은 그대로다.
  - `motion.test.mjs` magnetic 테스트: `btn.isDisabled()`를 `(await btn.getAttribute('aria-disabled')) === 'true'`로 바꾼다. 꺼진 버튼에서 `--mx`가 0으로 남는다는 단언은 그대로다(`motion.js isInactive`가 이미 aria-disabled를 본다).
  - `day.test.mjs` `test('pressing a blocked Day complete shakes and explains')`(fa-d02 또는 이전 Day가 미완료인 픽스처 Day)
    - 버튼을 클릭하면 `btn.getAnimations().some(a => a.id === 'shake')`가 참이다.
    - `#complete-reason`의 class에 `is-alert`가 있고, 계산된 `font-weight`가 800이다.
    - 알림 영역(`ctx.announce`가 쓰는 `role="status"` 요소)의 글자가 이유 문장과 같다.
    - localStorage 진도에 그 Day가 없다(완료 기준 ③).
  - `test('blocked Day complete from the keyboard, pressed again and again')`
    - Tab으로 버튼에 포커스가 온다(포커스 가능).
    - Enter를 3번 누르면 `.reason` 요소가 1개이고, 포커스는 버튼에 남고, 진도는 그대로다(Review Focus 4).
  - `test('reduced motion: blocked Day complete does not shake but still explains')`: `reducedMotion: 'reduce'`에서 shake 애니메이션이 0개이고, `is-alert`와 알림 글자는 있다(Review Focus 3).
  - `test('checklist keeps partial checks after reload and toggles with Space')`(fa-d01)
    - 둘째 체크박스에 focus → Space → 새로 고친다.
    - 둘째만 checked이고, 상태 줄은 "체크리스트 1 / 3"이다(완료 기준 ②).
  - `test('day controls are reachable by Tab in order')`(375)
    - Tab을 반복하며 `document.activeElement`를 모은다.
    - 퀘스트 로그 summary, 정답 summary, 증상 summary, 모두 펼치기, 체크박스 3개, Day 완료, 이전 링크, 다음 링크가 이 순서로 모두 나와야 한다(사이에 다른 요소는 있어도 된다).

- [ ] **Step 2: 실패 확인**

Run: `node --test ../tests/e2e/day.test.mjs` 다음에 `node --test ../tests/e2e/textbook.test.mjs`
Expected: 흔들림·aria-disabled 관련 새 테스트와 바꾼 테스트가 FAIL. 체크리스트·Tab 순서 테스트는 지금 코드로 이미 PASS일 수 있다. 그러면 그 사실을 ledger에 적는다(기존 동작을 고정하는 회귀 테스트다).

- [ ] **Step 3: 구현**
  - `renderFooter`: 조건이 안 될 때 `disabled` 대신 `'aria-disabled': 'true'`를 둔다.
  - `complete()`: 맨 앞에서 `canComplete`가 거짓이면 위 동작을 하고 돌아간다.
  - `day.css`: `.completion .reason.is-alert { color: var(--color-ink); font-weight: 800; }`.

- [ ] **Step 4: 통과 확인**

Run: `npm run test:e2e`
Expected: 모두 PASS.

- [ ] **Step 5: Commit**

```bash
git add textbook/src/app/views/day.js textbook/src/styles/day.css tests/e2e/day.test.mjs tests/e2e/textbook.test.mjs tests/e2e/motion.test.mjs
git commit -m "feat(day): blocked Day complete stays focusable, shakes and explains"
```

---

### Task 6: 정답·체크리스트·Day 아래쪽 모양

**Files:**
- Modify: `textbook/src/styles/day.css`(`details.answer`, `.answer-gate`, `li.task`, `.lesson-foot`, `.completion*`, `.celebrate`, `.unlock-banner`, `.day-nav`, `.nav-card`, 600px 미디어 쿼리)
- Modify: `textbook/src/app/views/day.js`(새로 열림 알림 머리 문구·클래스, 이전·다음 라벨 클래스. 모양에 필요한 만큼만)
- Test: `tests/e2e/day.test.mjs`

**Interfaces:**
- Consumes: Task 1 문안의 정답 상자, 체크리스트, Day 아래쪽, Day 완료 카드, 새로 열림 알림, 이전·다음 항목. Task 2의 `.answer-chev`.
- 클래스 이름은 지금 것을 유지한다. 기존 e2e와 `data-testid`가 그대로 통한다.

- [ ] **Step 1: 실패 e2e**: `tests/e2e/day.test.mjs`(fa-d01, 375와 1280)
  - `test('day foot follows DESIGN tokens')`
    - `.lesson-foot` 위 테두리 1px이고, 색은 `--color-rule`의 계산값과 같다.
    - `.completion` 테두리는 2px, 모서리는 12px다.
    - `.nav-card` 테두리는 2px이다.
    - 375에서 `.day-nav`는 1칸(두 카드의 left가 같다), 1280에서는 2칸이다.
    - 체크리스트 `li.task` 높이가 44 이상이다.
  - `test('answer summary rotates its chevron when open')`
    - 게이트를 확인하고 연 뒤 `.answer-chev`의 계산된 transform이 180° 회전 행렬이다.
    - summary 높이가 48 이상이다.
  - `test('completed day card uses success colors')`
    - fa-d01을 완료하면 `.completion.is-done`의 배경이 `--color-success-bg` 계산값과 같다.

- [ ] **Step 2: 실패 확인** → Run: `node --test ../tests/e2e/day.test.mjs` / Expected: 새 3개 FAIL.

- [ ] **Step 3: 구현**
  - Task 1 문안대로 위 규칙을 토큰으로 다시 쓴다. `▸` 가상 요소는 지운다.
  - `@media (max-width: 600px)`는 `(max-width: 40rem)`으로 바꾼다.
  - legacy 별칭(`--surface`, `--border`, `--ok`, `--ok-soft`, `--muted`, `--tip-bg`, `--tip-line`, `--radius` 등)은 이 블록에서 하나도 남기지 않는다.

- [ ] **Step 4: 통과 확인**

Run: `npm test` 다음에 `npm run test:e2e`
Expected: 모두 PASS. 토큰 검사(`styles.mjs`)가 통과한다.

- [ ] **Step 5: Commit**

```bash
git add textbook/src/styles/day.css textbook/src/app/views/day.js tests/e2e/day.test.mjs
git commit -m "style(day): answer, checklist, completion card, unlock notice and prev/next on design tokens"
```

---

### Task 7: 부록 목차 열(M7에서 넘김)

**Files:**
- Modify: `textbook/src/app/views/page.js`(`renderPage`), `textbook/src/styles/pages.css`(목차 선택자), `textbook/src/styles/day.css`(`.page-article.has-aside` 격자)
- Test: `tests/e2e/pages.test.mjs`

**Interfaces:**
- `renderPage`는 `body.querySelector(':scope > nav.toc')`가 있으면 그것을 `head` 바로 뒤, `body` 앞으로 옮긴다. 그리고 `article`에 `has-aside`를 붙인다.
- 선택자 `.page-body .toc…`는 모두 `.page-article .toc…`로 바꾼다. Run: `grep -rn "page-body .toc\|page-body .ts-toc" textbook/src` 결과가 0건이어야 한다.

- [ ] **Step 1: 실패 e2e**: `tests/e2e/pages.test.mjs`
  - `test('glossary index sits in the right column at 1280px and above the body below')`
    - 1280×800에서 `.gl-index`의 left가 `.page-body`의 right보다 크다.
    - 스크롤 뒤에도 top이 80 근처(±2)다.
    - 768에서는 `.gl-index`의 bottom이 `.page-body`의 top 이하다.
  - `test('a long troubleshooting toc scrolls inside its card')`
    - 1280×720에서 `.ts-toc`의 `scrollHeight > clientHeight`이거나 높이가 뷰포트 안에 들어간다.
    - 마지막 목차 링크를 `focus()`하면 뷰포트 안에 보인다.
    - `document.documentElement.scrollWidth <= innerWidth`다(Review Focus 2).
  - 기존 목차·딥 링크 테스트는 그대로 PASS여야 한다.

- [ ] **Step 2: 실패 확인** → Run: `node --test ../tests/e2e/pages.test.mjs` / Expected: 새 2개 FAIL.

- [ ] **Step 3: 구현**
  - `@media (min-width: 80rem)`:
    - `.page-article.has-aside`에 Task 4와 같은 두 열 격자를 둔다. 자식은 1열이다.
    - `.page-article.has-aside > .toc { grid-column: 2; grid-row: 1 / span 4; align-self: start; position: sticky; top: calc(var(--topbar-h) + var(--space-lg)); max-height: calc(100dvh - var(--topbar-h) - 2 * var(--space-lg)); overflow-y: auto; margin: 0; }`
    - 자식은 빵부스러기, 머리, 목차, 본문이다.

- [ ] **Step 4: 통과 확인**

Run: `node --test ../tests/e2e/pages.test.mjs` 다음에 `npm run test:e2e`
Expected: 모두 PASS.

- [ ] **Step 5: Commit**

```bash
git add textbook/src/app/views/page.js textbook/src/styles/pages.css textbook/src/styles/day.css tests/e2e/pages.test.mjs
git commit -m "feat(pages): toc card moves to a sticky right column at 80rem"
```

---

### Task 8: legacy 정리와 시각 장면

**Files:**
- Modify: `textbook/src/styles/legacy.css`, `textbook/lib/styles.mjs`(`LEGACY_VARS`)
- Modify: `tests/visual/visual.test.mjs`(`SCENES`, `shoot`), `tests/visual/baseline/`(승인 뒤)

**Interfaces:**
- `shoot`는 `open`과 `scrollTo`를 함께 받으면 open → waitFor → scrollTo 순서로 처리한다. 지금 구현이 다르면 이 순서로 맞춘다.

- [ ] **Step 1: 안 쓰이는 옛 이름 삭제**
  - M9 Task 6 Step 1과 같은 grep 반복문으로 0건인 이름을 찾는다.
  - 그 이름들을 `legacy.css`와 `LEGACY_VARS`에서 지운다(`callout-*` 지역 변수는 제외).

Run: `npm test` 다음에 `npm run check -- --allow-missing`
Expected: 모두 통과, "검사 통과".

- [ ] **Step 2: 장면 추가**: `SCENES`에 넣는다.
  - `{ id: 'day-answer', hash: '#/day/p1-d01', progress: P1_FIRST_THREE, scrollTo: 'details.answer' }`
  - `{ id: 'day-trouble', hash: '#/day/p1-d01', progress: P1_FIRST_THREE, open: '.lesson-body .ts-entry > summary', waitFor: '.lesson-body .ts-entry[open]', scrollTo: '.lesson-body .ts-entry' }`
  - `{ id: 'day-foot', hash: '#/day/p1-d01', progress: P1_FIRST_THREE, scrollTo: '.lesson-foot' }`
  - `{ id: 'day-quest', hash: '#/day/p1-d01', progress: P1_FIRST_THREE, widths: [375, 768], open: '.quest-mini > summary', waitFor: '.quest-mini[open]' }`

- [ ] **Step 3: 비교 실행**

Run: `npm run test:visual`
Expected:
- `day`·`day-code`·`day-table`이 FAIL한다(1280 오른쪽 열, 좁은 폭 quest-mini). 의도한 변경이다.
- `glossary`·`troubleshooting` 1280도 FAIL한다(목차 열).
- 새 장면 22장(6 + 6 + 6 + 4)은 기준 이미지가 없다는 실패다.
- 그 밖에 바뀐 장면은 이름을 모두 적고, 차이 이미지를 열어 M10 범위인지 확인한다.

- [ ] **Step 4: 사용자 승인(멈춤)**
  - 바뀐 장면과 새 장면을 3폭 × 2테마로 보여 준다(SendUserFile).
  - 시안 `quest-mid`와 다른 점을 한 줄씩 적는다.
  - 승인 전에는 갱신하지 않는다.

- [ ] **Step 5: 기준 이미지 갱신**(승인 뒤)

Run: `npm run test:visual:update` 다음에 `npm run test:visual`
Expected: 전부 PASS(104 + 22 = 126).

- [ ] **Step 6: Commit**

```bash
git add textbook/src/styles/legacy.css textbook/lib/styles.mjs tests/visual/visual.test.mjs tests/visual/baseline
git commit -m "test(visual): day answer, trouble, foot and quest scenes; drop legacy names unused after M10"
```

---

### Task 9: 전체 검증과 기록

**Files:**
- Modify: `index.html`(`npm run build` 결과), `docs/checkpoint/workspace/progress.md`, `docs/CHECKPOINT.md`, `docs/superpowers/specs/2026-11-12-unified-roadmap-design.md` 11장

- [ ] **Step 1: 기준선 전체**

Run: `npm test` / `npm run check -- --allow-missing` / `npm run test:e2e` / `npm run test:visual`
Expected: 모두 통과. 출력의 통과 수를 그대로 적는다.

- [ ] **Step 2: 전 페이지 점검 4폭**
  - `npm run build:site`를 실행한다.
  - `_site`를 `startStaticServer`로 백그라운드로 띄운다. 끝나면 PID로 종료한다.
  - `npm run check:site -- http://127.0.0.1:<port>/`를 실행한다.

Expected: 320·375·768·1280 각각 "방문 168개, 문제 0개".

- [ ] **Step 3: 완료 기준 증거**
  - ①: Task 4 e2e 출력과 1280px 스크롤 중간 스크린샷.
  - ②: Task 5 체크리스트 e2e 출력.
  - ③: Task 5 흔들림 e2e 출력과 이유 문장이 강조된 스크린샷.
  - 확인하지 못한 것(Safari·Firefox, 실기기, 화면 낭독기)은 "확인하지 못함"으로 적는다.

- [ ] **Step 4: 자체 리뷰**
  - `git diff <M10 시작 커밋>..HEAD`를 처음부터 읽는다.
  - Global Constraints와 Review Focus 다섯 줄을 하나씩 대조한다.
  - 찾은 문제는 재현 테스트 → 수정 → 전체 테스트로 끝낸다.

- [ ] **Step 5: 기록**
  - `progress.md`: `M10: complete` 줄과 기준선 수치.
  - `CHECKPOINT.md`: 상태를 "M10 완료, 다음은 M11"로 바꾸고, 기준선과 M10 요약 줄을 고친다.
  - 로드맵 11장: 다음 마일스톤에 넘길 일이 생겼을 때만 해당 행에 `(M10에서 넘김: …)`을 적는다.
  - `npm run build`로 루트 `index.html`을 다시 만든다.

- [ ] **Step 6: Commit**

```bash
git add index.html docs/checkpoint/workspace/progress.md docs/CHECKPOINT.md docs/superpowers/specs/2026-11-12-unified-roadmap-design.md
git commit -m "docs: M10 complete"
```

---

## 출처

- **aria-disabled 동작**(포커스는 받고, 클릭은 막지 않고, `:disabled`와 맞지 않음):
  - MDN: https://developer.mozilla.org/ja/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-disabled
  - a11ysupport: https://a11ysupport.io/tests/html_button(type-button--aria-disabled-true)
- **WCAG 2.1.4 Character Key Shortcuts**(새 단축키를 만들지 않은 근거): https://www.w3.org/WAI/WCAG21/Understanding/character-key-shortcuts
- **`scrollIntoView`가 `scroll-margin-top`을 따름:** https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
