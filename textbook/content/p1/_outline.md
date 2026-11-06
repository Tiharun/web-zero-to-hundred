# P1 상세 개요 — 나의 크리에이터 홈페이지 (30 Day)

작성 기준일 2026-11. 이 파일은 빌드가 무시해요(`_`로 시작). Day 작성자는 **이 개요, 레퍼런스(`reference/p1-my-creator-site/`), `docs/CONTENT-GUIDE.md`, 견본 `textbook/content/p1/day-01.md`** 만 보고 자기 Day를 써요. 다른 Day의 본문은 볼 수 없다고 가정하고, 이 개요에 적힌 시작 상태·끝 상태·용어 배정을 그대로 지켜 주세요.

- 근거: 설계서 3.1(Day 제목·핵심), CONTENT-GUIDE 2.3(P1 고정 규칙), `docs/research/external-facts.md`(버전·메뉴·URL), 레퍼런스 README.
- Day 메타(title·minutes·summary·keywords)는 `textbook/content/p1/_meta.json`에 있어요(컨트롤러가 curriculum.json에 합쳐요).
- 이 개요와 레퍼런스가 다르면 레퍼런스 이름(파일·class·id·변수·데이터 형식)을 따르고 보고서에 적어요. 이 개요와 다른 Day가 서로 다르게 보이면 이 개요가 기준이에요.

## 0. P1 모든 Day 공통 규칙

### 0.1 폴더·이름·글 내용

- 프로젝트 폴더는 `C:\dev\my-creator-site`(Day 3부터). 연습 폴더는 `C:\dev\hello`(Day 1~2, 4~5 과제, 8 과제, 17~18 연습장). 그 밖의 폴더를 만들지 않아요.
- 파일·폴더·class·id·변수·함수·데이터 키 이름은 레퍼런스와 **똑같이** 써요. 예시 닉네임은 `달빛곰`, 사이트 이름은 `달빛곰 방송국`이에요. 학습자가 글 내용(닉네임·소개 문장·일정 글·영상 제목)을 자기 것으로 바꿔도 된다고 매번 알려 줘요. 이름(id·class·파일)은 바꾸지 않게 해요.
- 코드 모양은 레퍼런스와 같게 써요: 들여쓰기 2칸, `<!doctype html>`(소문자), `<meta charset="utf-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1">`, HTML 속성은 큰따옴표, JS 문자열은 작은따옴표, 문장 끝 세미콜론, 레퍼런스의 주석 문장을 그대로 씀(그 Day에 아직 없는 내용을 가리키는 주석은 그 내용이 생기는 Day에 넣어요).
- 다섯 페이지(`index.html`, `about.html`, `contents.html`, `schedule.html`, `contact.html`)는 머리글·메뉴·바닥글이 같아요. 머리글·메뉴를 고치는 Day(6, 9, 10, 11, 21, 22, 28)는 **다섯 파일 모두** 고치는 단계를 두고, 끝 상태 코드에 다섯 파일을 모두 실어요(200줄 이하라 파일 전체). 각 페이지의 `aria-current="page"`는 Day 11부터 자기 메뉴에만 붙어요.

### 0.2 화면 확인 방법

- Day 1: 파일 더블클릭(`file://`). Day 2부터: VS Code **Live Preview**(주소 `http://127.0.0.1:3000/…` — 기본 포트 3000은 실기 미확인, 본문에는 "숫자는 달라도 돼요"를 붙여요) 또는 더블클릭. Day 3~24는 두 방법 모두 동작해야 해요.
- **개발자 도구는 브라우저에서.** VS Code 안의 Live Preview 미리 보기 창은 Edge·Chrome이 아니라서 `F12`를 눌러도 브라우저 개발자 도구가 열리지 않아요. 개발자 도구(Elements·Styles·Console·Network·Application·Lighthouse·Sources·기기 모드)가 필요한 단계는 미리 보기 창 위쪽 주소 칸의 주소(`http://127.0.0.1:3000/…`)를 복사해 **Edge(또는 Chrome) 주소창에 붙여 열거나**, 명령 팔레트의 Live Preview 외부 브라우저 명령(`Live Preview: Show Preview (External Browser)`)으로 열어요. 명령·버튼 이름은 실기 미확인이라 본문에는 "이름은 버전에 따라 조금 다를 수 있어요"를 붙이고 주소 복사 방법을 1순위로 써요. 더블클릭(`file://`)으로 연 페이지는 이미 브라우저라 그대로 `F12`를 써요. Day 6에서 처음 안내하고, 개발자 도구를 쓰는 Day(9, 10, 13, 15, 22, 25, 26, 28, 29)는 이 규칙을 한 줄로 다시 짚어요.
- Day 25부터 `fetch`를 쓰는 페이지(`contents.html`, Day 26부터 `schedule.html`)는 **Live Preview 또는 배포 주소로만** 열어요(레퍼런스 README). 더블클릭하면 오류 상자가 나오는 것이 정상이라고 알려 줘요.
- Day 14부터 배포 주소 `https://<내 아이디>.github.io/my-creator-site/`에서 확인하는 단계를 "선택"으로 둘 수 있어요(반영까지 최대 10분, external-facts 4절).

### 0.3 Git 습관 (Day 7부터)

- Day 7에서 터미널 명령과 VS Code **소스 제어** 패널(`Ctrl + Shift + G`)을 둘 다 배워요. Day 8부터는 마지막 따라하기 단계를 "오늘 작업 커밋·푸시"로 두고, 소스 제어 패널(메시지 입력 → **커밋** → **변경 내용 동기화**) 또는 명령(`git add .` → `git commit -m "Day N: 요약"` → `git push`) 중 하나로 해요. 커밋 메시지 형식은 `Day N: 요약`(예: `Day 8: 일정표, 문의 폼, 대표 영상`).
- Day 8 이후 끝 상태 확인에는 "GitHub 저장소 페이지에 `Day N: …` 커밋이 보여요"를 넣어요. 프로젝트 파일이 바뀌지 않는 Day(17, 18)는 커밋하지 않아도 된다고 적어요.
- 터미널은 VS Code 안의 터미널(PowerShell)만 써요. 터미널 기초는 P2 Day 2에서 제대로 배운다고 예고해요(CONTENT-GUIDE 2.3). Windows PowerShell 5.1 규칙(`&&` 금지 등, CONTENT-GUIDE 3.4)을 지켜요.

### 0.4 시간·영상·외부 주소

- 시간 코드(Day 16 인사말, Day 26 카운트다운, Day 27 오버레이)는 **브라우저 로컬 시간 = 컴퓨터 시계**를 써요. 본문에 "컴퓨터 시계 기준이에요. 한국에서 쓰는 컴퓨터면 한국 시간으로 계산돼요"를 적고, 시간대는 P2 Day 29에서 배운다고 예고해요. `Intl` 시간대 옵션·라이브러리를 쓰지 않아요.
- YouTube 영상 ID(`aqz-KE-bpKQ` 등)는 예시예요. "내 YouTube 영상 주소 `watch?v=` 뒤의 11글자로 바꿔요"와 "`file://`로 열면 YouTube 임베드가 재생되지 않을 수 있어요"를 적어요(Day 8, 20, 25).
- 외부 라이브러리·CDN·웹폰트를 쓰지 않아요. 외부 주소는 YouTube뿐이에요.

### 0.5 `css/style.css` 구역 지도 (삽입 위치 기준)

`style.css`는 레퍼런스와 같은 구역 주석을 쓰고, 구역은 처음 필요한 Day에 **레퍼런스 순서대로** 끼워 넣어요. 새 구역을 넣는 Day는 "어느 구역 주석 바로 위/아래"인지 정확히 적어요.

| 구역 주석(레퍼런스 원문) | 처음 만드는 Day |
|---|---|
| 파일 맨 위 머리 주석 `/* === style.css - … === */` | 9 (Day 13·14에 한 줄씩 더해 완성) |
| `/* ---------- 1. CSS 변수: 색은 여기서만 정해요 (Day 14, 22) ---------- */` | 14 |
| `/* ---------- 2. 기본 설정 (Day 9, 10) ---------- */` | 9 |
| `/* ---------- 3. 레이아웃 ---------- */` | 10 |
| `/* ---------- 4. 헤더와 내비게이션 (Day 11) ---------- */` | 9 |
| `/* ---------- 5. 공통 부품 ---------- */` | 11 |
| `/* ---------- 6. 페이지별 ---------- */` | 10 |
| `/* ---------- 7. 푸터 ---------- */` | 9 |
| `/* ---------- 8. 반응형: 화면이 768px 이상일 때 (Day 13) ---------- */` | 13 |
| 파일 맨 끝 `prefers-reduced-motion` 규칙 | 28 |

- **주석 규칙(머리 주석 포함).** 구역 제목 주석(`/* ---------- 2. 기본 설정 (Day 9, 10) ---------- */` 등)은 그 구역을 처음 만드는 Day에 레퍼런스 원문 그대로 써요(괄호 속 Day 번호도 그대로). 그 밖의 설명 주석은 설명하는 코드가 생기는 Day에 넣어요(0.1절). 파일 맨 위 머리 주석은 세 단계로 완성해요: Day 9 = 테두리 줄 두 개 + `style.css - 달빛곰 방송국 전체 스타일 (모든 페이지가 함께 써요)` 줄, Day 13 = `모바일 먼저 만들고, 화면이 넓어지면 @media로 덧붙여요 (Day 13)` 줄 추가, Day 14 = `순서: 변수 → 기본 → 레이아웃 → 헤더/메뉴 → 공통 부품 → 페이지별 → 반응형` 줄을 제목 줄 바로 아래에 추가(이 Day에 마지막 구역 1이 생겨 레퍼런스와 같아짐).
- Day 9~13은 색을 색상 코드로 직접 써요(밝은 색 값: 배경 `#ffffff`, 면 `#f4f2ff`, 글자 `#1d1b2e`, 보조 글자 `#5a5775`, 포인트 `#5b4bdb`, 포인트 위 글자 `#ffffff`, 링크 `#4a3bc7`, 선 `#d9d6ee`, 모서리 `12px`). Day 14에 `:root` 변수로 바꾸고 모든 색을 `var(--…)`로 고쳐요. Day 14 이후 Day는 새 색도 변수로만 써요.

### 0.6 JavaScript 파일 구역

- `js/main.js`(모든 페이지): 머리 주석 → `1. 모바일 메뉴 (Day 21)` → `2. 다크 모드 (Day 22)` → `3. 시간대별 인사말 (Day 16)`. Day 16에 3번 구역이 먼저 생기고, Day 21에 1번을 3번 **위에**, Day 22에 2번을 1번과 3번 **사이에** 넣어요. 머리 주석의 목록 줄은 구역이 생길 때마다 늘어나서 Day 22에 레퍼런스와 같아져요.
- `js/contents.js`(영상 페이지): 레퍼런스의 순서(데이터 객체 → 요소 찾기 → 상태 변수 → 도우미 함수 → `createCard` → `getVisibleVideos` → `render` → 리스너 → `loadVideos`)를 지키며 Day 19~25에 걸쳐 채워요. 위치 고정:
  - Day 19: 머리 주석 → `categoryNames`·`thumbnails` → 주석 `// 지금 상태: 전체 영상` + `let allVideos = [ …6개… ];` → 확인 코드(파일 끝).
  - Day 20: `// 화면의 요소들을 미리 찾아 둬요 (Day 20)` 구역을 `thumbnails`와 `// 지금 상태` 주석 **사이**에 넣어요(그래서 `allVideos`는 요소 구역 아래). 도우미 함수·`createCard`·`render`는 `allVideos` 아래, 파일 끝은 `render();`.
  - Day 21: `filterBox`는 요소 구역 끝, `let selectedCategory = 'all';`은 `allVideos` 바로 아래, 상태 주석은 `// 지금 상태: 전체 영상, 선택한 카테고리`.
  - Day 23: `searchInput`·`countElement`·`emptyMessage`는 요소 구역 끝, `let searchText = '';`는 `selectedCategory` 아래, 상태 주석 `// 지금 상태: 전체 영상, 선택한 카테고리, 검색어`.
  - Day 25: `loadStatus`·`loadError`는 요소 구역 끝, `let isLoaded = false;`는 `allVideos` 바로 아래, 상태 주석은 레퍼런스 원문 `// 지금 상태: 전체 영상, 불러왔는지 여부, 선택한 카테고리, 검색어`.
  - 머리 주석: Day 19 "contents.js - 영상 목록 페이지 / 지금은 영상 데이터를 만들고 콘솔에서 살펴봐요" → Day 20 "영상 데이터로 카드를 그려요" → Day 23 "영상 데이터를 카드로 그리고, 카테고리 버튼과 검색창으로 걸러서 보여 줘요" → Day 25 레퍼런스 원문("data/videos.json을 불러와서(fetch) 카드로 그리고, …").
- JS는 템플릿 리터럴(Day 16)과 화살표 함수 콜백(Day 18)을 일관되게 써요. 설계서 3.1에 이름이 없는 메서드는 아래 Day에 처음 소개해요: `String()`·`Number()` Day 15, `classList.toggle`·`closest`·`dataset`·`setAttribute`·`querySelectorAll` Day 21, `matchMedia` Day 22, `trim`·`toLowerCase`·`includes`·`hidden` Day 23, `removeAttribute`·`getAttribute`·`classList.contains`·`focus`·`reset` Day 24, `Math.floor`·`padStart`·`split` Day 26, `URLSearchParams`·`clearInterval` Day 27.

## 1. 레퍼런스 파일 등장표

레퍼런스의 모든 파일이 Day 30까지 등장해요. "완성"은 그 Day가 끝나면 레퍼런스와 같아지는 Day예요(글 내용·예시 데이터 제외).

| 파일 | 처음 만드는 Day | 완성 Day |
|---|---|---|
| `index.html` | 3 | 28 |
| `about.html` | 4 | 28 |
| `contents.html` | 4 | 28 |
| `schedule.html` | 4 | 28 |
| `contact.html` | 4 | 28 |
| `images/profile.svg` | 5 | 5 |
| `images/logo.svg` | 6 | 6 |
| `css/style.css` | 9 | 28 |
| `images/thumb-game.svg`·`thumb-talk.svg`·`thumb-music.svg` | 12 | 12 |
| `js/main.js` | 15 | 25 |
| `js/contents.js` | 19 | 25 |
| `js/contact.js` | 24 | 24 |
| `data/videos.json` | 25 | 25 |
| `data/schedule.json` | 26 | 26 |
| `js/schedule.js` | 26 | 26 |
| `overlay/countdown.css`·`countdown.js` | 27 | 27 |
| `overlay/countdown.html` | 27 | 28 |
| `favicon.svg` | 28 | 28 |
| `README.md` | 29 | 30 (목차는 레퍼런스와 같고 글은 학습자 것 + 회고) |

Day 30 끝 상태의 프로젝트 파일은 레퍼런스와 같은 22개예요(`.git` 숨김 폴더 제외).

## 2. 중간 단계 요약 (레퍼런스와 다른 Day)

| Day | 중간 단계 | 바뀌는 Day |
|---|---|---|
| 3~13 | 색을 색상 코드로 직접 씀 | 14 |
| 4~5 | 메뉴가 `header`·`nav` 없이 `body` 맨 위의 `ul` | 6 |
| 11~12 | `.menu-list`가 가로 줄바꿈 목록, `.site-nav {margin-left: auto;}` | 13 |
| 13~20 | 좁은 화면에서도 메뉴 목록이 항상 보임(메뉴 버튼 없음) | 21 |
| 12~19 | `contents.html`에 정적 영상 카드 3장 | 20 |
| 15 | `main.js`에 확인용 `console.log` 한 줄 | 16 |
| 19 | 영상 데이터가 `contents.js` 안의 배열 + Console 확인 코드 | 20(확인 코드), 25(JSON) |
| 20~22 | `render()`가 필터 없이 전체를 그림 | 23 |
| 21~22 | 카테고리 위임 리스너 끝이 `console.log` | 23 |
| 23 | `render()`에 `isLoaded` 검사 없음, `#result-count`에 `aria-live` 없음 | 25, 24 |
| 22~24 | `getSavedTheme`·`saveTheme`에 `try/catch` 없음 | 25 |
| 27 | `overlay/countdown.html`에 파비콘 `<link>` 없음 | 28 |
| 3~27 | `<head>`에 설명·Open Graph·파비콘 없음, `index.html` 제목이 `달빛곰 방송국` | 28 |

## 3. 용어 배정표

각 용어는 정확히 한 Day가 담당해요(그 Day 본문에서 `**[[용어]]**(원어)` + 한 줄 정의). 정의 원문은 `textbook/content/glossary/p1.md`에 있어요. 다른 Day는 `[[용어]]` 링크만 걸 수 있어요. 여기에 없는 낱말은 쉬운 말로 풀어 쓰고, 꼭 필요하면 `glossary/<batch>-extra.md`에 추가하고 보고해요.

| Day | 담당 용어 |
|---|---|
| 1 | 인터넷, 웹, 브라우저, 서버, URL, 웹페이지, 웹사이트, HTML, 코드, 텍스트 편집기, 파일, 폴더, 확장자, 경로, UTF-8 |
| 2 | VS Code, 확장 프로그램, 명령 팔레트, 자동 저장, Live Preview |
| 3 | 태그, 요소, 속성, DOCTYPE, 주석, Emmet, 들여쓰기 |
| 4 | 링크, 절대 경로, 상대 경로, 목록, 대소문자 구분 |
| 5 | SVG, 대체 텍스트, 접근성, 스크린 리더, 상위 폴더 |
| 6 | 시맨틱 HTML, 블록 요소, 인라인 요소, 문자 참조, 개발자 도구 |
| 7 | 버전 관리, Git, GitHub, 저장소, 원격 저장소, 커밋, 스테이징, 푸시, 브랜치, 터미널, PowerShell |
| 8 | 표, 폼, 레이블, iframe, 임베드 |
| 9 | CSS, 선택자, 클래스, CSS 속성, 색상 코드, 캐시 |
| 10 | 박스 모델, margin, padding, border, box-sizing, px, rem, 자손 선택자 |
| 11 | Flexbox, 주축, 교차축, 속성 선택자, ARIA |
| 12 | Grid, fr, minmax, auto-fit |
| 13 | 반응형 웹, 뷰포트, 미디어 쿼리, 모바일 우선, 브레이크포인트 |
| 14 | CSS 변수, 의사 클래스, 트랜지션, 배포, GitHub Pages |
| 15 | JavaScript, 콘솔, 변수, 자료형, 문자열, 불리언, undefined, null, 연산자, NaN, defer |
| 16 | 조건문, 비교 연산자, 논리 연산자, 템플릿 리터럴, 삼항 연산자, Date |
| 17 | 배열, 인덱스, 반복문, for...of |
| 18 | 함수, 매개변수, 반환값, 화살표 함수, 스코프 |
| 19 | 객체, 키, 메서드, 콜백 함수, 배열 메서드 |
| 20 | DOM, querySelector, textContent, classList, createElement |
| 21 | 이벤트, 이벤트 리스너, 이벤트 위임, 햄버거 메뉴, data 속성, 복합 선택자 |
| 22 | 다크 모드, localStorage, prefers-color-scheme |
| 23 | input 이벤트, hidden 속성, 문자열 메서드 |
| 24 | 폼 검증, 정규 표현식, 제약 조건 검증 API, preventDefault, aria-live |
| 25 | JSON, fetch, 비동기, async 함수, await, try...catch |
| 26 | setInterval, 밀리초, 의사 요소 |
| 27 | 오버레이, OBS Studio, 브라우저 소스, URL 파라미터, URLSearchParams, vw, clamp |
| 28 | 건너뛰기 링크, SEO, Open Graph, 파비콘, 지연 로딩, Lighthouse |
| 29 | 버그, 디버깅, 중단점, Markdown, README |
| 30 | 회고 |

- 다른 프로젝트와 겹칠 수 있는 용어(P2에서 다시 다루는 것): 터미널·PowerShell(P2 Day 2), 브랜치(P2 Day 37), 비동기·async 함수·await·fetch(P2 Day 8), 배포(P2 Day 39), JSON(P2 Day 16). P1이 먼저 정의했으므로 P2는 링크만 걸어요. "출처(origin)", "포트", "상태 코드", "Promise"는 P1에서 용어로 정의하지 않고 쉬운 말로만 풀어요(P2가 담당).

## 4. Day별 개요

## Day 1 — 컴퓨터와 웹의 첫걸음 (90분)
- 목표: (이미 완성됨: `textbook/content/p1/day-01.md`) 인터넷·웹·브라우저·서버를 구분해 설명하기, 파일 탐색기에서 파일 확장명 켜기, `C:\dev\hello` 폴더 만들기, 메모장으로 `hello.html`을 UTF-8로 저장해 Edge로 열기, "고치기 → 저장(`Ctrl + S`) → 새로 고침(`F5`)" 해 보기.
- 이미 배운 것: 없음(첫날). Windows 11에서 마우스·키보드를 쓸 수 있다는 것만 가정해요.
- 시작 상태: 첫날이라 아무것도 없어요.
  - `C:\dev` 폴더도 없어요(오늘 만들어요).
  - 설치할 프로그램이 없어요. Windows 11의 파일 탐색기·메모장·Microsoft Edge만 써요.
- 오늘 만들/바꿀 파일:
  - `C:\dev\hello\hello.html` — 메모장으로 만든 첫 HTML(과제 1에서 자기소개 페이지로 바꿈). (레퍼런스 대응 없음, 연습 폴더)
  - `C:\dev\hello\favorites.html` — 과제 2, 좋아하는 것 3가지. (레퍼런스 대응 없음)
- 끝 상태 확인: 파일 탐색기에서 `hello.html`·`favorites.html`이 `.txt` 없이 보이고 아이콘이 브라우저 모양; 더블클릭하면 탭 제목·큰 제목·문단이 보이고 주소가 `file:///C:/dev/hello/…`.
- 과제: 1) 자기소개 페이지(탭 제목·h1·문단 3개) → 정답 요지: `<title>`은 `head`, 화면 글은 `body`, 문단마다 `<p>`. 2) `favorites.html` 혼자 만들기 + 확장자 질문 → 정답 요지: 확장자 `.html`이라 Windows가 브라우저로 연다.
- 용어(사전 담당): 인터넷, 웹, 브라우저, 서버, URL, 웹페이지, 웹사이트, HTML, 코드, 텍스트 편집기, 파일, 폴더, 확장자, 경로, UTF-8
- 자주 막히는 곳 후보: (본문에 있음) `hello.html.txt`, 다른 폴더에 저장, 메모장으로 다시 열기, 확장명 변경 경고, 대상 폴더 액세스 거부, `C:\`에 저장 권한 없음, 한글 깨짐, 저장·새로 고침 안 함, 한/영 상태.
- 레퍼런스 대응: 없음(연습 폴더 `C:\dev\hello`만 써요. 프로젝트 폴더는 Day 3부터).

## Day 2 — 개발 도구 설치 (100분)
- 목표:
  - **VS Code** 설치: 공식 사이트(`https://code.visualstudio.com/`)의 Windows **User setup**(관리자 권한 불필요). 마법사의 **추가 작업 선택**에서 "PATH에 추가(다시 시작한 후 사용 가능)"는 그대로 두고, 탐색기 상황 메뉴 "Code(으)로 열기" 두 항목을 체크해요(external-facts 2절 교재 반영 결정). Copilot CLI 페이지가 나오면 "Don't add the copilot command"를 골라요(별도 제품·구독). 버전은 고정하지 않고 최신을 설치하며, **도움말 → 정보**에서 버전을 확인하는 법을 보여 줘요(작성 기준일 2026-11).
  - 확장 프로그램 설치: 왼쪽 **확장** 아이콘(`Ctrl + Shift + X`)에서 한국어 팩 `MS-CEINTL.vscode-language-pack-ko`(설치 뒤 오른쪽 아래 알림의 다시 시작 버튼), **Live Preview** `ms-vscode.live-server`(Microsoft 제작인지 확인). 검색 결과에서 게시자 이름을 확인하는 습관.
  - Chrome 설치(`https://www.google.com/chrome/`). 기본 브라우저로 바꾸지 않아도 된다고 알려 줘요. Edge만 써도 교재를 따라갈 수 있어요.
  - VS Code로 폴더 열기: **파일 → 폴더 열기** → `C:\dev\hello` → "이 폴더에 있는 파일의 작성자를 신뢰합니까?" 창에서 신뢰(내가 만든 폴더라서). 왼쪽 **탐색기**에 `HELLO`와 파일 두 개가 보이는 것 확인.
  - VS Code에서 `hello.html` 열어 한 줄 고치기, 탭의 ●(저장 안 됨) 표시, `Ctrl + S` 저장, **파일 → 자동 저장** 켜기.
  - **명령 팔레트**(`Ctrl + Shift + P`) 열기 → `Live Preview: Show Preview` 실행(실기 미확인: 목록에 `(Internal Browser)`·`(External Browser)`가 붙은 명령이 따로 보일 수 있음 — 실제 목록을 확인해 쓰기), 편집기 오른쪽 위 미리 보기 아이콘으로도 열기. 미리 보기 창 주소 `http://127.0.0.1:3000/hello.html`(기본 포트 실기 미확인, 본문엔 "숫자는 달라도 돼요")의 뜻을 "내 컴퓨터 안에서 Live Preview가 작은 서버를 띄웠다"로만 설명해요(포트·localhost 용어는 P2).
  - 탐색기 사이드바의 **새 파일** 아이콘으로 `tools.html` 만들기(과제 1).
- 이미 배운 것: Day 1 파일·폴더·확장자·경로, `C:\dev\hello`, 브라우저, 서버(요청하면 파일을 보내 주는 컴퓨터), HTML 파일의 모양(맛보기), 고치기 → 저장 → 새로 고침, UTF-8.
- 시작 상태: (Day 1 끝 상태와 같아요)
  - 연습 폴더 `C:\dev\hello\`: `C:\dev\hello\hello.html`, `C:\dev\hello\favorites.html`
  - 파일 탐색기 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
- 오늘 만들/바꿀 파일:
  - `C:\dev\hello\hello.html` — VS Code로 `<p>` 문장 하나를 고쳐 Live Preview에 바로 반영되는 것 확인. (레퍼런스 대응 없음)
  - `C:\dev\hello\tools.html` — 과제 1: VS Code에서 새로 만든 파일. 탭 제목 `내 개발 도구`, `<h1>내 개발 도구</h1>`, 문단 3개(VS Code·Live Preview·Chrome이 각각 무엇인지 한 문장). Day 1과 같은 뼈대를 직접 타이핑(Emmet은 Day 3).
- 끝 상태 확인: VS Code 메뉴가 한국어(파일·편집·선택 영역…); 확장 화면에 Korean Language Pack과 Live Preview가 설치됨; VS Code 탐색기에 `hello.html`·`favorites.html`·`tools.html`; Live Preview 창에 `tools.html` 내용; **파일** 메뉴의 **자동 저장** 앞에 체크; Chrome이 설치되어 시작 메뉴에 있음.
- 과제: 1) `tools.html` 만들기(쉬움) → 정답 요지: 전체 코드 + "새 파일은 탐색기에서 이름을 `.html`까지 쳐서 만든다". 2) 명령 팔레트만으로 `favorites.html`을 Live Preview로 열기(보통) → 정답 요지: `favorites.html` 탭 선택 → `Ctrl + Shift + P` → `Live Preview: Show Preview`(명령 이름 실기 미확인, 변형 이름이 보이면 그 이름) → `Enter`. 3) (도전) 자동 저장을 끄고 고쳤을 때와 켜고 고쳤을 때 탭의 ● 표시 차이를 한 문장으로 → 정답 요지: 꺼져 있으면 저장 전까지 ●가 남고, 켜져 있으면 잠시 뒤 저절로 사라진다.
- 용어(사전 담당): VS Code, 확장 프로그램, 명령 팔레트, 자동 저장, Live Preview
- 자주 막히는 곳 후보: 설치 파일이 다운로드 폴더(OneDrive일 수 있음)에서 안 보임 → 브라우저 다운로드 목록(`Ctrl + J`)에서 열기; "Windows의 PC 보호"(SmartScreen)·사용자 계정 컨트롤 창이 뜸(게시자 Microsoft 확인 후 진행); System setup 파일을 받아 관리자 암호를 물음 → User setup으로 다시; 한국어 팩 설치 뒤에도 영어(다시 시작 안 함, 또는 명령 팔레트 `Configure Display Language`); 작업 영역 신뢰 창에서 "아니요"를 눌러 제한 모드가 됨; Live Preview 아이콘이 안 보임(HTML 파일 탭이 아님); **파일 → 열기**로 파일만 열어 탐색기에 폴더가 없음 → **폴더 열기**; Windows 방화벽 창이 뜨면 무엇인지(실기 미확인: Live Preview는 내 컴퓨터 안에서만 쓰는 서버라 뜨지 않는 경우가 많다고 추정, 뜨면 "개인 네트워크"만 허용); Chrome이 기본 브라우저 설정을 계속 물음(무시해도 됨); 노트북 `Fn` 키.
- 레퍼런스 대응: 없음(도구 설치 Day, 연습 폴더만 써요).

## Day 3 — HTML 기본 구조 (90분)
- 목표:
  - 파일 탐색기(또는 VS Code **폴더 열기** 창의 **새 폴더**)로 `C:\dev\my-creator-site` 폴더를 만들고 VS Code로 열기(작업 영역 신뢰). 이 폴더가 30일 동안 키울 프로젝트 폴더라고 알려 줘요.
  - VS Code 설정(`Ctrl + ,`)에서 `Editor: Tab Size`를 `2`로 바꾸기(레퍼런스와 같은 들여쓰기).
  - 새 파일 `index.html` → 첫 줄에 `!` 입력 → Emmet 제안에서 `Tab`(또는 `Enter`) → 뼈대 완성. Emmet이 만든 `lang="en"`을 `ko`로, `<title>Document</title>`를 `달빛곰 방송국`으로 바꾸기. Emmet 결과(`<!DOCTYPE html>`, `UTF-8`, `initial-scale=1.0`)와 교재 코드(`<!doctype html>`, `utf-8`, `initial-scale=1`)는 뜻이 같다고 설명(대소문자 무관, `1.0` = `1`).
  - **태그**·여는/닫는 태그·**요소**·**속성**(`이름="값"`)·내용이 없는 요소(`<meta>`)를 구별하기. `<!doctype html>`(DOCTYPE), `html`·`head`·`body`, `meta charset`, `title`, viewport 줄(뜻은 Day 13에서 배운다고 한 줄 예고).
  - 제목 `h1`~`h6`의 단계(페이지당 `h1` 하나, 단계 건너뛰지 않기), 문단 `p`, 주석 `<!-- -->`, 여러 칸 띄우기·줄바꿈이 화면에서 한 칸으로 합쳐지는 규칙, 들여쓰기는 사람을 위한 것.
  - Live Preview로 `index.html` 보기.
- 이미 배운 것: Day 1 HTML 맛보기(`<!DOCTYPE html>`~`<p>`), UTF-8, 고치기 → 저장 → 새로 고침, 파일·폴더 만들기; Day 2 VS Code 폴더 열기·새 파일·저장·자동 저장·명령 팔레트·Live Preview.
- 시작 상태: (Day 2 끝 상태와 같아요)
  - 연습 폴더 `C:\dev\hello\`: `C:\dev\hello\hello.html`, `C:\dev\hello\favorites.html`, `C:\dev\hello\tools.html`
  - 파일 탐색기 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
  - VS Code(한국어 팩, Live Preview 확장 프로그램)와 Chrome이 설치되어 있어요.
  - VS Code에서 `C:\dev\hello` 폴더를 열 수 있어요(어제 연 폴더).
- 오늘 만들/바꿀 파일:
  - `C:\dev\my-creator-site\index.html` — 새 파일. `<!doctype html>`, `<html lang="ko">`, `head`(charset `utf-8`, viewport, `<title>달빛곰 방송국</title>`), `body`: 주석 `<!-- 홈 페이지: 인사와 방송 소개 -->`, `<h1>안녕하세요, 달빛곰이에요!</h1>`, 소개 `<p>게임, 토크, 음악을 넘나드는 버라이어티 스트리머예요. 매주 월·수·금·토에 방송해요.</p>`, `<h2>이런 방송을 해요</h2>`, `<h3>게임 방송</h3>` + `<p>신작부터 레트로 게임까지, 시청자와 함께 즐겨요.</p>`, `<h3>토크 방송</h3>` + `<p>사연을 읽고 수다를 떨어요. 편하게 놀러 오세요.</p>`, `<h3>음악 방송</h3>` + `<p>기타를 치며 신청곡을 불러 드려요.</p>`. (레퍼런스 `index.html`의 h1·소개 문단·카드 h3·p와 같은 글)
- 끝 상태 확인: Live Preview에 큰 제목, 소개 문장, 중간 제목 "이런 방송을 해요", 작은 제목 3개와 문장 3개; 탭 제목 `달빛곰 방송국`; 주석 글자는 화면에 안 보임; 파일 탐색기 `C:\dev\my-creator-site`에 `index.html` 하나.
- 과제: 1) 고장 난 HTML 고치기(쉬움): 닫는 `</h1>` 빠짐·속성 따옴표 빠짐·`<titel>` 철자가 섞인 짧은 코드(교재에 실음)의 문제 3개 찾기 → 정답 요지: 각 줄의 고친 모양과 화면이 어떻게 깨지는지. 2) 제목 단계 점검(보통): `index.html`의 h1·h2·h3 구조를 들여 쓴 목록으로 그려 보기 → 정답 요지: h1 하나 아래 h2 하나, 그 아래 h3 세 개. 파일은 바뀌지 않아요.
- 용어(사전 담당): 태그, 요소, 속성, DOCTYPE, 주석, Emmet, 들여쓰기
- 자주 막히는 곳 후보: `!`를 쳐도 Emmet 제안이 안 뜸(파일을 아직 `.html`로 저장하지 않아 오른쪽 아래 언어 모드가 "일반 텍스트" → 저장하거나 언어 모드 클릭 → HTML); 한글 입력 상태로 `!` 뒤 글자가 한글; 제안 목록을 놓침(`Ctrl + Space`로 다시); `index.html`을 `C:\dev\hello`에 만듦(VS Code 탐색기 맨 위 폴더 이름 확인, **파일 → 폴더 열기**로 바꾸기); 닫는 태그를 빠뜨려 아래 글이 모두 큰 제목; Edge가 "이 페이지를 번역하시겠습니까?"를 물음(`lang="en"`을 안 바꿈); Tab Size를 바꿨는데 기존 줄은 그대로(새로 Emmet 하면 2칸); 들여쓰기를 탭 문자로 넣음.
- 레퍼런스 대응: `index.html`의 `<head>` 기본(charset·viewport), `<h1>`, 소개 `<p>`, "이런 방송을 해요"의 h2·h3·p 글. 중간 단계 — 레퍼런스와 다름: 메뉴·이미지·시맨틱 구조·class 없음(Day 4·5·6·9~12에서 추가), 제목이 `달빛곰 방송국`(Day 28에 `달빛곰 방송국 - 게임·토크·음악 스트리머`).

## Day 4 — 텍스트·목록·링크 (100분)
- 목표:
  - 의미 강조 `strong`(중요)·`em`(강조)과 모양만 바꾸는 `b`·`i`의 차이.
  - 목록: 순서 없는 `ul`, 순서 있는 `ol`, 항목 `li`.
  - 링크 `<a href="…">글자</a>`. **절대 경로**(`https://…`, 어디서 눌러도 같은 곳)와 **상대 경로**(`about.html`, 지금 파일이 있는 폴더 기준)의 차이를 `text` 그림으로. 내 컴퓨터 경로(`C:\dev\…`)를 `href`에 쓰면 배포 뒤 깨진다는 것, `href`에는 `\`가 아니라 `/`를 쓴다는 것.
  - 파일 이름 규칙 예고: 웹 서버는 **대소문자를 구분**(`About.html` ≠ `about.html`)하고 Windows는 구분하지 않아서, 내 컴퓨터에서 되던 링크가 Day 14 배포 뒤 깨질 수 있다는 것. 공백·한글 파일 이름을 쓰지 않는 이유(`%20`).
  - 페이지 4개 더 만들기: VS Code 탐색기에서 `index.html` 오른쪽 클릭 → **복사** → 빈 곳 **붙여넣기**로 생긴 `index copy.html`을 `F2`로 이름 바꾸기, 또는 새 파일 + Emmet `!`. 각 파일의 `<title>`을 레퍼런스 형식으로.
  - 다섯 페이지 맨 위에 같은 메뉴(`ul` 안에 링크 5개)를 붙이고 서로 오가기.
- 이미 배운 것: Day 3 태그·요소·속성·주석·Emmet·h1~h3·p·들여쓰기, `index.html`; Day 2 VS Code 탐색기·새 파일·Live Preview; Day 1 경로·확장자·폴더 구조.
- 시작 상태: (Day 3 끝 상태와 같아요)
  - 프로젝트 `C:\dev\my-creator-site\`:
    - `C:\dev\my-creator-site\index.html`
  - 연습 폴더 `C:\dev\hello\`: `C:\dev\hello\hello.html`, `C:\dev\hello\favorites.html`, `C:\dev\hello\tools.html`
  - 파일 탐색기 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
  - VS Code(한국어 팩, Live Preview 확장 프로그램)와 Chrome이 설치되어 있어요.
  - VS Code에서 `C:\dev\my-creator-site` 폴더를 열어 두면 바로 시작할 수 있어요.
- 오늘 만들/바꿀 파일:
  - `C:\dev\my-creator-site\index.html` — `body` 맨 앞에 메뉴 `ul`: `홈`(index.html)·`소개`(about.html)·`영상`(contents.html)·`방송 일정`(schedule.html)·`문의`(contact.html). (레퍼런스 `.menu-list`의 글자·href와 같음)
  - `C:\dev\my-creator-site\about.html` — 새 파일. `<title>소개 - 달빛곰 방송국</title>`, 메뉴 `ul`, `<h1>달빛곰을 소개해요</h1>`, 문단 2개(첫 문단에 `<strong>달빛곰</strong>`과 `<em>버라이어티 스트리머</em>` — 레퍼런스 문장), `<h2>어떤 방송을 하나요?</h2>` + `ul` 3개(`<li><strong>게임</strong>: …`), `<h2>방송 규칙</h2>` + `ol` 3개. 과제 1에서 `<h2>함께해요</h2>` + 문단(링크 2개) 추가.
  - `C:\dev\my-creator-site\contents.html` — 새 파일. `<title>영상 모아보기 - 달빛곰 방송국</title>`, 메뉴, `<h1>영상 모아보기</h1>`, `<p>지난 방송 영상을 모아 두는 페이지예요.</p>`.
  - `C:\dev\my-creator-site\schedule.html` — 새 파일. `<title>방송 일정 - 달빛곰 방송국</title>`, 메뉴, `<h1>방송 일정</h1>`, `<p>매주 방송하는 요일과 시간을 알려 드려요.</p>`.
  - `C:\dev\my-creator-site\contact.html` — 새 파일. `<title>문의하기 - 달빛곰 방송국</title>`, 메뉴, `<h1>문의하기</h1>`, `<p>협업 제안이나 궁금한 점을 남겨 주세요.</p>`.
  - `C:\dev\hello\links.html` — 과제 2(연습): 절대 경로 링크 2개(`https://developer.mozilla.org/ko/`, `https://www.youtube.com/`)와 상대 경로 링크 2개(`hello.html`, `favorites.html`).
- 끝 상태 확인: 다섯 페이지 어디서든 메뉴 링크 5개로 다른 페이지가 열림; 탭 제목이 페이지마다 다름; 소개 페이지에 점 목록 3개와 번호 목록 1~3, "달빛곰"이 굵게; "함께해요"의 두 링크가 일정·문의 페이지로 감; `links.html`의 MDN·YouTube 링크는 인터넷 연결 시 열림.
- 과제: 1) "함께해요" 문단(쉬움): `<p>방송 시간은 <a href="schedule.html">방송 일정</a>에서 확인하고, 협업이나 궁금한 점은 <a href="contact.html">문의 페이지</a>로 보내 주세요.</p>` → 정답 요지: 같은 폴더라 파일 이름만 쓰는 상대 경로. 2) `links.html`(보통) → 정답 요지: 전체 코드 + "인터넷 주소는 절대 경로, 내 파일끼리는 상대 경로". 3) (도전) 링크 퀴즈: `href="C:\dev\my-creator-site\about.html"`, `href="About.html"`, `href="about"` 중 배포 뒤에도 되는 것이 없는 이유 → 정답 요지: 내 컴퓨터 전용 경로, 대소문자, 확장자 빠짐.
- 용어(사전 담당): 링크, 절대 경로, 상대 경로, 목록, 대소문자 구분
- 자주 막히는 곳 후보: 링크를 누르면 "파일을 찾을 수 없음"/Live Preview의 찾을 수 없음 화면(파일 이름 오타, `.html` 빠짐, 아직 안 만든 파일); 복사한 파일 이름이 `index copy.html`로 남음; 이름을 바꿨는데 탭이 옛 이름(VS Code는 탐색기 이름 바꾸기를 따라가요 — 메모장과 다른 점을 짚기); 따옴표를 하나만 닫음; 한글 파일 이름(`소개.html`)을 만듦; `\`를 씀; 메뉴를 한 페이지에만 붙임; `strong` 대신 `b`.
- 레퍼런스 대응: `about.html`의 `<h1>`·소개 문단(strong/em)·두 목록·"함께해요" 문단; 다섯 파일의 메뉴 글자·href; `about`·`contents`·`schedule`·`contact`의 `<title>`(완성). 중간 단계 — 레퍼런스와 다름: 메뉴가 `header`·`nav` 없이 `body` 맨 위 `ul`(Day 6에서 `header`·`nav`, Day 11에서 class·`aria-current`), `contents`·`schedule`·`contact` 본문은 임시 문장(Day 8·20~26에서 채움). `links.html`은 연습 파일.

## Day 5 — 이미지와 경로 완전정복 (90분)
- 목표:
  - VS Code 탐색기의 **새 폴더**로 `images` 폴더 만들기, 그 안에 새 파일 `profile.svg`를 만들어 교재의 SVG 코드(레퍼런스 `images/profile.svg` 원문)를 붙여 넣기. **SVG**는 글자(코드)로 그린 그림이라 메모장·VS Code로 열린다는 것.
  - `<img src="…" alt="…" width="…" height="…">`: 닫는 태그가 없는 요소, `src`는 상대 경로, `width`·`height`는 그림 자리를 미리 잡음.
  - **대체 텍스트** 쓰는 법(그림이 전하는 내용을 짧게, "이미지"라는 말은 빼기), 그림을 못 보는 사람이 **스크린 리더**로 듣는다는 것 → **접근성**의 첫 만남. 장식 그림의 빈 `alt=""`는 Day 6 로고에서.
  - 경로 완전정복: `images/profile.svg` = `./images/profile.svg`(`./`는 지금 폴더), **상위 폴더** `../`(한 칸 위), `../../`(두 칸 위). `text` 그림으로 `C:\dev` 아래 트리를 그려 경로를 따라가 보기.
  - 파일 이름 규칙: 영어 소문자·숫자·`-`만, 공백·한글·대문자 금지(Day 4 복습 + 그림 파일).
  - 이미지 형식: JPG(사진), PNG(투명 배경·선명한 그림), GIF(움직이는 그림), SVG(아이콘·로고, 커져도 선명), WebP(작은 용량). 휴대폰 사진의 HEIC는 브라우저에서 안 보일 수 있다는 것.
  - 내 사진을 쓰고 싶으면 `C:\dev\my-creator-site\images\profile.jpg`처럼 넣고 `src`만 바꾸는 법(팁). 교재 코드는 `profile.svg` 그대로 써요.
- 이미 배운 것: Day 4 상대 경로·절대 경로·대소문자 구분·파일 이름 규칙(예고); Day 3 속성·요소; Day 2 VS Code 탐색기(새 파일); Day 1 경로·확장자·폴더 트리.
- 시작 상태: (Day 4 끝 상태와 같아요)
  - 프로젝트 `C:\dev\my-creator-site\`:
    - `C:\dev\my-creator-site\index.html`
    - `C:\dev\my-creator-site\about.html`
    - `C:\dev\my-creator-site\contents.html`
    - `C:\dev\my-creator-site\schedule.html`
    - `C:\dev\my-creator-site\contact.html`
  - 연습 폴더 `C:\dev\hello\`: `C:\dev\hello\hello.html`, `C:\dev\hello\favorites.html`, `C:\dev\hello\tools.html`, `C:\dev\hello\links.html`
  - 파일 탐색기 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
  - VS Code(한국어 팩, Live Preview 확장 프로그램)와 Chrome이 설치되어 있어요.
  - VS Code에서 `C:\dev\my-creator-site` 폴더를 열어 두면 바로 시작할 수 있어요.
- 오늘 만들/바꿀 파일:
  - `C:\dev\my-creator-site\images\profile.svg` — 레퍼런스 원문 그대로(곰 캐릭터, 20줄).
  - `C:\dev\my-creator-site\index.html` — `<h1>` 바로 위에 `<img src="images/profile.svg" alt="헤드셋을 쓴 곰 캐릭터, 달빛곰" width="240" height="240">`.
  - `C:\dev\my-creator-site\about.html` — 과제 1: `<h1>` 바로 아래에 같은 `img` 한 줄.
  - `C:\dev\hello\pages\back.html` — 과제 2(연습): `pages` 폴더 안 파일. `<a href="../hello.html">`, `<a href="../favorites.html">`, `<img src="../../my-creator-site/images/profile.svg" alt="헤드셋을 쓴 곰 캐릭터, 달빛곰" width="120" height="120">`.
- 끝 상태 확인: 홈과 소개 페이지에 곰 그림(240×240)이 보임; 일부러 `src`를 틀리면 깨진 그림 표시와 `alt` 글자가 보이는 것을 확인한 뒤 되돌림; `back.html`에서 링크 2개와 작은 곰 그림이 보임.
- 과제: 1) 소개 페이지에 그림 넣기(쉬움) → 정답 요지: 같은 `img` 줄, 같은 폴더라 경로도 같음. 2) `back.html`(보통) → 정답 요지: 전체 코드 + `../`를 한 번 쓸 때마다 한 칸 위로 올라가는 경로 분해 그림. 3) (도전) 파일 이름 고르기: `My Photo.JPG`, `프로필.png`, `profile-2026.png`, `thumb_game.svg` 중 규칙에 맞는 것 → 정답 요지: `profile-2026.png`만 완전히 맞음(밑줄은 동작하지만 교재 규칙은 `-`).
- 용어(사전 담당): SVG, 대체 텍스트, 접근성, 스크린 리더, 상위 폴더
- 자주 막히는 곳 후보: 깨진 그림(경로 오타, `images` 폴더를 `C:\dev\hello`에 만듦, `profile.svg`가 `images` 밖에 있음, `Profile.SVG` 대소문자 — 내 컴퓨터에선 되지만 배포 뒤 깨짐); SVG 코드를 붙였는데 그림 대신 글자가 보임(파일 이름이 `profile.svg.html`이나 `profile.txt`); 휴대폰 사진(HEIC)이 안 보임; OneDrive "온라인 전용" 사진을 복사해 0바이트; 그림이 너무 큼(width·height 빠짐); `src`에 `C:\…` 전체 경로; SVG 파일을 더블클릭하면 다른 앱이 열림(정상); `../` 개수 세기 실수.
- 레퍼런스 대응: `images/profile.svg`(완성), `index.html` `.hero-image`와 `about.html` `.about-image` 그림의 `src`·`alt`·`width`·`height`. 중간 단계 — 레퍼런스와 다름: 그림이 h1 위/아래에 그냥 놓여 있음(Day 6에서 `section`·`div`로 감싸고 Day 10에서 class). `back.html`은 연습 파일.

## Day 6 — 시맨틱 구조 (90분)
- 목표:
  - **시맨틱 HTML**: `header`(머리글), `nav`(메뉴), `main`(본문, 페이지에 하나), `section`(제목이 있는 구역), `article`(혼자서도 뜻이 통하는 덩어리 — 방송 소개 카드), `footer`(바닥글). 왜 쓰는지: 스크린 리더·검색 엔진·나중의 CSS가 구조를 알아봄.
  - 의미 없는 상자 `div`(**블록 요소**: 한 줄을 다 차지)와 `span`(**인라인 요소**: 글자 사이에 끼움). 시맨틱 태그가 맞지 않을 때만 씀.
  - 로고: 새 파일 `images\logo.svg`(레퍼런스 원문) + `<a href="index.html"><img src="images/logo.svg" alt="" width="36" height="36"><span>달빛곰 방송국</span></a>`. 바로 옆에 글자가 있어서 그림은 장식 → `alt=""`(Day 5 대체 텍스트 복습).
  - **문자 참조** `&copy;`(©) — 바닥글 `<p>&copy; 2026 달빛곰 방송국 · 연습용으로 만든 사이트예요.</p>`. `&lt;`·`&gt;`·`&amp;`도 소개.
  - 개발자 도구를 쓰려면 페이지를 **브라우저**에서 열어요(0.2절 규칙: 더블클릭으로 열거나, Live Preview 주소를 Edge 주소창에 붙여 넣기 — VS Code 안 미리 보기 창에서는 `F12`가 안 됨).
  - **개발자 도구** 열기(`F12`, `Ctrl + Shift + I`, 오른쪽 클릭 → **검사**) → **Elements** 패널(한국어 화면은 **요소**일 수 있음): 접고 펼치기, 왼쪽 위 요소 선택 도구, 마우스를 올리면 화면에 영역 표시, 글자를 더블클릭해 고쳐 보기(새로 고침하면 사라짐 = 파일이 아니라 화면만 바뀜).
  - 다섯 페이지를 같은 뼈대(`header` → `main` → `footer`)로 바꾸기. 따라하기는 `index.html`·`about.html`, 과제 1은 나머지 세 페이지.
- 이미 배운 것: Day 3 요소·주석·h1~h3; Day 4 목록·링크·메뉴 `ul`·다섯 페이지; Day 5 `img`·대체 텍스트·SVG 파일 만들기·스크린 리더.
- 시작 상태: (Day 5 끝 상태와 같아요)
  - 프로젝트 `C:\dev\my-creator-site\`:
    - `C:\dev\my-creator-site\index.html`
    - `C:\dev\my-creator-site\about.html`
    - `C:\dev\my-creator-site\contents.html`
    - `C:\dev\my-creator-site\schedule.html`
    - `C:\dev\my-creator-site\contact.html`
    - `C:\dev\my-creator-site\images\profile.svg`
  - 연습 폴더 `C:\dev\hello\`: `C:\dev\hello\hello.html`, `C:\dev\hello\favorites.html`, `C:\dev\hello\tools.html`, `C:\dev\hello\links.html`, `C:\dev\hello\pages\back.html`
  - 파일 탐색기 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
  - VS Code(한국어 팩, Live Preview 확장 프로그램)와 Chrome이 설치되어 있어요.
  - VS Code에서 `C:\dev\my-creator-site` 폴더를 열어 두면 바로 시작할 수 있어요.
- 오늘 만들/바꿀 파일:
  - `C:\dev\my-creator-site\images\logo.svg` — 레퍼런스 원문 그대로(초승달 로고, 6줄).
  - 다섯 페이지 공통 — `body` = `<header>`(로고 링크 + `<nav>` 안에 Day 4 메뉴 `ul`) → `<main>` → `<footer>`(`<p>&copy; 2026 달빛곰 방송국 · 연습용으로 만든 사이트예요.</p>`).
  - `C:\dev\my-creator-site\index.html` — `main` 안: 첫 `<section>`(Day 5 곰 `img` + `<div>`(h1, 소개 p)), 둘째 `<section>`(`<h2>이런 방송을 해요</h2>` + `<article>` 3개, 각각 h3 + p). Day 3의 주석 `<!-- 홈 페이지: 인사와 방송 소개 -->`는 레퍼런스에 없어서 오늘 지워요.
  - `C:\dev\my-creator-site\about.html` — `main` 안: h1, `<section>`(img + `<div>`(p, p)), `<section>`(h2 어떤 방송을 하나요? + ul), `<section>`(h2 방송 규칙 + ol), `<section>`(h2 함께해요 + p).
  - `C:\dev\my-creator-site\contents.html`·`schedule.html`·`contact.html` — 과제 1: `header`·`footer` 같게, `main` 안에 h1 + p.
- 끝 상태 확인: 화면 모양은 거의 그대로이고 맨 위에 작은 초승달 로고와 "달빛곰 방송국"이 보임; 맨 아래 `© 2026 …` 문장; 개발자 도구 Elements에서 `header`·`main`·`footer`를 접으면 세 줄만 남음; 다섯 페이지 모두 같은 머리글·바닥글.
- 과제: 1) 나머지 세 페이지 뼈대(보통) → 정답 요지: 세 파일 전체 코드(머리글·바닥글 복사, `main` 안만 다름). 2) Elements 퀴즈(쉬움): "소개 페이지의 `ol`은 어느 요소 안에 있나요?", "로고 글자 `span`의 부모는?" → 정답 요지: `main > section > ol`, `header > a > span`. 3) (도전) `div`와 `section` 고르기: 4가지 상황(제목 있는 구역, 그림과 글을 나란히 묶기만, 글자 일부 색 바꾸기, 메뉴) → 정답 요지: section, div, span, nav.
- 용어(사전 담당): 시맨틱 HTML, 블록 요소, 인라인 요소, 문자 참조, 개발자 도구
- 자주 막히는 곳 후보: `F12`가 안 열림(노트북 `Fn + F12`, 또는 `Ctrl + Shift + I`, 오른쪽 클릭 → 검사); Edge에서 처음 `F12`를 누르면 개발자 도구를 열지 묻는 창(실기 미확인 — 문구는 버전에 따라 다를 수 있음); 개발자 도구가 영어(정상, 영어 이름 Elements 병기); Elements에서 고친 글자가 새로 고침하면 사라짐(정상); 붙여 넣다가 `</header>`나 `</section>`을 빠뜨려 구조가 꼬임(Elements에서 들여쓰기로 확인); `main`을 두 번 씀; 로고가 매우 큼(width·height 빠짐); `&copy`에서 `;` 빠뜨림.
- 레퍼런스 대응: 다섯 페이지의 `header`/`nav`/`main`/`footer` 뼈대와 로고 링크(`img alt=""` + `span`), `index.html`의 두 section(hero·이런 방송을 해요), `about.html`의 네 section, footer 문장, `images/logo.svg`(완성). 중간 단계 — 레퍼런스와 다름: class·id·aria 속성, 메뉴 버튼·테마 버튼, 대표 영상 section, `.container` 상자 없음(Day 8·10·11·21·22·28에서 추가).

## Day 7 — Git·GitHub 시작 (120분)
- 목표:
  - **버전 관리**가 왜 필요한지(저장 시점 기록, 되돌리기, 인터넷 백업, Day 14 배포의 준비).
  - Git for Windows 설치(작성 기준 `Git-2.56.0.4-64-bit.exe`, `https://git-scm.com/`): **VS Code를 먼저 설치한 뒤** 설치, 편집기 화면에서 "Use Visual Studio Code as Git's default editor", 초기 브랜치 화면에서 "Override the default branch name for new repositories" → `main`, 나머지는 기본값(줄 끝 처리 "Checkout Windows-style, commit Unix-style"을 유지하는 이유 한 줄). 화면 문구가 조금 달라도 같은 위치의 선택지를 고르라는 `:::info`(external-facts 3절).
  - VS Code를 완전히 닫았다 다시 열고 **터미널 → 새 터미널**(`` Ctrl + Shift + ` ``; `` Ctrl + ` ``는 터미널 패널을 보였다 숨겼다 하는 키) — **터미널**과 **PowerShell**을 최소한으로: 프롬프트 `PS C:\dev\my-creator-site>` 읽기(지금 위치), 명령 붙여 넣기(`Ctrl + V` 또는 오른쪽 클릭), `Enter`. 터미널 오른쪽 위 `∨`에서 PowerShell을 고르는 법. 위치가 프로젝트 폴더가 아니면 `cd C:\dev\my-creator-site`(cd = 지금 위치 바꾸기) 한 줄로 옮기는 법. 터미널 기초는 P2 Day 2에서 제대로 배운다고 예고.
  - `git --version`(예상 `git version 2.56.0.windows.4`, 숫자는 달라도 돼요), `git config --global user.name "내 이름"`, `git config --global user.email "내 이메일"`, `git config --global --list`로 확인. 이 이메일이 공개 커밋에 남는다는 것과 GitHub의 noreply 이메일을 쓰는 선택(팁, 화면 위치는 GitHub **Settings → Emails**, 실기 미확인 표시).
  - GitHub 가입(`https://github.com/`): 이메일 인증 코드, 아이디는 영어 소문자 권장(배포 주소에 들어감). 새 저장소: 오른쪽 위 **+** → **New repository** → 이름 `my-creator-site` → **Public**(무료 계정의 GitHub Pages는 공개 저장소만, external-facts 4절) → README·.gitignore·license는 추가하지 않음 → **Create repository**.
  - 로컬 저장소 만들고 올리기(VS Code 터미널, 위치 `C:\dev\my-creator-site`): `git init` → `git status` → `git add .`(**스테이징**) → `git status` → `git commit -m "Day 1~6: 첫 페이지들"`(**커밋**) → `git branch -M main` → `git remote add origin https://github.com/<내 아이디>/my-creator-site.git`(**원격 저장소**) → `git push -u origin main`(**푸시**). 첫 푸시 때 Git Credential Manager가 브라우저 로그인 창을 띄우는 흐름(실기 미확인 표시).
  - `git log --oneline`으로 기록 보기, GitHub 저장소 페이지 새로 고침 → 파일 보임.
  - VS Code **소스 제어** 패널(`Ctrl + Shift + G`): 바뀐 파일 목록, 메시지 칸, **커밋**, **변경 내용 동기화**(푸시). Day 8부터 매일 이 방법을 쓴다고 알려 줘요.
  - 숨김 폴더 `.git`(파일 탐색기 **보기 → 표시 → 숨긴 항목**으로 보기) — 지우면 기록이 사라진다는 `:::warn`.
- 이미 배운 것: Day 2 VS Code(폴더 열기·명령 팔레트·탐색기); Day 1 경로·폴더·서버·URL; Day 3~6 프로젝트 파일 7개(`index`·`about`·`contents`·`schedule`·`contact`.html, `images\profile.svg`, `images\logo.svg`); Day 4 절대 경로(`https://…`).
- 시작 상태: (Day 6 끝 상태와 같아요)
  - 프로젝트 `C:\dev\my-creator-site\`:
    - `C:\dev\my-creator-site\index.html`
    - `C:\dev\my-creator-site\about.html`
    - `C:\dev\my-creator-site\contents.html`
    - `C:\dev\my-creator-site\schedule.html`
    - `C:\dev\my-creator-site\contact.html`
    - `C:\dev\my-creator-site\images\profile.svg`
    - `C:\dev\my-creator-site\images\logo.svg`
  - 연습 폴더 `C:\dev\hello\`: `C:\dev\hello\hello.html`, `C:\dev\hello\favorites.html`, `C:\dev\hello\tools.html`, `C:\dev\hello\links.html`, `C:\dev\hello\pages\back.html`
  - 파일 탐색기 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
  - VS Code(한국어 팩, Live Preview 확장 프로그램)와 Chrome이 설치되어 있어요.
  - VS Code에서 `C:\dev\my-creator-site` 폴더를 열어 두면 바로 시작할 수 있어요.
- 오늘 만들/바꿀 파일:
  - `C:\dev\my-creator-site\.git\` — `git init`이 만드는 숨김 폴더(직접 고치지 않음).
  - `C:\dev\my-creator-site\about.html` — 과제 1: 첫 문단 소개 문장을 내 이야기로 바꾸고 두 번째 커밋(글 내용만 바뀜, 구조 그대로).
  - GitHub 원격 저장소 `https://github.com/<내 아이디>/my-creator-site`(Public).
- 끝 상태 확인: 터미널 `git status` → `nothing to commit, working tree clean`; `git log --oneline`에 커밋 2줄; GitHub 저장소 페이지에 `images` 폴더와 HTML 5개, 커밋 수 2; 소스 제어 패널에 변경 0개.
- 과제: 1) 소스 제어 패널로 두 번째 커밋·푸시(쉬움) → 정답 요지: 파일 고침 → 패널에 `M` 표시 → 메시지 `Day 7: 소개 문장 바꾸기` → 커밋 → 변경 내용 동기화 → GitHub에서 커밋 2개 확인. 2) `git log --oneline` 읽기(보통): 출력 한 줄의 앞 7글자와 뒤 글자가 무엇인지 → 정답 요지: 커밋 번호(해시 앞부분)와 메시지, 맨 위가 최신. 3) (도전) `git status` 출력 세 가지(`Untracked files`, `Changes not staged for commit`, `Changes to be committed`)를 각각 언제 보는지 → 정답 요지: 새 파일, 고쳤지만 add 전, add 뒤 커밋 전.
- 용어(사전 담당): 버전 관리, Git, GitHub, 저장소, 원격 저장소, 커밋, 스테이징, 푸시, 브랜치, 터미널, PowerShell
- 자주 막히는 곳 후보: `git : The term 'git' is not recognized as the name of a cmdlet, function, script file, or operable program.`(한국어 Windows는 "'git' 용어가 cmdlet, 함수, 스크립트 파일 또는 실행할 수 있는 프로그램 이름으로 인식되지 않습니다." — 실측 원문 필요; 원인: 설치 전에 연 터미널 → VS Code를 완전히 닫았다 열기); 설치 마법사 편집기 목록에 VS Code가 없음(VS Code 미설치 → 일단 기본값으로 두고 나중에 `git config --global core.editor "code --wait"`); `Author identity unknown *** Please tell me who you are.`(config 안 함); `fatal: not a git repository (or any of the parent directories): .git`(터미널 위치가 다름 → 프롬프트 확인, `cd C:\dev\my-creator-site`); `error: src refspec main does not match any`(커밋 없이 푸시); `error: remote origin already exists.`; `! [rejected] main -> main (fetch first)`(GitHub에서 README를 추가해 만든 저장소); 브라우저 로그인 창이 안 뜨거나 다른 계정으로 로그인; 인증 메일이 스팸함에; `-m` 없이 `git commit`을 쳐서 VS Code에 `COMMIT_EDITMSG` 탭이 열림(메시지 쓰고 저장 후 탭 닫기); `warning: in the working copy of '…', LF will be replaced by CRLF the next time Git touches it`(무시해도 되는 안내, 원문 실측); 터미널이 PowerShell이 아니라 cmd·Git Bash; `git add.`(띄어쓰기 빠짐); 사용자 이름에 한글이 있는 Windows 계정(`C:\Users\홍길동`)도 괜찮다는 안심; `.git` 폴더를 실수로 지움; 사용자 계정 컨트롤 창; 백신 검사로 설치가 느림.
- 레퍼런스 대응: 해당 파일 없음(Git 저장소 설정 Day). 저장소 이름 `my-creator-site`가 Day 14 배포 주소 `https://<내 아이디>.github.io/my-creator-site/`가 돼요.

## Day 8 — 표·폼·미디어 (100분)
- 목표:
  - **표**: `table`, 제목 `caption`, 머리 `thead`·몸통 `tbody`, 행 `tr`, 머리글 칸 `th`(`scope="col"`·`scope="row"`), 데이터 칸 `td`. 표는 "줄과 칸이 있는 자료"에만 쓰고 배치용으로 쓰지 않음. 테두리는 CSS(Day 10)에서.
  - **폼**: `form`, **레이블** `<label for="name">`과 `<input id="name">` 연결(글자를 눌러도 칸에 커서), `input`의 `type`(`text`·`email`), `name`(보낼 때 붙는 이름), `autocomplete`(브라우저 자동 완성), `select`/`option`(`value`), `textarea`(`rows`), `<button type="submit">`. 지금은 보내기를 누르면 주소 뒤에 `?name=…`이 붙고 칸이 비워지는 것이 정상이라는 것(Day 24에서 막음). `type="email"`의 기본 검사 말풍선.
  - **iframe**으로 YouTube **임베드**: YouTube 영상 → **공유 → 퍼가기** → 코드 복사 → 교재는 꼭 필요한 속성만 남김(`src`, `title`, `referrerpolicy`, `allowfullscreen`). 예시 ID `aqz-KE-bpKQ`를 내 영상의 `watch?v=` 뒤 11글자로 바꾸는 법. `file://`로 열면 재생되지 않을 수 있어 Live Preview로 확인하고, 그래도 안 되면 Day 14 배포 주소에서 확인한다는 것(실기 미확인).
  - 오늘부터 끝 단계에서 소스 제어 패널로 커밋·푸시(0.3절).
- 이미 배운 것: Day 3 속성; Day 4 목록·링크·절대 경로; Day 6 `main`·`section`·`h2`; Day 7 커밋·푸시·소스 제어 패널.
- 시작 상태: (Day 7 끝 상태와 같아요)
  - 프로젝트 `C:\dev\my-creator-site\`:
    - `C:\dev\my-creator-site\index.html`
    - `C:\dev\my-creator-site\about.html`
    - `C:\dev\my-creator-site\contents.html`
    - `C:\dev\my-creator-site\schedule.html`
    - `C:\dev\my-creator-site\contact.html`
    - `C:\dev\my-creator-site\images\profile.svg`
    - `C:\dev\my-creator-site\images\logo.svg`
  - 연습 폴더 `C:\dev\hello\`: `C:\dev\hello\hello.html`, `C:\dev\hello\favorites.html`, `C:\dev\hello\tools.html`, `C:\dev\hello\links.html`, `C:\dev\hello\pages\back.html`
  - 파일 탐색기 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
  - VS Code(한국어 팩, Live Preview 확장 프로그램)와 Chrome이 설치되어 있어요.
  - Git이 설치되어 있고(`git --version` → `git version 2.56.0.windows.4`, 숫자는 달라도 돼요) `git config --global user.name`·`user.email`이 설정되어 있어요.
  - GitHub 계정과 공개(Public) 원격 저장소 `https://github.com/<내 아이디>/my-creator-site`가 있고, 로컬 저장소(`C:\dev\my-creator-site\.git\`, 숨김 폴더)와 연결되어 있어요.
  - 오늘까지의 변경이 모두 커밋·푸시되어 있어요(VS Code 소스 제어 패널의 변경 0개).
  - VS Code에서 `C:\dev\my-creator-site` 폴더를 열어 두면 바로 시작할 수 있어요.
- 오늘 만들/바꿀 파일:
  - `C:\dev\my-creator-site\schedule.html` — `main`의 임시 문장을 `<p>모든 시간은 한국 시간이에요.</p>`로 바꾸고 표 추가: `<caption>주간 방송 일정</caption>`, `thead`(요일·시작 시간·방송 내용, `th scope="col"`), `tbody` 7행(`월요일` `20:00` 신작 게임 같이 해요 / `화요일` `-` 휴방 / `수요일` `21:00` 수요일 수다 타임 / `목요일` `-` 휴방 / `금요일` `20:00` 신청곡 라이브 / `토요일` `15:00` 시청자 참여 게임 / `일요일` `-` 휴방 — 요일 칸은 레퍼런스처럼 `월요일`…`일요일` 전체 이름, 각 행 첫 칸 `th scope="row"`). (레퍼런스 표와 같은 글)
  - `C:\dev\my-creator-site\contact.html` — 임시 문장을 `<p>협업 제안, 영상 요청, 궁금한 점을 남겨 주세요. 이 사이트는 연습용이라 실제로 전송되지는 않아요.</p>`로 바꾸고 `<form>` 추가. 칸마다 `<div>`로 감쌈: 이름(`id="name" name="name" type="text" autocomplete="name"`), 이메일(`id="email" name="email" type="email" autocomplete="email"`), `채팅 닉네임 (선택)`(`id="nickname" name="nickname" type="text" autocomplete="nickname"`), 문의 종류(`select id="topic" name="topic"`: `general` 일반 문의 / `collab` 협업 제안 / `request` 영상 요청), 내용(`textarea id="message" name="message" rows="6"`, label `내용`), `<button type="submit">보내기</button>`.
  - `C:\dev\my-creator-site\index.html` — `main` 끝에 `<section>`: `<h2>대표 영상</h2>`, 주석 `<!-- YouTube 공유 → 퍼가기에서 복사한 iframe이에요 -->`, `<iframe src="https://www.youtube.com/embed/aqz-KE-bpKQ" title="달빛곰 대표 영상 (예시 영상이에요)" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`.
  - `C:\dev\hello\plan.html` — 과제 2(연습): "내 공부 계획" 표(요일·공부 시간·할 일, 7행).
- 끝 상태 확인: 일정 페이지에 "주간 방송 일정" 제목과 3열 7행 표(테두리 없이 칸 정렬만); 문의 페이지 글자 `이름`을 누르면 이름 칸에 커서; 이메일 칸에 `abc`를 넣고 보내기 → 브라우저 안내 말풍선; 바르게 넣고 보내기 → 주소 끝에 `?name=…&email=…`이 붙고 칸이 비워짐; 홈 맨 아래 영상 칸(재생 여부는 환경에 따라 다름); GitHub에 `Day 8: …` 커밋.
- 과제: 1) label 실험(쉬움): 닉네임 `label`의 `for`를 일부러 `nick`으로 바꿔 눌러 보고 결과 적은 뒤 되돌리기 → 정답 요지: `for`와 `id`가 같아야 연결됨. 2) `plan.html` 공부 계획 표(보통) → 정답 요지: 전체 코드, 첫 열은 `th scope="row"`. 3) (도전) 대표 영상을 내 영상으로 바꾸기 → 정답 요지: `embed/` 뒤 11글자만 바꿈, 퍼가기가 막힌 영상은 재생 안 됨.
- 용어(사전 담당): 표, 폼, 레이블, iframe, 임베드
- 자주 막히는 곳 후보: YouTube 칸에 오류 문구가 나오거나 재생 안 됨(`file://`·퍼가기 금지 영상·네트워크 — 원문은 실측 못 함, "Live Preview 또는 배포 주소에서 다시"); YouTube 퍼가기 코드를 통째로 붙여 `width`·`height`·`allow`가 더 있음(그래도 동작, 교재 코드와 달라도 됨); 보내기 누르면 주소가 바뀌고 칸이 비워짐(정상); label을 눌러도 커서가 안 감(`for`/`id` 다름); `tr`을 빠뜨려 칸이 한 줄로 이어짐; 행마다 칸 수가 달라 표가 어긋남; 소스 제어 **변경 내용 동기화**를 처음 누를 때 나오는 확인 창(푸시와 끌어오기를 한다는 안내 — 문구 실기 미확인); 커밋 메시지가 비어 커밋이 안 됨.
- 레퍼런스 대응: `schedule.html`의 table(caption·thead·tbody·th scope·일정 글), `contact.html`의 입력 칸 5개(label 글자·id·name·type·autocomplete·select option·textarea rows)와 안내 문장, `index.html` "대표 영상" section의 iframe(src·title·referrerpolicy·allowfullscreen). 중간 단계 — 레퍼런스와 다름: form에 id·class·`novalidate`·`required`·`pattern`·오류 문장 없음, 칸 `div`에 class 없음, label `내용`(Day 24에서 완성); 표에 class·id·`data-day` 없음(Day 10·26); 일정 안내 문장 둘째 문장 없음(Day 26); iframe에 class·`loading` 없음(Day 13·28). `plan.html`은 연습 파일.

## Day 9 — CSS 시작 (90분)
- 목표:
  - **CSS**의 역할(HTML = 내용과 구조, CSS = 모양). 규칙 문법 `선택자 { CSS 속성: 값; }`, 주석 `/* */`.
  - `css` 폴더와 `style.css` 파일 만들기, 다섯 페이지 `head`에 `<link rel="stylesheet" href="css/style.css">`(title 다음 줄). 파일 하나로 다섯 페이지 모양을 함께 바꾸는 이유.
  - **선택자**: 요소 선택자(`body`, `a`), 쉼표로 여러 선택자를 한 규칙에 묶기(`h1, h2, h3` = h1과 h2와 h3 모두), **클래스** 선택자(`.site-header` ↔ `class="site-header"`), id 선택자(`#이름`)는 소개만(Day 26에서 씀). 나중 규칙이 앞 규칙을 덮는다는 것(순서).
  - 색: **색상 코드** `#rrggbb`(0.5절 값), 글꼴 `font-family` 목록(`system-ui, "Malgun Gothic", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif` — 앞에서부터 있는 글꼴을 씀, 공백 있는 이름은 따옴표), `line-height`, `text-align`.
  - 개발자 도구 Elements 오른쪽 **Styles**(스타일) 창에서 값 바꿔 보기(저장 안 됨). Live Preview로 보고 있다면 0.2절대로 주소를 Edge에 붙여 열고 개발자 도구를 써요.
  - 고쳤는데 안 바뀔 때 **캐시** 의심 → `Ctrl + F5`(강력 새로 고침).
- 이미 배운 것: Day 6 header·footer·개발자 도구 Elements; Day 3 속성·head; Day 4 상대 경로(`css/style.css`); Day 7~8 커밋·푸시.
- 시작 상태: (Day 8 끝 상태와 같아요)
  - 프로젝트 `C:\dev\my-creator-site\`:
    - `C:\dev\my-creator-site\index.html`
    - `C:\dev\my-creator-site\about.html`
    - `C:\dev\my-creator-site\contents.html`
    - `C:\dev\my-creator-site\schedule.html`
    - `C:\dev\my-creator-site\contact.html`
    - `C:\dev\my-creator-site\images\profile.svg`
    - `C:\dev\my-creator-site\images\logo.svg`
  - 연습 폴더 `C:\dev\hello\`: `C:\dev\hello\hello.html`, `C:\dev\hello\favorites.html`, `C:\dev\hello\tools.html`, `C:\dev\hello\links.html`, `C:\dev\hello\pages\back.html`, `C:\dev\hello\plan.html`
  - 파일 탐색기 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
  - VS Code(한국어 팩, Live Preview 확장 프로그램)와 Chrome이 설치되어 있어요.
  - Git이 설치되어 있고(`git --version` → `git version 2.56.0.windows.4`, 숫자는 달라도 돼요) `git config --global user.name`·`user.email`이 설정되어 있어요.
  - GitHub 계정과 공개(Public) 원격 저장소 `https://github.com/<내 아이디>/my-creator-site`가 있고, 로컬 저장소(`C:\dev\my-creator-site\.git\`, 숨김 폴더)와 연결되어 있어요.
  - 오늘까지의 변경이 모두 커밋·푸시되어 있어요(VS Code 소스 제어 패널의 변경 0개).
  - VS Code에서 `C:\dev\my-creator-site` 폴더를 열어 두면 바로 시작할 수 있어요.
- 오늘 만들/바꿀 파일:
  - `C:\dev\my-creator-site\css\style.css` — 새 파일. 머리 주석 Day 9 버전(테두리 줄 두 개 + `style.css - 달빛곰 방송국 전체 스타일 (모든 페이지가 함께 써요)` 한 줄만 — 순서 줄은 Day 14, 모바일 먼저 줄은 Day 13, 0.5절 주석 규칙) + 구역 `2. 기본 설정 (Day 9, 10)`: `body { background: #ffffff; color: #1d1b2e; font-family: system-ui, "Malgun Gothic", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif; line-height: 1.7; }`, `a { color: #4a3bc7; }`, `h1, h2, h3 { line-height: 1.3; }` / 구역 `4. 헤더와 내비게이션 (Day 11)`: `.site-header { background: #f4f2ff; }` / 구역 `7. 푸터`: `.site-footer { background: #f4f2ff; color: #5a5775; text-align: center; }`.
  - 다섯 페이지 — `head`에 stylesheet `link`, `<header class="site-header">`, `<footer class="site-footer">`.
- 끝 상태 확인: 다섯 페이지 글꼴이 맑은 고딕 계열로 바뀜; 머리글·바닥글 배경이 연보라; 바닥글 글자 가운데·회색; 링크가 보라; 개발자 도구 Styles에 `style.css`의 규칙이 보임; GitHub에 `Day 9` 커밋.
- 과제: 1) Styles 창 실험(쉬움): `body`의 `color`를 바꿔 보고 새로 고침하면 돌아오는 이유 → 정답 요지: 개발자 도구는 화면만 바꾸고 파일은 그대로. 2) 규칙 직접 쓰기(보통): `h1`만 포인트 색 `#5b4bdb`로 바꾸는 규칙을 써서 확인한 뒤 지우기 → 정답 요지: `h1 { color: #5b4bdb; }`, 끝 상태에는 넣지 않음(레퍼런스에 없음). 3) (도전) 클래스 퀴즈: `class=".site-header"`·`.site-footer`(점 없음)·`class="site-header site-footer"`의 뜻 → 정답 요지: HTML에는 점 없이, CSS에는 점, 빈칸으로 클래스 여러 개.
- 용어(사전 담당): CSS, 선택자, 클래스, CSS 속성, 색상 코드, 캐시
- 자주 막히는 곳 후보: CSS가 전혀 안 먹음(`href` 경로·`rel` 빠짐·`css` 폴더 밖에 파일·이름 `style.css.css`·`Css` 폴더 대소문자); 일부 규칙만 안 먹음(중괄호·세미콜론 빠짐 → 그 뒤 규칙 무시, VS Code가 빨간 물결로 알려 줌); 한글 입력 상태로 친 전각 `：`·`；`·`｛`; HTML `class`에 점을 넣음; 고쳤는데 그대로(캐시 → `Ctrl + F5`); 한 페이지에만 `link`; 글꼴 이름 따옴표를 짝 안 맞춤; VS Code가 색상 코드 옆에 띄우는 작은 색 상자를 누르면 색 고르기 창(팁).
- 레퍼런스 대응: `css/style.css` 머리 주석, `2. 기본 설정`의 body(배경·글자색·글꼴·줄 높이)·`a`·`h1, h2, h3` line-height, `.site-header` 배경, `.site-footer` 배경·글자색·가운데 정렬; 다섯 페이지 `<head>`의 stylesheet link와 `site-header`·`site-footer` class. 중간 단계 — 레퍼런스와 다름: 색을 색상 코드로 씀(Day 14에 `var(--…)`), body margin·크기·여백 없음(Day 10).

## Day 10 — 박스 모델 (90분)
- 목표:
  - **박스 모델**: 모든 요소는 상자 — 내용 → **padding**(안쪽 여백) → **border**(테두리) → **margin**(바깥 여백). 개발자 도구 **Computed**(계산됨) 창의 상자 그림으로 확인(브라우저에서 열기 — 0.2절).
  - 블록·인라인 상자(Day 6 복습)와 `display: block`/`inline-block` 맛보기.
  - **box-sizing** `border-box`를 전체 선택자 `*`로: `width`에 padding·border를 포함해 계산.
  - 단위 **px**(고정), **rem**(기본 글자 크기의 몇 배, 사용자 글자 크기 설정을 따름), `%`(부모 기준).
  - 가운데 정렬 상자 `.container`(`max-width: 960px; margin: 0 auto;` + 좌우 `padding` 1rem). border 축약(`1px solid 색`), `border-radius`(`12px`, `50%` = 원), `font-weight`.
  - `img { max-width: 100%; height: auto; }` — CSS로 폭만 바꿔도 비율이 유지되는 이유(그림에 `height` 속성이 있어서 없으면 찌그러짐).
  - **자손 선택자**: 빈칸으로 띄어 쓴 `.site-footer p`(= `.site-footer` 안에 있는 `p`만), `.schedule-table thead th`(여러 겹 안쪽도 됨). 쉼표 묶음과 섞어 `.schedule-table th, .schedule-table td`처럼 쓰는 법(쉼표 뒤에도 앞부분을 다시 씀). 빈칸(안에 있는)과 쉼표(이것도 저것도)의 차이.
  - 표 꾸미기: `border-collapse: collapse`, `th`·`td` padding·border, caption 왼쪽 정렬.
  - 위아래 margin이 겹치는 현상(마진 겹침)은 정상이라고 짧게.
- 이미 배운 것: Day 9 CSS 문법·선택자·클래스·색상 코드·구역 주석·개발자 도구 Styles; Day 6 블록/인라인·div; Day 8 table.
- 시작 상태: (Day 9 끝 상태와 같아요)
  - 프로젝트 `C:\dev\my-creator-site\`:
    - `C:\dev\my-creator-site\index.html`
    - `C:\dev\my-creator-site\about.html`
    - `C:\dev\my-creator-site\contents.html`
    - `C:\dev\my-creator-site\schedule.html`
    - `C:\dev\my-creator-site\contact.html`
    - `C:\dev\my-creator-site\css\style.css`
    - `C:\dev\my-creator-site\images\profile.svg`
    - `C:\dev\my-creator-site\images\logo.svg`
  - 연습 폴더 `C:\dev\hello\`: `C:\dev\hello\hello.html`, `C:\dev\hello\favorites.html`, `C:\dev\hello\tools.html`, `C:\dev\hello\links.html`, `C:\dev\hello\pages\back.html`, `C:\dev\hello\plan.html`
  - 파일 탐색기 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
  - VS Code(한국어 팩, Live Preview 확장 프로그램)와 Chrome이 설치되어 있어요.
  - Git이 설치되어 있고(`git --version` → `git version 2.56.0.windows.4`, 숫자는 달라도 돼요) `git config --global user.name`·`user.email`이 설정되어 있어요.
  - GitHub 계정과 공개(Public) 원격 저장소 `https://github.com/<내 아이디>/my-creator-site`가 있고, 로컬 저장소(`C:\dev\my-creator-site\.git\`, 숨김 폴더)와 연결되어 있어요.
  - 오늘까지의 변경이 모두 커밋·푸시되어 있어요(VS Code 소스 제어 패널의 변경 0개).
  - VS Code에서 `C:\dev\my-creator-site` 폴더를 열어 두면 바로 시작할 수 있어요.
- 오늘 만들/바꿀 파일:
  - `C:\dev\my-creator-site\css\style.css` —
    - `2. 기본 설정` 맨 앞에 `* { box-sizing: border-box; }`(주석 포함), `body`에 `margin: 0;`(맨 앞), `body` 다음·`a` 앞에 `img { max-width: 100%; height: auto; }`, `h1, h2, h3` 다음에 `h1 { font-size: 1.75rem; margin: 1.5rem 0 0.75rem; }`, `h2 { font-size: 1.35rem; margin: 2rem 0 0.75rem; }`, `h3 { font-size: 1.1rem; margin: 0.25rem 0; }`(레퍼런스 순서).
    - 새 구역 `3. 레이아웃`(2와 4 사이): `.container`(max-width·margin·좌우 padding + 레퍼런스 주석), `main { padding-bottom: 3rem; }`.
    - `4`: `.site-header`에 `border-bottom: 1px solid #d9d6ee;`, `.header-inner { padding-top: 0.75rem; padding-bottom: 0.75rem; }`.
    - 새 구역 `6. 페이지별`(4와 7 사이)과 그 안의 작은 주석 세 개(뒤 Day의 삽입 위치): `/* 홈: 소개 영역 */` 아래 `.hero-image { width: 160px; border-radius: 50%; }`, `/* 소개 페이지 */` 아래 `.about-image { width: 200px; border-radius: 12px; }`, `/* 방송 일정 */` 아래 `.schedule-table`·`caption`·`th, td`·`thead th` 규칙(레퍼런스 값, 색은 코드).
    - `7`: `.site-footer`에 `border-top: 1px solid #d9d6ee; padding: 1.5rem 0;`, `.site-footer p { margin: 0; }`.
  - 다섯 페이지 — `header` 안을 `<div class="container header-inner">`로 감쌈, `footer` 안을 `<div class="container">`로 감쌈, `about`·`contents`·`schedule`·`contact`는 `<main class="container">`.
  - `C:\dev\my-creator-site\index.html` — 첫 section `class="container hero"`, 다른 section `class="container"`, 곰 그림 `class="hero-image"`.
  - `C:\dev\my-creator-site\about.html` — 첫 section `class="about-intro"`, 곰 그림 `class="about-image"`.
  - `C:\dev\my-creator-site\schedule.html` — `<table class="schedule-table">`.
- 끝 상태 확인: 넓은 창에서 내용이 가운데 960px 안에 모임, 좁혀도 좌우 16px 여백; 페이지 가장자리 흰 틈(body margin) 사라짐; 홈 곰 그림이 지름 160px 원; 소개 곰 그림이 모서리 둥근 200px 사각형; 일정표에 칸 테두리와 연보라 머리글; 개발자 도구 Computed 상자 그림에서 `.container`의 padding 16 확인; GitHub에 `Day 10` 커밋.
- 과제: 1) 박스 계산(쉬움): `width: 200px; padding: 20px; border: 2px` 상자의 전체 폭을 `content-box`와 `border-box`로 각각 → 정답 요지: 244px vs 200px. 2) 실험(보통): `.container`의 `max-width`를 `600px`로 바꿔 관찰하고 되돌리기 → 정답 요지: 내용 폭이 좁아짐, 좌우 margin auto가 남는 공간을 반씩 나눔. 3) (도전) `h2`의 margin을 rem 대신 px로 쓰면 브라우저 글자 크기 설정을 키웠을 때 무엇이 다른지 → 정답 요지: rem은 함께 커지고 px는 그대로.
- 용어(사전 담당): 박스 모델, margin, padding, border, box-sizing, px, rem, 자손 선택자
- 자주 막히는 곳 후보: 가운데 정렬이 안 됨(`max-width` 없이 `margin: 0 auto`); 곰 그림이 타원(`img` 규칙 빠짐 → height 속성 240 그대로); `class="container, hero"`(쉼표); 표 테두리가 두 줄(`border-collapse` 빠짐); 위아래 여백이 생각보다 작음(마진 겹침); 새 구역을 엉뚱한 위치에 넣음(순서는 동작엔 영향 적지만 뒤 Day 삽입 위치가 어긋남 — 구역 주석 순서 확인); `0.75rem` 앞 0 빠뜨림은 괜찮다는 안심; `div` 닫는 태그 빠뜨림.
- 레퍼런스 대응: `style.css`의 `*`, body margin, `img`, h1~h3 크기·margin, `3. 레이아웃` 전부, `.site-header` border, `.header-inner` padding, `.hero-image`·`.about-image`(768px 규칙 제외), `.schedule-table` 관련 규칙 전부, `7. 푸터` 전부; HTML의 `container`·`header-inner`·`hero`·`about-intro`·`hero-image`·`about-image`·`schedule-table` class. 중간 단계 — 레퍼런스와 다름: 색 코드 직접, `.header-inner`에 flex 없음(Day 11).

## Day 11 — Flexbox (100분)
- 목표:
  - **Flexbox**: 부모에 `display: flex` → 자식들이 한 줄로. **주축**(기본 가로)과 **교차축**(세로), `justify-content`(주축 정렬), `align-items`(교차축 정렬), `gap`, `flex-wrap`, `flex-direction`. 개발자 도구 Elements의 `flex` 배지로 확인.
  - `margin-left: auto`로 메뉴를 오른쪽 끝으로 밀기.
  - 목록 초기화(`list-style: none; margin: 0; padding: 0;`), 링크 밑줄 없애기(`text-decoration: none`), 링크를 `display: block`으로 넓혀 누르기 쉽게.
  - **ARIA** 첫 만남: 지금 보고 있는 페이지 메뉴에 `aria-current="page"`, CSS **속성 선택자** `.menu-list a[aria-current="page"]`로 강조.
  - 버튼 모양: `button, .button` 규칙(둥근 `border-radius: 999px`, `cursor: pointer`, `font: inherit`), 테두리만 있는 `.button-outline`. 홈에 버튼 모양 링크 2개.
- 이미 배운 것: Day 10 박스 모델·padding·margin·border·rem·display·`.container`/`.header-inner`·자손 선택자(`.logo img`·`.menu-list a`에 씀); Day 9 클래스·선택자·쉼표 묶음·색상 코드; Day 8 `<button>`; Day 6 header/nav; Day 3 속성.
- 시작 상태: (Day 10 끝 상태와 같아요)
  - 프로젝트 `C:\dev\my-creator-site\`:
    - `C:\dev\my-creator-site\index.html`
    - `C:\dev\my-creator-site\about.html`
    - `C:\dev\my-creator-site\contents.html`
    - `C:\dev\my-creator-site\schedule.html`
    - `C:\dev\my-creator-site\contact.html`
    - `C:\dev\my-creator-site\css\style.css`
    - `C:\dev\my-creator-site\images\profile.svg`
    - `C:\dev\my-creator-site\images\logo.svg`
  - 연습 폴더 `C:\dev\hello\`: `C:\dev\hello\hello.html`, `C:\dev\hello\favorites.html`, `C:\dev\hello\tools.html`, `C:\dev\hello\links.html`, `C:\dev\hello\pages\back.html`, `C:\dev\hello\plan.html`
  - 파일 탐색기 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
  - VS Code(한국어 팩, Live Preview 확장 프로그램)와 Chrome이 설치되어 있어요.
  - Git이 설치되어 있고(`git --version` → `git version 2.56.0.windows.4`, 숫자는 달라도 돼요) `git config --global user.name`·`user.email`이 설정되어 있어요.
  - GitHub 계정과 공개(Public) 원격 저장소 `https://github.com/<내 아이디>/my-creator-site`가 있고, 로컬 저장소(`C:\dev\my-creator-site\.git\`, 숨김 폴더)와 연결되어 있어요.
  - 오늘까지의 변경이 모두 커밋·푸시되어 있어요(VS Code 소스 제어 패널의 변경 0개).
  - VS Code에서 `C:\dev\my-creator-site` 폴더를 열어 두면 바로 시작할 수 있어요.
- 오늘 만들/바꿀 파일:
  - `C:\dev\my-creator-site\css\style.css` —
    - `4`: `.header-inner`에 `display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem;`(레퍼런스 주석 포함), `.logo { display: flex; align-items: center; gap: 0.5rem; color: #1d1b2e; font-weight: 700; text-decoration: none; }`, `.logo img { display: block; border-radius: 8px; }`, `.site-nav { margin-left: auto; }`(중간), `.menu-list { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 0.25rem; }`(중간), `.menu-list a { display: block; padding: 0.5rem 0.75rem; border-radius: 8px; color: #1d1b2e; text-decoration: none; }`, `.menu-list a[aria-current="page"] { background: #5b4bdb; color: #ffffff; font-weight: 700; }`(주석 "지금 보고 있는 페이지 표시").
    - 새 구역 `5. 공통 부품`(4와 6 사이): `button, .button { display: inline-block; font: inherit; padding: 0.5rem 1rem; border: 2px solid #5b4bdb; border-radius: 999px; background: #5b4bdb; color: #ffffff; text-decoration: none; cursor: pointer; }`, `.button-outline { background: transparent; color: #1d1b2e; }`.
    - `6`: 주석 `/* 홈: 소개 영역 */` 아래 `.hero-actions { display: flex; flex-wrap: wrap; gap: 0.75rem; }`.
  - 다섯 페이지 — 로고 링크 `class="logo"`, `<nav class="site-nav">`, `<ul class="menu-list">`, 자기 페이지 메뉴 링크에 `aria-current="page"`(홈은 `홈`, 소개는 `소개`…).
  - `C:\dev\my-creator-site\index.html` — hero `div`의 소개 문단 다음에 `<p class="hero-actions"><a class="button" href="contents.html">영상 보러 가기</a> <a class="button button-outline" href="schedule.html">방송 일정 보기</a></p>`.
- 끝 상태 확인: 넓은 창에서 로고 왼쪽, 메뉴 5개가 오른쪽에 가로 한 줄; 지금 페이지 메뉴만 보라 배경 흰 글자; 창을 좁히면 메뉴가 다음 줄로 넘어가 줄바꿈; 홈에 보라 버튼과 테두리 버튼; 문의 페이지 보내기 버튼도 둥근 보라 버튼; GitHub에 `Day 11` 커밋.
- 과제: 1) 정렬 실험(쉬움): `.hero-actions`에 `justify-content`를 `center`·`space-between`·`flex-end`로 바꿔 보고 되돌리기 → 정답 요지: 값별 모습 표, 끝 상태는 원래대로. 2) 현재 페이지 점검(보통): 다섯 페이지를 돌며 강조된 메뉴가 맞는지 확인하고 틀린 곳 고치기 → 정답 요지: 페이지별 `aria-current` 위치 목록. 3) (도전) `align-items: center`를 지우면 로고 글자와 그림의 위치가 어떻게 바뀌는지 → 정답 요지: 교차축 정렬이 기본값(늘이기)으로 돌아가 그림과 글자 높이가 어긋남.
- 용어(사전 담당): Flexbox, 주축, 교차축, 속성 선택자, ARIA
- 자주 막히는 곳 후보: `display: flex`를 부모가 아닌 자식(`a`)에 줌; 메뉴 앞 점(•)이 남음(`list-style`); 메뉴 왼쪽에 이상한 여백(`ul` 기본 padding); 다섯 페이지 모두 `홈`에 `aria-current`가 붙음(복사 실수); 속성 선택자 따옴표·대괄호 짝; 버튼 글꼴만 다름(`font: inherit` 빠짐); `gap`이 안 먹는다고 착각(부모가 flex가 아님); 메뉴가 오른쪽으로 안 감(`margin-left: auto`를 `ul`에 줌).
- 레퍼런스 대응: `.header-inner`(flex)·`.logo`·`.logo img`·`.menu-list a`·`.menu-list a[aria-current="page"]`·`5. 공통 부품`의 `button, .button`·`.button-outline`·`.hero-actions`; HTML의 `logo`·`site-nav`·`menu-list` class, `aria-current`, `.hero-actions` 문단. 중간 단계 — 레퍼런스와 다름: `.site-nav {margin-left: auto;}`와 가로 줄바꿈 `.menu-list`(Day 13에 모바일 우선 세로 → 768px 이상 가로), hover·transition 없음(Day 14), 색 코드 직접(Day 14).

## Day 12 — Grid (100분)
- 목표:
  - **Grid**: 부모에 `display: grid`, `grid-template-columns`, **fr**(남는 공간 나누기), `repeat()`, **minmax**(최소~최대), **auto-fit**(들어가는 만큼 칸 만들기) — `repeat(auto-fit, minmax(240px, 1fr))` 한 줄로 화면 폭에 따라 3·2·1칸이 되는 카드 그리드. `auto-fill`과의 차이는 짧게. Flexbox(한 줄 정렬)와 Grid(줄과 칸) 고르는 기준.
  - 카드 부품: `article.card` + 썸네일 `img` + `div.card-body`(h3, p). `overflow: hidden` + `border-radius`로 그림 모서리까지 둥글게.
  - 썸네일 SVG 3개 만들기(레퍼런스 원문 붙여 넣기).
  - 홈 hero와 소개 `.about-intro`를 grid로(지금은 세로 쌓기, Day 13에 넓은 화면 2열).
  - 개발자 도구의 `grid` 배지로 칸 선 보기.
- 이미 배운 것: Day 11 Flexbox·gap·구역 5·6; Day 10 박스 모델·border-radius·`img` 규칙·`%`; Day 6 `article`·`section`; Day 5 SVG 파일 만들기·`img`.
- 시작 상태: (Day 11 끝 상태와 같아요)
  - 프로젝트 `C:\dev\my-creator-site\`:
    - `C:\dev\my-creator-site\index.html`
    - `C:\dev\my-creator-site\about.html`
    - `C:\dev\my-creator-site\contents.html`
    - `C:\dev\my-creator-site\schedule.html`
    - `C:\dev\my-creator-site\contact.html`
    - `C:\dev\my-creator-site\css\style.css`
    - `C:\dev\my-creator-site\images\profile.svg`
    - `C:\dev\my-creator-site\images\logo.svg`
  - 연습 폴더 `C:\dev\hello\`: `C:\dev\hello\hello.html`, `C:\dev\hello\favorites.html`, `C:\dev\hello\tools.html`, `C:\dev\hello\links.html`, `C:\dev\hello\pages\back.html`, `C:\dev\hello\plan.html`
  - 파일 탐색기 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
  - VS Code(한국어 팩, Live Preview 확장 프로그램)와 Chrome이 설치되어 있어요.
  - Git이 설치되어 있고(`git --version` → `git version 2.56.0.windows.4`, 숫자는 달라도 돼요) `git config --global user.name`·`user.email`이 설정되어 있어요.
  - GitHub 계정과 공개(Public) 원격 저장소 `https://github.com/<내 아이디>/my-creator-site`가 있고, 로컬 저장소(`C:\dev\my-creator-site\.git\`, 숨김 폴더)와 연결되어 있어요.
  - 오늘까지의 변경이 모두 커밋·푸시되어 있어요(VS Code 소스 제어 패널의 변경 0개).
  - VS Code에서 `C:\dev\my-creator-site` 폴더를 열어 두면 바로 시작할 수 있어요.
- 오늘 만들/바꿀 파일:
  - `C:\dev\my-creator-site\images\thumb-game.svg`, `thumb-talk.svg`, `thumb-music.svg` — 레퍼런스 원문 그대로.
  - `C:\dev\my-creator-site\css\style.css` —
    - `5` 끝: 주석 `/* 카드 그리드 (Day 12): … */` + `.card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; }`, `.card { background: #f4f2ff; border: 1px solid #d9d6ee; border-radius: 12px; overflow: hidden; }`, `.card img { display: block; width: 100%; }`, `.card-body { padding: 0.75rem 1rem 1rem; }`, `.card-body p { margin: 0.25rem 0 0; color: #5a5775; }`.
    - `6`: `/* 홈: 소개 영역 */` 아래 맨 앞에 `.hero { display: grid; gap: 1.5rem; align-items: center; padding-top: 1.5rem; padding-bottom: 1rem; }`, `/* 소개 페이지 */` 아래 `.about-intro { display: grid; gap: 1.5rem; align-items: start; }`(`.about-image` 앞).
  - `C:\dev\my-creator-site\index.html` — "이런 방송을 해요" section의 article 3개를 `<div class="card-grid">`로 감싸고 각 `<article class="card">` 안을 `img`(thumb-game/talk/music, `alt`는 레퍼런스 문장, `width="320" height="180"`) + `<div class="card-body">`(h3, p)로.
  - `C:\dev\my-creator-site\contents.html` — 과제 2: 안내 문장 아래 `<div class="card-grid">`에 정적 영상 카드 3장(`article.card` > 썸네일 img + `div.card-body` > h3 영상 제목 + p 날짜; 제목·날짜는 `data/videos.json`의 v001~v003 값).
- 끝 상태 확인: 넓은 창(1280px)에서 홈 카드 3장이 한 줄, 창을 줄이면 2장·1장으로 바뀜; 카드 위쪽 썸네일 색(보라·초록·자주), 카드 모서리 둥글게 그림까지 잘림; 영상 페이지에도 카드 3장; 홈 hero는 그림 위·글 아래로 쌓임; GitHub에 `Day 12` 커밋.
- 과제: 1) 실험(쉬움): `minmax(240px, 1fr)`의 240을 400으로 바꾸고 1280px에서 칸 수 세기, 되돌리기 → 정답 요지: 2칸, 최소 폭이 커져 한 줄에 덜 들어감. 2) 영상 페이지 정적 카드 3장(보통) → 정답 요지: `contents.html` 전체 코드. 3) (도전) `auto-fit`을 `auto-fill`로 바꾸고 카드가 1장일 때 차이 → 정답 요지: auto-fill은 빈 칸 자리를 남기고 auto-fit은 있는 카드를 늘림.
- 용어(사전 담당): Grid, fr, minmax, auto-fit
- 자주 막히는 곳 후보: 카드가 세로로만 쌓임(`card-grid` class를 article에 줌 / div로 감싸지 않음); 그림이 카드 밖으로 튀어나오거나 모서리가 각짐(`.card img`·`overflow: hidden` 빠짐); 썸네일이 안 보임(`thumb_game.svg` 밑줄, `images` 경로); `repeat(auto-fit minmax(...))` 쉼표 빠짐; 카드 높이가 제각각인 이유(글 길이 — 정상, Grid는 같은 줄 높이를 맞춤); 개발자 도구 grid 배지를 못 찾음.
- 레퍼런스 대응: `images/thumb-*.svg`(완성), `.card-grid`·`.card`·`.card img`·`.card-body`·`.card-body p`·`.hero`(768px 규칙 제외)·`.about-intro`(768px 규칙 제외); `index.html` "이런 방송을 해요"의 `card-grid`·`article.card`(이미지 `loading` 속성 제외). 중간 단계 — 레퍼런스와 다름: `contents.html` 정적 카드 3장(Day 20에 `#video-list` + JS로 교체), 카드 hover 없음(Day 14), 이미지 `loading="lazy"` 없음(Day 28).

## Day 13 — 반응형 웹 (100분)
- 목표:
  - **반응형 웹**이 필요한 이유(시청자 대부분이 휴대폰). **뷰포트**와 Day 3부터 있던 `<meta name="viewport" …>` 줄의 뜻(지우면 휴대폰이 PC 화면을 축소해 보여 줌).
  - 개발자 도구 **기기 모드**(브라우저에서 연 페이지 — 0.2절; `Ctrl + Shift + M`, 왼쪽 위 휴대폰 모양): 폭 360px·768px·1280px로 바꿔 보기, 가로 스크롤 찾기.
  - **미디어 쿼리** `@media (min-width: 768px) { … }`, **모바일 우선**(기본 규칙 = 좁은 화면, 넓어지면 덧붙임), **브레이크포인트** 고르는 법(내용이 깨지는 폭). 미디어 쿼리는 파일 맨 끝(앞 규칙을 덮어야 해서).
  - 한국어 줄바꿈 `word-break: keep-all`, 긴 영어 주소용 `overflow-wrap: break-word`.
  - 좁은 화면에서 메뉴를 로고 아래 줄로: `flex-basis: 100%`(Flexbox 자식이 한 줄을 다 차지), `flex-direction: column`(Day 11 복습).
  - YouTube 영상 16:9 유지: `.video-frame`의 `aspect-ratio: 16 / 9`, `width: 100%`.
  - 휴대폰 실기 확인은 Day 14 배포 뒤에 한다고 예고(휴대폰은 내 PC의 `file://`·Live Preview 주소를 열 수 없음).
- 이미 배운 것: Day 12 Grid·`.hero`·`.about-intro`; Day 11 Flexbox·`flex-direction`·`.site-nav`·`.menu-list`; Day 10 rem·`%`·`img` max-width; Day 8 iframe; Day 6 개발자 도구; Day 3 viewport 줄(예고).
- 시작 상태: (Day 12 끝 상태와 같아요)
  - 프로젝트 `C:\dev\my-creator-site\`:
    - `C:\dev\my-creator-site\index.html`
    - `C:\dev\my-creator-site\about.html`
    - `C:\dev\my-creator-site\contents.html`
    - `C:\dev\my-creator-site\schedule.html`
    - `C:\dev\my-creator-site\contact.html`
    - `C:\dev\my-creator-site\css\style.css`
    - `C:\dev\my-creator-site\images\profile.svg`
    - `C:\dev\my-creator-site\images\logo.svg`
    - `C:\dev\my-creator-site\images\thumb-game.svg`
    - `C:\dev\my-creator-site\images\thumb-talk.svg`
    - `C:\dev\my-creator-site\images\thumb-music.svg`
  - 연습 폴더 `C:\dev\hello\`: `C:\dev\hello\hello.html`, `C:\dev\hello\favorites.html`, `C:\dev\hello\tools.html`, `C:\dev\hello\links.html`, `C:\dev\hello\pages\back.html`, `C:\dev\hello\plan.html`
  - 파일 탐색기 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
  - VS Code(한국어 팩, Live Preview 확장 프로그램)와 Chrome이 설치되어 있어요.
  - Git이 설치되어 있고(`git --version` → `git version 2.56.0.windows.4`, 숫자는 달라도 돼요) `git config --global user.name`·`user.email`이 설정되어 있어요.
  - GitHub 계정과 공개(Public) 원격 저장소 `https://github.com/<내 아이디>/my-creator-site`가 있고, 로컬 저장소(`C:\dev\my-creator-site\.git\`, 숨김 폴더)와 연결되어 있어요.
  - 오늘까지의 변경이 모두 커밋·푸시되어 있어요(VS Code 소스 제어 패널의 변경 0개).
  - VS Code에서 `C:\dev\my-creator-site` 폴더를 열어 두면 바로 시작할 수 있어요.
- 오늘 만들/바꿀 파일:
  - `C:\dev\my-creator-site\css\style.css` —
    - 머리 주석: 제목 줄 아래에 `모바일 먼저 만들고, 화면이 넓어지면 @media로 덧붙여요 (Day 13)` 줄 추가(0.5절).
    - `2`: `body`에 `word-break: keep-all;`, `overflow-wrap: break-word;`(레퍼런스 주석 포함).
    - `4`: `.header-inner` 주석 `/* 좁은 화면에서는 메뉴가 아래 줄로 내려가요 */`, `.site-nav`를 `{ flex-basis: 100%; }`로(Day 11의 margin-left 삭제, 주석 "한 줄을 다 차지해서 아래로 내려가요"), `.menu-list`의 `flex-wrap` 삭제·`flex-direction: column; gap: 0.25rem;`.
    - `6`: 주석 `/* 유튜브 영상: … */` + `.video-frame { display: block; width: 100%; aspect-ratio: 16 / 9; border: 0; border-radius: 12px; background: #f4f2ff; }`(`.hero-actions` 다음, `/* 소개 페이지 */` 앞).
    - 새 구역 `8. 반응형: 화면이 768px 이상일 때 (Day 13)`(파일 맨 끝): `@media (min-width: 768px) { h1 { font-size: 2.25rem; } .site-nav { flex-basis: auto; margin-left: auto; } .menu-list { flex-direction: row; align-items: center; gap: 0.5rem; } .hero { grid-template-columns: 200px 1fr; gap: 2rem; } .hero-image { width: 200px; } .about-intro { grid-template-columns: 200px 1fr; } }`. 이 구역 안의 주석은 Day 13에는 `h1` 규칙 다음, `.site-nav` 바로 위에 `/* 메뉴 목록은 가로로 늘어놔요 */` 한 줄만 써요(레퍼런스 원문 "메뉴 버튼은 숨기고, …"의 앞부분은 메뉴 버튼이 생기는 Day 21에 고쳐 써요). 메뉴 버튼 규칙은 Day 21.
  - `C:\dev\my-creator-site\index.html` — iframe에 `class="video-frame"`.
- 끝 상태 확인: 기기 모드 360px: 메뉴가 로고 아래 세로 목록(다섯 줄), 카드 1열, 곰 그림 위·글 아래, 영상 16:9, 가로 스크롤 없음; 768px 이상: 메뉴가 오른쪽 가로 한 줄, 홈 hero가 그림 200px + 글 2열, 소개도 2열, h1이 더 큼; GitHub에 `Day 13` 커밋.
- 과제: 1) 세 폭 점검표(쉬움): 360·768·1280에서 메뉴·카드 칸 수·hero 모양을 표로 → 정답 요지: 표(세로·1칸·쌓임 / 가로·2칸·2열 / 가로·3칸·2열). 2) 브레이크포인트 실험(보통): `768px`을 `1000px`로 바꿔 900px에서 관찰하고 되돌리기 → 정답 요지: 900px에서도 모바일 모양. 3) (도전) 미디어 쿼리를 파일 맨 위로 옮기면 왜 안 먹는지 → 정답 요지: 아래의 기본 규칙이 나중에 와서 덮어씀(같은 선택자는 나중 규칙이 이김).
- 용어(사전 담당): 반응형 웹, 뷰포트, 미디어 쿼리, 모바일 우선, 브레이크포인트
- 자주 막히는 곳 후보: 미디어 쿼리가 안 먹음(괄호·중괄호 짝, `min-width:768px` 단위 빠짐, 미디어 쿼리 아래에 같은 규칙이 또 있음); 기기 모드를 켰는데 모양이 그대로(새로 고침), 기기 모드가 안 꺼짐(같은 단축키); viewport 줄을 지움; 가로 스크롤 원인 찾기(긴 영어 주소·고정 폭 — 개발자 도구에서 넘치는 요소 찾기); Windows 디스플레이 배율(125% 등) 때문에 창 폭 숫자가 달라 보임(기기 모드 숫자 기준); 메뉴 세로 목록이 길어 불편함(Day 21 메뉴 버튼 예고).
- 레퍼런스 대응: `style.css` `8. 반응형` 구역(메뉴 버튼·toolbar 규칙 제외), body word-break·overflow-wrap, `.site-nav` flex-basis, `.menu-list` column, `.video-frame`; `index.html` iframe class. 중간 단계 — 레퍼런스와 다름: 좁은 화면에서도 메뉴 목록이 항상 보임(Day 21에 `☰ 메뉴` 버튼으로 접음), 색 코드 직접(Day 14).

## Day 14 — 꾸미기 + 첫 배포 (120분)
- 목표:
  - **CSS 변수**: `:root { --bg: #ffffff; … }`와 `var(--bg)`. 색을 한곳에서 관리하는 이유(Day 22 다크 모드 준비).
  - **의사 클래스** `:hover`, **트랜지션**(`transition: transform 0.15s, background-color 0.15s;`), `transform: translateY(-2px)`(살짝 떠오르기), `box-shadow`와 `rgba()`(투명도 있는 색).
  - **배포**와 **GitHub Pages**: 저장소 → **Settings** → 왼쪽 **Pages** → Build and deployment의 Source **Deploy from a branch** → Branch `main`, 폴더 `/ (root)` → **Save**(external-facts 4절, 영어 화면). 반영까지 최대 10분, 주소 `https://<내 아이디>.github.io/my-creator-site/`. `index.html`이 저장소 맨 위에 있어야 함.
  - 휴대폰으로 배포 주소 열어 보기(주소를 직접 입력하거나 나에게 메시지로 보내기). 배포 뒤 고치면 커밋·푸시만 하면 다시 반영.
  - 웹 서버의 대소문자 구분(Day 4) 실제 확인: 배포에서만 깨지는 그림·링크 찾는 법.
- 이미 배운 것: Day 13 미디어 쿼리; Day 9~12 CSS 구역·선택자·색상 코드; Day 7 원격 저장소·푸시·공개 저장소; Day 4 대소문자 구분·절대 경로; Day 1 서버·URL.
- 시작 상태: (Day 13 끝 상태와 같아요)
  - 프로젝트 `C:\dev\my-creator-site\`:
    - `C:\dev\my-creator-site\index.html`
    - `C:\dev\my-creator-site\about.html`
    - `C:\dev\my-creator-site\contents.html`
    - `C:\dev\my-creator-site\schedule.html`
    - `C:\dev\my-creator-site\contact.html`
    - `C:\dev\my-creator-site\css\style.css`
    - `C:\dev\my-creator-site\images\profile.svg`
    - `C:\dev\my-creator-site\images\logo.svg`
    - `C:\dev\my-creator-site\images\thumb-game.svg`
    - `C:\dev\my-creator-site\images\thumb-talk.svg`
    - `C:\dev\my-creator-site\images\thumb-music.svg`
  - 연습 폴더 `C:\dev\hello\`: `C:\dev\hello\hello.html`, `C:\dev\hello\favorites.html`, `C:\dev\hello\tools.html`, `C:\dev\hello\links.html`, `C:\dev\hello\pages\back.html`, `C:\dev\hello\plan.html`
  - 파일 탐색기 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
  - VS Code(한국어 팩, Live Preview 확장 프로그램)와 Chrome이 설치되어 있어요.
  - Git이 설치되어 있고(`git --version` → `git version 2.56.0.windows.4`, 숫자는 달라도 돼요) `git config --global user.name`·`user.email`이 설정되어 있어요.
  - GitHub 계정과 공개(Public) 원격 저장소 `https://github.com/<내 아이디>/my-creator-site`가 있고, 로컬 저장소(`C:\dev\my-creator-site\.git\`, 숨김 폴더)와 연결되어 있어요.
  - 오늘까지의 변경이 모두 커밋·푸시되어 있어요(VS Code 소스 제어 패널의 변경 0개).
  - VS Code에서 `C:\dev\my-creator-site` 폴더를 열어 두면 바로 시작할 수 있어요.
- 오늘 만들/바꿀 파일:
  - `C:\dev\my-creator-site\css\style.css` —
    - 머리 주석: 제목 줄 바로 아래에 `순서: 변수 → 기본 → 레이아웃 → 헤더/메뉴 → 공통 부품 → 페이지별 → 반응형` 줄 추가 → 머리 주석 완성(0.5절).
    - 새 구역 `1. CSS 변수: 색은 여기서만 정해요 (Day 14, 22)`(머리 주석 바로 아래): `:root { --bg: #ffffff; --surface: #f4f2ff; --text: #1d1b2e; --muted: #5a5775; --accent: #5b4bdb; --accent-text: #ffffff; --link: #4a3bc7; --border: #d9d6ee; --radius: 12px; }`(레퍼런스 줄 끝 주석 포함; `--error`·`--success`·`--highlight`·`color-scheme`는 아직 없음).
    - 모든 색상 코드·`12px` 모서리를 `var(--…)`로 바꿈(body·a·`.site-header`·`.logo`·`.menu-list a`·`[aria-current]`·`button, .button`·`.button-outline`·`.card`·`.card-body p`·`.video-frame`·`.about-image`·`.schedule-table` 규칙·`.site-footer`). VS Code **찾기**(`Ctrl + F`)로 `#`를 검색해 `:root` 밖에 색 코드가 남지 않았는지 확인.
    - `body`에 `transition: background-color 0.2s, color 0.2s;`(주석 "테마가 바뀔 때 부드럽게 (Day 14)"), `.menu-list a:hover { background: var(--border); }`, `button, .button`에 `transition: transform 0.15s, background-color 0.15s;`, `button:hover, .button:hover { transform: translateY(-2px); }`, `.card`에 `transition: transform 0.15s, box-shadow 0.15s;`, `.card:hover { transform: translateY(-3px); box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15); }`.
  - GitHub 저장소 설정 — Pages 켜기(파일 아님).
- 끝 상태 확인: 화면 색이 Day 13과 똑같음(변수로만 바꿈); 메뉴에 마우스를 올리면 연한 배경; 버튼·카드에 올리면 살짝 떠오름; `https://<내 아이디>.github.io/my-creator-site/`에서 다섯 페이지·그림·메뉴가 모두 열림; 휴대폰에서 같은 주소가 모바일 모양으로 보임; GitHub에 `Day 14` 커밋.
- 과제: 1) 변수 실험(쉬움): `--accent`를 다른 색(예 `#d6336c`)으로 바꿔 버튼·현재 메뉴가 한꺼번에 바뀌는 것 보고 되돌리기 → 정답 요지: 변수 한 곳만 고치면 쓰는 곳 전부 바뀜. 2) 배포 점검표(보통): 배포 주소에서 다섯 페이지·그림 5개·메뉴 링크·영상 칸을 체크 → 정답 요지: 점검 목록 + 깨질 때 1순위 원인(대소문자·저장소 맨 위 index.html·푸시 안 함). 3) (도전) `/css/style.css`처럼 `/`로 시작하는 경로가 배포에서 깨지는 이유 → 정답 요지: `/`는 사이트 맨 위(`https://<아이디>.github.io/`)를 가리켜 `my-creator-site/`가 빠짐 → 상대 경로를 쓰는 이유.
- 용어(사전 담당): CSS 변수, 의사 클래스, 트랜지션, 배포, GitHub Pages
- 자주 막히는 곳 후보: Pages 화면에 공개 저장소로 바꾸라는 안내(Private 저장소 → **Settings → General**의 맨 아래 위험 구역에서 공개로 변경, 문구 실기 미확인); `404 There isn't a GitHub Pages site here.`(10분 대기, Branch·폴더 선택 확인, `index.html`이 저장소 맨 위인지 — `C:\dev` 전체나 상위 폴더를 올린 경우); 배포에서만 그림이 깨짐(대소문자 `Profile.svg`); 배포에서만 CSS가 안 먹음(`href="/css/style.css"`); `var(--acent)` 오타 → 그 색만 사라짐(개발자 도구에 줄 그어진 값); `:root` 중괄호 빠짐; 고쳤는데 배포가 그대로(푸시 안 함, 반영 대기, 캐시 `Ctrl + F5`); 저장소 **Actions** 탭의 "pages build and deployment" 진행 표시 보는 법; 휴대폰에서 주소 오타(`github.io` 철자); 회사·학교 네트워크에서 차단.
- 레퍼런스 대응: `style.css` `1. CSS 변수`의 `:root`(error·success·highlight·color-scheme 제외), 모든 `var()` 사용, hover·transition 규칙 전부(`.menu-list a:hover`, `button:hover, .button:hover`, `.card:hover`, body·button·card transition). 중간 단계 — 레퍼런스와 다름: `--error`·`--success`(Day 24), `--highlight`(Day 26), `color-scheme`·다크 변수(Day 22) 없음.

## Day 15 — JavaScript 시작 (90분)
- 목표:
  - **JavaScript**의 역할(HTML 내용, CSS 모양, JS 동작). `js` 폴더와 `main.js` 만들기, 다섯 페이지 `head`의 stylesheet `link` 다음 줄에 `<script src="js/main.js" defer></script>` — **defer**(HTML을 다 읽은 뒤 실행) 뜻과 `head`에 두는 이유.
  - 개발자 도구 **콘솔**(Console) 열기(Live Preview 미리 보기 창이 아니라 Edge에서 연 페이지 — 0.2절), `console.log('…')`, 문장·세미콜론·한 줄 주석 `//`, 콘솔에 직접 입력해 바로 실행(`Enter`), 여러 줄은 `Shift + Enter`.
  - **변수** `let`(바뀌는 값)·`const`(안 바뀌는 값, 기본으로 const), 이름 짓기(영어 camelCase, 예 `siteName`).
  - **자료형**: **문자열**(`'…'`), 숫자, **불리언**(`true`/`false`), **undefined**(아직 값 없음), **null**(일부러 비움). `typeof`.
  - **연산자**: `+ - * / %`(나머지), 문자열 `+` 이어 붙이기, `>`·`<` 맛보기(자세한 비교는 Day 16), `=`는 "넣기".
  - 자료형 바꾸기 `String(5)`, `Number('20')`, 숫자가 아니면 **NaN**. `'20' + 1`과 `Number('20') + 1`의 차이.
  - 빨간 오류 읽기: `Uncaught ReferenceError: siteNmae is not defined`(오타), `Uncaught TypeError: Assignment to constant variable.`(const 다시 넣기) — 원문 실측.
- 이미 배운 것: Day 14 배포; Day 9 `link`로 파일 연결·`head`; Day 6 개발자 도구; Day 4 상대 경로; Day 7~8 커밋·푸시.
- 시작 상태: (Day 14 끝 상태와 같아요)
  - 프로젝트 `C:\dev\my-creator-site\`:
    - `C:\dev\my-creator-site\index.html`
    - `C:\dev\my-creator-site\about.html`
    - `C:\dev\my-creator-site\contents.html`
    - `C:\dev\my-creator-site\schedule.html`
    - `C:\dev\my-creator-site\contact.html`
    - `C:\dev\my-creator-site\css\style.css`
    - `C:\dev\my-creator-site\images\profile.svg`
    - `C:\dev\my-creator-site\images\logo.svg`
    - `C:\dev\my-creator-site\images\thumb-game.svg`
    - `C:\dev\my-creator-site\images\thumb-talk.svg`
    - `C:\dev\my-creator-site\images\thumb-music.svg`
  - 연습 폴더 `C:\dev\hello\`: `C:\dev\hello\hello.html`, `C:\dev\hello\favorites.html`, `C:\dev\hello\tools.html`, `C:\dev\hello\links.html`, `C:\dev\hello\pages\back.html`, `C:\dev\hello\plan.html`
  - 파일 탐색기 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
  - VS Code(한국어 팩, Live Preview 확장 프로그램)와 Chrome이 설치되어 있어요.
  - Git이 설치되어 있고(`git --version` → `git version 2.56.0.windows.4`, 숫자는 달라도 돼요) `git config --global user.name`·`user.email`이 설정되어 있어요.
  - GitHub 계정과 공개(Public) 원격 저장소 `https://github.com/<내 아이디>/my-creator-site`가 있고, 로컬 저장소(`C:\dev\my-creator-site\.git\`, 숨김 폴더)와 연결되어 있어요.
  - GitHub Pages가 켜져 있어요: `https://<내 아이디>.github.io/my-creator-site/`
  - 오늘까지의 변경이 모두 커밋·푸시되어 있어요(VS Code 소스 제어 패널의 변경 0개).
  - VS Code에서 `C:\dev\my-creator-site` 폴더를 열어 두면 바로 시작할 수 있어요.
- 오늘 만들/바꿀 파일:
  - `C:\dev\my-creator-site\js\main.js` — 새 파일. 레퍼런스 머리 주석의 틀(`main.js - 모든 페이지에서 쓰는 코드`, `(HTML에서 <script src="js/main.js" defer>로 불러와요)`; 목록 줄은 아직 없음) + `console.log('main.js가 연결됐어요!');`(중간 — Day 16에서 지움).
  - 다섯 페이지 — `head`에 `<script src="js/main.js" defer></script>`(stylesheet link 다음 줄).
- 끝 상태 확인: 다섯 페이지 어디서든 콘솔에 `main.js가 연결됐어요!` 한 줄, 빨간 오류 0개; 콘솔 실험(`typeof`, `10 % 3`, `'달빛곰' + ' 방송국'`) 결과를 직접 봄; 배포 주소에서도 같은 줄; GitHub에 `Day 15` 커밋.
- 과제: 1) 예측하고 확인(쉬움): `typeof '20'`, `typeof 20`, `typeof true`, `10 % 3`, `'20' + 1`, `Number('20') + 1`, `Number('스물')` → 정답 요지: 결과 표(`'string'`, `'number'`, `'boolean'`, `1`, `'201'`, `21`, `NaN`). 2) 변수로 소개 문장(보통): 콘솔에서 `const name = '달빛곰'; let days = 4;` → `name + '은 일주일에 ' + days + '번 방송해요'` → 정답 요지: 출력 문장 + Day 16 템플릿 리터럴 예고. 3) (도전) 오류 원문 두 개(ReferenceError·TypeError)를 일부러 내고 뜻 풀이 → 정답 요지: 이름 오타 / const에 다시 넣음.
- 용어(사전 담당): JavaScript, 콘솔, 변수, 자료형, 문자열, 불리언, undefined, null, 연산자, NaN, defer
- 자주 막히는 곳 후보: 콘솔에 아무것도 안 나옴(`src` 경로·`js` 폴더 밖·`main.js.js`·`defer` 오타·콘솔 필터가 "기본 수준"이 아님·캐시 `Ctrl + F5`); `Uncaught SyntaxError: Invalid or unexpected token`(한글 상태 따옴표 `‘ ’`, 전각 문자); 문자열에 따옴표를 안 씀 → ReferenceError; Chrome 콘솔에 코드를 붙여 넣을 때 나오는 경고와 `allow pasting` 입력(원문·동작 실측 필요, Edge는 다를 수 있음); 콘솔에서 `Enter`를 눌러 반쯤 쓴 코드가 실행됨(`Shift + Enter`); 콘솔에서 같은 `let` 이름을 다시 선언했을 때 콘솔과 파일의 동작 차이(실측 후 기술); `main.js`를 더블클릭하면 Windows가 스크립트를 실행하려 함 — **열지 말고 VS Code로 편집**(`:::warn`, Windows Script Host 오류 창이 뜰 수 있음, 실기 미확인).
- 레퍼런스 대응: `js/main.js` 머리 주석의 틀, 다섯 페이지 `<head>`의 `<script src="js/main.js" defer>`(완성). 중간 단계 — 레퍼런스와 다름: 확인용 `console.log` 한 줄(Day 16에서 지우고 인사말 구역을 넣음).

## Day 16 — 조건문 (90분)
- 목표:
  - **조건문** `if` / `else if` / `else`, 중괄호 블록.
  - **비교 연산자** `===`, `!==`, `<`, `<=`, `>`, `>=`(`==`를 쓰지 않는 이유). `=`(넣기)와 `===`(같은지 묻기)의 차이.
  - **논리 연산자** `&&`, `||`, `!`. 조건에 값만 쓰면 `null`·`''`·`0`은 거짓으로 본다는 것(`if (greeting)`).
  - **템플릿 리터럴** `` `${hour}시예요` ``: 백틱 키 위치(숫자 `1` 왼쪽, 영어 입력 상태).
  - **삼항 연산자** `조건 ? 참일 때 : 거짓일 때`(Day 22·26에서 씀).
  - **Date** 맛보기: `new Date()`(지금 시각), `.getHours()`(0~23). "컴퓨터 시계 기준, 한국 시간 가정, 시간대는 P2 Day 29" 문구.
  - 화면에 글자 넣기 맛보기: `document.querySelector('#greeting')`로 id가 `greeting`인 요소 찾기 + `.textContent = 문장`(자세한 원리는 Day 20). 요소가 없는 페이지(소개 등)에서는 `null`이라 `if (greeting)`으로 건너뛰기.
- 이미 배운 것: Day 15 변수·const/let·자료형·문자열·null·연산자·console.log·defer·콘솔 오류 읽기; Day 9 id 선택자 `#이름`(소개); Day 8 `id` 속성; Day 10~14 CSS 구역 `6. 페이지별`·변수.
- 시작 상태: (Day 15 끝 상태와 같아요)
  - 프로젝트 `C:\dev\my-creator-site\`:
    - `C:\dev\my-creator-site\index.html`
    - `C:\dev\my-creator-site\about.html`
    - `C:\dev\my-creator-site\contents.html`
    - `C:\dev\my-creator-site\schedule.html`
    - `C:\dev\my-creator-site\contact.html`
    - `C:\dev\my-creator-site\css\style.css`
    - `C:\dev\my-creator-site\images\profile.svg`
    - `C:\dev\my-creator-site\images\logo.svg`
    - `C:\dev\my-creator-site\images\thumb-game.svg`
    - `C:\dev\my-creator-site\images\thumb-talk.svg`
    - `C:\dev\my-creator-site\images\thumb-music.svg`
    - `C:\dev\my-creator-site\js\main.js`
  - 연습 폴더 `C:\dev\hello\`: `C:\dev\hello\hello.html`, `C:\dev\hello\favorites.html`, `C:\dev\hello\tools.html`, `C:\dev\hello\links.html`, `C:\dev\hello\pages\back.html`, `C:\dev\hello\plan.html`
  - 파일 탐색기 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
  - VS Code(한국어 팩, Live Preview 확장 프로그램)와 Chrome이 설치되어 있어요.
  - Git이 설치되어 있고(`git --version` → `git version 2.56.0.windows.4`, 숫자는 달라도 돼요) `git config --global user.name`·`user.email`이 설정되어 있어요.
  - GitHub 계정과 공개(Public) 원격 저장소 `https://github.com/<내 아이디>/my-creator-site`가 있고, 로컬 저장소(`C:\dev\my-creator-site\.git\`, 숨김 폴더)와 연결되어 있어요.
  - GitHub Pages가 켜져 있어요: `https://<내 아이디>.github.io/my-creator-site/`
  - 오늘까지의 변경이 모두 커밋·푸시되어 있어요(VS Code 소스 제어 패널의 변경 0개).
  - VS Code에서 `C:\dev\my-creator-site` 폴더를 열어 두면 바로 시작할 수 있어요.
- 오늘 만들/바꿀 파일:
  - `C:\dev\my-creator-site\js\main.js` — Day 15 `console.log` 줄 지우기, 머리 주석 첫 설명 줄을 `3) 시간대별 인사말`만 든 형태로, 구역 `// ---------- 3. 시간대별 인사말 (Day 16) ----------` 추가(레퍼런스 원문 그대로: `greeting`, `hour`, `let message;`, if/else if 네 갈래, `greeting.textContent = message;`).
  - `C:\dev\my-creator-site\index.html` — hero `div`의 `h1` 바로 다음에 주석 `<!-- main.js가 시간대에 맞는 인사말을 넣어 줘요 (Day 16) -->`와 `<p id="greeting" class="greeting"></p>`.
  - `C:\dev\my-creator-site\css\style.css` — `6`의 `/* 홈: 소개 영역 */`에서 `.hero-image` 다음에 `.greeting { color: var(--muted); font-size: 1.1rem; margin: 0 0 0.5rem; }`.
- 끝 상태 확인: 홈 h1 아래 지금 시각에 맞는 인사말 한 줄(예 저녁이면 "좋은 저녁이에요! 오늘 방송 일정을 확인해 보세요."); 소개·영상·일정·문의 페이지 콘솔에 오류 0개; 확인용 실험으로 `hour`를 잠깐 숫자로 바꿔 네 문장을 모두 본 뒤 되돌림; GitHub에 `Day 16` 커밋.
- 과제: 1) 경계값 표(쉬움): `const hour = 5;`·`6`·`11`·`12`·`17`·`18`로 바꿔 나오는 문장 → 정답 요지: 표(5 늦은 밤, 6·11 아침, 12·17 오후, 18 저녁), 끝나면 `new Date().getHours()`로 되돌림. 2) 삼항 연산자(보통): 콘솔에서 `const hour = new Date().getHours();` 뒤 `` `지금은 ${hour < 12 ? '오전' : '오후'}이에요` `` → 정답 요지: 출력과 if/else로 쓴 같은 코드. 3) (도전) `&&` 조건: "평일 저녁 8시~10시" 같은 범위를 `hour >= 20 && hour < 22`로 표현하고 콘솔에서 확인 → 정답 요지: 두 조건 모두 참일 때만 참.
- 용어(사전 담당): 조건문, 비교 연산자, 논리 연산자, 템플릿 리터럴, 삼항 연산자, Date
- 자주 막히는 곳 후보: 인사말이 안 보임(`id="greeting"` 오타, `#` 빠짐 `querySelector('greeting')`, script 연결); 소개 페이지에서 `Uncaught TypeError: Cannot set properties of null (setting 'textContent')`(if 빠짐 — 원문 실측); `if (hour = 6)` 넣기 실수; 백틱 대신 작은따옴표 → `${hour}`가 글자 그대로; 백틱 키가 `₩`·한글로 입력됨(입력 상태 확인); `else if`를 `elseif`로 → `SyntaxError`; 중괄호 짝; 인사말 시간이 이상함(PC 시계·시간대 설정 **설정 → 시간 및 언어 → 날짜 및 시간**, 메뉴 이름 버전에 따라 다를 수 있음).
- 레퍼런스 대응: `js/main.js` `3. 시간대별 인사말` 구역(완성), `index.html`의 `#greeting` 문단과 주석(완성), `style.css` `.greeting`(완성). 중간 단계 — 레퍼런스와 다름: 머리 주석 목록에 1)·2) 없음(Day 21·22).

## Day 17 — 반복문과 배열 (90분)
- 목표:
  - **배열** `['월', '수', '금', '토']`, **인덱스**(0부터), `.length`, `.push()`, `배열[인덱스] = 값`. 문자열도 `.length`가 있다는 것.
  - **반복문** `for (let i = 0; i < 배열.length; i++)`, `i++`(1 늘리기), **for...of**(`for (const day of days)`)로 하나씩 꺼내기. 반복 + 조건(`if`) 함께 쓰기, 합계·최댓값 구하기 모양(`let max = null;` → 처음이거나 더 크면 바꾸기 — Day 26 `findNextBroadcast`와 같은 모양).
  - 무한 반복 주의(탭이 멈추면 탭 닫기, 안 되면 작업 관리자 `Ctrl + Shift + Esc`).
  - 연습장 만들기: VS Code **파일 → 새 창**으로 `C:\dev\hello` 폴더를 열고(프로젝트 창은 그대로) `lab.html` + `lab.js`. `lab.html`을 Live Preview나 더블클릭으로 열고 콘솔에서 결과 보기. 프로젝트 파일은 오늘 바뀌지 않아요.
- 이미 배운 것: Day 16 조건문·비교·논리 연산자·템플릿 리터럴·Date; Day 15 변수·자료형·연산자(`%`)·console.log·defer·콘솔; Day 2 VS Code 폴더 열기·Live Preview.
- 시작 상태: (Day 16 끝 상태와 같아요)
  - 프로젝트 `C:\dev\my-creator-site\`:
    - `C:\dev\my-creator-site\index.html`
    - `C:\dev\my-creator-site\about.html`
    - `C:\dev\my-creator-site\contents.html`
    - `C:\dev\my-creator-site\schedule.html`
    - `C:\dev\my-creator-site\contact.html`
    - `C:\dev\my-creator-site\css\style.css`
    - `C:\dev\my-creator-site\images\profile.svg`
    - `C:\dev\my-creator-site\images\logo.svg`
    - `C:\dev\my-creator-site\images\thumb-game.svg`
    - `C:\dev\my-creator-site\images\thumb-talk.svg`
    - `C:\dev\my-creator-site\images\thumb-music.svg`
    - `C:\dev\my-creator-site\js\main.js`
  - 연습 폴더 `C:\dev\hello\`: `C:\dev\hello\hello.html`, `C:\dev\hello\favorites.html`, `C:\dev\hello\tools.html`, `C:\dev\hello\links.html`, `C:\dev\hello\pages\back.html`, `C:\dev\hello\plan.html`
  - 파일 탐색기 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
  - VS Code(한국어 팩, Live Preview 확장 프로그램)와 Chrome이 설치되어 있어요.
  - Git이 설치되어 있고(`git --version` → `git version 2.56.0.windows.4`, 숫자는 달라도 돼요) `git config --global user.name`·`user.email`이 설정되어 있어요.
  - GitHub 계정과 공개(Public) 원격 저장소 `https://github.com/<내 아이디>/my-creator-site`가 있고, 로컬 저장소(`C:\dev\my-creator-site\.git\`, 숨김 폴더)와 연결되어 있어요.
  - GitHub Pages가 켜져 있어요: `https://<내 아이디>.github.io/my-creator-site/`
  - 오늘까지의 변경이 모두 커밋·푸시되어 있어요(VS Code 소스 제어 패널의 변경 0개).
  - VS Code에서 `C:\dev\my-creator-site` 폴더를 열어 두면 바로 시작할 수 있어요.
- 오늘 만들/바꿀 파일:
  - `C:\dev\hello\lab.html` — 새 파일: `<title>JS 연습장</title>`, `<h1>JS 연습장</h1>`, `<p>개발자 도구 콘솔(F12)을 열어 결과를 보세요.</p>`, `head`에 `<script src="lab.js" defer></script>`.
  - `C:\dev\hello\lab.js` — 새 파일: Day 17 연습 코드(방송 요일 배열을 for·for...of로 출력, 방송 시간 배열 합계, 길이). 과제 코드도 이 파일에 이어서 씀.
  - 프로젝트 `C:\dev\my-creator-site\` — 바뀌는 파일 없음(커밋하지 않아도 돼요).
- 끝 상태 확인: `lab.html` 콘솔에 요일 4줄, 합계, 과제 결과가 보임; 프로젝트 VS Code 창의 소스 제어 패널 변경 0개.
- 과제: 1) 합계와 평균(쉬움): `const hours = [20, 21, 20, 15];`의 합과 평균을 for...of로 → 정답 요지: 합 76, 평균 19. 2) 7의 배수(보통): 1~30 중 7의 배수 Day 번호를 `for` + `%`로 출력 → 정답 요지: 7, 14, 21, 28. 3) (도전) 가장 늦은 방송 시각 찾기: `let latest = null;`로 시작해 처음이거나 더 크면 바꾸기 → 정답 요지: 21, 그리고 `null`로 시작하는 이유(아직 아무것도 안 봤다는 표시).
- 용어(사전 담당): 배열, 인덱스, 반복문, for...of
- 자주 막히는 곳 후보: `undefined`가 나옴(인덱스가 `length` 이상 — `<=`를 씀); 무한 반복으로 탭 멈춤(`i++` 빠짐, `i--`); `for (let i = 0, i < 4, i++)` 쉼표; `for...of` 대신 `for...in`(인덱스 글자가 나옴); `lab.js`가 연결 안 됨(`lab.html`과 다른 폴더); 프로젝트 창과 연습장 창을 헷갈림(VS Code 창 제목의 폴더 이름 확인, 작업 표시줄에서 창 바꾸기); `const`로 만든 배열에 `push`가 되는 이유(상자 자체는 그대로, 안의 내용만 바뀜 — 한 줄로).
- 레퍼런스 대응: 프로젝트 파일 변경 없음. 오늘 배운 for...of는 `js/contact.js` submit 처리(Day 24)·`js/schedule.js` `findNextBroadcast`(Day 26)에서, 배열·인덱스는 `dayNames`(Day 26)에서 써요. `lab.*`는 연습 파일.

## Day 18 — 함수 (100분)
- 목표:
  - **함수** 선언 `function 이름(매개변수) { … }`, 호출 `이름(값)`, **매개변수**와 넘기는 값(인수), **반환값** `return`(돌려준 값을 변수에 받기, `return` 뒤 줄은 실행 안 됨, `return`이 없으면 `undefined`). 함수 이름은 동사로(`makeGreeting`, `formatTime`).
  - 이른 `return`(조건이 안 맞으면 바로 끝내기) 모양 — Day 21·25에서 씀.
  - **화살표 함수** `const double = (n) => n * 2;`, 중괄호를 쓰면 `return`을 직접 써야 함.
  - 함수를 값처럼 다른 함수에 넘길 수 있다는 맛보기(Day 19 콜백 예고).
  - **스코프**: `{ }` 안에서 만든 `let`·`const`는 밖에서 못 씀(ReferenceError), 밖의 변수는 안에서 씀.
  - 연습은 `C:\dev\hello\lab.js`(Day 17 코드를 지우고 새로 씀).
- 이미 배운 것: Day 17 배열·인덱스·for·for...of·연습장(`lab.html`·`lab.js`); Day 16 조건문·템플릿 리터럴·삼항 연산자; Day 15 변수·자료형·undefined·`String()`·`Number()`.
- 시작 상태: (Day 17 끝 상태와 같아요)
  - 프로젝트 `C:\dev\my-creator-site\`:
    - `C:\dev\my-creator-site\index.html`
    - `C:\dev\my-creator-site\about.html`
    - `C:\dev\my-creator-site\contents.html`
    - `C:\dev\my-creator-site\schedule.html`
    - `C:\dev\my-creator-site\contact.html`
    - `C:\dev\my-creator-site\css\style.css`
    - `C:\dev\my-creator-site\images\profile.svg`
    - `C:\dev\my-creator-site\images\logo.svg`
    - `C:\dev\my-creator-site\images\thumb-game.svg`
    - `C:\dev\my-creator-site\images\thumb-talk.svg`
    - `C:\dev\my-creator-site\images\thumb-music.svg`
    - `C:\dev\my-creator-site\js\main.js`
  - 연습 폴더 `C:\dev\hello\`: `C:\dev\hello\hello.html`, `C:\dev\hello\favorites.html`, `C:\dev\hello\tools.html`, `C:\dev\hello\links.html`, `C:\dev\hello\pages\back.html`, `C:\dev\hello\plan.html`, `C:\dev\hello\lab.html`, `C:\dev\hello\lab.js`
  - 파일 탐색기 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
  - VS Code(한국어 팩, Live Preview 확장 프로그램)와 Chrome이 설치되어 있어요.
  - Git이 설치되어 있고(`git --version` → `git version 2.56.0.windows.4`, 숫자는 달라도 돼요) `git config --global user.name`·`user.email`이 설정되어 있어요.
  - GitHub 계정과 공개(Public) 원격 저장소 `https://github.com/<내 아이디>/my-creator-site`가 있고, 로컬 저장소(`C:\dev\my-creator-site\.git\`, 숨김 폴더)와 연결되어 있어요.
  - GitHub Pages가 켜져 있어요: `https://<내 아이디>.github.io/my-creator-site/`
  - 오늘까지의 변경이 모두 커밋·푸시되어 있어요(VS Code 소스 제어 패널의 변경 0개).
  - VS Code에서 `C:\dev\my-creator-site` 폴더를 열어 두면 바로 시작할 수 있어요.
- 오늘 만들/바꿀 파일:
  - `C:\dev\hello\lab.js` — Day 17 코드를 지우고 Day 18 연습 코드로 바꿈(`formatTime(hour, minute)`이 `` `${hour}:${minute}` ``을 돌려주는 함수, 화살표 함수 버전, 스코프 실험). 과제 코드도 이어서.
  - 프로젝트 `C:\dev\my-creator-site\` — 바뀌는 파일 없음.
- 끝 상태 확인: `lab.html` 콘솔에 함수 호출 결과들이 보임; 일부러 낸 스코프 오류 원문을 읽고 지움; 프로젝트 소스 제어 변경 0개.
- 과제: 1) 인사 함수(쉬움): `makeGreeting(name)`이 `` `${name}님, 어서 오세요!` ``를 돌려주고 세 번 호출 → 정답 요지: 함수 코드 + 출력 3줄. 2) 화살표 함수로 바꾸기(보통): 1번 함수를 `const makeGreeting = (name) => …`로 → 정답 요지: 한 줄 버전과 중괄호 + return 버전. 3) (도전) 스코프 퀴즈: `if` 블록 안에서 만든 `const message`를 블록 밖에서 `console.log` → 정답 요지: `ReferenceError: message is not defined`, 그래서 레퍼런스 인사말 코드는 `let message;`를 블록 밖에 먼저 둠(Day 16 코드 다시 읽기).
- 용어(사전 담당): 함수, 매개변수, 반환값, 화살표 함수, 스코프
- 자주 막히는 곳 후보: 이름만 쓰고 `()`를 안 붙여 함수 내용이 출력됨; `return`을 빠뜨려 `undefined`; 매개변수 개수보다 적게 넘김 → `undefined`; `= >` 띄어 씀 → SyntaxError; 중괄호 화살표 함수에서 return 빠짐; 함수를 만들기만 하고 호출 안 함; 같은 이름의 함수·변수를 두 번 만듦(`Identifier '…' has already been declared` — 원문 실측).
- 레퍼런스 대응: 프로젝트 파일 변경 없음. 함수 선언은 `contents.js` `createCard`·`render`(Day 20), `schedule.js` `pad`(Day 26)에서, 화살표 함수는 Day 19~27의 모든 콜백(`forEach`·`filter`·`addEventListener`)에서 써요.

## Day 19 — 객체와 배열 메서드 (100분)
- 목표:
  - **객체** `{ 키: 값 }`, **키**로 값 꺼내기: 점 표기 `video.title`, 대괄호 표기 `categoryNames[video.category]`(키가 변수에 들어 있을 때). 객체 배열 = 표 모양 데이터.
  - 영상 데이터 형식 고정: `{ id, title, category, youtubeId, date }`, `category`는 `game`·`talk`·`music`(레퍼런스 README).
  - **메서드**(객체에 달린 함수 — `console.log`, `push`도 메서드), **콜백 함수**(다른 함수에 넘겨서 나중에 불리는 함수).
  - **배열 메서드** `forEach`(하나씩 실행), `map`(바꾼 새 배열), `filter`(조건 맞는 것만 새 배열) — 화살표 함수 콜백 `(video) => …`. 원본 배열은 안 바뀐다는 것.
  - `js/contents.js`를 만들어 영상 페이지에만 연결하고 콘솔에서 데이터 살펴보기.
- 이미 배운 것: Day 18 함수·매개변수·반환값·화살표 함수·스코프; Day 17 배열·인덱스·for...of; Day 16 `===`·템플릿 리터럴; Day 15 const/let·문자열·console.log·defer; Day 12 `contents.html` 정적 카드.
- 시작 상태: (Day 18 끝 상태와 같아요)
  - 프로젝트 `C:\dev\my-creator-site\`:
    - `C:\dev\my-creator-site\index.html`
    - `C:\dev\my-creator-site\about.html`
    - `C:\dev\my-creator-site\contents.html`
    - `C:\dev\my-creator-site\schedule.html`
    - `C:\dev\my-creator-site\contact.html`
    - `C:\dev\my-creator-site\css\style.css`
    - `C:\dev\my-creator-site\images\profile.svg`
    - `C:\dev\my-creator-site\images\logo.svg`
    - `C:\dev\my-creator-site\images\thumb-game.svg`
    - `C:\dev\my-creator-site\images\thumb-talk.svg`
    - `C:\dev\my-creator-site\images\thumb-music.svg`
    - `C:\dev\my-creator-site\js\main.js`
  - 연습 폴더 `C:\dev\hello\`: `C:\dev\hello\hello.html`, `C:\dev\hello\favorites.html`, `C:\dev\hello\tools.html`, `C:\dev\hello\links.html`, `C:\dev\hello\pages\back.html`, `C:\dev\hello\plan.html`, `C:\dev\hello\lab.html`, `C:\dev\hello\lab.js`
  - 파일 탐색기 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
  - VS Code(한국어 팩, Live Preview 확장 프로그램)와 Chrome이 설치되어 있어요.
  - Git이 설치되어 있고(`git --version` → `git version 2.56.0.windows.4`, 숫자는 달라도 돼요) `git config --global user.name`·`user.email`이 설정되어 있어요.
  - GitHub 계정과 공개(Public) 원격 저장소 `https://github.com/<내 아이디>/my-creator-site`가 있고, 로컬 저장소(`C:\dev\my-creator-site\.git\`, 숨김 폴더)와 연결되어 있어요.
  - GitHub Pages가 켜져 있어요: `https://<내 아이디>.github.io/my-creator-site/`
  - 오늘까지의 변경이 모두 커밋·푸시되어 있어요(VS Code 소스 제어 패널의 변경 0개).
  - VS Code에서 `C:\dev\my-creator-site` 폴더를 열어 두면 바로 시작할 수 있어요.
- 오늘 만들/바꿀 파일:
  - `C:\dev\my-creator-site\js\contents.js` — 새 파일. 머리 주석(Day 19 버전: "contents.js - 영상 목록 페이지 / 지금은 영상 데이터를 만들고 콘솔에서 살펴봐요"), `// 카테고리 코드 → 화면에 보여 줄 이름, 썸네일 그림 (Day 19: 객체)` + `categoryNames`·`thumbnails`(레퍼런스 원문), 주석 `// 지금 상태: 전체 영상` + `let allVideos = [ … ];`(6개 객체 — 값은 레퍼런스 `data/videos.json`과 똑같이, 들여쓰기 2칸 한 줄에 한 객체; 위치는 `thumbnails` 바로 아래 — 0.6절), 콘솔 확인 코드(`// 확인용 (Day 20에서 지워요)` 아래 `forEach`로 `` `${categoryNames[video.category]} · ${video.title}` `` 출력, `filter`로 게임 영상 개수, `map`으로 제목 배열).
  - `C:\dev\my-creator-site\contents.html` — `head`의 main.js script 다음 줄에 `<script src="js/contents.js" defer></script>`.
- 끝 상태 확인: 영상 페이지 콘솔에 "음악 · 기타로 연주하는 신청곡" 등 6줄, 게임 영상 2개, 제목 6개 배열; 화면은 Day 12 정적 카드 그대로; 다른 페이지 콘솔에는 영상 줄이 없음; GitHub에 `Day 19` 커밋.
- 과제: 1) 음악 영상 개수(쉬움): `filter`로 `music`만 골라 `length` 출력 → 정답 요지: 2. 2) 제목과 날짜(보통): `map`으로 `` `${video.title} (${video.date})` `` 배열 → 정답 요지: 코드와 6개 결과. 3) (도전) `forEach`와 `for...of`로 같은 출력 만들고 차이 한 줄 → 정답 요지: 결과 같음, forEach는 콜백을 넘김.
- 용어(사전 담당): 객체, 키, 메서드, 콜백 함수, 배열 메서드
- 자주 막히는 곳 후보: 객체 사이 쉼표 빠짐 → `Uncaught SyntaxError: Unexpected token '{'`(원문 실측); `categoryNames.video.category`(점 표기를 이어 씀) → `TypeError`; `map` 결과를 변수에 안 받아 아무 일도 없어 보임; 중괄호 화살표 함수의 `filter`에서 `return` 빠짐 → 빈 배열; `contents.js`를 다섯 페이지 모두에 넣음; 한글 따옴표; `youtubeId` 대소문자(`youtubeID`) — 이름은 레퍼런스와 같게.
- 레퍼런스 대응: `js/contents.js`의 `categoryNames`·`thumbnails`(완성), 영상 데이터 6개의 값(`data/videos.json`과 같음), `contents.html`의 contents.js script(완성). 중간 단계 — 레퍼런스와 다름: 데이터가 `contents.js` 안의 배열(Day 25에 `data/videos.json` + fetch), 콘솔 확인 코드(Day 20에서 지움).

## Day 20 — DOM 다루기 (120분)
- 목표:
  - **DOM**: 브라우저가 HTML을 읽어 만든 요소 나무, JS가 그 나무를 고치면 화면이 바뀜. Elements 패널 = DOM을 보는 창.
  - **querySelector**(CSS 선택자로 요소 하나 찾기 — Day 16 맛보기 복습), **textContent** 읽기·쓰기, `textContent = ''`로 비우기. 사용자 글·데이터는 `innerHTML`이 아니라 `textContent`로 넣는 이유(글자에 섞인 태그가 실행되지 않게 — 보안 습관, 한 문단).
  - **classList**(`add`·`remove`·`contains` — 콘솔 실험), `className`(클래스 통째로 정하기).
  - **createElement**로 요소 만들기 → 속성 넣기(`image.src`, `image.alt`, `image.width`, `image.loading`(뜻은 Day 28), `link.href`, `link.target = '_blank'`, `link.rel = 'noopener noreferrer'`(새 탭 안전), `date.dateTime`) → `appendChild`로 붙이기. `<time>` 요소.
  - 데이터 → 카드: 도우미 함수 `createElementWithText`, `createCard(video)`, `render()`(목록 비우고 `forEach`로 붙이기). 영상 제목 링크 주소 `` `https://www.youtube.com/watch?v=${video.youtubeId}` ``(예시 ID — 내 영상 ID로).
  - `noscript`(JS가 꺼진 경우 안내).
  - Day 12 정적 카드를 지우고 JS가 그린 카드로 바꾸기.
- 이미 배운 것: Day 19 객체·키·대괄호 표기·콜백·forEach/map/filter·`contents.js`·데이터 형식; Day 18 함수·return·화살표 함수; Day 16 querySelector·textContent 맛보기·템플릿 리터럴; Day 12 카드 HTML 구조(`article.card` > img + `div.card-body`); Day 8 iframe·YouTube ID; Day 4 링크 `href`.
- 시작 상태: (Day 19 끝 상태와 같아요)
  - 프로젝트 `C:\dev\my-creator-site\`:
    - `C:\dev\my-creator-site\index.html`
    - `C:\dev\my-creator-site\about.html`
    - `C:\dev\my-creator-site\contents.html`
    - `C:\dev\my-creator-site\schedule.html`
    - `C:\dev\my-creator-site\contact.html`
    - `C:\dev\my-creator-site\css\style.css`
    - `C:\dev\my-creator-site\images\profile.svg`
    - `C:\dev\my-creator-site\images\logo.svg`
    - `C:\dev\my-creator-site\images\thumb-game.svg`
    - `C:\dev\my-creator-site\images\thumb-talk.svg`
    - `C:\dev\my-creator-site\images\thumb-music.svg`
    - `C:\dev\my-creator-site\js\main.js`
    - `C:\dev\my-creator-site\js\contents.js`
  - 연습 폴더 `C:\dev\hello\`: `C:\dev\hello\hello.html`, `C:\dev\hello\favorites.html`, `C:\dev\hello\tools.html`, `C:\dev\hello\links.html`, `C:\dev\hello\pages\back.html`, `C:\dev\hello\plan.html`, `C:\dev\hello\lab.html`, `C:\dev\hello\lab.js`
  - 파일 탐색기 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
  - VS Code(한국어 팩, Live Preview 확장 프로그램)와 Chrome이 설치되어 있어요.
  - Git이 설치되어 있고(`git --version` → `git version 2.56.0.windows.4`, 숫자는 달라도 돼요) `git config --global user.name`·`user.email`이 설정되어 있어요.
  - GitHub 계정과 공개(Public) 원격 저장소 `https://github.com/<내 아이디>/my-creator-site`가 있고, 로컬 저장소(`C:\dev\my-creator-site\.git\`, 숨김 폴더)와 연결되어 있어요.
  - GitHub Pages가 켜져 있어요: `https://<내 아이디>.github.io/my-creator-site/`
  - 오늘까지의 변경이 모두 커밋·푸시되어 있어요(VS Code 소스 제어 패널의 변경 0개).
  - VS Code에서 `C:\dev\my-creator-site` 폴더를 열어 두면 바로 시작할 수 있어요.
- 오늘 만들/바꿀 파일:
  - `C:\dev\my-creator-site\contents.html` — Day 12 정적 카드 `div`를 지우고 `<h2>영상 목록</h2>`, 주석 `<!-- 카드는 contents.js가 영상 데이터를 읽어서 여기에 그려 줘요 -->`, `<div id="video-list" class="card-grid"></div>`, `<noscript><p class="error-box">영상 목록을 보려면 JavaScript를 켜 주세요.</p></noscript>`(`.error-box` 모양은 Day 25).
  - `C:\dev\my-creator-site\js\contents.js` — 콘솔 확인 코드 삭제. 머리 주석 둘째 줄을 "영상 데이터로 카드를 그려요"로. `thumbnails`와 `// 지금 상태: 전체 영상` 주석 **사이**에 `// 화면의 요소들을 미리 찾아 둬요 (Day 20)` + `const listElement = document.querySelector('#video-list');`(0.6절 배치), `createElementWithText`(Day 18 주석 포함)·`createCard`(레퍼런스 원문 그대로), `render()` Day 20 버전(`listElement.textContent = '';` + `allVideos.forEach((video) => { listElement.appendChild(createCard(video)); });`), 파일 끝 `render();`.
  - `C:\dev\my-creator-site\css\style.css` — `5`의 `.card-body p` 다음에 `.card-body time { display: block; color: var(--muted); font-size: 0.9rem; }`, `.badge { … }`(레퍼런스 값).
- 끝 상태 확인: 영상 페이지에 카드 6장(썸네일·보라 배지 `음악`/`게임`/`토크`·제목 링크·날짜); 제목을 누르면 새 탭으로 YouTube 주소가 열림; Elements에서 `#video-list` 안에 `article.card` 6개; 콘솔 오류 0개; 배포 주소에서도 6장; GitHub에 `Day 20` 커밋.
- 과제: 1) DOM 나무 그리기(쉬움): Elements에서 첫 카드를 펼쳐 `article > img, div.card-body > span.badge, h3 > a, time` 구조를 들여 쓴 목록으로 → 정답 요지: 트리와 각 요소를 만든 코드 줄. 2) 데이터만 고치기(보통): `allVideos` 첫 영상 제목을 바꿔 카드가 바뀌는 것 확인하고 되돌리기 → 정답 요지: 화면 글은 HTML이 아니라 데이터에서 옴. 3) (도전) `link.textContent` 대신 `innerHTML`에 `'<b>굵게</b>'`를 넣으면? 실험 후 되돌리기 → 정답 요지: textContent는 꺾쇠까지 글자로, innerHTML은 태그로 해석 — 남이 쓴 글이면 위험.
- 용어(사전 담당): DOM, querySelector, textContent, classList, createElement
- 자주 막히는 곳 후보: `Uncaught TypeError: Cannot read properties of null (reading 'appendChild')`(`#video-list` id 오타, `defer` 빠짐 — 원문 실측); 카드가 9장(정적 카드 안 지움)·12장(`render()` 두 번, 비우기 빠짐); 썸네일 안 보임(`thumbnails` 경로는 페이지 기준 `images/…`); 제목 링크가 같은 탭에서 열림(`target`); `createCard`에서 `return card;` 빠짐 → `Failed to execute 'appendChild' on 'Node': parameter 1 is not of type 'Node'.`(원문 실측); `appendChild` 순서가 바뀌어 제목이 날짜 아래; 예시 YouTube 주소가 "동영상을 사용할 수 없음"(예시 ID — 내 영상으로).
- 레퍼런스 대응: `contents.js` `createElementWithText`·`createCard`(완성)·`listElement`, `contents.html`의 `<h2>영상 목록</h2>`·`#video-list`·noscript(완성), `style.css` `.card-body time`·`.badge`(완성). 중간 단계 — 레퍼런스와 다름: `render()`가 필터 없이 전체를 그림(Day 23), 데이터가 배열(Day 25), 카드 주석 문구(Day 25에 "data/videos.json을 읽어서"로).

## Day 21 — 이벤트 (110분)
- 목표:
  - **이벤트**(클릭·입력 같은 일), **이벤트 리스너** `요소.addEventListener('click', () => { … })` — 콜백은 이벤트가 날 때마다 불림(Day 19 콜백 복습). 이벤트 객체 `event`, `event.target`(실제로 누른 요소).
  - CSS **복합 선택자**: 빈칸 없이 붙여 쓴 `.site-nav.open`(= `site-nav`와 `open` 클래스를 **둘 다** 가진 요소). 띄어 쓴 `.site-nav .open`은 Day 10 자손 선택자라 뜻이 달라진다는 것. 요소 이름 + 클래스(`tr.today`, Day 26)도 같은 규칙. Day 24 `.form-status.is-error`, Day 27 `.countdown.hint`에서 다시 써요.
  - **햄버거 메뉴**: 좁은 화면에서 메뉴 목록을 숨기고 `☰ 메뉴` 버튼으로 열고 닫기. `classList.toggle('open')`이 돌려주는 참/거짓, `setAttribute('aria-expanded', String(isOpen))`(불리언 → 글자는 Day 15 `String()`), `aria-controls`, `nav`에 `id="site-nav"`와 `aria-label="주 메뉴"`.
  - **data 속성** `data-category="game"`과 JS의 `button.dataset.category`.
  - **이벤트 위임**: 버튼 4개가 아니라 감싸는 상자 하나에 리스너 → `event.target.closest('button')`(누른 곳에서 가장 가까운 button, 없으면 `null` → 이른 `return`). `querySelectorAll('button').forEach(…)`로 `aria-pressed` 바꾸기. `role="group"` + `aria-label`.
  - 다섯 파일을 똑같이 고치는 팁: VS Code **편집 → 바꾸기**(`Ctrl + H`)를 파일마다 쓰거나 한 파일을 고친 뒤 머리글 부분만 복사.
- 이미 배운 것: Day 20 DOM·querySelector·textContent·classList(add/remove)·createElement·`contents.js` 구조; Day 19 콜백·forEach; Day 18 함수·화살표 함수·이른 return; Day 16 조건문·`===`; Day 15 `String()`·불리언; Day 13 미디어 쿼리·`.site-nav`; Day 11 ARIA·속성 선택자·`.button-outline`; Day 8 `<button>`.
- 시작 상태: (Day 20 끝 상태와 같아요)
  - 프로젝트 `C:\dev\my-creator-site\`:
    - `C:\dev\my-creator-site\index.html`
    - `C:\dev\my-creator-site\about.html`
    - `C:\dev\my-creator-site\contents.html`
    - `C:\dev\my-creator-site\schedule.html`
    - `C:\dev\my-creator-site\contact.html`
    - `C:\dev\my-creator-site\css\style.css`
    - `C:\dev\my-creator-site\images\profile.svg`
    - `C:\dev\my-creator-site\images\logo.svg`
    - `C:\dev\my-creator-site\images\thumb-game.svg`
    - `C:\dev\my-creator-site\images\thumb-talk.svg`
    - `C:\dev\my-creator-site\images\thumb-music.svg`
    - `C:\dev\my-creator-site\js\main.js`
    - `C:\dev\my-creator-site\js\contents.js`
  - 연습 폴더 `C:\dev\hello\`: `C:\dev\hello\hello.html`, `C:\dev\hello\favorites.html`, `C:\dev\hello\tools.html`, `C:\dev\hello\links.html`, `C:\dev\hello\pages\back.html`, `C:\dev\hello\plan.html`, `C:\dev\hello\lab.html`, `C:\dev\hello\lab.js`
  - 파일 탐색기 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
  - VS Code(한국어 팩, Live Preview 확장 프로그램)와 Chrome이 설치되어 있어요.
  - Git이 설치되어 있고(`git --version` → `git version 2.56.0.windows.4`, 숫자는 달라도 돼요) `git config --global user.name`·`user.email`이 설정되어 있어요.
  - GitHub 계정과 공개(Public) 원격 저장소 `https://github.com/<내 아이디>/my-creator-site`가 있고, 로컬 저장소(`C:\dev\my-creator-site\.git\`, 숨김 폴더)와 연결되어 있어요.
  - GitHub Pages가 켜져 있어요: `https://<내 아이디>.github.io/my-creator-site/`
  - 오늘까지의 변경이 모두 커밋·푸시되어 있어요(VS Code 소스 제어 패널의 변경 0개).
  - VS Code에서 `C:\dev\my-creator-site` 폴더를 열어 두면 바로 시작할 수 있어요.
- 오늘 만들/바꿀 파일:
  - 다섯 페이지 — 로고 링크 다음에 주석 `<!-- 모바일에서만 보이는 메뉴 버튼. main.js가 aria-expanded 값을 바꿔요 -->`와 `<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">☰ 메뉴</button>`, `<nav id="site-nav" class="site-nav" aria-label="주 메뉴">`.
  - `C:\dev\my-creator-site\js\main.js` — 머리 주석 목록을 `1) 모바일 메뉴 열기/닫기  3) 시간대별 인사말`로(2는 Day 22), 3번 구역 **위에** `// ---------- 1. 모바일 메뉴 (Day 21) ----------` 구역(레퍼런스 원문).
  - `C:\dev\my-creator-site\css\style.css` — `4`: 주석 `/* 모바일: 메뉴 버튼은 보이고, 메뉴 목록은 숨겨져 있어요 */` + `.menu-toggle { margin-left: auto; }`(`.site-nav` 앞), `.site-nav`에 `display: none;`(맨 앞), `.site-nav.open { display: block; }`(주석 포함); `5`: `.button-outline` 선택자를 `.button-outline, .menu-toggle, .filters button`으로, 그 아래 `.filters button[aria-pressed="true"] { background: var(--accent); color: var(--accent-text); }`; `6`: 주석 `/* 영상 목록: 필터 + 검색 */` + `.filters { display: flex; flex-wrap: wrap; gap: 0.5rem; }`(`.video-frame`·소개 규칙 다음, `.schedule-table` 앞 — 레퍼런스 순서); `8`: Day 13의 주석 `/* 메뉴 목록은 가로로 늘어놔요 */`를 레퍼런스 원문 `/* 메뉴 버튼은 숨기고, 메뉴 목록은 가로로 늘어놔요 */`로 바꾸고 `h1` 규칙 바로 다음으로 옮긴 뒤, 그 주석 아래에 `.menu-toggle { display: none; }`를 새로 넣고, `.site-nav`에 `display: block;`(맨 앞)을 더해요 — 이로써 768px 구역의 메뉴 부분이 레퍼런스와 같아짐.
  - `C:\dev\my-creator-site\contents.html` — 안내 문장 다음, `<h2>영상 목록</h2>` 앞에 주석 `<!-- 버튼 4개를 감싼 상자 하나에만 클릭 이벤트를 달아요 (이벤트 위임, Day 21) -->` + `<div id="category-filters" class="filters" role="group" aria-label="카테고리 선택">` 버튼 4개(`data-category` `all`·`game`·`talk`·`music`, 글자 전체·게임·토크·음악, `aria-pressed`는 전체만 `true`).
  - `C:\dev\my-creator-site\js\contents.js` — 요소 구역 끝에 `const filterBox = document.querySelector('#category-filters');`, `let allVideos` 바로 아래에 `let selectedCategory = 'all';`(상태 주석을 `// 지금 상태: 전체 영상, 선택한 카테고리`로), 파일 끝 `render();` 위에 위임 리스너(레퍼런스 원문과 같되 마지막 줄 `render();` 대신 `console.log('선택한 카테고리:', selectedCategory); // Day 23에서 render()로 바꿔요`).
- 끝 상태 확인: 기기 모드 360px: 메뉴 목록이 숨고 오른쪽에 `☰ 메뉴` 버튼, 누르면 메뉴가 펼쳐지고 다시 누르면 접힘, Elements에서 `aria-expanded`가 `true`/`false`로 바뀜; 768px 이상: 버튼이 없고 메뉴가 가로; 영상 페이지: 카테고리 버튼을 누르면 그 버튼만 보라로 채워지고 콘솔에 `선택한 카테고리: game`(카드는 아직 그대로); 다섯 페이지 콘솔 오류 0개; GitHub에 `Day 21` 커밋.
- 과제: 1) 빈 곳 클릭(쉬움): 버튼 사이 빈 곳을 눌렀을 때 콘솔에 아무것도 안 나오는 이유 → 정답 요지: `closest('button')`이 `null` → `return`. 2) 위임 없이 쓰면?(보통): 버튼마다 리스너를 다는 코드를 콘솔에서 써 보고 위임과 비교(파일은 그대로) → 정답 요지: 코드와 "버튼이 늘어도 리스너 하나" 장점. 3) (도전) 키보드만으로 메뉴 열기: 360px에서 `Tab`으로 버튼까지 가서 `Enter`/`Space` → 정답 요지: `<button>`이라 키보드가 저절로 됨(`div`였다면 안 됨).
- 용어(사전 담당): 이벤트, 이벤트 리스너, 이벤트 위임, 햄버거 메뉴, data 속성, 복합 선택자
- 자주 막히는 곳 후보: 버튼을 눌러도 안 열림(`.site-nav.open`을 `.site-nav .open`으로 띄어 씀, `#site-nav` id 빠짐); 한 페이지에서만 `Uncaught TypeError: Cannot read properties of null (reading 'addEventListener')`(그 페이지에 버튼을 안 넣음 — 원문 실측); 넓은 화면에서 메뉴가 사라짐(768px 규칙의 `display: block` 빠짐); `addEventListener('Click', …)`·`'onclick'`; 콜백 자리에 `toggleMenu()`처럼 괄호를 붙여 바로 실행; `dataset.category`가 `undefined`(`data-catagory` 철자); 버튼 글자 `☰`가 네모로 보임(글꼴 — 실기 미확인); 기기 모드에서 메뉴를 연 채 넓히면 상태가 남음(정상).
- 레퍼런스 대응: `main.js` `1. 모바일 메뉴`(완성), 다섯 페이지의 `.menu-toggle` 버튼·주석·nav `id`/`aria-label`(완성), `contents.html` `#category-filters`와 주석(완성), `style.css` `.menu-toggle`·`.site-nav`·`.site-nav.open`·`.filters`·필터 버튼 규칙·768px의 `.menu-toggle`·`.site-nav`(완성), `contents.js` `filterBox`·`selectedCategory`. 중간 단계 — 레퍼런스와 다름: 위임 리스너 끝이 `console.log`(Day 23에 `render()`), `.toolbar` 상자 없음(Day 23), 머리 주석 목록에 2) 없음(Day 22).

## Day 22 — 다크 모드와 localStorage (100분)
- 목표:
  - **다크 모드** 설계: `<html data-theme="dark">`가 붙으면 CSS 변수 값만 바뀜(`:root[data-theme="dark"] { … }`, Day 14 변수 덕분), `color-scheme`(입력칸·스크롤바 색).
  - `document.documentElement`(html 요소)와 `dataset.theme`(Day 21 data 속성 복습).
  - **localStorage**: `localStorage.setItem('theme', 'dark')`, `getItem('theme')`(없으면 `null`), 글자만 저장, 브라우저·주소마다 따로(파일로 연 사이트와 Live Preview·배포 주소는 서로 다른 저장소 — "주소 앞부분이 다르면 따로"로만 설명). 개발자 도구 **Application**(애플리케이션) → Local storage에서 보고 지우기(Edge에서 연 페이지 — 0.2절. 저장소가 주소마다 따로라서 Live Preview 주소를 Edge에 붙여 연 페이지와 VS Code 미리 보기 창도 서로 다를 수 있다는 점까지 실측해 적어요).
  - **prefers-color-scheme**와 `window.matchMedia('(prefers-color-scheme: dark)').matches`: 처음 방문이면 Windows 설정(**설정 → 개인 설정 → 색 → 모드 선택**, 이름은 버전에 따라 다를 수 있음)을 따름. 개발자 도구 **Rendering**의 prefers-color-scheme 흉내 기능(위치 실측).
  - 함수로 나누기: `getSavedTheme`, `saveTheme`, `applyTheme`(Day 18). 삼항 연산자(Day 16)로 다음 테마 고르기.
  - 버튼 글자는 고정 `🌙 다크 모드`, 켜졌는지는 `aria-pressed`로(스크린 리더가 "눌림"으로 읽음) — 라벨을 바꾸지 않는 이유.
  - `try/catch` 없이 쓰고 "저장소를 못 쓰는 브라우저 대비는 Day 25에서 배워요" 한 줄 예고.
- 이미 배운 것: Day 21 이벤트 리스너·dataset·setAttribute·`aria-pressed`·`String()`·햄버거 메뉴 코드; Day 18 함수·return; Day 16 조건문·삼항 연산자·`===`·`||`; Day 15 null·불리언; Day 14 CSS 변수·transition; Day 13 미디어 쿼리; Day 11 속성 선택자.
- 시작 상태: (Day 21 끝 상태와 같아요)
  - 프로젝트 `C:\dev\my-creator-site\`:
    - `C:\dev\my-creator-site\index.html`
    - `C:\dev\my-creator-site\about.html`
    - `C:\dev\my-creator-site\contents.html`
    - `C:\dev\my-creator-site\schedule.html`
    - `C:\dev\my-creator-site\contact.html`
    - `C:\dev\my-creator-site\css\style.css`
    - `C:\dev\my-creator-site\images\profile.svg`
    - `C:\dev\my-creator-site\images\logo.svg`
    - `C:\dev\my-creator-site\images\thumb-game.svg`
    - `C:\dev\my-creator-site\images\thumb-talk.svg`
    - `C:\dev\my-creator-site\images\thumb-music.svg`
    - `C:\dev\my-creator-site\js\main.js`
    - `C:\dev\my-creator-site\js\contents.js`
  - 연습 폴더 `C:\dev\hello\`: `C:\dev\hello\hello.html`, `C:\dev\hello\favorites.html`, `C:\dev\hello\tools.html`, `C:\dev\hello\links.html`, `C:\dev\hello\pages\back.html`, `C:\dev\hello\plan.html`, `C:\dev\hello\lab.html`, `C:\dev\hello\lab.js`
  - 파일 탐색기 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
  - VS Code(한국어 팩, Live Preview 확장 프로그램)와 Chrome이 설치되어 있어요.
  - Git이 설치되어 있고(`git --version` → `git version 2.56.0.windows.4`, 숫자는 달라도 돼요) `git config --global user.name`·`user.email`이 설정되어 있어요.
  - GitHub 계정과 공개(Public) 원격 저장소 `https://github.com/<내 아이디>/my-creator-site`가 있고, 로컬 저장소(`C:\dev\my-creator-site\.git\`, 숨김 폴더)와 연결되어 있어요.
  - GitHub Pages가 켜져 있어요: `https://<내 아이디>.github.io/my-creator-site/`
  - 오늘까지의 변경이 모두 커밋·푸시되어 있어요(VS Code 소스 제어 패널의 변경 0개).
  - VS Code에서 `C:\dev\my-creator-site` 폴더를 열어 두면 바로 시작할 수 있어요.
- 오늘 만들/바꿀 파일:
  - 다섯 페이지 — `menu-list` 끝에 `<li><button class="theme-toggle" type="button" aria-pressed="false">🌙 다크 모드</button></li>`.
  - `C:\dev\my-creator-site\css\style.css` — `1`: `:root` 끝에 `color-scheme: light;`(주석 포함), 그 아래 주석 `/* 다크 모드: main.js가 <html data-theme="dark">를 붙이면 변수 값만 바뀌어요 */` + `:root[data-theme="dark"] { --bg: #14121f; --surface: #1f1c33; --text: #ece9ff; --muted: #b3aed6; --accent: #8f83ff; --accent-text: #14121f; --link: #b0a8ff; --border: #3a3660; color-scheme: dark; }`(error·success·highlight는 Day 24·26); `5`: `.button-outline, .menu-toggle, .theme-toggle, .filters button`, `.theme-toggle[aria-pressed="true"], .filters button[aria-pressed="true"]`.
  - `C:\dev\my-creator-site\js\main.js` — 머리 주석 최종(`1) 모바일 메뉴 열기/닫기  2) 다크 모드  3) 시간대별 인사말`), 1번과 3번 사이에 `// ---------- 2. 다크 모드 (Day 22) ----------` 구역: `themeButton`, `getSavedTheme() { return localStorage.getItem('theme'); }`, `saveTheme(theme) { localStorage.setItem('theme', theme); }`(중간 — try/catch 없음, 주석 "Day 25에서 감싸요"), `applyTheme`·`savedTheme`·`systemPrefersDark`·if/else·클릭 리스너(레퍼런스 원문).
- 끝 상태 확인: `🌙 다크 모드`를 누르면 배경이 어둡고 글자가 밝아지며 버튼이 보라로 채워짐(`aria-pressed="true"`); 다른 페이지로 가도, 새로 고침해도 유지; Application → Local storage에 `theme`=`dark`; `theme`을 지우면 Windows 다크/라이트 설정을 따름; 360px 메뉴 안에서도 버튼이 보임; GitHub에 `Day 22` 커밋.
- 과제: 1) 처음 방문 흉내(쉬움): Application에서 `theme`을 지우고 Windows(또는 Rendering) 다크·라이트를 바꿔 새로 고침 → 정답 요지: 저장값이 없으면 `systemPrefersDark`를 따름. 2) 저장소는 주소마다(보통): 더블클릭(`file://`)으로 연 홈과 Live Preview로 연 홈에서 테마를 각각 바꿔 보고 서로 안 따라오는 이유 → 정답 요지: 주소 앞부분이 달라 저장소가 따로. 3) (도전) 다크 색 하나 고르기: `:root[data-theme="dark"]`의 `--accent`를 바꿔 보고 대비가 충분한지(글자가 잘 읽히는지) 확인 후 되돌리기 → 정답 요지: 배경과 비슷하면 읽기 어려움, Day 28 Lighthouse가 대비를 검사함 예고.
- 용어(사전 담당): 다크 모드, localStorage, prefers-color-scheme
- 자주 막히는 곳 후보: 다크로 안 바뀜(`:root[data-theme="dark"]`를 `:root [data-theme="dark"]`로 띄어 씀); 일부만 밝게 남음(Day 14에서 `var()`로 안 바꾼 색 코드 — `Ctrl + F`로 `#` 찾기); 새로 고침하면 밝아짐(`saveTheme` 호출 빠짐, 키 `'Theme'` 대소문자); InPrivate·시크릿 창에서는 창을 닫으면 사라짐; Edge와 Chrome이 따로 기억; 버튼 글자가 안 바뀐다고 오해(설계 설명); 페이지를 열 때 잠깐 밝게 깜빡임(defer라 늦게 적용 — 정상 범위, 이 교재에서는 다루지 않음); 문의 폼 입력칸이 다크에서 흰색(`color-scheme` 빠짐 — Day 23에 입력칸 스타일).
- 레퍼런스 대응: `style.css` `:root`의 `color-scheme`, `:root[data-theme="dark"]`(error·success·highlight 제외), theme-toggle 선택자들; 다섯 페이지 `.theme-toggle` 버튼(완성); `main.js` 머리 주석(완성)·`2. 다크 모드`(try/catch 제외). 중간 단계 — 레퍼런스와 다름: `getSavedTheme`·`saveTheme`에 try/catch와 그 주석 없음(Day 25).

## Day 23 — 필터와 검색 (100분)
- 목표:
  - **input 이벤트**(글자를 칠 때마다), `input.value`, `<input type="search">` + `label for`, `placeholder`(칸이 비었을 때 흐리게 보이는 예시 글자 — label을 대신하지 않음), `autocomplete="off"`(Day 8 autocomplete 복습).
  - **문자열 메서드** `trim()`(앞뒤 빈칸), `toLowerCase()`(영어 소문자로 — `Q&A` 검색), `includes()`(들어 있나).
  - 상태 변수 + 다시 그리기 패턴: `selectedCategory`·`searchText`를 바꾸고 `render()`가 `getVisibleVideos()`(Day 19 filter + `&&`/`||`)로 걸러 그림. 카테고리와 검색을 함께 적용.
  - 결과 개수 문장 `` `영상 ${videos.length}개` ``, 빈 목록 안내 — **hidden 속성**과 `element.hidden = 참/거짓`. CSS `[hidden] { display: none !important; }`가 필요한 이유(다른 `display` 규칙에 지지 않게, `!important`는 꼭 필요할 때만).
  - 한글 검색: 글자를 조합하는 중에도 input 이벤트가 난다는 것(정상).
  - 입력칸 공통 모양(`input, select, textarea`)과 `:focus` 테두리 — 문의 폼에도 함께 적용됨.
- 이미 배운 것: Day 21 이벤트 리스너·위임·dataset·aria-pressed·`#category-filters`·`selectedCategory`; Day 10 자손 선택자(`.search-box label`); Day 20 render·createCard·textContent; Day 19 filter·콜백; Day 18 함수·return; Day 16 `===`·`&&`·`||`·템플릿 리터럴; Day 12~13 Grid·미디어 쿼리; Day 8 label·input.
- 시작 상태: (Day 22 끝 상태와 같아요)
  - 프로젝트 `C:\dev\my-creator-site\`:
    - `C:\dev\my-creator-site\index.html`
    - `C:\dev\my-creator-site\about.html`
    - `C:\dev\my-creator-site\contents.html`
    - `C:\dev\my-creator-site\schedule.html`
    - `C:\dev\my-creator-site\contact.html`
    - `C:\dev\my-creator-site\css\style.css`
    - `C:\dev\my-creator-site\images\profile.svg`
    - `C:\dev\my-creator-site\images\logo.svg`
    - `C:\dev\my-creator-site\images\thumb-game.svg`
    - `C:\dev\my-creator-site\images\thumb-talk.svg`
    - `C:\dev\my-creator-site\images\thumb-music.svg`
    - `C:\dev\my-creator-site\js\main.js`
    - `C:\dev\my-creator-site\js\contents.js`
  - 연습 폴더 `C:\dev\hello\`: `C:\dev\hello\hello.html`, `C:\dev\hello\favorites.html`, `C:\dev\hello\tools.html`, `C:\dev\hello\links.html`, `C:\dev\hello\pages\back.html`, `C:\dev\hello\plan.html`, `C:\dev\hello\lab.html`, `C:\dev\hello\lab.js`
  - 파일 탐색기 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
  - VS Code(한국어 팩, Live Preview 확장 프로그램)와 Chrome이 설치되어 있어요.
  - Git이 설치되어 있고(`git --version` → `git version 2.56.0.windows.4`, 숫자는 달라도 돼요) `git config --global user.name`·`user.email`이 설정되어 있어요.
  - GitHub 계정과 공개(Public) 원격 저장소 `https://github.com/<내 아이디>/my-creator-site`가 있고, 로컬 저장소(`C:\dev\my-creator-site\.git\`, 숨김 폴더)와 연결되어 있어요.
  - GitHub Pages가 켜져 있어요: `https://<내 아이디>.github.io/my-creator-site/`
  - 오늘까지의 변경이 모두 커밋·푸시되어 있어요(VS Code 소스 제어 패널의 변경 0개).
  - VS Code에서 `C:\dev\my-creator-site` 폴더를 열어 두면 바로 시작할 수 있어요.
- 오늘 만들/바꿀 파일:
  - `C:\dev\my-creator-site\contents.html` — 안내 문장을 `<p>카테고리를 고르거나 제목으로 검색해 보세요.</p>`로; 주석과 `#category-filters`를 `<div class="toolbar">`로 감싸고 그 안 끝에 `<div class="search-box"><label for="search">제목 검색</label><input id="search" type="search" placeholder="예: 게임" autocomplete="off"></div>`; `<h2>영상 목록</h2>` 다음에 `<p id="result-count" class="result-count"></p>`(aria-live는 Day 24 과제), `<p id="empty-message" hidden>조건에 맞는 영상이 없어요. 다른 검색어를 써 보세요.</p>`.
  - `C:\dev\my-creator-site\js\contents.js` — 머리 주석 둘째 줄을 "영상 데이터를 카드로 그리고, 카테고리 버튼과 검색창으로 걸러서 보여 줘요"로, 요소 구역 끝에 `searchInput`·`countElement`·`emptyMessage`, `selectedCategory` 아래에 `let searchText = '';`(상태 주석 `// 지금 상태: 전체 영상, 선택한 카테고리, 검색어`), `getVisibleVideos()`(레퍼런스 원문, Day 19·18 주석), `render()`에 `const videos = getVisibleVideos();`·개수·`emptyMessage.hidden`(레퍼런스와 같되 `isLoaded` 검사 없음), 위임 리스너 끝을 `render();`로, `// 검색창: 글자를 입력할 때마다 바로 걸러요 (Day 23)` input 리스너(레퍼런스 원문).
  - `C:\dev\my-creator-site\css\style.css` — `2`: `img` 앞에 `[hidden] { display: none !important; }`(주석 포함); `6` 영상 목록 구역: `.filters` 앞에 `.toolbar`, `.filters` 다음에 `.search-box label`, `input, select, textarea { … }`, `input:focus, select:focus, textarea:focus { border-color: var(--accent); }`, `.result-count`(레퍼런스 값과 순서); `8`: `.about-intro` 다음에 `.toolbar { grid-template-columns: 1fr minmax(240px, 320px); align-items: end; }`.
- 끝 상태 확인: 영상 페이지 처음 `영상 6개`; **게임** → 2장 `영상 2개`; 검색 `기타` → 1장; 게임 + `기타` → 0장 `영상 0개` + 빈 목록 안내; `q&a` → `구독자 1000명 기념 Q&A`; **전체** + 빈 검색 → 6장; 768px 이상에서 버튼과 검색칸이 한 줄; 문의 폼 칸이 넓고 둥근 모양; GitHub에 `Day 23` 커밋.
- 과제: 1) 대소문자(쉬움): `toLowerCase()`를 한쪽에서 빼면 `q&a`가 왜 안 찾아지는지 → 정답 요지: `'Q&A'.includes('q&a')`는 false, 둘 다 소문자로 맞춤. 2) 빈칸(보통): 검색어 `  게임  `이 찾아지는 이유와 `trim()`을 빼면? → 정답 요지: 앞뒤 빈칸이 제목에 없어서 0개. 3) (도전) 카테고리 이름(게임·토크·음악)도 검색되게 하려면 `matchesSearch`를 어떻게 바꿀지 코드만 쓰고 끝 상태엔 넣지 않기 → 정답 요지: `|| categoryNames[video.category].includes(searchText)`.
- 용어(사전 담당): input 이벤트, hidden 속성, 문자열 메서드
- 자주 막히는 곳 후보: 검색해도 그대로(input 리스너의 `#search` 오타, `render()` 안 부름); 카테고리를 누르면 검색어가 무시됨(검색어를 상태 변수에 안 남김); 빈 목록 안내가 늘 보이거나 안 보임(`[hidden]` 규칙 없음, `hidden` 값 반대로); `영상 undefined개`(`videos.length` 철자); `Includes`·`tolowercase` 대소문자; 한글을 칠 때 중간 글자로 걸러짐(정상); 검색칸 오른쪽 ✕ 버튼(브라우저 기본, type=search) 누르면 input 이벤트로 다시 6장(정상).
- 레퍼런스 대응: `contents.html` toolbar·search-box·`#result-count`(aria-live 제외)·`#empty-message`·안내 문장(완성), `contents.js` `searchInput`·`countElement`·`emptyMessage`·`searchText`·`getVisibleVideos`·위임 리스너·input 리스너(완성), `style.css` `[hidden]`·`.toolbar`·`.search-box label`·입력칸 규칙·`:focus`·`.result-count`·768px `.toolbar`(완성). 중간 단계 — 레퍼런스와 다름: `render()`에 `isLoaded` 검사 없음(Day 25), `#result-count`에 `aria-live` 없음(Day 24 과제).

## Day 24 — 폼 검증 (120분)
- 목표:
  - **폼 검증**이 필요한 이유와 두 층(HTML 속성 + JS). HTML: `required`, `type="email"`, `pattern`; `novalidate`(브라우저 말풍선 대신 내 안내 문장).
  - **정규 표현식** 기초: `pattern="[A-Za-z0-9가-힣_]{2,20}"`(대괄호 = 허용 글자, `{2,20}` = 글자 수), JS `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` 한 조각씩 읽기(`^`·`$`·`[^…]`·`\s`·`+`·`\.`) + `.test(value)`. 정규식은 "모양 검사기"이고 완벽한 이메일 검사가 아니라는 것.
  - **제약 조건 검증 API**: `input.validity.patternMismatch`(pattern과 다르면 true) — 닉네임은 선택 입력이라 비었으면 통과.
  - `submit` 이벤트 + **preventDefault**(새로 고침·주소 바뀜 막기 — Day 8의 `?name=` 회수), 객체에 검사 함수 담기(`validators[input.id](input)` — Day 19 대괄호 표기 + Day 18 화살표 함수), `trim()`·`length`, 오류 문장 칸(`#name-error` 등), `aria-invalid`, `aria-describedby`(칸과 안내 문장 연결), `setAttribute`·`removeAttribute`·`getAttribute`, `classList.contains`, `focus()`(첫 오류 칸으로), `form.reset()`.
  - **aria-live**와 `role="status"`(같은 뜻): 글자가 바뀌면 스크린 리더가 읽음. 같은 문장이면 다시 쓰지 않는 이유.
  - CSS: 의사 클래스 `:empty`(오류 문장이 비면 자리도 차지하지 않게, Day 14 의사 클래스 복습), 상태 클래스 `is-error`·`is-success`.
  - 고치는 중 다시 검사: form 하나에 `input` 리스너(이벤트 위임 복습).
  - 연습용이라 실제로 전송하지 않음, 진짜 전송은 P2에서 서버를 만들어서 한다는 예고.
- 이미 배운 것: Day 23 input 이벤트·문자열 메서드(trim)·hidden; Day 21 이벤트 리스너·위임·setAttribute·aria 속성; Day 20 querySelector·textContent·className; Day 19 객체·대괄호 표기; Day 18 함수·화살표 함수·return; Day 17 배열·for...of·push; Day 16 조건문·템플릿 리터럴; Day 14 CSS 변수·의사 클래스; Day 21 복합 선택자(`.form-status.is-error`); Day 11 속성 선택자; Day 10 자손 선택자(`.field label`); Day 8 폼·label·input·select·textarea.
- 시작 상태: (Day 23 끝 상태와 같아요)
  - 프로젝트 `C:\dev\my-creator-site\`:
    - `C:\dev\my-creator-site\index.html`
    - `C:\dev\my-creator-site\about.html`
    - `C:\dev\my-creator-site\contents.html`
    - `C:\dev\my-creator-site\schedule.html`
    - `C:\dev\my-creator-site\contact.html`
    - `C:\dev\my-creator-site\css\style.css`
    - `C:\dev\my-creator-site\images\profile.svg`
    - `C:\dev\my-creator-site\images\logo.svg`
    - `C:\dev\my-creator-site\images\thumb-game.svg`
    - `C:\dev\my-creator-site\images\thumb-talk.svg`
    - `C:\dev\my-creator-site\images\thumb-music.svg`
    - `C:\dev\my-creator-site\js\main.js`
    - `C:\dev\my-creator-site\js\contents.js`
  - 연습 폴더 `C:\dev\hello\`: `C:\dev\hello\hello.html`, `C:\dev\hello\favorites.html`, `C:\dev\hello\tools.html`, `C:\dev\hello\links.html`, `C:\dev\hello\pages\back.html`, `C:\dev\hello\plan.html`, `C:\dev\hello\lab.html`, `C:\dev\hello\lab.js`
  - 파일 탐색기 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
  - VS Code(한국어 팩, Live Preview 확장 프로그램)와 Chrome이 설치되어 있어요.
  - Git이 설치되어 있고(`git --version` → `git version 2.56.0.windows.4`, 숫자는 달라도 돼요) `git config --global user.name`·`user.email`이 설정되어 있어요.
  - GitHub 계정과 공개(Public) 원격 저장소 `https://github.com/<내 아이디>/my-creator-site`가 있고, 로컬 저장소(`C:\dev\my-creator-site\.git\`, 숨김 폴더)와 연결되어 있어요.
  - GitHub Pages가 켜져 있어요: `https://<내 아이디>.github.io/my-creator-site/`
  - 오늘까지의 변경이 모두 커밋·푸시되어 있어요(VS Code 소스 제어 패널의 변경 0개).
  - VS Code에서 `C:\dev\my-creator-site` 폴더를 열어 두면 바로 시작할 수 있어요.
- 오늘 만들/바꿀 파일:
  - `C:\dev\my-creator-site\contact.html` — 레퍼런스 완성 모양(`head` 메타 제외): `head`에 `<script src="js/contact.js" defer></script>`; 주석 `<!-- novalidate: … (Day 24) -->` + `<form id="contact-form" class="contact-form" novalidate>`; 칸 `div`에 `class="field"`; 이름·이메일 `required` + `aria-describedby="name-error"`/`"email-error"`; 닉네임 `pattern` + 주석 + `aria-describedby="nickname-hint nickname-error"` + `<p id="nickname-hint" class="field-hint">…</p>`; 내용 label `내용 (10글자 이상)` + `required` + `aria-describedby`; 오류 문단 `<p id="…-error" class="field-error"></p>` 4개; 보내기 버튼 다음 주석 + `<p id="form-status" class="form-status" role="status"></p>`.
  - `C:\dev\my-creator-site\js\contact.js` — 새 파일, 레퍼런스 원문 그대로(142줄).
  - `C:\dev\my-creator-site\css\style.css` — `1`: `:root`에 `--error: #b3261e; --success: #1b6e3c;`, 다크에 `--error: #ff8a80; --success: #6fd49a;`(`--border` 다음); `6`: 주석 `/* 문의 폼 */` + `.contact-form` ~ `.form-status.is-success`(레퍼런스 원문, 방송 일정 규칙 다음·`7` 앞).
  - `C:\dev\my-creator-site\contents.html` — 과제 2: `#result-count`에 `aria-live="polite"`.
- 끝 상태 확인: 빈 채로 **보내기** → 이름·이메일·내용 칸 아래 빨간 안내 3개, 맨 아래 `입력 내용을 확인해 주세요. 고칠 곳이 3군데 있어요.`, 커서가 이름 칸으로; 주소에 `?`가 붙지 않음; 닉네임 `달빛 곰` → 닉네임 안내; 이메일 `abc` → 형식 안내; 칸을 고치면 그 안내가 바로 사라지고 개수 문장이 줄다가 0이면 사라짐; 모두 바르게 → 초록 `문의가 접수됐어요. 감사합니다! …` + 칸 비워짐; 다크 모드에서도 빨강·초록 글자가 읽힘; GitHub에 `Day 24` 커밋.
- 과제: 1) 정규식 퀴즈(쉬움): `달빛곰`, `moon_bear`, `달빛 곰`, `ㅋㅋ`, `a` 중 닉네임 pattern 통과 → 정답 요지: 통과 2개(`달빛곰`, `moon_bear`), 공백·자음만·1글자는 실패 이유(`가-힣`은 완성된 글자만). 2) 영상 개수 알림(보통): `#result-count`에 `aria-live="polite"` 넣기 → 정답 요지: `contents.html` 해당 줄 + 왜(카테고리를 바꿀 때 개수를 읽어 줌). 3) (도전) 이름 최대 20글자 규칙을 `validators.name`에 넣는 코드만 쓰고 끝 상태에는 넣지 않기 → 정답 요지: `if (value.length > 20) { return '이름은 20글자 이하로 적어 주세요.'; }`.
- 용어(사전 담당): 폼 검증, 정규 표현식, 제약 조건 검증 API, preventDefault, aria-live
- 자주 막히는 곳 후보: 보내기를 누르면 새로 고침되고 주소에 `?name=`(preventDefault 빠짐·contact.js 연결 안 됨); 브라우저 말풍선이 뜸(`novalidate` 빠짐); 안내 문장이 안 보임(`id="name-error"` 오타 → `Cannot set properties of null (setting 'textContent')`, 원문 실측); `validators[input.id] is not a function`(`fieldIds`와 id 불일치, 원문 실측); 이메일 정규식에서 `\` 빠뜨림; pattern 값이 잘못되면 콘솔에 나오는 경고(원문 실측); `ㅋㅋ`가 거부되는 이유; 성공 문장이 안 지워짐(정상 — 다음 보내기까지 남음); 다크 모드에서 오류색이 어두움(다크 `--error` 빠짐).
- 레퍼런스 대응: `contact.html`(head 메타 제외 완성), `js/contact.js`(완성), `style.css` 문의 폼 구역·`--error`·`--success`(밝게·어둡게, 완성), `contents.html` `#result-count`의 `aria-live`(완성).

## Day 25 — JSON과 fetch (120분)
- 목표:
  - **JSON**: 데이터만 담는 글자 형식(키·문자열은 큰따옴표, 마지막 쉼표·주석 금지). `contents.js` 배열을 `data\videos.json`으로 옮기기(VS Code가 문법 오류에 빨간 물결).
  - **비동기**: 파일을 받아 오는 동안 기다리지 않고 다른 일을 하는 방식. **fetch**(`fetch('data/videos.json')`), **async 함수**와 **await**(기다렸다가 결과 받기), `response.ok`·`response.status`(404 같은 응답 번호 — 상태 코드 용어는 P2), `await response.json()`(JSON 글자 → 배열). fetch가 "나중에 결과를 주는 약속(Promise)"을 돌려준다는 것은 한 줄만(P2 Day 8).
  - 오류 처리 **try...catch**, `throw new Error(…)`, `console.error`. 로딩 문장(`#load-status`)·오류 상자(`#load-error`, `role="alert"`)·`hidden`, `isLoaded`로 다 불러오기 전엔 그리지 않기(그 사이 누른 버튼·검색어는 기억).
  - `file://`의 제약: 더블클릭으로 연 페이지는 브라우저 보안 때문에 fetch로 다른 파일을 못 읽음 → **Live Preview**(http 주소)나 배포 주소로 열기. 콘솔 오류 원문(실측)과 오류 상자 확인.
  - 개발자 도구 **Network**(네트워크) 패널: `videos.json` 줄과 200·404 숫자 보기. fetch 때문에 Live Preview로 여는데 개발자 도구는 VS Code 미리 보기 창에서 안 열리므로, Live Preview 주소를 Edge 주소창에 붙여 열어요(0.2절, 오늘부터 Day 26·28·29도 같은 방법).
  - Day 22 예고 회수: `main.js`의 `getSavedTheme`·`saveTheme`를 try/catch로 감싸 저장소를 못 쓰는 브라우저에서도 사이트가 멈추지 않게.
- 이미 배운 것: Day 24 이벤트·폼; Day 23 render·getVisibleVideos·hidden·상태 변수; Day 22 localStorage·`getSavedTheme`/`saveTheme`; Day 20 DOM·textContent; Day 19 객체 배열·데이터 형식; Day 18 함수·return·이른 return; Day 16 조건문·템플릿 리터럴·`!`; Day 15 자료형·null; Day 2 Live Preview.
- 시작 상태: (Day 24 끝 상태와 같아요)
  - 프로젝트 `C:\dev\my-creator-site\`:
    - `C:\dev\my-creator-site\index.html`
    - `C:\dev\my-creator-site\about.html`
    - `C:\dev\my-creator-site\contents.html`
    - `C:\dev\my-creator-site\schedule.html`
    - `C:\dev\my-creator-site\contact.html`
    - `C:\dev\my-creator-site\css\style.css`
    - `C:\dev\my-creator-site\images\profile.svg`
    - `C:\dev\my-creator-site\images\logo.svg`
    - `C:\dev\my-creator-site\images\thumb-game.svg`
    - `C:\dev\my-creator-site\images\thumb-talk.svg`
    - `C:\dev\my-creator-site\images\thumb-music.svg`
    - `C:\dev\my-creator-site\js\main.js`
    - `C:\dev\my-creator-site\js\contents.js`
    - `C:\dev\my-creator-site\js\contact.js`
  - 연습 폴더 `C:\dev\hello\`: `C:\dev\hello\hello.html`, `C:\dev\hello\favorites.html`, `C:\dev\hello\tools.html`, `C:\dev\hello\links.html`, `C:\dev\hello\pages\back.html`, `C:\dev\hello\plan.html`, `C:\dev\hello\lab.html`, `C:\dev\hello\lab.js`
  - 파일 탐색기 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
  - VS Code(한국어 팩, Live Preview 확장 프로그램)와 Chrome이 설치되어 있어요.
  - Git이 설치되어 있고(`git --version` → `git version 2.56.0.windows.4`, 숫자는 달라도 돼요) `git config --global user.name`·`user.email`이 설정되어 있어요.
  - GitHub 계정과 공개(Public) 원격 저장소 `https://github.com/<내 아이디>/my-creator-site`가 있고, 로컬 저장소(`C:\dev\my-creator-site\.git\`, 숨김 폴더)와 연결되어 있어요.
  - GitHub Pages가 켜져 있어요: `https://<내 아이디>.github.io/my-creator-site/`
  - 오늘까지의 변경이 모두 커밋·푸시되어 있어요(VS Code 소스 제어 패널의 변경 0개).
  - VS Code에서 `C:\dev\my-creator-site` 폴더를 열어 두면 바로 시작할 수 있어요.
- 오늘 만들/바꿀 파일:
  - `C:\dev\my-creator-site\data\videos.json` — 새 파일, 레퍼런스 원문(6개, 한 줄에 한 객체).
  - `C:\dev\my-creator-site\js\contents.js` — 레퍼런스 완성: 머리 주석 최종, `let allVideos = [];`·바로 아래 `let isLoaded = false;`(상태 주석 레퍼런스 원문), 요소 구역 끝에 `loadStatus`·`loadError`, `render()` 맨 앞 `isLoaded` 검사(주석 포함), `// data/videos.json 불러오기 (Day 25: async/await, 오류 처리)` `loadVideos()`, 파일 끝 `render();` → `loadVideos();`.
  - `C:\dev\my-creator-site\contents.html` — `#result-count` 다음에 `<p id="load-status">영상 목록을 불러오는 중이에요…</p>`, `<p id="load-error" class="error-box" role="alert" hidden></p>`, 카드 주석을 `<!-- 카드는 contents.js가 data/videos.json을 읽어서 여기에 그려 줘요 -->`로.
  - `C:\dev\my-creator-site\css\style.css` — `6` 영상 목록 구역 `.result-count` 다음에 `.error-box { … }`(레퍼런스 값).
  - `C:\dev\my-creator-site\js\main.js` — `getSavedTheme`·`saveTheme`를 레퍼런스처럼 try/catch로 감싸고 주석 `// (try/catch는 Day 25에서 자세히 배워요) …` 포함(완성).
- 끝 상태 확인: Live Preview로 연 영상 페이지에 카드 6장(JSON에서 옴), Network에 `videos.json` 200; 더블클릭(`file://`)으로 열면 빨간 테두리 상자 `영상 목록을 불러오지 못했어요. 파일을 더블클릭해서 열었다면 …`와 콘솔 오류; JSON에 일부러 쉼표를 하나 더 넣으면 오류 상자(확인 뒤 되돌림); 필터·검색·다크 모드 그대로 동작; 배포 주소에서도 6장; GitHub에 `Day 25` 커밋.
- 과제: 1) 404 만들기(쉬움): fetch 주소를 `data/video.json`으로 틀려 오류 상자와 Network의 404를 보고 되돌리기 → 정답 요지: `response.ok`가 false → `throw` → catch. 2) JSON 오류 찾기(보통): 작은따옴표·마지막 쉼표·주석이 섞인 JSON 조각의 문제 3개 → 정답 요지: 고친 JSON. 3) (도전) 내 영상 넣기: `videos.json`에 내 영상 하나(`v007`, 내 `youtubeId`, 카테고리 셋 중 하나)를 넣고 카드 7장 확인 → 정답 요지: 객체 하나 + 앞 줄 끝 쉼표(글 내용이라 끝 상태에 남겨도 됨).
- 용어(사전 담당): JSON, fetch, 비동기, async 함수, await, try...catch
- 자주 막히는 곳 후보: 더블클릭으로 열어 오류 상자(정상 — Live Preview, 콘솔 원문 `Fetch API cannot load file:///…` 형태는 실측); "불러오는 중이에요…"에서 멈춤(`loadVideos();` 호출 빠짐, `isLoaded = true` 빠짐); JSON 문법 오류 원문(`SyntaxError: … is not valid JSON` 류, 실측); 404(`Data` 폴더 대소문자, `data` 폴더 밖); `await is only valid in async functions and the top level bodies of modules`(async 빠짐, 원문 실측); VS Code를 닫아 Live Preview가 꺼짐; 배포 뒤 예전 JSON이 보임(캐시·반영 대기); JSON 파일을 메모장으로 저장해 인코딩이 바뀜(VS Code로 저장).
- 레퍼런스 대응: `data/videos.json`(완성), `js/contents.js`(완성), `contents.html`(head 메타 제외 완성), `style.css` `.error-box`(완성), `js/main.js`(완성).

## Day 26 — 날짜와 타이머 (110분)
- 목표:
  - **Date** 더 깊게: `getDay()`(일요일 0 ~ 토요일 6), `new Date(now)`(복사), `setHours(시, 분, 0, 0)`, `getDate()`·`setDate()`(며칠 뒤), Date끼리 비교(`<=`)와 빼기(→ **밀리초** 숫자).
  - 시간 나누기: `Math.floor`(소수 버리기), `%`(Day 15)로 일·시·분·초, `String(n).padStart(2, '0')`로 두 자리(`pad` 함수), `'20:00'.split(':')` + `Number()`.
  - **setInterval**(함수, 1000)로 1초마다 다시 계산. 괄호 없이 함수 이름만 넘기는 이유(Day 21 콜백 복습).
  - `data\schedule.json`(`{ day, start, title }`, `day`는 getDay와 같은 숫자)과 표의 `data-day` 값 맞추기. 템플릿 리터럴 선택자 `` `tr[data-day="${today}"]` ``, `aria-current="date"`, `role="timer"`(1초마다 바뀌어도 계속 읽지 않음), `aria-labelledby`(구역 이름을 제목과 연결).
  - CSS **의사 요소** `::after` + `content: " (오늘)"`(색만으로 구분하지 않기), `font-variant-numeric: tabular-nums`(숫자가 흔들리지 않게).
  - 컴퓨터 시계 기준 문구(0.4절), fetch라 Live Preview로 열고, 콘솔·Elements로 확인할 때는 그 주소를 Edge에 붙여 연다(Day 25, 0.2절).
- 이미 배운 것: Day 25 fetch·async/await·try...catch·JSON·Live Preview; Day 21 data 속성·setAttribute·`classList.toggle`·복합 선택자(`tr.today`); Day 20 classList.add; Day 10 자손 선택자(`.next-box h2`); Day 20 querySelector·textContent; Day 19 객체(`{ item: item, time: time }`)·배열 인덱스; Day 18 함수·return; Day 17 for...of·`let next = null` 최솟값 찾기 모양; Day 16 Date·getHours·삼항 연산자·템플릿 리터럴; Day 15 `%`·`String()`·`Number()`·NaN; Day 11 속성 선택자; Day 9 id 선택자; Day 8 table.
- 시작 상태: (Day 25 끝 상태와 같아요)
  - 프로젝트 `C:\dev\my-creator-site\`:
    - `C:\dev\my-creator-site\index.html`
    - `C:\dev\my-creator-site\about.html`
    - `C:\dev\my-creator-site\contents.html`
    - `C:\dev\my-creator-site\schedule.html`
    - `C:\dev\my-creator-site\contact.html`
    - `C:\dev\my-creator-site\css\style.css`
    - `C:\dev\my-creator-site\data\videos.json`
    - `C:\dev\my-creator-site\images\profile.svg`
    - `C:\dev\my-creator-site\images\logo.svg`
    - `C:\dev\my-creator-site\images\thumb-game.svg`
    - `C:\dev\my-creator-site\images\thumb-talk.svg`
    - `C:\dev\my-creator-site\images\thumb-music.svg`
    - `C:\dev\my-creator-site\js\main.js`
    - `C:\dev\my-creator-site\js\contents.js`
    - `C:\dev\my-creator-site\js\contact.js`
  - 연습 폴더 `C:\dev\hello\`: `C:\dev\hello\hello.html`, `C:\dev\hello\favorites.html`, `C:\dev\hello\tools.html`, `C:\dev\hello\links.html`, `C:\dev\hello\pages\back.html`, `C:\dev\hello\plan.html`, `C:\dev\hello\lab.html`, `C:\dev\hello\lab.js`
  - 파일 탐색기 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
  - VS Code(한국어 팩, Live Preview 확장 프로그램)와 Chrome이 설치되어 있어요.
  - Git이 설치되어 있고(`git --version` → `git version 2.56.0.windows.4`, 숫자는 달라도 돼요) `git config --global user.name`·`user.email`이 설정되어 있어요.
  - GitHub 계정과 공개(Public) 원격 저장소 `https://github.com/<내 아이디>/my-creator-site`가 있고, 로컬 저장소(`C:\dev\my-creator-site\.git\`, 숨김 폴더)와 연결되어 있어요.
  - GitHub Pages가 켜져 있어요: `https://<내 아이디>.github.io/my-creator-site/`
  - 오늘까지의 변경이 모두 커밋·푸시되어 있어요(VS Code 소스 제어 패널의 변경 0개).
  - VS Code에서 `C:\dev\my-creator-site` 폴더를 열어 두면 바로 시작할 수 있어요.
- 오늘 만들/바꿀 파일:
  - `C:\dev\my-creator-site\data\schedule.json` — 새 파일, 레퍼런스 원문(4개).
  - `C:\dev\my-creator-site\js\schedule.js` — 새 파일, 레퍼런스 원문 그대로(100줄).
  - `C:\dev\my-creator-site\schedule.html` — 레퍼런스 완성 모양(`head` 메타 제외): `head`에 schedule.js script, 안내 문장 `모든 시간은 한국 시간이에요. 오늘 요일은 표에서 색으로 표시돼요.`, 표 앞 `<section class="next-box" aria-labelledby="next-heading">`(h2 `다음 방송` + 주석 + `<p id="next-broadcast" role="timer"><span id="next-info"></span> <strong id="next-remaining"></strong></p>`), 표에 `id="schedule-table"`, tbody 주석 + 행마다 `data-day`(월 1 … 토 6, 일 0).
  - `C:\dev\my-creator-site\css\style.css` — `1`: `:root`에 `--highlight: #fff3c4;`(주석 "오늘 요일 강조"), 다크에 `--highlight: #4a3f12;`; `6`: 주석 `/* 방송 일정 */` 아래 `.schedule-table` 앞에 `.next-box`·`.next-box h2`·`.next-box p`·`#next-remaining`, `.schedule-table thead th` 다음에 `.schedule-table tr.today`·`.schedule-table tr.today th::after`(레퍼런스 원문).
- 끝 상태 확인: Live Preview로 연 일정 페이지에서 오늘 요일 행이 노란 배경 + 굵게 + `월요일 (오늘)`처럼 표시(휴방인 날도 강조); "다음 방송" 상자에 `수요일 21:00 · 수요일 수다 타임 · 시작까지`와 1초마다 줄어드는 큰 숫자(`1일 02:03:04` 모양, 하루 안이면 `02:03:04`); 다크 모드에서 강조 행이 어두운 노랑; 더블클릭(`file://`)이면 오늘 강조는 되고 상자에 `방송 일정을 불러오지 못했어요. 아래 표를 확인해 주세요.`; GitHub에 `Day 26` 커밋.
- 과제: 1) 손으로 계산(쉬움): `formatRemaining(90061000)` → 정답 요지: `1일 01:01:01`(90061초 = 1일 + 1시간 + 1분 + 1초). 2) `% 7` 읽기(보통): 오늘 토요일(6), 방송 월요일(1)일 때 `(1 - 6 + 7) % 7` → 정답 요지: 2일 뒤, `+ 7`은 음수를 막음. 3) (도전) 일요일 방송을 추가하려면 고칠 곳 두 군데(schedule.json에 `{ "day": 0, … }`, 표의 일요일 행) → 정답 요지: 두 파일 코드, 실험 뒤 되돌리기(또는 내 일정으로 유지 — 글 내용).
- 용어(사전 담당): setInterval, 밀리초, 의사 요소
- 자주 막히는 곳 후보: 숫자가 안 움직임(`setInterval(updateCountdown(), 1000)` 괄호); 시간이 몇 시간 어긋남(PC 시간대 — **설정 → 시간 및 언어 → 날짜 및 시간**에서 `(UTC+09:00) 서울`, 메뉴 이름 버전에 따라 다를 수 있음); 강조가 하루 밀림(`data-day` 일요일 0을 7로 씀); `NaN:NaN:NaN`(start를 `"20시"`처럼 씀); 강조 행이 안 보임(`tr.today` 띄어쓰기·`--highlight` 빠짐); 노트북 절전 뒤 숫자가 바로 맞음(1초마다 새로 계산하기 때문 — 정상); 더블클릭으로 열어 카운트다운이 없음(Day 25 복습).
- 레퍼런스 대응: `data/schedule.json`(완성), `js/schedule.js`(완성), `schedule.html`(head 메타 제외 완성), `style.css` 방송 일정 구역·`--highlight`(완성).

## Day 27 — OBS 오버레이 위젯 (120분)
- 목표:
  - **오버레이**: 방송 화면 위에 겹쳐 보이는 웹페이지. **OBS Studio**의 **브라우저 소스**가 웹페이지를 화면 한 겹으로 띄움.
  - `overlay` 폴더에 독립 페이지 3파일(`countdown.html`·`countdown.css`·`countdown.js`) — 사이트의 `style.css`·`main.js`를 쓰지 않는 이유(메뉴·배경이 방송에 나오면 안 됨). 같은 폴더 파일은 이름만 쓰는 상대 경로.
  - 투명 배경 `html, body { background: transparent; }`, `overflow: hidden`, `text-shadow`(밝은 화면에서도 읽히게). 일반 브라우저로 열면 흰 바탕에 흰 글자라 흐린 것이 정상.
  - 화면 크기에 맞는 글자: **vw**·`vh` 단위, **clamp**(최소, 기본, 최대). `min-height: 100vh` + flex 세로 가운데.
  - **URL 파라미터** `?title=저녁 방송&start=20:00`(`?`로 시작, `&`로 구분, 빈칸은 `%20`도 됨), `location.search`, **URLSearchParams**의 `get()`, `||`로 기본값(Day 16 `||` 응용: 앞이 비면 뒤).
  - 입력 검사 `isValidStart`: `split(':')` 길이·빈 칸 확인, `Number()`, `NaN`은 어떤 비교도 거짓(Day 15), 시 0~23·분 0~59.
  - 타이머 멈추기: `let timerId = null;` → `timerId = setInterval(update, 1000)` → 지나면 `clearInterval(timerId)` + `곧 시작해요!`. 잘못된 주소면 `classList.add('hint')` + 사용법 문장.
  - OBS 설치(선택, 작성 기준 33.0.1, `https://obsproject.com/`, 사용자 계정 컨트롤 창): **소스 목록**의 **+** → **브라우저** → 이름 → 속성 창 **URL**에 배포 주소(`https://<내 아이디>.github.io/my-creator-site/overlay/countdown.html?title=저녁%20방송&start=20:00`) 또는 VS Code가 켜져 있을 때의 Live Preview 주소, **너비** 1920·**높이** 1080(기본 800×600, external-facts 5절). **로컬 파일**을 체크하면 주소 뒤 값을 붙이기 어렵다는 것(실기 미확인 — URL 칸 사용 권장). OBS 화면·메뉴는 실기 미확인 표시. OBS를 설치하지 않아도 브라우저로 끝까지 확인할 수 있게 해요.
  - 컴퓨터 시계 기준 문구(0.4절).
- 이미 배운 것: Day 26 Date·setHours·setInterval·밀리초·`Math.floor`·`%`·`pad`·`padStart`·`split`·`Number`·role="timer"; Day 21 복합 선택자(`.countdown.hint`); Day 20 querySelector·textContent·`classList.add`; Day 18 함수·return; Day 16 `||`·`&&`·`!==`·조건문·템플릿 리터럴; Day 15 NaN; Day 14 배포 주소; Day 13 viewport·미디어 쿼리 없이 크기 맞추기의 필요; Day 11 Flexbox·flex-direction; Day 5 상위 폴더 `../`(Day 28에 씀).
- 시작 상태: (Day 26 끝 상태와 같아요)
  - 프로젝트 `C:\dev\my-creator-site\`:
    - `C:\dev\my-creator-site\index.html`
    - `C:\dev\my-creator-site\about.html`
    - `C:\dev\my-creator-site\contents.html`
    - `C:\dev\my-creator-site\schedule.html`
    - `C:\dev\my-creator-site\contact.html`
    - `C:\dev\my-creator-site\css\style.css`
    - `C:\dev\my-creator-site\data\videos.json`
    - `C:\dev\my-creator-site\data\schedule.json`
    - `C:\dev\my-creator-site\images\profile.svg`
    - `C:\dev\my-creator-site\images\logo.svg`
    - `C:\dev\my-creator-site\images\thumb-game.svg`
    - `C:\dev\my-creator-site\images\thumb-talk.svg`
    - `C:\dev\my-creator-site\images\thumb-music.svg`
    - `C:\dev\my-creator-site\js\main.js`
    - `C:\dev\my-creator-site\js\contents.js`
    - `C:\dev\my-creator-site\js\contact.js`
    - `C:\dev\my-creator-site\js\schedule.js`
  - 연습 폴더 `C:\dev\hello\`: `C:\dev\hello\hello.html`, `C:\dev\hello\favorites.html`, `C:\dev\hello\tools.html`, `C:\dev\hello\links.html`, `C:\dev\hello\pages\back.html`, `C:\dev\hello\plan.html`, `C:\dev\hello\lab.html`, `C:\dev\hello\lab.js`
  - 파일 탐색기 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
  - VS Code(한국어 팩, Live Preview 확장 프로그램)와 Chrome이 설치되어 있어요.
  - Git이 설치되어 있고(`git --version` → `git version 2.56.0.windows.4`, 숫자는 달라도 돼요) `git config --global user.name`·`user.email`이 설정되어 있어요.
  - GitHub 계정과 공개(Public) 원격 저장소 `https://github.com/<내 아이디>/my-creator-site`가 있고, 로컬 저장소(`C:\dev\my-creator-site\.git\`, 숨김 폴더)와 연결되어 있어요.
  - GitHub Pages가 켜져 있어요: `https://<내 아이디>.github.io/my-creator-site/`
  - 오늘까지의 변경이 모두 커밋·푸시되어 있어요(VS Code 소스 제어 패널의 변경 0개).
  - VS Code에서 `C:\dev\my-creator-site` 폴더를 열어 두면 바로 시작할 수 있어요.
- 오늘 만들/바꿀 파일:
  - `C:\dev\my-creator-site\overlay\countdown.html` — 새 파일, 레퍼런스 원문에서 파비콘 주석·`<link rel="icon" …>` 두 줄만 뺀 것(Day 28에 추가).
  - `C:\dev\my-creator-site\overlay\countdown.css` — 새 파일, 레퍼런스 원문 그대로.
  - `C:\dev\my-creator-site\overlay\countdown.js` — 새 파일, 레퍼런스 원문 그대로.
- 끝 상태 확인: Live Preview로 `overlay/countdown.html?title=저녁 방송&start=20:00`을 열면 제목 `저녁 방송`과 `HH:MM:SS`가 1초마다 줄어듦(흰 글자 + 그림자); 이미 지난 시각이면 `곧 시작해요!`; `start`가 없거나 `25:99`면 작은 글자 사용법 문장; 배포 주소에서도 같음; (OBS를 설치했다면) OBS 미리 보기에서 배경 없이 글자만 보임; GitHub에 `Day 27` 커밋.
- 과제: 1) 주소 예측(쉬움): `start=24:00`, `start=ab:cd`, `start=7:5`, `start` 없음 → 정답 요지: 사용법 / 사용법 / 동작(07:05 — `Number('5')`는 5) / 사용법·기본 제목 `방송 시작까지`. 2) 내 방송 주소 만들기(보통): 내 아이디·한글 제목·시각으로 OBS용 URL → 정답 요지: 예시 주소와 `%20`·`&` 규칙. 3) (도전) 남은 시간이 60초 미만이면 숫자를 노랗게: `update()`에 조건 하나와 CSS 한 규칙을 써 보고 끝 상태엔 넣지 않기 → 정답 요지: `if (remaining < 60000) { countdownElement.classList.add('soon'); }` + `.countdown.soon { color: #ffd66b; }`.
- 용어(사전 담당): 오버레이, OBS Studio, 브라우저 소스, URL 파라미터, URLSearchParams, vw, clamp
- 자주 막히는 곳 후보: 브라우저에서 글자가 안 보임(흰 바탕 흰 글자 — 정상, 개발자 도구로 배경을 잠깐 바꿔 확인); OBS에서 배경이 불투명(`countdown.css`의 transparent 빠짐, 사이트 `style.css`를 연결함); 계속 사용법 문장(`start=20：00` 전각 콜론, `?` 두 번, `&` 대신 `,`, `star=` 오타); `--:--:--`에서 안 바뀜(script 경로·defer); Live Preview 주소를 OBS에 넣었는데 VS Code를 닫아 빈 화면 → 배포 주소 권장; 배포 주소가 404(푸시 안 함·10분 대기·`overlay` 대소문자); OBS가 예전 화면(브라우저 소스 속성의 캐시 새로 고침 버튼 — 문구 실기 미확인); 시각이 이상(PC 시계); 이미 지난 시각을 넣어 바로 `곧 시작해요!`(내일 방송은 이 오버레이 범위 밖 — "오늘 시작 시각"만); OBS 설치 중 사용자 계정 컨트롤·그래픽 관련 경고(실기 미확인).
- 레퍼런스 대응: `overlay/countdown.css`·`overlay/countdown.js`(완성), `overlay/countdown.html`(파비콘 줄 제외 완성). 중간 단계 — 레퍼런스와 다름: `countdown.html`에 파비콘 주석·link 없음(Day 28, `../favicon.svg`).

## Day 28 — 품질 높이기 (110분)
- 목표:
  - 접근성 점검(Day 5·11·21·24 복습): 키보드만으로 사이트 돌기(`Tab`·`Shift + Tab`·`Enter`·`Space`), 포커스 표시 `:focus-visible` + `outline`, **건너뛰기 링크**(`<a class="skip-link" href="#main">본문 바로가기</a>` + `<main id="main">`, 평소엔 화면 밖 `position: absolute; top: -4rem;` → 포커스 받으면 `top: 0`, `z-index`), 화면에서 숨기고 스크린 리더만 읽는 `.sr-only` 도구 클래스(지금은 쓰지 않지만 레퍼런스에 있는 이유), `section`의 `aria-labelledby` + `h2`의 `id`, 그림 `alt` 다시 보기, 색만으로 구분하지 않기(오늘 행 `(오늘)` 복습), `prefers-reduced-motion`(움직임 줄이기 설정 존중).
  - **SEO**: 페이지마다 다른 `<title>`(홈 제목 최종 `달빛곰 방송국 - 게임·토크·음악 스트리머`), `<meta name="description">`, 페이지당 h1 하나.
  - **Open Graph**: `og:title`·`og:description`·`og:type`·`og:locale`(링크를 공유할 때 미리 보기). `og:image`는 `https://` 전체 주소가 필요해서 배포 주소가 정해진 뒤 선택으로 넣는다는 것(레퍼런스 README, 레퍼런스 파일에는 없음).
  - **파비콘**: `favicon.svg`(레퍼런스 원문) + `<link rel="icon" href="favicon.svg" type="image/svg+xml">`; `overlay/countdown.html`은 `../favicon.svg`(Day 5 상위 폴더).
  - 성능: **지연 로딩** `loading="lazy"`(홈 카드 그림·iframe, Day 20 `image.loading`의 뜻), `width`·`height`로 자리 미리 잡기(화면 밀림 방지), 그림 파일 크기.
  - **Lighthouse**: Chrome 개발자 도구 **Lighthouse** 탭(안 보이면 `»` 안) → 분석. Live Preview 미리 보기 창에서는 개발자 도구가 안 열리므로 배포 주소나 Edge·Chrome에 붙여 연 Live Preview 주소로 검사(0.2절). 시크릿 창(`Ctrl + Shift + N`)과 배포 주소로 검사하는 이유(확장 프로그램 영향·Live Preview와 차이), 점수는 매번 조금 다름, 항목을 하나 골라 고쳐 보기.
- 이미 배운 것: Day 27 overlay 폴더; Day 26 aria-labelledby·의사 요소; Day 24 aria-live·aria-describedby; Day 21 aria-expanded·aria-label·키보드로 버튼; Day 20 `image.loading`(뜻은 오늘); Day 14 의사 클래스·배포; Day 13 미디어 쿼리·prefers 계열(prefers-color-scheme Day 22); Day 11 ARIA; Day 6 개발자 도구·시맨틱 HTML; Day 5 대체 텍스트·접근성·스크린 리더·상위 폴더; Day 3 head·meta·title.
- 시작 상태: (Day 27 끝 상태와 같아요)
  - 프로젝트 `C:\dev\my-creator-site\`:
    - `C:\dev\my-creator-site\index.html`
    - `C:\dev\my-creator-site\about.html`
    - `C:\dev\my-creator-site\contents.html`
    - `C:\dev\my-creator-site\schedule.html`
    - `C:\dev\my-creator-site\contact.html`
    - `C:\dev\my-creator-site\css\style.css`
    - `C:\dev\my-creator-site\data\videos.json`
    - `C:\dev\my-creator-site\data\schedule.json`
    - `C:\dev\my-creator-site\images\profile.svg`
    - `C:\dev\my-creator-site\images\logo.svg`
    - `C:\dev\my-creator-site\images\thumb-game.svg`
    - `C:\dev\my-creator-site\images\thumb-talk.svg`
    - `C:\dev\my-creator-site\images\thumb-music.svg`
    - `C:\dev\my-creator-site\js\main.js`
    - `C:\dev\my-creator-site\js\contents.js`
    - `C:\dev\my-creator-site\js\contact.js`
    - `C:\dev\my-creator-site\js\schedule.js`
    - `C:\dev\my-creator-site\overlay\countdown.html`
    - `C:\dev\my-creator-site\overlay\countdown.css`
    - `C:\dev\my-creator-site\overlay\countdown.js`
  - 연습 폴더 `C:\dev\hello\`: `C:\dev\hello\hello.html`, `C:\dev\hello\favorites.html`, `C:\dev\hello\tools.html`, `C:\dev\hello\links.html`, `C:\dev\hello\pages\back.html`, `C:\dev\hello\plan.html`, `C:\dev\hello\lab.html`, `C:\dev\hello\lab.js`
  - 파일 탐색기 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
  - VS Code(한국어 팩, Live Preview 확장 프로그램)와 Chrome이 설치되어 있어요.
  - Git이 설치되어 있고(`git --version` → `git version 2.56.0.windows.4`, 숫자는 달라도 돼요) `git config --global user.name`·`user.email`이 설정되어 있어요.
  - GitHub 계정과 공개(Public) 원격 저장소 `https://github.com/<내 아이디>/my-creator-site`가 있고, 로컬 저장소(`C:\dev\my-creator-site\.git\`, 숨김 폴더)와 연결되어 있어요.
  - GitHub Pages가 켜져 있어요: `https://<내 아이디>.github.io/my-creator-site/`
  - (선택) OBS Studio가 설치되어 있고, 브라우저 소스로 카운트다운 오버레이를 띄워 봤어요.
  - 오늘까지의 변경이 모두 커밋·푸시되어 있어요(VS Code 소스 제어 패널의 변경 0개).
  - VS Code에서 `C:\dev\my-creator-site` 폴더를 열어 두면 바로 시작할 수 있어요.
- 오늘 만들/바꿀 파일:
  - `C:\dev\my-creator-site\favicon.svg` — 새 파일, 레퍼런스 원문.
  - 다섯 페이지 — `head`를 레퍼런스와 같게(title 다음에 `meta description`, Open Graph 주석 + 4줄, `<link rel="icon" href="favicon.svg" type="image/svg+xml">`, 그다음 stylesheet·script), `body` 맨 앞 `<a class="skip-link" href="#main">본문 바로가기</a>`, `<main id="main" …>`. 설명 문장은 레퍼런스 문장(학습자 말로 바꿔도 됨).
  - `C:\dev\my-creator-site\index.html` — `<title>달빛곰 방송국 - 게임·토크·음악 스트리머</title>`, 둘째·셋째 section에 `aria-labelledby="what-title"`/`"featured-title"`와 h2 `id`, 카드 그림 3개에 `loading="lazy"`, iframe에 `loading="lazy"`와 레퍼런스 주석 문장(`… loading="lazy"는 화면에 가까워질 때 불러와요`).
  - `C:\dev\my-creator-site\overlay\countdown.html` — 레퍼런스의 `../` 주석 + `<link rel="icon" href="../favicon.svg" type="image/svg+xml">`(완성).
  - `C:\dev\my-creator-site\css\style.css` — `2`: `h3` 다음에 `:focus-visible`·`.sr-only`·`.skip-link`·`.skip-link:focus`(레퍼런스 원문·주석); 파일 맨 끝 `@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }`(주석 포함) — 이로써 `style.css` 완성.
- 끝 상태 확인: 페이지를 열고 `Tab`을 처음 누르면 왼쪽 위에 `본문 바로가기`가 나타나고 `Enter`로 본문으로 감; 모든 링크·버튼에 보라 포커스 테두리; 브라우저 탭에 초승달 아이콘(오버레이 탭 포함); Lighthouse 접근성·SEO 점수가 높게 나옴(숫자는 달라도 됨); 다섯 페이지·오버레이·CSS가 레퍼런스와 같음(글 내용 제외); GitHub에 `Day 28` 커밋.
- 과제: 1) 키보드만으로 문의 보내기(쉬움): 마우스 없이 문의 폼을 채워 보내기 → 정답 요지: `Tab` 순서와 `Enter`/`Space`, 오류 시 커서가 첫 오류 칸으로. 2) 내 설명 문장(보통): 다섯 페이지 `description`을 내 말로(검색 결과에 보일 한두 문장) → 정답 요지: 레퍼런스 문장 예시와 쓰는 요령(페이지마다 다르게, 핵심 낱말 앞쪽). 3) (도전) Lighthouse 항목 하나 고치기: 낮게 나온 항목 하나를 골라 원인과 고친 점 적기 → 정답 요지: 예시(대비 부족 → 변수 색 조정, `alt` 빠짐 등)와 다시 검사.
- 용어(사전 담당): 건너뛰기 링크, SEO, Open Graph, 파비콘, 지연 로딩, Lighthouse
- 자주 막히는 곳 후보: 파비콘이 안 바뀜(브라우저가 아이콘을 오래 기억 — 새 탭·`Ctrl + F5`·시간 지나 다시); `Tab`을 눌러도 건너뛰기 링크가 안 나옴(포커스가 주소 표시줄에 있음 → 페이지를 한 번 클릭 후 `Tab`); 건너뛰기 링크가 늘 보임(`top`·`position` 빠짐); `href="#main"`인데 `main`에 `id` 없음; Lighthouse 탭이 없음(`»` 더 보기, Edge도 있음 — 실측); "확장 프로그램이 성능에 영향" 안내(시크릿 창); Live Preview와 배포 주소 점수 차이; og 미리 보기는 배포 뒤 공유해야 보임(메신저마다 캐시); 오버레이 파비콘 경로를 `favicon.svg`로 써서 안 보임(`../`).
- 레퍼런스 대응: `favicon.svg`(완성); `index.html`·`about.html`·`contents.html`·`schedule.html`·`contact.html`(완성), `overlay/countdown.html`(완성), `css/style.css`(완성). 이 Day가 끝나면 HTML·CSS·JS·데이터·이미지 파일이 모두 레퍼런스와 같아요(글 내용·예시 데이터 제외).

## Day 29 — 디버깅과 정리 (100분)
- 목표:
  - **버그**와 **디버깅** 순서: 다시 일어나게 하기 → 오류 원문 읽기(종류·문장·파일:줄) → 위치 찾기 → 가설 → 확인.
  - 흔한 오류 원문 모음(실측해서 실음): `TypeError: Cannot read properties of null (reading '…')`, `ReferenceError: … is not defined`, `SyntaxError: …`, Network 404, `file://` fetch 오류. 각 오류가 P1의 어느 Day에서 나왔는지 링크.
  - 개발자 도구 **Sources**(소스) 패널(Edge에서 연 Live Preview 주소나 배포 주소 — 0.2절): 파일 찾기(`Ctrl + P`), 줄 번호 클릭으로 **중단점**, 새로 고침·버튼 클릭으로 멈추기, Scope에서 변수 값 보기, 한 줄씩(`F10`), 계속(`F8`), 중단점 해제. `console.log` 디버깅과 비교.
  - 버그 고치기 연습: 오늘 시작할 때 커밋이 깨끗한지 확인 → 교재가 준 버그 3개를 일부러 넣고 찾아 고치기 → 다 끝나면 소스 제어 패널의 **변경 내용 취소**로 되돌릴 수 있다는 것(Git이 안전망, 되돌린 내용은 복구할 수 없다는 `:::warn`).
  - 폴더 정리: 레퍼런스 폴더 구조(1절 표)와 비교, 안 쓰는 파일·`index copy.html` 같은 남은 파일 지우기, 이름 규칙(소문자·`-`) 점검, 모든 페이지 콘솔 오류 0 확인.
  - **README** 쓰기: **Markdown** 문법(`#`, `##`, `-`, 숫자 목록, `` ` ``, 코드 블록 `text`, 표, 링크), VS Code Markdown 미리 보기(`Ctrl + Shift + V`). GitHub 저장소 첫 화면에 README가 보이는 것.
- 이미 배운 것: Day 1~28 전부(특히 Day 25 fetch 오류·Network, Day 15 콘솔 오류 읽기, Day 7 커밋·소스 제어, Day 27 오버레이 주소 형식, Day 19·26 데이터 형식, Day 14 배포 주소).
- 시작 상태: (Day 28 끝 상태와 같아요)
  - 프로젝트 `C:\dev\my-creator-site\`:
    - `C:\dev\my-creator-site\index.html`
    - `C:\dev\my-creator-site\about.html`
    - `C:\dev\my-creator-site\contents.html`
    - `C:\dev\my-creator-site\schedule.html`
    - `C:\dev\my-creator-site\contact.html`
    - `C:\dev\my-creator-site\favicon.svg`
    - `C:\dev\my-creator-site\css\style.css`
    - `C:\dev\my-creator-site\data\videos.json`
    - `C:\dev\my-creator-site\data\schedule.json`
    - `C:\dev\my-creator-site\images\profile.svg`
    - `C:\dev\my-creator-site\images\logo.svg`
    - `C:\dev\my-creator-site\images\thumb-game.svg`
    - `C:\dev\my-creator-site\images\thumb-talk.svg`
    - `C:\dev\my-creator-site\images\thumb-music.svg`
    - `C:\dev\my-creator-site\js\main.js`
    - `C:\dev\my-creator-site\js\contents.js`
    - `C:\dev\my-creator-site\js\contact.js`
    - `C:\dev\my-creator-site\js\schedule.js`
    - `C:\dev\my-creator-site\overlay\countdown.html`
    - `C:\dev\my-creator-site\overlay\countdown.css`
    - `C:\dev\my-creator-site\overlay\countdown.js`
  - 연습 폴더 `C:\dev\hello\`: `C:\dev\hello\hello.html`, `C:\dev\hello\favorites.html`, `C:\dev\hello\tools.html`, `C:\dev\hello\links.html`, `C:\dev\hello\pages\back.html`, `C:\dev\hello\plan.html`, `C:\dev\hello\lab.html`, `C:\dev\hello\lab.js`
  - 파일 탐색기 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
  - VS Code(한국어 팩, Live Preview 확장 프로그램)와 Chrome이 설치되어 있어요.
  - Git이 설치되어 있고(`git --version` → `git version 2.56.0.windows.4`, 숫자는 달라도 돼요) `git config --global user.name`·`user.email`이 설정되어 있어요.
  - GitHub 계정과 공개(Public) 원격 저장소 `https://github.com/<내 아이디>/my-creator-site`가 있고, 로컬 저장소(`C:\dev\my-creator-site\.git\`, 숨김 폴더)와 연결되어 있어요.
  - GitHub Pages가 켜져 있어요: `https://<내 아이디>.github.io/my-creator-site/`
  - (선택) OBS Studio가 설치되어 있고, 브라우저 소스로 카운트다운 오버레이를 띄워 봤어요.
  - 오늘까지의 변경이 모두 커밋·푸시되어 있어요(VS Code 소스 제어 패널의 변경 0개).
  - VS Code에서 `C:\dev\my-creator-site` 폴더를 열어 두면 바로 시작할 수 있어요.
- 오늘 만들/바꿀 파일:
  - `C:\dev\my-creator-site\README.md` — 새 파일. 레퍼런스 README와 같은 목차: `# 사이트 이름`, 소개 한두 문장 + 배포 주소 링크, `## 폴더 구조`(```` ```text ```` 트리), `## 열어 보는 방법`(Live Preview·배포 주소, 더블클릭하면 영상 목록·카운트다운이 안 나오는 이유), `## OBS 카운트다운 오버레이`(주소 형식, `title`·`start` 표), `## 데이터 파일 형식`(videos.json·schedule.json), `## 알아 두면 좋은 점`(예시 영상 ID, 컴퓨터 시계 기준, 연습용 폼, localStorage `theme`). 글은 학습자 것.
  - 버그 연습용으로 잠깐 바꾼 파일 — 끝나면 모두 되돌림(끝 상태에 남지 않음).
  - 정리 중 지운 파일이 있으면 그 목록(레퍼런스에 없는 파일만).
- 끝 상태 확인: VS Code Markdown 미리 보기에 제목·목록·표·코드 상자; GitHub 저장소 첫 화면 아래에 README 내용; 다섯 페이지·오버레이 콘솔 오류 0개; 프로젝트 파일 목록이 1절 표(22개)와 같음; 중단점이 남아 있지 않음; GitHub에 `Day 29` 커밋.
- 과제: 1) 버그 찾기 3문제(쉬움): 코드 조각 + 오류 원문(실측) → 원인 한 줄 → 정답 요지: `#video-lsit` 오타·`setInterval(updateCountdown(), …)`·JSON 마지막 쉼표. 2) 중단점으로 값 보기(보통): `schedule.js` `formatRemaining` 첫 줄에 중단점 → `totalSeconds`·`days` 값 읽기 → 정답 요지: 절차와 "1초마다 멈추니 확인 뒤 중단점 해제". 3) (도전) README에 `## 배운 것` 절 추가(기술 이름 5개 이상 + 가장 어려웠던 Day) → 정답 요지: 예시 Markdown.
- 용어(사전 담당): 버그, 디버깅, 중단점, Markdown, README
- 자주 막히는 곳 후보: 중단점에서 안 멈춤(그 줄이 이미 실행됨 → 새로 고침/버튼 누르기, 다른 파일에 걸음); 멈춘 채로 페이지가 안 움직임("Paused in debugger" — `F8`); 계속 멈춤(Breakpoints 목록에서 끄기); Sources에서 파일을 못 찾음(`Ctrl + P`); README가 GitHub에 안 보임(이름 `readme.txt`·`README.md.txt`, 푸시 안 함); Markdown 표 깨짐(`|` 개수); **변경 내용 취소**로 오늘 쓴 README까지 날림(그래서 버그 연습을 README보다 먼저 하고, 되돌린 뒤 README를 써요); 정리하며 레퍼런스에 있는 파일을 지움(1절 표 확인).
- 레퍼런스 대응: `README.md`(레퍼런스 README와 같은 목차, 글은 학습자 것). 다른 파일은 Day 28 상태 그대로(레퍼런스와 같음).

## Day 30 — 최종 배포와 회고 (90분)
- 목표:
  - 최종 점검표(교재에 체크 목록으로): 다섯 페이지·오버레이 열림, 메뉴·링크, 그림 5개 + 파비콘, 콘솔 오류 0, 360px 가로 스크롤 없음·메뉴 버튼, 다크 모드 유지, 인사말, 영상 필터·검색·빈 목록, 문의 폼 오류·성공, 일정 강조·카운트다운, 오버레이 주소 값, 키보드 이동·건너뛰기 링크, Lighthouse, README.
  - 마지막 커밋·푸시 → 저장소 **Actions** 탭의 "pages build and deployment" 초록 표시 확인 → 배포 주소에서 점검표를 한 번 더(휴대폰 포함, `Ctrl + F5`).
  - **회고**: 잘한 것·아쉬운 것·다음에 해 볼 것(KPT) + 질문 5개로 README `## 회고` 절 쓰기.
  - 다음 프로젝트 소개: P2 스트리머 허브(TypeScript·C#·데이터베이스, 진짜 서버로 폼 받기·로그인). Day 30을 **Day 완료**하면 P2가 열리고, 진도 백업(⚙ 설정 → 진도 내보내기)을 권함.
- 이미 배운 것: Day 1~29 전부(특히 Day 14 배포·Actions, Day 28 Lighthouse, Day 29 README·Markdown·디버깅).
- 시작 상태: (Day 29 끝 상태와 같아요)
  - 프로젝트 `C:\dev\my-creator-site\`:
    - `C:\dev\my-creator-site\index.html`
    - `C:\dev\my-creator-site\about.html`
    - `C:\dev\my-creator-site\contents.html`
    - `C:\dev\my-creator-site\schedule.html`
    - `C:\dev\my-creator-site\contact.html`
    - `C:\dev\my-creator-site\favicon.svg`
    - `C:\dev\my-creator-site\README.md`
    - `C:\dev\my-creator-site\css\style.css`
    - `C:\dev\my-creator-site\data\videos.json`
    - `C:\dev\my-creator-site\data\schedule.json`
    - `C:\dev\my-creator-site\images\profile.svg`
    - `C:\dev\my-creator-site\images\logo.svg`
    - `C:\dev\my-creator-site\images\thumb-game.svg`
    - `C:\dev\my-creator-site\images\thumb-talk.svg`
    - `C:\dev\my-creator-site\images\thumb-music.svg`
    - `C:\dev\my-creator-site\js\main.js`
    - `C:\dev\my-creator-site\js\contents.js`
    - `C:\dev\my-creator-site\js\contact.js`
    - `C:\dev\my-creator-site\js\schedule.js`
    - `C:\dev\my-creator-site\overlay\countdown.html`
    - `C:\dev\my-creator-site\overlay\countdown.css`
    - `C:\dev\my-creator-site\overlay\countdown.js`
  - 연습 폴더 `C:\dev\hello\`: `C:\dev\hello\hello.html`, `C:\dev\hello\favorites.html`, `C:\dev\hello\tools.html`, `C:\dev\hello\links.html`, `C:\dev\hello\pages\back.html`, `C:\dev\hello\plan.html`, `C:\dev\hello\lab.html`, `C:\dev\hello\lab.js`
  - 파일 탐색기 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
  - VS Code(한국어 팩, Live Preview 확장 프로그램)와 Chrome이 설치되어 있어요.
  - Git이 설치되어 있고(`git --version` → `git version 2.56.0.windows.4`, 숫자는 달라도 돼요) `git config --global user.name`·`user.email`이 설정되어 있어요.
  - GitHub 계정과 공개(Public) 원격 저장소 `https://github.com/<내 아이디>/my-creator-site`가 있고, 로컬 저장소(`C:\dev\my-creator-site\.git\`, 숨김 폴더)와 연결되어 있어요.
  - GitHub Pages가 켜져 있어요: `https://<내 아이디>.github.io/my-creator-site/`
  - (선택) OBS Studio가 설치되어 있고, 브라우저 소스로 카운트다운 오버레이를 띄워 봤어요.
  - 오늘까지의 변경이 모두 커밋·푸시되어 있어요(VS Code 소스 제어 패널의 변경 0개).
  - VS Code에서 `C:\dev\my-creator-site` 폴더를 열어 두면 바로 시작할 수 있어요.
- 오늘 만들/바꿀 파일:
  - `C:\dev\my-creator-site\README.md` — 맨 끝에 `## 회고` 절(KPT 세 목록 + 질문 답) 추가, 맨 위 배포 주소 확인.
  - 점검에서 찾은 문제를 고친 파일(있으면).
- 끝 상태 확인: 배포 주소에서 점검표 전부 통과; GitHub 최신 커밋이 `Day 30: …`이고 Actions가 초록; README 회고가 저장소 첫 화면에 보임; 휴대폰에서 사이트와 오버레이 주소가 열림; 교재 홈에서 P2가 열림(Day 30 완료 뒤).
- 과제: 1) 점검표 완주(쉬움) → 정답 요지: 항목별 확인 방법과 실패 시 갈 Day 링크. 2) 회고 쓰기(보통) → 정답 요지: 예시 회고(달빛곰 버전)와 좋은 회고의 조건(구체적인 Day·장면, 다음 행동). 3) (선택) 친구나 시청자에게 주소를 보내고 의견 하나를 받아 반영 → 정답 요지: 고친 점을 커밋 메시지로 남기는 예.
- 용어(사전 담당): 회고
- 자주 막히는 곳 후보: Actions에 빨간 ✕(저장소 **Actions** → 실패한 실행 → 다시 실행, 파일 이름에 특수 문자); 배포 주소가 예전 모습(반영 대기·캐시); 휴대폰에서만 가로 스크롤(기기 모드 360px 다시, 긴 영어 주소); 휴대폰이 다크 모드로 보임(휴대폰 설정을 따름 — 정상); 대표 영상이 재생 안 됨(예시 ID·퍼가기 금지 — 내 영상으로); 교재의 **Day 완료** 버튼이 눌리지 않음(앞 Day 미완료 — 사이드바에서 ✅ 아닌 Day 찾기); P2가 안 열림(P1 30개 모두 완료해야 함).
- 레퍼런스 대응: `reference/p1-my-creator-site/` 전체와 같은 폴더 구조·동작(README 글·글 내용·예시 데이터 제외). 이 Day의 마지막 줄은 P2가 열린다는 사실과 [P2 한눈에 보기](#/project/p2) 링크로 끝내요.
