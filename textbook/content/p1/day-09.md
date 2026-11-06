## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- HTML과 CSS가 각각 무슨 일을 하는지 설명할 수 있어요.
- `css/style.css` 파일을 만들고 다섯 페이지에 연결할 수 있어요.
- 요소 선택자, 쉼표로 묶은 선택자, 클래스 선택자로 CSS 규칙을 쓸 수 있어요.
- 개발자 도구 Styles 창에서 값을 바꿔 보고, 고쳤는데 안 바뀔 때 `Ctrl + F5`를 쓸 수 있어요.

**예상 시간: 90분** (개념 이해 15분 · 따라하기 45분 · 과제 25분 · 정리 5분)

:::path 📂 시작 상태
어제(Day 8)까지 만든 파일이 이렇게 있어야 해요. 없거나 다르면 [Day 8](#/day/p1-d08)의 "오늘 끝 상태 전체 코드"로 맞춰 주세요.

- `C:\dev\my-creator-site\index.html`, `about.html`, `contents.html`, `schedule.html`, `contact.html`
- `C:\dev\my-creator-site\images\profile.svg`, `C:\dev\my-creator-site\images\logo.svg`
- `C:\dev\hello\hello.html`, `favorites.html`, `tools.html`, `links.html`, `plan.html`, `pages\back.html`
- Git이 설치되어 있고(`git --version`의 예상 출력은 `git version 2.56.0.windows.4`, 숫자는 달라도 돼요) GitHub 공개 저장소 `my-creator-site`와 연결되어 있어요.
- 어제까지의 변경이 모두 커밋·푸시되어 있어요. 소스 제어 패널에 바뀐 파일이 없어요(Day 8 과제 3에서 영상 ID를 바꿨다면 커밋했거나 되돌린 상태예요).
- VS Code에서 `C:\dev\my-creator-site` 폴더가 열려 있어요.
- 오늘 마지막 단계는 **인터넷 연결**이 필요해요(GitHub에 올리기).
:::

## 📖 개념 이해

### CSS: 내용 위에 입히는 옷

**비유부터 볼게요.** HTML은 사람의 몸처럼 "무엇이 있는지"(제목, 문단, 그림)를 정해요. CSS는 그 위에 입히는 옷과 화장처럼 "어떻게 보이는지"(색, 글꼴, 크기, 여백)를 정해요. 옷만 바꾸면 사람은 그대로인 채 다른 분위기가 돼요.

**정확한 정의는 이래요.** **[[CSS]]**(씨에스에스)는 웹페이지의 모양을 정하는 언어예요. 이름은 Cascading Style Sheets의 머리글자예요. 보통 `.css` 파일에 따로 쓰고, HTML의 `<link>`로 여러 페이지에 함께 연결해요. 파일 하나만 고치면 다섯 페이지의 모양이 함께 바뀌어요.

### 규칙의 모양

CSS는 **규칙**을 모아 놓은 거예요. 규칙 하나는 이렇게 생겼어요.

```css
선택자 {
  CSS속성: 값;
}
```

예를 들어 이런 규칙이에요.

```css
body {
  color: #1d1b2e;
}
```

- **[[선택자]]**(selector)는 규칙을 어떤 요소에 적용할지 고르는 부분이에요. 위에서 `body`예요.
- 중괄호 `{ }` 안에 꾸밈을 적어요. 꾸밈 하나는 **[[CSS 속성]]**(property)과 값을 콜론 `:`으로 이어 쓰고, 끝에 세미콜론 `;`을 붙여요. 위에서 `color`가 속성이고 `#1d1b2e`가 값이에요. HTML 태그 안의 속성(`class="…"`)과 이름은 같지만 다른 것이라, 교재에서는 "CSS 속성"이라고 부르며 구분해요.
- 주석은 `/* 메모 */`로 써요. 화면에 영향을 주지 않아요.

### 선택자 세 가지

- **요소 선택자**: 요소 이름을 그대로 써요. `body { … }`는 모든 `body`에, `a { … }`는 모든 링크에 적용돼요.
- **쉼표로 묶기**: `h1, h2, h3 { … }`는 "h1과 h2와 h3 모두"에 같은 꾸밈을 적용해요. 쉼표는 "이것도 저것도"라는 뜻이에요.
- **클래스 선택자**: **[[클래스]]**(class)는 요소에 붙이는 이름표예요. HTML에서는 `class="site-header"`처럼 쓰고, CSS에서는 앞에 점을 붙여 `.site-header { … }`로 골라요. 점은 CSS에만 쓰고 HTML의 `class` 값에는 쓰지 않아요. 한 요소에 이름표를 여러 개 붙일 수도 있어요(`class="a b"`처럼 빈칸으로 나눠요).

참고로 `id` 선택자(`#이름`)도 있어요. 뒤에서 쓸 때 설명할게요.

규칙이 여러 개라 같은 요소를 건드리면, **나중에 쓴 규칙이 앞의 규칙을 덮어요.** 그래서 순서가 중요해요.

### 색, 글꼴, 줄 간격

- **[[색상 코드]]**(color code)는 색을 `#` 뒤 여섯 글자로 적는 방법이에요. 앞에서부터 두 글자씩 빨강·초록·파랑의 세기를 `00`(없음)부터 `ff`(가장 셈)까지 나타내요. `#ffffff`는 흰색, `#000000`은 검은색이에요. 이 사이트의 포인트 색은 보라색 `#5b4bdb`예요.
- `font-family`는 글꼴 이름 목록이에요. 앞에서부터 컴퓨터에 있는 첫 글꼴을 써요. 공백이 있는 이름은 따옴표로 감싸요(`"Malgun Gothic"`). 마지막의 `sans-serif`는 "아무 고딕 계열"이라는 뜻의 안전망이에요.
- `line-height`는 줄 높이예요. `1.7`은 글자 크기의 1.7배라 한국어가 읽기 편해요.
- `text-align`은 글자 정렬(`center` 등)이에요.

### 캐시: 고쳤는데 안 바뀌는 이유

**[[캐시]]**(cache)는 한 번 받은 파일을 다시 받지 않으려고 브라우저가 잠시 보관해 두는 복사본이에요. 덕분에 페이지가 빨리 열리지만, CSS 파일을 고쳤는데 브라우저가 옛 복사본을 쓰면 화면이 그대로예요. 그럴 때 `Ctrl + F5`(강력 새로 고침)를 누르면 캐시를 무시하고 다시 받아요.

## 🛠️ 따라하기

모두 8단계예요.

### 1단계 · `css` 폴더와 `style.css` 만들기 (6분)

**어디서:** VS Code 탐색기 (`MY-CREATOR-SITE` 줄)

**무엇을:**

1. `MY-CREATOR-SITE` 줄에서 **새 폴더** 아이콘을 클릭하고 `css`를 입력한 뒤 `Enter`를 눌러요.
2. `css` 폴더 줄을 오른쪽 클릭하고 **새 파일**을 클릭해요.
3. `style.css`를 입력하고 `Enter`를 눌러요.
4. 아래 코드를 붙여 넣고 `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\css\style.css
```css
/* ==========================================================
   style.css - 달빛곰 방송국 전체 스타일 (모든 페이지가 함께 써요)
   ========================================================== */

/* ---------- 2. 기본 설정 (Day 9, 10) ---------- */
body {
  background: #ffffff;
  color: #1d1b2e;
  font-family: system-ui, "Malgun Gothic", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
  line-height: 1.7;
}
```
규칙을 읽어 봐요. `body`는 페이지 전체 바탕이에요. 배경 `#ffffff`(흰색), 글자색 `#1d1b2e`(진한 남색), 글꼴 목록, 줄 높이 1.7이에요. 글꼴은 앞에서부터 컴퓨터에 있는 첫 글꼴을 쓰고, Windows에서는 보통 `Malgun Gothic`(맑은 고딕)이 걸려요.

:::success
탐색기에 `css` 폴더가 있고 안에 `style.css`가 있어요. 파일 이름이 `style.css.txt`나 `style.css.css`가 아니라 `style.css`예요. 폴더 이름은 소문자 `css`예요. 아직 HTML과 연결하지 않아서 화면은 안 바뀌어요.
:::

### 2단계 · `index.html`에 CSS 연결하기 (6분)

**어디서:** VS Code `index.html` 편집기, `<title>` 줄

**무엇을:**

1. 탐색기에서 `index.html`을 클릭해 열어요.
2. `<title>달빛곰 방송국</title>` 줄 끝을 클릭하고 `Enter`를 눌러 새 줄을 만들어요.
3. 아래 한 줄을 입력하거나 붙여 넣어요.
4. `Ctrl + S`로 저장해요. 미리 보기는 저절로 바뀌어요.

📄 C:\dev\my-creator-site\index.html (일부)
```html
  <link rel="stylesheet" href="css/style.css">
```

- `<link>`는 다른 파일을 연결하는 요소예요. 닫는 태그가 없어요.
- `rel="stylesheet"`는 "연결하는 파일이 스타일시트(CSS)예요"라는 뜻이에요.
- `href="css/style.css"`는 CSS 파일의 위치예요. Day 4~5에서 배운 상대 경로예요.
- 코드의 구역 주석 번호(`2. 기본 설정`, `4. 헤더` 같은 것)는 1, 3, 5, 6이 비어 있어요. 빠진 번호는 뒤의 Day에서 채워요.

:::success
미리 보기의 글꼴이 이전과 달라져요. 맑은 고딕 계열의 글꼴로 보이고 줄 간격이 조금 넓어져요(눈으로 구별하기 어렵다면 3단계 뒤에 더 뚜렷해져요). 아무것도 안 바뀌면 아래 🧯 자주 막히는 곳의 "CSS가 전혀 안 먹혀요"를 보세요.
:::

### 3단계 · 나머지 규칙 쓰기 (8분)

이제 링크 색, 제목 줄 높이, 머리글과 바닥글의 모양을 정하는 규칙을 더해요.

**어디서:** VS Code `style.css` 편집기

**무엇을:** `Ctrl + A`로 전체를 선택한 뒤 아래 코드를 붙여 넣고 `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\css\style.css
```css
/* ==========================================================
   style.css - 달빛곰 방송국 전체 스타일 (모든 페이지가 함께 써요)
   ========================================================== */

/* ---------- 2. 기본 설정 (Day 9, 10) ---------- */
body {
  background: #ffffff;
  color: #1d1b2e;
  font-family: system-ui, "Malgun Gothic", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
  line-height: 1.7;
}

a {
  color: #4a3bc7;
}

h1, h2, h3 {
  line-height: 1.3;
}

/* ---------- 4. 헤더와 내비게이션 (Day 11) ---------- */
.site-header {
  background: #f4f2ff;
}

/* ---------- 7. 푸터 ---------- */
.site-footer {
  background: #f4f2ff;
  color: #5a5775;
  text-align: center;
}
```
새로 나온 규칙을 읽어 봐요.

- `a { color: #4a3bc7; }`: 모든 링크 글자색이 보라색이에요.
- `h1, h2, h3 { line-height: 1.3; }`: 제목은 줄 높이를 좁게(1.3) 해요. 쉼표로 묶어서 세 개에 한 번에 적용해요.
- `.site-header { background: #f4f2ff; }`: 클래스 `site-header`가 붙은 요소의 배경은 연보라예요. 아직 HTML에 클래스를 붙이지 않았어요. 4단계에서 붙여요.
- `.site-footer { … }`: 클래스 `site-footer`가 붙은 요소의 배경은 연보라, 글자는 회색(`#5a5775`), 글자 정렬은 가운데예요.
- 구역 주석 `/* ---------- 2. 기본 설정 (Day 9, 10) ---------- */`은 CSS 파일을 구역으로 나눠 놓은 표시예요. 뒤 Day에서 구역별로 규칙이 늘어날 거예요.

:::success
저장하면 미리 보기의 링크 글자(메뉴)가 보라색으로 바뀌어요. 원래 링크 색이 보랏빛이었다면 차이가 작을 수 있어요. 4단계에서 머리글 색이 바뀌면 CSS가 적용된 거예요. 머리글과 바닥글은 아직 안 바뀌어요. 클래스를 안 붙였기 때문이에요.
:::

### 4단계 · `header`와 `footer`에 클래스 붙이기 (6분)

다섯 파일에서 `<header>`를 `<header class="site-header">`로, `<footer>`를 `<footer class="site-footer">`로 바꿔야 해요. 파일마다 하나하나 고치지 않고, 폴더 전체를 한 번에 바꾸는 기능을 써요.

**어디서:** VS Code 왼쪽 활동 막대의 **검색** 아이콘(돋보기 모양) 또는 `Ctrl + Shift + H`

**무엇을:**

1. `Ctrl + Shift + H`를 눌러요. 왼쪽에 검색 패널이 열리고 **바꾸기** 칸이 함께 보여요.
2. 위쪽 칸에 `<header>`를 입력하고, 아래 바꾸기 칸에 `<header class="site-header">`를 입력해요.
3. 바꾸기 칸 오른쪽의 **모두 바꾸기** 아이콘을 클릭해요. 확인 창이 뜨면 **바꾸기**를 클릭해요.
4. 같은 방법으로 위쪽 칸을 `<footer>`로, 바꾸기 칸을 `<footer class="site-footer">`로 바꾸고 **모두 바꾸기**를 해요.
5. 열려 있는 탭에 ●가 보이면 저장되지 않은 거예요. `Ctrl + K`를 누르고 손을 뗀 뒤 `S`를 눌러 모두 저장하거나, 탭마다 `Ctrl + S`를 눌러요. ●가 없으면 이미 저장된 거예요.
6. `index.html`로 가서 `<header class="site-header">`와 `<footer class="site-footer">`가 바뀌었는지 확인해요.

:::success
`<header class="site-header">`와 `<footer class="site-footer">`가 다섯 파일 모두에 들어갔어요. 검색 패널 위쪽 칸에 `site-header`를 입력하면 파일 5개가 결과로 보여요(바꾼 뒤에는 `<header>` 검색 결과가 비어 있는 게 정상이에요). 미리 보기의 머리글(로고와 메뉴가 있는 띠)과 바닥글의 배경이 연보라로 바뀌고, 바닥글 글자가 회색으로 가운데 정렬돼요.
:::

### 5단계 · 나머지 네 페이지에도 CSS 연결하기 (8분)

**어디서:** VS Code `about.html`, `contents.html`, `schedule.html`, `contact.html` 편집기

**무엇을:** 2단계와 같은 방법으로 네 파일 각각의 `<title>…</title>` 줄 바로 아래에 같은 한 줄을 넣어요. 파일마다 `<title>` 글자는 달라도 넣을 줄은 같아요.

```html
  <link rel="stylesheet" href="css/style.css">
```

파일마다 `Ctrl + S`로 저장하고, 미리 보기에서 메뉴로 다섯 페이지를 모두 오가며 확인해요.

:::success
다섯 페이지 모두 글꼴이 같고, 링크가 보라색이고, 머리글과 바닥글 배경이 연보라예요. 한 페이지만 안 바뀐다면 그 파일의 `link` 줄을 확인해요.
:::

### 6단계 · 개발자 도구 Styles 창으로 실험하기 (6분)

**어디서:** 파일 탐색기 → `C:\dev\my-creator-site\index.html` 더블클릭(브라우저)

**무엇을:** 개발자 도구는 브라우저에서만 열려요(Day 6에서 배웠어요). 미리 보기 창 대신 더블클릭으로 연 브라우저 탭을 쓰거나, 미리 보기 주소를 복사해 Edge에 붙여 넣어 열어요.

1. `F12`를 눌러 개발자 도구를 열고 **Elements** 탭을 클릭해요.
2. `<body>` 줄을 클릭해요. 오른쪽(또는 아래)의 **Styles**(스타일) 창에 `body { … }` 규칙이 보여요. 규칙 오른쪽에 `style.css:6`처럼 파일 이름과 줄 번호가 보여요.
3. `color: #1d1b2e;` 값을 더블클릭해서 `red`로 바꾸고 `Enter`를 눌러요.
4. 속성 이름 앞의 체크 상자를 클릭해서 껐다 켜 봐요.
5. `F5`로 새로 고침해요.

:::success
3번에서 페이지 글자가 빨간색으로 바뀌고, 4번에서 체크를 끄면 글자가 원래대로 돌아와요. 5번에서 새로 고침하면 모든 변경이 사라져요. 개발자 도구에서 고친 건 화면에만 적용되고 `style.css` 파일은 바뀌지 않기 때문이에요. 이 창은 "이 값을 바꾸면 어떻게 보일까?"를 미리 실험하는 데 쓰고, 마음에 들면 `style.css`를 직접 고쳐요.
:::

### 7단계 · 캐시와 `Ctrl + F5` 알아 두기 (2분)

**어디서:** 브라우저 (더블클릭으로 연 브라우저 탭을 클릭한 뒤에만 눌러요. VS Code에서 `Ctrl + F5`는 프로그램 실행 키예요.)

**무엇을:** 앞으로 CSS를 고쳤는데 브라우저 화면이 그대로면 먼저 `Ctrl + F5`를 눌러 보세요. 노트북은 `Ctrl + Fn + F5`일 수 있어요.

:::success
`Ctrl + F5`를 누르면 페이지가 한 번 더 완전히 새로 불려 와요. 이 습관을 기억해 두면 돼요. 오늘은 확인용으로 한 번만 눌러 봐요.
:::

### 8단계 · 오늘 작업 커밋하고 올리기 (3분)

**어디서:** VS Code 소스 제어 패널 (`Ctrl + Shift + G`)

**무엇을:**

1. **변경 사항**에 `css/style.css`(새 파일, `U` 표시)와 다섯 HTML 파일(`M` 표시)이 보이는지 확인해요.
2. 메시지 칸에 `Day 9: CSS 시작, 글꼴과 색`을 입력하고 **커밋**을 클릭해요.
3. **변경 내용 동기화**를 클릭해요. 확인 창이 뜨면 **OK**를 클릭해요.
4. GitHub 저장소 페이지를 새로 고침해요.

:::success
소스 제어 패널의 변경 목록이 비어요. GitHub 저장소 페이지에 `css` 폴더가 생기고 `Day 9: CSS 시작, 글꼴과 색` 커밋이 보여요.
:::

## ✍️ 과제

### 과제 1 · Styles 창 실험 (쉬움 ⭐, 7분)

개발자 도구 Styles 창에서 `body`의 `color`를 다른 색으로 바꿔 보고, 새로 고침하면 왜 원래대로 돌아오는지 한 문장으로 적어 보세요.

### 과제 2 · 규칙 직접 쓰기 (보통 ⭐⭐, 10분)

`style.css`에 규칙을 직접 써 봐요. 모든 `h1` 제목의 글자색을 포인트 색 `#5b4bdb`로 바꾸는 규칙이에요.

- `style.css`의 `h1, h2, h3` 규칙 바로 아래에 새 규칙을 쓰고 저장해요.
- 미리 보기에서 제목이 보라색으로 바뀌는지 확인해요(더블클릭으로 연 브라우저면 저장 뒤 그 탭에서 `Ctrl + F5`).
- 확인한 뒤 **그 규칙은 지워요.** `Ctrl + Z`로 되돌려도 돼요. 이 규칙은 최종 사이트(레퍼런스)에는 없어요. 소스 제어 패널에 변경이 남아 있으면 그 파일의 변경을 되돌려요.

### 과제 3 · 클래스 퀴즈 (도전 ⭐⭐⭐, 8분)

다음 세 가지의 뜻과 맞는지 틀린지 적어 보세요.

1. HTML에 `class=".site-header"`라고 쓰기
2. CSS에 `site-footer { … }`처럼 앞에 점 없이 쓰기
3. HTML에 `class="site-header site-footer"`라고 쓰기

## ✅ 정답

:::answer 과제 1 정답 · Styles 창 실험
**개발자 도구는 브라우저가 그려 놓은 화면만 바꾸고 파일은 건드리지 않아서, 새로 고침하면 파일을 다시 읽어 원래대로 돌아와요.**

**왜 이렇게 하나요?** Styles 창은 "이 값으로 바꾸면 어떻게 보일까"를 안전하게 실험하는 곳이에요. 마음에 드는 값을 찾았다면 `style.css`를 직접 고치고 저장해야 영구히 바뀌어요.
:::

:::answer 과제 2 정답 · h1 규칙
```css
h1 {
  color: #5b4bdb;
}
```

`h1, h2, h3 { line-height: 1.3; }` 규칙 바로 아래에 써서 확인한 뒤, 지워요. 지운 `style.css`는 아래 "오늘 끝 상태 전체 코드"와 같아요.

**왜 이렇게 하나요?** 요소 선택자 `h1`은 모든 `h1`에 적용돼요. 속성 이름 `color`, 콜론, 값, 세미콜론의 모양을 직접 써 보는 연습이에요. 중괄호나 세미콜론을 빠뜨리면 그 뒤 규칙도 무시될 수 있어요.
:::

:::answer 과제 3 정답 · 클래스 퀴즈
1. **틀렸어요.** HTML의 `class` 값에는 점을 쓰지 않아요. `class="site-header"`예요. 점이 붙으면 이름이 `.site-header`인 클래스가 되어 CSS의 `.site-header`와 안 맞아요.
2. **틀렸어요.** CSS에서 클래스를 고르려면 앞에 점을 붙여 `.site-footer { … }`로 써요. 점이 없으면 `site-footer`라는 이름의 요소를 찾는데 그런 요소는 없어요.
3. **맞아요.** 빈칸으로 나누면 클래스가 두 개(`site-header`와 `site-footer`) 붙어요. 문법은 맞지만 이 사이트의 머리글에 바닥글 모양까지 입혀져서 의도와 다를 거예요.
:::

:::answer 오늘 끝 상태 전체 코드
오늘 따라하기와 과제를 모두 끝내면 아래 상태가 돼요. 막혔다면 폴더는 지우지 말고(`.git` 폴더가 그대로여야 GitHub와 연결이 유지돼요) 파일 내용만 이 코드로 덮어써 저장하세요. 그다음 소스 제어에서 커밋하고 **변경 내용 동기화**를 눌러요. 그러면 Day 10을 바로 시작할 수 있어요.

```text
C:\dev\my-creator-site\
├─ index.html
├─ about.html
├─ contents.html
├─ schedule.html
├─ contact.html
├─ css\
│  └─ style.css
└─ images\
   ├─ profile.svg
   └─ logo.svg
```

오늘 새로 만든 파일은 `css\style.css`이고, 다섯 HTML 파일에는 `link`와 `class`를 더했어요.

📄 C:\dev\my-creator-site\css\style.css
```css
/* ==========================================================
   style.css - 달빛곰 방송국 전체 스타일 (모든 페이지가 함께 써요)
   ========================================================== */

/* ---------- 2. 기본 설정 (Day 9, 10) ---------- */
body {
  background: #ffffff;
  color: #1d1b2e;
  font-family: system-ui, "Malgun Gothic", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
  line-height: 1.7;
}

a {
  color: #4a3bc7;
}

h1, h2, h3 {
  line-height: 1.3;
}

/* ---------- 4. 헤더와 내비게이션 (Day 11) ---------- */
.site-header {
  background: #f4f2ff;
}

/* ---------- 7. 푸터 ---------- */
.site-footer {
  background: #f4f2ff;
  color: #5a5775;
  text-align: center;
}
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
</head>
<body>
  <header class="site-header">
    <a href="index.html">
      <img src="images/logo.svg" alt="" width="36" height="36">
      <span>달빛곰 방송국</span>
    </a>
    <nav>
      <ul>
        <li><a href="index.html">홈</a></li>
        <li><a href="about.html">소개</a></li>
        <li><a href="contents.html">영상</a></li>
        <li><a href="schedule.html">방송 일정</a></li>
        <li><a href="contact.html">문의</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section>
      <img src="images/profile.svg" alt="헤드셋을 쓴 곰 캐릭터, 달빛곰" width="240" height="240">
      <div>
        <h1>안녕하세요, 달빛곰이에요!</h1>
        <p>게임, 토크, 음악을 넘나드는 버라이어티 스트리머예요. 매주 월·수·금·토에 방송해요.</p>
      </div>
    </section>

    <section>
      <h2>이런 방송을 해요</h2>
      <article>
        <h3>게임 방송</h3>
        <p>신작부터 레트로 게임까지, 시청자와 함께 즐겨요.</p>
      </article>
      <article>
        <h3>토크 방송</h3>
        <p>사연을 읽고 수다를 떨어요. 편하게 놀러 오세요.</p>
      </article>
      <article>
        <h3>음악 방송</h3>
        <p>기타를 치며 신청곡을 불러 드려요.</p>
      </article>
    </section>

    <section>
      <h2>대표 영상</h2>
      <!-- YouTube 공유 → 퍼가기에서 복사한 iframe이에요 -->
      <iframe src="https://www.youtube.com/embed/aqz-KE-bpKQ" title="달빛곰 대표 영상 (예시 영상이에요)" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    </section>
  </main>

  <footer class="site-footer">
    <p>&copy; 2026 달빛곰 방송국 · 연습용으로 만든 사이트예요.</p>
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
</head>
<body>
  <header class="site-header">
    <a href="index.html">
      <img src="images/logo.svg" alt="" width="36" height="36">
      <span>달빛곰 방송국</span>
    </a>
    <nav>
      <ul>
        <li><a href="index.html">홈</a></li>
        <li><a href="about.html">소개</a></li>
        <li><a href="contents.html">영상</a></li>
        <li><a href="schedule.html">방송 일정</a></li>
        <li><a href="contact.html">문의</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <h1>달빛곰을 소개해요</h1>

    <section>
      <img src="images/profile.svg" alt="헤드셋을 쓴 곰 캐릭터, 달빛곰" width="240" height="240">
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
    <p>&copy; 2026 달빛곰 방송국 · 연습용으로 만든 사이트예요.</p>
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
</head>
<body>
  <header class="site-header">
    <a href="index.html">
      <img src="images/logo.svg" alt="" width="36" height="36">
      <span>달빛곰 방송국</span>
    </a>
    <nav>
      <ul>
        <li><a href="index.html">홈</a></li>
        <li><a href="about.html">소개</a></li>
        <li><a href="contents.html">영상</a></li>
        <li><a href="schedule.html">방송 일정</a></li>
        <li><a href="contact.html">문의</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <h1>영상 모아보기</h1>
    <p>지난 방송 영상을 모아 두는 페이지예요.</p>
  </main>

  <footer class="site-footer">
    <p>&copy; 2026 달빛곰 방송국 · 연습용으로 만든 사이트예요.</p>
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
</head>
<body>
  <header class="site-header">
    <a href="index.html">
      <img src="images/logo.svg" alt="" width="36" height="36">
      <span>달빛곰 방송국</span>
    </a>
    <nav>
      <ul>
        <li><a href="index.html">홈</a></li>
        <li><a href="about.html">소개</a></li>
        <li><a href="contents.html">영상</a></li>
        <li><a href="schedule.html">방송 일정</a></li>
        <li><a href="contact.html">문의</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <h1>방송 일정</h1>
    <p>모든 시간은 한국 시간이에요.</p>

    <table>
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
    <p>&copy; 2026 달빛곰 방송국 · 연습용으로 만든 사이트예요.</p>
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
</head>
<body>
  <header class="site-header">
    <a href="index.html">
      <img src="images/logo.svg" alt="" width="36" height="36">
      <span>달빛곰 방송국</span>
    </a>
    <nav>
      <ul>
        <li><a href="index.html">홈</a></li>
        <li><a href="about.html">소개</a></li>
        <li><a href="contents.html">영상</a></li>
        <li><a href="schedule.html">방송 일정</a></li>
        <li><a href="contact.html">문의</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <h1>문의하기</h1>
    <p>협업 제안, 영상 요청, 궁금한 점을 남겨 주세요. 이 사이트는 연습용이라 실제로 전송되지는 않아요.</p>

    <form>
      <div>
        <label for="name">이름</label>
        <input id="name" name="name" type="text" autocomplete="name">
      </div>
      <div>
        <label for="email">이메일</label>
        <input id="email" name="email" type="email" autocomplete="email">
      </div>
      <div>
        <label for="nickname">채팅 닉네임 (선택)</label>
        <input id="nickname" name="nickname" type="text" autocomplete="nickname">
      </div>
      <div>
        <label for="topic">문의 종류</label>
        <select id="topic" name="topic">
          <option value="general">일반 문의</option>
          <option value="collab">협업 제안</option>
          <option value="request">영상 요청</option>
        </select>
      </div>
      <div>
        <label for="message">내용</label>
        <textarea id="message" name="message" rows="6"></textarea>
      </div>
      <button type="submit">보내기</button>
    </form>
  </main>

  <footer class="site-footer">
    <p>&copy; 2026 달빛곰 방송국 · 연습용으로 만든 사이트예요.</p>
  </footer>
</body>
</html>
```
연습 폴더 `C:\dev\hello`는 어제와 같아요. 끝 상태 확인: GitHub 저장소 페이지에 `Day 9: …` 커밋이 보여요.
:::

## 🧯 자주 막히는 곳

모든 문제와 드문 경우는 [문제 해결 모음](#/page/troubleshooting)에 있어요.

### CSS가 전혀 안 먹혀요 (글꼴·색이 그대로예요)

**원인:** 브라우저가 `style.css`를 찾지 못했거나 읽었는데 규칙이 틀렸어요. 가장 흔한 이유는 다섯 가지예요. ① `<link>`의 `href` 경로 오타. ② `rel="stylesheet"`를 빠뜨렸어요. ③ `style.css`가 `css` 폴더 밖에 있어요. ④ 파일 이름이 `style.css.css`나 `style.css.txt`예요. ⑤ 폴더 이름이 `Css`처럼 대문자예요(인터넷에 올린 뒤에 깨져요).

**해결:**

1. VS Code 탐색기에서 `MY-CREATOR-SITE` 아래 `css` 폴더와 그 안의 `style.css`를 확인해요. 파일 이름이 다르면 `F2`로 고쳐요.
2. HTML의 `<link rel="stylesheet" href="css/style.css">` 줄이 한 글자도 다르지 않은지 비교해요.
3. 저장하고 브라우저 탭에서 `Ctrl + F5`로 강력 새로 고침해요.
4. 개발자 도구 Elements에서 `<head>`를 펼쳐 `link` 줄을 클릭하고, 오른쪽 위에 오류 표시가 없는지 확인해요.
5. 글꼴과 링크 색이 바뀌면 해결된 거예요.

### 일부 규칙만 먹고 나머지는 안 먹어요

**원인:** CSS는 중괄호 `{ }`나 세미콜론 `;`을 빠뜨리면 그 규칙 이후가 무시되거나 엉뚱하게 해석돼요. VS Code는 이런 곳에 빨간 물결 밑줄을 그어 알려 줘요.

**해결:**

1. `style.css`에서 빨간 물결 밑줄이 있는 곳에 마우스를 올려 메시지를 읽어요.
2. 규칙마다 `{`가 하나, `}`가 하나인지, 속성 줄마다 끝에 `;`이 있는지 확인해요.
3. 고치고 저장한 뒤 브라우저 탭에서 `Ctrl + F5`로 새로 고침해요.
4. 모든 규칙이 적용되면 해결된 거예요.

### 한글 입력 상태로 쳤더니 : ; { } 모양이 이상해요

**원인:** 한글 입력 상태에서 기호를 치면 전각 문자(`：`, `；`, `｛` 같은 폭이 넓은 기호)가 입력될 수 있어요. 모양이 비슷해도 CSS는 알아보지 못해서 규칙이 무시돼요.

**해결:**

1. `한/영` 키를 눌러 영어 입력 상태(작업 표시줄 오른쪽 아래 **A**)로 바꿔요.
2. 이상하게 넓어 보이는 `：`, `；`, `｛`, `｝`를 지우고 다시 입력해요. VS Code가 이상한 문자에 노란 상자로 표시해 주기도 해요.
3. 저장하고 새로 고침해서 규칙이 적용되면 해결된 거예요.

### class="site-header"에 점을 붙였더니 안 먹어요

**원인:** HTML의 `class` 값에는 점을 쓰지 않아요. 점(`.`)은 CSS 선택자에서 "클래스를 고른다"는 표시예요. `class=".site-header"`라고 쓰면 이름이 `.site-header`인 클래스가 되어 CSS의 `.site-header`와 맞지 않아요.

**해결:**

1. HTML에서 `class="site-header"`처럼 점 없이 써요.
2. CSS에서는 `.site-header { … }`처럼 앞에 점을 써요.
3. 저장하고 새로 고침해요. 머리글 배경이 연보라가 되면 해결된 거예요.

### 고쳤는데 화면이 그대로예요 (캐시)

**원인:** 브라우저가 이전에 받은 `style.css`를 보관해 두고 다시 쓰는 경우가 있어요. 파일은 바뀌었는데 화면은 옛 모양이에요. 저장을 안 했을 수도 있어요.

**해결:**

1. VS Code 탭에 ●가 있는지 보고, 있으면 `Ctrl + S`로 저장해요.
2. 브라우저 탭을 클릭하고 `Ctrl + F5`(노트북은 `Ctrl + Fn + F5`)를 눌러 강력 새로 고침해요.
3. 개발자 도구를 연 상태에서 새로 고침 버튼을 오른쪽 클릭해 **캐시 비우기 및 강력 새로 고침**을 고를 수도 있어요. 이름은 버전에 따라 조금 달라요.
4. 화면이 바뀌면 해결된 거예요.

### 한 페이지만 CSS가 안 먹어요

**원인:** 그 페이지의 `<head>`에 `<link rel="stylesheet" href="css/style.css">` 줄이 빠져 있어요. CSS는 페이지마다 연결해야 해요.

**해결:**

1. 안 바뀐 페이지의 HTML을 열어요.
2. `<title>…</title>` 줄 바로 아래에 `<link rel="stylesheet" href="css/style.css">`를 넣어요.
3. 저장하고 새로 고침해요. 다섯 페이지 모두 모양이 같아지면 해결된 거예요.
## 📝 오늘의 체크리스트

- [ ] 탐색기에 `css` 폴더와 `style.css`가 있어요(파일 이름 뒤에 `.txt`가 없어요).
- [ ] 다섯 페이지 모두 글꼴이 맑은 고딕 계열로 바뀌고 링크가 보라색이에요.
- [ ] 머리글과 바닥글의 배경이 연보라이고, 바닥글 글자가 가운데 정렬된 회색이에요.
- [ ] 개발자 도구 Styles 창에서 `style.css`의 규칙을 볼 수 있어요.
- [ ] 개발자 도구에서 고친 값이 새로 고침하면 사라지는 이유를 설명할 수 있어요.
- [ ] 고쳤는데 안 바뀔 때 `Ctrl + F5`를 눌러야 한다는 것을 알아요.
- [ ] GitHub 저장소 페이지에 `Day 9: …` 커밋이 보여요.
- [ ] 과제 1~3을 했어요(과제 2의 `h1` 규칙은 지웠어요).

## 📚 더 알아보기

- [MDN · CSS 첫걸음](https://developer.mozilla.org/ko/docs/Learn_web_development/Core/Styling_basics/Getting_started): CSS 규칙과 선택자의 기본을 단계별로 설명해요.
- [MDN · CSS 선택자](https://developer.mozilla.org/ko/docs/Web/CSS/Guides/Selectors): 선택자의 종류를 한눈에 보여 줘요.
- [MDN · font-family(영어)](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-family): 글꼴 목록을 쓰는 규칙을 설명해요.

➡️ **다음 Day 예고:** [Day 10 · 박스 모델](#/day/p1-d10)에서는 모든 요소가 상자라는 사실을 배우고, 여백과 테두리로 페이지를 가운데에 모아요.
