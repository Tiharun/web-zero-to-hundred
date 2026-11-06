# Task 14 Report — P2 상세 개요·메타·용어 사전

Status: **DONE_WITH_CONCERNS** (검증 통과, 우려 사항은 아래 "Concerns")
Git: none — NO GIT

## What I implemented

- `textbook/content/p2/_outline.md` (약 1,500줄): 머리말 0~6절 + Day 1~40 블록.
  - 0 읽는 법, 1 프로젝트 고정값(포트 5173/5250/5000, DB, user-secrets 키, 예시 계정·데이터, 마이그레이션 이름 순서, 버전, Git 습관, 연습 폴더 표), 2 P1 지식 표(P1 Day 링크), 3 Windows·초보자 함정 배정표, 4 레퍼런스 파일 지도(파일별 처음 Day / 바뀌는 Day / 레퍼런스와 같아지는 Day — 계산 결과), 5 작성자가 확인할 미확인 사항, 6 용어 배정 원칙(P1 사전 `[[…]]` 연결 목록 포함).
  - Day 블록은 Task 8 형식 그대로(목표 / 이미 배운 것 / 시작 상태 / 오늘 만들·바꿀 파일 / 끝 상태 확인 / 과제 → 정답 요지 / 용어(사전 담당) / 자주 막히는 곳 후보) + outline-rules 1의 `레퍼런스 대응` 줄.
  - "시작 상태"는 스크래치 생성 스크립트가 Day별 파일 변경(새로/바꿈/삭제)을 누적해 계산한 값이라 항상 앞 Day 끝 상태와 같아요. 폴더마다 `전체 폴더 경로: 파일, …`로 묶었고(머리말 0절에 표기법 설명), 설치 도구(+확인 명령)와 실행 중이어야 할 서버도 적었어요. 연습 폴더(프로젝트 밖)는 그 Day가 쓸 때만 보여 줘요.
  - 스크립트가 확인한 것: 레퍼런스 `reference/p2-streamer-hub/`의 학습자 파일 67개(빌드 산출물 `client/dist` 제외)가 모두 Day 40 끝 상태에 있음(마이그레이션은 `InitialCreate` + 학습자 Day별 마이그레이션으로 대응), 레퍼런스에 없는 파일이 끝 상태에 남지 않음(학습자 고유 `docs\screenshots\`와 생성물 제외), 용어 중복 0, 개요 용어 = 사전 항목(담당 Day 일치), P1 사전(170개)과 제목 겹침 0, minutes 60~120, 금지 단어 0.
- `textbook/content/p2/_meta.json`: `{ project: { id "p2", order 2, track "main", requires ["p1"], folder "C:\dev\streamer-hub", stack, summary, outcome, days[40] }, pages: [] }`. Day 제목은 설계서 3.2 그대로, minutes 합계 4,265분(75~120). curriculum.json은 건드리지 않았어요(R32).
- `textbook/content/glossary/p2.md`: 211개 항목, `## Day N · 제목` 묶음 아래 `### 용어` / `- 처음 등장: [P2 Day N](#/day/p2-dNN)` / 2~4문장 정의. `[[…]]` 링크와 `**`는 쓰지 않았어요.

### 주요 설계 결정 (작성자가 알아야 할 것)
- 연습 폴더: `C:\dev\ts-practice`(Day 3~6, Day 7에 타입 복사), `C:\dev\cs-practice`(`HubConsole`, Day 9~15), `C:\dev\http-practice`(16), `C:\dev\sql-practice`(19, 34), `C:\dev\security-practice`(34), `C:\dev\streamer-hub-publish`·`-data`·`-backup`(38~40). 프로젝트 폴더 `C:\dev\streamer-hub`는 Day 1(README 초안)·Day 2(`git init`, GitHub push)부터.
- 클라이언트는 Day 7 생성(create-vite 9.3.3 `vanilla-ts` 템플릿을 `npm pack`으로 직접 열어 파일 목록·tsconfig·package.json을 레퍼런스와 비교: 템플릿 + `"strict": true` = 레퍼런스, 삭제할 템플릿 파일 `src/counter.ts`, `src/assets/`, `public/icons.svg`). Day 8은 임시 `public/data/*.json`(Day 27에 삭제)로 타입 있는 fetch를 연습해요.
- 서버는 Day 17 생성(`dotnet new sln/web`을 스크래치에서 실행해 확인: web 템플릿은 무작위 포트 + https 프로필 + `.http` 없음 → Day 17에서 5250·http만으로 고치고 `.http`를 직접 만듦). Day 18 메모리 CRUD → Day 20 EF Core(엔드포인트는 그대로) → Day 21 DB CRUD + SeedData → Day 22 관계 + 순환 참조 → 응답 DTO → Day 23 엔드포인트 파일·MapGroup·요청 DTO·AddValidation·ScheduleQuery(첫 서비스 계층; 레퍼런스 주석의 "서비스 (Day 23)"는 DI 수명 개념 설명 + Day 30 `AddScoped<PostService>` 예고로 처리).
- 레퍼런스와 다른 중간 단계(모두 블록에 어느 Day에 맞춰지는지 적음): README 초안(1→40), `public/data`(8→27 삭제), Day 24의 `app.Logger` 한 줄(Day 26에 삭제), `MapGet("/")`(17→38 삭제), `[Url]`(23→34 `[HttpUrl]`), `createAvatar`·`streamerDetail`의 주소 검사(28→34), CSS 블록 배분(7·8·28·29·31·32).
- task-14-notes 반영: `/api/me` 204와 이유(Day 26, 31), Day 27 CORS 실험·설명(코드 미보존), Day 34 HTTPS·CSRF 실험·설명, Day 39 `UseForwardedHeaders`를 `UseRateLimiter` 앞에(+`KnownIPNetworks`, `KnownNetworks` 사용 중단) — 끝 상태에는 넣지 않는 선택 코드로, `HttpUrlAttribute` 문법(override·is 패턴·out var)은 Day 11·13에서 미리 가르치고 Day 34에서 복습, 관리자 시드의 `CheckPasswordAsync` 승격과 선가입 위험(Day 26 + 과제), `UtcDateTimeConverter`·`Intl.DateTimeFormat`·P1 로컬 시간 비교(Day 29), register → login → PUT /api/me 및 닉네임 재시도(Day 31), 서버 DisplayName trim 안 함(Day 26, 31 명시), Windows 함정 배정(실행 정책 Day 3, dev-certs Day 17·34, 포트 충돌 Day 7·17·38, 방화벽 Day 7·17, user-secrets 위치 Day 26, SQLite 파일 위치 Day 20·22·38·39, CRLF Day 2·37), Mvc.Testing·xunit runner·Prettier 미기재 알림(Day 35~37 블록과 5절).
- 과제 정답도 끝 상태에 들어가므로(CONTENT-GUIDE d), 레퍼런스에 없는 코드를 남길 과제는 "해 보고 되돌리기"로 설계했어요.

## Tests and results (verification)

TDD는 해당 없음(콘텐츠 작업). outline-rules 6 검증:

1. 스크래치 `cp -r textbook/content <scratch>/content` → p2 `_meta.json`만 curriculum.json에 합침 → `node textbook/build.mjs --check --allow-missing --content <scratch>/content`
   - 결과: `오류 162개` — 전부 다른 에이전트의 `glossary/p3.md`가 아직 합쳐지지 않은 `#/day/p3-…`로 거는 `E_LINK_UNKNOWN`(grep으로 확인, p2 관련 오류 0, `E_TERM_DUPLICATE` 0).
   - 같은 스크래치에서 `glossary/p3.md`를 빼고 실행 → `검사 통과: Day 70개, 페이지 2개, 결과 크기 0.52 MB`(경고는 Day 파일 없음 `E_CUR_FILE_MISSING`뿐).
2. 컨트롤러 지시(R37 후속)대로 현재 디스크의 `glossary/p1.md`(170개)를 포함하고, 더 나아가 p1·p2·p3의 `_meta.json`을 모두 합친 스크래치 → `검사 통과: Day 115개, 페이지 4개, 결과 크기 0.72 MB`. 즉 p1·p2·p3 사전 사이 제목 중복 없음.
3. 생성 스크립트 자체 검사: `NO PROBLEMS`(위 "What I implemented"의 항목들).
4. 저장소에 병합 파일을 쓰지 않았어요. 전체 테스트는 돌리지 않았어요(지시대로).

## Files changed (commit exactly these)
```
textbook/content/p2/_outline.md
textbook/content/p2/_meta.json
textbook/content/glossary/p2.md
.superpowers/sdd/2026-11-01-web-zero-to-hundred/task-14-report.md
```
(`git status`의 `glossary/p3.md`, `content/p3/`는 다른 에이전트 것이에요.)

## Glossary terms → owning Day (211)

| Day | 용어 |
| :-- | :-- |
| 1 | 프론트엔드, 백엔드, 풀스택, 클라이언트, 데이터베이스, API, 요청, 응답 |
| 2 | Windows Terminal, 프롬프트, 현재 위치, 탭 완성 |
| 3 | Node.js, npm, 패키지, 의존성, package.json, node_modules, package-lock.json, npx, LTS, 환경 변수, PATH, 실행 정책 |
| 4 | TypeScript, 정적 타입, 타입 표기, 타입 추론, 컴파일, tsc, tsconfig.json, strict 모드 |
| 5 | 인터페이스, 타입 별칭, 유니온 타입, 리터럴 타입, 선택적 프로퍼티, 타입 좁히기, null 병합 연산자, 옵셔널 체이닝 |
| 6 | 함수 타입, 제네릭, 타입 매개변수, 모듈 |
| 7 | Vite, 개발 서버, localhost, 포트, HMR, 빌드, 타입 단언, innerHTML |
| 8 | Promise, 구조 분해 할당, 전개 구문, unknown |
| 9 | .NET, C#, SDK, 런타임, dotnet CLI, 프로젝트 파일, 최상위 문장 |
| 10 | 문자열 보간, switch 식, 열거형 |
| 11 | 컬렉션, List, Dictionary, nullable, out 매개변수 |
| 12 | C# 클래스, 인스턴스, 프로퍼티, 생성자, 접근 제한자, static, record, 네임스페이스 |
| 13 | 상속, virtual, override, 다형성, 패턴 매칭 |
| 14 | 람다 식, LINQ, 식 본문 멤버 |
| 15 | 예외, 스택 추적, Task, using 선언 |
| 16 | HTTP, HTTPS, HTTP 메서드, 상태 코드, HTTP 헤더, HTTP 본문, Content-Type, REST, 엔드포인트, .http 파일 |
| 17 | ASP.NET Core, Minimal API, 라우트, 솔루션, launchSettings.json, dotnet watch, 직렬화 |
| 18 | CRUD, 라우트 매개변수, 라우트 제약, TypedResults, 모델 바인딩 |
| 19 | SQL, SQLite, 테이블, 행, 열, 기본 키, 쿼리 |
| 20 | ORM, EF Core, NuGet, 엔티티, DbContext, DbSet, 연결 문자열, 마이그레이션, dotnet-ef |
| 21 | 시드 데이터, IQueryable, 변경 추적 |
| 22 | 1:N 관계, 외래 키, 탐색 속성, Include, 계단식 삭제, 순환 참조, DTO |
| 23 | 특성, 검증, 확장 메서드, MapGroup, 의존성 주입, 서비스 수명, 서비스 계층 |
| 24 | 미들웨어, ProblemDetails, 구성, appsettings.json, 실행 환경, 로그 수준, ILogger |
| 25 | 인증, 인가, 해싱, 쿠키, ASP.NET Core Identity |
| 26 | 역할, 권한 정책, 클레임, user-secrets |
| 27 | 출처, CORS, 프록시 |
| 28 | SPA, 해시 라우터 |
| 29 | UTC, 시간대, ISO 8601, Intl.DateTimeFormat, 값 변환기, Map |
| 30 | 페이지네이션, 프로젝션 |
| 31 | 관찰자 패턴 |
| 32 | 역할 기반 접근 제어 |
| 33 | 폴링, SSE, EventSource, lock, yield return |
| 34 | XSS, CSRF, SameSite, HttpOnly, SQL 인젝션, 요청 제한, 개발 인증서 |
| 35 | 자동 테스트, 단위 테스트, xUnit, Assert, AAA 패턴, Theory |
| 36 | 통합 테스트, WebApplicationFactory |
| 37 | 코드 포매터, Prettier, dotnet format, 풀 리퀘스트, 머지 |
| 38 | 정적 파일, wwwroot, 폴백 라우트, dotnet publish |
| 39 | 리버스 프록시, X-Forwarded-For, 백업, WAL |
| 40 | 포트폴리오 |

R37 후속 반영: 처음 계획한 214개 중 P1 사전에 이미 있는 `터미널`·`PowerShell`(P1 Day 7)·`브랜치`(P1 Day 7)는 빼고 `[[터미널]]`·`[[PowerShell]]`·`[[브랜치]]`로 연결하도록 개요(Day 2·37 "이미 배운 것", 6절)에 적었어요. P1 `클래스`(Day 9, CSS 클래스)와 겹치지 않게 C#/TS 클래스 용어는 `C# 클래스`로 바꿨어요. P2가 맡은 `포트`·`localhost`(Day 7)·`출처`(27)·`상태 코드`(16)·`Promise`(8)는 컨트롤러 메시지와 일치해요.

## P1-level concepts P2 assumes (spec 3.1 기준 Day)

| 개념 | P1 Day |
| :-- | :-- |
| 파일·폴더·확장자·경로·`C:\dev`, 브라우저·서버·URL | 1 |
| VS Code(폴더 열기·확장 설치)·Live Preview·Chrome | 2 |
| HTML 태그·요소·속성·구조 | 3 |
| 절대/상대 경로, `./`·`../` | 4, 5 |
| 시맨틱 구조, 개발자 도구, `aria-current` | 6 |
| Git·GitHub·저장소·커밋·푸시, 터미널·PowerShell 맛보기, `main` 브랜치 | 7 |
| 표·폼 | 8 |
| CSS·선택자·클래스 | 9 |
| Flexbox / Grid | 11 / 12 |
| CSS 변수·hover, GitHub Pages 배포 | 14 |
| `let`/`const`·자료형(`null`)·연산자·Console | 15 |
| `if`/`===`·템플릿 리터럴 | 16 |
| 반복문·배열 | 17 |
| 함수·화살표 함수·스코프, `createElementWithText` 도우미 | 18 |
| 객체·`map`/`filter`/`forEach`·메서드 | 19 |
| DOM `querySelector`/`textContent`/`classList`/`createElement` | 20 |
| `addEventListener`·이벤트 위임 | 21 |
| `prefers-color-scheme`·`localStorage` | 22 |
| `input`/`change` 이벤트·필터 | 23 |
| 폼 검증·`preventDefault`·`role="status"`/`aria-live` | 24 |
| JSON·`fetch`·`async`/`await`·`try`/`catch`·`response.ok`/`status`·`file://` 제약 | 25 |
| `Date`·`setInterval`·컴퓨터 시계 기준 카운트다운 | 26 |
| `URLSearchParams`·URL 파라미터·OBS 브라우저 소스·투명 오버레이 | 27 |
| 접근성·파비콘 | 28 |
| 디버깅·README·Markdown | 29 |
| 최종 점검·회고 | 30 |

P1 레퍼런스를 확인한 결과 P1은 `innerHTML`·`setTimeout`·구조 분해·전개 구문·JS 클래스·JS `Map`·`encodeURIComponent`를 쓰지 않아서, P2가 처음 가르치도록 배정했어요(Day 7, 8, 27, 29).

## Could not verify (작성자에게 넘김 — 개요 5절에도 있음)
- sqlite3 CLI 설치 방법(winget ID 등)은 external-facts에 없음 → Day 19 작성자가 확인·추가.
- `Microsoft.AspNetCore.Mvc.Testing` 10.0.14, `xunit.runner.visualstudio` 3.1.4, `coverlet.collector` 6.0.4, Prettier 버전은 external-facts 미기재(Day 35~37).
- Windows CRLF에서 Prettier(`--end-of-line auto` 필요 여부)·`dotnet format` 동작(Day 37).
- TS 7.0.2 `tsc --init` 결과의 정확한 수정 줄, `nodenext`의 `.js` import(Day 4·6).
- Windows 화면 문구(방화벽 창, dev-certs 확인 창, 설치 마법사), 개요 안의 "작성자 원문 확인" 오류 문장들(포트 충돌, dotnet watch 재시작 질문, CORS·프록시 오류, `AddScoped` 누락 등) — 개요는 실행으로 얻은 원문이 아님.
- 콘솔 한글 표시(Day 9, 19), Chrome 시간대 변경 메뉴(Day 29), Day 34 CSRF 실험의 정확한 결과(401/404/415), 쿠키 인증의 `Forbid()` 결과(Day 30).
- 개요의 `dotnet test` 개수 8(Day 35)·23(Day 36)은 레퍼런스 README 표 기준(T13 보고 23개 통과)이고, Day 35 시점 8개는 계산값.

## Self-review
- 시작 상태 = 앞 Day 끝 상태: 스크립트로 계산해 수작업 불일치 없음.
- 선행 지식 순서: 각 블록 "이미 배운 것"에 Day 링크를 달고, 처음 쓰는 문법(innerHTML Day 7, setTimeout·구조 분해 Day 8, `[MaxLength]` 맛보기 Day 20 → 특성 정식 Day 23, DI 맛보기 Day 21 → 정식 Day 23, TS 클래스 Day 27)은 그 Day 목표에 넣었어요. 리뷰 게이트에서 다시 봐 주세요.
- 고친 것: 처음 생성에서 Day 38 과제가 만드는 `C:\dev\streamer-hub-data`를 Day 39에 처음 만드는 것으로 적었던 불일치, Day 36 "앞 8개만" 문구(끝 상태와 모순) 수정.

## Concerns
1. 개요가 큼(약 19만 자, 시작 상태 목록이 Day마다 누적). 작성자 편의를 위해 의도한 것이지만 컨트롤러가 압축을 원하면 말해 주세요.
2. 위 미확인 사항 중 sqlite3 설치 경로와 Prettier/CRLF는 Day 작성 전에 정해져야 Day 19·37이 막히지 않아요.
3. `glossary/p3.md`(다른 에이전트)는 p3 `_meta.json`을 합치기 전에는 `E_LINK_UNKNOWN` 162개를 내요 — 합치면 통과(검증 2).
4. 생성 스크립트(`days.py`/`gen.py`)는 스크래치에만 있어요(저장소에 넣지 않음). 개요를 크게 고칠 때 다시 쓰려면 말해 주세요: /tmp/claude-0/-home-user-web-zero-to-hundred/a3ed5e68-2ed7-58a6-8548-3d657f4039ce/scratchpad/task14/

---

## Fix round 1

Status: **DONE**. No git was used. I touched only `textbook/content/p2/_outline.md` and `textbook/content/p2/_meta.json`, plus this report. `glossary/p2.md` needed no change because `개발 인증서` stays owned by Day 34 (see 10). `_meta.json` was regenerated but its content is unchanged.

The outline is still generated from the scratch scripts `/tmp/claude-0/-home-user-web-zero-to-hundred/a3ed5e68-2ed7-58a6-8548-3d657f4039ce/scratchpad/task14/days.py` and `gen.py`. The fixes are applied by `fix1.py` in the same folder. Backups of the pre-fix scripts are `days.before-fix1.py` and `gen.before-fix1.py`. I checked P1 Day numbers against the current `textbook/content/p1/_outline.md`.

Line numbers below refer to `textbook/content/p2/_outline.md` after the fix.

### Changes

| # | Finding | Change (file:line) |
| :-- | :-- | :-- |
| 1 | Day 26 task 1 could not be reproduced | `_outline.md:949`. The steps now follow the reference test `AdminSeed_DoesNotPromote_…`: ① server off, delete `streamerhub.db*` ② `dotnet user-secrets remove "Admin:Password"` ③ start the server → "설정이 없어서 관리자 계정을 만들지 않았어요" warning ④ fan registers as `admin@example.com` with a different password ⑤ restore the secret with `set` and restart → "비밀번호가 설정과 달라서 관리자로 올리지 않았어요", `/api/me` roles `[]` ⑥ delete the DB again and restart to restore. I also added why the old steps fail (the seed runs at startup, so the fan's register gets `DuplicateUserName`). |
| 2a | `change` event was credited to P1 | Day 29 목표 `:1034` now introduces the **`change` event** and compares it with P1 Day 23's `input`. The Day 29 이미 배운 것 now credits `select`/`option` to P1 Day 8 and `input` events to P1 Day 23. Section 2 table row 23 `:84` now says change is not taught in P1 and points to P2 Day 29. Section 2 note `:93`. |
| 2b | `minlength` was credited to P1, and `maxlength` was taught nowhere | Day 31 목표 `:1118` introduces **`minlength`·`maxlength`**, including their use in `register.ts`, `postForm.ts` and Days 32–33 `admin.ts`. It also introduces `disabled`, `confirm()`, `Math.ceil`/`Math.max`, `Number.isInteger` and the `in` operator, none of which P1 teaches. The Day 31 이미 배운 것 now credits only `required`·`pattern` to P1 Day 24 and `trim` to P1 Day 23. Section 2 row 24 `:85`. |
| 2c | `createElementWithText` pointed to P1 Day 18 | Now P1 Day 20: Day 8 이미 배운 것 `:389`, section 2 row 20 `:81`. Row 18 no longer mentions the helper. |
| 2d | `aria-current` pointed to P1 Day 6 | Now P1 Day 11, together with the attribute selector: Day 28 `:997`, section 2 row 11 `:73`. Row 6 no longer mentions it. |
| 3 | Day 36 said 16 integration tests | Changed to 15 in three places, `:1334` (×2) and `:1358`. The text now reads "`[Fact]` 15개 … 단위 8 + 통합 15 = 23". |
| 4 | Day 13 task 1 answer used an expression body | `:533`. The answer is now a block body: `public override string Describe() { return $"{Name}님은 채팅 관리자예요."; }`. |
| 5 | Day 5 used `slice` and JS `switch` before teaching them | Day 5 목표 `:307` introduces the string method `slice(시작, 끝)`, which task 3 and Day 28 `createAvatar` use. Task 2 `:321` now uses `if`/`else if` only, with a note that JS `switch` is not used and switch comes in C# Day 10. |
| 6 | Day 24 Production run listened on the wrong port | Day 24 목표 `:845` now uses `dotnet run --no-launch-profile --urls http://localhost:5250` and explains why (the default would be 5000). I also added a pitfall at `:874`. |
| 7 | Names used without introduction | Day 33 `:1202`: the "읽기만 하고 나중에 이해해요" box now names `await foreach` and `CancellationToken`. Day 36 `:1334`: `HttpClient`, `PostAsJsonAsync`, `GetFromJsonAsync`, `ReadFromJsonAsync`, `HttpStatusCode`, `response.Headers`/`Content.Headers`. |
| 8 | Section 0 claimed the reference annotations match the outline | Section 0 `:11` now says "다르면 이 개요를 따라요" and lists 11 known differences without editing the reference: ScheduleQuery (Day 29 vs 23), PostService / Program "서비스 (Day 23)" / README `AddScoped` (vs 30, 33), README 9–15 PostService·NoticeBroadcaster·lock (vs 30, 33), README vite.config (7 vs 27), README ApiError (8 vs 27), README createElementWithText (4–6 vs 8), HttpUrlAttribute (23·34 vs 34), StreamerDtos "DTO (Day 23)" (vs 22), SeedData MigrateAsync (20 vs 21), Streamer.cs (20 vs 18), ScheduleEndpoints (22·29 vs 22, 23, 29). |
| 9 | CSS split between Days was vague | Each Day now has explicit line ranges of the reference `client/src/style.css`, inserted in reference order. Together they cover lines 1–428 exactly once, so by Day 32 the file equals the reference.<br>Day 7 `:354`: 1–127, 135–161, 178–183, 304–315 (`.auth-menu` excluded).<br>Day 8 `:388`: 184–213, 262–303.<br>Day 28 `:996`: 214–227, 245–255 (`input, select, textarea`), 316–333.<br>Day 29 `:1064`: 361–410.<br>Day 31 `:1150`: 128–134 `.auth-menu`, 162–167, 173–177, 228–244 `.form`/`.form.narrow`/`.form label`, 256–261 `.hint`, 334–360 `.page-head`/`.post-list .post-title`/`.post-body`/`.pagination`.<br>Day 32 `:1190`: 168–172, 411–428. |
| 10 | `개발 인증서` appeared on Day 17 but is owned by Day 34 | Day 17 pitfall `:643` now describes `dotnet dev-certs https --trust` in one line, without bold, a glossary link or a definition. The term stays owned by Day 34, so the glossary, the Day 34 block and the section 3 trap table stay in sync. |
| 11 | `Date` was attributed only to P1 Day 26 | Section 2 row 16 `:77` now lists `Date` 맛보기 (`new Date()`·`getHours`), and row 26 says "`Date` 깊게". |

Related extra changes, since the same first-use problem appeared elsewhere when I rechecked against the P1 outline:
- Day 27 `:958` introduces `Object.keys`, `Object.values` and `flat()`.
- Day 28 `:996` introduces `startsWith`, `replaceChildren` and `scrollTo`.
- Day 33 `:1202` introduces `.then()`/`.catch()`.
- Day 1 now credits the Network panel to P1 Day 25 (`:222`).
- Section 2 rows 8, 25 and 26 are more precise: `select`, `throw new Error`, `Math.floor`·`padStart`·`split`.

### Commands and output

```text
$ python3 gen.py textbook/content/p2/_outline.md textbook/content/p2/_meta.json
outline 196102 chars, 1518 lines; terms 211
NO PROBLEMS
```

This self-check confirms:
- Every Day's start state equals the previous Day's end state.
- All 67 reference files are present by Day 40.
- There are no duplicate terms.
- The outline terms match the glossary.
- No term overlaps the current `glossary/p1.md`.
- Minutes are in range and there are no forbidden words.

Scratch merge: I copied `textbook/content` and merged every on-disk `_meta.json` (p1, p2, p3, sp) into a scratch `curriculum.json`. The scratch copy also includes all four on-disk glossaries (p1, p2, p3, sp).

```text
merged: p1:30:req=[] p2:40:req=["p1"] p3:45:req=["p2"] sp:40:req=["p2"]
$ node textbook/build.mjs --check --allow-missing --content <scratch>/content
검사 통과: Day 155개, 페이지 4개, 결과 크기 0.83 MB
E_TERM_DUPLICATE count: 0
```

The only warnings are the expected `E_CUR_FILE_MISSING` for Day files that don't exist yet.
