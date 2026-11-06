## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- Node.js가 무엇이고 npm이 무엇인지 내 말로 설명할 수 있어요.
- Node.js LTS를 설치하고 새 터미널에서 `node --version`과 `npm --version`의 결과를 볼 수 있어요.
- PowerShell이 `npm`을 막는 오류(실행 정책)를 안전한 방법으로 해결할 수 있어요.
- 연습 폴더 `C:\dev\ts-practice`에서 `npm init`, `npm i`, `npm ci`, `npx`를 써 보고 `package.json`을 읽을 수 있어요.

**예상 시간: 100분** (개념 이해 15분 · 따라하기 67분 · 과제 13분 · 정리 5분)

:::path 📂 시작 상태
[Day 2](#/day/p2-d02)의 "오늘 끝 상태 전체 코드"가 있어야 해요. 없거나 다르면 그 코드로 먼저 맞춰 주세요.

- `C:\dev\streamer-hub\README.md`
- `C:\dev\streamer-hub\.git\` (숨김 폴더. 직접 건드리지 않아요)
- VS Code, 한국어 팩, Live Preview ([P1 Day 2](#/day/p1-d02)), Chrome 또는 Edge ([P1 Day 2](#/day/p1-d02))
- Git (`git --version`)과 GitHub 계정 ([P1 Day 7](#/day/p1-d07))
- Node.js는 아직 설치하지 않았어도 돼요. 오늘 설치해요. 인터넷에 연결되어 있어야 해요(설치 파일과 패키지를 내려받아요).
:::

## 📖 개념 이해

### Node.js: 브라우저 밖에서 JavaScript를 실행하는 프로그램

**비유부터 볼게요.** 자동차 엔진을 생각해 보세요. P1에서는 JavaScript라는 엔진이 브라우저라는 자동차 안에만 들어 있었어요. **Node.js**는 그 엔진을 꺼내서 작업대 위에 따로 올려 둔 거예요. 브라우저 없이도 엔진을 돌려 볼 수 있어요.

**정확한 정의는 이래요.** **[[Node.js]]**(노드제이에스)는 브라우저 밖에서 JavaScript를 실행하게 해 주는 프로그램이에요. 이 책에서는 Node.js 위에서 TypeScript 컴파일러, Vite 같은 개발 도구가 돌아가요. 우리가 만드는 서버는 C#이라서 Node.js가 서버를 돌리지는 않아요. Node.js는 화면을 만드는 **도구 상자**예요.

### npm: 다른 사람이 만든 코드를 가져다 쓰는 곳

**비유:** 부품 가게예요. 모든 부품을 직접 깎아 만들지 않고, 가게에서 필요한 부품을 주문해서 가져다 써요. 주문서에는 어떤 부품을 몇 번 버전으로 샀는지 적혀 있어요.

**정확한 정의:**

- **[[npm]]**(엔피엠)은 Node.js와 함께 설치되는 패키지 관리자예요. 다른 사람이 만든 코드 묶음(패키지)을 내려받고, 버전을 기록하고, 정해 둔 명령(`npm run dev` 등)을 실행해 줘요. 이름은 Node Package Manager에서 왔어요.
- **[[패키지]]**(package)는 다른 프로젝트에서 가져다 쓸 수 있게 묶어서 공개한 코드 묶음이에요. 예: `typescript`, `vite`.
- **[[의존성]]**(dependency)은 내 프로젝트가 동작하려면 꼭 있어야 하는 다른 패키지예요. 개발할 때만 필요한 것은 `devDependencies`에 따로 적어요.

프로젝트 폴더에는 npm이 만드는 파일과 폴더가 생겨요. 이 표를 먼저 눈에 익혀 두세요.

| 이름 | 하는 일 |
|---|---|
| `package.json` | 프로젝트 이름, 실행 명령, 의존성 목록 |
| `node_modules` | 내려받은 패키지가 실제로 들어 있는 폴더 |
| `package-lock.json` | 실제로 설치된 정확한 버전 기록 |

- **[[package.json]]**(패키지 제이슨)은 Node.js 프로젝트의 이름, 실행 명령(`scripts`), 의존성 목록을 적어 두는 JSON 파일이에요. [P1 Day 25](#/day/p1-d25)에서 배운 [[JSON]] 모양이에요. 프로젝트 폴더 맨 위에 있어요.
- **[[node_modules]]**(노드 모듈스)는 npm이 내려받은 패키지가 실제로 들어 있는 폴더예요. 파일이 아주 많고 언제든 다시 만들 수 있어서 직접 고치지 않고 Git에도 올리지 않아요.
- **[[package-lock.json]]**(패키지 락)은 npm이 실제로 설치한 모든 패키지의 정확한 버전을 기록한 파일이에요. 이 파일이 있으면 다른 컴퓨터에서도 똑같은 버전을 설치할 수 있어요. 직접 고치지 않고 Git에는 함께 올려요.
- **[[npx]]**(엔피엑스)는 패키지에 들어 있는 명령을 바로 실행해 주는 도구예요. 프로젝트에 설치된 패키지면 그것을, 없으면 잠깐 내려받아 실행해요. 예: `npx tsc --version`.

### LTS: 처음 배우는 사람은 안정 버전으로

**[[LTS]]**(엘티에스)는 Long Term Support의 줄임말로, 오랫동안 보안과 버그 수정을 해 주기로 약속한 안정 버전이에요. Node.js 홈페이지에는 LTS와 Current(최신) 두 버튼이 있어요. 이 교재는 **LTS**를 써요. 작성 기준일 2026-11의 LTS는 v26.13.0이에요. 홈페이지에 보이는 숫자가 이보다 크면 그 뒤에 나온 LTS이니 괜찮아요. 이 교재의 명령은 Node.js LTS 22.22.2 이상, 24.15 이상, 26 이상에서 동작해요.

### 환경 변수와 PATH: 왜 설치 후에 새 터미널을 열어야 해요?

**비유:** 전화번호부예요. 터미널에 `node`라고 치면 터미널은 "node라는 프로그램이 어디 있지?" 하고 전화번호부를 뒤져요. 설치 프로그램은 전화번호부에 Node.js의 위치를 적어 줘요. 그런데 **이미 열려 있던 터미널은 옛날 전화번호부 복사본**을 들고 있어서, 새 번호를 몰라요.

**정확한 정의:**

- **[[환경 변수]]**(environment variable)는 운영 체제가 프로그램에게 알려 주는 `이름=값` 설정이에요. 프로그램 코드를 고치지 않고도 동작을 바꿀 수 있어요.
- **[[PATH]]**(패스)는 환경 변수 중 하나로, 터미널이 프로그램을 찾아볼 폴더들의 목록이에요. 설치 프로그램이 PATH에 Node.js 폴더를 더해 줘요. 이미 열린 터미널은 이 변경을 모르기 때문에 **터미널(과 VS Code)을 모두 닫고 새로 열어야** 해요.

### 실행 정책: PowerShell이 스크립트를 막는 안전장치

Windows 11의 PowerShell 5.1은 기본 설정에서 `.ps1` 스크립트 파일 실행을 막아요. 그런데 Node.js를 설치하면 `npm`을 `npm.ps1`이라는 PowerShell 스크립트로도 함께 설치해요. 그래서 `npm`을 치면 이 스크립트가 막혀 빨간 오류가 날 수 있어요. 이 안전장치의 이름이 **[[실행 정책]]**(execution policy)이에요. 실행 정책은 PowerShell이 스크립트 파일을 실행해도 되는지 정하는 규칙이에요.

해결은 내 계정에서만 `RemoteSigned`로 바꾸는 한 줄이에요. 관리자 권한이 필요 없어요. 오늘 3단계에서 해요.

:::warn 실행 정책은 `Unrestricted`나 `Bypass`로 바꾸지 마세요
인터넷에는 `Set-ExecutionPolicy Unrestricted`나 `Bypass`로 바꾸라는 글도 있어요. 모든 스크립트를 검사 없이 실행하게 만드는 설정이라서 위험해요. 이 교재는 `RemoteSigned`를 내 계정(`CurrentUser`)에만 적용해요. 내가 만든 스크립트는 실행되고, 인터넷에서 받은 스크립트는 믿을 만한 서명이 있어야 실행돼요.
:::

:::info 실무에서는
회사에서는 팀원 모두가 같은 버전의 도구를 쓰도록 `package-lock.json`을 Git에 함께 올려요. 새로 온 사람은 저장소를 내려받고 `npm ci` 한 줄이면 똑같은 환경이 돼요. 오늘 그 흐름을 연습 폴더에서 직접 해 봐요.
:::

## 🛠️ 따라하기

모두 8단계예요. 1~3단계는 설치와 오류 해결, 4~7단계는 연습 폴더 작업, 8단계는 README 기록이에요.

### 1단계 · Node.js LTS 설치하기 (12분)

설치 방법은 두 가지예요. **A. 설치 프로그램**을 내려받아 마법사로 설치하거나, **B. winget** 명령 한 줄로 설치해요. 편한 쪽 하나만 하세요. 모르겠으면 A를 권해요.

**A. 설치 프로그램 (nodejs.org)**

**어디서:** 브라우저 → `https://nodejs.org/`

**무엇을:**

1. 페이지 가운데의 **LTS** 버전 내려받기 버튼을 클릭해요. 버튼에 `v26.13.0`처럼 버전이 적혀 있어요. 운영 체제가 Windows이고 x64로 보이는지 확인하고, 다르게 보이면 **Windows Installer**(.msi)를 골라요. 파일 이름은 `node-v26.13.0-x64.msi` 모양이에요.
2. 내려받은 파일을 더블클릭해서 실행해요. 브라우저의 다운로드 목록(`Ctrl + J`)에서 눌러도 돼요.
3. "이 앱이 디바이스를 변경하도록 허용하시겠어요?" 창(사용자 계정 컨트롤)이 나오면 게시자가 **OpenJS Foundation**인지 읽고 **예**를 클릭해요. 문구는 버전에 따라 조금 달라요.
4. 설치 마법사에서 **Next**를 클릭하고, 사용권 계약 화면에서 **I accept the terms in the License Agreement**에 체크한 뒤 **Next**를 클릭해요. 마법사 화면은 영어로 나올 수 있어요.
5. 설치 위치(**Destination Folder**) 화면은 그대로 **Next**를 클릭해요.
6. **Custom Setup** 화면도 기본값 그대로 **Next**를 클릭해요. `Add to PATH`가 선택되어 있어야 해요.
7. **Tools for Native Modules** 화면에서 **"Automatically install the necessary tools" 체크 상자를 해제한 채로** 두고 **Next**를 클릭해요. 이것을 체크하면 Python, Visual Studio Build Tools, Chocolatey까지 설치해서 오래 걸려요. 우리는 필요 없어요.
8. **Install**을 클릭하고 끝날 때까지 기다린 뒤 **Finish**를 클릭해요.

**B. winget으로 설치**

**어디서:** 터미널(PowerShell)

**무엇을:**

```powershell
winget install OpenJS.NodeJS.LTS
```

처음 쓰면 약관에 동의하느냐고 물을 수 있어요. `Y`를 입력하고 `Enter`를 눌러요. 설치 중 사용자 계정 컨트롤 창이 나오면 **예**를 클릭해요. `winget` 명령이 없다는 오류가 나면 A 방법으로 해요.

:::success
마법사의 마지막 화면에 **Completed the Node.js Setup Wizard**(문구는 달라도 돼요)가 보이거나, winget이 `Successfully installed`(성공적으로 설치되었습니다)로 끝나요. 아직 `node` 명령은 시험하지 않아요. 다음 단계에서 새 터미널에서 해요.
:::

### 2단계 · 새 터미널에서 버전 확인하기 (8분)

설치 전부터 열려 있던 터미널은 `node`를 몰라요. 모두 닫고 새로 열어요.

**어디서:** Windows 11

**무엇을:**

1. 열려 있는 터미널 창과 VS Code를 모두 닫아요. 닫기가 번거로우면 창 오른쪽 위 ✕를 클릭해요.
2. 시작 버튼을 오른쪽 클릭하고 **터미널**을 클릭해 새 터미널을 열어요([Day 2](#/day/p2-d02) 1단계).
3. 아래 명령을 한 줄씩 입력해요.

```powershell
node --version
```

예상 출력(숫자는 달라도 돼요. 작성 기준일 2026-11의 LTS는 v26.13.0이에요):

```text
v26.13.0
```

```powershell
npm --version
```

예상 출력(숫자는 달라도 돼요. 작성 기준 11.20.0이에요):

```text
11.20.0
```

:::success
`node --version`이 `v22.22.2` 이상, `v24.15` 이상, `v26` 이상 중 하나로 시작하는 버전을 보여 줘요. `npm --version`은 숫자 세 개를 보여 줘요.
- `npm --version` 대신 빨간 글자로 `npm.ps1 cannot be loaded because running scripts is disabled on this system`이 나오면 3단계로 가요.
- `node`가 인식되지 않는다는 오류가 나오면 아래 🧯 자주 막히는 곳의 두 번째 항목을 보세요.
:::

### 3단계 · 실행 정책 오류 해결하기 (7분)

PowerShell 5.1에서 `npm`이 막히는 오류를 풀어요. 2단계에서 `npm --version`이 숫자를 보여 줬다면 이 단계는 읽기만 하고 4단계로 가도 돼요. 오류가 나온 사람은 먼저 원문부터 읽어요.

**어디서:** 터미널(PowerShell), 위치는 어디든 괜찮아요

**무엇을:** 오류는 이런 모양으로 나타나요.

```text
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system. For more information, see about_Execution_Policies at https://go.microsoft.com/fwlink/?LinkID=135170.
At line:1 char:1
+ npm --version
+ ~~~
    + CategoryInfo          : SecurityError: (:) [], PSSecurityException
    + FullyQualifiedErrorId : UnauthorizedAccess
```

한국어 Windows에서는 첫 줄이 "이 시스템에서 스크립트를 실행할 수 없으므로 C:\Program Files\nodejs\npm.ps1 파일을 로드할 수 없습니다."처럼 번역되어 보일 수 있어요(문구는 버전에 따라 조금 달라요).

풀이: "이 컴퓨터의 PowerShell에서는 스크립트 실행이 막혀 있어서 `npm.ps1`을 읽을 수 없다"는 뜻이에요. 마지막 줄의 `UnauthorizedAccess`가 실행 정책 오류의 표시예요.

1. 지금 내 설정을 먼저 봐요.

```powershell
Get-ExecutionPolicy -Scope CurrentUser
```

예상 출력(오류가 났다면 보통 이 값이에요):

```text
Undefined
```

2. 내 계정에서만 `RemoteSigned`로 바꿔요. 관리자 권한이 필요 없어요.

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

바꿀지 묻는 안내가 나와요(문구는 버전에 따라 조금 달라요).

```text
Execution Policy Change
The execution policy helps protect you from scripts that you do not trust. Changing the execution policy might expose
you to the security risks described in the about_Execution_Policies help topic at
https://go.microsoft.com/fwlink/?LinkID=135170. Do you want to change the execution policy?
[Y] Yes  [A] Yes to All  [N] No  [L] No to All  [S] Suspend  [?] Help (default is "N"):
```

3. `Y`를 입력하고 `Enter`를 눌러요.
4. 확인해요.

```powershell
Get-ExecutionPolicy -Scope CurrentUser
```

예상 출력:

```text
RemoteSigned
```

5. `npm`을 다시 실행해요.

```powershell
npm --version
```

:::success
`Get-ExecutionPolicy -Scope CurrentUser`가 `RemoteSigned`이고, `npm --version`이 숫자를 보여 줘요. 빨간 오류는 더 이상 나오지 않아요.
:::

:::tip 정책을 바꾸고 싶지 않다면
`npm` 대신 `npm.cmd`를 입력하는 방법도 있어요. `.cmd` 파일은 PowerShell 스크립트가 아니라서 실행 정책의 대상이 아닐 거라고 **추정**돼요(공식 문서로 확인하지 못한 보조 방법이에요). 다만 `npx`도 `npx.cmd`로 매번 써야 해서 불편하니, 이 교재는 위의 `RemoteSigned` 한 줄을 권해요.
:::

### 4단계 · 연습 폴더 만들고 `npm init` 하기 (8분)

여기서부터는 연습 폴더 `C:\dev\ts-practice`에서 작업해요. 이 폴더는 Git에 올리지 않아요. Day 7에서 진짜 프로젝트를 만들 때까지 TypeScript를 연습하는 곳이에요.

**어디서:** 터미널(PowerShell)

**무엇을:** 한 줄씩 입력해요.

```powershell
mkdir C:\dev\ts-practice
```

```powershell
cd C:\dev\ts-practice
```

프롬프트가 `PS C:\dev\ts-practice>`가 되었는지 읽고, 다음 명령을 입력해요.

```powershell
npm init -y
```

`-y`는 질문마다 "예"로 답한다는 뜻이에요. 예상 출력(첫 줄만 같으면 돼요. 아래 내용은 npm 버전에 따라 조금 달라요):

```text
Wrote to C:\dev\ts-practice\package.json:

{
  "name": "ts-practice",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

이어서 이 프로젝트가 현대적인 모듈 방식(`import`/`export`)을 쓴다고 `package.json`에 적어요. 내용은 Day 6에서 자세히 배워요.

```powershell
npm pkg set type=module
```

아무것도 나오지 않고 프롬프트가 돌아오면 성공이에요. 이제 VS Code로 이 폴더를 열어요.

```powershell
code .
```

VS Code 새 창이 열리고 작성자를 신뢰하느냐고 물으면 내가 만든 폴더이니 신뢰한다고 클릭해요. 왼쪽 탐색기에서 `package.json`을 클릭해서 열어요.

:::success
- `Wrote to C:\dev\ts-practice\package.json:`이 보였어요.
- VS Code의 새 창 탐색기 맨 위에 `TS-PRACTICE`가 있고 `package.json` 한 파일이 있어요.
- `package.json`에 `"type": "module"`이 들어 있어요.
:::

### 5단계 · `hello.js`를 Node로 실행하기 (7분)

Node.js는 브라우저 없이 JavaScript 파일을 실행해요. 파일 하나를 만들어서 확인해 봐요.

**어디서:** VS Code 새 창(`TS-PRACTICE`) → 왼쪽 탐색기

**무엇을:**

1. 탐색기의 `TS-PRACTICE` 줄에 마우스를 올리고 **새 파일**(종이에 + 모양) 아이콘을 클릭해요.
2. 이름 칸에 `hello.js`를 입력하고 `Enter`를 눌러요.
3. 편집 창에 아래 한 줄을 입력하고 `Ctrl + S`로 저장해요. 줄 안의 `` ` ``(백틱)은 숫자 `1`의 왼쪽 키예요(키보드 배열에 따라 달라요). **영어 입력 상태**에서 눌러요. 한글 상태에서는 `₩`가 입력될 수 있어요.

📄 C:\dev\ts-practice\hello.js
```js
console.log(`Node ${process.version}`);
```

4. `` Ctrl + ` ``를 눌러 VS Code 터미널을 열어요. 프롬프트가 `PS C:\dev\ts-practice>`인지 확인해요.
5. 실행해요.

```powershell
node hello.js
```

예상 출력(버전 숫자는 달라도 돼요):

```text
Node v26.13.0
```

:::success
`Node v26.13.0` 같은 한 줄이 나와요. 브라우저를 열지 않았는데 JavaScript가 실행됐어요. `process.version`은 Node.js만 가진 값이에요(브라우저에는 없어요).
:::

### 6단계 · TypeScript 설치하고 `package.json` 읽기 (10분)

이제 npm으로 첫 패키지 `typescript`를 설치해요. 앞으로 5일 동안 쓰는 도구예요.

**어디서:** VS Code 터미널, 위치 `C:\dev\ts-practice`

**무엇을:**

```powershell
npm i -D typescript@7.0.2
```

`i`는 `install`의 줄임말이에요. `-D`는 "개발할 때만 필요한 패키지(`devDependencies`)로"라는 뜻이고, `@7.0.2`는 이 교재의 오류 메시지와 같게 **버전을 고정**한다는 뜻이에요. 내려받기 때문에 몇 초 걸려요. 예상 출력(숫자는 달라도 돼요):

```text
added 2 packages, and audited 3 packages in 3s

found 0 vulnerabilities
```

설치된 TypeScript가 몇 번인지 확인해요. `npx`는 방금 설치한 패키지의 명령을 실행해요.

```powershell
npx tsc --version
```

예상 출력:

```text
Version 7.0.2
```

이제 폴더에 무엇이 생겼는지 VS Code 탐색기에서 봐요. `package.json`을 열어요.

📄 C:\dev\ts-practice\package.json (일부)
```json
  "type": "module",
  "devDependencies": {
    "typescript": "^7.0.2"
  }
```

`^7.0.2`는 "7.0.2 이상, 8 미만"이라는 뜻의 버전 범위예요. 정확한 버전은 `package-lock.json`이 기록해 둬요.

:::success
- 탐색기에 `node_modules` 폴더와 `package-lock.json` 파일이 새로 생겼어요.
- `node_modules` 폴더를 펼치면 `typescript` 폴더가 보여요. 파일은 열지 않아도 돼요.
- `package.json`에 `devDependencies`와 `typescript`가 있어요.
- `npx tsc --version`이 `Version 7.0.2`예요.
:::

### 7단계 · `node_modules`를 지우고 `npm ci`로 되살리기 (8분)

`node_modules`는 언제든 다시 만들 수 있다고 했죠? 직접 확인해 봐요. 지우고, 되살려요.

**어디서:** VS Code 터미널, 위치 `C:\dev\ts-practice`

**무엇을:**

:::warn 지울 폴더의 경로를 꼭 확인하세요
`Remove-Item`은 휴지통에 보내지 않고 바로 지워요. 아래 명령은 `C:\dev\ts-practice\node_modules`만 지워요. 경로를 다른 폴더로 바꾸지 마세요.
:::

```powershell
Remove-Item -Recurse -Force C:\dev\ts-practice\node_modules
```

아무것도 나오지 않고 프롬프트가 돌아오면 성공이에요. VS Code 탐색기에서 `node_modules`가 사라졌는지 확인해요. 이제 되살려요.

```powershell
npm ci
```

예상 출력(숫자는 달라도 돼요):

```text
added 2 packages, and audited 3 packages in 2s

found 0 vulnerabilities
```

```powershell
npx tsc --version
```

예상 출력:

```text
Version 7.0.2
```

둘의 차이를 정리해요.

| 명령 | 하는 일 |
|---|---|
| `npm install` | `package.json`을 읽고 필요하면 버전을 새로 정해서 설치해요. `package-lock.json`이 바뀔 수 있어요 |
| `npm ci` | `package-lock.json`에 적힌 **그대로** 설치해요. 잠금 파일이 없으면 실패해요 |

:::success
`node_modules`가 다시 생겼고 `Version 7.0.2`가 나와요. `package-lock.json` 덕분에 같은 버전이 정확히 되살아났어요. 다른 컴퓨터에서도 저장소를 받아 `npm ci`만 하면 같은 환경이 돼요.
:::

### 8단계 · README에 버전 기록하고 커밋·푸시하기 (7분)

내 컴퓨터에 설치된 버전을 README에 적어 두면 나중에 문제가 생겼을 때 비교할 수 있어요.

**어디서:** 터미널에서 프로젝트 폴더를 연 뒤 VS Code → `README.md`

**무엇을:**

1. 터미널에서 프로젝트 폴더를 VS Code로 열어요. 이미 열려 있는 창이 있으면 그 창으로 이동해요.

```powershell
code C:\dev\streamer-hub
```

2. 새로 뜬(또는 앞으로 나온) VS Code 창의 왼쪽 탐색기에서 `README.md`를 열어요.
3. 맨 아래 `## 개발 환경` 목록의 마지막 줄 바로 아래에 두 줄을 더해요. 버전 숫자는 2단계에서 본 내 값으로 바꿔요.

📄 C:\dev\streamer-hub\README.md (일부)
```md
- Node.js: v26.13.0
- npm: 11.20.0
```

4. `Ctrl + S`로 저장해요.
5. 이 VS Code 창의 터미널(`` Ctrl + ` ``)에서 프롬프트가 `PS C:\dev\streamer-hub>`인지 읽고 기록을 남겨요. 아래 명령을 한 줄씩 입력해요.

```powershell
git add README.md
```

```powershell
git commit -m "day03: Node 버전 기록"
```

예상 출력(앞 7글자와 줄 수는 달라도 돼요):

```text
[main 2b3c4d5] day03: Node 버전 기록
 1 file changed, 2 insertions(+)
```

```powershell
git push
```

예상 출력(숫자는 달라도 돼요):

```text
Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Delta compression using up to 8 threads
Compressing objects: 100% (3/3), done.
Writing objects: 100% (3/3), 400 bytes | 400.00 KiB/s, done.
Total 3 (delta 1), reused 0 (delta 0), pack-reused 0 (from 0)
To https://github.com/내아이디/streamer-hub.git
   9d8c7b6..2b3c4d5  main -> main
```

:::success
`git push`의 마지막 줄에 `main -> main`이 보여요. GitHub 저장소 페이지의 README 아래쪽에 Node.js와 npm 줄이 나타나고, 커밋 수가 3개가 돼요(Day 2의 두 커밋과 오늘 커밋). `ts-practice` 폴더는 이 저장소 안에 없으니 올라가지 않아요.
:::

## ✍️ 과제

### 과제 1 · `npm run`으로 스크립트 실행하기 (쉬움 ⭐, 5분)

- `C:\dev\ts-practice\package.json`의 `"scripts"` 안에 `"hello": "node hello.js"` 줄을 더하고, `npm run hello`로 실행해요.
- 확인: 출력에 `> ts-practice@1.0.0 hello`와 `> node hello.js` 두 줄이 먼저 나온 뒤 `Node v26.13.0` 같은 줄이 나와요.
- 힌트: `"scripts"` 안에는 이미 `"test"` 줄이 있어요. 줄 사이에는 쉼표(`,`)가 필요해요. JSON은 마지막 줄 뒤에만 쉼표가 없어요([P1 Day 25](#/day/p1-d25)).

### 과제 2 · `node_modules`를 지우고 `npm ci`로 되살리기 (보통 ⭐⭐, 5분)

- 7단계를 이번에는 책을 보지 않고 직접 해 봐요: 지우기 → `npm ci` → `npx tsc --version`.
- 확인: 마지막에 `Version 7.0.2`가 나와요. 그리고 왜 같은 버전이 되살아났는지 한 문장으로 말해 봐요.
- 힌트: 어떤 파일이 정확한 버전을 기억하고 있을까요?

### 과제 3 · 커밋 기록 확인하기 (쉬움 ⭐, 3분)

- 프로젝트 터미널(위치 `C:\dev\streamer-hub`)에서 `git log --oneline`을 입력해 커밋 3줄을 확인해요.
- 확인: 맨 위가 `day03: Node 버전 기록`이에요.
- 힌트: 8단계에서 이미 커밋·푸시를 했다면 이 과제는 확인만 하면 돼요. 아직 안 했다면 8단계를 해요.

## ✅ 정답

:::answer 과제 1 정답 · scripts에 hello 더하기
📄 C:\dev\ts-practice\package.json
```json
{
  "name": "ts-practice",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "hello": "node hello.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "devDependencies": {
    "typescript": "^7.0.2"
  }
}
```

```powershell
npm run hello
```

예상 출력(Node 버전 숫자는 달라도 돼요):

```text
> ts-practice@1.0.0 hello
> node hello.js

Node v26.13.0
```

**왜 이렇게 하나요?** `scripts`는 긴 명령에 짧은 이름을 붙여 두는 곳이에요. `npm run 이름`을 치면 npm이 그 명령을 대신 실행해요. 앞으로 `npm run dev`(Vite 개발 서버), `npm run build` 같은 이름을 쓸 거예요. `package.json`의 다른 칸은 npm 버전에 따라 조금 달라도 돼요.
:::

:::answer 과제 2 정답 · node_modules 되살리기
```powershell
Remove-Item -Recurse -Force C:\dev\ts-practice\node_modules
npm ci
npx tsc --version
```

**왜 이렇게 하나요?** `package-lock.json`에 "typescript는 7.0.2, 받아 오는 곳은 여기, 파일 검증값은 이것"이 모두 적혀 있어요. `npm ci`는 이 기록을 그대로 따라 설치하기 때문에 언제 어디서 해도 같은 결과가 나와요. 그래서 `package-lock.json`은 지우지 않고 Git에 함께 올려요.
:::

:::answer 과제 3 정답 · 커밋 기록
```powershell
git log --oneline
```

예상 출력(앞 7글자는 사람마다 달라요):

```text
2b3c4d5 (HEAD -> main, origin/main) day03: Node 버전 기록
9d8c7b6 day02: 개발 환경 기록
1a2b3c4 day02: 프로젝트 시작
```

**왜 이렇게 하나요?** 맨 위가 가장 새 커밋이에요. 괄호 안의 `HEAD -> main`은 내 컴퓨터의 `main`이 여기까지 왔다는 뜻이고, `origin/main`은 GitHub의 `main`도 같은 곳이라는 뜻이에요. 푸시까지 끝났다는 증거예요.
:::

:::answer 오늘 끝 상태 전체 코드
오늘 따라하기와 과제를 모두 끝낸 상태예요. 막혔다면 이 폴더와 파일을 그대로 만들고 Day 4를 시작하세요. `node_modules`, `package-lock.json`, `.git`은 도구가 만든 것이라 직접 만들지 않아요(`npm i -D typescript@7.0.2`가 앞의 둘을 만들어요).

```text
C:\dev\
├─ streamer-hub\
│  ├─ .git\
│  └─ README.md
└─ ts-practice\
   ├─ node_modules\
   ├─ hello.js
   ├─ package-lock.json
   └─ package.json
```

📄 C:\dev\ts-practice\hello.js
```js
console.log(`Node ${process.version}`);
```

📄 C:\dev\ts-practice\package.json
```json
{
  "name": "ts-practice",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "hello": "node hello.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "devDependencies": {
    "typescript": "^7.0.2"
  }
}
```

📄 C:\dev\streamer-hub\README.md (일부)
```md
## 개발 환경

- 운영 체제: Windows 11 (버전 24H2)
- PowerShell: 5.1
- Git: git version 2.56.0.windows.4
- Node.js: v26.13.0
- npm: 11.20.0
```

README의 나머지 부분은 [Day 2](#/day/p2-d02)의 "오늘 끝 상태 전체 코드"와 같아요. 위의 개발 환경 절은 `README.md` 맨 아래에 있고, 버전 숫자는 내 컴퓨터의 값이어도 괜찮아요.
:::

## 🧯 자주 막히는 곳

여기에 없는 증상은 [문제 해결 모음](#/page/troubleshooting)에서 찾아보세요.

### `npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system.`

```text
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system. For more information, see about_Execution_Policies at https://go.microsoft.com/fwlink/?LinkID=135170.
    + FullyQualifiedErrorId : UnauthorizedAccess
```

**원인:** Windows PowerShell 5.1의 기본 실행 정책이 스크립트 파일(`npm.ps1`) 실행을 막고 있어요. 한국어 Windows에서는 "이 시스템에서 스크립트를 실행할 수 없으므로 … 파일을 로드할 수 없습니다"로 보여요.

**해결:**

1. 터미널에서 `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`를 입력하고 `Enter`를 눌러요.
2. 바꿀지 묻는 질문에 `Y`를 입력하고 `Enter`를 눌러요. 관리자 권한은 필요 없어요.
3. `Get-ExecutionPolicy -Scope CurrentUser`가 `RemoteSigned`를 보여 주고 `npm --version`이 숫자를 보여 주면 해결이에요.
4. `Unrestricted`나 `Bypass`로 바꾸지 않아요.

### `node : The term 'node' is not recognized as the name of a cmdlet, function, script file, or operable program.`

```text
node : The term 'node' is not recognized as the name of a cmdlet, function, script file, or operable program. Check the spelling of the name, or if a path was included, verify that the path is correct and try again.
```

**원인:** 설치 전에 열려 있던 터미널이 옛 PATH를 들고 있어요. 또는 설치가 끝까지 되지 않았어요. 한국어 Windows에서는 "'node' 용어가 cmdlet, 함수, 스크립트 파일 또는 실행할 수 있는 프로그램 이름으로 인식되지 않습니다."로 보여요.

**해결:**

1. 열려 있는 터미널과 VS Code를 모두 닫아요.
2. 시작 버튼을 오른쪽 클릭해서 터미널을 새로 열고 `node --version`을 다시 입력해요.
3. 그래도 같은 오류면 `C:\Program Files\nodejs` 폴더가 있는지 파일 탐색기에서 확인해요. 없으면 1단계 설치를 처음부터 다시 해요.
4. `v26.13.0` 같은 버전이 나오면 해결이에요.

### 설치할 때 Chocolatey 같은 검은 창이 떴어요

**원인:** 설치 마법사의 **Tools for Native Modules** 화면에서 자동 설치 체크 상자를 켜 두었어요. 그러면 Python, Visual Studio Build Tools, Chocolatey를 함께 설치하려고 해요.

**해결:** 창이 열려 있으면 그냥 닫아도 Node.js 자체는 이미 설치돼 있어요. 새 터미널에서 `node --version`이 나오면 그대로 써도 돼요. 오늘 과정에서는 이 도구들이 필요 없어요.

### `npm error code ENOENT` … `Could not read package.json`

```text
npm error code ENOENT
npm error syscall open
npm error path C:\Users\내이름\package.json
npm error errno -4058
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory, open 'C:\Users\내이름\package.json'
```

**원인:** 현재 위치에 `package.json`이 없어요. 터미널이 `C:\dev\ts-practice`가 아닌 다른 폴더(예: `C:\Users\내이름`)에 있어요. 경로와 줄 번호는 사람마다 달라요.

**해결:**

1. 프롬프트의 경로를 읽어요.
2. `cd C:\dev\ts-practice`를 입력해서 연습 폴더로 가요.
3. 같은 명령을 다시 실행해서 오류가 사라지면 해결이에요.
4. 엉뚱한 폴더에서 `npm i`를 이미 실행했다면 그 폴더에 `package.json`, `node_modules`가 생겼을 수 있어요. `C:\Users\내이름`이 아닌 곳이라면 새로 생긴 `node_modules`, `package.json`, `package-lock.json`만 지워요.

### `winget`이 인식되지 않거나 설치가 실패해요

**원인:** winget(앱 설치 관리자)은 Windows 11에 보통 들어 있지만, 오래된 설치나 회사·학교 PC에서는 없거나 막혀 있을 수 있어요.

**해결:** 1단계의 A 방법으로 `https://nodejs.org/`에서 설치 프로그램을 내려받아 설치해요.

### `npm i`가 오래 걸려요

**원인:** 인터넷이 느리거나, 백신 프로그램이 내려받는 파일을 하나씩 검사해서 느려질 수 있어요.

**해결:** 기다려요. 백신 프로그램을 끄지 않아요. 1분이 넘도록 아무 글자도 안 바뀌면 `Ctrl + C`로 멈추고 다시 실행해요.

## 📝 오늘의 체크리스트

- [ ] 새 터미널에서 `node --version`이 `v22.22.2` 이상, `v24.15` 이상, `v26` 이상 중 하나로 나와요
- [ ] `npm --version`이 숫자를 보여 줘요(빨간 실행 정책 오류 없음)
- [ ] `Get-ExecutionPolicy -Scope CurrentUser`가 `RemoteSigned`예요(오류가 났던 경우)
- [ ] `node hello.js`가 `Node v…` 한 줄을 출력해요
- [ ] `npx tsc --version`이 `Version 7.0.2`를 출력해요
- [ ] `node_modules`를 지우고 `npm ci`로 되살렸어요
- [ ] 과제 1~3을 풀고 정답과 비교했어요
- [ ] `README.md`를 고치고 `git add README.md`, `git commit -m "day03: Node 버전 기록"`, `git push`를 했어요

## 📚 더 알아보기

- [Node.js 공식 사이트 — 다운로드](https://nodejs.org/ko/download): LTS와 Current 버전 선택, Windows 설치 파일을 받는 곳이에요.
- [npm 문서 — package.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-json): `package.json`의 각 칸이 무슨 뜻인지 자세히 설명해요.
- [PowerShell 실행 정책 설명](https://learn.microsoft.com/ko-kr/powershell/module/microsoft.powershell.core/about/about_execution_policies): 실행 정책의 종류와 `Set-ExecutionPolicy`의 범위(`CurrentUser` 등)를 공식 문서로 확인해요.

➡️ **다음 Day 예고:** [Day 4 · TypeScript 시작](#/day/p2-d04)에서는 JavaScript에서 실행해 봐야 알던 실수를 TypeScript가 실행 전에 알려 주는 것을 직접 보고, `tsc`로 TypeScript를 JavaScript로 바꿔 실행해요.
