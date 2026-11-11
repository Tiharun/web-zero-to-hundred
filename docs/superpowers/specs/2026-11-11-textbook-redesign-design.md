# 교재 디자인 개편 — 설계서

- 작성일: 2026-11-11 · 상태: 사용자 검토 전
- 기준 문서: `PRODUCT.md`(제품 원칙), 루트 `DESIGN.md`(색·글꼴·크기·모서리 값의 기준), `design-system/web-zero-to-hundred/pages/home.md`(홈 브리프), `docs/superpowers/specs/2026-11-01-web-zero-to-hundred-design.md`(원 설계서 4·5장)
- 이 문서에서 정하는 것: 화면 뼈대, 부품, 모션, 강좌용 그림(2D·3D), 가독성 규칙, 검증, 구현 순서. 색·글꼴 값은 `DESIGN.md`를 따르고 여기서 다시 정하지 않는다.
- 이 설계서가 승인되면 `pages/home.md`도 확정된 것으로 본다(지금은 '초안' 표시).
- 근거 표시: **[측정]** 이 저장소에서 직접 확인함 / **[검색]** 출처 링크가 있음(맨 끝 참고) / **[선택]** 이 설계서에서 정한 값. 구현할 때 실측해서 바꿀 수 있다.

---

## 1. 목표와 성공 기준

1. 홈을 열고 5초 안에 오늘 할 Day를 알 수 있고, 한 번 눌러 들어간다(`home.md` 2절).
2. 모션이 공부 흐름을 끊지 않는다. Day 본문 단락과 코드 블록은 처음 나타날 때 한 번만 움직이고, 그 뒤에는 움직이지 않는다.
3. 어려운 개념은 그림(움직이는 2D 또는 3D)으로 볼 수 있다. 그림이 안 떠도 캡션과 대체 설명만으로 이해할 수 있다.
4. `prefers-reduced-motion`을 켜면 모든 모션이 최종 상태로 바로 보이고, 기능은 하나도 빠지지 않는다.
5. 외부 요청은 0건이고, `index.html`을 더블클릭하면 그대로 동작한다(유지).
6. 성능: 스크롤과 애니메이션 중에 50ms를 넘는 Long Task가 없다(트레이스로 측정). 3D는 화면에 들어온 뒤에만 시작하므로 첫 화면이 늦게 그려지지 않는다.
7. 접근성: WCAG 2.2 AA를 지킨다. Drawer·Modal·Dropdown·Accordion은 모두 키보드만으로 열고, 쓰고, 닫을 수 있다.

## 2. 요청을 이렇게 해석했다

| 사용자 요청 | 이 설계의 해석 |
|---|---|
| Skeleton UI Layout | 두 가지 뜻을 모두 적용한다. ① **앱 셸(뼈대)**: 상단 바·사이드바·본문·목차 자리를 먼저 고정해서 화면이 늦게 차더라도 흔들리지 않게 한다. ② **Skeleton 자리표시**: 실제로 늦게 준비되는 곳(3D 그림, 검색 결과)에만 쓴다. 바로 그려지는 곳에 넣으면 깜빡임만 늘어난다[선택]. Skeleton이 오히려 기다리는 시간을 길게 느끼게 한다는 보고도 있다[검색, 2차 출처] |
| Drawer | `<dialog>` 기반이다. ESC, 바깥 클릭, 닫기 버튼으로 닫힌다. 쓰는 곳은 5.1 |
| 게임 UI 섞기 | 라벨, 진행 표시, 보상 순간(완료·레벨업)에만 쓴다. 본문 글과 Day 제목은 바꾸지 않는다(`PRODUCT.md` 원칙 4) |
| 모션 목록 15종 | 기법마다 뜻이 있는 자리 1~3곳에만 둔다(6.3 표). 장식으로 반복하지 않는다 |
| 가독성 용어 10개 | 용어마다 화면별 구체 규칙으로 바꿨다(4장) |
| 강좌용 그림, Three(3D) | Three.js를 `index.html` 안에 넣는다. 3D는 깊이가 이해를 돕는 개념에만 쓰고, 나머지는 움직이는 SVG로 그린다(7장) |

## 3. 화면 뼈대 (앱 셸)

### 3.1 영역과 구간 [선택]

| 영역 | 내용 | 크기 |
|---|---|---|
| 상단 바 | 교재 이름, 검색 버튼(`Ctrl+K`), 테마 Dropdown, 메뉴 버튼(1024px 미만) | 높이 56px, 스크롤해도 고정 |
| 사이드바 | 월드(프로젝트)별 Day 목록. 월드마다 Accordion. 지금 월드만 펼친다 | 280px. 1024px 이상에서는 늘 보이고, 그 아래에서는 Drawer |
| 본문 | 페이지 내용 | 글 열 최대 폭 720px(17px 기준 한 줄에 대략 40자 안팎[선택, 구현 때 실측]) |
| 퀘스트 로그 | Day 페이지 목차(8개 고정 섹션과 지금 위치) | 220px. 1280px 이상에서만 보인다. 그보다 좁으면 본문 위 접힘 목록 |

화면 구간 기준: 360 / 768 / 1024 / 1280 / 1440px. 360px에서는 가로 스크롤이 없어야 한다(코드 블록 안의 가로 스크롤만 허용한다).

### 3.2 홈
`home.md`의 구성·우선순위·상태를 그대로 따른다. 이 설계에서 더하는 것:
- 첫 행: 퀘스트 카드(2/3)와 레벨 패널(1/3). 초점은 퀘스트 카드의 큰 Day 번호다(DESIGN.md "One Big Number").
- 월드맵: 월드 노드를 잇는 경로선이 SVG다(Path Drawing). 360px에서는 세로로 놓고, 다른 월드 카드는 가로 Scroll Snap 캐러셀로 보여 준다.
- 막혔을 때: 부록 4개 바로가기. 늘 같은 자리에 둔다.

### 3.3 Day 페이지 (위에서 아래로)
1. 읽기 위치 바: 상단 바 바로 아래에 3px 높이로 둔다. 스크롤 위치를 표시하며 XP가 아니다. 초록은 완료에만 쓰므로 이 바는 본문 글자색 계열로 칠한다(DESIGN.md "Real Progress").
2. Day 헤더: 큰 Day 번호와 제목(38px)을 둔다. 메타 칩은 예상 시간, 작업 폴더, 월드 이름이다.
3. 본문: 고정 섹션 8개(🎯 → 📚)를 둔다. 섹션마다 위쪽 간격을 넉넉하게 줘서 섹션 경계를 구분한다. 카드 상자로 감싸지는 않는다(읽는 흐름을 끊으므로).
4. 퀘스트 로그(오른쪽): 8단계 목록이다. 지금 읽는 섹션이 강조되고, 누르면 그 섹션으로 부드럽게 스크롤한다.
5. 끝부분: 체크리스트 → "Day 완료" 버튼 → 이전/다음 Day 순서다.

### 3.4 그 밖의 페이지
- 월드(프로젝트) 페이지: 결과물 문장, 기술 칩, Day 노드 목록. 홈 월드 카드와 Shared Element로 이어진다.
- 부록·용어 사전·문제 해결: 본문 열 하나와 퀘스트 로그를 쓴다(목차가 있을 때만).
- 검색: `Ctrl+K`로 Modal을 연다(5.2). 기존 검색 페이지 경로도 유지한다.

### 3.5 Skeleton 자리표시 규칙 [선택]
- 쓰는 곳: 3D 그림을 준비하는 동안, 검색 결과를 처음 계산하는 동안.
- 시작 후 200ms 안에 준비되면 보여 주지 않는다. 한 번 보이면 최소 300ms는 유지한다(깜빡임 방지).
- 모양: 실제 내용과 같은 크기의 회색 상자. 반짝임(shimmer) 1.2초 반복. reduced-motion일 때는 반짝임 없이 정지.
- 자리 크기를 미리 잡아서 레이아웃 이동을 0으로 만든다(그림 틀은 `aspect-ratio`로 고정).

## 4. 가독성과 시각 구조 규칙

| 원칙 | 홈 | Day 페이지 |
|---|---|---|
| Focal Point | 화면당 하나: 퀘스트 카드의 Day 번호 | Day 제목. 내려가면 지금 섹션 제목 |
| Readability | 숫자는 `tnum`, 라벨은 12px 이상 | 본문 17px, 줄간격은 열린 결정(1.65 vs 1.75), 글 열 최대 720px, `word-break: keep-all` 유지, 본문 가로 스크롤 금지 |
| Visual Weight | 분홍은 주 버튼 하나("이어서 하기")에만(DESIGN.md "One Pink") | 분홍은 "Day 완료" 버튼에만. 알림 상자는 분홍보다 약하게 |
| Balance | 2/3 + 1/3 비대칭 균형 | 본문 열 가운데, 퀘스트 로그는 오른쪽 가벼운 열 |
| Grouping | 카드 하나에 한 주제. 그룹 안 간격은 그룹 사이 간격보다 작게 | 섹션 → 단계 → 단락 순서로 간격을 줄인다 |
| Density | 중간 | 본문은 여유 있게, 사이드바는 촘촘하게(행 높이 36px. 터치 화면에서는 44px) |
| Visual Hierarchy | 크기 단계: 80(큰 번호) / 38(제목) / 26(h2) / 20(h3) / 17(본문) / 12(라벨)[h2·h3 값은 선택] | 같음 |
| Alignment | 4px 격자. 카드 안 글자의 시작선을 맞춘다 | 본문 왼쪽 정렬. 코드 블록과 알림 상자는 본문과 같은 왼쪽 선 |
| Whitespace | 간격 단계 4/8/12/16/24/32/48/64[선택] | 섹션 위 64, 단계 위 32, 단락 사이 16 |
| Cognitive Load | 한 화면에 할 일 하나. 격려 문구는 한 줄 | 정답과 "자주 막히는 곳"은 접어 두고 필요할 때 연다. 움직이는 그룹은 동시에 하나만. 아이콘에는 늘 글자를 같이 붙인다 |

## 5. 부품

### 5.1 Drawer
- 쓰는 곳: ① 1024px 미만의 사이드바(왼쪽에서 나온다) ② 용어 미리보기(본문의 용어 링크를 누르면 오른쪽에서 정의가 나온다. 페이지를 떠나지 않는다).
- 구현: `<dialog>`를 `showModal()`로 연다. 바깥 클릭으로 닫히게 `closedby="any"`를 주고, 이 속성이 없는 브라우저(Safari 등)에서는 백드롭 클릭 감지로 대신한다[검색]. ESC는 dialog 기본 동작을 쓴다.
- 닫히는 경우: ESC, 바깥(백드롭) 클릭, 닫기 버튼, 링크로 다른 페이지로 갈 때, 창이 1024px 이상으로 넓어질 때(사이드바 Drawer만).
- 포커스: 열면 첫 링크(또는 지금 Day 항목)로 간다. 닫히면 연 버튼으로 돌아간다. 배경은 `showModal`이 자동으로 inert 처리하고, 열려 있는 동안 본문 스크롤을 잠근다.
- 모션: 들어올 때 `translateX` 280ms, 나갈 때 180ms. 백드롭은 투명도만 바꾼다.

### 5.2 Modal
- 쓰는 곳: 검색 팔레트(`Ctrl+K`), 레벨업·월드 클리어 축하(사건마다 한 번), 진도 복원 덮어쓰기 확인, 진도 초기화 확인.
- 구현: Drawer와 같은 `<dialog>`. 확인용 Modal은 바깥 클릭으로 닫혀도 "취소"로 처리한다(아무것도 바뀌지 않는다).
- 정답 펼치기 확인("먼저 직접 풀어 보세요")은 Modal로 만들지 않고 지금처럼 그 자리에서 확인한다(정답은 길고, 본문과 같이 읽어야 하므로).

### 5.3 Dropdown
- 쓰는 곳: 테마(시스템/라이트/다크), 사이드바 머리의 월드 전환.
- 구현: 버튼과 메뉴(WAI-ARIA 메뉴 버튼 패턴). 위아래 화살표로 항목을 옮기고, Enter로 고르고, ESC나 바깥 클릭으로 닫는다. 닫히면 포커스가 버튼으로 돌아간다.

### 5.4 Accordion
- 쓰는 곳: 사이드바의 월드 그룹, "🧯 자주 막히는 곳"의 증상별 항목(증상이 제목), 퀘스트 로그의 좁은 화면 접힘 목록.
- 구현: `<details>`/`<summary>`. "모두 펼치기" 버튼을 함께 둔다.
- 모션: 높이는 바로 바뀌고, 내용만 `opacity`와 `translateY(4px)`로 160ms 나타난다(높이 애니메이션은 쓰지 않는다)[선택].

### 5.5 게임 부품
| 부품 | 내용 |
|---|---|
| 퀘스트 카드 | 큰 Day 번호, 제목, 시간, 결과물, 작업 폴더, 주 버튼 |
| 레벨 패널 | `LV n`, XP 막대(DESIGN.md `xp-bar`), `n / 155 Day`. 라벨만 Galmuri11 |
| 월드맵 | 노드(완료·다음·남음·잠김), 배포 Day 깃발, 경로선 |
| 업적 토스트 | 화면 아래 가운데. 4초 뒤 사라진다. `role="status"`. 마우스를 올리거나 포커스가 있으면 멈춘다 |
| 레벨업 Modal | 레벨이 오를 때 한 번. 새 레벨과 다음 목표. 닫기 버튼에 포커스 |
| 퀘스트 로그 | Day 목차. "단계 3/8"처럼 위치를 보여 준다(완료 수가 아니다) |
| 그림 틀 | 7장 |

## 6. 모션

### 6.1 원칙
1. 움직임에는 뜻이 있어야 한다: 피드백, 관계(어디서 왔나), 진행. 장식으로만 반복되는 움직임은 넣지 않는다.
2. `transform`과 `opacity`만 움직인다. `width`·`height`·`top` 같은 레이아웃 속성은 움직이지 않는다.
3. 한 번에 움직이는 그룹은 하나뿐이다. 본문을 읽고 있을 때는 아무것도 저절로 움직이지 않는다.
4. `prefers-reduced-motion: reduce`이면 모든 모션이 최종 상태로 바로 간다. 정보는 그대로 다 보인다.
5. 마우스 전용 효과(Tilt, Magnetic)는 `(hover: hover) and (pointer: fine)`일 때만 켠다.
6. JS가 실패해도 내용은 보인다. 숨긴 채 시작하는 상태(Reveal 전)는 JS가 붙인 클래스로만 만든다.

### 6.2 토큰 [선택]
| 토큰 | 값 | 용도 |
|---|---|---|
| `--dur-micro` | 120ms | 눌림, 체크, 아이콘 변화 |
| `--dur-short` | 200ms | Hover Lift, Dropdown |
| `--dur-enter` | 280ms | Drawer·Modal 들어옴, Reveal |
| `--dur-exit` | 180ms | 나감(들어올 때보다 짧게) |
| `--dur-celebrate` | 600ms | XP 막대 채움, 레벨업 |
| `--ease-out` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | 들어옴 |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | 나감 |
| stagger 간격 | 40ms, 최대 8개 | 9번째부터는 지연 없이 바로 |

이 토큰은 CSS `:root`에 둔다. DESIGN.md frontmatter는 모션 키를 받지 않으므로 본문의 "Motion" 메모로 기록한다(구현 후 `/impeccable document`).

### 6.3 기법 배치표

| 기법 | 자리 | 뜻 | 조건·한도 |
|---|---|---|---|
| Stagger | 홈 첫 표시(세션당 1회), 체크리스트, 월드맵 노드, 사이드바 Drawer 목록 | 읽는 순서 안내 | 40ms 간격, 최대 8개 |
| Microinteraction | 체크박스(체크 표시 그리기와 작은 튐), 코드 복사("복사됨" 2초), 테마 아이콘 바뀜, "Day 완료" 버튼 눌림 | 눌렀다는 확인 | 120~200ms |
| Scroll Reveal | Day 섹션 제목, 그림 틀, 홈 월드 카드 | 새 덩어리 시작 | 한 번만. 아래로 8px + 투명도. 본문 단락에는 쓰지 않는다 |
| Smooth Scroll | 퀘스트 로그·목차 이동, "맨 위로" | 위치 관계 | `scroll-behavior: smooth`. reduced-motion이면 `auto` |
| Scroll-linked Animation | 읽기 위치 바, 퀘스트 로그의 지금 섹션 표시 | 어디쯤 읽는지 | 지원 브라우저는 CSS `animation-timeline: scroll()`, 나머지는 `requestAnimationFrame`으로 대체[검색] |
| Dropdown | 테마, 월드 전환 | — | 5.3 |
| Modal | 검색, 축하, 확인 | — | 5.2 |
| Drawer | 사이드바(좁은 화면), 용어 미리보기 | — | 5.1 |
| Scroll Snap | 홈 다른 월드 카드(좁은 화면), 그림의 단계 슬라이드 | 하나씩 보기 | `scroll-snap-type: x mandatory`. 좌우 버튼과 키보드도 함께 둔다 |
| Accordion | 사이드바 월드, 자주 막히는 곳 | 점진적 공개 | 5.4 |
| Tilt Effect | 홈 퀘스트 카드, 월드 카드 | 손에 잡히는 느낌 | 최대 4도. 마우스 전용. 마우스가 나가면 원래대로 |
| Magnetic Button | "이어서 하기" 주 버튼 하나 | 주 행동 강조 | 최대 6px 끌림. 마우스 전용 |
| Path Drawing | 월드맵 경로선, SVG 개념 그림의 선 | 흐름·연결 | 처음 볼 때 1회. Day 완료 뒤 다음 구간만 그린다 |
| Shared Element Transition | 퀘스트 카드 Day 번호 → Day 헤더 번호, 월드 카드 → 월드 페이지 머리 | 같은 것이 이어진다 | `document.startViewTransition`과 `view-transition-name`. 지원하지 않으면 바로 바꾼다[검색] |
| Hover Lift | 카드, 사이드바 항목, 부록 바로가기 | 누를 수 있음 | 카드는 `translateY(-2px)`와 그림자 한 단계, 200ms |
| Shake | 잠긴 Day·월드 클릭, 조건이 안 된 "Day 완료" 클릭, 복원 파일 검증 실패 | 안 된다는 신호 | 좌우 4px, 3회, 300ms. 반드시 이유 문장을 같이 보여 준다(`role="status"`) |
| XP 채움 | 홈 레벨 패널(Day 완료 뒤 처음 올 때) | 진행 보상 | `--dur-celebrate`. 1회 |

### 6.4 브라우저 지원과 대체 방식 [검색]
- 같은 문서 View Transitions: Chrome·Edge 111, Safari 18, Firefox 144부터 지원한다. 지원하지 않으면 애니메이션 없이 바꾼다.
- 스크롤 연동 애니메이션(`animation-timeline`): Chrome·Edge 115, Safari 26, Firefox 159(2026-10-27 출시)부터 지원한다. 그 이하 버전은 JS로 대체한다.
- `<dialog closedby>`: Chrome·Edge 134, Firefox 141에서 지원하고 Safari는 지원하지 않는다. 그래서 백드롭 클릭 대체 코드를 반드시 넣는다.
- 모든 기능은 기능 감지(`'startViewTransition' in document`, `CSS.supports('animation-timeline: scroll()')`, `'closedBy' in HTMLDialogElement.prototype`)로 켠다.

### 6.5 라이브러리
- 모션 라이브러리(GSAP 등)는 쓰지 않는다. CSS, Web Animations API, 작은 유틸 모듈(`textbook/src/app/motion.js`)로 만든다[선택: 외부 의존과 용량을 줄이기 위해].
- 유틸 모듈이 맡는 일: reduced-motion 감지, Reveal 관찰(IntersectionObserver), stagger 지연 계산, Tilt·Magnetic(rAF로 묶어서 처리), Shared Element 래퍼.

## 7. 강좌용 그림 (2D·3D)

### 7.1 그림 등급
| 등급 | 형태 | 예 |
|---|---|---|
| G1 | 정적 SVG | 폴더 구조 |
| G2 | 움직이는 SVG. Path Drawing과 "▶ 다음 단계" 버튼으로 단계별 재생 | 요청·응답 왕복, Git 흐름 |
| G3 | 인터랙티브. 슬라이더나 버튼으로 값을 바꿔 결과를 본다 | Flexbox 축과 정렬 |
| G4 | 3D(Three.js). 마우스로 돌려 보기, 버튼으로 시점 바꾸기 | 박스 모델 겹, DOM 트리 |

규칙: 늘 가장 낮은 등급부터 고른다. G4는 깊이(겹침, 앞뒤, 공간)가 개념 자체일 때만 쓴다.

### 7.2 작성 문법 (원 설계서 5.2에 블록 하나 추가)
```
:::figure box-model-3d
캡션: CSS 박스 모델 — 내용, 안쪽 여백, 테두리, 바깥 여백
대체 설명: 가운데 내용 상자를 padding, border, margin이 차례로 감싼다. …
:::
```
- 그림 코드: `textbook/src/figures/<id>.js`에 `mount(el, { reducedMotion }) → dispose()` 함수 하나를 둔다.
- 빌드는 존재하지 않는 id, 빠진 캡션, 빠진 대체 설명을 오류로 막는다.
- `docs/CONTENT-GUIDE.md`에 쓰는 법과 등급 고르는 기준을 추가한다.

### 7.3 3D 규칙
- 엔진: `three`를 npm devDependency로 버전을 고정해 넣고, esbuild로 쓰는 모듈만 묶는다. 라이선스는 MIT이므로 라이선스 문서에 저작권 표기를 추가한다[검색].
- 용량 예산: 3D 때문에 늘어나는 `index.html` 크기는 700KB 이하[선택]. 참고로 과거 측정치는 최소화 약 600kB, gzip 약 150kB다[검색, 오래된 수치이므로 구현 때 실측한다]. 현재 `index.html`은 5,099,750바이트이고 웹폰트는 아직 들어 있지 않다[측정].
- 첫 화면 비용: 3D 코드 실행은 그림이 화면에 들어올 때 시작한다. 구현 계획에서 "파싱 비용까지 미루는 방식"을 실측으로 고른다.
- 실행: 화면에서 벗어나거나 탭이 숨겨지면 렌더 루프를 멈춘다. 한 번에 돌아가는 3D는 하나뿐이다. `devicePixelRatio`는 최대 2로 한다.
- 실패: WebGL을 쓸 수 없으면 같은 id의 G1 대체 SVG와 대체 설명을 보여 준다.
- 접근성: 캔버스는 `role="img"`와 `aria-label`을 가진다. 시점 버튼(←, →, 처음으로)은 키보드로 쓸 수 있다. reduced-motion이면 자동 회전을 끈다. 3D만으로 정보를 전하지 않는다(캡션과 대체 설명이 같은 내용을 담는다).

### 7.4 첫 범위: P1 핵심 그림 6개
| Day | 개념 | 등급 |
|---|---|---|
| 1 | 브라우저 ↔ 서버 요청·응답 | G2 |
| 4·5 | 폴더 트리와 절대·상대 경로(현재 위치를 고르면 경로가 계산된다) | G3 |
| 6·20 | HTML 중첩 → DOM 트리 | G4 |
| 7 | 작업 폴더 → 스테이징 → 커밋 → GitHub | G2 |
| 10 | 박스 모델 겹 | G4 |
| 11 | Flexbox 주축·교차축과 정렬 | G3 |

### 7.5 보류 옵션: 모든 Day 전용 그림
155 Day 모두에 전용 그림을 넣는 안은 보류 중이다. 이 설계는 7.4만 포함한다. 넓힐지는 사용자가 정한다(13장).

## 8. 게임 UI 테마 규칙
- 게임 어휘는 라벨에만 쓴다: 오늘의 퀘스트, 월드, LV, XP, 클리어, 퀘스트 로그. 본문과 Day 제목은 바꾸지 않는다.
- 픽셀 글꼴(Galmuri11)은 라벨과 숫자 표시에만 쓴다(DESIGN.md "Label-Only Pixel").
- 진행 숫자는 실제로 완료한 것만 센다. 연속 학습일, 순위, 학습자 수는 넣지 않는다.
- 보상 순간(Day 완료, 레벨업, 월드 클리어)에만 축하 모션을 한 번 보여 준다. 소리는 넣지 않는다.
- XP 공식(완료 Day의 예상 분, 300 XP마다 1레벨)은 임시다(13장).

## 9. 접근성과 예외 상황
- 포커스 링: 2px 실선과 2px 간격. 라이트·다크 모두 3:1 이상(WCAG 1.4.11[검색]). 키보드 포커스에만 보인다(`:focus-visible`).
- 상태 알림: 토스트, Shake 이유, 복사됨은 `role="status"`로 알린다.
- 저장소를 쓸 수 없을 때: 맨 위 한 줄 알림(현재 동작 유지). 축하 모션은 메모리 진도 기준으로 동작한다.
- 3D 실패, 글꼴 로드 실패, JS 기능 미지원: 각각 G1 그림, 시스템 글꼴, 애니메이션 없는 상태로 동작한다.
- 인쇄(`@media print`): 모션과 Drawer를 없애고 정답을 펼친 채 인쇄한다[선택].

## 10. 성능 예산 [선택]
| 항목 | 기준 |
|---|---|
| 애니메이션 속성 | `transform`, `opacity`만(SVG 선은 `stroke-dashoffset`) |
| 스크롤 중 Long Task | 50ms 초과 0건 |
| 레이아웃 이동(CLS) | 0.05 이하 |
| 3D 활성 개수 | 1 |
| `will-change` | 애니메이션이 도는 동안에만 붙인다 |
| 크기 증가 | 웹폰트는 교재에 쓰인 글자만 서브셋한다(`research.md` 실측표 기준). 늘어난 크기는 단계 A 보고에 적는다. 3D는 7.3 예산 |

## 11. 검증
- 단위 테스트(`node --test`): motion 유틸(reduced-motion이면 바로 최종 상태가 되는지, stagger 상한), XP·레벨 계산, figure id 검증.
- 빌드 테스트: 외부 URL 0건, 모든 `:::figure`에 캡션과 대체 설명이 있는지, 크기 예산.
- 브라우저 기능 테스트(Playwright): Drawer가 ESC·바깥 클릭·링크 이동·창 넓힘에 닫히는지와 포커스 복귀, Modal 포커스 가둠, Dropdown 키보드 조작, Accordion, Shake와 이유 문장, Shared Element 대체 동작, 360px 가로 스크롤 없음, 라이트·다크·reduced-motion 스크린샷.
- 성능 분석(chrome-devtools): 홈과 그림이 많은 Day의 스크롤 트레이스(Long Task, CLS), 3D 진입 전후 메모리.
- 대비 측정: 바뀐 색 조합 전부(기존 대비 스크립트).
- 확인하지 못한 브라우저(Safari 등)는 보고에 "미확인"으로 적는다.

## 12. 구현 순서
파일이 겹치므로(`styles.css`, `views/`) 단계마다 자식 세션 하나로 차례대로 진행한다. 단계마다 구현 계획 → 자식 세션 구현 → 이 세션에서 검토하는 순서다.

| 단계 | 내용 | 끝났다는 기준 |
|---|---|---|
| A 기반 | DESIGN.md 토큰을 CSS로 옮김, 웹폰트 내장(WZH 이름, 라이선스 문서), 앱 셸, `motion.js`, Drawer·Modal·Dropdown·Accordion | 기존 테스트 통과, 부품 기능 테스트 통과 |
| B 홈 | `home.md`와 3.2, 게임 부품, 홈 모션 | 홈 상태 6개 스크린샷, 5초 기준 점검 |
| C Day와 나머지 페이지 | 3.3·3.4, 퀘스트 로그, 읽기 위치 바, 용어 Drawer, 검색 Modal | Day 기능 테스트와 성능 트레이스 통과 |
| D 그림 | `:::figure`, 그림 틀, Three.js 3D 기반, 7.4의 6개 | 그림별 대체 동작과 크기 예산 통과 |
| E 다듬기 | audit와 polish, DESIGN.md 갱신과 `.impeccable/design.json` | 대비·접근성·성능 최종 보고 |

## 13. 열린 결정 (사용자 결정 필요)
1. Day 본문 줄간격: 1.65(DESIGN.md) 또는 1.75(현재).
2. XP 공식 확정.
3. 테두리, 알림 상자, 코드 구문 강조, 위험(danger) 색(DESIGN.md 미정 색).
4. 모든 Day 전용 그림으로 넓힐지(7.5).
5. North Star 이름("공부 퀘스트 보드", 제안).

## 14. 범위 밖
- 소리 효과, 배경 음악, 캐릭터·마스코트 그림.
- 계정과 동기화, 순위표.
- 본문 글 다시 쓰기(그림 블록 추가만 한다).
- 모션 라이브러리와 CDN.

## 출처
- Same-document view transitions Baseline: https://web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available
- View Transitions 2025 업데이트: https://developer.chrome.com/blog/view-transitions-in-2025
- 스크롤 연동 애니메이션 Baseline(2026-10): https://web.dev/blog/web-platform-10-2026
- Firefox 159 개발자 노트: https://developer.mozilla.org/en-US/Firefox/Releases/159
- `<dialog closedby>` 지원 현황: https://web-platform-dx.github.io/web-features-explorer/features/dialog-closedby
- Light dismiss 대체 코드 지침: https://developer.chrome.com/docs/modern-web-guidance/guides/ui-behaviors/light-dismiss-a-dialog
- three.js 크기(과거 수치): https://discourse.threejs.org/t/three-js-file-size-when-importing-via-npm-and-bundling-with-webpack/8904
- three.js 라이선스(MIT, 사본): https://metadata.ftp-master.debian.org/changelogs/main/t/three.js/stable_copyright — 구현 때 npm 패키지의 `LICENSE`로 다시 확인한다
- Skeleton 체감 시간 연구(2차 출처): https://dev.to/137foundry/the-psychology-behind-why-users-abandon-loading-pages-goo
- WCAG 1.4.11 비문자 대비: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast
