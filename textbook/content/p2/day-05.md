## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- 스트리머 허브에서 쓸 `Platform`, `Streamer`, `StreamerDetail`, `Schedule` 타입을 직접 설계할 수 있어요.
- "이 네 글자 중 하나만 가능해요"를 유니온 타입으로 쓰고, 잘못된 글자를 넣으면 `error TS2322`가 나는 것을 확인할 수 있어요.
- `null`일 수도 있는 값을 `if`로 확인한 뒤 안전하게 쓰고, `?.`와 `??` 연산자로 짧게 쓸 수 있어요.
- `interface`와 `type`이 어떻게 다른지, `?`와 `| null`이 어떻게 다른지 설명할 수 있어요.

**예상 시간: 90분** (개념 이해 12분 · 따라하기 51분 · 과제 22분 · 정리 5분)

:::path 📂 시작 상태
[Day 4](#/day/p2-d04)의 "오늘 끝 상태 전체 코드"가 있어야 해요. 없거나 다르면 그 코드로 먼저 맞춰 주세요.

- `C:\dev\streamer-hub\README.md`, `C:\dev\streamer-hub\.git\`
- `C:\dev\ts-practice\tsconfig.json`, `C:\dev\ts-practice\package.json`, `C:\dev\ts-practice\package-lock.json`, `C:\dev\ts-practice\hello.js`, `C:\dev\ts-practice\node_modules\`, `C:\dev\ts-practice\dist\`
- `C:\dev\ts-practice\src\hello.ts`
- Node.js LTS가 설치되어 있어요(`node --version`이 `v22.22.2` 이상, `v24.15` 이상, `v26` 이상 중 하나, 작성 기준 v26.13.0).
- VS Code, Chrome 또는 Edge, Git, GitHub 계정이 있어요.
- 켜 두어야 할 프로그램은 없어요.
:::

## 📖 개념 이해

### 데이터의 "모양"을 먼저 정해요

스트리머 허브에는 스트리머 한 명이 이런 정보를 가져요: 번호, 이름, 방송 플랫폼, 채널 주소, 소개 글, 사진 주소, 가입 시각. 이것이 "스트리머 한 명의 모양"이에요. 서버(C#)가 이 모양대로 데이터를 보내 주면, 화면(TypeScript)이 같은 모양으로 받아서 그려요. 모양을 코드로 적어 두면 `streamer.nmae` 같은 오타를 바로 잡아 줘요.

**비유:** 신청서 양식이에요. 양식에는 "이름: ____, 나이: ____"처럼 어떤 칸이 있고 칸마다 무엇을 쓰는지 정해져 있어요. 양식 자체는 사람이 아니에요. 그 양식을 채운 한 장 한 장이 실제 데이터예요.

### interface와 type: 모양을 이름 붙여 적어 두기

- **[[인터페이스]]**(interface)는 객체가 가져야 할 칸의 이름과 타입을 적어 둔 양식이에요. `interface Streamer { id: number; name: string; }`처럼 써요. 다른 인터페이스의 칸을 이어받는 `extends`도 쓸 수 있어요.
- **[[타입 별칭]]**(type alias)은 `type 이름 = 타입` 모양으로 어떤 타입에 새 이름을 붙이는 것이에요. 객체 모양뿐 아니라 "이 글자들 중 하나" 같은 것에도 쓸 수 있어요. 두 방식은 객체 모양을 적는 데는 거의 같아요. 이 교재는 객체 모양에는 `interface`를, 글자 목록 같은 것에는 `type`을 써요.

### 유니온 타입과 리터럴 타입: "이 중 하나만 돼요"

- **[[리터럴 타입]]**(literal type)은 값 하나 자체를 타입으로 쓰는 것이에요. `'chzzk'`라고 쓰면 "정확히 글자 `chzzk`만 가능해요"라는 뜻이에요.
- **[[유니온 타입]]**(union type)은 `|`로 여러 타입을 이어서 "이 중 하나"를 뜻하는 타입이에요. 리터럴 타입과 합치면 "정해진 목록 중 하나"를 만들 수 있어요.

```ts
type Platform = 'chzzk' | 'youtube' | 'soop' | 'other';
```

이렇게 쓰면 `Platform` 자리에는 이 네 글자만 들어가요. `'twitch'`나 `'Chzzk'`(대문자)를 넣으면 실행하기 전에 오류가 나요. 오타를 막는 가장 쉬운 방법이에요.

### 값이 없을 수 있을 때: `?`와 `| null`

스트리머가 프로필 사진을 올리지 않았다면 사진 주소가 없어요. 이 "없음"을 표현하는 방법이 두 가지 있어요.

- **[[선택적 프로퍼티]]**(optional property)는 이름 뒤에 `?`를 붙여서 "이 칸은 아예 없어도 돼요"라는 뜻이 되는 칸이에요. 예: `avatarUrl?: string`
- `string | null`은 "칸은 항상 있고, 값이 글자이거나 `null`이에요"라는 뜻이에요. `null`은 [P1 Day 15](#/day/p1-d15)에서 배운 "비어 있음"이에요.

스트리머 허브의 서버는 사진이 없어도 `avatarUrl` 칸을 **항상 보내고** 값만 `null`로 해요. 그래서 이 교재의 타입은 `avatarUrl: string | null`이에요. 서버가 보내는 모양과 화면이 읽는 모양을 똑같이 맞추는 거예요.

:::info `?`와 `| null`은 서로 다른 약속이에요
`avatarUrl?: string`이면 칸이 없을 수도 있고, 있다면 글자예요. `avatarUrl: string | null`이면 칸은 반드시 있고, 값이 글자이거나 `null`이에요. 서버와 약속한 모양이 다르면 둘 중 맞는 쪽을 골라요. `tsc --init`의 기본 설정 중 `exactOptionalPropertyTypes`는 `?` 칸에 `undefined`를 직접 넣는 것까지 막는 까다로운 옵션인데, Day 4에서 뺐기 때문에 지금은 신경 쓰지 않아도 돼요.
:::

### 타입 좁히기, `?.`, `??`

`string | null`인 값은 글자일 수도, `null`일 수도 있어서 바로 `.length`를 쓸 수 없어요. 이 오류를 TypeScript가 미리 알려 줘요.

- **[[타입 좁히기]]**(narrowing)는 `if`로 확인해서 "여기서부터는 이 값이 `null`이 아니에요"라고 TypeScript에게 알려 주는 것이에요. `if (x !== null)`이나 `typeof x === 'number'` 같은 검사가 쓰여요. 검사한 블록 안에서는 타입이 자동으로 좁혀져요.
- **[[옵셔널 체이닝]]**(optional chaining, `?.`)은 값이 `null`이나 `undefined`이면 에러 없이 멈추고 `undefined`를 돌려주는 연산자예요. `a?.name`은 `a`가 비어 있으면 `undefined`, 아니면 `a.name`이에요.
- **[[null 병합 연산자]]**(nullish coalescing, `??`)는 왼쪽 값이 `null`이나 `undefined`일 때 오른쪽 값을 대신 쓰는 연산자예요. `a ?? 'x'`는 `a`가 비어 있으면 `'x'`예요.

두 연산자는 JavaScript에도 있는 문법이라 P1 코드에서도 똑같이 쓸 수 있어요. 오늘은 TypeScript가 이 검사를 어떻게 도와주는지 봐요.

## 🛠️ 따라하기

모두 6단계예요. `src\streamer.ts` 파일 하나에 코드를 **아래로 이어 붙이면서** 만들어요. 각 코드 상자는 앞 상자의 바로 아래에 붙여요.

### 1단계 · 파일 만들고 `Platform` 타입 쓰기 (6분)

**어디서:** VS Code 연습 창(`TS-PRACTICE`). 열려 있지 않으면 터미널에서 `cd C:\dev\ts-practice`, `code .` 순서로 입력해서 열어요.

**무엇을:**

1. 왼쪽 탐색기에서 `src` 폴더를 클릭하고 **새 파일** 아이콘을 클릭해요. 이름 칸에 `streamer.ts`를 입력하고 `Enter`를 눌러요.
2. 편집 창에 아래 내용을 입력하고 `Ctrl + S`로 저장해요.

📄 C:\dev\ts-practice\src\streamer.ts (일부)
```ts
// 플랫폼은 이 네 글자 중 하나만 가능해요 (유니온 + 리터럴 타입)
type Platform = 'chzzk' | 'youtube' | 'soop' | 'other';
```

3. 터미널(`` Ctrl + ` ``, 위치 `C:\dev\ts-practice`)에서 변환해 봐요.

```powershell
npx tsc
```

아무것도 나오지 않으면 성공이에요.

:::success
`npx tsc`가 출력 없이 끝나요. 탐색기의 `dist` 폴더에 `streamer.js`가 생겼어요. 아직 실행할 내용은 없어요.
:::

### 2단계 · `Streamer`, `Schedule`, `StreamerDetail` 만들기 (12분)

**어디서:** VS Code → `src\streamer.ts`

**무엇을:** 1단계 코드 바로 아래에 빈 줄 하나를 두고, 아래 내용을 이어서 입력해요. 저장해요(`Ctrl + S`).

📄 C:\dev\ts-practice\src\streamer.ts (일부)
```ts

interface Streamer {
  id: number;
  name: string;
  platform: Platform;
  channelUrl: string;
  bio: string;
  avatarUrl: string | null; // 사진이 없으면 null
  createdAt: string;
}

interface Schedule {
  id: number;
  streamerId: number;
  streamerName: string;
  title: string;
  startsAt: string; // UTC 문자열 (끝의 Z)
  durationMinutes: number;
}

// Streamer의 모든 칸 + 다가오는 일정
interface StreamerDetail extends Streamer {
  schedules: Schedule[];
}
```

코드의 뜻이에요.

- `platform: Platform`은 칸의 타입으로 1단계에서 만든 `Platform`을 써요. 이제 이 칸에는 네 글자 중 하나만 들어가요.
- `createdAt: string`, `startsAt: string`처럼 시각은 글자예요. 서버가 보내는 JSON에는 날짜 타입이 없어서 `"2026-11-02T11:00:00Z"` 같은 글자로 와요. 끝의 `Z`는 "UTC 기준"이라는 표시이고, 한국 시간으로 바꾸는 방법은 Day 29에서 배워요.
- `schedules: Schedule[]`은 `Schedule`이 여러 개인 배열이에요.
- `StreamerDetail extends Streamer`는 "`Streamer`의 칸을 모두 가지고, 거기에 `schedules`를 더한다"는 뜻이에요. 상세 화면은 목록 화면보다 정보가 많아서 이렇게 이어받아요.

터미널에서 `npx tsc`를 실행해요.

```powershell
npx tsc
```

:::success
`npx tsc`가 출력 없이 끝나요. 코드에 빨간 물결 밑줄이 없어요. `Streamer` 위에 마우스를 올리면 칸 목록이 말풍선으로 보여요.
:::

### 3단계 · 예시 데이터 3명 만들기 (8분)

양식만 있으면 허전하니 실제 데이터를 `Streamer[]`(Streamer의 배열)로 만들어요.

**어디서:** VS Code → `src\streamer.ts`

**무엇을:** 맨 아래에 빈 줄 하나를 두고 이어서 입력해요. 저장해요.

📄 C:\dev\ts-practice\src\streamer.ts (일부)
```ts

const streamers: Streamer[] = [
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

`example.com`은 연습용으로 만들어 둔 주소라서 실제로 열리지 않아도 괜찮아요. 칸을 하나 빼먹거나 `platform`을 틀리게 쓰면 바로 빨간 밑줄이 생겨요.

:::success
빨간 밑줄이 없어요. 일부러 한 객체의 `bio:` 줄을 지워 보면 그 객체의 여는 `{`에 빨간 밑줄이 생겨요. 마우스를 올리면 `Property 'bio' is missing in type … but required in type 'Streamer'.`(`bio` 칸이 빠졌다는 뜻이에요)가 보여요. 확인했으면 줄을 되돌리고 저장해요.
:::

### 4단계 · `null`을 확인하며 출력하기 (10분)

세 명 모두 사진 주소가 `null`이에요. 사진 주소가 있으면 주소를 보여 주고 없으면 "사진 없음"을 보여 주는 함수를 만들어요. 여기서 **타입 좁히기**가 일해요.

**어디서:** VS Code → `src\streamer.ts`

**무엇을:** 맨 아래에 빈 줄 하나를 두고 이어서 입력해요. 저장해요.

📄 C:\dev\ts-practice\src\streamer.ts (일부)
```ts

// 값이 null일 수도 있을 때는 먼저 확인해야 안전하게 쓸 수 있어요 (타입 좁히기)
function describeAvatar(streamer: Streamer): string {
  if (streamer.avatarUrl !== null) {
    return `사진 주소 ${streamer.avatarUrl}`;
  }
  return '사진 없음';
}

for (const streamer of streamers) {
  console.log(`${streamer.name} (${streamer.platform}) ${describeAvatar(streamer)}`);
}
```

`if (streamer.avatarUrl !== null)` 안에서는 `avatarUrl`이 `string`으로 좁혀져요. 마우스를 `${streamer.avatarUrl}`의 `avatarUrl` 위에 올려 보면 `string`이라고 보여요. 반복문 `for…of`는 [P1 Day 17](#/day/p1-d17)에서 배웠어요.

터미널에서 변환하고 실행해요.

```powershell
npx tsc
```

```powershell
node dist\streamer.js
```

예상 출력:

```text
달빛곰 (chzzk) 사진 없음
픽셀토끼 (youtube) 사진 없음
노을고양이 (soop) 사진 없음
```

:::success
세 줄이 나와요. `if` 확인 없이 `streamer.avatarUrl.length`를 쓰면 `error TS18047: 'streamer.avatarUrl' is possibly 'null'.`이 나는 것도 직접 해 볼 수 있어요. 해 봤으면 원래대로 되돌려요.
:::

### 5단계 · 틀린 플랫폼 이름을 넣어 오류 보기 (5분)

`Platform`이 정말 오타를 막아 주는지 일부러 확인해요.

**어디서:** VS Code → `src\streamer.ts`의 첫 번째 스트리머(`id: 1`)

**무엇을:**

1. 첫 번째 스트리머의 `platform: 'chzzk',`를 `platform: 'twitch',`로 바꾸고 저장해요.
2. 터미널에서 `npx tsc`를 실행해요.

```powershell
npx tsc
```

예상 출력(줄 번호는 같아야 해요):

```text
src/streamer.ts(32,5): error TS2322: Type '"twitch"' is not assignable to type 'Platform'.
```

풀이: "`'twitch'`는 `Platform`에 없는 글자라서 넣을 수 없다"는 뜻이에요.

3. 이번에는 `'Chzzk'`(대문자 C)로 바꿔서 `npx tsc`를 다시 실행해 봐요.

예상 출력:

```text
src/streamer.ts(32,5): error TS2820: Type '"Chzzk"' is not assignable to type 'Platform'. Did you mean '"chzzk"'?
```

풀이: 비슷한 글자를 찾아 "혹시 `'chzzk'` 아니에요?" 하고 알려 줘요.

4. `platform: 'chzzk',`로 되돌리고 저장한 뒤 `npx tsc`가 조용한지 확인해요.

:::success
- `'twitch'`는 `TS2322`, `'Chzzk'`는 `TS2820`이 나요. 오류는 `platform:` 줄을 가리켜요.
- 되돌린 뒤 `npx tsc`가 출력 없이 끝나요.
:::

### 6단계 · `typeof`, `?.`, `??`, 그리고 `StreamerDetail` 값 만들기 (10분)

**어디서:** VS Code → `src\streamer.ts`

**무엇을:** 맨 아래에 빈 줄 하나를 두고 이어서 입력해요. 저장해요.

📄 C:\dev\ts-practice\src\streamer.ts (일부)
```ts

// typeof로도 좁힐 수 있어요: number | string 중 어느 쪽인지 확인해요
function viewerText(value: number | string): string {
  if (typeof value === 'number') {
    return `${value}명`;
  }
  return value;
}

// 찾으면 Streamer, 못 찾으면 null을 돌려줘요
function findById(id: number): Streamer | null {
  for (const streamer of streamers) {
    if (streamer.id === id) {
      return streamer;
    }
  }
  return null;
}

console.log(viewerText(128), viewerText('시청자 많음'));

// ?. 는 null이면 멈추고 undefined를 돌려줘요. ?? 는 비어 있을 때 대신 쓸 값이에요
console.log(findById(1)?.name ?? '찾지 못했어요');
console.log(findById(9)?.name ?? '찾지 못했어요');

// 상세 화면용 데이터: Streamer의 모든 칸 + schedules
const detail: StreamerDetail = {
  id: 1,
  name: '달빛곰',
  platform: 'chzzk',
  channelUrl: 'https://example.com/moonbear',
  bio: '밤마다 느긋하게 게임하는 곰이에요. 채팅 환영!',
  avatarUrl: null,
  createdAt: '2026-11-01T00:00:00Z',
  schedules: [
    {
      id: 1,
      streamerId: 1,
      streamerName: '달빛곰',
      title: '저녁 게임 방송',
      startsAt: '2026-11-02T11:00:00Z',
      durationMinutes: 120,
    },
  ],
};
console.log(`${detail.name}의 일정 ${detail.schedules.length}개`);
```

코드의 뜻이에요.

- `value: number | string`은 숫자이거나 글자인 값이에요. `typeof value === 'number'`로 확인한 `if` 안에서는 숫자로 좁혀져요. 밖에서는 글자로 좁혀져서 그대로 `return value`할 수 있어요.
- `findById(1)?.name`은 `findById(1)`이 `null`이 아니면 이름, `null`이면 `undefined`예요. 거기에 `?? '찾지 못했어요'`를 붙이면 `undefined`일 때 대신 쓸 글자가 돼요.
- `detail`은 `StreamerDetail` 양식을 채운 값이에요. `Streamer`의 칸 일곱 개에 `schedules`가 더해졌어요.

저장하고 실행해요.

```powershell
npx tsc
```

```powershell
node dist\streamer.js
```

예상 출력:

```text
달빛곰 (chzzk) 사진 없음
픽셀토끼 (youtube) 사진 없음
노을고양이 (soop) 사진 없음
128명 시청자 많음
달빛곰
찾지 못했어요
달빛곰의 일정 1개
```

:::success
일곱 줄이 나와요. `findById(1)`은 `달빛곰`, `findById(9)`는 `찾지 못했어요`가 돼요. `npx tsc`는 조용해요.
:::

## ✍️ 과제

### 과제 1 · 게시판 목록 한 줄의 모양 설계하기 (쉬움 ⭐, 6분)

- `src\streamer.ts` 맨 아래에 인터페이스 `PostListItem`을 만들어요. 칸은 `id`(숫자), `title`(글자), `authorName`(글자), `createdAt`(글자) 네 개예요.
- `PostListItem`으로 값 하나를 만들어 `console.log`로 제목과 글쓴이를 출력해요.
- 확인: `npx tsc`가 조용하고 `node dist\streamer.js` 마지막에 `첫 글이에요 - 팬1`이 나와요.
- 힌트: 2단계의 `Schedule`을 보고 칸 이름과 타입을 같은 모양으로 적으세요.

### 과제 2 · 플랫폼 이름을 한글로 바꾸는 함수 (보통 ⭐⭐, 8분)

- `platformName(platform: Platform): string` 함수를 만들어요. `'chzzk'`는 `치지직`, `'youtube'`는 `YouTube`, `'soop'`는 `SOOP`, 그 밖은 `기타`를 돌려줘요.
- `if`와 `else if`로 써요(`switch`는 쓰지 않아요).
- 확인: 코드를 세 스트리머에 적용해 `치지직 · …`, `YouTube · …`, `SOOP · …`을 출력해요.
- 힌트: [P1 Day 16](#/day/p1-d16)의 `if`/`else if`와 같아요. 마지막에 아무 것도 일치하지 않을 때 `return '기타'`를 둬요.

### 과제 3 · 사진이 없으면 이름의 첫 글자 쓰기 (보통 ⭐⭐, 8분)

- `avatarText(streamer: Streamer): string` 함수를 만들어요. 사진 주소(`avatarUrl`)가 `null`이면 이름의 첫 글자를, 아니면 사진 주소를 돌려줘요.
- 첫 글자를 얻는 방법은 문자열 메서드 `slice(0, 1)`이에요. `'달빛곰'.slice(0, 1)`은 `'달'`이에요. 앞에서부터 잘라 내는 메서드이고, `trim`처럼([P1 Day 23](#/day/p1-d23)) 글자에 붙여서 써요.
- 과제 2의 출력 줄에 이어서 `avatarText`의 결과도 붙여서 출력해요.
- 확인: `치지직 · 달`, `YouTube · 픽`, `SOOP · 노`가 나와요.
- 힌트: `??`를 써서 한 줄로 쓸 수 있어요.

## ✅ 정답

:::answer 과제 1 정답 · PostListItem
```ts

// ---------- 과제 ----------

// 과제 1: 게시판 목록 한 줄의 모양
interface PostListItem {
  id: number;
  title: string;
  authorName: string;
  createdAt: string;
}

const firstPost: PostListItem = {
  id: 1,
  title: '첫 글이에요',
  authorName: '팬1',
  createdAt: '2026-11-02T03:00:00Z',
};
console.log(`${firstPost.title} - ${firstPost.authorName}`);
```

**왜 이렇게 하나요?** 게시판 목록은 글 본문 없이 제목, 글쓴이, 시각만 보여 줘요. 그래서 상세 화면용 타입과 따로 "목록 한 줄"의 모양을 만들어요. 서버가 보내는 칸 이름과 똑같이 맞추는 것이 중요해요. Day 30에서 서버를 만들 때 이 네 칸을 그대로 쓸 거예요.
:::

:::answer 과제 2 정답 · platformName
```ts

// 과제 2: 플랫폼 이름을 한글로
function platformName(platform: Platform): string {
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

**왜 이렇게 하나요?** `if` 안에서 `platform === 'chzzk'`를 확인하면 TypeScript가 `platform`을 좁혀 줘요. 마지막 `return '기타'`는 `'other'`가 들어왔을 때 도달해요. 이 `if` 사슬은 Day 28에서 `Record`라는 더 간단한 표 방식으로 바꿀 거예요. 지금은 `if`만으로 충분해요.
:::

:::answer 과제 3 정답 · avatarText
```ts

// 과제 3: 사진이 없으면 이름의 첫 글자를 대신 써요
function avatarText(streamer: Streamer): string {
  return streamer.avatarUrl ?? streamer.name.slice(0, 1);
}

for (const streamer of streamers) {
  console.log(`${platformName(streamer.platform)} · ${avatarText(streamer)}`);
}
```

**왜 이렇게 하나요?** `streamer.avatarUrl ?? 대신쓸값`은 `avatarUrl`이 `null`이면 `대신쓸값`이에요. 4단계의 `if`보다 짧아요. 스트리머 허브 화면에서 프로필 사진이 없을 때 이름 첫 글자를 동그라미 안에 보여 줄 때 똑같이 써요(Day 28).
:::

:::answer 오늘 끝 상태 전체 코드
오늘 따라하기와 과제를 모두 끝낸 상태예요. 막혔다면 `src\streamer.ts`를 아래 내용으로 통째로 바꾸고 `npx tsc`를 실행한 뒤 Day 6을 시작하세요.

```text
C:\dev\ts-practice\
├─ dist\   (tsc가 만든 결과)
│  ├─ hello.js
│  └─ streamer.js
└─ src\
   ├─ hello.ts
   └─ streamer.ts  ← 오늘
```

그 밖의 파일(`package.json`, `tsconfig.json` 등)은 [Day 4](#/day/p2-d04)의 끝 상태 그대로예요.

📄 C:\dev\ts-practice\src\streamer.ts
```ts
// 플랫폼은 이 네 글자 중 하나만 가능해요 (유니온 + 리터럴 타입)
type Platform = 'chzzk' | 'youtube' | 'soop' | 'other';

interface Streamer {
  id: number;
  name: string;
  platform: Platform;
  channelUrl: string;
  bio: string;
  avatarUrl: string | null; // 사진이 없으면 null
  createdAt: string;
}

interface Schedule {
  id: number;
  streamerId: number;
  streamerName: string;
  title: string;
  startsAt: string; // UTC 문자열 (끝의 Z)
  durationMinutes: number;
}

// Streamer의 모든 칸 + 다가오는 일정
interface StreamerDetail extends Streamer {
  schedules: Schedule[];
}

const streamers: Streamer[] = [
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

// 값이 null일 수도 있을 때는 먼저 확인해야 안전하게 쓸 수 있어요 (타입 좁히기)
function describeAvatar(streamer: Streamer): string {
  if (streamer.avatarUrl !== null) {
    return `사진 주소 ${streamer.avatarUrl}`;
  }
  return '사진 없음';
}

for (const streamer of streamers) {
  console.log(`${streamer.name} (${streamer.platform}) ${describeAvatar(streamer)}`);
}

// typeof로도 좁힐 수 있어요: number | string 중 어느 쪽인지 확인해요
function viewerText(value: number | string): string {
  if (typeof value === 'number') {
    return `${value}명`;
  }
  return value;
}

// 찾으면 Streamer, 못 찾으면 null을 돌려줘요
function findById(id: number): Streamer | null {
  for (const streamer of streamers) {
    if (streamer.id === id) {
      return streamer;
    }
  }
  return null;
}

console.log(viewerText(128), viewerText('시청자 많음'));

// ?. 는 null이면 멈추고 undefined를 돌려줘요. ?? 는 비어 있을 때 대신 쓸 값이에요
console.log(findById(1)?.name ?? '찾지 못했어요');
console.log(findById(9)?.name ?? '찾지 못했어요');

// 상세 화면용 데이터: Streamer의 모든 칸 + schedules
const detail: StreamerDetail = {
  id: 1,
  name: '달빛곰',
  platform: 'chzzk',
  channelUrl: 'https://example.com/moonbear',
  bio: '밤마다 느긋하게 게임하는 곰이에요. 채팅 환영!',
  avatarUrl: null,
  createdAt: '2026-11-01T00:00:00Z',
  schedules: [
    {
      id: 1,
      streamerId: 1,
      streamerName: '달빛곰',
      title: '저녁 게임 방송',
      startsAt: '2026-11-02T11:00:00Z',
      durationMinutes: 120,
    },
  ],
};
console.log(`${detail.name}의 일정 ${detail.schedules.length}개`);

// ---------- 과제 ----------

// 과제 1: 게시판 목록 한 줄의 모양
interface PostListItem {
  id: number;
  title: string;
  authorName: string;
  createdAt: string;
}

const firstPost: PostListItem = {
  id: 1,
  title: '첫 글이에요',
  authorName: '팬1',
  createdAt: '2026-11-02T03:00:00Z',
};
console.log(`${firstPost.title} - ${firstPost.authorName}`);

// 과제 2: 플랫폼 이름을 한글로
function platformName(platform: Platform): string {
  if (platform === 'chzzk') {
    return '치지직';
  } else if (platform === 'youtube') {
    return 'YouTube';
  } else if (platform === 'soop') {
    return 'SOOP';
  }
  return '기타';
}

// 과제 3: 사진이 없으면 이름의 첫 글자를 대신 써요
function avatarText(streamer: Streamer): string {
  return streamer.avatarUrl ?? streamer.name.slice(0, 1);
}

for (const streamer of streamers) {
  console.log(`${platformName(streamer.platform)} · ${avatarText(streamer)}`);
}
```

`node dist\streamer.js`의 마지막 줄들은 이래요.

```text
첫 글이에요 - 팬1
치지직 · 달
YouTube · 픽
SOOP · 노
```
:::

## 🧯 자주 막히는 곳

여기에 없는 증상은 [문제 해결 모음](#/page/troubleshooting)에서 찾아보세요.

### `error TS2820: Type '"Chzzk"' is not assignable to type 'Platform'.` (대소문자)

```text
src/streamer.ts(32,5): error TS2820: Type '"Chzzk"' is not assignable to type 'Platform'. Did you mean '"chzzk"'?
```

**원인:** 리터럴 타입은 대소문자까지 똑같아야 해요. `'Chzzk'`와 `'chzzk'`는 다른 글자예요. 줄 번호는 내 파일에 따라 달라요.

**해결:** 오류가 가리키는 줄에서 `Did you mean` 뒤의 글자로 고치고 저장한 뒤 `npx tsc`를 다시 실행해요. 출력이 없으면 해결이에요.

### `error TS18047: 'streamer.avatarUrl' is possibly 'null'.`

```text
src/streamer.ts(61,18): error TS18047: 'streamer.avatarUrl' is possibly 'null'.
```

**원인:** 값이 `string | null`인데 `null`인 경우를 확인하지 않고 `.length`나 `.slice`를 썼어요. TypeScript가 "여기서 터질 수 있어요"라고 미리 알려 주는 거예요. 줄 번호와 이름은 내 코드에 따라 달라요.

**해결:**

1. 오류가 가리키는 값 앞에 `if (값 !== null) { … }`를 두어 안에서만 써요.
2. 또는 `값 ?? '대신 쓸 글자'`나 `값?.length`로 바꿔요.
3. `npx tsc`가 조용하면 해결이에요.

### `error TS2339: Property '…' does not exist on type '…'.`

**원인:** 칸 이름을 잘못 썼어요. 예: `streamer.nmae`. 오타와 비슷한 이름이 있으면 `Did you mean '…'?`로 시작해 `TS2551`이 나기도 해요.

**해결:** 오류에 보이는 타입의 칸 이름을 확인하고(타입 위에 마우스를 올려도 돼요) 맞는 이름으로 고쳐요.

### `interface` 안에서 쉼표와 세미콜론이 섞였어요

**원인:** 인터페이스의 칸 사이에는 쉼표(`,`)와 세미콜론(`;`) 둘 다 쓸 수 있어요. 오류는 아니에요. 다만 객체 값(`{ id: 1, name: '…' }`)은 쉼표만 써요.

**해결:** 이 교재는 인터페이스 칸에 세미콜론, 객체 값에 쉼표를 써요. 한 파일 안에서는 한 가지로 통일하세요.

### `Error: Cannot find module '…\dist\streamer.js'`

```text
Error: Cannot find module 'C:\dev\ts-practice\dist\streamer.js'
```

**원인:** `npx tsc`로 `.ts`를 `.js`로 바꾸기 전에 `node`를 실행했거나, 파일 이름을 틀렸어요. 경로는 내 폴더에 따라 달라요.

**해결:** `npx tsc`를 먼저 실행하고 오류가 없는지 확인한 뒤, `node dist\streamer.js`를 입력해요. 현재 위치가 `C:\dev\ts-practice`인지도 프롬프트에서 읽어요.

## 📝 오늘의 체크리스트

- [ ] `type Platform = …`으로 네 글자 중 하나만 가능한 타입을 만들었어요
- [ ] `Streamer`, `Schedule`, `StreamerDetail`(`extends`)을 레퍼런스와 같은 칸 이름으로 썼어요
- [ ] `node dist\streamer.js`가 `달빛곰 (chzzk) 사진 없음` 같은 줄 3개와 나머지 줄을 출력해요
- [ ] `'twitch'`를 넣었을 때 `error TS2322`가 나는 것을 직접 봤어요
- [ ] `if (… !== null)`, `?.`, `??`를 한 번씩 써 봤어요
- [ ] `?`와 `| null`의 차이를 한 문장으로 말할 수 있어요
- [ ] 과제 1~3을 풀고 정답과 비교했어요

## 📚 더 알아보기

- [TypeScript Handbook — Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html): 유니온 타입, 리터럴 타입, `interface`와 `type`의 차이를 공식 문서로 정리해요.
- [TypeScript Handbook — Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html): `typeof`와 `if`로 타입을 좁히는 방법을 더 많은 예시로 보여 줘요.
- [MDN — 옵셔널 체이닝(?.)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Optional_chaining): `?.`가 JavaScript에서 어떻게 동작하는지 설명해요.

➡️ **다음 Day 예고:** [Day 6 · 함수·제네릭·모듈](#/day/p2-d06)에서는 함수에 타입을 붙이는 법, 어떤 타입에도 쓸 수 있는 제네릭, 그리고 오늘 만든 파일을 `types.ts`와 `data.ts`로 쪼개 서로 가져다 쓰는 모듈을 배워요.
