## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- `dotnet new sln`과 `dotnet new web`으로 `C:\dev\streamer-hub\server` 아래에 서버 프로젝트를 만들 수 있어요.
- `Program.cs`의 구조(만들기 → 주소 연결 → 켜기)를 읽고, `MapGet`으로 주소 두 개를 만들 수 있어요.
- 서버를 포트 5250에서 켜고, 브라우저와 `.http` 파일로 `["달빛곰","픽셀토끼","노을고양이"]`가 오는 것을 확인할 수 있어요.
- `dotnet watch`로 코드를 고치며 서버를 다시 켜지 않고 확인하고, `bin/`·`obj/`를 Git에서 빼고 커밋할 수 있어요.

**예상 시간: 110분** (개념 이해 22분 · 따라하기 62분 · 과제 20분 · 정리 6분)

:::path 📂 시작 상태
[Day 16](#/day/p2-d16)이 끝난 상태예요. 오늘부터 프로젝트 폴더 `C:\dev\streamer-hub` 안에 `server` 폴더를 새로 만들어요. 서버는 오늘 처음 켜요.

- `C:\dev\streamer-hub\README.md`, `C:\dev\streamer-hub\.git\` (README에 `API 설계` 표가 있어요)
- `C:\dev\streamer-hub\client\` 폴더: `.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`
- `C:\dev\streamer-hub\client\public\` 의 `favicon.svg`, 같은 곳 `data\` 폴더의 `streamers.json`, `schedules.json`
- `C:\dev\streamer-hub\client\src\` 의 `main.ts`, `style.css`, `types.ts`, `api.ts`, `ui.ts`
- `C:\dev\http-practice\practice.http` (Day 16의 연습 파일)
- .NET 10 SDK: `dotnet --version`을 치면 `10.0.`으로 시작하는 숫자가 나와요.
- VS Code의 C# 확장(`ms-dotnettools.csharp`)과 REST Client 확장(`humao.rest-client`)
- Git: `git status`가 `nothing to commit, working tree clean`이에요.
- 켜 두어야 할 프로그램은 없어요. 오늘 서버를 처음 켜고, 마지막에는 꺼도 돼요.
:::

## 📖 개념 이해

### 서버를 C#으로 만든다는 것

**비유부터 볼게요.** 식당을 열려면 가게 건물(틀), 메뉴판(주소 목록), 주방(처리 코드)이 필요해요. 직접 벽돌부터 쌓지 않고 상가 건물을 빌려서 메뉴판과 주방만 채우면 빨라요.

**정확한 정의는 이래요.**

- **[[ASP.NET Core]]**(에이에스피닷넷 코어)는 C#으로 웹 서버를 만드는 틀(프레임워크)이에요. 요청을 받는 네트워크 일, 주소 연결, 응답 보내기 같은 공통 일을 대신해 줘요. 우리는 "이 주소로 요청이 오면 이렇게 답해요"만 적어요.
- **[[Minimal API]]**(미니멀 에이피아이)는 ASP.NET Core에서 `app.MapGet(주소, 함수)` 몇 줄로 엔드포인트를 만드는 가벼운 방식이에요. 클래스를 여러 개 만들지 않고 파일 하나에서 시작해요.
- **[[라우트]]**(route)는 요청 주소와 그 주소를 처리할 코드를 짝지은 규칙이에요. `MapGet("/api/streamers", …)`는 "GET으로 `/api/streamers` 주소가 오면 이 함수를 실행해요"라는 라우트예요.

Day 16에서 배운 엔드포인트가 이 라우트 하나하나예요.

### 프로젝트와 솔루션

Day 9에서 `dotnet new console`로 프로젝트 하나를 만들었어요. 프로젝트는 `.csproj` 파일 하나와 코드 파일들의 묶음이에요. 서버에 이어 Day 35에는 테스트 프로젝트도 생겨요. 프로젝트 여러 개를 한곳에서 관리하는 목록 파일이 **[[솔루션]]**(solution)이에요. .NET 10에서는 확장자가 `.slnx`예요.

```text
server\
├─ StreamerHub.slnx          솔루션: 프로젝트 목록
└─ StreamerHub.Api\          서버 프로젝트
   ├─ StreamerHub.Api.csproj 프로젝트 파일
   ├─ Program.cs             서버의 시작점
   ├─ appsettings.json       설정 (Day 24)
   └─ Properties\
      └─ launchSettings.json 켜는 방법
```

`StreamerHub.Api.csproj`의 첫 줄에 `Sdk="Microsoft.NET.Sdk.Web"`이 적혀 있어요. Day 9의 콘솔 프로젝트는 `Microsoft.NET.Sdk`였어요. `.Web`이 붙으면 웹 서버용 도구가 함께 와요.

### Program.cs의 네 부분

`dotnet new web`이 만든 `Program.cs`는 Day 9에서 본 최상위 문장이에요.

```csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "Hello World!");

app.Run();
```

- `CreateBuilder`는 서버를 만들 재료(설정, 기능 목록)를 모은 `builder`를 만들어요.
- `builder.Build()`가 재료로 서버(`app`)를 완성해요.
- `app.MapGet(…)`이 주소를 연결해요. 두 번째 칸은 Day 14에서 배운 람다 식이에요. 요청이 오면 이 함수가 돌려준 값이 응답이 돼요.
- `app.Run()`이 서버를 켜고 요청을 기다려요. 끌 때까지 여기서 멈춰 있어요.

### 직렬화: C# 값을 JSON 글자로

`List<string>`은 C# 안의 값이에요. 브라우저는 그것을 이해하지 못해서, 서버는 응답에 실을 때 JSON 글자로 바꿔요. 이 변환이 **[[직렬화]]**(serialization)예요. 람다가 `List<string>`을 돌려주면 ASP.NET Core가 알아서 `["달빛곰","픽셀토끼","노을고양이"]`라는 JSON 글자로 바꿔서 `Content-Type: application/json`과 함께 보내요. 반대로 JSON을 C# 값으로 바꾸는 일(역직렬화)은 Day 18에서 해요.

### 포트와 launchSettings.json

[[localhost]]는 "내 컴퓨터"를 가리키는 주소이고, [[포트]]는 컴퓨터 안에서 프로그램을 구별하는 번호예요(Day 7). Vite 개발 서버는 5173번을 써요. 우리 서버는 **5250번**을 쓰기로 해요. 서버 주소는 `http://localhost:5250`이에요.

**[[launchSettings.json]]**(런치 세팅스 제이슨)은 `dotnet run`이 서버를 켤 때 참고하는 설정 파일로, `Properties` 폴더에 있어요. 템플릿은 무작위 포트(예: 5147)를 적어 주기 때문에 5250으로 고정해요. 템플릿에는 `https` 프로필도 있는데 오늘은 지워요. HTTPS로 켜려면 컴퓨터가 믿는 개발용 인증서가 필요해서, 안 되면 브라우저에 경고가 떠요. 그 이야기는 Day 34에서 해요. 오늘은 `http`만 써요.

### dotnet watch: 저장하면 알아서 다시 반영

`dotnet run`은 코드를 고칠 때마다 `Ctrl + C`로 끄고 다시 켜야 해요. **[[dotnet watch]]**(닷넷 워치)는 파일이 바뀌면 자동으로 다시 반영해요. 문자열을 바꾸는 정도는 서버를 끄지 않고 바로 적용(핫 리로드)하고, 안 될 때는 다시 시작해 줘요. 이 점은 Vite의 개발 서버와 비슷해요.

:::info 실무에서는
개발할 때는 `dotnet watch`, 서버에 올릴 때는 `dotnet publish`(Day 38)로 만든 결과를 `dotnet StreamerHub.Api.dll`로 켜요. 오늘 쓰는 `localhost` 주소는 내 컴퓨터에서만 열려서, 개발 중에 다른 사람이 접속할 수 없어요. 그래서 안전하게 연습할 수 있어요.
:::

## 🛠️ 따라하기

7단계예요. 마지막에 Git에 올려요.

### 1단계 · server 폴더와 솔루션·프로젝트 만들기 (12분)

**어디서:** PowerShell, 위치는 `C:\dev\streamer-hub` (아래 첫 명령이 옮겨 줘요)

**무엇을:** 아래 명령을 한 줄씩 입력해요.

```powershell
cd C:\dev\streamer-hub
```

아무것도 나오지 않고 다음 줄 프롬프트가 `PS C:\dev\streamer-hub>`로 바뀌면 성공이에요.

```powershell
mkdir server
```

예상 출력(날짜는 달라요):

```text
    Directory: C:\dev\streamer-hub


Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        2026-11-06   오후 3:10                server
```

```powershell
cd server
```

아무것도 나오지 않고 프롬프트가 `PS C:\dev\streamer-hub\server>`로 바뀌어요.

```powershell
dotnet new sln -n StreamerHub
```

예상 출력:

```text
The template "Solution File" was created successfully.
```

```powershell
dotnet new web -n StreamerHub.Api
```

예상 출력(경로는 내 컴퓨터대로 나와요. 처음 실행하면 패키지를 받느라 몇 초 걸려요):

```text
The template "ASP.NET Core Empty" was created successfully.

Processing post-creation actions...
Restoring C:\dev\streamer-hub\server\StreamerHub.Api\StreamerHub.Api.csproj:
  Determining projects to restore...
  Restored C:\dev\streamer-hub\server\StreamerHub.Api\StreamerHub.Api.csproj (in 115 ms).
Restore succeeded.
```

```powershell
dotnet sln add StreamerHub.Api
```

예상 출력:

```text
Project `StreamerHub.Api\StreamerHub.Api.csproj` added to the solution.
```

```powershell
dir
```

예상 출력(날짜와 시각은 달라요):

```text
    Directory: C:\dev\streamer-hub\server

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        2026-11-06   오후 3:11                StreamerHub.Api
-a----        2026-11-06   오후 3:11             86 StreamerHub.slnx
```

:::success
`server` 폴더에 `StreamerHub.slnx` 파일과 `StreamerHub.Api` 폴더가 있어요. 확장자가 `.sln`이 아니라 `.slnx`예요. `dotnet new`가 "command not found"로 실패하면 터미널을 닫고 새로 열어요(Day 9).
:::

### 2단계 · VS Code로 열고 만들어진 파일 읽기 (8분)

**어디서:** PowerShell (위치는 어디든 괜찮아요)

**무엇을:**

1. 프로젝트 폴더를 VS Code로 열어요.

```powershell
code C:\dev\streamer-hub
```

2. 왼쪽 탐색기에서 `server` → `StreamerHub.Api`를 펼쳐요.
3. `StreamerHub.Api.csproj`를 열어 아래와 같은지 읽어요. 고치지 않아요.

📄 C:\dev\streamer-hub\server\StreamerHub.Api\StreamerHub.Api.csproj
```xml
<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

</Project>
```

4. `Program.cs`를 열어 위 개념 이해의 네 줄이 있는지 읽어요.
5. C# 확장이 "필요한 자산을 추가할까요?"(Required assets to build and debug are missing…) 같은 알림을 띄우면 **예**(Yes)를 눌러요. 문구는 버전에 따라 달라요. 알림이 안 떠도 괜찮아요.

:::success
탐색기에 `server\StreamerHub.slnx`와 `StreamerHub.Api` 폴더 아래 `Program.cs`, `appsettings.json`, `Properties` 폴더 등이 보여요. `bin`과 `obj` 폴더는 아직 없을 수 있고, 나중에 생겨도 정상이에요.
:::

### 3단계 · launchSettings.json을 5250으로 고치기 (8분)

**어디서:** VS Code → `server\StreamerHub.Api\Properties\launchSettings.json`

**무엇을:** `Ctrl + A`로 전체를 선택하고 아래 내용으로 바꾼 뒤 `Ctrl + S`로 저장해요.

📄 C:\dev\streamer-hub\server\StreamerHub.Api\Properties\launchSettings.json
```json
{
  "$schema": "https://json.schemastore.org/launchsettings.json",
  "profiles": {
    "http": {
      "commandName": "Project",
      "dotnetRunMessages": true,
      "launchBrowser": false,
      "applicationUrl": "http://localhost:5250",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    }
  }
}
```

- `"http"`가 프로필 이름이에요. 프로필은 하나만 남겨요(`https` 프로필을 지웠어요).
- `"applicationUrl"`이 서버 주소와 포트예요.
- `"launchBrowser": false`는 서버를 켤 때 브라우저를 자동으로 열지 않는다는 뜻이에요.
- `"ASPNETCORE_ENVIRONMENT": "Development"`는 개발 중이라는 표시예요. Day 24에서 의미를 배워요.

:::success
파일에 `"https"`라는 글자가 없고 `5250`이 한 번만 보여요. JSON이라서 쉼표와 중괄호가 짝이 맞아야 하고, 맞지 않으면 VS Code가 빨간 밑줄로 알려 줘요.
:::

### 4단계 · Program.cs를 고치고 서버 켜기 (14분)

**어디서:** VS Code → `server\StreamerHub.Api\Program.cs`

**무엇을:** 전체를 지우고 아래 내용으로 바꾼 뒤 저장해요.

📄 C:\dev\streamer-hub\server\StreamerHub.Api\Program.cs
```csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "스트리머 허브 API예요");
app.MapGet("/api/streamers", () => new List<string> { "달빛곰", "픽셀토끼", "노을고양이" });

app.Run();
```

주소 두 개를 만들었어요. `/`는 글자 하나를, `/api/streamers`는 이름 목록(JSON)을 돌려줘요.

**어디서:** VS Code 아래쪽 터미널. `` Ctrl + ` ``로 열고, 프롬프트가 `PS C:\dev\streamer-hub>`이면 아래 명령으로 옮겨요.

```powershell
cd C:\dev\streamer-hub\server\StreamerHub.Api
```

아무것도 나오지 않고 프롬프트가 `PS C:\dev\streamer-hub\server\StreamerHub.Api>`로 바뀌어요.

```powershell
dotnet run
```

예상 출력(첫 줄의 경로는 내 컴퓨터대로 나와요):

```text
Using launch settings from C:\dev\streamer-hub\server\StreamerHub.Api\Properties\launchSettings.json...
Building...
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5250
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
info: Microsoft.Hosting.Lifetime[0]
      Hosting environment: Development
info: Microsoft.Hosting.Lifetime[0]
      Content root path: C:\dev\streamer-hub\server\StreamerHub.Api
```

프롬프트가 돌아오지 않아요. 서버가 켜져서 요청을 기다리는 중이라 정상이에요. 터미널이 서버에 붙잡혀 있어서 다른 명령은 새 터미널(터미널 패널 오른쪽 위의 `+` 버튼)에서 쳐요.

**브라우저에서 확인해요.** Chrome이나 Edge를 열고 주소 표시줄에 입력해요.

```text
http://localhost:5250/api/streamers
```

:::success
터미널에 `Now listening on: http://localhost:5250`이 보이고, 브라우저 화면에 `["달빛곰","픽셀토끼","노을고양이"]`가 보여요. `http://localhost:5250/`을 열면 `스트리머 허브 API예요`가 보여요.

방화벽 알림창(**Windows 보안 경고**, 문구는 버전에 따라 달라요)이 떴다면 아래 🧯 자주 막히는 곳의 "Windows 보안 경고 창이 떠요"를 보세요. `Failed to bind to address … address already in use`가 나왔다면 같은 🧯 항목 `Failed to bind to address http://127.0.0.1:5250: address already in use.`를 보세요.
:::

서버를 끄려면 서버가 켜진 터미널을 클릭하고 `Ctrl + C`를 눌러요. 프롬프트가 돌아오면 꺼진 거예요. 이 단계에서는 끄고 다음 단계로 가요.

### 5단계 · dotnet watch로 고치며 확인하기 (8분)

**어디서:** VS Code 터미널, 위치 `C:\dev\streamer-hub\server\StreamerHub.Api`

**무엇을:**

1. 서버를 `dotnet watch`로 켜요.

```powershell
dotnet watch
```

예상 출력(앞부분이 다를 수 있어요. 아이콘 이모지는 터미널에 따라 깨져 보여도 괜찮아요):

```text
dotnet watch 🔥 Hot reload enabled. For a list of supported edits, see https://aka.ms/dotnet/hot-reload.
dotnet watch 💡 Press Ctrl+R to restart.
dotnet watch 🔨 Building C:\dev\streamer-hub\server\StreamerHub.Api\StreamerHub.Api.csproj ...
dotnet watch 🔨 Build succeeded: C:\dev\streamer-hub\server\StreamerHub.Api\StreamerHub.Api.csproj
Using launch settings from C:\dev\streamer-hub\server\StreamerHub.Api\Properties\launchSettings.json...
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5250
```

2. `Program.cs`에서 `"노을고양이"` 뒤에 `, "별빛여우"`를 더하고 `Ctrl + S`로 저장해요.
3. 터미널에 `dotnet watch ⌚ File updated: ./Program.cs`와 `Hot reload succeeded.`가 나오는지 봐요. 서버를 끄지 않았어요.
4. 브라우저에서 `http://localhost:5250/api/streamers`를 새로 고침(`F5`)해요.

:::success
브라우저에 `["달빛곰","픽셀토끼","노을고양이","별빛여우"]`가 보여요. 바뀐 값이 바로 반영된 거예요.
:::

:::warn 새 주소(MapGet 줄)를 더했는데 404가 나오면
문자열 값을 고치는 일은 바로 반영되지만, `app.MapGet(…)` 줄을 새로 더하는 일은 서버가 켜질 때 한 번 실행되는 부분이라 바로 반영되지 않을 수 있어요. 이럴 때는 서버가 켜진 터미널을 클릭하고 `Ctrl + R`(다시 시작)을 눌러요. 그래도 안 되면 `Ctrl + C`로 끄고 `dotnet watch`를 다시 실행해요.
:::

6. 확인했으면 `"별빛여우"`를 다시 지우고 저장해요. 서버는 6단계를 위해 **켜 두어요**.

### 6단계 · .http 파일로 요청 보내기 (8분)

**어디서:** VS Code → 탐색기에서 `StreamerHub.Api` 폴더를 오른쪽 클릭 → **새 파일**

**무엇을:** 파일 이름을 `StreamerHub.Api.http`로 하고 아래 내용을 붙여 넣은 뒤 저장해요.

📄 C:\dev\streamer-hub\server\StreamerHub.Api\StreamerHub.Api.http
```http
# 스트리머 허브 API 요청 연습 파일
# 요청 위의 Send Request를 눌러요. 먼저 서버를 켜 두세요: dotnet watch

@host = http://localhost:5250

### 서버가 살아 있는지 (200)
GET {{host}}/

### 스트리머 이름 목록 (200, JSON 배열)
GET {{host}}/api/streamers
```

두 번째 요청 위의 **Send Request**를 눌러요.

예상 화면(헤더 순서와 시각은 달라도 돼요):

```text
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Date: Fri, 06 Nov 2026 06:10:00 GMT
Server: Kestrel
Transfer-Encoding: chunked

["달빛곰","픽셀토끼","노을고양이"]
```

:::success
응답 창 첫 줄이 `HTTP/1.1 200 OK`이고 `Content-Type`이 `application/json`이에요. 본문은 이름 3개의 JSON 배열이에요. `Server: Kestrel`은 ASP.NET Core 안에 들어 있는 웹 서버 프로그램의 이름이에요.
:::

### 7단계 · bin, obj를 빼고 Git에 올리기 (4분)

`bin`과 `obj`는 빌드가 만들어 내는 폴더라서 Git에 올리지 않아요. 코드만 있으면 언제든 다시 만들 수 있어서예요. `.gitignore`가 올리지 않을 목록이에요.

**어디서:** VS Code → 탐색기에서 `C:\dev\streamer-hub` 맨 위(`server` 폴더와 같은 줄) 빈 곳을 오른쪽 클릭 → **새 파일**

**무엇을:** 파일 이름을 `.gitignore`(점으로 시작)로 하고 아래 내용을 붙여 넣은 뒤 저장해요. 서버는 켜 두어도 돼요.

📄 C:\dev\streamer-hub\.gitignore
```text
# dotnet 빌드 결과
bin/
obj/
```

이제 다른 터미널을 열어 Git 상태를 봐요(서버가 켜진 터미널 말고 `+` 버튼으로 연 새 터미널).

**어디서:** 새 PowerShell 터미널, 위치 `C:\dev\streamer-hub`

```powershell
cd C:\dev\streamer-hub
```

```powershell
git status
```

예상 출력:

```text
On branch main
Your branch is up to date with 'origin/main'.

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	.gitignore
	server/

nothing added to commit but untracked files present (use "git add" to track)
```

`server/` 폴더 안의 `bin/`, `obj/`가 보이지 않으면 `.gitignore`가 일하고 있다는 뜻이에요. 이제 올려요.

```powershell
git add -A
```

```powershell
git commit -m "day17: 첫 웹 API"
```

예상 출력(해시는 달라요. 줄바꿈 안내 `warning: in the working copy of …, LF will be replaced by CRLF…`가 나와도 무시해도 되는 안내예요):

```text
[main 4ec72cf] day17: 첫 웹 API
 8 files changed, 63 insertions(+)
 create mode 100644 .gitignore
 create mode 100644 server/StreamerHub.Api/Program.cs
 create mode 100644 server/StreamerHub.Api/Properties/launchSettings.json
 create mode 100644 server/StreamerHub.Api/StreamerHub.Api.csproj
 create mode 100644 server/StreamerHub.Api/StreamerHub.Api.http
 create mode 100644 server/StreamerHub.Api/appsettings.Development.json
 create mode 100644 server/StreamerHub.Api/appsettings.json
 create mode 100644 server/StreamerHub.slnx
```

```powershell
git push
```

예상 출력(숫자는 달라도 돼요):

```text
To https://github.com/내아이디/streamer-hub.git
   3f2e1a0..4ec72cf  main -> main
```

:::success
`git push` 마지막 줄이 `main -> main`이에요. `git status`는 `nothing to commit, working tree clean`이에요. 서버를 켠 터미널에서 `Ctrl + C`로 서버를 꺼요.
:::

## ✍️ 과제

세 과제 모두 "해 보고 되돌리기"예요. 끝나면 파일이 오늘 끝 상태 그대로여야 해요.

### 과제 1 · 포트를 5251로 바꿔 켜 보기 (쉬움 ⭐, 6분)

- `launchSettings.json`의 `applicationUrl`을 `http://localhost:5251`로 바꾸고 서버를 다시 켜서 터미널에 찍히는 주소와 `http://localhost:5251/api/streamers`를 확인해요.
- 확인한 뒤 **5250으로 되돌려요**. 5250이 이 교재의 약속된 주소예요.
- 힌트: 바꿀 곳은 `applicationUrl` 한 줄이에요.

### 과제 2 · 한 명 더 넣었다가 빼기 (쉬움 ⭐, 6분)

- `dotnet watch`를 켠 채로 `/api/streamers`의 목록에 `"별빛여우"`를 더해 저장하고, 응답이 4명으로 바뀌는지 `.http`로 확인해요.
- 확인한 뒤 다시 3명으로 되돌려요. 이 목록은 Day 18에서 클래스 목록으로 바뀌어요.

### 과제 3 · 없는 주소 404 확인하기 (쉬움 ⭐, 8분)

- `.http` 파일 맨 아래에 `GET {{host}}/api/nope` 요청을 더해 보내요.
- 응답 첫 줄과 본문을 읽어요. 본문이 비어 있어요. 내용이 있는 오류 응답은 Day 24에서 만들어요.
- 확인한 뒤 그 요청을 지워요.

## ✅ 정답

:::answer 과제 1 정답 · 포트 바꾸기
📄 C:\dev\streamer-hub\server\StreamerHub.Api\Properties\launchSettings.json (일부)
```json
      "applicationUrl": "http://localhost:5251",
```

서버를 `Ctrl + C`로 끈 뒤 `dotnet watch`를 다시 실행하면 터미널에 `Now listening on: http://localhost:5251`이 나와요. 5251에서는 `/api/streamers`가 열리고, 5250에서는 연결이 안 돼요. 확인한 뒤 `5250`으로 되돌리고 서버를 다시 켜요.

**왜 이렇게 하나요?** 포트는 서버를 켤 때 정해요. 코드(`Program.cs`)는 한 글자도 바꾸지 않아도 돼요. `launchSettings.json`이 켜는 방법을 따로 갖고 있어서예요. 같은 포트를 두 서버가 동시에 쓸 수 없어서, 5250이 막히면 포트를 바꾸는 방법도 있지만 이 교재는 5250으로 고정해요(뒤 Day의 설정이 5250을 가정해요).
:::

:::answer 과제 2 정답 · 한 명 더하기
📄 C:\dev\streamer-hub\server\StreamerHub.Api\Program.cs (일부)
```csharp
app.MapGet("/api/streamers", () => new List<string> { "달빛곰", "픽셀토끼", "노을고양이", "별빛여우" });
```

저장하면 `dotnet watch`가 반영하고, `.http`의 두 번째 요청을 다시 보내면 본문이 `["달빛곰","픽셀토끼","노을고양이","별빛여우"]`로 바뀌어요. 확인한 뒤 `, "별빛여우"`를 지우고 저장해요.

**왜 이렇게 하나요?** 응답은 요청이 올 때마다 코드를 실행해서 만들어요. 코드를 고치면 같은 주소에서 다른 결과가 나와요. 서버를 껐다 켜지 않는 것은 `dotnet watch` 덕분이에요.
:::

:::answer 과제 3 정답 · 404 확인
📄 C:\dev\streamer-hub\server\StreamerHub.Api\StreamerHub.Api.http (일부)
```http

### 없는 주소 (404, 본문 없음)
GET {{host}}/api/nope
```

예상 화면:

```text
HTTP/1.1 404 Not Found
Content-Length: 0
Date: Fri, 06 Nov 2026 06:12:00 GMT
Server: Kestrel
```

확인한 뒤 이 두 줄과 앞의 빈 줄을 지우고 저장해요.

**왜 이렇게 하나요?** 연결한 라우트가 없는 주소는 서버가 404로 답해요. 오류 내용을 알려 주는 본문은 없고 `Content-Length: 0`이에요. Day 16에서 본 GitHub Pages의 404와 같은 상태 코드지만 본문은 다르다는 점을 기억해요.
:::

:::answer 오늘 끝 상태 전체 코드
막혔다면 아래 파일들을 같은 내용으로 맞추고 Day 18을 시작하세요. `StreamerHub.Api.csproj`, `appsettings.json`, `appsettings.Development.json`은 템플릿이 만든 그대로 두고, `bin`과 `obj`는 빌드가 만드는 폴더라 직접 만들지 않아요.

```text
C:\dev\streamer-hub\
├─ .git\
├─ .gitignore                          (오늘 새로)
├─ README.md
├─ client\                             (그대로)
└─ server\
   ├─ StreamerHub.slnx                 (오늘 새로)
   └─ StreamerHub.Api\
      ├─ StreamerHub.Api.csproj        (템플릿 그대로)
      ├─ Program.cs                    (오늘 바꿈)
      ├─ appsettings.json              (템플릿 그대로)
      ├─ appsettings.Development.json  (템플릿 그대로)
      ├─ StreamerHub.Api.http          (오늘 새로)
      ├─ Properties\
      │  └─ launchSettings.json        (오늘 바꿈)
      ├─ bin\                          (빌드 결과, 커밋 안 함)
      └─ obj\                          (빌드 중간 파일, 커밋 안 함)
```

📄 C:\dev\streamer-hub\.gitignore
```text
# dotnet 빌드 결과
bin/
obj/
```

📄 C:\dev\streamer-hub\server\StreamerHub.Api\Program.cs
```csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "스트리머 허브 API예요");
app.MapGet("/api/streamers", () => new List<string> { "달빛곰", "픽셀토끼", "노을고양이" });

app.Run();
```

📄 C:\dev\streamer-hub\server\StreamerHub.Api\Properties\launchSettings.json
```json
{
  "$schema": "https://json.schemastore.org/launchsettings.json",
  "profiles": {
    "http": {
      "commandName": "Project",
      "dotnetRunMessages": true,
      "launchBrowser": false,
      "applicationUrl": "http://localhost:5250",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    }
  }
}
```

📄 C:\dev\streamer-hub\server\StreamerHub.Api\StreamerHub.Api.http
```http
# 스트리머 허브 API 요청 연습 파일
# 요청 위의 Send Request를 눌러요. 먼저 서버를 켜 두세요: dotnet watch

@host = http://localhost:5250

### 서버가 살아 있는지 (200)
GET {{host}}/

### 스트리머 이름 목록 (200, JSON 배열)
GET {{host}}/api/streamers
```

오늘 `git push`까지 끝냈다면 `git status`는 `nothing to commit, working tree clean`이에요. 터미널 위치는 `C:\dev\streamer-hub`이고 서버는 꺼 두어도 돼요.
:::

## 🧯 자주 막히는 곳

여기에 없는 증상은 [문제 해결 모음](#/page/troubleshooting)에서 찾아보세요.

### `Failed to bind to address http://127.0.0.1:5250: address already in use.`

```text
fail: Microsoft.Extensions.Hosting.Internal.Host[11]
      Hosting failed to start
      System.IO.IOException: Failed to bind to address http://127.0.0.1:5250: address already in use.
```

**원인:** 5250번 포트를 다른 프로그램이 이미 쓰고 있어요. 대부분 내가 앞서 켜 둔 서버(`dotnet watch`)가 다른 터미널에 남아 있거나, 창만 닫고 서버를 끄지 않은 경우예요. 아래쪽에 이어지는 줄은 컴퓨터마다 달라요(Windows에서는 다른 문장이 나와요).

**해결:**

1. 서버를 켜 둔 다른 터미널이 있으면 그 터미널을 클릭하고 `Ctrl + C`로 꺼요.
2. 터미널을 찾을 수 없으면 PowerShell에서 5250번을 쓰는 프로그램을 찾아요.

```powershell
Get-NetTCPConnection -LocalPort 5250
```

예상 출력(열 이름과 숫자는 달라도 돼요. `OwningProcess` 열의 번호를 기억해요):

```text
LocalAddress LocalPort RemoteAddress RemotePort State  AppliedSetting OwningProcess
------------ --------- ------------- ---------- -----  -------------- -------------
127.0.0.1    5250      0.0.0.0       0          Listen                12345
```

3. 그 번호가 내 서버인지 확인해요. `12345`를 내 번호로 바꿔요.

```powershell
Get-Process -Id 12345
```

`ProcessName` 열이 `StreamerHub.Api` 또는 `dotnet`이면 내가 켠 서버예요.

4. 내 서버가 맞을 때만 꺼요. 모르는 프로그램이면 건드리지 않고 Day 17 과제 1처럼 포트를 바꿔요.

```powershell
Stop-Process -Id 12345
```

5. `dotnet watch`를 다시 실행하면 `Now listening on: http://localhost:5250`이 나와요.

### Windows 보안 경고 창이 떠요

**원인:** 서버를 처음 켜면 Windows 방화벽이 "이 앱이 네트워크를 쓰려고 해요"라고 물어볼 수 있어요. 창 제목은 보통 **Windows 보안 경고**(Windows Defender 방화벽에서 이 앱의 일부 기능을 차단했습니다)이고, 문구는 버전에 따라 조금 달라요. 앱 이름은 `dotnet.exe`나 `StreamerHub.Api.exe`로 보여요.

**해결:** 이 서버는 내 컴퓨터(`localhost`)에서만 쓰기 때문에 **취소**(또는 닫기)해도 동작해요. 허용하려면 **개인 네트워크**만 체크하고 **액세스 허용**을 눌러요(공용 네트워크는 체크하지 않아요). 방화벽을 끄는 일은 하지 않아요. [Day 7](#/day/p2-d07)의 같은 창과 같은 방식이에요.

### 브라우저에 "연결이 비공개로 설정되어 있지 않습니다"가 떠요

**원인:** 주소가 `https://localhost:…`이거나, `launchSettings.json`에 `https` 프로필이 남아 있어요. HTTPS는 컴퓨터가 믿는 개발용 인증서가 있어야 하는데 아직 준비하지 않았어요. 개발용 인증서를 믿게 만드는 명령 `dotnet dev-certs https --trust`가 있다는 것만 알아 두세요. 어떤 일을 하는지는 Day 34에서 배워요.

**해결:** 오늘은 주소를 `http://localhost:5250/…`(맨 앞이 `http`, 끝 `s` 없음)으로 열어요. `launchSettings.json`에서 `"https"` 프로필이 있으면 3단계처럼 지워요.

### `Couldn't find a project to run.`

```text
Couldn't find a project to run. Ensure a project exists in C:\dev\streamer-hub\server, or pass the path to the project using --project.
```

**원인:** `.csproj`가 없는 폴더에서 `dotnet run`을 실행했어요. `server` 폴더에는 솔루션 파일(`.slnx`)만 있어요.

**해결:** `cd C:\dev\streamer-hub\server\StreamerHub.Api`로 옮긴 뒤 다시 실행해요.

### 코드를 고쳤는데 브라우저 결과가 그대로예요

**원인:** `dotnet watch`가 아니라 `dotnet run`으로 켰거나, 저장하지 않았거나(`●` 표시), 새 `MapGet` 줄이라 `Ctrl + R`이 필요한 경우예요.

**해결:** 파일 탭의 저장 안 됨 표시를 확인하고 `Ctrl + S`를 누른 뒤, 안 되면 서버 터미널에서 `Ctrl + R`(또는 `Ctrl + C` 후 `dotnet watch`)을 해요. 브라우저는 `F5`로 새로 고쳐요.

### 터미널을 닫았는데 다음에 포트가 막혀요

**원인:** `Ctrl + C`로 끄지 않고 창만 닫으면 서버가 계속 남아 있을 수 있어요.

**해결:** 위의 "address already in use" 항목의 2~4번으로 찾아서 꺼요. 서버는 항상 `Ctrl + C`로 끄는 습관을 들여요.

## 📝 오늘의 체크리스트

- [ ] `C:\dev\streamer-hub\server`에 `StreamerHub.slnx`와 `StreamerHub.Api` 폴더가 있어요.
- [ ] `launchSettings.json`에 `http` 프로필 하나만 있고 주소가 `http://localhost:5250`이에요.
- [ ] 터미널에 `Now listening on: http://localhost:5250`이 보였어요.
- [ ] 브라우저 `http://localhost:5250/api/streamers`에 `["달빛곰","픽셀토끼","노을고양이"]`가 보여요.
- [ ] `.http`의 두 요청이 `200 OK`로 응답했고, `dotnet watch` 중 저장하면 응답이 바뀌는 것을 봤어요.
- [ ] `git status`에서 `bin`, `obj`가 보이지 않고, `git push`로 올렸어요.
- [ ] 과제 3개를 해 보고 모두 되돌렸어요(포트 5250, 목록 3명, 404 요청 삭제).
- [ ] 서버를 `Ctrl + C`로 껐고, 터미널 위치가 `C:\dev\streamer-hub`이에요.

## 📚 더 알아보기

- [Minimal API 빠른 시작 (Microsoft Learn)](https://learn.microsoft.com/aspnet/core/fundamentals/minimal-apis): `MapGet`으로 엔드포인트를 만드는 방법을 설명한 공식 문서
- [dotnet watch (Microsoft Learn)](https://learn.microsoft.com/aspnet/core/tutorials/dotnet-watch): 파일이 바뀔 때 자동으로 다시 반영하는 명령을 설명한 공식 문서
- [dotnet new 템플릿 (Microsoft Learn)](https://learn.microsoft.com/dotnet/core/tools/dotnet-new-sdk-templates): `web`, `sln` 같은 템플릿 이름 목록을 보여 주는 공식 문서

➡️ **다음 Day 예고:** [Day 18 · 메모리 CRUD API](#/day/p2-d18)에서는 스트리머를 클래스로 만들고 만들기·읽기·고치기·지우기 API를 만들어요.
