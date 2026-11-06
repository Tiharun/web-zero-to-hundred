## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- HTML(내용), CSS(모양), JavaScript(동작)가 각각 무슨 일을 하는지 설명할 수 있어요.
- `js\main.js` 파일을 만들고 다섯 페이지에 `<script src="js/main.js" defer></script>`로 연결할 수 있어요.
- 개발자 도구의 **콘솔**을 열어 `console.log()`의 출력과 직접 입력한 코드의 결과를 볼 수 있어요.
- 변수(`let`, `const`), 문자열·숫자·불리언 같은 자료형, 연산자를 콘솔에서 써 볼 수 있어요.
- 빨간 오류 문장(`ReferenceError`, `TypeError`)을 읽고 무슨 뜻인지 말할 수 있어요.

**예상 시간: 90분** (개념 이해 22분 · 따라하기 44분 · 과제 20분 · 정리 4분)

:::path 📂 시작 상태
어제(Day 14)까지 만든 파일이 이렇게 있어야 해요. 없거나 다르면 [Day 14](#/day/p1-d14)의 "오늘 끝 상태 전체 코드"로 맞춰 주세요.

- `C:\dev\my-creator-site\index.html`, `about.html`, `contents.html`, `schedule.html`, `contact.html`
- `C:\dev\my-creator-site\css\style.css` (색을 `var(--accent)` 같은 CSS 변수로 쓰고, 맨 위에 `:root`가 있어요)
- `C:\dev\my-creator-site\images\profile.svg`, `logo.svg`, `thumb-game.svg`, `thumb-talk.svg`, `thumb-music.svg`
- GitHub Pages가 켜져 있어요: `https://<내 아이디>.github.io/my-creator-site/`
- VS Code에서 `C:\dev\my-creator-site` 폴더가 열려 있고, Live Preview 확장 프로그램이 설치되어 있어요.
- 어제 변경은 모두 커밋·푸시했어요(소스 제어 패널의 변경 0개).
:::

## 📖 개념 이해

### 웹페이지의 세 가지 재료

**비유:** 사람의 몸에 빗대면, HTML은 **뼈대**(무엇이 있는지), CSS는 **옷과 모습**(어떻게 보이는지), JavaScript는 **근육**(움직이고 반응하는 것)이에요.

**정확한 정의:** **[[JavaScript]]**(자바스크립트)는 웹페이지가 움직이고 반응하게 만드는 프로그래밍 언어예요. 브라우저 안에서 실행되어 버튼을 누르면 메뉴를 열고, 데이터를 읽어 화면에 그리고, 시간을 계산해요. 보통 `.js` 파일에 써서 `<script>`로 HTML에 연결해요. 이름은 비슷해도 Java라는 다른 언어와는 관계가 없어요.

앞으로 Day 16부터 30까지 이 사이트에 인사말, 메뉴 버튼, 다크 모드, 영상 목록, 카운트다운을 JavaScript로 하나씩 더해 가요. 오늘은 그 첫걸음으로 파일을 만들고 연결해서, 연결이 잘 됐는지 확인하는 방법을 배워요.

### 스크립트를 연결하는 한 줄: defer

```html
<script src="js/main.js" defer></script>
```

- `<script>`는 JavaScript 파일을 불러오는 태그예요. `src`에 파일 경로를 적어요. 상대 경로는 Day 4에서 배운 그대로예요(`css/style.css`를 `link`로 불러온 것과 같아요).
- **[[defer]]**(디퍼)는 "HTML을 끝까지 읽은 다음에 이 스크립트를 실행해 줘요"라는 속성이에요. 그래서 `<head>` 안에 두어도 스크립트가 찾으려는 요소가 이미 만들어져 있어요. `defer`가 없으면 아직 읽지 않은 요소를 찾다가 `null` 오류가 나기 쉬워요.

### 눈으로 확인하는 창: 콘솔

**[[콘솔]]**(console)은 개발자 도구의 **Console** 창이에요. `console.log()`로 출력한 값과 JavaScript 오류 문장이 여기에 나오고, 맨 아래 칸에 코드를 직접 쳐서 바로 실행해 볼 수도 있어요. 빨간 글자는 오류, 노란 글자는 경고예요. 개발자 도구는 Edge나 Chrome에서 연 페이지에서만 써요. VS Code 안의 Live Preview 미리 보기 창에서는 `F12`가 열리지 않아요. 그 창 위쪽의 주소(`http://127.0.0.1:3000/…`, 숫자는 달라도 돼요)를 복사해 Edge나 Chrome 주소창에 붙여 넣으면 돼요. 더블클릭으로 연 페이지는 이미 브라우저라 그대로 `F12`를 눌러요.

JavaScript 한 줄을 **문장**(statement)이라고 해요. 문장 끝에는 세미콜론(`;`)을 붙여요. `//` 뒤는 한 줄 주석이라서 실행되지 않아요.

### 값에 이름 붙이기: 변수와 자료형

**비유:** 이름표가 붙은 상자예요. 상자 안에 값을 넣어 두고, 이름으로 꺼내 써요.

**정확한 정의:** **[[변수]]**(variable)는 값에 이름을 붙여 담아 두는 상자예요. 두 가지로 만들어요.

- `const`는 한 번 넣으면 **바꿀 수 없는** 상자예요. 기본은 `const`로 만들어요.
- `let`은 나중에 **바꿀** 상자예요.

```js
const siteName = '달빛곰 방송국';
let days = 4;
days = days + 1;
```

여기서 `=`는 수학의 "같다"가 아니라 "오른쪽 값을 왼쪽 상자에 **넣어요**"라는 뜻이에요. 이름은 영어 소문자로 시작하고, 낱말이 이어지면 다음 낱말을 대문자로 써요(`siteName`). 이런 모양을 camelCase(낙타 등 모양)라고 불러요.

값에는 종류가 있어요. 이 값의 종류를 **[[자료형]]**(data type)이라고 해요. 종류에 따라 쓸 수 있는 연산이 달라요.

| 자료형 | 예 | 뜻 |
|---|---|---|
| **[[문자열]]** | `'달빛곰'` | 따옴표로 감싼 글자 |
| 숫자 | `20`, `3.5` | 계산할 수 있는 수 |
| **[[불리언]]** | `true`, `false` | 참/거짓 둘 중 하나 |
| **[[undefined]]** | `undefined` | 아직 값이 정해지지 않았어요 |
| **[[null]]** | `null` | 일부러 비워 뒀어요 |

`typeof 값`을 쓰면 그 값의 종류를 알려 줘요(`typeof 20`은 `'number'`). 이 교재는 문자열에 작은따옴표(`'…'`)를 써요.

:::info 실무에서는
`undefined`는 "깜빡하고 값을 안 넣었다"에 가깝고, `null`은 "여기에는 값이 없다고 일부러 적어 둔다"에 가까워요. 앞으로 `document.querySelector()`가 찾는 요소가 없을 때 `null`을 돌려주는 걸 자주 만나요. 참고로 `typeof null`은 `'object'`라고 나오는데, 오래된 JavaScript의 알려진 특이점이라서 이상한 게 아니에요.
:::

### 연산자와 자료형 바꾸기

**[[연산자]]**(operator)는 값을 계산하거나 비교하는 기호예요.

- `+ - * /`는 사칙 연산이에요. `%`는 나눈 **나머지**예요(`10 % 3`은 `1`).
- 문자열에 `+`를 쓰면 이어 붙여요(`'달빛곰' + ' 방송국'`은 `'달빛곰 방송국'`).
- `>`, `<`는 크기 비교예요. 참(`true`)이나 거짓(`false`)이 나와요. 자세한 비교는 내일(Day 16) 배워요.

문자열 `'20'`과 숫자 `20`은 달라요. `'20' + 1`은 글자를 이어 붙인 `'201'`이 되고, `20 + 1`은 `21`이에요. 그래서 종류를 바꾸는 도구를 써요.

- `String(5)`는 숫자를 글자 `'5'`로, `Number('20')`는 글자를 숫자 `20`으로 바꿔요.
- 글자가 숫자로 바꿀 수 없는 모양이면 `Number('스물')`처럼 **[[NaN]]**(Not a Number, "숫자가 아니에요")이라는 특별한 값이 나와요.

### 오류는 친구예요

JavaScript 코드가 잘못되면 콘솔에 **빨간 글자**로 오류가 나와요. 무서워하지 말고 읽어요. 오류는 "여기가 이래서 안 돼요"라고 알려 주는 단서예요. 문장 맨 앞의 `Uncaught`는 "아무도 처리하지 않은"이라는 뜻이고, 그다음 `ReferenceError`나 `TypeError` 같은 종류와 이유가 와요.

## 🛠️ 따라하기

모두 8단계예요. 콘솔 입력은 되도록 직접 타이핑해요. 따옴표는 `'`(작은따옴표)이고, 한글 입력 상태가 아니라 **영어 입력 상태**에서 쳐요(`한/영` 키로 바꿔요).

### 1단계 · 콘솔을 열고 계산해 보기 (5분)

파일을 만들기 전에, 콘솔에서 JavaScript가 바로 실행되는 것을 먼저 봐요.

**어디서:** 파일 탐색기에서 `C:\dev\my-creator-site\index.html`을 더블클릭해서 Edge(또는 Chrome)로 열어요.

**무엇을:**

1. 키보드의 `F12`를 눌러요(노트북은 `Fn + F12`일 수 있어요). `Ctrl + Shift + I`도 돼요.
2. 개발자 도구 위쪽 탭에서 **Console**(콘솔)을 클릭해요. 한국어 화면은 **콘솔**일 수 있어요.
3. 맨 아래 입력 칸(`>` 표시)을 클릭해요.
4. `1 + 2`를 입력하고 `Enter`를 눌러요.

:::success
입력한 줄 아래에 `3`이 나와요. 입력 칸에서 계산한 값이 바로 결과로 보여요. 이 창이 JavaScript를 바로 실행해 볼 수 있는 연습장이에요.
:::

### 2단계 · js 폴더와 main.js 만들기 (5분)

앞으로 모든 페이지가 함께 쓰는 JavaScript 파일을 만들어요. CSS를 `css` 폴더에 둔 것처럼 `js` 폴더에 둬요.

**어디서:** VS Code, 왼쪽 **탐색기**에서 `my-creator-site` 폴더 맨 아래 빈 곳

**무엇을:**

1. 탐색기의 빈 곳(파일 목록 아래)을 오른쪽 클릭하고 **새 폴더**를 클릭해요. 이름은 `js`를 입력하고 `Enter`를 눌러요.
2. 방금 만든 `js` 폴더를 오른쪽 클릭하고 **새 파일**을 클릭해요. 이름은 `main.js`를 입력하고 `Enter`를 눌러요.
3. 열린 빈 `main.js`에 아래 코드를 붙여 넣고 `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\js\main.js
```js
// ==========================================================
// main.js - 모든 페이지에서 쓰는 코드
// (HTML에서 <script src="js/main.js" defer>로 불러와요)
// ==========================================================

console.log('main.js가 연결됐어요!');
```

`console.log('…')`는 괄호 안의 값을 콘솔에 출력해요. 이 줄은 연결이 잘 됐는지 확인하는 임시 줄이에요. 내일(Day 16) 지우고 진짜 기능을 넣어요.

:::warn main.js를 더블클릭하지 마세요
Windows에서는 `.js` 파일을 더블클릭하면 브라우저가 아니라 Windows가 스크립트로 실행하려고 해서 오류 창이 뜰 수 있어요(창의 문구는 버전에 따라 달라요). 이 파일은 **VS Code에서 열어서 편집**하고, 직접 열지 않아요. 파일 탐색기에서 실수로 열었다면 오류 창을 닫기(`확인`)만 하면 돼요.
:::

:::success
VS Code 탐색기에 `js` 폴더가 생기고 그 안에 `main.js`가 보여요. 파일 이름 끝이 `.js`이고 `.js.js`나 `.txt`가 붙지 않았어요. 편집기 위쪽 탭에 `main.js`가 보여요.
:::

### 3단계 · index.html에 연결하기 (4분)

HTML이 `main.js`를 불러오도록 `<script>` 줄을 넣어요.

**어디서:** VS Code, `C:\dev\my-creator-site\index.html`, `<head>` 안

**무엇을:**

1. `<link rel="stylesheet" href="css/style.css">` 줄을 찾아요.
2. 그 줄 **바로 아래**에 `<script src="js/main.js" defer></script>` 한 줄을 넣어요. 아래는 `<head>` 전체 모습이에요.
3. `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\index.html (일부)
```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>달빛곰 방송국</title>
  <link rel="stylesheet" href="css/style.css">
  <script src="js/main.js" defer></script>
</head>
```

:::success
`<head>` 안에 `charset`, `viewport`, `title`, 스타일시트 `link`, `script`가 순서대로 있어요. 아직 화면에는 아무 변화가 없어요.
:::

### 4단계 · 나머지 네 페이지에도 연결하기 (7분)

`main.js`는 모든 페이지가 함께 쓰는 파일이라서 다섯 페이지 모두에 같은 줄이 있어야 해요.

**어디서:** VS Code, `about.html`, `contents.html`, `schedule.html`, `contact.html`을 차례로 열어요.

**무엇을:**

1. 파일마다 `<link rel="stylesheet" href="css/style.css">` 줄 아래에 같은 한 줄을 붙여 넣어요.

```html
<script src="js/main.js" defer></script>
```

2. 파일마다 `Ctrl + S`로 저장해요.
3. 다섯 페이지에 모두 들어갔는지 확인해요. `Ctrl + Shift + F`(**파일에서 찾기**)를 누르고 검색 칸에 `js/main.js`를 입력해요.

:::success
검색 결과에 파일이 5개 나오고 파일마다 줄이 1개씩 보여요(`index.html`, `about.html`, `contents.html`, `schedule.html`, `contact.html`). 경로가 `js/main.js`로 모두 같아야 해요. 4개만 나오면 한 페이지를 빠뜨린 거예요.
:::

### 5단계 · 콘솔에서 연결 확인하기 (4분)

브라우저가 `main.js`를 실제로 불러왔는지 콘솔의 한 줄로 확인해요.

**어디서:** Edge 또는 Chrome에서 연 `index.html`, 개발자 도구 **Console**

**무엇을:**

1. 열려 있는 페이지에서 `F5`를 눌러 새로 고침해요.
2. 콘솔에서 새로 찍힌 줄을 봐요.
3. 메뉴로 소개, 영상, 방송 일정, 문의 페이지를 열 때마다 콘솔을 확인해요. 페이지를 옮길 때마다 콘솔이 비워질 수 있어요.

:::success
콘솔에 `main.js가 연결됐어요!`가 한 줄 나오고 줄 오른쪽에 `main.js:6`처럼 파일 이름이 보여요. 다섯 페이지 모두에서 이 한 줄이 나오고 빨간 오류는 없어요. 안 나오면 아래 🧯 자주 막히는 곳의 "콘솔에 아무것도 안 나와요"를 보세요.
:::

### 6단계 · 콘솔에서 변수와 자료형 실험하기 (8분)

이제 콘솔에서 변수와 연산자를 써 봐요. 한 줄씩 직접 입력하고 `Enter`를 눌러요. 한 줄을 입력한 뒤 `Enter`를 치면 바로 실행돼요(여러 줄에 걸쳐 쓰려면 `Shift + Enter`로 줄을 바꿔요).

**어디서:** Edge 또는 Chrome의 개발자 도구 **Console**, 맨 아래 입력 칸(`>`)

**무엇을:** 아래 표의 **입력** 칸을 위에서부터 한 줄씩 입력해요.

| 입력 | 나오는 결과 |
|---|---|
| `const siteName = '달빛곰 방송국'` | `undefined` |
| `siteName` | `'달빛곰 방송국'` |
| `let days = 4` | `undefined` |
| `days = days + 1` | `5` |
| `typeof siteName` | `'string'` |
| `typeof days` | `'number'` |
| `typeof true` | `'boolean'` |
| `10 % 3` | `1` |
| `'달빛곰' + ' 방송국'` | `'달빛곰 방송국'` |
| `'20' + 1` | `'201'` |
| `Number('20') + 1` | `21` |
| `Number('스물')` | `NaN` |

변수를 만드는 줄(`const …`, `let …`)이 `undefined`를 출력하는 것은 정상이에요. 그 줄은 값을 만들어 내는 게 아니라 상자만 만들기 때문이에요.

:::success
표의 결과와 같은 값이 입력 줄 아래에 나와요. 문자열은 따옴표로 감싸서(`'201'`), 숫자는 따옴표 없이(`21`) 보여요. 따옴표가 있느냐 없느냐로 문자열과 숫자를 구별할 수 있어요. 결과가 다르면 입력할 때 오타나 한글 상태 따옴표(`‘ ’`)가 섞였는지 봐요.
:::

### 7단계 · 일부러 오류 내 보기 (4분)

오류 문장을 미리 만나 두면 나중에 당황하지 않아요. 일부러 틀리게 입력해 봐요.

**어디서:** 같은 콘솔 입력 칸

**무엇을:**

1. 이름을 틀리게 입력해요: `siteNmae`(오타)
2. `const`로 만든 상자에 다시 넣어 봐요: `siteName = '새 이름'`

**1번 결과:**

```text
Uncaught ReferenceError: siteNmae is not defined
```

**2번 결과:**

```text
Uncaught TypeError: Assignment to constant variable.
```

풀이는 이래요.

- `ReferenceError: siteNmae is not defined`는 "`siteNmae`라는 이름을 모르겠어요"라는 뜻이에요. 변수 이름 오타일 때 가장 흔히 만나요.
- `TypeError: Assignment to constant variable.`은 "상수(`const`) 변수에 새 값을 넣으려 했어요"라는 뜻이에요. 바꿀 상자는 `let`으로 만들어요.

:::success
두 입력 모두 빨간 글자로 위 문장이 나와요(줄 오른쪽에 `VM123:1` 같은 숫자가 붙어요. 숫자는 달라도 돼요). 페이지는 그대로 멀쩡하고 콘솔만 오류를 알려 줬어요. 오류가 나도 내 파일은 고장 나지 않아요.
:::

### 8단계 · 오늘 작업 커밋·푸시와 배포 주소 확인 (7분)

오늘 바뀐 파일을 Git에 기록하고(커밋) GitHub로 올려요(푸시). 매일 마지막에 하는 습관이에요. Day 7·8에서 한 것과 똑같아요.

**어디서:** VS Code, `C:\dev\my-creator-site` 폴더가 열린 창. 왼쪽 세로 막대의 가지 모양 아이콘(**소스 제어**, `Ctrl + Shift + G`)

**무엇을 (방법 A, 소스 제어 패널):**

1. 위쪽 **메시지** 칸을 클릭하고 `Day 15: JavaScript 시작, main.js 연결`를 입력해요.
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
git commit -m "Day 15: JavaScript 시작, main.js 연결"
```

예상 출력(`a1b2c3d` 같은 해시와 숫자는 달라도 돼요):

```text
[main a1b2c3d] Day 15: JavaScript 시작, main.js 연결
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
브라우저에서 `https://github.com/<내 아이디>/my-creator-site`를 열고 새로 고침(`F5`)하면, 파일 목록 위에 방금 쓴 커밋 메시지 `Day 15: JavaScript 시작, main.js 연결`가 보여요. VS Code 소스 제어 패널의 변경 목록은 비어 있어요.
:::

푸시를 마치면 Pages가 몇 분 안에 새 파일을 반영해요. 반영되면 인터넷 주소에서도 같은 줄이 나오는지 확인해요.

**어디서:** 브라우저, `https://<내 아이디>.github.io/my-creator-site/` (개발자 도구 **Console**)

**무엇을:**

1. 주소를 열고 `Ctrl + F5`로 새로 고침해요. `F12`로 콘솔을 열어요.
2. 반영이 안 됐으면 몇 분 뒤 다시 `Ctrl + F5`를 눌러요(최대 10분).

:::success
인터넷 주소의 콘솔에도 `main.js가 연결됐어요!`가 한 줄 나와요. 내 컴퓨터에서 본 것과 같아요.
:::

## ✍️ 과제

### 과제 1 · 예측하고 확인하기 (쉬움 ⭐, 6분)

아래 식을 콘솔에 입력하기 **전에** 결과를 먼저 종이에 적어 보고, 입력해서 맞는지 확인해요.

- `typeof '20'`
- `typeof 20`
- `typeof true`
- `10 % 3`
- `'20' + 1`
- `Number('20') + 1`
- `Number('스물')`

힌트: 따옴표가 있는지 없는지를 먼저 봐요.

### 과제 2 · 변수로 소개 문장 만들기 (보통 ⭐⭐, 7분)

콘솔에서 변수 두 개를 만들고, 이어 붙여 소개 문장을 만들어요.

- `const name = '달빛곰'`과 `let days = 4`를 차례로 입력해요.
- `name + '은 일주일에 ' + days + '번 방송해요'`를 입력해요.
- 나온 문장을 적어요. 그리고 `days`를 `5`로 바꿨을 때 문장이 어떻게 달라지는지 확인해요.

힌트: `+`로 문자열과 숫자를 이어 붙이면 숫자도 글자가 되어 붙어요. 이런 이어 붙이기가 길어지면 읽기 힘들어서 내일 더 읽기 쉬운 방법(템플릿 리터럴)을 배워요.

### 과제 3 · 오류 원문 두 개 만들기 (도전 ⭐⭐⭐, 7분)

일부러 아래 두 오류를 내고, 화면에 나온 문장을 그대로 적은 뒤 뜻을 내 말로 풀어 써요.

- `ReferenceError`: 문자열인데 따옴표를 안 쓰고 `console.log(안녕)`을 입력해 봐요.
- `TypeError`: `const`로 만든 변수에 다시 값을 넣어 봐요.

힌트: 오류 문장 맨 앞의 `Uncaught`는 "처리되지 않은"이라는 뜻일 뿐이라서 무시하고, 종류와 이유를 읽어요.

## ✅ 정답

:::answer 과제 1 정답 · 예측하고 확인하기
| 입력 | 결과 |
|---|---|
| `typeof '20'` | `'string'` |
| `typeof 20` | `'number'` |
| `typeof true` | `'boolean'` |
| `10 % 3` | `1` |
| `'20' + 1` | `'201'` |
| `Number('20') + 1` | `21` |
| `Number('스물')` | `NaN` |

**왜 이렇게 하나요?** `'20'`은 따옴표가 있어서 숫자가 아니라 **글자**예요. 글자에 `+ 1`을 하면 이어 붙여서 `'201'`이 돼요. `Number('20')`으로 숫자로 바꾼 뒤에야 `21`이라는 계산이 돼요. `10 % 3`은 10을 3으로 나눈 나머지 1이에요.
:::

:::answer 과제 2 정답 · 변수로 소개 문장 만들기
입력과 결과예요.

| 입력 | 결과 |
|---|---|
| `const name = '달빛곰'` | `undefined` |
| `let days = 4` | `undefined` |
| `name + '은 일주일에 ' + days + '번 방송해요'` | `'달빛곰은 일주일에 4번 방송해요'` |
| `days = 5` | `5` |
| `name + '은 일주일에 ' + days + '번 방송해요'` | `'달빛곰은 일주일에 5번 방송해요'` |

**왜 이렇게 하나요?** 문장 안의 숫자를 `days` 변수에 담아 두면, 변수 한 곳만 바꿔도 문장 전체가 따라 바뀌어요. 같은 일을 하는 더 읽기 쉬운 방법인 **템플릿 리터럴**(`` `${name}은 일주일에 ${days}번 방송해요` ``)은 내일(Day 16) 배워요. 콘솔에서는 같은 이름의 `const`·`let`을 다시 만들어도 오류 없이 새 값으로 바뀌어요(Chrome·Edge 기준, 버전에 따라 다를 수 있어요). `.js` 파일 안에서는 같은 이름을 두 번 만들면 오류가 나요(문제 해결 모음의 "Identifier 'days' has already been declared" 항목).
:::

:::answer 과제 3 정답 · 오류 원문 두 개 만들기
**ReferenceError.** `console.log(안녕)`을 입력하면 이렇게 나와요.

```text
Uncaught ReferenceError: 안녕 is not defined
```

뜻: "`안녕`이라는 이름을 모르겠어요." 글자를 따옴표 없이 쓰면 JavaScript는 `안녕`을 변수 이름으로 읽어요. 글자 값이라면 `'안녕'`처럼 따옴표로 감싸요.

**TypeError.** `const siteName = '달빛곰 방송국'`을 만든 뒤 `siteName = '새 이름'`을 입력하면 이렇게 나와요.

```text
Uncaught TypeError: Assignment to constant variable.
```

뜻: "`const`로 만든 상자에는 새 값을 넣을 수 없어요." 바꿀 값이면 처음부터 `let`으로 만들어요.

**왜 이렇게 하나요?** 오류 이름(`ReferenceError`, `TypeError`)은 "어떤 종류의 문제인지"를, 뒤 문장은 "무엇이 문제인지"를 알려 줘요. 이 두 문장을 알아보면 초보 때 만나는 오류의 절반은 읽을 수 있어요.
:::

:::answer 오늘 끝 상태 전체 코드
막혔다면 아래 파일들로 맞추고 [Day 16](#/day/p1-d16)을 시작하세요. 오늘 바뀐 파일은 `js/main.js`(새 파일)와 다섯 페이지의 `<head>`예요. 다섯 페이지 중 `index.html`, `about.html`, `contents.html`, `schedule.html`, `contact.html`은 파일 전체를 실었어요. 파일 하나를 통째로 바꿀 때는 VS Code에서 그 파일을 열고 `Ctrl + A`로 전체를 선택한 뒤 붙여 넣고 `Ctrl + S`로 저장해요.

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
// (HTML에서 <script src="js/main.js" defer>로 불러와요)
// ==========================================================

console.log('main.js가 연결됐어요!');
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

📄 C:\dev\my-creator-site\about.html
```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>소개 - 달빛곰 방송국</title>
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
          <li><a href="index.html">홈</a></li>
          <li><a href="about.html" aria-current="page">소개</a></li>
          <li><a href="contents.html">영상</a></li>
          <li><a href="schedule.html">방송 일정</a></li>
          <li><a href="contact.html">문의</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main class="container">
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

📄 C:\dev\my-creator-site\schedule.html
```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>방송 일정 - 달빛곰 방송국</title>
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
          <li><a href="index.html">홈</a></li>
          <li><a href="about.html">소개</a></li>
          <li><a href="contents.html">영상</a></li>
          <li><a href="schedule.html" aria-current="page">방송 일정</a></li>
          <li><a href="contact.html">문의</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main class="container">
    <h1>방송 일정</h1>
    <p>모든 시간은 한국 시간이에요.</p>

    <table class="schedule-table">
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
          <li><a href="index.html">홈</a></li>
          <li><a href="about.html">소개</a></li>
          <li><a href="contents.html">영상</a></li>
          <li><a href="schedule.html">방송 일정</a></li>
          <li><a href="contact.html" aria-current="page">문의</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main class="container">
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

### 콘솔에 아무것도 안 나와요

**원인:** 흔한 이유는 여섯 가지예요. ① `<script src="…">` 경로가 틀렸어요(`js/main.js`). ② `main.js`가 `js` 폴더 밖에 있어요. ③ 파일 이름이 `main.js.js`나 `main.js.txt`예요. ④ `defer` 철자가 틀렸어요. ⑤ 콘솔의 로그 수준 필터가 꺼져 있어요. ⑥ 브라우저가 옛 파일을 기억해요(캐시).

**해결:**

1. VS Code 탐색기에서 `js` 폴더 안에 `main.js`가 있는지, 이름이 정확한지 확인해요. 파일 탐색기에서 확장명이 보이도록 켜져 있는지도 봐요(Day 1).
2. `index.html`의 `<script src="js/main.js" defer></script>`를 3단계 블록과 글자 하나씩 비교해요.
3. 개발자 도구 Console 창 위쪽의 **기본 수준**(Default levels) 목록을 눌러 **정보**(Info) 항목이 체크되어 있는지 봐요. 화면 문구는 버전에 따라 조금 다를 수 있어요.
4. `Ctrl + F5`로 새로 고침해서 한 줄이 나오면 해결이에요.

### Uncaught SyntaxError: Invalid or unexpected token

```text
Uncaught SyntaxError: Invalid or unexpected token
```

**원인:** "문법에 안 맞는 글자가 있어요"라는 뜻이에요. 가장 흔한 이유는 따옴표가 한글 입력 상태에서 친 둥근 따옴표(`‘ ’`, `“ ”`)이거나 전각 문자(`（`, `；`)가 섞인 거예요. JavaScript는 곧은 따옴표 `'`와 `"`만 알아요.

**해결:**

1. 오류 줄 오른쪽의 파일 이름과 줄 번호(`main.js:6` 같은 링크)를 눌러 문제의 줄을 열어요.
2. 따옴표와 괄호를 지우고 `한/영` 키로 영어 입력 상태인지 확인한 뒤 다시 입력해요.
3. 저장하고 새로 고침해서 오류가 사라지면 해결이에요.

### 문자열인데 ReferenceError가 나와요

**원인:** 글자 값을 따옴표 없이 썼어요. `console.log(안녕)`이면 JavaScript는 `안녕`을 변수 이름으로 읽고, 그런 이름이 없어서 `Uncaught ReferenceError: 안녕 is not defined`가 나요.

**해결:**

1. 글자 값은 작은따옴표로 감싸요: `console.log('안녕')`.
2. 따옴표는 열고 닫는 짝이 맞는지 확인해요. 저장하고 새로 고침해서 글자가 나오면 해결이에요.

### 콘솔에 코드를 붙여 넣으니 막혀요

**원인:** 브라우저는 보안을 위해 **콘솔에 붙여 넣은 코드**를 처음에는 막고 경고를 보여 줄 수 있어요. 모르는 사람이 "이 코드를 붙여 넣어 보세요"라고 시켜서 계정을 훔치는 사기를 막기 위한 장치예요(경고 문구와 풀이 방법은 브라우저와 버전에 따라 달라요).

**해결:**

1. 오늘 콘솔에 입력하는 코드는 짧으니, 붙여 넣지 말고 **직접 타이핑**해요. 이게 가장 안전하고 연습도 돼요.
2. 경고가 `allow pasting`을 입력하라고 안내하면, 내가 직접 쓴 코드를 붙여 넣을 때만 따라 해요. 남이 준 코드는 내용을 이해하기 전에는 붙여 넣지 않아요.

### 코드를 다 쓰기도 전에 실행돼 버려요

**원인:** 콘솔 입력 칸에서 `Enter`를 누르면 그 줄이 바로 실행돼요. 여러 줄로 쓰려고 `Enter`를 누르면 반쯤 쓴 코드가 실행돼요.

**해결:**

1. 줄을 바꿔야 할 때는 `Shift + Enter`를 눌러요.
2. 이미 실행돼 오류가 나면 위쪽 방향키(`↑`)로 직전에 입력한 줄을 불러와 고쳐서 다시 실행해요.

### main.js를 더블클릭했더니 창이 떠요

**원인:** Windows는 `.js` 파일을 브라우저가 아니라 스크립트로 실행하려고 해요. 이 파일은 웹페이지 안에서만 쓰는 파일이에요.

**해결:**

1. 뜬 창은 닫기(`확인`)를 눌러 닫아요. 파일은 망가지지 않아요.
2. `main.js`는 VS Code 탐색기에서 클릭해서 열고 편집해요.
3. 다음부터 파일 탐색기에서 `.js` 파일을 더블클릭하지 않아요.

## 📝 오늘의 체크리스트

- [ ] `C:\dev\my-creator-site\js\main.js` 파일이 있고 이름이 정확해요.
- [ ] 다섯 페이지의 `<head>`에 `<script src="js/main.js" defer></script>`가 있어요.
- [ ] 다섯 페이지 어디서든 콘솔에 `main.js가 연결됐어요!`가 한 줄 나오고 빨간 오류는 없어요.
- [ ] 콘솔에서 `typeof`, `10 % 3`, `'달빛곰' + ' 방송국'`의 결과를 직접 봤어요.
- [ ] `'20' + 1`과 `Number('20') + 1`의 차이를 설명할 수 있어요.
- [ ] `ReferenceError`와 `TypeError` 문장을 읽고 뜻을 말할 수 있어요.
- [ ] 과제 1~3을 풀고 정답과 비교했어요.
- [ ] 인터넷 주소의 콘솔에서도 같은 한 줄을 봤고, GitHub 저장소에 `Day 15: JavaScript 시작, main.js 연결` 커밋이 보여요.

## 📚 더 알아보기

- [MDN · JavaScript 첫걸음](https://developer.mozilla.org/ko/docs/Learn_web_development/Core/Scripting/What_is_JavaScript): JavaScript가 무엇이고 웹페이지에서 어떻게 쓰이는지 설명해요.
- [MDN · script 요소](https://developer.mozilla.org/ko/docs/Web/HTML/Reference/Elements/script): `src`, `defer` 속성의 쓰임을 보여 줘요.
- [Microsoft Edge DevTools · 콘솔 개요](https://learn.microsoft.com/microsoft-edge/devtools/console/): 콘솔 창의 사용법을 설명해요.

➡️ **다음 Day 예고:** [Day 16 · 조건문](#/day/p1-d16)에서는 `if`로 시간에 따라 다른 글을 고르는 법을 배워서, 홈 화면에 지금 시각에 맞는 인사말이 나오게 만들어요.
