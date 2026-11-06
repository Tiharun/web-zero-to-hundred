## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- `int`, `double`, `bool`, `string`, `char` 값을 쓰고, `var`와 `const`, 문자열 보간 `$"…{값}…"`을 쓸 수 있어요.
- `if`/`else if`/`else`, `switch` 문(`case … break;`), `switch` 식, `for`, `foreach`, `while`을 쓸 수 있어요.
- 열거형 `enum Platform { Chzzk, Youtube, Soop, Other }`을 만들고 쓸 수 있어요.
- 요일별 방송 시간표를 출력하는 `Program.cs`를 완성하고, 자주 나는 C# 컴파일 오류(`CS0029` 등)를 읽을 수 있어요.

**예상 시간: 90분** (개념 이해 12분 · 따라하기 48분 · 과제 25분 · 정리 5분)

:::path 📂 시작 상태
[Day 9](#/day/p2-d09)의 "오늘 끝 상태 전체 코드"가 있어야 해요. 없거나 다르면 그 코드로 먼저 맞춰 주세요.

- `C:\dev\streamer-hub\README.md`, `C:\dev\streamer-hub\.git\`
- `C:\dev\streamer-hub\client\`의 `.gitignore`, `index.html`, `package.json`, `package-lock.json`, `tsconfig.json`, `node_modules\`, `dist\`
- `C:\dev\streamer-hub\client\public\favicon.svg`, `C:\dev\streamer-hub\client\public\data\streamers.json`, `C:\dev\streamer-hub\client\public\data\schedules.json`
- `C:\dev\streamer-hub\client\src\main.ts`, `C:\dev\streamer-hub\client\src\style.css`, `C:\dev\streamer-hub\client\src\types.ts`, `C:\dev\streamer-hub\client\src\api.ts`, `C:\dev\streamer-hub\client\src\ui.ts`
- `C:\dev\cs-practice\HubConsole.csproj`, `C:\dev\cs-practice\Program.cs`, `C:\dev\cs-practice\bin\`, `C:\dev\cs-practice\obj\`
- .NET 10 SDK(`dotnet --version`이 `10.0.`으로 시작)와 VS Code의 **C#** 확장이 설치되어 있어요.
- VS Code에서 `C:\dev\cs-practice` 폴더를 열 수 있어요. 터미널에서 `cd C:\dev\cs-practice`, `code .`를 입력해요.
:::

## 📖 개념 이해

### 값의 종류(타입)와 변수

[Day 9](#/day/p2-d09)에서 C#은 타입을 이름 **앞**에 쓴다고 했어요. 자주 쓰는 타입은 이렇게 TypeScript와 짝지어져요.

| C# | 담는 것 | TypeScript |
|---|---|---|
| `int` | 정수 | `number` |
| `double` | 소수 | `number` |
| `bool` | 참/거짓 | `boolean` |
| `string` | 글자 | `string` |
| `char` | 글자 한 개 | (없음) |

- 글자는 큰따옴표 `"안녕"`, **글자 한 개(`char`)는 작은따옴표** `'A'`예요. TypeScript와 달리 둘이 다른 타입이에요.
- `var`는 "타입은 오른쪽 값을 보고 정해 줘"라는 뜻이에요. TypeScript의 타입 추론과 같아요. 다만 **한 번 정해진 타입은 바꿀 수 없어요.** `var n = 1;` 뒤에 `n = "글";`은 오류예요.
- `const`는 값이 바뀌지 않는 이름이에요. `const int WeeklyStreams = 5;`처럼 쓰고 값을 나중에 바꾸면 오류예요. 관례로 이름의 첫 글자를 대문자로 써요.

### 문자열 보간

**[[문자열 보간]]**(string interpolation)은 글자 안에 `{변수}`를 넣어 값을 끼워 넣는 문법이에요. 글자 앞에 `$`를 붙여요. TypeScript의 템플릿 리터럴([P1 Day 16](#/day/p1-d16))의 `${변수}`와 같은 일을 해요.

```csharp
string name = "달빛곰";
Console.WriteLine($"{name}님");
```

`$`를 빼먹으면 `{name}`이 그대로 출력돼요. 오류도 안 나서 눈으로 찾아야 해요.

### 연산자는 거의 같고, 비교는 `==` 하나예요

`+`, `-`, `*`, `/`, `%`(나머지), `&&`, `||`, `!`는 TypeScript와 같아요. 다른 점이 두 가지 있어요.

- 비교는 `==` 하나뿐이에요. `===`는 없어요. 타입이 이미 정해져 있어서 필요가 없어요.
- 정수끼리 나누면 소수점이 버려져요. `7 / 2`는 `3`이에요. 소수로 나누려면 `7 / 2.0`처럼 한쪽을 소수로 만들어요.

### 조건: `if`와 `switch`

`if`/`else if`/`else`는 [P1 Day 16](#/day/p1-d16)과 같아요. 여러 갈래를 고를 때 `switch`를 써요. C#의 `switch`는 두 가지 모양이에요.

- **`switch` 문**: `case 값:` 아래에 할 일을 쓰고 반드시 `break;`로 끝내요. 안 쓰면 오류예요.
- **[[switch 식]]**(switch expression)은 값을 돌려주는 짧은 모양이에요. `var label = day switch { 0 => "일", 1 => "월", _ => "?" };`처럼 `값 => 결과`를 나열하고 `_ =>`가 "나머지 모두"예요.

JavaScript의 `switch`는 이 교재에서 쓰지 않았어요. `switch`는 C#에서 처음 제대로 배워요.

### 반복: `for`, `foreach`, `while`

- `for (int i = 0; i < 7; i++)`: 횟수가 정해진 반복([P1 Day 17](#/day/p1-d17))이에요.
- `foreach (타입 이름 in 컬렉션)`: 배열의 칸을 하나씩 꺼내요. TypeScript의 `for…of`와 같아요.
- `while (조건)`: 조건이 참인 동안 반복해요.
- 배열은 `string[] names = { "가", "나" };`로 만들고 `names[0]`, `names.Length`로 써요.

### 열거형

**[[열거형]]**(enum, 이넘)은 정해진 이름들 중 하나만 가질 수 있는 타입이에요. 요일, 플랫폼처럼 선택지가 정해진 값에 써요.

```csharp
enum Platform { Chzzk, Youtube, Soop, Other }
```

TypeScript의 `type Platform = 'chzzk' | 'youtube' | …`과 같은 목적이에요. `Platform.Chzzk`처럼 쓰고, 출력하면 이름 `Chzzk`가 나와요. (Vite 프로젝트의 TypeScript에서는 `enum` 문법을 쓰지 않고 유니온 타입을 써요. 설정 `erasableSyntaxOnly`가 막아요.)

:::info 실무에서는
`enum`은 "이 값은 이 중 하나"를 코드에 박아 둘 때 많이 써요. 스트리머 허브 서버에서도 게시글을 고친 결과를 `Updated`, `Forbidden`, `NotFound` 같은 열거형으로 돌려줘요(Day 30). 숫자 `0`, `1`, `2`를 쓰는 것보다 의미가 읽혀서 실수가 줄어요.
:::

## 🛠️ 따라하기

모두 6단계예요. `Program.cs` 하나를 구역별로 키워 가요. 각 단계에서 새 구역을 아래에 더하고 `dotnet run`으로 확인해요.

### 1단계 · 값과 타입, 문자열 보간 (10분)

**어디서:** VS Code(`C:\dev\cs-practice` 폴더) → `Program.cs`, 그리고 터미널

**무엇을:**

1. `Program.cs`의 내용을 모두 지우고 아래 내용으로 바꾼 뒤 `Ctrl + S`로 저장해요.

📄 C:\dev\cs-practice\Program.cs
```csharp
// ---------- 1. 값과 타입 ----------
string streamerName = "달빛곰";
int hour = 20;
double hours = 2.5;
bool isLive = true;
char grade = 'A';
const int WeeklyStreams = 5;
var title = "저녁 게임 방송";

Console.WriteLine($"{streamerName}님, {hour}시에 방송해요. ({title})");
Console.WriteLine($"방송 {hours}시간, 주 {WeeklyStreams}회, 등급 {grade}, 생방송 {isLive}");
```

2. 터미널에서 실행해요. `` Ctrl + ` ``로 터미널을 열고 프롬프트가 `PS C:\dev\cs-practice>`인지 읽어요.

```powershell
dotnet run
```

예상 출력(`True`는 첫 글자가 대문자예요):

```text
달빛곰님, 20시에 방송해요. (저녁 게임 방송)
방송 2.5시간, 주 5회, 등급 A, 생방송 True
```

3. `var title`에 마우스를 올려 보세요. `(local variable) string title`처럼 `string`으로 정해진 것이 보여요.

:::success
두 줄이 나와요. `{hour}` 같은 글자가 그대로 보이면 `$`를 빠뜨린 거예요. `bool` 값은 `True`/`False`로 출력돼요.
:::

### 2단계 · 계산: 정수 나눗셈 (6분)

**어디서:** VS Code → `Program.cs`

**무엇을:** 파일 맨 아래에 이어서 입력하고 저장한 뒤 `dotnet run`을 실행해요.

📄 C:\dev\cs-practice\Program.cs (일부)
```csharp
// ---------- 2. 계산 ----------
Console.WriteLine(7 / 2);
Console.WriteLine(7 / 2.0);
Console.WriteLine(7 % 2);
```

예상 출력(앞의 두 줄에 이어서 세 줄이 더 나와요):

```text
3
3.5
1
```

:::success
`7 / 2`는 `3`(소수점 버림), `7 / 2.0`은 `3.5`, `7 % 2`는 `1`(나머지)이에요. 정수 나눗셈이 예상과 다르면 이 줄을 기억해요.
:::

### 3단계 · 조건: `if` / `else if` / `else` (6분)

**어디서:** VS Code → `Program.cs`

**무엇을:** 맨 아래에 이어서 입력하고 저장한 뒤 `dotnet run`을 실행해요. 중괄호 `{ }`는 줄을 바꿔서 써요(C#의 관례예요).

📄 C:\dev\cs-practice\Program.cs (일부)
```csharp
// ---------- 3. 조건 ----------
if (hour >= 18)
{
    Console.WriteLine("저녁 방송 시간이에요.");
}
else if (hour >= 12)
{
    Console.WriteLine("낮 방송 시간이에요.");
}
else
{
    Console.WriteLine("아침 방송 시간이에요.");
}
```

`hour`가 20이니 마지막에 한 줄이 더 나와요.

```text
저녁 방송 시간이에요.
```

:::success
`저녁 방송 시간이에요.` 한 줄만 나와요. `int hour = 20;`을 `9`로 바꾸고 실행하면 `아침 방송 시간이에요.`가 나와요. 확인하고 20으로 되돌려요.
:::

### 4단계 · 요일별 시간표: 배열, `for`, `switch` 식, `enum` (12분)

이제 오늘의 결과물을 만들어요. 일요일부터 토요일까지 7일의 방송을 배열로 두고 반복하며 출력해요. 열거형 `Platform`은 **파일 맨 아래**에 써야 해요. 최상위 문장 아래에 쓰는 규칙이에요.

**어디서:** VS Code → `Program.cs`

**무엇을:**

1. 맨 아래에 아래 시간표 코드를 이어서 입력해요.

📄 C:\dev\cs-practice\Program.cs (일부)
```csharp
// ---------- 4. 요일별 시간표 ----------
string[] titles = { "쉬는 날", "저녁 게임 방송", "그림 방송", "쉬는 날", "시청자 참여 게임", "노래 방송", "주말 특집" };
int[] startHours = { 0, 20, 13, 0, 20, 21, 15 };
Platform[] platforms = { Platform.Other, Platform.Chzzk, Platform.Youtube, Platform.Other, Platform.Chzzk, Platform.Soop, Platform.Chzzk };

for (int day = 0; day < 7; day++)
{
    var label = day switch
    {
        0 => "일",
        1 => "월",
        2 => "화",
        3 => "수",
        4 => "목",
        5 => "금",
        6 => "토",
        _ => "?",
    };

    if (startHours[day] == 0)
    {
        Console.WriteLine($"{label}요일 {titles[day]}");
    }
    else
    {
        Console.WriteLine($"{label}요일 {startHours[day]}:00 {titles[day]} ({platforms[day]})");
    }
}
```

2. 그 아래에 열거형을 이어서 입력해요. 이 열거형이 파일의 맨 마지막이 돼요.

📄 C:\dev\cs-practice\Program.cs (일부)
```csharp
// 열거형은 최상위 문장 아래에 써요
enum Platform
{
    Chzzk,
    Youtube,
    Soop,
    Other,
}
```

3. 저장하고 `dotnet run`을 실행해요.

예상 출력(지금까지 나온 줄 다음에 이어져요):

```text
일요일 쉬는 날
월요일 20:00 저녁 게임 방송 (Chzzk)
화요일 13:00 그림 방송 (Youtube)
수요일 쉬는 날
목요일 20:00 시청자 참여 게임 (Chzzk)
금요일 21:00 노래 방송 (Soop)
토요일 15:00 주말 특집 (Chzzk)
```

코드를 읽어 봐요.

- `string[] titles = { … }`: 글자 배열이에요. 일요일(0번)부터 토요일(6번)까지 7칸이에요. `startHours`, `platforms`도 같은 순서예요. `platforms`의 칸은 열거형 `Platform`이에요.
- `for (int day = 0; day < 7; day++)`: `day`가 0부터 6까지 변하며 반복해요.
- `var label = day switch { … }`: 번호를 요일 글자로 바꾸는 switch 식이에요. `_ => "?"`는 0~6이 아닐 때를 위한 기본 갈래예요.
- `startHours[day] == 0`: 시작 시간이 0이면 쉬는 날로 쳐요. 비교는 `==` 하나예요.
- `({platforms[day]})`: 열거형 값을 출력하면 이름(`Chzzk`)이 나와요.

:::success
7줄이 요일 순서대로 나와요. 오류 `CS8803: Top-level statements must precede namespace and type declarations.`가 나오면 `enum Platform` 아래에 코드를 더 쓴 거예요. 열거형을 맨 아래로 옮겨요(아래 🧯의 마지막 항목).
:::

### 5단계 · `switch` 문과 `foreach` (8분)

열거형 값에 따라 한글 이름을 정해요. 이번에는 `switch` 문이에요. 새 코드는 파일 맨 아래가 아니라 **열거형 바로 위**에 넣어요. 열거형이 파일의 맨 마지막이어야 하기 때문이에요.

**어디서:** VS Code → `Program.cs`

**무엇을:** `// 열거형은 최상위 문장 아래에 써요` 주석 줄을 찾아요(`Ctrl + F`). 그 줄 바로 위의 빈 줄에 커서를 두고 아래 코드를 붙여 넣어요. 저장하고 `dotnet run`을 실행해요.

📄 C:\dev\cs-practice\Program.cs (일부)
```csharp
// ---------- 5. 플랫폼 이름: switch 문 ----------
foreach (Platform platform in platforms)
{
    string platformName;
    switch (platform)
    {
        case Platform.Chzzk:
            platformName = "치지직";
            break;
        case Platform.Youtube:
            platformName = "YouTube";
            break;
        case Platform.Soop:
            platformName = "SOOP";
            break;
        default:
            platformName = "기타";
            break;
    }
    Console.WriteLine($"{platform} → {platformName}");
}
```

예상 출력(이어지는 7줄이에요. `platforms` 칸이 7개라 7줄이 나와요):

```text
Other → 기타
Chzzk → 치지직
Youtube → YouTube
Other → 기타
Chzzk → 치지직
Soop → SOOP
Chzzk → 치지직
```

`switch` 문은 `case`마다 `break;`가 필요해요. 하나를 빼면 `error CS0163: Control cannot fall through from one case label ('case Platform.Chzzk:') to another`가 나요. `default:`는 어디에도 맞지 않을 때예요.

:::success
7줄이 나와요. `platformName`은 `string platformName;`처럼 값을 비워 두고 시작해서 `switch`의 모든 갈래(`default` 포함)에서 값을 정해요. 하나라도 빠지면 컴파일러가 막아 줘요.
:::

### 6단계 · `while`로 카운트다운 (6분)

**어디서:** VS Code → `Program.cs`

**무엇을:** 5단계 코드(`foreach` 구역)와 `// 열거형은 …` 주석 사이, 즉 열거형 바로 위에 아래 코드를 붙여 넣어요. 저장하고 `dotnet run`을 실행해요.

📄 C:\dev\cs-practice\Program.cs (일부)
```csharp
// ---------- 6. while ----------
int countdown = 3;
while (countdown > 0)
{
    Console.WriteLine($"방송 시작까지 {countdown}");
    countdown--;
}
Console.WriteLine("방송 시작!");
```

예상 출력:

```text
방송 시작까지 3
방송 시작까지 2
방송 시작까지 1
방송 시작!
```

:::success
네 줄이 나와요. `countdown--;`(1씩 줄이기)를 지우면 같은 줄이 끝없이 나와요. 그럴 때는 `Ctrl + C`로 멈춰요.
:::

## ✍️ 과제

과제 코드는 모두 `// 열거형은 최상위 문장 아래에 써요` 주석 바로 위에 이어서 붙여요.

### 과제 1 · 1부터 10까지의 합 (쉬움 ⭐, 6분)

- `for`로 1부터 10까지의 합을 구해 `1부터 10까지의 합: 55`를 출력해요.
- 확인: `dotnet run`의 출력에 `55`가 있어요.
- 힌트: `int sum = 0;`으로 시작해서 반복마다 `sum += i;`를 해요.

### 과제 2 · 요일 번호를 이름으로 (보통 ⭐⭐, 10분)

- 배열 `int[] testDays = { 3, 9 };`의 숫자를 `foreach`로 하나씩 꺼내 switch 식으로 `수요일`, `알 수 없음` 같은 요일 이름을 구해요. `0`은 `일요일`, `6`은 `토요일`로 하고 나머지는 `_ =>` 갈래로 `알 수 없음`이에요.
- 출력은 `3번은 수요일`, `9번은 알 수 없음`이에요.
- 확인: 두 줄이 그대로 나와요.
- 힌트: 4단계의 `var label = day switch { … };`와 같은 모양이에요. 마지막 갈래 `_ =>`를 빼먹지 말아요.

### 과제 3 · 시청자 수로 방송 크기 정하기 (쉬움 ⭐, 6분)

- `int viewers = 150;`을 두고 1000명 이상이면 `큰 방송이에요.`, 100명 이상이면 `보통 방송이에요.`, 그 밖에는 `작은 방송이에요.`를 출력해요.
- 확인: 150이면 `보통 방송이에요.`가 나와요. 100, 99, 1000도 넣어서 경계값이 맞는지 확인하고 150으로 되돌려요.
- 힌트: 큰 기준부터 `if`로 확인하고 `else if`로 내려와요. `>=`는 "이상"이에요.

## ✅ 정답

:::answer 과제 1 정답 · 합계
```csharp
int sum = 0;
for (int i = 1; i <= 10; i++)
{
    sum += i;
}
Console.WriteLine($"1부터 10까지의 합: {sum}");
```

**왜 이렇게 하나요?** `sum`을 0으로 시작해 `i`가 1부터 10까지 바뀌는 동안 더해요. `i <= 10`이므로 10도 포함돼요. `i < 10`이라고 쓰면 45가 나와요. `+=`는 `sum = sum + i`의 줄임이에요.
:::

:::answer 과제 2 정답 · switch 식
```csharp
int[] testDays = { 3, 9 };
foreach (int dayNumber in testDays)
{
    var dayName = dayNumber switch
    {
        0 => "일요일",
        1 => "월요일",
        2 => "화요일",
        3 => "수요일",
        4 => "목요일",
        5 => "금요일",
        6 => "토요일",
        _ => "알 수 없음",
    };
    Console.WriteLine($"{dayNumber}번은 {dayName}");
}
```

**왜 이렇게 하나요?** switch 식은 모든 경우가 빠짐없이 있어야 해요. `_ =>`가 "나머지 모두"를 맡아서 9처럼 예상 밖의 값도 안전하게 처리해요. 이 갈래를 빼면 컴파일러가 경고를 내요. 쉼표로 갈래를 나누고, 마지막 갈래 뒤의 쉼표는 있어도 없어도 돼요.
:::

:::answer 과제 3 정답 · 경계값
```csharp
int viewers = 150;
if (viewers >= 1000)
{
    Console.WriteLine("큰 방송이에요.");
}
else if (viewers >= 100)
{
    Console.WriteLine("보통 방송이에요.");
}
else
{
    Console.WriteLine("작은 방송이에요.");
}
```

**왜 이렇게 하나요?** 큰 기준부터 확인하면 `else if`는 "1000 미만이면서 100 이상"이 되어 조건이 간단해요. 경계값은 100이면 `보통`, 99면 `작은`, 1000이면 `큰`이에요. `>`가 아니라 `>=`를 쓴 이유예요. 경계에서 틀리는 일은 아주 흔해서 항상 경계값으로 확인해요.
:::

:::answer 오늘 끝 상태 전체 코드
오늘 따라하기와 과제를 모두 끝낸 상태예요. 막혔다면 `C:\dev\cs-practice\Program.cs`를 아래 내용으로 통째로 바꾸고 `dotnet run`을 실행한 뒤 Day 11을 시작하세요. `HubConsole.csproj`는 [Day 9](#/day/p2-d09)와 같아요. 오늘은 `C:\dev\streamer-hub`의 파일이 바뀌지 않아서 Git 커밋은 하지 않아요.

```text
C:\dev\cs-practice\
├─ bin\
├─ obj\
├─ HubConsole.csproj
└─ Program.cs
```

📄 C:\dev\cs-practice\Program.cs
```csharp
// ---------- 1. 값과 타입 ----------
string streamerName = "달빛곰";
int hour = 20;
double hours = 2.5;
bool isLive = true;
char grade = 'A';
const int WeeklyStreams = 5;
var title = "저녁 게임 방송";

Console.WriteLine($"{streamerName}님, {hour}시에 방송해요. ({title})");
Console.WriteLine($"방송 {hours}시간, 주 {WeeklyStreams}회, 등급 {grade}, 생방송 {isLive}");

// ---------- 2. 계산 ----------
Console.WriteLine(7 / 2);
Console.WriteLine(7 / 2.0);
Console.WriteLine(7 % 2);

// ---------- 3. 조건 ----------
if (hour >= 18)
{
    Console.WriteLine("저녁 방송 시간이에요.");
}
else if (hour >= 12)
{
    Console.WriteLine("낮 방송 시간이에요.");
}
else
{
    Console.WriteLine("아침 방송 시간이에요.");
}

// ---------- 4. 요일별 시간표 ----------
string[] titles = { "쉬는 날", "저녁 게임 방송", "그림 방송", "쉬는 날", "시청자 참여 게임", "노래 방송", "주말 특집" };
int[] startHours = { 0, 20, 13, 0, 20, 21, 15 };
Platform[] platforms = { Platform.Other, Platform.Chzzk, Platform.Youtube, Platform.Other, Platform.Chzzk, Platform.Soop, Platform.Chzzk };

for (int day = 0; day < 7; day++)
{
    var label = day switch
    {
        0 => "일",
        1 => "월",
        2 => "화",
        3 => "수",
        4 => "목",
        5 => "금",
        6 => "토",
        _ => "?",
    };

    if (startHours[day] == 0)
    {
        Console.WriteLine($"{label}요일 {titles[day]}");
    }
    else
    {
        Console.WriteLine($"{label}요일 {startHours[day]}:00 {titles[day]} ({platforms[day]})");
    }
}

// ---------- 5. 플랫폼 이름: switch 문 ----------
foreach (Platform platform in platforms)
{
    string platformName;
    switch (platform)
    {
        case Platform.Chzzk:
            platformName = "치지직";
            break;
        case Platform.Youtube:
            platformName = "YouTube";
            break;
        case Platform.Soop:
            platformName = "SOOP";
            break;
        default:
            platformName = "기타";
            break;
    }
    Console.WriteLine($"{platform} → {platformName}");
}

// ---------- 6. while ----------
int countdown = 3;
while (countdown > 0)
{
    Console.WriteLine($"방송 시작까지 {countdown}");
    countdown--;
}
Console.WriteLine("방송 시작!");

// ---------- 과제 1: 1부터 10까지 합 ----------
int sum = 0;
for (int i = 1; i <= 10; i++)
{
    sum += i;
}
Console.WriteLine($"1부터 10까지의 합: {sum}");

// ---------- 과제 2: 요일 번호 → 이름 ----------
int[] testDays = { 3, 9 };
foreach (int dayNumber in testDays)
{
    var dayName = dayNumber switch
    {
        0 => "일요일",
        1 => "월요일",
        2 => "화요일",
        3 => "수요일",
        4 => "목요일",
        5 => "금요일",
        6 => "토요일",
        _ => "알 수 없음",
    };
    Console.WriteLine($"{dayNumber}번은 {dayName}");
}

// ---------- 과제 3: 시청자 수에 따른 방송 크기 ----------
int viewers = 150;
if (viewers >= 1000)
{
    Console.WriteLine("큰 방송이에요.");
}
else if (viewers >= 100)
{
    Console.WriteLine("보통 방송이에요.");
}
else
{
    Console.WriteLine("작은 방송이에요.");
}

// 열거형은 최상위 문장 아래에 써요
enum Platform
{
    Chzzk,
    Youtube,
    Soop,
    Other,
}
```
:::

## 🧯 자주 막히는 곳

여기에 없는 증상은 [문제 해결 모음](#/page/troubleshooting)에서 찾아보세요.

### `error CS0029: Cannot implicitly convert type 'string' to 'int'`

```text
Program.cs(1,15): error CS0029: Cannot implicitly convert type 'string' to 'int'
```

**원인:** `int viewers = "많음";`처럼 글자를 숫자 변수에 넣으려 했어요. TypeScript의 `TS2322`와 같은 오류예요. 줄과 칸은 내 코드에 따라 달라요.

**해결:** 오류의 `(줄,칸)`이 가리키는 곳에서 변수 타입과 오른쪽 값이 맞는지 확인해요. 숫자는 따옴표 없이 `150`으로 써요. 고치면 `dotnet run`이 통과해요.

### `error CS0165: Use of unassigned local variable 'n'`

```text
Program.cs(1,26): error CS0165: Use of unassigned local variable 'n'
```

**원인:** `int n;`처럼 값을 정하지 않고 변수를 만든 뒤 바로 읽었어요. C#은 값이 없는 변수의 사용을 막아요.

**해결:** `int n = 0;`처럼 처음부터 값을 넣어요. `if`나 `switch`로 값을 나중에 정한다면 모든 갈래(`else`, `default` 포함)에서 정해야 해요.

### `{name}`이 그대로 출력돼요

**원인:** 글자 앞에 `$`를 빠뜨렸어요. 오류는 나지 않아요. `"{name}님"` 대신 `$"{name}님"`이어야 해요.

**해결:** `Console.WriteLine(` 뒤의 큰따옴표 바로 앞에 `$`를 붙여요. 저장 후 `dotnet run`에서 이름이 나오면 해결이에요.

### `error CS1012: Too many characters in character literal`

```text
Program.cs(1,10): error CS1012: Too many characters in character literal
```

**원인:** 작은따옴표는 글자 **한 개**(`char`)에만 써요. `'ab'`나 `'안녕'`처럼 여러 글자를 작은따옴표로 감쌌어요.

**해결:** 여러 글자는 큰따옴표 `"안녕"`으로 감싸요(`string`). 한 글자만 필요하면 `'A'`예요.

### `error CS0163: Control cannot fall through from one case label … to another`

```text
Program.cs(4,5): error CS0163: Control cannot fall through from one case label ('case 1:') to another
```

**원인:** `switch` 문의 `case` 끝에 `break;`가 없어서 다음 `case`로 흘러가려 해요. C#은 이것을 막아요. 줄 번호는 달라요.

**해결:** 오류가 가리키는 `case` 아래 마지막 줄에 `break;`를 더해요. (`switch` **식**은 `break`가 필요 없어요.)

### `error CS8803: Top-level statements must precede namespace and type declarations.`

```text
Program.cs(3,1): error CS8803: Top-level statements must precede namespace and type declarations.
```

**원인:** 열거형(`enum`)이나 클래스 같은 형식 선언 **아래**에 실행 코드를 썼어요. 최상위 문장은 형식 선언보다 위에 있어야 해요.

**해결:** `enum Platform { … }` 블록을 오려서 파일 맨 아래로 옮기고, 새 코드는 `// 열거형은 최상위 문장 아래에 써요` 주석 바로 위에 붙여요.

## 📝 오늘의 체크리스트

- [ ] `int`, `double`, `bool`, `string`, `char`를 각각 한 번씩 써 봤어요
- [ ] `$"…{값}…"`으로 이름과 시간을 출력해 봤어요
- [ ] `7 / 2`가 `3`, `7 / 2.0`이 `3.5`인 이유를 말할 수 있어요
- [ ] `if`, `switch` 문, `switch` 식, `for`, `foreach`, `while`을 각각 썼어요
- [ ] `enum Platform`이 파일 맨 아래에 있고, `dotnet run`에서 요일별 시간표 7줄과 플랫폼 이름 7줄이 나와요
- [ ] `CS0029`, `CS0165`, `CS0163` 중 하나를 일부러 내 보고 고쳤어요
- [ ] 과제 1~3을 풀고 정답과 비교했어요(`55`, `수요일`, `보통 방송이에요.`)

## 📚 더 알아보기

- [C# 기본 형식](https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/builtin-types/built-in-types): `int`, `double`, `string` 같은 기본 형식을 공식 문서로 정리해요.
- [문자열 보간](https://learn.microsoft.com/ko-kr/dotnet/csharp/tutorials/exploration/interpolated-strings): `$"…"` 보간을 쓰는 법과 서식 지정을 예시로 보여 줘요.
- [switch 식](https://learn.microsoft.com/ko-kr/dotnet/csharp/language-reference/operators/switch-expression): `switch` 식의 문법과 `_` 갈래를 설명해요.

➡️ **다음 Day 예고:** [Day 11 · 메서드와 컬렉션](#/day/p2-d11)에서는 코드를 이름 붙인 메서드로 묶고, 값을 모아 두는 `List`와 `Dictionary`, 그리고 `null`을 안전하게 다루는 법을 배워요.
