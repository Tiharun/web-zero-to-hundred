# CLAUDE.md — 웹 제로 투 헌드레드

## 목적

프로그래밍 지식 0%인 초보자가 Day 1부터 155 Day까지 막힘 없이 혼자 따라가는 **단일 오프라인 HTML 교재**(`index.html`)를 만든다.

## 스택

- 교재 빌드: Node.js 22 이상(ESM), esbuild 0.28.2, marked 18.1.2, highlight.js 11.12.0.
- 교재 앱: 프레임워크 없는 바닐라 JS. 해시 라우터(`#/day/…`), 진도는 localStorage.
- 콘텐츠: `textbook/content/curriculum.json`과 Markdown(Day 본문·용어·문제 해결·부록).
- 테스트: `node:test`. 브라우저 테스트는 **전역 설치한** Playwright 1.63.0과 Chromium을 쓴다. 저장소 package.json에는 Playwright가 없다.
- 완성본 코드(`reference/`): P1 정적 사이트, P2 이후는 .NET 10·Rust·PostgreSQL을 쓴다. 필요한 도구와 버전은 `docs/CHECKPOINT.md` 5장을 따른다.
- 산출물 조건: 파일 하나, 외부 요청 0(글꼴·스크립트·이미지 모두 안에 넣는다).

## 명령

`textbook/` 폴더에서 실행한다.

```bash
npm ci
```

```bash
npm run build
```

- 결과는 저장소 루트의 `index.html`이다.
- 옵션: `--check`(검사만), `--allow-missing`(없는 Day는 "준비 중" 화면), `--content <dir>`, `--out <file>`.

```bash
npm test
```

```bash
npm run check -- --allow-missing
```

```bash
npm run test:e2e
```

- e2e 전에 `NODE_PATH`를 `npm root -g`의 출력 경로로 맞춘다(`docs/CHECKPOINT.md` 5.2).
- 기준선: 위 세 명령이 모두 통과해야 한다.

완성본 테스트는 저장소 루트에서 파일 하나씩 실행한다.

```bash
node --test tests/reference/p1.test.mjs
```

홈 시안은 저장소 루트에서 빌드한다. 이 폴더는 로컬 전용이고 git에서 제외되어 있다. Python 3과 fontTools, brotli가 필요하다.

```bash
node design-system/web-zero-to-hundred/prototype/build-home.mjs
```

## 문서 지도

경로와 역할만 적는다. 내용은 각 문서를 연다.

| 문서 | 경로 | 역할 |
|---|---|---|
| 재개 안내 | `docs/CHECKPOINT.md` | 현재 위치, 환경 준비, 재개 순서, 확정 결정. 새 세션이 먼저 읽는다 |
| PRODUCT | `PRODUCT.md` | 사용자, 목적, 성공 기준, 브랜드 약속, 제품 원칙, 접근성 |
| DESIGN | `DESIGN.md` | 색·글꼴·간격·모서리·깊이·모션 토큰과 Named Rules. 시각 값의 유일한 기준 |
| specs | `docs/superpowers/specs/2026-11-01-web-zero-to-hundred-design.md` | 원 설계서. 교재 전체의 최상위 기준 |
| specs | `docs/superpowers/specs/2026-11-11-textbook-redesign-design.md` | 교재 디자인 개편 설계서 |
| plans | `docs/superpowers/plans/2026-11-01-web-zero-to-hundred.md` | 구현 계획서(Task 1~37) |
| brief | `design-system/web-zero-to-hundred/pages/home.md` | 홈 화면 brief: 섹션, 우선순위, 상태, 지키는 선 |
| 콘텐츠 규칙 | `docs/CONTENT-GUIDE.md` | Day 본문·용어·문제 해결 작성 규칙과 리뷰 체크리스트 |
| 외부 사실 | `docs/research/external-facts.md` | 버전·설치 명령·URL과 출처. 이런 값은 여기서만 인용한다 |
| 진행 기록 | `docs/checkpoint/workspace/` | 진행 기록(`progress.md`), 판정(`rulings.md`), Task별 지시문·보고서 |
| 검증 기록 | `docs/verification/` | Day 묶음마다 직접 따라 해 본 결과 |
| 디자인 리서치 | `design-system/web-zero-to-hundred/research.md` | 팔레트·글꼴 비교 자료. 결정 문서가 아니다 |
| DB 검색 원본 | `design-system/web-zero-to-hundred/MASTER.md` | 검색 도구 출력 원본. 결정 문서가 아니며 DESIGN.md와 다르다 |
| 보관본 | `docs/checkpoint/CHECKPOINT-2026-11-05.md` | 이전 체크포인트. 최신과 다르면 무시한다 |
| GLOSSARY | 없음 | 프로젝트 용어집은 아직 없다. `textbook/content/glossary/`는 교재 안의 용어 사전이다 |
| adr | 없음 | 결정 기록은 `rulings.md`와 CHECKPOINT 3장에 있다 |

여러 문서의 내용이 서로 다르면 이 순서로 따른다.

1. 시각 값은 `DESIGN.md`를 따른다.
2. 홈 화면의 구성은 `pages/home.md`를 따른다.
3. 교재 범위와 기능은 원 설계서를 따른다.

## 코드 위치

- 빌드: `textbook/build.mjs`, `textbook/lib/`(조립·검증·Markdown·용어)
- 앱: `textbook/src/app/`(`main.js`, `router.js`, `progress.js`, `storage.js`, `search.js`, `views/`)
- 스타일·틀: `textbook/src/styles.css`, `textbook/src/template.html`
- 테스트: `tests/unit/`, `tests/build/`, `tests/e2e/`, `tests/reference/`, 픽스처 `tests/fixtures/`

## 규칙

### 1. 색과 글꼴은 DESIGN.md 안에서만 쓴다

- 색·글꼴·크기·간격·모서리·그림자·모션 값은 DESIGN.md의 토큰(`var(--…)`)으로만 쓴다.
- 토큰 블록 밖에 색 값이나 `font-family`를 직접 쓰지 않는다.
- 새 값이 꼭 필요하면 먼저 DESIGN.md를 고칠 안을 사용자에게 보여 주고 승인을 받는다. 그다음 코드를 고친다.
- Named Rules(One Pink, Real Progress 등)를 어기는 표현을 만들지 않는다.

### 2. 사이트 이름과 주소는 한 곳에서 관리한다

- 사이트 이름의 기준은 `textbook/content/curriculum.json`의 `title` 하나다. 앱은 실행할 때 이 값을 쓴다(`views/shell.js`, `main.js`).
- `template.html`의 `<title>`과 `.brand` 글자는 스크립트가 돌기 전에 보이는 대체값이다. 이름을 바꿀 때 같이 맞춘다.
- 공개 주소(URL) 설정은 아직 없다. 생기면 같은 파일에 키 하나로 두고, 코드에 직접 쓰지 않는다.

### 3. 공용 컴포넌트를 다시 쓴다

- 화면을 만들 때는 먼저 `textbook/src/app/views/common.js`를 쓴다(`h`, `meter`, `breadcrumb`, `linkButton`, `lockScreen`, `minutesText` 등).
- 모양은 DESIGN.md Components에 정의된 부품을 따른다.
- 같은 모양을 새로 만들지 않는다. 없는 부품이 필요하면 공용 위치에 추가한다.

### 4. 완료를 말하기 전에 증거를 보인다

- 실제로 돌린 테스트 명령과 그 출력(통과 수, 실패 내용)을 보고에 넣는다.
- 화면을 바꿨다면 스크린샷을 보인다. 최소 360px와 1280px 두 폭에서 찍고, 라이트·다크를 모두 확인한다.
- 직접 확인하지 못한 것(다른 브라우저, 실기기, 화면 낭독기 등)은 "확인하지 못함"이라고 적는다.
- Playwright는 `file:` 주소를 쓸 수 없다. 로컬 서버(`127.0.0.1`)로 띄워 확인한다.

### 5. 지켜 온 작업 규칙

- 버전·명령·URL 같은 외부 사실은 `external-facts.md`에 있는 값만 쓴다. 없으면 그 문서를 먼저 고친다.
- 작업 에이전트는 공유 문서(`external-facts.md`, `CONTENT-GUIDE.md`, `_outline.md`, 기존 용어집)를 고치지 않는다. 새로 확인한 사실은 자기 검증 기록에 적는다.
- 커밋과 push는 요청이 있을 때만 한다. 커밋할 때는 Task에 해당하는 경로만 고른다.
- 저장소 파일에 모델 식별자나 개인정보를 쓰지 않는다.
- 게임 어휘(퀘스트, 월드, 레벨, XP)는 라벨에만 쓴다. 지어낸 수치(연속 학습일, 순위, 후기)는 넣지 않는다.
