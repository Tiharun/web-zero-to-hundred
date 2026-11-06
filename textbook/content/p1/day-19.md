## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- 영상 한 편의 정보를 객체 `{ id, title, category, youtubeId, date }`로 묶고, 점(`video.title`)과 대괄호(`categoryNames[video.category]`)로 값을 꺼낼 수 있어요.
- 객체 6개가 든 배열(영상 데이터)을 `js\contents.js`에 만들 수 있어요.
- `forEach`, `map`, `filter`가 각각 무슨 일을 하는지 콘솔에서 확인할 수 있어요.
- 영상 페이지의 콘솔에서 데이터를 직접 살펴볼 수 있어요.

**예상 시간: 100분** (개념 이해 22분 · 따라하기 47분 · 과제 26분 · 정리 5분)

:::path 📂 시작 상태
어제(Day 18)까지 만든 파일이 이렇게 있어야 해요. 없거나 다르면 [Day 18](#/day/p1-d18)과 이전 Day의 "오늘 끝 상태 전체 코드"로 맞춰 주세요.

- `C:\dev\my-creator-site\index.html`, `about.html`, `contents.html`, `schedule.html`, `contact.html` (모두 `<head>`에 `<script src="js/main.js" defer></script>`가 있어요)
- `C:\dev\my-creator-site\css\style.css`, `js\main.js`(인사말 코드)
- `C:\dev\my-creator-site\images\` 안에 `profile.svg`, `logo.svg`, `thumb-game.svg`, `thumb-talk.svg`, `thumb-music.svg`
- `contents.html`에는 Day 12 과제로 만든 카드 3장이 손으로 쓰여 있어요.
- GitHub Pages가 켜져 있어요: `https://<내 아이디>.github.io/my-creator-site/`
- VS Code에서 `C:\dev\my-creator-site` 폴더가 열려 있고, Live Preview 확장 프로그램이 설치되어 있어요.
- 어제까지의 프로젝트 변경은 모두 커밋·푸시했어요(소스 제어 패널의 변경 0개).
:::

## 📖 개념 이해

### 정보 한 덩어리를 담는 상자: 객체

**비유:** 명함을 떠올려 보세요. 한 장에 이름, 전화번호, 이메일이 항목 이름표와 함께 적혀 있어요. "이름: 달빛곰, 전화: …"처럼 **이름표와 값이 짝**으로 들어 있는 한 덩어리예요.

영상 한 편에도 여러 정보가 있어요. 제목, 종류(게임·토크·음악), 영상 번호, 날짜…. 배열은 값이 번호 순서로만 들어 있어서 "3번째가 날짜"를 외워야 해요. 이럴 때 **객체**를 써요.

**정확한 정의:** **[[객체]]**(object)는 이름(키)과 값을 짝지어 여러 정보를 한 덩어리로 담는 자료형이에요. 중괄호 `{ }` 안에 `키: 값`을 쉼표로 이어 적어요.

```js
const video = {
  id: 'v001',
  title: '기타로 연주하는 신청곡',
  category: 'music',
  youtubeId: 'aqz-KE-bpKQ',
  date: '2026-10-27',
};
```

값을 찾는 이름을 **[[키]]**(key)라고 해요. 값을 꺼내는 방법이 두 가지예요.

- 점 표기: `video.title` → `'기타로 연주하는 신청곡'`. 키 이름을 코드에 직접 쓸 때 써요.
- 대괄호 표기: `video['title']`, 또는 키가 변수에 들어 있을 때 `categoryNames[video.category]`. 대괄호 안에는 키 이름 글자(또는 그 글자가 든 변수)를 넣어요.

예를 들어 아래처럼 카테고리 코드를 화면에 보일 이름으로 바꿔 줄 때 대괄호가 필요해요.

```js
const categoryNames = { game: '게임', talk: '토크', music: '음악' };
categoryNames[video.category]; // video.category가 'music'이므로 '음악'
```

영상이 여러 편이면 객체를 배열에 넣어요. **객체 배열**은 "한 줄이 영상 하나인 표"와 같아요.

```text
id    title            category
v001  기타로 연주하는…  music
v002  신작 공포 게임…   game
v003  구독자 1000명…    talk
```

오늘부터 이 사이트의 영상 데이터는 항상 `{ id, title, category, youtubeId, date }` 모양이에요. `category`는 `game`, `talk`, `music` 중 하나예요. 이름(`youtubeId`의 대문자 `I` 등)은 글자 하나도 바꾸면 안 돼요. 뒤 Day의 코드가 이 이름으로 값을 찾기 때문이에요.

:::info 실무에서는
이런 "객체 목록"은 나중에 서버에서 JSON 파일로 받아 오는 데이터와 똑같은 모양이에요(Day 25). 오늘은 `contents.js` 안에 손으로 적어 두고, Day 25에서 별도 파일(`data\videos.json`)로 옮겨요. 영상 ID(`youtubeId`)는 **예시 값**이에요. 내 영상으로 바꾸려면 내 YouTube 영상 주소 `watch?v=` 뒤의 11글자로 바꿔요.
:::

### 객체에 달린 함수: 메서드

**[[메서드]]**(method)는 객체에 딸린 함수예요. 값 뒤에 점과 메서드 이름, 괄호를 붙여 불러요. 이미 써 봤어요. `console.log()`는 `console` 객체의 `log` 메서드이고, `days.push('일')`은 배열의 `push` 메서드예요. 어제 배운 함수가 객체에 매달려 있는 것뿐이에요.

### 배열을 다루는 세 가지 도구

배열은 값을 하나씩 처리하는 도구(메서드)를 기본으로 갖고 있어요. 이 도구들은 **다른 함수**를 받아서 값마다 불러 줘요. 이렇게 넘기는 함수를 **[[콜백 함수]]**(callback)라고 해요. 어제 맛본 "함수를 값처럼 넘기기"예요.

```js
videos.forEach((video) => {
  console.log(video.title);
});
```

`(video) => { … }`가 콜백이에요. `forEach`가 영상마다 한 번씩 이 함수를 불러 주면서 영상 하나를 `video`에 넣어 줘요. 이렇게 배열이 기본으로 갖고 있는 `forEach`, `map`, `filter` 같은 메서드를 통틀어 **[[배열 메서드]]**(array methods)라고 불러요.

| 메서드 | 하는 일 | 돌려주는 것 |
|---|---|---|
| `forEach` | 값마다 콜백 실행 | 없음(`undefined`) |
| `map` | 값마다 콜백 실행, 결과로 새 배열 | 바뀐 값의 새 배열 |
| `filter` | 콜백이 `true`를 돌려준 값만 모아 | 걸러진 새 배열 |

중요한 점은 `map`과 `filter`는 **원래 배열을 바꾸지 않고** 새 배열을 돌려준다는 거예요. 그래서 결과를 쓰려면 변수에 받아야 해요(`const gameVideos = allVideos.filter(…)`).

`for...of`로도 같은 일을 할 수 있는데, `forEach`는 "콜백을 넘긴다"는 점이 달라요. 이 사이트는 앞으로 콜백 방식(화살표 함수)을 일관되게 써요.

## 🛠️ 따라하기

모두 8단계예요. 결과는 영상 페이지(`contents.html`)의 개발자 도구 **Console**로 확인해요. 개발자 도구는 Edge나 Chrome에서 연 페이지에서 열어요. 파일 탐색기에서 `contents.html`을 더블클릭하거나, Live Preview 미리 보기 창 위쪽의 주소를 복사해 Edge나 Chrome 주소창에 붙여 넣어요.

### 1단계 · contents.js 만들고 카테고리 객체 쓰기 (8분)

영상 페이지에서만 쓰는 JavaScript 파일을 만들어요. 카테고리 코드를 화면에 보일 이름과 그림 파일로 바꿔 주는 객체 두 개부터 써요.

**어디서:** VS Code, 왼쪽 **탐색기**의 `js` 폴더

**무엇을:**

1. 탐색기에서 `js` 폴더를 오른쪽 클릭 → **새 파일**을 클릭하고 이름 `contents.js`를 입력한 뒤 `Enter`를 눌러요.
2. 열린 빈 파일에 아래 코드를 붙여 넣고 `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\js\contents.js
```js
// ==========================================================
// contents.js - 영상 목록 페이지
// 지금은 영상 데이터를 만들고 콘솔에서 살펴봐요
// ==========================================================

// 카테고리 코드 → 화면에 보여 줄 이름, 썸네일 그림 (Day 19: 객체)
const categoryNames = { game: '게임', talk: '토크', music: '음악' };
const thumbnails = {
  game: 'images/thumb-game.svg',
  talk: 'images/thumb-talk.svg',
  music: 'images/thumb-music.svg',
};
```

- `categoryNames`: `game` → `'게임'`처럼 코드를 화면 글자로 바꿔요.
- `thumbnails`: 카테고리마다 쓸 썸네일 그림 경로예요(Day 12에서 만든 SVG 3개).

:::success
탐색기의 `js` 폴더에 `main.js`와 `contents.js` 두 파일이 보여요. 파일 이름이 `contents.js`(`.js.js`나 `.txt`가 붙지 않았어요)인지 확인해요. 아직 어디에도 연결하지 않아서 화면은 그대로예요.
:::

### 2단계 · 영상 데이터 6개 쓰기 (8분)

영상 6편을 객체로 적어 배열에 담아요. 객체는 한 줄에 하나, 줄 끝에 쉼표를 붙여요.

**어디서:** VS Code, `C:\dev\my-creator-site\js\contents.js`, 1단계 코드 아래

**무엇을:**

1. 1단계 코드 아래에 빈 줄을 하나 넣어요.
2. 아래 코드를 붙여 넣고 `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\js\contents.js (일부)
```js
// 지금 상태: 전체 영상
let allVideos = [
  { id: 'v001', title: '기타로 연주하는 신청곡', category: 'music', youtubeId: 'aqz-KE-bpKQ', date: '2026-10-27' },
  { id: 'v002', title: '신작 공포 게임 첫 도전', category: 'game', youtubeId: 'eRsGyueVLvQ', date: '2026-10-25' },
  { id: 'v003', title: '구독자 1000명 기념 Q&A', category: 'talk', youtubeId: 'R6MlUcmOul8', date: '2026-10-20' },
  { id: 'v004', title: '친구들과 협동 퍼즐 도전', category: 'game', youtubeId: 'Y-rmzh0PI3c', date: '2026-10-18' },
  { id: 'v005', title: '비 오는 날 플레이리스트', category: 'music', youtubeId: 'TLkA0RELQ1g', date: '2026-10-11' },
  { id: 'v006', title: '요즘 빠진 취미 이야기', category: 'talk', youtubeId: 'WhWc3b3KhnY', date: '2026-10-06' },
];
```

값은 위 그대로 적어요. 글자 내용(제목)을 내 영상 제목으로 바꿔도 되지만, **키 이름**(`id`, `title`, `category`, `youtubeId`, `date`)은 그대로 둬요. `youtubeId`는 예시 값이에요.

`let allVideos`라고 `let`을 쓴 이유는 Day 25에서 이 배열을 서버에서 받은 데이터로 **바꿔 끼울** 거라서예요.

:::success
파일에 `let allVideos = [` 로 시작해서 `];`로 끝나는 블록이 있고, 그 안에 `{ id: 'v001', … }`부터 `{ id: 'v006', … }`까지 객체 6줄이 있어요. 각 줄 끝에 쉼표가 있어요. VS Code 편집기에 빨간 물결 줄이 없어야 해요.
:::

### 3단계 · contents.html에 연결하기 (4분)

영상 페이지에만 `contents.js`를 연결해요. 다른 페이지는 이 파일이 필요 없어요.

**어디서:** VS Code, `C:\dev\my-creator-site\contents.html`, `<head>` 안

**무엇을:**

1. `<script src="js/main.js" defer></script>` 줄을 찾아요.
2. 그 줄 **바로 아래**에 `<script src="js/contents.js" defer></script>` 한 줄을 넣어요. 아래는 `<head>` 전체 모습이에요.
3. `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\contents.html (일부)
```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>영상 모아보기 - 달빛곰 방송국</title>
  <link rel="stylesheet" href="css/style.css">
  <script src="js/main.js" defer></script>
  <script src="js/contents.js" defer></script>
</head>
```

`contents.js`는 `main.js` 다음에 불러와요. `defer`가 붙은 스크립트는 적힌 순서대로 실행돼요.

:::success
`contents.html`의 `<head>`에 `script`가 두 줄(`main.js`, `contents.js`) 있어요. 영상 페이지를 열어도 화면은 아직 그대로(손으로 쓴 카드 3장)예요.
:::

### 4단계 · forEach로 콘솔에 목록 찍기 (6분)

영상 6편을 `forEach`로 하나씩 꺼내 콘솔에 출력해요. 템플릿 리터럴과 대괄호 표기를 같이 써요.

**어디서:** VS Code, `C:\dev\my-creator-site\js\contents.js`, 파일 맨 아래

**무엇을:**

1. `];` 아래에 빈 줄을 하나 넣고 아래 코드를 붙여 넣어요.
2. `Ctrl + S`로 저장해요.
3. 브라우저에서 `contents.html`을 열고 `F12` → **Console**을 열어요. `F5`로 새로 고침해요.

📄 C:\dev\my-creator-site\js\contents.js (일부)
```js
// 확인용 (Day 20에서 지워요)
allVideos.forEach((video) => {
  console.log(`${categoryNames[video.category]} · ${video.title}`);
});
```

예상 출력(콘솔):

```text
음악 · 기타로 연주하는 신청곡
게임 · 신작 공포 게임 첫 도전
토크 · 구독자 1000명 기념 Q&A
게임 · 친구들과 협동 퍼즐 도전
음악 · 비 오는 날 플레이리스트
토크 · 요즘 빠진 취미 이야기
```

:::success
콘솔에 `음악 · 기타로 연주하는 신청곡`부터 `토크 · 요즘 빠진 취미 이야기`까지 6줄이 나와요. 카테고리가 `music`이 아니라 `음악`으로 바뀐 것은 `categoryNames[video.category]`가 한 일이에요. 줄 오른쪽에 `contents.js:` 줄 번호가 보여요. 아무것도 안 나오면 아래 🧯의 "영상 페이지 콘솔에 아무것도 안 나와요"를, 빨간 오류가 나오면 오류 문장을 읽어요.
:::

### 5단계 · filter와 map 써 보기 (8분)

게임 영상만 걸러서 개수를 세고, 제목만 모은 새 배열을 만들어요.

**어디서:** VS Code, `C:\dev\my-creator-site\js\contents.js`, 파일 맨 아래

**무엇을:**

1. 4단계 코드 아래에 빈 줄을 하나 넣고 아래 코드를 붙여 넣어요.
2. 저장하고 브라우저에서 `F5`를 눌러요.

📄 C:\dev\my-creator-site\js\contents.js (일부)
```js
const gameVideos = allVideos.filter((video) => video.category === 'game');
console.log('게임 영상 개수:', gameVideos.length);

const titles = allVideos.map((video) => video.title);
console.log('제목 목록:', titles);
```

- `filter`의 콜백 `(video) => video.category === 'game'`는 게임이면 `true`를 돌려줘요. `true`인 영상만 새 배열 `gameVideos`에 모여요.
- `map`의 콜백 `(video) => video.title`은 영상마다 제목을 돌려줘요. 제목들로 이뤄진 새 배열이 `titles`예요.
- 화살표 함수가 한 줄이면 `return`을 안 써도 식의 값이 돌아와요(어제 배운 모양이에요).

예상 출력(콘솔의 이어지는 두 줄):

```text
게임 영상 개수: 2
제목 목록: (6) ['기타로 연주하는 신청곡', '신작 공포 게임 첫 도전', '구독자 1000명 기념 Q&A', '친구들과 협동 퍼즐 도전', '비 오는 날 플레이리스트', '요즘 빠진 취미 이야기']
```

:::success
`게임 영상 개수: 2`와 `제목 목록:` 다음에 6개의 제목이 든 배열이 나와요(`(6)` 다음에 `['기타로 연주하는 신청곡', …]`. 화면 폭에 따라 뒤쪽이 `…`로 줄어 보일 수 있고, 앞의 `▶`를 누르면 펼쳐져요). 그리고 `allVideos` 원본은 여전히 6개예요.
:::

### 6단계 · 콘솔에서 데이터 직접 살펴보기 (6분)

`contents.js`의 최상위에서 `let`·`const`로 만든 변수(`allVideos`, `categoryNames` 등)는 콘솔에서도 이름으로 쓸 수 있어요. 데이터를 직접 눌러 보며 익혀요.

**어디서:** `contents.html`의 개발자 도구 **Console**, 맨 아래 입력 칸(`>`)

**무엇을:** 표의 **입력**을 한 줄씩 입력하고 `Enter`를 눌러요.

| 입력 | 결과 |
|---|---|
| `allVideos.length` | `6` |
| `allVideos[0].title` | `'기타로 연주하는 신청곡'` |
| `allVideos[0]['title']` | `'기타로 연주하는 신청곡'` |
| `categoryNames[allVideos[0].category]` | `'음악'` |
| `allVideos[0].date` | `'2026-10-27'` |
| `allVideos.map((video) => video.id)` | `(6) ['v001', 'v002', 'v003', 'v004', 'v005', 'v006']` |

:::success
표의 결과와 같은 값이 나와요. 점 표기(`.title`)와 대괄호 표기(`['title']`)가 같은 값을 준다는 걸 확인할 수 있어요. `allVideos[0]`만 입력하면 객체 전체가 `{id: 'v001', title: '…', …}` 모양으로 보이고, 앞의 `▶`를 누르면 키와 값이 펼쳐져요.
:::

### 7단계 · 다른 페이지에는 영상 줄이 없는지 확인하기 (2분)

**어디서:** Edge 또는 Chrome, 개발자 도구 **Console**

**무엇을:** 메뉴로 홈, 소개, 방송 일정, 문의 페이지를 차례로 열어 콘솔을 봐요.

:::success
네 페이지 모두 콘솔이 비어 있고 빨간 오류가 없어요. `contents.js`를 영상 페이지에만 연결했으니까요. 영상 페이지의 화면은 손으로 쓴 카드 3장 그대로예요(내일 JavaScript가 그린 카드 6장으로 바뀌어요).
:::

### 8단계 · 오늘 작업 커밋·푸시 (5분)

오늘 바뀐 파일을 Git에 기록하고(커밋) GitHub로 올려요(푸시). 매일 마지막에 하는 습관이에요. Day 7·8에서 한 것과 똑같아요.

**어디서:** VS Code, `C:\dev\my-creator-site` 폴더가 열린 창. 왼쪽 세로 막대의 가지 모양 아이콘(**소스 제어**, `Ctrl + Shift + G`)

**무엇을 (방법 A, 소스 제어 패널):**

1. 위쪽 **메시지** 칸을 클릭하고 `Day 19: 영상 데이터 객체 배열과 배열 메서드`를 입력해요.
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
git commit -m "Day 19: 영상 데이터 객체 배열과 배열 메서드"
```

예상 출력(`a1b2c3d` 같은 해시와 숫자는 달라도 돼요):

```text
[main a1b2c3d] Day 19: 영상 데이터 객체 배열과 배열 메서드
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
브라우저에서 `https://github.com/<내 아이디>/my-creator-site`를 열고 새로 고침(`F5`)하면, 파일 목록 위에 방금 쓴 커밋 메시지 `Day 19: 영상 데이터 객체 배열과 배열 메서드`가 보여요. VS Code 소스 제어 패널의 변경 목록은 비어 있어요.
:::

## ✍️ 과제

과제는 영상 페이지 콘솔에서 해요. 파일은 바꾸지 않아요(내일 `contents.js`의 확인용 코드를 지울 때 방해되지 않게 하려는 거예요).

### 과제 1 · 음악 영상 개수 (쉬움 ⭐, 6분)

`filter`로 `music`인 영상만 골라서 개수를 출력해요.

- 콘솔에 `allVideos.filter(…)`를 입력하고 뒤에 `.length`를 붙여요.
- 조건은 `video.category === 'music'`이에요.

힌트: 게임 영상 개수를 센 5단계와 같은 모양이에요.

### 과제 2 · 제목과 날짜 (보통 ⭐⭐, 10분)

`map`으로 `제목 (날짜)` 모양의 글자 6개를 모은 배열을 만들어요.

- 한 개는 `` `${video.title} (${video.date})` `` 모양이에요.
- 콘솔에 입력해서 6개의 결과를 확인해요.

힌트: 템플릿 리터럴(Day 16)을 `map`의 콜백에서 돌려줘요.

### 과제 3 · forEach와 for...of (도전 ⭐⭐⭐, 10분)

영상 제목 6개를 `forEach`와 `for...of`로 **각각** 출력하고, 차이를 한 줄로 적어요.

- 두 방식 모두 한 줄씩 `console.log(video.title)`을 6번 실행해요.
- 결과가 같은지 확인해요.
- `forEach`와 `for...of`의 차이를 내 말로 한 줄 적어요.

힌트: 콘솔에서 한 줄로 쓸 수 있어요. `for (const video of allVideos) { console.log(video.title); }`

## ✅ 정답

:::answer 과제 1 정답 · 음악 영상 개수
콘솔에 입력해요.

```js
allVideos.filter((video) => video.category === 'music').length
```

결과는 `2`예요(`v001` 기타로 연주하는 신청곡, `v005` 비 오는 날 플레이리스트).

**왜 이렇게 하나요?** `filter`가 조건이 참인 영상만 모아 새 배열을 돌려주고, 그 배열의 `.length`가 개수예요. 원본 `allVideos`는 그대로 6개예요.
:::

:::answer 과제 2 정답 · 제목과 날짜
콘솔에 입력해요.

```js
allVideos.map((video) => `${video.title} (${video.date})`)
```

결과는 6개의 글자예요.

```text
(6) ['기타로 연주하는 신청곡 (2026-10-27)', '신작 공포 게임 첫 도전 (2026-10-25)', '구독자 1000명 기념 Q&A (2026-10-20)', '친구들과 협동 퍼즐 도전 (2026-10-18)', '비 오는 날 플레이리스트 (2026-10-11)', '요즘 빠진 취미 이야기 (2026-10-06)']
```

**왜 이렇게 하나요?** `map`은 값마다 콜백이 돌려준 값으로 **새 배열**을 만들어요. 콜백이 템플릿 리터럴 글자를 돌려주니 글자 6개가 모인 배열이 돼요. 결과를 계속 쓰려면 `const labels = allVideos.map(…)`처럼 변수에 받아요.
:::

:::answer 과제 3 정답 · forEach와 for...of
콘솔에 한 줄씩 입력해요.

```js
allVideos.forEach((video) => { console.log(video.title); });
```

```js
for (const video of allVideos) { console.log(video.title); }
```

둘 다 제목 6줄을 같은 순서로 출력해요.

차이 한 줄: `forEach`는 **콜백 함수를 넘기는** 배열 메서드이고, `for...of`는 **반복문 문법**이에요. `forEach`의 콜백 안에서는 `return`이 반복을 끝내지 못하고 그 회차만 끝내요. 이 사이트는 앞으로 콜백 방식을 주로 써요.

**왜 이렇게 하나요?** 결과는 같지만 모양이 달라요. `forEach`, `map`, `filter`는 모두 콜백을 받는 한 가족이라서, 하나를 익히면 나머지도 같은 모양으로 읽을 수 있어요.
:::

:::answer 오늘 끝 상태 전체 코드
막혔다면 아래 파일들로 맞추고 [Day 20](#/day/p1-d20)을 시작하세요. 오늘 바뀐 파일은 `js/contents.js`(새 파일)와 `contents.html`이에요. 두 파일 모두 전체를 실었어요. 파일 하나를 통째로 바꿀 때는 VS Code에서 그 파일을 열고 `Ctrl + A`로 전체를 선택한 뒤 붙여 넣고 `Ctrl + S`로 저장해요.

```text
my-creator-site/
├─ about.html
├─ contact.html
├─ contents.html
├─ index.html
├─ schedule.html
├─ css/
│  └─ style.css
├─ images/
│  ├─ logo.svg
│  ├─ profile.svg
│  ├─ thumb-game.svg
│  ├─ thumb-music.svg
│  └─ thumb-talk.svg
└─ js/
   ├─ contents.js
   └─ main.js
```

📄 C:\dev\my-creator-site\js\contents.js
```js
// ==========================================================
// contents.js - 영상 목록 페이지
// 지금은 영상 데이터를 만들고 콘솔에서 살펴봐요
// ==========================================================

// 카테고리 코드 → 화면에 보여 줄 이름, 썸네일 그림 (Day 19: 객체)
const categoryNames = { game: '게임', talk: '토크', music: '음악' };
const thumbnails = {
  game: 'images/thumb-game.svg',
  talk: 'images/thumb-talk.svg',
  music: 'images/thumb-music.svg',
};

// 지금 상태: 전체 영상
let allVideos = [
  { id: 'v001', title: '기타로 연주하는 신청곡', category: 'music', youtubeId: 'aqz-KE-bpKQ', date: '2026-10-27' },
  { id: 'v002', title: '신작 공포 게임 첫 도전', category: 'game', youtubeId: 'eRsGyueVLvQ', date: '2026-10-25' },
  { id: 'v003', title: '구독자 1000명 기념 Q&A', category: 'talk', youtubeId: 'R6MlUcmOul8', date: '2026-10-20' },
  { id: 'v004', title: '친구들과 협동 퍼즐 도전', category: 'game', youtubeId: 'Y-rmzh0PI3c', date: '2026-10-18' },
  { id: 'v005', title: '비 오는 날 플레이리스트', category: 'music', youtubeId: 'TLkA0RELQ1g', date: '2026-10-11' },
  { id: 'v006', title: '요즘 빠진 취미 이야기', category: 'talk', youtubeId: 'WhWc3b3KhnY', date: '2026-10-06' },
];

// 확인용 (Day 20에서 지워요)
allVideos.forEach((video) => {
  console.log(`${categoryNames[video.category]} · ${video.title}`);
});

const gameVideos = allVideos.filter((video) => video.category === 'game');
console.log('게임 영상 개수:', gameVideos.length);

const titles = allVideos.map((video) => video.title);
console.log('제목 목록:', titles);
```

📄 C:\dev\my-creator-site\contents.html
```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>영상 모아보기 - 달빛곰 방송국</title>
  <link rel="stylesheet" href="css/style.css">
  <script src="js/main.js" defer></script>
  <script src="js/contents.js" defer></script>
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a class="logo" href="index.html">
        <img src="images/logo.svg" alt="" width="36" height="36">
        <span>달빛곰 방송국</span>
      </a>
      <nav class="site-nav">
        <ul class="menu-list">
          <li><a href="index.html">홈</a></li>
          <li><a href="about.html">소개</a></li>
          <li><a href="contents.html" aria-current="page">영상</a></li>
          <li><a href="schedule.html">방송 일정</a></li>
          <li><a href="contact.html">문의</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main class="container">
    <h1>영상 모아보기</h1>
    <p>지난 방송 영상을 모아 두는 페이지예요.</p>

    <div class="card-grid">
      <article class="card">
        <img src="images/thumb-music.svg" alt="음악 영상 썸네일" width="320" height="180">
        <div class="card-body">
          <h3>기타로 연주하는 신청곡</h3>
          <p>2026-10-27</p>
        </div>
      </article>
      <article class="card">
        <img src="images/thumb-game.svg" alt="게임 영상 썸네일" width="320" height="180">
        <div class="card-body">
          <h3>신작 공포 게임 첫 도전</h3>
          <p>2026-10-25</p>
        </div>
      </article>
      <article class="card">
        <img src="images/thumb-talk.svg" alt="토크 영상 썸네일" width="320" height="180">
        <div class="card-body">
          <h3>구독자 1000명 기념 Q&A</h3>
          <p>2026-10-20</p>
        </div>
      </article>
    </div>
  </main>

  <footer class="site-footer">
    <div class="container">
      <p>&copy; 2026 달빛곰 방송국 · 연습용으로 만든 사이트예요.</p>
    </div>
  </footer>
</body>
</html>
```
:::

## 🧯 자주 막히는 곳

여기에 없는 증상은 [문제 해결 모음](#/page/troubleshooting)에서 찾아보세요.

### Uncaught SyntaxError: Unexpected token '{' (객체 사이 쉼표)

```text
Uncaught SyntaxError: Unexpected token '{'
```

**원인:** 배열 안의 객체 사이에 쉼표(`,`)를 빠뜨렸어요. `{ … }` 다음에 쉼표 없이 바로 다음 `{`가 오면 JavaScript는 "여기 `{`가 왜 와요?" 하고 멈춰요. 오류 줄은 쉼표가 빠진 줄의 **다음 줄**을 가리킬 수 있어요.

**해결:**

1. 오류 줄 오른쪽 `contents.js:` 링크를 눌러 줄을 열고, 바로 위 줄 끝에 쉼표가 있는지 봐요.
2. 객체 6줄이 모두 `},`로 끝나는지 확인해요(마지막 줄은 쉼표가 없어도 있어도 돼요).
3. 저장하고 새로 고침해서 오류가 사라지면 해결이에요.

### Cannot read properties of undefined (reading 'category')

```text
Uncaught TypeError: Cannot read properties of undefined (reading 'category')
```

**원인:** 점 표기를 이어서 `categoryNames.video.category`처럼 썼어요. `categoryNames.video`는 `categoryNames` 객체에 `video`라는 키가 있는지 찾는데, 없으니 `undefined`이고 그 `undefined`의 `category`를 읽으려다 오류가 나요. `video.category`의 **값**(`'music'`)을 키로 쓰려면 대괄호가 필요해요.

**해결:**

1. `categoryNames[video.category]`로 고쳐요(대괄호 안에 `video.category`).
2. 저장하고 새로 고침해서 `음악 · …` 줄이 나오면 해결이에요.

### map이나 filter 결과를 쓰려는데 변수가 없대요

```text
Uncaught ReferenceError: titles is not defined
```

**원인:** `allVideos.map(…)`의 결과를 `const titles = …`로 변수에 받지 않았어요. `map`은 새 배열을 돌려줄 뿐 원본을 바꾸지 않아서, 변수에 받지 않으면 결과가 사라져요.

**해결:**

1. `const titles = allVideos.map((video) => video.title);`처럼 `const 이름 =`을 앞에 붙여요.
2. 저장하고 새로 고침해서 오류가 사라지면 해결이에요.

### 게임 영상 개수가 0이에요

**원인:** `filter`의 콜백에 중괄호를 써 놓고 `return`을 빠뜨렸어요. `(video) => { video.category === 'game'; }`는 값을 돌려주지 않아서 `undefined`(거짓)가 되고, 아무것도 걸러지지 않아요.

**해결:**

1. 한 줄로 `(video) => video.category === 'game'`처럼 중괄호를 지우거나, 중괄호를 쓰면 `return video.category === 'game';`을 써요.
2. 저장하고 새로 고침해서 `게임 영상 개수: 2`가 나오면 해결이에요.

### 다른 페이지에서도 영상 줄이 나와요

**원인:** `contents.js`를 `contents.html`뿐 아니라 다른 페이지의 `<head>`에도 넣었어요. 그러면 다른 페이지 콘솔에도 영상 목록이 찍혀요. 이 파일은 영상 페이지에서만 써요.

**해결:**

1. `Ctrl + Shift + F`로 `js/contents.js`를 검색해요.
2. 결과가 `contents.html` 한 줄만 되도록 다른 페이지의 `<script src="js/contents.js" defer></script>` 줄을 지워요.
3. 저장하고 새로 고침해서 다른 페이지의 콘솔이 비면 해결이에요.

### 영상 페이지 콘솔에 아무것도 안 나와요

**원인:** `contents.js`가 연결되지 않았거나 파일 이름이 틀렸어요. 또는 콘솔 로그 수준 필터가 꺼져 있어요(Day 15).

**해결:**

1. `contents.html`의 `<head>`에 `<script src="js/contents.js" defer></script>`가 있는지, `js` 폴더 안의 파일 이름이 `contents.js`인지 확인해요.
2. `Ctrl + F5`로 새로 고침해요.
3. 콘솔 위쪽의 로그 수준(기본 수준)에서 **정보**가 켜져 있는지 확인해요. 6줄이 나오면 해결이에요.

## 📝 오늘의 체크리스트

- [ ] `js\contents.js`가 있고 `categoryNames`, `thumbnails`, `allVideos`(객체 6개)가 들어 있어요.
- [ ] `contents.html`에만 `<script src="js/contents.js" defer></script>`가 들어 있어요.
- [ ] 영상 페이지 콘솔에 `음악 · 기타로 연주하는 신청곡` 등 6줄이 나와요.
- [ ] 콘솔에 `게임 영상 개수: 2`와 제목 배열이 나와요.
- [ ] 점 표기와 대괄호 표기의 차이, `forEach`·`map`·`filter`가 각각 돌려주는 것을 말할 수 있어요.
- [ ] 다른 페이지 콘솔에는 영상 줄이 없어요. 영상 페이지 화면은 손으로 쓴 카드 3장 그대로예요.
- [ ] 과제 1~3을 풀고 정답과 비교했어요.
- [ ] GitHub 저장소에 `Day 19: 영상 데이터 객체 배열과 배열 메서드` 커밋이 보여요.

## 📚 더 알아보기

- [MDN · 객체 기초](https://developer.mozilla.org/ko/docs/Learn_web_development/Core/Scripting/Object_basics): 객체를 만들고 값을 꺼내는 방법을 설명해요.
- [MDN · 배열 메서드 forEach](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach): 값마다 콜백을 실행하는 방법을 보여 줘요.
- [MDN · 배열 메서드 filter](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/filter): 조건에 맞는 값만 모으는 방법을 보여 줘요.

➡️ **다음 Day 예고:** [Day 20 · DOM 다루기](#/day/p1-d20)에서는 이 영상 데이터로 카드를 JavaScript가 직접 만들어 화면에 붙여서, 손으로 쓴 카드 3장을 영상 6장으로 바꿔요.
