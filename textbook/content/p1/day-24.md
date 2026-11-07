## 🎯 오늘의 목표

오늘이 끝나면 이렇게 할 수 있어요.

- 문의 폼을 빈 채로 **보내기** 하면 이름·이메일·내용 칸 아래에 빨간 안내 문장이 나오고, 커서가 첫 번째 오류 칸으로 가요.
- 칸을 고치는 동안 그 칸의 안내가 바로 사라지고, 모두 맞으면 초록색 성공 문장이 나와요.
- `pattern`과 정규 표현식이 "글자 모양을 검사하는 규칙"이라는 것을 설명하고, 닉네임 규칙을 읽을 수 있어요.
- 폼을 보냈을 때 페이지가 새로 고침되지 않게 하는 `preventDefault`의 역할을 설명할 수 있어요.

**예상 시간: 120분** (개념 이해 28분 · 따라하기 62분 · 과제 20분 · 정리 10분)

:::path 📂 시작 상태
어제(Day 23)까지 만든 파일이 이렇게 있어야 해요. 없거나 다르면 [Day 23](#/day/p1-d23)의 "오늘 끝 상태 전체 코드"로 맞춰 주세요.

- `C:\dev\my-creator-site\about.html`
- `C:\dev\my-creator-site\contact.html`
- `C:\dev\my-creator-site\contents.html`
- `C:\dev\my-creator-site\index.html`
- `C:\dev\my-creator-site\schedule.html`
- `C:\dev\my-creator-site\css\style.css`
- `C:\dev\my-creator-site\images\logo.svg`
- `C:\dev\my-creator-site\images\profile.svg`
- `C:\dev\my-creator-site\images\thumb-game.svg`
- `C:\dev\my-creator-site\images\thumb-music.svg`
- `C:\dev\my-creator-site\images\thumb-talk.svg`
- `C:\dev\my-creator-site\js\contents.js`
- `C:\dev\my-creator-site\js\main.js`
- 연습 폴더 `C:\dev\hello\`에 `hello.html`, `favorites.html`, `tools.html`, `links.html`, `plan.html`, `lab.html`, `lab.js`, `pages\back.html`이 있어요(오늘은 열지 않아도 돼요).
- VS Code에서 `C:\dev\my-creator-site` 폴더가 열려 있고, 한국어 팩과 Live Preview 확장 프로그램이 설치되어 있어요.
- 파일 탐색기의 **보기 → 표시 → 파일 확장명**이 켜져 있어요.
- Git이 설치되어 있고(`git --version` → `git version 2.56.0.windows.4`, 숫자는 달라도 돼요) GitHub의 공개(Public) 저장소 `https://github.com/<내 아이디>/my-creator-site`와 연결되어 있어요.
- GitHub Pages가 켜져 있어요: `https://<내 아이디>.github.io/my-creator-site/`
- 어제까지의 변경이 모두 커밋·푸시되어 소스 제어 패널의 변경이 0개예요.
:::

## 📖 개념 이해

### 폼 검증: 보내기 전에 틀린 곳을 알려 줘요

**비유:** 우체국 창구에서 우편물을 접수하기 전에 직원이 "받는 사람 주소가 비었어요", "우편번호가 5자리가 아니에요"라고 알려 주면, 잘못 보낸 우편물이 되돌아오는 일이 줄어요.

**정확한 정의:** **[[폼 검증]]**(form validation)은 폼에 입력한 값이 규칙에 맞는지 보내기 전에 검사하고, 틀린 곳을 알려 주는 일이에요.

검사는 두 층으로 해요.

1. **HTML 속성:** `required`(꼭 써야 해요), `type="email"`(이메일 모양), `pattern`(글자 모양 규칙). 브라우저가 검사해요.
2. **JavaScript:** 브라우저의 기본 말풍선 대신 내가 원하는 문장과 위치로 안내해요. 규칙을 더 자세히 정할 수도 있어요.

우리 폼은 `<form … novalidate>`로 시작해요. `novalidate`는 "브라우저의 기본 말풍선 안내는 끄고, 내 JavaScript가 안내할게요"라는 뜻이에요. 그래도 `required`, `pattern` 속성은 지우지 않아요. 입력칸이 이 속성에서 읽을 값(예: `pattern`)을 JavaScript가 가져다 써요.

:::warn 브라우저 검사는 사용자를 돕는 것일 뿐이에요
브라우저와 JavaScript의 검사는 누구나 개발자 도구로 끌 수 있어요. 진짜 서비스에서는 서버가 값을 **다시 한 번** 검사해야 해요. 이 교재는 폼을 실제로 전송하지 않는 연습용이고, 서버에서 받는 일은 P2에서 만들어요.
:::

### 정규 표현식: 글자 모양 검사기

닉네임은 "한글·영문·숫자·밑줄만, 2~20글자, 공백 없이"라는 규칙이 있어요. 이런 "글자의 모양"을 적는 짧은 기호식이 **[[정규 표현식]]**(regular expression, 줄여서 정규식)이에요. 우리 HTML에 이미 한 번 나와요.

```text
pattern="[A-Za-z0-9가-힣_]{2,20}"
```

한 조각씩 읽어요.

- `[ … ]`: 대괄호는 "이 안에 있는 글자 중 하나"예요.
- `A-Za-z`: 영어 대문자·소문자 전부. `0-9`: 숫자. `가-힣`: 완성된 한글 글자 전부. `_`: 밑줄.
- `{2,20}`: 바로 앞 조각이 2번 이상 20번 이하 반복돼요. 그러니까 글자가 2~20개예요.

그래서 `달빛곰`, `moon_bear`는 통과해요. `달빛 곰`(빈칸 포함), `ㅋㅋ`(자음만 있는 글자는 완성된 글자 `가-힣`이 아니에요), `a`(1글자)는 실패해요. `pattern` 속성은 값 전체가 규칙과 맞아야 해서, 앞뒤에 `^`와 `$`를 따로 쓰지 않아요.

JavaScript에서는 정규식을 슬래시 두 개 사이에 써요. 이메일 모양 검사는 이렇게 생겼어요.

```js
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
emailPattern.test('name@example.com'); // true
emailPattern.test('abc');              // false
```

처음 보면 암호 같지만 조각으로 읽으면 쉬워요.

- `^`: 글자의 맨 처음. `$`: 글자의 맨 끝. 그러니까 "전체가 이 모양이어야 해요".
- `[^\s@]`: 대괄호 안의 `^`는 "아닌 글자"예요. `\s`는 빈칸 종류 글자, 그러니까 "빈칸도 `@`도 아닌 글자 하나".
- `+`: 바로 앞 조각이 1번 이상 반복돼요.
- `@`: 글자 그대로 `@`.
- `\.`: 점 글자 그대로. 점(`.`)은 정규식에서 "아무 글자"라는 특별한 뜻이라 `\`(역슬래시)를 앞에 붙여 "진짜 점"이라고 알려요.

합치면 **"빈칸·@ 없는 글자들 + @ + 빈칸·@ 없는 글자들 + 점 + 빈칸·@ 없는 글자들"** 이라는 뜻이에요. `.test(값)`은 값이 이 모양과 맞으면 `true`, 아니면 `false`를 돌려줘요.

:::info 실무에서는
완벽한 이메일 검사는 정규식만으로 불가능해요. 이 정규식은 "대충 이메일처럼 생겼는지"만 보는 모양 검사기예요. 실제 서비스는 이 정도 모양 검사 뒤에 인증 메일을 보내서 진짜 주소인지 확인해요. 정규식은 오늘 맛보기이고, 필요할 때 조각을 찾아 읽으면 돼요.
:::

### 제약 조건 검증 API: HTML 규칙을 JavaScript에서 다시 쓰기

닉네임 규칙을 HTML `pattern`에 적어 두었는데, JavaScript에서 같은 규칙을 또 적으면 두 곳을 같이 고쳐야 해요. **[[제약 조건 검증 API]]**(Constraint Validation API)는 HTML 입력칸의 검사 결과를 JavaScript에서 읽게 해 주는 브라우저 기능이에요. 입력칸의 `validity` 객체에 결과가 들어 있어요(Day 19의 객체). 그중 `input.validity.patternMismatch`는 값이 `pattern`과 다르면 `true`예요.

```js
if (input.validity.patternMismatch) {
  return '닉네임은 한글·영문·숫자·밑줄(_)로 공백 없이 2~20글자로 적어 주세요.';
}
```

닉네임은 **선택** 입력이에요. 비어 있으면 `pattern` 검사는 통과로 쳐요(브라우저 규칙). 그래도 코드에서 `if (input.value === '') return '';`로 먼저 걸러서 의도를 분명히 해요.

### preventDefault: 기본 동작 막기

폼의 **보내기** 버튼을 누르면 `submit` 이벤트가 일어나고, 브라우저는 기본으로 페이지를 새로 고침하면서 입력값을 주소에 붙여요(Day 8에서 봤죠. `contact.html?name=…&email=…`). 우리는 새로 고침 대신 JavaScript로 검사해야 해요.

**[[preventDefault]]**(프리벤트 디폴트)는 이벤트에 붙은 브라우저의 기본 동작을 막는 메서드예요. `submit` 리스너 맨 앞에서 `event.preventDefault();`를 부르면 새로 고침과 주소 변경이 일어나지 않아요.

### 안내 문장을 읽어 주는 장치들: ARIA

화면을 보지 못하는 사람은 스크린 리더로 폼을 써요. 그래서 오류를 눈에만 보이는 빨간 글자로 두지 않고 ARIA 속성으로 함께 알려요.

- `aria-describedby="name-error"`: 입력칸을 설명하는 문장의 `id`를 연결해요. 칸에 도착하면 스크린 리더가 칸 이름 다음에 그 문장도 읽어 줘요. 닉네임 칸처럼 `"nickname-hint nickname-error"`로 여러 개를 이을 수 있어요.
- `aria-invalid="true"`: "이 칸에 문제가 있어요". 문제가 없으면 이 속성을 지워요(`removeAttribute`). 오류 칸에는 빨간 테두리(CSS 속성 선택자)도 붙어요.
- **[[aria-live]]**: "이 영역의 글자가 바뀌면 읽어 주세요"라고 알리는 속성이에요. `aria-live="polite"`는 하던 말을 마친 뒤에 알려 줘요. `role="status"`는 거의 같은 뜻의 짧은 표현(`aria-live="polite"`에 "통째로 읽기"까지 더한 것)이라서 맨 아래 상태 문장에는 `role="status"`를 써요.

같은 문장을 반복해서 쓰면 스크린 리더가 같은 말을 또 읽어서 시끄러워요. 그래서 코드는 "문장이 이전과 같으면 다시 쓰지 않아요"로 되어 있어요.

### 검사 규칙을 객체에 담는 이유

칸이 4개이니 `if (id === 'name') … else if (id === 'email') …`로 길게 쓰는 대신, **칸 이름 → 검사 함수**를 짝지은 객체(Day 19)로 만들어요.

```js
const validators = {
  name: (input) => { /* 이름 검사 */ },
  email: (input) => { /* 이메일 검사 */ },
};
validators[input.id](input); // input.id 가 'name' 이면 validators.name(input)
```

`validators[input.id]`는 대괄호 표기(Day 19)로 "칸의 `id`와 같은 이름의 검사 함수를 꺼내요". 그 뒤에 `(input)`을 붙여서 곧바로 불러요. 각 검사 함수는 화살표 함수(Day 18)이고, **오류 문장을 돌려주거나, 괜찮으면 빈 글자 `''`를 돌려줘요.** 칸 id와 `validators`의 키 이름이 정확히 같아야 해요.

## 🛠️ 따라하기

모두 8단계예요. HTML → CSS → JavaScript 순서로, JavaScript는 세 번에 나누어 쌓아요(A: 보내기 가로채기, B: 칸 검사, C: 요약·성공 메시지). 단계마다 화면으로 확인해요.

### 1단계 · contact.html: 폼을 검증할 수 있는 모양으로 바꾸기 (10분)

**어디서:** VS Code → `C:\dev\my-creator-site\contact.html`

**무엇을:**

1. `<form>` 줄(여는 태그)을 찾아 줄 맨 앞을 클릭해요.
2. `Shift`를 누른 채로 `</form>` 줄 끝을 클릭해요. 폼 전체가 선택돼요.
3. 아래 블록을 복사해서 붙여 넣고 저장해요. 위의 제목(`<h1>`)과 안내 문장은 그대로예요.

📄 C:\dev\my-creator-site\contact.html (일부)
```html
    <!-- novalidate: 브라우저 기본 말풍선 대신 contact.js의 안내 문장을 보여 줘요 (Day 24) -->
    <form id="contact-form" class="contact-form" novalidate>
      <div class="field">
        <label for="name">이름</label>
        <input id="name" name="name" type="text" autocomplete="name" required aria-describedby="name-error">
        <p id="name-error" class="field-error"></p>
      </div>

      <div class="field">
        <label for="email">이메일</label>
        <input id="email" name="email" type="email" autocomplete="email" required aria-describedby="email-error">
        <p id="email-error" class="field-error"></p>
      </div>

      <div class="field">
        <label for="nickname">채팅 닉네임 (선택)</label>
        <!-- pattern: 입력한 글자가 이 규칙(한글·영문·숫자·_ 2~20글자)과 맞아야 해요. 비워 두면 괜찮아요 -->
        <input id="nickname" name="nickname" type="text" pattern="[A-Za-z0-9가-힣_]{2,20}" autocomplete="nickname" aria-describedby="nickname-hint nickname-error">
        <p id="nickname-hint" class="field-hint">방송 채팅에서 쓰는 이름이 있다면 적어 주세요. 한글·영문·숫자·밑줄(_) 2~20글자, 공백 없이요.</p>
        <p id="nickname-error" class="field-error"></p>
      </div>

      <div class="field">
        <label for="topic">문의 종류</label>
        <select id="topic" name="topic">
          <option value="general">일반 문의</option>
          <option value="collab">협업 제안</option>
          <option value="request">영상 요청</option>
        </select>
      </div>

      <div class="field">
        <label for="message">내용 (10글자 이상)</label>
        <textarea id="message" name="message" rows="6" required aria-describedby="message-error"></textarea>
        <p id="message-error" class="field-error"></p>
      </div>

      <button type="submit">보내기</button>

      <!-- role="status": 이 칸의 글자가 바뀌면 스크린 리더가 알려 줘요 (aria-live="polite"와 같은 뜻이에요) -->
      <p id="form-status" class="form-status" role="status"></p>
    </form>
```

무엇이 달라졌는지 읽어 봐요.

- `<form id="contact-form" class="contact-form" novalidate>`: JavaScript가 찾을 `id`, CSS가 꾸밀 `class`, 그리고 브라우저 기본 말풍선을 끄는 `novalidate`가 생겼어요.
- 칸마다 `<div class="field">`가 감싸요. `class="field"`는 CSS의 `.field label` 규칙이 쓰는 이름이에요.
- 이름·이메일·내용 칸에 `required`가 생겼어요. `type="email"`은 이메일 칸에 그대로 있어요.
- 닉네임 칸에 `pattern="[A-Za-z0-9가-힣_]{2,20}"`이 생겼어요. 위 개념 설명의 그 규칙이에요. `<p id="nickname-hint" class="field-hint">`는 항상 보이는 도움말이고, 내용 칸의 label은 `내용 (10글자 이상)`이 됐어요.
- 칸마다 아래에 `<p id="name-error" class="field-error"></p>` 같은 **빈 문단**이 있어요. 오류 문장이 들어갈 자리예요. 각 입력칸의 `aria-describedby`가 이 문단의 `id`를 가리켜요.
- 맨 아래 `<p id="form-status" class="form-status" role="status"></p>`는 전체 결과를 알려 주는 문장 자리예요.

:::success
문의 페이지에 이름·이메일·닉네임·문의 종류·내용 칸과 **보내기** 버튼이 그대로 보이고, 닉네임 칸 아래에 "방송 채팅에서 쓰는 이름이 있다면 적어 주세요…" 도움말이 새로 생겼어요. 오류 문단은 비어 있어서 아무것도 안 보여요.
:::

### 2단계 · JavaScript가 없으면 어떻게 될까? (3분)

`preventDefault`가 왜 필요한지 눈으로 먼저 봐요.

**어디서:** Live Preview 또는 파일 더블클릭으로 연 `contact.html`

**무엇을:** 칸을 모두 비운 채 **보내기**를 눌러요.

:::success
페이지가 새로 고침되면서 브라우저 주소 끝에 `?name=&email=&nickname=&topic=general&message=`처럼 값이 붙어요(Live Preview에서는 주소 칸에서, 파일로 열었다면 주소 표시줄에서 보여요). 아직 검사하는 코드가 없고, `novalidate` 때문에 브라우저 말풍선도 안 떠요. 이 동작을 막는 것이 4단계의 목표예요.
:::

### 3단계 · style.css: 오류 색과 폼 모양 (8분)

**어디서:** VS Code → `C:\dev\my-creator-site\css\style.css`

**무엇을:** 세 곳에 넣어요.

**(1)** 파일 맨 위 `:root {` 규칙에서 `--border: #d9d6ee;` 줄 **바로 아래**에 두 줄을 붙여 넣어요. 밝은 모드의 오류(빨강)와 성공(초록) 색이에요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
  --error: #b3261e;
  --success: #1b6e3c;
```

**(2)** 바로 아래쪽 `:root[data-theme="dark"] {` 규칙에서 `--border: #3a3660;` 줄 **바로 아래**에 두 줄을 붙여 넣어요. 어두운 배경에서 읽히도록 더 밝은 빨강·초록이에요(오늘 마지막에 다크 모드에서도 확인해요).

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
  --error: #ff8a80;
  --success: #6fd49a;
```

**(3)** 6번 구역의 맨 끝, `/* ---------- 7. 푸터 ---------- */` 주석 **바로 위**에 아래 블록을 붙여 넣어요(블록 끝의 빈 줄까지). 방송 일정 표 규칙 다음이에요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
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
```

몇 가지만 짚을게요.

- `.field input[aria-invalid="true"]`: `aria-invalid="true"`인 입력칸의 테두리를 빨갛게 해요. 속성 선택자(Day 11)예요.
- `.field-error:empty { display: none; }`: `:empty`는 안에 아무것도 없는 요소를 고르는 의사 클래스(Day 14)예요. 오류 문단이 비어 있으면 아예 자리도 차지하지 않아요. 안 그러면 빈 문단의 위쪽 여백 때문에 칸 사이가 어색하게 벌어져요.
- `.form-status.is-error`와 `.form-status.is-success`: 빈칸 없는 복합 선택자(Day 21)예요. `form-status`와 `is-error`(또는 `is-success`) 클래스를 **둘 다** 가진 요소에만 색을 입혀요.

저장하고 `contact.html`을 새로 고침해요.

:::success
폼이 최대 폭 560px 안에서 칸 사이가 일정하게 벌어져 보여요. 닉네임 칸 아래 도움말이 회색 작은 글씨예요. 입력칸을 클릭하면 테두리가 보라색이에요. 빨간 안내는 아직 나오지 않아요.
:::

### 4단계 · contact.js A: 보내기를 가로채기 (7분)

**어디서:** VS Code 탐색기 → `js` 폴더 위에서 오른쪽 클릭 → **새 파일** → `contact.js` 입력 후 `Enter` (경로 `C:\dev\my-creator-site\js\contact.js`)

**무엇을:**

1. 방금 열린 빈 `contact.js`에 아래 코드를 붙여 넣고 `Ctrl + S`로 저장해요.

📄 C:\dev\my-creator-site\js\contact.js
```js
// ==========================================================
// contact.js - 문의 폼 검증
// 보내기를 누르면 각 칸을 검사해서, 틀린 칸 아래에 안내 문장을 보여 줘요.
// ==========================================================

const form = document.querySelector('#contact-form');
const statusElement = document.querySelector('#form-status');

// 검사할 칸의 id 목록 (화면에 보이는 순서대로)
const fieldIds = ['name', 'email', 'nickname', 'message'];

// 보내기 버튼을 눌렀을 때
form.addEventListener('submit', (event) => {
  event.preventDefault(); // 페이지가 새로고침되는 기본 동작을 막아요
  console.log('보내기를 눌렀어요');
});
```

2. `contact.html`을 열어 `<script src="js/main.js" defer></script>` 줄 **바로 아래**에 한 줄을 붙여 넣어요. 이 한 줄이 새 파일을 불러와요. `main.js`가 먼저, `contact.js`가 나중에 로드돼요.

```html
  <script src="js/contact.js" defer></script>
```

3. 저장하고 문의 페이지를 새로 고침해요. 칸을 모두 비운 채 **보내기**를 눌러요. 개발자 도구(`F12`) **Console**도 같이 열어 둬요.

코드를 읽어 봐요.

- `form`, `statusElement`는 id로 찾은 요소예요.
- `fieldIds`는 검사할 칸의 id를 화면 순서대로 모은 배열(Day 17)이에요.
- `form.addEventListener('submit', (event) => { … })`: Day 21에서 배운 리스너인데 이벤트가 `click`이 아니라 `submit`이에요. **보내기** 버튼뿐 아니라 칸 안에서 `Enter`를 쳐도 `submit`이 일어나요.
- `event.preventDefault();`: 새로 고침과 주소 변경을 막아요.

:::success
**보내기**를 눌러도 페이지가 새로 고침되지 않고, 주소 끝에 `?`가 붙지 않아요. Console에 `보내기를 눌렀어요`가 한 줄 찍혀요. 파일 이름 `contact.js`가 틀렸거나 script 줄이 없으면 2단계처럼 주소에 `?name=…`이 붙어요.
:::

### 5단계 · contact.js B: 칸마다 검사하고 오류 보여 주기 (16분)

이제 "칸마다 검사 규칙 → 틀리면 안내 문장 → 첫 오류 칸으로 커서"를 만들어요.

**어디서:** VS Code → `C:\dev\my-creator-site\js\contact.js`

**무엇을:**

1. `const fieldIds = […];` 줄과 `// 보내기 버튼을 눌렀을 때` 주석 **사이**에 아래 블록을 붙여 넣어요. 앞뒤로 빈 줄을 하나씩 둬요. `validators` 객체와, 오류를 화면에 보여 주는 두 함수가 들어 있어요.

📄 C:\dev\my-creator-site\js\contact.js (일부)
```js
// 칸마다 검사 규칙을 정해 둬요. 입력칸을 받아서, 문제가 있으면 안내 문장을, 괜찮으면 ''(빈 글자)를 돌려줘요 (Day 24)
const validators = {
  name: (input) => {
    const value = input.value.trim();
    if (value === '') {
      return '이름을 입력해 주세요.';
    }
    if (value.length < 2) {
      return '이름은 2글자 이상으로 적어 주세요.';
    }
    return '';
  },

  email: (input) => {
    const value = input.value.trim();
    if (value === '') {
      return '이메일을 입력해 주세요.';
    }
    // 정규식: 글자@글자.글자 모양인지 확인해요
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      return '이메일 형식을 확인해 주세요. 예: name@example.com';
    }
    return '';
  },

  // 닉네임은 선택 입력이에요. 적었을 때만 HTML의 pattern 속성(한글·영문·숫자·_ 2~20글자)에 맞는지 검사해요
  nickname: (input) => {
    if (input.value === '') {
      return ''; // 비워 둬도 괜찮아요
    }
    if (input.validity.patternMismatch) {
      // validity.patternMismatch: 입력한 글자가 pattern 속성과 다르면 true
      return '닉네임은 한글·영문·숫자·밑줄(_)로 공백 없이 2~20글자로 적어 주세요.';
    }
    return '';
  },

  message: (input) => {
    const value = input.value.trim();
    if (value === '') {
      return '문의 내용을 입력해 주세요.';
    }
    if (value.length < 10) {
      return '내용은 10글자 이상으로 적어 주세요.';
    }
    return '';
  },
};

// 입력칸 아래에 오류 문장을 보여 주거나(문장이 있을 때) 지워요(빈 글자일 때)
function showFieldError(input, message) {
  const errorElement = document.querySelector(`#${input.id}-error`);
  errorElement.textContent = message;

  if (message === '') {
    input.removeAttribute('aria-invalid');
  } else {
    input.setAttribute('aria-invalid', 'true'); // 스크린 리더에게 "이 칸에 문제가 있어요"라고 알려 줘요
  }
}

// 칸 하나를 검사하고 결과(true/false)를 돌려줘요
function validateField(input) {
  const message = validators[input.id](input);
  showFieldError(input, message);
  return message === '';
}
```

2. 지금 있는 `form.addEventListener('submit', …)` 리스너 전체(`// 보내기 버튼을 눌렀을 때` 주석부터 `});`까지)를 아래 블록으로 바꿔요.

📄 C:\dev\my-creator-site\js\contact.js (일부)
```js
// 보내기 버튼을 눌렀을 때
form.addEventListener('submit', (event) => {
  event.preventDefault(); // 페이지가 새로고침되는 기본 동작을 막아요

  const invalidInputs = []; // 검사에 실패한 칸들
  for (const id of fieldIds) {
    const input = document.querySelector(`#${id}`);
    if (!validateField(input)) {
      invalidInputs.push(input);
    }
  }

  if (invalidInputs.length > 0) {
    invalidInputs[0].focus(); // 첫 번째 오류 칸으로 커서를 옮겨요
    return;
  }

  console.log('모두 통과했어요');
});
```

3. `Ctrl + S`로 저장하고 새로 고침해서, 칸을 모두 비운 채 **보내기**를 눌러요.

코드를 읽어 봐요.

- `validators` 안의 `name`, `email`, `nickname`, `message`는 칸의 `id`와 같은 이름이에요. 각각 `(input) => { … }` 화살표 함수예요.
- `const value = input.value.trim();`: 앞뒤 빈칸을 지운 값이에요(Day 23). 빈칸만 입력한 것도 "비었어요"로 걸러요.
- `value === ''`, `value.length < 2`: 비었는지, 글자 수(`length`)가 부족한지 봐요. `return '문장';`으로 안내 문장을 돌려주고, 맨 끝 `return '';`은 "문제 없음"이에요.
- `email` 함수에는 위에서 읽은 정규식이 들어 있어요.
- `nickname` 함수: 비어 있으면 통과, 아니면 `input.validity.patternMismatch`로 HTML `pattern`과 맞는지 봐요.
- `showFieldError(input, message)`: 칸의 오류 문단을 찾아 문장을 넣어요. 칸이 `name`이면 `` `#${input.id}-error` ``는 `#name-error`가 돼요(템플릿 리터럴, Day 16). 문장이 있으면 `setAttribute('aria-invalid', 'true')`, 없으면 `removeAttribute('aria-invalid')`예요.
- `validateField(input)`: 칸 하나를 검사하고, 문제가 없으면 `true`를 돌려줘요. `message === ''`는 `true`/`false` 값이에요.
- 새 `submit` 리스너: `for (const id of fieldIds)`로 칸을 차례로 검사하고(Day 17의 `for…of`), 실패한 칸을 `invalidInputs` 배열에 `push`로 모아요. 하나라도 실패했으면 `invalidInputs[0].focus()`로 첫 오류 칸에 커서를 보내고 `return`으로 끝내요.

:::success
**보내기**를 누르면 이름·이메일·내용 칸 아래에 빨간 안내(`이름을 입력해 주세요.`, `이메일을 입력해 주세요.`, `문의 내용을 입력해 주세요.`)가 나오고 세 칸의 테두리가 빨개요. 닉네임 칸은 선택이라 안내가 없어요. 커서가 이름 칸에서 깜빡여요. 모두 통과하면 Console에 `모두 통과했어요`가 찍혀요. 맨 아래 요약 문장은 아직 안 나와요.
:::

### 6단계 · contact.js C: 요약 문장, 성공 메시지, 고치면 바로 사라지기 (10분)

**어디서:** VS Code → `C:\dev\my-creator-site\js\contact.js`

**무엇을:**

1. `validateField` 함수가 끝나는 `}` 줄과 `// 보내기 버튼을 눌렀을 때` 주석 **사이**에 아래 블록을 붙여 넣어요(앞뒤 빈 줄 하나씩). 맨 아래 상태 문장을 다루는 함수 네 개예요.

📄 C:\dev\my-creator-site\js\contact.js (일부)
```js
// 맨 아래 상태 메시지: role="status"는 "바뀌면 스크린 리더가 읽어 주는 영역"이에요
function showStatus(message, type) {
  // 같은 문장이면 다시 쓰지 않아요 (스크린 리더가 같은 말을 또 읽지 않게요)
  if (statusElement.textContent !== message) {
    statusElement.textContent = message;
  }
  statusElement.className = `form-status is-${type}`; // is-error 또는 is-success
}

function clearStatus() {
  statusElement.textContent = '';
  statusElement.className = 'form-status';
}

function makeErrorSummary(count) {
  return `입력 내용을 확인해 주세요. 고칠 곳이 ${count}군데 있어요.`;
}

// 오류 안내가 떠 있을 때, 남은 오류 개수에 맞게 맨 아래 메시지를 고치거나 지워요
function updateErrorSummary() {
  if (!statusElement.classList.contains('is-error')) {
    return;
  }
  const count = form.querySelectorAll('[aria-invalid="true"]').length;
  if (count === 0) {
    clearStatus(); // 다 고쳤으면 안내를 지워요
  } else {
    showStatus(makeErrorSummary(count), 'error');
  }
}
```

2. `form.addEventListener('submit', …)` 리스너 전체를 아래 블록으로 다시 바꿔요. 이번 판에서는 요약 문장과 성공 처리가 들어가요.

📄 C:\dev\my-creator-site\js\contact.js (일부)
```js
// 보내기 버튼을 눌렀을 때
form.addEventListener('submit', (event) => {
  event.preventDefault(); // 페이지가 새로고침되는 기본 동작을 막아요

  const invalidInputs = []; // 검사에 실패한 칸들
  for (const id of fieldIds) {
    const input = document.querySelector(`#${id}`);
    if (!validateField(input)) {
      invalidInputs.push(input);
    }
  }

  if (invalidInputs.length > 0) {
    showStatus(makeErrorSummary(invalidInputs.length), 'error');
    invalidInputs[0].focus(); // 첫 번째 오류 칸으로 커서를 옮겨요
    return;
  }

  // 모두 통과! (진짜 서버는 없어서 실제로 보내지는 않아요)
  showStatus('문의가 접수됐어요. 감사합니다! (연습용 사이트라 실제로 전송되지는 않아요.)', 'success');
  form.reset();
});
```

3. 파일 맨 끝(리스너 아래)에 아래 블록을 붙여 넣어요.

📄 C:\dev\my-creator-site\js\contact.js (일부)
```js
// 오류가 났던 칸은 고치는 동안 바로 다시 검사해서 오류를 지워 줘요 (이벤트 위임)
form.addEventListener('input', (event) => {
  const input = event.target;
  if (input.getAttribute('aria-invalid') === 'true') {
    validateField(input);
    updateErrorSummary();
  }
});
```

4. 저장하고 새로 고침해요.

코드를 읽어 봐요.

- `showStatus(message, type)`: 맨 아래 문장을 바꿔요. 이미 같은 문장이면 다시 쓰지 않아요(스크린 리더가 같은 말을 또 읽지 않게). `statusElement.className = `form-status is-${type}`;`로 클래스 두 개가 붙고, CSS의 `.form-status.is-error`/`.is-success`가 색을 정해요.
- `makeErrorSummary(count)`: `고칠 곳이 3군데 있어요` 같은 문장을 만들어요.
- `updateErrorSummary()`: 오류 문장이 떠 있는 동안(`classList.contains('is-error')`), `form.querySelectorAll('[aria-invalid="true"]').length`로 남은 오류 칸의 수를 세어 문장을 고치고, 0이면 문장을 지워요.
- 새 `submit` 리스너 끝: 모두 통과하면 성공 문장을 보여 주고 `form.reset()`으로 모든 칸을 비워요. 연습용이라 서버로 보내지 않아요.
- 맨 끝의 `input` 리스너: 폼 하나에만 걸었지만 칸 4개 모두의 입력을 들어요(Day 21의 이벤트 위임이에요). `event.target`이 입력한 칸이고, 이미 오류 상태(`aria-invalid="true"`)인 칸만 다시 검사해요.

:::success
빈 채로 **보내기**를 누르면 세 칸의 빨간 안내와 맨 아래 `입력 내용을 확인해 주세요. 고칠 곳이 3군데 있어요.`가 빨갛게 나와요. 이름 칸에 글자를 한 개 쳤을 때는 아직 안내가 남아 있고, 두 글자를 치면 이름 안내가 바로 사라지고 문장이 `2군데`로 줄어요. 칸을 모두 고치면 문장이 사라져요.
:::

### 7단계 · 여러 경우를 직접 확인하기 (5분)

**어디서:** Live Preview 또는 파일 더블클릭으로 연 `contact.html`

**무엇을:** 아래 표의 순서대로 해 보고 결과를 비교해요.

| 입력 | 보이는 결과 |
|---|---|
| 아무것도 안 쓰고 **보내기** | 안내 3개 + `3군데`, 커서는 이름 칸 |
| 닉네임에 `달빛 곰` 입력 후 **보내기** | 닉네임 안내가 추가돼서 `4군데` |
| 이메일에 `abc` 입력 후 **보내기** | `이메일 형식을 확인해 주세요. 예: name@example.com` |
| 이름 칸에 `달빛곰` 입력 | 이름 안내가 사라지고 `3군데` |
| 이메일 `a@b.co`, 닉네임 `moon_bear`, 내용 `안녕하세요. 문의드려요.` 입력 | 안내가 모두 사라지고 요약 문장도 사라져요 |
| **보내기** | 초록색 `문의가 접수됐어요. 감사합니다! (연습용 사이트라 실제로 전송되지는 않아요.)`, 모든 칸이 비워져요 |

그다음 메뉴의 **🌙 다크 모드**를 켜고 다시 빈 채로 **보내기**를 눌러 봐요.

:::success
표의 결과가 모두 같아요. 다크 모드에서도 빨간 글자(`#ff8a80`)와 초록 글자가 어두운 배경 위에서 또렷하게 읽혀요. 개발자 도구 Console에 빨간 오류는 없어요.
:::

### 8단계 · 커밋·푸시 (3분)

**어디서:** VS Code → 소스 제어 패널(`Ctrl + Shift + G`)

**무엇을:** **메시지** 칸에 `Day 24: 문의 폼 검증`을 입력하고 **커밋** → **변경 내용 동기화**를 눌러요. 명령으로 한다면 VS Code 터미널(PowerShell), 위치 `C:\dev\my-creator-site`에서 아래를 한 줄씩 실행해요.

```powershell
git add .
git commit -m "Day 24: 문의 폼 검증"
git push
```

`git commit` 예상 출력(해시와 숫자는 달라도 돼요):

```text
[main 9d4c6b2] Day 24: 문의 폼 검증
 4 files changed, 230 insertions(+), 21 deletions(-)
```

:::success
GitHub 저장소에 `Day 24: 문의 폼 검증` 커밋이 보이고, 소스 제어 패널의 변경은 0개예요.
:::

## ✍️ 과제

### 과제 1 · 정규식 퀴즈 (쉬움 ⭐, 6분)

닉네임 `pattern` 규칙(`[A-Za-z0-9가-힣_]{2,20}`)에 아래 다섯 개 중 통과하는 것은 몇 개이고 어느 것일까요? 실패하는 이유도 하나씩 적어 보세요. 닉네임 칸에 실제로 쳐서 **보내기**로 확인해요.

`달빛곰`, `moon_bear`, `달빛 곰`, `ㅋㅋ`, `a`

- 확인 방법: 통과하면 닉네임 안내가 안 나오고, 실패하면 닉네임 안내가 나와요.
- 힌트: `가-힣`은 "완성된 한글 글자"의 범위예요. 자음 하나(`ㅋ`)나 빈칸(` `)이 이 범위나 `[ ]` 안에 있나요?

### 과제 2 · 영상 개수를 읽어 주기 (보통 ⭐⭐, 6분)

Day 23에서 만든 영상 페이지의 `<p id="result-count" class="result-count"></p>`에 `aria-live="polite"` 속성을 넣어 보세요. 이 속성이 카테고리를 바꿀 때 어떤 도움을 주는지 한 문장으로 적어요.

- 확인 방법: `contents.html`의 해당 줄에 속성이 생겼어요. 눈으로는 달라지는 게 없어요.
- 힌트: 눈으로 화면을 보지 못하는 사람은 카테고리 버튼을 누른 뒤 카드가 바뀐 걸 어떻게 알 수 있을까요?
- 마무리: 이 변경은 끝 상태에 포함돼요. 8단계 커밋 뒤에 바꿨으니 소스 제어 패널에서 `Day 24: 영상 개수 aria-live`로 한 번 더 커밋·푸시해요. 그래야 내일 시작할 때 변경이 0개예요.

### 과제 3 · 이름은 20글자까지 (도전 ⭐⭐⭐, 8분)

`validators.name`에 "이름은 20글자 이하로 적어 주세요."라는 규칙을 넣는 코드를 **코드만 써 보세요.** 끝 상태에는 넣지 않아요.

- 확인 방법: 쓴 코드를 정답과 비교해요.
- 힌트: `2글자 이상`을 검사하는 `if`가 어떻게 생겼는지 보세요. 반대 방향이에요.

## ✅ 정답

:::answer 과제 1 정답 · 정규식 퀴즈
통과는 2개예요: `달빛곰`, `moon_bear`.

```text
달빛곰     → 통과 (완성된 한글 3글자)
moon_bear  → 통과 (영문과 밑줄 9글자)
달빛 곰    → 실패 (빈칸은 허용 글자에 없어요)
ㅋㅋ       → 실패 (자음만 있는 글자는 가-힣이 아니에요)
a          → 실패 (1글자라 {2,20}의 최소 2에 못 미쳐요)
```

**왜 이렇게 하나요?** `[A-Za-z0-9가-힣_]`는 허용 글자 목록이고 `{2,20}`은 길이예요. 목록에 없는 글자(빈칸, `ㅋ`, 특수문자)가 하나라도 있으면 전체가 실패해요. `가-힣`은 "가"부터 "힣"까지의 완성된 글자 범위라서, 한글 자음·모음 낱글자(`ㅋ`, `ㅏ`)는 포함되지 않아요.
:::

:::answer 과제 2 정답 · 영상 개수를 읽어 주기
📄 C:\dev\my-creator-site\contents.html (일부)
```html
<p id="result-count" class="result-count" aria-live="polite"></p>
```

**왜 이렇게 하나요?** 카테고리 버튼을 누르면 `render()`가 `#result-count`의 글자를 `영상 2개`처럼 바꿔요. `aria-live="polite"`가 있으면 스크린 리더가 그 변화를 알아채고 하던 말을 마친 뒤 "영상 2개"라고 읽어 줘요. 눈으로 화면을 못 보는 사람도 필터가 적용됐고 결과가 몇 개인지 알 수 있어요. 이 속성이 없으면 소리로는 아무 일도 없었던 것처럼 들려요. 이 줄은 오늘 끝 상태에 포함돼요.
:::

:::answer 과제 3 정답 · 이름은 20글자까지
```js
  name: (input) => {
    const value = input.value.trim();
    if (value === '') {
      return '이름을 입력해 주세요.';
    }
    if (value.length < 2) {
      return '이름은 2글자 이상으로 적어 주세요.';
    }
    if (value.length > 20) {
      return '이름은 20글자 이하로 적어 주세요.';
    }
    return '';
  },
```

**왜 이렇게 하나요?** `value.length < 2` 아래에 방향만 반대로 `value.length > 20`을 더하면 돼요. `if`는 위에서부터 차례로 보고, 걸리면 `return`으로 바로 끝나요. 그래서 마지막 `return '';`까지 오면 "비지 않았고, 2~20글자"가 확인된 거예요. 이 규칙은 연습이라 끝 상태에는 넣지 않아요.
:::

:::answer 오늘 끝 상태 전체 코드
막혔다면 아래 코드로 내 파일을 맞추고 다음 Day를 시작해요. `contact.html`, `contact.js`, `contents.html`은 파일 전체를, `style.css`는 바뀐 블록만 위치와 함께 실었어요. `contact.js`의 단계별 조각(A, B, C)이 아니라 완성본이에요.

```text
my-creator-site/
├─ css/
│  └─ style.css ✎
├─ images/
│  ├─ logo.svg
│  ├─ profile.svg
│  ├─ thumb-game.svg
│  ├─ thumb-music.svg
│  └─ thumb-talk.svg
├─ js/
│  ├─ contact.js ★
│  ├─ contents.js
│  └─ main.js
├─ about.html
├─ contact.html ✎
├─ contents.html ✎
├─ index.html
└─ schedule.html
```

📄 C:\dev\my-creator-site\contact.html
```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>문의하기 - 달빛곰 방송국</title>
  <link rel="stylesheet" href="css/style.css">
  <script src="js/main.js" defer></script>
  <script src="js/contact.js" defer></script>
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a class="logo" href="index.html">
        <img src="images/logo.svg" alt="" width="36" height="36">
        <span>달빛곰 방송국</span>
      </a>

      <!-- 모바일에서만 보이는 메뉴 버튼. main.js가 aria-expanded 값을 바꿔요 -->
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">☰ 메뉴</button>

      <nav id="site-nav" class="site-nav" aria-label="주 메뉴">
        <ul class="menu-list">
          <li><a href="index.html">홈</a></li>
          <li><a href="about.html">소개</a></li>
          <li><a href="contents.html">영상</a></li>
          <li><a href="schedule.html">방송 일정</a></li>
          <li><a href="contact.html" aria-current="page">문의</a></li>
          <li><button class="theme-toggle" type="button" aria-pressed="false">🌙 다크 모드</button></li>
        </ul>
      </nav>
    </div>
  </header>

  <main class="container">
    <h1>문의하기</h1>
    <p>협업 제안, 영상 요청, 궁금한 점을 남겨 주세요. 이 사이트는 연습용이라 실제로 전송되지는 않아요.</p>

    <!-- novalidate: 브라우저 기본 말풍선 대신 contact.js의 안내 문장을 보여 줘요 (Day 24) -->
    <form id="contact-form" class="contact-form" novalidate>
      <div class="field">
        <label for="name">이름</label>
        <input id="name" name="name" type="text" autocomplete="name" required aria-describedby="name-error">
        <p id="name-error" class="field-error"></p>
      </div>

      <div class="field">
        <label for="email">이메일</label>
        <input id="email" name="email" type="email" autocomplete="email" required aria-describedby="email-error">
        <p id="email-error" class="field-error"></p>
      </div>

      <div class="field">
        <label for="nickname">채팅 닉네임 (선택)</label>
        <!-- pattern: 입력한 글자가 이 규칙(한글·영문·숫자·_ 2~20글자)과 맞아야 해요. 비워 두면 괜찮아요 -->
        <input id="nickname" name="nickname" type="text" pattern="[A-Za-z0-9가-힣_]{2,20}" autocomplete="nickname" aria-describedby="nickname-hint nickname-error">
        <p id="nickname-hint" class="field-hint">방송 채팅에서 쓰는 이름이 있다면 적어 주세요. 한글·영문·숫자·밑줄(_) 2~20글자, 공백 없이요.</p>
        <p id="nickname-error" class="field-error"></p>
      </div>

      <div class="field">
        <label for="topic">문의 종류</label>
        <select id="topic" name="topic">
          <option value="general">일반 문의</option>
          <option value="collab">협업 제안</option>
          <option value="request">영상 요청</option>
        </select>
      </div>

      <div class="field">
        <label for="message">내용 (10글자 이상)</label>
        <textarea id="message" name="message" rows="6" required aria-describedby="message-error"></textarea>
        <p id="message-error" class="field-error"></p>
      </div>

      <button type="submit">보내기</button>

      <!-- role="status": 이 칸의 글자가 바뀌면 스크린 리더가 알려 줘요 (aria-live="polite"와 같은 뜻이에요) -->
      <p id="form-status" class="form-status" role="status"></p>
    </form>
  </main>

  <footer class="site-footer">
    <div class="container">
      <p>&copy; 2026 달빛곰 방송국 · 연습용으로 만든 사이트예요.</p>
    </div>
  </footer>
</body>
</html>
```

📄 C:\dev\my-creator-site\js\contact.js
```js
// ==========================================================
// contact.js - 문의 폼 검증
// 보내기를 누르면 각 칸을 검사해서, 틀린 칸 아래에 안내 문장을 보여 줘요.
// ==========================================================

const form = document.querySelector('#contact-form');
const statusElement = document.querySelector('#form-status');

// 검사할 칸의 id 목록 (화면에 보이는 순서대로)
const fieldIds = ['name', 'email', 'nickname', 'message'];

// 칸마다 검사 규칙을 정해 둬요. 입력칸을 받아서, 문제가 있으면 안내 문장을, 괜찮으면 ''(빈 글자)를 돌려줘요 (Day 24)
const validators = {
  name: (input) => {
    const value = input.value.trim();
    if (value === '') {
      return '이름을 입력해 주세요.';
    }
    if (value.length < 2) {
      return '이름은 2글자 이상으로 적어 주세요.';
    }
    return '';
  },

  email: (input) => {
    const value = input.value.trim();
    if (value === '') {
      return '이메일을 입력해 주세요.';
    }
    // 정규식: 글자@글자.글자 모양인지 확인해요
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      return '이메일 형식을 확인해 주세요. 예: name@example.com';
    }
    return '';
  },

  // 닉네임은 선택 입력이에요. 적었을 때만 HTML의 pattern 속성(한글·영문·숫자·_ 2~20글자)에 맞는지 검사해요
  nickname: (input) => {
    if (input.value === '') {
      return ''; // 비워 둬도 괜찮아요
    }
    if (input.validity.patternMismatch) {
      // validity.patternMismatch: 입력한 글자가 pattern 속성과 다르면 true
      return '닉네임은 한글·영문·숫자·밑줄(_)로 공백 없이 2~20글자로 적어 주세요.';
    }
    return '';
  },

  message: (input) => {
    const value = input.value.trim();
    if (value === '') {
      return '문의 내용을 입력해 주세요.';
    }
    if (value.length < 10) {
      return '내용은 10글자 이상으로 적어 주세요.';
    }
    return '';
  },
};

// 입력칸 아래에 오류 문장을 보여 주거나(문장이 있을 때) 지워요(빈 글자일 때)
function showFieldError(input, message) {
  const errorElement = document.querySelector(`#${input.id}-error`);
  errorElement.textContent = message;

  if (message === '') {
    input.removeAttribute('aria-invalid');
  } else {
    input.setAttribute('aria-invalid', 'true'); // 스크린 리더에게 "이 칸에 문제가 있어요"라고 알려 줘요
  }
}

// 칸 하나를 검사하고 결과(true/false)를 돌려줘요
function validateField(input) {
  const message = validators[input.id](input);
  showFieldError(input, message);
  return message === '';
}

// 맨 아래 상태 메시지: role="status"는 "바뀌면 스크린 리더가 읽어 주는 영역"이에요
function showStatus(message, type) {
  // 같은 문장이면 다시 쓰지 않아요 (스크린 리더가 같은 말을 또 읽지 않게요)
  if (statusElement.textContent !== message) {
    statusElement.textContent = message;
  }
  statusElement.className = `form-status is-${type}`; // is-error 또는 is-success
}

function clearStatus() {
  statusElement.textContent = '';
  statusElement.className = 'form-status';
}

function makeErrorSummary(count) {
  return `입력 내용을 확인해 주세요. 고칠 곳이 ${count}군데 있어요.`;
}

// 오류 안내가 떠 있을 때, 남은 오류 개수에 맞게 맨 아래 메시지를 고치거나 지워요
function updateErrorSummary() {
  if (!statusElement.classList.contains('is-error')) {
    return;
  }
  const count = form.querySelectorAll('[aria-invalid="true"]').length;
  if (count === 0) {
    clearStatus(); // 다 고쳤으면 안내를 지워요
  } else {
    showStatus(makeErrorSummary(count), 'error');
  }
}

// 보내기 버튼을 눌렀을 때
form.addEventListener('submit', (event) => {
  event.preventDefault(); // 페이지가 새로고침되는 기본 동작을 막아요

  const invalidInputs = []; // 검사에 실패한 칸들
  for (const id of fieldIds) {
    const input = document.querySelector(`#${id}`);
    if (!validateField(input)) {
      invalidInputs.push(input);
    }
  }

  if (invalidInputs.length > 0) {
    showStatus(makeErrorSummary(invalidInputs.length), 'error');
    invalidInputs[0].focus(); // 첫 번째 오류 칸으로 커서를 옮겨요
    return;
  }

  // 모두 통과! (진짜 서버는 없어서 실제로 보내지는 않아요)
  showStatus('문의가 접수됐어요. 감사합니다! (연습용 사이트라 실제로 전송되지는 않아요.)', 'success');
  form.reset();
});

// 오류가 났던 칸은 고치는 동안 바로 다시 검사해서 오류를 지워 줘요 (이벤트 위임)
form.addEventListener('input', (event) => {
  const input = event.target;
  if (input.getAttribute('aria-invalid') === 'true') {
    validateField(input);
    updateErrorSummary();
  }
});
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

      <!-- 모바일에서만 보이는 메뉴 버튼. main.js가 aria-expanded 값을 바꿔요 -->
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">☰ 메뉴</button>

      <nav id="site-nav" class="site-nav" aria-label="주 메뉴">
        <ul class="menu-list">
          <li><a href="index.html">홈</a></li>
          <li><a href="about.html">소개</a></li>
          <li><a href="contents.html" aria-current="page">영상</a></li>
          <li><a href="schedule.html">방송 일정</a></li>
          <li><a href="contact.html">문의</a></li>
          <li><button class="theme-toggle" type="button" aria-pressed="false">🌙 다크 모드</button></li>
        </ul>
      </nav>
    </div>
  </header>

  <main class="container">
    <h1>영상 모아보기</h1>
    <p>카테고리를 고르거나 제목으로 검색해 보세요.</p>

    <div class="toolbar">
      <!-- 버튼 4개를 감싼 상자 하나에만 클릭 이벤트를 달아요 (이벤트 위임, Day 21) -->
      <div id="category-filters" class="filters" role="group" aria-label="카테고리 선택">
        <button type="button" data-category="all" aria-pressed="true">전체</button>
        <button type="button" data-category="game" aria-pressed="false">게임</button>
        <button type="button" data-category="talk" aria-pressed="false">토크</button>
        <button type="button" data-category="music" aria-pressed="false">음악</button>
      </div>

      <div class="search-box">
        <label for="search">제목 검색</label>
        <input id="search" type="search" placeholder="예: 게임" autocomplete="off">
      </div>
    </div>

    <h2>영상 목록</h2>
    <p id="result-count" class="result-count" aria-live="polite"></p>
    <p id="empty-message" hidden>조건에 맞는 영상이 없어요. 다른 검색어를 써 보세요.</p>

    <!-- 카드는 contents.js가 영상 데이터를 읽어서 여기에 그려 줘요 -->
    <div id="video-list" class="card-grid"></div>

    <noscript><p class="error-box">영상 목록을 보려면 JavaScript를 켜 주세요.</p></noscript>
  </main>

  <footer class="site-footer">
    <div class="container">
      <p>&copy; 2026 달빛곰 방송국 · 연습용으로 만든 사이트예요.</p>
    </div>
  </footer>
</body>
</html>
```

`C:\dev\my-creator-site\css\style.css`에는 세 블록을 넣어요.

1. `:root { … }`의 `--border: #d9d6ee;` 줄 바로 아래에 넣어요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
  --error: #b3261e;
  --success: #1b6e3c;
```

2. `:root[data-theme="dark"] { … }`의 `--border: #3a3660;` 줄 바로 아래에 넣어요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
  --error: #ff8a80;
  --success: #6fd49a;
```

3. `/* ---------- 7. 푸터 ---------- */` 주석 바로 위에 넣어요.

📄 C:\dev\my-creator-site\css\style.css (일부)
```css
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
```
:::

## 🧯 자주 막히는 곳

여기에 없는 증상은 [문제 해결 모음](#/page/troubleshooting)에서 찾아보세요.

### 보내기를 누르면 페이지가 새로 고침되고 주소에 ?name= 이 붙어요

**원인:** `contact.js`가 연결되지 않았거나(`contact.html`의 script 줄이 없거나 파일 이름이 달라요), `submit` 리스너에서 `event.preventDefault();`가 빠졌어요. `preventDefault`가 없으면 브라우저의 기본 동작(새로 고침)이 일어나요.

**해결:**

1. `contact.html`의 `<head>` 안에 `<script src="js/contact.js" defer></script>`가 있는지, 파일이 `C:\dev\my-creator-site\js\contact.js`에 있는지 확인해요.
2. `contact.js`의 `submit` 리스너 첫 줄에 `event.preventDefault();`가 있는지 확인해요.
3. 새로 고침해서 **보내기**를 눌러도 주소에 `?`가 안 붙으면 해결이에요.

### 브라우저의 기본 말풍선이 떠요

**원인:** `<form>`에 `novalidate`가 없어요. 브라우저가 먼저 검사하고 자기 말풍선("이 입력란을 작성하세요" 같은 문구, 문구는 브라우저마다 달라요)을 보여 줘서 내 안내 문장이 안 나와요.

**해결:** `contact.html`의 여는 태그를 `<form id="contact-form" class="contact-form" novalidate>`로 바꿔요.

### TypeError: Cannot set properties of null (setting 'textContent')

```text
Uncaught TypeError: Cannot set properties of null (setting 'textContent')
```

**원인:** 오류 안내를 넣을 문단을 못 찾았어요. `showFieldError`가 `` `#${input.id}-error` ``로 문단을 찾는데, HTML의 `id="name-error"`를 `id="name-eror"`처럼 틀리게 썼어요. 못 찾으면 `null`이라서 `null.textContent = …`를 하다가 이 오류가 나요. 줄 번호는 사람마다 달라요.

**해결:** 칸 `id`가 `name`이면 문단 `id`는 `name-error`, `email`이면 `email-error`(칸 id + `-error`)인지 네 개 모두 확인해요.

### TypeError: validators[input.id] is not a function

```text
Uncaught TypeError: validators[input.id] is not a function
```

**원인:** `fieldIds`에 있는 이름과 `validators`의 키 이름이 달라요. 예를 들어 `fieldIds`에 `'topic'`이 있는데 `validators`에는 `topic`이 없으면, `validators['topic']`이 `undefined`라서 "함수가 아니에요"라는 오류가 나요.

**해결:** `fieldIds`의 이름 4개(`name`, `email`, `nickname`, `message`)와 `validators`의 키 이름이 철자까지 같은지 비교해요.

### 닉네임 칸에서 콘솔에 Pattern attribute value … is not a valid regular expression

```text
Pattern attribute value [A-Za-z0-9가-힣_{2,20} is not a valid regular expression: Uncaught SyntaxError: Failed to read the 'patternMismatch' property from 'ValidityState': Invalid regular expression: /[A-Za-z0-9가-힣_{2,20}/v: Invalid character in character class
```

**원인:** `pattern` 값의 정규식이 잘못됐어요(위 예는 `]`를 빠뜨렸어요). 정규식의 `[`는 반드시 `]`로 닫아야 해요. 이 오류 문장은 Chrome 기준이고, 문구는 브라우저 버전에 따라 조금 달라요.

**해결:** `pattern="[A-Za-z0-9가-힣_]{2,20}"`을 위 블록에서 복사해 그대로 붙여 넣어요.

### 이메일 정규식에서 \ 를 빠뜨렸더니 이상한 주소도 통과해요

**원인:** 정규식에서 점(`.`)은 "아무 글자"라는 뜻이라서 진짜 점은 `\.`로 써야 해요. `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`에서 `\`를 빠뜨리면 `abc@defgh`처럼 점이 없는 주소도 이메일로 통과해요. 오류가 나지 않아서 눈치채기 어려워요.

**해결:**

1. `contact.js`의 `emailPattern`에서 `@[^\s@]+\.[^\s@]+$` 부분의 `\.` 앞에 `\`가 있는지 확인해요.
2. 이메일 칸에 `abc@defgh`를 쓰고 보내서 `이메일 형식을 확인해 주세요.`가 나오면 해결이에요.

## 📝 오늘의 체크리스트

- [ ] 빈 채로 **보내기**를 누르면 이름·이메일·내용 칸 아래에 빨간 안내와 `3군데`가 나와요
- [ ] 커서가 첫 번째 오류 칸(이름)으로 가고, 주소에 `?`가 붙지 않아요
- [ ] 닉네임 `달빛 곰`, 이메일 `abc`는 각각 안내가 나와요
- [ ] 칸을 고치면 그 칸의 안내가 바로 사라지고 `군데` 숫자가 줄다가 0이면 문장이 사라져요
- [ ] 모두 바르게 쓰고 보내면 초록 성공 문장이 나오고 칸이 비워져요
- [ ] 다크 모드에서도 빨강·초록 글자가 읽혀요
- [ ] `preventDefault`가 없으면 어떻게 되는지(주소에 `?name=`) 설명할 수 있어요
- [ ] 정규식 `[A-Za-z0-9가-힣_]{2,20}`을 조각으로 읽을 수 있어요
- [ ] 과제 1~3을 하고 정답과 비교했어요, `contents.html`에 `aria-live`를 넣었어요
- [ ] GitHub에 `Day 24` 커밋이 보여요

## 📚 더 알아보기

- [MDN — 클라이언트 측 폼 유효성 검사 (영어 문서)](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation): `required`, `pattern`, `validity`, `novalidate`를 처음부터 차근차근 설명해요.
- [MDN — 정규 표현식](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Regular_expressions): 오늘 읽은 `[ ]`, `^`, `$`, `+`, `\s`를 자세히 정리한 안내서예요.
- [MDN — ARIA live regions (영어 문서)](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions): `aria-live`, `role="status"`가 스크린 리더에서 어떻게 읽히는지 알려 줘요.

➡️ **다음 Day 예고:** [Day 25 · JSON과 fetch](#/day/p1-d25)에서는 영상 데이터를 코드 안의 배열에서 `data\videos.json` 파일로 옮기고, `fetch`로 불러와서 카드를 그려요. 파일을 불러오다 실패했을 때의 대비(`try…catch`)도 배워요.
