## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- C#과 .NET이 무엇인지, 그리고 TypeScript와 어디가 같고 다른지 표로 말할 수 있어요.
- .NET 10 SDK를 설치하고 새 터미널에서 `dotnet --version`이 `10.0.`으로 시작하는 것을 확인할 수 있어요.
- VS Code에 C# 확장을 설치하고, `dotnet new console`로 첫 프로그램을 만들어 `dotnet run`으로 실행할 수 있어요.
- `error CS1002: ; expected` 같은 C# 오류 메시지를 읽고(TypeScript의 오류와 같은 구조예요), `dotnet build`가 만든 결과 파일을 찾을 수 있어요.

**예상 시간: 110분** (개념 이해 15분 · 따라하기 64분 · 과제 25분 · 정리 6분)

:::path 📂 시작 상태
[Day 8](#/day/p2-d08)의 "오늘 끝 상태 전체 코드"가 있어야 해요. 없거나 다르면 그 코드로 먼저 맞춰 주세요.

- `C:\dev\streamer-hub\README.md`, `C:\dev\streamer-hub\.git\`
- `C:\dev\streamer-hub\client\`의 `.gitignore`, `index.html`, `package.json`, `package-lock.json`, `tsconfig.json`, `node_modules\`, `dist\`
- `C:\dev\streamer-hub\client\public\favicon.svg`, `C:\dev\streamer-hub\client\public\data\streamers.json`, `C:\dev\streamer-hub\client\public\data\schedules.json`
- `C:\dev\streamer-hub\client\src\main.ts`, `C:\dev\streamer-hub\client\src\style.css`, `C:\dev\streamer-hub\client\src\types.ts`, `C:\dev\streamer-hub\client\src\api.ts`, `C:\dev\streamer-hub\client\src\ui.ts`
- Node.js LTS(`node --version`)와 Git, VS Code, 크롬 또는 엣지, GitHub 계정이 있어요.
- .NET SDK는 아직 없어도 돼요. 오늘 설치해요. 인터넷에 연결되어 있어야 해요.
- 켜 두어야 할 프로그램은 없어요. Day 8의 개발 서버(`npm run dev`)는 꺼도 돼요.
:::

## 📖 개념 이해

### 왜 C#으로 서버를 만들어요?

지금까지 만든 화면(프론트엔드)은 브라우저 안에서 도는 TypeScript였어요. 이제 화면 뒤에서 데이터를 저장하고 규칙을 지키는 서버(백엔드)를 만들 차례예요. 서버는 어떤 언어로도 만들 수 있어요. 이 책은 C#을 골랐어요. 이유는 세 가지예요.

- TypeScript처럼 타입을 먼저 정하는 언어라서 배운 감각을 그대로 써요.
- 웹 서버를 만드는 도구(ASP.NET Core)가 아주 완성도 높게 갖춰져 있어요.
- 게임 엔진 유니티의 스크립트 언어가 C#이라서, 나중에 게임을 만들 때도 같은 언어를 써요.

**정확한 정의:**

- **[[C#]]**(씨샵)은 마이크로소프트가 만든 정적 타입 언어예요. 코드를 먼저 컴파일해서 실행 파일을 만든 뒤 실행하는 방식이에요. 웹 서버, 데스크톱 앱, 게임 등에 두루 쓰여요.
- **[[.NET]]**(닷넷)은 C# 프로그램을 만들고 실행하는 데 필요한 도구와 기본 기능 모음이에요. 이 책은 .NET 10(장기 지원 버전, LTS)을 써요.
- **[[SDK]]**(Software Development Kit, 에스디케이)는 프로그램을 **만드는** 데 필요한 도구 모음이에요. 컴파일러, `dotnet` 명령, 템플릿이 들어 있어요. 개발할 때 설치하는 것이 SDK예요.
- **[[런타임]]**(runtime)은 이미 만들어진 프로그램을 **실행하는** 프로그램이에요. SDK 안에도 들어 있어요. 서버에 배포할 때는 런타임만 있으면 돼요.
- **[[dotnet CLI]]**(CLI = 명령줄 도구)는 터미널에서 `dotnet new`, `dotnet run`, `dotnet build`처럼 입력해서 쓰는 .NET의 통합 명령이에요. `npm`이 Node.js의 일꾼이듯 `dotnet`은 .NET의 일꾼이에요.

### TypeScript와 C#을 나란히 보기

| 항목 | TypeScript | C# |
|---|---|---|
| 타입 | 정적 타입 | 정적 타입 |
| 실행 방법 | JS로 바꾼 뒤 실행 | 컴파일 후 런타임이 실행 |
| 변수 선언 | `let n: number = 1;` | `int n = 1;` |
| 타입 쓰는 자리 | 이름 뒤 | 이름 앞 |
| 문장 끝 | 세미콜론 | 세미콜론(꼭 필요) |

**C#은 이름 앞에 타입을 써요.** `let name: string = '곰';`이 C#에서는 `string name = "곰";`예요. 큰따옴표만 글자를 감싸요(작은따옴표는 한 글자용이고 Day 10에서 배워요). 그리고 문장 끝의 `;`가 TypeScript와 달리 **꼭** 필요해요. 빼면 오류가 나요.

### 만들기와 실행하기가 나뉘어 있어요

TypeScript는 `npx tsc`로 JavaScript로 바꾸고 `node`로 실행했어요. C#도 비슷한 두 단계예요.

```text
Program.cs (내가 쓴 코드)
     │ dotnet build  (컴파일)
     ▼
HubConsole.dll (컴파일 결과)
     │ dotnet 런타임이 실행
     ▼
화면에 출력
```

`dotnet run`은 이 두 단계를 한 번에 해 줘요. 오늘 둘을 따로도 해 봐요.

### 프로젝트 파일과 최상위 문장

- **[[프로젝트 파일]]**(project file)은 `.csproj`로 끝나는 설정 파일이에요. 어떤 .NET 버전으로, 어떤 종류의 프로그램을 만드는지 적혀 있어요. `package.json`과 비슷한 역할이에요. XML 모양이에요.
- **[[최상위 문장]]**(top-level statements)은 `Main` 같은 틀 없이 파일 맨 위부터 바로 실행 코드를 쓰는 C#의 간단한 쓰기 방식이에요. 오늘의 `Program.cs`가 그래요. 첫 줄부터 한 줄씩 위에서 아래로 실행돼요.

:::info 실무에서는
회사에서는 Visual Studio라는 큰 도구를 쓰는 곳이 많아요. 이 책은 VS Code와 `dotnet` 명령만 써서 설치가 가볍고, 어느 환경에서도 같은 방식이에요. 큰 서비스일수록 프로젝트 파일 하나에 여러 파일이 묶이고, 오늘 만들 콘솔 프로그램이 그 가장 작은 모양이에요.
:::

## 🛠️ 따라하기

모두 7단계예요. 오늘 만드는 C# 연습 폴더는 `C:\dev\cs-practice`이고 Git에 올리지 않아요.

### 1단계 · .NET 10 SDK 설치하기 (12분)

방법은 두 가지예요. **A. winget 한 줄**이 가장 쉬워요. 안 되면 **B. 설치 프로그램**으로 해요.

**A. winget으로 설치**

**어디서:** 터미널(PowerShell), 위치는 어디든 괜찮아요

**무엇을:**

```powershell
winget install Microsoft.DotNet.SDK.10
```

약관 동의를 물으면 `Y`를 입력하고 `Enter`를 눌러요. 설치 중 사용자 계정 컨트롤 창이 나오면 게시자가 **Microsoft**인지 읽고 **예**를 클릭해요. 끝날 때까지 기다려요(몇 분 걸려요).

**B. 설치 프로그램으로 설치**

**어디서:** 브라우저 → `https://dotnet.microsoft.com/download/dotnet/10.0`

**무엇을:**

1. 페이지에서 **SDK**(작성 기준 10.0.403) 항목의 Windows **x64** 설치 프로그램 링크를 클릭해 내려받아요. 컴퓨터가 ARM이면 Arm64를 골라요. 화면 구성은 바뀔 수 있어요.
2. 내려받은 `.exe`를 더블클릭하고, 사용자 계정 컨트롤 창이 나오면 게시자를 확인하고 **예**를 클릭해요.
3. 설치 마법사에서 **Install**(설치)을 클릭하고 끝날 때까지 기다린 뒤 **Close**를 클릭해요.

:::success
winget이 `Successfully installed`(성공적으로 설치되었습니다)로 끝나거나, 설치 마법사가 `Installation Successful` 같은 문구를 보여 줘요. 문구는 버전에 따라 조금 달라요. 아직 `dotnet` 명령은 시험하지 않아요. 새 터미널에서 해요.
:::

### 2단계 · 새 터미널에서 버전 확인하기 (8분)

[Day 3](#/day/p2-d03)에서 배웠듯이, 설치 전에 열린 터미널은 `dotnet`을 몰라요. 모두 닫고 새로 열어요.

**어디서:** Windows 11

**무엇을:**

1. 열려 있는 터미널과 VS Code를 모두 닫아요.
2. 시작 버튼을 오른쪽 클릭하고 **터미널**을 클릭해서 새 터미널을 열어요.
3. 아래 명령을 한 줄씩 입력해요.

```powershell
dotnet --version
```

예상 출력(작성 기준 10.0.403이에요. 뒤 숫자는 달라도 `10.0.`으로 시작하면 돼요):

```text
10.0.403
```

```powershell
dotnet --list-sdks
```

예상 출력(설치된 SDK가 모두 보여요):

```text
10.0.403 [C:\Program Files\dotnet\sdk]
```

처음 `dotnet new`나 `dotnet run`을 하면 "Welcome to .NET 10.0!"로 시작하는 환영 안내와 "Telemetry"(사용 정보 수집) 안내가 한 번 나와요. 마이크로소프트가 도구 사용 정보를 모아 개선에 쓰고, 끄고 싶으면 환경 변수 `DOTNET_CLI_TELEMETRY_OPTOUT`을 `1`로 정하라는 내용이에요. 읽어 보고 그냥 넘어가도 돼요(문구는 버전에 따라 달라요).

:::success
`dotnet --version`이 `10.0.`으로 시작해요. `dotnet --list-sdks`에 `10.0.` 줄이 있어요. 8이나 9로 시작하면 아래 🧯 자주 막히는 곳의 두 번째 항목을 보세요.
:::

### 3단계 · VS Code에 C# 확장 설치하기 (8분)

[P1 Day 2](#/day/p1-d02)에서 확장 프로그램을 설치해 봤죠? C# 코드에 색을 입히고 오류를 알려 주는 확장이 필요해요.

**어디서:** VS Code

**무엇을:**

1. VS Code를 열고 왼쪽 세로 막대에서 **확장**(네모 네 개 모양) 아이콘을 클릭해요. `Ctrl + Shift + X`도 돼요.
2. 위쪽 검색 칸에 `C#`을 입력해요.
3. 결과 목록에서 게시자가 **Microsoft**이고 이름이 C#인 항목을 찾아요. 확장 ID는 `ms-dotnettools.csharp`이에요. **설치**(Install)를 클릭해요.
4. 설치가 끝나면 **설치 제거** 또는 **사용 안 함** 버튼으로 바뀌어요.

:::warn C# Dev Kit은 설치하지 않아도 돼요
검색 결과에 **C# Dev Kit**이라는 확장도 보일 수 있어요. 이것은 더 많은 기능을 주지만 Visual Studio 구독 계정으로 로그인하거나 사용 약관을 확인해야 할 수 있어요(조건은 직접 확인해야 해요). 이 책은 필요 없어요. **C#** 확장과 `dotnet` 명령만으로 모두 진행해요. Dev Kit을 설치했는데 로그인 창이 떠서 불편하면 그 확장만 제거하고 **C#** 확장은 그대로 둬요.
:::

:::tip 터미널로도 설치할 수 있어요
VS Code가 닫힌 상태의 터미널에서 `code --install-extension ms-dotnettools.csharp`를 입력해도 같은 확장이 설치돼요.
:::

:::success
확장 목록의 **C#** 항목에 **설치 제거** 또는 **사용 안 함** 버튼이 보여요. 아직 C# 파일을 열지 않았으니 다른 변화는 없어요.
:::

### 4단계 · 첫 프로젝트 만들고 파일 읽기 (12분)

**어디서:** 터미널(PowerShell)

**무엇을:** 한 줄씩 입력해요.

```powershell
dotnet new console -n HubConsole -o C:\dev\cs-practice
```

`console`은 "글자만 출력하는 콘솔 프로그램" 템플릿, `-n HubConsole`은 프로젝트 이름, `-o`는 만들 폴더예요. 처음에는 환영 안내가 나올 수 있어요. 예상 출력(경로는 내 폴더로 나와요):

```text
The template "Console App" was created successfully.

Processing post-creation actions...
Restoring C:\dev\cs-practice\HubConsole.csproj:
  Determining projects to restore...
  Restored C:\dev\cs-practice\HubConsole.csproj (in 118 ms).
Restore succeeded.
```

```powershell
cd C:\dev\cs-practice
```

```powershell
code .
```

VS Code 새 창이 열려요. 작성자를 신뢰하느냐고 물으면 내가 만든 폴더이니 신뢰한다고 클릭해요. 오른쪽 아래에 "C# 개발을 위한 필수 자산이 없습니다" 같은 알림(문구는 달라요)이 나오면 **예**(Yes)를 클릭해요.

탐색기에서 두 파일을 열어 읽어 봐요.

**`HubConsole.csproj` (프로젝트 파일)**

```xml
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net10.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>

</Project>
```

- `OutputType Exe`: 실행하는 프로그램을 만든다는 뜻이에요.
- `TargetFramework net10.0`: .NET 10으로 만든다는 뜻이에요. 서버의 `.csproj`에도 같은 줄이 있어요.
- `ImplicitUsings enable`: 자주 쓰는 기능(`Console` 등)을 매번 가져오지 않아도 되게 해요.
- `Nullable enable`: `null`일 수 있는 값을 컴파일러가 점검해요. Day 11에서 배워요.

**`Program.cs` (코드)**

```csharp
// See https://aka.ms/new-console-template for more information
Console.WriteLine("Hello, World!");
```

`Console.WriteLine("…")`은 큰따옴표 안의 글자를 출력하고 줄을 바꿔요. TypeScript의 `console.log`와 같은 역할이에요. `//` 뒤는 주석이에요.

:::success
- `The template "Console App" was created successfully.`가 보여요.
- VS Code 탐색기에 `HubConsole.csproj`, `Program.cs`, `obj` 폴더가 보여요. `Program.cs`를 열면 글자에 색이 입혀져 있어요.
:::

### 5단계 · 내 코드로 바꿔 실행하기 (10분)

**어디서:** VS Code(`C:\dev\cs-practice`가 열린 창) → `Program.cs`, 그리고 터미널

**무엇을:**

1. `Program.cs`의 내용을 모두 지우고 아래 내용으로 바꿔요. 직접 입력할 때 따옴표와 세미콜론에 주의해요. 저장해요(`Ctrl + S`).

📄 C:\dev\cs-practice\Program.cs
```csharp
// 최상위 문장: 파일 위에서부터 한 줄씩 실행돼요
Console.WriteLine("안녕하세요, 스트리머 허브!");

string first = "달빛곰";
string second = "픽셀토끼";
string third = "노을고양이";

Console.WriteLine(first);
Console.WriteLine(second);
Console.WriteLine(third);
```

코드의 뜻이에요. `string first = "달빛곰";`은 "글자(`string`)를 담는 `first`라는 변수에 `달빛곰`을 넣는다"예요. TypeScript의 `const first: string = '달빛곰';`과 비교해 보세요. 타입이 이름 **앞**에 와요.

2. 터미널을 열어요. `` Ctrl + ` ``를 눌러 VS Code 터미널을 열고 프롬프트가 `PS C:\dev\cs-practice>`인지 읽어요.
3. 실행해요.

```powershell
dotnet run
```

예상 출력:

```text
안녕하세요, 스트리머 허브!
달빛곰
픽셀토끼
노을고양이
```

:::success
위의 네 줄이 나와요. 한글이 `?`나 이상한 글자로 보이면 아래 🧯 자주 막히는 곳의 다섯 번째 항목을 보세요. `dotnet run`이 처음에는 몇 초 걸려요.
:::

### 6단계 · 일부러 `;`를 빼서 오류 읽기 (6분)

**어디서:** VS Code → `Program.cs`, 그리고 터미널

**무엇을:**

1. `Console.WriteLine(first);` 줄 끝의 `;`를 지우고 저장해요.
2. 터미널에서 다시 `dotnet run`을 실행해요.

```powershell
dotnet run
```

예상 출력(경로는 내 폴더로 나와요):

```text
C:\dev\cs-practice\Program.cs(8,25): error CS1002: ; expected [C:\dev\cs-practice\HubConsole.csproj]

The build failed. Fix the build errors and run again.
```

오류 메시지는 TypeScript와 같은 구조예요.

- `C:\dev\cs-practice\Program.cs`: 파일이에요.
- `(8,25)`: 8번째 줄의 25번째 칸이에요.
- `error CS1002`: 오류 번호예요. `CS`는 C#이라는 뜻이에요.
- `; expected`: 뜻이에요. "세미콜론이 있어야 해요."
- `[…HubConsole.csproj]`: 어느 프로젝트를 만들다 났는지 알려 줘요.

3. `;`를 되돌리고 저장한 뒤 `dotnet run`으로 네 줄이 다시 나오는지 확인해요.

:::success
`CS1002` 오류가 나왔고 줄 번호가 `;`를 뺀 줄을 가리켜요. 되돌린 뒤에는 오류 없이 네 줄이 나와요. 빌드가 실패하면 프로그램이 실행되지 않는다는 점이 TypeScript의 `npx tsc` 오류와 달라요.
:::

### 7단계 · 빌드 결과 파일 살펴보기 (8분)

**어디서:** VS Code 터미널, 위치 `C:\dev\cs-practice`

**무엇을:**

1. 빌드만 해요(실행은 안 해요).

```powershell
dotnet build
```

예상 출력(시간과 숫자는 달라도 돼요):

```text
  Determining projects to restore...
  All projects are up-to-date for restore.
  HubConsole -> C:\dev\cs-practice\bin\Debug\net10.0\HubConsole.dll

Build succeeded.
    0 Warning(s)
    0 Error(s)

Time Elapsed 00:00:01.46
```

2. 탐색기에서 `bin\Debug\net10.0` 폴더를 펼쳐요. `HubConsole.dll`이 있고, Windows에서는 `HubConsole.exe`도 있어요. `.dll`이 컴파일 결과예요.
3. 컴파일된 결과를 `dotnet`으로 직접 실행해요.

```powershell
dotnet bin\Debug\net10.0\HubConsole.dll
```

예상 출력:

```text
안녕하세요, 스트리머 허브!
달빛곰
픽셀토끼
노을고양이
```

:::success
`Build succeeded.`가 나오고 `bin\Debug\net10.0\HubConsole.dll`이 있어요. `dotnet run`과 같은 네 줄이 나와요. `dotnet run`은 "만들고 실행"을 한 번에 하는 명령이에요.
:::

## ✍️ 과제

### 과제 1 · 내 방송 이름·요일·시간 출력하기 (쉬움 ⭐, 7분)

- `Program.cs`의 맨 아래에 `Console.WriteLine`으로 세 줄을 더 출력해요: 내 방송 이름, 요일, 시간.
- 확인: `dotnet run`에서 네 줄 다음에 내 세 줄이 나와요.
- 힌트: 큰따옴표로 글자를 감싸고 줄 끝에 `;`를 꼭 써요.

### 과제 2 · `CS1002` 직접 읽고 고치기 (쉬움 ⭐, 6분)

- 6단계처럼 `;`를 일부러 하나 빼고 `dotnet run`의 오류에서 줄 번호와 칸 번호를 찾아 말해 봐요.
- 이번에는 `Console.WriteLine(second);` 줄에서 `;`를 빼요.
- 확인: 오류의 `(줄,칸)`이 그 줄을 가리켜요. 고치면 사라져요.
- 힌트: 칸 번호는 줄의 맨 앞 글자를 1로 세요. 컴파일러는 "이 줄이 끝났는데 `;`가 없다"를 줄 끝에서 알아채요.

### 과제 3 · 빌드 결과를 직접 실행하기 (보통 ⭐⭐, 12분)

- `dotnet build`를 하고 `dotnet bin\Debug\net10.0\HubConsole.dll`로 실행해요(7단계).
- 이어서 이 한 가지 질문에 답해 보세요: `Program.cs`를 고치고 `dotnet bin\Debug\net10.0\HubConsole.dll`만 다시 실행하면 출력이 바뀔까요? 직접 해 보세요. `Program.cs`의 첫 인사말을 바꾸고 `dotnet build` 없이 `.dll`만 실행해요.
- 확인: 바뀌지 않아요. `dotnet build`(또는 `dotnet run`)를 해야 바뀐 코드가 `.dll`에 들어가요. 확인한 뒤 인사말을 원래대로 되돌리고 `dotnet run`을 한 번 실행해서 `.dll`도 원래대로 만들어요.
- 힌트: `.dll`은 컴파일 시점의 복사본이에요.

## ✅ 정답

:::answer 과제 1 정답 · 방송 소개 출력
```csharp
Console.WriteLine("방송 이름: 달빛곰 방송국");
Console.WriteLine("요일: 금요일");
Console.WriteLine("시간: 밤 9시");
```

**왜 이렇게 하나요?** `Console.WriteLine`은 줄을 바꿔 가며 출력해요. 글자는 큰따옴표로 감싸요. 내 방송 이름과 요일·시간은 내 것으로 써도 돼요. 세 줄 모두 끝에 `;`가 있어야 해요.
:::

:::answer 과제 2 정답 · CS1002
`Console.WriteLine(second)`에서 `;`를 빼면 이런 오류가 나요(줄과 칸은 같은 위치를 가리키면 맞아요).

```text
C:\dev\cs-practice\Program.cs(9,26): error CS1002: ; expected [C:\dev\cs-practice\HubConsole.csproj]
```

고친 줄이에요.

```csharp
Console.WriteLine(second);
```

**왜 이렇게 하나요?** `(9,26)`은 9번째 줄의 26번째 칸이에요. 컴파일러는 줄 끝(`)` 다음)에서 "여기에 `;`가 있어야 해요"를 알아채요. 그래서 칸 번호는 줄의 마지막 글자 바로 뒤를 가리켜요. 오류가 가리키는 줄 또는 바로 윗줄을 확인하면 대부분 찾아요. 참고로 변수 만드는 줄(`string third = "노을고양이"`)에서 `;`를 빼면 다음 줄을 같은 선언의 이어짐으로 읽어서 `error CS1003: Syntax error, ',' expected`처럼 다른 번호가 나올 수 있어요.
:::

:::answer 과제 3 정답 · 빌드 결과는 복사본
```powershell
dotnet build
dotnet bin\Debug\net10.0\HubConsole.dll
```

`Program.cs`의 첫 줄을 바꾼 뒤 `.dll`만 실행하면 **옛 인사말**이 나와요. 다시 `dotnet build`를 하거나 `dotnet run`을 하면 새 인사말이 나와요.

**왜 이렇게 하나요?** `.dll`은 `Program.cs`를 컴파일해서 만든 결과예요. 원본을 고쳐도 컴파일을 다시 하기 전에는 결과가 그대로예요. TypeScript에서 `src\*.ts`를 고치고 `npx tsc`를 안 하면 `dist\*.js`가 옛것인 것과 똑같아요. `dotnet run`은 필요하면 알아서 다시 빌드해 줘서 편해요.
:::

:::answer 오늘 끝 상태 전체 코드
오늘 따라하기와 과제를 모두 끝낸 상태예요. 막혔다면 `C:\dev\cs-practice` 폴더에서 `dotnet new console -n HubConsole -o C:\dev\cs-practice`를 실행한 뒤(이미 있다면 건너뛰어요) `Program.cs`를 아래 내용으로 바꾸고 Day 10을 시작하세요. `bin`과 `obj`는 빌드가 만든 폴더라서 직접 만들지 않아요.

```text
C:\dev\cs-practice\
├─ bin\
├─ obj\
├─ HubConsole.csproj
└─ Program.cs
```

📄 C:\dev\cs-practice\Program.cs
```csharp
// 최상위 문장: 파일 위에서부터 한 줄씩 실행돼요
Console.WriteLine("안녕하세요, 스트리머 허브!");

string first = "달빛곰";
string second = "픽셀토끼";
string third = "노을고양이";

Console.WriteLine(first);
Console.WriteLine(second);
Console.WriteLine(third);

Console.WriteLine("방송 이름: 달빛곰 방송국");
Console.WriteLine("요일: 금요일");
Console.WriteLine("시간: 밤 9시");
```

`HubConsole.csproj`는 4단계에 있는 그대로예요. 과제 1의 내 방송 소개 세 줄은 내 것이어도 괜찮아요. 오늘은 프로젝트 파일(`C:\dev\streamer-hub`)이 바뀌지 않아서 Git 커밋은 하지 않아요.
:::

## 🧯 자주 막히는 곳

여기에 없는 증상은 [문제 해결 모음](#/page/troubleshooting)에서 찾아보세요.

### `dotnet : The term 'dotnet' is not recognized as the name of a cmdlet, function, script file, or operable program.`

```text
dotnet : The term 'dotnet' is not recognized as the name of a cmdlet, function, script file, or operable program. Check the spelling of the name, or if a path was included, verify that the path is correct and try again.
```

**원인:** 설치 전에 열려 있던 터미널이 옛 PATH를 들고 있어요([Day 3](#/day/p2-d03)에서 배운 것과 같아요). 한국어 Windows에서는 "'dotnet' 용어가 cmdlet, 함수, 스크립트 파일 또는 실행할 수 있는 프로그램 이름으로 인식되지 않습니다."로 보여요.

**해결:**

1. 열려 있는 터미널과 VS Code를 모두 닫아요.
2. 터미널을 새로 열고 `dotnet --version`을 입력해요.
3. 그래도 안 되면 `C:\Program Files\dotnet` 폴더가 있는지 확인하고, 없으면 1단계 설치를 다시 해요.
4. `10.0.`으로 시작하는 버전이 나오면 해결이에요.

### `dotnet --version`이 8이나 9로 시작해요

**원인:** 예전에 설치한 다른 SDK가 먼저 잡히거나, 10 SDK 설치가 끝나지 않았어요.

**해결:**

1. `dotnet --list-sdks`를 입력해 설치된 SDK 목록을 봐요.
2. 목록에 `10.0.`이 없으면 1단계의 설치를 해요.
3. 목록에 `10.0.`이 있는데도 다른 버전이 나오면, 프로젝트 폴더 위쪽에 `global.json` 파일이 버전을 고정했는지 확인해요(`C:\dev` 아래에는 없어야 해요). 있다면 그 파일을 지우거나 이름을 바꿔요.
4. 새 터미널에서 `dotnet --version`이 `10.0.`으로 시작하면 해결이에요.

### `Couldn't find a project to run.`

```text
Couldn't find a project to run. Ensure a project exists in C:\Users\내이름, or pass the path to the project using --project.
```

**원인:** `dotnet run`은 현재 위치에서 `.csproj`를 찾아요. 터미널이 `C:\dev\cs-practice`가 아닌 다른 폴더에 있어요. 경로는 사람마다 달라요.

**해결:**

1. 프롬프트의 경로를 읽어요.
2. `cd C:\dev\cs-practice`를 입력해요.
3. `dotnet run`을 다시 실행해서 출력이 나오면 해결이에요.

### 설치할 때 사용자 계정 컨트롤(관리자 권한) 창이 떠요

**원인:** SDK는 `C:\Program Files\dotnet`에 설치되어서 Windows가 허락을 물어요. 정상이에요.

**해결:** 게시자가 **Microsoft Corporation**인지 읽고 **예**를 클릭해요. 게시자가 다르면 클릭하지 말고 설치 파일을 지운 뒤 `https://dotnet.microsoft.com/download/dotnet/10.0`에서 다시 받아요.

### 한글이 `?`나 깨진 글자로 보여요

**원인:** 콘솔의 글자 인코딩과 프로그램의 출력 방식이 달라요. 한국어 Windows에서는 보통 잘 보이지만, 환경에 따라 깨질 수 있어요(이 책의 작성 환경에서는 Windows 실기를 확인하지 못했어요).

**해결:**

1. `Program.cs` 맨 위에 다음 한 줄을 더하고 저장해요.

```csharp
Console.OutputEncoding = System.Text.Encoding.UTF8;
```

2. `dotnet run`을 다시 실행해요. 한글이 바르게 나오면 해결이에요.
3. 그래도 깨지면 VS Code 터미널 대신 Windows 터미널에서 실행해 봐요.

### C# Dev Kit이 로그인을 요구해요

**원인:** 선택 확장인 C# Dev Kit을 설치했어요. 이 확장은 로그인이나 약관 확인을 요구할 수 있어요.

**해결:** C# Dev Kit 확장을 제거해요(확장 목록에서 톱니 아이콘 → **제거**). **C#** 확장(`ms-dotnettools.csharp`)은 남겨요. 이 책은 C# 확장과 `dotnet` 명령만으로 진행해요.

### 첫 빌드가 아주 느려요

**원인:** 백신 프로그램이 새로 만들어지는 파일을 검사하거나, 처음에 필요한 패키지를 내려받고 있어요.

**해결:** 기다려요. 백신 프로그램을 끄지 않아요. 두 번째부터는 빨라져요.

## 📝 오늘의 체크리스트

- [ ] `dotnet --version`이 `10.0.`으로 시작하고 `dotnet --list-sdks`에 `10.0.` 줄이 있어요
- [ ] VS Code에 **C#** 확장(`ms-dotnettools.csharp`)이 설치되어 있어요
- [ ] `C:\dev\cs-practice`에서 `dotnet run`이 `안녕하세요, 스트리머 허브!`와 이름 세 줄을 출력해요
- [ ] `error CS1002: ; expected`의 파일, 줄, 칸, 뜻을 읽고 고쳤어요
- [ ] `dotnet build` 뒤 `bin\Debug\net10.0\HubConsole.dll`이 있고 직접 실행해 봤어요
- [ ] TypeScript와 C#의 차이(타입 위치, 세미콜론)를 한 가지씩 말할 수 있어요
- [ ] 과제 1~3을 풀고 정답과 비교했어요

## 📚 더 알아보기

- [.NET 시작하기](https://learn.microsoft.com/ko-kr/dotnet/core/introduction): .NET이 무엇이고 SDK와 런타임이 어떻게 다른지 공식 문서로 설명해요.
- [C# 가이드](https://learn.microsoft.com/ko-kr/dotnet/csharp/): C# 언어를 처음부터 소개하는 공식 안내예요.
- [dotnet CLI 개요](https://learn.microsoft.com/ko-kr/dotnet/core/tools/): `dotnet new`, `run`, `build` 같은 명령을 정리해요.

➡️ **다음 Day 예고:** [Day 10 · C# 기본 문법](#/day/p2-d10)에서는 `int`, `string`, `bool` 같은 값 타입, 문자열 보간, `if`와 `switch`, 반복문, 열거형을 배우고 요일별 방송 시간표를 출력하는 프로그램을 만들어요.
