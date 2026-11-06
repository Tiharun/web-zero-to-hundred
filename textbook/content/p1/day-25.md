## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- 영상 데이터를 `contents.js` 안의 배열에서 `data\videos.json` 파일로 옮기고, `fetch`로 불러와서 카드 6장을 그려요.
- 파일을 불러오는 동안 "불러오는 중이에요…"가 보이고, 실패하면 빨간 테두리의 오류 상자가 나와요.
- `async`/`await`와 `try…catch`가 무엇을 하는지 한 줄씩 읽고 설명할 수 있어요.
- 개발자 도구 **Network** 패널에서 `videos.json`을 찾아 `200`(성공)과 `404`(없음)를 구별할 수 있어요.

**예상 시간: 120분** (개념 이해 25분 · 따라하기 64분 · 과제 25분 · 정리 6분)

:::path 📂 시작 상태
어제(Day 24)까지 만든 파일이 이렇게 있어야 해요. 없거나 다르면 [Day 24](#/day/p1-d24)의 "오늘 끝 상태 전체 코드"로 맞춰 주세요.

- `C:\dev\my-creator-site\about.html`
- `C:\dev\my-creator-site\contact.html`
- `C:\dev\my-creator-site\contents.html`
- `C:\dev\my-creator-site\index.html`
- `C:\dev\my-creator-site\schedule.html`
- `C:\dev\my-creator-site\css\style.css`
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

### JSON: 데이터만 담은 글자 파일

지금은 영상 6개의 정보가 `contents.js` 안 `allVideos` 배열에 들어 있어요. 영상을 하나 추가하려면 코드 파일을 열어 고쳐야 하죠. 진짜 서비스는 데이터와 코드를 **다른 파일**로 나눠요. 코드를 건드리지 않고 데이터만 바꾸고 싶기 때문이에요.

**비유:** 요리 레시피(코드)와 장보기 목록(데이터)을 한 종이에 쓰지 않고 따로 두는 것과 같아요. 목록만 바꾸면 같은 레시피로 다른 요리를 만들 수 있어요.

**정확한 정의:** **[[JSON]]**(제이슨, JavaScript Object Notation)은 데이터를 글자로 주고받기 위한 형식이에요. 모양은 JavaScript의 배열·객체(Day 19)와 비슷하지만 규칙이 더 엄격해요.

| | JavaScript 객체 | JSON |
|---|---|---|
| 키(이름) | `title:` (따옴표 없어도 돼요) | `"title":` (큰따옴표 필수) |
| 글자 값 | `'기타'` 또는 `"기타"` | `"기타"` (큰따옴표만) |
| 마지막 쉼표 | 있어도 돼요 | **없어야 해요** |
| 주석 | `// 설명` 가능 | **쓸 수 없어요** |

JSON 파일의 확장자는 `.json`이에요. 규칙을 하나라도 어기면 브라우저가 파일 전체를 읽지 못해요. VS Code는 `.json` 파일에서 규칙에 어긋나는 곳에 빨간 물결 밑줄을 그려 줘요.

### 비동기: 기다리는 동안 멈추지 않아요

파일 하나를 받아 오는 데는 시간이 걸려요(인터넷이면 더 오래 걸려요). 그동안 페이지가 멈춰 있으면 버튼도 안 눌리겠죠.

**비유:** 진동 벨을 받는 식당이에요. 주문하고 서서 기다리는 대신 자리에 앉아 다른 일을 하다가, 벨이 울리면 음식을 받으러 가요.

**정확한 정의:** **[[비동기]]**(asynchronous)는 시간이 걸리는 일을 시켜 놓고 끝날 때까지 멈춰 있지 않고, 결과가 오면 이어서 처리하는 방식이에요. 파일을 받아 오는 동안에도 버튼과 검색창이 계속 반응하는 것이 비동기 덕분이에요.

### fetch, async, await: 위에서 아래로 읽히는 비동기

**[[fetch]]**(페치)는 JavaScript로 파일이나 데이터를 요청해 받아 오는 브라우저 기능이에요. `fetch('data/videos.json')`처럼 주소를 넘겨요. `fetch`는 바로 결과를 주지 않고 "나중에 결과를 줄게요"라는 약속(Promise라고 불러요)을 먼저 돌려줘요. Promise가 정확히 무엇인지는 P2 Day 8에서 배워요. 오늘은 "기다려야 하는 값"이라고만 알아 두면 돼요.

기다리는 값은 **[[await]]**(어웨이트)로 받아요. `await`는 "결과가 올 때까지 기다렸다가 다음 줄로 가요"라는 뜻이에요. 그런데 `await`는 **`async`가 붙은 함수 안에서만** 쓸 수 있어요. **[[async 함수]]**(async function)는 `async function loadVideos() { … }`처럼 앞에 `async`를 붙인 함수예요. 이 함수는 기다리는 동안 다른 코드가 먼저 실행되게 비켜 줘요.

```js
async function loadVideos() {
  const response = await fetch('data/videos.json'); // 파일이 올 때까지 기다려요
  const data = await response.json();               // 글자(JSON)를 배열로 바꿀 때까지 기다려요
  console.log(data);
}
```

- `response`는 서버(지금은 Live Preview)가 보낸 응답이에요. `response.ok`는 성공했는지(`true`/`false`), `response.status`는 응답 번호예요. `200`은 성공, `404`는 "그런 파일이 없어요"예요. 이 번호는 P2에서 자세히 배워요.
- `response.json()`: 응답에 담긴 JSON 글자를 JavaScript 배열로 바꿔요. 이것도 시간이 걸려서 `await`가 필요해요.

### try…catch: 실패해도 사이트가 멈추지 않게

`fetch`는 실패할 수 있어요. 파일 이름이 틀렸거나, 인터넷이 끊겼거나, JSON에 쉼표가 하나 더 있거나. 아무 대비가 없으면 JavaScript가 거기서 멈추고 화면에는 아무 설명도 없어요.

**비유:** 놀이공원 안전망이에요. 높은 곳에서 문제가 생겨도 바닥으로 추락하지 않고 안전망(`catch`)에 걸려요. 거기서 "점검 중입니다"라고 안내하죠.

**정확한 정의:** **[[try...catch]]**(트라이 캐치)는 오류가 날 수 있는 코드를 `try { … }`에 넣고, 오류가 나면 `catch (error) { … }`에서 대신 처리하는 문법이에요. 사이트 전체가 멈추지 않고 "불러오지 못했어요" 같은 안내를 보여 줄 수 있어요.

```js
try {
  // 오류가 날 수 있는 코드
  throw new Error('일부러 오류');
} catch (error) {
  // 오류가 나면 여기로 와요
  console.error('잡았어요:', error);
}
```

`throw new Error('문장')`은 일부러 오류를 던져서 `catch`로 보내는 문법이에요. 서버가 `404`로 답한 것은 JavaScript 입장에서는 "오류"가 아니라서(`fetch`가 정상적으로 답을 받은 것), 직접 `response.ok`를 보고 `throw`로 오류로 바꿔서 `catch`가 처리하게 해요. `console.error`는 콘솔에 빨간 오류 줄을 남기는 `console.log`의 형제예요.

### file://로 연 페이지는 fetch가 막혀요

`fetch`는 브라우저 보안 때문에 파일을 더블클릭해서 연 페이지(`file://`)에서는 다른 파일을 못 읽어요. 아무 사이트의 JavaScript가 내 컴퓨터의 파일을 몰래 읽으면 안 되기 때문이에요. 그래서 `fetch`를 쓰는 페이지(`contents.html`, 내일부터 `schedule.html`)는 반드시 `http://`나 `https://` 주소로 열어야 해요.

- VS Code **Live Preview**: `http://127.0.0.1:3000/…`(숫자는 달라도 돼요). Day 2에서 설치했어요.
- 배포 주소: `https://<내 아이디>.github.io/my-creator-site/`

더블클릭으로 열면 오류 상자가 보이는 것이 **정상**이에요. 오늘 일부러 그 화면도 확인해요.

### 다 불러오기 전에는 그리지 않기: isLoaded

파일을 받아 오는 동안에도 사용자는 버튼을 누르거나 검색어를 칠 수 있어요. 그때 `render()`가 빈 `allVideos`로 그리면 "영상 0개"와 빈 목록 안내가 번쩍해요. 그래서 `isLoaded`라는 변수(처음엔 `false`)를 두고, `render()` 맨 앞에서 "아직이면 그리지 않아요"라고 돌려보내요. 그 사이에 누른 버튼과 검색어는 `selectedCategory`와 `searchText`에 기억되어 있다가, 다 불러온 뒤 그려질 때 적용돼요.

## 🛠️ 따라하기

모두 9단계예요. 먼저 Live Preview로 사이트를 열어 둬요.

**어디서:** VS Code 왼쪽 탐색기 → `contents.html` 위에서 오른쪽 클릭 → **미리 보기 표시**(영어: **Show Preview**)

Live Preview 미리 보기 창에서 영상 페이지가 열리고, 창 위쪽 주소 칸에 `http://127.0.0.1:3000/contents.html` 같은 주소가 보여요(숫자는 달라도 돼요). 이 주소를 복사해 두면 Edge(또는 Chrome) 주소창에 붙여서 개발자 도구와 함께 쓸 수 있어요. 앞으로 개발자 도구가 필요한 단계는 모두 이 방법으로 해요(VS Code 미리 보기 창에서는 `F12`가 개발자 도구를 열지 않아요). 메뉴 이름은 버전에 따라 조금 다를 수 있어요.

### 1단계 · data 폴더와 videos.json 만들기 (8분)

**어디서:** VS Code 왼쪽 탐색기(`Ctrl + Shift + E`) → `my-creator-site` 폴더

**무엇을:**

1. 탐색기의 빈 곳(또는 `my-creator-site` 폴더 이름)에서 오른쪽 클릭 → **새 폴더**를 눌러 `data`를 입력하고 `Enter`를 눌러요.
2. `data` 폴더 위에서 오른쪽 클릭 → **새 파일**을 눌러 `videos.json`을 입력하고 `Enter`를 눌러요. 경로가 `C:\dev\my-creator-site\data\videos.json`이에요.
3. 열린 빈 파일에 아래 내용을 붙여 넣고 `Ctrl + S`로 저장해요. 영상 ID(`youtubeId`)는 **예시**예요. 나중에 내 YouTube 영상 주소 `watch?v=` 뒤의 11글자로 바꿔도 돼요.

📄 C:\dev\my-creator-site\data\videos.json
```json
[
  { "id": "v001", "title": "기타로 연주하는 신청곡", "category": "music", "youtubeId": "aqz-KE-bpKQ", "date": "2026-10-27" },
  { "id": "v002", "title": "신작 공포 게임 첫 도전", "category": "game", "youtubeId": "eRsGyueVLvQ", "date": "2026-10-25" },
  { "id": "v003", "title": "구독자 1000명 기념 Q&A", "category": "talk", "youtubeId": "R6MlUcmOul8", "date": "2026-10-20" },
  { "id": "v004", "title": "친구들과 협동 퍼즐 도전", "category": "game", "youtubeId": "Y-rmzh0PI3c", "date": "2026-10-18" },
  { "id": "v005", "title": "비 오는 날 플레이리스트", "category": "music", "youtubeId": "TLkA0RELQ1g", "date": "2026-10-11" },
  { "id": "v006", "title": "요즘 빠진 취미 이야기", "category": "talk", "youtubeId": "WhWc3b3KhnY", "date": "2026-10-06" }
]
```

JSON의 규칙을 눈으로 확인해요. 키는 모두 `"id"`, `"title"`처럼 큰따옴표, 글자 값도 큰따옴표예요. 맨 바깥은 배열 `[ ]`이고 영상 하나가 객체 `{ }`예요. 객체 사이에는 쉼표가 있고, **마지막 객체 뒤에는 쉼표가 없어요.** 모양은 Day 19의 배열과 같아요.

:::success
탐색기에 `data` 폴더와 그 안의 `videos.json`이 생겼어요. 파일 안에 빨간 물결 밑줄이 하나도 없어요. 파일 이름 `videos.json`에 `.txt`가 붙지 않았는지 탐색기에서 확인해요(VS Code 탭 제목이 `videos.json`이면 맞아요).
:::

### 2단계 · contents.html에 "불러오는 중"과 오류 상자 넣기 (6분)

**어디서:** VS Code → `C:\dev\my-creator-site\contents.html`

**무엇을:**

1. `<p id="result-count" class="result-count" aria-live="polite"></p>` 줄 **바로 아래**에 두 줄을 붙여 넣어요.

📄 C:\dev\my-creator-site\contents.html (일부)
```html
    <p id="load-status">영상 목록을 불러오는 중이에요…</p>
    <p id="load-error" class="error-box" role="alert" hidden></p>
```

- `#load-status`: 불러오는 동안 보이는 문장이에요.
- `#load-error`: 불러오기에 실패했을 때 보이는 오류 상자예요. `hidden`이라 평소에는 숨어 있어요. `role="alert"`는 `role="status"`보다 급한 알림이라서 스크린 리더가 바로 읽어 줘요.

2. 같은 파일에서 `<!-- 카드는 contents.js가 영상 데이터를 읽어서 여기에 그려 줘요 -->` 주석을 아래 주석으로 바꿔요.

```html
<!-- 카드는 contents.js가 data/videos.json을 읽어서 여기에 그려 줘요 -->
```

3. `C:\dev\my-creator-site\css\style.css`를 열어 6번 구역의 `.result-count { … }` 규칙이 끝나는 `}` 줄 **바로 아래**(빈 줄 하나 뒤)에 오류 상자 모양을 붙여 넣어요. `/* 방송 일정 */` 주석 바로 위에 해당해요. 저장해요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
.error-box {
  padding: 0.75rem 1rem;
  border: 2px solid var(--error);
  border-radius: 8px;
  color: var(--error);
}
```

:::success
영상 페이지를 새로 고침하면 `영상 6개` 아래에 `영상 목록을 불러오는 중이에요…`가 새로 보여요. 카드 6장은 아직 코드 속 배열에서 그려져서 그대로 보여요. 오류 상자는 숨어 있어서 보이지 않아요.
:::

### 3단계 · contents.js: 데이터를 비우고 상태 준비하기 (10분)

이제 코드 속 영상 배열을 비우고(데이터는 JSON으로 갔어요), 다 불러왔는지 기억하는 변수를 둬요.

**어디서:** VS Code → `C:\dev\my-creator-site\js\contents.js`

**무엇을:** 네 곳을 고쳐요.

**(1)** 파일 맨 위 머리 주석의 두 번째 줄(`// 영상 데이터를 카드로 그리고, …`)을 아래 두 줄로 바꿔요.

```js
// data/videos.json을 불러와서(fetch) 카드로 그리고,
// 카테고리 버튼과 검색창으로 걸러서 보여 줘요.
```

**(2)** `const emptyMessage = document.querySelector('#empty-message');` 줄 **바로 아래**에 두 줄을 붙여 넣어요.

📄 C:\dev\my-creator-site\js\contents.js (일부)
```js
const loadStatus = document.querySelector('#load-status');
const loadError = document.querySelector('#load-error');
```

**(3)** `// 지금 상태: …` 주석 줄부터 `let searchText = '';` 줄까지(영상 6개가 든 `let allVideos = [ … ];` 배열을 포함해서)를 선택하고, 아래 블록으로 바꿔요. 영상 데이터가 사라지고 `isLoaded`가 새로 생겨요.

📄 C:\dev\my-creator-site\js\contents.js (일부)
```js
// 지금 상태: 전체 영상, 불러왔는지 여부, 선택한 카테고리, 검색어
let allVideos = [];
let isLoaded = false;
let selectedCategory = 'all';
let searchText = '';
```

**(4)** `function render() {` 줄 **바로 아래**(함수 안 맨 앞)에 아래 블록을 붙여 넣어요. 아직 불러오지 못했으면 그리지 않고 돌아가요.

📄 C:\dev\my-creator-site\js\contents.js (일부)
```js
  // 아직 영상을 다 불러오지 못했다면 그리지 않아요. ("불러오는 중이에요" 문구가 계속 보여요)
  // 그 사이에 누른 버튼과 검색어는 변수에 기억해 두었다가, 불러온 뒤에 적용돼요.
  if (!isLoaded) {
    return;
  }
```

저장하고 영상 페이지를 새로 고침해요.

:::success
카드가 하나도 없고 `영상 목록을 불러오는 중이에요…`가 계속 보여요. 아직 데이터를 불러오는 코드가 없고 `render()`가 아무것도 그리지 않기 때문이에요. 콘솔(Console)에 빨간 오류는 없어요. 4단계에서 이 상태를 고쳐요.
:::

### 4단계 · contents.js: fetch로 불러와서 그리기 (14분)

**어디서:** VS Code → `C:\dev\my-creator-site\js\contents.js`

**무엇을:** 파일 맨 끝의 `render();` 줄을 지우고, 그 자리에 아래 블록을 붙여 넣어요. 저장하고 Live Preview 미리 보기 창(또는 Edge에서 연 Live Preview 주소)을 새로 고침해요.

📄 C:\dev\my-creator-site\js\contents.js (일부)
```js
// data/videos.json 불러오기 (Day 25: async/await, 오류 처리)
async function loadVideos() {
  try {
    const response = await fetch('data/videos.json');
    if (!response.ok) {
      throw new Error(`서버 응답 코드: ${response.status}`); // 404 같은 오류도 실패로 다뤄요
    }
    allVideos = await response.json(); // JSON 글자를 배열로 바꿔요
    isLoaded = true;
    loadStatus.hidden = true;
    render();
  } catch (error) {
    // file://로 열었거나 파일 경로가 틀리면 여기로 와요
    console.error('videos.json을 불러오지 못했어요:', error);
    loadStatus.hidden = true;
    loadError.hidden = false;
    loadError.textContent =
      '영상 목록을 불러오지 못했어요. 파일을 더블클릭해서 열었다면 VS Code의 Live Preview나 GitHub Pages 주소로 열어 보세요.';
  }
}

loadVideos();
```

마지막 줄 `loadVideos();`는 함수를 **부르는** 줄이에요. 함수를 만들기만 하면 실행되지 않아요.

위에서 아래로 읽어 봐요.

- `async function loadVideos() {`: `await`를 쓰기 위한 `async` 함수예요.
- `try {`: 오류가 날 수 있는 구간의 시작이에요.
- `const response = await fetch('data/videos.json');`: 현재 페이지(`contents.html`) 기준 상대 경로예요(Day 4). 파일이 올 때까지 기다려요.
- `if (!response.ok) { throw new Error(…); }`: 응답이 실패(404 등)면 일부러 오류를 던져 `catch`로 보내요. `!`는 "아니라면"이에요. 템플릿 리터럴로 응답 번호를 문장에 넣어요.
- `allVideos = await response.json();`: JSON 글자를 배열로 바꿔 `allVideos`에 담아요.
- `isLoaded = true;`, `loadStatus.hidden = true;`: 다 불러왔다고 기억하고 "불러오는 중" 문장을 숨겨요(Day 23의 `hidden`).
- `render();`: 이제 `isLoaded`가 `true`라서 카드를 그려요.
- `} catch (error) {`: 어딘가에서 오류가 나면 여기로 와요. `console.error`로 콘솔에 원인을 남기고, "불러오는 중" 문장을 숨기고, 오류 상자를 보이게(`loadError.hidden = false`) 한 뒤 안내 문장을 넣어요.

:::success
영상 페이지에 카드 6장이 다시 보이고 `영상 6개`예요. "불러오는 중" 문장은 사라졌어요. 이제 카드는 `videos.json`에서 왔어요. **게임** 버튼과 검색창, 다크 모드도 그대로 동작해요. 안 보인다면 아래 🧯의 첫 두 항목을 보세요.
:::

### 5단계 · Network 패널에서 videos.json 찾기 (7분)

브라우저가 실제로 파일을 받아 오는 장면을 눈으로 봐요.

**어디서:** Edge(또는 Chrome)에서 Live Preview 주소(`http://127.0.0.1:3000/contents.html`, 숫자는 달라도 돼요)로 연 영상 페이지 → `F12` → 개발자 도구 위쪽 탭 줄의 **Network**(네트워크)

**무엇을:**

1. **Network** 탭을 연 채로 `F5`를 눌러 새로 고침해요. (탭이 안 보이면 `»`를 눌러 찾아요.)
2. 목록에서 **Name**(이름) 열이 `videos.json`인 줄을 찾아요.
3. 그 줄의 **Status**(상태) 열의 숫자와 **Type**(유형) 열의 글자를 봐요.
4. `videos.json` 줄을 클릭하고 오른쪽 **Response**(응답) 탭을 눌러 내용을 봐요. 이름이 **Preview**로 보이는 탭에서는 정리된 모양으로 볼 수 있어요.

:::success
`videos.json`의 Status가 `200`이고 Type이 `fetch`예요. Response 탭에 아까 만든 JSON 글자가 그대로 보여요. 목록에 `contents.html`, `style.css`, `contents.js`, `thumb-game.svg` 같은 파일도 줄지어 있어요. 페이지 하나를 여는 데 파일이 이렇게 여러 번 받아져요.
:::

### 6단계 · 더블클릭으로 열어서 오류 상자 보기 (5분)

일부러 실패시켜서, 실패했을 때 사용자가 무엇을 보는지 확인해요.

**어디서:** 파일 탐색기 → `C:\dev\my-creator-site\contents.html` 더블클릭 (브라우저로 열려요) → `F12` → **Console**(콘솔)

**무엇을:** 열린 페이지와 콘솔을 확인해요.

:::success
영상 목록 자리에 빨간 테두리 상자 `영상 목록을 불러오지 못했어요. 파일을 더블클릭해서 열었다면 VS Code의 Live Preview나 GitHub Pages 주소로 열어 보세요.`가 보여요. 콘솔에는 빨간 오류가 두 줄 나와요. 첫 줄은 브라우저가 내는 글이고 둘째 줄은 우리가 `console.error`로 남긴 글이에요(Edge·Chrome 버전에 따라 첫 줄의 문구와 경로는 다를 수 있어요).
:::

```text
Fetch API cannot load file:///C:/dev/my-creator-site/data/videos.json. URL scheme "file" is not supported.
videos.json을 불러오지 못했어요: TypeError: Failed to fetch
```

첫 줄은 "`file` 주소 방식으로는 `fetch`를 못 써요"라는 뜻이에요. 보안상 막혀 있는 것이라서 코드 잘못이 아니에요. 둘째 줄이 `catch`에서 남긴 글이고 `TypeError: Failed to fetch`는 "요청 자체가 실패했어요"라는 뜻이에요. 이렇게 오류 상자가 보이는 것이 정상 동작이에요. 해결은 Live Preview나 배포 주소로 여는 것뿐이에요.

### 7단계 · JSON에 일부러 쉼표를 하나 더 넣어 보기 (4분)

**어디서:** VS Code → `C:\dev\my-creator-site\data\videos.json`

**무엇을:**

1. 맨 마지막 영상 줄(`"id": "v006"`이 있는 줄)의 끝 `}` 뒤에 쉼표를 하나 붙여요. `… "date": "2026-10-06" },`처럼요.
2. 저장하고 Live Preview 주소로 영상 페이지를 새로 고침해요.
3. 콘솔(Console)의 오류 문장을 읽어 봐요.
4. **쉼표를 지워서 원래대로 되돌리고** 저장해요.

:::success
쉼표를 붙인 동안은 카드가 하나도 안 보이고 오류 상자가 나와요. 콘솔에는 이런 문장이 나와요(문구는 브라우저 버전에 따라 조금 달라요). 되돌리고 새로 고침하면 카드 6장이 돌아와요.
:::

```text
videos.json을 불러오지 못했어요: SyntaxError: Unexpected token ']', ..."10-06" },
]
" is not valid JSON
```

"JSON이 아닌 글자(`]`)가 예상 밖에 나왔어요"라는 뜻이에요. 쉼표 뒤에 다음 영상이 와야 하는데 `]`가 먼저 나와서예요. JSON 오류는 이렇게 **파일 전체를 못 읽게** 만들어요. 그래서 JSON을 고칠 때는 VS Code의 빨간 물결 밑줄을 먼저 봐요.

### 8단계 · main.js: 저장소를 못 써도 멈추지 않게 감싸기 (7분)

Day 22에서 예고한 약속을 지켜요. `localStorage`를 쓸 수 없게 막은 브라우저에서는 `getItem`/`setItem`을 부르는 순간 오류가 나서, `main.js` 전체가 멈추고 메뉴·인사말까지 동작하지 않을 수 있어요.

**어디서:** VS Code → `C:\dev\my-creator-site\js\main.js`

**무엇을:** `// 저장된 테마를 꺼내요.` 주석 줄부터 `saveTheme` 함수가 끝나는 `}` 줄까지(함수 두 개)를 선택해서 아래 블록으로 바꾸고 저장해요. 그 아래의 `// 테마를 화면에 적용해요` 주석부터는 그대로예요.

📄 C:\dev\my-creator-site\js\main.js (일부)
```js
// 저장된 테마를 꺼내요.
// (try/catch는 Day 25에서 자세히 배워요) 브라우저 설정 때문에 저장소를 못 쓰면 오류가 나서, 사이트가 멈추지 않게 감싸 둬요.
function getSavedTheme() {
  try {
    return localStorage.getItem('theme'); // 'light' 또는 'dark', 없으면 null
  } catch (error) {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem('theme', theme);
  } catch (error) {
    // 저장하지 못해도 사이트는 계속 동작해요
  }
}
```

- `try { … } catch (error) { … }`: `try` 안에서 오류가 나면 `catch` 안으로 와요.
- `getSavedTheme`의 `catch`는 `return null;`로 "저장된 게 없어요"처럼 돌려줘요. 그러면 코드는 컴퓨터의 다크 모드 설정을 따라가요.
- `saveTheme`의 `catch`에는 코드가 없고 주석만 있어요. 저장에 실패해도 조용히 넘어가요. 테마는 이번 방문 동안은 계속 바뀌어요.

저장을 못 쓰는 환경에서 나는 오류 문장의 예는 이래요(막은 이유에 따라 끝부분이 달라요).

```text
Uncaught SecurityError: Failed to read the 'localStorage' property from 'Window': The document is sandboxed and lacks the 'allow-same-origin' flag.
```

:::success
평소에는 아무것도 달라지지 않아요. 다크 모드 버튼, 메뉴 버튼, 새로 고침 후 테마 유지가 모두 그대로예요. 다섯 페이지 모두 콘솔에 빨간 오류가 없어요.
:::

### 9단계 · 커밋·푸시 (3분)

**어디서:** VS Code → 소스 제어 패널(`Ctrl + Shift + G`)

**무엇을:** **메시지** 칸에 `Day 25: videos.json과 fetch`를 입력하고 **커밋** → **변경 내용 동기화**를 눌러요. 새 파일(`data\videos.json`)도 함께 올라가요. 명령으로 한다면 VS Code 터미널(PowerShell), 위치 `C:\dev\my-creator-site`에서 아래를 한 줄씩 실행해요.

```powershell
git add .
git commit -m "Day 25: videos.json과 fetch"
git push
```

`git commit` 예상 출력(해시와 숫자는 달라도 돼요):

```text
[main 2e8f1a6] Day 25: videos.json과 fetch
 5 files changed, 65 insertions(+), 16 deletions(-)
```

배포 주소(`https://<내 아이디>.github.io/my-creator-site/contents.html`)에서도 카드 6장이 보이는지 확인해요. 반영까지 최대 10분 걸려요.

:::success
GitHub 저장소에 `data/videos.json`이 생기고 `Day 25: videos.json과 fetch` 커밋이 맨 위에 보여요. 10분쯤 뒤 배포 주소의 영상 페이지에도 카드 6장이 보여요(안 보이면 `Ctrl + F5`로 새로 고침하고 조금 더 기다려요).
:::

## ✍️ 과제

### 과제 1 · 404 만들기 (쉬움 ⭐, 6분)

`contents.js`의 `fetch('data/videos.json')`을 `fetch('data/video.json')`(`s`를 뺀 오타)으로 바꾸고 Live Preview로 새로 고침해 보세요. 오류 상자가 나오고, Network 패널에서 `video.json`의 Status가 `404`인 것을 확인한 뒤 **원래대로 되돌리세요.**

- 확인 방법: 오류 상자, Network의 `404`(빨간 글자), 콘솔의 `서버 응답 코드: 404`.
- 힌트: 서버가 "없는 파일"이라고 답하면 `response.ok`는 어떤 값일까요? 그다음 줄이 무엇을 던질까요?

### 과제 2 · JSON 오류 찾기 (보통 ⭐⭐, 8분)

아래 조각에는 JSON 규칙을 어긴 곳이 3군데 있어요. 찾아서 고친 JSON을 써 보세요.

```text
[
  { "id": "v001", "title": '기타 연주', "category": "music" },
  { "id": "v002", "title": "공포 게임", "category": "game", } // 게임 방송
]
```

- 확인 방법: 고친 글을 새 파일 `C:\dev\my-creator-site\data\test.json`에 붙여 넣어 빨간 물결 밑줄이 없는지 봐요. 확인 후 `test.json`은 지워요(탐색기에서 파일 위 `Delete`).
- 힌트: 키와 글자 값은 큰따옴표, 마지막 쉼표 금지, 주석 금지예요.

### 과제 3 · 내 영상 넣기 (도전 ⭐⭐⭐, 11분)

`videos.json`에 내 영상(또는 좋아하는 영상) 하나를 추가해 카드를 7장으로 만들어 보세요. 조건은 이래요.

- `id`는 `v007`, `category`는 `game`, `talk`, `music` 중 하나예요.
- `youtubeId`는 내 YouTube 영상 주소에서 `watch?v=` 뒤의 11글자예요(예: `https://www.youtube.com/watch?v=aqz-KE-bpKQ`라면 `aqz-KE-bpKQ`).
- `date`는 `2026-11-05` 같은 날짜 글자예요.
- 확인 방법: 카드가 7장이 되고 `영상 7개`로 바뀌어요. 제목을 눌러 YouTube가 새 탭에서 열려요.
- 힌트: 앞의 `v006` 줄 끝에 쉼표를 붙이고, 새 줄에는 쉼표를 붙이지 않아요.
- 마무리: 내 영상을 남겨 두려면 소스 제어 패널에서 `Day 25: 내 영상 추가`로 커밋·푸시해요. 되돌리려면 **변경 내용 취소**를 눌러요(또는 다음 커밋에 포함돼요).

## ✅ 정답

:::answer 과제 1 정답 · 404 만들기
```js
const response = await fetch('data/video.json'); // 오타: 이 파일은 없어요
if (!response.ok) {
  throw new Error(`서버 응답 코드: ${response.status}`); // 404 → catch 로
}
```

**왜 이렇게 하나요?** 서버는 없는 파일을 요청받으면 `404`로 답해요. `fetch`가 답을 정상적으로 받았으니 오류를 던지지 않고, 대신 `response.ok`가 `false`가 돼요. 그래서 `if (!response.ok)`가 `throw`로 직접 오류로 바꿔서 `catch`로 보내요. 콘솔에는 `Error: 서버 응답 코드: 404`가 남고 화면에는 오류 상자가 나와요. 확인이 끝났으면 꼭 `video.json`을 `videos.json`으로 되돌려요.
:::

:::answer 과제 2 정답 · JSON 오류 찾기
```json
[
  { "id": "v001", "title": "기타 연주", "category": "music" },
  { "id": "v002", "title": "공포 게임", "category": "game" }
]
```

**왜 이렇게 하나요?** 문제는 세 가지였어요. ① `'기타 연주'`: JSON은 작은따옴표를 못 써요. 큰따옴표로 바꿔요. ② `"game", }`: 마지막 항목 뒤의 쉼표는 금지예요. 쉼표를 지워요. ③ `// 게임 방송`: JSON에는 주석이 없어요. 지우고, 필요하면 설명은 JSON 밖(README나 코드)에 적어요. 규칙이 엄격한 이유는 서로 다른 프로그램이 같은 파일을 정확히 같은 뜻으로 읽어야 하기 때문이에요.
:::

:::answer 과제 3 정답 · 내 영상 넣기
📄 C:\dev\my-creator-site\data\videos.json (일부)
```json
  { "id": "v006", "title": "요즘 빠진 취미 이야기", "category": "talk", "youtubeId": "WhWc3b3KhnY", "date": "2026-10-06" },
  { "id": "v007", "title": "내가 올린 첫 영상", "category": "game", "youtubeId": "aqz-KE-bpKQ", "date": "2026-11-05" }
```

**왜 이렇게 하나요?** 배열에 객체를 하나 더하는 일이에요. 앞의 `v006` 줄 끝에 쉼표가 생기고, 새로 마지막이 된 `v007` 줄에는 쉼표가 없어요. `youtubeId`는 위 예시를 내 영상의 11글자로 바꿔요. 코드(`contents.js`)는 한 줄도 고치지 않았는데 카드가 7장이 됐어요. 데이터와 코드를 나눈 보람이에요. 영상 제목·ID 같은 글 내용이라서 끝 상태에 남겨 두어도 괜찮아요.
:::

:::answer 오늘 끝 상태 전체 코드
막혔다면 아래 코드로 내 파일을 맞추고 다음 Day를 시작해요. `videos.json`, `contents.js`, `contents.html`, `main.js`는 파일 전체를, `style.css`는 바뀐 블록만 위치와 함께 실었어요.

```text
my-creator-site/
├─ css/
│  └─ style.css ✎
├─ data/
│  └─ videos.json ★
├─ images/
│  ├─ logo.svg
│  ├─ profile.svg
│  ├─ thumb-game.svg
│  ├─ thumb-music.svg
│  └─ thumb-talk.svg
├─ js/
│  ├─ contact.js
│  ├─ contents.js ✎
│  └─ main.js ✎
├─ about.html
├─ contact.html
├─ contents.html ✎
├─ index.html
└─ schedule.html
```

📄 C:\dev\my-creator-site\data\videos.json
```json
[
  { "id": "v001", "title": "기타로 연주하는 신청곡", "category": "music", "youtubeId": "aqz-KE-bpKQ", "date": "2026-10-27" },
  { "id": "v002", "title": "신작 공포 게임 첫 도전", "category": "game", "youtubeId": "eRsGyueVLvQ", "date": "2026-10-25" },
  { "id": "v003", "title": "구독자 1000명 기념 Q&A", "category": "talk", "youtubeId": "R6MlUcmOul8", "date": "2026-10-20" },
  { "id": "v004", "title": "친구들과 협동 퍼즐 도전", "category": "game", "youtubeId": "Y-rmzh0PI3c", "date": "2026-10-18" },
  { "id": "v005", "title": "비 오는 날 플레이리스트", "category": "music", "youtubeId": "TLkA0RELQ1g", "date": "2026-10-11" },
  { "id": "v006", "title": "요즘 빠진 취미 이야기", "category": "talk", "youtubeId": "WhWc3b3KhnY", "date": "2026-10-06" }
]
```

📄 C:\dev\my-creator-site\js\contents.js
```js
// ==========================================================
// contents.js - 영상 목록 페이지
// data/videos.json을 불러와서(fetch) 카드로 그리고,
// 카테고리 버튼과 검색창으로 걸러서 보여 줘요.
// ==========================================================

// 카테고리 코드 → 화면에 보여 줄 이름, 썸네일 그림 (Day 19: 객체)
const categoryNames = { game: '게임', talk: '토크', music: '음악' };
const thumbnails = {
  game: 'images/thumb-game.svg',
  talk: 'images/thumb-talk.svg',
  music: 'images/thumb-music.svg',
};

// 화면의 요소들을 미리 찾아 둬요 (Day 20)
const listElement = document.querySelector('#video-list');
const filterBox = document.querySelector('#category-filters');
const searchInput = document.querySelector('#search');
const countElement = document.querySelector('#result-count');
const emptyMessage = document.querySelector('#empty-message');
const loadStatus = document.querySelector('#load-status');
const loadError = document.querySelector('#load-error');

// 지금 상태: 전체 영상, 불러왔는지 여부, 선택한 카테고리, 검색어
let allVideos = [];
let isLoaded = false;
let selectedCategory = 'all';
let searchText = '';

// 태그 하나를 만들고 클래스와 글자를 넣어 주는 도우미 함수 (Day 18)
function createElementWithText(tagName, className, text) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text; // textContent는 글자 그대로 넣어서 안전해요
  return element;
}

// 영상 데이터 하나로 카드 하나를 만들어요 (Day 20)
function createCard(video) {
  const card = document.createElement('article');
  card.className = 'card';

  const image = document.createElement('img');
  image.src = thumbnails[video.category];
  image.alt = `${categoryNames[video.category]} 영상 썸네일`; // 템플릿 리터럴 (Day 16)
  image.width = 320;
  image.height = 180;
  image.loading = 'lazy';

  const body = document.createElement('div');
  body.className = 'card-body';

  const badge = createElementWithText('span', 'badge', categoryNames[video.category]);

  const title = document.createElement('h3');
  const link = document.createElement('a');
  link.href = `https://www.youtube.com/watch?v=${video.youtubeId}`;
  link.target = '_blank'; // 새 탭에서 열어요
  link.rel = 'noopener noreferrer';
  link.textContent = video.title;
  title.appendChild(link);

  const date = document.createElement('time');
  date.dateTime = video.date;
  date.textContent = video.date;

  body.appendChild(badge);
  body.appendChild(title);
  body.appendChild(date);
  card.appendChild(image);
  card.appendChild(body);
  return card;
}

// 카테고리와 검색어에 맞는 영상만 골라요 (Day 19: filter, 화살표 함수 Day 18)
function getVisibleVideos() {
  return allVideos.filter((video) => {
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchText);
    return matchesCategory && matchesSearch;
  });
}

// 화면을 다시 그려요: 목록을 비우고 → 카드를 하나씩 붙이고 → 개수를 알려 줘요
function render() {
  // 아직 영상을 다 불러오지 못했다면 그리지 않아요. ("불러오는 중이에요" 문구가 계속 보여요)
  // 그 사이에 누른 버튼과 검색어는 변수에 기억해 두었다가, 불러온 뒤에 적용돼요.
  if (!isLoaded) {
    return;
  }

  const videos = getVisibleVideos();

  listElement.textContent = ''; // 안의 내용을 모두 비워요
  videos.forEach((video) => {
    listElement.appendChild(createCard(video));
  });

  countElement.textContent = `영상 ${videos.length}개`;
  emptyMessage.hidden = videos.length > 0;
}

// 카테고리 버튼: 버튼 4개가 아니라 감싸는 상자에만 이벤트를 달아요 (이벤트 위임, Day 21)
filterBox.addEventListener('click', (event) => {
  const button = event.target.closest('button'); // 클릭한 곳에서 가장 가까운 button
  if (!button) {
    return;
  }

  selectedCategory = button.dataset.category; // data-category 값 (all, game, talk, music)

  // 눌린 버튼만 aria-pressed="true"로 표시해요
  filterBox.querySelectorAll('button').forEach((item) => {
    item.setAttribute('aria-pressed', String(item === button));
  });

  render();
});

// 검색창: 글자를 입력할 때마다 바로 걸러요 (Day 23)
searchInput.addEventListener('input', () => {
  searchText = searchInput.value.trim().toLowerCase();
  render();
});

// data/videos.json 불러오기 (Day 25: async/await, 오류 처리)
async function loadVideos() {
  try {
    const response = await fetch('data/videos.json');
    if (!response.ok) {
      throw new Error(`서버 응답 코드: ${response.status}`); // 404 같은 오류도 실패로 다뤄요
    }
    allVideos = await response.json(); // JSON 글자를 배열로 바꿔요
    isLoaded = true;
    loadStatus.hidden = true;
    render();
  } catch (error) {
    // file://로 열었거나 파일 경로가 틀리면 여기로 와요
    console.error('videos.json을 불러오지 못했어요:', error);
    loadStatus.hidden = true;
    loadError.hidden = false;
    loadError.textContent =
      '영상 목록을 불러오지 못했어요. 파일을 더블클릭해서 열었다면 VS Code의 Live Preview나 GitHub Pages 주소로 열어 보세요.';
  }
}

loadVideos();
```

📄 C:\dev\my-creator-site\contents.html
```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>영상 모아보기 - 달빛곰 방송국</title>
  <link rel="stylesheet" href="css/style.css">
  <script src="js/main.js" defer></script>
  <script src="js/contents.js" defer></script>
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
          <li><a href="contents.html" aria-current="page">영상</a></li>
          <li><a href="schedule.html">방송 일정</a></li>
          <li><a href="contact.html">문의</a></li>
          <li><button class="theme-toggle" type="button" aria-pressed="false">🌙 다크 모드</button></li>
        </ul>
      </nav>
    </div>
  </header>

  <main class="container">
    <h1>영상 모아보기</h1>
    <p>카테고리를 고르거나 제목으로 검색해 보세요.</p>

    <div class="toolbar">
      <!-- 버튼 4개를 감싼 상자 하나에만 클릭 이벤트를 달아요 (이벤트 위임, Day 21) -->
      <div id="category-filters" class="filters" role="group" aria-label="카테고리 선택">
        <button type="button" data-category="all" aria-pressed="true">전체</button>
        <button type="button" data-category="game" aria-pressed="false">게임</button>
        <button type="button" data-category="talk" aria-pressed="false">토크</button>
        <button type="button" data-category="music" aria-pressed="false">음악</button>
      </div>

      <div class="search-box">
        <label for="search">제목 검색</label>
        <input id="search" type="search" placeholder="예: 게임" autocomplete="off">
      </div>
    </div>

    <h2>영상 목록</h2>
    <p id="result-count" class="result-count" aria-live="polite"></p>
    <p id="load-status">영상 목록을 불러오는 중이에요…</p>
    <p id="load-error" class="error-box" role="alert" hidden></p>
    <p id="empty-message" hidden>조건에 맞는 영상이 없어요. 다른 검색어를 써 보세요.</p>

    <!-- 카드는 contents.js가 data/videos.json을 읽어서 여기에 그려 줘요 -->
    <div id="video-list" class="card-grid"></div>

    <noscript><p class="error-box">영상 목록을 보려면 JavaScript를 켜 주세요.</p></noscript>
  </main>

  <footer class="site-footer">
    <div class="container">
      <p>&copy; 2026 달빛곰 방송국 · 연습용으로 만든 사이트예요.</p>
    </div>
  </footer>
</body>
</html>
```

📄 C:\dev\my-creator-site\js\main.js
```js
// ==========================================================
// main.js - 모든 페이지에서 쓰는 코드
// 1) 모바일 메뉴 열기/닫기  2) 다크 모드  3) 시간대별 인사말
// (HTML에서 <script src="js/main.js" defer>로 불러와요)
// ==========================================================

// ---------- 1. 모바일 메뉴 (Day 21) ----------
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('#site-nav');

menuToggle.addEventListener('click', () => {
  // classList.toggle: open 클래스가 없으면 붙이고(true), 있으면 떼요(false)
  const isOpen = siteNav.classList.toggle('open');
  // 스크린 리더가 메뉴가 열렸는지 알 수 있게 aria-expanded도 같이 바꿔요
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

// ---------- 2. 다크 모드 (Day 22) ----------
const themeButton = document.querySelector('.theme-toggle');

// 저장된 테마를 꺼내요.
// (try/catch는 Day 25에서 자세히 배워요) 브라우저 설정 때문에 저장소를 못 쓰면 오류가 나서, 사이트가 멈추지 않게 감싸 둬요.
function getSavedTheme() {
  try {
    return localStorage.getItem('theme'); // 'light' 또는 'dark', 없으면 null
  } catch (error) {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem('theme', theme);
  } catch (error) {
    // 저장하지 못해도 사이트는 계속 동작해요
  }
}

// 테마를 화면에 적용해요: <html data-theme="dark"> → style.css의 다크 변수가 켜져요
// 버튼 글자("다크 모드")는 그대로 두고, 켜졌는지는 aria-pressed로 알려 줘요
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
}

// 처음 방문이면 컴퓨터의 다크 모드 설정(prefers-color-scheme)을 따라가요
const savedTheme = getSavedTheme();
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'light' || savedTheme === 'dark') {
  applyTheme(savedTheme);
} else {
  applyTheme(systemPrefersDark ? 'dark' : 'light');
}

themeButton.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
  saveTheme(nextTheme); // 다음에 와도 같은 테마가 되도록 저장해요
});

// ---------- 3. 시간대별 인사말 (Day 16) ----------
const greeting = document.querySelector('#greeting'); // 홈 페이지에만 있어요

if (greeting) {
  const hour = new Date().getHours(); // 0 ~ 23
  let message;

  if (hour < 6) {
    message = '늦은 밤이에요. 올빼미 시청자님, 어서 와요!';
  } else if (hour < 12) {
    message = '좋은 아침이에요! 오늘도 힘차게 시작해요.';
  } else if (hour < 18) {
    message = '즐거운 오후예요! 영상 구경하고 가세요.';
  } else {
    message = '좋은 저녁이에요! 오늘 방송 일정을 확인해 보세요.';
  }

  greeting.textContent = message;
}
```

`C:\dev\my-creator-site\css\style.css`에는 6번 구역의 `.result-count { … }` 규칙 바로 아래(`/* 방송 일정 */` 주석 바로 위)에 이 블록을 넣어요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
.error-box {
  padding: 0.75rem 1rem;
  border: 2px solid var(--error);
  border-radius: 8px;
  color: var(--error);
}
```
:::

## 🧯 자주 막히는 곳

여기에 없는 증상은 [문제 해결 모음](#/page/troubleshooting)에서 찾아보세요.

### 더블클릭으로 열었더니 오류 상자가 나와요

**원인:** 정상이에요. `file://`로 연 페이지는 보안 때문에 `fetch`가 막혀요. 콘솔에는 `Fetch API cannot load file:///…`로 시작하는 줄이 나와요.

**해결:** VS Code의 Live Preview(`http://127.0.0.1:3000/contents.html`)나 배포 주소로 열어요. 위쪽 "따라하기" 맨 처음 설명을 참고해요.

### "영상 목록을 불러오는 중이에요…"에서 멈췄어요

**원인:** 두 가지가 흔해요. ① 파일 끝에 `loadVideos();` 호출이 없어요(함수를 만들기만 하고 부르지 않았어요). ② `loadVideos` 안의 `isLoaded = true;`가 빠져서 `render()`가 계속 돌아가요. ①이면 아무것도 일어나지 않고, ②면 문장은 사라지는데 카드가 안 그려져요.

**해결:** `contents.js` 맨 끝 줄이 `loadVideos();`인지, `try` 안에 `isLoaded = true;`가 있는지 확인해요.

### SyntaxError: await is only valid in async functions…

```text
Uncaught SyntaxError: await is only valid in async functions and the top level bodies of modules
```

**원인:** `await`를 쓴 함수 앞에 `async`가 없어요. 이 오류는 파일 전체가 아예 실행되지 않게 해서, 메뉴·필터가 모두 멈춰요.

**해결:** `async function loadVideos() {`처럼 `function` 앞에 `async`를 붙이고 저장해요.

### JSON이 아닌 글자 오류 (is not valid JSON)

**원인:** `videos.json`이 JSON 규칙에 어긋나요. 작은따옴표, 마지막 쉼표, 주석, 닫지 않은 따옴표·괄호가 흔한 원인이에요.

**해결:** `videos.json`을 열어 VS Code의 빨간 물결 밑줄 위에 마우스를 올려 설명을 읽어요. 7단계에서 만든 오류 문장의 위치(`position` 숫자나 따옴표 속 글자)도 힌트가 돼요.

### 서버 응답 코드: 404 (Network에서 videos.json이 빨간 404)

```text
Failed to load resource: the server responded with a status of 404 (Not Found)
```

**원인:** 파일 이름이나 폴더 위치가 달라요. `data` 폴더가 `my-creator-site` 안이 아닌 다른 곳에 있거나, `Data`처럼 대문자로 만들었거나, `video.json`으로 오타가 났어요. 내 컴퓨터(Windows)는 대소문자를 구분하지 않아도 배포 서버는 구분해서, 배포 주소에서만 404가 나기도 해요.

**해결:** `C:\dev\my-creator-site\data\videos.json`이 정확히 있는지 탐색기에서 확인하고, `fetch('data/videos.json')`의 소문자 철자와 폴더 이름을 똑같이 맞춰요.

### 배포 주소에서 예전 데이터가 보여요

**원인:** GitHub Pages는 푸시 후 반영까지 최대 10분이 걸리고, 브라우저가 예전 파일을 기억(캐시)하기도 해요.

**해결:** 5~10분 기다린 뒤 `Ctrl + F5`로 강력 새로 고침해요. 저장소의 `data/videos.json`에 내 수정이 올라와 있는지도 GitHub에서 확인해요.

## 📝 오늘의 체크리스트

- [ ] `C:\dev\my-creator-site\data\videos.json`이 있고 빨간 물결 밑줄이 없어요
- [ ] Live Preview로 연 영상 페이지에 카드 6장이 보여요(JSON에서 온 카드예요)
- [ ] Network 패널에서 `videos.json`의 Status `200`을 봤어요
- [ ] 더블클릭으로 열면 오류 상자가 나오는 이유를 설명할 수 있어요
- [ ] `async`/`await`, `try…catch`가 각각 무엇을 하는지 말할 수 있어요
- [ ] JSON에 쉼표를 하나 더 넣으면 오류가 나는 것을 확인하고 되돌렸어요
- [ ] 필터, 검색, 다크 모드가 그대로 동작해요
- [ ] 과제 1~3을 하고 정답과 비교했어요
- [ ] 배포 주소의 영상 페이지에도 카드 6장이 보이고 GitHub에 `Day 25` 커밋이 있어요

## 📚 더 알아보기

- [MDN — 서버에서 데이터 가져오기](https://developer.mozilla.org/ko/docs/Learn_web_development/Core/Scripting/Network_requests): `fetch`로 데이터를 받아 화면에 보여 주는 과정을 설명해요.
- [MDN — JSON 다루기](https://developer.mozilla.org/ko/docs/Learn_web_development/Core/Scripting/JSON): JSON 문법과 JavaScript 객체와의 차이를 자세히 알려 줘요.
- [MDN — try...catch](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/try...catch): 오류를 잡아 처리하는 문법을 정리해요.

➡️ **다음 Day 예고:** [Day 26 · 날짜와 타이머](#/day/p1-d26)에서는 `data\schedule.json`을 불러와서 방송 일정 표의 오늘 요일을 강조하고, 다음 방송까지 남은 시간을 1초마다 줄어드는 카운트다운으로 보여 줘요.
