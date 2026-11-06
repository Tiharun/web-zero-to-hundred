## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- `function 이름(매개변수) { … }`로 함수를 만들고, `이름(값)`으로 불러서 결과를 받을 수 있어요.
- `return`이 하는 일과, `return`이 없을 때 결과가 `undefined`인 이유를 설명할 수 있어요.
- 화살표 함수 `(n) => n * 2`를 읽고 쓸 수 있어요.
- `{ }` 안에서 만든 변수를 밖에서 쓸 수 없는 이유(스코프)를 오류 문장으로 확인할 수 있어요.

**예상 시간: 100분** (개념 이해 24분 · 따라하기 44분 · 과제 26분 · 정리 6분)

:::path 📂 시작 상태
어제(Day 17)까지의 상태가 이렇게 있어야 해요. 없거나 다르면 [Day 17](#/day/p1-d17)의 "오늘 끝 상태 전체 코드"로 맞춰 주세요. 오늘도 프로젝트 파일은 바꾸지 않고 연습장에서 연습해요.

- `C:\dev\hello\lab.html` (`<script src="lab.js" defer></script>`가 있어요)
- `C:\dev\hello\lab.js` (Day 17의 배열·반복문 연습 코드가 들어 있어요. 오늘 처음부터 새로 써요)
- `C:\dev\my-creator-site\` 프로젝트: `index.html`, `about.html`, `contents.html`, `schedule.html`, `contact.html`, `css\style.css`, `js\main.js`(인사말 코드까지)
- GitHub Pages가 켜져 있어요: `https://<내 아이디>.github.io/my-creator-site/`
- VS Code(한국어 팩, Live Preview 확장 프로그램)와 Edge 또는 Chrome이 있어요.
- 프로젝트 변경은 모두 커밋·푸시했어요. 오늘도 프로젝트를 바꾸지 않아요.
:::

## 📖 개념 이해

### 코드에 이름 붙이기: 함수

**비유:** 자판기를 떠올려 보세요. 돈과 버튼 번호(입력)를 넣으면, 안에서 정해진 동작이 일어나고 음료수(결과)가 나와요. 자판기 안이 어떻게 생겼는지 몰라도 "버튼 5번 + 천 원 → 콜라"만 알면 쓸 수 있어요. 함수도 똑같이 "입력을 받고, 일을 하고, 결과를 돌려주는" 상자예요.

**정확한 정의:** **[[함수]]**(function)는 여러 줄의 코드를 하나로 묶고 이름을 붙여, 필요할 때 불러 쓰는 것이에요. 같은 코드를 되풀이해 쓰지 않게 해 주고, 이름만 봐도 무슨 일을 하는지 알 수 있게 해요.

```js
function formatTime(hour, minute) {
  return `${hour}:${minute}`;
}

const text = formatTime(20, 30);
```

- `function formatTime(hour, minute) { … }`: `formatTime`이라는 함수를 **만들어요**(선언). 이 시점에는 아직 실행되지 않아요.
- `formatTime(20, 30)`: 이름 뒤에 **괄호**를 붙여서 **불러요**(호출). 괄호 안의 `20`, `30`은 넘기는 값(인수)이에요.
- 괄호를 빼먹고 `formatTime`만 쓰면 함수를 부르는 게 아니라 함수 자체를 가리켜요. 괄호가 "실행해 줘요"의 신호예요.

함수 이름은 **동사**로 지어요(`makeGreeting`, `formatTime`, `showTitle`). 무슨 일을 하는지 이름에 담기 위해서예요.

### 입력과 출력: 매개변수와 반환값

- **[[매개변수]]**(parameter)는 함수를 부를 때 넘겨받는 값을 담는 변수예요. 위 예에서 `hour`, `minute`이에요. 부를 때 넘긴 `20`, `30`(인수)이 순서대로 들어가요. 매개변수는 그 함수 안에서만 쓸 수 있어요.
- **[[반환값]]**(return value)은 함수가 일을 마치고 부른 쪽에 돌려주는 결과예요. `return 값;`으로 돌려주고, `const text = formatTime(20, 30);`처럼 변수에 받아서 써요.
- `return`을 만나면 함수는 **그 자리에서 끝나요**. `return` 아래 줄은 실행되지 않아요.
- `return`이 없으면 반환값은 `undefined`예요(Day 15에서 배운 "값이 없어요").
- 인수를 매개변수보다 적게 넘기면 남은 매개변수는 `undefined`예요.

조건이 안 맞으면 일찍 끝내는 모양도 자주 써요. 이것을 **이른 return**이라고 불러요.

```js
function showTitle(title) {
  if (!title) {
    return;
  }
  console.log(`제목: ${title}`);
}
```

`!title`은 "title이 비었다면"이라는 뜻이에요(빈 문자열 `''`은 거짓으로 읽혀요, Day 16). 비었으면 `return;`으로 바로 끝내서 아래 줄이 실행되지 않아요. Day 21과 Day 25에서 이 모양을 써요.

### 짧게 쓰기: 화살표 함수

**[[화살표 함수]]**(arrow function)는 `=>` 기호로 짧게 쓰는 함수예요.

```js
const double = (n) => n * 2;
```

읽는 법은 "`n`을 받아서 `n * 2`를 돌려주는 함수를 `double`이라고 불러요"예요. 중괄호를 쓰지 않으면 `=>` 뒤의 식이 바로 반환값이 돼요. 중괄호를 쓰면 `return`을 직접 써야 해요.

```js
const double = (n) => {
  return n * 2;
};
```

화살표 함수는 다른 함수에 값처럼 넘겨서 "나중에 이걸 실행해 줘요"라고 부탁할 때 많이 써요. 이렇게 넘기는 함수를 **콜백**이라고 부르는데, 내일(Day 19) 자세히 배워요. 오늘은 함수도 숫자나 글자처럼 **값**이라서 다른 함수에게 넘길 수 있다는 것만 맛봐요.

### 변수가 살아 있는 범위: 스코프

**[[스코프]]**(scope)는 변수를 쓸 수 있는 범위예요. `let`과 `const`로 만든 변수는 그 변수를 만든 **중괄호 `{ }` 블록 안에서만** 쓸 수 있어요. 블록 밖에서 쓰면 `ReferenceError`가 나요. 반대로 바깥에서 만든 변수는 안쪽 블록과 함수에서도 쓸 수 있어요.

```text
바깥 (siteName)
┌──────────────────┐
│ 함수 { }         │
│  안 (emoji)      │
│  → siteName OK   │
└──────────────────┘
바깥에서 emoji → 오류
```

**비유:** 방 안의 물건은 방 안에서만 쓸 수 있지만, 집 거실의 물건은 방에서도 보여요. 그래서 Day 16의 `let message;`를 `if` 블록 **바깥**에 먼저 만들었어요. 블록 안에서 `const message`로 만들면 블록이 끝나면 사라져서 밖에서 쓸 수 없어요.

:::info 실무에서는
실제 프로젝트에서는 함수 하나가 "한 가지 일"만 하도록 작게 만들어요. 이름만 읽어도 하는 일을 알 수 있고, 고칠 곳이 한 군데로 모이기 때문이에요. 앞으로 만들 `createCard`(카드 만들기), `render`(화면 그리기)가 모두 이런 작은 함수예요.
:::

## 🛠️ 따라하기

모두 8단계예요. 결과는 어제와 같이 `lab.html`의 개발자 도구 **Console**로 확인해요. `lab.html`은 파일 탐색기에서 `C:\dev\hello\lab.html`을 더블클릭하면 열려요. 코드는 직접 타이핑해도 되고 코드 상자 오른쪽 위의 **복사** 버튼으로 복사해도 돼요.

### 1단계 · 연습장 열고 lab.js 비우기 (4분)

어제 쓴 코드는 지우고 오늘 코드를 새로 써요. 어제 코드는 Day 17 정답에 있으니 지워도 괜찮아요.

**어디서:** VS Code, `C:\dev\hello` 폴더가 열린 창(제목에 `hello`). 창이 닫혀 있으면 메뉴 **파일 → 폴더 열기**에서 `C:\dev\hello`를 열어요.

**무엇을:**

1. 탐색기에서 `lab.js`를 클릭해서 열어요.
2. `Ctrl + A`로 전체를 선택하고 `Delete`로 지워요.
3. `Ctrl + S`로 저장해요.
4. 브라우저에서 `lab.html`을 열고 `F12` → **Console**을 열어 둬요. `F5`로 새로 고침해요.

:::success
`lab.js`가 비어 있어요. 브라우저를 새로 고침하면 콘솔이 깨끗해요(빨간 오류도 없어요).
:::

### 2단계 · 함수 만들고 부르기 (9분)

시와 분을 받아서 `20:30` 모양의 글자를 돌려주는 함수를 만들어요.

**어디서:** VS Code `hello` 창, `lab.js`

**무엇을:**

1. 아래 코드를 붙여 넣고 `Ctrl + S`로 저장해요.
2. 브라우저에서 `F5`를 눌러 콘솔을 봐요.

📄 C:\dev\hello\lab.js (일부)
```js
// Day 18 연습: 함수

// 1) 함수 만들기와 부르기
function formatTime(hour, minute) {
  return `${hour}:${minute}`;
}

const startTime = formatTime(20, 30);
console.log(startTime);
console.log(formatTime(9, 5));
```

예상 출력(콘솔):

```text
20:30
9:5
```

:::success
콘솔에 `20:30`과 `9:5` 두 줄이 나와요. 함수에 값을 넘기면 값이 `${hour}:${minute}` 문장에 들어간 글자가 돌아와요. `9:5`처럼 분이 한 자리일 때 `05`로 나오지 않는 건 정상이에요. 0을 채우는 방법은 Day 26에서 배워요.
:::

### 3단계 · return이 없으면? 그리고 이른 return (7분)

반환값이 없는 함수의 결과가 `undefined`인 것을 확인하고, 조건이 안 맞으면 일찍 끝나는 함수를 만들어요.

**어디서:** VS Code `hello` 창, `lab.js` 맨 아래

**무엇을:**

1. 이전 코드 아래에 빈 줄을 하나 넣고 아래 코드를 붙여 넣어요.
2. 저장하고 브라우저에서 `F5`를 눌러요.

📄 C:\dev\hello\lab.js (일부)
```js
// 2) return이 없으면 undefined
function sayHello(name) {
  console.log(`${name}님, 안녕하세요!`);
}

const result = sayHello('달빛곰');
console.log(result);

// 3) 이른 return: 조건이 안 맞으면 바로 끝내요
function showTitle(title) {
  if (!title) {
    return;
  }
  console.log(`제목: ${title}`);
}

showTitle('신청곡 라이브');
showTitle('');
```

예상 출력(콘솔의 이어지는 세 줄):

```text
달빛곰님, 안녕하세요!
undefined
제목: 신청곡 라이브
```

:::success
`달빛곰님, 안녕하세요!`, `undefined`, `제목: 신청곡 라이브` 세 줄이 나와요. `sayHello`는 `return`이 없어서 그 결과를 변수에 받으면 `undefined`예요. `showTitle('')`은 빈 글자라서 `return`으로 일찍 끝나므로 아무것도 출력하지 않아요(그래서 `제목:` 줄이 한 번만 나와요).
:::

### 4단계 · 화살표 함수로 쓰기 (7분)

같은 일을 하는 짧은 함수를 만들어요.

**어디서:** VS Code `hello` 창, `lab.js` 맨 아래

**무엇을:**

1. 이전 코드 아래에 빈 줄을 하나 넣고 아래 코드를 붙여 넣어요.
2. 저장하고 브라우저에서 `F5`를 눌러요.

📄 C:\dev\hello\lab.js (일부)
```js
// 4) 화살표 함수
const double = (n) => n * 2;
console.log(double(21));

const formatTimeArrow = (hour, minute) => `${hour}:${minute}`;
console.log(formatTimeArrow(21, 0));
```

예상 출력(콘솔의 이어지는 두 줄):

```text
42
21:0
```

:::success
`42`와 `21:0`이 나와요. `double(21)`은 21의 두 배인 42이고, 화살표 함수 버전의 `formatTimeArrow`는 2단계의 `formatTime`과 똑같이 시와 분을 글자로 돌려줘요.
:::

### 5단계 · 함수를 다른 함수에 넘겨 보기 (5분)

함수는 값이라서 다른 함수에게 넘길 수 있어요. 넘겨받은 함수를 `action()`으로 부르면 실행돼요.

**어디서:** VS Code `hello` 창, `lab.js` 맨 아래

**무엇을:**

1. 이전 코드 아래에 빈 줄을 하나 넣고 아래 코드를 붙여 넣어요.
2. 저장하고 브라우저에서 `F5`를 눌러요.

📄 C:\dev\hello\lab.js (일부)
```js
// 5) 함수를 값처럼 넘기기 (Day 19에서 자세히 배워요)
function runTwice(action) {
  action();
  action();
}

runTwice(() => {
  console.log('안녕!');
});
```

예상 출력(콘솔의 이어지는 두 줄):

```text
안녕!
안녕!
```

:::success
`안녕!`이 두 번 나와요. `runTwice`는 받은 함수 `action`을 두 번 불러요. `() => { … }`는 이름도 없고 받는 값도 없는 화살표 함수예요. 이렇게 넘기는 함수를 콜백이라고 부르고, 내일 자세히 배워요.
:::

### 6단계 · 안에서 밖의 변수 쓰기 (5분)

함수 안에서 바깥 변수는 읽을 수 있다는 걸 확인해요.

**어디서:** VS Code `hello` 창, `lab.js` 맨 아래

**무엇을:**

1. 이전 코드 아래에 빈 줄을 하나 넣고 아래 코드를 붙여 넣어요.
2. 저장하고 브라우저에서 `F5`를 눌러요.

📄 C:\dev\hello\lab.js (일부)
```js
// 6) 스코프: 안에서는 밖의 변수를 쓸 수 있어요
const siteName = '달빛곰 방송국';

function showSite() {
  const emoji = '🌙';
  console.log(`${emoji} ${siteName}`);
}

showSite();
```

예상 출력(콘솔의 이어지는 한 줄):

```text
🌙 달빛곰 방송국
```

:::success
`🌙 달빛곰 방송국`이 나와요. `showSite` 안에서는 함수 안에서 만든 `emoji`와 바깥에서 만든 `siteName`을 모두 쓸 수 있어요.
:::

### 7단계 · 스코프 오류를 일부러 만들어 보기 (5분)

안에서 만든 변수를 밖에서 쓰면 어떤 오류가 나는지 직접 봐요.

**어디서:** VS Code `hello` 창, `lab.js` 맨 아래

**무엇을:**

1. `lab.js` 맨 아래(`showSite();` 아래)에 한 줄을 더 써요.

```js
console.log(emoji);
```

2. 저장하고 브라우저에서 `F5`를 누른 뒤 콘솔의 빨간 글자를 읽어요.
3. 읽었으면 방금 쓴 `console.log(emoji);` 줄을 **지우고** 저장해요.

원문 오류예요(줄 번호는 달라도 돼요).

```text
Uncaught ReferenceError: emoji is not defined
```

풀이: "`emoji`라는 이름을 모르겠어요." `emoji`는 `showSite` 함수 블록 안에서만 살아 있어서, 밖에서는 이름이 없는 것과 같아요.

:::success
콘솔에 빨간 글자로 위 문장이 나오고, 오른쪽에 `lab.js:` 다음에 줄 번호가 보여요. 앞의 정상 출력 줄들은 오류 위쪽에 그대로 있어요. 줄을 지우고 저장하면 오류가 사라져요.
:::

### 8단계 · 프로젝트는 그대로인지 확인하기 (2분)

**어디서:** VS Code `my-creator-site` 창, **소스 제어** 패널(`Ctrl + Shift + G`)

**무엇을:** 변경 목록을 확인해요.

:::success
소스 제어 패널의 변경이 `0`개예요. 오늘도 연습장(`C:\dev\hello`)만 바꿨으니 커밋하지 않아도 돼요.
:::

## ✍️ 과제

과제 코드는 `lab.js`의 맨 아래에 이어서 써요.

### 과제 1 · 인사 함수 (쉬움 ⭐, 8분)

`makeGreeting(name)` 함수를 만들어요.

- `name`을 받아서 `` `${name}님, 어서 오세요!` `` 글자를 **돌려줘요**(`return`).
- 이름 세 개(`'달빛곰'`, `'시청자'`, `'구독자'`)로 세 번 불러서 `console.log`로 출력해요.

힌트: 함수 안에서 `console.log`를 하지 말고 `return`을 써요. 출력은 부르는 쪽에서 해요.

### 과제 2 · 화살표 함수로 바꾸기 (보통 ⭐⭐, 8분)

1번 함수를 화살표 함수로 두 가지 모양으로 써요. 이름은 겹치지 않게 `makeGreetingArrow`, `makeGreetingBlock`으로 해요.

- 중괄호 없는 한 줄 버전(`makeGreetingArrow`)
- 중괄호와 `return`을 쓴 버전(`makeGreetingBlock`)
- 둘 다 `'달빛곰'`으로 불러서 출력해요.

힌트: 중괄호를 쓰면 `return`을 직접 써야 해요.

### 과제 3 · 스코프 퀴즈 (도전 ⭐⭐⭐, 10분)

`if` 블록 안에서 만든 `const message`를 블록 밖에서 출력하면 어떻게 되는지 확인해요.

- 콘솔 연습을 하려면 `lab.js`에 임시로 아래 코드를 쓰고 오류 문장을 읽어요. 읽었으면 지워요.
- 같은 일을 오류 없이 하려면 어떻게 고쳐야 하는지 써서 `lab.js`에 남겨 둬요.
- Day 16의 인사말 코드(`main.js`의 `let message;`)를 다시 읽고, 왜 `let message;`를 `if` **바깥**에서 먼저 만들었는지 한 줄로 적어요.

힌트: 오류 문장은 `ReferenceError`로 시작해요.

## ✅ 정답

:::answer 과제 1 정답 · 인사 함수
📄 C:\dev\hello\lab.js (일부)
```js
// ---------- 과제 1: 인사 함수 ----------
function makeGreeting(name) {
  return `${name}님, 어서 오세요!`;
}

console.log(makeGreeting('달빛곰'));
console.log(makeGreeting('시청자'));
console.log(makeGreeting('구독자'));
```

예상 출력(콘솔의 이어지는 세 줄):

```text
달빛곰님, 어서 오세요!
시청자님, 어서 오세요!
구독자님, 어서 오세요!
```

**왜 이렇게 하나요?** 함수는 결과를 `return`으로 돌려주고, 보여 줄지 말지는 부른 쪽이 정해요. 이렇게 하면 같은 함수를 화면에 쓰거나 다른 계산에 쓰는 등 여러 곳에서 다시 쓸 수 있어요.
:::

:::answer 과제 2 정답 · 화살표 함수로 바꾸기
📄 C:\dev\hello\lab.js (일부)
```js
// ---------- 과제 2: 화살표 함수로 바꾸기 ----------
const makeGreetingArrow = (name) => `${name}님, 어서 오세요!`;
console.log(makeGreetingArrow('달빛곰'));

const makeGreetingBlock = (name) => {
  return `${name}님, 어서 오세요!`;
};
console.log(makeGreetingBlock('달빛곰'));
```

예상 출력(콘솔의 이어지는 두 줄):

```text
달빛곰님, 어서 오세요!
달빛곰님, 어서 오세요!
```

**왜 이렇게 하나요?** 중괄호가 없으면 `=>` 뒤의 식(`` `${name}님, 어서 오세요!` ``)이 그대로 반환값이에요. 중괄호를 쓰면 여러 줄을 쓸 수 있지만 `return`을 직접 써야 해요. `return`을 빠뜨리면 결과가 `undefined`가 돼요.
:::

:::answer 과제 3 정답 · 스코프 퀴즈
오류를 내는 코드예요(확인만 하고 지워요).

```js
if (siteName === '달빛곰 방송국') {
  const message = '맞아요!';
}
console.log(message);
```

```text
Uncaught ReferenceError: message is not defined
```

풀이: `message`는 `if` 블록 `{ }` 안에서 만든 변수라서 블록이 끝나면 사라져요. 밖의 `console.log(message)`는 그런 이름을 모르는 거예요.

오류 없이 고치려면 `message`를 블록 **바깥**에서 `let`으로 먼저 만들어요.

📄 C:\dev\hello\lab.js (일부)
```js
// ---------- 과제 3: 스코프 퀴즈 ----------
let message;
if (siteName === '달빛곰 방송국') {
  message = '맞아요!';
}
console.log(message);
```

예상 출력(콘솔의 마지막 줄):

```text
맞아요!
```

**왜 이렇게 하나요?** Day 16의 인사말 코드도 이렇게 `let message;`를 `if (hour < 6)` 같은 갈래들 **바깥**에서 먼저 만들고, 갈래 안에서 값을 넣어요. 그래야 갈래가 끝난 뒤 `greeting.textContent = message;`에서 쓸 수 있어요. `let`을 쓴 이유는 값을 나중에 한 번 넣기 때문이에요.
:::

:::answer 오늘 끝 상태 전체 코드
막혔다면 아래 파일로 맞추고 [Day 19](#/day/p1-d19)를 시작하세요. 오늘 바뀐 파일은 연습장의 `lab.js` 하나예요. `lab.html`은 Day 17과 같고 프로젝트 폴더 `C:\dev\my-creator-site`도 바뀌지 않았어요. `lab.js`는 과제 코드까지 포함한 전체예요. VS Code에서 `lab.js`를 열고 `Ctrl + A`로 전체를 선택한 뒤 붙여 넣고 `Ctrl + S`로 저장해요.

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

📄 C:\dev\hello\lab.js
```js
// Day 18 연습: 함수

// 1) 함수 만들기와 부르기
function formatTime(hour, minute) {
  return `${hour}:${minute}`;
}

const startTime = formatTime(20, 30);
console.log(startTime);
console.log(formatTime(9, 5));

// 2) return이 없으면 undefined
function sayHello(name) {
  console.log(`${name}님, 안녕하세요!`);
}

const result = sayHello('달빛곰');
console.log(result);

// 3) 이른 return: 조건이 안 맞으면 바로 끝내요
function showTitle(title) {
  if (!title) {
    return;
  }
  console.log(`제목: ${title}`);
}

showTitle('신청곡 라이브');
showTitle('');

// 4) 화살표 함수
const double = (n) => n * 2;
console.log(double(21));

const formatTimeArrow = (hour, minute) => `${hour}:${minute}`;
console.log(formatTimeArrow(21, 0));

// 5) 함수를 값처럼 넘기기 (Day 19에서 자세히 배워요)
function runTwice(action) {
  action();
  action();
}

runTwice(() => {
  console.log('안녕!');
});

// 6) 스코프: 안에서는 밖의 변수를 쓸 수 있어요
const siteName = '달빛곰 방송국';

function showSite() {
  const emoji = '🌙';
  console.log(`${emoji} ${siteName}`);
}

showSite();

// ---------- 과제 1: 인사 함수 ----------
function makeGreeting(name) {
  return `${name}님, 어서 오세요!`;
}

console.log(makeGreeting('달빛곰'));
console.log(makeGreeting('시청자'));
console.log(makeGreeting('구독자'));

// ---------- 과제 2: 화살표 함수로 바꾸기 ----------
const makeGreetingArrow = (name) => `${name}님, 어서 오세요!`;
console.log(makeGreetingArrow('달빛곰'));

const makeGreetingBlock = (name) => {
  return `${name}님, 어서 오세요!`;
};
console.log(makeGreetingBlock('달빛곰'));

// ---------- 과제 3: 스코프 퀴즈 ----------
let message;
if (siteName === '달빛곰 방송국') {
  message = '맞아요!';
}
console.log(message);
```

콘솔에 나오는 결과 전체예요(16줄).

```text
20:30
9:5
달빛곰님, 안녕하세요!
undefined
제목: 신청곡 라이브
42
21:0
안녕!
안녕!
🌙 달빛곰 방송국
달빛곰님, 어서 오세요!
시청자님, 어서 오세요!
구독자님, 어서 오세요!
달빛곰님, 어서 오세요!
달빛곰님, 어서 오세요!
맞아요!
```
:::

## 🧯 자주 막히는 곳

여기에 없는 증상은 [문제 해결 모음](#/page/troubleshooting)에서 찾아보세요.

### 함수 내용이 글자로 출력돼요 (괄호를 안 붙였어요)

**원인:** `console.log(formatTime)`처럼 이름만 쓰고 `()`를 붙이지 않았어요. 함수를 부르지 않고 함수 자체를 출력해서, 콘솔에 함수의 코드 모양(`function formatTime(hour, minute) { … }` 또는 `ƒ formatTime(hour, minute)`)이 나와요.

**해결:**

1. 부르는 곳에 괄호와 값을 붙여요: `console.log(formatTime(20, 30))`.
2. 저장하고 새로 고침해서 `20:30`처럼 결과가 나오면 해결이에요.

### 결과가 undefined로 나와요

**원인:** 함수 안에서 `return`을 빠뜨렸어요. `return`이 없으면 반환값은 `undefined`예요. 중괄호를 쓴 화살표 함수에서 `return`을 빼먹는 경우가 가장 많아요.

**해결:**

1. 함수 안에 `return 값;` 줄이 있는지 확인해요.
2. 중괄호 `{ }`가 있는 화살표 함수라면 `return`을 직접 써요. 한 줄로 쓰고 싶으면 중괄호를 지워요.
3. 저장하고 새로 고침해서 값이 나오면 해결이에요.

### 인수를 적게 넘겼더니 undefined나 NaN이 나와요

**원인:** `function add(a, b)`를 `add(1)`처럼 부르면 `b`가 `undefined`예요. 숫자 계산에서는 `1 + undefined`가 `NaN`(숫자가 아니에요)이 돼요.

**해결:**

1. 함수 정의의 매개변수 개수와 부를 때 넘기는 값의 개수가 같은지 확인해요.
2. 값을 순서대로 모두 넘기도록 고치고, 저장해서 새로 고침해요. 숫자가 나오면 해결이에요.

### Uncaught SyntaxError: Unexpected token '>' (화살표 함수)

```text
Uncaught SyntaxError: Unexpected token '>'
```

**원인:** 화살표 `=>`를 `= >`처럼 떼어서 썼어요. `=`와 `>`는 붙어 있어야 하나의 화살표예요.

**해결:**

1. 화살표 부분을 `=>`로 붙여서 고쳐요(`const double = (n) => n * 2;`).
2. 저장하고 새로 고침해서 오류가 사라지면 해결이에요.

### Identifier ... has already been declared

```text
Uncaught SyntaxError: Identifier 'greet' has already been declared
```

**원인:** 같은 이름의 함수나 변수를 두 번 만들었어요(`function greet`와 `const greet`처럼). `lab.js`에 어제 코드를 지우지 않고 오늘 코드를 이어 쓴 경우에도 이름이 겹칠 수 있어요.

**해결:**

1. 오류 문장의 따옴표 안 이름(`greet`)을 `Ctrl + F`로 `lab.js`에서 찾아요.
2. 하나의 이름을 다른 이름으로 바꾸거나 중복된 쪽을 지워요.
3. 저장하고 새로 고침해서 오류가 사라지면 해결이에요.

### 함수를 만들기만 했는데 아무 일도 안 일어나요

**원인:** 함수는 **부를 때** 실행돼요. `function formatTime() { … }`을 만들기만 하고 `formatTime(…)`을 부르지 않으면 콘솔에 아무것도 안 나와요.

**해결:**

1. `lab.js` 아래쪽에 `console.log(formatTime(20, 30));`처럼 함수를 부르는 줄이 있는지 확인해요.
2. 저장하고 새로 고침해서 결과가 나오면 해결이에요.

## 📝 오늘의 체크리스트

- [ ] `lab.js`에서 `formatTime(20, 30)`이 `20:30`을 돌려주는 걸 콘솔에서 봤어요.
- [ ] `return`이 없는 함수의 결과가 `undefined`인 걸 확인했어요.
- [ ] 화살표 함수 `(n) => n * 2`를 읽을 수 있어요.
- [ ] 함수 안에서 만든 변수를 밖에서 쓰면 `ReferenceError`가 나는 걸 직접 봤어요.
- [ ] `makeGreeting`을 세 번 불러 세 줄을 출력했어요.
- [ ] 프로젝트 `my-creator-site` 창의 소스 제어 변경이 0개예요.
- [ ] 과제 1~3을 풀고 정답과 비교했어요.

## 📚 더 알아보기

- [MDN · 함수](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Functions): 함수 선언, 호출, 반환값을 차근차근 설명해요.
- [MDN · 화살표 함수 표현식](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/Arrow_functions): 화살표 함수의 여러 모양을 예제로 보여 줘요.
- [MDN · 스코프](https://developer.mozilla.org/ko/docs/Glossary/Scope): 변수를 쓸 수 있는 범위의 뜻을 설명해요.

➡️ **다음 Day 예고:** [Day 19 · 객체와 배열 메서드](#/day/p1-d19)에서는 영상 한 편의 정보를 객체로 묶고, 배열에 `forEach`·`map`·`filter`를 써서 영상 목록 데이터를 다뤄 `js\contents.js`를 처음 만들어요.
