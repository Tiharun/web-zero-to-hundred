# M8 Day 페이지 시안·미정 값 결정 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. 이 프로젝트는 Native(executing-plans)로 실행한다.

**Goal:** Day 페이지 시안을 실제 앱 위에 만들어 3폭 × 2테마로 보여 주고, 사용자가 승인한 값(본문 줄간격, 알림 상자 6종 색, 코드·구문 강조 색, 위험 색, 읽기 위치 바, 퀘스트 로그, 토스트, 레벨업 Modal, 그림 틀)을 `DESIGN.md`와 `tokens.css`에 넣는다. M1·M6에서 넘긴 토스트, 설정 결과 문장, 위험 버튼, 보조 버튼에 새 값을 입힌다.

**Architecture:**
- 시안은 git 밖 `design-system/web-zero-to-hundred/prototype/`에 둔다.
  - `build-day.mjs`가 `textbook/src`를 임시 폴더에 복사한다.
  - 시안 파일(후보 토큰, 시안 CSS, 시안 JS)을 덧붙인 뒤 진짜 `build({ srcDir })`로 `day.html`을 만든다.
  - 그래서 글꼴 서브셋, 본문 렌더, 앱 동작이 실제와 같다. M9~M12가 이 시안을 그대로 옮길 수 있다.
- 승인 뒤 값의 원천은 `DESIGN.md` 하나이며, `tokens.css`는 그 부록 블록과 같아야 한다(기존 테스트).
- `legacy.css`의 옛 알림·코드·구문 강조·위험 이름은 새 토큰을 가리키는 별칭으로 바꾼다. 날값은 없앤다.
- 화면 부품(읽기 위치 바, 퀘스트 로그, 레벨업 Modal, 그림 틀)의 앱 구현은 M9~M12가 한다.

**Tech Stack:** 바닐라 ESM, esbuild(기존 `build()`), `node:test`, 전역 Playwright 1.63.0(Chromium), pixelmatch 시각 테스트, Python fontTools(글꼴 서브셋, 기존).

**Spec:**
- `docs/superpowers/specs/2026-11-12-unified-roadmap-design.md` 11장 M8 행(넘긴 항목 포함), M9~M12 행.
- 보조: `docs/superpowers/specs/2026-11-11-textbook-redesign-design.md`
  - 3.1 셸(퀘스트 로그 220px), 3.3 Day 페이지, 4장 Day 규칙
  - 5.2 Modal, 5.5 표시 부품, 6.3 모션, 7장 그림, 9장 접근성, 13장 열린 결정
- 값의 기준: `DESIGN.md`.

## Global Constraints

**값 규칙**
- 색·글꼴·크기·간격·모서리·그림자·모션 값은 DESIGN.md 토큰(`var(--…)`)으로만 쓴다. 날색은 `tokens.css`(그리고 Task 4 전까지 `legacy.css`)에만 둔다(`lib/styles.mjs` lint).
- 새 값은 **Task 3의 사용자 승인** 뒤에만 `DESIGN.md`·`tokens.css`에 들어간다. 이 계획서의 후보 값은 승인 전 제안이다. 사용자가 고친 값이 있으면 그 값을 쓰고, 고친 내용을 ledger에 `Ruling:`으로 적는다.

**Named Rules**
- One Pink: Day 페이지의 분홍 면은 주 버튼 "Day 완료" 하나다. 알림 상자, 읽기 위치 바, 퀘스트 로그의 지금 단계, 구문 강조, 그림 틀에 분홍을 쓰지 않는다. 알림 상자는 분홍보다 약하게 한다(개편 설계서 4장).
- Real Progress: 초록(`progress`·`xp`)은 실제 완료에만 쓴다.
  - 읽기 위치 바는 `ink` 계열이다(3.3).
  - "성공" 알림 상자(측정: P1 Day마다 6~12개)도 초록을 쓰지 않는다.
  - 구문 강조에도 초록을 쓰지 않는다.
- Label-Only Pixel: Galmuri는 12px 라벨("퀘스트 로그", "단계 3/8", "그림 1", "레벨 업")에만 쓴다.
- One Big Number: Day 페이지의 80px는 머리의 Day 번호 하나다. 레벨업 Modal의 LV 숫자는 HUD number(32px)다.
- Solid Ledge·Press: 누를 수 있는 새 면(위험 버튼, 보조 버튼, 레벨업 Modal 버튼)은 단색 턱과 누름(턱 −1px, 60ms)을 함께 준다.

**접근성**
- 대비: 글자 4.5:1, 비문자(알림 상자 왼쪽 막대, 읽기 위치 바, 그림 틀 테두리, 버튼 경계) 3:1. 새 쌍은 모두 DESIGN.md 대비 표에 적는다(완료 기준 ③).
- 알림 상자의 종류는 색만으로 전하지 않는다. 제목 줄 글자("꿀팁", "주의" …)가 늘 있다(WCAG 1.4.1).
- 토스트: `role="status"`, 4초, hover·focus면 멈춘다(5.5). 토스트에만 있는 정보를 두지 않는다. 같은 뜻을 화면 다른 곳(잠긴 카드 이유 줄, 상태 문장)에도 보인다(WCAG 2.2.1).
- 레벨업 Modal: `showModal`, 처음 포커스는 닫기 버튼, 사건마다 한 번(5.2).

**레이아웃·모션**
- Fluid Rule: 320px부터 가로 스크롤 0. 긴 코드 줄은 `pre` 안에서만 가로로 스크롤한다. 바뀌는 지점은 DESIGN.md 브레이크포인트(640·1280 등)만 쓴다.
- 동작 줄이기: 토스트·Modal 등장 모션 없음. 읽기 위치 바는 위치 표시라 그대로 움직인다(애니메이션이 아니라 값).

**작업 규칙**
- 파일 하나, 외부 요청 0건. 지어낸 수치 금지(레벨업 Modal의 XP는 `level.js` 계산값). 모델 식별자·개인정보 금지.
- 기준선: `npm test`, `npm run check -- --allow-missing`, `npm run test:e2e`, `npm run test:visual`, `npm run check:site`가 모두 통과해야 완료다. 시각 기준 이미지는 사용자 승인 뒤에만 갱신한다.
- 커밋은 Task 경로만 고른다. 시안 폴더는 git 밖이라 커밋하지 않는다. push는 사용자가 요청할 때만 한다.

## Review Focus

1. **수동 다크 선택(`data-theme="dark"`)과 시스템 다크** → 새 토큰이 두 곳에 같은 값으로 있다. 어느 쪽이든 알림 상자·코드·위험 색이 같게 보인다. (Task 4 `new colour tokens have identical dark values in both dark blocks`, `callout, code and danger pairs keep their contrast in four theme scenarios`)
2. **320px에서 긴 토스트 문장과 긴 알림 상자 제목, 설정 결과 문장** → 줄바꿈되고 가로 스크롤이 0이다. (Task 5 `toast and settings message wrap at 320px without sideways scroll`)
3. **토스트를 띄운 채 다른 화면으로 이동하거나 3개를 넘게 띄울 때** → 새 모양에서도 기존 동작(최대 3개, 화면 이동 뒤 남음, hover 멈춤)이 그대로다. (Task 5에서 기존 `motion.test.mjs` 토스트 3개를 다시 돌린다)
4. **`legacy.css`의 별칭이 새 토큰을 가리킨 뒤 Day 본문** → 옛 이름(`--tip-bg` 등)을 쓰는 `day.css`가 새 색으로 보이고 날색이 남지 않는다. (Task 4 `legacy.css has no raw colours left`)
5. **동작 줄이기에서 토스트** → 들어오는 움직임 없이 바로 보이고 4초 뒤 사라진다. (Task 5 `reduced motion shows the toast without movement`)

## 범위 판정

1. **"알림 상자 6종"**은 Markdown 컨테이너 6종이다: `tip`·`warn`·`info`·`path`·`success`·`answer`(`lib/markdown.mjs` `CONTAINER_KINDS`). `answer`는 `details.answer`(정답 가리기)의 틀이다.
2. **M8은 값을 정하고 지금 있는 화면에 입힌다.** 새 부품의 앱 구현은 로드맵대로 넘긴다.
   - 읽기 위치 바: M9
   - 퀘스트 로그: M10
   - 레벨업 Modal: M11
   - 그림 틀: M12
   - 시안에서 이 부품들은 `proto.js`가 그린다. 값과 구조는 DESIGN.md Components에 적는다.
3. **새 색이 바로 보이는 곳**은 Day 본문의 알림 상자·코드 블록이다. `legacy.css` 별칭을 거쳐 보인다. Day 본문의 나머지 모양(머리, 간격, 칩)은 M9가 바꾼다.
4. **줄간격**은 토큰을 만들지 않는다. DESIGN.md Hierarchy에 "Body long(Day 본문)" 한 줄로 적는다. 다른 줄간격도 토큰이 아니라 Hierarchy에 적혀 있다. `day.css` `.lesson`의 "미정 값" 주석을 지운다.
5. **위험 색**은 위험 버튼 면과 위험 글자에만 쓴다. `warn` 알림 상자는 다른 토큰이다(값이 비슷해도 역할이 다르다).
6. **보조 버튼 `.btn`**은 알약 모양을 버리고 DESIGN.md Buttons에 "보조 버튼"으로 정의한다. 모양은 M7 목차 칸과 같은 계열이다(2px `ink-2` 테두리, 3px 같은 색 턱).
   - 쓰는 곳: 완료 취소, 정답 게이트, 저장 불가 배너, 설정 내보내기·불러오기, 확인 Modal 취소.
7. **시안이 보여 줄 Day:**
   - `p1-d01`: 알림 상자 6종이 모두 있고 표 2개(측정)
   - `p1-d07`: 코드 블록 37개(측정)

## 후보 값 (Task 2가 시안에 넣고 Task 3에서 승인받는다)

대비는 이 계획을 쓸 때 계산한 값이다(WCAG 2.x 상대 휘도). Task 3이 화면에서 다시 잰다.

### 줄간격
- A안: 1.75(지금 Day 본문)
- B안: 1.65(홈 Body)
- 시안에서 둘을 같은 Day로 비교한다. 추천은 A다.
  - 근거(추측): 한 단락이 긴 설명형 한국어 본문이다.
  - 17px에서 줄 사이 공간이 넉넉한 편이 줄 찾기에 유리하다고 본다.
  - 검색으로 확인한 근거는 없다.

### 알림 상자
모양:
- `card` 바탕 위에 종류 색 바탕(`*-bg`)과 왼쪽 4px 막대(`*-line`)를 둔다.
- 테두리는 1px `rule`, 모서리 `--radius-card`, 안쪽 `var(--space-md)`.
- 제목 줄은 Galmuri 12px 라벨이고 색은 `*-ink`다. 지금의 이모지 앞머리는 유지한다.
- 본문 글자는 `ink`다.

| 종류 | 라이트 bg / line / ink | 다크 bg / line / ink | ink/bg (L·D) | line/card (L·D) |
|---|---|---|---|---|
| tip | `#FFFBEB` `#D97706` `#92400E` | `#2A2312` `#F59E0B` `#FCD34D` | 6.84 · 10.81 | 3.19 · 8.08 |
| warn | `#FEF2F2` `#DC2626` `#991B1B` | `#2D1618` `#F87171` `#FCA5A5` | 7.60 · 8.93 | 4.83 · 6.27 |
| info | `#EFF6FF` `#2563EB` `#1E40AF` | `#14203D` `#60A5FA` `#93C5FD` | 8.01 · 8.93 | 5.17 · 6.82 |
| path | `#F5F3FF` `#7C3AED` `#5B21B6` | `#221A3D` `#A78BFA` `#C4B5FD` | 8.19 · 8.86 | 5.70 · 6.38 |
| success | `#F0FDFA` `#0D9488` `#115E59` | `#0F2A2A` `#2DD4BF` `#5EEAD4` | 7.27 · 10.25 | 3.74 · 9.32 |
| answer | `#F1F5F9` `#64748B` `#334155` | `#1E2240` `#A3A9C9` `#E2E8F0` | 9.45 · 12.54 | 4.76 · 7.50 |

- B안은 지금 `legacy.css` 값이다(성공이 초록이라 Real Progress와 부딪힌다). 비교용으로만 보인다.
- 본문 `ink`와 각 bg의 대비는 라이트 10.41 이상, 다크 13.56 이상이다.

### 코드 블록과 구문 강조
A안("밤 코드"): 두 테마가 같은 남색 밤 바탕과 같은 구문 색을 쓴다. 다크에서는 카드와 바탕 대비가 1.09라 2px `edge` 테두리로 경계를 낸다.

| 토큰 | 값 | 대비(bg 위 · head 위) |
|---|---|---|
| `code-bg` | `#1E1B4B` | — |
| `code-head` | `#2E2A6B` | — |
| `code-border` | `#3F3A8A` | 장식(경계는 2px `edge`가 맡는다) |
| `code-fg` | `#E0E7FF` | 12.98 · 10.27 |
| `tok-keyword` | `#C4B5FD` | 8.66 · 6.85 |
| `tok-string` | `#FDE68A` | 12.84 · 10.16 |
| `tok-number` | `#FDBA74` | 9.48 · 7.50 |
| `tok-comment` | `#A5B4FC` | 8.02 · 6.35 (시안에서 더 흐리게 조정 가능, 4.5 이상 유지) |
| `tok-title` | `#7DD3FC` | 9.59 · 7.59 |
| `tok-attr` | `#5EEAD4` | 10.81 · 8.55 |
| `tok-variable` | `#FCA5A5` | 8.42 · 6.67 |
| `tok-meta` | `#CBD5E1` | 10.77 · 8.52 |
| `tok-tag`, `tok-name` | `#93C5FD` | 8.87 · 7.02 |
| `tok-deletion` | `#FCA5A5` | 8.42 · 6.67 |
| `tok-addition` | `#5EEAD4` | 10.81 · 8.55 |

B안은 지금 `legacy.css` 값이다(라이트는 밝은 코드, 다크는 어두운 코드).

### 위험 색
| 토큰 | 라이트 | 다크 | 대비 |
|---|---|---|---|
| `danger` | `#B91C1C` | `#F87171` | `danger`/`card` 6.47 · 6.27, `danger`/`paper` 5.79 · 6.87 |
| `danger-ink` | `#FFFFFF` | `#0D0F1F` | `danger-ink`/`danger` 6.47 · 6.87 |
| `danger-deep` | `#7F1D1D` | `#B91C1C` | 턱. 다크 `danger-deep`/`card` 2.68은 장식(면이 6.27로 식별) |

### 부품
- **읽기 위치 바:** 3px, 상단 바 바로 아래, `position: sticky`.
  - 채움 `ink`(대비 `ink`/`paper` 10.22 · 16.99), 빈 곳 투명.
  - `transform: scaleX(var(--read))`, `transform-origin: left`.
  - 지원 브라우저는 `animation-timeline: scroll(root)`를 쓰고, `@supports not (animation-timeline: scroll())`이면 rAF로 `--read`를 쓴다([Chrome 가이드](https://developer.chrome.com/docs/css-ui/scroll-driven-animations)).
  - `role="progressbar"`를 두지 않는다. 장식이며 위치는 퀘스트 로그가 글자로 알린다.
- **퀘스트 로그:**
  - 1280px 이상: 본문 오른쪽 220px 열, `position: sticky`(상단 바 + `var(--space-lg)`).
    - 머리: Label "퀘스트 로그"와 Label "단계 n/8".
    - 목록: 8개 섹션 제목 버튼(15px, `ink-2`).
    - 지금 단계: `ink` 800 + 왼쪽 3px `ink` 막대, `aria-current="step"`.
  - 그보다 좁으면 본문 위 `<details>` 접힘 목록. `summary`는 "퀘스트 로그 · 단계 n/8"이다.
  - 누르면 smooth scroll(동작 줄이기면 `auto`).
- **토스트(확정 모양):**
  - 면: `card` 면, 2px `edge` 테두리, `--ledge` `edge` 턱, 모서리 `--radius-card`.
  - 글자: 왼쪽 도트 아이콘(`px('coin')` 등 호출하는 쪽이 정한다, 없으면 생략), 15px `ink`.
  - 크기: `max-width: min(100% - var(--space-xl), 28rem)`.
  - 들어옴: 아래 8px에서 `--dur-short` `--ease-bounce`. 나감: 투명도 `--dur-exit` `--ease-in`(지금 값).
- **레벨업 Modal:**
  - 틀: `<dialog>`(`overlay.js` `setupDialog`), `card` 면, 2px `edge` 테두리, `--ledge` 턱, 안쪽 `var(--space-xl)`, 가운데 정렬, `max-width: 24rem`.
  - 내용 순서:
    1. Label "레벨 업"
    2. LV 배지(HUD와 같은 모양, 숫자 32px)
    3. 문장 "LV n이 됐어요"(Title small)
    4. 다음 목표 "다음 레벨까지 XP m"(`ink-2`, `level.js` 값)
    5. 주 버튼 "계속하기"(처음 포커스)
  - 열림: `pop-in` `--dur-enter`.
- **그림 틀:**
  - 틀: `figure.figure`, `card` 면, 2px `rule` 테두리, `--radius-card`.
  - 무대: `aspect-ratio: 16 / 9`(그림이 정하면 그 값), `paper` 바탕.
  - 아래 줄: Label "그림 n" + 캡션 15px `ink`, 오른쪽에 보조 버튼 "▶ 다음 단계"(G2만).
  - 대체 설명은 `role="img"` 무대의 `aria-label`에 둔다. 무대 바깥 경계 `rule`/`card` 1.35는 장식이다(캡션과 무대 바탕 차이가 묶음을 맡는다).
- **보조 버튼(`.btn`):**
  - 면: `card` 면, 2px `ink-2` 테두리, 3px `ink-2` 턱, 모서리 `--radius-btn`.
  - 크기·글자: `min-height: 44px`, 좌우 `var(--space-md)`, 15px 800 `ink`.
  - 상태: hover `track` 바탕과 2px 떠오름, 누름은 Press Rule.
  - 대비: `ink-2`/`card` 7.58 · 7.50.
- **위험 버튼(`.btn-danger`):**
  - 면: `danger` 면, `danger-ink` 글자, `danger-deep` 턱 4px.
  - 모양은 주 버튼과 같다(48px, 17px 800, 모서리 6px).
  - 확인 Modal 안에서만 쓰고, 한 화면에 하나다.
- **설정 결과 문장(`.message[data-kind]`):** 알림 상자와 같은 틀(4px 왼쪽 막대)이다.
  - `ok` → success 색
  - `error` → warn 색
  - `info` → info 색

---

### Task 1: 시안 빌드 도구

시안은 버리는 코드라 TDD 예외다(test-driven-development "Throwaway prototypes"). 검증은 빌드 결과 검사로 한다. 커밋은 없다(git 밖).

**Files:**
- Create: `design-system/web-zero-to-hundred/prototype/build-day.mjs`
- Create: `design-system/web-zero-to-hundred/prototype/day/tokens.css` — 후보 토큰. 처음에는 빈 블록.
- Create: `design-system/web-zero-to-hundred/prototype/day/day.css` — 시안 스타일. 처음에는 비어 있다.
- Create: `design-system/web-zero-to-hundred/prototype/day/proto.js` — 시안 동작. 처음에는 `document.documentElement.dataset.proto = 'day'` 한 줄.

**Interfaces:**
- Consumes: `build({ contentDir, srcDir, allowMissing })` (`textbook/build.mjs`) → `{ ok, errors, html }`
- Produces: `node design-system/web-zero-to-hundred/prototype/build-day.mjs` → `prototype/day.html`

- [ ] **Step 1: `build-day.mjs` 작성**
  1. `mkdtemp`로 임시 폴더를 만들고 `textbook/src`를 `cp(..., { recursive: true })`로 복사한다.
  2. `day/tokens.css`를 임시 `styles/tokens.css` 끝에, `day/day.css`를 임시 `styles/pages.css` 끝에 덧붙인다(파일 순서와 lint가 그대로 돈다).
  3. `day/proto.js`를 임시 `app/proto.js`로 복사하고 임시 `app/main.js` 끝에 `import './proto.js';`를 더한다.
  4. `build({ contentDir: textbook/content, srcDir: 임시, allowMissing: true })`를 부른다. `ok`면 `prototype/day.html`에 쓰고, 아니면 오류를 `formatIssue`와 같은 꼴로 찍고 종료 코드 1을 낸다. 끝나면 임시 폴더를 지운다(`finally`).
- [ ] **Step 2: 실행해 확인**

Run: `node design-system/web-zero-to-hundred/prototype/build-day.mjs`
Expected: 종료 코드 0, `prototype/day.html`이 생기고 `data-proto` 문자열이 들어 있다(`grep -c "dataset.proto" design-system/web-zero-to-hundred/prototype/day.html` → 1 이상).

- [ ] **Step 3: git 제외 확인**

Run: `git status --short design-system`
Expected: 출력 없음(시안 폴더는 `.gitignore`에 있다).

### Task 2: 시안 부품과 후보 전환

**Files:**
- Modify: `design-system/web-zero-to-hundred/prototype/day/tokens.css`
- Modify: `design-system/web-zero-to-hundred/prototype/day/day.css`
- Modify: `design-system/web-zero-to-hundred/prototype/day/proto.js`

**Interfaces:**
- Consumes: Task 1의 빌드 도구. 앱의 `h`, `px`(`views/common.js`, `views/icons.js`), `showToast`(`views/toast.js`), `setupDialog`·`openDialog`(`views/overlay.js`), `level.js`의 `totalXp(cur, prog)`와 `levelOf(xp)` → `{ level, toNext }`(레벨업 Modal의 "LV n"과 "다음 레벨까지 XP m").
- Produces: 쿼리 `?lh=a|b&call=a|b&code=a|b&demo=toast|levelup|danger`. `proto.js`가 `<html>`에 `data-proto-lh`·`data-proto-call`·`data-proto-code`를 달고(기본 모두 `a`), `demo`가 있으면 그 상태를 연다. Task 3의 촬영 스크립트가 이 쿼리를 쓴다.

- [ ] **Step 1: 후보 토큰** — `tokens.css`에 "후보 값"의 A안·B안을 `:root[data-proto-call="a"]` 같은 선택자 블록으로 넣는다. 라이트 블록, `@media (prefers-color-scheme: dark) :root:not([data-theme="light"])…` 블록, `:root[data-theme="dark"]…` 블록 세 곳에 둔다. 옛 이름(`--tip-bg` …)을 덮어써서 지금 `day.css`가 그대로 새 색을 쓰게 한다.
- [ ] **Step 2: 줄간격·알림 상자·코드 모양** — `day.css`에 `[data-proto-lh="a"] .lesson { line-height: 1.75 }`·`b`면 1.65, "후보 값"의 알림 상자 모양(왼쪽 4px, Galmuri 제목 줄), 코드 A안의 2px `edge` 테두리를 둔다. 날색 없이 토큰만 쓴다(lint가 막는다).
- [ ] **Step 3: 읽기 위치 바·퀘스트 로그** — `proto.js`가 Day 화면이 그려질 때(`hashchange` 뒤 `.lesson`이 생기면) 바를 상단 바 아래에 꽂는다. 퀘스트 로그는 `.lesson-body h2[id]` 8개로 "후보 값"의 두 모양(1280px 이상 열, 그 아래 `<details>`)을 만든다. 지금 단계는 `IntersectionObserver`로 정한다(상단 바 아래 첫 제목). 1280px 이상에서 `.lesson`을 `grid-template-columns: minmax(0, 720px) 220px`로 감싸는 스타일은 `day.css`에 둔다.
- [ ] **Step 4: 그림 틀·토스트·레벨업 Modal·버튼** — `proto.js`가 `p1-d01`의 "📖 개념 이해" 첫 단락 뒤에 G2 그림 틀 하나(무대에 상자 두 개와 화살표 SVG, "▶ 다음 단계" 버튼이 화살표를 한 단계씩 보인다)를 꽂는다. `demo=toast`면 `showToast('Day 1 완료! XP +60', …)`을, `demo=levelup`이면 레벨업 Modal을, `demo=danger`면 보조 버튼과 위험 버튼을 나란히 둔 상자를 띄운다. 토스트 확정 모양은 `day.css`에서 `.toast`를 덮어 보인다.
- [ ] **Step 5: 빌드와 눈 확인**

Run: `node design-system/web-zero-to-hundred/prototype/build-day.mjs`
Expected: 종료 코드 0. 로컬 서버(`tests/helpers/static-server.mjs`)로 `prototype/`을 띄워 `day.html#/day/p1-d01`을 1280px에서 연다. 읽기 위치 바, 퀘스트 로그, 그림 틀이 보이고 콘솔 오류는 0이다(`collectConsoleErrors`).

### Task 3: 시안 촬영·대비 측정·승인 정지

**Files:**
- Create: `design-system/web-zero-to-hundred/prototype/shot-day.mjs`
- Create(출력): `design-system/web-zero-to-hundred/prototype/shots/day/*.png`, `shots/day/contrast.md`, `prototype/REPORT-day.md`

**Interfaces:**
- Consumes: Task 2의 쿼리. `tests/helpers/static-server.mjs` `startStaticServer(rootDir)`, `tests/helpers/browser.mjs` `launch()`.
- Produces: 승인된 값 목록. 사용자 답을 그대로 ledger에 적는다. Task 4·5가 이 목록을 쓴다.

- [ ] **Step 1: `shot-day.mjs` 작성** — 375·768·1280 × 라이트·다크(`colorScheme`)로 다음 장면을 찍는다.
  - `p1-d01` A안 전체(fullPage)
  - `p1-d01` B안 전체: `lh=b&call=b&code=b`
  - `p1-d07` 코드 구간(A·B)
  - `demo=toast`, `demo=levelup`, `demo=danger`
  - 1280px 퀘스트 로그를 스크롤 중간에서 찍은 장면
  - 320px의 A안
  - 진도는 시각 테스트의 `storedProgress` 꼴로 `p1-d01~d06` 완료를 넣어 `p1-d07`을 연다.
- [ ] **Step 2: 대비 측정** — 같은 스크립트가 각 테마에서 `getComputedStyle`로 "후보 값"의 모든 쌍을 잰다. 계산은 `tests/e2e/textbook.test.mjs`의 휘도 함수와 같다. 결과를 `contrast.md` 표(쌍, 라이트, 다크, 기준, 통과)로 쓴다.

Run: `node design-system/web-zero-to-hundred/prototype/shot-day.mjs`
Expected: PNG가 생기고 `contrast.md`에 "미달"이 장식으로 표시한 쌍(`code-border`, `danger-deep` 다크, 그림 무대 경계) 말고는 없다. 미달이 있으면 값을 고쳐 Task 2 Step 1부터 다시 한다.

- [ ] **Step 3: 시트와 보고** — 장면별 3×2 시트(scratchpad `sheet.mjs` 방식)를 만든다. `REPORT-day.md`에 결정할 항목 9개를 표로 적는다(A안·B안·추천·근거·대비). SendUserFile로 시트와 보고서를 보낸다.
- [ ] **Step 4: 사용자 승인 정지** — 다음을 묻고 답을 기다린다(executing-plans의 "멈추는 경우"에 해당: 값 승인은 CLAUDE.md 규칙 1).
  1. 줄간격 A/B
  2. 알림 상자 A/B
  3. 코드 A/B
  4. 위험 색
  5. 부품 6개의 모양
  6. North Star 이름 확정 여부(DESIGN.md "아직 정하지 않은 것"의 남은 줄)
  - 답을 ledger에 `Task 3: 승인 — …`로 적는다. 고친 값은 `Ruling:`으로 적는다.

### Task 4: 토큰과 DESIGN.md

**Files:**
- Modify: `DESIGN.md`
  - Colors: 새 절 "알림·코드·위험", 색 토큰 표, 대비 표
  - Typography Hierarchy: Body long
  - Components: 알림 상자, 코드 블록, 읽기 위치 바, 퀘스트 로그, 토스트, 레벨업 Modal, 그림 틀
  - "아직 정하지 않은 것"과 부록 토큰 원문
- Modify: `textbook/src/styles/tokens.css`(부록 블록과 같게)
- Modify: `textbook/src/styles/legacy.css`(옛 이름 → 새 토큰 별칭, 날색 삭제)
- Modify: `textbook/src/styles/day.css`(`.lesson` 줄간격 확정값과 주석, 알림 상자·코드 모양 = 승인안)
- Test: `tests/unit/styles.test.mjs`, `tests/e2e/textbook.test.mjs`

**Interfaces:**
- Consumes: Task 3 승인 목록.
- Produces: 새 토큰 이름(라이트·다크 같은 이름). Task 5가 쓴다.
  - `--color-{tip,warn,info,path,success,answer}-{bg,line,ink}`
  - `--color-code-{bg,fg,head,border}`
  - `--color-tok-{keyword,string,number,comment,title,attr,variable,meta,tag,name,deletion,addition}`
  - `--color-danger`, `--color-danger-ink`, `--color-danger-deep`

- [ ] **Step 1: 실패하는 테스트 작성** — `tests/unit/styles.test.mjs`에 다음 두 테스트를 더한다.

```js
test('legacy.css has no raw colours left', async () => {
  const src = await readFile(new URL('../../textbook/src/styles/legacy.css', import.meta.url), 'utf8');
  assert.equal(/#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|oklch)\(/i.test(src.replace(/\/\*[\s\S]*?\*\//g, '')), false);
});
test('new colour tokens have identical dark values in both dark blocks', async () => {
  // tokens.css 의 @media 다크 블록과 :root[data-theme="dark"] 블록에서
  // --color-(tip|warn|info|path|success|answer|code|tok|danger)- 로 시작하는 선언을 모아 같은지 본다.
  // 같은 이름 수는 37개(6×3 + 4 + 12 + 3)다.
  assert.deepEqual(mediaDark, manualDark);
  assert.equal(Object.keys(manualDark).length, 37);
});
```

`tests/e2e/textbook.test.mjs`에 `callout, code and danger pairs keep their contrast in four theme scenarios`를 더한다. 기존 코드 토큰 테스트의 네 장면과 휘도 함수를 쓴다. 다음을 잰다.
- `p1-d01`의 `.callout-{kind}` 6종: `.callout-title` 글자/바탕 ≥ 4.5, 본문 글자/바탕 ≥ 4.5, 왼쪽 막대 색/`card` ≥ 3
- `#/settings`의 위험 버튼: 글자/면 ≥ 4.5

- [ ] **Step 2: 실패 확인**

Run: `node --test tests/unit/styles.test.mjs`
Expected: FAIL — `legacy.css has no raw colours left`(지금 `#a4262c` 등), 다크 블록 테스트(이름 0개).

- [ ] **Step 3: 구현**
  1. `tokens.css`와 DESIGN.md 부록 블록에 승인값을 같은 순서로 넣는다.
  2. `legacy.css`의 옛 이름은 `--tip-bg: var(--color-tip-bg);`처럼 바꾸고 다크 블록 두 개를 지운다(새 토큰이 테마를 맡는다). `--callout-*`는 `day.css`가 종류별로 옛 이름을 고르는 중간 변수라 그대로 둔다. `answer`의 옛 이름이 없으면 `details.answer`가 쓰는 변수를 `--color-answer-*`로 바꾼다.
  3. `day.css`에 승인된 줄간격·알림 상자·코드 모양을 넣는다.
  4. DESIGN.md를 고친다.
     - 새 색 표와 대비 표 행: Task 3 `contrast.md`의 실측값
     - Hierarchy "Body long"
     - Components 일곱 부품(이 계획서 "부품" 절 + 승인 수정)
     - "아직 정하지 않은 것"에서 줄간격·알림·코드·위험·토스트·레벨업·Day 부품 줄을 지운다
     - North Star 줄은 Task 3 답대로 둔다

- [ ] **Step 4: 통과 확인**

Run: `npm test --prefix textbook` 그리고 `npm run test:e2e --prefix textbook`
Expected: unit 전부 통과(286 + 2). e2e 전부 통과(174 + 1). 기존 `tokens.css equals the token block in DESIGN.md`도 통과.

- [ ] **Step 5: 커밋**

```bash
git add DESIGN.md textbook/src/styles/tokens.css textbook/src/styles/legacy.css textbook/src/styles/day.css tests/unit/styles.test.mjs tests/e2e/textbook.test.mjs
git commit -m "feat(design): callout, code, syntax and danger tokens; day body line-height; day part specs"
```

### Task 5: 넘긴 항목 입히기 — 토스트, 설정 결과 문장, 위험·보조 버튼

**Files:**
- Modify: `textbook/src/styles/components.css`(`.btn`, `.btn-danger`, `.toast`, `.toast-region`)
- Modify: `textbook/src/styles/pages.css:74-86`(`.message`와 `[data-kind]`)
- Modify: `textbook/src/app/views/toast.js`(머리 주석의 "임시 모양" 문장만. 동작은 그대로)
- Test: `tests/e2e/motion.test.mjs`, `tests/e2e/settings.test.mjs`, `tests/visual/visual.test.mjs`(장면 `toast`)

**Interfaces:**
- Consumes: Task 4 토큰. `showToast(text, { duration, doc })`는 바꾸지 않는다.
- Produces: 시각 장면 `toast`(`hash: '#/'`, `progress: null`, `open`: 잠긴 월드 카드의 `.world-card.is-locked .card-hit`, `waitFor: '.toast'`, `widths: [375, 1280]`).

- [ ] **Step 1: 실패하는 테스트 작성**
  - `motion.test.mjs`
    - `toast uses the final shape`: `.toast` 계산값이 다음과 같다.
      - `border-top-width` `2px`, `border-top-color` = `--color-edge`
      - `box-shadow`에 `--ledge` 값과 `edge` 색
      - `border-radius` = `--radius-card`
    - `reduced motion shows the toast without movement`: `reducedMotion: 'reduce'`에서 `getAnimations()`의 등장 애니메이션 길이 ≤ 0.01ms.
  - `settings.test.mjs`
    - `import message colours follow its kind`: 손상 파일을 불러온 뒤 `[data-kind="error"]`의 `border-left-color` = `--color-warn-line`, 바탕 = `--color-warn-bg`. 정상 파일이면 `ok` → success 색.
    - `danger and secondary buttons follow DESIGN.md`
      - 확인 Modal 위험 버튼: 바탕 = `--color-danger`, 글자 = `--color-danger-ink`, `box-shadow`에 `danger-deep`, `border-radius` `6px`
      - 보조 버튼(내보내기): `border-radius` `6px`(알약 아님), 2px `ink-2` 테두리, 3px 턱
    - `toast and settings message wrap at 320px without sideways scroll`: 320px에서 긴 잠김 이유 토스트와 `error` 문장이 보일 때 `scrollWidth <= clientWidth`.
  - `visual.test.mjs`에 `toast` 장면을 더한다.
- [ ] **Step 2: 실패 확인**

Run: `npm run test:e2e --prefix textbook`
Expected: 새 e2e 4~5개가 FAIL(토스트 테두리 `rule`, `.btn` 999px, `--danger` 옛 값 등). 나머지는 통과.

- [ ] **Step 3: 구현**
  - `.toast`: "부품" 절 토스트 값을 넣는다.
  - `.message`
    - 공통: 알림 상자 틀 — 1px `rule` 테두리, 4px 왼쪽 막대
    - `[data-kind="ok"|"error"|"info"]`: 각각 success·warn·info 토큰
  - `.btn`: 보조 버튼 값. hover·active·`:disabled`(투명도 0.4, 떠오름 없음)·동작 줄이기 규칙은 M7 목차 칸과 같은 꼴로 둔다.
  - `.btn-danger`: 위험 버튼 값으로 새 토큰을 쓴다. 옛 `--danger` 이름은 이제 쓰지 않는다.
    - `lib/styles.mjs` `LEGACY_VARS`에서 `danger`·`on-danger`를 빼고 `legacy.css`에서도 지운다.
    - 남은 사용처는 `grep -rn "var(--danger\|var(--on-danger" textbook/src`로 0건을 확인한다.
- [ ] **Step 4: 통과 확인**

Run: `npm test --prefix textbook`, `npm run test:e2e --prefix textbook`
Expected: 모두 통과. 기존 토스트 테스트 3개(`rapid clicks keep at most three toasts`, `hides after four seconds and pauses on hover`, `survives moving to another screen`)도 통과.

- [ ] **Step 5: 시각 차이 확인과 승인 정지**

Run: `npm run test:visual --prefix textbook`
Expected: 새 `toast` 장면은 기준 없음. 바뀐 장면만 다르다.
- `day`: 알림 상자·코드 색, 줄간격
- `settings`, `confirm`: 버튼
- `troubleshooting`, `start` 등: 본문에 알림 상자나 `.btn`이 있으면
- 다른 장면이 다르면 원인을 찾아 고친다.

바뀐 장면의 3×2 시트를 SendUserFile로 보내고 기준 이미지 갱신 승인을 받는다.

- [ ] **Step 6: 기준 이미지 갱신과 커밋** — 승인 뒤 다음을 한다.
  1. `npm run test:visual:update --prefix textbook`
  2. 의도하지 않은 이미지 변화(렌더 잡음)는 `git checkout`으로 되돌린다.
  3. `npm run test:visual --prefix textbook` → 전부 통과를 확인한다.

```bash
git add textbook/src/styles/components.css textbook/src/styles/pages.css textbook/src/styles/legacy.css textbook/lib/styles.mjs textbook/src/app/views/toast.js tests/e2e/motion.test.mjs tests/e2e/settings.test.mjs tests/visual/visual.test.mjs tests/visual/baseline
git commit -m "feat(ui): final toast, kind-coloured settings message, danger and secondary buttons from DESIGN.md"
```

### Task 6: 문서와 전체 기준선

**Files:**
- Modify: `docs/superpowers/specs/2026-11-12-unified-roadmap-design.md` 11장 M9~M12 행
- Modify: `docs/CHECKPOINT.md`(현재 위치 "M8 완료, 다음은 M9", 기준선 수치, M8 요약 줄)
- Modify: `docs/checkpoint/workspace/progress.md`(M8 완료 줄)
- Modify: `index.html`(재빌드)

**Interfaces:**
- Consumes: Task 3 승인 목록, Task 4·5 결과.
- Produces: 다음 마일스톤이 읽을 넘김 메모.

- [ ] **Step 1: 로드맵 넘김 메모** — 각 행 끝에 `(M8에서 넘김: …)`을 적는다.
  - M9: 읽기 위치 바·알림 상자·코드 블록 모양은 DESIGN.md Components 해당 절, 시안 장면 이름
  - M10: 퀘스트 로그 절
  - M11: 레벨업 Modal 절, 토스트는 확정 모양
  - M12: 그림 틀 절
  - 시안 폴더가 git 밖이라 값은 DESIGN.md만 기준이라는 문장을 함께 둔다.
- [ ] **Step 2: 전체 기준선**

Run(`textbook/`에서, `NODE_PATH`는 `npm root -g`):
- `npm test`
- `npm run check -- --allow-missing`
- `npm run test:e2e`
- `npm run test:visual`
- `npm run build`
- `npm run build:site`
- scratchpad `serve-check.mjs`로 `_site` `check:site`(4폭)

Expected:
- unit 288/288, e2e 180 안팎(새 테스트 수만큼 늘어남) 전부 통과
- visual 92/92(지금 88 + `toast` 2폭 × 2테마 4장)
- check 통과, check:site 문제 0
- 실제 수치를 CHECKPOINT에 적는다.

- [ ] **Step 3: 비밀값·개인정보 검사와 커밋**

Run: `git status --short`, `git diff --cached --stat`, CLAUDE.md 8장의 비밀값 grep
Expected: Task 경로만 있다. grep 출력이 없다.

```bash
git add docs/superpowers/specs/2026-11-12-unified-roadmap-design.md docs/CHECKPOINT.md docs/checkpoint/workspace/progress.md index.html
git commit -m "docs: M8 complete, hand-off notes for M9-M12"
```
