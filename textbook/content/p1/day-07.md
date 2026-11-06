## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- 버전 관리가 왜 필요한지, Git과 GitHub가 각각 무엇인지 설명할 수 있어요.
- Git을 설치하고, VS Code 안의 터미널(PowerShell)에서 명령을 입력할 수 있어요.
- GitHub 계정과 저장소를 만들고, 지금까지 만든 사이트를 GitHub에 올릴 수 있어요.
- VS Code의 소스 제어 패널로 두 번째 커밋을 만들어 올릴 수 있어요.

**예상 시간: 120분** (개념 이해 15분 · 따라하기 70분 · 과제 30분 · 정리 5분)

:::path 📂 시작 상태
어제(Day 6)까지 만든 파일이 이렇게 있어야 해요. 없거나 다르면 [Day 6](#/day/p1-d06)의 "오늘 끝 상태 전체 코드"로 맞춰 주세요.

- `C:\dev\my-creator-site\index.html`, `about.html`, `contents.html`, `schedule.html`, `contact.html`
- `C:\dev\my-creator-site\images\profile.svg`, `C:\dev\my-creator-site\images\logo.svg`
- `C:\dev\hello\hello.html`, `favorites.html`, `tools.html`, `links.html`, `pages\back.html`
- VS Code(한국어 팩, Live Preview 확장 프로그램)가 **먼저** 설치되어 있어요. Git을 설치할 때 VS Code를 편집기로 고르기 위해서예요.
- VS Code에서 `C:\dev\my-creator-site` 폴더가 열려 있어요.
- 오늘은 **인터넷 연결**과 **이메일 주소**(GitHub 가입 인증용)가 필요해요.
:::

## 📖 개념 이해

### 버전 관리: 게임의 세이브 파일처럼

**비유부터 볼게요.** 게임에서 보스 전투 전에 세이브해 두면, 져도 그 시점으로 돌아갈 수 있어요. 코드도 비슷해요. 잘 되던 상태를 기록해 두면 나중에 망가져도 되돌릴 수 있어요. "홈페이지_최종", "홈페이지_진짜최종", "홈페이지_진짜최종2"처럼 복사본을 계속 만드는 대신 한 폴더에서 기록만 쌓아요.

**정확한 정의는 이래요.** **[[버전 관리]]**(version control)는 파일이 바뀐 기록을 시점마다 남겨 두고, 필요하면 예전 상태로 되돌리거나 비교할 수 있게 관리하는 것이에요. 이 교재에서는 세 가지 이유로 써요.

- 잘 되던 시점으로 되돌릴 수 있어요.
- 내 파일을 인터넷에 백업해 둘 수 있어요.
- Day 14에 사이트를 인터넷에 공개하려면 이 기록을 올려 둬야 해요.

### Git과 GitHub

두 가지를 헷갈리기 쉬워요. 이름이 비슷하지만 달라요.

- **[[Git]]**(깃)은 가장 널리 쓰는 버전 관리 프로그램이에요. 내 컴퓨터에 설치하고, `git add`, `git commit` 같은 명령으로 폴더의 변경 기록을 저장해요. 인터넷이 없어도 동작해요.
- **[[GitHub]]**(깃허브)는 Git 저장소를 인터넷에 올려 두고 공유하는 웹 서비스예요(`https://github.com/`). 내 코드를 백업하고, 다른 사람과 함께 작업하고, 사이트를 공개할 수 있어요.

Git은 내 컴퓨터의 기록 도구이고, GitHub는 그 기록을 맡아 두는 인터넷 보관함이에요.

### 저장소, 커밋, 스테이징, 푸시

- **[[저장소]]**(repository, 줄여서 repo)는 Git이 변경 기록을 관리하는 프로젝트 폴더 하나예요. 폴더 안에서 `git init`을 하면 숨김 폴더 `.git`이 생기고, 여기에 모든 기록이 쌓여요.
- **[[커밋]]**(commit)은 저장소의 지금 상태를 메시지와 함께 기록 하나로 남기는 것이에요. 게임의 세이브 한 칸이에요. 커밋마다 고유 번호가 붙어요.
- **[[스테이징]]**(staging)은 다음 커밋에 넣을 변경을 골라 올려 두는 단계예요. 사진을 찍기 전에 찍을 물건을 상 위에 올려 두는 것과 비슷해요. `git add`로 해요.
- **[[원격 저장소]]**(remote repository)는 내 컴퓨터가 아닌 인터넷(여기서는 GitHub)에 있는 저장소예요. 이 교재에서는 `origin`이라는 이름으로 연결해요.
- **[[푸시]]**(push)는 내 컴퓨터 저장소의 커밋을 원격 저장소로 올려 보내는 것이에요.
- **[[브랜치]]**(branch)는 저장소 안에서 커밋이 이어지는 한 줄기예요. 기본 줄기의 이름을 이 교재에서는 `main`으로 정해요. 오늘은 `main` 하나만 써요.

고친 파일이 GitHub에 올라가기까지의 흐름이에요.

```text
고친 파일
   │ git add
   ▼
스테이징 (올려 둠)
   │ git commit
   ▼
내 컴퓨터의 기록
   │ git push
   ▼
GitHub (인터넷)
```

### 터미널과 PowerShell

**[[터미널]]**(terminal)은 마우스 대신 글자로 명령을 입력해 컴퓨터를 다루는 창이에요. 한 줄 입력하고 `Enter`를 누르면 실행되고 결과가 글자로 나와요. **[[PowerShell]]**(파워셸)은 Windows에 들어 있는 터미널 프로그램이에요. 이 교재는 VS Code 안에 들어 있는 터미널(PowerShell)만 써요. 터미널 기초는 P2의 Day 2에서 제대로 배워요. 오늘은 필요한 만큼만 해요.

터미널에 이런 줄이 보여요.

```text
PS C:\dev\my-creator-site>
```

`PS`는 PowerShell이라는 표시이고, `>` 앞의 `C:\dev\my-creator-site`는 **지금 있는 폴더**예요. 명령은 이 폴더에서 실행돼요. 위치가 다르면 명령이 엉뚱한 곳에서 실행돼요.

## 🛠️ 따라하기

모두 9단계예요. Git 설치 화면은 버전에 따라 글자나 순서가 조금 다를 수 있어요(작성 기준일 2026-11). 글자가 달라도 같은 위치의 같은 뜻의 선택지를 고르면 돼요.

### 1단계 · Git 내려받기 (6분)

**어디서:** 브라우저 주소 표시줄

**무엇을:**

1. `https://git-scm.com/`을 입력하고 `Enter`를 눌러요.
2. 화면의 **Download for Windows** 버튼을 클릭하고, 이어지는 화면에서 64비트(x64) 설치 파일(**Git for Windows/x64 Setup**)을 내려받아요.
3. 내려받기가 끝나면 `Ctrl + J`로 다운로드 목록을 열어요.

:::success
다운로드 목록에 `Git-2.56.0.4-64-bit.exe`처럼 `Git-` 숫자 `-64-bit.exe`로 이름이 이어진 파일이 보여요. 숫자는 달라도 돼요(작성 기준일 2026-11의 최신은 `2.56.0.windows.4`예요).
:::

### 2단계 · 설치 마법사 따라가기 (10분)

**어디서:** 다운로드 목록에서 방금 받은 `Git-…-64-bit.exe`

**무엇을:** 파일을 실행하고, 사용자 계정 컨트롤 창이 뜨면 게시자를 확인한 뒤 **예**를 클릭해요. 사용권 화면에서 **Next**를 누른 뒤, 아래 화면에서는 이렇게 골라요. 나머지 화면은 아무것도 바꾸지 않고 **Next**를 눌러요.

1. 설치 위치와 구성 요소 선택 화면(Select Components)은 기본값 그대로 **Next**를 눌러요.
2. "Choosing the default editor used by Git" 화면에서 목록을 열어 **Use Visual Studio Code as Git's default editor**를 골라요. VS Code가 목록에 없으면 VS Code를 먼저 설치해야 해요. 아래 🧯 자주 막히는 곳의 "설치 마법사 편집기 목록에 VS Code가 없어요"를 보세요.
3. "Adjusting the name of the initial branch in new repositories" 화면에서 **Override the default branch name for new repositories**를 고르고, 입력 칸에 `main`이 들어 있는지 확인해요. 새 저장소의 기본 브랜치 이름을 `main`으로 정하는 거예요.
4. "Adjusting your PATH environment" 화면은 (Recommended)라고 쓰인 기본 선택 그대로 두고 **Next**를 눌러요. 터미널 어디서든 `git`을 쓰게 해 줘요.
5. 줄 끝 처리 화면(Configuring the line ending conversions)은 기본값 **Checkout Windows-style, commit Unix-style line endings**를 그대로 둬요. Windows 프로그램은 줄바꿈 방식이 Unix와 달라서, 내 컴퓨터에서는 Windows 방식으로 쓰고 기록에는 Unix 방식으로 남기는 설정이에요.
6. 마지막 화면에서 **Install**을 누르고, 끝나면 **Finish**를 눌러요. "Release Notes 보기" 체크는 해제해도 돼요.

:::info 화면 문구가 조금 달라도 괜찮아요
설치 마법사는 버전마다 화면 순서와 문구가 조금 달라질 수 있어요. 같은 위치의 같은 뜻의 선택지를 고르면 돼요. 확신이 안 서는 화면은 기본값을 그대로 둬도 이 교재를 따라가는 데 문제없어요. 다만 편집기(VS Code)와 첫 브랜치 이름(`main`)만 위처럼 고르는 걸 권해요.
:::

:::success
설치가 끝나고 마법사가 닫혀요. 시작 메뉴에서 `git`을 검색하면 **Git Bash**, **Git GUI** 같은 항목이 보여요. 교재에서는 이 프로그램들을 쓰지 않고 VS Code의 터미널을 써요.
:::

### 3단계 · VS Code를 다시 열고 터미널로 `git` 확인하기 (9분)

Git을 설치하기 전에 열려 있던 VS Code는 Git의 위치를 모르는 채로 남아 있어요. 그래서 한 번 완전히 닫았다가 다시 열어야 해요.

**어디서:** VS Code

**무엇을:**

1. VS Code 창을 완전히 닫아요(창 오른쪽 위 `×`, 열린 VS Code 창이 여러 개면 모두 닫아요).
2. 시작 메뉴에서 VS Code를 다시 실행해요. 열려 있던 폴더가 `my-creator-site`가 아니라면 **파일 → 최근 항목 열기**에서 `C:\dev\my-creator-site`를 골라요.
3. 맨 위 메뉴 **터미널 → 새 터미널**을 클릭해요. 단축키는 `` Ctrl + Shift + ` ``예요(`Esc` 키 아래, `1` 키 왼쪽의 `` ` `` 키를 써요. `` Ctrl + ` ``는 터미널 창을 보였다 숨겼다 하는 키예요).
4. 창 아래쪽에 터미널이 열려요. 맨 마지막 줄 `PS C:\dev\my-creator-site>`를 읽어요. `>` 앞이 `C:\dev\my-creator-site`가 아니라면 아래 명령으로 옮겨요(`cd`는 지금 있는 폴더를 바꾸는 명령이에요).

**어디서:** VS Code 터미널 (위치가 `C:\dev\my-creator-site`가 아닐 때만)

```powershell
cd C:\dev\my-creator-site
```

아무것도 나오지 않고 다음 줄에 `PS C:\dev\my-creator-site>`가 다시 보이면 성공이에요.

5. Git이 설치되었는지 확인해요. 아래 명령을 입력하고 `Enter`를 눌러요. 직접 입력하거나, 코드 상자 오른쪽 위의 **복사** 버튼으로 복사해서 터미널에 `Ctrl + V`로 붙여 넣어도 돼요. 오른쪽 클릭 메뉴의 붙여넣기도 돼요(버전에 따라 동작이 달라요).

**어디서:** VS Code 터미널 (`PS C:\dev\my-creator-site>`)

```powershell
git --version
```

예상 출력(숫자는 달라도 돼요):

```text
git version 2.56.0.windows.4
```

:::success
터미널에 `git version 2.…` 줄이 나와요. 빨간 글씨로 `git : The term 'git' is not recognized …`가 나오면 아래 🧯 자주 막히는 곳의 첫 번째 항목을 보세요. 터미널이 `PS`가 아니라 `C:\>`로 시작하면 PowerShell이 아니라 다른 터미널이에요. 터미널 오른쪽 위의 `∨` 버튼을 눌러 **PowerShell**을 골라요.
:::

### 4단계 · Git에게 내 이름과 이메일 알려 주기 (6분)

커밋에는 만든 사람의 이름과 이메일이 함께 남아요. 한 번만 설정하면 돼요. 이름은 영어나 한글 아무거나 괜찮고, 이메일은 GitHub 가입에 쓸 주소로 해요.

**어디서:** VS Code 터미널 (`PS C:\dev\my-creator-site>`)

**무엇을:** 아래 세 줄을 한 줄씩 입력하고 `Enter`를 눌러요. `달빛곰`과 이메일 자리는 내 것으로 바꿔요. 따옴표는 그대로 넣어요. 마지막 줄은 앞으로 새로 만드는 저장소의 기본 브랜치 이름을 `main`으로 정해 두는 설정이에요.

```powershell
git config --global user.name "달빛곰"
git config --global user.email "moonbear@example.com"
git config --global init.defaultBranch main
```

세 줄 모두 아무것도 나오지 않고 다음 줄에 `PS C:\dev\my-creator-site>`가 다시 보이면 성공이에요. 설정이 잘 되었는지 확인해요.

```powershell
git config --global --list
```

예상 출력(이름과 이메일은 내가 입력한 값이에요. 다른 줄이 더 있어도 돼요):

```text
user.name=달빛곰
user.email=moonbear@example.com
init.defaultbranch=main
```

:::success
`user.name=`과 `user.email=` 줄에 내가 입력한 값이 보여요. 이메일은 공개 저장소의 커밋에 남아요. 노출이 걱정되면 GitHub가 제공하는 가려진 이메일(noreply)을 쓸 수 있어요. 방법은 5단계의 "이메일을 숨기고 싶다면" 꿀팁에 있어요.
:::

### 5단계 · GitHub 가입하고 저장소 만들기 (13분)

이 단계는 브라우저에서 해요. 화면은 GitHub가 바꿀 수 있어서 글자가 조금 다를 수 있어요(작성 기준일 2026-11, 실기 확인은 못 했어요).

**어디서:** 브라우저 `https://github.com/`

**무엇을:** 이미 GitHub 계정이 있으면 1~4번은 건너뛰고 5번으로 가요.

1. 오른쪽 위 **Sign up**을 클릭해요.
2. 이메일, 비밀번호, 사용자 이름(아이디)을 입력해요. 아이디는 **영어 소문자와 숫자**로 정하길 권해요. 이 아이디가 Day 14에 사이트 주소(`https://아이디.github.io/…`)에 들어가요.
3. 로봇이 아닌지 확인하는 퍼즐 화면이 나오면 안내에 따라 풀어요.
4. 입력한 이메일로 인증 코드가 와요. 메일에서 코드를 복사해 입력 칸에 붙여 넣어요. 메일이 안 오면 스팸 메일함도 살펴봐요.
5. 로그인한 화면 오른쪽 위의 **+** 아이콘을 클릭하고 **New repository**를 클릭해요.
6. **Repository name** 칸에 `my-creator-site`를 입력해요.
7. **Public**을 골라요. 무료 계정은 공개 저장소만 사이트로 공개할 수 있어요.
8. **Add a README file**, **Add .gitignore**, **Choose a license**는 모두 건드리지 않아요(체크하지 않아요).
9. 맨 아래 **Create repository**를 클릭해요.

:::success
`아이디 / my-creator-site`라는 제목의 빈 저장소 페이지가 열려요. 화면에 "Quick setup" 안내가 보이고, `https://github.com/아이디/my-creator-site.git` 모양의 주소가 있어요. 이 주소를 7단계에서 써요. README를 체크하고 만들었다면 아래 🧯 자주 막히는 곳의 "`! [rejected] main -> main (fetch first)`"를 보세요.
:::

:::tip 이메일을 숨기고 싶다면 (선택)
GitHub 오른쪽 위 프로필 → **Settings** → **Emails**에 "Keep my email addresses private" 체크가 있어요. 이걸 켜면 `숫자+아이디@users.noreply.github.com` 모양의 가려진 이메일이 보여요. 그 주소를 `git config --global user.email "…"`에 쓰면 커밋에 진짜 이메일이 남지 않아요. 메뉴 위치와 이름은 바뀔 수 있어요.
:::

### 6단계 · 로컬 저장소 만들고 첫 커밋 하기 (10분)

**어디서:** VS Code 터미널 (`PS C:\dev\my-creator-site>`)

**무엇을:** 아래 명령을 한 줄씩 입력해요. 줄마다 `Enter`를 누르고 결과를 확인한 뒤 다음 줄로 가요.

저장소를 만들어요. 폴더 안에 숨김 폴더 `.git`이 생겨요.

```powershell
git init
```

예상 출력(경로는 내 컴퓨터에 따라 달라요):

```text
Initialized empty Git repository in C:/dev/my-creator-site/.git/
```

지금 상태를 봐요.

```powershell
git status
```

예상 출력:

```text
On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	about.html
	contact.html
	contents.html
	images/
	index.html
	schedule.html

nothing added to commit but untracked files present (use "git add" to track)
```

`Untracked files`는 "Git이 아직 모르는 파일"이라는 뜻이에요. 지금 폴더의 파일을 모두 스테이징해요.

```powershell
git add .
```

`add` 뒤에 한 칸 띄우고 점(`.`)이 있어요. 점은 "이 폴더의 모든 파일"이라는 뜻이에요. 아무것도 나오지 않으면 성공이에요. 다시 상태를 봐요.

```powershell
git status
```

예상 출력:

```text
On branch main

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
	new file:   about.html
	new file:   contact.html
	new file:   contents.html
	new file:   images/logo.svg
	new file:   images/profile.svg
	new file:   index.html
	new file:   schedule.html
```

`Changes to be committed`는 "다음 커밋에 들어갈 변경"이에요. 이제 커밋해요. `-m` 뒤의 따옴표 안이 커밋 메시지예요.

```powershell
git commit -m "Day 1~6: 첫 페이지들"
```

예상 출력(번호와 숫자는 달라도 돼요):

```text
[main (root-commit) 01f3f48] Day 1~6: 첫 페이지들
 7 files changed, 247 insertions(+)
 create mode 100644 about.html
 create mode 100644 contact.html
 create mode 100644 contents.html
 create mode 100644 images/logo.svg
 create mode 100644 images/profile.svg
 create mode 100644 index.html
 create mode 100644 schedule.html
```

:::success
`[main (root-commit) …] Day 1~6: 첫 페이지들` 줄과 `7 files changed`가 나와요. 이제 내 컴퓨터에 첫 기록이 생겼어요. `Author identity unknown` 오류가 나면 4단계를 다시 해야 해요. 아래 🧯 자주 막히는 곳의 "Author identity unknown (이름과 이메일을 알려 달라는 오류)"를 보세요. Git이 줄바꿈 때문에 `warning: in the working copy of …`를 보여 줘도 무시해도 되는 안내예요.
:::

### 7단계 · GitHub에 올리기 (10분)

**어디서:** VS Code 터미널 (`PS C:\dev\my-creator-site>`)

**무엇을:** 먼저 브랜치 이름이 `main`인지 확실히 해요. 이미 `main`이면 아무것도 나오지 않아요.

```powershell
git branch -M main
```

아무것도 나오지 않고 다음 줄에 `PS C:\dev\my-creator-site>`가 다시 보이면 성공이에요. 이제 원격 저장소의 주소를 `origin`이라는 이름으로 연결해요. 아래 주소는 예시예요. 5단계의 GitHub 저장소 페이지에서 보이는 주소(`https://github.com/아이디/my-creator-site.git`)를 복사해서, `moonbear-dev` 자리가 내 아이디인 주소로 바꿔 입력해요.

```powershell
git remote add origin https://github.com/moonbear-dev/my-creator-site.git
```

아무것도 나오지 않으면 성공이에요. 마지막으로 푸시해요. `-u`는 "앞으로 `git push`만 쳐도 이곳에 올려요"라고 기억시키는 옵션이에요.

```powershell
git push -u origin main
```

처음 푸시할 때 Git이 GitHub 로그인을 요청하는 창을 띄울 수 있어요. 브라우저가 열리면 **Sign in with your browser**(브라우저로 로그인)를 눌러 GitHub 계정으로 로그인하고 허용해요. 창의 모양은 버전에 따라 달라요(실기 확인은 못 했어요).

예상 출력(숫자와 줄 수는 달라도 돼요):

```text
Enumerating objects: 11, done.
Counting objects: 100% (11/11), done.
Delta compression using up to 8 threads
Compressing objects: 100% (10/10), done.
Writing objects: 100% (11/11), 3.20 KiB | 1.60 MiB/s, done.
Total 11 (delta 0), reused 0 (delta 0), pack-reused 0 (from 0)
To https://github.com/moonbear-dev/my-creator-site.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.
```

:::success
`To https://github.com/…/my-creator-site.git` 줄과 ` * [new branch]      main -> main` 줄이 나와요. 마지막 줄에 `branch 'main' set up to track 'origin/main'.`이 있어요. 오류 `error: src refspec main does not match any`가 나오면 커밋이 아직 없다는 뜻이에요. 아래 🧯 자주 막히는 곳을 보세요.
:::

### 8단계 · GitHub에서 확인하고 기록 보기 (3분)

**어디서:** 브라우저의 GitHub 저장소 페이지, 그리고 VS Code 터미널

**무엇을:**

1. 브라우저에서 저장소 페이지(`https://github.com/내아이디/my-creator-site`)를 새로 고침해요(`F5`).
2. VS Code 터미널에서 기록을 봐요.

```powershell
git log --oneline
```

예상 출력(앞의 7글자는 달라도 돼요):

```text
01f3f48 Day 1~6: 첫 페이지들
```

:::success
GitHub 저장소 페이지에 `images` 폴더와 HTML 파일 5개가 보이고, 위쪽에 "1 Commit"(또는 커밋 수 `1`)과 `Day 1~6: 첫 페이지들`이 보여요. 터미널의 `git log --oneline`에도 같은 메시지 한 줄이 있어요.
:::

### 9단계 · 소스 제어 패널과 숨김 폴더 `.git` 알아보기 (3분)

**어디서:** VS Code 왼쪽 활동 막대의 **소스 제어** 아이콘(가지가 갈라지는 모양). 단축키는 `Ctrl + Shift + G`예요.

**무엇을:**

1. **소스 제어** 아이콘을 클릭해요.
2. 패널의 내용을 읽어 봐요.

Day 8부터는 매일 이 패널로 커밋하고 올려요. 터미널 명령과 같은 일을 마우스로 해 주는 화면이에요.

:::success
패널에 바뀐 파일이 하나도 없고 "변경 사항 없음"에 해당하는 안내(또는 빈 목록)가 보여요. 지금까지의 변경을 모두 커밋했기 때문이에요. 목록에 파일이 있다면 아직 커밋하지 않은 변경이 있다는 뜻이에요.
:::

:::warn `.git` 폴더는 지우지 마세요
파일 탐색기에서 **보기 → 표시 → 숨긴 항목**을 켜면 `C:\dev\my-creator-site` 안에 `.git` 폴더가 보여요. 모든 기록이 이 폴더에 들어 있어서, 지우면 기록이 모두 사라져요. 직접 고치거나 지우지 않아요. 보고 나면 **숨긴 항목**을 다시 꺼도 돼요.
:::

## ✍️ 과제

### 과제 1 · 소스 제어 패널로 두 번째 커밋·푸시 (쉬움 ⭐, 12분)

`about.html`의 소개 문장을 내 이야기로 바꾸고, 터미널 없이 소스 제어 패널만으로 커밋하고 GitHub에 올려 보세요.

- `about.html`의 첫 문단에서 `2026년에 방송을 시작한`을 `게임, 토크, 음악 방송을 하는`으로 바꾸거나 내 소개로 바꿔 저장해요. 태그는 그대로 둬요.
- **소스 제어** 패널에서 바뀐 파일 `about.html` 옆에 `M` 표시가 생기는지 봐요.
- 메시지 칸에 `Day 7: 소개 문장 바꾸기`를 입력하고 **커밋** 버튼을 클릭해요.
- 이어서 나타나는 **변경 내용 동기화**(또는 비슷한 이름) 버튼을 클릭해요. 처음에는 확인 창이 뜰 수 있어요.
- GitHub 저장소 페이지를 새로 고쳐서 커밋이 2개가 되었는지 확인해요.

### 과제 2 · `git log --oneline` 읽기 (보통 ⭐⭐, 8분)

터미널에서 `git log --oneline`을 입력해 보세요. 출력의 한 줄이 어떤 두 부분으로 이뤄졌는지, 어느 줄이 가장 최근 커밋인지 적어 보세요.

### 과제 3 · `git status`의 세 가지 문구 (도전 ⭐⭐⭐, 10분)

`git status` 출력에 나오는 세 가지 문구는 각각 언제 보는지 한 문장씩 적어 보세요.

- `Untracked files`
- `Changes not staged for commit`
- `Changes to be committed`

## ✅ 정답

:::answer 과제 1 정답 · 소스 제어 패널로 두 번째 커밋
1. `about.html`을 고치고 `Ctrl + S`로 저장해요.
2. **소스 제어** 아이콘(`Ctrl + Shift + G`)을 클릭해요. **변경 사항** 아래에 `about.html`이 `M`(Modified, 수정됨) 표시와 함께 보여요.
3. 패널 위쪽 메시지 칸에 `Day 7: 소개 문장 바꾸기`를 입력해요.
4. **커밋** 버튼을 클릭해요. "스테이징된 변경 사항이 없다"며 모든 변경을 커밋할지 묻는 창이 뜨면 **예**(또는 **항상**)를 클릭해요.
5. 버튼이 **변경 내용 동기화**로 바뀌면 클릭해요. 확인 창이 뜨면 **확인**(**OK**)을 클릭해요.
6. GitHub 저장소 페이지를 새로 고치면 커밋이 2개가 돼요.

바꾼 `about.html`의 첫 문단은 아래 한 줄이에요(닉네임과 문장은 내 것이어도 돼요).

📄 C:\dev\my-creator-site\about.html
```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>소개 - 달빛곰 방송국</title>
</head>
<body>
  <header>
    <a href="index.html">
      <img src="images/logo.svg" alt="" width="36" height="36">
      <span>달빛곰 방송국</span>
    </a>
    <nav>
      <ul>
        <li><a href="index.html">홈</a></li>
        <li><a href="about.html">소개</a></li>
        <li><a href="contents.html">영상</a></li>
        <li><a href="schedule.html">방송 일정</a></li>
        <li><a href="contact.html">문의</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <h1>달빛곰을 소개해요</h1>

    <section>
      <img src="images/profile.svg" alt="헤드셋을 쓴 곰 캐릭터, 달빛곰" width="240" height="240">
      <div>
        <p>안녕하세요! <strong>달빛곰</strong>이에요. 게임, 토크, 음악 방송을 하는 <em>버라이어티 스트리머</em>예요.</p>
        <p>밤에 방송하는 걸 좋아해서 이름에 달빛이 들어갔어요. 시청자분들과 수다 떠는 시간이 가장 즐거워요.</p>
      </div>
    </section>

    <section>
      <h2>어떤 방송을 하나요?</h2>
      <ul>
        <li><strong>게임</strong>: 신작 게임을 첫 방송에서 같이 해 봐요.</li>
        <li><strong>토크</strong>: 사연을 읽고 이야기를 나눠요.</li>
        <li><strong>음악</strong>: 기타 연주와 신청곡 라이브를 해요.</li>
      </ul>
    </section>

    <section>
      <h2>방송 규칙</h2>
      <ol>
        <li>서로 존중하는 말을 써 주세요.</li>
        <li>스포일러는 미리 말해 주세요.</li>
        <li>개인 정보는 채팅에 올리지 마세요.</li>
      </ol>
    </section>

    <section>
      <h2>함께해요</h2>
      <p>방송 시간은 <a href="schedule.html">방송 일정</a>에서 확인하고, 협업이나 궁금한 점은 <a href="contact.html">문의 페이지</a>로 보내 주세요.</p>
    </section>
  </main>

  <footer>
    <p>&copy; 2026 달빛곰 방송국 · 연습용으로 만든 사이트예요.</p>
  </footer>
</body>
</html>
```
**왜 이렇게 하나요?** 소스 제어 패널의 **커밋**은 터미널의 `git add .`와 `git commit -m "…"`를, **변경 내용 동기화**는 `git push`와 GitHub의 새 기록을 내려받는 일을 한 번에 해 줘요. 같은 일을 마우스로 하는 거예요. 오늘 이후 모든 Day의 마지막 단계에서 이 방법을 써요.
:::

:::answer 과제 2 정답 · git log --oneline 읽기
```text
a1b2c3d Day 7: 소개 문장 바꾸기
01f3f48 Day 1~6: 첫 페이지들
```

한 줄은 **앞의 7글자(커밋 번호의 앞부분)** 와 **그 뒤의 커밋 메시지**로 이뤄져요. 맨 위 줄이 가장 최근 커밋이에요. 번호는 사람마다 달라요.

**왜 이렇게 하나요?** 커밋 번호는 그 기록을 가리키는 고유한 이름이에요. 나중에 이 번호로 예전 상태를 불러올 수 있어요. 메시지는 사람이 알아보라고 붙이는 이름이라서 "무엇을 했는지" 짧게 쓰는 게 좋아요.
:::

:::answer 과제 3 정답 · git status 세 가지 문구
- `Untracked files`: 새로 만든 파일이라 Git이 아직 모르는 파일이 있을 때 봐요.
- `Changes not staged for commit`: 이미 기록된 파일을 고쳤지만 아직 `git add`를 하지 않았을 때 봐요.
- `Changes to be committed`: `git add`로 스테이징을 마쳤고, 커밋하면 기록될 변경이 있을 때 봐요.

**왜 이렇게 하나요?** `git status`는 "내 변경이 지금 어느 단계에 있는지" 알려 줘요. 고친 파일 → 스테이징 → 커밋의 순서에서 현재 위치를 보여 주는 지도예요.
:::

:::answer 오늘 끝 상태 전체 코드
오늘 따라하기와 과제를 모두 끝내면 아래 상태가 돼요. 오늘 바뀐 파일은 `about.html`의 첫 문단뿐이에요. 나머지 파일은 어제와 같아요. 막혔다면 어제 끝 상태 코드로 폴더를 맞추고, 터미널에서 6~7단계를 다시 해요. 그러면 Day 8을 바로 시작할 수 있어요.

```text
C:\dev\my-creator-site\
├─ .git\
├─ index.html
├─ about.html
├─ contents.html
├─ schedule.html
├─ contact.html
└─ images\
   ├─ profile.svg
   └─ logo.svg
```

`.git` 폴더는 Git이 만든 숨김 폴더라서 직접 고치지 않아요. 오늘 바뀐 파일은 `about.html`뿐이에요.

📄 C:\dev\my-creator-site\about.html
```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>소개 - 달빛곰 방송국</title>
</head>
<body>
  <header>
    <a href="index.html">
      <img src="images/logo.svg" alt="" width="36" height="36">
      <span>달빛곰 방송국</span>
    </a>
    <nav>
      <ul>
        <li><a href="index.html">홈</a></li>
        <li><a href="about.html">소개</a></li>
        <li><a href="contents.html">영상</a></li>
        <li><a href="schedule.html">방송 일정</a></li>
        <li><a href="contact.html">문의</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <h1>달빛곰을 소개해요</h1>

    <section>
      <img src="images/profile.svg" alt="헤드셋을 쓴 곰 캐릭터, 달빛곰" width="240" height="240">
      <div>
        <p>안녕하세요! <strong>달빛곰</strong>이에요. 게임, 토크, 음악 방송을 하는 <em>버라이어티 스트리머</em>예요.</p>
        <p>밤에 방송하는 걸 좋아해서 이름에 달빛이 들어갔어요. 시청자분들과 수다 떠는 시간이 가장 즐거워요.</p>
      </div>
    </section>

    <section>
      <h2>어떤 방송을 하나요?</h2>
      <ul>
        <li><strong>게임</strong>: 신작 게임을 첫 방송에서 같이 해 봐요.</li>
        <li><strong>토크</strong>: 사연을 읽고 이야기를 나눠요.</li>
        <li><strong>음악</strong>: 기타 연주와 신청곡 라이브를 해요.</li>
      </ul>
    </section>

    <section>
      <h2>방송 규칙</h2>
      <ol>
        <li>서로 존중하는 말을 써 주세요.</li>
        <li>스포일러는 미리 말해 주세요.</li>
        <li>개인 정보는 채팅에 올리지 마세요.</li>
      </ol>
    </section>

    <section>
      <h2>함께해요</h2>
      <p>방송 시간은 <a href="schedule.html">방송 일정</a>에서 확인하고, 협업이나 궁금한 점은 <a href="contact.html">문의 페이지</a>로 보내 주세요.</p>
    </section>
  </main>

  <footer>
    <p>&copy; 2026 달빛곰 방송국 · 연습용으로 만든 사이트예요.</p>
  </footer>
</body>
</html>
```
끝 상태 확인:

- 터미널에서 `git status`를 입력하면 `nothing to commit, working tree clean`이 나와요.
- `git log --oneline`에 커밋 2줄이 있어요.
- GitHub 저장소 페이지에 `images` 폴더와 HTML 파일 5개가 있고 커밋 수가 2예요.
- 소스 제어 패널에 바뀐 파일이 없어요.
:::

## 🧯 자주 막히는 곳

모든 문제와 드문 경우는 [문제 해결 모음](#/page/troubleshooting)에 있어요.

### git : The term 'git' is not recognized as the name of a cmdlet, function, script file, or operable program.

**원인:** 터미널이 Git의 위치를 모르는 상태예요. 가장 흔한 이유는 Git을 설치하기 전에 열어 둔 VS Code 창을 그대로 쓰고 있는 거예요. Git을 설치하지 않았거나 설치 도중 취소했을 수도 있어요. 한국어 Windows에서는 비슷한 뜻의 한국어 문장("'git' 용어가 cmdlet, 함수, 스크립트 파일 또는 실행할 수 있는 프로그램 이름으로 인식되지 않습니다")이 나올 수 있어요(문구는 버전에 따라 조금 달라요).

```text
git : The term 'git' is not recognized as the name of a cmdlet, function, script file, or operable program. Check the spelling of the name, or if a path was included, verify that the path is correct and try again.
At line:1 char:1
+ git --version
+ ~~~
    + CategoryInfo          : ObjectNotFound: (git:String) [], CommandNotFoundException
    + FullyQualifiedErrorId : CommandNotFoundException
```

**해결:**

1. VS Code 창을 모두 닫아요. 시작 메뉴에서 VS Code를 다시 열고 `C:\dev\my-creator-site` 폴더를 열어요.
2. **터미널 → 새 터미널**을 클릭하고 `git --version`을 입력해요.
3. 그래도 같은 오류면 Git이 설치되지 않은 거예요. 시작 메뉴에서 `git`을 검색해 **Git Bash**가 나오는지 봐요. 안 나오면 1단계부터 설치를 다시 해요.
4. `git version 2.…`가 나오면 해결된 거예요.

### Author identity unknown (이름과 이메일을 알려 달라는 오류)

**원인:** Git에게 내 이름과 이메일을 아직 알려 주지 않아서 커밋을 못 만들어요. 4단계를 하지 않았거나 값을 잘못 입력했을 때 나와요.

```text
Author identity unknown

*** Please tell me who you are.

Run

  git config --global user.email "you@example.com"
  git config --global user.name "Your Name"

to set your account's default identity.
Omit --global to set the identity only in this repository.

fatal: unable to auto-detect email address (got 'user@PC.(none)')
```

마지막 `fatal:` 줄의 컴퓨터 이름은 사람마다 달라요.

**해결:**

1. 터미널에서 아래 두 줄을 한 줄씩 입력해요. 이름과 이메일은 내 것으로 바꿔요.

```powershell
git config --global user.name "달빛곰"
git config --global user.email "moonbear@example.com"
```

2. 다시 `git commit -m "Day 1~6: 첫 페이지들"`를 입력해요.
3. `[main (root-commit) …]` 줄이 나오면 해결된 거예요.

### fatal: not a git repository (or any of the parent directories): .git

**원인:** 지금 터미널의 위치가 Git 저장소가 아니에요. 대부분은 터미널의 현재 폴더가 `C:\dev\my-creator-site`가 아니거나, `git init`을 아직 안 한 경우예요.

**해결:**

1. 터미널의 맨 마지막 줄 `PS …>`를 읽어서 현재 위치를 확인해요.
2. `C:\dev\my-creator-site`가 아니면 아래 명령으로 옮겨요.

```powershell
cd C:\dev\my-creator-site
```

3. 위치가 맞는데도 오류면 `git init`을 한 번 실행해요. `Initialized empty Git repository`가 나와요.
4. `git status`를 입력해서 `On branch main` 줄이 나오면 해결된 거예요.

### error: src refspec main does not match any

**원인:** 푸시하려는 `main` 브랜치에 커밋이 하나도 없어요. `git commit`을 하기 전에 `git push`를 했거나, 커밋이 실패했거나, 브랜치 이름이 `main`이 아닐 때 나와요.

```text
error: src refspec main does not match any
error: failed to push some refs to 'https://github.com/moonbear-dev/my-creator-site.git'
```

**해결:**

1. `git log --oneline`을 입력해요. `fatal: your current branch 'main' does not have any commits yet`가 나오면 커밋이 없는 거예요.
2. `git add .`를 실행하고 `git commit -m "Day 1~6: 첫 페이지들"`을 실행해요.
3. 브랜치 이름이 다르면 `git branch -M main`을 실행해요.
4. 다시 `git push -u origin main`을 입력해요.
5. `* [new branch] main -> main` 줄이 나오면 해결된 거예요.

### ! [rejected] main -> main (fetch first)

**원인:** GitHub에서 저장소를 만들 때 **Add a README file**을 체크해서, GitHub 쪽에 이미 내 컴퓨터에 없는 기록이 있어요. Git은 남의 기록을 덮어쓰지 않으려고 푸시를 거절해요. 문구와 안내(`hint:`)는 Git 버전에 따라 조금 달라요.

```text
To https://github.com/moonbear-dev/my-creator-site.git
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'https://github.com/moonbear-dev/my-creator-site.git'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally. This is usually caused by another repository pushing to
hint: the same ref. If you want to integrate the remote changes, use
hint: 'git pull' before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
```

**해결:** 오늘은 가장 쉬운 방법으로, 비어 있는 저장소로 다시 만들어요. 내 컴퓨터의 파일과 기록은 지워지지 않아요.

1. 브라우저에서 GitHub 저장소 페이지의 **Settings**를 클릭해요.
2. 맨 아래쪽 **Danger Zone**(위험 구역)에서 **Delete this repository**를 클릭하고, 화면 안내대로 저장소 이름을 입력해 삭제해요. 메뉴 이름은 바뀔 수 있어요.
3. 5단계처럼 `my-creator-site` 저장소를 다시 만들어요. 이번에는 **Add a README file**을 체크하지 않아요.
4. 터미널에서 `git push -u origin main`을 다시 입력해요.
5. ` * [new branch]      main -> main` 줄이 나오면 해결된 거예요.

### 푸시할 때 로그인 창이 안 뜨거나 다른 계정으로 로그인돼요

**원인:** 처음 푸시할 때 Git Credential Manager가 브라우저로 로그인을 요청해요. 팝업이 다른 창 뒤에 숨어 있거나, 브라우저가 이미 다른 GitHub 계정으로 로그인되어 있으면 그 계정으로 인증돼요. 로그인 창의 모양은 버전에 따라 달라요(실기 확인은 못 했어요).

**해결:**

1. 작업 표시줄에서 다른 창 뒤에 숨은 로그인 창이나 브라우저 창을 찾아요.
2. 브라우저에서 GitHub의 오른쪽 위 프로필을 눌러 지금 로그인된 계정이 이 저장소 주인인지 확인해요. 다르면 로그아웃하고 올바른 계정으로 로그인해요.
3. 인증 창에서 **Authorize**(허용)를 클릭해요.
4. `git push -u origin main`을 다시 입력해요.
5. 오류 없이 ` * [new branch]` 줄이 나오면 해결된 거예요.
## 📝 오늘의 체크리스트

- [ ] 터미널에서 `git --version`이 `git version 2.…`를 보여 줘요.
- [ ] `git config --global --list`에 내 이름과 이메일이 보여요.
- [ ] GitHub에 공개(Public) 저장소 `my-creator-site`가 있어요.
- [ ] `git log --oneline`에 커밋이 2줄 있어요.
- [ ] GitHub 저장소 페이지에 `images` 폴더와 HTML 파일 5개가 보이고 커밋이 2개예요.
- [ ] 터미널에서 `git status`를 입력하면 `nothing to commit, working tree clean`이 나와요.
- [ ] 소스 제어 패널에 바뀐 파일이 없어요.
- [ ] 스테이징, 커밋, 푸시의 차이를 내 말로 설명할 수 있어요.

## 📚 더 알아보기

- [Git 공식 사이트](https://git-scm.com/): Git을 내려받고 설명서(Book)를 볼 수 있어요.
- [GitHub Docs · 저장소 만들기](https://docs.github.com/ko/repositories/creating-and-managing-repositories/quickstart-for-repositories): 저장소를 만드는 방법을 설명해요.
- [VS Code · 소스 제어 사용하기](https://code.visualstudio.com/docs/sourcecontrol/overview): 소스 제어 패널의 기능을 설명해요.

➡️ **다음 Day 예고:** [Day 8 · 표·폼·미디어](#/day/p1-d08)에서는 방송 일정표(`table`)와 문의 폼(`form`)을 만들고, YouTube 영상을 `iframe`으로 넣어요. 그리고 처음으로 하루 작업을 커밋하고 올려 봐요.
