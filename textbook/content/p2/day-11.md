## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- 반환 타입, 매개변수, 기본값, 이름 있는 인수가 있는 C# 메서드를 만들어 부를 수 있어요.
- `List<string>`과 `Dictionary<string, int>`에 값을 넣고, 꺼내고, 세고, 한 개씩 돌아볼 수 있어요.
- "없을 수도 있는 값"(`string?`)을 `is null`, `??`, `?.`로 안전하게 다루고, 경고 `CS8602`를 읽고 고칠 수 있어요.
- `int.TryParse(text, out var number)`로 글자를 숫자로 안전하게 바꿀 수 있어요.

**예상 시간: 100분** (개념 이해 20분 · 따라하기 55분 · 과제 18분 · 정리 7분)

:::path 📂 시작 상태
[Day 10](#/day/p2-d10)의 "오늘 끝 상태 전체 코드"가 있어야 해요. 없거나 다르면 그 코드로 먼저 맞춰 주세요. 오늘 쓰는 곳은 연습 폴더 `C:\dev\cs-practice` 하나예요. 안에 있는 `Program.cs`는 1단계에서 통째로 바꾸니, Day 10에서 쓴 코드가 남아 있어도 괜찮아요.

- `C:\dev\cs-practice\HubConsole.csproj`
- `C:\dev\cs-practice\Program.cs`
- `C:\dev\cs-practice\bin\`, `C:\dev\cs-practice\obj\` (빌드가 만드는 폴더라서 건드리지 않아요)
- `C:\dev\streamer-hub\README.md`와 `C:\dev\streamer-hub\client\` 폴더 (오늘은 열지 않아요)
- .NET 10 SDK: PowerShell에서 `dotnet --version`을 치면 `10.0.`으로 시작하는 숫자가 나와요.
- VS Code의 C# 확장(`ms-dotnettools.csharp`)이 설치되어 있어요.
- 켜 두어야 할 프로그램은 없어요.
:::

## 📖 개념 이해

### 메서드: 이름을 붙여 둔 일 묶음

**비유부터 볼게요.** 식당 주방에 "김치볶음밥 만들기"라는 레시피 카드가 있어요. 주문이 들어올 때마다 순서를 다시 생각하지 않고 카드 이름만 부르면 돼요. 카드에는 필요한 재료(매개변수)가 적혀 있고, 일이 끝나면 완성된 음식(반환값)이 나와요.

**정확한 정의는 이래요.** C#의 **[[메서드]]**(method)는 이름을 붙여 둔 코드 묶음이에요. [[함수]]와 같은 생각이에요. P1에서는 객체 안의 함수를 메서드라고 불렀는데, C#은 거의 모든 함수를 클래스 안에 두기 때문에 C#에서는 함수를 그냥 메서드라고 불러요. JavaScript 함수와 달라진 점은 이름 앞에 **타입을 적는다**는 것이에요.

```text
string Greet(string name)
│      │     └ 매개변수: 타입 + 이름
│      └ 메서드 이름
└ 반환 타입: 돌려줄 값의 타입
```

- 돌려줄 값이 없으면 반환 타입에 `void`를 적어요. `void PrintDivider()`처럼요.
- 매개변수에 `= "아침"`처럼 기본값을 적으면, 부르는 쪽이 그 인수를 빼도 돼요.
- 부를 때 `Label(name: "노을고양이", isAdmin: false)`처럼 `이름:`을 붙이면 순서와 상관없이 무엇을 넣는지 읽혀요. 이것을 이름 있는 인수라고 불러요. 인수는 메서드를 부를 때 넘기는 값이에요.

P1 JavaScript와 비교하면 이래요.

| 무엇 | JavaScript | C# |
|---|---|---|
| 선언 | `function greet(name) {` | `string Greet(string name)` |
| 타입 | 적지 않아요 | 반환 타입과 매개변수 타입을 꼭 적어요 |
| 기본값 | `function f(a = 1)` | `string F(int a = 1)` |

C# 메서드 이름은 관례로 **대문자로 시작**해요(`Greet`). 변수 이름은 소문자로 시작해요(`name`).

### 컬렉션: 여러 개를 담는 상자

**비유:** 장바구니에는 물건을 마음대로 담고 뺄 수 있어요. 반면 도시락 칸은 칸 수가 정해져 있어요. 배열은 도시락 칸, List는 장바구니예요.

**정확한 정의:** **[[컬렉션]]**(collection)은 같은 종류의 값 여러 개를 담는 자료 구조를 부르는 말이에요. 오늘 쓰는 두 가지는 이래요.

- **[[List]]**(리스트)는 값을 순서대로 담는 컬렉션이에요. 나중에 `Add`로 넣고 `Remove`로 뺄 수 있어서 크기가 변해요. `List<string>`은 "글자만 담는 List"예요. 꺾쇠 안의 타입은 [[제네릭]]이에요. Day 6에서 본 `Array<T>`와 같은 생각이에요.
- **[[Dictionary]]**(딕셔너리)는 **키**로 값을 찾는 컬렉션이에요. 사전에서 낱말(키)로 뜻(값)을 찾는 것과 같아요. `Dictionary<string, int>`는 "글자 키 → 정수 값"이에요. P1의 [[객체]]를 `{ chzzk: 3 }`처럼 쓰던 것과 비슷해요.

```text
List<string>          Dictionary<string, int>
0 → "달빛곰"          "chzzk"   → 3
1 → "노을고양이"      "youtube" → 1
2 → "별빛여우"        "soop"    → 1
번호(인덱스)로 찾아요  키로 찾아요
```

List는 번호(인덱스)가 0부터 시작해요. `names[0]`이 첫 번째예요. 번호는 [[인덱스]]에서 배웠어요.

:::info 실무에서는
회원 목록이나 글 목록을 서버가 다룰 때도 `List<T>`가 가장 많이 나와요. 3주 뒤에 만들 서버는 DB에서 읽은 스트리머 여러 명을 `List<Streamer>`로 받아서 JSON으로 돌려줘요. `Dictionary`는 "오류 이름 → 오류 문장들"처럼 짝을 지어 둘 때 써요.
:::

### 없을 수도 있는 값: nullable

**비유:** 우편함이 비어 있을 수 있어요. 비어 있는 우편함에 손을 넣어 편지를 꺼내려고 하면 헛손질이에요. 먼저 "편지가 있나?"를 확인해야 해요.

**정확한 정의:** C#에서 **[[nullable]]**(널러블)은 "값이 없음([[null]])이 될 수도 있다"는 표시예요. 타입 뒤에 `?`를 붙여요(`string?`, `int?`). `?`가 없는 `string`은 "null이 되면 안 되는 글자"라는 약속이에요. 이 약속은 프로젝트 파일(`HubConsole.csproj`)의 `<Nullable>enable</Nullable>` 줄이 켜 줘요. Day 9에서 본 줄이에요.

null을 다루는 연산자는 TypeScript에서 배운 것과 같아요(Day 5).

| 쓰는 법 | 뜻 |
|---|---|
| `x is null` / `x is not null` | null인지 확인해요 (`==` 대신 이 표현을 많이 써요) |
| `x ?? "기본"` | x가 null이면 "기본"을 써요 ([[null 병합 연산자]]) |
| `x?.Length` | x가 null이면 멈추고 null, 아니면 `Length` ([[옵셔널 체이닝]]) |

`string?` 값을 null 확인 없이 `missing.Length`처럼 쓰면 컴파일러가 **경고**(warning)를 내요. 경고와 오류(error)는 달라요.

- **오류**(error, `error CS…`)는 빌드가 멈춰요. 실행할 수 없어요.
- **경고**(warning, `warning CS…`)는 빌드가 끝나고 실행도 돼요. 하지만 "이대로 실행하면 터질 수 있어요"라는 뜻이에요. 경고를 무시하지 않고 0개로 만드는 습관을 들여요.

### out 매개변수: 결과를 두 개 돌려받기

`int.Parse("abc")`는 숫자가 아닌 글자를 받으면 프로그램을 멈춰 버려요(예외는 Day 15). 그래서 "바꿔 보고, 됐는지 알려 줘요"라는 `TryParse`를 써요. 이 메서드는 두 가지를 알려 줘야 해요. 됐는지(`true`/`false`)와 바뀐 숫자예요. 돌려줄 수 있는 값이 하나뿐이라서, 숫자는 매개변수를 통해 되돌려 받아요.

**[[out 매개변수]]**(아웃 매개변수)는 메서드가 안에서 값을 채워 되돌려 주는 매개변수예요. 부를 때 `out`을 붙여요. `out var number`는 "여기에 결과를 담을 새 변수 `number`를 만들어 주세요"라는 뜻이에요.

```csharp
if (int.TryParse(text, out var number))
```

레퍼런스 코드 `Dtos/HttpUrlAttribute.cs`에도 `Uri.TryCreate(text, UriKind.Absolute, out var uri)`가 나와요. 주소 글자가 올바른 주소인지 확인하는 줄이에요. Day 34에서 그 파일을 만들 때 오늘 배운 `out var`가 다시 나와요.

## 🛠️ 따라하기

연습 프로그램 하나(`Program.cs`)에 단계마다 코드를 **맨 아래에 붙여** 가면서 모두 6단계로 키워요. 코드 블록 오른쪽 위의 **복사** 버튼을 써도 되고, 직접 타이핑해도 돼요. 직접 치면 눈에 더 잘 남아요.

### 1단계 · 연습 폴더 열고 Program.cs 비우기 (5분)

오늘부터 코드를 한 파일에 쌓아 가요. 시작 전에 파일을 깨끗하게 만들어 둬요.

**어디서:** PowerShell (위치는 어디든 괜찮아요)

**무엇을:**

1. 터미널에서 연습 폴더를 VS Code로 열어요.

```powershell
code C:\dev\cs-practice
```

아무것도 나오지 않고 VS Code 창이 열리면 성공이에요. 다음 줄에 `PS C:\...>`가 다시 보여요.

2. VS Code 왼쪽 탐색기에서 `Program.cs`를 클릭해요.
3. `Ctrl + A`로 전체를 선택하고 `Delete`를 눌러 내용을 모두 지워요.
4. VS Code 안에서 터미널을 열어요. 메뉴 **터미널 → 새 터미널**을 누르거나 `` Ctrl + ` ``(숫자 1 왼쪽의 백틱 키)를 눌러요.

:::success
`Program.cs`가 비어 있고, VS Code 아래쪽 터미널의 프롬프트가 `PS C:\dev\cs-practice>`로 끝나요. 다르면 `cd C:\dev\cs-practice`를 입력해서 옮겨요.
:::

### 2단계 · 메서드 만들고 부르기 (10분)

메서드는 쓰는 곳 아래에 적어도 돼요. 최상위 문장(Day 9)으로 쓴 파일에서는 부르는 코드를 위에 쓰고, 메서드 선언을 아래에 두면 위에서 아래로 읽기 편해요.

**어디서:** VS Code → `C:\dev\cs-practice\Program.cs` (빈 파일)

**무엇을:** 아래 코드를 붙여 넣고 `Ctrl + S`로 저장해요.

📄 C:\dev\cs-practice\Program.cs (일부)
```csharp
Console.WriteLine("--- 1. 메서드 ---");
Console.WriteLine(Greet("달빛곰"));
Console.WriteLine(Greet("픽셀토끼", "저녁"));
Console.WriteLine(Label(name: "노을고양이", isAdmin: false));
PrintDivider();

string Greet(string name, string timeOfDay = "아침")
{
    return $"{timeOfDay} 인사: {name}님, 안녕하세요!";
}

string Label(string name, bool isAdmin)
{
    return isAdmin ? $"{name} (관리자)" : name;
}

void PrintDivider()
{
    Console.WriteLine("----------");
}
```

코드를 읽어 볼게요.

- `Greet("달빛곰")`은 인수를 하나만 줬어요. 두 번째 매개변수 `timeOfDay`는 기본값 `"아침"`이 들어가요.
- `Greet("픽셀토끼", "저녁")`은 기본값 대신 `"저녁"`을 넘겨요.
- `Label(name: "노을고양이", isAdmin: false)`는 이름 있는 인수예요. 레퍼런스의 `PostService`도 이렇게 `isAdmin: false`를 써요.
- `PrintDivider()`는 돌려줄 값이 없어서 `void`예요.
- `$"…{name}…"`은 [[문자열 보간]]이에요(Day 10).

**어디서:** VS Code 아래쪽 터미널 (`PS C:\dev\cs-practice>`)

```powershell
dotnet run
```

예상 출력:

```text
--- 1. 메서드 ---
아침 인사: 달빛곰님, 안녕하세요!
저녁 인사: 픽셀토끼님, 안녕하세요!
노을고양이
----------
```

:::success
네 줄이 위 출력과 같아요. 첫 줄은 `--- 1. 메서드 ---`예요. 빨간 글자(오류)가 나왔다면 아래 🧯 자주 막히는 곳을 보고, `CS`로 시작하는 번호와 `Program.cs(줄,칸)`을 읽어 그 줄을 확인해요.
:::

### 3단계 · List 다루기 (10분)

**어디서:** VS Code → `C:\dev\cs-practice\Program.cs`

**무엇을:** 파일의 **맨 마지막 줄(`}` 줄) 아래**에 빈 줄을 하나 두고 아래 코드를 붙여 넣어요. 저장은 `Ctrl + S`예요.

📄 C:\dev\cs-practice\Program.cs (일부)
```csharp

Console.WriteLine("--- 2. List ---");
var names = new List<string> { "달빛곰", "픽셀토끼", "노을고양이" };
names.Add("별빛여우");
names.Remove("픽셀토끼");
Console.WriteLine($"모두 {names.Count}명");
Console.WriteLine($"첫 번째: {names[0]}");
foreach (var streamerName in names)
{
    Console.WriteLine($"- {streamerName}");
}
Console.WriteLine(names.Contains("달빛곰"));
Console.WriteLine(names.Contains("픽셀토끼"));
```

- `new List<string> { "달빛곰", … }`은 만들면서 바로 값을 채우는 **컬렉션 초기화**예요.
- `Add`는 맨 뒤에 넣고, `Remove`는 같은 값을 찾아 지워요. `Count`는 지금 몇 개인지 알려 줘요. 배열의 `length`와 이름이 달라요.
- `names[0]`처럼 번호로 꺼내요. `foreach`는 하나씩 돌아요([[for...of]]와 같은 생각이에요).
- `Contains`는 있는지 `True`/`False`로 알려 줘요. C#은 true를 `True`로 출력해요.

**어디서:** VS Code 아래쪽 터미널

```powershell
dotnet run
```

예상 출력(앞 단계 출력 아래에 이어져요):

```text
--- 2. List ---
모두 3명
첫 번째: 달빛곰
- 달빛곰
- 노을고양이
- 별빛여우
True
False
```

:::success
`--- 2. List ---` 아래에 `모두 3명`이 보이고, 명단에 `픽셀토끼`가 없고 `별빛여우`가 있어요. 마지막 두 줄이 `True`, `False`예요.
:::

### 4단계 · Dictionary로 플랫폼별 인원 세기 (10분)

방송 플랫폼 이름 다섯 개를 보고 플랫폼마다 몇 명인지 세어 볼게요. 키는 플랫폼 이름, 값은 인원 수예요.

**어디서:** VS Code → `C:\dev\cs-practice\Program.cs` 맨 아래

**무엇을:** 맨 마지막 줄 아래에 빈 줄을 하나 두고 붙여 넣은 뒤 `Ctrl + S`로 저장해요.

📄 C:\dev\cs-practice\Program.cs (일부)
```csharp

Console.WriteLine("--- 3. Dictionary ---");
var platforms = new List<string> { "chzzk", "youtube", "chzzk", "soop", "chzzk" };
var counts = new Dictionary<string, int>();
foreach (var platform in platforms)
{
    if (counts.ContainsKey(platform))
    {
        counts[platform] = counts[platform] + 1;
    }
    else
    {
        counts[platform] = 1;
    }
}
foreach (var pair in counts)
{
    Console.WriteLine($"{pair.Key}: {pair.Value}명");
}
if (counts.TryGetValue("soop", out var soopCount))
{
    Console.WriteLine($"soop은 {soopCount}명");
}
```

- `counts[platform] = 1;`은 키가 없으면 새로 넣고, 있으면 값을 바꿔요.
- `ContainsKey`는 그 키가 있는지 알려 줘요. 없는 키를 `counts["없는키"]`로 꺼내면 프로그램이 멈춰요. 그래서 먼저 확인해요.
- `pair.Key`, `pair.Value`로 키와 값을 꺼내요.
- `TryGetValue("soop", out var soopCount)`는 `TryParse`와 같은 모양이에요. 키가 있으면 `true`와 함께 값을 `soopCount`에 담아 줘요. 오늘 아래에서 `out`을 자세히 봐요.

**어디서:** VS Code 아래쪽 터미널

```powershell
dotnet run
```

예상 출력(앞 단계 출력 아래에 이어져요. 줄 순서는 다를 수 있어요):

```text
--- 3. Dictionary ---
chzzk: 3명
youtube: 1명
soop: 1명
soop은 1명
```

:::success
`chzzk: 3명`, `youtube: 1명`, `soop: 1명`과 마지막 `soop은 1명`이 보여요. Dictionary는 순서가 중요하지 않은 컬렉션이라 줄 순서가 다르게 나와도 정상이에요.
:::

### 5단계 · null 다루기와 경고 읽기 (12분)

"찾는 스트리머가 없으면 `null`을 돌려주는 메서드"를 만들고, 부르는 쪽에서 null을 검사해요.

**어디서:** VS Code → `C:\dev\cs-practice\Program.cs` 맨 아래

**무엇을:** 맨 마지막 줄 아래에 빈 줄을 하나 두고 붙여 넣은 뒤 `Ctrl + S`로 저장해요.

📄 C:\dev\cs-practice\Program.cs (일부)
```csharp

Console.WriteLine("--- 4. null ---");
var found = FindStreamer("달빛곰");
var missing = FindStreamer("없는이름");
Console.WriteLine(found is null ? "찾지 못했어요" : $"찾았어요: {found}");
Console.WriteLine(missing is null ? "찾지 못했어요" : $"찾았어요: {missing}");
Console.WriteLine(missing ?? "(이름 없음)");
Console.WriteLine(missing?.Length ?? 0);
int? viewers = null;
Console.WriteLine(viewers ?? 0);

string? FindStreamer(string name)
{
    foreach (var item in names)
    {
        if (item == name)
        {
            return item;
        }
    }
    return null;
}
```

- 반환 타입 `string?`는 "글자이거나 null"이라는 뜻이에요.
- `found is null ? A : B`는 [[삼항 연산자]]예요. null이면 A, 아니면 B예요.
- `missing ?? "(이름 없음)"`은 null이면 오른쪽 값을 써요.
- `missing?.Length ?? 0`은 null이면 `Length`를 건너뛰고 null이 되고, 그 null을 `??`가 `0`으로 바꿔요.
- `int? viewers`는 "정수이거나 null"이에요. 아직 시청자 수를 모를 때 써요.
- `FindStreamer`는 위쪽에서 만든 `names` 목록을 그대로 써요.

**어디서:** VS Code 아래쪽 터미널

```powershell
dotnet run
```

예상 출력(앞 단계 출력 아래에 이어져요):

```text
--- 4. null ---
찾았어요: 달빛곰
찾지 못했어요
(이름 없음)
0
0
```

:::success
`--- 4. null ---` 아래에 `찾았어요: 달빛곰`, `찾지 못했어요`, `(이름 없음)`, `0`, `0`이 차례로 보여요. 그리고 `dotnet run` 도중에 노란 경고가 한 줄도 없어요.
:::

이제 일부러 경고를 만나 볼게요. null 확인 없이 쓰면 어떻게 되는지 보는 거예요.

**무엇을:**

1. `var missing = FindStreamer("없는이름");` 줄 **바로 아래**에 한 줄을 끼워 넣어요.

📄 C:\dev\cs-practice\Program.cs (일부)
```csharp
Console.WriteLine(missing.Length);
```

2. `Ctrl + S`로 저장하고 터미널에서 `dotnet run`을 실행해요.

예상 출력(앞에 붙는 경로와 줄 번호는 달라도 돼요):

```text
C:\dev\cs-practice\Program.cs(61,19): warning CS8602: Dereference of a possibly null reference. [C:\dev\cs-practice\HubConsole.csproj]
--- 1. 메서드 ---
(…앞 단계 출력이 이어져요…)
--- 4. null ---
Unhandled exception. System.NullReferenceException: Object reference not set to an instance of an object.
   at Program.<Main>$(String[] args) in C:\dev\cs-practice\Program.cs:line 61
```

읽는 법이에요.

- `warning CS8602: Dereference of a possibly null reference.`는 "null일 수도 있는 값의 안(`.Length`)을 들여다보려고 해요"라는 경고예요. `Program.cs(61,19)`는 61번째 줄 19번째 칸이에요.
- 경고 뒤에도 프로그램은 실행돼요. 그러다 `missing`이 진짜 null인 순간 `NullReferenceException`으로 멈춰요. 경고가 미리 알려 준 일이 실제로 일어난 거예요.
- 고치는 법은 세 가지예요. ① `missing is null`로 먼저 확인한다. ② `missing?.Length`로 쓴다. ③ `missing ?? ""`로 기본값을 쓴다.

3. 방금 끼워 넣은 `Console.WriteLine(missing.Length);` 줄을 지우고 저장해요. 다시 `dotnet run`을 실행해요.

:::success
경고 줄이 사라지고, `--- 4. null ---` 아래 출력이 위의 성공 출력과 같아요.
:::

### 6단계 · TryParse와 out (8분)

사용자가 입력한 글자는 숫자가 아닐 수도 있어요. `TryParse`는 멈추지 않고 "안 됐어요"라고 알려 줘요.

**어디서:** VS Code → `C:\dev\cs-practice\Program.cs` 맨 아래

**무엇을:** 맨 마지막 줄 아래에 빈 줄을 하나 두고 붙여 넣은 뒤 `Ctrl + S`로 저장해요.

📄 C:\dev\cs-practice\Program.cs (일부)
```csharp

Console.WriteLine("--- 5. TryParse ---");
foreach (var text in new List<string> { "35", "12쪽" })
{
    if (int.TryParse(text, out var number))
    {
        Console.WriteLine($"\"{text}\" → 숫자 {number}");
    }
    else
    {
        Console.WriteLine($"\"{text}\" → 숫자가 아니에요");
    }
}
```

`\"`는 글자 안에 큰따옴표를 넣는 표기예요.

**어디서:** VS Code 아래쪽 터미널

```powershell
dotnet run
```

예상 출력(앞 단계 출력 아래에 이어져요):

```text
--- 5. TryParse ---
"35" → 숫자 35
"12쪽" → 숫자가 아니에요
```

:::success
`"35" → 숫자 35`와 `"12쪽" → 숫자가 아니에요`가 보이고, 경고가 0개예요. `dotnet build`를 실행하면 `0 Warning(s)`, `0 Error(s)`가 나와요.
:::

## ✍️ 과제

과제 코드도 `Program.cs`의 맨 아래에 붙여요. 먼저 직접 풀어 보고 정답을 열어 비교해 보세요.

### 과제 1 · 이름이 있는지 확인하는 메서드 (쉬움 ⭐, 5분)

- 메서드 이름은 `HasStreamer`예요. 매개변수는 `List<string> list`와 `string name`이고 `bool`을 돌려줘요.
- `names` 목록에 `"별빛여우"`와 `"고래"`가 있는지 `True`/`False`로 출력해요.
- 힌트: 3단계에서 본 `Contains`를 쓰면 한 줄이에요.

### 과제 2 · Dictionary로 더 짧게 세기 (보통 ⭐⭐, 8분)

- 4단계의 `platforms` 목록을 다시 세어 `shortCounts`라는 새 Dictionary에 담아요. 이번에는 `if`/`else` 없이 한 줄로 세어요.
- 결과를 `chzzk: 3명` 형태로 출력해요.
- 힌트: `counts.GetValueOrDefault(키)`는 키가 없으면 `0`을 돌려줘요.

### 과제 3 · "20"과 "abc"를 TryParse로 바꿔 보기 (쉬움 ⭐, 5분)

- `"20"`과 `"abc"`를 각각 `int.TryParse`로 바꿔요.
- 성공 여부와 숫자를 `20 → True, 20`, `abc → False, 0` 형태로 출력해요.
- 확인할 것: 실패했을 때 숫자 변수에는 무엇이 들어 있나요?

## ✅ 정답

:::answer 과제 1 정답 · HasStreamer
📄 C:\dev\cs-practice\Program.cs (일부)
```csharp

Console.WriteLine("--- 과제 1 ---");
Console.WriteLine(HasStreamer(names, "별빛여우"));
Console.WriteLine(HasStreamer(names, "고래"));

bool HasStreamer(List<string> list, string name)
{
    return list.Contains(name);
}
```

예상 출력:

```text
--- 과제 1 ---
True
False
```

**왜 이렇게 하나요?** 매개변수 이름 `list`, `name`은 위쪽에 있는 변수 `names`와 이름이 달라서 헷갈리지 않아요. 메서드 안에서는 받은 `list`만 보면 돼요. 그래서 다른 목록으로도 같은 메서드를 다시 쓸 수 있어요.
:::

:::answer 과제 2 정답 · 한 줄로 세기
📄 C:\dev\cs-practice\Program.cs (일부)
```csharp

Console.WriteLine("--- 과제 2 ---");
var shortCounts = new Dictionary<string, int>();
foreach (var platform in platforms)
{
    shortCounts[platform] = shortCounts.GetValueOrDefault(platform) + 1;
}
foreach (var pair in shortCounts)
{
    Console.WriteLine($"{pair.Key}: {pair.Value}명");
}
```

예상 출력:

```text
--- 과제 2 ---
chzzk: 3명
youtube: 1명
soop: 1명
```

**왜 이렇게 하나요?** 키가 아직 없으면 `GetValueOrDefault`가 `0`을 줘서 `0 + 1`로 시작해요. 있으면 지금 값에 1을 더해요. `ContainsKey` 검사와 `else`가 한 줄로 줄었어요. `TryGetValue`로 풀어 써도 같은 결과예요.
:::

:::answer 과제 3 정답 · TryParse 두 번
📄 C:\dev\cs-practice\Program.cs (일부)
```csharp

Console.WriteLine("--- 과제 3 ---");
var ok20 = int.TryParse("20", out var n20);
var okAbc = int.TryParse("abc", out var nAbc);
Console.WriteLine($"20 → {ok20}, {n20}");
Console.WriteLine($"abc → {okAbc}, {nAbc}");
```

예상 출력:

```text
--- 과제 3 ---
20 → True, 20
abc → False, 0
```

**왜 이렇게 하나요?** `TryParse`가 `false`를 돌려줄 때 `out` 변수에는 그 타입의 기본값이 들어가요. `int`의 기본값은 `0`이에요. 그래서 `false`일 때는 숫자 변수를 쓰지 않는 게 안전해요. 성공 여부(`ok20`)를 먼저 확인한 뒤에 `n20`을 써요.
:::

:::answer 오늘 끝 상태 전체 코드
막혔다면 `C:\dev\cs-practice\Program.cs`의 내용을 모두 지우고 아래 코드로 바꾼 뒤 Day 12를 시작하세요. 오늘은 이 파일 하나만 바뀌었어요.

```text
C:\dev\cs-practice\
├─ HubConsole.csproj   (그대로)
├─ Program.cs          (오늘 바꿈)
├─ bin\                (빌드 결과)
└─ obj\                (빌드 중간 파일)
```

📄 C:\dev\cs-practice\Program.cs
```csharp
Console.WriteLine("--- 1. 메서드 ---");
Console.WriteLine(Greet("달빛곰"));
Console.WriteLine(Greet("픽셀토끼", "저녁"));
Console.WriteLine(Label(name: "노을고양이", isAdmin: false));
PrintDivider();

string Greet(string name, string timeOfDay = "아침")
{
    return $"{timeOfDay} 인사: {name}님, 안녕하세요!";
}

string Label(string name, bool isAdmin)
{
    return isAdmin ? $"{name} (관리자)" : name;
}

void PrintDivider()
{
    Console.WriteLine("----------");
}

Console.WriteLine("--- 2. List ---");
var names = new List<string> { "달빛곰", "픽셀토끼", "노을고양이" };
names.Add("별빛여우");
names.Remove("픽셀토끼");
Console.WriteLine($"모두 {names.Count}명");
Console.WriteLine($"첫 번째: {names[0]}");
foreach (var streamerName in names)
{
    Console.WriteLine($"- {streamerName}");
}
Console.WriteLine(names.Contains("달빛곰"));
Console.WriteLine(names.Contains("픽셀토끼"));

Console.WriteLine("--- 3. Dictionary ---");
var platforms = new List<string> { "chzzk", "youtube", "chzzk", "soop", "chzzk" };
var counts = new Dictionary<string, int>();
foreach (var platform in platforms)
{
    if (counts.ContainsKey(platform))
    {
        counts[platform] = counts[platform] + 1;
    }
    else
    {
        counts[platform] = 1;
    }
}
foreach (var pair in counts)
{
    Console.WriteLine($"{pair.Key}: {pair.Value}명");
}
if (counts.TryGetValue("soop", out var soopCount))
{
    Console.WriteLine($"soop은 {soopCount}명");
}

Console.WriteLine("--- 4. null ---");
var found = FindStreamer("달빛곰");
var missing = FindStreamer("없는이름");
Console.WriteLine(found is null ? "찾지 못했어요" : $"찾았어요: {found}");
Console.WriteLine(missing is null ? "찾지 못했어요" : $"찾았어요: {missing}");
Console.WriteLine(missing ?? "(이름 없음)");
Console.WriteLine(missing?.Length ?? 0);
int? viewers = null;
Console.WriteLine(viewers ?? 0);

string? FindStreamer(string name)
{
    foreach (var item in names)
    {
        if (item == name)
        {
            return item;
        }
    }
    return null;
}

Console.WriteLine("--- 5. TryParse ---");
foreach (var text in new List<string> { "35", "12쪽" })
{
    if (int.TryParse(text, out var number))
    {
        Console.WriteLine($"\"{text}\" → 숫자 {number}");
    }
    else
    {
        Console.WriteLine($"\"{text}\" → 숫자가 아니에요");
    }
}

Console.WriteLine("--- 과제 1 ---");
Console.WriteLine(HasStreamer(names, "별빛여우"));
Console.WriteLine(HasStreamer(names, "고래"));

bool HasStreamer(List<string> list, string name)
{
    return list.Contains(name);
}

Console.WriteLine("--- 과제 2 ---");
var shortCounts = new Dictionary<string, int>();
foreach (var platform in platforms)
{
    shortCounts[platform] = shortCounts.GetValueOrDefault(platform) + 1;
}
foreach (var pair in shortCounts)
{
    Console.WriteLine($"{pair.Key}: {pair.Value}명");
}

Console.WriteLine("--- 과제 3 ---");
var ok20 = int.TryParse("20", out var n20);
var okAbc = int.TryParse("abc", out var nAbc);
Console.WriteLine($"20 → {ok20}, {n20}");
Console.WriteLine($"abc → {okAbc}, {nAbc}");
```

`dotnet run`을 실행하면 `--- 1. 메서드 ---`부터 `abc → False, 0`까지 나오고 경고는 0개예요.
:::

## 🧯 자주 막히는 곳

여기에 없는 증상은 [문제 해결 모음](#/page/troubleshooting)에서 찾아보세요.

한국어 Windows에서는 컴파일러의 `error`·`warning` 문장이 한국어로 나와요(예: `warning CS8602: null 가능 참조에 대한 역참조입니다.`). 아래 제목은 영어 원문이에요. 문장 대신 **`CS`로 시작하는 번호**로 찾으세요. 번호는 언어와 관계없이 같아요. 실행 중에 나는 `Unhandled exception.`은 영어로 나와요.

### `warning CS8602: Dereference of a possibly null reference.`

```text
C:\dev\cs-practice\Program.cs(61,19): warning CS8602: Dereference of a possibly null reference. [C:\dev\cs-practice\HubConsole.csproj]
```

**원인:** `string?`처럼 null일 수 있는 값에 null 확인 없이 `.`을 붙였어요. 경고라서 실행은 되지만 값이 null이면 `NullReferenceException`으로 멈춰요.

**해결:** 그 줄 앞에서 `if (값 is null)`로 확인하거나, `값?.Length`, `값 ?? "기본"`을 써요. 5단계 끝을 다시 보세요.

### `Unhandled exception. System.Collections.Generic.KeyNotFoundException`

```text
Unhandled exception. System.Collections.Generic.KeyNotFoundException: The given key '없는키' was not present in the dictionary.
```

**원인:** Dictionary에 없는 키를 `counts["없는키"]`로 꺼냈어요.

**해결:** 먼저 `ContainsKey("없는키")`로 확인하거나 `TryGetValue`, `GetValueOrDefault`를 써요. 예외를 다루는 법은 Day 15에서 배워요.

### `ArgumentOutOfRangeException: Index was out of range.`

```text
Unhandled exception. System.ArgumentOutOfRangeException: Index was out of range. Must be non-negative and less than the size of the collection. (Parameter 'index')
```

**원인:** `names[5]`처럼 List 크기보다 큰 번호로 꺼냈어요. 번호는 0부터 `Count - 1`까지예요.

**해결:** `names.Count`를 확인하고 번호를 고쳐요.

### `InvalidOperationException: Collection was modified; enumeration operation may not execute.`

```text
Unhandled exception. System.InvalidOperationException: Collection was modified; enumeration operation may not execute.
```

**원인:** `foreach`로 돌아보는 중에 같은 목록에 `Remove`나 `Add`를 했어요.

**해결:** 돌아보는 동안에는 목록을 바꾸지 않아요. 지울 이름을 다른 목록에 모아 뒀다가 반복이 끝난 뒤에 지워요.

### `error CS0029`, `error CS0165`, `error CS7036`

```text
Program.cs(1,9): error CS0029: Cannot implicitly convert type 'string' to 'int'
Program.cs(2,19): error CS0165: Use of unassigned local variable 'x'
Program.cs(1,9): error CS7036: There is no argument given that corresponds to the required parameter 'y' of 'Add(int, int)'
```

**원인:** 차례로 ① 글자를 정수 변수에 넣으려 했어요. ② 값을 넣기 전에 변수를 읽었어요. ③ 메서드가 요구하는 인수를 빼먹었어요(기본값이 없는 매개변수는 꼭 넣어야 해요).

**해결:** 오류에 적힌 줄과 칸을 눌러 그 줄로 가서 타입, 초기값, 인수를 고쳐요.

## 📝 오늘의 체크리스트

- [ ] `Greet("픽셀토끼", "저녁")`처럼 기본값이 있는 메서드를 인수 개수를 바꿔 부를 수 있어요.
- [ ] `List<string>`에 `Add`, `Remove`, `Count`, `Contains`를 써서 `True`/`False`와 개수를 출력했어요.
- [ ] `Dictionary<string, int>`로 `chzzk: 3명`, `youtube: 1명`, `soop: 1명`을 출력했어요.
- [ ] 일부러 만든 `CS8602` 경고를 읽고, 그 줄을 지운 뒤 경고가 사라진 것을 확인했어요.
- [ ] `"35"`와 `"12쪽"`을 `TryParse`로 바꿔 숫자와 "숫자가 아니에요"를 모두 봤어요.
- [ ] 과제 3 결과(`abc → False, 0`)가 나왔어요.
- [ ] 과제를 풀고 정답과 비교했어요. 마지막 `dotnet build`가 `0 Warning(s)`예요.

## 📚 더 알아보기

- [C# 메서드 (Microsoft Learn)](https://learn.microsoft.com/dotnet/csharp/programming-guide/classes-and-structs/methods): 메서드 선언, 반환 타입, 매개변수를 설명한 공식 문서
- [제네릭 컬렉션 (Microsoft Learn)](https://learn.microsoft.com/dotnet/standard/collections/commonly-used-collection-types): List와 Dictionary를 포함한 컬렉션 종류를 비교한 공식 문서
- [Nullable 참조 형식 (Microsoft Learn)](https://learn.microsoft.com/dotnet/csharp/nullable-references): `string?`와 null 경고가 왜 있는지 설명한 공식 문서

➡️ **다음 Day 예고:** [Day 12 · 클래스와 객체](#/day/p2-d12)에서는 스트리머와 방송 일정을 클래스로 만들고 `record`와 `with`를 써 봐요.
