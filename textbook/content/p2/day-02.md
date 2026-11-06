## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- 터미널(PowerShell)을 열고, 프롬프트에서 내가 지금 어느 폴더에 있는지 읽을 수 있어요.
- `cd`, `dir`, `mkdir`, `cls` 같은 기본 명령으로 폴더를 만들고 오가고 지울 수 있어요.
- 전체 경로와 상대 경로로 폴더를 옮겨 다니고, 공백이 있는 경로에는 따옴표를 쓸 수 있어요.
- `C:\dev\streamer-hub`를 Git 저장소로 만들어 GitHub에 올릴 수 있어요.

**예상 시간: 90분** (개념 이해 13분 · 따라하기 57분 · 과제 15분 · 정리 5분)

:::path 📂 시작 상태
[Day 1](#/day/p2-d01)의 "오늘 끝 상태 전체 코드"가 있어야 해요. 없거나 다르면 그 코드로 먼저 맞춰 주세요.

- `C:\dev\streamer-hub\README.md`
- VS Code, 한국어 팩, Live Preview 확장 프로그램 ([P1 Day 2](#/day/p1-d02))
- Chrome 또는 Edge ([P1 Day 2](#/day/p1-d02))
- Git: PowerShell에서 `git --version`을 쳤을 때 `git version 2.…`가 나와요 ([P1 Day 7](#/day/p1-d07)). `git config --global user.name`과 `user.email`도 설정되어 있어요.
- GitHub 계정 ([P1 Day 7](#/day/p1-d07))
- 이미 켜 두어야 할 프로그램은 없어요.
:::

## 📖 개념 이해

### 터미널은 글자로 컴퓨터에게 일을 시키는 창이에요

**비유부터 볼게요.** 지금까지는 마우스로 아이콘을 눌러 일을 시켰어요. 식당에서 메뉴판의 그림을 손가락으로 가리켜 주문하는 것과 같아요. 터미널은 말로 주문하는 방식이에요. "C 드라이브의 dev 폴더로 가 줘"를 글자로 적으면 컴퓨터가 바로 해요. 처음에는 불편해 보여도, 같은 일을 반복하거나 개발 도구를 쓸 때는 글자로 시키는 편이 훨씬 빨라요. 앞으로 40일 동안 Node.js, TypeScript, Vite, .NET이 모두 터미널에서 돌아가요.

**정확한 정의는 이래요.**

- **[[Windows Terminal]]**(윈도우 터미널)은 PowerShell 같은 프로그램을 탭으로 여러 개 열어 쓰게 해 주는 Windows 11의 터미널 앱이에요. 시작 메뉴에서 "터미널"을 검색해 열어요. 창 안에서 실제로 명령을 처리하는 것은 PowerShell이에요.
- [[PowerShell]]은 글자로 쓴 명령을 읽고 실행해서 결과를 글자로 보여 주는 프로그램이에요. 이런 프로그램을 셸(shell)이라고 불러요. Windows 11에 처음부터 들어 있는 버전은 **Windows PowerShell 5.1**이에요. [[터미널]]과 PowerShell은 [P1 Day 7](#/day/p1-d07)에서 맛보기로 썼는데, 오늘은 제대로 배워요.
- **[[프롬프트]]**(prompt)는 터미널이 "명령을 입력하세요"라고 기다리며 보여 주는 앞부분 글자예요. 프롬프트가 다시 보이면 앞 명령이 끝났다는 뜻이에요.
- **[[현재 위치]]**는 터미널이 지금 들어가 있는 폴더예요. 많은 명령이 이 폴더를 기준으로 일해요. PowerShell에서는 프롬프트에 함께 보여요.

프롬프트는 이렇게 읽어요.

```text
PS C:\dev\streamer-hub>
│  │
│  └ 현재 위치(폴더 경로)
└ PowerShell이라는 표시
```

### 경로를 다시 떠올려 봐요

[P1 Day 4](#/day/p1-d04)와 [P1 Day 5](#/day/p1-d05)에서 배운 절대 경로와 상대 경로는 터미널에서 그대로 써요.

- `C:\dev\streamer-hub`처럼 드라이브부터 쓰면 **절대 경로**예요. 어디서 쓰든 같은 곳을 가리켜요.
- 현재 위치에서 출발하는 **상대 경로**는 `.`(지금 폴더)와 `..`(한 칸 위 폴더)를 써요.

```text
C:\dev
├─ streamer-hub      ← 지금 여기
└─ my-creator-site
```

지금 위치가 `C:\dev\streamer-hub`일 때 `my-creator-site`로 가려면 `..`(한 칸 위인 `C:\dev`)로 올라갔다가 `my-creator-site`로 내려가요. 즉 `..\my-creator-site`예요.

### 오늘 쓰는 명령

PowerShell의 명령은 이름이 길어서 줄임말(별명)을 같이 써요. 오늘은 줄임말로 외워요.

| 하는 일 | 줄임말 | 원래 이름 |
|---|---|---|
| 지금 위치 보기 | `pwd` | `Get-Location` |
| 폴더 옮기기 | `cd` | `Set-Location` |
| 폴더 안 보기 | `dir` | `Get-ChildItem` |
| 폴더 만들기 | `mkdir` | (폴더 만들기 명령) |
| 화면 지우기 | `cls` | `Clear-Host` |
| 지우기 | (원래 이름 그대로) | `Remove-Item` |

키보드로도 도움을 받아요.

- `Tab`: 몇 글자만 치고 `Tab`을 누르면 나머지를 채워 줘요. 이것을 **[[탭 완성]]**이라고 해요. 오타가 줄고 긴 경로도 빨리 쳐요. 후보가 여러 개면 `Tab`을 누를 때마다 다음 후보로 바뀌어요.
- `↑` / `↓`: 전에 친 명령을 다시 불러와요.
- `Ctrl + C`: 실행 중인 명령을 멈춰요. 복사가 아니에요.

:::warn Windows PowerShell 5.1에서는 `&&`를 쓸 수 없어요
인터넷에서 찾은 명령 중에는 `cd C:\dev && dir`처럼 `&&`로 두 명령을 한 줄에 잇는 것이 많아요. Windows 11의 기본 PowerShell 5.1에서는 오류가 나요(PowerShell 7부터 지원해요). 이 교재는 **명령을 한 줄에 하나씩** 써요. 인터넷에서 명령을 복사할 때도 한 줄씩 나눠서 실행하세요.
:::

:::info 실무에서는
개발자는 하루에도 수십 번 터미널을 써요. 서버를 켜고, 코드를 내려받고, 테스트를 돌리는 일이 모두 명령 한 줄이에요. 회사 서버는 화면이 없어서 터미널로만 다루는 경우도 많아요. 지금 불편해도 2주만 쓰면 마우스보다 빨라져요.
:::

## 🛠️ 따라하기

모두 9단계예요. 앞쪽 5단계는 연습 폴더 `C:\dev\terminal-practice`에서 연습만 하고 지워요. 뒤쪽 4단계는 진짜 프로젝트를 GitHub에 올려요.

### 1단계 · 터미널 열고 읽기 (7분)

**어디서:** Windows 11

**무엇을:**

1. 작업 표시줄의 시작 버튼(⊞)을 오른쪽 클릭하고 **터미널**을 클릭해요. 또는 키보드의 `Win + X`를 누른 뒤 `I`를 눌러도 돼요. 메뉴 이름은 **터미널** 또는 **Windows 터미널**일 수 있어요(버전에 따라 조금 달라요). 메뉴에 없으면 시작 버튼을 누르고 `터미널`을 입력해서 열어요. 그래도 없으면 `Windows PowerShell`을 입력해서 열어요.
2. 창 맨 위 탭 줄에 **Windows PowerShell** 같은 이름이 보이는지 확인해요. 탭 이름이 **명령 프롬프트**이거나 프롬프트가 `C:\Users\이름>`처럼 `PS`가 없으면 탭 오른쪽의 `∨`(아래 화살표)를 클릭해서 **Windows PowerShell**을 골라요.
3. 프롬프트를 읽어요. 맨 앞이 `PS`이고 그 뒤에 `C:\Users\내이름>`처럼 보여요.
4. 아래 명령을 입력하고 `Enter`를 눌러요. 대소문자는 구분하지 않지만 그대로 쳐요. `$`는 `Shift + 4`예요.

```powershell
$PSVersionTable.PSVersion
```

예상 출력(숫자는 사람마다 달라도 돼요. 맨 앞의 `Major`와 `Minor`가 `5`와 `1`이면 맞아요):

```text
Major  Minor  Build  Revision
-----  -----  -----  --------
5      1      26100  4768
```

:::success
- 터미널 창이 열렸고 프롬프트 맨 앞에 `PS`가 보여요.
- `Major`가 `5`, `Minor`가 `1`이에요. `7`로 시작하면 PowerShell 7이 열린 거예요. 그래도 이 교재의 명령은 모두 동작해요.
:::

### 2단계 · 지금 위치 보고 옮기기 (7분)

**어디서:** 터미널 (위치는 처음에 `C:\Users\내이름`이에요)

**무엇을:** 아래 명령을 한 줄씩 입력해요. 입력한 뒤 매번 `Enter`를 눌러요.

```powershell
pwd
```

예상 출력(이름 부분은 내 사용자 이름이에요):

```text
Path
----
C:\Users\내이름
```

```powershell
cd C:\dev
```

아무것도 나오지 않고 다음 줄에 `PS C:\dev>`가 보이면 성공이에요.

```powershell
dir
```

예상 출력(날짜와 시간, 폴더 이름은 사람마다 달라요):

```text
    Directory: C:\dev


Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        2026-11-02  오후 8:00                hello
d-----        2026-11-02  오후 8:10                my-creator-site
d-----        2026-11-02  오후 8:30                streamer-hub
```

```powershell
cd streamer-hub
```

```powershell
cd ..
```

:::success
- `cd C:\dev` 뒤에 프롬프트가 `PS C:\dev>`로 바뀌어요.
- `dir`에서 `streamer-hub` 폴더가 보여요. `Mode` 열의 `d`는 폴더(directory)라는 뜻이에요.
- `cd streamer-hub` 뒤에 `PS C:\dev\streamer-hub>`, `cd ..` 뒤에 다시 `PS C:\dev>`가 보여요.
:::

### 3단계 · 연습 폴더를 만들고 오가기 (10분)

연습은 실수해도 되는 폴더에서 해요. `C:\dev\terminal-practice`를 만들고 안에서 놀다가 나중에 통째로 지울 거예요.

**어디서:** 터미널, 위치 `C:\dev`

**무엇을:** 한 줄씩 입력해요.

```powershell
mkdir C:\dev\terminal-practice
```

예상 출력:

```text
    Directory: C:\dev


Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        2026-11-02  오후 8:40                terminal-practice
```

```powershell
cd C:\dev\terminal-practice
```

```powershell
mkdir a
```

여기서는 상대 경로를 썼어요. 현재 위치가 `C:\dev\terminal-practice`라서 그 안에 `a`가 만들어져요.

```powershell
cd a
```

```powershell
mkdir b
```

```powershell
cd b
```

```powershell
pwd
```

예상 출력:

```text
Path
----
C:\dev\terminal-practice\a\b
```

이제 키보드 도움을 써 봐요.

1. 아래 `cd ..` 를 두 번 입력해서 `C:\dev\terminal-practice`로 돌아와요.

```powershell
cd ..
```

2. 다시 `cd a`를 입력하는 대신 `cd a`까지만 치지 말고, `cd` 뒤에 빈칸을 하나 두고 `a`를 입력한 다음 `Tab`을 눌러요. 이미 `a`라서 달라지는 것이 없으면 `cd C:\dev\ter`까지 입력하고 `Tab`을 눌러 보세요. `terminal-practice`로 채워지는 것을 볼 수 있어요. 확인만 하고 `Enter` 없이 `Ctrl + C`로 줄을 지워요.
3. `↑` 키를 몇 번 눌러 방금 친 명령들이 다시 나타나는 것을 봐요. 확인했으면 `Ctrl + C`로 줄을 지워요.
4. 화면이 복잡해졌으면 `cls`를 입력하고 `Enter`를 눌러요. 화면이 깨끗해져요.
5. 아래 명령은 30초 동안 아무 일도 안 하고 기다려요. 입력하고 `Enter`를 누른 뒤 몇 초 기다렸다가 `Ctrl + C`를 눌러 멈춰 봐요.

```powershell
Start-Sleep -Seconds 30
```

:::success
- 3번에서 예전 명령이 그대로 다시 나타나요.
- 4번에서 화면이 지워지고 프롬프트만 맨 위에 보여요.
- 5번에서 `Ctrl + C`를 누르면 기다림이 멈추고 프롬프트가 바로 돌아와요. 서버처럼 끝나지 않는 프로그램을 멈출 때 앞으로 자주 써요.
:::

### 4단계 · 공백이 있는 경로와 `&&` 알아보기 (5분)

폴더 이름에 공백이 있으면 터미널은 공백에서 단어를 나눠요. 그래서 경로를 **큰따옴표**로 감싸요. 공백이 든 경로는 이 교재에서 쓰지 않지만, 내 컴퓨터의 다른 폴더(예: `C:\Program Files`)를 만나면 꼭 필요해요.

**어디서:** 터미널, 위치 `C:\dev\terminal-practice`

**무엇을:**

```powershell
mkdir "C:\dev\terminal-practice\my folder"
```

```powershell
cd "C:\dev\terminal-practice\my folder"
```

따옴표 없이 쳤을 때 무슨 일이 생기는지도 봐요. 이번에는 오류가 나는 것이 정상이에요.

```powershell
cd C:\dev\terminal-practice\my folder
```

예상 출력(문구와 줄 모양은 PowerShell 버전에 따라 조금 달라요):

```text
cd : A positional parameter cannot be found that accepts argument 'folder'.
At line:1 char:1
+ cd C:\dev\terminal-practice\my folder
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : InvalidArgument: (:) [Set-Location], ParameterBindingException
    + FullyQualifiedErrorId : PositionalParameterNotFound,Microsoft.PowerShell.Commands.SetLocationCommand
```

풀이: "`cd`가 받을 수 있는 값은 하나인데 `folder`라는 값이 하나 더 왔다"는 뜻이에요. `my`와 `folder`가 따로따로 들어간 거예요. 따옴표로 감싸면 하나로 읽어요.

마지막으로 `&&`를 한 번 써 봐요. 이것도 오류가 나는 것이 정상이에요(Windows PowerShell 5.1일 때).

```powershell
cd C:\dev && dir
```

예상 출력(5.1일 때. 문구는 버전에 따라 조금 달라요):

```text
At line:1 char:11
+ cd C:\dev && dir
+           ~~
The token '&&' is not a valid statement separator in this version.
    + CategoryInfo          : ParserError: (:) [], ParentContainsErrorRecordException
    + FullyQualifiedErrorId : InvalidEndOfLine
```

풀이: "이 버전에서는 `&&`를 명령 사이의 구분으로 인정하지 않는다"는 뜻이에요. 한 줄에 하나씩 따로 입력하면 돼요.

:::success
- 따옴표로 감싼 `cd`는 아무 출력 없이 프롬프트가 `PS C:\dev\terminal-practice\my folder>`로 바뀌어요.
- 따옴표 없이 친 `cd`와 `&&`는 빨간 오류 글자가 나와요. 오류가 나도 터미널이 망가지지 않아요. 그냥 다음 줄에서 계속하면 돼요.
- PowerShell 7을 쓰고 있다면 `&&` 줄이 오류 없이 실행될 수 있어요. 그래도 이 교재는 한 줄에 하나씩 써요.
:::

### 5단계 · 연습 폴더 지우기 (3분)

연습이 끝났으니 지워요. 지우는 명령은 되돌릴 수 없어서 신중해야 해요.

**어디서:** 터미널, 위치는 `C:\dev`로 먼저 옮겨요

**무엇을:** 지우는 폴더 **안에 있으면** 지울 수 없으니 먼저 `C:\dev`로 나가요.

```powershell
cd C:\dev
```

:::warn 지우기는 휴지통에 가지 않고 바로 사라져요
`Remove-Item`으로 지운 파일은 휴지통에 들어가지 않아요. 경로를 다시 한 번 읽고 `C:\dev\terminal-practice`가 맞는지 확인한 뒤에 실행하세요. `-Recurse`는 폴더 안의 모든 것을 함께, `-Force`는 확인을 묻지 않고 지운다는 뜻이에요. 이 교재에서 경로는 항상 전체 경로로 써요.
:::

```powershell
Remove-Item -Recurse -Force C:\dev\terminal-practice
```

아무것도 나오지 않고 프롬프트가 `PS C:\dev>`로 돌아오면 성공이에요. 확인해 봐요.

```powershell
dir
```

예상 출력(날짜는 달라요):

```text
    Directory: C:\dev


Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        2026-11-02  오후 8:00                hello
d-----        2026-11-02  오후 8:10                my-creator-site
d-----        2026-11-02  오후 8:30                streamer-hub
```

:::success
`dir` 목록에 `terminal-practice`가 없어요. `streamer-hub`는 그대로 남아 있어요.
:::

### 6단계 · VS Code 터미널로 옮기고 README에 개발 환경 쓰기 (7분)

앞으로는 VS Code 안에 들어 있는 터미널을 주로 써요. 코드와 터미널을 한 창에서 볼 수 있어서 편해요.

**어디서:** 지금 쓰던 터미널(1~5단계), 그다음 VS Code

**무엇을:**

1. 터미널에서 프로젝트 폴더로 가요.

```powershell
cd C:\dev\streamer-hub
```

2. 이 폴더를 VS Code로 열어요. 이미 Day 1에서 열어 둔 창이 있으면 그 창을 쓰면 돼요. 새로 열려면:

```powershell
code .
```

`code`는 VS Code를 여는 명령이고 `.`은 "지금 폴더"예요. 아무것도 나오지 않고 VS Code가 열리면 성공이에요.

3. VS Code 창에서 `` Ctrl + ` ``(숫자 `1` 왼쪽 키, 한국어 키보드에서는 `₩` 아래의 백틱 키)를 눌러요. 창 아래쪽에 터미널 패널이 열려요. 안 열리면 위쪽 메뉴 **터미널 → 새 터미널**(영어: **Terminal → New Terminal**)을 클릭해요.
4. 터미널 패널 오른쪽 위에 현재 셸 이름이 보여요. **powershell**이라고 쓰여 있으면 맞아요. 다른 이름(**cmd**, **bash** 등)이면 오른쪽 위 `∨` 모양을 클릭해서 **PowerShell**을 골라요.
5. 프롬프트가 `PS C:\dev\streamer-hub>`로 시작하는지 읽어요.
6. `Win + R`을 누르고 `winver`를 입력한 뒤 `Enter`를 눌러요. 나온 창에서 버전과 OS 빌드를 읽고 **확인**을 클릭해서 닫아요.
7. VS Code에서 `README.md`를 열어 파일 맨 아래에 아래 내용을 붙여 넣어요. 내 컴퓨터의 값(24H2 부분과 PowerShell 번호)으로 바꿔요.

📄 C:\dev\streamer-hub\README.md (일부)
```md

## 개발 환경

- 운영 체제: Windows 11 (버전 24H2)
- PowerShell: 5.1
```

8. `Ctrl + S`로 저장해요.

:::success
- VS Code 아래쪽 터미널 패널에 `PS C:\dev\streamer-hub>`가 보여요.
- `winver` 창에 Windows 버전이 보여요.
- `README.md` 탭의 이름 옆에 점(●)이 없어요(저장됨).
:::

### 7단계 · Git 저장소로 만들고 첫 커밋하기 (7분)

[P1 Day 7](#/day/p1-d07)에서 배운 흐름을 다시 해요. 폴더를 Git 저장소로 만들고(`init`), 올릴 파일을 고르고(`add`), 기록을 남겨요(`commit`).

**어디서:** VS Code 아래쪽 터미널 패널 (프롬프트 `PS C:\dev\streamer-hub>`)

**무엇을:** 한 줄씩 입력해요.

```powershell
git init
```

예상 출력:

```text
Initialized empty Git repository in C:/dev/streamer-hub/.git/
```

```powershell
git add README.md
```

아무것도 나오지 않고 프롬프트가 돌아오면 성공이에요. 아래와 같은 안내가 나올 수도 있어요. 무시해도 되는 안내예요.

```text
warning: in the working copy of 'README.md', LF will be replaced by CRLF the next time Git touches it
```

풀이: "이 파일의 줄바꿈 방식이 Windows 방식(CRLF)으로 바뀔 수 있다"는 알림이에요. Windows 방식 줄바꿈은 [P1 Day 7](#/day/p1-d07)에서 Git을 설치할 때 기본값으로 정했어요. 코드가 틀린 것도, 해야 할 일이 있는 것도 아니에요.

```powershell
git commit -m "day02: 프로젝트 시작"
```

예상 출력(앞의 7글자 `1a2b3c4`와 줄 수는 달라도 돼요):

```text
[main (root-commit) 1a2b3c4] day02: 프로젝트 시작
 1 file changed, 33 insertions(+)
 create mode 100644 README.md
```

```powershell
git branch -M main
```

이 명령은 맨 처음 브랜치 이름을 `main`으로 맞추는 명령이에요. 이미 `main`이면 아무 일도 일어나지 않고, 아무것도 나오지 않아요.

```powershell
git log --oneline
```

예상 출력:

```text
1a2b3c4 (HEAD -> main) day02: 프로젝트 시작
```

:::success
`git log --oneline`에 커밋이 한 줄 보여요. `git status`를 입력하면 `On branch main`과 `nothing to commit, working tree clean`이 나와요.
:::

### 8단계 · GitHub에 빈 저장소 만들기 (4분)

내 컴퓨터의 기록을 인터넷 보관함(GitHub)에 올리려면 보관함을 먼저 만들어야 해요.

**어디서:** 브라우저 → `https://github.com/`

**무엇을:**

1. 로그인된 GitHub 화면 오른쪽 위의 **+** 아이콘을 클릭하고 **New repository**를 클릭해요.
2. **Repository name** 칸에 영어로 `streamer-hub`를 입력해요.
3. **Public**(공개)을 선택한 채로 둬요. 공개 여부는 Day 40에서 다시 정해도 돼요.
4. **Add a README file**, **Add .gitignore**, **Choose a license**는 모두 체크하지 않아요. 이미 내 컴퓨터에 README가 있어서 겹치면 푸시할 때 충돌이 나요.
5. 맨 아래 **Create repository**를 클릭해요.

:::success
빈 저장소 화면이 열려요. 위쪽에 `https://github.com/내아이디/streamer-hub.git` 같은 주소가 보이고 **Quick setup**이라는 안내가 있어요. 이 주소를 복사 버튼으로 복사해 두세요. 화면 문구는 GitHub 개편에 따라 조금 달라질 수 있어요.
:::

### 9단계 · 내 컴퓨터와 GitHub 연결하고 올리기 (7분)

**어디서:** VS Code 터미널 패널 (위치 `C:\dev\streamer-hub`)

**무엇을:** 아래 첫 명령의 주소에서 `내아이디` 부분을 **내 GitHub 아이디로 바꿔서** 입력해요. 가장 안전한 방법은 GitHub 화면에서 복사한 주소를 `git remote add origin ` 뒤에 붙여 넣는 거예요.

```powershell
git remote add origin https://github.com/내아이디/streamer-hub.git
```

아무것도 나오지 않고 프롬프트가 돌아오면 성공이에요. 연결을 확인해요.

```powershell
git remote -v
```

예상 출력:

```text
origin  https://github.com/내아이디/streamer-hub.git (fetch)
origin  https://github.com/내아이디/streamer-hub.git (push)
```

이제 올려요.

```powershell
git push -u origin main
```

처음 올릴 때는 GitHub 로그인 창(Git Credential Manager)이 열릴 수 있어요. **Sign in with your browser**(브라우저로 로그인) 같은 버튼을 클릭하고, 열린 브라우저에서 GitHub에 로그인한 뒤 **Authorize**(허용)를 클릭해요. 창 문구는 버전에 따라 조금 달라요. 이미 [P1 Day 7](#/day/p1-d07)에서 로그인했다면 창이 안 뜰 수도 있어요.

예상 출력(숫자는 달라도 돼요):

```text
Enumerating objects: 3, done.
Counting objects: 100% (3/3), done.
Delta compression using up to 8 threads
Compressing objects: 100% (2/2), done.
Writing objects: 100% (3/3), 912 bytes | 912.00 KiB/s, done.
Total 3 (delta 0), reused 0 (delta 0), pack-reused 0 (from 0)
To https://github.com/내아이디/streamer-hub.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.
```

:::success
- 마지막에 `branch 'main' set up to track 'origin/main'.`이 나와요.
- 브라우저에서 `https://github.com/내아이디/streamer-hub`를 새로 고치면 `README.md` 파일과 내가 쓴 소개 글이 보여요.
:::

:::tip 앞으로의 습관: Day가 끝나면 커밋하고 푸시해요
프로젝트 파일이 바뀐 날에는 마지막에 `git add -A`, `git commit -m "dayNN: 한 줄 요약"`, `git push`를 해요. 체크리스트에 항목을 넣어 둘게요. 하루 단위로 기록이 남으면 잘못됐을 때 되돌아갈 수 있어요. 연습 폴더(`terminal-practice` 등)는 Git에 올리지 않아요.
:::

## ✍️ 과제

### 과제 1 · 폴더 구조 만들고 지우기 (쉬움 ⭐, 5분)

- `C:\dev\terminal-practice`를 다시 만들어요. 그 안에 `a`, 그 안에 `b`, 그 안에 `c`를 한 줄에 하나씩 `mkdir`로 만들어요.
- `cd`로 `c`까지 들어갔다가 `cd C:\dev`로 나와요.
- `Remove-Item`으로 `C:\dev\terminal-practice`를 통째로 지워요.
- 확인: `dir`에서 `terminal-practice`가 없어요.
- 힌트: 폴더 안에 들어가 있으면 그 폴더를 지울 수 없어요. 먼저 나와요.

### 과제 2 · 상대 경로만으로 다른 폴더로 가기 (보통 ⭐⭐, 3분)

- 위치가 `C:\dev\streamer-hub`일 때, 전체 경로(`C:\`로 시작하는 경로)를 쓰지 말고 **상대 경로만으로** `C:\dev\my-creator-site`로 이동해요.
- 확인: `pwd`가 `C:\dev\my-creator-site`를 보여 줘요.
- 힌트: `..`로 한 칸 위에 올라갔다가 내려가요. 확인 뒤에는 `cd C:\dev\streamer-hub`로 돌아와요.

### 과제 3 · README 고치고 두 번째 커밋·푸시 (쉬움 ⭐, 7분)

- PowerShell에서 `git --version`을 입력해 나온 글자를 `README.md`의 `## 개발 환경` 목록 맨 아래에 `- Git: git version 2.…` 줄로 추가해요.
- 저장하고 `git add README.md`, `git commit -m "day02: 개발 환경 기록"`, `git push`를 실행해요.
- 확인: GitHub 저장소 페이지에서 커밋이 2개로 늘고, README 아래쪽에 Git 줄이 보여요. `git log --oneline`에 줄이 2개예요.
- 힌트: 두 번째부터는 `git push` 뒤에 `-u origin main`이 필요 없어요.

## ✅ 정답

:::answer 과제 1 정답 · 폴더 구조 만들고 지우기
```powershell
mkdir C:\dev\terminal-practice
cd C:\dev\terminal-practice
mkdir a
cd a
mkdir b
cd b
mkdir c
cd c
cd C:\dev
Remove-Item -Recurse -Force C:\dev\terminal-practice
dir
```

**왜 이렇게 하나요?** `mkdir`로 만든 폴더 안으로 `cd`로 들어가 다시 `mkdir`을 하면 깊은 구조가 만들어져요. `Remove-Item`은 지우려는 폴더 밖에서 실행해요. `-Recurse`가 있으면 안의 폴더도 함께 지워요. 한 줄에 여러 명령을 이으려고 `&&`를 쓰지 않은 점에 주의하세요. 5.1에서는 오류가 나요.
:::

:::answer 과제 2 정답 · 상대 경로로 이동
```powershell
cd ..\my-creator-site
pwd
cd C:\dev\streamer-hub
```

**왜 이렇게 하나요?** 위치가 `C:\dev\streamer-hub`일 때 `..`는 한 칸 위인 `C:\dev`를 뜻해요. 거기서 `my-creator-site`로 내려가니 `..\my-creator-site`예요. 전체 경로를 쓰지 않아도 되는 이유는 현재 위치가 기준이기 때문이에요. `cd ../my-creator-site`처럼 `/`를 써도 PowerShell에서는 같은 곳으로 가요.
:::

:::answer 과제 3 정답 · 두 번째 커밋과 푸시
`README.md`의 개발 환경 절이 이렇게 돼요(Git 버전은 내 값이에요).

```md
## 개발 환경

- 운영 체제: Windows 11 (버전 24H2)
- PowerShell: 5.1
- Git: git version 2.56.0.windows.4
```

```powershell
git add README.md
git commit -m "day02: 개발 환경 기록"
git push
```

**왜 이렇게 하나요?** `git push -u origin main`은 처음 한 번만 "내 `main`은 원격의 `origin/main`과 짝이에요"를 기록하려고 썼어요. 그 뒤로는 `git push`만 써도 짝에게 올라가요. 환경을 README에 적어 두면 나중에 "그때 내 컴퓨터에서는 되던 것"을 비교하기 쉬워요.
:::

:::answer 오늘 끝 상태 전체 코드
오늘 따라하기와 과제를 모두 끝낸 상태예요. 막혔다면 `README.md`를 아래 내용으로 맞추고 Day 3을 시작하세요. `.git` 폴더는 `git init`이 만든 숨김 폴더라서 직접 만들거나 고치지 않아요.

```text
C:\dev\streamer-hub\
├─ .git\        (git init이 만든 숨김 폴더)
└─ README.md
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

## 개발 환경

- 운영 체제: Windows 11 (버전 24H2)
- PowerShell: 5.1
- Git: git version 2.56.0.windows.4
```

내 컴퓨터의 Windows 버전, PowerShell 번호, Git 버전은 내 값이어도 괜찮아요. 연습 폴더 `C:\dev\terminal-practice`는 지워져 있어야 해요.
:::

## 🧯 자주 막히는 곳

여기에 없는 증상은 [문제 해결 모음](#/page/troubleshooting)에서 찾아보세요.

### VS Code 터미널의 프롬프트에 `PS`가 없거나 `$`로 시작해요

**원인:** VS Code의 통합 터미널이 PowerShell이 아니라 명령 프롬프트(cmd)나 Git Bash로 열렸어요. Git을 설치하면 Git Bash가 기본 셸로 잡히는 경우가 있어요.

**해결:**

1. VS Code 아래 터미널 패널 오른쪽 위의 `∨`(아래 화살표)를 클릭해요.
2. 목록에서 **PowerShell**을 클릭해요.
3. 프롬프트가 `PS C:\dev\streamer-hub>`로 바뀌면 해결이에요.
4. 계속 같은 셸이 열리면 같은 `∨` 메뉴의 **기본 프로필 선택**(영어: **Select Default Profile**)에서 **PowerShell**을 골라요. 그다음부터는 새 터미널이 PowerShell로 열려요.

### `The token '&&' is not a valid statement separator in this version.`

```text
The token '&&' is not a valid statement separator in this version.
```

**원인:** Windows PowerShell 5.1은 `&&`를 지원하지 않아요(PowerShell 7부터 지원). 인터넷에서 복사한 명령에 `&&`가 들어 있으면 이 오류가 나요.

**해결:** `&&` 앞뒤의 명령을 **한 줄에 하나씩** 따로 입력해요. 예를 들어 `cd C:\dev && dir`는 `cd C:\dev`를 치고 `Enter`, 그다음 `dir`을 치고 `Enter`예요.

### `cd : A positional parameter cannot be found that accepts argument 'folder'.`

**원인:** 폴더 이름에 공백이 있는데 따옴표를 쓰지 않아서 `cd`가 단어를 둘로 나눠 읽었어요. 한국어 사용자 이름이나 `Program Files`처럼 공백이 있는 경로에서 자주 나와요.

**해결:** 경로 전체를 큰따옴표(`"`)로 감싸요. 예: `cd "C:\dev\terminal-practice\my folder"`. 큰따옴표는 `Shift` 키를 누른 채 `Enter` 왼쪽의 `'` 키를 눌러요. 프롬프트가 해당 폴더로 바뀌면 해결이에요.

### `fatal: not a git repository (or any of the parent directories): .git`

```text
fatal: not a git repository (or any of the parent directories): .git
```

**원인:** Git은 "저장소 안"에서만 일해요. 지금 터미널의 현재 위치가 `C:\dev\streamer-hub`가 아니거나, 아직 `git init`을 안 했어요. 터미널 창을 닫았다 다시 열면 위치가 처음(`C:\Users\내이름`)으로 돌아가요.

**해결:**

1. 프롬프트의 경로를 읽어요.
2. `cd C:\dev\streamer-hub`를 입력해 프로젝트 폴더로 가요.
3. 그래도 같은 오류면 `dir -Force`를 입력해 `.git` 폴더가 보이는지 확인하고, 없으면 `git init`을 실행해요.

### `error: remote origin already exists.`

```text
error: remote origin already exists.
```

**원인:** `git remote add origin …`을 두 번 실행했어요. 이미 `origin`이라는 이름의 연결이 있다는 뜻이에요.

**해결:**

1. `git remote -v`로 지금 연결된 주소를 확인해요.
2. 주소가 틀렸다면 `git remote set-url origin https://github.com/내아이디/streamer-hub.git`로 고쳐요(`내아이디`는 내 GitHub 아이디예요).
3. 다시 `git remote -v`를 입력해서 주소가 맞는지 확인해요.

### `git push`에서 GitHub 로그인 창이 뜨거나 `Authentication failed`가 나요

**원인:** 처음 올릴 때는 GitHub가 "누구세요?"라고 물어요. 창을 닫았거나 다른 계정으로 로그인하면 인증이 실패해요. 저장소 주소의 아이디가 틀려도 비슷한 오류가 나요(`remote: Repository not found.`). 문구는 Git·GitHub 버전에 따라 조금 달라요.

**해결:**

1. 로그인 창이 뜨면 **Sign in with your browser**(브라우저로 로그인)를 클릭하고 GitHub에 로그인해서 허용해요.
2. `git remote -v`로 주소의 아이디와 저장소 이름(`streamer-hub`)이 맞는지 확인하고, 틀리면 바로 위 항목의 `set-url`로 고쳐요.
3. 다시 `git push -u origin main`을 실행해서 `branch 'main' set up to track 'origin/main'.`이 나오면 해결이에요.

## 📝 오늘의 체크리스트

- [ ] 터미널을 열고 프롬프트가 `PS C:\…>`로 시작하는 것을 확인했어요
- [ ] `$PSVersionTable.PSVersion`으로 PowerShell 버전을 봤어요(`5.1` 또는 그 이상)
- [ ] `cd`, `dir`, `mkdir`, `cls`, `Tab`, `↑`, `Ctrl + C`를 직접 써 봤어요
- [ ] `C:\dev\terminal-practice`를 만들었다가 `Remove-Item`으로 지웠어요
- [ ] VS Code 통합 터미널이 PowerShell이고 위치가 `C:\dev\streamer-hub`인 것을 확인했어요
- [ ] `git log --oneline`에 커밋이 2줄 보여요
- [ ] GitHub의 `streamer-hub` 저장소 페이지에서 `README.md`와 커밋 2개를 확인했어요
- [ ] 과제 1~3을 풀고 정답과 비교했어요

## 📚 더 알아보기

- [Windows 터미널 문서](https://learn.microsoft.com/ko-kr/windows/terminal/): Windows Terminal의 설치와 설정, 탭 사용법을 설명해요.
- [PowerShell 시작하기](https://learn.microsoft.com/ko-kr/powershell/scripting/overview): PowerShell이 무엇이고 명령이 어떻게 이름 지어지는지 알려 줘요.
- [Git — 시작하기](https://git-scm.com/book/ko/v2/%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0-Git-%EA%B8%B0%EC%B4%88): `init`, `add`, `commit` 흐름을 한국어로 정리한 공식 책이에요.

➡️ **다음 Day 예고:** [Day 3 · Node.js와 npm](#/day/p2-d03)에서는 브라우저 밖에서 JavaScript를 실행하는 Node.js를 설치하고, 개발 도구를 내려받는 npm을 써 봐요. PowerShell이 `npm`을 막는 오류(실행 정책)도 미리 해결해 둬요.
