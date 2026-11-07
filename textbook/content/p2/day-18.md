## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- CRUD(만들기·읽기·고치기·지우기)와 HTTP 메서드 POST/GET/PUT/DELETE를 짝지어 말할 수 있어요.
- `Streamer` 클래스를 `Entities` 폴더에 만들고, 메모리 목록(`List<Streamer>`)을 저장소로 쓰는 CRUD API 5개를 만들 수 있어요.
- `.http` 파일로 `201 Created`와 `Location` 헤더, `204 No Content`, `404 Not Found`를 직접 확인할 수 있어요.
- 서버를 껐다 켜면 메모리 데이터가 사라지는 것을 보고, 왜 DB가 필요한지 설명할 수 있어요.

**예상 시간: 110분** (개념 이해 22분 · 따라하기 60분 · 과제 20분 · 정리 8분)

:::path 📂 시작 상태
[Day 17](#/day/p2-d17)의 "오늘 끝 상태 전체 코드"가 있어야 해요. 없거나 다르면 그 코드로 먼저 맞춰 주세요.

- `C:\dev\streamer-hub\README.md`, `C:\dev\streamer-hub\.git\`, `C:\dev\streamer-hub\.gitignore`
- `C:\dev\streamer-hub\client\` 폴더 (`.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`, `public\`, `src\`)
- `C:\dev\streamer-hub\server\StreamerHub.slnx`
- `C:\dev\streamer-hub\server\StreamerHub.Api\` 폴더: `StreamerHub.Api.csproj`, `Program.cs`, `appsettings.json`, `appsettings.Development.json`, `StreamerHub.Api.http`, `bin\`, `obj\`
- `C:\dev\streamer-hub\server\StreamerHub.Api\Properties\launchSettings.json` (포트 5250)
- VS Code에서 `C:\dev\streamer-hub` 폴더가 열려 있어요. REST Client 확장이 설치되어 있어요.
- 서버(`dotnet watch`)는 꺼져 있으면 1단계에서 켜요.
:::

## 📖 개념 이해

### CRUD: 데이터를 다루는 네 가지 일

**비유부터 볼게요.** 도서관 사서가 하는 일을 떠올려 보세요. 새 책을 등록하고, 책을 찾아 보여 주고, 정보를 고치고, 폐기해요. 거의 모든 서비스가 이 네 가지로 데이터를 다뤄요.

**정확한 정의는 이래요.** **[[CRUD]]**(크러드)는 데이터를 다루는 네 가지 일, Create(만들기), Read(읽기), Update(고치기), Delete(지우기)의 머리글자예요. Day 16에서 배운 HTTP 메서드와 짝이 있어요.

| CRUD | HTTP 메서드 | 주소 | 성공 응답 |
|---|---|---|---|
| 만들기 | POST | /api/streamers | 201 Created |
| 읽기 | GET | /api/streamers, /api/streamers/3 | 200 OK |
| 고치기 | PUT | /api/streamers/3 | 204 No Content |
| 지우기 | DELETE | /api/streamers/3 | 204 No Content |

### 주소 안의 변수: 라우트 매개변수와 제약

`/api/streamers/3`의 `3`은 스트리머 번호예요. 번호마다 코드를 따로 쓸 수는 없어서 주소에 변수 칸을 만들어요.

- **[[라우트 매개변수]]**(route parameter)는 주소 중간에 `{id}`처럼 중괄호로 적은 변수 칸이에요. 요청 주소 `/api/streamers/3`이 `/api/streamers/{id}` 모양에 들어맞으면 `id`에 `3`이 담겨서 함수의 `id` 매개변수로 와요.
- **[[라우트 제약]]**(route constraint)은 그 칸에 들어갈 값의 조건이에요. `{id:int}`는 "정수만 받아요"라는 뜻이에요. `/api/streamers/abc`처럼 정수가 아닌 주소는 이 라우트에 들어맞지 않아서 404가 돼요.

`/api/streamers?q=곰`의 `?q=곰`은 P1 Day 27에서 배운 쿼리 문자열이에요. 함수에 `string? q` 매개변수를 두면 그 값이 담겨요. 값이 없을 수 있어서 `string?`로 써요.

### 요청 본문이 C# 객체가 되는 모델 바인딩

POST와 PUT은 본문에 JSON을 실어 보내요. 서버 함수에 `Streamer input`이라는 매개변수를 적으면, ASP.NET Core가 JSON을 읽어 `Streamer` 객체를 만들어 넣어 줘요. 이것이 **[[모델 바인딩]]**(model binding)이에요. 어제 배운 직렬화의 반대 방향(JSON → C# 객체)이에요.

- JSON의 칸 이름은 소문자로 시작하는 camelCase(`channelUrl`)예요. C# 프로퍼티는 `ChannelUrl`처럼 대문자로 시작하지만, 서버가 알아서 이름을 맞춰요.
- 요청에 `Content-Type: application/json`이 없으면 서버가 본문을 JSON으로 읽지 않고 **415 Unsupported Media Type**으로 거절해요.

### 응답 만들기: TypedResults와 Results<…>

**[[TypedResults]]**(타입드 리절츠)는 "200 OK로 이 값을", "404를", "201 Created와 새 주소를" 같은 응답을 만드는 도구 모음이에요.

- `TypedResults.Ok(값)` → 200과 JSON 본문
- `TypedResults.Created(주소, 값)` → 201, 본문, 그리고 `Location` 헤더(새로 생긴 자원의 주소)
- `TypedResults.NoContent()` → 204 (본문 없음)
- `TypedResults.NotFound()` → 404

함수는 반환 타입을 하나만 가질 수 있어요. 그런데 "있으면 200, 없으면 404"처럼 결과가 둘 이상이면 `Results<Ok<Streamer>, NotFound>`처럼 **가능한 결과를 꺾쇠 안에 모두 적어요**. 하나만 적고 다른 결과를 돌려주면 컴파일 오류가 나요(아래 🧯 참고). 이렇게 적어 두면 코드만 읽어도 이 함수가 어떤 상태 코드를 줄 수 있는지 알 수 있어요.

:::info 실무에서는
레퍼런스 `Endpoints/StreamerEndpoints.cs`도 같은 모양의 함수 5개예요. 오늘은 모든 코드를 `Program.cs`에 두고, Day 23에서 파일을 나눠요. 또 오늘은 데이터를 메모리 목록에 두는데, 서버를 끄면 사라져요. Day 21에서 이 부분만 DB로 바꿔요.
:::

## 🛠️ 따라하기

7단계예요. 코드를 단계마다 조금씩 더해 가요.

### 1단계 · 서버 켤 준비 (5분)

**어디서:** VS Code → 아래쪽 터미널 (`` Ctrl + ` ``)

**무엇을:**

1. 터미널의 위치를 서버 프로젝트 폴더로 옮겨요.

```powershell
cd C:\dev\streamer-hub\server\StreamerHub.Api
```

아무것도 나오지 않고 프롬프트가 `PS C:\dev\streamer-hub\server\StreamerHub.Api>`로 바뀌어요.

2. 서버를 켜요. 오늘은 코드를 고치면서 계속 켜 둘 거예요.

```powershell
dotnet watch
```

예상 출력(아랫부분만 보면 돼요):

```text
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5250
```

:::success
`Now listening on: http://localhost:5250`이 보여요. 이 터미널은 서버가 쓰고 있어요. 다른 명령은 터미널 패널 오른쪽 위의 `+`로 연 새 터미널에서 쳐요. `address already in use`가 나오면 [Day 17](#/day/p2-d17)의 같은 이름 항목처럼 이미 켜진 서버를 `Ctrl + C`로 꺼요.
:::

### 2단계 · Streamer 클래스 만들기 (8분)

**어디서:** VS Code 왼쪽 탐색기 → `server\StreamerHub.Api` 폴더 이름 줄을 오른쪽 클릭 → **새 폴더**

**무엇을:**

1. 새 폴더 이름을 `Entities`로 해요.
2. `Entities` 폴더를 오른쪽 클릭 → **새 파일**로 `Streamer.cs`를 만들고 아래 코드를 붙여 넣은 뒤 `Ctrl + S`로 저장해요.

📄 C:\dev\streamer-hub\server\StreamerHub.Api\Entities\Streamer.cs
```csharp
namespace StreamerHub.Api.Entities;

// 스트리머 한 명의 정보 (Day 18). 지금은 메모리에만 있고, Day 20에서 DB 테이블이 돼요.
public class Streamer
{
    public int Id { get; set; }
    public string Name { get; set; } = "";

    // "chzzk" | "youtube" | "soop" | "other" 중 하나
    public string Platform { get; set; } = "other";
    public string ChannelUrl { get; set; } = "";
    public string Bio { get; set; } = "";
    public string? AvatarUrl { get; set; } // ?가 붙으면 비어 있어도(null) 돼요
    public DateTime CreatedAt { get; set; } // 항상 UTC
}
```

이 클래스는 Day 12에서 연습 폴더에 만든 `Streamer`와 같은 모양이에요. 네임스페이스는 `StreamerHub.Api.Entities`(프로젝트 이름 + 폴더 이름)예요. 엔티티라는 이름은 Day 20에서 정확히 배워요.

:::success
탐색기에 `Entities\Streamer.cs`가 보이고, 터미널의 `dotnet watch`가 `File updated` 같은 줄을 찍거나 조용해요. 빨간 오류는 없어요.
:::

### 3단계 · 메모리 저장소와 읽기 API 만들기 (12분)

**어디서:** VS Code → `C:\dev\streamer-hub\server\StreamerHub.Api\Program.cs`

**무엇을:** 전체를 지우고 아래 코드를 붙여 넣은 뒤 `Ctrl + S`로 저장해요.

📄 C:\dev\streamer-hub\server\StreamerHub.Api\Program.cs (일부)
```csharp
using Microsoft.AspNetCore.Http.HttpResults;
using StreamerHub.Api.Entities;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// 메모리 저장소: 서버를 끄면 사라져요 (Day 21에서 DB로 바꿔요)
var streamers = new List<Streamer>
{
    new()
    {
        Id = 1,
        Name = "달빛곰",
        Platform = "chzzk",
        ChannelUrl = "https://example.com/moonbear",
        Bio = "밤마다 느긋하게 게임하는 곰이에요. 채팅 환영!",
        CreatedAt = DateTime.UtcNow,
    },
    new()
    {
        Id = 2,
        Name = "픽셀토끼",
        Platform = "youtube",
        ChannelUrl = "https://example.com/pixelrabbit",
        Bio = "도트 그림을 그리면서 이야기 나누는 토끼예요.",
        CreatedAt = DateTime.UtcNow,
    },
    new()
    {
        Id = 3,
        Name = "노을고양이",
        Platform = "soop",
        ChannelUrl = "https://example.com/sunsetcat",
        Bio = "노래와 수다를 좋아하는 고양이예요.",
        CreatedAt = DateTime.UtcNow,
    },
};
var nextId = 4; // 다음에 만들 스트리머의 번호

app.MapGet("/", () => "스트리머 허브 API예요");
app.MapGet("/api/streamers", GetAll);
app.MapGet("/api/streamers/{id:int}", GetById);

app.Run();

// GET /api/streamers → 전체 목록
Ok<List<Streamer>> GetAll()
{
    return TypedResults.Ok(streamers);
}

// GET /api/streamers/3 → 한 명. 없으면 404
Results<Ok<Streamer>, NotFound> GetById(int id)
{
    var streamer = streamers.FirstOrDefault(s => s.Id == id);
    if (streamer is null)
    {
        return TypedResults.NotFound();
    }
    return TypedResults.Ok(streamer);
}
```

코드를 읽어 볼게요.

- 맨 위 `using` 두 줄은 `TypedResults`·`Results<…>`가 있는 곳과 `Streamer`가 있는 곳을 알려 줘요.
- `new() { … }`는 Day 12에서 배운 대상 형식 `new()`와 객체 이니셜라이저예요. 스트리머 3명으로 목록을 채워요.
- `nextId`는 새로 만들 스트리머에게 줄 번호예요. 이미 3명이라 4부터예요.
- `app.MapGet("/api/streamers", GetAll);`처럼 람다 대신 **이름 있는 함수**를 연결해요. 함수는 `app.Run();` 아래에 있어요. 함수를 쓰는 곳 아래에 선언해도 돼요(Day 11).
- `GetById`는 `FirstOrDefault`(Day 14)로 찾고, 없으면 `NotFound()`를 돌려줘요.

이제 브라우저로 확인해요. 서버가 `dotnet watch`로 켜져 있으면 저장하는 순간 반영돼요. 반영이 안 되는 것 같으면 서버 터미널을 클릭하고 `Ctrl + R`을 눌러요.

**어디서:** Chrome 또는 Edge 주소 표시줄

```text
http://localhost:5250/api/streamers/1
```

:::success
화면에 `{"id":1,"name":"달빛곰","platform":"chzzk",…}` 모양의 JSON이 보여요(키 이름이 소문자로 시작하는 camelCase예요). 주소 끝을 `/api/streamers/99`로 바꾸면 빈 화면(404)이 되고, `/api/streamers/abc`도 404예요. 빌드 오류 `error CS…`가 터미널에 나오면 아래 🧯 자주 막히는 곳을 보세요.
:::

### 4단계 · POST로 새 스트리머 만들기 (10분)

**어디서:** VS Code → `Program.cs`

**무엇을:**

1. `app.MapGet("/api/streamers/{id:int}", GetById);` 줄 **바로 아래**에 한 줄을 끼워 넣어요.

📄 C:\dev\streamer-hub\server\StreamerHub.Api\Program.cs (일부)
```csharp
app.MapPost("/api/streamers", Create);
```

2. 파일 **맨 아래**(마지막 `}` 줄 아래)에 빈 줄을 하나 두고 아래 함수를 붙여 넣어요.

📄 C:\dev\streamer-hub\server\StreamerHub.Api\Program.cs (일부)
```csharp

// POST /api/streamers → 새로 만들기. 201 + Location 헤더
Created<Streamer> Create(Streamer input)
{
    input.Id = nextId;
    nextId++;
    input.CreatedAt = DateTime.UtcNow; // 시각은 서버가 정해요
    streamers.Add(input);
    return TypedResults.Created($"/api/streamers/{input.Id}", input);
}
```

3. `Ctrl + S`로 저장하고, 서버 터미널을 클릭해 `Ctrl + R`을 눌러 다시 시작해요(새 `MapPost` 줄이 생겼기 때문이에요).

- `Streamer input` 매개변수가 요청 본문 JSON으로 채워져요(모델 바인딩).
- 번호(`Id`)와 만든 시각(`CreatedAt`)은 클라이언트가 보낸 값을 믿지 않고 서버가 정해요.
- `TypedResults.Created(주소, 값)`이 201과 `Location` 헤더를 만들어요. `$"/api/streamers/{input.Id}"`는 Day 10의 문자열 보간이에요.

**어디서:** VS Code → `StreamerHub.Api.http`

**무엇을:** 파일 맨 아래에 빈 줄을 하나 두고 두 요청을 붙여 넣어요(`Content-Type` 줄 아래 빈 줄을 지우지 마세요).

📄 C:\dev\streamer-hub\server\StreamerHub.Api\StreamerHub.Api.http (일부)
```http

### 스트리머 한 명 (200)
GET {{host}}/api/streamers/1

### 새 스트리머 만들기 (201 Created + Location)
POST {{host}}/api/streamers
Content-Type: application/json

{
  "name": "별빛여우",
  "platform": "chzzk",
  "channelUrl": "https://example.com/starfox",
  "bio": "별을 보며 이야기하는 여우예요."
}
```

**POST 요청 위의 Send Request**를 한 번만 눌러요.

예상 화면(시각과 헤더 순서는 달라도 돼요):

```text
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
Date: Fri, 06 Nov 2026 06:51:10 GMT
Server: Kestrel
Location: /api/streamers/4
Transfer-Encoding: chunked

{"id":4,"name":"별빛여우","platform":"chzzk","channelUrl":"https://example.com/starfox","bio":"별을 보며 이야기하는 여우예요.","avatarUrl":null,"createdAt":"2026-11-06T06:51:10.5990586Z"}
```

:::success
첫 줄이 `201 Created`이고 `Location: /api/streamers/4` 헤더가 있고, 본문에 `"id":4`가 들어 있어요. 요청을 두 번 보내면 5번이 만들어지니 한 번만 보내요. 이미 두 번 보냈다면 5단계의 4를 5로 바꿔도 돼요.
:::

### 5단계 · PUT과 DELETE 만들기 (10분)

**어디서:** VS Code → `Program.cs`

**무엇을:**

1. `app.MapPost("/api/streamers", Create);` 줄 **바로 아래**에 두 줄을 끼워 넣어요.

📄 C:\dev\streamer-hub\server\StreamerHub.Api\Program.cs (일부)
```csharp
app.MapPut("/api/streamers/{id:int}", Update);
app.MapDelete("/api/streamers/{id:int}", Delete);
```

2. 파일 **맨 아래**에 빈 줄을 하나 두고 두 함수를 붙여 넣어요.

📄 C:\dev\streamer-hub\server\StreamerHub.Api\Program.cs (일부)
```csharp

// PUT /api/streamers/3 → 고치기. 성공하면 204, 없으면 404
Results<NoContent, NotFound> Update(int id, Streamer input)
{
    var streamer = streamers.FirstOrDefault(s => s.Id == id);
    if (streamer is null)
    {
        return TypedResults.NotFound();
    }

    streamer.Name = input.Name;
    streamer.Platform = input.Platform;
    streamer.ChannelUrl = input.ChannelUrl;
    streamer.Bio = input.Bio;
    streamer.AvatarUrl = input.AvatarUrl;
    return TypedResults.NoContent();
}

// DELETE /api/streamers/3 → 지우기. 성공하면 204, 없으면 404
Results<NoContent, NotFound> Delete(int id)
{
    var streamer = streamers.FirstOrDefault(s => s.Id == id);
    if (streamer is null)
    {
        return TypedResults.NotFound();
    }

    streamers.Remove(streamer);
    return TypedResults.NoContent();
}
```

3. 저장하고 서버 터미널에서 `Ctrl + R`을 눌러요.

`Update`는 주소의 `id`와 본문의 `input`을 둘 다 받아요. 찾은 객체의 값을 바꾸기만 해도 목록 안의 그 객체가 바뀌어요. `Id`와 `CreatedAt`은 바꾸지 않아요.

**어디서:** VS Code → `StreamerHub.Api.http` 맨 아래

**무엇을:** 빈 줄을 하나 두고 아래 요청들을 붙여 넣어요.

📄 C:\dev\streamer-hub\server\StreamerHub.Api\StreamerHub.Api.http (일부)
```http

### 4번 고치기 (204 No Content)
PUT {{host}}/api/streamers/4
Content-Type: application/json

{
  "name": "별빛여우",
  "platform": "youtube",
  "channelUrl": "https://example.com/starfox",
  "bio": "소개를 고쳤어요."
}

### 4번 지우기 (204 No Content)
DELETE {{host}}/api/streamers/4

### 지운 4번 다시 보기 (404)
GET {{host}}/api/streamers/4

### 숫자가 아닌 id (404)
GET {{host}}/api/streamers/abc
```

:::success
`PUT` 요청의 응답 첫 줄이 `HTTP/1.1 204 No Content`예요(본문이 없어요). 이어서 `DELETE`도 `204`, 지운 뒤의 `GET .../4`와 `abc`는 `404 Not Found`예요. PUT이 잘 됐는지 보고 싶으면 DELETE를 보내기 전에 `GET {{host}}/api/streamers/4`를 보내서 `소개를 고쳤어요.`가 보이는지 확인해요.
:::

### 6단계 · 서버를 껐다 켜서 데이터가 사라지는 것 보기 (8분)

**어디서:** VS Code 서버 터미널 (`dotnet watch`가 켜진 곳)

**무엇을:**

1. 4단계의 POST 요청을 한 번 더 보내 새 스트리머를 만들어요(번호는 5나 4예요). `GET {{host}}/api/streamers`로 4명이 보이는지 확인해요.
2. 서버 터미널을 클릭하고 `Ctrl + C`로 서버를 꺼요. 프롬프트가 돌아와요.
3. 다시 켜요.

```powershell
dotnet watch
```

4. `GET {{host}}/api/streamers`를 다시 보내요.

:::success
서버를 다시 켠 뒤의 응답에는 처음 있던 3명만 보여요. 방금 만든 스트리머가 사라졌어요. 목록이 메모리에만 있어서 서버를 끄면 같이 없어져요. 코드를 저장해서 `dotnet watch`가 서버를 다시 시작할 때도 마찬가지예요. 이 불편함을 해결하려고 Day 19에서 DB를 배워요.
:::

### 7단계 · 커밋하기 (7분)

**어디서:** VS Code 새 터미널 (`+` 버튼), 위치 `C:\dev\streamer-hub`

**무엇을:**

```powershell
cd C:\dev\streamer-hub
```

```powershell
git status
```

예상 출력(`bin/`, `obj/`가 보이지 않아야 해요):

```text
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   server/StreamerHub.Api/Program.cs
	modified:   server/StreamerHub.Api/StreamerHub.Api.http

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	server/StreamerHub.Api/Entities/

no changes added to commit (use "git add" and/or "git commit -a")
```

```powershell
git add -A
```

```powershell
git commit -m "day18: 메모리 CRUD API"
```

예상 출력(해시와 숫자는 달라요):

```text
[main 7a1b2c3] day18: 메모리 CRUD API
 3 files changed, 157 insertions(+), 1 deletion(-)
 create mode 100644 server/StreamerHub.Api/Entities/Streamer.cs
```

```powershell
git push
```

:::success
`git push` 마지막 줄이 `main -> main`이에요. 서버를 켠 터미널은 과제를 하는 동안 그대로 두어도 돼요. 과제를 마치면 서버를 `Ctrl + C`로 꺼요.
:::

## ✍️ 과제

### 과제 1 · 이름으로 검색하기 (보통 ⭐⭐, 8분)

- `GET /api/streamers?q=곰`이 이름에 `곰`이 들어간 스트리머만 돌려주게 해요. `q`가 없거나 비어 있으면 전부 돌려줘요.
- 영어 이름도 대소문자 구별 없이 찾도록 `ToLower()`를 써요.
- `.http` 파일에 `GET {{host}}/api/streamers?q=곰` 요청을 더해서 달빛곰 1명이 오는지 확인해요.
- 힌트: `GetAll`의 매개변수를 `string? q`로 바꾸고, `streamers.Where(…)`(Day 14)를 써요.

### 과제 2 · 없는 id에 PUT 보내기 (쉬움 ⭐, 5분)

- `.http`에서 `PUT {{host}}/api/streamers/99`를 보내 `404 Not Found`가 오는지 확인해요(본문은 4번 PUT과 같게 써도 돼요).
- 힌트: `FirstOrDefault`가 `null`을 돌려주면 `Update`가 `NotFound()`로 가요. 확인한 뒤 이 요청은 지워요.

### 과제 3 · 본문의 createdAt은 무시된다 (쉬움 ⭐, 7분)

- POST 본문에 `"createdAt": "2000-01-01T00:00:00Z"`을 일부러 넣어 보내요.
- 응답의 `createdAt`이 2000년이 아니라 지금 시각인지 확인해요. 확인한 뒤 그 줄은 지워요.

**과제 후 커밋:** 과제 1이 `Program.cs`와 `.http`를 바꿨어요. 세 과제를 마친 뒤 서버를 `Ctrl + C`로 끄고, 새 터미널(위치 `C:\dev\streamer-hub`)에서 `git add -A` → `git commit -m "day18: 이름 검색 과제"` → `git push`로 한 번 더 올려요. 그러면 Day 19의 시작 상태(서버 꺼짐, `git status`가 깨끗함)와 같아져요.

## ✅ 정답

:::answer 과제 1 정답 · 이름 검색
`Program.cs`의 `GetAll` 함수(주석 포함)를 통째로 아래로 바꿔요.

📄 C:\dev\streamer-hub\server\StreamerHub.Api\Program.cs (일부)
```csharp
// GET /api/streamers?q=곰 → 이름에 검색어가 들어간 스트리머. q가 없으면 전부
Ok<List<Streamer>> GetAll(string? q)
{
    if (string.IsNullOrWhiteSpace(q))
    {
        return TypedResults.Ok(streamers);
    }

    var keyword = q.Trim().ToLower();
    var found = streamers.Where(s => s.Name.ToLower().Contains(keyword)).ToList();
    return TypedResults.Ok(found);
}
```

📄 C:\dev\streamer-hub\server\StreamerHub.Api\StreamerHub.Api.http (일부)
```http

### 이름으로 검색 (200, 달빛곰 1명)
GET {{host}}/api/streamers?q=곰
```

예상 응답 본문: 달빛곰 하나만 들어 있는 JSON 배열(`[{"id":1,"name":"달빛곰",…}]`).

**왜 이렇게 하나요?** `string.IsNullOrWhiteSpace`는 `null`이거나 빈칸뿐이면 `true`예요. 그때는 전부 돌려줘요. 검색어와 이름을 모두 `ToLower()`로 바꿔 비교해서 `Bear`와 `bear`가 같게 만들어요. 이 규칙은 레퍼런스 `StreamerEndpoints.GetAll`과 같아요.
:::

:::answer 과제 2 정답 · 없는 id에 PUT
📄 C:\dev\streamer-hub\server\StreamerHub.Api\StreamerHub.Api.http (일부)
```http

### 없는 99번 고치기 (404)
PUT {{host}}/api/streamers/99
Content-Type: application/json

{
  "name": "없는 사람",
  "platform": "other",
  "channelUrl": "https://example.com/none",
  "bio": "없는 스트리머"
}
```

예상 화면의 첫 줄: `HTTP/1.1 404 Not Found`. 확인한 뒤 이 요청 블록은 지워요.

**왜 이렇게 하나요?** `Update`는 먼저 `FirstOrDefault`로 찾고, 없으면 바로 `NotFound()`를 돌려줘요. 없는 데이터를 고치려는 요청은 새로 만들지 않고 404로 알려 줘요.
:::

:::answer 과제 3 정답 · createdAt 덮어쓰기
📄 C:\dev\streamer-hub\server\StreamerHub.Api\StreamerHub.Api.http (일부)
```http

### createdAt을 보내도 서버가 덮어써요 (201)
POST {{host}}/api/streamers
Content-Type: application/json

{
  "name": "시험 스트리머",
  "platform": "other",
  "channelUrl": "https://example.com/test",
  "bio": "시각 시험",
  "createdAt": "2000-01-01T00:00:00Z"
}
```

예상 응답 본문의 `createdAt`은 `2000-01-01…`이 아니라 지금 시각(`2026-11-06T…Z` 같은 값)이에요. 확인한 뒤 이 요청 블록은 지워요. 만들어진 스트리머는 서버를 껐다 켜면 사라져요.

**왜 이렇게 하나요?** `Create` 함수의 `input.CreatedAt = DateTime.UtcNow;`가 클라이언트가 보낸 값을 덮어써요. 클라이언트가 보낸 값은 믿을 수 없어서, 서버가 정해야 하는 값(번호, 만든 시각)은 서버가 정해요. 이 원칙은 Day 23의 요청 DTO에서 더 분명해져요.
:::

:::answer 오늘 끝 상태 전체 코드
막혔다면 아래 파일 3개를 같은 내용으로 맞추고 Day 19를 시작하세요. `StreamerHub.Api.http`의 과제 확인용 요청(99번 PUT, createdAt 시험)은 지워진 상태예요.

```text
C:\dev\streamer-hub\server\StreamerHub.Api\
├─ StreamerHub.Api.csproj        (그대로)
├─ Program.cs                    (오늘 바꿈)
├─ appsettings.json              (그대로)
├─ appsettings.Development.json  (그대로)
├─ StreamerHub.Api.http          (오늘 바꿈)
├─ Entities\
│  └─ Streamer.cs                (오늘 새로)
├─ Properties\
│  └─ launchSettings.json        (그대로)
├─ bin\                          (빌드 결과)
└─ obj\                          (빌드 중간 파일)
```

📄 C:\dev\streamer-hub\server\StreamerHub.Api\Entities\Streamer.cs
```csharp
namespace StreamerHub.Api.Entities;

// 스트리머 한 명의 정보 (Day 18). 지금은 메모리에만 있고, Day 20에서 DB 테이블이 돼요.
public class Streamer
{
    public int Id { get; set; }
    public string Name { get; set; } = "";

    // "chzzk" | "youtube" | "soop" | "other" 중 하나
    public string Platform { get; set; } = "other";
    public string ChannelUrl { get; set; } = "";
    public string Bio { get; set; } = "";
    public string? AvatarUrl { get; set; } // ?가 붙으면 비어 있어도(null) 돼요
    public DateTime CreatedAt { get; set; } // 항상 UTC
}
```

📄 C:\dev\streamer-hub\server\StreamerHub.Api\Program.cs
```csharp
using Microsoft.AspNetCore.Http.HttpResults;
using StreamerHub.Api.Entities;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// 메모리 저장소: 서버를 끄면 사라져요 (Day 21에서 DB로 바꿔요)
var streamers = new List<Streamer>
{
    new()
    {
        Id = 1,
        Name = "달빛곰",
        Platform = "chzzk",
        ChannelUrl = "https://example.com/moonbear",
        Bio = "밤마다 느긋하게 게임하는 곰이에요. 채팅 환영!",
        CreatedAt = DateTime.UtcNow,
    },
    new()
    {
        Id = 2,
        Name = "픽셀토끼",
        Platform = "youtube",
        ChannelUrl = "https://example.com/pixelrabbit",
        Bio = "도트 그림을 그리면서 이야기 나누는 토끼예요.",
        CreatedAt = DateTime.UtcNow,
    },
    new()
    {
        Id = 3,
        Name = "노을고양이",
        Platform = "soop",
        ChannelUrl = "https://example.com/sunsetcat",
        Bio = "노래와 수다를 좋아하는 고양이예요.",
        CreatedAt = DateTime.UtcNow,
    },
};
var nextId = 4; // 다음에 만들 스트리머의 번호

app.MapGet("/", () => "스트리머 허브 API예요");
app.MapGet("/api/streamers", GetAll);
app.MapGet("/api/streamers/{id:int}", GetById);
app.MapPost("/api/streamers", Create);
app.MapPut("/api/streamers/{id:int}", Update);
app.MapDelete("/api/streamers/{id:int}", Delete);

app.Run();

// GET /api/streamers?q=곰 → 이름에 검색어가 들어간 스트리머. q가 없으면 전부
Ok<List<Streamer>> GetAll(string? q)
{
    if (string.IsNullOrWhiteSpace(q))
    {
        return TypedResults.Ok(streamers);
    }

    var keyword = q.Trim().ToLower();
    var found = streamers.Where(s => s.Name.ToLower().Contains(keyword)).ToList();
    return TypedResults.Ok(found);
}

// GET /api/streamers/3 → 한 명. 없으면 404
Results<Ok<Streamer>, NotFound> GetById(int id)
{
    var streamer = streamers.FirstOrDefault(s => s.Id == id);
    if (streamer is null)
    {
        return TypedResults.NotFound();
    }
    return TypedResults.Ok(streamer);
}

// POST /api/streamers → 새로 만들기. 201 + Location 헤더
Created<Streamer> Create(Streamer input)
{
    input.Id = nextId;
    nextId++;
    input.CreatedAt = DateTime.UtcNow; // 시각은 서버가 정해요
    streamers.Add(input);
    return TypedResults.Created($"/api/streamers/{input.Id}", input);
}

// PUT /api/streamers/3 → 고치기. 성공하면 204, 없으면 404
Results<NoContent, NotFound> Update(int id, Streamer input)
{
    var streamer = streamers.FirstOrDefault(s => s.Id == id);
    if (streamer is null)
    {
        return TypedResults.NotFound();
    }

    streamer.Name = input.Name;
    streamer.Platform = input.Platform;
    streamer.ChannelUrl = input.ChannelUrl;
    streamer.Bio = input.Bio;
    streamer.AvatarUrl = input.AvatarUrl;
    return TypedResults.NoContent();
}

// DELETE /api/streamers/3 → 지우기. 성공하면 204, 없으면 404
Results<NoContent, NotFound> Delete(int id)
{
    var streamer = streamers.FirstOrDefault(s => s.Id == id);
    if (streamer is null)
    {
        return TypedResults.NotFound();
    }

    streamers.Remove(streamer);
    return TypedResults.NoContent();
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

### 스트리머 한 명 (200)
GET {{host}}/api/streamers/1

### 새 스트리머 만들기 (201 Created + Location)
POST {{host}}/api/streamers
Content-Type: application/json

{
  "name": "별빛여우",
  "platform": "chzzk",
  "channelUrl": "https://example.com/starfox",
  "bio": "별을 보며 이야기하는 여우예요."
}

### 4번 고치기 (204 No Content)
PUT {{host}}/api/streamers/4
Content-Type: application/json

{
  "name": "별빛여우",
  "platform": "youtube",
  "channelUrl": "https://example.com/starfox",
  "bio": "소개를 고쳤어요."
}

### 4번 지우기 (204 No Content)
DELETE {{host}}/api/streamers/4

### 지운 4번 다시 보기 (404)
GET {{host}}/api/streamers/4

### 숫자가 아닌 id (404)
GET {{host}}/api/streamers/abc

### 이름으로 검색 (200, 달빛곰 1명)
GET {{host}}/api/streamers?q=곰
```

커밋과 푸시까지 끝냈다면 `git status`는 `nothing to commit, working tree clean`이에요. 터미널 위치는 `C:\dev\streamer-hub`이에요.
:::

## 🧯 자주 막히는 곳

여기에 없는 증상은 [문제 해결 모음](#/page/troubleshooting)에서 찾아보세요.

### POST를 보냈더니 `415 Unsupported Media Type`이 와요

```text
HTTP/1.1 415 Unsupported Media Type
Content-Length: 0
```

**원인:** 요청에 `Content-Type: application/json` 헤더가 없어서 서버가 본문을 JSON으로 읽지 않아요. 서버는 JSON이라고 알려 준 본문만 `Streamer` 객체로 바꿔요.

**해결:** `.http`에서 요청 줄(`POST …`) 바로 아래에 `Content-Type: application/json` 줄을 쓰고, 그 아래에 **빈 줄 하나**를 둔 다음 JSON을 써요. 오타(`Content-type: json`)도 확인해요. 나중에 서버를 배포용으로 바꾸면(Day 38) 같은 실수가 415 대신 404로 보일 수 있어요. 어느 쪽이든 요청이 처리되지 않았다는 뜻이니 `Content-Type` 줄부터 확인해요.

### `error CS0029: Cannot implicitly convert type '…NotFound' to '…Ok<…>'`

```text
C:\dev\streamer-hub\server\StreamerHub.Api\Program.cs(67,16): error CS0029: Cannot implicitly convert type 'Microsoft.AspNetCore.Http.HttpResults.NotFound' to 'Microsoft.AspNetCore.Http.HttpResults.Ok<StreamerHub.Api.Entities.Streamer>'
```

**원인:** 함수의 반환 타입이 `Ok<Streamer>`뿐인데 `TypedResults.NotFound()`도 돌려주려 했어요. 함수는 반환 타입 하나만 가질 수 있고, 가능한 결과가 둘 이상이면 모두 적어야 해요. (비슷한 문제를 람다로 쓰면 `error CS1678`/`CS1661`처럼 델리게이트 타입을 추론하지 못했다는 오류가 나요. 줄 번호와 경로는 사람마다 달라요.)

**해결:** 반환 타입을 `Results<Ok<Streamer>, NotFound>`처럼 돌려줄 수 있는 결과를 모두 넣어 바꿔요. 코드 맨 위에 `using Microsoft.AspNetCore.Http.HttpResults;`가 있는지도 확인해요.

### `/api/streamers/abc`가 404예요. 맞나요?

**원인:** 맞아요. `{id:int}`는 정수만 받으라는 제약이라서, `abc`는 이 라우트에 들어맞지 않고 어떤 라우트에도 맞지 않아서 404가 돼요. 제약(`:int`)을 빼고 `{id}`로 쓰면 `abc`는 `int id`로 바꿀 수 없어서 400이 나와요.

**해결:** 의도한 동작이에요. 숫자 id로 요청해요.

### 서버를 껐다 켰더니 만든 데이터가 사라졌어요

**원인:** 데이터가 메모리 목록(`List<Streamer>`)에만 있어서 서버가 꺼지면 같이 사라져요. `dotnet watch`가 코드를 저장할 때 서버를 다시 시작해도 마찬가지예요.

**해결:** 정상이에요. 데이터를 남기려면 DB가 필요하고 Day 19~21에서 배워요.

### 코드를 저장했는데 새 주소가 404예요

**원인:** `app.MapPost(…)` 같은 새 `Map…` 줄은 서버가 켜질 때 한 번 실행돼서 `dotnet watch`가 바로 반영하지 못할 수 있어요.

**해결:** 서버 터미널을 클릭하고 `Ctrl + R`(다시 시작)을 눌러요. 안 되면 `Ctrl + C`로 끄고 `dotnet watch`를 다시 실행해요.

## 📝 오늘의 체크리스트

- [ ] `Entities\Streamer.cs`가 있고 `Program.cs`에 `MapGet` 3개, `MapPost`, `MapPut`, `MapDelete`가 있어요.
- [ ] POST 응답이 `201 Created`이고 `Location: /api/streamers/4` 헤더가 있어요.
- [ ] PUT과 DELETE가 `204 No Content`, 지운 뒤 다시 읽기와 `abc`가 `404`예요.
- [ ] 서버를 껐다 켰더니 새로 만든 스트리머가 사라지는 것을 봤어요.
- [ ] 과제 1(`?q=곰` 달빛곰 1명), 과제 2(99번 PUT 404), 과제 3(createdAt 덮어쓰기)을 확인했어요.
- [ ] `git status`에 `bin`·`obj`가 없고 `git push`로 올렸어요. 터미널 위치는 `C:\dev\streamer-hub`이에요.

## 📚 더 알아보기

- [Minimal API 앱 만들기 (Microsoft Learn)](https://learn.microsoft.com/aspnet/core/tutorials/min-web-api): 간단한 CRUD Minimal API를 만드는 공식 튜토리얼
- [Minimal API의 응답 만들기 (Microsoft Learn)](https://learn.microsoft.com/aspnet/core/fundamentals/minimal-apis/responses): `TypedResults`와 `Results<…>` 사용법을 설명한 공식 문서
- [라우팅 제약 (Microsoft Learn)](https://learn.microsoft.com/aspnet/core/fundamentals/routing#route-constraints): `{id:int}` 같은 제약의 종류를 보여 주는 공식 문서

➡️ **다음 Day 예고:** [Day 19 · DB와 SQL 기초](#/day/p2-d19)에서는 서버를 꺼도 데이터가 남도록, 데이터베이스와 SQL을 연습용 파일로 먼저 배워요.
