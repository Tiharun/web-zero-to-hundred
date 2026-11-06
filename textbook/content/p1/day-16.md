## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- `if` / `else if` / `else`로 조건에 따라 다른 코드를 실행할 수 있어요.
- `===`, `<`, `&&`, `||` 같은 비교·논리 연산자를 콘솔에서 써 보고 결과를 예측할 수 있어요.
- 백틱(`` ` ``)과 `${ }`로 값을 끼워 넣은 문장을 만들 수 있어요.
- 홈 화면에 지금 시각에 맞는 인사말 한 줄이 나오게 만들 수 있어요.

**예상 시간: 90분** (개념 이해 20분 · 따라하기 47분 · 과제 19분 · 정리 4분)

:::path 📂 시작 상태
어제(Day 15)까지 만든 파일이 이렇게 있어야 해요. 없거나 다르면 [Day 15](#/day/p1-d15)의 "오늘 끝 상태 전체 코드"로 맞춰 주세요.

- `C:\dev\my-creator-site\index.html`, `about.html`, `contents.html`, `schedule.html`, `contact.html` (모두 `<head>`에 `<script src="js/main.js" defer></script>`가 있어요)
- `C:\dev\my-creator-site\css\style.css`
- `C:\dev\my-creator-site\js\main.js` (`console.log('main.js가 연결됐어요!');` 한 줄만 있어요)
- `C:\dev\my-creator-site\images\` 안에 `profile.svg`, `logo.svg`, `thumb-game.svg`, `thumb-talk.svg`, `thumb-music.svg`
- GitHub Pages가 켜져 있어요: `https://<내 아이디>.github.io/my-creator-site/`
- VS Code에서 `C:\dev\my-creator-site` 폴더가 열려 있고, Live Preview 확장 프로그램이 설치되어 있어요.
- 어제 변경은 모두 커밋·푸시했어요(소스 제어 패널의 변경 0개).
:::

## 📖 개념 이해

### 조건에 따라 다르게: if

**비유:** 신호등을 떠올려 보세요. 초록불이면 건너고, 아니면 멈춰요. "만약 ~라면 이렇게 하고, 아니면 저렇게 해요"라는 갈림길이 조건문이에요.

**정확한 정의:** **[[조건문]]**(conditional)은 조건이 참인지 거짓인지에 따라 다른 코드를 실행하게 하는 문법이에요. 위에서부터 차례로 검사해서 **처음으로 참인 블록 하나만** 실행해요.

```js
const hour = 20;

if (hour < 12) {
  console.log('오전이에요');
} else if (hour < 18) {
  console.log('오후예요');
} else {
  console.log('저녁이에요');
}
```

- `if (조건) { … }`: 조건이 참이면 중괄호 `{ }` 안(**블록**)을 실행해요.
- `else if (다른 조건) { … }`: 앞 조건이 거짓일 때 이 조건을 검사해요. 여러 개 이어 쓸 수 있어요.
- `else { … }`: 위의 조건이 모두 거짓일 때 실행해요.

### 비교하기: 비교 연산자

조건에는 참(`true`)이나 거짓(`false`)이 나오는 식을 써요. 값을 비교하는 기호를 **[[비교 연산자]]**(comparison operator)라고 해요. 비교 연산자가 그런 식을 만들어요.

| 연산자 | 뜻 | 예 |
|---|---|---|
| `===` | 같다 | `hour === 6` |
| `!==` | 다르다 | `hour !== 6` |
| `<`, `<=` | 작다, 작거나 같다 | `hour < 12` |
| `>`, `>=` | 크다, 크거나 같다 | `hour >= 18` |

여기서 가장 많이 틀리는 것이 `=`와 `===`예요. `=`는 어제 배운 대로 값을 **넣어요**(`hour = 6`은 상자에 6을 넣어요). `===`는 값이 **같은지 물어요**(`hour === 6`은 참/거짓을 돌려줘요). `==`라는 비슷한 연산자도 있지만, 종류가 다른 값을 멋대로 바꿔서 비교해서 이 교재는 `===`만 써요.

### 여러 조건 묶기: 논리 연산자

**[[논리 연산자]]**(logical operator)는 여러 조건을 묶거나 뒤집는 기호예요.

- `&&`(그리고): 둘 다 참일 때 참. `hour >= 20 && hour < 22`는 "20시 이상이고 22시 미만".
- `||`(또는): 하나라도 참이면 참.
- `!`(아니다): 참과 거짓을 뒤집어요.

조건 자리에 비교 없이 값만 써도 돼요. `if (greeting)`처럼요. 이때 JavaScript는 값을 참/거짓으로 읽는데, `null`, `undefined`, 빈 문자열 `''`, 숫자 `0`은 **거짓**, 그 밖은 대부분 **참**이에요. 오늘 "요소가 있으면 실행"하는 데 써요.

### 문장에 값 끼워 넣기: 템플릿 리터럴

어제는 `'달빛곰은 일주일에 ' + days + '번 방송해요'`처럼 `+`로 이어 붙였어요. 이어 붙일 곳이 많아지면 읽기 힘들어요.

**[[템플릿 리터럴]]**(template literal)은 백틱(`` ` ``)으로 감싸고 안에 `${ }`로 값을 끼워 넣는 문자열이에요.

```js
const days = 4;
const text = `일주일에 ${days}번 방송해요`;
```

백틱은 키보드에서 숫자 `1`의 왼쪽 키예요(키보드 배열에 따라 달라요). **영어 입력 상태**에서 쳐요. 한글 상태에서는 다른 글자가 나올 수 있어요. 작은따옴표 `'`와 모양이 비슷하지만 다른 글자라서, 작은따옴표로 감싸면 `${days}`가 계산되지 않고 글자 그대로 나와요.

짧은 if/else는 한 줄로 쓸 수 있어요. **[[삼항 연산자]]**(ternary operator)는 `조건 ? 참일 때 값 : 거짓일 때 값` 모양이에요. `hour < 12 ? '오전' : '오후'`는 12시 전이면 `'오전'`, 아니면 `'오후'`가 돼요. Day 22와 Day 26에서 다시 만나요.

### 지금 몇 시? Date

**[[Date]]**(데이트)는 날짜와 시각을 다루는 JavaScript 기능이에요. `new Date()`는 **지금 시각**을 담은 값을 만들고, 거기에 `.getHours()`를 붙이면 지금이 몇 시인지(0~23) 알려 줘요.

:::info 시간 코드는 컴퓨터 시계 기준이에요
JavaScript는 **내 컴퓨터의 시계**로 시각을 알아내요. 한국에서 쓰는 컴퓨터면 한국 시간으로 계산돼요. 컴퓨터 시계나 시간대가 다르게 설정되어 있으면 인사말 시간도 달라 보여요. 나라마다 다른 시간대를 정확히 다루는 법은 P2 Day 29에서 배워요.
:::

### 화면에 글자를 넣는 맛보기

JavaScript로 화면의 글자를 바꿀 수 있어요. 오늘은 두 줄만 써 봐요. 자세한 원리는 Day 20에서 배워요.

```js
const greeting = document.querySelector('#greeting');
greeting.textContent = '안녕하세요';
```

- `document.querySelector('#greeting')`는 문서(`document`)에서 `id="greeting"`인 요소를 **찾아요**. CSS 선택자와 같은 모양이에요(Day 9의 `#이름`).
- `.textContent = 문장`은 그 요소 안의 글자를 문장으로 **바꿔요**.

그런데 `id="greeting"`은 홈에만 있어요. 소개·영상 페이지에서는 찾는 요소가 없어서 `querySelector`가 `null`을 돌려주고, `null`에 `.textContent`를 쓰면 오류가 나요. 그래서 `if (greeting) { … }`로 "찾았을 때만" 실행해요. `main.js`는 다섯 페이지가 함께 쓰기 때문에 꼭 필요한 안전장치예요.

## 🛠️ 따라하기

모두 8단계예요. 콘솔 입력은 직접 타이핑하고, 영어 입력 상태에서 쳐요. 개발자 도구는 Edge나 Chrome에서 연 페이지(`index.html` 더블클릭, 또는 Live Preview 주소를 복사해 붙여 넣기)에서 열어요.

### 1단계 · 콘솔에서 비교와 논리 연산 해 보기 (7분)

조건문에 쓸 참/거짓을 먼저 콘솔에서 손으로 만들어 봐요.

**어디서:** Edge 또는 Chrome에서 연 `index.html`, `F12` → **Console**, 맨 아래 입력 칸

**무엇을:** 표의 **입력**을 한 줄씩 입력하고 `Enter`를 눌러요.

| 입력 | 결과 |
|---|---|
| `20 > 15` | `true` |
| `5 === 5` | `true` |
| `'5' === 5` | `false` |
| `5 !== 6` | `true` |
| `const hour = 21` | `undefined` |
| `hour >= 20 && hour < 22` | `true` |
| `!true` | `false` |

표 아래 한 줄도 입력해 봐요. `hour < 6 || hour >= 22`를 입력하면 `false`가 나와요. `||`는 막대(`|`) 두 개예요. 키보드의 `Shift + \`(영어 입력 상태, `Enter` 키 위쪽)가 `|`예요.

:::success
위 표와 같은 결과가 줄마다 나와요. `'5' === 5`가 `false`인 것에 주목하세요. 글자 `'5'`와 숫자 `5`는 종류가 달라서 `===`는 다르다고 해요.
:::

### 2단계 · 콘솔에서 템플릿 리터럴과 Date 써 보기 (6분)

문장에 값 끼워 넣기와 지금 시각 가져오기를 해 봐요.

**어디서:** 같은 콘솔

**무엇을:** 한 줄씩 입력해요. 백틱은 숫자 `1` 왼쪽 키(영어 입력 상태)예요.

| 입력 | 결과 |
|---|---|
| `` `${hour}시예요` `` | `'21시예요'` |
| `new Date().getHours()` | 지금 시각의 시(예: `14`) |
| `const nowHour = new Date().getHours()` | `undefined` |
| `` `지금은 ${nowHour}시예요` `` | 예: `'지금은 14시예요'` |

:::success
첫 줄은 `'21시예요'`가 나와요(1단계에서 만든 `hour`가 21이었어요). `new Date().getHours()`는 **내 컴퓨터의 지금 시각**에 해당하는 0~23 사이의 숫자가 나와요. 작업 표시줄 오른쪽 아래 시계와 같은 시(24시간 기준)여야 해요. 다르면 아래 🧯의 "인사말 시간이 이상해요"를 보세요.
:::

### 3단계 · index.html에 인사말 자리 만들기 (5분)

JavaScript가 글을 넣어 줄 빈 문단을 만들어요. `id`가 이름표 역할을 해요(Day 8의 `id` 속성).

**어디서:** VS Code, `C:\dev\my-creator-site\index.html`, 첫 번째 `<section>` 안의 `<div>`

**무엇을:**

1. `<h1>안녕하세요, 달빛곰이에요!</h1>` 줄을 찾아요.
2. 그 줄 **바로 아래**에 주석과 빈 문단 두 줄을 넣어요. 아래는 `<div>` 안 전체 모습이에요.
3. `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\index.html (일부)
```html
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
```

`<p>` 안이 비어 있으니 화면에는 아직 아무것도 안 보여요. `class="greeting"`은 이 문단을 꾸밀 이름표예요.

:::success
저장해도 화면은 그대로예요. 빈 문단은 눈에 안 보이니까요. 개발자 도구 **Elements**에서 `<p id="greeting" class="greeting"></p>`를 찾을 수 있어요.
:::

### 4단계 · 인사말 모양 정하기 (4분)

인사말을 은은한 회색빛 글자로 꾸며요. 이 단계에서도 아직 글이 없어서 모양은 안 보여요.

**어디서:** VS Code, `C:\dev\my-creator-site\css\style.css`, `6. 페이지별` 구역의 `.hero-image { … }` 규칙 아래

**무엇을:**

1. `/* 홈: 소개 영역 */` 아래 `.hero-image { … }` 규칙이 끝나는 `}` 아래에 한 줄을 비워요.
2. 아래 블록을 붙여 넣고 `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
.greeting {
  color: var(--muted);
  font-size: 1.1rem;
  margin: 0 0 0.5rem;
}
```

:::success
저장해도 화면은 그대로예요. 5단계에서 글이 들어가면 이 모양으로 보여요. `.greeting` 규칙이 `.hero-image` 아래, `.hero-actions` 위에 들어갔는지 눈으로 확인해요.
:::

### 5단계 · main.js에 인사말 코드 쓰기 (10분)

어제 연결 확인용으로 쓴 `console.log` 줄은 지우고, 진짜 기능을 넣어요.

**어디서:** VS Code, `C:\dev\my-creator-site\js\main.js`

**무엇을:**

1. `main.js`를 열어요.
2. 파일 전체를 선택(`Ctrl + A`)하고 지운 뒤, 아래 코드를 붙여 넣어요.
3. `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\js\main.js
```js
// ==========================================================
// main.js - 모든 페이지에서 쓰는 코드
// 3) 시간대별 인사말
// (HTML에서 <script src="js/main.js" defer>로 불러와요)
// ==========================================================

// ---------- 3. 시간대별 인사말 (Day 16) ----------
const greeting = document.querySelector('#greeting'); // 홈 페이지에만 있어요

if (greeting) {
  const hour = new Date().getHours(); // 0 ~ 23
  let message;

  if (hour < 6) {
    message = '늦은 밤이에요. 올빼미 시청자님, 어서 와요!';
  } else if (hour < 12) {
    message = '좋은 아침이에요! 오늘도 힘차게 시작해요.';
  } else if (hour < 18) {
    message = '즐거운 오후예요! 영상 구경하고 가세요.';
  } else {
    message = '좋은 저녁이에요! 오늘 방송 일정을 확인해 보세요.';
  }

  greeting.textContent = message;
}
```

- `// ---------- 3. 시간대별 인사말 (Day 16) ----------`은 구역 이름이에요. 번호 3은 앞으로 이 파일에 1번(메뉴), 2번(다크 모드) 구역이 앞에 더해질 자리를 비워 둔 거예요.
- `const greeting = …`: 홈에만 있는 `#greeting` 요소를 찾아요. 없는 페이지에서는 `null`이에요.
- `if (greeting) { … }`: `null`은 거짓이라서 요소가 있는 홈에서만 안의 코드가 실행돼요.
- `let message;`는 값을 나중에 넣을 상자예요. 값이 아직 없어서 `undefined`이고, 4갈래 if가 그중 하나를 넣어요. (`const`가 아니라 `let`인 이유는 나중에 값을 한 번 넣기 때문이에요. 블록 `{ }` 안에서 만든 변수는 밖에서 못 써서, `message`를 `if` 갈래들 **바깥**에 먼저 만들어요. 자세한 이유는 Day 18의 스코프에서 배워요.)
- `hour < 6`이면 늦은 밤, `< 12` 아침, `< 18` 오후, 그 밖은 저녁이에요. 위에서부터 차례로 검사하니까 `hour < 12`에는 이미 6시 이상이라는 뜻이 들어 있어요.
- `greeting.textContent = message;`가 화면의 문단에 글을 넣어요.

:::success
Live Preview나 더블클릭으로 연 홈(`index.html`)에서 `F5`로 새로 고침하면, 제목 `안녕하세요, 달빛곰이에요!` 바로 아래에 회색빛 글자 한 줄이 나타나요. 지금 시각이 오후 6시(18시) 이후면 `좋은 저녁이에요! 오늘 방송 일정을 확인해 보세요.`처럼 시간대에 맞는 문장이에요. 아무 글도 안 보이면 아래 🧯의 "인사말이 안 보여요"를 보세요.
:::

### 6단계 · 네 문장을 모두 확인하기 (7분)

지금 시각에 따라 문장 하나만 나오니까, 시각을 잠깐 직접 정해서 네 문장을 다 봐요.

**어디서:** VS Code, `C:\dev\my-creator-site\js\main.js`, `const hour = …` 줄

**무엇을:**

1. `const hour = new Date().getHours(); // 0 ~ 23` 줄의 `new Date().getHours()` 부분을 숫자 `5`로 바꾸고 저장해요. 줄은 `const hour = 5; // 0 ~ 23`이 돼요.
2. 브라우저에서 `F5`를 눌러 문장을 봐요.
3. 같은 방법으로 `8`, `14`, `20`으로 바꿔 가며 문장이 어떻게 바뀌는지 봐요.
4. 확인이 끝나면 줄을 `const hour = new Date().getHours(); // 0 ~ 23`으로 **되돌리고** 저장해요.

:::success
숫자에 따라 홈 인사말이 이렇게 바뀌어요: `5` → `늦은 밤이에요. 올빼미 시청자님, 어서 와요!`, `8` → `좋은 아침이에요! 오늘도 힘차게 시작해요.`, `14` → `즐거운 오후예요! 영상 구경하고 가세요.`, `20` → `좋은 저녁이에요! 오늘 방송 일정을 확인해 보세요.` 되돌린 뒤에는 지금 시각에 맞는 문장이에요. 되돌리는 걸 잊으면 인사말이 항상 같은 문장이에요.
:::

### 7단계 · 다른 페이지에 오류가 없는지 확인하기 (3분)

`main.js`는 다섯 페이지가 함께 써요. 인사말 요소가 없는 페이지에서도 오류가 안 나는지 봐요.

**어디서:** Edge 또는 Chrome, 개발자 도구 **Console**

**무엇을:**

1. 메뉴의 `소개`, `영상`, `방송 일정`, `문의`를 차례로 열어요.
2. 페이지마다 콘솔(`F12` → **Console**)에 빨간 글자가 없는지 봐요.

:::success
네 페이지 모두 콘솔이 깨끗해요. 어제 보였던 `main.js가 연결됐어요!`도 이제 안 나와요(그 줄을 지웠으니까요). 빨간 오류가 있으면 아래 🧯의 "소개 페이지에서 TypeError"를 보세요.
:::

### 8단계 · 오늘 작업 커밋·푸시 (5분)

오늘 바뀐 파일을 Git에 기록하고(커밋) GitHub로 올려요(푸시). 매일 마지막에 하는 습관이에요. Day 7·8에서 한 것과 똑같아요.

**어디서:** VS Code, `C:\dev\my-creator-site` 폴더가 열린 창. 왼쪽 세로 막대의 가지 모양 아이콘(**소스 제어**, `Ctrl + Shift + G`)

**무엇을 (방법 A, 소스 제어 패널):**

1. 위쪽 **메시지** 칸을 클릭하고 `Day 16: 시간대별 인사말 (if/else if)`를 입력해요.
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
git commit -m "Day 16: 시간대별 인사말 (if/else if)"
```

예상 출력(`a1b2c3d` 같은 해시와 숫자는 달라도 돼요):

```text
[main a1b2c3d] Day 16: 시간대별 인사말 (if/else if)
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
브라우저에서 `https://github.com/<내 아이디>/my-creator-site`를 열고 새로 고침(`F5`)하면, 파일 목록 위에 방금 쓴 커밋 메시지 `Day 16: 시간대별 인사말 (if/else if)`가 보여요. VS Code 소스 제어 패널의 변경 목록은 비어 있어요.
:::

## ✍️ 과제

### 과제 1 · 경계값 표 (쉬움 ⭐, 6분)

`main.js`의 `const hour`를 아래 숫자로 바꿔서 나오는 문장을 표로 만들어요.

- `5`, `6`, `11`, `12`, `17`, `18`
- 어느 숫자에서 문장이 바뀌는지(경계) 표시해요.
- 끝나면 `const hour = new Date().getHours(); // 0 ~ 23`으로 되돌려요.

힌트: 조건이 `hour < 6`, `hour < 12`, `hour < 18`이에요. `<`는 그 숫자를 **포함하지 않아요**.

### 과제 2 · 삼항 연산자 (보통 ⭐⭐, 7분)

콘솔에서 삼항 연산자로 오전/오후 문장을 만들어요.

- `const hour = new Date().getHours()`를 입력해요.
- `` `지금은 ${hour < 12 ? '오전' : '오후'}이에요` ``를 입력하고 결과를 적어요.
- 같은 일을 하는 if/else 코드를 콘솔에 써 보세요(변수에 문장을 담아 출력).

힌트: `${ }` 안에는 계산식도 쓸 수 있어요.

### 과제 3 · 범위 조건 (도전 ⭐⭐⭐, 6분)

"저녁 8시 이상, 10시 미만"에 `true`가 나오는 조건을 만들어요.

- 콘솔에서 `hour`를 `19`, `20`, `21`, `22`로 바꿔 가며 확인해요(`let hour = 19`로 만들고 `hour = 20`으로 바꿔요).
- 조건 식을 `&&`로 써요.
- 왜 `||`가 아니라 `&&`인지 한 줄로 적어요.

힌트: 두 조건이 **동시에** 참이어야 해요.

## ✅ 정답

:::answer 과제 1 정답 · 경계값 표
| hour | 나오는 문장 |
|---|---|
| 5 | 늦은 밤이에요. 올빼미 시청자님, 어서 와요! |
| 6 | 좋은 아침이에요! 오늘도 힘차게 시작해요. |
| 11 | 좋은 아침이에요! 오늘도 힘차게 시작해요. |
| 12 | 즐거운 오후예요! 영상 구경하고 가세요. |
| 17 | 즐거운 오후예요! 영상 구경하고 가세요. |
| 18 | 좋은 저녁이에요! 오늘 방송 일정을 확인해 보세요. |

경계는 5→6, 11→12, 17→18이에요.

**왜 이렇게 하나요?** `hour < 6`은 6을 포함하지 않으니 6은 두 번째 갈래(아침)로 가요. 위에서 아래로 검사해서 처음 참인 갈래만 실행해요. 끝나면 `new Date().getHours()`로 되돌려야 실제 시각을 따라가요.
:::

:::answer 과제 2 정답 · 삼항 연산자
콘솔에 입력하고 나오는 결과예요(시각에 따라 달라요).

| 입력 | 결과 |
|---|---|
| `const hour = new Date().getHours()` | `undefined` |
| `` `지금은 ${hour < 12 ? '오전' : '오후'}이에요` `` | 오전이면 `'지금은 오전이에요'`, 오후면 `'지금은 오후이에요'` |

같은 일을 하는 if/else 코드예요.

```js
let period;
if (hour < 12) {
  period = '오전';
} else {
  period = '오후';
}
console.log(`지금은 ${period}이에요`);
```

**왜 이렇게 하나요?** 삼항 연산자는 "참이면 이 값, 거짓이면 저 값"을 한 줄로 쓰는 짧은 if/else예요. 값을 하나 고르는 일에 편하고, 여러 줄을 실행해야 하면 if/else를 써요.
:::

:::answer 과제 3 정답 · 범위 조건
조건 식: `hour >= 20 && hour < 22`

| hour | 결과 |
|---|---|
| 19 | `false` |
| 20 | `true` |
| 21 | `true` |
| 22 | `false` |

**왜 이렇게 하나요?** "20시 **이상이고** 22시 **미만**"은 두 조건이 동시에 참이어야 해요. `&&`(그리고)는 둘 다 참일 때만 참이에요. `||`(또는)를 쓰면 `hour >= 20 || hour < 22`는 거의 모든 시각에서 참이 돼서 범위가 안 만들어져요.
:::

:::answer 오늘 끝 상태 전체 코드
막혔다면 아래 코드로 맞추고 [Day 17](#/day/p1-d17)을 시작하세요. 오늘 바뀐 파일은 `js/main.js`(전체), `index.html`, `css/style.css`예요. `index.html`은 전체를, `style.css`는 200줄이 넘어서 바뀐 블록과 위치만 실었어요. 파일 하나를 통째로 바꿀 때는 VS Code에서 그 파일을 열고 `Ctrl + A`로 전체를 선택한 뒤 붙여 넣고 `Ctrl + S`로 저장해요.

```text
my-creator-site/
├─ about.html
├─ contact.html
├─ contents.html
├─ index.html
├─ schedule.html
├─ css/
│  └─ style.css
├─ images/
│  ├─ logo.svg
│  ├─ profile.svg
│  ├─ thumb-game.svg
│  ├─ thumb-music.svg
│  └─ thumb-talk.svg
└─ js/
   └─ main.js
```

📄 C:\dev\my-creator-site\js\main.js
```js
// ==========================================================
// main.js - 모든 페이지에서 쓰는 코드
// 3) 시간대별 인사말
// (HTML에서 <script src="js/main.js" defer>로 불러와요)
// ==========================================================

// ---------- 3. 시간대별 인사말 (Day 16) ----------
const greeting = document.querySelector('#greeting'); // 홈 페이지에만 있어요

if (greeting) {
  const hour = new Date().getHours(); // 0 ~ 23
  let message;

  if (hour < 6) {
    message = '늦은 밤이에요. 올빼미 시청자님, 어서 와요!';
  } else if (hour < 12) {
    message = '좋은 아침이에요! 오늘도 힘차게 시작해요.';
  } else if (hour < 18) {
    message = '즐거운 오후예요! 영상 구경하고 가세요.';
  } else {
    message = '좋은 저녁이에요! 오늘 방송 일정을 확인해 보세요.';
  }

  greeting.textContent = message;
}
```

`style.css`에는 `.greeting` 규칙 하나가 늘었어요. `6. 페이지별` 구역에서 `/* 홈: 소개 영역 */` 아래 `.hero-image { … }` 규칙 **바로 아래**, `.hero-actions { … }` 규칙 **위**에 넣어요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
.greeting {
  color: var(--muted);
  font-size: 1.1rem;
  margin: 0 0 0.5rem;
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
  <script src="js/main.js" defer></script>
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
        <!-- main.js가 시간대에 맞는 인사말을 넣어 줘요 (Day 16) -->
        <p id="greeting" class="greeting"></p>
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

### 인사말이 안 보여요

**원인:** 흔한 이유는 세 가지예요. ① `index.html`의 `id="greeting"`과 `main.js`의 `'#greeting'` 철자가 달라요(`#`이 빠지거나 `greeting`에 오타). ② `main.js`가 연결되지 않았어요(Day 15). ③ `if (greeting)` 블록의 중괄호 짝이 맞지 않아요.

**해결:**

1. `index.html`에서 `<p id="greeting" class="greeting"></p>`를 3단계 블록과 비교해요.
2. `main.js`에서 `document.querySelector('#greeting')`에 `#`(우물 정자 모양)이 있는지 봐요. `querySelector('greeting')`이면 `greeting`이라는 이름의 태그를 찾아서 못 찾아요.
3. `F12` → **Console**에서 빨간 오류가 있는지 봐요. 오류의 파일 이름 링크를 눌러 문제의 줄을 열어요.
4. 저장하고 `Ctrl + F5`로 새로 고침해서 인사말이 나오면 해결이에요.

### 소개 페이지에서 Uncaught TypeError: Cannot set properties of null

```text
Uncaught TypeError: Cannot set properties of null (setting 'textContent')
```

**원인:** "`null`에 `textContent`를 넣을 수 없어요"라는 뜻이에요. 소개 같은 페이지에는 `id="greeting"` 요소가 없어서 `querySelector`가 `null`을 돌려줬는데, `if (greeting)`으로 걸러내지 않고 `greeting.textContent = …`를 실행해서 나는 오류예요.

**해결:**

1. `main.js`에서 `greeting.textContent = message;`가 `if (greeting) { … }` 블록 **안에** 있는지 확인해요.
2. 중괄호 `{ }`가 `if (greeting)`부터 파일 맨 끝 `}`까지 짝이 맞는지 봐요.
3. 저장하고 소개 페이지를 새로 고침해서 콘솔의 빨간 글자가 없으면 해결이에요.

### 문장에 ${hour}가 글자 그대로 나와요

**원인:** 값을 끼워 넣으려면 **백틱**(`` ` ``)으로 감싸야 하는데 작은따옴표(`'`)로 감쌌어요. 작은따옴표 문자열 안의 `${hour}`는 그냥 글자예요. 백틱 키가 눌리지 않아 `₩`나 한글이 나온 경우도 있어요.

**해결:**

1. 영어 입력 상태(`한/영` 키)인지 확인하고, 숫자 `1` 왼쪽 키(배열에 따라 위치가 다를 수 있어요)를 눌러 백틱을 입력해요.
2. 문장의 처음과 끝이 모두 백틱인지 확인해요.
3. 저장하고 새로 고침해서 숫자가 문장에 들어가 있으면 해결이에요.

### Uncaught TypeError: Assignment to constant variable.

```text
Uncaught TypeError: Assignment to constant variable.
```

**원인:** `if (hour = 6)`처럼 `=`를 한 개만 써서 비교가 아니라 **값 넣기**가 됐어요. `hour`는 `const`라서 새 값을 넣을 수 없어서 이 오류가 나요. (`let`이었다면 오류 없이 항상 참인 조건이 돼서 더 찾기 어려워요.)

**해결:**

1. 조건 안의 `=`를 찾아요. 같은지 물을 때는 `===`, 크기를 비교할 때는 `<`·`>`를 써요.
2. 고치고 저장해서 오류가 사라지면 해결이에요.

### Uncaught SyntaxError: Unexpected token '{'

```text
Uncaught SyntaxError: Unexpected token '{'
```

**원인:** `else if`를 `elseif`처럼 붙여 썼어요. JavaScript에는 `elseif`라는 말이 없어서 중괄호 `{`가 나오자 "여기는 문법이 아니에요"라고 해요. 중괄호 짝이 틀려도 비슷한 오류가 나요.

**해결:**

1. `main.js`의 `} else if (hour < 12) {`처럼 `else`와 `if` 사이에 빈칸이 있는지 확인해요.
2. 여는 중괄호 `{`와 닫는 중괄호 `}`의 개수가 같은지 봐요.
3. 저장하고 새로 고침해서 오류가 사라지면 해결이에요.

### 인사말 시간이 이상해요

**원인:** JavaScript는 내 컴퓨터의 시계를 읽어요. 컴퓨터 시계나 시간대가 틀리면 인사말도 틀려요. 또 6단계에서 숫자로 바꾼 `const hour = 5;`를 되돌리지 않았을 수도 있어요.

**해결:**

1. `main.js`의 `const hour` 줄이 `new Date().getHours()`로 되어 있는지 확인해요.
2. 작업 표시줄 오른쪽 아래 시계가 맞는지 봐요. 틀리면 Windows **설정 → 시간 및 언어 → 날짜 및 시간**에서 시간대와 자동 설정을 확인해요(메뉴 이름은 Windows 버전에 따라 조금 다를 수 있어요).
3. 새로 고침해서 지금 시각에 맞는 문장이면 해결이에요.

## 📝 오늘의 체크리스트

- [ ] 홈 제목 아래에 지금 시각에 맞는 인사말 한 줄이 나와요.
- [ ] `hour`를 5, 8, 14, 20으로 바꿔서 문장 네 개를 모두 봤고, 지금은 `new Date().getHours()`로 되돌렸어요.
- [ ] 소개·영상·방송 일정·문의 페이지의 콘솔에 빨간 오류가 없어요.
- [ ] `=`와 `===`의 차이를 내 말로 설명할 수 있어요.
- [ ] 백틱과 `${ }`로 문장에 값을 끼워 넣을 수 있어요.
- [ ] 과제 1~3을 풀고 정답과 비교했어요.
- [ ] GitHub 저장소에 `Day 16: 시간대별 인사말 (if/else if)` 커밋이 보여요.

## 📚 더 알아보기

- [MDN · 조건문(if...else)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/if...else): if, else if, else의 문법과 예제를 보여 줘요.
- [MDN · 템플릿 리터럴](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Template_literals): 백틱과 `${ }`의 쓰임을 설명해요.
- [MDN · Date](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Date): 날짜와 시각을 다루는 기능을 모아 보여 줘요.

➡️ **다음 Day 예고:** [Day 17 · 반복문과 배열](#/day/p1-d17)에서는 여러 값을 한 줄에 담는 배열과, 같은 일을 여러 번 되풀이하는 반복문을 별도의 연습장에서 배워요.
