## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- `images` 폴더를 만들고 안에 SVG 그림 파일을 만들 수 있어요.
- `<img>`로 그림을 넣고, 그림을 못 보는 사람을 위한 대체 텍스트를 쓸 수 있어요.
- `../`, `../../` 같은 경로를 보고 어느 파일을 가리키는지 따라갈 수 있어요.
- 이미지 파일 형식(JPG, PNG, GIF, SVG, WebP)을 용도에 맞게 고를 수 있어요.

**예상 시간: 90분** (개념 이해 15분 · 따라하기 40분 · 과제 30분 · 정리 5분)

:::path 📂 시작 상태
어제(Day 4)까지 만든 파일이 이렇게 있어야 해요. 없거나 다르면 [Day 4](#/day/p1-d04)의 "오늘 끝 상태 전체 코드"로 맞춰 주세요.

- `C:\dev\my-creator-site\index.html`, `about.html`, `contents.html`, `schedule.html`, `contact.html`
- `C:\dev\hello\hello.html`, `favorites.html`, `tools.html`, `links.html`
- 파일 탐색기 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
- VS Code(한국어 팩, Live Preview 확장 프로그램)와 Chrome이 설치되어 있어요.
- VS Code에서 `C:\dev\my-creator-site` 폴더가 열려 있어요.
:::

## 📖 개념 이해

### 이미지 요소 `img`

**비유부터 볼게요.** 책에 사진을 붙일 때 "사진은 여기, 크기는 이만큼, 사진이 안 보이는 사람에게는 이렇게 설명해 주세요"라고 메모를 달아요. HTML의 `img`도 같아요. 그림 파일의 위치, 크기, 설명을 한 줄에 적어요.

```html
<img src="images/profile.svg" alt="헤드셋을 쓴 곰 캐릭터, 달빛곰" width="240" height="240">
```

- `src`: 그림 파일의 위치예요. 어제 배운 상대 경로를 써요.
- `alt`: 그림을 대신하는 글이에요. 아래에서 자세히 배워요.
- `width`, `height`: 그림의 가로·세로 크기(단위는 화면의 점, px)예요. 그림이 로딩되기 전에 자리를 미리 잡아 두어서, 로딩이 끝나도 글이 갑자기 밀려 내려가지 않아요.
- `<img>`는 닫는 태그가 없는 요소예요. 감쌀 내용이 없기 때문이에요.

### 대체 텍스트와 접근성

**[[대체 텍스트]]**(alt text)는 그림을 볼 수 없을 때 그림 대신 전해지는 글이에요. `img`의 `alt` 속성에 써요. 그림 파일이 없거나 인터넷이 느려서 그림이 안 나올 때 화면에 보이고, 앞이 잘 보이지 않는 사람이 쓰는 **[[스크린 리더]]**(screen reader, 화면의 글자와 구조를 소리로 읽어 주는 프로그램)가 소리 내어 읽어 줘요.

이렇게 장애가 있거나 환경이 다른 사람도 웹사이트를 똑같이 쓸 수 있게 만드는 것을 **[[접근성]]**(accessibility)이라고 해요. `alt`는 접근성의 첫걸음이에요. 쓰는 요령은 이래요.

- 그림이 전하는 내용을 짧게 써요. 예: "헤드셋을 쓴 곰 캐릭터, 달빛곰".
- "이미지", "사진" 같은 말은 빼요. 스크린 리더가 "그림"이라고 먼저 알려 줘요.
- 옆 글자와 똑같은 뜻의 장식 그림은 `alt=""`로 비워 둬요. 이건 Day 6 로고에서 해 봐요.

### 경로 완전정복: `./`와 `../`

`src`에 쓰는 상대 경로를 정확히 읽어야 그림이 안 깨져요. 기준은 항상 **지금 이 HTML 파일이 있는 폴더**예요.

- `images/profile.svg`: 이 폴더 안의 `images` 폴더 안의 `profile.svg`예요.
- `./images/profile.svg`: 위와 같아요. `./`는 "지금 이 폴더"를 뜻해서 보통 생략해요.
- `../`: **[[상위 폴더]]**(parent folder), 한 칸 위 폴더로 올라가라는 뜻이에요. `../../`는 두 칸 위예요.

아래는 오늘 과제에 쓸 폴더 모양이에요. `back.html`에서 곰 그림까지 가는 길을 따라가 봐요.

```text
C:\dev\
├─ hello\
│  ├─ hello.html
│  └─ pages\
│     └─ back.html ← 시작
└─ my-creator-site\
   └─ images\
      └─ profile.svg ← 도착
```

시작 파일과 도착 파일을 바꿔 고르면 길이 다시 계산돼요.

:::figure paths-dev
캡션: 지금 파일에서 갈 파일까지 가는 길
대체 설명: 시작은 C:\dev\hello\pages 폴더의 back.html이에요. ../ 한 번이면 C:\dev\hello, ../../ 두 번이면 C:\dev에 도착해요. 거기서 my-creator-site/images/로 내려가 profile.svg를 찾아요. 그래서 경로는 ../../my-creator-site/images/profile.svg예요. 시작 파일과 도착 파일을 바꿔 고르면 다른 경로도 계산해 볼 수 있어요.
:::

그래서 `back.html`에서 곰 그림의 경로는 `../../my-creator-site/images/profile.svg`예요. 두 칸 올라가서(`../../`) `C:\dev`에 도착한 뒤, 아래로 내려가요.

### 이미지 형식과 파일 이름

| 형식 | 이럴 때 써요 | 특징 |
|---|---|---|
| JPG | 사진 | 용량이 작아요 |
| PNG | 투명 배경, 선명한 그림 | 배경을 투명하게 할 수 있어요 |
| GIF | 짧게 움직이는 그림 | 색이 적어요 |
| SVG | 로고, 아이콘 | 커져도 선명해요 |
| WebP | 사진·그림 모두 | 같은 화질에 용량이 더 작아요 |

**[[SVG]]**(Scalable Vector Graphics)는 점·선·도형을 글자(코드)로 적어 그리는 그림 형식이에요. 글자로 된 파일이라서 메모장이나 VS Code로 열면 코드가 보이고, 아무리 크게 키워도 흐려지지 않아요. 오늘 쓸 곰 그림은 SVG예요.

휴대폰으로 찍은 사진은 `.heic` 형식일 수 있어요. 일부 브라우저에서는 보이지 않아서 `.jpg`로 바꿔 쓰는 게 좋아요. 그림 파일 이름도 Day 4와 같이 영어 소문자·숫자·하이픈(`-`)으로만 지어요.

## 🛠️ 따라하기

모두 6단계예요. VS Code에서 `C:\dev\my-creator-site` 폴더를 열어 둔 상태에서 시작해요.

### 1단계 · `images` 폴더 만들기 (4분)

**어디서:** VS Code 탐색기 (`MY-CREATOR-SITE` 줄)

**무엇을:**

1. `MY-CREATOR-SITE` 줄에 마우스를 올리고 **새 폴더**(폴더에 `+` 모양) 아이콘을 클릭해요.
2. 영어 입력 상태에서 `images`를 입력하고 `Enter`를 눌러요.

:::success
탐색기에 `images` 폴더가 생겨서 파일들 위쪽에 보여요. 폴더가 `hello` 쪽에 만들어졌다면 아래 🧯 자주 막히는 곳의 "그림이 깨져서 나와요"를 보세요.
:::

### 2단계 · `profile.svg` 만들기 (8분)

**어디서:** VS Code 탐색기의 `images` 폴더

**무엇을:**

1. `images` 줄을 오른쪽 클릭하고 **새 파일**을 클릭해요. (그러면 `images` 안에 만들어져요.)
2. `profile.svg`를 입력하고 `Enter`를 눌러요.
3. 아래 SVG 코드를 복사해서 붙여 넣어요. 그림을 그리는 좌표가 들어 있어서 복사해서 붙여 넣는 편이 좋아요.
4. `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\images\profile.svg
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240">
  <rect width="240" height="240" fill="#ddd9ff"/>
  <!-- 귀 -->
  <circle cx="64" cy="64" r="28" fill="#8a6a4b"/>
  <circle cx="176" cy="64" r="28" fill="#8a6a4b"/>
  <circle cx="64" cy="64" r="14" fill="#e9c9a8"/>
  <circle cx="176" cy="64" r="14" fill="#e9c9a8"/>
  <!-- 얼굴 -->
  <circle cx="120" cy="124" r="78" fill="#a47c57"/>
  <ellipse cx="120" cy="148" rx="38" ry="30" fill="#e9c9a8"/>
  <!-- 눈, 코, 입 -->
  <circle cx="92" cy="110" r="8" fill="#2b2140"/>
  <circle cx="148" cy="110" r="8" fill="#2b2140"/>
  <ellipse cx="120" cy="138" rx="12" ry="9" fill="#2b2140"/>
  <path d="M104 156Q120 170 136 156" fill="none" stroke="#2b2140" stroke-width="5" stroke-linecap="round"/>
  <!-- 헤드셋 -->
  <path d="M44 120A76 76 0 0 1 196 120" fill="none" stroke="#5b4bdb" stroke-width="10" stroke-linecap="round"/>
  <rect x="34" y="112" width="20" height="40" rx="8" fill="#5b4bdb"/>
  <rect x="186" y="112" width="20" height="40" rx="8" fill="#5b4bdb"/>
</svg>
```
코드 모양을 눈으로만 읽어 봐요. `<circle>`은 원, `<rect>`는 네모, `<path>`는 곡선이에요. `<!-- 귀 -->` 같은 줄은 주석이에요. 값을 바꿔 보면 그림이 바뀌는 것을 알 수 있어요.

:::success
탐색기에서 `MY-CREATOR-SITE` 아래 `images` 폴더 안에 `profile.svg`가 있고, 파일 이름 뒤에 `.txt`가 없어요. 편집기에는 `<svg …>`로 시작하는 20줄 남짓한 코드가 보여요. 파일이 아직 그림으로는 안 보여요. 다음 단계에서 `img`로 불러서 봐요.
:::

### 3단계 · `index.html`에 그림 넣기 (8분)

**어디서:** VS Code에서 `index.html`을 연 편집기

**무엇을:**

1. 주석 아래의 `<h1>안녕하세요, 달빛곰이에요!</h1>` 줄을 찾아요.
2. `<h1>` 줄 바로 위에 새 줄을 만들고 아래 한 줄을 붙여 넣어요.
3. `Ctrl + S`로 저장해요. 미리 보기가 닫혀 있으면 [Day 2의 미리 보기 사용법](#/day/p1-d02)대로 다시 열어요.

📄 C:\dev\my-creator-site\index.html (일부)
```html
  <img src="images/profile.svg" alt="헤드셋을 쓴 곰 캐릭터, 달빛곰" width="240" height="240">
```

:::success
미리 보기 맨 위쪽에 헤드셋을 쓴 곰 캐릭터 그림이 보여요. 크기가 가로 240, 세로 240 정도로 정사각형이에요. 그림이 아니라 글자만 보이면 아래 🧯 자주 막히는 곳의 "그림이 깨져서 나와요"를 보세요.
:::

### 4단계 · 일부러 `src`를 틀려 보기 (6분)

그림이 깨졌을 때 `alt`가 어떻게 보이는지 직접 확인해 봐요.

**어디서:** `index.html` 편집기와 미리 보기 창

**무엇을:**

1. `src="images/profile.svg"`의 `profile`을 `profil`로 바꿔요(`e`를 지워요). 저장해요.
2. 미리 보기에서 그림이 깨지는 것을 봐요(저절로 바뀌어요).
3. `profil`을 `profile`로 되돌리고 저장해요.
4. 그림이 다시 나오는지 봐요.

:::success
2번에서는 그림 자리에 작은 깨진 그림 아이콘과 함께 대체 텍스트 "헤드셋을 쓴 곰 캐릭터, 달빛곰"이 글자로 보여요(브라우저에 따라 모양이 달라요). 4번에서는 곰 그림이 다시 보여요. `alt`가 있으면 그림이 깨져도 무슨 그림이 있었는지 알 수 있어요.
:::

### 5단계 · 내 사진으로 바꾸기 (6분)

내 사진이나 그림을 쓰고 싶다면 해 봐요. 건너뛰어도 돼요. 교재의 이후 코드는 `profile.svg`를 그대로 써요.

**어디서:** 파일 탐색기와 VS Code 탐색기

**무엇을:**

1. 쓸 사진이 `.jpg`나 `.png`인지 확인해요. 휴대폰에서 옮긴 `.heic`는 브라우저에서 안 보일 수 있어요.
2. 사진의 이름을 영어 소문자(예: `profile.jpg`)로 바꾸고, 파일 탐색기에서 `C:\dev\my-creator-site\images` 폴더로 복사해요.
3. `index.html`의 `src`를 `images/profile.jpg`로 바꿔 보고, 저장해서 확인해요.
4. 확인한 뒤 교재와 같게 하려면 다시 `images/profile.svg`로 돌려놓고, 연습으로 넣은 `images\profile.jpg`는 탐색기에서 지워요. 지우지 않아도 되지만, 그러면 Day 7 푸시 때 파일 수가 교재 예시보다 하나 많아져요.

:::success
선택한 사진이 `img`로 보여요. 사진이 너무 크면 화면을 벗어나는데, 이건 Day 10에서 CSS로 해결해요. 건너뛰었다면 `profile.svg`가 보이는 상태가 정상이에요.
:::

### 6단계 · 경로 따라가 보기 (8분)

**어디서:** 종이나 메모장 어디든 괜찮아요. 위 개념 이해의 폴더 그림을 보고 답해요.

**무엇을:** 아래 세 질문의 답을 적어 봐요.

1. `C:\dev\my-creator-site\index.html`에서 `images\profile.svg`로 가는 `src`는?
2. `C:\dev\hello\pages\back.html`에서 `C:\dev\hello\hello.html`로 가는 `href`는?
3. `C:\dev\hello\pages\back.html`에서 `C:\dev\hello\favorites.html`로 가는 `href`는?

**답:**

1. `images/profile.svg` (같은 폴더 안의 `images` 폴더를 지나가요)
2. `../hello.html` (한 칸 위로 올라가면 `C:\dev\hello`)
3. `../favorites.html`

:::success
세 답을 적었어요. 틀렸다면 개념 이해의 두 번째 그림에서 `../`를 한 번 쓸 때마다 폴더가 한 칸씩 위로 올라가는 것을 다시 따라가 봐요.
:::

## ✍️ 과제

### 과제 1 · 소개 페이지에 그림 넣기 (쉬움 ⭐, 8분)

`about.html`의 `<h1>달빛곰을 소개해요</h1>` 줄 바로 아래에 오늘 쓴 것과 같은 `img` 한 줄을 넣어요. 저장하고 미리 보기로 확인해요.

힌트: `about.html`도 `index.html`과 같은 폴더에 있어서 `src` 경로가 똑같아요.

### 과제 2 · `back.html`로 `../` 연습하기 (보통 ⭐⭐, 14분)

연습 폴더에 `pages` 폴더를 만들고, 그 안의 `back.html`에서 링크 두 개와 곰 그림을 넣어요.

- VS Code에서 **파일 → 폴더 열기**로 `C:\dev\hello`를 열어요(또는 **파일 → 최근 항목 열기**).
- 탐색기에서 `HELLO` 줄의 **새 폴더** 아이콘으로 `pages` 폴더를 만들고, `pages` 줄을 오른쪽 클릭해 **새 파일**로 `back.html`을 만들어요.
- 링크 2개: `hello.html`로 돌아가기, `favorites.html`로 돌아가기(모두 `../`로 시작해요).
- 곰 그림 1개: `my-creator-site`의 `images/profile.svg`를 가져와요. 크기는 120×120이에요.
- 확인은 Live Preview 대신 파일 탐색기에서 `C:\dev\hello\pages\back.html`을 더블클릭해서 해요. 이유는 정답 해설에 있어요.
- 확인이 끝나면 **파일 → 최근 항목 열기**에서 `C:\dev\my-creator-site`를 골라 프로젝트 폴더로 돌아와요. 내일(Day 6)은 이 폴더가 열려 있는 상태에서 시작해요. 탐색기 맨 위가 `MY-CREATOR-SITE`이면 돌아온 거예요.

### 과제 3 · 파일 이름 고르기 (도전 ⭐⭐⭐, 8분)

다음 중 이 교재의 파일 이름 규칙(영어 소문자·숫자·하이픈)에 완전히 맞는 이름은 어느 것일까요? 나머지는 왜 안 되는지 적어 보세요.

- `My Photo.JPG`
- `프로필.png`
- `profile-2026.png`
- `thumb_game.svg`

## ✅ 정답

:::answer 과제 1 정답 · 소개 페이지 그림
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
  <img src="images/profile.svg" alt="헤드셋을 쓴 곰 캐릭터, 달빛곰" width="240" height="240">
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
**왜 이렇게 하나요?** `about.html`과 `index.html`은 같은 폴더에 있어요. 상대 경로는 "이 파일이 있는 폴더"가 기준이라서 두 파일의 `src`가 똑같아도 같은 그림을 가리켜요.
:::

:::answer 과제 2 정답 · back.html
📄 C:\dev\hello\pages\back.html
```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <title>경로 연습</title>
</head>
<body>
  <h1>경로 연습</h1>
  <p>이 파일은 pages 폴더 안에 있어요.</p>
  <ul>
    <li><a href="../hello.html">내 자기소개로 돌아가기</a></li>
    <li><a href="../favorites.html">내가 좋아하는 것으로 돌아가기</a></li>
  </ul>
  <img src="../../my-creator-site/images/profile.svg" alt="헤드셋을 쓴 곰 캐릭터, 달빛곰" width="120" height="120">
</body>
</html>
```
**왜 이렇게 하나요?**

- `back.html`은 `C:\dev\hello\pages`에 있어요. `../hello.html`은 한 칸 위(`C:\dev\hello`)의 `hello.html`이에요.
- 곰 그림은 `../../`로 두 칸 올라가 `C:\dev`에서 `my-creator-site\images\profile.svg`로 내려가요.
- Live Preview는 지금 열어 둔 폴더(`C:\dev\hello`) 안의 파일만 보내 줄 수 있어요. 그 바깥 `my-creator-site`는 서버가 보내 줄 수 없어서, 미리 보기 창에서는 곰 그림이 깨져 보여요. 더블클릭(`file://`)하면 브라우저가 내 컴퓨터의 파일을 직접 읽어서 보여요.
:::

:::answer 과제 3 정답 · 파일 이름 고르기
**`profile-2026.png`만 완전히 맞아요.**

- `My Photo.JPG`: 대문자와 공백이 있어요. 서버에서 대소문자가 달라 열리지 않을 수 있고, 주소에서 공백이 `%20`으로 바뀌어요.
- `프로필.png`: 한글이에요. 주소에서 긴 기호로 바뀌어요.
- `thumb_game.svg`: 밑줄(`_`)은 동작하지만 이 교재는 하이픈(`-`)으로 통일해요. `thumb-game.svg`로 써요.
:::

:::answer 오늘 끝 상태 전체 코드
오늘 따라하기와 과제를 모두 끝내면 아래 상태가 돼요. 막혔다면 이 폴더와 파일을 그대로 만들고 코드를 붙여 넣어 저장하세요. 그러면 Day 6을 바로 시작할 수 있어요.

```text
C:\dev\
├─ hello\
│  ├─ hello.html
│  ├─ favorites.html
│  ├─ tools.html
│  ├─ links.html
│  └─ pages\
│     └─ back.html
└─ my-creator-site\
   ├─ index.html
   ├─ about.html
   ├─ contents.html
   ├─ schedule.html
   ├─ contact.html
   └─ images\
      └─ profile.svg
```

오늘 새로 만든 파일은 `images\profile.svg`와 `pages\back.html`이고, `index.html`과 `about.html`에는 그림을 더했어요.

📄 C:\dev\my-creator-site\images\profile.svg
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240">
  <rect width="240" height="240" fill="#ddd9ff"/>
  <!-- 귀 -->
  <circle cx="64" cy="64" r="28" fill="#8a6a4b"/>
  <circle cx="176" cy="64" r="28" fill="#8a6a4b"/>
  <circle cx="64" cy="64" r="14" fill="#e9c9a8"/>
  <circle cx="176" cy="64" r="14" fill="#e9c9a8"/>
  <!-- 얼굴 -->
  <circle cx="120" cy="124" r="78" fill="#a47c57"/>
  <ellipse cx="120" cy="148" rx="38" ry="30" fill="#e9c9a8"/>
  <!-- 눈, 코, 입 -->
  <circle cx="92" cy="110" r="8" fill="#2b2140"/>
  <circle cx="148" cy="110" r="8" fill="#2b2140"/>
  <ellipse cx="120" cy="138" rx="12" ry="9" fill="#2b2140"/>
  <path d="M104 156Q120 170 136 156" fill="none" stroke="#2b2140" stroke-width="5" stroke-linecap="round"/>
  <!-- 헤드셋 -->
  <path d="M44 120A76 76 0 0 1 196 120" fill="none" stroke="#5b4bdb" stroke-width="10" stroke-linecap="round"/>
  <rect x="34" y="112" width="20" height="40" rx="8" fill="#5b4bdb"/>
  <rect x="186" y="112" width="20" height="40" rx="8" fill="#5b4bdb"/>
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
  <ul>
    <li><a href="index.html">홈</a></li>
    <li><a href="about.html">소개</a></li>
    <li><a href="contents.html">영상</a></li>
    <li><a href="schedule.html">방송 일정</a></li>
    <li><a href="contact.html">문의</a></li>
  </ul>
  <!-- 홈 페이지: 인사와 방송 소개 -->
  <img src="images/profile.svg" alt="헤드셋을 쓴 곰 캐릭터, 달빛곰" width="240" height="240">
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
  <img src="images/profile.svg" alt="헤드셋을 쓴 곰 캐릭터, 달빛곰" width="240" height="240">
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
📄 C:\dev\hello\pages\back.html
```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <title>경로 연습</title>
</head>
<body>
  <h1>경로 연습</h1>
  <p>이 파일은 pages 폴더 안에 있어요.</p>
  <ul>
    <li><a href="../hello.html">내 자기소개로 돌아가기</a></li>
    <li><a href="../favorites.html">내가 좋아하는 것으로 돌아가기</a></li>
  </ul>
  <img src="../../my-creator-site/images/profile.svg" alt="헤드셋을 쓴 곰 캐릭터, 달빛곰" width="120" height="120">
</body>
</html>
```
`contents.html`, `schedule.html`, `contact.html`은 어제와 같아요.
:::

## 🧯 자주 막히는 곳

모든 문제와 드문 경우는 [문제 해결 모음](#/page/troubleshooting)에 있어요.

### 그림이 깨져서 나와요 (작은 깨진 그림 아이콘과 alt 글자만 보여요)

**원인:** 브라우저가 `src`가 가리키는 곳에서 그림 파일을 찾지 못했어요. 원인은 대부분 여섯 가지예요. ① `src` 철자 오타. ② `images` 폴더를 `my-creator-site`가 아니라 `C:\dev\hello`에 만들었어요. ③ `profile.svg`가 `images` 폴더 밖에 있어요. ④ 파일 이름의 대소문자가 달라요(`Profile.svg`, `profile.SVG`). ⑤ 확장자가 `.svg`가 아니라 `.svg.txt`예요. ⑥ `src`에 `C:\dev\…`처럼 내 컴퓨터의 전체 경로를 썼어요(인터넷 주소에는 `\`를 쓸 수 없고, 올린 뒤에는 다른 컴퓨터에 그 경로가 없어요). 대소문자가 다른 경우는 내 컴퓨터에서 열려도 인터넷에 올린 뒤에 깨져요.

**해결:**

1. VS Code 탐색기 맨 위가 `MY-CREATOR-SITE`인지, 그 아래에 `images` 폴더와 `profile.svg`가 있는지 확인해요. 없으면 위치를 고쳐요(파일을 드래그해서 옮겨도 돼요).
2. `src="images/profile.svg"`와 파일 이름을 한 글자씩 비교해요. 대문자가 있으면 `F2`로 소문자로 바꿔요.
3. 파일 이름이 `profile.svg.txt`처럼 보이면 `F2`로 `.txt`를 지워요. `src`가 `C:\`로 시작하면 지우고 `images/profile.svg`로 써요.
4. 저장하고 새로 고침해요. 곰 그림이 보이면 해결된 거예요.

### profile.svg 코드를 넣었는데 그림 대신 글자(코드)가 보여요

**원인:** 코드를 담은 파일을 브라우저가 그림이 아니라 글자 파일로 읽고 있어요. 파일 이름이 `profile.svg.html`이나 `profile.txt`이거나, 코드를 `<img>`가 아니라 HTML 본문에 그대로 붙여 넣었을 때 생겨요. SVG 코드는 `images\profile.svg` 파일에 넣고 `img`의 `src`로 불러야 해요.

**해결:**

1. 탐색기에서 파일 이름이 정확히 `profile.svg`인지 확인해요. 다르면 `F2`로 고쳐요.
2. SVG 코드가 `index.html` 안에 들어가 있지 않은지 확인해요. 들어가 있으면 그 줄들을 지워요.
3. `index.html`에 `<img src="images/profile.svg" alt="헤드셋을 쓴 곰 캐릭터, 달빛곰" width="240" height="240">`이 한 줄 있는지 확인해요.
4. 저장하고 새로 고침해요. 곰 그림이 보이면 해결된 거예요.

### svg 파일을 더블클릭했더니 다른 앱이 열려요

**원인:** 이상한 일이 아니에요. Windows가 `.svg` 파일을 열어 주는 앱이 설치된 환경마다 달라요. 이미지 편집기나 브라우저가 열릴 수 있어요. 이 교재에서는 SVG를 더블클릭해서 보지 않고 `img`로 불러서 봐요.

**해결:**

1. 그대로 닫아요. 파일은 바뀌지 않아요.
2. VS Code 탐색기에서 `profile.svg`를 클릭하면 코드를 볼 수 있고, `index.html`을 미리 보기하면 그림으로 볼 수 있어요.
3. 곰 그림이 미리 보기에 보이면 문제없어요.

### 그림이 너무 크거나, 그림이 늦게 뜰 때 글이 아래로 밀려요 (width·height 빠짐)

**원인:** `img`에 `width`와 `height`를 쓰지 않으면 브라우저가 그림 파일을 받아 크기를 알 때까지 자리를 잡지 못하고, 그림 원래 크기대로 보여 줘요. 사진은 수천 px라서 화면을 가득 채우기도 하고, 늦게 뜨는 그림 때문에 아래 글이 갑자기 밀려 내려가요. Day 10에서 CSS로 크기를 정해요.

**해결:**

1. `<img …>` 줄에 `width="240" height="240"`이 있는지 확인해요. 속성은 빈칸으로 나눠요.
2. 빠졌으면 교재 코드의 줄과 똑같이 넣어요: `<img src="images/profile.svg" alt="헤드셋을 쓴 곰 캐릭터, 달빛곰" width="240" height="240">`.
3. 내 사진을 쓸 때는 원하는 크기(예: `width="240"`)를 정해 넣어요. 가로와 세로의 비율을 맞춰야 안 찌그러져요.
4. 저장하고 새로 고침해요. 그림이 정한 크기로 보이면 해결된 거예요.

### ../ 개수를 세다가 틀렸어요

**원인:** `../`는 한 번 쓸 때마다 폴더가 한 칸씩 위로 올라가요. 올라가는 칸 수를 하나 틀리면 엉뚱한 폴더를 가리켜요. 기준은 "지금 이 HTML 파일이 있는 폴더"예요.

**해결:**

1. 지금 파일이 있는 폴더를 쓰고(`C:\dev\hello\pages`), 가려는 파일이 있는 폴더(`C:\dev\my-creator-site\images`)를 써요.
2. 두 폴더의 공통 폴더(`C:\dev`)까지 몇 칸 올라가야 하는지 세요. 이 예에서는 `pages` → `hello` → `dev`, 두 칸이에요. 그래서 `../../`예요.
3. 공통 폴더에서 목표 파일까지 내려가는 이름을 이어 써요: `../../my-creator-site/images/profile.svg`.
4. 저장하고 더블클릭으로 열어요. 그림이 보이면 해결된 거예요.

### 휴대폰 사진이 브라우저에서 안 보여요 (.heic)

**원인:** 일부 휴대폰은 사진을 `.heic` 형식으로 저장해요. 많은 브라우저가 이 형식을 보여 주지 못해서, 파일이 있어도 깨진 그림이 나와요.

**해결:**

1. 휴대폰 카메라 설정에서 형식을 "호환성 우선"(JPG)으로 바꾸고 다시 찍거나, 변환 앱이나 사진 앱의 내보내기에서 `.jpg`로 저장해요. 메뉴 이름은 휴대폰마다 달라요.
2. 파일 이름을 영어 소문자로 정하고 `images` 폴더에 넣어요(예: `profile.jpg`).
3. `src`를 `images/profile.jpg`로 바꾸고 저장해 확인해요. 사진이 보이면 해결된 거예요.
## 📝 오늘의 체크리스트

- [ ] 탐색기에 `images` 폴더가 있고 안에 `profile.svg`가 있어요(파일 이름 뒤에 `.txt`가 없어요).
- [ ] 홈 페이지와 소개 페이지에 곰 그림(240×240)이 보여요.
- [ ] `src`를 일부러 틀렸을 때 깨진 그림과 `alt` 글자가 보이는 것을 확인했어요.
- [ ] `alt`를 쓰는 요령(짧게, "이미지"라는 말은 빼기)을 말할 수 있어요.
- [ ] `back.html`에서 링크 2개와 작은 곰 그림이 보여요.
- [ ] `../`를 한 번 쓸 때마다 한 칸 위 폴더로 올라간다는 것을 설명할 수 있어요.
- [ ] 파일 이름에 대문자·공백·한글을 쓰지 않는 이유를 말할 수 있어요.
- [ ] 과제 1~3을 했고, 과제 2 뒤에 VS Code에서 `C:\dev\my-creator-site` 폴더를 다시 열어 두었어요.

## 📚 더 알아보기

- [MDN · img 요소](https://developer.mozilla.org/ko/docs/Web/HTML/Reference/Elements/img): `src`, `alt`, `width`, `height` 같은 속성을 자세히 설명해요.
- [MDN · 이미지 파일 형식 안내(영어)](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types): 이미지 형식별 특징과 고르는 기준을 알려 줘요.
- [MDN · 대체 텍스트 이해하기](https://developer.mozilla.org/ko/docs/Learn_web_development/Core/Accessibility/HTML): 접근성을 위한 HTML 습관을 설명해요.

➡️ **다음 Day 예고:** [Day 6 · 시맨틱 구조](#/day/p1-d06)에서는 페이지를 `header`·`main`·`footer`로 나누고, 로고를 만들고, 브라우저의 개발자 도구로 페이지의 속을 들여다봐요.
