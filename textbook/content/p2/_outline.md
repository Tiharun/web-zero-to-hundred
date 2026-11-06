# P2 스트리머 허브 — 상세 개요

작성 기준일 2026-11. P2(`p2`, 40 Day, 해금 조건 `p1`)의 Day 작성자가 **이 개요와 레퍼런스(`reference/p2-streamer-hub/`), `docs/CONTENT-GUIDE.md`, 견본 `textbook/content/p1/day-01.md`만 보고** 서로의 결과물을 읽지 않고 이어지는 Day를 쓸 수 있게 만든 계약서예요. 빌드는 `_`로 시작하는 이 파일을 무시해요. Day 제목·분량·요약·키워드는 `textbook/content/p2/_meta.json`(관리자가 `curriculum.json`에 합침), 용어 정의는 `textbook/content/glossary/p2.md`에 있어요.

## 0. 읽는 법

- Day 블록 형식은 모든 개요가 같아요: `## Day N — 제목 (분)` 아래 **목표 / 이미 배운 것 / 시작 상태 / 오늘 만들·바꿀 파일 / 끝 상태 확인 / 과제 → 정답 요지 / 용어(사전 담당) / 자주 막히는 곳 후보 / 레퍼런스 대응**.
- **시작 상태**는 앞 Day의 끝 상태와 똑같아요(생성 스크립트로 계산). 폴더마다 한 줄로 `전체 폴더 경로: 파일, 파일`처럼 묶었어요. Day 본문의 `:::path 📂 시작 상태`에는 이것을 파일마다 전체 경로로 풀어 써요. `node_modules\`·`bin\`·`obj\`·`dist\`·`wwwroot\`·`*.db`처럼 도구가 만드는 것은 "건드리지 않는 생성물"로 짧게 언급만 해요. 연습 폴더(프로젝트 밖)는 그 Day가 쓸 때만 보여 줘요.
- **오늘 만들·바꿀 파일**: `새로` = 새 파일, `바꿈` = 고침, `삭제` = 지움. 괄호 안은 대응하는 레퍼런스 파일이에요.
- **레퍼런스 대응**의 "끝"은 그 Day가 끝나면 파일이 레퍼런스와 (글 내용·예시 값 말고는) 같아진다는 뜻이고, "중간 단계"는 뒤 Day가 더 고친다는 뜻이에요(어느 Day인지 적었어요).
- 레퍼런스 코드 주석의 `(Day N)` 표시와 레퍼런스 README의 "Day ↔ 코드 지도"는 대부분 이 개요와 같지만 **다른 곳이 있어요. 다르면 이 개요를 따라요**(레퍼런스는 고치지 않아요). 알려진 차이:
  - `Services/ScheduleQuery.cs` 주석 `(Day 29)` → 개요는 Day 23에 만들고 Day 29에 UTC 검사와 함께 다시 써요.
  - `Services/PostService.cs` 주석 `(Day 23, 30)`, `Program.cs` 주석 "우리가 만든 서비스 (Day 23)", README 23행 `AddScoped<PostService>()` → 개요는 Day 23에 서비스 계층·수명 개념만, `PostService`와 `AddScoped`는 Day 30, `AddSingleton<NoticeBroadcaster>`는 Day 33.
  - README 9~15행의 `PostService`(생성자·async Task·enum)·`NoticeBroadcaster`(List·lock) → Day 9~15는 같은 문법을 연습 폴더에서 배우는 Day이고, 두 파일은 Day 30·33에 만들어요(`lock`은 Day 33에서 처음 가르쳐요).
  - README 7행 `vite.config.ts` → 개요는 Day 27(프록시)·Day 38(빌드 입력).
  - README 8행 `api.ts`의 `ApiError` → 개요는 Day 8에 `getJson<T>`만, `ApiError` 클래스는 Day 27.
  - README 4~6행 `ui.ts`의 `createElementWithText` → 개요는 Day 8(4~6일은 연습 폴더).
  - `Dtos/HttpUrlAttribute.cs` 주석 `(Day 23, 34)` → 개요는 Day 34에만 만들어요(Day 23은 기본 `[Url]`).
  - `Dtos/StreamerDtos.cs` 주석 "DTO (Day 23)" → 응답 DTO는 Day 22, 요청 DTO·검증은 Day 23.
  - `Data/SeedData.cs`의 MigrateAsync 주석 `(Day 20)` → 개요는 Day 20에 `dotnet ef database update`, Day 21에 `SeedData`와 `MigrateAsync`.
  - `Entities/Streamer.cs` 주석 `(Day 20)` → 클래스는 Day 18에 메모리 저장용으로 만들고 Day 20에 엔티티(`[MaxLength]`)가 돼요.
  - `Endpoints/ScheduleEndpoints.cs` 주석 `(Day 22, 29)` → Day 22에는 `Program.cs` 안에 GET만, 파일은 Day 23, UTC 검사는 Day 29.
- **과제 정답도 끝 상태에 들어가요**(CONTENT-GUIDE 규칙 d). 그래서 레퍼런스에 없는 코드를 남기는 과제는 "해 보고 되돌리기"로 설계했어요.
- "작성자 원문 확인"이라고 적은 오류 문장은 이 개요가 실제 실행으로 얻은 것이 아니에요. Day 작성자가 실행해서 원문을 확정해요(CONTENT-GUIDE 규칙 e).

## 1. 프로젝트 고정값

| 항목 | 값 |
| :-- | :-- |
| 작업 폴더 | `C:\dev\streamer-hub\` = `client\`(Day 7~) + `server\`(Day 17~) + `README.md`(Day 1~) + `.gitignore`(Day 17~) |
| 클라이언트 | Vite `vanilla-ts`, 개발 서버 `http://localhost:5173`, 실행 `cd C:\dev\streamer-hub\client` → `npm run dev` |
| 서버 | `server\StreamerHub.Api`, `http://localhost:5250`(launchSettings의 http 프로필 하나), 실행 `cd C:\dev\streamer-hub\server\StreamerHub.Api` → `dotnet watch` |
| 터미널 두 개 | Day 27부터 터미널 1 = 서버, 터미널 2 = 클라이언트. 개발 중 화면은 항상 5173으로 열고 `/api`는 Vite 프록시가 5250으로 넘겨요 |
| 배포 모드 | Day 38~: `dotnet publish -c Release -o C:\dev\streamer-hub-publish` → `dotnet StreamerHub.Api.dll --urls http://localhost:5000` |
| DB | SQLite `streamerhub.db`(연결 문자열 `Data Source=streamerhub.db` → 실행한 폴더 기준). Day 39부터 고정 위치 `C:\dev\streamer-hub-data\streamerhub.db` |
| 비밀 값 | 개발: `dotnet user-secrets`의 `Admin:Email`·`Admin:Password`(Day 26). 배포: 환경 변수 `Admin__Email`·`Admin__Password`(Day 38). 코드·appsettings·커밋에 쓰지 않아요 |
| 예시 계정 | 관리자 `admin@example.com`, 팬 `fan1@example.com`·`fan2@example.com`(비밀번호는 학습자가 정함: 6자 이상, 영어 대문자·소문자·숫자·기호 각 1개 이상) |
| 예시 데이터 | 스트리머 달빛곰(chzzk)·픽셀토끼(youtube)·노을고양이(soop), 주소는 `https://example.com/…`(레퍼런스 `SeedData`) |
| 마이그레이션 | Day 20 `InitialCreate` → Day 22 `AddSchedules` → Day 25 `AddIdentity` → Day 30 `AddPosts` → Day 33 `AddNotices`. 파일 이름 앞의 시각은 사람마다 달라요. 레퍼런스는 최종 모습 하나(`InitialCreate`)만 있어요(레퍼런스 README) |
| 버전 | `docs/research/external-facts.md` 0.3 고정표만 인용: Node LTS v26.13.0(지원 22.22.2+ / 24.15+ / 26+), .NET SDK 10.0.403, EF Core·Identity·dotnet-ef 10.0.14, TypeScript 7.0.2, Vite 8.3.5 |
| Git 습관 | Day 2에 저장소를 만들고, 프로젝트 파일이 바뀌는 Day는 끝에 `git add -A` → `git commit -m "dayNN: 요약"` → `git push`를 체크리스트에 둬요. 연습 폴더는 Git 밖이에요 |

연습·바깥 폴더(모두 `C:\dev` 아래, 프로젝트 밖):

| 폴더 | 쓰는 Day | 용도 |
| :-- | :-- | :-- |
| `C:\dev\terminal-practice` | 2 | 터미널 연습(그날 지움) |
| `C:\dev\ts-practice` | 3~6 (7에 타입 복사) | npm·TypeScript 연습 |
| `C:\dev\cs-practice` | 9~15 | C# 콘솔 연습 `HubConsole` |
| `C:\dev\http-practice` | 16 | `.http` 연습 |
| `C:\dev\sql-practice` | 19 (20에 sqlite3 도구 재사용, 34에 SQL 인젝션 예) | SQL 연습 DB |
| `C:\dev\security-practice` | 34 | XSS·CSRF 실험 파일 |
| `C:\dev\streamer-hub-publish` | 38~40 | `dotnet publish` 결과 |
| `C:\dev\streamer-hub-data` | 38(과제)~40 | 고정 위치 운영 DB |
| `C:\dev\streamer-hub-backup` | 39~40 | DB 백업 사본 |
| `%APPDATA%\Microsoft\UserSecrets` | 26~ | user-secrets(`secrets.json`) |

## 2. P1에서 가져오는 지식

P2 Day 1은 빈 폴더에서 시작하고 P1 전체를 알고 있다고 가정해요. 설계서 3.1 기준으로 아래 Day에서 배웠다고 보고, 본문에서는 링크로 복습시켜요(예: `[P1 Day 25](#/day/p1-d25)`). 용어 사전에 P1 항목이 있으면 `[[용어]]`로, 없으면 이 링크로 연결해요.

| P1 Day | P2가 기대는 내용 | 주로 쓰는 P2 Day |
| :-- | :-- | :-- |
| [P1 Day 1](#/day/p1-d01) | 파일·폴더·확장자·경로, `C:\dev` 규칙, 브라우저·서버·URL | 1, 2 |
| [P1 Day 2](#/day/p1-d02) | VS Code(폴더 열기·저장·확장 설치), Live Preview, Chrome | 1, 9, 16, 34 |
| [P1 Day 3](#/day/p1-d03) | HTML 태그·요소·속성, 문서 구조 | 7 |
| [P1 Day 4](#/day/p1-d04) | 절대 경로·상대 경로 | 2 |
| [P1 Day 5](#/day/p1-d05) | `./`·`../` | 2 |
| [P1 Day 6](#/day/p1-d06) | 시맨틱 구조, 개발자 도구 Elements | 1, 7 |
| [P1 Day 7](#/day/p1-d07) | Git 설치·사용자 설정·GitHub 저장소·커밋·푸시(줄바꿈 설정 기본값) | 2, 37 |
| [P1 Day 8](#/day/p1-d08) | 표(행·열), 폼·`label`·`select`/`option`·`textarea` | 19, 29, 31 |
| [P1 Day 9](#/day/p1-d09) | CSS 연결·선택자 | 7 |
| [P1 Day 11](#/day/p1-d11) | Flexbox, `aria-current`·속성 선택자 | 7, 28 |
| [P1 Day 12](#/day/p1-d12) | Grid 카드 | 8 |
| [P1 Day 14](#/day/p1-d14) | CSS 변수·hover, GitHub Pages 배포 | 7, 16, 39 |
| [P1 Day 15](#/day/p1-d15) | `let`/`const`·자료형(`null` 포함)·연산자·Console | 3, 4, 5 |
| [P1 Day 16](#/day/p1-d16) | `if`/`===`·템플릿 리터럴, `Date` 맛보기(`new Date()`·`getHours`) | 4, 5, 10, 29 |
| [P1 Day 17](#/day/p1-d17) | 반복문·배열 | 4, 10, 11 |
| [P1 Day 18](#/day/p1-d18) | 함수·화살표 함수·스코프 | 4, 6, 11, 14 |
| [P1 Day 19](#/day/p1-d19) | 객체, `map`/`filter`/`forEach` | 5, 6, 12, 14 |
| [P1 Day 20](#/day/p1-d20) | DOM: `querySelector`·`textContent`·`classList`·`createElement`, `createElementWithText` 도우미 | 7, 8, 34 |
| [P1 Day 21](#/day/p1-d21) | `addEventListener`, 이벤트 위임 | 28 |
| [P1 Day 22](#/day/p1-d22) | `prefers-color-scheme`, `localStorage` | 7 |
| [P1 Day 23](#/day/p1-d23) | `input` 이벤트, `trim`·`toLowerCase`·`includes`, `hidden`, 필터(`change` 이벤트는 가르치지 않음 → P2 Day 29) | 21, 28, 29, 31 |
| [P1 Day 24](#/day/p1-d24) | 폼 검증(`required`·`pattern`), `preventDefault`, `role="status"`·`aria-live`, `focus` (`minlength`·`maxlength`는 가르치지 않음 → P2 Day 31) | 8, 28, 31 |
| [P1 Day 25](#/day/p1-d25) | JSON, `fetch`, `async`/`await`, `try`/`catch`·`throw new Error`, `response.ok`·`response.status`, `file://` 제약, 개발자 도구 Network 패널 | 1, 8, 15, 16 |
| [P1 Day 26](#/day/p1-d26) | `Date` 깊게(`getDay`·`setHours`·밀리초), `setInterval`, `Math.floor`·`padStart`·`split`, 컴퓨터 시계 기준 카운트다운 | 8, 29, 33 |
| [P1 Day 27](#/day/p1-d27) | `URLSearchParams`·`location.search`(URL 파라미터), OBS 브라우저 소스, 투명 배경 오버레이 | 18, 27, 28, 33 |
| [P1 Day 28](#/day/p1-d28) | 접근성, 파비콘 | 7 |
| [P1 Day 29](#/day/p1-d29) | 디버깅, README.md·마크다운 | 1, 40 |
| [P1 Day 30](#/day/p1-d30) | 최종 점검·회고 | 40 |

P1 개요(현재 `textbook/content/p1/_outline.md`)를 기준으로, P1이 가르치지 않아서 P2가 그 Day 목표에서 처음 정의하는 것: 문자열 `slice`(Day 5), `innerHTML`(Day 7), `setTimeout`·구조 분해 할당·전개 구문(Day 8), JS 클래스 문법·`instanceof`·`encodeURIComponent`(Day 27, C# Day 12~13과 비교), `startsWith`·`decodeURIComponent`·`replaceChildren`(Day 28), `change` 이벤트·`getTime`·`toISOString`·`Date.UTC`·`getUTC…`·`Number.isNaN`·JS `Map`(Day 29), `minlength`·`maxlength`·`disabled`·`confirm()`·`Math.ceil`·`Math.max`·`Number.isInteger`·`in` 연산자(Day 31), `.then()`/`.catch()` 이어 쓰기(Day 33). JS `switch`는 쓰지 않아요(C# `switch`는 Day 10).

## 3. Windows·초보자 함정 배정표

| 함정 | 처음 안내하는 Day | 다시 나오는 Day |
| :-- | :-- | :-- |
| 공백·한글·OneDrive 경로, 바탕 화면에 만든 폴더 | 1 | 2 |
| Windows PowerShell 5.1 문법(`&&` 금지, `curl` 별칭, `$env:`, `Remove-Item`) | 2 | 16, 24, 38 |
| CRLF 경고(`LF will be replaced by CRLF`), Prettier와 CRLF | 2 | 37 |
| **PowerShell 실행 정책**(`npm.ps1` … `UnauthorizedAccess` → `RemoteSigned -Scope CurrentUser`) | 3 | 7(npm create), 37(npx) |
| 설치 후 명령 인식 안 됨(PATH → 새 터미널) | 3 | 9, 19, 20 |
| 사용자 계정 컨트롤(관리자 권한) 창 | 3 | 9 |
| 백신 검사로 느려짐(끄지 않기) | 3 | 9, 35 |
| **포트 충돌**(5173 → 5174 자동, 5250 `address already in use`, 5000) | 7 | 17, 38 |
| **방화벽 허용 창**(node.exe, dotnet.exe — 끄지 않기) | 7 | 17 |
| dev 서버가 터미널을 차지함 → 터미널 하나 더 | 7 | 17, 27 |
| **HTTPS 개발 인증서**(`dotnet dev-certs https --trust`, 브라우저 경고) | 17 | 34 |
| 콘솔 한글 표시(인코딩 — 미확인) | 9 | 19 |
| dotnet watch 실행 중 파일 잠금(마이그레이션·DB 삭제·테스트) | 20 | 22, 35 |
| **SQLite 파일 위치**(실행 위치 기준 상대 경로) | 20 | 22, 38, 39 |
| **user-secrets 위치**(`%APPDATA%\Microsoft\UserSecrets`), PowerShell 큰따옴표 안 `$` | 26 | 38 |
| 비밀 값 커밋 방지(`.http`의 비밀번호 칸, `git grep`) | 26 | 34, 40 |

## 4. 레퍼런스 파일 지도

`C:\dev\streamer-hub` 안의 파일이 처음 생기는 Day와 마지막으로 바뀌는 Day예요(생성 스크립트로 계산). 마지막 Day가 끝나면 그 파일은 레퍼런스와 같아요. 생성물·학습자 고유 파일은 뺐어요.

| 파일(`C:\dev\streamer-hub\` 기준) | 처음 | 바뀌는 Day | 마지막 |
| :-- | :-- | :-- | :-- |
| `README.md` | 1 | 2, 3, 16, 37, 38, 39 | 40 |
| `client\.gitignore` | 7 | — | 7 |
| `client\package.json` | 7 | — | 7 |
| `client\package-lock.json` | 7 | — | 7 |
| `client\tsconfig.json` | 7 | — | 7 |
| `client\index.html` | 7 | 31 | 32 |
| `client\public\favicon.svg` | 7 | — | 7 |
| `client\src\main.ts` | 7 | 8, 27, 28, 29, 31 | 32 |
| `client\src\style.css` | 7 | 8, 28, 29, 31 | 32 |
| `client\src\types.ts` | 7 | 27, 31, 32 | 33 |
| `client\src\api.ts` | 8 | 27, 29, 31, 32 | 33 |
| `client\src\ui.ts` | 8 | 27, 28, 29, 32 | 34 |
| `.gitignore` | 17 | 20 | 38 |
| `server\StreamerHub.slnx` | 17 | — | 35 |
| `server\StreamerHub.Api\StreamerHub.Api.csproj` | 17 | 20, 25 | 26 |
| `server\StreamerHub.Api\Program.cs` | 17 | 18, 20, 21, 22, 23, 24, 25, 26, 30, 33, 34 | 38 |
| `server\StreamerHub.Api\Properties\launchSettings.json` | 17 | — | 17 |
| `server\StreamerHub.Api\appsettings.json` | 17 | 20, 24 | 34 |
| `server\StreamerHub.Api\appsettings.Development.json` | 17 | — | 21 |
| `server\StreamerHub.Api\StreamerHub.Api.http` | 17 | 18, 21, 22, 23, 24, 25, 26, 29, 30, 33 | 34 |
| `server\StreamerHub.Api\Entities\Streamer.cs` | 18 | 20 | 22 |
| `server\StreamerHub.Api\Data\AppDbContext.cs` | 20 | 22, 25, 29, 30 | 33 |
| `server\StreamerHub.Api\Migrations\<시각>_InitialCreate.cs` | 20 | — | 20 |
| `server\StreamerHub.Api\Migrations\<시각>_InitialCreate.Designer.cs` | 20 | — | 20 |
| `server\StreamerHub.Api\Migrations\AppDbContextModelSnapshot.cs` | 20 | 22, 25, 30 | 33 |
| `server\StreamerHub.Api\Data\SeedData.cs` | 21 | 22 | 26 |
| `server\StreamerHub.Api\Entities\Schedule.cs` | 22 | — | 22 |
| `server\StreamerHub.Api\Migrations\<시각>_AddSchedules.cs` | 22 | — | 22 |
| `server\StreamerHub.Api\Migrations\<시각>_AddSchedules.Designer.cs` | 22 | — | 22 |
| `server\StreamerHub.Api\Dtos\ScheduleDtos.cs` | 22 | — | 23 |
| `server\StreamerHub.Api\Dtos\StreamerDtos.cs` | 22 | 23 | 34 |
| `server\StreamerHub.Api\Endpoints\StreamerEndpoints.cs` | 23 | 26 | 34 |
| `server\StreamerHub.Api\Endpoints\ScheduleEndpoints.cs` | 23 | 26, 29 | 34 |
| `server\StreamerHub.Api\Services\ScheduleQuery.cs` | 23 | — | 23 |
| `server\StreamerHub.Api\Entities\AppUser.cs` | 25 | — | 25 |
| `server\StreamerHub.Api\Endpoints\AuthEndpoints.cs` | 25 | 26 | 34 |
| `server\StreamerHub.Api\Migrations\<시각>_AddIdentity.cs` | 25 | — | 25 |
| `server\StreamerHub.Api\Migrations\<시각>_AddIdentity.Designer.cs` | 25 | — | 25 |
| `server\StreamerHub.Api\Dtos\AuthDtos.cs` | 26 | — | 26 |
| `client\vite.config.ts` | 27 | — | 38 |
| `client\src\router.ts` | 28 | — | 28 |
| `client\src\pages\home.ts` | 28 | 29 | 31 |
| `client\src\pages\streamers.ts` | 28 | — | 28 |
| `client\src\pages\streamerDetail.ts` | 28 | 29 | 34 |
| `client\src\pages\schedule.ts` | 29 | — | 29 |
| `server\StreamerHub.Api\Entities\Post.cs` | 30 | — | 30 |
| `server\StreamerHub.Api\Migrations\<시각>_AddPosts.cs` | 30 | — | 30 |
| `server\StreamerHub.Api\Migrations\<시각>_AddPosts.Designer.cs` | 30 | — | 30 |
| `server\StreamerHub.Api\Dtos\PostDtos.cs` | 30 | — | 30 |
| `server\StreamerHub.Api\Dtos\PagedResult.cs` | 30 | — | 30 |
| `server\StreamerHub.Api\Services\PostService.cs` | 30 | — | 30 |
| `server\StreamerHub.Api\Endpoints\PostEndpoints.cs` | 30 | — | 34 |
| `client\src\auth.ts` | 31 | — | 32 |
| `client\src\pages\board.ts` | 31 | — | 31 |
| `client\src\pages\postDetail.ts` | 31 | — | 31 |
| `client\src\pages\postForm.ts` | 31 | — | 31 |
| `client\src\pages\login.ts` | 31 | — | 31 |
| `client\src\pages\register.ts` | 31 | — | 31 |
| `client\src\pages\admin.ts` | 32 | — | 33 |
| `server\StreamerHub.Api\Entities\Notice.cs` | 33 | — | 33 |
| `server\StreamerHub.Api\Migrations\<시각>_AddNotices.cs` | 33 | — | 33 |
| `server\StreamerHub.Api\Migrations\<시각>_AddNotices.Designer.cs` | 33 | — | 33 |
| `server\StreamerHub.Api\Dtos\NoticeDtos.cs` | 33 | — | 33 |
| `server\StreamerHub.Api\Endpoints\NoticeEndpoints.cs` | 33 | — | 34 |
| `server\StreamerHub.Api\Services\NoticeBroadcaster.cs` | 33 | — | 33 |
| `client\overlay.html` | 33 | — | 33 |
| `client\src\overlay.ts` | 33 | — | 33 |
| `server\StreamerHub.Api\Dtos\HttpUrlAttribute.cs` | 34 | — | 34 |
| `server\StreamerHub.Tests\StreamerHub.Tests.csproj` | 35 | — | 36 |
| `server\StreamerHub.Tests\TestDb.cs` | 35 | — | 35 |
| `server\StreamerHub.Tests\PostServiceTests.cs` | 35 | — | 35 |
| `server\StreamerHub.Tests\ScheduleQueryTests.cs` | 35 | — | 35 |
| `server\StreamerHub.Tests\StreamerValidationTests.cs` | 35 | — | 35 |
| `server\StreamerHub.Tests\TestApp.cs` | 36 | — | 36 |
| `server\StreamerHub.Tests\ApiTests.cs` | 36 | — | 36 |

## 5. 작성자가 확인할 미확인 사항

- **sqlite3 설치 방법**(Day 19): external-facts에 없어요. winget ID(후보 `SQLite.SQLite`, 미확인) 또는 sqlite.org 배포 파일 + PATH를 확인해 external-facts에 추가한 뒤 인용해요. Day 20·21·22·25·34가 같은 도구를 써요.
- **`Microsoft.AspNetCore.Mvc.Testing` 10.0.14**(Day 36), xUnit 템플릿의 `xunit.runner.visualstudio` 3.1.4·`coverlet.collector` 6.0.4(Day 35)는 external-facts에 없어요(레퍼런스 T13 보고: NuGet에 존재 확인). Day 35·36 작성자가 external-facts에 추가해요.
- **Prettier 버전**(Day 37): 고정값이 없어요. 작성자가 `npm view prettier version`으로 고정해 external-facts에 추가하고, 옵션은 `--single-quote --print-width 120`(레퍼런스가 변경 없이 통과). Windows CRLF 때문에 `--end-of-line auto`가 필요한지 확인해요.
- `dotnet format`이 Windows CRLF 파일에서 바꾸는 것이 있는지(Day 37) — Linux에서만 확인됨.
- TS 7.0.2 `tsc --init` 결과에서 고칠 줄(`rootDir`·`outDir`·`types`, 생성물 옵션)과 `nodenext`의 `.js` 확장자 import(Day 4·6) — 연습 폴더에서 실제로 확인해요.
- Windows 화면 문구: 방화벽 창, `dotnet dev-certs https --trust` 확인 창, Node/.NET 설치 마법사, 한국어 PowerShell 오류 문장 — "버전에 따라 다를 수 있어요"를 붙여요.
- 콘솔에서 한글이 깨지는지(Day 9 C# 출력, Day 19 sqlite3) — 미확인.
- Chrome 개발자 도구에서 시간대를 바꾸는 메뉴 위치(Day 29).
- CSRF 실험(Day 34)의 정확한 결과(다른 출처 폼 POST가 401·404·415 중 무엇이 되는지) — 작성자가 실행해 확정해요. 레퍼런스 README: JSON이 아닌 POST는 Day 38 이후 `/api/{**rest}` 때문에 404, 그 전에는 415일 수 있어요.
- 레퍼런스 README의 Windows 명령(user-secrets, `Copy-Item`, `$env:`)은 Linux에서 같은 흐름으로만 확인됐어요(T13 보고).

## 6. 용어 배정 원칙

- 각 용어는 이 책 전체에서 정확히 한 Day가 맡아요. P2 사전(`glossary/p2.md`)에는 **P2에서 처음 가르치는 용어만** 있어요. P1 사전(`glossary/p1.md`, 170개)에 있는 용어는 다시 정의하지 않고 제목 그대로 `[[용어]]`로 연결해요. 특히 P1이 맡은 `[[터미널]]`·`[[PowerShell]]`(P1 Day 7, P2 Day 2에서 제대로 배움), `[[브랜치]]`(P1 Day 7, P2 Day 37에서 나누기·합치기), `[[클래스]]`(P1 Day 9의 CSS 클래스 — C#·TS의 클래스는 P2의 `[[C# 클래스]]`), `[[비동기]]`·`[[async 함수]]`·`[[await]]`·`[[fetch]]`·`[[JSON]]`·`[[try...catch]]`(P1 Day 25), `[[메서드]]`·`[[콜백 함수]]`·`[[키]]`(P1 Day 19), `[[null]]`(P1 Day 15), `[[URL 파라미터]]`·`[[URLSearchParams]]`(P1 Day 27), `[[배포]]`(P1 Day 14), `[[개발자 도구]]`(P1 Day 6), `[[README]]`·`[[Markdown]]`(P1 Day 29)이 그래요. 사전 제목이 없는 P1 개념은 2절의 P1 Day 링크로 연결해요.
- 용어 이름은 P1 사전과 겹치지 않게 골랐어요(예: HTML 속성과 헷갈리지 않게 C#은 `프로퍼티`, CSS 클래스와 구별해 `C# 클래스`, `<header>`와 헷갈리지 않게 `HTTP 헤더`). 생성 스크립트가 P1 사전 제목과 겹치지 않는지 검사했어요. TypeScript와 C#에 같은 이름이 있는 개념(인터페이스, 제네릭, null 병합 연산자)은 처음 나오는 TS Day가 맡고, C# Day는 그 항목에 링크한 뒤 다른 점을 설명해요.
- 본문에서는 담당 Day에서 처음 한 번 `**[[용어]]**(원어)` + 한 줄 정의, 다른 Day에서는 `[[용어]]` 링크만 써요(CONTENT-GUIDE 4장). 개요에 없는 용어가 필요하면 `glossary/<batch>-extra.md`에 추가하고 보고해요.

---

## Day 1 — 풀스택 큰 그림 (75분)

- 목표: 스트리머 허브가 "브라우저 화면(클라이언트) ↔ C# 서버 ↔ SQLite DB" 세 부분으로 움직인다는 큰 그림을 `text` 그림으로 설명한다. P1 사이트(배포 주소 또는 Live Preview)를 열고 개발자 도구 **Network** 탭에서 `index.html`·`style.css`·`data/videos.json` 요청의 메서드·상태 코드·응답 본문을 본다(요청/응답 체험). 완성본 미리보기는 그림 대신 화면별 `text` 와이어프레임(홈, 스트리머 목록·상세, 주간 방송 일정, 팬 게시판, 로그인·가입, 관리자, OBS 공지 오버레이)과 "주소 → 화면" 표로 보여 준다(레퍼런스 README의 폴더 구조·API 표를 쉬운 말로). 40일 지도(TS 4~8 → C# 9~15 → 서버 16~26 → 화면 27~33 → 품질·배포 34~40)를 보여 주고, `C:\dev\streamer-hub` 폴더를 파일 탐색기로 만들어 VS Code로 열고 `README.md` 초안을 쓴다. 설치는 하지 않는다(터미널은 Day 2).
- 이미 배운 것: 파일·폴더·확장자·`C:\dev` 규칙 [P1 Day 1](#/day/p1-d01); VS Code 폴더 열기·저장·Live Preview [P1 Day 2](#/day/p1-d02); HTML 문서 구조 [P1 Day 3](#/day/p1-d03); 개발자 도구 Elements [P1 Day 6](#/day/p1-d06); GitHub Pages 배포 주소 [P1 Day 14](#/day/p1-d14); JSON·`fetch`·`file://` 제약·개발자 도구 Network 패널 [P1 Day 25](#/day/p1-d25); OBS 브라우저 소스·오버레이 [P1 Day 27](#/day/p1-d27); README.md·마크다운 [P1 Day 29](#/day/p1-d29)
- 시작 상태: 새 프로젝트예요. `C:\dev\streamer-hub`는 아직 없어요.
  - P1 결과물 `C:\dev\my-creator-site\`(과 GitHub Pages 주소)이 있으면 좋아요. 없어도 오늘 따라 할 수 있게 Live Preview 경로를 둬요.
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1)
  - 실행 중이어야 할 것: 없음
- 오늘 만들/바꿀 파일:
  - 새로 `C:\dev\streamer-hub\README.md` — 제목 `# 스트리머 허브`, 한 줄 소개, 만들 화면 7개 목록, 기술 스택 표(TypeScript·Vite / C#·ASP.NET Core / SQLite·EF Core / Identity / xUnit), "앞으로 채울 것" 목록 (레퍼런스 `README.md` 첫 문단·기술 목록)
- 끝 상태 확인: VS Code 탐색기에 `STREAMER-HUB` 폴더와 `README.md`, 미리보기(`Ctrl + Shift + V`)에 제목·목록이 보인다. 개발자 도구 Network 탭에서 `videos.json` 줄의 Status `200`, Type `fetch`, Response 탭에 JSON 글자가 보인다.
- 과제:
  1) Network 탭에서 요청 3개(HTML·CSS·JSON)의 이름·메서드·상태 코드·종류를 README에 표로 적기 (쉬움) → `index.html`/`GET`/`200`/`document`, `style.css`/`GET`/`200`/`stylesheet`, `videos.json`/`GET`/`200`/`fetch`(Live Preview면 주소가 `127.0.0.1`)
  2) 화면 7개를 "프론트엔드가 그리는 것 / 백엔드에 물어볼 것"으로 나누기 (보통) → 예: 스트리머 목록 = 카드 그리기는 프론트, 목록 데이터는 백엔드 `GET /api/streamers`; 로그인 여부는 백엔드만 안다; 공지 오버레이는 서버가 새 공지를 알려 줘야 함
  3) 없는 주소(`.../nope.html`)를 열고 Network 탭의 상태 코드 확인 (쉬움) → `404`, 서버가 "없다"고 응답한 것
- 용어(사전 담당): 프론트엔드, 백엔드, 풀스택, 클라이언트, 데이터베이스, API, 요청, 응답
- 자주 막히는 곳 후보: Network 탭이 비어 있음 → 탭을 연 뒤 `F5`로 새로 고침 / P1 사이트를 더블클릭(`file://`)으로 열어 `videos.json` 요청이 실패 → Live Preview로 열기(P1 Day 25 규칙) / P1 배포 주소를 잊음 → GitHub 저장소 Settings → Pages / `C:\dev`가 아니라 바탕 화면·OneDrive·한글 경로에 폴더를 만듦 → 주소 표시줄로 경로 확인 / README를 메모장으로 만들어 `README.md.txt`가 됨 → 확장자 표시(P1 Day 1) 확인
- 레퍼런스 대응: 중간 단계 — 레퍼런스와 다름: `README.md`는 초안이에요(Day 16 API 표, Day 37 테스트·코드 품질, Day 38 빌드, Day 39 백업, Day 40 완성). 최종 모습은 레퍼런스 `README.md`.

## Day 2 — 터미널 기초 (90분)

- 목표: 시작 메뉴에서 **터미널**(Windows Terminal)을 열고 PowerShell 프롬프트 `PS C:\Users\…>`를 읽는다. `$PSVersionTable.PSVersion`으로 5.1인지 확인하고, 이 교재 명령은 5.1 기준(`&&` 금지)임을 알린다. `Get-Location`, `cd C:\dev`, `cd ..`, `dir`(= `Get-ChildItem`, `ls`), `mkdir`, `cls`, `Tab` 완성, `↑` 기록, `Ctrl + C`를 연습 폴더 `C:\dev\terminal-practice`에서 해 본 뒤 지운다(`Remove-Item -Recurse -Force`, `:::warn`). 전체 경로와 상대 경로, 공백 있는 경로의 따옴표를 다룬다. VS Code 통합 터미널(`Ctrl + ` `)이 PowerShell인지 확인하고 `code .`으로 폴더 열기. 마지막으로 `C:\dev\streamer-hub`에서 `git init` → `git add README.md` → `git commit -m "day02: 프로젝트 시작"` → GitHub에서 새 저장소 `streamer-hub` 만들기(README 추가하지 않기, 공개 여부는 Day 40에 다시 정해도 됨) → `git remote add origin …` → `git branch -M main` → `git push -u origin main`(P1 Day 7 복습). 이후 모든 Day는 끝에 커밋·푸시하는 습관을 체크리스트에 둔다.
- 이미 배운 것: 터미널·PowerShell 맛보기(P1 사전 `[[터미널]]`·`[[PowerShell]]`, 오늘 제대로 배움) [P1 Day 7](#/day/p1-d07); 절대 경로·상대 경로 [P1 Day 4](#/day/p1-d04); `./`·`../` [P1 Day 5](#/day/p1-d05); Git 설치·사용자 설정·커밋·푸시·GitHub 저장소 [P1 Day 7](#/day/p1-d07); README.md [Day 1](#/day/p2-d01); Windows Terminal이 없으면 Windows PowerShell을 연다는 것까지는 오늘 안내
- 시작 상태: [Day 1](#/day/p2-d01)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1)
  - 실행 중이어야 할 것: 없음
- 오늘 만들/바꿀 파일:
  - 바꿈 `C:\dev\streamer-hub\README.md` — "개발 환경" 절 추가: Windows 버전, PowerShell 버전(`$PSVersionTable.PSVersion` 결과) (레퍼런스 `README.md` "준비물과 버전 확인" 절의 시작)
  - 새로 `C:\dev\streamer-hub\.git\` — `git init`이 만든 숨김 폴더(건드리지 않기) (레퍼런스에는 없음(학습자 저장소))
- 끝 상태 확인: 터미널에 `PS C:\dev\streamer-hub>`가 보이고 `git log --oneline`에 커밋 1개, GitHub 저장소 페이지에 README 내용이 보인다. `C:\dev\terminal-practice`는 지워져 있다.
- 과제:
  1) `C:\dev\terminal-practice\a\b\c`를 명령 한 줄에 하나씩 만들고 `cd`로 오간 뒤 지우기 (쉬움) → `mkdir C:\dev\terminal-practice`, `cd C:\dev\terminal-practice`, `mkdir a`, `cd a`, … , `cd C:\dev`, `Remove-Item -Recurse -Force C:\dev\terminal-practice`
  2) `C:\dev\streamer-hub`에서 상대 경로만으로 `C:\dev\my-creator-site`로 이동 (보통) → `cd ..\my-creator-site`
  3) README의 개발 환경 절을 고치고 두 번째 커밋·푸시 (쉬움) → `git add README.md`, `git commit -m "day02: 개발 환경 기록"`, `git push`
- 용어(사전 담당): Windows Terminal, 프롬프트, 현재 위치, 탭 완성
- 자주 막히는 곳 후보: 통합 터미널이 cmd·Git Bash로 열림 → 터미널 패널 오른쪽 `∨`에서 PowerShell 선택, 기본 프로필 설정 / `&&`를 쓰면 5.1에서 `The token '&&' is not a valid statement separator in this version.` → 한 줄에 하나씩 (작성자가 원문 확인) / 공백·한글 경로는 따옴표 필요, `₩` 키 = `\` / `git add` 때 `warning: in the working copy of 'README.md', LF will be replaced by CRLF the next time Git touches it` → 무시해도 되는 안내(CONTENT-GUIDE 3.3) / `git push` 때 GitHub 로그인 창(Git Credential Manager) → 브라우저로 로그인 / `fatal: not a git repository` → 현재 위치 확인 / `error: remote origin already exists.` → `git remote -v`로 확인 후 `git remote set-url origin …` / 터미널 창을 닫으면 위치가 처음으로 돌아감 → 다시 `cd`
- 레퍼런스 대응: 중간 단계 — 레퍼런스와 다름: 저장소에는 아직 README만 있어요. `.git`은 레퍼런스에 없는 학습자 저장소 폴더예요.

## Day 3 — Node.js와 npm (100분)

- 목표: Node.js가 "브라우저 밖에서 JS를 실행하는 프로그램"이고 npm이 패키지 관리자라는 것을 안다. nodejs.org의 **LTS** 설치 프로그램(작성 기준 v26.13.0) 또는 `winget install OpenJS.NodeJS.LTS`로 설치한다. MSI의 "Tools for Native Modules" 체크는 **해제**한다(external-facts 1절). 설치 후 **새 터미널**에서 `node --version`, `npm --version`을 실행한다. `npm.ps1 … running scripts is disabled on this system` 오류가 나면 `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`로 해결하고 `Get-ExecutionPolicy -Scope CurrentUser`로 확인한다(관리자 권한 불필요, `Unrestricted`·`Bypass` 금지, `npm.cmd`는 "추정" 보조). PATH·환경 변수 개념(왜 새 터미널이 필요한가). 연습 폴더 `C:\dev\ts-practice`에서 `npm init -y` → `npm pkg set type=module` → `hello.js`(`console.log(`Node ${process.version}`)`)를 `node hello.js`로 실행 → `npm i -D typescript@7.0.2` → `package.json`의 `devDependencies`, `package-lock.json`, `node_modules` 확인 → `npx tsc --version` → `node_modules`를 지우고 `npm ci`로 되살리기(`npm install`과 차이).
- 이미 배운 것: JS 변수·`console.log`·템플릿 리터럴 [P1 Day 15](#/day/p1-d15)·[P1 Day 16](#/day/p1-d16); JSON 형식 [P1 Day 25](#/day/p1-d25); 터미널·경로·`mkdir`·`cd` [Day 2](#/day/p2-d02)
- 시작 상태: [Day 2](#/day/p2-d02)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1)
  - 실행 중이어야 할 것: 없음
- 오늘 만들/바꿀 파일:
  - 새로 `C:\dev\ts-practice\package.json` — `npm init -y` + `"type": "module"` + `devDependencies.typescript` `^7.0.2` (레퍼런스 `client/package.json`과 같은 구조)
  - 새로 `C:\dev\ts-practice\package-lock.json` — `npm i`가 만든 잠금 파일 (레퍼런스 `client/package-lock.json`)
  - 새로 `C:\dev\ts-practice\node_modules\` — 설치 결과(직접 고치지 않음) (레퍼런스 `client/.gitignore`의 `node_modules`)
  - 새로 `C:\dev\ts-practice\hello.js` — Node 버전을 출력하는 한 줄 (없음(연습))
  - 바꿈 `C:\dev\streamer-hub\README.md` — 개발 환경 절에 `node --version`·`npm --version` 결과 추가 (레퍼런스 `README.md` "준비물과 버전 확인" 표)
- 끝 상태 확인: `node hello.js` → `Node v26.13.0`(숫자는 달라도 됨), `npx tsc --version` → `Version 7.0.2`, `dir C:\dev\ts-practice\node_modules`에 `typescript` 폴더가 보인다.
- 과제:
  1) `package.json`의 `scripts`에 `"hello": "node hello.js"`를 넣고 `npm run hello` (쉬움) → `npm pkg set scripts.hello="node hello.js"` 또는 직접 편집, 출력에 `> hello` 줄과 Node 버전
  2) `node_modules`를 지우고 `npm ci`로 되살린 뒤 `npx tsc --version` (보통) → `Remove-Item -Recurse -Force C:\dev\ts-practice\node_modules`, `npm ci`, `Version 7.0.2`. `package-lock.json`이 있어서 같은 버전이 다시 설치됨
  3) README 개발 환경 절에 버전 기록 후 커밋·푸시 (쉬움) → `git add README.md`, `git commit -m "day03: Node 버전 기록"`, `git push`
- 용어(사전 담당): Node.js, npm, 패키지, 의존성, package.json, node_modules, package-lock.json, npx, LTS, 환경 변수, PATH, 실행 정책
- 자주 막히는 곳 후보: **PowerShell 실행 정책 오류**: `npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system.` / `UnauthorizedAccess` (한국어: "이 시스템에서 스크립트를 실행할 수 없으므로 …") → `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`, 바꾸기 싫으면 `npm.cmd`(추정 표기). `Unrestricted`·`Bypass` 금지 / 설치 직후 `node : The term 'node' is not recognized as the name of a cmdlet, …` → 터미널·VS Code를 모두 닫고 다시 열기(PATH) / "Tools for Native Modules"를 체크해서 Chocolatey 창이 뜸 → 창을 닫아도 Node는 설치됨 / 설치 중 사용자 계정 컨트롤(관리자 권한) 창 → 설치 프로그램이 맞으면 "예" / `npm ERR! code ENOENT … package.json` → 현재 위치가 `C:\dev\ts-practice`인지 확인 / 백신 검사 때문에 `npm i`가 느림 → 기다리기(백신 끄지 않기) / winget이 없다는 오류 → nodejs.org 설치 프로그램으로
- 레퍼런스 대응: 연습 폴더(레퍼런스 없음). 개념 대응: 레퍼런스 `client/package.json`(`devDependencies`, `scripts`), `client/package-lock.json`, README의 `npm ci`.

## Day 4 — TypeScript 시작 (100분)

- 목표: JS에서 실행해야 보이던 실수를 TS는 **실행 전에** 알려 준다는 것을 P1 코드의 흔한 실수(문자열+숫자, 오타 속성)로 보여 준다. `C:\dev\ts-practice`에서 `npm i -D @types/node` → `npx tsc --init` → `tsconfig.json`에서 `"rootDir": "./src"`, `"outDir": "./dist"`, `"types": ["node"]`로 고친다(작성자는 TS 7.0.2의 `--init` 결과를 실제로 확인해 고칠 줄을 정확히 적는다. `declaration`·`sourceMap` 같은 생성물 옵션을 끌지 여부도 결정). `src\hello.ts`에 `string`·`number`·`boolean`·배열 `string[]`, 타입 표기 vs 추론, 함수 매개변수·반환 타입, `any`를 피하는 이유를 쓴다. `npx tsc` → `dist\hello.js` → `node dist\hello.js`. 일부러 오류를 넣어 `src/hello.ts(3,7): error TS2322: Type 'string' is not assignable to type 'number'.` 형식(파일·줄·칸·코드·메시지)을 읽고 고친다. VS Code의 빨간 밑줄·마우스 올리기. `npx tsc --ignoreConfig src\hello.ts --outDir out`로 TS→JS 변환 결과를 한 번 비교해 "타입은 지워지고 JS만 남는다"를 확인하고 `out` 폴더를 지운다(TS5112 함정과 함께). `strict: true`의 뜻.
- 이미 배운 것: 자료형·`let`/`const`·연산자 [P1 Day 15](#/day/p1-d15); 템플릿 리터럴 [P1 Day 16](#/day/p1-d16); 배열 [P1 Day 17](#/day/p1-d17); 함수·매개변수·`return` [P1 Day 18](#/day/p1-d18); npm·npx·`package.json` [Day 3](#/day/p2-d03); 터미널 [Day 2](#/day/p2-d02)
- 시작 상태: [Day 3](#/day/p2-d03)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`
  - `C:\dev\ts-practice\`: `package.json`, `package-lock.json`, `node_modules\`, `hello.js`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0)
  - 실행 중이어야 할 것: 없음
- 오늘 만들/바꿀 파일:
  - 바꿈 `C:\dev\ts-practice\package.json` — `devDependencies`에 `@types/node` 추가 (없음(연습))
  - 바꿈 `C:\dev\ts-practice\package-lock.json` — 설치로 바뀜 (없음(연습))
  - 새로 `C:\dev\ts-practice\tsconfig.json` — `tsc --init` 결과 + `rootDir`·`outDir`·`types` 수정 (레퍼런스 `client/tsconfig.json`의 `"strict": true`)
  - 새로 `C:\dev\ts-practice\src\hello.ts` — 기본 타입·추론·함수 타입 연습(방송 제목·시청자 수·라이브 여부) (없음(연습))
  - 새로 `C:\dev\ts-practice\dist\` — `npx tsc`가 만든 `hello.js` 등(직접 고치지 않음) (없음(연습))
- 끝 상태 확인: `npx tsc`가 아무것도 출력하지 않고 끝나며(성공), `node dist\hello.js`가 문장을 출력한다. 일부러 넣은 오류에서 `error TS2322`가 보이고, 고치면 사라진다.
- 과제:
  1) 변수 5개 중 3개는 타입 표기, 2개는 추론으로 쓰고 VS Code에서 마우스를 올려 추론된 타입 확인 (쉬움) → `let viewers: number = 0;` … `const title = '저녁 방송';`(추론: `string`)
  2) 오류 3개(TS2322 대입, TS2345 인수, TS2339 없는 속성)가 든 코드 고치기 (보통) → 각 오류 원문과 고친 줄
  3) `function formatViewers(count: number): string` 작성 (쉬움) → `return `${count}명`;`
- 용어(사전 담당): TypeScript, 정적 타입, 타입 표기, 타입 추론, 컴파일, tsc, tsconfig.json, strict 모드
- 자주 막히는 곳 후보: `error TS5112: tsconfig.json is present but will not be loaded if files are specified on commandline. Use '--ignoreConfig' to skip this error.` → 파일 이름 없이 `npx tsc` / ``error TS2591: Cannot find name 'process'. …`` → `@types/node` 설치 + `"types": ["node"]` / `error TS1295: ECMAScript imports and exports cannot be written in a CommonJS file under 'verbatimModuleSyntax'.` → `npm pkg set type=module`(Day 3에서 했는지 확인) / `npx tsc`가 아무것도 안 보여 줌 = 성공(출력 없는 명령) / `dist\hello.js`를 고치는 실수 → 원본은 `src` / VS Code가 옛 오류를 계속 보여 줌 → 명령 팔레트 `TypeScript: Restart TS Server`
- 레퍼런스 대응: 연습 폴더(레퍼런스 없음). 개념 대응: 레퍼런스 `client/tsconfig.json`의 `"strict": true`, `client/src/types.ts`의 타입 표기.

## Day 5 — 타입 설계 (90분)

- 목표: `src\streamer.ts`에서 레퍼런스와 **같은 이름·칸**으로 타입을 설계한다: `type Platform = 'chzzk' | 'youtube' | 'soop' | 'other'`(유니온 + 리터럴), `interface Streamer { id; name; platform: Platform; channelUrl; bio; avatarUrl: string | null; createdAt: string }`, `interface StreamerDetail extends Streamer { schedules: Schedule[] }`, `interface Schedule { id; streamerId; streamerName; title; startsAt: string; durationMinutes }`. `?`(선택적 프로퍼티)와 `string | null`의 차이(레퍼런스는 "서버가 늘 보내지만 비어 있을 수 있음"이라 `| null`), `interface`와 `type` 별칭의 차이, `'twitch'`를 넣으면 TS2322가 나는 것. 타입 좁히기(`if (x !== null)`, `typeof`), `??`와 `?.`(JS에도 있는 연산자), 문자열 메서드 `slice(시작, 끝)`(앞에서부터 잘라 내기 — `'달빛곰'.slice(0, 1)`은 `'달'`, P1 Day 23의 `trim`처럼 문자열에 붙는 메서드. 과제 3과 Day 28 `createAvatar`가 씀). 예시 데이터 3명(달빛곰·픽셀토끼·노을고양이, `example.com` 주소)을 `Streamer[]`로 만들어 `for…of`로 출력한다.
- 이미 배운 것: 객체·배열 메서드 [P1 Day 19](#/day/p1-d19); 조건문·`===` [P1 Day 16](#/day/p1-d16); `null`·`undefined` 자료형 [P1 Day 15](#/day/p1-d15); 타입 표기·추론·`tsc` [Day 4](#/day/p2-d04)
- 시작 상태: [Day 4](#/day/p2-d04)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`
  - `C:\dev\ts-practice\`: `package.json`, `package-lock.json`, `node_modules\`, `hello.js`, `tsconfig.json`, `dist\`
  - `C:\dev\ts-practice\src\`: `hello.ts`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0)
  - 실행 중이어야 할 것: 없음
- 오늘 만들/바꿀 파일:
  - 새로 `C:\dev\ts-practice\src\streamer.ts` — Platform·Streamer·StreamerDetail·Schedule 타입 + 예시 데이터 + 출력 (레퍼런스 `client/src/types.ts`의 같은 이름 타입)
  - 바꿈 `C:\dev\ts-practice\dist\` — `streamer.js` 추가 (없음(연습))
- 끝 상태 확인: `node dist\streamer.js` → `달빛곰 (chzzk) 사진 없음` 같은 줄 3개. `platform: 'twitch'`로 바꾸면 `error TS2322: Type '"twitch"' is not assignable to type 'Platform'.`(작성자 원문 확인).
- 과제:
  1) 게시판 목록 한 줄 `PostListItem`(id, title, authorName, createdAt) 설계 (쉬움) → 레퍼런스 `types.ts`의 `PostListItem`과 같은 4칸
  2) `platformName(platform: Platform): string`을 `if`/`else if`로 작성 (보통) → 치지직·YouTube·SOOP·기타(JS `switch`는 쓰지 않음 — switch는 C# Day 10에서). Day 28에서 `Record`로 바꾼다고 예고
  3) `avatarUrl`이 `null`이면 이름 첫 글자를 쓰기 (보통) → `streamer.avatarUrl ?? streamer.name.slice(0, 1)`
- 용어(사전 담당): 인터페이스, 타입 별칭, 유니온 타입, 리터럴 타입, 선택적 프로퍼티, 타입 좁히기, null 병합 연산자, 옵셔널 체이닝
- 자주 막히는 곳 후보: `exactOptionalPropertyTypes`(tsc --init 기본값) 때문에 `?` 칸에 `undefined`를 직접 넣으면 오류 → 작성자가 원문 확인, 이 교재는 `| null`을 씀 / 리터럴 대소문자 `'Chzzk'` → TS2322 / `'x' is possibly 'null'.`(TS18047) → 좁히기 / 속성 이름 오타 TS2339 / `interface` 안에서 `,`와 `;`가 섞임(둘 다 됨)
- 레퍼런스 대응: 연습 폴더(레퍼런스 없음). 이 타입은 Day 7에 `client\src\types.ts`로 옮겨요(레퍼런스 `client/src/types.ts`의 Platform·Streamer·StreamerDetail·Schedule).

## Day 6 — 함수·제네릭·모듈 (100분)

- 목표: 함수 타입(매개변수·반환 타입, `void`, 기본 매개변수 `q = ''`, 함수를 받는 매개변수 `(s: Streamer) => boolean`). 제네릭: `first<T>(items: T[]): T | undefined`, `filterBy<T>`, 이미 쓰던 `Array<T>`·`string[]`, `Record<K, V>`(키→값 표), 제네릭 인터페이스 `interface Paged<T> { items: T[]; total; page; pageSize }`(레퍼런스와 같음). 모듈: Day 5의 `streamer.ts`를 `src\types.ts`(타입만 export), `src\data.ts`(예시 배열 export), `src\main.ts`(import해서 사용)로 나누고 `streamer.ts`는 지운다. `import type { Streamer } from './types.js'`(verbatimModuleSyntax 때문에 타입은 `import type`). 이 연습 폴더는 Node가 실행하는 방식(`module: nodenext`)이라 경로에 **`.js`** 를 쓰고, Day 7 Vite에서는 레퍼런스처럼 **`.ts`** 를 쓴다는 차이를 `:::info`로 예고한다(작성자가 두 방식 모두 실제로 확인).
- 이미 배운 것: 함수 선언·화살표 함수·스코프 [P1 Day 18](#/day/p1-d18); `map`/`filter`/`forEach` [P1 Day 19](#/day/p1-d19); 인터페이스·유니온 [Day 5](#/day/p2-d05); `tsc`·`tsconfig.json` [Day 4](#/day/p2-d04)
- 시작 상태: [Day 5](#/day/p2-d05)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`
  - `C:\dev\ts-practice\`: `package.json`, `package-lock.json`, `node_modules\`, `hello.js`, `tsconfig.json`, `dist\`
  - `C:\dev\ts-practice\src\`: `hello.ts`, `streamer.ts`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0)
  - 실행 중이어야 할 것: 없음
- 오늘 만들/바꿀 파일:
  - 새로 `C:\dev\ts-practice\src\types.ts` — Platform·Streamer·StreamerDetail·Schedule + `Paged<T>` export (레퍼런스 `client/src/types.ts`)
  - 새로 `C:\dev\ts-practice\src\data.ts` — 예시 스트리머 3명 export (없음(연습))
  - 새로 `C:\dev\ts-practice\src\main.ts` — import해서 `filterBy`·`first`·`Paged<Streamer>` 사용 (레퍼런스 `api.ts`의 `getJson<T>` 개념)
  - 삭제 `C:\dev\ts-practice\src\streamer.ts` — types.ts·data.ts로 나눴으니 지움 (없음)
  - 바꿈 `C:\dev\ts-practice\dist\` — 새 JS 파일들(지운 `streamer.js`는 남아도 됨) (없음)
- 끝 상태 확인: `npx tsc` 출력 없음, `node dist\main.js`가 필터 결과와 `1/1쪽` 같은 페이지 정보를 출력한다.
- 과제:
  1) `filterBy<T>(items: T[], test: (item: T) => boolean): T[]` 작성 (보통) → `return items.filter(test);`
  2) `Paged<Streamer>` 값 하나 만들기 (쉬움) → `{ items: streamers, total: 3, page: 1, pageSize: 20 }`
  3) `src\format.ts`에 Day 5 과제의 `platformName`을 옮겨 export/import (보통) → `export function platformName…`, `import { platformName } from './format.js';`
- 용어(사전 담당): 함수 타입, 제네릭, 타입 매개변수, 모듈
- 자주 막히는 곳 후보: `error TS2835: Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './types.js'?` → `.js` 붙이기(작성자 원문 확인) / `error TS1484: 'Streamer' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled.` → `import type` / `export` 빠짐 → `Module '"./types.js"' has no exported member …` / `node dist\main.js`에서 `ERR_MODULE_NOT_FOUND` → `dist` 안 경로 확인, `npx tsc` 다시 / 제네릭 `<T>` 위치(함수 이름 뒤)
- 레퍼런스 대응: 연습 폴더(레퍼런스 없음). 개념 대응: 레퍼런스 `client/src/api.ts`의 `getJson<T>`, `types.ts`의 `Paged<T>`, `ui.ts`의 `Record<Platform, string>`, 모든 파일의 `import type`.

## Day 7 — Vite 프로젝트 (110분)

- 목표: `cd C:\dev\streamer-hub` → `npm create vite@latest client -- --template vanilla-ts`(대화형 질문 `Install with npm and start now?` → **No**를 권장하고 `cd client`, `npm install`, `npm run dev`를 직접 친다. 질문 문구는 external-facts 7절). 개발 서버 주소 `http://localhost:5173/`의 **localhost**와 **포트** 뜻, 저장하면 바로 바뀌는 HMR. 템플릿 정리: `src\counter.ts`, `src\assets\`(hero.png·typescript.svg·vite.svg), `public\icons.svg`를 지운다. `public\favicon.svg`는 레퍼런스 아이콘으로 바꾼다. `index.html`: `lang="ko"`, `<title>스트리머 허브</title>`, `header.site-header`(`a.logo`, `nav` 안 `ul.nav-links`: 홈 `#/`, 스트리머 `#/streamers`, 방송 일정 `#/schedule`, 팬 게시판 `#/board` — 누르면 주소만 바뀌고 화면은 Day 28부터), `main#app.container`, `footer.site-footer`. `src\main.ts`: `import './style.css';`, `document.querySelector<HTMLElement>('#app')!`(제네릭 + `!` 타입 단언), **`innerHTML`**(HTML 글자를 요소로 바꿔 넣는 속성 — P1에서 안 썼으니 처음 소개, "우리가 쓴 고정 글자만 넣는다"는 규칙과 이유를 Day 34 예고와 함께)로 홈 hero(`section.hero`, 버튼 두 개는 과제). `src\style.css`: 레퍼런스 `client/src/style.css`의 **1~127줄**(머리 주석, 1. 색 변수, 2. 기본, 3. 머리말의 `.site-header`~`.nav-links a[aria-current='page']`), **135~161줄**(`.site-footer`, 4. 공통 부품 주석, `.button`, `.button.secondary`), **178~183줄**(`.actions`), **304~315줄**(5. 화면별 주석, `.hero`, `.hero h1`). `.auth-menu`(128~134줄)는 Day 31에 넣는다(P1 색 변수와 같은 이름). `tsconfig.json`에 `"strict": true` 한 줄(레퍼런스와 같게). `src\types.ts`: Day 6 연습의 타입을 복사(이 프로젝트에서는 import 경로에 `.ts`). `npm run build` → `dist\`, `npm run preview`. `git status`로 `node_modules`·`dist`가 안 보이는 것(`client\.gitignore`) 확인 후 커밋·푸시.
- 이미 배운 것: 시맨틱 구조 [P1 Day 6](#/day/p1-d06); CSS·선택자 [P1 Day 9](#/day/p1-d09); Flexbox [P1 Day 11](#/day/p1-d11); CSS 변수·hover [P1 Day 14](#/day/p1-d14); `prefers-color-scheme` [P1 Day 22](#/day/p1-d22); `querySelector`·`textContent`·`classList` [P1 Day 20](#/day/p1-d20); 제네릭·모듈·`import type` [Day 6](#/day/p2-d06); npm·`npm install` [Day 3](#/day/p2-d03); `strict` [Day 4](#/day/p2-d04); 커밋·푸시 [Day 2](#/day/p2-d02)
- 시작 상태: [Day 6](#/day/p2-d06)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`
  - `C:\dev\ts-practice\`: `package.json`, `package-lock.json`, `node_modules\`, `hello.js`, `tsconfig.json`, `dist\`
  - `C:\dev\ts-practice\src\`: `hello.ts`, `types.ts`, `data.ts`, `main.ts`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0)
  - 실행 중이어야 할 것: 없음(오늘 1단계에서 처음 켬)
- 오늘 만들/바꿀 파일:
  - 새로 `C:\dev\streamer-hub\client\.gitignore` — 템플릿 그대로(`_gitignore`가 `.gitignore`로 바뀜) (레퍼런스 `client/.gitignore`(같음))
  - 새로 `C:\dev\streamer-hub\client\package.json` — 템플릿 그대로(`name: "client"`, `typescript ~7.0.2`, `vite ^8.3.5`) (레퍼런스 `client/package.json`(같음))
  - 새로 `C:\dev\streamer-hub\client\package-lock.json` — `npm install` 결과 (레퍼런스 `client/package-lock.json`)
  - 새로 `C:\dev\streamer-hub\client\node_modules\` — 설치 결과(커밋 안 함) (—)
  - 새로 `C:\dev\streamer-hub\client\tsconfig.json` — 템플릿 + `"strict": true` (레퍼런스 `client/tsconfig.json`(같음))
  - 새로 `C:\dev\streamer-hub\client\index.html` — 사이트 틀(머리말 메뉴 4개 + `main#app` + 꼬리말) (레퍼런스 `client/index.html`(Day 31·32에 auth-menu·admin-link 추가))
  - 새로 `C:\dev\streamer-hub\client\public\favicon.svg` — 레퍼런스 아이콘으로 바꿈 (레퍼런스 `client/public/favicon.svg`(같음))
  - 새로 `C:\dev\streamer-hub\client\src\main.ts` — 홈 hero를 `innerHTML`로 그림 (레퍼런스 `client/src/main.ts`·`pages/home.ts`의 hero)
  - 새로 `C:\dev\streamer-hub\client\src\style.css` — 레퍼런스 1~127·135~161·178~183·304~315줄(`.auth-menu` 128~134줄은 Day 31) (레퍼런스 `client/src/style.css`의 같은 블록)
  - 새로 `C:\dev\streamer-hub\client\src\types.ts` — Day 6 연습 타입 복사(Platform·Streamer·StreamerDetail·Schedule·Paged<T>) (레퍼런스 `client/src/types.ts`)
  - 새로 `C:\dev\streamer-hub\client\dist\` — `npm run build` 결과(커밋 안 함) (—)
  - 삭제 `C:\dev\streamer-hub\client\src\counter.ts` — 템플릿 예제 삭제 (—)
  - 삭제 `C:\dev\streamer-hub\client\src\assets\` — 템플릿 그림(hero.png·typescript.svg·vite.svg) 삭제 (—)
  - 삭제 `C:\dev\streamer-hub\client\public\icons.svg` — 템플릿 아이콘 묶음 삭제 (—)
- 끝 상태 확인: 브라우저 `http://localhost:5173`에 로고·메뉴 4개·"스트리머 허브" hero·꼬리말이 보이고, Windows가 다크 모드면 어두운 색이다. `main.ts`를 고쳐 저장하면 새로 고침 없이 바뀐다. `npm run build` 끝에 `✓ built in`이 보인다. `git status`에 `node_modules`가 없다.
- 과제:
  1) 꼬리말 문구를 "스트리머 허브 · 시간은 모두 한국 시간이에요"로 바꾸고 HMR 확인 (쉬움) → 레퍼런스 `index.html` 꼬리말
  2) hero에 버튼 두 개(`#/schedule` "이번 주 방송 일정", `#/streamers` "스트리머 보기") 추가 (보통) → 레퍼런스 `pages/home.ts`의 `p.actions` 블록
  3) `dist\index.html`을 열어 `<script>` 주소가 `/assets/…-해시.js`로 바뀐 것 찾기 (쉬움) → 빌드가 TS를 JS로 묶고 이름에 해시를 붙임
- 용어(사전 담당): Vite, 개발 서버, localhost, 포트, HMR, 빌드, 타입 단언, innerHTML
- 자주 막히는 곳 후보: 대화형 질문에서 방향키·Enter, 실수로 다른 템플릿 → 폴더 지우고 다시 / `Target directory "client" is not empty.` 선택지(external-facts 7절) / **포트 충돌**: `Port 5173 is in use, trying another one...` → 다른 터미널의 dev 서버를 `Ctrl + C`로 끄거나 표시된 5174 주소 사용(Day 27 프록시는 서버 포트 5250만 중요) / 터미널 창을 닫아 `ERR_CONNECTION_REFUSED`/"사이트에 연결할 수 없음" → `npm run dev` 다시 / dev 서버가 터미널을 차지해 다음 명령을 못 침 → 터미널 하나 더(`+`) / Windows 보안 경고(방화벽) 창이 뜨면 → 허용 범위를 개인 네트워크로 두거나 취소해도 localhost는 동작(문구는 버전에 따라 다를 수 있음, 방화벽 끄지 않기) / `Cannot find module './types.ts'` → 파일 위치·이름 / npm.cmd로 실행했을 때 `Ctrl + C` 뒤 `Terminate batch job (Y/N)?` → `Y`
- 레퍼런스 대응: 끝: `client/.gitignore`, `package.json`, `tsconfig.json`, `public/favicon.svg`는 레퍼런스와 같아요. 중간 단계 — `index.html`(Day 31 `#auth-menu`, Day 32 `#admin-link`), `main.ts`(Day 8·27·28·31·32), `style.css`(Day 8·28·29·31·32), `types.ts`(Day 27·31·32·33).

## Day 8 — 비동기 깊게 (110분)

- 목표: Promise = "나중에 올 값의 약속"(대기·이행·거부). 개발자 도구 콘솔에서 `new Promise(resolve => setTimeout(resolve, 1000))`로 만든 `wait(ms)`를 `await`해 본다(`setTimeout`은 처음이니 한 줄 설명). async 함수는 항상 Promise를 돌려준다. `Promise.all`로 두 요청을 **동시에** 보내고 `const [streamers, schedules] = await Promise.all([...])`(구조 분해 할당), `list.append(...items)`(전개 구문). 임시 데이터 `client\public\data\streamers.json`·`schedules.json`(레퍼런스 시드와 같은 3명·4개, 시각은 `Z`가 붙은 UTC 문자열)을 만든다. `src\api.ts`: `async function getJson<T>(url: string): Promise<T>`(`response.ok`가 아니면 `throw new Error(...)`, `as T`는 "믿고 쓰기"일 뿐 실행 중 검사가 아님), `getStreamers()`·`getSchedules()`(임시 주소 `/data/*.json`). `src\ui.ts`: P1 도우미 `createElementWithText(tagName: string, className: string, text: string): HTMLElement`, `setStatus(element, message, isError = false)`, `errorMessage(error: unknown): string`(지금은 한 가지 문장). `main.ts`: hero 아래 `<p class="status" role="status">불러오는 중...</p>` → 카드 그리드(이름·플랫폼 배지·소개)와 "다가오는 방송" 목록(시각은 일단 문자열 그대로 — 한국 시간 표시는 Day 29). 개발자 도구 Network의 **Offline**/느린 네트워크로 로딩·오류 문장을 확인. `style.css`: 레퍼런스 **184~213줄**(`.status:empty`, `.status.error`, `.badge`+플랫폼 색 3개)과 **262~303줄**(`.item-list`, `.item-list li`, `.card-grid`, `.card`, `.card h2`, `.bio`)을 레퍼런스와 같은 순서·자리에 넣는다(`.muted`는 Day 7에 이미 있음).
- 이미 배운 것: JSON·`fetch`·`async`/`await`·`try`/`catch`·`response.ok` [P1 Day 25](#/day/p1-d25); `setInterval`(타이머) [P1 Day 26](#/day/p1-d26); `createElement`·`textContent` [P1 Day 20](#/day/p1-d20); `createElementWithText` 도우미 [P1 Day 20](#/day/p1-d20); `role="status"` [P1 Day 24](#/day/p1-d24); Grid 카드 [P1 Day 12](#/day/p1-d12); 제네릭 [Day 6](#/day/p2-d06); 타입 단언·Vite 개발 서버·`public` 폴더 [Day 7](#/day/p2-d07)
- 시작 상태: [Day 7](#/day/p2-d07)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`
  - `C:\dev\streamer-hub\client\`: `.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`
  - `C:\dev\streamer-hub\client\public\`: `favicon.svg`
  - `C:\dev\streamer-hub\client\src\`: `main.ts`, `style.css`, `types.ts`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0)
  - 실행 중이어야 할 것: 클라이언트 `npm run dev`(꺼져 있으면 1단계에서 켬)
- 오늘 만들/바꿀 파일:
  - 새로 `C:\dev\streamer-hub\client\public\data\streamers.json` — 임시 예시 데이터 3명(서버 응답과 같은 칸) (중간 단계(Day 27에 지움))
  - 새로 `C:\dev\streamer-hub\client\public\data\schedules.json` — 임시 일정 4개 (중간 단계(Day 27에 지움))
  - 새로 `C:\dev\streamer-hub\client\src\api.ts` — `getJson<T>` + `getStreamers()`·`getSchedules()`(임시 주소) (레퍼런스 `client/src/api.ts`의 `getJson<T>`)
  - 새로 `C:\dev\streamer-hub\client\src\ui.ts` — `createElementWithText`, `setStatus`, `errorMessage`(단순) (레퍼런스 `client/src/ui.ts`의 같은 함수)
  - 바꿈 `C:\dev\streamer-hub\client\src\main.ts` — Promise.all로 불러와 카드·다가오는 방송 그리기, 상태 문장 (레퍼런스 `pages/home.ts`의 Promise.all, `pages/streamers.ts`의 카드)
  - 바꿈 `C:\dev\streamer-hub\client\src\style.css` — 레퍼런스 184~213·262~303줄 (레퍼런스 `style.css`의 같은 블록)
- 끝 상태 확인: 홈에 "불러오는 중..."이 잠깐 보였다가 카드 3장과 다가오는 방송 줄이 보인다. Network를 Offline으로 두고 새로 고치면 빨간 오류 문장이 보인다. 콘솔 오류는 0개(Offline 실험 제외).
- 과제:
  1) `wait(ms)`를 만들어 1초 뒤 콘솔에 "1초 지났어요" (쉬움) → `function wait(ms: number): Promise<void> { return new Promise((resolve) => setTimeout(resolve, ms)); }`
  2) `streamers.json` 주소를 일부러 틀려 404 오류 문장 보기, 원래대로 (쉬움) → `getJson`이 `throw`하고 `catch`가 `setStatus(…, true)`
  3) 목록이 비었을 때 "아직 등록된 스트리머가 없어요." 보여 주기 (보통) → `if (streamers.length === 0)` 분기(레퍼런스 `streamers.ts`와 같은 문장)
- 용어(사전 담당): Promise, 구조 분해 할당, 전개 구문, unknown
- 자주 막히는 곳 후보: `await` 빠짐 → 화면에 `[object Promise]` / `public\data\…` 파일인데 주소는 `/data/…`(public은 주소에 안 들어감) → 404 / JSON 쉼표·따옴표 오류 → `SyntaxError: … JSON …`(브라우저마다 문구 다름, 작성자 원문 확인) / `'error' is of type 'unknown'.`(TS18046) → `errorMessage(error)`로 넘기기 / `as T`라서 칸 이름 오타가 있어도 컴파일은 통과 → 화면에 `undefined` / 바꾼 JSON이 안 보임 → `Ctrl + Shift + R`
- 레퍼런스 대응: 중간 단계 — 레퍼런스와 다름: `api.ts`는 임시 주소 `/data/*.json`을 읽어요(Day 27에 `/api`로 바꾸고 `public\data\`는 지움). `ui.ts`의 `createElementWithText`·`setStatus`는 레퍼런스와 같고 `errorMessage`는 Day 27에 `ApiError` 분기를 더해요. 카드 그리기는 Day 28에 `pages/streamers.ts`로 옮겨요.

## Day 9 — .NET과 첫 C# (110분)

- 목표: C#은 정적 타입 + 컴파일 언어이고 유니티의 언어라는 것(TS와 비교 표). .NET = SDK(만드는 도구) + 런타임(실행기). 설치: `winget install Microsoft.DotNet.SDK.10` 또는 dotnet.microsoft.com의 .NET 10 SDK 설치 프로그램(작성 기준 10.0.403) → 새 터미널에서 `dotnet --version`이 `10.0.`으로 시작하는지, `dotnet --list-sdks`. 첫 실행 환영·원격 분석 안내 문장 읽기. VS Code 확장 **C#**(`ms-dotnettools.csharp`) 설치. C# Dev Kit은 "선택, Visual Studio 계정 로그인·약관 확인 필요"(external-facts 2절). `dotnet new console -n HubConsole -o C:\dev\cs-practice` → `HubConsole.csproj`(TargetFramework `net10.0`, `Nullable`, `ImplicitUsings`) 읽기, `Program.cs`의 최상위 문장, `Console.WriteLine`. `cd C:\dev\cs-practice` → `dotnet run` → `dotnet build` 후 `bin\Debug\net10.0\HubConsole.dll` 확인. 일부러 `;`를 빼서 `Program.cs(2,36): error CS1002: ; expected` 형식(TS 오류와 같은 구조)을 읽는다.
- 이미 배운 것: 컴파일·정적 타입 [Day 4](#/day/p2-d04); PATH·새 터미널 [Day 3](#/day/p2-d03); 터미널 [Day 2](#/day/p2-d02); VS Code 확장 설치 [P1 Day 2](#/day/p1-d02)
- 시작 상태: [Day 8](#/day/p2-d08)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`
  - `C:\dev\streamer-hub\client\`: `.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`
  - `C:\dev\streamer-hub\client\public\`: `favicon.svg`
  - `C:\dev\streamer-hub\client\public\data\`: `streamers.json`, `schedules.json`
  - `C:\dev\streamer-hub\client\src\`: `main.ts`, `style.css`, `types.ts`, `api.ts`, `ui.ts`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0)
  - 실행 중이어야 할 것: 없음
- 오늘 만들/바꿀 파일:
  - 새로 `C:\dev\cs-practice\HubConsole.csproj` — 템플릿 그대로 (레퍼런스 `server/StreamerHub.Api/StreamerHub.Api.csproj`의 PropertyGroup)
  - 새로 `C:\dev\cs-practice\Program.cs` — 인사 문장과 스트리머 이름 세 줄 출력 (없음(연습))
  - 새로 `C:\dev\cs-practice\bin\` — 빌드 결과(`HubConsole.dll` 등) (—)
  - 새로 `C:\dev\cs-practice\obj\` — 빌드 중간 파일 (—)
- 끝 상태 확인: `dotnet --version` → `10.0.403`(숫자는 달라도 `10.0.`으로 시작), `dotnet run` → `안녕하세요, 스트리머 허브!` 등 세 줄, VS Code에서 `Program.cs`에 색과 자동 완성이 보인다.
- 과제:
  1) 내 방송 이름·요일·시간을 세 줄로 출력 (쉬움) → `Console.WriteLine("…");` 세 줄
  2) `;`를 빼서 CS1002 원문을 보고 고치기 (쉬움) → 오류 줄·칸 읽는 법
  3) `dotnet build` 뒤 `dotnet bin\Debug\net10.0\HubConsole.dll`로 직접 실행 (보통) → 같은 출력. "컴파일된 결과물을 런타임이 실행"
- 용어(사전 담당): .NET, C#, SDK, 런타임, dotnet CLI, 프로젝트 파일, 최상위 문장
- 자주 막히는 곳 후보: 설치 직후 `dotnet` 인식 안 됨 → 터미널·VS Code 다시 열기 / `dotnet --version`이 8·9로 시작 → 10 SDK 설치 여부 `dotnet --list-sdks` / `Couldn't find a project to run.` → 현재 위치가 `C:\dev\cs-practice`인지 / 설치 중 관리자 권한 창 → "예" / 한글 출력이 `?`로 보이는 경우(콘솔 인코딩) → 작성자가 Windows Terminal에서 확인하고 해결 안내(미확인) / C# Dev Kit이 로그인을 요구 → 선택 확장이므로 C# 확장만으로 진행 / 백신이 첫 빌드를 느리게 함 → 기다리기
- 레퍼런스 대응: 연습 폴더(레퍼런스 없음). 개념 대응: 레퍼런스 `StreamerHub.Api.csproj`의 `TargetFramework net10.0`·`Nullable`·`ImplicitUsings`.

## Day 10 — C# 기본 문법 (90분)

- 목표: 값 타입 `int`·`double`·`bool`·`string`·`char`(작은따옴표), `var`(C#의 타입 추론 — 한번 정해진 타입은 못 바꿈), `const`. 문자열 보간 `$"{name}님, {hour}시"`. 연산자는 TS와 같지만 비교는 `==` 하나(`===` 없음), 정수 나눗셈 `7 / 2 == 3`. `if`/`else if`/`else`, `switch` 문(`case … break;`)과 **switch 식**(`var label = day switch { 0 => "일", … , _ => "?" };`), 열거형 `enum Platform { Chzzk, Youtube, Soop, Other }`(TS의 유니온과 비교 — Vite 템플릿에서는 TS `enum`을 쓰지 않는다는 점도 한 줄). `for`, `foreach`, `while`, 배열 `string[]`. 결과물: 요일별 방송 시간표를 출력하는 `Program.cs`.
- 이미 배운 것: 조건문 [P1 Day 16](#/day/p1-d16); 반복문·배열 [P1 Day 17](#/day/p1-d17); 타입 표기·추론 [Day 4](#/day/p2-d04); 유니온·리터럴 타입 [Day 5](#/day/p2-d05); C# 콘솔·`dotnet run` [Day 9](#/day/p2-d09)
- 시작 상태: [Day 9](#/day/p2-d09)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`
  - `C:\dev\streamer-hub\client\`: `.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`
  - `C:\dev\streamer-hub\client\public\`: `favicon.svg`
  - `C:\dev\streamer-hub\client\public\data\`: `streamers.json`, `schedules.json`
  - `C:\dev\streamer-hub\client\src\`: `main.ts`, `style.css`, `types.ts`, `api.ts`, `ui.ts`
  - `C:\dev\cs-practice\`: `HubConsole.csproj`, `Program.cs`, `bin\`, `obj\`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0), .NET 10 SDK(`dotnet --version` → `10.0.`으로 시작), VS Code C# 확장(`ms-dotnettools.csharp`)
  - 실행 중이어야 할 것: 없음
- 오늘 만들/바꿀 파일:
  - 바꿈 `C:\dev\cs-practice\Program.cs` — 요일·시간 배열 + switch 식으로 요일 이름 + enum 플랫폼 이름 출력 (없음(연습))
- 끝 상태 확인: `dotnet run` → "월요일 20:00 저녁 게임 방송" 같은 시간표 줄과 플랫폼 이름이 출력된다.
- 과제:
  1) 1부터 10까지 합을 `for`로 (쉬움) → `55`
  2) 요일 번호(0~6) → 이름 switch 식 (보통) → `_ =>` 기본 갈래 포함
  3) 시청자 수에 따라 "작은 방송/보통/큰 방송" if/else (쉬움) → 경계값 포함 조건
- 용어(사전 담당): 문자열 보간, switch 식, 열거형
- 자주 막히는 곳 후보: `error CS0029: Cannot implicitly convert type 'string' to 'int'` / `error CS0165: Use of unassigned local variable` / `$`를 빠뜨려 `{name}`이 그대로 출력 / `'ab'` → `error CS1012: Too many characters in character literal` / switch 문 `break` 빠짐 → `error CS0163` / 정수 나눗셈 결과가 예상과 다름 → `7 / 2.0`
- 레퍼런스 대응: 연습 폴더(레퍼런스 없음). 개념 대응: 레퍼런스 `Services/PostService.cs`의 `enum PostChangeResult`, `Endpoints/*.cs`의 문자열 보간 `$"/api/streamers/{streamer.Id}"`, `SeedData.AdminRole`의 `const`.

## Day 11 — 메서드와 컬렉션 (100분)

- 목표: 메서드 선언(반환 타입, 매개변수, 기본값, 이름 있는 인수 `isAdmin: false`, `void`) — P1 JS 함수와 비교. `List<string>`(Add·Remove·Count·인덱스·`foreach`·`Contains`), `Dictionary<string, int>`(키로 찾기, `ContainsKey`, `TryGetValue(key, out var value)`), 컬렉션 초기화 `new List<string> { "달빛곰", … }`. 제네릭 `List<T>`는 Day 6의 `Array<T>`와 같은 생각. nullable: `string?`, `int?`, `is null`/`is not null`, `??`, `?.`(TS와 같은 연산자), 컴파일러 경고 `CS8600`/`CS8602`(경고와 오류의 차이). `out` 매개변수: `int.TryParse(text, out var number)`. 결과물: `FindStreamer(string name)`이 없으면 `null`을 돌려주고 호출하는 쪽이 검사하는 프로그램, 플랫폼별 인원을 Dictionary로 세기.
- 이미 배운 것: 함수·매개변수·반환값 [P1 Day 18](#/day/p1-d18); 배열 [P1 Day 17](#/day/p1-d17); 제네릭 [Day 6](#/day/p2-d06); null 병합·옵셔널 체이닝 [Day 5](#/day/p2-d05); C# 기본 문법 [Day 10](#/day/p2-d10)
- 시작 상태: [Day 10](#/day/p2-d10)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`
  - `C:\dev\streamer-hub\client\`: `.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`
  - `C:\dev\streamer-hub\client\public\`: `favicon.svg`
  - `C:\dev\streamer-hub\client\public\data\`: `streamers.json`, `schedules.json`
  - `C:\dev\streamer-hub\client\src\`: `main.ts`, `style.css`, `types.ts`, `api.ts`, `ui.ts`
  - `C:\dev\cs-practice\`: `HubConsole.csproj`, `Program.cs`, `bin\`, `obj\`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0), .NET 10 SDK(`dotnet --version` → `10.0.`으로 시작), VS Code C# 확장(`ms-dotnettools.csharp`)
  - 실행 중이어야 할 것: 없음
- 오늘 만들/바꿀 파일:
  - 바꿈 `C:\dev\cs-practice\Program.cs` — 스트리머 이름 List, 플랫폼별 인원 Dictionary, `FindStreamer` 메서드, TryParse (없음(연습))
- 끝 상태 확인: `dotnet run` → 목록·인원 수·검색 결과("찾지 못했어요" 포함)가 출력되고 경고 0개.
- 과제:
  1) `List<string>`에 이름이 있는지 확인하는 메서드 `bool HasStreamer(List<string> names, string name)` (쉬움) → `return names.Contains(name);`
  2) Dictionary로 플랫폼별 인원 세기 (보통) → `counts[platform] = counts.GetValueOrDefault(platform) + 1;` 또는 `TryGetValue`
  3) "20"·"abc"를 `int.TryParse`로 바꿔 보기 (쉬움) → 성공이면 숫자, 실패면 `false`
- 용어(사전 담당): 컬렉션, List, Dictionary, nullable, out 매개변수
- 자주 막히는 곳 후보: `warning CS8602: Dereference of a possibly null reference.` 뜻과 고치는 법 / `dictionary["없는키"]` → `KeyNotFoundException`(예외는 Day 15) / 인덱스 범위 밖 → `ArgumentOutOfRangeException` / `foreach` 중 `Remove` → `InvalidOperationException: Collection was modified` / 최상위 문장 파일에서 메서드를 어디에 두는지(아래쪽에 두어도 됨)
- 레퍼런스 대응: 연습 폴더(레퍼런스 없음). 개념 대응: 레퍼런스 `Services/NoticeBroadcaster.cs`의 `List`, `ScheduleEndpoints.Problem`의 `Dictionary<string, string[]>`, `Entities`의 `string?`, `HttpUrlAttribute`의 `out var`, `PostService`의 `isAdmin: false`.

## Day 12 — 클래스와 객체 (100분)

- 목표: 클래스 = 설계도, 인스턴스 = 찍어 낸 물건. `Streamer.cs`·`Schedule.cs`로 파일을 나누고 `namespace HubConsole;` + `using`. 프로퍼티 `public string Name { get; set; } = "";`(기본값이 있어야 nullable 경고가 없음), 생성자, `public`/`private`/`internal`, `static` 멤버와 정적 클래스, 객체 이니셜라이저 `new Streamer { Name = "달빛곰" }`, 대상 형식 `new()`. `record`: 값이 같으면 같다(`==` 실험), 위치 record `record StreamerCard(int Id, string Name, string Platform);`, `init`, `with` 식. `DateTime`: `DateTime.UtcNow`, `AddDays`·`AddHours`, `Schedule.StartsAt`(UTC와 한국 시간은 Day 29). 클래스 안의 `List<Schedule> Schedules`로 스트리머 1명에 일정 여러 개. `:::info 유니티에서는`: 유니티 스크립트도 `class Player : MonoBehaviour`(상속은 Day 13). TS의 `interface`(모양)와 C# 클래스(실제로 만드는 틀) 비교.
- 이미 배운 것: 객체 [P1 Day 19](#/day/p1-d19); 인터페이스(모양 설계) [Day 5](#/day/p2-d05); 메서드·List·nullable [Day 11](#/day/p2-d11); C# 기본 [Day 10](#/day/p2-d10)
- 시작 상태: [Day 11](#/day/p2-d11)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`
  - `C:\dev\streamer-hub\client\`: `.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`
  - `C:\dev\streamer-hub\client\public\`: `favicon.svg`
  - `C:\dev\streamer-hub\client\public\data\`: `streamers.json`, `schedules.json`
  - `C:\dev\streamer-hub\client\src\`: `main.ts`, `style.css`, `types.ts`, `api.ts`, `ui.ts`
  - `C:\dev\cs-practice\`: `HubConsole.csproj`, `Program.cs`, `bin\`, `obj\`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0), .NET 10 SDK(`dotnet --version` → `10.0.`으로 시작), VS Code C# 확장(`ms-dotnettools.csharp`)
  - 실행 중이어야 할 것: 없음
- 오늘 만들/바꿀 파일:
  - 새로 `C:\dev\cs-practice\Streamer.cs` — class Streamer(Id·Name·Platform·ChannelUrl·Bio·AvatarUrl?·CreatedAt·Schedules) + 메서드 하나 (레퍼런스 `Entities/Streamer.cs`의 프로퍼티(특성 빼고))
  - 새로 `C:\dev\cs-practice\Schedule.cs` — class Schedule(Id·StreamerId·Title·StartsAt·DurationMinutes) (레퍼런스 `Entities/Schedule.cs`)
  - 새로 `C:\dev\cs-practice\StreamerCard.cs` — 위치 record `StreamerCard` (레퍼런스 `Dtos/*.cs`의 위치 record)
  - 바꿈 `C:\dev\cs-practice\Program.cs` — 객체를 만들어 출력, record 비교·`with` 실험 (없음(연습))
- 끝 상태 확인: `dotnet run` → 스트리머 3명과 각자의 다음 방송 시각, record 비교 결과 `True`/`False`가 출력된다.
- 과제:
  1) 게시글 클래스 `Post`(Id, AuthorId, Title, Body, CreatedAt, UpdatedAt?) 만들기 (쉬움) → 레퍼런스 `Entities/Post.cs`와 같은 프로퍼티(특성·Author 빼고)
  2) `private int viewers` + `AddViewer()` 메서드로만 늘리기 (보통) → 밖에서 `viewers`를 직접 못 바꾸는 것을 CS0122로 확인
  3) record `with`로 이름만 바꾼 복사본 만들기 (쉬움) → `var renamed = card with { Name = "새이름" };`
- 용어(사전 담당): C# 클래스, 인스턴스, 프로퍼티, 생성자, 접근 제한자, static, record, 네임스페이스
- 자주 막히는 곳 후보: `error CS0122: '…' is inaccessible due to its protection level` / `error CS7036: There is no argument given that corresponds to the required parameter …`(생성자 인수) / `error CS0246: The type or namespace name '…' could not be found`(namespace·using) / `warning CS8618: Non-nullable property 'Name' must contain a non-null value when exiting constructor.` → `= ""` / class와 record의 `==` 결과가 다름
- 레퍼런스 대응: 연습 폴더(레퍼런스 없음). 개념 대응: 레퍼런스 `Entities/*.cs`(프로퍼티·기본값), `Dtos/*.cs`(record·init·위치 record·`with`는 테스트), `Data/SeedData.cs`(static class·객체 이니셜라이저).

## Day 13 — 상속과 인터페이스 (100분)

- 목표: 상속 `class Fan : User`, `class Admin : User`, `: base(name)`. `virtual`/`override`로 `Describe()`를 클래스마다 다르게, `override ToString()`. 다형성: `List<User>`에 섞어 담고 같은 메서드 호출. C# 인터페이스 `interface INotifier { void Send(string message); }`를 두 클래스가 구현(TS 인터페이스는 모양만 맞으면 되지만 C#은 `: INotifier`로 **선언**해야 함). 패턴 매칭 `if (user is Admin admin)`, `is null`, `value is string text && text != ""`(Day 34 `HttpUrlAttribute`가 쓰는 문법). `IDisposable`은 "정리할 것이 있는 객체"라는 인터페이스라는 것만 소개(Day 15 `using`). 레퍼런스에서 보게 될 상속 예: `AppUser : IdentityUser`, `HttpUrlAttribute : ValidationAttribute`, `AppDbContext : IdentityDbContext<AppUser>`.
- 이미 배운 것: 클래스·생성자·접근 제한자·static [Day 12](#/day/p2-d12); TS 인터페이스 [Day 5](#/day/p2-d05); List [Day 11](#/day/p2-d11)
- 시작 상태: [Day 12](#/day/p2-d12)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`
  - `C:\dev\streamer-hub\client\`: `.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`
  - `C:\dev\streamer-hub\client\public\`: `favicon.svg`
  - `C:\dev\streamer-hub\client\public\data\`: `streamers.json`, `schedules.json`
  - `C:\dev\streamer-hub\client\src\`: `main.ts`, `style.css`, `types.ts`, `api.ts`, `ui.ts`
  - `C:\dev\cs-practice\`: `HubConsole.csproj`, `Program.cs`, `bin\`, `obj\`, `Streamer.cs`, `Schedule.cs`, `StreamerCard.cs`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0), .NET 10 SDK(`dotnet --version` → `10.0.`으로 시작), VS Code C# 확장(`ms-dotnettools.csharp`)
  - 실행 중이어야 할 것: 없음
- 오늘 만들/바꿀 파일:
  - 새로 `C:\dev\cs-practice\Users.cs` — User(기본) / Fan / Admin — virtual·override Describe (레퍼런스 `Entities/AppUser.cs`(`: IdentityUser`))
  - 새로 `C:\dev\cs-practice\Notifiers.cs` — interface INotifier + ConsoleNotifier·PrefixNotifier (없음(연습))
  - 바꿈 `C:\dev\cs-practice\Program.cs` — `List<User>` 다형성, `is` 패턴, 알림 보내기 (없음(연습))
- 끝 상태 확인: `dotnet run` → 같은 `Describe()` 호출이 팬·관리자마다 다른 문장을 출력하고, `is Admin`으로 관리자만 골라낸다.
- 과제:
  1) `Moderator : User` 추가하고 Describe 재정의 (쉬움) → `public override string Describe() { return $"{Name}님은 채팅 관리자예요."; }`(블록 본문 — `=>` 식 본문은 Day 14)
  2) 목록에서 관리자 이름만 출력 (보통) → `foreach (var user in users) { if (user is Admin admin) … }`
  3) `interface IRule { bool IsValid(object? value); }`와 `NotEmptyRule` 구현 (도전) → `return value is string text && text != "";` (Day 34 미리보기)
- 용어(사전 담당): 상속, virtual, override, 다형성, 패턴 매칭
- 자주 막히는 곳 후보: `error CS0506: … cannot override inherited member … because it is not marked virtual, abstract, or override` / `error CS0535: '…' does not implement interface member '…'` / `error CS0115: '…': no suitable method found to override`(이름 오타) / 클래스 두 개를 상속하려 함 → `error CS1721`(인터페이스는 여러 개 가능) / `base` 생성자 인수 빠짐 → CS7036
- 레퍼런스 대응: 연습 폴더(레퍼런스 없음). 개념 대응: 레퍼런스 `Entities/AppUser.cs`, `Dtos/HttpUrlAttribute.cs`(`override IsValid`, `is string text`), `Data/AppDbContext.cs`(`override ConfigureConventions`), `StreamerHub.Tests/TestDb.cs`(`: IDisposable`).

## Day 14 — LINQ와 람다 (90분)

- 목표: 람다 식 `s => s.Name`(TS 화살표 함수와 같은 모양), `Func<Streamer, bool>`는 "함수 타입"이라는 것만(Day 6). LINQ 메서드: `Where`·`Select`·`OrderBy`/`OrderByDescending`·`First`/`FirstOrDefault`·`Any`·`Count`·`ToList`·`Skip`/`Take`, 메서드 이어 쓰기. JS `filter`↔`Where`, `map`↔`Select`, `sort`↔`OrderBy` 표. `ToList()`를 해야 실제로 계산된다(지연 실행은 한 문장으로만, DB에서 중요해지는 이유는 Day 21 `IQueryable`). 식 본문 멤버 `public string Label => $"{Name} ({Platform})";`, `public override string Describe() => …;`. 결과물: 이름순 목록, 플랫폼 필터, 다가오는 일정 3개, 쪽 나누기.
- 이미 배운 것: `map`/`filter`/`forEach` [P1 Day 19](#/day/p1-d19); 화살표 함수 [P1 Day 18](#/day/p1-d18); 함수 타입·제네릭 [Day 6](#/day/p2-d06); List [Day 11](#/day/p2-d11); 클래스·DateTime [Day 12](#/day/p2-d12); override [Day 13](#/day/p2-d13)
- 시작 상태: [Day 13](#/day/p2-d13)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`
  - `C:\dev\streamer-hub\client\`: `.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`
  - `C:\dev\streamer-hub\client\public\`: `favicon.svg`
  - `C:\dev\streamer-hub\client\public\data\`: `streamers.json`, `schedules.json`
  - `C:\dev\streamer-hub\client\src\`: `main.ts`, `style.css`, `types.ts`, `api.ts`, `ui.ts`
  - `C:\dev\cs-practice\`: `HubConsole.csproj`, `Program.cs`, `bin\`, `obj\`, `Streamer.cs`, `Schedule.cs`, `StreamerCard.cs`, `Users.cs`, `Notifiers.cs`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0), .NET 10 SDK(`dotnet --version` → `10.0.`으로 시작), VS Code C# 확장(`ms-dotnettools.csharp`)
  - 실행 중이어야 할 것: 없음
- 오늘 만들/바꿀 파일:
  - 바꿈 `C:\dev\cs-practice\Program.cs` — LINQ 질의 여러 개 (없음(연습))
  - 바꿈 `C:\dev\cs-practice\Streamer.cs` — 식 본문 프로퍼티 `Label` 추가 (없음(연습))
- 끝 상태 확인: `dotnet run` → 이름순 목록, chzzk만, 시작 시각 순 다가오는 일정 3개, `page=2` 결과가 출력된다.
- 과제:
  1) 이름에 "곰"이 들어간 스트리머 (쉬움) → `streamers.Where(s => s.Name.Contains("곰")).ToList()`
  2) 시작 시각 순서로 3개 (쉬움) → `.OrderBy(x => x.StartsAt).Take(3)`
  3) `page`, `pageSize`로 쪽 나누기 (보통) → `.Skip((page - 1) * pageSize).Take(pageSize)` (Day 30 미리보기)
- 용어(사전 담당): 람다 식, LINQ, 식 본문 멤버
- 자주 막히는 곳 후보: `First()`에 결과가 없으면 `InvalidOperationException: Sequence contains no elements` → `FirstOrDefault()` + null 검사 / `Console.WriteLine(query)`가 `System.Linq.…` 같은 타입 이름을 출력 → `ToList()`·`foreach` / 람다 매개변수 이름이 바깥 변수와 겹침 → `error CS0136` / `OrderBy` 뒤에 또 `OrderBy` → 앞 정렬이 사라짐(`ThenBy`)
- 레퍼런스 대응: 연습 폴더(레퍼런스 없음). 개념 대응: 레퍼런스 `Services/PostService.cs` `ListAsync`(OrderByDescending·Skip·Take·Select), `StreamerEndpoints.GetAll`(Where·OrderBy), `Services/ScheduleQuery.cs`, `Dtos/*.cs`의 식 본문 `From`.

## Day 15 — 예외와 async (100분)

- 목표: 예외: `throw new InvalidOperationException("…")`, `try`/`catch (FormatException)`/`finally`, 잡지 않은 예외의 `Unhandled exception.` + 스택 추적 읽기(맨 위 줄·파일·줄 번호). `TryParse`(Day 11)와 예외 중 무엇을 쓸지. `using var x = …;` 선언으로 `IDisposable` 정리 보장(finally의 줄임). `Task`/`Task<T>` = C#의 Promise(Day 8 표), `async Task<List<Streamer>> LoadStreamersAsync()` + `await Task.Delay(1000)`로 "가짜 DB 불러오기", `Task.WhenAll` = `Promise.all`, 이름 끝의 `Async` 규칙, 서버가 기다리는 동안 다른 요청을 받을 수 있어 비동기를 쓴다는 이유(Day 21 `ToListAsync` 예고). `async void`를 쓰지 않는다.
- 이미 배운 것: `try`/`catch` [P1 Day 25](#/day/p1-d25); Promise·async/await·Promise.all [Day 8](#/day/p2-d08); IDisposable(인터페이스) [Day 13](#/day/p2-d13); 메서드·클래스 [Day 11](#/day/p2-d11)·[Day 12](#/day/p2-d12); LINQ [Day 14](#/day/p2-d14)
- 시작 상태: [Day 14](#/day/p2-d14)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`
  - `C:\dev\streamer-hub\client\`: `.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`
  - `C:\dev\streamer-hub\client\public\`: `favicon.svg`
  - `C:\dev\streamer-hub\client\public\data\`: `streamers.json`, `schedules.json`
  - `C:\dev\streamer-hub\client\src\`: `main.ts`, `style.css`, `types.ts`, `api.ts`, `ui.ts`
  - `C:\dev\cs-practice\`: `HubConsole.csproj`, `Program.cs`, `bin\`, `obj\`, `Streamer.cs`, `Schedule.cs`, `StreamerCard.cs`, `Users.cs`, `Notifiers.cs`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0), .NET 10 SDK(`dotnet --version` → `10.0.`으로 시작), VS Code C# 확장(`ms-dotnettools.csharp`)
  - 실행 중이어야 할 것: 없음
- 오늘 만들/바꿀 파일:
  - 새로 `C:\dev\cs-practice\StreamerStore.cs` — `LoadStreamersAsync`·`FindAsync`(없으면 예외) (레퍼런스 Endpoints의 `async Task<…>` 모양)
  - 바꿈 `C:\dev\cs-practice\Program.cs` — await·Task.WhenAll·try/catch/finally·using 실험 (없음(연습))
- 끝 상태 확인: `dotnet run` → "불러오는 중..." 뒤 1초 후 목록, 없는 id에서 `catch`가 출력한 한국어 문장, `finally`의 "정리했어요"가 보인다.
- 과제:
  1) `int.Parse("abc")`의 예외를 잡아 문장 출력, TryParse 버전과 비교 (쉬움) → `catch (FormatException)`
  2) 1초짜리 작업 두 개를 차례로 vs `Task.WhenAll`로 시간 비교 (보통) → 약 2초 vs 약 1초(`Stopwatch` 또는 `DateTime.UtcNow` 차이)
  3) `finally`가 예외가 나도 실행되는지 확인 (쉬움) → 출력 순서
- 용어(사전 담당): 예외, 스택 추적, Task, using 선언
- 자주 막히는 곳 후보: `error CS4032/CS4033: The 'await' operator can only be used within an async method.` / `warning CS4014: Because this call is not awaited, …`(await 빠짐) / `catch (Exception)`로 모든 예외를 삼켜 원인을 못 봄 / `async void` 메서드의 예외가 사라짐 → `async Task` / 스택 추적이 길어 겁먹음 → 맨 위 `—>` 줄과 내 파일 이름 줄만
- 레퍼런스 대응: 연습 폴더(C# 연습 마지막 날, 레퍼런스 없음). 개념 대응: 레퍼런스 Endpoints의 `async Task<…>`·`await db.SaveChangesAsync()`, `SeedData`의 `throw new InvalidOperationException`·`using var scope`, `TestDb`의 `IDisposable`.

## Day 16 — HTTP와 REST (90분)

- 목표: HTTP 요청(시작줄 `GET /data/videos.json HTTP/1.1` · 헤더 · 빈 줄 · 본문)과 응답(상태 줄 · 헤더 · 본문)을 `text` 그림으로. 메서드 GET/POST/PUT/DELETE, 상태 코드 묶음(2xx·4xx·5xx)과 이 프로젝트에서 쓸 200·201·204·400·401·403·404·429·500, 헤더 `Content-Type: application/json`·`Location`·`Set-Cookie`(Day 25 예고), HTTPS = HTTP + 암호화. REST: 자원은 명사 주소(`/api/streamers/3`), 할 일은 메서드. README에 스트리머 허브 API 설계 표(메서드·주소·누가·응답)를 쓴다(레퍼런스 README "API 한눈에 보기"의 초안: 스트리머·일정·게시판·공지·가입/로그인·`/api/me`). VS Code 확장 **REST Client**(`humao.rest-client`) 설치 → `C:\dev\http-practice\practice.http`에 `@host` 변수와 `###` 구분으로 내 P1 사이트(GitHub Pages)의 `data/videos.json` GET(200·헤더·JSON), 없는 주소(404) 요청을 보내고 응답 창을 읽는다. `curl.exe -i <주소>` 대안(5.1의 `curl`은 별칭이라 `curl.exe`).
- 이미 배운 것: URL·서버 [P1 Day 1](#/day/p1-d01); JSON·`fetch`·`response.status` [P1 Day 25](#/day/p1-d25); GitHub Pages 주소 [P1 Day 14](#/day/p1-d14); 요청·응답·API·Network 탭 [Day 1](#/day/p2-d01); README [Day 1](#/day/p2-d01)
- 시작 상태: [Day 15](#/day/p2-d15)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`
  - `C:\dev\streamer-hub\client\`: `.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`
  - `C:\dev\streamer-hub\client\public\`: `favicon.svg`
  - `C:\dev\streamer-hub\client\public\data\`: `streamers.json`, `schedules.json`
  - `C:\dev\streamer-hub\client\src\`: `main.ts`, `style.css`, `types.ts`, `api.ts`, `ui.ts`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0), .NET 10 SDK(`dotnet --version` → `10.0.`으로 시작), VS Code C# 확장(`ms-dotnettools.csharp`)
  - 실행 중이어야 할 것: 없음
- 오늘 만들/바꿀 파일:
  - 새로 `C:\dev\http-practice\practice.http` — P1 사이트 요청 3개(`@host`, `###`) (레퍼런스 `server/StreamerHub.Api/StreamerHub.Api.http`와 같은 문법)
  - 바꿈 `C:\dev\streamer-hub\README.md` — "API 설계" 표 초안 (레퍼런스 `README.md` "API 한눈에 보기")
- 끝 상태 확인: REST Client 응답 창에 `HTTP/1.1 200 OK`, `content-type: application/json…`, JSON 본문이 보이고, 없는 주소는 `404 Not Found`. README에 API 표가 있다.
- 과제:
  1) 팬 게시판 API를 REST로 설계(목록·상세·작성·수정·삭제) (보통) → `GET /api/posts?page=`, `GET /api/posts/{id}`, `POST /api/posts`, `PUT`·`DELETE /api/posts/{id}`(레퍼런스 README 표)
  2) 상황 → 상태 코드 맞히기 (쉬움) → 로그인 안 하고 글쓰기 401, 남의 글 수정 403, 없는 글 404, 새 글 201, 내용 없는 성공 204, 너무 많은 요청 429
  3) `curl.exe -i`로 같은 요청 보내기 (쉬움) → 첫 줄 `HTTP/1.1 200 OK`(또는 `HTTP/2 200`)와 헤더
- 용어(사전 담당): HTTP, HTTPS, HTTP 메서드, 상태 코드, HTTP 헤더, HTTP 본문, Content-Type, REST, 엔드포인트, .http 파일
- 자주 막히는 곳 후보: `Send Request` 글자가 안 보임 → 확장 설치, 파일 확장자 `.http`, 오른쪽 아래 언어 모드 `HTTP` / `###` 없이 요청 두 개가 붙어 하나로 보내짐 / 헤더와 본문 사이 빈 줄 규칙 / PowerShell의 `curl`은 `Invoke-WebRequest` 별칭 → `curl.exe` / GitHub Pages 주소의 저장소 이름·대소문자 / 인터넷이 없을 때 → P1 사이트를 Live Preview로 열고 그 주소로
- 레퍼런스 대응: 중간 단계 — 레퍼런스와 다름: README의 API 표는 초안이에요(최종은 레퍼런스 README "API 한눈에 보기"). `practice.http`는 연습 파일이고, 프로젝트의 `.http` 파일은 Day 17에 만들어요.

## Day 17 — 첫 웹 API (110분)

- 목표: ASP.NET Core = C#으로 웹 서버를 만드는 틀, Minimal API = `app.MapGet(주소, 함수)` 몇 줄로 엔드포인트를 만드는 방식. `cd C:\dev\streamer-hub` → `mkdir server` → `cd server` → `dotnet new sln -n StreamerHub`(→ `StreamerHub.slnx`, .NET 10 기본 형식) → `dotnet new web -n StreamerHub.Api` → `dotnet sln add StreamerHub.Api`. `Program.cs` 구조(builder → `Build()` → `Map…` → `Run()`), `StreamerHub.Api.csproj`의 `Microsoft.NET.Sdk.Web`. `Properties\launchSettings.json`: 템플릿의 무작위 포트를 **`http://localhost:5250`** 으로, `launchBrowser: false`, `https` 프로필은 지운다(이유: HTTPS 개발 인증서 — Day 34에서 다룸, 오늘은 http만). `cd StreamerHub.Api` → `dotnet run` → `Now listening on: http://localhost:5250` → 브라우저. `app.MapGet("/", () => "스트리머 허브 API예요")`, `app.MapGet("/api/streamers", () => new List<string> { "달빛곰", "픽셀토끼", "노을고양이" })` → JSON 배열(직렬화). `dotnet watch`로 저장하면 다시 적용, `Ctrl + C`로 끄기. `StreamerHub.Api.http`(`@host = http://localhost:5250`) 만들기. 루트 `.gitignore`에 `bin/`, `obj/` → `git status`로 확인 후 커밋.
- 이미 배운 것: HTTP·REST·`.http` 파일·REST Client [Day 16](#/day/p2-d16); 포트·localhost [Day 7](#/day/p2-d07); 람다 식 [Day 14](#/day/p2-d14); 최상위 문장·`dotnet run` [Day 9](#/day/p2-d09); List [Day 11](#/day/p2-d11); 커밋 [Day 2](#/day/p2-d02)
- 시작 상태: [Day 16](#/day/p2-d16)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`
  - `C:\dev\streamer-hub\client\`: `.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`
  - `C:\dev\streamer-hub\client\public\`: `favicon.svg`
  - `C:\dev\streamer-hub\client\public\data\`: `streamers.json`, `schedules.json`
  - `C:\dev\streamer-hub\client\src\`: `main.ts`, `style.css`, `types.ts`, `api.ts`, `ui.ts`
  - `C:\dev\http-practice\`: `practice.http`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0), .NET 10 SDK(`dotnet --version` → `10.0.`으로 시작), VS Code C# 확장(`ms-dotnettools.csharp`), VS Code REST Client 확장(`humao.rest-client`)
  - 실행 중이어야 할 것: 없음(오늘 처음 켬). 끝에는 서버를 꺼도 돼요
- 오늘 만들/바꿀 파일:
  - 새로 `C:\dev\streamer-hub\.gitignore` — `bin/`, `obj/` (레퍼런스 `.gitignore`(Day 20·38에 추가))
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.slnx` — Api 프로젝트 하나 (레퍼런스 `server/StreamerHub.slnx`(Day 35에 Tests 추가))
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Api\StreamerHub.Api.csproj` — 템플릿 그대로 (레퍼런스 csproj(Day 20·25·26에 추가))
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Api\Program.cs` — MapGet `/`·`/api/streamers`(이름 3개) (레퍼런스 `Program.cs`(중간 단계))
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Api\Properties\launchSettings.json` — http 프로필만, 5250, launchBrowser false (레퍼런스 `Properties/launchSettings.json`(같음))
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Api\appsettings.json` — 템플릿 그대로 (레퍼런스 `appsettings.json`(Day 20·24·34에 추가))
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Api\appsettings.Development.json` — 템플릿 그대로 (레퍼런스 `appsettings.Development.json`(Day 21에 추가))
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Api\StreamerHub.Api.http` — `@host` + GET `/`, GET `/api/streamers` (레퍼런스 `StreamerHub.Api.http`(Day마다 요청 추가))
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Api\bin\`, `obj\` — 빌드 결과(커밋 안 함) (—)
- 끝 상태 확인: 브라우저 `http://localhost:5250/api/streamers`에 `["달빛곰","픽셀토끼","노을고양이"]`, `.http` 요청은 `200 OK`. `dotnet watch` 중 문자열을 고쳐 저장하면 다시 요청했을 때 바뀐 값. `git status`에 `bin`·`obj`가 없다.
- 과제:
  1) 포트를 5251로 바꿔 켜 보고 주소 확인 뒤 5250으로 되돌리기 (쉬움) → `applicationUrl`만 바꾸면 됨, 끝 상태는 5250
  2) `/api/streamers`에 한 명 더 넣었다가 빼기 (쉬움) → 저장 → dotnet watch 반영 → 다시 3명(Day 18에서 클래스로 바뀜)
  3) `.http`로 없는 주소 `GET {{host}}/api/nope` → `404` 확인 (쉬움) → 본문이 비어 있음(Day 24에서 ProblemDetails로 채움)
- 용어(사전 담당): ASP.NET Core, Minimal API, 라우트, 솔루션, launchSettings.json, dotnet watch, 직렬화
- 자주 막히는 곳 후보: **포트 충돌**: `Failed to bind to address http://127.0.0.1:5250: address already in use.`(작성자 원문 확인) → 다른 터미널의 `dotnet watch`를 `Ctrl + C`, 찾기 `Get-NetTCPConnection -LocalPort 5250` / **첫 실행 방화벽 창**("Windows 보안 경고" — dotnet.exe) → localhost만 쓰므로 허용하지 않아도 동작, 허용하려면 개인 네트워크만(방화벽 끄지 않기, 문구는 버전에 따라 다를 수 있음) / **HTTPS 경고**: https 프로필로 실행했거나 브라우저에 "연결이 비공개로 설정되어 있지 않습니다" → 오늘은 http 프로필만 쓴다. 해결 명령 `dotnet dev-certs https --trust`는 "내 PC가 개발용 HTTPS 인증서를 믿게 하는 명령"이라고 한 줄만 적고, 용어 `개발 인증서`의 정의(굵게·사전 링크)와 실습은 Day 34에서 한다 / `Couldn't find a project to run.` → `StreamerHub.Api` 폴더에서 실행 / dotnet watch가 다시 시작할지 묻는 문장(rude edit) → 작성자가 원문 확인 후 `y`/`a` 안내 / 서버를 끄지 않고 창을 닫음 → 다음 실행에서 포트 충돌
- 레퍼런스 대응: 끝: `Properties/launchSettings.json`은 레퍼런스와 같아요. 중간 단계 — `Program.cs`(Day 18~38), `.gitignore`(Day 20·38), `StreamerHub.slnx`(Day 35), csproj(Day 20·25·26), `appsettings*.json`(Day 20·21·24·34), `StreamerHub.Api.http`(Day 18~34). `MapGet("/")`은 Day 38에 지워요(레퍼런스에 없음).

## Day 18 — 메모리 CRUD API (110분)

- 목표: CRUD ↔ POST/GET/PUT/DELETE. `Entities\Streamer.cs`(namespace `StreamerHub.Api.Entities`, 프로퍼티는 레퍼런스와 같은 7개, 특성은 아직 없음). `Program.cs`에 메모리 저장소 `var streamers = new List<Streamer> { … 3명 … };`과 `nextId`. GET 전체, GET `/api/streamers/{id:int}`(라우트 매개변수 + `:int` 제약 → `abc`는 404), POST(본문 JSON → `Streamer` 모델 바인딩, `CreatedAt = DateTime.UtcNow`는 서버가 정함, `TypedResults.Created($"/api/streamers/{streamer.Id}", streamer)` → 201 + `Location`), PUT(204/404), DELETE(204/404). 핸들러는 이름 있는 로컬 함수로 쓰고 반환 타입 `Results<Ok<Streamer>, NotFound>`를 적는다(여러 결과를 돌려줄 때 필요한 이유). 서버를 다시 켜면 POST한 데이터가 사라지는 것 확인 → Day 19 DB의 필요성. `.http`에 CRUD 요청.
- 이미 배운 것: Minimal API·라우트·dotnet watch·`.http` [Day 17](#/day/p2-d17); 상태 코드·Location 헤더 [Day 16](#/day/p2-d16); 클래스·프로퍼티·네임스페이스 [Day 12](#/day/p2-d12); LINQ `FirstOrDefault` [Day 14](#/day/p2-d14); nullable [Day 11](#/day/p2-d11); 쿼리 문자열(URL 파라미터) [P1 Day 27](#/day/p1-d27)
- 시작 상태: [Day 17](#/day/p2-d17)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`, `.gitignore`
  - `C:\dev\streamer-hub\client\`: `.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`
  - `C:\dev\streamer-hub\client\public\`: `favicon.svg`
  - `C:\dev\streamer-hub\client\public\data\`: `streamers.json`, `schedules.json`
  - `C:\dev\streamer-hub\client\src\`: `main.ts`, `style.css`, `types.ts`, `api.ts`, `ui.ts`
  - `C:\dev\streamer-hub\server\`: `StreamerHub.slnx`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\`: `StreamerHub.Api.csproj`, `Program.cs`, `appsettings.json`, `appsettings.Development.json`, `StreamerHub.Api.http`, `bin\`, `obj\`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Properties\`: `launchSettings.json`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0), .NET 10 SDK(`dotnet --version` → `10.0.`으로 시작), VS Code C# 확장(`ms-dotnettools.csharp`), VS Code REST Client 확장(`humao.rest-client`)
  - 실행 중이어야 할 것: 서버 `dotnet watch`(꺼져 있으면 1단계에서 켬)
- 오늘 만들/바꿀 파일:
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Api\Entities\Streamer.cs` — class Streamer(Id·Name·Platform·ChannelUrl·Bio·AvatarUrl?·CreatedAt), 특성 없음 (레퍼런스 `Entities/Streamer.cs`(Day 20 [MaxLength], Day 22 Schedules))
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Program.cs` — 메모리 List + CRUD 5개 + `?q=` 검색(과제) (레퍼런스 `Endpoints/StreamerEndpoints.cs`의 GetAll·GetById·Create·Update·Delete)
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\StreamerHub.Api.http` — CRUD 요청 5개 + 검색 (레퍼런스 `.http`의 스트리머 요청)
- 끝 상태 확인: `.http`: POST → `201 Created` + `Location: /api/streamers/4`, GET 4번 200, PUT 204, DELETE 204, 다시 GET 404, `/api/streamers/abc` 404. 서버를 다시 켜면 4번이 없다.
- 과제:
  1) `GET /api/streamers?q=곰` 이름 검색 (보통) → `string? q` 매개변수 + `Where(s => s.Name.ToLower().Contains(keyword))`, 없으면 전체(레퍼런스 GetAll과 같은 규칙)
  2) 없는 id에 PUT → 404 확인 (쉬움) → `FirstOrDefault`가 null
  3) POST 본문에 `createdAt`을 보내도 서버 시각으로 덮어쓰는지 (쉬움) → 서버가 `DateTime.UtcNow`로 정함
- 용어(사전 담당): CRUD, 라우트 매개변수, 라우트 제약, TypedResults, 모델 바인딩
- 자주 막히는 곳 후보: POST에 `Content-Type: application/json` 빠짐 → 415(이 시점. Day 38 이후에는 404 — 레퍼런스 README 참고, 작성자 확인) / 람다가 여러 결과 타입을 돌려줌 → `error CS1678`/`CS8917 The delegate type could not be inferred.` 류(작성자 원문 확인) → `Results<…>` 반환 타입 / `{id:int}` 빠뜨림 → 문자열 id 요청에서 400 / JSON 칸 이름은 camelCase(`name`)로 오고 가는 것 / dotnet watch가 다시 시작하면 메모리 데이터 초기화(정상)
- 레퍼런스 대응: 중간 단계 — 레퍼런스와 다름: 데이터는 메모리 `List`예요(Day 21에 DB로). 엔드포인트는 `Program.cs`에 있어요(Day 23에 `Endpoints/StreamerEndpoints.cs`로 옮김). 이름·상태 코드는 레퍼런스 `StreamerEndpoints.cs`와 같아요.

## Day 19 — DB와 SQL 기초 (100분)

- 목표: 서버를 껐다 켜도 남아야 하는 데이터 → DB. 관계형 DB의 테이블·행·열·기본 키, 자료형(`INTEGER`, `TEXT`), SQLite = 파일 하나짜리 DB(서버 프로그램이 따로 없음). **sqlite3 명령줄 도구**를 설치한다 — 설치 방법(winget ID 또는 sqlite.org 배포 파일과 PATH)은 external-facts에 없으므로 Day 19 작성자가 확인해 external-facts에 추가하고 인용한다. `sqlite3 --version`. `cd C:\dev\sql-practice` → `sqlite3 practice.db` → `CREATE TABLE Streamers (Id INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT NOT NULL, Platform TEXT NOT NULL, Bio TEXT NOT NULL);` → `INSERT` 3줄 → `SELECT * FROM Streamers;`·`WHERE`·`ORDER BY`·`LIKE '%곰%'` → `UPDATE … WHERE Id = 1;` → `DELETE … WHERE Id = 3;`(WHERE를 빼면 전부 — `:::warn`) → `.tables`·`.schema`·`.headers on`·`.quit`. 같은 SQL을 `practice.sql`에 저장하고 `.read practice.sql`로 다시 실행. LINQ(Day 14)와 SQL 대응 표(Where↔WHERE, OrderBy↔ORDER BY).
- 이미 배운 것: 표(행·열) [P1 Day 8](#/day/p1-d08); CRUD ↔ HTTP 메서드 [Day 18](#/day/p2-d18); LINQ [Day 14](#/day/p2-d14); 터미널·PATH [Day 2](#/day/p2-d02)·[Day 3](#/day/p2-d03)
- 시작 상태: [Day 18](#/day/p2-d18)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`, `.gitignore`
  - `C:\dev\streamer-hub\client\`: `.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`
  - `C:\dev\streamer-hub\client\public\`: `favicon.svg`
  - `C:\dev\streamer-hub\client\public\data\`: `streamers.json`, `schedules.json`
  - `C:\dev\streamer-hub\client\src\`: `main.ts`, `style.css`, `types.ts`, `api.ts`, `ui.ts`
  - `C:\dev\streamer-hub\server\`: `StreamerHub.slnx`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\`: `StreamerHub.Api.csproj`, `Program.cs`, `appsettings.json`, `appsettings.Development.json`, `StreamerHub.Api.http`, `bin\`, `obj\`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Entities\`: `Streamer.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Properties\`: `launchSettings.json`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0), .NET 10 SDK(`dotnet --version` → `10.0.`으로 시작), VS Code C# 확장(`ms-dotnettools.csharp`), VS Code REST Client 확장(`humao.rest-client`)
  - 실행 중이어야 할 것: 없음
- 오늘 만들/바꿀 파일:
  - 새로 `C:\dev\sql-practice\practice.sql` — CREATE·INSERT·SELECT·UPDATE·DELETE 문 (레퍼런스 `Migrations/*_InitialCreate.cs`의 CreateTable에 해당하는 SQL)
  - 새로 `C:\dev\sql-practice\practice.db` — sqlite3가 만든 DB 파일 (—)
- 끝 상태 확인: sqlite3에서 `SELECT * FROM Streamers;`가 3행(헤더 포함)을 보여 주고, `.schema`가 CREATE TABLE 문을 보여 준다.
- 과제:
  1) 플랫폼이 chzzk인 스트리머만 (쉬움) → `SELECT * FROM Streamers WHERE Platform = 'chzzk';`
  2) 이름순 2명만 (쉬움) → `SELECT Name FROM Streamers ORDER BY Name LIMIT 2;`
  3) 방송 일정 테이블 설계(어느 스트리머의 일정인지 칸 포함) (보통) → `CREATE TABLE Schedules (Id INTEGER PRIMARY KEY AUTOINCREMENT, StreamerId INTEGER NOT NULL, Title TEXT NOT NULL, StartsAt TEXT NOT NULL, DurationMinutes INTEGER NOT NULL);` (외래 키는 Day 22)
- 용어(사전 담당): SQL, SQLite, 테이블, 행, 열, 기본 키, 쿼리
- 자주 막히는 곳 후보: `sqlite3` 인식 안 됨 → PATH·새 터미널 / `...>` 이어 쓰기 프롬프트 → `;` 빠짐 / 문자열은 작은따옴표 `'chzzk'` / `Parse error: near "…": syntax error`(문구는 버전에 따라 다름, 작성자 원문 확인) / WHERE 없는 UPDATE·DELETE로 전부 바뀜 → 다시 INSERT(연습 DB라 괜찮음) / 한글이 깨져 보임(콘솔 인코딩) → 작성자 확인 / `.db`를 메모장으로 열면 이상한 글자(이진 파일)
- 레퍼런스 대응: 연습 폴더(레퍼런스 없음). 개념 대응: 레퍼런스 `Migrations/*_InitialCreate.cs`(CreateTable), Day 21부터 터미널에 보이는 EF Core의 SQL 로그.

## Day 20 — EF Core 연결 (120분)

- 목표: ORM = C# 클래스 ↔ DB 테이블 번역기, EF Core. NuGet 패키지: `cd C:\dev\streamer-hub\server\StreamerHub.Api` → `dotnet add package Microsoft.EntityFrameworkCore.Sqlite --version 10.0.14`, `dotnet add package Microsoft.EntityFrameworkCore.Design --version 10.0.14`(csproj 변화 확인). 전역 도구 `dotnet tool install --global dotnet-ef --version 10.0.14` → `dotnet-ef --version`. `Entities\Streamer.cs`에 `using System.ComponentModel.DataAnnotations;` + `[MaxLength(50)]` 등(레퍼런스와 같은 값, 특성 문법은 "꺾쇠 안의 이름표"로 짧게 — 정식 개념은 Day 23)과 주석. `Data\AppDbContext.cs`: `public class AppDbContext : DbContext`, 생성자 `(DbContextOptions<AppDbContext> options) : base(options)`, `public DbSet<Streamer> Streamers => Set<Streamer>();`. `appsettings.json`에 `"ConnectionStrings": { "Default": "Data Source=streamerhub.db" }`, `Program.cs`에 `builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite(builder.Configuration.GetConnectionString("Default")));`(한 줄씩 뜻 설명, DI 자세히는 Day 23). 서버를 끄고 `dotnet ef migrations add InitialCreate` → `Migrations\` 파일의 `Up`/`Down`·`CreateTable` 읽기 → `dotnet ef database update` → `streamerhub.db`가 `StreamerHub.Api` 폴더에 생김(상대 경로는 **실행 위치** 기준) → `sqlite3 streamerhub.db` `.tables`·`.schema Streamers`. 루트 `.gitignore`에 `*.db`, `*.db-shm`, `*.db-wal`. 오늘 엔드포인트는 아직 메모리 목록 그대로(Day 21에 DB로).
- 이미 배운 것: SQL·테이블·기본 키·sqlite3 [Day 19](#/day/p2-d19); 클래스·프로퍼티·nullable [Day 11](#/day/p2-d11)·[Day 12](#/day/p2-d12); 상속·base 생성자 [Day 13](#/day/p2-d13); 식 본문 멤버·람다 [Day 14](#/day/p2-d14); 메모리 CRUD [Day 18](#/day/p2-d18); `.gitignore` [Day 17](#/day/p2-d17)
- 시작 상태: [Day 19](#/day/p2-d19)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`, `.gitignore`
  - `C:\dev\streamer-hub\client\`: `.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`
  - `C:\dev\streamer-hub\client\public\`: `favicon.svg`
  - `C:\dev\streamer-hub\client\public\data\`: `streamers.json`, `schedules.json`
  - `C:\dev\streamer-hub\client\src\`: `main.ts`, `style.css`, `types.ts`, `api.ts`, `ui.ts`
  - `C:\dev\streamer-hub\server\`: `StreamerHub.slnx`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\`: `StreamerHub.Api.csproj`, `Program.cs`, `appsettings.json`, `appsettings.Development.json`, `StreamerHub.Api.http`, `bin\`, `obj\`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Entities\`: `Streamer.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Properties\`: `launchSettings.json`
  - `C:\dev\sql-practice\`: `practice.sql`, `practice.db`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0), .NET 10 SDK(`dotnet --version` → `10.0.`으로 시작), VS Code C# 확장(`ms-dotnettools.csharp`), VS Code REST Client 확장(`humao.rest-client`), sqlite3(`sqlite3 --version`)
  - 실행 중이어야 할 것: 서버는 마이그레이션 동안 꺼 둬요
- 오늘 만들/바꿀 파일:
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\StreamerHub.Api.csproj` — PackageReference 2개(Sqlite, Design) 10.0.14 (레퍼런스 csproj의 같은 줄)
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Entities\Streamer.cs` — `[MaxLength]`·주석 추가 (레퍼런스 `Entities/Streamer.cs`(Day 22에 Schedules))
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Api\Data\AppDbContext.cs` — DbContext + Streamers DbSet (레퍼런스 `Data/AppDbContext.cs`(Day 22·25·29·30·33))
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\appsettings.json` — `ConnectionStrings:Default` (레퍼런스 `appsettings.json`)
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Program.cs` — `AddDbContext` 한 줄 (레퍼런스 `Program.cs` 1부 첫 블록)
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Api\Migrations\<시각>_InitialCreate.cs`, `<시각>_InitialCreate.Designer.cs`, `AppDbContextModelSnapshot.cs` — `dotnet ef migrations add InitialCreate` 결과(시각은 사람마다 다름) (레퍼런스 `Migrations/`(레퍼런스는 최종 모습 하나 — README 설명))
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Api\streamerhub.db` — `database update`가 만든 DB(커밋 안 함) (—)
  - 바꿈 `C:\dev\streamer-hub\.gitignore` — `*.db`, `*.db-shm`, `*.db-wal` (레퍼런스 `.gitignore`)
- 끝 상태 확인: `dotnet ef database update` 끝에 `Done.`, sqlite3 `.tables` → `Streamers  __EFMigrationsHistory`, `.schema Streamers`에 `"Name" TEXT NOT NULL`. `git status`에 `streamerhub.db`가 없다.
- 과제:
  1) 마이그레이션 파일의 `Up` 메서드에서 열 이름과 `nullable` 찾아 README에 적기 (쉬움) → `AvatarUrl`만 `nullable: true`
  2) `dotnet ef migrations list` 실행 (쉬움) → `<시각>_InitialCreate` 한 줄
  3) README 개발 환경 절에 .NET SDK·dotnet-ef 버전 기록 (쉬움) → `dotnet --version`, `dotnet-ef --version` 결과
- 용어(사전 담당): ORM, EF Core, NuGet, 엔티티, DbContext, DbSet, 연결 문자열, 마이그레이션, dotnet-ef
- 자주 막히는 곳 후보: `dotnet ef`가 `Could not execute because the specified command or file was not found.` → 도구 설치·새 터미널, `%USERPROFILE%\.dotnet\tools` / `Your startup project 'StreamerHub.Api' doesn't reference Microsoft.EntityFrameworkCore.Design.` / `Build failed.` → `dotnet build`로 먼저 오류 보기 / dotnet watch가 켜진 채 마이그레이션 → 파일 잠금 오류 → 서버 끄기 / **SQLite 파일 위치**: 다른 폴더에서 실행해 `streamerhub.db`가 엉뚱한 곳에 생김 → 항상 `StreamerHub.Api` 폴더에서 / 패키지 버전이 서로 달라 `NU1605`(downgrade) 경고 → 모두 10.0.14 / 사용자 폴더 이름이 한글일 때 도구 경로 문제 여부 → 작성자 확인(미확인)
- 레퍼런스 대응: 중간 단계 — 엔드포인트는 아직 메모리 목록이에요(Day 21). `Entities/Streamer.cs`(Day 22), `AppDbContext.cs`(Day 22·25·29·30·33), csproj(Day 25·26), `appsettings.json`(Day 24·34). `Migrations`는 Day마다 파일이 하나씩 생겨서 레퍼런스(`InitialCreate` 하나)와 이름이 달라요 — 레퍼런스 README가 설명하는 정상 차이.

## Day 21 — DB CRUD (110분)

- 목표: 메모리 `List`와 `nextId`를 지우고 핸들러가 `AppDbContext db` 매개변수를 받게 한다(ASP.NET Core가 넣어 준다 — 의존성 주입은 Day 23에서 정식으로). 비동기 쿼리 `ToListAsync`·`FindAsync`·`FirstOrDefaultAsync`, `db.Streamers.Add` + `await db.SaveChangesAsync()`(저장하면 `Id`가 채워짐), 변경 추적(찾은 엔티티의 값을 바꾸고 SaveChanges → UPDATE), `Remove`. `?q=` 검색을 `IQueryable`로: `var query = db.Streamers.AsQueryable(); if (…) query = query.Where(…); await query.OrderBy(s => s.Name).ToListAsync();` — LINQ가 SQL로 바뀌어 DB에서 실행된다. `Data\SeedData.cs`: `public static class SeedData` + `InitializeAsync(IServiceProvider services)`(`using var scope = services.CreateScope();`의 이유 한 줄, `await db.Database.MigrateAsync();` — 이제 `database update`를 따로 안 해도 됨) + `AddSampleStreamersAsync`(이미 있으면 `AnyAsync`로 건너뜀, 3명). `Program.cs`에 `await SeedData.InitializeAsync(app.Services);`. `appsettings.Development.json`에 `"Microsoft.EntityFrameworkCore.Database.Command": "Information"` → 터미널에 `SELECT … FROM "Streamers"`·매개변수 `@p0` 로그가 보임.
- 이미 배운 것: EF Core·DbContext·마이그레이션·연결 문자열 [Day 20](#/day/p2-d20); SQL [Day 19](#/day/p2-d19); Task·async/await·using 선언 [Day 15](#/day/p2-d15); LINQ·람다 [Day 14](#/day/p2-d14); 메모리 CRUD·`?q=` [Day 18](#/day/p2-d18); static 클래스 [Day 12](#/day/p2-d12)
- 시작 상태: [Day 20](#/day/p2-d20)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`, `.gitignore`
  - `C:\dev\streamer-hub\client\`: `.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`
  - `C:\dev\streamer-hub\client\public\`: `favicon.svg`
  - `C:\dev\streamer-hub\client\public\data\`: `streamers.json`, `schedules.json`
  - `C:\dev\streamer-hub\client\src\`: `main.ts`, `style.css`, `types.ts`, `api.ts`, `ui.ts`
  - `C:\dev\streamer-hub\server\`: `StreamerHub.slnx`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\`: `StreamerHub.Api.csproj`, `Program.cs`, `appsettings.json`, `appsettings.Development.json`, `StreamerHub.Api.http`, `bin\`, `obj\`, `streamerhub.db`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Data\`: `AppDbContext.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Entities\`: `Streamer.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Migrations\`: `<시각>_InitialCreate.cs`, `<시각>_InitialCreate.Designer.cs`, `AppDbContextModelSnapshot.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Properties\`: `launchSettings.json`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0), .NET 10 SDK(`dotnet --version` → `10.0.`으로 시작), VS Code C# 확장(`ms-dotnettools.csharp`), VS Code REST Client 확장(`humao.rest-client`), sqlite3(`sqlite3 --version`), dotnet-ef 10.0.14(`dotnet-ef --version`)
  - 실행 중이어야 할 것: 서버 `dotnet watch`
- 오늘 만들/바꿀 파일:
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Program.cs` — CRUD를 DB 버전으로, `SeedData.InitializeAsync` 호출 (레퍼런스 `StreamerEndpoints.cs` 본문(Day 23에 옮김)·`Program.cs`의 시드 줄)
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Api\Data\SeedData.cs` — InitializeAsync(MigrateAsync) + AddSampleStreamersAsync(3명, 일정 없음) (레퍼런스 `Data/SeedData.cs`(Day 22 일정, Day 26 관리자))
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\appsettings.Development.json` — EF SQL 로그 한 줄 (레퍼런스 `appsettings.Development.json`(같음))
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\StreamerHub.Api.http` — `?q=곰` 요청 (레퍼런스 `.http`)
- 끝 상태 확인: 서버를 켜면 터미널에 SQL 로그, GET → 시드 3명. POST로 한 명 추가 → 서버를 껐다 켜도 남아 있다. `?q=곰` → 달빛곰 1명.
- 과제:
  1) PUT으로 소개를 바꾼 뒤 sqlite3에서 그 행 확인 (쉬움) → `SELECT Bio FROM Streamers WHERE Id = 1;`(서버 끈 뒤 또는 읽기만)
  2) 영어 이름 스트리머를 넣고 `?q=` 대소문자 무시 확인 (보통) → `ToLower()` 양쪽
  3) 시드가 두 번째 실행에서 건너뛰는 이유 설명 (쉬움) → `AnyAsync()`가 true
- 용어(사전 담당): 시드 데이터, IQueryable, 변경 추적
- 자주 막히는 곳 후보: `SQLite Error 1: 'no such table: Streamers'` → MigrateAsync 호출 확인, 다른 폴더의 db / `database is locked` → sqlite3 창을 `.quit` / `await` 빠짐 → `A second operation was started on this context instance …` / `'DbSet<Streamer>' does not contain a definition for 'ToListAsync'` → `using Microsoft.EntityFrameworkCore;` / 시드 데이터가 두 번 들어감(조건 빠짐)
- 레퍼런스 대응: 끝: `appsettings.Development.json`은 레퍼런스와 같아요. 중간 단계 — `Program.cs`(Day 22~38), `SeedData.cs`(Day 22 일정, Day 26 관리자). 쿼리 본문은 레퍼런스 `StreamerEndpoints.cs`의 GetAll·GetById·Create·Update·Delete와 같아요(GetById의 Include는 Day 22).

## Day 22 — 관계 설계 (110분)

- 목표: 1:N 관계 그림(Streamers ─< Schedules). `Entities\Schedule.cs`(Id·StreamerId 외래 키·`Streamer?` 탐색 속성·Title[MaxLength(100)]·StartsAt·DurationMinutes), `Streamer.Schedules = new List<Schedule>()`, `AppDbContext`에 `Schedules` DbSet → `dotnet ef migrations add AddSchedules` → `.schema Schedules`의 `FOREIGN KEY … ON DELETE CASCADE`(계단식 삭제). `SeedData`의 3명에 일정 4개(오늘 UTC 0시 기준 `AddDays`·`AddHours`, 레퍼런스와 같은 값). 이미 스트리머가 있으면 시드가 건너뛰므로 **서버를 끄고 `streamerhub.db*`를 지운 뒤** 다시 켠다(`:::warn` 개발 DB 초기화). GET `/api/streamers/{id}`에 `.Include(s => s.Schedules.Where(x => x.StartsAt >= now).OrderBy(x => x.StartsAt))`. 엔티티를 그대로 돌려주면 `System.Text.Json.JsonException: A possible object cycle was detected.` → 응답 전용 record(**DTO**): `Dtos\ScheduleDtos.cs`의 `ScheduleResponse`(+`StreamerName`, `From(Schedule)`), `Dtos\StreamerDtos.cs`의 `StreamerDetailResponse`(+`From`). GET `/api/schedules`(전체, `Include(s => s.Streamer)`, 시작 순 — 기간 필터는 Day 23). JSON 시각에 `Z`가 없는 것은 Day 29에서 고친다고 적어 둔다.
- 이미 배운 것: 테이블·기본 키 [Day 19](#/day/p2-d19); DbContext·마이그레이션 [Day 20](#/day/p2-d20); DB CRUD·시드·IQueryable [Day 21](#/day/p2-d21); record·위치 record·static [Day 12](#/day/p2-d12); LINQ Select·식 본문 [Day 14](#/day/p2-d14); DateTime [Day 12](#/day/p2-d12)
- 시작 상태: [Day 21](#/day/p2-d21)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`, `.gitignore`
  - `C:\dev\streamer-hub\client\`: `.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`
  - `C:\dev\streamer-hub\client\public\`: `favicon.svg`
  - `C:\dev\streamer-hub\client\public\data\`: `streamers.json`, `schedules.json`
  - `C:\dev\streamer-hub\client\src\`: `main.ts`, `style.css`, `types.ts`, `api.ts`, `ui.ts`
  - `C:\dev\streamer-hub\server\`: `StreamerHub.slnx`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\`: `StreamerHub.Api.csproj`, `Program.cs`, `appsettings.json`, `appsettings.Development.json`, `StreamerHub.Api.http`, `bin\`, `obj\`, `streamerhub.db`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Data\`: `AppDbContext.cs`, `SeedData.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Entities\`: `Streamer.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Migrations\`: `<시각>_InitialCreate.cs`, `<시각>_InitialCreate.Designer.cs`, `AppDbContextModelSnapshot.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Properties\`: `launchSettings.json`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0), .NET 10 SDK(`dotnet --version` → `10.0.`으로 시작), VS Code C# 확장(`ms-dotnettools.csharp`), VS Code REST Client 확장(`humao.rest-client`), sqlite3(`sqlite3 --version`), dotnet-ef 10.0.14(`dotnet-ef --version`)
  - 실행 중이어야 할 것: 서버 `dotnet watch`(db를 지울 때만 잠깐 끔)
- 오늘 만들/바꿀 파일:
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Api\Entities\Schedule.cs` — 외래 키·탐색 속성 (레퍼런스 `Entities/Schedule.cs`(같음))
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Entities\Streamer.cs` — `List<Schedule> Schedules` 추가 (레퍼런스 `Entities/Streamer.cs`(같음))
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Data\AppDbContext.cs` — Schedules DbSet (레퍼런스 `AppDbContext.cs`)
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Data\SeedData.cs` — 예시 일정 4개 (레퍼런스 `AddSampleStreamersAsync`(같음))
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Api\Migrations\<시각>_AddSchedules.cs`, `<시각>_AddSchedules.Designer.cs` — 마이그레이션 (레퍼런스 `Migrations/`)
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Migrations\AppDbContextModelSnapshot.cs` — 자동으로 바뀜 (레퍼런스 `Migrations/AppDbContextModelSnapshot.cs`)
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Api\Dtos\ScheduleDtos.cs` — `ScheduleResponse`만 (레퍼런스 `Dtos/ScheduleDtos.cs`(Day 23 ScheduleRequest))
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Api\Dtos\StreamerDtos.cs` — `StreamerDetailResponse`만 (레퍼런스 `Dtos/StreamerDtos.cs`(Day 23 Request·Response))
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Program.cs` — GetById → DTO, GET `/api/schedules` (레퍼런스 `StreamerEndpoints.GetById`, `ScheduleEndpoints`)
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\StreamerHub.Api.http` — 일정 요청 (레퍼런스 `.http`)
- 끝 상태 확인: `GET /api/streamers/1` → `schedules` 배열 2개(각각 `streamerName: "달빛곰"`), `GET /api/schedules` → 4개가 시작 순. 스트리머를 DELETE하면 그 일정도 사라진다.
- 과제:
  1) 스트리머 하나 DELETE 후 `/api/schedules`에서 그 일정이 없는지 (쉬움) → 계단식 삭제
  2) 상세에 지난 일정은 빼기 (보통) → filtered Include `Where(x => x.StartsAt >= now)`(레퍼런스 GetById와 같음)
  3) 순환 참조 오류 원문을 읽고 DTO로 고친 이유를 두 문장으로 (보통) → Streamer→Schedules→Streamer…가 끝없이 이어짐, 필요한 칸만 담은 record로 끊음
- 용어(사전 담당): 1:N 관계, 외래 키, 탐색 속성, Include, 계단식 삭제, 순환 참조, DTO
- 자주 막히는 곳 후보: 시드가 안 들어감(이미 스트리머가 있음) → 서버 끄고 `Remove-Item C:\dev\streamer-hub\server\StreamerHub.Api\streamerhub.db*`(`:::warn`) / 서버가 켜진 채 db 삭제 → `The process cannot access the file … because it is being used by another process.` / `JsonException: A possible object cycle was detected.` / Include 빠짐 → `schedule.Streamer`가 null → `NullReferenceException` / 마이그레이션 이름 오타·두 번 만듦 → `dotnet ef migrations remove`
- 레퍼런스 대응: 끝: `Entities/Schedule.cs`, `Entities/Streamer.cs`는 레퍼런스와 같아요. 중간 단계 — `Dtos/ScheduleDtos.cs`·`StreamerDtos.cs`(Day 23 요청 DTO, Day 34 [HttpUrl]), `SeedData.cs`(Day 26), `Program.cs`(Day 23에 엔드포인트를 파일로).

## Day 23 — 구조화 (120분)

- 목표: `Program.cs`가 길어진 문제 → 자원마다 파일. `Endpoints\StreamerEndpoints.cs`·`ScheduleEndpoints.cs`: `public static class` + 확장 메서드 `public static void MapStreamerEndpoints(this WebApplication app)` + `var group = app.MapGroup("/api/streamers");` + 이름 있는 `private static async Task<…>` 핸들러(GetAll·GetById·Create·Update·Delete). `Program.cs`는 `app.MapStreamerEndpoints(); app.MapScheduleEndpoints();`만 남는다. 요청 DTO: `StreamerRequest`(**`public record`** + `init` + `[Required]`·`[StringLength]`·`[AllowedValues("chzzk","youtube","soop","other")]`·`[Url]`, 한국어 `ErrorMessage`), `StreamerResponse.From`, `ScheduleRequest`(`[Range(1, int.MaxValue)]` StreamerId, `[Range(10, 1440)]` DurationMinutes). `builder.Services.AddValidation();` → 틀리면 핸들러까지 오지 않고 400 + `errors`. **internal이면 검증이 조용히 꺼지는 함정**(`:::warn`, external-facts 6절). 일정 POST/PUT/DELETE + 없는 스트리머면 `Problem("streamerId", "없는 스트리머예요.")`(ValidationProblem 도우미). `Services\ScheduleQuery.cs`: `[from, to)` 범위 규칙을 엔드포인트에서 떼어 낸 첫 서비스 계층(정적 메서드, `IQueryable` 그대로 받음 — 테스트하기 쉬움, Day 35), GET `/api/schedules?from=&to=`(생략하면 지금부터 7일, `to <= from`이면 400; UTC 검사는 Day 29). 의존성 주입: `AddDbContext`가 `AppDbContext`를 **Scoped**로 등록해서 핸들러 매개변수로 받을 수 있었다는 설명, 수명 Scoped/Singleton/Transient 표(직접 등록은 Day 30 `AddScoped<PostService>`, Day 33 `AddSingleton`).
- 이미 배운 것: `[MaxLength]` 특성 맛보기 [Day 20](#/day/p2-d20); DTO·응답 record [Day 22](#/day/p2-d22); record·init·static·네임스페이스 [Day 12](#/day/p2-d12); LINQ [Day 14](#/day/p2-d14); 상태 코드 400 [Day 16](#/day/p2-d16); DB CRUD [Day 21](#/day/p2-d21)
- 시작 상태: [Day 22](#/day/p2-d22)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`, `.gitignore`
  - `C:\dev\streamer-hub\client\`: `.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`
  - `C:\dev\streamer-hub\client\public\`: `favicon.svg`
  - `C:\dev\streamer-hub\client\public\data\`: `streamers.json`, `schedules.json`
  - `C:\dev\streamer-hub\client\src\`: `main.ts`, `style.css`, `types.ts`, `api.ts`, `ui.ts`
  - `C:\dev\streamer-hub\server\`: `StreamerHub.slnx`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\`: `StreamerHub.Api.csproj`, `Program.cs`, `appsettings.json`, `appsettings.Development.json`, `StreamerHub.Api.http`, `bin\`, `obj\`, `streamerhub.db`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Data\`: `AppDbContext.cs`, `SeedData.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Dtos\`: `ScheduleDtos.cs`, `StreamerDtos.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Entities\`: `Streamer.cs`, `Schedule.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Migrations\`: `<시각>_InitialCreate.cs`, `<시각>_InitialCreate.Designer.cs`, `AppDbContextModelSnapshot.cs`, `<시각>_AddSchedules.cs`, `<시각>_AddSchedules.Designer.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Properties\`: `launchSettings.json`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0), .NET 10 SDK(`dotnet --version` → `10.0.`으로 시작), VS Code C# 확장(`ms-dotnettools.csharp`), VS Code REST Client 확장(`humao.rest-client`), sqlite3(`sqlite3 --version`), dotnet-ef 10.0.14(`dotnet-ef --version`)
  - 실행 중이어야 할 것: 서버 `dotnet watch`
- 오늘 만들/바꿀 파일:
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Api\Endpoints\StreamerEndpoints.cs` — 스트리머 엔드포인트 5개(권한·요청 제한 없음) (레퍼런스 `Endpoints/StreamerEndpoints.cs`(Day 26·34))
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Api\Endpoints\ScheduleEndpoints.cs` — GetInRange(UTC 검사 없음)·Create·Update·Delete·Problem (레퍼런스 `Endpoints/ScheduleEndpoints.cs`(Day 26·29·34))
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Dtos\StreamerDtos.cs` — `StreamerRequest`([Url])·`StreamerResponse` 추가 (레퍼런스 `Dtos/StreamerDtos.cs`(Day 34 [HttpUrl]))
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Dtos\ScheduleDtos.cs` — `ScheduleRequest` 추가 (레퍼런스 `Dtos/ScheduleDtos.cs`(같음))
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Api\Services\ScheduleQuery.cs` — `InRange` (레퍼런스 `Services/ScheduleQuery.cs`(같음))
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Program.cs` — `AddValidation()`, Map 호출 두 줄, 옛 엔드포인트 코드 삭제 (레퍼런스 `Program.cs`)
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\StreamerHub.Api.http` — 검증 실패 예, 일정 등록·기간 조회 (레퍼런스 `.http`)
- 끝 상태 확인: 빈 이름 POST → `400`과 `"errors": { "Name": ["이름을 입력해 주세요."] }`(모양은 작성자가 캡처), `platform: "twitch"` → AllowedValues 메시지, 일정 POST → 201. `Program.cs`가 한 화면에 들어온다.
- 과제:
  1) `StreamerRequest`를 잠깐 `internal`로 바꿔 빈 이름이 통과되는 것을 보고 되돌리기 (보통) → `public record`여야 검증
  2) `DurationMinutes`에 5를 보내 400 메시지 확인 (쉬움) → `[Range(10, 1440, ErrorMessage = "…")]`
  3) `Bio`에 501자를 보내 400 확인 (쉬움) → `[StringLength(500)]`
- 용어(사전 담당): 특성, 검증, 확장 메서드, MapGroup, 의존성 주입, 서비스 수명, 서비스 계층
- 자주 막히는 곳 후보: 검증이 안 됨 → `internal`, `AddValidation()` 빠짐 / `error CS1061`/`CS0103 … MapStreamerEndpoints …` → `using StreamerHub.Api.Endpoints;` / 확장 메서드를 static이 아닌 클래스에 → `error CS1106` / MapGroup 안에서 주소를 또 `/api/streamers`로 써서 `/api/streamers/api/streamers` / 같은 주소·메서드를 두 번 → `AmbiguousMatchException`(작성자 원문 확인) / `[Url]`이 `https://`만 써도 통과 → Day 34에서 고침
- 레퍼런스 대응: 끝: `Dtos/ScheduleDtos.cs`, `Services/ScheduleQuery.cs`는 레퍼런스와 같아요. 중간 단계 — `StreamerEndpoints.cs`·`ScheduleEndpoints.cs`(Day 26 `RequireAuthorization("Admin")`, Day 29 UTC 검사, Day 34 `RequireRateLimiting`), `StreamerDtos.cs`(Day 34), `Program.cs`.

## Day 24 — 오류·설정·로깅 (100분)

- 목표: 오류 응답 통일: `builder.Services.AddProblemDetails();`, `if (!app.Environment.IsDevelopment()) { app.UseExceptionHandler(); }`, `app.UseStatusCodePages();` → 본문 없던 404에 `application/problem+json` 본문. 미들웨어 = 요청이 지나가는 관문들(그림), 순서가 중요한 이유(레퍼런스 2부 주석). 일부러 예외를 던지는 임시 엔드포인트로 개발 환경(자세한 오류 화면) vs Production(500 ProblemDetails)을 비교하고 **임시 엔드포인트는 지운다**. 구성: `appsettings.json` 위에 `appsettings.Development.json`이 덮어씀, `builder.Configuration`·`GetConnectionString`. 실행 환경: `launchSettings.json`의 `ASPNETCORE_ENVIRONMENT`, `$env:ASPNETCORE_ENVIRONMENT = "Production"` + `dotnet run --no-launch-profile --urls http://localhost:5250`(그 창에서만 유지. launchSettings를 읽지 않으면 기본 주소 `http://localhost:5000`에서 켜지므로 `.http`의 5250과 맞추려고 `--urls`를 꼭 붙임)로 Production 실험 → SQL 로그가 사라짐. 로깅: 로그 수준(Trace~Critical), `appsettings.json`에 `"Microsoft.EntityFrameworkCore": "Warning"`(레퍼런스 값), `app.Logger.LogInformation("스트리머 허브 서버를 시작해요. 환경: {Environment}", app.Environment.EnvironmentName);` — 자리표시자 `{…}` 구조적 로그. 이 한 줄은 **Day 26에 SeedData의 로그로 바꾸며 지운다**.
- 이미 배운 것: 상태 코드·Content-Type [Day 16](#/day/p2-d16); 예외·스택 추적 [Day 15](#/day/p2-d15); 환경 변수 [Day 3](#/day/p2-d03); 연결 문자열·appsettings [Day 20](#/day/p2-d20); SQL 로그 [Day 21](#/day/p2-d21); 구조화·검증 400 [Day 23](#/day/p2-d23)
- 시작 상태: [Day 23](#/day/p2-d23)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`, `.gitignore`
  - `C:\dev\streamer-hub\client\`: `.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`
  - `C:\dev\streamer-hub\client\public\`: `favicon.svg`
  - `C:\dev\streamer-hub\client\public\data\`: `streamers.json`, `schedules.json`
  - `C:\dev\streamer-hub\client\src\`: `main.ts`, `style.css`, `types.ts`, `api.ts`, `ui.ts`
  - `C:\dev\streamer-hub\server\`: `StreamerHub.slnx`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\`: `StreamerHub.Api.csproj`, `Program.cs`, `appsettings.json`, `appsettings.Development.json`, `StreamerHub.Api.http`, `bin\`, `obj\`, `streamerhub.db`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Data\`: `AppDbContext.cs`, `SeedData.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Dtos\`: `ScheduleDtos.cs`, `StreamerDtos.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Endpoints\`: `StreamerEndpoints.cs`, `ScheduleEndpoints.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Entities\`: `Streamer.cs`, `Schedule.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Migrations\`: `<시각>_InitialCreate.cs`, `<시각>_InitialCreate.Designer.cs`, `AppDbContextModelSnapshot.cs`, `<시각>_AddSchedules.cs`, `<시각>_AddSchedules.Designer.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Properties\`: `launchSettings.json`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Services\`: `ScheduleQuery.cs`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0), .NET 10 SDK(`dotnet --version` → `10.0.`으로 시작), VS Code C# 확장(`ms-dotnettools.csharp`), VS Code REST Client 확장(`humao.rest-client`), sqlite3(`sqlite3 --version`), dotnet-ef 10.0.14(`dotnet-ef --version`)
  - 실행 중이어야 할 것: 서버 `dotnet watch`
- 오늘 만들/바꿀 파일:
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Program.cs` — AddProblemDetails, UseExceptionHandler(개발 아닐 때), UseStatusCodePages, `app.Logger` 한 줄(임시) (레퍼런스 `Program.cs` 1부·2부의 같은 줄)
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\appsettings.json` — Logging에 EF Warning (레퍼런스 `appsettings.json`(Day 34 RateLimit))
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\StreamerHub.Api.http` — 없는 스트리머 404 요청 (레퍼런스 `.http`)
- 끝 상태 확인: `GET /api/streamers/999` → `404`, `Content-Type: application/problem+json`, 본문에 `"title": "Not Found"`·`"status": 404`(작성자 캡처). 서버 시작 로그에 한국어 줄. Production 실행에서는 SQL 로그가 없다.
- 과제:
  1) Production으로 켜서 SQL 로그가 사라지는 이유 설명 (보통) → Development 파일에만 SQL 로그 설정, `--no-launch-profile` + `$env:`
  2) `Logging:LogLevel:Default`를 `Warning`으로 바꿨다가 되돌리기 (쉬움) → 정보 로그가 사라짐
  3) 검증 400 응답도 ProblemDetails 모양인지 확인 (쉬움) → `title`·`status`·`errors`
- 용어(사전 담당): 미들웨어, ProblemDetails, 구성, appsettings.json, 실행 환경, 로그 수준, ILogger
- 자주 막히는 곳 후보: `UseExceptionHandler`를 `AddProblemDetails` 없이 → 시작 오류(작성자 원문 확인) / `$env:` 값이 다른 창에는 없음 / `dotnet run`이 launchSettings의 Development를 먼저 씀 → `--no-launch-profile` / `--no-launch-profile`만 쓰면 5000번에서 켜져 `.http`(5250) 요청이 연결 실패 → `--urls http://localhost:5250` / appsettings.json 쉼표 오류 → 시작 실패 `Failed to load configuration from file …`(작성자 원문 확인) / Development 오류 화면이 HTML이라 `.http`에서 길게 보임(정상) / 임시 예외 엔드포인트를 지우지 않음
- 레퍼런스 대응: 중간 단계 — 레퍼런스와 다름: `Program.cs`의 `app.Logger.LogInformation(...)` 한 줄은 레퍼런스에 없어요(Day 26에 지우고 `SeedData`의 ILogger로 대신). `appsettings.json`은 Day 34에 RateLimit을 더하면 레퍼런스와 같아요.

## Day 25 — 회원가입·로그인 (120분)

- 목표: 인증(누구인가) vs 인가(해도 되는가). 비밀번호를 그대로 저장하면 안 되는 이유 → 해싱(+솔트) 개념. 쿠키 로그인 흐름 그림(로그인 → `Set-Cookie` → 이후 요청에 자동으로 붙음). 패키지 `dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore --version 10.0.14`. `Entities\AppUser.cs`(`: IdentityUser`, `DisplayName = "새 팬"` — `/register`가 이메일·비밀번호만 받기 때문, 닉네임은 Day 26 `PUT /api/me`), `AppDbContext : IdentityDbContext<AppUser>`. `Program.cs`: `builder.Services.AddIdentityApiEndpoints<AppUser>().AddEntityFrameworkStores<AppDbContext>();`, `builder.Services.AddAuthorization();`(Day 26에 정책 빌더로 바뀜), `app.UseAuthentication(); app.UseAuthorization();`(순서). `Endpoints\AuthEndpoints.cs`: `var auth = app.MapGroup("/api/auth"); auth.MapIdentityApi<AppUser>(); auth.MapPost("/logout", Logout);`(SignOutAsync, 204). `app.MapAuthEndpoints();`. `dotnet ef migrations add AddIdentity`(서버 끄고) → AspNetUsers 등 테이블. `.http`: register 200, `login?useCookies=true` 200 + `Set-Cookie: .AspNetCore.Identity.Application=…; path=/; samesite=lax; httponly`, 틀린 비밀번호 401, logout 204. sqlite3로 `SELECT Email, PasswordHash FROM AspNetUsers;` → 해시만 저장됨. 비밀번호 규칙(6자+, 대·소문자·숫자·기호).
- 이미 배운 것: HTTP 헤더·Set-Cookie·401 [Day 16](#/day/p2-d16); 상속 [Day 13](#/day/p2-d13); MapGroup·확장 메서드 [Day 23](#/day/p2-d23); 미들웨어 순서·ProblemDetails [Day 24](#/day/p2-d24); 마이그레이션 [Day 20](#/day/p2-d20); sqlite3 [Day 19](#/day/p2-d19)
- 시작 상태: [Day 24](#/day/p2-d24)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`, `.gitignore`
  - `C:\dev\streamer-hub\client\`: `.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`
  - `C:\dev\streamer-hub\client\public\`: `favicon.svg`
  - `C:\dev\streamer-hub\client\public\data\`: `streamers.json`, `schedules.json`
  - `C:\dev\streamer-hub\client\src\`: `main.ts`, `style.css`, `types.ts`, `api.ts`, `ui.ts`
  - `C:\dev\streamer-hub\server\`: `StreamerHub.slnx`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\`: `StreamerHub.Api.csproj`, `Program.cs`, `appsettings.json`, `appsettings.Development.json`, `StreamerHub.Api.http`, `bin\`, `obj\`, `streamerhub.db`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Data\`: `AppDbContext.cs`, `SeedData.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Dtos\`: `ScheduleDtos.cs`, `StreamerDtos.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Endpoints\`: `StreamerEndpoints.cs`, `ScheduleEndpoints.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Entities\`: `Streamer.cs`, `Schedule.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Migrations\`: `<시각>_InitialCreate.cs`, `<시각>_InitialCreate.Designer.cs`, `AppDbContextModelSnapshot.cs`, `<시각>_AddSchedules.cs`, `<시각>_AddSchedules.Designer.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Properties\`: `launchSettings.json`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Services\`: `ScheduleQuery.cs`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0), .NET 10 SDK(`dotnet --version` → `10.0.`으로 시작), VS Code C# 확장(`ms-dotnettools.csharp`), VS Code REST Client 확장(`humao.rest-client`), sqlite3(`sqlite3 --version`), dotnet-ef 10.0.14(`dotnet-ef --version`)
  - 실행 중이어야 할 것: 서버 `dotnet watch`(마이그레이션 동안만 끔)
- 오늘 만들/바꿀 파일:
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\StreamerHub.Api.csproj` — Identity.EntityFrameworkCore 10.0.14 (레퍼런스 csproj)
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Api\Entities\AppUser.cs` — IdentityUser + DisplayName (레퍼런스 `Entities/AppUser.cs`(같음))
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Data\AppDbContext.cs` — `IdentityDbContext<AppUser>`로 (레퍼런스 `AppDbContext.cs`)
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Api\Endpoints\AuthEndpoints.cs` — MapIdentityApi 그룹 + Logout (레퍼런스 `Endpoints/AuthEndpoints.cs`(Day 26 /api/me, Day 34))
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Program.cs` — Identity 등록, AddAuthorization, UseAuthentication·UseAuthorization, MapAuthEndpoints (레퍼런스 `Program.cs`)
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Api\Migrations\<시각>_AddIdentity.cs`, `<시각>_AddIdentity.Designer.cs` — 마이그레이션 (레퍼런스 `Migrations/`)
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Migrations\AppDbContextModelSnapshot.cs` — 자동 (레퍼런스)
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\StreamerHub.Api.http` — 가입·로그인·로그아웃(연습 계정 `fan1@example.com`) (레퍼런스 `.http` "팬으로 가입·로그인")
- 끝 상태 확인: `.http` register → `200 OK`(본문 없음), login → `200 OK` + `Set-Cookie`에 `httponly`·`samesite=lax`, 틀린 비밀번호 → `401`, logout → `204`. sqlite3에서 `PasswordHash`가 `AQAAAA…` 같은 긴 글자.
- 과제:
  1) 같은 이메일로 다시 가입 → 400 `DuplicateUserName` (쉬움) → errors 키 읽기
  2) 비밀번호 `abc`로 가입 → 400 errors 목록 읽기 (쉬움) → `PasswordTooShort`·`PasswordRequiresUpper` 등
  3) `useCookies` 없이 로그인 → `accessToken` JSON (보통) → 토큰 방식과 비교, 이 교재는 쿠키를 씀(Day 34 HttpOnly)
- 용어(사전 담당): 인증, 인가, 해싱, 쿠키, ASP.NET Core Identity
- 자주 막히는 곳 후보: `IdentityDbContext`를 찾지 못함 → `using Microsoft.AspNetCore.Identity.EntityFrameworkCore;` / 마이그레이션 전에 서버를 켜 `no such table: AspNetUsers` / REST Client가 쿠키를 기억해서 로그아웃 전 상태가 섞임(설정 `rest-client.rememberCookiesForSubsequentRequests`) / Content-Type 빠짐 → 415(작성자 확인) / 비밀번호 규칙 오류가 영어 코드로 옴(정상, Day 31에 한국어로) / 이메일 확인이 없다는 점 → Day 26 관리자 시드 위험과 연결
- 레퍼런스 대응: 끝: `Entities/AppUser.cs`는 레퍼런스와 같아요. 중간 단계 — `AuthEndpoints.cs`(Day 26 `/api/me`, Day 34 요청 제한), `AppDbContext.cs`(Day 29·30·33), `Program.cs`(Day 26 `AddRoles`·정책), csproj(Day 26 UserSecretsId).

## Day 26 — 권한 (120분)

- 목표: 역할(Admin)과 정책: `.AddRoles<IdentityRole>()`, `builder.Services.AddAuthorizationBuilder().AddPolicy("Admin", policy => policy.RequireRole(SeedData.AdminRole));`(Day 25의 `AddAuthorization()` 대신), 스트리머·일정 POST/PUT/DELETE에 `.RequireAuthorization("Admin")` → 로그인 안 함 401 / 팬 403 / 관리자 201. 클레임과 `ClaimsPrincipal`(쿠키 안의 사용자 정보). `Dtos\AuthDtos.cs`(`MeResponse`, `UpdateMeRequest` [Required][StringLength(20, MinimumLength = 2)]). `AuthEndpoints`에 `GET /api/me`: 로그인했으면 200 `{email, displayName, roles}`, **안 했으면 204** — 401이면 공개 페이지를 열 때마다 브라우저 콘솔에 빨간 오류가 찍히고, "로그인 안 함"은 오류가 아니라서(레퍼런스 README 설계 메모). `PUT /api/me`(RequireAuthorization, 닉네임 저장. 서버는 앞뒤 빈칸을 자르지 않고 화면이 자른 값을 보냄 — Day 31). 관리자 비밀번호를 코드·appsettings에 쓰지 않는 이유 → `dotnet user-secrets init`(csproj에 `UserSecretsId`), `dotnet user-secrets set "Admin:Email" "admin@example.com"`, `… "Admin:Password" '<비밀번호>'`(PowerShell에서 `$`가 든 비밀번호는 작은따옴표), `dotnet user-secrets list`, 저장 위치 `%APPDATA%\Microsoft\UserSecrets\<UserSecretsId>\secrets.json`(프로젝트 밖이라 커밋되지 않음). `SeedData`에 `AdminRole` 상수와 `EnsureAdminAsync(provider, email, password)`(역할 만들기 → 설정 없으면 경고 로그 → 계정 없으면 만들고 Admin → 이미 Admin이면 끝 → 이미 있는데 Admin이 아니면 **`CheckPasswordAsync`가 맞을 때만** 승격: 가입은 누구나 할 수 있고 이메일 확인이 없어서 남이 관리자 이메일로 먼저 가입해 둘 수 있음). ILogger는 `GetRequiredService<ILoggerFactory>().CreateLogger("SeedData")`. Day 24의 `app.Logger` 줄은 지운다.
- 이미 배운 것: Identity·쿠키·인증/인가 [Day 25](#/day/p2-d25); ILogger·구성·실행 환경 [Day 24](#/day/p2-d24); 상태 코드 204·401·403 [Day 16](#/day/p2-d16); static·const·async [Day 10](#/day/p2-d10)·[Day 12](#/day/p2-d12)·[Day 15](#/day/p2-d15); 패턴 매칭 `is null` [Day 13](#/day/p2-d13); 검증 특성 [Day 23](#/day/p2-d23)
- 시작 상태: [Day 25](#/day/p2-d25)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`, `.gitignore`
  - `C:\dev\streamer-hub\client\`: `.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`
  - `C:\dev\streamer-hub\client\public\`: `favicon.svg`
  - `C:\dev\streamer-hub\client\public\data\`: `streamers.json`, `schedules.json`
  - `C:\dev\streamer-hub\client\src\`: `main.ts`, `style.css`, `types.ts`, `api.ts`, `ui.ts`
  - `C:\dev\streamer-hub\server\`: `StreamerHub.slnx`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\`: `StreamerHub.Api.csproj`, `Program.cs`, `appsettings.json`, `appsettings.Development.json`, `StreamerHub.Api.http`, `bin\`, `obj\`, `streamerhub.db`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Data\`: `AppDbContext.cs`, `SeedData.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Dtos\`: `ScheduleDtos.cs`, `StreamerDtos.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Endpoints\`: `StreamerEndpoints.cs`, `ScheduleEndpoints.cs`, `AuthEndpoints.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Entities\`: `Streamer.cs`, `Schedule.cs`, `AppUser.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Migrations\`: `<시각>_InitialCreate.cs`, `<시각>_InitialCreate.Designer.cs`, `AppDbContextModelSnapshot.cs`, `<시각>_AddSchedules.cs`, `<시각>_AddSchedules.Designer.cs`, `<시각>_AddIdentity.cs`, `<시각>_AddIdentity.Designer.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Properties\`: `launchSettings.json`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Services\`: `ScheduleQuery.cs`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0), .NET 10 SDK(`dotnet --version` → `10.0.`으로 시작), VS Code C# 확장(`ms-dotnettools.csharp`), VS Code REST Client 확장(`humao.rest-client`), sqlite3(`sqlite3 --version`), dotnet-ef 10.0.14(`dotnet-ef --version`)
  - 실행 중이어야 할 것: 서버 `dotnet watch`
- 오늘 만들/바꿀 파일:
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Program.cs` — AddRoles, AddAuthorizationBuilder·Admin 정책, `app.Logger` 줄 삭제 (레퍼런스 `Program.cs`)
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Endpoints\StreamerEndpoints.cs` — 쓰기 3개에 `.RequireAuthorization("Admin")` (레퍼런스(Day 34 요청 제한))
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Endpoints\ScheduleEndpoints.cs` — 쓰기 3개에 `.RequireAuthorization("Admin")` (레퍼런스(Day 29·34))
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Endpoints\AuthEndpoints.cs` — GetMe(204)·UpdateMe (레퍼런스(Day 34 요청 제한))
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Api\Dtos\AuthDtos.cs` — MeResponse, UpdateMeRequest (레퍼런스 `Dtos/AuthDtos.cs`(같음))
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Data\SeedData.cs` — AdminRole, EnsureAdminAsync, InitializeAsync에서 호출 (레퍼런스 `Data/SeedData.cs`(같음))
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\StreamerHub.Api.csproj` — `dotnet user-secrets init`이 UserSecretsId 추가 (레퍼런스 csproj(같음 — Id 값은 사람마다 다름))
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\StreamerHub.Api.http` — /api/me, 닉네임, 관리자 로그인(비밀번호 칸은 직접 바꾸고 커밋하지 않기), 403 확인 (레퍼런스 `.http`)
  - 새로 `%APPDATA%\Microsoft\UserSecrets\<UserSecretsId>\secrets.json` — user-secrets 값(프로젝트 밖이라 커밋되지 않음) (레퍼런스 README "관리자 계정 정하기")
- 끝 상태 확인: 서버 시작 로그에 "관리자 계정 admin@example.com을(를) 만들었어요." 로그인 안 함 `GET /api/me` → 204, 팬 → 200 `roles: []`, 팬이 `POST /api/streamers` → 403, 관리자 → 201, 로그인 안 함 → 401, `PUT /api/me` → 204.
- 과제:
  1) 관리자 이메일 선가입 위험 재현(레퍼런스 테스트 `AdminSeed_DoesNotPromote_PreRegisteredAccountWithWrongPassword`와 같은 순서) (도전) → ① 서버를 끄고 `streamerhub.db*` 삭제 ② `dotnet user-secrets remove "Admin:Password"`로 설정을 잠깐 비움 ③ 서버를 켜면 "Admin:Email과 Admin:Password 설정이 없어서 관리자 계정을 만들지 않았어요." 경고가 나오고 관리자 계정이 없음 ④ `.http`로 팬이 `admin@example.com`(설정과 다른 비밀번호)으로 가입 ⑤ 서버를 끄고 `dotnet user-secrets set "Admin:Password" '<원래 비밀번호>'`로 되돌린 뒤 다시 켜면 "admin@example.com로 이미 가입한 계정이 있지만 비밀번호가 설정과 달라서 관리자로 올리지 않았어요." 경고, 그 계정으로 로그인한 `GET /api/me`의 `roles`는 `[]` ⑥ 서버를 끄고 DB를 다시 지운 뒤 켜서 "관리자 계정 admin@example.com을(를) 만들었어요."로 원래 상태 복구 (서버 시작 때 시드가 먼저 관리자를 만들기 때문에, 설정을 비우지 않고 가입하면 `DuplicateUserName`으로 재현되지 않아요)
  2) 닉네임 한 글자로 `PUT /api/me` → 400 (쉬움) → `StringLength(MinimumLength = 2)` 메시지
  3) `dotnet user-secrets list`로 값 확인하고 secrets.json 위치를 탐색기로 찾기 (쉬움) → `%APPDATA%` 주소 표시줄 입력
- 용어(사전 담당): 역할, 권한 정책, 클레임, user-secrets
- 자주 막히는 곳 후보: `Could not find a MSBuild project file` → `StreamerHub.Api` 폴더에서 user-secrets 실행 / 비밀번호 규칙 위반 → 서버가 켜지지 않음 `InvalidOperationException: 관리자 계정을 만들지 못했어요: …` → 규칙에 맞게 다시 set / PowerShell 큰따옴표 안의 `$`가 변수로 해석돼 비밀번호가 달라짐 → 작은따옴표 / 역할을 추가하기 전에 로그인한 쿠키 → 다시 로그인해야 Admin / 401과 403 헷갈림 / **user-secrets 위치**: `%APPDATA%\Microsoft\UserSecrets\` — 프로젝트 폴더에 없다고 당황 / `.http`에 관리자 비밀번호를 쓴 채 커밋 → 커밋 전 확인
- 레퍼런스 대응: 끝: `SeedData.cs`, `AuthDtos.cs`, csproj는 레퍼런스와 같아요. 중간 단계 — `AuthEndpoints.cs`·`StreamerEndpoints.cs`(Day 34), `ScheduleEndpoints.cs`(Day 29·34), `Program.cs`(Day 30·33·34·38).

## Day 27 — 프론트↔백 연결 (120분)

- 목표: 터미널 두 개(서버 `dotnet watch` 5250, 클라이언트 `npm run dev` 5173). 출처 = 스킴+호스트+포트. 5173 페이지의 콘솔에서 `fetch('http://localhost:5250/api/streamers')` → CORS 오류 원문(작성자 캡처) → 뜻 풀이. 서버에 CORS를 여는 대신 **Vite 프록시**를 쓰는 이유: 브라우저에게는 같은 출처(5173)라 CORS가 필요 없고 로그인 쿠키도 그대로 붙음, 배포하면 서버 하나(Day 38). `:::info 실무에서는` 다른 출처가 꼭 필요하면 `AddCors`로 정해진 출처만(자격 증명과 `*` 금지) — 코드는 남기지 않음. `client\vite.config.ts`(`defineConfig`, `server.proxy: { '/api': 'http://localhost:5250' }`, 빌드 설정은 Day 38) → dev 서버 재시작. `api.ts`를 진짜 API로: `request(method, url, body?)`(JSON일 때만 Content-Type), TS 클래스 `ApiError extends Error`(필드 선언 → constructor → `super`, C# Day 12~13과 비교, `erasableSyntaxOnly` 때문에 `constructor(public status…)` 축약 금지), `ProblemDetails` 인터페이스, `toApiError`(401·403·404·429·400 검증 문장. 처음 쓰는 `Object.keys`·`Object.values`·배열 `flat()`은 그 자리에서 한 줄씩 설명), `getJson<T>`, `getStreamers(q = '')`(`encodeURIComponent`), `getStreamer(id)`. `types.ts`를 서버 DTO 모양으로(`createdAt` 문자열, `avatarUrl: string | null`). `ui.ts` `errorMessage`에 `instanceof ApiError` 분기와 "서버에 연결하지 못했어요…"(fetch 실패는 TypeError). `main.ts`는 진짜 스트리머 카드만(다가오는 방송은 Day 29). `public\data\`를 지운다.
- 이미 배운 것: fetch·Promise·getJson·상태 문장 [Day 8](#/day/p2-d08); C# 클래스·상속·생성자 [Day 12](#/day/p2-d12)·[Day 13](#/day/p2-d13); ProblemDetails [Day 24](#/day/p2-d24); API 서버·포트 5250 [Day 17](#/day/p2-d17)~[Day 26](#/day/p2-d26); 개발 서버·포트 [Day 7](#/day/p2-d07); 제네릭·Record [Day 6](#/day/p2-d06); 쿼리 문자열 [P1 Day 27](#/day/p1-d27)
- 시작 상태: [Day 26](#/day/p2-d26)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`, `.gitignore`
  - `C:\dev\streamer-hub\client\`: `.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`
  - `C:\dev\streamer-hub\client\public\`: `favicon.svg`
  - `C:\dev\streamer-hub\client\public\data\`: `streamers.json`, `schedules.json`
  - `C:\dev\streamer-hub\client\src\`: `main.ts`, `style.css`, `types.ts`, `api.ts`, `ui.ts`
  - `C:\dev\streamer-hub\server\`: `StreamerHub.slnx`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\`: `StreamerHub.Api.csproj`, `Program.cs`, `appsettings.json`, `appsettings.Development.json`, `StreamerHub.Api.http`, `bin\`, `obj\`, `streamerhub.db`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Data\`: `AppDbContext.cs`, `SeedData.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Dtos\`: `ScheduleDtos.cs`, `StreamerDtos.cs`, `AuthDtos.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Endpoints\`: `StreamerEndpoints.cs`, `ScheduleEndpoints.cs`, `AuthEndpoints.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Entities\`: `Streamer.cs`, `Schedule.cs`, `AppUser.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Migrations\`: `<시각>_InitialCreate.cs`, `<시각>_InitialCreate.Designer.cs`, `AppDbContextModelSnapshot.cs`, `<시각>_AddSchedules.cs`, `<시각>_AddSchedules.Designer.cs`, `<시각>_AddIdentity.cs`, `<시각>_AddIdentity.Designer.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Properties\`: `launchSettings.json`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Services\`: `ScheduleQuery.cs`
  - `%APPDATA%\Microsoft\UserSecrets\<UserSecretsId>\`: `secrets.json`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0), .NET 10 SDK(`dotnet --version` → `10.0.`으로 시작), VS Code C# 확장(`ms-dotnettools.csharp`), VS Code REST Client 확장(`humao.rest-client`), sqlite3(`sqlite3 --version`), dotnet-ef 10.0.14(`dotnet-ef --version`)
  - 실행 중이어야 할 것: 서버 `dotnet watch`(터미널 1) + 클라이언트 `npm run dev`(터미널 2)
- 오늘 만들/바꿀 파일:
  - 새로 `C:\dev\streamer-hub\client\vite.config.ts` — proxy `/api` → 5250(빌드 입력은 Day 38) (레퍼런스 `client/vite.config.ts`)
  - 바꿈 `C:\dev\streamer-hub\client\src\api.ts` — request·ApiError·toApiError·getJson·getStreamers·getStreamer (레퍼런스 `client/src/api.ts`(Day 29·31·32·33에 함수 추가))
  - 바꿈 `C:\dev\streamer-hub\client\src\types.ts` — Streamer·StreamerDetail·Schedule을 서버 DTO와 같게 (레퍼런스 `client/src/types.ts`)
  - 바꿈 `C:\dev\streamer-hub\client\src\ui.ts` — errorMessage에 ApiError 분기 (레퍼런스 `ui.ts`의 errorMessage(같음))
  - 바꿈 `C:\dev\streamer-hub\client\src\main.ts` — `getStreamers()`로 카드 (레퍼런스(Day 28에 라우터로))
  - 삭제 `C:\dev\streamer-hub\client\public\data\` — streamers.json·schedules.json 삭제 (—)
- 끝 상태 확인: `http://localhost:5173`에 DB의 스트리머 카드가 보이고 Network 탭의 `/api/streamers`가 5173 주소로 200. 서버를 끄고 새로 고치면 "서버에 연결하지 못했어요. 서버가 켜져 있는지 확인해 주세요." 콘솔 실험에서는 CORS 오류.
- 과제:
  1) 콘솔에서 `getStreamer(999)` 결과의 `status` 확인 (보통) → 개발 중 콘솔에서 모듈 함수를 부르는 방법은 작성자가 정함(예: main.ts에 잠깐 호출 후 지우기) → `ApiError`, status 404, message "찾을 수 없어요."
  2) `getStreamers('곰')`이 보내는 주소를 Network에서 확인 (쉬움) → `/api/streamers?q=%EA%B3%B0`, encodeURIComponent 이유
  3) 서버를 끈 상태와 404 상태의 오류 문장 차이 설명 (쉬움) → TypeError(연결 실패) vs ApiError(서버가 응답함)
- 용어(사전 담당): 출처, CORS, 프록시
- 자주 막히는 곳 후보: vite.config.ts를 고치고 dev 서버를 다시 켜지 않음 / 서버가 꺼진 상태 → Vite 터미널의 `http proxy error … ECONNREFUSED`와 브라우저 500(작성자 원문 확인) / 프록시 키에 `/` 빠짐 / `localhost`가 IPv6(`::1`)로 풀리는 문제 여부 → 작성자 확인 / `error TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.`(매개변수 속성) / 옛 `public\data` 캐시 → `Ctrl + Shift + R` / 5250을 브라우저로 직접 열어 화면이 없음 → 개발 중 화면은 5173
- 레퍼런스 대응: 끝: `ui.ts`의 `errorMessage`는 레퍼런스와 같아요. 중간 단계 — `vite.config.ts`(Day 38 `rolldownOptions`), `api.ts`·`types.ts`(Day 29·31·32·33), `main.ts`(Day 28). 레퍼런스 README "개발 모드로 실행하기"와 같은 두 터미널 흐름.

## Day 28 — 목록·상세 페이지 (120분)

- 목표: SPA와 해시 라우터 원리: `#` 뒤만 바뀌면 페이지를 새로 불러오지 않고 `hashchange` 이벤트가 난다 → 서버에는 `index.html` 하나면 됨(Day 38). `src\router.ts`(레퍼런스와 같음): 타입 `Params = Record<string, string>`, `Page = (view, params, query) => void | Promise<void>`, `addRoute`, `matchRoute`(칸별 비교, `:`로 시작하면(`startsWith(':')` — 처음 쓰는 문자열 메서드) 값 받기, `decodeURIComponent`를 try/catch — `%` 같은 잘못된 주소는 "맞지 않음"), `readHash`(`#/board?page=2` → path·`URLSearchParams`), `render`(새 `view` 상자를 `app.replaceChildren(view)`로 통째로 바꿔 끼워 늦게 온 응답이 섞이지 않게, `window.scrollTo(0, 0)`, 오류는 안내 문장 + `console.error`), `startRouter`. `main.ts`: `addRoute('/', renderHome)`, `/streamers`, `/streamers/:id`, `markCurrentLink`(`aria-current="page"`), `start()`. `pages\home.ts`(hero만, Day 7 main.ts의 내용을 옮김), `pages\streamers.ts`(레퍼런스와 같음: 검색 폼 → `#/streamers?q=`, 입력값은 `value`로, 카드), `pages\streamerDetail.ts`(프로필·배지·소개·채널 링크 `target="_blank" rel="noopener noreferrer"`, 404면 "없는 스트리머예요." — 다가오는 방송은 Day 29, 주소 검사는 Day 34). `ui.ts`: `platformNames: Record<Platform, string>`, `createLink`, `createAvatar`(지금은 `avatarUrl`이 있으면 img, 없으면 첫 글자). `style.css`: 레퍼런스 **214~227줄**(`.avatar`), **245~255줄**(`input, select, textarea` — 검색칸이 처음 쓰는 입력칸), **316~333줄**(`.search-form`, `.profile-head`, `.profile-head h1`).
- 이미 배운 것: `URLSearchParams`·`location` [P1 Day 27](#/day/p1-d27); 이벤트·`addEventListener` [P1 Day 21](#/day/p1-d21); `aria-current`·속성 선택자 [P1 Day 11](#/day/p1-d11); 폼 submit·`preventDefault` [P1 Day 24](#/day/p1-d24); 함수 타입·Record·제네릭 [Day 6](#/day/p2-d06); api.ts·ApiError [Day 27](#/day/p2-d27); Platform 유니온 [Day 5](#/day/p2-d05); 라우트(서버) [Day 17](#/day/p2-d17)
- 시작 상태: [Day 27](#/day/p2-d27)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`, `.gitignore`
  - `C:\dev\streamer-hub\client\`: `.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`, `vite.config.ts`
  - `C:\dev\streamer-hub\client\public\`: `favicon.svg`
  - `C:\dev\streamer-hub\client\src\`: `main.ts`, `style.css`, `types.ts`, `api.ts`, `ui.ts`
  - `C:\dev\streamer-hub\server\`: `StreamerHub.slnx`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\`: `StreamerHub.Api.csproj`, `Program.cs`, `appsettings.json`, `appsettings.Development.json`, `StreamerHub.Api.http`, `bin\`, `obj\`, `streamerhub.db`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Data\`: `AppDbContext.cs`, `SeedData.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Dtos\`: `ScheduleDtos.cs`, `StreamerDtos.cs`, `AuthDtos.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Endpoints\`: `StreamerEndpoints.cs`, `ScheduleEndpoints.cs`, `AuthEndpoints.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Entities\`: `Streamer.cs`, `Schedule.cs`, `AppUser.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Migrations\`: `<시각>_InitialCreate.cs`, `<시각>_InitialCreate.Designer.cs`, `AppDbContextModelSnapshot.cs`, `<시각>_AddSchedules.cs`, `<시각>_AddSchedules.Designer.cs`, `<시각>_AddIdentity.cs`, `<시각>_AddIdentity.Designer.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Properties\`: `launchSettings.json`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Services\`: `ScheduleQuery.cs`
  - `%APPDATA%\Microsoft\UserSecrets\<UserSecretsId>\`: `secrets.json`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0), .NET 10 SDK(`dotnet --version` → `10.0.`으로 시작), VS Code C# 확장(`ms-dotnettools.csharp`), VS Code REST Client 확장(`humao.rest-client`), sqlite3(`sqlite3 --version`), dotnet-ef 10.0.14(`dotnet-ef --version`)
  - 실행 중이어야 할 것: 서버 `dotnet watch` + 클라이언트 `npm run dev`
- 오늘 만들/바꿀 파일:
  - 새로 `C:\dev\streamer-hub\client\src\router.ts` — 해시 라우터 (레퍼런스 `client/src/router.ts`(같음))
  - 새로 `C:\dev\streamer-hub\client\src\pages\home.ts` — hero만 (레퍼런스 `pages/home.ts`(Day 29·31))
  - 새로 `C:\dev\streamer-hub\client\src\pages\streamers.ts` — 목록 + 검색 (레퍼런스 `pages/streamers.ts`(같음))
  - 새로 `C:\dev\streamer-hub\client\src\pages\streamerDetail.ts` — 프로필(일정·주소 검사 없음) (레퍼런스 `pages/streamerDetail.ts`(Day 29·34))
  - 바꿈 `C:\dev\streamer-hub\client\src\main.ts` — 라우터·주소 3개·markCurrentLink (레퍼런스 `main.ts`(Day 29·31·32))
  - 바꿈 `C:\dev\streamer-hub\client\src\ui.ts` — platformNames, createLink, createAvatar(단순) (레퍼런스 `ui.ts`(Day 29·32·34))
  - 바꿈 `C:\dev\streamer-hub\client\src\style.css` — 레퍼런스 214~227·245~255·316~333줄 (레퍼런스 `style.css`)
- 끝 상태 확인: 메뉴 "스트리머" → 주소 `#/streamers`, 카드 3장, 메뉴에 밑줄. 이름 클릭 → `#/streamers/1` 상세, 뒤로 가기 동작. "곰" 검색 → `#/streamers?q=%EA%B3%B0` 1명. `#/abc`와 `#/streamers/%` → "페이지를 찾을 수 없어요". 콘솔 오류 0.
- 과제:
  1) `#/streamers/999` → "없는 스트리머예요." (보통) → `error instanceof api.ApiError && error.status === 404` 분기(레퍼런스와 같음)
  2) `matchRoute('/board/:id/edit', '/board/7/edit')` 결과 예측·확인 (쉬움) → `{ id: "7" }`
  3) 검색 결과 0명일 때 문장 (쉬움) → `"${keyword}"(으)로 찾은 스트리머가 없어요.`(레퍼런스와 같음)
- 용어(사전 담당): SPA, 해시 라우터
- 자주 막히는 곳 후보: 라우트 등록 순서(위에서부터 비교) / `hashchange` 리스너를 두 번 등록해 두 번 그림 / `params.id`는 문자열 → `Number()` / `error TS6133: 'params' is declared but its value is never read.` → 레퍼런스처럼 `_params` / 한글 검색어가 `%EA…`로 보임(정상) / `#` 없는 링크를 눌러 페이지가 새로 열림
- 레퍼런스 대응: 끝: `router.ts`, `pages/streamers.ts`는 레퍼런스와 같아요. 중간 단계 — `pages/home.ts`(Day 29·31), `pages/streamerDetail.ts`(Day 29 일정, Day 34 `isHttpUrl`), `main.ts`(Day 29·31·32), `ui.ts`(Day 29·32·34), `style.css`(Day 29·31·32).

## Day 29 — 방송 일정 페이지 (120분)

- 목표: UTC vs 한국 시간(KST = UTC+9, 서머타임 없음). P1 Day 26 카운트다운은 "컴퓨터 시계 기준"이라 다른 나라 컴퓨터에서는 틀린다는 비교. ISO 8601 `2026-11-02T11:00:00Z`(끝의 `Z` = UTC). 원칙: **DB와 API는 UTC, 화면만 한국 시간**. 서버: SQLite가 DateTime의 UTC 표시(Kind)를 잃어 JSON에 `Z`가 빠지는 것을 확인 → `AppDbContext.ConfigureConventions` + `UtcDateTimeConverter : ValueConverter<DateTime, DateTime>`(읽을 때 `DateTime.SpecifyKind(…, Utc)`) → 이제 모든 시각에 `Z`. 마이그레이션이 필요 없는지 작성자가 `dotnet ef migrations has-pending-model-changes`로 확인. `ScheduleEndpoints.GetInRange`: Kind가 Utc가 아니면 400 "시각은 UTC로 보내 주세요", `to <= from` 400(이미 있음), Create/Update의 `startsAt` 검사(레퍼런스와 같게). 클라이언트: `ui.ts` 시간 도우미(`KST_OFFSET_MS`, `Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', … })` 3개, `formatKstDateTime`·`formatKstDate`·`formatKstTime`·`toKstDateString`), `api.ts` `getSchedules(from: Date, to: Date)`(`toISOString()` + `URLSearchParams`), `pages\schedule.ts`(레퍼런스와 같음: `startOfKstWeek`, `?week=YYYY-MM-DD`, 지난주·다음 주, 월~일 7칸, 오늘 강조, 스트리머 필터 `select` — **`change` 이벤트**를 처음 소개(선택 상자 값이 바뀌어 확정되면 한 번 일어남, P1 Day 23의 `input` 이벤트와 비교), JS `Map`으로 중복 없는 이름 목록, 서버에 다시 묻지 않고 거르기). 이 Day에 처음 쓰는 Date 메서드 `getTime`·`toISOString`·`Date.UTC`·`getUTCDay`/`getUTCFullYear`/`getUTCMonth`/`getUTCDate`와 `Number.isNaN`도 그 자리에서 한 줄씩 설명, `home.ts`에 다가오는 방송 3개, `streamerDetail.ts`에 다가오는 방송 목록, `main.ts`에 `/schedule`. 개발자 도구에서 시간대를 다른 나라로 바꿔도 같은 한국 시간이 보이는지 확인(방법은 작성자가 Chrome에서 확인).
- 이미 배운 것: Date·요일 강조·카운트다운(컴퓨터 시계 기준) [P1 Day 26](#/day/p1-d26); `select`·`option` [P1 Day 8](#/day/p1-d08); `input` 이벤트·필터 [P1 Day 23](#/day/p1-d23); DateTime [Day 12](#/day/p2-d12); 상속·override [Day 13](#/day/p2-d13); ScheduleQuery·Problem [Day 23](#/day/p2-d23); 마이그레이션 [Day 20](#/day/p2-d20); 해시 라우터 [Day 28](#/day/p2-d28); Promise.all [Day 8](#/day/p2-d08)
- 시작 상태: [Day 28](#/day/p2-d28)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`, `.gitignore`
  - `C:\dev\streamer-hub\client\`: `.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`, `vite.config.ts`
  - `C:\dev\streamer-hub\client\public\`: `favicon.svg`
  - `C:\dev\streamer-hub\client\src\`: `main.ts`, `style.css`, `types.ts`, `api.ts`, `ui.ts`, `router.ts`
  - `C:\dev\streamer-hub\client\src\pages\`: `home.ts`, `streamers.ts`, `streamerDetail.ts`
  - `C:\dev\streamer-hub\server\`: `StreamerHub.slnx`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\`: `StreamerHub.Api.csproj`, `Program.cs`, `appsettings.json`, `appsettings.Development.json`, `StreamerHub.Api.http`, `bin\`, `obj\`, `streamerhub.db`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Data\`: `AppDbContext.cs`, `SeedData.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Dtos\`: `ScheduleDtos.cs`, `StreamerDtos.cs`, `AuthDtos.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Endpoints\`: `StreamerEndpoints.cs`, `ScheduleEndpoints.cs`, `AuthEndpoints.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Entities\`: `Streamer.cs`, `Schedule.cs`, `AppUser.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Migrations\`: `<시각>_InitialCreate.cs`, `<시각>_InitialCreate.Designer.cs`, `AppDbContextModelSnapshot.cs`, `<시각>_AddSchedules.cs`, `<시각>_AddSchedules.Designer.cs`, `<시각>_AddIdentity.cs`, `<시각>_AddIdentity.Designer.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Properties\`: `launchSettings.json`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Services\`: `ScheduleQuery.cs`
  - `%APPDATA%\Microsoft\UserSecrets\<UserSecretsId>\`: `secrets.json`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0), .NET 10 SDK(`dotnet --version` → `10.0.`으로 시작), VS Code C# 확장(`ms-dotnettools.csharp`), VS Code REST Client 확장(`humao.rest-client`), sqlite3(`sqlite3 --version`), dotnet-ef 10.0.14(`dotnet-ef --version`)
  - 실행 중이어야 할 것: 서버 `dotnet watch` + 클라이언트 `npm run dev`
- 오늘 만들/바꿀 파일:
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Data\AppDbContext.cs` — ConfigureConventions + UtcDateTimeConverter (레퍼런스 `AppDbContext.cs`(Day 30·33 DbSet))
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Endpoints\ScheduleEndpoints.cs` — UTC 검사 (레퍼런스(Day 34 요청 제한))
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\StreamerHub.Api.http` — UTC 예시 요청(한국 11/2 0시 = UTC 11/1 15시), `Z` 없는 400 예 (레퍼런스 `.http`)
  - 새로 `C:\dev\streamer-hub\client\src\pages\schedule.ts` — 주간 일정 (레퍼런스 `pages/schedule.ts`(같음))
  - 바꿈 `C:\dev\streamer-hub\client\src\api.ts` — `getSchedules(from, to)` (레퍼런스 `api.ts`)
  - 바꿈 `C:\dev\streamer-hub\client\src\ui.ts` — 시간 도우미 (레퍼런스 `ui.ts` "시간 (Day 29)" 블록)
  - 바꿈 `C:\dev\streamer-hub\client\src\pages\home.ts` — 다가오는 방송 3개 (레퍼런스 `home.ts`(Day 31 새 글))
  - 바꿈 `C:\dev\streamer-hub\client\src\pages\streamerDetail.ts` — 다가오는 방송 목록 (레퍼런스(Day 34 isHttpUrl))
  - 바꿈 `C:\dev\streamer-hub\client\src\main.ts` — `/schedule` 주소 (레퍼런스)
  - 바꿈 `C:\dev\streamer-hub\client\src\style.css` — 레퍼런스 361~410줄(`.week-nav`~`.slot-title`, 900px 미디어 쿼리 포함) (레퍼런스 `style.css` 주간 일정 블록)
- 끝 상태 확인: `#/schedule`에 월~일 7칸, 오늘 칸 강조, 달빛곰 "오후 8:00"(UTC 11:00). 지난주/다음 주 → `#/schedule?week=…`. 필터로 한 사람만. API JSON의 `startsAt`·`createdAt` 끝에 `Z`. `from=2026-11-02T00:00:00`(Z 없음) → 400.
- 과제:
  1) 한국 2026-11-02 하루가 UTC로 언제부터 언제까지인지 계산 (보통) → `2026-11-01T15:00:00Z` ~ `2026-11-02T15:00:00Z`(끝은 포함 안 함, 레퍼런스 ScheduleQueryTests)
  2) 브라우저 시간대를 바꿔도 같은 시각이 보이는 이유 (쉬움) → `timeZone: 'Asia/Seoul'`을 직접 지정
  3) `#/schedule?week=abc` → 이번 주로 (쉬움) → `Number.isNaN(parsed.getTime())` 검사(레퍼런스와 같음)
- 용어(사전 담당): UTC, 시간대, ISO 8601, Intl.DateTimeFormat, 값 변환기, Map
- 자주 막히는 곳 후보: JSON 시각에 `Z`가 없어 9시간 어긋남 → UtcDateTimeConverter / `toISOString()`이 하루 전 날짜로 보임(UTC라서 정상) / `getUTCDay()`는 일요일 0 → 월요일 시작 계산 `(day + 6) % 7` / 400 "시각은 UTC로 보내 주세요" → `.http`에서 끝에 `Z` / 시드 일정이 "오늘 기준"이라 다음 주로 넘기면 비어 있음(정상) / 개발자 도구 시간대 바꾸는 메뉴 위치(작성자 확인)
- 레퍼런스 대응: 끝: `pages/schedule.ts`는 레퍼런스와 같아요. 중간 단계 — `AppDbContext.cs`(Day 30·33), `ScheduleEndpoints.cs`(Day 34), `home.ts`(Day 31), `streamerDetail.ts`(Day 34), `ui.ts`(Day 32·34), `api.ts`·`main.ts`·`style.css`. 단위 테스트 `ScheduleQueryTests`는 Day 35.

## Day 30 — 팬 게시판 API (120분)

- 목표: `Entities\Post.cs`(AuthorId → AppUser 외래 키, `Author?` 탐색, Title≤100, Body≤5000, CreatedAt, `UpdatedAt?`), `AppDbContext`에 `Posts`, `dotnet ef migrations add AddPosts`. `Dtos\PostDtos.cs`(`PostRequest` 검증, `PostListItem`, `PostDetail.From(post, canEdit)`), `Dtos\PagedResult.cs`(`record PagedResult<T>(List<T> Items, int Total, int Page, int PageSize)` — C# 제네릭 타입을 직접 만들기, TS `Paged<T>`와 같은 모양). `Services\PostService.cs`(레퍼런스와 같음): `enum PostChangeResult { Success, NotFound, Forbidden }`, 생성자 주입 `AppDbContext`, `ListAsync`(Count + OrderByDescending(Id) + Skip/Take + **Select 프로젝션** — 본문·이메일·비밀번호 해시를 읽지 않음), `GetAsync`(`AsNoTracking` + `Include(Author)`), `CreateAsync`, `UpdateAsync`/`DeleteAsync`(`CanChange` = 관리자 또는 작성자). `builder.Services.AddScoped<PostService>();`(Day 23의 수명을 직접 등록). `Endpoints\PostEndpoints.cs`: 쿼리 매개변수에 `[Range]`(page 1~100000, pageSize 1~50), `ClaimsPrincipal user` → `user.FindFirstValue(ClaimTypes.NameIdentifier)`, `user.IsInRole(SeedData.AdminRole)`, 쓰기 3개 `.RequireAuthorization()`, `ToHttpResult`(204/404/403 `TypedResults.Forbid()`). 엔드포인트는 HTTP만, 규칙은 서비스에(Day 35 단위 테스트가 쉬워지는 이유). `.http`: 팬 두 명으로 403 확인.
- 이미 배운 것: 1:N·외래 키·Include [Day 22](#/day/p2-d22); 서비스 계층·의존성 주입·수명 [Day 23](#/day/p2-d23); 클레임·역할·RequireAuthorization [Day 26](#/day/p2-d26); Skip/Take·Select [Day 14](#/day/p2-d14); 열거형 [Day 10](#/day/p2-d10); 제네릭 [Day 6](#/day/p2-d06); record·생성자 [Day 12](#/day/p2-d12)
- 시작 상태: [Day 29](#/day/p2-d29)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`, `.gitignore`
  - `C:\dev\streamer-hub\client\`: `.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`, `vite.config.ts`
  - `C:\dev\streamer-hub\client\public\`: `favicon.svg`
  - `C:\dev\streamer-hub\client\src\`: `main.ts`, `style.css`, `types.ts`, `api.ts`, `ui.ts`, `router.ts`
  - `C:\dev\streamer-hub\client\src\pages\`: `home.ts`, `streamers.ts`, `streamerDetail.ts`, `schedule.ts`
  - `C:\dev\streamer-hub\server\`: `StreamerHub.slnx`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\`: `StreamerHub.Api.csproj`, `Program.cs`, `appsettings.json`, `appsettings.Development.json`, `StreamerHub.Api.http`, `bin\`, `obj\`, `streamerhub.db`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Data\`: `AppDbContext.cs`, `SeedData.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Dtos\`: `ScheduleDtos.cs`, `StreamerDtos.cs`, `AuthDtos.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Endpoints\`: `StreamerEndpoints.cs`, `ScheduleEndpoints.cs`, `AuthEndpoints.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Entities\`: `Streamer.cs`, `Schedule.cs`, `AppUser.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Migrations\`: `<시각>_InitialCreate.cs`, `<시각>_InitialCreate.Designer.cs`, `AppDbContextModelSnapshot.cs`, `<시각>_AddSchedules.cs`, `<시각>_AddSchedules.Designer.cs`, `<시각>_AddIdentity.cs`, `<시각>_AddIdentity.Designer.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Properties\`: `launchSettings.json`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Services\`: `ScheduleQuery.cs`
  - `%APPDATA%\Microsoft\UserSecrets\<UserSecretsId>\`: `secrets.json`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0), .NET 10 SDK(`dotnet --version` → `10.0.`으로 시작), VS Code C# 확장(`ms-dotnettools.csharp`), VS Code REST Client 확장(`humao.rest-client`), sqlite3(`sqlite3 --version`), dotnet-ef 10.0.14(`dotnet-ef --version`)
  - 실행 중이어야 할 것: 서버 `dotnet watch`(마이그레이션 동안만 끔)
- 오늘 만들/바꿀 파일:
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Api\Entities\Post.cs` — 게시글 (레퍼런스 `Entities/Post.cs`(같음))
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Data\AppDbContext.cs` — Posts DbSet (레퍼런스)
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Api\Migrations\<시각>_AddPosts.cs`, `<시각>_AddPosts.Designer.cs` — 마이그레이션 (레퍼런스 `Migrations/`)
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Migrations\AppDbContextModelSnapshot.cs` — 자동 (레퍼런스)
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Api\Dtos\PostDtos.cs` — PostRequest·PostListItem·PostDetail (레퍼런스(같음))
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Api\Dtos\PagedResult.cs` — `PagedResult<T>` (레퍼런스(같음))
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Api\Services\PostService.cs` — 게시판 규칙 (레퍼런스(같음))
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Api\Endpoints\PostEndpoints.cs` — 게시판 엔드포인트(요청 제한 없음) (레퍼런스(Day 34))
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Program.cs` — `AddScoped<PostService>()`, `MapPostEndpoints()` (레퍼런스)
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\StreamerHub.Api.http` — 글쓰기·고치기 (레퍼런스 `.http`)
- 끝 상태 확인: `GET /api/posts?page=1&pageSize=20` → `{ "items": [], "total": 0, "page": 1, "pageSize": 20 }`, 로그인 안 하고 POST → 401, 팬1 POST → 201 + Location, 팬2가 PUT → 403, 팬1 PUT → 204(`updatedAt` 채워짐), 관리자 DELETE → 204, `pageSize=100` → 400.
- 과제:
  1) `pageSize=2`로 글 3개를 1쪽·2쪽에 나눠 보기 (쉬움) → 최신 글 먼저, `total` 3
  2) 상세 `canEdit`이 로그인한 사람에 따라 바뀌는지 (보통) → 로그인 안 함 false, 작성자 true, 관리자 true
  3) `page=0` → 400 메시지 (쉬움) → "page는 1 이상으로 보내 주세요."
- 용어(사전 담당): 페이지네이션, 프로젝션
- 자주 막히는 곳 후보: 팬 계정 바꾸기: REST Client가 쿠키를 공유 → 로그아웃 후 다른 계정 로그인 / `Include(Author)` 빠짐 → `PostDetail.From`에서 NullReferenceException / `SQLite Error 19: 'FOREIGN KEY constraint failed'`(없는 사용자 Id) / `Forbid()`가 401·302로 보이는지 → 작성자 확인(쿠키 인증의 Forbid 동작) / `AddScoped` 빠짐 → `Unable to resolve service for type 'StreamerHub.Api.Services.PostService'`(작성자 원문 확인) / 마이그레이션 잊음 → `no such table: Posts`
- 레퍼런스 대응: 끝: `Post.cs`, `PostDtos.cs`, `PagedResult.cs`, `PostService.cs`는 레퍼런스와 같아요. 중간 단계 — `PostEndpoints.cs`(Day 34), `AppDbContext.cs`(Day 33), `Program.cs`(Day 33·34·38).

## Day 31 — 팬 게시판 화면 (120분)

- 목표: 로그인 쿠키는 HttpOnly라 JS가 못 읽으니 "누구인지"는 `/api/me`에 묻는다(204면 null). `src\auth.ts`(isAdmin 빼고 레퍼런스와 같음): `currentUser`, `listeners`(관찰자 패턴), `getCurrentUser`, `onAuthChange`, `loadCurrentUser`, `login`, `registerAndLogin`, `saveDisplayName`, `logout`. `api.ts`: `getJsonOrNull<T>`(204 → null), `postJson<T>`, 게시판 5개, `register`·`login`(`?useCookies=true`)·`logout`·`getMe`·`updateMe`. `types.ts`: `PostListItem`·`PostDetail`·`PostInput`·`Me`(`Paged<T>`는 Day 7부터 있음). `index.html`에 `<div id="auth-menu" class="auth-menu">`. `main.ts`: `renderAuthMenu`(틀은 고정 글자 innerHTML, 닉네임은 `textContent`), `start()`에서 `loadCurrentUser`를 try/catch, 주소 `/board`·`/board/new`(**`/board/:id`보다 먼저**)·`/board/:id`·`/board/:id/edit`·`/login`·`/register`. 화면 5개(모두 레퍼런스와 같음): `login.ts`(401 → "이메일 또는 비밀번호가 맞지 않아요." — 어느 쪽인지 숨김), `register.ts`(닉네임을 **trim한 뒤 2~20자인지 먼저 검사** — 서버는 trim하지 않음, 가입 → 로그인 → `PUT /api/me` 2단계, 닉네임 저장만 실패하면 이메일·비밀번호를 잠그고 "닉네임 다시 저장", Identity 오류 코드 → 한국어), `board.ts`(`?page=`, 이전/다음, 로그인 안 했으면 "로그인하고 글쓰기"), `postDetail.ts`(제목·본문 `textContent`, `canEdit`일 때만 수정·삭제 + `confirm`), `postForm.ts`(새 글·고치기 겸용, `value`로 채우기, 버튼 `disabled`로 두 번 전송 방지). `home.ts`에 새 글 5개(`Promise.all` 두 요청). `style.css`: 아래 파일 목록의 줄 범위. 이 Day에 처음 쓰는 것(P1에 없음)은 그 자리에서 정의한다: HTML 속성 **`minlength`·`maxlength`**(입력 글자 수의 최소·최대, `register.ts`의 닉네임·비밀번호, `postForm.ts`의 제목 100·본문 5000, Day 32~33 `admin.ts`도 씀 — 서버 검증과 같은 값), `button.disabled`, `confirm()`, `Math.ceil`·`Math.max`(전체 쪽 수), `Number.isInteger`, `'id' in params`(`in` 연산자).
- 이미 배운 것: 폼 검증·submit·`preventDefault`·`required`·`pattern` [P1 Day 24](#/day/p1-d24); `trim` [P1 Day 23](#/day/p1-d23); api.ts·ApiError [Day 27](#/day/p2-d27); 해시 라우터 [Day 28](#/day/p2-d28); Promise.all [Day 8](#/day/p2-d08); 게시판 API·canEdit [Day 30](#/day/p2-d30); /api/me 204·닉네임 [Day 26](#/day/p2-d26); 쿠키 로그인 [Day 25](#/day/p2-d25); 함수 타입 배열 [Day 6](#/day/p2-d06); 한국 시간 표시 [Day 29](#/day/p2-d29)
- 시작 상태: [Day 30](#/day/p2-d30)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`, `.gitignore`
  - `C:\dev\streamer-hub\client\`: `.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`, `vite.config.ts`
  - `C:\dev\streamer-hub\client\public\`: `favicon.svg`
  - `C:\dev\streamer-hub\client\src\`: `main.ts`, `style.css`, `types.ts`, `api.ts`, `ui.ts`, `router.ts`
  - `C:\dev\streamer-hub\client\src\pages\`: `home.ts`, `streamers.ts`, `streamerDetail.ts`, `schedule.ts`
  - `C:\dev\streamer-hub\server\`: `StreamerHub.slnx`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\`: `StreamerHub.Api.csproj`, `Program.cs`, `appsettings.json`, `appsettings.Development.json`, `StreamerHub.Api.http`, `bin\`, `obj\`, `streamerhub.db`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Data\`: `AppDbContext.cs`, `SeedData.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Dtos\`: `ScheduleDtos.cs`, `StreamerDtos.cs`, `AuthDtos.cs`, `PostDtos.cs`, `PagedResult.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Endpoints\`: `StreamerEndpoints.cs`, `ScheduleEndpoints.cs`, `AuthEndpoints.cs`, `PostEndpoints.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Entities\`: `Streamer.cs`, `Schedule.cs`, `AppUser.cs`, `Post.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Migrations\`: `<시각>_InitialCreate.cs`, `<시각>_InitialCreate.Designer.cs`, `AppDbContextModelSnapshot.cs`, `<시각>_AddSchedules.cs`, `<시각>_AddSchedules.Designer.cs`, `<시각>_AddIdentity.cs`, `<시각>_AddIdentity.Designer.cs`, `<시각>_AddPosts.cs`, `<시각>_AddPosts.Designer.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Properties\`: `launchSettings.json`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Services\`: `ScheduleQuery.cs`, `PostService.cs`
  - `%APPDATA%\Microsoft\UserSecrets\<UserSecretsId>\`: `secrets.json`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0), .NET 10 SDK(`dotnet --version` → `10.0.`으로 시작), VS Code C# 확장(`ms-dotnettools.csharp`), VS Code REST Client 확장(`humao.rest-client`), sqlite3(`sqlite3 --version`), dotnet-ef 10.0.14(`dotnet-ef --version`)
  - 실행 중이어야 할 것: 서버 `dotnet watch` + 클라이언트 `npm run dev`
- 오늘 만들/바꿀 파일:
  - 새로 `C:\dev\streamer-hub\client\src\auth.ts` — 로그인 상태(isAdmin 없음) (레퍼런스 `client/src/auth.ts`(Day 32 isAdmin))
  - 새로 `C:\dev\streamer-hub\client\src\pages\board.ts` — 게시판 목록 (레퍼런스(같음))
  - 새로 `C:\dev\streamer-hub\client\src\pages\postDetail.ts` — 글 상세 (레퍼런스(같음))
  - 새로 `C:\dev\streamer-hub\client\src\pages\postForm.ts` — 글쓰기·고치기 (레퍼런스(같음))
  - 새로 `C:\dev\streamer-hub\client\src\pages\login.ts` — 로그인 (레퍼런스(같음))
  - 새로 `C:\dev\streamer-hub\client\src\pages\register.ts` — 가입 (레퍼런스(같음))
  - 바꿈 `C:\dev\streamer-hub\client\src\api.ts` — getJsonOrNull·postJson·게시판·가입/로그인 함수 (레퍼런스(Day 32·33))
  - 바꿈 `C:\dev\streamer-hub\client\src\types.ts` — PostListItem·PostDetail·PostInput·Me (레퍼런스(Day 32·33))
  - 바꿈 `C:\dev\streamer-hub\client\index.html` — `#auth-menu` (레퍼런스(Day 32 admin-link))
  - 바꿈 `C:\dev\streamer-hub\client\src\main.ts` — 로그인 메뉴·게시판·로그인·가입 주소 (레퍼런스(Day 32))
  - 바꿈 `C:\dev\streamer-hub\client\src\pages\home.ts` — 새 글 5개 + Promise.all (레퍼런스 `home.ts`(같음))
  - 바꿈 `C:\dev\streamer-hub\client\src\style.css` — 레퍼런스 128~134줄(`.auth-menu`), 162~167(`.button.danger`), 173~177(`.button:disabled`), 228~244(폼 주석, `.form`, `.form.narrow`, `.form label`), 256~261(`.hint`), 334~360(`.page-head`, `.post-list .post-title`, `.post-body`, `.pagination`) (레퍼런스(Day 32))
- 끝 상태 확인: 가입하면 오른쪽 위에 "닉네임님 로그아웃". 글쓰기 → 상세 화면, 다른 계정으로 보면 수정·삭제 버튼 없음. 제목에 `<b>굵게</b>`를 써도 글자 그대로. 로그아웃하면 "로그인하고 글쓰기". 새로 고쳐도 로그인 유지(쿠키). 콘솔 오류 0(로그인 안 한 상태 포함).
- 과제:
  1) 닉네임 `" a "`로 가입 시도 → 요청을 보내지 않고 안내 (보통) → trim 후 길이 검사(레퍼런스 register.ts)
  2) 남의 글 주소 `#/board/<id>/edit`를 직접 열기 (쉬움) → "내가 쓴 글만 고칠 수 있어요."·버튼 비활성
  3) 글 21개 이상일 때 다음 쪽 링크 (보통) → `totalPages = Math.max(1, Math.ceil(total / pageSize))`
- 용어(사전 담당): 관찰자 패턴
- 자주 막히는 곳 후보: `/board/new`가 `/board/:id`에 먼저 걸려 "찾을 수 없어요" → 등록 순서 / 쿠키가 안 붙음 → 5250을 직접 연 것은 아닌지(개발 중 화면은 5173, 프록시) / 비밀번호 규칙 오류 → `registerErrorMessage`의 한국어 문장 / 서버가 꺼져 메뉴가 안 그려짐 → start()의 try/catch / 줄바꿈이 한 줄로 보임 → `.post-body { white-space: pre-wrap; }` / 가입은 됐는데 닉네임 저장 실패 → "닉네임 다시 저장" 흐름(레퍼런스 README 설계 메모)
- 레퍼런스 대응: 끝: `pages/board.ts`·`postDetail.ts`·`postForm.ts`·`login.ts`·`register.ts`·`home.ts`는 레퍼런스와 같아요. 중간 단계 — `auth.ts`(Day 32), `api.ts`·`types.ts`(Day 32·33), `index.html`·`main.ts`·`style.css`(Day 32).

## Day 32 — 관리자 화면 (120분)

- 목표: 역할 기반 UI: `auth.ts`에 `isAdmin()`, `index.html`에 `<li id="admin-link" hidden>`, `main.ts`에서 `adminLink.hidden = !isAdmin()`과 `addRoute('/admin', renderAdmin)`. **숨기는 것은 친절일 뿐, 진짜로 막는 것은 서버(403)** — 팬 계정으로 콘솔 `fetch('/api/streamers', { method: 'POST', … })` → 403 실험. `types.ts` `StreamerInput`·`ScheduleInput`, `api.ts` 스트리머·일정 등록/수정/삭제 6개, `ui.ts` `kstInputToUtcIso`·`utcIsoToKstInput`(`<input type="datetime-local">`은 한국 시간으로 입력받고 서버에는 UTC로). `pages\admin.ts`(공지 패널 빼고 레퍼런스와 같음): 관리자가 아니면 안내 문장, 스트리머 폼(숨은 칸 `type="hidden"`에 id → 비었으면 등록·있으면 수정, 사진 주소 빈칸 → `null`, `select` 값 `as Platform`), 일정 폼, `reloadLists`(Promise.all, 고르던 스트리머 유지), `createAdminRow`(수정·삭제 버튼, `confirm`, 실패하면 `alert`). `style.css`: 레퍼런스 168~172줄(`.button.small`)과 411~428줄(`.panel`~`.admin-row-text`). Day 7·8·28·29·31·32에 나눠 넣은 줄 범위를 합치면 레퍼런스 1~428줄 전체가 돼요.
- 이미 배운 것: 역할·정책·403 [Day 26](#/day/p2-d26); 관리자 API·검증 [Day 23](#/day/p2-d23); 폼 화면·auth.ts [Day 31](#/day/p2-d31); UTC·KST 도우미 [Day 29](#/day/p2-d29); 타입 단언 `as` [Day 7](#/day/p2-d07); 옵셔널 체이닝·null 병합 [Day 5](#/day/p2-d05); Promise.all [Day 8](#/day/p2-d08)
- 시작 상태: [Day 31](#/day/p2-d31)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`, `.gitignore`
  - `C:\dev\streamer-hub\client\`: `.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`, `vite.config.ts`
  - `C:\dev\streamer-hub\client\public\`: `favicon.svg`
  - `C:\dev\streamer-hub\client\src\`: `main.ts`, `style.css`, `types.ts`, `api.ts`, `ui.ts`, `router.ts`, `auth.ts`
  - `C:\dev\streamer-hub\client\src\pages\`: `home.ts`, `streamers.ts`, `streamerDetail.ts`, `schedule.ts`, `board.ts`, `postDetail.ts`, `postForm.ts`, `login.ts`, `register.ts`
  - `C:\dev\streamer-hub\server\`: `StreamerHub.slnx`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\`: `StreamerHub.Api.csproj`, `Program.cs`, `appsettings.json`, `appsettings.Development.json`, `StreamerHub.Api.http`, `bin\`, `obj\`, `streamerhub.db`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Data\`: `AppDbContext.cs`, `SeedData.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Dtos\`: `ScheduleDtos.cs`, `StreamerDtos.cs`, `AuthDtos.cs`, `PostDtos.cs`, `PagedResult.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Endpoints\`: `StreamerEndpoints.cs`, `ScheduleEndpoints.cs`, `AuthEndpoints.cs`, `PostEndpoints.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Entities\`: `Streamer.cs`, `Schedule.cs`, `AppUser.cs`, `Post.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Migrations\`: `<시각>_InitialCreate.cs`, `<시각>_InitialCreate.Designer.cs`, `AppDbContextModelSnapshot.cs`, `<시각>_AddSchedules.cs`, `<시각>_AddSchedules.Designer.cs`, `<시각>_AddIdentity.cs`, `<시각>_AddIdentity.Designer.cs`, `<시각>_AddPosts.cs`, `<시각>_AddPosts.Designer.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Properties\`: `launchSettings.json`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Services\`: `ScheduleQuery.cs`, `PostService.cs`
  - `%APPDATA%\Microsoft\UserSecrets\<UserSecretsId>\`: `secrets.json`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0), .NET 10 SDK(`dotnet --version` → `10.0.`으로 시작), VS Code C# 확장(`ms-dotnettools.csharp`), VS Code REST Client 확장(`humao.rest-client`), sqlite3(`sqlite3 --version`), dotnet-ef 10.0.14(`dotnet-ef --version`)
  - 실행 중이어야 할 것: 서버 `dotnet watch` + 클라이언트 `npm run dev`
- 오늘 만들/바꿀 파일:
  - 새로 `C:\dev\streamer-hub\client\src\pages\admin.ts` — 스트리머·일정 관리(공지 패널 없음) (레퍼런스 `pages/admin.ts`(Day 33 공지))
  - 바꿈 `C:\dev\streamer-hub\client\src\auth.ts` — `isAdmin()` (레퍼런스(같음))
  - 바꿈 `C:\dev\streamer-hub\client\index.html` — `#admin-link` (레퍼런스(같음))
  - 바꿈 `C:\dev\streamer-hub\client\src\main.ts` — adminLink·`/admin` (레퍼런스(같음))
  - 바꿈 `C:\dev\streamer-hub\client\src\api.ts` — 관리자 함수 6개 (레퍼런스(Day 33))
  - 바꿈 `C:\dev\streamer-hub\client\src\types.ts` — StreamerInput·ScheduleInput (레퍼런스(Day 33))
  - 바꿈 `C:\dev\streamer-hub\client\src\ui.ts` — datetime-local 변환 2개 (레퍼런스(Day 34))
  - 바꿈 `C:\dev\streamer-hub\client\src\style.css` — 레퍼런스 168~172줄(`.button.small`), 411~428줄(`.panel`, `.panel h2`, `.admin-list li`, `.admin-row-text`) — 이제 style.css 전체가 레퍼런스와 같음 (레퍼런스(같음))
- 끝 상태 확인: 관리자로 로그인하면 메뉴 "관리자"가 보이고, 스트리머 등록 → 목록·스트리머 페이지에 보임. 일정에 한국 시간 20:00 입력 → 방송 일정 페이지에 "오후 8:00". 팬은 메뉴가 없고 `#/admin`은 안내 문장, 콘솔 POST는 403.
- 과제:
  1) 팬 계정으로 콘솔에서 스트리머 등록 요청 → 403 (보통) → `fetch('/api/streamers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({…}) })`
  2) 스트리머를 지우면 그 일정도 관리자 목록에서 사라지는지 (쉬움) → 계단식 삭제(Day 22)
  3) 일정 "수정"을 누르면 입력칸에 한국 시간이 채워지는 이유 (보통) → `utcIsoToKstInput`이 9시간 더한 뒤 앞 16글자
- 용어(사전 담당): 역할 기반 접근 제어
- 자주 막히는 곳 후보: 관리자 메뉴가 안 보임 → 역할이 생기기 전 쿠키 → 로그아웃 후 다시 로그인 / datetime-local이 비어 `RangeError: Invalid time value` → `required` / `select` 값은 문자열 → `Number()` / 400 검증 메시지가 여러 개 → `toApiError`가 이어 붙임 / `https://`만 넣은 채널 주소가 통과 → Day 34 / 일정 목록은 앞으로 60일만
- 레퍼런스 대응: 끝: `auth.ts`, `index.html`, `main.ts`, `style.css`는 레퍼런스와 같아요. 중간 단계 — `admin.ts`(Day 33 공지 패널), `api.ts`·`types.ts`(Day 33), `ui.ts`(Day 34).

## Day 33 — 실시간 공지 오버레이 (120분)

- 목표: 서버: `Entities\Notice.cs`(Message ≤200), `Notices` DbSet, `dotnet ef migrations add AddNotices`, `Dtos\NoticeDtos.cs`(`NoticeRequest`, `NoticeResponse.From`), `Endpoints\NoticeEndpoints.cs`의 `GET /current`(가장 최근, 없으면 204)·`POST /`(Admin, 201). 클라이언트: `client\overlay.html`(레퍼런스와 같음 — 배경 투명, 아래쪽 공지 상자, P1 Day 27 오버레이와 비교), `types.ts` `Notice`, `api.ts` `getCurrentNotice`(getJsonOrNull)·`createNotice`, `admin.ts` 공지 패널(지금 공지, 새 공지 폼, OBS 주소 `${location.origin}/overlay.html`. 지금 공지는 `await` 대신 `.then(…).catch(…)`로 이어 받으므로 이 문법을 처음 소개하고 await와 같은 뜻임을 비교). 첫 `overlay.ts` = **폴링**(`setInterval` 3초마다 `getCurrentNotice`) → Network에 요청이 계속 쌓이는 단점. 다음 = **SSE**: `Services\NoticeBroadcaster.cs`(레퍼런스와 같음 — 오버레이마다 우편함(Channel), `lock`, Subscribe/Unsubscribe/Publish, 서버가 꺼질 때 CloseAll. Channel·`IHostApplicationLifetime`·`await foreach`(값이 들어올 때마다 하나씩 꺼내는 비동기 반복)·`CancellationToken`(브라우저가 연결을 끊었다는 신호)은 `:::info 읽기만 하고 나중에 이해해요` 상자에서 이름과 한 줄 뜻만), `builder.Services.AddSingleton<NoticeBroadcaster>();`(앱 전체에 하나), `GET /stream` = `TypedResults.ServerSentEvents(ReadNoticesAsync(…), eventType: "notice")`, `IAsyncEnumerable` + `yield return`(먼저 우편함 등록 → 지금 공지부터 보냄 → 새 공지 기다리기 → finally에서 치우기, `[EnumeratorCancellation]`은 읽기만), POST가 `broadcaster.Publish`. `overlay.ts`를 `EventSource` 버전(레퍼런스와 같음, 폴링 코드는 주석으로 남음)으로 바꾼다. OBS: 소스 추가 → 브라우저 → URL `http://localhost:5173/overlay.html`, 1920×1080.
- 이미 배운 것: OBS 브라우저 소스·투명 배경·`setInterval` [P1 Day 26](#/day/p1-d26)·[P1 Day 27](#/day/p1-d27); 관리자 화면·api.ts [Day 32](#/day/p2-d32); 서비스 수명 Singleton [Day 23](#/day/p2-d23); Task·async·finally [Day 15](#/day/p2-d15); List [Day 11](#/day/p2-d11); 204·getJsonOrNull [Day 26](#/day/p2-d26)·[Day 31](#/day/p2-d31); 마이그레이션 [Day 20](#/day/p2-d20)
- 시작 상태: [Day 32](#/day/p2-d32)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`, `.gitignore`
  - `C:\dev\streamer-hub\client\`: `.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`, `vite.config.ts`
  - `C:\dev\streamer-hub\client\public\`: `favicon.svg`
  - `C:\dev\streamer-hub\client\src\`: `main.ts`, `style.css`, `types.ts`, `api.ts`, `ui.ts`, `router.ts`, `auth.ts`
  - `C:\dev\streamer-hub\client\src\pages\`: `home.ts`, `streamers.ts`, `streamerDetail.ts`, `schedule.ts`, `board.ts`, `postDetail.ts`, `postForm.ts`, `login.ts`, `register.ts`, `admin.ts`
  - `C:\dev\streamer-hub\server\`: `StreamerHub.slnx`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\`: `StreamerHub.Api.csproj`, `Program.cs`, `appsettings.json`, `appsettings.Development.json`, `StreamerHub.Api.http`, `bin\`, `obj\`, `streamerhub.db`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Data\`: `AppDbContext.cs`, `SeedData.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Dtos\`: `ScheduleDtos.cs`, `StreamerDtos.cs`, `AuthDtos.cs`, `PostDtos.cs`, `PagedResult.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Endpoints\`: `StreamerEndpoints.cs`, `ScheduleEndpoints.cs`, `AuthEndpoints.cs`, `PostEndpoints.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Entities\`: `Streamer.cs`, `Schedule.cs`, `AppUser.cs`, `Post.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Migrations\`: `<시각>_InitialCreate.cs`, `<시각>_InitialCreate.Designer.cs`, `AppDbContextModelSnapshot.cs`, `<시각>_AddSchedules.cs`, `<시각>_AddSchedules.Designer.cs`, `<시각>_AddIdentity.cs`, `<시각>_AddIdentity.Designer.cs`, `<시각>_AddPosts.cs`, `<시각>_AddPosts.Designer.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Properties\`: `launchSettings.json`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Services\`: `ScheduleQuery.cs`, `PostService.cs`
  - `%APPDATA%\Microsoft\UserSecrets\<UserSecretsId>\`: `secrets.json`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0), .NET 10 SDK(`dotnet --version` → `10.0.`으로 시작), VS Code C# 확장(`ms-dotnettools.csharp`), VS Code REST Client 확장(`humao.rest-client`), sqlite3(`sqlite3 --version`), dotnet-ef 10.0.14(`dotnet-ef --version`)
  - 실행 중이어야 할 것: 서버 `dotnet watch` + 클라이언트 `npm run dev` + OBS(선택)
- 오늘 만들/바꿀 파일:
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Api\Entities\Notice.cs` — 공지 (레퍼런스(같음))
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Data\AppDbContext.cs` — Notices DbSet (레퍼런스(같음))
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Api\Migrations\<시각>_AddNotices.cs`, `<시각>_AddNotices.Designer.cs` — 마이그레이션 (레퍼런스 `Migrations/`)
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Migrations\AppDbContextModelSnapshot.cs` — 자동 (레퍼런스)
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Api\Dtos\NoticeDtos.cs` — 요청·응답 (레퍼런스(같음))
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Api\Endpoints\NoticeEndpoints.cs` — /current·/stream·POST(요청 제한 없음) (레퍼런스(Day 34))
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Api\Services\NoticeBroadcaster.cs` — SSE 방송실 (레퍼런스(같음))
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Program.cs` — AddSingleton, MapNoticeEndpoints (레퍼런스)
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\StreamerHub.Api.http` — 지금 공지·공지 올리기 (레퍼런스)
  - 새로 `C:\dev\streamer-hub\client\overlay.html` — OBS 오버레이 페이지 (레퍼런스(같음))
  - 새로 `C:\dev\streamer-hub\client\src\overlay.ts` — 폴링 → SSE (레퍼런스(같음))
  - 바꿈 `C:\dev\streamer-hub\client\src\pages\admin.ts` — 공지 패널 (레퍼런스(같음))
  - 바꿈 `C:\dev\streamer-hub\client\src\api.ts` — 공지 함수 (레퍼런스(같음))
  - 바꿈 `C:\dev\streamer-hub\client\src\types.ts` — Notice (레퍼런스(같음))
- 끝 상태 확인: 관리자 화면에서 공지를 올리면 다른 창의 `http://localhost:5173/overlay.html`에 1초 안에 뜬다. Network에 `stream` 요청 하나(Type `eventsource`)만 열려 있다. OBS 미리보기에서 배경이 투명하다. 서버 `Ctrl + C`가 바로 끝난다.
- 과제:
  1) 폴링(3초) vs SSE 비교 표(요청 수·지연·서버 부담) (쉬움) → 폴링은 공지가 없어도 계속 요청, SSE는 연결 하나로 즉시
  2) 201자 공지 → 400 (쉬움) → `[StringLength(200)]` 메시지(관리자 입력칸 `maxlength`를 개발자 도구로 지우고 시험)
  3) 오버레이 창 두 개가 모두 받는지 (보통) → Broadcaster가 우편함마다 넣어 줌
- 용어(사전 담당): 폴링, SSE, EventSource, lock, yield return
- 자주 막히는 곳 후보: 공지가 하나도 없으면 EventSource가 연결 중(CONNECTING)으로 기다림 → 정상(첫 이벤트 전에는 응답 머리가 안 옴, T13 확인) / OBS에서 흰 배경 → `html, body { background: transparent; }`, OBS 사용자 지정 CSS / 폴링 코드를 지우지 않아 두 번 표시 / OBS URL을 5250으로 넣음 → 개발 중에는 5173(빌드 후 5250은 Day 38) / 서버가 바로 안 꺼짐 → CloseAll 등록 확인 / `AddSingleton` 빠짐 → 서비스를 찾을 수 없다는 오류
- 레퍼런스 대응: 끝: `Notice.cs`, `NoticeDtos.cs`, `NoticeBroadcaster.cs`, `AppDbContext.cs`, `overlay.html`, `overlay.ts`, `admin.ts`, `api.ts`, `types.ts`는 레퍼런스와 같아요. 중간 단계 — `NoticeEndpoints.cs`(Day 34), `Program.cs`(Day 34·38).

## Day 34 — 보안 점검 (120분)

- 목표: 점검표 순서로 "공격 → 확인 → 방어"를 한다. ① **XSS**: 게시글 제목에 `<img src=x onerror=alert(1)>` → 글자로만 보임(textContent). 연습 파일 `C:\dev\security-practice\xss.html`에서만 `innerHTML`에 넣으면 실행되는 것을 보고, 프로젝트에서 `Ctrl + Shift + F`로 `innerHTML`을 찾아 고정 글자만 넣는지 감사. ② **위험한 주소**: `[Url]`은 `javascript:alert(1)`은 막지만 `ftp://…`와 `https://`만 쓴 값은 통과 → `Dtos\HttpUrlAttribute.cs`(`: ValidationAttribute`, `override IsValid`, `value is string text`, `Uri.TryCreate(…, out var uri)`, http·https·호스트 확인 — Day 11·13 문법 복습) → `StreamerRequest`의 `[Url]`을 `[HttpUrl]`로. 화면도 `ui.ts` `isHttpUrl`(`new URL`)로 `createAvatar`·`streamerDetail` 채널 링크를 한 번 더 검사(이중 방어). ③ **CSRF·SameSite·HttpOnly**: `Program.cs` `ConfigureApplicationCookie`(HttpOnly, `SameSiteMode.Lax` 명시). 개발자 도구 Application → Cookies에서 표시 확인, 콘솔 `document.cookie`에 로그인 쿠키가 없음. 작은 실험: `C:\dev\security-practice\evil.html`(다른 출처에서 연 폼 POST)이 쿠키 없이 가거나 JSON이 아니라 처리되지 않는 것을 Network로 확인(실험 내용과 결과 원문은 작성자가 실행해 확정). 이 방어는 Vite 프록시(같은 출처)와 SameSite=Lax 덕분이라 코드에 "CSRF 코드"가 따로 없다는 설명. ④ **SQL 인젝션**: `?q=' OR 1=1 --` → SQL 로그에서 매개변수로 들어가 안전, 문자열 이어 붙이기의 위험은 Day 19 `practice.db`에서만 보기. ⑤ **요청 제한**: `AddRateLimiter`(IP마다 고정 창, `RateLimit:PermitLimit`·`WindowSeconds` 설정 30/60), `RejectionStatusCode = 429`, `app.UseRateLimiter()`, 모든 쓰기·`/api/auth` 그룹·`PUT /api/me`에 `.RequireRateLimiting("write")`, `appsettings.json`에 `RateLimit`. 전역 창이 아니라 IP마다인 이유. ⑥ **HTTPS**: `dotnet dev-certs https --trust`(확인 창 "예"), `dotnet run --urls https://localhost:7250`로 잠깐 켜서 자물쇠 확인 후 원래대로(launchSettings는 http만 유지), 배포에서는 호스팅·리버스 프록시가 HTTPS(Day 39). ⑦ 비밀 값 점검 `git grep -i password`, 관리자 시드 비밀번호 확인 복습(Day 26).
- 이미 배운 것: `textContent` [P1 Day 20](#/day/p1-d20); innerHTML 규칙 [Day 7](#/day/p2-d07); 특성·검증·AddValidation [Day 23](#/day/p2-d23); 상속·override·패턴 매칭 [Day 13](#/day/p2-d13); out 매개변수 [Day 11](#/day/p2-d11); 쿠키·인증 [Day 25](#/day/p2-d25); 출처·CORS·프록시 [Day 27](#/day/p2-d27); SQL 로그 [Day 21](#/day/p2-d21); 구성 [Day 24](#/day/p2-d24); user-secrets·관리자 시드 [Day 26](#/day/p2-d26); Live Preview [P1 Day 2](#/day/p1-d02)
- 시작 상태: [Day 33](#/day/p2-d33)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`, `.gitignore`
  - `C:\dev\streamer-hub\client\`: `.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`, `vite.config.ts`, `overlay.html`
  - `C:\dev\streamer-hub\client\public\`: `favicon.svg`
  - `C:\dev\streamer-hub\client\src\`: `main.ts`, `style.css`, `types.ts`, `api.ts`, `ui.ts`, `router.ts`, `auth.ts`, `overlay.ts`
  - `C:\dev\streamer-hub\client\src\pages\`: `home.ts`, `streamers.ts`, `streamerDetail.ts`, `schedule.ts`, `board.ts`, `postDetail.ts`, `postForm.ts`, `login.ts`, `register.ts`, `admin.ts`
  - `C:\dev\streamer-hub\server\`: `StreamerHub.slnx`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\`: `StreamerHub.Api.csproj`, `Program.cs`, `appsettings.json`, `appsettings.Development.json`, `StreamerHub.Api.http`, `bin\`, `obj\`, `streamerhub.db`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Data\`: `AppDbContext.cs`, `SeedData.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Dtos\`: `ScheduleDtos.cs`, `StreamerDtos.cs`, `AuthDtos.cs`, `PostDtos.cs`, `PagedResult.cs`, `NoticeDtos.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Endpoints\`: `StreamerEndpoints.cs`, `ScheduleEndpoints.cs`, `AuthEndpoints.cs`, `PostEndpoints.cs`, `NoticeEndpoints.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Entities\`: `Streamer.cs`, `Schedule.cs`, `AppUser.cs`, `Post.cs`, `Notice.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Migrations\`: `<시각>_InitialCreate.cs`, `<시각>_InitialCreate.Designer.cs`, `AppDbContextModelSnapshot.cs`, `<시각>_AddSchedules.cs`, `<시각>_AddSchedules.Designer.cs`, `<시각>_AddIdentity.cs`, `<시각>_AddIdentity.Designer.cs`, `<시각>_AddPosts.cs`, `<시각>_AddPosts.Designer.cs`, `<시각>_AddNotices.cs`, `<시각>_AddNotices.Designer.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Properties\`: `launchSettings.json`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Services\`: `ScheduleQuery.cs`, `PostService.cs`, `NoticeBroadcaster.cs`
  - `C:\dev\sql-practice\`: `practice.sql`, `practice.db`
  - `%APPDATA%\Microsoft\UserSecrets\<UserSecretsId>\`: `secrets.json`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0), .NET 10 SDK(`dotnet --version` → `10.0.`으로 시작), VS Code C# 확장(`ms-dotnettools.csharp`), VS Code REST Client 확장(`humao.rest-client`), sqlite3(`sqlite3 --version`), dotnet-ef 10.0.14(`dotnet-ef --version`), OBS Studio(P1 Day 27에서 설치, 선택)
  - 실행 중이어야 할 것: 서버 `dotnet watch` + 클라이언트 `npm run dev`
- 오늘 만들/바꿀 파일:
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Api\Dtos\HttpUrlAttribute.cs` — 직접 만든 검증 특성 (레퍼런스(같음))
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Dtos\StreamerDtos.cs` — `[Url]` → `[HttpUrl]` (레퍼런스(같음))
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Program.cs` — ConfigureApplicationCookie, AddRateLimiter, UseRateLimiter (레퍼런스(Day 38))
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\appsettings.json` — `RateLimit` (레퍼런스(같음))
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Endpoints\StreamerEndpoints.cs` — `RequireRateLimiting("write")`, SQL 인젝션 주석 (레퍼런스(같음))
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Endpoints\ScheduleEndpoints.cs` — `RequireRateLimiting("write")` (레퍼런스(같음))
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Endpoints\PostEndpoints.cs` — `RequireRateLimiting("write")` (레퍼런스(같음))
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Endpoints\NoticeEndpoints.cs` — `RequireRateLimiting("write")` (레퍼런스(같음))
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Endpoints\AuthEndpoints.cs` — 그룹·PUT /api/me에 요청 제한 (레퍼런스(같음))
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\StreamerHub.Api.http` — 검증 실패 예(`javascript:`·`twitch`·빈 이름) (레퍼런스(같음))
  - 바꿈 `C:\dev\streamer-hub\client\src\ui.ts` — `isHttpUrl`, createAvatar 검사 (레퍼런스(같음))
  - 바꿈 `C:\dev\streamer-hub\client\src\pages\streamerDetail.ts` — 채널 링크 검사 (레퍼런스(같음))
  - 새로 `C:\dev\security-practice\xss.html`, `evil.html` — 실험 파일(프로젝트 밖) (없음(연습))
- 끝 상태 확인: 채널 주소 `ftp://example.com` → 400 "채널 주소는 https://로 시작하는 주소로 써 주세요.", 1분에 31번째 쓰기 요청 → 429와 화면 문장 "요청이 너무 많아요…", 쿠키 표에 HttpOnly ✓·SameSite Lax, 스크립트를 넣은 글이 글자로 보인다.
- 과제:
  1) 보안 점검표(위협 → 우리 방어 → 파일) 7줄 채우기 (보통) → XSS→textContent(pages/*.ts), 위험 주소→[HttpUrl]+isHttpUrl, CSRF→SameSite=Lax+JSON+같은 출처, 쿠키 탈취→HttpOnly, SQL 인젝션→EF 매개변수, 무차별 대입→요청 제한, 관리자 선가입→CheckPasswordAsync
  2) `https://`만 쓴 주소가 거절되는 이유 (쉬움) → 호스트가 빈칸(`uri.Host != ""`)
  3) 요청 제한을 모두가 한 창을 같이 쓰게 하면 생기는 일 (보통) → 한 사람이 다른 사람의 로그인까지 막음(레퍼런스 README 설계 메모)
- 용어(사전 담당): XSS, CSRF, SameSite, HttpOnly, SQL 인젝션, 요청 제한, 개발 인증서
- 자주 막히는 곳 후보: `dotnet dev-certs https --trust` 확인 창에서 "아니요" → 다시 실행(창 문구는 버전에 따라 다를 수 있음, 작성자 확인) / 인증서를 믿게 한 뒤에도 브라우저 경고 → 브라우저 다시 시작 / 429 뒤에는 1분 기다리기 / 실험하려고 PermitLimit을 낮춘 값을 되돌리지 않음 / `[HttpUrl]` ↔ 클래스 이름 `HttpUrlAttribute`(Attribute 접미사 생략 규칙) / 실험 파일을 프로젝트 폴더 안에 만들어 커밋함 → `C:\dev\security-practice`
- 레퍼런스 대응: 끝: `HttpUrlAttribute.cs`, `StreamerDtos.cs`, `appsettings.json`, Endpoints 5개, `ui.ts`, `streamerDetail.ts`, `StreamerHub.Api.http`는 레퍼런스와 같아요. 중간 단계 — `Program.cs`(Day 38). CORS·CSRF·HTTPS 실험은 코드에 남지 않아요(레퍼런스 README 설계 메모와 대응).

## Day 35 — 단위 테스트 (110분)

- 목표: 손으로 `.http`를 반복하는 대신 자동 테스트. 단위 vs 통합(Day 36) 그림. `cd C:\dev\streamer-hub\server` → `dotnet new xunit -n StreamerHub.Tests` → `dotnet sln add StreamerHub.Tests` → `dotnet add StreamerHub.Tests reference StreamerHub.Api`(ProjectReference) → `UnitTest1.cs` 지우기. 템플릿 패키지(xunit 2.9.3, Microsoft.NET.Test.Sdk 17.14.1, xunit.runner.visualstudio, coverlet.collector)는 그대로. `[Fact]`, `Assert.Equal/True/False/Null/Single/Contains/Empty`, 준비-실행-확인(AAA). `TestDb.cs`(`Data Source=:memory:` 연결을 열어 두는 동안만 DB, `Context.Database.Migrate()` — 실제 마이그레이션 그대로, `sealed`·`IDisposable`), `PostServiceTests`(남의 글 수정 → Forbidden + DB 그대로 `AsNoTracking`), `ScheduleQueryTests`(한국 하루 → UTC 범위, 경계값 4개, `AsQueryable`), `StreamerValidationTests`(`Validator.TryValidateObject`, `[Theory]` + `[InlineData]` 4개, `with` 식). `dotnet test` 출력 읽기 → 일부러 `CanChange`를 망가뜨려 `Assert.Equal() Failure` 보기(RED) → 되돌리기. 테스트 이름 규칙(무엇_상황_결과).
- 이미 배운 것: PostService [Day 30](#/day/p2-d30); ScheduleQuery·UTC [Day 23](#/day/p2-d23)·[Day 29](#/day/p2-d29); 검증 특성·HttpUrl [Day 23](#/day/p2-d23)·[Day 34](#/day/p2-d34); record `with` [Day 12](#/day/p2-d12); IDisposable·using [Day 13](#/day/p2-d13)·[Day 15](#/day/p2-d15); 솔루션 [Day 17](#/day/p2-d17); 마이그레이션 [Day 20](#/day/p2-d20)
- 시작 상태: [Day 34](#/day/p2-d34)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`, `.gitignore`
  - `C:\dev\streamer-hub\client\`: `.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`, `vite.config.ts`, `overlay.html`
  - `C:\dev\streamer-hub\client\public\`: `favicon.svg`
  - `C:\dev\streamer-hub\client\src\`: `main.ts`, `style.css`, `types.ts`, `api.ts`, `ui.ts`, `router.ts`, `auth.ts`, `overlay.ts`
  - `C:\dev\streamer-hub\client\src\pages\`: `home.ts`, `streamers.ts`, `streamerDetail.ts`, `schedule.ts`, `board.ts`, `postDetail.ts`, `postForm.ts`, `login.ts`, `register.ts`, `admin.ts`
  - `C:\dev\streamer-hub\server\`: `StreamerHub.slnx`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\`: `StreamerHub.Api.csproj`, `Program.cs`, `appsettings.json`, `appsettings.Development.json`, `StreamerHub.Api.http`, `bin\`, `obj\`, `streamerhub.db`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Data\`: `AppDbContext.cs`, `SeedData.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Dtos\`: `ScheduleDtos.cs`, `StreamerDtos.cs`, `AuthDtos.cs`, `PostDtos.cs`, `PagedResult.cs`, `NoticeDtos.cs`, `HttpUrlAttribute.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Endpoints\`: `StreamerEndpoints.cs`, `ScheduleEndpoints.cs`, `AuthEndpoints.cs`, `PostEndpoints.cs`, `NoticeEndpoints.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Entities\`: `Streamer.cs`, `Schedule.cs`, `AppUser.cs`, `Post.cs`, `Notice.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Migrations\`: `<시각>_InitialCreate.cs`, `<시각>_InitialCreate.Designer.cs`, `AppDbContextModelSnapshot.cs`, `<시각>_AddSchedules.cs`, `<시각>_AddSchedules.Designer.cs`, `<시각>_AddIdentity.cs`, `<시각>_AddIdentity.Designer.cs`, `<시각>_AddPosts.cs`, `<시각>_AddPosts.Designer.cs`, `<시각>_AddNotices.cs`, `<시각>_AddNotices.Designer.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Properties\`: `launchSettings.json`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Services\`: `ScheduleQuery.cs`, `PostService.cs`, `NoticeBroadcaster.cs`
  - `%APPDATA%\Microsoft\UserSecrets\<UserSecretsId>\`: `secrets.json`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0), .NET 10 SDK(`dotnet --version` → `10.0.`으로 시작), VS Code C# 확장(`ms-dotnettools.csharp`), VS Code REST Client 확장(`humao.rest-client`), sqlite3(`sqlite3 --version`), dotnet-ef 10.0.14(`dotnet-ef --version`), OBS Studio(P1 Day 27에서 설치, 선택)
  - 실행 중이어야 할 것: 서버는 꺼 둬요(테스트 빌드와 파일 잠금 충돌 방지)
- 오늘 만들/바꿀 파일:
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Tests\StreamerHub.Tests.csproj` — 템플릿 + Api ProjectReference (레퍼런스(Day 36 Mvc.Testing))
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Tests\TestDb.cs` — 메모리 SQLite (레퍼런스(같음))
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Tests\PostServiceTests.cs` — 1개 (레퍼런스(같음))
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Tests\ScheduleQueryTests.cs` — 1개 (레퍼런스(같음))
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Tests\StreamerValidationTests.cs` — Fact 2 + Theory 4 (레퍼런스(같음))
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Tests\bin\`, `obj\` — 빌드 결과 (—)
  - 삭제 `C:\dev\streamer-hub\server\StreamerHub.Tests\UnitTest1.cs` — 템플릿 예제 삭제 (—)
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.slnx` — Tests 프로젝트 추가 (레퍼런스(같음))
- 끝 상태 확인: `C:\dev\streamer-hub\server`에서 `dotnet test` → `Passed!  - Failed: 0, Passed: 8, Skipped: 0, Total: 8`(숫자는 작성자가 확인). 일부러 망가뜨리면 `Failed!`와 실패한 테스트 이름이 보인다.
- 과제:
  1) `CanChange`를 `return true;`로 바꿔 실패 메시지 읽고 되돌리기 (쉬움) → `Assert.Equal() Failure` Expected Forbidden / Actual Success
  2) `mailto:fan@example.com`이 거절될지 예측하고 InlineData로 잠깐 시험 후 되돌리기 (보통) → http·https가 아니라 거절
  3) `ScheduleQuery` 끝 시각이 포함되지 않는 것이 왜 중요한지 (쉬움) → 이번 주와 다음 주를 이어 붙여도 겹치지 않음
- 용어(사전 담당): 자동 테스트, 단위 테스트, xUnit, Assert, AAA 패턴, Theory
- 자주 막히는 곳 후보: `error CS0234: The type or namespace name 'Api' does not exist in the namespace 'StreamerHub'` → ProjectReference / 서버(dotnet watch)가 켜진 채 테스트 → `MSB3027`/`MSB3021 … being used by another process`(작성자 원문 확인) → 서버 끄기 / `dotnet test`를 엉뚱한 폴더에서 → `server` 폴더(slnx 있음) / 템플릿 패키지 버전이 조사 문서와 다를 수 있음(xunit.runner.visualstudio·coverlet은 미기재) → 작성자 확인 / `:memory:` 연결을 닫으면 DB가 사라짐(정상) / C# Dev Kit 없이 VS Code 테스트 탐색기가 안 보임 → `dotnet test`로 충분
- 레퍼런스 대응: 끝: `TestDb.cs`, `PostServiceTests.cs`, `ScheduleQueryTests.cs`, `StreamerValidationTests.cs`, `StreamerHub.slnx`는 레퍼런스와 같아요. 중간 단계 — `StreamerHub.Tests.csproj`(Day 36 `Microsoft.AspNetCore.Mvc.Testing`).

## Day 36 — 통합 테스트 (120분)

- 목표: 통합 테스트 = 진짜 `Program.cs`를 메모리에서 실행해 HTTP로 확인. `cd C:\dev\streamer-hub\server\StreamerHub.Tests` → `dotnet add package Microsoft.AspNetCore.Mvc.Testing --version 10.0.14`(external-facts에 없음 — 작성자가 NuGet에서 확인해 추가). .NET 10에서는 `public partial class Program`이 필요 없다는 점. `TestApp.cs`(레퍼런스와 같음): `WebApplicationFactory<Program>`, `UseEnvironment("Testing")`(개발자 PC의 user-secrets를 읽지 않게), `UseSetting`으로 연결 문자열·관리자 이메일/비밀번호·요청 제한 값, 테스트마다 이름이 다른 공유 메모리 SQLite + 열어 두는 연결, 테스트용 무작위 비밀번호 `NewPassword()`(비밀번호를 코드에 적지 않는 습관), `CreateFanClientAsync`·`CreateAdminClientAsync`. 처음 쓰는 .NET 이름은 그 자리에서 한 줄씩 설명한다: `HttpClient`(C#에서 HTTP 요청을 보내는 객체 — `CreateClient()`가 주는 것은 쿠키를 기억함), `PostAsJsonAsync`·`GetFromJsonAsync`·`ReadFromJsonAsync`(JSON으로 보내기·받기), `HttpStatusCode.Unauthorized` 같은 상태 코드 열거형, `response.Headers`·`Content.Headers`(헤더 읽기). `ApiTests.cs`의 `[Fact]` 15개(레퍼런스 README 테스트 표의 통합 15줄. 단위 8 + 통합 15 = 23): 401·가입→쿠키 로그인(httponly·samesite=lax)→201·403·관리자 201·빈 이름 400·HttpUrl 400·페이지네이션·SSE 이벤트·429 두 개·남의 글 403·작성자 204·관리자 삭제 204·관리자 시드 두 개. 따라하기 단계를 묶음별(인증·권한 / 검증 / 게시판 / SSE·요청 제한 / 관리자 시드)로 나눠 15개를 모두 쓴다. `dotnet test` → 23개. 클라이언트 `npx tsc --noEmit`(타입만 검사)과 `npm run build`.
- 이미 배운 것: xUnit·TestDb·Assert [Day 35](#/day/p2-d35); 구성·실행 환경 [Day 24](#/day/p2-d24); 요청 제한 [Day 34](#/day/p2-d34); SSE [Day 33](#/day/p2-d33); 쿠키 로그인 [Day 25](#/day/p2-d25); 관리자 시드 [Day 26](#/day/p2-d26); `tsc` [Day 4](#/day/p2-d04); 빌드 [Day 7](#/day/p2-d07)
- 시작 상태: [Day 35](#/day/p2-d35)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`, `.gitignore`
  - `C:\dev\streamer-hub\client\`: `.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`, `vite.config.ts`, `overlay.html`
  - `C:\dev\streamer-hub\client\public\`: `favicon.svg`
  - `C:\dev\streamer-hub\client\src\`: `main.ts`, `style.css`, `types.ts`, `api.ts`, `ui.ts`, `router.ts`, `auth.ts`, `overlay.ts`
  - `C:\dev\streamer-hub\client\src\pages\`: `home.ts`, `streamers.ts`, `streamerDetail.ts`, `schedule.ts`, `board.ts`, `postDetail.ts`, `postForm.ts`, `login.ts`, `register.ts`, `admin.ts`
  - `C:\dev\streamer-hub\server\`: `StreamerHub.slnx`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\`: `StreamerHub.Api.csproj`, `Program.cs`, `appsettings.json`, `appsettings.Development.json`, `StreamerHub.Api.http`, `bin\`, `obj\`, `streamerhub.db`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Data\`: `AppDbContext.cs`, `SeedData.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Dtos\`: `ScheduleDtos.cs`, `StreamerDtos.cs`, `AuthDtos.cs`, `PostDtos.cs`, `PagedResult.cs`, `NoticeDtos.cs`, `HttpUrlAttribute.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Endpoints\`: `StreamerEndpoints.cs`, `ScheduleEndpoints.cs`, `AuthEndpoints.cs`, `PostEndpoints.cs`, `NoticeEndpoints.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Entities\`: `Streamer.cs`, `Schedule.cs`, `AppUser.cs`, `Post.cs`, `Notice.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Migrations\`: `<시각>_InitialCreate.cs`, `<시각>_InitialCreate.Designer.cs`, `AppDbContextModelSnapshot.cs`, `<시각>_AddSchedules.cs`, `<시각>_AddSchedules.Designer.cs`, `<시각>_AddIdentity.cs`, `<시각>_AddIdentity.Designer.cs`, `<시각>_AddPosts.cs`, `<시각>_AddPosts.Designer.cs`, `<시각>_AddNotices.cs`, `<시각>_AddNotices.Designer.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Properties\`: `launchSettings.json`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Services\`: `ScheduleQuery.cs`, `PostService.cs`, `NoticeBroadcaster.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Tests\`: `StreamerHub.Tests.csproj`, `TestDb.cs`, `PostServiceTests.cs`, `ScheduleQueryTests.cs`, `StreamerValidationTests.cs`, `bin\`, `obj\`
  - `%APPDATA%\Microsoft\UserSecrets\<UserSecretsId>\`: `secrets.json`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0), .NET 10 SDK(`dotnet --version` → `10.0.`으로 시작), VS Code C# 확장(`ms-dotnettools.csharp`), VS Code REST Client 확장(`humao.rest-client`), sqlite3(`sqlite3 --version`), dotnet-ef 10.0.14(`dotnet-ef --version`), OBS Studio(P1 Day 27에서 설치, 선택)
  - 실행 중이어야 할 것: 서버는 꺼 둬요
- 오늘 만들/바꿀 파일:
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Tests\StreamerHub.Tests.csproj` — Mvc.Testing 10.0.14 (레퍼런스(같음))
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Tests\TestApp.cs` — 테스트용 앱 (레퍼런스(같음))
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Tests\ApiTests.cs` — 통합 테스트 15개 (레퍼런스(같음))
- 끝 상태 확인: `dotnet test` → `Passed!  - Failed: 0, Passed: 23, Skipped: 0, Total: 23`. `C:\dev\streamer-hub\client`에서 `npx tsc --noEmit` → 출력 없음.
- 과제:
  1) 401 테스트의 기대값을 `OK`로 바꿔 실패 메시지를 읽고 되돌리기 (쉬움) → Expected OK / Actual Unauthorized
  2) 클라이언트에 타입 오류 하나(`setStatus(status, 123)`)를 넣어 `tsc --noEmit`이 잡는지 → 되돌리기 (쉬움) → `error TS2345`
  3) `UseEnvironment("Testing")`이 없으면 생길 수 있는 일 (보통) → 개발 환경이라 내 PC user-secrets의 관리자 값이 섞임
- 용어(사전 담당): 통합 테스트, WebApplicationFactory
- 자주 막히는 곳 후보: 서버가 켜진 채 테스트 → 파일 잠금 / `Program`에 접근할 수 없다는 오류 → .NET 10 SDK·프로젝트 참조 확인 / 처음 실행이 느림(빌드) / SSE 테스트가 끝나지 않음 → 타임아웃·`using` 확인(레퍼런스 코드 비교) / Mvc.Testing 버전이 다른 패키지와 다름 → 10.0.14 / 테스트가 개발 DB를 지울까 걱정 → 연결 문자열을 메모리로 덮어씀
- 레퍼런스 대응: 끝: `TestApp.cs`, `ApiTests.cs`, `StreamerHub.Tests.csproj`는 레퍼런스와 같아요(레퍼런스 README "테스트" 표의 23개).

## Day 37 — 코드 품질과 Git 흐름 (100분)

- 목표: 포매터 = 들여쓰기·따옴표·줄 길이를 자동으로 맞추는 도구(사람은 내용에 집중). `cd C:\dev\streamer-hub\server` → `dotnet format StreamerHub.slnx --verify-no-changes`(검사만, 종료 코드 `$LASTEXITCODE`) → 고치기 `dotnet format StreamerHub.slnx`. 클라이언트 `npx prettier@<버전> --check --single-quote --print-width 120 "src/**/*.ts"`(레퍼런스는 이 두 옵션으로 변경 없이 통과) → `--write`. Prettier 버전은 external-facts에 없으므로 작성자가 고정·추가하고, Windows CRLF 파일 때문에 `--end-of-line auto`가 필요한지 실제로 확인해 명령에 반영한다. 브랜치 흐름: `git switch -c chore/format` → 포매터 결과·README "테스트와 코드 품질" 절 커밋 → `git push -u origin chore/format` → GitHub에서 **Pull request** 만들기(제목·설명·Files changed) → 스스로 리뷰 코멘트 → **Merge pull request** → `git switch main` → `git pull` → `git branch -d chore/format`. `git log --oneline --graph`.
- 이미 배운 것: 커밋·푸시·GitHub·`main` 브랜치(P1 사전 `[[브랜치]]`) [P1 Day 7](#/day/p1-d07)·[Day 2](#/day/p2-d02); npx [Day 3](#/day/p2-d03); 솔루션 [Day 17](#/day/p2-d17); 테스트 [Day 35](#/day/p2-d35)·[Day 36](#/day/p2-d36); CRLF 경고 [Day 2](#/day/p2-d02)
- 시작 상태: [Day 36](#/day/p2-d36)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`, `.gitignore`
  - `C:\dev\streamer-hub\client\`: `.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`, `vite.config.ts`, `overlay.html`
  - `C:\dev\streamer-hub\client\public\`: `favicon.svg`
  - `C:\dev\streamer-hub\client\src\`: `main.ts`, `style.css`, `types.ts`, `api.ts`, `ui.ts`, `router.ts`, `auth.ts`, `overlay.ts`
  - `C:\dev\streamer-hub\client\src\pages\`: `home.ts`, `streamers.ts`, `streamerDetail.ts`, `schedule.ts`, `board.ts`, `postDetail.ts`, `postForm.ts`, `login.ts`, `register.ts`, `admin.ts`
  - `C:\dev\streamer-hub\server\`: `StreamerHub.slnx`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\`: `StreamerHub.Api.csproj`, `Program.cs`, `appsettings.json`, `appsettings.Development.json`, `StreamerHub.Api.http`, `bin\`, `obj\`, `streamerhub.db`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Data\`: `AppDbContext.cs`, `SeedData.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Dtos\`: `ScheduleDtos.cs`, `StreamerDtos.cs`, `AuthDtos.cs`, `PostDtos.cs`, `PagedResult.cs`, `NoticeDtos.cs`, `HttpUrlAttribute.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Endpoints\`: `StreamerEndpoints.cs`, `ScheduleEndpoints.cs`, `AuthEndpoints.cs`, `PostEndpoints.cs`, `NoticeEndpoints.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Entities\`: `Streamer.cs`, `Schedule.cs`, `AppUser.cs`, `Post.cs`, `Notice.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Migrations\`: `<시각>_InitialCreate.cs`, `<시각>_InitialCreate.Designer.cs`, `AppDbContextModelSnapshot.cs`, `<시각>_AddSchedules.cs`, `<시각>_AddSchedules.Designer.cs`, `<시각>_AddIdentity.cs`, `<시각>_AddIdentity.Designer.cs`, `<시각>_AddPosts.cs`, `<시각>_AddPosts.Designer.cs`, `<시각>_AddNotices.cs`, `<시각>_AddNotices.Designer.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Properties\`: `launchSettings.json`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Services\`: `ScheduleQuery.cs`, `PostService.cs`, `NoticeBroadcaster.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Tests\`: `StreamerHub.Tests.csproj`, `TestDb.cs`, `PostServiceTests.cs`, `ScheduleQueryTests.cs`, `StreamerValidationTests.cs`, `bin\`, `obj\`, `TestApp.cs`, `ApiTests.cs`
  - `%APPDATA%\Microsoft\UserSecrets\<UserSecretsId>\`: `secrets.json`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0), .NET 10 SDK(`dotnet --version` → `10.0.`으로 시작), VS Code C# 확장(`ms-dotnettools.csharp`), VS Code REST Client 확장(`humao.rest-client`), sqlite3(`sqlite3 --version`), dotnet-ef 10.0.14(`dotnet-ef --version`), OBS Studio(P1 Day 27에서 설치, 선택)
  - 실행 중이어야 할 것: 없음
- 오늘 만들/바꿀 파일:
  - 바꿈 `C:\dev\streamer-hub\README.md` — "테스트와 코드 품질" 절(dotnet test, tsc --noEmit, dotnet format, Prettier 명령) (레퍼런스 README "테스트" 절·Day 37 행)
  - 바꿈 `C:\dev\streamer-hub\(포매터가 바꾼 파일)` — 레퍼런스대로 따라 했으면 변경 없음 (레퍼런스 코드는 두 포매터를 변경 없이 통과)
- 끝 상태 확인: `dotnet format … --verify-no-changes` 뒤 `$LASTEXITCODE` → `0`, Prettier `--check` → `All matched files use Prettier code style!`, GitHub PR 페이지에 보라색 "Merged", `git branch`에 `main`만.
- 과제:
  1) `Program.cs` 한 줄의 들여쓰기를 망가뜨리고 `--verify-no-changes`가 잡는 것 → `dotnet format`으로 고치기 (쉬움) → `WHITESPACE` 진단, 종료 코드 2(작성자 확인)
  2) PR 설명 쓰기(무엇을·왜·어떻게 확인) (쉬움) → 예시 세 줄
  3) `git branch -a`·`git log --oneline --graph` 읽기 (쉬움) → 원격 브랜치 표시 `remotes/origin/…`
- 용어(사전 담당): 코드 포매터, Prettier, dotnet format, 풀 리퀘스트, 머지
- 자주 막히는 곳 후보: **CRLF**: Windows에서 만든 파일이 CRLF라 Prettier가 모든 파일을 문제로 보고 → `--end-of-line auto` 등(작성자 확인) / PowerShell에서 glob은 따옴표로 감싸기 / `npx`가 `Need to install the following packages: … Ok to proceed? (y)`를 물음 → `y` / `fatal: The current branch chore/format has no upstream branch.` → `git push -u origin chore/format` / 머지 후 로컬 main이 옛 상태 → `git pull` / Squash 머지 뒤 `git branch -d`가 "not fully merged" → 내용 확인 후 `-D`
- 레퍼런스 대응: 레퍼런스 코드는 `dotnet format --verify-no-changes`와 Prettier(`--single-quote --print-width 120`)를 변경 없이 통과해요(레퍼런스 README Day 37 행). 중간 단계 — `README.md`(Day 38·39·40).

## Day 38 — 프로덕션 빌드 (110분)

- 목표: 개발 모드(서버 2개) vs 배포 모드(서버 1개가 화면+API). `vite.config.ts`에 `build.rolldownOptions.input`(main `index.html`, overlay `overlay.html` — 페이지가 두 개라 둘 다 알려 줌) → `npm run build` → `dist\`(index.html, overlay.html, assets). 레퍼런스 README의 명령으로 `wwwroot`에 복사(`Remove-Item … -ErrorAction SilentlyContinue`, `New-Item -ItemType Directory`, `Copy-Item -Recurse …\dist\* …\wwwroot\` — `:::warn` 지우는 경로 확인). `Program.cs`(레퍼런스와 같아짐): `app.UseStaticFiles();`(미들웨어 순서상 인증 앞), `app.Map("/api/{**rest}", () => TypedResults.NotFound());`(없는 API 주소가 index.html로 새지 않게), `app.MapFallbackToFile("index.html");`(그 밖의 주소는 클라이언트에게 — 해시 라우터라 서버엔 index.html 하나), Day 17의 `MapGet("/")` 삭제. 루트 `.gitignore`에 `server/StreamerHub.Api/wwwroot/`. `dotnet run` 하나로 `http://localhost:5250`에서 사이트 전체, 오버레이 `http://localhost:5250/overlay.html`. `dotnet publish -c Release -o C:\dev\streamer-hub-publish` → `cd C:\dev\streamer-hub-publish` → `$env:Admin__Email = "admin@example.com"`, `$env:Admin__Password = '<비밀번호>'`(user-secrets는 개발 전용, 설정 이름 `:` → `__`, 그 창에서만) → `dotnet StreamerHub.Api.dll --urls http://localhost:5000`. DB는 실행 폴더의 `streamerhub.db`(새로 만들어지고 시드됨). README에 "하나의 앱으로 빌드하기" 절. 개발 중 `The WebRootPath was not found` 경고의 뜻.
- 이미 배운 것: Vite 빌드·dist [Day 7](#/day/p2-d07); 미들웨어 순서 [Day 24](#/day/p2-d24); 실행 환경·구성 [Day 24](#/day/p2-d24); 환경 변수 [Day 3](#/day/p2-d03); user-secrets [Day 26](#/day/p2-d26); 라우트 [Day 17](#/day/p2-d17); 해시 라우터 [Day 28](#/day/p2-d28); 404 ProblemDetails [Day 24](#/day/p2-d24)
- 시작 상태: [Day 37](#/day/p2-d37)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`, `.gitignore`, `(포매터가 바꾼 파일)`
  - `C:\dev\streamer-hub\client\`: `.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`, `vite.config.ts`, `overlay.html`
  - `C:\dev\streamer-hub\client\public\`: `favicon.svg`
  - `C:\dev\streamer-hub\client\src\`: `main.ts`, `style.css`, `types.ts`, `api.ts`, `ui.ts`, `router.ts`, `auth.ts`, `overlay.ts`
  - `C:\dev\streamer-hub\client\src\pages\`: `home.ts`, `streamers.ts`, `streamerDetail.ts`, `schedule.ts`, `board.ts`, `postDetail.ts`, `postForm.ts`, `login.ts`, `register.ts`, `admin.ts`
  - `C:\dev\streamer-hub\server\`: `StreamerHub.slnx`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\`: `StreamerHub.Api.csproj`, `Program.cs`, `appsettings.json`, `appsettings.Development.json`, `StreamerHub.Api.http`, `bin\`, `obj\`, `streamerhub.db`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Data\`: `AppDbContext.cs`, `SeedData.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Dtos\`: `ScheduleDtos.cs`, `StreamerDtos.cs`, `AuthDtos.cs`, `PostDtos.cs`, `PagedResult.cs`, `NoticeDtos.cs`, `HttpUrlAttribute.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Endpoints\`: `StreamerEndpoints.cs`, `ScheduleEndpoints.cs`, `AuthEndpoints.cs`, `PostEndpoints.cs`, `NoticeEndpoints.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Entities\`: `Streamer.cs`, `Schedule.cs`, `AppUser.cs`, `Post.cs`, `Notice.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Migrations\`: `<시각>_InitialCreate.cs`, `<시각>_InitialCreate.Designer.cs`, `AppDbContextModelSnapshot.cs`, `<시각>_AddSchedules.cs`, `<시각>_AddSchedules.Designer.cs`, `<시각>_AddIdentity.cs`, `<시각>_AddIdentity.Designer.cs`, `<시각>_AddPosts.cs`, `<시각>_AddPosts.Designer.cs`, `<시각>_AddNotices.cs`, `<시각>_AddNotices.Designer.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Properties\`: `launchSettings.json`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Services\`: `ScheduleQuery.cs`, `PostService.cs`, `NoticeBroadcaster.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Tests\`: `StreamerHub.Tests.csproj`, `TestDb.cs`, `PostServiceTests.cs`, `ScheduleQueryTests.cs`, `StreamerValidationTests.cs`, `bin\`, `obj\`, `TestApp.cs`, `ApiTests.cs`
  - `%APPDATA%\Microsoft\UserSecrets\<UserSecretsId>\`: `secrets.json`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0), .NET 10 SDK(`dotnet --version` → `10.0.`으로 시작), VS Code C# 확장(`ms-dotnettools.csharp`), VS Code REST Client 확장(`humao.rest-client`), sqlite3(`sqlite3 --version`), dotnet-ef 10.0.14(`dotnet-ef --version`), OBS Studio(P1 Day 27에서 설치, 선택)
  - 실행 중이어야 할 것: 서버 하나(`dotnet run` 또는 게시 폴더 실행). Vite는 끔
- 오늘 만들/바꿀 파일:
  - 바꿈 `C:\dev\streamer-hub\client\vite.config.ts` — `build.rolldownOptions.input` (레퍼런스(같음))
  - 바꿈 `C:\dev\streamer-hub\server\StreamerHub.Api\Program.cs` — UseStaticFiles, `/api/{**rest}` 404, MapFallbackToFile, MapGet("/") 삭제 (레퍼런스(같음))
  - 바꿈 `C:\dev\streamer-hub\.gitignore` — `server/StreamerHub.Api/wwwroot/` (레퍼런스(같음))
  - 새로 `C:\dev\streamer-hub\server\StreamerHub.Api\wwwroot\` — 빌드한 클라이언트 복사본(커밋 안 함) (레퍼런스 README "하나의 앱으로 빌드하기")
  - 바꿈 `C:\dev\streamer-hub\client\dist\` — 두 페이지 빌드 결과(커밋 안 함) (—)
  - 바꿈 `C:\dev\streamer-hub\README.md` — "하나의 앱으로 빌드하기" 절 (레퍼런스 README(같은 절))
  - 새로 `C:\dev\streamer-hub-publish\(dotnet publish 결과 전체)`, `streamerhub.db` — 배포용 폴더(프로젝트 밖) (레퍼런스 README)
  - 새로 `C:\dev\streamer-hub-data\streamerhub.db(+ -wal·-shm)` — 과제 3에서 만든 고정 위치 DB(프로젝트 밖) (레퍼런스 README)
- 끝 상태 확인: `http://localhost:5000`(게시 폴더 실행)에서 사이트·로그인·관리자·공지 오버레이가 모두 동작하고, `#/streamers`에서 새로 고쳐도 화면이 나온다. `/api/nope` → 404 `application/problem+json`. Network에 5173이 없다.
- 과제:
  1) `input`에서 overlay를 빼고 빌드 → `dist`에 overlay.html이 없음 → 되돌리기 (쉬움) → 여러 페이지는 모두 알려 줘야 함
  2) `/api/{**rest}` 줄을 잠깐 지우면 `/api/nope`가 200 + index.html → 되돌리기 (보통) → 폴백이 받아 버림
  3) DB 위치를 바꿔 실행 (보통) → `New-Item -ItemType Directory C:\dev\streamer-hub-data`, `$env:ConnectionStrings__Default = "Data Source=C:\dev\streamer-hub-data\streamerhub.db"`(Day 39에서 계속 씀)
- 용어(사전 담당): 정적 파일, wwwroot, 폴백 라우트, dotnet publish
- 자주 막히는 곳 후보: 클라이언트를 고친 뒤 다시 빌드·복사하지 않아 옛 화면 / `Copy-Item` 경로의 `dist\*` / `$env:` 값은 그 창에서만 → 새 창이면 다시 / 관리자 환경 변수를 안 넣어 "관리자 계정을 만들지 않았어요" 경고 / **포트 충돌**: 5000이 이미 사용 중 → `--urls http://localhost:5001` / Production이라 오류가 자세한 화면 대신 500 ProblemDetails / `Remove-Item` 경로 실수(`:::warn`)
- 레퍼런스 대응: 끝: `vite.config.ts`, `Program.cs`, `.gitignore`는 레퍼런스와 같아요. 레퍼런스 README "하나의 앱으로 빌드하기 (Day 38)". 중간 단계 — `README.md`(Day 39·40).

## Day 39 — 배포 (100분)

- 목표: 배포 선택지 표(작성 기준일 2026-11, external-facts 13절 그대로): Azure App Service 무료(F1) — 카드·전화 인증 필요, 하루 CPU 60분, SQLite 파일 보존 미확인 / Render 무료 — 디스크 휘발이라 SQLite 보존 불가·슬립. 그래서 **본선은 내 PC에서 배포 모드로 운영**(Day 38 게시 폴더 + 같은 PC의 OBS), 인터넷 공개는 "선택"으로 카드·제약을 이해한 뒤. DB 위치 고정 `C:\dev\streamer-hub-data\streamerhub.db`(Day 38 과제 3에서 만든 것, `$env:ConnectionStrings__Default`), 백업: **서버를 끈 뒤** `streamerhub.db`와 `-wal`·`-shm`(있으면)을 날짜 폴더 `C:\dev\streamer-hub-backup\<날짜>\`로 `Copy-Item`, 복원 연습(글 지우기 → 서버 끔 → 백업을 되돌려 놓기 → 켜서 글이 돌아오는지). 인터넷에 올릴 때 점검표: HTTPS(호스팅·프록시가 제공, Day 34), 비밀 값은 환경 변수, 관리자 이메일 선가입 위험(Day 26), **리버스 프록시 뒤 IP 문제** — 모든 요청이 프록시 IP로 보여 "IP마다" 요청 제한이 모두를 한 사람으로 셈 → `app.UseForwardedHeaders()` + `ForwardedHeadersOptions { ForwardedHeaders = ForwardedHeaders.XForwardedFor }` + 믿을 프록시만 `KnownProxies`/`KnownIPNetworks`(.NET 10에서 `KnownNetworks`는 사용 중단)를 **`UseRateLimiter`보다 앞에** 둔다는 코드를 읽는다(배포할 때만 넣는 선택 코드 — 이 교재의 끝 상태에는 넣지 않음, 작성자가 컴파일 확인). README에 "실행·백업" 절.
- 이미 배운 것: dotnet publish·환경 변수·DB 위치 [Day 38](#/day/p2-d38); 요청 제한(IP마다) [Day 34](#/day/p2-d34); HTTPS·개발 인증서 [Day 34](#/day/p2-d34); 미들웨어 순서 [Day 24](#/day/p2-d24); 관리자 시드 [Day 26](#/day/p2-d26); 배포(GitHub Pages) [P1 Day 14](#/day/p1-d14)
- 시작 상태: [Day 38](#/day/p2-d38)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`, `.gitignore`, `(포매터가 바꾼 파일)`
  - `C:\dev\streamer-hub\client\`: `.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`, `vite.config.ts`, `overlay.html`
  - `C:\dev\streamer-hub\client\public\`: `favicon.svg`
  - `C:\dev\streamer-hub\client\src\`: `main.ts`, `style.css`, `types.ts`, `api.ts`, `ui.ts`, `router.ts`, `auth.ts`, `overlay.ts`
  - `C:\dev\streamer-hub\client\src\pages\`: `home.ts`, `streamers.ts`, `streamerDetail.ts`, `schedule.ts`, `board.ts`, `postDetail.ts`, `postForm.ts`, `login.ts`, `register.ts`, `admin.ts`
  - `C:\dev\streamer-hub\server\`: `StreamerHub.slnx`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\`: `StreamerHub.Api.csproj`, `Program.cs`, `appsettings.json`, `appsettings.Development.json`, `StreamerHub.Api.http`, `bin\`, `obj\`, `streamerhub.db`, `wwwroot\`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Data\`: `AppDbContext.cs`, `SeedData.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Dtos\`: `ScheduleDtos.cs`, `StreamerDtos.cs`, `AuthDtos.cs`, `PostDtos.cs`, `PagedResult.cs`, `NoticeDtos.cs`, `HttpUrlAttribute.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Endpoints\`: `StreamerEndpoints.cs`, `ScheduleEndpoints.cs`, `AuthEndpoints.cs`, `PostEndpoints.cs`, `NoticeEndpoints.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Entities\`: `Streamer.cs`, `Schedule.cs`, `AppUser.cs`, `Post.cs`, `Notice.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Migrations\`: `<시각>_InitialCreate.cs`, `<시각>_InitialCreate.Designer.cs`, `AppDbContextModelSnapshot.cs`, `<시각>_AddSchedules.cs`, `<시각>_AddSchedules.Designer.cs`, `<시각>_AddIdentity.cs`, `<시각>_AddIdentity.Designer.cs`, `<시각>_AddPosts.cs`, `<시각>_AddPosts.Designer.cs`, `<시각>_AddNotices.cs`, `<시각>_AddNotices.Designer.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Properties\`: `launchSettings.json`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Services\`: `ScheduleQuery.cs`, `PostService.cs`, `NoticeBroadcaster.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Tests\`: `StreamerHub.Tests.csproj`, `TestDb.cs`, `PostServiceTests.cs`, `ScheduleQueryTests.cs`, `StreamerValidationTests.cs`, `bin\`, `obj\`, `TestApp.cs`, `ApiTests.cs`
  - `C:\dev\streamer-hub-publish\`: `(dotnet publish 결과 전체)`, `streamerhub.db`
  - `C:\dev\streamer-hub-data\`: `streamerhub.db(+ -wal·-shm)`
  - `%APPDATA%\Microsoft\UserSecrets\<UserSecretsId>\`: `secrets.json`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0), .NET 10 SDK(`dotnet --version` → `10.0.`으로 시작), VS Code C# 확장(`ms-dotnettools.csharp`), VS Code REST Client 확장(`humao.rest-client`), sqlite3(`sqlite3 --version`), dotnet-ef 10.0.14(`dotnet-ef --version`), OBS Studio(P1 Day 27에서 설치, 선택)
  - 실행 중이어야 할 것: 게시 폴더의 서버(백업할 때는 끔)
- 오늘 만들/바꿀 파일:
  - 바꿈 `C:\dev\streamer-hub\README.md` — "배포와 백업" 절(DB 위치, 백업·복원 명령, 리버스 프록시 메모) (레퍼런스 README "하나의 앱으로 빌드하기"의 DB·백업·리버스 프록시 단락)
  - 바꿈 `C:\dev\streamer-hub-data\streamerhub.db(+ -wal·-shm)` — 고정 위치의 운영 DB로 계속 사용(백업·복원 연습) (레퍼런스 README)
  - 새로 `C:\dev\streamer-hub-backup\<날짜>\streamerhub.db 등` — 백업 사본(프로젝트 밖) (레퍼런스 README)
- 끝 상태 확인: 게시 앱을 `C:\dev\streamer-hub-data`의 DB로 켜서 글을 쓰고, 서버를 끈 뒤 백업 → 글 삭제 → 복원 → 다시 켜면 지운 글이 돌아와 있다.
- 과제:
  1) 배포 선택지 표(비용·카드·데이터 보존·슬립) 채우기 (쉬움) → external-facts 13절 값
  2) `UseForwardedHeaders`가 `UseRateLimiter`보다 앞이어야 하는 이유 (보통) → 요청 제한이 IP를 읽기 전에 진짜 IP로 바꿔 놓아야 함
  3) 서버를 켠 채 복사하면 안 되는 이유 (보통) → WAL에 아직 옮겨지지 않은 변경이 있거나 파일이 쓰이는 중
- 용어(사전 담당): 리버스 프록시, X-Forwarded-For, 백업, WAL
- 자주 막히는 곳 후보: 서버를 켠 채 복사 → 잠김·불완전한 백업 / `-wal`·`-shm` 파일이 없을 수도 있음(정상) / 환경 변수를 다른 창에서 설정 → 기본 위치의 DB를 씀 / 경로에 공백 → 따옴표 / 클라우드 가입 시 카드 요구(external-facts 13절) / Render에 올린 SQLite 데이터가 재시작 후 사라짐 / 같은 와이파이의 다른 기기에서 접속하려고 방화벽을 끄는 것 → 하지 않기(이 교재 범위 밖)
- 레퍼런스 대응: 코드 변경 없음. 레퍼런스 README "하나의 앱으로 빌드하기"의 DB 파일 위치·백업·리버스 프록시 단락과 대응해요. `UseForwardedHeaders`는 레퍼런스에 없는 선택 코드라 끝 상태에 넣지 않아요. 중간 단계 — `README.md`(Day 40).

## Day 40 — 최종 점검과 회고 (90분)

- 목표: 최종 점검표(체크박스): `dotnet test` 23개 통과, `npx tsc --noEmit`, `npm run build`, `dotnet format --verify-no-changes`, Prettier `--check`, 개발 모드(두 터미널)·배포 모드(게시 폴더) 모두 실행, 시나리오(팬 가입→글쓰기→수정 / 관리자 스트리머·일정 등록 / 공지 → 오버레이), `git status` 깨끗함, 비밀 값 없음(`git grep -i password`, `.http`의 관리자 비밀번호 칸). VS Code `File: Compare Active File With...`로 내 파일과 레퍼런스 비교(이름이 다르면 맞추기). `README.md` 완성(레퍼런스 README와 같은 절 구성: 소개, 기능, 준비물과 버전, 폴더 구조, 개발 모드 실행, 테스트, 하나의 앱으로 빌드, API 한눈에 보기, 설계 메모 — 글은 내 말로). 스크린샷(`Win + Shift + S`)을 `docs\screenshots\`에 저장하고 README에 마크다운 이미지로 연결(README는 GitHub에서 보이는 파일이라 이미지 문법 사용 가능 — 교재 본문의 이미지 금지 규칙과 다름을 작성자가 구분). 저장소 공개 여부 결정(공개 전 비밀 값 점검). 회고(잘한 것·어려웠던 것·다음에 할 것) → P3(Rust 실시간 게임)·SP(이미지 도네이션) 해금 안내와 개요 링크 `#/project/p3`, `#/project/sp`.
- 이미 배운 것: P2 Day 1~39 전부; README·마크다운 [P1 Day 29](#/day/p1-d29); 최종 점검·회고 [P1 Day 30](#/day/p1-d30)
- 시작 상태: [Day 39](#/day/p2-d39)의 끝 상태와 같아요.
  - `C:\dev\streamer-hub\`: `README.md`, `.git\`, `.gitignore`, `(포매터가 바꾼 파일)`
  - `C:\dev\streamer-hub\client\`: `.gitignore`, `package.json`, `package-lock.json`, `node_modules\`, `tsconfig.json`, `index.html`, `dist\`, `vite.config.ts`, `overlay.html`
  - `C:\dev\streamer-hub\client\public\`: `favicon.svg`
  - `C:\dev\streamer-hub\client\src\`: `main.ts`, `style.css`, `types.ts`, `api.ts`, `ui.ts`, `router.ts`, `auth.ts`, `overlay.ts`
  - `C:\dev\streamer-hub\client\src\pages\`: `home.ts`, `streamers.ts`, `streamerDetail.ts`, `schedule.ts`, `board.ts`, `postDetail.ts`, `postForm.ts`, `login.ts`, `register.ts`, `admin.ts`
  - `C:\dev\streamer-hub\server\`: `StreamerHub.slnx`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\`: `StreamerHub.Api.csproj`, `Program.cs`, `appsettings.json`, `appsettings.Development.json`, `StreamerHub.Api.http`, `bin\`, `obj\`, `streamerhub.db`, `wwwroot\`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Data\`: `AppDbContext.cs`, `SeedData.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Dtos\`: `ScheduleDtos.cs`, `StreamerDtos.cs`, `AuthDtos.cs`, `PostDtos.cs`, `PagedResult.cs`, `NoticeDtos.cs`, `HttpUrlAttribute.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Endpoints\`: `StreamerEndpoints.cs`, `ScheduleEndpoints.cs`, `AuthEndpoints.cs`, `PostEndpoints.cs`, `NoticeEndpoints.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Entities\`: `Streamer.cs`, `Schedule.cs`, `AppUser.cs`, `Post.cs`, `Notice.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Migrations\`: `<시각>_InitialCreate.cs`, `<시각>_InitialCreate.Designer.cs`, `AppDbContextModelSnapshot.cs`, `<시각>_AddSchedules.cs`, `<시각>_AddSchedules.Designer.cs`, `<시각>_AddIdentity.cs`, `<시각>_AddIdentity.Designer.cs`, `<시각>_AddPosts.cs`, `<시각>_AddPosts.Designer.cs`, `<시각>_AddNotices.cs`, `<시각>_AddNotices.Designer.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Properties\`: `launchSettings.json`
  - `C:\dev\streamer-hub\server\StreamerHub.Api\Services\`: `ScheduleQuery.cs`, `PostService.cs`, `NoticeBroadcaster.cs`
  - `C:\dev\streamer-hub\server\StreamerHub.Tests\`: `StreamerHub.Tests.csproj`, `TestDb.cs`, `PostServiceTests.cs`, `ScheduleQueryTests.cs`, `StreamerValidationTests.cs`, `bin\`, `obj\`, `TestApp.cs`, `ApiTests.cs`
  - `C:\dev\streamer-hub-publish\`: `(dotnet publish 결과 전체)`, `streamerhub.db`
  - `C:\dev\streamer-hub-data\`: `streamerhub.db(+ -wal·-shm)`
  - `C:\dev\streamer-hub-backup\<날짜>\`: `streamerhub.db 등`
  - `%APPDATA%\Microsoft\UserSecrets\<UserSecretsId>\`: `secrets.json`
  - 설치되어 있어야 할 것: VS Code·한국어 팩·Live Preview(P1), Chrome 또는 Edge(P1), Git(`git --version`), GitHub 계정(P1), Node.js LTS(`node --version` → v22.22.2+ / v24.15+ / v26+, 작성 기준 v26.13.0), .NET 10 SDK(`dotnet --version` → `10.0.`으로 시작), VS Code C# 확장(`ms-dotnettools.csharp`), VS Code REST Client 확장(`humao.rest-client`), sqlite3(`sqlite3 --version`), dotnet-ef 10.0.14(`dotnet-ef --version`), OBS Studio(P1 Day 27에서 설치, 선택)
  - 실행 중이어야 할 것: 점검 중에 개발 모드·배포 모드를 차례로 켬
- 오늘 만들/바꿀 파일:
  - 바꿈 `C:\dev\streamer-hub\README.md` — 완성(레퍼런스 README와 같은 절 구성, 글은 내 것) (레퍼런스 `README.md`)
  - 새로 `C:\dev\streamer-hub\docs\screenshots\home.png 등` — 화면 캡처(레퍼런스에 없음, 학습자 고유 내용) (없음)
- 끝 상태 확인: GitHub 저장소 첫 화면에 README와 스크린샷이 보이고, 최종 점검표의 모든 칸이 체크되어 있다.
- 과제:
  1) README "설계 메모"에 내 말로 3가지(왜 `/api/me`는 204인가, 왜 DB는 UTC인가, 왜 관리자 시드가 비밀번호를 확인하는가) (보통) → 레퍼런스 README 설계 메모 요지
  2) 회고 세 문장 (쉬움) → 예시
  3) (선택) 다음에 더할 기능 하나와 필요한 Day 복습 목록 (도전) → 예: 게시글 검색 → Day 21·30·31
- 용어(사전 담당): 포트폴리오
- 자주 막히는 곳 후보: 스크린샷에 이메일·비밀번호·토큰이 보임 → 다시 찍기(`:::warn`) / README 이미지 경로 대소문자(GitHub는 구분) / 큰 PNG → 화면 일부만 / 테스트가 실패 → Day 35·36 정답과 비교 / 공개 전 `.http`의 비밀번호 칸 확인
- 레퍼런스 대응: 끝: `README.md`는 레퍼런스 README와 같은 구성이에요(글 내용은 학습자 것). 모든 파일이 레퍼런스와 같은지 마지막으로 비교해요. `docs\screenshots\`는 레퍼런스에 없는 학습자 고유 내용이에요.
