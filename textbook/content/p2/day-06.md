## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- 함수의 매개변수와 반환값에 타입을 붙이고, 값을 돌려주지 않는 함수(`void`)와 기본값이 있는 매개변수를 쓸 수 있어요.
- "어떤 타입이든 쓸 수 있는" 제네릭 함수 `first<T>`와 제네릭 타입 `Paged<T>`를 만들고 쓸 수 있어요.
- 어제 만든 `streamer.ts`를 `types.ts`, `data.ts`, `main.ts`로 나누고 `export`와 `import`로 연결할 수 있어요.
- `error TS2835`(확장자 빠짐), `error TS1484`(`import type`) 오류를 읽고 고칠 수 있어요.

**예상 시간: 100분** (개념 이해 15분 · 따라하기 55분 · 과제 25분 · 정리 5분)

:::path 📂 시작 상태
[Day 5](#/day/p2-d05)의 "오늘 끝 상태 전체 코드"가 있어야 해요. 없거나 다르면 그 코드로 먼저 맞춰 주세요.

- `C:\dev\streamer-hub\README.md`, `C:\dev\streamer-hub\.git\`
- `C:\dev\ts-practice\tsconfig.json`, `C:\dev\ts-practice\package.json`, `C:\dev\ts-practice\package-lock.json`, `C:\dev\ts-practice\hello.js`, `C:\dev\ts-practice\node_modules\`, `C:\dev\ts-practice\dist\`
- `C:\dev\ts-practice\src\hello.ts`, `C:\dev\ts-practice\src\streamer.ts`
- Node.js LTS가 설치되어 있어요(`node --version`이 `v22.22.2` 이상, `v24.15` 이상, `v26` 이상 중 하나, 작성 기준 v26.13.0).
- VS Code 연습 창(`C:\dev\ts-practice` 폴더)을 열 수 있어요. 터미널에서 `cd C:\dev\ts-practice`, `code .` 순서로 입력해요.
- 켜 두어야 할 프로그램은 없어요.
:::

## 📖 개념 이해

### 함수 타입: 무엇을 받고 무엇을 돌려주는지 적어 두기

[P1 Day 18](#/day/p1-d18)에서 함수는 값을 받아(매개변수) 일을 하고 값을 돌려주는(반환값) 도구라고 배웠어요. TypeScript에서는 이 두 곳에 타입을 적어요.

```ts
function greet(name: string): string {
  return `${name}님, 안녕하세요`;
}
```

`name: string`은 "글자를 받는다", 괄호 뒤의 `: string`은 "글자를 돌려준다"예요. 몇 가지가 더 있어요.

- 값을 돌려주지 않는 함수의 반환 타입은 `void`예요. 예: 화면에 출력만 하는 함수.
- 매개변수에 `q = ''`처럼 기본값을 주면 "안 넘겨도 된다"는 뜻이에요. 타입은 기본값으로 추론돼요.
- **[[함수 타입]]**(function type)은 함수 자체를 값으로 받을 때 그 함수의 모양을 적는 타입이에요. `(streamer: Streamer) => boolean`은 "`Streamer`를 받아서 `true`나 `false`를 돌려주는 함수"라는 뜻이에요. P1에서 배운 콜백 함수([[콜백 함수]])를 받는 자리에 쓰는 타입이에요.

### 제네릭: 종류가 정해지지 않은 빈칸이 있는 타입

**비유:** 도시락통이에요. 통 모양(칸 나누기, 뚜껑)은 같지만 안에 담는 음식은 때마다 달라요. "무엇을 담든 같은 통"을 쓰는 거예요.

**정확한 정의:**

- **[[제네릭]]**(generic)은 타입 자리를 빈칸으로 두고, 쓸 때 그 빈칸에 실제 타입을 채워 넣는 기능이에요. 하나의 함수나 타입 정의를 여러 종류에 재사용할 수 있어요.
- **[[타입 매개변수]]**(type parameter)는 그 빈칸의 이름이에요. 보통 `T`(Type의 첫 글자)를 써요. 함수 이름 바로 뒤에 `<T>`처럼 적어서 선언해요.

```ts
function first<T>(items: T[]): T | undefined {
  return items[0];
}
```

`first`는 "`T`의 배열을 받아서 `T` 하나(또는 `undefined`)를 돌려준다"는 뜻이에요. `first(['가', '나'])`는 `string`, `first([1, 2])`는 `number`를 돌려줘요. 사실 `string[]`도 `Array<string>`의 줄임 표기였어요. 배열은 처음부터 제네릭이었어요.

제네릭 타입도 만들 수 있어요. 스트리머 허브의 목록 API는 "여러 쪽으로 나뉜 목록"을 `{ items, total, page, pageSize }` 모양으로 보내요. 목록이 스트리머든 게시글이든 모양은 같아서 제네릭 인터페이스 하나로 쓸 수 있어요.

```ts
interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
```

`Paged<Streamer>`는 `items`가 `Streamer` 배열인 목록이고, `Paged<string>`은 글자 배열인 목록이에요.

`Record<K, V>`도 제네릭이에요. 키(`K`)마다 값(`V`) 하나가 있는 표를 뜻해요. `Record<Platform, string>`은 "`chzzk`, `youtube`, `soop`, `other` 네 키가 각각 글자 값을 가진 표"예요. 키 하나를 빼먹으면 TypeScript가 오류를 내서 표를 빠짐없이 채우게 도와줘요.

### 모듈: 파일 하나에 다 쓰지 않고 나누기

**비유:** 서랍장이에요. 옷을 한 서랍에 다 넣으면 찾기 힘드니 "윗옷", "아랫옷", "양말"로 서랍을 나눠요. 파일도 역할마다 나눠 두면 찾기 쉬워요.

**정확한 정의:** **[[모듈]]**(module)은 자기 코드를 `export`로 내보내고, 다른 파일에서 `import`로 가져다 쓸 수 있는 파일 하나예요. 모듈 안의 이름은 `export`를 붙이지 않으면 바깥에서 보이지 않아요.

```ts
// types.ts
export interface Streamer { id: number; name: string }

// main.ts
import type { Streamer } from './types.js';
```

- 타입만 가져올 때는 `import type`을 써요. 타입은 실행할 때 사라지기 때문에, `tsconfig.json`에서 켠 `verbatimModuleSyntax`가 "타입만 가져오는 import는 `import type`으로 쓰라"고 요구해요.
- 값(함수, 배열)을 가져올 때는 `import { 이름 } from '경로'`예요.
- 경로 `./types.js`의 `./`는 "같은 폴더"예요([P1 Day 5](#/day/p1-d05)).

:::info 경로 끝에 `.js`? 아니면 `.ts`?
오늘 연습 폴더는 TypeScript 결과인 `.js`를 Node.js가 직접 실행하는 방식(`"module": "nodenext"`)이라서, 경로 끝에 **`.js`** 를 써요. 파일은 `types.ts`인데도 `./types.js`라고 쓰는 게 이상해 보이지만, 실행될 파일 이름 기준이라서 그래요. Day 7에서 만들 Vite 프로젝트는 다른 방식(번들러)을 써서 **`.ts`** 를 그대로 적어요(`./types.ts`). 프로젝트마다 규칙이 다르니 "tsc가 알려 주는 오류 메시지를 따라간다"고 기억하세요. 틀리면 `error TS2835`가 정확히 알려 줘요.
:::

:::info 실무에서는
실제 프로젝트는 파일이 수백 개라서 모듈로 나누는 것이 기본이에요. "타입은 `types.ts`, 서버와 통신하는 함수는 `api.ts`, 화면 그리는 함수는 `ui.ts`"처럼 역할별로 파일을 나눠요. 스트리머 허브의 `client\src`도 그렇게 돼요.
:::

## 🛠️ 따라하기

모두 6단계예요. 어제 만든 `src\streamer.ts` 하나를 `types.ts`, `data.ts`, `main.ts`로 나눠요.

### 1단계 · `types.ts` 만들기 (8분)

**어디서:** VS Code 연습 창(`TS-PRACTICE`) → 왼쪽 탐색기 → `src` 폴더

**무엇을:**

1. 탐색기에서 `src` 폴더를 클릭하고 **새 파일** 아이콘을 클릭해요.
2. 이름 칸에 `types.ts`를 입력하고 `Enter`를 눌러요.
3. 아래 내용을 입력해요. Day 5의 타입에 `export`를 붙이고, 제네릭 `Paged<T>`를 더한 거예요. `streamer.ts`에서 복사해서 붙인 뒤 앞에 `export`만 더해도 돼요.
4. `Ctrl + S`로 저장해요.

📄 C:\dev\ts-practice\src\types.ts
```ts
// 서버와 주고받는 데이터의 모양이에요. 다른 파일이 쓸 수 있게 export를 붙여요
export type Platform = 'chzzk' | 'youtube' | 'soop' | 'other';

export interface Streamer {
  id: number;
  name: string;
  platform: Platform;
  channelUrl: string;
  bio: string;
  avatarUrl: string | null; // 사진이 없으면 null
  createdAt: string;
}

export interface Schedule {
  id: number;
  streamerId: number;
  streamerName: string;
  title: string;
  startsAt: string; // UTC 문자열 (끝의 Z)
  durationMinutes: number;
}

// Streamer의 모든 칸 + 다가오는 일정
export interface StreamerDetail extends Streamer {
  schedules: Schedule[];
}

// 제네릭 인터페이스: 무엇의 목록이든 같은 모양으로 담아요
export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
```

:::success
탭에 `types.ts`가 보이고 빨간 밑줄이 없어요. `Paged` 위에 마우스를 올리면 `interface Paged<T>`가 보여요.
:::

### 2단계 · `data.ts` 만들기 (8분)

**어디서:** VS Code → `src` 폴더

**무엇을:**

1. 같은 방법으로 `src\data.ts` 파일을 만들어요.
2. 아래 내용을 입력하고 저장해요. 예시 데이터 배열은 `streamer.ts`의 `const streamers` 부분을 그대로 가져온 거예요. 맨 앞에 `export`를 붙이는 것을 잊지 마세요.

📄 C:\dev\ts-practice\src\data.ts
```ts
import type { Streamer } from './types.js';

export const streamers: Streamer[] = [
  {
    id: 1,
    name: '달빛곰',
    platform: 'chzzk',
    channelUrl: 'https://example.com/moonbear',
    bio: '밤마다 느긋하게 게임하는 곰이에요. 채팅 환영!',
    avatarUrl: null,
    createdAt: '2026-11-01T00:00:00Z',
  },
  {
    id: 2,
    name: '픽셀토끼',
    platform: 'youtube',
    channelUrl: 'https://example.com/pixelrabbit',
    bio: '도트 그림을 그리면서 이야기 나누는 토끼예요.',
    avatarUrl: null,
    createdAt: '2026-11-01T00:00:00Z',
  },
  {
    id: 3,
    name: '노을고양이',
    platform: 'soop',
    channelUrl: 'https://example.com/sunsetcat',
    bio: '노래와 수다를 좋아하는 고양이예요.',
    avatarUrl: null,
    createdAt: '2026-11-01T00:00:00Z',
  },
];
```

첫 줄의 `import type { Streamer } from './types.js';`는 "같은 폴더의 `types.js`에서 `Streamer` 타입을 가져온다"는 뜻이에요.

:::success
빨간 밑줄이 없어요. `Streamer` 위에 마우스를 올리면 `types.ts`에서 온 `interface Streamer`가 보여요.
:::

### 3단계 · `main.ts`에서 가져와 쓰기 (15분)

**어디서:** VS Code → `src` 폴더

**무엇을:**

1. `src\main.ts` 파일을 만들어요.
2. 아래 내용을 입력하고 저장해요. `Paged`와 `Platform`은 6단계에서 써요. 지금 import에 미리 적어 두어요.

📄 C:\dev\ts-practice\src\main.ts
```ts
import { streamers } from './data.js';
import type { Paged, Platform, Streamer } from './types.js';

// 기본 매개변수와 void: 값을 돌려주지 않는 함수의 반환 타입은 void예요
function logLine(message: string, prefix = '>'): void {
  console.log(`${prefix} ${message}`);
}

// 제네릭 함수: 어떤 배열이든 첫 번째 칸을 돌려줘요. 비어 있으면 undefined예요
function first<T>(items: T[]): T | undefined {
  return items[0];
}

// 함수를 받는 매개변수: test는 Streamer를 받아 true/false를 돌려주는 함수예요
function filterStreamers(items: Streamer[], test: (streamer: Streamer) => boolean): Streamer[] {
  return items.filter(test);
}

logLine('스트리머 허브 연습');

const chzzkStreamers = filterStreamers(streamers, (streamer) => streamer.platform === 'chzzk');
logLine(`치지직 스트리머 ${chzzkStreamers.length}명: ${chzzkStreamers.map((streamer) => streamer.name).join(', ')}`);

logLine(`첫 번째 스트리머: ${first(streamers)?.name}`, '*');
logLine(`빈 목록의 첫 번째: ${first<Streamer>([])}`, '*');
```

코드의 뜻이에요.

- `logLine`: 기본값이 있는 `prefix = '>'`는 안 넘기면 `>`를 써요. 두 번째 인수로 `'*'`를 넘기면 `*`가 돼요.
- `first<T>`: `first(streamers)`처럼 부르면 TypeScript가 `T`를 `Streamer`로 알아내요. `first<Streamer>([])`처럼 `<…>`로 직접 알려 줄 수도 있어요.
- `filterStreamers`: 두 번째 매개변수 `test`는 함수예요. `(streamer) => streamer.platform === 'chzzk'`가 그 함수고, 화살표 함수([P1 Day 18](#/day/p1-d18))예요. `streamer`의 타입은 TypeScript가 알아서 `Streamer`로 알아내요.
- `first(streamers)?.name`: 비어 있으면 `undefined`가 될 수 있어서 `?.`를 써요(Day 5).

:::success
빨간 밑줄이 없어요. `first<T>` 위에 마우스를 올리면 `function first<T>(items: T[]): T | undefined`가 보여요.
:::

### 4단계 · `streamer.ts`를 지우고 변환해서 실행하기 (6분)

이제 `streamer.ts`가 하던 일을 세 파일이 나눠 맡았어요. 옛 파일은 지워요. 안 지우면 이름이 같은 `Platform`, `Streamer`가 두 곳에 생겨 헷갈려요.

**어디서:** VS Code 터미널, 위치 `C:\dev\ts-practice`

**무엇을:**

:::warn 지울 파일의 경로를 확인하세요
`Remove-Item`은 휴지통 없이 바로 지워요. 아래 두 파일만 지워요. `describeAvatar` 같은 Day 5의 함수는 오늘 쓰지 않아 함께 사라져요. 과제 3에서 쓸 `platformName`은 정답 코드에 있으니 걱정하지 않아도 돼요.
:::

```powershell
Remove-Item C:\dev\ts-practice\src\streamer.ts
```

```powershell
Remove-Item C:\dev\ts-practice\dist\streamer.js
```

```powershell
npx tsc
```

아무것도 나오지 않으면 성공이에요. 실행해요.

```powershell
node dist\main.js
```

예상 출력:

```text
> 스트리머 허브 연습
> 치지직 스트리머 1명: 달빛곰
* 첫 번째 스트리머: 달빛곰
* 빈 목록의 첫 번째: undefined
```

:::success
`dist` 폴더에 `types.js`, `data.js`, `main.js`가 생겼고, 위의 네 줄이 나와요. `npx tsc`는 조용해요.
:::

### 5단계 · 일부러 틀려서 모듈 오류 읽기 (8분)

**어디서:** VS Code → `src\main.ts`

**무엇을:** 오류가 나는 것이 정상이에요. 하나씩 해 보고 바로 되돌려요.

1. 첫 줄 `import { streamers } from './data.js';`에서 `.js`를 지워 `'./data'`로 만들고 저장한 뒤 `npx tsc`를 실행해요.

```powershell
npx tsc
```

예상 출력(첫 줄만 같으면 돼요):

```text
src/main.ts(1,27): error TS2835: Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './data.js'?
```

풀이: "이 방식에서는 경로 끝에 확장자가 필요해요. `./data.js` 아니었어요?"라는 뜻이에요. `Did you mean` 뒤에 고칠 모양이 적혀 있어요. `.js`를 되돌려요.

2. 둘째 줄 `import type { Paged, Platform, Streamer }`에서 `type ` 글자(와 뒤 빈칸)를 지워 `import { Paged, Platform, Streamer }`로 만들고 저장한 뒤 `npx tsc`를 실행해요.

예상 출력:

```text
src/main.ts(2,10): error TS1484: 'Paged' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled.
src/main.ts(2,17): error TS1484: 'Platform' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled.
src/main.ts(2,27): error TS1484: 'Streamer' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled.
```

풀이: "`Paged`는 타입인데 타입 전용 import로 가져오지 않았다"는 뜻이에요. 타입은 `import type`으로 가져와요. 되돌려요.

3. `data.ts`의 `export const streamers`에서 `export ` 글자를 지우고 저장한 뒤 `npx tsc`를 실행해요.

예상 출력(첫 줄만 같으면 돼요):

```text
src/main.ts(1,10): error TS2459: Module '"./data.js"' declares 'streamers' locally, but it is not exported.
```

풀이: "`data`에 `streamers`가 있지만 `export`가 없어서 바깥에서 못 본다"는 뜻이에요. `export `를 되돌려요.

4. 세 곳을 모두 되돌린 뒤 `npx tsc`가 조용한지 확인해요.

:::success
세 오류의 번호(`TS2835`, `TS1484`, `TS2459`)를 직접 봤어요. 모두 되돌린 뒤 `npx tsc`는 출력이 없고 `node dist\main.js`는 4단계와 같은 네 줄을 출력해요.
:::

### 6단계 · `Record`와 `Paged<T>` 써 보기 (10분)

**어디서:** VS Code → `src\main.ts`

**무엇을:** 파일 맨 아래에 빈 줄 하나를 두고 이어서 입력해요. 저장하고 변환·실행해요.

📄 C:\dev\ts-practice\src\main.ts (일부)
```ts

// Record<키 타입, 값 타입>: 키마다 값이 하나씩 있는 표예요
const platformLabels: Record<Platform, string> = {
  chzzk: '치지직',
  youtube: 'YouTube',
  soop: 'SOOP',
  other: '기타',
};
logLine(`유튜브의 한글 이름: ${platformLabels.youtube}`, '*');

// Paged<T>의 T 자리에 글자(string)를 넣어 봤어요
const tagPage: Paged<string> = {
  items: ['게임', '수다'],
  total: 2,
  page: 1,
  pageSize: 20,
};
logLine(`태그 ${tagPage.items.length}개 / 전체 ${tagPage.total}개`);
```

```powershell
npx tsc
```

```powershell
node dist\main.js
```

예상 출력:

```text
> 스트리머 허브 연습
> 치지직 스트리머 1명: 달빛곰
* 첫 번째 스트리머: 달빛곰
* 빈 목록의 첫 번째: undefined
* 유튜브의 한글 이름: YouTube
> 태그 2개 / 전체 2개
```

`platformLabels`에서 `other: '기타',` 줄을 지워 보면 `Record<Platform, string>`이 "빠진 키가 있다"고 오류를 내요. 해 봤으면 줄을 되돌려요.

:::success
여섯 줄이 나와요. `npx tsc`는 조용해요. `other` 줄을 지웠을 때는 `error TS2741: Property 'other' is missing in type …`이 났다가 되돌리면 사라져요.
:::

## ✍️ 과제

### 과제 1 · 어떤 배열에도 쓰는 `filterBy<T>` (보통 ⭐⭐, 10분)

- `main.ts`의 `filterStreamers`를 지우고, 어떤 배열이든 거를 수 있는 `filterBy<T>(items: T[], test: (item: T) => boolean): T[]`를 만들어요.
- `filterBy(streamers, (streamer) => streamer.platform === 'chzzk')`로 쓰던 부분을 고쳐요.
- 숫자 배열도 걸러 봐요: `filterBy([1, 2, 3, 4], (n) => n > 2)`의 결과를 `logLine`으로 출력해요.
- 확인: `npx tsc`가 조용하고, 출력에 `치지직 스트리머 1명: 달빛곰`이 그대로 있고, 숫자 결과 `3,4`가 보여요.
- 힌트: `return items.filter(test);`를 써요. `Streamer`라는 이름 대신 `T`를 써요.

### 과제 2 · `Paged<Streamer>` 값 만들기 (쉬움 ⭐, 5분)

- `Paged<Streamer>` 타입의 값 `page`를 만들어요. `items`는 `streamers`, `total`은 3, `page`는 1, `pageSize`는 20이에요.
- `logLine`으로 `1쪽, 한 쪽에 20명, 전체 3명`을 출력해요.
- 확인: 그 줄이 출력돼요.
- 힌트: `total`을 `streamers.length`로 써도 같아요.

### 과제 3 · `format.ts`로 `platformName` 옮기기 (보통 ⭐⭐, 10분)

- `src\format.ts` 파일을 새로 만들고 Day 5의 `platformName` 함수를 `export`로 옮겨요(Day 5 과제 2를 하지 않았다면 정답의 코드를 써요).
- `main.ts`에서 `import { platformName } from './format.js';`로 가져와서, 세 스트리머 각각 `이름: 플랫폼한글이름`을 출력해요.
- 확인: `달빛곰: 치지직`, `픽셀토끼: YouTube`, `노을고양이: SOOP`가 나와요.
- 힌트: `format.ts`는 `Platform` 타입이 필요하니 `import type { Platform } from './types.js';`를 첫 줄에 써요.

## ✅ 정답

:::answer 과제 1 정답 · filterBy
```ts
// 제네릭 함수: 어떤 배열이든 test가 true인 것만 걸러 줘요
function filterBy<T>(items: T[], test: (item: T) => boolean): T[] {
  return items.filter(test);
}

const chzzkStreamers = filterBy(streamers, (streamer) => streamer.platform === 'chzzk');
logLine(`치지직 스트리머 ${chzzkStreamers.length}명: ${chzzkStreamers.map((streamer) => streamer.name).join(', ')}`);

logLine(`2보다 큰 숫자: ${filterBy([1, 2, 3, 4], (n) => n > 2)}`);
```

**왜 이렇게 하나요?** `filterStreamers`는 `Streamer`만 거를 수 있었어요. `Streamer`를 `T`로 바꾸면 같은 코드가 숫자, 글자, 게시글 어떤 배열에도 맞아요. `T`가 `Streamer`인지 `number`인지는 `filterBy`를 부를 때 TypeScript가 첫 인수를 보고 알아내서, `(n) => n > 2`의 `n`도 숫자로 취급돼요. 배열을 문장 안에 넣으면 `3,4`처럼 쉼표로 이어져 보여요.
:::

:::answer 과제 2 정답 · Paged<Streamer>
```ts
const page: Paged<Streamer> = {
  items: streamers,
  total: streamers.length,
  page: 1,
  pageSize: 20,
};
logLine(`${page.page}쪽, 한 쪽에 ${page.pageSize}명, 전체 ${page.total}명`);
```

**왜 이렇게 하나요?** `Paged<Streamer>`라고 쓰면 `items`가 `Streamer[]`로 정해져요. 같은 `Paged<T>`에 `Paged<PostListItem>`을 넣으면 게시글 목록이 돼요. 스트리머 허브의 게시판 API(Day 30)가 정확히 이 모양으로 답해요.
:::

:::answer 과제 3 정답 · format.ts
📄 C:\dev\ts-practice\src\format.ts
```ts
import type { Platform } from './types.js';

// 플랫폼 이름을 한글로
export function platformName(platform: Platform): string {
  if (platform === 'chzzk') {
    return '치지직';
  } else if (platform === 'youtube') {
    return 'YouTube';
  } else if (platform === 'soop') {
    return 'SOOP';
  }
  return '기타';
}
```

`main.ts`에는 가져오는 줄과 출력 반복문을 더해요(전체는 아래 "오늘 끝 상태 전체 코드"에 있어요).

```ts
import { platformName } from './format.js';

for (const streamer of streamers) {
  logLine(`${streamer.name}: ${platformName(streamer.platform)}`);
}
```

**왜 이렇게 하나요?** 글자를 가공하는 함수를 `format.ts`에 모아 두면 `main.ts`가 짧아지고, 같은 함수를 다른 파일에서도 쓸 수 있어요. `export`가 없으면 `main.ts`에서 `TS2459`가 나요. 스트리머 허브의 `ui.ts`가 이런 모양이에요.
:::

:::answer 오늘 끝 상태 전체 코드
오늘 따라하기와 과제를 모두 끝낸 상태예요. 막혔다면 `src` 폴더를 아래 네 파일로 맞추고 `npx tsc`를 실행한 뒤 Day 7을 시작하세요. `src\streamer.ts`는 지워져 있어야 해요.

```text
C:\dev\ts-practice\
├─ dist\   (tsc가 만든 결과)
│  ├─ data.js
│  ├─ format.js
│  ├─ hello.js
│  ├─ main.js
│  └─ types.js
└─ src\
   ├─ data.ts
   ├─ format.ts
   ├─ hello.ts
   ├─ main.ts
   └─ types.ts
```

`src\types.ts`, `src\data.ts`, `src\format.ts`는 위 1단계, 2단계, 과제 3 정답의 코드와 같아요. 그 밖의 파일은 [Day 4](#/day/p2-d04)의 끝 상태 그대로예요. 아래는 오늘 마지막으로 바뀐 `main.ts` 전체예요.

📄 C:\dev\ts-practice\src\main.ts
```ts
import { streamers } from './data.js';
import { platformName } from './format.js';
import type { Paged, Platform, Streamer } from './types.js';

// 기본 매개변수와 void: 값을 돌려주지 않는 함수의 반환 타입은 void예요
function logLine(message: string, prefix = '>'): void {
  console.log(`${prefix} ${message}`);
}

// 제네릭 함수: 어떤 배열이든 첫 번째 칸을 돌려줘요. 비어 있으면 undefined예요
function first<T>(items: T[]): T | undefined {
  return items[0];
}

// 제네릭 함수: 어떤 배열이든 test가 true인 것만 걸러 줘요
function filterBy<T>(items: T[], test: (item: T) => boolean): T[] {
  return items.filter(test);
}

logLine('스트리머 허브 연습');

const chzzkStreamers = filterBy(streamers, (streamer) => streamer.platform === 'chzzk');
logLine(`치지직 스트리머 ${chzzkStreamers.length}명: ${chzzkStreamers.map((streamer) => streamer.name).join(', ')}`);

logLine(`첫 번째 스트리머: ${first(streamers)?.name}`, '*');
logLine(`빈 목록의 첫 번째: ${first<Streamer>([])}`, '*');

// Record<키 타입, 값 타입>: 키마다 값이 하나씩 있는 표예요
const platformLabels: Record<Platform, string> = {
  chzzk: '치지직',
  youtube: 'YouTube',
  soop: 'SOOP',
  other: '기타',
};
logLine(`유튜브의 한글 이름: ${platformLabels.youtube}`, '*');

// Paged<T>의 T 자리에 글자(string)를 넣어 봤어요
const tagPage: Paged<string> = {
  items: ['게임', '수다'],
  total: 2,
  page: 1,
  pageSize: 20,
};
logLine(`태그 ${tagPage.items.length}개 / 전체 ${tagPage.total}개`);

// 과제 1: 숫자 배열도 걸러 봐요
logLine(`2보다 큰 숫자: ${filterBy([1, 2, 3, 4], (n) => n > 2)}`);

// 과제 2: Paged<Streamer> 값
const page: Paged<Streamer> = {
  items: streamers,
  total: streamers.length,
  page: 1,
  pageSize: 20,
};
logLine(`${page.page}쪽, 한 쪽에 ${page.pageSize}명, 전체 ${page.total}명`);

// 과제 3: format.ts의 platformName 쓰기
for (const streamer of streamers) {
  logLine(`${streamer.name}: ${platformName(streamer.platform)}`);
}
```

`node dist\main.js`의 출력은 이래요.

```text
> 스트리머 허브 연습
> 치지직 스트리머 1명: 달빛곰
* 첫 번째 스트리머: 달빛곰
* 빈 목록의 첫 번째: undefined
* 유튜브의 한글 이름: YouTube
> 태그 2개 / 전체 2개
> 2보다 큰 숫자: 3,4
> 1쪽, 한 쪽에 20명, 전체 3명
> 달빛곰: 치지직
> 픽셀토끼: YouTube
> 노을고양이: SOOP
```
:::

## 🧯 자주 막히는 곳

여기에 없는 증상은 [문제 해결 모음](#/page/troubleshooting)에서 찾아보세요.

### `error TS2835: Relative import paths need explicit file extensions in ECMAScript imports…`

```text
src/main.ts(1,27): error TS2835: Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './data.js'?
```

**원인:** 연습 폴더(`nodenext` 방식)에서는 `import` 경로 끝에 확장자를 써야 해요. 파일은 `data.ts`여도 경로는 `./data.js`예요. 줄 번호와 이름은 내 코드에 따라 달라요.

**해결:** 오류에 있는 `Did you mean` 뒤의 경로로 고치고 저장한 뒤 `npx tsc`를 다시 실행해요. 출력이 없으면 해결이에요.

### `error TS1484: 'Streamer' is a type and must be imported using a type-only import…`

```text
src/main.ts(2,10): error TS1484: 'Paged' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled.
```

**원인:** 타입(`interface`, `type`)을 일반 `import { … }`로 가져왔어요. 타입은 실행할 때 사라져서 `import type`으로 따로 표시해야 해요.

**해결:** 해당 줄을 `import type { Paged, Platform, Streamer } from './types.js';`처럼 `import type`으로 고쳐요. 값(함수, 배열)과 타입을 한 줄에서 섞어 가져오지 말고 줄을 나눠요.

### `error TS2459: Module '"./data.js"' declares 'streamers' locally, but it is not exported.`

```text
src/main.ts(1,10): error TS2459: Module '"./data.js"' declares 'streamers' locally, but it is not exported.
```

**원인:** `data.ts`에서 `export`를 빠뜨렸어요. 모듈 안의 이름은 `export`가 없으면 바깥에서 볼 수 없어요. (이름이 아예 없을 때는 `has no exported member`로 시작하는 `TS2305`가 나요.)

**해결:** `data.ts`의 `const streamers`를 `export const streamers`로 고치고 저장한 뒤 `npx tsc`를 다시 실행해요.

### `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…\dist\data.js'`

**원인:** `npx tsc`가 `dist`에 `data.js`를 만들지 못한 채 `node`를 실행했어요. `npx tsc`에서 오류가 나서 중간에 멈췄거나, 지워서 `dist`가 비었어요. 오류 앞뒤의 줄은 사람마다 달라요.

**해결:**

1. `npx tsc`를 먼저 실행하고 오류가 있는지 읽어요. 오류가 있으면 그것부터 고쳐요.
2. 탐색기의 `dist` 폴더에 `data.js`, `types.js`, `main.js`가 있는지 확인해요.
3. `node dist\main.js`를 다시 실행해서 출력이 나오면 해결이에요.

### `error TS1295: ECMAScript imports and exports cannot be written in a CommonJS file…`

**원인:** `package.json`에 `"type": "module"`이 없어요. [Day 3](#/day/p2-d03) 4단계의 `npm pkg set type=module`을 빠뜨렸을 때 나와요. 같은 원인으로 `export`가 `TS1287`로 막히기도 해요.

**해결:** 터미널에서 `npm pkg set type=module`을 실행하고 `package.json`을 열어 `"type": "module"` 줄이 생겼는지 확인한 뒤 `npx tsc`를 다시 실행해요.

## 📝 오늘의 체크리스트

- [ ] `src` 폴더에 `types.ts`, `data.ts`, `main.ts`가 있고 `streamer.ts`는 지웠어요
- [ ] `npx tsc`가 조용하고 `node dist\main.js`가 출력을 내요
- [ ] `first<T>`가 `Streamer`에도 `string`에도 쓸 수 있는 이유를 한 문장으로 말할 수 있어요
- [ ] `error TS2835`, `error TS1484`, `error TS2459`를 일부러 내 보고 되돌렸어요
- [ ] `Paged<Streamer>`와 `Paged<string>`이 어떻게 다른지 말할 수 있어요
- [ ] 과제 1~3을 풀고 정답과 비교했어요
- [ ] 연습 폴더 파일 경로는 `.js`로 쓰고, Day 7 Vite에서는 `.ts`로 쓴다는 것을 기억해요

## 📚 더 알아보기

- [TypeScript Handbook — Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html): 제네릭 함수와 제네릭 타입을 공식 문서로 더 자세히 봐요.
- [TypeScript Handbook — Modules](https://www.typescriptlang.org/docs/handbook/2/modules.html): `import`, `export`, `import type` 규칙을 설명해요.
- [MDN — JavaScript 모듈](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Modules): 브라우저와 Node.js의 모듈이 어떻게 동작하는지 JavaScript 관점에서 설명해요.

➡️ **다음 Day 예고:** [Day 7 · Vite 프로젝트](#/day/p2-d07)에서는 연습을 마치고 진짜 프로젝트를 시작해요. Vite로 `C:\dev\streamer-hub\client`를 만들고 개발 서버를 켜서, 오늘 쓴 타입을 가져다 스트리머 허브의 첫 화면을 그려요.
