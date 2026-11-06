## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- 서버를 꺼도 데이터가 남으려면 왜 데이터베이스가 필요한지, 테이블·행·열·기본 키가 무엇인지 말할 수 있어요.
- `sqlite3`를 설치하고 연습용 DB 파일(`practice.db`)을 만들 수 있어요.
- `CREATE TABLE`, `INSERT`, `SELECT`(`WHERE`, `ORDER BY`, `LIKE`), `UPDATE`, `DELETE` 문을 직접 실행해서 결과를 확인할 수 있어요.
- 같은 SQL을 `practice.sql` 파일에 저장해 `.read`로 다시 실행하고, LINQ(Day 14)와 SQL을 짝지어 말할 수 있어요.

**예상 시간: 100분** (개념 이해 17분 · 따라하기 60분 · 과제 15분 · 정리 8분)

:::path 📂 시작 상태
[Day 18](#/day/p2-d18)의 "오늘 끝 상태 전체 코드"가 있어야 해요. 없거나 다르면 그 코드로 먼저 맞춰 주세요. 오늘은 서버를 켜지 않고, 연습 폴더 `C:\dev\sql-practice`에서 DB만 연습해요. 이 폴더는 오늘 만들어요.

- `C:\dev\streamer-hub\` 안에 `README.md`, `.git\`, `.gitignore`가 있어요.
- `C:\dev\streamer-hub\client\` 폴더 (`.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`, `public\`, `src\`)
- `C:\dev\streamer-hub\server\StreamerHub.slnx`
- `C:\dev\streamer-hub\server\StreamerHub.Api\` 폴더: `StreamerHub.Api.csproj`, `Program.cs`, `appsettings.json`, `appsettings.Development.json`, `StreamerHub.Api.http`, `bin\`, `obj\`
- `C:\dev\streamer-hub\server\StreamerHub.Api\Entities\Streamer.cs`
- `C:\dev\streamer-hub\server\StreamerHub.Api\Properties\launchSettings.json`
- 설치되어 있어야 할 것: VS Code, .NET 10 SDK(`dotnet --version`), Git. `sqlite3`는 1단계에서 설치해요.
- 이 컴퓨터에서 `winget`을 쓸 수 있어요(Windows 11에 보통 들어 있어요). 안 되면 1단계의 "winget이 없다면"을 따라요.
- 켜 두어야 할 프로그램은 없어요. 서버(`dotnet watch`)는 꺼져 있어도 돼요.
:::

## 📖 개념 이해

### 서버를 껐다 켜도 남아야 하는 데이터

Day 18에서 서버를 껐다 켜자 만든 스트리머가 사라졌어요. 목록이 컴퓨터의 **메모리**에만 있었기 때문이에요. 메모리는 프로그램이 꺼지면 비워지는 임시 작업대예요. 스트리머, 게시글, 계정은 서버를 껐다 켜도 남아야 해요. 그래서 파일처럼 **디스크**에 안전하게 저장하는 **[[데이터베이스]]**(database, DB)를 써요. Day 1에서 "데이터를 보관하는 곳"이라고 소개한 그것이에요.

### 테이블, 행, 열, 기본 키

**비유부터 볼게요.** 엑셀 시트를 떠올려 보세요. 맨 윗줄에 칸 이름(이름, 플랫폼)이 있고, 아래로 스트리머 한 명이 한 줄씩 있어요. 관계형 DB가 이 모양이에요([[표]], P1 Day 8).

```text
Streamers (테이블)
Id │ Name   │ Platform
1  │ 달빛곰   │ chzzk
2  │ 픽셀토끼 │ youtube
3  │ 노을고양이│ soop
```

**정확한 정의는 이래요.**

- **[[테이블]]**(table)은 DB에서 같은 종류의 데이터를 모아 둔 표 하나예요. 이름은 `Streamers`처럼 복수형으로 지어요.
- **[[행]]**(row)은 테이블의 가로 한 줄이에요. 스트리머 한 명이 행 하나예요. 레코드라고도 불러요.
- **[[열]]**(column)은 테이블의 세로 한 칸 종류예요. `Name` 열에는 이름만 들어가요. 열마다 **자료형**이 있어요. 오늘은 정수 `INTEGER`와 글자 `TEXT`를 써요.
- **[[기본 키]]**(primary key)는 행 하나를 딱 집어내는 열이에요. 같은 값이 둘일 수 없어요. `Id`를 기본 키로 써요. 이름이 같은 스트리머가 있어도 `Id`로는 구별되고, Day 18의 `/api/streamers/3`의 `3`이 이 `Id`예요. `AUTOINCREMENT`를 붙이면 새 행을 넣을 때 번호가 자동으로 1씩 커져요.

### SQL과 SQLite

**[[SQL]]**(에스큐엘, 시퀄이라고도 읽어요)은 DB에게 일을 시키는 언어예요. "이 표에서 곰이 들어간 이름만 보여 줘" 같은 부탁을 정해진 문장으로 써요. 문장 하나를 **[[쿼리]]**(query, 질의)라고 불러요. 문장은 `;`로 끝나요. 키워드(`SELECT`)는 소문자로 써도 되지만 이 교재는 대문자로 써서 구별해요.

**[[SQLite]]**(에스큐엘라이트)는 DB 전체가 **파일 하나**인 가벼운 DB예요. 따로 설치해서 켜 두는 서버 프로그램이 없어요. `practice.db`라는 파일이 곧 DB예요. 스트리머 허브는 SQLite를 써서 `streamerhub.db` 파일 하나에 모든 데이터를 담아요. 복사하면 백업이 되는 점이 장점이에요.

오늘 쓰는 문장 다섯 가지예요.

| 문장 | 하는 일 | CRUD |
|---|---|---|
| `INSERT` | 행 추가 | 만들기 |
| `SELECT` | 행 읽기 | 읽기 |
| `UPDATE` | 행 고치기 | 고치기 |
| `DELETE` | 행 지우기 | 지우기 |
| `CREATE TABLE` | 표 만들기 | (준비) |

Day 14의 LINQ와 짝이에요. Day 21부터는 LINQ를 쓰면 EF Core가 이 SQL로 바꿔서 실행해 줘요.

| LINQ (C#) | SQL |
|---|---|
| `Where(s => s.Platform == "chzzk")` | `WHERE Platform = 'chzzk'` |
| `OrderBy(s => s.Name)` | `ORDER BY Name` |
| `Take(2)` | `LIMIT 2` |
| `Contains("곰")` | `LIKE '%곰%'` |

:::warn WHERE 없이 UPDATE·DELETE를 하면 전부 바뀌어요
`DELETE FROM Streamers;`처럼 `WHERE`를 빼면 모든 행이 지워져요. `UPDATE`도 마찬가지로 모든 행이 바뀌어요. 진짜 서비스에서는 되돌리기 어려워서 가장 무서운 실수예요. 오늘은 연습용 DB라서 다시 넣으면 되지만, 습관은 지금부터 들여요. 고치거나 지우기 전에 같은 `WHERE`로 `SELECT`를 먼저 해 보세요.
:::

:::info 실무에서는
회사에서는 PostgreSQL, MySQL 같은 서버형 DB를 많이 써요. 문법(`SELECT`, `WHERE` 등)은 거의 같아서 오늘 배운 SQL이 그대로 통해요. 규모가 작은 앱이나 도구, 스마트폰 앱 안에는 SQLite를 널리 써요.
:::

## 🛠️ 따라하기

6단계예요. 명령은 터미널(PowerShell)과 `sqlite>` 프롬프트 두 곳에서 입력해요. 어디에서 입력하는지 단계마다 적었어요.

### 1단계 · sqlite3 설치하기 (8분)

**어디서:** PowerShell (위치는 어디든 괜찮아요). 인터넷이 필요해요.

**무엇을:**

1. 설치 명령을 입력해요.

```powershell
winget install SQLite.SQLite
```

winget이 처음이면 "원본 계약에 동의하는지"를 묻고 `Y`(예)를 입력하라고 해요. 문구는 한국어나 영어로 나오고 버전에 따라 달라요. 다운로드와 설치가 끝나면 "설치 완료" 비슷한 문장으로 끝나요.

2. **터미널(과 VS Code)을 모두 닫고 새로 열어요.** 설치 직후에는 이미 열린 터미널이 새 프로그램 위치를 몰라요([Day 3](#/day/p2-d03)에서 배운 PATH예요).
3. 새 PowerShell에서 버전을 확인해요.

```powershell
sqlite3 --version
```

예상 출력(숫자와 날짜는 달라도 돼요. 3으로 시작하는 버전이 나오면 돼요):

```text
3.54.1 2026-10-16 …
```

:::success
`3.`으로 시작하는 버전 줄이 한 줄 나와요. `'sqlite3' 용어가 cmdlet, 함수, 스크립트 파일 또는 실행할 수 있는 프로그램 이름으로 인식되지 않습니다`라는 오류(영어: `The term 'sqlite3' is not recognized as the name of a cmdlet…`)가 나면 새 터미널을 열었는지 먼저 확인하고, 그래도 안 되면 아래 🧯의 "sqlite3가 인식되지 않아요"를 보세요.
:::

### 2단계 · 연습 폴더와 DB 파일 만들기, 첫 테이블 (12분)

**어디서:** PowerShell

**무엇을:**

1. 연습 폴더를 만들고 그 안으로 들어가요.

```powershell
mkdir C:\dev\sql-practice
```

예상 출력(날짜는 달라요):

```text
    Directory: C:\dev


Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        2026-11-06   오후 4:00                sql-practice
```

```powershell
cd C:\dev\sql-practice
```

아무것도 나오지 않고 프롬프트가 `PS C:\dev\sql-practice>`로 바뀌어요.

2. `sqlite3`로 DB 파일 `practice.db`를 열어요. 파일이 없으면 새로 만들어요.

```powershell
sqlite3 practice.db
```

예상 출력(버전과 날짜는 달라요):

```text
SQLite version 3.54.1 2026-10-16 …
Enter ".help" for usage hints.
```

프롬프트가 `sqlite>`로 바뀌었어요. 이제부터 입력하는 것은 sqlite3 안에서 실행돼요. **프롬프트(`sqlite>`)는 입력하지 않고 명령만 입력해요.** 명령은 두 종류예요.

- `.tables`, `.schema`처럼 점(`.`)으로 시작하는 명령은 sqlite3 도구에게 하는 말이에요. `;`를 붙이지 않아요.
- `CREATE TABLE …;`처럼 SQL 문장은 반드시 `;`로 끝내요.

3. 먼저 결과를 읽기 쉽게 설정해요. 헤더(열 이름)를 보여 주고, `|`로 칸을 나누는 모양으로 고정해요.

```text
.headers on
```

```text
.mode list
```

두 줄 모두 아무것도 나오지 않아요.

4. 지금 테이블이 있는지 봐요.

```text
.tables
```

아무것도 나오지 않아요(테이블이 아직 없어요).

5. 테이블을 만들어요. **한 줄로 입력하고 끝에 `;`를 꼭 써요.**

```sql
CREATE TABLE Streamers (Id INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT NOT NULL, Platform TEXT NOT NULL, Bio TEXT NOT NULL);
```

아무것도 나오지 않고 `sqlite>`가 다시 보이면 성공이에요.

- `Id INTEGER PRIMARY KEY AUTOINCREMENT`: 정수 기본 키, 자동으로 1씩 커져요.
- `Name TEXT NOT NULL`: 글자 열이고 비워 둘 수 없어요(`NOT NULL`).

6. 만들어졌는지 봐요.

```text
.tables
```

예상 출력:

```text
Streamers
```

```text
.schema
```

예상 출력:

```text
CREATE TABLE Streamers (Id INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT NOT NULL, Platform TEXT NOT NULL, Bio TEXT NOT NULL);
CREATE TABLE sqlite_sequence(name,seq);
```

둘째 줄 `sqlite_sequence`는 `AUTOINCREMENT`가 번호를 기억하려고 SQLite가 자동으로 만든 테이블이에요. 신경 쓰지 않아도 돼요.

:::success
`.tables`에 `Streamers`가 보이고, `.schema`에 `CREATE TABLE Streamers (…)` 줄이 보여요. 프롬프트가 `sqlite>`가 아니라 `...>`로 바뀌어 있으면 아래 🧯의 "프롬프트가 `...>`로 바뀌었어요"를 보세요. 일단 `;`를 쓰고 `Enter`를 눌러 봐요.
:::

### 3단계 · 행 넣기와 읽기: INSERT, SELECT (12분)

**어디서:** `sqlite>` 프롬프트 (2단계에서 이어서)

**무엇을:** 스트리머 3명을 한 줄씩 넣어요. 글자 값은 **작은따옴표**(`'`)로 감싸요. 따옴표 안의 한글은 한글 입력 상태에서 쳐요(`한/영` 키).

```sql
INSERT INTO Streamers (Name, Platform, Bio) VALUES ('달빛곰', 'chzzk', '밤마다 느긋하게 게임하는 곰이에요.');
```

```sql
INSERT INTO Streamers (Name, Platform, Bio) VALUES ('픽셀토끼', 'youtube', '도트 그림을 그리는 토끼예요.');
```

```sql
INSERT INTO Streamers (Name, Platform, Bio) VALUES ('노을고양이', 'soop', '노래와 수다를 좋아하는 고양이예요.');
```

각각 아무것도 나오지 않고 `sqlite>`가 다시 보여요. `Id`를 쓰지 않았지만 `AUTOINCREMENT`가 1, 2, 3을 자동으로 줘요.

`INSERT INTO 테이블 (열, 열) VALUES (값, 값);`의 모양이에요. 열 순서와 값 순서가 서로 맞아야 해요.

이제 전부 읽어요. `*`는 "모든 열"이에요.

```sql
SELECT * FROM Streamers;
```

예상 출력:

```text
Id|Name|Platform|Bio
1|달빛곰|chzzk|밤마다 느긋하게 게임하는 곰이에요.
2|픽셀토끼|youtube|도트 그림을 그리는 토끼예요.
3|노을고양이|soop|노래와 수다를 좋아하는 고양이예요.
```

:::success
첫 줄이 열 이름(`Id|Name|Platform|Bio`)이고 아래에 3행이 보여요. `Id`가 1, 2, 3으로 자동으로 채워졌어요. 한글이 `?`나 깨진 글자로 보이면 아래 🧯의 "한글이 깨져 보여요"를 보세요.
:::

### 4단계 · 골라 읽기: WHERE, ORDER BY, LIKE (9분)

**어디서:** `sqlite>` 프롬프트

**무엇을:** 아래 문장을 하나씩 입력하고 결과를 확인해요.

1. 플랫폼이 `chzzk`인 행만:

```sql
SELECT * FROM Streamers WHERE Platform = 'chzzk';
```

예상 출력:

```text
Id|Name|Platform|Bio
1|달빛곰|chzzk|밤마다 느긋하게 게임하는 곰이에요.
```

2. 이름 순서(가나다)로:

```sql
SELECT * FROM Streamers ORDER BY Name;
```

예상 출력:

```text
Id|Name|Platform|Bio
3|노을고양이|soop|노래와 수다를 좋아하는 고양이예요.
1|달빛곰|chzzk|밤마다 느긋하게 게임하는 곰이에요.
2|픽셀토끼|youtube|도트 그림을 그리는 토끼예요.
```

3. 이름에 `곰`이 들어간 행만. `LIKE '%곰%'`에서 `%`는 "아무 글자나 몇 개든"이에요.

```sql
SELECT * FROM Streamers WHERE Name LIKE '%곰%';
```

예상 출력:

```text
Id|Name|Platform|Bio
1|달빛곰|chzzk|밤마다 느긋하게 게임하는 곰이에요.
```

4. 필요한 열만 골라 읽을 수도 있어요.

```sql
SELECT Name, Platform FROM Streamers;
```

예상 출력:

```text
Name|Platform
달빛곰|chzzk
픽셀토끼|youtube
노을고양이|soop
```

:::success
1번은 1행, 2번은 3행(노을고양이 → 달빛곰 → 픽셀토끼 순서), 3번은 1행, 4번은 열이 두 개만 나와요. 값이 안 맞으면 따옴표를 큰따옴표가 아니라 작은따옴표(`'`)로 썼는지 확인하세요.
:::

### 5단계 · 고치기와 지우기: UPDATE, DELETE (9분)

**어디서:** `sqlite>` 프롬프트

**무엇을:**

1. 1번 스트리머의 소개를 고쳐요. **`WHERE Id = 1`이 꼭 있어야 해요.**

```sql
UPDATE Streamers SET Bio = '소개를 고쳤어요.' WHERE Id = 1;
```

아무것도 나오지 않아요. 결과를 읽어 확인해요.

```sql
SELECT * FROM Streamers WHERE Id = 1;
```

예상 출력:

```text
Id|Name|Platform|Bio
1|달빛곰|chzzk|소개를 고쳤어요.
```

2. 3번을 지우기 전에 같은 조건으로 먼저 읽어서, 지울 행이 맞는지 확인해요.

```sql
SELECT * FROM Streamers WHERE Id = 3;
```

예상 출력:

```text
Id|Name|Platform|Bio
3|노을고양이|soop|노래와 수다를 좋아하는 고양이예요.
```

3. 지워요.

```sql
DELETE FROM Streamers WHERE Id = 3;
```

4. 남은 행을 확인해요.

```sql
SELECT * FROM Streamers;
```

예상 출력:

```text
Id|Name|Platform|Bio
1|달빛곰|chzzk|소개를 고쳤어요.
2|픽셀토끼|youtube|도트 그림을 그리는 토끼예요.
```

:::success
소개가 `소개를 고쳤어요.`로 바뀌었고, 노을고양이가 사라져서 헤더를 포함해 3줄만 남아요. 이제 sqlite3를 나가요. 아래 명령을 입력하면 프롬프트가 `PS C:\dev\sql-practice>`로 돌아와요.

```text
.quit
```
:::

### 6단계 · practice.sql로 저장하고 다시 실행하기 (10분)

터미널에서 친 문장은 닫으면 사라져요. 파일에 적어 두면 언제든 다시 실행할 수 있어요. DB 파일(`practice.db`)은 남아 있지만, 문장을 적어 둔 `.sql` 파일이 있으면 DB를 지워도 처음부터 다시 만들 수 있어요.

**어디서:** PowerShell, 위치 `C:\dev\sql-practice`

**무엇을:**

1. 폴더를 VS Code로 열어요.

```powershell
code C:\dev\sql-practice
```

2. 왼쪽 탐색기에서 **새 파일** 아이콘으로 `practice.sql`을 만들고 아래 내용을 붙여 넣은 뒤 `Ctrl + S`로 저장해요. (처음에 `practice.db`도 탐색기에 보여요. 이진 파일이라 메모장이나 VS Code로 열면 이상한 글자가 보이는 것이 정상이에요.)

📄 C:\dev\sql-practice\practice.sql
```sql
-- 스트리머 테이블 연습 (Day 19)
-- sqlite3에서 .read practice.sql 로 실행해요.
.headers on
.mode list

-- 처음부터 다시 만들 때를 위해 옛 테이블을 지워요
DROP TABLE IF EXISTS Streamers;

CREATE TABLE Streamers (Id INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT NOT NULL, Platform TEXT NOT NULL, Bio TEXT NOT NULL);

INSERT INTO Streamers (Name, Platform, Bio) VALUES ('달빛곰', 'chzzk', '밤마다 느긋하게 게임하는 곰이에요.');
INSERT INTO Streamers (Name, Platform, Bio) VALUES ('픽셀토끼', 'youtube', '도트 그림을 그리는 토끼예요.');
INSERT INTO Streamers (Name, Platform, Bio) VALUES ('노을고양이', 'soop', '노래와 수다를 좋아하는 고양이예요.');

SELECT * FROM Streamers;
SELECT * FROM Streamers WHERE Platform = 'chzzk';
SELECT * FROM Streamers ORDER BY Name;
SELECT * FROM Streamers WHERE Name LIKE '%곰%';

UPDATE Streamers SET Bio = '소개를 고쳤어요.' WHERE Id = 1;
DELETE FROM Streamers WHERE Id = 3;
SELECT * FROM Streamers;
```

`DROP TABLE IF EXISTS Streamers;`는 테이블이 있으면 지우는 문장이에요. 이 파일을 여러 번 실행해도 같은 결과가 나오도록 맨 앞에 두었어요. `--`로 시작하는 줄은 설명이에요.

3. VS Code 아래 터미널(`` Ctrl + ` ``)이나 PowerShell에서 sqlite3를 열어 파일을 실행해요.

```powershell
sqlite3 practice.db
```

```text
.read practice.sql
```

예상 출력(앞에서 본 `SELECT` 결과 여섯 개가 차례로 나오고 마지막이 아래예요):

```text
Id|Name|Platform|Bio
1|달빛곰|chzzk|소개를 고쳤어요.
2|픽셀토끼|youtube|도트 그림을 그리는 토끼예요.
```

```text
.quit
```

:::success
`.read practice.sql`이 오류 없이 끝나고 마지막 결과가 헤더 + 2행이에요. `Parse error`가 나오면 오류에 적힌 줄을 `practice.sql`에서 확인하세요. `practice.sql`을 찾지 못한다는 오류가 나면 sqlite3를 연 폴더가 `C:\dev\sql-practice`인지 확인하세요.
:::

## ✍️ 과제

과제 문장은 `practice.sql`의 맨 아래에 이어서 적고, `.read practice.sql`로 한꺼번에 실행해요.

### 과제 1 · chzzk 스트리머만 (쉬움 ⭐, 4분)

- 플랫폼이 `chzzk`인 스트리머만 읽는 `SELECT` 문을 써요.
- 힌트: 4단계의 첫 번째 문장이에요. 조건 값은 작은따옴표로 감싸요.

### 과제 2 · 이름순 2명 (쉬움 ⭐, 4분)

- 이름만 가나다 순으로 2명 보여 주는 문장을 써요. 결과 열은 `Name` 하나예요.
- 힌트: `ORDER BY`로 정렬하고 `LIMIT 2`로 개수를 줄여요.

### 과제 3 · 방송 일정 테이블 설계 (보통 ⭐⭐, 7분)

- `Schedules` 테이블을 만들어요. 열은 `Id`(기본 키, 자동 증가), `StreamerId`(정수, 어느 스트리머의 일정인지), `Title`(글자), `StartsAt`(글자, 시작 시각), `DurationMinutes`(정수)예요. 모두 비워 둘 수 없어요(`NOT NULL`).
- 이어서 `.tables`로 `Schedules`와 `Streamers` 두 테이블이 보이는지 확인해요.
- 힌트: 2단계의 `CREATE TABLE`을 보고 열을 바꿔요. 날짜와 시각은 SQLite에 따로 자료형이 없어서 글자(`TEXT`)로 저장해요. `StreamerId`를 다른 테이블과 이어 주는 외래 키 설정은 Day 22에서 배워요.

## ✅ 정답

:::answer 과제 1 정답 · chzzk만
📄 C:\dev\sql-practice\practice.sql (일부)
```sql

-- 과제 1: 플랫폼이 chzzk인 스트리머만
SELECT * FROM Streamers WHERE Platform = 'chzzk';
```

예상 출력(`.read` 마지막 근처):

```text
Id|Name|Platform|Bio
1|달빛곰|chzzk|소개를 고쳤어요.
```

**왜 이렇게 하나요?** `WHERE`는 조건에 맞는 행만 남겨요. 글자 값은 작은따옴표로 감싸고, 같은지 비교할 때는 등호 하나(`=`)를 써요(C#의 `==`와 달라요). 노을고양이는 5단계에서 지웠기 때문에 `chzzk`인 달빛곰만 남아요.
:::

:::answer 과제 2 정답 · 이름순 2명
📄 C:\dev\sql-practice\practice.sql (일부)
```sql

-- 과제 2: 이름순으로 2명만
SELECT Name FROM Streamers ORDER BY Name LIMIT 2;
```

예상 출력:

```text
Name
달빛곰
픽셀토끼
```

**왜 이렇게 하나요?** 순서가 중요해요. 먼저 `ORDER BY`로 줄을 세우고, `LIMIT 2`가 앞의 2개만 가져와요. LINQ의 `OrderBy(…).Take(2)`와 같은 순서예요(Day 14). 행이 지금 2개뿐이라서 둘 다 나와요.
:::

:::answer 과제 3 정답 · Schedules 테이블
📄 C:\dev\sql-practice\practice.sql (일부)
```sql

-- 과제 3: 방송 일정 테이블 (StreamerId가 어느 스트리머의 일정인지 알려 줘요)
DROP TABLE IF EXISTS Schedules;
CREATE TABLE Schedules (Id INTEGER PRIMARY KEY AUTOINCREMENT, StreamerId INTEGER NOT NULL, Title TEXT NOT NULL, StartsAt TEXT NOT NULL, DurationMinutes INTEGER NOT NULL);
```

`.read` 뒤에 `.tables`를 입력하면:

```text
Schedules  Streamers
```

**왜 이렇게 하나요?** 스트리머 한 명에게 일정이 여러 개 있어요. 일정 테이블의 각 행에 `StreamerId`를 적어 두면 "이 일정은 몇 번 스트리머의 것"인지 알 수 있어요. 일정 안에 스트리머 이름을 또 적지 않고 번호만 적는 것이 관계형 DB의 기본 방식이에요. 이 설계가 Day 22의 외래 키가 돼요.
:::

:::answer 오늘 끝 상태 전체 코드
막혔다면 아래 `practice.sql`을 `C:\dev\sql-practice` 폴더에 같은 내용으로 저장하고, `sqlite3 practice.db`를 열어 `.read practice.sql`을 실행하면 `practice.db`가 아래 내용과 같아져요. 그다음 Day 20을 시작하세요. 이 Day에서는 스트리머 허브 프로젝트 파일을 바꾸지 않아요.

```text
C:\dev\sql-practice\
├─ practice.sql    (오늘 새로)
└─ practice.db     (sqlite3가 만든 DB 파일)
```

📄 C:\dev\sql-practice\practice.sql
```sql
-- 스트리머 테이블 연습 (Day 19)
-- sqlite3에서 .read practice.sql 로 실행해요.
.headers on
.mode list

-- 처음부터 다시 만들 때를 위해 옛 테이블을 지워요
DROP TABLE IF EXISTS Streamers;

CREATE TABLE Streamers (Id INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT NOT NULL, Platform TEXT NOT NULL, Bio TEXT NOT NULL);

INSERT INTO Streamers (Name, Platform, Bio) VALUES ('달빛곰', 'chzzk', '밤마다 느긋하게 게임하는 곰이에요.');
INSERT INTO Streamers (Name, Platform, Bio) VALUES ('픽셀토끼', 'youtube', '도트 그림을 그리는 토끼예요.');
INSERT INTO Streamers (Name, Platform, Bio) VALUES ('노을고양이', 'soop', '노래와 수다를 좋아하는 고양이예요.');

SELECT * FROM Streamers;
SELECT * FROM Streamers WHERE Platform = 'chzzk';
SELECT * FROM Streamers ORDER BY Name;
SELECT * FROM Streamers WHERE Name LIKE '%곰%';

UPDATE Streamers SET Bio = '소개를 고쳤어요.' WHERE Id = 1;
DELETE FROM Streamers WHERE Id = 3;
SELECT * FROM Streamers;

-- 과제 1: 플랫폼이 chzzk인 스트리머만
SELECT * FROM Streamers WHERE Platform = 'chzzk';

-- 과제 2: 이름순으로 2명만
SELECT Name FROM Streamers ORDER BY Name LIMIT 2;

-- 과제 3: 방송 일정 테이블 (StreamerId가 어느 스트리머의 일정인지 알려 줘요)
DROP TABLE IF EXISTS Schedules;
CREATE TABLE Schedules (Id INTEGER PRIMARY KEY AUTOINCREMENT, StreamerId INTEGER NOT NULL, Title TEXT NOT NULL, StartsAt TEXT NOT NULL, DurationMinutes INTEGER NOT NULL);
```

`.read practice.sql`이 오류 없이 끝나고, 이어서 `.tables`가 `Schedules  Streamers`를 보여 줘요. 끝나면 `.quit`로 나가요. 오늘은 VS Code 폴더를 `C:\dev\sql-practice`로 열었으니, 내일은 `C:\dev\streamer-hub`를 다시 열어요(Day 20 1단계가 열어 줘요).
:::

## 🧯 자주 막히는 곳

여기에 없는 증상은 [문제 해결 모음](#/page/troubleshooting)에서 찾아보세요.

### `sqlite3`가 인식되지 않아요

```text
sqlite3 : The term 'sqlite3' is not recognized as the name of a cmdlet, function, script file, or operable program.
```

한국어 Windows에서는 `'sqlite3' 용어가 cmdlet, 함수, 스크립트 파일 또는 실행할 수 있는 프로그램 이름으로 인식되지 않습니다.`로 보여요(문구는 버전에 따라 달라요).

**원인:** 설치가 끝나지 않았거나, 설치 전에 열려 있던 터미널이 새 프로그램 위치를 몰라요.

**해결:**

1. 터미널과 VS Code를 모두 닫고 새 PowerShell을 열어 `sqlite3 --version`을 다시 쳐요.
2. 그래도 안 되면 `winget install SQLite.SQLite`의 결과 끝에 오류가 없었는지 봐요. `winget`이 없으면(`winget` 용어가 인식되지 않으면) 아래 "winget이 없다면"을 따라요.

**winget이 없다면:** 브라우저로 `https://www.sqlite.org/download.html`을 열고 **Precompiled Binaries for Windows** 아래 `sqlite-tools-win-x64-…zip`(숫자는 버전마다 달라요)을 받아요. 파일을 오른쪽 클릭 → **모두 압축 풀기**에서 폴더를 `C:\dev\tools\sqlite`로 정해요(메뉴 이름은 버전에 따라 달라요). 그 폴더에 `sqlite3.exe`가 있으면 PowerShell에서 아래처럼 전체 경로로 실행할 수 있어요.

```powershell
& "C:\dev\tools\sqlite\sqlite3.exe" practice.db
```

이 방법이면 PATH 설정이 필요 없어요. `sqlite3`만 쳐서 쓰고 싶으면 시작 메뉴에서 "환경 변수"를 검색해 **계정에 대한 환경 변수 편집** → 사용자 변수의 `Path` 선택 → **편집** → **새로 만들기**에 `C:\dev\tools\sqlite` 입력 → 모두 **확인**을 누르고 새 터미널을 열어요(이 메뉴의 정확한 문구는 실기 확인 전이라 달라질 수 있어요).

### 프롬프트가 `...>`로 바뀌었어요

```text
   ...>
```

**원인:** SQL 문장의 끝 `;`를 빼먹어서 sqlite3가 "문장이 아직 안 끝났나?" 하고 다음 줄을 기다려요.

**해결:** 그 자리에서 `;`를 입력하고 `Enter`를 눌러요. 문장이 엉켜서 빠져나오고 싶으면 `Ctrl + C`를 눌러요. 프롬프트가 `sqlite>`로 돌아와요.

### `Parse error: near "…": syntax error`

```text
Parse error: near "SELEC": syntax error
  SELEC * FROM Streamers;
  ^--- error here
```

**원인:** 문장에 오타가 있어요. 오류 아래 줄과 `^--- error here`가 문제의 위치를 가리켜요. 문구와 모양은 sqlite3 버전에 따라 조금 달라요. 존재하지 않는 테이블 이름을 쓰면 `Parse error: no such table: Streamer`처럼 나와요. 열 값을 안 채우면 `Runtime error: NOT NULL constraint failed: Streamers.Bio (19)`가 나요.

**해결:** 오류에 나온 낱말(`SELEC`)의 철자를 고쳐서 다시 입력해요. 방향키 위(↑)를 누르면 앞서 친 문장이 다시 나와요.

### `WHERE`를 빼고 `UPDATE`나 `DELETE`를 했더니 전부 바뀌었어요

**원인:** `UPDATE Streamers SET Bio = '…';`처럼 `WHERE`가 없으면 모든 행이 바뀌어요. `DELETE FROM Streamers;`는 모든 행을 지워요.

**해결:** 연습 DB라서 괜찮아요. `.read practice.sql`을 실행하면 맨 앞의 `DROP TABLE IF EXISTS`가 테이블을 지우고 처음 상태로 다시 만들어요. 진짜 DB에서는 `WHERE` 없는 문장을 실행하기 전에 꼭 한 번 더 확인해요.

### 한글이 깨져 보여요 (또는 `?`로 보여요)

**원인:** 터미널 글꼴이나 문자 인코딩 설정에 따라 한글이 다르게 보일 수 있어요. 작성 시점에 Windows 콘솔에서 확인하지 못했어요(실기 미확인). DB 파일에는 한글이 UTF-8로 들어가기 때문에 입력한 한글은 대개 문제없이 저장돼요.

**해결:**

1. 한글을 직접 치지 않고 6단계처럼 `practice.sql` 파일(VS Code는 UTF-8로 저장해요)에 적고 `.read`로 실행해요.
2. 이미 깨진 글자를 넣었다면 `DELETE FROM Streamers;`로 비우고 `.read practice.sql`로 다시 만들어요.
3. 화면에서만 깨져 보이고 `practice.sql`로 넣은 값이 맞다면 걱정하지 않아도 돼요. 서버(C#)가 읽을 때는 문제가 없어요.

## 📝 오늘의 체크리스트

- [ ] `sqlite3 --version`이 `3.`으로 시작하는 버전을 보여 줘요.
- [ ] `C:\dev\sql-practice\practice.db`와 `practice.sql`이 있어요.
- [ ] `.tables`에 `Streamers`가 보이고 `.schema`에 `CREATE TABLE Streamers (…)`가 보여요.
- [ ] `SELECT * FROM Streamers;`가 헤더 줄 + 행들을 보여 줘요.
- [ ] `WHERE Platform = 'chzzk'`, `ORDER BY Name`, `LIKE '%곰%'`의 결과가 4단계 예상 출력과 같아요.
- [ ] `UPDATE`와 `DELETE`에 `WHERE`를 붙여서 실행했고, 결과를 `SELECT`로 확인했어요.
- [ ] `.read practice.sql`이 오류 없이 끝났어요. 과제 3의 `Schedules`가 `.tables`에 보여요.
- [ ] `.quit`로 sqlite3를 나왔어요(프롬프트가 `PS …>`로 돌아와요).

## 📚 더 알아보기

- [SQLite 소개 (SQLite 공식 사이트)](https://www.sqlite.org/about.html): SQLite가 서버 없이 파일 하나로 동작하는 DB라는 점을 설명한 공식 문서
- [sqlite3 명령줄 셸 (SQLite 공식 사이트)](https://www.sqlite.org/cli.html): `.tables`, `.schema`, `.read` 같은 점 명령을 설명한 공식 문서
- [SQLite SQL 문법 (SQLite 공식 사이트)](https://www.sqlite.org/lang.html): `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `CREATE TABLE`의 모든 문법을 보여 주는 공식 문서

➡️ **다음 Day 예고:** [Day 20 · EF Core 연결](#/day/p2-d20)에서는 C# 클래스와 DB 테이블을 이어 주는 EF Core를 설치하고, 첫 마이그레이션으로 서버 프로젝트에 진짜 `streamerhub.db`를 만들어요.
