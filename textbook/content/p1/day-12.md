## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- `display: grid`와 `repeat(auto-fit, minmax(240px, 1fr))` 한 줄로, 화면 폭에 따라 3칸·2칸·1칸이 되는 카드 그리드를 만들 수 있어요.
- 썸네일 그림, 제목, 설명이 들어 있는 카드(`article.card`)를 만들 수 있어요.
- Flexbox와 Grid 중 어느 쪽을 써야 할지 상황을 보고 고를 수 있어요.
- 개발자 도구의 `grid` 배지로 칸의 경계선을 볼 수 있어요.

**예상 시간: 100분** (개념 이해 22분 · 따라하기 52분 · 과제 21분 · 정리 5분)

:::path 📂 시작 상태
어제(Day 11)까지 만든 파일이 이렇게 있어야 해요. 없거나 다르면 [Day 11](#/day/p1-d11)의 "오늘 끝 상태 전체 코드"로 맞춰 주세요.

- `C:\dev\my-creator-site\index.html`, `about.html`, `contents.html`, `schedule.html`, `contact.html`
- `C:\dev\my-creator-site\css\style.css`
- `C:\dev\my-creator-site\images\profile.svg`, `logo.svg`
- 메뉴 5개가 오른쪽에 가로로 늘어서 있고, 홈에 버튼 모양 링크 2개가 있어요.
- VS Code에서 `C:\dev\my-creator-site` 폴더가 열려 있고, Live Preview 확장 프로그램이 설치되어 있어요.
- GitHub 저장소 `https://github.com/<내 아이디>/my-creator-site`와 연결되어 있고, 어제 변경은 모두 커밋·푸시했어요(소스 제어 패널의 변경 0개).
:::

## 📖 개념 이해

### 줄과 칸으로 나누기: Grid

**비유:** 달력이나 엑셀 시트를 떠올려 보세요. 가로줄과 세로줄이 만나 칸이 생기고, 칸마다 내용을 하나씩 넣어요. 어제 배운 Flexbox가 "책꽂이에 한 줄로 꽂기"라면, Grid는 "바둑판을 나누고 칸에 하나씩 놓기"예요.

**정확한 정의:** **[[Grid]]**(그리드)는 요소들을 줄과 칸이 있는 격자로 배치하는 CSS 방법이에요. 부모에 `display: grid;`를 쓰고 `grid-template-columns`로 칸의 개수와 폭을 정하면, 부모의 바로 아래 자식들이 칸을 차례로 채워요. 칸 사이의 간격은 Flexbox처럼 `gap`으로 정해요.

```css
.card-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
}
```

위 코드는 폭이 같은 칸 3개를 만들어요. 여기서 `1fr`이 새 단위예요.

- **[[fr]]**(에프아르)은 남는 공간을 나눠 갖는 몫이에요. `1fr 1fr 1fr`은 세 칸이 남는 공간을 3등분하고, `200px 1fr`은 첫 칸이 200px, 나머지를 둘째 칸이 모두 가져요. 이름은 fraction(몫)에서 왔어요.

칸 3개를 일일이 쓰는 대신, 반복해 주는 `repeat()`를 쓸 수 있어요. `repeat(3, 1fr)`은 `1fr 1fr 1fr`과 같아요.

### 화면에 맞춰 저절로 바뀌는 칸: minmax와 auto-fit

휴대폰에서도 3칸이면 카드가 너무 좁아져요. 화면 폭에 따라 칸 수가 **저절로** 바뀌게 하려면 두 가지를 써요.

- **[[minmax]]**(민맥스)는 칸의 폭을 "최소 얼마부터 최대 얼마까지"로 정하는 함수예요. `minmax(240px, 1fr)`은 칸이 240px보다 좁아지지 않고, 공간이 남으면 똑같이 나눠 늘어난다는 뜻이에요.
- **[[auto-fit]]**(오토 핏)은 `repeat()` 안에 써서 "들어가는 만큼 칸을 만들어 줘"라고 하는 값이에요.

이 둘을 합친 한 줄이 오늘의 핵심이에요.

```css
grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
```

읽는 법은 "칸 하나의 최소 폭은 240px, 들어가는 만큼 칸을 만들고, 남는 공간은 칸들이 똑같이 나눠 가져요"예요. 그래서 넓은 화면에서는 3칸, 중간에서는 2칸, 좁으면 1칸이 돼요. 미디어 쿼리 없이도 되는 것이 장점이에요(미디어 쿼리는 내일 배워요).

비슷한 값 `auto-fill`도 있어요. 카드가 칸보다 적을 때 차이가 나요. `auto-fill`은 **빈 칸 자리를 남겨 두고**, `auto-fit`은 빈 칸을 접어서 **있는 카드를 늘려 채워요**. 오늘 과제 3에서 직접 봐요.

### Flexbox와 Grid, 언제 무엇을?

- **Flexbox**: 한 줄(가로 또는 세로)에 늘어놓을 때. 메뉴 바, 버튼 묶음, 로고 + 글자.
- **Grid**: 줄과 칸이 함께 있을 때. 카드 목록, 사진 모음, 2열 레이아웃.

헷갈리면 "자식들이 한 줄이면 Flexbox, 칸을 맞춰야 하면 Grid"로 생각해요. 둘을 섞어 쓰는 것도 흔해요. 오늘 카드 목록은 Grid로, 어제 만든 머리글은 Flexbox로 두었어요.

:::info 실무에서는
쇼핑몰의 상품 목록, 유튜브 영상 목록처럼 카드가 여러 줄로 나열되는 화면은 대부분 Grid로 만들어요. 개발자 도구(브라우저에서 연 페이지의 `F12`) Elements 패널에서 Grid가 켜진 요소 옆에 `grid` 배지가 붙고, 눌러 보면 칸의 선이 화면에 그려져서 "왜 이 칸에 들어갔지?" 같은 의문을 풀기 좋아요.
:::

### 카드: 그림 + 글을 한 덩어리로

카드는 이런 구조예요. Day 6에서 배운 `article`(혼자서도 뜻이 통하는 덩어리)을 써요.

```text
article.card
├─ img          썸네일 그림
└─ div.card-body
   ├─ h3        제목
   └─ p         설명
```

카드 모서리를 둥글게 하면 그림의 네모난 모서리가 카드 밖으로 튀어나와 보여요. `overflow: hidden;`을 주면 카드 모서리 밖으로 나간 부분을 잘라서 **그림의 모서리까지 같이 둥글게** 보여요.

## 🛠️ 따라하기

모두 7단계예요. 확인은 Live Preview(또는 더블클릭)로 `index.html`을 열어 두고 해요. 개발자 도구가 필요하면 Live Preview 미리 보기 창 위쪽의 주소(`http://127.0.0.1:3000/…`, 숫자는 달라도 돼요)를 복사해 Edge나 Chrome 주소창에 붙여 넣어 열어요.

### 1단계 · 썸네일 그림 3개 만들기 (10분)

카드 위쪽에 쓸 그림 3개(게임·토크·음악)를 SVG 파일로 만들어요. Day 5에서 SVG 파일을 만들어 본 방법 그대로예요.

**어디서:** VS Code, 왼쪽 **탐색기**의 `images` 폴더

**무엇을:**

1. 탐색기에서 `images` 폴더 위에 마우스를 올리고 **새 파일** 아이콘을 클릭해요. 파일 이름에 `thumb-game.svg`를 입력하고 `Enter`를 눌러요. (이름은 영어 소문자, 가운데는 밑줄(`_`)이 아니라 하이픈(`-`)이에요.)
2. 열린 빈 파일에 아래 코드를 붙여 넣고 `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\images\thumb-game.svg
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" width="320" height="180">
  <rect width="320" height="180" fill="#3b2f9e"/>
  <!-- 게임 컨트롤러 -->
  <rect x="80" y="62" width="160" height="70" rx="32" fill="#ffffff"/>
  <rect x="104" y="88" width="40" height="10" rx="3" fill="#3b2f9e"/>
  <rect x="119" y="73" width="10" height="40" rx="3" fill="#3b2f9e"/>
  <circle cx="196" cy="84" r="9" fill="#ff6b81"/>
  <circle cx="218" cy="104" r="9" fill="#ffd66b"/>
</svg>
```

3. 같은 방법으로 `thumb-talk.svg`를 만들어요.

📄 C:\dev\my-creator-site\images\thumb-talk.svg
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" width="320" height="180">
  <rect width="320" height="180" fill="#0f6b63"/>
  <!-- 말풍선 -->
  <path d="M90 50h140a16 16 0 0 1 16 16v44a16 16 0 0 1-16 16h-84l-32 24v-24h-24a16 16 0 0 1-16-16v-44a16 16 0 0 1 16-16z" fill="#ffffff"/>
  <circle cx="130" cy="88" r="8" fill="#0f6b63"/>
  <circle cx="160" cy="88" r="8" fill="#0f6b63"/>
  <circle cx="190" cy="88" r="8" fill="#0f6b63"/>
</svg>
```

4. 같은 방법으로 `thumb-music.svg`를 만들어요.

📄 C:\dev\my-creator-site\images\thumb-music.svg
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" width="320" height="180">
  <rect width="320" height="180" fill="#a8325e"/>
  <!-- 음표 -->
  <path d="M138 128V54l64-14v70" fill="none" stroke="#ffffff" stroke-width="10" stroke-linejoin="round"/>
  <ellipse cx="120" cy="130" rx="22" ry="16" fill="#ffffff"/>
  <ellipse cx="184" cy="116" rx="22" ry="16" fill="#ffffff"/>
</svg>
```

5. 파일 탐색기에서 `C:\dev\my-creator-site\images` 폴더를 열고 `thumb-game.svg`를 더블클릭해 봐요. 보통 Edge가 열려요. 다른 앱이 열리면 닫고, 파일을 Edge 창으로 끌어다 놓거나 파일을 오른쪽 클릭 → **연결 프로그램**에서 Edge를 골라요(메뉴 이름은 버전에 따라 조금 다를 수 있어요).

:::success
`images` 폴더에 `profile.svg`, `logo.svg`, `thumb-game.svg`, `thumb-talk.svg`, `thumb-music.svg` 5개가 있어요. `thumb-game.svg`를 브라우저로 열면 진한 보라색 바탕에 흰색 게임 컨트롤러가 보여요. 토크는 초록 바탕에 말풍선, 음악은 자주색 바탕에 음표예요. 파일 이름이 `thumb-game.svg.txt`처럼 `.txt`가 붙지 않았는지도 확인하세요(Day 1의 `hello.html.txt`와 같은 함정이에요).
:::

### 2단계 · 홈 "이런 방송을 해요"를 카드 구조로 바꾸기 (8분)

세 개의 `article`을 `div.card-grid`로 감싸고, 각 `article`에 `class="card"`, 그림, `div.card-body`를 넣어요.

**어디서:** VS Code, `C:\dev\my-creator-site\index.html`, 둘째 `<section>`(`<h2>이런 방송을 해요</h2>`가 있는 곳)

**무엇을:**

1. `<h2>이런 방송을 해요</h2>` 줄부터 `</section>` 바로 앞까지(`h2` 한 줄과 `article` 3개)를 드래그해서 지워요. 그 위의 `<section class="container">`와 아래의 `</section>`은 그대로 둬요.
2. 그 자리에 아래 블록을 붙여 넣어요. `h2` 줄도 블록에 들어 있어요.
3. `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\index.html (일부)
```html
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
```

`<img>`의 `width="320" height="180"`은 그림이 도착하기 전에 브라우저가 자리를 미리 잡아 두게 하고, 가로세로 비율도 알려 줘요. `alt`는 Day 5에서 배운 대체 텍스트예요.

:::success
저장하면 화면에 썸네일 그림 3개가 320×180 크기로 세로로 쌓이고, 그림 아래에 제목과 설명이 보여요. 아직 CSS를 안 썼으니 카드 모양은 없어요. 그림이 안 보이고 깨진 그림 아이콘과 `alt` 글자가 보이면 아래 🧯 자주 막히는 곳의 "썸네일이 안 보여요"를 보세요.
:::

### 3단계 · 카드 그리드 만들기 (9분)

카드 3개를 감싼 `.card-grid`에 Grid를 켜서 칸 수가 저절로 바뀌게 해요.

**어디서:** VS Code, `C:\dev\my-creator-site\css\style.css`, `5. 공통 부품` 구역의 맨 끝 (`.button-outline { … }` 규칙 아래, `/* ---------- 6. 페이지별 ---------- */` 주석 바로 위)

**무엇을:**

1. `.button-outline { … }` 규칙이 끝나는 `}` 아래 한 줄을 비워요.
2. 아래 블록을 붙여 넣고 `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
/* 카드 그리드 (Day 12): 칸 하나는 최소 240px, 남는 공간은 똑같이 나눠 가져요 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}
```

3. 브라우저 창을 가로로 넓혔다 좁혔다 하면서 카드 줄이 어떻게 바뀌는지 봐요.

:::success
넓은 창(대략 1000px 이상)에서는 썸네일 3개가 한 줄에 나란히 놓이고, 창을 줄이면 2개 + 1개로, 더 줄이면 1개씩 세로로 쌓여요. 아직 카드의 배경과 테두리는 없어요. 창을 줄여도 3개가 한 줄에 그대로 있으면 `grid-template-columns` 줄의 쉼표와 괄호를 확인하세요.
:::

### 4단계 · 카드 모양 꾸미기 (8분)

카드에 배경, 테두리, 둥근 모서리, 안쪽 여백을 줘요.

**어디서:** VS Code, `C:\dev\my-creator-site\css\style.css`, 방금 붙인 `.card-grid { … }` 규칙 바로 아래

**무엇을:**

1. `.card-grid { … }`가 끝나는 `}` 아래 한 줄을 비워요.
2. 아래 블록을 붙여 넣고 `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
.card {
  background: #f4f2ff;
  border: 1px solid #d9d6ee;
  border-radius: 12px;
  overflow: hidden;
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
  color: #5a5775;
}
```

- `.card`의 `overflow: hidden;`이 카드 밖으로 나가는 그림의 모서리를 잘라 줘요.
- `.card img`의 `display: block; width: 100%;`는 그림이 카드 폭을 꽉 채우게 하고, 그림 아래의 작은 틈(인라인 요소의 줄 간격)을 없애요.
- `.card-body`의 `padding`은 글자가 카드 가장자리에 붙지 않게 해요.

:::success
카드 3장이 연보라 배경에 얇은 테두리로 둘러싸이고, 모서리가 둥글어요. 위쪽 그림의 모서리도 카드와 같이 둥글게 잘려 있어요. 제목은 굵은 진한 색, 설명은 회색빛이에요. 그림 모서리가 각져서 삐져나와 보이면 `.card`의 `overflow: hidden;`을 확인하세요.
:::

### 5단계 · 홈 소개 영역과 소개 페이지도 Grid로 (6분)

홈의 `hero`(곰 그림 + 글)와 소개 페이지의 `about-intro`를 Grid로 바꿔요. 지금은 칸이 하나뿐이라 그림 위, 글 아래로 쌓이고, 칸이 두 개로 나뉘는 건 내일(Day 13) 해요.

**어디서:** VS Code, `C:\dev\my-creator-site\css\style.css`, `6. 페이지별` 구역

**무엇을:**

1. `/* 홈: 소개 영역 */` 주석 바로 아래, `.hero-image { … }` 규칙 **위**에 아래 `.hero` 규칙을 붙여 넣어요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
.hero {
  display: grid;
  gap: 1.5rem;
  align-items: center;
  padding-top: 1.5rem;
  padding-bottom: 1rem;
}
```

2. `/* 소개 페이지 */` 주석 바로 아래, `.about-image { … }` 규칙 **위**에 아래 `.about-intro` 규칙을 붙여 넣어요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
.about-intro {
  display: grid;
  gap: 1.5rem;
  align-items: start;
}
```

3. `Ctrl + S`로 저장하고 홈과 소개 페이지를 확인해요.

`align-items: center;`(hero)와 `align-items: start;`(about-intro)는 Grid에서도 Flexbox처럼 세로 방향 정렬을 정해요. HTML에는 이미 `class="container hero"`와 `class="about-intro"`가 Day 10에서 붙어 있어요.

:::success
홈에서는 곰 그림이 위, 글이 아래로 쌓이고 둘 사이 간격이 약간 넓어져요(24px). 소개 페이지도 그림이 위, 글이 아래예요. 모양은 크게 다르지 않아도 괜찮아요. 2열로 바뀌는 건 내일이에요.
:::

### 6단계 · 개발자 도구로 칸의 선 보기 (6분)

Grid가 칸을 어떻게 나눴는지 눈으로 봐요.

**어디서:** Edge 또는 Chrome에서 연 `index.html`(Live Preview 주소를 붙여 넣거나 파일 더블클릭)

**무엇을:**

1. 키보드의 `F12`를 눌러요(노트북은 `Fn + F12`일 수 있어요). `Ctrl + Shift + I`도 돼요.
2. 개발자 도구 위쪽 탭에서 **Elements**(요소)를 클릭해요.
3. 코드 목록에서 `<div class="card-grid">` 줄을 찾아요. 줄 오른쪽에 `grid`라고 쓰인 작은 배지가 있어요.
4. `grid` 배지를 클릭해요. 화면의 카드 둘레에 점선 격자가 그려져요.
5. 브라우저 창 폭을 줄여 가며 점선 칸이 3개 → 2개 → 1개로 바뀌는 것을 봐요.

:::success
`grid` 배지를 누르면 카드 칸마다 보라색 점선이 그려지고, 창 폭에 따라 칸 수가 바뀌어요. 배지가 안 보이면 `<div class="card-grid">` 줄이 맞는지, `display: grid;`가 저장됐는지 확인하세요. 개발자 도구의 정확한 모양은 브라우저 버전에 따라 조금 달라요.
:::

### 7단계 · 오늘 작업 커밋·푸시 (5분)

오늘 바뀐 파일을 Git에 기록하고(커밋) GitHub로 올려요(푸시). 매일 마지막에 하는 습관이에요. Day 7·8에서 한 것과 똑같아요.

**어디서:** VS Code, `C:\dev\my-creator-site` 폴더가 열린 창. 왼쪽 세로 막대의 가지 모양 아이콘(**소스 제어**, `Ctrl + Shift + G`)

**무엇을 (방법 A, 소스 제어 패널):**

1. 위쪽 **메시지** 칸을 클릭하고 `Day 12: Grid 카드 레이아웃`를 입력해요.
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
git commit -m "Day 12: Grid 카드 레이아웃"
```

예상 출력(`a1b2c3d` 같은 해시와 숫자는 달라도 돼요):

```text
[main a1b2c3d] Day 12: Grid 카드 레이아웃
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
브라우저에서 `https://github.com/<내 아이디>/my-creator-site`를 열고 새로 고침(`F5`)하면, 파일 목록 위에 방금 쓴 커밋 메시지 `Day 12: Grid 카드 레이아웃`가 보여요. VS Code 소스 제어 패널의 변경 목록은 비어 있어요.
:::

## ✍️ 과제

### 과제 1 · 칸 수 실험 (쉬움 ⭐, 5분)

`minmax(240px, 1fr)`의 `240`을 `400`으로 바꾸면 칸 수가 어떻게 바뀌는지 봐요.

- `.card-grid`의 `minmax(240px, 1fr)`를 `minmax(400px, 1fr)`로 바꾸고 저장해요.
- 브라우저 창을 넓게(1280px 안팎) 열고 홈의 카드 줄에 한 줄에 몇 장이 있는지 세어요.
- 창을 휴대폰 폭(360px 안팎)까지 줄이면 어떻게 되는지도 봐요(가로 스크롤이 생겨요).
- 확인이 끝나면 `240px`로 되돌려요.

힌트: 개발자 도구의 `grid` 배지를 켜면 칸이 몇 개인지 세기 쉬워요.

### 과제 2 · 영상 페이지에 카드 3장 (보통 ⭐⭐, 10분)

`contents.html`에 영상 카드 3장을 정적으로(손으로 써서) 넣어요. Day 20에 JavaScript가 이 카드를 데이터에서 자동으로 그려 주게 바꿔요.

- 안내 문장 `<p>지난 방송 영상을 모아 두는 페이지예요.</p>` 아래에 `<div class="card-grid">`를 만들어요.
- 그 안에 `<article class="card">` 3개를 넣어요. 각 카드는 썸네일 `img`(`thumb-music.svg`, `thumb-game.svg`, `thumb-talk.svg` 순서) + `<div class="card-body">`(`h3` 영상 제목 + `p` 날짜)예요.
- 제목과 날짜는 ① `기타로 연주하는 신청곡` 2026-10-27, ② `신작 공포 게임 첫 도전` 2026-10-25, ③ `구독자 1000명 기념 Q&A` 2026-10-20이에요. 내 영상으로 바꿔도 돼요.

커밋·푸시는 7단계에서 이미 했으니, 과제를 마치면 소스 제어 패널에서 `Day 12: 영상 페이지 카드 3장`으로 한 번 더 커밋·푸시해요. 내일(Day 13)은 변경이 0개인 상태에서 시작하니 이 커밋까지 꼭 마쳐요.

힌트: 홈의 카드와 구조가 같아요. 홈 카드를 복사해 `contents.html`에 붙여 넣고 글자만 바꿔요. `Q&A`는 그대로 써도 화면에 `Q&A`로 보여요.

### 과제 3 · auto-fit과 auto-fill (도전 ⭐⭐⭐, 6분)

카드가 한 장뿐일 때 `auto-fit`과 `auto-fill`이 어떻게 다른지 봐요.

- `contents.html`에서 카드 두 장을 `<!-- … -->` 주석으로 잠깐 감싸서 한 장만 보이게 해요.
- `.card-grid`의 `auto-fit`을 `auto-fill`로 바꿔서 카드 폭이 어떻게 달라지는지 봐요.
- 확인이 끝나면 `auto-fit`으로 되돌리고, 주석을 풀어 카드 3장을 되살려요.

힌트: 1280px 창에서 카드 폭을 눈으로 비교해요. 개발자 도구에서 카드를 클릭하면 폭(px)이 표시돼요.

## ✅ 정답

:::answer 과제 1 정답 · 칸 수 실험
1280px 창에서 홈 카드는 **2장씩**(한 줄에 2장, 아래 줄에 1장) 놓여요. 한 칸이 400px 이상이어야 하니, 사이트 본문 폭(960px 상자, 좌우 여백 빼고 928px)에 3칸(400×3 + 간격)은 들어가지 않기 때문이에요. 휴대폰 폭(360px)에서는 칸이 400px보다 좁아질 수 없어서 카드가 화면 밖으로 삐져나가 **가로 스크롤**이 생겨요.

**왜 이렇게 하나요?** `minmax(최소, 최대)`의 첫 값이 "칸이 더 좁아질 수 없는 한계"예요. 한계를 크게 잡으면 한 줄에 들어가는 칸이 줄어요. 그래서 휴대폰에서도 안전한 `240px` 정도로 잡아요. 확인이 끝나면 `240px`로 되돌려요.
:::

:::answer 과제 2 정답 · 영상 페이지에 카드 3장
`contents.html`을 이렇게 만들어요. 오늘 끝 상태 전체 코드의 `contents.html`과 같아요.

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
    <p>지난 방송 영상을 모아 두는 페이지예요.</p>

    <div class="card-grid">
      <article class="card">
        <img src="images/thumb-music.svg" alt="음악 영상 썸네일" width="320" height="180">
        <div class="card-body">
          <h3>기타로 연주하는 신청곡</h3>
          <p>2026-10-27</p>
        </div>
      </article>
      <article class="card">
        <img src="images/thumb-game.svg" alt="게임 영상 썸네일" width="320" height="180">
        <div class="card-body">
          <h3>신작 공포 게임 첫 도전</h3>
          <p>2026-10-25</p>
        </div>
      </article>
      <article class="card">
        <img src="images/thumb-talk.svg" alt="토크 영상 썸네일" width="320" height="180">
        <div class="card-body">
          <h3>구독자 1000명 기념 Q&A</h3>
          <p>2026-10-20</p>
        </div>
      </article>
    </div>
  </main>

  <footer class="site-footer">
    <div class="container">
      <p>&copy; 2026 달빛곰 방송국 · 연습용으로 만든 사이트예요.</p>
    </div>
  </footer>
</body>
</html>
```

**왜 이렇게 하나요?** 홈의 카드와 같은 부품(`card-grid`, `card`, `card-body`)을 다시 써서, CSS를 새로 쓰지 않고도 같은 모양이 나와요. 이 카드는 지금 손으로 쓴 글이라 영상이 늘면 HTML을 직접 고쳐야 해요. Day 20에서 JavaScript가 영상 데이터로 카드를 만들어 주도록 바꿔서 이 불편을 없애요.
:::

:::answer 과제 3 정답 · auto-fit과 auto-fill
카드가 한 장일 때 1280px 창에서 보이는 모습이에요.

- `auto-fit`: 카드 한 장이 본문 폭 전체(약 928px)로 늘어나 꽉 채워요.
- `auto-fill`: 카드가 한 칸 폭(약 299px)으로 왼쪽에 놓이고, 오른쪽에 **빈 칸 자리**가 남아요.

**왜 이렇게 하나요?** `auto-fill`은 카드가 없어도 "들어갈 수 있는 칸"을 모두 만들어 두고, `auto-fit`은 카드가 없는 빈 칸을 접어서 있는 카드가 남는 공간을 차지하게 해요. 이 사이트는 카드가 적을 때도 꽉 차 보이는 것이 자연스러워서 `auto-fit`을 써요. 확인이 끝나면 `auto-fit`으로 되돌리고 주석을 풀어요.
:::

:::answer 오늘 끝 상태 전체 코드
막혔다면 아래 파일들로 맞추고 [Day 13](#/day/p1-d13)을 시작하세요. 바뀐 파일은 `images`의 SVG 3개, `css/style.css`, `index.html`, `contents.html`이에요. `style.css`는 200줄이 넘어서 오늘 바뀐 블록만 위치와 함께 실었어요. 파일 하나를 통째로 바꿀 때는 VS Code에서 그 파일을 열고 `Ctrl + A`로 전체를 선택한 뒤 붙여 넣고 `Ctrl + S`로 저장해요.

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
   ├─ profile.svg
   ├─ thumb-game.svg
   ├─ thumb-music.svg
   └─ thumb-talk.svg
```

SVG 3개는 1단계의 코드와 같아요(`images\thumb-game.svg`, `thumb-talk.svg`, `thumb-music.svg`).

`style.css`는 바뀐 블록 3곳이에요.

1. `5. 공통 부품` 구역의 맨 끝, `/* ---------- 6. 페이지별 ---------- */` 주석 **바로 위**에 카드 블록 전체를 넣어요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
/* 카드 그리드 (Day 12): 칸 하나는 최소 240px, 남는 공간은 똑같이 나눠 가져요 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.card {
  background: #f4f2ff;
  border: 1px solid #d9d6ee;
  border-radius: 12px;
  overflow: hidden;
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
  color: #5a5775;
}
```

2. `/* 홈: 소개 영역 */` 주석 **바로 아래**(`.hero-image` 규칙 위)에 넣어요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
.hero {
  display: grid;
  gap: 1.5rem;
  align-items: center;
  padding-top: 1.5rem;
  padding-bottom: 1rem;
}
```

3. `/* 소개 페이지 */` 주석 **바로 아래**(`.about-image` 규칙 위)에 넣어요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
.about-intro {
  display: grid;
  gap: 1.5rem;
  align-items: start;
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
    <p>지난 방송 영상을 모아 두는 페이지예요.</p>

    <div class="card-grid">
      <article class="card">
        <img src="images/thumb-music.svg" alt="음악 영상 썸네일" width="320" height="180">
        <div class="card-body">
          <h3>기타로 연주하는 신청곡</h3>
          <p>2026-10-27</p>
        </div>
      </article>
      <article class="card">
        <img src="images/thumb-game.svg" alt="게임 영상 썸네일" width="320" height="180">
        <div class="card-body">
          <h3>신작 공포 게임 첫 도전</h3>
          <p>2026-10-25</p>
        </div>
      </article>
      <article class="card">
        <img src="images/thumb-talk.svg" alt="토크 영상 썸네일" width="320" height="180">
        <div class="card-body">
          <h3>구독자 1000명 기념 Q&A</h3>
          <p>2026-10-20</p>
        </div>
      </article>
    </div>
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

### 카드가 계속 세로로만 쌓여요 (칸이 안 나뉘어요)

**원인:** `grid-template-columns`가 적용되지 않았어요. 흔한 이유는 세 가지예요. ① `class="card-grid"`를 `div`가 아니라 `article`에 붙였거나 `div`로 감싸지 않았어요. ② CSS의 `repeat(auto-fit, minmax(240px, 1fr))`에서 쉼표나 괄호가 빠졌어요. ③ 규칙 이름이 `.card-grid`가 아니에요.

**해결:**

1. `index.html`에서 `<div class="card-grid">`가 세 `article`을 모두 감싸는지 확인해요.
2. `style.css`의 `repeat(auto-fit, minmax(240px, 1fr))`를 3단계 블록과 글자 하나씩 비교해요. 쉼표 두 개(`auto-fit,` 뒤, `240px,` 뒤)와 닫는 괄호 두 개가 있어야 해요.
3. 저장하고 `Ctrl + F5`로 새로 고침해서 카드가 가로로 나란히 놓이면 해결이에요.

### 그림이 카드 밖으로 튀어나오거나 모서리가 각져 보여요

**원인:** `.card img { width: 100%; }`나 `.card`의 `overflow: hidden;`이 빠졌어요. 그림이 원래 크기(320px) 그대로라 카드 폭과 달라지고, 둥근 모서리 밖으로 나온 부분이 잘리지 않아요.

**해결:**

1. `.card { … }` 규칙 안에 `overflow: hidden;`이 있는지 확인해요.
2. `.card img { display: block; width: 100%; }` 규칙이 있는지 확인해요.
3. 저장하고 새로 고침해서 그림이 카드 폭을 꽉 채우고 위쪽 모서리가 둥글면 해결이에요.

### 썸네일이 안 보여요 (깨진 그림 아이콘)

**원인:** 파일 이름이나 경로가 달라요. 가장 흔한 실수는 `thumb_game.svg`처럼 밑줄(`_`)로 만들었거나, 파일이 `images` 폴더가 아닌 곳에 저장된 경우예요. HTML의 `src="images/thumb-game.svg"`와 실제 파일 이름은 대소문자와 하이픈까지 같아야 해요.

**해결:**

1. VS Code 탐색기에서 `images` 폴더 안의 파일 이름이 `thumb-game.svg`, `thumb-talk.svg`, `thumb-music.svg`인지 확인해요.
2. 이름이 다르면 파일을 오른쪽 클릭 → **이름 바꾸기**로 고치거나, 닫혀 있는 파일이라면 탐색기에서 `F2`로 바꿔요.
3. `index.html`의 `src` 값도 같은 이름인지 확인하고, 새로 고침해서 그림이 보이면 해결이에요.

### 카드마다 높이가 달라 보여요

**원인:** 정상이에요. 카드 안 글이 길면 카드가 길어져요. 한 줄에 있는 카드들은 Grid가 같은 높이로 맞춰 주지만, 줄이 다르면 높이가 달라도 괜찮아요.

**해결:**

1. 같은 줄의 카드 높이가 서로 같다면 정상이에요.
2. 줄마다 높이가 달라 거슬린다면 설명 글의 길이를 비슷하게 맞춰 봐요.

### 개발자 도구에서 grid 배지가 안 보여요

**원인:** `display: grid;`가 켜진 요소 줄에만 배지가 붙어요. 카드 하나(`article`)나 `.card-body` 줄에서는 안 보여요. 또 Live Preview 미리 보기 창에는 개발자 도구가 없어요.

**해결:**

1. Edge나 Chrome에서 페이지를 열고 `F12`를 눌러 **Elements**를 열어요.
2. 코드 목록에서 `<div class="card-grid">` 줄을 찾아요(`Ctrl + F`로 `card-grid`를 검색해도 돼요).
3. 그 줄 오른쪽 `grid` 배지를 눌러요. 점선이 보이면 해결이에요.

## 📝 오늘의 체크리스트

- [ ] `images` 폴더에 `thumb-game.svg`, `thumb-talk.svg`, `thumb-music.svg`가 있고 브라우저로 열면 그림이 보여요.
- [ ] 홈의 "이런 방송을 해요"가 넓은 창에서 카드 3장이 한 줄로 보여요.
- [ ] 창을 좁히면 카드가 2장 → 1장으로 저절로 바뀌어요.
- [ ] 카드의 위쪽 그림까지 모서리가 둥글게 보여요.
- [ ] 영상 페이지(`contents.html`)에도 카드 3장이 있어요.
- [ ] 홈 소개는 곰 그림이 위, 글이 아래로 쌓여 있어요.
- [ ] 과제 1~3을 풀고 정답과 비교했어요.
- [ ] GitHub 저장소에 `Day 12: Grid 카드 레이아웃`과 `Day 12: 영상 페이지 카드 3장` 커밋이 보여요.

## 📚 더 알아보기

- [MDN · CSS 그리드 레이아웃 기본 개념](https://developer.mozilla.org/ko/docs/Web/CSS/Guides/Grid_layout/Basic_concepts): 줄과 칸, `fr`, `repeat()`를 그림으로 설명해요.
- [MDN · grid-template-columns](https://developer.mozilla.org/ko/docs/Web/CSS/Reference/Properties/grid-template-columns): 칸의 폭을 정하는 속성과 `fr`, `minmax()` 예제를 보여 줘요.
- [MDN · repeat() (영어 문서)](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/repeat): `auto-fit`과 `auto-fill`의 차이를 예제로 보여 줘요.

➡️ **다음 Day 예고:** [Day 13 · 반응형 웹](#/day/p1-d13)에서는 휴대폰 크기까지 고려해서, 화면이 좁을 때와 넓을 때의 배치를 `@media`로 나눠 만들어요.
