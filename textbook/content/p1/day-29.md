## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- 오류가 났을 때 "다시 일어나게 하기 → 오류 원문 읽기 → 위치 찾기 → 가설 → 확인" 순서로 원인을 찾을 수 있어요.
- 개발자 도구 **Sources**에서 **중단점**을 걸어 코드를 한 줄씩 따라가며 변수 값을 볼 수 있어요.
- 일부러 넣은 버그 3개를 찾아 고치고, 소스 제어 패널의 **변경 내용 취소**로 되돌릴 수 있어요.
- 폴더를 완성본과 비교해 정리하고, Markdown 문법으로 `README.md`를 써서 GitHub 저장소 첫 화면에 보이게 해요.

**예상 시간: 100분** (개념 이해 18분 · 따라하기 62분 · 과제 16분 · 정리 4분)

:::path 📂 시작 상태
어제(Day 28)까지 만든 파일이 이렇게 있어야 해요. 없거나 다르면 [Day 28](#/day/p1-d28)의 "오늘 끝 상태 전체 코드"로 맞춰 주세요.

- `C:\dev\my-creator-site\about.html`
- `C:\dev\my-creator-site\contact.html`
- `C:\dev\my-creator-site\contents.html`
- `C:\dev\my-creator-site\favicon.svg`
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

### 버그와 디버깅

**[[버그]]**(bug)는 프로그램이 만든 사람의 뜻과 다르게 동작하는 잘못이에요. 오류 메시지가 나는 버그도 있고, 오류 없이 결과만 틀리는 버그도 있어요. **[[디버깅]]**(debugging)은 버그의 원인을 찾아 고치는 과정이에요.

버그를 만났을 때 막막한 이유는 보통 "어디부터 봐야 할지 모르기" 때문이에요. 순서를 정해 두면 훨씬 쉬워요.

```text
① 다시 일어나게 하기
   (같은 버튼, 같은 값으로)
② 오류 원문 읽기
   (종류 · 문장 · 파일:줄)
③ 위치 찾기
   (그 줄이 무엇을 하나?)
④ 원인 짐작(가설) 세우기
⑤ 고치고 확인하기
```

핵심은 **④에서 짐작한 것을 ⑤에서 꼭 확인**하는 거예요. "아마 이거겠지" 하고 여러 군데를 한꺼번에 고치면 무엇이 효과가 있었는지 알 수 없어요. 하나 고치고, 확인하고, 아니면 되돌려요.

### 오류 원문을 읽는 법

브라우저 Console의 빨간 줄은 대부분 이런 모양이에요.

```text
Uncaught TypeError: Cannot read properties of null (reading 'addEventListener')
```

- `Uncaught`: 잡히지 않은(아무도 `try…catch`로 처리하지 않은) 오류라는 뜻이에요.
- `TypeError`: 오류의 **종류**예요. 이 종류만 알아도 방향이 잡혀요.
- 그 뒤 문장: **무슨 일이 있었는지**예요. 이 예는 "`null`의 `addEventListener`를 읽으려 했어요"예요. 그러니 "무엇이 `null`일까?"를 찾으면 돼요.
- 줄 오른쪽 끝의 `main.js:7` 같은 파란 글자: **어느 파일 몇 번째 줄**인지예요. 누르면 Sources 패널에서 그 줄이 열려요(숫자는 사람마다 달라요).

이 교재에서 이미 만난 오류 원문을 모아 봤어요. 실제로 실행해서 얻은 문장이에요. 오른쪽의 Day 링크로 그때 상황을 다시 볼 수 있어요.

```text
Uncaught TypeError: Cannot read properties of null (reading 'addEventListener')
```

`querySelector`가 요소를 못 찾아 `null`인 변수에 `addEventListener`를 불렀어요. [Day 21](#/day/p1-d21)에서 한 페이지에만 메뉴 버튼이 없을 때 났어요.

```text
Uncaught TypeError: Cannot set properties of null (setting 'textContent')
```

`null`에 글자를 넣으려 했어요. 오류 안내 문단의 `id` 오타일 때 났어요([Day 24](#/day/p1-d24)). 오늘 버그 1에서도 만나요.

```text
Uncaught ReferenceError: menuToogle is not defined
```

없는 이름(변수·함수)을 썼어요. 철자 오타가 가장 흔한 원인이에요.

```text
Uncaught SyntaxError: missing ) after argument list
```

문법이 틀려서 파일 전체가 실행되지 않아요. 괄호나 따옴표를 닫지 않았을 때 나요. 같은 계열로 `await is only valid in async functions…`는 [Day 25](#/day/p1-d25)에서 봤어요.

```text
Failed to load resource: the server responded with a status of 404 (Not Found)
```

요청한 파일이 서버에 없어요. Network 패널에서 빨간 `404`로 보여요([Day 25](#/day/p1-d25)).

```text
Fetch API cannot load file:///…/data/videos.json. URL scheme "file" is not supported.
```

더블클릭(`file://`)으로 연 페이지에서 `fetch`를 썼어요. Live Preview나 배포 주소로 열어요([Day 25](#/day/p1-d25)).

```text
SyntaxError: Unexpected token ']', ..."10-06" },
]
" is not valid JSON
```

JSON 파일에 쉼표가 하나 더 있는 것처럼 문법이 틀렸어요([Day 25](#/day/p1-d25)).

오류 문구는 브라우저 종류와 버전에 따라 조금 달라요. **종류(TypeError 등)와 핵심 낱말**을 보면 돼요.

### 오류가 없는데 틀린 버그

`Console`에 아무것도 안 나오는데 결과가 이상한 버그가 가장 어려워요(예: 카운트다운 숫자가 안 움직여요). 이럴 때 쓰는 도구가 두 가지예요.

- **`console.log`로 값 찍기:** 의심되는 곳에 `console.log('여기까지 왔어요', 값)`을 넣고 Console에 무엇이 나오는지, 몇 번 나오는지 봐요. 간단하고 빨라요.
- **중단점**으로 멈춰서 보기: 코드가 그 줄에 오면 실행을 **잠시 멈추게** 하고, 그 순간의 변수 값을 눈으로 확인해요.

**[[중단점]]**(breakpoint)은 코드가 그 줄에 오면 실행을 잠시 멈추게 하는 표시예요. 개발자 도구 **Sources**(소스) 패널에서 줄 번호를 누르면 걸려요. 멈춘 동안 변수 값을 보거나 한 줄씩 실행해 볼 수 있고, 다 쓰면 줄 번호를 다시 눌러 해제해요. CSS의 "브레이크포인트"(Day 13의 배치가 바뀌는 화면 폭)와는 다른 말이에요.

`console.log`는 코드를 고쳐서 넣어야 하고, 중단점은 코드를 안 고쳐도 돼요. 값을 한 번만 보려면 `console.log`가, 흐름을 한 줄씩 따라가려면 중단점이 편해요.

### Git이라는 안전망

버그 연습은 일부러 코드를 망가뜨리는 일이에요. 마음 놓고 해도 되는 이유는 **어제까지의 코드가 이미 커밋되어 있기 때문**이에요. 커밋 이후의 변경은 VS Code 소스 제어 패널의 **변경 내용 취소**로 커밋 직후 모양으로 돌릴 수 있어요. 대신 **커밋하지 않은 변경은 되돌린 뒤 복구할 수 없다**는 점은 꼭 알아야 해요(그래서 오늘은 README를 쓰기 **전에** 버그 연습을 먼저 해요).

### Markdown과 README

**[[Markdown]]**(마크다운)은 `#`, `-`, `` ` `` 같은 간단한 기호로 제목·목록·코드를 표시하는 글쓰기 형식이에요. `.md` 파일로 저장하고, GitHub와 VS Code가 보기 좋은 문서로 바꿔 보여 줘요. 이 교재의 본문도 Markdown으로 쓰여 있어요.

| 쓰는 법 | 화면에서 |
|---|---|
| `# 제목`, `## 작은 제목` | 큰 제목, 작은 제목 |
| `- 항목` 또는 `1. 항목` | 점 목록, 번호 목록 |
| `` `코드` `` | 짧은 코드 |
| 백틱 세 개로 감싼 줄들 | 코드 상자 |
| `[글자](주소)` | 링크 |
| `\| a \| b \|` 줄 모음 | 표 |

**[[README]]**(리드미)는 프로젝트 폴더 맨 위에 두는 설명서 파일로, 보통 `README.md`라는 이름의 Markdown 파일이에요. 무엇을 만든 프로젝트인지, 어떻게 열고 쓰는지, 폴더 구조가 어떤지 적어요. GitHub는 저장소 첫 화면에 README 내용을 자동으로 보여 줘요. 처음 온 사람(미래의 나 포함)이 가장 먼저 읽는 글이에요.

## 🛠️ 따라하기

모두 9단계예요. 2~6단계는 일부러 버그를 넣고 고치는 연습, 7~9단계는 README와 정리예요. 개발자 도구가 필요한 단계는 Live Preview 미리 보기 창 위쪽 주소 칸의 주소(`http://127.0.0.1:3000/contents.html`, 숫자는 달라도 돼요)를 복사해서 Edge(또는 Chrome) 주소창에 붙여 열어요.

### 1단계 · 시작 전에 커밋이 깨끗한지 확인하기 (3분)

**어디서:** VS Code → 왼쪽 활동 막대의 **소스 제어**(가지 모양, `Ctrl + Shift + G`)

**무엇을:** 변경된 파일 목록을 봐요.

:::success
**변경 내용** 목록이 비어 있고 "변경 내용이 없습니다" 같은 문구가 보이거나, 파일이 하나도 없어요(문구는 버전에 따라 달라요). 만약 파일이 보인다면 먼저 **메시지** 칸에 `Day 29: 시작 전 정리`를 입력하고 **커밋** → **변경 내용 동기화**를 눌러 깨끗하게 만들어요. 오늘 연습은 "변경이 0개"인 상태에서만 안전해요.
:::

### 2단계 · 버그 1: 이름 오타, 오류 문장 읽기 (9분)

**어디서:** VS Code → `C:\dev\my-creator-site\js\contents.js`

**무엇을:** 파일 위쪽 `// 화면의 요소들을 미리 찾아 둬요 (Day 20)` 아래의 첫 줄을 아래처럼 **일부러** 틀리게 바꿔요(`list`의 `ist`를 `lst`로). 저장하고 Live Preview에서 영상 페이지를 새로 고침해요.

```js
const listElement = document.querySelector('#video-lsit');
```

화면을 먼저 봐요. 그다음 Edge에서 같은 주소를 열고 `F12` → **Console**(콘솔)을 봐요.

:::success
영상 카드가 하나도 없고 빨간 테두리 상자에 `영상 목록을 불러오지 못했어요. 파일을 더블클릭해서 열었다면 …`가 보여요. 하지만 이 상자의 설명은 **틀렸어요.** 파일은 Live Preview로 잘 열었으니까요. Console에는 아래 줄이 나와요(줄 번호는 달라요).
:::

```text
videos.json을 불러오지 못했어요: TypeError: Cannot set properties of null (setting 'textContent')
```

디버깅 순서대로 따라가 봐요.

1. **다시 일어나게 하기:** 새로 고침할 때마다 똑같이 일어나요.
2. **오류 원문 읽기:** 종류는 `TypeError`, 문장은 "`null`에 `textContent`를 설정할 수 없어요"예요. 그러니 `null`인 무언가에 `.textContent = …`를 하고 있어요.
3. **위치 찾기:** `.textContent =`를 쓰는 곳 중 `contents.js`의 `render()` 안 `listElement.textContent = '';`가 있어요. `listElement`가 `null`이라는 뜻이에요.
4. **가설:** `listElement`는 맨 위에서 `querySelector('#video-lsit')`로 찾았어요. 요소를 못 찾으면 `null`이 돼요. 철자를 HTML의 `id="video-list"`와 비교해 봐요.
5. **확인:** `lsit`를 `list`로 고치고 저장·새로 고침해서 카드 6장이 나오는지 봐요.

:::info 왜 상자가 엉뚱한 말을 했을까요?
`render()`가 `loadVideos()`의 `try` 안에서 불리고 있어서, `render()`의 오류도 `catch`가 잡아서 "불러오지 못했어요" 상자를 띄운 거예요. 오류 상자의 안내가 아니라 **Console의 원문**이 진짜 원인을 알려 줘요. 그래서 안내 문장을 믿기 전에 항상 원문을 읽어요.
:::

```js
const listElement = document.querySelector('#video-list');
```

위 코드로 되돌리고 저장해요.

:::success
영상 카드 6장이 다시 보이고 오류 상자가 없어요. Console에도 빨간 줄이 없어요.
:::

### 3단계 · 버그 2: 오류가 없는데 숫자가 안 움직여요 (9분)

**어디서:** VS Code → `C:\dev\my-creator-site\js\schedule.js`

**무엇을:**

1. `start` 함수 안의 `setInterval(updateCountdown, 1000);`을 찾아 괄호를 붙여 **일부러** 틀리게 바꿔요. 저장하고 Live Preview에서 일정 페이지를 새로 고침해요.

```js
    setInterval(updateCountdown(), 1000); // 1초(1000ms)마다 다시 계산해요
```

2. Edge에서 같은 주소를 열고 `F12` → **Console**을 봐요. 오류가 있는지, 카운트다운 숫자가 움직이는지 봐요.
3. 원인을 짐작하기 위해 `updateCountdown` 함수의 **첫 줄**(`function updateCountdown() {` 바로 아래)에 한 줄을 임시로 넣고 저장해요.

```js
  console.log('updateCountdown 실행');
```

4. 새로 고침하고 Console에 `updateCountdown 실행`이 몇 번 나오는지 봐요.

:::success
Console에 빨간 오류는 없어요. 카운트다운 숫자는 처음 계산된 값에서 **멈춰** 있어요. 3~4번 뒤에는 `updateCountdown 실행`이 딱 **두 줄**만 나오고 더 늘지 않아요. 1초마다 불려야 하는 함수인데 두 번 불리고 끝났어요.
:::

디버깅 순서로 정리해요. 오류 원문이 없으니 ③ "위치 찾기"를 `console.log`가 대신했어요. 로그가 1초마다 늘지 않으니 `setInterval`이 함수를 반복해서 부르지 못하고 있어요. ④ 가설은 "`setInterval`에 넘긴 값이 함수가 아니다"예요. `updateCountdown()`은 괄호 때문에 **지금 실행되고**, 그 결과(`undefined`)가 `setInterval`에 넘어가요. 두 줄 중 하나는 `start`가 원래 한 번 부르는 호출이고, 다른 하나가 이 괄호 때문에 생긴 호출이에요([Day 26](#/day/p1-d26)).

5. 고쳐요. `setInterval(updateCountdown(), 1000);`에서 괄호를 지우고, 임시로 넣은 `console.log` 줄을 지우고 저장해요.

```js
    setInterval(updateCountdown, 1000); // 1초(1000ms)마다 다시 계산해요
```

:::success
카운트다운 숫자가 다시 1초마다 줄어들어요. Console에 `updateCountdown 실행` 줄이 없어요. 원래 코드로 돌아왔어요.
:::

### 4단계 · 버그 3: JSON에 쉼표 하나 (5분)

**어디서:** VS Code → `C:\dev\my-creator-site\data\videos.json`

**무엇을:** 마지막 영상 줄(`"id": "v006"`) 끝의 `}` 뒤에 쉼표를 하나 붙여요(`… "date": "2026-10-06" },`). 저장하고 영상 페이지를 새로 고침한 뒤 Console을 읽어요. **이번에는 고치지 않고 그대로 두세요.** 6단계에서 다른 방법으로 되돌려요.

:::success
카드가 하나도 없고 오류 상자가 보여요. Console에는 `SyntaxError: Unexpected token ']'…is not valid JSON`이 나와요. VS Code에서 `videos.json`을 보면 쉼표 근처에 빨간 물결 밑줄이 보여요.
:::

문장 속 `Unexpected token ']'`가 "예상 밖의 `]`가 나왔어요"라는 뜻이라는 것을 [Day 25](#/day/p1-d25)에서 배웠어요. 원문은 "쉼표 뒤에 다음 영상이 와야 하는데 `]`가 먼저 나왔다"는 위치까지 알려 줘요.

### 5단계 · 중단점으로 변수 값 보기 (12분)

이번에는 오류가 없는 정상 코드를 중단점으로 멈춰 보면서 `formatRemaining` 안에서 계산이 어떻게 흘러가는지 눈으로 봐요. 먼저 4단계의 쉼표는 두고 일정 페이지를 써요(일정 페이지는 `schedule.json`을 쓰니 영향이 없어요).

**어디서:** Edge(또는 Chrome)에서 Live Preview 주소로 연 일정 페이지(`http://127.0.0.1:3000/schedule.html`, 숫자는 달라도 돼요) → `F12` → 위쪽 탭 줄의 **Sources**(소스)

**무엇을:**

1. **Sources** 탭이 안 보이면 오른쪽 끝 `»`를 눌러 찾아요. 탭 이름과 위치는 버전에 따라 조금 다를 수 있어요.
2. `Ctrl + P`를 누르고 `schedule.js`를 입력해 `Enter`를 눌러요. 가운데 영역에 `schedule.js`가 열려요. (왼쪽 파일 트리에서 `127.0.0.1:3000` → `js` → `schedule.js`를 열어도 돼요.)
3. `function formatRemaining(ms) {` 아래의 첫 줄 `const totalSeconds = Math.floor(ms / 1000);`을 찾아요(약 62번째 줄이에요). 그 줄의 **줄 번호**를 클릭해요. 줄 번호 자리에 파란 표시가 생겨요. 이것이 중단점이에요.
4. 새로 고침(`F5`)해요. 페이지 위쪽에 **Paused in debugger**(디버거에서 일시중지됨) 알림이 뜨고, 그 줄이 하이라이트된 채 멈춰요.
5. 오른쪽(또는 아래쪽) 패널의 **Scope**(범위)를 펼쳐요. **Local**(로컬) 아래에 `ms: 숫자`가 보여요. 이 줄은 아직 실행 전이라 `totalSeconds`는 값이 없어요.
6. 키보드 `F10`(**Step over**, 다음 줄로)을 한 번 눌러요. 이제 Scope에 `totalSeconds: 숫자`가 생겨요. 한 번 더 `F10`을 누르면 `days: 숫자`가 생겨요.
7. `F8`(**Resume**, 계속 실행)을 눌러요. 1초 뒤 다시 멈춰요. 카운트다운이 1초마다 `formatRemaining`을 불러서 매초 멈추는 거예요.
8. **중단점을 해제해요.** 줄 번호의 파란 표시를 다시 클릭해 없애고 `F8`을 눌러요. (오른쪽 **Breakpoints**(중단점) 목록에서 체크를 끄거나 지워도 돼요.)

:::success
멈춘 동안 Scope에서 `ms`와 `totalSeconds`, `days` 값을 읽었어요. `totalSeconds`는 `ms`를 1000으로 나눠 소수를 버린 값이에요(`ms`가 55719790이면 `totalSeconds`는 55719). 중단점을 해제하면 카운트다운이 계속 흘러가요. **중단점이 남아 있으면 안 돼요.** 나중에 개발자 도구를 열 때마다 멈춰서 "페이지가 고장 났다"고 오해해요.
:::

### 6단계 · 변경 내용 취소로 깔끔하게 되돌리기 (4분)

4단계에서 남겨 둔 쉼표를 되돌려요. 수정 취소 단축키 `Ctrl + Z`를 쓰지 않고 Git의 힘을 빌려요.

:::warn 되돌린 내용은 복구할 수 없어요
**변경 내용 취소**는 아직 커밋하지 않은 변경을 버리고 마지막 커밋 상태로 돌려요. 버린 변경은 어디에도 남지 않아요. 오늘 만든 README처럼 아직 커밋하지 않은 새 파일을 그 사이에 쓰면 함께 날아갈 수 있어서, README는 이 단계 **뒤에** 써요.
:::

**어디서:** VS Code → 소스 제어 패널(`Ctrl + Shift + G`)

**무엇을:**

1. **변경 내용** 목록에 `videos.json`이 보여요.
2. `videos.json` 줄에 마우스를 올리면 오른쪽에 아이콘이 나타나요. 되돌림 화살표 모양(↶) **변경 내용 취소**(영어: **Discard Changes**)를 눌러요.
3. "…변경 내용을 취소하시겠습니까?" 확인 창이 뜨면 취소를 확정하는 버튼(**변경 내용 취소**)을 눌러요(문구는 버전에 따라 조금 다를 수 있어요).
4. `videos.json`을 열어 쉼표가 없는지 보고, 영상 페이지를 새로 고침해요.

:::success
소스 제어 패널의 변경 내용이 0개로 돌아왔어요. `videos.json`의 마지막 줄이 `… "date": "2026-10-06" }`(쉼표 없음)이에요. 영상 페이지에 카드 6장이 보이고 오류 상자가 없어요.
:::

### 7단계 · README.md 쓰기 (12분)

**어디서:** VS Code 탐색기 → `my-creator-site` 폴더(맨 위 빈 곳) 오른쪽 클릭 → **새 파일**

**무엇을:**

1. `README.md`를 입력하고 `Enter`를 눌러요(경로 `C:\dev\my-creator-site\README.md`). 이름은 **대문자** `README`, 확장자 `.md`예요. `readme.txt`나 `README.md.txt`가 되지 않게 해요.
2. 열린 빈 파일에 아래 글을 붙여 넣어요. 글은 내 것으로 바꿔요. `내아이디`는 내 GitHub 아이디로, 사이트 이름·소개·방송 일정·영상 설명도 내 이야기로 바꿔요. 하지만 `##` 제목들과 폴더 구조, 표, 파일 이름은 그대로 두는 게 좋아요.

📄 C:\dev\my-creator-site\README.md
````md
# 달빛곰 방송국

게임, 토크, 음악 방송을 하는 스트리머 달빛곰의 홈페이지예요. HTML, CSS, JavaScript만 써서 만들었고, 설치할 것이 없어요.
배포 주소: [https://내아이디.github.io/my-creator-site/](https://내아이디.github.io/my-creator-site/)

## 폴더 구조

```text
my-creator-site/
├─ index.html          홈 (소개, 방송 카드, 대표 영상)
├─ about.html          소개
├─ contents.html       영상 목록 (필터·검색)
├─ schedule.html       방송 일정표 + 다음 방송 카운트다운
├─ contact.html        문의 폼 (입력 검증)
├─ favicon.svg         브라우저 탭 아이콘
├─ css/style.css       모든 페이지의 스타일 (변수, 다크 모드, 반응형)
├─ js/
│  ├─ main.js          메뉴 토글, 다크 모드, 시간대별 인사말
│  ├─ contents.js      videos.json 불러오기, 카드 그리기, 필터·검색
│  ├─ schedule.js      오늘 요일 강조, 다음 방송 카운트다운
│  └─ contact.js       폼 검증, 상태 메시지(role="status")
├─ data/
│  ├─ videos.json      영상 목록
│  └─ schedule.json    방송 일정
├─ images/             프로필, 로고, 썸네일 자리 이미지 (SVG)
└─ overlay/            OBS 카운트다운 오버레이 (countdown.html / .css / .js)
```

## 열어 보는 방법

- **VS Code의 Live Preview**로 `index.html`을 열어요. (파일을 더블클릭해서 열면 `fetch`가 막혀서 영상 목록과 방송 일정 카운트다운이 나오지 않아요. 이유는 Day 25에서 배워요.)
- GitHub Pages로 배포한 주소로 열어도 돼요. (Day 14, Day 30)

## OBS 카운트다운 오버레이

`overlay/countdown.html` 뒤에 주소 값을 붙여서 써요.

```text
overlay/countdown.html?title=저녁 방송&start=20:00
```

| 값 | 뜻 | 예 |
|---|---|---|
| `title` | 화면에 보일 방송 제목 | `저녁 방송` (띄어쓰기는 `%20`으로 써도 돼요) |
| `start` | 오늘 방송 시작 시각 `HH:MM` (00:00 ~ 23:59) | `20:00` |

- 남은 시간이 `HH:MM:SS`로 줄어들다가, 시작 시각이 지나면 **곧 시작해요!** 로 바뀌어요.
- 시간은 **컴퓨터 시계 기준**이에요. 한국에서 쓰는 컴퓨터라면 한국 시간으로 계산돼요. (시간대는 P2에서 제대로 배워요)
- `start`가 없거나 `25:99`처럼 잘못 쓰면 사용법을 알려 주는 문장이 나와요.
- 배경이 투명(`transparent`)이라서 OBS에서 화면 위에 글자만 보여요.
- OBS 사용법: 소스 추가 → **브라우저** → URL에 배포한 주소를 붙여 넣어요. 너비·높이는 화면에 맞게 정해요. (OBS 메뉴 이름은 버전에 따라 조금 달라요)
- 일반 브라우저로 열면 배경이 흰색이라 글자가 흐리게 보여요. 정상이에요.

## 데이터 파일 형식

`data/videos.json`

```json
[{ "id": "v001", "title": "영상 제목", "category": "game", "youtubeId": "영상ID 11글자", "date": "2026-10-27" }]
```

`category`는 `game`, `talk`, `music` 중 하나예요.

`data/schedule.json`

```json
[{ "day": 1, "start": "20:00", "title": "방송 내용" }]
```

`day`는 일요일 `0`부터 토요일 `6`까지예요. `schedule.html`의 표(`data-day`)와 같은 값으로 맞춰 주세요.

## 알아 두면 좋은 점

- 영상 ID와 대표 영상은 **예시**예요. 내 YouTube 영상 주소 `watch?v=` 뒤의 11글자로 바꿔 주세요. `file://`로 열면 YouTube 임베드가 재생되지 않을 수 있어요.
- 다크 모드 선택은 브라우저의 `localStorage`에 `theme`(`light` 또는 `dark`)로 저장돼요.
- `schedule.js`와 오버레이는 컴퓨터 시간이 한국 시간이라고 가정하고 계산해요.
- 문의 폼은 연습용이라 서버로 보내지 않아요. 채팅 닉네임 칸은 선택이고, 적으면 HTML `pattern`(한글·영문·숫자·`_` 2~20글자)에 맞는지 검사해요.
- 외부 라이브러리·CDN·웹폰트는 쓰지 않았어요. 외부 주소는 YouTube뿐이에요.
- `og:image`는 배포 주소가 정해진 뒤에 `https://...` 전체 주소로 추가해요. (Day 28)
````

3. `Ctrl + S`로 저장해요.
4. 미리 보기를 열어요. `Ctrl + Shift + V`를 눌러요(또는 편집기 오른쪽 위의 **미리 보기** 아이콘, 책과 돋보기 모양). 이름은 버전에 따라 다를 수 있어요.

Markdown 글이 어떻게 화면에 바뀌는지 짚어 봐요.

- `# 달빛곰 방송국`: 가장 큰 제목이에요. 파일에 한 번만 써요.
- `## 폴더 구조` 등 `##`: 구역 제목이에요.
- `- ` 로 시작하는 줄: 점 목록이에요.
- ` ```text ` 와 ` ``` ` 사이: 코드 상자예요. 폴더 구조 그림이 글자 그대로 보여요. 첫 줄에 `text`, `json`처럼 내용 종류를 써 줘요.
- `| 값 | 뜻 | 예 |` 줄들: 표예요. 둘째 줄 `|---|---|---|`가 머리글과 내용을 나눠요. 칸 수(`|` 개수)가 줄마다 같아야 해요.
- `[글자](주소)`: 링크예요.

:::success
미리 보기 창에 큰 제목, 소개 문장, 폴더 구조 코드 상자, OBS 주소 표(제목·시작 시각), 데이터 형식 코드 상자 둘, "알아 두면 좋은 점" 목록이 모두 보여요. 표가 줄글로 깨져 보이면 `|` 개수가 줄마다 다른 거예요.
:::

### 8단계 · 폴더 정리와 마지막 점검 (5분)

**어디서:** VS Code 탐색기 + 파일 탐색기

**무엇을:**

1. VS Code 탐색기에서 `my-creator-site` 폴더를 열어 파일들을 봐요. 아래 목록(완성본)에 **없는** 파일이 있는지 찾아요: `index copy.html`, `Untitled-1`, `test.json`, `새 텍스트 문서.txt` 같은 연습하다 남은 파일들이에요. 있으면 그 파일을 클릭하고 `Delete` 키로 지워요(확인 창이 뜨면 **휴지통으로 이동**을 눌러요).
2. 파일 이름이 영어 소문자와 `-`로 되어 있는지 살펴봐요(`README.md`는 관례상 대문자예요).
3. 파일 개수를 세요. **어디서:** VS Code 메뉴 **터미널 → 새 터미널**, 위치가 `C:\dev\my-creator-site`인지 확인하고(아니면 `cd C:\dev\my-creator-site`) 아래 명령을 실행해요.

```powershell
(Get-ChildItem -Recurse -File).Count
```

예상 출력(Windows 11 기본 PowerShell 기준, 숨김 폴더인 `.git`은 세지 않아요):

```text
22
```

4. 다섯 페이지와 오버레이를 Live Preview 주소로 하나씩 열고 `F12` → **Console**에 빨간 오류가 없는지 확인해요(`index.html`, `about.html`, `contents.html`, `schedule.html`, `contact.html`, `overlay/countdown.html?title=저녁 방송&start=20:00`).

완성본의 폴더 구조예요. 파일이 이 22개와 같아야 해요.

```text
my-creator-site/
├─ index.html
├─ about.html
├─ contents.html
├─ schedule.html
├─ contact.html
├─ favicon.svg
├─ README.md
├─ css/style.css
├─ js/
│  ├─ main.js
│  ├─ contents.js
│  ├─ schedule.js
│  └─ contact.js
├─ data/
│  ├─ videos.json
│  └─ schedule.json
├─ images/  (SVG 5개)
└─ overlay/ (HTML·CSS·JS 3개)
```

:::success
파일 개수가 `22`이고, 목록에 없는 파일은 지웠어요. 여섯 페이지 모두 Console이 깨끗해요. Sources에 중단점이 남아 있지 않아요.
:::

### 9단계 · 커밋·푸시하고 GitHub에서 README 보기 (3분)

**어디서:** VS Code → 소스 제어 패널(`Ctrl + Shift + G`)

**무엇을:** **메시지** 칸에 `Day 29: README와 정리`를 입력하고 **커밋** → **변경 내용 동기화**를 눌러요. 명령으로 한다면 VS Code 터미널(PowerShell), 위치 `C:\dev\my-creator-site`에서 아래를 한 줄씩 실행해요.

```powershell
git add .
git commit -m "Day 29: README와 정리"
git push
```

`git commit` 예상 출력(해시와 숫자는 달라도 돼요):

```text
[main 1b9e4d8] Day 29: README와 정리
 1 file changed, 79 insertions(+)
```

그다음 Edge에서 `https://github.com/<내 아이디>/my-creator-site`를 열어요.

:::success
저장소 첫 화면의 파일 목록 아래에 `README.md`가 보이고, 그 아래에 큰 제목, 폴더 구조 코드 상자, 표 같은 README 내용이 꾸며진 채 나타나요. 커밋 메시지 `Day 29: README와 정리`가 맨 위에 보여요.
:::

## ✍️ 과제

### 과제 1 · 버그 찾기 3문제 (쉬움 ⭐, 6분)

아래 세 경우의 원인을 각각 한 줄로 적어 보세요. 실제 오류 원문이에요.

1. 코드: `const listElement = document.querySelector('#video-lsit');` / 오류: `TypeError: Cannot set properties of null (setting 'textContent')`
2. 코드: `setInterval(updateCountdown(), 1000);` / 오류: 없음. 숫자가 안 움직여요.
3. 코드: `videos.json`의 마지막 `}` 뒤에 쉼표 / 오류: `SyntaxError: Unexpected token ']', ..."10-06" },` `]` `" is not valid JSON`

- 확인 방법: 2~4단계에서 직접 해 본 것과 같은지 비교해요.
- 힌트: 1번은 무엇이 `null`인지, 2번은 괄호가 무엇을 바꾸는지, 3번은 JSON 규칙 중 무엇을 어겼는지 봐요.

### 과제 2 · 중단점으로 값 보기 (보통 ⭐⭐, 5분)

`schedule.js`의 `formatRemaining` 첫 줄에 중단점을 걸고, 멈췄을 때 `totalSeconds`와 `days`의 값을 읽어 적어 보세요. 읽은 뒤 **중단점을 해제**하세요.

- 확인 방법: `totalSeconds`는 `ms`를 1000으로 나눠 소수를 버린 값이고, `days`는 `totalSeconds`를 86400으로 나눈 몫이에요.
- 힌트: 5단계 6번처럼 `F10`을 눌러야 값이 생겨요.

### 과제 3 · README에 배운 것 쓰기 (도전 ⭐⭐⭐, 5분)

`README.md` 맨 끝에 `## 배운 것` 절을 추가해 보세요. 이번 30일 동안 쓴 기술 이름 5개 이상과, 가장 어려웠던 Day를 적어요.

- 확인 방법: 미리 보기에서 `## 배운 것` 제목, 목록, 가장 어려웠던 Day 문장이 보여요.
- 힌트: `- 항목` 줄로 목록을 쓰고, 기술 이름은 `` `fetch` ``처럼 백틱으로 감싸요.
- 마무리: 9단계 커밋 뒤에 썼다면 `Day 29: README 배운 것`으로 한 번 더 커밋·푸시해요(안 하면 내일 커밋에 포함돼요).

## ✅ 정답

:::answer 과제 1 정답 · 버그 찾기 3문제
```text
1. 요소를 못 찾아서 listElement 가 null 이에요.
   (HTML 은 id="video-list" 인데 JS 는 #video-lsit 로 철자가 달라요.)
2. 괄호 때문에 updateCountdown 이 지금 한 번 실행되고,
   setInterval 에는 함수가 아니라 undefined 가 넘어가요.
3. JSON 은 마지막 항목 뒤 쉼표를 허용하지 않아서, 쉼표 뒤에 ]
   가 먼저 나와 문법 오류가 나요.
```

**왜 이렇게 하나요?** 오류 원문은 종류(`TypeError`, `SyntaxError`)와 핵심 낱말(`null`, `]`)이 곧 단서예요. 1번은 "`null`에 접근했다"가 단서라서 "무엇이 `null`인가"를 찾으면 되고, 3번은 "JSON 규칙 위반"이 단서라서 JSON의 규칙(마지막 쉼표 금지)을 떠올리면 돼요. 2번처럼 원문이 없으면 `console.log`나 중단점으로 "몇 번 불리는지"를 확인하는 것이 방법이에요.
:::

:::answer 과제 2 정답 · 중단점으로 값 보기
절차와 값의 예예요(숫자는 지금 시각에 따라 달라요).

```text
1. Ctrl + P → schedule.js → 62번째 줄 근처 const totalSeconds 의 줄 번호 클릭
2. F5 로 새로 고침 → Paused in debugger
3. Scope(Local): ms = 55719790 (아직 totalSeconds 는 없음)
4. F10 → totalSeconds = 55719  (= Math.floor(55719790 / 1000))
5. F10 → days = 0              (= Math.floor(55719 / 86400))
6. 줄 번호를 다시 눌러 중단점 해제, F8
```

**왜 이렇게 하나요?** 중단점으로 멈추면 "코드가 이 줄에 도착한 순간"의 값을 볼 수 있어요. 멈춘 줄은 아직 실행 전이라 `F10`으로 한 줄씩 실행해야 값이 생겨요. `updateCountdown`이 1초마다 `formatRemaining`을 부르기 때문에, 중단점을 둔 채로 두면 1초마다 계속 멈춰서 불편해요. 확인이 끝나면 꼭 해제해요.
:::

:::answer 과제 3 정답 · README에 배운 것 쓰기
````md
## 배운 것

- HTML: 시맨틱 태그, 폼, 접근성 속성(`aria-*`)
- CSS: Flexbox, Grid, 미디어 쿼리, CSS 변수, 다크 모드
- JavaScript: DOM, 이벤트 위임, `localStorage`, `fetch`, `async`/`await`
- Git·GitHub: 커밋, 푸시, GitHub Pages 배포
- 도구: VS Code, 개발자 도구(Console·Network·Sources), Lighthouse

가장 어려웠던 Day는 Day 25(JSON과 fetch)였어요. 비동기 순서가 처음에는 눈에 안 보였어요.
````

**왜 이렇게 하나요?** README는 내가 무엇을 만들었고 어떤 기술을 썼는지 처음 온 사람에게 알려 주는 글이에요. 기술 이름을 목록으로 쓰면 한눈에 보이고, 어려웠던 점을 한 줄 적어 두면 다음 프로젝트의 나에게도 도움이 돼요. 글 내용은 사람마다 달라요.
:::

:::answer 오늘 끝 상태 전체 코드
막혔다면 아래 코드로 내 파일을 맞추고 다음 Day를 시작해요. 오늘 끝 상태에서 **바뀌는 파일은 `README.md` 하나뿐**이에요. 버그 연습은 모두 되돌렸으니 다른 파일은 Day 28의 끝 상태 그대로예요(`contents.js`의 `#video-list`, `schedule.js`의 `setInterval(updateCountdown, 1000)`, `videos.json`의 마지막 쉼표 없음을 꼭 확인해요).

```text
my-creator-site/
├─ css/
│  └─ style.css
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
│  ├─ countdown.html
│  └─ countdown.js
├─ README.md ★
├─ about.html
├─ contact.html
├─ contents.html
├─ favicon.svg
├─ index.html
└─ schedule.html
```

📄 C:\dev\my-creator-site\README.md
````md
# 달빛곰 방송국

게임, 토크, 음악 방송을 하는 스트리머 달빛곰의 홈페이지예요. HTML, CSS, JavaScript만 써서 만들었고, 설치할 것이 없어요.
배포 주소: [https://내아이디.github.io/my-creator-site/](https://내아이디.github.io/my-creator-site/)

## 폴더 구조

```text
my-creator-site/
├─ index.html          홈 (소개, 방송 카드, 대표 영상)
├─ about.html          소개
├─ contents.html       영상 목록 (필터·검색)
├─ schedule.html       방송 일정표 + 다음 방송 카운트다운
├─ contact.html        문의 폼 (입력 검증)
├─ favicon.svg         브라우저 탭 아이콘
├─ css/style.css       모든 페이지의 스타일 (변수, 다크 모드, 반응형)
├─ js/
│  ├─ main.js          메뉴 토글, 다크 모드, 시간대별 인사말
│  ├─ contents.js      videos.json 불러오기, 카드 그리기, 필터·검색
│  ├─ schedule.js      오늘 요일 강조, 다음 방송 카운트다운
│  └─ contact.js       폼 검증, 상태 메시지(role="status")
├─ data/
│  ├─ videos.json      영상 목록
│  └─ schedule.json    방송 일정
├─ images/             프로필, 로고, 썸네일 자리 이미지 (SVG)
└─ overlay/            OBS 카운트다운 오버레이 (countdown.html / .css / .js)
```

## 열어 보는 방법

- **VS Code의 Live Preview**로 `index.html`을 열어요. (파일을 더블클릭해서 열면 `fetch`가 막혀서 영상 목록과 방송 일정 카운트다운이 나오지 않아요. 이유는 Day 25에서 배워요.)
- GitHub Pages로 배포한 주소로 열어도 돼요. (Day 14, Day 30)

## OBS 카운트다운 오버레이

`overlay/countdown.html` 뒤에 주소 값을 붙여서 써요.

```text
overlay/countdown.html?title=저녁 방송&start=20:00
```

| 값 | 뜻 | 예 |
|---|---|---|
| `title` | 화면에 보일 방송 제목 | `저녁 방송` (띄어쓰기는 `%20`으로 써도 돼요) |
| `start` | 오늘 방송 시작 시각 `HH:MM` (00:00 ~ 23:59) | `20:00` |

- 남은 시간이 `HH:MM:SS`로 줄어들다가, 시작 시각이 지나면 **곧 시작해요!** 로 바뀌어요.
- 시간은 **컴퓨터 시계 기준**이에요. 한국에서 쓰는 컴퓨터라면 한국 시간으로 계산돼요. (시간대는 P2에서 제대로 배워요)
- `start`가 없거나 `25:99`처럼 잘못 쓰면 사용법을 알려 주는 문장이 나와요.
- 배경이 투명(`transparent`)이라서 OBS에서 화면 위에 글자만 보여요.
- OBS 사용법: 소스 추가 → **브라우저** → URL에 배포한 주소를 붙여 넣어요. 너비·높이는 화면에 맞게 정해요. (OBS 메뉴 이름은 버전에 따라 조금 달라요)
- 일반 브라우저로 열면 배경이 흰색이라 글자가 흐리게 보여요. 정상이에요.

## 데이터 파일 형식

`data/videos.json`

```json
[{ "id": "v001", "title": "영상 제목", "category": "game", "youtubeId": "영상ID 11글자", "date": "2026-10-27" }]
```

`category`는 `game`, `talk`, `music` 중 하나예요.

`data/schedule.json`

```json
[{ "day": 1, "start": "20:00", "title": "방송 내용" }]
```

`day`는 일요일 `0`부터 토요일 `6`까지예요. `schedule.html`의 표(`data-day`)와 같은 값으로 맞춰 주세요.

## 알아 두면 좋은 점

- 영상 ID와 대표 영상은 **예시**예요. 내 YouTube 영상 주소 `watch?v=` 뒤의 11글자로 바꿔 주세요. `file://`로 열면 YouTube 임베드가 재생되지 않을 수 있어요.
- 다크 모드 선택은 브라우저의 `localStorage`에 `theme`(`light` 또는 `dark`)로 저장돼요.
- `schedule.js`와 오버레이는 컴퓨터 시간이 한국 시간이라고 가정하고 계산해요.
- 문의 폼은 연습용이라 서버로 보내지 않아요. 채팅 닉네임 칸은 선택이고, 적으면 HTML `pattern`(한글·영문·숫자·`_` 2~20글자)에 맞는지 검사해요.
- 외부 라이브러리·CDN·웹폰트는 쓰지 않았어요. 외부 주소는 YouTube뿐이에요.
- `og:image`는 배포 주소가 정해진 뒤에 `https://...` 전체 주소로 추가해요. (Day 28)
````
:::

## 🧯 자주 막히는 곳

여기에 없는 증상은 [문제 해결 모음](#/page/troubleshooting)에서 찾아보세요.

### 중단점을 걸었는데 멈추지 않아요

**원인:** 세 가지가 흔해요. ① 그 줄이 이미 실행된 뒤에 중단점을 걸었어요(코드는 페이지를 열 때 한 번 실행되니 지나가 버렸어요). ② 다른 파일의 같은 줄 번호에 걸었어요. ③ 개발자 도구가 열린 상태에서 페이지를 새로 고치지 않았어요.

**해결:** 중단점을 건 뒤 `F5`로 새로 고치거나, 그 줄이 실행되는 동작(버튼 누르기)을 다시 해요. 위쪽의 파일 이름이 `schedule.js`인지 확인해요.

### 멈춘 채로 페이지가 움직이지 않아요

**원인:** 정상이에요. 중단점에서 **Paused in debugger** 상태예요. 코드가 멈춰서 페이지도 멈춘 것처럼 보여요.

**해결:** 개발자 도구에서 `F8`(**Resume**, 재생 모양 버튼)을 눌러 계속 실행해요.

### 개발자 도구를 열 때마다 계속 멈춰요

**원인:** 중단점이 남아 있어요. 해제하지 않은 중단점이 있으면 그 줄을 실행할 때마다 멈춰요.

**해결:** Sources 패널 오른쪽의 **Breakpoints**(중단점) 목록에서 체크를 끄거나 목록의 항목을 지워요. 줄 번호를 다시 눌러도 해제돼요.

### Sources에서 파일이 안 보여요

**원인:** 파일 트리의 폴더를 펼치지 않았거나, 지금 연 주소가 아닌 다른 사이트의 파일이 보이고 있어요.

**해결:** `Ctrl + P`를 눌러 파일 이름(`schedule.js`)을 입력해서 바로 열어요.

### README가 GitHub 저장소 첫 화면에 안 보여요

**원인:** 파일 이름이 `README.md`가 아니에요(`readme.txt`, `README.md.txt`). 또는 아직 푸시를 안 했어요.

**해결:** 파일 탐색기에서 **보기 → 표시 → 파일 확장명**이 켜져 있는지 확인하고(Day 1), VS Code 탐색기에서 파일 이름을 `README.md`로 맞춰요. 열려 있는 파일의 이름을 탐색기에서 바꾸면 VS Code가 옛 이름을 기억할 수 있으니, VS Code 탐색기에서 오른쪽 클릭 → **이름 바꾸기**를 써요. 소스 제어 패널의 변경이 0개인지(푸시가 끝났는지) 확인해요.

### Markdown 표가 줄글로 깨져 보여요

**원인:** 줄마다 `|` 개수가 달라요. 둘째 줄의 `|---|---|---|` 구분 줄이 없거나 칸 수가 머리글과 달라요.

**해결:** 모든 줄의 `|` 개수를 세어 같게 맞추고, 머리글 바로 아래 줄은 `|---|---|---|`로 써요.

### 변경 내용 취소로 오늘 쓴 README까지 날아갔어요

**원인:** README를 쓴 뒤에 **변경 내용 취소**를 눌렀어요. 커밋하지 않은 변경은 되돌린 뒤 복구할 수 없어요.

**해결:** README를 다시 써요(7단계의 글을 다시 붙여 넣어요). 앞으로는 되돌리기 전에 지금 변경 목록에 무엇이 있는지 먼저 확인해요. 그래서 오늘 순서가 버그 연습 → 되돌리기 → README예요.

### 정리하다가 완성본에 있는 파일을 지웠어요

**원인:** 목록에 있는 파일(예: `favicon.svg`, `data\schedule.json`)을 연습 파일로 착각하고 지웠어요.

**해결:** 지운 파일이 GitHub에 올라가 있다면 소스 제어 패널에서 **변경 내용 취소**로 되돌릴 수 있어요. 올라가 있지 않았다면 해당 Day의 "오늘 끝 상태 전체 코드"로 다시 만들어요.

## 📝 오늘의 체크리스트

- [ ] 시작 전에 소스 제어 패널의 변경이 0개인 것을 확인했어요
- [ ] 버그 1에서 Console 원문을 읽고 `#video-lsit` 오타를 찾아 고쳤어요
- [ ] 버그 2에서 `console.log`로 함수가 두 번만 불린다는 것을 확인하고 고쳤어요
- [ ] Sources에서 중단점을 걸고 `totalSeconds`와 `days` 값을 읽은 뒤 해제했어요
- [ ] **변경 내용 취소**로 `videos.json`의 쉼표를 되돌렸어요
- [ ] `README.md`를 쓰고 `Ctrl + Shift + V` 미리 보기에서 제목·표·코드 상자를 확인했어요
- [ ] 파일 개수가 `22`이고 다섯 페이지와 오버레이의 Console이 깨끗해요
- [ ] GitHub 저장소 첫 화면에 README가 보여요
- [ ] 과제 1~3을 하고 정답과 비교했어요, GitHub에 `Day 29` 커밋이 있어요

## 📚 더 알아보기

- [Chrome for Developers — JavaScript 디버깅 시작하기](https://developer.chrome.com/docs/devtools/javascript): 중단점, 한 줄씩 실행, Scope 보기를 단계별로 설명해요.
- [MDN — JavaScript 오류 참고서](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Errors): 오류 메시지별로 원인과 고치는 방법을 찾아볼 수 있어요.
- [GitHub Docs — About READMEs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes): README가 저장소 첫 화면에 보이는 규칙을 설명해요.

➡️ **다음 Day 예고:** [Day 30 · 최종 배포와 회고](#/day/p1-d30)에서는 최종 점검표로 사이트를 한 번 더 점검하고, 마지막 커밋·푸시와 배포 확인을 하고, 30일을 돌아보는 회고를 README에 써요.
