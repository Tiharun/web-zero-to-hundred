## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- `strong`과 `em`으로 글자를 강조하고, 점 목록(`ul`)과 번호 목록(`ol`)을 쓸 수 있어요.
- 링크 `<a href="…">`를 만들고, 절대 경로와 상대 경로의 차이를 설명할 수 있어요.
- 홈페이지 다섯 페이지를 만들어 같은 메뉴로 서로 오갈 수 있어요.
- 파일 이름을 영어 소문자로 짓는 이유를 설명할 수 있어요.

**예상 시간: 100분** (개념 이해 15분 · 따라하기 50분 · 과제 30분 · 정리 5분)

:::path 📂 시작 상태
어제(Day 3)까지 만든 파일이 이렇게 있어야 해요. 없거나 다르면 [Day 3](#/day/p1-d03)의 "오늘 끝 상태 전체 코드"로 맞춰 주세요.

- `C:\dev\my-creator-site\index.html`
- `C:\dev\hello\hello.html`, `C:\dev\hello\favorites.html`, `C:\dev\hello\tools.html`
- 파일 탐색기 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
- VS Code(한국어 팩, Live Preview 확장 프로그램)와 Chrome이 설치되어 있어요.
- VS Code에서 `C:\dev\my-creator-site` 폴더가 열려 있어요. 탐색기 맨 위에 `MY-CREATOR-SITE`가 보이면 돼요.
:::

## 📖 개념 이해

### 강조와 목록

**비유부터 볼게요.** 교과서에는 형광펜으로 칠한 중요한 문장이 있고, 순서가 있는 "1, 2, 3단계"와 순서가 없는 "준비물 목록"이 있어요. HTML에도 같은 도구가 있어요.

- `<strong>`은 "중요해요"를 뜻하고 보통 굵게 보여요. `<em>`은 "강조해요"를 뜻하고 보통 기울어져 보여요. 모양이 아니라 **뜻**을 알리는 태그라서 스크린 리더(화면의 글자를 소리로 읽어 주는 프로그램, Day 5에서 배워요)가 읽는 톤을 달리하기도 해요.
- `<b>`와 `<i>`는 뜻 없이 모양만 굵게·기울게 바꿔요. 뜻이 있는 강조라면 `strong`과 `em`을 써요. 모양은 Day 9부터 CSS로 정해요.
- **[[목록]]**(list)은 여러 항목을 차례로 늘어놓는 요소예요. 순서가 상관없으면 `<ul>`(점 목록), 순서가 중요하면 `<ol>`(번호 목록)을 쓰고, 항목 하나하나를 `<li>`로 감싸요.

### 링크: 페이지를 이어 주는 길

**비유:** 책 속의 "자세한 내용은 32쪽을 보세요"라는 안내처럼, 누르면 다른 곳으로 데려가는 표지판이에요.

**정확한 정의:** **[[링크]]**(link)는 누르면 다른 웹페이지나 파일로 넘어가게 하는 연결이에요. `a` 요소로 만들고, `href` 속성에 갈 곳의 주소를 적어요.

```html
<a href="about.html">소개</a>
```

`<a>`와 `</a>` 사이의 "소개"가 화면에 보이는 글자이고, 누르면 `href`의 `about.html`로 가요.

### 절대 경로와 상대 경로

갈 곳을 적는 방법이 두 가지예요.

- **[[절대 경로]]**(absolute path)는 시작점부터 끝까지 전부 적어서, 어느 페이지에서 쓰든 같은 곳을 가리키는 주소예요. 웹에서는 `https://`부터 쓴 주소(예: `https://developer.mozilla.org/ko/`)가 절대 경로예요. 다른 사이트로 가는 링크에 써요.
- **[[상대 경로]]**(relative path)는 지금 이 파일이 있는 폴더를 기준으로 갈 곳을 적는 주소예요. 같은 폴더의 파일이면 `about.html`이라고만 써요. 내 사이트 안의 파일끼리 이을 때 써요.

```text
my-creator-site\
├─ index.html
└─ about.html

index.html에서 about.html로:
href="about.html"
```

내 사이트 안의 링크를 `C:\dev\my-creator-site\about.html`처럼 쓰면 안 돼요. 이 주소는 내 컴퓨터에만 있는 경로라서, Day 14에 인터넷에 올리면 다른 사람에게는 열리지 않아요. 또 인터넷 주소에서는 폴더를 가르는 기호가 `\`가 아니라 `/`(슬래시)예요. 링크 안에 `\`를 쓰지 않아요.

### 파일 이름 규칙과 대소문자

Windows는 `About.html`과 `about.html`을 같은 파일로 봐요. 하지만 인터넷의 웹 서버(예: Day 14에 쓸 GitHub Pages)는 **[[대소문자 구분]]**(case sensitive)을 해서 다른 파일로 봐요. 그래서 내 컴퓨터에서 잘 열리던 링크가 인터넷에 올린 뒤에 깨질 수 있어요. 이를 막으려고 오늘부터 파일 이름을 이렇게 지어요.

- 영어 소문자, 숫자, 하이픈(`-`)만 써요.
- 공백과 한글을 쓰지 않아요. 주소에 공백이 들어가면 `%20`처럼 바뀌어 보기 어렵고, 한글도 긴 기호로 바뀌어요.
- 확장자는 `.html`로 끝내요.

## 🛠️ 따라하기

모두 7단계예요. 오늘은 VS Code에서 `C:\dev\my-creator-site` 폴더를 열어 두고 작업해요.

### 1단계 · `about.html` 만들기 (12분)

**어디서:** VS Code 탐색기 (`MY-CREATOR-SITE` 줄)

**무엇을:**

1. `MY-CREATOR-SITE` 줄에 마우스를 올리고 **새 파일** 아이콘을 클릭해요.
2. 영어 입력 상태에서 `about.html`을 입력하고 `Enter`를 눌러요.
3. 아래 코드를 입력하거나, 코드 상자 오른쪽 위의 **복사** 버튼으로 복사해서 붙여 넣어요.
4. `Ctrl + S`로 저장해요.

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
  <ul>
    <li><a href="index.html">홈</a></li>
    <li><a href="about.html">소개</a></li>
    <li><a href="contents.html">영상</a></li>
    <li><a href="schedule.html">방송 일정</a></li>
    <li><a href="contact.html">문의</a></li>
  </ul>
  <h1>달빛곰을 소개해요</h1>
  <p>안녕하세요! <strong>달빛곰</strong>이에요. 2026년에 방송을 시작한 <em>버라이어티 스트리머</em>예요.</p>
  <p>밤에 방송하는 걸 좋아해서 이름에 달빛이 들어갔어요. 시청자분들과 수다 떠는 시간이 가장 즐거워요.</p>
  <h2>어떤 방송을 하나요?</h2>
  <ul>
    <li><strong>게임</strong>: 신작 게임을 첫 방송에서 같이 해 봐요.</li>
    <li><strong>토크</strong>: 사연을 읽고 이야기를 나눠요.</li>
    <li><strong>음악</strong>: 기타 연주와 신청곡 라이브를 해요.</li>
  </ul>
  <h2>방송 규칙</h2>
  <ol>
    <li>서로 존중하는 말을 써 주세요.</li>
    <li>스포일러는 미리 말해 주세요.</li>
    <li>개인 정보는 채팅에 올리지 마세요.</li>
  </ol>
</body>
</html>
```
코드에서 새로 나온 것을 짚어 봐요.

- `<ul>` 안의 `<li>` 세 개가 점 목록이에요. 점은 나중에 CSS로 바꿀 수 있어요.
- `<ol>` 안의 `<li>` 세 개가 번호 목록이에요. 번호는 브라우저가 1, 2, 3으로 붙여 줘요.
- 맨 위 `<ul>`은 메뉴예요. 링크 다섯 개가 들어 있고 `href`는 모두 같은 폴더의 파일 이름이에요.
- 첫 문단의 `<strong>달빛곰</strong>`과 `<em>버라이어티 스트리머</em>`가 강조예요. 닉네임과 소개 문장은 내 것으로 바꿔도 돼요. 태그와 파일 이름은 바꾸지 않아요.

:::success
탭 이름이 `about.html`이고 ●가 없어요. 아직 `index.html`, `contents.html` 같은 파일이 없어서 메뉴의 다른 링크를 눌러도 열리지 않아요. 2단계에서 만들어요.
:::

### 2단계 · 나머지 세 페이지 만들기 (10분)

**어디서:** VS Code 탐색기

**무엇을:** 1단계와 같은 방법으로 새 파일 세 개를 만들어요. 파일 이름을 입력할 때마다 영어 입력 상태인지 확인해요. 코드를 붙여 넣고 `Ctrl + S`로 저장해요.

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
  <ul>
    <li><a href="index.html">홈</a></li>
    <li><a href="about.html">소개</a></li>
    <li><a href="contents.html">영상</a></li>
    <li><a href="schedule.html">방송 일정</a></li>
    <li><a href="contact.html">문의</a></li>
  </ul>
  <h1>영상 모아보기</h1>
  <p>지난 방송 영상을 모아 두는 페이지예요.</p>
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
  <ul>
    <li><a href="index.html">홈</a></li>
    <li><a href="about.html">소개</a></li>
    <li><a href="contents.html">영상</a></li>
    <li><a href="schedule.html">방송 일정</a></li>
    <li><a href="contact.html">문의</a></li>
  </ul>
  <h1>방송 일정</h1>
  <p>매주 방송하는 요일과 시간을 알려 드려요.</p>
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
  <ul>
    <li><a href="index.html">홈</a></li>
    <li><a href="about.html">소개</a></li>
    <li><a href="contents.html">영상</a></li>
    <li><a href="schedule.html">방송 일정</a></li>
    <li><a href="contact.html">문의</a></li>
  </ul>
  <h1>문의하기</h1>
  <p>협업 제안이나 궁금한 점을 남겨 주세요.</p>
</body>
</html>
```
세 파일의 `<title>`이 서로 달라요. 브라우저 탭 제목이 페이지마다 달라야 방문자가 어느 탭이 어느 페이지인지 알 수 있어요.

:::success
탐색기에 `about.html`, `contact.html`, `contents.html`, `index.html`, `schedule.html` 다섯 개가 이름순으로 보여요. 파일 이름에 공백이나 `copy`가 들어간 것이 없어요.
:::

### 3단계 · `index.html`에 메뉴 넣기 (8분)

다섯 페이지가 모두 같은 메뉴를 가져야 어디서든 오갈 수 있어요. `index.html`에는 아직 메뉴가 없어서 넣어요.

**어디서:** VS Code 탐색기에서 `index.html`을 클릭해 편집기에 열어요.

**무엇을:**

1. `<body>` 줄 끝을 클릭해서 커서를 두고 `Enter`를 눌러 새 줄을 만들어요.
2. 아래 코드를 `<body>` 줄 바로 아래에 붙여 넣어요. 주석 `<!-- 홈 페이지: 인사와 방송 소개 -->` 줄 앞이에요.
3. 붙여 넣은 줄의 들여쓰기가 조금 달라도 화면은 같아요. 맞추고 싶으면 줄을 선택하고 `Tab` 또는 `Shift + Tab`을 눌러요.
4. `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\index.html (일부)
```html
  <ul>
    <li><a href="index.html">홈</a></li>
    <li><a href="about.html">소개</a></li>
    <li><a href="contents.html">영상</a></li>
    <li><a href="schedule.html">방송 일정</a></li>
    <li><a href="contact.html">문의</a></li>
  </ul>
```

:::success
`<body>` 바로 아래에 `<ul>`이 있고 그 아래 주석과 `<h1>`이 이어져요. 파일 전체 모양은 아래 정답의 "오늘 끝 상태 전체 코드"에 있어요.
:::

### 4단계 · Live Preview에서 링크로 오가기 (5분)

**어디서:** VS Code `index.html` 탭 → Live Preview 미리 보기 창

**무엇을:**

1. 편집기 오른쪽 위 미리 보기 아이콘을 클릭해요(Day 2). 아이콘이 안 보이면 `Ctrl + Shift + P` → `Live Preview: Show Preview`예요.
2. 미리 보기 창에서 메뉴의 **소개**, **영상**, **방송 일정**, **문의**, **홈**을 차례로 클릭해요.

:::success
메뉴를 누를 때마다 큰 제목이 바뀌어요: 소개 → "달빛곰을 소개해요", 영상 → "영상 모아보기", 방송 일정 → "방송 일정", 문의 → "문의하기", 홈 → "안녕하세요, 달빛곰이에요!". 미리 보기 창 위쪽 주소 칸의 파일 이름도 따라 바뀌어요. 안 열리는 링크가 있으면 아래 🧯 자주 막히는 곳의 "링크를 눌렀더니 파일을 찾을 수 없다고 나와요"를 보세요.
:::

### 5단계 · 일부러 링크를 깨 보고 고치기 (5분)

링크가 깨졌을 때 어떻게 보이는지 미리 알아 두면, 나중에 당황하지 않아요.

**어디서:** `index.html` 편집기와 미리 보기 창

**무엇을:**

1. `index.html`의 메뉴에서 `<a href="about.html">`의 `about`을 `abuot`로 바꿔요(철자를 일부러 틀려요). 저장해요.
2. 미리 보기 창을 새로 고쳐 **소개**를 눌러요. 브라우저는 파일이 없다는 안내 화면을 보여 줘요. 더블클릭한 페이지(`file://`)에서는 `ERR_FILE_NOT_FOUND` 같은 오류 코드가 보여요.
3. `abuot`을 다시 `about`으로 고치고 `Ctrl + S`로 저장해요.
4. 다시 **소개**를 눌러요.

:::success
2번에서는 소개 페이지 대신 찾을 수 없다는 화면이 나오고, 4번에서는 "달빛곰을 소개해요"가 다시 보여요. 링크가 안 열리면 철자를 가장 먼저 의심하세요.
:::

### 6단계 · `strong`과 `b`의 차이 눈으로 보기 (5분)

**어디서:** `about.html` 편집기

**무엇을:**

1. 첫 문단의 `<strong>달빛곰</strong>`을 `<b>달빛곰</b>`으로 바꿔요.
2. 저장하고 미리 보기를 확인해요.
3. 다시 `<strong>달빛곰</strong>`으로 되돌리고 저장해요.

:::success
둘 다 굵게 보여서 화면에서는 차이가 없어요. 차이는 뜻이에요. `strong`은 "중요해요"를 알리고 `b`는 모양만 바꿔요. 이 교재의 최종 코드는 `strong`을 써요. 3번 뒤에 코드가 다시 `<strong>`이에요.
:::

### 7단계 · 파일 복사하고 이름 바꾸고 지우기 (5분)

앞으로 파일을 복사해서 쓸 일이 많아요. 복사하면 이름이 이상하게 붙는 것도 한 번 보고 가요. 연습용 파일은 곧 지워요.

**어디서:** VS Code 탐색기

**무엇을:**

1. `contact.html`을 오른쪽 클릭하고 **복사**를 클릭해요.
2. 탐색기의 빈 곳(파일 목록 아래 흰 부분)을 오른쪽 클릭하고 **붙여넣기**를 클릭해요. `contact copy.html`이라는 파일이 생겨요.
3. `contact copy.html`을 클릭하고 `F2`를 눌러요(노트북은 `Fn + F2`일 수 있어요). 이름 칸이 열리면 `test.html`을 입력하고 `Enter`를 눌러요.
4. `test.html`을 클릭하고 `Delete` 키를 눌러요. 지우겠냐는 창이 뜨면 **휴지통으로 이동**을 클릭해요.

:::success
복사 직후에는 `contact copy.html`이라는 공백이 든 이름이 생기고, `F2`로 이름을 바꾸는 순간 `test.html`로 바뀌어요. 4번 뒤에는 탐색기에 다섯 파일만 남아요. 이름을 바꿀 때 열려 있던 탭 이름도 VS Code가 알아서 따라 바꿔 줘요. 메모장은 이런 일을 해 주지 않아서, Day 1에서는 탐색기로 이름을 바꾸면 안 된다고 했어요.
:::

## ✍️ 과제

### 과제 1 · "함께해요" 문단 만들기 (쉬움 ⭐, 10분)

`about.html`의 방송 규칙 `</ol>` 줄 바로 아래, `</body>` 줄 바로 위에 아래 두 줄을 추가해요.

- `<h2>함께해요</h2>`
- 다음 문단 (링크 두 개가 들어 있어요)

```html
<p>방송 시간은 <a href="schedule.html">방송 일정</a>에서 확인하고, 협업이나 궁금한 점은 <a href="contact.html">문의 페이지</a>로 보내 주세요.</p>
```

저장한 뒤 미리 보기에서 두 링크를 눌러 일정 페이지와 문의 페이지로 가는지 확인해요.

### 과제 2 · 링크 연습 파일 `links.html` (보통 ⭐⭐, 10분)

연습 폴더에 링크 연습 페이지를 만들어요. 이 파일은 오늘 프로젝트와 관계없는 연습용이에요.

- VS Code에서 **파일 → 폴더 열기**로 `C:\dev\hello` 폴더를 열어요. 저장하지 않은 파일이 있으면 저장하라고 묻는 창이 뜰 수 있어요.
- 새 파일 `links.html`을 만들고 탭 제목은 `링크 연습`, 큰 제목은 `링크 연습`으로 해요.
- 절대 경로 링크 2개: `https://developer.mozilla.org/ko/`와 `https://www.youtube.com/`.
- 상대 경로 링크 2개: 같은 폴더의 `hello.html`과 `favorites.html`.
- 확인한 뒤 **파일 → 최근 항목 열기**에서 `C:\dev\my-creator-site`를 골라 프로젝트 폴더로 돌아와요.

### 과제 3 · 링크 퀴즈 (도전 ⭐⭐⭐, 10분)

`my-creator-site`를 인터넷에 올린 뒤에도 소개 페이지가 열리는 링크는 어느 것일까요? 없다면 왜 그런지 각각 한 문장으로 적어 보세요.

- `<a href="C:\dev\my-creator-site\about.html">`
- `<a href="About.html">`
- `<a href="about">`

## ✅ 정답

:::answer 과제 1 정답 · 함께해요 문단
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
  <ul>
    <li><a href="index.html">홈</a></li>
    <li><a href="about.html">소개</a></li>
    <li><a href="contents.html">영상</a></li>
    <li><a href="schedule.html">방송 일정</a></li>
    <li><a href="contact.html">문의</a></li>
  </ul>
  <h1>달빛곰을 소개해요</h1>
  <p>안녕하세요! <strong>달빛곰</strong>이에요. 2026년에 방송을 시작한 <em>버라이어티 스트리머</em>예요.</p>
  <p>밤에 방송하는 걸 좋아해서 이름에 달빛이 들어갔어요. 시청자분들과 수다 떠는 시간이 가장 즐거워요.</p>
  <h2>어떤 방송을 하나요?</h2>
  <ul>
    <li><strong>게임</strong>: 신작 게임을 첫 방송에서 같이 해 봐요.</li>
    <li><strong>토크</strong>: 사연을 읽고 이야기를 나눠요.</li>
    <li><strong>음악</strong>: 기타 연주와 신청곡 라이브를 해요.</li>
  </ul>
  <h2>방송 규칙</h2>
  <ol>
    <li>서로 존중하는 말을 써 주세요.</li>
    <li>스포일러는 미리 말해 주세요.</li>
    <li>개인 정보는 채팅에 올리지 마세요.</li>
  </ol>
  <h2>함께해요</h2>
  <p>방송 시간은 <a href="schedule.html">방송 일정</a>에서 확인하고, 협업이나 궁금한 점은 <a href="contact.html">문의 페이지</a>로 보내 주세요.</p>
</body>
</html>
```
**왜 이렇게 하나요?** 소개 페이지와 일정 페이지, 문의 페이지는 같은 폴더(`C:\dev\my-creator-site`)에 있어요. 같은 폴더의 파일은 파일 이름만 쓰는 상대 경로 `schedule.html`, `contact.html`로 이어요. `https://`로 시작하는 절대 경로는 다른 사이트로 갈 때만 써요.
:::

:::answer 과제 2 정답 · links.html
📄 C:\dev\hello\links.html
```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <title>링크 연습</title>
</head>
<body>
  <h1>링크 연습</h1>
  <h2>인터넷 주소 (절대 경로)</h2>
  <ul>
    <li><a href="https://developer.mozilla.org/ko/">MDN 웹 문서</a></li>
    <li><a href="https://www.youtube.com/">YouTube</a></li>
  </ul>
  <h2>같은 폴더의 파일 (상대 경로)</h2>
  <ul>
    <li><a href="hello.html">내 자기소개</a></li>
    <li><a href="favorites.html">내가 좋아하는 것</a></li>
  </ul>
</body>
</html>
```
**왜 이렇게 하나요?** 인터넷 주소(`https://…`)는 어디서 눌러도 같은 곳으로 가는 절대 경로이고, `hello.html` 같은 이름만 있는 링크는 이 파일이 있는 폴더를 기준으로 찾는 상대 경로예요. 앞의 두 링크는 인터넷에 연결되어 있어야 열려요. 뒤의 두 링크는 인터넷이 없어도 열려요.
:::

:::answer 과제 3 정답 · 링크 퀴즈
**셋 다 안 열려요.**

- `href="C:\dev\my-creator-site\about.html"`: 내 컴퓨터에만 있는 경로이고, 인터넷 주소에는 쓸 수 없는 `\`가 들어 있어요. 내 컴퓨터에서 열었을 때만 우연히 열려요.
- `href="About.html"`: 웹 서버는 대소문자를 구분하는데 파일 이름은 `about.html`이에요. Windows에서는 열릴 수 있지만 서버에서는 다른 파일이라 열리지 않아요.
- `href="about"`: `.html` 확장자가 빠졌어요. 파일 이름은 확장자까지 정확히 써야 해요.

정답은 `href="about.html"`이에요.
:::

:::answer 오늘 끝 상태 전체 코드
오늘 따라하기와 과제를 모두 끝내면 아래 상태가 돼요. 막혔다면 이 폴더와 파일을 그대로 만들고 코드를 붙여 넣어 저장하세요. 그러면 Day 5를 바로 시작할 수 있어요.

```text
C:\dev\
├─ hello\
│  ├─ hello.html
│  ├─ favorites.html
│  ├─ tools.html
│  └─ links.html
└─ my-creator-site\
   ├─ index.html
   ├─ about.html
   ├─ contents.html
   ├─ schedule.html
   └─ contact.html
```

오늘 새로 만든 파일은 `about.html`, `contents.html`, `schedule.html`, `contact.html`, `links.html`이고, `index.html`에는 메뉴를 더했어요.

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
  <ul>
    <li><a href="index.html">홈</a></li>
    <li><a href="about.html">소개</a></li>
    <li><a href="contents.html">영상</a></li>
    <li><a href="schedule.html">방송 일정</a></li>
    <li><a href="contact.html">문의</a></li>
  </ul>
  <!-- 홈 페이지: 인사와 방송 소개 -->
  <h1>안녕하세요, 달빛곰이에요!</h1>
  <p>게임, 토크, 음악을 넘나드는 버라이어티 스트리머예요. 매주 월·수·금·토에 방송해요.</p>
  <h2>이런 방송을 해요</h2>
  <h3>게임 방송</h3>
  <p>신작부터 레트로 게임까지, 시청자와 함께 즐겨요.</p>
  <h3>토크 방송</h3>
  <p>사연을 읽고 수다를 떨어요. 편하게 놀러 오세요.</p>
  <h3>음악 방송</h3>
  <p>기타를 치며 신청곡을 불러 드려요.</p>
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
  <ul>
    <li><a href="index.html">홈</a></li>
    <li><a href="about.html">소개</a></li>
    <li><a href="contents.html">영상</a></li>
    <li><a href="schedule.html">방송 일정</a></li>
    <li><a href="contact.html">문의</a></li>
  </ul>
  <h1>달빛곰을 소개해요</h1>
  <p>안녕하세요! <strong>달빛곰</strong>이에요. 2026년에 방송을 시작한 <em>버라이어티 스트리머</em>예요.</p>
  <p>밤에 방송하는 걸 좋아해서 이름에 달빛이 들어갔어요. 시청자분들과 수다 떠는 시간이 가장 즐거워요.</p>
  <h2>어떤 방송을 하나요?</h2>
  <ul>
    <li><strong>게임</strong>: 신작 게임을 첫 방송에서 같이 해 봐요.</li>
    <li><strong>토크</strong>: 사연을 읽고 이야기를 나눠요.</li>
    <li><strong>음악</strong>: 기타 연주와 신청곡 라이브를 해요.</li>
  </ul>
  <h2>방송 규칙</h2>
  <ol>
    <li>서로 존중하는 말을 써 주세요.</li>
    <li>스포일러는 미리 말해 주세요.</li>
    <li>개인 정보는 채팅에 올리지 마세요.</li>
  </ol>
  <h2>함께해요</h2>
  <p>방송 시간은 <a href="schedule.html">방송 일정</a>에서 확인하고, 협업이나 궁금한 점은 <a href="contact.html">문의 페이지</a>로 보내 주세요.</p>
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
  <ul>
    <li><a href="index.html">홈</a></li>
    <li><a href="about.html">소개</a></li>
    <li><a href="contents.html">영상</a></li>
    <li><a href="schedule.html">방송 일정</a></li>
    <li><a href="contact.html">문의</a></li>
  </ul>
  <h1>영상 모아보기</h1>
  <p>지난 방송 영상을 모아 두는 페이지예요.</p>
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
  <ul>
    <li><a href="index.html">홈</a></li>
    <li><a href="about.html">소개</a></li>
    <li><a href="contents.html">영상</a></li>
    <li><a href="schedule.html">방송 일정</a></li>
    <li><a href="contact.html">문의</a></li>
  </ul>
  <h1>방송 일정</h1>
  <p>매주 방송하는 요일과 시간을 알려 드려요.</p>
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
  <ul>
    <li><a href="index.html">홈</a></li>
    <li><a href="about.html">소개</a></li>
    <li><a href="contents.html">영상</a></li>
    <li><a href="schedule.html">방송 일정</a></li>
    <li><a href="contact.html">문의</a></li>
  </ul>
  <h1>문의하기</h1>
  <p>협업 제안이나 궁금한 점을 남겨 주세요.</p>
</body>
</html>
```
📄 C:\dev\hello\links.html
```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <title>링크 연습</title>
</head>
<body>
  <h1>링크 연습</h1>
  <h2>인터넷 주소 (절대 경로)</h2>
  <ul>
    <li><a href="https://developer.mozilla.org/ko/">MDN 웹 문서</a></li>
    <li><a href="https://www.youtube.com/">YouTube</a></li>
  </ul>
  <h2>같은 폴더의 파일 (상대 경로)</h2>
  <ul>
    <li><a href="hello.html">내 자기소개</a></li>
    <li><a href="favorites.html">내가 좋아하는 것</a></li>
  </ul>
</body>
</html>
```
:::

## 🧯 자주 막히는 곳

모든 문제와 드문 경우는 [문제 해결 모음](#/page/troubleshooting)에 있어요.

### 링크를 눌렀더니 파일을 찾을 수 없다고 나와요 (ERR_FILE_NOT_FOUND)

**원인:** 링크가 가리키는 파일이 그 폴더에 없어요. 가장 흔한 이유는 세 가지예요. ① `href`의 철자나 `.html`을 틀렸어요. ② 아직 만들지 않은 파일이에요. ③ 파일 이름이 `contact copy.html`처럼 달라요. 더블클릭한 페이지(`file://`)에서는 브라우저가 `ERR_FILE_NOT_FOUND`라는 오류 코드와 함께 "이 파일을 찾을 수 없음" 같은 안내를 보여 줘요(문구는 브라우저 버전에 따라 달라요).

**해결:**

1. 누른 링크의 `href` 값을 읽어요. 예: `href="contents.html"`.
2. VS Code 탐색기에서 같은 이름의 파일이 있는지 봐요. 철자, 하이픈, `.html`을 한 글자씩 비교해요.
3. 파일이 없으면 만들고, 이름이 다르면 파일을 클릭해 `F2`로 이름을 고쳐요(또는 `href`를 파일 이름에 맞춰요).
4. 저장하고 미리 보기를 새로 고쳐서 링크를 다시 눌러요. 페이지가 열리면 해결된 거예요.

### 복사한 파일 이름이 index copy.html로 남아 있어요

**원인:** VS Code에서 파일을 복사해서 붙여넣으면 이름 뒤에 ` copy`가 자동으로 붙어요. 이름을 바꾸지 않으면 그 이름 그대로 파일이 되고, 메뉴 링크(`index.html`)는 이 파일을 찾지 못해요. 이름에 공백이 있는 것도 문제예요.

**해결:**

1. 탐색기에서 `index copy.html`을 클릭해요.
2. `F2`(노트북은 `Fn + F2`)를 눌러요. 이름 앞부분만 선택된 상태에서 새 이름을 입력해요. 예: `schedule`. 확장자 `.html`은 그대로 남아요.
3. `Enter`를 눌러 확정해요. 파일 이름에 공백이 없는지 확인해요.
4. 탐색기에 의도한 이름의 파일이 보이면 해결된 거예요.

### 링크가 깨지거나 아래 글이 이상하게 사라져요 (따옴표를 하나만 닫았어요)

**원인:** `<a href="about.html>소개</a>`처럼 `href`의 닫는 따옴표를 빠뜨리면, 브라우저는 다음 따옴표가 나올 때까지를 모두 `href` 값으로 읽어요. 그래서 링크가 엉뚱한 곳으로 가거나 아래 글이 화면에서 사라져요. VS Code가 따옴표를 자동으로 닫아 주는데, 직접 한 번 더 입력하면 어긋나기도 해요.

**해결:**

1. 코드에서 `href="` 뒤 값 끝에 닫는 따옴표 `"`가 있는지 한 줄씩 확인해요. VS Code는 짝이 맞지 않으면 그 뒤 글자 색이 달라져서 알려 줘요.
2. 빠진 곳에 `"`를 넣어 `<a href="about.html">소개</a>`처럼 고쳐요.
3. 저장하고 새로 고침해요. 사라졌던 글이 보이고 링크가 열리면 해결된 거예요.

### 링크에 `\`나 `C:\`를 썼더니 열리지 않아요 (한글·공백 파일 이름도 포함)

**원인:** 링크 주소에서 폴더를 가르는 기호는 `/`예요. `\`는 Windows 파일 경로에만 써요. 또 `C:\dev\…`처럼 내 컴퓨터 전체 경로를 쓰면 인터넷에 올린 뒤에는 열리지 않아요. 파일 이름에 한글이나 공백이 있으면(`소개.html`, `my page.html`) 주소가 `%EC%86%8C…`, `my%20page.html` 같은 기호로 바뀌어 읽기 어렵고 실수하기 쉬워요.

**해결:**

1. `href` 값에서 `C:\`와 `\`를 모두 지워요. 같은 폴더의 파일이면 `href="about.html"`처럼 파일 이름만 써요.
2. 파일 이름에 한글이나 공백이 있으면 탐색기에서 `F2`로 영어 소문자·숫자·하이픈 이름으로 바꾸고, `href`도 같이 고쳐요.
3. 저장하고 링크를 눌러요. 페이지가 열리면 해결된 거예요.

### 메뉴가 한 페이지에만 있어요

**원인:** 이 교재의 다섯 페이지는 같은 메뉴를 각각 가지고 있어요. 한 페이지에만 메뉴를 붙이면 다른 페이지에서는 이동할 곳이 없어져요. 지금은 파일마다 직접 복사해 넣어야 해서 빠뜨리기 쉬워요.

**해결:**

1. 메뉴가 없는 페이지를 VS Code에서 열어요.
2. `<body>` 줄 바로 아래에 메뉴 `<ul>` 블록(`<ul>`부터 `</ul>`까지 7줄)을 붙여 넣어요. 다른 페이지에서 복사해 와도 돼요.
3. 저장하고 미리 보기에서 새로 고침해요.
4. 다섯 페이지 모두에서 메뉴 5개가 보이면 해결된 거예요.

### 파일 이름을 한글로 만들었어요 (소개.html)

**원인:** 한글 파일 이름도 내 컴퓨터에서는 열려요. 하지만 인터넷 주소에서는 긴 기호로 바뀌고, 링크를 쓸 때 입력 상태(한/영)를 헷갈려 오타가 나기 쉬워요. 이 교재는 모든 파일 이름을 영어 소문자로 정했어요.

**해결:**

1. 탐색기에서 `소개.html`을 클릭하고 `F2`를 눌러요.
2. `about`을 입력하고 `Enter`를 눌러요. 확장자는 그대로 남아요.
3. 메뉴 링크의 `href`가 `about.html`인지 확인해요.
4. 탐색기의 파일 이름이 `about.html`이면 해결된 거예요.
## 📝 오늘의 체크리스트

- [ ] 탐색기에 `index.html`, `about.html`, `contents.html`, `schedule.html`, `contact.html` 다섯 파일이 있어요.
- [ ] 다섯 페이지 어디서든 메뉴 링크 5개로 다른 페이지가 열려요.
- [ ] 브라우저 탭 제목이 페이지마다 달라요.
- [ ] 소개 페이지에 점 목록 3개와 번호 목록 1~3이 보이고 "달빛곰"이 굵게 보여요.
- [ ] 소개 페이지 맨 아래 "함께해요"의 두 링크가 일정 페이지와 문의 페이지로 가요.
- [ ] 절대 경로와 상대 경로의 차이를 내 말로 설명할 수 있어요.
- [ ] 파일 이름에 공백, 한글, 대문자를 쓰지 않는 이유를 말할 수 있어요.
- [ ] 과제 2의 `links.html`을 만들고 프로젝트 폴더로 돌아왔어요.

## 📚 더 알아보기

- [MDN · a 요소](https://developer.mozilla.org/ko/docs/Web/HTML/Reference/Elements/a): 링크의 `href` 속성과 여러 쓰임을 설명해요.
- [MDN · 목록 요소 ul](https://developer.mozilla.org/ko/docs/Web/HTML/Reference/Elements/ul): 순서 없는 목록을 설명해요.
- [MDN · HTML 링크 만들기](https://developer.mozilla.org/ko/docs/Learn_web_development/Core/Structuring_content/Creating_links): 절대·상대 경로와 링크 쓰는 법을 자세히 설명해요.

➡️ **다음 Day 예고:** [Day 5 · 이미지와 경로 완전정복](#/day/p1-d05)에서는 곰 캐릭터 그림을 만들어 `img`로 넣고, `../` 같은 경로를 따라가 봐요.
