## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- JavaScript에서는 실행해 봐야 알던 실수를 TypeScript가 실행하기 전에 알려 주는 것을 직접 볼 수 있어요.
- `tsconfig.json`을 만들고 `npx tsc`로 `.ts` 파일을 `.js` 파일로 바꿔 실행할 수 있어요.
- `string`, `number`, `boolean`, `string[]` 타입을 쓰고, 타입 표기와 타입 추론의 차이를 말할 수 있어요.
- `error TS2322: …` 같은 오류 메시지에서 파일, 줄, 칸, 오류 번호, 뜻을 읽고 고칠 수 있어요.

**예상 시간: 100분** (개념 이해 15분 · 따라하기 60분 · 과제 20분 · 정리 5분)

:::path 📂 시작 상태
[Day 3](#/day/p2-d03)의 "오늘 끝 상태 전체 코드"가 있어야 해요. 없거나 다르면 그 코드로 먼저 맞춰 주세요.

- `C:\dev\streamer-hub\README.md`, `C:\dev\streamer-hub\.git\`
- `C:\dev\ts-practice\package.json`, `C:\dev\ts-practice\package-lock.json`, `C:\dev\ts-practice\hello.js`, `C:\dev\ts-practice\node_modules\` (안에 `typescript`가 있어요)
- Node.js LTS가 설치되어 있어요. `node --version`이 `v22.22.2` 이상, `v24.15` 이상, `v26` 이상 중 하나로 나와요(작성 기준 v26.13.0).
- PowerShell에서 `npm --version`이 빨간 오류 없이 숫자를 보여 줘요(안 되면 [Day 3](#/day/p2-d03) 3단계).
- VS Code, Chrome 또는 Edge, Git, GitHub 계정이 있어요.
- 켜 두어야 할 프로그램은 없어요.
:::

## 📖 개념 이해

### 왜 TypeScript를 배우나요?

P1에서 JavaScript로 이런 실수를 해 본 적이 있을 거예요. 숫자라고 생각했는데 문자열이라서 `'3' + 1`이 `'31'`이 되거나, 속성 이름을 `title`이 아니라 `titel`로 잘못 써서 `undefined`가 나오거나요. JavaScript는 이런 실수를 **프로그램을 실행해서 그 줄에 도착해야** 알려 줘요. 어떤 실수는 아예 알려 주지도 않아요.

**비유:** 시험지를 낸 뒤 채점받는 것과, 쓰는 도중에 옆에서 선생님이 "그 칸에는 숫자를 써야 해요" 하고 알려 주는 것의 차이예요. TypeScript가 후자예요.

**정확한 정의:** **[[TypeScript]]**(타입스크립트)는 JavaScript에 **타입**을 더한 언어예요. 변수와 함수 값이 어떤 종류(숫자, 글자 등)인지 적어 두면, 실행하기 전에 잘못 쓴 곳을 찾아 줘요. 브라우저와 Node.js는 TypeScript를 바로 실행하지 못해요. 그래서 먼저 JavaScript로 바꿔요.

### 타입 표기와 타입 추론

- **[[정적 타입]]**(static typing)은 프로그램을 실행하기 **전에** 값의 종류를 검사하는 방식이에요. 변수에 한 번 정해진 종류는 함부로 바뀌지 않아요. TypeScript와 나중에 배울 C#이 모두 이 방식이에요.
- **[[타입 표기]]**(type annotation)는 변수나 함수에 "이건 이 종류예요"라고 직접 적는 것이에요. 이름 뒤에 `:`와 타입을 붙여요. 예: `let viewers: number = 128;`
- **[[타입 추론]]**(type inference)은 타입을 적지 않아도 TypeScript가 오른쪽 값을 보고 알아서 종류를 정하는 것이에요. 예: `const category = '게임';`이라고만 써도 `category`는 `string`으로 정해져요.

오늘 쓰는 기본 타입이에요.

| 타입 | 담는 것 | 예 |
|---|---|---|
| `string` | 글자 | `'저녁 방송'` |
| `number` | 숫자 | `128`, `2.5` |
| `boolean` | 참/거짓 | `true`, `false` |
| `string[]` | 글자의 배열 | `['게임', '수다']` |

```ts
let viewers: number = 128;
viewers = '많이';
```

두 번째 줄은 `viewers`에 글자를 넣으려 해서 오류가 나요. 이런 오류를 실행하기 전에 알려 주는 게 정적 타입의 힘이에요.

:::warn `any`는 가능하면 쓰지 않아요
타입 중에 `any`("뭐든 괜찮아요")가 있어요. 쓰면 오류가 사라져서 편하지만, 그 변수는 TypeScript의 검사를 받지 않아요. 안전장치를 끄는 것과 같아서 이 교재는 쓰지 않아요.
:::

### 컴파일, tsc, tsconfig.json

- **[[컴파일]]**(compile)은 사람이 쓴 코드를 컴퓨터가 실행할 수 있는 다른 형태의 코드로 바꾸는 일이에요. TypeScript에서는 `.ts` 파일을 `.js` 파일로 바꿔요. 이때 타입은 모두 지워지고 JavaScript만 남아요.
- **[[tsc]]**(티에스씨)는 TypeScript Compiler의 줄임말로, TypeScript를 검사하고 JavaScript로 바꾸는 명령이에요. 어제 설치한 `typescript` 패키지에 들어 있어요. `npx tsc`로 실행해요.
- **[[tsconfig.json]]**(티에스컨피그)은 `tsc`에게 "어느 폴더의 파일을, 어떤 규칙으로, 어디에 출력해라"를 알려 주는 설정 파일이에요. 프로젝트 폴더 맨 위에 둬요.
- **[[strict 모드]]**(스트릭트 모드)는 `tsconfig.json`의 `"strict": true`로 켜는, 가장 엄격한 검사 묶음이에요. 타입을 적지 않은 매개변수나 `null`일 수 있는 값의 사용 같은 위험한 코드를 오류로 잡아 줘요. 처음부터 켜 두면 습관이 좋아져요.

폴더의 흐름은 이렇게 돼요.

```text
src\hello.ts  (내가 쓰는 파일)
     │ npx tsc
     ▼
dist\hello.js (결과 JavaScript)
     │ node
     ▼
화면에 출력
```

원본은 항상 `src`의 `.ts` 파일이에요. `dist`의 `.js`는 매번 새로 만들어지는 결과물이라 직접 고치지 않아요.

:::info 실무에서는
요즘 웹 개발의 대부분은 TypeScript를 써요. 큰 프로젝트에서 사람이 눈으로 찾기 어려운 실수를 도구가 찾아 주기 때문이에요. 이 책의 스트리머 허브도 화면은 TypeScript, 서버는 C#(역시 정적 타입 언어)으로 만들어요. 오늘 배우는 감각이 서버를 만들 때도 그대로 쓰여요.
:::

## 🛠️ 따라하기

모두 6단계예요. 연습 폴더는 `C:\dev\ts-practice`이고 Git에는 올리지 않아요.

### 1단계 · 연습 폴더를 VS Code로 열기 (5분)

**어디서:** 터미널(PowerShell)

**무엇을:** 터미널을 열어요. 시작 버튼을 오른쪽 클릭하고 **터미널**을 클릭해요. 이어서 한 줄씩 입력해요.

```powershell
cd C:\dev\ts-practice
```

```powershell
code .
```

새 VS Code 창이 열리면 왼쪽 탐색기 맨 위에 `TS-PRACTICE`가 보여요. 창 안에서 `` Ctrl + ` ``를 눌러 터미널을 열고 프롬프트가 `PS C:\dev\ts-practice>`인지 읽어요.

```powershell
node --version
```

예상 출력(숫자는 달라도 돼요):

```text
v26.13.0
```

:::success
탐색기에 `hello.js`, `package.json`, `package-lock.json`, `node_modules`가 보이고, 터미널 프롬프트가 `PS C:\dev\ts-practice>`예요. 이 VS Code 창을 오늘 계속 써요.
:::

### 2단계 · JavaScript에서 실행해야 알던 실수 보기 (7분)

TypeScript가 왜 필요한지 눈으로 확인해요. 터미널에서 Node.js로 JavaScript를 직접 실행해 봐요. `node -e "코드"`는 파일을 만들지 않고 따옴표 안의 JavaScript 한 줄을 바로 실행하는 방법이에요. `-e`는 evaluate(계산해 봐요)의 줄임이에요.

**어디서:** VS Code 터미널, 위치 `C:\dev\ts-practice`

**무엇을:** 한 줄씩 입력해요. 따옴표는 큰따옴표가 겉에, 작은따옴표가 안쪽이에요.

```powershell
node -e "console.log('128' + 2)"
```

예상 출력:

```text
1282
```

숫자 128에 2를 더했는데 `1282`가 나왔어요. `'128'`이 글자라서 더하기가 아니라 글자 이어 붙이기가 됐어요([P1 Day 15](#/day/p1-d15)에서 본 모양이에요). 오류는 한 줄도 없어요.

```powershell
node -e "const stream = { title: '저녁 방송' }; console.log(stream.titel)"
```

예상 출력:

```text
undefined
```

속성 이름이 틀렸는데도 오류 없이 `undefined`가 나와요. 둘 다 사람이 눈으로 찾아야 하는 실수예요. 이제 TypeScript에서는 어떻게 되는지 볼게요.

:::success
`1282`와 `undefined`가 나왔어요. 오류 메시지는 없었어요. JavaScript는 이런 실수를 조용히 넘어가요.
:::

### 3단계 · `@types/node` 설치하고 `tsconfig.json` 만들기 (13분)

`tsc`가 일하려면 설정 파일이 필요해요. `npx tsc --init`이 기본 설정 파일을 만들어 줘요. 그리고 `console`, `process` 같은 Node.js의 기능을 TypeScript가 알게 하려면 타입 정보 패키지 `@types/node`가 필요해요.

**어디서:** VS Code 터미널, 위치 `C:\dev\ts-practice`

**무엇을:**

```powershell
npm i -D @types/node
```

예상 출력(숫자는 달라도 돼요):

```text
added 2 packages, and audited 5 packages in 2s

found 0 vulnerabilities
```

```powershell
npx tsc --init
```

예상 출력:

```text
Created a new tsconfig.json

You can learn more at https://aka.ms/tsconfig
```

탐색기에 `tsconfig.json`이 생겼어요. 클릭해서 열어요. 주석(`//`로 시작하는 줄)이 많은 파일이에요. 이 기본 파일에는 우리에게 필요 없는 옵션이 많고, 두 줄(`"types": []`과 주석 처리된 `"rootDir"`, `"outDir"`)은 고쳐야 해요. 실수를 줄이려고 파일 **전체를 지우고 아래 내용으로 바꿔요**.

1. 편집 창을 클릭하고 `Ctrl + A`로 모두 선택한 뒤 `Delete` 키를 눌러요.
2. 아래 내용을 입력하거나 복사해서 붙여 넣어요.
3. `Ctrl + S`로 저장해요.

📄 C:\dev\ts-practice\tsconfig.json
```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "module": "nodenext",
    "target": "esnext",
    "types": ["node"],
    "strict": true,
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "skipLibCheck": true
  }
}
```

각 줄의 뜻이에요. 지금 다 이해할 필요는 없어요.

- `"rootDir": "./src"`: 원본 `.ts` 파일은 `src` 폴더에 있어요.
- `"outDir": "./dist"`: 결과 `.js` 파일은 `dist` 폴더에 만들어요.
- `"module": "nodenext"`, `"target": "esnext"`: Node.js가 이해하는 최신 JavaScript로 바꿔요.
- `"types": ["node"]`: 방금 설치한 `@types/node`를 써요. 이 줄이 없으면 `console`이나 `process`를 쓸 때 `error TS2591`이 나요.
- `"strict": true`: 엄격한 검사를 켜요.
- `"verbatimModuleSyntax": true`: `import`와 `export`를 쓴 그대로 남겨요. Day 6에서 다시 나와요.
- `"isolatedModules"`, `"skipLibCheck"`: 파일 단위 검사와 라이브러리 검사 생략 옵션이에요. 몰라도 돼요.

:::info 기본 파일에서 일부러 뺀 것
`tsc --init`이 만든 기본 파일에는 `sourceMap`, `declaration`(결과 폴더에 지도 파일과 설명 파일을 더 만들어요), `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`(검사를 더 까다롭게 해요)도 들어 있어요. 연습 결과 폴더를 단순하게 하고, Day 7에서 만들 진짜 프로젝트의 설정과 같게 맞추려고 뺐어요.
:::

:::success
`tsconfig.json`이 위 내용으로 저장되었고, 탭 이름 옆에 점(●)이 없어요. `package.json`의 `devDependencies`에 `@types/node`가 더해졌어요.
:::

### 4단계 · 첫 TypeScript 파일을 만들고 변환해서 실행하기 (13분)

**어디서:** VS Code → 왼쪽 탐색기 → `TS-PRACTICE` 폴더

**무엇을:**

1. `TS-PRACTICE` 줄에 마우스를 올리고 **새 폴더**(폴더에 + 모양) 아이콘을 클릭해요. 이름 칸에 `src`를 입력하고 `Enter`를 눌러요.
2. 방금 만든 `src` 폴더를 클릭해서 선택하고, **새 파일** 아이콘을 클릭해요. 이름 칸에 `hello.ts`를 입력하고 `Enter`를 눌러요.
3. 편집 창에 아래 내용을 입력해요. 오타가 걱정되면 복사 버튼을 써도 돼요.
4. `Ctrl + S`로 저장해요.

📄 C:\dev\ts-practice\src\hello.ts
```ts
// 타입 표기: 변수 이름 뒤에 : 타입
const streamTitle: string = '저녁 게임 방송';
let viewers: number = 128;
const isLive: boolean = true;
const tags: string[] = ['게임', '수다'];

// 타입 추론: 오른쪽 값을 보고 TypeScript가 알아서 정해요
const category = '게임';

// 매개변수와 반환값에도 타입을 적어요
function describeStream(title: string, count: number): string {
  return `${title} - ${count}명 시청 중`;
}

viewers = viewers + 2;

console.log(describeStream(streamTitle, viewers));
console.log(`분류: ${category}, 라이브: ${isLive}, 태그: ${tags.join(', ')}`);
```

5. `category` 위에 마우스를 올려 보세요. `const category: "게임"`이라고 추론된 타입이 보여요. `const`라서 값이 바뀌지 않으니 `"게임"` 그 글자 자체가 타입이에요. 같은 방법으로 `streamTitle`에 마우스를 올리면 `const streamTitle: string`이라고 보여요.
   코드 마지막 줄의 `tags.join(', ')`는 배열의 칸들을 `, `(쉼표와 빈칸)로 이어 붙여 글자 하나로 만드는 메서드예요. `['게임', '수다']`가 `게임, 수다`가 돼요. P1의 문자열 메서드처럼 배열 뒤에 `.`을 붙여 써요.
6. 터미널에서 변환해요. 아무 옵션 없이 `tsc`만 쳐요.

```powershell
npx tsc
```

아무것도 나오지 않고 프롬프트가 돌아오면 **성공**이에요. 오류가 없다는 뜻이에요. 탐색기에 `dist` 폴더가 생겼는지 봐요.

7. 만들어진 JavaScript를 Node.js로 실행해요.

```powershell
node dist\hello.js
```

예상 출력:

```text
저녁 게임 방송 - 130명 시청 중
분류: 게임, 라이브: true, 태그: 게임, 수다
```

8. `dist\hello.js`를 열어 봐요. 타입 표기가 모두 사라지고 JavaScript만 남은 것을 볼 수 있어요. 마지막 줄의 `export {};`는 이 파일이 모듈이라는 표시예요. 지금은 무시해도 돼요.

:::success
- `npx tsc`가 아무것도 출력하지 않고 끝났어요.
- 탐색기에 `dist\hello.js`가 생겼고, `node dist\hello.js`가 두 줄을 출력해요.
- `dist\hello.js`에는 `: string`이나 `: number` 같은 타입 표기가 없어요.
:::

### 5단계 · 일부러 오류 내고 읽고 고치기 (14분)

TypeScript의 진짜 가치는 오류를 알려 주는 순간에 있어요. 일부러 틀려 봐요.

**어디서:** VS Code → `src\hello.ts`

**무엇을:**

1. `src\hello.ts`에서 `viewers = viewers + 2;` 줄 바로 아래에 새 줄을 만들고 아래 한 줄을 입력해요. 저장해요(`Ctrl + S`).

```ts
viewers = '많이';
```

2. 방금 입력한 줄에 빨간 물결 밑줄이 생겨요. 밑줄 위에 마우스를 올려요. 말풍선에 오류 설명이 나타나요. 한국어 화면에서는 한국어로 보일 수 있어요.
3. 터미널에서 `npx tsc`를 실행해요.

```powershell
npx tsc
```

예상 출력(줄 번호는 내 파일의 줄 수에 따라 달라요. `16,1`이면 16번째 줄 첫 칸이에요):

```text
src/hello.ts(16,1): error TS2322: Type 'string' is not assignable to type 'number'.
```

오류 메시지는 네 부분으로 읽어요.

- `src/hello.ts`: 어느 파일인지 알려 줘요.
- `(16,1)`: 16번째 줄의 1번째 글자예요. 줄 번호는 에디터 왼쪽에도 보여요.
- `error TS2322`: 오류 번호예요. 인터넷에서 검색할 때 이 번호를 써요.
- `Type 'string' is not assignable to type 'number'.`: 뜻이에요. "글자를 숫자 자리에 넣을 수 없다"예요.

풀이: `viewers`는 `number`라고 정했는데 글자 `'많이'`를 넣으려 해서 막혔어요. 오류 번호 `TS2322`는 "이 종류의 값을 저 종류의 자리에 넣을 수 없다"는 오류예요. 앞으로 가장 자주 볼 오류예요.

4. 고쳐요. 방금 추가한 줄을 `viewers = 300;`로 바꾸고 저장해요.

```ts
viewers = 300;
```

5. 다시 변환해요.

```powershell
npx tsc
```

아무것도 나오지 않으면 성공이에요. 실행해서 숫자를 확인해요.

```powershell
node dist\hello.js
```

예상 출력:

```text
저녁 게임 방송 - 300명 시청 중
분류: 게임, 라이브: true, 태그: 게임, 수다
```

6. `strict` 모드가 켜져 있어서 잡히는 오류도 하나 봐요. `src\hello.ts` 맨 아래에 빈 줄을 하나 두고 새 함수를 입력하고 저장한 뒤 `npx tsc`를 실행해요.

```ts
function double(n) {
  return n * 2;
}
```

예상 출력(줄 번호는 내 파일에 따라 달라도 돼요):

```text
src/hello.ts(21,17): error TS7006: Parameter 'n' implicitly has an 'any' type.
```

풀이: "매개변수 `n`의 타입을 적지 않아서 `any`(뭐든 괜찮은 타입)가 된다"는 뜻이에요. `strict`가 이런 빈틈을 오류로 알려 줘요. 이 세 줄을 지워서 원래대로 돌려놓아요. `n`에 `number`를 적어도 되지만 오늘은 쓰지 않을 함수라서 지워요.

:::success
- 잘못된 줄에서 `error TS2322`가 나오고, 고치면 `npx tsc`가 조용해졌어요.
- 마지막 실험의 `error TS7006`을 읽고, 세 줄을 지운 뒤 `npx tsc`를 다시 실행하면 출력이 없어요.
- 오류가 있어도 `dist`에 파일이 만들어질 수 있어요. 그래도 오류가 있는 채로 실행하는 습관은 만들지 않아요.
:::

### 6단계 · 타입이 지워지는 것 확인하기 (8분)

설정 파일 없이 파일 하나만 변환해 보면 "타입은 사라지고 JavaScript만 남는다"가 더 잘 보여요. 그런데 `tsconfig.json`이 있는 폴더에서는 이 방식이 막혀 있어요. 막히는 모습을 먼저 봐요.

**어디서:** VS Code 터미널, 위치 `C:\dev\ts-practice`

**무엇을:**

```powershell
npx tsc src\hello.ts --outDir out
```

예상 출력:

```text
error TS5112: tsconfig.json is present but will not be loaded if files are specified on commandline. Use '--ignoreConfig' to skip this error.
```

풀이: "설정 파일이 있는데 파일 이름을 직접 적으면 설정이 무시되니, 정말 무시하려면 `--ignoreConfig`를 붙이라"는 뜻이에요. 설정을 무시한다고 명시하고 다시 실행해요.

```powershell
npx tsc --ignoreConfig src\hello.ts --outDir out
```

아무것도 나오지 않으면 성공이에요. 탐색기에 `out` 폴더가 생기고 `hello.js`가 있어요. 열어서 `dist\hello.js`와 비교해 봐요. 설정이 달라서 맨 위에 `"use strict";` 줄이 붙고 맨 아래의 `export {};` 줄이 없다는 차이가 있지만, 타입이 없는 JavaScript인 건 같아요. 확인했으면 지워요.

:::warn 지울 폴더의 경로를 확인하세요
`Remove-Item`은 휴지통 없이 바로 지워요. `C:\dev\ts-practice\out`만 지워요.
:::

```powershell
Remove-Item -Recurse -Force C:\dev\ts-practice\out
```

:::success
`TS5112` 오류를 읽었고, `--ignoreConfig`로 `out\hello.js`를 만들었고, `out` 폴더를 지웠어요. `dist`와 `src`는 그대로 남아 있어요.
:::

## ✍️ 과제

### 과제 1 · 타입 표기와 추론 섞어 쓰기 (쉬움 ⭐, 7분)

- `src\hello.ts` 맨 아래에 변수 5개를 만들어요. 3개는 타입을 직접 적고(`: number` 등), 2개는 타입을 적지 않고 값만 써서 추론에 맡겨요.
- 변수 이름은 `followers`(숫자, 표기), `channelName`(글자, 표기), `isSubscribed`(참/거짓, 표기), `nickname`(글자, 추론), `rating`(숫자, 추론)로 해요.
- 확인: 추론한 변수 위에 마우스를 올리면 `string`, `number`가 보여요. `npx tsc`가 조용해요.
- 힌트: `const nickname = '달빛곰';`처럼 값만 쓰면 돼요.

### 과제 2 · 오류 3개 고치기 (보통 ⭐⭐, 8분)

- `src\mistakes.ts`라는 새 파일을 만들고 아래 코드를 그대로 붙여 넣어요. `npx tsc`가 오류 3개를 내요.
- 오류 3개의 번호(`TS2322`, `TS2345`, `TS2339`)와 줄을 찾고, 코드를 고쳐서 오류 0개로 만들어요.
- 확인: `npx tsc`가 아무것도 출력하지 않아요. 다 하고 나면 `src\mistakes.ts`와 `dist\mistakes.js`를 지워요.

📄 C:\dev\ts-practice\src\mistakes.ts
```ts
let viewers: number = 128;
viewers = '많이';

function formatViewers(count: number): string {
  return `${count}명`;
}
console.log(formatViewers('백이십팔'));

const stream = { title: '저녁 방송', viewers: 10 };
console.log(stream.tags);
```

- 힌트: 첫째는 `number`에 글자를 넣었어요. 둘째는 숫자 자리에 글자를 건넸어요. 셋째는 `stream`에 없는 이름을 썼어요. 마지막 오류는 `stream`에 있는 속성 이름으로 고쳐요.

### 과제 3 · 함수에 타입 붙이기 (쉬움 ⭐, 5분)

- `src\hello.ts`에 `formatViewers`라는 함수를 만들어요. 숫자를 받아 `128명`처럼 글자로 돌려줘요.
- 매개변수와 반환값에 타입을 적어요: `function formatViewers(count: number): string`.
- `console.log(formatViewers(1500));`로 확인해요. 출력은 `1500명`이에요.
- 힌트: 템플릿 리터럴 `` `${count}명` ``을 `return`해요.

## ✅ 정답

:::answer 과제 1 정답 · 타입 표기와 추론
`src\hello.ts` 맨 아래에 더한 부분이에요.

```ts
// 과제 1: 타입 표기 3개, 추론 2개
let followers: number = 1200;
const channelName: string = '달빛곰 방송국';
let isSubscribed: boolean = false;
const nickname = '달빛곰';
let rating = 4.5;
console.log(followers, channelName, isSubscribed, nickname, rating);
```

**왜 이렇게 하나요?** 값을 바로 대입할 때는 타입을 적지 않아도 TypeScript가 알아서 정해요. `nickname`은 `string`, `rating`은 `number`로 추론돼요. 값을 나중에 넣는 변수나 함수 매개변수처럼 TypeScript가 짐작할 수 없는 곳에서는 직접 적어요. `const`는 값이 바뀌지 않으므로 `nickname`에 마우스를 올리면 `"달빛곰"`처럼 글자 자체가 타입으로 보일 수 있어요. 틀린 게 아니에요.
:::

:::answer 과제 2 정답 · 오류 3개 고치기
오류 원문은 이렇게 나와요.

```text
src/mistakes.ts(2,1): error TS2322: Type 'string' is not assignable to type 'number'.
src/mistakes.ts(7,27): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
src/mistakes.ts(10,20): error TS2339: Property 'tags' does not exist on type '{ title: string; viewers: number; }'.
```

고친 파일이에요.

📄 C:\dev\ts-practice\src\mistakes.ts
```ts
let viewers: number = 128;
viewers = 300;

function formatViewers(count: number): string {
  return `${count}명`;
}
console.log(formatViewers(128));

const stream = { title: '저녁 방송', viewers: 10 };
console.log(stream.title);
```

**왜 이렇게 하나요?** `TS2322`는 값을 변수에 넣을 수 없을 때, `TS2345`는 함수에 건넨 값(인수)이 매개변수 종류와 다를 때, `TS2339`는 객체에 없는 속성을 읽을 때 나와요. 오류 번호만 알아도 검색해서 원인을 찾을 수 있어요. 고친 뒤에는 연습 파일이므로 `src\mistakes.ts`와 `dist\mistakes.js`를 지워요.

```powershell
Remove-Item C:\dev\ts-practice\src\mistakes.ts
Remove-Item C:\dev\ts-practice\dist\mistakes.js
```
:::

:::answer 과제 3 정답 · formatViewers
```ts
// 과제 3: 매개변수와 반환값에 타입을 붙인 함수
function formatViewers(count: number): string {
  return `${count}명`;
}

console.log(formatViewers(1500));
```

**왜 이렇게 하나요?** 함수 매개변수는 값이 어디서 올지 TypeScript가 알 수 없어서 타입을 직접 적어야 해요(`strict`가 이것을 확인해요). 반환값 타입 `: string`은 적지 않아도 추론되지만, 적어 두면 "이 함수는 글자를 돌려준다"는 약속이 코드에 남아요. `formatViewers('1500')`처럼 글자를 건네면 `TS2345`가 나요.
:::

:::answer 오늘 끝 상태 전체 코드
오늘 따라하기와 과제를 모두 끝낸 상태예요. 막혔다면 아래 파일들을 이대로 만들고 Day 5를 시작하세요. `package.json`과 `node_modules`는 `npm i -D @types/node`가 바꿔 주고, `dist`는 `npx tsc`가 만들어요.

```text
C:\dev\ts-practice\
├─ node_modules\
├─ dist\   (tsc가 만든 결과)
│  └─ hello.js
├─ src\
│  └─ hello.ts
├─ hello.js
├─ package-lock.json
├─ package.json
└─ tsconfig.json
```

📄 C:\dev\ts-practice\tsconfig.json
```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "module": "nodenext",
    "target": "esnext",
    "types": ["node"],
    "strict": true,
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "skipLibCheck": true
  }
}
```

📄 C:\dev\ts-practice\src\hello.ts
```ts
// 타입 표기: 변수 이름 뒤에 : 타입
const streamTitle: string = '저녁 게임 방송';
let viewers: number = 128;
const isLive: boolean = true;
const tags: string[] = ['게임', '수다'];

// 타입 추론: 오른쪽 값을 보고 TypeScript가 알아서 정해요
const category = '게임';

// 매개변수와 반환값에도 타입을 적어요
function describeStream(title: string, count: number): string {
  return `${title} - ${count}명 시청 중`;
}

viewers = viewers + 2;
viewers = 300;

console.log(describeStream(streamTitle, viewers));
console.log(`분류: ${category}, 라이브: ${isLive}, 태그: ${tags.join(', ')}`);

// 과제 1: 타입 표기 3개, 추론 2개
let followers: number = 1200;
const channelName: string = '달빛곰 방송국';
let isSubscribed: boolean = false;
const nickname = '달빛곰';
let rating = 4.5;
console.log(followers, channelName, isSubscribed, nickname, rating);

// 과제 3: 매개변수와 반환값에 타입을 붙인 함수
function formatViewers(count: number): string {
  return `${count}명`;
}

console.log(formatViewers(1500));
```

`package.json`의 `devDependencies`에는 `@types/node`와 `typescript`가 둘 다 들어 있어요(버전 숫자는 달라도 돼요).

```json
  "devDependencies": {
    "@types/node": "^26.6.6",
    "typescript": "^7.0.2"
  }
```
:::

## 🧯 자주 막히는 곳

여기에 없는 증상은 [문제 해결 모음](#/page/troubleshooting)에서 찾아보세요.

### `error TS5112: tsconfig.json is present but will not be loaded if files are specified on commandline.`

```text
error TS5112: tsconfig.json is present but will not be loaded if files are specified on commandline. Use '--ignoreConfig' to skip this error.
```

**원인:** `tsconfig.json`이 있는 폴더에서 `npx tsc src\hello.ts`처럼 파일 이름을 적으면, tsc가 설정 파일을 읽지 않기 때문에 막아요.

**해결:** 설정대로 변환할 거라면 파일 이름 없이 `npx tsc`만 입력해요. 설정 없이 파일 하나만 변환하려면 `npx tsc --ignoreConfig src\hello.ts --outDir out`처럼 `--ignoreConfig`를 붙여요.

### `error TS2591: Cannot find name 'process'.` (또는 `console`)

```text
src/p.ts(1,13): error TS2591: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node` and then add 'node' to the types field in your tsconfig.
```

**원인:** Node.js의 기능을 TypeScript가 모르고 있어요. `@types/node`가 설치되지 않았거나, `tsconfig.json`에 `"types": ["node"]`가 없어요(기본값은 `"types": []`). 파일 이름과 줄 번호는 내 파일에 따라 달라요.

**해결:**

1. 터미널에서 `npm i -D @types/node`를 실행해요.
2. `tsconfig.json`에서 `"types": ["node"]`가 있는지 확인하고, 없으면 3단계의 파일 내용으로 바꿔요.
3. `npx tsc`를 다시 실행해서 오류가 사라지면 해결이에요.

### `error TS1295: ECMAScript imports and exports cannot be written in a CommonJS file under 'verbatimModuleSyntax'.`

```text
src/main.ts(1,10): error TS1295: ECMAScript imports and exports cannot be written in a CommonJS file under 'verbatimModuleSyntax'. Adjust the 'type' field in the nearest 'package.json' to make this file an ECMAScript module, or adjust your 'verbatimModuleSyntax', 'module', and 'moduleResolution' settings in TypeScript.
```

**원인:** `package.json`에 `"type": "module"`이 없어요. [Day 3](#/day/p2-d03) 4단계에서 `npm pkg set type=module`을 빠뜨렸을 때 나와요. 오늘은 `import`를 쓰지 않아서 보이지 않지만, Day 6에서 만나요. 같은 원인으로 `export`를 쓰면 `TS1287`이 나기도 해요.

**해결:** 터미널에서 `npm pkg set type=module`을 실행하고, `package.json`에 `"type": "module"`이 생겼는지 확인해요.

### `npx tsc`가 아무것도 출력하지 않아요

**원인:** 오류가 없다는 뜻이에요. `tsc`는 성공하면 조용해요. 오류가 있을 때만 말을 해요.

**해결:** 탐색기에서 `dist` 폴더에 `hello.js`가 있는지 확인하고 `node dist\hello.js`를 실행해 보세요. 출력이 나오면 정상이에요.

### `dist\hello.js`를 고쳤는데 다음 변환 때 사라졌어요

**원인:** `dist`는 `npx tsc`를 실행할 때마다 새로 만들어지는 결과 폴더예요. 원본은 `src\hello.ts`예요.

**해결:** 고칠 때는 항상 `src`의 `.ts` 파일을 고치고, `npx tsc`를 다시 실행해요.

### 빨간 밑줄이 안 사라지거나 터미널과 VS Code가 다른 말을 해요

**원인:** VS Code가 오래된 검사 결과를 들고 있어요. 터미널의 `npx tsc`가 조용한데 편집기에만 빨간 밑줄이 남아 있을 수 있어요.

**해결:**

1. `Ctrl + Shift + P`를 눌러 명령 팔레트를 열어요.
2. `TypeScript: Restart TS Server`(영어)를 입력하고 목록에서 클릭해요. 한국어 화면에서 안 보이면 `TypeScript`까지만 입력해서 비슷한 이름을 찾아요.
3. 몇 초 뒤 밑줄이 사라지면 해결이에요.

## 📝 오늘의 체크리스트

- [ ] `node -e`로 JavaScript가 `1282`와 `undefined`를 오류 없이 내는 것을 봤어요
- [ ] `npx tsc --init`으로 `tsconfig.json`을 만들고 3단계의 내용으로 바꿨어요
- [ ] `npx tsc`가 출력 없이 끝나고 `node dist\hello.js`가 두 줄을 출력해요
- [ ] 일부러 낸 `error TS2322`의 파일, 줄, 칸, 오류 번호, 뜻을 읽고 고쳤어요
- [ ] 타입 표기와 타입 추론의 차이를 한 문장씩 말할 수 있어요
- [ ] `TS5112`를 읽고 `--ignoreConfig`로 변환한 뒤 `out` 폴더를 지웠어요
- [ ] 과제 1~3을 풀고 정답과 비교했어요(`src\mistakes.ts`는 지웠어요)

## 📚 더 알아보기

- [TypeScript Handbook — The Basics](https://www.typescriptlang.org/docs/handbook/2/basic-types.html): 오늘 쓴 기본 타입과 타입 추론을 공식 문서로 정리해요.
- [TypeScript — tsconfig 레퍼런스](https://www.typescriptlang.org/tsconfig/): `tsconfig.json`의 옵션을 하나씩 찾아볼 수 있어요.
- [MDN — JavaScript 자료형](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures): TypeScript의 기본 타입이 바탕으로 삼는 JavaScript의 자료형을 보여 줘요.

➡️ **다음 Day 예고:** [Day 5 · 타입 설계](#/day/p2-d05)에서는 스트리머 허브에서 쓸 `Platform`, `Streamer` 같은 타입을 직접 설계하고, 값이 `null`일 수 있을 때 안전하게 쓰는 방법을 배워요.
