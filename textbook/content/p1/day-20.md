## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- DOM(브라우저가 HTML을 읽어 만든 요소 나무)이 무엇인지 설명하고, 개발자 도구 Elements에서 볼 수 있어요.
- `querySelector`, `textContent`, `classList`로 화면의 요소를 찾아 글자와 클래스를 바꿀 수 있어요.
- `createElement`로 요소를 만들고 `appendChild`로 화면에 붙일 수 있어요.
- 영상 데이터 6개로 카드 6장을 JavaScript가 그려 주게 만들 수 있어요.

**예상 시간: 120분** (개념 이해 24분 · 따라하기 70분 · 과제 20분 · 정리 6분)

:::path 📂 시작 상태
어제(Day 19)까지 만든 파일이 이렇게 있어야 해요. 없거나 다르면 [Day 19](#/day/p1-d19)의 "오늘 끝 상태 전체 코드"로 맞춰 주세요.

- `C:\dev\my-creator-site\index.html`, `about.html`, `contents.html`, `schedule.html`, `contact.html`
- `C:\dev\my-creator-site\css\style.css`, `js\main.js`, `js\contents.js`(영상 데이터 객체 6개와 확인용 콘솔 코드가 들어 있어요)
- `C:\dev\my-creator-site\images\` 안에 `profile.svg`, `logo.svg`, `thumb-game.svg`, `thumb-talk.svg`, `thumb-music.svg`
- `contents.html`에는 손으로 쓴 카드 3장(`div.card-grid`)이 있고 `<head>`에 `contents.js`가 연결되어 있어요.
- GitHub Pages가 켜져 있어요: `https://<내 아이디>.github.io/my-creator-site/`
- VS Code에서 `C:\dev\my-creator-site` 폴더가 열려 있고, Live Preview 확장 프로그램이 설치되어 있어요.
- 어제 변경은 모두 커밋·푸시했어요(소스 제어 패널의 변경 0개).
:::

## 📖 개념 이해

### 브라우저가 만든 요소 나무: DOM

HTML 파일은 글자로 된 설계도예요. 브라우저는 이 글자를 읽어서 **요소들이 나무처럼 이어진 구조**를 메모리에 만들고, 그 구조를 보고 화면을 그려요.

**비유:** 가계도를 떠올려 보세요. 할아버지(`html`) 아래에 아버지(`body`), 그 아래에 자식(`main`, `h1`, `p`…)이 이어져 있어요. 한 요소는 부모 하나와 자식 여러 개를 가질 수 있어요.

**정확한 정의:** **[[DOM]]**(Document Object Model, 문서 객체 모델)은 브라우저가 HTML을 읽어 만든, 요소들이 나무처럼 이어진 구조예요. JavaScript는 `document`에서 시작해 이 나무의 요소를 찾고, 글자를 바꾸고, 새 요소를 붙여서 **화면을 바꿔요**. 파일(`.html`)은 그대로이고, 브라우저가 가진 나무와 화면만 바뀌어요.

개발자 도구의 **Elements** 패널에 보이는 것이 지금의 DOM이에요(Day 6). JavaScript가 DOM을 바꾸면 Elements에도 바뀐 모습이 나타나요.

```text
html
├─ head
└─ body
   ├─ header
   └─ main
      ├─ h1
      └─ div#video-list
         ├─ article.card
         └─ article.card
```

### 요소 찾기와 글자 바꾸기

- **[[querySelector]]**(쿼리 셀렉터)는 CSS 선택자로 요소를 **하나** 찾아 주는 메서드예요. `document.querySelector('#video-list')`는 `id="video-list"`인 요소를, `'.card'`는 `class="card"`인 첫 요소를 찾아요. 없으면 `null`을 돌려줘요(Day 16에서 본 그 `null`이에요).
- **[[textContent]]**(텍스트 콘텐츠)는 요소 안의 글자를 읽거나 바꾸는 속성이에요. `title.textContent = '새 제목'`으로 바꾸고, `textContent = ''`으로 요소 안을 **비울** 수도 있어요.
- **[[classList]]**(클래스 리스트)는 요소의 클래스 목록을 다루는 속성이에요. `classList.add('today')`로 붙이고, `remove`로 떼고, `contains`로 붙어 있는지 물어요. 클래스를 바꾸면 CSS에 미리 써 둔 모양이 적용돼요. 클래스를 통째로 정할 때는 `className = 'card'`를 써요.

:::warn 사용자 글은 innerHTML이 아니라 textContent로
요소 안에 글을 넣는 방법으로 `innerHTML`도 있어요. 그런데 `innerHTML`은 글 속의 꺾쇠(`<b>` 같은 것)를 **진짜 태그로 만들어요**. 이 방법으로 넣은 `<script>` 태그 자체는 실행되지 않지만, `<img src="x" onerror="…">`처럼 다른 태그의 속성에 코드를 숨기면 실행될 수 있어요. 남이 쓴 댓글이나 문의 내용에 그런 태그가 섞이면 내 사이트에서 실행될 수 있어서 위험해요. `textContent`는 꺾쇠까지 **글자 그대로** 보여 줘서 안전해요. 이 교재는 데이터나 사용자 글을 화면에 넣을 때 항상 `textContent`를 써요.
:::

### 요소를 직접 만들기: createElement

영상이 6편이면 카드 HTML을 6번 손으로 쓰는 대신, 데이터 한 편마다 카드를 **코드로 만들면** 돼요. 영상이 늘어도 데이터 한 줄만 더하면 카드가 늘어요.

**[[createElement]]**(크리에이트 엘리먼트)는 새 HTML 요소를 JavaScript로 만드는 메서드예요. 만든 요소는 아직 화면에 없어서, 세 단계가 필요해요.

1. **만들기:** `const card = document.createElement('article');`
2. **채우기:** 클래스, 속성, 글자를 넣어요(`card.className = 'card'`).
3. **붙이기:** 화면에 있는 요소 안에 `appendChild()`로 붙여요(`listElement.appendChild(card)`). 붙여야 비로소 보여요.

속성도 코드로 넣어요. `image.src = '…'`, `image.alt = '…'`, `link.href = '…'`처럼 점을 쓰고, 클래스는 `className`, 날짜는 `time` 요소의 `dateTime` 속성으로 넣어요.

### 데이터에서 카드까지

오늘 만들 함수는 세 개예요. 이름이 하는 일을 말해 줘요.

- `createElementWithText(tagName, className, text)`: 태그 하나를 만들고 클래스와 글자를 넣어 돌려주는 **도우미 함수**.
- `createCard(video)`: 영상 데이터 하나를 받아 카드(`article`) 하나를 만들어 돌려줘요.
- `render()`: 목록 칸을 비우고, 영상마다 카드를 만들어 붙여요. 화면을 "다시 그리는" 함수예요.

카드 하나의 구조는 Day 12에서 손으로 쓴 카드에 배지(카테고리 이름 표시)를 더한 모양이에요.

```text
article.card
├─ img
└─ div.card-body
   ├─ span.badge     (음악 / 게임 / 토크)
   ├─ h3
   │  └─ a           (제목, 새 탭으로 YouTube 열기)
   └─ time           (날짜)
```

:::info 실무에서는
이렇게 데이터로 화면을 그리는 방식은 거의 모든 웹 앱의 기본이에요. 나중에 React 같은 도구를 쓰더라도 "데이터가 바뀌면 화면을 다시 그린다"는 생각은 같아요. 오늘 만드는 `render()`가 Day 21~25에서 필터, 검색, 서버 데이터에 계속 쓰여요.
:::

## 🛠️ 따라하기

모두 11단계예요. 결과는 영상 페이지(`contents.html`)를 Edge나 Chrome에서 열어 확인하고, 개발자 도구는 `F12`로 열어요. 파일 탐색기에서 `contents.html`을 더블클릭하거나, Live Preview 미리 보기 창 위쪽의 주소(`http://127.0.0.1:3000/…`, 숫자는 달라도 돼요)를 복사해 Edge나 Chrome 주소창에 붙여 넣어요.

### 1단계 · Elements에서 DOM 나무 보기 (5분)

글자로 된 HTML이 어떤 나무로 읽히는지 눈으로 봐요.

**어디서:** Edge 또는 Chrome에서 연 `contents.html`

**무엇을:**

1. `F12`를 눌러 개발자 도구를 열고 **Elements**(요소) 탭을 클릭해요.
2. `<body>` 줄 왼쪽의 작은 삼각형(▶)을 눌러 펼쳐요. `<main class="container">`, `<div class="card-grid">`도 차례로 펼쳐요.
3. `<article class="card">` 하나를 끝까지 펼쳐서 `img`, `div.card-body`, `h3`, `p`를 봐요.
4. 개발자 도구 왼쪽 위의 **요소 선택** 아이콘(화살표 모양)을 누르고 화면의 카드 하나를 클릭해 봐요.

:::success
Elements에 들여쓰기가 된 나무가 보여요. 카드를 클릭하면 Elements에서 그 `article`이 파랗게 선택돼요. 부모는 위에, 자식은 안쪽(들여쓰기)에 있다는 걸 눈으로 확인할 수 있어요.
:::

### 2단계 · 콘솔에서 찾고, 바꾸고, 클래스 붙이기 (10분)

코드를 파일에 쓰기 전에, 콘솔에서 한 줄씩 DOM을 만져 봐요. 화면이 바로 바뀌는 걸 볼 수 있어요.

**어디서:** `contents.html`의 개발자 도구 **Console**, 맨 아래 입력 칸(`>`)

**무엇을:** 표의 **입력**을 한 줄씩 입력하고 `Enter`를 눌러요.

| 입력 | 결과 |
|---|---|
| `document.querySelector('h1').textContent` | `'영상 모아보기'` |
| `document.querySelector('h1').textContent = '영상 모음'` | `'영상 모음'` |
| `document.querySelector('.card h3').textContent` | `'기타로 연주하는 신청곡'` |
| `document.querySelector('.nothing')` | `null` |
| `const firstCard = document.querySelector('.card')` | `undefined` |
| `firstCard.classList.add('is-selected')` | `undefined` |
| `firstCard.classList.contains('is-selected')` | `true` |
| `firstCard.className` | `'card is-selected'` |
| `firstCard.classList.remove('is-selected')` | `undefined` |
| `firstCard.className` | `'card'` |

:::success
두 번째 줄을 입력한 순간 페이지의 큰 제목이 `영상 모음`으로 바뀌어요. `.nothing`처럼 없는 요소는 `null`이에요. 클래스를 붙이면 Elements 패널의 첫 `article`이 `class="card is-selected"`로 잠깐 바뀌었다가, 떼면 `class="card"`로 돌아와요. `F5`로 새로 고침하면 제목이 원래대로 돌아와요. 파일은 바뀌지 않았으니까요.
:::

### 3단계 · contents.html을 JavaScript용으로 바꾸기 (6분)

손으로 쓴 카드 3장을 지우고, JavaScript가 카드를 넣어 줄 빈 상자를 만들어요.

**어디서:** VS Code, `C:\dev\my-creator-site\contents.html`, `<main>` 안

**무엇을:**

1. `<p>지난 방송 영상을 모아 두는 페이지예요.</p>` 줄 **아래**에 있는 `<div class="card-grid"> … </div>` 전체(카드 3장)를 드래그해서 지워요.
2. 그 자리에 아래 `<h2>`부터 `<noscript>`까지를 붙여 넣어요. 아래는 `<main>` 전체 모습이에요.
3. `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\contents.html (일부)
```html
  <main class="container">
    <h1>영상 모아보기</h1>
    <p>지난 방송 영상을 모아 두는 페이지예요.</p>

    <h2>영상 목록</h2>
    <!-- 카드는 contents.js가 영상 데이터를 읽어서 여기에 그려 줘요 -->
    <div id="video-list" class="card-grid"></div>

    <noscript><p class="error-box">영상 목록을 보려면 JavaScript를 켜 주세요.</p></noscript>
  </main>
```

- `id="video-list"`가 JavaScript가 카드를 넣을 상자의 이름표예요. `class="card-grid"`는 Day 12의 Grid 규칙을 그대로 써요.
- `<noscript>`는 JavaScript가 꺼진 브라우저에서만 보이는 안내예요.
- `class="error-box"`의 모양은 Day 25에서 꾸미므로 지금은 평범한 문단처럼 보여도 괜찮아요.

:::success
영상 페이지를 새로 고침하면 카드가 하나도 안 보여요. `영상 모아보기` 제목과 안내 문장, 그 아래 `영상 목록` 제목만 보여요. 카드를 그려 줄 JavaScript를 아직 안 썼으니까요. 개발자 도구 Console에는 어제의 확인용 줄 8개가 아직 나오고 있어요.
:::

### 4단계 · 카드에 필요한 CSS 두 개 쓰기 (4분)

날짜를 한 줄로 보이게 하고, 카테고리 배지를 알약 모양으로 꾸며요.

**어디서:** VS Code, `C:\dev\my-creator-site\css\style.css`, `5. 공통 부품` 구역의 `.card-body p { … }` 규칙 바로 아래

**무엇을:**

1. `.card-body p { … }` 규칙이 끝나는 `}` 아래 한 줄을 비워요.
2. 아래 블록을 붙여 넣고 `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
.card-body time {
  display: block;
  color: var(--muted);
  font-size: 0.9rem;
}

.badge {
  display: inline-block;
  padding: 0 0.6rem;
  border-radius: 999px;
  background: var(--accent);
  color: var(--accent-text);
  font-size: 0.8rem;
  font-weight: 700;
}
```

`.badge`는 포인트 색 배경에 흰 글자의 작은 알약이에요. 색은 어제 만든 변수(`--accent`, `--accent-text`)를 써요.

:::success
저장해도 화면은 아직 그대로예요(카드가 없으니까요). 5단계 이후에 카드가 나타나면 모양이 적용돼요.
:::

### 5단계 · contents.js 정리하기: 확인용 코드 지우기 (3분)

어제 만든 확인용 코드를 지우고 머리 주석을 고쳐요. 데이터(`allVideos`)와 두 객체는 그대로 둬요.

**어디서:** VS Code, `C:\dev\my-creator-site\js\contents.js`

**무엇을:**

1. 파일 맨 아래의 `// 확인용 (Day 20에서 지워요)` 줄부터 `console.log('제목 목록:', titles);`까지 확인용 코드 전부를 드래그해서 지워요. `];`로 끝나는 `allVideos`까지만 남아요.
2. 맨 위 머리 주석의 셋째 줄 `지금은 영상 데이터를 만들고 콘솔에서 살펴봐요`를 아래처럼 바꿔요.
3. `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\js\contents.js (일부)
```js
// ==========================================================
// contents.js - 영상 목록 페이지
// 영상 데이터로 카드를 그려요
// ==========================================================
```

:::success
`contents.js`에는 머리 주석, `categoryNames`, `thumbnails`, `allVideos`만 남았어요. 영상 페이지를 새로 고침하면 콘솔이 비어 있어요(어제의 8줄이 사라졌어요).
:::

### 6단계 · 카드를 넣을 상자 찾기 (5분)

화면에서 `#video-list` 상자를 찾아 변수에 담아 둬요. 데이터(`allVideos`) 위에 둬요.

**어디서:** VS Code, `C:\dev\my-creator-site\js\contents.js`, `thumbnails` 객체와 `// 지금 상태: 전체 영상` 주석 사이

**무엇을:**

1. `thumbnails` 객체가 끝나는 `};` 아래 한 줄을 비워요.
2. 아래 두 줄을 붙여 넣어요(그 아래에 빈 줄 하나가 있고 `// 지금 상태: 전체 영상`이 이어져요).
3. `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\js\contents.js (일부)
```js
// 화면의 요소들을 미리 찾아 둬요 (Day 20)
const listElement = document.querySelector('#video-list');
```

`const`를 쓴 이유는 이 상자는 바뀌지 않기 때문이에요. 여러 곳에서 쓰므로 한 번만 찾아서 이름을 붙여 둬요.

:::success
저장해도 화면은 그대로예요. 값을 확인하려면 영상 페이지를 새로 고침한 뒤 콘솔에 `listElement`를 입력해 보세요. `<div id="video-list" class="card-grid"></div>` 요소가 나오면 잘 찾은 거예요.
:::

### 7단계 · 도우미 함수 createElementWithText (6분)

태그 만들기 → 클래스 넣기 → 글자 넣기가 자주 반복되니, 함수 하나로 묶어요.

**어디서:** VS Code, `C:\dev\my-creator-site\js\contents.js`, `allVideos`의 `];` 아래

**무엇을:**

1. `];` 아래에 빈 줄을 하나 넣고 아래 코드를 붙여 넣어요.
2. `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\js\contents.js (일부)
```js
// 태그 하나를 만들고 클래스와 글자를 넣어 주는 도우미 함수 (Day 18)
function createElementWithText(tagName, className, text) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text; // textContent는 글자 그대로 넣어서 안전해요
  return element;
}
```

- `tagName`으로 태그를 만들고(`createElement`), `className`을 넣고, `textContent`로 글자를 넣은 뒤 `return`으로 돌려줘요.
- 이 함수는 부를 때 실행돼요. 아직 부르지 않아서 화면은 그대로예요.

:::success
저장해도 화면은 그대로예요. 편집기에 빨간 물결 줄이 없어야 해요. 이 함수는 8단계의 `createCard`가 불러서 써요.
:::

### 8단계 · 카드 하나를 만드는 createCard (12분)

영상 데이터 하나를 받아서 카드 하나를 만들어 돌려주는 함수예요. 길지만 3부분(요소 만들기, 안쪽 채우기, 붙이기)으로 읽으면 쉬워요.

**어디서:** VS Code, `C:\dev\my-creator-site\js\contents.js`, `createElementWithText` 함수 아래

**무엇을:**

1. `createElementWithText` 함수가 끝나는 `}` 아래에 빈 줄을 하나 넣어요.
2. 아래 코드를 붙여 넣고 `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\js\contents.js (일부)
```js
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
```

읽는 법이에요.

- **카드와 그림:** `article.card`를 만들고, `img`를 만들어 `src`(썸네일 경로, `thumbnails[video.category]`), `alt`(Day 5의 대체 텍스트), `width`·`height`(자리 미리 잡기), `loading = 'lazy'`(화면 가까이 올 때 불러오기, 뜻은 Day 28)를 넣어요.
- **글 부분:** `div.card-body`를 만들고 배지(`span.badge`), 제목(`h3` 안의 링크 `a`), 날짜(`time`)를 만들어요.
- **링크:** `link.href`는 YouTube 영상 주소 `` `https://www.youtube.com/watch?v=${video.youtubeId}` ``예요. `target = '_blank'`는 새 탭으로 열고, `rel = 'noopener noreferrer'`는 새 탭이 우리 페이지를 건드리지 못하게 하고(`noopener`), 어느 페이지에서 왔는지 상대 사이트에 알리지 않는(`noreferrer`) 안전 장치예요.
- **날짜:** `time`의 `dateTime`은 컴퓨터가 읽는 날짜, `textContent`는 사람이 읽는 날짜예요(둘 다 같은 값을 넣었어요).
- **붙이기:** `appendChild`로 자식을 붙여요. 붙이는 **순서가 화면 순서**예요(배지 → 제목 → 날짜).
- 마지막 `return card;`가 완성된 카드를 돌려줘요. 빠뜨리면 아래 🧯의 "Failed to execute 'appendChild' on 'Node'" 오류가 나요.

:::success
저장해도 화면은 아직 그대로예요. `createCard`도 부르는 곳이 없으니까요. 줄 수가 많으니 괄호 `( )`와 중괄호 `{ }`가 짝이 맞는지 편집기에서 확인해요(괄호 위에 커서를 두면 짝이 되는 괄호가 진하게 표시돼요).
:::

### 9단계 · render 함수로 화면 그리기 (6분)

목록을 비우고 카드를 하나씩 만들어 붙이는 함수를 쓰고, 마지막에 한 번 불러요.

**어디서:** VS Code, `C:\dev\my-creator-site\js\contents.js`, `createCard` 함수 아래, 그리고 파일 맨 끝

**무엇을:**

1. `createCard` 함수가 끝나는 `}` 아래에 빈 줄을 하나 넣고 아래 `render` 함수를 붙여 넣어요.

📄 C:\dev\my-creator-site\js\contents.js (일부)
```js
// 화면을 다시 그려요: 목록을 비우고 → 카드를 하나씩 붙여요
function render() {
  listElement.textContent = ''; // 안의 내용을 모두 비워요
  allVideos.forEach((video) => {
    listElement.appendChild(createCard(video));
  });
}
```

2. 파일 맨 마지막에 빈 줄을 하나 넣고 `render();` 한 줄을 써서 함수를 불러요.

```js
render();
```

3. `Ctrl + S`로 저장하고, 영상 페이지를 `F5`로 새로 고침해요.

- `listElement.textContent = ''`로 상자를 먼저 비워요. 비우지 않고 `render()`를 또 부르면 카드가 쌓여요.
- `allVideos.forEach((video) => { … })`가 영상마다 카드를 만들어(`createCard(video)`) 상자에 붙여요(`appendChild`).

:::success
영상 페이지에 썸네일 카드 6장이 나타나요. 첫 카드는 `음악` 배지(보라색 알약), 제목 `기타로 연주하는 신청곡`, 날짜 `2026-10-27`이에요. 순서는 음악 → 게임 → 토크 → 게임 → 음악 → 토크 배지예요. 카드가 안 보이거나 빨간 오류가 있으면 아래 🧯의 "Cannot set properties of null (setting 'textContent')"를 먼저 보세요. 오류 문장이 `appendChild`로 시작하면 "Failed to execute 'appendChild' on 'Node'" 항목을 보세요.
:::

### 10단계 · 카드 점검하기 (6분)

링크가 새 탭으로 열리는지, Elements 구조가 맞는지, 콘솔이 깨끗한지 확인해요.

**어디서:** Edge 또는 Chrome에서 연 `contents.html`

**무엇을:**

1. 카드 제목 `기타로 연주하는 신청곡`을 클릭해요. 새 탭에서 YouTube가 열려요.
2. 새 탭을 닫고 `F12` → **Elements**에서 `<div id="video-list" class="card-grid">`를 펼쳐 `article.card`가 몇 개인지 세어요.
3. 첫 `article`을 펼쳐 `img`, `div.card-body` > `span.badge`, `h3` > `a`, `time`의 구조를 봐요.
4. **Console**에 빨간 글자가 없는지 봐요.

대표 영상과 같이 영상 ID는 **예시**예요. 예시 영상이 "동영상을 사용할 수 없음"으로 보일 수 있어요. 내 YouTube 영상 주소 `watch?v=` 뒤의 11글자로 `allVideos`의 `youtubeId`를 바꾸면 내 영상이 열려요. YouTube는 인터넷이 필요해요.

:::success
제목을 누르면 새 탭에서 `youtube.com/watch?v=aqz-KE-bpKQ` 주소가 열려요(영상 재생 여부는 예시 ID라서 달라요). Elements에서 `#video-list` 안에 `article.card`가 정확히 6개 있고, 콘솔은 비어 있어요(빨간 글자 0개).
:::

### 11단계 · 오늘 작업 커밋·푸시와 배포 주소 확인 (7분)

오늘 바뀐 파일을 Git에 기록하고(커밋) GitHub로 올려요(푸시). 매일 마지막에 하는 습관이에요. Day 7·8에서 한 것과 똑같아요.

**어디서:** VS Code, `C:\dev\my-creator-site` 폴더가 열린 창. 왼쪽 세로 막대의 가지 모양 아이콘(**소스 제어**, `Ctrl + Shift + G`)

**무엇을 (방법 A, 소스 제어 패널):**

1. 위쪽 **메시지** 칸을 클릭하고 `Day 20: DOM으로 영상 카드 그리기`를 입력해요.
2. **커밋** 버튼을 클릭해요. 변경 사항을 스테이징할지 묻는 창이 뜨면 **예**(또는 **항상**)를 눌러요.
3. **변경 내용 동기화** 버튼(또는 **푸시**)을 클릭해요. 확인 창이 뜨면 **확인**(또는 **OK**)을 눌러요.

버튼 이름은 VS Code 버전에 따라 조금 다를 수 있어요.

**무엇을 (방법 B, 터미널):** VS Code 메뉴 **터미널 → 새 터미널**을 눌러 Day 7에서 연 PowerShell 창을 열어요. 현재 위치가 `C:\dev\my-creator-site`인지 확인하고 한 줄씩 입력해요.

```powershell
git add .
```

예상 출력: 보통 아무것도 나오지 않고 다음 줄에 `PS C:\dev\my-creator-site>`가 다시 보이면 성공이에요. 아래처럼 `warning`이 나오면 Windows와 Git의 줄바꿈 방식이 달라서 나오는 안내예요. 무시해도 돼요(파일 이름은 달라도 돼요).

```text
warning: in the working copy of 'index.html', LF will be replaced by CRLF the next time Git touches it
```

```powershell
git commit -m "Day 20: DOM으로 영상 카드 그리기"
```

예상 출력(`a1b2c3d` 같은 해시와 숫자는 달라도 돼요):

```text
[main a1b2c3d] Day 20: DOM으로 영상 카드 그리기
 7 files changed, 120 insertions(+), 12 deletions(-)
```

```powershell
git push
```

예상 출력(숫자는 달라도 돼요. 진행 상황 줄이 더 많이 나올 수도 있어요):

```text
To https://github.com/<내 아이디>/my-creator-site.git
   a1b2c3d..e4f5a6b  main -> main
```

:::success
브라우저에서 `https://github.com/<내 아이디>/my-creator-site`를 열고 새로 고침(`F5`)하면, 파일 목록 위에 방금 쓴 커밋 메시지 `Day 20: DOM으로 영상 카드 그리기`가 보여요. VS Code 소스 제어 패널의 변경 목록은 비어 있어요.
:::

푸시한 뒤 몇 분 지나면 인터넷 주소에서도 카드 6장이 나와요.

**어디서:** 브라우저, `https://<내 아이디>.github.io/my-creator-site/contents.html`

**무엇을:** 주소를 열고 `Ctrl + F5`로 새로 고침해요. 반영이 안 됐으면 몇 분 뒤 다시 해요(최대 10분).

:::success
인터넷 주소의 영상 페이지에도 카드 6장이 나와요. 내 컴퓨터에서 본 것과 같아요.
:::

:::warn 내 컴퓨터에서는 되는데 인터넷 주소에서는 카드가 안 나와요
먼저 푸시했는지 확인하고, [도움말 7번](#/page/help)의 순서대로 확인해요. 카드가 안 나오면 `js/contents.js`와 썸네일 그림(`images/thumb-*.svg`)의 대소문자를 먼저 의심해요. 인터넷 주소에서 `F12` → **Console**의 빨간 줄이 단서예요.
:::

## ✍️ 과제

### 과제 1 · DOM 나무 그리기 (쉬움 ⭐, 6분)

Elements에서 첫 카드를 펼쳐서 구조를 들여쓴 목록으로 적고, 각 요소를 만든 코드 줄을 찾아 써요.

- `article`부터 `time`까지 나무를 들여쓰기로 그려요.
- 각 요소를 `contents.js`의 어느 줄(`document.createElement(…)` 또는 `createElementWithText(…)`)이 만드는지 짝지어요.

힌트: `createCard` 함수에서 `card`, `image`, `body`, `badge`, `title`, `link`, `date` 변수를 찾아요.

### 과제 2 · 데이터만 고치기 (보통 ⭐⭐, 6분)

HTML을 건드리지 않고 데이터만 고쳐서 화면이 바뀌는 것을 확인해요.

- `contents.js`의 `allVideos` 첫 영상의 `title`을 `'내가 바꾼 제목'`으로 바꾸고 저장해요.
- 영상 페이지를 새로 고쳐서 첫 카드의 제목이 바뀌는지 봐요.
- 확인이 끝나면 원래 제목 `기타로 연주하는 신청곡`으로 되돌려요.

힌트: `title` 키의 값(따옴표 안)만 바꿔요.

### 과제 3 · textContent와 innerHTML (도전 ⭐⭐⭐, 8분)

`createCard`의 `link.textContent = video.title;` 줄을 `link.innerHTML = '<b>굵게</b>';`로 바꿔 보고, 원래 코드와 비교해요.

- `link.textContent = '<b>굵게</b>';`로 바꿨을 때와 `link.innerHTML = '<b>굵게</b>';`로 바꿨을 때 화면이 어떻게 다른지 적어요.
- 왜 사용자나 남이 쓴 글에는 `innerHTML`이 위험한지 한 줄로 적어요.
- 확인이 끝나면 `link.textContent = video.title;`로 되돌려요.

힌트: 카드 제목 글자를 살펴봐요.

## ✅ 정답

:::answer 과제 1 정답 · DOM 나무 그리기
```text
article.card
├─ img
└─ div.card-body
   ├─ span.badge
   ├─ h3
   │  └─ a
   └─ time
```

각 요소를 만든 코드예요.

| 요소 | 만든 코드 |
|---|---|
| `article.card` | `const card = document.createElement('article');` |
| `img` | `const image = document.createElement('img');` |
| `div.card-body` | `const body = document.createElement('div');` |
| `span.badge` | `createElementWithText('span', 'badge', …)` |
| `h3`, `a` | `document.createElement('h3')`, `document.createElement('a')` |
| `time` | `const date = document.createElement('time');` |

**왜 이렇게 하나요?** Elements의 나무와 코드의 `appendChild` 순서는 일대일로 맞아요. `title.appendChild(link)`는 `h3` 안에 `a`를 넣고, `body.appendChild(badge)`는 카드 글 부분에 배지를 넣어요. 나무를 그려 보면 부모와 자식 관계가 코드로 읽혀요.
:::

:::answer 과제 2 정답 · 데이터만 고치기
`allVideos`의 첫 줄을 이렇게 바꿔요.

```js
  { id: 'v001', title: '내가 바꾼 제목', category: 'music', youtubeId: 'aqz-KE-bpKQ', date: '2026-10-27' },
```

새로 고치면 첫 카드의 제목이 `내가 바꾼 제목`으로 바뀌어요. 확인이 끝나면 `title`을 `기타로 연주하는 신청곡`으로 되돌려요.

**왜 이렇게 하나요?** 화면의 글은 HTML 파일에 적혀 있지 않고 **데이터**에서 와요. 영상이 늘면 `allVideos`에 객체 한 줄만 더하면 카드가 하나 늘어요. 이게 데이터로 화면을 그리는 방식의 장점이에요.
:::

:::answer 과제 3 정답 · textContent와 innerHTML
- `link.textContent = '<b>굵게</b>';`: 카드 제목에 꺾쇠까지 **글자 그대로** `<b>굵게</b>`가 보여요. 태그가 실행되지 않아요.
- `link.innerHTML = '<b>굵게</b>';`: 꺾쇠가 태그로 해석되어 `굵게`라는 글자가 **굵게** 보이고, Elements에는 `<a><b>굵게</b></a>`가 생겨요.

위험한 이유 한 줄: `innerHTML`은 글자 속에 섞인 꺾쇠를 진짜 태그로 만들기 때문에, 남이 쓴 글에 `<img onerror="…">` 같은 태그가 있으면 내 사이트에서 그 코드가 실행될 수 있어요(`<script>` 태그는 이 방법으로는 실행되지 않아요). `textContent`는 항상 글자로만 다뤄서 안전해요.

**왜 이렇게 하나요?** 영상 제목은 내가 쓰지만, 나중에 만들 문의 폼 내용이나 검색어처럼 **남이 입력한 글**을 화면에 넣을 때가 와요. 그래서 처음부터 `textContent`를 쓰는 습관을 들여요. 확인이 끝나면 `link.textContent = video.title;`로 되돌려요.
:::

:::answer 오늘 끝 상태 전체 코드
막혔다면 아래 파일들로 맞추고 [Day 21](#/day/p1-d21)을 시작하세요. 파일을 덮어쓰면 내가 바꾼 글(닉네임, 소개 문장, 영상 ID)도 예시 글로 돌아가니 내 글은 먼저 적어 두고, 맞춘 뒤에는 커밋하고 **변경 내용 동기화**를 눌러요. `.git` 폴더는 지우지 마세요. 오늘 바뀐 파일은 `js/contents.js`(전체), `contents.html`(전체), `css/style.css`(블록 하나)예요. 파일 하나를 통째로 바꿀 때는 VS Code에서 그 파일을 열고 `Ctrl + A`로 전체를 선택한 뒤 붙여 넣고 `Ctrl + S`로 저장해요.

```text
my-creator-site/
├─ about.html
├─ contact.html
├─ contents.html
├─ index.html
├─ schedule.html
├─ css/
│  └─ style.css
├─ images/
│  ├─ logo.svg
│  ├─ profile.svg
│  ├─ thumb-game.svg
│  ├─ thumb-music.svg
│  └─ thumb-talk.svg
└─ js/
   ├─ contents.js
   └─ main.js
```

📄 C:\dev\my-creator-site\js\contents.js
```js
// ==========================================================
// contents.js - 영상 목록 페이지
// 영상 데이터로 카드를 그려요
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

// 지금 상태: 전체 영상
let allVideos = [
  { id: 'v001', title: '기타로 연주하는 신청곡', category: 'music', youtubeId: 'aqz-KE-bpKQ', date: '2026-10-27' },
  { id: 'v002', title: '신작 공포 게임 첫 도전', category: 'game', youtubeId: 'eRsGyueVLvQ', date: '2026-10-25' },
  { id: 'v003', title: '구독자 1000명 기념 Q&A', category: 'talk', youtubeId: 'R6MlUcmOul8', date: '2026-10-20' },
  { id: 'v004', title: '친구들과 협동 퍼즐 도전', category: 'game', youtubeId: 'Y-rmzh0PI3c', date: '2026-10-18' },
  { id: 'v005', title: '비 오는 날 플레이리스트', category: 'music', youtubeId: 'TLkA0RELQ1g', date: '2026-10-11' },
  { id: 'v006', title: '요즘 빠진 취미 이야기', category: 'talk', youtubeId: 'WhWc3b3KhnY', date: '2026-10-06' },
];

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

// 화면을 다시 그려요: 목록을 비우고 → 카드를 하나씩 붙여요
function render() {
  listElement.textContent = ''; // 안의 내용을 모두 비워요
  allVideos.forEach((video) => {
    listElement.appendChild(createCard(video));
  });
}

render();
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
      <nav class="site-nav">
        <ul class="menu-list">
          <li><a href="index.html">홈</a></li>
          <li><a href="about.html">소개</a></li>
          <li><a href="contents.html" aria-current="page">영상</a></li>
          <li><a href="schedule.html">방송 일정</a></li>
          <li><a href="contact.html">문의</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main class="container">
    <h1>영상 모아보기</h1>
    <p>지난 방송 영상을 모아 두는 페이지예요.</p>

    <h2>영상 목록</h2>
    <!-- 카드는 contents.js가 영상 데이터를 읽어서 여기에 그려 줘요 -->
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

`style.css`는 200줄이 넘어서 바뀐 블록만 실었어요. `5. 공통 부품` 구역의 `.card-body p { … }` 규칙 **바로 아래**, `/* ---------- 6. 페이지별 ---------- */` 주석 **위**에 넣어요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
.card-body time {
  display: block;
  color: var(--muted);
  font-size: 0.9rem;
}

.badge {
  display: inline-block;
  padding: 0 0.6rem;
  border-radius: 999px;
  background: var(--accent);
  color: var(--accent-text);
  font-size: 0.8rem;
  font-weight: 700;
}
```
:::

:::answer 오늘 끝 상태 style.css 전체
Day 14 전체본에 Day 16의 `.greeting`, 오늘의 `.card-body time`, `.badge`를 더한 파일 전체예요. 뒤처졌거나 `style.css`가 엉켰을 때 `Ctrl + A` 후 붙여 넣어 맞추세요. 맞춘 뒤에는 소스 제어에서 커밋하고 **변경 내용 동기화**를 눌러요. 내가 바꾼 색이나 값이 있다면 붙여 넣기 전에 따로 적어 둬요.

📄 C:\dev\my-creator-site\css\style.css
```css
/* ==========================================================
   style.css - 달빛곰 방송국 전체 스타일 (모든 페이지가 함께 써요)
   순서: 변수 → 기본 → 레이아웃 → 헤더/메뉴 → 공통 부품 → 페이지별 → 반응형
   모바일 먼저 만들고, 화면이 넓어지면 @media로 덧붙여요 (Day 13)
   ========================================================== */

/* ---------- 1. CSS 변수: 색은 여기서만 정해요 (Day 14, 22) ---------- */
:root {
  --bg: #ffffff;
  --surface: #f4f2ff;      /* 카드·표 머리글 배경 */
  --text: #1d1b2e;
  --muted: #5a5775;        /* 보조 글자 */
  --accent: #5b4bdb;       /* 포인트 색 (버튼, 링크) */
  --accent-text: #ffffff;  /* 포인트 색 위의 글자 */
  --link: #4a3bc7;
  --border: #d9d6ee;
  --radius: 12px;
}

/* ---------- 2. 기본 설정 (Day 9, 10) ---------- */
* {
  box-sizing: border-box; /* padding·border를 width 안에 포함해서 계산해요 */
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: system-ui, "Malgun Gothic", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
  line-height: 1.7;
  word-break: keep-all;     /* 한국어는 단어 중간에서 줄을 바꾸지 않아요 */
  overflow-wrap: break-word; /* 너무 긴 단어만 강제로 줄을 바꿔요 */
  transition: background-color 0.2s, color 0.2s; /* 테마가 바뀔 때 부드럽게 (Day 14) */
}

img {
  max-width: 100%;
  height: auto;
}

a {
  color: var(--link);
}

h1, h2, h3 {
  line-height: 1.3;
}

h1 {
  font-size: 1.75rem;
  margin: 1.5rem 0 0.75rem;
}

h2 {
  font-size: 1.35rem;
  margin: 2rem 0 0.75rem;
}

h3 {
  font-size: 1.1rem;
  margin: 0.25rem 0;
}

/* ---------- 3. 레이아웃 ---------- */
.container {
  max-width: 960px;
  margin: 0 auto;
  padding-left: 1rem; /* 좌우 여백 16px: 휴대폰에서도 글자가 가장자리에 붙지 않아요 */
  padding-right: 1rem;
}

main {
  padding-bottom: 3rem;
}

/* ---------- 4. 헤더와 내비게이션 (Day 11) ---------- */
.site-header {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

.header-inner {
  display: flex;
  flex-wrap: wrap;          /* 좁은 화면에서는 메뉴가 아래 줄로 내려가요 */
  align-items: center;
  gap: 0.5rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text);
  font-weight: 700;
  text-decoration: none;
}

.logo img {
  display: block;
  border-radius: 8px;
}

.site-nav {
  flex-basis: 100%; /* 한 줄을 다 차지해서 아래로 내려가요 */
}

.menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.menu-list a {
  display: block;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  color: var(--text);
  text-decoration: none;
}

.menu-list a:hover {
  background: var(--border);
}

/* 지금 보고 있는 페이지 표시 */
.menu-list a[aria-current="page"] {
  background: var(--accent);
  color: var(--accent-text);
  font-weight: 700;
}

/* ---------- 5. 공통 부품 ---------- */
button,
.button {
  display: inline-block;
  font: inherit;
  padding: 0.5rem 1rem;
  border: 2px solid var(--accent);
  border-radius: 999px;
  background: var(--accent);
  color: var(--accent-text);
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.15s, background-color 0.15s;
}

button:hover,
.button:hover {
  transform: translateY(-2px);
}

.button-outline {
  background: transparent;
  color: var(--text);
}

/* 카드 그리드 (Day 12): 칸 하나는 최소 240px, 남는 공간은 똑같이 나눠 가져요 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: transform 0.15s, box-shadow 0.15s;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.card img {
  display: block;
  width: 100%;
}

.card-body {
  padding: 0.75rem 1rem 1rem;
}

.card-body p {
  margin: 0.25rem 0 0;
  color: var(--muted);
}

.card-body time {
  display: block;
  color: var(--muted);
  font-size: 0.9rem;
}

.badge {
  display: inline-block;
  padding: 0 0.6rem;
  border-radius: 999px;
  background: var(--accent);
  color: var(--accent-text);
  font-size: 0.8rem;
  font-weight: 700;
}

/* ---------- 6. 페이지별 ---------- */

/* 홈: 소개 영역 */
.hero {
  display: grid;
  gap: 1.5rem;
  align-items: center;
  padding-top: 1.5rem;
  padding-bottom: 1rem;
}

.hero-image {
  width: 160px;
  border-radius: 50%;
}

.greeting {
  color: var(--muted);
  font-size: 1.1rem;
  margin: 0 0 0.5rem;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

/* 유튜브 영상: 가로 폭에 맞춰 16:9 비율을 유지해요 */
.video-frame {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 0;
  border-radius: var(--radius);
  background: var(--surface);
}

/* 소개 페이지 */
.about-intro {
  display: grid;
  gap: 1.5rem;
  align-items: start;
}

.about-image {
  width: 200px;
  border-radius: var(--radius);
}

/* 방송 일정 */
.schedule-table {
  width: 100%;
  border-collapse: collapse;
}

.schedule-table caption {
  text-align: left;
  font-weight: 700;
  padding-bottom: 0.5rem;
}

.schedule-table th,
.schedule-table td {
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--border);
  text-align: left;
}

.schedule-table thead th {
  background: var(--surface);
}

/* ---------- 7. 푸터 ---------- */
.site-footer {
  border-top: 1px solid var(--border);
  background: var(--surface);
  color: var(--muted);
  text-align: center;
  padding: 1.5rem 0;
}

.site-footer p {
  margin: 0;
}

/* ---------- 8. 반응형: 화면이 768px 이상일 때 (Day 13) ---------- */
@media (min-width: 768px) {
  h1 {
    font-size: 2.25rem;
  }

  /* 메뉴 목록은 가로로 늘어놔요 */
  .site-nav {
    flex-basis: auto;
    margin-left: auto;
  }

  .menu-list {
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
  }

  .hero {
    grid-template-columns: 200px 1fr;
    gap: 2rem;
  }

  .hero-image {
    width: 200px;
  }

  .about-intro {
    grid-template-columns: 200px 1fr;
  }
}
```
:::

## 🧯 자주 막히는 곳

여기에 없는 증상은 [문제 해결 모음](#/page/troubleshooting)에서 찾아보세요.

### Cannot set properties of null (setting 'textContent')

```text
Uncaught TypeError: Cannot set properties of null (setting 'textContent')
```

**원인:** `listElement`가 `null`이에요. 상자를 못 찾았다는 뜻이에요. 이유는 보통 둘 중 하나예요. ① `contents.html`의 `id="video-list"`와 `contents.js`의 `'#video-list'` 철자가 달라요(`#` 빠짐, 오타). ② `<script … defer>`에서 `defer`가 빠져서 HTML을 다 읽기 전에 스크립트가 실행됐어요.

**해결:**

1. `contents.html`에서 `<div id="video-list" class="card-grid"></div>`를 3단계 블록과 비교해요.
2. `contents.js`의 `document.querySelector('#video-list')`에 `#`이 있는지, 철자가 같은지 봐요.
3. `<script src="js/contents.js" defer></script>`에 `defer`가 있는지 확인해요.
4. 저장하고 브라우저 탭에서 `Ctrl + F5`로 새로 고침해서 카드가 나오면 해결이에요.

### Failed to execute 'appendChild' on 'Node': parameter 1 is not of type 'Node'.

```text
Uncaught TypeError: Failed to execute 'appendChild' on 'Node': parameter 1 is not of type 'Node'.
```

**원인:** `appendChild`에 요소가 아닌 것을 넘겼어요. `createCard`가 마지막에 `return card;`를 하지 않으면 `undefined`가 돌아와서, `listElement.appendChild(createCard(video))`가 `undefined`를 붙이려다 이 오류가 나요.

**해결:**

1. `createCard` 함수 맨 끝, `}` 바로 위에 `return card;`가 있는지 확인해요.
2. 저장하고 새로 고침해서 오류가 사라지면 해결이에요.

### 카드가 9장 나와요 (또는 12장)

**원인:** 9장이면 손으로 쓴 카드 3장을 지우지 않아서 3 + 6장이에요. 12장이면 `render()`에서 `listElement.textContent = '';`(비우기) 줄이 빠졌거나 `render()`를 두 번 불렀어요.

**해결:**

1. `contents.html`에서 `<div class="card-grid">`로 감싼 정적 카드 3장이 남아 있으면 지워요.
2. `render` 함수 첫 줄에 `listElement.textContent = '';`가 있는지 확인해요.
3. 파일 맨 끝에 `render();`가 한 줄만 있는지 확인해요. 6장이면 해결이에요.

### 썸네일 그림이 안 보여요

**원인:** `thumbnails`의 경로가 틀렸어요. 경로는 JavaScript 파일 기준이 아니라 **페이지(`contents.html`) 기준**이에요. 그래서 `images/thumb-game.svg`처럼 `images/`로 시작해야 해요. `../images/…`로 쓰면 틀려요.

**해결:**

1. `contents.js`의 `thumbnails`가 `'images/thumb-game.svg'`처럼 쓰였는지 확인해요(하이픈 `-`, 소문자).
2. 개발자 도구 **Network** 탭에서 빨간 줄(404)이 있는지 봐요. 저장하고 새로 고침해서 그림이 보이면 해결이에요.

### 제목을 눌렀는데 같은 탭에서 열려요

**원인:** `link.target = '_blank';` 줄이 빠졌어요. 이 줄이 있어야 새 탭으로 열려요.

**해결:**

1. `createCard`에 `link.target = '_blank';`와 `link.rel = 'noopener noreferrer';`가 있는지 확인해요.
2. 저장하고 새로 고침해서 제목을 눌렀을 때 새 탭이 열리면 해결이에요.

### 제목이 날짜 아래에 있거나 배지 순서가 달라요

**원인:** `appendChild` 순서가 바뀌었어요. 붙인 순서가 화면 순서예요.

**해결:**

1. `createCard`의 `body.appendChild(…)` 세 줄이 `badge` → `title` → `date` 순서인지 확인해요.
2. 저장하고 새로 고침해서 배지 → 제목 → 날짜 순서면 해결이에요.

## 📝 오늘의 체크리스트

- [ ] 영상 페이지에 카드 6장이 나오고, 배지가 `음악`·`게임`·`토크`로 보여요.
- [ ] 제목을 누르면 새 탭에서 YouTube 주소가 열려요.
- [ ] Elements에서 `#video-list` 안에 `article.card`가 6개 있어요.
- [ ] 콘솔에 빨간 오류가 0개예요.
- [ ] `contents.html`에는 카드 HTML이 없고 `#video-list` 상자만 있어요.
- [ ] `textContent`와 `innerHTML`의 차이를 설명할 수 있어요.
- [ ] 과제 1~3을 풀고 정답과 비교했어요.
- [ ] 인터넷 주소에서도 카드 6장이 나오고, GitHub 저장소에 `Day 20: DOM으로 영상 카드 그리기` 커밋이 보여요.

## 📚 더 알아보기

- [MDN · DOM 소개](https://developer.mozilla.org/ko/docs/Web/API/Document_Object_Model): DOM이 무엇이고 JavaScript가 어떻게 쓰는지 설명해요.
- [MDN · document.createElement](https://developer.mozilla.org/ko/docs/Web/API/Document/createElement): 요소를 만드는 메서드의 쓰임을 보여 줘요.
- [MDN · Element.classList](https://developer.mozilla.org/ko/docs/Web/API/Element/classList): 클래스를 붙이고 떼는 방법을 보여 줘요.

➡️ **다음 Day 예고:** [Day 21 · 이벤트](#/day/p1-d21)에서는 버튼을 누르면 반응하는 이벤트를 배워서, 좁은 화면에서 열고 닫는 `☰ 메뉴` 버튼과 영상 페이지의 카테고리 버튼을 만들어요.
