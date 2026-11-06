## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- Promise가 "나중에 도착할 값의 약속"이라는 것을 개발자 도구 콘솔에서 직접 만져 보고 설명할 수 있어요.
- `async`/`await`와 `Promise.all`로 두 요청을 동시에 보내고, 결과를 구조 분해 할당으로 받을 수 있어요.
- 타입이 붙은 `getJson<T>`로 JSON을 불러와 스트리머 카드 3장과 다가오는 방송 목록을 화면에 그릴 수 있어요.
- "불러오는 중..." 문장과 실패했을 때의 빨간 오류 문장을 만들고, 일부러 실패시켜 확인할 수 있어요.

**예상 시간: 110분** (개념 이해 15분 · 따라하기 68분 · 과제 22분 · 정리 5분)

:::path 📂 시작 상태
[Day 7](#/day/p2-d07)의 "오늘 끝 상태 전체 코드"가 있어야 해요. 없거나 다르면 그 코드로 먼저 맞춰 주세요.

- `C:\dev\streamer-hub\README.md`, `C:\dev\streamer-hub\.git\`
- `C:\dev\streamer-hub\client\.gitignore`, `C:\dev\streamer-hub\client\index.html`, `C:\dev\streamer-hub\client\package.json`, `C:\dev\streamer-hub\client\package-lock.json`, `C:\dev\streamer-hub\client\tsconfig.json`, `C:\dev\streamer-hub\client\node_modules\`, `C:\dev\streamer-hub\client\dist\`
- `C:\dev\streamer-hub\client\public\favicon.svg`
- `C:\dev\streamer-hub\client\src\main.ts`, `C:\dev\streamer-hub\client\src\style.css`, `C:\dev\streamer-hub\client\src\types.ts`
- Node.js LTS가 설치되어 있어요(`node --version`이 `v22.22.2` 이상, `v24.15` 이상, `v26` 이상 중 하나, 작성 기준 v26.13.0).
- VS Code에서 `C:\dev\streamer-hub` 폴더가 열려 있고, 터미널 위치는 `C:\dev\streamer-hub\client`예요.
- 클라이언트 개발 서버가 켜져 있으면 좋아요. 꺼져 있으면 1단계에서 켜요(`npm run dev`).
:::

## 📖 개념 이해

### Promise: 나중에 도착할 값의 약속

[P1 Day 25](#/day/p1-d25)에서 `fetch`를 쓰면서 "파일이 도착할 때까지 기다린다"를 `await`로 해결했어요. 그때 `fetch`가 돌려준 것의 정체가 Promise예요.

**비유:** 진동벨이에요. 주문하면 음식 대신 진동벨을 받아요. 벨 자체는 음식이 아니지만, 음식이 나오면 울려요. 그때 음식을 받으면 돼요. 주문이 잘못되면 "품절이에요" 하고 벨이 울릴 수도 있어요.

**정확한 정의:** **[[Promise]]**(프라미스)는 지금은 아직 없지만 나중에 도착할 값, 또는 실패했다는 소식을 담은 객체예요. 세 가지 상태가 있어요.

- 대기(pending): 아직 결과가 없어요.
- 이행(fulfilled): 성공했고 값이 도착했어요.
- 거부(rejected): 실패했어요. 이유(오류)가 도착했어요.

[[async 함수]]는 항상 Promise를 돌려줘요. 함수 안에서 `return 1`이라고 써도 바깥에서는 "1이 담긴 Promise"예요. [[await]]는 Promise가 이행될 때까지 그 줄에서 기다렸다가 값을 꺼내 주는 키워드예요. 거부되면 오류를 던지고, 그래서 [[try...catch]]로 잡아요.

### 동시에 보내기: `Promise.all`

스트리머 목록과 방송 일정을 따로 불러올 때 `await`를 두 번 쓰면 첫 번째가 끝난 다음에야 두 번째를 시작해요. 둘은 서로 필요하지 않으니 **동시에** 보내면 더 빨라요.

```ts
const streamers = await getStreamers();
const schedules = await getSchedules();
```

위는 차례대로(총 시간 = 둘의 합)이고, 아래는 동시에(총 시간 = 더 느린 쪽 하나)예요.

```ts
const [streamers, schedules] = await Promise.all([getStreamers(), getSchedules()]);
```

`Promise.all`은 Promise 배열을 받아서, 모두 이행되면 값들의 배열을 돌려주는 Promise를 만들어요. 하나라도 거부되면 전체가 거부돼요.

### 구조 분해 할당과 전개 구문

위 코드의 왼쪽 `const [streamers, schedules] = …`는 새로운 문법이에요.

- **[[구조 분해 할당]]**(destructuring assignment)은 배열이나 객체에서 값을 꺼내 여러 변수에 한 번에 나눠 담는 문법이에요. `const [a, b] = [1, 2]`는 `a`가 1, `b`가 2가 돼요.
- **[[전개 구문]]**(spread syntax)은 `...`로 배열의 칸들을 하나씩 펼쳐 놓는 문법이에요. `[...[1, 2], 3]`은 `[1, 2, 3]`이고, `list.append(...items)`는 `items`의 칸마다 `append`에 하나씩 넘겨요.

### `unknown`과 `as T`: 타입을 믿는 것과 검사하는 것

- **[[unknown]]**(언노운)은 "무엇이든 담을 수 있지만, 쓰기 전에 무엇인지 확인해야 하는 타입"이에요. `any`와 달리 확인 없이는 `error.message`처럼 쓸 수 없어요. `catch (error)`의 `error`가 `unknown`이에요. 무엇이든 던질 수 있기 때문이에요.
- `(await response.json()) as T`의 `as T`는 "이 JSON은 `T` 모양이라고 믿고 쓸게요"라는 약속이에요. 실행 중에 진짜 그 모양인지 검사하지는 않아요. 서버가 칸 이름을 `title`이 아니라 `titel`로 보내면 컴파일은 통과하고 화면에 `undefined`가 나와요. 그래서 서버와 화면의 칸 이름을 똑같이 맞추는 일이 중요해요.

`setTimeout(함수, 1000)`은 1000밀리초(1초) 뒤에 함수를 **한 번** 실행해요. [P1 Day 26](#/day/p1-d26)의 `setInterval`이 반복이라면 `setTimeout`은 한 번이에요.

:::info 실무에서는
화면이 서버에서 데이터를 받아 오는 일은 거의 모든 웹 서비스의 기본이에요. 응답을 기다리는 동안 "불러오는 중"을 보여 주고, 실패하면 이유를 알려 주는 것이 사용자 경험의 기본이에요. 오늘 만드는 `getJson` 같은 함수 하나에 모아 두면 주소와 오류 처리를 한곳에서 고칠 수 있어요.
:::

## 🛠️ 따라하기

모두 8단계예요. 오늘은 임시 JSON 파일을 서버처럼 읽어요. Day 27에서 진짜 C# 서버 주소로 바꿔요.

### 1단계 · 콘솔에서 Promise 만져 보기 (10분)

**어디서:** Chrome 또는 Edge → `http://localhost:5173` 화면 → 개발자 도구 **Console** 탭

개발 서버가 꺼져 있다면 VS Code 터미널(위치 `C:\dev\streamer-hub\client`)에서 `npm run dev`를 입력해 켜요. 켜진 터미널은 계속 쓰므로 다른 명령은 **+** 아이콘으로 연 새 터미널에서 쳐요.

**무엇을:**

1. 브라우저에서 `http://localhost:5173`을 열고 `F12`를 눌러요. 위쪽 탭에서 **Console**(한국어 화면에서는 **콘솔**)을 클릭해요.
2. 아래 줄을 한 줄씩 입력하고 `Enter`를 눌러요. 처음 붙여 넣을 때 "붙여 넣기를 허용하려면 allow pasting을 입력하세요" 같은 안내가 나오면 직접 타이핑하거나 안내대로 입력해요.

```js
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
```

아무것도 안 나오고 `undefined`가 보이면 정상이에요. `wait(ms)`는 "ms밀리초 뒤에 이행되는 Promise"를 돌려주는 함수예요.

```js
await wait(1000); console.log('1초 지났어요');
```

`Enter`를 누르고 1초 뒤에 `1초 지났어요`가 나와요.

```js
async function f() { return 1; } f()
```

`Promise {<fulfilled>: 1}` 비슷한 글자가 나와요. async 함수는 1을 돌려줘도 Promise로 감싸요.

```js
new Promise(() => {})
```

`Promise {<pending>}`이 나와요. 영원히 끝나지 않는 대기 상태예요.

3. 이번에는 차례대로와 동시에를 시간으로 비교해요.

```js
console.time('차례대로'); await wait(500); await wait(500); console.timeEnd('차례대로');
```

```js
console.time('동시에'); await Promise.all([wait(500), wait(500)]); console.timeEnd('동시에');
```

두 번째 명령까지 `Enter`를 누르면 차례대로 `차례대로: 1001.2 ms`, `동시에: 501.4 ms` 같은 줄이 나와요. 숫자는 달라도 돼요.

:::success
- `await wait(1000)` 뒤 1초 만에 `1초 지났어요`가 나왔어요.
- `차례대로`는 약 1000ms, `동시에`는 약 500ms로 절반이에요.
- 콘솔을 닫아도 돼요. 입력한 `wait`는 페이지를 새로 고치면 사라져요.
:::

### 2단계 · 임시 데이터 파일 만들기 (8분)

서버가 아직 없으니 `public\data` 폴더에 JSON 파일 두 개를 만들어 서버가 줄 데이터인 척해요. Vite는 `public` 폴더의 파일을 주소 맨 앞(`/`)에서 그대로 보여 줘요.

**어디서:** VS Code → 왼쪽 탐색기 → `client\public` 폴더

**무엇을:**

1. `public` 폴더를 클릭하고 **새 폴더** 아이콘으로 `data` 폴더를 만들어요.
2. `data` 폴더를 클릭하고 **새 파일** 아이콘으로 `streamers.json`을 만든 뒤 아래 내용을 붙여 넣고 저장해요.

📄 C:\dev\streamer-hub\client\public\data\streamers.json
```json
[
  {
    "id": 1,
    "name": "달빛곰",
    "platform": "chzzk",
    "channelUrl": "https://example.com/moonbear",
    "bio": "밤마다 느긋하게 게임하는 곰이에요. 채팅 환영!",
    "avatarUrl": null,
    "createdAt": "2026-11-01T00:00:00Z"
  },
  {
    "id": 2,
    "name": "픽셀토끼",
    "platform": "youtube",
    "channelUrl": "https://example.com/pixelrabbit",
    "bio": "도트 그림을 그리면서 이야기 나누는 토끼예요.",
    "avatarUrl": null,
    "createdAt": "2026-11-01T00:00:00Z"
  },
  {
    "id": 3,
    "name": "노을고양이",
    "platform": "soop",
    "channelUrl": "https://example.com/sunsetcat",
    "bio": "노래와 수다를 좋아하는 고양이예요.",
    "avatarUrl": null,
    "createdAt": "2026-11-01T00:00:00Z"
  }
]
```

3. 같은 폴더에 `schedules.json`을 만들고 저장해요. 시각 끝의 `Z`는 UTC(세계 표준시)라는 표시예요. 한국 시간으로 바꾸는 건 Day 29에서 배워요.

📄 C:\dev\streamer-hub\client\public\data\schedules.json
```json
[
  {
    "id": 1,
    "streamerId": 1,
    "streamerName": "달빛곰",
    "title": "저녁 게임 방송",
    "startsAt": "2026-11-02T11:00:00Z",
    "durationMinutes": 120
  },
  {
    "id": 2,
    "streamerId": 2,
    "streamerName": "픽셀토끼",
    "title": "점심 그림 방송",
    "startsAt": "2026-11-03T04:00:00Z",
    "durationMinutes": 60
  },
  {
    "id": 3,
    "streamerId": 1,
    "streamerName": "달빛곰",
    "title": "시청자 참여 게임",
    "startsAt": "2026-11-04T11:00:00Z",
    "durationMinutes": 90
  },
  {
    "id": 4,
    "streamerId": 3,
    "streamerName": "노을고양이",
    "title": "노래 방송",
    "startsAt": "2026-11-05T13:00:00Z",
    "durationMinutes": 120
  }
]
```

4. 브라우저 주소 표시줄에 `http://localhost:5173/data/streamers.json`을 입력해서 열어요. `public`은 주소에 들어가지 않는다는 점을 기억해요.

:::success
브라우저에 스트리머 3명의 JSON 글자가 보여요. 주소는 `/data/streamers.json`이고 `/public/data/…`가 아니에요. JSON에 쉼표나 따옴표가 틀리면 VS Code에서 빨간 물결이 생겨요.
:::

### 3단계 · `ui.ts` 도우미 만들기 (7분)

**어디서:** VS Code → `client\src` 폴더

**무엇을:** `src` 폴더에 새 파일 `ui.ts`를 만들고 아래 내용을 붙여 넣고 저장해요.

📄 C:\dev\streamer-hub\client\src\ui.ts
```ts
// 여러 화면이 함께 쓰는 작은 도우미들

// P1에서 만든 도우미를 TypeScript로 옮겼어요. 매개변수와 돌려주는 값에 타입만 붙였어요.
// textContent로 넣어서 글자 안의 <태그>가 있어도 그냥 글자로만 보여요
export function createElementWithText(tagName: string, className: string, text: string): HTMLElement {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text;
  return element;
}

// <p role="status">에 문장을 넣어요. 화면 읽기 프로그램도 읽어 줘요
// toggle('error', isError): isError가 true면 error 클래스를 붙이고 false면 떼요
export function setStatus(element: HTMLElement, message: string, isError = false): void {
  element.textContent = message;
  element.classList.toggle('error', isError);
}

// 오류에서 사람에게 보여 줄 문장을 꺼내요 (지금은 한 가지 문장이에요)
// catch로 잡은 error는 unknown 타입이라서, 확인 없이 error.message처럼 쓸 수 없어요
export function errorMessage(error: unknown): string {
  console.error(error); // 자세한 오류는 개발자 도구 콘솔에 남겨요
  return '불러오지 못했어요. 잠시 뒤에 다시 해 주세요.';
}
```

- `createElementWithText`는 [P1 Day 20](#/day/p1-d20)에서 만든 도우미예요. 타입만 붙였어요.
- `setStatus`는 화면의 상태 문장을 바꿔요. `classList.toggle('error', isError)`는 `isError`가 `true`면 `error` 클래스를 붙이고 `false`면 떼요. `isError = false`는 기본값 매개변수예요([Day 6](#/day/p2-d06)).
- `errorMessage(error: unknown)`: 지금은 어떤 오류든 한 가지 문장을 돌려줘요. Day 27에 서버 오류에 맞춰 더 자세히 바꿔요.

:::success
빨간 밑줄이 없어요. `error` 위에 마우스를 올리면 `(parameter) error: unknown`이 보여요.
:::

### 4단계 · `api.ts`: 타입 있는 `getJson<T>` (9분)

**어디서:** VS Code → `client\src` 폴더

**무엇을:** 새 파일 `api.ts`를 만들고 아래 내용을 붙여 넣고 저장해요.

📄 C:\dev\streamer-hub\client\src\api.ts
```ts
// 서버에서 데이터를 가져오는 함수 모음이에요 (Day 8)
// 화면 코드는 fetch를 직접 쓰지 않고 이 함수들만 불러요.
import type { Schedule, Streamer } from './types.ts';

// <T>: 어떤 모양의 JSON이 올지 부르는 쪽이 알려 줘요 (제네릭, Day 6)
async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`요청이 실패했어요. (${response.status})`);
  }
  // as T: "이 JSON은 T 모양이라고 믿고 쓸게요"라는 뜻이에요. 실행 중에 검사하는 것은 아니에요
  return (await response.json()) as T;
}

// 지금은 public\data 폴더의 임시 파일을 읽어요. Day 27에 서버 주소(/api/…)로 바꿔요
export function getStreamers(): Promise<Streamer[]> {
  return getJson<Streamer[]>('/data/streamers.json');
}

export function getSchedules(): Promise<Schedule[]> {
  return getJson<Schedule[]>('/data/schedules.json');
}
```

- `import type { … } from './types.ts'`: 이 프로젝트(Vite)는 경로 끝에 `.ts`를 그대로 써요([Day 6](#/day/p2-d06)의 안내예요).
- `getJson<T>`: 주소를 받아 JSON을 읽어서 `T` 모양으로 돌려줘요. 응답이 실패(`!response.ok`)면 `throw new Error(…)`로 오류를 던져요([P1 Day 25](#/day/p1-d25)).
- `getStreamers()`와 `getSchedules()`는 `getJson`에 주소와 모양(`Streamer[]`)을 알려 줘요. 화면 코드는 앞으로 이 두 함수만 불러요.

:::success
빨간 밑줄이 없어요. `getStreamers` 위에 마우스를 올리면 `function getStreamers(): Promise<Streamer[]>`가 보여요.
:::

### 5단계 · `main.ts`: 카드와 방송 목록 그리기 (14분)

**어디서:** VS Code → `client\src\main.ts`

**무엇을:** 내용을 모두 지우고 아래 내용으로 바꾼 뒤 저장해요. 아직 스타일이 없어서 모양은 거칠어요. 다음 단계에서 CSS를 더해요.

📄 C:\dev\streamer-hub\client\src\main.ts
```ts
// 사이트의 시작점: 홈 화면에 스트리머 카드와 다가오는 방송을 그려요
import './style.css';
import { getSchedules, getStreamers } from './api.ts';
import type { Platform, Schedule, Streamer } from './types.ts';
import { createElementWithText, errorMessage, setStatus } from './ui.ts';

// Record: 플랫폼 글자마다 화면에 보여 줄 이름이 하나씩 있는 표예요 (Day 6)
const platformNames: Record<Platform, string> = {
  chzzk: '치지직',
  youtube: 'YouTube',
  soop: 'SOOP',
  other: '기타',
};

// index.html에 처음부터 있는 요소라서 반드시 있어요(!)
const app = document.querySelector<HTMLElement>('#app')!;

// 틀은 innerHTML로 한 번에 만들어요. 여기에는 우리가 쓴 고정 글자만 넣어요
app.innerHTML = `
  <section class="hero">
    <h1>스트리머 허브</h1>
    <p>좋아하는 스트리머의 방송 일정을 확인하고, 팬끼리 이야기를 나눠요.</p>
    <p class="actions">
      <a class="button" href="#/schedule">이번 주 방송 일정</a>
      <a class="button secondary" href="#/streamers">스트리머 보기</a>
    </p>
  </section>
  <p class="status" role="status">불러오는 중...</p>
  <h2>스트리머</h2>
  <ul class="card-grid" id="streamers"></ul>
  <h2>다가오는 방송</h2>
  <ul class="item-list" id="upcoming"></ul>
`;

const status = app.querySelector<HTMLElement>('.status')!;
const streamerList = app.querySelector<HTMLUListElement>('#streamers')!;
const upcomingList = app.querySelector<HTMLUListElement>('#upcoming')!;

// 스트리머 한 명 = 카드 한 장
function createStreamerCard(streamer: Streamer): HTMLLIElement {
  const card = document.createElement('li');
  card.className = 'card';
  card.append(
    createElementWithText('span', `badge ${streamer.platform}`, platformNames[streamer.platform]),
    createElementWithText('h3', '', streamer.name),
    createElementWithText('p', 'bio', streamer.bio),
  );
  return card;
}

// 방송 일정 하나 = 목록 한 줄. 시각은 일단 서버가 준 글자 그대로 보여요 (한국 시간 표시는 Day 29)
function createScheduleItem(schedule: Schedule): HTMLLIElement {
  const item = document.createElement('li');
  item.append(
    createElementWithText('strong', '', schedule.streamerName),
    ` · ${schedule.title} `,
    createElementWithText('span', 'muted', schedule.startsAt),
  );
  return item;
}

async function load(): Promise<void> {
  try {
    // 두 요청을 동시에 보내고, 둘 다 도착할 때까지 기다려요
    const [streamers, schedules] = await Promise.all([getStreamers(), getSchedules()]);

    streamerList.append(...streamers.map(createStreamerCard));
    upcomingList.append(...schedules.map(createScheduleItem));
    setStatus(status, '');
  } catch (error) {
    setStatus(status, errorMessage(error), true);
  }
}

load();
```

코드의 흐름이에요.

1. `app.innerHTML`로 틀을 만들어요. 소개 아래에 `<p class="status" role="status">불러오는 중...</p>`가 먼저 보여요.
2. `load()`는 `async` 함수예요. 안에서 `Promise.all`로 두 요청을 동시에 보내고, `const [streamers, schedules] = …`로 결과를 나눠 받아요.
3. `streamers.map(createStreamerCard)`는 스트리머마다 카드 요소 하나를 만들어요. `streamerList.append(...)`의 `...`는 전개 구문이라 요소들을 하나씩 넘겨요.
4. 성공하면 `setStatus(status, '')`로 상태 문장을 비우고, 실패하면 `catch`에서 오류 문장을 보여 줘요.
5. `append(…)`는 P1에서 쓴 `appendChild`처럼 요소를 붙이지만, 요소나 글자를 여러 개 한꺼번에 붙일 수 있어요.
6. `HTMLLIElement`는 `<li>` 요소의 타입이고 `HTMLUListElement`는 `<ul>` 요소의 타입이에요. `document.createElement('li')`가 돌려주는 값이 `HTMLLIElement`라서 함수의 반환 타입에 적어요. `querySelector<HTMLUListElement>('#streamers')`는 찾는 요소가 `<ul>`이라고 알려 주는 거예요(Day 7의 `<HTMLElement>`와 같은 방식이에요).
7. 카드의 글은 모두 `createElementWithText`(내부적으로 `textContent`)로 넣어요. 스트리머의 이름과 소개는 서버(또는 사용자)가 정한 값이라서 `innerHTML`에 넣지 않아요.

:::success
브라우저가 자동으로 바뀌어요. 큰 소개 아래에 스트리머 3명의 이름과 소개 글, 그 아래 방송 4줄이 보여요. 방송 줄 끝에 `2026-11-02T11:00:00Z` 같은 시각 글자가 그대로 보이는 것이 정상이에요. 카드 모양은 6단계에서 갖춰져요.
:::

### 6단계 · `style.css`에 상태·카드·목록 스타일 더하기 (8분)

레퍼런스와 같은 자리에 CSS 블록 두 개를 넣어요. 두 블록은 모두 `style.css`의 `/* ---------- 5. 화면별 ---------- */` 주석 **바로 위**에 붙여요. 첫 번째 블록을 먼저 붙이고, 두 번째 블록을 그 바로 아래(주석 바로 위)에 붙여요. 블록과 블록 사이, 그리고 마지막 블록과 주석 사이에는 빈 줄을 하나씩 둬요.

**어디서:** VS Code → `client\src\style.css`

**무엇을:**

1. `/* ---------- 5. 화면별 ---------- */` 줄을 찾아요(`Ctrl + F`로 `5. 화면별` 검색).
2. 그 줄 바로 위 빈 줄에 커서를 두고, 아래 첫 번째 블록(상태 문장과 배지)을 붙여 넣어요.

📄 C:\dev\streamer-hub\client\src\style.css (일부)
```css
.status:empty {
  display: none;
}

.status.error {
  color: var(--error);
  font-weight: 600;
}

.badge {
  display: inline-block;
  padding: 0 0.6rem;
  border-radius: 999px;
  background: var(--surface);
  border: 1px solid var(--border);
  font-size: 0.85rem;
}

.badge.chzzk {
  border-color: #00c73c;
}

.badge.youtube {
  border-color: #ff0033;
}

.badge.soop {
  border-color: #0545b1;
}
```

3. 이어서 두 번째 블록(목록과 카드)을 같은 방법으로 붙여 넣어요.

📄 C:\dev\streamer-hub\client\src\style.css (일부)
```css
/* 목록: 한 줄에 하나씩, 사이에 선 */
.item-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.item-list li {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.25rem 0.75rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--border);
}

/* 카드: 화면 폭에 맞춰 칸 수가 저절로 바뀌어요 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.card {
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
}

.card h2 {
  margin: 0.5rem 0 0.25rem;
  font-size: 1.15rem;
}

.bio {
  margin: 0.5rem 0 0;
}
```

4. 저장해요.

:::success
카드 3장이 격자로 나란히 서고(좁은 창에서는 줄 수가 바뀌어요), 카드 안에 플랫폼 이름 배지가 알약 모양으로 보여요. 방송 목록은 줄마다 아래에 가는 선이 생겨요. 상태 문장이 비어 있을 때는(`.status:empty`) 자리를 차지하지 않아요.
:::

### 7단계 · 불러오는 중과 오류 문장 확인하기 (8분)

잘 될 때만 확인하면 반쪽이에요. 느릴 때, 실패할 때도 화면이 친절한지 일부러 확인해요.

**어디서:** Chrome 또는 Edge → `http://localhost:5173` → 개발자 도구

**무엇을:**

1. **Network** 탭을 열고 위쪽의 **No throttling**(속도 제한 없음) 목록을 클릭해 **Slow 4G**를 골라요. 이름은 버전에 따라 조금 달라요.
2. `F5`로 새로 고침해요. 몇 초 동안 `불러오는 중...`이 보이다가 카드가 나타나요.
3. 속도 목록을 **No throttling**으로 되돌려요.
4. 이번에는 요청을 막아 봐요. Network 탭 목록에서 `streamers.json` 줄을 오른쪽 클릭하고 **Block request URL**(요청 URL 차단)을 클릭해요. 이름은 버전에 따라 조금 달라요.
5. `F5`로 새로 고침해요.

:::success
- 느린 연결에서 `불러오는 중...`이 한동안 보였어요.
- 요청을 막은 뒤에는 빨간색 `불러오지 못했어요. 잠시 뒤에 다시 해 주세요.`가 보이고 카드와 목록은 비어 있어요. 콘솔에는 `TypeError: Failed to fetch` 같은 오류가 남아요. 일부러 한 실험이니 정상이에요.
- 확인했으면 차단을 풀어요. 개발자 도구 오른쪽 위의 `⋮`(점 세 개) 메뉴에서 **More tools → Network request blocking**(도구 더보기 → 네트워크 요청 차단)을 클릭해 창을 열어요. 이름과 위치는 버전에 따라 조금 달라요. 열린 창의 목록에서 `streamers.json` 항목의 체크를 해제하거나 삭제(휴지통) 아이콘을 클릭해요. 그리고 `F5`를 눌러 카드가 다시 나오는지 확인해요.
:::

:::info Offline은 왜 안 쓰나요?
**Offline**을 고르면 개발 서버에서 페이지 자체를 받아 올 수 없어서 새로 고침이 안 돼요. 이미 열린 화면에서 다시 요청을 보낼 버튼이 아직 없으니, 오늘은 특정 요청만 막는 방법을 써요.
:::

### 8단계 · Git에 기록하고 올리기 (4분)

**어디서:** VS Code 터미널(새 터미널), 위치 `C:\dev\streamer-hub`

**무엇을:** 한 줄씩 입력해요. Day 7 과제까지 이미 올렸으니 오늘 파일만 올라가요.

```powershell
cd C:\dev\streamer-hub
```

```powershell
git add -A
```

줄바꿈 안내(`warning: in the working copy of … LF will be replaced by CRLF …`)가 나올 수 있어요. 무시해도 돼요.

```powershell
git commit -m "day08: 비동기와 임시 데이터"
```

예상 출력(숫자는 달라도 돼요):

```text
[main 3c4d5e6] day08: 비동기와 임시 데이터
 6 files changed, 150 insertions(+)
```

```powershell
git push
```

:::success
`git push`의 마지막 줄이 `main -> main`으로 끝나요. GitHub 저장소의 `client\src`에 `api.ts`, `ui.ts`가 보여요.
:::

## ✍️ 과제

### 과제 1 · `wait(ms)`를 TypeScript로 쓰기 (쉬움 ⭐, 5분)

- `client\src\ui.ts` 맨 아래에 `wait(ms: number): Promise<void>`를 만들어 `export`해요. `ms`밀리초 뒤에 이행되는 Promise를 돌려줘요.
- `main.ts`의 `./ui.ts` import에 `wait`도 더해요(`import { createElementWithText, errorMessage, setStatus, wait } from './ui.ts';`). 그다음 `load()` 맨 앞에서 `await wait(1000);`을 불러서 "불러오는 중..."이 1초 더 보이게 해 보고, 확인했으면 그 줄과 import의 `wait`를 지워요. 안 쓰는 import가 남으면 `npm run build`가 `noUnusedLocals` 오류를 내요.
- 확인: 새로 고침하면 1초 동안 `불러오는 중...`이 보인 다음 카드가 나와요.
- 힌트: `new Promise((resolve) => setTimeout(resolve, ms))`를 써요. 반환 타입은 `Promise<void>`예요.

### 과제 2 · 주소를 틀리게 해서 404 오류 문장 보기 (쉬움 ⭐, 5분)

- `api.ts`의 `'/data/streamers.json'`을 `'/data/streamer.json'`(`s`가 빠짐)으로 바꿔요.
- 화면에 오류 문장이 나오는지, 콘솔에 어떤 오류가 남는지 확인하고, 확인했으면 주소를 원래대로 되돌려요.
- 확인: 빨간 오류 문장과 콘솔의 `Error: 요청이 실패했어요. (404)` 비슷한 글자가 보여요.
- 힌트: 없는 주소를 요청하면 서버가 `404`로 응답해요. [Day 1](#/day/p2-d01)에서 본 그 번호예요. `getJson`이 `throw`하고 `main.ts`의 `catch`가 문장을 보여 줘요.

### 과제 3 · 목록이 비었을 때의 문장 (보통 ⭐⭐, 10분)

- `streamers.json`의 내용을 `[]`로 바꿔 스트리머가 0명인 경우를 만들어요.
- 이때 `아직 등록된 스트리머가 없어요.`가 목록 자리에 보이게 `main.ts`에 `if (streamers.length === 0)` 분기를 더해요.
- 확인했으면 `streamers.json`을 원래 내용으로 되돌려요.
- 확인: 빈 목록일 때 그 문장이 보이고, 원래대로 되돌리면 카드 3장이 보여요.
- 힌트: `createElementWithText('li', 'muted', '…')`로 `<li>`를 만들어 `streamerList.append(…)`해요.

### 마무리 · 과제 결과도 커밋하기 (2분)

과제로 파일을 바꿨다면 기록으로 남겨요. 그래야 Day를 마칠 때 `git status`가 깨끗해요.

**어디서:** VS Code 터미널, 위치 `C:\dev\streamer-hub`

```powershell
git add -A
```

```powershell
git commit -m "day08: 과제"
```

```powershell
git push
```

:::success
`git status`가 `nothing to commit, working tree clean`이에요. 과제에서 `streamers.json`을 비웠다가 되돌렸다면 내용이 같아서 변경으로 잡히지 않아요. 바뀐 게 없으면 `git commit`이 `nothing to commit`이라고 알려 주는데, 그것도 정상이에요.
:::

## ✅ 정답

:::answer 과제 1 정답 · wait
📄 C:\dev\streamer-hub\client\src\ui.ts (일부)
```ts

// ms밀리초 뒤에 이행되는 Promise (await로 기다릴 때 써요)
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

**왜 이렇게 하나요?** `setTimeout(resolve, ms)`는 `ms` 뒤에 `resolve`를 부르고, `resolve`가 불리면 Promise가 이행돼요. 값은 없으니 `Promise<void>`예요. 느린 서버를 흉내 낼 때 써요. `main.ts`에서 쓰려면 import 줄에 `wait`를 더해야 해요(안 더하면 `Cannot find name 'wait'` 오류가 나고, 화면에서는 try/catch가 삼켜서 오류 문장만 보여요).

```ts
import { createElementWithText, errorMessage, setStatus, wait } from './ui.ts';
```

확인한 뒤 `await wait(1000);` 줄과 import의 `wait`를 지워요. `ui.ts`의 `wait` 함수는 `export`된 함수라서 남겨 두어도 오류가 아니에요.
:::

:::answer 과제 2 정답 · 404
고쳐 본 줄이에요. 확인한 뒤에는 `'/data/streamers.json'`으로 되돌려요.

```ts
  return getJson<Streamer[]>('/data/streamer.json');
```

콘솔에는 이런 글이 남아요(줄 번호와 경로는 달라도 돼요).

```text
Error: 요청이 실패했어요. (404)
```

**왜 이렇게 하나요?** 주소가 틀려도 `fetch` 자체는 성공해요. 서버가 "없다(404)"라고 **응답**했기 때문이에요. 그래서 `response.ok`를 확인해서 직접 `throw`해야 해요. 이 확인을 빼면 404 안내 페이지를 JSON으로 읽다가 엉뚱한 오류가 나요.
:::

:::answer 과제 3 정답 · 빈 목록 문장
📄 C:\dev\streamer-hub\client\src\main.ts (일부)
```ts
    if (streamers.length === 0) {
      streamerList.append(createElementWithText('li', 'muted', '아직 등록된 스트리머가 없어요.'));
    }
```

이 블록은 `main.ts`의 `const [streamers, schedules] = …` 줄 아래, `streamerList.append(...streamers.map(createStreamerCard));` 줄 위에 있어요. 전체 모양은 아래 "오늘 끝 상태 전체 코드"에서 볼 수 있어요.

**왜 이렇게 하나요?** 데이터가 0개일 때 아무것도 안 보이면 사용자는 고장인지 비어 있는 건지 알 수 없어요. 이유를 말해 주는 문장이 사용자 경험의 기본이에요. 스트리머 목록 화면(Day 28)에서도 같은 문장을 써요.
:::

:::answer 오늘 끝 상태 전체 코드
오늘 따라하기와 과제를 모두 끝낸 상태예요(과제 1의 `wait`는 `ui.ts`에 남아 있어도 돼요). 막혔다면 아래 파일들로 맞추고 Day 9를 시작하세요. Day 9부터는 C# 연습 폴더를 써서 화면은 한동안 그대로예요.

```text
C:\dev\streamer-hub\client\
├─ public\
│  ├─ data\
│  │  ├─ schedules.json
│  │  └─ streamers.json
│  └─ favicon.svg
└─ src\
   ├─ api.ts
   ├─ main.ts
   ├─ style.css
   ├─ types.ts
   └─ ui.ts
```

`src\types.ts`, `index.html`, `tsconfig.json`, `public\favicon.svg`는 [Day 7](#/day/p2-d07)과 같아요. 오늘 바뀌거나 새로 생긴 파일은 아래에 모두 실었어요(`style.css`는 244줄이라 바뀐 블록만 실어요).

📄 C:\dev\streamer-hub\client\public\data\streamers.json
```json
[
  {
    "id": 1,
    "name": "달빛곰",
    "platform": "chzzk",
    "channelUrl": "https://example.com/moonbear",
    "bio": "밤마다 느긋하게 게임하는 곰이에요. 채팅 환영!",
    "avatarUrl": null,
    "createdAt": "2026-11-01T00:00:00Z"
  },
  {
    "id": 2,
    "name": "픽셀토끼",
    "platform": "youtube",
    "channelUrl": "https://example.com/pixelrabbit",
    "bio": "도트 그림을 그리면서 이야기 나누는 토끼예요.",
    "avatarUrl": null,
    "createdAt": "2026-11-01T00:00:00Z"
  },
  {
    "id": 3,
    "name": "노을고양이",
    "platform": "soop",
    "channelUrl": "https://example.com/sunsetcat",
    "bio": "노래와 수다를 좋아하는 고양이예요.",
    "avatarUrl": null,
    "createdAt": "2026-11-01T00:00:00Z"
  }
]
```

📄 C:\dev\streamer-hub\client\public\data\schedules.json
```json
[
  {
    "id": 1,
    "streamerId": 1,
    "streamerName": "달빛곰",
    "title": "저녁 게임 방송",
    "startsAt": "2026-11-02T11:00:00Z",
    "durationMinutes": 120
  },
  {
    "id": 2,
    "streamerId": 2,
    "streamerName": "픽셀토끼",
    "title": "점심 그림 방송",
    "startsAt": "2026-11-03T04:00:00Z",
    "durationMinutes": 60
  },
  {
    "id": 3,
    "streamerId": 1,
    "streamerName": "달빛곰",
    "title": "시청자 참여 게임",
    "startsAt": "2026-11-04T11:00:00Z",
    "durationMinutes": 90
  },
  {
    "id": 4,
    "streamerId": 3,
    "streamerName": "노을고양이",
    "title": "노래 방송",
    "startsAt": "2026-11-05T13:00:00Z",
    "durationMinutes": 120
  }
]
```

📄 C:\dev\streamer-hub\client\src\ui.ts
```ts
// 여러 화면이 함께 쓰는 작은 도우미들

// P1에서 만든 도우미를 TypeScript로 옮겼어요. 매개변수와 돌려주는 값에 타입만 붙였어요.
// textContent로 넣어서 글자 안의 <태그>가 있어도 그냥 글자로만 보여요
export function createElementWithText(tagName: string, className: string, text: string): HTMLElement {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text;
  return element;
}

// <p role="status">에 문장을 넣어요. 화면 읽기 프로그램도 읽어 줘요
// toggle('error', isError): isError가 true면 error 클래스를 붙이고 false면 떼요
export function setStatus(element: HTMLElement, message: string, isError = false): void {
  element.textContent = message;
  element.classList.toggle('error', isError);
}

// 오류에서 사람에게 보여 줄 문장을 꺼내요 (지금은 한 가지 문장이에요)
// catch로 잡은 error는 unknown 타입이라서, 확인 없이 error.message처럼 쓸 수 없어요
export function errorMessage(error: unknown): string {
  console.error(error); // 자세한 오류는 개발자 도구 콘솔에 남겨요
  return '불러오지 못했어요. 잠시 뒤에 다시 해 주세요.';
}

// ms밀리초 뒤에 이행되는 Promise (await로 기다릴 때 써요)
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

📄 C:\dev\streamer-hub\client\src\api.ts
```ts
// 서버에서 데이터를 가져오는 함수 모음이에요 (Day 8)
// 화면 코드는 fetch를 직접 쓰지 않고 이 함수들만 불러요.
import type { Schedule, Streamer } from './types.ts';

// <T>: 어떤 모양의 JSON이 올지 부르는 쪽이 알려 줘요 (제네릭, Day 6)
async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`요청이 실패했어요. (${response.status})`);
  }
  // as T: "이 JSON은 T 모양이라고 믿고 쓸게요"라는 뜻이에요. 실행 중에 검사하는 것은 아니에요
  return (await response.json()) as T;
}

// 지금은 public\data 폴더의 임시 파일을 읽어요. Day 27에 서버 주소(/api/…)로 바꿔요
export function getStreamers(): Promise<Streamer[]> {
  return getJson<Streamer[]>('/data/streamers.json');
}

export function getSchedules(): Promise<Schedule[]> {
  return getJson<Schedule[]>('/data/schedules.json');
}
```

📄 C:\dev\streamer-hub\client\src\main.ts
```ts
// 사이트의 시작점: 홈 화면에 스트리머 카드와 다가오는 방송을 그려요
import './style.css';
import { getSchedules, getStreamers } from './api.ts';
import type { Platform, Schedule, Streamer } from './types.ts';
import { createElementWithText, errorMessage, setStatus } from './ui.ts';

// Record: 플랫폼 글자마다 화면에 보여 줄 이름이 하나씩 있는 표예요 (Day 6)
const platformNames: Record<Platform, string> = {
  chzzk: '치지직',
  youtube: 'YouTube',
  soop: 'SOOP',
  other: '기타',
};

// index.html에 처음부터 있는 요소라서 반드시 있어요(!)
const app = document.querySelector<HTMLElement>('#app')!;

// 틀은 innerHTML로 한 번에 만들어요. 여기에는 우리가 쓴 고정 글자만 넣어요
app.innerHTML = `
  <section class="hero">
    <h1>스트리머 허브</h1>
    <p>좋아하는 스트리머의 방송 일정을 확인하고, 팬끼리 이야기를 나눠요.</p>
    <p class="actions">
      <a class="button" href="#/schedule">이번 주 방송 일정</a>
      <a class="button secondary" href="#/streamers">스트리머 보기</a>
    </p>
  </section>
  <p class="status" role="status">불러오는 중...</p>
  <h2>스트리머</h2>
  <ul class="card-grid" id="streamers"></ul>
  <h2>다가오는 방송</h2>
  <ul class="item-list" id="upcoming"></ul>
`;

const status = app.querySelector<HTMLElement>('.status')!;
const streamerList = app.querySelector<HTMLUListElement>('#streamers')!;
const upcomingList = app.querySelector<HTMLUListElement>('#upcoming')!;

// 스트리머 한 명 = 카드 한 장
function createStreamerCard(streamer: Streamer): HTMLLIElement {
  const card = document.createElement('li');
  card.className = 'card';
  card.append(
    createElementWithText('span', `badge ${streamer.platform}`, platformNames[streamer.platform]),
    createElementWithText('h3', '', streamer.name),
    createElementWithText('p', 'bio', streamer.bio),
  );
  return card;
}

// 방송 일정 하나 = 목록 한 줄. 시각은 일단 서버가 준 글자 그대로 보여요 (한국 시간 표시는 Day 29)
function createScheduleItem(schedule: Schedule): HTMLLIElement {
  const item = document.createElement('li');
  item.append(
    createElementWithText('strong', '', schedule.streamerName),
    ` · ${schedule.title} `,
    createElementWithText('span', 'muted', schedule.startsAt),
  );
  return item;
}

async function load(): Promise<void> {
  try {
    // 두 요청을 동시에 보내고, 둘 다 도착할 때까지 기다려요
    const [streamers, schedules] = await Promise.all([getStreamers(), getSchedules()]);

    if (streamers.length === 0) {
      streamerList.append(createElementWithText('li', 'muted', '아직 등록된 스트리머가 없어요.'));
    }
    streamerList.append(...streamers.map(createStreamerCard));
    upcomingList.append(...schedules.map(createScheduleItem));
    setStatus(status, '');
  } catch (error) {
    setStatus(status, errorMessage(error), true);
  }
}

load();
```

6단계의 두 블록을 `/* ---------- 5. 화면별 ---------- */` 주석 바로 위에 순서대로 붙인 상태가 끝 상태예요. 블록 사이와 주석 앞에는 빈 줄 하나씩이에요. 참고로 `.card h2` 규칙은 지금 카드 제목이 `h3`라서 아직 아무것도 꾸미지 않아요. Day 28에서 카드를 페이지 제목(`h1`) 아래의 `h2`로 만들 때 쓰여요.

📄 C:\dev\streamer-hub\client\src\style.css (일부)
```css
.status:empty {
  display: none;
}

.status.error {
  color: var(--error);
  font-weight: 600;
}

.badge {
  display: inline-block;
  padding: 0 0.6rem;
  border-radius: 999px;
  background: var(--surface);
  border: 1px solid var(--border);
  font-size: 0.85rem;
}

.badge.chzzk {
  border-color: #00c73c;
}

.badge.youtube {
  border-color: #ff0033;
}

.badge.soop {
  border-color: #0545b1;
}

/* 목록: 한 줄에 하나씩, 사이에 선 */
.item-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.item-list li {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.25rem 0.75rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--border);
}

/* 카드: 화면 폭에 맞춰 칸 수가 저절로 바뀌어요 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.card {
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
}

.card h2 {
  margin: 0.5rem 0 0.25rem;
  font-size: 1.15rem;
}

.bio {
  margin: 0.5rem 0 0;
}
```
:::

## 🧯 자주 막히는 곳

여기에 없는 증상은 [문제 해결 모음](#/page/troubleshooting)에서 찾아보세요.

### 화면에 `[object Promise]`가 보여요

**원인:** `await`를 빠뜨려서 Promise 자체를 글자로 만들었어요. 값이 아직 도착하지 않았는데 쓴 거예요.

**해결:** Promise를 돌려주는 함수(`getStreamers()` 등)를 부르는 곳에 `await`가 있는지 확인해요. `await`는 `async` 함수 안에서만 쓸 수 있어요. 고치고 저장하면 화면이 바로 바뀌어요.

### 카드는 없고 오류 문장이 보여요 (`/data/…` 404)

```text
Error: 요청이 실패했어요. (404)
```

**원인:** `public\data\streamers.json`을 만들었는데 주소는 `/data/…`이어야 해요. `public`은 주소에 들어가지 않아요. 폴더 이름이나 파일 이름이 틀려도 404예요. 줄 번호는 달라도 돼요.

**해결:**

1. 브라우저에서 `http://localhost:5173/data/streamers.json`이 열리는지 확인해요.
2. 안 열리면 탐색기에서 `client\public\data\streamers.json`의 폴더와 파일 이름을 맞춰요.
3. 열리면 `api.ts`의 주소가 `'/data/streamers.json'`인지 확인해요.

### 바꾼 JSON이 화면에 안 보여요

**원인:** 브라우저가 옛 JSON을 기억하고 있어요(캐시).

**해결:** `Ctrl + Shift + R`로 강하게 새로 고침해요. 개발자 도구 Network 탭에서 **Disable cache**(캐시 사용 안 함)를 체크해 두면 편해요.

### JSON 문법 오류 `SyntaxError`

```text
SyntaxError: Unexpected token '}', ... is not valid JSON
```

**원인:** JSON의 쉼표나 따옴표가 틀렸어요. 마지막 항목 뒤에 쉼표(`,`)가 있으면 안 돼요. 문구는 브라우저 버전에 따라 달라요.

**해결:** VS Code에서 `streamers.json`을 열면 빨간 물결이 틀린 곳을 가리켜요. [P1 Day 25](#/day/p1-d25)의 JSON 규칙대로 고치고 저장하면 화면이 바뀌어요.

### `'error' is of type 'unknown'.`

```text
error TS18046: 'error' is of type 'unknown'.
```

**원인:** `catch (error)`의 `error`는 `unknown`이라서 `error.message`처럼 바로 쓰면 TypeScript가 막아요. 오류가 문자열일 수도, 객체일 수도 있기 때문이에요.

**해결:** `error`를 직접 쓰지 말고 `errorMessage(error)` 도우미에 넘겨요. 도우미 안에서 확인하고 문장을 돌려줘요.

### 칸 이름이 틀렸는데 컴파일은 통과해요

**원인:** `as T`는 믿고 쓰는 약속이라서 JSON의 칸 이름이 틀려도 `tsc`는 몰라요. 화면에 `undefined`가 보여요.

**해결:** JSON 파일의 칸 이름(`name`, `platform` …)이 `types.ts`의 칸 이름과 같은지 비교해요.

## 📝 오늘의 체크리스트

- [ ] 콘솔에서 `await wait(1000)`과 `Promise.all`의 시간 차이(약 1000ms와 약 500ms)를 봤어요
- [ ] Promise의 세 상태(대기, 이행, 거부)를 말할 수 있어요
- [ ] `http://localhost:5173`에 스트리머 카드 3장과 방송 4줄이 보여요
- [ ] 느린 연결에서 `불러오는 중...`을, 요청을 막았을 때 빨간 오류 문장을 봤어요
- [ ] `const [a, b] = …`와 `...`가 각각 무엇인지 한 문장씩 말할 수 있어요
- [ ] `npm run build`가 오류 없이 끝나요
- [ ] 과제 1~3을 풀고 정답과 비교했어요
- [ ] `git add -A`, `git commit -m "day08: 비동기와 임시 데이터"`, `git push`를 했고, 과제 뒤에도 커밋·푸시해서 `git status`가 깨끗해요

## 📚 더 알아보기

- [MDN — Promise 사용하기](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Using_promises): Promise의 상태와 `Promise.all` 같은 조합 방법을 설명해요.
- [MDN — 구조 분해 할당](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Destructuring): 배열·객체에서 값을 꺼내는 문법을 예시로 보여 줘요.
- [TypeScript Handbook — unknown](https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown): `unknown`이 `any`와 어떻게 다른지 설명해요.

➡️ **다음 Day 예고:** [Day 9 · .NET과 첫 C#](#/day/p2-d09)에서는 서버를 만들 언어 C#과 .NET을 설치하고 첫 프로그램을 실행해요. 화면 만들기는 잠시 쉬고 C# 연습 폴더에서 시작해요.
