## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- `throw new InvalidOperationException("…")`으로 예외를 던지고, `try`/`catch`/`finally`로 잡아서 한국어 문장을 보여 줄 수 있어요.
- 잡지 않은 예외가 만드는 `Unhandled exception.`과 스택 추적에서 "내 파일의 몇 번째 줄"을 찾아 읽을 수 있어요.
- `async Task<List<Streamer>> LoadStreamersAsync()`를 만들고 `await`로 기다릴 수 있어요.
- `Task.WhenAll`로 기다리는 일 두 개를 동시에 시켜 시간이 줄어드는 것을 확인할 수 있어요.

**예상 시간: 100분** (개념 이해 20분 · 따라하기 52분 · 과제 20분 · 정리 8분)

:::path 📂 시작 상태
[Day 14](#/day/p2-d14)의 "오늘 끝 상태 전체 코드"가 있어야 해요. 없거나 다르면 그 코드로 먼저 맞춰 주세요. 오늘도 연습 폴더 `C:\dev\cs-practice`만 써요. `Program.cs`는 2단계에서 통째로 바꿔요.

- `C:\dev\cs-practice\HubConsole.csproj`
- `C:\dev\cs-practice\Program.cs`
- `C:\dev\cs-practice\Streamer.cs`, `Schedule.cs`, `StreamerCard.cs` ([Day 12](#/day/p2-d12), Day 14에서 `Streamer.cs`에 `Label` 추가)
- `C:\dev\cs-practice\Users.cs`, `Notifiers.cs` ([Day 13](#/day/p2-d13))
- `C:\dev\cs-practice\bin\`, `C:\dev\cs-practice\obj\` (빌드가 만드는 폴더라서 건드리지 않아요)
- `C:\dev\streamer-hub\README.md`와 `C:\dev\streamer-hub\client\` 폴더 (오늘은 열지 않아요)
- .NET 10 SDK와 VS Code C# 확장
- 켜 두어야 할 프로그램은 없어요.
:::

## 📖 개념 이해

### 예외: 프로그램이 "이건 못 하겠어요"라고 외치는 방식

**비유부터 볼게요.** 주방에서 재료가 없으면 요리사가 "계란이 없어요!" 하고 크게 외쳐요. 주방장이 그 외침을 듣고 "그럼 다른 메뉴로 하자"고 처리하면 영업이 계속돼요. 아무도 듣지 않으면 주방이 멈춰요.

**정확한 정의는 이래요.** **[[예외]]**(exception)는 프로그램이 정상으로 진행할 수 없을 때 던지는 "문제 알림"이에요. 던지는 쪽은 `throw`를 쓰고, 받는 쪽은 `try`/`catch`를 써요.

```csharp
try
{
    // 문제가 생길 수 있는 코드
}
catch (InvalidOperationException ex)
{
    // 그 종류의 예외가 나면 여기서 처리해요
}
finally
{
    // 예외가 났든 안 났든 마지막에 항상 실행돼요
}
```

P1에서 JavaScript의 [[try...catch]]를 배웠어요. 구조가 같아요. 다른 점은 `catch`가 **예외의 종류**를 골라 잡는다는 거예요. `catch (FormatException)`은 형식이 틀린 예외만, `catch (InvalidOperationException)`은 "지금 상태에서는 할 수 없는 일"만 잡아요. `catch (Exception)`은 모든 예외를 잡지만, 원인을 숨겨 버려서 문제를 찾기 어려워요. 정말 필요할 때만 써요.

오늘 보는 예외 종류예요.

| 예외 | 언제 나요 |
|---|---|
| `FormatException` | `int.Parse("abc")`처럼 글자를 숫자로 못 바꿀 때 |
| `InvalidOperationException` | 지금 상태에서 그 일을 할 수 없을 때 |
| `KeyNotFoundException` | 사전에 없는 키를 꺼낼 때 (Day 11) |

Day 11의 `TryParse`와 예외 중 무엇을 쓸까요? 입력이 틀리는 게 **자주 있는 일**(사용자가 숫자 칸에 글자를 입력)이면 `TryParse`가 좋아요. 일어나면 안 되는 **이상한 상황**(없는 번호로 찾기)이면 예외가 좋아요.

### 스택 추적: 예외가 지나온 길

잡지 않은 예외는 프로그램을 멈추고 이런 글자를 출력해요. 이것이 **[[스택 추적]]**(stack trace)이에요. 예외가 난 곳에서 시작해 "누가 누구를 불러서 여기까지 왔는지"를 위에서 아래로 보여 줘요.

```text
Unhandled exception. System.InvalidOperationException: 99번 스트리머를 찾지 못했어요.
   at HubConsole.StreamerStore.FindAsync(Int32 id) in C:\dev\cs-practice\StreamerStore.cs:line 23
   at Program.<Main>$(String[] args) in C:\dev\cs-practice\Program.cs:line 5
```

겁먹지 않아도 돼요. 두 군데만 읽으면 돼요.

1. 맨 첫 줄: `예외 종류: 메시지`. 무슨 일이 났는지 알려 줘요.
2. 그다음 `at …` 줄 중 **내 파일 이름과 줄 번호**(`StreamerStore.cs:line 23`)가 있는 맨 위 줄. 거기가 예외를 던진 곳이에요.

### using 선언: 정리를 잊지 않는 법

파일이나 연결처럼 "다 쓰면 닫아야 하는 것"이 있어요. Day 13에서 본 `IDisposable` 인터페이스가 그런 객체의 표시예요. 닫는 일은 `Dispose()` 메서드가 해요. `try`/`finally`로 직접 `Dispose()`를 부를 수도 있지만 **[[using 선언]]**(using declaration)이 더 짧아요.

```csharp
using var connection = new FakeConnection();
```

변수를 만든 `{ }` 블록이 끝나면 자동으로 `Dispose()`를 불러요. 예외가 나도 불러요. `finally`의 줄임 같은 거예요.

### Task와 async/await: 기다리는 동안 다른 일 하기

**비유:** 식당에서 주문한 음식을 기다리는 동안 가만히 서 있지 않고 다른 손님 주문도 받는 점원을 떠올려 보세요.

**[[Task]]**(태스크)는 "아직 끝나지 않았을 수도 있는 일의 약속"을 나타내는 타입이에요. 일이 끝나면 결과 값(`Task<T>`의 `T`)이 나와요. JavaScript의 Promise([[Promise]], Day 8)와 같은 역할이에요.

| JavaScript | C# |
|---|---|
| `Promise<T>` | `Task<T>` |
| `async function f()` | `async Task<T> FAsync()` |
| `await p` | `await task` |
| `Promise.all([a, b])` | `await Task.WhenAll(a, b)` |
| `setTimeout`으로 기다리기 | `await Task.Delay(1000)` |

규칙은 이래요.

- `await`는 `async`가 붙은 메서드 안에서만 써요. 파일 맨 위 문장(최상위 문장)에서는 바로 쓸 수 있어요.
- 기다리는 메서드의 이름 끝에 `Async`를 붙이는 것이 C#의 관례예요(`LoadStreamersAsync`).
- `async void`는 쓰지 않아요. 예외가 사라져 버려서 찾을 수 없어요. 항상 `async Task`를 써요.

**왜 서버가 비동기를 쓸까요?** 서버는 DB에서 데이터를 읽는 동안 CPU가 놀아요. 비동기로 쓰면 기다리는 동안 다른 사람의 요청을 받을 수 있어요. 3주 뒤에 쓸 `ToListAsync()`, `SaveChangesAsync()`가 바로 이 방식이에요(Day 21).

:::info 실무에서는
웹 서버의 엔드포인트는 거의 모두 `async Task`예요. `await db.SaveChangesAsync()`처럼 DB와 이야기하는 줄마다 `await`가 붙어요. 이 Day의 가짜 DB(`Task.Delay`)는 그 연습이에요.
:::

## 🛠️ 따라하기

5단계예요. `StreamerStore.cs`를 새로 만들고 `Program.cs`를 새로 써요.

### 1단계 · 폴더 열고 StreamerStore.cs 만들기 (12분)

**어디서:** PowerShell (위치는 어디든 괜찮아요)

**무엇을:**

1. 연습 폴더를 VS Code로 열어요.

```powershell
code C:\dev\cs-practice
```

아무것도 나오지 않고 VS Code 창이 열리면 성공이에요.

2. 탐색기 맨 위 폴더 이름 줄에 마우스를 올리고 **새 파일**(종이에 `+` 모양) 아이콘을 눌러 `StreamerStore.cs`를 만들어요.
3. 아래 코드를 붙여 넣고 `Ctrl + S`로 저장해요.

📄 C:\dev\cs-practice\StreamerStore.cs
```csharp
namespace HubConsole;

// 가짜 DB: 데이터를 불러오는 데 시간이 걸리는 것처럼 꾸며요
public class StreamerStore
{
    public async Task<List<Streamer>> LoadStreamersAsync()
    {
        await Task.Delay(1000); // 1초 기다려요
        return new List<Streamer>
        {
            new Streamer { Id = 1, Name = "달빛곰", Platform = "chzzk" },
            new Streamer { Id = 2, Name = "픽셀토끼", Platform = "youtube" },
            new Streamer { Id = 3, Name = "노을고양이", Platform = "soop" },
        };
    }

    // 번호로 한 명을 찾아요. 없으면 예외를 던져요.
    public async Task<Streamer> FindAsync(int id)
    {
        await Task.Delay(300);
        if (id < 1 || id > 3)
        {
            throw new InvalidOperationException($"{id}번 스트리머를 찾지 못했어요.");
        }
        var all = new[] { "달빛곰", "픽셀토끼", "노을고양이" };
        return new Streamer { Id = id, Name = all[id - 1] };
    }
}

// IDisposable: 다 쓰고 나면 정리할 것이 있는 객체예요
public class FakeConnection : IDisposable
{
    public FakeConnection()
    {
        Console.WriteLine("연결을 열었어요");
    }

    public void Dispose()
    {
        Console.WriteLine("연결을 닫았어요");
    }
}
```

- 반환 타입 `Task<List<Streamer>>`는 "나중에 `List<Streamer>`가 나올 약속"이에요. 메서드 앞의 `async`가 안에서 `await`를 쓰겠다는 표시예요.
- `await Task.Delay(1000)`은 1초를 기다리는 가짜 일이에요. 기다리는 동안 프로그램은 막히지 않아요.
- `throw new InvalidOperationException(…)`은 예외를 던져요. 메시지는 사람이 읽는 한국어 문장이에요.
- `FakeConnection : IDisposable`은 Day 13의 인터페이스 구현이에요. `Dispose()`가 정리하는 자리예요.

:::success
탐색기에 `StreamerStore.cs`가 보이고 코드에 빨간 물결 밑줄이 없어요. 터미널(`` Ctrl + ` ``)에서 `dotnet build`를 실행하면 `0 Warning(s)`, `0 Error(s)`가 나와요.
:::

### 2단계 · await로 기다리기 (10분)

**어디서:** VS Code → `C:\dev\cs-practice\Program.cs`

**무엇을:** `Ctrl + A`, `Delete`로 비운 뒤 아래 코드를 붙여 넣고 저장해요.

📄 C:\dev\cs-practice\Program.cs (일부)
```csharp
using HubConsole;

var store = new StreamerStore();

Console.WriteLine("--- 1. async와 await ---");
Console.WriteLine("불러오는 중...");
var streamers = await store.LoadStreamersAsync();
foreach (var streamer in streamers)
{
    Console.WriteLine($"- {streamer.Name}");
}
```

`await store.LoadStreamersAsync()`는 "결과가 나올 때까지 기다렸다가 `List<Streamer>`를 받아요"라는 뜻이에요. `await`를 빼면 목록이 아니라 `Task`가 와서 아래 코드가 오류가 나요.

**어디서:** VS Code 터미널 (`PS C:\dev\cs-practice>`)

```powershell
dotnet run
```

예상 출력(두 번째 줄 `불러오는 중...`이 나오고 약 1초 뒤에 목록이 나와요):

```text
--- 1. async와 await ---
불러오는 중...
- 달빛곰
- 픽셀토끼
- 노을고양이
```

:::success
`불러오는 중...`이 먼저 나오고 약 1초 뒤에 이름 3줄이 이어서 나와요. 경고나 오류는 없어요.
:::

### 3단계 · try, catch, finally (12분)

**어디서:** VS Code → `C:\dev\cs-practice\Program.cs` 맨 아래

**무엇을:** 맨 마지막 줄 아래에 빈 줄을 하나 두고 붙여 넣은 뒤 저장해요.

📄 C:\dev\cs-practice\Program.cs (일부)
```csharp

Console.WriteLine("--- 2. try, catch, finally ---");
try
{
    var one = await store.FindAsync(2);
    Console.WriteLine($"찾았어요: {one.Name}");
    var two = await store.FindAsync(99);
    Console.WriteLine($"찾았어요: {two.Name}");
}
catch (InvalidOperationException ex)
{
    Console.WriteLine($"잡았어요: {ex.Message}");
}
finally
{
    Console.WriteLine("정리했어요");
}
```

- 2번은 있어서 `찾았어요`가 나와요. 99번은 `FindAsync`가 예외를 던져서 `try` 안의 나머지 줄은 실행되지 않고 `catch`로 점프해요.
- `ex.Message`는 `throw`할 때 적은 문장이에요.
- `finally`는 예외가 났든 아니든 실행돼요.

**어디서:** VS Code 터미널

```powershell
dotnet run
```

예상 출력(앞 출력 아래에 이어져요):

```text
--- 2. try, catch, finally ---
찾았어요: 픽셀토끼
잡았어요: 99번 스트리머를 찾지 못했어요.
정리했어요
```

:::success
`찾았어요: 픽셀토끼`, `잡았어요: 99번 스트리머를 찾지 못했어요.`, `정리했어요`가 차례로 나와요. `찾았어요`가 두 번 나오지 않아요(99번은 건너뛰었어요).
:::

### 4단계 · 잡지 않은 예외와 스택 추적 읽기 (8분)

일부러 잡지 않은 예외를 만들어서 어떻게 보이는지 읽어 볼게요.

**어디서:** VS Code → `C:\dev\cs-practice\Program.cs` 맨 아래

**무엇을:**

1. 맨 마지막 줄 아래에 아래 한 줄을 붙여 넣고 저장해요.

📄 C:\dev\cs-practice\Program.cs (일부)
```csharp
var missing = await store.FindAsync(99);
```

2. 터미널에서 실행해요.

```powershell
dotnet run
```

예상 출력(앞 출력 뒤에 이어져요. 줄 번호와 경로는 달라도 돼요):

```text
Unhandled exception. System.InvalidOperationException: 99번 스트리머를 찾지 못했어요.
   at HubConsole.StreamerStore.FindAsync(Int32 id) in C:\dev\cs-practice\StreamerStore.cs:line 23
   at Program.<Main>$(String[] args) in C:\dev\cs-practice\Program.cs:line 29
   at Program.<Main>(String[] args)
```

읽는 법이에요.

- 첫 줄 `Unhandled exception.`은 "아무도 잡지 않은 예외"라는 뜻이에요. 뒤의 `System.InvalidOperationException: 99번 스트리머를 찾지 못했어요.`가 종류와 메시지예요.
- 첫 번째 `at` 줄이 예외를 **던진 곳**이에요. `StreamerStore.cs:line 23`이 `throw` 줄이에요. 그 파일 23번째 줄을 열어 보세요.
- 두 번째 `at` 줄이 그 메서드를 **부른 곳**(`Program.cs:line 29`)이에요. 이렇게 던진 곳에서 부른 곳으로 거슬러 올라가요.
- 마지막 줄은 .NET이 자동으로 만든 줄이라서 무시해도 돼요.

3. 확인했으면 방금 붙여 넣은 `var missing = await store.FindAsync(99);` 줄을 **지우고** 저장해요. 다시 `dotnet run`을 실행해요.

:::success
`Unhandled exception.`이 사라지고 3단계의 출력(`정리했어요`까지)이 정상으로 끝나요.
:::

### 5단계 · using 선언과 Task.WhenAll (10분)

**어디서:** VS Code → `C:\dev\cs-practice\Program.cs` 맨 아래

**무엇을:** 맨 마지막 줄 아래에 빈 줄을 하나 두고 붙여 넣은 뒤 저장해요.

📄 C:\dev\cs-practice\Program.cs (일부)
```csharp

Console.WriteLine("--- 3. using 선언 ---");
{
    using var connection = new FakeConnection();
    Console.WriteLine("연결을 쓰는 중");
}
Console.WriteLine("블록이 끝났어요");

Console.WriteLine("--- 4. Task.WhenAll ---");
var listTask = store.LoadStreamersAsync();
var findTask = store.FindAsync(1);
await Task.WhenAll(listTask, findTask);
var list = await listTask;
var first = await findTask;
Console.WriteLine($"{list.Count}명, 1번은 {first.Name}");
```

- `{ … }` 블록 안의 `using var`는 블록이 끝나는 `}`에서 `Dispose()`를 불러요. 그래서 `연결을 닫았어요`가 `블록이 끝났어요`보다 먼저 나와요.
- `listTask`, `findTask`는 `await` 없이 받아서, 두 일을 **먼저 모두 시작**해요. 그다음 `Task.WhenAll`로 둘이 다 끝나기를 한꺼번에 기다려요.

**어디서:** VS Code 터미널

```powershell
dotnet run
```

예상 출력(앞 출력 아래에 이어져요):

```text
--- 3. using 선언 ---
연결을 열었어요
연결을 쓰는 중
연결을 닫았어요
블록이 끝났어요
--- 4. Task.WhenAll ---
3명, 1번은 달빛곰
```

:::success
`연결을 열었어요` → `연결을 쓰는 중` → `연결을 닫았어요` → `블록이 끝났어요` 순서로 나오고, 마지막에 `3명, 1번은 달빛곰`이 나와요. 경고는 0개예요.
:::

## ✍️ 과제

### 과제 1 · int.Parse의 예외 잡기 (쉬움 ⭐, 6분)

- `int.Parse("abc")`를 `try` 안에서 실행하고 `catch (FormatException ex)`로 잡아 `숫자가 아니에요: …`와 `ex.Message`를 출력해요.
- 같은 글자를 `TryParse`로 바꿔 보고, 실패했을 때 `-1`을 출력해요(Day 11의 방식과 비교).

### 과제 2 · 차례로 vs 함께 시간 재기 (보통 ⭐⭐, 8분)

- `await Task.Delay(1000)`을 두 번 이어서 실행하고 걸린 시간을, `Task.WhenAll(Task.Delay(1000), Task.Delay(1000))`로 실행하고 걸린 시간을 비교해요.
- 시간은 `System.Diagnostics.Stopwatch`를 써요. 출력은 `차례로: 약 2초`, `함께: 약 1초` 모양이에요.
- 힌트: `watch.Elapsed.TotalSeconds`를 `Math.Round(…)`로 반올림해요. 두 번째 측정 전에 `watch.Restart()`를 불러요.

### 과제 3 · finally는 언제나 실행돼요 (쉬움 ⭐, 6분)

- `try` 안에서 일부러 예외를 던지고, `try 시작`, `catch 실행`, `finally 실행`의 출력 순서를 확인해요.
- 예외를 던지는 줄은 `throw new InvalidOperationException("일부러 낸 예외");`예요.

## ✅ 정답

:::answer 과제 1 정답 · FormatException
📄 C:\dev\cs-practice\Program.cs (일부)
```csharp

Console.WriteLine("--- 과제 1 ---");
try
{
    var value = int.Parse("abc");
    Console.WriteLine(value);
}
catch (FormatException ex)
{
    Console.WriteLine($"숫자가 아니에요: {ex.Message}");
}
Console.WriteLine(int.TryParse("abc", out var parsed) ? parsed : -1);
```

예상 출력:

```text
--- 과제 1 ---
숫자가 아니에요: The input string 'abc' was not in a correct format.
-1
```

**왜 이렇게 하나요?** `int.Parse`는 실패하면 예외를 던지고, `TryParse`는 `false`를 돌려줘요. 사용자의 입력처럼 틀리는 일이 흔한 곳에서는 `TryParse`가 읽기 쉽고 빨라요. `ex.Message`의 영어 문장은 .NET이 만든 것이라 그대로 나와요.
:::

:::answer 과제 2 정답 · 시간 비교
📄 C:\dev\cs-practice\Program.cs (일부)
```csharp

Console.WriteLine("--- 과제 2 ---");
var watch = System.Diagnostics.Stopwatch.StartNew();
await Task.Delay(1000);
await Task.Delay(1000);
Console.WriteLine($"차례로: 약 {Math.Round(watch.Elapsed.TotalSeconds)}초");

watch.Restart();
await Task.WhenAll(Task.Delay(1000), Task.Delay(1000));
Console.WriteLine($"함께: 약 {Math.Round(watch.Elapsed.TotalSeconds)}초");
```

예상 출력(실행에 약 3초가 걸려요):

```text
--- 과제 2 ---
차례로: 약 2초
함께: 약 1초
```

**왜 이렇게 하나요?** `await`를 두 번 이어 쓰면 첫 일이 끝나야 둘째가 시작돼서 합쳐 2초예요. `WhenAll`은 둘을 함께 시작해서 오래 걸리는 쪽 시간(1초)만 걸려요. 서로 상관없는 DB 조회를 여러 개 할 때 이 방법으로 시간을 줄여요.
:::

:::answer 과제 3 정답 · finally
📄 C:\dev\cs-practice\Program.cs (일부)
```csharp

Console.WriteLine("--- 과제 3 ---");
try
{
    Console.WriteLine("try 시작");
    throw new InvalidOperationException("일부러 낸 예외");
}
catch (InvalidOperationException)
{
    Console.WriteLine("catch 실행");
}
finally
{
    Console.WriteLine("finally 실행");
}
```

예상 출력:

```text
--- 과제 3 ---
try 시작
catch 실행
finally 실행
```

**왜 이렇게 하나요?** `throw` 줄 아래는 실행되지 않고 바로 `catch`로 가요. 그다음 `finally`가 마지막에 실행돼요. `catch`가 없어도, `return`을 해도 `finally`는 실행돼요. 그래서 닫기·정리 같은 일을 여기에 둬요.
:::

:::answer 오늘 끝 상태 전체 코드
막혔다면 아래 두 파일을 같은 내용으로 맞추고 Day 16을 시작하세요. 다른 파일은 Day 14 그대로예요. 4단계의 `var missing = …` 줄은 지워진 상태여야 해요.

```text
C:\dev\cs-practice\
├─ HubConsole.csproj   (그대로)
├─ Program.cs          (오늘 바꿈)
├─ StreamerStore.cs    (오늘 새로)
├─ Streamer.cs         (Day 14 그대로)
├─ Schedule.cs         (Day 12 그대로)
├─ StreamerCard.cs     (Day 12 그대로)
├─ Users.cs            (Day 13 그대로)
├─ Notifiers.cs        (Day 13 그대로)
├─ bin\                (빌드 결과)
└─ obj\                (빌드 중간 파일)
```

📄 C:\dev\cs-practice\StreamerStore.cs
```csharp
namespace HubConsole;

// 가짜 DB: 데이터를 불러오는 데 시간이 걸리는 것처럼 꾸며요
public class StreamerStore
{
    public async Task<List<Streamer>> LoadStreamersAsync()
    {
        await Task.Delay(1000); // 1초 기다려요
        return new List<Streamer>
        {
            new Streamer { Id = 1, Name = "달빛곰", Platform = "chzzk" },
            new Streamer { Id = 2, Name = "픽셀토끼", Platform = "youtube" },
            new Streamer { Id = 3, Name = "노을고양이", Platform = "soop" },
        };
    }

    // 번호로 한 명을 찾아요. 없으면 예외를 던져요.
    public async Task<Streamer> FindAsync(int id)
    {
        await Task.Delay(300);
        if (id < 1 || id > 3)
        {
            throw new InvalidOperationException($"{id}번 스트리머를 찾지 못했어요.");
        }
        var all = new[] { "달빛곰", "픽셀토끼", "노을고양이" };
        return new Streamer { Id = id, Name = all[id - 1] };
    }
}

// IDisposable: 다 쓰고 나면 정리할 것이 있는 객체예요
public class FakeConnection : IDisposable
{
    public FakeConnection()
    {
        Console.WriteLine("연결을 열었어요");
    }

    public void Dispose()
    {
        Console.WriteLine("연결을 닫았어요");
    }
}
```

📄 C:\dev\cs-practice\Program.cs
```csharp
using HubConsole;

var store = new StreamerStore();

Console.WriteLine("--- 1. async와 await ---");
Console.WriteLine("불러오는 중...");
var streamers = await store.LoadStreamersAsync();
foreach (var streamer in streamers)
{
    Console.WriteLine($"- {streamer.Name}");
}

Console.WriteLine("--- 2. try, catch, finally ---");
try
{
    var one = await store.FindAsync(2);
    Console.WriteLine($"찾았어요: {one.Name}");
    var two = await store.FindAsync(99);
    Console.WriteLine($"찾았어요: {two.Name}");
}
catch (InvalidOperationException ex)
{
    Console.WriteLine($"잡았어요: {ex.Message}");
}
finally
{
    Console.WriteLine("정리했어요");
}

Console.WriteLine("--- 3. using 선언 ---");
{
    using var connection = new FakeConnection();
    Console.WriteLine("연결을 쓰는 중");
}
Console.WriteLine("블록이 끝났어요");

Console.WriteLine("--- 4. Task.WhenAll ---");
var listTask = store.LoadStreamersAsync();
var findTask = store.FindAsync(1);
await Task.WhenAll(listTask, findTask);
var list = await listTask;
var first = await findTask;
Console.WriteLine($"{list.Count}명, 1번은 {first.Name}");

Console.WriteLine("--- 과제 1 ---");
try
{
    var value = int.Parse("abc");
    Console.WriteLine(value);
}
catch (FormatException ex)
{
    Console.WriteLine($"숫자가 아니에요: {ex.Message}");
}
Console.WriteLine(int.TryParse("abc", out var parsed) ? parsed : -1);

Console.WriteLine("--- 과제 2 ---");
var watch = System.Diagnostics.Stopwatch.StartNew();
await Task.Delay(1000);
await Task.Delay(1000);
Console.WriteLine($"차례로: 약 {Math.Round(watch.Elapsed.TotalSeconds)}초");

watch.Restart();
await Task.WhenAll(Task.Delay(1000), Task.Delay(1000));
Console.WriteLine($"함께: 약 {Math.Round(watch.Elapsed.TotalSeconds)}초");

Console.WriteLine("--- 과제 3 ---");
try
{
    Console.WriteLine("try 시작");
    throw new InvalidOperationException("일부러 낸 예외");
}
catch (InvalidOperationException)
{
    Console.WriteLine("catch 실행");
}
finally
{
    Console.WriteLine("finally 실행");
}
```

`dotnet run`은 약 6초 뒤에 `finally 실행`으로 끝나고 경고는 0개예요. 이 Day로 C# 연습 폴더 공부는 끝이에요. 내일부터는 `C:\dev\streamer-hub`으로 돌아와요.
:::

## 🧯 자주 막히는 곳

여기에 없는 증상은 [문제 해결 모음](#/page/troubleshooting)에서 찾아보세요.

컴파일러 `error`·`warning` 문장이 한국어로 나오면 영어 문장 대신 `CS` 번호로 찾으세요([Day 11](#/day/p2-d11)에서 설명했어요).

### `error CS4033: The 'await' operator can only be used within an async method.`

```text
C:\dev\cs-practice\Program.cs(8,16): error CS4033: The 'await' operator can only be used within an async method. Consider marking this method with the 'async' modifier and changing its return type to 'Task'.
```

**원인:** `await`를 `async`가 없는 메서드 안에서 썼어요. 파일 맨 위 문장에서는 괜찮지만, `void PrintAll()` 같은 메서드 안에서는 안 돼요.

**해결:** 메서드를 `async Task PrintAll()`로 바꾸고, 부르는 곳에서도 `await PrintAll();`로 불러요. (비슷한 오류로 `CS4032`가 나올 수도 있어요.)

### `warning CS4014: Because this call is not awaited, …`

```text
C:\dev\cs-practice\Program.cs(10,5): warning CS4014: Because this call is not awaited, execution of the current method continues before the call is completed. Consider applying the 'await' operator to the result of the call.
```

**원인:** `Task`를 돌려주는 메서드를 부르고 `await`를 빼먹었어요. 결과를 기다리지 않아서, 그 일이 끝나기 전에 다음 줄이 실행돼요.

**해결:** 부르는 앞에 `await`를 붙여요. 일부러 기다리지 않을 거면 의도를 남겨 두고 경고는 0개로 만들어요.

### 예외가 나는데 `catch`에서 잡히지 않아요

**원인:** `catch (FormatException)`처럼 종류가 맞지 않으면 잡히지 않아요. 예외의 종류는 `Unhandled exception.` 바로 뒤에 적혀 있어요.

**해결:** 스택 추적 첫 줄의 예외 이름과 `catch ( )` 안의 이름을 맞춰요.

### `catch (Exception)`으로 다 잡았더니 원인을 못 봐요

**원인:** 모든 예외를 잡아서 아무것도 안 하면, 문제가 생겨도 조용히 지나가요.

**해결:** 꼭 필요한 종류만 잡고, 잡았을 때는 `ex.Message`를 출력하거나 기록해요.

### `async void` 메서드의 예외가 사라져요

**원인:** `async void`는 예외를 부르는 쪽이 받을 방법이 없어서 프로그램이 알 수 없는 상태로 멈추거나 조용히 사라져요.

**해결:** 항상 `async Task`로 만들고 `await`로 불러요.

### 스택 추적이 너무 길어서 무서워요

**원인:** 서버 코드에서는 수십 줄이 나올 수 있어요. 대부분은 .NET 내부 줄이에요.

**해결:** 첫 줄(예외 종류와 메시지)과, `at` 줄 중 **내 파일 이름(`.cs`)과 줄 번호**가 있는 맨 위 줄만 보세요.

## 📝 오늘의 체크리스트

- [ ] `StreamerStore.cs`가 있고 `dotnet build`가 `0 Warning(s)`예요.
- [ ] `불러오는 중...` 뒤 약 1초 뒤에 이름 3줄이 나왔어요.
- [ ] `잡았어요: 99번 스트리머를 찾지 못했어요.`와 `정리했어요`가 나왔어요.
- [ ] 일부러 잡지 않은 예외를 만들어 `Unhandled exception.`과 `StreamerStore.cs:line …`을 읽었고, 그 줄을 지웠어요.
- [ ] `연결을 닫았어요`가 `블록이 끝났어요`보다 먼저 나왔어요.
- [ ] 과제 2에서 `차례로: 약 2초`, `함께: 약 1초`를 확인했어요.
- [ ] 과제를 풀고 정답과 비교했어요.

## 📚 더 알아보기

- [예외 처리 (Microsoft Learn)](https://learn.microsoft.com/dotnet/csharp/fundamentals/exceptions/): `try`/`catch`/`finally`와 `throw`를 설명한 공식 문서
- [Task 기반 비동기 프로그래밍 (Microsoft Learn)](https://learn.microsoft.com/dotnet/csharp/asynchronous-programming/): `async`/`await`와 `Task`를 설명한 공식 문서
- [using 문 (Microsoft Learn)](https://learn.microsoft.com/dotnet/csharp/language-reference/statements/using): `using` 선언으로 정리를 보장하는 법을 설명한 공식 문서

➡️ **다음 Day 예고:** [Day 16 · HTTP와 REST](#/day/p2-d16)에서는 브라우저와 서버가 주고받는 요청과 응답의 모양을 배우고, VS Code에서 `.http` 파일로 직접 요청을 보내 봐요.
