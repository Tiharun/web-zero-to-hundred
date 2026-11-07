## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- 방송 일정 페이지에서 오늘 요일 행이 노란 배경과 `(오늘)` 글자로 강조돼요(휴방인 날도 강조돼요).
- "다음 방송" 상자에 `수요일 21:00 · 수요일 수다 타임 · 시작까지`와 1초마다 줄어드는 남은 시간(`1일 02:03:04`)이 나와요.
- `Date`로 요일·날짜를 계산하고, 두 `Date`를 빼서 나온 밀리초를 일·시·분·초로 바꿀 수 있어요.
- `setInterval`에 함수를 넘길 때 괄호를 붙이면 안 되는 이유를 설명할 수 있어요.

**예상 시간: 110분** (개념 이해 25분 · 따라하기 64분 · 과제 18분 · 정리 3분)

:::path 📂 시작 상태
어제(Day 25)까지 만든 파일이 이렇게 있어야 해요. 없거나 다르면 [Day 25](#/day/p1-d25)의 "오늘 끝 상태 전체 코드"로 맞춰 주세요.

- `C:\dev\my-creator-site\about.html`
- `C:\dev\my-creator-site\contact.html`
- `C:\dev\my-creator-site\contents.html`
- `C:\dev\my-creator-site\index.html`
- `C:\dev\my-creator-site\schedule.html`
- `C:\dev\my-creator-site\css\style.css`
- `C:\dev\my-creator-site\data\videos.json`
- `C:\dev\my-creator-site\images\logo.svg`
- `C:\dev\my-creator-site\images\profile.svg`
- `C:\dev\my-creator-site\images\thumb-game.svg`
- `C:\dev\my-creator-site\images\thumb-music.svg`
- `C:\dev\my-creator-site\images\thumb-talk.svg`
- `C:\dev\my-creator-site\js\contact.js`
- `C:\dev\my-creator-site\js\contents.js`
- `C:\dev\my-creator-site\js\main.js`
- 연습 폴더 `C:\dev\hello\`에 `hello.html`, `favorites.html`, `tools.html`, `links.html`, `plan.html`, `lab.html`, `lab.js`, `pages\back.html`이 있어요(오늘은 열지 않아도 돼요).
- VS Code에서 `C:\dev\my-creator-site` 폴더가 열려 있고, 한국어 팩과 Live Preview 확장 프로그램이 설치되어 있어요.
- 파일 탐색기의 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
- Git이 설치되어 있고(`git --version` → `git version 2.56.0.windows.4`, 숫자는 달라도 돼요) GitHub의 공개(Public) 저장소 `https://github.com/<내 아이디>/my-creator-site`와 연결되어 있어요.
- GitHub Pages가 켜져 있어요: `https://<내 아이디>.github.io/my-creator-site/`
- 어제까지의 변경이 모두 커밋·푸시되어 소스 제어 패널의 변경이 0개예요.
:::

## 📖 개념 이해

:::info 컴퓨터 시계 기준이에요
오늘 만드는 모든 시간 계산은 **컴퓨터 시계 기준**이에요. 한국에서 쓰는 컴퓨터라면 한국 시간으로 계산돼요. 컴퓨터의 날짜·시간·시간대가 틀리면 결과도 틀리게 보여요. 시간대를 제대로 다루는 방법은 P2 Day 29에서 배워요.
:::

### Date를 더 깊게: 요일, 복사, 며칠 뒤

Day 16에서 `new Date().getHours()`로 시각을 읽었어요. 오늘은 `Date`를 몇 가지 더 써요.

- `date.getDay()`: 요일 번호예요. **일요일이 0, 월요일 1, … 토요일 6**이에요.
- `date.setHours(시, 분, 초, 밀리초)`: 시각을 그 값으로 바꿔요. `setHours(20, 0, 0, 0)`은 "20시 0분 0초 0밀리초"예요.
- `date.getDate()`와 `date.setDate(숫자)`: 그 달의 날짜(1~31)를 읽고 바꿔요. `setDate(getDate() + 7)`은 "7일 뒤"예요. 월말을 넘기면 자동으로 다음 달로 넘어가요(31일 + 1 = 다음 달 1일).
- `new Date(다른Date)`: **복사**예요. `setHours` 같은 메서드는 Date 자신을 바꾸기 때문에, 원래 값을 지키려면 복사본을 만들어서 바꿔요.

```js
const now = new Date();
const next = new Date(now);  // now 를 복사
next.setHours(20, 0, 0, 0);  // 복사본만 20:00 으로
```

### 두 Date를 빼면 밀리초 숫자가 나와요

Date끼리는 크기를 비교할 수 있고(`<`, `<=`), 빼면 숫자가 나와요. 그 숫자의 단위가 **[[밀리초]]**(millisecond, 줄여서 ms)예요. 1초를 1000으로 나눈 시간 단위라서, `1000`밀리초가 1초예요. JavaScript가 시간을 밀리초로 세기 때문에 시간 계산의 기본 단위가 돼요.

```js
const diff = next - now;  // 밀리초 숫자. 예: 90061000
```

밀리초를 "1일 01:01:01" 같은 모양으로 바꾸려면 단위를 차례로 쪼개요. 나머지 연산 `%`(Day 15)를 써요.

```text
90061000 ms
÷ 1000  = 90061 초   (Math.floor 로 소수 버림)
÷ 86400 = 1 일       (하루 = 86400초)
(90061 % 86400) ÷ 3600 = 1 시간
(90061 % 3600)  ÷ 60   = 1 분
 90061 % 60            = 1 초
```

`Math.floor(숫자)`는 소수점 아래를 버려요(`Math.floor(2.9)` → 2). `a % b`는 `a`를 `b`로 나눈 **나머지**예요(`7 % 3` → 1). 시계가 `59초 → 0초`로 되돌아가는 것도 `% 60`이에요.

### 한 자리 숫자를 두 자리로: padStart

시계에 `1:2:3`이 아니라 `01:02:03`처럼 보이려면 숫자를 두 자리 글자로 맞춰야 해요.

```js
String(5).padStart(2, '0')  // '05'
```

`String(5)`는 숫자를 글자 `'5'`로 바꾸고(Day 15), `padStart(길이, 채울 글자)`는 글자 앞에 `'0'`을 채워서 길이를 맞춰요. 이미 두 자리면(`'12'`) 그대로예요.

### 글자를 잘라서 숫자로: split과 Number

일정 데이터의 시작 시각은 `'20:00'`이라는 **글자**예요. `split(':')`은 `:`를 기준으로 잘라서 배열을 만들어요(Day 17의 배열).

```js
'20:00'.split(':')  // ['20', '00']
Number('20')        // 20 (글자를 숫자로, Day 15)
```

### setInterval: 정해진 시간마다 되풀이

**[[setInterval]]**(셋 인터벌)은 함수를 정한 시간마다 되풀이해 실행하는 브라우저 기능이에요.

```js
setInterval(updateCountdown, 1000); // 1000밀리초(1초)마다 updateCountdown 을 불러요
```

**함수 이름 뒤에 괄호를 붙이지 않아요.** `setInterval(updateCountdown(), 1000)`처럼 괄호를 붙이면 지금 **한 번** 실행되고, 그 결과(보통 `undefined`)가 넘어가서 아무것도 반복되지 않아요. Day 21의 `addEventListener('click', toggleMenu)`와 같은 이유예요. "나중에 불러 주세요" 하고 함수 자체를 넘기는 거예요.

### 일정 데이터와 요일 번호

방송 일정은 JSON(Day 25)으로 둬요. `day`가 `getDay()`와 같은 번호(월 1 … 토 6, 일 0)라서 요일 비교가 쉬워요.

```json
{ "day": 1, "start": "20:00", "title": "신작 게임 같이 해요" }
```

HTML 표의 각 행도 같은 번호를 달아요: `<tr data-day="1">`(Day 21의 data 속성). 그래서 JavaScript는 `` `tr[data-day="${today}"]` ``처럼 템플릿 리터럴(Day 16)로 오늘 요일의 행을 찾아요. 이 선택자는 Day 11의 속성 선택자를 변수와 함께 쓴 거예요. 일요일은 7이 아니라 **0**이에요.

### 의사 요소: HTML에 없는 가상의 요소

오늘 행에 노란 배경만 입히면 색을 구별하기 어려운 사람은 오늘이 어딘지 알 수 없어요. 색뿐 아니라 `(오늘)` 글자도 함께 붙여서 정보를 이중으로 줘요. 그런데 이 글자를 HTML에 직접 쓰면 오늘이 아닌 날에도 있게 돼요. CSS로 "오늘 행의 요일 칸 뒤에만" 붙이는 방법이 **[[의사 요소]]**(pseudo-element)예요.

의사 요소는 HTML에 없는 가상의 요소를 CSS로 만들어 꾸미는 선택자예요. 콜론 **두 개**를 써서 `::after`(요소 내용의 뒤), `::before`(앞)처럼 적어요. Day 14에서 배운 `:hover` 같은 의사 클래스(콜론 한 개)와 비슷해 보이지만 하는 일이 달라요. 의사 클래스는 "요소의 상태"를 고르고, 의사 요소는 "요소의 한 부분 또는 가상의 새 부분"을 만들어요.

```css
.schedule-table tr.today th::after {
  content: " (오늘)";
}
```

`.schedule-table tr.today th`는 "표 안에서 `today` 클래스를 가진 `tr`의 `th`"예요. `tr.today`는 요소 이름과 클래스를 빈칸 없이 붙인 복합 선택자(Day 21)예요. `content`에 넣은 글자가 `th` 뒤에 나타나요.

### 접근성 속성 세 가지

- `aria-current="date"`: 이 행이 "지금(오늘)"을 나타낸다고 알려요. 메뉴의 `aria-current="page"`와 같은 계열이에요(Day 11).
- `role="timer"`: 시간이 계속 바뀌는 영역이에요. 1초마다 바뀌어도 스크린 리더가 매번 읽지 않아요(`aria-live`를 쓰면 매초 읽어서 시끄러워요).
- `aria-labelledby="next-heading"`: 구역(`section`)의 이름을 `id`가 `next-heading`인 제목과 연결해요. 스크린 리더가 "다음 방송 영역"이라고 읽어 줘요.

숫자가 바뀔 때 폭이 달라져 흔들리지 않게 `font-variant-numeric: tabular-nums;`를 써요. 숫자 모양의 폭을 모두 같게 해요.

## 🛠️ 따라하기

모두 8단계예요. 데이터 → HTML → CSS → JavaScript 순서로, JavaScript는 세 번에 나누어 쌓아요. 이 페이지는 `fetch`를 쓰니 **Live Preview**(또는 배포 주소)로 열어요. 파일 더블클릭으로는 일부만 동작해요. 개발자 도구가 필요하면 Live Preview 미리 보기 창 위쪽 주소 칸의 주소(`http://127.0.0.1:3000/schedule.html`, 숫자는 달라도 돼요)를 복사해서 Edge(또는 Chrome) 주소창에 붙여 열어요.

### 1단계 · data\schedule.json 만들기 (4분)

**어디서:** VS Code 왼쪽 탐색기 → `data` 폴더 위에서 오른쪽 클릭 → **새 파일**

**무엇을:** `schedule.json`을 입력하고 `Enter`를 눌러요(경로 `C:\dev\my-creator-site\data\schedule.json`). 열린 빈 파일에 아래 내용을 붙여 넣고 `Ctrl + S`로 저장해요. `day` 숫자가 요일(월 1, 수 3, 금 5, 토 6)이고, 휴방인 날(화·목·일)은 넣지 않아요. 글 내용(시작 시간, 제목)은 내 방송에 맞게 바꿔도 돼요.

📄 C:\dev\my-creator-site\data\schedule.json
```json
[
  { "day": 1, "start": "20:00", "title": "신작 게임 같이 해요" },
  { "day": 3, "start": "21:00", "title": "수요일 수다 타임" },
  { "day": 5, "start": "20:00", "title": "신청곡 라이브" },
  { "day": 6, "start": "15:00", "title": "시청자 참여 게임" }
]
```

:::success
탐색기의 `data` 폴더에 `videos.json`과 `schedule.json`이 같이 보이고, `schedule.json`에 빨간 물결 밑줄이 없어요.
:::

### 2단계 · schedule.html: 다음 방송 상자와 표 표시 달기 (10분)

**어디서:** VS Code → `C:\dev\my-creator-site\schedule.html`

**무엇을:** 세 곳을 고쳐요.

**(1)** `<h1>방송 일정</h1>` 아래의 안내 문장 `<p>모든 시간은 한국 시간이에요.</p>` **한 줄**을 아래 블록으로 바꿔요(블록 안에 새 안내 문장이 이미 들어 있어요). 그 아래 `<table …>` 줄은 그대로 둬요. 안내 문장이 길어지고, "다음 방송" 상자(`section`)가 생겨요.

📄 C:\dev\my-creator-site\schedule.html (일부)
```html
    <p>모든 시간은 한국 시간이에요. 오늘 요일은 표에서 색으로 표시돼요.</p>

    <section class="next-box" aria-labelledby="next-heading">
      <h2 id="next-heading">다음 방송</h2>
      <!-- role="timer": 1초마다 바뀌어도 스크린 리더가 계속 읽지 않아요 -->
      <p id="next-broadcast" role="timer"><span id="next-info"></span> <strong id="next-remaining"></strong></p>
    </section>
```

- `<section class="next-box" aria-labelledby="next-heading">`: `aria-labelledby`로 아래 `<h2 id="next-heading">`을 이름으로 삼아요.
- `<p id="next-broadcast" role="timer">`: 안에 `<span id="next-info">`(다음 방송 설명)와 `<strong id="next-remaining">`(남은 시간)이 있어요. 둘 다 JavaScript가 글자를 채워요.

**(2)** `<table class="schedule-table">`을 아래 한 줄로 바꿔요. `id="schedule-table"`이 생겨요.

```html
    <table id="schedule-table" class="schedule-table">
```

**(3)** `<tbody>`부터 `</tbody>`까지를 아래 블록으로 바꿔요. 행마다 `data-day`가 생기고 위에 설명 주석이 붙어요. 휴방일에도 `data-day`는 있어야 그날 행이 강조돼요.

📄 C:\dev\my-creator-site\schedule.html (일부)
```html
      <tbody>
        <!-- data-day는 JavaScript의 getDay()와 같은 숫자예요 (일요일 0 ~ 토요일 6) -->
        <tr data-day="1"><th scope="row">월요일</th><td>20:00</td><td>신작 게임 같이 해요</td></tr>
        <tr data-day="2"><th scope="row">화요일</th><td>-</td><td>휴방</td></tr>
        <tr data-day="3"><th scope="row">수요일</th><td>21:00</td><td>수요일 수다 타임</td></tr>
        <tr data-day="4"><th scope="row">목요일</th><td>-</td><td>휴방</td></tr>
        <tr data-day="5"><th scope="row">금요일</th><td>20:00</td><td>신청곡 라이브</td></tr>
        <tr data-day="6"><th scope="row">토요일</th><td>15:00</td><td>시청자 참여 게임</td></tr>
        <tr data-day="0"><th scope="row">일요일</th><td>-</td><td>휴방</td></tr>
      </tbody>
```

저장하고 Live Preview에서 `schedule.html`을 열어요.

:::success
"방송 일정" 제목 아래에 안내 문장 `모든 시간은 한국 시간이에요. 오늘 요일은 표에서 색으로 표시돼요.`가 있고, 그 아래 **다음 방송** 상자(제목만 있고 내용은 비어 있어요)와 표 7줄이 보여요. 상자 모양은 3단계에서 꾸며요.
:::

### 3단계 · style.css: 강조 색과 상자 모양 (8분)

**어디서:** VS Code → `C:\dev\my-creator-site\css\style.css`

**무엇을:** 네 곳에 넣어요.

**(1)** 맨 위 `:root {`에서 `--success: #1b6e3c;` 줄 **바로 아래**에 한 줄을 넣어요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
  --highlight: #fff3c4;    /* 오늘 요일 강조 */
```

**(2)** `:root[data-theme="dark"] {`에서 `--success: #6fd49a;` 줄 **바로 아래**에 한 줄을 넣어요. 어두운 배경에서 어두운 노랑이에요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
  --highlight: #4a3f12;
```

**(3)** 6번 구역의 `/* 방송 일정 */` 주석 아래에서 `.schedule-table {`로 시작하는 규칙을 찾아 그 규칙 **바로 위**에 아래 블록을 넣어요(블록 끝의 빈 줄 포함).

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
.next-box {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1rem;
  margin: 1.5rem 0;
}

.next-box h2 {
  margin-top: 0;
}

.next-box p {
  margin: 0;
}

#next-remaining {
  display: block;
  font-size: 1.75rem;
  font-variant-numeric: tabular-nums; /* 숫자 폭을 같게 해서 흔들리지 않아요 */
}
```

**(4)** `.schedule-table thead th { … }` 규칙이 끝나는 `}` 줄 **바로 아래**(빈 줄 뒤)에 아래 블록을 넣어요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
/* 오늘 요일 행 강조: schedule.js가 today 클래스를 붙여요 */
.schedule-table tr.today {
  background: var(--highlight);
  font-weight: 700;
}

.schedule-table tr.today th::after {
  content: " (오늘)"; /* 색만으로 구분하지 않도록 글자도 함께 보여요 */
}
```

- `#next-remaining`의 `display: block;`은 남은 시간을 설명 문장 아래 새 줄에 큰 글자로 보이게 해요.
- `tr.today`: 배경은 `var(--highlight)`, 글자는 굵게(Day 14의 변수 덕분에 다크 모드도 따로 정해 둔 색을 쓰게 돼요).
- `tr.today th::after`가 `(오늘)` 글자를 붙이는 의사 요소예요. 아직 `today` 클래스를 붙이는 JavaScript가 없어서 화면은 그대로예요.

:::success
**다음 방송** 상자가 연한 보라 배경과 둥근 모서리의 박스 모양이 됐어요(안은 비어 있어요). 표 모양은 그대로예요.
:::

### 4단계 · schedule.js A: 오늘 요일 행 강조하기 (10분)

**어디서:** VS Code 탐색기 → `js` 폴더 위에서 오른쪽 클릭 → **새 파일** → `schedule.js` (경로 `C:\dev\my-creator-site\js\schedule.js`)

**무엇을:**

1. 열린 빈 `schedule.js`에 아래 코드를 붙여 넣고 `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\js\schedule.js
```js
// ==========================================================
// schedule.js - 방송 일정 페이지
// 1) 오늘 요일 행 강조  2) 다음 방송까지 남은 시간 카운트다운
//
// 이 코드는 컴퓨터 시간이 한국 시간이라고 가정해요. 시간대는 P2에서 제대로 배워요.
// ==========================================================

const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

const nextInfo = document.querySelector('#next-info');
const nextRemaining = document.querySelector('#next-remaining');

let schedule = []; // data/schedule.json 내용이 들어와요

// 숫자를 두 자리 글자로: 5 → '05' (Day 15~18)
function pad(number) {
  return String(number).padStart(2, '0');
}

// ---------- 1. 오늘 요일 강조 (Day 26) ----------
function highlightToday() {
  const today = new Date().getDay(); // 일요일 0 ~ 토요일 6
  const row = document.querySelector(`tr[data-day="${today}"]`);
  if (row) {
    row.classList.add('today'); // style.css의 .today 스타일이 적용돼요
    row.setAttribute('aria-current', 'date');
  }
}

highlightToday();
```

2. `schedule.html`의 `<script src="js/main.js" defer></script>` 줄 **바로 아래**에 한 줄을 붙여 넣고 저장해요.

```html
  <script src="js/schedule.js" defer></script>
```

3. Live Preview에서 `schedule.html`을 새로 고침해요.

코드를 읽어 봐요.

- `dayNames`: 요일 번호(0~6)를 한국어 이름으로 바꾸는 배열이에요. `dayNames[3]`은 `'수요일'`이에요(Day 17의 인덱스).
- `nextInfo`, `nextRemaining`: 2단계에서 만든 칸을 미리 찾아 둬요.
- `let schedule = [];`: 나중에 `schedule.json`의 내용이 들어올 상자예요.
- `pad(number)`: 숫자를 두 자리 글자로 바꾸는 함수예요. 아래에서 여러 번 불러요.
- `highlightToday()`: `new Date().getDay()`로 오늘 요일 번호를 얻고(`today`), 그 번호의 행을 찾아 `classList.add('today')`로 클래스를 붙이고(Day 20), `aria-current="date"`를 달아요. `if (row)`는 "행을 찾았다면"이에요(못 찾으면 `null`).
- 맨 끝 `highlightToday();`: 함수를 실행해요. 6단계에서 이 줄을 `start()` 안으로 옮겨요.

:::success
표에서 오늘 요일 행이 연한 노란 배경과 굵은 글씨로 강조되고, 요일 칸에 `수요일 (오늘)`처럼 `(오늘)`이 붙어요. 화·목·일 같은 휴방일이 오늘이면 그 행이 강조돼요. 상자 안은 아직 비어 있어요. 콘솔에 빨간 오류는 없어요.
:::

### 5단계 · schedule.js B: 다음 방송 시각 찾기 (12분)

방송 하나의 "다음 시작 시각"을 구하는 함수와, 모든 방송 중 가장 가까운 것을 찾는 함수를 만들어요.

**어디서:** VS Code → `C:\dev\my-creator-site\js\schedule.js`

**무엇을:** `highlightToday` 함수가 끝나는 `}` 줄 아래, 맨 끝 `highlightToday();` 줄 **바로 위**에 아래 블록을 붙여 넣어요(블록 끝의 빈 줄 포함). 저장해요.

📄 C:\dev\my-creator-site\js\schedule.js (일부)
```js
// ---------- 2. 다음 방송 찾기 ----------
// 방송 하나가 "다음에 시작하는 시각"을 Date로 구해요
function getNextStartTime(item, now) {
  const parts = item.start.split(':'); // '20:00' → ['20', '00']

  const next = new Date(now); // 지금 시각을 복사해요 (now 자체는 바꾸지 않으려고요)
  next.setHours(Number(parts[0]), Number(parts[1]), 0, 0); // 오늘의 방송 시각 (시, 분, 초, 밀리초)

  const daysLater = (item.day - now.getDay() + 7) % 7; // 며칠 뒤 요일인지 (0 ~ 6)
  next.setDate(next.getDate() + daysLater);

  if (next <= now) {
    // Date끼리는 크기를 비교할 수 있어요. 이미 지났다면 다음 주예요
    next.setDate(next.getDate() + 7);
  }
  return next;
}

// 모든 방송 중에서 가장 가까운 것을 찾아요 (Day 17: 반복문)
function findNextBroadcast(now) {
  let next = null;
  for (const item of schedule) {
    const time = getNextStartTime(item, now);
    if (next === null || time < next.time) {
      next = { item: item, time: time };
    }
  }
  return next;
}
```

`getNextStartTime(item, now)`를 천천히 읽어 봐요. `item`은 일정 하나(`{ day, start, title }`), `now`는 지금이에요.

1. `item.start.split(':')`: `'20:00'` → `['20', '00']`.
2. `new Date(now)`: 지금을 복사해요(`now`를 그대로 두려고요).
3. `next.setHours(Number(parts[0]), Number(parts[1]), 0, 0)`: 복사본을 "오늘의 방송 시각"으로 맞춰요. 날짜는 아직 오늘이에요.
4. `daysLater = (item.day - now.getDay() + 7) % 7`: 오늘로부터 며칠 뒤에 그 요일이 오는지예요. 오늘이 수요일(3)이고 방송이 월요일(1)이면 `(1 - 3 + 7) % 7 = 5`예요. `+ 7`은 뺄셈이 음수(`-2`)가 되는 걸 막아서 `% 7`이 항상 0~6이 되게 해요.
5. `next.setDate(next.getDate() + daysLater)`: 그만큼 날짜를 뒤로 밀어요.
6. `if (next <= now)`: 오늘이 그 요일인데 시각이 이미 지났다면(수요일 22시인데 수요일 21시 방송) `next`는 지난 시각이에요. 그러면 7일을 더해 다음 주로 보내요.

`findNextBroadcast(now)`는 일정을 하나씩 돌며(Day 17의 `for…of`) 가장 이른 시각을 골라요. `let next = null;`로 시작해서 `next === null || time < next.time`이면 갈아 끼우는 "가장 작은 값 찾기" 모양이에요. 결과는 `{ item: item, time: time }` 객체(Day 19)예요.

이 함수들을 콘솔에서 직접 써 봐요.

**어디서:** Edge(또는 Chrome)에서 Live Preview 주소로 연 일정 페이지 → `F12` → **Console**

**무엇을:** 먼저 저장한 `schedule.js`가 반영되도록 일정 페이지 탭을 새로 고침(`F5`, 미리 보기 창이 아니라 Edge 탭에서)해요. 그다음 아래를 한 줄씩 입력하고 `Enter`를 눌러요. 새로 고침을 안 하면 `findNextBroadcast is not defined`가 나와요. 처음 줄은 `schedule` 상자에 월요일 20시 방송 하나를 직접 넣는 줄이에요. 아직 `schedule.json`을 불러오는 코드가 없기 때문이에요.

```js
schedule = [{ day: 1, start: '20:00', title: '테스트' }];
```

```js
findNextBroadcast(new Date()).item.title
```

예상 출력(콘솔에서는 글자가 따옴표로 감싸여 보여요):

```text
'테스트'
```

```js
findNextBroadcast(new Date()).time.getDay()
```

예상 출력:

```text
1
```

:::success
두 번째 줄은 `'테스트'`, 세 번째 줄은 `1`(월요일)이에요. 오늘이 월요일이어도 20시가 지났으면 다음 주 월요일이라서 `1`이에요. 오늘이 월요일이고 20시 전이면 오늘 20시예요. 빨간 오류가 나면 오타를 확인해요. 새로 고침하면 `schedule`은 다시 빈 상자로 돌아가요.
:::

### 6단계 · schedule.js C: 남은 시간 보여 주고 1초마다 갱신하기 (12분)

**어디서:** VS Code → `C:\dev\my-creator-site\js\schedule.js`

**무엇을:** 파일 맨 끝의 `highlightToday();` 줄을 지우고, 그 자리에 아래 블록을 붙여 넣어요. 저장하고 Live Preview에서 `schedule.html`을 새로 고침해요.

📄 C:\dev\my-creator-site\js\schedule.js (일부)
```js
// 남은 시간(밀리초)을 '1일 02:03:04' 모양의 글자로 바꿔요
function formatRemaining(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const clock = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return days > 0 ? `${days}일 ${clock}` : clock;
}

function updateCountdown() {
  const now = new Date();
  const next = findNextBroadcast(now);
  if (next === null) {
    nextInfo.textContent = '예정된 방송이 없어요.';
    return;
  }
  nextInfo.textContent = `${dayNames[next.item.day]} ${next.item.start} · ${next.item.title} · 시작까지`;
  nextRemaining.textContent = formatRemaining(next.time - now); // Date끼리 빼면 밀리초 숫자가 나와요
}

// ---------- 시작: 일정 불러오기 → 카운트다운 시작 (Day 25, 26) ----------
async function start() {
  highlightToday();
  try {
    const response = await fetch('data/schedule.json');
    if (!response.ok) {
      throw new Error(`서버 응답 코드: ${response.status}`);
    }
    schedule = await response.json();
    updateCountdown();
    setInterval(updateCountdown, 1000); // 1초(1000ms)마다 다시 계산해요
  } catch (error) {
    console.error('schedule.json을 불러오지 못했어요:', error);
    nextInfo.textContent = '방송 일정을 불러오지 못했어요. 아래 표를 확인해 주세요.';
  }
}

start();
```

코드를 읽어 봐요.

- `formatRemaining(ms)`: 밀리초를 `1일 02:03:04` 모양의 글자로 바꿔요. `totalSeconds`는 초 단위 전체, `days`, `hours`, `minutes`, `seconds`는 위 개념 설명 그림의 계산이에요. `clock`은 `01:02:03`처럼 두 자리 시:분:초이고, `days > 0 ? … : …`는 하루 이상 남았으면 `"1일 "`을 앞에 붙이고(삼항 연산자, Day 16), 아니면 `clock`만 써요.
- `updateCountdown()`: 지금(`now`)을 구하고, 가장 가까운 방송을 찾고, 설명 문장과 남은 시간 글자를 바꿔요. `next.time - now`는 Date끼리 빼서 밀리초 숫자가 나와요. 방송이 하나도 없으면(`next === null`) 안내 문장만 보여요.
- `async function start()`: `highlightToday()`를 먼저 실행하고, `try` 안에서 `data/schedule.json`을 불러와요(Day 25와 같은 모양). 불러오면 `schedule`에 담고, `updateCountdown()`을 **바로 한 번** 실행한 뒤 `setInterval(updateCountdown, 1000)`으로 1초마다 반복해요. 바로 한 번 실행하는 이유는 첫 1초 동안 칸이 비어 보이지 않게 하려는 거예요. 실패하면 `catch`에서 안내 문장을 보여요.
- 맨 끝 `start();`: 함수를 부르는 줄이에요.

:::success
**다음 방송** 상자에 `수요일 21:00 · 수요일 수다 타임 · 시작까지`(지금 시각에 따라 다른 요일·내용이 나와요)와 아래 줄에 큰 글씨의 `11:00:00` 같은 남은 시간이 보여요. 하루 이상 남았으면 `1일 22:00:00`처럼 앞에 일 수가 붙어요. 숫자가 **1초마다 줄어들어요.** 오늘 요일 행의 강조도 그대로예요.
:::

### 7단계 · 숫자가 맞는지, 더블클릭하면 어떻게 되는지 확인하기 (5분)

**어디서:** Live Preview로 연 일정 페이지, 그다음 파일 탐색기

**무엇을:**

1. 표의 시간과 상자의 "다음 방송" 요일·시각이 맞는지 오늘 요일과 지금 시각으로 눈으로 계산해 봐요. 예를 들어 지금이 월요일 오후 3시라면 상자는 `월요일 20:00 … 시작까지 05:00:00`쯤이어야 해요.
2. 숫자가 몇 시간씩 어긋나 보이면 컴퓨터의 시간대 설정을 확인해요. Windows **설정 → 시간 및 언어 → 날짜 및 시간**에서 시간대가 `(UTC+09:00) 서울`인지 봐요(메뉴 이름은 버전에 따라 조금 다를 수 있어요).
3. 탐색기에서 `schedule.html`을 더블클릭해서 열어 봐요.

:::success
2번이 맞으면 숫자가 실제 남은 시간과 같아요. 3번에서는 표의 오늘 요일 행은 여전히 강조되는데(`fetch` 없이 동작하는 부분이라서요), "다음 방송" 상자에는 `방송 일정을 불러오지 못했어요. 아래 표를 확인해 주세요.`만 보이고 카운트다운이 없어요. 더블클릭으로는 `fetch`가 막히기 때문이에요(Day 25).
:::

### 8단계 · 커밋·푸시 (3분)

**어디서:** VS Code → 소스 제어 패널(`Ctrl + Shift + G`)

**무엇을:** **메시지** 칸에 `Day 26: 방송 일정과 카운트다운`을 입력하고 **커밋** → **변경 내용 동기화**를 눌러요. 명령으로 한다면 VS Code 터미널(PowerShell), 위치 `C:\dev\my-creator-site`에서 아래를 한 줄씩 실행해요.

```powershell
git add .
git commit -m "Day 26: 방송 일정과 카운트다운"
git push
```

`git commit` 예상 출력(해시와 숫자는 달라도 돼요):

```text
[main 7a3b9d5] Day 26: 방송 일정과 카운트다운
 4 files changed, 157 insertions(+), 9 deletions(-)
```

:::success
GitHub 저장소에 `Day 26: 방송 일정과 카운트다운` 커밋이 보이고, 소스 제어 패널의 변경은 0개예요. 10분쯤 뒤 배포 주소의 일정 페이지에도 카운트다운이 보이는지 확인해요. 안 보이면 [도움말 7번](#/page/help)을 순서대로 따라요. `data/schedule.json`의 폴더·파일 이름 대소문자를 먼저 확인해요(Day 25의 404 항목과 같은 원리예요).
:::

## ✍️ 과제

### 과제 1 · 손으로 계산하기 (쉬움 ⭐, 5분)

`formatRemaining(90061000)`은 어떤 글자를 돌려줄까요? 코드를 실행하기 전에 손으로 계산해 보고, 일정 페이지 콘솔에서 `formatRemaining(90061000)`을 입력해 확인해요.

- 확인 방법: 콘솔에 나온 글자와 내 계산이 같아요.
- 힌트: `90061000`밀리초는 몇 초일까요? 하루는 86400초예요.

### 과제 2 · % 7 읽기 (보통 ⭐⭐, 6분)

오늘이 토요일(`6`)이고 방송이 월요일(`1`)일 때 `(1 - 6 + 7) % 7`은 얼마일까요? 이 값은 무엇을 뜻하고, 식에 `+ 7`을 왜 넣었을까요?

- 확인 방법: 콘솔에 `(1 - 6 + 7) % 7`을 입력해 확인해요.
- 힌트: `1 - 6`만 계산하면 음수예요. `% 7`을 하면 음수가 어떻게 될까요? 콘솔에서 `(1 - 6) % 7`도 입력해 보세요.

### 과제 3 · 일요일 방송 추가하기 (도전 ⭐⭐⭐, 7분)

일요일 18:00에 `일요일 노래 방송` 방송을 추가한다면 고칠 곳이 두 군데예요. 어디일까요? 고쳐서 카운트다운과 표가 맞는지 확인하고, 내 일정으로 계속 쓸 게 아니라면 **되돌려요.**

- 확인 방법: 오늘이 일요일 18시 이전이면 "다음 방송"이 일요일 18:00이 되고, 표의 일요일 행에 `18:00`과 방송 이름이 보여요.
- 힌트: 데이터 파일과 HTML 표가 같은 번호(`day`)를 써야 해요. 일요일은 몇 번이었죠?
- 마무리: 연습이었다면 소스 제어 패널에서 **변경 내용 취소**로 되돌려요. 내 일정으로 남기려면 `Day 26: 일요일 방송 추가`로 커밋·푸시해요(안 하면 다음 커밋에 포함돼요).

## ✅ 정답

:::answer 과제 1 정답 · 손으로 계산하기
```text
90061000 ms ÷ 1000 = 90061 초
90061 ÷ 86400 = 1 일 (나머지 3661초)
3661 ÷ 3600 = 1 시간 (나머지 61초)
61 ÷ 60 = 1 분 (나머지 1초)
→ 1일 01:01:01
```

**왜 이렇게 하나요?** `Math.floor(ms / 1000)`이 초(`90061`), `Math.floor(totalSeconds / 86400)`이 일(`1`), `Math.floor((totalSeconds % 86400) / 3600)`이 시간(`1`), `Math.floor((totalSeconds % 3600) / 60)`이 분(`1`), `totalSeconds % 60`이 초(`1`)예요. `pad`가 두 자리로 맞추고 `days > 0`이라 `1일 `이 앞에 붙어서 `1일 01:01:01`이 돼요.
:::

:::answer 과제 2 정답 · % 7 읽기
```js
(1 - 6 + 7) % 7   // 2
(1 - 6) % 7       // -5
```

**왜 이렇게 하나요?** 값은 `2`예요. "토요일에서 2일 뒤가 월요일"이라는 뜻이에요(토 → 일 → 월). `+ 7`이 없으면 `(1 - 6) % 7`은 `-5`가 돼요. JavaScript의 `%`는 음수를 그대로 남겨서 "-5일 뒤"가 되고 날짜가 과거로 가요. `+ 7`을 먼저 해서 항상 양수로 만든 뒤 `% 7`을 하면 결과가 늘 0~6(오늘 ~ 6일 뒤)이 돼요.
:::

:::answer 과제 3 정답 · 일요일 방송 추가하기
📄 C:\dev\my-creator-site\data\schedule.json (일부)
```json
  { "day": 6, "start": "15:00", "title": "시청자 참여 게임" },
  { "day": 0, "start": "18:00", "title": "일요일 노래 방송" }
```

📄 C:\dev\my-creator-site\schedule.html (일부)
```html
        <tr data-day="0"><th scope="row">일요일</th><td>18:00</td><td>일요일 노래 방송</td></tr>
```

**왜 이렇게 하나요?** 데이터(`schedule.json`)에는 일정 한 줄을 더하고, HTML 표에는 일요일 행의 시간과 내용을 고쳐요. 일요일의 번호는 `7`이 아니라 `0`이에요(`getDay()`와 같아요). 표 행의 `data-day="0"`도 이미 `0`이라서 숫자는 그대로 두고 글자만 바꿔요. 데이터 파일과 표는 서로 연결되어 있지 않아서 두 군데를 같이 고쳐야 해요. 이 변경은 연습이라 되돌리거나, 내 일정으로 계속 써도 돼요(글 내용이라서요).
:::

:::answer 오늘 끝 상태 전체 코드
막혔다면 아래 코드로 내 파일을 맞추고 다음 Day를 시작해요. 새 파일 두 개(`schedule.json`, `schedule.js`)와 `schedule.html`은 파일 전체를, `style.css`는 바뀐 블록만 위치와 함께 실었어요.

```text
my-creator-site/
├─ css/
│  └─ style.css ✎
├─ data/
│  ├─ schedule.json ★
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
│  └─ schedule.js ★
├─ about.html
├─ contact.html
├─ contents.html
├─ index.html
└─ schedule.html ✎
```

📄 C:\dev\my-creator-site\data\schedule.json
```json
[
  { "day": 1, "start": "20:00", "title": "신작 게임 같이 해요" },
  { "day": 3, "start": "21:00", "title": "수요일 수다 타임" },
  { "day": 5, "start": "20:00", "title": "신청곡 라이브" },
  { "day": 6, "start": "15:00", "title": "시청자 참여 게임" }
]
```

📄 C:\dev\my-creator-site\js\schedule.js
```js
// ==========================================================
// schedule.js - 방송 일정 페이지
// 1) 오늘 요일 행 강조  2) 다음 방송까지 남은 시간 카운트다운
//
// 이 코드는 컴퓨터 시간이 한국 시간이라고 가정해요. 시간대는 P2에서 제대로 배워요.
// ==========================================================

const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

const nextInfo = document.querySelector('#next-info');
const nextRemaining = document.querySelector('#next-remaining');

let schedule = []; // data/schedule.json 내용이 들어와요

// 숫자를 두 자리 글자로: 5 → '05' (Day 15~18)
function pad(number) {
  return String(number).padStart(2, '0');
}

// ---------- 1. 오늘 요일 강조 (Day 26) ----------
function highlightToday() {
  const today = new Date().getDay(); // 일요일 0 ~ 토요일 6
  const row = document.querySelector(`tr[data-day="${today}"]`);
  if (row) {
    row.classList.add('today'); // style.css의 .today 스타일이 적용돼요
    row.setAttribute('aria-current', 'date');
  }
}

// ---------- 2. 다음 방송 찾기 ----------
// 방송 하나가 "다음에 시작하는 시각"을 Date로 구해요
function getNextStartTime(item, now) {
  const parts = item.start.split(':'); // '20:00' → ['20', '00']

  const next = new Date(now); // 지금 시각을 복사해요 (now 자체는 바꾸지 않으려고요)
  next.setHours(Number(parts[0]), Number(parts[1]), 0, 0); // 오늘의 방송 시각 (시, 분, 초, 밀리초)

  const daysLater = (item.day - now.getDay() + 7) % 7; // 며칠 뒤 요일인지 (0 ~ 6)
  next.setDate(next.getDate() + daysLater);

  if (next <= now) {
    // Date끼리는 크기를 비교할 수 있어요. 이미 지났다면 다음 주예요
    next.setDate(next.getDate() + 7);
  }
  return next;
}

// 모든 방송 중에서 가장 가까운 것을 찾아요 (Day 17: 반복문)
function findNextBroadcast(now) {
  let next = null;
  for (const item of schedule) {
    const time = getNextStartTime(item, now);
    if (next === null || time < next.time) {
      next = { item: item, time: time };
    }
  }
  return next;
}

// 남은 시간(밀리초)을 '1일 02:03:04' 모양의 글자로 바꿔요
function formatRemaining(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const clock = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return days > 0 ? `${days}일 ${clock}` : clock;
}

function updateCountdown() {
  const now = new Date();
  const next = findNextBroadcast(now);
  if (next === null) {
    nextInfo.textContent = '예정된 방송이 없어요.';
    return;
  }
  nextInfo.textContent = `${dayNames[next.item.day]} ${next.item.start} · ${next.item.title} · 시작까지`;
  nextRemaining.textContent = formatRemaining(next.time - now); // Date끼리 빼면 밀리초 숫자가 나와요
}

// ---------- 시작: 일정 불러오기 → 카운트다운 시작 (Day 25, 26) ----------
async function start() {
  highlightToday();
  try {
    const response = await fetch('data/schedule.json');
    if (!response.ok) {
      throw new Error(`서버 응답 코드: ${response.status}`);
    }
    schedule = await response.json();
    updateCountdown();
    setInterval(updateCountdown, 1000); // 1초(1000ms)마다 다시 계산해요
  } catch (error) {
    console.error('schedule.json을 불러오지 못했어요:', error);
    nextInfo.textContent = '방송 일정을 불러오지 못했어요. 아래 표를 확인해 주세요.';
  }
}

start();
```

📄 C:\dev\my-creator-site\schedule.html
```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>방송 일정 - 달빛곰 방송국</title>
  <link rel="stylesheet" href="css/style.css">
  <script src="js/main.js" defer></script>
  <script src="js/schedule.js" defer></script>
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a class="logo" href="index.html">
        <img src="images/logo.svg" alt="" width="36" height="36">
        <span>달빛곰 방송국</span>
      </a>

      <!-- 모바일에서만 보이는 메뉴 버튼. main.js가 aria-expanded 값을 바꿔요 -->
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">☰ 메뉴</button>

      <nav id="site-nav" class="site-nav" aria-label="주 메뉴">
        <ul class="menu-list">
          <li><a href="index.html">홈</a></li>
          <li><a href="about.html">소개</a></li>
          <li><a href="contents.html">영상</a></li>
          <li><a href="schedule.html" aria-current="page">방송 일정</a></li>
          <li><a href="contact.html">문의</a></li>
          <li><button class="theme-toggle" type="button" aria-pressed="false">🌙 다크 모드</button></li>
        </ul>
      </nav>
    </div>
  </header>

  <main class="container">
    <h1>방송 일정</h1>
    <p>모든 시간은 한국 시간이에요. 오늘 요일은 표에서 색으로 표시돼요.</p>

    <section class="next-box" aria-labelledby="next-heading">
      <h2 id="next-heading">다음 방송</h2>
      <!-- role="timer": 1초마다 바뀌어도 스크린 리더가 계속 읽지 않아요 -->
      <p id="next-broadcast" role="timer"><span id="next-info"></span> <strong id="next-remaining"></strong></p>
    </section>

    <table id="schedule-table" class="schedule-table">
      <caption>주간 방송 일정</caption>
      <thead>
        <tr>
          <th scope="col">요일</th>
          <th scope="col">시작 시간</th>
          <th scope="col">방송 내용</th>
        </tr>
      </thead>
      <tbody>
        <!-- data-day는 JavaScript의 getDay()와 같은 숫자예요 (일요일 0 ~ 토요일 6) -->
        <tr data-day="1"><th scope="row">월요일</th><td>20:00</td><td>신작 게임 같이 해요</td></tr>
        <tr data-day="2"><th scope="row">화요일</th><td>-</td><td>휴방</td></tr>
        <tr data-day="3"><th scope="row">수요일</th><td>21:00</td><td>수요일 수다 타임</td></tr>
        <tr data-day="4"><th scope="row">목요일</th><td>-</td><td>휴방</td></tr>
        <tr data-day="5"><th scope="row">금요일</th><td>20:00</td><td>신청곡 라이브</td></tr>
        <tr data-day="6"><th scope="row">토요일</th><td>15:00</td><td>시청자 참여 게임</td></tr>
        <tr data-day="0"><th scope="row">일요일</th><td>-</td><td>휴방</td></tr>
      </tbody>
    </table>
  </main>

  <footer class="site-footer">
    <div class="container">
      <p>&copy; 2026 달빛곰 방송국 · 연습용으로 만든 사이트예요.</p>
    </div>
  </footer>
</body>
</html>
```

`C:\dev\my-creator-site\css\style.css`에는 네 블록을 넣어요.

1. `:root { … }`의 `--success: #1b6e3c;` 줄 바로 아래에 넣어요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
  --highlight: #fff3c4;    /* 오늘 요일 강조 */
```

2. `:root[data-theme="dark"] { … }`의 `--success: #6fd49a;` 줄 바로 아래에 넣어요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
  --highlight: #4a3f12;
```

3. `/* 방송 일정 */` 주석 아래의 `.schedule-table {` 규칙 바로 위에 넣어요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
.next-box {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1rem;
  margin: 1.5rem 0;
}

.next-box h2 {
  margin-top: 0;
}

.next-box p {
  margin: 0;
}

#next-remaining {
  display: block;
  font-size: 1.75rem;
  font-variant-numeric: tabular-nums; /* 숫자 폭을 같게 해서 흔들리지 않아요 */
}
```

4. `.schedule-table thead th { … }` 규칙 바로 아래에 넣어요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
/* 오늘 요일 행 강조: schedule.js가 today 클래스를 붙여요 */
.schedule-table tr.today {
  background: var(--highlight);
  font-weight: 700;
}

.schedule-table tr.today th::after {
  content: " (오늘)"; /* 색만으로 구분하지 않도록 글자도 함께 보여요 */
}
```
:::

## 🧯 자주 막히는 곳

여기에 없는 증상은 [문제 해결 모음](#/page/troubleshooting)에서 찾아보세요.

### 숫자가 줄어들지 않고 멈춰 있어요

**원인:** `setInterval(updateCountdown(), 1000)`처럼 함수 이름 뒤에 괄호를 붙였어요. 그러면 `updateCountdown`이 지금 **한 번** 실행되고, 그 결과(`undefined`)가 `setInterval`에 넘어가서 1초마다 반복할 게 없어요. 에러는 나지 않아서 눈치채기 어려워요.

**해결:** `schedule.js`의 `start` 함수에서 `setInterval(updateCountdown, 1000);`으로 괄호 없이 써요. 저장하고 새로 고침해서 숫자가 1초마다 바뀌는지 봐요.

### 남은 시간이 몇 시간씩 어긋나요

**원인:** 이 코드는 컴퓨터 시계가 한국 시간이라고 가정해요. 컴퓨터의 시간대가 다르게 설정되어 있으면 계산이 그만큼 어긋나요.

**해결:** Windows **설정 → 시간 및 언어 → 날짜 및 시간**에서 시간대가 `(UTC+09:00) 서울`인지 확인하고, **시간 자동 설정**을 켜요(메뉴 이름은 버전에 따라 조금 다를 수 있어요). 시간대를 코드에서 다루는 방법은 P2 Day 29에서 배워요.

### 오늘 요일이 하루 밀려서 강조돼요

**원인:** 표의 `data-day`나 `schedule.json`의 `day`에서 일요일을 `7`로 썼을 가능성이 커요. `getDay()`의 일요일은 `0`이에요.

**해결:** 일요일 행을 `<tr data-day="0">`으로, 데이터의 일요일은 `"day": 0`으로 고쳐요. 월~토는 `1`~`6`이에요.

### 강조 행이 안 보여요

**원인:** CSS 선택자를 `.schedule-table tr .today`처럼 빈칸을 넣어 썼거나(그러면 `tr` 안쪽의 `.today`를 찾아요), `--highlight` 변수 정의가 빠졌어요.

**해결:** `style.css`에서 `.schedule-table tr.today`가 `tr`과 `.today` 사이에 빈칸 없이 붙어 있는지, `:root`에 `--highlight`가 있는지 확인해요. 개발자 도구 **Elements**에서 오늘 행에 `class="today"`가 붙었는지도 봐요.

### NaN:NaN:NaN 이 나와요

**원인:** `schedule.json`의 `start`가 `"20시"`처럼 `HH:MM` 모양이 아니에요. `Number('20시')`는 `NaN`(숫자가 아님, Day 15)이라서 모든 계산이 `NaN`이 돼요.

**해결:** `start`를 `"20:00"`처럼 숫자와 콜론으로만 써요.

### 더블클릭으로 열면 카운트다운이 없어요

**원인:** 정상이에요. `fetch`는 `file://`에서 막혀요. 표의 오늘 강조는 되지만 "다음 방송"에는 안내 문장만 나와요.

**해결:** Live Preview나 배포 주소로 열어요.

## 📝 오늘의 체크리스트

- [ ] 일정 페이지에서 오늘 요일 행이 노란 배경과 `(오늘)`로 강조돼요
- [ ] "다음 방송" 상자에 방송 요일·시각·제목과 남은 시간이 나와요
- [ ] 남은 시간 숫자가 1초마다 줄어들어요
- [ ] 다크 모드에서 강조 행이 어두운 노랑으로 보여요
- [ ] 더블클릭으로 열면 안내 문장만 나오는 이유를 설명할 수 있어요
- [ ] `getDay()`의 일요일이 `0`이라는 것과 `data-day`가 같은 번호인 이유를 말할 수 있어요
- [ ] `setInterval(함수, 1000)`에 괄호를 붙이면 안 되는 이유를 말할 수 있어요
- [ ] 과제 1~3을 하고 정답과 비교했어요
- [ ] GitHub에 `Day 26` 커밋이 보여요

## 📚 더 알아보기

- [MDN — Date](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Date): `getDay`, `setHours`, `setDate` 등 날짜 메서드를 정리한 문서예요.
- [MDN — setInterval()](https://developer.mozilla.org/ko/docs/Web/API/Window/setInterval): 정해진 시간마다 함수를 되풀이하는 방법과 멈추는 방법이에요.
- [MDN — ::after 의사 요소](https://developer.mozilla.org/ko/docs/Web/CSS/Reference/Selectors/::after): `content`로 글자를 붙이는 의사 요소를 설명해요.

➡️ **다음 Day 예고:** [Day 27 · OBS 오버레이 위젯](#/day/p1-d27)에서는 방송 화면 위에 올릴 카운트다운 페이지를 `overlay` 폴더에 따로 만들고, 주소 끝의 `?title=…&start=20:00` 값으로 제목과 시각을 바꿔요.
