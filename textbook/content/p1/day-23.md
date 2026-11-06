## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- 영상 페이지에서 카테고리 버튼을 누르면 해당 영상 카드만 보여요.
- 검색창에 글자를 칠 때마다 제목에 그 글자가 들어 있는 영상만 보여요. 영어 대소문자와 앞뒤 빈칸은 신경 쓰지 않아요.
- 카테고리와 검색어를 함께 적용하고, 결과 개수(`영상 2개`)와 "조건에 맞는 영상이 없어요" 안내가 맞게 나와요.
- "상태 변수를 바꾸고 → `render()`가 다시 그린다"는 패턴을 설명할 수 있어요.

**예상 시간: 100분** (개념 이해 20분 · 따라하기 55분 · 과제 20분 · 정리 5분)

:::path 📂 시작 상태
어제(Day 22)까지 만든 파일이 이렇게 있어야 해요. 없거나 다르면 [Day 22](#/day/p1-d22)의 "오늘 끝 상태 전체 코드"로 맞춰 주세요.

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

### 상태 변수와 다시 그리기: 화면은 변수의 사진이에요

Day 21에서 버튼을 눌러도 카드는 그대로였어요. 이제 버튼이 `selectedCategory` 값을 바꾸면, 그 값에 맞게 카드를 다시 그리게 만들어요.

**비유:** 식당 메뉴판을 생각해 보세요. 손님이 "채식만 보여 주세요"라고 하면 직원이 메뉴판을 전부 새로 인쇄하는 게 아니라, 원본 메뉴(`allVideos`)에서 조건에 맞는 것만 골라(**걸러서**) 새 판을 보여 줘요. 원본은 그대로예요.

우리 코드는 이 구조를 따라요.

```text
상태 변수(지금 조건)
├ selectedCategory  'all'·'game'·…
└ searchText        '기타'
        │  바꾸면
        ▼
getVisibleVideos()  조건에 맞는
                    영상만 골라요
        │
        ▼
render()            비우고 → 다시 그려요
```

이벤트 리스너는 **변수만 바꾸고 `render()`를 불러요.** 그리는 일은 `render()` 한 곳에서만 해요. 카테고리를 누를 때도, 검색어를 칠 때도 같은 `render()`를 쓰기 때문에 두 조건이 자연스럽게 함께 적용돼요.

### input 이벤트: 글자를 칠 때마다

Day 21에서 `click` 이벤트를 배웠어요. 검색창에는 `input` 이벤트를 써요. **[[input 이벤트]]**(input event)는 입력칸의 값이 바뀔 때마다 일어나는 이벤트예요. 글자를 하나 칠 때, 지울 때, 붙여 넣을 때마다 일어나서 검색어를 바로바로 반영할 수 있어요. 입력칸의 현재 글자는 `input.value`로 읽어요.

```js
searchInput.addEventListener('input', () => {
  console.log(searchInput.value);
});
```

한글은 글자를 **조합하는 중에도** `input` 이벤트가 일어나요. `ㄱ` → `기` → `기ㅌ` → `기타`처럼 쓰는 동안 중간 글자로 잠깐 걸러졌다가 다 치면 맞게 걸러져요. 정상이에요.

### 문자열 메서드: 글자를 다듬고 찾는 도구

배열에 `filter`, `forEach` 같은 메서드가 있었죠(Day 19). 문자열(글자)도 기본으로 메서드를 갖고 있어요. **[[문자열 메서드]]**(string method)는 문자열이 기본으로 갖고 있는 메서드들이에요. 오늘은 세 개를 써요. 모두 **원래 글자는 그대로 두고 새 결과를 돌려줘요.**

| 메서드 | 하는 일 | 예 |
|---|---|---|
| `trim()` | 앞뒤 빈칸을 지워요 | `'  기타 '.trim()` → `'기타'` |
| `toLowerCase()` | 영어를 소문자로 바꿔요 | `'Q&A'.toLowerCase()` → `'q&a'` |
| `includes(글자)` | 그 글자가 들어 있으면 `true` | `'기타 연주'.includes('기타')` → `true` |

검색은 이 셋을 이렇게 이어서 써요. 사람이 `Q&A`, `q&a`, ` q&a `처럼 어떻게 쳐도 찾도록, **양쪽을 소문자로 맞춰서** 비교해요.

```js
const searchText = '  Q&A '.trim().toLowerCase();                  // 'q&a'
const title = '구독자 1000명 기념 Q&A'.toLowerCase();               // '구독자 1000명 기념 q&a'
console.log(title.includes(searchText));                            // true
```

두 메서드를 점으로 이어 쓰는 것(`.trim().toLowerCase()`)을 **메서드 체이닝**이라고 해요. 앞의 결과에 이어서 다음 메서드를 불러요. 검색어가 빈 글자(`''`)일 때는 `'아무 글자'.includes('')`가 항상 `true`예요. 그래서 검색창이 비어 있으면 모든 영상이 통과해요.

### hidden 속성: 있으면 숨겨요

결과가 0개일 때만 "조건에 맞는 영상이 없어요"라는 안내가 보여야 해요. 평소엔 숨겨 둬요. **[[hidden 속성]]**(hidden attribute)은 요소를 화면에서 숨기는 HTML 속성이에요. 값 없이 이름만 쓰면 돼요.

```html
<p id="empty-message" hidden>조건에 맞는 영상이 없어요.</p>
```

JavaScript에서는 `element.hidden = true`(숨김) / `false`(보임)로 켜고 꺼요. `emptyMessage.hidden = videos.length > 0;`은 "영상이 1개 이상이면 숨기고, 0개면 보여요"라는 한 줄이에요. 비교 결과(`true`/`false`)를 그대로 `hidden`에 넣었어요.

그런데 CSS에서 `display: grid`나 `display: block`처럼 `display`를 정한 요소는 `hidden` 속성이 져서 안 숨겨질 때가 있어요. 그래서 CSS에 이 규칙을 둬요.

```css
[hidden] {
  display: none !important;
}
```

`!important`는 다른 규칙이 뭐라고 하든 이 규칙이 이기게 하는 장치예요. 남용하면 코드 읽기가 어려워져서 **꼭 필요할 때만** 써요. `hidden` 속성은 "숨기라"는 뜻이 확실한 속성이라 예외로 써요.

### 검색칸 만들기: label, type="search", placeholder

Day 8에서 `label`과 `input`을 연결했죠. 검색창도 같아요. `<label for="search">제목 검색</label>`과 `<input id="search" type="search">`의 `for`와 `id`가 같아야 연결돼요.

- `type="search"`: 검색 전용 입력칸이에요. 글자를 쓰면 오른쪽에 ✕ 지우기 버튼이 나타나는 브라우저가 많아요. 그 버튼을 누르면 `input` 이벤트가 일어나서 목록이 다시 전체로 돌아와요. 정상이에요.
- `placeholder="예: 게임"`: 칸이 비었을 때 흐리게 보이는 예시 글자예요. **`label`을 대신하지 않아요.** 글자를 치기 시작하면 사라져서 무슨 칸인지 잊게 되기 때문이에요.
- `autocomplete="off"`: 브라우저가 이전 입력을 제안하지 않게 해요(Day 8). 검색창에서는 목록이 화면을 가리지 않아 편해요.

## 🛠️ 따라하기

모두 7단계예요. HTML → CSS → JavaScript 순서로, 마지막에 여러 조합을 시험해요.

### 1단계 · contents.html: 검색칸과 안내 문장 넣기 (8분)

**어디서:** VS Code → `C:\dev\my-creator-site\contents.html`

**무엇을:**

1. `<main class="container">` 줄을 찾아 줄 맨 앞을 클릭해요.
2. `Shift`를 누른 채로 `</main>` 줄 끝을 클릭해서 `<main>` 전체를 선택해요.
3. 아래 블록을 복사해서 붙여 넣고 저장해요.

📄 C:\dev\my-creator-site\contents.html (일부)
```html
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
    <p id="result-count" class="result-count"></p>
    <p id="empty-message" hidden>조건에 맞는 영상이 없어요. 다른 검색어를 써 보세요.</p>

    <!-- 카드는 contents.js가 영상 데이터를 읽어서 여기에 그려 줘요 -->
    <div id="video-list" class="card-grid"></div>

    <noscript><p class="error-box">영상 목록을 보려면 JavaScript를 켜 주세요.</p></noscript>
  </main>
```

바뀐 곳은 네 군데예요.

- 안내 문장이 `카테고리를 고르거나 제목으로 검색해 보세요.`로 바뀌었어요.
- 버튼 상자(`#category-filters`)가 `<div class="toolbar">`로 감싸지고, 그 안 끝에 검색칸(`.search-box`)이 생겼어요.
- `<h2>영상 목록</h2>` 아래에 결과 개수를 보여 줄 `<p id="result-count" class="result-count"></p>`가 생겼어요(내용은 JavaScript가 채워요. `aria-live`는 Day 24 과제에서 다뤄요).
- 빈 목록 안내 `<p id="empty-message" hidden>`가 생겼어요.

:::success
아직 CSS가 없어서 검색칸이 못생기게 보여도 괜찮아요. **영상 목록** 제목 위에 **제목 검색** 글자와 입력칸이 보여요. 칸에 글자를 쳐도 목록은 그대로예요.
:::

### 2단계 · style.css: 입력칸 모양과 숨김 규칙 (12분)

**어디서:** VS Code → `C:\dev\my-creator-site\css\style.css`

**무엇을:** 네 곳에 블록을 넣어요.

**(1) 2번 구역(기본 설정):** `img {`로 시작하는 규칙(`max-width: 100%;`이 들어 있어요)을 찾아 그 규칙 **바로 위**에 아래 블록을 붙여 넣어요(블록 끝의 빈 줄까지).

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
/* hidden 속성이 다른 display 규칙에 지지 않게 해요 */
[hidden] {
  display: none !important;
}
```

**(2) 6번 구역(페이지별):** `/* 영상 목록: 필터 + 검색 */` 주석 아래의 `.filters {` 규칙을 찾아 그 규칙 **바로 위**에 붙여 넣어요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
.toolbar {
  display: grid;
  gap: 1rem;
  margin-bottom: 1rem;
}
```

**(3) 같은 6번 구역:** `.filters { … }` 규칙이 끝나는 `}` 줄 **바로 아래**, 그리고 `/* 방송 일정 */` 주석 **바로 위**에 아래 블록을 붙여 넣어요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
.search-box label {
  display: block;
  font-weight: 700;
}

input,
select,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  padding: 0.5rem 0.75rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: var(--text);
}

input:focus,
select:focus,
textarea:focus {
  border-color: var(--accent);
}

.result-count {
  color: var(--muted);
  margin: 0 0 0.5rem;
}
```

- `input, select, textarea { … }`: 세 요소의 공통 모양이에요. `width: 100%`로 넓히고, 둥근 모서리와 테두리를 줘요. 쉼표는 "셋 다"라는 뜻이에요. 문의 폼의 입력칸도 같이 예뻐져요.
- `font: inherit;`: 글꼴을 부모에게서 그대로 이어받아요. 입력칸은 브라우저가 따로 작은 글꼴을 쓰는 게 기본이라서 맞춰 줘요.
- `:focus`: 입력칸에 커서가 있을 때 테두리를 포인트 색(`var(--accent)`)으로 바꿔요(Day 14의 의사 클래스).

**(4) 8번 구역(반응형):** 파일 맨 아래 `@media (min-width: 768px) {` 블록 안, `.about-intro { grid-template-columns: 200px 1fr; }` 규칙 **바로 아래**(블록의 마지막 `}` 앞)에 붙여 넣어요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
  .toolbar {
    grid-template-columns: 1fr minmax(240px, 320px);
    align-items: end;
  }
```

`Ctrl + S`로 저장하고 `contents.html`을 새로 고침해요.

:::success
좁은 화면에서는 카테고리 버튼 줄 아래에 **제목 검색** 칸이 둥근 모서리의 넓은 입력칸으로 보여요. 넓은 화면(768px 이상)에서는 버튼과 검색칸이 한 줄에 나란히 있어요(검색칸이 오른쪽). 칸을 클릭하면 테두리가 보라색이 돼요. 영상 목록 위에는 아직 빈 줄만 보여요. 문의 페이지의 입력칸도 같은 모양으로 바뀌었어요.
:::

### 3단계 · contents.js: 새 요소와 변수 준비하기 (7분)

**어디서:** VS Code → `C:\dev\my-creator-site\js\contents.js`

**무엇을:**

1. `const filterBox = document.querySelector('#category-filters');` 줄 **바로 아래**에 세 줄을 붙여 넣어요. 새 HTML 요소를 미리 찾아 두는 줄이에요.

📄 C:\dev\my-creator-site\js\contents.js (일부)
```js
const searchInput = document.querySelector('#search');
const countElement = document.querySelector('#result-count');
const emptyMessage = document.querySelector('#empty-message');
```

2. `// 지금 상태: 전체 영상, 선택한 카테고리` 주석을 `// 지금 상태: 전체 영상, 선택한 카테고리, 검색어`로 고쳐요.
3. `let selectedCategory = 'all';` 줄 **바로 아래**에 한 줄을 붙여 넣어요. 지금 검색어를 기억하는 변수예요. 처음엔 빈 글자예요.

```js
let searchText = '';
```

4. `Ctrl + S`로 저장해요.

### 4단계 · contents.js: 걸러서 그리기 (12분)

**어디서:** VS Code → `C:\dev\my-creator-site\js\contents.js`

**무엇을:**

1. `// 화면을 다시 그려요: 목록을 비우고 …` 주석 줄 **바로 위**에 `getVisibleVideos` 함수를 붙여 넣어요(블록 끝의 빈 줄까지).

📄 C:\dev\my-creator-site\js\contents.js (일부)
```js
// 카테고리와 검색어에 맞는 영상만 골라요 (Day 19: filter, 화살표 함수 Day 18)
function getVisibleVideos() {
  return allVideos.filter((video) => {
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchText);
    return matchesCategory && matchesSearch;
  });
}
```

- `allVideos.filter((video) => { … })`: Day 19의 `filter`예요. 콜백이 `true`를 돌려준 영상만 모아 새 배열을 만들어요. 원본 `allVideos`는 그대로예요.
- `matchesCategory`: `selectedCategory === 'all'`이거나 영상의 카테고리가 선택한 카테고리와 같으면 `true`예요(`||`는 "또는", Day 16).
- `matchesSearch`: 제목을 소문자로 바꾼 글자에 검색어가 들어 있는지예요. 검색어(`searchText`)는 입력 리스너가 이미 소문자로 만들어 두어요.
- `return matchesCategory && matchesSearch;`: 둘 다 `true`여야 통과해요(`&&`는 "그리고").

2. 지금 있는 `render` 함수(주석 포함, `function render() { … }`이 끝나는 `}`까지)를 아래 블록으로 통째로 바꿔요. 바뀐 점은 `allVideos` 대신 걸러진 `videos`를 쓰는 것, 그리고 개수 문장과 빈 목록 안내가 생긴 것이에요.

📄 C:\dev\my-creator-site\js\contents.js (일부)
```js
// 화면을 다시 그려요: 목록을 비우고 → 카드를 하나씩 붙이고 → 개수를 알려 줘요
function render() {
  const videos = getVisibleVideos();

  listElement.textContent = ''; // 안의 내용을 모두 비워요
  videos.forEach((video) => {
    listElement.appendChild(createCard(video));
  });

  countElement.textContent = `영상 ${videos.length}개`;
  emptyMessage.hidden = videos.length > 0;
}
```

- `` `영상 ${videos.length}개` ``: 템플릿 리터럴(Day 16)이에요. `videos.length`는 배열의 길이(Day 17)예요. `length`의 철자를 틀리면 `영상 undefined개`가 나와요.
- `emptyMessage.hidden = videos.length > 0;`: 영상이 1개 이상이면 `true`(숨김), 0개면 `false`(보임)예요.

3. `filterBox.addEventListener('click', …)` 리스너의 맨 아래에 있는 `console.log('선택한 카테고리:', …);` 줄(Day 21에서 임시로 둔 줄, 뒤에 `// Day 23에서 render()로 바꿔요` 주석이 붙어 있어요)을 아래 한 줄로 바꿔요. 이제 카테고리를 바꾸면 화면을 다시 그려요.

```js
  render();
```

4. `Ctrl + S`로 저장하고 `contents.html`을 새로 고침해요.

:::success
카드 6장 위에 `영상 6개`가 보여요. **게임** 버튼을 누르면 "신작 공포 게임 첫 도전"과 "친구들과 협동 퍼즐 도전" 2장만 남고 `영상 2개`로 바뀌어요. **음악**, **토크**도 눌러 봐요. 아직 검색창은 동작하지 않아요. 콘솔에 빨간 오류는 없어요.
:::

### 5단계 · contents.js: 검색창에 리스너 달기 (6분)

**어디서:** VS Code → `C:\dev\my-creator-site\js\contents.js`

**무엇을:** 파일 맨 끝의 `render();` 줄을 찾아요. 그 줄 **바로 위**(카테고리 리스너가 끝나는 `});` 줄 아래)에 아래 블록을 붙여 넣어요. 블록 위아래에 빈 줄을 하나씩 둬요. 저장하고 새로 고침해요.

📄 C:\dev\my-creator-site\js\contents.js (일부)
```js
// 검색창: 글자를 입력할 때마다 바로 걸러요 (Day 23)
searchInput.addEventListener('input', () => {
  searchText = searchInput.value.trim().toLowerCase();
  render();
});
```

- `searchInput.value`: 검색칸에 지금 적힌 글자예요.
- `.trim().toLowerCase()`: 앞뒤 빈칸을 지우고 소문자로 바꿔서 `searchText`에 담아요.
- `render();`: 바뀐 조건으로 다시 그려요. 카테고리 리스너가 `selectedCategory`를 이미 기억하고 있어서, 검색어를 칠 때도 선택한 카테고리가 함께 적용돼요.

:::success
검색칸에 `기타`를 치면 "기타로 연주하는 신청곡" 1장만 남고 `영상 1개`가 돼요. 글자를 지우면 다시 6장이 돼요.
:::

### 6단계 · 조합을 시험해 보기 (8분)

**어디서:** Live Preview 또는 파일 더블클릭으로 연 `contents.html`. (아직 `fetch`를 쓰지 않아서 두 방법 모두 돼요.)

**무엇을:** 아래 순서로 하나씩 해 보고, 표의 결과와 같은지 확인해요.

| 하는 일 | 보이는 결과 |
|---|---|
| 처음 열기 | 카드 6장, `영상 6개` |
| **게임** 누르기 | 카드 2장, `영상 2개` |
| **게임** 상태에서 `기타` 입력 | 카드 0장, `영상 0개`, 안내 문장 |
| **전체** 누르기 (`기타`가 입력된 채로) | 카드 1장 |
| 검색칸에 `q&a` 입력 | `구독자 1000명 기념 Q&A` 1장 |
| 검색칸을 모두 지우고 **전체** | 카드 6장, 안내 문장 사라짐 |
| 검색칸에 `  공포  `(앞뒤 빈칸) 입력 | `신작 공포 게임 첫 도전` 1장 |

:::success
표의 결과가 모두 같아요. 세 번째 줄에서는 카드가 하나도 없고 `영상 0개` 아래에 "조건에 맞는 영상이 없어요. 다른 검색어를 써 보세요."가 보여요. 개발자 도구 콘솔에는 빨간 오류가 없어요.
:::

### 7단계 · 커밋·푸시 (5분)

**어디서:** VS Code → 소스 제어 패널(`Ctrl + Shift + G`)

**무엇을:** **메시지** 칸에 `Day 23: 영상 필터와 검색`을 입력하고 **커밋** → **변경 내용 동기화**를 눌러요. 명령으로 한다면 VS Code 터미널(PowerShell), 위치 `C:\dev\my-creator-site`에서 아래를 한 줄씩 실행해요.

```powershell
git add .
git commit -m "Day 23: 영상 필터와 검색"
git push
```

`git commit` 예상 출력(해시와 숫자는 달라도 돼요):

```text
[main 5b7e2a4] Day 23: 영상 필터와 검색
 3 files changed, 92 insertions(+), 13 deletions(-)
```

:::success
GitHub 저장소에 `Day 23: 영상 필터와 검색` 커밋이 보이고, 소스 제어 패널의 변경은 0개예요.
:::

## ✍️ 과제

### 과제 1 · 대소문자 (쉬움 ⭐, 6분)

`getVisibleVideos` 안의 `video.title.toLowerCase()`에서 `.toLowerCase()`를 지우고 저장한 뒤, 검색칸에 `q&a`를 입력해 보세요. 왜 찾아지지 않는지 한 문장으로 적고, **꼭 원래대로 되돌리세요.**

- 확인 방법: `영상 0개`가 나와요. 되돌리면 다시 1장이 찾아져요.
- 힌트: 제목은 `Q&A`이고 검색어는 `q&a`예요. `includes`는 대소문자를 구분해요.

### 과제 2 · 빈칸 (보통 ⭐⭐, 7분)

검색어 `  공포  `(앞뒤에 빈칸)가 찾아지는 이유를 설명해 보세요. 그리고 입력 리스너의 `.trim()`을 지우면 어떻게 되는지 해 보고 되돌리세요.

- 확인 방법: `trim()`이 있을 때는 1장, 없을 때는 0장이 나와요.
- 힌트: 제목 `신작 공포 게임 첫 도전`에 `  공포  `(앞뒤 빈칸 두 개씩)라는 글자가 통째로 들어 있나요?

### 과제 3 · 카테고리 이름도 검색되게 (도전 ⭐⭐⭐, 7분)

검색어가 `게임`일 때 제목에 "게임"이 없는 영상도, 카테고리가 게임이면 나오게 하려면 `matchesSearch` 줄을 어떻게 바꿔야 할까요? 코드만 써 보고 **파일에는 넣지 않아요.**

- 확인 방법: 쓴 코드를 정답과 비교해요.
- 힌트: 영상의 카테고리 코드(`video.category`)를 한국어 이름으로 바꿔 주는 객체가 파일 위쪽에 이미 있어요(Day 19의 `categoryNames`).

## ✅ 정답

:::answer 과제 1 정답 · 대소문자
```js
const matchesSearch = video.title.toLowerCase().includes(searchText);
```

**왜 이렇게 하나요?** `.toLowerCase()`를 빼면 `'구독자 1000명 기념 Q&A'.includes('q&a')`를 비교하게 되고, 대문자 `Q&A`와 소문자 `q&a`는 다른 글자라 `false`예요. 그래서 제목과 검색어를 **둘 다** 소문자로 맞춰서 비교해요. 검색어 쪽은 입력 리스너에서 이미 `.toLowerCase()`를 했으니, 제목 쪽에서도 해야 짝이 맞아요.
:::

:::answer 과제 2 정답 · 빈칸
```js
searchText = searchInput.value.trim().toLowerCase();
```

**왜 이렇게 하나요?** 사람은 검색어 앞뒤에 빈칸을 무심코 넣어요. 제목에는 앞뒤에 빈칸이 두 개씩 붙은 `'  공포  '`라는 글자가 없으니, `trim()` 없이 비교하면 0장이에요. `trim()`이 앞뒤 빈칸을 지워서 `'공포'`로 비교하면 1장이 찾아져요. 글자 **중간**의 빈칸(`'공포 게임'`)은 `trim()`이 지우지 않아요. 중간 빈칸은 제목에 있으면 찾아지고 없으면 안 찾아져요.
:::

:::answer 과제 3 정답 · 카테고리 이름도 검색되게
```js
const matchesSearch =
  video.title.toLowerCase().includes(searchText) ||
  categoryNames[video.category].includes(searchText);
```

**왜 이렇게 하나요?** `categoryNames[video.category]`는 대괄호 표기(Day 19)로 `video.category`가 `'game'`이면 `'게임'`을 꺼내요. `||`로 "제목에 있거나 카테고리 이름에 있거나"를 만들어요. 카테고리 이름은 원래 한국어라서 소문자 변환이 필요 없어요. 단, 검색어가 빈 글자일 때 `'게임'.includes('')`도 `true`라서 전체가 보이는 것은 이전과 같아요. 이 코드는 끝 상태에는 넣지 않아요.
:::

:::answer 오늘 끝 상태 전체 코드
막혔다면 아래 코드로 내 파일을 맞추고 다음 Day를 시작해요. `contents.html`과 `contents.js`는 파일 전체를, `style.css`는 바뀐 블록만 위치와 함께 실었어요.

```text
my-creator-site/
├─ css/
│  └─ style.css ✎
├─ images/
│  ├─ logo.svg
│  ├─ profile.svg
│  ├─ thumb-game.svg
│  ├─ thumb-music.svg
│  └─ thumb-talk.svg
├─ js/
│  ├─ contents.js ✎
│  └─ main.js
├─ about.html
├─ contact.html
├─ contents.html ✎
├─ index.html
└─ schedule.html
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
    <p id="result-count" class="result-count"></p>
    <p id="empty-message" hidden>조건에 맞는 영상이 없어요. 다른 검색어를 써 보세요.</p>

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

📄 C:\dev\my-creator-site\js\contents.js
```js
// ==========================================================
// contents.js - 영상 목록 페이지
// 영상 데이터를 카드로 그리고, 카테고리 버튼과 검색창으로 걸러서 보여 줘요.
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

// 지금 상태: 전체 영상, 선택한 카테고리, 검색어
let allVideos = [
  { id: 'v001', title: '기타로 연주하는 신청곡', category: 'music', youtubeId: 'aqz-KE-bpKQ', date: '2026-10-27' },
  { id: 'v002', title: '신작 공포 게임 첫 도전', category: 'game', youtubeId: 'eRsGyueVLvQ', date: '2026-10-25' },
  { id: 'v003', title: '구독자 1000명 기념 Q&A', category: 'talk', youtubeId: 'R6MlUcmOul8', date: '2026-10-20' },
  { id: 'v004', title: '친구들과 협동 퍼즐 도전', category: 'game', youtubeId: 'Y-rmzh0PI3c', date: '2026-10-18' },
  { id: 'v005', title: '비 오는 날 플레이리스트', category: 'music', youtubeId: 'TLkA0RELQ1g', date: '2026-10-11' },
  { id: 'v006', title: '요즘 빠진 취미 이야기', category: 'talk', youtubeId: 'WhWc3b3KhnY', date: '2026-10-06' },
];
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

render();
```

`C:\dev\my-creator-site\css\style.css`에는 네 블록을 넣어요.

1. 2번 구역의 `img {` 규칙 바로 위에 넣어요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
/* hidden 속성이 다른 display 규칙에 지지 않게 해요 */
[hidden] {
  display: none !important;
}
```

2. 6번 구역의 `.filters {` 규칙 바로 위에 넣어요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
.toolbar {
  display: grid;
  gap: 1rem;
  margin-bottom: 1rem;
}
```

3. 6번 구역에서 `.filters { … }` 규칙 바로 아래, `/* 방송 일정 */` 주석 바로 위에 넣어요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
.search-box label {
  display: block;
  font-weight: 700;
}

input,
select,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  padding: 0.5rem 0.75rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: var(--text);
}

input:focus,
select:focus,
textarea:focus {
  border-color: var(--accent);
}

.result-count {
  color: var(--muted);
  margin: 0 0 0.5rem;
}
```

4. 8번 구역 `@media (min-width: 768px) {` 블록의 `.about-intro` 규칙 바로 아래에 넣어요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
  .toolbar {
    grid-template-columns: 1fr minmax(240px, 320px);
    align-items: end;
  }
```
:::

## 🧯 자주 막히는 곳

여기에 없는 증상은 [문제 해결 모음](#/page/troubleshooting)에서 찾아보세요.

### 검색창에 쳐도 목록이 그대로예요

**원인:** 세 가지가 흔해요. ① `document.querySelector('#search')`의 `#search`가 HTML의 `id="search"`와 철자가 달라요. ② 입력 리스너 안에서 `render();`를 부르지 않았어요. ③ 리스너를 `'input'`이 아니라 다른 이름(`'Input'`, `'onInput'`)으로 달았어요.

**해결:** 콘솔(Console)에 빨간 오류가 있는지 먼저 봐요. 없다면 리스너 안에 `console.log(searchInput.value);`를 잠깐 넣어서 글자를 칠 때마다 찍히는지 확인하고, 찍히면 `render();`가 있는지 봐요. 확인이 끝나면 `console.log` 줄은 지워요.

### 카테고리를 누르면 검색어가 사라진 것처럼 보여요

**원인:** 검색어를 `searchText` 변수에 남기지 않고 `getVisibleVideos` 안에서 매번 `searchInput.value`를 직접 읽거나, 변수 이름을 틀렸을 가능성이 있어요. 두 조건이 함께 적용되려면 둘 다 변수(상태)에 기억되어 있어야 해요.

**해결:** `contents.js` 위쪽에 `let searchText = '';`가 있고, 입력 리스너가 `searchText = …`로 값을 바꾸는지 확인해요.

### 빈 목록 안내가 늘 보이거나 아예 안 보여요

**원인:** `[hidden] { display: none !important; }` 규칙이 `style.css`에 없거나, `emptyMessage.hidden = videos.length > 0;`의 `>`가 반대(`<`)로 되어 있어요.

**해결:** 개발자 도구 **Elements**에서 `<p id="empty-message">`를 찾아 `hidden` 속성이 붙었다 떨어지는지 봐요. 붙는데도 보인다면 CSS의 `[hidden]` 규칙을 확인하고, 반대로 동작한다면 `>` 방향을 확인해요.

### 영상 undefined개 라고 나와요

**원인:** `countElement.textContent = `영상 ${videos.length}개`;`에서 `length` 철자가 틀렸어요(`lenght`, `Length`). 자바스크립트는 없는 이름을 읽으면 오류 대신 `undefined`를 줘요.

**해결:** `videos.length`를 소문자로 정확히 쓰고 저장해요.

### Includes is not a function 같은 오류가 나요

```text
Uncaught TypeError: video.title.toLowerCase(...).Includes is not a function
```

**원인:** 메서드 이름은 대소문자를 구분해요. `Includes`, `tolowercase`, `toLowercase`는 없는 이름이에요.

**해결:** `includes`, `toLowerCase`, `trim`처럼 정확한 철자를 써요. 오류 문장에 이름이 그대로 나오니 그것과 코드를 비교해요.

### 한글을 칠 때 중간 글자로 걸러져요

**원인:** `input` 이벤트는 한글을 조합하는 중에도 일어나서, `기타`를 치는 도중 `기`까지만 입력된 상태로 걸러져요.

**해결:** 정상 동작이에요. 다 치면 맞게 걸러져요. 실제 서비스도 같은 현상이 있고 지연(디바운스) 같은 방법을 쓰는데, 이 교재에서는 다루지 않아요.

## 📝 오늘의 체크리스트

- [ ] 영상 페이지를 열면 `영상 6개`와 카드 6장이 보여요
- [ ] **게임**을 누르면 카드 2장과 `영상 2개`가 돼요
- [ ] 검색창에 `기타`를 치면 카드 1장이 남아요
- [ ] 게임 + `기타`일 때 `영상 0개`와 안내 문장이 보여요
- [ ] `q&a`로 `구독자 1000명 기념 Q&A`가 찾아져요
- [ ] 전체 + 빈 검색일 때 6장으로 돌아와요
- [ ] `trim`, `toLowerCase`, `includes`가 각각 무엇을 하는지 말할 수 있어요
- [ ] 과제 1~3을 하고 정답과 비교했어요, 과제 1·2에서 바꾼 코드는 되돌렸어요
- [ ] GitHub에 `Day 23` 커밋이 보여요

## 📚 더 알아보기

- [MDN — input 이벤트](https://developer.mozilla.org/ko/docs/Web/API/Element/input_event): 입력칸의 값이 바뀔 때마다 일어나는 `input` 이벤트를 설명해요.
- [MDN — String.prototype.includes()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/includes): 문자열에 글자가 들어 있는지 확인하는 방법이에요.
- [MDN — hidden 전역 속성](https://developer.mozilla.org/ko/docs/Web/HTML/Reference/Global_attributes/hidden): `hidden` 속성의 동작과 주의점이에요.

➡️ **다음 Day 예고:** [Day 24 · 폼 검증](#/day/p1-d24)에서는 문의 폼을 검사해서 틀린 칸 아래에 빨간 안내 문장을 보여 주고, 모두 맞으면 성공 메시지를 보여 줘요.
