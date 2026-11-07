## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- 배열 `['월', '수', '금', '토']`을 만들고, 인덱스(0부터 시작하는 번호)로 값을 꺼내고 `push()`로 값을 더할 수 있어요.
- `for` 반복문과 `for...of`로 배열의 값을 하나씩 꺼내 콘솔에 출력할 수 있어요.
- 반복문과 `if`를 함께 써서 합계와 최댓값을 구할 수 있어요.
- 연습용 폴더 `C:\dev\hello`에 `lab.html`과 `lab.js`를 만들어 콘솔로 결과를 확인할 수 있어요.

**예상 시간: 90분** (개념 이해 20분 · 따라하기 42분 · 과제 22분 · 정리 6분)

:::path 📂 시작 상태
어제(Day 16)까지 만든 파일이 이렇게 있어야 해요. 없거나 다르면 [Day 16](#/day/p1-d16)의 "오늘 끝 상태 전체 코드"로 맞춰 주세요. 오늘은 프로젝트 파일을 바꾸지 않고 **연습장**에서 JavaScript를 연습해요.

- `C:\dev\my-creator-site\` 안에 `index.html`, `about.html`, `contents.html`, `schedule.html`, `contact.html`, `css\style.css`, `js\main.js`가 있어요. `main.js`에는 홈의 인사말 코드(`3. 시간대별 인사말`)가 있어요.
- 연습 폴더 `C:\dev\hello\`가 있고 안에 `hello.html` 등 Day 1~8의 연습 파일이 있어요.
- GitHub Pages가 켜져 있어요: `https://<내 아이디>.github.io/my-creator-site/`
- VS Code(한국어 팩, Live Preview 확장 프로그램)가 설치되어 있고, Edge 또는 Chrome이 있어요.
- 프로젝트 변경은 모두 커밋·푸시했어요. 오늘은 프로젝트를 바꾸지 않으니 커밋할 것이 없어요.
:::

## 📖 개념 이해

### 여러 값을 한 줄로: 배열

**비유:** 요일별로 칸이 나뉜 약통을 떠올려 보세요. 칸마다 번호가 있고, 칸 안에 값이 하나씩 들어 있어요. 한 줄로 늘어선 서랍장에 0번 서랍, 1번 서랍, 2번 서랍…이 있는 모양이에요.

**정확한 정의:** **[[배열]]**(array)은 여러 값을 순서대로 한 줄에 담는 자료형이에요. 대괄호 `[ ]`와 쉼표로 만들어요.

```js
const days = ['월', '수', '금', '토'];
```

배열 안의 값이 놓인 자리 번호를 **[[인덱스]]**(index)라고 해요. 인덱스는 **0부터** 세요. 그래서 첫 번째 값은 `days[0]`(`'월'`), 네 번째 값은 `days[3]`(`'토'`)이에요. 값의 개수는 `days.length`(4)로 알아요. 마지막 값의 인덱스는 `length - 1`(3)이에요. 없는 자리를 꺼내면(`days[4]`) `undefined`가 나와요.

- `days.push('일')`: 배열 끝에 값을 더해요.
- `days[0] = '화'`: 0번 자리의 값을 바꿔요.
- 문자열도 `.length`가 있어요. `'달빛곰'.length`는 3이에요.

:::info const 배열에 push가 되는 이유
`const days = [...]`로 만든 배열에도 `push()`로 값을 더할 수 있어요. `const`는 "상자 자체를 다른 것으로 바꾸지 못한다"는 뜻이지, 상자 안의 내용을 못 바꾼다는 뜻이 아니에요. `days = []`처럼 상자를 통째로 바꾸려 할 때만 오류가 나요.
:::

### 같은 일을 되풀이하기: 반복문

**비유:** 서랍장의 0번 서랍부터 마지막 서랍까지 차례로 열어 안을 확인하는 일을 상상해 보세요. 서랍마다 "열고, 보고, 닫는" 같은 동작을 되풀이해요.

**정확한 정의:** **[[반복문]]**(loop)은 같은 코드를 여러 번 되풀이해 실행하는 문법이에요. 두 가지를 배워요.

첫째, `for` 반복문은 번호를 직접 세요.

```js
for (let i = 0; i < days.length; i++) {
  console.log(days[i]);
}
```

괄호 안에는 세미콜론(`;`)으로 나뉜 세 부분이 있어요.

1. `let i = 0` — 시작: 번호 상자 `i`를 0으로 만들어요(**한 번만** 실행).
2. `i < days.length` — 조건: 이 조건이 참인 동안 계속 되풀이해요.
3. `i++` — 한 바퀴 끝날 때마다 `i`를 1 늘려요(`i = i + 1`과 같아요).

`i`가 0, 1, 2, 3일 때 중괄호 안이 네 번 실행되고, `i`가 4가 되면 조건(`4 < 4`)이 거짓이라 끝나요.

둘째, **[[for...of]]**(포 오브)는 배열의 값을 처음부터 하나씩 꺼내 줘요. 번호를 셀 필요가 없어요.

```js
for (const day of days) {
  console.log(day);
}
```

한 바퀴마다 `day`에 값이 하나씩 들어와요. 값만 필요할 때는 `for...of`가 더 읽기 쉬워서 이 교재는 대부분 `for...of`를 써요. 번호(`i`)도 필요하면 `for`를 써요. `for...in`이라는 비슷한 문법도 있지만, 배열에서는 값이 아니라 번호가 나와서 쓰지 않아요.

:::warn 무한 반복 주의
조건이 영원히 참이면 반복이 끝나지 않아요. 예를 들어 `i++`를 빠뜨리면 `i`가 늘지 않아서 영원히 돌아요. 이러면 브라우저 탭이 멈춰요. 탭을 닫고, 그래도 안 되면 `Ctrl + Shift + Esc`로 **작업 관리자**를 열어 브라우저 항목을 **작업 끝내기** 해요. 오늘 연습에서는 일부러 무한 반복을 만들지 않아요.
:::

### 반복 + 계산: 합계와 최댓값

반복문은 `if`와 변수와 함께 쓸 때 힘이 나요.

```js
let total = 0;
for (const minute of minutes) {
  total = total + minute;
}
```

`total`을 0으로 시작해서 값을 하나씩 더해 가면 합계가 돼요. 가장 큰 값 찾기는 이런 모양이에요.

```js
let max = null;
for (const value of values) {
  if (max === null || value > max) {
    max = value;
  }
}
```

`null`("아직 아무것도 못 봤어요" 표시)로 시작해서, 처음 보는 값이거나 지금까지의 최댓값보다 크면 바꿔요. Day 26에서 "다음 방송 찾기"가 똑같은 모양이에요.

### 왜 연습장을 따로 만들까요?

오늘 쓰는 코드는 사이트에 들어갈 코드가 아니라 **연습용**이에요. 프로젝트 파일을 어지럽히지 않고, 틀려도 사이트가 망가지지 않게 `C:\dev\hello`에 연습장을 만들어요. 내일(Day 18)도 같은 연습장을 써요.

## 🛠️ 따라하기

모두 8단계예요. 결과는 개발자 도구 콘솔로 확인해요. 개발자 도구는 Edge나 Chrome에서 연 페이지에서 열어요. `lab.html`을 파일 탐색기에서 더블클릭하면 바로 브라우저로 열려요.

### 1단계 · 연습 폴더를 새 창으로 열기 (6분)

프로젝트 창은 그대로 두고, 연습장은 새 VS Code 창에서 열어요. 두 창을 헷갈리지 않게 조심해요.

**어디서:** VS Code (지금 `my-creator-site`가 열린 창)

**무엇을:**

1. VS Code 메뉴 **파일 → 새 창**을 클릭해요. 빈 새 창이 열려요.
2. 새 창의 메뉴 **파일 → 폴더 열기**를 클릭해요.
3. 폴더 선택 창 위쪽 주소 칸의 빈 곳을 클릭하고 `C:\dev\hello`를 입력한 뒤 `Enter`를 눌러요. 그다음 **폴더 선택** 버튼을 클릭해요.
4. 이 폴더의 작성자를 신뢰하는지 묻는 창이 뜨면 **예, 작성자를 신뢰합니다**(문구는 버전에 따라 조금 달라요)를 클릭해요.

:::success
새 창 왼쪽 **탐색기**에 `HELLO`라는 폴더 이름과 그 아래 `hello.html`, `favorites.html` 같은 연습 파일이 보여요. 창 맨 위 제목에도 `hello`가 있어요. 이전 창의 제목에는 `my-creator-site`가 있어요. 작업 표시줄의 VS Code 아이콘을 눌러 두 창을 오갈 수 있어요.
:::

### 2단계 · lab.html 만들고 열기 (6분)

배열 연습의 결과를 보려면 웹페이지가 하나 필요해요. 빈 페이지에 `lab.js`만 연결해 둬요.

**어디서:** VS Code `hello` 창, 왼쪽 **탐색기**

**무엇을:**

1. 탐색기의 빈 곳을 오른쪽 클릭 → **새 파일**을 클릭하고 이름 `lab.html`을 입력한 뒤 `Enter`를 눌러요.
2. 열린 빈 파일에 아래 코드를 붙여 넣고 `Ctrl + S`로 저장해요.

📄 C:\dev\hello\lab.html
```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>JS 연습장</title>
  <script src="lab.js" defer></script>
</head>
<body>
  <h1>JS 연습장</h1>
  <p>개발자 도구 콘솔(F12)을 열어 결과를 보세요.</p>
</body>
</html>
```

3. 파일 탐색기에서 `C:\dev\hello\lab.html`을 더블클릭해서 브라우저로 열어요. `F12` → **Console**을 열어 둬요.

:::success
브라우저에 큰 제목 `JS 연습장`과 `개발자 도구 콘솔(F12)을 열어 결과를 보세요.`라는 문장이 보여요. 콘솔은 비어 있고, 빨간 오류가 하나 있을 수 있어요(`lab.js`를 아직 안 만들어서 `Failed to load resource`가 나요). 다음 단계에서 `lab.js`를 만들면 사라져요.
:::

### 3단계 · lab.js 만들고 배열 꺼내 보기 (8분)

배열을 만들고, 인덱스로 값을 꺼내 콘솔에 찍어요.

**어디서:** VS Code `hello` 창, 탐색기의 `hello` 폴더 → 새 파일 `lab.js`

**무엇을:**

1. 탐색기에서 **새 파일**을 만들어 이름을 `lab.js`로 해요. (`lab.js.txt`가 되지 않게 이름을 확인해요.)
2. 아래 코드를 붙여 넣고 `Ctrl + S`로 저장해요.

📄 C:\dev\hello\lab.js
```js
// Day 17 연습: 배열과 반복문

// 1) 배열 만들기와 꺼내기
const days = ['월', '수', '금', '토'];
console.log(days[0]);
console.log(days[3]);
console.log(days.length);
console.log(days[4]);
```

3. 브라우저에서 `lab.html`을 `F5`로 새로 고침하고 콘솔을 봐요.

예상 출력(콘솔):

```text
월
토
4
undefined
```

:::success
콘솔에 `월`, `토`, `4`, `undefined` 네 줄이 나와요. 인덱스 0은 첫 값(`월`), 3은 마지막 값(`토`)이고, 개수는 4, 없는 자리(`days[4]`)는 `undefined`예요. 아무것도 안 나오면 아래 🧯의 "lab.js가 연결 안 됐어요"를 보세요.
:::

### 4단계 · 값 더하고 바꾸기 (4분)

배열 끝에 값을 더하고, 한 자리의 값을 바꿔요.

**어디서:** VS Code `hello` 창, `lab.js` 맨 아래

**무엇을:**

1. `lab.js`의 마지막 줄(`console.log(days[4]);`) 아래에 빈 줄을 하나 넣고 아래 코드를 이어서 붙여 넣어요.
2. `Ctrl + S`로 저장하고 브라우저에서 `F5`를 눌러요.

📄 C:\dev\hello\lab.js (일부)
```js
// 2) 값 더하기와 바꾸기
const notes = ['장비 점검'];
notes.push('썸네일 만들기');
notes[0] = '마이크 점검';
console.log(notes.length);
console.log(notes[0]);
```

예상 출력(콘솔의 이어지는 두 줄):

```text
2
마이크 점검
```

:::success
콘솔의 앞 네 줄 아래에 `2`와 `마이크 점검`이 나와요. `push`로 값이 하나 늘어 개수가 2가 됐고, 0번 자리 `장비 점검`이 `마이크 점검`으로 바뀌었어요.
:::

### 5단계 · for 반복문으로 요일 출력하기 (6분)

번호를 직접 세면서 배열의 값을 하나씩 꺼내요.

**어디서:** VS Code `hello` 창, `lab.js` 맨 아래

**무엇을:**

1. 이전 코드 아래에 빈 줄을 하나 넣고 아래 코드를 붙여 넣어요.
2. 저장하고 브라우저에서 `F5`를 눌러요.

📄 C:\dev\hello\lab.js (일부)
```js
// 3) for 반복문: 인덱스를 직접 세요
for (let i = 0; i < days.length; i++) {
  console.log(`${i}번째 방송 요일: ${days[i]}`);
}
```

예상 출력(콘솔의 이어지는 네 줄):

```text
0번째 방송 요일: 월
1번째 방송 요일: 수
2번째 방송 요일: 금
3번째 방송 요일: 토
```

:::success
`0번째 방송 요일: 월`부터 `3번째 방송 요일: 토`까지 네 줄이 나와요. 번호가 0부터 시작하는 걸 눈으로 확인할 수 있어요. 번호가 4까지 나오거나 마지막에 `undefined`가 보이면 `i <= days.length`처럼 `<=`를 쓴 거예요. 🧯를 보세요.
:::

### 6단계 · for...of로 요일 출력하기 (5분)

번호 없이 값만 꺼내는 더 간단한 반복이에요.

**어디서:** VS Code `hello` 창, `lab.js` 맨 아래

**무엇을:**

1. 이전 코드 아래에 빈 줄을 하나 넣고 아래 코드를 붙여 넣어요.
2. 저장하고 브라우저에서 `F5`를 눌러요.

📄 C:\dev\hello\lab.js (일부)
```js
// 4) for...of 반복문: 값을 하나씩 꺼내요
for (const day of days) {
  console.log(`${day}요일에 만나요`);
}
```

예상 출력(콘솔의 이어지는 네 줄):

```text
월요일에 만나요
수요일에 만나요
금요일에 만나요
토요일에 만나요
```

:::success
`월요일에 만나요`부터 `토요일에 만나요`까지 네 줄이 나와요. 백틱 문장에 값이 들어간 것은 Day 16에서 배운 템플릿 리터럴이에요.
:::

### 7단계 · 반복으로 합계 구하기 (5분)

반복하면서 값을 한 상자에 계속 더해 가요.

**어디서:** VS Code `hello` 창, `lab.js` 맨 아래

**무엇을:**

1. 이전 코드 아래에 빈 줄을 하나 넣고 아래 코드를 붙여 넣어요.
2. 저장하고 브라우저에서 `F5`를 눌러요.

📄 C:\dev\hello\lab.js (일부)
```js
// 5) 반복 + 계산: 방송 길이(분)의 합계
const minutes = [60, 90, 120];
let totalMinutes = 0;
for (const minute of minutes) {
  totalMinutes = totalMinutes + minute;
}
console.log('방송 길이 합계:', totalMinutes);
```

예상 출력(콘솔의 이어지는 한 줄):

```text
방송 길이 합계: 270
```

:::success
`방송 길이 합계: 270`이 나와요. 60 + 90 + 120이에요. 합계가 0이 나오면 `totalMinutes = totalMinutes + minute;` 줄을 확인해요.
:::

### 8단계 · 프로젝트는 그대로인지 확인하기 (2분)

오늘은 프로젝트 파일을 바꾸지 않았다는 걸 확인해요.

**어디서:** VS Code `my-creator-site` 창(1단계 전에 있던 창, 작업 표시줄에서 전환), **소스 제어** 패널(`Ctrl + Shift + G`)

**무엇을:** 소스 제어 패널의 변경 목록을 확인해요.

:::success
소스 제어 패널의 변경이 `0`개예요(목록이 비어 있어요). 연습장 창은 닫아도 되고, 내일 연습장이 필요하면 같은 방법으로 다시 열어요. 프로젝트 창(`my-creator-site`)을 열어 둔 채로 다음 Day를 시작해요. 연습장은 프로젝트 폴더 밖(`C:\dev\hello`)이라서 프로젝트 저장소에 영향을 주지 않아요. 그래서 오늘은 커밋하지 않아도 돼요.
:::

## ✍️ 과제

과제 코드는 `lab.js`의 맨 아래에 이어서 써요.

### 과제 1 · 합계와 평균 (쉬움 ⭐, 6분)

`const hours = [20, 21, 20, 15];`(방송 시작 시각들)의 합과 평균을 `for...of`로 구해요.

- 합계를 `sum`에 모으고 콘솔에 `합계:`와 함께 출력해요.
- 평균은 합계를 `hours.length`로 나눠서 출력해요.

힌트: 평균 = 합계 ÷ 개수예요.

### 과제 2 · 7의 배수 (보통 ⭐⭐, 8분)

1부터 30까지 숫자 중 7의 배수를 `for`와 `%`로 찾아 출력해요.

- `for (let n = 1; n <= 30; n++)`으로 1~30을 돌아요.
- `n % 7 === 0`이면(7로 나눈 나머지가 0이면) 7의 배수라서 출력해요.

힌트: 어제 배운 `if`를 반복문 안에 넣어요.

### 과제 3 · 가장 늦은 방송 시각 (도전 ⭐⭐⭐, 8분)

`hours`에서 가장 큰 값을 `let latest = null;`로 시작해서 찾아요.

- 처음 보는 값이거나 지금까지의 최댓값보다 크면 `latest`를 바꿔요.
- 결과를 `가장 늦은 시각:`과 함께 출력해요.
- 왜 `0`이 아니라 `null`로 시작하는지 한 줄로 적어요.

힌트: `if (latest === null || hour > latest)`.

## ✅ 정답

:::answer 과제 1 정답 · 합계와 평균
📄 C:\dev\hello\lab.js (일부)
```js
// ---------- 과제 1: 합계와 평균 ----------
const hours = [20, 21, 20, 15];
let sum = 0;
for (const hour of hours) {
  sum = sum + hour;
}
console.log('합계:', sum);
console.log('평균:', sum / hours.length);
```

예상 출력(콘솔의 이어지는 두 줄):

```text
합계: 76
평균: 19
```

**왜 이렇게 하나요?** 7단계의 합계 모양과 같아요. 합계 76을 개수 4로 나누면 평균 19예요. `hours.length`를 쓰면 값이 늘어도 코드를 고치지 않아도 돼요.
:::

:::answer 과제 2 정답 · 7의 배수
📄 C:\dev\hello\lab.js (일부)
```js
// ---------- 과제 2: 1~30 중 7의 배수 ----------
for (let n = 1; n <= 30; n++) {
  if (n % 7 === 0) {
    console.log(n);
  }
}
```

예상 출력(콘솔의 이어지는 네 줄):

```text
7
14
21
28
```

**왜 이렇게 하나요?** `%`는 나눈 나머지예요. 7로 나눈 나머지가 0이면 7의 배수예요. 반복문이 1부터 30까지 돌면서 `if`가 맞는 숫자만 골라 출력해요.
:::

:::answer 과제 3 정답 · 가장 늦은 방송 시각
📄 C:\dev\hello\lab.js (일부)
```js
// ---------- 과제 3: 가장 늦은 방송 시각 ----------
let latest = null;
for (const hour of hours) {
  if (latest === null || hour > latest) {
    latest = hour;
  }
}
console.log('가장 늦은 시각:', latest);
```

예상 출력(콘솔의 마지막 줄):

```text
가장 늦은 시각: 21
```

**왜 이렇게 하나요?** `null`은 "아직 아무것도 못 봤어요"라는 표시예요. `0`으로 시작하면 모든 값이 0보다 커서 지금은 문제없지만, 값이 음수이거나 0 이하일 수 있는 데이터에서는 틀려요. `null`로 시작하고 "처음이거나 더 크면 바꾸기"로 쓰면 어떤 데이터에서도 맞아요. 이 모양이 Day 26의 다음 방송 찾기에서 그대로 나와요.
:::

:::answer 오늘 끝 상태 전체 코드
막혔다면 아래 파일로 맞추고 [Day 18](#/day/p1-d18)을 시작하세요. 파일을 덮어쓰면 내가 바꾼 글(닉네임, 소개 문장, 영상 ID)도 예시 글로 돌아가니 내 글은 먼저 적어 두고, 맞춘 뒤에는 커밋하고 **변경 내용 동기화**를 눌러요. `.git` 폴더는 지우지 마세요. 오늘 바뀐 파일은 연습 폴더의 `lab.html`과 `lab.js`예요. 프로젝트 폴더 `C:\dev\my-creator-site`는 바뀌지 않았어요. `lab.js`는 과제 코드까지 포함한 전체예요. 파일 하나를 통째로 바꿀 때는 VS Code에서 그 파일을 열고 `Ctrl + A`로 전체를 선택한 뒤 붙여 넣고 `Ctrl + S`로 저장해요.

```text
hello/
├─ hello.html
├─ favorites.html
├─ tools.html
├─ links.html
├─ plan.html
├─ pages/
│  └─ back.html
├─ lab.html
└─ lab.js
```

📄 C:\dev\hello\lab.html
```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>JS 연습장</title>
  <script src="lab.js" defer></script>
</head>
<body>
  <h1>JS 연습장</h1>
  <p>개발자 도구 콘솔(F12)을 열어 결과를 보세요.</p>
</body>
</html>
```

📄 C:\dev\hello\lab.js
```js
// Day 17 연습: 배열과 반복문

// 1) 배열 만들기와 꺼내기
const days = ['월', '수', '금', '토'];
console.log(days[0]);
console.log(days[3]);
console.log(days.length);
console.log(days[4]);

// 2) 값 더하기와 바꾸기
const notes = ['장비 점검'];
notes.push('썸네일 만들기');
notes[0] = '마이크 점검';
console.log(notes.length);
console.log(notes[0]);

// 3) for 반복문: 인덱스를 직접 세요
for (let i = 0; i < days.length; i++) {
  console.log(`${i}번째 방송 요일: ${days[i]}`);
}

// 4) for...of 반복문: 값을 하나씩 꺼내요
for (const day of days) {
  console.log(`${day}요일에 만나요`);
}

// 5) 반복 + 계산: 방송 길이(분)의 합계
const minutes = [60, 90, 120];
let totalMinutes = 0;
for (const minute of minutes) {
  totalMinutes = totalMinutes + minute;
}
console.log('방송 길이 합계:', totalMinutes);

// ---------- 과제 1: 합계와 평균 ----------
const hours = [20, 21, 20, 15];
let sum = 0;
for (const hour of hours) {
  sum = sum + hour;
}
console.log('합계:', sum);
console.log('평균:', sum / hours.length);

// ---------- 과제 2: 1~30 중 7의 배수 ----------
for (let n = 1; n <= 30; n++) {
  if (n % 7 === 0) {
    console.log(n);
  }
}

// ---------- 과제 3: 가장 늦은 방송 시각 ----------
let latest = null;
for (const hour of hours) {
  if (latest === null || hour > latest) {
    latest = hour;
  }
}
console.log('가장 늦은 시각:', latest);
```

콘솔에 나오는 결과 전체예요(22줄).

```text
월
토
4
undefined
2
마이크 점검
0번째 방송 요일: 월
1번째 방송 요일: 수
2번째 방송 요일: 금
3번째 방송 요일: 토
월요일에 만나요
수요일에 만나요
금요일에 만나요
토요일에 만나요
방송 길이 합계: 270
합계: 76
평균: 19
7
14
21
28
가장 늦은 시각: 21
```
:::

## 🧯 자주 막히는 곳

여기에 없는 증상은 [문제 해결 모음](#/page/troubleshooting)에서 찾아보세요.

### 마지막에 undefined가 한 줄 더 나와요

**원인:** `for (let i = 0; i <= days.length; i++)`처럼 `<`가 아니라 `<=`를 썼어요. `days.length`는 4인데 인덱스 4번은 없어서 마지막 한 바퀴에서 `days[4]`가 `undefined`예요.

**해결:**

1. `for` 괄호 안의 조건을 `i < days.length`로 고쳐요(`<=` 아니에요).
2. 저장하고 새로 고침해서 `undefined`가 사라지면 해결이에요.

### 브라우저 탭이 멈췄어요 (무한 반복)

**원인:** 반복이 끝나지 않는 코드예요. `i++`를 빠뜨렸거나 `i--`로 썼어요.

**해결:**

1. 탭이 응답하지 않는다는 창이 뜨면 **페이지 닫기**를 눌러요. 안 되면 `Ctrl + Shift + Esc`로 **작업 관리자**를 열고 브라우저(Edge 또는 Chrome) 항목을 골라 **작업 끝내기**를 눌러요.
2. 브라우저를 다시 열고 `lab.js`의 `for`에서 세 번째 부분이 `i++`인지 확인해요.
3. 저장하고 `lab.html`을 열어 콘솔에 결과가 나오면 해결이에요.

### for 괄호에서 Identifier 'i' has already been declared

```text
Uncaught SyntaxError: Identifier 'i' has already been declared
```

**원인:** `for (let i = 0, i < 4, i++)`처럼 세미콜론(`;`) 대신 쉼표(`,`)를 썼어요. 쉼표는 변수를 여러 개 만든다는 뜻이라, JavaScript는 `i`를 두 번 만든다고 읽어요.

**해결:**

1. `for (let i = 0; i < 4; i++)`처럼 세 부분을 세미콜론으로 나눠요.
2. 저장하고 새로 고침해서 오류가 사라지면 해결이에요.

### 값 대신 0, 1, 2, 3이 나와요

**원인:** `for (const day of days)`를 `for (const day in days)`로 썼어요. `in`은 값이 아니라 **인덱스 번호**를 꺼내요.

**해결:**

1. `in`을 `of`로 고쳐요: `for (const day of days)`.
2. 저장하고 새로 고침해서 `월`, `수`… 요일이 나오면 해결이에요.

### lab.js가 연결 안 됐어요 (콘솔이 비어 있어요)

**원인:** `lab.html`과 `lab.js`가 다른 폴더에 있거나, `lab.html`의 `<script src="lab.js" defer></script>` 줄이 없거나 오타예요. `lab.js`가 `lab.js.txt`로 저장됐을 수도 있어요.

**해결:**

1. 파일 탐색기에서 `C:\dev\hello`를 열어 `lab.html`과 `lab.js`가 **같은 폴더**에 있는지 확인해요(확장명이 보이게 켜 두었는지도 봐요, Day 1).
2. `lab.html`의 `<head>`에 `<script src="lab.js" defer></script>`가 있는지 확인해요.
3. 브라우저 탭에서 `Ctrl + F5`로 새로 고침해서 콘솔에 출력이 나오면 해결이에요.

### 프로젝트 창과 연습장 창을 헷갈렸어요

**원인:** VS Code 창이 두 개여서 파일을 엉뚱한 창에서 고쳤어요. 창 맨 위 제목에 폴더 이름이 보여요.

**해결:**

1. 작업 표시줄의 VS Code 아이콘 위에 마우스를 올리면 창 두 개의 미리 보기가 보여요. 제목에 `hello`가 있는 창이 연습장이에요.
2. `lab.js`가 `my-creator-site` 폴더 안에 잘못 만들어졌다면 소스 제어 패널에 변경이 생겨요. 그 파일을 탐색기에서 오른쪽 클릭 → **삭제**로 지우고(잘못 만든 파일만이에요), 연습장 창에서 다시 만들어요.
3. 프로젝트 창의 소스 제어 변경이 0개로 돌아오면 해결이에요.

## 📝 오늘의 체크리스트

- [ ] `C:\dev\hello`에 `lab.html`과 `lab.js`가 있어요.
- [ ] `lab.html`을 브라우저로 열면 콘솔에 요일 4줄(`월요일에 만나요`…)이 나와요.
- [ ] 배열의 첫 값은 인덱스 `0`이라는 걸 설명할 수 있어요.
- [ ] `for`와 `for...of`의 차이를 내 말로 설명할 수 있어요.
- [ ] 반복문으로 합계(270)를 구했어요.
- [ ] 7의 배수(`7`, `14`, `21`, `28`)와 가장 늦은 시각(`21`)을 출력했어요.
- [ ] 프로젝트 `my-creator-site` 창의 소스 제어 변경이 0개예요.
- [ ] 과제 1~3을 풀고 정답과 비교했어요.

## 📚 더 알아보기

- [MDN · 배열](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array): 배열 만들기와 쓸 수 있는 메서드를 모아 보여 줘요.
- [MDN · for 문](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/for): for 반복문의 세 부분을 설명해요.
- [MDN · for...of 문](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/for...of): 값을 하나씩 꺼내는 반복문의 문법과 예제를 보여 줘요.

➡️ **다음 Day 예고:** [Day 18 · 함수](#/day/p1-d18)에서는 자주 쓰는 코드에 이름을 붙여 여러 번 부르는 함수를 배워요. 같은 연습장에서 이어서 해요.
