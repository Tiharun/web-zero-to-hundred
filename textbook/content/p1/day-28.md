## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- 마우스 없이 `Tab`, `Shift + Tab`, `Enter`, `Space`만으로 사이트를 돌아다니고, 첫 `Tab`에 나타나는 **본문 바로가기** 링크로 본문까지 한 번에 가요.
- 다섯 페이지에 페이지마다 다른 제목과 설명, 링크 미리 보기용 Open Graph, 브라우저 탭 아이콘(파비콘)을 달아요.
- 그림과 영상을 화면에 가까워질 때만 불러오게(`loading="lazy"`) 해서 첫 화면을 가볍게 만들어요.
- Chrome 개발자 도구의 **Lighthouse**로 사이트의 접근성·SEO 점수를 확인하고, 항목 하나를 골라 이유를 설명할 수 있어요.

**예상 시간: 110분** (개념 이해 25분 · 따라하기 58분 · 과제 22분 · 정리 5분)

:::path 📂 시작 상태
어제(Day 27)까지 만든 파일이 이렇게 있어야 해요. 없거나 다르면 [Day 27](#/day/p1-d27)의 "오늘 끝 상태 전체 코드"로 맞춰 주세요.

- `C:\dev\my-creator-site\about.html`
- `C:\dev\my-creator-site\contact.html`
- `C:\dev\my-creator-site\contents.html`
- `C:\dev\my-creator-site\index.html`
- `C:\dev\my-creator-site\schedule.html`
- `C:\dev\my-creator-site\css\style.css`
- `C:\dev\my-creator-site\data\schedule.json`
- `C:\dev\my-creator-site\data\videos.json`
- `C:\dev\my-creator-site\images\logo.svg`
- `C:\dev\my-creator-site\images\profile.svg`
- `C:\dev\my-creator-site\images\thumb-game.svg`
- `C:\dev\my-creator-site\images\thumb-music.svg`
- `C:\dev\my-creator-site\images\thumb-talk.svg`
- `C:\dev\my-creator-site\js\contact.js`
- `C:\dev\my-creator-site\js\contents.js`
- `C:\dev\my-creator-site\js\main.js`
- `C:\dev\my-creator-site\js\schedule.js`
- `C:\dev\my-creator-site\overlay\countdown.css`
- `C:\dev\my-creator-site\overlay\countdown.html`
- `C:\dev\my-creator-site\overlay\countdown.js`
- 연습 폴더 `C:\dev\hello\`에 `hello.html`, `favorites.html`, `tools.html`, `links.html`, `plan.html`, `lab.html`, `lab.js`, `pages\back.html`이 있어요(오늘은 열지 않아도 돼요).
- VS Code에서 `C:\dev\my-creator-site` 폴더가 열려 있고, 한국어 팩과 Live Preview 확장 프로그램이 설치되어 있어요.
- 파일 탐색기의 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
- Git이 설치되어 있고(`git --version` → `git version 2.56.0.windows.4`, 숫자는 달라도 돼요) GitHub의 공개(Public) 저장소 `https://github.com/<내 아이디>/my-creator-site`와 연결되어 있어요.
- GitHub Pages가 켜져 있어요: `https://<내 아이디>.github.io/my-creator-site/`
- (선택) OBS Studio가 설치되어 있고, 브라우저 소스로 카운트다운 오버레이를 띄워 봤어요.
- 어제까지의 변경이 모두 커밋·푸시되어 소스 제어 패널의 변경이 0개예요.
:::

## 📖 개념 이해

기능은 거의 다 만들었어요. 오늘은 **누구나, 어떤 환경에서나 잘 쓸 수 있게** 다듬어요. 마우스 없이 키보드로만 쓰는 사람, 스크린 리더로 듣는 사람, 느린 인터넷을 쓰는 사람, 검색 결과에서 우리 사이트를 찾는 사람을 생각해요.

### 키보드만으로 쓰기: 포커스와 건너뛰기 링크

`Tab`을 누르면 링크나 버튼 같은 "누를 수 있는 것"에 차례로 **포커스**(선택된 상태)가 옮겨가요. `Shift + Tab`은 거꾸로, `Enter`는 링크와 버튼을 눌러요(버튼은 `Space`도 돼요). 마우스를 못 쓰는 사람, 쓰기 싫은 사람 모두 이렇게 사이트를 돌아다녀요.

그런데 두 가지 문제가 생겨요.

1. **지금 어디에 있는지 보여야 해요.** 포커스가 어디 있는지 안 보이면 길을 잃어요. CSS `:focus-visible`은 "키보드로 포커스가 왔을 때"만 고르는 선택자예요. 마우스로 클릭했을 때는 굳이 테두리가 안 나오고, 키보드로 올 때만 나와요. 우리는 `outline`(바깥 테두리)을 포인트 색 3px로 그려요.
2. **매 페이지마다 메뉴 6개를 지나야 본문에 가요.** 그래서 **[[건너뛰기 링크]]**(skip link)를 맨 앞에 둬요. 평소에는 화면 밖에 숨어 있다가, 키보드로 `Tab`을 처음 누르면 화면 왼쪽 위에 나타나서, `Enter`를 누르면 메뉴를 건너뛰고 본문(`#main`)으로 가요. 키보드나 스크린 리더로 사이트를 쓰는 사람을 위한 접근성 기능이에요.

건너뛰기 링크는 이렇게 만들어요.

```html
<a class="skip-link" href="#main">본문 바로가기</a>
...
<main id="main">
```

`href="#main"`은 "같은 페이지의 `id`가 `main`인 곳으로 가요"라는 뜻(Day 4)이라서, `<main>`에 `id="main"`이 **꼭** 있어야 해요. CSS로는 `position: absolute; top: -4rem;`으로 화면 위쪽 밖에 두고, `:focus`일 때만 `top: 0;`으로 내려요. `z-index`는 다른 요소 위에 그려지게 하는 순서 번호예요.

### 화면에서는 숨기고 스크린 리더에게만 읽히는 글자

`.sr-only`라는 도구 클래스도 CSS에 넣어요(screen reader only). 화면에서는 1px 크기로 잘려 안 보이지만 스크린 리더는 읽어요. 아이콘 버튼처럼 눈에는 그림만 보이는데 소리로는 설명이 필요할 때 써요. 지금 우리 사이트는 쓰는 곳이 없지만, 나중에 필요할 때를 위해 레퍼런스에도 들어 있는 도구예요.

### 이미 한 접근성을 다시 보기

오늘 새로 만들지 않아도 이미 한 것들이 있어요. 이 목록이 접근성 점검표예요.

- **대체 텍스트**(Day 5): 의미 있는 그림에는 `alt`를 써요. 장식 그림은 `alt=""`로 비워서 스크린 리더가 건너뛰어요(로고).
- **구역 이름**(Day 26): `section`에 `aria-labelledby`로 제목을 연결해요. 오늘 홈 페이지의 "이런 방송을 해요", "대표 영상" 두 구역에도 달아요. 제목 `<h2>`에는 `id`를 줘요.
- **색만으로 구분하지 않기**: 오늘 요일 행은 노란 색 + `(오늘)` 글자(Day 26), 오류는 빨간 색 + 안내 문장(Day 24)이었어요.
- **움직임 줄이기**: 어떤 사람은 화면의 움직임이 어지러워서 Windows에서 "움직임 줄이기"(애니메이션 효과 끄기)를 켜 둬요. CSS `@media (prefers-reduced-motion: reduce)`는 그 설정을 읽는 미디어 쿼리(Day 13, 22와 같은 계열)예요. 이 설정이 켜진 사람에게는 `transition`(Day 14)을 꺼요.

### SEO: 검색 엔진이 우리 페이지를 이해하게

**[[SEO]]**(에스이오, Search Engine Optimization)는 검색 엔진이 내 페이지를 잘 이해하고 검색 결과에 알맞게 보여 주도록 다듬는 일이에요. 기본기는 세 가지예요.

1. 페이지마다 **다른 `<title>`**: 검색 결과의 파란 제목이 돼요. 다섯 페이지 제목이 모두 같으면 구분이 안 돼요. 홈은 `달빛곰 방송국 - 게임·토크·음악 스트리머`처럼 사이트가 무엇인지 알려요.
2. **`<meta name="description" content="…">`**: 검색 결과 제목 아래에 보일 수 있는 한두 문장의 요약이에요. 페이지마다 다르게, 핵심 낱말을 앞쪽에 써요.
3. **페이지당 `<h1>` 하나**: 그 페이지가 무엇에 대한 것인지 가장 큰 제목 하나로 알려요(Day 6).

### Open Graph: 링크를 공유할 때의 미리 보기

친구에게 메신저로 주소를 보내면 제목과 설명이 카드처럼 보일 때가 있어요. **[[Open Graph]]**(오픈 그래프)는 링크를 메신저나 SNS에 공유할 때 보이는 미리 보기(제목·설명·그림)를 정하는 `meta` 태그 규칙이에요. `og:`로 시작하는 이름을 써요.

```html
<meta property="og:title" content="달빛곰 방송국 - 게임·토크·음악 스트리머">
<meta property="og:description" content="…">
<meta property="og:type" content="website">
<meta property="og:locale" content="ko_KR">
```

`og:image`(미리 보기 그림)는 `https://`로 시작하는 **전체 주소**가 필요해요. 배포 주소가 정해진 뒤에 넣을 수 있어서 이 교재의 완성본에는 넣지 않았어요. 넣고 싶다면 배포 후에 `https://<내 아이디>.github.io/my-creator-site/…` 형태의 전체 주소로 추가해요. 메신저마다 SVG를 미리 보기 그림으로 안 쓰기도 하니 PNG나 JPG를 권해요(서비스마다 달라요). 미리 보기는 한 번 보이면 메신저가 기억(캐시)해서, 바꿔도 곧바로 안 바뀔 수 있어요.

### 파비콘: 탭 위의 작은 아이콘

**[[파비콘]]**(favicon)은 브라우저 탭과 즐겨찾기에 보이는 사이트의 작은 아이콘이에요. `<link rel="icon" href="favicon.svg" type="image/svg+xml">`로 연결해요. SVG(Day 5)라서 크기를 키워도 선명해요. 브라우저가 아이콘을 오래 기억하므로, 바꿨는데 그대로면 새 탭으로 열거나 강력 새로 고침(`Ctrl + F5`)을 해요.

`overlay` 폴더 안의 `countdown.html`에서는 `favicon.svg`가 한 단계 위 폴더에 있으니 `../favicon.svg`로 써요(Day 5의 상위 폴더 `../`).

### 성능: 보이지 않는 건 나중에, 자리는 미리

페이지를 열 때 그림 파일을 전부 내려받으면 첫 화면이 늦어져요. **[[지연 로딩]]**(lazy loading)은 화면에 보이지 않는 그림이나 iframe을 미리 받지 않고, 스크롤해서 가까워질 때 받는 방식이에요. `<img loading="lazy">`처럼 속성 하나로 켜요. Day 20에서 JavaScript로 `image.loading = 'lazy'`를 썼는데 그 뜻이 이거예요.

그림에는 `width`와 `height`도 꼭 써요. 그림이 로딩되기 전에 자리를 미리 잡아 두어야, 로딩이 끝났을 때 아래 글이 밀려 내려가는 현상(화면 밀림)이 없어요. 이미 홈 페이지의 카드 그림에는 `width="320" height="180"`이 있어요.

### Lighthouse: 사이트 품질 검사기

**[[Lighthouse]]**(라이트하우스)는 Chrome 개발자 도구에 들어 있는 웹페이지 품질 검사 도구예요. 성능, 접근성, 권장 사항, SEO를 검사해 0~100점과 고칠 점 목록을 보여 줘요. 확장 프로그램과 네트워크 상태에 따라 점수가 매번 조금씩 달라요. 그래서 시크릿 창(확장 프로그램이 꺼진 창)에서 검사하는 게 좋아요. 점수 자체보다 **"고칠 점 목록"을 읽는 연습**이 중요해요.

## 🛠️ 따라하기

모두 9단계예요. 다섯 페이지를 고치는 일이 많아서 `index.html`로 먼저 하고, 나머지 네 개는 같은 세 가지를 반복해요. 개발자 도구가 필요한 단계는 Live Preview 주소(`http://127.0.0.1:3000/index.html`, 숫자는 달라도 돼요)를 Edge(또는 Chrome) 주소창에 붙여서 열어요.

### 1단계 · favicon.svg 만들기 (5분)

**어디서:** VS Code 왼쪽 탐색기 → `my-creator-site` 폴더(맨 위 빈 곳) 오른쪽 클릭 → **새 파일**

**무엇을:** `favicon.svg`를 입력하고 `Enter`를 눌러요(경로 `C:\dev\my-creator-site\favicon.svg`). 열린 빈 파일에 아래를 붙여 넣고 저장해요. 보라색 둥근 사각형 위에 노란 초승달을 겹쳐서 만든 그림이에요. 노란 원 위에 배경색과 같은 원을 겹치면 초승달 모양이 돼요.

📄 C:\dev\my-creator-site\favicon.svg
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#5b4bdb"/>
  <!-- 초승달: 노란 원 위에 배경색 원을 겹쳐서 만들어요 -->
  <circle cx="30" cy="34" r="18" fill="#ffd66b"/>
  <circle cx="40" cy="27" r="16" fill="#5b4bdb"/>
</svg>
```

:::success
VS Code에서 `favicon.svg`를 열었을 때 코드가 보여요. 탐색기에서 더블클릭하면 브라우저에 보라색 정사각형 안의 노란 초승달이 보여요.
:::

### 2단계 · style.css: 포커스 테두리, 건너뛰기 링크, 움직임 줄이기 (8분)

**어디서:** VS Code → `C:\dev\my-creator-site\css\style.css`

**무엇을:** 두 곳에 넣어요.

**(1)** 2번 구역(기본 설정)의 `h3 { … }` 규칙이 끝나는 `}` 줄과 `/* ---------- 3. 레이아웃 ---------- */` 주석 **사이**에 아래 블록을 붙여 넣어요. 앞뒤로 빈 줄을 하나씩 둬요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
/* 키보드로 이동할 때 현재 위치가 보이게 해요 (접근성, Day 28) */
:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
}

/* 화면에서는 숨기고 스크린 리더에게만 읽히는 글자 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* "본문 바로가기": 키보드로 Tab을 처음 누르면 나타나요 */
.skip-link {
  position: absolute;
  left: 1rem;
  top: -4rem;
  background: var(--accent);
  color: var(--accent-text);
  padding: 0.5rem 1rem;
  border-radius: 0 0 var(--radius) var(--radius);
  z-index: 10;
}

.skip-link:focus {
  top: 0;
}
```

- `:focus-visible`: 키보드 포커스 때 `var(--accent)` 색 3px 테두리를 그리고, `outline-offset: 2px;`로 요소에서 2px 띄워요.
- `.sr-only`: 위에서 설명한 "스크린 리더에게만 읽히는" 도구 클래스예요.
- `.skip-link`: `top: -4rem;`으로 화면 위 밖에 숨겨요. `:focus`일 때 `top: 0;`으로 내려와요.

**(2)** 파일의 **맨 마지막**(`@media (min-width: 768px) { … }` 블록 아래)에 빈 줄 하나를 두고 아래 블록을 붙여 넣어요. 이것으로 `style.css`가 완성돼요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
/* 움직임을 줄여 달라고 설정한 사용자를 배려해요 (Day 28) */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
  }
}
```

`*`는 모든 요소를 뜻하는 선택자(전체 선택자)예요. `!important`는 다른 규칙을 이기게 하는 장치인데(Day 23) 여기서는 "모든 transition을 꺼요"를 확실히 하려고 써요.

저장해요. 아직 건너뛰기 링크가 HTML에 없어서 화면은 그대로예요.

### 3단계 · index.html: head 바꾸기, 건너뛰기 링크, main id (9분)

**어디서:** VS Code → `C:\dev\my-creator-site\index.html`

**무엇을:** 세 가지를 해요.

**(1)** `<head>` 줄부터 `</head>` 줄까지를 선택해서 아래 블록으로 바꿔요. 제목이 `달빛곰 방송국 - 게임·토크·음악 스트리머`로 길어지고, 설명·Open Graph·파비콘이 생겨요. 설명 문장은 내 말로 바꿔도 돼요.

📄 C:\dev\my-creator-site\index.html (일부)
```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>달빛곰 방송국 - 게임·토크·음악 스트리머</title>
  <meta name="description" content="게임, 토크, 음악 방송을 하는 스트리머 달빛곰의 공식 홈페이지예요. 방송 일정과 지난 영상을 확인해 보세요.">
  <!-- Open Graph: 링크를 공유할 때 보이는 제목과 설명이에요 (Day 28) -->
  <meta property="og:title" content="달빛곰 방송국 - 게임·토크·음악 스트리머">
  <meta property="og:description" content="게임, 토크, 음악 방송을 하는 스트리머 달빛곰의 공식 홈페이지예요. 방송 일정과 지난 영상을 확인해 보세요.">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="ko_KR">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="css/style.css">
  <script src="js/main.js" defer></script>
</head>
```

**(2)** `<body>` 줄 **바로 아래**에 아래 한 줄과 빈 줄 하나를 붙여 넣어요. 머리글(`<header …>`)보다 위에 있어야 `Tab`을 처음 눌렀을 때 맨 먼저 포커스를 받아요.

```html
  <a class="skip-link" href="#main">본문 바로가기</a>
```

**(3)** `<main>` 줄(여는 태그)을 `<main id="main">`으로 바꿔요. 건너뛰기 링크의 `href="#main"`이 가리키는 곳이에요.

저장하고 Live Preview에서 `index.html`을 새로 고침해요. 화면 안을 한 번 클릭한 다음, 키보드로 `Tab`을 한 번 눌러 봐요.

:::success
`Tab`을 한 번 누르면 화면 왼쪽 위에 보라색 **본문 바로가기** 글자가 나타나고(테두리가 둘러져 있어요), `Enter`를 누르면 주소 끝에 `#main`이 붙으면서 본문으로 이동해요. 브라우저 탭에는 아직 아이콘이 안 보이는 경우가 있어요(파비콘은 브라우저가 기억해서 늦게 바뀌어요). 안 나타나면 클릭 후 눌렀는지(포커스가 주소 표시줄에 있으면 안 나와요), `<main>`에 `id="main"`이 있는지 확인해요.
:::

### 4단계 · index.html: 구역 이름, 지연 로딩 (7분)

**어디서:** VS Code → `C:\dev\my-creator-site\index.html`

**무엇을:** 네 곳을 고쳐요.

1. `<h2>이런 방송을 해요</h2>`를 가진 `<section class="container">` 줄을 아래처럼 바꿔요. `section`에 `aria-labelledby`, `h2`에 `id`가 생겨요.

```html
    <section class="container" aria-labelledby="what-title">
      <h2 id="what-title">이런 방송을 해요</h2>
```

2. `<h2>대표 영상</h2>`을 가진 `<section class="container">`도 같은 방식으로 바꿔요.

```html
    <section class="container" aria-labelledby="featured-title">
      <h2 id="featured-title">대표 영상</h2>
```

3. 카드 그림 3개(`thumb-game.svg`, `thumb-talk.svg`, `thumb-music.svg`의 `<img …>`)의 `height="180"` 뒤에 ` loading="lazy"`를 붙여요. 한 개의 모양은 이래요(나머지 둘도 같아요).

```html
          <img src="images/thumb-game.svg" alt="게임 방송을 나타내는 컨트롤러 그림" width="320" height="180" loading="lazy">
```

4. 대표 영상 `iframe` 위의 주석을 아래로 바꾸고, `<iframe …>`에 ` loading="lazy"`를 `title="…"` 뒤, `referrerpolicy` 앞에 넣어요.

```html
      <!-- YouTube 공유 → 퍼가기에서 복사한 iframe이에요. loading="lazy"는 화면에 가까워질 때 불러와요 -->
      <iframe class="video-frame" src="https://www.youtube.com/embed/aqz-KE-bpKQ" title="달빛곰 대표 영상 (예시 영상이에요)" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
```

영상 ID(`aqz-KE-bpKQ`)는 예시예요. 내 YouTube 영상 주소 `watch?v=` 뒤의 11글자로 바꿔도 돼요. 파일을 더블클릭(`file://`)으로 열면 YouTube 영상이 재생되지 않을 수 있어요.

저장하고 새로 고침해요.

:::success
화면은 눈으로 보기에 어제와 똑같아요. 개발자 도구 **Elements**에서 `<img …>`를 보면 `loading="lazy"`가 붙어 있고, 콘솔에 빨간 오류는 없어요. 보이지 않는 곳이 달라진 거예요.
:::

### 5단계 · 나머지 네 페이지: head와 body 고치기 (9분)

`about.html`, `contents.html`, `schedule.html`, `contact.html`에서 3단계와 같은 세 가지를 해요. 네 파일 모두 (1) head 바꾸기, (2) `<body>` 아래에 건너뛰기 링크, (3) `<main …>`에 `id="main"` 추가예요. 이번에는 `<main class="container">`를 `<main id="main" class="container">`로 바꿔요.

**(1)** 파일마다 `<head>`부터 `</head>`까지를 아래 블록으로 바꿔요. 페이지마다 제목, 설명, 불러오는 스크립트가 달라요.

**`about.html`**

📄 C:\dev\my-creator-site\about.html (일부)
```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>소개 - 달빛곰 방송국</title>
  <meta name="description" content="스트리머 달빛곰은 어떤 사람일까요? 방송 소개와 방송 규칙을 알려 드려요.">
  <!-- Open Graph: 링크를 공유할 때 보이는 제목과 설명이에요 (Day 28) -->
  <meta property="og:title" content="소개 - 달빛곰 방송국">
  <meta property="og:description" content="스트리머 달빛곰은 어떤 사람일까요? 방송 소개와 방송 규칙을 알려 드려요.">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="ko_KR">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="css/style.css">
  <script src="js/main.js" defer></script>
</head>
```

**`contents.html`**

📄 C:\dev\my-creator-site\contents.html (일부)
```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>영상 모아보기 - 달빛곰 방송국</title>
  <meta name="description" content="달빛곰의 지난 방송 영상을 게임, 토크, 음악으로 나눠 보고 제목으로 검색해 보세요.">
  <!-- Open Graph: 링크를 공유할 때 보이는 제목과 설명이에요 (Day 28) -->
  <meta property="og:title" content="영상 모아보기 - 달빛곰 방송국">
  <meta property="og:description" content="달빛곰의 지난 방송 영상을 게임, 토크, 음악으로 나눠 보고 제목으로 검색해 보세요.">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="ko_KR">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="css/style.css">
  <script src="js/main.js" defer></script>
  <script src="js/contents.js" defer></script>
</head>
```

**`schedule.html`**

📄 C:\dev\my-creator-site\schedule.html (일부)
```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>방송 일정 - 달빛곰 방송국</title>
  <meta name="description" content="달빛곰의 주간 방송 일정표예요. 오늘 방송과 다음 방송까지 남은 시간을 확인해 보세요.">
  <!-- Open Graph: 링크를 공유할 때 보이는 제목과 설명이에요 (Day 28) -->
  <meta property="og:title" content="방송 일정 - 달빛곰 방송국">
  <meta property="og:description" content="달빛곰의 주간 방송 일정표예요. 오늘 방송과 다음 방송까지 남은 시간을 확인해 보세요.">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="ko_KR">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="css/style.css">
  <script src="js/main.js" defer></script>
  <script src="js/schedule.js" defer></script>
</head>
```

**`contact.html`**

📄 C:\dev\my-creator-site\contact.html (일부)
```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>문의하기 - 달빛곰 방송국</title>
  <meta name="description" content="협업 제안이나 궁금한 점이 있다면 문의 폼으로 남겨 주세요. 달빛곰이 확인하고 답해 드려요.">
  <!-- Open Graph: 링크를 공유할 때 보이는 제목과 설명이에요 (Day 28) -->
  <meta property="og:title" content="문의하기 - 달빛곰 방송국">
  <meta property="og:description" content="협업 제안이나 궁금한 점이 있다면 문의 폼으로 남겨 주세요. 달빛곰이 확인하고 답해 드려요.">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="ko_KR">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="css/style.css">
  <script src="js/main.js" defer></script>
  <script src="js/contact.js" defer></script>
</head>
```

(2)와 (3)은 3단계와 같아요. 네 파일 모두 `<body>` 바로 아래에 `<a class="skip-link" href="#main">본문 바로가기</a>`와 빈 줄을 넣고, `<main class="container">`를 `<main id="main" class="container">`로 바꿔요.

각 파일을 저장하고 새로 고침해서 `Tab` 한 번에 **본문 바로가기**가 나타나는지 확인해요.

:::success
다섯 페이지 모두에서 `Tab`을 처음 누르면 **본문 바로가기**가 나타나고, `Enter`를 누르면 주소 끝에 `#main`이 붙어요. 브라우저 탭 제목이 페이지마다 달라요(`소개 - 달빛곰 방송국`, `영상 모아보기 - 달빛곰 방송국` …).
:::

### 6단계 · 오버레이에도 파비콘 달기 (3분)

**어디서:** VS Code → `C:\dev\my-creator-site\overlay\countdown.html`

**무엇을:** `<title>방송 카운트다운 오버레이</title>` 줄 **바로 아래**에 두 줄(주석과 `<link>`)을 붙여 넣고 저장해요. 경로가 `../favicon.svg`인 것에 주의하세요. `overlay` 폴더 밖에 있는 파일이라서 한 단계 위로 올라가요.

📄 C:\dev\my-creator-site\overlay\countdown.html (일부)
```html
  <!-- ../ 는 "한 단계 위 폴더"라는 뜻이에요. overlay 폴더 밖에 있는 favicon.svg를 가리켜요 (Day 5) -->
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
```

:::success
Live Preview 주소로 `overlay/countdown.html`을 열면 탭에 초승달 아이콘이 보여요(브라우저가 기억해서 안 바뀌어 보이면 새 탭이나 `Ctrl + F5`로 다시 열어요). `favicon.svg`로 쓰면(`../` 없이) 아이콘이 안 보여요.
:::

### 7단계 · 키보드만으로 사이트 돌아다니기 (5분)

**어디서:** Live Preview 또는 파일 더블클릭으로 연 `index.html`

**무엇을:** 마우스에서 손을 떼고 키보드로만 해요.

1. 화면을 한 번 클릭한 뒤 `F5`로 새로 고침해요(클릭하지 않으면 포커스가 주소 표시줄에 있어요).
2. `Tab`을 여러 번 눌러 포커스가 **본문 바로가기** → 로고 → 메뉴 항목들 → 🌙 다크 모드 → 본문의 버튼 순서로 가는지 봐요.
3. `Shift + Tab`으로 거꾸로 가 봐요.
4. 메뉴에서 **소개**에 포커스를 두고 `Enter`를 눌러 다른 페이지로 가요.
5. 🌙 다크 모드 버튼에서 `Space`나 `Enter`를 눌러 테마를 바꿔요.

:::success
포커스가 있는 곳마다 보라색 3px 테두리가 보여요. 어디에 포커스가 있는지 항상 알 수 있어요. 마우스를 한 번도 안 쓰고 페이지를 옮기고 다크 모드를 켰어요.
:::

### 8단계 · Lighthouse로 검사하기 (9분)

**어디서:** Chrome → 시크릿 창(`Ctrl + Shift + N`) → 주소 입력

**무엇을:**

1. 시크릿 창에서 Live Preview 주소(`http://127.0.0.1:3000/index.html`, 숫자는 달라도 돼요)를 입력해서 열어요. VS Code가 켜져 있어야 해요. 배포가 끝난 뒤라면 배포 주소를 쓰는 것이 가장 좋아요.
2. `F12`를 눌러 개발자 도구를 열고 위쪽 탭 줄에서 **Lighthouse**를 눌러요. 안 보이면 오른쪽 끝 `»`(더 보기) 안에 있어요. 탭 위치와 이름은 버전에 따라 조금 다를 수 있어요. Edge에도 Lighthouse가 있을 수 있지만, 이 교재는 Chrome 기준이에요.
3. 범주(Categories)에서 **성능**, **접근성**, **권장 사항**, **SEO**를 체크하고, 기기는 **모바일**(기본값)로 둬요.
4. **페이지 로드 분석**(영어: **Analyze page load**) 버튼을 눌러요. 버튼 이름은 버전에 따라 조금 다를 수 있어요.
5. 30초~1분 기다려요. 검사가 끝나면 원 네 개에 0~100점이 나와요.
6. 점수가 100이 아닌 항목이 있으면 그 원을 눌러 아래 목록을 읽어요. 목록 항목을 펼치면 어느 요소가 문제인지와 고치는 방법이 나와요.

참고로 이 교재를 쓰는 환경에서 어제(Day 27) 상태의 홈 페이지를 검사했을 때는 SEO 91점(**Document does not have a meta description**, 설명 없음)과 권장 사항 96점이었고, 오늘 끝 상태에서는 네 범주 모두 100점이었어요(Lighthouse 12.8.2, 모바일 기본 설정). 내 점수는 환경에 따라 달라도 돼요.

:::success
**접근성**과 **SEO**가 90점대 후반 이상으로 나와요. 숫자가 100이 아니어도 괜찮아요. 점수는 매번 조금씩 달라요. Live Preview 주소로 검사하면 배포 주소와 점수가 조금 다를 수 있어요(개발용 서버와 진짜 서버의 차이예요). 점수가 낮은 항목이 있다면 과제 3에서 하나를 골라 고쳐요.
:::

### 9단계 · 커밋·푸시 (3분)

**어디서:** VS Code → 소스 제어 패널(`Ctrl + Shift + G`)

**무엇을:** **메시지** 칸에 `Day 28: 접근성, SEO, 파비콘`을 입력하고 **커밋** → **변경 내용 동기화**를 눌러요. 명령으로 한다면 VS Code 터미널(PowerShell), 위치 `C:\dev\my-creator-site`에서 아래를 한 줄씩 실행해요.

```powershell
git add .
git commit -m "Day 28: 접근성, SEO, 파비콘"
git push
```

`git commit` 예상 출력(해시와 숫자는 달라도 돼요):

```text
[main 6d2a8c0] Day 28: 접근성, SEO, 파비콘
 ?
```

:::success
GitHub 저장소에 `favicon.svg`가 생기고 `Day 28: 접근성, SEO, 파비콘` 커밋이 맨 위에 보여요. 10분쯤 뒤 배포 주소의 브라우저 탭에 초승달 아이콘이 보여요.
:::

## ✍️ 과제

### 과제 1 · 키보드만으로 문의 보내기 (쉬움 ⭐, 6분)

문의 페이지에서 마우스를 쓰지 않고 `Tab`만으로 이름·이메일·내용 칸을 채워 **보내기**까지 눌러 보세요. 먼저 칸을 비운 채 보내서 오류가 나면 커서가 어디로 가는지도 봐요.

- 확인 방법: 성공하면 초록 성공 문장이 나와요. 오류일 때는 커서가 첫 오류 칸(이름)으로 가요.
- 힌트: `Tab`으로 칸을 이동하고, 문의 종류(선택 목록)는 방향키로 바꾸고, 버튼에서는 `Enter`나 `Space`를 눌러요.

### 과제 2 · 내 설명 문장 쓰기 (보통 ⭐⭐, 8분)

다섯 페이지의 `<meta name="description">`과 `og:description`을 내 말로 바꿔 보세요. 검색 결과에 보일 한두 문장이라고 생각하고 쓰세요.

- 확인 방법: 다섯 파일에서 설명 문장이 서로 다르고, `description`과 `og:description`이 같은 문장이에요.
- 힌트: 페이지마다 그 페이지 내용을 말하고, 핵심 낱말(예: 방송 일정, 영상, 문의)을 앞쪽에 써요. 너무 길면 검색 결과에서 잘려요(대략 한두 문장).

### 과제 3 · Lighthouse 항목 하나 고치기 (도전 ⭐⭐⭐, 8분)

Lighthouse 결과에서 100점이 아닌 항목이나 진단 항목 하나를 골라, 원인과 고친 방법을 한두 문장으로 적고 고친 뒤 다시 검사해 보세요. 점수가 모두 100이라면 홈 페이지 첫 그림의 `alt="…"` 속성을 잠깐 지우고 다시 검사해서 항목이 어떻게 생기는지 보고 **되돌리세요.**

- 확인 방법: 고친 뒤에는 그 항목이 목록에서 사라져요.
- 힌트: 항목 이름을 펼치면 문제가 된 요소가 나와요. 항목 이름은 영어 원문 그대로 검색해도 좋아요.

## ✅ 정답

:::answer 과제 1 정답 · 키보드만으로 문의 보내기
```text
Tab        다음 칸으로 (이름 → 이메일 → 닉네임 → 문의 종류 → 내용 → 보내기)
Shift+Tab  이전 칸으로
방향키     문의 종류(선택 목록) 바꾸기
Enter/Space  보내기 버튼 누르기
```

**왜 이렇게 하나요?** `<input>`, `<select>`, `<textarea>`, `<button>`은 브라우저가 키보드 이동을 이미 지원하는 요소라서 따로 만들 게 없어요. 칸을 비운 채 보내면 `contact.js`가 `invalidInputs[0].focus()`로 첫 오류 칸에 커서를 옮겨서, 키보드 사용자도 어디를 고쳐야 하는지 바로 알아요. 이것이 Day 24에서 `focus()`를 쓴 이유예요.
:::

:::answer 과제 2 정답 · 내 설명 문장 쓰기
레퍼런스 예시(달빛곰 버전)예요. 내 사이트에 맞게 바꿔도 돼요.

```html
<meta name="description" content="달빛곰의 주간 방송 일정표예요. 오늘 방송과 다음 방송까지 남은 시간을 확인해 보세요.">
<meta property="og:description" content="달빛곰의 주간 방송 일정표예요. 오늘 방송과 다음 방송까지 남은 시간을 확인해 보세요.">
```

**왜 이렇게 하나요?** 설명 문장은 페이지마다 달라야 해요. 모든 페이지가 같으면 검색 엔진도 사람도 페이지를 구별하지 못해요. 핵심 낱말(`방송 일정`)을 앞쪽에 두면 검색 결과에서 눈에 띄고, 한두 문장으로 쓰면 잘리지 않아요. `og:description`은 링크 미리 보기용이라서 보통 `description`과 같은 문장을 써요. 설명은 글 내용이라 내 말로 바꾼 것을 끝 상태에 남겨 두어도 돼요.
:::

:::answer 과제 3 정답 · Lighthouse 항목 하나 고치기
예시: 홈 페이지 첫 그림의 `alt`를 지우고 검사하면 접근성 점수가 내려가고 이런 항목이 생겨요(작성 환경에서 측정했어요).

```text
Image elements do not have `[alt]` attributes
```

```html
<img class="hero-image" src="images/profile.svg" alt="헤드셋을 쓴 곰 캐릭터, 달빛곰" width="240" height="240">
```

**왜 이렇게 하나요?** `alt`가 없는 그림은 스크린 리더가 파일 이름만 읽거나 그냥 지나쳐서, 눈으로 못 보는 사람은 이 그림이 무엇인지 알 수 없어요. `alt`를 되돌리면 항목이 사라져요. 다른 흔한 항목도 같은 방식으로 풀어요. 글자와 배경의 색 대비가 낮다고 하면(Day 22 과제 3) `style.css`의 변수 색을 조정하고, 이미지 크기가 크다고 하면 그림 파일을 더 작게 만들어요. 항목을 펼쳐 보면 원인이 된 요소를 알려 줘요.
:::

:::answer 오늘 끝 상태 전체 코드
막혔다면 아래 코드로 내 파일을 맞추고 다음 Day를 시작해요. 이 Day가 끝나면 HTML·CSS·JS·데이터·이미지 파일이 모두 완성본과 같아요(글 내용만 달라도 돼요). 새 파일 `favicon.svg`, 바뀐 다섯 페이지와 `overlay\countdown.html`은 파일 전체를, `style.css`는 바뀐 블록만 위치와 함께 실었어요.

```text
my-creator-site/
├─ css/
│  └─ style.css ✎
├─ data/
│  ├─ schedule.json
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
│  └─ schedule.js
├─ overlay/
│  ├─ countdown.css
│  ├─ countdown.html ✎
│  └─ countdown.js
├─ about.html ✎
├─ contact.html ✎
├─ contents.html ✎
├─ favicon.svg ★
├─ index.html ✎
└─ schedule.html ✎
```

📄 C:\dev\my-creator-site\favicon.svg
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#5b4bdb"/>
  <!-- 초승달: 노란 원 위에 배경색 원을 겹쳐서 만들어요 -->
  <circle cx="30" cy="34" r="18" fill="#ffd66b"/>
  <circle cx="40" cy="27" r="16" fill="#5b4bdb"/>
</svg>
```

📄 C:\dev\my-creator-site\index.html
```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>달빛곰 방송국 - 게임·토크·음악 스트리머</title>
  <meta name="description" content="게임, 토크, 음악 방송을 하는 스트리머 달빛곰의 공식 홈페이지예요. 방송 일정과 지난 영상을 확인해 보세요.">
  <!-- Open Graph: 링크를 공유할 때 보이는 제목과 설명이에요 (Day 28) -->
  <meta property="og:title" content="달빛곰 방송국 - 게임·토크·음악 스트리머">
  <meta property="og:description" content="게임, 토크, 음악 방송을 하는 스트리머 달빛곰의 공식 홈페이지예요. 방송 일정과 지난 영상을 확인해 보세요.">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="ko_KR">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="css/style.css">
  <script src="js/main.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">본문 바로가기</a>

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
          <li><button class="theme-toggle" type="button" aria-pressed="false">🌙 다크 모드</button></li>
        </ul>
      </nav>
    </div>
  </header>

  <main id="main">
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

    <section class="container" aria-labelledby="what-title">
      <h2 id="what-title">이런 방송을 해요</h2>
      <div class="card-grid">
        <article class="card">
          <img src="images/thumb-game.svg" alt="게임 방송을 나타내는 컨트롤러 그림" width="320" height="180" loading="lazy">
          <div class="card-body">
            <h3>게임 방송</h3>
            <p>신작부터 레트로 게임까지, 시청자와 함께 즐겨요.</p>
          </div>
        </article>
        <article class="card">
          <img src="images/thumb-talk.svg" alt="토크 방송을 나타내는 말풍선 그림" width="320" height="180" loading="lazy">
          <div class="card-body">
            <h3>토크 방송</h3>
            <p>사연을 읽고 수다를 떨어요. 편하게 놀러 오세요.</p>
          </div>
        </article>
        <article class="card">
          <img src="images/thumb-music.svg" alt="음악 방송을 나타내는 음표 그림" width="320" height="180" loading="lazy">
          <div class="card-body">
            <h3>음악 방송</h3>
            <p>기타를 치며 신청곡을 불러 드려요.</p>
          </div>
        </article>
      </div>
    </section>

    <section class="container" aria-labelledby="featured-title">
      <h2 id="featured-title">대표 영상</h2>
      <!-- YouTube 공유 → 퍼가기에서 복사한 iframe이에요. loading="lazy"는 화면에 가까워질 때 불러와요 -->
      <iframe class="video-frame" src="https://www.youtube.com/embed/aqz-KE-bpKQ" title="달빛곰 대표 영상 (예시 영상이에요)" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
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
  <meta name="description" content="스트리머 달빛곰은 어떤 사람일까요? 방송 소개와 방송 규칙을 알려 드려요.">
  <!-- Open Graph: 링크를 공유할 때 보이는 제목과 설명이에요 (Day 28) -->
  <meta property="og:title" content="소개 - 달빛곰 방송국">
  <meta property="og:description" content="스트리머 달빛곰은 어떤 사람일까요? 방송 소개와 방송 규칙을 알려 드려요.">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="ko_KR">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="css/style.css">
  <script src="js/main.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">본문 바로가기</a>

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
          <li><button class="theme-toggle" type="button" aria-pressed="false">🌙 다크 모드</button></li>
        </ul>
      </nav>
    </div>
  </header>

  <main id="main" class="container">
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
  <meta name="description" content="달빛곰의 지난 방송 영상을 게임, 토크, 음악으로 나눠 보고 제목으로 검색해 보세요.">
  <!-- Open Graph: 링크를 공유할 때 보이는 제목과 설명이에요 (Day 28) -->
  <meta property="og:title" content="영상 모아보기 - 달빛곰 방송국">
  <meta property="og:description" content="달빛곰의 지난 방송 영상을 게임, 토크, 음악으로 나눠 보고 제목으로 검색해 보세요.">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="ko_KR">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="css/style.css">
  <script src="js/main.js" defer></script>
  <script src="js/contents.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">본문 바로가기</a>

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

  <main id="main" class="container">
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

📄 C:\dev\my-creator-site\schedule.html
```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>방송 일정 - 달빛곰 방송국</title>
  <meta name="description" content="달빛곰의 주간 방송 일정표예요. 오늘 방송과 다음 방송까지 남은 시간을 확인해 보세요.">
  <!-- Open Graph: 링크를 공유할 때 보이는 제목과 설명이에요 (Day 28) -->
  <meta property="og:title" content="방송 일정 - 달빛곰 방송국">
  <meta property="og:description" content="달빛곰의 주간 방송 일정표예요. 오늘 방송과 다음 방송까지 남은 시간을 확인해 보세요.">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="ko_KR">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="css/style.css">
  <script src="js/main.js" defer></script>
  <script src="js/schedule.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">본문 바로가기</a>

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

  <main id="main" class="container">
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

📄 C:\dev\my-creator-site\contact.html
```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>문의하기 - 달빛곰 방송국</title>
  <meta name="description" content="협업 제안이나 궁금한 점이 있다면 문의 폼으로 남겨 주세요. 달빛곰이 확인하고 답해 드려요.">
  <!-- Open Graph: 링크를 공유할 때 보이는 제목과 설명이에요 (Day 28) -->
  <meta property="og:title" content="문의하기 - 달빛곰 방송국">
  <meta property="og:description" content="협업 제안이나 궁금한 점이 있다면 문의 폼으로 남겨 주세요. 달빛곰이 확인하고 답해 드려요.">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="ko_KR">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="css/style.css">
  <script src="js/main.js" defer></script>
  <script src="js/contact.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main">본문 바로가기</a>

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
          <li><button class="theme-toggle" type="button" aria-pressed="false">🌙 다크 모드</button></li>
        </ul>
      </nav>
    </div>
  </header>

  <main id="main" class="container">
    <h1>문의하기</h1>
    <p>협업 제안, 영상 요청, 궁금한 점을 남겨 주세요. 이 사이트는 연습용이라 실제로 전송되지는 않아요.</p>

    <!-- novalidate: 브라우저 기본 말풍선 대신 contact.js의 안내 문장을 보여 줘요 (Day 24) -->
    <form id="contact-form" class="contact-form" novalidate>
      <div class="field">
        <label for="name">이름</label>
        <input id="name" name="name" type="text" autocomplete="name" required aria-describedby="name-error">
        <p id="name-error" class="field-error"></p>
      </div>

      <div class="field">
        <label for="email">이메일</label>
        <input id="email" name="email" type="email" autocomplete="email" required aria-describedby="email-error">
        <p id="email-error" class="field-error"></p>
      </div>

      <div class="field">
        <label for="nickname">채팅 닉네임 (선택)</label>
        <!-- pattern: 입력한 글자가 이 규칙(한글·영문·숫자·_ 2~20글자)과 맞아야 해요. 비워 두면 괜찮아요 -->
        <input id="nickname" name="nickname" type="text" pattern="[A-Za-z0-9가-힣_]{2,20}" autocomplete="nickname" aria-describedby="nickname-hint nickname-error">
        <p id="nickname-hint" class="field-hint">방송 채팅에서 쓰는 이름이 있다면 적어 주세요. 한글·영문·숫자·밑줄(_) 2~20글자, 공백 없이요.</p>
        <p id="nickname-error" class="field-error"></p>
      </div>

      <div class="field">
        <label for="topic">문의 종류</label>
        <select id="topic" name="topic">
          <option value="general">일반 문의</option>
          <option value="collab">협업 제안</option>
          <option value="request">영상 요청</option>
        </select>
      </div>

      <div class="field">
        <label for="message">내용 (10글자 이상)</label>
        <textarea id="message" name="message" rows="6" required aria-describedby="message-error"></textarea>
        <p id="message-error" class="field-error"></p>
      </div>

      <button type="submit">보내기</button>

      <!-- role="status": 이 칸의 글자가 바뀌면 스크린 리더가 알려 줘요 (aria-live="polite"와 같은 뜻이에요) -->
      <p id="form-status" class="form-status" role="status"></p>
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

📄 C:\dev\my-creator-site\overlay\countdown.html
```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>방송 카운트다운 오버레이</title>
  <!-- ../ 는 "한 단계 위 폴더"라는 뜻이에요. overlay 폴더 밖에 있는 favicon.svg를 가리켜요 (Day 5) -->
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="countdown.css">
  <script src="countdown.js" defer></script>
</head>
<body>
  <!-- OBS 브라우저 소스 주소 예: .../overlay/countdown.html?title=저녁 방송&start=20:00 -->
  <main class="overlay">
    <h1 id="title" class="title">방송 시작까지</h1>
    <p id="countdown" class="countdown" role="timer">--:--:--</p>
  </main>
</body>
</html>
```

`C:\dev\my-creator-site\css\style.css`에는 두 블록을 넣어요.

1. 2번 구역의 `h3 { … }` 규칙과 `/* ---------- 3. 레이아웃 ---------- */` 주석 사이에 넣어요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
/* 키보드로 이동할 때 현재 위치가 보이게 해요 (접근성, Day 28) */
:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
}

/* 화면에서는 숨기고 스크린 리더에게만 읽히는 글자 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* "본문 바로가기": 키보드로 Tab을 처음 누르면 나타나요 */
.skip-link {
  position: absolute;
  left: 1rem;
  top: -4rem;
  background: var(--accent);
  color: var(--accent-text);
  padding: 0.5rem 1rem;
  border-radius: 0 0 var(--radius) var(--radius);
  z-index: 10;
}

.skip-link:focus {
  top: 0;
}
```

2. 파일 맨 끝(`@media (min-width: 768px) { … }` 블록 아래)에 넣어요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
/* 움직임을 줄여 달라고 설정한 사용자를 배려해요 (Day 28) */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
  }
}
```
:::

## 🧯 자주 막히는 곳

여기에 없는 증상은 [문제 해결 모음](#/page/troubleshooting)에서 찾아보세요.

### Tab을 눌러도 본문 바로가기가 안 나타나요

**원인:** 세 가지가 흔해요. ① 페이지를 연 직후라 포커스가 주소 표시줄에 있어요. ② `.skip-link:focus { top: 0; }` 규칙이 없거나 `.skip-link`의 `position: absolute;`가 빠졌어요. ③ `<body>` 바로 아래에 링크를 넣지 않아 다른 요소가 먼저 포커스를 받아요.

**해결:** 화면 아무 곳이나 한 번 클릭한 뒤 `Tab`을 눌러요. 그래도 안 나오면 `style.css`의 `.skip-link`와 `.skip-link:focus`, HTML의 위치를 확인해요.

### 건너뛰기 링크가 늘 보여요

**원인:** `.skip-link`에서 `position: absolute;`나 `top: -4rem;`이 빠져서 평소에도 화면 안에 있어요.

**해결:** 위 2단계 블록을 다시 붙여 넣어요.

### 본문 바로가기를 눌러도 안 움직여요

**원인:** `href="#main"`이 가리키는 `id="main"`이 `<main>`에 없어요.

**해결:** `<main id="main">` 또는 `<main id="main" class="container">`로 바꿔요. 다섯 페이지를 모두 확인해요.

### 파비콘이 안 바뀌어요

**원인:** 브라우저가 아이콘을 오래 기억해요(캐시). 또는 경로가 틀렸어요. 오버레이에서는 `../favicon.svg`여야 해요.

**해결:** 새 탭으로 주소를 열거나 `Ctrl + F5`로 강력 새로 고침해요. 그래도 안 되면 `<link rel="icon" href="favicon.svg" type="image/svg+xml">`의 파일 이름과 위치를 확인하고, 시간을 두고 다시 열어요.

### Lighthouse 탭이 안 보여요

**원인:** 개발자 도구 탭이 많으면 일부가 `»`(더 보기) 안으로 숨어요. Live Preview 미리 보기 창(VS Code 안)에서는 개발자 도구 자체가 안 열려요.

**해결:** `»`를 눌러 **Lighthouse**를 찾아요. 없다면 Chrome에서 Live Preview 주소나 배포 주소를 열었는지 확인해요.

### 확장 프로그램이 성능에 영향을 줬다는 안내가 나와요

**원인:** 설치한 확장 프로그램이 검사에 영향을 줘요.

**해결:** 시크릿 창(`Ctrl + Shift + N`)에서 검사해요. 시크릿 창은 확장 프로그램이 기본적으로 꺼져 있어요.

### Live Preview와 배포 주소의 점수가 달라요

**원인:** 정상이에요. Live Preview는 개발용 서버고 GitHub Pages는 압축·캐시 설정이 다른 진짜 서버예요. 매번 측정 값도 조금씩 달라요.

**해결:** 최종 점수는 배포 주소(시크릿 창)로 확인해요.

### 링크 미리 보기가 안 바뀌어요

**원인:** 링크 미리 보기(Open Graph)는 배포된 주소를 메신저가 가져가서 보여 줘요. 배포 전의 `127.0.0.1` 주소는 보여 줄 수 없고, 한 번 본 주소는 메신저가 기억해서 바꿔도 늦게 바뀌어요.

**해결:** 푸시하고 10분 뒤 배포 주소를 새 대화에 보내 봐요. 바로 안 바뀌어도 시간이 지나면 바뀌어요.

## 📝 오늘의 체크리스트

- [ ] 다섯 페이지에서 `Tab`을 처음 누르면 **본문 바로가기**가 나타나고 `Enter`로 본문에 가요
- [ ] 모든 링크와 버튼에 키보드 포커스가 오면 보라색 테두리가 보여요
- [ ] 브라우저 탭에 초승달 아이콘이 보여요(오버레이 탭 포함)
- [ ] 다섯 페이지의 탭 제목이 서로 달라요
- [ ] 홈 페이지의 카드 그림 3개와 영상에 `loading="lazy"`가 있어요
- [ ] Lighthouse를 한 번 돌려서 접근성·SEO 점수를 봤어요
- [ ] 건너뛰기 링크, SEO, 지연 로딩이 각각 무엇을 위한 것인지 한 문장씩 말할 수 있어요
- [ ] 과제 1~3을 하고 정답과 비교했어요
- [ ] GitHub에 `Day 28` 커밋이 보여요

## 📚 더 알아보기

- [Chrome for Developers — Lighthouse 개요](https://developer.chrome.com/docs/lighthouse/overview): Lighthouse가 무엇을 검사하고 어떻게 쓰는지 설명해요.
- [MDN — :focus-visible](https://developer.mozilla.org/ko/docs/Web/CSS/Reference/Selectors/:focus-visible): 키보드 포커스에만 스타일을 입히는 선택자예요.
- [MDN — loading 속성(img)](https://developer.mozilla.org/ko/docs/Web/HTML/Reference/Elements/img#loading): 지연 로딩 속성의 동작을 설명해요.

➡️ **다음 Day 예고:** [Day 29 · 디버깅과 정리](#/day/p1-d29)에서는 오류 메시지를 읽고 원인을 찾는 순서를 익히고, 개발자 도구의 중단점으로 코드를 한 줄씩 따라가 보고, 폴더를 정리하고 README를 써요.
