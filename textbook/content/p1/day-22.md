## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- 메뉴의 **🌙 다크 모드** 버튼을 눌러 사이트 전체를 어두운 색으로 바꾸고 다시 밝게 돌릴 수 있어요.
- 다른 페이지로 가도, 새로 고침해도, 브라우저를 닫았다 열어도 내가 고른 테마가 유지돼요.
- 처음 방문한 사람에게는 Windows의 다크 모드 설정을 따라 보여 줘요.
- 개발자 도구 **Application** 패널에서 `localStorage`에 저장된 값을 보고 지울 수 있어요.

**예상 시간: 100분** (개념 이해 20분 · 따라하기 55분 · 과제 20분 · 정리 5분)

:::path 📂 시작 상태
어제(Day 21)까지 만든 파일이 이렇게 있어야 해요. 없거나 다르면 [Day 21](#/day/p1-d21)의 "오늘 끝 상태 전체 코드"로 맞춰 주세요.

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

### 다크 모드는 "색을 바꾸는 버튼"이 아니라 "변수 값을 바꾸는 스위치"예요

Day 14에서 색을 `var(--bg)`, `var(--text)`처럼 CSS 변수로 모아 두었어요. 오늘은 그 덕을 크게 봐요. 밝은 모드와 어두운 모드의 차이는 결국 변수 몇 개의 값이기 때문이에요.

**비유:** 방 전등의 조명 스위치를 생각해 보세요. 가구(카드, 표, 버튼)를 하나하나 어두운 것으로 갈아 끼우는 게 아니라, 조명 하나만 바꾸면 방 전체 분위기가 바뀌어요.

**정확한 정의:** **[[다크 모드]]**(dark mode)는 어두운 배경에 밝은 글자로 화면을 보여 주는 색 구성이에요. 우리 사이트는 `<html>` 요소에 `data-theme="dark"`라는 [[data 속성]]이 붙으면 아래 CSS가 켜지도록 만들어요.

```css
:root[data-theme="dark"] {
  --bg: #14121f;
  --text: #ece9ff;
}
```

`:root`는 `<html>` 요소를 가리키는 선택자예요. `[data-theme="dark"]`는 속성 선택자(Day 11)이고, 둘을 **빈칸 없이** 붙여서 "`data-theme`이 `dark`인 `:root`"라는 복합 선택자(Day 21)가 돼요. 빈칸을 넣어 `:root [data-theme="dark"]`로 쓰면 "`:root` 안쪽의 다른 요소"라는 뜻이 돼서 동작하지 않아요.

자바스크립트는 색을 하나도 건드리지 않고 `<html data-theme="dark">`만 붙였다 뗐다 해요. 그 한 줄이 모든 색을 바꿔요.

`color-scheme: dark;`라는 한 줄도 같이 써요. 브라우저가 기본으로 그리는 입력칸, 스크롤바, 폼 부품의 색을 어둡게 맞춰 줘요. 이 줄이 없으면 어두운 화면에서 문의 폼의 입력칸만 하얗게 남아요.

### 자바스크립트로 `<html>`에 접근하기

지금까지 `document.querySelector`로 요소를 찾았어요. `<html>` 요소는 `document.documentElement`로 바로 얻어요. 여기에 Day 21에서 배운 `dataset`을 쓰면 `data-theme`을 읽고 써요.

```js
document.documentElement.dataset.theme = 'dark';   // <html data-theme="dark">
console.log(document.documentElement.dataset.theme); // dark
```

### localStorage: 브라우저에 적어 두는 작은 쪽지

페이지를 새로 고치면 자바스크립트의 변수는 모두 사라져요. 테마를 기억하려면 변수 밖의 저장소가 필요해요.

**비유:** 시험 중에 손바닥에 적어 둔 메모처럼, 브라우저 안에 키와 값을 적어 두는 작은 쪽지예요. 창을 닫았다 열어도 남아 있어요.

**정확한 정의:** **[[localStorage]]**(로컬 스토리지)는 브라우저 안에 키(이름)와 값을 짝지어 저장하는 작은 저장소예요.

```js
localStorage.setItem('theme', 'dark'); // 저장: 키 'theme', 값 'dark'
localStorage.getItem('theme');         // 꺼내기: 'dark', 저장된 게 없으면 null
```

알아 둘 점이 세 가지예요.

1. **글자만 저장돼요.** 숫자나 `true`를 넣어도 글자로 바뀌어요. 우리는 처음부터 글자 `'light'`/`'dark'`를 써요.
2. **저장된 게 없으면 `null`이에요.** Day 15의 `null`이 여기서 다시 나와요.
3. **주소마다 따로 저장돼요.** 같은 컴퓨터, 같은 브라우저라도 주소 앞부분이 다르면 저장소가 따로예요. 파일을 더블클릭해 연 사이트(`file:///…`), Live Preview 주소(`http://127.0.0.1:…`), 배포 주소(`https://….github.io/…`)는 서로 쪽지를 못 봐요. 그래서 주소마다 테마를 한 번씩 골라야 해요.

### prefers-color-scheme: 처음 온 사람은 컴퓨터 설정을 따라가요

처음 방문한 사람은 저장된 테마가 없어요(`getItem`이 `null`). 그렇다고 무조건 밝게 보여 주면, 컴퓨터 전체를 어둡게 쓰는 사람에게 눈부셔요. 그래서 Windows의 다크 모드 설정을 읽어서 따라가요.

**[[prefers-color-scheme]]**(프리퍼스 컬러 스킴)은 사용자가 컴퓨터에서 다크 모드를 켰는지 알려 주는 미디어 쿼리 조건이에요(Day 13의 `@media`와 같은 종류예요). CSS에서는 `@media (prefers-color-scheme: dark) { … }`로, 자바스크립트에서는 아래처럼 물어봐요.

```js
window.matchMedia('(prefers-color-scheme: dark)').matches // 다크면 true
```

`matchMedia(…)`는 미디어 쿼리에 맞는지 물어보는 함수이고, `.matches`가 `true`/`false` 답이에요.

우선순위는 이래요: **① 직접 고른 저장값 → ② 없으면 컴퓨터 설정 → ③ 그것도 없으면 밝게.** 코드로는 `if (저장값이 'light' 또는 'dark') … else …`가 돼요.

### 버튼 글자는 바꾸지 않아요: aria-pressed

켜졌는지 보여 주려고 버튼 글자를 "라이트 모드로 바꾸기"로 바꾸고 싶을 수 있어요. 하지만 이 버튼은 **켜고 끄는 스위치**예요. 스위치는 라벨은 그대로 두고 상태를 따로 알리는 것이 접근성의 약속이에요. 그래서 글자는 `🌙 다크 모드`로 고정하고, 켜졌는지는 `aria-pressed="true"`/`"false"`로 알려요. 스크린 리더는 "다크 모드, 토글 버튼, 눌림"처럼 읽어 줘요. 보라색 채움은 눈으로 보는 사람을 위한 같은 정보예요(Day 21의 필터 버튼과 같은 방식이에요).

### 코드를 함수로 나눠요

테마 코드는 세 가지 일을 해요: 저장된 값 꺼내기, 저장하기, 화면에 적용하기. 각각 함수(`getSavedTheme`, `saveTheme`, `applyTheme`)로 나누면(Day 18) 이름만 봐도 무슨 일인지 알 수 있고, 한 가지만 고치기 쉬워요.

:::info 실무에서는
실제 서비스는 페이지가 그려지기 전에 테마를 적용하는 아주 짧은 코드를 `<head>`에 넣어서, 밝은 화면이 잠깐 번쩍이는 것(깜빡임)을 막아요. 우리 사이트는 `defer`로 불러서 페이지가 먼저 그려진 뒤 테마가 적용되니 이 깜빡임이 아주 잠깐 있을 수 있어요. 정상이고, 이 교재에서는 다루지 않아요.
:::

## 🛠️ 따라하기

모두 7단계예요. CSS → HTML → JavaScript 순서로 하면서 단계마다 화면을 확인해요.

### 1단계 · style.css: 다크 색과 버튼 모양 (10분)

**어디서:** VS Code → `C:\dev\my-creator-site\css\style.css`

**무엇을:** 세 곳을 고쳐요. 파일 위쪽 `/* ---------- 1. CSS 변수 … ---------- */` 구역부터예요.

**(1)** `:root {` 규칙 맨 끝, `--radius: 12px;` 줄 **바로 아래**에 한 줄을 붙여 넣어요. 주석까지 그대로예요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
  color-scheme: light;     /* 입력칸·스크롤바도 밝은 모양으로 */
```

**(2)** 같은 `:root { … }`가 `}`로 끝난 다음에, 그리고 `/* ---------- 2. 기본 설정 (Day 9, 10) ---------- */` 주석 **바로 위**에 아래 블록을 붙여 넣어요(블록 끝의 빈 줄까지).

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
/* 다크 모드: main.js가 <html data-theme="dark">를 붙이면 변수 값만 바뀌어요 */
:root[data-theme="dark"] {
  --bg: #14121f;
  --surface: #1f1c33;
  --text: #ece9ff;
  --muted: #b3aed6;
  --accent: #8f83ff;
  --accent-text: #14121f;
  --link: #b0a8ff;
  --border: #3a3660;
  color-scheme: dark;
}
```

밝은 모드와 같은 이름의 변수(`--bg`, `--text`, …)를 어두운 값으로 다시 정한 거예요. 포인트 색(`--accent`)은 어두운 배경에서 잘 보이도록 더 밝은 보라(`#8f83ff`)로, 그 위의 글자(`--accent-text`)는 어두운 색으로 정했어요.

**(3)** `/* ---------- 5. 공통 부품 ---------- */` 구역에서 `.button-outline,`로 시작하는 두 규칙(`.button-outline, .menu-toggle, .filters button {…}`와 `.filters button[aria-pressed="true"] {…}`)을 찾아 아래 블록으로 바꿔요. 선택자에 `.theme-toggle`이 더해져요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
.button-outline,
.menu-toggle,
.theme-toggle,
.filters button {
  background: transparent;
  color: var(--text);
}

.theme-toggle[aria-pressed="true"],
.filters button[aria-pressed="true"] {
  background: var(--accent);
  color: var(--accent-text);
}
```

`Ctrl + S`로 저장해요. 아직 화면은 그대로예요. 다크 값은 `data-theme="dark"`가 붙기 전에는 쓰이지 않기 때문이에요.

### 2단계 · 다섯 페이지에 다크 모드 버튼 넣기 (8분)

**어디서:** VS Code → `index.html`, `about.html`, `contents.html`, `schedule.html`, `contact.html` (다섯 파일 모두)

**무엇을:** 파일마다 같은 일을 해요.

1. 파일의 머리글 안에서 `<li><a href="contact.html"` 로 시작하는 줄(**문의** 메뉴 항목)을 찾아요. `Ctrl + F`로 `문의</a></li>`를 찾으면 빨라요. 파일 위쪽 머리글 안에 있는 첫 번째 줄이 맞아요(`about.html`에는 본문에도 "문의 페이지" 링크가 있지만 그건 `문의 페이지</a>`로 달라요).
2. 그 줄 **바로 아래**에 한 줄을 붙여 넣어요. 들여쓰기는 맨 앞 칸 10개(스페이스 10칸)로 앞의 `<li>`와 맞춰요.

📄 C:\dev\my-creator-site\index.html (일부)
```html
          <li><button class="theme-toggle" type="button" aria-pressed="false">🌙 다크 모드</button></li>
```

3. `Ctrl + S`로 저장해요. 나머지 네 파일도 똑같이 해요.

`<li>` 안에 버튼이 들어가는 것은, 메뉴가 목록(`<ul>`)이라서 항목마다 `<li>`가 필요하기 때문이에요. `aria-pressed="false"`는 처음 상태(꺼짐)이고, JavaScript가 페이지를 열 때 실제 상태로 맞춰 줘요.

:::success
다섯 페이지 모두 메뉴의 맨 끝에 보라색 테두리의 **🌙 다크 모드** 버튼이 생겼어요(폭 360px에서는 **☰ 메뉴**를 눌러 메뉴를 열면 보여요). 눌러도 아직 아무 일도 없어요.
:::

### 3단계 · main.js: 테마 바꾸고 저장하기 (12분)

**어디서:** VS Code → `C:\dev\my-creator-site\js\main.js`

**무엇을:**

1. 머리 주석 상자의 `// 1) 모바일 메뉴 열기/닫기  3) 시간대별 인사말` 줄을 아래 한 줄로 바꿔요(2번이 끼어들어요).

```text
// 1) 모바일 메뉴 열기/닫기  2) 다크 모드  3) 시간대별 인사말
```

2. `// ---------- 3. 시간대별 인사말 (Day 16) ----------` 줄을 찾아 그 줄 **바로 위**에 아래 블록을 붙여 넣어요(블록 끝의 빈 줄 포함). 1번 구역(모바일 메뉴)과 3번 구역(인사말) 사이가 돼요.

📄 C:\dev\my-creator-site\js\main.js (일부)
```js
// ---------- 2. 다크 모드 (Day 22) ----------
const themeButton = document.querySelector('.theme-toggle');

// 저장된 테마를 꺼내요. 저장된 값이 없으면 null이에요.
// (저장소를 쓸 수 없는 브라우저를 대비하는 try/catch는 Day 25에서 배워요)
function getSavedTheme() {
  return localStorage.getItem('theme'); // 'light' 또는 'dark', 없으면 null
}

function saveTheme(theme) {
  localStorage.setItem('theme', theme);
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
```

3. `Ctrl + S`로 저장해요.

위에서 아래로 읽어 봐요.

- `const themeButton = document.querySelector('.theme-toggle');`: 버튼을 찾아 둬요.
- `getSavedTheme()`: `localStorage`에서 `'theme'` 키의 값을 꺼내요. `return`으로 돌려주는 값은 `'light'`, `'dark'`, 또는 저장된 게 없으면 `null`이에요(Day 18의 반환값).
- `saveTheme(theme)`: 받은 값을 `'theme'` 키로 저장해요.
- `applyTheme(theme)`: `<html>`의 `data-theme`을 바꾸고(CSS가 켜져요), 버튼의 `aria-pressed`를 `String(theme === 'dark')`로 맞춰요. `theme === 'dark'`는 `true`/`false`이고 `String(…)`이 글자로 바꿔요(Day 21과 같은 방식).
- `const savedTheme = getSavedTheme();`와 `systemPrefersDark`: 저장값과 컴퓨터 설정을 각각 변수에 담아요.
- `if … else`: 저장값이 `'light'` 또는 `'dark'`면(`===`와 `||`, Day 16) 그걸 적용하고, 아니면 컴퓨터 설정을 따라요. `systemPrefersDark ? 'dark' : 'light'`는 삼항 연산자(Day 16)로 "다크면 `'dark'`, 아니면 `'light'`"라는 뜻이에요.
- 마지막 리스너: 누를 때마다 지금 테마를 읽고(`document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'`) 반대 테마를 `nextTheme`에 담아서, 적용하고 저장해요.

`getSavedTheme`/`saveTheme`에 `try/catch`가 없는 것을 눈여겨봐요. 일부 브라우저 설정에서는 `localStorage` 자체를 못 쓰게 막아서 이 코드가 오류를 낼 수 있어요. 이런 경우를 대비하는 방법은 Day 25에서 배워서 그때 이 두 함수를 고쳐요.

### 4단계 · 눌러서 확인하기 (5분)

**어디서:** Live Preview(또는 파일 더블클릭)로 연 `index.html`

**무엇을:**

1. 메뉴의 **🌙 다크 모드** 버튼을 눌러요.
2. 메뉴에서 **영상**, **방송 일정**, **문의** 페이지로 차례로 가 봐요.
3. 한 페이지에서 `F5`로 새로 고침해요.
4. **🌙 다크 모드** 버튼을 한 번 더 눌러서 밝게 돌려요.

:::success
1번에서 배경이 어두운 남보라색으로, 글자가 연보라빛 흰색으로 바뀌고 **🌙 다크 모드** 버튼은 밝은 보라색으로 채워져요. 버튼 글자는 그대로 `🌙 다크 모드`예요. 2번과 3번에서 어두운 화면이 그대로 유지돼요. 문의 페이지의 입력칸도 어두운 모양이에요. 4번에서 다시 밝아져요. 콘솔(Console)에 빨간 오류는 없어요.
:::

일부만 밝게 남는다면 Day 14에서 `var()`로 바꾸지 않은 색이 남은 거예요. 아래 🧯의 "일부만 밝게 남아요" 항목을 보세요.

### 5단계 · Application 패널에서 저장된 값 보기 (8분)

저장이 정말 됐는지 눈으로 확인해요. 개발자 도구는 브라우저에서 열어야 해요. Live Preview 미리 보기 창에서는 `F12`가 개발자 도구를 열지 않아요. 미리 보기 창 위쪽 주소 칸의 주소(`http://127.0.0.1:3000/index.html`, 숫자는 달라도 돼요)를 복사해서 Edge(또는 Chrome) 주소창에 붙여 열어요. 파일을 더블클릭해서 열었다면 그대로 `F12`를 눌러요.

**어디서:** Edge(또는 Chrome)에서 연 페이지 → `F12` → 개발자 도구 위쪽 탭 줄의 **Application**(애플리케이션) 탭

**무엇을:**

1. 탭 줄에 **Application**이 안 보이면 오른쪽 끝의 `»`(더 보기)를 눌러 그 안에서 골라요. 탭 이름은 버전에 따라 조금 다를 수 있어요.
2. 왼쪽 목록에서 **Storage**(저장소) 아래의 **Local storage**를 펼쳐요. 그 안에 `http://127.0.0.1:3000`처럼 지금 페이지의 주소가 보여요. 클릭해요.
3. 오른쪽 표에서 **Key**가 `theme`인 줄을 찾아요.
4. 그 줄을 클릭하고 `Delete` 키를 눌러 지워 봐요. 표가 비어요(뒤의 6단계에서 다시 써요).

:::success
표에 `theme` / `dark`(또는 `light`) 줄이 있어요. 페이지에서 **🌙 다크 모드**를 누를 때마다 값이 `dark` ↔ `light`로 바뀌어요(표를 클릭하거나 `F5`로 새로 고치면 보여요). 줄을 지운 뒤에는 `F5`를 눌러 새로 고쳐도 한 번 눌러 저장하기 전까지는 표가 비어 있어요.
:::

### 6단계 · 처음 방문한 사람처럼 확인하기 (7분)

방금 `theme`을 지웠으니 이 브라우저는 "처음 방문"과 같은 상태예요. 이때는 컴퓨터의 다크 모드 설정을 따라가야 해요.

**어디서:** Windows 설정 → **개인 설정** → **색** → **모드 선택**(영어 Windows: **Settings → Personalization → Colors → Choose your mode**)

**무엇을:**

1. 모드를 **어둡게**로 바꿔요(이름은 버전에 따라 조금 다를 수 있어요). Windows 화면 전체가 어두워져요.
2. 사이트 페이지를 `F5`로 새로 고침해요. `theme` 저장값이 없는 상태여야 해요.
3. 모드를 **밝게**로 돌려놓고 `F5`를 다시 눌러요.

:::success
2번에서 **🌙 다크 모드** 버튼을 누르지 않았는데도 사이트가 어두운 모양이고 버튼은 눌림(보라 채움) 상태예요. 3번에서는 밝은 모양으로 돌아와요. 바꾼 Windows 설정은 원래대로 돌려놔 주세요.
:::

Windows 설정을 건드리고 싶지 않다면 개발자 도구에서 흉내 낼 수도 있어요. 개발자 도구에서 `Ctrl + Shift + P`(명령 메뉴)를 누르고 `Rendering`을 입력해 **Show Rendering**을 고르면 **Rendering** 패널이 열려요(오른쪽 위 `⋮` → **More tools**(도구 더 보기) → **Rendering**으로도 열려요). 그 안의 **Emulate CSS media feature prefers-color-scheme**(`prefers-color-scheme` 미디어 기능 에뮬레이션) 목록에서 `prefers-color-scheme: dark`를 고른 뒤 `F5`를 눌러요. 패널의 위치와 이름은 버전에 따라 조금 다를 수 있어요.

### 7단계 · 커밋·푸시 (5분)

**어디서:** VS Code → 소스 제어 패널(`Ctrl + Shift + G`)

**무엇을:** **메시지** 칸에 `Day 22: 다크 모드와 테마 저장`을 입력하고 **커밋** → **변경 내용 동기화**를 눌러요. 명령으로 한다면 VS Code 터미널(PowerShell)에서 아래를 한 줄씩 실행해요.

**어디서:** VS Code 터미널(PowerShell), 위치 `C:\dev\my-creator-site`

```powershell
git add .
git commit -m "Day 22: 다크 모드와 테마 저장"
git push
```

`git commit` 예상 출력(해시와 숫자는 달라도 돼요):

```text
[main 8c1d0e7] Day 22: 다크 모드와 테마 저장
 7 files changed, 58 insertions(+), 1 deletion(-)
```

`git add .`는 출력이 없고, `git push`는 마지막에 `main -> main`이 보이면 성공이에요.

:::success
GitHub 저장소 페이지를 새로 고침하면 `Day 22: 다크 모드와 테마 저장` 커밋이 맨 위에 보이고, 소스 제어 패널의 변경은 0개예요.
:::

## ✍️ 과제

### 과제 1 · 처음 방문 흉내 내기 (쉬움 ⭐, 6분)

Application 패널에서 `theme`을 지우고, Windows(또는 Rendering 패널)의 다크·라이트를 바꿔 가며 새로 고침해 보세요. 그리고 **🌙 다크 모드**를 한 번 누른 다음 다시 시스템 설정을 바꿔 새로 고침해 보세요.

- 확인 방법: 저장값이 없을 때는 시스템 설정을 따르고, 한 번 누른 뒤에는 시스템 설정을 바꿔도 내가 고른 테마가 유지돼요.
- 힌트: `main.js`의 `if (savedTheme === 'light' || savedTheme === 'dark')` 줄이 어느 쪽을 먼저 보는지 읽어 보세요.

### 과제 2 · 저장소는 주소마다 따로 (보통 ⭐⭐, 8분)

파일을 더블클릭해서 연 `index.html`(주소가 `file:///C:/dev/…`)과 Live Preview 주소로 연 `index.html`에서 각각 테마를 다르게 바꿔 보세요. 한쪽에서 바꿔도 다른 쪽이 따라오지 않는 이유를 한 문장으로 적어 보세요.

- 확인 방법: 두 창에서 테마가 서로 다르게 유지돼요.
- 힌트: 두 주소의 앞부분이 어떻게 다른가요?

### 과제 3 · 다크 색 하나 골라 보기 (도전 ⭐⭐⭐, 6분)

`:root[data-theme="dark"]`의 `--accent` 값을 배경(`#14121f`)과 비슷한 어두운 보라(예: `#2a2466`)로 바꿔 보고 버튼과 메뉴 글자가 잘 읽히는지 확인한 뒤 **원래 값으로 되돌리세요.**

- 확인 방법: 바꾸면 버튼과 활성 메뉴 항목이 배경에 묻혀서 읽기 어려워져요.
- 힌트: 색을 하나 바꿨는데 여러 군데가 함께 바뀌는 이유는 무엇일까요? Day 28에서 쓰는 Lighthouse 검사 도구가 이런 "글자와 배경의 대비"를 점검해 준다는 것도 미리 알아 두세요.

## ✅ 정답

:::answer 과제 1 정답 · 처음 방문 흉내 내기
```js
const savedTheme = getSavedTheme();
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'light' || savedTheme === 'dark') {
  applyTheme(savedTheme);
} else {
  applyTheme(systemPrefersDark ? 'dark' : 'light');
}
```

**왜 이렇게 하나요?** 코드는 저장값(`savedTheme`)이 `'light'`나 `'dark'`인지 **먼저** 봐요. 그렇다면 시스템 설정은 쳐다보지 않아요. 저장값이 `null`일 때만 `else`로 가서 `systemPrefersDark`를 따라요. 그래서 "직접 고른 선택 > 컴퓨터 설정" 순서가 돼요. 직접 고른 사람의 선택을 존중해야 하기 때문이에요.
:::

:::answer 과제 2 정답 · 저장소는 주소마다 따로
```text
file:///C:/dev/my-creator-site/index.html
http://127.0.0.1:3000/index.html
```

**왜 이렇게 하나요?** 두 주소는 앞부분(`file://`과 `http://127.0.0.1:3000`)이 달라서, 브라우저는 서로 다른 사이트로 보고 `localStorage`도 따로 둬요. 한쪽에서 저장한 `theme`은 다른 쪽에서 보이지 않아요. 같은 이유로 배포 주소(`https://<내 아이디>.github.io/my-creator-site/`)에서도 테마를 한 번 더 골라야 해요. 보안을 위해 남의 사이트가 내 사이트의 쪽지를 읽지 못하게 막는 규칙이에요.
:::

:::answer 과제 3 정답 · 다크 색 하나 골라 보기
```css
:root[data-theme="dark"] {
  --accent: #8f83ff; /* 원래 값: 배경 #14121f 위에서 잘 보이는 밝은 보라 */
}
```

**왜 이렇게 하나요?** `--accent`는 버튼, 활성 메뉴 항목, 눌린 필터 버튼, 카테고리 배지가 모두 쓰는 변수예요. 그래서 한 줄만 바꿔도 여러 곳이 함께 바뀌어요. 이게 CSS 변수의 장점이에요. 배경과 비슷한 색을 쓰면 글자와 배경의 밝기 차이(대비)가 작아져서 읽기 어려워요. 대비가 충분한지는 눈으로도 보지만 Day 28의 Lighthouse가 숫자로 검사해 줘요. 실험이 끝났으면 꼭 `#8f83ff`로 되돌려요.
:::

:::answer 오늘 끝 상태 전체 코드
막혔다면 아래 코드로 내 파일을 맞추고 다음 Day를 시작해요. 오늘은 `main.js`를 파일 전체로 실었고, 다섯 페이지는 머리글의 바뀐 줄만, `style.css`는 바뀐 블록만 위치와 함께 실었어요.

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
│  ├─ contents.js
│  └─ main.js ✎
├─ about.html ✎
├─ contact.html ✎
├─ contents.html ✎
├─ index.html ✎
└─ schedule.html ✎
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

// 저장된 테마를 꺼내요. 저장된 값이 없으면 null이에요.
// (저장소를 쓸 수 없는 브라우저를 대비하는 try/catch는 Day 25에서 배워요)
function getSavedTheme() {
  return localStorage.getItem('theme'); // 'light' 또는 'dark', 없으면 null
}

function saveTheme(theme) {
  localStorage.setItem('theme', theme);
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

다섯 페이지(`index.html`, `about.html`, `contents.html`, `schedule.html`, `contact.html`)는 **문의** 메뉴 항목 바로 아래에 이 한 줄을 넣어요. 어제(Day 21)의 머리글에서 이 줄만 늘었어요.

📄 C:\dev\my-creator-site\index.html (일부)
```html
          <li><button class="theme-toggle" type="button" aria-pressed="false">🌙 다크 모드</button></li>
```

`C:\dev\my-creator-site\css\style.css`에는 세 가지를 넣어요.

1. `:root { … }`의 `--radius: 12px;` 줄 바로 아래에 이 줄을 넣어요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
  color-scheme: light;     /* 입력칸·스크롤바도 밝은 모양으로 */
```

2. `:root { … }` 규칙 끝과 `/* ---------- 2. 기본 설정 (Day 9, 10) ---------- */` 주석 사이에 이 블록을 넣어요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
/* 다크 모드: main.js가 <html data-theme="dark">를 붙이면 변수 값만 바뀌어요 */
:root[data-theme="dark"] {
  --bg: #14121f;
  --surface: #1f1c33;
  --text: #ece9ff;
  --muted: #b3aed6;
  --accent: #8f83ff;
  --accent-text: #14121f;
  --link: #b0a8ff;
  --border: #3a3660;
  color-scheme: dark;
}
```

3. 5번 구역의 `.button-outline` 두 규칙을 이 블록으로 바꿔요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
.button-outline,
.menu-toggle,
.theme-toggle,
.filters button {
  background: transparent;
  color: var(--text);
}

.theme-toggle[aria-pressed="true"],
.filters button[aria-pressed="true"] {
  background: var(--accent);
  color: var(--accent-text);
}
```
:::

## 🧯 자주 막히는 곳

여기에 없는 증상은 [문제 해결 모음](#/page/troubleshooting)에서 찾아보세요.

### 다크 모드 버튼을 눌러도 색이 안 바뀌어요

**원인:** 거의 항상 CSS 선택자의 빈칸이에요. `:root [data-theme="dark"]`처럼 `:root`와 `[` 사이에 빈칸이 있으면 "`:root` 안쪽의 다른 요소"라는 뜻이 돼요. `<html>` 자신이 아니라서 아무것도 골라지지 않아요.

**해결:**

1. `style.css`에서 `[data-theme="dark"]`를 찾아 `:root[data-theme="dark"] {`처럼 빈칸 없이 붙어 있는지 확인해요.
2. 개발자 도구 **Elements** 패널 맨 위의 `<html lang="ko" data-theme="dark">`에 `data-theme="dark"`가 붙는지 눌러 보며 확인해요. 붙는데 색이 안 바뀐다면 CSS 문제, 안 붙는다면 JavaScript 문제예요.

### 일부만 밝게 남아요

**원인:** Day 14에서 `var()`로 바꾸지 않은 색 코드(`#ffffff`, `#f4f2ff` 같은 `#`으로 시작하는 색)가 CSS 파일에 남아 있어요. 변수가 아닌 색은 `data-theme`이 바뀌어도 그대로예요.

**해결:**

1. `style.css`에서 `Ctrl + F`로 `#`을 검색해요.
2. `:root` 안쪽 변수 정의 이외의 곳에서 찾은 색 코드를 `var(--bg)`, `var(--surface)`, `var(--text)`, `var(--border)` 등 알맞은 변수로 바꿔요.
3. 저장하고 새로 고침해서 해당 부분이 어둡게 바뀌는지 확인해요.

### 새로 고침하면 다시 밝아져요

**원인:** 선택한 테마가 저장되지 않았어요. 클릭 리스너에서 `saveTheme(nextTheme);`가 빠졌거나, 저장 키가 `'Theme'`처럼 대소문자가 달라서 `getItem('theme')`이 못 찾아요. 키는 대소문자를 구분해요.

**해결:** `main.js`에서 `localStorage.setItem('theme', theme)`와 `localStorage.getItem('theme')`의 키가 둘 다 `'theme'`(소문자)인지, 클릭 리스너에 `saveTheme(nextTheme);`가 있는지 봐요. Application 패널의 Local storage에 `theme` 줄이 생기는지 확인해요.

### 시크릿 창이나 다른 브라우저에서는 테마가 안 이어져요

**원인:** `localStorage`는 브라우저마다, 주소마다 따로예요. InPrivate(Edge)·시크릿(Chrome) 창은 창을 닫으면 저장한 값이 사라져요. Edge에서 고른 테마를 Chrome은 몰라요.

**해결:** 정상 동작이에요. 쓰는 브라우저와 주소에서 한 번씩 고르면 돼요.

### 버튼 글자가 안 바뀌어서 고장 난 줄 알았어요

**원인:** 설계예요. 버튼 글자는 항상 `🌙 다크 모드`이고, 켜졌는지는 보라색 채움과 `aria-pressed` 값으로 알려요.

**해결:** 개발자 도구 **Elements**에서 버튼의 `aria-pressed`가 `"true"`/`"false"`로 바뀌는지 확인해요.

## 📝 오늘의 체크리스트

- [ ] 다섯 페이지 모두에서 **🌙 다크 모드** 버튼을 눌러 어두운 화면으로 바꿀 수 있어요
- [ ] 다른 페이지로 가도, 새로 고침해도 테마가 유지돼요
- [ ] 문의 페이지의 입력칸도 어두운 모양이에요
- [ ] Application → Local storage에서 `theme` 값을 봤어요
- [ ] `theme`을 지운 뒤 Windows(또는 Rendering) 설정에 따라 처음 화면이 달라지는 것을 확인했어요
- [ ] `getItem`이 저장된 게 없을 때 `null`을 돌려주는 것을 설명할 수 있어요
- [ ] `localStorage`가 주소마다 따로인 이유를 설명할 수 있어요
- [ ] 과제 1~3을 하고 정답과 비교했어요, 과제 3에서 바꾼 색은 되돌렸어요
- [ ] GitHub에 `Day 22` 커밋이 보여요

## 📚 더 알아보기

- [MDN — Window.localStorage](https://developer.mozilla.org/ko/docs/Web/API/Window/localStorage): `setItem`, `getItem`, 저장소 규칙을 설명해요.
- [MDN — prefers-color-scheme](https://developer.mozilla.org/ko/docs/Web/CSS/Reference/At-rules/@media/prefers-color-scheme): 사용자의 밝은·어두운 화면 선호를 CSS와 JavaScript로 읽는 방법이에요.
- [MDN — color-scheme](https://developer.mozilla.org/ko/docs/Web/CSS/Reference/Properties/color-scheme): 입력칸·스크롤바 같은 브라우저 기본 부품의 색을 맞추는 속성이에요.

➡️ **다음 Day 예고:** [Day 23 · 필터와 검색](#/day/p1-d23)에서는 카테고리 버튼으로 영상을 실제로 거르고, 제목 검색창을 달아서 카테고리와 검색을 함께 적용해요.
