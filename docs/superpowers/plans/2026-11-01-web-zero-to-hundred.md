# Web Zero to Hundred 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 지식 0% 초보자(Windows 11, 하루 1~2시간)가 막힘 없이 따라갈 수 있는 155 Day짜리 단일 HTML 교재를 만든다. 구성은 P1 30 / P2 40 / P3 45 / SP 40 Day + 부록 + 졸업 로드맵이고, 교재에 실리는 정답 코드는 모두 실제로 검증한다.

**Architecture:** 교재 원본은 Markdown(Day별 파일)과 `curriculum.json`으로 나눠 쓴다. Node 빌드 스크립트가 이것을 검증·렌더링(코드 강조 포함)한 뒤, CSS·JS·본문·검색 색인을 모두 인라인한 루트 `index.html` 하나로 합친다. 각 프로젝트의 "정답의 원천"은 `reference/`에 둔 검증된 완성 코드다. Day 본문은 프로젝트별 상세 개요(`_outline.md`)를 따라 병렬로 작성하고, 초보자 시뮬레이션 리뷰와 기술 리뷰를 거친다.

**Tech Stack:** Node ≥ 22(빌드·테스트), marked, highlight.js, esbuild(빌드 전용 devDependencies), node:test, Playwright(사전 설치본). 레퍼런스: HTML/CSS/JS, TypeScript+Vite, .NET 10(C#, ASP.NET Core, EF Core, Identity, SignalR, xUnit), Rust(Axum, Tokio, SQLx, wasm-bindgen), React+TS, PostgreSQL, Docker.

**Spec:** `docs/superpowers/specs/2026-11-01-web-zero-to-hundred-design.md`(실행자는 이 계획과 설계서를 함께 읽는다)

## Global Constraints

- 학습자 환경: **Windows 11**. 터미널은 **PowerShell**. 경로는 항상 전체 경로로 쓴다.
- 학습자 작업 폴더: P1 `C:\dev\my-creator-site`, P2 `C:\dev\streamer-hub`, P3 `C:\dev\viewer-arena`, SP `C:\dev\image-donation`.
- Day 수: `p1` 30, `p2` 40, `p3` 45, `sp` 40. Day당 `minutes`는 60~120.
- 해금: `p1` requires [], `p2` [`p1`], `p3` [`p2`], `sp` [`p2`]. 페이지 `roadmap` requires [`p3`].
- track: `p1`·`p2`·`p3` = `main`, `sp` = `special`.
- 진도 저장 키: `wzh:v1:progress`.
- Day 필수 h2 순서(정확히 이 문자열, U+FE0F 유무는 무시): `🎯 오늘의 목표` → `📖 개념 이해` → `🛠️ 따라하기` → `✍️ 과제` → `✅ 정답` → `🧯 자주 막히는 곳` → `📝 오늘의 체크리스트` → (선택) `📚 더 알아보기`.
- 확장 블록: `:::tip`, `:::warn`, `:::info`, `:::path`, `:::success`, `:::answer <제목>`. 중첩 금지.
- 결과물 `index.html`: 런타임 외부 요청 0건(CDN·웹폰트 없음), 16MB 미만, `file://`로 더블클릭해도 동작(Windows 11 기본 브라우저인 Edge = Chromium).
- 문체: 해요체. 버전에 민감한 내용에는 "작성 기준일 2026-11"을 표기하고 `--version` 확인법을 함께 둔다. 존재하지 않는 API·옵션을 쓰지 않는다.
- SP는 결제를 다루지 않는다. 테스트 모드(가짜 후원 이벤트)로 전체 흐름을 실습할 수 있어야 한다.
- 리포지토리의 어떤 파일에도 모델 식별자를 쓰지 않는다. 커밋 메시지는 시스템이 지정한 attribution 줄로 끝낸다.
- 병렬로 실행하는 작업 에이전트는 **git 커밋·푸시를 하지 않는다**(인덱스 충돌 방지). 커밋·푸시는 오케스트레이터가 리뷰를 통과한 뒤에 한다. 컨테이너는 휘발성이므로 **각 Task가 끝날 때마다 커밋·푸시**한다.

## Review Focus

1. 잠긴 프로젝트의 Day 주소(`#/day/p2-d01`)로 직접 접속 → 본문 대신 잠금 화면과 해금 조건이 보여야 한다. → Task 5 e2e `locked deep link shows lock screen`
2. `localStorage`를 쓸 수 없음(브라우저 설정·정책) → 교재는 정상 표시되고 "진도가 저장되지 않아요" 배너가 떠야 한다. → Task 4 unit `store falls back to memory when storage throws` + Task 5 e2e `storage unavailable banner`
3. 손상되었거나 다른 교재·버전의 백업 파일 불러오기 → 오류 메시지를 보여 주고 기존 진도를 보존하거나, 알 수 없는 Day만 제거하고 가져와야 한다. → Task 4 unit `importBackup rejects garbage / drops unknown days` + Task 5 e2e `corrupt backup keeps progress`
4. 본문 산문에 백틱 없이 쓴 HTML 태그(`<script>`, `<h1>`) → 글자 그대로 보여야 하고, 실행되거나 레이아웃이 깨지면 안 된다. → Task 2 unit `raw HTML in prose is escaped`
5. 360px 폭 휴대폰 + 긴 코드 줄 → 페이지 가로 스크롤이 없어야 하고, 코드 블록 안에서만 스크롤되어야 한다. → Task 5 e2e `no horizontal page scroll at 360px`

(추가 고정: 클립보드 API가 거부되는 환경에서도 코드 복사가 대체 경로로 동작해야 한다 → Task 5 e2e `copy falls back when clipboard denied`)

---

## 파일 구조

```
index.html                         빌드 결과물(커밋)
README.md                          사용법·빌드·GitHub Pages 공개 방법           (Task 36)
HANDOFF.md                         인수인계                                       (Task 36)
docs/research/external-facts.md    버전·설치·외부 API 조사 결과와 출처            (Task 1)
docs/CONTENT-GUIDE.md              작성 규칙·Day 템플릿·리뷰 체크리스트          (Task 6)
docs/verification/<batch>.md       배치별 코드 실행 검증 기록                     (콘텐츠 Task들)
textbook/
  package.json                     type: module, scripts: build/check/test/test:e2e
  build.mjs                        CLI: 검증 → 렌더 → 조립 → ../index.html
  lib/markdown.mjs                 Markdown → HTML(확장 블록, 코드 강조, 체크박스, 용어 링크)
  lib/validate.mjs                 Day 소스 구조 검증
  lib/curriculum.mjs               curriculum.json 로드·검증, Day 파일 경로 결정
  lib/glossary.mjs                 용어 사전·문제 해결 파일 병합
  lib/assemble.mjs                 template에 CSS·JS·데이터·템플릿 인라인
  src/template.html, src/styles.css
  src/app/main.js                  진입점(esbuild로 IIFE 번들)
  src/app/progress.js              진도·해금 순수 로직
  src/app/storage.js               저장소 래퍼(메모리 대체)
  src/app/search.js                검색
  src/app/router.js                해시 라우팅
  src/app/views/{home,project,day,page,settings,search,shell}.js
  content/curriculum.json
  content/pages/{start,help,install,shortcuts,roadmap}.md
  content/glossary/*.md            용어 사전 조각(### 용어)
  content/troubleshooting/*.md     문제 해결 조각(### 증상)
  content/{p1,p2,p3,sp}/day-NN.md  Day 본문(NN = 01..)
  content/{p1,p2,p3,sp}/_outline.md 상세 개요(빌드 대상 아님: '_'로 시작하는 파일은 무시)
reference/
  p1-my-creator-site/  p2-streamer-hub/  p3-viewer-arena/  sp-image-donation/
tests/
  helpers/static-server.mjs        startStaticServer(root) → { url, close() }
  helpers/browser.mjs              launch(), collectConsoleErrors(page)
  unit/*.test.mjs                  렌더러·검증·런타임 로직
  build/*.test.mjs                 빌드 통합
  e2e/textbook.test.mjs            픽스처 교재로 UI 동작
  e2e/smoke.test.mjs               실제 index.html 전 Day 렌더 스모크
  reference/p1.test.mjs, p2.e2e.test.mjs, p3.e2e.test.mjs, sp.e2e.test.mjs
  fixtures/content/                작은 교재 픽스처(프로젝트 fa 2 Day, fb 1 Day, 페이지 2개)
```

공통 명령(모두 저장소 루트 기준):
- 설치: `cd textbook && npm ci`
- 콘텐츠 검사: `cd textbook && npm run check`(일부만: `npm run check -- --only p1-d02,p1-d03`)
- 빌드: `cd textbook && npm run build` → 루트 `index.html`
- 단위·빌드 테스트: `cd textbook && npm test`
- e2e: `cd textbook && npm run test:e2e`

## 실행 순서와 병렬 그룹

```
Phase 0 기반   : T1(조사) ∥ [T2 → T3 → T4 → T5](교재 엔진) ∥ T7(P1 레퍼런스)  →  T6(가이드+견본 Day)
Phase 1 P1     : T8(개요) → [T9 ∥ T10 ∥ T11] → T12(통합 리뷰)        ── 끝나면 미리보기 전달
Phase 2 P2     : T13(레퍼런스, T1 이후 언제든) → T14 → [T15 ∥ T16 ∥ T17 ∥ T18] → T19
Phase 3 P3     : T20(레퍼런스, T1 이후 언제든) → T21 → [T22 … T26 병렬] → T27
Phase 4 SP     : T28(레퍼런스, T1 이후 언제든) → T29 → [T30 … T33 병렬] → T34
Phase 5 마무리 : T35(부록) → T36(README·HANDOFF) → T37(최종 검증·전체 리뷰)
```
T13·T20·T28(레퍼런스)은 서로 독립적이므로 앞 Phase의 콘텐츠 작업과 병렬로 돌려도 된다. 단, 동시에 실행하는 에이전트는 최대 5개로 한다.

---

## Phase 0 — 기반

### Task 1: 외부 사실 조사

**Files:**
- Create: `docs/research/external-facts.md`

**Interfaces:**
- Produces: 이후 모든 Task가 버전·명령·URL을 이 문서에서 인용한다. 각 항목은 `값 | 공식 출처 URL | 확인일(2026-11-01)` 형식이다.

- [ ] **Step 1: 아래 항목을 공식 출처로 조사해 기록한다.** 출처를 확인하지 못한 항목은 `미확인`으로 표시하고 대안을 적는다.
  1. Node.js 현재 LTS 버전과 Windows 설치 방법(nodejs.org 설치 파일, `winget` ID)
  2. VS Code 설치(사용자 설치 파일, 설치 옵션), 한국어 팩 확장 ID, Microsoft **Live Preview** 확장 ID(`ms-vscode.live-server` 여부), C# Dev Kit, rust-analyzer, REST Client 확장 ID
  3. Git for Windows 최신 버전과 설치 마법사 각 화면의 권장 선택지(기본 편집기, 기본 브랜치 이름 `main`, PATH 옵션, 줄 끝 처리)
  4. GitHub Pages: 공개 저장소 조건, 무료 플랜에서 비공개 저장소 Pages 가능 여부, 설정 메뉴 경로
  5. OBS Studio 최신 버전, 브라우저 소스 추가 경로와 투명 배경 동작
  6. .NET 10 SDK 버전·지원 기간, `dotnet new` 템플릿 이름(console, web, webapi, xunit, sln/slnx 기본값), Minimal API 내장 검증(`AddValidation`) 존재 여부, `TypedResults.ServerSentEvents` 존재 여부, `MapIdentityApi` + 쿠키 로그인(`useCookies=true`) 사용법, `dotnet-ef` 설치 명령, Rate Limiting 미들웨어
  7. TypeScript·Vite 최신 버전, `npm create vite@latest`의 템플릿 이름(vanilla-ts, react-ts), React·React Router 최신 버전과 권장 사용법(라이브러리 모드), Vitest·Testing Library
  8. Rust: Windows용 rustup-init과 Visual Studio C++ Build Tools 자동 설치 흐름, 현재 안정 버전, Axum·Tokio·serde·SQLx·tracing 최신 버전, Axum WebSocket 사용법(feature 이름), **wasm-bindgen / wasm-pack 현재 관리 상태와 권장 도구**, wasm 결과물을 Vite에서 불러오는 권장 방식
  9. Docker Desktop for Windows 11 요구사항(WSL 2, 가상화), 설치 경로, 개인 사용 무료 조건, PostgreSQL 공식 이미지 최신 주 버전 태그
  10. 치지직 Open API **공식 문서 URL**, 앱 등록·심사 절차, OAuth 인가 URL·토큰 URL·요청 형식, 스코프 목록, 세션 생성·이벤트 구독 API, 소켓 프로토콜 버전, 후원 이벤트 페이로드 필드, 채팅 전송 API, 이용 약관상 제약
  11. .NET용 Socket.IO 클라이언트의 Socket.IO 2.x(EIO v3) 지원 여부(패키지 이름·옵션). 미지원이면 브라우저 `socket.io-client@2.x` 중계로 결정
  12. 이미지 처리 라이브러리(ImageSharp, SkiaSharp, Magick.NET)의 라이선스와 매직 넘버 검증·EXIF 제거·WebP 인코딩 지원 → 1개를 선택하고 이유를 기록
  13. 배포 옵션(작성 시점 기준): 정적 사이트(GitHub Pages), ASP.NET Core 앱, Docker 컨테이너(Rust 서버, SP). 각각 무료 또는 저가 옵션 1개 + 대안 1개, 카드 등록 필요 여부, 슬립·디스크 휘발성 같은 제약
  14. 빌드 의존성 최신 버전: marked, highlight.js, esbuild
- [ ] **Step 2: 각 섹션 끝에 "교재 반영 결정"을 1~3줄로 적는다**(예: "P2 Day 9는 .NET 10 SDK를 쓴다").
- [ ] **Step 3: 커밋** — `docs: add external facts research (versions, install steps, CHZZK API)`

### Task 2: 콘텐츠 렌더러와 Day 검증기

**Files:**
- Create: `textbook/package.json`, `textbook/lib/markdown.mjs`, `textbook/lib/validate.mjs`
- Test: `tests/unit/markdown.test.mjs`, `tests/unit/validate.test.mjs`

**Interfaces:**
- Produces:
  - `renderMarkdown(src: string, ctx: { idPrefix: string, terms: Map<string,string> /* 용어 → slug */, routes: Set<string> /* '#/day/p1-d01', '#/page/start' … */ }) → { html: string, text: string, checkCount: number, answerCount: number, headings: {level:number,text:string,id:string}[], errors: BuildError[] }`
  - `slugify(s: string) → string`: 소문자화하고, 공백은 `-`로 바꾸며, `[a-z0-9가-힣-]` 이외의 문자는 제거한다.
  - `validateDaySource(src: string, opts: { minChars: number }) → BuildError[]`
  - `BuildError = { code: string, line: number|null, message: string }`(message는 한국어)
  - `LANG_MAP`: 허용 언어 → highlight.js 이름. `html→xml, xml→xml, css, js/javascript/jsx→javascript, ts/typescript/tsx→typescript, json, powershell, csharp/cs→csharp, sql, rust, toml→ini, dockerfile, yaml/yml→yaml, http, diff, md/markdown→markdown, text/plaintext→plaintext, bash`

- [ ] **Step 1: `textbook/package.json`을 만든다.** `"type":"module"`, `"private":true`, `engines.node ">=22"`, devDependencies는 marked·highlight.js·esbuild(Task 1의 버전으로 정확히 고정). scripts:
  - `"build": "node build.mjs"`
  - `"check": "node build.mjs --check"`
  - `"test": "node --test \"../tests/unit/**/*.test.mjs\" \"../tests/build/**/*.test.mjs\""`
  - `"test:e2e": "node --test \"../tests/e2e/**/*.test.mjs\""`

  그다음 `npm install`을 실행해 `package-lock.json`을 만든다.
- [ ] **Step 2: 실패하는 테스트를 쓴다.** `tests/unit/markdown.test.mjs`:
  - `raw HTML in prose is escaped`: `'문단 <script>alert(1)</script> 끝'` → html에 `<script>`가 없고 `&lt;script&gt;`가 있다. 블록 HTML(`<div>x</div>` 단독 줄)도 escape된다.
  - `container renders with class and title`: `':::tip 꿀팁\n내용\n:::'` → `<aside class="callout callout-tip">`와 제목 `꿀팁`을 포함한다.
  - `answer container renders details`: `':::answer 과제 1 정답\n**굵게**\n:::'` → `<details class="answer" data-answer="p1-d01-a1">`, `<summary>`에 `과제 1 정답`, 내부 `<strong>`. `answerCount === 1`
  - `fence without language is an error`: 오류 code `E_FENCE_LANG`, line은 펜스 시작 줄
  - `unknown fence language is an error`: ` ```cobol ` → `E_FENCE_LANG_UNKNOWN`
  - `file caption attaches to following fence`: `'📄 C:\\dev\\a\\index.html\n```html\n<p>x</p>\n```'` → `<figure class="code"`, `<figcaption>`에 경로, 그 경로 문단은 따로 남지 않음, `&lt;p&gt;`가 있음(코드 escape), `<button class="copy"`
  - `code block is highlighted`: ` ```js\nconst a = 1;\n``` ` → `hljs-keyword` 포함
  - `task list items become tracked checkboxes`: `'- [ ] 하나\n- [ ] 둘'` → `data-check="0"`, `data-check="1"`, `checkCount === 2`, `disabled` 없음
  - `known term links to glossary`: terms `{'HTML'→'html'}`, `'[[HTML]] 배우기'` → `<a class="term" href="#/page/glossary/term-html">HTML</a>`
  - `unknown term is an error`: `E_TERM_UNKNOWN`
  - `internal link to unknown route is an error`: `[x](#/day/p9-d01)` → `E_LINK_UNKNOWN`. 알려진 route는 오류가 없다.
  - `external link opens safely`: `[MDN](https://developer.mozilla.org)` → `target="_blank" rel="noopener noreferrer"`
  - `headings get prefixed ids`: `## 🛠️ 따라하기` → id `p1-d01-따라하기`(slugify를 거친 뒤 이모지 제거)
  - `container markers inside code fences are ignored`: 펜스 안의 `:::`는 블록으로 처리하지 않는다.
  - `nested container is an error` → `E_CONTAINER_NESTED`, `unclosed container` → `E_CONTAINER_UNCLOSED`, `unknown container type` → `E_CONTAINER_TYPE`
  - `text strips markup for search`: text에 태그가 없고, 코드 내용은 포함한다.

  `tests/unit/validate.test.mjs`(최소 유효 Day 픽스처 문자열을 테스트 안에서 만든다):
  - `valid day passes` → `[]`
  - `missing section` → `E_SECTION_MISSING`(누락 제목 포함)
  - `wrong order` → `E_SECTION_ORDER`
  - `variation selector tolerated`: `🛠 따라하기`(U+FE0F 없음)도 통과
  - `extra h2 not allowed` → `E_SECTION_UNKNOWN`. `📚 더 알아보기`는 마지막에만 허용
  - `h1 not allowed` → `E_H1`
  - `answer section needs :::answer` → `E_ANSWER_MISSING`
  - `checklist needs >= 3 items` → `E_CHECKLIST_SHORT`
  - `placeholder text rejected`: `TODO|TBD|FIXME|작성 예정` → `E_PLACEHOLDER`
  - `too short rejected`: 길이 < minChars → `E_TOO_SHORT`
- [ ] **Step 3: 실행해서 실패를 확인한다** — `cd textbook && node --test ../tests/unit/` → 모듈 없음으로 FAIL
- [ ] **Step 4: 구현한다.** 순서는 다음과 같다. ① 줄 단위 전처리: 펜스 상태를 추적하면서 `:::` 블록을 분리하고, `📄 ` 캡션을 다음 펜스에 붙인다. ② 블록 내부는 marked로 재귀 렌더링한다(중첩은 오류). ③ marked renderer를 재정의한다: `html` 토큰은 escape, `code`는 hljs+figure, `listitem`의 task는 체크박스, `link`는 route 검증과 외부 링크 속성, `heading`은 id 부여. ④ `[[용어]]`는 inline extension으로 처리한다. `validateDaySource`는 marked lexer의 h2 토큰과 원문을 정규식으로 검사한다.
- [ ] **Step 5: 실행해서 통과를 확인한다** — 같은 명령, 모두 PASS
- [ ] **Step 6: 커밋** — `feat(textbook): markdown renderer and day validator`

### Task 3: 커리큘럼 로더, 용어 병합, 조립, 빌드 CLI

**Files:**
- Create: `textbook/lib/curriculum.mjs`, `textbook/lib/glossary.mjs`, `textbook/lib/assemble.mjs`, `textbook/build.mjs`, `textbook/src/template.html`, `textbook/src/app/main.js`(이 Task에서는 빈 진입점), `tests/fixtures/content/**`
- Test: `tests/unit/curriculum.test.mjs`, `tests/unit/glossary.test.mjs`, `tests/build/build.test.mjs`

**Interfaces:**
- Consumes: Task 2의 `renderMarkdown`, `validateDaySource`, `slugify`
- Produces:
  - `curriculum.json` 스키마:
    `{ version:1, title, writtenAt:"2026-11", validation:{ minDayChars:number }, projects:[{ id, order, track:'main'|'special', title, subtitle, folder, stack:string[], requires:string[], summary, outcome, days:[{ title, minutes, summary, keywords:string[] }] }], pages:[{ id, title, requires?:string[], file?:string, generated?:'glossary'|'troubleshooting' }] }`
  - `loadCurriculum(contentDir) → Promise<{ curriculum, errors: BuildError[] }>`: Day에 `id = `${pid}-d${NN}``, `num`, `file = <contentDir>/<pid>/day-NN.md`를 붙인다. 오류 코드: `E_CUR_SCHEMA`, `E_CUR_DUP_ID`, `E_CUR_REQUIRES`(없는 프로젝트를 참조하거나 순환), `E_CUR_FILE_MISSING`, `E_CUR_ORPHAN_FILE`(커리큘럼에 없는 `day-NN.md`)
  - `parseGlossary(files: {file, src}[]) → { entries: {term, slug, md, file}[], errors }`: `### 용어` 단위로 나눈다. 대소문자를 무시한 중복은 `E_TERM_DUPLICATE`
  - `parseTroubleshooting(files) → { groups: {project, entries:{title, md}[]}[], errors }`: 파일명 접두어(`p1`, `p2`, …)로 그룹을 나눈다.
  - `assemble({ templateHtml, css, js, data, templates: {id, html}[] }) → string`: 자리표시자 `<!--WZH:CSS-->`, `<!--WZH:DATA-->`, `<!--WZH:TEMPLATES-->`, `<!--WZH:JS-->`를 채운다. data JSON은 `</`→`<\/`, U+2028/2029 escape. 템플릿 id는 `t-day-<dayId>`, `t-page-<pageId>`
  - 임베드 data: `{ title, writtenAt, builtAt, projects:[{…메타, days:[{id,num,title,minutes,summary,checkCount}]}], pages:[{id,title,requires}], search:[{id, kind:'day'|'page', project:string|null, title, text}] }`(파일 경로 제외)
  - CLI: `node build.mjs [--check] [--only id1,id2] [--content <dir>] [--out <file>]`. 기본값은 content `./content`, out `../index.html`. 오류가 있으면 `파일:줄 CODE 메시지`를 출력하고 exit 1. 성공하면 Day 수와 결과 크기(MB)를 출력한다. `--check`는 파일을 쓰지 않는다. `--only`는 지정 Day만 렌더·검증한다(용어·route 집합은 전체 기준).
- 픽스처 `tests/fixtures/content/`: 프로젝트 `fa`(Day 2개, requires []) → `fb`(Day 1개, requires [`fa`]), 페이지 `start`(file), `secret`(file, requires [`fb`]), `glossary`(generated). `validation.minDayChars: 200`. fa Day 1에는 긴 코드 한 줄(300자 이상), 일반 문단의 `<b>굵게아님</b>`, `:::answer`, 체크리스트 3개, `[[픽스처용어]]`를 넣는다. fb Day 1에는 고유 단어 `비밀단어zz`를 넣는다.

- [ ] **Step 1: 실패하는 테스트를 쓴다.**
  - `curriculum.test.mjs`: `fixture loads with derived ids`(`fa-d01`, `fa-d02`, `fb-d01`), `requires cycle is an error`, `missing day file is an error`, `orphan day file is an error`, `underscore files are ignored`
  - `glossary.test.mjs`: `entries are split by h3 and slugged`, `duplicate term across files is an error`
  - `build.test.mjs`: ① `fixture builds to single file`: `--content tests/fixtures/content --out <tmp>/index.html` → exit 0, 파일이 있다. `<template id="t-day-fa-d01">`, `<script id="wzh-data" type="application/json">`이 있다. `<script src=`와 `<link rel="stylesheet" href=`가 없다. 크기 < 16MB ② `invalid content fails build`: 임시 복사본의 fa Day 1에서 `## ✅ 정답`을 삭제 → exit 1, stdout에 `E_SECTION_MISSING` ③ `check mode writes nothing`
- [ ] **Step 2: 실행해서 실패를 확인한다** — `cd textbook && npm test` → FAIL
- [ ] **Step 3: 구현한다.** `template.html`은 설계서 4장의 쉘 구조다: skip 링크, `header.topbar`(메뉴 버튼·브랜드·검색 입력·테마 토글·설정 링크), `nav#sidebar`, `main#main[tabindex=-1]`, `div#storage-banner[hidden]`, 자리표시자 4개. `<html lang="ko">`, viewport meta, `<title>웹 제로 투 헌드레드</title>`. JS는 esbuild `bundle:true, format:'iife', minify:true, target:'es2020', write:false`로 번들한다.
- [ ] **Step 4: 실행해서 통과를 확인한다** — `npm test` → PASS
- [ ] **Step 5: 커밋** — `feat(textbook): curriculum loader, glossary merge, single-file assembler`

### Task 4: 런타임 로직(진도·해금·저장·검색·라우팅)

**Files:**
- Create: `textbook/src/app/progress.js`, `textbook/src/app/storage.js`, `textbook/src/app/search.js`, `textbook/src/app/router.js`
- Test: `tests/unit/progress.test.mjs`, `tests/unit/storage.test.mjs`, `tests/unit/search.test.mjs`, `tests/unit/router.test.mjs`

**Interfaces:**
- Consumes: Task 3의 임베드 data 형태(`cur` = data)
- Produces(모두 순수 함수, 입력 객체를 바꾸지 않는다):
  - `STORAGE_KEY = 'wzh:v1:progress'`
  - `Progress = { version:1, completed: {[dayId]: isoString}, checks: {[dayId]: number[]}, lastDay: string|null, theme: 'system'|'light'|'dark' }`
  - `emptyProgress() → Progress`
  - `normalizeProgress(raw: unknown, cur) → Progress`: 형식이 틀린 값은 버리고, 알 수 없는 dayId를 제거하고, checks 인덱스는 `0..checkCount-1`만 남긴다. 실패하면 빈 진도를 반환한다.
  - `isProjectComplete(cur, prog, pid) → boolean`, `isUnlocked(cur, prog, requires: string[]) → boolean`
  - `projectState(cur, prog, pid) → 'locked'|'active'|'complete'`
  - `dayState(cur, prog, dayId) → 'locked'|'done'|'next'|'open'`: `next` = 해금된 프로젝트에서 가장 앞의 미완료 Day, `open` = 해금되었지만 아직 완료할 수 없는 Day
  - `canComplete(cur, prog, dayId) → boolean`: 프로젝트가 해금되었고, 첫 Day이거나 이전 Day가 완료된 경우
  - `canUncomplete(cur, prog, dayId) → boolean`: 완료된 상태이고, 같은 프로젝트의 다음 Day가 미완료이며, 이 프로젝트를 requires로 둔 프로젝트에 완료된 Day가 하나도 없는 경우
  - `completeDay(cur, prog, dayId, nowIso) → Progress`(불가하면 throw `Error('cannot-complete')`), `uncompleteDay(cur, prog, dayId) → Progress`
  - `toggleCheck(prog, dayId, index) → Progress`
  - `newlyUnlocked(cur, before, after) → string[]`(해금된 프로젝트·페이지 id. 축하 배너에 쓴다)
  - `continueTarget(cur, prog) → dayId|null`: main track을 order 순으로 보고 첫 `next`를 고른다. main이 끝났으면 special의 `next`, 그것도 없으면 null
  - `percent(cur, prog, track) → integer 0..100`(내림)
  - `exportBackup(prog, nowIso) → string`: `{ app:'web-zero-to-hundred', schema:1, exportedAt, progress }`
  - `importBackup(text, cur) → { ok:true, progress, dropped:number } | { ok:false, error:string }`(한국어 오류: JSON 아님, 다른 앱 파일, 지원하지 않는 schema)
  - `createStore(storage?: Storage) → { available: boolean, load(): unknown|null, save(p): boolean }`: 모든 접근을 try/catch로 감싼다. 저장소를 쓸 수 없으면 메모리에 보관하고 `available=false`
  - `search(index, query, isProjectUnlocked: (pid)=>boolean, limit=30) → {id, kind, project, title, snippet: string|null}[]`: NFC 정규화·소문자화, 공백으로 나눈 모든 단어가 title+text에 있어야 한다. 점수는 제목 일치 ×10 + 본문 등장 횟수. 잠긴 프로젝트의 결과는 snippet을 null로 한다. snippet은 첫 일치 위치 앞뒤 40자.
  - `parseHash(hash: string) → Route`: `''|'#/'`→`{name:'home'}`, `#/project/<pid>`, `#/day/<dayId>`, `#/page/<id>[/<anchor>]`(anchor는 decodeURIComponent), `#/settings`, `#/search?q=<q>`, 그 외 `{name:'notfound'}`

- [ ] **Step 1: 실패하는 테스트를 쓴다**(픽스처 data는 테스트 안에서 fa 2 Day·fb 1 Day·secret 페이지로 만든다)
  - progress: `first day is next, second is open`, `cannot complete second before first`, `completing all fa unlocks fb`(`newlyUnlocked` → `['fb']`), `uncomplete only latest`, `uncomplete blocked when dependent project has progress`, `continueTarget moves to fb after fa`, `percent floors`, `normalize drops unknown days and bad checks`, `importBackup rejects garbage`(`'not json'`, `'{"app":"other"}'`, schema 2), `importBackup drops unknown days`(dropped === 1), `export→import roundtrip`
  - storage: `store falls back to memory when storage throws`(getItem/setItem이 throw하는 가짜 Storage → available false, save true, load는 저장한 값)
  - search: `matches all terms`, `title match ranks first`, `locked project hides snippet`, `korean NFC query matches`
  - router: `parses all routes`, `decodes percent-encoded anchor`(`#/page/glossary/term-%EC%83%81%EB%8C%80` → anchor `term-상대`), `unknown is notfound`
- [ ] **Step 2: 실행해서 실패를 확인한다** — `npm test` → FAIL
- [ ] **Step 3: 구현한다**(위 시그니처대로)
- [ ] **Step 4: 실행해서 통과를 확인한다** — `npm test` → PASS
- [ ] **Step 5: 커밋** — `feat(textbook): progress, unlock, storage, search and router logic`

### Task 5: 런타임 UI·스타일과 e2e

**Files:**
- Create: `textbook/src/app/views/{shell,home,project,day,page,settings,search}.js`, `textbook/src/styles.css`, `tests/helpers/browser.mjs`, `tests/helpers/static-server.mjs`
- Modify: `textbook/src/app/main.js`
- Test: `tests/e2e/textbook.test.mjs`

**Interfaces:**
- Consumes: Task 4의 모든 함수, Task 3의 data·템플릿 id
- Produces(테스트·후속 Task가 쓰는 DOM 계약):
  - `data-testid`: `progress-main`, `progress-special`, `continue-button`, `complete-button`, `uncomplete-button`, `lock-screen`, `storage-banner`, `unlock-banner`, `answer-gate`, `answer-gate-confirm`, `search-input`, `theme-toggle`, `export-button`, `import-input`, `import-message`, `reset-button`
  - 사이드바 Day 링크: `a[data-day="<dayId>"][data-state="locked|done|next|open"]`
  - `startStaticServer(rootDir) → Promise<{ url: string, close(): Promise<void> }>`, `launch() → Promise<Browser>`(createRequire로 전역 playwright를 불러온다), `collectConsoleErrors(page) → string[]`(live 배열)

- [ ] **Step 1: 실패하는 e2e를 쓴다.** `before`에서 픽스처를 임시 `index.html`로 빌드하고 `file://` URL로 연다. 모든 테스트 끝에서 `collectConsoleErrors`가 빈 배열이어야 한다.
  - `home shows 0% and continue goes to fa-d01`
  - `complete flow unlocks next project`: fa-d01 체크 3개 → 완료 → fa-d02 완료 → `unlock-banner`에 fb 제목, 사이드바 fb-d01이 `data-state="next"`
  - `complete disabled until previous done`: fa-d02로 바로 이동 → `complete-button` disabled + 이유 문구
  - `locked deep link shows lock screen`: 새 컨텍스트에서 `#/day/fb-d01` → `lock-screen` 보임, 본문 단어 `비밀단어zz` 없음
  - `storage unavailable banner`: `addInitScript`로 `localStorage` getter가 throw하게 함 → 홈 렌더 + `storage-banner` 보임
  - `corrupt backup keeps progress`: fa-d01 완료 → 설정에서 `{"app":"other"}` 파일 import → `import-message`에 오류, fa-d01은 여전히 done
  - `answer gate`: 정답 summary 클릭 → `answer-gate` 보이고 내용 숨김 → `answer-gate-confirm` → details open
  - `search hides locked snippet`: `비밀단어zz` 검색 → fb-d01 결과는 제목만, `fa` 결과는 snippet 있음
  - `theme persists after reload`
  - `no horizontal page scroll at 360px`: viewport 360×740, fa-d01 → `document.documentElement.scrollWidth <= innerWidth`
  - `copy falls back when clipboard denied`: `navigator.clipboard.writeText`가 reject → 복사 버튼 문구가 `복사됨`
  - `raw html shown as text`: fa-d01의 `main b` 요소가 0개
  - `reset clears progress after confirm`: fa-d01 완료 → 설정에서 `reset-button` → 확인 대화상자 수락 → 홈 `progress-main`이 0%
  - `keyboard reachable`: Day 화면에서 Tab만으로 사이드바 링크·체크박스·`complete-button`에 포커스가 가고, 포커스 표시(outline)가 보임
- [ ] **Step 2: 실행해서 실패를 확인한다** — `npm run test:e2e` → FAIL
- [ ] **Step 3: 구현한다.**
  - 라우터: `hashchange`에서 렌더하고 `#main`으로 포커스를 옮긴다.
  - Day 뷰: `template.content.cloneNode(true)` → 체크박스 상태 바인딩(`data-check`) → 정답 게이트(첫 클릭에 summary 기본 동작을 막고 게이트 표시. 확인은 세션 메모리에만 기록) → 복사 버튼(clipboard 실패 시 숨긴 textarea + `document.execCommand('copy')`) → 하단(완료·완료 취소·이전/다음).
  - 완료 후 `newlyUnlocked`가 있으면 배너를 띄운다.
  - 스타일: `:root` 토큰. 다크 모드는 `@media (prefers-color-scheme: dark)`를 `:root:not([data-theme="light"])`로 감싸고, `:root[data-theme="dark"]`에도 같은 값을 둔다. 글꼴은 `"Malgun Gothic","Apple SD Gothic Neo",system-ui,sans-serif`, 코드는 `Consolas,"D2Coding",monospace`. 960px 미만에서는 사이드바를 오프캔버스로 바꾼다. `pre { overflow-x:auto }`, `main { min-width:0 }`. hljs 토큰 색은 두 테마 모두 명도 대비 4.5:1 이상. `prefers-reduced-motion`을 존중한다.
- [ ] **Step 4: 실행해서 통과를 확인한다** — `npm run test:e2e` → PASS, 그리고 `npm test` → PASS
- [ ] **Step 5: 커밋** — `feat(textbook): runtime UI, styles and e2e tests`

### Task 6: 작성 가이드와 견본 Day(P1 Day 1)

**Files:**
- Create: `docs/CONTENT-GUIDE.md`, `textbook/content/curriculum.json`(P1 메타 30개 + pages `start`, `help`, `glossary`, `troubleshooting`), `textbook/content/p1/day-01.md`, `textbook/content/glossary/p1.md`(Day 1 용어만), `textbook/content/troubleshooting/p1.md`
- Test: `npm run check`, `npm run build`, 수동 렌더 확인

**Interfaces:**
- Consumes: Task 1(VS Code·브라우저 사실), Task 2~5 엔진
- Produces: 모든 콘텐츠 Task가 따르는 `docs/CONTENT-GUIDE.md`. 반드시 포함할 내용:
  1. 설계서 5장 규칙 전부(섹션 순서, 블록, 문체)
  2. **막힘 방지 규칙**
     - (a) `🎯 오늘의 목표` 끝에 `:::path 📂 시작 상태`를 둔다. 어제 끝난 시점에 있어야 할 파일·폴더를 전체 경로로 적는다.
     - (b) 따라하기의 모든 단계에 [어디서(앱·메뉴·전체 경로) / 무엇을(정확한 입력·명령) / 결과(`:::success`)]를 적는다.
     - (c) 앞 Day에서 배우지 않은 개념·도구를 쓰지 않는다(개요의 "이미 배운 것" 기준).
     - (d) `✅ 정답`에는 과제 정답과 함께 **"오늘 끝 상태 전체 코드"**를 둔다. 오늘 바뀐 파일은 200줄 이하면 전체를, 초과하면 바뀐 함수·블록 전체 + 정확한 삽입 위치를 싣는다. 막힌 학습자가 이 코드로 따라잡을 수 있게 하기 위해서다.
     - (e) 오류 메시지는 영어 원문을 그대로 싣고 한국어로 풀이한다.
     - (f) 명령어 블록 바로 아래에 예상 출력을 둔다.
     - (g) 각 Day 끝에 다음 Day 예고를 한 줄 넣는다.
  3. 코드 블록 규칙(`📄 전체 경로` 캡션, 언어 표기, Windows 줄바꿈 이슈)
  4. 용어 규칙: 처음 등장할 때 `[[용어]]` + 한 줄 정의. 용어 사전 항목 형식은 `### 용어` / 첫 줄 `- 처음 등장: [P1 Day N](#/day/p1-dNN)` / 2~4문장 정의
  5. 문제 해결 항목 형식: `### 증상(원문 오류 메시지)` / 원인 / 해결 단계
  6. 배치 작성자의 실행 검증 방법(프로젝트별 명령)과 `docs/verification/<batch>.md` 표 형식: `| Day | 블록(캡션) | 방법 | 결과 |`
  7. 리뷰 체크리스트 두 종류
     - **초보자 시뮬레이션**: 0% 초보자가 Windows 11에서 이 Day만 보고 끝까지 갈 수 있는가? 정의 없이 나온 용어가 있는가? 경로·메뉴 위치가 빠졌는가? 성공 확인이 빠진 단계가 있는가? 시간이 120분을 넘는가?
     - **기술 정확성**: reference·공식 문서와 일치하는가? 버전 표기가 맞는가? 보안상 나쁜 습관을 가르치지 않는가?
- [ ] **Step 1: 가이드를 쓴다**(위 7개 항목)
- [ ] **Step 2: 견본 P1 Day 1을 쓴다.** 내용: 컴퓨터와 웹의 첫걸음. 파일 탐색기 "보기 → 표시 → 파일 확장명" 켜기, `C:\dev` 만들기, 메모장으로 `C:\dev\hello\hello.html` 만들어 Edge/Chrome으로 열기, 과제 1~2개, 정답, 자주 막히는 곳(`hello.html.txt`로 저장되는 문제 등), 체크리스트. 가이드의 모든 규칙을 보여 주는 예시가 되게 한다.
- [ ] **Step 3: 검증한다** — `npm run check` → 0 errors. `npm run build` → `index.html`. Playwright로 Day 1 화면을 데스크톱·360px 두 크기로 스크린샷해 `docs/verification/p1-day-01.png`, `-mobile.png`로 저장하고 직접 본다.
- [ ] **Step 4: 리뷰 게이트** — 새 리뷰어 에이전트가 가이드 + Day 1을 초보자 시뮬레이션 체크리스트로 검토한다. 지적 사항을 반영한다.
- [ ] **Step 5: 커밋·푸시** — `docs: content guide and exemplar P1 Day 1`

---

## Phase 1 — P1 나의 크리에이터 홈페이지

### Task 7: P1 레퍼런스 완성 코드

**Files:**
- Create: `reference/p1-my-creator-site/` — `index.html`, `about.html`, `contents.html`, `schedule.html`, `contact.html`, `css/style.css`, `js/main.js`(메뉴 토글·다크 모드), `js/contents.js`(videos.json fetch·렌더·카테고리 필터·검색), `js/schedule.js`(오늘 요일 강조·다음 방송 카운트다운), `js/contact.js`(폼 검증·aria-live 메시지), `data/videos.json`, `data/schedule.json`, `images/*.svg`(프로필·로고·썸네일 자리 이미지. 바이너리 없음), `favicon.svg`, `overlay/countdown.html`, `overlay/countdown.css`, `overlay/countdown.js`, `README.md`
- Test: `tests/reference/p1.test.mjs`

**Interfaces:**
- Produces(개요·Day가 따르는 계약):
  - 오버레이 URL 파라미터: `?title=<방송 제목>&start=<HH:MM>`(오늘 기준 한국 시간). 시간이 지나면 "곧 시작해요!" 표시. 배경 `transparent`
  - `data/videos.json`: `[{ "id", "title", "category": "game"|"talk"|"music", "youtubeId", "date": "YYYY-MM-DD" }]`
  - `data/schedule.json`: `[{ "day": 0..6, "start": "HH:MM", "title" }]`
  - localStorage 키 `theme`(`light`|`dark`)
  - 외부 의존성 없음(YouTube iframe 제외). Day 1~30에서 배우는 문법만 사용(클래스·모듈 번들러 없음)

- [ ] **Step 1: 실패하는 테스트를 쓴다**(static-server로 제공)
  - `all pages load without console errors`
  - `all internal links resolve`(모든 `a[href]`와 `img[src]`가 상대 경로이고 200)
  - `mobile menu toggles at 375px`(`aria-expanded` 변화)
  - `theme toggle persists`
  - `contents render from json and filter by category`
  - `contact shows validation errors then success`
  - `overlay shows countdown and transparent background`(`?title=테스트&start=23:59` → 제목 표시, 시간 형식 `HH:MM:SS`, `body` 배경 `rgba(0, 0, 0, 0)`)
  - `no horizontal scroll at 360px on every page`
- [ ] **Step 2: 실행해서 실패를 확인한다** — `node --test tests/reference/p1.test.mjs` → FAIL
- [ ] **Step 3: 구현한다**(초보자가 30 Day 안에 이해할 수 있는 단순하고 관용적인 코드. 핵심 줄에 한국어 주석)
- [ ] **Step 4: 실행해서 통과를 확인한다** — PASS. Lighthouse 대신 Playwright로 `img[alt]` 누락 0개와 `meta[name=description]` 존재를 검사하는 테스트를 추가한다.
- [ ] **Step 5: 커밋** — `feat(reference): P1 creator homepage reference implementation`

### Task 8: P1 상세 개요, 커리큘럼, 시작 페이지

**Files:**
- Create: `textbook/content/p1/_outline.md`, `textbook/content/pages/start.md`, `textbook/content/pages/help.md`, `textbook/content/glossary/p1.md`(P1 전체 용어 정의)
- Modify: `textbook/content/curriculum.json`(P1 30 Day의 title·minutes·summary·keywords 확정)

**Interfaces:**
- Consumes: 설계서 3.1, Task 7 레퍼런스, CONTENT-GUIDE
- Produces: `_outline.md`의 Day별 블록 형식(배치 작성자가 이것만으로 이어 쓸 수 있어야 한다):
  ```
  ## Day N — 제목 (minutes)
  - 목표: …
  - 이미 배운 것: (이 Day가 기댈 수 있는 개념 목록)
  - 시작 상태: (파일 전체 경로 목록)
  - 오늘 만들/바꿀 파일: 경로 — 내용 요지 (레퍼런스 대응 파일)
  - 끝 상태 확인: (화면에 보여야 할 것)
  - 과제: 1) … → 정답 요지
  - 용어(사전 담당): …
  - 자주 막히는 곳 후보: …
  ```
  - `start.md`: 교재 사용법(진도·해금·정답 게이트·백업), 학습 원칙(직접 타이핑, 30분 규칙), 전체 지도, 준비물
  - `help.md`(**막혔을 때 탈출 가이드**): 오류 메시지 읽는 법, 오늘 끝 상태 코드로 따라잡기, VS Code 파일 비교(명령 팔레트 `File: Compare Active File With...`), AI·커뮤니티 질문 템플릿(Day 번호·한 일·오류 원문·스크린샷), 쉬어 가기 규칙

- [ ] **Step 1: 개요를 쓴다.** 레퍼런스의 최종 파일이 Day 30까지 모두 등장하는지 확인한다. 각 용어는 정확히 하나의 Day에만 배정한다.
- [ ] **Step 2: `glossary/p1.md`를 쓴다**(개요에 배정한 모든 용어). start·help 페이지를 쓴다.
- [ ] **Step 3: 검증한다** — `npm run check` → 0 errors
- [ ] **Step 4: 리뷰 게이트** — 새 리뷰어가 개요의 선행 지식 순서를 검사한다(쓰이기 전에 배우지 않은 개념이 없어야 한다). 반영한다.
- [ ] **Step 5: 커밋·푸시** — `docs(p1): outline, curriculum, start and help pages`

### Task 9 / 10 / 11: P1 Day 본문 작성(병렬)

| Task | Day | 배치 이름 |
|---|---|---|
| 9 | 2–10 | `p1-days-02-10` |
| 10 | 11–20 | `p1-days-11-20` |
| 11 | 21–30 | `p1-days-21-30` |

**Files(배치마다):**
- Create: `textbook/content/p1/day-NN.md`(배치 범위), `textbook/content/troubleshooting/<batch>.md`, `docs/verification/<batch>.md`
- (필요할 때만) Create: `textbook/content/glossary/<batch>-extra.md`(개요에 없던 용어)

**Interfaces:**
- Consumes: CONTENT-GUIDE, `_outline.md`, `reference/p1-my-creator-site/`, `glossary/p1.md`, 이미 있는 Day(앞 배치는 없을 수 있으니 개요의 시작 상태를 기준으로 한다)
- Produces: 배치 범위의 Day 파일(id `p1-dNN`)

- [ ] **Step 1: 입력을 모두 읽는다**(가이드, 개요 전체, 레퍼런스 전체, Day 1 견본)
- [ ] **Step 2: Day 파일을 쓴다**(가이드의 막힘 방지 규칙 (a)~(g) 전부 적용)
- [ ] **Step 3: 코드 실행 검증** — 각 Day의 "오늘 끝 상태 전체 코드"를 스크래치 폴더에 재구성하고, static-server + Playwright로 열어 콘솔 오류 0과 끝 상태 확인 항목을 검사한다. 결과를 `docs/verification/<batch>.md` 표에 기록한다. Windows 전용 절차(설치 화면·메뉴)는 "공식 문서 대조"로 기록한다.
- [ ] **Step 4: 검사** — `npm run check -- --only <배치 Day id들>` → 0 errors
- [ ] **Step 5: 보고** — 바꾼 파일 목록, 검증 결과, 개요와 달라진 점을 보고한다(커밋하지 않음)

### Task 12: P1 통합 리뷰와 미리보기 전달

**Files:**
- Modify: P1 Day 파일·용어·문제 해결(리뷰 반영)
- Test: `tests/e2e/smoke.test.mjs`(Create)

**Interfaces:**
- Produces: `smoke.test.mjs` — 실제 `index.html`을 연다. `addInitScript`로 모든 Day를 완료한 진도를 주입하고, 모든 Day·페이지 route를 차례로 방문해 다음을 확인한다. 각 Day에 필수 h2 7개가 있다. `figure.code`의 copy 버튼 수가 코드 블록 수와 같다. 콘솔 오류가 0이다. 360px에서 가로 스크롤이 없다.

- [ ] **Step 1: 스모크 테스트를 쓰고 실행한다** — `npm run build && npm run test:e2e` → PASS
- [ ] **Step 2: 리뷰 게이트(새 에이전트 2명, 병렬)**
  - ① **초보자 시뮬레이션**: Day 1→30을 순서대로 읽으며 막힐 지점을 `Day/단계/이유/수정안`으로 보고한다.
  - ② **기술 정확성**: 레퍼런스·MDN 대조, 검증 기록 확인.
- [ ] **Step 3: 지적 사항을 모두 반영하고** check·build·e2e를 다시 통과시킨다. 용어 중복을 정리한다.
- [ ] **Step 4: 커밋·푸시** — `feat(p1): 30-day creator homepage course`
- [ ] **Step 5: 사용자에게 미리보기를 전달한다** — 빌드된 `index.html`을 SendUserFile로 보내고, 피드백이 있으면 이후 Phase에 반영한다.

---

## Phase 2 — P2 스트리머 허브

### Task 13: P2 레퍼런스(TypeScript 클라이언트 + C# 서버)

**Files:**
- Create: `reference/p2-streamer-hub/server/StreamerHub.Api/`(`Program.cs`, `Data/AppDbContext.cs`, `Data/SeedData.cs`, `Entities/{Streamer,Schedule,Post,Notice,AppUser}.cs`, `Dtos/*.cs`, `Endpoints/{StreamerEndpoints,ScheduleEndpoints,PostEndpoints,NoticeEndpoints,AuthEndpoints}.cs`, `Services/*.cs`, `Migrations/`, `appsettings.json`, `appsettings.Development.json`, `StreamerHub.Api.http`), `server/StreamerHub.Tests/`, 솔루션 파일(Task 1에서 확인한 기본 형식), `client/`(Vite vanilla-ts: `index.html`, `overlay.html`, `vite.config.ts`, `src/{main.ts,router.ts,api.ts,types.ts,auth.ts,overlay.ts,style.css}`, `src/pages/{home,streamers,streamerDetail,schedule,board,postDetail,postForm,login,register,admin}.ts`), `README.md`
- Test: `dotnet test`(단위+통합), `tests/reference/p2.e2e.test.mjs`

**Interfaces:**
- Produces(개요·Day의 계약):
  - 엔티티
    - `Streamer{Id:int, Name, Platform:"chzzk"|"youtube"|"soop"|"other", ChannelUrl, Bio, AvatarUrl?, CreatedAt}`
    - `Schedule{Id, StreamerId, Title, StartsAt: DateTime(UTC), DurationMinutes}`
    - `Post{Id, AuthorId, Title(≤100), Body(≤5000), CreatedAt, UpdatedAt?}`
    - `Notice{Id, Message(≤200), CreatedAt}`
    - `AppUser : IdentityUser{DisplayName}`
  - API
    - `GET /api/streamers?q=`, `GET /api/streamers/{id}`, `POST|PUT|DELETE /api/streamers/{id?}`(Admin)
    - `GET /api/schedules?from=&to=`(UTC ISO 8601), `POST|PUT|DELETE /api/schedules/{id?}`(Admin)
    - `GET /api/posts?page=1&pageSize=20` → `{items,total,page,pageSize}`, `GET /api/posts/{id}`, `POST /api/posts`(로그인), `PUT|DELETE /api/posts/{id}`(작성자 또는 Admin, 아니면 403)
    - `GET /api/notices/current`, `POST /api/notices`(Admin), `GET /api/notices/stream`(SSE. Task 1에서 .NET 10 API를 확인한다. 없으면 수동 `text/event-stream`)
    - `/api/auth/*` = `MapIdentityApi<AppUser>()`(쿠키 로그인 `?useCookies=true`), `POST /api/auth/logout`, `GET /api/me` → `{email, displayName, roles}`
  - 오류는 ProblemDetails. 쓰기 엔드포인트는 Rate Limiting(고정 창)을 적용한다.
  - 관리자 시드: 설정 `Admin:Email`/`Admin:Password`(Development는 user-secrets, 테스트는 환경 변수). 비밀번호를 코드에 쓰지 않는다.
  - 클라이언트 라우트: `#/`, `#/streamers`, `#/streamers/:id`, `#/schedule`, `#/board`, `#/board/:id`, `#/board/new`, `#/login`, `#/register`, `#/admin`. 개발 중에는 Vite 프록시로 `/api`를 서버로 보낸다. 프로덕션에서는 `vite build` 결과를 `server/StreamerHub.Api/wwwroot`로 복사하고 서버가 제공한다(`UseStaticFiles` + `MapFallbackToFile("index.html")`)
  - 시간: DB와 API는 UTC, 화면은 `Intl.DateTimeFormat('ko-KR', {timeZone:'Asia/Seoul'})`

- [ ] **Step 0: 환경 준비** — `apt-get install -y dotnet-sdk-10.0` → `dotnet --version`이 10.x
- [ ] **Step 1: 실패하는 테스트를 쓴다**(xUnit)
  - 단위: `PostService_Update_ByOtherUser_Forbidden`, `ScheduleQuery_FiltersByUtcRange`, `StreamerValidation_RejectsEmptyName`
  - 통합(WebApplicationFactory, SQLite in-memory): `Anonymous_CannotCreatePost_401`, `Register_Login_CreatePost_201`, `NonAdmin_CannotCreateStreamer_403`, `Admin_CreatesStreamer_201`, `Posts_Paginate`, `Notice_Stream_Sends_Event`, `RateLimit_Returns429`
- [ ] **Step 2: 실행해서 실패를 확인한다** — `cd reference/p2-streamer-hub/server && dotnet test` → FAIL
- [ ] **Step 3: 서버를 구현하고** `dotnet test` → PASS
- [ ] **Step 4: 클라이언트를 구현한다** — `cd ../client && npm ci && npx tsc --noEmit && npm run build` → 성공
- [ ] **Step 5: e2e** — `tests/reference/p2.e2e.test.mjs`를 쓴다. 클라이언트를 빌드해 wwwroot로 복사하고, 서버를 임시 SQLite + 환경 변수 관리자로 실행한 뒤 다음을 확인한다: 가입 → 로그인 → 글 작성 → 목록에 보임, 관리자 로그인 → 스트리머 등록 → 목록에 보임, 공지 등록 → `overlay.html`에 3초 안에 표시, 콘솔 오류 0. 실행 → PASS
- [ ] **Step 6: 커밋** — `feat(reference): P2 streamer hub (TS + ASP.NET Core + SQLite)`

### Task 14: P2 상세 개요·커리큘럼·용어
Task 8과 같은 형식이다. 입력은 설계서 3.2와 Task 13. 산출물은 `content/p2/_outline.md`, `content/glossary/p2.md`, curriculum의 P2 40 Day(+ `requires:["p1"]`). 추가 규칙: P1 Day를 링크로 복습시킨다(`[P1 Day 25](#/day/p1-d25)`). PowerShell 실행 정책 오류, 포트 충돌, HTTPS 개발 인증서(`dotnet dev-certs https --trust`)를 "자주 막히는 곳"에 배정한다. 리뷰 게이트(선행 지식 순서) 후 커밋·푸시한다.

### Task 15 / 16 / 17 / 18: P2 Day 본문(병렬)
| Task | Day | 배치 |
|---|---|---|
| 15 | 1–10 | `p2-days-01-10` |
| 16 | 11–20 | `p2-days-11-20` |
| 17 | 21–30 | `p2-days-21-30` |
| 18 | 31–40 | `p2-days-31-40` |

단계는 Task 9와 같다. 코드 실행 검증 방법은 다음과 같다. TS 코드는 스크래치 Vite 프로젝트에서 `tsc --noEmit`과 실행. C# 코드는 스크래치 `dotnet new console|web` 프로젝트에서 `dotnet build`·`dotnet run`. 서버 단계는 `.http` 요청을 `curl`로 재현해 응답 코드를 기록한다.

### Task 19: P2 통합 리뷰
Task 12와 같다(스모크·초보자 시뮬레이션·기술 정확성·반영·커밋·푸시). 기술 리뷰어는 Microsoft Learn 문서와 대조한다.

---

## Phase 3 — P3 시청자 참여 실시간 게임

### Task 20: P3 레퍼런스(Rust 워크스페이스 + TS 클라이언트)

**Files:**
- Create: `reference/p3-viewer-arena/`
  - `Cargo.toml`(workspace: `crates/game-core`, `crates/server`, `crates/game-wasm`)
  - `crates/game-core/src/{lib.rs,vec2.rs,physics.rs,world.rs,rules.rs,protocol.rs}`
  - `crates/server/src/{main.rs,config.rs,app.rs,ws.rs,room.rs,rooms.rs,db.rs,leaderboard.rs,error.rs}`, `crates/server/migrations/0001_init.sql`, `crates/server/tests/ws_flow.rs`
  - `crates/game-wasm/src/lib.rs`
  - `client/`(Vite TS: `index.html`(방 만들기·참가), `host.html`(OBS 관전), `play.html`(휴대폰 컨트롤러), `src/{net.ts,render.ts,input.ts,interp.ts,wasm.ts,qr.ts,protocol.ts}`)
  - `Dockerfile`(멀티스테이지: client 빌드 → Rust 빌드 → 슬림 런타임), `docker-compose.yml`(server + postgres + volume), `.env.example`, `README.md`
- Test: `cargo test --workspace`, `cargo clippy --workspace -- -D warnings`, `cargo fmt --check`, `tests/reference/p3.e2e.test.mjs`

**Interfaces:**
- Produces:
  - 게임 규칙 상수(`rules.rs`): 틱 20Hz, 스냅샷 10Hz, 대기 15초, 라운드 120초, 결과 10초, 방 최대 50명, 아레나 반지름 600, 플레이어 반지름 20
  - 결정성: `World::step(&mut self, inputs: &[(PlayerId, Input)], dt: f32)`는 같은 입력에 같은 결과를 낸다(난수는 시드 기반)
  - 프로토콜(`protocol.rs`, serde `#[serde(tag = "t", rename_all = "camelCase")]`, `PROTOCOL_VERSION = 1`)
    - ClientMsg: `join{name}`, `input{seq:u32, dx:f32, dy:f32}`(길이 ≤ 1로 정규화), `ping{ts:f64}`
    - ServerMsg: `welcome{id:u32, room:String, protocol:u32}`, `snapshot{tick:u64, phase:"waiting"|"playing"|"ended", timeLeft:f32, players:[{id,name,x,y,vx,vy,score,color}], items:[{id,x,y}]}`, `result{ranking:[{name,score}]}`, `error{code, message}`, `pong{ts}`
  - HTTP: `POST /api/rooms` → `{code}`(영문 대문자 4자), `GET /api/rooms/{code}` → `{code, players, phase}`, `GET /ws/{code}?role=host|player`, `GET /api/leaderboard?period=day|all`, `GET /healthz`
  - 방은 액터로 구현한다(tokio task + `mpsc` 명령 채널 + `broadcast` 스냅샷). 비어 있는 방은 60초 뒤 정리한다.
  - 안전: 메시지 최대 1KB, 초당 입력 최대 30개(초과분은 버림), 닉네임 1~12자 + 금지어 필터, 서버에서 속도를 제한한다.
  - DB: `DATABASE_URL`이 없으면 랭킹을 끄고 경고 로그만 남긴다(Day 33 이전 단계와 호환). SQLx는 런타임 쿼리를 쓴다(컴파일 시 DB 불필요)
  - WASM: `game-wasm`은 `predict(state_json, input_json, dt) -> String`처럼 game-core의 이동 예측을 노출한다. 도구는 Task 1의 결정을 따른다(`cargo install`로 설치할 수 있는 도구)

- [ ] **Step 0: 환경 준비** — `cargo install wasm-bindgen-cli`(game-wasm의 wasm-bindgen 버전과 일치) 또는 Task 1이 정한 도구. Docker 데몬은 `dockerd` 기동을 시도하고, 실패하면 Docker 검증을 "미검증"으로 기록한다. PostgreSQL은 로컬 서버 또는 Docker로 준비한다.
- [ ] **Step 1: 실패하는 테스트를 쓴다**
  - game-core: `vec2_ops`, `normalize_zero_is_zero`, `circle_collision_separates`, `player_stays_inside_arena`, `item_pickup_scores`, `phase_transitions_waiting_playing_ended`, `step_is_deterministic`
  - protocol: `client_msg_roundtrip_json`(`{"t":"input","seq":1,"dx":1,"dy":0}`), `unknown_type_rejected`
  - server `tests/ws_flow.rs`(tokio-tungstenite 봇): `create_room_join_two_players_receive_snapshots`, `oversized_message_closes_or_errors`, `input_flood_is_throttled`, `host_role_receives_snapshots_without_player`
- [ ] **Step 2: 실행해서 실패를 확인한다** — `cargo test --workspace` → FAIL
- [ ] **Step 3: game-core → server 순으로 구현하고** test·clippy·fmt를 통과시킨다.
- [ ] **Step 4: WASM·클라이언트를 구현한다** — wasm32 빌드 + 바인딩 생성 → `client` `npm ci && npx tsc --noEmit && npm run build` 성공
- [ ] **Step 5: e2e** — `tests/reference/p3.e2e.test.mjs`: 서버(빌드된 client 제공) 실행 → 방 생성 → host.html과 play.html 2개를 열기 → play에서 키 입력 → host 캔버스의 플레이어 수 2(디버그용 `data-players` 속성) → 콘솔 오류 0
- [ ] **Step 6: Docker** — 데몬이 있으면 `docker compose up --build -d` → `/healthz` 200 → down. 없으면 미검증으로 기록한다.
- [ ] **Step 7: 커밋** — `feat(reference): P3 viewer arena (Rust + WASM + TS)`

### Task 21: P3 상세 개요·커리큘럼·용어
Task 8과 같은 형식이다. 입력은 설계서 3.3과 Task 20. 추가 규칙은 다음과 같다.
- Rust 기초(Day 1~12)의 예제는 게임 도메인(Vec2·플레이어·메시지)으로 쓴다.
- Day 13~18은 TS로 로컬 게임을 먼저 완성하고, Day 19에서 Rust로 옮긴다.
- 유니티 `Update()`, 언리얼 데디케이티드 서버, C++ RAII와의 연결을 `:::info`로 넣는다.
- VS Build Tools 설치, Windows 방화벽 허용, WSL 2 오류를 "자주 막히는 곳"에 배정한다.

리뷰 게이트 후 커밋·푸시한다.

### Task 22 / 23 / 24 / 25 / 26: P3 Day 본문(병렬)
| Task | Day | 배치 |
|---|---|---|
| 22 | 1–9 | `p3-days-01-09` |
| 23 | 10–18 | `p3-days-10-18` |
| 24 | 19–27 | `p3-days-19-27` |
| 25 | 28–36 | `p3-days-28-36` |
| 26 | 37–45 | `p3-days-37-45` |

단계는 Task 9와 같다. 검증은 다음과 같다. Rust 스니펫은 스크래치 크레이트에서 `cargo run`/`cargo test`. 소유권 오류를 보여 주는 예제는 **실제 컴파일러 오류 원문**을 캡처해 싣는다. TS는 Vite로 확인한다.

### Task 27: P3 통합 리뷰
Task 12와 같다. 기술 리뷰어는 The Rust Book·Axum·Tokio 문서와 대조한다.

---

## Phase 4 — SP 이미지 도네이션 서비스

### Task 28: SP 레퍼런스(React + C# + SignalR + PostgreSQL)

**Files:**
- Create: `reference/sp-image-donation/`
  - `server/ImageDonation.Api/`(`Program.cs`, `Data/AppDbContext.cs`, `Entities/{Streamer,StreamerSettings,Donation,DonationEvent,ChzzkToken,BlockEntry}.cs`, `Endpoints/{PublicEndpoints,DashboardEndpoints,AuthEndpoints,ChzzkEndpoints,TestModeEndpoints}.cs`, `Hubs/{OverlayHub,DashboardHub}.cs`, `Services/{ImageProcessor,DonationService,DonationCodeMatcher,ChzzkApiClient,RetentionService}.cs`, `Services/Events/{IDonationEventSource,ChzzkSessionSource,FakeDonationSource}.cs`, `Services/Storage/{IImageStorage,LocalImageStorage}.cs`, `Migrations/`, `appsettings*.json`)
  - `server/ImageDonation.Tests/`
  - `client/`(Vite react-ts + React Router: 라우트 `/d/:slug`(후원), `/dashboard`(검수), `/settings`, `/onboarding`, `/login`. 별도 엔트리 `overlay.html`)
  - `Dockerfile`, `docker-compose.yml`(api + postgres + 이미지 볼륨), `.env.example`, `README.md`
- Test: `dotnet test`, `client` `npm test`(Vitest), `tests/reference/sp.e2e.test.mjs`

**Interfaces:**
- Produces:
  - 후원 상태: `Pending → Approved → Shown`, `Pending → Rejected`, (치즈 모드) `AwaitingCheese → Pending`(코드 매칭) 또는 `→ Expired`(30분)
  - 설정: `Mode: Free|Cheese`, `MinCheese:int`, `AutoApprove:bool`, `DisplaySeconds(3..30)`, `MinIntervalSeconds`, `MaxFileMb(≤10)`, `BannedWords:string[]`
  - 공개 API: `GET /api/public/streamers/{slug}`, `POST /api/public/streamers/{slug}/donations`(multipart: image, nickname ≤ 20, message ≤ 100) → `{id, status, code?}`(코드 형식 `#` + 영문 대문자·숫자 4자). IP 기준 Rate Limiting
  - 대시보드 API(스트리머 로그인)
    - `GET /api/dashboard/donations?status=`
    - `POST /api/dashboard/donations/{id}/approve|reject`
    - `POST /api/dashboard/overlay/clear`(긴급 정지)
    - `GET|PUT /api/dashboard/settings`
    - `POST /api/dashboard/overlay-token/rotate`
    - `POST /api/dashboard/test-donation`(테스트 모드: FakeDonationSource로 가짜 치즈 후원 이벤트 발행)
  - SignalR
    - `/hubs/overlay?token=<overlayToken>`: 서버→클라이언트 `ShowDonation(dto)`, `Clear()`
    - `/hubs/dashboard`(로그인): `DonationCreated(dto)`, `DonationUpdated(dto)`
  - 이미지
    - 저장 전에 매직 넘버를 검사한다(JPEG·PNG·WebP·GIF).
    - 라이브러리로 디코딩해 검증하고, 긴 변 최대 1280px로 리사이즈하고, 메타데이터(EXIF)를 제거하고, 재인코딩한다(Task 1 결정 라이브러리. 애니메이션 GIF 정책도 Task 1/개요에서 확정).
    - 파일명은 무작위 GUID다. `GET /media/{file}`로 제공한다.
    - 보관 기간은 7일이고 RetentionService가 삭제한다.
  - 치지직: Task 1에서 확인한 OAuth·세션 사양으로 구현한다. Secret은 user-secrets/환경 변수에만 둔다. 토큰은 Data Protection으로 암호화해 저장한다. 리프레시 토큰은 회전을 처리한다. 소켓 수신은 `IDonationEventSource` 뒤에 숨긴다(서버 직접 또는 브라우저 중계. Task 1 결정).
  - 인증: 개발용 로컬 로그인(Identity) + 치지직 로그인. 오버레이는 토큰만으로 접속한다(로그인 불필요).

- [ ] **Step 0: 환경 준비** — PostgreSQL(로컬 서비스 또는 Docker)과 `TEST_DATABASE_URL`
- [ ] **Step 1: 실패하는 테스트를 쓴다**
  - 단위
    - `MagicNumber_RejectsRenamedTextFile`
    - `ImageProcessor_StripsExif_AndResizes`(EXIF가 있는 테스트 JPEG를 코드로 생성)
    - `CodeMatcher_MatchesCodeInMessage_CaseInsensitive`
    - `CodeMatcher_IgnoresBelowMinCheese`
    - `CodeMatcher_IgnoresExpired`
    - `CodeMatcher_NoDoubleMatch`
    - `BannedWords_Rejects`
    - `ChzzkApiClient_RefreshRotatesToken`(stub HttpMessageHandler)
  - 통합(WebApplicationFactory + PostgreSQL)
    - `PublicDonation_FreeMode_CreatesPending`
    - `Approve_SendsShowDonation_ToOverlayGroup`(SignalR 테스트 클라이언트)
    - `OverlayHub_RejectsBadToken`
    - `TestDonation_MatchesAwaitingCheese`
    - `Upload_TooLarge_413`
    - `RateLimit_429`
    - `Retention_DeletesOldFiles`
  - 클라이언트(Vitest + Testing Library): `DonatePage_ShowsCodeInCheeseMode`, `Dashboard_ApproveButtonCallsApi`
- [ ] **Step 2: 실행해서 실패를 확인한다** → FAIL
- [ ] **Step 3: 서버를 구현하고** `dotnet test` → PASS
- [ ] **Step 4: 클라이언트를 구현하고** `npm ci && npx tsc -b && npm test && npm run build` → PASS
- [ ] **Step 5: e2e** — `sp.e2e.test.mjs`: 서버 실행 → 개발 로그인 → 치즈 모드 설정 → 후원 페이지에서 이미지 업로드 → 코드 표시 → 대시보드에서 테스트 후원(코드 포함) → 대기열에 나타남 → 승인 → `overlay.html?token=`에 이미지 표시 → 긴급 정지 → 사라짐 → 콘솔 오류 0
- [ ] **Step 6: Docker** — Task 20 Step 6과 같다.
- [ ] **Step 7: 치지직 실연동 미검증 사항을 README와 검증 기록에 명시한다**
- [ ] **Step 8: 커밋** — `feat(reference): SP image donation service (React + ASP.NET Core + SignalR + PostgreSQL)`

### Task 29: SP 상세 개요·커리큘럼·용어
Task 8과 같은 형식이다. 입력은 설계서 3.4·2.4·2.5와 Task 28. 추가 규칙은 다음과 같다.
- Day 1에 돈 흐름 원칙(운영자는 결제를 다루지 않음)을 명확히 쓴다.
- 치지직 Day(21~28)는 승인 전에도 진행할 수 있게 테스트 모드 경로를 기본으로 하고, 실연동은 선택 단계로 둔다.
- 법적 고려(Day 32)는 "법률 자문이 필요하다"는 점을 명시한다.

curriculum에 `requires:["p2"]`, `track:"special"`을 넣는다. 리뷰 게이트 후 커밋·푸시한다.

### Task 30 / 31 / 32 / 33: SP Day 본문(병렬)
| Task | Day | 배치 |
|---|---|---|
| 30 | 1–10 | `sp-days-01-10` |
| 31 | 11–20 | `sp-days-11-20` |
| 32 | 21–30 | `sp-days-21-30` |
| 33 | 31–40 | `sp-days-31-40` |

단계는 Task 9와 같다. 검증은 Task 15~18과 Task 22~26의 방법을 따른다(React는 Vite 스크래치 + Vitest).

### Task 34: SP 통합 리뷰
Task 12와 같다. 기술 리뷰어는 치지직 공식 문서(Task 1 URL)·Microsoft Learn·React 문서와 대조한다.

---

## Phase 5 — 마무리

### Task 35: 부록과 졸업 로드맵

**Files:**
- Create: `textbook/content/pages/{install,shortcuts,roadmap}.md`
- Modify: `textbook/content/curriculum.json`(pages에 install, shortcuts, roadmap(`requires:["p3"]`) 추가)

- [ ] **Step 1: 페이지를 쓴다**
  - `install.md`: 프로젝트별 설치 체크리스트(도구 · 공식 URL · 확인 명령 · 예상 출력)
  - `shortcuts.md`: Windows·VS Code·브라우저 개발자도구·PowerShell 단축키
  - `roadmap.md`: 설계서 3.5 전부. 유니티(C#) → 언리얼(C++) 순서와 이유, C++ 학습 경로, Rust 심화(Bevy), 리깅(Blender·Python), 방송 도구(OBS 플러그인·치지직 봇·Tauri), 웹 심화, 외주(세금 등은 전문가 확인 필요 명시), MCN 아이디어, **4차 프로젝트 후보 3~5개**(각각 목표·스택·선행 조건)
- [ ] **Step 2: 검증한다** — `npm run check && npm run build && npm run test:e2e` → PASS. 스모크 테스트가 roadmap을 포함하는지 확인한다.
- [ ] **Step 3: 커밋·푸시** — `docs: install checklist, shortcuts and graduation roadmap`

### Task 36: README와 HANDOFF

**Files:**
- Create: `README.md`, `HANDOFF.md`

- [ ] **Step 1: README를 쓴다.** 교재 여는 법(다운로드 → `index.html` 더블클릭), GitHub Pages 공개 방법(Task 1에서 확인한 메뉴 경로, 비공개 저장소 제약), 빌드·테스트 명령, 폴더 구조.
- [ ] **Step 2: HANDOFF를 쓴다**(설계서 8장 1~8 전부). 특히 다음을 넣는다.
  - **4차 프로젝트 추가 절차**를 명령 단위로 적는다: curriculum.json에 `p4` 추가(requires 결정) → `reference/p4-*` + 테스트 → `content/p4/_outline.md` → `glossary/p4.md` → Day 배치 작성 → `npm run check` → 리뷰 게이트 → build → e2e → 커밋
  - 검증 현황표(`docs/verification/*` 요약, 미검증 항목: Windows 화면 절차, 치지직 실연동, Docker를 쓸 수 없었다면 그 사실)
  - 외부 사실 재확인 시점(예: .NET·Node LTS 교체 주기, 치지직 API 변경)
  - 알려진 한계: 잠금은 동기 부여 장치일 뿐 보안이 아님(원본에 전체 본문이 들어 있음), 진도는 브라우저별로 저장됨
- [ ] **Step 3: 커밋·푸시** — `docs: README and HANDOFF for future sessions`

### Task 37: 최종 검증과 전체 리뷰

- [ ] **Step 1: 깨끗한 상태에서 전체를 다시 실행한다**
  - `cd textbook && rm -rf node_modules && npm ci && npm test && npm run check && npm run build && npm run test:e2e`
  - `node --test tests/reference/`
  - 각 레퍼런스의 네이티브 테스트(`dotnet test` ×2, `cargo test --workspace`, client 빌드)
  - 모두 PASS 출력을 기록한다.
- [ ] **Step 2: 결과물 확인** — `index.html` 크기 < 16MB, 외부 URL을 참조하는 `src=`/`href=` 0건(본문의 외부 문서 링크 `a[href^=http]`는 허용), Day 수 155
- [ ] **Step 3: 전체 브랜치 리뷰** — 가장 유능한 모델의 새 리뷰어가 설계서 대비 누락·불일치를 검토한다. 지적 사항을 반영한다.
- [ ] **Step 4: 최종 커밋·푸시와 보고** — 사용자에게 `index.html`을 전달하고, 검증 범위와 미검증 항목을 정직하게 보고한다.
