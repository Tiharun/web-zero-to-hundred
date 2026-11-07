## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- 람다 식(`s => s.Name`)을 읽고 쓸 수 있고, P1의 화살표 함수와 같은 생각이라는 것을 설명할 수 있어요.
- LINQ의 `Where`, `Select`, `OrderBy`, `First`/`FirstOrDefault`, `Any`, `Count`, `Skip`/`Take`, `ToList`로 목록을 거르고 정렬하고 잘라 낼 수 있어요.
- JavaScript의 `filter`, `map`, `sort`가 C#의 `Where`, `Select`, `OrderBy`와 짝이라는 것을 표로 말할 수 있어요.
- `=>`로 쓰는 식 본문 프로퍼티(`public string Label => …;`)를 만들 수 있어요.

**예상 시간: 90분** (개념 이해 15분 · 따라하기 53분 · 과제 15분 · 정리 7분)

:::path 📂 시작 상태
[Day 13](#/day/p2-d13)의 "오늘 끝 상태 전체 코드"가 있어야 해요. 없거나 다르면 그 코드로 먼저 맞춰 주세요. 오늘도 연습 폴더 `C:\dev\cs-practice`만 써요. `Program.cs`는 1단계에서 통째로 바꿔요.

- `C:\dev\cs-practice\HubConsole.csproj`
- `C:\dev\cs-practice\Program.cs`
- `C:\dev\cs-practice\Streamer.cs`, `Schedule.cs`, `StreamerCard.cs` ([Day 12](#/day/p2-d12))
- `C:\dev\cs-practice\Users.cs`, `Notifiers.cs` ([Day 13](#/day/p2-d13))
- `C:\dev\cs-practice\bin\`, `C:\dev\cs-practice\obj\` (빌드가 만드는 폴더라서 건드리지 않아요)
- `C:\dev\streamer-hub\README.md`와 `C:\dev\streamer-hub\client\` 폴더 (오늘은 열지 않아요)
- .NET 10 SDK와 VS Code C# 확장
- 켜 두어야 할 프로그램은 없어요.
:::

## 📖 개념 이해

### 람다 식: 이름 없는 작은 메서드

**비유부터 볼게요.** "이 목록에서 곰이 들어간 이름만 골라 주세요"라고 부탁할 때, 고르는 기준을 한 줄 메모로 건네요. 메모에는 이름을 붙일 필요가 없어요. 한 번 쓰고 끝나니까요.

**정확한 정의는 이래요.** **[[람다 식]]**(lambda expression)은 이름 없이 그 자리에서 적는 작은 함수예요. `입력 => 결과` 모양이에요. P1에서 배운 [[화살표 함수]]와 같은 생각이에요.

```text
JavaScript:  (s) => s.name
C#:          s => s.Name
```

C#은 괄호를 생략할 수 있고 `s`의 타입(`Streamer`)은 컴파일러가 알아서 알아내요. "입력을 받아 결과를 돌려주는 함수"를 변수에 담으려면 타입이 필요한데, `Func<Streamer, string>`이라고 써요. 앞의 타입이 입력, 마지막 타입이 결과예요. TypeScript의 [[함수 타입]]과 같은 역할이에요(Day 6). 오늘은 "함수도 값처럼 넘길 수 있다"는 것만 기억하세요.

### LINQ: 목록을 질문하는 도구

**[[LINQ]]**(링크)는 목록(컬렉션)을 거르고 정렬하고 바꾸고 세는 메서드 모음이에요. 모두 `.`으로 이어 써요(메서드 이어 쓰기). P1의 배열 메서드(`filter`, `map`, `sort`)와 짝이에요.

| 하고 싶은 일 | JavaScript | C# LINQ |
|---|---|---|
| 조건에 맞는 것만 | `filter` | `Where` |
| 모양을 바꿔 새 목록 | `map` | `Select` |
| 정렬 | `sort` | `OrderBy`, `OrderByDescending` |
| 첫 번째 하나 | `find` | `First`, `FirstOrDefault` |
| 하나라도 있는지 | `some` | `Any` |
| 개수 | `length` | `Count` |

자주 쓰는 메서드를 더 볼게요.

- `First()`는 첫 번째를 돌려줘요. 결과가 하나도 없으면 프로그램이 멈춰요. `FirstOrDefault()`는 없으면 `null`을 돌려줘서 `is null`로 확인해요(Day 11).
- `Skip(n)`은 앞에서 n개를 건너뛰고, `Take(n)`은 앞에서 n개만 가져와요. 둘을 이어 쓰면 쪽 나누기가 돼요: `.Skip((page - 1) * pageSize).Take(pageSize)`.
- `ToList()`는 결과를 진짜 `List`로 만들어 줘요.

**알아둘 점 하나.** `Where`나 `OrderBy`는 호출하는 순간 계산하지 않고 "이렇게 계산하겠다"는 계획만 세워요. `ToList()`나 `foreach`로 결과를 실제로 꺼낼 때 계산해요(지연 실행). 그래서 `Console.WriteLine(query)`는 결과가 아니라 `System.Linq…`로 시작하는 타입 이름을 출력해요. 이 성질은 3주 뒤 DB에서 중요해져요. LINQ 계획이 SQL 한 번으로 바뀌어 DB가 대신 계산하게 되거든요(Day 21).

:::info 실무에서는
서버 코드의 절반은 LINQ예요. 레퍼런스의 게시판 목록은 `OrderByDescending`으로 최신 글을 먼저 놓고 `Skip`·`Take`로 한 쪽만 잘라서 돌려줘요. 오늘 쪽 나누기를 연습하면 Day 30에서 그대로 나와요.
:::

### 식 본문 멤버: 한 줄이면 `=>`

메서드나 프로퍼티의 본문이 값 하나를 돌려주는 식 한 줄뿐이면 `{ return …; }` 대신 `=>`로 줄여 쓸 수 있어요. 이것이 **[[식 본문 멤버]]**(expression-bodied member)예요.

```csharp
public string Label => $"{Name} ({Platform})";
```

읽을 때마다 `Name`과 `Platform`으로 글자를 새로 만들어 돌려줘요. 값을 저장하지 않으니 이름이 바뀌면 `Label`도 따라 바뀌어요.

## 🛠️ 따라하기

모두 5단계예요. `Streamer.cs`에 프로퍼티 하나를 더하고 `Program.cs`를 새로 써요.

### 1단계 · 폴더 열고 Label 프로퍼티, 연습 데이터 만들기 (15분)

**어디서:** PowerShell (위치는 어디든 괜찮아요)

**무엇을:**

1. 연습 폴더를 VS Code로 열어요.

```powershell
code C:\dev\cs-practice
```

아무것도 나오지 않고 VS Code 창이 열리면 성공이에요.

2. 탐색기에서 `Streamer.cs`를 열어요. `public List<Schedule> Schedules { get; set; } = new List<Schedule>();` 줄을 찾아요.
3. 그 줄 **바로 아래**에 빈 줄을 하나 두고 아래 코드를 붙여 넣어요.

📄 C:\dev\cs-practice\Streamer.cs (일부)
```csharp
    // 식 본문 멤버: => 뒤의 식이 곧 값이에요
    public string Label => $"{Name} ({Platform})";
```

4. `Ctrl + S`로 저장해요.
5. 탐색기에서 `Program.cs`를 열고 `Ctrl + A`, `Delete`로 비운 뒤 아래 코드를 붙여 넣고 저장해요.

📄 C:\dev\cs-practice\Program.cs (일부)
```csharp
using HubConsole;

var today = DateTime.UtcNow.Date;
var now = DateTime.UtcNow;

var streamers = new List<Streamer>
{
    new Streamer { Id = 1, Name = "달빛곰", Platform = "chzzk" },
    new Streamer { Id = 2, Name = "픽셀토끼", Platform = "youtube" },
    new Streamer { Id = 3, Name = "노을고양이", Platform = "soop" },
    new Streamer { Id = 4, Name = "별빛여우", Platform = "chzzk" },
    new Streamer { Id = 5, Name = "아기곰", Platform = "youtube" },
};

var schedules = new List<Schedule>
{
    new("시청자 참여 게임", today.AddDays(3).AddHours(11), 90),
    new("저녁 게임 방송", today.AddDays(1).AddHours(11), 120),
    new("새벽 토크", today.AddDays(5).AddHours(17), 45),
    new("점심 그림 방송", today.AddDays(2).AddHours(4), 60),
    new("노래 방송", today.AddDays(4).AddHours(13), 150),
    new("지난 방송", today.AddDays(-1).AddHours(11), 100),
};
```

스트리머 5명과 일정 6개예요. 일정은 일부러 시간 순서를 섞어 두었어요. 맨 마지막 "지난 방송"은 어제 일정이라 이미 지났어요.

**어디서:** VS Code 터미널 (`` Ctrl + ` ``로 열어요. 프롬프트는 `PS C:\dev\cs-practice>`)

```powershell
dotnet build
```

예상 출력(시간은 달라도 돼요):

```text
Build succeeded.
    0 Warning(s)
    0 Error(s)
```

:::success
`0 Warning(s)`, `0 Error(s)`가 나와요. 아직 출력하는 코드가 없어서 `dotnet run`을 해도 아무것도 안 나오는 게 정상이에요.
:::

### 2단계 · 람다와 OrderBy, Select (12분)

**어디서:** VS Code → `C:\dev\cs-practice\Program.cs` 맨 아래

**무엇을:** 맨 마지막 줄 아래에 빈 줄을 하나 두고 붙여 넣은 뒤 저장해요.

📄 C:\dev\cs-practice\Program.cs (일부)
```csharp

Console.WriteLine("--- 1. 람다 식 ---");
Func<Streamer, string> getName = s => s.Name;
Console.WriteLine(getName(streamers[0]));

Console.WriteLine("--- 2. OrderBy와 Select ---");
var sortedNames = streamers.OrderBy(s => s.Name).Select(s => s.Name).ToList();
Console.WriteLine(string.Join(", ", sortedNames));
```

- `getName`은 "스트리머를 받아 이름 글자를 돌려주는 함수"를 담은 변수예요. `getName(streamers[0])`처럼 함수처럼 불러요.
- `OrderBy(s => s.Name)`은 이름으로 정렬하고, `Select(s => s.Name)`은 스트리머 목록을 이름 목록으로 바꿔요. `ToList()`로 목록을 확정해요.
- `string.Join(", ", 목록)`은 목록의 값을 `, `로 이어 한 줄의 글자로 만들어요.

**어디서:** VS Code 터미널

```powershell
dotnet run
```

예상 출력:

```text
--- 1. 람다 식 ---
달빛곰
--- 2. OrderBy와 Select ---
노을고양이, 달빛곰, 별빛여우, 아기곰, 픽셀토끼
```

:::success
이름이 가나다 순(ㄴ, ㄷ, ㅂ, ㅇ, ㅍ)으로 나와요. 코드에서는 이름을 입력한 순서(달빛곰이 먼저)와 다르다는 것을 확인하세요.
:::

### 3단계 · Where로 거르기 (8분)

**어디서:** VS Code → `C:\dev\cs-practice\Program.cs` 맨 아래

**무엇을:** 맨 마지막 줄 아래에 빈 줄을 하나 두고 붙여 넣은 뒤 저장해요.

📄 C:\dev\cs-practice\Program.cs (일부)
```csharp

Console.WriteLine("--- 3. Where ---");
var chzzkOnly = streamers.Where(s => s.Platform == "chzzk").Select(s => s.Label).ToList();
Console.WriteLine(string.Join(", ", chzzkOnly));
```

`Where(s => s.Platform == "chzzk")`는 "플랫폼이 chzzk인 것만"이에요. `Select(s => s.Label)`은 1단계에서 만든 `Label`을 꺼내요. 메서드를 줄줄이 이어 쓸 때는 앞 결과가 다음 메서드의 입력이 돼요.

**어디서:** VS Code 터미널

```powershell
dotnet run
```

예상 출력(앞 출력 아래에 이어져요):

```text
--- 3. Where ---
달빛곰 (chzzk), 별빛여우 (chzzk)
```

:::success
`달빛곰 (chzzk), 별빛여우 (chzzk)` 한 줄이 나와요. 두 명만 걸러졌고 각각 `이름 (플랫폼)` 모양이에요.
:::

### 4단계 · Any, Count, First (10분)

**어디서:** VS Code → `C:\dev\cs-practice\Program.cs` 맨 아래

**무엇을:** 맨 마지막 줄 아래에 빈 줄을 하나 두고 붙여 넣은 뒤 저장해요.

📄 C:\dev\cs-practice\Program.cs (일부)
```csharp

Console.WriteLine("--- 4. Any, Count, First ---");
Console.WriteLine(streamers.Any(s => s.Platform == "soop"));
Console.WriteLine(streamers.Count(s => s.Platform == "youtube"));
var longest = schedules.OrderByDescending(x => x.DurationMinutes).First();
Console.WriteLine($"가장 긴 방송: {longest.Title} ({longest.DurationMinutes}분)");
var nobody = streamers.FirstOrDefault(s => s.Name == "없는이름");
Console.WriteLine(nobody is null ? "없어요" : nobody.Name);
```

- `Any(조건)`은 조건에 맞는 것이 하나라도 있으면 `True`예요.
- `Count(조건)`은 맞는 개수예요.
- `OrderByDescending(…).First()`는 큰 순서로 세운 맨 앞, 곧 가장 큰 값이에요. 일정 중 가장 긴 방송을 찾았어요.
- `FirstOrDefault`는 찾는 것이 없으면 `null`이에요. 그래서 `nobody is null`로 확인하고 써요.

**어디서:** VS Code 터미널

```powershell
dotnet run
```

예상 출력(앞 출력 아래에 이어져요):

```text
--- 4. Any, Count, First ---
True
2
가장 긴 방송: 노래 방송 (150분)
없어요
```

:::success
`True`, `2`, `가장 긴 방송: 노래 방송 (150분)`, `없어요`가 차례로 나와요. 오류나 경고는 없어요.
:::

### 5단계 · ToList()를 해야 계산된다는 것 확인하기 (8분)

**어디서:** VS Code → `C:\dev\cs-practice\Program.cs` 맨 아래

**무엇을:** 맨 마지막 줄 아래에 빈 줄을 하나 두고 붙여 넣은 뒤 저장해요.

📄 C:\dev\cs-practice\Program.cs (일부)
```csharp

Console.WriteLine("--- 5. ToList()를 해야 계산돼요 ---");
var soopQuery = streamers.Where(s => s.Platform == "soop");
Console.WriteLine(soopQuery);
Console.WriteLine(soopQuery.ToList().Count);
```

**어디서:** VS Code 터미널

```powershell
dotnet run
```

예상 출력(앞 출력 아래에 이어져요):

```text
--- 5. ToList()를 해야 계산돼요 ---
System.Linq.Enumerable+ListWhereIterator`1[HubConsole.Streamer]
1
```

:::success
첫 줄은 스트리머 이름이 아니라 `System.Linq…`로 시작하는 타입 이름이고, 다음 줄이 `1`이에요. 첫 줄 모양은 .NET 버전에 따라 조금 다를 수 있어요. `ToList()`로 확정해야 결과를 쓸 수 있다는 뜻이에요.
:::

## ✍️ 과제

### 과제 1 · 이름에 "곰"이 들어간 스트리머 (쉬움 ⭐, 4분)

- `streamers`에서 `Name`에 `"곰"`이 들어간 사람만 골라 `이름 (플랫폼)` 모양으로 한 줄씩 출력해요.
- 힌트: 글자의 `Contains`와 `Where`를 함께 써요. 결과는 `달빛곰 (chzzk)`, `아기곰 (youtube)`이에요.

### 과제 2 · 다가오는 일정 3개 (쉬움 ⭐, 5분)

- `schedules`에서 **지금보다 뒤**인 일정만 시작 시각이 이른 순서로 3개 출력해요(제목만).
- 힌트: `Where(x => x.StartsAt > now)` 다음에 `OrderBy`와 `Take(3)`을 이어요.

### 과제 3 · 쪽 나누기 (보통 ⭐⭐, 6분)

- 스트리머를 이름순으로 정렬한 뒤, `page = 2`, `pageSize = 2`일 때의 결과를 출력해요.
- 힌트: `Skip((page - 1) * pageSize).Take(pageSize)`예요. `page = 1`이면 처음 2명이 나와요.

## ✅ 정답

:::answer 과제 1 정답 · 이름에 곰
📄 C:\dev\cs-practice\Program.cs (일부)
```csharp

Console.WriteLine("--- 과제 1 ---");
var bears = streamers.Where(s => s.Name.Contains("곰")).ToList();
foreach (var bear in bears)
{
    Console.WriteLine(bear.Label);
}
```

예상 출력:

```text
--- 과제 1 ---
달빛곰 (chzzk)
아기곰 (youtube)
```

**왜 이렇게 하나요?** `s.Name.Contains("곰")`은 글자의 `Contains`(글자 안에 있는지)라서 이름의 어느 위치든 걸려요. 같은 이름의 `List.Contains`와는 다른 메서드이지만 "들어 있는지"를 묻는 뜻은 같아요.
:::

:::answer 과제 2 정답 · 다가오는 일정 3개
📄 C:\dev\cs-practice\Program.cs (일부)
```csharp

Console.WriteLine("--- 과제 2 ---");
var upcoming = schedules
    .Where(x => x.StartsAt > now)
    .OrderBy(x => x.StartsAt)
    .Take(3)
    .ToList();
foreach (var item in upcoming)
{
    Console.WriteLine(item.Title);
}
```

예상 출력:

```text
--- 과제 2 ---
저녁 게임 방송
점심 그림 방송
시청자 참여 게임
```

**왜 이렇게 하나요?** 순서가 중요해요. 먼저 `Where`로 지난 일정("지난 방송")을 걸러 내고, 그다음 시각 순으로 정렬해서, 앞의 3개만 가져와요. `Take(3)`을 먼저 하면 정렬 전의 앞 3개를 가져와서 틀려요. 긴 이어 쓰기는 한 줄에 메서드 하나씩 줄바꿈하면 읽기 쉬워요.
:::

:::answer 과제 3 정답 · 쪽 나누기
📄 C:\dev\cs-practice\Program.cs (일부)
```csharp

Console.WriteLine("--- 과제 3 ---");
var page = 2;
var pageSize = 2;
var pageItems = streamers
    .OrderBy(s => s.Name)
    .Skip((page - 1) * pageSize)
    .Take(pageSize)
    .ToList();
foreach (var item in pageItems)
{
    Console.WriteLine(item.Name);
}
```

예상 출력:

```text
--- 과제 3 ---
별빛여우
아기곰
```

**왜 이렇게 하나요?** 이름순 목록은 `노을고양이, 달빛곰, 별빛여우, 아기곰, 픽셀토끼`예요. `page = 2`면 `(2 - 1) * 2 = 2`개를 건너뛰고 2개를 가져와요. Day 30의 게시판 목록이 이 식 그대로 쪽을 나눠요.
:::

:::answer 오늘 끝 상태 전체 코드
막혔다면 아래 두 파일을 같은 내용으로 맞추고 Day 15를 시작하세요. 이 Day에서 바뀐 파일은 `Streamer.cs`와 `Program.cs`뿐이에요.

```text
C:\dev\cs-practice\
├─ HubConsole.csproj   (그대로)
├─ Program.cs          (오늘 바꿈)
├─ Streamer.cs         (오늘 바꿈: Label 추가)
├─ Schedule.cs         (Day 12 그대로)
├─ StreamerCard.cs     (Day 12 그대로)
├─ Users.cs            (Day 13 그대로)
├─ Notifiers.cs        (Day 13 그대로)
├─ bin\                (빌드 결과)
└─ obj\                (빌드 중간 파일)
```

📄 C:\dev\cs-practice\Streamer.cs
```csharp
namespace HubConsole;

// 스트리머 한 명을 만드는 설계도
public class Streamer
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Platform { get; set; } = "";
    public string ChannelUrl { get; set; } = "";
    public string Bio { get; set; } = "";
    public string? AvatarUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<Schedule> Schedules { get; set; } = new List<Schedule>();

    // 식 본문 멤버: => 뒤의 식이 곧 값이에요
    public string Label => $"{Name} ({Platform})";

    private int viewers; // 클래스 안에서만 바꿀 수 있어요

    public void AddViewer()
    {
        viewers++;
    }

    public int GetViewers()
    {
        return viewers;
    }

    // 아직 시작하지 않은 일정 중 가장 빠른 것을 돌려줘요. 없으면 null이에요.
    public Schedule? NextSchedule(DateTime now)
    {
        Schedule? next = null;
        foreach (var schedule in Schedules)
        {
            if (schedule.StartsAt > now && (next is null || schedule.StartsAt < next.StartsAt))
            {
                next = schedule;
            }
        }
        return next;
    }
}
```

📄 C:\dev\cs-practice\Program.cs
```csharp
using HubConsole;

var today = DateTime.UtcNow.Date;
var now = DateTime.UtcNow;

var streamers = new List<Streamer>
{
    new Streamer { Id = 1, Name = "달빛곰", Platform = "chzzk" },
    new Streamer { Id = 2, Name = "픽셀토끼", Platform = "youtube" },
    new Streamer { Id = 3, Name = "노을고양이", Platform = "soop" },
    new Streamer { Id = 4, Name = "별빛여우", Platform = "chzzk" },
    new Streamer { Id = 5, Name = "아기곰", Platform = "youtube" },
};

var schedules = new List<Schedule>
{
    new("시청자 참여 게임", today.AddDays(3).AddHours(11), 90),
    new("저녁 게임 방송", today.AddDays(1).AddHours(11), 120),
    new("새벽 토크", today.AddDays(5).AddHours(17), 45),
    new("점심 그림 방송", today.AddDays(2).AddHours(4), 60),
    new("노래 방송", today.AddDays(4).AddHours(13), 150),
    new("지난 방송", today.AddDays(-1).AddHours(11), 100),
};

Console.WriteLine("--- 1. 람다 식 ---");
Func<Streamer, string> getName = s => s.Name;
Console.WriteLine(getName(streamers[0]));

Console.WriteLine("--- 2. OrderBy와 Select ---");
var sortedNames = streamers.OrderBy(s => s.Name).Select(s => s.Name).ToList();
Console.WriteLine(string.Join(", ", sortedNames));

Console.WriteLine("--- 3. Where ---");
var chzzkOnly = streamers.Where(s => s.Platform == "chzzk").Select(s => s.Label).ToList();
Console.WriteLine(string.Join(", ", chzzkOnly));

Console.WriteLine("--- 4. Any, Count, First ---");
Console.WriteLine(streamers.Any(s => s.Platform == "soop"));
Console.WriteLine(streamers.Count(s => s.Platform == "youtube"));
var longest = schedules.OrderByDescending(x => x.DurationMinutes).First();
Console.WriteLine($"가장 긴 방송: {longest.Title} ({longest.DurationMinutes}분)");
var nobody = streamers.FirstOrDefault(s => s.Name == "없는이름");
Console.WriteLine(nobody is null ? "없어요" : nobody.Name);

Console.WriteLine("--- 5. ToList()를 해야 계산돼요 ---");
var soopQuery = streamers.Where(s => s.Platform == "soop");
Console.WriteLine(soopQuery);
Console.WriteLine(soopQuery.ToList().Count);

Console.WriteLine("--- 과제 1 ---");
var bears = streamers.Where(s => s.Name.Contains("곰")).ToList();
foreach (var bear in bears)
{
    Console.WriteLine(bear.Label);
}

Console.WriteLine("--- 과제 2 ---");
var upcoming = schedules
    .Where(x => x.StartsAt > now)
    .OrderBy(x => x.StartsAt)
    .Take(3)
    .ToList();
foreach (var item in upcoming)
{
    Console.WriteLine(item.Title);
}

Console.WriteLine("--- 과제 3 ---");
var page = 2;
var pageSize = 2;
var pageItems = streamers
    .OrderBy(s => s.Name)
    .Skip((page - 1) * pageSize)
    .Take(pageSize)
    .ToList();
foreach (var item in pageItems)
{
    Console.WriteLine(item.Name);
}
```

`dotnet run`의 마지막 두 줄은 `별빛여우`, `아기곰`이고 경고는 0개예요.
:::

## 🧯 자주 막히는 곳

여기에 없는 증상은 [문제 해결 모음](#/page/troubleshooting)에서 찾아보세요.

컴파일러 `error`·`warning` 문장이 한국어로 나오면 영어 문장 대신 `CS` 번호로 찾으세요([Day 11](#/day/p2-d11)에서 설명했어요).

### `InvalidOperationException: Sequence contains no matching element`

```text
Unhandled exception. System.InvalidOperationException: Sequence contains no matching element
   at System.Linq.ThrowHelper.ThrowNoMatchException()
   at System.Linq.Enumerable.First[TSource](IEnumerable`1 source, Func`2 predicate)
   at Program.<Main>$(String[] args) in C:\dev\cs-practice\Program.cs:line 76
```

**원인:** `First(조건)`에 맞는 것이 하나도 없어요. (조건 없이 빈 목록에 `First()`를 하면 비슷한 이름의 `Sequence contains no elements`가 나와요.)

**해결:** 없을 수도 있으면 `FirstOrDefault`를 쓰고 `is null`로 확인해요. 4단계의 `nobody` 부분을 보세요.

### `Console.WriteLine(query)`가 `System.Linq.…`를 출력해요

```text
System.Linq.Enumerable+ListWhereIterator`1[HubConsole.Streamer]
```

**원인:** `Where`·`OrderBy` 결과는 "계산 계획"이라서 그대로 출력하면 타입 이름이 나와요. 에러는 아니에요.

**해결:** 끝에 `.ToList()`를 붙이거나 `foreach`로 하나씩 꺼내 출력해요. 목록 전체를 한 줄로 보려면 `string.Join(", ", …)`을 써요.

### `error CS0136: A local or parameter named '…' cannot be declared in this scope`

```text
C:\dev\cs-practice\Program.cs(58,14): error CS0136: A local or parameter named 'item' cannot be declared in this scope because that name is used in an enclosing local scope to define a local or parameter
```

**원인:** 같은 이름(`item`)을 바깥(파일 맨 위 수준)에서 변수로 이미 만들었는데 안쪽 `foreach`에서 또 만들었어요. 줄 번호는 사람마다 달라요. 같은 칸에 같은 이름을 두 번 만들면 `CS0128`(`already defined in this scope`)이 나와요.

**해결:** 둘 중 하나의 이름을 바꿔요. 이 Day에서 `foreach`의 `item`은 서로 이웃하는 반복문 안에서만 쓰여서 문제가 없어요.

### `OrderBy`를 두 번 썼더니 앞 정렬이 사라졌어요

**원인:** `.OrderBy(a).OrderBy(b)`는 두 번째가 전체를 새로 정렬해서 첫 번째 기준이 의미가 없어져요.

**해결:** 첫 기준이 같을 때 두 번째 기준으로 정하려면 `.OrderBy(a).ThenBy(b)`를 써요.

### 쪽 나누기에서 결과가 비어요

**원인:** `Skip`이 전체 개수보다 크면 건너뛰고 남는 것이 없어요. `page`를 0부터 센 경우도 있어요.

**해결:** `page`는 1부터 세요. `(page - 1) * pageSize`로 계산해요.

## 📝 오늘의 체크리스트

- [ ] `Streamer.cs`에 `public string Label => …` 줄이 있어요.
- [ ] `--- 2. OrderBy와 Select ---` 아래에 `노을고양이, 달빛곰, 별빛여우, 아기곰, 픽셀토끼`가 나왔어요.
- [ ] `Where`로 걸러서 `달빛곰 (chzzk), 별빛여우 (chzzk)`가 나왔어요.
- [ ] `FirstOrDefault`에서 찾는 것이 없을 때 `없어요`가 나왔어요.
- [ ] `filter`↔`Where`, `map`↔`Select`, `sort`↔`OrderBy`를 말할 수 있어요.
- [ ] 과제 1~3 출력이 정답과 같아요(과제 3은 `별빛여우`, `아기곰`).
- [ ] `dotnet build`가 `0 Warning(s)`예요.

## 📚 더 알아보기

- [LINQ 개요 (Microsoft Learn)](https://learn.microsoft.com/dotnet/csharp/linq/): LINQ가 무엇이고 어떤 메서드가 있는지 설명한 공식 문서
- [람다 식 (Microsoft Learn)](https://learn.microsoft.com/dotnet/csharp/language-reference/operators/lambda-expressions): 람다 식의 모양과 쓰임을 설명한 공식 문서
- [식 본문 멤버 (Microsoft Learn)](https://learn.microsoft.com/dotnet/csharp/programming-guide/statements-expressions-operators/expression-bodied-members): `=>`로 줄여 쓰는 멤버를 설명한 공식 문서

➡️ **다음 Day 예고:** [Day 15 · 예외와 async](#/day/p2-d15)에서는 오류를 던지고 잡는 `try`/`catch`와, 기다리는 일을 처리하는 `Task`·`async`/`await`를 C#으로 배워요.
