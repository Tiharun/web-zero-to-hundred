## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- 색을 CSS 변수(`--accent` 같은 이름)로 한곳에서 관리하고, 한 줄만 고쳐 사이트 전체의 색을 바꿀 수 있어요.
- 마우스를 올리면 메뉴가 색이 바뀌고, 버튼과 카드가 살짝 떠오르는 효과를 넣을 수 있어요.
- GitHub Pages를 켜서 내 사이트를 `https://<내 아이디>.github.io/my-creator-site/` 주소로 인터넷에 공개할 수 있어요.
- 내 휴대폰으로 그 주소를 열어서 모바일 모양을 직접 볼 수 있어요.

**예상 시간: 120분** (개념 이해 25분 · 따라하기 70분 · 과제 20분 · 정리 5분)

:::path 📂 시작 상태
어제(Day 13)까지 만든 파일이 이렇게 있어야 해요. 없거나 다르면 [Day 13](#/day/p1-d13)의 "오늘 끝 상태 전체 코드"로 맞춰 주세요.

- `C:\dev\my-creator-site\index.html`, `about.html`, `contents.html`, `schedule.html`, `contact.html`
- `C:\dev\my-creator-site\css\style.css` (색을 `#5b4bdb` 같은 색상 코드로 직접 쓴 상태, 맨 끝에 `@media (min-width: 768px)` 구역이 있어요)
- `C:\dev\my-creator-site\images\profile.svg`, `logo.svg`, `thumb-game.svg`, `thumb-talk.svg`, `thumb-music.svg`
- VS Code에서 `C:\dev\my-creator-site` 폴더가 열려 있고, Live Preview 확장 프로그램이 설치되어 있어요.
- GitHub 계정과 **공개(Public)** 저장소 `https://github.com/<내 아이디>/my-creator-site`가 있고 로컬 저장소와 연결되어 있어요. 어제 변경은 모두 커밋·푸시했어요(소스 제어 패널의 변경 0개).
- 인터넷에 연결되어 있어요(오늘 배포 단계에서 필요해요).
:::

## 📖 개념 이해

### 색에 이름 붙이기: CSS 변수

**비유:** 화가의 팔레트를 떠올려 보세요. 물감마다 이름표(예: "포인트 보라")를 붙여 두고, 그림을 그릴 때는 이름으로 불러서 써요. 포인트 보라를 다른 색으로 바꾸고 싶으면 팔레트의 물감 하나만 바꾸면 그림 전체의 보라가 바뀌어요.

지금 `style.css`에는 보라색 `#5b4bdb`가 여러 곳에 따로 적혀 있어요. 색을 바꾸려면 모든 곳을 찾아 고쳐야 하고, 하나라도 빠뜨리면 색이 섞여요.

**정확한 정의:** **[[CSS 변수]]**(CSS variable)는 CSS에서 값에 이름을 붙여 여러 곳에서 다시 쓰는 기능이에요. 이름은 `--`로 시작해요. 보통 문서 맨 위의 `:root`(문서 전체의 뿌리 요소) 안에 정의하고, `var(--이름)`으로 꺼내 써요.

```css
:root {
  --accent: #5b4bdb;
}

.button {
  background: var(--accent);
}
```

색을 한곳에서만 정해 두면 Day 22에서 다크 모드를 만들 때도 변수 값만 바꾸면 돼요. 이름은 색 자체(`purple`)가 아니라 **역할**(`accent` = 포인트 색, `text` = 글자색, `border` = 선 색)로 지어요. 그래야 나중에 색이 바뀌어도 이름이 틀리지 않아요.

### 마우스를 올렸을 때: 의사 클래스와 트랜지션

링크나 버튼에 마우스를 올리면 모양이 바뀌는 효과를 넣어 볼게요.

**[[의사 클래스]]**(pseudo-class)는 요소의 특별한 **상태**를 고르는 CSS 선택자예요. 콜론 하나를 붙여서 써요. `:hover`는 "마우스가 올라와 있는 동안"이에요. HTML에 클래스를 붙이지 않아도 상태에 따라 모양을 바꿀 수 있어요.

```css
.menu-list a:hover {
  background: #d9d6ee;
}
```

그런데 `:hover`만 쓰면 모양이 **번쩍** 바뀌어요. **[[트랜지션]]**(transition)은 CSS 값이 바뀔 때 정한 시간 동안 부드럽게 바뀌게 하는 기능이에요. `transition: transform 0.15s;`는 "`transform` 값이 바뀔 때 0.15초에 걸쳐 바뀌어요"라는 뜻이에요.

오늘 쓰는 효과를 정리하면 이래요.

- `transform: translateY(-2px);`는 요소를 위로 2px 올려요(살짝 떠오르는 느낌). `-`가 위쪽이에요.
- `box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);`는 아래에 그림자를 깔아요. 값은 순서대로 가로 0, 세로 6px, 흐림 16px, 색이에요.
- `rgba(0, 0, 0, 0.15)`는 빨강·초록·파랑(0~255)과 **투명도**(0은 완전 투명, 1은 불투명)로 쓰는 색이에요. 검정을 15%만 진하게 칠하라는 뜻이라 은은한 그림자가 돼요.

휴대폰에는 마우스가 없어서 `:hover` 효과가 보이지 않아요. 효과가 없어도 사이트를 쓰는 데 문제가 없게 "있으면 좋은 꾸밈"으로만 써요.

### 인터넷에 올리기: 배포와 GitHub Pages

지금 내 사이트는 내 컴퓨터 안에서만 보여요. 가족에게 "이 주소로 들어와 봐" 하고 알려 줄 수 없어요. Day 1에서 배운 대로 누구나 `https://` 주소로 열려면 **서버**에 파일을 올려 두어야 해요.

**비유:** 내 방에서 만든 작품을 동네 전시관 진열대에 올려 두면 누구나 와서 볼 수 있는 것과 같아요.

**정확한 정의:**

- **[[배포]]**(deploy)는 내 컴퓨터에서 만든 웹사이트를 서버에 올려 다른 사람이 인터넷으로 쓸 수 있게 하는 일이에요. 한 번 배포한 뒤에도 고친 내용을 다시 올리면 사이트가 새 모습으로 바뀌어요.
- **[[GitHub Pages]]**(깃허브 페이지스)는 GitHub 저장소의 HTML·CSS·JS 파일을 그대로 웹사이트로 공개해 주는 GitHub의 무료 기능이에요. 무료 계정은 **공개(Public) 저장소**에서만 쓸 수 있어요. Day 7에서 저장소를 공개로 만든 이유예요.

저장소의 `index.html`이 **맨 위**에 있으면 `https://<내 아이디>.github.io/my-creator-site/`로 열려요. 우리 프로젝트 폴더(`C:\dev\my-creator-site`)가 그대로 저장소라서 `index.html`이 맨 위에 있어요.

:::warn 공개 저장소의 모든 파일은 누구나 볼 수 있어요
배포하면 저장소의 파일이 인터넷에 공개돼요. 비밀번호, 개인 연락처, 남에게 보이기 싫은 글은 파일에 넣지 마세요. 이 사이트에는 그런 것이 없어요.
:::

### 서버는 대소문자를 구분해요

Day 4에서 배운 것을 오늘 실제로 만나요. Windows는 `Profile.svg`와 `profile.svg`를 같은 파일로 봐서 내 컴퓨터에서는 잘 열려요. 하지만 GitHub Pages 서버는 **대소문자를 구분해서**, `images/Profile.svg`라고 쓴 곳은 파일을 못 찾아요. "내 컴퓨터에서는 되는데 인터넷에서만 그림이 깨져요"의 가장 큰 원인이에요. 그래서 파일 이름은 소문자로 짓는 습관을 들였어요.

## 🛠️ 따라하기

모두 9단계예요. 1~5단계는 VS Code에서 CSS를 고치고, 6~9단계는 GitHub에 올려 공개해요.

### 1단계 · 색 코드가 몇 개 있는지 세어 보기 (5분)

바꾸기 전에, 지금 색이 몇 군데에 흩어져 있는지 먼저 봐요.

**어디서:** VS Code, `C:\dev\my-creator-site\css\style.css`

**무엇을:**

1. VS Code에서 `style.css`를 열어요.
2. `Ctrl + F`를 눌러 찾기 칸을 열고 `#`을 입력해요(영어 입력 상태에서 `Shift + 3`).
3. 찾기 칸 오른쪽에 `1/22`처럼 나오는 숫자를 확인해요.

:::success
찾기 칸 오른쪽에 `1/22`처럼 `#` 글자의 전체 개수가 나와요. 내 파일은 숫자가 조금 달라도 괜찮아요. 오늘 끝나면 이 숫자가 8로 줄어들어요(변수를 정의하는 `:root` 안의 8개만 남아요).
:::

### 2단계 · 이름 있는 색을 한꺼번에 바꾸기 (12분)

VS Code의 **찾기·바꾸기**로 같은 색 코드를 `var(--이름)`으로 한 번에 바꿔요. `#ffffff`(흰색)는 쓰임이 둘이라 다음 단계에서 따로 바꿔요.

**어디서:** VS Code, `C:\dev\my-creator-site\css\style.css`, `Ctrl + H`(찾기·바꾸기)

**무엇을:** 아래 표의 줄마다 이 방법으로 해요.

1. `Ctrl + H`를 눌러요. 위쪽 칸은 **찾기**, 아래쪽 칸은 **바꾸기**예요.
2. 위쪽 칸에 **찾을 글자**를 입력하고, 아래쪽 칸에 **바꿀 글자**를 입력해요.
3. 바꾸기 칸 오른쪽의 **모두 바꾸기** 버튼(아이콘에 마우스를 올리면 설명이 나와요)을 누르거나 `Ctrl + Alt + Enter`를 눌러요.
4. 바뀐 개수가 위쪽에 표시돼요. 다음 줄로 넘어가요.

| 찾을 글자 | 바꿀 글자 | 바뀌는 곳(개수) |
|---|---|---|
| `#f4f2ff` | `var(--surface)` | 5곳 |
| `#1d1b2e` | `var(--text)` | 4곳 |
| `#5a5775` | `var(--muted)` | 2곳 |
| `#5b4bdb` | `var(--accent)` | 3곳 |
| `#4a3bc7` | `var(--link)` | 1곳 |
| `#d9d6ee` | `var(--border)` | 4곳 |
| `12px` | `var(--radius)` | 3곳 |

`var(--surface)` 안의 `--`는 하이픈 두 개, `(`와 `)`가 짝이에요. 한글 입력 상태에서 치면 글자가 달라지니 영어 입력 상태에서 쳐요(`한/영` 키).

:::success
일곱 줄을 모두 바꾸고 나면 `Ctrl + F`로 `#`을 찾을 때 숫자가 `1/3`처럼 3개 정도만 남아요(남은 것은 `#ffffff` 3곳이에요). 미리 보기 화면은 아직 변수 값이 없어서 **색이 모두 사라진 것처럼** 보여요(흰 바탕에 검은 글자 기본 모양). 정상이에요. 4단계에서 값을 적어 주면 색이 돌아와요.
:::

### 3단계 · 흰색 3곳은 하나씩 바꾸기 (6분)

`#ffffff`는 "페이지 배경"에도 쓰이고 "보라색 위의 글자"에도 쓰여요. 같은 색 코드지만 **역할이 달라서** 이름이 달라요. 그래서 한꺼번에 바꾸지 않고 하나씩 보고 바꿔요.

**어디서:** VS Code, `C:\dev\my-creator-site\css\style.css`

**무엇을:**

1. `Ctrl + F`로 `#ffffff`를 찾아요. 찾은 곳이 파랗게 표시돼요. `Enter`를 누르면 다음 곳으로 가요.
2. 첫 번째는 `body { … }` 안의 `background: #ffffff;`예요. 배경이므로 `background: var(--bg);`로 고쳐요.
3. 두 번째는 `.menu-list a[aria-current="page"] { … }` 안의 `color: #ffffff;`예요. 보라색 위의 글자이므로 `color: var(--accent-text);`로 고쳐요.
4. 세 번째는 `button, .button { … }` 안의 `color: #ffffff;`예요. 마찬가지로 `color: var(--accent-text);`로 고쳐요.
5. `Ctrl + S`로 저장해요.

:::success
`Ctrl + F`로 `#`을 찾으면 결과가 `0`이 되어 "결과 없음"이 보여요. 파일에 색 코드가 하나도 안 남았어요. 화면은 아직 색이 없는 기본 모양이에요.
:::

### 4단계 · 변수 값 정하기: 1번 구역 :root 만들기 (8분)

이제 색의 이름표마다 진짜 색을 적어 줘요. 파일 맨 위의 새 구역이에요.

**어디서:** VS Code, `C:\dev\my-creator-site\css\style.css`, 파일 맨 위

**무엇을:**

1. 맨 위 머리 주석을 아래처럼 바꿔요. 제목 줄 바로 아래에 `순서: …` 줄을 새로 넣어요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
/* ==========================================================
   style.css - 달빛곰 방송국 전체 스타일 (모든 페이지가 함께 써요)
   순서: 변수 → 기본 → 레이아웃 → 헤더/메뉴 → 공통 부품 → 페이지별 → 반응형
   모바일 먼저 만들고, 화면이 넓어지면 @media로 덧붙여요 (Day 13)
   ========================================================== */
```

2. 머리 주석이 끝나는 `*/` 줄 아래에 빈 줄을 하나 넣고, 아래 블록을 붙여 넣어요. 원래 `2. 기본 설정` 구역 위가 되는 위치예요.
3. `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
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
  --radius: 12px;
}
```

- 줄 끝의 `/* … */`는 이 변수가 어디에 쓰이는지 알려 주는 주석이에요.
- `--accent-text`는 "포인트 색 위에 올라가는 글자"의 색이에요. 보라색 버튼의 글자가 흰색인 것처럼요.

:::success
미리 보기가 어제와 **똑같은 색**으로 돌아와요(흰 바탕, 연보라 머리글, 보라색 현재 메뉴와 버튼). `Ctrl + F`로 `#`을 찾으면 숫자가 `8`이에요(`:root` 안의 8개). 색이 돌아오지 않으면 아래 🧯 자주 막히는 곳의 "색이 모두 사라졌어요"를 보세요.
:::

### 5단계 · 마우스를 올리면 움직이게 하기 (12분)

메뉴에는 배경색을, 버튼과 카드에는 살짝 떠오르는 효과를 넣어요. 아래 4군데를 차례로 고쳐요. 규칙이 이미 있는 곳은 블록으로 **바꾸고**, 새 규칙은 **추가**해요.

**어디서:** VS Code, `C:\dev\my-creator-site\css\style.css`

**무엇을:**

1. `2. 기본 설정`의 `body { … }` 규칙을 아래 블록으로 바꿔요. `transition` 줄이 늘었어요(다크 모드로 바꿀 때 색이 부드럽게 바뀌게 준비해요, Day 22).

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
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
```

2. `.menu-list a { … }` 규칙 바로 아래에 `:hover` 규칙을 추가해요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
.menu-list a:hover {
  background: var(--border);
}
```

3. `5. 공통 부품`의 `button, .button { … }` 규칙을 아래 블록으로 바꿔요. `transition` 줄이 늘었고, 그 아래에 `:hover` 규칙이 새로 생겨요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
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
```

4. `.card { … }` 규칙을 아래 블록으로 바꿔요. `transition` 줄이 늘었고, 아래에 `.card:hover`가 새로 생겨요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
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
```

5. `Ctrl + S`로 저장하고 `index.html` 미리 보기에서 마우스를 이리저리 움직여 봐요.

:::success
메뉴 링크에 마우스를 올리면 연한 보라색 배경이 생겨요(현재 페이지 메뉴는 보라색 그대로예요). 홈의 버튼이나 카드에 올리면 살짝 위로 떠오르고, 카드는 아래에 은은한 그림자가 생겨요. 움직임은 0.15초 동안 부드럽게 일어나요.
:::

### 6단계 · 오늘 작업 커밋·푸시 (5분)

배포 전에 내 저장소에 오늘 변경을 올려요. Pages는 GitHub에 올라온 파일을 공개하기 때문에, 푸시를 꼭 먼저 해야 해요.

오늘 바뀐 파일을 Git에 기록하고(커밋) GitHub로 올려요(푸시). 매일 마지막에 하는 습관이에요. Day 7·8에서 한 것과 똑같아요.

**어디서:** VS Code, `C:\dev\my-creator-site` 폴더가 열린 창. 왼쪽 세로 막대의 가지 모양 아이콘(**소스 제어**, `Ctrl + Shift + G`)

**무엇을 (방법 A, 소스 제어 패널):**

1. 위쪽 **메시지** 칸을 클릭하고 `Day 14: CSS 변수, 호버 효과`를 입력해요.
2. **커밋** 버튼을 클릭해요. 변경 사항을 스테이징할지 묻는 창이 뜨면 **예**(또는 **항상**)를 눌러요.
3. **변경 내용 동기화** 버튼(또는 **푸시**)을 클릭해요. 확인 창이 뜨면 **확인**(또는 **OK**)을 눌러요.

버튼 이름은 VS Code 버전에 따라 조금 다를 수 있어요.

**무엇을 (방법 B, 터미널):** VS Code 메뉴 **터미널 → 새 터미널**을 눌러 Day 7에서 연 PowerShell 창을 열어요. 현재 위치가 `C:\dev\my-creator-site`인지 확인하고 한 줄씩 입력해요.

```powershell
git add .
```

예상 출력: 보통 아무것도 나오지 않고 다음 줄에 `PS C:\dev\my-creator-site>`가 다시 보이면 성공이에요. 아래처럼 `warning`이 나오면 Windows와 Git의 줄바꿈 방식이 달라서 나오는 안내예요. 무시해도 돼요(파일 이름은 달라도 돼요).

```text
warning: in the working copy of 'index.html', LF will be replaced by CRLF the next time Git touches it
```

```powershell
git commit -m "Day 14: CSS 변수, 호버 효과"
```

예상 출력(`a1b2c3d` 같은 해시와 숫자는 달라도 돼요):

```text
[main a1b2c3d] Day 14: CSS 변수, 호버 효과
 7 files changed, 120 insertions(+), 12 deletions(-)
```

```powershell
git push
```

예상 출력(숫자는 달라도 돼요. 진행 상황 줄이 더 많이 나올 수도 있어요):

```text
To https://github.com/<내 아이디>/my-creator-site.git
   a1b2c3d..e4f5a6b  main -> main
```

:::success
브라우저에서 `https://github.com/<내 아이디>/my-creator-site`를 열고 새로 고침(`F5`)하면, 파일 목록 위에 방금 쓴 커밋 메시지 `Day 14: CSS 변수, 호버 효과`가 보여요. VS Code 소스 제어 패널의 변경 목록은 비어 있어요.
:::

### 7단계 · GitHub Pages 켜기 (9분)

이제 GitHub 사이트에서 공개 스위치를 켜요. **인터넷 연결이 필요해요.** GitHub 화면은 영어로 보여요(작성 기준일 2026-11, 화면 이름은 바뀔 수 있어요).

**어디서:** 브라우저(Edge 또는 Chrome)에서 `https://github.com/<내 아이디>/my-creator-site` (GitHub에 로그인한 상태)

**무엇을:**

1. 저장소 페이지 위쪽 탭에서 **Settings**(설정)를 클릭해요. 안 보이면 탭 오른쪽 끝의 `⋯`(더 보기)를 눌러요.
2. 왼쪽 사이드바에서 **Code and automation**(또는 "Code, planning, and automation") 묶음 아래의 **Pages**를 클릭해요.
3. **Build and deployment** 아래 **Source**가 **Deploy from a branch**인지 확인해요. 다르면 목록에서 **Deploy from a branch**를 골라요.
4. **Branch** 아래 첫 번째 목록에서 `main`을 고르고, 오른쪽 폴더 목록에서 `/ (root)`를 골라요. **Save**를 클릭해요.
5. 화면을 새로 고침(`F5`)하며 기다려요. 최대 10분쯤 걸려요.

:::success
**Pages** 화면 위쪽에 `Your site is live at https://<내 아이디>.github.io/my-creator-site/`처럼 주소가 나오고 **Visit site** 버튼이 생겨요(문구는 조금 다를 수 있어요). 주소가 바로 안 나오면 몇 분 뒤에 새로 고침해요. 저장소 상단 탭의 **Actions**를 눌러 `pages build and deployment`라는 작업이 진행 중이거나 초록색 체크로 끝났는지 볼 수도 있어요. Pages 화면에 "공개 저장소로 바꾸라"는 안내가 보이거나 **Pages** 메뉴가 없으면 아래 🧯의 "Pages 설정에 공개로 바꾸라고 나와요"를 보세요.
:::

### 8단계 · 내 사이트 주소 열고 점검하기 (8분)

인터넷에 올라간 내 사이트를 열어서, 내 컴퓨터에서 보던 것과 같은지 확인해요.

**어디서:** 브라우저 주소창에 `https://<내 아이디>.github.io/my-creator-site/`를 입력해요(`<내 아이디>`는 GitHub 아이디, 보통 소문자예요).

**무엇을:**

1. 홈이 열리는지 봐요. 안 열리고 `404`가 나오면 아래 🧯를 보세요.
2. 메뉴의 `소개`, `영상`, `방송 일정`, `문의`를 차례로 눌러 다섯 페이지가 모두 열리는지 봐요.
3. 곰 그림, 로고, 카드의 썸네일 3개가 모두 보이는지 봐요.
4. 메뉴와 버튼에 마우스를 올려 효과가 나오는지 봐요.
5. 주소창 왼쪽이 자물쇠(안전한 연결, `https`)로 되어 있는지 봐요.

대표 영상 칸은 예시 영상이에요. 내 YouTube 영상 주소 `watch?v=` 뒤의 11글자로 바꾸면 내 영상이 나와요. 영상이 안 나오는 환경도 있어요.

:::success
인터넷 주소로 다섯 페이지가 열리고, 그림과 메뉴와 보라색 포인트가 내 컴퓨터에서와 똑같아요. 주소가 `https://`로 시작해요. Day 1에서 배운 대로 `file:///`이 아니라 진짜 서버에서 온 페이지예요.
:::

### 9단계 · 휴대폰으로 열어 보기 (5분)

어제 기기 모드로 흉내 낸 모바일 모양을 진짜 휴대폰에서 봐요.

**어디서:** 내 휴대폰의 브라우저(크롬, 사파리, 삼성 인터넷 등 아무거나)

**무엇을:**

1. 휴대폰 브라우저의 주소창에 `https://<내 아이디>.github.io/my-creator-site/`를 직접 입력해요. 철자는 `github.io`(점과 소문자)예요.
2. 입력이 번거로우면 PC에서 주소를 복사해 메신저의 "나에게 보내기"로 보낸 뒤 휴대폰에서 눌러요.
3. 메뉴, 카드, 곰 그림이 어제 기기 모드에서 본 모바일 모양인지 봐요.

:::success
휴대폰에서 메뉴가 로고 아래 세로 목록으로, 카드가 1장씩 세로로, 곰 그림이 위·글이 아래로 보여요. 가로로 밀리는 부분이 없어요. 회사나 학교 네트워크가 아니라 집 와이파이나 데이터에서 열어 보세요(일부 네트워크는 `github.io`를 막을 수 있어요).
:::

## ✍️ 과제

### 과제 1 · 변수 실험 (쉬움 ⭐, 5분)

색 한 줄만 바꿔서 사이트 전체의 보라색이 한꺼번에 바뀌는 것을 봐요.

- `:root`의 `--accent: #5b4bdb;`를 `--accent: #d6336c;`(분홍빛 빨강)로 바꾸고 저장해요.
- 홈, 소개, 문의 페이지에서 무엇이 분홍으로 바뀌었는지 찾아 적어요.
- 확인이 끝나면 `#5b4bdb`로 되돌려요.

힌트: 현재 페이지 메뉴, 버튼, 테두리를 살펴봐요. 링크 글자 색(`--link`)은 다른 변수예요.

### 과제 2 · 배포 점검표 (보통 ⭐⭐, 10분)

배포 주소에서 아래 항목을 확인하며 표로 정리해요.

- 다섯 페이지가 모두 열린다.
- 그림 5개(곰, 로고, 썸네일 3개)가 보인다.
- 메뉴 링크 5개가 모두 맞는 페이지로 간다.
- 대표 영상 칸이 보인다(재생은 환경에 따라 다를 수 있어요).

안 되는 항목이 있으면 가장 먼저 의심할 원인 세 가지도 적어요.

힌트: Day 4의 대소문자 구분, Day 7의 푸시, 오늘의 `index.html` 위치를 떠올려요.

### 과제 3 · 슬래시로 시작하는 경로 (도전 ⭐⭐⭐, 5분)

`<link rel="stylesheet" href="/css/style.css">`처럼 `/`로 시작하는 경로가 내 컴퓨터에서는 되는 것처럼 보여도, 배포 사이트에서는 CSS가 안 먹는 이유를 적어요.

- 배포 주소는 `https://<내 아이디>.github.io/my-creator-site/`예요. `/css/style.css`가 가리키는 주소를 써 봐요.
- 올바른 경로는 어떻게 쓰는지 적어요.

힌트: `/`로 시작하는 경로는 "사이트의 맨 위(도메인 바로 뒤)"부터 시작해요.

## ✅ 정답

:::answer 과제 1 정답 · 변수 실험
`--accent` 한 줄만 고쳤는데 아래가 한꺼번에 분홍빛 빨강으로 바뀌어요.

- 현재 페이지 메뉴의 배경(`.menu-list a[aria-current="page"]`)
- 보라색으로 채운 버튼의 배경과 테두리(홈의 `영상 보러 가기`, 문의의 `보내기`)
- 테두리만 있는 버튼(`방송 일정 보기`)의 테두리

링크 글자색은 `--link`, 카드 배경은 `--surface`라서 그대로예요.

**왜 이렇게 하나요?** 색을 변수로 한곳에 모았기 때문에, 변수 정의 한 줄이 그 변수를 쓰는 모든 곳의 색을 정해요. 이 힘으로 Day 22에서 다크 모드를 변수 값 교체만으로 만들어요. 확인이 끝나면 `#5b4bdb`로 되돌려요.
:::

:::answer 과제 2 정답 · 배포 점검표
| 확인 항목 | 확인 방법 |
|---|---|
| 다섯 페이지 | 메뉴를 눌러 홈·소개·영상·방송 일정·문의가 모두 열려요 |
| 그림 5개 | 곰(홈, 소개), 로고(모든 페이지 머리글), 썸네일 3개(홈 카드) |
| 메뉴 링크 | 각 메뉴가 맞는 페이지로 가고, 현재 메뉴만 보라색이에요 |
| 대표 영상 | 홈 맨 아래 16:9 칸이 보여요 |

안 될 때 먼저 의심할 원인 세 가지예요.

1. **대소문자.** `images/Profile.svg`처럼 파일 이름과 HTML의 `src`·`href` 글자가 대소문자까지 같은지 봐요(서버는 구분해요).
2. **푸시.** 고친 내용을 커밋·푸시하지 않았거나 Pages가 아직 새로 반영하지 않았어요(최대 10분).
3. **index.html 위치.** `index.html`이 저장소 맨 위에 있어야 해요. `C:\dev` 전체나 상위 폴더를 저장소로 올렸다면 `my-creator-site` 폴더 안으로 한 단계 더 들어가야 열려요.

**왜 이렇게 하나요?** 내 컴퓨터(Windows)와 서버(GitHub Pages)는 환경이 달라서, 배포 후에는 한 번 끝까지 눌러 보는 습관이 필요해요. 점검표를 쓰면 빠뜨리지 않아요.
:::

:::answer 과제 3 정답 · 슬래시로 시작하는 경로
`/css/style.css`의 맨 앞 `/`는 "사이트의 맨 위(루트)"를 뜻해요. 배포 주소가 `https://<내 아이디>.github.io/my-creator-site/`이면 이 경로는 `https://<내 아이디>.github.io/css/style.css`를 가리켜요. 중간의 `my-creator-site/`가 빠졌으니 파일이 없어서(404) CSS가 적용되지 않아요. 내 컴퓨터의 Live Preview에서는 서버 맨 위가 우리 프로젝트 폴더라서 우연히 잘 보여요.

올바른 경로는 맨 앞 `/` 없이 현재 페이지 기준으로 쓰는 **상대 경로**예요: `href="css/style.css"`. 그래서 이 교재는 처음부터 상대 경로만 썼어요(Day 4).

**왜 이렇게 하나요?** 상대 경로는 내 컴퓨터에서든, 서버의 하위 폴더에서든 "지금 이 페이지 기준으로 찾아요"라는 뜻이라 어디서나 같은 결과가 나와요. 절대 경로(`/`로 시작)는 사이트가 도메인 맨 위에 있을 때만 맞아요.
:::

:::answer 오늘 끝 상태 전체 코드
막혔다면 아래 `style.css`로 맞추고 [Day 15](#/day/p1-d15)를 시작하세요. 오늘 바뀐 파일은 `css/style.css` 하나예요(HTML 파일은 어제와 같아요). 오늘은 모든 규칙의 색이 바뀌어서 파일 전체를 실었어요. VS Code에서 `style.css`를 열고 `Ctrl + A`로 전체를 선택한 뒤 붙여 넣고 `Ctrl + S`로 저장해요. GitHub Pages 설정은 파일이 아니라 GitHub 사이트의 설정이라서 코드가 없어요.

```text
my-creator-site/
├─ about.html
├─ contact.html
├─ contents.html
├─ index.html
├─ schedule.html
├─ css/
│  └─ style.css
└─ images/
   ├─ logo.svg
   ├─ profile.svg
   ├─ thumb-game.svg
   ├─ thumb-music.svg
   └─ thumb-talk.svg
```

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
  --radius: 12px;
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

.site-nav {
  flex-basis: 100%; /* 한 줄을 다 차지해서 아래로 내려가요 */
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

.button-outline {
  background: transparent;
  color: var(--text);
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

/* 방송 일정 */
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

  /* 메뉴 목록은 가로로 늘어놔요 */
  .site-nav {
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
}
```
:::

## 🧯 자주 막히는 곳

여기에 없는 증상은 [문제 해결 모음](#/page/troubleshooting)에서 찾아보세요.

### 색이 모두 사라졌어요 (var 이름 오타, :root 문제)

**원인:** `var(--이름)`에 쓴 이름이 `:root`에 정의한 이름과 다르거나, `:root` 블록의 중괄호 `{ }`가 짝이 맞지 않아요. 예를 들어 `var(--acent)`처럼 오타가 있으면 그 속성은 값이 없는 것으로 처리되어 그 색만 사라져요. 이름은 대소문자까지 같아야 해요.

**해결:**

1. 색이 사라진 곳의 규칙에서 `var(--…)` 이름을 찾아, `:root`의 이름과 한 글자씩 비교해요(`accent` / `acent`).
2. `:root {`로 시작해서 `}`로 끝나는지, 중간에 `;`가 빠진 줄이 없는지 확인해요.
3. 브라우저에서 `F12` → **Elements** → 색이 사라진 요소를 선택하고 오른쪽 **Styles** 창을 봐요. 오타가 있는 줄은 줄이 그어지거나 경고 표시가 붙을 수 있어요(표시는 버전에 따라 달라요).
4. 고치고 저장해서 색이 돌아오면 해결이에요.

### Pages 설정에 공개 저장소로 바꾸라고 나와요 (또는 Pages 메뉴가 없어요)

**원인:** GitHub 무료 계정에서는 **공개(Public) 저장소**에서만 Pages를 쓸 수 있어요. 저장소가 비공개(Private)면 Pages를 켤 수 없다고 안내하거나 메뉴가 없어요.

**해결:**

1. 저장소 **Settings**를 열고 맨 아래로 내려가 **Danger Zone**(위험 구역)을 찾아요(화면 이름은 버전에 따라 달라요).
2. **Change repository visibility**(저장소 공개 범위 변경)를 눌러 **Make public**(공개로 바꾸기)을 골라요. 저장소 이름을 입력해 확인하라고 하면 입력해요.
3. 다시 **Settings → Pages**로 가서 7단계를 해요. 설정이 보이면 해결이에요.

### 주소를 열었더니 404 There isn't a GitHub Pages site here.

```text
404
There isn't a GitHub Pages site here.
```

**원인:** 아직 배포가 끝나지 않았거나(처음에는 최대 10분), Pages 설정이 저장되지 않았거나, 저장소 맨 위에 `index.html`이 없어요. 영어 문장은 "여기에는 GitHub Pages 사이트가 없어요"라는 뜻이에요.

**해결:**

1. 10분쯤 기다렸다가 `Ctrl + F5`로 새로 고침해요.
2. **Settings → Pages**에서 **Branch**가 `main`, 폴더가 `/ (root)`로 저장되어 있는지 확인해요.
3. 저장소 파일 목록 맨 위에 `index.html`이 바로 보이는지 확인해요. `my-creator-site` 폴더가 한 겹 더 들어가 있으면 폴더 구조가 잘못 올라간 거예요(Day 7 확인).
4. 주소 철자(`github.io`, 내 아이디, 저장소 이름)를 확인해요. 열리면 해결이에요.

### 인터넷 주소에서만 그림이 깨져요

**원인:** 서버는 대소문자를 구분해요. 내 컴퓨터에서는 `Profile.svg`도 열리지만, 서버에서는 `profile.svg`와 다른 파일이에요.

**해결:**

1. 깨진 그림을 오른쪽 클릭 → **이미지 주소 복사**로 주소를 보면 파일 이름이 보여요. 또는 `F12`의 **Network** 탭에서 빨간 줄(404)을 찾아요.
2. VS Code 탐색기에서 파일 이름과 HTML의 `src`를 소문자로 맞춰요.
3. 커밋·푸시하고 몇 분 뒤 새로 고침해서 그림이 보이면 해결이에요.

### 인터넷 주소에서만 CSS가 안 먹어요

**원인:** `href="/css/style.css"`처럼 맨 앞에 `/`가 붙어 있어요. 배포 주소는 `…github.io/my-creator-site/`라서 `/`로 시작하면 `my-creator-site/`가 빠져요(과제 3).

**해결:**

1. 다섯 페이지의 `<link rel="stylesheet" href="css/style.css">`에서 `href` 값이 `css/style.css`로 시작하는지 확인해요(앞에 `/`가 없어야 해요).
2. 고치고 커밋·푸시한 뒤 새로 고침해서 스타일이 적용되면 해결이에요.

### 고쳤는데 인터넷 주소는 그대로예요

**원인:** 고친 파일을 푸시하지 않았거나, Pages가 새로 반영하는 데 시간이 걸리거나(최대 10분), 브라우저가 옛 파일을 기억해요(캐시).

**해결:**

1. VS Code 소스 제어 패널에서 변경 목록이 비어 있는지 확인해요. 변경이 남아 있으면 커밋·푸시해요.
2. 저장소 **Actions** 탭에서 `pages build and deployment`가 끝났는지 봐요.
3. 브라우저에서 `Ctrl + F5`로 새로 고침해요. 바뀌면 해결이에요.

## 📝 오늘의 체크리스트

- [ ] `style.css`의 `:root` 밖에 `#`으로 시작하는 색 코드가 하나도 없어요.
- [ ] 화면 색이 어제와 똑같아요(변수로 바꿨을 뿐이에요).
- [ ] 메뉴에 마우스를 올리면 연한 배경이 생기고, 버튼과 카드는 살짝 떠올라요.
- [ ] 저장소 **Settings → Pages**에서 `main`, `/ (root)`로 배포되어 있어요.
- [ ] `https://<내 아이디>.github.io/my-creator-site/`에서 다섯 페이지와 그림이 모두 열려요.
- [ ] 내 휴대폰에서 같은 주소가 모바일 모양으로 보여요.
- [ ] 과제 1~3을 풀고 정답과 비교했어요.
- [ ] GitHub 저장소에 `Day 14: CSS 변수, 호버 효과` 커밋이 보여요.

## 📚 더 알아보기

- [MDN · CSS 사용자 지정 속성(변수) 사용하기](https://developer.mozilla.org/ko/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties): `--이름`과 `var()`의 쓰임을 설명해요.
- [MDN · CSS 트랜지션 사용하기](https://developer.mozilla.org/ko/docs/Web/CSS/Guides/Transitions/Using): `transition`의 속성, 시간, 효과를 예제로 보여 줘요.
- [GitHub Docs · GitHub Pages 사이트 만들기 (영어 문서)](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site): Pages를 켜는 순서와 반영 시간을 설명해요.

➡️ **다음 Day 예고:** [Day 15 · JavaScript 시작](#/day/p1-d15)에서는 처음으로 JavaScript 파일을 만들어 웹페이지에 연결하고, 개발자 도구 콘솔에서 코드를 실행해 봐요.
