## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- `class Fan : User`처럼 상속을 써서 기본 클래스의 프로퍼티와 메서드를 물려받을 수 있어요.
- `virtual`과 `override`로 같은 메서드 `Describe()`가 클래스마다 다르게 동작하게 만들 수 있어요.
- `List<User>`에 `Fan`, `Admin`을 섞어 담고, 같은 메서드를 불러 다형성을 확인할 수 있어요.
- `interface INotifier`를 두 클래스가 구현하게 하고, `is` 패턴(`user is Admin admin`)으로 종류를 골라낼 수 있어요.

**예상 시간: 100분** (개념 이해 22분 · 따라하기 50분 · 과제 20분 · 정리 8분)

:::path 📂 시작 상태
[Day 12](#/day/p2-d12)의 "오늘 끝 상태 전체 코드"가 있어야 해요. 없거나 다르면 그 코드로 먼저 맞춰 주세요. 오늘도 연습 폴더 `C:\dev\cs-practice`만 써요. 안의 `Program.cs`는 1단계에서 비워요.

- `C:\dev\cs-practice\HubConsole.csproj`
- `C:\dev\cs-practice\Program.cs`
- `C:\dev\cs-practice\Streamer.cs`
- `C:\dev\cs-practice\Schedule.cs`
- `C:\dev\cs-practice\StreamerCard.cs`
- `C:\dev\cs-practice\bin\`, `C:\dev\cs-practice\obj\` (빌드가 만드는 폴더라서 건드리지 않아요)
- `C:\dev\streamer-hub\README.md`와 `C:\dev\streamer-hub\client\` 폴더 (오늘은 열지 않아요)
- .NET 10 SDK와 VS Code C# 확장
- 켜 두어야 할 프로그램은 없어요.
:::

## 📖 개념 이해

### 상속: 물려받고, 다른 점만 고쳐요

**비유부터 볼게요.** 가게마다 "직원" 규칙이 있어요. 출근하고, 이름표를 달아요. 그 위에 "계산원", "점장"이 각자 다른 일을 해요. 계산원 규칙을 처음부터 다 쓰지 않고 "직원 규칙 그대로 + 계산 일"이라고 적으면 짧아요.

**정확한 정의는 이래요.** **[[상속]]**(inheritance)은 이미 있는 클래스(부모, 기본 클래스)의 프로퍼티와 메서드를 새 클래스(자식)가 그대로 물려받는 것이에요. 클래스 이름 뒤에 콜론(`:`)과 부모 이름을 적어요.

```csharp
public class Fan : User
```

읽는 법은 "`Fan`은 `User`의 한 종류예요"예요. `Fan`은 `Name`과 `Describe()`를 따로 적지 않아도 가져요. 부모 생성자에 값을 넘길 때는 `: base(name)`을 써요. `base`는 부모를 뜻해요.

```csharp
public Fan(string name) : base(name)
```

C# 클래스는 부모를 **하나만** 가질 수 있어요. 둘 이상을 상속하려고 하면 컴파일러가 막아요(`CS1721`).

### virtual과 override: 같은 이름, 다른 동작

부모 메서드를 자식이 **다시 쓰려면** 두 표시가 짝으로 필요해요.

- **[[virtual]]**(버추얼)은 부모 메서드 앞에 붙여요. "자식이 이 메서드를 다시 써도 돼요"라는 허락이에요.
- **[[override]]**(오버라이드)는 자식 메서드 앞에 붙여요. "부모의 같은 이름 메서드를 내가 다시 쓸게요"라는 선언이에요. 이름과 매개변수가 부모와 같아야 해요.

모든 C# 클래스는 `ToString()`이라는 메서드를 기본으로 물려받아요. `public override string ToString()`으로 다시 쓰면 `Console.WriteLine(객체)`가 내가 정한 글자를 출력해요.

### 다형성: 같은 부름, 다른 대답

**비유:** 식당에서 "주문하신 음식 나왔습니다"라고 부르면 손님마다 각자 다른 음식을 받아요. 부르는 말은 같아요.

**[[다형성]]**(polymorphism)은 부모 타입으로 다루는 객체들이 같은 메서드를 불러도 **실제 종류에 맞는 동작**을 하는 성질이에요. `List<User>`에 `Fan`, `Admin`을 섞어 담고 `user.Describe()`를 부르면, 팬은 팬의 문장을, 관리자는 관리자의 문장을 말해요. 부르는 쪽은 종류를 몰라도 돼요.

### 인터페이스: "이것을 할 수 있어요"라는 약속

Day 5에서 TypeScript의 [[인터페이스]]를 배웠어요. 모양이 맞으면 인정해 줬어요. C#의 `interface`는 방식이 달라요. 클래스가 `: INotifier`처럼 **구현하겠다고 직접 선언**해야 해요. 선언했으면 인터페이스에 적힌 메서드를 모두 만들어야 하고, 하나라도 빠지면 오류(`CS0535`)가 나요.

```csharp
public interface INotifier
{
    void Send(string message);
}
```

상속은 부모를 하나만 갖지만 인터페이스는 여러 개를 구현해도 돼요. 이름이 `I`로 시작하는 것이 C#의 관례예요.

| | TypeScript | C# |
|---|---|---|
| 인터페이스를 맞추는 법 | 모양만 맞으면 돼요 | `: 인터페이스이름`으로 선언해야 해요 |
| 인터페이스에 코드 | 모양만 적어요 | 메서드 이름·매개변수만 적어요 |

### 패턴 매칭: 종류와 값을 한 번에 확인

**[[패턴 매칭]]**(pattern matching)은 값이 특정 모양인지 확인하면서 그 값을 변수에 담아 주는 문법이에요. `is`를 써요.

- `user is Admin admin`은 "`user`가 `Admin`이면 `admin`이라는 이름으로 쓸게요"예요. 맞으면 `true`예요.
- `value is string text && text != ""`는 "글자이면서 비어 있지 않다"예요. `&&`는 P1에서 배운 "그리고"예요. 앞이 거짓이면 뒤는 확인하지 않아요.
- `nothing is null`은 null인지 확인해요(Day 11에서 봤어요).

레퍼런스 코드에서 오늘 배운 것들이 쓰이는 곳이에요. 지금은 이름만 기억해 두세요.

- `AppUser : IdentityUser` (사용자 클래스, Day 25)
- `AppDbContext : IdentityDbContext<AppUser>` (Day 20, 25)
- `HttpUrlAttribute : ValidationAttribute` (주소 검사, Day 34)
- `TestDb : IDisposable` (테스트 도우미, Day 35)

`IDisposable`은 "다 쓰고 나면 정리할 것이 있는 객체"라는 인터페이스예요. 쓰는 법은 Day 15에서 배워요.

:::info 미리보기: Day 34에서 만나는 코드
읽기만 해도 돼요. 지금 이해하지 못해도 괜찮고, Day 34에서 이 파일을 만들 때 다시 설명해요.

```csharp
public override bool IsValid(object? value)
{
    if (value is null)
    {
        return true;
    }

    return value is string text
        && Uri.TryCreate(text, UriKind.Absolute, out var uri)
        && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);
}
```

`override`(오늘), `is null`·`is string text`(오늘), `out var`(Day 11)가 모두 들어 있어요. 부모 클래스 `ValidationAttribute`가 `IsValid`라는 메서드를 열어 두었고, 우리가 `override`로 "주소 검사"로 다시 써요.
:::

## 🛠️ 따라하기

5단계로 진행해요. 파일 `Users.cs`와 `Notifiers.cs`를 새로 만들어요.

### 1단계 · 연습 폴더 열고 Program.cs 비우기 (5분)

**어디서:** PowerShell (위치는 어디든 괜찮아요)

**무엇을:**

1. 연습 폴더를 VS Code로 열어요.

```powershell
code C:\dev\cs-practice
```

아무것도 나오지 않고 VS Code 창이 열리면 성공이에요.

2. 탐색기에서 `Program.cs`를 클릭하고 `Ctrl + A`, `Delete`로 비워요.
3. `` Ctrl + ` ``로 VS Code 터미널을 열어요.

:::success
`Program.cs`가 비어 있고 터미널 프롬프트가 `PS C:\dev\cs-practice>`로 끝나요.
:::

### 2단계 · Users.cs 만들기: 상속과 override (12분)

**어디서:** VS Code 왼쪽 탐색기 → 폴더 이름 줄에 마우스를 올리고 **새 파일**(종이에 `+` 모양) 아이콘

**무엇을:** 새 파일 `Users.cs`를 만들고 아래 코드를 붙여 넣은 뒤 `Ctrl + S`로 저장해요.

📄 C:\dev\cs-practice\Users.cs
```csharp
namespace HubConsole;

// 모든 사용자의 기본 모양
public class User
{
    public string Name { get; set; }

    public User(string name)
    {
        Name = name;
    }

    // virtual: 자식 클래스가 이 메서드를 다시 쓸 수 있어요
    public virtual string Describe()
    {
        return $"{Name}님은 일반 사용자예요.";
    }

    // 모든 클래스가 물려받은 ToString을 다시 써서 출력 모양을 정해요
    public override string ToString()
    {
        return $"User({Name})";
    }
}

// Fan은 User를 물려받아요
public class Fan : User
{
    public Fan(string name) : base(name)
    {
    }

    public override string Describe()
    {
        return $"{Name}님은 방송을 좋아하는 팬이에요.";
    }
}

public class Admin : User
{
    public Admin(string name) : base(name)
    {
    }

    public override string Describe()
    {
        return $"{Name}님은 사이트를 관리하는 관리자예요.";
    }
}
```

- `User`에는 `Name`과 생성자, `virtual` 메서드 `Describe()`가 있어요.
- `Fan`과 `Admin`은 `: User`로 물려받아요. `Name`은 따로 적지 않았는데도 써요.
- `: base(name)`은 "부모(`User`)의 생성자에 `name`을 넘겨요"라는 뜻이에요. 부모 생성자가 인수를 요구하기 때문에 꼭 필요해요.
- `public override string ToString()`은 `User` 객체를 출력할 때 쓰는 글자를 정해요.

:::success
탐색기에 `Users.cs`가 보이고 코드에 빨간 물결 밑줄이 없어요. 터미널에서 `dotnet build`를 실행하면 `0 Warning(s)`, `0 Error(s)`가 나와요.
:::

### 3단계 · 다형성 확인하기 (10분)

**어디서:** VS Code → `C:\dev\cs-practice\Program.cs` (빈 파일)

**무엇을:** 아래 코드를 붙여 넣고 저장해요. `using HubConsole;`는 맨 위에 와야 해요.

📄 C:\dev\cs-practice\Program.cs (일부)
```csharp
using HubConsole;

Console.WriteLine("--- 1. 상속과 다형성 ---");
var users = new List<User>
{
    new User("새싹"),
    new Fan("민지"),
    new Admin("하늘"),
};
foreach (var user in users)
{
    Console.WriteLine(user.Describe());
}
Console.WriteLine(users[1]);
```

`List<User>`는 "`User`를 담는 목록"인데, `Fan`과 `Admin`도 `User`의 한 종류라서 담을 수 있어요. 반복문 안에서 `user.Describe()`는 같은 코드인데 객체마다 다른 문장이 나와요.

**어디서:** VS Code 아래쪽 터미널 (`PS C:\dev\cs-practice>`)

```powershell
dotnet run
```

예상 출력:

```text
--- 1. 상속과 다형성 ---
새싹님은 일반 사용자예요.
민지님은 방송을 좋아하는 팬이에요.
하늘님은 사이트를 관리하는 관리자예요.
User(민지)
```

:::success
같은 `Describe()`인데 세 줄이 서로 달라요. 마지막 줄은 `Console.WriteLine(users[1])`이 `ToString()`을 불러서 `User(민지)`로 나와요.
:::

### 4단계 · is 패턴으로 종류 골라내기 (10분)

**어디서:** VS Code → `C:\dev\cs-practice\Program.cs` 맨 아래

**무엇을:** 맨 마지막 줄 아래에 빈 줄을 하나 두고 붙여 넣은 뒤 저장해요.

📄 C:\dev\cs-practice\Program.cs (일부)
```csharp

Console.WriteLine("--- 2. is 패턴 ---");
foreach (var user in users)
{
    if (user is Fan fan)
    {
        Console.WriteLine($"팬을 찾았어요: {fan.Name}");
    }
}
object? something = "스트리머 허브";
if (something is string text && text != "")
{
    Console.WriteLine($"글자예요: {text}");
}
object? nothing = null;
Console.WriteLine(nothing is null);
```

- `user is Fan fan`은 `Fan`일 때만 참이고, 그 안에서는 `fan` 변수로 `Fan` 전용 멤버까지 쓸 수 있어요.
- `object?`는 "무엇이든 담을 수 있는, null도 가능한 변수"예요. 안에 든 것이 글자인지 `is string text`로 확인해요.

**어디서:** VS Code 아래쪽 터미널

```powershell
dotnet run
```

예상 출력(앞 단계 출력 아래에 이어져요):

```text
--- 2. is 패턴 ---
팬을 찾았어요: 민지
글자예요: 스트리머 허브
True
```

:::success
`팬을 찾았어요: 민지` 한 줄만 나오고(새싹과 하늘은 `Fan`이 아니에요), 이어서 `글자예요: 스트리머 허브`와 `True`가 나와요.
:::

### 5단계 · Notifiers.cs 만들기: 인터페이스 구현 (13분)

**어디서:** VS Code 왼쪽 탐색기

**무엇을:**

1. 새 파일 `Notifiers.cs`를 만들고 아래 코드를 붙여 넣은 뒤 저장해요.

📄 C:\dev\cs-practice\Notifiers.cs
```csharp
namespace HubConsole;

// 인터페이스: "Send(글자)를 할 수 있어야 해요"라는 약속
public interface INotifier
{
    void Send(string message);
}

public class ConsoleNotifier : INotifier
{
    public void Send(string message)
    {
        Console.WriteLine($"[알림] {message}");
    }
}

public class PrefixNotifier : INotifier
{
    private readonly string prefix;

    public PrefixNotifier(string prefix)
    {
        this.prefix = prefix;
    }

    public void Send(string message)
    {
        Console.WriteLine($"{prefix} {message}");
    }
}
```

`readonly`는 "생성자에서 한 번만 정하고 그 뒤로는 못 바꾼다"는 표시이고, `this.prefix`의 `this`는 "이 객체의 `prefix`"를 뜻해요(같은 이름의 매개변수와 구별해요).

2. `Program.cs` 맨 아래에 빈 줄을 하나 두고 아래 코드를 붙여 넣은 뒤 저장해요.

📄 C:\dev\cs-practice\Program.cs (일부)
```csharp

Console.WriteLine("--- 3. 인터페이스 ---");
var notifiers = new List<INotifier>
{
    new ConsoleNotifier(),
    new PrefixNotifier("[공지]"),
};
foreach (var notifier in notifiers)
{
    notifier.Send("오늘 저녁 8시에 방송해요");
}
```

**어디서:** VS Code 아래쪽 터미널

```powershell
dotnet run
```

예상 출력(앞 단계 출력 아래에 이어져요):

```text
--- 3. 인터페이스 ---
[알림] 오늘 저녁 8시에 방송해요
[공지] 오늘 저녁 8시에 방송해요
```

:::success
같은 문장이 `[알림]`과 `[공지]` 두 모양으로 한 번씩 나와요. 목록은 `INotifier`로만 다루는데 실제 동작은 클래스마다 달라요.
:::

## ✍️ 과제

### 과제 1 · Moderator 추가하기 (쉬움 ⭐, 6분)

- `Users.cs` 맨 아래에 `Moderator : User` 클래스를 추가해요.
- `Describe()`를 재정의해서 `바다님은 채팅 관리자예요.`가 나오게 해요.
- `Program.cs` 맨 아래에서 `users.Add(new Moderator("바다"));` 뒤에 `users[3].Describe()`를 출력해요.
- 힌트: 메서드 본문은 `{ return $"…"; }` 모양으로 써요. `=>`로 줄여 쓰는 방법은 Day 14에서 배워요.

### 과제 2 · 관리자 이름만 출력하기 (보통 ⭐⭐, 6분)

- `users`에서 `Admin`인 사람의 이름만 출력해요. 모든 사용자에게 `Describe()`를 부르지 않아요.
- 힌트: 4단계에서 본 `is Fan fan`을 `is Admin admin`으로 바꾸면 돼요.

### 과제 3 · 규칙 인터페이스 만들기 (도전 ⭐⭐⭐, 8분)

- `Notifiers.cs` 맨 아래에 `interface IRule { bool IsValid(object? value); }`와 이를 구현한 `NotEmptyRule` 클래스를 만들어요.
- `IsValid`는 "값이 글자이고 비어 있지 않으면 `true`"예요.
- `Program.cs`에서 `"안녕"`, `""`, `null`, `5`를 넣어 `True`, `False`, `False`, `False`가 나오는지 확인해요.
- 힌트: `value is string text && text != ""`를 한 줄로 돌려줘요. Day 34의 주소 검사 특성이 이 모양을 써요.

## ✅ 정답

:::answer 과제 1 정답 · Moderator
📄 C:\dev\cs-practice\Users.cs (일부)
```csharp

// 과제 1: 채팅 관리자
public class Moderator : User
{
    public Moderator(string name) : base(name)
    {
    }

    public override string Describe()
    {
        return $"{Name}님은 채팅 관리자예요.";
    }
}
```

위 코드는 `Users.cs`의 맨 마지막 `}` 줄 아래에 붙여 넣어요.

📄 C:\dev\cs-practice\Program.cs (일부)
```csharp

Console.WriteLine("--- 과제 1 ---");
users.Add(new Moderator("바다"));
Console.WriteLine(users[3].Describe());
```

예상 출력:

```text
--- 과제 1 ---
바다님은 채팅 관리자예요.
```

**왜 이렇게 하나요?** `Moderator`도 `User`라서 `List<User>`에 들어가요. `Describe`는 `virtual`이라서 `override`로 다시 쓰면, 목록에서 꺼낸 `User`로도 `Moderator`의 문장이 나와요.
:::

:::answer 과제 2 정답 · 관리자만
📄 C:\dev\cs-practice\Program.cs (일부)
```csharp

Console.WriteLine("--- 과제 2 ---");
foreach (var user in users)
{
    if (user is Admin admin)
    {
        Console.WriteLine(admin.Name);
    }
}
```

예상 출력:

```text
--- 과제 2 ---
하늘
```

**왜 이렇게 하나요?** `Moderator`도 이름에 "관리자"가 들어가지만 `Admin` 클래스가 아니라서 걸러져요. `is Admin`은 "정확히 `Admin`의 한 종류인가"를 확인해요.
:::

:::answer 과제 3 정답 · IRule과 NotEmptyRule
📄 C:\dev\cs-practice\Notifiers.cs (일부)
```csharp

// 인터페이스 연습: 값이 규칙에 맞는지 알려 줘요
public interface IRule
{
    bool IsValid(object? value);
}

public class NotEmptyRule : IRule
{
    public bool IsValid(object? value)
    {
        return value is string text && text != "";
    }
}
```

위 코드는 `Notifiers.cs`의 맨 마지막 `}` 줄 아래에 붙여 넣어요.

📄 C:\dev\cs-practice\Program.cs (일부)
```csharp

Console.WriteLine("--- 과제 3 ---");
var rule = new NotEmptyRule();
Console.WriteLine(rule.IsValid("안녕"));
Console.WriteLine(rule.IsValid(""));
Console.WriteLine(rule.IsValid(null));
Console.WriteLine(rule.IsValid(5));
```

예상 출력:

```text
--- 과제 3 ---
True
False
False
False
```

**왜 이렇게 하나요?** `5`는 글자가 아니라서 `is string text`에서 걸려요. `null`도 글자가 아니에요. `""`는 글자지만 `text != ""`에서 걸려요. `&&` 덕분에 글자일 때만 뒤 조건을 확인하니 안전해요.
:::

:::answer 오늘 끝 상태 전체 코드
막혔다면 아래 파일 3개를 같은 내용으로 맞추고 Day 14를 시작하세요. `Streamer.cs`, `Schedule.cs`, `StreamerCard.cs`는 Day 12 그대로예요.

```text
C:\dev\cs-practice\
├─ HubConsole.csproj   (그대로)
├─ Program.cs          (오늘 바꿈)
├─ Streamer.cs         (Day 12 그대로)
├─ Schedule.cs         (Day 12 그대로)
├─ StreamerCard.cs     (Day 12 그대로)
├─ Users.cs            (오늘 새로)
├─ Notifiers.cs        (오늘 새로)
├─ bin\                (빌드 결과)
└─ obj\                (빌드 중간 파일)
```

📄 C:\dev\cs-practice\Users.cs
```csharp
namespace HubConsole;

// 모든 사용자의 기본 모양
public class User
{
    public string Name { get; set; }

    public User(string name)
    {
        Name = name;
    }

    // virtual: 자식 클래스가 이 메서드를 다시 쓸 수 있어요
    public virtual string Describe()
    {
        return $"{Name}님은 일반 사용자예요.";
    }

    // 모든 클래스가 물려받은 ToString을 다시 써서 출력 모양을 정해요
    public override string ToString()
    {
        return $"User({Name})";
    }
}

// Fan은 User를 물려받아요
public class Fan : User
{
    public Fan(string name) : base(name)
    {
    }

    public override string Describe()
    {
        return $"{Name}님은 방송을 좋아하는 팬이에요.";
    }
}

public class Admin : User
{
    public Admin(string name) : base(name)
    {
    }

    public override string Describe()
    {
        return $"{Name}님은 사이트를 관리하는 관리자예요.";
    }
}

// 과제 1: 채팅 관리자
public class Moderator : User
{
    public Moderator(string name) : base(name)
    {
    }

    public override string Describe()
    {
        return $"{Name}님은 채팅 관리자예요.";
    }
}
```

📄 C:\dev\cs-practice\Notifiers.cs
```csharp
namespace HubConsole;

// 인터페이스: "Send(글자)를 할 수 있어야 해요"라는 약속
public interface INotifier
{
    void Send(string message);
}

public class ConsoleNotifier : INotifier
{
    public void Send(string message)
    {
        Console.WriteLine($"[알림] {message}");
    }
}

public class PrefixNotifier : INotifier
{
    private readonly string prefix;

    public PrefixNotifier(string prefix)
    {
        this.prefix = prefix;
    }

    public void Send(string message)
    {
        Console.WriteLine($"{prefix} {message}");
    }
}

// 인터페이스 연습: 값이 규칙에 맞는지 알려 줘요
public interface IRule
{
    bool IsValid(object? value);
}

public class NotEmptyRule : IRule
{
    public bool IsValid(object? value)
    {
        return value is string text && text != "";
    }
}
```

📄 C:\dev\cs-practice\Program.cs
```csharp
using HubConsole;

Console.WriteLine("--- 1. 상속과 다형성 ---");
var users = new List<User>
{
    new User("새싹"),
    new Fan("민지"),
    new Admin("하늘"),
};
foreach (var user in users)
{
    Console.WriteLine(user.Describe());
}
Console.WriteLine(users[1]);

Console.WriteLine("--- 2. is 패턴 ---");
foreach (var user in users)
{
    if (user is Fan fan)
    {
        Console.WriteLine($"팬을 찾았어요: {fan.Name}");
    }
}
object? something = "스트리머 허브";
if (something is string text && text != "")
{
    Console.WriteLine($"글자예요: {text}");
}
object? nothing = null;
Console.WriteLine(nothing is null);

Console.WriteLine("--- 3. 인터페이스 ---");
var notifiers = new List<INotifier>
{
    new ConsoleNotifier(),
    new PrefixNotifier("[공지]"),
};
foreach (var notifier in notifiers)
{
    notifier.Send("오늘 저녁 8시에 방송해요");
}

Console.WriteLine("--- 과제 1 ---");
users.Add(new Moderator("바다"));
Console.WriteLine(users[3].Describe());

Console.WriteLine("--- 과제 2 ---");
foreach (var user in users)
{
    if (user is Admin admin)
    {
        Console.WriteLine(admin.Name);
    }
}

Console.WriteLine("--- 과제 3 ---");
var rule = new NotEmptyRule();
Console.WriteLine(rule.IsValid("안녕"));
Console.WriteLine(rule.IsValid(""));
Console.WriteLine(rule.IsValid(null));
Console.WriteLine(rule.IsValid(5));
```

`dotnet run`의 마지막 네 줄은 `True`, `False`, `False`, `False`이고 경고는 0개예요.
:::

## 🧯 자주 막히는 곳

여기에 없는 증상은 [문제 해결 모음](#/page/troubleshooting)에서 찾아보세요.

컴파일러 `error`·`warning` 문장이 한국어로 나오면 영어 문장 대신 `CS` 번호로 찾으세요([Day 11](#/day/p2-d11)에서 설명했어요).

### `error CS0506: … cannot override inherited member … because it is not marked virtual, abstract, or override`

```text
C:\dev\cs-practice\Users.cs(33,28): error CS0506: 'Fan.Describe()': cannot override inherited member 'User.Describe()' because it is not marked virtual, abstract, or override
```

**원인:** 자식에서 `override`를 썼는데 부모의 같은 메서드에 `virtual`이 없어요. 부모가 "다시 써도 돼요"라고 허락하지 않았다는 뜻이에요.

**해결:** 부모 `User`의 `Describe()` 앞에 `virtual`을 붙여요.

### `error CS0535: '…' does not implement interface member '…'`

```text
C:\dev\cs-practice\Notifiers.cs(9,32): error CS0535: 'ConsoleNotifier' does not implement interface member 'INotifier.Send(string)'
```

**원인:** `: INotifier`로 구현하겠다고 선언했는데 `Send(string)` 메서드가 없거나 이름·매개변수가 달라요. 이름 철자나 `public`이 빠진 경우가 많아요.

**해결:** 인터페이스에 적힌 메서드를 `public void Send(string message)`처럼 똑같이 만들어요.

### `error CS0115: '…': no suitable method found to override`

```text
C:\dev\cs-practice\Users.cs(33,28): error CS0115: 'Fan.Describee()': no suitable method found to override
```

**원인:** `override`한 메서드 이름이 부모에 없어요. 이름 오타(`Describee`)가 흔해요.

**해결:** 부모의 메서드 이름과 매개변수 목록을 똑같이 맞춰요.

### `error CS1721: Class '…' cannot have multiple base classes`

```text
C:\dev\cs-practice\Users.cs(27,26): error CS1721: Class 'Fan' cannot have multiple base classes: 'User' and 'Admin'
```

**원인:** `class Fan : User, Admin`처럼 부모 클래스를 둘 지정했어요. C#은 부모 클래스를 하나만 허용해요.

**해결:** 부모는 하나만 두고, 다른 능력은 인터페이스(`: User, INotifier`)로 더해요.

### `error CS7036` (base 생성자 인수 빠짐)

```text
C:\dev\cs-practice\Users.cs(29,12): error CS7036: There is no argument given that corresponds to the required parameter 'name' of 'User.User(string)'
```

**원인:** 부모 `User`의 생성자가 `name`을 요구하는데, 자식 생성자에서 `: base(name)`을 빠뜨렸어요.

**해결:** 자식 생성자 뒤에 `: base(name)`을 붙여요.

### `warning CS0114: '…' hides inherited member '…'`

```text
C:\dev\cs-practice\Users.cs(33,19): warning CS0114: 'Fan.Describe()' hides inherited member 'User.Describe()'. To make the current member override that implementation, add the override keyword. Otherwise add the new keyword.
```

**원인:** 자식 메서드에 `override`를 빼먹었어요. 다시 쓴 것이 아니라 부모 것을 가리는 새 메서드가 돼서, 목록에서 `User`로 부르면 부모 문장이 나와요.

**해결:** 자식 메서드 앞에 `override`를 붙여요.

## 📝 오늘의 체크리스트

- [ ] `Users.cs`와 `Notifiers.cs`가 `C:\dev\cs-practice`에 있어요.
- [ ] 같은 `Describe()` 호출이 새싹·민지·하늘에게 서로 다른 문장을 출력했어요.
- [ ] `Console.WriteLine(users[1])`이 `User(민지)`를 출력했어요.
- [ ] `[알림]`과 `[공지]` 두 모양의 알림이 한 번씩 나왔어요.
- [ ] `virtual`과 `override`가 짝이라는 것, 부모 클래스는 하나뿐이라는 것을 말할 수 있어요.
- [ ] 과제 1~3의 출력이 정답과 같고, `dotnet build`가 `0 Warning(s)`예요.

## 📚 더 알아보기

- [상속 (Microsoft Learn)](https://learn.microsoft.com/dotnet/csharp/fundamentals/object-oriented/inheritance): 기본 클래스, `virtual`, `override`를 설명한 공식 문서
- [인터페이스 (Microsoft Learn)](https://learn.microsoft.com/dotnet/csharp/fundamentals/types/interfaces): 인터페이스를 선언하고 구현하는 법을 설명한 공식 문서
- [패턴 매칭 (Microsoft Learn)](https://learn.microsoft.com/dotnet/csharp/fundamentals/functional/pattern-matching): `is` 패턴을 설명한 공식 문서

➡️ **다음 Day 예고:** [Day 14 · LINQ와 람다](#/day/p2-d14)에서는 `Where`, `Select`, `OrderBy`로 목록을 거르고 정렬해요. P1의 `filter`, `map`과 짝이에요.
