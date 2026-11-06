## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- 로고는 왼쪽, 메뉴 5개는 오른쪽에 가로 한 줄로 늘어선 머리글을 만들 수 있어요.
- 지금 보고 있는 페이지의 메뉴만 보라색으로 강조되게 만들 수 있어요(`aria-current`).
- 홈에 둥근 버튼 모양의 링크 2개를 만들 수 있어요.
- [[Flexbox]]의 `display: flex`, `gap`, `justify-content`, `align-items`가 각각 무엇을 하는지 내 말로 설명할 수 있어요.

**예상 시간: 100분** (개념 이해 22분 · 따라하기 56분 · 과제 17분 · 정리 5분)

:::path 📂 시작 상태
어제(Day 10)까지 만든 파일이 이렇게 있어야 해요. 없거나 다르면 [Day 10](#/day/p1-d10)의 "오늘 끝 상태 전체 코드"로 맞춰 주세요.

- `C:\dev\my-creator-site\index.html`, `about.html`, `contents.html`, `schedule.html`, `contact.html`
- `C:\dev\my-creator-site\css\style.css`
- `C:\dev\my-creator-site\images\profile.svg`, `logo.svg`
- 다섯 페이지에 `container`·`header-inner` 상자가 들어 있고, 메뉴는 아직 점(•)이 붙은 세로 목록이에요.
- VS Code에서 `C:\dev\my-creator-site` 폴더가 열려 있고, Live Preview 확장 프로그램이 설치되어 있어요.
- Git 설정과 GitHub 저장소 `https://github.com/<내 아이디>/my-creator-site`가 연결되어 있고, 어제 변경은 모두 커밋·푸시했어요(소스 제어 패널의 변경 0개).
- 연습 폴더 `C:\dev\hello`의 파일들은 오늘 쓰지 않아요.
:::

## 📖 개념 이해

### 한 줄로 늘어놓기: Flexbox

**비유:** 책꽂이를 떠올려 보세요. 책(자식)들은 책꽂이(부모) 안에 한 줄로 꽂혀요. 책 사이의 간격을 벌리거나, 책을 왼쪽·가운데·오른쪽으로 몰아 꽂거나, 책 높이를 맞춰 정렬할 수 있어요.

**정확한 정의:** **[[Flexbox]]**(플렉스박스)는 자식 요소들을 한 줄(가로 또는 세로)로 늘어놓고 정렬하는 CSS 배치 방법이에요. 부모에 `display: flex;`를 쓰면 그 부모의 **바로 아래 자식들**이 한 줄로 늘어서요. 자식의 자식은 영향을 받지 않아요.

Flexbox에는 방향이 두 개 있어요.

- **[[주축]]**(main axis)은 자식들이 늘어서는 방향이에요. 기본값은 가로(왼쪽에서 오른쪽)예요.
- **[[교차축]]**(cross axis)은 주축과 직각인 방향이에요. 주축이 가로면 교차축은 세로예요.

```text
주축 (가로) →
┌──────┬──────┬──────┐ ↑
│ 로고 │ 메뉴 │ 버튼 │ │ 교차축
└──────┴──────┴──────┘ ↓ (세로)
```

자주 쓰는 속성은 이 정도예요. 모두 **부모**에 써요.

| 속성 | 하는 일 | 예 |
|---|---|---|
| `display: flex` | Flexbox 시작 | |
| `gap` | 자식 사이 간격 | `0.5rem` |
| `justify-content` | 주축 정렬 | `center` |
| `align-items` | 교차축 정렬 | `center` |
| `flex-wrap` | 줄이 모자라면 아래 줄로 | `wrap` |
| `flex-direction` | 주축 방향 바꾸기 | `column` |

`flex-wrap: wrap;`이 없으면 자식들은 한 줄에 억지로 끼어 들어가요. 있으면 자리가 모자랄 때 다음 줄로 내려가요. 오늘 머리글과 메뉴가 좁은 창에서 줄바꿈되는 이유예요.

**margin-left: auto 요령.** Flexbox 안의 자식에 `margin-left: auto;`를 쓰면, 그 자식 왼쪽의 남는 공간을 전부 차지해서 자식이 **오른쪽 끝으로 밀려요**. 로고는 왼쪽에 두고 메뉴만 오른쪽으로 보낼 때 써요.

:::info 실무에서는
메뉴 바, 버튼 묶음, 카드 안의 아이콘과 글자처럼 "한 줄로 놓는 것"은 거의 Flexbox로 만들어요. 줄과 칸이 함께 있는 격자 배치는 내일(Day 12) 배우는 Grid가 맞아요. 개발자 도구(브라우저에서 연 페이지의 `F12`) Elements 패널에는 flex가 켜진 요소 옆에 `flex` 배지가 붙어서, 눌러 보면 칸의 경계를 화면에 그려 줘요.
:::

### 메뉴를 메뉴답게: 목록 초기화와 링크 넓히기

메뉴는 `<ul>`(점이 붙은 세로 목록)에 `<a>` 링크가 들어 있는 모양이에요. 메뉴로 쓰려면 세 가지를 고쳐요.

- `list-style: none;`으로 앞의 점(•)을 없애요.
- `margin: 0; padding: 0;`으로 브라우저가 `ul`에 기본으로 넣는 바깥·안쪽 여백(왼쪽 들여쓰기)을 없애요.
- `text-decoration: none;`으로 링크의 밑줄을 없애요.

링크 `a`는 원래 글자 크기만큼만 눌려요(인라인 요소, Day 6). `display: block;`과 `padding`을 주면 글자 둘레의 넓은 영역을 누를 수 있어서 손가락으로도 누르기 쉬워져요.

### 지금 위치를 알려 주기: ARIA와 속성 선택자

사람은 보라색 배경을 보고 "아, 지금 소개 페이지구나" 하고 알아요. 그런데 화면을 읽어 주는 [[스크린 리더]]를 쓰는 사람에게는 색이 보이지 않아요. 그래서 HTML에 **지금 이 링크가 현재 페이지예요**라는 정보를 글자로 적어 둬요.

**[[ARIA]]**(애리아)는 스크린 리더 같은 보조 기술에게 요소의 역할과 상태를 알려 주는 HTML 속성 묶음이에요. 이름이 `aria-`로 시작해요. 오늘 쓰는 `aria-current="page"`는 "이 링크가 지금 보고 있는 페이지예요"라는 뜻이에요. ARIA 속성은 화면 모양을 바꾸지 않아요. 모양은 CSS가 따로 맞춰요.

CSS는 이 속성을 보고 모양을 정할 수 있어요. 대괄호로 속성을 고르는 **[[속성 선택자]]**(attribute selector)를 써요.

```css
.menu-list a[aria-current="page"] {
  background: #5b4bdb;
}
```

읽는 법은 "`.menu-list` 안에 있는(Day 10 자손 선택자) `a` 중에서 `aria-current`의 값이 `page`인 것"이에요. 클래스를 따로 만들지 않고도, 접근성 정보와 모양을 **한 속성으로** 맞출 수 있는 것이 장점이에요.

### 링크도 버튼처럼: .button

`<a>`와 `<button>`은 역할이 달라요. 링크는 "다른 곳으로 이동", 버튼은 "그 자리에서 무언가 실행"이에요. 오늘 홈에 만드는 "영상 보러 가기"는 이동이니까 `<a>`를 쓰고, 모양만 버튼처럼 꾸며요. 그래서 CSS에 `button, .button { … }`처럼 쉼표로 묶어 **진짜 `<button>`과 버튼 모양 링크**를 한 규칙으로 꾸며요.

- `border-radius: 999px;`은 아주 큰 값이라 양 끝이 반원인 알약 모양이 돼요.
- `cursor: pointer;`는 마우스를 올리면 손가락 모양이 되게 해요.
- `font: inherit;`는 글꼴을 주변 글자와 똑같이 맞춰요. `<button>`은 브라우저가 따로 작은 글꼴을 쓰기 때문에, 이 줄이 없으면 글자 모양만 달라 보여요.

## 🛠️ 따라하기

모두 10단계예요. 한 단계를 끝낼 때마다 성공 상자와 내 화면을 비교해요. 화면 확인은 Day 2에서 배운 **Live Preview**로 `index.html`을 열어 두고 하면 편해요(파일 탐색기에서 `index.html`을 더블클릭해도 같아요). 개발자 도구가 필요하면 Live Preview 미리 보기 창 위쪽의 주소(`http://127.0.0.1:3000/…`, 숫자는 달라도 돼요)를 복사해 Edge나 Chrome 주소창에 붙여 넣어 열어요. VS Code 안의 미리 보기 창에서는 `F12`가 열리지 않아요.

### 1단계 · 오늘 시작 화면 확인하기 (3분)

바꾸기 전의 모습을 눈에 담아 두면, 바꾼 뒤에 무엇이 달라졌는지 알 수 있어요.

**어디서:** VS Code 왼쪽 **탐색기**에서 `index.html`을 열고, Live Preview로 미리 보기를 열어요.

**무엇을:**

1. VS Code 왼쪽 탐색기에서 `index.html`을 클릭해요.
2. 편집기 오른쪽 위에 있는 미리 보기 아이콘(Live Preview, 화면 모양)을 클릭해요. 안 보이면 `Ctrl + Shift + P`를 누르고 `Live Preview`를 입력해 목록에서 미리 보기를 여는 항목을 골라요(이름은 버전에 따라 조금 다를 수 있어요).

:::success
화면 위쪽에 연보라 머리글이 보이고, 그 안에 로고와 점(•)이 붙은 세로 메뉴 5개(홈·소개·영상·방송 일정·문의)가 보여요. 오늘 이 세로 메뉴를 가로 메뉴로 바꿔요.
:::

### 2단계 · index.html의 머리글 고치기 (5분)

HTML에는 CSS가 붙잡을 이름표(class)와 현재 페이지 표시(`aria-current`)를 먼저 달아요.

**어디서:** VS Code, `C:\dev\my-creator-site\index.html`

**무엇을:**

1. `<header class="site-header">`부터 `</header>`까지(머리글 전체)를 마우스로 드래그해서 선택하고 지워요.
2. 그 자리에 아래 블록을 붙여 넣어요. 바뀐 점은 세 가지예요. 로고 링크에 `class="logo"`, `<nav>`에 `class="site-nav"`, `<ul>`에 `class="menu-list"`가 생겼고, 홈 링크에 `aria-current="page"`가 붙었어요.
3. `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\index.html (일부)
```html
  <header class="site-header">
    <div class="container header-inner">
      <a class="logo" href="index.html">
        <img src="images/logo.svg" alt="" width="36" height="36">
        <span>달빛곰 방송국</span>
      </a>
      <nav class="site-nav">
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

머리글 모양이 조금 달라도(예: 들여쓰기 칸 수) 괜찮아요. 위 블록처럼 class 이름과 `aria-current`가 들어가 있으면 돼요.

:::success
저장해도 화면 모양은 아직 그대로예요. 아직 CSS를 안 썼으니까요. 확인은 다음 단계에서 해요.
:::

### 3단계 · 나머지 네 페이지의 머리글 고치기 (8분)

다섯 페이지는 머리글이 똑같아야 해요. `aria-current="page"`만 **자기 페이지 메뉴**에 붙어요.

**어디서:** VS Code, `about.html`, `contents.html`, `schedule.html`, `contact.html`을 차례로 열어요.

**무엇을:**

1. 2단계에서 `index.html`에 붙여 넣은 머리글 블록(`<header …>`부터 `</header>`까지)을 드래그해서 복사해요(`Ctrl + C`).
2. `about.html`을 열고 머리글 전체를 선택해 지운 뒤 붙여 넣어요(`Ctrl + V`).
3. 홈 링크 줄에서 ` aria-current="page"`를 지우고, 자기 페이지 줄에 붙여요. 페이지별로 붙일 줄은 이래요.

- `about.html`: `<li><a href="about.html" aria-current="page">소개</a></li>`
- `contents.html`: `<li><a href="contents.html" aria-current="page">영상</a></li>`
- `schedule.html`: `<li><a href="schedule.html" aria-current="page">방송 일정</a></li>`
- `contact.html`: `<li><a href="contact.html" aria-current="page">문의</a></li>`

4. 나머지 세 페이지도 같은 방법으로 고치고, 페이지마다 `Ctrl + S`로 저장해요.
5. 모두 끝났는지 확인해요. `Ctrl + Shift + F`(**파일에서 찾기**)를 누르고 검색 칸에 `aria-current`를 입력해요.

:::success
검색 결과에 파일이 5개 나오고, 파일마다 줄이 정확히 1개씩 보여요(합계 5개). 그리고 각 줄의 글자가 `홈`, `소개`, `영상`, `방송 일정`, `문의`로 서로 달라요. 홈 줄이 두 번 나오면 복사 실수예요. 아래 🧯 자주 막히는 곳의 "모든 페이지에서 홈 메뉴만 강조돼요"를 보세요.
:::

### 4단계 · 로고와 메뉴를 한 줄로: .header-inner를 flex로 (7분)

머리글 안의 로고와 메뉴를 나란히 놓으려면 둘을 감싸는 부모에 `display: flex;`를 줘요. 부모는 Day 10에 만든 `header-inner` 상자예요.

**어디서:** VS Code, `C:\dev\my-creator-site\css\style.css`, `4. 헤더와 내비게이션 (Day 11)` 구역

**무엇을:**

1. `.header-inner { … }` 규칙을 찾아 아래 블록으로 바꿔요. 이미 있던 `padding-top`, `padding-bottom` 두 줄은 그대로이고, 위에 4줄(Flexbox)이 늘었어요.
2. 같은 블록 아래에 있는 `.logo`, `.logo img` 규칙도 함께 붙여 넣어요(새 규칙이에요).
3. `Ctrl + S`로 저장하고 미리 보기를 확인해요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
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
  color: #1d1b2e;
  font-weight: 700;
  text-decoration: none;
}

.logo img {
  display: block;
  border-radius: 8px;
}
```

`.logo`는 그림과 글자를 한 줄로 놓는 작은 Flexbox예요. `align-items: center;`가 그림과 글자의 **세로 가운데**를 맞춰요.

:::success
로고(초승달 그림과 `달빛곰 방송국` 글자)가 한 줄로 나란히 보이고, 같은 줄 오른쪽에 점이 붙은 세로 메뉴가 바짝 붙어 있어요. 로고와 메뉴가 같은 줄에 앉았다면 Flexbox가 켜진 거예요. 그대로 세로로만 쌓여 있다면 `.header-inner`의 `display: flex;`가 들어갔는지 확인하세요.
:::

### 5단계 · 메뉴를 가로로 놓고 오른쪽으로 밀기 (6분)

메뉴 `ul`도 부모가 되어 `li`들을 가로로 늘어놓아요. 이번에는 `nav`에 `margin-left: auto;`를 써서 메뉴 전체를 오른쪽 끝으로 밀어요.

**어디서:** VS Code, `C:\dev\my-creator-site\css\style.css`, `.logo img` 규칙 바로 아래

**무엇을:**

1. `.logo img { … }` 규칙이 끝나는 `}` 아래 한 줄을 비우고, 아래 블록을 붙여 넣어요.
2. `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
.site-nav {
  margin-left: auto;
}

.menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}
```

- `.site-nav { margin-left: auto; }`는 로고와 메뉴 사이의 빈 공간을 모두 차지해서 메뉴를 오른쪽 끝으로 보내요.
- `.menu-list`는 점과 여백을 없애고(`list-style: none; margin: 0; padding: 0;`), `display: flex;`로 `li`를 가로로 늘어놔요. `flex-wrap: wrap;`은 자리가 모자라면 다음 줄로 내려가게 하고, `gap: 0.25rem;`은 메뉴 사이를 4px 띄워요.

:::success
메뉴 5개(홈·소개·영상·방송 일정·문의)가 점 없이 가로 한 줄로 늘어서고, 로고는 왼쪽 끝, 메뉴는 오른쪽 끝에 있어요. 아직 링크에는 파란 밑줄이 있어요. 다음 단계에서 꾸며요.
:::

### 6단계 · 메뉴 링크 꾸미기와 현재 페이지 강조 (6분)

링크를 넓은 클릭 영역으로 만들고, 현재 페이지 메뉴만 속성 선택자로 보라색으로 칠해요.

**어디서:** VS Code, `C:\dev\my-creator-site\css\style.css`, `.menu-list` 규칙 바로 아래

**무엇을:**

1. `.menu-list { … }` 규칙이 끝나는 `}` 아래 한 줄을 비우고, 아래 블록을 붙여 넣어요.
2. `Ctrl + S`로 저장하고 `index.html`의 미리 보기를 확인해요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
.menu-list a {
  display: block;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  color: #1d1b2e;
  text-decoration: none;
}

/* 지금 보고 있는 페이지 표시 */
.menu-list a[aria-current="page"] {
  background: #5b4bdb;
  color: #ffffff;
  font-weight: 700;
}
```

:::success
메뉴 링크의 파란 밑줄이 사라지고 글자가 진한 색으로 바뀌어요. `홈`만 보라색 알약 배경에 흰 글자로 굵게 보여요. 다른 페이지(소개 등)를 열어도 그 페이지의 메뉴만 보라색이어야 해요. 소개 페이지에서 `홈`이 보라색이라면 3단계의 `aria-current` 위치를 확인하세요.
:::

### 7단계 · 홈에 버튼 모양 링크 2개 넣기 (4분)

홈 소개 글 아래에 "영상 보러 가기"와 "방송 일정 보기" 링크를 만들어요. 이 단계는 HTML만 고쳐요.

**어디서:** VS Code, `C:\dev\my-creator-site\index.html`, `<main>` 안의 첫 번째 `<section>`

**무엇을:**

1. 소개 문단 `<p>게임, 토크, 음악을 넘나드는 …</p>`를 찾아요.
2. 그 문단 바로 아래(같은 `<div>` 안, `</div>` 앞)에 아래 블록을 붙여 넣어요.
3. `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\index.html (일부)
```html
        <p class="hero-actions">
          <a class="button" href="contents.html">영상 보러 가기</a>
          <a class="button button-outline" href="schedule.html">방송 일정 보기</a>
        </p>
```

`class="button button-outline"`은 클래스를 **두 개** 붙인 거예요. 빈칸으로 구분해요. 쉼표를 넣으면(`button, button-outline`) 클래스 이름이 달라져서 안 먹으니 조심하세요.

:::success
소개 글 아래에 파란 밑줄 링크 두 개 `영상 보러 가기`, `방송 일정 보기`가 나란히 보여요. 눌러 보면 각각 영상 페이지와 일정 페이지로 이동해요.
:::

### 8단계 · 버튼 모양 CSS 쓰기 (7분)

링크를 알약 모양 버튼으로 바꾸고, 두 링크를 한 줄로 놓는 Flexbox를 써요. 새 구역 `5. 공통 부품`을 4번과 6번 사이에 만들어요.

**어디서:** VS Code, `C:\dev\my-creator-site\css\style.css`

**무엇을:**

1. `.menu-list a[aria-current="page"] { … }` 규칙 아래에서 `/* ---------- 6. 페이지별 ---------- */` 주석을 찾아요.
2. 그 주석 **바로 위**에 아래 블록을 붙여 넣어요. 구역 주석 `5. 공통 부품`까지 포함돼 있어요.
3. 이어서 `/* 홈: 소개 영역 */` 주석 아래의 `.hero-image { … }` 규칙 바로 아래에 `.hero-actions` 규칙을 붙여 넣어요.
4. `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
/* ---------- 5. 공통 부품 ---------- */
button,
.button {
  display: inline-block;
  font: inherit;
  padding: 0.5rem 1rem;
  border: 2px solid #5b4bdb;
  border-radius: 999px;
  background: #5b4bdb;
  color: #ffffff;
  text-decoration: none;
  cursor: pointer;
}

.button-outline {
  background: transparent;
  color: #1d1b2e;
}
```

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
```

- `button, .button`은 `<button>`과 `class="button"`인 링크를 같은 모양으로 꾸며요. 쉼표는 "이것도 저것도"라는 뜻이에요(Day 9).
- `.button-outline`은 배경을 투명하게 하고 글자를 진한 색으로 바꿔서 **테두리만 있는** 버튼을 만들어요. `.button`과 함께 쓰면 `.button`의 테두리는 그대로 두고 배경과 글자색만 덮어써요.
- `.hero-actions`는 두 링크를 가로로 놓고(`display: flex`), 자리가 모자라면 아래 줄로 내리고(`flex-wrap`), 사이를 12px 띄워요(`gap: 0.75rem`).

:::success
홈의 두 링크가 알약 모양 버튼으로 바뀌어요. `영상 보러 가기`는 보라색으로 채운 버튼에 흰 글자, `방송 일정 보기`는 보라색 테두리만 있는 버튼에 진한 글자예요. 마우스를 올리면 손가락 모양이 돼요. 문의 페이지(`contact.html`)를 열면 `보내기` 버튼도 같은 보라색 알약 모양이에요(`button` 규칙이 적용돼서 그래요).
:::

### 9단계 · 창을 좁혀 보고 다섯 페이지 점검하기 (5분)

좁은 화면에서 메뉴가 어떻게 되는지, 다섯 페이지 모두 제대로 강조되는지 눈으로 확인해요.

**어디서:** Edge 또는 Chrome에서 연 `index.html`(파일 탐색기에서 더블클릭해도 되고, Live Preview 주소를 붙여 넣어도 돼요)

**무엇을:**

1. 브라우저 창의 오른쪽 가장자리를 마우스로 잡고 왼쪽으로 천천히 끌어 창을 좁혀요.
2. 메뉴가 로고 아래 줄로 내려가는 순간을 찾아봐요.
3. 메뉴의 `소개`, `영상`, `방송 일정`, `문의`를 차례로 눌러 다섯 페이지를 모두 열어 봐요. 열 때마다 강조된 메뉴가 지금 페이지와 같은지 봐요.
4. (선택) 브라우저에서 `F12`를 눌러 개발자 도구의 **Elements** 패널을 열고, `<div class="container header-inner">` 줄 옆의 `flex` 배지를 눌러 봐요.

:::success
창이 좁아지면 메뉴 전체가 로고 아래 줄로 내려가고, 더 좁아지면 메뉴 항목도 다음 줄로 넘어가 줄바꿈돼요. 다섯 페이지 모두에서 지금 페이지의 메뉴 하나만 보라색이에요. `flex` 배지를 누르면 로고와 메뉴를 감싸는 칸의 경계선이 화면에 그려져요(개발자 도구 모양은 버전에 따라 조금 달라요).
:::

### 10단계 · 오늘 작업 커밋·푸시 (5분)

오늘 바뀐 파일을 Git에 기록하고(커밋) GitHub로 올려요(푸시). 매일 마지막에 하는 습관이에요. Day 7·8에서 한 것과 똑같아요.

**어디서:** VS Code, `C:\dev\my-creator-site` 폴더가 열린 창. 왼쪽 세로 막대의 가지 모양 아이콘(**소스 제어**, `Ctrl + Shift + G`)

**무엇을 (방법 A, 소스 제어 패널):**

1. 위쪽 **메시지** 칸을 클릭하고 `Day 11: Flexbox, 메뉴와 버튼`를 입력해요.
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
git commit -m "Day 11: Flexbox, 메뉴와 버튼"
```

예상 출력(`a1b2c3d` 같은 해시와 숫자는 달라도 돼요):

```text
[main a1b2c3d] Day 11: Flexbox, 메뉴와 버튼
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
브라우저에서 `https://github.com/<내 아이디>/my-creator-site`를 열고 새로 고침(`F5`)하면, 파일 목록 위에 방금 쓴 커밋 메시지 `Day 11: Flexbox, 메뉴와 버튼`가 보여요. VS Code 소스 제어 패널의 변경 목록은 비어 있어요.
:::

## ✍️ 과제

### 과제 1 · 정렬 실험 (쉬움 ⭐, 5분)

`.hero-actions`의 `justify-content` 값을 바꾸면 버튼 위치가 어떻게 되는지 직접 봐요.

- `style.css`의 `.hero-actions { … }` 안에 `justify-content: center;`를 한 줄 추가하고 저장해서 홈 화면을 봐요.
- `space-between`, `flex-end`로도 바꿔 봐요. 값마다 버튼 두 개가 어디에 놓이는지 적어요.
- 확인이 끝나면 `justify-content` 줄을 **지워서** 오늘 끝 상태로 되돌려요.

힌트: 브라우저 창을 넓게 열어 두면 차이가 잘 보여요.

### 과제 2 · 현재 페이지 점검 (보통 ⭐⭐, 7분)

다섯 페이지를 모두 열어 강조된 메뉴가 맞는지 확인하고, 틀린 곳이 있으면 고쳐요.

- Live Preview나 브라우저에서 페이지를 하나씩 열어요.
- 강조된 메뉴(보라색)가 그 페이지의 이름과 같은지 표로 적어요.
- 다르거나 강조가 없는 페이지가 있으면 `aria-current="page"` 위치를 고쳐요.

힌트: `Ctrl + Shift + F`로 `aria-current`를 검색하면 5개 줄이 한눈에 보여요.

### 과제 3 · align-items를 지우면? (도전 ⭐⭐⭐, 5분)

`.logo`의 `align-items: center;` 줄을 잠깐 지우고 저장해서, 로고 그림과 글자의 위치가 어떻게 바뀌는지 관찰해요.

- 그림과 글자의 높이를 비교해요(그림은 36px, 글자 줄은 그보다 낮아요).
- 글자가 그림에 비해 위·가운데·아래 중 어디에 붙는지 적어요.
- 관찰이 끝나면 줄을 다시 써서 되돌려요.

힌트: 개발자 도구 Elements에서 `span` 요소 위에 마우스를 올리면 그 요소의 영역이 파랗게 표시돼요.

## ✅ 정답

:::answer 과제 1 정답 · 정렬 실험
`justify-content` 값별 모습이에요(버튼 두 개가 놓이는 자리, 가로 줄 기준).

| 값 | 모습 |
|---|---|
| (없음, 기본 `flex-start`) | 왼쪽 끝부터 나란히 |
| `center` | 가운데에 나란히 |
| `space-between` | 첫 버튼은 왼쪽 끝, 둘째 버튼은 오른쪽 끝 |
| `flex-end` | 오른쪽 끝에 나란히 |

**왜 이렇게 하나요?** `justify-content`는 **주축**(가로) 방향으로 자식들을 어떻게 나눠 놓을지 정해요. 남는 공간이 있어야 차이가 보여서, 부모(`.hero-actions`)가 넓을 때만 눈에 띄어요. 끝나면 줄을 지워서 오늘 끝 상태(기본값)로 돌려요.
:::

:::answer 과제 2 정답 · 현재 페이지 점검
페이지마다 `aria-current="page"`가 붙는 곳이에요.

| 페이지 | 붙는 링크 | 보라색으로 보이는 메뉴 |
|---|---|---|
| `index.html` | `<a href="index.html" aria-current="page">홈</a>` | 홈 |
| `about.html` | `<a href="about.html" aria-current="page">소개</a>` | 소개 |
| `contents.html` | `<a href="contents.html" aria-current="page">영상</a>` | 영상 |
| `schedule.html` | `<a href="schedule.html" aria-current="page">방송 일정</a>` | 방송 일정 |
| `contact.html` | `<a href="contact.html" aria-current="page">문의</a>` | 문의 |

**왜 이렇게 하나요?** 머리글은 다섯 페이지가 똑같고, 현재 페이지 표시만 달라요. 복사해서 붙인 뒤 `aria-current`를 옮기지 않으면 모든 페이지에서 `홈`이 강조돼요. 한 페이지에는 `aria-current="page"`가 **딱 하나**여야 해요.
:::

:::answer 과제 3 정답 · align-items를 지우면?
`align-items: center;`를 지우면 교차축(세로) 정렬이 기본값(`stretch`, 늘이기)으로 돌아가요. 글자 `span`이 그림과 같은 높이(36px)로 늘어나지만, 글자 자체는 늘어난 칸의 **맨 위**에 붙어요. 그래서 글자가 그림의 세로 가운데보다 위쪽에 놓여서 어긋나 보여요.

**왜 이렇게 하나요?** 높이가 다른 자식을 한 줄에 놓을 때는 교차축 정렬이 필요해요. `center`를 쓰면 높이가 달라도 가운데 선이 맞아요. 확인이 끝나면 `align-items: center;` 줄을 다시 써 넣어요.
:::

:::answer 오늘 끝 상태 전체 코드
막혔다면 아래 파일들로 맞추고 [Day 12](#/day/p1-d12)를 시작하세요. 바뀐 파일은 `css/style.css`와 다섯 페이지예요. 파일 하나를 통째로 바꿀 때는 VS Code에서 그 파일을 열고 `Ctrl + A`로 전체를 선택한 뒤 붙여 넣고 `Ctrl + S`로 저장해요.

```text
my-creator-site/
├─ about.html
├─ contact.html
├─ contents.html
├─ index.html
├─ schedule.html
├─ css/
│  └─ style.css
└─ images/
   ├─ logo.svg
   └─ profile.svg
```

📄 C:\dev\my-creator-site\css\style.css
```css
/* ==========================================================
   style.css - 달빛곰 방송국 전체 스타일 (모든 페이지가 함께 써요)
   ========================================================== */

/* ---------- 2. 기본 설정 (Day 9, 10) ---------- */
* {
  box-sizing: border-box; /* padding·border를 width 안에 포함해서 계산해요 */
}

body {
  margin: 0;
  background: #ffffff;
  color: #1d1b2e;
  font-family: system-ui, "Malgun Gothic", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
  line-height: 1.7;
}

img {
  max-width: 100%;
  height: auto;
}

a {
  color: #4a3bc7;
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
  background: #f4f2ff;
  border-bottom: 1px solid #d9d6ee;
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
  color: #1d1b2e;
  font-weight: 700;
  text-decoration: none;
}

.logo img {
  display: block;
  border-radius: 8px;
}

.site-nav {
  margin-left: auto;
}

.menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.menu-list a {
  display: block;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  color: #1d1b2e;
  text-decoration: none;
}

/* 지금 보고 있는 페이지 표시 */
.menu-list a[aria-current="page"] {
  background: #5b4bdb;
  color: #ffffff;
  font-weight: 700;
}

/* ---------- 5. 공통 부품 ---------- */
button,
.button {
  display: inline-block;
  font: inherit;
  padding: 0.5rem 1rem;
  border: 2px solid #5b4bdb;
  border-radius: 999px;
  background: #5b4bdb;
  color: #ffffff;
  text-decoration: none;
  cursor: pointer;
}

.button-outline {
  background: transparent;
  color: #1d1b2e;
}

/* ---------- 6. 페이지별 ---------- */

/* 홈: 소개 영역 */
.hero-image {
  width: 160px;
  border-radius: 50%;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

/* 소개 페이지 */
.about-image {
  width: 200px;
  border-radius: 12px;
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
  border: 1px solid #d9d6ee;
  text-align: left;
}

.schedule-table thead th {
  background: #f4f2ff;
}

/* ---------- 7. 푸터 ---------- */
.site-footer {
  border-top: 1px solid #d9d6ee;
  background: #f4f2ff;
  color: #5a5775;
  text-align: center;
  padding: 1.5rem 0;
}

.site-footer p {
  margin: 0;
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
    <div class="container header-inner">
      <a class="logo" href="index.html">
        <img src="images/logo.svg" alt="" width="36" height="36">
        <span>달빛곰 방송국</span>
      </a>
      <nav class="site-nav">
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
        <p>게임, 토크, 음악을 넘나드는 버라이어티 스트리머예요. 매주 월·수·금·토에 방송해요.</p>
        <p class="hero-actions">
          <a class="button" href="contents.html">영상 보러 가기</a>
          <a class="button button-outline" href="schedule.html">방송 일정 보기</a>
        </p>
      </div>
    </section>

    <section class="container">
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

    <section class="container">
      <h2>대표 영상</h2>
      <!-- YouTube 공유 → 퍼가기에서 복사한 iframe이에요 -->
      <iframe src="https://www.youtube.com/embed/aqz-KE-bpKQ" title="달빛곰 대표 영상 (예시 영상이에요)" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
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
    <p>카테고리를 고르거나 제목으로 검색해 보세요.</p>
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
    <div class="container">
      <p>&copy; 2026 달빛곰 방송국 · 연습용으로 만든 사이트예요.</p>
    </div>
  </footer>
</body>
</html>
```
:::

## 🧯 자주 막히는 곳

여기에 없는 증상은 [문제 해결 모음](#/page/troubleshooting)에서 찾아보세요.

### 메뉴가 세로로 그대로예요 (display: flex가 안 먹어요)

**원인:** `display: flex;`는 **자식들을 줄 세울 부모**에 써야 해요. 링크(`a`)나 `li`에 써도 그 안쪽만 바뀌어서 메뉴 모양은 그대로예요. 메뉴는 `ul`(`.menu-list`)에, 로고와 메뉴 한 줄은 `.header-inner`에 써요.

**해결:**

1. `style.css`에서 `.menu-list`와 `.header-inner` 규칙 안에 `display: flex;`가 있는지 확인해요.
2. 규칙 이름의 점(`.`)과 HTML의 class 이름 철자가 같은지 비교해요(`menu-list`, `header-inner`).
3. `Ctrl + S`로 저장하고 브라우저에서 `Ctrl + F5`를 눌러요. 메뉴가 가로로 늘어서면 해결이에요.

### 메뉴 앞에 점(•)이 남아 있거나 왼쪽에 이상한 여백이 있어요

**원인:** `ul`은 브라우저가 앞 점과 왼쪽 들여쓰기(`padding`)를 기본으로 넣어요. `list-style: none;`은 점을, `padding: 0;`은 들여쓰기를 없애요.

**해결:**

1. `.menu-list { … }` 규칙에 `list-style: none;`, `margin: 0;`, `padding: 0;` 세 줄이 있는지 확인해요.
2. 세미콜론(`;`)이 빠졌거나 한글 입력 상태로 쳐서 `；`(전각)로 들어가진 않았는지 봐요.
3. 저장하고 새로 고침해서 점이 사라지면 해결이에요.

### 모든 페이지에서 홈 메뉴만 강조돼요

**원인:** 머리글을 복사하면서 `aria-current="page"`까지 같이 복사했어요. 이 속성은 페이지마다 자기 메뉴에만 붙어야 해요.

**해결:**

1. `about.html`처럼 홈이 아닌 페이지를 열고, `홈` 줄에서 ` aria-current="page"`를 지워요.
2. 그 페이지의 자기 메뉴(소개 페이지라면 `소개`) 링크에 ` aria-current="page"`를 써 넣어요.
3. `Ctrl + Shift + F`로 `aria-current`를 검색해 다섯 줄이 서로 다른 글자인지 확인해요.

### 현재 페이지 메뉴가 강조되지 않아요 (속성 선택자)

**원인:** 속성 선택자는 따옴표와 대괄호가 짝이 맞아야 해요. `a[aria-current=page"]`처럼 따옴표 하나가 빠지거나 `]`가 없으면 그 규칙은 통째로 무시돼요.

**해결:**

1. `.menu-list a[aria-current="page"]`를 6단계의 블록과 글자 하나씩 비교해요. 대괄호 `[ ]`와 큰따옴표 `" "`가 짝을 이루는지 봐요.
2. HTML의 `aria-current="page"`에도 오타(`aria-curent`)가 없는지 봐요.
3. 저장하고 새로 고침해서 보라색 알약이 나타나면 해결이에요.

### 버튼 글꼴만 달라 보여요

**원인:** `<button>`은 브라우저가 따로 정한 작은 글꼴을 써요. `font: inherit;`가 빠지면 `보내기` 버튼 글자만 다르게 보여요.

**해결:**

1. `button, .button { … }` 규칙 안에 `font: inherit;` 줄을 넣어요.
2. 저장하고 문의 페이지를 새로 고침해서 `보내기` 글자가 주변 글자와 같은 글꼴이면 해결이에요.

### 메뉴가 오른쪽으로 가지 않아요

**원인:** `margin-left: auto;`를 `ul`(`.menu-list`)에 줬어요. 이 요령은 Flexbox 줄 안에서 **로고 옆의 자식**에 써야 하는데, 그 자식은 `nav`(`.site-nav`)예요. `ul`은 `nav` 안에 있어서 효과가 없어요.

**해결:**

1. `.menu-list`에서 `margin-left: auto;`를 지워요(`margin: 0;`은 그대로 둬요).
2. `.site-nav { margin-left: auto; }` 규칙이 있는지 확인해요.
3. 저장하고 새로 고침해서 메뉴가 오른쪽 끝에 붙으면 해결이에요.

## 📝 오늘의 체크리스트

- [ ] 넓은 창에서 로고는 왼쪽, 메뉴 5개는 오른쪽에 가로 한 줄로 보여요.
- [ ] 메뉴 앞에 점(•)이 없고 링크에 밑줄이 없어요.
- [ ] 다섯 페이지 모두에서 지금 페이지의 메뉴 하나만 보라색 배경에 흰 글자예요.
- [ ] 창을 좁히면 메뉴가 로고 아래 줄로 내려가요.
- [ ] 홈에 보라색으로 채운 버튼과 테두리만 있는 버튼이 보여요.
- [ ] 문의 페이지의 `보내기` 버튼도 보라색 알약 모양이에요.
- [ ] 과제 1~3을 풀고 정답과 비교했어요.
- [ ] GitHub 저장소에 `Day 11: Flexbox, 메뉴와 버튼` 커밋이 보여요.

## 📚 더 알아보기

- [MDN · Flexbox 기본 개념](https://developer.mozilla.org/ko/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox): 주축과 교차축, 정렬 속성을 그림으로 보여 줘요.
- [MDN · aria-current](https://developer.mozilla.org/ko/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-current): 현재 위치를 알리는 속성의 값과 쓰임을 설명해요.
- [MDN · 속성 선택자](https://developer.mozilla.org/ko/docs/Web/CSS/Attribute_selectors): 대괄호로 요소를 고르는 여러 방법을 보여 줘요.

➡️ **다음 Day 예고:** [Day 12 · Grid](#/day/p1-d12)에서는 방송 소개와 영상 목록을 카드로 바꾸고, 화면 폭에 따라 3칸·2칸·1칸으로 저절로 바뀌는 카드 그리드를 만들어요.
