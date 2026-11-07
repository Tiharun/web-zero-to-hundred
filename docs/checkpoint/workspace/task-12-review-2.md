# Task 12 리뷰 ②: P1 기술 정확성

- 검토일: 2026-11-07. 범위: `textbook/content/p1/day-*.md` 30개, `tests/e2e/smoke.test.mjs`, 검증 로그 4개, `reference/p1-my-creator-site/`.
- 결과: Critical 0 / Important 2 / Minor 7.
- 근거 표시: **측정**(이 PC에서 실행), **검색**(출처 링크), **일반 지식**(이번에 검색하지 않음).
- 읽은 범위: 코드 블록 659개는 전부 기계 검사. 산문은 전문을 읽지 않았고, 개념 절을 Day 1·7·14·15·22·24·25·26·27·28에서 정독, 나머지는 키워드 검색으로 확인(아래 "Not verified" 참고).

## Critical

없음.

## Important

### I-1. `innerHTML`이 `<script>`를 실행한다는 설명은 틀렸어요 (보안 멘탈 모델)

- 위치: `textbook/content/p1/day-20.md:55`, `textbook/content/p1/day-20.md:542`
- 현재: "`innerHTML`은 글 속의 `<b>`, `<script>` 같은 태그를 **진짜 태그로 해석해서 실행**해요", "글자 속에 섞인 태그를 실제로 실행하기 때문에".
- 문제: `innerHTML`로 넣은 `<script>`는 실행되지 않아요. 학습자가 `<script>alert(1)</script>`로 시험하면 아무 일도 없어서 "그럼 안전하네"라는 잘못된 결론에 닿아요. 실제 위험은 `<img src="x" onerror="alert(1)">` 같은 이벤트 속성이에요.
- 바른 설명(예): "`innerHTML`은 글 속의 꺾쇠를 진짜 태그로 만들어요. `<script>` 태그 자체는 이 방법으로 넣으면 실행되지 않지만, `<img src="x" onerror="…">`처럼 다른 태그의 속성으로 코드를 실행시킬 수 있어요. 그래서 남이 쓴 글을 넣으면 위험해요."
- 결론(`textContent`를 쓴다)은 맞으니 이유 문장만 고치면 돼요. 과제 3 정답(`:542`)도 같이 고쳐요.
- 출처(검색): [MDN Element.innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)

### I-2. 스모크 테스트가 P1 Day 누락을 잡지 못해요

- 위치: `tests/e2e/smoke.test.mjs:124-125`(`soon` 분기), `tests/e2e/smoke.test.mjs:163`(`stats.withFile >= 30`), `tests/e2e/smoke.test.mjs:44`(`allowMissing: true`)
- 문제: 메시지는 "P1 Day 30개는 모두 내용이 있어야 해요"인데, 실제로는 모든 프로젝트의 내용 있는 Day 수를 세요. 지금 `textbook/content/p2/day-*.md`가 20개(측정)라서 기본 실행의 `withFile`은 약 50이에요. P1 Day 파일이 지워지거나 빌드에서 빠지면 그 Day는 `coming-soon`으로 그려져 h2 검사를 건너뛰고, 합계는 30을 넘으니 테스트가 통과할 거예요(코드 분석, 파일을 실제로 지워 재현하지는 않았어요).
- 고칠 점: P1만 세요. 예: `if (soon && dayId.startsWith('p1-')) problems.push(...)`, `stats.p1WithFile === 30` 단언.

## Minor

### M-1. 깨진 MDN 링크 5개 (`더 알아보기`)

ko 주소는 HTTP 404, 같은 경로의 en-US는 200이에요(측정, `curl -L`). 해당 ko 번역 문서가 없는 것으로 보여요. en-US 주소로 바꾸고 "영어 문서"로 표기해요(Day 11~20에서 쓴 방식).

| 위치 | 경로 (`/docs/` 뒤) |
|---|---|
| `textbook/content/p1/day-22.md:608` | `Web/CSS/Reference/Properties/color-scheme` |
| `textbook/content/p1/day-24.md:1172` | `Learn_web_development/Extensions/Forms/Form_validation` |
| `textbook/content/p1/day-24.md:1174` | `Web/Accessibility/ARIA/Guides/Live_regions` |
| `textbook/content/p1/day-27.md:816` | `Web/CSS/Reference/Values/clamp` |
| `textbook/content/p1/day-28.md:1160` | `Web/CSS/Reference/Selectors/:focus-visible` |

다른 외부 링크는 전부 200이에요(주소 100개 중 예시·자리표시자 제외).

### M-2. `:focus-visible` 설명이 텍스트 입력칸에는 맞지 않아요

- 위치: `textbook/content/p1/day-28.md:54`
- 현재: "키보드로 포커스가 왔을 때만 고르는 선택자… 마우스로 클릭했을 때는 굳이 테두리가 안 나오고".
- 바른 설명: 브라우저가 포커스 표시가 필요하다고 판단할 때 적용돼요. 버튼·링크는 마우스 클릭으로는 보통 안 나오지만, **글자를 입력하는 칸은 마우스로 클릭해도 나와요.** 정답 CSS의 `:focus-visible` 전역 규칙(`reference/p1-my-creator-site/css/style.css:90`) 때문에 문의 폼 입력칸을 클릭하면 테두리가 보여서, 학습자가 설명과 다르다고 느낄 수 있어요.
- 출처(일반 지식): [MDN :focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:focus-visible)

### M-3. `localStorage` 오류가 나는 지점

- 위치: `textbook/content/p1/day-25.md:350`
- 현재: "`getItem`/`setItem`을 부르는 순간 오류가 나서".
- 바른 설명: 막힌 환경에서는 `localStorage`라는 이름을 읽는 순간 오류가 나요. 이 Day의 검증 로그에 실린 원문도 `Failed to read the 'localStorage' property from 'Window'`예요(`docs/verification/p1-days-21-30.md`, "저장소 차단 오류 문구" 행). 코드는 `try` 안에서 접근하므로 동작은 맞아요.

### M-4. `role="status"`와 `aria-live="polite"`는 완전히 같지 않아요

- 위치: `textbook/content/p1/day-24.md:117`, 코드 주석 `reference/p1-my-creator-site/contact.html`(`role="status"` 윗줄)과 같은 주석이 있는 Day 24·28 전체 블록
- 바른 설명: `role="status"`는 `aria-live="polite"`에 `aria-atomic="true"`까지 함께 가져요. "거의 같은 뜻"으로 고치면 충분해요.
- 출처(일반 지식): [MDN status role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role)

### M-5. `rel="noopener noreferrer"` 설명이 절반이에요

- 위치: `textbook/content/p1/day-20.md:342`
- 현재: "새 탭이 우리 페이지를 건드리지 못하게 하는 안전 장치". 이건 `noopener`의 일이에요.
- 바른 설명: 덧붙이기: "`noreferrer`는 어느 페이지에서 왔는지(주소)를 상대 사이트에 알리지 않아요."
- 출처(일반 지식): [MDN rel=noreferrer](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/noreferrer)

### M-6. 용어 단순화 2건

- `textbook/content/p1/day-07.md:70`: PowerShell을 "터미널 프로그램"이라고 해요. 정확히는 터미널(창) 안에서 돌아가는 **셸**(명령 해석 프로그램)이에요. P2 터미널 기초와 맞추려면 "터미널 안에서 명령을 알아듣는 프로그램"이 좋아요(일반 지식).
- `textbook/content/p1/day-15.md:47`: "JavaScript 한 줄을 문장(statement)". 문장은 줄 단위가 아니에요. `if`·`function`은 여러 줄이 한 문장이에요(일반 지식). "명령 하나를 문장이라고 해요"로 충분해요.

### M-7. 오버레이 시각 검사가 `HH:MM`보다 넓어요

- 위치: `textbook/content/p1/day-27.md:318`(`isValidStart`), `reference/p1-my-creator-site/overlay/countdown.js`
- 문제: `Number()`만 쓰므로 `20.5:00`, `1e1:30`도 통과해요(코드 분석, 실행 안 함). 화면이 깨지지는 않고 `setHours`가 소수를 버려요. 정답 코드와 같으니 코드는 그대로 두고, 교재에 "모양을 완벽히 보는 검사는 아니에요" 한 줄이면 충분해요. 고칠 필요가 없다고 판단해도 무방해요.

## Verified OK

**코드와 정답 대조 (측정)**
- 블록 659개 추출. `js` 138개와 `css` 104개, `json` 8개를 구문 검사했어요. 실패 5건은 모두 앞뒤 문맥이 있는 일부 조각(`day-20:529`, `day-24:671`, `day-25:476`, `day-26:113`, `day-26:582`)이고 진짜 오류는 0이에요.
- `reference/p1-my-creator-site`의 코드 파일 21개 중 `css/style.css`를 뺀 20개(HTML·JS·JSON·SVG·`overlay/countdown.css`)가 교재 블록과 **글자 단위로 일치**해요. 예: `index.html`=`day-28:565`, `contents.js`=`day-25:523`, `main.js`=`day-25:750`, `contact.js`=`day-24:808`, `schedule.js`=`day-26:634`, `countdown.js`=`day-27:680`.
- `style.css`는 전체 블록이 없고 조각으로 쌓아요. 정답의 모든 줄이 교재 CSS 블록 어딘가에 있어요(누락 0). 순서와 삽입 위치는 작성자 로그의 재생 diff에 근거해요.

**버전·CLI (측정)**
- GitHub API 최신값이 교재·자료와 같아요: Git for Windows `v2.56.0.windows.4`(2026-10-26), OBS Studio `33.0.1`(2026-10-29). 검색 결과의 OBS 32.1.2는 2026-07 기준의 제3자 페이지라 채택하지 않았어요.
- `powershell` 블록 53개를 모두 읽었어요. 전부 PowerShell 5.1에서 유효한 `git`·`cd`·`Get-ChildItem` 명령이고, 없는 플래그는 없어요(일반 지식).

**오프라인·단일 파일 (측정)**
- `SMOKE_INDEX=index.html`로 루트 교재를 검사: Day 30개, 페이지 4개, 코드 블록 659개, 360px, 콘솔 오류 0, **외부 요청 0**.
- `npm run test:e2e`(새 빌드) 26개 모두 통과. 저장소 변경 없음.
- 루트 `index.html`은 P1 내용을 바꾼 마지막 커밋(`6166d21`)과 같은 커밋에서 만들어졌어요. 새 빌드와의 차이는 P2 초안에서 시작돼요(첫 차이 지점이 P2의 `checkCount`이고, 전체 비교는 하지 않았어요).

**설명·보안 (정독)**
- 맞는 설명: `const`와 `push`(`day-17:41`), `fetch`가 404를 오류로 보지 않음(`day-25:99`), `file://`의 `fetch` 차단(`day-25:103`), JSON 규칙, 저장소가 주소별로 분리됨(`day-22:85`), `auto-fit`/`auto-fill`, `role="timer"`, `aria-pressed`, 테마 깜빡임, `setInterval` 괄호, `getDay`(일요일 0).
- 맞는 보안 조언: 클라이언트 검증은 믿을 수 없고 서버가 다시 검사(`day-24:52`), 공개 저장소에 비밀 넣지 않기(`day-14:81`), 콘솔 붙여 넣기 사기 경고(`day-15:864`), 이메일 노출과 noreply(`day-07:187`), 설치 시 게시자 확인.
- 정답 코드는 데이터를 `textContent`로만 넣어요. `innerHTML`을 쓰지 않아요.
- YouTube `referrerpolicy`와 `file://` 재생 문제(`day-08:655`)를 교재가 이미 안내해요. 오류 153의 Referer 원인과 맞아요(검색: [Simon Willison](https://til.simonwillison.net/youtube/fixing-153-embed)). `file://`에서 실패한다는 점 자체는 출처로 확인되지 않았지만, 교재도 "못 채울 수 있어요"로 적었어요.

**검증 로그**
- `p1-days-21-30.md`의 "Day 28 끝 상태 = 레퍼런스" 주장은 위 독립 대조로 뒷받침돼요. Windows·OBS·Lighthouse 화면, YouTube 재생은 "실기 미확인"으로 정직하게 적혀 있고, 교재 쪽에도 "버전에 따라 달라요" 표기가 있어요.

## Not verified

- **산문 전문**: 개념 절을 정독하지 않은 Day(2~6, 8~13, 16~21, 23, 29, 30)와 모든 Day의 따라하기·🧯 산문은 키워드 검색으로만 확인했어요. CSS Day(9~13)의 세부 설명이 가장 덜 검토됐어요.
- **GitHub 새 저장소 화면 문구**(`textbook/content/p1/day-07.md:204-205`): `Public`, `Add a README file`, `Choose a license`. 공식 문서 검색으로 현재 github.com 문구를 확인하지 못했어요. 기억으로는 요즘 화면이 `Add README` 토글, `Add license`처럼 달라졌지만 **추측**이에요. 설치 마법사처럼 "문구는 달라질 수 있어요" 한 줄을 넣기를 권해요.
- **로그인이 필요한 화면**: GitHub Pages 설정(`Deploy from a branch`, `/ (root)`), Actions 이름, `Sign in with your browser`. 일반 지식과 맞지만 실제 화면은 못 봤어요.
- **Windows 실기**: Git 설치 마법사 순서, VS Code 한국어 메뉴와 신뢰 창, Windows 설정 경로, Edge DevTools 탭과 Lighthouse 위치, OBS 속성 창.
- **Live Preview**: 기본 포트 `3000`, `Show Preview` 명령은 코드나 실행으로 확인하지 않았어요(`external-facts` 2절과 작성자 로그에 근거).
- **블록별 재현**: 일부 Day의 중간 상태 코드와 오류 원문은 다시 실행하지 않고 작성자 로그에 의존했어요. HTML은 W3C 검사기로 돌리지 않았어요.
- **Lighthouse 점수**: 로그는 `lighthouse@12.8.2` 기준이에요. 교재는 "내 점수는 달라요"로 안내하고, 최신 버전과의 차이는 확인하지 않았어요.
