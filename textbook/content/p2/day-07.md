## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- Vite로 `C:\dev\streamer-hub\client` 프로젝트를 만들고, 개발 서버를 켜서 브라우저 `http://localhost:5173`에서 내 화면을 볼 수 있어요.
- 파일을 저장하면 내가 새로 고치지 않아도 화면이 바뀌는 것(HMR)을 확인하고, `localhost`와 포트가 무엇인지 설명할 수 있어요.
- 템플릿을 정리하고 스트리머 허브의 첫 화면(로고, 메뉴 4개, 큰 소개, 꼬리말)을 만들 수 있어요. Windows가 다크 모드이면 어두운 색으로 보여요.
- `npm run build`로 배포용 파일을 만들어 `npm run preview`로 열어 보고, 만든 프로젝트를 Git에 커밋·푸시할 수 있어요.

**예상 시간: 110분** (개념 이해 15분 · 따라하기 68분 · 과제 22분 · 정리 5분)

:::path 📂 시작 상태
[Day 6](#/day/p2-d06)의 "오늘 끝 상태 전체 코드"가 있어야 해요. 없거나 다르면 그 코드로 먼저 맞춰 주세요.

- `C:\dev\streamer-hub\README.md`, `C:\dev\streamer-hub\.git\`
- `C:\dev\ts-practice\src\types.ts` (오늘 프로젝트로 복사해요), `C:\dev\ts-practice\src\data.ts`, `C:\dev\ts-practice\src\main.ts`, `C:\dev\ts-practice\src\format.ts`, `C:\dev\ts-practice\src\hello.ts`, `C:\dev\ts-practice\tsconfig.json`, `C:\dev\ts-practice\package.json`, `C:\dev\ts-practice\package-lock.json`, `C:\dev\ts-practice\hello.js`, `C:\dev\ts-practice\node_modules\`, `C:\dev\ts-practice\dist\`
- Node.js LTS가 설치되어 있어요(`node --version`이 `v22.22.2` 이상, `v24.15` 이상, `v26` 이상 중 하나, 작성 기준 v26.13.0).
- PowerShell에서 `npm --version`이 빨간 오류 없이 숫자를 보여 줘요(안 되면 [Day 3](#/day/p2-d03) 3단계).
- VS Code, Chrome 또는 Edge, Git, GitHub 계정이 있어요. GitHub의 `streamer-hub` 저장소와 `C:\dev\streamer-hub`가 연결되어 있어요([Day 2](#/day/p2-d02)).
- 인터넷에 연결되어 있어야 해요(패키지를 내려받아요). 켜 두어야 할 프로그램은 없어요. 오늘 1~3단계에서 개발 서버를 처음 켜요.
:::

## 📖 개념 이해

### Vite: TypeScript 화면을 바로 보여 주는 도구

어제까지는 `.ts` 파일을 `npx tsc`로 `.js`로 바꾸고 `node`로 실행했어요. 그런데 화면(브라우저)을 만들 때는 더 필요한 일이 많아요. TypeScript를 JavaScript로 바꾸고, 여러 파일을 묶고, CSS를 붙이고, 고칠 때마다 브라우저를 새로 고쳐야 해요. 이 일을 자동으로 해 주는 도구가 Vite예요.

**비유:** 요리할 때 쓰는 인덕션이에요. 불을 직접 붙이고 끄는 대신, 켜 두면 알아서 일정하게 데워 줘요. Vite를 켜 두면 파일을 고칠 때마다 알아서 변환하고 브라우저에 보내 줘요.

**정확한 정의:**

- **[[Vite]]**(비트, 프랑스어로 "빠른")는 개발 서버와 빌드 도구를 함께 주는 프론트엔드 개발 도구예요. TypeScript를 따로 변환하지 않아도 브라우저에서 바로 실행할 수 있게 해 줘요.
- **[[개발 서버]]**(dev server)는 내 컴퓨터 안에서만 켜지는 임시 웹 서버예요. 파일을 고치면 바로 반영해서 보여 줘요. P1에서 쓴 Live Preview와 같은 종류예요. 개발 서버는 만드는 동안만 켜 두고, 완성된 사이트를 인터넷에 올릴 때는 쓰지 않아요.
- **[[localhost]]**(로컬호스트)는 "지금 쓰고 있는 이 컴퓨터 자신"을 가리키는 주소 이름이에요. `127.0.0.1`과 같은 곳이에요. `localhost` 주소는 내 컴퓨터 안에서만 열려요.
- **[[포트]]**(port)는 한 컴퓨터 안에서 프로그램마다 따로 쓰는 출입구 번호예요. 주소 뒤에 `:` 다음으로 붙어요. `http://localhost:5173`은 "내 컴퓨터의 5173번 출입구"예요. Vite는 5173번을, 나중에 만들 C# 서버는 5250번을 써요.
- **[[HMR]]**(에이치엠알, Hot Module Replacement)은 파일을 저장하면 브라우저를 직접 새로 고치지 않아도 바뀐 내용이 바로 화면에 반영되는 기능이에요. CSS처럼 바뀐 부분만 갈아 끼울 수 있는 파일은 화면 상태를 그대로 둔 채 바꾸고, 그럴 수 없는 파일(예: `main.ts`)은 Vite가 페이지를 자동으로 다시 불러와요.
- **[[빌드]]**(build)는 개발용으로 흩어져 있는 파일을 배포할 수 있는 모양으로 묶고 줄이는 일이에요. TypeScript는 JavaScript가 되고, 여러 파일은 한두 개가 되고, 파일 이름 뒤에 내용에 따라 바뀌는 해시(예: `index-lU12jUTO.js`)가 붙어요. 결과는 `dist` 폴더에 생겨요.

개발 중과 배포용을 이렇게 나눠요.

```text
개발 중: npm run dev
  src\main.ts 저장
  → Vite가 변환
  → 5173 화면 즉시 변경

배포용: npm run build
  src → dist\ (묶음 파일)
```

### 타입 단언: "이 값은 null이 아니에요, 제가 보장해요"

`document.querySelector('#app')`은 [P1 Day 20](#/day/p1-d20)에서 배웠어요. 그런데 TypeScript에서는 이 함수가 요소를 찾지 못하면 `null`을 돌려줄 수 있다고 봐요. 그래서 이렇게 써요.

```ts
const app = document.querySelector<HTMLElement>('#app')!;
```

- `<HTMLElement>`: 찾은 요소가 `HTMLElement`(HTML 요소 일반)라고 TypeScript에 알려 줘요. 제네릭이에요([Day 6](#/day/p2-d06)).
- 끝의 `!`: "이 값은 `null`이 아니에요"라고 TypeScript에게 약속하는 표시예요.

**[[타입 단언]]**(type assertion)은 TypeScript보다 개발자가 더 잘 아는 정보를 알려 주는 문법이에요. 여기서는 `index.html`에 `<main id="app">`을 이미 써 두었으니 반드시 있다는 것을 내가 알고 있어요. 하지만 `!`는 검사를 끄는 거라서, 정말 확실할 때만 써요. 틀리면 실행 중에 오류가 나요.

### innerHTML: HTML 글자를 요소로 바꿔 넣는 속성

P1에서는 `createElement`와 `textContent`로 요소를 하나씩 만들었어요([P1 Day 20](#/day/p1-d20)). 큰 틀은 한꺼번에 쓰는 편이 읽기 쉬워서, 오늘은 **[[innerHTML]]**(이너에이치티엠엘)을 처음 써요. 이것은 요소 안의 내용을 "HTML 글자"로 통째로 바꿔 넣는 속성이에요.

```ts
app.innerHTML = `<h1>안녕하세요</h1>`;
```

`textContent`는 넣은 글자를 그대로 글자로 보여 주지만, `innerHTML`은 `<h1>` 같은 태그를 진짜 요소로 바꿔요.

:::warn `innerHTML`에는 우리가 쓴 고정 글자만 넣어요
방문자가 입력한 글이나 서버에서 받은 값을 `innerHTML`에 넣으면 위험해요. 누군가 글에 `<script>`를 적어 두면 내 사이트에서 실행될 수 있어요(Day 34에서 직접 실험해요). 그래서 이 프로젝트는 `innerHTML`에는 우리가 직접 쓴 문장만 넣고, 사용자가 쓴 값은 `textContent`로 넣어요.
:::

:::info 실무에서는
회사에서는 React, Vue 같은 프레임워크가 화면을 그려 줘서 `innerHTML`을 직접 쓰는 일은 적어요. 하지만 프레임워크도 결국 비슷한 일을 해요. 이 프로젝트는 프레임워크 없이 만들어서 기본 원리를 몸으로 익혀요. Vite는 실무에서 가장 많이 쓰는 도구 중 하나예요.
:::

## 🛠️ 따라하기

모두 10단계예요. 1~3단계는 프로젝트를 만들고 켜 보기, 4~8단계는 내 화면으로 바꾸기, 9~10단계는 빌드와 기록이에요.

### 1단계 · Vite 프로젝트 만들기 (8분)

**어디서:** VS Code → `C:\dev\streamer-hub` 폴더가 열린 창 → 터미널

**무엇을:**

1. VS Code에서 `C:\dev\streamer-hub` 폴더가 열린 창을 찾아 `` Ctrl + ` ``를 눌러 터미널을 열어요. 폴더가 안 열려 있으면 아무 터미널에서 `code C:\dev\streamer-hub`를 입력해 열어요.
2. 프롬프트가 `PS C:\dev\streamer-hub>`인지 읽어요. 아니면 `cd C:\dev\streamer-hub`를 입력해요.
3. 아래 명령을 입력해요. `client`는 만들 폴더 이름이고, `--` 뒤는 Vite 도구에게 전하는 옵션이에요.

```powershell
npm create vite@latest client -- --template vanilla-ts
```

4. 처음에는 "Need to install the following packages: create-vite@9.3.4 / Ok to proceed? (y)" 같은 질문이 나올 수 있어요(버전 숫자는 달라도 돼요). `y`를 입력하고 `Enter`를 눌러요.
5. 마지막에 이런 질문이 나와요. Vite 도구가 만들어 주는 화면은 영어이고, 방향키로 답을 골라요.

```text
Install with npm and start now?
```

`Yes`와 `No`가 나란히 보여요. 키보드의 방향키(`←` `→`, 또는 `↑` `↓`)로 **No**를 고르고 `Enter`를 눌러요. 설치와 실행을 우리가 직접 해 보려고 No를 고르는 거예요.

예상 출력(경로와 버전 숫자는 달라도 돼요. 줄 앞의 기호 모양도 달라도 돼요):

```text
Scaffolding project in C:\dev\streamer-hub\client...

Done. Now run:

  cd client
  npm install
  npm run dev
```

:::success
`C:\dev\streamer-hub\client` 폴더가 생겼어요. VS Code 탐색기에서 `client` 폴더를 펼치면 `index.html`, `package.json`, `tsconfig.json`, `public`, `src` 등이 보여요.
:::

:::tip 질문의 다른 답
- **Yes**를 골랐다면 자동으로 설치되고 개발 서버가 바로 켜져요. 이미 2~3단계를 한 셈이니, 브라우저에서 `http://localhost:5173`을 열고 4단계로 가요. 그 터미널은 서버가 쓰고 있으니 새 터미널(3단계의 `+`)을 열어 작업해요.
- 폴더가 이미 있다고 `Target directory "client" is not empty. Please choose how to proceed:`가 나오면 `Cancel operation`을 골라 멈춰요. `client` 폴더에 파일이 있는지 확인하고 비어 있지 않다면 이름을 바꾸거나 지운 뒤 다시 해요.
- 질문에서 템플릿을 잘못 골랐다면 `client` 폴더를 지우고 처음부터 다시 해요(아래 🧯 참고).
:::

### 2단계 · 패키지 설치하기 (5분)

**어디서:** VS Code 터미널

**무엇을:** 한 줄씩 입력해요.

```powershell
cd client
```

프롬프트가 `PS C:\dev\streamer-hub\client>`로 바뀐 것을 읽고 다음을 입력해요.

```powershell
npm install
```

내려받는 동안 몇 초 걸려요. 예상 출력(숫자는 달라도 돼요):

```text
added 17 packages, and audited 18 packages in 10s

8 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

:::success
`client` 폴더 안에 `node_modules` 폴더와 `package-lock.json`이 생겼어요. `found 0 vulnerabilities`가 보여요. 숫자가 달라도 오류 글자(`npm error`)가 없으면 괜찮아요.
:::

### 3단계 · 개발 서버 켜고 브라우저로 보기 (8분)

**어디서:** VS Code 터미널, 위치 `C:\dev\streamer-hub\client`

**무엇을:**

1. 개발 서버를 켜요.

```powershell
npm run dev
```

예상 출력(버전과 시간 숫자는 달라도 돼요. 터미널에 따라 `press h + enter to show help` 줄이 더 보일 수 있어요):

```text
> client@0.0.0 dev
> vite

  VITE v8.3.6  ready in 171 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

2. Windows 보안 경고(방화벽) 창이 뜨면 아래 상자를 읽어요.
3. 브라우저(Chrome 또는 Edge)를 열고 주소 표시줄에 `http://localhost:5173`을 입력한 뒤 `Enter`를 눌러요. 터미널의 `Local:` 뒤 주소를 `Ctrl` 키를 누른 채 클릭해도 열려요.
4. 파일을 고치면 바로 바뀌는 것을 확인해요. VS Code에서 `client\src\main.ts`를 열고 `Get started` 글자를 `안녕, Vite!`로 바꾼 뒤 `Ctrl + S`로 저장해요.
5. 이번에는 CSS를 고쳐 봐요. `client\src\style.css`를 열고 맨 위 근처의 `--bg: #fff;` 줄을 `--bg: #fff3c4;`로 바꿔 저장해요. 확인했으면 `#fff`로 되돌려요. (Windows가 다크 모드이면 배경이 바뀌지 않을 수 있어요. 글자만 확인해도 돼요.)

:::warn Windows 보안 경고(방화벽) 창이 뜨면
"Windows 방화벽에서 이 앱의 일부 기능을 차단했습니다" 같은 창(문구는 버전에 따라 달라요)에 `node.exe` 이름이 보일 수 있어요. 이 창이 안 뜨는 컴퓨터도 많아요. 뜨면 **개인 네트워크**만 체크한 채로 **액세스 허용**을 클릭하거나, **취소**를 클릭해도 돼요. 오늘 쓰는 `localhost` 주소는 내 컴퓨터 안의 통신이라서 어느 쪽이든 동작해요. **방화벽을 끄는 일은 하지 않아요.**
:::

:::success
- 터미널에 `Local:   http://localhost:5173/`이 보이고 프롬프트는 돌아오지 않아요. 서버가 일하는 중이라서 정상이에요.
- 브라우저에 Vite 템플릿 화면(큰 로고와 "Get started", 숫자 세는 버튼)이 보여요.
- 저장하자마자 내가 새로 고침을 누르지 않았는데 글자가 `안녕, Vite!`로 바뀌어요. `main.ts`를 고친 경우는 Vite가 페이지 전체를 자동으로 다시 불러와 주는 것이에요(HMR이 아니라 자동 새로 고침).
- CSS를 고치면 페이지를 다시 불러오지 않고 배경색만 바뀌어요. 이처럼 바뀐 부분만 갈아 끼우는 것이 HMR이에요.
:::

이 터미널은 이제 개발 서버가 쓰고 있어요. 다른 명령을 치려면 **터미널을 하나 더** 열어야 해요. VS Code 아래 터미널 패널 오른쪽 위의 **+**(새 터미널) 아이콘을 클릭해요. 새 터미널의 프롬프트는 `PS C:\dev\streamer-hub>`로 시작해요. 개발 서버를 끌 때는 서버가 켜진 터미널을 클릭하고 `Ctrl + C`를 눌러요. `Terminate batch job (Y/N)?`라고 물으면 `Y`를 입력하고 `Enter`를 눌러요.

### 4단계 · `tsconfig.json`에 `strict` 더하기 (5분)

TypeScript의 엄격한 검사 `strict`는 7 버전에서는 이미 기본으로 켜져 있어요. 하지만 연습 폴더 때처럼 파일에 직접 적어 두면 "이 프로젝트는 엄격하게 검사해요"가 눈에 보여요.

**어디서:** VS Code → `client\tsconfig.json`

**무엇을:**

1. 탐색기에서 `client` 폴더의 `tsconfig.json`을 열어요.
2. `/* Linting */` 주석 줄을 찾아요. 그 바로 아래에 새 줄을 만들고 다음 한 줄을 입력해요. 앞 들여쓰기는 스페이스 4칸이에요.
3. `Ctrl + S`로 저장해요.

📄 C:\dev\streamer-hub\client\tsconfig.json (일부)
```json
    "strict": true,
```

결과 모양은 이래요. `noUnusedLocals` 줄 위에 새 줄이 들어갔어요.

```json
    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
```

:::success
`tsconfig.json`의 `/* Linting */` 아래에 `"strict": true,`가 있어요. 쉼표를 빼먹으면 빨간 밑줄이 생겨요. 저장한 뒤에도 브라우저 화면은 그대로예요.
:::

### 5단계 · `favicon.svg`와 `index.html` 바꾸기 (6분)

**어디서:** VS Code → `client` 폴더

**무엇을:**

1. `client\public\favicon.svg`를 열고 내용을 모두 지운 뒤 아래 한 줄로 바꿔요. 탭 위쪽 아이콘이 바뀌어요. 저장해요.

📄 C:\dev\streamer-hub\client\public\favicon.svg
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#5b4bdb"/><circle cx="16" cy="16" r="5" fill="#fff"/><path d="M8 8a11 11 0 0 0 0 16M24 8a11 11 0 0 1 0 16" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></svg>
```

2. `client\index.html`을 열고 내용을 모두 지운 뒤 아래 내용으로 바꿔요. 저장해요.

📄 C:\dev\streamer-hub\client\index.html
```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>스트리머 허브</title>
  </head>
  <body>
    <header class="site-header">
      <a class="logo" href="#/">스트리머 허브</a>
      <nav aria-label="주 메뉴">
        <ul class="nav-links">
          <li><a href="#/">홈</a></li>
          <li><a href="#/streamers">스트리머</a></li>
          <li><a href="#/schedule">방송 일정</a></li>
          <li><a href="#/board">팬 게시판</a></li>
        </ul>
      </nav>
    </header>

    <!-- 화면(페이지)은 모두 여기에 그려져요 -->
    <main id="app" class="container"></main>

    <footer class="site-footer">
      <p>스트리머 허브</p>
    </footer>

    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

`index.html`에서 알아 둘 것이에요.

- `<html lang="ko">`: 한국어 페이지예요([P1 Day 3](#/day/p1-d03)).
- `<header class="site-header">`: 머리말이에요. 로고(`a.logo`)와 메뉴(`nav`)가 있어요. 메뉴 링크의 `#/streamers` 같은 주소는 누르면 주소 표시줄만 바뀌고 화면은 아직 안 바뀌어요. 화면을 바꾸는 코드는 Day 28부터 만들어요.
- `<main id="app" class="container">`: 화면이 그려질 빈 자리예요. 다음 단계의 `main.ts`가 여기에 그려요.
- `<script type="module" src="/src/main.ts">`: Vite가 이 파일을 시작점으로 삼아 TypeScript를 변환해요. `/src/main.ts`의 맨 앞 `/`는 `client` 폴더를 가리켜요.

:::success
브라우저 탭 아이콘이 보라색 바탕에 하얀 동그라미로 바뀌고(바로 안 바뀌면 `Ctrl + Shift + R`로 강하게 새로 고침해요), 탭 제목이 `스트리머 허브`가 돼요. 화면 위쪽에 머리말(로고 + 메뉴 4개)과 맨 아래에 꼬리말이 보여요. 가운데에는 아직 Vite 템플릿 내용이 남아 있어서 어수선해 보여도 정상이에요. 7단계에서 정리해요.
:::

### 6단계 · `style.css` 바꾸기 (8분)

색과 레이아웃을 정하는 CSS예요. P1에서 만든 색 변수([P1 Day 14](#/day/p1-d14))와 같은 이름과 같은 색이라서 낯설지 않을 거예요. 다크 모드([P1 Day 22](#/day/p1-d22))도 같은 방식이에요.

**어디서:** VS Code → `client\src\style.css`

**무엇을:** 파일을 열고 내용을 모두 지운 뒤 아래 내용으로 바꾸고 저장해요. 길어서 복사 버튼을 쓰는 걸 권해요.

📄 C:\dev\streamer-hub\client\src\style.css
```css
/* ==========================================================
   style.css - 스트리머 허브 전체 스타일
   P1의 색 변수와 카드 모양을 그대로 가져왔어요. 순서: 변수 → 기본 → 머리말 → 공통 부품 → 화면별
   ========================================================== */

/* ---------- 1. 색 변수 ---------- */
:root {
  --bg: #ffffff;
  --surface: #f4f2ff;
  --text: #1d1b2e;
  --muted: #5a5775;
  --accent: #5b4bdb;
  --accent-text: #ffffff;
  --link: #4a3bc7;
  --border: #d9d6ee;
  --error: #b3261e;
  --danger: #b3261e;
  --highlight: #fff3c4;
  --radius: 12px;
  color-scheme: light dark;
}

/* 컴퓨터가 다크 모드면 변수 값만 바꿔요 */
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #14121f;
    --surface: #1f1c33;
    --text: #ece9ff;
    --muted: #b3aed6;
    --accent: #8f83ff;
    --accent-text: #14121f;
    --link: #b0a8ff;
    --border: #3a3660;
    --error: #ff8a80;
    --danger: #ff8a80;
    --highlight: #4a3f12;
  }
}

/* ---------- 2. 기본 ---------- */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: system-ui, 'Malgun Gothic', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
  line-height: 1.7;
  word-break: keep-all;
  overflow-wrap: break-word;
}

[hidden] {
  display: none !important;
}

a {
  color: var(--link);
}

h1,
h2 {
  line-height: 1.3;
}

h1 {
  font-size: 1.75rem;
}

h2 {
  font-size: 1.25rem;
  margin-top: 2rem;
}

:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
}

.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1rem 3rem;
}

.muted {
  color: var(--muted);
}

/* ---------- 3. 머리말·꼬리말 ---------- */
.site-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1.5rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border);
}

.logo {
  font-weight: 800;
  font-size: 1.2rem;
  color: var(--text);
  text-decoration: none;
}

.nav-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav-links a {
  text-decoration: none;
}

.nav-links a[aria-current='page'] {
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 6px;
}

.site-footer {
  padding: 1.5rem 1rem;
  border-top: 1px solid var(--border);
  color: var(--muted);
  text-align: center;
  font-size: 0.9rem;
}

/* ---------- 4. 공통 부품 ---------- */
.button {
  display: inline-block;
  padding: 0.5rem 1rem;
  border: 1px solid var(--accent);
  border-radius: 999px;
  background: var(--accent);
  color: var(--accent-text);
  font: inherit;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}

.button.secondary {
  background: transparent;
  color: var(--link);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* ---------- 5. 화면별 ---------- */
.hero {
  padding: 1.5rem;
  margin-top: 1.5rem;
  border-radius: var(--radius);
  background: var(--surface);
}

.hero h1 {
  margin-top: 0;
}
```

구역 주석(`/* ---------- 1. 색 변수 ---------- */` 등)은 앞으로 기능을 더할 때 들어갈 자리를 알려 줘요. 이 파일은 뒤 Day에서 조금씩 길어져요.

:::success
글꼴과 색이 바뀌고, 머리말의 로고와 메뉴가 가로로 나란히 서요. Windows가 다크 모드이면 배경이 어두워져요. 가운데 템플릿 내용은 아직 남아 있어서 어수선해 보여도 정상이에요.
:::

### 7단계 · `types.ts` 복사하고 `main.ts` 쓰기 (10분)

연습 폴더에서 만든 타입을 프로젝트로 옮겨요. 그리고 홈 화면의 큰 소개를 `innerHTML`로 그려요.

**어디서:** VS Code 터미널(새 터미널), 위치 `C:\dev\streamer-hub`, 그다음 VS Code 편집기

**무엇을:**

1. 새 터미널을 열어요(**+** 아이콘). 프롬프트가 `PS C:\dev\streamer-hub>`인지 읽어요. 아니면 `cd C:\dev\streamer-hub`를 입력해요.
2. `types.ts`를 복사해요.

```powershell
Copy-Item C:\dev\ts-practice\src\types.ts C:\dev\streamer-hub\client\src\types.ts
```

`Copy-Item 원본 대상`은 파일을 복사하는 명령이에요(복사하기, 줄임말 `cp`).

아무것도 나오지 않고 프롬프트가 돌아오면 성공이에요. 이 프로젝트에서는 파일 이름 끝에 `.ts`를 그대로 쓰는 import를 써요(`./types.ts`). 오늘은 아직 가져다 쓰지 않고 Day 8부터 써요.

3. `client\src\main.ts`를 열고 내용을 모두 지운 뒤 아래 내용으로 바꾸고 저장해요.

📄 C:\dev\streamer-hub\client\src\main.ts
```ts
// 사이트의 시작점: 지금은 첫 화면(홈)의 큰 소개만 그려요
import './style.css';

// index.html에 처음부터 있는 요소라서 반드시 있어요(!)
const app = document.querySelector<HTMLElement>('#app')!;

// 틀은 innerHTML로 한 번에 만들어요. 여기에는 우리가 쓴 고정 글자만 넣어요
app.innerHTML = `
  <section class="hero">
    <h1>스트리머 허브</h1>
    <p>좋아하는 스트리머의 방송 일정을 확인하고, 팬끼리 이야기를 나눠요.</p>
  </section>
`;
```

코드의 뜻이에요.

- `import './style.css';`: CSS 파일을 불러와요. Vite가 알아서 화면에 붙여 줘요.
- `document.querySelector<HTMLElement>('#app')!`: `index.html`의 `<main id="app">`을 찾아요. 끝의 `!`는 타입 단언이에요.
- `app.innerHTML = `…`;`: 백틱(`` ` ``)으로 감싼 여러 줄 글자를 `main` 안에 HTML로 넣어요. 템플릿 리터럴([P1 Day 16](#/day/p1-d16))이에요.

:::success
브라우저가 자동으로 바뀌어요. 큰 보라 배경 상자 안에 **스트리머 허브**라는 큰 제목과 소개 글 "좋아하는 스트리머의 방송 일정을 확인하고, 팬끼리 이야기를 나눠요."가 보여요. 머리말에는 로고와 메뉴 4개(홈, 스트리머, 방송 일정, 팬 게시판), 맨 아래에는 꼬리말이 있어요. Windows가 다크 모드이면 배경이 어두운 색이에요. 템플릿의 로고와 숫자 버튼은 사라졌어요.
:::

### 8단계 · 템플릿에서 안 쓰는 파일 지우기 (4분)

Vite 템플릿이 만들어 준 예제 파일 중 우리가 안 쓰는 것을 지워요. 이제 `main.ts`가 이 파일들을 가져다 쓰지 않아서 지워도 오류가 나지 않아요.

**어디서:** VS Code 터미널(새 터미널), 위치 `C:\dev\streamer-hub`

**무엇을:**

:::warn 지울 파일의 경로를 확인하세요
`Remove-Item`은 휴지통 없이 바로 지워요. 아래 세 명령은 템플릿 예제 파일만 지워요. `-Recurse -Force`가 붙은 줄은 폴더(`assets`) 안의 모든 것을 지우니 경로를 한 번 더 읽고 실행하세요.
:::

```powershell
Remove-Item C:\dev\streamer-hub\client\src\counter.ts
```

```powershell
Remove-Item -Recurse -Force C:\dev\streamer-hub\client\src\assets
```

```powershell
Remove-Item C:\dev\streamer-hub\client\public\icons.svg
```

세 명령 모두 아무것도 나오지 않고 프롬프트가 돌아오면 성공이에요.

:::success
VS Code 탐색기의 `client\src`에 `main.ts`, `style.css`, `types.ts` 세 파일만 남았어요. `client\public`에는 `favicon.svg`만 있어요. 개발 서버 터미널에 빨간 오류가 없고 브라우저 화면은 그대로예요.
:::

### 9단계 · 빌드하고 미리 보기 (6분)

**어디서:** VS Code 터미널(새 터미널), 위치 `C:\dev\streamer-hub\client`

**무엇을:**

1. 위치를 옮겨요.

```powershell
cd C:\dev\streamer-hub\client
```

2. 타입 검사와 빌드를 해요. `npm run build`는 먼저 `tsc`로 타입 오류를 검사하고(`tsc`), 이어서 Vite가 묶어요(`vite build`).

```powershell
npm run build
```

예상 출력(파일 이름 뒤의 해시와 크기, 시간은 달라도 돼요):

```text
> client@0.0.0 build
> tsc && vite build

vite v8.3.6 building client environment for production...
transforming...
✓ 5 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                 1.04 kB │ gzip: 0.57 kB
dist/assets/index-lU12jUTO.css  2.04 kB │ gzip: 0.91 kB
dist/assets/index-cwQoOfJm.js   0.89 kB │ gzip: 0.58 kB

✓ built in 144ms
```

3. 만들어진 결과를 개발 서버가 아니라 **빌드 결과 그대로** 열어 봐요.

```powershell
npm run preview
```

예상 출력:

```text
> client@0.0.0 preview
> vite preview

  ➜  Local:   http://localhost:4173/
  ➜  Network: use --host to expose
```

4. 브라우저에서 `http://localhost:4173`을 열어요. 5173 화면과 같은 모양이에요.
5. 미리 보기 서버가 켜진 터미널을 클릭하고 `Ctrl + C`를 눌러 꺼요. (`Terminate batch job (Y/N)?`가 나오면 `Y`)

:::success
- 빌드 끝에 `✓ built in …`이 보이고 `client\dist` 폴더가 생겼어요. 그 안에 `index.html`과 `assets` 폴더가 있어요.
- 4173 화면과 5173 화면이 같아요. 5173은 개발 서버(고치는 중), 4173은 빌드 결과(배포용)예요.
- 개발 서버(5173)는 꺼지 않아도 괜찮아요.
:::

### 10단계 · Git에 기록하고 올리기 (7분)

**어디서:** VS Code 터미널(새 터미널), 위치 `C:\dev\streamer-hub`

**무엇을:**

1. 프로젝트 폴더로 옮겨요.

```powershell
cd C:\dev\streamer-hub
```

2. 상태를 봐요. 프로젝트 파일은 많은데 `node_modules`나 `dist`는 보이지 않아야 해요. 이 둘은 `client\.gitignore`가 "Git에 올리지 마세요"라고 적어 둔 폴더예요.

```powershell
git status
```

예상 출력:

```text
On branch main
Your branch is up to date with 'origin/main'.

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	client/

nothing added to commit but untracked files present (use "git add" to track)
```

3. 올릴 파일을 모두 담아요. 처음 올리는 파일들이라 "줄바꿈이 바뀔 수 있다"는 안내가 여러 줄 나올 수 있어요. 무시해도 되는 안내예요.

```powershell
git add -A
```

예상 출력(파일 이름은 목록과 같아도 되고 일부만 나와도 돼요):

```text
warning: in the working copy of 'client/.gitignore', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'client/index.html', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'client/package-lock.json', LF will be replaced by CRLF the next time Git touches it
```

풀이: 도구가 만든 파일은 줄바꿈이 리눅스 방식(LF)이라서, Windows 방식(CRLF)으로 바뀔 수 있다는 알림이에요. 오류가 아니고 해결할 일도 없어요.

4. 담긴 것을 확인해요.

```powershell
git status
```

예상 출력:

```text
On branch main
Your branch is up to date with 'origin/main'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	new file:   client/.gitignore
	new file:   client/index.html
	new file:   client/package-lock.json
	new file:   client/package.json
	new file:   client/public/favicon.svg
	new file:   client/src/main.ts
	new file:   client/src/style.css
	new file:   client/src/types.ts
	new file:   client/tsconfig.json
```

5. 기록하고 올려요.

```powershell
git commit -m "day07: Vite 프로젝트"
```

```powershell
git push
```

:::success
- `git status`의 파일 목록에 `node_modules`와 `dist`가 없어요.
- `git commit`이 `9 files changed`로 시작하는 줄을 보여 주고, `git push`가 `main -> main`으로 끝나요.
- GitHub 저장소 페이지에 `client` 폴더가 보여요.
:::

## ✍️ 과제

### 과제 1 · 꼬리말 문구 바꾸고 HMR 확인하기 (쉬움 ⭐, 5분)

- `client\index.html`의 꼬리말 문구를 `스트리머 허브 · 시간은 모두 한국 시간이에요`로 바꿔요.
- 개발 서버(5173)가 켜져 있는 상태로 저장해서 내가 새로 고침을 누르지 않아도 바뀌는지 봐요.
- 확인: 맨 아래 꼬리말에 바뀐 문구가 보여요.
- 힌트: `<footer>` 안의 `<p>` 글자만 바꿔요.

### 과제 2 · 큰 소개에 버튼 두 개 더하기 (보통 ⭐⭐, 10분)

- `main.ts`의 소개 글 아래에 버튼 두 개를 더해요. 하나는 주소가 `#/schedule`인 "이번 주 방송 일정", 다른 하나는 주소가 `#/streamers`인 "스트리머 보기"예요.
- 첫 번째는 `class="button"`, 두 번째는 `class="button secondary"`로 하고 `<p class="actions">` 안에 나란히 둬요. 이 클래스는 `style.css`에 이미 있어요.
- 확인: 보라색 알약 모양 버튼과 테두리만 있는 버튼이 나란히 보여요. 누르면 주소 끝만 `#/schedule`처럼 바뀌어요.
- 힌트: `<a>` 태그는 [P1 Day 4](#/day/p1-d04)에서 배웠어요. 이 버튼은 `<a>`에 클래스를 붙여 만들어요.

### 과제 3 · 빌드 결과의 해시 이름 찾기 (쉬움 ⭐, 5분)

- `npm run build`를 한 뒤 `client\dist\index.html`을 VS Code에서 열어요.
- `<script>` 줄의 `src` 주소를 읽어요.
- 확인: `/assets/index-…해시….js`처럼 `/assets/`로 시작하고 이름에 알 수 없는 글자가 붙어 있어요.
- 힌트: 소스에는 `/src/main.ts`였던 주소가 빌드에서는 어떻게 바뀌었는지 비교해요.

### 마무리 · 과제 결과도 커밋하기 (2분)

과제로 `index.html`과 `main.ts`가 바뀌었어요. 기록으로 남겨야 Day를 마칠 때 `git status`가 깨끗해요.

**어디서:** VS Code 터미널(새 터미널), 위치 `C:\dev\streamer-hub`

```powershell
git add -A
```

```powershell
git commit -m "day07: 과제"
```

```powershell
git push
```

:::success
`git status`가 `nothing to commit, working tree clean`이에요. GitHub의 `client\index.html` 꼬리말에 바뀐 문구가 보여요.
:::

## ✅ 정답

:::answer 과제 1 정답 · 꼬리말 바꾸기
📄 C:\dev\streamer-hub\client\index.html (일부)
```html
    <footer class="site-footer">
      <p>스트리머 허브 · 시간은 모두 한국 시간이에요</p>
    </footer>
```

**왜 이렇게 하나요?** 서버가 주는 시각은 UTC인데, 화면은 한국 시간으로 보여 준다는 약속을 꼬리말에 써 둬요. Day 29에서 실제로 한국 시간으로 바꾸는 코드를 만들어요. `index.html`이나 `main.ts`가 바뀌면 Vite는 페이지 전체를 자동으로 다시 불러와요. 어느 쪽이든 내가 새로 고침하지 않아도 바뀌면 맞아요.
:::

:::answer 과제 2 정답 · 버튼 두 개
📄 C:\dev\streamer-hub\client\src\main.ts
```ts
// 사이트의 시작점: 지금은 첫 화면(홈)의 큰 소개만 그려요
import './style.css';

// index.html에 처음부터 있는 요소라서 반드시 있어요(!)
const app = document.querySelector<HTMLElement>('#app')!;

// 틀은 innerHTML로 한 번에 만들어요. 여기에는 우리가 쓴 고정 글자만 넣어요
app.innerHTML = `
  <section class="hero">
    <h1>스트리머 허브</h1>
    <p>좋아하는 스트리머의 방송 일정을 확인하고, 팬끼리 이야기를 나눠요.</p>
    <p class="actions">
      <a class="button" href="#/schedule">이번 주 방송 일정</a>
      <a class="button secondary" href="#/streamers">스트리머 보기</a>
    </p>
  </section>
`;
```

**왜 이렇게 하나요?** 링크(`<a>`)를 `button` 클래스로 꾸미면 버튼처럼 보이는 링크가 돼요. 주소 `#/schedule`처럼 `#`로 시작하는 링크는 같은 페이지 안에서 주소 끝만 바꿔요. 이 방식으로 Day 28에 화면을 바꿔요. `class="secondary"`는 배경 없이 테두리만 있는 보조 버튼 모양이에요.
:::

:::answer 과제 3 정답 · 해시 이름
```html
<script type="module" crossorigin src="/assets/index-cwQoOfJm.js"></script>
<link rel="stylesheet" crossorigin href="/assets/index-lU12jUTO.css">
```

해시 글자(`cwQoOfJm`, `lU12jUTO`)는 사람마다 달라요.

**왜 이렇게 하나요?** 빌드는 TypeScript를 JavaScript로 바꿔 한 파일로 묶고, CSS도 한 파일로 묶어요. 파일 이름에 내용에 따라 달라지는 해시를 붙이는 이유는 브라우저가 옛 파일을 기억하고 있다가 새 코드를 못 받는 일을 막으려는 거예요. 내용이 바뀌면 이름도 바뀌어서 새 파일을 받아요.
:::

:::answer 오늘 끝 상태 전체 코드
오늘 따라하기와 과제를 모두 끝낸 상태예요. 막혔다면 `C:\dev\streamer-hub\client`에 아래 폴더와 파일을 만들고 `client` 폴더에서 `npm install`을 실행한 뒤 Day 8을 시작하세요. `package.json`, `.gitignore`, `package-lock.json`은 `npm create vite@latest client -- --template vanilla-ts`와 `npm install`이 만들어 줘요. `node_modules`와 `dist`는 도구가 만든 것이라 직접 만들지 않아요.

```text
C:\dev\streamer-hub\
├─ .git\
├─ README.md
└─ client\
   ├─ node_modules\
   ├─ dist\
   ├─ public\
   │  └─ favicon.svg
   ├─ src\
   │  ├─ main.ts
   │  ├─ style.css
   │  └─ types.ts
   ├─ .gitignore
   ├─ index.html
   ├─ package-lock.json
   ├─ package.json
   └─ tsconfig.json
```

오늘 바뀌거나 새로 생긴 파일을 모두 실었어요. `src\main.ts`는 위 과제 2 정답과 같아요. `index.html`은 과제 1의 꼬리말까지 반영한 아래 전체예요.

📄 C:\dev\streamer-hub\client\public\favicon.svg
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#5b4bdb"/><circle cx="16" cy="16" r="5" fill="#fff"/><path d="M8 8a11 11 0 0 0 0 16M24 8a11 11 0 0 1 0 16" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></svg>
```

📄 C:\dev\streamer-hub\client\src\style.css
```css
/* ==========================================================
   style.css - 스트리머 허브 전체 스타일
   P1의 색 변수와 카드 모양을 그대로 가져왔어요. 순서: 변수 → 기본 → 머리말 → 공통 부품 → 화면별
   ========================================================== */

/* ---------- 1. 색 변수 ---------- */
:root {
  --bg: #ffffff;
  --surface: #f4f2ff;
  --text: #1d1b2e;
  --muted: #5a5775;
  --accent: #5b4bdb;
  --accent-text: #ffffff;
  --link: #4a3bc7;
  --border: #d9d6ee;
  --error: #b3261e;
  --danger: #b3261e;
  --highlight: #fff3c4;
  --radius: 12px;
  color-scheme: light dark;
}

/* 컴퓨터가 다크 모드면 변수 값만 바꿔요 */
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #14121f;
    --surface: #1f1c33;
    --text: #ece9ff;
    --muted: #b3aed6;
    --accent: #8f83ff;
    --accent-text: #14121f;
    --link: #b0a8ff;
    --border: #3a3660;
    --error: #ff8a80;
    --danger: #ff8a80;
    --highlight: #4a3f12;
  }
}

/* ---------- 2. 기본 ---------- */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: system-ui, 'Malgun Gothic', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
  line-height: 1.7;
  word-break: keep-all;
  overflow-wrap: break-word;
}

[hidden] {
  display: none !important;
}

a {
  color: var(--link);
}

h1,
h2 {
  line-height: 1.3;
}

h1 {
  font-size: 1.75rem;
}

h2 {
  font-size: 1.25rem;
  margin-top: 2rem;
}

:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
}

.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1rem 3rem;
}

.muted {
  color: var(--muted);
}

/* ---------- 3. 머리말·꼬리말 ---------- */
.site-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1.5rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border);
}

.logo {
  font-weight: 800;
  font-size: 1.2rem;
  color: var(--text);
  text-decoration: none;
}

.nav-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav-links a {
  text-decoration: none;
}

.nav-links a[aria-current='page'] {
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 6px;
}

.site-footer {
  padding: 1.5rem 1rem;
  border-top: 1px solid var(--border);
  color: var(--muted);
  text-align: center;
  font-size: 0.9rem;
}

/* ---------- 4. 공통 부품 ---------- */
.button {
  display: inline-block;
  padding: 0.5rem 1rem;
  border: 1px solid var(--accent);
  border-radius: 999px;
  background: var(--accent);
  color: var(--accent-text);
  font: inherit;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}

.button.secondary {
  background: transparent;
  color: var(--link);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* ---------- 5. 화면별 ---------- */
.hero {
  padding: 1.5rem;
  margin-top: 1.5rem;
  border-radius: var(--radius);
  background: var(--surface);
}

.hero h1 {
  margin-top: 0;
}
```

📄 C:\dev\streamer-hub\client\src\types.ts
```ts
// 서버와 주고받는 데이터의 모양이에요. 다른 파일이 쓸 수 있게 export를 붙여요
export type Platform = 'chzzk' | 'youtube' | 'soop' | 'other';

export interface Streamer {
  id: number;
  name: string;
  platform: Platform;
  channelUrl: string;
  bio: string;
  avatarUrl: string | null; // 사진이 없으면 null
  createdAt: string;
}

export interface Schedule {
  id: number;
  streamerId: number;
  streamerName: string;
  title: string;
  startsAt: string; // UTC 문자열 (끝의 Z)
  durationMinutes: number;
}

// Streamer의 모든 칸 + 다가오는 일정
export interface StreamerDetail extends Streamer {
  schedules: Schedule[];
}

// 제네릭 인터페이스: 무엇의 목록이든 같은 모양으로 담아요
export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
```

📄 C:\dev\streamer-hub\client\.gitignore
```text
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

📄 C:\dev\streamer-hub\client\index.html
```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>스트리머 허브</title>
  </head>
  <body>
    <header class="site-header">
      <a class="logo" href="#/">스트리머 허브</a>
      <nav aria-label="주 메뉴">
        <ul class="nav-links">
          <li><a href="#/">홈</a></li>
          <li><a href="#/streamers">스트리머</a></li>
          <li><a href="#/schedule">방송 일정</a></li>
          <li><a href="#/board">팬 게시판</a></li>
        </ul>
      </nav>
    </header>

    <!-- 화면(페이지)은 모두 여기에 그려져요 -->
    <main id="app" class="container"></main>

    <footer class="site-footer">
      <p>스트리머 허브 · 시간은 모두 한국 시간이에요</p>
    </footer>

    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

📄 C:\dev\streamer-hub\client\tsconfig.json
```json
{
  "compilerOptions": {
    "target": "es2023",
    "module": "esnext",
    "lib": ["ES2023", "DOM"],
    "types": ["vite/client"],
    "allowArbitraryExtensions": true,
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

`package.json`은 템플릿이 만든 이 모양이에요(버전 숫자는 달라도 돼요).

📄 C:\dev\streamer-hub\client\package.json
```json
{
  "name": "client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "typescript": "~7.0.2",
    "vite": "^8.3.6"
  }
}
```
:::

## 🧯 자주 막히는 곳

여기에 없는 증상은 [문제 해결 모음](#/page/troubleshooting)에서 찾아보세요.

### `Port 5173 is in use, trying another one...`

```text
Port 5173 is in use, trying another one...

  VITE v8.3.6  ready in 188 ms

  ➜  Local:   http://localhost:5174/
```

**원인:** 이미 다른 터미널이나 다른 VS Code 창에서 개발 서버가 5173번을 쓰고 있어요. Vite가 알아서 다음 번호(5174)로 켜 줬어요. 오류가 아니라 안내예요.

**해결:**

1. 터미널에 보이는 `Local:` 뒤 주소(5174)로 브라우저를 열면 바로 쓸 수 있어요.
2. 같은 프로젝트의 서버가 두 개 켜진 거라면, 이전 서버가 켜진 터미널을 찾아 클릭하고 `Ctrl + C`로 꺼요. 터미널 패널의 **+** 옆 목록에서 열린 터미널을 볼 수 있어요.
3. 다시 `npm run dev`를 해서 `Local:`이 `5173`인지 확인해요.

### 브라우저에 "이 사이트에 연결할 수 없음", `ERR_CONNECTION_REFUSED`가 나와요

**원인:** 개발 서버가 꺼져 있어요. 터미널 창을 닫았거나, `Ctrl + C`를 눌렀거나, 컴퓨터를 다시 켰어요. 한국어 Chrome에서는 "localhost에서 연결을 거부했습니다"로 보여요.

**해결:**

1. VS Code 터미널에서 `cd C:\dev\streamer-hub\client`를 입력해요.
2. `npm run dev`를 입력하고 `Local:` 주소가 나오는지 봐요.
3. 브라우저를 `Ctrl + R`로 새로 고쳐서 화면이 나오면 해결이에요.

### 개발 서버를 켰더니 다음 명령을 칠 수 없어요

**원인:** 개발 서버는 끝나지 않는 프로그램이라서, 켜진 터미널을 계속 차지해요. 오류가 아니에요.

**해결:** VS Code 터미널 패널 오른쪽 위의 **+** 아이콘을 클릭해 새 터미널을 열고 거기서 명령을 쳐요. 서버를 끌 때만 서버 터미널에서 `Ctrl + C`를 눌러요.

### `Target directory "client" is not empty.` 또는 엉뚱한 템플릿으로 만들었어요

```text
Target directory "client" is not empty. Please choose how to proceed:
```

**원인:** `client` 폴더가 이미 있어요. 앞에서 한 번 만들었거나, 다른 템플릿으로 잘못 만들었어요(문구는 create-vite 버전에 따라 조금 달라요).

**해결:**

1. 프로젝트에 아직 중요한 변경이 없다면 `Cancel operation`으로 멈추고 `client` 폴더를 지워요. 경로를 확인해요: `Remove-Item -Recurse -Force C:\dev\streamer-hub\client`
2. 1단계의 `npm create vite@latest client -- --template vanilla-ts`를 다시 실행해요.
3. 폴더 목록에 `src\counter.ts`가 있고 `index.html`의 `<div id="app">`이 보이면 올바른 템플릿이에요.

### `Failed to resolve import "./stlye.css" from "src/main.ts". Does the file exist?`

```text
[plugin:vite:import-analysis] Failed to resolve import "./stlye.css" from "src/main.ts". Does the file exist?
```

**원인:** `import` 경로의 파일 이름을 잘못 썼거나(오타), 파일이 아직 없어요. 브라우저 화면 가득 이 오류가 빨간 상자로 떠요. 파일 이름은 내 오타에 따라 달라요.

**해결:**

1. 오류에 적힌 파일 이름(`./stlye.css`)과 `client\src` 폴더의 실제 파일 이름을 비교해요.
2. 오타를 고치고 저장하면 오류 상자가 저절로 사라져요.
3. 파일이 정말 없다면 앞 단계에서 만들었는지 확인해요.

### Windows 보안 경고(방화벽) 창이 떴어요

**원인:** 개발 서버(`node.exe`)가 처음 통신 포트를 열 때 Windows 방화벽이 물어볼 수 있어요.

**해결:** 3단계 상자의 안내대로 해요. 개인 네트워크만 허용하거나 취소하고, 방화벽을 끄지 않아요. `http://localhost:5173`이 열리면 해결이에요.

## 📝 오늘의 체크리스트

- [ ] `npm create vite@latest client -- --template vanilla-ts`로 `C:\dev\streamer-hub\client`를 만들고 `npm install`을 했어요
- [ ] `npm run dev` 후 브라우저 `http://localhost:5173`에 내 화면(로고, 메뉴 4개, 큰 소개, 꼬리말)이 보여요
- [ ] 파일을 저장하면 내가 새로 고침하지 않아도 화면이 바뀌는 것(HMR)을 봤어요
- [ ] `localhost`, 포트, 빌드가 각각 무엇인지 한 문장씩 말할 수 있어요
- [ ] 템플릿 파일 세 가지(`counter.ts`, `assets`, `icons.svg`)를 지웠어요
- [ ] `npm run build`가 `✓ built in …`으로 끝나고 `dist` 폴더가 생겼어요
- [ ] `git status`에 `node_modules`와 `dist`가 안 보여요
- [ ] 과제 1~3을 풀고 정답과 비교했어요
- [ ] `git add -A`, `git commit -m "day07: Vite 프로젝트"`, `git push`를 했고, 과제 뒤에도 커밋·푸시해서 `git status`가 깨끗해요

## 📚 더 알아보기

- [Vite — 시작하기](https://vite.dev/guide/): Vite가 무엇이고 프로젝트를 어떻게 만드는지 공식 가이드로 보여 줘요.
- [MDN — innerHTML](https://developer.mozilla.org/ko/docs/Web/API/Element/innerHTML): `innerHTML`의 동작과 보안상 주의점을 설명해요.
- [TypeScript Handbook — Type Assertions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions): `as`와 `!` 같은 타입 단언을 공식 문서로 정리해요.

➡️ **다음 Day 예고:** [Day 8 · 비동기 깊게](#/day/p2-d08)에서는 "나중에 도착하는 값"인 Promise를 제대로 배우고, 데이터를 `fetch`로 불러와 스트리머 카드와 방송 목록을 화면에 그려요. 불러오는 중과 오류 문장도 만들어요.
