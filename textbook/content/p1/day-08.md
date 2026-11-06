## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- 줄과 칸이 있는 자료를 `table`로 만들 수 있어요.
- `label`과 `input`을 연결해 문의 폼을 만들고, 입력 칸의 종류(`type`)를 고를 수 있어요.
- YouTube 영상을 `iframe`으로 페이지에 넣고, 영상 ID를 내 영상으로 바꿀 수 있어요.
- 하루 작업을 소스 제어 패널로 커밋하고 GitHub에 올릴 수 있어요.

**예상 시간: 100분** (개념 이해 15분 · 따라하기 55분 · 과제 25분 · 정리 5분)

:::path 📂 시작 상태
어제(Day 7)까지 만든 것이 이렇게 있어야 해요. 없거나 다르면 [Day 7](#/day/p1-d07)의 "오늘 끝 상태 전체 코드"로 맞춰 주세요.

- `C:\dev\my-creator-site\index.html`, `about.html`, `contents.html`, `schedule.html`, `contact.html`
- `C:\dev\my-creator-site\images\profile.svg`, `C:\dev\my-creator-site\images\logo.svg`
- `C:\dev\hello\hello.html`, `favorites.html`, `tools.html`, `links.html`, `pages\back.html`
- Git이 설치되어 있어요. 확인 명령 `git --version`의 예상 출력은 `git version 2.56.0.windows.4`예요(숫자는 달라도 돼요).
- GitHub 계정과 공개(Public) 저장소 `https://github.com/내아이디/my-creator-site`가 있고, `C:\dev\my-creator-site`와 연결되어 있어요.
- 어제까지의 변경이 모두 커밋·푸시되어 있어요. VS Code 소스 제어 패널에 바뀐 파일이 없어요.
- VS Code에서 `C:\dev\my-creator-site` 폴더가 열려 있어요.
- 오늘 마지막 단계는 **인터넷 연결**이 필요해요(GitHub에 올리기).
:::

## 📖 개념 이해

### 표: 시간표 같은 자료

**비유부터 볼게요.** 학교 시간표처럼 요일(줄)과 교시(칸)로 정리된 자료는 표로 보여야 이해하기 쉬워요. 글만 줄줄이 쓰면 비교하기 힘들죠.

**정확한 정의는 이래요.** **[[표]]**(table)는 줄(행)과 칸(열)으로 자료를 정리하는 HTML 요소예요. 방송 일정처럼 줄과 칸이 있는 자료에만 써요. 화면 배치를 맞추려고 쓰면 안 돼요. 표의 부품은 이래요.

- `table`: 표 전체예요.
- `caption`: 표의 제목이에요.
- `thead`: 머리 부분(제목 줄)이고, `tbody`는 몸통(내용 줄)이에요.
- `tr`: 줄 하나(table row)예요.
- `th`: 머리글 칸이에요. `td`는 내용 칸이에요.
- `scope="col"`은 이 `th`가 아래 **열**의 제목이라는 표시이고, `scope="row"`는 오른쪽 **줄**의 제목이라는 표시예요. 스크린 리더가 칸을 읽을 때 "요일, 월요일, 시작 시간, 20:00"처럼 제목을 함께 알려 줘요.

표에 테두리를 그리는 건 CSS의 일이라서 Day 10에서 해요. 오늘은 테두리 없이 칸이 정렬되어 보이는 것으로 충분해요.

### 폼: 종이 신청서

**비유:** 동아리 가입 신청서에는 이름 칸, 연락처 칸, 고르는 칸, 보내는 곳이 있어요. 웹의 폼도 같아요.

**정의:** **[[폼]]**(form)은 사용자가 글자를 입력하거나 고른 값을 모아 보내는 HTML 요소 `form`이에요. 안에 입력 칸을 넣어요. 값을 받아서 처리하려면 서버가 필요해서, P1에서는 칸을 만들고 검사하는 데까지만 하고 실제 전송은 P2에서 해요.

- `input`: 한 줄 입력 칸이에요. `type="text"`는 글자, `type="email"`은 이메일 주소를 받아요. 닫는 태그가 없어요.
- `name`: 값을 보낼 때 붙는 이름표예요(`name="email"`이면 `email=내가쓴값`으로 보내요).
- `autocomplete`: 브라우저가 이름·이메일을 자동으로 채워 줄 때 쓰는 힌트예요.
- `select`와 `option`: 목록에서 하나를 고르는 상자예요. `option`의 `value`가 실제로 보내는 값이에요.
- `textarea`: 여러 줄 입력 칸이에요. `rows`는 처음 보이는 줄 수예요.
- `button type="submit"`: 누르면 폼을 보내는 버튼이에요.

### 레이블: 입력 칸의 이름표

**[[레이블]]**(label)은 입력 칸에 붙이는 이름표 요소 `label`이에요. `<label for="name">`의 `for` 값과 `<input id="name">`의 `id` 값이 같으면 둘이 연결돼요. 연결되면 두 가지가 좋아져요.

- 글자 "이름"을 눌러도 입력 칸에 커서가 들어가요. 누를 곳이 넓어져요.
- 스크린 리더가 칸을 읽을 때 이름표를 함께 읽어 줘요.

입력 칸마다 레이블을 하나씩 달아요. 칸 안의 안내 글자(placeholder)로만 이름을 알리지 않아요.

### iframe과 임베드: 창문을 통해 보기

**비유:** 우리 집 벽에 다른 가게의 쇼윈도를 끼워 넣은 것 같아요. 물건은 그 가게에 있고, 우리는 창문만 빌려서 보여 줘요.

**정의:** **[[iframe]]**(아이프레임)은 웹페이지 안에 다른 웹페이지를 창처럼 끼워 넣는 HTML 요소예요. 이름은 inline frame에서 왔어요. **[[임베드]]**(embed)는 다른 서비스의 콘텐츠(영상, 지도)를 내 페이지 안에 넣어 보여 주는 것이에요. YouTube 영상 파일은 YouTube 서버에 그대로 있고, 내 페이지는 창만 빌려요. 접근성을 위해 `title` 속성에 무엇을 담았는지 적어요.

## 🛠️ 따라하기

모두 6단계예요. VS Code에서 `C:\dev\my-creator-site` 폴더를 열어 둔 상태에서 시작해요.

### 1단계 · 방송 일정표 만들기 (12분)

**어디서:** VS Code `schedule.html` 편집기

**무엇을:**

1. 탐색기에서 `schedule.html`을 클릭해 열어요.
2. `Ctrl + A`로 전체를 선택해요.
3. 아래 코드를 복사해서 붙여 넣어요. 어제의 코드에서 `<p>` 한 줄이 바뀌었고, `<table>`이 추가되었어요. 표 안의 글(요일, 시간, 방송 내용)은 내 방송에 맞게 바꿔도 돼요.
4. `Ctrl + S`로 저장하고 미리 보기를 확인해요.

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

  <footer>
    <p>&copy; 2026 달빛곰 방송국 · 연습용으로 만든 사이트예요.</p>
  </footer>
</body>
</html>
```
표의 구조를 짚어 봐요.

- `<caption>`: 표 제목 "주간 방송 일정".
- `<thead>`의 `<tr>` 하나: 머리글 칸 `th` 셋(요일, 시작 시간, 방송 내용). `scope="col"`이에요.
- `<tbody>`의 `<tr>` 일곱 개: 월요일부터 일요일까지. 각 줄은 첫 칸이 `<th scope="row">`(요일)이고 뒤에 `<td>` 둘이에요.
- 방송이 없는 날은 시작 시간을 `-`로, 내용을 `휴방`으로 썼어요.
- `<p>모든 시간은 한국 시간이에요.</p>`는 표 위의 안내 문장이에요.

:::success
미리 보기에 "방송 일정" 제목, "모든 시간은 한국 시간이에요." 문장, "주간 방송 일정" 표 제목, 그 아래 3열(요일, 시작 시간, 방송 내용) 7줄 표가 보여요. 표에 테두리가 없고 글자만 칸에 맞춰 정렬되어 있어요. 이건 정상이에요. 줄의 칸 수가 어긋났다면 아래 🧯 자주 막히는 곳의 "표의 칸이 어긋나거나 한 줄로 이어져요"를 보세요.
:::

### 2단계 · 문의 폼 만들기 (14분)

**어디서:** VS Code `contact.html` 편집기

**무엇을:** 1단계와 같은 방법으로 `Ctrl + A` 후 아래 코드를 붙여 넣고 `Ctrl + S`로 저장해요. 칸마다 `<div>`로 감싼 것은 레이블과 입력 칸을 한 묶음으로 보이게 하려는 거예요. 모양은 Day 10 이후 CSS에서 꾸며요.

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

  <footer>
    <p>&copy; 2026 달빛곰 방송국 · 연습용으로 만든 사이트예요.</p>
  </footer>
</body>
</html>
```
폼의 구조를 짚어 봐요.

- 입력 칸이 다섯 개(이름, 이메일, 채팅 닉네임, 문의 종류, 내용)이고, 칸마다 `<label for="…">`와 `<input id="…">`가 짝이에요. `for`와 `id` 값이 같아야 해요.
- 이름 칸은 `type="text"`, 이메일 칸은 `type="email"`이에요.
- `채팅 닉네임 (선택)`은 안 써도 되는 칸이에요.
- `select`에 `option`이 셋이고, `value`는 영어(`general`, `collab`, `request`), 화면 글은 한국어예요.
- 맨 아래 `<button type="submit">보내기</button>`이 폼을 보내는 버튼이에요.

:::success
미리 보기에 "문의하기" 제목, 안내 문장, 이름·이메일·채팅 닉네임 (선택)·문의 종류·내용 칸과 "보내기" 버튼이 세로로 차례로 보여요. 문의 종류에는 "일반 문의"가 처음 선택되어 있어요. 칸의 모양이 단순한 건 정상이에요.
:::

### 3단계 · 폼이 어떻게 움직이는지 확인하기 (8분)

**어디서:** Live Preview 미리 보기 창(또는 `contact.html`을 더블클릭해서 연 브라우저)

**무엇을:**

1. 글자 `이름`을 마우스로 클릭해요.
2. 이메일 칸에 `abc`를 입력하고 **보내기**를 눌러요.
3. 이메일 칸을 `abc@example.com`으로 고치고 이름 칸에 `달빛곰`을 입력한 뒤 **보내기**를 눌러요.

:::success
1번에서 입력 칸(이름)에 커서가 들어가요. 레이블과 입력 칸이 연결되어 있다는 증거예요. 2번에서는 이메일 칸 근처에 브라우저의 안내 말풍선(예: "'@'를 포함해 주세요" 같은 글)이 나오고 페이지가 넘어가지 않아요. 문구는 브라우저에 따라 달라요. 3번에서는 페이지가 새로 불려 오고, 주소 끝에 `?name=…&email=…`처럼 입력한 값이 붙고(한글은 `%EB…` 같은 기호로 보일 수 있어요), 칸이 모두 비워져요. 연습용이라 실제로 전송되지 않는 것이 정상이에요. 칸이 비워지고 주소가 바뀌었다면 폼이 잘 동작한 거예요. Day 24에서 이 동작을 막고 검사해요.
:::

### 4단계 · 대표 영상 `iframe` 넣기 (8분)

**어디서:** VS Code `index.html` 편집기

**무엇을:**

1. 탐색기에서 `index.html`을 클릭해 열어요.
2. 맨 아래쪽 `</main>` 줄을 찾아요.
3. `</main>` 줄 바로 앞(마지막 `</section>` 줄 다음)에 새 줄을 만들고 아래 코드를 붙여 넣어요.
4. `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\index.html (일부)
```html
    <section>
      <h2>대표 영상</h2>
      <!-- YouTube 공유 → 퍼가기에서 복사한 iframe이에요 -->
      <iframe src="https://www.youtube.com/embed/aqz-KE-bpKQ" title="달빛곰 대표 영상 (예시 영상이에요)" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    </section>
```

붙여 넣은 줄의 들여쓰기가 조금 달라도 화면은 같아요.

- `src`: 영상 주소예요. `embed/` 뒤의 `aqz-KE-bpKQ`가 영상 ID예요.
- `title`: 이 창에 무엇이 들어 있는지 알리는 글이에요.
- `referrerpolicy`: 영상을 불러올 때 내 페이지 주소를 어디까지 알려 줄지 정해요. YouTube가 퍼가기 코드에 넣어 주는 값 그대로예요.
- `allowfullscreen`: 전체 화면 보기를 허락해요.

:::success
홈 페이지 맨 아래에 "대표 영상" 제목과 영상 창이 보여요. 창 안에 영상 재생 화면이 나오면 좋고, 영상 대신 회색이나 검은 창, 또는 오류 문구가 보여도 괜찮아요. 재생 여부는 컴퓨터와 네트워크 환경에 따라 달라요. 다음 단계에서 이유를 알아봐요.
:::

### 5단계 · 내 영상으로 바꾸는 법 익히기 (5분)

이 영상은 **예시**예요. 내 영상 ID로 바꾸는 법을 알아 둬요.

**어디서:** 브라우저에서 YouTube

**무엇을:**

1. 내 YouTube 영상을 열어요. 주소 표시줄의 `watch?v=` 뒤 11글자가 영상 ID예요. 예: `https://www.youtube.com/watch?v=aqz-KE-bpKQ`에서 `aqz-KE-bpKQ`.
2. 영상 아래 **공유** → **퍼가기**(Embed)를 클릭하면 `<iframe …>` 코드가 나와요. 그 코드의 `src="https://www.youtube.com/embed/…"` 뒤 11글자가 ID예요.
3. `index.html`의 `embed/` 뒤 `aqz-KE-bpKQ`만 내 ID로 바꾸고 저장해요. 나머지는 그대로 둬요.

퍼가기 코드에는 `width`, `height`, `frameborder`, `allow` 같은 속성이 더 들어 있어요. 이 교재는 꼭 필요한 `src`, `title`, `referrerpolicy`, `allowfullscreen`만 남겼어요. 퍼가기 코드를 통째로 붙여도 동작해요. 교재 코드와 달라도 괜찮아요.

:::info 알아두기
- 파일을 더블클릭해서 연 페이지(`file://`)에서는 YouTube 임베드가 재생되지 않을 수 있어요. Live Preview(`http://127.0.0.1:…`)에서 먼저 확인하고, 그래도 안 되면 Day 14에서 만들 배포 주소에서 확인해요. 이 환경에서는 직접 확인하지 못했어요.
- 영상 주인이 퍼가기를 막아 둔 영상은 어디서도 재생되지 않아요.
- 영상 ID와 대표 영상은 예시예요. 내 영상이 없으면 예시 그대로 둬도 돼요.
:::

:::success
`embed/` 뒤가 내 영상 ID(또는 예시 ID)이고, `<iframe …></iframe>` 줄이 그대로 한 줄이에요. 예시를 그대로 뒀다면 이 단계는 아무것도 바뀌지 않은 것이 정상이에요.
:::

### 6단계 · 오늘 작업 커밋하고 올리기 (8분)

오늘부터 하루의 마지막 단계는 커밋과 푸시예요. 터미널 없이 소스 제어 패널로 해요.

**어디서:** VS Code 왼쪽 활동 막대의 **소스 제어** 아이콘(`Ctrl + Shift + G`)

**무엇을:**

1. **소스 제어** 아이콘을 클릭해요. **변경 사항** 아래에 `contact.html`, `index.html`, `schedule.html`이 `M` 표시와 함께 보여요.
2. 위쪽 메시지 칸을 클릭하고 `Day 8: 일정표, 문의 폼, 대표 영상`을 입력해요.
3. **커밋** 버튼을 클릭해요. "스테이징된 변경 사항이 없습니다. 모든 변경 사항을 커밋할까요?" 같은 창이 뜨면 **예**를 클릭해요.
4. 버튼이 **변경 내용 동기화**로 바뀌면 클릭해요.
5. "This action will pull and push commits from and to 'origin/main'." 같은 확인 창(올리고 받아 오겠다는 안내)이 뜨면 **OK**를 클릭해요. 문구는 버전에 따라 달라요.
6. 브라우저에서 GitHub 저장소 페이지를 새로 고침해요.

:::success
소스 제어 패널의 변경 목록이 비어요. GitHub 저장소 페이지에 `Day 8: 일정표, 문의 폼, 대표 영상` 커밋이 보이고, 커밋 수가 하나 늘었어요(어제까지 2개였다면 3개예요). 푸시가 안 되면 아래 🧯 자주 막히는 곳의 "변경 내용 동기화를 처음 눌렀더니 확인 창이 떠요"를 보세요.
:::

## ✍️ 과제

### 과제 1 · `label` 실험 (쉬움 ⭐, 5분)

`contact.html`에서 채팅 닉네임의 `<label for="nickname">`의 `for` 값을 일부러 `nick`으로 바꿔 보세요.

- 저장하고 미리 보기에서 `채팅 닉네임 (선택)` 글자를 클릭해 보세요. 어떻게 되나요?
- 결과를 한 문장으로 적고, `nick`을 다시 `nickname`으로 되돌려 저장해요.

### 과제 2 · 공부 계획 표 `plan.html` (보통 ⭐⭐, 12분)

연습 폴더에 "내 공부 계획" 표를 만들어요.

- **파일 → 폴더 열기**로 `C:\dev\hello`를 열어요.
- 새 파일 `plan.html`을 만들고, 탭 제목과 큰 제목은 `내 공부 계획`으로 해요.
- 표는 요일, 공부 시간, 할 일의 3열이고 월요일~일요일 7줄이에요. 표 제목(`caption`)은 `이번 주 공부 계획`이에요.
- 각 줄의 첫 칸(요일)은 `th scope="row"`로 써요.
- 확인한 뒤 **파일 → 최근 항목 열기**로 `C:\dev\my-creator-site`로 돌아와요.

### 과제 3 · 대표 영상을 내 영상으로 (도전 ⭐⭐⭐, 8분)

내 YouTube 영상이 있다면 5단계처럼 `index.html`의 영상 ID를 내 영상으로 바꿔 보세요. 영상이 없다면 아래 질문에만 답해요.

- 영상 ID는 `src` 주소의 어느 부분인가요?
- 퍼가기를 막은 영상을 넣으면 어떻게 되나요?

## ✅ 정답

:::answer 과제 1 정답 · label 실험
**`for`와 `id`가 같지 않으면 글자를 눌러도 입력 칸에 커서가 들어가지 않아요.** `nick`은 어떤 `id`와도 맞지 않아서 연결이 끊어져요. 되돌린 뒤에는 글자를 누르면 닉네임 칸에 커서가 들어가요.

**왜 이렇게 하나요?** `label`의 `for`는 연결할 입력 칸의 `id`를 가리키는 속성이에요. 두 값이 한 글자라도 다르면 연결되지 않아요. 이런 오타가 생겨도 화면은 멀쩡해서 눈으로는 잘 안 보여요. 글자를 눌러 보는 것이 가장 빠른 확인 방법이에요.
:::

:::answer 과제 2 정답 · plan.html
📄 C:\dev\hello\plan.html
```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <title>내 공부 계획</title>
</head>
<body>
  <h1>내 공부 계획</h1>
  <table>
    <caption>이번 주 공부 계획</caption>
    <thead>
      <tr>
        <th scope="col">요일</th>
        <th scope="col">공부 시간</th>
        <th scope="col">할 일</th>
      </tr>
    </thead>
    <tbody>
      <tr><th scope="row">월요일</th><td>1시간</td><td>HTML 복습</td></tr>
      <tr><th scope="row">화요일</th><td>1시간</td><td>링크와 경로 연습</td></tr>
      <tr><th scope="row">수요일</th><td>2시간</td><td>표 만들기</td></tr>
      <tr><th scope="row">목요일</th><td>1시간</td><td>폼 만들기</td></tr>
      <tr><th scope="row">금요일</th><td>1시간</td><td>이번 주 복습</td></tr>
      <tr><th scope="row">토요일</th><td>2시간</td><td>내 사이트 다듬기</td></tr>
      <tr><th scope="row">일요일</th><td>-</td><td>쉬는 날</td></tr>
    </tbody>
  </table>
</body>
</html>
```
**왜 이렇게 하나요?** 표는 `table` > `caption`, `thead`/`tbody` > `tr` > `th`/`td` 순서로 겹쳐요. 첫 칸이 줄의 제목이라서 `th scope="row"`를 써요. 내용은 사람마다 달라도 정답이에요.
:::

:::answer 과제 3 정답 · 대표 영상 바꾸기
- 영상 ID는 `src="https://www.youtube.com/embed/aqz-KE-bpKQ"`에서 `embed/` 바로 뒤의 11글자(`aqz-KE-bpKQ`)예요. 내 영상 주소 `watch?v=` 뒤의 11글자로 바꿔요.
- 퍼가기를 막은 영상은 영상 대신 재생할 수 없다는 안내가 보이고 재생되지 않아요. 영상 주인이 허용해야 임베드할 수 있어요.

**왜 이렇게 하나요?** iframe은 창문만 빌리는 거라서, 영상 주인이 창문을 허락하지 않으면 보여 줄 수 없어요. 내 영상이라면 YouTube 스튜디오에서 퍼가기 허용 여부를 확인할 수 있어요.
:::

:::answer 오늘 끝 상태 전체 코드
오늘 따라하기와 과제를 모두 끝내면 아래 상태가 돼요. 막혔다면 이 폴더와 파일을 그대로 만들고 코드를 붙여 넣어 저장하세요. 그러면 Day 9를 바로 시작할 수 있어요.

```text
C:\dev\
├─ hello\
│  ├─ hello.html
│  ├─ favorites.html
│  ├─ tools.html
│  ├─ links.html
│  ├─ plan.html
│  └─ pages\
│     └─ back.html
└─ my-creator-site\
   ├─ index.html
   ├─ about.html
   ├─ contents.html
   ├─ schedule.html
   ├─ contact.html
   └─ images\
      ├─ profile.svg
      └─ logo.svg
```

오늘 바뀐 파일은 `index.html`, `schedule.html`, `contact.html`이에요. `about.html`, `contents.html`과 이미지는 어제와 같아요.

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

    <section>
      <h2>대표 영상</h2>
      <!-- YouTube 공유 → 퍼가기에서 복사한 iframe이에요 -->
      <iframe src="https://www.youtube.com/embed/aqz-KE-bpKQ" title="달빛곰 대표 영상 (예시 영상이에요)" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    </section>
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

  <footer>
    <p>&copy; 2026 달빛곰 방송국 · 연습용으로 만든 사이트예요.</p>
  </footer>
</body>
</html>
```
📄 C:\dev\hello\plan.html
```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <title>내 공부 계획</title>
</head>
<body>
  <h1>내 공부 계획</h1>
  <table>
    <caption>이번 주 공부 계획</caption>
    <thead>
      <tr>
        <th scope="col">요일</th>
        <th scope="col">공부 시간</th>
        <th scope="col">할 일</th>
      </tr>
    </thead>
    <tbody>
      <tr><th scope="row">월요일</th><td>1시간</td><td>HTML 복습</td></tr>
      <tr><th scope="row">화요일</th><td>1시간</td><td>링크와 경로 연습</td></tr>
      <tr><th scope="row">수요일</th><td>2시간</td><td>표 만들기</td></tr>
      <tr><th scope="row">목요일</th><td>1시간</td><td>폼 만들기</td></tr>
      <tr><th scope="row">금요일</th><td>1시간</td><td>이번 주 복습</td></tr>
      <tr><th scope="row">토요일</th><td>2시간</td><td>내 사이트 다듬기</td></tr>
      <tr><th scope="row">일요일</th><td>-</td><td>쉬는 날</td></tr>
    </tbody>
  </table>
</body>
</html>
```
끝 상태 확인: GitHub 저장소 페이지에 `Day 8: …` 커밋이 보여요.
:::

## 🧯 자주 막히는 곳

모든 문제와 드문 경우는 [문제 해결 모음](#/page/troubleshooting)에 있어요.

### YouTube 칸에 오류 문구가 나오거나 영상이 재생되지 않아요

**원인:** 세 가지가 흔해요. ① 파일을 더블클릭해서 연 페이지(`file://`)는 YouTube가 영상을 보여 주는 조건을 못 채울 수 있어요. ② 영상 주인이 퍼가기를 막았어요. ③ 인터넷이 연결되지 않았거나 영상이 삭제되었어요. 오류 문구의 정확한 원문은 이 환경에서 확인하지 못했어요. 문구는 환경에 따라 달라요.

**해결:**

1. 인터넷에 연결되어 있는지 확인해요. 브라우저로 다른 사이트가 열려야 해요.
2. 더블클릭으로 열었다면 VS Code에서 `index.html`을 Live Preview로 열어 다시 확인해요.
3. 그래도 안 되면 YouTube에서 같은 영상을 직접 열어 재생되는지 확인하고, 영상의 **공유 → 퍼가기** 메뉴가 열리는지 봐요. 퍼가기가 막힌 영상이면 다른 영상 ID로 바꿔요.
4. Day 14에서 만들 배포 주소에서도 확인해 볼 수 있어요.
5. 영상이 재생되면 해결된 거예요. 재생이 안 돼도 이후 Day를 따라가는 데는 문제없어요.

### 보내기를 눌렀더니 주소가 바뀌고 입력한 칸이 모두 비워져요

**원인:** 정상이에요. 폼의 `action`(보낼 곳)을 정하지 않으면 브라우저는 같은 페이지로 값을 보내고 페이지를 새로 불러요. 그래서 입력한 값이 주소 끝에 `?name=…&email=…`처럼 붙고 칸이 비워져요. 이 사이트는 연습용이라 실제로 전송하지 않아요. 보내지는 방식은 P2에서 배우고, 이 동작을 막는 것은 Day 24에서 해요.

**해결:**

1. 아무것도 고치지 않아도 돼요.
2. 주소 끝의 `?…`를 지우고 싶으면 주소 표시줄을 지우고 `contact.html` 주소를 다시 열어요.
3. 칸이 다시 비어 있는 폼이 보이면 정상이에요.

### 글자를 눌러도 입력 칸에 커서가 안 들어가요

**원인:** `<label for="…">`의 값과 `<input id="…">`의 값이 달라요. 한 글자만 달라도 연결되지 않아요. `for` 대신 `id`를 쓰거나 `input`에서 `id`를 빠뜨리는 실수도 많아요.

**해결:**

1. 칸마다 `<label for="name">`과 `<input id="name" …>`의 값이 같은지 한 쌍씩 비교해요.
2. 다르면 `input`의 `id`를 `label`의 `for`에 맞춰요(또는 반대로).
3. 저장하고 새로 고침한 뒤, 글자를 눌러 커서가 들어가면 해결된 거예요.

### 표의 칸이 어긋나거나 한 줄로 이어져요

**원인:** 줄을 나누는 `<tr>`을 빠뜨리거나, 줄마다 칸 수(`th`+`td`)가 달라요. `</tr>`을 닫지 않으면 아래 줄이 같은 줄로 합쳐져요.

**해결:**

1. 표 코드의 각 줄이 `<tr>`으로 시작해서 `</tr>`로 끝나는지 확인해요.
2. 본문 일곱 줄 모두 칸이 셋(`th` 하나, `td` 둘)인지 세요.
3. 빠진 곳을 고치고 저장해요.
4. 3열 7줄로 가지런히 보이면 해결된 거예요.

### 변경 내용 동기화를 처음 눌렀더니 확인 창이 떠요

**원인:** **변경 내용 동기화**는 GitHub의 새 기록을 내려받고(pull) 내 커밋을 올리는(push) 일을 함께 해요. 처음 누를 때 VS Code가 그렇게 해도 되냐고 물어요. 문구의 예는 `This action will pull and push commits from and to 'origin/main'.`이에요. 문구는 버전에 따라 달라요(실기 확인은 못 했어요).

**해결:**

1. 창의 **OK**(확인)를 클릭해요. 다음부터 묻지 않으려면 **OK, Don't Show Again** 같은 버튼을 골라요.
2. 로그인 요청 창이 뜨면 Day 7의 방법대로 GitHub 계정으로 로그인해요.
3. 패널의 동기화 표시(숫자 `1↑`)가 사라지고 GitHub 저장소 페이지에 커밋이 보이면 해결된 거예요.

### 커밋 버튼을 눌렀는데 커밋이 안 돼요 (메시지가 비어 있어요)

**원인:** 커밋 메시지 칸이 비어 있으면 VS Code가 커밋하지 않아요. 파일을 저장하지 않아서 변경 목록이 비어 있을 수도 있어요.

**해결:**

1. 소스 제어 패널 위쪽 메시지 칸에 `Day 8: 일정표, 문의 폼, 대표 영상`처럼 메시지를 입력해요.
2. 변경 목록이 비어 있으면 편집기 탭에 ●가 남아 있는지 보고, `Ctrl + S`로 저장해요.
3. 다시 **커밋**을 클릭해요. 변경 목록이 비워지면 해결된 거예요.
## 📝 오늘의 체크리스트

- [ ] 일정 페이지에 "주간 방송 일정" 제목과 3열 7줄 표가 보여요(테두리는 아직 없어요).
- [ ] 문의 페이지의 `이름` 글자를 누르면 이름 칸에 커서가 들어가요.
- [ ] 이메일 칸에 `abc`를 넣고 보내면 안내 말풍선이 나와요.
- [ ] 바른 값을 넣고 보내면 주소 끝에 `?name=…&email=…`이 붙고 칸이 비워져요.
- [ ] 홈 페이지 맨 아래에 "대표 영상" 영상 칸이 있어요(재생 여부는 환경에 따라 달라요).
- [ ] 영상 ID가 `embed/` 뒤 11글자라는 것을 알아요.
- [ ] 소스 제어 패널로 커밋하고 GitHub 저장소 페이지에서 `Day 8: …` 커밋을 확인했어요.
- [ ] 과제 1~3을 했어요.

## 📚 더 알아보기

- [MDN · table 요소(영어)](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/table): 표의 여러 부품을 자세히 설명해요.
- [MDN · 첫 번째 폼 만들기](https://developer.mozilla.org/ko/docs/Learn_web_development/Extensions/Forms/Your_first_form): 폼과 입력 칸을 단계별로 만들어 봐요.
- [YouTube 도움말 · 동영상 퍼가기](https://support.google.com/youtube/answer/171780): 영상을 다른 사이트에 넣는 방법을 설명해요.

➡️ **다음 Day 예고:** [Day 9 · CSS 시작](#/day/p1-d09)에서는 처음으로 CSS 파일을 만들어 다섯 페이지의 글꼴과 색을 한꺼번에 바꿔요.
