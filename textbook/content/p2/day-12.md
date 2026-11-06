## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- 클래스(설계도)와 객체(설계도로 만든 물건)가 어떻게 다른지 내 말로 설명할 수 있어요.
- `Streamer.cs`, `Schedule.cs`처럼 클래스를 파일로 나누고, `namespace`와 `using`으로 연결할 수 있어요.
- 프로퍼티, 생성자, `public`/`private`, `static`, 객체 이니셜라이저를 써서 스트리머 3명과 방송 일정을 만들 수 있어요.
- `record`가 `class`와 어떻게 다르게 "같다"를 판단하는지 `==`로 직접 확인하고, `with`로 일부만 바꾼 복사본을 만들 수 있어요.

**예상 시간: 100분** (개념 이해 22분 · 따라하기 50분 · 과제 20분 · 정리 8분)

:::path 📂 시작 상태
[Day 11](#/day/p2-d11)의 "오늘 끝 상태 전체 코드"가 있어야 해요. 없거나 다르면 그 코드로 먼저 맞춰 주세요. 오늘도 연습 폴더 `C:\dev\cs-practice`만 써요. 안의 `Program.cs`는 1단계에서 비우니, Day 11 코드가 들어 있어도 괜찮아요.

- `C:\dev\cs-practice\HubConsole.csproj`
- `C:\dev\cs-practice\Program.cs`
- `C:\dev\cs-practice\bin\`, `C:\dev\cs-practice\obj\` (빌드가 만드는 폴더라서 건드리지 않아요)
- `C:\dev\streamer-hub\README.md`와 `C:\dev\streamer-hub\client\` 폴더 (오늘은 열지 않아요)
- .NET 10 SDK (`dotnet --version`이 `10.0.`으로 시작해요)와 VS Code C# 확장
- 켜 두어야 할 프로그램은 없어요.
:::

## 📖 개념 이해

### 클래스는 설계도, 객체는 설계도로 찍어 낸 물건

**비유부터 볼게요.** 붕어빵 틀을 떠올려 보세요. 틀은 하나인데 붕어빵은 몇 개든 찍어 낼 수 있어요. 틀에는 "머리, 몸통, 꼬리 모양"이 정해져 있고, 팥을 넣을지 슈크림을 넣을지는 찍을 때마다 달라요.

**정확한 정의는 이래요.**

- **[[C# 클래스]]**(class)는 데이터(값)와 동작(메서드)을 한 덩어리로 묶어 둔 설계도예요. 오늘의 `Streamer`는 "스트리머 한 명은 이름, 플랫폼, 소개가 있다"를 정한 설계도예요. P1에서 CSS의 [[클래스]]를 배웠는데 전혀 다른 말이에요. 오늘부터 "클래스"는 C# 설계도를 뜻해요.
- **[[인스턴스]]**(instance)는 클래스로 `new`를 써서 실제로 만든 물건이에요. 객체(object)라고도 불러요. `new Streamer { Name = "달빛곰" }`은 인스턴스 하나예요. 클래스 하나로 인스턴스를 몇 개든 만들 수 있고, 인스턴스마다 값이 달라요.

TypeScript에서 `interface`는 "이런 모양이어야 해요"라는 약속만 적었어요. C# 클래스는 약속이면서 **실제로 만들 수 있는 틀**이에요.

| | TypeScript `interface` | C# `class` |
|---|---|---|
| 하는 일 | 모양만 약속해요 | 모양을 정하고 객체를 만들어요 |
| `new`로 만들기 | 못 해요 | 해요 |
| 동작(메서드) | 모양만 적어요 | 코드를 직접 적어요 |

:::info 유니티에서는
유니티의 스크립트도 이렇게 시작해요. `public class Player : MonoBehaviour`처럼 `class` 이름이 파일 이름과 같아요. 게임 속 캐릭터 한 명 한 명이 클래스로 찍어 낸 인스턴스예요. 오늘 배우는 문법이 유니티에서도 그대로 쓰여요. 콜론(`:`) 뒤의 `MonoBehaviour`는 상속인데, Day 13에서 배워요.
:::

### 프로퍼티, 생성자, 접근 제한자

클래스 안에는 이런 것들이 들어가요.

- **[[프로퍼티]]**(property)는 객체가 가진 값이에요. 이름 앞에 타입을 적고 뒤에 `{ get; set; }`을 붙여요. `get`은 읽기, `set`은 쓰기예요. HTML의 속성(attribute)과 헷갈리지 않게 이 교재는 C#의 이 값을 프로퍼티라고 불러요.

```csharp
public string Name { get; set; } = "";
```

  끝의 `= ""`는 기본값이에요. 기본값이 없으면 `Name`이 null일 수 있다는 경고(`CS8618`)가 나와요. 어제 배운 "null이 되면 안 되는 `string`" 약속 때문이에요.

- **[[생성자]]**(constructor)는 `new`로 객체를 만들 때 맨 처음 한 번 실행되는 특별한 메서드예요. 이름이 클래스 이름과 같고 반환 타입이 없어요. 만들 때 꼭 필요한 값을 인수로 받게 할 수 있어요. 오늘 `Schedule`이 일정 제목, 시작 시각, 길이를 생성자로 받아요.
- **[[접근 제한자]]**(access modifier)는 "밖에서 이 멤버를 써도 되나요?"를 정하는 말이에요.

| 제한자 | 뜻 |
|---|---|
| `public` | 어디서든 써도 돼요 |
| `private` | 그 클래스 안에서만 써요 |
| `internal` | 같은 프로젝트 안에서만 써요 (클래스에 아무것도 안 쓰면 이 값이에요) |

  값을 함부로 못 바꾸게 막을 때 `private`을 써요. 클래스 안 변수(`private int viewers;`)는 소문자로, `public` 프로퍼티와 메서드는 대문자로 시작하는 게 관례예요.
- **[[static]]**은 "인스턴스마다가 아니라 클래스에 하나만 있다"는 표시예요. `Schedule.Created`는 만든 일정 개수를 세는데, 일정 하나하나가 아니라 `Schedule` 클래스에 하나뿐이에요. 인스턴스를 만들지 않고 `클래스이름.멤버`로 바로 써요. 클래스 전체를 `static class`로 만들면 인스턴스를 만들 수 없는 도구 모음이 돼요. 오늘의 `TimeText`가 그래요.

### 객체 이니셜라이저와 대상 형식 new()

`new Streamer { Id = 1, Name = "달빛곰" }`처럼 `new` 뒤 중괄호 안에 프로퍼티 값을 쓰는 것이 **객체 이니셜라이저**(object initializer)예요. 만들면서 필요한 칸만 바로 채워요. 생성자가 인수를 요구하는 클래스(`Schedule`)는 이 방식만으로 만들 수 없고 `new Schedule("제목", …)`처럼 인수를 줘야 해요.

만들 타입이 이미 정해져 있는 자리에서는 타입 이름을 줄여 `new(…)`로 쓸 수 있어요. 이것이 **대상 형식 `new()`**예요. `schedules.Add(new("제목", …))`처럼요.

### 네임스페이스와 using

**비유:** 이름이 같은 사람이 많아도 "서울 마포구 김철수", "부산 해운대구 김철수"로 주소를 붙이면 구별돼요.

**[[네임스페이스]]**(namespace)는 클래스에 붙이는 소속 이름이에요. 파일 맨 위에 `namespace HubConsole;`를 쓰면 그 파일의 클래스는 모두 `HubConsole` 소속이에요. 다른 파일에서 쓰려면 `using HubConsole;`로 "그 소속 것을 가져다 쓸게요"라고 적어요. 프로젝트 이름이 `HubConsole`이라서 기본 네임스페이스도 `HubConsole`이에요.

### record: 값이 같으면 같은 물건

클래스로 만든 두 객체는 안의 값이 같아도 **다른 물건**이에요. 쌍둥이를 보면 똑같이 생겼어도 두 사람인 것과 같아요. `==`로 비교하면 `False`예요. 반면 **[[record]]**(레코드)는 안의 값이 모두 같으면 **같은 것**으로 봐요. 주민등록증 내용이 같으면 같은 정보 카드로 보는 거예요.

```csharp
public record StreamerCard(int Id, string Name, string Platform);
```

이 한 줄이 프로퍼티 세 개, 생성자, 값 비교, 보기 좋은 출력을 모두 만들어 줘요. 괄호 안에 값을 적는 모양을 위치 record라고 불러요. 이 프로퍼티들은 `init`(만들 때만 쓸 수 있고 나중에는 못 바꿈)이에요. 그래서 일부만 바꾼 **복사본**을 만들 때는 `with`를 써요: `card with { Name = "새이름" }`.

:::info 실무에서는
서버가 주고받는 데이터 모양(DTO, Day 23)은 보통 `record`로 만들어요. 한번 만든 값이 중간에 바뀌지 않아서 안전하고 코드가 짧아요. 데이터베이스 테이블 한 줄에 대응하는 `Streamer` 같은 엔티티(Day 20)는 일반 `class`로 만들어요.
:::

## 🛠️ 따라하기

파일 4개를 만들고 모두 5단계로 이어 가요. 코드 블록 오른쪽 위의 **복사** 버튼을 써도 돼요.

### 1단계 · 연습 폴더 열고 Program.cs 비우기 (5분)

**어디서:** PowerShell (위치는 어디든 괜찮아요)

**무엇을:**

1. 터미널에서 연습 폴더를 VS Code로 열어요.

```powershell
code C:\dev\cs-practice
```

아무것도 나오지 않고 VS Code 창이 열리면 성공이에요.

2. 왼쪽 탐색기에서 `Program.cs`를 클릭하고, `Ctrl + A`, `Delete`로 내용을 모두 지워요.
3. `` Ctrl + ` ``로 VS Code 안에 터미널을 열어요.

:::success
`Program.cs`가 비어 있고 아래쪽 터미널 프롬프트가 `PS C:\dev\cs-practice>`로 끝나요.
:::

### 2단계 · Streamer.cs 만들기 (12분)

클래스는 파일 하나에 하나씩 두는 게 읽기 좋아요. 파일 이름을 클래스 이름과 같게 지어요.

**어디서:** VS Code 왼쪽 탐색기

**무엇을:**

1. 탐색기 맨 위의 폴더 이름 줄(`CS-PRACTICE`)에 마우스를 올려요. 오른쪽에 아이콘 몇 개가 나타나요.
2. 종이에 `+`가 붙은 모양의 **새 파일** 아이콘을 클릭해요. 아이콘이 안 보이면 폴더 이름 줄을 오른쪽 클릭하고 **새 파일**을 선택해요(영어 화면: **New File…**).
3. 이름 칸에 `Streamer.cs`를 입력하고 `Enter`를 눌러요. 새 파일이 열려요.
4. 아래 코드를 붙여 넣고 `Ctrl + S`로 저장해요.

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

코드를 읽어 볼게요.

- `public string? AvatarUrl`의 `?`는 사진 주소가 없을 수도 있다는 뜻이에요(어제 배운 nullable).
- `List<Schedule> Schedules`는 스트리머 한 명이 방송 일정을 여러 개 가진다는 뜻이에요.
- `NextSchedule`은 일정을 하나씩 보면서 "지금보다 뒤이고, 지금까지 찾은 것보다 이른 것"을 `next`에 담아요. 하나도 못 찾으면 `null`이에요.
- `DateTime`은 날짜와 시각을 담는 타입이에요. `Schedule`은 아직 없어서 편집기에서 빨간 밑줄이 쳐지는 게 정상이에요. 다음 단계에서 만들어요.

:::success
탐색기에 `Streamer.cs`가 보이고, 파일 탭 이름 옆에 저장 안 됨 표시(●)가 없어요. `Schedule`에 빨간 물결 밑줄이 있는 것은 아직 정상이에요.
:::

### 3단계 · Schedule.cs 만들기: 생성자와 static (12분)

**어디서:** VS Code 왼쪽 탐색기

**무엇을:** 2단계와 같은 방법으로 새 파일 `Schedule.cs`를 만들고 아래 코드를 붙여 넣은 뒤 `Ctrl + S`로 저장해요.

📄 C:\dev\cs-practice\Schedule.cs
```csharp
namespace HubConsole;

// 방송 일정 하나를 만드는 설계도
public class Schedule
{
    public int Id { get; set; }
    public int StreamerId { get; set; }
    public string Title { get; set; } = "";
    public DateTime StartsAt { get; set; }
    public int DurationMinutes { get; set; }

    // 생성자: 일정을 만들 때 꼭 필요한 값을 받아요
    public Schedule(string title, DateTime startsAt, int durationMinutes)
    {
        Title = title;
        StartsAt = startsAt;
        DurationMinutes = durationMinutes;
        Created++;
    }

    // static 멤버: 일정 하나하나가 아니라 Schedule 클래스 전체에 하나만 있어요
    public static int Created { get; private set; }
}

// 정적 클래스: 인스턴스를 만들지 않고 TimeText.Format(...)처럼 바로 써요
public static class TimeText
{
    public static string Format(DateTime time)
    {
        return time.ToString("yyyy-MM-dd HH:mm") + " (UTC)";
    }
}
```

- 생성자 `Schedule(string title, …)`는 반환 타입이 없고 이름이 클래스와 같아요. `new Schedule(…)`을 부를 때마다 한 번 실행돼요.
- `Created++`는 `Created = Created + 1`과 같아요. 일정을 만들 때마다 1씩 늘어요.
- `{ get; private set; }`는 읽기는 누구나, 쓰기는 이 클래스 안에서만 할 수 있다는 뜻이에요.
- `time.ToString("yyyy-MM-dd HH:mm")`은 `2026-11-07 11:00`처럼 연-월-일 시:분(24시간제)으로 바꿔요.

:::success
`Streamer.cs`의 `Schedule`에 있던 빨간 물결 밑줄이 사라져요. 터미널에서 `dotnet build`를 실행하면 `Build succeeded.`와 `0 Warning(s)`, `0 Error(s)`가 나와요.
:::

### 4단계 · Program.cs에서 객체 만들기 (12분)

**어디서:** VS Code → `C:\dev\cs-practice\Program.cs` (빈 파일)

**무엇을:** 아래 코드를 붙여 넣고 `Ctrl + S`로 저장해요. `using HubConsole;`는 꼭 파일 맨 위에 와야 해요.

📄 C:\dev\cs-practice\Program.cs (일부)
```csharp
using HubConsole;

Console.WriteLine("--- 1. 객체 만들기 ---");
var today = DateTime.UtcNow.Date;

var moonbear = new Streamer { Id = 1, Name = "달빛곰", Platform = "chzzk" };
moonbear.Schedules.Add(new Schedule("저녁 게임 방송", today.AddDays(1).AddHours(11), 120));
moonbear.Schedules.Add(new Schedule("시청자 참여 게임", today.AddDays(3).AddHours(11), 90));

var rabbit = new Streamer { Id = 2, Name = "픽셀토끼", Platform = "youtube" };
rabbit.Schedules.Add(new("점심 그림 방송", today.AddDays(2).AddHours(4), 60));

var cat = new Streamer { Id = 3, Name = "노을고양이", Platform = "soop" };
cat.Schedules.Add(new("지난 노래 방송", today.AddDays(-1).AddHours(13), 120));
cat.Schedules.Add(new("노래 방송", today.AddDays(4).AddHours(13), 120));

var streamers = new List<Streamer> { moonbear, rabbit, cat };
var now = DateTime.UtcNow;
foreach (var streamer in streamers)
{
    var next = streamer.NextSchedule(now);
    if (next is null)
    {
        Console.WriteLine($"{streamer.Name}: 예정된 방송이 없어요");
    }
    else
    {
        Console.WriteLine($"{streamer.Name}: {TimeText.Format(next.StartsAt)} {next.Title}");
    }
}
Console.WriteLine($"만든 일정 수: {Schedule.Created}");
```

- `DateTime.UtcNow`는 지금 시각(UTC)이에요. `.Date`는 그날 0시예요. `AddDays(1).AddHours(11)`은 "내일 11시"로 계산해요.
- UTC는 세계 표준시예요. 한국 시간은 UTC보다 9시간 빨라서 UTC 11시는 한국 시간 20시예요. 자세한 내용은 Day 29에서 배워요.
- `rabbit.Schedules.Add(new("점심 그림 방송", …))`는 대상 형식 `new()`예요. `Add`가 받는 타입이 `Schedule`이라서 이름을 줄였어요.
- 노을고양이는 어제 일정과 4일 뒤 일정이 있어요. `NextSchedule`이 이미 지난 일정은 건너뛰는지 볼 수 있어요.

**어디서:** VS Code 아래쪽 터미널 (`PS C:\dev\cs-practice>`)

```powershell
dotnet run
```

예상 출력(날짜는 오늘에 따라 달라요. 달빛곰은 내일 11:00, 픽셀토끼는 모레 04:00, 노을고양이는 4일 뒤 13:00이에요):

```text
--- 1. 객체 만들기 ---
달빛곰: 2026-11-07 11:00 (UTC) 저녁 게임 방송
픽셀토끼: 2026-11-08 04:00 (UTC) 점심 그림 방송
노을고양이: 2026-11-10 13:00 (UTC) 노래 방송
만든 일정 수: 5
```

:::success
스트리머 3명이 한 줄씩 나오고, 노을고양이는 "지난 노래 방송"이 아니라 "노래 방송"이에요. 마지막 줄이 `만든 일정 수: 5`예요. 오류가 나면 아래 🧯 자주 막히는 곳에서 `CS` 번호와 같은 항목을 찾아보세요.
:::

### 5단계 · StreamerCard record 만들고 비교하기 (10분)

**어디서:** VS Code 왼쪽 탐색기

**무엇을:**

1. 새 파일 `StreamerCard.cs`를 만들고 아래 코드를 붙여 넣은 뒤 저장해요.

📄 C:\dev\cs-practice\StreamerCard.cs
```csharp
namespace HubConsole;

// 위치 record: 값 세 개를 담는 카드. 값이 같으면 같은 카드로 봐요.
public record StreamerCard(int Id, string Name, string Platform);
```

2. `Program.cs`의 맨 마지막 줄 아래에 빈 줄을 하나 두고 아래 코드를 붙여 넣은 뒤 저장해요.

📄 C:\dev\cs-practice\Program.cs (일부)
```csharp

Console.WriteLine("--- 2. record와 class ---");
var cardA = new StreamerCard(1, "달빛곰", "chzzk");
var cardB = new StreamerCard(1, "달빛곰", "chzzk");
Console.WriteLine(cardA);
Console.WriteLine($"record 비교: {cardA == cardB}");

var plainA = new Streamer { Id = 1, Name = "달빛곰" };
var plainB = new Streamer { Id = 1, Name = "달빛곰" };
Console.WriteLine($"class 비교: {plainA == plainB}");
```

**어디서:** VS Code 아래쪽 터미널

```powershell
dotnet run
```

예상 출력(앞 단계 출력 아래에 이어져요):

```text
--- 2. record와 class ---
StreamerCard { Id = 1, Name = 달빛곰, Platform = chzzk }
record 비교: True
class 비교: False
```

:::success
`StreamerCard { Id = 1, … }` 모양의 한 줄과 `record 비교: True`, `class 비교: False`가 나와요. 값이 똑같아도 `class`는 다른 물건이라서 `False`예요.
:::

## ✍️ 과제

### 과제 1 · Post 클래스 만들어 보고 지우기 (쉬움 ⭐, 6분)

- `Post.cs`를 새로 만들어요. 프로퍼티는 `Id`(int), `AuthorId`(string), `Title`(string), `Body`(string), `CreatedAt`(DateTime), `UpdatedAt`(DateTime?)예요. 글이 한 번도 고쳐지지 않았으면 `UpdatedAt`이 null이에요.
- 네임스페이스는 `HubConsole`로 하고, 글자 프로퍼티에는 기본값 `""`를 줘요.
- 확인: `Program.cs` 맨 아래에 `Console.WriteLine(new Post { Title = "첫 글" }.Title);`를 붙여 `dotnet run` 하면 `첫 글`이 나와요.
- 마지막에 그 한 줄과 `Post.cs` 파일을 모두 지워요(내일 시작 상태에 없어요). `Post.cs`는 Day 30의 서버 코드에서 다시 만나요.

### 과제 2 · private으로 지킨 시청자 수 (보통 ⭐⭐, 8분)

- `Streamer` 클래스에 `private int viewers;`와 `AddViewer()`(1 늘림), `GetViewers()`(값을 돌려줌) 메서드를 더해요.
- `Program.cs` 맨 아래에서 `moonbear.AddViewer()`를 두 번 부르고 `달빛곰 시청자: 2명`을 출력해요.
- 확인: 일부러 `moonbear.viewers = 5;`를 써 보면 `CS0122` 오류가 나서 밖에서 직접 못 바꾼다는 것을 알 수 있어요. 확인한 뒤 그 줄은 지워요.

### 과제 3 · with로 이름만 바꾼 복사본 (쉬움 ⭐, 6분)

- 5단계의 `cardA`에서 이름만 `새이름`으로 바꾼 `renamed`를 만들어 출력해요.
- 확인: `cardA`는 원래 이름 그대로여야 해요. `with`는 복사본을 만들 뿐 원래 값을 바꾸지 않아요.
- 힌트: `var renamed = card with { Name = "새이름" };` 모양이에요.

## ✅ 정답

:::answer 과제 1 정답 · Post 클래스
📄 C:\dev\cs-practice\Post.cs
```csharp
namespace HubConsole;

public class Post
{
    public int Id { get; set; }
    public string AuthorId { get; set; } = "";
    public string Title { get; set; } = "";
    public string Body { get; set; } = "";
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
```

확인용 한 줄(`Program.cs` 맨 아래):

📄 C:\dev\cs-practice\Program.cs (일부)
```csharp
Console.WriteLine(new Post { Title = "첫 글" }.Title);
```

예상 출력: 맨 마지막 줄에 `첫 글`이 나와요. 확인이 끝나면 위 한 줄을 지우고 `Post.cs`는 탐색기에서 오른쪽 클릭 → **삭제**로 지워요.

**왜 이렇게 하나요?** `DateTime?`의 `?`는 "값이 없을 수도 있다"는 뜻이에요. 한 번도 고치지 않은 글은 고친 시각이 없으니 null로 표현해요. 서버의 `Entities/Post.cs`도 같은 프로퍼티를 가져요.
:::

:::answer 과제 2 정답 · private viewers
📄 C:\dev\cs-practice\Streamer.cs (일부)
```csharp
    private int viewers; // 클래스 안에서만 바꿀 수 있어요

    public void AddViewer()
    {
        viewers++;
    }

    public int GetViewers()
    {
        return viewers;
    }

```

위 코드는 `Streamer.cs`에서 `// 아직 시작하지 않은 일정 중` 주석 줄 **바로 위**에 붙여 넣어요.

📄 C:\dev\cs-practice\Program.cs (일부)
```csharp

Console.WriteLine("--- 과제 2 ---");
moonbear.AddViewer();
moonbear.AddViewer();
Console.WriteLine($"{moonbear.Name} 시청자: {moonbear.GetViewers()}명");
```

예상 출력:

```text
--- 과제 2 ---
달빛곰 시청자: 2명
```

일부러 `moonbear.viewers = 5;`를 쓰면 나는 오류예요(줄 번호는 달라도 돼요).

```text
C:\dev\cs-practice\Program.cs(52,10): error CS0122: 'Streamer.viewers' is inaccessible due to its protection level [C:\dev\cs-practice\HubConsole.csproj]
```

**왜 이렇게 하나요?** 시청자 수를 `AddViewer()`로만 늘릴 수 있게 하면 실수로 `-100` 같은 값을 넣는 일을 클래스가 막아 줘요. 값을 지키는 이 방식을 앞으로 서버 코드에서도 자주 봐요.
:::

:::answer 과제 3 정답 · with 식
📄 C:\dev\cs-practice\Program.cs (일부)
```csharp

Console.WriteLine("--- 과제 3 ---");
var renamed = cardA with { Name = "새이름" };
Console.WriteLine(renamed);
Console.WriteLine(cardA);
```

예상 출력:

```text
--- 과제 3 ---
StreamerCard { Id = 1, Name = 새이름, Platform = chzzk }
StreamerCard { Id = 1, Name = 달빛곰, Platform = chzzk }
```

**왜 이렇게 하나요?** record의 프로퍼티는 `init`이라 만든 뒤에는 못 바꿔요. 그래서 "일부만 다른 새 값"을 만들 때 `with`를 써요. 원래 값은 그대로라서 여러 곳에서 같은 카드를 믿고 쓸 수 있어요.
:::

:::answer 오늘 끝 상태 전체 코드
막혔다면 아래 파일 4개를 같은 내용으로 맞추고 Day 13을 시작하세요. `Post.cs`는 만들었다면 지워진 상태여야 해요.

```text
C:\dev\cs-practice\
├─ HubConsole.csproj   (그대로)
├─ Program.cs          (오늘 바꿈)
├─ Streamer.cs         (오늘 새로)
├─ Schedule.cs         (오늘 새로)
├─ StreamerCard.cs     (오늘 새로)
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

📄 C:\dev\cs-practice\Schedule.cs
```csharp
namespace HubConsole;

// 방송 일정 하나를 만드는 설계도
public class Schedule
{
    public int Id { get; set; }
    public int StreamerId { get; set; }
    public string Title { get; set; } = "";
    public DateTime StartsAt { get; set; }
    public int DurationMinutes { get; set; }

    // 생성자: 일정을 만들 때 꼭 필요한 값을 받아요
    public Schedule(string title, DateTime startsAt, int durationMinutes)
    {
        Title = title;
        StartsAt = startsAt;
        DurationMinutes = durationMinutes;
        Created++;
    }

    // static 멤버: 일정 하나하나가 아니라 Schedule 클래스 전체에 하나만 있어요
    public static int Created { get; private set; }
}

// 정적 클래스: 인스턴스를 만들지 않고 TimeText.Format(...)처럼 바로 써요
public static class TimeText
{
    public static string Format(DateTime time)
    {
        return time.ToString("yyyy-MM-dd HH:mm") + " (UTC)";
    }
}
```

📄 C:\dev\cs-practice\StreamerCard.cs
```csharp
namespace HubConsole;

// 위치 record: 값 세 개를 담는 카드. 값이 같으면 같은 카드로 봐요.
public record StreamerCard(int Id, string Name, string Platform);
```

📄 C:\dev\cs-practice\Program.cs
```csharp
using HubConsole;

Console.WriteLine("--- 1. 객체 만들기 ---");
var today = DateTime.UtcNow.Date;

var moonbear = new Streamer { Id = 1, Name = "달빛곰", Platform = "chzzk" };
moonbear.Schedules.Add(new Schedule("저녁 게임 방송", today.AddDays(1).AddHours(11), 120));
moonbear.Schedules.Add(new Schedule("시청자 참여 게임", today.AddDays(3).AddHours(11), 90));

var rabbit = new Streamer { Id = 2, Name = "픽셀토끼", Platform = "youtube" };
rabbit.Schedules.Add(new("점심 그림 방송", today.AddDays(2).AddHours(4), 60));

var cat = new Streamer { Id = 3, Name = "노을고양이", Platform = "soop" };
cat.Schedules.Add(new("지난 노래 방송", today.AddDays(-1).AddHours(13), 120));
cat.Schedules.Add(new("노래 방송", today.AddDays(4).AddHours(13), 120));

var streamers = new List<Streamer> { moonbear, rabbit, cat };
var now = DateTime.UtcNow;
foreach (var streamer in streamers)
{
    var next = streamer.NextSchedule(now);
    if (next is null)
    {
        Console.WriteLine($"{streamer.Name}: 예정된 방송이 없어요");
    }
    else
    {
        Console.WriteLine($"{streamer.Name}: {TimeText.Format(next.StartsAt)} {next.Title}");
    }
}
Console.WriteLine($"만든 일정 수: {Schedule.Created}");

Console.WriteLine("--- 2. record와 class ---");
var cardA = new StreamerCard(1, "달빛곰", "chzzk");
var cardB = new StreamerCard(1, "달빛곰", "chzzk");
Console.WriteLine(cardA);
Console.WriteLine($"record 비교: {cardA == cardB}");

var plainA = new Streamer { Id = 1, Name = "달빛곰" };
var plainB = new Streamer { Id = 1, Name = "달빛곰" };
Console.WriteLine($"class 비교: {plainA == plainB}");

Console.WriteLine("--- 과제 2 ---");
moonbear.AddViewer();
moonbear.AddViewer();
Console.WriteLine($"{moonbear.Name} 시청자: {moonbear.GetViewers()}명");

Console.WriteLine("--- 과제 3 ---");
var renamed = cardA with { Name = "새이름" };
Console.WriteLine(renamed);
Console.WriteLine(cardA);
```

`dotnet run`의 마지막 줄은 `StreamerCard { Id = 1, Name = 달빛곰, Platform = chzzk }`이고 경고는 0개예요.
:::

## 🧯 자주 막히는 곳

여기에 없는 증상은 [문제 해결 모음](#/page/troubleshooting)에서 찾아보세요.

### `error CS0122: '…' is inaccessible due to its protection level`

```text
C:\dev\cs-practice\Program.cs(52,10): error CS0122: 'Streamer.viewers' is inaccessible due to its protection level [C:\dev\cs-practice\HubConsole.csproj]
```

**원인:** `private`으로 막아 둔 멤버를 클래스 밖(`Program.cs`)에서 쓰려고 했어요. 오류가 맞게 막아 준 거예요.

**해결:** 밖에서 써야 하는 멤버면 `public`으로 바꿔요. 지키려고 `private`을 쓴 것이라면 `AddViewer()` 같은 `public` 메서드를 통해 써요.

### `error CS7036: There is no argument given that corresponds to the required parameter …`

```text
C:\dev\cs-practice\Program.cs(14,15): error CS7036: There is no argument given that corresponds to the required parameter 'title' of 'Schedule.Schedule(string, DateTime, int)' [C:\dev\cs-practice\HubConsole.csproj]
```

**원인:** 생성자가 `title`, `startsAt`, `durationMinutes`를 받는 클래스(`Schedule`)를 `new Schedule { Title = "x" }`처럼 인수 없이 만들었어요.

**해결:** `new Schedule("저녁 게임 방송", today.AddDays(1).AddHours(11), 120)`처럼 생성자에 정해 둔 인수를 모두 줘요.

### `error CS0246: The type or namespace name '…' could not be found`

```text
C:\dev\cs-practice\Program.cs(12,15): error CS0246: The type or namespace name 'Streamer' could not be found (are you missing a using directive or an assembly reference?)
```

**원인:** `Program.cs` 맨 위의 `using HubConsole;`가 없거나, 클래스 파일 맨 위의 `namespace HubConsole;`가 없거나 철자가 달라요. 같은 이름의 클래스가 어느 소속인지 컴파일러가 못 찾은 거예요.

**해결:** `Program.cs` 첫 줄이 `using HubConsole;`인지, `Streamer.cs`·`Schedule.cs`·`StreamerCard.cs` 첫 줄이 `namespace HubConsole;`인지 확인해요. 철자와 대소문자가 같아야 해요.

### `warning CS8618: Non-nullable property 'Name' must contain a non-null value when exiting constructor.`

```text
C:\dev\cs-practice\Streamer.cs(7,19): warning CS8618: Non-nullable property 'Name' must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring the property as nullable. [C:\dev\cs-practice\HubConsole.csproj]
```

**원인:** 글자 프로퍼티에 기본값이 없어서, 객체를 만든 직후 `Name`이 null일 수 있어요.

**해결:** `public string Name { get; set; } = "";`처럼 기본값 `""`를 줘요. 정말 없을 수 있는 값이면 `string?`로 바꿔요.

### `error CS8852: Init-only property or indexer … can only be assigned in an object initializer`

```text
C:\dev\cs-practice\Program.cs(52,1): error CS8852: Init-only property or indexer 'StreamerCard.Name' can only be assigned in an object initializer, or on 'this' or 'base' in an instance constructor or an 'init' accessor. [C:\dev\cs-practice\HubConsole.csproj]
```

**원인:** record의 프로퍼티는 `init`이라서 만든 뒤에는 `card.Name = "x";`처럼 바꿀 수 없어요.

**해결:** 바꾼 새 값이 필요하면 `card with { Name = "x" }`로 복사본을 만들어요.

## 📝 오늘의 체크리스트

- [ ] `Streamer.cs`, `Schedule.cs`, `StreamerCard.cs`가 `C:\dev\cs-practice` 폴더에 있어요.
- [ ] 세 파일의 첫 줄이 `namespace HubConsole;`이고 `Program.cs`의 첫 줄이 `using HubConsole;`예요.
- [ ] `dotnet run`이 스트리머 3명의 다음 방송과 `만든 일정 수: 5`를 출력했어요.
- [ ] `record 비교: True`와 `class 비교: False`가 나왔어요.
- [ ] 프로퍼티, 생성자, `private`, `static`의 뜻을 한 줄씩 내 말로 말할 수 있어요.
- [ ] 과제 1을 풀고 `Post.cs`를 지웠어요. 과제 2·3의 출력이 정답과 같아요.
- [ ] 마지막 `dotnet build`가 `0 Warning(s)`, `0 Error(s)`예요.

## 📚 더 알아보기

- [C# 클래스 (Microsoft Learn)](https://learn.microsoft.com/dotnet/csharp/fundamentals/types/classes): 클래스와 객체를 만드는 법과 멤버 종류를 설명한 공식 문서
- [record 형식 (Microsoft Learn)](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/record): record의 값 비교와 `with` 식을 설명한 공식 문서
- [접근 한정자 (Microsoft Learn)](https://learn.microsoft.com/dotnet/csharp/programming-guide/classes-and-structs/access-modifiers): `public`, `private`, `internal`의 차이를 설명한 공식 문서

➡️ **다음 Day 예고:** [Day 13 · 상속과 인터페이스](#/day/p2-d13)에서는 `Fan`, `Admin`이 `User`를 물려받아 같은 메서드를 다르게 동작시키는 법을 배워요.
