## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- `overlay` 폴더에 방송 화면 위에 올릴 카운트다운 페이지(HTML, CSS, JS 3개 파일)를 만들어요.
- 주소 끝에 `?title=저녁 방송&start=20:00`처럼 값을 붙여서 제목과 시작 시각을 바꿔요.
- 주소를 잘못 쓰면 사용법 문장이 나오고, 시각이 지나면 `곧 시작해요!`로 바뀌어요.
- (선택) OBS Studio의 브라우저 소스에 이 주소를 넣고 배경이 투명하게 글자만 뜨는 것을 확인해요. OBS가 없어도 브라우저만으로 끝까지 확인할 수 있어요.

**예상 시간: 120분** (개념 이해 28분 · 따라하기 62분 · 과제 25분 · 정리 5분)

:::path 📂 시작 상태
어제(Day 26)까지 만든 파일이 이렇게 있어야 해요. 없거나 다르면 [Day 26](#/day/p1-d26)의 "오늘 끝 상태 전체 코드"로 맞춰 주세요.

- `C:\dev\my-creator-site\about.html`
- `C:\dev\my-creator-site\contact.html`
- `C:\dev\my-creator-site\contents.html`
- `C:\dev\my-creator-site\index.html`
- `C:\dev\my-creator-site\schedule.html`
- `C:\dev\my-creator-site\css\style.css`
- `C:\dev\my-creator-site\data\schedule.json`
- `C:\dev\my-creator-site\data\videos.json`
- `C:\dev\my-creator-site\images\logo.svg`
- `C:\dev\my-creator-site\images\profile.svg`
- `C:\dev\my-creator-site\images\thumb-game.svg`
- `C:\dev\my-creator-site\images\thumb-music.svg`
- `C:\dev\my-creator-site\images\thumb-talk.svg`
- `C:\dev\my-creator-site\js\contact.js`
- `C:\dev\my-creator-site\js\contents.js`
- `C:\dev\my-creator-site\js\main.js`
- `C:\dev\my-creator-site\js\schedule.js`
- 연습 폴더 `C:\dev\hello\`에 `hello.html`, `favorites.html`, `tools.html`, `links.html`, `plan.html`, `lab.html`, `lab.js`, `pages\back.html`이 있어요(오늘은 열지 않아도 돼요).
- VS Code에서 `C:\dev\my-creator-site` 폴더가 열려 있고, 한국어 팩과 Live Preview 확장 프로그램이 설치되어 있어요.
- 파일 탐색기의 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
- Git이 설치되어 있고(`git --version` → `git version 2.56.0.windows.4`, 숫자는 달라도 돼요) GitHub의 공개(Public) 저장소 `https://github.com/<내 아이디>/my-creator-site`와 연결되어 있어요.
- GitHub Pages가 켜져 있어요: `https://<내 아이디>.github.io/my-creator-site/`
- 어제까지의 변경이 모두 커밋·푸시되어 소스 제어 패널의 변경이 0개예요.
:::

## 📖 개념 이해

:::info 컴퓨터 시계 기준이에요
오늘 만드는 카운트다운도 **컴퓨터 시계 기준**이에요. 한국에서 쓰는 컴퓨터라면 한국 시간으로 계산돼요. 시간대는 P2 Day 29에서 제대로 배워요.
:::

### 오버레이: 방송 화면 위에 한 겹 더

**비유:** 투명한 OHP 필름이에요. 게임 화면이 그려진 도화지 위에 글자만 적힌 투명 필름을 겹치면, 필름의 글자가 도화지 위에 떠 보여요.

**정확한 정의:** **[[오버레이]]**(overlay)는 방송 화면 위에 한 겹 겹쳐서 보여 주는 그림이나 글자예요. 카운트다운, 후원 알림, 채팅창 등이 대표적이에요. 배경이 투명한 웹페이지로 만들면 게임 화면 위에 글자만 떠 보여요.

방송 프로그램은 웹페이지를 화면 한 겹으로 가져올 수 있어요. 그래서 오버레이를 웹 기술(HTML, CSS, JS)로 만들어요. 지금까지 배운 것으로 충분해요.

### OBS Studio와 브라우저 소스

**[[OBS Studio]]**(오비에스 스튜디오)는 방송과 녹화에 널리 쓰는 무료 프로그램이에요. 게임 화면, 카메라, 웹페이지 같은 여러 **소스**를 한 화면에 겹쳐서 방송 플랫폼으로 내보내요. 그중 **[[브라우저 소스]]**(browser source)는 웹페이지를 한 겹으로 띄우는 소스 종류예요. 속성 창에 주소(URL)를 넣고 너비와 높이를 정하면, OBS 안의 브라우저가 그 페이지를 그려요. 페이지의 배경이 투명하면 아래 겹이 그대로 비쳐 보여요.

### 사이트와 따로 만드는 독립 페이지

오버레이는 사이트의 `style.css`와 `main.js`를 **쓰지 않아요.** 사이트 CSS를 연결하면 메뉴, 배경색, 머리글이 방송 화면에 같이 나와요. 방송에는 글자만 나와야 해요. 그래서 `overlay` 폴더 안에 파일 3개(`countdown.html`, `countdown.css`, `countdown.js`)를 따로 만들어요.

같은 폴더에 있는 파일은 폴더 이름 없이 파일 이름만 쓰면 돼요(상대 경로, Day 4·5). `countdown.html`에서 `countdown.css`는 그냥 `href="countdown.css"`예요.

### 투명 배경

```css
html,
body {
  background: transparent; /* 투명 배경 */
  overflow: hidden;        /* 스크롤바가 생기지 않게 해요 */
}
```

`background: transparent`가 오버레이의 핵심이에요. `overflow: hidden`은 넘치는 부분을 잘라서 스크롤바가 안 생기게 해요(OBS 화면에 스크롤바가 나오면 안 돼요). 밝은 게임 화면 위에서도 글자가 읽히도록 `text-shadow`(글자 그림자)로 어두운 테두리를 둘러요.

```css
text-shadow: 0 0 4px rgba(0, 0, 0, 0.9), 0 2px 12px rgba(0, 0, 0, 0.8);
```

콤마(`,`)로 그림자를 두 개 겹쳤어요. 값은 `가로 세로 흐림 색` 순서예요.

:::warn 일반 브라우저에서는 글자가 안 보여요
글자 색이 흰색(`#ffffff`)이고 배경이 투명하면, 일반 브라우저의 흰 바탕 위에서는 흰 글자가 거의 안 보여요. 고장이 아니라 **정상**이에요. 오버레이는 어두운 게임 화면 위에서 읽히게 만든 거예요. 확인할 때는 개발자 도구로 배경을 잠깐 어둡게 해서 봐요(아래 2단계).
:::

### vw, vh, clamp: 화면 크기에 맞는 글자

OBS 브라우저 소스의 크기는 방송 해상도(1920×1080)일 수도, 작은 위젯 크기(400×200)일 수도 있어요. 글자가 고정 크기면 어떤 크기에서는 너무 작고 어떤 곳에서는 넘쳐요. 화면 크기에 비례하는 단위가 필요해요.

**[[vw]]**(뷰포트 너비 단위)는 화면(뷰포트) 폭을 100으로 보는 CSS 길이 단위예요. `6vw`는 화면 폭의 6%이고, 폭이 1000px이면 60px이에요. 높이 기준인 `vh`도 있어요(`100vh`는 화면 높이 전체).

그런데 비례만 하면 너무 작아지거나 너무 커질 수 있어요. **[[clamp]]**(클램프)는 CSS 값을 최솟값과 최댓값 사이로 묶어 주는 함수예요.

```css
font-size: clamp(1.25rem, 6vw, 2.5rem);
```

"기본은 화면 폭의 6%(`6vw`)를 쓰되, `1.25rem`보다 작아지지 않고 `2.5rem`보다 커지지 않아요"라는 뜻이에요. `clamp(최소, 기본, 최대)` 순서예요. 미디어 쿼리(Day 13) 없이도 크기가 알맞게 변해요.

화면 가운데에 놓기 위해 `min-height: 100vh`(화면 높이 전체)와 Flexbox(Day 11)의 세로 방향(`flex-direction: column`)과 가운데 정렬(`align-items: center`, `justify-content: center`)을 써요.

### URL 파라미터: 같은 페이지로 다른 내용 보여 주기

방송 제목과 시작 시각이 바뀔 때마다 JS 파일을 고치면 번거로워요. 대신 주소 끝에 값을 붙여요.

```text
countdown.html?title=저녁 방송&start=20:00
```

**[[URL 파라미터]]**(URL parameter)는 주소 끝에 `?` 다음으로 붙여 페이지에 값을 넘기는 부분이에요. `이름=값`을 `&`로 이어서 적어요. 첫 번째 `?`는 한 번만 쓰고, 값 사이는 `&`예요. 빈칸은 `%20`으로 써도 돼요(브라우저 주소 칸에서는 빈칸을 쳐도 자동으로 `%20`이 돼요). 같은 파일 하나로 주소만 바꿔 서로 다른 제목과 시각을 보여 줄 수 있어요.

JavaScript는 `location.search`로 `?`부터 뒤쪽 글자 전체를 얻어요. 거기서 값을 편하게 꺼내 주는 도구가 **[[URLSearchParams]]**(유알엘 서치 파라미터)예요. URL 파라미터를 쉽게 읽게 해 주는 JavaScript 기능이에요.

```js
const params = new URLSearchParams(location.search);
const title = params.get('title') || '방송 시작까지';
```

- `params.get('title')`: `title=` 뒤의 값을 글자로 돌려줘요. 그 이름이 없으면 `null`이에요. `%20` 같은 인코딩도 원래 글자(빈칸)로 풀어 줘요.
- `|| '방송 시작까지'`: `||`는 "앞이 비어 있으면(`null`이나 `''`) 뒤를 써요"라는 기본값 장치예요(Day 16의 `||`를 응용했어요). 값이 없으면 기본 제목이 돼요.

### 입력 검사: 사람이 주소를 잘못 쓸 수 있어요

`start=20:00`을 `start=25:99`나 `start=ab:cd`로 쓸 수 있어요. 검사 없이 계산하면 이상한 시간이 나와요. 그래서 `isValidStart` 함수로 먼저 확인해요.

- `text.split(':')`로 자르면(Day 26) 정확히 2조각이어야 하고 비어 있으면 안 돼요.
- `Number('20')` → 20이고, `Number('ab')` → `NaN`이에요. `NaN`은 어떤 비교(`>= 0`, `<= 23`)에도 `false`예요(Day 15). 그래서 시 `0~23`, 분 `0~59` 범위 검사만으로 글자가 섞인 것도 걸러져요.

### 타이머를 멈추기: clearInterval

`setInterval`은 번호를 돌려줘요. 그 번호를 `let timerId = null;`에 담아 두었다가, 시각이 지나면 `clearInterval(timerId)`로 멈춰요. 시작 시각이 지나도 계속 계산하면 낭비이기 때문이에요.

## 🛠️ 따라하기

모두 8단계예요. 6~8단계로 결과를 확인하고 배포해요. OBS를 설치하는 마지막 단계는 선택이에요. 이 페이지는 `fetch`를 쓰지 않아서 **더블클릭(`file://`)으로도 열려요.** 그래도 개발자 도구가 필요한 단계는 Live Preview 주소(`http://127.0.0.1:3000/overlay/countdown.html`, 숫자는 달라도 돼요)를 Edge(또는 Chrome) 주소창에 붙여서 열어요.

### 1단계 · overlay 폴더와 countdown.html 만들기 (6분)

**어디서:** VS Code 왼쪽 탐색기(`Ctrl + Shift + E`) → `my-creator-site` 폴더

**무엇을:**

1. 탐색기의 빈 곳(또는 `my-creator-site` 폴더 이름)에서 오른쪽 클릭 → **새 폴더** → `overlay` 입력 후 `Enter`.
2. `overlay` 폴더 위에서 오른쪽 클릭 → **새 파일** → `countdown.html` 입력 후 `Enter`. 경로는 `C:\dev\my-creator-site\overlay\countdown.html`이에요.
3. 열린 빈 파일에 아래 코드를 붙여 넣고 `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\overlay\countdown.html
```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>방송 카운트다운 오버레이</title>
  <link rel="stylesheet" href="countdown.css">
  <script src="countdown.js" defer></script>
</head>
<body>
  <!-- OBS 브라우저 소스 주소 예: .../overlay/countdown.html?title=저녁 방송&start=20:00 -->
  <main class="overlay">
    <h1 id="title" class="title">방송 시작까지</h1>
    <p id="countdown" class="countdown" role="timer">--:--:--</p>
  </main>
</body>
</html>
```

- `<link rel="stylesheet" href="countdown.css">`와 `<script src="countdown.js" defer>`: 같은 폴더의 파일을 파일 이름만으로 불러요. 사이트의 `css\style.css`는 연결하지 않아요.
- `<main class="overlay">` 안에 제목 `<h1 id="title">`과 시간 `<p id="countdown" role="timer">`가 있어요. 처음에는 `방송 시작까지`와 `--:--:--` 자리표시가 들어 있어요.
- 주석에 OBS에 넣을 주소의 모양(`.../overlay/countdown.html?title=저녁 방송&start=20:00`)이 적혀 있어요.

:::success
탐색기에 `overlay` 폴더와 그 안의 `countdown.html`이 보여요. 파일이 `.txt`가 아닌지 이름을 확인해요.
:::

### 2단계 · countdown.css 만들기, 일부러 안 보이는 화면 확인하기 (8분)

**어디서:** VS Code → `overlay` 폴더 위에서 오른쪽 클릭 → **새 파일** → `countdown.css` (경로 `C:\dev\my-creator-site\overlay\countdown.css`)

**무엇을:** 열린 빈 파일에 아래 코드를 붙여 넣고 저장해요.

📄 C:\dev\my-creator-site\overlay\countdown.css
```css
/* ==========================================================
   countdown.css - OBS 오버레이 스타일
   배경은 transparent(투명)라서 OBS에서 게임 화면 위에 글자만 떠 보여요.
   ========================================================== */

html,
body {
  margin: 0;
  background: transparent; /* 투명 배경: 이 한 줄이 오버레이의 핵심이에요 */
  overflow: hidden;        /* 스크롤바가 생기지 않게 해요 */
}

body {
  font-family: system-ui, "Malgun Gothic", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
  color: #ffffff;
  /* 밝은 화면 위에서도 읽히도록 어두운 그림자를 둘러요 */
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.9), 0 2px 12px rgba(0, 0, 0, 0.8);
  text-align: center;
}

.overlay {
  box-sizing: border-box;
  min-height: 100vh;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.title {
  margin: 0 0 0.5rem;
  max-width: 100%;
  overflow-wrap: anywhere; /* 긴 제목은 줄을 바꿔요 */
  font-size: clamp(1.25rem, 6vw, 2.5rem); /* 화면 폭에 맞춰 커지고 작아져요 */
}

.countdown {
  margin: 0;
  font-size: clamp(2.5rem, 16vw, 6rem);
  font-weight: 800;
  font-variant-numeric: tabular-nums; /* 숫자 폭을 같게 해서 흔들리지 않아요 */
}

/* 주소를 잘못 썼을 때 나오는 안내 문장은 작게 보여요 */
.countdown.hint {
  font-size: 1rem;
  font-weight: 400;
}
```

- `.title`의 `overflow-wrap: anywhere;`는 긴 제목이 상자 밖으로 삐져나가지 않고 줄을 바꾸게 해요.
- `.countdown`의 `font-variant-numeric: tabular-nums;`는 Day 26에서 본 것처럼 숫자 폭을 같게 해서 흔들리지 않게 해요.
- `.countdown.hint`는 `countdown`과 `hint` 클래스를 **둘 다** 가진 요소를 고르는 복합 선택자(Day 21)예요. 주소를 잘못 썼을 때 안내 문장을 작게 보여 줘요.

이제 일반 브라우저에서 열어서 확인해요.

**어디서:** 탐색기 → `C:\dev\my-creator-site\overlay\countdown.html` 더블클릭 (Edge나 Chrome으로 열려요)

**무엇을:**

1. 열린 페이지를 봐요.
2. `F12`를 눌러 개발자 도구를 열고 **Console**(콘솔) 탭에 아래 한 줄을 입력하고 `Enter`를 눌러요. 개발자 도구에서 페이지의 배경을 임시로 어두운 회색으로 바꿔 보는 줄이에요.

```js
document.body.style.background = '#444';
```

예상 출력(콘솔에 이렇게 나와요):

```text
'#444'
```

:::success
1번에서는 흰 바탕에 흰 글자라 거의 아무것도 안 보여요(그림자 때문에 흐린 윤곽만 보일 수 있어요). 2번을 입력하면 배경이 어두운 회색이 되면서 가운데에 `방송 시작까지`(제목)와 `--:--:--`(큰 글씨)가 흰색 글자로 또렷하게 보여요. 이것이 정상이에요. 새로 고침하면 배경이 다시 흰색이 돼요.
:::

### 3단계 · countdown.js A: 주소에서 값 꺼내 제목 바꾸기 (8분)

**어디서:** VS Code → `overlay` 폴더 위에서 오른쪽 클릭 → **새 파일** → `countdown.js` (경로 `C:\dev\my-creator-site\overlay\countdown.js`)

**무엇을:** 열린 빈 파일에 아래 코드를 붙여 넣고 저장해요. 그리고 주소 끝에 값을 붙여서 열어요.

📄 C:\dev\my-creator-site\overlay\countdown.js
```js
// ==========================================================
// countdown.js - OBS 오버레이: 방송 시작까지 카운트다운
// 주소 예시: countdown.html?title=저녁 방송&start=20:00
//   title : 화면에 보여 줄 방송 제목
//   start : 오늘 방송 시작 시각 (HH:MM)
//
// 이 코드는 컴퓨터 시간이 한국 시간이라고 가정해요. 시간대는 P2에서 제대로 배워요.
// ==========================================================

const titleElement = document.querySelector('#title');
const countdownElement = document.querySelector('#countdown');

// ---------- 1. 주소(URL)에서 값 꺼내기 (Day 27) ----------
// location.search 는 '?title=...&start=...' 부분이에요
const params = new URLSearchParams(location.search);
const title = params.get('title') || '방송 시작까지'; // 없으면 기본 제목
const start = params.get('start') || '';

titleElement.textContent = title;
```

코드를 읽어 봐요.

- `titleElement`, `countdownElement`: 제목과 시간 요소를 `#title`, `#countdown`으로 찾아 둬요.
- `new URLSearchParams(location.search)`: 주소의 `?title=…&start=…` 부분을 읽을 수 있는 상자로 만들어요.
- `const start = params.get('start') || '';`: `start`가 없으면 빈 글자 `''`를 써요. 4단계의 검사가 빈 글자를 걸러요.
- `titleElement.textContent = title;`: 화면의 제목을 바꿔요.

**어디서:** Edge(또는 Chrome) 주소 칸에서 `countdown.html` 주소 뒤에 값을 붙여 열어요. 파일을 더블클릭해서 열렸다면 주소 칸에 `file:///C:/dev/my-creator-site/overlay/countdown.html`이 보여요. 그 끝에 아래 값을 붙이고 `Enter`를 눌러요.

```text
?title=저녁 방송&start=20:00
```

:::success
주소가 `…/countdown.html?title=저녁%20방송&start=20:00`으로 바뀌고(주소 칸이 빈칸을 `%20`으로 바꿔요), 개발자 도구 **Elements**에서 `<h1 id="title" class="title">저녁 방송</h1>`을 볼 수 있어요. 시간은 아직 `--:--:--`이에요. 4~5단계에서 움직이게 해요.
:::

### 4단계 · countdown.js B: 시각 검사하고 Date로 바꾸기 (10분)

**어디서:** VS Code → `C:\dev\my-creator-site\overlay\countdown.js`

**무엇을:** 파일 맨 끝(`titleElement.textContent = title;` 아래)에 아래 블록을 붙여 넣어요. 앞에 빈 줄 하나를 두고 저장해요.

📄 C:\dev\my-creator-site\overlay\countdown.js (일부)
```js
// ---------- 2. 시작 시각 확인하고 Date로 바꾸기 ----------
// 'HH:MM' 모양이고, 시는 0~23, 분은 0~59 사이인지 확인해요
function isValidStart(text) {
  const parts = text.split(':'); // '20:00' → ['20', '00']
  if (parts.length !== 2 || parts[0] === '' || parts[1] === '') {
    return false; // ':'가 하나가 아니거나 비어 있으면 틀린 값이에요
  }

  const hour = Number(parts[0]); // 글자를 숫자로 바꿔요. 숫자가 아니면 NaN이 되어 아래 비교에서 걸러져요
  const minute = Number(parts[1]);
  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
}

// 오늘 날짜에 시작 시각을 맞춘 Date를 만들어요
function getTargetTime(text) {
  const parts = text.split(':');
  const target = new Date(); // 지금
  target.setHours(Number(parts[0]), Number(parts[1]), 0, 0); // 시, 분, 초, 밀리초
  return target;
}

// 숫자를 두 자리 글자로: 5 → '05'
function pad(number) {
  return String(number).padStart(2, '0');
}
```

- `isValidStart(text)`: `'20:00'`을 `split(':')`으로 잘라 `['20', '00']`을 만들고, `parts.length !== 2`(조각이 2개가 아님)이거나 한쪽이 비었으면 `false`를 돌려줘요. `!==`는 "같지 않다"예요(Day 16). 그다음 `Number()`로 숫자로 바꿔 시 `0~23`, 분 `0~59` 안에 있을 때만 `true`예요. 모양을 완벽히 따지는 검사는 아니에요(예: `20.5:00` 같은 이상한 값도 통과할 수 있어요). 화면이 깨지지는 않아서 연습용으로는 충분해요.
- `getTargetTime(text)`: 오늘 날짜의 그 시각을 `Date`로 만들어요. Day 26의 `new Date()` + `setHours(시, 분, 0, 0)`이에요.
- `pad(number)`: Day 26의 두 자리 맞추기와 같은 함수예요.

이 함수들은 아직 아무도 부르지 않아요. 콘솔에서 시험해 봐요.

**어디서:** 같은 페이지(주소에 `?title=…&start=20:00`이 붙은 채) → `F12` → **Console**

**무엇을:** 아래를 한 줄씩 입력하고 `Enter`를 눌러요.

```js
isValidStart('20:00')
```

```js
isValidStart('25:99')
```

```js
isValidStart('ab:cd')
```

```js
isValidStart('7:5')
```

예상 출력(순서대로 한 줄씩):

```text
true
false
false
true
```

:::success
네 줄이 `true`, `false`, `false`, `true`예요. `ab:cd`가 `false`인 이유는 `Number('ab')`가 `NaN`이고 `NaN >= 0`이 `false`이기 때문이에요. `7:5`가 `true`인 이유는 `Number('7')`이 7, `Number('5')`가 5라서 `07:05`로 읽히기 때문이에요.
:::

### 5단계 · countdown.js C: 1초마다 줄어들게, 멈추기, 사용법 문장 (10분)

**어디서:** VS Code → `C:\dev\my-creator-site\overlay\countdown.js`

**무엇을:** 파일 맨 끝(`pad` 함수 아래)에 아래 블록을 붙여 넣어요. 앞에 빈 줄 하나를 두고 저장하고 브라우저를 새로 고침해요.

📄 C:\dev\my-creator-site\overlay\countdown.js (일부)
```js
// ---------- 3. 1초마다 화면 갱신 ----------
let timerId = null;   // setInterval이 돌려주는 번호 (멈출 때 필요해요)
let targetTime = null; // 시작 시각 (Date)

function update() {
  const remaining = targetTime - new Date(); // 남은 시간 (밀리초). Date끼리 빼면 숫자가 나와요

  if (remaining <= 0) {
    countdownElement.textContent = '곧 시작해요!';
    clearInterval(timerId); // 더 이상 계산할 필요가 없어요
    return;
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  countdownElement.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

if (!isValidStart(start)) {
  // start가 없거나 모양이 틀리면 사용법을 알려 줘요
  countdownElement.classList.add('hint');
  countdownElement.textContent = '주소 끝에 ?title=방송 제목&start=20:00 을 붙여 주세요 (start는 HH:MM, 예: 20:00)';
} else {
  targetTime = getTargetTime(start);
  timerId = setInterval(update, 1000); // 1초마다 update 실행
  update(); // 1초 기다리지 않고 바로 한 번 보여 줘요
}
```

코드를 읽어 봐요.

- `let timerId = null;`: `setInterval`이 돌려주는 번호를 담아요. `let targetTime = null;`은 시작 시각(Date)을 담아요.
- `update()`: `targetTime - new Date()`로 남은 밀리초를 구해요. `remaining <= 0`(이미 지났다)이면 `곧 시작해요!`를 보여 주고 `clearInterval(timerId)`로 반복을 멈춘 뒤 `return`해요. 아니면 Day 26처럼 시·분·초로 나눠 `HH:MM:SS`를 보여요. 하루 이상 남아도 `일` 단위 없이 시간이 `24` 이상으로 보여요.
- 마지막 `if (!isValidStart(start))`: 시각이 올바르지 않으면 `classList.add('hint')`로 작은 글자 클래스를 붙이고 사용법 문장을 보여 줘요. 올바르면 `targetTime`을 정하고 `timerId = setInterval(update, 1000);`로 1초마다 `update`를 실행해요(괄호 없이 함수 이름만 넘겨요). 그리고 `update();`를 바로 한 번 불러서 첫 1초를 비우지 않아요.

:::success
주소 끝이 `?title=저녁 방송&start=20:00`일 때, 지금 시각이 20시 전이면 큰 흰 글씨로 `HH:MM:SS`(예: `02:15:07`)가 보이고 1초마다 줄어들어요(2단계에서 배경을 어둡게 하는 줄을 다시 입력해야 눈에 잘 보여요). 지금이 20시를 지났으면 바로 `곧 시작해요!`가 보여요. 콘솔에 빨간 오류는 없어요.
:::

### 6단계 · 주소를 바꿔 가며 확인하기 (6분)

**어디서:** Edge(또는 Chrome)로 연 `countdown.html`의 주소 칸

**무엇을:** 주소 끝의 값을 아래처럼 바꿔 가며 `Enter`를 눌러 보세요. 개발자 도구 Console에서 2단계 줄로 배경을 어둡게 하면 글자가 잘 보여요. 주소를 바꾸면 배경이 흰색으로 돌아가니, 콘솔에서 `↑` 키로 그 줄을 불러와 `Enter`로 다시 실행해요.

| 주소 끝 | 보이는 결과 |
|---|---|
| `?title=저녁 방송&start=20:00` | 제목 `저녁 방송`, 남은 시간 `HH:MM:SS` |
| `?title=새벽 방송&start=00:00` | 지금이 00:00 이후라 `곧 시작해요!` |
| `?start=20:00` | 제목이 기본 `방송 시작까지` |
| `?title=저녁 방송&start=25:99` | 작은 글자 사용법 문장 |
| `?title=저녁 방송` | 작은 글자 사용법 문장 |
| (값 없이 `countdown.html`만) | 제목 `방송 시작까지` + 작은 글자 사용법 문장 |

:::success
표와 같아요. 사용법 문장은 `주소 끝에 ?title=방송 제목&start=20:00 을 붙여 주세요 (start는 HH:MM, 예: 20:00)`예요. 폭을 줄여 보면(개발자 도구 기기 모드 360px) 큰 글씨가 비례해서 작아지고 가로 스크롤은 생기지 않아요.
:::

### 7단계 · 커밋·푸시하고 배포 주소에서 확인하기 (5분)

**어디서:** VS Code → 소스 제어 패널(`Ctrl + Shift + G`)

**무엇을:** **메시지** 칸에 `Day 27: OBS 카운트다운 오버레이`를 입력하고 **커밋** → **변경 내용 동기화**를 눌러요. 명령으로 한다면 VS Code 터미널(PowerShell), 위치 `C:\dev\my-creator-site`에서 아래를 한 줄씩 실행해요.

```powershell
git add .
git commit -m "Day 27: OBS 카운트다운 오버레이"
git push
```

`git commit` 예상 출력(해시와 숫자는 달라도 돼요):

```text
[main 4c0e7f3] Day 27: OBS 카운트다운 오버레이
 3 files changed, 141 insertions(+)
```

푸시 후 최대 10분 기다린 뒤, Edge 주소창에 아래 주소를 입력해 열어요. `<내 아이디>`는 내 GitHub 아이디예요.

```text
https://<내 아이디>.github.io/my-creator-site/overlay/countdown.html?title=저녁%20방송&start=20:00
```

:::success
배포 주소에서도 같은 카운트다운이 나와요(배경을 어둡게 해야 보여요). `404`가 나오면 아직 반영 중이거나 푸시를 안 했거나 `overlay` 폴더 이름의 대소문자가 달라요. 아래 🧯를 보세요. GitHub에 `Day 27` 커밋이 보여요.
:::

### 8단계 · (선택) OBS Studio에 띄워 보기 (9분)

OBS를 안 써도 오늘 목표는 모두 끝났어요. 방송을 하거나 해 볼 생각이라면 아래를 따라 해 봐요. **Windows 11 설치 화면과 OBS 화면은 이 교재를 쓰는 환경에서 직접 실행해 확인하지 못했어요.** 아래 안내는 공식 소스 자료에 근거한 것이라서, 화면 문구는 버전에 따라 조금 다를 수 있어요.

**어디서:** 웹 브라우저 → `https://obsproject.com/` (OBS 공식 사이트)

**무엇을 (설치):**

1. 사이트에서 Windows용 설치 프로그램을 내려받아 실행해요(작성 기준 33.0.1, 작성 기준일 2026-11. 파일 이름 예: `OBS-Studio-33.0.1-Windows-x64-Installer.exe`).
2. 사용자 계정 컨트롤 창("이 앱이 디바이스를 변경하도록 허용하시겠어요?" 같은 문구, 버전에 따라 다를 수 있어요)이 뜨면 **예**를 눌러요.
3. 설치 마법사의 기본 선택을 유지하며 **다음** → **설치** → **마침**을 눌러요.

**무엇을 (브라우저 소스 추가):**

1. OBS를 실행해요. 처음에 자동 구성 마법사가 나오면 건너뛰어도 돼요.
2. 창 아래쪽 **소스** 목록(도크)의 **+** 버튼을 눌러요.
3. 나오는 목록에서 **브라우저**를 골라요. 이름을 `카운트다운`으로 입력하고 **확인**을 눌러요.
4. 속성 창이 열리면 **URL** 칸에 7단계의 **배포 주소**를 붙여 넣어요. **너비**는 `1920`, **높이**는 `1080`으로 바꿔요(기본값은 800×600이에요). **확인**을 눌러요.

:::success
OBS 미리 보기 화면에 배경 없이 흰 글자로 `저녁 방송`과 남은 시간만 떠 있어요. 게임 화면이나 카메라 소스 위에 올려도 글자만 겹쳐 보여요. 안 보이면 아래 🧯의 "OBS에서 배경이 불투명해요"를 보세요.
:::

:::tip 주소를 어디에 넣을지
속성 창의 **로컬 파일** 체크는 파일 경로를 직접 열기 때문에 주소 뒤에 `?title=…&start=…`를 붙이기 어려워요(이 부분은 직접 확인하지 못했어요). **URL 칸에 배포 주소를 쓰는 것**을 추천해요. VS Code의 Live Preview 주소(`http://127.0.0.1:3000/…`)도 넣을 수 있지만, VS Code를 닫으면 OBS 화면이 비어요.
:::

## ✍️ 과제

### 과제 1 · 주소 예측하기 (쉬움 ⭐, 8분)

아래 주소 네 개를 열면 각각 어떤 화면이 나올까요? 열어 보기 전에 먼저 예측하고, 열어서 확인해요. (지금이 07시 05분 전이라고 가정해요.)

1. `countdown.html?title=A&start=24:00`
2. `countdown.html?title=A&start=ab:cd`
3. `countdown.html?title=A&start=7:5`
4. `countdown.html` (값 없음)

- 확인 방법: 실제 화면과 내 예측을 비교해요.
- 힌트: `isValidStart`가 `true`를 돌려주는지 아닌지만 보면 돼요. 시는 `0~23`이에요.

### 과제 2 · 내 방송 주소 만들기 (보통 ⭐⭐, 8분)

내 아이디, 내 방송 제목(한글), 내 시작 시각으로 OBS에 넣을 **배포 주소**를 만들어 메모장이나 README에 적어 보세요. 그리고 그 주소로 열어서 맞게 나오는지 확인해요.

- 확인 방법: 내 제목과 시각이 화면에 나와요.
- 힌트: `?`는 한 번만, 값 사이는 `&`, 빈칸은 `%20`이에요. 한글은 그대로 써도 브라우저가 알아서 변환해요.

### 과제 3 · 1분 미만이면 노랗게 (도전 ⭐⭐⭐, 9분)

남은 시간이 60초 미만이면 숫자를 노랗게 바꾸고 싶어요. `update()` 안에 조건 하나와 CSS 규칙 하나를 **코드로만** 써 보세요. 끝 상태에는 넣지 않아요.

- 확인 방법: 쓴 코드를 정답과 비교해요.
- 힌트: `remaining`은 밀리초예요. 60초는 몇 밀리초일까요? 클래스를 붙이는 방법은 `classList.add`예요.

## ✅ 정답

:::answer 과제 1 정답 · 주소 예측하기
```text
1. start=24:00  → 사용법 문장 (시는 0~23이라 24는 범위 밖)
2. start=ab:cd  → 사용법 문장 (Number('ab')는 NaN, 비교가 모두 false)
3. start=7:5    → 동작 (07:05로 읽혀요. 이미 지났다면 곧 시작해요!)
4. 값 없음      → 사용법 문장, 제목은 기본 방송 시작까지
```

**왜 이렇게 하나요?** `isValidStart`는 `:`로 자른 조각이 정확히 2개이고 빈 조각이 없으며, `Number()`로 바꾼 시가 `0~23`, 분이 `0~59`일 때만 `true`예요. `7:5`는 두 조각 `'7'`, `'5'`가 모두 올바른 숫자라서 통과해요. `Number('5')`는 `5`이기 때문에 앞에 `0`을 안 붙여도 돼요. 값이 아예 없으면 `params.get('start')`가 `null`이라서 `|| ''`로 빈 글자가 되고, 빈 글자는 `split(':')`하면 조각이 1개(`['']`)라 `false`예요. 제목은 `params.get('title') || '방송 시작까지'` 덕분에 기본값이 쓰여요.
:::

:::answer 과제 2 정답 · 내 방송 주소 만들기
예시(아이디가 `moonbear`, 제목 `저녁 방송`, 시각 20시 30분):

```text
https://moonbear.github.io/my-creator-site/overlay/countdown.html?title=저녁%20방송&start=20:30
```

**왜 이렇게 하나요?** 주소는 `https://아이디.github.io/my-creator-site/overlay/countdown.html` 다음에 `?`를 한 번 쓰고, `이름=값`을 `&`로 이어요. 제목의 빈칸은 `%20`으로 쓰면 어떤 프로그램에서 붙여 넣어도 안전해요. 한글은 그대로 써도 브라우저와 OBS가 알아서 변환해요. 시각은 반드시 반각 콜론(`:`)이어야 해요(한글 입력 상태에서 칠 때 나오는 전각 콜론 `：`은 틀려요). 이 오버레이는 "오늘의 시작 시각"만 지원해서, 이미 지난 시각을 넣으면 바로 `곧 시작해요!`가 나와요.
:::

:::answer 과제 3 정답 · 1분 미만이면 노랗게
```js
if (remaining < 60000) {
  countdownElement.classList.add('soon');
}
```

```css
.countdown.soon {
  color: #ffd66b;
}
```

**왜 이렇게 하나요?** 60초는 `60 * 1000 = 60000`밀리초예요. `update()`에서 남은 시간을 계산한 뒤(`remaining` 정의 아래) 이 조건을 넣으면, 1분이 안 남았을 때 `soon` 클래스가 붙어요. CSS의 `.countdown.soon`은 `countdown`과 `soon`을 둘 다 가진 요소를 고르는 복합 선택자라서, 평소 `.countdown`의 흰색 대신 노란색이 돼요. 이 코드는 연습이라 끝 상태에는 넣지 않아요.
:::

:::answer 오늘 끝 상태 전체 코드
막혔다면 아래 코드로 내 파일을 맞추고 다음 Day를 시작해요. 새 파일 3개를 모두 전체로 실었어요. 사이트의 다른 파일은 어제와 같아요.

```text
my-creator-site/
├─ css/
│  └─ style.css
├─ data/
│  ├─ schedule.json
│  └─ videos.json
├─ images/
│  ├─ logo.svg
│  ├─ profile.svg
│  ├─ thumb-game.svg
│  ├─ thumb-music.svg
│  └─ thumb-talk.svg
├─ js/
│  ├─ contact.js
│  ├─ contents.js
│  ├─ main.js
│  └─ schedule.js
├─ overlay/
│  ├─ countdown.css ★
│  ├─ countdown.html ★
│  └─ countdown.js ★
├─ about.html
├─ contact.html
├─ contents.html
├─ index.html
└─ schedule.html
```

📄 C:\dev\my-creator-site\overlay\countdown.html
```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>방송 카운트다운 오버레이</title>
  <link rel="stylesheet" href="countdown.css">
  <script src="countdown.js" defer></script>
</head>
<body>
  <!-- OBS 브라우저 소스 주소 예: .../overlay/countdown.html?title=저녁 방송&start=20:00 -->
  <main class="overlay">
    <h1 id="title" class="title">방송 시작까지</h1>
    <p id="countdown" class="countdown" role="timer">--:--:--</p>
  </main>
</body>
</html>
```

📄 C:\dev\my-creator-site\overlay\countdown.css
```css
/* ==========================================================
   countdown.css - OBS 오버레이 스타일
   배경은 transparent(투명)라서 OBS에서 게임 화면 위에 글자만 떠 보여요.
   ========================================================== */

html,
body {
  margin: 0;
  background: transparent; /* 투명 배경: 이 한 줄이 오버레이의 핵심이에요 */
  overflow: hidden;        /* 스크롤바가 생기지 않게 해요 */
}

body {
  font-family: system-ui, "Malgun Gothic", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
  color: #ffffff;
  /* 밝은 화면 위에서도 읽히도록 어두운 그림자를 둘러요 */
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.9), 0 2px 12px rgba(0, 0, 0, 0.8);
  text-align: center;
}

.overlay {
  box-sizing: border-box;
  min-height: 100vh;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.title {
  margin: 0 0 0.5rem;
  max-width: 100%;
  overflow-wrap: anywhere; /* 긴 제목은 줄을 바꿔요 */
  font-size: clamp(1.25rem, 6vw, 2.5rem); /* 화면 폭에 맞춰 커지고 작아져요 */
}

.countdown {
  margin: 0;
  font-size: clamp(2.5rem, 16vw, 6rem);
  font-weight: 800;
  font-variant-numeric: tabular-nums; /* 숫자 폭을 같게 해서 흔들리지 않아요 */
}

/* 주소를 잘못 썼을 때 나오는 안내 문장은 작게 보여요 */
.countdown.hint {
  font-size: 1rem;
  font-weight: 400;
}
```

📄 C:\dev\my-creator-site\overlay\countdown.js
```js
// ==========================================================
// countdown.js - OBS 오버레이: 방송 시작까지 카운트다운
// 주소 예시: countdown.html?title=저녁 방송&start=20:00
//   title : 화면에 보여 줄 방송 제목
//   start : 오늘 방송 시작 시각 (HH:MM)
//
// 이 코드는 컴퓨터 시간이 한국 시간이라고 가정해요. 시간대는 P2에서 제대로 배워요.
// ==========================================================

const titleElement = document.querySelector('#title');
const countdownElement = document.querySelector('#countdown');

// ---------- 1. 주소(URL)에서 값 꺼내기 (Day 27) ----------
// location.search 는 '?title=...&start=...' 부분이에요
const params = new URLSearchParams(location.search);
const title = params.get('title') || '방송 시작까지'; // 없으면 기본 제목
const start = params.get('start') || '';

titleElement.textContent = title;

// ---------- 2. 시작 시각 확인하고 Date로 바꾸기 ----------
// 'HH:MM' 모양이고, 시는 0~23, 분은 0~59 사이인지 확인해요
function isValidStart(text) {
  const parts = text.split(':'); // '20:00' → ['20', '00']
  if (parts.length !== 2 || parts[0] === '' || parts[1] === '') {
    return false; // ':'가 하나가 아니거나 비어 있으면 틀린 값이에요
  }

  const hour = Number(parts[0]); // 글자를 숫자로 바꿔요. 숫자가 아니면 NaN이 되어 아래 비교에서 걸러져요
  const minute = Number(parts[1]);
  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
}

// 오늘 날짜에 시작 시각을 맞춘 Date를 만들어요
function getTargetTime(text) {
  const parts = text.split(':');
  const target = new Date(); // 지금
  target.setHours(Number(parts[0]), Number(parts[1]), 0, 0); // 시, 분, 초, 밀리초
  return target;
}

// 숫자를 두 자리 글자로: 5 → '05'
function pad(number) {
  return String(number).padStart(2, '0');
}

// ---------- 3. 1초마다 화면 갱신 ----------
let timerId = null;   // setInterval이 돌려주는 번호 (멈출 때 필요해요)
let targetTime = null; // 시작 시각 (Date)

function update() {
  const remaining = targetTime - new Date(); // 남은 시간 (밀리초). Date끼리 빼면 숫자가 나와요

  if (remaining <= 0) {
    countdownElement.textContent = '곧 시작해요!';
    clearInterval(timerId); // 더 이상 계산할 필요가 없어요
    return;
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  countdownElement.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

if (!isValidStart(start)) {
  // start가 없거나 모양이 틀리면 사용법을 알려 줘요
  countdownElement.classList.add('hint');
  countdownElement.textContent = '주소 끝에 ?title=방송 제목&start=20:00 을 붙여 주세요 (start는 HH:MM, 예: 20:00)';
} else {
  targetTime = getTargetTime(start);
  timerId = setInterval(update, 1000); // 1초마다 update 실행
  update(); // 1초 기다리지 않고 바로 한 번 보여 줘요
}
```
:::

## 🧯 자주 막히는 곳

여기에 없는 증상은 [문제 해결 모음](#/page/troubleshooting)에서 찾아보세요.

### 브라우저에서 열었는데 글자가 안 보여요

**원인:** 정상이에요. 글자가 흰색이고 배경이 투명해서, 일반 브라우저의 흰 바탕 위에서는 흰 글자가 안 보여요.

**해결:** 개발자 도구 Console에서 `document.body.style.background = '#444';`를 입력하면 배경이 어두워져서 보여요(새로 고침하면 사라져요).

### OBS에서 배경이 불투명해요

**원인:** 오버레이 페이지에 불투명 배경이 있어요. `countdown.css`의 `background: transparent;`가 빠졌거나, `countdown.html`에 사이트의 `css/style.css`를 잘못 연결했어요. 페이지가 자기 배경색을 칠하면 OBS의 기본 투명 처리가 풀려요.

**해결:** `countdown.html`의 `<head>`에 `countdown.css`만 연결되어 있는지 확인하고, `countdown.css`의 `html, body` 규칙에 `background: transparent;`가 있는지 봐요.

### 계속 사용법 문장이 나와요

**원인:** `start` 값이 올바른 `HH:MM`이 아니에요. 흔한 실수 세 가지가 있어요. ① 복사해 온 글에 섞인 전각 콜론 `20：00`이나 `:`·`&` 오타. ② `?`를 두 번 쓰거나 `&` 대신 `,`를 썼어요. ③ `start=`를 `star=`로 틀리게 썼어요.

**해결:** 영어 입력 상태(`한/영` 키)에서 `?title=저녁 방송&start=20:00`을 다시 입력해요. 이름이 `title`, `start`로 정확한지 봐요.

### 시간이 계속 --:--:-- 에서 안 바뀌어요

**원인:** `countdown.js`가 불러와지지 않았어요. `<script src="countdown.js" defer>`의 파일 이름이 틀렸거나 파일이 `overlay` 폴더가 아닌 곳에 있어요.

**해결:** 개발자 도구 **Console**에 `404`나 빨간 오류가 있는지 보고, `C:\dev\my-creator-site\overlay\countdown.js`가 있는지 확인해요.

### 배포 주소가 404예요

**원인:** 푸시를 안 했거나, 반영에 시간이 걸리는 중이거나(최대 10분), 폴더 이름의 대소문자가 달라요(`Overlay`). 배포 서버는 대소문자를 구분해요.

**해결:** 소스 제어 패널의 변경이 0개이고 **변경 내용 동기화** 버튼에 숫자가 없는지 확인하고(변경 0개는 커밋이 끝났다는 뜻일 뿐이라 동기화까지 해야 올라가요), GitHub 저장소의 커밋 목록에 오늘 커밋이 있는지, `overlay/countdown.html`이 있는지 봐요. 폴더 이름이 `Overlay`처럼 대문자라면 임시 이름을 거쳐 두 번 바꿔요. 순서는 [도움말 7번](#/page/help)이에요. Actions가 초록인지도 보고, 10분 기다린 뒤 `Ctrl + F5`로 다시 열어요.

### OBS에서 빈 화면이 나와요

**원인:** Live Preview 주소(`http://127.0.0.1:…`)를 넣었는데 VS Code를 닫았어요. 그 주소는 VS Code가 켜져 있을 때만 열려요.

**해결:** 배포 주소를 URL에 넣어요. OBS가 예전 화면을 보여 주면 브라우저 소스 속성 창에서 새로 고침 관련 버튼을 눌러요(버튼 이름은 OBS 버전에 따라 다를 수 있어요, 실기 미확인).

## 📝 오늘의 체크리스트

- [ ] `C:\dev\my-creator-site\overlay\` 폴더에 `countdown.html`, `countdown.css`, `countdown.js` 3개가 있어요
- [ ] 주소에 `?title=저녁 방송&start=20:00`을 붙이면 제목과 `HH:MM:SS`가 1초마다 줄어들어요
- [ ] 시각이 이미 지났으면 `곧 시작해요!`가 나와요
- [ ] `start`가 없거나 `25:99`이면 작은 글자 사용법 문장이 나와요
- [ ] 일반 브라우저에서 글자가 안 보이는 이유(흰 글자·투명 배경)를 설명할 수 있어요
- [ ] `clamp(1.25rem, 6vw, 2.5rem)`이 무슨 뜻인지 말할 수 있어요
- [ ] `setInterval(update, 1000)`에 괄호가 없는 이유를 말할 수 있어요
- [ ] 배포 주소에서도 같은 화면이 나와요
- [ ] 과제 1~3을 하고 정답과 비교했어요, GitHub에 `Day 27` 커밋이 있어요
- [ ] (선택) OBS 브라우저 소스에 주소를 넣어 글자만 뜨는 것을 확인했어요

## 📚 더 알아보기

- [OBS Studio 공식 사이트](https://obsproject.com/): 설치 파일과 사용 안내를 받을 수 있어요.
- [MDN — URLSearchParams](https://developer.mozilla.org/ko/docs/Web/API/URLSearchParams): 주소의 파라미터를 읽고 만드는 방법이에요.
- [MDN — clamp() (영어 문서)](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/clamp): 최솟값·기본값·최댓값 함수를 설명해요.

➡️ **다음 Day 예고:** [Day 28 · 품질 높이기](#/day/p1-d28)에서는 키보드만으로 사이트를 돌아다니게 다듬고, 검색에 잘 걸리도록 설명 문장을 달고, 파비콘을 넣고, Lighthouse로 품질 점수를 확인해요.
