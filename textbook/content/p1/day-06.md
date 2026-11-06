## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- `header`, `nav`, `main`, `section`, `article`, `footer`로 페이지를 뜻에 맞게 나눌 수 있어요.
- `div`와 `span`을 언제 쓰는지, 블록 요소와 인라인 요소의 차이를 설명할 수 있어요.
- 로고 그림을 넣고, 바닥글에 `&copy;` 같은 문자 참조를 쓸 수 있어요.
- 브라우저의 개발자 도구를 열어 Elements 패널로 페이지의 구조를 볼 수 있어요.

**예상 시간: 90분** (개념 이해 15분 · 따라하기 45분 · 과제 25분 · 정리 5분)

:::path 📂 시작 상태
어제(Day 5)까지 만든 파일이 이렇게 있어야 해요. 없거나 다르면 [Day 5](#/day/p1-d05)의 "오늘 끝 상태 전체 코드"로 맞춰 주세요.

- `C:\dev\my-creator-site\index.html`, `about.html`, `contents.html`, `schedule.html`, `contact.html`
- `C:\dev\my-creator-site\images\profile.svg`
- `C:\dev\hello\hello.html`, `favorites.html`, `tools.html`, `links.html`, `pages\back.html`
- 파일 탐색기 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
- VS Code(한국어 팩, Live Preview 확장 프로그램)와 Chrome이 설치되어 있어요.
- VS Code에서 `C:\dev\my-creator-site` 폴더가 열려 있어요.
:::

## 📖 개념 이해

### 시맨틱 HTML: 이름표가 붙은 상자들

**비유부터 볼게요.** 이삿짐을 쌀 때 상자에 "주방", "책", "옷"이라고 이름을 써 두면 푸는 사람이 어디에 무엇이 있는지 바로 알아요. 이름 없는 상자는 열어 봐야 알죠. 웹페이지도 영역마다 뜻에 맞는 이름의 태그를 쓰면, 사람과 프로그램이 구조를 한눈에 알아봐요.

**정확한 정의는 이래요.** **[[시맨틱 HTML]]**(semantic HTML)은 모양이 아니라 뜻에 맞는 요소로 페이지를 짜는 방식이에요. 스크린 리더, 검색 엔진, 나중에 배울 CSS가 구조를 알아보는 데 쓰여요.

- `header`: 머리글. 페이지 맨 위의 로고·메뉴 영역이에요.
- `nav`: 메뉴처럼 다른 페이지로 가는 링크 모음이에요.
- `main`: 이 페이지만의 핵심 내용이에요. 페이지에 하나만 써요.
- `section`: 제목이 있는 한 구역이에요.
- `article`: 혼자서도 뜻이 통하는 덩어리예요. 오늘은 방송 소개 카드 하나하나에 써요.
- `footer`: 바닥글. 저작권 같은 맨 아래 영역이에요.

### `div`와 `span`: 이름 없는 상자

알맞은 시맨틱 태그가 없을 때 쓰는 이름 없는 상자가 있어요.

- `div`: 여러 요소를 묶는 상자예요.
- `span`: 글자 일부를 묶는 상자예요.

둘은 화면에서 자리를 차지하는 방식이 달라요.

- **[[블록 요소]]**(block element)는 화면에서 한 줄을 통째로 차지하고 다음 요소를 아래 줄로 밀어내는 요소예요. `h1`, `p`, `div`, `section`, `ul`이 블록 요소예요.
- **[[인라인 요소]]**(inline element)는 글자 흐름 안에 끼어서 필요한 만큼만 자리를 차지하는 요소예요. `a`, `strong`, `em`, `span`, `img`가 인라인 요소라서 앞뒤 글자와 같은 줄에 놓여요.

그래서 `div`는 블록이고 `span`은 인라인이에요. 시맨틱 태그가 맞으면 먼저 그것을 쓰고, 맞는 게 없을 때만 `div`나 `span`을 써요.

### 장식 그림은 `alt=""`

로고 옆에는 이미 "달빛곰 방송국"이라는 글자가 있어요. 로고 그림에도 같은 설명을 달면 스크린 리더가 같은 말을 두 번 읽어요. 이럴 땐 그림이 장식이라는 뜻으로 `alt=""`(빈 값)로 써요. `alt` 속성 자체를 아예 빼는 것과는 달라요. 빈 `alt`는 "읽지 말고 지나가세요"라는 뜻이에요.

### 문자 참조: 특별한 글자 쓰는 법

**[[문자 참조]]**(character reference)는 HTML에서 특별한 글자를 `&이름;` 모양으로 적는 방법이에요.

| 쓰는 모양 | 화면에 보이는 글자 |
|---|---|
| `&copy;` | © |
| `&lt;` | < |
| `&gt;` | > |
| `&amp;` | & |

`<`를 그냥 쓰면 브라우저가 태그의 시작으로 오해해요. 그래서 꺾쇠를 화면에 글자로 보이고 싶을 때 `&lt;`와 `&gt;`를 써요. 맨 끝의 `;`를 빠뜨리지 않아요.

### 개발자 도구: 웹페이지의 엑스레이

**[[개발자 도구]]**(DevTools)는 브라우저에 들어 있는, 웹페이지의 속을 들여다보고 실험하는 도구예요. `F12`(또는 `Ctrl + Shift + I`)로 열어요. 오늘은 **Elements** 패널을 써요. HTML 구조가 접고 펼 수 있는 나무 모양으로 보여요. 여기서 고친 내용은 화면에만 잠깐 적용되고 내 파일은 바뀌지 않아요.

:::warn 개발자 도구는 Edge나 Chrome에서 열어요
VS Code 안의 Live Preview 미리 보기 창은 Edge나 Chrome이 아니라서 `F12`를 눌러도 개발자 도구가 열리지 않아요. 개발자 도구가 필요할 때는 이 둘 중 하나로 열어요.

- 파일 탐색기에서 HTML 파일을 더블클릭해서 브라우저로 열어요. (가장 쉬워요.)
- 미리 보기 창 위쪽의 주소 칸(`http://127.0.0.1:3000/…`)의 글자를 복사해서 Edge 주소 표시줄에 붙여 넣고 `Enter`를 눌러요. 주소 끝 숫자는 달라도 돼요. 명령 팔레트에 Live Preview를 외부 브라우저로 여는 `External Browser` 계열 명령도 있어요(이름은 버전에 따라 조금 다를 수 있어요).
:::

## 🛠️ 따라하기

모두 6단계예요.

### 1단계 · `logo.svg` 만들기 (5분)

**어디서:** VS Code 탐색기의 `images` 폴더

**무엇을:**

1. `images` 줄을 오른쪽 클릭하고 **새 파일**을 클릭해요.
2. `logo.svg`를 입력하고 `Enter`를 눌러요.
3. 아래 코드를 붙여 넣고 `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\images\logo.svg
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="14" fill="#5b4bdb"/>
  <!-- 초승달: 노란 원 위에 배경색 원을 겹쳐서 만들어요 -->
  <circle cx="30" cy="34" r="18" fill="#ffd66b"/>
  <circle cx="40" cy="27" r="16" fill="#5b4bdb"/>
</svg>
```
:::success
탐색기의 `images` 폴더 안에 `logo.svg`와 `profile.svg`가 있어요. 초승달 모양은 노란 원 위에 배경색 원을 겹쳐서 만든 거예요. 그림으로 보는 건 2단계에서 해요.
:::

### 2단계 · `index.html`을 시맨틱 구조로 바꾸기 (12분)

기존의 메뉴 목록과 본문을 `header`, `main`, `footer`로 나눠 감싸요. 파일 전체를 아래 코드로 바꾸는 게 가장 안전해요. 닉네임과 소개 문장은 내 것으로 바꿔도 되지만, 태그는 그대로 써요.

**어디서:** VS Code `index.html` 편집기

**무엇을:**

1. `Ctrl + A`로 전체를 선택해요.
2. 아래 코드를 복사해서 붙여 넣어요. 직접 고치고 싶다면 코드를 읽으면서 `header`, `main`, `footer`를 하나씩 만들어도 돼요.
3. `Ctrl + S`로 저장하고 미리 보기를 확인해요.

📄 C:\dev\my-creator-site\index.html
```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>달빛곰 방송국</title>
</head>
<body>
  <header>
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
  </main>

  <footer>
    <p>&copy; 2026 달빛곰 방송국 · 연습용으로 만든 사이트예요.</p>
  </footer>
</body>
</html>
```
달라진 점을 짚어 봐요.

- `<header>` 안에 로고 링크와 `<nav>`가 있고, `nav` 안에 어제의 메뉴 `ul`이 들어갔어요.
- 로고는 `<a href="index.html">`이라서 누르면 홈으로 가요. 안의 `img`는 `alt=""`(장식)이고, 옆의 `span`이 사이트 이름이에요.
- `<main>` 안에 `section`이 둘이에요. 첫 `section`은 곰 그림과 `div`(제목, 소개)이고, 둘째 `section`은 "이런 방송을 해요"와 `article` 세 장이에요.
- 어제 있던 주석 `<!-- 홈 페이지: 인사와 방송 소개 -->`는 지웠어요.
- `<footer>`의 `&copy;`가 ©로 보여요.

:::success
미리 보기 맨 위에 초승달 로고와 "달빛곰 방송국" 글자가 보이고, 그 아래에 메뉴 링크 5개가 점 목록으로 세로 5줄 나열돼요. 아직 CSS가 없어서 가로로 놓이지 않는 게 정상이에요. 그 아래 곰 그림과 인사말, "이런 방송을 해요" 세 가지가 이어지고, 맨 아래에 `© 2026 달빛곰 방송국 · 연습용으로 만든 사이트예요.`가 보여요. 화면이 어제와 거의 같고 로고와 바닥글만 늘었어요.
:::

### 3단계 · `about.html`도 같은 구조로 바꾸기 (8분)

**어디서:** VS Code `about.html` 편집기

**무엇을:** 2단계와 같은 방법으로 `Ctrl + A` 후 붙여 넣고 저장해요. 머리글(`header`)과 바닥글(`footer`)은 `index.html`과 똑같고, `main` 안만 달라요.

📄 C:\dev\my-creator-site\about.html
```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>소개 - 달빛곰 방송국</title>
</head>
<body>
  <header>
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

  <footer>
    <p>&copy; 2026 달빛곰 방송국 · 연습용으로 만든 사이트예요.</p>
  </footer>
</body>
</html>
```
:::success
소개 페이지에도 같은 로고, 메뉴, 바닥글이 보여요. 본문은 "달빛곰을 소개해요" 제목, 곰 그림과 소개 두 문단, "어떤 방송을 하나요?" 목록, "방송 규칙" 번호 목록, "함께해요" 문단이에요.
:::

### 4단계 · 브라우저에서 열고 개발자 도구 켜기 (8분)

**어디서:** 파일 탐색기 → `C:\dev\my-creator-site`

**무엇을:**

1. `index.html`을 더블클릭해서 브라우저(Edge 또는 Chrome)로 열어요.
2. 키보드 `F12`를 눌러요. 노트북은 `Fn + F12`일 수 있어요. `Ctrl + Shift + I`를 눌러도 되고, 페이지의 빈 곳을 오른쪽 클릭해서 **검사**를 눌러도 돼요.
3. 개발자 도구가 화면 오른쪽이나 아래에 열려요. 위쪽 탭에서 **Elements**를 클릭해요(한국어 화면은 **요소**일 수 있어요). 메뉴 이름은 브라우저 버전에 따라 조금 달라요.

:::success
화면 한쪽에 개발자 도구가 열리고, 아래쪽 목록에 `<!doctype html>`로 시작하는 HTML 코드가 나무 모양으로 보여요(`<!DOCTYPE html>`처럼 대문자로 보여도 같은 뜻이에요). `<html lang="ko">`, `<head>`, `<body>`가 줄마다 접고 펼 수 있는 삼각형(▶/▼)과 함께 보여요. 안 열리면 아래 🧯 자주 막히는 곳의 "F12를 눌러도 개발자 도구가 안 열려요"를 보세요.
:::

### 5단계 · Elements 패널 탐험하기 (8분)

**어디서:** 브라우저의 개발자 도구 Elements 패널

**무엇을:**

1. `<body>`가 접혀 있으면(▶) 앞의 삼각형을 클릭해서 펼쳐요. 이미 펼쳐져(▼) 있으면 그대로 둬요. 안에 `<header>`, `<main>`, `<footer>`가 보여요.
2. `<header>`, `<main>`, `<footer>` 앞의 삼각형을 하나씩 클릭해서 접어요.
3. 개발자 도구 맨 왼쪽 위의 **요소 선택 도구**(네모 안에 화살표 모양)를 클릭하고, 페이지의 "이런 방송을 해요" 제목 위에 마우스를 올려요. 올릴 때마다 화면에 영역이 색으로 표시돼요.
4. 제목을 클릭해요. Elements 패널에서 해당 `<h2>` 줄이 파란 막대로 선택돼요.
5. 선택된 `<h2>` 줄의 글자 "이런 방송을 해요"를 더블클릭해서 `내가 바꾼 제목`으로 고치고 `Enter`를 눌러요.
6. 브라우저 화면의 제목이 바뀐 것을 보고, `F5`로 새로 고침해요.

:::success
2번에서 접으면 `header`, `main`, `footer` 세 줄만 남아요. 3번에서 마우스를 올린 영역이 색으로 표시돼요. 5번에서 화면 제목이 `내가 바꾼 제목`으로 바뀌고, 6번에서 새로 고침하면 원래 "이런 방송을 해요"로 돌아와요. 개발자 도구에서 고친 건 화면에만 적용되고 내 파일은 바뀌지 않아요.
:::

### 6단계 · 문자 참조 실험 (4분)

**어디서:** VS Code `index.html` 편집기

**무엇을:**

1. 맨 아래 `footer`의 `<p>` 줄 끝, `</p>` 바로 앞에 ` &lt;b&gt;`를 추가해요.
2. 저장하고 브라우저에서 `F5`로 새로 고침해요.
3. 확인한 뒤 ` &lt;b&gt;`를 지우고 다시 저장해요.

:::success
화면 맨 아래에 `<b>`라는 글자가 그대로 보여요. 태그로 읽히지 않고 글자로 보인다는 뜻이에요. 지운 뒤에는 코드가 위 2단계의 모양과 같아져요.
:::

## ✍️ 과제

### 과제 1 · 나머지 세 페이지를 같은 뼈대로 (보통 ⭐⭐, 12분)

`contents.html`, `schedule.html`, `contact.html`을 `index.html`과 같은 `header` → `main` → `footer` 뼈대로 바꿔 보세요.

- `header`와 `footer`는 `index.html`과 똑같이 써요(복사해서 붙여 넣어도 돼요).
- `main` 안에는 어제와 같은 `h1`과 `p`만 넣어요.
- 저장한 뒤 메뉴 링크로 다섯 페이지를 오가며 모두 같은 머리글과 바닥글이 보이는지 확인해요.

### 과제 2 · Elements 퀴즈 (쉬움 ⭐, 5분)

브라우저에서 `about.html`을 열고 Elements 패널을 보면서 답해 보세요.

- 소개 페이지의 번호 목록 `ol`은 어느 요소 안에 있나요? (바깥쪽부터 차례로)
- 로고 글자 `span`의 부모(바로 바깥 요소)는 무엇이고, 그 위는요?

### 과제 3 · `div`와 `section` 고르기 (도전 ⭐⭐⭐, 8분)

다음 네 가지 상황에 `section`, `div`, `span`, `nav` 중 무엇을 쓰면 좋은지 고르고 이유를 한 줄씩 적어 보세요.

1. 제목이 있는 한 구역(예: "방송 규칙")
2. 그림과 글을 한 덩어리로 묶기만 하고 싶을 때
3. 글자 중 일부 단어만 따로 묶을 때
4. 다른 페이지로 가는 메뉴

## ✅ 정답

:::answer 과제 1 정답 · 나머지 세 페이지
📄 C:\dev\my-creator-site\contents.html
```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>영상 모아보기 - 달빛곰 방송국</title>
</head>
<body>
  <header>
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

  <footer>
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
</head>
<body>
  <header>
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
    <p>매주 방송하는 요일과 시간을 알려 드려요.</p>
  </main>

  <footer>
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
</head>
<body>
  <header>
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
    <p>협업 제안이나 궁금한 점을 남겨 주세요.</p>
  </main>

  <footer>
    <p>&copy; 2026 달빛곰 방송국 · 연습용으로 만든 사이트예요.</p>
  </footer>
</body>
</html>
```
**왜 이렇게 하나요?** 다섯 페이지의 머리글, 메뉴, 바닥글이 같으면 방문자가 어느 페이지에서든 같은 방식으로 이동할 수 있어요. `main`은 페이지마다 달라지는 부분이라서 이 안만 달라요. `main`이 한 페이지에 하나만 있는 것도 지켜야 해요.
:::

:::answer 과제 2 정답 · Elements 퀴즈
- `ol`은 `body` > `main` > `section` > `ol`이에요. 바로 바깥은 "방송 규칙" 구역의 `section`, 그 바깥은 `main`이에요.
- 로고 글자 `span`의 부모는 `a`(로고 링크)이고, 그 위는 `header`예요.

**왜 이렇게 하나요?** Elements 패널에서 들여쓰기가 한 칸 안쪽일수록 부모 요소의 안에 들어 있다는 뜻이에요. 구조를 나누어 놓으면 이렇게 부모–자식 관계가 보여요.
:::

:::answer 과제 3 정답 · div와 section 고르기
1. `section`: 제목이 있는 구역은 `section`이에요.
2. `div`: 뜻은 없고 묶기만 하는 상자라서 `div`예요.
3. `span`: 글자 일부만 묶는 인라인 상자라서 `span`이에요.
4. `nav`: 다른 페이지로 가는 메뉴는 `nav`예요.

**왜 이렇게 하나요?** 뜻에 맞는 태그가 있으면 먼저 쓰고, 없을 때만 `div`와 `span`을 써요.
:::

:::answer 오늘 끝 상태 전체 코드
오늘 따라하기와 과제를 모두 끝내면 아래 상태가 돼요. 막혔다면 이 폴더와 파일을 그대로 만들고 코드를 붙여 넣어 저장하세요. 그러면 Day 7을 바로 시작할 수 있어요.

```text
C:\dev\my-creator-site\
├─ index.html
├─ about.html
├─ contents.html
├─ schedule.html
├─ contact.html
└─ images\
   ├─ profile.svg
   └─ logo.svg
```

오늘 새로 만든 파일은 `images\logo.svg`이고, 다섯 HTML 파일은 모두 `header`, `main`, `footer` 구조로 바뀌었어요.

📄 C:\dev\my-creator-site\images\logo.svg
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
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
  <title>달빛곰 방송국</title>
</head>
<body>
  <header>
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
  </main>

  <footer>
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
</head>
<body>
  <header>
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

  <footer>
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
</head>
<body>
  <header>
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

  <footer>
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
</head>
<body>
  <header>
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
    <p>매주 방송하는 요일과 시간을 알려 드려요.</p>
  </main>

  <footer>
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
</head>
<body>
  <header>
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
    <p>협업 제안이나 궁금한 점을 남겨 주세요.</p>
  </main>

  <footer>
    <p>&copy; 2026 달빛곰 방송국 · 연습용으로 만든 사이트예요.</p>
  </footer>
</body>
</html>
```
연습 폴더 `C:\dev\hello`는 어제와 같아요.
:::

## 🧯 자주 막히는 곳

모든 문제와 드문 경우는 [문제 해결 모음](#/page/troubleshooting)에 있어요.

### F12를 눌러도 개발자 도구가 안 열려요

**원인:** 이유는 세 가지예요. ① 노트북은 `F12`가 다른 기능(음량 등)에 먼저 배정되어 있어요. ② 열린 곳이 VS Code의 미리 보기 창이에요. 이 창은 브라우저가 아니라서 개발자 도구가 없어요. ③ 브라우저 창이 아니라 다른 앱이 앞에 있어요. Edge는 처음 `F12`를 누를 때 개발자 도구를 열 것인지 묻는 창이 뜰 수 있어요(문구는 버전에 따라 달라요).

**해결:**

1. 브라우저(Edge 또는 Chrome) 창을 클릭해서 앞으로 가져와요. VS Code 안이 아니라 `index.html`을 더블클릭해서 연 브라우저 탭이어야 해요.
2. `Fn + F12`를 눌러 봐요. 또는 `Ctrl + Shift + I`를 눌러요.
3. 그래도 안 되면 페이지의 빈 곳을 오른쪽 클릭하고 **검사**를 클릭해요.
4. 개발자 도구가 열려 Elements 목록이 보이면 해결된 거예요.

### Live Preview 미리 보기 창에서 F12가 안 돼요

**원인:** VS Code 안의 미리 보기 창은 Edge나 Chrome이 아니라서 브라우저의 개발자 도구가 없어요. 이상한 게 아니라 원래 그래요.

**해결:**

1. 미리 보기 창 위쪽 주소 칸을 클릭해서 `http://127.0.0.1:3000/index.html` 같은 주소를 전부 선택하고 `Ctrl + C`로 복사해요. 숫자는 달라도 돼요.
2. Edge를 열고 주소 표시줄에 `Ctrl + V`로 붙여 넣은 뒤 `Enter`를 눌러요.
3. 그 브라우저 탭에서 `F12`를 눌러요.
4. 개발자 도구가 열리면 해결된 거예요. 더 간단히는 파일 탐색기에서 `index.html`을 더블클릭해서 열어도 돼요.

### 붙여 넣었더니 구조가 꼬이고 메뉴나 글이 이상한 곳에 나와요

**원인:** 붙여 넣다가 닫는 태그(`</header>`, `</section>`, `</main>` 등)를 빠뜨렸거나 두 번 붙여 넣었을 수 있어요. 브라우저는 닫는 태그가 없으면 아래 내용을 모두 그 요소 안에 넣어서 보여 줘요.

**해결:**

1. 브라우저에서 `F12`로 개발자 도구를 열고 Elements 목록을 봐요. 들여쓰기가 이상하게 안쪽으로 깊어진 곳이 닫는 태그를 빠뜨린 곳이에요.
2. VS Code에서 그 부분을 찾아 `<header>`, `<main>`, `<section>`마다 `</…>`가 하나씩 있는지 세요.
3. 빠진 닫는 태그를 넣고, 중복된 줄은 지워요.
4. 가장 확실한 방법은 `Ctrl + A`로 파일 전체를 지우고 정답 코드를 다시 붙여 넣는 거예요.
5. Elements에서 `header`, `main`, `footer`가 `body` 바로 아래에 나란히 있으면 해결된 거예요.

### 개발자 도구가 영어로 나와요

**원인:** 이상한 게 아니에요. 브라우저의 개발자 도구는 설정에 따라 영어로 나오기도 해요. Elements는 한국어 화면에서 **요소**로 나올 수 있어요.

**해결:**

1. 영어 이름 그대로 `Elements`, `Console`, `Network`를 찾으면 돼요. 이 교재는 영어 이름을 함께 적어요.
2. 한국어로 바꾸고 싶다면 개발자 도구 오른쪽 위 톱니바퀴(설정)에서 언어 항목을 고르고 다시 시작해요. 이름은 버전에 따라 조금 달라요.
3. 패널 이름이 보이면 문제없어요.

### 개발자 도구에서 고친 글자가 새로 고침하면 사라져요

**원인:** 정상이에요. 개발자 도구는 브라우저가 지금 그려 놓은 화면만 바꿔요. 내 파일(`index.html`)은 바뀌지 않아요. 새로 고침하면 파일을 다시 읽어서 원래대로 돌아와요.

**해결:**

1. 파일에 반영하고 싶다면 VS Code에서 같은 글자를 고쳐요.
2. `Ctrl + S`로 저장하고 브라우저에서 `F5`를 눌러요.
3. 새로 고침해도 고친 글자가 남아 있으면 해결된 거예요.

### 로고가 글자보다 훨씬 크게 보여요

**원인:** 로고 `img`에서 `width="36" height="36"`을 빠뜨렸어요. 크기를 정하지 않으면 SVG가 자기 크기(64×64)로 보여서, 글자 높이에 맞춘 36×36보다 눈에 띄게 커 보여요. 붙여 넣다가 속성 일부가 잘렸을 때 흔해요.

**해결:**

1. `<img src="images/logo.svg" alt="" width="36" height="36">` 줄을 찾아요.
2. 속성 `alt=""`, `width="36"`, `height="36"`이 모두 있는지 확인하고 빠진 것을 넣어요.
3. 저장하고 새로 고침해요. 로고가 글자 높이 정도의 작은 초승달이 되면 해결된 거예요.
## 📝 오늘의 체크리스트

- [ ] 다섯 페이지 맨 위에 초승달 로고와 "달빛곰 방송국"이 있고, 맨 아래에 `© 2026 …` 문장이 있어요.
- [ ] 다섯 페이지가 모두 같은 머리글과 바닥글을 가져요.
- [ ] 브라우저에서 `F12`로 개발자 도구를 열고 Elements 패널에서 `header`, `main`, `footer`를 접고 펼 수 있어요.
- [ ] 개발자 도구에서 고친 글자가 새로 고침하면 원래대로 돌아오는 것을 확인했어요.
- [ ] `div`는 블록 요소이고 `span`은 인라인 요소라는 것을 설명할 수 있어요.
- [ ] 로고 이미지에 `alt=""`를 쓴 이유를 설명할 수 있어요.
- [ ] `&copy;`, `&lt;`, `&gt;`, `&amp;`가 각각 무슨 글자가 되는지 알아요.
- [ ] 과제 1~3을 했어요.

## 📚 더 알아보기

- [MDN · 문서 구조 나누기(영어)](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Structuring_documents): 헤더, 메뉴, 본문, 바닥글을 어떻게 나누는지 설명해요.
- [MDN · 브라우저 개발자 도구 알아보기(영어)](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Tools_and_setup/What_are_browser_developer_tools): 개발자 도구의 여러 패널이 하는 일을 소개해요.
- [Microsoft Edge · 개발자 도구 시작하기](https://learn.microsoft.com/ko-kr/microsoft-edge/devtools/overview): Edge 개발자 도구의 기본 사용법을 알려 줘요.

➡️ **다음 Day 예고:** [Day 7 · Git·GitHub 시작](#/day/p1-d07)에서는 Git을 설치하고 GitHub 계정을 만들어, 지금까지 만든 파일을 인터넷 저장소에 올려요.
