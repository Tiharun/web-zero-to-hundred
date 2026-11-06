## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- ORM과 EF Core가 무엇을 해 주는지, 오늘 만드는 `Streamer`·`AppDbContext`·연결 문자열·마이그레이션이 각각 무슨 역할인지 말할 수 있어요.
- `dotnet add package`로 EF Core 패키지를 설치하고, `dotnet tool install --global dotnet-ef`로 도구를 설치할 수 있어요.
- `AppDbContext`를 만들고 `Program.cs`에 연결해서 `dotnet ef migrations add InitialCreate`로 마이그레이션 파일을 만들 수 있어요.
- `dotnet ef database update`로 `streamerhub.db` 파일을 만들고, `sqlite3`로 `Streamers` 테이블이 생긴 것을 확인할 수 있어요.

**예상 시간: 120분** (개념 이해 22분 · 따라하기 80분 · 과제 12분 · 정리 6분)

:::path 📂 시작 상태
[Day 19](#/day/p2-d19)가 끝난 상태예요. 프로젝트 파일은 [Day 18](#/day/p2-d18)의 "오늘 끝 상태 전체 코드" 그대로이고, 오늘 서버 코드를 많이 고쳐요. VS Code는 Day 19에서 `C:\dev\sql-practice`를 열었으니 1단계에서 프로젝트 폴더를 다시 열어요.

- `C:\dev\streamer-hub\README.md`, `C:\dev\streamer-hub\.git\`, `C:\dev\streamer-hub\.gitignore`
- `C:\dev\streamer-hub\client\` 폴더 (그대로)
- `C:\dev\streamer-hub\server\StreamerHub.slnx`
- `C:\dev\streamer-hub\server\StreamerHub.Api\` 폴더: `StreamerHub.Api.csproj`, `Program.cs`, `appsettings.json`, `appsettings.Development.json`, `StreamerHub.Api.http`, `bin\`, `obj\`
- `C:\dev\streamer-hub\server\StreamerHub.Api\Entities\Streamer.cs`
- `C:\dev\streamer-hub\server\StreamerHub.Api\Properties\launchSettings.json`
- `C:\dev\sql-practice\practice.sql`, `practice.db` (Day 19)
- 설치되어 있어야 할 것: .NET 10 SDK(`dotnet --version`이 `10.0.`으로 시작), `sqlite3`(`sqlite3 --version`), Git, REST Client 확장
- 서버(`dotnet watch`)는 꺼 두어요. 켜져 있으면 1단계에서 꺼요. 서버가 켜져 있으면 마이그레이션이 실패할 수 있어요.
:::

## 📖 개념 이해

### ORM: C# 클래스와 DB 테이블 사이의 번역기

**비유부터 볼게요.** 한국어만 하는 나와 영어만 하는 직원 사이에 통역사가 있으면, 나는 한국어로만 말해도 일이 돼요. DB는 SQL 언어를 쓰고 우리는 C# 클래스를 쓰는데, 둘 사이에 통역사를 두면 SQL을 직접 쓰지 않아도 돼요.

**정확한 정의는 이래요.**

- **[[ORM]]**(오알엠, Object-Relational Mapping)은 C# 객체와 DB 테이블의 행을 서로 바꿔 주는 도구예요. `Streamer` 객체를 저장하면 `INSERT` 문으로, 목록을 읽으면 `SELECT` 문으로 알아서 번역해요.
- **[[EF Core]]**(이에프 코어, Entity Framework Core)는 .NET의 대표 ORM이에요. 이 프로젝트는 EF Core와 SQLite 조합으로 DB를 다뤄요.
- **[[NuGet]]**(뉴겟)은 .NET의 패키지 저장소예요. npm이 JavaScript 패키지를 받아 오듯이, NuGet에서 EF Core 같은 라이브러리를 받아요. 프로젝트에 설치한 패키지는 `.csproj`에 `PackageReference` 줄로 기록돼요(`package.json`의 `dependencies`와 같은 역할이에요).

### 오늘 만드는 여섯 가지

```text
Streamer.cs        엔티티: 테이블 한 줄의 모양
AppDbContext.cs    DB로 가는 통로
appsettings.json   연결 문자열: DB가 어디에
Program.cs         AddDbContext: 통로 등록
Migrations\        DB를 만드는 설계 기록
streamerhub.db     SQLite 파일 (결과물)
```

- **[[엔티티]]**(entity)는 DB 테이블의 한 행에 대응하는 C# 클래스예요. Day 18에서 만든 `Streamer`가 엔티티가 돼요. 프로퍼티 이름이 열 이름이 돼요. 이름이 `Id`인 프로퍼티는 EF Core가 알아서 기본 키로 써요.
- 프로퍼티 위의 `[MaxLength(50)]` 같은 꺾쇠 글자는 **특성**(attribute)이라고 해요. 프로퍼티에 붙이는 이름표예요. "이 칸은 50자까지"라는 표시를 붙였어요. 정식 개념은 Day 23에서 배워요.
- **[[DbContext]]**(디비 컨텍스트)는 DB와 이야기하는 통로 클래스예요. `DbContext`를 물려받아(Day 13의 상속) 만들어요. 서버 코드는 이 객체를 통해 읽고 써요.
- **[[DbSet]]**(디비셋)은 `DbContext` 안의 테이블 하나예요. `DbSet<Streamer>`가 `Streamers` 테이블이에요. 목록처럼 LINQ(`Where`, `OrderBy`)를 쓸 수 있어요.
- **[[연결 문자열]]**(connection string)은 "DB가 어디에 있는지" 적은 글자예요. SQLite에서는 `Data Source=streamerhub.db`로 파일 이름을 적어요.
- **[[마이그레이션]]**(migration)은 DB 구조(테이블, 열)를 만들거나 바꾸는 설계 기록이에요. 코드를 보고 EF Core가 파일로 만들어 주고, 그 파일을 DB에 적용해요. 나중에 테이블을 바꿔야 할 때 마이그레이션을 하나 더 만들어요(Day 22, 25, 30, 33).
- **[[dotnet-ef]]**는 마이그레이션을 만들고 적용하는 명령줄 도구예요. `dotnet ef …` 모양으로 써요.

### SQLite 파일은 어디에 생길까요? (중요)

연결 문자열 `Data Source=streamerhub.db`에는 폴더 없이 파일 이름만 있어요. 이렇게 이름만 적은 **상대 경로**는 "프로그램을 실행한 폴더"를 기준으로 해요. 오늘은 항상 `C:\dev\streamer-hub\server\StreamerHub.Api` 폴더에서 명령을 실행하니 그곳에 `streamerhub.db`가 생겨요. 다른 폴더에서 서버를 켜면 그 폴더에 빈 DB가 새로 생길 수 있어서(Day 21부터 눈에 보여요), 서버는 항상 `StreamerHub.Api` 폴더에서 켜요.

:::info 실무에서는
회사에서는 마이그레이션 파일을 Git에 올려서 팀원 모두가 같은 DB 구조를 갖게 해요. 오늘 만들 `Migrations` 폴더의 파일 이름 앞 숫자(`20261106145740`)는 만든 시각이에요. 사람마다 달라서 괜찮아요. DB 파일(`*.db`)은 사용자 데이터라서 Git에 올리지 않고 `.gitignore`에 넣어요.
:::

## 🛠️ 따라하기

9단계예요. 단계가 많지만 한 단계에 한 가지씩이에요.

### 1단계 · 서버 끄고 프로젝트 폴더 열기 (6분)

**어디서:** 서버가 켜져 있던 터미널(있다면), 그리고 PowerShell

**무엇을:**

1. 서버를 켜 둔 터미널이 있으면 그 터미널을 클릭하고 `Ctrl + C`로 꺼요. 프롬프트가 돌아오면 꺼진 거예요. 어디서 켰는지 모르면 새 터미널에서 `Get-NetTCPConnection -LocalPort 5250`을 실행해 아무것도 안 나오는지 확인해요(Day 17).
2. 프로젝트 폴더를 VS Code로 열어요.

```powershell
code C:\dev\streamer-hub
```

3. VS Code 아래쪽 터미널(`` Ctrl + ` ``)에서 서버 프로젝트 폴더로 옮겨요.

```powershell
cd C:\dev\streamer-hub\server\StreamerHub.Api
```

:::success
VS Code 왼쪽 탐색기 제목이 `STREAMER-HUB`이고, 터미널 프롬프트가 `PS C:\dev\streamer-hub\server\StreamerHub.Api>`예요.
:::

### 2단계 · NuGet 패키지 두 개 설치하기 (10분)

**어디서:** VS Code 터미널, 위치 `C:\dev\streamer-hub\server\StreamerHub.Api` (인터넷이 필요해요)

**무엇을:** 두 명령을 차례로 실행해요. 버전을 `10.0.14`로 똑같이 맞춰야 서로 맞지 않는 경고가 없어요.

```powershell
dotnet add package Microsoft.EntityFrameworkCore.Sqlite --version 10.0.14
```

예상 출력(처음이면 패키지를 받는 줄이 더 나와요. 앞쪽 `info : X.509 …` 줄은 없을 수도 있어요):

```text
info : Adding PackageReference for package 'Microsoft.EntityFrameworkCore.Sqlite' into project 'C:\dev\streamer-hub\server\StreamerHub.Api\StreamerHub.Api.csproj'.
info : Restoring packages for C:\dev\streamer-hub\server\StreamerHub.Api\StreamerHub.Api.csproj...
info : Package 'Microsoft.EntityFrameworkCore.Sqlite' is compatible with all the specified frameworks in project 'C:\dev\streamer-hub\server\StreamerHub.Api\StreamerHub.Api.csproj'.
info : PackageReference for package 'Microsoft.EntityFrameworkCore.Sqlite' version '10.0.14' added to file 'C:\dev\streamer-hub\server\StreamerHub.Api\StreamerHub.Api.csproj'.
log  : Restored C:\dev\streamer-hub\server\StreamerHub.Api\StreamerHub.Api.csproj (in 446 ms).
```

```powershell
dotnet add package Microsoft.EntityFrameworkCore.Design --version 10.0.14
```

예상 출력은 위와 같고 패키지 이름만 `Microsoft.EntityFrameworkCore.Design`이에요.

이제 `StreamerHub.Api.csproj`를 열어 보세요. 줄이 생겼어요.

📄 C:\dev\streamer-hub\server\StreamerHub.Api\StreamerHub.Api.csproj
```xml
<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="10.0.14">
      <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
      <PrivateAssets>all</PrivateAssets>
    </PackageReference>
    <PackageReference Include="Microsoft.EntityFrameworkCore.Sqlite" Version="10.0.14" />
  </ItemGroup>

</Project>
```

- `Microsoft.EntityFrameworkCore.Sqlite`는 EF Core가 SQLite와 이야기하는 데 필요한 패키지예요. 앞으로 서버 코드가 이 패키지를 써요.
- `Microsoft.EntityFrameworkCore.Design`은 마이그레이션 도구용 패키지예요. 개발할 때만 쓰고 서버가 실행될 때는 필요 없어서 `PrivateAssets` 표시가 붙어요.

이 파일은 `dotnet add package`가 고쳐 주니 직접 고치지 않아도 돼요. 줄 순서는 달라도 괜찮아요.

:::success
`.csproj`에 `PackageReference` 두 줄이 있고 둘 다 `Version="10.0.14"`예요. `error NU1101: Unable to find package …`가 나오면 인터넷 연결과 패키지 이름 철자를 확인해요.
:::

### 3단계 · dotnet-ef 도구 설치하기 (6분)

**어디서:** VS Code 터미널 (위치는 어디든 괜찮아요)

**무엇을:** 마이그레이션 도구를 컴퓨터 전체(`--global`)에 한 번만 설치해요.

```powershell
dotnet tool install --global dotnet-ef --version 10.0.14
```

예상 출력:

```text
You can invoke the tool using the following command: dotnet-ef
Tool 'dotnet-ef' (version '10.0.14') was successfully installed.
```

이미 설치되어 있으면 `Tool 'dotnet-ef' is already installed.`가 나와요. 그 경우도 괜찮아요.

설치 후 터미널을 닫았다 열면 안정적이에요. 버전을 확인해요.

```powershell
dotnet-ef --version
```

예상 출력:

```text
Entity Framework Core .NET Command-line Tools
10.0.14
```

:::success
두 번째 줄이 `10.0.14`예요. `dotnet-ef`가 인식되지 않으면 터미널(과 VS Code)을 닫고 새로 열어요. 그래도 안 되면 아래 🧯의 첫 항목을 보세요.
:::

### 4단계 · Streamer를 엔티티로 만들기 (8분)

**어디서:** VS Code → `C:\dev\streamer-hub\server\StreamerHub.Api\Entities\Streamer.cs`

**무엇을:** 전체를 지우고 아래 코드를 붙여 넣은 뒤 `Ctrl + S`로 저장해요.

📄 C:\dev\streamer-hub\server\StreamerHub.Api\Entities\Streamer.cs
```csharp
using System.ComponentModel.DataAnnotations;

namespace StreamerHub.Api.Entities;

// 스트리머 한 명 = Streamers 테이블의 한 줄 (Day 20)
public class Streamer
{
    public int Id { get; set; } // 기본 키(PK). 이름이 Id라서 EF Core가 알아서 키로 써요

    [MaxLength(50)]
    public string Name { get; set; } = "";

    // "chzzk" | "youtube" | "soop" | "other" 중 하나
    [MaxLength(20)]
    public string Platform { get; set; } = "other";

    [MaxLength(200)]
    public string ChannelUrl { get; set; } = "";

    [MaxLength(500)]
    public string Bio { get; set; } = "";

    [MaxLength(200)]
    public string? AvatarUrl { get; set; } // ?가 붙으면 비어 있어도(null) 돼요

    public DateTime CreatedAt { get; set; } // 항상 UTC
}
```

바뀐 것은 맨 위 `using` 한 줄과, 글자 프로퍼티 위의 `[MaxLength(숫자)]`예요. `string?`(null 가능)인 `AvatarUrl`만 DB 열이 비워도 되는 열(`NULL`)이 돼요.

:::success
저장 후 빨간 물결 밑줄이 없어요. 터미널에서 `dotnet build`를 실행하면 `0 Warning(s)`, `0 Error(s)`가 나와요.
:::

### 5단계 · AppDbContext 만들기 (10분)

**어디서:** VS Code 왼쪽 탐색기 → `server\StreamerHub.Api` 폴더 오른쪽 클릭 → **새 폴더** `Data`. 그 폴더 오른쪽 클릭 → **새 파일** `AppDbContext.cs`

**무엇을:** 아래 코드를 붙여 넣고 저장해요.

📄 C:\dev\streamer-hub\server\StreamerHub.Api\Data\AppDbContext.cs
```csharp
using Microsoft.EntityFrameworkCore;
using StreamerHub.Api.Entities;

namespace StreamerHub.Api.Data;

// DB와 C#을 이어 주는 통로 (Day 20)
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    // DbSet 하나 = 테이블 하나
    public DbSet<Streamer> Streamers => Set<Streamer>();
}
```

- `AppDbContext : DbContext`는 Day 13의 상속이에요. EF Core의 `DbContext`가 가진 기능을 물려받아요.
- 생성자 `(DbContextOptions<AppDbContext> options) : base(options)`는 "DB 설정(어떤 DB, 어디에)을 받아서 부모 `DbContext`에 그대로 넘겨요"라는 뜻이에요. Day 13에서 배운 `: base(…)`예요.
- `DbSet<Streamer> Streamers => Set<Streamer>();`의 `=>`는 Day 14의 식 본문 프로퍼티예요. 이 줄이 `Streamers` 테이블이 있다는 선언이에요.

:::success
`Data\AppDbContext.cs`가 탐색기에 보이고 빨간 밑줄이 없어요.
:::

### 6단계 · 연결 문자열과 Program.cs 연결하기 (10분)

**어디서:** VS Code → `appsettings.json`

**무엇을:** 전체를 지우고 아래 내용으로 바꾼 뒤 저장해요. 새로 생긴 것은 `ConnectionStrings` 블록이에요. 이름 `Default`는 아래 `Program.cs`와 철자가 같아야 해요.

📄 C:\dev\streamer-hub\server\StreamerHub.Api\appsettings.json
```json
{
  "ConnectionStrings": {
    "Default": "Data Source=streamerhub.db"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

**어디서:** VS Code → `Program.cs`

**무엇을:** 맨 위 `using` 줄들과 `var builder = …` 줄을 아래처럼 바꿔요. 파일의 나머지(`var app = builder.Build();` 아래)는 그대로 둬요.

기존 맨 위 4줄:

```text
using Microsoft.AspNetCore.Http.HttpResults;
using StreamerHub.Api.Entities;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
```

이 5줄을 아래 코드로 통째로 바꿔요.

📄 C:\dev\streamer-hub\server\StreamerHub.Api\Program.cs (일부)
```csharp
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using StreamerHub.Api.Data;
using StreamerHub.Api.Entities;

var builder = WebApplication.CreateBuilder(args);

// 데이터베이스 (Day 20). 연결 문자열은 appsettings.json의 ConnectionStrings:Default
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("Default")));

var app = builder.Build();
```

새로 생긴 `AddDbContext` 두 줄을 읽어 볼게요.

- `builder.Services`는 서버가 쓸 기능을 등록하는 곳이에요. 의존성 주입은 Day 23에서 정식으로 배워요.
- `AddDbContext<AppDbContext>(…)`는 "`AppDbContext`를 서버에서 쓸 수 있게 등록해요"예요.
- `options.UseSqlite(…)`는 "DB는 SQLite예요"라는 뜻이에요. 괄호 안은 `appsettings.json`의 `ConnectionStrings:Default`를 읽어요. 그 값이 `Data Source=streamerhub.db`예요.

오늘 엔드포인트는 아직 메모리 목록을 써요. DB는 Day 21에 연결해요.

:::success
`dotnet build`가 `0 Warning(s)`, `0 Error(s)`로 끝나요. `error CS0246: The type or namespace name 'AppDbContext' could not be found`가 나오면 `using StreamerHub.Api.Data;` 줄이 있는지 확인해요.
:::

### 7단계 · 마이그레이션 만들고 읽기 (12분)

**어디서:** VS Code 터미널, 위치 `C:\dev\streamer-hub\server\StreamerHub.Api` (서버가 꺼져 있어야 해요)

**무엇을:**

1. 마이그레이션을 만들어요. 이름 `InitialCreate`는 "맨 처음 만들기"라는 뜻으로 관례로 써요.

```powershell
dotnet ef migrations add InitialCreate
```

예상 출력:

```text
Build started...
Build succeeded.
Done. To undo this action, use 'ef migrations remove'
```

2. 탐색기에 `Migrations` 폴더가 생겼어요. 파일 세 개가 있어요(앞 숫자는 만든 시각이라 사람마다 달라요).

```text
Migrations\
├─ 20261106145740_InitialCreate.cs
├─ 20261106145740_InitialCreate.Designer.cs
└─ AppDbContextModelSnapshot.cs
```

3. `..._InitialCreate.cs`를 열어 읽어 보세요(고치지 않아요).

📄 C:\dev\streamer-hub\server\StreamerHub.Api\Migrations\20261106145740_InitialCreate.cs
```csharp
using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StreamerHub.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Streamers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Platform = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    ChannelUrl = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Bio = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    AvatarUrl = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Streamers", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Streamers");
        }
    }
}
```

이 파일은 EF Core가 만든 것이라 직접 고치지 않아요(이 책의 기록에는 맨 위에 보이지 않는 글자(BOM)가 있어도 괜찮아요). 읽는 법은 이래요.

- `Up`은 "DB에 적용할 때" 하는 일이에요. `CreateTable`이 Day 19에서 직접 친 `CREATE TABLE`과 같은 일을 해요. 열마다 이름, 자료형(`INTEGER`/`TEXT`), `nullable`이 보여요.
- `Down`은 되돌릴 때 하는 일이에요. 테이블을 지워요(`DropTable`).
- `Id`는 `Sqlite:Autoincrement`라서 `AUTOINCREMENT`와 같고, `AvatarUrl`만 `nullable: true`예요.
- `maxLength: 50`처럼 `[MaxLength]`가 여기 기록돼요. SQLite는 글자 열 길이를 실제로 제한하지 않아서 DB 파일에는 나타나지 않아요. 서버 쪽 검사(Day 23)에서 쓰여요.

4. 만들어진 마이그레이션 목록을 확인해요.

```powershell
dotnet ef migrations list
```

예상 출력:

```text
Build started...
Build succeeded.
20261106145740_InitialCreate (Pending)
```

`(Pending)`은 "아직 DB에 적용하지 않았어요"라는 뜻이에요.

:::success
`Migrations` 폴더에 파일 3개가 있고 `migrations list`에 `…_InitialCreate (Pending)`이 보여요. `Build failed.`가 나오면 아래 🧯 항목을 보세요.
:::

### 8단계 · DB에 적용하고 sqlite3로 확인하기 (10분)

**어디서:** VS Code 터미널, 위치 `C:\dev\streamer-hub\server\StreamerHub.Api`

**무엇을:**

1. 마이그레이션을 적용해요.

```powershell
dotnet ef database update
```

예상 출력(`info:` 줄이 길게 이어져요. 중간은 생략했고, 시각과 번호는 달라요):

```text
Build started...
Build succeeded.
info: Microsoft.EntityFrameworkCore.Migrations[20402]
      Applying migration '20261106145740_InitialCreate'.
info: Microsoft.EntityFrameworkCore.Database.Command[20101]
      Executed DbCommand (0ms) [Parameters=[], CommandType='Text', CommandTimeout='30']
      CREATE TABLE "Streamers" (
          "Id" INTEGER NOT NULL CONSTRAINT "PK_Streamers" PRIMARY KEY AUTOINCREMENT,
          "Name" TEXT NOT NULL,
          "Platform" TEXT NOT NULL,
          "ChannelUrl" TEXT NOT NULL,
          "Bio" TEXT NOT NULL,
          "AvatarUrl" TEXT NULL,
          "CreatedAt" TEXT NOT NULL
      );
Done.
```

마지막 줄이 `Done.`이면 성공이에요. 중간의 `CREATE TABLE` 문은 EF Core가 대신 만든 SQL이에요. Day 19에서 직접 친 문장과 닮았어요.

2. 파일이 생겼는지 봐요.

```powershell
dir *.db
```

예상 출력(날짜와 크기는 달라요):

```text
    Directory: C:\dev\streamer-hub\server\StreamerHub.Api

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a----        2026-11-06   오후 4:30          24576 streamerhub.db
```

3. sqlite3로 열어 테이블을 봐요.

```powershell
sqlite3 streamerhub.db
```

```text
.tables
```

예상 출력(칸 사이 공백 수는 달라도 돼요):

```text
Streamers              __EFMigrationsHistory  __EFMigrationsLock   
```

```text
.schema Streamers
```

예상 출력:

```text
CREATE TABLE IF NOT EXISTS "Streamers" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_Streamers" PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "Platform" TEXT NOT NULL,
    "ChannelUrl" TEXT NOT NULL,
    "Bio" TEXT NOT NULL,
    "AvatarUrl" TEXT NULL,
    "CreatedAt" TEXT NOT NULL
);
```

```text
.quit
```

- `Streamers`가 우리가 만든 테이블이에요.
- `__EFMigrationsHistory`는 EF Core가 "어느 마이그레이션까지 적용했는지" 적어 두는 기록 테이블이에요. `__EFMigrationsLock`은 적용하는 동안 다른 곳에서 동시에 적용하지 못하게 거는 자물쇠 테이블이에요. 둘 다 EF Core가 알아서 관리해요.

:::success
`database update`가 `Done.`으로 끝나고, 같은 폴더에 `streamerhub.db`가 있고, `.schema Streamers`에 `"Name" TEXT NOT NULL`이 보여요. `.quit` 뒤 프롬프트는 다시 `PS C:\dev\streamer-hub\server\StreamerHub.Api>`예요. `streamerhub.db`가 다른 폴더에 생겼다면 아래 🧯의 DB 위치 항목을 보세요.
:::

### 9단계 · DB 파일을 Git에서 빼고 커밋하기 (8분)

`streamerhub.db`는 사용자 데이터라서 Git에 올리지 않아요. `.gitignore`가 올리지 않을 목록이에요.

**어디서:** VS Code → `C:\dev\streamer-hub\.gitignore`

**무엇을:** 전체를 지우고 아래 내용으로 바꾼 뒤 저장해요.

📄 C:\dev\streamer-hub\.gitignore
```text
# SQLite 데이터베이스 파일: 서버를 실행하면 생겨요. 사용자 데이터라서 커밋하지 않아요
*.db
*.db-shm
*.db-wal

# dotnet 빌드 결과
bin/
obj/
```

**어디서:** VS Code 터미널, 위치 `C:\dev\streamer-hub`

```powershell
cd C:\dev\streamer-hub
```

```powershell
git status
```

예상 출력(`streamerhub.db`가 목록에 없어야 해요):

```text
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   .gitignore
	modified:   server/StreamerHub.Api/Entities/Streamer.cs
	modified:   server/StreamerHub.Api/Program.cs
	modified:   server/StreamerHub.Api/StreamerHub.Api.csproj
	modified:   server/StreamerHub.Api/appsettings.json

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	server/StreamerHub.Api/Data/
	server/StreamerHub.Api/Migrations/

no changes added to commit (use "git add" and/or "git commit -a")
```

```powershell
git add -A
```

```powershell
git commit -m "day20: EF Core 연결"
```

예상 출력(해시는 달라요):

```text
[main 5c6d7e8] day20: EF Core 연결
 9 files changed, 215 insertions(+), 2 deletions(-)
 create mode 100644 server/StreamerHub.Api/Data/AppDbContext.cs
 create mode 100644 server/StreamerHub.Api/Migrations/20261106145740_InitialCreate.Designer.cs
 create mode 100644 server/StreamerHub.Api/Migrations/20261106145740_InitialCreate.cs
 create mode 100644 server/StreamerHub.Api/Migrations/AppDbContextModelSnapshot.cs
```

```powershell
git push
```

:::success
`git push` 마지막 줄이 `main -> main`이에요. `git status`는 `nothing to commit, working tree clean`이에요.
:::

## ✍️ 과제

### 과제 1 · 마이그레이션에서 열 정보 찾아 README에 적기 (쉬움 ⭐, 5분)

- `..._InitialCreate.cs`의 `Up` 메서드에서 열 이름, 자료형, 비워도 되는지(`nullable`)를 찾아 README에 표로 적어요.
- 확인: `nullable: true`인 열은 `AvatarUrl` 하나뿐이에요.
- 힌트: README의 `## 개발 환경` 줄 **바로 위**에 새 절을 넣어요.

### 과제 2 · 마이그레이션 목록 보기 (쉬움 ⭐, 2분)

- `dotnet ef migrations list`를 실행해요. 8단계 이후이므로 `(Pending)`이 없어야 해요.
- 확인: `…_InitialCreate` 한 줄이 나와요.

### 과제 3 · README에 버전 기록하기 (쉬움 ⭐, 5분)

- README `## 개발 환경` 목록 맨 아래에 `dotnet --version`과 `dotnet-ef --version` 결과를 적어요.
- 확인: README 미리보기(`Ctrl + Shift + V`)에서 두 줄이 보여요.
- 마지막에 `git add -A`, `git commit -m "day20: README에 DB와 버전 기록"`, `git push`로 올려요(과제 1·3으로 바뀐 README는 이렇게 올리거나, 올리지 않으면 다음 커밋에 포함돼요).

## ✅ 정답

:::answer 과제 1 정답 · Streamers 열 표
📄 C:\dev\streamer-hub\README.md (일부)
```md
## 데이터 모양 (Streamers 테이블)

| 열 | 자료형 | 비워도 되나요? |
|---|---|---|
| Id | INTEGER | 아니요 (기본 키) |
| Name | TEXT | 아니요 |
| Platform | TEXT | 아니요 |
| ChannelUrl | TEXT | 아니요 |
| Bio | TEXT | 아니요 |
| AvatarUrl | TEXT | 예 |
| CreatedAt | TEXT | 아니요 |

```

위 내용은 `## 개발 환경` 줄 바로 위에 붙여 넣어요.

**왜 이렇게 하나요?** `nullable: false`는 비울 수 없는 열이고 `nullable: true`는 `NULL`을 허용하는 열이에요. C#의 `string?`가 `nullable: true`가 돼요. 코드의 타입 표기가 DB 구조로 이어진다는 것을 눈으로 확인하는 연습이에요.
:::

:::answer 과제 2 정답 · migrations list
```powershell
dotnet ef migrations list
```

예상 출력(시각은 달라요):

```text
Build started...
Build succeeded.
20261106145740_InitialCreate
```

**왜 이렇게 하나요?** 적용이 끝난 마이그레이션은 `(Pending)` 표시가 없어요. 마이그레이션을 새로 만들고 아직 적용하지 않으면 그 줄에만 `(Pending)`이 붙어요.
:::

:::answer 과제 3 정답 · 버전 기록
```powershell
dotnet --version
```

```powershell
dotnet-ef --version
```

📄 C:\dev\streamer-hub\README.md (일부)
```md
- .NET SDK: 10.0.403
- dotnet-ef: 10.0.14
```

위 두 줄은 `## 개발 환경` 목록의 마지막 줄 바로 아래에 붙여 넣어요. 숫자는 위 명령으로 나온 내 값으로 적어요(`dotnet --version`은 내 SDK 버전이라 달라도 돼요).

**왜 이렇게 하나요?** 나중에 "그때 내 컴퓨터에서는 되던 것"을 비교하기 쉬워요. 도구 버전이 다르면 같은 코드도 다르게 동작할 수 있어요.
:::

:::answer 오늘 끝 상태 전체 코드
막혔다면 아래 파일들을 같은 내용으로 맞추고 Day 21을 시작하세요. `Migrations` 폴더의 파일 3개는 `dotnet ef migrations add InitialCreate`로 만든 것이라 직접 쓰지 않아요(7단계에서 읽은 파일과 같아요). `streamerhub.db`는 `dotnet ef database update`가 만들어요.

```text
C:\dev\streamer-hub\
├─ .git\
├─ .gitignore                          (오늘 바꿈)
├─ README.md                           (과제로 바뀜)
├─ client\                             (그대로)
└─ server\
   ├─ StreamerHub.slnx
   └─ StreamerHub.Api\
      ├─ StreamerHub.Api.csproj        (오늘 바꿈: 패키지 2개)
      ├─ Program.cs                    (오늘 바꿈: AddDbContext)
      ├─ appsettings.json              (오늘 바꿈: 연결 문자열)
      ├─ appsettings.Development.json  (그대로)
      ├─ StreamerHub.Api.http          (그대로)
      ├─ streamerhub.db                (오늘 생김, 커밋 안 함)
      ├─ Data\
      │  └─ AppDbContext.cs            (오늘 새로)
      ├─ Entities\
      │  └─ Streamer.cs                (오늘 바꿈)
      ├─ Migrations\                   (오늘 생김: 파일 3개)
      ├─ Properties\
      │  └─ launchSettings.json        (그대로)
      ├─ bin\
      └─ obj\
```

📄 C:\dev\streamer-hub\.gitignore
```text
# SQLite 데이터베이스 파일: 서버를 실행하면 생겨요. 사용자 데이터라서 커밋하지 않아요
*.db
*.db-shm
*.db-wal

# dotnet 빌드 결과
bin/
obj/
```

📄 C:\dev\streamer-hub\server\StreamerHub.Api\StreamerHub.Api.csproj
```xml
<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="10.0.14">
      <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
      <PrivateAssets>all</PrivateAssets>
    </PackageReference>
    <PackageReference Include="Microsoft.EntityFrameworkCore.Sqlite" Version="10.0.14" />
  </ItemGroup>

</Project>
```

📄 C:\dev\streamer-hub\server\StreamerHub.Api\appsettings.json
```json
{
  "ConnectionStrings": {
    "Default": "Data Source=streamerhub.db"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

📄 C:\dev\streamer-hub\server\StreamerHub.Api\Entities\Streamer.cs
```csharp
using System.ComponentModel.DataAnnotations;

namespace StreamerHub.Api.Entities;

// 스트리머 한 명 = Streamers 테이블의 한 줄 (Day 20)
public class Streamer
{
    public int Id { get; set; } // 기본 키(PK). 이름이 Id라서 EF Core가 알아서 키로 써요

    [MaxLength(50)]
    public string Name { get; set; } = "";

    // "chzzk" | "youtube" | "soop" | "other" 중 하나
    [MaxLength(20)]
    public string Platform { get; set; } = "other";

    [MaxLength(200)]
    public string ChannelUrl { get; set; } = "";

    [MaxLength(500)]
    public string Bio { get; set; } = "";

    [MaxLength(200)]
    public string? AvatarUrl { get; set; } // ?가 붙으면 비어 있어도(null) 돼요

    public DateTime CreatedAt { get; set; } // 항상 UTC
}
```

📄 C:\dev\streamer-hub\server\StreamerHub.Api\Data\AppDbContext.cs
```csharp
using Microsoft.EntityFrameworkCore;
using StreamerHub.Api.Entities;

namespace StreamerHub.Api.Data;

// DB와 C#을 이어 주는 통로 (Day 20)
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    // DbSet 하나 = 테이블 하나
    public DbSet<Streamer> Streamers => Set<Streamer>();
}
```

`Program.cs`는 Day 18의 "오늘 끝 상태 전체 코드"에서 맨 위 4줄 + `var builder`/`var app` 두 줄만 바뀌었어요. 바뀐 부분은 6단계의 코드 블록 전체이고, `Program.cs`의 `var app = builder.Build();` 아래는 Day 18과 같아요. 그래서 파일 전체를 아래에 다시 실어요.

📄 C:\dev\streamer-hub\server\StreamerHub.Api\Program.cs
```csharp
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using StreamerHub.Api.Data;
using StreamerHub.Api.Entities;

var builder = WebApplication.CreateBuilder(args);

// 데이터베이스 (Day 20). 연결 문자열은 appsettings.json의 ConnectionStrings:Default
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("Default")));

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

📄 C:\dev\streamer-hub\README.md
```md
# 스트리머 허브

좋아하는 스트리머의 방송 일정을 확인하고 팬끼리 이야기를 나누는 웹사이트예요.
TypeScript로 화면을, C#으로 서버를, SQLite로 데이터를 만들어요.

## 만들 화면 7개

1. 홈
2. 스트리머 목록·상세
3. 주간 방송 일정
4. 팬 게시판
5. 로그인·가입
6. 관리자 화면
7. OBS 공지 오버레이

## 기술 스택

| 맡은 일 | 기술 |
|---|---|
| 화면 | TypeScript, Vite |
| 서버 | C#, ASP.NET Core |
| 데이터 | SQLite, EF Core |
| 로그인 | ASP.NET Core Identity |
| 테스트 | xUnit |

## 앞으로 채울 것

- 개발 환경 정리 (Day 2~3)
- 실행 방법
- 테스트와 배포 방법

## 요청 살펴보기

| 이름 | 방법 | 상태 | 종류 |
|---|---|---|---|
| contents.html | GET | 200 | document |
| style.css | GET | 200 | stylesheet |
| videos.json | GET | 200 | fetch |
| nope.html | GET | 404 | document |

404는 서버가 그 주소에는 아무것도 없다고 응답했다는 뜻이에요.

## 화면별 역할

| 화면 | 프론트엔드가 그리는 것 | 백엔드에 물어볼 것 |
|---|---|---|
| 홈 | 큰 소개, 버튼, 목록 틀 | 다가오는 방송, 새 글 |
| 스트리머 | 카드, 검색 칸, 배지 | 목록, 이름 검색, 상세 |
| 방송 일정 | 주간 표, 이전·다음 버튼 | 그 주의 일정 목록 |
| 팬 게시판 | 글 목록, 쪽 번호, 글쓰기 칸 | 글 저장, 글 목록, 지우기 |
| 로그인·가입 | 입력칸, 오류 문장 | 비밀번호 확인, 로그인 여부 |
| 관리자 | 등록·수정 칸, 삭제 버튼 | 관리자 권한 확인, 저장 |
| 공지 오버레이 | 투명 배경, 공지 글자 | 새 공지가 올라왔는지 |

## API 설계

주소 앞의 `/api`는 "화면이 아니라 데이터 주소"라는 표시예요. 지금은 초안이에요.

| 메서드 | 주소 | 누가 | 응답 |
|---|---|---|---|
| GET | /api/streamers?q= | 누구나 | 200 스트리머 목록 |
| GET | /api/streamers/{id} | 누구나 | 200 상세, 없으면 404 |
| POST | /api/streamers | 관리자 | 201, 값이 틀리면 400 |
| PUT, DELETE | /api/streamers/{id} | 관리자 | 204, 없으면 404 |
| GET | /api/schedules?from=&to= | 누구나 | 200 일정 목록 |
| GET | /api/posts?page=1&pageSize=20 | 누구나 | 200 글 목록 |
| GET | /api/posts/{id} | 누구나 | 200 상세, 없으면 404 |
| POST | /api/posts | 로그인 | 201, 로그인 안 하면 401 |
| PUT, DELETE | /api/posts/{id} | 글쓴이 또는 관리자 | 204, 남의 글이면 403 |
| GET | /api/notices/current | 누구나 | 200 최근 공지, 없으면 204 |
| POST | /api/notices | 관리자 | 201 |
| POST | /api/auth/register, /api/auth/login | 누구나 | 가입과 로그인 |
| GET | /api/me | 누구나 | 로그인했으면 200, 아니면 204 |

## 데이터 모양 (Streamers 테이블)

| 열 | 자료형 | 비워도 되나요? |
|---|---|---|
| Id | INTEGER | 아니요 (기본 키) |
| Name | TEXT | 아니요 |
| Platform | TEXT | 아니요 |
| ChannelUrl | TEXT | 아니요 |
| Bio | TEXT | 아니요 |
| AvatarUrl | TEXT | 예 |
| CreatedAt | TEXT | 아니요 |

## 개발 환경

- 운영 체제: Windows 11 (버전 24H2)
- PowerShell: 5.1
- Git: git version 2.56.0.windows.4
- Node.js: v26.13.0
- npm: 11.20.0
- .NET SDK: 10.0.403
- dotnet-ef: 10.0.14
```

README의 버전 숫자는 내 컴퓨터의 값이어도 괜찮아요. 과제까지 마치고 `git push`를 했다면 `git status`는 `nothing to commit, working tree clean`이고, 터미널 위치는 `C:\dev\streamer-hub`, VS Code 폴더는 `C:\dev\streamer-hub`예요.
:::

## 🧯 자주 막히는 곳

여기에 없는 증상은 [문제 해결 모음](#/page/troubleshooting)에서 찾아보세요.

### `Could not execute because the specified command or file was not found.`

```text
Could not execute because the specified command or file was not found.
Possible reasons for this include:
  * You misspelled a built-in dotnet command.
  * You intended to execute a .NET program, but dotnet-ef does not exist.
  * You intended to run a global tool, but a dotnet-prefixed executable with this name could not be found on the PATH.
```

**원인:** `dotnet ef`를 쳤는데 `dotnet-ef` 도구가 설치되지 않았거나, 설치 직전에 열어 둔 터미널이 새 도구 위치를 몰라요. 전역 도구는 `%USERPROFILE%\.dotnet\tools` 폴더에 설치돼요.

**해결:**

1. 3단계의 `dotnet tool install --global dotnet-ef --version 10.0.14`를 다시 실행해요.
2. 터미널과 VS Code를 모두 닫고 새로 열어요.
3. `dotnet-ef --version`이 `10.0.14`를 보여 주면 해결된 거예요.

### `Your startup project 'StreamerHub.Api' doesn't reference Microsoft.EntityFrameworkCore.Design.`

```text
Your startup project 'StreamerHub.Api' doesn't reference Microsoft.EntityFrameworkCore.Design. This package is required for the Entity Framework Core Tools to work. Ensure your startup project is correct, install the package, and try again.
```

**원인:** 2단계의 두 번째 패키지(`Design`)가 설치되지 않았거나, 명령을 `StreamerHub.Api` 폴더가 아닌 곳에서 실행했어요.

**해결:** 터미널 위치가 `C:\dev\streamer-hub\server\StreamerHub.Api`인지 확인하고, 2단계의 `dotnet add package Microsoft.EntityFrameworkCore.Design --version 10.0.14`를 실행해요.

### `Build failed. Use dotnet build to see the errors.`

```text
Build started...
Build failed. Use dotnet build to see the errors.
```

**원인:** 코드에 컴파일 오류가 있어서 `dotnet ef`가 먼저 하는 빌드가 실패했어요. 서버(`dotnet watch`)가 켜져 있으면 파일을 쓰고 있어서(Windows는 실행 중인 프로그램 파일을 덮어쓸 수 없어요) 빌드나 DB 작업이 막힐 수도 있어요.

**해결:** 서버가 켜져 있으면 `Ctrl + C`로 끄고, `dotnet build`를 실행해서 `error CS…` 줄을 읽고 그 줄의 파일을 고쳐요. 오류가 없을 때 `dotnet ef …`를 다시 실행해요.

### `streamerhub.db`가 엉뚱한 곳에 생겼어요 (SQLite 파일 위치)

**원인:** 연결 문자열이 파일 이름만 적은 상대 경로(`Data Source=streamerhub.db`)라서, 명령을 실행한 폴더 기준으로 파일이 생겨요. `C:\dev\streamer-hub`나 `C:\dev\streamer-hub\server`에서 서버를 켜면 그 폴더에 새 DB가 생길 수 있어요.

**해결:**

1. 서버와 `dotnet ef`는 항상 `C:\dev\streamer-hub\server\StreamerHub.Api`에서 실행해요.
2. 엉뚱한 곳에 생긴 `streamerhub.db`는 파일 탐색기에서 파일을 선택해 `Delete`로 지워요(`StreamerHub.Api` 폴더 안의 것은 지우지 않아요).
3. 올바른 폴더에서 `dir *.db`를 실행해 `streamerhub.db`가 한 개 있는지 확인해요.

### `warning NU1605` 같은 패키지 버전 경고

**원인:** `Sqlite`와 `Design` 패키지의 버전이 서로 달라요(예: 하나는 10.0.14, 하나는 다른 값).

**해결:** `StreamerHub.Api.csproj`를 열어 두 `PackageReference`의 `Version`을 모두 `10.0.14`로 맞추고 `dotnet build`를 다시 실행해요.

## 📝 오늘의 체크리스트

- [ ] `StreamerHub.Api.csproj`에 `EntityFrameworkCore.Sqlite`와 `EntityFrameworkCore.Design` 두 줄(`10.0.14`)이 있어요.
- [ ] `dotnet-ef --version`이 `10.0.14`를 보여 줘요.
- [ ] `Data\AppDbContext.cs`와 `Migrations` 폴더(파일 3개)가 있어요.
- [ ] `dotnet ef database update`가 `Done.`으로 끝났어요.
- [ ] `StreamerHub.Api` 폴더에 `streamerhub.db`가 있고 sqlite3 `.tables`에 `Streamers`가 보여요.
- [ ] `git status`에 `streamerhub.db`가 없고, `git push`로 올렸어요.
- [ ] 과제 1~3을 하고 README를 올렸어요(또는 다음 커밋에 포함돼요).
- [ ] 터미널 위치와 VS Code 폴더가 `C:\dev\streamer-hub` 쪽이고 서버는 꺼져 있어요.

## 📚 더 알아보기

- [EF Core 시작하기 (Microsoft Learn)](https://learn.microsoft.com/ef/core/get-started/overview/first-app): EF Core로 DB를 다루는 첫 앱을 만드는 공식 튜토리얼
- [EF Core 마이그레이션 개요 (Microsoft Learn)](https://learn.microsoft.com/ef/core/managing-schemas/migrations/): 마이그레이션을 만들고 적용하는 방법을 설명한 공식 문서
- [EF Core 도구 참조, dotnet ef (Microsoft Learn)](https://learn.microsoft.com/ef/core/cli/dotnet): `dotnet ef migrations`·`database update` 명령 목록을 보여 주는 공식 문서

➡️ **다음 Day 예고:** [Day 21 · DB CRUD](#/day/p2-d21)에서는 메모리 목록을 지우고 Day 18의 CRUD API가 진짜 DB를 읽고 쓰게 바꿔요. 서버를 껐다 켜도 데이터가 남아요.
