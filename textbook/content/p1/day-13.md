## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- 왜 휴대폰 화면을 먼저 생각해야 하는지, 그리고 `<meta name="viewport">` 줄이 하는 일을 설명할 수 있어요.
- `@media (min-width: 768px)`로 화면이 넓을 때만 적용되는 CSS를 쓸 수 있어요.
- 개발자 도구의 기기 모드로 360px·768px·1280px 화면을 바꿔 가며 확인할 수 있어요.
- 휴대폰에서는 메뉴가 로고 아래 세로 목록으로, 넓은 화면에서는 오른쪽 가로 한 줄로 보이는 사이트를 만들 수 있어요.
- YouTube 영상 칸이 화면 폭에 맞춰 16:9 비율을 유지하게 할 수 있어요.

**예상 시간: 100분** (개념 이해 22분 · 따라하기 52분 · 과제 21분 · 정리 5분)

:::path 📂 시작 상태
어제(Day 12)까지 만든 파일이 이렇게 있어야 해요. 없거나 다르면 [Day 12](#/day/p1-d12)의 "오늘 끝 상태 전체 코드"로 맞춰 주세요.

- `C:\dev\my-creator-site\index.html`, `about.html`, `contents.html`, `schedule.html`, `contact.html`
- `C:\dev\my-creator-site\css\style.css`
- `C:\dev\my-creator-site\images\profile.svg`, `logo.svg`, `thumb-game.svg`, `thumb-talk.svg`, `thumb-music.svg`
- 홈과 영상 페이지에 카드 그리드가 있어요(넓은 창에서 3장이 한 줄).
- VS Code에서 `C:\dev\my-creator-site` 폴더가 열려 있고, Live Preview 확장 프로그램이 설치되어 있어요.
- GitHub 저장소 `https://github.com/<내 아이디>/my-creator-site`와 연결되어 있고, 어제 변경은 모두 커밋·푸시했어요(소스 제어 패널의 변경 0개).
:::

## 📖 개념 이해

### 왜 휴대폰부터 생각할까요?

방송을 보는 사람의 많은 수가 휴대폰으로 들어와요. 내 사이트가 PC에서만 예쁘고 휴대폰에서 가로로 밀려 나가면, 그 시청자는 바로 나가 버려요. 그래서 화면 폭이 달라져도 보기 좋은 사이트를 만드는 방식이 기본이 되었어요.

**비유:** 물은 담긴 그릇에 따라 모양이 바뀌어요. 같은 HTML이 좁은 휴대폰 화면에서는 세로로 길게, 넓은 PC 화면에서는 옆으로 퍼져서 담기게 하는 거예요.

**정확한 정의:** **[[반응형 웹]]**(responsive web)은 화면 폭에 맞춰 배치가 바뀌어서 휴대폰·태블릿·PC 어디서나 보기 좋은 웹사이트를 만드는 방식이에요. HTML은 하나이고, CSS가 화면 폭에 따라 배치를 바꿔요.

### 뷰포트와 viewport 줄

**[[뷰포트]]**(viewport)는 브라우저에서 웹페이지가 실제로 보이는 영역이에요. 휴대폰의 뷰포트는 화면 크기만큼이에요.

Day 3부터 모든 페이지의 `<head>`에 있었던 이 줄을 기억하나요?

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

뜻은 "뷰포트의 폭을 **기기 화면 폭에 맞추고**, 처음 확대 비율은 1배로 해요"예요. 이 줄이 없으면 휴대폰은 "이 사이트는 PC용이겠지" 하고 가상의 넓은 화면(약 980px)에 그린 뒤 작게 줄여서 보여 줘요. 그러면 글자가 깨알처럼 작아져요. 그래서 이 줄은 지우면 안 돼요.

### 미디어 쿼리와 모바일 우선

**[[미디어 쿼리]]**(media query)는 화면 조건에 따라 CSS 규칙을 켜고 끄는 문법이에요.

```css
@media (min-width: 768px) {
  h1 {
    font-size: 2.25rem;
  }
}
```

읽는 법은 "화면 폭이 768px **이상**일 때만 안의 규칙을 적용해요"예요. `min-width`는 "최소 폭"이라는 뜻이라서 이 폭 이상이면 켜져요. 단위 `px`를 꼭 써야 해요.

오늘의 작업 방식은 **[[모바일 우선]]**(mobile first)이에요. 좁은 휴대폰 화면용 CSS를 **기본**으로 먼저 쓰고, 화면이 넓어지면 `min-width` 미디어 쿼리로 **덧붙여요**. 좁은 화면에서 꼭 필요한 것부터 생각하게 되고, 휴대폰이 쓸데없는 규칙을 덜 읽어요.

```text
기본 규칙 (좁은 화면, 휴대폰)
  │
  ├─ 폭 768px 이상이면 → 덧붙임
  │   (메뉴 가로, 2열 배치)
  ▼
```

**[[브레이크포인트]]**(breakpoint)는 배치가 바뀌는 화면 폭의 기준점이에요. 이 사이트는 768px로 정했어요. 기기 이름(아이폰 몇 번)이 아니라 "내용이 어색해지기 시작하는 폭"을 보고 정해요. 창을 천천히 넓혀 보다가 "여기서부터는 2열이 어울리겠다" 싶은 곳이 브레이크포인트예요. 개발자 도구에서 코드를 멈추는 지점인 "중단점"과는 다른 말이에요.

**미디어 쿼리는 파일 맨 끝에 써요.** CSS는 같은 선택자·같은 속성이면 **나중에 쓴 규칙이 이겨요**(Day 9). 미디어 쿼리 안의 규칙이 앞의 기본 규칙을 덮어쓰려면 기본 규칙보다 뒤에 있어야 해요.

### 한국어 줄바꿈, 영상 비율, 메뉴 한 줄 차지하기

- `word-break: keep-all;`은 한국어가 단어 중간에서 줄이 바뀌지 않고 **띄어쓰기 자리에서만** 바뀌게 해요. 이 줄이 없으면 좁은 화면에서 "스트리|머예요"처럼 단어가 반으로 잘려요.
- `overflow-wrap: break-word;`는 `https://…`처럼 띄어쓰기 없이 아주 긴 영어 주소가 화면 밖으로 나갈 때만 강제로 줄을 바꿔요.
- `aspect-ratio: 16 / 9;`는 가로세로 비율을 16:9로 유지해요. 폭이 바뀌면 높이가 저절로 따라가요. YouTube 영상의 비율이 16:9라서 써요.
- `flex-basis: 100%;`는 Flexbox 자식이 한 줄을 **전부** 차지하게 해요. 어제 `flex-wrap: wrap;`인 머리글 안에서 `nav`가 한 줄을 다 차지하면, 로고 옆이 아니라 **아래 줄**로 내려가요.

:::info 실무에서는
회사에서는 `375px`, `768px`, `1024px`처럼 여러 브레이크포인트를 두기도 해요. 처음부터 많이 만들 필요는 없어요. 이 사이트처럼 하나(768px)로 시작하고, 어색한 곳이 보일 때 추가해요. 또 휴대폰에서 실제로 보는 것이 가장 정확해요. 내 PC의 `file://`이나 Live Preview 주소는 휴대폰이 열 수 없으니, 내일(Day 14) 인터넷에 올린 뒤에 내 휴대폰으로 확인해요.
:::

### 개발자 도구의 기기 모드

휴대폰이 없어도 PC에서 휴대폰 화면을 흉내 낼 수 있어요. 브라우저에서 연 페이지의 `F12` 개발자 도구에 **기기 모드**(Device Toolbar)가 있어요. `Ctrl + Shift + M`을 누르거나, 개발자 도구 왼쪽 위의 휴대폰·태블릿 모양 아이콘을 눌러 켜요. 폭을 숫자로 직접 입력해서 360px, 768px, 1280px로 바꿔 볼 수 있어요.

## 🛠️ 따라하기

모두 8단계예요. 개발자 도구를 쓰는 단계는 VS Code 안의 미리 보기 창이 아니라 **Edge나 Chrome에서 연 페이지**에서 해요. Live Preview 미리 보기 창 위쪽의 주소(`http://127.0.0.1:3000/…`, 숫자는 달라도 돼요)를 복사해서 Edge나 Chrome 주소창에 붙여 넣거나, 파일 탐색기에서 `index.html`을 더블클릭하면 돼요.

### 1단계 · 기기 모드로 지금 모습 보기 (8분)

바꾸기 전에 휴대폰 크기에서 무엇이 어색한지 눈으로 먼저 확인해요.

**어디서:** Edge 또는 Chrome에서 연 `index.html`

**무엇을:**

1. `F12`를 눌러 개발자 도구를 열어요(노트북은 `Fn + F12`일 수 있어요).
2. `Ctrl + Shift + M`을 눌러 기기 모드를 켜요. 안 되면 개발자 도구 왼쪽 위의 휴대폰·태블릿 모양 아이콘을 클릭해요.
3. 화면 위쪽에 `Dimensions`(크기) 자리가 보여요. `Responsive`(반응형)로 되어 있는지 확인하고, 폭 숫자 칸(처음엔 아무 숫자)을 클릭해 `360`을 입력한 뒤 `Enter`를 눌러요.
4. 홈 화면을 아래로 내려 보며 메뉴, 카드, 곰 그림, 아래의 대표 영상 칸을 봐요.

:::success
폭 360에서 화면이 좁은 세로 모양으로 바뀌어요. 지금 상태에서는 메뉴가 한두 줄의 가로 목록이고, 카드는 1장씩 세로로 쌓여요. 맨 아래 "대표 영상" 칸이 작고 납작한 상자로 보여요(기본 크기 300×150이라서 16:9가 아니에요). 오늘 이런 어색한 곳을 고쳐요. 기기 모드 모양은 브라우저 버전에 따라 조금 달라요.
:::

### 2단계 · 한국어 줄바꿈 규칙 넣기 (4분)

좁은 화면에서 단어가 반으로 잘리지 않게 해요.

**어디서:** VS Code, `C:\dev\my-creator-site\css\style.css`, `2. 기본 설정` 구역의 `body { … }` 규칙

**무엇을:**

1. `body { … }` 규칙을 찾아 아래 블록으로 바꿔요. `line-height: 1.7;` 아래에 두 줄(`word-break`, `overflow-wrap`)이 늘었어요.
2. `Ctrl + S`로 저장하고, 기기 모드 폭 360에서 홈의 소개 글을 봐요. 새로 고침(`F5`)을 한 번 눌러요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
body {
  margin: 0;
  background: #ffffff;
  color: #1d1b2e;
  font-family: system-ui, "Malgun Gothic", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
  line-height: 1.7;
  word-break: keep-all;     /* 한국어는 단어 중간에서 줄을 바꾸지 않아요 */
  overflow-wrap: break-word; /* 너무 긴 단어만 강제로 줄을 바꿔요 */
}
```

:::success
홈의 소개 문장 `게임, 토크, 음악을 넘나드는 …`이 여러 줄로 바뀔 때, 줄이 띄어쓰기 자리에서만 바뀌어요. 한 단어가 두 줄에 걸쳐 쪼개지지 않아요.
:::

### 3단계 · 영상 칸에 class 붙이기 (3분)

YouTube 영상 칸(`iframe`)에 CSS가 붙잡을 이름표를 달아요.

**어디서:** VS Code, `C:\dev\my-creator-site\index.html`, 맨 아래 "대표 영상" `<section>`

**무엇을:**

1. `<iframe src="https://www.youtube.com/embed/…` 줄을 찾아요.
2. `<iframe` 바로 뒤에 `class="video-frame"` 을 넣어요. 줄 전체는 아래와 같아요.
3. `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\index.html (일부)
```html
      <iframe class="video-frame" src="https://www.youtube.com/embed/aqz-KE-bpKQ" title="달빛곰 대표 영상 (예시 영상이에요)" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
```

영상 ID `aqz-KE-bpKQ`는 **예시**예요. 내 YouTube 영상 주소 `watch?v=` 뒤의 11글자로 바꾸면 내 영상이 나와요. 파일을 더블클릭(`file://`)으로 열면 YouTube 영상이 재생되지 않을 수 있어요. 그럴 때는 Live Preview로 열거나, 내일 배포한 주소에서 확인해요.

:::success
저장해도 화면은 아직 그대로예요. CSS를 쓰기 전이에요. 다음 단계에서 달라져요.
:::

### 4단계 · 영상 칸 CSS 쓰기 (5분)

폭 100%에 16:9 비율을 유지하고 모서리를 둥글게 해요.

**어디서:** VS Code, `C:\dev\my-creator-site\css\style.css`, `6. 페이지별` 구역 (`.hero-actions { … }` 규칙 아래, `/* 소개 페이지 */` 주석 위)

**무엇을:**

1. `.hero-actions { … }` 규칙이 끝나는 `}` 아래 한 줄을 비워요.
2. 아래 블록을 붙여 넣고 `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
/* 유튜브 영상: 가로 폭에 맞춰 16:9 비율을 유지해요 */
.video-frame {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 0;
  border-radius: 12px;
  background: #f4f2ff;
}
```

`display: block;`은 iframe 아래에 생기는 작은 틈을 없애요. `border: 0;`은 iframe의 기본 테두리를 없애요.

:::success
홈 맨 아래 대표 영상 칸이 본문 폭을 꽉 채우고 둥근 모서리의 가로로 긴 16:9 상자가 돼요. 기기 모드 폭을 360에서 1280까지 바꿔도 영상 칸이 같은 비율로 커지고 줄어요.
:::

### 5단계 · 좁은 화면의 메뉴 규칙 바꾸기 (6분)

모바일 우선이니까 **기본 규칙**(좁은 화면)을 먼저 정해요. 좁은 화면에서는 메뉴가 로고 아래 줄에 세로 목록으로 놓이게 해요.

**어디서:** VS Code, `C:\dev\my-creator-site\css\style.css`, `4. 헤더와 내비게이션` 구역의 `.site-nav`와 `.menu-list` 규칙

**무엇을:**

1. `.site-nav { margin-left: auto; }` 규칙을 아래 블록의 `.site-nav`로 바꿔요(`margin-left`를 지우고 `flex-basis`를 넣어요).
2. `.menu-list { … }` 규칙에서 `flex-wrap: wrap;` 줄을 지우고 `flex-direction: column;` 줄을 넣어요. 아래 블록 전체로 바꾸면 쉬워요.
3. `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
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
```

- `.site-nav`의 `flex-basis: 100%;`는 `nav`가 한 줄을 모두 차지하게 해서 로고 아래로 내려보내요.
- `.menu-list`의 `flex-direction: column;`은 어제 배운 **주축 방향 바꾸기**예요. 주축이 세로로 바뀌어서 `li`가 위에서 아래로 쌓여요.

:::success
기기 모드 폭 360(그리고 넓은 창 1280)에서 모두 메뉴가 로고 아래 줄에, 5개가 세로 목록으로 놓여요. 넓은 창에서도 지금은 세로예요. 다음 단계에서 넓은 화면용 규칙으로 가로로 되돌려요.
:::

### 6단계 · 넓은 화면용 미디어 쿼리 쓰기 (10분)

파일 맨 끝에 새 구역 `8. 반응형`을 만들어요. 768px 이상에서만 적용되는 규칙들이에요.

**어디서:** VS Code, `C:\dev\my-creator-site\css\style.css`, 파일 맨 아래

**무엇을:**

1. 파일의 맨 위 머리 주석을 아래처럼 한 줄 늘려요. `style.css - 달빛곰 방송국 전체 스타일 (모든 페이지가 함께 써요)` 줄 바로 아래에 `모바일 먼저 만들고, …` 줄을 넣어요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
/* ==========================================================
   style.css - 달빛곰 방송국 전체 스타일 (모든 페이지가 함께 써요)
   모바일 먼저 만들고, 화면이 넓어지면 @media로 덧붙여요 (Day 13)
   ========================================================== */
```

2. `Ctrl + End`를 눌러 파일 맨 끝으로 가요. 마지막 규칙(`.site-footer p { … }`)이 끝나는 `}` 아래에 빈 줄 하나를 넣어요.
3. 아래 블록을 붙여 넣고 `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
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

`@media (min-width: 768px) { … }`의 바깥 중괄호가 맨 끝에서 닫혀야 해요. 안쪽 규칙은 들여쓰기를 2칸 더 해서 안에 있다는 것을 보여 줘요.

:::success
기기 모드 폭 1280에서 메뉴가 오른쪽에 가로 한 줄로 늘어서고, 홈의 곰 그림이 왼쪽(200px), 글이 오른쪽에 놓여요(2열). 소개 페이지도 그림과 글이 2열이에요. `h1` 제목 글자도 조금 더 커져요. 폭을 360으로 바꾸면 메뉴는 세로 목록, 곰 그림은 위, 글은 아래로 돌아와요.
:::

### 7단계 · 세 가지 폭으로 점검하기 (10분)

360px, 768px, 1280px에서 다섯 페이지가 모두 괜찮은지 확인해요.

**어디서:** Edge 또는 Chrome에서 연 페이지의 개발자 도구 기기 모드

**무엇을:**

1. 기기 모드의 폭을 `360`으로 하고 `index.html`을 위에서 아래까지 천천히 내려 봐요. 메뉴, 카드, 곰, 영상, 바닥글을 확인해요.
2. 폭을 `768`로 바꿔 같은 것을 봐요. 폭을 `767`로 바꾸면 모바일 모양으로 돌아가는 것도 확인해요.
3. 폭을 `1280`으로 바꿔 봐요.
4. 메뉴로 영상·소개·방송 일정·문의 페이지도 열어 같은 방법으로 확인해요. 열 때마다 **가로 스크롤 막대**(화면 아래 가로 막대)가 없는지 봐요.

:::success
세 폭의 모습이 이렇게 보여요.

- 360px: 메뉴는 로고 아래 세로 5줄, 카드는 1장씩 3줄, 곰 그림 위·글 아래, 영상은 16:9, 가로 스크롤 없음.
- 768px: 메뉴는 오른쪽 가로 한 줄, 카드는 2장 + 1장, 곰 그림 200px + 글 2열, 영상은 16:9.
- 1280px: 메뉴는 오른쪽 가로 한 줄, 카드는 3장 한 줄, 곰 그림 200px + 글 2열.

가로 스크롤이 생기는 페이지가 있으면 아래 🧯 자주 막히는 곳의 "가로 스크롤이 생겨요"를 보세요.
:::

### 8단계 · 오늘 작업 커밋·푸시 (5분)

오늘 바뀐 파일을 Git에 기록하고(커밋) GitHub로 올려요(푸시). 매일 마지막에 하는 습관이에요. Day 7·8에서 한 것과 똑같아요.

**어디서:** VS Code, `C:\dev\my-creator-site` 폴더가 열린 창. 왼쪽 세로 막대의 가지 모양 아이콘(**소스 제어**, `Ctrl + Shift + G`)

**무엇을 (방법 A, 소스 제어 패널):**

1. 위쪽 **메시지** 칸을 클릭하고 `Day 13: 반응형 웹 (768px 미디어 쿼리)`를 입력해요.
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
git commit -m "Day 13: 반응형 웹 (768px 미디어 쿼리)"
```

예상 출력(`a1b2c3d` 같은 해시와 숫자는 달라도 돼요):

```text
[main a1b2c3d] Day 13: 반응형 웹 (768px 미디어 쿼리)
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
브라우저에서 `https://github.com/<내 아이디>/my-creator-site`를 열고 새로 고침(`F5`)하면, 파일 목록 위에 방금 쓴 커밋 메시지 `Day 13: 반응형 웹 (768px 미디어 쿼리)`가 보여요. VS Code 소스 제어 패널의 변경 목록은 비어 있어요.
:::

## ✍️ 과제

### 과제 1 · 세 폭 점검표 (쉬움 ⭐, 6분)

360·768·1280 폭에서 아래 세 가지를 표로 정리해요. 7단계에서 본 것을 적으면 돼요.

- 메뉴: 세로인가 가로인가
- 홈 카드: 한 줄에 몇 장인가(또는 몇 줄인가)
- 홈 소개 영역(hero): 쌓임인가 2열인가

힌트: 숫자가 헷갈리면 개발자 도구의 `grid` 배지를 켜 봐요(Day 12).

### 과제 2 · 브레이크포인트 실험 (보통 ⭐⭐, 8분)

768px을 1000px로 바꾸면 어떻게 되는지 확인해요.

- `style.css`의 `@media (min-width: 768px)`를 `@media (min-width: 1000px)`로 바꾸고 저장해요.
- 기기 모드 폭을 900으로 하고 메뉴, 홈 소개 영역, `h1` 크기를 관찰해요.
- 확인이 끝나면 `768px`로 되돌려요.

힌트: 폭을 900 → 1000 → 1100으로 바꿔 가며 바뀌는 순간을 찾아봐요.

### 과제 3 · 미디어 쿼리를 맨 위로 옮기면? (도전 ⭐⭐⭐, 7분)

`8. 반응형` 구역 전체를 잘라서 파일 맨 위(머리 주석 아래)로 옮기고, 1280 폭에서 어떻게 되는지 봐요.

- `@media (min-width: 768px) { … }` 블록 전체를 선택해 잘라내기(`Ctrl + X`)하고, 머리 주석 바로 아래에 붙여 넣어요(`Ctrl + V`).
- 1280 폭에서 `h1` 크기, 메뉴 방향, 곰 그림 크기가 어떻게 되는지 관찰해요.
- 왜 그런지 적어요. 확인이 끝나면 블록을 다시 파일 맨 끝으로 옮겨요(`Ctrl + Z`로 되돌려도 돼요).

힌트: "같은 선택자, 같은 속성이면 **나중에 쓴 규칙**이 이겨요"(Day 9)를 떠올려요.

## ✅ 정답

:::answer 과제 1 정답 · 세 폭 점검표
| 폭 | 메뉴 | 홈 카드 | 홈 소개 영역 |
|---|---|---|---|
| 360px | 세로 | 1칸 (3줄) | 쌓임 |
| 768px | 가로 | 2칸 (2장 + 1장) | 2열 |
| 1280px | 가로 | 3칸 (한 줄) | 2열 |

**왜 이렇게 하나요?** 메뉴와 소개 영역은 768px 미디어 쿼리가 바꾸고, 카드 칸 수는 `repeat(auto-fit, minmax(240px, 1fr))`가 화면 폭에 따라 바꿔요. 768px 화면의 본문은 좌우 여백을 빼고 736px 정도라서 240px 카드가 3장(간격 포함 752px) 들어가지 못하고 2장이 돼요.
:::

:::answer 과제 2 정답 · 브레이크포인트 실험
폭 900에서도 **모바일 모양**이에요. 메뉴는 로고 아래 세로 목록, 홈 소개 영역은 곰 그림 위·글 아래, `h1`은 작은 크기(28px)예요. 폭을 1000 이상으로 늘리면 그제야 가로 메뉴와 2열이 돼요.

**왜 이렇게 하나요?** `min-width: 1000px`는 "폭 1000px 이상"일 때만 켜져요. 브레이크포인트 숫자를 바꾸면 배치가 바뀌는 지점이 그만큼 옮겨 가요. 숫자는 "내용이 어색해지기 시작하는 폭"으로 정해요. 이 사이트의 메뉴와 2열은 768px쯤이 자연스러워서 `768px`로 되돌려요.
:::

:::answer 과제 3 정답 · 미디어 쿼리를 맨 위로 옮기면?
1280 폭에서도 `h1`이 작은 글자(28px)로 남고, 메뉴는 로고 아래 세로 목록으로 남고, 곰 그림은 160px이에요. 미디어 쿼리 안의 규칙이 대부분 **무시된 것처럼** 보여요. 다만 2열 배치(`grid-template-columns: 200px 1fr`)는 뒤에 같은 속성이 없어서 그대로 적용돼요.

**왜 이렇게 하나요?** 같은 선택자(예: `h1`)에 같은 속성(`font-size`)이 두 번 나오면 **파일에서 나중에 있는 규칙**이 이겨요. 미디어 쿼리를 맨 위에 두면, 아래에 있는 기본 규칙(`h1 { font-size: 1.75rem; }` 등)이 나중에 와서 덮어써요. 그래서 넓은 화면용 규칙은 항상 파일 맨 끝에 써요. 확인이 끝나면 블록을 맨 끝으로 되돌려요.
:::

:::answer 오늘 끝 상태 전체 코드
막혔다면 아래 코드로 맞추고 [Day 14](#/day/p1-d14)를 시작하세요. 바뀐 파일은 `css/style.css`와 `index.html`이에요. `style.css`는 200줄이 넘어서 바뀐 블록만 위치와 함께 실었어요. `index.html`은 파일 전체를 실었어요.

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

`style.css`는 바뀐 곳이 6군데예요.

1. 파일 맨 위 머리 주석: `style.css - …` 줄 아래에 `모바일 먼저 …` 줄을 넣어요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
/* ==========================================================
   style.css - 달빛곰 방송국 전체 스타일 (모든 페이지가 함께 써요)
   모바일 먼저 만들고, 화면이 넓어지면 @media로 덧붙여요 (Day 13)
   ========================================================== */
```

2. `2. 기본 설정`의 `body { … }` 규칙 전체를 바꿔요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
body {
  margin: 0;
  background: #ffffff;
  color: #1d1b2e;
  font-family: system-ui, "Malgun Gothic", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
  line-height: 1.7;
  word-break: keep-all;     /* 한국어는 단어 중간에서 줄을 바꾸지 않아요 */
  overflow-wrap: break-word; /* 너무 긴 단어만 강제로 줄을 바꿔요 */
}
```

3. `4. 헤더와 내비게이션`의 `.site-nav { … }`와 `.menu-list { … }` 규칙 두 개를 바꿔요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
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
```

4. `6. 페이지별`의 `.hero-actions { … }` 규칙 아래, `/* 소개 페이지 */` 주석 **위**에 영상 규칙을 넣어요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
/* 유튜브 영상: 가로 폭에 맞춰 16:9 비율을 유지해요 */
.video-frame {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 0;
  border-radius: 12px;
  background: #f4f2ff;
}
```

5. 파일 맨 끝(`.site-footer p { … }` 아래)에 새 구역을 넣어요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
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
:::

## 🧯 자주 막히는 곳

여기에 없는 증상은 [문제 해결 모음](#/page/troubleshooting)에서 찾아보세요.

### 미디어 쿼리가 안 먹어요

**원인:** 흔한 이유는 네 가지예요. ① `@media (min-width: 768px) {`의 괄호나 중괄호 짝이 맞지 않아요. ② `min-width: 768`처럼 단위 `px`가 빠졌어요. ③ 미디어 쿼리 아래에 같은 선택자의 규칙이 또 있어서 덮어써요. ④ 미디어 쿼리가 파일 맨 끝이 아니에요.

**해결:**

1. `style.css`에서 `@media`로 시작하는 줄을 6단계의 블록과 글자 하나씩 비교해요. 괄호 `( )`와 중괄호 `{ }`는 모두 짝이 맞아야 해요.
2. 숫자 뒤에 `px`가 있는지 확인해요(`768px`).
3. 미디어 쿼리 블록이 파일 맨 아래에 있는지, 그 아래에 같은 규칙이 또 없는지 확인해요.
4. 저장하고 `Ctrl + F5`로 새로 고침해서 모양이 바뀌면 해결이에요.

### 기기 모드를 켰는데 모양이 그대로예요

**원인:** CSS를 고친 뒤 기기 모드 화면을 새로 고치지 않았거나, 기기 모드의 폭이 768 이상이에요. 또 같은 단축키(`Ctrl + Shift + M`)를 한 번 더 누르면 기기 모드가 꺼져요.

**해결:**

1. 개발자 도구 위쪽의 폭 숫자를 확인해요(360이면 모바일, 768 이상이면 넓은 모양).
2. `F5`로 새로 고치고, 그래도 그대로면 `Ctrl + F5`로 캐시를 무시하고 새로 고쳐요(Day 9).
3. 기기 모드가 꺼졌으면 왼쪽 위 휴대폰·태블릿 아이콘을 다시 눌러 켜요.

### 가로 스크롤이 생겨요 (화면 옆으로 밀려요)

**원인:** 어떤 요소가 화면 폭보다 넓어서 오른쪽으로 삐져나와요. 흔한 원인은 폭이 고정된 요소(`width: 500px` 같은 값), 띄어쓰기 없이 아주 긴 글자, 그리고 `minmax`의 최소 폭이 화면보다 큰 경우예요.

**해결:**

1. 기기 모드 폭 360에서 화면을 오른쪽으로 밀어 어떤 부분이 삐져나오는지 봐요.
2. 개발자 도구 Elements에서 의심되는 요소 위에 마우스를 올리면, 그 요소의 영역이 화면에 파랗게 표시돼요. 화면 밖까지 나간 요소를 찾아요.
3. 고정 폭이 있으면 `max-width: 100%;`로 바꾸거나 지워요. 긴 글자가 문제라면 `overflow-wrap: break-word;`가 `body`에 있는지 확인해요.
4. 가로 스크롤 막대가 사라지면 해결이에요.

### 창 폭 숫자가 생각과 달라요 (Windows 디스플레이 배율)

**원인:** Windows **설정 → 시스템 → 디스플레이**의 배율이 125%나 150%이면, 브라우저가 보는 CSS 폭은 실제 화면 픽셀 수보다 작아요. 모니터가 1920픽셀이어도 배율 150%면 CSS 폭은 1280px쯤이에요. 메뉴 이름은 Windows 버전에 따라 조금 다를 수 있어요.

**해결:**

1. 폭을 판단할 때는 모니터 해상도가 아니라 **기기 모드에서 입력한 숫자**(또는 개발자 도구에 표시되는 폭)를 기준으로 해요.
2. 기기 모드에서 360·768·1280을 직접 입력해서 확인하면 배율과 상관없이 같은 결과를 볼 수 있어요.

### 영상 칸이 작고 납작해요 (16:9가 아니에요)

**원인:** `iframe`에 `class="video-frame"`이 없거나, CSS 규칙의 이름이 `.video-frame`이 아니에요. 그러면 iframe의 기본 크기(300×150)가 그대로 나와요.

**해결:**

1. `index.html`의 `<iframe` 뒤에 `class="video-frame"`이 있는지 확인해요(하이픈 `-`, 소문자).
2. `style.css`에 `.video-frame { … }` 규칙이 있고 `aspect-ratio: 16 / 9;` 줄에 빈칸이 슬래시 양쪽에 있는지 확인해요.
3. 저장하고 새로 고침해서 영상 칸이 가로로 긴 상자가 되면 해결이에요.

### 좁은 화면에서 메뉴 세로 목록이 길어서 불편해요

**원인:** 오늘은 좁은 화면에서도 메뉴 5개가 항상 펼쳐져 있어요. 정상이에요.

**해결:** Day 21에서 JavaScript로 `☰ 메뉴` 버튼을 만들어 평소에는 접어 두고 누르면 펼치게 바꿔요. 지금은 그대로 두세요.

## 📝 오늘의 체크리스트

- [ ] `<meta name="viewport" …>` 줄이 하는 일을 내 말로 설명할 수 있어요.
- [ ] 기기 모드 폭 360에서 메뉴가 로고 아래 세로 목록, 카드가 1칸, 곰 그림이 위·글이 아래로 보여요.
- [ ] 폭 768 이상에서 메뉴가 오른쪽 가로 한 줄, 홈 소개와 소개 페이지가 2열로 보여요.
- [ ] 폭 767과 768에서 모양이 바뀌는 것을 직접 봤어요.
- [ ] 대표 영상 칸이 어느 폭에서도 16:9 비율이에요.
- [ ] 다섯 페이지 어디에도 가로 스크롤 막대가 없어요.
- [ ] 과제 1~3을 풀고 정답과 비교했어요.
- [ ] GitHub 저장소에 `Day 13: 반응형 웹 (768px 미디어 쿼리)` 커밋이 보여요.

## 📚 더 알아보기

- [MDN · 미디어 쿼리 사용하기](https://developer.mozilla.org/ko/docs/Web/CSS/CSS_media_queries/Using_media_queries): 화면 조건을 검사하는 문법과 예제를 보여 줘요.
- [MDN · 뷰포트 메타 태그](https://developer.mozilla.org/ko/docs/Web/HTML/Guides/Viewport_meta_element): viewport 줄이 하는 일을 설명해요.
- [Microsoft Edge DevTools · 기기 모드로 휴대폰 흉내 내기](https://learn.microsoft.com/ko-kr/microsoft-edge/devtools/device-mode/): Edge 개발자 도구의 기기 모드 사용법을 설명해요.

➡️ **다음 Day 예고:** [Day 14 · 꾸미기 + 첫 배포](#/day/p1-d14)에서는 색을 CSS 변수로 한곳에서 관리하고, 마우스를 올리면 움직이는 효과를 넣은 뒤, 내 사이트를 GitHub Pages로 인터넷에 처음 공개해요.
