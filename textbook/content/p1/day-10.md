## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- 모든 요소가 상자라는 박스 모델을 이해하고, 내용·padding·border·margin의 차이를 설명할 수 있어요.
- `box-sizing: border-box`가 왜 필요한지 계산으로 보일 수 있어요.
- `px`, `rem`, `%` 단위를 구별하고, `max-width`와 `margin: 0 auto`로 내용을 가운데에 모을 수 있어요.
- 자손 선택자를 읽고 써서 표를 꾸밀 수 있어요.

**예상 시간: 90분** (개념 이해 15분 · 따라하기 45분 · 과제 25분 · 정리 5분)

:::path 📂 시작 상태
어제(Day 9)까지 만든 파일이 이렇게 있어야 해요. 없거나 다르면 [Day 9](#/day/p1-d09)의 "오늘 끝 상태 전체 코드"로 맞춰 주세요.

- `C:\dev\my-creator-site\index.html`, `about.html`, `contents.html`, `schedule.html`, `contact.html`
- `C:\dev\my-creator-site\css\style.css`
- `C:\dev\my-creator-site\images\profile.svg`, `C:\dev\my-creator-site\images\logo.svg`
- `C:\dev\hello\hello.html`, `favorites.html`, `tools.html`, `links.html`, `plan.html`, `pages\back.html`
- Git이 설치되어 있고(`git --version`의 예상 출력은 `git version 2.56.0.windows.4`, 숫자는 달라도 돼요) GitHub 공개 저장소 `my-creator-site`와 연결되어 있어요.
- 어제까지의 변경이 모두 커밋·푸시되어 있어요. 소스 제어 패널에 바뀐 파일이 없어요.
- VS Code에서 `C:\dev\my-creator-site` 폴더가 열려 있어요.
:::

## 📖 개념 이해

### 박스 모델: 모든 요소는 상자예요

**비유부터 볼게요.** 택배로 도자기를 보낸다고 해 봐요. 도자기(내용)를 완충재(안쪽 여백)로 감싸고, 상자(테두리)에 넣고, 상자와 상자 사이에는 간격(바깥 여백)을 두고 쌓아요. 웹페이지의 요소도 이렇게 네 겹이에요.

**정확한 정의는 이래요.** **[[박스 모델]]**(box model)은 브라우저가 모든 요소를 네모 상자로 보고 크기를 계산하는 방식이에요. 안쪽부터 네 겹이에요.

```text
┌─ margin (바깥 여백) ─────┐
│ ┌─ border (테두리) ───┐ │
│ │ ┌─ padding ──────┐  │ │
│ │ │   내용(content) │  │ │
│ │ └────────────────┘  │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

- 내용(content): 글자나 그림이 들어가는 자리예요.
- **[[padding]]**(패딩)은 내용과 테두리 사이의 안쪽 여백이에요. 배경색은 padding까지 칠해져요.
- **[[border]]**(보더)는 상자의 테두리 선이에요. `border: 1px solid #d9d6ee;`처럼 두께, 모양(`solid`는 실선), 색을 한 줄에 써요.
- **[[margin]]**(마진)은 테두리 바깥 여백이에요. 다른 요소와의 거리를 정해요. 좌우를 `auto`로 두면(`margin: 0 auto;`) 남는 공간을 양쪽이 반씩 나눠서 상자가 가운데로 와요. 위아래로 붙은 두 상자의 margin은 더해지지 않고 큰 쪽 하나만 남기도 해요(마진 겹침). 이상한 게 아니라 원래 그런 거예요.

### 블록 상자와 인라인 상자

Day 6에서 배운 블록 요소(한 줄을 통째로 차지)와 인라인 요소(글자 흐름에 끼임)는 박스 모델에서 이렇게 달라져요. 블록 요소는 가로 폭을 정할 수 있고 위아래 margin도 적용돼요. 인라인 요소는 글자 크기만큼만 자리를 차지해서 가로 폭을 정할 수 없고, 위아래 margin도 거의 효과가 없어요. `display: block`은 요소를 블록으로, `display: inline-block`은 "한 줄에 놓이지만 폭과 높이를 가지는" 요소로 바꿔요. 오늘은 맛보기이고, 내일(Day 11)부터 더 써요.

### `box-sizing`: 폭을 어떻게 셀까요

`width: 200px`인 상자에 `padding: 20px`과 `border: 2px`를 주면 전체 폭은 몇 px일까요? **[[box-sizing]]**(박스 사이징)은 이 계산 방식을 정하는 CSS 속성이에요.

- `content-box`(기본값): `width`는 내용 폭만이에요. 전체 폭 = 200 + 20×2 + 2×2 = **244px**. 여백을 더할수록 상자가 커져서 계산이 어려워요.
- `border-box`: `width`가 padding과 border까지 포함해요. 전체 폭 = **200px**. 정한 폭이 그대로 유지돼요.

그래서 모든 요소를 `border-box`로 바꾸는 규칙 `* { box-sizing: border-box; }`를 맨 위에 써요. `*`는 "모든 요소"를 고르는 선택자예요.

### 단위: `px`, `rem`, `%`

- **[[px]]**(픽셀)는 화면의 점 하나를 기준으로 한 고정 길이예요. `1px` 테두리처럼 정확히 고정된 크기에 써요. 사용자가 브라우저 글자 크기를 키워도 그대로예요.
- **[[rem]]**(렘)은 문서의 기본 글자 크기를 1로 보는 단위예요. 기본 글자 크기가 16px이면 `1rem`은 16px, `1.5rem`은 24px이에요. 사용자가 글자 크기를 키우면 함께 커져서 읽기 편해요. 글자 크기와 여백에는 보통 `rem`을 써요.
- `%`는 부모 요소 크기의 몇 퍼센트인지예요.

### 가운데 정렬 상자 `.container`

폭이 넓은 화면에서 글이 양 끝까지 퍼지면 읽기 힘들어요. 그래서 내용을 폭이 정해진 상자에 담고 가운데에 놔요.

```css
.container {
  max-width: 960px;
  margin: 0 auto;
}
```

`max-width: 960px`는 "960px보다는 넓어지지 마세요, 좁아지는 건 괜찮아요"라는 뜻이에요. 화면이 좁으면 상자도 따라 좁아져요. `margin: 0 auto`가 남는 공간을 좌우로 반씩 나눠서 가운데에 와요.

### 자손 선택자

**[[자손 선택자]]**(descendant selector)는 두 선택자를 빈칸으로 띄어 써서, 앞 요소 **안에** 들어 있는 뒤 요소만 고르는 CSS 선택자예요. `.site-footer p`는 `.site-footer` 안의 `p`만 골라요. 몇 겹 안쪽에 있어도 골라요. 쉼표는 "이것도 저것도"라는 다른 뜻이에요. 둘을 섞으면 이렇게 돼요.

- `.schedule-table thead th`: `.schedule-table` 안의 `thead` 안의 `th`.
- `.schedule-table th, .schedule-table td`: `.schedule-table` 안의 `th`와 `.schedule-table` 안의 `td`. 쉼표 뒤에도 앞부분 `.schedule-table`을 다시 써요.

## 🛠️ 따라하기

모두 7단계예요. 오늘은 `style.css`를 구역별로 고치고, 다섯 HTML 파일에 클래스를 더해요.

### 1단계 · 박스 모델 눈으로 보기 (4분)

**어디서:** 파일 탐색기 → `C:\dev\my-creator-site\index.html` 더블클릭(브라우저)

**무엇을:**

1. `F12`를 눌러 개발자 도구를 열고 **Elements** 탭을 클릭해요.
2. 왼쪽 위 **요소 선택 도구**(네모 안에 화살표)를 클릭하고 큰 제목 "안녕하세요, 달빛곰이에요!"를 클릭해요.
3. 오른쪽(또는 아래)의 **Styles** 옆 탭 **Computed**(계산됨)를 클릭해요.

:::success
Computed 창 위쪽에 겹겹이 네모 그림이 보여요. 바깥부터 margin, border, padding, 가운데 내용(content)이에요. 색은 브라우저마다 조금 달라요. 지금 제목의 margin 위아래는 20px 안팎의 값이 보여요(숫자는 달라도 돼요). 이게 브라우저가 기본으로 주는 여백이에요. 이 그림은 오늘 내내 쓸 확인 도구예요.
:::

### 2단계 · 기본 설정 구역 고치기 (8분)

`style.css`의 `2. 기본 설정` 구역을 박스 모델에 맞게 고쳐요. 한 번에 구역 전체를 바꿔요.

**어디서:** VS Code `style.css` 편집기

**무엇을:**

1. 탐색기에서 `css` 폴더의 `style.css`를 클릭해 열어요.
2. 5번째 줄 `/* ---------- 2. 기본 설정 (Day 9, 10) ---------- */`를 클릭해요.
3. 키보드 `Shift`를 누른 채, `h1, h2, h3` 규칙의 닫는 `}` 줄까지 클릭해서 선택해요. 바로 아래 빈 줄과 `/* ---------- 4. 헤더와 내비게이션 (Day 11) ---------- */` 주석은 선택하지 않아요.
4. 선택한 부분을 `Delete` 키로 지우고, 아래 코드를 그 자리에 붙여 넣어요.
5. `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
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
```
바뀐 곳을 짚어 봐요.

- 맨 앞에 `* { box-sizing: border-box; }`가 생겼어요. 주석은 코드 뒤에 같은 줄에 써도 돼요.
- `body`에 `margin: 0;`이 맨 앞에 생겼어요. 페이지 가장자리의 8px 흰 틈을 없애요.
- `img { max-width: 100%; height: auto; }`는 그림이 부모보다 넓어지지 않게 하고, 폭만 줄어도 비율이 유지되게 해요. 그림에 `height` 속성이 있어서, `height: auto`가 없으면 가로만 줄어들 때 세로가 그대로라 찌그러져요.
- `h1`, `h2`, `h3`의 글자 크기를 `rem`으로 정하고 위아래 margin을 줬어요. 값이 세 개인 `margin: 1.5rem 0 0.75rem;`은 "위 1.5rem, 좌우 0, 아래 0.75rem"이에요.

:::success
저장하면 페이지 가장자리의 흰 틈이 사라지고, 제목 크기가 달라져요. 홈 페이지의 곰 그림은 아직 240px로 크게 보여요. 아래 단계에서 줄여요.
:::

### 3단계 · 레이아웃 구역 새로 넣기 (5분)

**어디서:** VS Code `style.css` 편집기

**무엇을:**

1. `h3` 규칙의 닫는 `}` 줄 끝을 클릭하고 `Enter`를 두 번 눌러 빈 줄을 만들어요. 그 자리에 아래 코드를 붙여 넣어요. 붙여 넣은 코드와 `/* ---------- 4. 헤더와 내비게이션 (Day 11) ---------- */` 주석 사이에는 빈 줄이 하나 있어야 해요.
2. `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
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
```
- `.container`: 폭 최대 960px, 좌우 margin `auto`(가운데), 좌우 padding `1rem`(16px).
- 좌우 padding 덕분에 휴대폰처럼 좁은 화면에서도 글자가 화면 가장자리에 붙지 않아요.
- `main { padding-bottom: 3rem; }`은 본문 아래쪽에 여유를 줘요.

:::success
저장해도 아직 화면은 안 바뀌어요. `.container` 클래스를 가진 HTML 요소가 없기 때문이에요. 5단계에서 붙여요.
:::

### 4단계 · 헤더·페이지별·푸터 구역 고치기 (8분)

**어디서:** VS Code `style.css` 편집기

**무엇을:**

1. `/* ---------- 4. 헤더와 내비게이션 (Day 11) ---------- */` 줄을 클릭해요.
2. `Ctrl + Shift + End`를 눌러 파일 맨 끝까지 선택해요.
3. `Delete`로 지우고, 아래 코드를 붙여 넣어요.
4. `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
/* ---------- 4. 헤더와 내비게이션 (Day 11) ---------- */
.site-header {
  background: #f4f2ff;
  border-bottom: 1px solid #d9d6ee;
}

.header-inner {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

/* ---------- 6. 페이지별 ---------- */

/* 홈: 소개 영역 */
.hero-image {
  width: 160px;
  border-radius: 50%;
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
구역을 짚어 봐요.

- `4`에는 `.site-header`에 아래쪽 테두리 선이 생기고, `.header-inner`에 위아래 padding이 생겼어요.
- `6. 페이지별`은 새 구역이에요. 홈의 곰 그림은 폭 160px에 `border-radius: 50%`(정사각형을 원으로), 소개의 곰 그림은 폭 200px에 `12px` 둥근 모서리예요.
- 같은 구역의 방송 일정 규칙을 읽어 봐요. `.schedule-table th, .schedule-table td { … }`는 쉼표 뒤에도 `.schedule-table`을 다시 쓴 자손 선택자예요. `.schedule-table thead th`는 머리글 칸만 골라 배경을 칠해요.
- `border-collapse: collapse`는 표의 칸마다 있는 테두리를 하나로 합쳐 줘요. 이 규칙이 없으면 칸 테두리가 두 줄로 겹쳐 보여요.
- `7. 푸터`에는 위쪽 테두리와 위아래 padding이 더해졌고, 바닥글 안의 `p`에서 margin을 없앴어요.

:::success
머리글 아래쪽에 가는 선이 생기고, 바닥글 위쪽에 선과 여백이 생겨요. 곰 그림과 일정표는 아직 그대로예요. 해당 클래스를 HTML에 아직 붙이지 않았기 때문이에요. 다음 단계에서 모두 연결돼요.
:::

### 5단계 · 다섯 HTML 파일에 클래스 붙이기 (12분)

CSS가 고르려는 이름표(`container`, `header-inner`, `hero-image` …)를 HTML에 붙여요. 헤더와 바닥글은 안쪽을 `div`로 한 번 더 감싸요. 파일마다 `Ctrl + A` 후 붙여 넣는 것이 가장 안전해요.

**어디서:** VS Code에서 다섯 HTML 파일을 하나씩 열어요.

**무엇을:** 각 파일에서 `Ctrl + A`로 전체를 선택하고, 아래 코드를 붙여 넣은 뒤 `Ctrl + S`로 저장해요. 어제와 달라진 점은 코드 아래 목록에 있어요. 닉네임과 소개 문장은 내 것으로 바꿔도 돼요.

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
    </div>
  </header>

  <main>
    <section class="container hero">
      <img class="hero-image" src="images/profile.svg" alt="헤드셋을 쓴 곰 캐릭터, 달빛곰" width="240" height="240">
      <div>
        <h1>안녕하세요, 달빛곰이에요!</h1>
        <p>게임, 토크, 음악을 넘나드는 버라이어티 스트리머예요. 매주 월·수·금·토에 방송해요.</p>
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
    </div>
  </header>

  <main class="container">
    <h1>달빛곰을 소개해요</h1>

    <section class="about-intro">
      <img class="about-image" src="images/profile.svg" alt="헤드셋을 쓴 곰 캐릭터, 달빛곰" width="240" height="240">
      <div>
        <p>안녕하세요! <strong>달빛곰</strong>이에요. 게임, 토크, 음악 방송을 하는 <em>버라이어티 스트리머</em>예요.</p>
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
    </div>
  </header>

  <main class="container">
    <h1>영상 모아보기</h1>
    <p>지난 방송 영상을 모아 두는 페이지예요.</p>
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
다섯 파일에서 달라진 점은 이래요.

- `<header class="site-header">` 안이 `<div class="container header-inner">`로 한 번 더 감싸졌어요. 로고와 메뉴가 가운데 960px 안에 모여요.
- `<footer class="site-footer">` 안은 `<div class="container">`로 감싸졌어요.
- `contents.html`, `schedule.html`, `contact.html`, `about.html`은 `<main class="container">`가 되었어요.
- `index.html`은 `main`은 그대로이고 첫 `section`이 `class="container hero"`, 다른 `section`은 `class="container"`예요. 클래스를 빈칸으로 나눠 두 개 붙였어요.
- 곰 그림에 클래스가 붙었어요: 홈은 `class="hero-image"`, 소개는 `class="about-image"`. 소개 페이지의 첫 `section`은 `class="about-intro"`예요.
- `schedule.html`의 표는 `<table class="schedule-table">`이에요.

:::success
다섯 파일에 `container`가 들어갔어요. `Ctrl + F`로 `container`를 검색하면 파일마다 여러 번 찾아져요. 문제가 있으면 아래 🧯 자주 막히는 곳을 먼저 보세요.
:::

### 6단계 · 화면으로 확인하기 (5분)

**어디서:** 브라우저(파일 탐색기에서 더블클릭) 또는 Live Preview

**무엇을:**

1. 홈 페이지를 새로 고침(`Ctrl + F5`)하고 브라우저 창을 넓혀 봐요.
2. 창을 마우스로 좁혀 봐요. 아주 좁게 줄여 봐요.
3. 일정 페이지와 소개 페이지도 확인해요.
4. 개발자 도구(`F12`)의 **Elements**에서 `<header>` 안의 `<div class="container header-inner">`를 클릭하고 **Computed** 탭의 상자 그림을 봐요.

:::success
넓은 창에서는 내용이 가운데 960px 안에 모여요. 창을 좁혀도 좌우에 16px 여백이 남아요. 페이지 가장자리의 흰 틈이 없어요. 홈의 곰 그림은 지름 160px의 동그라미이고, 소개 페이지의 곰 그림은 모서리가 둥근 200px 정사각형이에요. 일정표에는 칸마다 테두리가 있고 머리글(요일, 시작 시간, 방송 내용)이 연보라 배경이에요. Computed 그림의 padding 칸 좌우에 `16`이 보여요.
:::

### 7단계 · 오늘 작업 커밋하고 올리기 (3분)

**어디서:** VS Code 소스 제어 패널 (`Ctrl + Shift + G`)

**무엇을:**

1. **변경 사항**에 `style.css`와 다섯 HTML 파일이 `M` 표시로 보이는지 확인해요.
2. 메시지 칸에 `Day 10: 박스 모델, 여백과 테두리`를 입력하고 **커밋**을 클릭해요.
3. **변경 내용 동기화**를 클릭해요. 확인 창이 뜨면 **OK**를 클릭해요.
4. GitHub 저장소 페이지를 새로 고침해요.

:::success
소스 제어 패널의 변경 목록이 비어요. GitHub 저장소 페이지에 `Day 10: 박스 모델, 여백과 테두리` 커밋이 보여요.
:::

## ✍️ 과제

### 과제 1 · 박스 계산 (쉬움 ⭐, 7분)

`width: 200px; padding: 20px; border: 2px solid;`인 상자의 화면에서 차지하는 전체 폭은 얼마일까요? `box-sizing: content-box`일 때와 `border-box`일 때를 각각 계산해 보세요.

### 과제 2 · `max-width` 실험 (보통 ⭐⭐, 10분)

`.container`의 `max-width`를 `600px`로 바꿔서 어떻게 달라지는지 관찰하고 되돌려 보세요.

- `style.css`의 `max-width: 960px;`을 `max-width: 600px;`로 바꾸고 저장해요.
- 브라우저에서 `Ctrl + F5`로 새로 고침하고 창을 넓혀 봐요.
- 관찰한 것을 한 문장으로 적어요.
- `600px`을 다시 `960px`로 되돌리고 저장해요.

### 과제 3 · `rem`과 `px` (도전 ⭐⭐⭐, 8분)

`h2`의 margin을 `2rem` 대신 `32px`로 쓰면, 사용자가 브라우저의 글자 크기 설정을 키웠을 때 무엇이 달라지는지 한 문장으로 적어 보세요.

## ✅ 정답

:::answer 과제 1 정답 · 박스 계산
- `content-box`: 200 + 20×2(좌우 padding) + 2×2(좌우 border) = **244px**
- `border-box`: **200px**. 정한 `width`가 padding과 border까지 포함해요.

**왜 이렇게 하나요?** `content-box`에서는 padding과 border를 더할수록 상자가 커져서 "이 상자는 폭이 200px이야"라는 약속이 깨져요. 그래서 모든 요소에 `border-box`를 써서, 정한 폭이 곧 전체 폭이 되게 해요.
:::

:::answer 과제 2 정답 · max-width 실험
**내용이 가운데 600px 폭으로 좁아지고, 양쪽의 남는 공간을 `margin: 0 auto`가 반씩 나눠 가져요.** 창이 600px보다 좁으면 `max-width`는 영향을 주지 않고 상자가 창 폭을 따라가요. 되돌린 뒤에는 `max-width: 960px;`이에요.

**왜 이렇게 하나요?** `max-width`는 "이보다 넓어지지 말라"는 한도예요. 한도 안에서는 창 폭을 따라 자유롭게 줄어요. 그래서 넓은 화면과 휴대폰 화면에 같은 규칙이 모두 맞아요.
:::

:::answer 과제 3 정답 · rem과 px
**`rem`으로 쓴 margin은 글자 크기와 함께 커지고, `px`로 쓴 margin은 글자가 커져도 그대로예요.**

**왜 이렇게 하나요?** `rem`은 기본 글자 크기를 기준으로 계산돼서 글자 크기 설정을 키운 사용자에게는 여백도 자연스럽게 함께 커져요. `px`는 고정이라 글자만 커지고 여백은 좁아 보여서 답답해요. 글자 크기와 여백에는 `rem`을 쓰는 게 좋아요.
:::

:::answer 오늘 끝 상태 전체 코드
오늘 따라하기와 과제를 모두 끝내면 아래 상태가 돼요. 막혔다면 이 폴더와 파일을 그대로 만들고 코드를 붙여 넣어 저장하세요. 그러면 Day 11을 바로 시작할 수 있어요. 과제 2에서 바꾼 `max-width`는 `960px`로 되돌린 상태예요.

```text
C:\dev\my-creator-site\
├─ index.html          (class 추가)
├─ about.html          (class 추가)
├─ contents.html       (class 추가)
├─ schedule.html       (class 추가)
├─ contact.html        (class 추가)
├─ css\
│  └─ style.css        (박스 모델 규칙 추가)
└─ images\
   ├─ profile.svg
   └─ logo.svg
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
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

/* ---------- 6. 페이지별 ---------- */

/* 홈: 소개 영역 */
.hero-image {
  width: 160px;
  border-radius: 50%;
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
    </div>
  </header>

  <main>
    <section class="container hero">
      <img class="hero-image" src="images/profile.svg" alt="헤드셋을 쓴 곰 캐릭터, 달빛곰" width="240" height="240">
      <div>
        <h1>안녕하세요, 달빛곰이에요!</h1>
        <p>게임, 토크, 음악을 넘나드는 버라이어티 스트리머예요. 매주 월·수·금·토에 방송해요.</p>
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
    </div>
  </header>

  <main class="container">
    <h1>달빛곰을 소개해요</h1>

    <section class="about-intro">
      <img class="about-image" src="images/profile.svg" alt="헤드셋을 쓴 곰 캐릭터, 달빛곰" width="240" height="240">
      <div>
        <p>안녕하세요! <strong>달빛곰</strong>이에요. 게임, 토크, 음악 방송을 하는 <em>버라이어티 스트리머</em>예요.</p>
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
    </div>
  </header>

  <main class="container">
    <h1>영상 모아보기</h1>
    <p>지난 방송 영상을 모아 두는 페이지예요.</p>
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
연습 폴더 `C:\dev\hello`는 어제와 같아요. 끝 상태 확인: GitHub 저장소 페이지에 `Day 10: …` 커밋이 보여요.
:::

## 🧯 자주 막히는 곳

모든 문제와 드문 경우는 [문제 해결 모음](#/page/troubleshooting)에 있어요.

### 내용이 가운데로 안 모이고 왼쪽에 붙어 있어요

**원인:** `.container` 규칙에 `max-width`가 없으면 `margin: 0 auto`는 효과가 없어요. 폭이 화면 전체라서 나눌 공간이 없기 때문이에요. HTML에 `class="container"`를 붙이지 않았거나 오타가 있을 수도 있어요.

**해결:**

1. `style.css`의 `.container` 규칙에 `max-width: 960px;`과 `margin: 0 auto;`가 모두 있는지 확인해요.
2. HTML의 `<main class="container">` 같은 곳에 `class="container"`가 정확히 있는지 확인해요(`containor` 같은 오타에 주의).
3. 저장하고 `Ctrl + F5`로 새로 고침해요. 창을 넓혔을 때 내용이 가운데에 모이면 해결된 거예요.

### 곰 그림이 찌그러진 타원이에요

**원인:** `img { max-width: 100%; height: auto; }` 규칙이 빠졌어요. 그림에는 `height="240"` 속성이 있는데, CSS로 폭만 줄이면 높이가 240px로 남아서 비율이 깨져요.

**해결:**

1. `style.css`의 `2. 기본 설정` 구역에 `img { max-width: 100%; height: auto; }` 규칙이 있는지 확인해요. `body` 규칙 바로 아래에 있어야 해요.
2. 없으면 2단계의 코드로 넣어요. `height: auto;`가 핵심이에요.
3. 저장하고 새로 고침해요. 원 모양이 되면 해결된 거예요.

### class="container, hero"처럼 쉼표를 썼어요

**원인:** HTML의 `class`에서 이름 여러 개는 쉼표가 아니라 **빈칸**으로 나눠요. 쉼표를 쓰면 `container,`라는 이름이 되어 CSS의 `.container`와 맞지 않아요.

**해결:**

1. `class="container, hero"`를 `class="container hero"`로 고쳐요.
2. 저장하고 새로 고침해요.
3. 내용이 가운데로 모이면 해결된 거예요.

### 표의 테두리가 두 줄로 겹쳐 보여요

**원인:** `border-collapse: collapse;`가 빠졌어요. 이 속성이 없으면 표와 칸에 테두리가 따로 그려져서 두 줄로 보여요.

**해결:**

1. `style.css`의 `.schedule-table` 규칙에 `border-collapse: collapse;`가 있는지 확인해요. 없으면 `width: 100%;` 아래에 한 줄을 넣어요.
2. HTML의 `<table class="schedule-table">`에 클래스가 붙었는지도 확인해요.
3. 저장하고 새로 고침해요. 칸마다 선이 한 줄이면 해결된 거예요.

### 제목 위아래 여백이 생각보다 작아요

**원인:** 위아래로 붙은 두 요소의 margin은 더해지지 않고 큰 쪽 하나만 남기도 해요. 이 현상을 마진 겹침이라고 하고 정상이에요. 예를 들어 `h2`의 아래 margin과 다음 요소의 위 margin이 겹쳐요.

**해결:**

1. 개발자 도구의 Computed 상자 그림에서 margin 값을 확인해요. 값이 CSS와 같다면 겹침 때문일 가능성이 높아요.
2. 여백을 더 넓히고 싶다면 `margin`을 크게 하거나, 부모에 `padding`을 줘요.
3. 의도한 만큼 여백이 보이면 해결된 거예요. 겹침 자체는 고치지 않아도 돼요.

### 헤더나 푸터가 깨졌어요 (div 닫는 태그가 빠졌어요)

**원인:** 오늘 `header`와 `footer` 안에 `div`를 하나씩 더 감쌌어요. 열린 `div`에 닫는 `</div>`를 빠뜨리면 아래 내용이 모두 그 `div`의 자손이 되어 레이아웃이 깨져요.

**해결:**

1. 깨진 페이지를 열어 `F12`로 Elements를 열어요. `header` 아래 구조가 이상하게 깊거나 `main`이 `header` 안에 들어가 있으면 닫는 태그가 빠진 거예요.
2. VS Code에서 `<div`와 `</div>`의 개수를 맞춰요. `header` 안은 `<div class="container header-inner">`부터 `</div>`까지 한 쌍, `footer` 안도 한 쌍이에요.
3. 가장 확실한 방법은 오늘의 "끝 상태 전체 코드"를 해당 파일에 다시 붙여 넣는 거예요.
4. Elements에서 `header`, `main`, `footer`가 `body` 바로 아래에 나란히 있으면 해결된 거예요.
## 📝 오늘의 체크리스트

- [ ] 넓은 창에서 내용이 가운데 960px 안에 모이고, 좁혀도 좌우에 16px 여백이 남아요.
- [ ] 페이지 가장자리에 흰 틈이 없어요.
- [ ] 홈의 곰 그림이 지름 160px의 동그라미이고, 소개 페이지의 곰 그림이 모서리가 둥근 사각형이에요.
- [ ] 일정표에 칸 테두리와 연보라 머리글이 보여요.
- [ ] 개발자 도구 Computed 창에서 박스 모델 그림을 보고 `.container`의 padding이 16인 것을 확인했어요.
- [ ] `content-box`와 `border-box`의 폭 계산 차이를 설명할 수 있어요.
- [ ] 자손 선택자(빈칸)와 쉼표 묶음의 차이를 설명할 수 있어요.
- [ ] GitHub 저장소 페이지에 `Day 10: …` 커밋이 보여요(과제 1~3도 했어요).

## 📚 더 알아보기

- [MDN · 박스 모델 소개](https://developer.mozilla.org/ko/docs/Learn_web_development/Core/Styling_basics/Box_model): 네 겹 상자와 `box-sizing`을 그림으로 설명해요.
- [MDN · box-sizing](https://developer.mozilla.org/ko/docs/Web/CSS/box-sizing): `content-box`와 `border-box`의 차이를 보여 줘요.
- [MDN · CSS 단위](https://developer.mozilla.org/ko/docs/Learn_web_development/Core/Styling_basics/Values_and_units): `px`, `rem`, `%` 같은 값의 종류를 설명해요.

➡️ **다음 Day 예고:** [Day 11 · Flexbox](#/day/p1-d11)에서는 로고와 메뉴를 한 줄로 나란히 놓고, 지금 보고 있는 페이지의 메뉴를 강조하고, 둥근 버튼을 만들어요.
