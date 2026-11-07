## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- 최종 점검표로 다섯 페이지와 오버레이를 처음부터 끝까지 점검하고, 문제가 있으면 어느 Day로 돌아가야 하는지 찾아요.
- 마지막 커밋·푸시를 하고 저장소 **Actions** 탭에서 배포가 성공(초록 표시)한 것을 확인해요.
- 배포 주소에서 점검표를 한 번 더 확인하고, 휴대폰으로도 사이트와 오버레이 주소를 열어 봐요.
- 30일을 돌아보는 **회고**를 README에 써서 저장소 첫 화면에 남겨요.

**예상 시간: 90분** (개념 이해 8분 · 따라하기 60분 · 과제 18분 · 정리 4분)

:::path 📂 시작 상태
어제(Day 29)까지 만든 파일이 이렇게 있어야 해요. 없거나 다르면 [Day 29](#/day/p1-d29)의 "오늘 끝 상태 전체 코드"로 맞춰 주세요.

- `C:\dev\my-creator-site\about.html`
- `C:\dev\my-creator-site\contact.html`
- `C:\dev\my-creator-site\contents.html`
- `C:\dev\my-creator-site\favicon.svg`
- `C:\dev\my-creator-site\index.html`
- `C:\dev\my-creator-site\README.md`
- `C:\dev\my-creator-site\schedule.html`
- `C:\dev\my-creator-site\css\style.css`
- `C:\dev\my-creator-site\data\schedule.json`
- `C:\dev\my-creator-site\data\videos.json`
- `C:\dev\my-creator-site\images\logo.svg`
- `C:\dev\my-creator-site\images\profile.svg`
- `C:\dev\my-creator-site\images\thumb-game.svg`
- `C:\dev\my-creator-site\images\thumb-music.svg`
- `C:\dev\my-creator-site\images\thumb-talk.svg`
- `C:\dev\my-creator-site\js\contact.js`
- `C:\dev\my-creator-site\js\contents.js`
- `C:\dev\my-creator-site\js\main.js`
- `C:\dev\my-creator-site\js\schedule.js`
- `C:\dev\my-creator-site\overlay\countdown.css`
- `C:\dev\my-creator-site\overlay\countdown.html`
- `C:\dev\my-creator-site\overlay\countdown.js`
- 연습 폴더 `C:\dev\hello\`에 `hello.html`, `favorites.html`, `tools.html`, `links.html`, `plan.html`, `lab.html`, `lab.js`, `pages\back.html`이 있어요(오늘은 열지 않아도 돼요).
- VS Code에서 `C:\dev\my-creator-site` 폴더가 열려 있고, 한국어 팩과 Live Preview 확장 프로그램이 설치되어 있어요.
- 파일 탐색기의 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
- Git이 설치되어 있고(`git --version` → `git version 2.56.0.windows.4`, 숫자는 달라도 돼요) GitHub의 공개(Public) 저장소 `https://github.com/<내 아이디>/my-creator-site`와 연결되어 있어요.
- GitHub Pages가 켜져 있어요: `https://<내 아이디>.github.io/my-creator-site/`
- (선택) OBS Studio가 설치되어 있고, 브라우저 소스로 카운트다운 오버레이를 띄워 봤어요.
- 어제까지의 변경이 모두 커밋·푸시되어 소스 제어 패널의 변경이 0개예요.
:::

## 📖 개념 이해

### 회고: 끝낸 일을 돌아보는 일

만들고 나면 바로 다음 일로 넘어가고 싶지만, 잠깐 멈춰서 돌아보면 같은 실수를 덜 하게 돼요.

**비유:** 운동 후 스트레칭이에요. 해도 되고 안 해도 되지만, 하면 다음 운동이 훨씬 편해요.

**정확한 정의:** **[[회고]]**(retrospective)는 한 일을 마친 뒤 무엇이 잘됐고 무엇이 아쉬웠는지 돌아보고, 다음에 무엇을 할지 정리하는 일이에요. 잘한 것(Keep)·아쉬운 것(Problem)·다음에 해 볼 것(Try)으로 나누는 KPT 방식이 많이 쓰여요. 글로 남겨 두면 다음 프로젝트에서 같은 실수를 줄일 수 있어요.

좋은 회고는 두 가지 조건이 있어요.

1. **구체적이에요.** "다 어려웠어요"가 아니라 "Day 25에서 `await`의 순서가 안 보였어요"처럼 Day와 장면이 들어가요.
2. **다음 행동이 있어요.** "다음에는 새 개념을 콘솔에서 먼저 실험해 볼 거예요"처럼 해 볼 일로 끝나요.

### 배포 확인: Actions 탭

Day 14에서 GitHub Pages를 켰어요. 푸시하면 GitHub가 자동으로 사이트를 다시 만들어 올리는데, 이 작업이 저장소의 **Actions** 탭에 기록돼요. 이름은 보통 `pages build and deployment`예요. 초록색 체크(✓)면 성공, 빨간 ✕면 실패, 노란 점이면 진행 중이에요. 이름과 모양은 버전에 따라 조금 다를 수 있어요.

:::info 실무에서는
실제 서비스도 배포 뒤에 "실제 주소에서" 점검표를 한 번 더 돌려요. 내 컴퓨터에서 되던 것이 서버에서는 대소문자, 경로, 캐시 때문에 안 될 때가 있어서예요.
:::

## 🛠️ 따라하기

모두 7단계예요. 점검표를 두 번(내 컴퓨터, 배포 주소) 돌려요.

### 1단계 · 최종 점검표로 내 컴퓨터에서 점검하기 (20분)

**어디서:** VS Code의 Live Preview 주소를 연 Edge(또는 Chrome) + `F12` 개발자 도구. 오버레이와 카운트다운은 Live Preview 또는 배포 주소로만 확인돼요.

**무엇을:** 아래 표를 위에서 아래로 하나씩 확인해요. "안 되면" 칸의 Day로 돌아가서 그날의 🧯와 설명을 보세요. 단, 그 Day의 "오늘 끝 상태 전체 코드"는 **그날의 옛 모습**이라서 지금 파일에 덮어쓰면 뒤에서 만든 기능이 사라져요. 파일을 맞출 때는 2단계 표의 **최신 전체본**만 써요.

| 점검 항목 | 확인 방법 | 안 되면 |
|---|---|---|
| 다섯 페이지가 열려요 | 메뉴로 홈·소개·영상·방송 일정·문의를 차례로 열어요 | [Day 4](#/day/p1-d04) |
| 메뉴와 링크가 맞아요 | 현재 페이지 메뉴만 보라색, 링크가 맞는 곳으로 가요 | [Day 11](#/day/p1-d11) |
| 그림 5개와 파비콘이 보여요 | 로고·프로필·썸네일 3개, 탭에 초승달 | [Day 28](#/day/p1-d28) |
| 콘솔 오류가 0이에요 | 각 페이지 `F12` → Console에 빨간 줄 없음 | [Day 29](#/day/p1-d29) |
| 360px에서 가로 스크롤이 없어요 | 기기 모드 360px, 메뉴 버튼이 열고 닫혀요 | [Day 21](#/day/p1-d21) |
| 다크 모드가 유지돼요 | 버튼으로 켜고 페이지 이동·새로 고침 | [Day 22](#/day/p1-d22) |
| 인사말이 시간대에 맞아요 | 홈 첫 화면 문장이 지금 시각에 맞아요 | [Day 16](#/day/p1-d16) |
| 영상 필터·검색·빈 목록이 맞아요 | 게임 → 2개, `기타` → 1개, 게임+`기타` → 안내 | [Day 23](#/day/p1-d23) |
| 문의 폼 오류·성공이 맞아요 | 빈 채로 보내기, 올바르게 보내기 | [Day 24](#/day/p1-d24) |
| 일정 강조와 카운트다운이 맞아요 | 오늘 행 강조, 1초마다 줄어드는 숫자 | [Day 26](#/day/p1-d26) |
| 오버레이 주소 값이 맞아요 | `?title=저녁 방송&start=20:00`, 잘못된 값 | [Day 27](#/day/p1-d27) |
| 키보드로 이동돼요 | 첫 `Tab`에 본문 바로가기, 포커스 테두리 | [Day 28](#/day/p1-d28) |
| Lighthouse 점수를 봤어요 | 접근성·SEO가 높게 나와요 | [Day 28](#/day/p1-d28) |
| README가 있어요 | 파일 개수 22, 미리 보기가 잘 보여요 | [Day 29](#/day/p1-d29) |

:::success
표의 14개 항목이 모두 확인됐어요. 하나라도 안 되는 것이 있으면 그 Day로 돌아가 고치고, 이 표를 다시 처음부터 확인하세요.
:::

### 2단계 · 점검에서 찾은 문제 고치기 (5분)

**어디서:** VS Code

**무엇을:** 1단계에서 찾은 문제를 고쳐요. 문제가 하나도 없었다면 이 단계는 건너뛰어도 돼요. 파일 하나가 엉켰을 때는 아래 표에서 그 파일의 **최신 전체본**이 있는 Day를 열어 코드 상자를 복사하고, VS Code에서 그 파일을 열어 `Ctrl + A` → 붙여 넣기 → `Ctrl + S`로 맞춰요. 옛 Day의 코드는 비교만 하고 덮어쓰지 마세요.

| 파일 | 최신 전체본 |
|---|---|
| `index.html`, `about.html`, `contents.html`, `schedule.html`, `contact.html`, `favicon.svg`, `overlay/countdown.html` | [Day 28](#/day/p1-d28) 정답 |
| `css/style.css` | 이 Day(Day 30) 정답 맨 아래 |
| `js/main.js`, `js/contents.js`, `data/videos.json` | [Day 25](#/day/p1-d25) 정답 |
| `js/contact.js` | [Day 24](#/day/p1-d24) 정답 |
| `js/schedule.js`, `data/schedule.json` | [Day 26](#/day/p1-d26) 정답 |
| `overlay/countdown.js`, `overlay/countdown.css` | [Day 27](#/day/p1-d27) 정답 |
| `images/profile.svg`, `images/logo.svg`, `images/thumb-*.svg` | [Day 5](#/day/p1-d05), [Day 6](#/day/p1-d06), [Day 12](#/day/p1-d12) 정답 |

:::warn 내 글이 사라질 수 있어요
전체를 덮어쓰면 내가 바꾼 닉네임, 소개 문장, 방송 일정, 영상 ID, 색, 제목·설명이 예시 글로 돌아가요. 덮어쓰기 전에 내 글을 따로 적어 두고 붙여 넣은 뒤 다시 바꿔요. 다 맞췄으면 3단계처럼 소스 제어에서 커밋하고 **변경 내용 동기화**를 눌러야 배포 주소에 반영돼요.
:::

:::success
고친 곳이 있다면 1단계 표에서 그 항목을 다시 확인했고 통과했어요.
:::

### 3단계 · 푸시하고 Actions 확인하기 (8분)

**어디서:** VS Code → 소스 제어 패널(`Ctrl + Shift + G`)

**무엇을:** 2단계에서 고친 파일이 있으면 **메시지** 칸에 `Day 30: 최종 점검 수정`을 입력하고 **커밋** → **변경 내용 동기화**를 눌러요. 고친 것이 없으면 변경이 0개라서 커밋할 것이 없어요(다음 5~6단계의 회고 커밋이 마지막 푸시가 돼요). 그다음 Edge에서 저장소 페이지를 열고 위쪽 탭의 **Actions**를 눌러요.

```text
https://github.com/<내 아이디>/my-creator-site
```

**무엇을 (Actions에서):**

1. 목록의 맨 위 줄(가장 최근 실행)을 봐요. 이름은 `pages build and deployment`예요.
2. 앞의 표시가 초록 체크(✓)가 될 때까지 기다려요. 최대 10분 걸려요.

:::success
맨 위 실행의 표시가 초록 체크예요. 빨간 ✕이면 그 줄을 클릭해 오류 내용을 읽고, 위쪽 **Re-run jobs**(다시 실행) 계열 버튼을 눌러 다시 실행해 봐요(버튼 이름은 버전에 따라 달라요). 아래 🧯의 첫 항목도 보세요. 푸시했는데도 배포 주소가 그대로면 [도움말 7번](#/page/help)의 순서대로 확인해요.
:::

### 4단계 · 배포 주소에서 점검표 한 번 더 (10분)

**어디서:** Edge(또는 Chrome) 주소창 → `https://<내 아이디>.github.io/my-creator-site/`

**무엇을:**

1. `Ctrl + F5`로 강력 새로 고침해서 예전 모습이 남지 않게 해요.
2. 1단계 표를 배포 주소에서 다시 확인해요. 내 컴퓨터에서는 되는데 여기서만 안 되면 [도움말 7번](#/page/help)을 순서대로 따라요. 특히 영상 목록(`fetch`), 일정 카운트다운, 오버레이 주소를 봐요. 오버레이는 `https://<내 아이디>.github.io/my-creator-site/overlay/countdown.html?title=저녁%20방송&start=20:00`이에요.
3. 휴대폰이 있다면 휴대폰 브라우저에서 같은 주소를 직접 입력해 열어요. 사이트와 오버레이 주소 모두 열어 봐요.

:::success
배포 주소에서도 카드 6장, 오늘 요일 강조, 카운트다운이 보여요. 휴대폰에서도 사이트가 열리고, 옆으로 밀리는 화면(가로 스크롤)이 없고, ☰ 메뉴 버튼이 동작해요. 휴대폰이 다크 모드로 설정되어 있으면 처음부터 어두운 화면이에요(정상이에요, 기기 설정을 따라요).
:::

### 5단계 · README에 회고 쓰기 (12분)

**어디서:** VS Code → `C:\dev\my-creator-site\README.md`

**무엇을:** 파일 맨 끝에 아래 `## 회고` 절을 붙여 넣고, **내 이야기로 바꿔요.** 아래 글은 달빛곰의 예시예요. 잘한 것·아쉬운 것·다음에 해 볼 것에는 Day 번호와 장면을 넣고, 질문 5개에는 내 답을 써요. 그리고 파일 맨 위의 배포 주소 링크(`내아이디`)가 내 GitHub 아이디로 되어 있는지도 확인해요.

📄 C:\dev\my-creator-site\README.md (일부)
```md
## 회고

### 잘한 것 (Keep)

- Day 21에서 `Tab`으로 메뉴 버튼까지 가 보고, `<button>`이라서 키보드가 저절로 되는 것을 직접 확인한 점이 좋았어요.
- 막힐 때마다 콘솔의 오류 문장을 먼저 읽고 줄 번호를 따라간 점이 좋았어요(Day 24의 `#name-error` 오타).
- 매 Day 끝에 `Day N:` 커밋을 남겨서 GitHub에 기록이 쌓였어요.

### 아쉬운 것 (Problem)

- Day 25의 `async`/`await`가 가장 어려웠어요. 순서를 그림으로 그려 보지 않고 코드부터 따라 쳤어요.
- 휴대폰에서 직접 열어 보는 일을 Day 28 근처까지 미뤘어요.

### 다음에 해 볼 것 (Try)

- 다음 프로젝트에서는 새 개념이 나올 때 콘솔에서 먼저 한 줄씩 실험해 볼 거예요.
- 영상 데이터에 내 진짜 영상 5개를 넣어서 방송 때 쓸 거예요.
- 문의 폼을 진짜 서버로 보내는 것을 P2에서 해 볼 거예요.

### 질문 5개

1. 가장 어려웠던 Day는? Day 25(JSON과 fetch). 비동기 순서가 눈에 안 보였어요.
2. 가장 뿌듯했던 순간은? Day 14에 내 사이트가 `github.io` 주소로 처음 열렸을 때예요.
3. 오늘 다시 만든다면 바꿀 점은? 색 변수를 처음부터 쓰고, 파일 이름 규칙을 일찍 정해요.
4. 아직 헷갈리는 개념은? 이벤트 위임의 `closest`와 정규 표현식이에요.
5. 다음 프로젝트에서 시도하고 싶은 것은? 진짜 서버와 데이터베이스로 문의 폼을 받는 거예요.
```

저장하고 `Ctrl + Shift + V`로 미리 보기를 확인해요.

:::success
미리 보기에 `회고` 큰 제목 아래 세 개의 작은 제목(잘한 것, 아쉬운 것, 다음에 해 볼 것)과 목록, 번호 목록 질문 5개가 보여요.
:::

### 6단계 · 마지막 커밋·푸시 (3분)

**어디서:** VS Code → 소스 제어 패널

**무엇을:** **메시지** 칸에 `Day 30: 최종 점검과 회고`를 입력하고 **커밋** → **변경 내용 동기화**를 눌러요. 명령으로 한다면 VS Code 터미널(PowerShell), 위치 `C:\dev\my-creator-site`에서 아래를 한 줄씩 실행해요.

```powershell
git add .
git commit -m "Day 30: 최종 점검과 회고"
git push
```

`git commit` 예상 출력(해시와 숫자는 달라도 돼요):

```text
[main 0f7c3a9] Day 30: 최종 점검과 회고
 1 file changed, 27 insertions(+)
```

:::success
GitHub 저장소 첫 화면 아래 README에 `회고` 절이 보이고, 가장 최근 커밋이 `Day 30: 최종 점검과 회고`예요. Actions 탭의 맨 위 실행이 다시 초록 체크가 돼요(최대 10분). 소스 제어 패널의 변경은 0개예요.
:::

### 7단계 · Day 완료하고 진도 백업하기 (2분)

**어디서:** 이 교재 화면

**무엇을:**

1. 이 Day 맨 아래의 **Day 완료** 버튼을 눌러요. 앞 Day를 모두 완료해야 눌려요. 앞 Day의 버튼을 한 번도 안 눌렀다면 왼쪽 목차에서 ✅가 없는 Day를 하나씩 열어 맨 아래 **Day 완료**를 먼저 눌러요(차례대로 눌러야 해요).
2. 오른쪽 위 **설정**(⚙)을 눌러 **진도 백업**의 **진도 내보내기**를 눌러요. 파일이 내려받아져요. 안전한 곳에 보관하세요. 브라우저 기록을 지우면 진도가 사라질 수 있어서예요.

:::success
Day 30에 ✅ 완료 표시가 보이고, 교재 홈에서 P2 스트리머 허브가 열려 있어요. 내려받은 백업 파일이 다운로드 폴더에 있어요.
:::

## ✍️ 과제

### 과제 1 · 점검표 완주 (쉬움 ⭐, 8분)

4단계에서 배포 주소로 확인한 점검표 14개의 결과를 적어 보세요. 안 된 항목이 있으면 어느 항목이 왜 안 됐는지 한 줄씩 적고, 모두 통과했으면 "14개 모두 통과"라고 적어요.

- 확인 방법: 14개 모두 통과하거나, 안 된 항목과 돌아갈 Day가 적혀 있어요.
- 힌트: 배포 주소에서만 안 되는 것은 대소문자, 경로, 캐시가 원인인 경우가 많아요.

### 과제 2 · 회고 쓰기 (보통 ⭐⭐, 6분)

내 말로 KPT와 질문 5개를 채우세요. 각 항목에 Day 번호나 장면을 하나 이상 넣고, Try는 "해 볼 일"로 끝나게 써요.

- 확인 방법: 구체적인 Day·장면이 들어 있고, 다음 행동이 적혀 있어요.
- 힌트: "어렵다" 대신 "무엇이 어려웠는지"를 써요.

### 과제 3 · 의견 받아 반영하기 (선택, 4분)

친구나 시청자에게 배포 주소를 보내고 의견 하나를 받아 반영해 보세요. 반영하면 커밋 메시지에 무엇을 고쳤는지 남겨요.

- 확인 방법: GitHub에 `Day 30: 친구 의견 반영 - 영상 제목 글자 크게` 같은 커밋이 보여요.
- 힌트: 고친 파일은 다음 커밋에 포함돼요. 과제로 바꾼 파일을 커밋하지 않고 두면 소스 제어 패널에 변경이 남아요. 연습이라면 **변경 내용 취소**로 되돌리거나, 다음 커밋에 포함하세요.

## ✅ 정답

:::answer 과제 1 정답 · 점검표 완주
```text
항목별 확인 방법과 안 될 때 돌아갈 Day는 1단계 표에 있어요.
배포 주소에서만 안 되는 대표 원인:
- 파일·폴더 이름 대소문자 (Data/data) → 이름을 바꿀 때는 임시 이름을 거쳐 두 번 바꿔요 ([도움말 7번](#/page/help))
- 반영 대기 → 10분 기다린 뒤 Ctrl + F5
- 경로 (/ 로 시작하는 절대 경로) → 상대 경로
```

**왜 이렇게 하나요?** 내 컴퓨터(Windows)는 파일 이름의 대소문자를 구분하지 않지만 GitHub의 서버는 구분해요. 그래서 내 컴퓨터에서 되던 `fetch('Data/videos.json')`이 배포 주소에서는 404가 돼요. 배포 뒤에 한 번 더 점검하는 이유예요.
:::

:::answer 과제 2 정답 · 회고 쓰기
달빛곰의 예시예요. 내 회고는 다르게 써도 정답이에요.

```text
잘한 것: Day 21에서 Tab 으로 메뉴 버튼까지 가 보고 <button> 이라서
          키보드가 저절로 되는 것을 직접 확인했어요.
아쉬운 것: Day 25 의 async/await 순서를 그림으로 그리지 않고
          코드부터 따라 쳤어요.
다음에 해 볼 것: 새 개념이 나오면 콘솔에서 한 줄씩 먼저 실험해요.
```

**왜 이렇게 하나요?** 구체적인 Day와 장면이 있어서 나중에 읽어도 무슨 일이었는지 알 수 있고, Try가 "해 볼 일"로 끝나서 다음 프로젝트 첫날에 할 일이 돼요.
:::

:::answer 과제 3 정답 · 의견 받아 반영하기
```text
git add .
git commit -m "Day 30: 친구 의견 반영 - 영상 제목 글자 크게"
git push
```

**왜 이렇게 하나요?** 무엇을 왜 고쳤는지 커밋 메시지에 남기면 나중에 기록만 봐도 변화를 알 수 있어요. 의견 반영 후에는 배포가 끝난 뒤 다시 점검표를 확인해요. 이 커밋은 선택 과제의 결과라서, 하지 않았다면 끝 상태에는 필요 없어요.
:::

:::answer 오늘 끝 상태 전체 코드
막혔다면 아래 코드로 내 파일을 맞추세요. 오늘 바뀌는 파일은 `README.md`(맨 끝에 `## 회고` 절 추가)뿐이고, 나머지는 Day 29의 끝 상태와 같아요. 이 상태가 P1의 최종 모습이에요(글 내용만 사람마다 달라요).

```text
my-creator-site/
├─ css/
│  └─ style.css
├─ data/
│  ├─ schedule.json
│  └─ videos.json
├─ images/
│  ├─ logo.svg
│  ├─ profile.svg
│  ├─ thumb-game.svg
│  ├─ thumb-music.svg
│  └─ thumb-talk.svg
├─ js/
│  ├─ contact.js
│  ├─ contents.js
│  ├─ main.js
│  └─ schedule.js
├─ overlay/
│  ├─ countdown.css
│  ├─ countdown.html
│  └─ countdown.js
├─ README.md ✎
├─ about.html
├─ contact.html
├─ contents.html
├─ favicon.svg
├─ index.html
└─ schedule.html
```

📄 C:\dev\my-creator-site\README.md
````md
# 달빛곰 방송국

게임, 토크, 음악 방송을 하는 스트리머 달빛곰의 홈페이지예요. HTML, CSS, JavaScript만 써서 만들었고, 설치할 것이 없어요.
배포 주소: [https://내아이디.github.io/my-creator-site/](https://내아이디.github.io/my-creator-site/)

## 폴더 구조

```text
my-creator-site/
├─ index.html          홈 (소개, 방송 카드, 대표 영상)
├─ about.html          소개
├─ contents.html       영상 목록 (필터·검색)
├─ schedule.html       방송 일정표 + 다음 방송 카운트다운
├─ contact.html        문의 폼 (입력 검증)
├─ favicon.svg         브라우저 탭 아이콘
├─ css/style.css       모든 페이지의 스타일 (변수, 다크 모드, 반응형)
├─ js/
│  ├─ main.js          메뉴 토글, 다크 모드, 시간대별 인사말
│  ├─ contents.js      videos.json 불러오기, 카드 그리기, 필터·검색
│  ├─ schedule.js      오늘 요일 강조, 다음 방송 카운트다운
│  └─ contact.js       폼 검증, 상태 메시지(role="status")
├─ data/
│  ├─ videos.json      영상 목록
│  └─ schedule.json    방송 일정
├─ images/             프로필, 로고, 썸네일 자리 이미지 (SVG)
└─ overlay/            OBS 카운트다운 오버레이 (countdown.html / .css / .js)
```

## 열어 보는 방법

- **VS Code의 Live Preview**로 `index.html`을 열어요. (파일을 더블클릭해서 열면 `fetch`가 막혀서 영상 목록과 방송 일정 카운트다운이 나오지 않아요. 이유는 Day 25에서 배워요.)
- GitHub Pages로 배포한 주소로 열어도 돼요. (Day 14, Day 30)

## OBS 카운트다운 오버레이

`overlay/countdown.html` 뒤에 주소 값을 붙여서 써요.

```text
overlay/countdown.html?title=저녁 방송&start=20:00
```

| 값 | 뜻 | 예 |
|---|---|---|
| `title` | 화면에 보일 방송 제목 | `저녁 방송` (띄어쓰기는 `%20`으로 써도 돼요) |
| `start` | 오늘 방송 시작 시각 `HH:MM` (00:00 ~ 23:59) | `20:00` |

- 남은 시간이 `HH:MM:SS`로 줄어들다가, 시작 시각이 지나면 **곧 시작해요!** 로 바뀌어요.
- 시간은 **컴퓨터 시계 기준**이에요. 한국에서 쓰는 컴퓨터라면 한국 시간으로 계산돼요. (시간대는 P2에서 제대로 배워요)
- `start`가 없거나 `25:99`처럼 잘못 쓰면 사용법을 알려 주는 문장이 나와요.
- 배경이 투명(`transparent`)이라서 OBS에서 화면 위에 글자만 보여요.
- OBS 사용법: 소스 추가 → **브라우저** → URL에 배포한 주소를 붙여 넣어요. 너비·높이는 화면에 맞게 정해요. (OBS 메뉴 이름은 버전에 따라 조금 달라요)
- 일반 브라우저로 열면 배경이 흰색이라 글자가 흐리게 보여요. 정상이에요.

## 데이터 파일 형식

`data/videos.json`

```json
[{ "id": "v001", "title": "영상 제목", "category": "game", "youtubeId": "영상ID 11글자", "date": "2026-10-27" }]
```

`category`는 `game`, `talk`, `music` 중 하나예요.

`data/schedule.json`

```json
[{ "day": 1, "start": "20:00", "title": "방송 내용" }]
```

`day`는 일요일 `0`부터 토요일 `6`까지예요. `schedule.html`의 표(`data-day`)와 같은 값으로 맞춰 주세요.

## 알아 두면 좋은 점

- 영상 ID와 대표 영상은 **예시**예요. 내 YouTube 영상 주소 `watch?v=` 뒤의 11글자로 바꿔 주세요. `file://`로 열면 YouTube 임베드가 재생되지 않을 수 있어요.
- 다크 모드 선택은 브라우저의 `localStorage`에 `theme`(`light` 또는 `dark`)로 저장돼요.
- `schedule.js`와 오버레이는 컴퓨터 시간이 한국 시간이라고 가정하고 계산해요.
- 문의 폼은 연습용이라 서버로 보내지 않아요. 채팅 닉네임 칸은 선택이고, 적으면 HTML `pattern`(한글·영문·숫자·`_` 2~20글자)에 맞는지 검사해요.
- 외부 라이브러리·CDN·웹폰트는 쓰지 않았어요. 외부 주소는 YouTube뿐이에요.
- `og:image`는 배포 주소가 정해진 뒤에 `https://...` 전체 주소로 추가해요. (Day 28)

## 회고

### 잘한 것 (Keep)

- Day 21에서 `Tab`으로 메뉴 버튼까지 가 보고, `<button>`이라서 키보드가 저절로 되는 것을 직접 확인한 점이 좋았어요.
- 막힐 때마다 콘솔의 오류 문장을 먼저 읽고 줄 번호를 따라간 점이 좋았어요(Day 24의 `#name-error` 오타).
- 매 Day 끝에 `Day N:` 커밋을 남겨서 GitHub에 기록이 쌓였어요.

### 아쉬운 것 (Problem)

- Day 25의 `async`/`await`가 가장 어려웠어요. 순서를 그림으로 그려 보지 않고 코드부터 따라 쳤어요.
- 휴대폰에서 직접 열어 보는 일을 Day 28 근처까지 미뤘어요.

### 다음에 해 볼 것 (Try)

- 다음 프로젝트에서는 새 개념이 나올 때 콘솔에서 먼저 한 줄씩 실험해 볼 거예요.
- 영상 데이터에 내 진짜 영상 5개를 넣어서 방송 때 쓸 거예요.
- 문의 폼을 진짜 서버로 보내는 것을 P2에서 해 볼 거예요.

### 질문 5개

1. 가장 어려웠던 Day는? Day 25(JSON과 fetch). 비동기 순서가 눈에 안 보였어요.
2. 가장 뿌듯했던 순간은? Day 14에 내 사이트가 `github.io` 주소로 처음 열렸을 때예요.
3. 오늘 다시 만든다면 바꿀 점은? 색 변수를 처음부터 쓰고, 파일 이름 규칙을 일찍 정해요.
4. 아직 헷갈리는 개념은? 이벤트 위임의 `closest`와 정규 표현식이에요.
5. 다음 프로젝트에서 시도하고 싶은 것은? 진짜 서버와 데이터베이스로 문의 폼을 받는 거예요.
````
:::

:::answer 오늘 끝 상태 style.css 전체
P1 최종 `style.css` 전체예요(Day 25 전체본에 Day 26의 일정 강조와 Day 28의 키보드·움직임 규칙을 더한 것). `css/style.css`가 엉켰을 때 `Ctrl + A` 후 붙여 넣어 맞춰요. 내가 바꾼 색이 있으면 먼저 적어 두고, 맞춘 뒤에는 소스 제어에서 커밋하고 **변경 내용 동기화**를 눌러요.

📄 C:\dev\my-creator-site\css\style.css
```css
/* ==========================================================
   style.css - 달빛곰 방송국 전체 스타일 (모든 페이지가 함께 써요)
   순서: 변수 → 기본 → 레이아웃 → 헤더/메뉴 → 공통 부품 → 페이지별 → 반응형
   모바일 먼저 만들고, 화면이 넓어지면 @media로 덧붙여요 (Day 13)
   ========================================================== */

/* ---------- 1. CSS 변수: 색은 여기서만 정해요 (Day 14, 22) ---------- */
:root {
  --bg: #ffffff;
  --surface: #f4f2ff;      /* 카드·표 머리글 배경 */
  --text: #1d1b2e;
  --muted: #5a5775;        /* 보조 글자 */
  --accent: #5b4bdb;       /* 포인트 색 (버튼, 링크) */
  --accent-text: #ffffff;  /* 포인트 색 위의 글자 */
  --link: #4a3bc7;
  --border: #d9d6ee;
  --error: #b3261e;
  --success: #1b6e3c;
  --highlight: #fff3c4;    /* 오늘 요일 강조 */
  --radius: 12px;
  color-scheme: light;     /* 입력칸·스크롤바도 밝은 모양으로 */
}

/* 다크 모드: main.js가 <html data-theme="dark">를 붙이면 변수 값만 바뀌어요 */
:root[data-theme="dark"] {
  --bg: #14121f;
  --surface: #1f1c33;
  --text: #ece9ff;
  --muted: #b3aed6;
  --accent: #8f83ff;
  --accent-text: #14121f;
  --link: #b0a8ff;
  --border: #3a3660;
  --error: #ff8a80;
  --success: #6fd49a;
  --highlight: #4a3f12;
  color-scheme: dark;
}

/* ---------- 2. 기본 설정 (Day 9, 10) ---------- */
* {
  box-sizing: border-box; /* padding·border를 width 안에 포함해서 계산해요 */
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: system-ui, "Malgun Gothic", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
  line-height: 1.7;
  word-break: keep-all;     /* 한국어는 단어 중간에서 줄을 바꾸지 않아요 */
  overflow-wrap: break-word; /* 너무 긴 단어만 강제로 줄을 바꿔요 */
  transition: background-color 0.2s, color 0.2s; /* 테마가 바뀔 때 부드럽게 (Day 14) */
}

/* hidden 속성이 다른 display 규칙에 지지 않게 해요 */
[hidden] {
  display: none !important;
}

img {
  max-width: 100%;
  height: auto;
}

a {
  color: var(--link);
}

h1, h2, h3 {
  line-height: 1.3;
}

h1 {
  font-size: 1.75rem;
  margin: 1.5rem 0 0.75rem;
}

h2 {
  font-size: 1.35rem;
  margin: 2rem 0 0.75rem;
}

h3 {
  font-size: 1.1rem;
  margin: 0.25rem 0;
}

/* 키보드로 이동할 때 현재 위치가 보이게 해요 (접근성, Day 28) */
:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
}

/* 화면에서는 숨기고 스크린 리더에게만 읽히는 글자 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* "본문 바로가기": 키보드로 Tab을 처음 누르면 나타나요 */
.skip-link {
  position: absolute;
  left: 1rem;
  top: -4rem;
  background: var(--accent);
  color: var(--accent-text);
  padding: 0.5rem 1rem;
  border-radius: 0 0 var(--radius) var(--radius);
  z-index: 10;
}

.skip-link:focus {
  top: 0;
}

/* ---------- 3. 레이아웃 ---------- */
.container {
  max-width: 960px;
  margin: 0 auto;
  padding-left: 1rem; /* 좌우 여백 16px: 휴대폰에서도 글자가 가장자리에 붙지 않아요 */
  padding-right: 1rem;
}

main {
  padding-bottom: 3rem;
}

/* ---------- 4. 헤더와 내비게이션 (Day 11) ---------- */
.site-header {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

.header-inner {
  display: flex;
  flex-wrap: wrap;          /* 좁은 화면에서는 메뉴가 아래 줄로 내려가요 */
  align-items: center;
  gap: 0.5rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text);
  font-weight: 700;
  text-decoration: none;
}

.logo img {
  display: block;
  border-radius: 8px;
}

/* 모바일: 메뉴 버튼은 보이고, 메뉴 목록은 숨겨져 있어요 */
.menu-toggle {
  margin-left: auto;
}

.site-nav {
  display: none;
  flex-basis: 100%; /* 한 줄을 다 차지해서 아래로 내려가요 */
}

.site-nav.open {
  display: block; /* main.js가 open 클래스를 붙이면 보여요 */
}

.menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.menu-list a {
  display: block;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  color: var(--text);
  text-decoration: none;
}

.menu-list a:hover {
  background: var(--border);
}

/* 지금 보고 있는 페이지 표시 */
.menu-list a[aria-current="page"] {
  background: var(--accent);
  color: var(--accent-text);
  font-weight: 700;
}

/* ---------- 5. 공통 부품 ---------- */
button,
.button {
  display: inline-block;
  font: inherit;
  padding: 0.5rem 1rem;
  border: 2px solid var(--accent);
  border-radius: 999px;
  background: var(--accent);
  color: var(--accent-text);
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.15s, background-color 0.15s;
}

button:hover,
.button:hover {
  transform: translateY(-2px);
}

.button-outline,
.menu-toggle,
.theme-toggle,
.filters button {
  background: transparent;
  color: var(--text);
}

.theme-toggle[aria-pressed="true"],
.filters button[aria-pressed="true"] {
  background: var(--accent);
  color: var(--accent-text);
}

/* 카드 그리드 (Day 12): 칸 하나는 최소 240px, 남는 공간은 똑같이 나눠 가져요 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: transform 0.15s, box-shadow 0.15s;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.card img {
  display: block;
  width: 100%;
}

.card-body {
  padding: 0.75rem 1rem 1rem;
}

.card-body p {
  margin: 0.25rem 0 0;
  color: var(--muted);
}

.card-body time {
  display: block;
  color: var(--muted);
  font-size: 0.9rem;
}

.badge {
  display: inline-block;
  padding: 0 0.6rem;
  border-radius: 999px;
  background: var(--accent);
  color: var(--accent-text);
  font-size: 0.8rem;
  font-weight: 700;
}

/* ---------- 6. 페이지별 ---------- */

/* 홈: 소개 영역 */
.hero {
  display: grid;
  gap: 1.5rem;
  align-items: center;
  padding-top: 1.5rem;
  padding-bottom: 1rem;
}

.hero-image {
  width: 160px;
  border-radius: 50%;
}

.greeting {
  color: var(--muted);
  font-size: 1.1rem;
  margin: 0 0 0.5rem;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

/* 유튜브 영상: 가로 폭에 맞춰 16:9 비율을 유지해요 */
.video-frame {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 0;
  border-radius: var(--radius);
  background: var(--surface);
}

/* 소개 페이지 */
.about-intro {
  display: grid;
  gap: 1.5rem;
  align-items: start;
}

.about-image {
  width: 200px;
  border-radius: var(--radius);
}

/* 영상 목록: 필터 + 검색 */
.toolbar {
  display: grid;
  gap: 1rem;
  margin-bottom: 1rem;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.search-box label {
  display: block;
  font-weight: 700;
}

input,
select,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  padding: 0.5rem 0.75rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: var(--text);
}

input:focus,
select:focus,
textarea:focus {
  border-color: var(--accent);
}

.result-count {
  color: var(--muted);
  margin: 0 0 0.5rem;
}

.error-box {
  padding: 0.75rem 1rem;
  border: 2px solid var(--error);
  border-radius: 8px;
  color: var(--error);
}

/* 방송 일정 */
.next-box {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1rem;
  margin: 1.5rem 0;
}

.next-box h2 {
  margin-top: 0;
}

.next-box p {
  margin: 0;
}

#next-remaining {
  display: block;
  font-size: 1.75rem;
  font-variant-numeric: tabular-nums; /* 숫자 폭을 같게 해서 흔들리지 않아요 */
}

.schedule-table {
  width: 100%;
  border-collapse: collapse;
}

.schedule-table caption {
  text-align: left;
  font-weight: 700;
  padding-bottom: 0.5rem;
}

.schedule-table th,
.schedule-table td {
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--border);
  text-align: left;
}

.schedule-table thead th {
  background: var(--surface);
}

/* 오늘 요일 행 강조: schedule.js가 today 클래스를 붙여요 */
.schedule-table tr.today {
  background: var(--highlight);
  font-weight: 700;
}

.schedule-table tr.today th::after {
  content: " (오늘)"; /* 색만으로 구분하지 않도록 글자도 함께 보여요 */
}

/* 문의 폼 */
.contact-form {
  display: grid;
  gap: 1rem;
  max-width: 560px;
}

.field label {
  display: block;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.field input[aria-invalid="true"],
.field textarea[aria-invalid="true"] {
  border-color: var(--error);
}

.field-error {
  margin: 0.25rem 0 0;
  color: var(--error);
  font-size: 0.9rem;
}

.field-hint {
  margin: 0.25rem 0 0;
  color: var(--muted);
  font-size: 0.9rem;
}

.field-error:empty {
  display: none; /* 오류 메시지가 없으면 자리도 차지하지 않아요 */
}

.form-status {
  margin: 0;
  font-weight: 700;
}

.form-status.is-error {
  color: var(--error);
}

.form-status.is-success {
  color: var(--success);
}

/* ---------- 7. 푸터 ---------- */
.site-footer {
  border-top: 1px solid var(--border);
  background: var(--surface);
  color: var(--muted);
  text-align: center;
  padding: 1.5rem 0;
}

.site-footer p {
  margin: 0;
}

/* ---------- 8. 반응형: 화면이 768px 이상일 때 (Day 13) ---------- */
@media (min-width: 768px) {
  h1 {
    font-size: 2.25rem;
  }

  /* 메뉴 버튼은 숨기고, 메뉴 목록은 가로로 늘어놔요 */
  .menu-toggle {
    display: none;
  }

  .site-nav {
    display: block;
    flex-basis: auto;
    margin-left: auto;
  }

  .menu-list {
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
  }

  .hero {
    grid-template-columns: 200px 1fr;
    gap: 2rem;
  }

  .hero-image {
    width: 200px;
  }

  .about-intro {
    grid-template-columns: 200px 1fr;
  }

  .toolbar {
    grid-template-columns: 1fr minmax(240px, 320px);
    align-items: end;
  }
}

/* 움직임을 줄여 달라고 설정한 사용자를 배려해요 (Day 28) */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
  }
}
```
:::

## 🧯 자주 막히는 곳

여기에 없는 증상은 [문제 해결 모음](#/page/troubleshooting)에서 찾아보세요.

### Actions에 빨간 ✕가 떠요

**원인:** 배포 작업이 실패했어요. 대부분 일시적인 GitHub 문제라서 다시 실행하면 돼요.

**해결:**

1. 저장소 **Actions** → 실패한 실행을 클릭해 오류 내용을 읽어요.
2. 위쪽의 다시 실행 버튼(**Re-run all jobs** 등, 이름은 버전에 따라 달라요)을 눌러 한 번 더 시도해요.
3. 계속 실패하면 잠시 뒤 다시 하거나, 저장소 **Settings → Pages**에서 배포를 껐다 켜 봐요. 파일 이름의 한글·공백·특수 문자가 원인일 수도 있지만 확인된 근거는 없으니 마지막에 의심해요.

### 내 컴퓨터에서는 되는데 배포 주소에서만 안 돼요 (404, 카드 없음, 메뉴 하나만 404, 예전 모습)

**원인:** 푸시를 안 했거나, 파일·폴더 이름의 대소문자가 다르거나, 반영이 늦거나, 브라우저 캐시예요. 내 컴퓨터는 대소문자를 구분하지 않지만 GitHub 서버는 구분해요.

**해결:** [도움말 7번](#/page/help)의 순서(올라갔는지 → 저장소 파일·대소문자 → 임시 이름으로 두 번 바꾸기 → Network 404 → Actions → `Ctrl + F5`)대로 확인해요.

### 휴대폰에서만 가로 스크롤이 생겨요

**원인:** 긴 영어 주소나 긴 글 때문에 화면보다 넓어진 곳이 있어요.

**해결:** 개발자 도구 기기 모드를 360px로 맞추고 어느 요소가 넘치는지 Elements에서 찾아요. 긴 글은 `overflow-wrap: break-word;`(이미 `body`에 있어요)로 줄이 바뀌는지 확인해요.

### 휴대폰이 다크 모드로 보여요

**원인:** 정상이에요. 저장된 선택이 없으면 휴대폰의 다크 모드 설정을 따라가요(Day 22).

**해결:** 메뉴의 🌙 다크 모드 버튼으로 바꿔요.

### 대표 영상이 재생되지 않아요

**원인:** 홈의 YouTube 영상 ID는 예시예요. 영상 주인이 퍼가기를 막아 둔 영상도 재생되지 않아요.

**해결:** 내 영상 주소 `watch?v=` 뒤의 11글자로 바꿔요(`index.html`의 `iframe` 주소와 `videos.json`).

### Day 완료 버튼이 눌리지 않아요

**원인:** 앞 Day가 완료되지 않았어요.

**해결:** 교재 왼쪽 사이드바에서 ✅가 아닌 Day를 찾아 완료해요. P2는 P1의 30개 Day를 모두 완료해야 열려요.

## 📝 오늘의 체크리스트

- [ ] 1단계 점검표 14개를 내 컴퓨터에서 확인했어요
- [ ] 저장소 Actions 탭에서 `pages build and deployment`가 초록 체크예요
- [ ] 배포 주소에서도 카드 6장, 카운트다운, 오버레이가 동작해요
- [ ] 휴대폰으로 사이트와 오버레이 주소를 열어 봤어요(없다면 기기 모드로 확인했어요)
- [ ] README에 `## 회고` 절을 써서 GitHub 첫 화면에서 확인했어요
- [ ] 마지막 커밋이 `Day 30: …`이고 소스 제어 패널의 변경이 0개예요
- [ ] 과제 1, 2를 하고 정답과 비교했어요
- [ ] Day 완료를 누르고 진도 백업 파일을 내려받았어요

## 📚 더 알아보기

- [GitHub Docs — GitHub Pages](https://docs.github.com/en/pages): 배포 방법과 문제 해결을 정리한 공식 문서예요.
- [MDN — 웹 개발 학습 영역](https://developer.mozilla.org/ko/docs/Learn_web_development): 다음에 공부할 주제를 찾는 공식 학습 안내예요.

➡️ **다음으로:** P1을 끝낸 것을 축하해요! 이 Day를 완료하면 다음 프로젝트 P2 스트리머 허브(TypeScript·C#·데이터베이스)가 열려요. [P2 한눈에 보기](#/project/p2)에서 다음 여정을 미리 살펴보세요.
