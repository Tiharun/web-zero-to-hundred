## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- 휴대폰처럼 좁은 화면에서 **☰ 메뉴** 버튼을 눌러 메뉴 목록을 열고 닫을 수 있어요.
- 영상 페이지의 카테고리 버튼을 누르면 누른 버튼만 보라색으로 채워지고, 콘솔에 내가 고른 카테고리가 찍혀요.
- `addEventListener`로 "누르면 이 코드를 실행해요"라고 연결하고, 버튼이 여러 개여도 리스너 하나로 처리하는 **이벤트 위임**을 설명할 수 있어요.
- `.site-nav.open`과 `.site-nav .open`이 왜 다른지 말할 수 있어요.

**예상 시간: 110분** (개념 이해 25분 · 따라하기 60분 · 과제 20분 · 정리 5분)

:::path 📂 시작 상태
어제(Day 20)까지 만든 파일이 이렇게 있어야 해요. 없거나 다르면 [Day 20](#/day/p1-d20)의 "오늘 끝 상태 전체 코드"로 맞춰 주세요.

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

지금까지 만든 페이지는 열 때 한 번 그려지고 끝이었어요. 누를 수 있는 것은 링크뿐이었죠. 오늘부터는 사람이 **하는 일**(누르기, 입력하기)에 페이지가 반응하게 만들어요. 이 반응을 만드는 도구가 이벤트예요.

### 이벤트와 이벤트 리스너: 초인종과 벨 소리

**비유:** 현관 초인종을 떠올려 보세요. 누가 초인종을 누르면(일어난 일) 집 안에서 벨이 울려요(반응). 집주인은 "초인종이 눌리면 이 벨을 울려요"라고 **미리 연결**해 둔 거예요. 누가 올지, 언제 올지는 몰라도 연결만 해 두면 돼요.

**정확한 정의:**

- **[[이벤트]]**(event)는 웹페이지에서 일어나는 일이에요. 버튼 누르기(`click`), 글자 입력(`input`), 폼 보내기(`submit`)가 모두 이벤트예요.
- **[[이벤트 리스너]]**(event listener)는 "이 요소에서 이 이벤트가 일어나면 이 함수를 실행해요"라고 미리 걸어 두는 장치예요. 이름 그대로 이벤트를 "듣고 있다가" 반응해요.

리스너는 `addEventListener`로 걸어요. 모양은 이래요.

```js
button.addEventListener('click', () => {
  console.log('눌렸어요');
});
```

한 줄씩 읽어 볼게요.

- `button`: 반응을 걸 요소예요. 보통 `document.querySelector`로 미리 찾아 둔 변수예요(Day 20).
- `.addEventListener(`: "리스너를 추가해요"라는 뜻의 메서드예요.
- `'click'`: 어떤 이벤트를 들을지 정한 이름이에요. 반드시 **영어 소문자**로 써요. `'Click'`이나 `'onclick'`이라고 쓰면 아무 일도 일어나지 않아요.
- `() => { … }`: 이벤트가 날 때 실행할 함수(**콜백**)예요. Day 19에서 배운 것처럼 "나중에 불러 주세요" 하고 맡기는 함수예요. 이벤트가 날 때마다 불러요. 한 번만 실행되는 게 아니에요.

콜백은 괄호 안에 `event`라는 값을 받을 수 있어요. 이벤트에 대한 정보가 담긴 객체(Day 19)예요. 그중 `event.target`은 **실제로 누른 요소**예요.

```js
document.addEventListener('click', (event) => {
  console.log(event.target);
});
```

:::warn 콜백 자리에 괄호를 붙이면 안 돼요
`button.addEventListener('click', toggleMenu());`처럼 함수 이름 뒤에 `()`를 붙이면 리스너를 걸 때 **바로 실행**돼요. 누를 때가 아니에요. 나중에 불러야 하니 `toggleMenu`(괄호 없이)나 `() => { toggleMenu(); }`처럼 써요. 내일(Day 26)의 `setInterval`에서도 똑같이 나와요.
:::

### 복합 선택자: 빈칸 하나가 뜻을 바꿔요

CSS 선택자를 **빈칸 없이** 붙여 쓰면 조건이 "그리고"가 돼요. 이런 선택자를 **[[복합 선택자]]**(compound selector)라고 불러요.

```text
.site-nav.open
→ site-nav 클래스와 open 클래스를
  둘 다 가진 요소 하나

.site-nav .open
→ site-nav 안쪽에 있는
  open 클래스 요소
```

두 번째 `.site-nav .open`은 Day 10에서 배운 자손 선택자예요. 빈칸 하나 차이로 전혀 다른 요소를 가리켜요. 오늘은 `<nav class="site-nav open">`이 되는 순간에만 메뉴가 보이게 해야 하니 빈칸 없는 쪽(`.site-nav.open`)을 써요. `tr.today`(Day 26), `.form-status.is-error`(Day 24)도 같은 방식이에요.

### 햄버거 메뉴: 좁은 화면에서만 열리는 서랍

**비유:** 방이 좁으면 물건을 서랍에 넣어 두고 필요할 때만 열죠. 좁은 휴대폰 화면도 메뉴 다섯 개를 항상 펼쳐 두면 본문이 밀려나요. 그래서 평소에는 서랍(메뉴 목록)을 닫아 두고, 손잡이(버튼)를 누르면 열어요.

**정확한 정의:** **[[햄버거 메뉴]]**(hamburger menu)는 좁은 화면에서 메뉴를 숨겨 두고 버튼을 눌러 펼치는 방식이에요. 버튼의 `☰` 모양이 햄버거를 닮아서 이렇게 불러요.

우리 사이트의 햄버거 메뉴는 네 가지가 같이 움직여요.

1. **CSS:** 좁은 화면에서 메뉴(`.site-nav`)를 `display: none`으로 숨겨요. 넓은 화면(768px 이상)에서는 반대로 버튼을 숨기고 메뉴를 보여 줘요.
2. **클래스:** 버튼을 누르면 JavaScript가 메뉴에 `open` 클래스를 붙이고 떼요. `.site-nav.open`일 때만 `display: block`이라서 보여요.
3. **`classList.toggle('open')`:** Day 20에서 `classList.add`와 `remove`를 배웠죠. `toggle`은 "없으면 붙이고, 있으면 떼요"를 한 번에 해요. 그리고 **결과를 돌려줘요.** 붙였으면 `true`, 뗐으면 `false`예요.
4. **ARIA:** 화면을 눈으로 보지 못하는 사람은 스크린 리더가 "메뉴 버튼, 접힘"처럼 읽어 줘요. 이를 위해 `aria-expanded="false"`(접힘) 또는 `"true"`(펼침)를 버튼에 둬요(Day 11의 ARIA 속성이에요). `aria-controls="site-nav"`는 "이 버튼이 조종하는 대상은 `id`가 `site-nav`인 요소예요"라는 연결이고, 메뉴에는 `aria-label="주 메뉴"`로 이름을 붙여요.

`aria-expanded`의 값은 글자 `"true"`/`"false"`여야 해서, `toggle`이 돌려준 불리언(`true`/`false`)을 `String()`(Day 15)으로 글자로 바꿔서 넣어요.

### data 속성: HTML에 내 데이터를 붙여 두기

버튼 4개(전체·게임·토크·음악)를 눌렀을 때 코드가 "어느 카테고리 버튼인지" 알아야 해요. 버튼 글자(`게임`)를 그대로 읽을 수도 있지만, 글자를 `게임 영상`으로 바꾸는 순간 코드가 망가져요. 그래서 글자와 별개로 내 데이터를 붙여 둬요.

**[[data 속성]]**(data attribute)은 `data-`로 시작하는 이름을 가진 속성이에요. 이름 뒤쪽은 내가 정해요.

```html
<button type="button" data-category="game">게임</button>
```

JavaScript에서는 `button.dataset.category`로 읽어요. `data-` 뒤의 이름이 `dataset.` 뒤에 그대로 와요. 철자가 한 글자라도 다르면(`data-catagory`) `undefined`가 나와요(Day 15의 자료형이에요).

### 이벤트 위임: 반장에게만 말하기

**비유:** 반 학생 30명에게 "청소 시작!"을 일일이 말하는 대신, 반장 한 명에게만 말하고 "누가 손을 들면 그 학생이 누구인지 알려 줘요"라고 부탁하면 돼요. 학생이 31명으로 늘어도 반장에게 말하는 일은 그대로예요.

**정확한 정의:** **[[이벤트 위임]]**(event delegation)은 자식 요소마다 리스너를 다는 대신, 자식들을 감싼 부모 하나에만 리스너를 달고 "실제로 어느 자식이 눌렸는지"를 코드로 알아내는 방법이에요. 자식에서 일어난 클릭이 바깥 부모에게도 전해지기 때문에 가능해요.

어느 자식인지는 `event.target.closest('button')`으로 알아내요. `closest`는 "누른 곳에서부터 바깥쪽으로 올라가며 가장 가까운 `button`을 찾아요"라는 뜻이에요. 버튼 위(또는 버튼 안의 글자)를 눌렀다면 그 버튼이 나오고, 버튼 사이의 빈 곳을 눌렀다면 찾지 못해서 `null`이 나와요. `null`이면 할 일이 없으니 일찍 `return`으로 빠져나가요(Day 18의 이른 return이에요).

:::info 실무에서는
버튼이 4개라면 리스너를 4개 달아도 큰 차이가 없어요. 하지만 상품 목록 100개, 채팅 메시지처럼 **나중에 JavaScript가 새로 만드는 요소**는 만들 때마다 리스너를 달기 번거로워요. 이벤트 위임은 부모에 한 번만 걸면 나중에 생기는 자식도 처리해서, 실무 코드에 아주 흔해요. 오늘은 버튼 4개로 원리를 익혀요.
:::

## 🛠️ 따라하기

모두 7단계예요. 1~4단계는 모바일 메뉴, 5~6단계는 카테고리 버튼, 7단계는 확인과 커밋이에요. 일부러 **HTML → CSS → JavaScript** 순서로 해서, 단계마다 화면이 조금씩 바뀌는 것을 눈으로 확인해요.

### 1단계 · index.html 머리글에 메뉴 버튼 넣기 (8분)

메뉴 버튼은 HTML에 먼저 있어야 해요. JavaScript는 "있는 버튼"에 반응을 거는 것이라서, 버튼이 없는 페이지에 JavaScript를 연결하면 오류가 나요(🧯에서 다뤄요). 그래서 오늘은 **다섯 페이지 모두에 버튼을 먼저** 넣고 나서 JavaScript를 고쳐요.

**어디서:** VS Code → 왼쪽 탐색기(`Ctrl + Shift + E`) → `index.html` 더블클릭

**무엇을:**

1. 파일 위쪽에서 `<header class="site-header">` 줄을 찾아요. 그 줄 맨 앞을 클릭해요.
2. 키보드 `Shift`를 누른 채로 `</header>` 줄 맨 끝을 클릭해요. 머리글 전체가 선택돼요.
3. 아래 블록의 오른쪽 위 **복사** 버튼을 눌러 복사하고, 선택된 상태에서 `Ctrl + V`로 붙여 넣어요. 선택한 머리글이 새 머리글로 바뀌어요.
4. `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\index.html (일부)
```html
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
          <li><a href="index.html" aria-current="page">홈</a></li>
          <li><a href="about.html">소개</a></li>
          <li><a href="contents.html">영상</a></li>
          <li><a href="schedule.html">방송 일정</a></li>
          <li><a href="contact.html">문의</a></li>
        </ul>
      </nav>
    </div>
  </header>
```

바뀐 곳은 두 군데예요. 나머지는 그대로예요.

- 로고 링크(`<a class="logo" …>`) 다음에 **주석과 `<button>`** 이 새로 생겼어요. 주석은 "이 버튼은 모바일에서만 보이고, `main.js`가 `aria-expanded` 값을 바꿔요"라는 설명이에요.
- `<nav class="site-nav">`가 `<nav id="site-nav" class="site-nav" aria-label="주 메뉴">`가 됐어요. `id="site-nav"`는 버튼의 `aria-controls="site-nav"`와 JavaScript의 `#site-nav`가 찾는 이름이에요.

:::warn 사이트 이름을 바꿨다면
`달빛곰 방송국` 글자를 내 사이트 이름으로 바꿨다면, 붙여 넣은 뒤 그 글자만 다시 내 이름으로 고쳐요. `id`, `class`, 파일 이름은 바꾸지 않아요. 뒤의 코드가 이 이름으로 요소를 찾아요.
:::

**어디서:** Live Preview 또는 파일 더블클릭으로 연 `index.html`

:::success
로고 옆(좁은 화면에서는 로고 오른쪽)에 보라색 알약 모양의 **☰ 메뉴** 버튼이 새로 보이고, 메뉴 목록(홈·소개·영상·방송 일정·문의)은 그대로 보여요. 버튼을 눌러도 아직 아무 일도 일어나지 않아요. JavaScript를 아직 안 썼기 때문이에요.
:::

### 2단계 · 나머지 네 페이지에 같은 머리글 붙이기 (10분)

다섯 페이지는 머리글이 똑같아요. 방금 고친 `index.html`의 머리글을 복사해서 나머지 네 파일에 붙여 넣어요. 한 가지만 달라요. 지금 보고 있는 페이지의 메뉴 항목에만 `aria-current="page"`가 있어야 해요(Day 11).

**어디서:** VS Code → `index.html`, 그다음 `about.html`, `contents.html`, `schedule.html`, `contact.html`

**무엇을:**

1. `index.html`에서 `<header class="site-header">`부터 `</header>`까지 선택하고 `Ctrl + C`로 복사해요.
2. `about.html`을 열고 같은 방법으로 머리글 전체를 선택한 뒤 `Ctrl + V`로 붙여 넣어요.
3. 붙여 넣은 머리글에서 `aria-current="page"`를 홈(`<li><a href="index.html" aria-current="page">홈</a></li>`)에서 지우고, 그 페이지의 메뉴 항목에 옮겨 붙여요. 표를 참고하세요.
4. `Ctrl + S`로 저장해요.
5. `contents.html`, `schedule.html`, `contact.html`도 2~4번과 똑같이 해요.

| 파일 | `aria-current="page"`를 붙일 메뉴 항목 |
|---|---|
| `about.html` | `소개` 항목 |
| `contents.html` | `영상` 항목 |
| `schedule.html` | `방송 일정` 항목 |
| `contact.html` | `문의` 항목 |

예를 들어 `about.html`에서는 이렇게 되어야 해요.

```html
<li><a href="index.html">홈</a></li>
<li><a href="about.html" aria-current="page">소개</a></li>
```

**어디서:** 다섯 페이지를 각각 열어 봐요(Live Preview에서 메뉴로 이동하거나, 탐색기에서 더블클릭).

:::success
다섯 페이지 모두에 **☰ 메뉴** 버튼이 보여요. 각 페이지에서 보라색으로 채워진 메뉴 항목은 그 페이지 하나뿐이에요. 한 페이지에서 두 항목이 채워졌다면 `aria-current="page"`가 두 군데에 남은 거예요. 하나만 남기세요.
:::

### 3단계 · style.css: 좁은 화면에서 메뉴 숨기기 (12분)

이제 CSS로 "좁으면 메뉴를 숨기고, 넓으면 버튼을 숨긴다"를 만들어요. `style.css`는 줄이 많아서 구역 주석(`/* ---------- 4. … ---------- */`)을 길잡이로 써요. `Ctrl + F`로 찾으면 빨라요.

**어디서:** VS Code → `C:\dev\my-creator-site\css\style.css`

**무엇을:** 세 곳을 고쳐요.

**(1) 4번 구역(헤더와 내비게이션):** `.site-nav {`로 시작하는 규칙(안에 `flex-basis: 100%;` 한 줄이 있어요)을 찾아서, 그 규칙 전체를 아래 블록으로 바꿔요. 새 블록은 `.menu-toggle`, `.site-nav`, `.site-nav.open` 세 규칙이에요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
/* 모바일: 메뉴 버튼은 보이고, 메뉴 목록은 숨겨져 있어요 */
.menu-toggle {
  margin-left: auto;
}

.site-nav {
  display: none;
  flex-basis: 100%; /* 한 줄을 다 차지해서 아래로 내려가요 */
}

.site-nav.open {
  display: block; /* main.js가 open 클래스를 붙이면 보여요 */
}
```

- `.menu-toggle { margin-left: auto; }`: 버튼을 오른쪽 끝으로 밀어요.
- `.site-nav`에 `display: none;`이 생겼어요. 좁은 화면에서는 메뉴가 숨어요.
- `.site-nav.open { display: block; }`: 빈칸 없는 복합 선택자예요. `open` 클래스가 붙으면 다시 보여요.

**(2) 5번 구역(공통 부품):** `.button-outline {`로 시작하는 규칙을 찾아서 아래로 바꿔요. 선택자가 둘로 늘고, 두 선택자가 같은 모양을 나눠 써요(쉼표는 "둘 다"라는 뜻이에요). 메뉴 버튼이 보라색으로 꽉 찬 모양 대신 테두리만 있는 모양이 돼요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
.button-outline,
.menu-toggle {
  background: transparent;
  color: var(--text);
}
```

**(3) 8번 구역(반응형):** 파일 맨 아래쪽 `@media (min-width: 768px) {`로 시작해서 파일 끝의 `}`로 끝나는 블록 전체를 선택해요. 아래 블록으로 통째로 바꿔요. 지난 Day 13에서 만든 모양에서 바뀐 것은 세 가지뿐이에요. 주석 문장이 "메뉴 버튼은 숨기고, …"로 바뀌었고, `.menu-toggle { display: none; }`이 새로 생겼고, `.site-nav`에 `display: block;`이 맨 앞에 생겼어요. 넓은 화면(768px 이상)에서는 이 규칙들이 위의 `display: none`을 이겨서 메뉴가 항상 보이고 버튼은 사라져요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
@media (min-width: 768px) {
  h1 {
    font-size: 2.25rem;
  }

  /* 메뉴 버튼은 숨기고, 메뉴 목록은 가로로 늘어놔요 */
  .menu-toggle {
    display: none;
  }

  .site-nav {
    display: block;
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

`Ctrl + S`로 저장해요.

**어디서:** Edge(또는 Chrome)에서 연 `index.html` → `F12` → 개발자 도구 왼쪽 위의 **기기 모드** 아이콘(휴대폰과 태블릿이 겹친 모양, `Ctrl + Shift + M`)

**무엇을:** 화면 위쪽 막대에서 크기를 **Responsive**(반응형)로 두고 가로 폭 칸에 `360`을 입력해요. Live Preview의 미리 보기 창에서는 개발자 도구가 열리지 않으니, 미리 보기 창 위쪽 주소 칸의 주소(`http://127.0.0.1:3000/index.html`, 숫자는 달라도 돼요)를 복사해서 Edge 주소창에 붙여 열어요. 파일을 더블클릭해서 열었다면 이미 브라우저이니 그대로 `F12`를 눌러요.

:::success
폭 360px에서는 로고와 오른쪽 끝의 **☰ 메뉴** 버튼만 보이고, 메뉴 목록은 숨었어요(버튼을 눌러도 아직 열리지 않아요). 폭을 800 이상으로 넓히면 버튼이 사라지고 메뉴가 오른쪽에 가로로 나란히 보여요.
:::

### 4단계 · main.js: 버튼을 누르면 메뉴 열고 닫기 (10분)

이제 JavaScript로 버튼에 리스너를 달아요. 이 코드는 `main.js` 안에서 "모바일 메뉴" 구역이 돼요. `main.js`는 다섯 페이지가 모두 불러오기 때문에, 2단계에서 모든 페이지에 버튼을 넣어 둔 거예요.

**어디서:** VS Code → `C:\dev\my-creator-site\js\main.js`

**무엇을:**

1. 파일 맨 위 머리 주석 상자 안에서 `// 3) 시간대별 인사말` 줄을 찾아 아래 한 줄로 바꿔요.

```text
// 1) 모바일 메뉴 열기/닫기  3) 시간대별 인사말
```

2. `// ---------- 3. 시간대별 인사말 (Day 16) ----------` 줄을 찾아요. 그 줄 **바로 위**에 아래 블록을 붙여 넣어요. 블록 끝의 빈 줄까지 포함해서 붙이면 구역 사이가 깔끔해요.

📄 C:\dev\my-creator-site\js\main.js (일부)
```js
// ---------- 1. 모바일 메뉴 (Day 21) ----------
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('#site-nav');

menuToggle.addEventListener('click', () => {
  // classList.toggle: open 클래스가 없으면 붙이고(true), 있으면 떼요(false)
  const isOpen = siteNav.classList.toggle('open');
  // 스크린 리더가 메뉴가 열렸는지 알 수 있게 aria-expanded도 같이 바꿔요
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
```

3. `Ctrl + S`로 저장해요.

코드를 읽어 봐요.

- `const menuToggle = document.querySelector('.menu-toggle');`: 버튼을 찾아 변수에 담아요. 클래스를 찾을 때는 `.`, id는 `#`예요(Day 9).
- `siteNav`: 메뉴(`id="site-nav"`)예요.
- `menuToggle.addEventListener('click', () => { … });`: 버튼을 누를 때마다 `{ … }` 안이 실행돼요.
- `const isOpen = siteNav.classList.toggle('open');`: 메뉴에 `open` 클래스를 붙이거나 떼고, 붙였으면 `true`를 `isOpen`에 담아요.
- `menuToggle.setAttribute('aria-expanded', String(isOpen));`: 버튼의 `aria-expanded` 값을 `"true"` 또는 `"false"`로 바꿔요. `setAttribute('이름', '값')`은 HTML 속성을 JavaScript로 바꾸는 메서드예요.

**어디서:** 폭 360px로 연 `index.html` (3단계에서 쓴 Edge 창을 새로 고침 `F5`)

**무엇을:** **☰ 메뉴** 버튼을 한 번 클릭하고, 한 번 더 클릭해요.

:::success
첫 클릭에 메뉴 목록(홈·소개·영상·방송 일정·문의, 다크 모드 버튼은 내일 생겨요)이 로고 아래로 펼쳐져요. 두 번째 클릭에 다시 접혀요. 개발자 도구 **Elements** 패널에서 `<button class="menu-toggle" …>`를 보고 있으면 `aria-expanded`가 `"true"`와 `"false"`로 바뀌고, `<nav>`에 `open`이 붙었다 떨어져요. 다섯 페이지를 모두 열어 봐도 콘솔(Console)에 빨간 오류가 없어요. 오류가 있다면 아래 🧯의 "Uncaught TypeError: Cannot read properties of null (reading 'addEventListener')" 항목을 보세요.
:::

### 5단계 · contents.html: 카테고리 버튼 만들기 (8분)

영상 목록 위에 버튼 4개(전체·게임·토크·음악)를 놓아요. 버튼마다 `data-category`로 어느 카테고리인지 적어 두고, 지금 선택된 버튼은 `aria-pressed="true"`로 표시해요. `aria-pressed`는 "눌린 상태인 토글 버튼"이라는 뜻의 ARIA 속성이에요.

**어디서:** VS Code → `C:\dev\my-creator-site\contents.html`

**무엇을:** `<h2>영상 목록</h2>` 줄을 찾아요. 그 줄 **바로 위**에 아래 블록을 붙여 넣고(블록 끝의 빈 줄까지), 저장해요.

📄 C:\dev\my-creator-site\contents.html (일부)
```html
    <!-- 버튼 4개를 감싼 상자 하나에만 클릭 이벤트를 달아요 (이벤트 위임, Day 21) -->
    <div id="category-filters" class="filters" role="group" aria-label="카테고리 선택">
      <button type="button" data-category="all" aria-pressed="true">전체</button>
      <button type="button" data-category="game" aria-pressed="false">게임</button>
      <button type="button" data-category="talk" aria-pressed="false">토크</button>
      <button type="button" data-category="music" aria-pressed="false">음악</button>
    </div>
```

- `role="group"`과 `aria-label="카테고리 선택"`: 스크린 리더에게 "이 버튼들은 한 묶음이고 이름은 카테고리 선택이에요"라고 알려 줘요.
- `data-category` 값은 `all`, `game`, `talk`, `music`이에요. `contents.js`의 `categoryNames`·`thumbnails` 객체 키(`game`, `talk`, `music`)와 같아서, Day 23에 이 값으로 영상을 걸러요.
- 버튼에 `type="button"`을 쓴 이유: 폼 안에서는 버튼이 "보내기"로 동작할 수 있어서, 아니라고 분명히 해 두는 습관이에요.

이제 버튼 모양도 만들어요. **어디서:** `C:\dev\my-creator-site\css\style.css`

**무엇을:** 두 곳을 고쳐요.

**(1) 5번 구역:** 3단계에서 고친 `.button-outline, .menu-toggle {` 규칙을 아래로 바꿔요. 선택자에 `.filters button`이 더해지고, 눌린 버튼(`aria-pressed="true"`)을 보라색으로 채우는 규칙이 생겨요. 이 선택자는 Day 11에서 배운 속성 선택자예요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
.button-outline,
.menu-toggle,
.filters button {
  background: transparent;
  color: var(--text);
}

.filters button[aria-pressed="true"] {
  background: var(--accent);
  color: var(--accent-text);
}
```

**(2) 6번 구역:** `/* 방송 일정 */` 주석 줄을 찾아서, 그 줄 **바로 위**에 아래 블록을 붙여 넣어요(블록 끝의 빈 줄 포함).

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
/* 영상 목록: 필터 + 검색 */
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
```

저장한 뒤 `contents.html`을 새로 고침해요.

:::success
**영상 목록** 제목 위에 **전체**(보라색으로 채워짐), **게임**, **토크**, **음악** 버튼이 한 줄로 보여요(좁은 화면에서는 줄이 바뀔 수 있어요). 버튼을 눌러도 아직 반응은 없고, 카드 6장은 그대로예요.
:::

### 6단계 · contents.js: 이벤트 위임 리스너 달기 (12분)

버튼 상자(`#category-filters`) 하나에만 리스너를 달아요. 세 군데에 코드를 넣어요.

**어디서:** VS Code → `C:\dev\my-creator-site\js\contents.js`

**무엇을:**

1. `// 화면의 요소들을 미리 찾아 둬요 (Day 20)` 아래에 있는 `const listElement = document.querySelector('#video-list');` 줄 **바로 아래**에 한 줄을 붙여 넣어요. 상자를 찾아 `filterBox`에 담는 줄이에요.

```js
const filterBox = document.querySelector('#category-filters');
```

2. `// 지금 상태: 전체 영상` 주석을 `// 지금 상태: 전체 영상, 선택한 카테고리`로 고치고, `let allVideos = [` 로 시작하는 배열이 끝나는 `];` 줄 **바로 아래**에 한 줄을 붙여 넣어요. 지금 어느 카테고리가 선택되어 있는지 기억하는 변수예요.

```js
let selectedCategory = 'all';
```

3. 파일 맨 끝의 `render();` 줄을 찾아요. 그 줄 **바로 위**에 아래 블록을 붙여 넣어요(블록 끝의 빈 줄 포함).

📄 C:\dev\my-creator-site\js\contents.js (일부)
```js
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

  console.log('선택한 카테고리:', selectedCategory); // Day 23에서 render()로 바꿔요
});
```

저장하고 `contents.html`을 새로 고침한 뒤 **게임** 버튼을 눌러 봐요.

코드를 읽어 봐요.

- `filterBox.addEventListener('click', (event) => {`: 상자 안 어디를 눌러도 이 함수가 불려요. 버튼을 눌러도 클릭이 상자로 전해지기 때문이에요.
- `event.target.closest('button')`: 누른 곳에서 가장 가까운 `button`이에요. 버튼 사이 빈 곳이면 `null`이에요.
- `if (!button) { return; }`: `!`는 "아니라면"이에요(Day 16). 버튼이 없으면(`null`이면) 아무것도 하지 않고 빠져나가요.
- `selectedCategory = button.dataset.category;`: `data-category` 값(`all`, `game`, …)을 변수에 담아요.
- `filterBox.querySelectorAll('button')`: 상자 안의 모든 버튼을 배열 비슷한 목록으로 찾아요. `querySelector`가 하나를 찾는다면 `querySelectorAll`은 **전부** 찾아요. 여기에 `forEach`(Day 19)를 써서 하나씩 돌아요.
- `item.setAttribute('aria-pressed', String(item === button));`: 반복 중인 `item`이 방금 누른 `button`과 같을 때만 `true`가 돼서, 눌린 버튼 하나만 `aria-pressed="true"`가 돼요. CSS의 `.filters button[aria-pressed="true"]`가 그 버튼을 보라색으로 채워요.
- 마지막 `console.log`는 임시예요. 카테고리에 맞게 카드를 거르는 일은 Day 23에서 해요. 오늘은 값이 제대로 바뀌는지 콘솔로 확인해요.

:::success
**게임** 버튼을 누르면 게임 버튼만 보라색으로 채워지고(전체 버튼은 테두리만 남아요), 개발자 도구 **Console**에 `선택한 카테고리: game`이 찍혀요. **토크**를 누르면 `선택한 카테고리: talk`예요. 카드 6장은 아직 그대로인 게 정상이에요. 버튼 4개 사이의 빈 곳을 눌러도 콘솔에 아무것도 찍히지 않아요.
:::

### 7단계 · 확인하고 커밋·푸시 (5분)

**어디서:** Edge(또는 Chrome)에서 연 다섯 페이지, 그다음 VS Code

**무엇을:**

1. 다섯 페이지를 하나씩 열고 폭 360px와 폭 1000px에서 번갈아 봐요. 좁을 때는 버튼으로 열고 닫히고, 넓을 때는 버튼 없이 메뉴가 가로로 보여야 해요.
2. 폭 360px에서 키보드로 `Tab`을 눌러 로고 다음에 **☰ 메뉴** 버튼으로 포커스가 오는지 봐요. `Enter`나 `Space`로 메뉴가 열려요. `<button>`이라서 따로 만들지 않아도 키보드가 돼요.
3. 변경을 저장소에 올려요. VS Code 왼쪽 활동 막대의 **소스 제어**(가지 모양, `Ctrl + Shift + G`)를 열어요. **메시지** 칸에 `Day 21: 모바일 메뉴와 카테고리 버튼`을 입력하고 **커밋** 버튼을 누른 뒤, 이어서 나타나는 **변경 내용 동기화** 버튼을 눌러요(확인 창이 뜨면 **예**). Day 7에서 배운 흐름 그대로예요.

명령으로 하고 싶다면 VS Code 메뉴 **터미널 → 새 터미널**로 터미널을 열고(Day 7), 아래 세 줄을 한 줄씩 실행해요.

**어디서:** VS Code 터미널(PowerShell), 위치 `C:\dev\my-creator-site`

```powershell
git add .
git commit -m "Day 21: 모바일 메뉴와 카테고리 버튼"
git push
```

`git add .`는 출력이 없어요. 다음 줄에 `PS C:\dev\my-creator-site>`가 다시 보이면 성공이에요. `git commit` 예상 출력(해시와 숫자는 달라도 돼요):

```text
[main 3f2a9c1] Day 21: 모바일 메뉴와 카테고리 버튼
 8 files changed, 95 insertions(+), 13 deletions(-)
```

`git push` 마지막 두 줄 예상 출력(내 아이디와 해시는 달라요):

```text
To https://github.com/내아이디/my-creator-site.git
   a1b2c3d..e4f5a6b  main -> main
```

Windows에서는 `git add` 때 `warning: in the working copy of '…', LF will be replaced by CRLF the next time Git touches it` 같은 경고가 나올 수 있어요. 줄바꿈 방식 안내일 뿐이니 무시해도 돼요.

:::success
GitHub 저장소 페이지(`https://github.com/<내 아이디>/my-creator-site`)를 새로 고침하면 맨 위 커밋 메시지에 `Day 21: 모바일 메뉴와 카테고리 버튼`이 보여요. 소스 제어 패널의 변경은 0개예요.
:::

## ✍️ 과제

### 과제 1 · 빈 곳을 누르면? (쉬움 ⭐, 5분)

영상 페이지에서 카테고리 버튼 4개 **사이의 빈 곳**(또는 버튼 상자의 오른쪽 빈 곳)을 눌러 보세요. 콘솔에 아무것도 찍히지 않는 이유를 `contents.js`의 코드 줄을 가리키며 한 문장으로 적어 보세요.

- 확인 방법: 콘솔에 `선택한 카테고리: …`가 새로 찍히지 않아요.
- 힌트: `closest('button')`이 빈 곳에서는 무엇을 돌려줄까요? 그다음 줄은 무엇을 하나요?

### 과제 2 · 위임 없이 쓰면? (보통 ⭐⭐, 8분)

리스너를 버튼마다 따로 다는 방법을 **콘솔에서** 써 보고, 이벤트 위임과 비교해 보세요. 파일은 고치지 않아요.

- 영상 페이지에서 `F12` → **Console**에 아래 코드를 붙여 넣고 `Enter`를 눌러요.
- 버튼을 몇 개 눌러 보고, 무엇이 같고 무엇이 다른지 적어요.

```js
document.querySelectorAll('#category-filters button').forEach((button) => {
  button.addEventListener('click', () => {
    console.log('버튼마다 단 리스너:', button.dataset.category);
  });
});
```

- 확인 방법: 버튼을 누르면 오늘 만든 위임 리스너의 로그와 위 로그가 **둘 다** 찍혀요.
- 힌트: 버튼이 100개가 되면 리스너가 몇 개 필요할까요? 위임 방식은요?

### 과제 3 · 키보드만으로 메뉴 열기 (도전 ⭐⭐⭐, 7분)

폭 360px에서 마우스를 쓰지 않고 `Tab`으로 **☰ 메뉴** 버튼까지 가서 `Enter`와 `Space`로 메뉴를 열고 닫아 보세요. 그리고 `<button>`을 `<div>`로 바꾸면 왜 안 되는지 적어 보세요(바꾼 뒤에는 꼭 되돌려요).

- 확인 방법: 버튼에 보라색 포커스 테두리가 생기고, 두 키 모두 메뉴가 열리고 닫혀요.
- 힌트: 키보드의 `Tab`은 어떤 요소에만 멈출까요?

## ✅ 정답

:::answer 과제 1 정답 · 빈 곳을 누르면?
```js
const button = event.target.closest('button'); // 빈 곳이면 null
if (!button) {
  return;
}
```

**왜 이렇게 하나요?** 상자 안 빈 곳을 누르면 `event.target`은 상자 자신이고, 그 안팎에 `button`이 없어서 `closest('button')`이 `null`을 돌려줘요. `if (!button)`은 "버튼이 없다면"이라서 곧바로 `return`으로 함수를 끝내요. 그 아래의 `selectedCategory` 바꾸기와 `console.log`는 실행되지 않아요. 리스너를 상자 하나에 걸면 이렇게 "버튼이 아닌 곳"을 걸러내는 줄이 꼭 필요해요.
:::

:::answer 과제 2 정답 · 위임 없이 쓰면?
버튼마다 단 리스너(코드 아래)는 버튼이 4개면 리스너가 4개예요. 위임은 상자 하나에 리스너 하나예요.

```js
document.querySelectorAll('#category-filters button').forEach((button) => {
  button.addEventListener('click', () => {
    console.log('버튼마다 단 리스너:', button.dataset.category);
  });
});
```

**왜 이렇게 하나요?** 둘 다 같은 결과를 내지만 위임 쪽이 짧고 확장하기 쉬워요. 버튼이 100개로 늘면 방식 1은 리스너 100개, 위임은 그대로 1개예요. 나중에 JavaScript가 버튼을 새로 만들어 넣을 때도 위임은 따로 할 일이 없어요. 방식 1은 새 버튼마다 `addEventListener`를 또 불러야 해요. 실험한 코드는 콘솔에만 있어서 새로 고침하면 사라져요. 파일에는 아무것도 남지 않았으니 되돌릴 것도 없어요.
:::

:::answer 과제 3 정답 · 키보드만으로 메뉴 열기
`Tab`으로 로고 → ☰ 메뉴 버튼 순서로 포커스가 와요. 버튼에서 `Enter` 또는 `Space`를 누르면 `click` 이벤트가 일어나서 메뉴가 열리고 닫혀요.

```html
<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">☰ 메뉴</button>
```

**왜 이렇게 하나요?** `<button>`은 브라우저가 키보드로 누를 수 있게 이미 만들어 둔 요소예요. `Tab` 이동, `Enter`·`Space` 누름, 포커스 표시가 공짜로 따라와요. `<div>`는 `Tab`에서 멈추지 않고 키로 눌러지지도 않아서, `div`로 메뉴 버튼을 만들면 마우스를 못 쓰는 사람은 메뉴를 열 수 없어요. 그래서 "누르는 것"은 `<button>`으로, "다른 페이지로 가는 것"은 `<a>`로 쓰는 것이 기본이에요. 실험하려고 `div`로 바꿨다면 `<button …>`으로 되돌려 주세요.
:::

:::answer 오늘 끝 상태 전체 코드
막혔다면 아래 코드로 내 파일을 맞추고 다음 Day를 시작해요. 다섯 페이지(`index.html`, `about.html`, `contents.html`, `schedule.html`, `contact.html`)와 `main.js`, `contents.js`는 파일 전체를 실었어요. 줄이 많은 `style.css`는 오늘 바뀐 블록만 위치와 함께 실었어요. 파일 전체를 붙여 넣을 때는 `Ctrl + A`로 전체를 선택한 뒤 `Ctrl + V`를 해요.

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
│  └─ main.js ✎
├─ about.html ✎
├─ contact.html ✎
├─ contents.html ✎
├─ index.html ✎
└─ schedule.html ✎
```

📄 C:\dev\my-creator-site\index.html
```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>달빛곰 방송국</title>
  <link rel="stylesheet" href="css/style.css">
  <script src="js/main.js" defer></script>
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
          <li><a href="index.html" aria-current="page">홈</a></li>
          <li><a href="about.html">소개</a></li>
          <li><a href="contents.html">영상</a></li>
          <li><a href="schedule.html">방송 일정</a></li>
          <li><a href="contact.html">문의</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main>
    <section class="container hero">
      <img class="hero-image" src="images/profile.svg" alt="헤드셋을 쓴 곰 캐릭터, 달빛곰" width="240" height="240">
      <div>
        <h1>안녕하세요, 달빛곰이에요!</h1>
        <!-- main.js가 시간대에 맞는 인사말을 넣어 줘요 (Day 16) -->
        <p id="greeting" class="greeting"></p>
        <p>게임, 토크, 음악을 넘나드는 버라이어티 스트리머예요. 매주 월·수·금·토에 방송해요.</p>
        <p class="hero-actions">
          <a class="button" href="contents.html">영상 보러 가기</a>
          <a class="button button-outline" href="schedule.html">방송 일정 보기</a>
        </p>
      </div>
    </section>

    <section class="container">
      <h2>이런 방송을 해요</h2>
      <div class="card-grid">
        <article class="card">
          <img src="images/thumb-game.svg" alt="게임 방송을 나타내는 컨트롤러 그림" width="320" height="180">
          <div class="card-body">
            <h3>게임 방송</h3>
            <p>신작부터 레트로 게임까지, 시청자와 함께 즐겨요.</p>
          </div>
        </article>
        <article class="card">
          <img src="images/thumb-talk.svg" alt="토크 방송을 나타내는 말풍선 그림" width="320" height="180">
          <div class="card-body">
            <h3>토크 방송</h3>
            <p>사연을 읽고 수다를 떨어요. 편하게 놀러 오세요.</p>
          </div>
        </article>
        <article class="card">
          <img src="images/thumb-music.svg" alt="음악 방송을 나타내는 음표 그림" width="320" height="180">
          <div class="card-body">
            <h3>음악 방송</h3>
            <p>기타를 치며 신청곡을 불러 드려요.</p>
          </div>
        </article>
      </div>
    </section>

    <section class="container">
      <h2>대표 영상</h2>
      <!-- YouTube 공유 → 퍼가기에서 복사한 iframe이에요 -->
      <iframe class="video-frame" src="https://www.youtube.com/embed/aqz-KE-bpKQ" title="달빛곰 대표 영상 (예시 영상이에요)" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container">
      <p>&copy; 2026 달빛곰 방송국 · 연습용으로 만든 사이트예요.</p>
    </div>
  </footer>
</body>
</html>
```

📄 C:\dev\my-creator-site\about.html
```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>소개 - 달빛곰 방송국</title>
  <link rel="stylesheet" href="css/style.css">
  <script src="js/main.js" defer></script>
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
          <li><a href="about.html" aria-current="page">소개</a></li>
          <li><a href="contents.html">영상</a></li>
          <li><a href="schedule.html">방송 일정</a></li>
          <li><a href="contact.html">문의</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main class="container">
    <h1>달빛곰을 소개해요</h1>

    <section class="about-intro">
      <img class="about-image" src="images/profile.svg" alt="헤드셋을 쓴 곰 캐릭터, 달빛곰" width="240" height="240">
      <div>
        <p>안녕하세요! <strong>달빛곰</strong>이에요. 2026년에 방송을 시작한 <em>버라이어티 스트리머</em>예요.</p>
        <p>밤에 방송하는 걸 좋아해서 이름에 달빛이 들어갔어요. 시청자분들과 수다 떠는 시간이 가장 즐거워요.</p>
      </div>
    </section>

    <section>
      <h2>어떤 방송을 하나요?</h2>
      <ul>
        <li><strong>게임</strong>: 신작 게임을 첫 방송에서 같이 해 봐요.</li>
        <li><strong>토크</strong>: 사연을 읽고 이야기를 나눠요.</li>
        <li><strong>음악</strong>: 기타 연주와 신청곡 라이브를 해요.</li>
      </ul>
    </section>

    <section>
      <h2>방송 규칙</h2>
      <ol>
        <li>서로 존중하는 말을 써 주세요.</li>
        <li>스포일러는 미리 말해 주세요.</li>
        <li>개인 정보는 채팅에 올리지 마세요.</li>
      </ol>
    </section>

    <section>
      <h2>함께해요</h2>
      <p>방송 시간은 <a href="schedule.html">방송 일정</a>에서 확인하고, 협업이나 궁금한 점은 <a href="contact.html">문의 페이지</a>로 보내 주세요.</p>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container">
      <p>&copy; 2026 달빛곰 방송국 · 연습용으로 만든 사이트예요.</p>
    </div>
  </footer>
</body>
</html>
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
        </ul>
      </nav>
    </div>
  </header>

  <main class="container">
    <h1>영상 모아보기</h1>
    <p>지난 방송 영상을 모아 놨어요. 제목을 누르면 YouTube에서 열려요.</p>

    <!-- 버튼 4개를 감싼 상자 하나에만 클릭 이벤트를 달아요 (이벤트 위임, Day 21) -->
    <div id="category-filters" class="filters" role="group" aria-label="카테고리 선택">
      <button type="button" data-category="all" aria-pressed="true">전체</button>
      <button type="button" data-category="game" aria-pressed="false">게임</button>
      <button type="button" data-category="talk" aria-pressed="false">토크</button>
      <button type="button" data-category="music" aria-pressed="false">음악</button>
    </div>

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
        </ul>
      </nav>
    </div>
  </header>

  <main class="container">
    <h1>방송 일정</h1>
    <p>모든 시간은 한국 시간이에요.</p>

    <table class="schedule-table">
      <caption>주간 방송 일정</caption>
      <thead>
        <tr>
          <th scope="col">요일</th>
          <th scope="col">시작 시간</th>
          <th scope="col">방송 내용</th>
        </tr>
      </thead>
      <tbody>
        <tr><th scope="row">월요일</th><td>20:00</td><td>신작 게임 같이 해요</td></tr>
        <tr><th scope="row">화요일</th><td>-</td><td>휴방</td></tr>
        <tr><th scope="row">수요일</th><td>21:00</td><td>수요일 수다 타임</td></tr>
        <tr><th scope="row">목요일</th><td>-</td><td>휴방</td></tr>
        <tr><th scope="row">금요일</th><td>20:00</td><td>신청곡 라이브</td></tr>
        <tr><th scope="row">토요일</th><td>15:00</td><td>시청자 참여 게임</td></tr>
        <tr><th scope="row">일요일</th><td>-</td><td>휴방</td></tr>
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

📄 C:\dev\my-creator-site\contact.html
```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>문의하기 - 달빛곰 방송국</title>
  <link rel="stylesheet" href="css/style.css">
  <script src="js/main.js" defer></script>
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
          <li><a href="schedule.html">방송 일정</a></li>
          <li><a href="contact.html" aria-current="page">문의</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main class="container">
    <h1>문의하기</h1>
    <p>협업 제안, 영상 요청, 궁금한 점을 남겨 주세요. 이 사이트는 연습용이라 실제로 전송되지는 않아요.</p>

    <form>
      <p>
        <label for="name">이름</label><br>
        <input id="name" name="name" type="text">
      </p>
      <p>
        <label for="email">이메일</label><br>
        <input id="email" name="email" type="email">
      </p>
      <p>
        <label for="nickname">채팅 닉네임 (선택)</label><br>
        <input id="nickname" name="nickname" type="text">
      </p>
      <p>
        <label for="topic">문의 종류</label><br>
        <select id="topic" name="topic">
          <option value="general">일반 문의</option>
          <option value="collab">협업 제안</option>
          <option value="request">영상 요청</option>
        </select>
      </p>
      <p>
        <label for="message">내용</label><br>
        <textarea id="message" name="message" rows="6"></textarea>
      </p>
      <button type="submit">보내기</button>
    </form>
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
// 1) 모바일 메뉴 열기/닫기  3) 시간대별 인사말
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

📄 C:\dev\my-creator-site\js\contents.js
```js
// ==========================================================
// contents.js - 영상 목록 페이지
// 영상 데이터로 카드를 그려요.
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

// 지금 상태: 전체 영상, 선택한 카테고리
let allVideos = [
  { id: 'v001', title: '기타로 연주하는 신청곡', category: 'music', youtubeId: 'aqz-KE-bpKQ', date: '2026-10-27' },
  { id: 'v002', title: '신작 공포 게임 첫 도전', category: 'game', youtubeId: 'eRsGyueVLvQ', date: '2026-10-25' },
  { id: 'v003', title: '구독자 1000명 기념 Q&A', category: 'talk', youtubeId: 'R6MlUcmOul8', date: '2026-10-20' },
  { id: 'v004', title: '친구들과 협동 퍼즐 도전', category: 'game', youtubeId: 'Y-rmzh0PI3c', date: '2026-10-18' },
  { id: 'v005', title: '비 오는 날 플레이리스트', category: 'music', youtubeId: 'TLkA0RELQ1g', date: '2026-10-11' },
  { id: 'v006', title: '요즘 빠진 취미 이야기', category: 'talk', youtubeId: 'WhWc3b3KhnY', date: '2026-10-06' },
];
let selectedCategory = 'all';

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

  console.log('선택한 카테고리:', selectedCategory); // Day 23에서 render()로 바꿔요
});

render();
```

`C:\dev\my-creator-site\css\style.css`는 아래 네 블록을 같은 위치에 넣어요.

1. 4번 구역의 `.site-nav` 규칙을 아래 블록으로 바꿔요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
/* 모바일: 메뉴 버튼은 보이고, 메뉴 목록은 숨겨져 있어요 */
.menu-toggle {
  margin-left: auto;
}

.site-nav {
  display: none;
  flex-basis: 100%; /* 한 줄을 다 차지해서 아래로 내려가요 */
}

.site-nav.open {
  display: block; /* main.js가 open 클래스를 붙이면 보여요 */
}
```

2. 5번 구역의 `.button-outline` 규칙을 아래 블록으로 바꿔요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
.button-outline,
.menu-toggle,
.filters button {
  background: transparent;
  color: var(--text);
}

.filters button[aria-pressed="true"] {
  background: var(--accent);
  color: var(--accent-text);
}
```

3. `/* 방송 일정 */` 주석 줄 바로 위에 아래 블록을 넣어요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
/* 영상 목록: 필터 + 검색 */
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
```

4. 8번 구역의 `@media (min-width: 768px) {` 블록 전체를 아래 블록으로 바꿔요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
@media (min-width: 768px) {
  h1 {
    font-size: 2.25rem;
  }

  /* 메뉴 버튼은 숨기고, 메뉴 목록은 가로로 늘어놔요 */
  .menu-toggle {
    display: none;
  }

  .site-nav {
    display: block;
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

### ☰ 메뉴 버튼을 눌러도 메뉴가 안 열려요

**원인:** 거의 세 가지예요. ① CSS를 `.site-nav .open`처럼 빈칸을 넣어 썼어요. 그러면 `site-nav` **안쪽**의 `open`을 찾아서 아무것도 고르지 못해요. ② `<nav>`에 `id="site-nav"`가 없어서 `document.querySelector('#site-nav')`가 `null`이에요. ③ `main.js`의 `'click'` 철자가 틀렸어요(`'Click'`, `'onclick'`).

**해결:**

1. `css\style.css`에서 `.site-nav.open`을 찾아 빈칸 없이 붙어 있는지 확인해요.
2. 개발자 도구 **Elements**에서 `<nav`를 찾아 `id="site-nav"`가 있는지 봐요. 버튼을 누를 때 `class="site-nav open"`으로 바뀌는지도 봐요.
3. 콘솔(Console)에 빨간 오류가 있다면 그 문장을 읽고 해당 줄로 가요.

### Uncaught TypeError: Cannot read properties of null (reading 'addEventListener')

```text
Uncaught TypeError: Cannot read properties of null (reading 'addEventListener')
```

**원인:** `addEventListener`를 `null`에 불렀어요. `document.querySelector('.menu-toggle')`가 요소를 못 찾으면 `null`을 돌려주는데, 그 변수에 리스너를 건 거예요. 한 페이지에서만 나온다면 그 페이지에 메뉴 버튼을 넣지 않은 거예요. 파일 이름과 줄 번호(`main.js:7` 같은 것)는 사람마다 달라요.

**해결:**

1. 오류가 나는 페이지의 HTML 파일을 열어요.
2. 1~2단계의 머리글 블록을 붙여 넣어 `<button class="menu-toggle" …>`가 있는지 확인해요.
3. 저장하고 새로 고침한 뒤 콘솔의 오류가 사라졌는지 봐요.

### 넓은 화면에서 메뉴가 사라졌어요

**원인:** 3단계 (3)의 반응형 블록에서 `.site-nav`의 `display: block;` 줄이 빠졌어요. 좁은 화면 규칙의 `display: none`이 넓은 화면에서도 그대로 이기고 있어요.

**해결:** `style.css` 맨 아래 `@media (min-width: 768px) {` 블록 안의 `.site-nav {` 규칙 맨 위에 `display: block;`을 넣고 저장해요. 폭을 800px 이상으로 넓혀 메뉴가 가로로 보이는지 확인해요.

### 콜백 자리에 괄호를 붙였더니 열자마자 실행돼요

**원인:** `addEventListener('click', toggleMenu())`처럼 함수 뒤에 `()`를 붙이면 리스너를 거는 순간 함수가 실행돼요. 누를 때가 아니에요. `'click'`을 `'Click'`처럼 대문자로 써도 이벤트 이름이 맞지 않아 아무 일도 일어나지 않아요.

**해결:** 함수 이름만 쓰거나(`toggleMenu`), 오늘처럼 화살표 함수 `() => { … }`를 써요. 이벤트 이름은 `'click'`처럼 영어 소문자로 써요.

### 카테고리 버튼을 눌렀는데 콘솔에 undefined가 나와요

```text
선택한 카테고리: undefined
```

**원인:** `button.dataset.category`는 HTML의 `data-category`와 철자가 똑같아야 해요. HTML에 `data-catagory`라고 잘못 썼거나 JavaScript에 `dataset.categroy`라고 썼을 가능성이 높아요. 틀리면 에러가 아니라 `undefined`가 나와서 눈치채기 어려워요.

**해결:** `contents.html`의 버튼 4개가 `data-category="…"`인지, `contents.js`가 `button.dataset.category`인지 철자를 하나씩 비교해요.

### ☰ 글자가 네모(□)로 보여요

**원인:** `☰`는 글꼴에 따라 없을 수 있어요. 대부분의 Windows 11 글꼴에 들어 있어서 드물지만, 실제 컴퓨터에서 확인하지는 못했어요(실기 미확인).

**해결:** 버튼 글자를 `메뉴`로 바꿔도 동작은 똑같아요. `☰ 메뉴`의 `☰ ` 부분을 지우고 저장해요.

## 📝 오늘의 체크리스트

- [ ] 다섯 페이지 모두에 **☰ 메뉴** 버튼이 있고, 각 페이지에서 `aria-current="page"`가 자기 메뉴 하나에만 있어요
- [ ] 폭 360px에서 버튼을 누르면 메뉴가 열리고 다시 누르면 닫혀요
- [ ] 폭 768px 이상에서는 버튼이 없고 메뉴가 가로로 보여요
- [ ] 개발자 도구에서 `aria-expanded`가 `true`/`false`로 바뀌는 것을 봤어요
- [ ] 영상 페이지에서 카테고리 버튼을 누르면 그 버튼만 보라색이고 콘솔에 `선택한 카테고리: game`이 찍혀요
- [ ] 버튼 사이 빈 곳을 눌러도 콘솔에 아무것도 안 찍히는 이유를 설명할 수 있어요
- [ ] `.site-nav.open`과 `.site-nav .open`의 차이를 말할 수 있어요
- [ ] 과제 1~3을 하고 정답과 비교했어요
- [ ] 다섯 페이지의 콘솔에 빨간 오류가 없고, GitHub에 `Day 21` 커밋이 보여요

## 📚 더 알아보기

- [MDN — 이벤트 소개](https://developer.mozilla.org/ko/docs/Learn_web_development/Core/Scripting/Events): 이벤트와 리스너, 이벤트 객체를 더 자세히 설명해요.
- [MDN — Element.classList](https://developer.mozilla.org/ko/docs/Web/API/Element/classList): `add`, `remove`, `toggle` 등 클래스를 다루는 방법이에요.
- [MDN — 이벤트 버블링](https://developer.mozilla.org/ko/docs/Learn_web_development/Core/Scripting/Event_bubbling): 이벤트 위임의 바탕이 되는, 클릭이 바깥으로 전해지는 성질이에요.

➡️ **다음 Day 예고:** [Day 22 · 다크 모드와 localStorage](#/day/p1-d22)에서는 메뉴에 🌙 다크 모드 버튼을 달고, 선택한 테마를 브라우저에 저장해서 다른 페이지로 가도, 새로 고침해도 그대로 유지해요.
