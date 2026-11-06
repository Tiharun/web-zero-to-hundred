# SP 상세 개요 — 이미지 도네이션 서비스 (`C:\dev\image-donation`)

작성 기준일 2026-11. 이 파일은 빌드가 무시한다(`_`로 시작). SP Day 1~40을 여러 작성자가 나눠 쓸 때 이 개요만 보고 이어 쓸 수 있게 하는 계약이다. 근거: 설계서 2.4·2.5·3.4, `reference/sp-image-donation/`(정답 코드, README 포함), `docs/research/external-facts.md`, `docs/CONTENT-GUIDE.md`, 견본 `textbook/content/p1/day-01.md`.

## 0. 이 개요를 읽는 법

- Day 블록 형식은 Task 8 개요 형식 + `레퍼런스 대응` 줄이다. "시작 상태"의 파일 목록은 아래 6절 파일 지도에서 기계적으로 계산했으므로 **앞 Day의 끝 상태와 항상 같다**. Day 작성자는 자기 Day의 "오늘 끝 상태 전체 코드"가 다음 Day의 시작 상태 목록과 맞는지만 확인하면 된다.
- "오늘 만들/바꿀 파일"의 `[새로]`·`[바꿈]`·`[지움]` 뒤가 그날 그 파일에 들어갈 내용 요지다. 그날 끝 코드는 레퍼런스 파일에서 그 요지까지만 잘라 쓴다(CONTENT-GUIDE 부록 D). "중간 단계"라고 적힌 파일은 레퍼런스와 다르며, 어느 Day에서 다시 바뀌는지 함께 적었다. 마지막으로 바뀌는 Day의 끝에는 레퍼런스와 같아야 한다(글 내용·예시 데이터 제외).
- 레퍼런스의 주석과 이름(파일·클래스·메서드·DTO·API 경로·설정 키·로그 문장)은 바꾸지 않는다. 레퍼런스에서 틀린 점을 찾으면 Day에서 몰래 다르게 쓰지 말고 보고한다.
- 링크: SP Day는 `[Day N](#/day/sp-dNN)`, 앞 프로젝트는 `[P2 Day N](#/day/p2-dNN)`처럼 쓴다. 용어는 7절의 배정을 따른다.

## 1. SP 고정 규칙 (모든 Day 공통)

1. **돈 흐름 원칙**(설계서 2.4). 운영자(학습자)는 결제를 전혀 다루지 않는다. PG 연동·정산이 없다. 무료 이미지 후원은 돈이 오가지 않는다. 치즈 연동(선택)은 시청자가 치지직 공식 치즈 후원 메시지에 후원 코드를 넣고, 서버는 세션 이벤트로 코드를 "확인만" 한다. 돈은 치지직이 스트리머에게 직접 정산한다. Day 1에 `:::warn`으로 분명히 쓰고, 치즈가 나오는 Day(20·26~30)에서 한 줄로 다시 짚는다.
2. **테스트 모드가 기본 경로**(Day 21~28). 치지직 앱 승인이 없어도 모든 Day를 끝낼 수 있어야 한다. 각 Day의 "끝 상태 확인"을 **기본 경로(치지직 승인 없이)** 와 **선택 단계(승인된 치지직 앱이 있을 때만)** 로 나눠 적었다. 본문도 이 두 갈래를 `:::info`로 구분한다. 승인을 기다리는 동안 다음 Day로 넘어가도 된다고 적는다.
3. **치지직 실서버 연동은 작성 환경에서 검증하지 못했다**(계정·인증 정보 없음). OAuth 로그인·토큰 교환·갱신, `users/me` 응답 필드, 세션 URL, 후원 구독, 실제 DONATION 페이로드 모양, 채팅 전송은 공식 문서 대조와 가짜 HTTP 처리기(`StubChzzkHandler`)·로컬 Socket.IO 2.5.0 에뮬레이터로만 확인했다. 해당 Day 본문에 이 사실을 적고, 출처 `https://chzzk.gitbook.io/chzzk`와 "작성 기준일 2026-11, 문서는 바뀔 수 있음"을 둔다.
4. **법적 고려**(Day 32): 처리방침·약관은 연습용 초안이고 **"법률 자문이 필요하다"** 를 `:::warn`으로 명시한다. 법 조항·의무를 단정하지 않는다.
5. **P3를 전제하지 않는다.** SP는 P2 완료 후 열리고 P3보다 먼저 할 수 있다. Docker·컨테이너·PostgreSQL·psql·WebSocket·트랜잭션·Dockerfile은 SP Day(7·9·15·31·37)가 처음부터 가르친다. 다만 그 용어의 사전 항목은 이미 P3 사전에 있으므로 SP 사전에 다시 정의하지 않고 `[[제목]]`으로 링크한다(7절).
6. **Docker 없는 경로**(CONTENT-GUIDE 2.3): Docker를 쓰는 Day(7·37과 DB를 켜는 모든 Day)는 PostgreSQL 직접 설치(`winget install PostgreSQL.PostgreSQL.18`, 관리자 권한, 5432) + `dotnet run`을 같은 무게로 둔다. Docker Desktop 설치 Day는 `winver`·에디션 확인으로 시작하고, Windows 11 Home의 지원 여부는 단정하지 않는다. 이미지는 `postgres:18`, 볼륨은 `/var/lib/postgresql`.
7. **비밀 값**: 연결 문자열·`Security:IpHashKey`·치지직 Client Secret은 user-secrets(개발) 또는 `.env`/환경 변수(Docker)에만. `appsettings.json`과 커밋에는 없다. 실행 정책은 `RemoteSigned -Scope CurrentUser`만, 방화벽·백신을 끄게 하지 않는다. 방송·스크린샷에 user-secrets·오버레이 주소가 보이지 않게 주의시킨다.
8. **연습 폴더** `C:\dev\sp-practice\`(프로젝트 밖): `api.http`(REST Client, P2 Day 16에서 설치)와 `images\`(학습자가 준비하는 사진). 레퍼런스에 없고 최종 프로젝트 폴더에도 들어가지 않는다. 화면(대시보드·후원 페이지)이 생기기 전 Day 10~27에서 API를 부를 때 쓴다. 변수·요청 이름·순서·multipart 경계 문자열은 9절 부록 F로 고정한다.
9. **마이그레이션 이력**: 학습자는 Day 9·13·23·26·31·32에 하나씩, 모두 6개(InitialCreate, AddIdentity, AddChzzkTokens, AddDonationEvents, AddSafety, AddImageFileIndex)를 만든다. 레퍼런스는 최종 모습만 담아 2개다. 파일 이름·시각은 다르고 Day 32 이후의 모델 스냅샷(스키마)은 같다. P2 레퍼런스 README와 같은 설명을 Day 9에 둔다.
10. **버전**(external-facts 0.3 그대로): .NET SDK 10.0.x(10.0.403), Node LTS 26(22.22.2+ / 24.15+), create-vite 9.3.3, React·ReactDOM 19.3.1, React Router 8.5.1(`react-router`), TypeScript 7.0.2, Vite 8.3.5, Vitest 5.0.5, Testing Library react 16.3.3 / dom 10.4.2 / jest-dom 7.0.1 / user-event 14.6.8, jsdom 30.1.3, `@microsoft/signalr` 10.0.11, Npgsql.EntityFrameworkCore.PostgreSQL 10.0.3, EF Core Design·Identity.EntityFrameworkCore·Mvc.Testing·SignalR.Client 10.0.14, dotnet-ef 10.0.14, SkiaSharp + SkiaSharp.NativeAssets.Linux.NoDependencies 4.154.0(MIT, ImageSharp는 쓰지 않음 — R28), SocketIOClient 4.0.5(`EIO = V3`), socket.io 2.5.0(에뮬레이터만), PostgreSQL 18(`postgres:18`). 버전이 나오는 곳에는 "작성 기준일 2026-11"과 `--version` 확인을 둔다.
11. **레퍼런스에서 정한 정책**(바꾸지 않음): 움직이는 GIF·WebP는 첫 장면만(R29), EXIF 방향을 픽셀에 적용 후 WebP 80 재인코딩, 원본 1억 픽셀·디코딩 4096² 상한, 상태 7개(AwaitingCheese·Pending·Approved·Shown·Rejected·Expired·Cleared)와 모든 전이는 조건부 `ExecuteUpdate`, 오버레이가 연결되면 최근 30분 안의 미표시 승인 후원을 다시 보냄, 긴급 정지는 `Clear()`를 먼저 보내고 Cleared로 저장, 신고는 기록·거절·차단을 한 트랜잭션으로 하고 이미지는 `/media`로 내보내지 않는 증거로 7일 보관(R33·R35), 운영자 화면 없이 SQL로 검토, 매칭되지 않은 이벤트의 닉네임·메시지 미저장(최소 수집), 리프레시 토큰 잠금은 프로세스 하나 안에서만, 린터는 Oxlint(ESLint 없음, R23), `/api/auth/me`는 비로그인 204.
12. **중간 단계의 모양은 9절 부록으로 고정한다**(R42): 예시 후원 데이터(A), Day 5 `DonationForm` props(B), Day 15 오버레이 첫 버전(C), `ChzzkSessionSource` 생성자 변화(D), Day 25 연습 테스트(E), `api.http`(F), Day 10 `LocalImageStorage`(G). 그 밖의 중간 단계는 각 Day의 "오늘 만들/바꿀 파일" 요지가 기준이다.
13. **설계서 3.4와 다르게 배치한 것**(시간을 60~120분에 맞추고 테스트 모드를 기본 경로로 만들기 위함, 각 Day 제목의 핵심 주제는 그대로): 테스트 프로젝트를 Day 25에 만듦(3.4는 Day 33) / 테스트 모드 백엔드(`FakeDonationSource`, `test-donation`)를 Day 26에(3.4는 Day 28) / 세션·구독·채팅 API 메서드를 Day 22에 / 진짜 수신기의 BackgroundService 전환을 Day 28에 / 대시보드의 테스트 모드 패널과 "치즈 대기" 탭을 Day 30에(3.4 Day 30의 "테스트 후원") / `/media` 상태 확인(신고 이미지 격리)과 `ImageFile` 인덱스를 Day 32에 / 금지어 거르기(`BannedWordFilter`)를 Day 33에(3.4는 Day 31) / `ChzzkApiClientTests`·`StubChzzkHandler`를 Day 36에(테스트 대역) / Day 11 `ImageProcessor`·Day 19 `LoginPage`·Day 25 `ChzzkEmulator`·Day 34 테스트 대부분은 붙여 넣고 읽는 방식.

## 2. P2·P1에서 가져오는 지식 (SP가 기대는 것)

SP Day 1은 P2를 모두 마쳤다고 가정한다(P3는 가정하지 않음). 각 Day의 "이미 배운 것"은 아래 Day에 링크한다(설계서 3.1·3.2 기준). 이 용어들의 사전 항목은 P1·P2 사전에 있으므로 SP는 다시 정의하지 않는다(예: [[포트]], [[localhost]], [[출처]], [[상태 코드]], [[Promise]], [[연결 문자열]], [[user-secrets]], [[마이그레이션]], [[미들웨어]], [[요청 제한]], [[해싱]], [[쿠키]], [[XSS]], [[CSRF]], [[SameSite]], [[정규 표현식]], [[오버레이]], [[브라우저 소스]]).

- [P1 Day 1](#/day/p1-d01)·[P1 Day 7](#/day/p1-d07): 파일·경로·`C:\dev`, Git 커밋·푸시
- [P1 Day 13](#/day/p1-d13)·[P1 Day 14](#/day/p1-d14): 반응형·기기 모드, CSS 변수·transition
- [P1 Day 17](#/day/p1-d17)~[P1 Day 21](#/day/p1-d21): 배열·함수·객체·배열 메서드·DOM·이벤트
- [P1 Day 24](#/day/p1-d24)~[P1 Day 27](#/day/p1-d27): 폼 검증·pattern·정규 표현식, JSON·fetch, 타이머, OBS 브라우저 소스 오버레이(투명 배경, URL 파라미터)
- [P1 Day 28](#/day/p1-d28)~[P1 Day 30](#/day/p1-d30): 접근성(`role`, aria-live), README, 회고
- [P2 Day 1](#/day/p2-d01)~[P2 Day 3](#/day/p2-d03): 풀스택 큰 그림, PowerShell, Node·npm·실행 정책
- [P2 Day 4](#/day/p2-d04)~[P2 Day 8](#/day/p2-d08): TypeScript(타입·interface·유니온·제네릭·모듈), Vite(템플릿·개발 서버·빌드, `erasableSyntaxOnly` → enum 대신 유니온), async/await·타입 있는 fetch·로딩·오류 UI
- [P2 Day 9](#/day/p2-d09)~[P2 Day 15](#/day/p2-d15): .NET 10·C# 문법·컬렉션·클래스·record·interface·LINQ·람다·예외·Task·async, C# 열거형
- [P2 Day 16](#/day/p2-d16)~[P2 Day 18](#/day/p2-d18): HTTP·REST·상태 코드·`.http` 파일(REST Client), Minimal API·포트·`dotnet watch`, CRUD·라우트 매개변수·TypedResults
- [P2 Day 19](#/day/p2-d19)~[P2 Day 22](#/day/p2-d22): SQL·SQLite, EF Core·DbContext·마이그레이션·dotnet-ef, 비동기 쿼리·시드, 1:N·외래 키·Include
- [P2 Day 23](#/day/p2-d23)·[P2 Day 24](#/day/p2-d24): DTO·`AddValidation()`(public record 함정)·DI·서비스 계층·MapGroup, ProblemDetails·appsettings·환경·ILogger
- [P2 Day 25](#/day/p2-d25)·[P2 Day 26](#/day/p2-d26): 인증·인가·해싱·쿠키·Identity API(`/login?useCookies=true`), 역할·RequireAuthorization·`/api/me` 204·user-secrets
- [P2 Day 27](#/day/p2-d27)·[P2 Day 28](#/day/p2-d28): CORS·Vite 프록시·타입 있는 API 클라이언트(ApiError), 해시 라우터
- [P2 Day 29](#/day/p2-d29)~[P2 Day 33](#/day/p2-d33): UTC vs 한국 시간, 본인만 수정(404/403), 로그인·폼 화면, 역할 기반 UI, 폴링 → SSE 오버레이
- [P2 Day 34](#/day/p2-d34): XSS·CSRF·SameSite·HttpOnly·SQL 인젝션·요청 제한(429)·HTTPS
- [P2 Day 35](#/day/p2-d35)·[P2 Day 36](#/day/p2-d36): xUnit 단위 테스트, WebApplicationFactory 통합 테스트, `tsc --noEmit`
- [P2 Day 37](#/day/p2-d37)~[P2 Day 40](#/day/p2-d40): dotnet format·Prettier·브랜치, vite build → wwwroot·`dotnet publish`·`UseStaticFiles`·`MapFallbackToFile`, 배포·환경 변수 `__`·리버스 프록시·X-Forwarded-For, 포트폴리오

SP에서 처음 나오는 문법은 그 Day의 목표·이미 배운 것에 "오늘 처음"으로 적었다: React 전체(Day 3~6), `byte[]`·`MemoryStream`·`[GeneratedRegex]`·partial(Day 10), `ReadOnlySpan`·`u8`·범위·컬렉션 식(Day 11, 읽기만), `SignInManager.SignOutAsync`(Day 13), `keydown`·`e.key`·`reduce`(Day 19), `IOptions<T>`·`AddHttpClient`(Day 21), `UserManager`·`SignInManager.SignInAsync`(Day 23), `SemaphoreSlim`(Day 24), `ConcurrentDictionary`(Day 25), C# `event`(Day 26), `ExecuteUpdateAsync`(Day 17), 트랜잭션(Day 31), SQL `count`·`GROUP BY`·`JOIN`(Day 35).

## 3. 주소·포트·비밀 값

| 무엇 | 개발 중 | Docker(Day 37~) |
|---|---|---|
| 화면 | `http://localhost:5173` | `http://localhost:8080` |
| API·허브·이미지 | `http://localhost:5080` | 8080 |
| PostgreSQL | `127.0.0.1:5432` | 내부 전용 |

- 화면이 생긴 뒤 브라우저는 5173으로 열고, Vite가 `/api`·`/hubs`(WebSocket)·`/media`를 5080으로 넘긴다(Day 15). 오버레이 주소는 `<화면 주소>/overlay.html?token=<43자>`.
- user-secrets 이름: `ConnectionStrings:Default`(Day 8), `Security:IpHashKey`(Day 14), `Chzzk:ClientId`·`Chzzk:ClientSecret`·`Chzzk:RedirectUri`(Day 21~22, 개발 중 리디렉션 주소는 `http://localhost:5173/api/chzzk/callback` — Day 21 설명), 선택 `Chzzk:ChatOnMatch`(Day 28). UserSecretsId는 `image-donation-api`.
- Docker 개발 DB 연결 문자열: `Host=127.0.0.1;Port=5432;Database=image_donation;Username=imagedonation;Password=<.env 값>`. Docker 없는 경로는 `Username=postgres`와 설치 때 정한 비밀번호. 테스트 DB는 `image_donation_test` + 환경 변수 `TEST_DATABASE_URL`(Day 34).

## 4. 한눈에 보기

| Day | 제목 | 분 |
|---|---|---|
| 1 | 서비스 기획 | 80 |
| 2 | 아키텍처 | 80 |
| 3 | React ① | 110 |
| 4 | React ② | 100 |
| 5 | React ③ | 110 |
| 6 | React ④ | 100 |
| 7 | Docker + PostgreSQL | 120 |
| 8 | API 뼈대 | 110 |
| 9 | 데이터 모델링 | 120 |
| 10 | 파일 업로드 ① | 110 |
| 11 | 파일 업로드 ② 보안 | 120 |
| 12 | 이미지 제공과 정리 | 100 |
| 13 | 인증 설계 | 120 |
| 14 | 후원 페이지 API | 110 |
| 15 | 실시간 통신 원리 | 110 |
| 16 | SignalR 허브 | 110 |
| 17 | 검수 API | 110 |
| 18 | 오버레이 페이지 | 110 |
| 19 | 검수 대시보드(React) | 120 |
| 20 | 설정 화면 | 110 |
| 21 | OAuth 2.0 원리 | 100 |
| 22 | 치지직 개발자 센터 | 105 |
| 23 | 치지직 로그인 | 110 |
| 24 | 토큰 관리 | 100 |
| 25 | 세션 소켓 이해 | 120 |
| 26 | 후원 이벤트 수신 | 110 |
| 27 | 후원 코드 매칭 | 120 |
| 28 | 테스트 모드·채팅 안내 | 110 |
| 29 | 후원 페이지 화면 | 110 |
| 30 | 스트리머 온보딩 | 110 |
| 31 | 안전 장치 | 110 |
| 32 | 개인정보·법적 고려 | 110 |
| 33 | 단위 테스트 | 120 |
| 34 | 통합·프론트 테스트 | 115 |
| 35 | 관측성 | 95 |
| 36 | 저장소 추상화 | 110 |
| 37 | Docker 이미지 | 120 |
| 38 | 배포와 HTTPS | 100 |
| 39 | 방송 리허설 | 90 |
| 40 | 회고와 다음 단계 | 80 |

## 5. Day별 블록

## Day 1 — 서비스 기획 (80분)
- 목표:
  - 이 서비스가 무엇인지 한 문장으로 말한다: 스트리머가 가입하면 공개 후원 페이지와 비밀 OBS 오버레이 주소가 생기고, 시청자가 이미지·닉네임·메시지를 보내면 스트리머가 검수해 승인한 이미지만 방송 화면에 뜬다.
  - 사용자 세 종류(시청자, 스트리머, 서비스 운영자 = 나)와 각자 하는 일, 화면 흐름(후원 페이지 → 검수 대시보드 → OBS 오버레이)을 정리한다.
  - **돈 흐름 원칙(이 Day에서 반드시 분명히 쓴다, `:::warn`)**: 운영자(학습자)는 결제를 전혀 다루지 않는다. PG 연동도, 정산도 없다. 모드 ① 무료 이미지 후원: 이미지·메시지만 오가고 돈은 오가지 않는다. 모드 ② 치즈 연동(선택): 시청자가 치지직 공식 "치즈 후원"을 하면서 메시지에 후원 코드(`#AB12`)를 넣고, 서버는 치지직 세션 이벤트로 코드를 "확인만" 한다. 돈은 치지직이 스트리머에게 직접 정산한다. 테스트 모드: 가짜 후원 이벤트 발생기로 치지직 앱 승인 없이 전체 흐름을 연습한다.
  - 왜 결제를 다루지 않는지 이유를 적는다(결제를 받으면 PG 계약·사업자·보안·환불 분쟁 같은 의무가 생긴다는 정도만, 구체 법률 판단은 하지 않고 Day 32의 "법률 자문 필요"로 넘긴다).
  - 후원 상태를 말로만 미리 본다: 치즈 대기 → 검수 대기 → 승인됨 → 방송 완료, 거절됨, 만료됨, 긴급 정지됨(정식 설계는 Day 9).
  - 위험 목록: 부적절한 이미지(검수·자동 승인 기본 꺼짐·긴급 정지·신고), 개인정보(사진 속 위치 정보·IP·보관 기간), 저작권·초상권(남의 그림·얼굴 사진).
  - 작업 폴더 `C:\dev\image-donation`을 만들고 VS Code로 열어 `README.md`에 기획서를 쓴다. 완성본 모습은 레퍼런스 README의 "처음 써 보기 (테스트 모드)" 흐름을 글로 소개한다.
  - P2에서 설치한 도구가 그대로 있는지 확인한다(`dotnet --version` → `10.0.`, `node --version` → v22.22.2 이상 권장 v26, `git --version`). SP는 P3를 하지 않았어도 할 수 있다고 안내한다(Docker·PostgreSQL은 SP Day 7에서 처음부터 배운다).
- 이미 배운 것:
  - P2 전체를 마쳤다고 가정한다(SP는 P2 완료 후 열림). 오늘 직접 쓰는 것: 풀스택 큰 그림(프론트·백·DB·API, [P2 Day 1](#/day/p2-d01)), 터미널·전체 경로([P2 Day 2](#/day/p2-d02)), README.md와 Markdown([P1 Day 29](#/day/p1-d29)), OBS 브라우저 소스 오버레이([P1 Day 27](#/day/p1-d27), [P2 Day 33](#/day/p2-d33))
  - P3는 하지 않았을 수 있다. P3에만 나오는 개념(Docker, PostgreSQL, WebSocket 등)을 오늘 쓰지 않는다
- 시작 상태:
  - 미리 있어야 할 프로젝트 파일이 없다. `C:\dev\image-donation` 폴더도 아직 없다(오늘 만든다).
  - P2에서 설치한 도구: .NET 10 SDK(`dotnet --version`), Node.js LTS(`node --version`), Git(`git --version`), VS Code + C# 확장 + REST Client 확장([P2 Day 16](#/day/p2-d16)), OBS Studio([P1 Day 27](#/day/p1-d27)).
  - `C:\dev\streamer-hub`(P2 결과물)이 있어도 되고 없어도 된다. SP는 그 폴더를 쓰지 않는다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\README.md` [새로] — 기획서: 한 줄 소개, 돈 흐름 원칙(운영자는 결제를 다루지 않음), 사용자 3종, 기능 목록, 화면 흐름, 후원 상태 개요, 위험과 대응 (레퍼런스 `README.md`)
- 끝 상태 확인:
  - 파일 탐색기에서 `C:\dev\image-donation\README.md`가 보이고(확장명 `.md`, `.md.txt` 아님), VS Code 미리보기(`Ctrl + Shift + V`)에 제목, "돈은 다루지 않아요" 절, 사용자 3종 표, 화면 흐름 번호 목록, 위험 표가 보인다.
  - PowerShell에서 `dotnet --version`(10.0.x), `node --version`, `git --version`이 버전을 출력한다.
- 과제:
  - 1) 내 방송에 맞는 위험을 세 가지 더 생각해 README의 위험 표에 "위험 → 대응"으로 추가한다 → 정답 요지: 예: 같은 사람이 도배(→ 요청 제한·차단), 방송 중 대시보드가 화면에 잡힘(→ 방송 화면에 대시보드를 넣지 않기), 오버레이 주소 유출(→ 재발급). 핵심은 각 위험에 "누가·언제·무엇으로" 막는지가 있는 것
  - 2) "운영자가 결제를 직접 받으면 생기는 일" 세 가지를 적고, 이 서비스가 그것을 어떻게 피하는지 한 줄로 쓴다 → 정답 요지: PG 계약·사업자 등록 같은 절차, 환불·분쟁 책임, 카드 정보 보안 의무 → 이 서비스는 결제를 받지 않고 치지직 공식 후원의 코드만 확인하므로 운영자에게 돈이 오지 않는다. 구체적인 법적 의무는 Day 32에서 "법률 자문이 필요하다"로 다룬다
- 용어(사전 담당): `이미지 후원`, `치지직`, `치즈 후원`, `검수`, `결제 대행(PG)`, `정산`, `테스트 모드`
- 자주 막히는 곳 후보:
  - 폴더를 바탕 화면·문서·OneDrive 아래나 한글·공백이 든 경로에 만듦 → `C:\dev\image-donation`으로 옮긴다([P1 Day 1](#/day/p1-d01)와 같은 규칙)
  - `README.md`가 `README.md.txt`로 저장됨(확장명 숨김) → VS Code에서 만들거나 파일 탐색기 보기 → 표시 → 파일 확장명
  - `dotnet`/`node`를 찾을 수 없다는 PowerShell 오류(`The term 'dotnet' is not recognized…`) → 터미널을 새로 열고, 그래도 안 되면 P2 설치 Day를 다시 본다
  - Node가 22.22 미만이면 Day 6의 React Router 8이 경고를 낸다 → 오늘 LTS(작성 기준일 2026-11: v26.13.0)로 올려 둔다
  - Markdown 미리보기 단축키가 안 됨 → 명령 팔레트 `Markdown: Open Preview`
- 레퍼런스 대응:
  - `C:\dev\image-donation\README.md`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/README.md`)와 다름: 다시 바뀜 → [Day 2](#/day/sp-d02)

## Day 2 — 아키텍처 (80분)
- 목표:
  - 구성도를 `text` 그림으로 그린다(레퍼런스 README "구성" 그림과 같은 내용, 한 줄 32칸 이하): React(Vite) ─HTTP→ ASP.NET Core API ─EF Core(Npgsql)→ PostgreSQL, API ─→ 이미지 저장소(로컬 `media` 폴더, 7일 보관), API ─→ 치지직 Open API(OAuth·세션 소켓) 또는 테스트 모드, API ─SignalR→ 대시보드·`overlay.html`(OBS).
  - 요청 흐름 세 가지를 번호로 쓴다: ① 시청자가 이미지를 보낸다 ② 스트리머가 승인 → 오버레이에 뜬다 ③ (치즈 모드) 치지직 후원 이벤트로 코드를 확인한다.
  - 폴더 구조를 정한다: `client\`(React, Day 3), `server\ImageDonation.Api\`(API, Day 8), `server\ImageDonation.Tests\`(테스트, Day 25), `tools\chzzk-emulator\`(Day 25), 루트의 `README.md`·`.gitignore`·`docker-compose.yml`(Day 7)·`Dockerfile`(Day 37). 이름은 레퍼런스와 같게 쓴다.
  - 포트 계획 표: 5173(Vite 개발 서버), 5080(API, `dotnet run`), 5432(PostgreSQL), 8080(Docker로 띄운 완성 앱, Day 37). 개발 중에는 브라우저를 5173으로 열고 Vite가 `/api`·`/hubs`·`/media`를 5080으로 넘긴다([P2 Day 27](#/day/p2-d27)의 프록시와 같은 생각).
  - `C:\dev\image-donation`에서 `git init`(기본 브랜치 main), `.gitignore`(bin·obj·node_modules), README 커밋. 앞으로 Day 끝마다 커밋하는 습관(비밀 값은 절대 커밋하지 않음)을 안내한다.
- 이미 배운 것:
  - [Day 1](#/day/sp-d01) 기획서
  - 프론트·백·DB·API와 요청/응답([P2 Day 1](#/day/p2-d01)), 개발 서버 프록시([P2 Day 27](#/day/p2-d27)), SSE 오버레이([P2 Day 33](#/day/p2-d33))
  - Git 커밋·푸시([P1 Day 7](#/day/p1-d07)), 브랜치·커밋 습관([P2 Day 37](#/day/p2-d37)), `.gitignore`
- 시작 상태:
  - [Day 1](#/day/sp-d01) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 1](#/day/sp-d01)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`
  - Git이 설치되어 있고 사용자 이름·이메일이 설정되어 있다(`git config --global user.name`).
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\README.md` [바꿈] — 구성도(text 그림), 요청 흐름 3개, 폴더 구조, 포트 표 (레퍼런스 `README.md`)
  - `C:\dev\image-donation\.gitignore` [새로] — `**/bin/`, `**/obj/`, `**/node_modules/` (레퍼런스 `.gitignore`)
- 끝 상태 확인:
  - README 미리보기에 구성도(`text` 그림), 요청 흐름 3개, 폴더 구조, 포트 표가 보인다.
  - `cd C:\dev\image-donation` → `git log --oneline`에 커밋 1줄, `git status`가 `nothing to commit, working tree clean`.
- 과제:
  - 1) "시청자가 이미지를 보내서 OBS에 뜨기까지"를 번호 7~9단계로 쓴다 → 정답 요지: 후원 페이지(React) → multipart POST → API가 검사·WebP 재인코딩·저장 → DB에 검수 대기 → SignalR로 대시보드에 알림 → 스트리머 승인 → SignalR로 오버레이에 ShowDonation → OBS 화면 표시 → 다 보여 주면 MarkShown(방송 완료)
  - 2) 이미지 파일을 DB 칸에 넣지 않고 폴더에 두는 이유를 두 가지 쓴다 → 정답 요지: DB가 커지고 느려진다, 파일 저장소를 나중에 객체 스토리지로 바꿔 끼울 수 있다(Day 36). DB에는 파일 이름만 둔다
- 용어(사전 담당): `아키텍처`, `구성도`
  - 앞 프로젝트(P1·P2)에서 배운 용어, 다시 짚을 때 `[[제목]]`으로 링크: `[[프론트엔드]]`, `[[백엔드]]`, `[[API]]`, `[[포트]]`, `[[localhost]]`, `[[Git]]`, `[[커밋]]`
- 자주 막히는 곳 후보:
  - `git init`을 `C:\dev`에서 실행함 → `C:\dev\.git` 폴더를 지우고 `C:\dev\image-donation`에서 다시
  - `warning: in the working copy of 'README.md', LF will be replaced by CRLF` → Windows 줄바꿈 경고, 정상
  - `Author identity unknown` → `git config --global user.name`/`user.email`([P1 Day 7](#/day/p1-d07))
  - `.gitignore`가 `.gitignore.txt`로 저장됨 → VS Code에서 새 파일로 만든다
  - 구성도 `text` 그림이 휴대폰에서 가로로 넘침 → 한 줄 32칸 이하(한글 1자 = 2칸)
- 레퍼런스 대응:
  - `C:\dev\image-donation\README.md`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/README.md`)와 다름: 다시 바뀜 → [Day 7](#/day/sp-d07)
  - `C:\dev\image-donation\.gitignore`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/.gitignore`)와 다름: 다시 바뀜 → [Day 7](#/day/sp-d07)

## Day 3 — React ① (110분)
- 목표:
  - 왜 React인가: P2에서는 `createElement`·`textContent`로 화면을 직접 고쳤다([P1 Day 20](#/day/p1-d20), [P2 Day 28](#/day/p2-d28)). React는 "데이터 → 화면"을 선언하고 바뀌면 알아서 다시 그린다.
  - `cd C:\dev\image-donation` → `npm create vite@latest client -- --template react-ts`(create-vite 9.3.3 기준). 대화형 질문: 린터 `Which linter to use?` → **Oxlint**(레퍼런스는 ESLint 없음), `Install with npm and start now?` → 예/아니오 각각의 다음 행동(external-facts 7절). 버전 확인 `npm view create-vite version`, 작성 기준일 2026-11.
  - 템플릿 정리(레퍼런스에 없는 것 지우기): `client\README.md`, `client\public\icons.svg`, `client\src\App.css`, `client\src\assets\`(hero.png, react.svg, vite.svg). `index.css`는 내용을 지우고 우리 공통 스타일로 바꾼다. `index.html`은 `lang="ko"`, 제목 "이미지 후원". `package.json`의 `name`을 `image-donation-client`로.
  - 컴포넌트 = 대문자로 시작하는 함수, TSX(`className`, `{}` 안의 값, 닫는 태그), props(`interface Props` + 구조 분해). `src\components\DonationCard.tsx`를 만들어 App에서 두 번 쓴다.
  - `npm run dev`(5173), `npm run lint`(Oxlint), `npm run build`(`tsc -b && vite build` → `client\dist`, 템플릿 `.gitignore`가 무시)를 한 번씩 실행한다.
- 이미 배운 것:
  - [Day 2](#/day/sp-d02) 폴더 구조·포트
  - npm·package.json·node_modules·실행 정책 오류 해결([P2 Day 3](#/day/p2-d03)), TypeScript 기본 타입·interface·import/export([P2 Day 4](#/day/p2-d04)~[P2 Day 6](#/day/p2-d06)), Vite 템플릿·개발 서버·빌드([P2 Day 7](#/day/p2-d07))
  - HTML 요소·속성([P1 Day 3](#/day/p1-d03)), CSS 선택자·클래스([P1 Day 9](#/day/p1-d09)), DOM 직접 조작([P1 Day 20](#/day/p1-d20))
  - `erasableSyntaxOnly` 때문에 `enum` 대신 유니온 타입을 쓰는 규칙([P2 Day 7](#/day/p2-d07))
- 시작 상태:
  - [Day 2](#/day/sp-d02) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 2](#/day/sp-d02)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`
  - Node.js LTS·npm 설치(`node --version`, `npm --version`). 5173 포트를 쓰는 다른 개발 서버(P2 streamer-hub 등)는 꺼 둔다.
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\client\package.json` [새로] — `react-ts` 템플릿 그대로 + `"name": "image-donation-client"`로 변경 (레퍼런스 `client/package.json`)
  - `C:\dev\image-donation\client\package-lock.json` [새로] — npm install이 만듦 (레퍼런스 `client/package-lock.json`)
  - `C:\dev\image-donation\client\.gitignore` [새로] — 템플릿(`_gitignore` → `.gitignore`) 그대로 (레퍼런스 `client/.gitignore`)
  - `C:\dev\image-donation\client\.oxlintrc.json` [새로] — 템플릿 그대로(린터 질문에서 Oxlint 선택) (레퍼런스 `client/.oxlintrc.json`)
  - `C:\dev\image-donation\client\index.html` [새로] — 템플릿에서 `lang="ko"`, `<title>이미지 후원</title>`만 바꿈 (레퍼런스 `client/index.html`)
  - `C:\dev\image-donation\client\public\favicon.svg` [새로] — 템플릿 그대로 (레퍼런스 `client/public/favicon.svg`)
  - `C:\dev\image-donation\client\tsconfig.json` [새로] — 템플릿 그대로 (레퍼런스 `client/tsconfig.json`)
  - `C:\dev\image-donation\client\tsconfig.app.json` [새로] — 템플릿 그대로(`erasableSyntaxOnly`, `verbatimModuleSyntax`, `noUnusedLocals`) (레퍼런스 `client/tsconfig.app.json`)
  - `C:\dev\image-donation\client\tsconfig.node.json` [새로] — 템플릿 그대로 (레퍼런스 `client/tsconfig.node.json`)
  - `C:\dev\image-donation\client\vite.config.ts` [새로] — 템플릿 그대로(`plugins: [react()]`) (레퍼런스 `client/vite.config.ts`)
  - `C:\dev\image-donation\client\src\main.tsx` [새로] — 템플릿 그대로(StrictMode + `<App />`, `./index.css`) (레퍼런스 `client/src/main.tsx`)
  - `C:\dev\image-donation\client\src\App.tsx` [새로] — 템플릿 데모를 지우고 `<DonationCard>` 2장을 그림 (레퍼런스 `client/src/App.tsx`)
  - `C:\dev\image-donation\client\src\index.css` [새로] — 템플릿 내용을 지우고 공통 스타일(`:root` 색·시스템 글꼴, `*`, `body`, `h1`, `h2`, `a`, `button`) + `.card` (레퍼런스 `client/src/index.css`)
  - `C:\dev\image-donation\client\src\components\DonationCard.tsx` [새로] — props `nickname`, `message`, `imageUrl`을 받아 `<article className="card">`로 표시만 (레퍼런스 `client/src/components/DonationCard.tsx`)
- 끝 상태 확인:
  - `cd C:\dev\image-donation\client` → `npm run dev` → 브라우저 `http://localhost:5173`에 후원 카드 2장(닉네임·메시지)이 보이고, 개발자 도구 콘솔 오류 0개.
  - `npm run lint` → 경고·오류 0. `npm run build` → `client\dist\index.html`이 생긴다.
  - `client\src`에 `App.tsx`, `main.tsx`, `index.css`, `components\DonationCard.tsx`만 있다(App.css·assets 없음).
- 과제:
  - 1) DonationCard에 `createdAt`(글자) props를 추가해 카드 아래에 작게 표시한다 → 정답 요지: `interface Props`에 `createdAt: string` 추가 → TSX에서 `<p className="hint">{createdAt}</p>`. App에서 넘기지 않으면 `tsc`가 "Property 'createdAt' is missing" 계열 오류를 낸다(원문은 Day 작성자가 실행해 캡처)
  - 2) 카드를 하나 더 추가하고, 컴포넌트 이름을 소문자(`donationCard`)로 바꾸면 무슨 일이 생기는지 확인 후 되돌린다 → 정답 요지: 소문자 태그는 HTML 태그로 취급되어 화면에 이상한 `<donationcard>`가 생기고 콘솔 경고가 난다 → 컴포넌트 이름은 대문자로 시작
- 용어(사전 담당): `React`, `컴포넌트`, `JSX`, `TSX`, `props`, `Oxlint`
  - P3 사전 항목에 `[[제목]]`으로 링크하되 **P3를 안 했다고 가정하고 이 Day가 처음부터 설명**(정의만 P3 담당): `[[린터]]`
  - 앞 프로젝트(P1·P2)에서 배운 용어, 다시 짚을 때 `[[제목]]`으로 링크: `[[Vite]]`, `[[개발 서버]]`, `[[npm]]`, `[[실행 정책]]`
- 자주 막히는 곳 후보:
  - PowerShell `npm.ps1` 실행 정책 오류(`UnauthorizedAccess`) → [P2 Day 3](#/day/p2-d03)의 `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`
  - `Need to install the following packages: create-vite@9.x Ok to proceed? (y)` → `y` Enter
  - `Target directory "client" is not empty` → 대개 이미 한 번 만든 것. `Cancel operation` 후 폴더를 확인하거나 `Ignore files and continue`
  - 린터 질문에서 ESLint를 고름 → `client` 폴더를 지우고 다시 만든다(레퍼런스는 Oxlint, `.oxlintrc.json`)
  - 5173 포트가 사용 중이면 Vite가 `Port 5173 is in use, trying another one...` 후 5174로 연다 → 주소창 포트를 확인하거나 다른 dev 서버를 끈다
  - `class=` 대신 `className=`, 닫지 않은 `<img>`(`<img />`), 컴포넌트 두 개를 감싸는 부모 없음 → TSX 오류 원문을 그대로 싣는다
  - `import { Props }`처럼 타입을 일반 import → `verbatimModuleSyntax` 오류 → `import type` (원문은 작성자 확인)
- 레퍼런스 대응:
  - `C:\dev\image-donation\client\package.json`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/package.json`)와 다름: 다시 바뀜 → [Day 6](#/day/sp-d06)
  - `C:\dev\image-donation\client\package-lock.json`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/package-lock.json`)와 다름: 다시 바뀜 → [Day 6](#/day/sp-d06)
  - `C:\dev\image-donation\client\.gitignore`: `reference/sp-image-donation/client/.gitignore` 최종(같음)
  - `C:\dev\image-donation\client\.oxlintrc.json`: `reference/sp-image-donation/client/.oxlintrc.json` 최종(같음)
  - `C:\dev\image-donation\client\index.html`: `reference/sp-image-donation/client/index.html` 최종(같음)
  - `C:\dev\image-donation\client\public\favicon.svg`: `reference/sp-image-donation/client/public/favicon.svg` 최종(같음)
  - `C:\dev\image-donation\client\tsconfig.json`: `reference/sp-image-donation/client/tsconfig.json` 최종(같음)
  - `C:\dev\image-donation\client\tsconfig.app.json`: `reference/sp-image-donation/client/tsconfig.app.json` 최종(같음)
  - `C:\dev\image-donation\client\tsconfig.node.json`: `reference/sp-image-donation/client/tsconfig.node.json` 최종(같음)
  - `C:\dev\image-donation\client\vite.config.ts`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/vite.config.ts`)와 다름: 다시 바뀜 → [Day 15](#/day/sp-d15)
  - `C:\dev\image-donation\client\src\main.tsx`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/main.tsx`)와 다름: 다시 바뀜 → [Day 6](#/day/sp-d06)
  - `C:\dev\image-donation\client\src\App.tsx`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/App.tsx`)와 다름: 다시 바뀜 → [Day 4](#/day/sp-d04)
  - `C:\dev\image-donation\client\src\index.css`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/index.css`)와 다름: 다시 바뀜 → [Day 4](#/day/sp-d04)
  - `C:\dev\image-donation\client\src\components\DonationCard.tsx`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/components/DonationCard.tsx`)와 다름: 다시 바뀜 → [Day 4](#/day/sp-d04)

## Day 4 — React ② (100분)
- 목표:
  - 상태(state)와 훅의 규칙(컴포넌트 맨 위, 조건문 안에서 부르지 않기), `useState`로 예시 후원 3건을 기억하기(값은 9절 부록 A 그대로).
  - 이벤트: `onClick={() => onApprove(d.id)}`(함수를 넘긴다, 바로 부르지 않는다).
  - 조건부 렌더링(`&&`, 삼항)으로 검수 대기일 때만 승인·거절 버튼, 목록이 비면 "검수할 후원이 없어요.".
  - 목록 렌더링 `map` + `key={d.id}`, 불변 업데이트: `src\donationList.ts`의 `upsertDonation`(같은 id면 바꾸고 없으면 맨 앞에 넣은 **새 배열**)과 `statusLabel`(`Record<DonationStatus, string>`, 7개 상태 이름 — 상태 뜻은 Day 1 개요를 다시 짚고 정식 설계는 Day 9라고 예고).
  - `src\api.ts`를 만들어 타입만 둔다: `DonationStatus`(7개 문자열 유니온), `Donation { id, status, nickname, message, imageUrl, createdAt }`.
  - 필터 버튼 "전체 / 검수 대기"(`aria-pressed`)로 보이는 목록 거르기.
- 이미 배운 것:
  - [Day 3](#/day/sp-d03) 컴포넌트·TSX·props
  - 배열·객체·`map`/`filter`/`some`([P1 Day 17](#/day/p1-d17)~[P1 Day 19](#/day/p1-d19)), 이벤트([P1 Day 21](#/day/p1-d21)), [[전개 구문]] `...`([P2 Day 8](#/day/p2-d08)), `Record<K, V>` 유틸리티 타입([P2 Day 6](#/day/p2-d06))
  - 유니온·리터럴 타입([P2 Day 5](#/day/p2-d05)), `enum` 대신 유니온([P2 Day 7](#/day/p2-d07))
- 시작 상태:
  - [Day 3](#/day/sp-d03) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 3](#/day/sp-d03)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`
  - `client`에서 `npm run dev`를 켤 수 있다(http://localhost:5173).
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\client\src\App.tsx` [바꿈] — useState로 예시 후원 3건(9절 부록 A) + 승인/거절(upsertDonation) + "전체/검수 대기" 필터 (레퍼런스 `client/src/App.tsx`)
  - `C:\dev\image-donation\client\src\index.css` [바꿈] — + `.cards`, `.card-body`, `.badge`, `.actions`, `button.quiet`, `.tabs` (레퍼런스 `client/src/index.css`)
  - `C:\dev\image-donation\client\src\api.ts` [새로] — 타입만: `DonationStatus`(7개 유니온), `Donation { id, status, nickname, message, imageUrl, createdAt }` (레퍼런스 `client/src/api.ts`)
  - `C:\dev\image-donation\client\src\donationList.ts` [새로] — `statusLabel`(7개 상태 한국어 이름), `upsertDonation`(새 배열을 돌려주는 불변 업데이트) (레퍼런스 `client/src/donationList.ts`)
  - `C:\dev\image-donation\client\src\components\DonationCard.tsx` [바꿈] — props를 `donation: Donation` + `onApprove`·`onReject`로, 상태 배지, Pending일 때만 승인·거절 버튼 (레퍼런스 `client/src/components/DonationCard.tsx`)
- 끝 상태 확인:
  - 카드 3장 중 하나에서 **승인** → 배지가 "승인됨"으로 바뀌고 버튼이 사라진다. **거절** → "거절됨".
  - "검수 대기" 버튼 → 검수 대기 카드만 보이고, 모두 처리하면 "검수할 후원이 없어요.".
  - 콘솔에 key 경고가 없다(`npm run lint` 0).
- 과제:
  - 1) 목록 위에 "검수 대기 N건"을 표시한다 → 정답 요지: `donations.filter((d) => d.status === 'Pending').length`를 TSX에 넣는다. 상태에서 계산하므로 승인할 때마다 저절로 줄어든다
  - 2) `key`를 배열 번호(index)로 쓰면 어떤 문제가 생기는지 설명한다 → 정답 요지: 맨 앞에 새 항목이 들어오면 번호가 밀려 React가 다른 카드를 같은 카드로 착각한다(입력값·이미지 엉킴). 후원 id처럼 바뀌지 않는 고유 값을 쓴다
- 용어(사전 담당): `훅`, `useState`, `조건부 렌더링`, `key (React)`, `불변 업데이트`
- 자주 막히는 곳 후보:
  - `donations.push(...)`로 직접 고침 → 화면이 안 바뀜 → 새 배열을 만들어 `setDonations`
  - `onClick={onApprove(d.id)}` → 화면을 그리자마자 실행되고 무한 렌더링 경고 → 화살표 함수로 감싼다
  - 콘솔 `Each child in a list should have a unique "key" prop.` → `key={d.id}` (원문은 작성자 확인)
  - `statusLabel`에서 상태 하나를 빠뜨리면 `Record` 타입 오류 → 7개 모두
  - StrictMode 때문에 개발 모드에서 컴포넌트 함수가 두 번 불림 → 정상(빌드에서는 한 번)
- 레퍼런스 대응:
  - `C:\dev\image-donation\client\src\App.tsx`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/App.tsx`)와 다름: 다시 바뀜 → [Day 5](#/day/sp-d05)
  - `C:\dev\image-donation\client\src\index.css`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/index.css`)와 다름: 다시 바뀜 → [Day 5](#/day/sp-d05)
  - `C:\dev\image-donation\client\src\api.ts`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/api.ts`)와 다름: 다시 바뀜 → [Day 5](#/day/sp-d05)
  - `C:\dev\image-donation\client\src\donationList.ts`: `reference/sp-image-donation/client/src/donationList.ts` 최종(같음)
  - `C:\dev\image-donation\client\src\components\DonationCard.tsx`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/components/DonationCard.tsx`)와 다름: 다시 바뀜 → [Day 19](#/day/sp-d19)

## Day 5 — React ③ (110분)
- 목표:
  - `useEffect`(의존성 배열 `[]` = 처음 한 번)로 데이터 불러오기. 아직 API가 없으므로 `client\public\sample-donations.json`(연습용, 내용은 9절 부록 A, Day 19에서 지움)을 `fetch('/sample-donations.json')`로 읽는다.
  - 응답이 늦게 오는 동안 화면이 사라지면 결과를 버리는 `ignore` 깃발 + 정리 함수. "불러오는 중…"·오류 문장.
  - `src\api.ts`에 레퍼런스의 공통 요청 도구를 넣는다: `ApiError`(status), `messageFrom`(ProblemDetails의 detail·errors), `parseBody`(빈 본문·JSON 아님 → null), `request<T>`. 연습용 `getSampleDonations()`는 Day 19에서 지운다.
  - 커스텀 훅 `src\hooks\useImagePreview.ts`(레퍼런스와 같은 최종 코드): FileReader로 `data:` 주소를 만들고 정리 함수에서 `reader.abort()`, 지금 고른 파일의 미리보기만 돌려준다.
  - 제어 컴포넌트 폼 `src\components\DonationForm.tsx` 첫 버전: 이미지 선택(`accept="image/jpeg,image/png,image/webp,image/gif"`) + 미리보기, 닉네임(`required`, `maxLength={20}`), 메시지(`maxLength={100}`, "메시지 (n/100)"), `e.preventDefault()`, 보내기 → `onSubmit(draft)` prop(`DonationDraft` 타입은 9절 부록 B). 서버 업로드는 Day 29에서 바꾼다.
  - App: 불러온 예시 목록 + 폼으로 보낸 값을 목록 맨 앞에 추가(이미지는 미리보기 주소).
- 이미 배운 것:
  - [Day 3](#/day/sp-d03)~[Day 4](#/day/sp-d04)
  - JSON·fetch·async/await([P1 Day 25](#/day/p1-d25), [P2 Day 8](#/day/p2-d08)), 타입 있는 API 클라이언트와 ApiError 패턴([P2 Day 27](#/day/p2-d27)), ProblemDetails([P2 Day 24](#/day/p2-d24))
  - 폼 검증 `required`·`maxLength`([P1 Day 24](#/day/p1-d24))
- 시작 상태:
  - [Day 4](#/day/sp-d04) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 4](#/day/sp-d04)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`, `api.ts`, `donationList.ts`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`
  - `client`에서 `npm run dev`(5173).
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\client\public\sample-donations.json` [새로] — 예시 후원 3건 `[{id,status,nickname,message,imageUrl,createdAt}]` — 값은 9절 부록 A
  - `C:\dev\image-donation\client\src\App.tsx` [바꿈] — useEffect로 `/sample-donations.json` 불러오기(불러오는 중·오류), 아래에 `<DonationForm>` 연습(보내면 목록 맨 앞에 추가) (레퍼런스 `client/src/App.tsx`)
  - `C:\dev\image-donation\client\src\index.css` [바꿈] — + `textarea`/입력칸, `.donation-form`, `.preview`, `.hint`, `.error` (레퍼런스 `client/src/index.css`)
  - `C:\dev\image-donation\client\src\api.ts` [바꿈] — + `ApiError`, `messageFrom`, `parseBody`, `request<T>`, 연습용 `getSampleDonations()` (레퍼런스 `client/src/api.ts`)
  - `C:\dev\image-donation\client\src\components\DonationForm.tsx` [새로] — 제어 컴포넌트 폼: 이미지 선택(accept 4형식) + useImagePreview 미리보기, 닉네임(20자), 메시지(100자, 글자 수), 보내기 → `onSubmit` prop으로 값 넘김(업로드는 Day 29) — `DonationDraft`·props 모양은 9절 부록 B (레퍼런스 `client/src/components/DonationForm.tsx`)
  - `C:\dev\image-donation\client\src\hooks\useImagePreview.ts` [새로] — FileReader로 data URL, 정리 함수 `reader.abort()`, 지금 파일의 미리보기만 돌려줌 (레퍼런스 `client/src/hooks/useImagePreview.ts`)
- 끝 상태 확인:
  - 새로고침 → 잠깐 "불러오는 중…" 뒤 예시 3건. `sample-donations.json` 이름을 일부러 틀리면 오류 문장(되돌림).
  - 폼에서 사진을 고르면 미리보기가 보이고, 닉네임·메시지를 쓰고 **보내기** → 목록 맨 위에 새 카드(검수 대기).
  - 메시지 칸에 글자를 쓰면 `(n/100)`이 늘어나고 100자에서 더 써지지 않는다.
- 과제:
  - 1) 닉네임이 비어 있으면 보내기 버튼을 누를 수 없게 한다 → 정답 요지: `disabled={!file || nickname.trim() === ''}` 또는 `required`에 맡김. 레퍼런스(Day 29 최종)는 `required` + 파일·크기 조건으로 막는다
  - 2) useEffect의 의존성 배열을 빼면 무슨 일이 생길 수 있는지 설명한다 → 정답 요지: 화면을 그릴 때마다 effect가 다시 실행된다. 안에서 setState를 하면 "그리기 → 불러오기 → setState → 다시 그리기"가 끝없이 반복될 수 있다
- 용어(사전 담당): `useEffect`, `의존성 배열`, `정리 함수`, `커스텀 훅`, `제어 컴포넌트`, `FileReader`
- 자주 막히는 곳 후보:
  - `fetch('/public/sample-donations.json')` → 404. public 폴더 파일은 주소에서 `public`을 뺀다
  - JSON 끝의 쉼표·작은따옴표 → `SyntaxError` → 오류 문장이 보이면 JSON부터 확인
  - 개발 모드에서 effect가 두 번 실행됨(StrictMode) → `ignore` 깃발과 정리 함수가 있으면 문제없다
  - Oxlint가 effect 안의 바로 실행되는 setState를 경고할 수 있음 → 레퍼런스처럼 `then`/이벤트 안에서 setState
  - 휴대폰 원본 사진(수 MB)은 미리보기가 느릴 수 있음 → 정상
- 레퍼런스 대응:
  - `C:\dev\image-donation\client\public\sample-donations.json`: 레퍼런스에 없음(연습용 예시 데이터(API가 생기기 전))
  - `C:\dev\image-donation\client\src\App.tsx`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/App.tsx`)와 다름: 다시 바뀜 → [Day 6](#/day/sp-d06)
  - `C:\dev\image-donation\client\src\index.css`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/index.css`)와 다름: 다시 바뀜 → [Day 6](#/day/sp-d06)
  - `C:\dev\image-donation\client\src\api.ts`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/api.ts`)와 다름: 다시 바뀜 → [Day 15](#/day/sp-d15)
  - `C:\dev\image-donation\client\src\components\DonationForm.tsx`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/components/DonationForm.tsx`)와 다름: 다시 바뀜 → [Day 29](#/day/sp-d29)
  - `C:\dev\image-donation\client\src\hooks\useImagePreview.ts`: `reference/sp-image-donation/client/src/hooks/useImagePreview.ts` 최종(같음)

## Day 6 — React ④ (100분)
- 목표:
  - `cd C:\dev\image-donation\client` → `npm i react-router@8.5.1`(패키지 이름은 `react-router`, `react-router-dom` 아님). Declarative 모드만 쓴다(external-facts 7절, Data 모드는 "더 알아보기").
  - `main.tsx`에서 `<BrowserRouter>`로 `<App />`을 감싼다(레퍼런스 최종). 해시 라우터([P2 Day 28](#/day/p2-d28))와 비교: # 없는 주소라 새로고침하면 서버가 index.html을 줘야 한다 → 개발 서버는 자동, 완성 앱은 Day 37의 `MapFallbackToFile`.
  - `App.tsx`: `/d/:slug` → `pages\DonatePage.tsx`, 레이아웃 라우트 `<Route element={<StreamerLayout />}>` 안에 `/dashboard` → `pages\DashboardPage.tsx`, `/` → `<Navigate to="/dashboard" replace />`, `*` → "없는 페이지예요." + `<Link to="/dashboard">`.
  - `DonatePage`: `useParams()`의 `slug`로 제목, DonationForm(`onSubmit`은 9절 부록 B의 alert — Day 29에 진짜 업로드). `DashboardPage`: Day 4~5의 목록·필터·불러오기를 App에서 옮긴다.
  - `components\StreamerLayout.tsx`: 위쪽 메뉴(굵은 "이미지 후원", `NavLink to="/dashboard"` 강조) + `<Outlet />`. 시청자 후원 페이지는 이 틀 밖이다(시청자에게 스트리머 메뉴가 보이면 안 됨).
- 이미 배운 것:
  - [Day 3](#/day/sp-d03)~[Day 5](#/day/sp-d05)
  - 해시 라우터 직접 구현과 주소 ↔ 화면 연결([P2 Day 28](#/day/p2-d28)), npm 패키지 설치([P2 Day 3](#/day/p2-d03))
- 시작 상태:
  - [Day 5](#/day/sp-d05) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 5](#/day/sp-d05)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`, `sample-donations.json`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`, `api.ts`, `donationList.ts`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`, `DonationForm.tsx`
  - `C:\dev\image-donation\client\src\hooks\`: `useImagePreview.ts`
  - `client`에서 `npm run dev`(5173).
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\client\package.json` [바꿈] — + `react-router` ^8.5.1 (`npm i react-router@8.5.1`) (레퍼런스 `client/package.json`)
  - `C:\dev\image-donation\client\package-lock.json` [바꿈] — npm이 갱신 (레퍼런스 `client/package-lock.json`)
  - `C:\dev\image-donation\client\src\main.tsx` [바꿈] — `<BrowserRouter>`로 `<App />`을 감쌈(import 순서·주석은 레퍼런스와 같게) (레퍼런스 `client/src/main.tsx`)
  - `C:\dev\image-donation\client\src\App.tsx` [바꿈] — `<Routes>`: `/d/:slug` → DonatePage, StreamerLayout 안에 `/dashboard`, `/` → `<Navigate to="/dashboard" replace />`, `*` → "없는 페이지예요." (레퍼런스 `client/src/App.tsx`)
  - `C:\dev\image-donation\client\src\index.css` [바꿈] — + `.topbar`(nav, `a.active`), `.page`, `.narrow`, `.grow` (레퍼런스 `client/src/index.css`)
  - `C:\dev\image-donation\client\src\components\StreamerLayout.tsx` [새로] — 위쪽 메뉴(`이미지 후원`, NavLink "대시보드") + `<Outlet />` (레퍼런스 `client/src/components/StreamerLayout.tsx`)
  - `C:\dev\image-donation\client\src\pages\DonatePage.tsx` [새로] — `useParams`의 slug로 제목 "<slug>에게 이미지 후원" + `<DonationForm>`(보내면 부록 B의 alert) (레퍼런스 `client/src/pages/DonatePage.tsx`)
  - `C:\dev\image-donation\client\src\pages\DashboardPage.tsx` [새로] — Day 4~5의 목록·필터·불러오기를 App에서 옮김(아직 예시 JSON) (레퍼런스 `client/src/pages/DashboardPage.tsx`)
- 끝 상태 확인:
  - `http://localhost:5173/dashboard` → 위쪽 메뉴의 "대시보드"가 강조되고 예시 목록이 보인다.
  - `http://localhost:5173/d/my-stream` → 제목에 `my-stream`, 후원 폼. 메뉴는 보이지 않는다.
  - `http://localhost:5173/` → 주소가 `/dashboard`로 바뀐다. `/아무거나` → "없는 페이지예요." 링크를 누르면 대시보드.
  - 각 화면에서 `F5`로 새로고침해도 같은 화면이 나온다.
- 과제:
  - 1) 메뉴의 현재 화면 링크를 굵게·밑줄로 강조한다 → 정답 요지: NavLink는 현재 주소면 `active` 클래스를 붙인다 → `.topbar nav a.active { font-weight: 700; text-decoration: underline; }`
  - 2) `<Link>` 대신 `<a href>`를 쓰면 무엇이 달라지는지 개발자 도구 Network로 확인한다 → 정답 요지: `<a>`는 페이지 전체를 다시 받는다(문서 요청이 생기고 상태가 초기화). `<Link>`는 주소만 바꾸고 화면만 다시 그린다
- 용어(사전 담당): `React Router`, `BrowserRouter`, `Outlet`, `레이아웃 라우트`
- 자주 막히는 곳 후보:
  - `npm i react-router-dom` → 7.x가 설치됨. 지우고(`npm uninstall react-router-dom`) `react-router@8.5.1`
  - `npm warn EBADENGINE` (React Router 8.5.1은 Node 22.22.0 이상 요구) → Node LTS 업데이트
  - 레이아웃에 `<Outlet />`이 없으면 자식 화면이 빈칸 → 레이아웃 파일 확인
  - import 경로 대소문자(`./pages/dashboardPage`)가 Windows에서는 되다가 빌드·Docker(Linux)에서 깨짐 → 파일 이름과 똑같이
- 레퍼런스 대응:
  - `C:\dev\image-donation\client\package.json`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/package.json`)와 다름: 다시 바뀜 → [Day 15](#/day/sp-d15)
  - `C:\dev\image-donation\client\package-lock.json`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/package-lock.json`)와 다름: 다시 바뀜 → [Day 15](#/day/sp-d15)
  - `C:\dev\image-donation\client\src\main.tsx`: `reference/sp-image-donation/client/src/main.tsx` 최종(같음)
  - `C:\dev\image-donation\client\src\App.tsx`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/App.tsx`)와 다름: 다시 바뀜 → [Day 19](#/day/sp-d19)
  - `C:\dev\image-donation\client\src\index.css`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/index.css`)와 다름: 다시 바뀜 → [Day 19](#/day/sp-d19)
  - `C:\dev\image-donation\client\src\components\StreamerLayout.tsx`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/components/StreamerLayout.tsx`)와 다름: 다시 바뀜 → [Day 19](#/day/sp-d19)
  - `C:\dev\image-donation\client\src\pages\DonatePage.tsx`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/pages/DonatePage.tsx`)와 다름: 다시 바뀜 → [Day 29](#/day/sp-d29)
  - `C:\dev\image-donation\client\src\pages\DashboardPage.tsx`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/pages/DashboardPage.tsx`)와 다름: 다시 바뀜 → [Day 19](#/day/sp-d19)

## Day 7 — Docker + PostgreSQL (120분)
- 목표:
  - 왜 PostgreSQL인가(P2의 SQLite와 비교: 별도 서버 프로그램, 여러 연결 동시 처리, `timestamptz`, 배열 열). P3를 안 했어도 되도록 Docker·컨테이너·이미지·볼륨을 처음부터 설명한다.
  - **설치 전 점검으로 시작**(CONTENT-GUIDE 2.3): `Win + R` → `winver`(23H2·빌드 22631 이상), 설정 → 시스템 → 정보의 에디션, 또는 PowerShell `(Get-CimInstance Win32_OperatingSystem).Caption`. 체크리스트: WSL 2(`wsl --version`), BIOS 가상화(작업 관리자 → 성능 → CPU "가상화: 사용"), RAM 8 GB. Home이면 `:::warn` "Docker Desktop이 동작하지 않을 수 있으니 안 되면 Docker 없는 경로로 진행해요" — 지원된다/안 된다고 단정하지 않는다.
  - Docker Desktop 설치(per-user 기본, "Use WSL 2 instead of Hyper-V"), 개인 학습은 무료라는 조건 한 줄(작성 기준일 2026-11), `docker --version`, `docker run hello-world`.
  - `C:\dev\image-donation\docker-compose.yml`(db 서비스만, 개발용으로 `127.0.0.1:5432` 공개), `.env.example`(커밋) + `.env`(복사해서 실제 비밀번호, 커밋 안 함, 영문·숫자만), `.gitignore`에 `.env`. 볼륨은 `pgdata:/var/lib/postgresql`(PostgreSQL 18 이미지 규칙, `/data` 아님).
  - `docker compose up -d` → `docker compose ps`(healthy) → `docker compose exec db psql -U imagedonation -d image_donation` → `SELECT version();`, `\q`. `docker compose stop`/`down`/`down -v`의 차이.
  - **Docker 없는 경로**(같은 무게로): `winget install PostgreSQL.PostgreSQL.18`(관리자 권한, 포트 5432, 설치 중 정한 슈퍼유저 비밀번호 기억) → `& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -p 5432 -c "CREATE DATABASE image_donation;"`(경로가 다르면 `Get-ChildItem "C:\Program Files\PostgreSQL"`). 이 길을 고른 사람은 Day 8부터 연결 문자열의 사용자 이름이 `postgres`다.
  - README에 "DB 실행 방법" 두 가지를 기록한다.
- 이미 배운 것:
  - SQL 기초(테이블·키·SELECT/INSERT/UPDATE/DELETE, [P2 Day 19](#/day/p2-d19)), 설정 값과 비밀 값을 코드 밖에 두는 원칙([P2 Day 24](#/day/p2-d24), [P2 Day 26](#/day/p2-d26))
  - 터미널·전체 경로([P2 Day 2](#/day/p2-d02)), [Day 2](#/day/sp-d02) 포트 계획
  - P3 [P3 Day 33](#/day/p3-d33)~[P3 Day 34](#/day/p3-d34)를 했다면 복습이지만, 하지 않았다고 가정하고 처음부터 설명한다
- 시작 상태:
  - [Day 6](#/day/sp-d06) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 6](#/day/sp-d06)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`, `sample-donations.json`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`, `api.ts`, `donationList.ts`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`, `DonationForm.tsx`, `StreamerLayout.tsx`
  - `C:\dev\image-donation\client\src\hooks\`: `useImagePreview.ts`
  - `C:\dev\image-donation\client\src\pages\`: `DonatePage.tsx`, `DashboardPage.tsx`
  - 관리자 권한으로 설치할 수 있는 Windows 11 PC(회사 PC면 정책상 막힐 수 있음). 인터넷 필요(설치·이미지 받기).
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\README.md` [바꿈] — DB 실행 방법 두 가지(Docker / Docker 없이) (레퍼런스 `README.md`)
  - `C:\dev\image-donation\.gitignore` [바꿈] — + `.env` (레퍼런스 `.gitignore`)
  - `C:\dev\image-donation\.env.example` [새로] — `POSTGRES_USER=imagedonation`, `POSTGRES_PASSWORD=change-me-db-password`, `POSTGRES_DB=image_donation` (레퍼런스 `.env.example`)
  - `C:\dev\image-donation\.env` [새로] — `.env.example`을 복사해 실제 DB 비밀번호(영문·숫자만)를 넣음. 커밋하지 않음
  - `C:\dev\image-donation\docker-compose.yml` [새로] — `db` 서비스만: `image: postgres:18`, `${POSTGRES_*}` 환경 변수(`:?` 필수 표시), 볼륨 `pgdata:/var/lib/postgresql`, `ports: "127.0.0.1:5432:5432"`, `pg_isready` healthcheck (레퍼런스 `docker-compose.yml`)
- 끝 상태 확인:
  - Docker 경로: `docker compose ps`에 `db`가 `running (healthy)`(문구는 버전에 따라 조금 다를 수 있음), `docker compose exec db psql -U imagedonation -d image_donation -c "SELECT version();"` → `PostgreSQL 18.x …`.
  - Docker 없는 경로: `psql.exe … -d image_donation -c "SELECT version();"` → `PostgreSQL 18.x …`.
  - `git status`에 `.env`가 보이지 않고 `.env.example`·`docker-compose.yml`은 보인다.
- 과제:
  - 1) psql에서 연습 표 `memo(id int primary key, body text)`를 만들고 2행 넣어 SELECT한 뒤 DROP한다 → 정답 요지: P2 SQL 복습. PostgreSQL은 큰따옴표 없는 이름을 소문자로 바꾼다는 점(Day 9의 `"Donations"` 함정)을 미리 본다
  - 2) `docker compose down` 후 `up -d` 하면 연습 데이터는? `down -v` 후에는? → 정답 요지: `down`은 컨테이너만 지우고 볼륨은 남아 데이터가 있다. `-v`는 볼륨까지 지워 데이터가 사라진다(Day 37에서 다시 중요)
- 용어(사전 담당): 없음(이 Day가 담당하는 새 용어 없음)
  - P3 사전 항목에 `[[제목]]`으로 링크하되 **P3를 안 했다고 가정하고 이 Day가 처음부터 설명**(정의만 P3 담당): `[[Docker]]`, `[[컨테이너]]`, `[[컨테이너 이미지]]`, `[[Docker Hub]]`, `[[Docker Desktop]]`, `[[WSL 2]]`, `[[하드웨어 가상화]]`, `[[Docker Compose]]`, `[[볼륨]]`, `[[포트 매핑]]`, `[[PostgreSQL]]`, `[[psql]]`, `[[.env 파일]]`
- 자주 막히는 곳 후보:
  - Windows 11 Home에서 Docker Desktop이 시작되지 않음 → 지원 여부를 단정하지 말고 Docker 없는 경로로 진행(이후 모든 Docker Day에 같은 대안이 있다)
  - BIOS 가상화 꺼짐·WSL 업데이트 필요(`wsl --update`)·설치 후 재부팅 요구 → 단계마다 확인
  - "Docker Desktop starting…"에서 멈춤 → 작업 표시줄 고래 아이콘 상태, 재시작
  - `docker` 명령을 찾을 수 없음 → 설치 후 터미널을 새로 연다
  - `Bind for 127.0.0.1:5432 failed: port is already allocated` 또는 직접 설치한 PostgreSQL·P3 `viewer-arena` DB가 5432 사용 중 → `Get-NetTCPConnection -LocalPort 5432`, 하나만 켠다
  - `required variable POSTGRES_PASSWORD is missing a value: …` → `.env`가 `docker-compose.yml`과 같은 폴더에 있는지, 이름이 `.env.txt`가 아닌지
  - 비밀번호에 `$`·따옴표 → compose 보간으로 깨짐 → 영문·숫자만
  - 볼륨을 `/var/lib/postgresql/data`에 붙임 → 18 이미지에서 오류·경고 → `/var/lib/postgresql`
  - winget 관리자 권한(UAC) 창, psql 전체 경로의 `&`(호출 연산자) 빠뜨림, 콘솔 코드 페이지 경고(psql이 949/1252 차이를 알리는 경고 — 원문은 작성자 확인)
- 레퍼런스 대응:
  - `C:\dev\image-donation\README.md`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/README.md`)와 다름: 다시 바뀜 → [Day 22](#/day/sp-d22)
  - `C:\dev\image-donation\.gitignore`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/.gitignore`)와 다름: 다시 바뀜 → [Day 10](#/day/sp-d10)
  - `C:\dev\image-donation\.env.example`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/.env.example`)와 다름: 다시 바뀜 → [Day 37](#/day/sp-d37)
  - `C:\dev\image-donation\.env`: 레퍼런스에 없음(비밀 값 파일. `.gitignore`가 무시하므로 레퍼런스(커밋된 파일)에 없음)
  - `C:\dev\image-donation\docker-compose.yml`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/docker-compose.yml`)와 다름: 다시 바뀜 → [Day 37](#/day/sp-d37)

## Day 8 — API 뼈대 (110분)
- 목표:
  - `cd C:\dev\image-donation\server` → `dotnet new sln -n ImageDonation`(→ `ImageDonation.slnx`) → `dotnet new web -n ImageDonation.Api -o ImageDonation.Api` → `dotnet sln add ImageDonation.Api\ImageDonation.Api.csproj`. (템플릿이 레퍼런스에 없는 파일을 만들면 지운다 — 작성자가 SDK 10.0.x로 실제 생성해 목록 확인.)
  - `Properties\launchSettings.json`을 레퍼런스처럼 `http` 프로필 하나, `http://localhost:5080`, `launchBrowser: false`로.
  - `dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL --version 10.0.3`, `dotnet add package Microsoft.EntityFrameworkCore.Design --version 10.0.14`(마이그레이션용, Day 9).
  - `Data\AppDbContext.cs`(주 생성자, 아직 DbSet 없음). `Program.cs`: `config.GetConnectionString("Default") ?? throw new InvalidOperationException("ConnectionStrings:Default가 없어요. …")`(빠른 실패), `AddDbContext<AppDbContext>(o => o.UseNpgsql(connectionString))`, 연습용 `GET /api/dbcheck` → `await db.Database.CanConnectAsync()` → `{ canConnect }`(Day 9에서 지움).
  - 비밀 값은 user-secrets: `dotnet user-secrets init --id image-donation-api`(레퍼런스의 `UserSecretsId`) → `dotnet user-secrets set "ConnectionStrings:Default" "Host=127.0.0.1;Port=5432;Database=image_donation;Username=imagedonation;Password=<.env의 값>"`. Docker 없는 경로는 `Username=postgres`와 설치 때 정한 비밀번호. `appsettings.json`에는 절대 넣지 않는다.
  - Npgsql 연결 문자열 형식(`Host`, `Port`, `Database`, `Username`, `Password`)을 SQLite([P2 Day 20](#/day/p2-d20))와 비교.
- 이미 배운 것:
  - [Day 7](#/day/sp-d07) DB 실행(Docker 또는 직접 설치)
  - `dotnet new`·솔루션([P2 Day 9](#/day/p2-d09)), Minimal API·MapGet·포트·`dotnet watch`([P2 Day 17](#/day/p2-d17)), DbContext·Design 패키지·dotnet-ef([P2 Day 20](#/day/p2-d20)), appsettings·환경·설정 읽기([P2 Day 24](#/day/p2-d24)), user-secrets([P2 Day 26](#/day/p2-d26))
- 시작 상태:
  - [Day 7](#/day/sp-d07) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 7](#/day/sp-d07)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`, `.env.example`, `.env`, `docker-compose.yml`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`, `sample-donations.json`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`, `api.ts`, `donationList.ts`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`, `DonationForm.tsx`, `StreamerLayout.tsx`
  - `C:\dev\image-donation\client\src\hooks\`: `useImagePreview.ts`
  - `C:\dev\image-donation\client\src\pages\`: `DonatePage.tsx`, `DashboardPage.tsx`
  - PostgreSQL이 켜져 있다: Docker 경로는 `cd C:\dev\image-donation` → `docker compose up -d`, Docker 없는 경로는 Windows 서비스로 실행 중.
  - .NET 10 SDK(`dotnet --version` → 10.0.x).
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\server\ImageDonation.slnx` [새로] — `dotnet new sln -n ImageDonation` + `dotnet sln add ImageDonation.Api` (레퍼런스 `server/ImageDonation.slnx`)
  - `C:\dev\image-donation\server\ImageDonation.Api\ImageDonation.Api.csproj` [새로] — `dotnet new web` + `<UserSecretsId>image-donation-api</UserSecretsId>` + Npgsql.EntityFrameworkCore.PostgreSQL 10.0.3, Microsoft.EntityFrameworkCore.Design 10.0.14 (레퍼런스 `server/ImageDonation.Api/ImageDonation.Api.csproj`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Properties\launchSettings.json` [새로] — `http` 프로필 하나, `applicationUrl: http://localhost:5080`, `launchBrowser: false` (레퍼런스 `server/ImageDonation.Api/Properties/launchSettings.json`)
  - `C:\dev\image-donation\server\ImageDonation.Api\appsettings.json` [새로] — 템플릿(Logging, AllowedHosts). 연결 문자열은 넣지 않음 (레퍼런스 `server/ImageDonation.Api/appsettings.json`)
  - `C:\dev\image-donation\server\ImageDonation.Api\appsettings.Development.json` [새로] — 템플릿 그대로 (레퍼런스 `server/ImageDonation.Api/appsettings.Development.json`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Program.cs` [새로] — 연결 문자열 빠른 실패, `AddDbContext<AppDbContext>(o => o.UseNpgsql(...))`, 연습용 `GET /api/dbcheck` → `{ canConnect }` (레퍼런스 `server/ImageDonation.Api/Program.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\AppDbContext.cs` [새로] — 주 생성자로 `DbContextOptions<AppDbContext>`만 받는 빈 DbContext (레퍼런스 `server/ImageDonation.Api/Data/AppDbContext.cs`)
- 끝 상태 확인:
  - `cd C:\dev\image-donation\server\ImageDonation.Api` → `dotnet run` → `Now listening on: http://localhost:5080`.
  - 브라우저 `http://localhost:5080/api/dbcheck` → `{"canConnect":true}`.
  - `dotnet user-secrets list` → `ConnectionStrings:Default = Host=…`(방송·스크린샷에 비밀번호가 보이지 않게 주의).
  - `git status`에 비밀번호가 든 파일이 없다(user-secrets는 프로젝트 밖 `%APPDATA%\Microsoft\UserSecrets\image-donation-api\secrets.json`).
- 과제:
  - 1) DB를 끄고(`docker compose stop db` 또는 서비스 중지) dbcheck를 다시 연다 → 정답 요지: `canConnect: false`(또는 시간 초과 후 false). 다시 켜면 true. 서버가 DB 없이도 켜지는 것과 "설정이 없으면 시작조차 안 하는 것"(빠른 실패)의 차이를 설명
  - 2) 연결 문자열을 `appsettings.json`에 쓰면 안 되는 이유를 쓴다 → 정답 요지: appsettings.json은 Git에 커밋된다 → 비밀번호가 저장소·공개 GitHub에 남는다. 개발은 user-secrets, Docker는 환경 변수(Day 37)
- 용어(사전 담당): `Npgsql`, `빠른 실패`
  - 앞 프로젝트(P1·P2)에서 배운 용어, 다시 짚을 때 `[[제목]]`으로 링크: `[[연결 문자열]]`, `[[user-secrets]]`, `[[EF Core]]`, `[[DbContext]]`, `[[NuGet]]`, `[[솔루션]]`, `[[launchSettings.json]]`
- 자주 막히는 곳 후보:
  - `user-secrets`를 솔루션 폴더(`server`)에서 실행 → `Could not find a MSBuild project file` → 프로젝트 폴더에서
  - `Npgsql.PostgresException: 28P01: password authentication failed for user "imagedonation"` → `.env`와 같은 비밀번호인지. 볼륨이 처음 만들어질 때의 비밀번호가 유지된다는 점(Day 37 함정 예고)
  - `Host=localhost`가 IPv6(::1)로 먼저 가서 늦거나 실패할 수 있음 → Docker는 `127.0.0.1`로 공개했으니 `Host=127.0.0.1` (Docker 없는 경로는 `localhost`도 됨)
  - `Failed to bind to address http://127.0.0.1:5080: address already in use` → 다른 dotnet 프로세스(이전 `dotnet watch`) 종료
  - NuGet 복원 실패(네트워크·회사 프록시) → 인터넷 연결, `dotnet restore` 다시
  - Windows PowerShell 5.1에서 `&&`로 명령 잇기 실패 → 한 줄에 하나씩(CONTENT-GUIDE 3.4)
- 레퍼런스 대응:
  - `C:\dev\image-donation\server\ImageDonation.slnx`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.slnx`)와 다름: 다시 바뀜 → [Day 25](#/day/sp-d25)
  - `C:\dev\image-donation\server\ImageDonation.Api\ImageDonation.Api.csproj`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/ImageDonation.Api.csproj`)와 다름: 다시 바뀜 → [Day 11](#/day/sp-d11)
  - `C:\dev\image-donation\server\ImageDonation.Api\Properties\launchSettings.json`: `reference/sp-image-donation/server/ImageDonation.Api/Properties/launchSettings.json` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Api\appsettings.json`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/appsettings.json`)와 다름: 다시 바뀜 → [Day 10](#/day/sp-d10)
  - `C:\dev\image-donation\server\ImageDonation.Api\appsettings.Development.json`: `reference/sp-image-donation/server/ImageDonation.Api/appsettings.Development.json` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Api\Program.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Program.cs`)와 다름: 다시 바뀜 → [Day 9](#/day/sp-d09)
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\AppDbContext.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Data/AppDbContext.cs`)와 다름: 다시 바뀜 → [Day 9](#/day/sp-d09)

## Day 9 — 데이터 모델링 (120분)
- 목표:
  - 상태 전이도(레퍼런스 README "후원 상태" 그림)를 그리고 7개 상태의 뜻을 정한다: AwaitingCheese(치즈 대기), Pending(검수 대기), Approved(승인됨), Shown(방송 완료), Rejected(거절됨, 신고 포함), Expired(만료됨), Cleared(긴급 정지됨). 오늘은 표와 enum만, 실제 전이 코드는 Day 17·27·31.
  - `Entities\StreamerSettings.cs`(최종): `DonationMode { Free, Cheese }`, 기본값(MinCheese 1000, AutoApprove false, DisplaySeconds 8, MinIntervalSeconds 2, MaxFileMb 5, BannedWords `[]`, `MaxFileMbLimit = 10`). `Entities\Donation.cs`(최종): 7개 상태 + 필드 전부(파일은 레퍼런스 그대로 — Code·CheeseAmount·SenderIpHash가 Day 14·27에서 채워진다는 설명은 본문에만 쓰고 파일에 주석을 더하지 않는다).
  - `Entities\Streamer.cs`는 Id·Slug·DisplayName·OverlayToken·CreatedAt·Settings만(UserId와 토큰 생성은 Day 13).
  - `AppDbContext.OnModelCreating`: Slug 30자·고유 인덱스, DisplayName 40자, OverlayToken 고유, Streamer ↔ Settings 1:1(`HasForeignKey<StreamerSettings>(x => x.StreamerId)`, Settings 키 = StreamerId), `Mode`·`Status`를 `HasConversion<string>()`(DB에 "Pending" 같은 글자), Nickname 20·Message 100·Code 5, 인덱스 (StreamerId, Status)·CreatedAt. `string[]` → `text[]`, `DateTimeOffset` → `timestamp with time zone`.
  - `dotnet ef migrations add InitialCreate` → `Program.cs`에 시작할 때 `Database.Migrate()`(레퍼런스와 같은 scope 블록), `/api/dbcheck` 지움.
  - psql로 확인하고 연습용 스트리머 1명을 SQL로 넣는다(Day 10~12 업로드 연습용, Day 13에서 지움): `INSERT INTO "Streamers" ("Slug","DisplayName","OverlayToken","CreatedAt") VALUES ('test-stream','Test Stream','dev-token-1', now()) RETURNING "Id";` → 그 Id로 `INSERT INTO "StreamerSettings" ("StreamerId","Mode","MinCheese","AutoApprove","DisplaySeconds","MinIntervalSeconds","MaxFileMb","BannedWords") VALUES (<Id>,'Free',1000,false,8,2,5,'{}');` (열 이름은 작성자가 생성된 마이그레이션으로 확인).
- 이미 배운 것:
  - [Day 1](#/day/sp-d01) 후원 상태 개요, [Day 8](#/day/sp-d08)
  - 클래스·속성·record([P2 Day 12](#/day/p2-d12)), C# [[열거형]]과 switch([P2 Day 10](#/day/p2-d10)), 테이블·키([P2 Day 19](#/day/p2-d19)), 엔티티·마이그레이션·dotnet-ef([P2 Day 20](#/day/p2-d20)), 1:N·외래 키·Include([P2 Day 22](#/day/p2-d22)), UTC로 저장하기([P2 Day 29](#/day/p2-d29))
- 시작 상태:
  - [Day 8](#/day/sp-d08) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 8](#/day/sp-d08)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`, `.env.example`, `.env`, `docker-compose.yml`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`, `sample-donations.json`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`, `api.ts`, `donationList.ts`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`, `DonationForm.tsx`, `StreamerLayout.tsx`
  - `C:\dev\image-donation\client\src\hooks\`: `useImagePreview.ts`
  - `C:\dev\image-donation\client\src\pages\`: `DonatePage.tsx`, `DashboardPage.tsx`
  - `C:\dev\image-donation\server\`: `ImageDonation.slnx`
  - `C:\dev\image-donation\server\ImageDonation.Api\`: `ImageDonation.Api.csproj`, `appsettings.json`, `appsettings.Development.json`, `Program.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\`: `AppDbContext.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Properties\`: `launchSettings.json`
  - PostgreSQL 실행 중. `dotnet-ef --version` → 10.0.14(없으면 `dotnet tool install --global dotnet-ef --version 10.0.14`, [P2 Day 20](#/day/p2-d20)).
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\server\ImageDonation.Api\Program.cs` [바꿈] — 시작할 때 `Database.Migrate()`, `/api/dbcheck` 지움 (레퍼런스 `server/ImageDonation.Api/Program.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\AppDbContext.cs` [바꿈] — + DbSet `Streamers`, `StreamerSettings`, `Donations` + OnModelCreating(Slug 30자·고유, DisplayName 40자, OverlayToken 고유, 1:1 Settings, Mode·Status 글자 저장, Nickname 20·Message 100·Code 5, 인덱스 (StreamerId, Status)·CreatedAt) (레퍼런스 `server/ImageDonation.Api/Data/AppDbContext.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\Streamer.cs` [새로] — Id, Slug, DisplayName, OverlayToken, CreatedAt, Settings (UserId 없이) (레퍼런스 `server/ImageDonation.Api/Entities/Streamer.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\StreamerSettings.cs` [새로] — `DonationMode { Free, Cheese }` + 설정 행(Mode, MinCheese 1000, AutoApprove, DisplaySeconds 8, MinIntervalSeconds 2, MaxFileMb 5, BannedWords `string[]`, `MaxFileMbLimit = 10`) (레퍼런스 `server/ImageDonation.Api/Entities/StreamerSettings.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\Donation.cs` [새로] — `DonationStatus` 7개(AwaitingCheese, Pending, Approved, Shown, Rejected, Expired, Cleared)와 주석의 전이 규칙 + Donation 필드 전부 (레퍼런스 `server/ImageDonation.Api/Entities/Donation.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\<시각>_InitialCreate.cs (+ .Designer.cs)` [새로] — `dotnet ef migrations add InitialCreate` (Streamers, StreamerSettings, Donations)
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\AppDbContextModelSnapshot.cs` [새로] — dotnet-ef가 만듦 (레퍼런스 `server/ImageDonation.Api/Migrations/AppDbContextModelSnapshot.cs`)
- 끝 상태 확인:
  - `dotnet ef migrations add InitialCreate`가 `Done.`으로 끝나고 `Migrations` 폴더에 파일 3개가 생긴다.
  - `dotnet run` 로그에 `Applying migration '…_InitialCreate'`. 맨 처음 한 번 보이는 `Failed executing DbCommand … __EFMigrationsHistory`는 정상(아직 기록 표가 없어서)이라고 미리 알려 준다.
  - psql `\dt` → `Donations`, `StreamerSettings`, `Streamers`, `__EFMigrationsHistory`. `\d "Donations"` → `Status`가 `text`, `CreatedAt`이 `timestamp with time zone`. `\d "StreamerSettings"` → `BannedWords`가 `text[]`.
  - 연습 스트리머 INSERT 후 `SELECT "Id","Slug" FROM "Streamers";` → `test-stream` 1행.
- 과제:
  - 1) 상태 전이표를 채운다: 지금 상태 → 할 수 있는 일 → 다음 상태 → 정답 요지: 검수 대기 → 승인(승인됨)·거절(거절됨), 승인됨 → 표시 끝(방송 완료)·긴급 정지(긴급 정지됨), 치즈 대기 → 코드 확인(검수 대기, 자동 승인이면 승인됨)·30분 지남(만료됨), 거절·만료가 아니면 → 신고(거절됨). 그 밖의 이동은 없다
  - 2) Status를 숫자(0~6)로 저장하면 불편한 점 두 가지 → 정답 요지: psql로 볼 때 뜻을 알 수 없다, 나중에 enum 순서를 바꾸면 옛 데이터의 뜻이 바뀐다. 글자로 저장하면 둘 다 없다
- 용어(사전 담당): `상태 전이`, `배열 열`
  - P3 사전 항목에 `[[제목]]`으로 링크하되 **P3를 안 했다고 가정하고 이 Day가 처음부터 설명**(정의만 P3 담당): `[[데이터베이스 인덱스]]`
  - 앞 프로젝트(P1·P2)에서 배운 용어, 다시 짚을 때 `[[제목]]`으로 링크: `[[열거형]]`, `[[마이그레이션]]`, `[[dotnet-ef]]`, `[[기본 키]]`
- 자주 막히는 곳 후보:
  - `Could not execute because the specified command or file was not found` (dotnet-ef 없음) → 설치, 터미널 재시작
  - `Your startup project 'ImageDonation.Api' doesn't reference Microsoft.EntityFrameworkCore.Design.` → Day 8 패키지 확인
  - `relation "donations" does not exist` → PostgreSQL은 따옴표 없는 이름을 소문자로 바꾼다 → `"Donations"`처럼 큰따옴표
  - 마이그레이션을 잘못 만듦 → 적용 전이면 `dotnet ef migrations remove`
  - 모델을 바꾸고 마이그레이션을 안 만들면 시작할 때 `PendingModelChangesWarning` 예외 → `migrations add`
  - psql에 한글을 넣으면 인코딩 문제 → 연습 데이터는 영문으로(표시 이름은 Day 13 온보딩에서 한글로)
- 레퍼런스 대응:
  - `C:\dev\image-donation\server\ImageDonation.Api\Program.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Program.cs`)와 다름: 다시 바뀜 → [Day 10](#/day/sp-d10)
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\AppDbContext.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Data/AppDbContext.cs`)와 다름: 다시 바뀜 → [Day 13](#/day/sp-d13)
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\Streamer.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Entities/Streamer.cs`)와 다름: 다시 바뀜 → [Day 13](#/day/sp-d13)
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\StreamerSettings.cs`: `reference/sp-image-donation/server/ImageDonation.Api/Entities/StreamerSettings.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\Donation.cs`: `reference/sp-image-donation/server/ImageDonation.Api/Entities/Donation.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\<시각>_InitialCreate.cs (+ .Designer.cs)`: 레퍼런스와 이름 다름: 학습자 마이그레이션 이력(레퍼런스는 InitialCreate·SafetyReportsAndMinimalEvents 2개). 최종 스키마는 AppDbContextModelSnapshot.cs로 같음
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\AppDbContextModelSnapshot.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Migrations/AppDbContextModelSnapshot.cs`)와 다름: 다시 바뀜 → [Day 13](#/day/sp-d13)

## Day 10 — 파일 업로드 ① (110분)
- 목표:
  - `Endpoints\PublicEndpoints.cs`: `MapGroup("/api/public/streamers/{slug}")` + `POST /donations`(`IFormFile? image`, `[FromForm] string? nickname`, `[FromForm] string? message`). 없는 slug 404, 이미지 없음 400, 스트리머 `MaxFileMb` 초과 413(ProblemDetails "이미지는 5MB까지 올릴 수 있어요."). 이 Day에는 닉네임·메시지를 받은 그대로 저장(검사는 Day 14).
  - 크기 제한 두 겹: 서버 전체 `MaxUploadBytes`(10MB) + 64KB 여유로 `Configure<FormOptions>(o => o.MultipartBodyLengthLimit = …)`와 `RequestSizeLimitAttribute`, 스트리머별 `MaxFileMb`.
  - `.DisableAntiforgery()`: 쿠키를 쓰지 않는 공개 API라 위조 방지 토큰이 필요 없다([P2 Day 34](#/day/p2-d34)의 CSRF와 연결).
  - `Services\Storage\LocalImageStorage.cs` 첫 버전: `Storage:MediaPath`(appsettings `"media"`)를 `ContentRootPath` 기준 전체 경로로 + 폴더 만들기, 파일 이름은 `Guid.NewGuid():N` + `.bin`(아직 무엇인지 검사 전인 바이트라는 뜻, Day 11에 `.webp`로), 정해진 형식만 허용하는 `IsValidFileName`. 시청자가 보낸 파일 이름은 쓰지 않는다. 첫 버전의 정확한 모양은 9절 부록 G.
  - Donation 행을 Pending으로 저장하고 201 `{ "id": 1, "status": "Pending" }`(`Dtos\DonationDtos.cs`의 `CreateDonationResponse`). enum을 글자로 주도록 `ConfigureHttpJsonOptions(JsonStringEnumConverter)`.
  - `.gitignore`에 `server/ImageDonation.Api/media/`.
  - 연습 폴더 `C:\dev\sp-practice\`(프로젝트 밖)를 만든다: `api.http`(REST Client, [P2 Day 16](#/day/p2-d16))와 `images\`(휴대폰 사진 `photo.jpg`, `small.png`, 메모장 글자 파일의 이름만 바꾼 `fake.png`, PowerShell `$b = New-Object byte[] 7000000; [IO.File]::WriteAllBytes("C:\dev\sp-practice\images\big.jpg", $b)`로 만든 7MB `big.jpg` — 스트리머 한도 5MB보다 크고 서버 전체 상한(10MB + 64KB)보다 작아야 엔드포인트의 "이미지는 5MB까지…"가 보인다). REST Client multipart 문법(boundary 줄, 파일은 `< ./images/photo.jpg`)을 정확히 싣는다 — `api.http`의 변수·요청 이름·boundary는 9절 부록 F를 그대로 쓴다(작성자가 REST Client로 실행 확인 — 이 환경에서 확장 실행은 미확인).
  - 오늘 처음(C#): 업로드 바이트를 담는 `byte[]`와 `MemoryStream`·`CopyToAsync`, 그리고 정규 표현식([[정규 표현식]], [P1 Day 24](#/day/p1-d24))을 C#에서 쓰는 법 — `[GeneratedRegex("…")]` 특성을 붙인 `static partial` 메서드와 `partial class`(빌드할 때 소스 생성기가 나머지 절반을 만든다), 패턴 끝의 `\z`(문자열 끝. `$`는 끝의 줄바꿈 한 개를 통과시킨다). 파일 모양은 9절 부록 G.
- 이미 배운 것:
  - [Day 9](#/day/sp-d09) Donation·StreamerSettings, 연습 스트리머 `test-stream`
  - HTTP 메서드·상태 코드·헤더·`.http` 파일([P2 Day 16](#/day/p2-d16)), POST·`TypedResults.Created`([P2 Day 18](#/day/p2-d18)), MapGroup·DI·DTO([P2 Day 23](#/day/p2-d23)), ProblemDetails([P2 Day 24](#/day/p2-d24)), CSRF·SameSite([P2 Day 34](#/day/p2-d34)), 비동기 DB 저장([P2 Day 21](#/day/p2-d21))
- 시작 상태:
  - [Day 9](#/day/sp-d09) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 9](#/day/sp-d09)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`, `.env.example`, `.env`, `docker-compose.yml`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`, `sample-donations.json`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`, `api.ts`, `donationList.ts`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`, `DonationForm.tsx`, `StreamerLayout.tsx`
  - `C:\dev\image-donation\client\src\hooks\`: `useImagePreview.ts`
  - `C:\dev\image-donation\client\src\pages\`: `DonatePage.tsx`, `DashboardPage.tsx`
  - `C:\dev\image-donation\server\`: `ImageDonation.slnx`
  - `C:\dev\image-donation\server\ImageDonation.Api\`: `ImageDonation.Api.csproj`, `appsettings.json`, `appsettings.Development.json`, `Program.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\`: `AppDbContext.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\`: `Streamer.cs`, `StreamerSettings.cs`, `Donation.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\`: `<시각>_InitialCreate.cs (+ .Designer.cs)`, `AppDbContextModelSnapshot.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Properties\`: `launchSettings.json`
  - PostgreSQL 실행 중, `server\ImageDonation.Api`에서 `dotnet run`(또는 `dotnet watch`) 가능.
  - VS Code REST Client 확장 설치됨([P2 Day 16](#/day/p2-d16)).
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\.gitignore` [바꿈] — + `server/ImageDonation.Api/media/` (레퍼런스 `.gitignore`)
  - `C:\dev\image-donation\server\ImageDonation.Api\appsettings.json` [바꿈] — + `"Storage": { "MediaPath": "media" }` (레퍼런스 `server/ImageDonation.Api/appsettings.json`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Program.cs` [바꿈] — + `ConfigureHttpJsonOptions`(JsonStringEnumConverter), `Configure<FormOptions>`, `AddSingleton<LocalImageStorage>()`, `MapPublicEndpoints()` (레퍼런스 `server/ImageDonation.Api/Program.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\DonationDtos.cs` [새로] — `CreateDonationResponse(int Id, DonationStatus Status)` + "AddValidation은 public 타입에만" 주석 (레퍼런스 `server/ImageDonation.Api/Dtos/DonationDtos.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\PublicEndpoints.cs` [새로] — `MapGroup("/api/public/streamers/{slug}")`, `POST /donations`(IFormFile, [FromForm] nickname·message, 404·400·413, `DisableAntiforgery`, `RequestSizeLimit`) → 파일 저장 + Donation(Pending) → 201 `{id,status}`, `MaxUploadBytes` (레퍼런스 `server/ImageDonation.Api/Endpoints/PublicEndpoints.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\LocalImageStorage.cs` [새로] — `Storage:MediaPath`를 ContentRootPath 기준 전체 경로로, 폴더 만들기, `IsValidFileName`(`^[0-9a-f]{32}\.bin\z`), `SaveAsync`(GUID 이름) — 정확한 모양은 9절 부록 G (레퍼런스 `server/ImageDonation.Api/Services/Storage/LocalImageStorage.cs`)
  - `C:\dev\sp-practice\api.http` [새로] — `@host = http://localhost:5080`, multipart 업로드 요청(`< ./images/photo.jpg`), 413 확인용 요청 — 정확한 모양은 9절 부록 F
  - `C:\dev\sp-practice\images\` [새로] — `photo.jpg`(휴대폰으로 세로로 찍은 사진), `small.png`, `big.jpg`(PowerShell로 만든 7MB 파일), `fake.png`(메모장 글자 파일의 이름만 바꾼 것)
- 끝 상태 확인:
  - REST Client로 `photo.jpg` 업로드 → `HTTP/1.1 201 Created`, 본문 `{"id":1,"status":"Pending"}`.
  - `C:\dev\image-donation\server\ImageDonation.Api\media\`에 32자리 16진수 + `.bin` 파일이 생기고, psql `SELECT "Id","ImageFile","Status" FROM "Donations";`의 ImageFile과 이름이 같다.
  - `big.jpg` → `413` + `"detail":"이미지는 5MB까지 올릴 수 있어요."`. 없는 slug → 404. 이미지 없이 → 400.
  - `git status`에 `media` 폴더가 안 보인다.
- 과제:
  - 1) psql로 test-stream의 `MaxFileMb`를 1로 바꾸고 2MB 넘는 사진을 올려 413을 확인한 뒤 5로 되돌린다 → 정답 요지: `UPDATE "StreamerSettings" SET "MaxFileMb" = 1 WHERE "StreamerId" = <Id>;` → 413 "1MB까지". 서버 재시작 없이 바로 적용되는 이유: 요청마다 DB에서 설정을 읽는다
  - 2) 시청자가 보낸 파일 이름을 그대로 저장하면 생기는 문제 두 가지 → 정답 요지: `..\..\appsettings.json` 같은 이름으로 폴더 밖 파일 덮어쓰기(경로 조작), 같은 이름이 오면 다른 사람 이미지를 덮어씀. 그 밖에 한글·공백·아주 긴 이름
- 용어(사전 담당): `multipart/form-data`, `IFormFile`, `GUID`, `경로 조작`
- 자주 막히는 곳 후보:
  - REST Client multipart에서 boundary 앞의 `--`, 부분 사이 빈 줄, 마지막 `--boundary--`를 빠뜨림 → 400이나 빈 파일
  - `< ./images/photo.jpg` 경로는 `.http` 파일이 있는 폴더 기준. OneDrive·바탕 화면의 사진을 직접 가리키지 말고 `C:\dev\sp-practice\images`로 복사
  - `DisableAntiforgery()`를 빠뜨리면 폼 바인딩이 위조 방지 검사에 걸림(원문은 작성자가 실행해 캡처)
  - `media` 폴더가 `bin\Debug\…` 아래에 생겼다고 착각 → `dotnet run`은 프로젝트 폴더가 ContentRoot
  - 10MB 넘는 파일을 보내면 엔드포인트에 닿기 전에 서버의 본문 상한에 걸려 "이미지는 5MB까지…" 대신 다른 413 응답이나 연결 끊김이 보인다 → 연습 파일은 7MB(원문은 작성자가 실행해 기록)
  - 백신 프로그램이 새로 쓴 파일을 잠시 잠금 → 다시 시도
- 레퍼런스 대응:
  - `C:\dev\image-donation\.gitignore`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/.gitignore`)와 다름: 다시 바뀜 → [Day 37](#/day/sp-d37)
  - `C:\dev\image-donation\server\ImageDonation.Api\appsettings.json`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/appsettings.json`)와 다름: 다시 바뀜 → [Day 12](#/day/sp-d12)
  - `C:\dev\image-donation\server\ImageDonation.Api\Program.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Program.cs`)와 다름: 다시 바뀜 → [Day 11](#/day/sp-d11)
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\DonationDtos.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Dtos/DonationDtos.cs`)와 다름: 다시 바뀜 → [Day 14](#/day/sp-d14)
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\PublicEndpoints.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Endpoints/PublicEndpoints.cs`)와 다름: 다시 바뀜 → [Day 11](#/day/sp-d11)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\LocalImageStorage.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Services/Storage/LocalImageStorage.cs`)와 다름: 다시 바뀜 → [Day 11](#/day/sp-d11)
  - `C:\dev\sp-practice\api.http`: 레퍼런스에 없음(프로젝트 밖 연습 파일(P2 Day 16의 REST Client로 실행). 레퍼런스에는 없고 최종 프로젝트 폴더에도 들어가지 않음)
  - `C:\dev\sp-practice\images\`: 레퍼런스에 없음(학습자가 준비하는 연습 이미지 폴더)

## Day 11 — 파일 업로드 ② 보안 (120분)
- 목표:
  - 왜 확장자·Content-Type을 믿지 않는가(이름만 바꾼 `fake.png`). 매직 넘버: JPEG `FF D8 FF`, PNG `89 50 4E 47 0D 0A 1A 0A`, GIF `47 49 46 38`, WebP `RIFF….WEBP`. PowerShell `Format-Hex`로 직접 본다.
  - 라이브러리 선택(`:::info` 한 번): ImageSharp 3.2+/4.x는 빌드할 때 라이선스 키가 필요하고 Split License라 매출 기준이 있다 → 이 교재는 MIT인 SkiaSharp 4.154.0을 쓴다(R28). `dotnet add package SkiaSharp --version 4.154.0` + `SkiaSharp.NativeAssets.Linux.NoDependencies --version 4.154.0`(Docker용, Windows는 SkiaSharp가 Win32 네이티브를 함께 받음).
  - `Services\ImageProcessor.cs`(레퍼런스 최종, 181줄)는 **직접 타이핑하지 않고** 오늘 끝 코드를 붙여 넣은 뒤 위에서부터 읽는다(Day 34와 같은 방식). `HasAllowedSignature`·`ChooseDecodeSize`·`ApplyOrigin`을 포함해 파일 전체를 붙여 넣고 읽기만 한다(오늘 손으로 쓰는 C# 줄은 없다). 손으로 하는 일은 Format-Hex로 연습 이미지의 매직 넘버를 직접 보고, `Process`의 단계 주석 6개를 아래 순서와 짝지어 보는 것이다. 순서: 매직 넘버 → `SKCodec.Create`(머리글만, 이미지가 아니면 null) → 원본 1억 픽셀(`MaxSourcePixels`) 넘으면 거절 → 축소 디코딩 크기 선택(`GetScaledDimensions`, JPEG는 1/8 단위) → 첫 장면만 sRGB로 디코딩(4096×4096 `MaxDecodePixels`, 잘린 파일 거절, 움직이는 GIF는 첫 장면 — R29) → 긴 변 1280px(작으면 키우지 않음) → EXIF 방향 1~8을 캔버스로 적용 → WebP 품질 80 재인코딩(색 공간 없는 비트맵이라 EXIF·XMP·ICC가 안 따라감).
  - 네이티브 메모리를 쓰는 `SKData`·`SKCodec`·`SKBitmap`·`SKImage`·`SKCanvas`는 모두 `using`. `DrawBitmap(bitmap, x, y, SKSamplingOptions.Default, null)`(샘플링 없는 오버로드는 CS0618 obsolete).
  - 업로드 엔드포인트가 `ImageProcessor.Process`를 거쳐 저장하고 `InvalidImageException`은 400. `LocalImageStorage`의 이름 형식을 `.webp`로(Day 10에서 본 `\z` 그대로). `AddSingleton<ImageProcessor>()`.
  - 연습 이미지에 `animated.gif`를 추가한다. Day 10에 생긴 `.bin` 파일은 지워도 된다(Day 12 정리 작업도 7일 뒤 지움).
  - `:::info 읽기만 해요` 상자 하나로 오늘 처음 보는 C# 문법을 짚는다(오늘은 직접 쓰지 않는다 — 읽을 수 있으면 된다): `ReadOnlySpan<byte>`(배열의 한 부분을 복사 없이 보는 창), `"GIF87a"u8`(글자를 UTF-8 바이트로 쓰는 리터럴), 범위 `h[..4]`·`h[8..12]`, 컬렉션 식 `[0x89, 0x50, …]`, `is not (A or B)`([P2 Day 13](#/day/p2-d13) 패턴 매칭의 확장), `switch`로 방향 8가지 나누기.
  - `HasAllowedSignature` 한 줄씩 읽기 안내(같은 `:::info` 상자 안, Format-Hex 결과와 나란히): ① `(ReadOnlySpan<byte> h)` — 업로드 바이트의 앞부분을 복사 없이 받는다 ② `jpeg`: 길이가 3 이상이고 `h[0]`·`h[1]`·`h[2]`가 `FF D8 FF` ③ `png`: `h.StartsWith((ReadOnlySpan<byte>)[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])` — 대괄호는 바이트 8개짜리 컬렉션 식, 앞의 괄호는 "바이트 창으로 보라"는 형 변환 ④ `gif`: `"GIF87a"u8`·`"GIF89a"u8` — 글자 6개를 그 글자의 바이트로 바꾼 값 ⑤ `webp`: 길이 12 이상, `h[..4]`(0~3번 바이트)가 `RIFF`이고 `h[8..12]`(8~11번)가 `WEBP` ⑥ 넷 중 하나라도 맞으면 `true`. 시간 배분: 붙여 넣기 5분 + 이 안내로 읽기 15분(Day 120분 안).
- 이미 배운 것:
  - [Day 10](#/day/sp-d10) 업로드·저장
  - 예외 던지기·잡기([P2 Day 15](#/day/p2-d15)), record([P2 Day 12](#/day/p2-d12)), `byte[]`([Day 10](#/day/sp-d10)), using 선언([P2 Day 15](#/day/p2-d15)), 패턴 매칭([P2 Day 13](#/day/p2-d13)), NuGet 패키지 설치([P2 Day 20](#/day/p2-d20))
- 시작 상태:
  - [Day 10](#/day/sp-d10) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 10](#/day/sp-d10)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`, `.env.example`, `.env`, `docker-compose.yml`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`, `sample-donations.json`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`, `api.ts`, `donationList.ts`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`, `DonationForm.tsx`, `StreamerLayout.tsx`
  - `C:\dev\image-donation\client\src\hooks\`: `useImagePreview.ts`
  - `C:\dev\image-donation\client\src\pages\`: `DonatePage.tsx`, `DashboardPage.tsx`
  - `C:\dev\image-donation\server\`: `ImageDonation.slnx`
  - `C:\dev\image-donation\server\ImageDonation.Api\`: `ImageDonation.Api.csproj`, `appsettings.json`, `appsettings.Development.json`, `Program.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\`: `AppDbContext.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\`: `DonationDtos.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\`: `PublicEndpoints.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\`: `Streamer.cs`, `StreamerSettings.cs`, `Donation.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\`: `<시각>_InitialCreate.cs (+ .Designer.cs)`, `AppDbContextModelSnapshot.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Properties\`: `launchSettings.json`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\`: `LocalImageStorage.cs`
  - `C:\dev\sp-practice\`: `api.http`
  - `C:\dev\sp-practice\images\`: `(폴더)`
  - PostgreSQL 실행 중, `C:\dev\sp-practice\api.http`와 `images\`가 있다.
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\server\ImageDonation.Api\ImageDonation.Api.csproj` [바꿈] — + SkiaSharp 4.154.0, SkiaSharp.NativeAssets.Linux.NoDependencies 4.154.0 (주석 포함) (레퍼런스 `server/ImageDonation.Api/ImageDonation.Api.csproj`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Program.cs` [바꿈] — + `AddSingleton<ImageProcessor>()` (레퍼런스 `server/ImageDonation.Api/Program.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\PublicEndpoints.cs` [바꿈] — 이미지 처리(`ImageProcessor.Process`) 후 저장, `InvalidImageException` → 400 (레퍼런스 `server/ImageDonation.Api/Endpoints/PublicEndpoints.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\ImageProcessor.cs` [새로] — 매직 넘버 → SKCodec 머리글 → 1억 픽셀 상한 → 축소 디코딩 크기 → 첫 장면 sRGB 디코딩(4096² 상한) → 긴 변 1280 → EXIF 방향 → WebP 80, `InvalidImageException`, `ProcessedImage` (레퍼런스 `server/ImageDonation.Api/Services/ImageProcessor.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\LocalImageStorage.cs` [바꿈] — 이름 형식을 `.webp`로, `SaveAsync(content, extension)`(레퍼런스 서명)으로 (레퍼런스 `server/ImageDonation.Api/Services/Storage/LocalImageStorage.cs`)
  - `C:\dev\sp-practice\api.http` [바꿈] — + `### 3`(fake.png → 400), `### 4`(animated.gif) — 정확한 모양은 9절 부록 F
  - `C:\dev\sp-practice\images\` [바꿈] — + `animated.gif`(움직이는 GIF 하나)
- 끝 상태 확인:
  - `photo.jpg` 업로드 → `media`에 `.webp` 파일(원본보다 작음). 탐색기에서 그 파일 → 속성 → 자세히에 카메라·GPS 항목이 없고, 브라우저로 열면 세로 사진이 똑바로 서 있다(브라우저로 여는 주소는 Day 12에 생기므로 오늘은 파일을 Edge로 끌어다 놓아 본다).
  - `fake.png` → 400과 오류 문장(ImageProcessor의 메시지 그대로). `animated.gif` → 정지된 WebP 한 장.
  - `Format-Hex C:\dev\sp-practice\images\photo.jpg | Select-Object -First 1` → `FF D8 FF …`.
  - `dotnet build` 경고 0.
- 과제:
  - 1) `fake.png`, `small.png`, `photo.jpg`의 첫 16바이트를 Format-Hex로 보고 형식을 맞혀 본다 → 정답 요지: `fake.png`는 글자 바이트(예: `EC 95 88…` 한글 UTF-8)라 PNG 시그니처가 아니다 → 매직 넘버 검사에서 걸린다
  - 2) 재인코딩이 왜 EXIF를 없애는지 한 문장으로 → 정답 요지: 원본 파일의 바이트를 복사하지 않고 픽셀만 새 파일로 쓰기 때문에, 원본에 붙어 있던 위치·기기 정보가 따라오지 않는다
- 용어(사전 담당): `매직 넘버`, `디코딩`, `재인코딩`, `EXIF`, `WebP`, `SkiaSharp`, `압축 폭탄`, `오픈소스 라이선스`
- 자주 막히는 곳 후보:
  - Windows에서 SkiaSharp 네이티브 로드 실패(`DllNotFoundException`/`TypeInitializationException` 계열) → `dotnet restore`·`bin`·`obj` 지우고 다시 빌드. **레퍼런스는 Windows 실행을 확인하지 못함**(패키지 구성만 확인) → Day 작성자·학습자 확인 필요라고 적는다
  - 아이폰 HEIC 사진 → 4형식이 아니라 400 → 아이폰 설정 → 카메라 → 포맷 → "높은 호환성", 또는 JPEG로 보내기
  - `using`을 빠뜨려도 당장은 동작하지만 메모리가 쌓임 → 코드 리뷰 체크리스트
  - CS0618 `DrawBitmap` obsolete 경고 → 샘플링 옵션이 있는 오버로드
  - 탐색기 속성 → 자세히 탭이 안 보임 → 파일 오른쪽 클릭 → 속성
- 레퍼런스 대응:
  - `C:\dev\image-donation\server\ImageDonation.Api\ImageDonation.Api.csproj`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/ImageDonation.Api.csproj`)와 다름: 다시 바뀜 → [Day 13](#/day/sp-d13)
  - `C:\dev\image-donation\server\ImageDonation.Api\Program.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Program.cs`)와 다름: 다시 바뀜 → [Day 12](#/day/sp-d12)
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\PublicEndpoints.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Endpoints/PublicEndpoints.cs`)와 다름: 다시 바뀜 → [Day 12](#/day/sp-d12)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\ImageProcessor.cs`: `reference/sp-image-donation/server/ImageDonation.Api/Services/ImageProcessor.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\LocalImageStorage.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Services/Storage/LocalImageStorage.cs`)와 다름: 다시 바뀜 → [Day 12](#/day/sp-d12)
  - `C:\dev\sp-practice\api.http`: 레퍼런스에 없음(프로젝트 밖 연습 파일(P2 Day 16의 REST Client로 실행). 레퍼런스에는 없고 최종 프로젝트 폴더에도 들어가지 않음)
  - `C:\dev\sp-practice\images\`: 레퍼런스에 없음(학습자가 준비하는 연습 이미지 폴더)

## Day 12 — 이미지 제공과 정리 (100분)
- 목표:
  - `GET /media/{file}`: 먼저 이름 형식(GUID 32자리 + `.webp`) 확인 → 아니면 DB도 부르지 않고 404, 파일 없으면 404, `Cache-Control: private, max-age=3600`, `Results.Stream(stream, "image/webp")`. 왜 `wwwroot` 정적 파일이 아니라 엔드포인트인가: 나중에(Day 31) 후원 상태를 확인해 거절·신고된 이미지는 주지 않으려고.
  - `LocalImageStorage`에 `OpenRead`, `Exists`, `DeleteAsync`(없는 파일도 오류 없음), `DeleteOlderThanAsync`.
  - `Services\RetentionService.cs` 첫 버전: `BackgroundService` + `PeriodicTimer(interval, time)`(`Retention:IntervalSeconds`, 기본 60), 매 간격 `RunOnceAsync`: ① 7일(`KeepFor`) 지난 후원의 이미지·행 삭제 ② DB에 없는 7일 지난 파일 삭제, 결과를 `RetentionResult`로 기록(`정리 완료: …`), 실패는 기록하고 다음 간격에 다시. 30분 만료(Day 27)와 이벤트 기록 삭제(Day 26)는 나중에.
  - 싱글턴인 BackgroundService 안에서 Scoped인 DbContext를 쓰려면 `IServiceScopeFactory`로 scope를 만든다. 시간은 `TimeProvider`(`TryAddSingleton(TimeProvider.System)`)로 받아 테스트(Day 34)에서 바꿀 수 있게 한다.
  - `AddSingleton<RetentionService>()` + `AddHostedService(sp => sp.GetRequiredService<RetentionService>())`(테스트가 같은 인스턴스의 `RunOnceAsync`를 부를 수 있게).
- 이미 배운 것:
  - [Day 10](#/day/sp-d10)~[Day 11](#/day/sp-d11)
  - async·Task·예외([P2 Day 15](#/day/p2-d15)), ILogger·appsettings([P2 Day 24](#/day/p2-d24)), DI 수명 Singleton/Scoped([P2 Day 23](#/day/p2-d23)), LINQ([P2 Day 14](#/day/p2-d14))
- 시작 상태:
  - [Day 11](#/day/sp-d11) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 11](#/day/sp-d11)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`, `.env.example`, `.env`, `docker-compose.yml`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`, `sample-donations.json`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`, `api.ts`, `donationList.ts`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`, `DonationForm.tsx`, `StreamerLayout.tsx`
  - `C:\dev\image-donation\client\src\hooks\`: `useImagePreview.ts`
  - `C:\dev\image-donation\client\src\pages\`: `DonatePage.tsx`, `DashboardPage.tsx`
  - `C:\dev\image-donation\server\`: `ImageDonation.slnx`
  - `C:\dev\image-donation\server\ImageDonation.Api\`: `ImageDonation.Api.csproj`, `appsettings.json`, `appsettings.Development.json`, `Program.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\`: `AppDbContext.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\`: `DonationDtos.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\`: `PublicEndpoints.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\`: `Streamer.cs`, `StreamerSettings.cs`, `Donation.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\`: `<시각>_InitialCreate.cs (+ .Designer.cs)`, `AppDbContextModelSnapshot.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Properties\`: `launchSettings.json`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\`: `ImageProcessor.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\`: `LocalImageStorage.cs`
  - `C:\dev\sp-practice\`: `api.http`
  - `C:\dev\sp-practice\images\`: `(폴더)`
  - PostgreSQL 실행 중, Day 11까지 업로드한 `.webp` 후원이 1건 이상 있다.
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\server\ImageDonation.Api\appsettings.json` [바꿈] — + `"Retention": { "IntervalSeconds": 60 }` (레퍼런스 `server/ImageDonation.Api/appsettings.json`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Program.cs` [바꿈] — + `TryAddSingleton(TimeProvider.System)`, `AddSingleton<RetentionService>()` + `AddHostedService(...)` (레퍼런스 `server/ImageDonation.Api/Program.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\PublicEndpoints.cs` [바꿈] — + `GET /media/{file}`(이름 형식 검사, 없으면 404, `Cache-Control: private, max-age=3600`, `image/webp`) (레퍼런스 `server/ImageDonation.Api/Endpoints/PublicEndpoints.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\LocalImageStorage.cs` [바꿈] — + `OpenRead`, `Exists`, `DeleteAsync`, `DeleteOlderThanAsync` (레퍼런스 `server/ImageDonation.Api/Services/Storage/LocalImageStorage.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\RetentionService.cs` [새로] — `BackgroundService` + `PeriodicTimer(interval, time)`, `RunOnceAsync`: 7일 지난 후원 행·이미지 삭제, DB에 없는 오래된 파일 삭제, `KeepFor`, `RetentionResult(DeletedDonations, DeletedFiles)`, 예외는 기록하고 다음 간격 (레퍼런스 `server/ImageDonation.Api/Services/RetentionService.cs`)
- 끝 상태 확인:
  - 브라우저 `http://localhost:5080/media/<psql로 본 ImageFile>` → 이미지가 보인다. 개발자 도구 Network → 응답 헤더 `Cache-Control: private, max-age=3600`, `Content-Type: image/webp`.
  - `/media/../appsettings.json`이나 `/media/abc.webp` → 404.
  - psql `UPDATE "Donations" SET "CreatedAt" = now() - interval '8 days' WHERE "Id" = <Id>;` → 1분 안에 서버 로그 `정리 완료: RetentionResult { … }`, 그 행과 `media`의 파일이 사라진다.
- 과제:
  - 1) 정리 간격을 10초로 바꿔 빨리 확인한다(개발 중에만) → 정답 요지: `dotnet user-secrets set "Retention:IntervalSeconds" "10"` 또는 `appsettings.Development.json`. 확인 후 `remove`로 되돌린다(레퍼런스 기본 60초)
  - 2) RetentionService 생성자에서 AppDbContext를 바로 받으면 어떤 오류가 나는지와 그 이유 → 정답 요지: `Cannot consume scoped service '…AppDbContext' from singleton …` 계열(원문은 작성자 캡처). 싱글턴은 앱 끝까지 살고 DbContext는 요청 하나 동안만 살아야 해서, 매번 scope를 만들어 쓰고 버린다
- 용어(사전 담당): `BackgroundService`, `보관 기간`, `Cache-Control`
- 자주 막히는 곳 후보:
  - 지운 이미지가 브라우저에 계속 보임 → 캐시(`max-age=3600`). `Ctrl + F5` 또는 개발자 도구 "Disable cache"
  - 파일 삭제 `IOException: The process cannot access the file because it is being used by another process.` → 탐색기 미리보기 창·사진 앱이 파일을 잡고 있음. 정리 작업은 다음 간격에 다시 시도
  - psql의 `now()`는 UTC 기준 시각을 가진 timestamptz → 화면의 한국 시간과 헷갈리지 않기([P2 Day 29](#/day/p2-d29))
  - 서버를 끄면 정리도 멈춤 → 정상(앱 안의 작업)
- 레퍼런스 대응:
  - `C:\dev\image-donation\server\ImageDonation.Api\appsettings.json`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/appsettings.json`)와 다름: 다시 바뀜 → [Day 13](#/day/sp-d13)
  - `C:\dev\image-donation\server\ImageDonation.Api\Program.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Program.cs`)와 다름: 다시 바뀜 → [Day 13](#/day/sp-d13)
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\PublicEndpoints.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Endpoints/PublicEndpoints.cs`)와 다름: 다시 바뀜 → [Day 14](#/day/sp-d14)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\LocalImageStorage.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Services/Storage/LocalImageStorage.cs`)와 다름: 다시 바뀜 → [Day 36](#/day/sp-d36)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\RetentionService.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Services/RetentionService.cs`)와 다름: 다시 바뀜 → [Day 26](#/day/sp-d26)

## Day 13 — 인증 설계 (120분)
- 목표:
  - 로그인 설계: 지금은 **개발용 로컬 로그인**(Identity, 이메일·비밀번호), 나중에(Day 23) 치지직 로그인이 **같은 Identity 쿠키**로 로그인시킨다. 인터넷에 공개할 때는 `Auth:LocalLoginEnabled=false`로 끄는 것을 권장(Day 38).
  - `dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore --version 10.0.14`. `AppDbContext : IdentityDbContext<IdentityUser>`, `base.OnModelCreating(builder)`를 맨 먼저, `Streamer.UserId` 고유 인덱스(계정 1개 = 스트리머 1명), `FindStreamerAsync(ClaimsPrincipal)`(레퍼런스 최종).
  - `Streamer`에 `UserId`와 `NewOverlayToken()`: `RandomNumberGenerator.GetBytes(32)` → `Base64Url.EncodeToString` 43자. 오버레이는 이 토큰만으로 접속하므로 비밀번호처럼 다룬다(Day 16).
  - `Endpoints\AuthEndpoints.cs`: `/api/auth` 그룹에 `MapIdentityApi<IdentityUser>()`(LocalLoginEnabled일 때만), `POST /logout`(`SignInManager.SignOutAsync` — 오늘 처음, MapIdentityApi가 안에서 쓰는 로그인 도우미를 직접 부르는 것), `GET /me`(비로그인 204 — [P2 Day 26](#/day/p2-d26)와 같은 이유), `POST /onboarding`(이미 있으면 409 "이미 후원 페이지가 있어요.", 주소 중복 409, 동시에 같은 주소를 골랐을 때 UNIQUE 인덱스가 막은 `DbUpdateException`도 409, 성공 201 + StreamerInfo). `Dtos\AuthDtos.cs`: `OnboardingRequest`(`[RegularExpression("^[a-z0-9-]{3,30}$")]`, DisplayName 1~40), `MeResponse(UserName, StreamerInfo?)`(치지직 정보는 Day 23).
  - `Program.cs`: `AddAuthorization()`, `AddIdentityApiEndpoints<IdentityUser>().AddEntityFrameworkStores<AppDbContext>()`, `AddValidation()`(public record만 검사하는 함정, [P2 Day 23](#/day/p2-d23)), `UseAuthentication()`·`UseAuthorization()`, `MapAuthEndpoints(config.GetValue("Auth:LocalLoginEnabled", true))`.
  - 순서 주의: **먼저** psql로 연습 스트리머를 지운다(`DELETE FROM "Streamers" WHERE "Slug" = 'test-stream';` — 설정·후원도 함께 지워짐), 그다음 `dotnet ef migrations add AddIdentity`. `api.http`에 가입·로그인(`?useCookies=true`)·me·온보딩(`{"slug":"my-stream","displayName":"내 방송"}`)·로그아웃 요청을 추가한다.
- 이미 배운 것:
  - [Day 9](#/day/sp-d09) 모델, [Day 10](#/day/sp-d10) api.http
  - 인증/인가·비밀번호 해싱·쿠키·Identity API 엔드포인트([P2 Day 25](#/day/p2-d25)), RequireAuthorization·/api/me 204([P2 Day 26](#/day/p2-d26)), DTO 검증 `AddValidation`·public record([P2 Day 23](#/day/p2-d23)), TypedResults·ProblemDetails([P2 Day 18](#/day/p2-d18), [P2 Day 24](#/day/p2-d24)), UNIQUE 제약과 동시 요청([Day 9](#/day/sp-d09) 인덱스)
- 시작 상태:
  - [Day 12](#/day/sp-d12) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 12](#/day/sp-d12)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`, `.env.example`, `.env`, `docker-compose.yml`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`, `sample-donations.json`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`, `api.ts`, `donationList.ts`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`, `DonationForm.tsx`, `StreamerLayout.tsx`
  - `C:\dev\image-donation\client\src\hooks\`: `useImagePreview.ts`
  - `C:\dev\image-donation\client\src\pages\`: `DonatePage.tsx`, `DashboardPage.tsx`
  - `C:\dev\image-donation\server\`: `ImageDonation.slnx`
  - `C:\dev\image-donation\server\ImageDonation.Api\`: `ImageDonation.Api.csproj`, `appsettings.json`, `appsettings.Development.json`, `Program.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\`: `AppDbContext.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\`: `DonationDtos.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\`: `PublicEndpoints.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\`: `Streamer.cs`, `StreamerSettings.cs`, `Donation.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\`: `<시각>_InitialCreate.cs (+ .Designer.cs)`, `AppDbContextModelSnapshot.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Properties\`: `launchSettings.json`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\`: `ImageProcessor.cs`, `RetentionService.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\`: `LocalImageStorage.cs`
  - `C:\dev\sp-practice\`: `api.http`
  - `C:\dev\sp-practice\images\`: `(폴더)`
  - PostgreSQL 실행 중, Day 9의 연습 스트리머 `test-stream`이 있다(오늘 지운다).
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\server\ImageDonation.Api\ImageDonation.Api.csproj` [바꿈] — + Microsoft.AspNetCore.Identity.EntityFrameworkCore 10.0.14 (레퍼런스 `server/ImageDonation.Api/ImageDonation.Api.csproj`)
  - `C:\dev\image-donation\server\ImageDonation.Api\appsettings.json` [바꿈] — + `"Auth": { "LocalLoginEnabled": true }` (레퍼런스 `server/ImageDonation.Api/appsettings.json`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Program.cs` [바꿈] — + `AddAuthorization`, `AddIdentityApiEndpoints<IdentityUser>().AddEntityFrameworkStores<AppDbContext>()`, `AddValidation()`, `UseAuthentication`/`UseAuthorization`, `MapAuthEndpoints(Auth:LocalLoginEnabled)` (레퍼런스 `server/ImageDonation.Api/Program.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\AppDbContext.cs` [바꿈] — `IdentityDbContext<IdentityUser>`로 바꿈, `base.OnModelCreating` 먼저, UserId 고유 인덱스, `FindStreamerAsync(ClaimsPrincipal)` (레퍼런스 `server/ImageDonation.Api/Data/AppDbContext.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\Streamer.cs` [바꿈] — + `UserId`, `NewOverlayToken()`(32바이트 암호학적 난수 → Base64Url) (레퍼런스와 같아짐) (레퍼런스 `server/ImageDonation.Api/Entities/Streamer.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\AuthDtos.cs` [새로] — `OnboardingRequest`(Slug 정규식 `^[a-z0-9-]{3,30}$`, DisplayName 1~40자), `MeResponse(UserName, StreamerInfo?)`, `StreamerInfo` (레퍼런스 `server/ImageDonation.Api/Dtos/AuthDtos.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\AuthEndpoints.cs` [새로] — `/api/auth` 그룹: `MapIdentityApi<IdentityUser>()`(LocalLoginEnabled일 때), `POST /logout`, `GET /me`(비로그인 204), `POST /onboarding`(409 두 가지, DbUpdateException 경합, 201) (레퍼런스 `server/ImageDonation.Api/Endpoints/AuthEndpoints.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\<시각>_AddIdentity.cs (+ .Designer.cs)` [새로] — `dotnet ef migrations add AddIdentity` (AspNet* 표, Streamers.UserId + 고유 인덱스)
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\AppDbContextModelSnapshot.cs` [바꿈] — dotnet-ef가 갱신 (레퍼런스 `server/ImageDonation.Api/Migrations/AppDbContextModelSnapshot.cs`)
  - `C:\dev\sp-practice\api.http` [바꿈] — + 가입·로그인(`?useCookies=true`)·me·온보딩·로그아웃 — 정확한 모양은 9절 부록 F
- 끝 상태 확인:
  - REST Client: `GET /api/auth/me` → `204 No Content`. `POST /api/auth/register` → 200. `POST /api/auth/login?useCookies=true` → 200 + `Set-Cookie: .AspNetCore.Identity.Application=…`. 다시 me → 200 `{"userName":"…","streamer":null}`.
  - `POST /api/auth/onboarding` → 201 `{"id":…,"slug":"my-stream","displayName":"내 방송"}`. 같은 요청 다시 → 409 "이미 후원 페이지가 있어요.". `"slug":"My Stream"` → 400.
  - psql `SELECT "Slug","UserId", length("OverlayToken") FROM "Streamers";` → my-stream 1행, 길이 43.
- 과제:
  - 1) 두 번째 계정을 가입시켜 같은 slug로 온보딩하면 몇 번이 오는지, 왜인지 → 정답 요지: 409 "이미 쓰고 있는 주소예요. 다른 주소를 골라 주세요.". Slug 고유 인덱스가 있고, 동시에 와도 DB가 하나만 받아 준다
  - 2) me가 비로그인일 때 401이 아니라 204인 이유 → 정답 요지: 로그인 안 함은 오류가 아니라 "내용 없음"이다. 401이면 화면이 로그인 여부를 물을 때마다 브라우저 콘솔에 빨간 오류가 찍힌다
- 용어(사전 담당): `온보딩`, `slug`, `암호학적 난수`, `Base64Url`
  - 앞 프로젝트(P1·P2)에서 배운 용어, 다시 짚을 때 `[[제목]]`으로 링크: `[[ASP.NET Core Identity]]`, `[[쿠키]]`, `[[인증]]`, `[[인가]]`, `[[검증]]`
- 자주 막히는 곳 후보:
  - 가입 400 `PasswordRequiresNonAlphanumeric`/`PasswordRequiresUpper`/`PasswordRequiresDigit`(영어 원문) → 6자 이상, 대·소문자·숫자·기호
  - `useCookies=true`를 빠뜨림 → 쿠키 대신 `accessToken` JSON이 온다 → 주소 확인
  - REST Client가 쿠키를 기억하지 않음 → 설정 `rest-client.rememberCookiesForSubsequentRequests`(기본 켜짐) 확인, 같은 `.http` 파일에서 요청
  - `AddValidation()`을 했는데 잘못된 slug가 통과 → 레코드가 `internal`(public 빠짐)
  - 연습 스트리머를 지우지 않고 마이그레이션 → 기존 행의 UserId가 모두 빈 값이라 행이 2개 이상이면 고유 인덱스 생성 실패 → 행을 지우고 다시 `database update`(또는 서버 재시작)
- 레퍼런스 대응:
  - `C:\dev\image-donation\server\ImageDonation.Api\ImageDonation.Api.csproj`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/ImageDonation.Api.csproj`)와 다름: 다시 바뀜 → [Day 25](#/day/sp-d25)
  - `C:\dev\image-donation\server\ImageDonation.Api\appsettings.json`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/appsettings.json`)와 다름: 다시 바뀜 → [Day 14](#/day/sp-d14)
  - `C:\dev\image-donation\server\ImageDonation.Api\Program.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Program.cs`)와 다름: 다시 바뀜 → [Day 14](#/day/sp-d14)
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\AppDbContext.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Data/AppDbContext.cs`)와 다름: 다시 바뀜 → [Day 23](#/day/sp-d23)
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\Streamer.cs`: `reference/sp-image-donation/server/ImageDonation.Api/Entities/Streamer.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\AuthDtos.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Dtos/AuthDtos.cs`)와 다름: 다시 바뀜 → [Day 23](#/day/sp-d23)
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\AuthEndpoints.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Endpoints/AuthEndpoints.cs`)와 다름: 다시 바뀜 → [Day 14](#/day/sp-d14)
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\<시각>_AddIdentity.cs (+ .Designer.cs)`: 레퍼런스와 이름 다름: 학습자 마이그레이션 이력(레퍼런스는 InitialCreate·SafetyReportsAndMinimalEvents 2개). 최종 스키마는 AppDbContextModelSnapshot.cs로 같음
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\AppDbContextModelSnapshot.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Migrations/AppDbContextModelSnapshot.cs`)와 다름: 다시 바뀜 → [Day 23](#/day/sp-d23)
  - `C:\dev\sp-practice\api.http`: 레퍼런스에 없음(프로젝트 밖 연습 파일(P2 Day 16의 REST Client로 실행). 레퍼런스에는 없고 최종 프로젝트 폴더에도 들어가지 않음)

## Day 14 — 후원 페이지 API (110분)
- 목표:
  - `GET /api/public/streamers/{slug}` → `PublicStreamerDto(Slug, DisplayName, Mode, MinCheese, MaxFileMb)`. 오버레이 토큰 같은 비밀 값은 절대 넣지 않는다.
  - 후원 생성의 서버 쪽 입력 검사(브라우저 검사는 우회할 수 있다): trim 후 닉네임 1~20자, 메시지 100자 이하(`MaxNicknameLength`, `MaxMessageLength`), 이미지 없음 400. `Problem(status, detail)` 도우미.
  - `Services\DonationService.cs` 첫 버전: 엔드포인트는 얇게, 규칙은 서비스에([P2 Day 23](#/day/p2-d23)). `CreateAsync(streamer, nickname, message, upload, senderIpHash)`(Process → Save → Pending 저장), `HashSenderIp`: IP 원문 대신 `HMACSHA256.HashData(키, IP)` → 16진수 64자. 키는 `Security:IpHashKey`(user-secrets, `$b = New-Object byte[] 32; [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b); [Convert]::ToBase64String($b)`로 만든 값 (Windows PowerShell 5.1에서도 되는 형식. Windows 실기 미확인 — 작성자가 실행해 확인)) + `Program.cs` 빠른 실패.
  - 요청 제한: `AddRateLimiter`에 정책 두 개 "donations"(IP당 1분 `RateLimit:DonationsPerMinute` 5건), "auth"(20건), `RejectionStatusCode = 429`, `PerIpPerMinute`(고정 창, IP를 모르면 "unknown"), `UseRateLimiter()`, 업로드에 `.RequireRateLimiting("donations")`, `MapIdentityApi`에 `.RequireRateLimiting("auth")`.
  - `AddScoped<DonationService>()`. `api.http`에 공개 정보·검증 실패·요청 제한 확인 요청을 추가.
- 이미 배운 것:
  - [Day 10](#/day/sp-d10)~[Day 13](#/day/sp-d13)
  - 서비스 계층·DI([P2 Day 23](#/day/p2-d23)), 해싱([P2 Day 25](#/day/p2-d25)), 요청 제한·429·IP마다 세기([P2 Day 34](#/day/p2-d34)), user-secrets([P2 Day 26](#/day/p2-d26))
- 시작 상태:
  - [Day 13](#/day/sp-d13) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 13](#/day/sp-d13)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`, `.env.example`, `.env`, `docker-compose.yml`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`, `sample-donations.json`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`, `api.ts`, `donationList.ts`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`, `DonationForm.tsx`, `StreamerLayout.tsx`
  - `C:\dev\image-donation\client\src\hooks\`: `useImagePreview.ts`
  - `C:\dev\image-donation\client\src\pages\`: `DonatePage.tsx`, `DashboardPage.tsx`
  - `C:\dev\image-donation\server\`: `ImageDonation.slnx`
  - `C:\dev\image-donation\server\ImageDonation.Api\`: `ImageDonation.Api.csproj`, `appsettings.json`, `appsettings.Development.json`, `Program.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\`: `AppDbContext.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\`: `DonationDtos.cs`, `AuthDtos.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\`: `PublicEndpoints.cs`, `AuthEndpoints.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\`: `Streamer.cs`, `StreamerSettings.cs`, `Donation.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\`: `<시각>_InitialCreate.cs (+ .Designer.cs)`, `<시각>_AddIdentity.cs (+ .Designer.cs)`, `AppDbContextModelSnapshot.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Properties\`: `launchSettings.json`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\`: `ImageProcessor.cs`, `RetentionService.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\`: `LocalImageStorage.cs`
  - `C:\dev\sp-practice\`: `api.http`
  - `C:\dev\sp-practice\images\`: `(폴더)`
  - PostgreSQL 실행 중, Day 13에서 만든 계정과 `my-stream` 스트리머가 있다.
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\server\ImageDonation.Api\appsettings.json` [바꿈] — + `"RateLimit": { "DonationsPerMinute": 5, "AuthPerMinute": 20 }` (레퍼런스 `server/ImageDonation.Api/appsettings.json`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Program.cs` [바꿈] — + `Security:IpHashKey` 빠른 실패, `AddScoped<DonationService>()`, `AddRateLimiter`("donations", "auth") + `PerIpPerMinute`, `UseRateLimiter()` (레퍼런스 `server/ImageDonation.Api/Program.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\DonationDtos.cs` [바꿈] — + `PublicStreamerDto(Slug, DisplayName, Mode, MinCheese, MaxFileMb)` (레퍼런스 `server/ImageDonation.Api/Dtos/DonationDtos.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\PublicEndpoints.cs` [바꿈] — + `GET /` 스트리머 공개 정보, 상수(`MaxNicknameLength` 20, `MaxMessageLength` 100), 서버 쪽 입력 검사, `DonationService.CreateAsync` 호출, `.RequireRateLimiting("donations")`, `Problem()` 도우미 (레퍼런스 `server/ImageDonation.Api/Endpoints/PublicEndpoints.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\AuthEndpoints.cs` [바꿈] — `MapIdentityApi`에 `.RequireRateLimiting("auth")` (레퍼런스 `server/ImageDonation.Api/Endpoints/AuthEndpoints.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\DonationService.cs` [새로] — `HashSenderIp`(HMAC-SHA256, `Security:IpHashKey`), `CreateAsync`(Process → Save → Donation Pending 저장) (레퍼런스 `server/ImageDonation.Api/Services/DonationService.cs`)
  - `C:\dev\sp-practice\api.http` [바꿈] — + 공개 스트리머 정보, 요청 제한 확인 — 정확한 모양은 9절 부록 F
- 끝 상태 확인:
  - `GET /api/public/streamers/my-stream` → `{"slug":"my-stream","displayName":"내 방송","mode":"Free","minCheese":1000,"maxFileMb":5}`.
  - 닉네임 21자 → 400 "닉네임은 1~20자로 써 주세요.". 메시지 101자 → 400.
  - 1분 안에 업로드 6번 → 6번째가 `429 Too Many Requests`.
  - psql `SELECT "SenderIpHash" FROM "Donations" ORDER BY "Id" DESC LIMIT 1;` → 16진수 64자(IP 원문 아님).
  - `dotnet user-secrets remove "Security:IpHashKey"` 후 실행 → 시작하자마자 "Security:IpHashKey가 없어요…" → 다시 set.
- 과제:
  - 1) 같은 PC에서 두 번 보내면 SenderIpHash가 같은가? 키를 바꾸면? → 정답 요지: 같은 IP·같은 키면 같다(그래서 차단에 쓸 수 있다, Day 31). 키를 바꾸면 전부 달라진다 → 키를 바꾸면 기존 차단 목록이 무효가 된다
  - 2) DonatePage(Day 6)의 maxLength만 믿고 서버 검사를 빼면 안 되는 이유 → 정답 요지: REST Client처럼 브라우저를 거치지 않고 바로 보낼 수 있다. 서버가 마지막 문지기다
- 용어(사전 담당): `HMAC`, `공개 API`
  - 앞 프로젝트(P1·P2)에서 배운 용어, 다시 짚을 때 `[[제목]]`으로 링크: `[[요청 제한]]`, `[[해싱]]`, `[[서비스 계층]]`, `[[의존성 주입]]`
- 자주 막히는 곳 후보:
  - 429가 계속 나와 연습이 막힘 → 1분 기다리기, 또는 개발 중에만 `RateLimit:DonationsPerMinute`를 user-secrets로 늘렸다가 되돌리기
  - 로컬에서 IP가 `::1`(IPv6)로 보임 → 정상, 해시도 그 값으로 만들어진다
  - `[FromForm] string? nickname`을 빠뜨려 null → 400
  - IP 해시 키를 appsettings.json에 넣고 커밋 → 키를 새로 만들고 user-secrets로
- 레퍼런스 대응:
  - `C:\dev\image-donation\server\ImageDonation.Api\appsettings.json`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/appsettings.json`)와 다름: 다시 바뀜 → [Day 21](#/day/sp-d21)
  - `C:\dev\image-donation\server\ImageDonation.Api\Program.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Program.cs`)와 다름: 다시 바뀜 → [Day 15](#/day/sp-d15)
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\DonationDtos.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Dtos/DonationDtos.cs`)와 다름: 다시 바뀜 → [Day 15](#/day/sp-d15)
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\PublicEndpoints.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Endpoints/PublicEndpoints.cs`)와 다름: 다시 바뀜 → [Day 31](#/day/sp-d31)
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\AuthEndpoints.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Endpoints/AuthEndpoints.cs`)와 다름: 다시 바뀜 → [Day 23](#/day/sp-d23)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\DonationService.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Services/DonationService.cs`)와 다름: 다시 바뀜 → [Day 15](#/day/sp-d15)
  - `C:\dev\sp-practice\api.http`: 레퍼런스에 없음(프로젝트 밖 연습 파일(P2 Day 16의 REST Client로 실행). 레퍼런스에는 없고 최종 프로젝트 폴더에도 들어가지 않음)

## Day 15 — 실시간 통신 원리 (110분)
- 목표:
  - 비교: 폴링(주기적으로 묻기)·SSE(서버 → 브라우저 한 방향, [P2 Day 33](#/day/p2-d33))·WebSocket(양방향, 연결 유지). 오버레이는 "보여 줬다(MarkShown)"를 서버에 알려야 하고, 대시보드·오버레이·그룹·재연결이 필요해서 SignalR을 쓴다(WebSocket을 우선 쓰고 안 되면 다른 방식으로 바꿈). P3를 안 했다고 가정하고 WebSocket을 처음부터 설명한다.
  - 서버: `AddSignalR().AddJsonProtocol(o => o.PayloadSerializerOptions.Converters.Add(new JsonStringEnumConverter()))`, `Hubs\OverlayHub.cs` 첫 버전(타입 있는 허브 `Hub<IOverlayClient>`, `IOverlayClient { Task ShowDonation(OverlayDonationDto); Task Clear(); }`), `MapHub<OverlayHub>("/hubs/overlay")`. `OverlayDonationDto`(Id, ImageUrl, Nickname, Message, DisplaySeconds, MinIntervalSeconds).
  - `DonationService`가 `IHubContext<OverlayHub, IOverlayClient>`를 받아 새 후원을 **임시로 모든 오버레이에 바로** 보낸다(`Clients.All.ShowDonation`). 검수 없이 뜨는 것은 오늘만이고 Day 16(스트리머별 그룹)·Day 17(승인 후에만)에서 고친다고 분명히 적는다.
  - 클라이언트: `npm i @microsoft/signalr@10.0.11`. `vite.config.ts`에 `server.proxy`(`/api`, `/media` → `http://localhost:5080`, `/hubs` → `{ target, ws: true }`). `client\overlay.html`(최종), `src\overlay\main.tsx`(토큰 없이), `src\overlay\useOverlayHub.ts`(서명과 돌려주는 값은 9절 부록 C. HubConnectionBuilder → `on("ShowDonation")` → 큐 뒤에 추가 → `start()`, 정리 함수 `stop()`), `src\overlay\Overlay.tsx`(받은 것을 목록으로, 부록 C), `src\overlay\overlay.css`(배경 투명), `api.ts`의 `OverlayDonation` 타입.
- 이미 배운 것:
  - [Day 5](#/day/sp-d05) useEffect·정리 함수, [Day 14](#/day/sp-d14) DonationService
  - 폴링 → SSE([P2 Day 33](#/day/p2-d33)), Vite 프록시·CORS([P2 Day 27](#/day/p2-d27)), OBS 오버레이 투명 배경([P1 Day 27](#/day/p1-d27))
- 시작 상태:
  - [Day 14](#/day/sp-d14) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 14](#/day/sp-d14)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`, `.env.example`, `.env`, `docker-compose.yml`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`, `sample-donations.json`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`, `api.ts`, `donationList.ts`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`, `DonationForm.tsx`, `StreamerLayout.tsx`
  - `C:\dev\image-donation\client\src\hooks\`: `useImagePreview.ts`
  - `C:\dev\image-donation\client\src\pages\`: `DonatePage.tsx`, `DashboardPage.tsx`
  - `C:\dev\image-donation\server\`: `ImageDonation.slnx`
  - `C:\dev\image-donation\server\ImageDonation.Api\`: `ImageDonation.Api.csproj`, `appsettings.json`, `appsettings.Development.json`, `Program.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\`: `AppDbContext.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\`: `DonationDtos.cs`, `AuthDtos.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\`: `PublicEndpoints.cs`, `AuthEndpoints.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\`: `Streamer.cs`, `StreamerSettings.cs`, `Donation.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\`: `<시각>_InitialCreate.cs (+ .Designer.cs)`, `<시각>_AddIdentity.cs (+ .Designer.cs)`, `AppDbContextModelSnapshot.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Properties\`: `launchSettings.json`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\`: `ImageProcessor.cs`, `RetentionService.cs`, `DonationService.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\`: `LocalImageStorage.cs`
  - `C:\dev\sp-practice\`: `api.http`
  - `C:\dev\sp-practice\images\`: `(폴더)`
  - 터미널 두 개: ① `server\ImageDonation.Api`에서 `dotnet run` ② `client`에서 `npm run dev`. PostgreSQL 실행 중.
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\client\package.json` [바꿈] — + `@microsoft/signalr` ^10.0.11 (레퍼런스 `client/package.json`)
  - `C:\dev\image-donation\client\package-lock.json` [바꿈] — npm이 갱신 (레퍼런스 `client/package-lock.json`)
  - `C:\dev\image-donation\client\overlay.html` [새로] — `<div id="overlay-root">`, `/src/overlay/main.tsx`, 제목 "이미지 후원 오버레이" (레퍼런스 `client/overlay.html`)
  - `C:\dev\image-donation\client\vite.config.ts` [바꿈] — + `server.proxy`: `/api`, `/media` → `http://localhost:5080`, `/hubs` → `{ target, ws: true }` (레퍼런스 `client/vite.config.ts`)
  - `C:\dev\image-donation\client\src\api.ts` [바꿈] — + `OverlayDonation` 타입 (레퍼런스 `client/src/api.ts`)
  - `C:\dev\image-donation\client\src\overlay\main.tsx` [새로] — `overlay-root`에 `<Overlay />` (아직 토큰 없음), `./overlay.css` (레퍼런스 `client/src/overlay/main.tsx`)
  - `C:\dev\image-donation\client\src\overlay\Overlay.tsx` [새로] — 받은 후원을 목록(닉네임·메시지·이미지)으로 쌓아 보여 줌 + 연결 상태 글자 — 9절 부록 C (레퍼런스 `client/src/overlay/Overlay.tsx`)
  - `C:\dev\image-donation\client\src\overlay\useOverlayHub.ts` [새로] — `/hubs/overlay` 연결 + `ShowDonation` → 큐 뒤에 추가 + 상태 — 서명·돌려주는 값은 9절 부록 C (레퍼런스 `client/src/overlay/useOverlayHub.ts`)
  - `C:\dev\image-donation\client\src\overlay\overlay.css` [새로] — `body` 배경 투명, 글자 그림자 정도 (레퍼런스 `client/src/overlay/overlay.css`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Program.cs` [바꿈] — + `AddSignalR().AddJsonProtocol(...JsonStringEnumConverter)`, `MapHub<OverlayHub>("/hubs/overlay")` (레퍼런스 `server/ImageDonation.Api/Program.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\DonationDtos.cs` [바꿈] — + `OverlayDonationDto(Id, ImageUrl, Nickname, Message, DisplaySeconds, MinIntervalSeconds)` (레퍼런스 `server/ImageDonation.Api/Dtos/DonationDtos.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Hubs\OverlayHub.cs` [새로] — `IOverlayClient { ShowDonation, Clear }` + 빈 `OverlayHub : Hub<IOverlayClient>` (레퍼런스 `server/ImageDonation.Api/Hubs/OverlayHub.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\DonationService.cs` [바꿈] — + `IHubContext<OverlayHub, IOverlayClient>`, 만든 후원을 `Clients.All.ShowDonation`으로 바로 보냄(임시: 검수는 Day 17) (레퍼런스 `server/ImageDonation.Api/Services/DonationService.cs`)
- 끝 상태 확인:
  - `http://localhost:5173/overlay.html` → "연결됨" 상태 글자. 개발자 도구 Network(WS)에 `/hubs/overlay?id=…` `101 Switching Protocols`.
  - REST Client로 업로드 → 새로고침 없이 오버레이에 닉네임·메시지·이미지가 추가된다(이미지 주소 `/media/…`가 프록시로 보인다).
- 과제:
  - 1) 브라우저 창 두 개로 오버레이를 열고 업로드한다 → 정답 요지: 둘 다 받는다(`Clients.All`). 그래서 내일 스트리머마다 그룹을 나눠야 한다
  - 2) 서버를 끄면 오버레이 상태는? 다시 켜면? → 정답 요지: 연결이 끊겨 상태가 바뀌고, 지금 버전은 다시 붙지 않는다 → Day 18의 자동 재연결과 5초 재시도
- 용어(사전 담당): `SignalR`, `허브`, `SignalR 그룹`
  - P3 사전 항목에 `[[제목]]`으로 링크하되 **P3를 안 했다고 가정하고 이 Day가 처음부터 설명**(정의만 P3 담당): `[[WebSocket]]`, `[[프로토콜 업그레이드]]`
  - 앞 프로젝트(P1·P2)에서 배운 용어, 다시 짚을 때 `[[제목]]`으로 링크: `[[폴링]]`, `[[SSE]]`, `[[프록시]]`
- 자주 막히는 곳 후보:
  - 개발 모드 콘솔에 SignalR "stopped during negotiation" 오류가 한 번 → React StrictMode가 effect를 두 번 실행하기 때문, 빌드한 화면에서는 안 나옴(레퍼런스 README)
  - 프록시에 `ws: true`를 빠뜨림 → WebSocket 대신 다른 방식으로 떨어지거나 연결 실패
  - 이미지가 깨짐 → `/media` 프록시 빠짐
  - `AddJsonProtocol` 변환기를 빠뜨리면 enum이 숫자로 감(오버레이 DTO에는 enum이 없지만 Day 16의 DonationDto에는 있음)
  - 서버(5080)를 안 켜고 5173만 켬 → 프록시 오류(`http proxy error`)가 Vite 터미널에 보임
- 레퍼런스 대응:
  - `C:\dev\image-donation\client\package.json`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/package.json`)와 다름: 다시 바뀜 → [Day 34](#/day/sp-d34)
  - `C:\dev\image-donation\client\package-lock.json`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/package-lock.json`)와 다름: 다시 바뀜 → [Day 34](#/day/sp-d34)
  - `C:\dev\image-donation\client\overlay.html`: `reference/sp-image-donation/client/overlay.html` 최종(같음)
  - `C:\dev\image-donation\client\vite.config.ts`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/vite.config.ts`)와 다름: 다시 바뀜 → [Day 34](#/day/sp-d34)
  - `C:\dev\image-donation\client\src\api.ts`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/api.ts`)와 다름: 다시 바뀜 → [Day 19](#/day/sp-d19)
  - `C:\dev\image-donation\client\src\overlay\main.tsx`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/overlay/main.tsx`)와 다름: 다시 바뀜 → [Day 16](#/day/sp-d16)
  - `C:\dev\image-donation\client\src\overlay\Overlay.tsx`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/overlay/Overlay.tsx`)와 다름: 다시 바뀜 → [Day 18](#/day/sp-d18)
  - `C:\dev\image-donation\client\src\overlay\useOverlayHub.ts`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/overlay/useOverlayHub.ts`)와 다름: 다시 바뀜 → [Day 16](#/day/sp-d16)
  - `C:\dev\image-donation\client\src\overlay\overlay.css`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/overlay/overlay.css`)와 다름: 다시 바뀜 → [Day 18](#/day/sp-d18)
  - `C:\dev\image-donation\server\ImageDonation.Api\Program.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Program.cs`)와 다름: 다시 바뀜 → [Day 16](#/day/sp-d16)
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\DonationDtos.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Dtos/DonationDtos.cs`)와 다름: 다시 바뀜 → [Day 16](#/day/sp-d16)
  - `C:\dev\image-donation\server\ImageDonation.Api\Hubs\OverlayHub.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Hubs/OverlayHub.cs`)와 다름: 다시 바뀜 → [Day 16](#/day/sp-d16)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\DonationService.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Services/DonationService.cs`)와 다름: 다시 바뀜 → [Day 16](#/day/sp-d16)

## Day 16 — SignalR 허브 (110분)
- 목표:
  - 그룹 이름에 토큰을 넣는다(`overlay:{token}`) → 토큰을 재발급하면(Day 20) 옛 주소는 아무것도 못 받는다. `OverlayHub.FindStreamerAsync(db, token)`.
  - 허브에 닿기 전에 토큰 검사: `OverlayHub.CheckTokenAsync`(틀리면 401) + `Program.cs`의 `app.UseWhen(http => http.Request.Path.StartsWithSegments("/hubs/overlay"), branch => branch.Use(OverlayHub.CheckTokenAsync))`. `OnConnectedAsync`에서 한 번 더 확인(그 사이 토큰이 바뀐 경우 `Context.Abort()`), `Context.Items`에 StreamerId·Token, 그룹 가입.
  - `Hubs\DashboardHub.cs`(최종): `[Authorize]`, `IDashboardClient { DonationCreated, DonationUpdated }`, 그룹 `dashboard:{streamerId}`, 온보딩 전 계정은 Abort.
  - `DonationService`: 새 후원을 대시보드 그룹에 `DonationCreated(DonationDto)`, 오버레이는 **그 스트리머의 토큰 그룹에만**(아직 검수 없이 — Day 17). `Dtos\DonationDtos.cs`에 `DonationDto`(Id, Status, Nickname, Message, ImageUrl, Code, CheeseAmount, CreatedAt + `From`, `MediaUrl`, `ImageVisible`: 거절·만료·긴급 정지면 이미지 주소 null).
  - `Endpoints\DashboardEndpoints.cs` 첫 버전: `MapGroup("/api/dashboard").RequireAuthorization()`, `NeedsOnboarding()`(403), `GET /overlay-token` → `OverlayTokenResponse`(`Dtos\SettingsDto.cs`).
  - 보안 헤더 미들웨어(모든 응답): `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`(오버레이 주소의 토큰이 다른 사이트로 새지 않게).
  - 클라이언트(부록 C의 Day 16 줄): `useOverlayHub(token, setQueue)`가 `/hubs/overlay?token=${encodeURIComponent(token)}`로, `overlay\main.tsx`가 `?token=`을 읽고 없으면 안내(최종).
- 이미 배운 것:
  - [Day 13](#/day/sp-d13) 오버레이 토큰·쿠키 로그인·FindStreamerAsync, [Day 15](#/day/sp-d15)
  - 미들웨어 순서([P2 Day 17](#/day/p2-d17)·[P2 Day 24](#/day/p2-d24)), RequireAuthorization([P2 Day 26](#/day/p2-d26)), 보안 점검([P2 Day 34](#/day/p2-d34))
- 시작 상태:
  - [Day 15](#/day/sp-d15) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 15](#/day/sp-d15)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`, `.env.example`, `.env`, `docker-compose.yml`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `overlay.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`, `sample-donations.json`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`, `api.ts`, `donationList.ts`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`, `DonationForm.tsx`, `StreamerLayout.tsx`
  - `C:\dev\image-donation\client\src\hooks\`: `useImagePreview.ts`
  - `C:\dev\image-donation\client\src\overlay\`: `main.tsx`, `Overlay.tsx`, `useOverlayHub.ts`, `overlay.css`
  - `C:\dev\image-donation\client\src\pages\`: `DonatePage.tsx`, `DashboardPage.tsx`
  - `C:\dev\image-donation\server\`: `ImageDonation.slnx`
  - `C:\dev\image-donation\server\ImageDonation.Api\`: `ImageDonation.Api.csproj`, `appsettings.json`, `appsettings.Development.json`, `Program.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\`: `AppDbContext.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\`: `DonationDtos.cs`, `AuthDtos.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\`: `PublicEndpoints.cs`, `AuthEndpoints.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\`: `Streamer.cs`, `StreamerSettings.cs`, `Donation.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Hubs\`: `OverlayHub.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\`: `<시각>_InitialCreate.cs (+ .Designer.cs)`, `<시각>_AddIdentity.cs (+ .Designer.cs)`, `AppDbContextModelSnapshot.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Properties\`: `launchSettings.json`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\`: `ImageProcessor.cs`, `RetentionService.cs`, `DonationService.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\`: `LocalImageStorage.cs`
  - `C:\dev\sp-practice\`: `api.http`
  - `C:\dev\sp-practice\images\`: `(폴더)`
  - 터미널 두 개(dotnet run, npm run dev), PostgreSQL 실행 중, REST Client로 로그인한 상태(쿠키).
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\client\src\overlay\main.tsx` [바꿈] — `?token=` 읽기, 없으면 "오버레이 주소에 토큰이 없어요…" 안내 (레퍼런스와 같아짐) (레퍼런스 `client/src/overlay/main.tsx`)
  - `C:\dev\image-donation\client\src\overlay\useOverlayHub.ts` [바꿈] — `withUrl("/hubs/overlay?token=...")`(encodeURIComponent), 매개변수 `token` — 9절 부록 C (레퍼런스 `client/src/overlay/useOverlayHub.ts`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Program.cs` [바꿈] — + 보안 헤더 미들웨어, `UseWhen(/hubs/overlay, OverlayHub.CheckTokenAsync)`, `MapDashboardEndpoints()`, `MapHub<DashboardHub>("/hubs/dashboard")` (레퍼런스 `server/ImageDonation.Api/Program.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\DonationDtos.cs` [바꿈] — + `DonationDto(Id, Status, Nickname, Message, ImageUrl, Code, CheeseAmount, CreatedAt)` + `From`, `MediaUrl`, `ImageVisible` (레퍼런스 `server/ImageDonation.Api/Dtos/DonationDtos.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\SettingsDto.cs` [새로] — `OverlayTokenResponse(string OverlayToken)`만 (레퍼런스 `server/ImageDonation.Api/Dtos/SettingsDto.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\DashboardEndpoints.cs` [새로] — `MapGroup("/api/dashboard").RequireAuthorization()`, `NeedsOnboarding()`(403), `GET /overlay-token` (레퍼런스 `server/ImageDonation.Api/Endpoints/DashboardEndpoints.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Hubs\OverlayHub.cs` [바꿈] — + `GroupName(token)`, `FindStreamerAsync`, `CheckTokenAsync`(401), `OnConnectedAsync`(다시 확인·Context.Items·그룹 가입) (레퍼런스 `server/ImageDonation.Api/Hubs/OverlayHub.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Hubs\DashboardHub.cs` [새로] — `[Authorize]`, `IDashboardClient { DonationCreated, DonationUpdated }`, 그룹 `dashboard:{streamerId}`, 온보딩 전이면 Abort (레퍼런스 `server/ImageDonation.Api/Hubs/DashboardHub.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\DonationService.cs` [바꿈] — + `IHubContext<DashboardHub, …>`: `DonationCreated`, 오버레이는 그 스트리머 토큰 그룹에만 (레퍼런스 `server/ImageDonation.Api/Services/DonationService.cs`)
  - `C:\dev\sp-practice\api.http` [바꿈] — + `GET /api/dashboard/overlay-token` — 정확한 모양은 9절 부록 F
- 끝 상태 확인:
  - REST Client `GET /api/dashboard/overlay-token` → `{"overlayToken":"…43자"}`. 로그아웃 상태 → 401.
  - `http://localhost:5173/overlay.html?token=<토큰>` → 연결됨, 업로드하면 표시. 토큰 한 글자 바꿈 → 콘솔에 401과 연결 실패. `?token=` 없이 → "오버레이 주소에 토큰이 없어요…".
  - 두 번째 계정(`other-stream`)으로 온보딩해서 그 후원 페이지에 업로드 → 내 오버레이에는 안 나온다.
  - 아무 응답의 헤더에 `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`.
- 과제:
  - 1) 오버레이를 로그인 쿠키가 아니라 토큰으로 인증하는 이유 → 정답 요지: OBS 브라우저 소스는 로그인 화면을 거치기 어렵고 몇 시간씩 켜 둔다. 대신 주소에 든 토큰이 비밀번호 역할을 하므로 유출되면 재발급(Day 20)
  - 2) Referrer-Policy가 없으면 토큰이 어떻게 샐 수 있는지 → 정답 요지: 오버레이 페이지가 다른 사이트의 자원을 부를 때 `Referer` 헤더에 현재 주소(토큰 포함)가 실려 갈 수 있다
- 용어(사전 담당): `오버레이 토큰`, `보안 헤더`
  - 앞 프로젝트(P1·P2)에서 배운 용어, 다시 짚을 때 `[[제목]]`으로 링크: `[[미들웨어]]`, `[[오버레이]]`, `[[브라우저 소스]]`
- 자주 막히는 곳 후보:
  - `UseWhen`을 `MapHub` 뒤나 `app.Run()` 뒤에 둠 → 검사가 안 걸림. 미들웨어는 등록 순서대로
  - REST Client에서 두 계정 쿠키가 섞임 → 로그아웃 후 다른 계정으로 로그인
  - 토큰을 복사할 때 따옴표까지 붙임 → 401
  - 대시보드 허브는 아직 화면이 없어 확인 못 함 → Day 19
- 레퍼런스 대응:
  - `C:\dev\image-donation\client\src\overlay\main.tsx`: `reference/sp-image-donation/client/src/overlay/main.tsx` 최종(같음)
  - `C:\dev\image-donation\client\src\overlay\useOverlayHub.ts`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/overlay/useOverlayHub.ts`)와 다름: 다시 바뀜 → [Day 18](#/day/sp-d18)
  - `C:\dev\image-donation\server\ImageDonation.Api\Program.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Program.cs`)와 다름: 다시 바뀜 → [Day 21](#/day/sp-d21)
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\DonationDtos.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Dtos/DonationDtos.cs`)와 다름: 다시 바뀜 → [Day 26](#/day/sp-d26)
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\SettingsDto.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Dtos/SettingsDto.cs`)와 다름: 다시 바뀜 → [Day 20](#/day/sp-d20)
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\DashboardEndpoints.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Endpoints/DashboardEndpoints.cs`)와 다름: 다시 바뀜 → [Day 17](#/day/sp-d17)
  - `C:\dev\image-donation\server\ImageDonation.Api\Hubs\OverlayHub.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Hubs/OverlayHub.cs`)와 다름: 다시 바뀜 → [Day 17](#/day/sp-d17)
  - `C:\dev\image-donation\server\ImageDonation.Api\Hubs\DashboardHub.cs`: `reference/sp-image-donation/server/ImageDonation.Api/Hubs/DashboardHub.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\DonationService.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Services/DonationService.cs`)와 다름: 다시 바뀜 → [Day 17](#/day/sp-d17)
  - `C:\dev\sp-practice\api.http`: 레퍼런스에 없음(프로젝트 밖 연습 파일(P2 Day 16의 REST Client로 실행). 레퍼런스에는 없고 최종 프로젝트 폴더에도 들어가지 않음)

## Day 17 — 검수 API (110분)
- 목표:
  - `GET /api/dashboard/donations?status=`(최신 100건, 잘못된 status 400), `POST /donations/{id:int}/approve`·`/reject`. 공통 `ChangeAsync`: 온보딩 전 403, 남의 후원이면 404(존재 여부도 숨김), 지금 상태에서 불가면 409 "지금 상태에서는 바꿀 수 없어요.".
  - `TransitionAsync(streamerId, donationId, from, to)`: `ExecuteUpdateAsync`에 `WHERE Status = from`을 넣은 UPDATE 한 번 → 바뀐 행이 1이면 성공. "읽고 → 확인하고 → 저장"하면 두 요청이 동시에 승인할 수 있는 경쟁 상태를 설명한다.
  - 승인(Pending → Approved) → 그 스트리머 오버레이 그룹에 `ShowDonation` + 대시보드 `DonationUpdated`. 거절(Pending → Rejected) → 방송에 안 나갈 이미지는 즉시 삭제.
  - `CreateAsync`: 이제 새 후원은 Pending이고 오버레이로 바로 보내지 않는다(Day 15~16의 임시 동작을 없앰). `AutoApprove`가 켜져 있으면 처음부터 Approved로 만들고 그때만 보낸다(설정 화면은 Day 20).
  - 오버레이 → 서버 `MarkShown(id)`(Approved → Shown)와 `MarkShownAsync`. 오버레이가 늦게 연결되거나 새로고침하면 **최근 30분**(`OverlayBacklogWindow`) 안에 승인됐지만 아직 못 보여 준 후원을 승인 순서대로 그 연결에만(`Clients.Caller`) 다시 보낸다. 30분보다 오래된 것은 방송이 끝났을 수 있어 보내지 않는다(레퍼런스 README의 결정).
  - `ToOverlayDto`(표시 시간·간격을 설정에서), `SendToOverlayAsync`, `NotifyUpdatedAsync`. `api.http`에 목록·승인·거절.
- 이미 배운 것:
  - [Day 9](#/day/sp-d09) 상태 전이, [Day 16](#/day/sp-d16)
  - 비동기 쿼리([P2 Day 21](#/day/p2-d21)), 읽기 전용 조회 `AsNoTracking`([P2 Day 30](#/day/p2-d30)), 본인 것만 수정·404/403([P2 Day 30](#/day/p2-d30)), 라우트 매개변수 `{id:int}`([P2 Day 18](#/day/p2-d18)), LINQ([P2 Day 14](#/day/p2-d14))
- 시작 상태:
  - [Day 16](#/day/sp-d16) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 16](#/day/sp-d16)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`, `.env.example`, `.env`, `docker-compose.yml`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `overlay.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`, `sample-donations.json`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`, `api.ts`, `donationList.ts`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`, `DonationForm.tsx`, `StreamerLayout.tsx`
  - `C:\dev\image-donation\client\src\hooks\`: `useImagePreview.ts`
  - `C:\dev\image-donation\client\src\overlay\`: `main.tsx`, `Overlay.tsx`, `useOverlayHub.ts`, `overlay.css`
  - `C:\dev\image-donation\client\src\pages\`: `DonatePage.tsx`, `DashboardPage.tsx`
  - `C:\dev\image-donation\server\`: `ImageDonation.slnx`
  - `C:\dev\image-donation\server\ImageDonation.Api\`: `ImageDonation.Api.csproj`, `appsettings.json`, `appsettings.Development.json`, `Program.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\`: `AppDbContext.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\`: `DonationDtos.cs`, `AuthDtos.cs`, `SettingsDto.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\`: `PublicEndpoints.cs`, `AuthEndpoints.cs`, `DashboardEndpoints.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\`: `Streamer.cs`, `StreamerSettings.cs`, `Donation.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Hubs\`: `OverlayHub.cs`, `DashboardHub.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\`: `<시각>_InitialCreate.cs (+ .Designer.cs)`, `<시각>_AddIdentity.cs (+ .Designer.cs)`, `AppDbContextModelSnapshot.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Properties\`: `launchSettings.json`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\`: `ImageProcessor.cs`, `RetentionService.cs`, `DonationService.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\`: `LocalImageStorage.cs`
  - `C:\dev\sp-practice\`: `api.http`
  - `C:\dev\sp-practice\images\`: `(폴더)`
  - 터미널 두 개, 오버레이(`/overlay.html?token=…`)를 열어 둔다, REST Client 로그인 상태.
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\DashboardEndpoints.cs` [바꿈] — + `GET /donations?status=`(최신 100건), `POST /donations/{id:int}/approve`·`/reject`, `ChangeAsync`(남의 후원 404, 불가 409) (레퍼런스 `server/ImageDonation.Api/Endpoints/DashboardEndpoints.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Hubs\OverlayHub.cs` [바꿈] — + 연결 시 백로그를 `Clients.Caller`에, `MarkShown(id)` (레퍼런스 `server/ImageDonation.Api/Hubs/OverlayHub.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\DonationService.cs` [바꿈] — + `OverlayBacklogWindow`(30분), `ApproveAsync`, `RejectAsync`(이미지 삭제), `MarkShownAsync`, `GetOverlayBacklogAsync`, `TransitionAsync`(조건부 ExecuteUpdate), `SendToOverlayAsync`, `ToOverlayDto`, `NotifyUpdatedAsync`; CreateAsync는 AutoApprove일 때만 오버레이로 (레퍼런스 `server/ImageDonation.Api/Services/DonationService.cs`)
  - `C:\dev\sp-practice\api.http` [바꿈] — + 후원 목록·승인·거절 — 정확한 모양은 9절 부록 F
- 끝 상태 확인:
  - 업로드 → 오버레이에 **아무것도 안 뜬다**. `GET /api/dashboard/donations` → 그 후원이 `"status":"Pending"`.
  - `POST …/approve` → 200 + 오버레이에 표시. 같은 요청 다시 → 409.
  - `POST …/reject`(다른 후원) → 200, `media`에서 그 파일이 사라진다.
  - 승인한 뒤 오버레이를 새로고침 → 승인했던 후원이 다시 온다(아직 Shown이 아니므로). 다른 계정 후원 id로 approve → 404.
- 과제:
  - 1) `?status=Approved`, `?status=nope`의 결과 → 정답 요지: 승인된 것만 / 400 "status 값이 올바르지 않아요."
  - 2) 조건부 UPDATE가 없으면 어떤 사고가 날 수 있는지 시간 순서로 설명 → 정답 요지: 요청 A·B가 동시에 "Pending이네"를 읽음 → 둘 다 Approved로 저장 → 오버레이로 두 번 보냄. 조건부 UPDATE면 B는 0행 → 409
- 용어(사전 담당): `조건부 업데이트`, `ExecuteUpdate`, `경쟁 상태`
- 자주 막히는 곳 후보:
  - ExecuteUpdate 뒤에 이미 추적 중인 엔티티의 값은 바뀌지 않음 → 바뀐 행은 `AsNoTracking()`으로 다시 읽는다
  - 404와 409 헷갈림 → "남의 것/없음"은 404, "지금 상태라서 안 됨"은 409
  - 오버레이가 표시는 하지만 Shown이 안 됨 → 오늘의 간단한 오버레이는 MarkShown을 부르지 않는다(Day 18)
  - UpdatedAt 비교는 UTC(`TimeProvider.GetUtcNow()`)
- 레퍼런스 대응:
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\DashboardEndpoints.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Endpoints/DashboardEndpoints.cs`)와 다름: 다시 바뀜 → [Day 20](#/day/sp-d20)
  - `C:\dev\image-donation\server\ImageDonation.Api\Hubs\OverlayHub.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Hubs/OverlayHub.cs`)와 다름: 다시 바뀜 → [Day 20](#/day/sp-d20)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\DonationService.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Services/DonationService.cs`)와 다름: 다시 바뀜 → [Day 26](#/day/sp-d26)
  - `C:\dev\sp-practice\api.http`: 레퍼런스에 없음(프로젝트 밖 연습 파일(P2 Day 16의 REST Client로 실행). 레퍼런스에는 없고 최종 프로젝트 폴더에도 들어가지 않음)

## Day 18 — 오버레이 페이지 (110분)
- 목표:
  - `Overlay.tsx`(최종): 큐(`queue`)의 맨 앞만 보여 준다 → `displaySeconds` 뒤 `markShown(id)`·맨 앞 빼기 → `minIntervalSeconds` 쉬기(`restSeconds`) → 다음. 두 개의 useEffect와 각자의 정리 함수(`clearTimeout`) — 긴급 정지로 current가 사라지면 타이머도 취소.
  - 애니메이션: `figure key={current.id}`(새 이미지마다 다시 시작), CSS 사용자 정의 속성 `--show-seconds`로 표시 시간을 CSS에 넘김, `@keyframes pop-in`·`fade-out`(`overlay.css` 최종). 이미지를 못 불러오면(`onError`) 건너뛰기.
  - `useOverlayHub.ts`(최종): `Clear`(긴급 정지·토큰 재발급 때 서버가 보냄) → 큐 비우기, 같은 id가 두 번 오면 한 번만, `withAutomaticReconnect()`, 처음 연결 실패나 onclose 뒤에는 5초마다 다시 시도, 연결 객체는 `useRef`, `markShown`은 `useCallback`(effect가 쓸데없이 다시 실행되지 않게), 연결 실패 시 "오버레이 연결 실패: 주소(토큰)와 서버를 확인해 주세요.".
  - OBS 설정([P1 Day 27](#/day/p1-d27) 복습): 소스 목록 **+** → **브라우저** → URL에 `http://localhost:5173/overlay.html?token=…`(개발 중) → 너비 1920, 높이 1080. 배경이 투명해야 방송 화면 위에 이미지만 겹친다. OBS 실제 화면은 작성 환경에서 확인하지 못했다고 적는다.
- 이미 배운 것:
  - [Day 5](#/day/sp-d05) useEffect·정리 함수, [Day 15](#/day/sp-d15)~[Day 17](#/day/sp-d17)
  - transition·hover와 CSS 변수([P1 Day 14](#/day/p1-d14)), `setTimeout`([P2 Day 8](#/day/p2-d08)), `setInterval`·밀리초([P1 Day 26](#/day/p1-d26)), OBS 브라우저 소스·투명 배경·URL 파라미터([P1 Day 27](#/day/p1-d27))
- 시작 상태:
  - [Day 17](#/day/sp-d17) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 17](#/day/sp-d17)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`, `.env.example`, `.env`, `docker-compose.yml`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `overlay.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`, `sample-donations.json`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`, `api.ts`, `donationList.ts`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`, `DonationForm.tsx`, `StreamerLayout.tsx`
  - `C:\dev\image-donation\client\src\hooks\`: `useImagePreview.ts`
  - `C:\dev\image-donation\client\src\overlay\`: `main.tsx`, `Overlay.tsx`, `useOverlayHub.ts`, `overlay.css`
  - `C:\dev\image-donation\client\src\pages\`: `DonatePage.tsx`, `DashboardPage.tsx`
  - `C:\dev\image-donation\server\`: `ImageDonation.slnx`
  - `C:\dev\image-donation\server\ImageDonation.Api\`: `ImageDonation.Api.csproj`, `appsettings.json`, `appsettings.Development.json`, `Program.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\`: `AppDbContext.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\`: `DonationDtos.cs`, `AuthDtos.cs`, `SettingsDto.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\`: `PublicEndpoints.cs`, `AuthEndpoints.cs`, `DashboardEndpoints.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\`: `Streamer.cs`, `StreamerSettings.cs`, `Donation.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Hubs\`: `OverlayHub.cs`, `DashboardHub.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\`: `<시각>_InitialCreate.cs (+ .Designer.cs)`, `<시각>_AddIdentity.cs (+ .Designer.cs)`, `AppDbContextModelSnapshot.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Properties\`: `launchSettings.json`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\`: `ImageProcessor.cs`, `RetentionService.cs`, `DonationService.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\`: `LocalImageStorage.cs`
  - `C:\dev\sp-practice\`: `api.http`
  - `C:\dev\sp-practice\images\`: `(폴더)`
  - 터미널 두 개, OBS Studio 설치([P1 Day 27](#/day/p1-d27)), REST Client 로그인 상태.
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\client\src\overlay\Overlay.tsx` [바꿈] — 큐 맨 앞 1장만, `displaySeconds` 뒤 `markShown`·다음, `minIntervalSeconds` 쉬기, `--show-seconds`, 이미지 오류 시 건너뛰기, 연결 실패 안내 (레퍼런스와 같아짐) (레퍼런스 `client/src/overlay/Overlay.tsx`)
  - `C:\dev\image-donation\client\src\overlay\useOverlayHub.ts` [바꿈] — + `Clear`, 중복 id 무시, `withAutomaticReconnect`, 첫 연결 실패·onclose 시 5초마다 재시도, `useRef` 연결, `useCallback` markShown (레퍼런스와 같아짐) (레퍼런스 `client/src/overlay/useOverlayHub.ts`)
  - `C:\dev\image-donation\client\src\overlay\overlay.css` [바꿈] — `.overlay`, `.donation`(figure·figcaption), `@keyframes pop-in`·`fade-out`, `.overlay-error` (레퍼런스와 같아짐) (레퍼런스 `client/src/overlay/overlay.css`)
- 끝 상태 확인:
  - 후원 3건 승인 → 오버레이에 한 장씩 약 8초 표시, 약 2초 쉼, 다음 장. psql `SELECT "Id","Status" FROM "Donations" ORDER BY "Id" DESC LIMIT 3;` → `Shown`.
  - 서버(`dotnet run`)를 껐다 켬 → 상태가 "다시 연결 중"/"실패" → 몇 초 뒤 다시 연결.
  - OBS 미리보기: 장면 위에 투명 배경으로 이미지와 닉네임·메시지가 겹쳐 보인다(학습자 PC에서 확인).
- 과제:
  - 1) 이미지 아래에 표시 시간 동안 줄어드는 막대를 CSS로 만든다 → 정답 요지: `::after`에 `animation: shrink var(--show-seconds) linear forwards;`, `@keyframes shrink { from { width: 100% } to { width: 0 } }`처럼. 표시 시간은 이미 `--show-seconds`로 들어온다
  - 2) `markShown`을 useCallback 없이 매번 새로 만들면 생기는 일 → 정답 요지: `[current, markShown]` effect가 화면을 그릴 때마다 다시 실행되어 타이머가 계속 처음부터 시작될 수 있다
- 용어(사전 담당): `큐`, `useRef`, `useCallback`, `자동 재연결`
- 자주 막히는 곳 후보:
  - OBS에서 흰 배경 → `overlay.css`의 `body` 배경 투명 확인, 브라우저 소스 속성의 사용자 지정 CSS를 지우지 않았는지
  - OBS에서 아무것도 안 보임 → Vite 개발 서버(5173)·dotnet run이 켜져 있는지, 브라우저 소스 속성 "현재 페이지의 캐시를 새로 고침"
  - 이미지가 화면 밖으로 큼 → 너비·높이를 1920×1080으로
  - StrictMode 때문에 개발 모드에서 연결이 한 번 끊겼다 붙음 → 정상
  - 같은 오버레이를 브라우저와 OBS 두 곳에서 열면 둘 다 MarkShown을 부름 → 연습할 때는 한 곳만
- 레퍼런스 대응:
  - `C:\dev\image-donation\client\src\overlay\Overlay.tsx`: `reference/sp-image-donation/client/src/overlay/Overlay.tsx` 최종(같음)
  - `C:\dev\image-donation\client\src\overlay\useOverlayHub.ts`: `reference/sp-image-donation/client/src/overlay/useOverlayHub.ts` 최종(같음)
  - `C:\dev\image-donation\client\src\overlay\overlay.css`: `reference/sp-image-donation/client/src/overlay/overlay.css` 최종(같음)

## Day 19 — 검수 대시보드(React) (120분)
- 목표:
  - `pages\LoginPage.tsx`는 [P2 Day 31](#/day/p2-d31)의 로그인 화면과 같은 모양(폼·오류 문장·가입 후 바로 로그인)이라 오늘 끝 코드를 붙여 넣고 React로 바뀐 점(제어 입력, `useNavigate`, `busy` 상태)만 읽는다: 이메일·비밀번호, "로그인"과 "처음이에요 (가입하고 로그인)", 401이면 "이메일 또는 비밀번호가 맞지 않아요.", 비밀번호 규칙 안내(치지직 버튼은 Day 21).
  - `hooks\useMe.ts`(최종): `getMe()`(204 → null) + ignore 깃발 + `reload()`. `StreamerLayout`: 불러오는 중, 비로그인 → `<Navigate to="/login" replace />`, 스트리머가 없으면 "먼저 온보딩을 해 주세요(api.http의 온보딩 요청)" 안내(온보딩 화면은 Day 30), 사용자 이름·로그아웃, `<Outlet context={{ me, reload }} />`.
  - `hooks\useDashboardHub.ts`(최종): `/hubs/dashboard`(로그인 쿠키가 함께 감) → `DonationCreated`·`DonationUpdated`를 `upsertDonation`으로 목록에 반영, 연결 상태 4가지.
  - `DashboardPage`: `listDonations()` 결과를 그 사이 실시간으로 온 것과 합치기(`list.reduce(upsertDonation, current)`), `act()`(승인·거절 결과로 카드 바꾸기, 실패는 notice), 필터 탭(전체·검수 대기), 단축키 A 승인·R 거절(맨 위 검수 대기, 입력칸에서는 무시, 의존성 배열을 생략한 effect로 항상 최신 목록), 허브 상태 글자.
  - `DonationCard`: 이미지가 null이면 "이미지 삭제됨", `loading="lazy"`, alt. 닉네임·메시지는 `{}`로만 넣는다 → React가 글자로 출력, `dangerouslySetInnerHTML` 금지([P2 Day 34](#/day/p2-d34)의 XSS).
  - `api.ts`: `Me`, `sendJson`, `getMe`, `register`, `login`(`?useCookies=true`), `logout`, `listDonations`, `approveDonation`, `rejectDonation`, Donation에 `code`·`cheeseAmount`. `getSampleDonations`와 `public\sample-donations.json`을 지운다. App에 `/login`.
  - 오늘 처음(JS): `window.addEventListener('keydown', …)`와 `e.key`(누른 키 글자), 정리 함수의 `removeEventListener`, 배열 `reduce`(목록 여러 개를 하나로 합치기 — 여기서 한 번만 쓴다), `e.target instanceof HTMLInputElement`([P2 Day 27](#/day/p2-d27)의 instanceof 복습).
- 이미 배운 것:
  - [Day 4](#/day/sp-d04)~[Day 6](#/day/sp-d06), [Day 13](#/day/sp-d13) 로그인 API, [Day 16](#/day/sp-d16)~[Day 17](#/day/sp-d17)
  - 로그인·가입 화면([P2 Day 31](#/day/p2-d31)), XSS와 글자로 출력하기([P2 Day 34](#/day/p2-d34)), 쿠키는 같은 출처에서([P2 Day 27](#/day/p2-d27)), `addEventListener`([P1 Day 21](#/day/p1-d21), 오늘은 `window`에 `keydown`을 붙인다), `instanceof`([P2 Day 27](#/day/p2-d27)), `role="status"`·`role="alert"`([P1 Day 24](#/day/p1-d24), [P1 Day 28](#/day/p1-d28))
- 시작 상태:
  - [Day 18](#/day/sp-d18) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 18](#/day/sp-d18)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`, `.env.example`, `.env`, `docker-compose.yml`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `overlay.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`, `sample-donations.json`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`, `api.ts`, `donationList.ts`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`, `DonationForm.tsx`, `StreamerLayout.tsx`
  - `C:\dev\image-donation\client\src\hooks\`: `useImagePreview.ts`
  - `C:\dev\image-donation\client\src\overlay\`: `main.tsx`, `Overlay.tsx`, `useOverlayHub.ts`, `overlay.css`
  - `C:\dev\image-donation\client\src\pages\`: `DonatePage.tsx`, `DashboardPage.tsx`
  - `C:\dev\image-donation\server\`: `ImageDonation.slnx`
  - `C:\dev\image-donation\server\ImageDonation.Api\`: `ImageDonation.Api.csproj`, `appsettings.json`, `appsettings.Development.json`, `Program.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\`: `AppDbContext.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\`: `DonationDtos.cs`, `AuthDtos.cs`, `SettingsDto.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\`: `PublicEndpoints.cs`, `AuthEndpoints.cs`, `DashboardEndpoints.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\`: `Streamer.cs`, `StreamerSettings.cs`, `Donation.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Hubs\`: `OverlayHub.cs`, `DashboardHub.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\`: `<시각>_InitialCreate.cs (+ .Designer.cs)`, `<시각>_AddIdentity.cs (+ .Designer.cs)`, `AppDbContextModelSnapshot.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Properties\`: `launchSettings.json`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\`: `ImageProcessor.cs`, `RetentionService.cs`, `DonationService.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\`: `LocalImageStorage.cs`
  - `C:\dev\sp-practice\`: `api.http`
  - `C:\dev\sp-practice\images\`: `(폴더)`
  - 터미널 두 개, Day 13에서 만든 계정(이메일·비밀번호)과 `my-stream`.
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\client\public\sample-donations.json` [지움] — 실제 API로 바꾸며 지움
  - `C:\dev\image-donation\client\src\App.tsx` [바꿈] — + `/login` → LoginPage (레퍼런스 `client/src/App.tsx`)
  - `C:\dev\image-donation\client\src\index.css` [바꿈] — + `.toolbar`, `.hub`, `.hub-connected`, `.notice`, `.message`, `.meta`, `.status-Pending`·`.status-Shown` 배지 색, `button:disabled` (레퍼런스 `client/src/index.css`)
  - `C:\dev\image-donation\client\src\api.ts` [바꿈] — + `Me`(userName, streamer), `getMe`, `register`, `login`(`?useCookies=true`), `logout`, `sendJson`, `listDonations`, `approveDonation`, `rejectDonation`; `Donation`에 `code`·`cheeseAmount`; `getSampleDonations` 지움 (레퍼런스 `client/src/api.ts`)
  - `C:\dev\image-donation\client\src\components\DonationCard.tsx` [바꿈] — 이미지 없으면 "이미지 삭제됨", `loading="lazy"`, alt, `status-${status}` 클래스, 치즈 금액 줄 자리 (레퍼런스 `client/src/components/DonationCard.tsx`)
  - `C:\dev\image-donation\client\src\components\StreamerLayout.tsx` [바꿈] — useMe로 로그인 확인(불러오는 중 / 비로그인 → `<Navigate to="/login" replace />`), 스트리머 없으면 "먼저 온보딩을 해 주세요" 안내, 사용자 이름, 로그아웃, `StreamerContext` + `Outlet context` (레퍼런스 `client/src/components/StreamerLayout.tsx`)
  - `C:\dev\image-donation\client\src\hooks\useMe.ts` [새로] — `getMe` + ignore 깃발 + `reload()`(version 숫자) (레퍼런스 `client/src/hooks/useMe.ts`)
  - `C:\dev\image-donation\client\src\hooks\useDashboardHub.ts` [새로] — `/hubs/dashboard` 연결, `DonationCreated`·`DonationUpdated` → upsertDonation, 연결 상태, 자동 재연결, 정리 함수에서 stop (레퍼런스 `client/src/hooks/useDashboardHub.ts`)
  - `C:\dev\image-donation\client\src\pages\DashboardPage.tsx` [바꿈] — `listDonations` + `useDashboardHub`(목록과 실시간 합치기), `act()`, 필터 탭(전체·검수 대기), 단축키 A/R(입력 중 무시), 허브 상태 글자, notice (레퍼런스 `client/src/pages/DashboardPage.tsx`)
  - `C:\dev\image-donation\client\src\pages\LoginPage.tsx` [새로] — 이메일·비밀번호, "로그인" / "처음이에요 (가입하고 로그인)", 401 → "이메일 또는 비밀번호가 맞지 않아요.", 비밀번호 규칙 안내 (레퍼런스 `client/src/pages/LoginPage.tsx`)
- 끝 상태 확인:
  - `http://localhost:5173/dashboard` → 비로그인이면 `/login`으로. 로그인 → 대시보드에 "실시간 연결됨".
  - REST Client로 업로드 → 새로고침 없이 카드가 맨 위에 "검수 대기"로 나타난다(미리보기 이미지).
  - `A` → 승인됨 + 오버레이 표시. 다음 카드에서 `R` → 거절됨 + "이미지 삭제됨".
  - 메시지 `<b>굵게?</b>`로 보낸 후원 → 카드에 꺾쇠까지 글자 그대로 보인다.
  - 로그아웃 → `/login`.
- 과제:
  - 1) 필터에 "승인됨" 탭을 추가한다 → 정답 요지: `filters` 배열에 `{ value: 'Approved', label: '승인됨', empty: '승인된 후원이 없어요.' }`. 타입이 `Filter`라 오타는 tsc가 잡는다
  - 2) 단축키가 메시지 입력칸에서 동작하면 안 되는 이유와 막는 코드 → 정답 요지: 글자 a·r을 칠 때마다 승인·거절된다 → `e.target instanceof HTMLInputElement || … HTMLTextAreaElement`면 무시
- 용어(사전 담당): `보호된 라우트`
  - 앞 프로젝트(P1·P2)에서 배운 용어, 다시 짚을 때 `[[제목]]`으로 링크: `[[XSS]]`, `[[쿠키]]`, `[[출처]]`
- 자주 막히는 곳 후보:
  - `http://localhost:5080/dashboard`로 열어 화면이 없음 → 개발 중 화면은 5173(Vite), 5080은 API만(Day 37 전)
  - 로그인했는데 대시보드 허브가 401 → `localhost`와 `127.0.0.1`(또는 LAN IP)은 서로 다른 호스트라 쿠키가 따로 저장된다(포트는 쿠키를 나누지 않는다) → 로그인한 것과 같은 주소 `http://localhost:5173`으로 연다
  - Caps Lock이 켜져 `e.key`가 `A` → 단축키 안 됨(레퍼런스는 소문자만)
  - 가입 오류가 영어(`Passwords must have at least one uppercase…`) → Identity 기본 메시지, 그대로 보여 주고 안내 문장으로 보충
  - 개발 모드 negotiation 오류 1회 → Day 15와 같음
- 레퍼런스 대응:
  - `C:\dev\image-donation\client\public\sample-donations.json`: 레퍼런스에 없음(연습용 예시 데이터(API가 생기기 전))
  - `C:\dev\image-donation\client\src\App.tsx`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/App.tsx`)와 다름: 다시 바뀜 → [Day 20](#/day/sp-d20)
  - `C:\dev\image-donation\client\src\index.css`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/index.css`)와 다름: 다시 바뀜 → [Day 20](#/day/sp-d20)
  - `C:\dev\image-donation\client\src\api.ts`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/api.ts`)와 다름: 다시 바뀜 → [Day 20](#/day/sp-d20)
  - `C:\dev\image-donation\client\src\components\DonationCard.tsx`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/components/DonationCard.tsx`)와 다름: 다시 바뀜 → [Day 27](#/day/sp-d27)
  - `C:\dev\image-donation\client\src\components\StreamerLayout.tsx`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/components/StreamerLayout.tsx`)와 다름: 다시 바뀜 → [Day 20](#/day/sp-d20)
  - `C:\dev\image-donation\client\src\hooks\useMe.ts`: `reference/sp-image-donation/client/src/hooks/useMe.ts` 최종(같음)
  - `C:\dev\image-donation\client\src\hooks\useDashboardHub.ts`: `reference/sp-image-donation/client/src/hooks/useDashboardHub.ts` 최종(같음)
  - `C:\dev\image-donation\client\src\pages\DashboardPage.tsx`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/pages/DashboardPage.tsx`)와 다름: 다시 바뀜 → [Day 30](#/day/sp-d30)
  - `C:\dev\image-donation\client\src\pages\LoginPage.tsx`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/pages/LoginPage.tsx`)와 다름: 다시 바뀜 → [Day 21](#/day/sp-d21)

## Day 20 — 설정 화면 (110분)
- 목표:
  - `Dtos\SettingsDto.cs`(최종): `SettingsDto(Mode, [Range(0, 10_000_000)] MinCheese, AutoApprove, [Range(3, 30)] DisplaySeconds, [Range(0, 60)] MinIntervalSeconds, [Range(1, 10)] MaxFileMb, [Required, MaxLength(100)] BannedWords)` + `From`, `MaxBannedWordLength = 30`.
  - `GET`·`PUT /api/dashboard/settings`: 범위 검사는 `AddValidation()`이 먼저(400), 금지어는 `["a", null]`처럼 null이 섞이면 500 대신 400 "금지어 목록에 빈 값(null)이 있어요.", trim·빈 값 제거·중복 제거, 30자 넘으면 400. 금지어는 **오늘은 저장만** 하고 실제로 거르는 것은 Day 33이라고 화면 안내에 적는다.
  - `POST /api/dashboard/overlay-token/rotate`: 새 토큰 저장 → 옛 그룹에 `Clear()` → 옛 주소로 열린 오버레이는 아무것도 못 받고, 서버를 부르면(`MarkShown`) `OverlayHub`가 토큰을 다시 확인해 `Context.Abort()`(오늘 OverlayHub 최종).
  - `pages\SettingsPage.tsx`: 후원 방식 라디오(무료 / 치즈 후원 연동 — 치즈 동작은 Day 26~27), 최소 치즈(치즈 모드일 때만), 자동 승인 체크, 숫자 칸 3개, 금지어 textarea(한 줄에 하나), 저장 → notice, 후원 페이지 주소, 오버레이 주소(읽기 전용 칸, 비밀) + 복사(`navigator.clipboard.writeText`, 실패하면 직접 선택 안내) + 재발급. 레이아웃 값은 `useOutletContext<StreamerContext>()`. 치지직 연결 절은 Day 23.
  - `api.ts`: `DonationMode`, `Settings`, `getSettings`, `saveSettings`, `getOverlayToken`, `rotateOverlayToken`, `overlayUrl`(`window.location.origin` + `/overlay.html?token=`), `donatePageUrl`. StreamerLayout에 "설정" 링크, App에 `/settings`.
- 이미 배운 것:
  - [Day 13](#/day/sp-d13) AddValidation, [Day 16](#/day/sp-d16)~[Day 19](#/day/sp-d19)
  - DTO 검증·400 ProblemDetails `errors`([P2 Day 23](#/day/p2-d23)·[P2 Day 24](#/day/p2-d24)), 폼 화면([P2 Day 31](#/day/p2-d31))
- 시작 상태:
  - [Day 19](#/day/sp-d19) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 19](#/day/sp-d19)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`, `.env.example`, `.env`, `docker-compose.yml`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `overlay.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`, `api.ts`, `donationList.ts`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`, `DonationForm.tsx`, `StreamerLayout.tsx`
  - `C:\dev\image-donation\client\src\hooks\`: `useImagePreview.ts`, `useMe.ts`, `useDashboardHub.ts`
  - `C:\dev\image-donation\client\src\overlay\`: `main.tsx`, `Overlay.tsx`, `useOverlayHub.ts`, `overlay.css`
  - `C:\dev\image-donation\client\src\pages\`: `DonatePage.tsx`, `DashboardPage.tsx`, `LoginPage.tsx`
  - `C:\dev\image-donation\server\`: `ImageDonation.slnx`
  - `C:\dev\image-donation\server\ImageDonation.Api\`: `ImageDonation.Api.csproj`, `appsettings.json`, `appsettings.Development.json`, `Program.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\`: `AppDbContext.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\`: `DonationDtos.cs`, `AuthDtos.cs`, `SettingsDto.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\`: `PublicEndpoints.cs`, `AuthEndpoints.cs`, `DashboardEndpoints.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\`: `Streamer.cs`, `StreamerSettings.cs`, `Donation.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Hubs\`: `OverlayHub.cs`, `DashboardHub.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\`: `<시각>_InitialCreate.cs (+ .Designer.cs)`, `<시각>_AddIdentity.cs (+ .Designer.cs)`, `AppDbContextModelSnapshot.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Properties\`: `launchSettings.json`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\`: `ImageProcessor.cs`, `RetentionService.cs`, `DonationService.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\`: `LocalImageStorage.cs`
  - `C:\dev\sp-practice\`: `api.http`
  - `C:\dev\sp-practice\images\`: `(폴더)`
  - 터미널 두 개, 대시보드에 로그인한 브라우저, 오버레이 창(또는 OBS).
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\client\src\App.tsx` [바꿈] — + `/settings` → SettingsPage (StreamerLayout 안) (레퍼런스 `client/src/App.tsx`)
  - `C:\dev\image-donation\client\src\index.css` [바꿈] — + `fieldset`, `.stack` (레퍼런스 `client/src/index.css`)
  - `C:\dev\image-donation\client\src\api.ts` [바꿈] — + `DonationMode`, `Settings`, `getSettings`, `saveSettings`, `getOverlayToken`, `rotateOverlayToken`, `overlayUrl`, `donatePageUrl` (레퍼런스 `client/src/api.ts`)
  - `C:\dev\image-donation\client\src\components\StreamerLayout.tsx` [바꿈] — + NavLink "설정" (레퍼런스 `client/src/components/StreamerLayout.tsx`)
  - `C:\dev\image-donation\client\src\pages\SettingsPage.tsx` [새로] — 후원 방식 라디오, 최소 치즈, 자동 승인, 표시 시간·간격·최대 파일 크기, 금지어(한 줄에 하나), 저장, 후원 페이지 주소, 오버레이 주소 복사·재발급 (레퍼런스 `client/src/pages/SettingsPage.tsx`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\SettingsDto.cs` [바꿈] — + `SettingsDto`([Range] 검증, `MaxBannedWordLength = 30`, `From`) (레퍼런스와 같아짐) (레퍼런스 `server/ImageDonation.Api/Dtos/SettingsDto.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\DashboardEndpoints.cs` [바꿈] — + `GET`·`PUT /settings`(금지어 null 400, 정리, 30자), `POST /overlay-token/rotate`(옛 그룹에 Clear) (레퍼런스 `server/ImageDonation.Api/Endpoints/DashboardEndpoints.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Hubs\OverlayHub.cs` [바꿈] — `MarkShown`에서 토큰이 바뀌었으면 `Context.Abort()` (레퍼런스와 같아짐) (레퍼런스 `server/ImageDonation.Api/Hubs/OverlayHub.cs`)
- 끝 상태 확인:
  - `/settings`에서 표시 시간 5로 저장 → "저장했어요" 계열 notice, 다음 승인 후원이 오버레이에 약 5초.
  - 표시 시간 31 → 저장 실패 notice(서버 400의 errors 문장).
  - 자동 승인 켜고 업로드 → 검수 없이 바로 오버레이(확인 후 끈다).
  - 재발급 → 열려 있던 오버레이가 비워지고 새 후원을 받지 않는다. 새 주소로 다시 열면 받는다. 복사 버튼 → 클립보드에 새 주소.
- 과제:
  - 1) 금지어 칸에 `  바보 `, `바보`, 빈 줄을 넣고 저장하면 서버가 무엇을 저장하는지 → 정답 요지: `["바보"]` — 앞뒤 빈칸을 자르고(trim), 빈 값을 버리고, 중복을 없앤다
  - 2) 오버레이 주소를 재발급해야 하는 상황 두 가지 → 정답 요지: 방송 화면·스크린샷에 주소가 보였을 때, 같이 작업하던 사람이 더 이상 쓰면 안 될 때. 재발급 후 OBS의 URL도 새 주소로 바꿔야 한다
- 용어(사전 담당): `자동 승인`, `금지어`, `useOutletContext`, `Clipboard API`
- 자주 막히는 곳 후보:
  - 숫자 칸을 비우면 `Number('')` → 0 또는 NaN → 400
  - 휴대폰이나 LAN IP(`http://192.168…`)로 열면 Clipboard API가 막힘(보안 컨텍스트) → 칸을 눌러 전체 선택 후 `Ctrl + C`
  - 재발급 후 OBS에 옛 주소가 남아 "아무것도 안 뜸" → OBS 브라우저 소스 URL 갱신
  - 400 응답의 `errors` 객체를 문장으로 합치는 `messageFrom`(Day 5) 확인
- 레퍼런스 대응:
  - `C:\dev\image-donation\client\src\App.tsx`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/App.tsx`)와 다름: 다시 바뀜 → [Day 30](#/day/sp-d30)
  - `C:\dev\image-donation\client\src\index.css`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/index.css`)와 다름: 다시 바뀜 → [Day 21](#/day/sp-d21)
  - `C:\dev\image-donation\client\src\api.ts`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/api.ts`)와 다름: 다시 바뀜 → [Day 23](#/day/sp-d23)
  - `C:\dev\image-donation\client\src\components\StreamerLayout.tsx`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/components/StreamerLayout.tsx`)와 다름: 다시 바뀜 → [Day 30](#/day/sp-d30)
  - `C:\dev\image-donation\client\src\pages\SettingsPage.tsx`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/pages/SettingsPage.tsx`)와 다름: 다시 바뀜 → [Day 23](#/day/sp-d23)
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\SettingsDto.cs`: `reference/sp-image-donation/server/ImageDonation.Api/Dtos/SettingsDto.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\DashboardEndpoints.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Endpoints/DashboardEndpoints.cs`)와 다름: 다시 바뀜 → [Day 31](#/day/sp-d31)
  - `C:\dev\image-donation\server\ImageDonation.Api\Hubs\OverlayHub.cs`: `reference/sp-image-donation/server/ImageDonation.Api/Hubs/OverlayHub.cs` 최종(같음)

## Day 21 — OAuth 2.0 원리 (100분)
- 목표:
  - `:::info` 맨 앞: Day 21~28은 치지직 앱 승인이 없어도 끝까지 할 수 있다. 기본 경로는 **테스트 모드**(가짜 후원 이벤트, Day 26부터)와 로컬 확인이고, 실제 치지직 연동은 "선택 단계"로 따로 표시한다. 치지직 실서버 연동은 작성 환경에서 검증하지 못했다(계정·인증 정보 없음). 코드는 공식 문서 대조와 가짜 HTTP 처리기·로컬 에뮬레이터로만 확인했다고 본문에 적는다.
  - 왜 OAuth인가: 우리 서비스는 치지직 비밀번호를 절대 받지 않는다. 흐름(text 그림): 로그인 버튼 → `https://chzzk.naver.com/account-interlock?clientId&redirectUri&state` → 사용자가 치지직에서 동의 → `redirectUri?code=…&state=…` → 서버가 code + Client Secret으로 토큰 교환(Day 23) → `users/me`.
  - 토큰: 액세스 1일, 리프레시 30일·1회용(external-facts 10.3, `[검색요약]`이라 `:::warn`에 "작성 기준일 2026-11, 공식 문서는 바뀔 수 있음, `https://chzzk.gitbook.io/chzzk`에서 다시 확인"). state = 로그인 위조를 막는 1회용 무작위 값. 스코프는 치지직이 주소에 넣지 않고 개발자 센터에서 관리한다. 리디렉션 URI는 등록값과 글자까지 같아야 한다.
  - `Services\ChzzkApiClient.cs` 첫 버전: `ChzzkOptions`(ClientId, ClientSecret, RedirectUri, ApiBaseUrl `https://openapi.chzzk.naver.com`, AuthorizeUrl `https://chzzk.naver.com/account-interlock`, `IsConfigured`)와 `BuildLoginUrl(state)`(값마다 `Uri.EscapeDataString`). `Program.cs`: `Configure<ChzzkOptions>(config.GetSection("Chzzk"))`, `AddHttpClient<ChzzkApiClient>((sp, http) => http.BaseAddress = …ApiBaseUrl)`, `MapChzzkEndpoints()`. `appsettings.json`에 빈 `Chzzk` 절(Secret은 절대 여기 넣지 않음).
  - `Endpoints\ChzzkEndpoints.cs`: `GET /api/chzzk/login` — 설정이 없으면 `/login?error=chzzk-config`, 있으면 `RandomNumberGenerator` 32바이트 → Base64Url state를 쿠키 `chzzk_oauth_state`(HttpOnly, SameSite=Lax, Secure=HTTPS일 때, 10분, Path `/api/chzzk`)에 넣고 로그인 주소로 Redirect.
  - 개발 중 리디렉션 주소: 화면이 5173(Vite)에 있으므로 user-secrets `Chzzk:RedirectUri`를 `http://localhost:5173/api/chzzk/callback`(Vite 프록시를 거쳐 5080으로 감)으로 둔다. 그래야 콜백 뒤의 `/dashboard` 이동이 React 화면으로 간다. appsettings 기본값 5080은 Day 37 이후(빌드한 화면을 서버가 줄 때)·Docker(8080)용. 이 방식은 작성 환경에서 실서버로 확인하지 못했다.
  - `LoginPage`: `useSearchParams()`의 `error`가 `chzzk-config`면 "서버에 치지직 앱 설정(Client ID/Secret)이 없어요. 개발용 계정과 테스트 모드로 연습하세요.", `<a className="button" href="/api/chzzk/login">치지직으로 로그인</a>`(React Router `Link`가 아닌 `<a>`인 이유: 서버 주소로 가야 함), "치지직 앱 승인이 없으면 개발용 계정과 테스트 모드로 모든 흐름을 연습할 수 있어요.". index.css에 `.button`.
- 이미 배운 것:
  - [Day 13](#/day/sp-d13) Identity 쿠키, [Day 19](#/day/sp-d19) 로그인 화면, [Day 13](#/day/sp-d13) 암호학적 난수·Base64Url
  - 인증·인가·쿠키([P2 Day 25](#/day/p2-d25)), CSRF·SameSite·HttpOnly([P2 Day 34](#/day/p2-d34)), 설정 읽기·구성([P2 Day 24](#/day/p2-d24)), user-secrets([P2 Day 26](#/day/p2-d26))
  - `IOptions<T>`와 `AddHttpClient`는 오늘 처음: 설정 절을 클래스로 받는 법, HttpClient를 DI로 받는 법을 한 단락씩 설명
- 시작 상태:
  - [Day 20](#/day/sp-d20) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 20](#/day/sp-d20)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`, `.env.example`, `.env`, `docker-compose.yml`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `overlay.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`, `api.ts`, `donationList.ts`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`, `DonationForm.tsx`, `StreamerLayout.tsx`
  - `C:\dev\image-donation\client\src\hooks\`: `useImagePreview.ts`, `useMe.ts`, `useDashboardHub.ts`
  - `C:\dev\image-donation\client\src\overlay\`: `main.tsx`, `Overlay.tsx`, `useOverlayHub.ts`, `overlay.css`
  - `C:\dev\image-donation\client\src\pages\`: `DonatePage.tsx`, `DashboardPage.tsx`, `LoginPage.tsx`, `SettingsPage.tsx`
  - `C:\dev\image-donation\server\`: `ImageDonation.slnx`
  - `C:\dev\image-donation\server\ImageDonation.Api\`: `ImageDonation.Api.csproj`, `appsettings.json`, `appsettings.Development.json`, `Program.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\`: `AppDbContext.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\`: `DonationDtos.cs`, `AuthDtos.cs`, `SettingsDto.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\`: `PublicEndpoints.cs`, `AuthEndpoints.cs`, `DashboardEndpoints.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\`: `Streamer.cs`, `StreamerSettings.cs`, `Donation.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Hubs\`: `OverlayHub.cs`, `DashboardHub.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\`: `<시각>_InitialCreate.cs (+ .Designer.cs)`, `<시각>_AddIdentity.cs (+ .Designer.cs)`, `AppDbContextModelSnapshot.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Properties\`: `launchSettings.json`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\`: `ImageProcessor.cs`, `RetentionService.cs`, `DonationService.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\`: `LocalImageStorage.cs`
  - `C:\dev\sp-practice\`: `api.http`
  - `C:\dev\sp-practice\images\`: `(폴더)`
  - 터미널 두 개, 로그인하지 않은 브라우저 창(시크릿 창).
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\client\src\index.css` [바꿈] — + `.button`(버튼처럼 보이는 링크) (레퍼런스 `client/src/index.css`)
  - `C:\dev\image-donation\client\src\pages\LoginPage.tsx` [바꿈] — + `useSearchParams`의 `error`, `chzzk-config` 문장, `<a className="button" href="/api/chzzk/login">치지직으로 로그인</a>`, 테스트 모드 안내 (레퍼런스 `client/src/pages/LoginPage.tsx`)
  - `C:\dev\image-donation\server\ImageDonation.Api\appsettings.json` [바꿈] — + `"Chzzk": { "ClientId": "", "ClientSecret": "", "RedirectUri": "http://localhost:5080/api/chzzk/callback" }` (레퍼런스 `server/ImageDonation.Api/appsettings.json`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Program.cs` [바꿈] — + `Configure<ChzzkOptions>(GetSection("Chzzk"))`, `AddHttpClient<ChzzkApiClient>`(BaseAddress = ApiBaseUrl), `MapChzzkEndpoints()` (레퍼런스 `server/ImageDonation.Api/Program.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\ChzzkEndpoints.cs` [새로] — `/api/chzzk` 그룹, `GET /login`(설정 없으면 `/login?error=chzzk-config`, state 쿠키: HttpOnly·Lax·10분·Path `/api/chzzk`) (레퍼런스 `server/ImageDonation.Api/Endpoints/ChzzkEndpoints.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\ChzzkApiClient.cs` [새로] — `ChzzkOptions`(ClientId, ClientSecret, RedirectUri, ApiBaseUrl, AuthorizeUrl, IsConfigured) + `ChzzkApiClient(HttpClient, IOptions<ChzzkOptions>)` + `BuildLoginUrl(state)` (레퍼런스 `server/ImageDonation.Api/Services/ChzzkApiClient.cs`)
- 끝 상태 확인:
  - **기본 경로(치지직 승인 없이):** `/login`의 "치지직으로 로그인" → 주소가 `/login?error=chzzk-config`가 되고 안내 문장이 보인다.
  - **기본 경로(치지직 승인 없이):** (동작 확인용) `dotnet user-secrets set "Chzzk:ClientId" "dummy"`, `… "Chzzk:ClientSecret" "dummy"` 후 서버 재시작 → 버튼을 누르면 주소창이 `https://chzzk.naver.com/account-interlock?clientId=dummy&redirectUri=…&state=…`로 바뀐다(치지직 화면의 결과는 무시). 그 직전 개발자 도구 → Application → Cookies에 `chzzk_oauth_state`(HttpOnly). 확인 후 dummy 두 값을 `remove`.
  - **선택 단계(승인된 치지직 앱이 있을 때만):** 없음(실제 로그인은 Day 23).
- 과제:
  - 1) state가 없으면 어떤 공격이 가능한지 순서대로 쓴다 → 정답 요지: 공격자가 자기 치지직 계정으로 받은 code가 든 콜백 주소를 피해자에게 열게 함 → 피해자 브라우저가 공격자 치지직 계정에 연결·로그인됨(로그인 CSRF). state 쿠키와 비교하면 내가 시작한 로그인이 아니라서 거절된다
  - 2) Client Secret을 React 코드에 넣으면 안 되는 이유 → 정답 요지: 빌드된 JS는 누구나 개발자 도구로 읽을 수 있다. Secret은 서버(user-secrets·환경 변수)에서만 쓰고 토큰 교환도 서버끼리 한다
- 용어(사전 담당): `OAuth 2.0`, `인가 코드`, `액세스 토큰`, `리프레시 토큰`, `state 값`, `OAuth 스코프`, `리디렉션 URI`
- 자주 막히는 곳 후보:
  - `/api/chzzk/login`을 `<Link>`로 만듦 → React 안에서만 주소가 바뀌고 서버에 안 감 → `<a href>`
  - 콜백 뒤 `http://localhost:5080/dashboard`에서 빈 화면/404 → 개발 중에는 리디렉션 주소를 5173으로(위 목표 참고)
  - user-secrets 이름에 콜론 빠뜨림(`ChzzkClientId`) → 설정이 안 읽혀 계속 chzzk-config
  - dummy 값을 지우지 않아 나중에 "왜 설정이 있다고 나오지?" → `dotnet user-secrets list`로 확인
  - 쿠키 Path가 `/api/chzzk`라서 다른 경로에서는 안 보임 → 정상
- 레퍼런스 대응:
  - `C:\dev\image-donation\client\src\index.css`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/index.css`)와 다름: 다시 바뀜 → [Day 29](#/day/sp-d29)
  - `C:\dev\image-donation\client\src\pages\LoginPage.tsx`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/pages/LoginPage.tsx`)와 다름: 다시 바뀜 → [Day 23](#/day/sp-d23)
  - `C:\dev\image-donation\server\ImageDonation.Api\appsettings.json`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/appsettings.json`)와 다름: 다시 바뀜 → [Day 28](#/day/sp-d28)
  - `C:\dev\image-donation\server\ImageDonation.Api\Program.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Program.cs`)와 다름: 다시 바뀜 → [Day 24](#/day/sp-d24)
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\ChzzkEndpoints.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Endpoints/ChzzkEndpoints.cs`)와 다름: 다시 바뀜 → [Day 23](#/day/sp-d23)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\ChzzkApiClient.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Services/ChzzkApiClient.cs`)와 다름: 다시 바뀜 → [Day 22](#/day/sp-d22)

## Day 22 — 치지직 개발자 센터 (105분)
- 목표:
  - **선택 단계(승인된 치지직 앱이 있을 때만):** (치지직 계정 필요) `https://developers.chzzk.naver.com`에서 애플리케이션 만들기. 앱 이름·ID에 "chzzk", "치지직", "naver", "네이버"를 넣을 수 없다. 로그인 리디렉션 URL: 개발 `http://localhost:5173/api/chzzk/callback`(`localhost` 허용 여부는 **미확인** → 입력칸 안내를 확인), Scope: **후원 조회**, **유저 정보 조회**(+ 선택 **채팅 메시지 쓰기**, Day 28). 심사 기간은 미확인, 90일 동안 API 사용량이 0이면 앱이 삭제된다, 개발자 센터 이용 약관은 학습자가 직접 읽는다(조항 미확인). 화면 메뉴 이름은 확인하지 못했으므로 "작성 기준일 2026-11, 화면이 다를 수 있어요"를 붙인다.
  - Client Secret 보관: `dotnet user-secrets set "Chzzk:ClientId" "…"`, `"Chzzk:ClientSecret"`, `"Chzzk:RedirectUri" "http://localhost:5173/api/chzzk/callback"`. 코드·커밋·스크린샷·방송 화면에 절대 노출하지 않고, 노출되면 개발자 센터에서 재발급. `dotnet user-secrets list`는 값을 그대로 보여 주므로 방송 중 실행 금지.
  - **기본 경로(치지직 승인 없이):** 승인을 기다리는 동안 할 일: `ChzzkApiClient`의 공통 부분. 치지직 응답 공통 형식(성공 `{"code":200,"message":null,"content":{…}}`, 실패 `{"code":401,"message":"INVALID_TOKEN"}` — `[교차]` 확인이라 공식 문서 대조 필요), `ChzzkApiException(StatusCode)`, `SendAsync`(실패·JSON 아님이면 예외, 성공이면 `content`), `TryParse`(`using var document` + `RootElement.Clone()`), `WithBearer`(`Bearer {토큰}`, 사이 공백 주의), `ReadInt`(`expiresIn`이 문자열이든 숫자든), `ChzzkTokenResponse`, `ChzzkUser`, `PostTokenAsync`, `ExchangeCodeAsync`(`grantType: authorization_code`, clientId, clientSecret, code, state), `GetMeAsync`(`GET /open/v1/users/me` → channelId, channelName — 실제 응답 필드는 미확인).
  - README에 "치지직 연동(선택)" 절: 앱 등록 체크리스트, user-secrets 이름 3개, 미확인 항목(localhost 허용, 심사 기간, Quota 수치, 실서버 응답 모양), "승인이 없어도 테스트 모드로 전체 흐름을 연습할 수 있어요".
  - **기본 경로(치지직 승인 없이):** 세션·채팅을 부르는 짧은 메서드도 오늘 같이 만든다(부르는 곳은 Day 25~28, 설계서 3.4와 다른 배치): `GetSessionUrlAsync`(`GET /open/v1/sessions/auth` → `content.url`, 1회용), `SubscribeDonationAsync`(`POST /open/v1/sessions/events/subscribe/donation?sessionKey=` — 구독 완료는 HTTP 응답이 아니라 소켓의 `SYSTEM subscribed`로 온다), `SendChatAsync`(`POST /open/v1/chats/send`, 본문 `{"message"}` 100자로 자르기, Scope 채팅 메시지 쓰기). 셋 다 오늘 만든 `WithBearer`·`SendAsync`를 다시 쓴다.
- 이미 배운 것:
  - [Day 21](#/day/sp-d21)
  - async·예외([P2 Day 8](#/day/p2-d08), [P2 Day 15](#/day/p2-d15)), HTTP 헤더·상태 코드·JSON 본문([P2 Day 16](#/day/p2-d16)), user-secrets([P2 Day 26](#/day/p2-d26)), `JsonElement`로 JSON 읽기는 오늘 처음(짧게 설명)
- 시작 상태:
  - [Day 21](#/day/sp-d21) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 21](#/day/sp-d21)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`, `.env.example`, `.env`, `docker-compose.yml`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `overlay.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`, `api.ts`, `donationList.ts`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`, `DonationForm.tsx`, `StreamerLayout.tsx`
  - `C:\dev\image-donation\client\src\hooks\`: `useImagePreview.ts`, `useMe.ts`, `useDashboardHub.ts`
  - `C:\dev\image-donation\client\src\overlay\`: `main.tsx`, `Overlay.tsx`, `useOverlayHub.ts`, `overlay.css`
  - `C:\dev\image-donation\client\src\pages\`: `DonatePage.tsx`, `DashboardPage.tsx`, `LoginPage.tsx`, `SettingsPage.tsx`
  - `C:\dev\image-donation\server\`: `ImageDonation.slnx`
  - `C:\dev\image-donation\server\ImageDonation.Api\`: `ImageDonation.Api.csproj`, `appsettings.json`, `appsettings.Development.json`, `Program.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\`: `AppDbContext.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\`: `DonationDtos.cs`, `AuthDtos.cs`, `SettingsDto.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\`: `PublicEndpoints.cs`, `AuthEndpoints.cs`, `DashboardEndpoints.cs`, `ChzzkEndpoints.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\`: `Streamer.cs`, `StreamerSettings.cs`, `Donation.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Hubs\`: `OverlayHub.cs`, `DashboardHub.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\`: `<시각>_InitialCreate.cs (+ .Designer.cs)`, `<시각>_AddIdentity.cs (+ .Designer.cs)`, `AppDbContextModelSnapshot.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Properties\`: `launchSettings.json`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\`: `ImageProcessor.cs`, `RetentionService.cs`, `DonationService.cs`, `ChzzkApiClient.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\`: `LocalImageStorage.cs`
  - `C:\dev\sp-practice\`: `api.http`
  - `C:\dev\sp-practice\images\`: `(폴더)`
  - (선택) 치지직(네이버) 계정. 없으면 기본 경로만.
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\README.md` [바꿈] — "치지직 연동(선택)" 절: 앱 등록 체크리스트, user-secrets 이름, 미확인 항목 (레퍼런스 `README.md`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\ChzzkApiClient.cs` [바꿈] — + `ChzzkApiException`, `ChzzkTokenResponse`, `ChzzkUser`, `ExchangeCodeAsync`, `GetMeAsync`, `PostTokenAsync`, `WithBearer`, `SendAsync`(공통 응답에서 content), `TryParse`(JsonDocument using + Clone), `ReadInt`(문자열·숫자), `GetSessionUrlAsync`, `SubscribeDonationAsync`, `SendChatAsync`(100자 자르기) (레퍼런스 `server/ImageDonation.Api/Services/ChzzkApiClient.cs`)
- 끝 상태 확인:
  - **기본 경로(치지직 승인 없이):** `dotnet build` 경고 0, 서버가 평소처럼 켜지고, README 미리보기에 "치지직 연동(선택)" 절과 체크리스트가 보인다.
  - **선택 단계(승인된 치지직 앱이 있을 때만):** 개발자 센터 앱 목록에 내 앱이 보이고, `dotnet user-secrets list`에 `Chzzk:ClientId`·`Chzzk:ClientSecret`·`Chzzk:RedirectUri` 세 이름이 있다(값은 남에게 보이지 않게). `/login`의 치지직 버튼을 누르면 치지직 동의 화면이 나온다(돌아온 뒤 처리는 Day 23).
- 과제:
  - 1) 공통 응답 JSON 두 개(성공·실패)를 손으로 보고 SendAsync가 각각 무엇을 돌려주거나 던지는지 쓴다 → 정답 요지: 성공 → `content` 객체, 실패(401) → `ChzzkApiException(401, "INVALID_TOKEN")`. JSON이 아닌 응답(프록시 오류 화면 등)도 예외
  - 2) 앱 등록 전에 확인할 체크리스트 5줄 → 정답 요지: 앱 이름 금지어, 리디렉션 URL(포트·http/https·끝 슬래시), 필요한 스코프만, Secret 보관 위치, 90일 사용 정책·약관 읽기
- 용어(사전 담당): `치지직 개발자 센터`, `Client ID`, `Client Secret`, `치지직 Open API`
- 자주 막히는 곳 후보:
  - 앱 이름이 거절됨 → 공식 서비스명 금지 규칙
  - 심사가 며칠 걸림 → 기다리는 동안 기본 경로(테스트 모드)로 Day 23~28 진행
  - Secret을 스크린샷·커밋에 노출 → 개발자 센터에서 재발급, 커밋이면 Git 기록에도 남는다는 점
  - 리디렉션 URL 끝에 `/`를 붙이거나 https로 등록 → Day 23에서 불일치 오류
- 레퍼런스 대응:
  - `C:\dev\image-donation\README.md`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/README.md`)와 다름: 다시 바뀜 → [Day 32](#/day/sp-d32)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\ChzzkApiClient.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Services/ChzzkApiClient.cs`)와 다름: 다시 바뀜 → [Day 24](#/day/sp-d24)

## Day 23 — 치지직 로그인 (110분)
- 목표:
  - `Entities\ChzzkToken.cs`(최종: UserId 키, ChannelId 고유, ChannelName, 토큰 암호문 2개, 만료 시각, UpdatedAt), `AppDbContext`에 `ChzzkTokens`, `dotnet ef migrations add AddChzzkTokens`.
  - `GET /api/chzzk/callback`: 쿠키의 state를 꺼내고 바로 지움 → `code`·`state`·쿠키가 없거나 다르면 `/login?error=chzzk-state`(비교는 `CryptographicOperations.FixedTimeEquals` — 타이밍 공격) → `ExchangeCodeAsync` + `GetMeAsync`(실패하면 로그 남기고 `/login?error=chzzk-token`).
  - 계정 찾기 3단계: ① 이 채널이 이미 연결된 계정 ② 지금 로컬 로그인 중인 계정(계정 연결) ③ 비밀번호 없는 새 계정 `chzzk-{channelId}`(`UserManager.CreateAsync`). ChzzkToken에 채널 정보를 저장한다. **토큰 값 저장은 Day 24에서 암호화와 함께** — 평문으로 저장하는 단계는 두지 않는다. `SignInManager.SignInAsync(user, isPersistent: true)`(로컬 로그인과 같은 쿠키) → 스트리머가 있으면 `/dashboard`, 없으면 `/onboarding`(화면은 Day 30, 그 전에는 api.http 온보딩).
  - `Dtos\AuthDtos.cs`에 `ChzzkInfo(ChannelName, SessionConnected)`, `MeResponse`에 `Chzzk`. `GetMe`가 ChzzkTokens를 읽어 채운다(세션 연결 표시는 Day 26까지 `false`).
  - 화면: `api.ts`의 `Me.chzzk`, `SettingsPage`의 "치지직 연결" 절(연결됨: 채널 이름 · 세션 소켓 상태 / 아니면 "치지직 계정 연결" 링크 + "앱 승인 전에는 대시보드의 테스트 모드를 쓰세요."), `LoginPage`의 `chzzk-state` 문장과 그 밖의 오류 문장(최종).
  - 치지직 실서버 연동은 작성 환경에서 검증하지 못했다(계정·인증 정보 없음). 코드는 공식 문서 대조와 가짜 HTTP 처리기·로컬 에뮬레이터로만 확인했다고 본문에 적는다.
- 이미 배운 것:
  - [Day 13](#/day/sp-d13) Identity·온보딩, [Day 20](#/day/sp-d20) 설정 화면, [Day 21](#/day/sp-d21)~[Day 22](#/day/sp-d22)
  - Identity 표·MapIdentityApi([P2 Day 25](#/day/p2-d25)), 클레임·`/api/me`([P2 Day 26](#/day/p2-d26)), `SignInManager.SignOutAsync`([Day 13](#/day/sp-d13)). 오늘 처음: `UserManager<IdentityUser>`의 `FindByIdAsync`·`GetUserAsync`·`CreateAsync`(계정 찾기·만들기)와 `SignInManager.SignInAsync`(비밀번호 없이 쿠키 로그인), 관계·외래 키([P2 Day 22](#/day/p2-d22))
- 시작 상태:
  - [Day 22](#/day/sp-d22) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 22](#/day/sp-d22)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`, `.env.example`, `.env`, `docker-compose.yml`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `overlay.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`, `api.ts`, `donationList.ts`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`, `DonationForm.tsx`, `StreamerLayout.tsx`
  - `C:\dev\image-donation\client\src\hooks\`: `useImagePreview.ts`, `useMe.ts`, `useDashboardHub.ts`
  - `C:\dev\image-donation\client\src\overlay\`: `main.tsx`, `Overlay.tsx`, `useOverlayHub.ts`, `overlay.css`
  - `C:\dev\image-donation\client\src\pages\`: `DonatePage.tsx`, `DashboardPage.tsx`, `LoginPage.tsx`, `SettingsPage.tsx`
  - `C:\dev\image-donation\server\`: `ImageDonation.slnx`
  - `C:\dev\image-donation\server\ImageDonation.Api\`: `ImageDonation.Api.csproj`, `appsettings.json`, `appsettings.Development.json`, `Program.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\`: `AppDbContext.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\`: `DonationDtos.cs`, `AuthDtos.cs`, `SettingsDto.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\`: `PublicEndpoints.cs`, `AuthEndpoints.cs`, `DashboardEndpoints.cs`, `ChzzkEndpoints.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\`: `Streamer.cs`, `StreamerSettings.cs`, `Donation.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Hubs\`: `OverlayHub.cs`, `DashboardHub.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\`: `<시각>_InitialCreate.cs (+ .Designer.cs)`, `<시각>_AddIdentity.cs (+ .Designer.cs)`, `AppDbContextModelSnapshot.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Properties\`: `launchSettings.json`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\`: `ImageProcessor.cs`, `RetentionService.cs`, `DonationService.cs`, `ChzzkApiClient.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\`: `LocalImageStorage.cs`
  - `C:\dev\sp-practice\`: `api.http`
  - `C:\dev\sp-practice\images\`: `(폴더)`
  - 터미널 두 개, 로컬 계정으로 로그인한 브라우저.
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\client\src\api.ts` [바꿈] — `Me`에 `chzzk: { channelName, sessionConnected } | null` (레퍼런스 `client/src/api.ts`)
  - `C:\dev\image-donation\client\src\pages\LoginPage.tsx` [바꿈] — + `chzzk-state` 문장, 그 밖의 오류는 "치지직 로그인에 실패했어요…" (레퍼런스와 같아짐) (레퍼런스 `client/src/pages/LoginPage.tsx`)
  - `C:\dev\image-donation\client\src\pages\SettingsPage.tsx` [바꿈] — + "치지직 연결" 절(연결됨: 채널 이름 · 세션 소켓 상태 / "치지직 계정 연결" 링크) (레퍼런스와 같아짐) (레퍼런스 `client/src/pages/SettingsPage.tsx`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\AppDbContext.cs` [바꿈] — + DbSet `ChzzkTokens`(키 UserId, ChannelId 고유) (레퍼런스 `server/ImageDonation.Api/Data/AppDbContext.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\ChzzkToken.cs` [새로] — UserId(키), ChannelId, ChannelName, AccessTokenProtected, RefreshTokenProtected, AccessTokenExpiresAt, UpdatedAt (레퍼런스 `server/ImageDonation.Api/Entities/ChzzkToken.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\AuthDtos.cs` [바꿈] — + `ChzzkInfo(ChannelName, SessionConnected)`, `MeResponse`에 `Chzzk` (레퍼런스와 같아짐) (레퍼런스 `server/ImageDonation.Api/Dtos/AuthDtos.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\AuthEndpoints.cs` [바꿈] — `GetMe`가 ChzzkTokens를 읽어 `ChzzkInfo(ChannelName, false)` (레퍼런스 `server/ImageDonation.Api/Endpoints/AuthEndpoints.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\ChzzkEndpoints.cs` [바꿈] — + `GET /callback`(state 비교 `SameText`·쿠키 삭제, 토큰 교환·users/me, 계정 찾기 3단계, ChzzkToken에 채널 정보, SignInAsync, `/dashboard` 또는 `/onboarding`) (레퍼런스 `server/ImageDonation.Api/Endpoints/ChzzkEndpoints.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\<시각>_AddChzzkTokens.cs (+ .Designer.cs)` [새로] — `dotnet ef migrations add AddChzzkTokens`
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\AppDbContextModelSnapshot.cs` [바꿈] — dotnet-ef가 갱신 (레퍼런스 `server/ImageDonation.Api/Migrations/AppDbContextModelSnapshot.cs`)
- 끝 상태 확인:
  - **기본 경로(치지직 승인 없이):** 브라우저로 `http://localhost:5173/api/chzzk/callback?code=x&state=y` → `/login?error=chzzk-state` + "로그인 확인 값(state)이 맞지 않아요. 다시 시도해 주세요.".
  - **기본 경로(치지직 승인 없이):** `/settings` 아래에 "치지직 계정 연결" 버튼과 테스트 모드 안내. psql `\d "ChzzkTokens"` → 표가 있다.
  - **선택 단계(승인된 치지직 앱이 있을 때만):** "치지직으로 로그인" → 동의 → `/dashboard`(또는 `/onboarding`). 설정에 "연결됨: <채널 이름> · 세션 소켓 연결 안 됨…", psql ChzzkTokens 1행(토큰 열은 아직 빈 값).
- 과제:
  - 1) 로컬 계정으로 로그인한 채 "치지직 계정 연결"을 누르면 어느 계정에 붙는지, 처음부터 치지직으로만 로그인하면 어떻게 되는지 → 정답 요지: 앞: ②단계로 지금 로그인한 로컬 계정에 연결. 뒤: ③단계로 `chzzk-<채널ID>` 새 계정(비밀번호 없음)이 만들어진다
  - 2) `state == expected` 대신 FixedTimeEquals를 쓰는 이유 → 정답 요지: 일반 비교는 다른 글자를 만나는 순간 멈춰 걸리는 시간이 값마다 다르다. 이 차이로 비밀 값을 추측하는 공격을 막는다
- 용어(사전 담당): `토큰 교환`, `계정 연결`, `타이밍 공격`
- 자주 막히는 곳 후보:
  - 선택 단계에서 늘 chzzk-state → state 쿠키는 로그인을 시작한 호스트(`localhost`)에 저장되는데 리디렉션 URL이 `127.0.0.1`이나 LAN IP라 쿠키가 따라오지 않음(포트 차이는 상관없다). 리디렉션이 5080에 도착하면 처리는 되지만 이어지는 `/dashboard`가 화면이 없는 5080으로 간다 → 두 경우 모두 Day 21의 개발용 주소 `http://localhost:5173/api/chzzk/callback`으로 통일
  - 치지직 쪽 "redirect uri mismatch" 계열 오류 → 개발자 센터 등록값과 user-secrets 값을 글자까지 비교
  - `/login?error=chzzk-token` → 서버 로그의 `치지직 토큰 교환 실패 (401)` 등 확인(Secret 오타가 많음)
  - 실서버 응답에 `channelId`가 없어 `KeyNotFoundException` → 미확인 영역이므로 공식 문서와 대조하고 보고
  - 마이그레이션을 안 만들고 실행 → PendingModelChangesWarning
- 레퍼런스 대응:
  - `C:\dev\image-donation\client\src\api.ts`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/api.ts`)와 다름: 다시 바뀜 → [Day 27](#/day/sp-d27)
  - `C:\dev\image-donation\client\src\pages\LoginPage.tsx`: `reference/sp-image-donation/client/src/pages/LoginPage.tsx` 최종(같음)
  - `C:\dev\image-donation\client\src\pages\SettingsPage.tsx`: `reference/sp-image-donation/client/src/pages/SettingsPage.tsx` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\AppDbContext.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Data/AppDbContext.cs`)와 다름: 다시 바뀜 → [Day 26](#/day/sp-d26)
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\ChzzkToken.cs`: `reference/sp-image-donation/server/ImageDonation.Api/Entities/ChzzkToken.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\AuthDtos.cs`: `reference/sp-image-donation/server/ImageDonation.Api/Dtos/AuthDtos.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\AuthEndpoints.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Endpoints/AuthEndpoints.cs`)와 다름: 다시 바뀜 → [Day 26](#/day/sp-d26)
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\ChzzkEndpoints.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Endpoints/ChzzkEndpoints.cs`)와 다름: 다시 바뀜 → [Day 24](#/day/sp-d24)
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\<시각>_AddChzzkTokens.cs (+ .Designer.cs)`: 레퍼런스와 이름 다름: 학습자 마이그레이션 이력(레퍼런스는 InitialCreate·SafetyReportsAndMinimalEvents 2개). 최종 스키마는 AppDbContextModelSnapshot.cs로 같음
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\AppDbContextModelSnapshot.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Migrations/AppDbContextModelSnapshot.cs`)와 다름: 다시 바뀜 → [Day 26](#/day/sp-d26)

## Day 24 — 토큰 관리 (100분)
- 목표:
  - 해시(Day 14 IP)와 암호화(토큰)의 차이: 토큰은 나중에 원문이 다시 필요하므로 되돌릴 수 있는 암호화. ASP.NET Core Data Protection: `AddDataProtection().SetApplicationName("ImageDonation")`, 목적 문자열 `"ImageDonation.ChzzkTokens"`로 `CreateProtector`. 로그인 쿠키도 같은 키 링으로 보호된다. Windows 개발 기본 키 위치는 `%LOCALAPPDATA%\ASP.NET\DataProtection-Keys`(공식 문서 대조, 실기 미확인). 컨테이너용 키 폴더(`DataProtection:KeysPath`)는 Day 37.
  - `ChzzkApiClient` 생성자에 `IDataProtectionProvider`·`TimeProvider`. `StoreTokens(entity, tokens)`(두 토큰을 암호화해 넣고 만료 시각 계산, 저장은 호출한 쪽), `ReadRefreshToken`, `RefreshAsync`(`grantType: refresh_token`), `GetValidAccessTokenAsync(db, userId)`: 만료 5분 전까지는 그대로 → 아니면 `SemaphoreSlim(1, 1)` 잠금 → 잠금 안에서 `db.Entry(token).ReloadAsync()`로 다시 읽기(그 사이 다른 요청이 갱신했을 수 있음) → 갱신 → 새 토큰 쌍을 잠금 안에서 바로 저장(옛 리프레시 토큰은 이제 무효).
  - 한계를 분명히: 이 잠금은 서버 프로세스 하나 안에서만 지켜진다. 서버를 여러 대 띄우면 DB 잠금 같은 다른 방법이 필요하다(레퍼런스 README).
  - 콜백(Day 23)에 `api.StoreTokens(token, tokens)` 한 줄 → 이제 토큰이 암호문으로만 DB에 들어간다.
  - **기본 경로(치지직 승인 없이):** 갱신·회전을 실제로 돌려 보는 것은 Day 36의 `ChzzkApiClientTests`(가짜 치지직 HTTP 처리기)에서 한다고 예고한다. 치지직 실서버 연동은 작성 환경에서 검증하지 못했다(계정·인증 정보 없음). 코드는 공식 문서 대조와 가짜 HTTP 처리기·로컬 에뮬레이터로만 확인했다고 본문에 적는다.
- 이미 배운 것:
  - [Day 12](#/day/sp-d12) TimeProvider, [Day 14](#/day/sp-d14) HMAC 해시, [Day 21](#/day/sp-d21)~[Day 23](#/day/sp-d23)
  - async·Task와 try/finally([P2 Day 15](#/day/p2-d15)), 해싱([P2 Day 25](#/day/p2-d25)), lock으로 동시 접근 막기([P2 Day 33](#/day/p2-d33) NoticeBroadcaster)
- 시작 상태:
  - [Day 23](#/day/sp-d23) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 23](#/day/sp-d23)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`, `.env.example`, `.env`, `docker-compose.yml`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `overlay.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`, `api.ts`, `donationList.ts`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`, `DonationForm.tsx`, `StreamerLayout.tsx`
  - `C:\dev\image-donation\client\src\hooks\`: `useImagePreview.ts`, `useMe.ts`, `useDashboardHub.ts`
  - `C:\dev\image-donation\client\src\overlay\`: `main.tsx`, `Overlay.tsx`, `useOverlayHub.ts`, `overlay.css`
  - `C:\dev\image-donation\client\src\pages\`: `DonatePage.tsx`, `DashboardPage.tsx`, `LoginPage.tsx`, `SettingsPage.tsx`
  - `C:\dev\image-donation\server\`: `ImageDonation.slnx`
  - `C:\dev\image-donation\server\ImageDonation.Api\`: `ImageDonation.Api.csproj`, `appsettings.json`, `appsettings.Development.json`, `Program.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\`: `AppDbContext.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\`: `DonationDtos.cs`, `AuthDtos.cs`, `SettingsDto.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\`: `PublicEndpoints.cs`, `AuthEndpoints.cs`, `DashboardEndpoints.cs`, `ChzzkEndpoints.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\`: `Streamer.cs`, `StreamerSettings.cs`, `Donation.cs`, `ChzzkToken.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Hubs\`: `OverlayHub.cs`, `DashboardHub.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\`: `<시각>_InitialCreate.cs (+ .Designer.cs)`, `<시각>_AddIdentity.cs (+ .Designer.cs)`, `<시각>_AddChzzkTokens.cs (+ .Designer.cs)`, `AppDbContextModelSnapshot.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Properties\`: `launchSettings.json`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\`: `ImageProcessor.cs`, `RetentionService.cs`, `DonationService.cs`, `ChzzkApiClient.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\`: `LocalImageStorage.cs`
  - `C:\dev\sp-practice\`: `api.http`
  - `C:\dev\sp-practice\images\`: `(폴더)`
  - 터미널 두 개.
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\server\ImageDonation.Api\Program.cs` [바꿈] — + `AddDataProtection().SetApplicationName("ImageDonation")` (레퍼런스 `server/ImageDonation.Api/Program.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\ChzzkEndpoints.cs` [바꿈] — 콜백에서 `api.StoreTokens(token, tokens)` (레퍼런스와 같아짐) (레퍼런스 `server/ImageDonation.Api/Endpoints/ChzzkEndpoints.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\ChzzkApiClient.cs` [바꿈] — + 생성자에 `IDataProtectionProvider`·`TimeProvider`, `_protector`("ImageDonation.ChzzkTokens"), `RefreshLock`(SemaphoreSlim 1), `RefreshAsync`, `StoreTokens`, `ReadRefreshToken`, `GetValidAccessTokenAsync`(만료 5분 전 갱신, 잠금 안에서 Reload·저장), `IsFresh` (레퍼런스 `server/ImageDonation.Api/Services/ChzzkApiClient.cs`)
- 끝 상태 확인:
  - **기본 경로(치지직 승인 없이):** `dotnet build` 경고 0. 파일 탐색기 주소창에 `%LOCALAPPDATA%\ASP.NET\DataProtection-Keys` → `key-<GUID>.xml` 파일이 있다(위치가 다르면 서버 시작 로그의 키 저장 위치 안내를 확인 — 문구는 작성자 확인).
  - **기본 경로(치지직 승인 없이):** `SetApplicationName`을 처음 넣으면 Data Protection의 구분값이 바뀌어 지금까지의 로그인 쿠키를 풀 수 없다 → **한 번은 다시 로그인**한다(정상). 그 뒤로는 서버를 껐다 켜도 대시보드 로그인이 유지된다.
  - **선택 단계(승인된 치지직 앱이 있을 때만):** 치지직으로 다시 로그인한 뒤 psql `SELECT left("AccessTokenProtected", 5) FROM "ChzzkTokens";` → `CfDJ8`(Data Protection 암호문의 시작). 원래 토큰 글자는 DB 어디에도 없다.
- 과제:
  - 1) 잠금 안에서 다시 읽지 않으면 어떤 일이 생기는지 두 요청 A·B로 설명 → 정답 요지: A·B가 같은 만료 토큰을 읽음 → A가 갱신해 r1을 쓰고 r2를 저장 → B가 기다렸다가 옛 r1로 갱신 → 1회용이라 실패(401). 다시 읽으면 B는 A가 저장한 새 토큰을 그대로 쓴다
  - 2) SetApplicationName 값을 바꾸면 무슨 일이 생기는지 → 정답 요지: 키 링이 달라져 기존 쿠키·암호문을 풀 수 없다 → 모두 다시 로그인, 저장된 토큰도 못 읽음. 한 번 정하면 바꾸지 않는다
- 용어(사전 담당): `Data Protection`, `토큰 회전`, `SemaphoreSlim`
- 자주 막히는 곳 후보:
  - `CryptographicException: The key {…} was not found in the key ring.` → 키 폴더를 지웠거나 ApplicationName을 바꿈 → 다시 로그인·치지직 다시 연결
  - `No XML encryptor configured` 경고 → Linux·Docker에서 보이는 경고(Day 37에서 설명), Windows 개발에서는 보통 안 보임
  - 갱신이 401로 실패 → 리프레시 토큰이 이미 쓰였거나 30일 지남 → 치지직으로 다시 로그인
  - RefreshLock을 static이 아닌 필드로 둠 → 요청마다 새 잠금이라 효과 없음(ChzzkApiClient는 HttpClient 팩터리가 매번 만든다)
  - `SetApplicationName`을 넣은 직후 대시보드가 로그인 화면으로 돌아감 → 구분값이 바뀌어 옛 쿠키가 무효(한 번만 다시 로그인)
- 레퍼런스 대응:
  - `C:\dev\image-donation\server\ImageDonation.Api\Program.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Program.cs`)와 다름: 다시 바뀜 → [Day 26](#/day/sp-d26)
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\ChzzkEndpoints.cs`: `reference/sp-image-donation/server/ImageDonation.Api/Endpoints/ChzzkEndpoints.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\ChzzkApiClient.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Services/ChzzkApiClient.cs`)와 다름: 다시 바뀜 → [Day 28](#/day/sp-d28)

## Day 25 — 세션 소켓 이해 (120분)
- 목표:
  - 흐름(text 그림): `GET /open/v1/sessions/auth`로 1회용 URL(`https://ssio08.nchat.naver.com:443?auth=…` 모양) → Socket.IO 2.x(EIO=3) 연결 → `SYSTEM`(`type: connected`)의 `data.sessionKey` → `POST /open/v1/sessions/events/subscribe/donation?sessionKey=` → `DONATION` 이벤트. 구독 완료는 HTTP 응답이 아니라 `SYSTEM subscribed` 메시지로 온다. 세션 URL이 1회용이라 같은 주소로 재연결하지 않고, 끊기면 다음 점검 때 새 세션(Day 26).
  - .NET 클라이언트 `SocketIOClient` 4.0.5(`dotnet add package SocketIOClient --version 4.0.5`): `EIO = EngineIO.V3`(기본은 V4), `Transport = TransportProtocol.WebSocket`, `Reconnection = false`, `ConnectionTimeout` 3초. 함정 세 가지(external-facts 11절, 실행 확인됨): ① `using SocketIOClient.Common;`(`SocketIOClient.Transport`라는 네임스페이스는 없어서 CS0234) ② EIO=3에서는 `Auth` 옵션이 동작하지 않음 → `Query["auth"]` ③ URL에 `?auth=`를 붙여 두면 서버로 전달되지 않음 → `SplitSessionUrl`로 origin과 auth를 나눈다.
  - 로컬 에뮬레이터 `C:\dev\image-donation\tools\chzzk-emulator`: `package.json`(레퍼런스와 같게, `npm install socket.io@2.5.0 --save-exact`로 lock 생성), `emulator.cjs`(레퍼런스 그대로 — 실제 치지직이 아님을 파일 맨 위 주석과 본문에 분명히). `npm start` → `LISTENING 5099`.
  - `Services\Events\ChzzkSessionSource.cs` 첫 버전(아직 일반 클래스, 생성자는 `ILogger<ChzzkSessionSource>` 하나 — 9절 부록 D): 소켓 목록 `ConcurrentDictionary<int, SocketIO>`, `IsConnected`, `ConnectAsync(streamerId, sessionUrl, onSessionKey)`(SYSTEM connected → onSessionKey, DONATION은 원문만 로그), `DisconnectAsync`(그 소켓 인스턴스만 빼고 끊고 Dispose), `DisconnectAllAsync`, `SplitSessionUrl`. BackgroundService·이벤트 해석은 Day 26, 실패 처리는 Day 28.
  - 테스트 프로젝트를 오늘 만든다(이 코드는 진짜 치지직 없이 테스트로만 실행해 볼 수 있으므로): `cd C:\dev\image-donation\server` → `dotnet new xunit -n ImageDonation.Tests` → `dotnet sln add ImageDonation.Tests\ImageDonation.Tests.csproj` → `dotnet add ImageDonation.Tests reference ImageDonation.Api` → `UnitTest1.cs` 지우기. `ChzzkEmulator.cs`(테스트 도구라 붙여 넣고 읽기, 레퍼런스 최종: 빈 포트로 띄우고 처음 한 번 `npm ci`, Windows는 `cmd.exe /c npm`), `ChzzkSessionSourceTests.cs` 첫 버전: `SplitSessionUrl_MovesAuthToQueryOption`(최종과 같음) + 연습 테스트 `ChzzkSessionSource_ConnectsToEmulator_GetsSessionKey`(9절 부록 E: 에뮬레이터에 연결해 sessionKey `sess-123`과 출력 `CONNECTED auth=test-auth-token EIO=3` 확인, Day 26에서 최종 테스트로 바뀜).
  - `:::warn` 치지직 Open API로 할 수 없는 것 두 가지(설계서 2.5, 이 Day에서 분명히): ① **미션 후원은 받을 수 없다** — DONATION의 `donationType`은 `CHAT`·`VIDEO`만 가정한다(비공식 SDK 문서의 보고이고 공식 문서 문장은 직접 확인하지 못함, external-facts 10.7). ② **API로 방송 화면에 미디어를 직접 넣는 기능은 없다** → 그래서 이 서비스의 모든 화면 표시는 우리가 만든 OBS 브라우저 소스(오버레이, Day 18)로 한다.
- 이미 배운 것:
  - [Day 15](#/day/sp-d15) WebSocket·SignalR, [Day 21](#/day/sp-d21)~[Day 24](#/day/sp-d24)
  - xUnit·Fact·Assert·`dotnet test`([P2 Day 35](#/day/p2-d35)), npm([P2 Day 3](#/day/p2-d03)), async·Task([P2 Day 15](#/day/p2-d15)), Dictionary([P2 Day 11](#/day/p2-d11)) — 여러 스레드가 함께 쓰는 `ConcurrentDictionary`는 오늘 처음, 프로젝트 참조·솔루션([P2 Day 35](#/day/p2-d35)·[P2 Day 36](#/day/p2-d36))
- 시작 상태:
  - [Day 24](#/day/sp-d24) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 24](#/day/sp-d24)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`, `.env.example`, `.env`, `docker-compose.yml`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `overlay.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`, `api.ts`, `donationList.ts`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`, `DonationForm.tsx`, `StreamerLayout.tsx`
  - `C:\dev\image-donation\client\src\hooks\`: `useImagePreview.ts`, `useMe.ts`, `useDashboardHub.ts`
  - `C:\dev\image-donation\client\src\overlay\`: `main.tsx`, `Overlay.tsx`, `useOverlayHub.ts`, `overlay.css`
  - `C:\dev\image-donation\client\src\pages\`: `DonatePage.tsx`, `DashboardPage.tsx`, `LoginPage.tsx`, `SettingsPage.tsx`
  - `C:\dev\image-donation\server\`: `ImageDonation.slnx`
  - `C:\dev\image-donation\server\ImageDonation.Api\`: `ImageDonation.Api.csproj`, `appsettings.json`, `appsettings.Development.json`, `Program.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\`: `AppDbContext.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\`: `DonationDtos.cs`, `AuthDtos.cs`, `SettingsDto.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\`: `PublicEndpoints.cs`, `AuthEndpoints.cs`, `DashboardEndpoints.cs`, `ChzzkEndpoints.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\`: `Streamer.cs`, `StreamerSettings.cs`, `Donation.cs`, `ChzzkToken.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Hubs\`: `OverlayHub.cs`, `DashboardHub.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\`: `<시각>_InitialCreate.cs (+ .Designer.cs)`, `<시각>_AddIdentity.cs (+ .Designer.cs)`, `<시각>_AddChzzkTokens.cs (+ .Designer.cs)`, `AppDbContextModelSnapshot.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Properties\`: `launchSettings.json`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\`: `ImageProcessor.cs`, `RetentionService.cs`, `DonationService.cs`, `ChzzkApiClient.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\`: `LocalImageStorage.cs`
  - `C:\dev\sp-practice\`: `api.http`
  - `C:\dev\sp-practice\images\`: `(폴더)`
  - Node.js(`node --version`), PostgreSQL은 오늘 테스트에 필요 없다(에뮬레이터 테스트는 DB를 쓰지 않음).
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\server\ImageDonation.slnx` [바꿈] — + `dotnet sln add ImageDonation.Tests` (레퍼런스와 같아짐) (레퍼런스 `server/ImageDonation.slnx`)
  - `C:\dev\image-donation\server\ImageDonation.Api\ImageDonation.Api.csproj` [바꿈] — + SocketIOClient 4.0.5 (레퍼런스와 같아짐) (레퍼런스 `server/ImageDonation.Api/ImageDonation.Api.csproj`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Events\ChzzkSessionSource.cs` [새로] — 아직 BackgroundService가 아닌 일반 클래스, 생성자는 `ILogger<ChzzkSessionSource> logger` 하나(9절 부록 D): `_sockets`(ConcurrentDictionary), `IsConnected`, `ConnectAsync`(EIO V3·WebSocket·Reconnection false·3초·`Query["auth"]`, SYSTEM connected → onSessionKey, DONATION은 원문 로그만), `DisconnectAsync`, `DisconnectAllAsync`, `SplitSessionUrl` (레퍼런스 `server/ImageDonation.Api/Services/Events/ChzzkSessionSource.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Tests\ImageDonation.Tests.csproj` [새로] — `dotnet new xunit -n ImageDonation.Tests`(xunit 2.9.3, runner 3.1.4, Test.Sdk 17.14.1, coverlet 6.0.4, `<Using Include="Xunit" />`) + `dotnet add reference ..\ImageDonation.Api`; 템플릿의 `UnitTest1.cs`는 지움 (레퍼런스 `server/ImageDonation.Tests/ImageDonation.Tests.csproj`)
  - `C:\dev\image-donation\server\ImageDonation.Tests\ChzzkEmulator.cs` [새로] — tools/chzzk-emulator를 빈 포트로 띄우고(처음 한 번 `npm ci`), `LISTENING` 줄로 포트를 읽고, 끝나면 그 프로세스만 끔 (레퍼런스 `server/ImageDonation.Tests/ChzzkEmulator.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Tests\ChzzkSessionSourceTests.cs` [새로] — `CreateSource()`(부록 D의 Day 25 생성자) + `SplitSessionUrl_MovesAuthToQueryOption` + 연습 테스트 `ChzzkSessionSource_ConnectsToEmulator_GetsSessionKey`(부록 E) (레퍼런스 `server/ImageDonation.Tests/ChzzkSessionSourceTests.cs`)
  - `C:\dev\image-donation\tools\chzzk-emulator\package.json` [새로] — `chzzk-emulator`, `"start": "node emulator.cjs 5099"`, `socket.io` 2.5.0(정확한 버전) (레퍼런스 `tools/chzzk-emulator/package.json`)
  - `C:\dev\image-donation\tools\chzzk-emulator\package-lock.json` [새로] — npm이 만듦 (레퍼런스 `tools/chzzk-emulator/package-lock.json`)
  - `C:\dev\image-donation\tools\chzzk-emulator\emulator.cjs` [새로] — 레퍼런스 그대로(상황 donations·revoked·kick·malformed는 Day 28에서 씀) (레퍼런스 `tools/chzzk-emulator/emulator.cjs`)
- 끝 상태 확인:
  - **기본 경로(치지직 승인 없이):** `cd C:\dev\image-donation\tools\chzzk-emulator` → `npm start` → `LISTENING 5099`. `Ctrl + C`로 끈다.
  - **기본 경로(치지직 승인 없이):** `cd C:\dev\image-donation\server` → `dotnet test` → 테스트 2개 통과(`Passed!  - Failed: 0, Passed: 2` 모양, 숫자·시간은 달라도 됨).
  - **기본 경로(치지직 승인 없이):** `ImageDonation.slnx`에 두 프로젝트가 있다(`dotnet sln list`).
  - **선택 단계(승인된 치지직 앱이 있을 때만):** 오늘은 없다. 진짜 치지직 세션에 붙는 것은 Day 28의 자동 점검(승인된 앱 + 치즈 모드)에서 확인한다.
- 과제:
  - 1) `SplitSessionUrl`을 쓰지 않고 `new SocketIO(new Uri(url))`에 `?auth=`를 붙인 주소를 그대로 넣으면 테스트가 어떻게 되는지 확인 후 되돌린다 → 정답 요지: 에뮬레이터 출력이 `CONNECTED auth=undefined EIO=3`가 되어 연습 테스트의 Assert가 실패한다 → 함정 ③을 직접 본다
  - 2) `Reconnection = false`로 두는 이유 → 정답 요지: 세션 URL은 1회용이라 같은 주소로 다시 붙어도 소용없다. 끊기면 Day 26의 60초 점검이 새 세션 URL을 받아 새로 연결한다
- 용어(사전 담당): `Socket.IO`, `Engine.IO`, `세션 소켓`, `에뮬레이터`
  - P3 사전 항목에 `[[제목]]`으로 링크하되 **P3를 안 했다고 가정하고 이 Day가 처음부터 설명**(정의만 P3 담당): `[[WebSocket]]`
  - 앞 프로젝트(P1·P2)에서 배운 용어, 다시 짚을 때 `[[제목]]`으로 링크: `[[xUnit]]`
- 자주 막히는 곳 후보:
  - `error CS0234: The type or namespace name 'Transport' does not exist in the namespace 'SocketIOClient'` → `using SocketIOClient.Common;`
  - `npm install` 뒤 `npm audit`의 취약점 경고 → socket.io 2.5.0은 오래된 버전이라 경고가 나온다. 이 에뮬레이터는 내 PC(127.0.0.1)에서 테스트할 때만 쓰고 인터넷에 열지 않는다
  - 테스트가 `tools/chzzk-emulator 폴더를 찾지 못했어요.` → 폴더 이름·위치(레퍼런스와 같게)
  - `node`를 찾을 수 없음 → Node 설치·터미널 재시작
  - 테스트가 멈춘 뒤 node 프로세스가 남음 → 작업 관리자에서 내가 띄운 node만 끝내기
  - 에뮬레이터는 127.0.0.1에서만 들으므로 보통 방화벽 창이 안 뜬다. 뜨면 어떤 프로그램인지 읽고 결정(공용 네트워크 허용은 하지 않음)
- 레퍼런스 대응:
  - `C:\dev\image-donation\server\ImageDonation.slnx`: `reference/sp-image-donation/server/ImageDonation.slnx` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Api\ImageDonation.Api.csproj`: `reference/sp-image-donation/server/ImageDonation.Api/ImageDonation.Api.csproj` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Events\ChzzkSessionSource.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Services/Events/ChzzkSessionSource.cs`)와 다름: 다시 바뀜 → [Day 26](#/day/sp-d26)
  - `C:\dev\image-donation\server\ImageDonation.Tests\ImageDonation.Tests.csproj`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Tests/ImageDonation.Tests.csproj`)와 다름: 다시 바뀜 → [Day 34](#/day/sp-d34)
  - `C:\dev\image-donation\server\ImageDonation.Tests\ChzzkEmulator.cs`: `reference/sp-image-donation/server/ImageDonation.Tests/ChzzkEmulator.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Tests\ChzzkSessionSourceTests.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Tests/ChzzkSessionSourceTests.cs`)와 다름: 다시 바뀜 → [Day 26](#/day/sp-d26)
  - `C:\dev\image-donation\tools\chzzk-emulator\package.json`: `reference/sp-image-donation/tools/chzzk-emulator/package.json` 최종(같음)
  - `C:\dev\image-donation\tools\chzzk-emulator\package-lock.json`: `reference/sp-image-donation/tools/chzzk-emulator/package-lock.json` 최종(같음)
  - `C:\dev\image-donation\tools\chzzk-emulator\emulator.cjs`: `reference/sp-image-donation/tools/chzzk-emulator/emulator.cjs` 최종(같음)

## Day 26 — 후원 이벤트 수신 (110분)
- 목표:
  - 설계: `Services\Events\IDonationEventSource.cs` — `CheeseDonationEvent(StreamerId, Source "chzzk"/"test", DonationType, DonatorNickname, PayAmount, DonationText, ReceivedAt)`와 `event Func<CheeseDonationEvent, Task>? DonationReceived`. 진짜(ChzzkSessionSource)와 가짜(FakeDonationSource)가 같은 이벤트를 내므로 받는 쪽은 출처를 신경 쓰지 않는다. 함정 주석: 처리기를 여러 개 붙이면 `await handler(evt)`는 마지막 처리기의 Task만 기다린다 → 하나만 붙인다.
  - `ChzzkSessionSource`가 `IDonationEventSource`를 구현한다(아직 BackgroundService가 아님 — 스스로 연결을 점검하는 부분은 Day 28). 생성자에 `TimeProvider` 추가(9절 부록 D), DONATION → `ParseDonation` → `DonationReceived`. 오늘 진짜 소켓은 테스트(에뮬레이터)에서만 붙는다. `ParseDonation`(+ `ToObject`, `ToAmount`, `ReadString`): 페이로드가 JSON 문자열이든 객체든, `payAmount`가 문자열이든 숫자든 받고(문서 표기는 문자열, 실측 보고는 다름 — 미확인), 깨진 JSON·음수·int 범위 밖 금액은 null.
  - **테스트 모드 백엔드를 먼저**: `FakeDonationSource.PublishAsync`가 치지직 문서와 같은 DONATION JSON(payAmount 문자열)을 만들어 같은 해석기에 통과시키고 처리기를 끝까지 기다린다. `Endpoints\TestModeEndpoints.cs`: `POST /api/dashboard/test-donation`(로그인 필요, 자기 방송에만, 본문 `TestDonationRequest {amount, message, nickname?}`) → 202. 돈은 전혀 오가지 않는다.
  - 이벤트 기록 `Entities\DonationEvent.cs`(금액·받은 시각·출처·매칭된 후원 ID만, 후원자 닉네임·메시지 열은 처음부터 없음) + `dotnet ef migrations add AddDonationEvents`. `DonationService.HandleCheeseEventAsync` 첫 버전: **무료 모드 스트리머의 이벤트는 아무것도 저장하지 않고**, 치즈 모드면 기록만(매칭은 Day 27). `RetentionService`가 7일 지난 이벤트도 지운다.
  - `Program.cs`: ChzzkSessionSource를 싱글턴으로(HostedService 등록은 Day 28), FakeDonationSource 싱글턴, 둘 다 `IDonationEventSource`로 등록(같은 인스턴스), `foreach` 로 각 출처에 처리기 하나(이벤트마다 새 scope의 DonationService). `/api/auth/me`의 `SessionConnected`가 이제 `sessions.IsConnected(streamer.Id)`.
  - `:::info` 대안: 서버가 직접 실서버 소켓에 붙지 못하면 "브라우저 중계"(대시보드가 `socket.io-client@2.0.3`으로 연결해 서버로 넘기기)를 쓸 수 있다는 설계만 소개한다. external-facts 11절은 최소 코드를 함께 보이자고 적었지만, 레퍼런스에 중계 코드가 없고 이 환경에서 실행·검증하지 않았으므로(설계서 5.3·CONTENT-GUIDE: 검증한 코드만 싣는다) 교재에는 흐름 그림과 쓸 패키지 이름만 두고 코드는 싣지 않는다.
  - 테스트(`CreateSource()`는 부록 D의 Day 26 생성자): 연습 테스트를 `ChzzkSessionSource_ReceivesDonations_FromSocketIo2Emulator`로 바꾸고 ParseDonation 테스트 2개 추가(레퍼런스와 같은 코드).
- 이미 배운 것:
  - [Day 12](#/day/sp-d12) BackgroundService, [Day 17](#/day/sp-d17) 대시보드 알림, [Day 20](#/day/sp-d20) 후원 방식 설정, [Day 25](#/day/sp-d25)
  - interface([P2 Day 13](#/day/p2-d13)), DI·서비스 수명([P2 Day 23](#/day/p2-d23)), 람다([P2 Day 14](#/day/p2-d14)), C#의 `event` 키워드는 오늘 처음(짧게 설명)
- 시작 상태:
  - [Day 25](#/day/sp-d25) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 25](#/day/sp-d25)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`, `.env.example`, `.env`, `docker-compose.yml`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `overlay.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`, `api.ts`, `donationList.ts`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`, `DonationForm.tsx`, `StreamerLayout.tsx`
  - `C:\dev\image-donation\client\src\hooks\`: `useImagePreview.ts`, `useMe.ts`, `useDashboardHub.ts`
  - `C:\dev\image-donation\client\src\overlay\`: `main.tsx`, `Overlay.tsx`, `useOverlayHub.ts`, `overlay.css`
  - `C:\dev\image-donation\client\src\pages\`: `DonatePage.tsx`, `DashboardPage.tsx`, `LoginPage.tsx`, `SettingsPage.tsx`
  - `C:\dev\image-donation\server\`: `ImageDonation.slnx`
  - `C:\dev\image-donation\server\ImageDonation.Api\`: `ImageDonation.Api.csproj`, `appsettings.json`, `appsettings.Development.json`, `Program.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\`: `AppDbContext.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\`: `DonationDtos.cs`, `AuthDtos.cs`, `SettingsDto.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\`: `PublicEndpoints.cs`, `AuthEndpoints.cs`, `DashboardEndpoints.cs`, `ChzzkEndpoints.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\`: `Streamer.cs`, `StreamerSettings.cs`, `Donation.cs`, `ChzzkToken.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Hubs\`: `OverlayHub.cs`, `DashboardHub.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\`: `<시각>_InitialCreate.cs (+ .Designer.cs)`, `<시각>_AddIdentity.cs (+ .Designer.cs)`, `<시각>_AddChzzkTokens.cs (+ .Designer.cs)`, `AppDbContextModelSnapshot.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Properties\`: `launchSettings.json`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\`: `ImageProcessor.cs`, `RetentionService.cs`, `DonationService.cs`, `ChzzkApiClient.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Events\`: `ChzzkSessionSource.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\`: `LocalImageStorage.cs`
  - `C:\dev\image-donation\server\ImageDonation.Tests\`: `ImageDonation.Tests.csproj`, `ChzzkEmulator.cs`, `ChzzkSessionSourceTests.cs`
  - `C:\dev\image-donation\tools\chzzk-emulator\`: `package.json`, `package-lock.json`, `emulator.cjs`
  - `C:\dev\sp-practice\`: `api.http`
  - `C:\dev\sp-practice\images\`: `(폴더)`
  - 터미널 두 개, PostgreSQL 실행 중, REST Client 로그인 상태.
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\server\ImageDonation.Api\Program.cs` [바꿈] — + ChzzkSessionSource 싱글턴(HostedService 등록은 Day 28), FakeDonationSource, `IDonationEventSource` 두 개 등록(같은 인스턴스), 처리기 연결 foreach, `MapTestModeEndpoints()` (레퍼런스 `server/ImageDonation.Api/Program.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\AppDbContext.cs` [바꿈] — + DbSet `DonationEvents`(ReceivedAt 인덱스) (레퍼런스 `server/ImageDonation.Api/Data/AppDbContext.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\DonationEvent.cs` [새로] — StreamerId, Source("chzzk"/"test"), PayAmount, ReceivedAt, MatchedDonationId — 닉네임·메시지 열 없음(최소 수집) (레퍼런스 `server/ImageDonation.Api/Entities/DonationEvent.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\DonationDtos.cs` [바꿈] — + `TestDonationRequest([Range(1, 10_000_000)] Amount, [Required, MaxLength(100)] Message, [MaxLength(20)] Nickname?)` (레퍼런스 `server/ImageDonation.Api/Dtos/DonationDtos.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\AuthEndpoints.cs` [바꿈] — `ChzzkSessionSource sessions`를 받아 `sessions.IsConnected(streamer.Id)` (레퍼런스와 같아짐) (레퍼런스 `server/ImageDonation.Api/Endpoints/AuthEndpoints.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\TestModeEndpoints.cs` [새로] — `POST /api/dashboard/test-donation`(로그인 필요, 자기 방송에만) → `FakeDonationSource.PublishAsync` → 202 (레퍼런스 `server/ImageDonation.Api/Endpoints/TestModeEndpoints.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\RetentionService.cs` [바꿈] — + 7일 지난 DonationEvents `ExecuteDeleteAsync` (레퍼런스 `server/ImageDonation.Api/Services/RetentionService.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\DonationService.cs` [바꿈] — + `HandleCheeseEventAsync` 첫 버전: 치즈 모드 스트리머만 DonationEvent(금액·시각·출처) 저장 (레퍼런스 `server/ImageDonation.Api/Services/DonationService.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Events\IDonationEventSource.cs` [새로] — `CheeseDonationEvent` record + `IDonationEventSource { event DonationReceived }` + "처리기 여러 개면 마지막 Task만 기다림" 주석 (레퍼런스 `server/ImageDonation.Api/Services/Events/IDonationEventSource.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Events\FakeDonationSource.cs` [새로] — 치지직 DONATION과 같은 JSON(payAmount 문자열) → `ChzzkSessionSource.ParseDonation` → 처리기 await (레퍼런스 `server/ImageDonation.Api/Services/Events/FakeDonationSource.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Events\ChzzkSessionSource.cs` [바꿈] — `: IDonationEventSource` + 생성자에 `TimeProvider time`(부록 D), DONATION → `ParseDonation` → `DonationReceived`, `ParseDonation`·`ToObject`·`ToAmount`·`ReadString` (아직 BackgroundService 아님) (레퍼런스 `server/ImageDonation.Api/Services/Events/ChzzkSessionSource.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\<시각>_AddDonationEvents.cs (+ .Designer.cs)` [새로] — `dotnet ef migrations add AddDonationEvents` (처음부터 최소 열만)
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\AppDbContextModelSnapshot.cs` [바꿈] — dotnet-ef가 갱신 (레퍼런스 `server/ImageDonation.Api/Migrations/AppDbContextModelSnapshot.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Tests\ChzzkSessionSourceTests.cs` [바꿈] — `CreateSource()`를 Day 26 생성자로, 연습 테스트를 `ChzzkSessionSource_ReceivesDonations_FromSocketIo2Emulator`로 바꾸고 `ParseDonation_AcceptsStringOrObjectPayload`, `ParseDonation_ReturnsNullForBrokenPayloads` 추가 (레퍼런스 `server/ImageDonation.Tests/ChzzkSessionSourceTests.cs`)
  - `C:\dev\sp-practice\api.http` [바꿈] — + `POST /api/dashboard/test-donation` — 정확한 모양은 9절 부록 F
- 끝 상태 확인:
  - **기본 경로(치지직 승인 없이):** 설정 화면에서 "치즈 후원 연동"으로 저장 → api.http `POST /api/dashboard/test-donation` `{"amount":1000,"message":"안녕"}` → `202 Accepted` → psql `SELECT * FROM "DonationEvents";` → 1행(Source `test`, PayAmount 1000, MatchedDonationId NULL). 열 목록에 닉네임·메시지가 없다.
  - **기본 경로(치지직 승인 없이):** 무료 모드로 바꾸고 다시 보냄 → DonationEvents 행 수가 늘지 않는다.
  - **기본 경로(치지직 승인 없이):** `dotnet test` → 4개 통과.
  - **선택 단계(승인된 치지직 앱이 있을 때만):** 오늘은 없다. 서버가 치지직 세션에 스스로 붙는 점검은 Day 28에서 한다.
- 과제:
  - 1) `payAmount`가 `"-5"`, `"99999999999"`, `2500`일 때 ParseDonation 결과 → 정답 요지: null, null(int 범위 밖), PayAmount 2500. 테스트 `ParseDonation_ReturnsNullForBrokenPayloads`와 같은 생각
  - 2) 무료 모드 스트리머의 이벤트를 저장하지 않는 이유 → 정답 요지: 매칭할 후원이 없으니 쓸모가 없다 → 필요 없는 정보는 모으지 않는다(최소 수집, Day 32)
- 용어(사전 담당): `페이로드`, `C# 이벤트`, `브라우저 중계`
- 자주 막히는 곳 후보:
  - test-donation 401 → REST Client 로그인 쿠키, 403 → 온보딩 전 계정
  - 이벤트가 안 쌓임 → 무료 모드면 정상(위 확인 항목)
  - 처리기 안의 예외가 사라져 원인을 모름 → Day 28에서 try/catch와 로그
  - PendingModelChangesWarning → 마이그레이션 만들기
- 레퍼런스 대응:
  - `C:\dev\image-donation\server\ImageDonation.Api\Program.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Program.cs`)와 다름: 다시 바뀜 → [Day 28](#/day/sp-d28)
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\AppDbContext.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Data/AppDbContext.cs`)와 다름: 다시 바뀜 → [Day 31](#/day/sp-d31)
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\DonationEvent.cs`: `reference/sp-image-donation/server/ImageDonation.Api/Entities/DonationEvent.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\DonationDtos.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Dtos/DonationDtos.cs`)와 다름: 다시 바뀜 → [Day 27](#/day/sp-d27)
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\AuthEndpoints.cs`: `reference/sp-image-donation/server/ImageDonation.Api/Endpoints/AuthEndpoints.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\TestModeEndpoints.cs`: `reference/sp-image-donation/server/ImageDonation.Api/Endpoints/TestModeEndpoints.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\RetentionService.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Services/RetentionService.cs`)와 다름: 다시 바뀜 → [Day 27](#/day/sp-d27)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\DonationService.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Services/DonationService.cs`)와 다름: 다시 바뀜 → [Day 27](#/day/sp-d27)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Events\IDonationEventSource.cs`: `reference/sp-image-donation/server/ImageDonation.Api/Services/Events/IDonationEventSource.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Events\FakeDonationSource.cs`: `reference/sp-image-donation/server/ImageDonation.Api/Services/Events/FakeDonationSource.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Events\ChzzkSessionSource.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Services/Events/ChzzkSessionSource.cs`)와 다름: 다시 바뀜 → [Day 28](#/day/sp-d28)
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\<시각>_AddDonationEvents.cs (+ .Designer.cs)`: 레퍼런스와 이름 다름: 학습자 마이그레이션 이력(레퍼런스는 InitialCreate·SafetyReportsAndMinimalEvents 2개). 최종 스키마는 AppDbContextModelSnapshot.cs로 같음
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\AppDbContextModelSnapshot.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Migrations/AppDbContextModelSnapshot.cs`)와 다름: 다시 바뀜 → [Day 31](#/day/sp-d31)
  - `C:\dev\image-donation\server\ImageDonation.Tests\ChzzkSessionSourceTests.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Tests/ChzzkSessionSourceTests.cs`)와 다름: 다시 바뀜 → [Day 28](#/day/sp-d28)
  - `C:\dev\sp-practice\api.http`: 레퍼런스에 없음(프로젝트 밖 연습 파일(P2 Day 16의 REST Client로 실행). 레퍼런스에는 없고 최종 프로젝트 폴더에도 들어가지 않음)

## Day 27 — 후원 코드 매칭 (120분)
- 목표:
  - 치즈 모드 흐름(text 그림): 시청자가 이미지를 보냄 → 서버가 AwaitingCheese + 코드 `#AB12`(# + 영대문자·숫자 4자, `RandomNumberGenerator.GetString`, 같은 스트리머의 대기 중인 후원끼리 겹치지 않게 최대 20번 다시 뽑기, 36⁴ ≈ 168만) → 응답 `{id, status, code}` → 시청자가 치지직 치즈 후원 메시지에 코드를 넣음 → 이벤트(진짜 또는 테스트 모드) → 매칭.
  - `Services\DonationCodeMatcher.cs`(최종): `CodeLifetime` 30분, `[GeneratedRegex("#([A-Za-z0-9]{4})(?![A-Za-z0-9])")]`(대소문자 무시, `#AB123`은 코드가 아님 — [[정규 표현식]] [P1 Day 24](#/day/p1-d24) 복습), `ExtractCodes`(대문자로), `FindMatch`(금액 ≥ 최소 치즈, 30분 이내, AwaitingCheese, 메시지에 먼저 나온 코드 1건).
  - `HandleCheeseEventAsync` 완성: 후보 읽기 → FindMatch → 조건부 UPDATE("아직 AwaitingCheese일 때만" Pending, 자동 승인이면 Approved, CheeseAmount·UpdatedAt) → 같은 이벤트가 동시에 두 번 와도 한 번만 매칭(멱등성) → 이벤트 기록(MatchedDonationId) → 대시보드 알림 → 자동 승인이면 오버레이.
  - 만료: `RetentionService`에 `FindExpiryCandidatesAsync`(30분 지난 AwaitingCheese의 ID만, 추적 없이) → 후보마다 `ExpireAsync`의 조건부 UPDATE(그 사이 매칭되어 Pending이 됐으면 0행 → 건드리지 않음, 시청자가 낸 후원을 지킴) → 바뀐 것만 이미지 삭제·대시보드 알림. `IHubContext<DashboardHub,…>` 의존성, `RetentionResult(ExpiredDonations, DeletedDonations, DeletedFiles)`.
  - DTO: `CreateDonationResponse.Code`(null이면 JSON에서 빠짐), `DonationDto.ExpiresAt`(AwaitingCheese일 때 CreatedAt + 30분). 화면: `api.ts`의 `expiresAt`, `DonationCard`의 "코드 #AB12 · HH:MM까지"(`toLocaleTimeString('ko-KR')`, 브라우저 시간대로 표시 — [P2 Day 29](#/day/p2-d29))와 "치즈 N개 확인".
- 이미 배운 것:
  - [Day 13](#/day/sp-d13) 암호학적 난수, [Day 17](#/day/sp-d17) 조건부 업데이트, [Day 12](#/day/sp-d12) 정리 작업, [Day 26](#/day/sp-d26)
  - 정규 표현식([P1 Day 24](#/day/p1-d24)), LINQ([P2 Day 14](#/day/p2-d14)), UTC와 한국 시간 표시([P2 Day 29](#/day/p2-d29)), `[GeneratedRegex]`·partial([Day 10](#/day/sp-d10))
- 시작 상태:
  - [Day 26](#/day/sp-d26) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 26](#/day/sp-d26)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`, `.env.example`, `.env`, `docker-compose.yml`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `overlay.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`, `api.ts`, `donationList.ts`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`, `DonationForm.tsx`, `StreamerLayout.tsx`
  - `C:\dev\image-donation\client\src\hooks\`: `useImagePreview.ts`, `useMe.ts`, `useDashboardHub.ts`
  - `C:\dev\image-donation\client\src\overlay\`: `main.tsx`, `Overlay.tsx`, `useOverlayHub.ts`, `overlay.css`
  - `C:\dev\image-donation\client\src\pages\`: `DonatePage.tsx`, `DashboardPage.tsx`, `LoginPage.tsx`, `SettingsPage.tsx`
  - `C:\dev\image-donation\server\`: `ImageDonation.slnx`
  - `C:\dev\image-donation\server\ImageDonation.Api\`: `ImageDonation.Api.csproj`, `appsettings.json`, `appsettings.Development.json`, `Program.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\`: `AppDbContext.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\`: `DonationDtos.cs`, `AuthDtos.cs`, `SettingsDto.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\`: `PublicEndpoints.cs`, `AuthEndpoints.cs`, `DashboardEndpoints.cs`, `ChzzkEndpoints.cs`, `TestModeEndpoints.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\`: `Streamer.cs`, `StreamerSettings.cs`, `Donation.cs`, `ChzzkToken.cs`, `DonationEvent.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Hubs\`: `OverlayHub.cs`, `DashboardHub.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\`: `<시각>_InitialCreate.cs (+ .Designer.cs)`, `<시각>_AddIdentity.cs (+ .Designer.cs)`, `<시각>_AddChzzkTokens.cs (+ .Designer.cs)`, `<시각>_AddDonationEvents.cs (+ .Designer.cs)`, `AppDbContextModelSnapshot.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Properties\`: `launchSettings.json`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\`: `ImageProcessor.cs`, `RetentionService.cs`, `DonationService.cs`, `ChzzkApiClient.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Events\`: `IDonationEventSource.cs`, `FakeDonationSource.cs`, `ChzzkSessionSource.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\`: `LocalImageStorage.cs`
  - `C:\dev\image-donation\server\ImageDonation.Tests\`: `ImageDonation.Tests.csproj`, `ChzzkEmulator.cs`, `ChzzkSessionSourceTests.cs`
  - `C:\dev\image-donation\tools\chzzk-emulator\`: `package.json`, `package-lock.json`, `emulator.cjs`
  - `C:\dev\sp-practice\`: `api.http`
  - `C:\dev\sp-practice\images\`: `(폴더)`
  - 터미널 두 개, 대시보드(로그인)와 오버레이 창, REST Client. 설정의 후원 방식은 "치즈 후원 연동".
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\client\src\api.ts` [바꿈] — `Donation`에 `expiresAt` (레퍼런스 `client/src/api.ts`)
  - `C:\dev\image-donation\client\src\components\DonationCard.tsx` [바꿈] — AwaitingCheese면 "코드 #AB12 · HH:MM까지", 치즈 금액 "치즈 N개 확인" (레퍼런스 `client/src/components/DonationCard.tsx`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\DonationDtos.cs` [바꿈] — `CreateDonationResponse`에 `Code`(null이면 JSON에서 뺌), `DonationDto`에 `ExpiresAt` (레퍼런스 `server/ImageDonation.Api/Dtos/DonationDtos.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\RetentionService.cs` [바꿈] — + 30분 만료: `FindExpiryCandidatesAsync` → 후보마다 조건부 `ExpireAsync`(이미지 삭제·대시보드 알림), `IHubContext<DashboardHub,…>`, `RetentionResult(ExpiredDonations, …)` (레퍼런스 `server/ImageDonation.Api/Services/RetentionService.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\DonationService.cs` [바꿈] — + 치즈 모드면 AwaitingCheese + `NewUniqueCodeAsync`, `HandleCheeseEventAsync` 매칭(후보 → FindMatch → 조건부 UPDATE → 기록 → 알림·자동 승인) (레퍼런스 `server/ImageDonation.Api/Services/DonationService.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\DonationCodeMatcher.cs` [새로] — `CodeLifetime` 30분, `NewCode()`(# + 4자, RandomNumberGenerator.GetString), `[GeneratedRegex]` 코드 패턴, `ExtractCodes`, `FindMatch` (레퍼런스 `server/ImageDonation.Api/Services/DonationCodeMatcher.cs`)
  - `C:\dev\sp-practice\api.http` [바꿈] — + 치즈 모드 업로드 → 코드, 코드를 넣은 테스트 후원 — 정확한 모양은 9절 부록 F
- 끝 상태 확인:
  - **기본 경로(치지직 승인 없이):** 치즈 모드에서 api.http로 업로드 → `201` `{"id":…,"status":"AwaitingCheese","code":"#K3P9"}`(코드는 매번 다름). 대시보드 카드 "치즈 대기 · 코드 #K3P9 · 13:45까지".
  - **기본 경로(치지직 승인 없이):** api.http test-donation `{"amount":1000,"message":"이미지 부탁해요 #k3p9"}`(소문자여도 됨) → 카드가 실시간으로 "검수 대기 · 치즈 1,000개 확인". 같은 요청을 다시 보내도 변화 없음. 최소 치즈 미만(999) → 그대로 치즈 대기.
  - **기본 경로(치지직 승인 없이):** psql `SELECT "PayAmount","MatchedDonationId" FROM "DonationEvents" ORDER BY "Id" DESC LIMIT 3;` → 매칭된 이벤트에 후원 ID.
  - **기본 경로(치지직 승인 없이):** 만료: psql로 다른 치즈 대기 후원의 `CreatedAt`을 31분 전으로 → 1분 안에 카드가 "만료됨" + "이미지 삭제됨".
  - **선택 단계(승인된 치지직 앱이 있을 때만):** 실제 치지직 치즈 후원 메시지에 코드를 넣어 같은 변화가 생기는지 확인(실서버 미검증 — 페이로드 모양이 다르면 공식 문서와 대조하고 보고).
- 과제:
  - 1) 정규식에서 `(?![A-Za-z0-9])`를 빼면 어떤 잘못된 매칭이 생기는지 → 정답 요지: `#AB123`의 앞 4자 `#AB12`가 코드로 잡혀 엉뚱한 후원과 맞을 수 있다
  - 2) 코드가 4자뿐인데 괜찮은 이유 → 정답 요지: 모든 후원이 아니라 같은 스트리머의 "지금 대기 중인" 후원끼리만 겹치지 않으면 되고, 30분이면 만료된다. 금액 조건까지 맞아야 매칭된다
- 용어(사전 담당): `후원 코드`, `멱등성`
  - 앞 프로젝트(P1·P2)에서 배운 용어, 다시 짚을 때 `[[제목]]`으로 링크: `[[정규 표현식]]`
- 자주 막히는 곳 후보:
  - `.http` 파일에서 `#`으로 시작하는 줄은 주석 → 코드는 JSON 본문 안(따옴표 안)에 둔다
  - 최소 치즈 설정이 1000인데 테스트 금액 500 → 매칭 안 됨(정상)
  - 만료 시각이 9시간 다르게 보임 → 서버는 UTC, 화면은 브라우저 시간대로 바꿔 보여 줌([P2 Day 29](#/day/p2-d29))
  - 코드를 메시지에 두 개 넣음 → 먼저 나온 코드 1건만
- 레퍼런스 대응:
  - `C:\dev\image-donation\client\src\api.ts`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/api.ts`)와 다름: 다시 바뀜 → [Day 29](#/day/sp-d29)
  - `C:\dev\image-donation\client\src\components\DonationCard.tsx`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/components/DonationCard.tsx`)와 다름: 다시 바뀜 → [Day 31](#/day/sp-d31)
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\DonationDtos.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Dtos/DonationDtos.cs`)와 다름: 다시 바뀜 → [Day 31](#/day/sp-d31)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\RetentionService.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Services/RetentionService.cs`)와 다름: 다시 바뀜 → [Day 36](#/day/sp-d36)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\DonationService.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Services/DonationService.cs`)와 다름: 다시 바뀜 → [Day 28](#/day/sp-d28)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\DonationCodeMatcher.cs`: `reference/sp-image-donation/server/ImageDonation.Api/Services/DonationCodeMatcher.cs` 최종(같음)
  - `C:\dev\sp-practice\api.http`: 레퍼런스에 없음(프로젝트 밖 연습 파일(P2 Day 16의 REST Client로 실행). 레퍼런스에는 없고 최종 프로젝트 폴더에도 들어가지 않음)

## Day 28 — 테스트 모드·채팅 안내 (110분)
- 목표:
  - 진짜 수신기 완성(Day 26에서 옮김, 설계서 3.4와 다른 배치): `ChzzkSessionSource : BackgroundService, IDonationEventSource` — `ExecuteAsync`(치지직 설정이 없으면 "치지직 ClientId/ClientSecret이 없어 세션 수신기를 끕니다. 테스트 모드는 그대로 쓸 수 있어요." 로그 후 종료, 있으면 `Chzzk:SessionCheckSeconds` 60초마다 점검), `SyncConnectionsAsync`(치즈 모드 + 치지직 연결된 스트리머마다 연결, 무료 모드로 바꾼 스트리머는 끊기), `SubscribeAsync`(Day 22의 `GetSessionUrlAsync`·`SubscribeDonationAsync`를 부름), DONATION 해석(`ParseDonation` → `DonationReceived`)은 Day 26 그대로. `ChzzkApiClient`에는 `ChzzkOptions.SessionCheckSeconds`(60)와 `ChatOnMatch`만 더한다(세션·구독·채팅 메서드는 Day 22에 이미 있음). 생성자는 레퍼런스와 같은 `(IServiceScopeFactory scopes, IOptions<ChzzkOptions> options, ILogger<ChzzkSessionSource> logger, TimeProvider time)`(부록 D). `Program.cs`에 `AddHostedService(sp => sp.GetRequiredService<ChzzkSessionSource>())`, `appsettings.json`에 `Chzzk:SessionCheckSeconds`.
  - 채팅 안내(선택): Day 22에서 만든 `SendChatAsync`를 쓴다, `ChzzkOptions.ChatOnMatch`(기본 false, `dotnet user-secrets set "Chzzk:ChatOnMatch" "true"`), `DonationService.TrySendChatAsync`: 출처가 `chzzk`이고 켜져 있을 때만, 실패해도 후원 처리는 이미 끝났으므로 경고 로그만(`ILogger<DonationService>` 의존성 추가).
  - 실패 처리(ChzzkSessionSource 최종): 권한 회수(`SYSTEM revoked`) → 끊기, SYSTEM 처리기 예외(구독 실패 등) → "연결은 됐지만 후원은 못 받는" 소켓을 남기지 않게 끊기, DONATION 처리기 예외·깨진 페이로드 → 기록하고 다음 후원 계속, 서버가 끊음(`OnDisconnected`) → 목록에서 빼고 Dispose, 연결 전에 목록에 넣어 두기·연결 실패 소켓 정리, `StopAsync`에서 모두 끊기. 모든 경우 다음 60초 점검이 새 세션으로 다시 연결.
  - 할당량: 치지직 Quota 수치는 미확인 → 429를 받으면 기록하고 다음 점검에 다시(레퍼런스에는 지수 백오프 코드가 없으므로 개념만 설명).
  - 테스트 5개 추가(레퍼런스와 같은 코드): 에뮬레이터 상황 `revoked`, `kick`, `malformed`와 구독 실패, 처리기 예외.
  - 테스트 모드는 Day 26부터 `api.http`의 `test-donation` 요청으로 쓸 수 있고, 대시보드의 가짜 후원 발생기 화면은 Day 30(스트리머 온보딩의 "테스트 후원")에서 붙인다고 안내한다.
- 이미 배운 것:
  - [Day 22](#/day/sp-d22) 세션·채팅 API 메서드, [Day 12](#/day/sp-d12) BackgroundService·PeriodicTimer
  - [Day 19](#/day/sp-d19) 대시보드, [Day 25](#/day/sp-d25)~[Day 27](#/day/sp-d27)
  - 예외 처리·로그 수준([P2 Day 15](#/day/p2-d15), [P2 Day 24](#/day/p2-d24))
- 시작 상태:
  - [Day 27](#/day/sp-d27) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 27](#/day/sp-d27)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`, `.env.example`, `.env`, `docker-compose.yml`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `overlay.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`, `api.ts`, `donationList.ts`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`, `DonationForm.tsx`, `StreamerLayout.tsx`
  - `C:\dev\image-donation\client\src\hooks\`: `useImagePreview.ts`, `useMe.ts`, `useDashboardHub.ts`
  - `C:\dev\image-donation\client\src\overlay\`: `main.tsx`, `Overlay.tsx`, `useOverlayHub.ts`, `overlay.css`
  - `C:\dev\image-donation\client\src\pages\`: `DonatePage.tsx`, `DashboardPage.tsx`, `LoginPage.tsx`, `SettingsPage.tsx`
  - `C:\dev\image-donation\server\`: `ImageDonation.slnx`
  - `C:\dev\image-donation\server\ImageDonation.Api\`: `ImageDonation.Api.csproj`, `appsettings.json`, `appsettings.Development.json`, `Program.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\`: `AppDbContext.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\`: `DonationDtos.cs`, `AuthDtos.cs`, `SettingsDto.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\`: `PublicEndpoints.cs`, `AuthEndpoints.cs`, `DashboardEndpoints.cs`, `ChzzkEndpoints.cs`, `TestModeEndpoints.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\`: `Streamer.cs`, `StreamerSettings.cs`, `Donation.cs`, `ChzzkToken.cs`, `DonationEvent.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Hubs\`: `OverlayHub.cs`, `DashboardHub.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\`: `<시각>_InitialCreate.cs (+ .Designer.cs)`, `<시각>_AddIdentity.cs (+ .Designer.cs)`, `<시각>_AddChzzkTokens.cs (+ .Designer.cs)`, `<시각>_AddDonationEvents.cs (+ .Designer.cs)`, `AppDbContextModelSnapshot.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Properties\`: `launchSettings.json`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\`: `ImageProcessor.cs`, `RetentionService.cs`, `DonationService.cs`, `DonationCodeMatcher.cs`, `ChzzkApiClient.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Events\`: `IDonationEventSource.cs`, `FakeDonationSource.cs`, `ChzzkSessionSource.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\`: `LocalImageStorage.cs`
  - `C:\dev\image-donation\server\ImageDonation.Tests\`: `ImageDonation.Tests.csproj`, `ChzzkEmulator.cs`, `ChzzkSessionSourceTests.cs`
  - `C:\dev\image-donation\tools\chzzk-emulator\`: `package.json`, `package-lock.json`, `emulator.cjs`
  - `C:\dev\sp-practice\`: `api.http`
  - `C:\dev\sp-practice\images\`: `(폴더)`
  - 터미널 두 개, 대시보드(로그인), 오버레이 창 또는 OBS, 후원 방식 "치즈 후원 연동".
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\server\ImageDonation.Api\appsettings.json` [바꿈] — + `Chzzk:SessionCheckSeconds: 60`, `Chzzk:ChatOnMatch: false` (레퍼런스 `server/ImageDonation.Api/appsettings.json`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Program.cs` [바꿈] — + `AddHostedService(sp => sp.GetRequiredService<ChzzkSessionSource>())` (레퍼런스 `server/ImageDonation.Api/Program.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\DonationService.cs` [바꿈] — + `ChzzkApiClient`·`IOptions<ChzzkOptions>`·`ILogger` 의존성, `TrySendChatAsync`(ChatOnMatch이고 source가 chzzk일 때) (레퍼런스 `server/ImageDonation.Api/Services/DonationService.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\ChzzkApiClient.cs` [바꿈] — + `ChzzkOptions.SessionCheckSeconds`(60), `ChzzkOptions.ChatOnMatch` (레퍼런스와 같아짐) (레퍼런스 `server/ImageDonation.Api/Services/ChzzkApiClient.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Events\ChzzkSessionSource.cs` [바꿈] — `BackgroundService`로: 생성자를 레퍼런스와 같은 4개로, `ExecuteAsync`(설정 없으면 안내 로그 후 종료, 60초 점검), `SyncConnectionsAsync`, `SubscribeAsync` + SYSTEM revoked → 끊기, SYSTEM 처리기 예외 → 끊기, DONATION 처리기 try/catch, `OnDisconnected` 정리, 연결 전에 목록에 넣기·연결 실패 정리, `StopAsync` (레퍼런스와 같아짐) (레퍼런스 `server/ImageDonation.Api/Services/Events/ChzzkSessionSource.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Tests\ChzzkSessionSourceTests.cs` [바꿈] — `CreateSource()`를 레퍼런스(4개 인자)로 + `SubscribeFailure_DisconnectsSoNextCheckRetries`, `Revoked_Disconnects`, `ServerDisconnect_RemovesSocket`, `MalformedDonations_AreSkipped_SocketKeepsWorking`, `HandlerException_IsCaught_SocketKeepsWorking` (레퍼런스와 같아짐) (레퍼런스 `server/ImageDonation.Tests/ChzzkSessionSourceTests.cs`)
- 끝 상태 확인:
  - **기본 경로(치지직 승인 없이):** 서버 시작 로그에 "치지직 ClientId/ClientSecret이 없어 세션 수신기를 끕니다. 테스트 모드는 그대로 쓸 수 있어요.". 그래도 api.http의 업로드 → 코드 → `test-donation` → 대시보드 "검수 대기" → 승인 → 오버레이 흐름은 Day 27과 똑같이 동작한다.
  - **기본 경로(치지직 승인 없이):** `dotnet test` → 9개 통과(ChzzkSessionSourceTests 전체).
  - **선택 단계(승인된 치지직 앱이 있을 때만):** 치지직 연결 + 치즈 모드 → 1분 안에 로그 "스트리머 N의 치지직 세션에 연결했습니다.", 설정 화면 "세션 소켓 연결됨". 실제 치즈 후원 이벤트 수신은 실서버 미검증.
  - **선택 단계(승인된 치지직 앱이 있을 때만):** 채팅 메시지 쓰기 Scope + `ChatOnMatch=true` + 실제 치즈 후원 매칭 → 방송 채팅에 "…님의 이미지 후원(#코드)이 확인됐어요!"(실서버 미검증).
- 과제:
  - 1) api.http `test-donation`의 금액을 최소 치즈보다 1 작게, 같게, 크게 보내 결과를 표로 적는다 → 정답 요지: 작으면 그대로 치즈 대기, 같거나 크면 검수 대기(조건은 `>=`). Day 33의 경계값 테스트로 이어진다
  - 2) 채팅 안내가 실패하면 후원 매칭도 취소해야 할까? → 정답 요지: 아니요. 채팅은 "있으면 좋은 것"이고 치즈는 이미 치지직에서 결제·정산됐다. 매칭은 유지하고 실패만 기록한다
- 용어(사전 담당): `할당량`
- 자주 막히는 곳 후보:
  - ChzzkSessionSource를 `AddHostedService<ChzzkSessionSource>()`로만 등록 → 인스턴스가 두 개가 되어 IsConnected가 늘 false → 레퍼런스처럼 싱글턴 하나를 HostedService와 IDonationEventSource로 함께 씀
  - 채팅 403 → 스코프에 채팅 메시지 쓰기가 없음(선택 단계)
  - 에뮬레이터 테스트가 느리거나 시간 초과 → 처음 한 번 `npm ci`가 돎, 백신 검사
  - Windows에서 테스트가 `npm`을 못 찾음 → `ChzzkEmulator.cs`의 `cmd.exe /c` 분기 확인
- 레퍼런스 대응:
  - `C:\dev\image-donation\server\ImageDonation.Api\appsettings.json`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/appsettings.json`)와 다름: 다시 바뀜 → [Day 35](#/day/sp-d35)
  - `C:\dev\image-donation\server\ImageDonation.Api\Program.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Program.cs`)와 다름: 다시 바뀜 → [Day 35](#/day/sp-d35)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\DonationService.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Services/DonationService.cs`)와 다름: 다시 바뀜 → [Day 31](#/day/sp-d31)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\ChzzkApiClient.cs`: `reference/sp-image-donation/server/ImageDonation.Api/Services/ChzzkApiClient.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Events\ChzzkSessionSource.cs`: `reference/sp-image-donation/server/ImageDonation.Api/Services/Events/ChzzkSessionSource.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Tests\ChzzkSessionSourceTests.cs`: `reference/sp-image-donation/server/ImageDonation.Tests/ChzzkSessionSourceTests.cs` 최종(같음)

## Day 29 — 후원 페이지 화면 (110분)
- 목표:
  - `DonatePage`(최종): `getStreamer(slug)` + ignore 깃발, 404면 "없는 후원 페이지예요.", 그 밖의 오류 "후원 페이지를 불러오지 못했어요.", 불러오는 중, 제목 "<이름>에게 이미지 후원", 치즈 모드면 "이 방송은 치지직 치즈 후원과 연동돼요. 이미지를 보내면 후원 코드가 나와요. 이 사이트는 돈을 받지 않아요.", 보낸 뒤에는 결과 화면.
  - `DonationForm`(최종, 부록 B의 `DonationDraft`·`onSubmit`은 지운다): `FormData`(`image`, `nickname`, `message`) + `uploadDonation`(fetch는 업로드 진행률을 알려 주지 않으므로 `XMLHttpRequest`의 `upload.onprogress`), `<progress>`, 스트리머 `maxFileMb`로 보내기 전 크기 검사(서버도 다시 검사), 서버 오류 문장(400·413·429 ProblemDetails)을 `role="alert"`로, 보내는 중에는 버튼 잠금. hint "JPEG·PNG·WebP·GIF, NMB까지. 움직이는 GIF는 첫 장면만 보여요.".
  - `DonationResult`(최종): 무료 → "보냈어요!" + 자동 승인 여부 문장, 치즈 → "거의 다 됐어요!", 최소 치즈, 코드 크게(`aria-label="후원 코드"`), "30분 안에 후원해야 해요…", "다른 이미지 보내기".
  - `api.ts`: `PublicStreamer`, `CreateDonationResult`, `getStreamer`, `uploadDonation`. index.css: `progress`, `.result`, `.code`.
  - 휴대폰 화면: 개발자 도구 기기 모드 360px에서 가로 스크롤 없음([P1 Day 13](#/day/p1-d13)). 선택: 같은 Wi-Fi 휴대폰으로 열기 — `npm run dev -- --host` → Vite가 보여 주는 `Network:` 주소, Windows 방화벽 창은 **개인 네트워크만** 허용(공용 네트워크 허용·방화벽 끄기 금지), 업로드는 PC의 `dotnet run`으로 프록시됨.
- 이미 배운 것:
  - [Day 5](#/day/sp-d05) DonationForm·useImagePreview, [Day 14](#/day/sp-d14) 공개 API, [Day 27](#/day/sp-d27) 코드
  - 반응형·기기 모드([P1 Day 13](#/day/p1-d13)), 로딩·오류 UI([P2 Day 8](#/day/p2-d08)), ProblemDetails 문장 꺼내기([Day 5](#/day/sp-d05))
- 시작 상태:
  - [Day 28](#/day/sp-d28) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 28](#/day/sp-d28)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`, `.env.example`, `.env`, `docker-compose.yml`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `overlay.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`, `api.ts`, `donationList.ts`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`, `DonationForm.tsx`, `StreamerLayout.tsx`
  - `C:\dev\image-donation\client\src\hooks\`: `useImagePreview.ts`, `useMe.ts`, `useDashboardHub.ts`
  - `C:\dev\image-donation\client\src\overlay\`: `main.tsx`, `Overlay.tsx`, `useOverlayHub.ts`, `overlay.css`
  - `C:\dev\image-donation\client\src\pages\`: `DonatePage.tsx`, `DashboardPage.tsx`, `LoginPage.tsx`, `SettingsPage.tsx`
  - `C:\dev\image-donation\server\`: `ImageDonation.slnx`
  - `C:\dev\image-donation\server\ImageDonation.Api\`: `ImageDonation.Api.csproj`, `appsettings.json`, `appsettings.Development.json`, `Program.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\`: `AppDbContext.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\`: `DonationDtos.cs`, `AuthDtos.cs`, `SettingsDto.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\`: `PublicEndpoints.cs`, `AuthEndpoints.cs`, `DashboardEndpoints.cs`, `ChzzkEndpoints.cs`, `TestModeEndpoints.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\`: `Streamer.cs`, `StreamerSettings.cs`, `Donation.cs`, `ChzzkToken.cs`, `DonationEvent.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Hubs\`: `OverlayHub.cs`, `DashboardHub.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\`: `<시각>_InitialCreate.cs (+ .Designer.cs)`, `<시각>_AddIdentity.cs (+ .Designer.cs)`, `<시각>_AddChzzkTokens.cs (+ .Designer.cs)`, `<시각>_AddDonationEvents.cs (+ .Designer.cs)`, `AppDbContextModelSnapshot.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Properties\`: `launchSettings.json`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\`: `ImageProcessor.cs`, `RetentionService.cs`, `DonationService.cs`, `DonationCodeMatcher.cs`, `ChzzkApiClient.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Events\`: `IDonationEventSource.cs`, `FakeDonationSource.cs`, `ChzzkSessionSource.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\`: `LocalImageStorage.cs`
  - `C:\dev\image-donation\server\ImageDonation.Tests\`: `ImageDonation.Tests.csproj`, `ChzzkEmulator.cs`, `ChzzkSessionSourceTests.cs`
  - `C:\dev\image-donation\tools\chzzk-emulator\`: `package.json`, `package-lock.json`, `emulator.cjs`
  - `C:\dev\sp-practice\`: `api.http`
  - `C:\dev\sp-practice\images\`: `(폴더)`
  - 터미널 두 개, 대시보드(로그인)를 다른 창에 열어 둠.
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\client\src\index.css` [바꿈] — + `progress`, `.result`, `.code` (레퍼런스 `client/src/index.css`)
  - `C:\dev\image-donation\client\src\api.ts` [바꿈] — + `PublicStreamer`, `CreateDonationResult`, `getStreamer`, `uploadDonation`(XMLHttpRequest 진행률) (레퍼런스 `client/src/api.ts`)
  - `C:\dev\image-donation\client\src\components\DonationForm.tsx` [바꿈] — props `streamer`·`onDone`, `FormData` + `uploadDonation` 진행률, 크기 미리 검사(`tooBig`), 오류 `role="alert"` (레퍼런스와 같아짐), `DonationDraft` 타입은 지움 (레퍼런스 `client/src/components/DonationForm.tsx`)
  - `C:\dev\image-donation\client\src\components\DonationResult.tsx` [새로] — 무료: "보냈어요!"·자동 승인 문구 / 치즈: 최소 치즈 + 코드 크게 + 30분 안내 (레퍼런스 `client/src/components/DonationResult.tsx`)
  - `C:\dev\image-donation\client\src\pages\DonatePage.tsx` [바꿈] — `getStreamer` + ignore 깃발, 없는 주소·오류·불러오는 중, 치즈 모드 안내("이 사이트는 돈을 받지 않아요"), 결과 화면 전환 (레퍼런스와 같아짐) (레퍼런스 `client/src/pages/DonatePage.tsx`)
- 끝 상태 확인:
  - `http://localhost:5173/d/my-stream` → "내 방송에게 이미지 후원". 사진 선택 → 미리보기, 보내기 → 진행률 막대 → "보냈어요!"(무료) 또는 코드가 큰 글자로(치즈). 대시보드에 실시간 도착.
  - 6MB 사진(설정 5MB) → 보내기 전에 "이미지는 5MB까지 올릴 수 있어요."와 버튼 잠금. `/d/없는주소` → "없는 후원 페이지예요.".
  - 기기 모드 360px → 가로 스크롤 없음, 콘솔 오류 0.
- 과제:
  - 1) 진행률을 막대 옆에 `NN%` 글자로도 보여 준다 → 정답 요지: `{sending && <span>{progress}%</span>}` — progress는 이미 0~100 정수
  - 2) 브라우저에서 크기를 먼저 검사하는데도 서버 검사를 지우면 안 되는 이유 → 정답 요지: 누구나 API를 직접 부를 수 있다(Day 14 과제와 같은 이유). 브라우저 검사는 시청자를 기다리지 않게 하는 친절일 뿐
- 용어(사전 담당): `XMLHttpRequest`, `FormData`, `업로드 진행률`
  - P3 사전 항목에 `[[제목]]`으로 링크하되 **P3를 안 했다고 가정하고 이 Day가 처음부터 설명**(정의만 P3 담당): `[[LAN]]`, `[[사설 IP 주소]]`, `[[Windows 방화벽]]`, `[[네트워크 프로필]]`
- 자주 막히는 곳 후보:
  - `xhr.setRequestHeader('Content-Type', 'multipart/form-data')`를 직접 넣음 → 경계 문자열이 빠져 서버가 못 읽음 → FormData면 Content-Type을 넣지 않는다
  - 로컬은 너무 빨라 진행률이 바로 100% → 개발자 도구 Network의 속도 제한(예: Slow 4G)
  - 휴대폰이 접속 못 함 → 같은 Wi-Fi인지, `ipconfig`의 IPv4 주소, 방화벽 창을 닫아 버림(설정 → 개인 정보 및 보안 → Windows 보안 → 방화벽에서 node 허용 확인), 네트워크 프로필이 공용
  - 휴대폰 HEIC 사진 → 400(Day 11)
- 레퍼런스 대응:
  - `C:\dev\image-donation\client\src\index.css`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/index.css`)와 다름: 다시 바뀜 → [Day 30](#/day/sp-d30)
  - `C:\dev\image-donation\client\src\api.ts`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/api.ts`)와 다름: 다시 바뀜 → [Day 30](#/day/sp-d30)
  - `C:\dev\image-donation\client\src\components\DonationForm.tsx`: `reference/sp-image-donation/client/src/components/DonationForm.tsx` 최종(같음)
  - `C:\dev\image-donation\client\src\components\DonationResult.tsx`: `reference/sp-image-donation/client/src/components/DonationResult.tsx` 최종(같음)
  - `C:\dev\image-donation\client\src\pages\DonatePage.tsx`: `reference/sp-image-donation/client/src/pages/DonatePage.tsx` 최종(같음)

## Day 30 — 스트리머 온보딩 (110분)
- 목표:
  - 스트리머의 사용자 여정을 그린다(text): 가입 → 후원 페이지 만들기 → 시작 가이드(후원 페이지 주소 / OBS 오버레이 / 테스트 후원) → 대시보드.
  - `pages\OnboardingPage.tsx`(최종): 스트리머가 없으면 `CreateStreamerForm`(주소 `pattern="[a-z0-9\-]{3,30}"`, "시청자는 …/d/<주소> 로 들어와요" 미리 보기, 방송 이름 40자, 409 문장 표시, 성공하면 `reload()`로 내 정보 다시 불러오기), 있으면 `OnboardingGuide`(후원 페이지 링크, OBS 설정 순서: 소스 목록 **+** → **브라우저** → URL에 오버레이 주소 → 너비 1920·높이 1080, "이 주소는 비밀번호처럼 다루세요(유출되면 설정에서 재발급)", 설정·대시보드 링크로 테스트 후원 안내, 오버레이 토큰 불러오기 실패 시 `role="alert"`).
  - `StreamerLayout`(최종): 스트리머가 없으면 어느 화면이든 `/onboarding`으로(그 화면 자체는 예외), 메뉴에 "시작 가이드". `App.tsx`(최종)에 `/onboarding`. `api.ts`에 `onboard`. index.css `.steps li`.
  - Day 13에 api.http로 하던 온보딩을 이제 화면으로 한다. 새 계정으로 처음부터: 시크릿 창 가입 → 자동으로 온보딩 → 시작 가이드 → OBS에 주소 넣기 → (무료) 후원 페이지에서 업로드·승인 또는 (치즈) 테스트 모드 → OBS 표시.
  - 테스트 후원 도구(Day 28에서 옮김, 설계서 3.4 Day 30의 "테스트 후원"): `components\TestDonationPanel.tsx`(최종): 치즈 금액·후원 메시지 입력, "대기 중인 코드 넣기"(목록의 첫 치즈 대기 코드로 "이미지 부탁해요 #코드"), "가짜 치즈 후원 보내기" → `sendTestDonation` → "가짜 치즈 후원을 보냈어요. 코드와 금액이 맞으면 목록의 상태가 바뀌어요.". 패널 제목·설명에 "돈은 오가지 않아요". `DashboardPage`에 패널 + `waitingCode` + 필터 탭 "치즈 대기". index.css `.panel`, `.inline-form`.
  - 이로써 **치지직 승인 없이** 업로드 → 코드 → 가짜 치즈 후원 → 검수 대기 → 승인 → OBS 표시를 화면만으로 끝까지 할 수 있다(레퍼런스 README "처음 써 보기"와 같은 순서, e2e 테스트가 확인한 흐름).
- 이미 배운 것:
  - [Day 26](#/day/sp-d26)~[Day 28](#/day/sp-d28) 테스트 모드·코드 매칭
  - [Day 13](#/day/sp-d13) 온보딩 API, [Day 18](#/day/sp-d18) OBS 설정, [Day 19](#/day/sp-d19)~[Day 20](#/day/sp-d20), [Day 28](#/day/sp-d28)~[Day 29](#/day/sp-d29)
  - pattern 속성·폼 검증([P1 Day 24](#/day/p1-d24))
- 시작 상태:
  - [Day 29](#/day/sp-d29) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 29](#/day/sp-d29)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`, `.env.example`, `.env`, `docker-compose.yml`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `overlay.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`, `api.ts`, `donationList.ts`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`, `DonationForm.tsx`, `DonationResult.tsx`, `StreamerLayout.tsx`
  - `C:\dev\image-donation\client\src\hooks\`: `useImagePreview.ts`, `useMe.ts`, `useDashboardHub.ts`
  - `C:\dev\image-donation\client\src\overlay\`: `main.tsx`, `Overlay.tsx`, `useOverlayHub.ts`, `overlay.css`
  - `C:\dev\image-donation\client\src\pages\`: `DonatePage.tsx`, `DashboardPage.tsx`, `LoginPage.tsx`, `SettingsPage.tsx`
  - `C:\dev\image-donation\server\`: `ImageDonation.slnx`
  - `C:\dev\image-donation\server\ImageDonation.Api\`: `ImageDonation.Api.csproj`, `appsettings.json`, `appsettings.Development.json`, `Program.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\`: `AppDbContext.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\`: `DonationDtos.cs`, `AuthDtos.cs`, `SettingsDto.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\`: `PublicEndpoints.cs`, `AuthEndpoints.cs`, `DashboardEndpoints.cs`, `ChzzkEndpoints.cs`, `TestModeEndpoints.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\`: `Streamer.cs`, `StreamerSettings.cs`, `Donation.cs`, `ChzzkToken.cs`, `DonationEvent.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Hubs\`: `OverlayHub.cs`, `DashboardHub.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\`: `<시각>_InitialCreate.cs (+ .Designer.cs)`, `<시각>_AddIdentity.cs (+ .Designer.cs)`, `<시각>_AddChzzkTokens.cs (+ .Designer.cs)`, `<시각>_AddDonationEvents.cs (+ .Designer.cs)`, `AppDbContextModelSnapshot.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Properties\`: `launchSettings.json`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\`: `ImageProcessor.cs`, `RetentionService.cs`, `DonationService.cs`, `DonationCodeMatcher.cs`, `ChzzkApiClient.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Events\`: `IDonationEventSource.cs`, `FakeDonationSource.cs`, `ChzzkSessionSource.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\`: `LocalImageStorage.cs`
  - `C:\dev\image-donation\server\ImageDonation.Tests\`: `ImageDonation.Tests.csproj`, `ChzzkEmulator.cs`, `ChzzkSessionSourceTests.cs`
  - `C:\dev\image-donation\tools\chzzk-emulator\`: `package.json`, `package-lock.json`, `emulator.cjs`
  - `C:\dev\sp-practice\`: `api.http`
  - `C:\dev\sp-practice\images\`: `(폴더)`
  - 터미널 두 개, OBS, 시크릿 창(새 계정용).
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\client\src\App.tsx` [바꿈] — + `/onboarding` → OnboardingPage (StreamerLayout 안) (레퍼런스 `client/src/App.tsx`)
  - `C:\dev\image-donation\client\src\index.css` [바꿈] — + `.panel`, `.inline-form`(테스트 모드 패널), `.steps li` (레퍼런스 `client/src/index.css`)
  - `C:\dev\image-donation\client\src\api.ts` [바꿈] — + `sendTestDonation`, `onboard` (레퍼런스 `client/src/api.ts`)
  - `C:\dev\image-donation\client\src\components\StreamerLayout.tsx` [바꿈] — 스트리머가 없으면 `/onboarding`으로 보냄, + NavLink "시작 가이드" (레퍼런스와 같아짐) (레퍼런스 `client/src/components/StreamerLayout.tsx`)
  - `C:\dev\image-donation\client\src\components\TestDonationPanel.tsx` [새로] — 치즈 금액·메시지 입력, "대기 중인 코드 넣기", "가짜 치즈 후원 보내기", 결과 `role="status"` (레퍼런스 `client/src/components/TestDonationPanel.tsx`)
  - `C:\dev\image-donation\client\src\pages\DashboardPage.tsx` [바꿈] — + `<TestDonationPanel waitingCode>`, 필터 탭 "치즈 대기" (레퍼런스 `client/src/pages/DashboardPage.tsx`)
  - `C:\dev\image-donation\client\src\pages\OnboardingPage.tsx` [새로] — CreateStreamerForm(주소 pattern·이름) → reload, OnboardingGuide(후원 페이지 주소, OBS 오버레이 주소·설정 방법, 테스트 후원 안내) (레퍼런스 `client/src/pages/OnboardingPage.tsx`)
- 끝 상태 확인:
  - 시크릿 창에서 새 이메일로 가입 → 자동으로 `/onboarding` "후원 페이지 만들기". 이미 있는 주소(`my-stream`) → "이미 쓰고 있는 주소예요. 다른 주소를 골라 주세요.".
  - `my-stream2`로 만들기 → "시작 가이드" 3단계와 오버레이 주소 칸. 주소를 OBS에 넣고 테스트 후원 → OBS에 표시.
  - 온보딩 전 계정으로 `/settings`를 직접 열면 `/onboarding`으로 간다. `/`는 `/dashboard`로.
  - **기본 경로(치지직 승인 없이):** 후원 방식을 "치즈 후원 연동"으로 → 후원 페이지에서 업로드(코드 받음) → 대시보드 "치즈 대기" 탭 → 테스트 모드 패널 "대기 중인 코드 넣기" → "가짜 치즈 후원 보내기" → 카드가 "검수 대기" → `A` → OBS 표시 → 잠시 뒤 "방송 완료". 치지직 없이 전체 흐름이 화면만으로 끝난다.
- 과제:
  - 1) 시작 가이드에 "방송 설명·채팅 공지에 붙여 넣을 문구" 예시를 추가한다 → 정답 요지: 예: "이미지 후원: <후원 페이지 주소> (스트리머가 확인한 이미지만 방송에 나와요)". 오버레이 주소는 절대 공지에 넣지 않는다는 문장을 함께
  - 2) CreateStreamerForm이 성공한 뒤 `reload()`를 부르지 않으면 어떻게 되는지 → 정답 요지: 레이아웃의 me에 아직 streamer가 없어서 계속 만들기 폼이 보이거나 다시 /onboarding으로 보낸다
- 용어(사전 담당): `사용자 여정`
- 자주 막히는 곳 후보:
  - `pattern="[a-z0-9-]{3,30}"`로 쓰면 최신 브라우저의 pattern 규칙(v 플래그)에서 콘솔 오류가 날 수 있음 → 레퍼런스처럼 `\-` (작성자가 Edge에서 확인)
  - 오버레이 주소 대신 후원 페이지 주소를 OBS에 넣음 → 후원 폼이 방송에 보임
  - 시크릿 창을 닫으면 쿠키가 사라짐 → 다시 로그인
  - 온보딩 화면과 설정 화면을 오가며 무한 이동 → StreamerLayout의 `/onboarding` 예외 조건 확인
  - "대기 중인 코드 넣기" 버튼이 안 보임 → 치즈 대기 후원이 없거나 무료 모드
  - 금액 칸 0 → 400(`[Range(1, 10_000_000)]`)
- 레퍼런스 대응:
  - `C:\dev\image-donation\client\src\App.tsx`: `reference/sp-image-donation/client/src/App.tsx` 최종(같음)
  - `C:\dev\image-donation\client\src\index.css`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/index.css`)와 다름: 다시 바뀜 → [Day 31](#/day/sp-d31)
  - `C:\dev\image-donation\client\src\api.ts`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/api.ts`)와 다름: 다시 바뀜 → [Day 31](#/day/sp-d31)
  - `C:\dev\image-donation\client\src\components\StreamerLayout.tsx`: `reference/sp-image-donation/client/src/components/StreamerLayout.tsx` 최종(같음)
  - `C:\dev\image-donation\client\src\components\TestDonationPanel.tsx`: `reference/sp-image-donation/client/src/components/TestDonationPanel.tsx` 최종(같음)
  - `C:\dev\image-donation\client\src\pages\DashboardPage.tsx`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/src/pages/DashboardPage.tsx`)와 다름: 다시 바뀜 → [Day 31](#/day/sp-d31)
  - `C:\dev\image-donation\client\src\pages\OnboardingPage.tsx`: `reference/sp-image-donation/client/src/pages/OnboardingPage.tsx` 최종(같음)

## Day 31 — 안전 장치 (110분)
- 목표:
  - 차단: `Entities\BlockEntry.cs`(StreamerId, SenderIpHash, 참고용 Nickname, CreatedAt) → 업로드 때 그 스트리머의 차단 목록에 IP 해시가 있으면 403 "이 방송에는 후원할 수 없어요.". `POST /donations/{id}/block`: 차단 목록에 넣고 검수 대기면 함께 거절. 한계: IP 기준이라 같은 공유기·와이파이를 쓰는 다른 사람도 막힐 수 있고, IP를 바꾸면 피할 수 있다.
  - 신고: `Entities\Report.cs` + `POST /donations/{id}/report` 본문 `{"reason":"…"}`(1~200자, `ReportRequest`). `ReportAsync`는 **트랜잭션 하나**로 ① 조건부 전이(거절·만료가 아니면 → Rejected) ② Report 행 ③ BlockEntry. 이미지는 **지우지 않고 증거로 남긴다**(R33·R35). 7일 보관 기간이 지나면 정리 작업이 지운다. 오늘은 아직 `/media`가 후원 상태를 보지 않아 신고된 이미지 주소가 열린다 → Day 32에서 상태를 확인해 404로 격리한다(그 하루의 빈틈을 본문에 분명히 적는다). 운영자 화면은 없고 SQL로 검토한다(Day 35). 목록 DTO에 `Reported`.
  - 긴급 정지 `POST /api/dashboard/overlay/clear` → `ClearOverlayAsync`: 오버레이에 `Clear()`를 **가장 먼저** → 아직 안 나간 승인 후원을 하나씩 조건부로 Approved → Cleared(그 사이 Shown이 된 것은 그대로) + 이미지 삭제 + 대시보드 알림 → 한 건이 실패해도(DB 오류, Windows에서 다른 프로그램이 파일을 잡음) 나머지 계속·기록 → 끝에 `Clear()`를 한 번 더(정리하는 사이에 막 연결된 오버레이는 첫 Clear를 못 받았을 수 있음). Cleared라서 다시 연결해도 다시 나오지 않는다.
  - `AppDbContext`: BlockEntries·Reports → `dotnet ef migrations add AddSafety`(ImageFile 인덱스는 Day 32).
  - 화면(최종): `DonationCard`에 차단(검수 대기일 때)·신고(이미지가 남아 있을 때만 — 증거가 있어야 하므로, 방송에 나간 뒤에도 가능) 버튼, "신고됨" 배지, "증거로 보관 중 (7일 뒤 삭제)". `DashboardPage`: 차단은 `window.confirm`, 신고는 `window.prompt`(200자) → 성공 notice "신고했어요. 이미지는 운영자 확인용으로 7일 동안 보관돼요.", 빨간 "긴급 정지 (오버레이 비우기)" 버튼. `api.ts`에 `reported`, `blockSender`, `reportDonation`, `clearOverlay`. index.css `button.danger`, `.no-image`, `.status-Cleared`.
- 이미 배운 것:
  - [Day 14](#/day/sp-d14) IP 해시, [Day 17](#/day/sp-d17) 조건부 업데이트, [Day 18](#/day/sp-d18) Clear, [Day 19](#/day/sp-d19)~[Day 20](#/day/sp-d20)
  - 예외 처리([P2 Day 15](#/day/p2-d15)), 비동기 EF·SaveChanges([P2 Day 21](#/day/p2-d21)), 로그([P2 Day 24](#/day/p2-d24)), 트랜잭션(`BeginTransactionAsync`·`CommitAsync`)은 오늘 처음
- 시작 상태:
  - [Day 30](#/day/sp-d30) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 30](#/day/sp-d30)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`, `.env.example`, `.env`, `docker-compose.yml`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `overlay.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`, `api.ts`, `donationList.ts`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`, `DonationForm.tsx`, `DonationResult.tsx`, `StreamerLayout.tsx`, `TestDonationPanel.tsx`
  - `C:\dev\image-donation\client\src\hooks\`: `useImagePreview.ts`, `useMe.ts`, `useDashboardHub.ts`
  - `C:\dev\image-donation\client\src\overlay\`: `main.tsx`, `Overlay.tsx`, `useOverlayHub.ts`, `overlay.css`
  - `C:\dev\image-donation\client\src\pages\`: `DonatePage.tsx`, `DashboardPage.tsx`, `LoginPage.tsx`, `OnboardingPage.tsx`, `SettingsPage.tsx`
  - `C:\dev\image-donation\server\`: `ImageDonation.slnx`
  - `C:\dev\image-donation\server\ImageDonation.Api\`: `ImageDonation.Api.csproj`, `appsettings.json`, `appsettings.Development.json`, `Program.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\`: `AppDbContext.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\`: `DonationDtos.cs`, `AuthDtos.cs`, `SettingsDto.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\`: `PublicEndpoints.cs`, `AuthEndpoints.cs`, `DashboardEndpoints.cs`, `ChzzkEndpoints.cs`, `TestModeEndpoints.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\`: `Streamer.cs`, `StreamerSettings.cs`, `Donation.cs`, `ChzzkToken.cs`, `DonationEvent.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Hubs\`: `OverlayHub.cs`, `DashboardHub.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\`: `<시각>_InitialCreate.cs (+ .Designer.cs)`, `<시각>_AddIdentity.cs (+ .Designer.cs)`, `<시각>_AddChzzkTokens.cs (+ .Designer.cs)`, `<시각>_AddDonationEvents.cs (+ .Designer.cs)`, `AppDbContextModelSnapshot.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Properties\`: `launchSettings.json`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\`: `ImageProcessor.cs`, `RetentionService.cs`, `DonationService.cs`, `DonationCodeMatcher.cs`, `ChzzkApiClient.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Events\`: `IDonationEventSource.cs`, `FakeDonationSource.cs`, `ChzzkSessionSource.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\`: `LocalImageStorage.cs`
  - `C:\dev\image-donation\server\ImageDonation.Tests\`: `ImageDonation.Tests.csproj`, `ChzzkEmulator.cs`, `ChzzkSessionSourceTests.cs`
  - `C:\dev\image-donation\tools\chzzk-emulator\`: `package.json`, `package-lock.json`, `emulator.cjs`
  - `C:\dev\sp-practice\`: `api.http`
  - `C:\dev\sp-practice\images\`: `(폴더)`
  - 터미널 두 개, 대시보드(로그인), 오버레이 창 또는 OBS.
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\client\src\index.css` [바꿈] — + `button.danger`, `.no-image`, `.status-Cleared` (레퍼런스와 같아짐) (레퍼런스 `client/src/index.css`)
  - `C:\dev\image-donation\client\src\api.ts` [바꿈] — `Donation`에 `reported`, + `blockSender`, `reportDonation`, `clearOverlay` (레퍼런스와 같아짐) (레퍼런스 `client/src/api.ts`)
  - `C:\dev\image-donation\client\src\components\DonationCard.tsx` [바꿈] — + `onBlock`(차단), `onReport`(신고: 이미지가 있을 때만), "신고됨" 배지, "증거로 보관 중 (7일 뒤 삭제)" (레퍼런스와 같아짐) (레퍼런스 `client/src/components/DonationCard.tsx`)
  - `C:\dev\image-donation\client\src\pages\DashboardPage.tsx` [바꿈] — + 차단(confirm), 신고(prompt, 200자), 긴급 정지 버튼(`danger`) (레퍼런스와 같아짐) (레퍼런스 `client/src/pages/DashboardPage.tsx`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\AppDbContext.cs` [바꿈] — + DbSet `BlockEntries`((StreamerId, SenderIpHash) 인덱스), `Reports`(Reason 200, CreatedAt 인덱스) (레퍼런스 `server/ImageDonation.Api/Data/AppDbContext.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\BlockEntry.cs` [새로] — StreamerId, SenderIpHash, Nickname(참고용), CreatedAt (레퍼런스 `server/ImageDonation.Api/Entities/BlockEntry.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\Report.cs` [새로] — DonationId, StreamerId, Reason(200자), CreatedAt (레퍼런스 `server/ImageDonation.Api/Entities/Report.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\DonationDtos.cs` [바꿈] — + `ReportRequest`, `DonationDto.Reported` (레퍼런스와 같아짐) (레퍼런스 `server/ImageDonation.Api/Dtos/DonationDtos.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\PublicEndpoints.cs` [바꿈] — + 차단 검사(403 "이 방송에는 후원할 수 없어요.") (레퍼런스 `server/ImageDonation.Api/Endpoints/PublicEndpoints.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\DashboardEndpoints.cs` [바꿈] — + `/block`, `/report`(ReportRequest), `POST /overlay/clear`, 목록의 `reported` (레퍼런스와 같아짐) (레퍼런스 `server/ImageDonation.Api/Endpoints/DashboardEndpoints.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\DonationService.cs` [바꿈] — + `IsBlockedAsync`, `BlockSenderAsync`, `ReportAsync`(트랜잭션), `ClearOverlayAsync`(Clear 먼저 → 하나씩 Cleared → 실패 기록 → Clear 한 번 더) (레퍼런스 `server/ImageDonation.Api/Services/DonationService.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\<시각>_AddSafety.cs (+ .Designer.cs)` [새로] — `dotnet ef migrations add AddSafety` (BlockEntries, Reports)
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\AppDbContextModelSnapshot.cs` [바꿈] — dotnet-ef가 갱신 (레퍼런스 `server/ImageDonation.Api/Migrations/AppDbContextModelSnapshot.cs`)
- 끝 상태 확인:
  - 검수 대기 카드에서 **차단** → 확인 → 같은 PC에서 다음 업로드 → 403 "이 방송에는 후원할 수 없어요.". 그다음 psql `DELETE FROM "BlockEntries";`로 내 PC 차단을 푼다.
  - **신고** → 사유 입력 → 카드 "거절됨 · 신고됨"과 "증거로 보관 중 (7일 뒤 삭제)". `media` 폴더에 그 파일이 남아 있다(`/media` 주소는 아직 열림 — Day 32에서 막음). psql `SELECT * FROM "Reports";` → 1행.
  - 승인 3건이 오버레이에 줄 서 있을 때 **긴급 정지** → 오버레이가 즉시 비고 카드들이 "긴급 정지됨". 오버레이를 새로고침해도 다시 안 나온다.
- 과제:
  - 1) 신고에서 세 가지 작업을 트랜잭션으로 묶지 않으면 생길 수 있는 문제 → 정답 요지: 예: 거절은 됐는데 Report 행 저장 중 오류 → 운영자는 신고를 모르고 보낸 사람도 차단 안 됨. 트랜잭션이면 모두 되거나 모두 안 된다
  - 2) 긴급 정지에서 Clear를 맨 먼저 보내는 이유와 끝에 한 번 더 보내는 이유 → 정답 요지: 방송 사고를 막는 게 목적이라 DB·파일 작업이 실패하거나 느려도 화면부터 비운다. 정리하는 사이 새로 연결한 오버레이가 아직 Approved이던 후원을 받았을 수 있어서 마지막에 한 번 더 비운다
- 용어(사전 담당): `신고`, `차단`, `긴급 정지`
  - P3 사전 항목에 `[[제목]]`으로 링크하되 **P3를 안 했다고 가정하고 이 Day가 처음부터 설명**(정의만 P3 담당): `[[트랜잭션]]`
- 자주 막히는 곳 후보:
  - 내 PC를 차단해 연습이 막힘 → psql로 BlockEntries 지우기(위 확인 항목)
  - 신고 prompt에서 취소 → 아무 일도 없음(정상)
  - 긴급 정지 중 `IOException`(파일 잠김) 로그 → 화면은 이미 비워졌고 7일 뒤 정리됨(정상 동작)
  - 마이그레이션 빠뜨림 → `relation "BlockEntries" does not exist` 또는 PendingModelChangesWarning
- 레퍼런스 대응:
  - `C:\dev\image-donation\client\src\index.css`: `reference/sp-image-donation/client/src/index.css` 최종(같음)
  - `C:\dev\image-donation\client\src\api.ts`: `reference/sp-image-donation/client/src/api.ts` 최종(같음)
  - `C:\dev\image-donation\client\src\components\DonationCard.tsx`: `reference/sp-image-donation/client/src/components/DonationCard.tsx` 최종(같음)
  - `C:\dev\image-donation\client\src\pages\DashboardPage.tsx`: `reference/sp-image-donation/client/src/pages/DashboardPage.tsx` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\AppDbContext.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Data/AppDbContext.cs`)와 다름: 다시 바뀜 → [Day 32](#/day/sp-d32)
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\BlockEntry.cs`: `reference/sp-image-donation/server/ImageDonation.Api/Entities/BlockEntry.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\Report.cs`: `reference/sp-image-donation/server/ImageDonation.Api/Entities/Report.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\DonationDtos.cs`: `reference/sp-image-donation/server/ImageDonation.Api/Dtos/DonationDtos.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\PublicEndpoints.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Endpoints/PublicEndpoints.cs`)와 다름: 다시 바뀜 → [Day 32](#/day/sp-d32)
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\DashboardEndpoints.cs`: `reference/sp-image-donation/server/ImageDonation.Api/Endpoints/DashboardEndpoints.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\DonationService.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Services/DonationService.cs`)와 다름: 다시 바뀜 → [Day 36](#/day/sp-d36)
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\<시각>_AddSafety.cs (+ .Designer.cs)`: 레퍼런스와 이름 다름: 학습자 마이그레이션 이력(레퍼런스는 InitialCreate·SafetyReportsAndMinimalEvents 2개). 최종 스키마는 AppDbContextModelSnapshot.cs로 같음
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\AppDbContextModelSnapshot.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Migrations/AppDbContextModelSnapshot.cs`)와 다름: 다시 바뀜 → [Day 32](#/day/sp-d32)

## Day 32 — 개인정보·법적 고려 (110분)
- 목표:
  - 수집 항목 표(학습자가 psql로 직접 확인): 시청자 — 닉네임·메시지·이미지(재인코딩본)·보낸 IP의 HMAC 해시(원문 아님), 7일 뒤 삭제 / 치즈 이벤트 — 금액·받은 시각·출처·매칭 ID만(치지직 후원자 닉네임·메시지는 저장 안 함, 무료 모드 이벤트는 아예 저장 안 함) / 스트리머 — 로그인 계정, 치지직 채널 이름, 암호화된 토큰 / 차단·신고 기록은 보관 기간 정리 대상이 아님(차단은 IP 해시와 참고용 닉네임, 신고는 후원 ID·사유) → 이 보관 기간을 어떻게 정할지 스스로 결정해 적는다.
  - 저장하지 않는 것: IP 원문, 사진의 위치·기기 정보(EXIF), 원본 파일. 로그에도 닉네임·메시지 같은 개인정보를 넣지 않고 ID만(코드의 로그 문장을 확인).
  - 저작권·초상권·부적절 이미지 정책: 남의 그림·사진·얼굴이 담긴 이미지를 허락 없이 보내지 않기, 스트리머 검수·거절·신고, 운영자는 신고를 7일 안에 확인.
  - README에 "개인정보 처리방침(초안)"과 "이용약관(초안)"을 쓴다(수집 항목·목적·보관 기간·삭제 방법·문의처 / 금지 행위·책임 범위·서비스 중단). 두 초안 맨 위와 Day 본문에 `:::warn`으로 **"이 초안은 연습용이고 법률 자문을 대신하지 않아요. 실제로 공개 서비스로 운영하기 전에는 반드시 변호사 등 법률 전문가의 자문을 받아야 해요."**를 명시한다. 관련 법(예: 개인정보 보호법)이 있다는 사실만 말하고 조항·의무를 단정해서 쓰지 않는다. 미성년자 이용, 해외 이용자 같은 문제도 "자문이 필요한 질문" 목록으로 남긴다.
  - 치지직 개발자 센터 이용 약관(후원 데이터 저장·재가공 제한 등)은 작성 환경에서 확인하지 못했다 → 앱을 등록할 때 학습자가 직접 읽게 한다.
  - 신고 이미지 격리(Day 31에서 옮김, 설계서 3.4와 다른 배치 — 개인정보·증거 보관의 문제라 이 Day에서): `GET /media/{file}`이 이름 형식을 확인한 뒤 DB에서 그 파일의 후원 상태를 읽어, 보여 줄 수 있는 상태(치즈 대기·검수 대기·승인·방송 완료 = `DonationDto.ImageVisible`, Day 16)일 때만 준다 → 거절(신고 포함)·만료·긴급 정지된 후원의 이미지는 파일이 남아 있어도 누구에게나 404, DB에 없는 파일도 404. 요청마다 조회하므로 `AppDbContext`에 Donations `ImageFile` 인덱스 + `dotnet ef migrations add AddImageFileIndex`.
- 이미 배운 것:
  - [Day 16](#/day/sp-d16) `DonationDto.ImageVisible`, [Day 12](#/day/sp-d12) `/media`
  - [Day 1](#/day/sp-d01) 위험, [Day 11](#/day/sp-d11) EXIF 제거, [Day 12](#/day/sp-d12) 보관 기간, [Day 14](#/day/sp-d14) HMAC, [Day 26](#/day/sp-d26) 최소 이벤트 기록, [Day 31](#/day/sp-d31) 신고
- 시작 상태:
  - [Day 31](#/day/sp-d31) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 31](#/day/sp-d31)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`, `.env.example`, `.env`, `docker-compose.yml`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `overlay.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`, `api.ts`, `donationList.ts`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`, `DonationForm.tsx`, `DonationResult.tsx`, `StreamerLayout.tsx`, `TestDonationPanel.tsx`
  - `C:\dev\image-donation\client\src\hooks\`: `useImagePreview.ts`, `useMe.ts`, `useDashboardHub.ts`
  - `C:\dev\image-donation\client\src\overlay\`: `main.tsx`, `Overlay.tsx`, `useOverlayHub.ts`, `overlay.css`
  - `C:\dev\image-donation\client\src\pages\`: `DonatePage.tsx`, `DashboardPage.tsx`, `LoginPage.tsx`, `OnboardingPage.tsx`, `SettingsPage.tsx`
  - `C:\dev\image-donation\server\`: `ImageDonation.slnx`
  - `C:\dev\image-donation\server\ImageDonation.Api\`: `ImageDonation.Api.csproj`, `appsettings.json`, `appsettings.Development.json`, `Program.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\`: `AppDbContext.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\`: `DonationDtos.cs`, `AuthDtos.cs`, `SettingsDto.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\`: `PublicEndpoints.cs`, `AuthEndpoints.cs`, `DashboardEndpoints.cs`, `ChzzkEndpoints.cs`, `TestModeEndpoints.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\`: `Streamer.cs`, `StreamerSettings.cs`, `Donation.cs`, `ChzzkToken.cs`, `DonationEvent.cs`, `BlockEntry.cs`, `Report.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Hubs\`: `OverlayHub.cs`, `DashboardHub.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\`: `<시각>_InitialCreate.cs (+ .Designer.cs)`, `<시각>_AddIdentity.cs (+ .Designer.cs)`, `<시각>_AddChzzkTokens.cs (+ .Designer.cs)`, `<시각>_AddDonationEvents.cs (+ .Designer.cs)`, `<시각>_AddSafety.cs (+ .Designer.cs)`, `AppDbContextModelSnapshot.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Properties\`: `launchSettings.json`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\`: `ImageProcessor.cs`, `RetentionService.cs`, `DonationService.cs`, `DonationCodeMatcher.cs`, `ChzzkApiClient.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Events\`: `IDonationEventSource.cs`, `FakeDonationSource.cs`, `ChzzkSessionSource.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\`: `LocalImageStorage.cs`
  - `C:\dev\image-donation\server\ImageDonation.Tests\`: `ImageDonation.Tests.csproj`, `ChzzkEmulator.cs`, `ChzzkSessionSourceTests.cs`
  - `C:\dev\image-donation\tools\chzzk-emulator\`: `package.json`, `package-lock.json`, `emulator.cjs`
  - `C:\dev\sp-practice\`: `api.http`
  - `C:\dev\sp-practice\images\`: `(폴더)`
  - PostgreSQL 실행 중(psql 확인용).
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\README.md` [바꿈] — 개인정보 수집 항목·보관 기간, 개인정보 처리방침 초안, 이용약관 초안, "법률 자문이 필요해요" 경고 (레퍼런스 `README.md`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\AppDbContext.cs` [바꿈] — + Donations `ImageFile` 인덱스 (레퍼런스와 같아짐) (레퍼런스 `server/ImageDonation.Api/Data/AppDbContext.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\PublicEndpoints.cs` [바꿈] — `/media`는 DB에서 후원 상태를 확인해 `ImageVisible`일 때만(아니면 404) (레퍼런스 `server/ImageDonation.Api/Endpoints/PublicEndpoints.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\<시각>_AddImageFileIndex.cs (+ .Designer.cs)` [새로] — `dotnet ef migrations add AddImageFileIndex` (IX_Donations_ImageFile)
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\AppDbContextModelSnapshot.cs` [바꿈] — dotnet-ef가 갱신 (레퍼런스 `server/ImageDonation.Api/Migrations/AppDbContextModelSnapshot.cs`)
- 끝 상태 확인:
  - README 미리보기에 수집 항목 표, "개인정보 처리방침(초안)", "이용약관(초안)", 그리고 "법률 자문을 대신하지 않아요… 법률 전문가의 자문을 받아야 해요" 경고가 보인다.
  - psql `\d "Donations"`·`\d "DonationEvents"` → IP 원문·후원자 닉네임·후원 메시지를 담는 열이 없다(Donations의 Nickname·Message는 시청자가 우리 후원 페이지에 쓴 것).
  - Day 31에 신고한 이미지의 `/media/…` 주소 → 404, 그런데 `server\ImageDonation.Api\media` 폴더에는 그 파일이 있다(증거 보관). 검수 대기·승인된 후원의 이미지는 그대로 보인다.
- 과제:
  - 1) 보관 기간을 3일로 줄이려면 무엇을 바꿔야 하는지(코드·문서·테스트) → 정답 요지: `RetentionService.KeepFor`, 처리방침 초안의 문구, 보관 기간 테스트(Day 34 RetentionTests)와 신고 확인 기한 안내. 실제로 바꾸지는 않는다(레퍼런스는 7일)
  - 2) 법률 전문가에게 물어볼 질문 5개를 쓴다 → 정답 요지: 예: 닉네임·메시지·이미지가 개인정보인지와 동의 방법, 보관 기간, 미성년자 이용, 신고 이미지 보관 근거, 해외 이용자. 답은 교재가 주지 않는다(자문 필요)
- 용어(사전 담당): `개인정보`, `최소 수집`, `개인정보 처리방침`, `이용약관`, `초상권`
- 자주 막히는 곳 후보:
  - "초안이 있으니 그대로 공개해도 되겠지" → 아니요, 법률 자문 필요(위 경고)
  - 스크린샷·리허설 영상에 시청자 닉네임·이미지가 그대로 → 가리고 공유
  - 로그에 메시지를 찍는 디버그 코드를 남김 → 지운다
  - 마이그레이션을 빠뜨림 → PendingModelChangesWarning
  - 모든 이미지가 404 → 상태 조건을 거꾸로 씀(`ImageVisible`이 true일 때만 준다)
- 레퍼런스 대응:
  - `C:\dev\image-donation\README.md`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/README.md`)와 다름: 다시 바뀜 → [Day 35](#/day/sp-d35)
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\AppDbContext.cs`: `reference/sp-image-donation/server/ImageDonation.Api/Data/AppDbContext.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\PublicEndpoints.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Endpoints/PublicEndpoints.cs`)와 다름: 다시 바뀜 → [Day 33](#/day/sp-d33)
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\<시각>_AddImageFileIndex.cs (+ .Designer.cs)`: 레퍼런스와 이름 다름: 학습자 마이그레이션 이력(레퍼런스는 InitialCreate·SafetyReportsAndMinimalEvents 2개). 최종 스키마는 AppDbContextModelSnapshot.cs로 같음
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\AppDbContextModelSnapshot.cs`: `reference/sp-image-donation/server/ImageDonation.Api/Migrations/AppDbContextModelSnapshot.cs` 최종(같음) — dotnet-ef가 만든다. Day 32 이후 모델은 레퍼런스와 같은 스키마

## Day 33 — 단위 테스트 (120분)
- 목표:
  - 금지어 거르기(Day 31에서 옮김, 설계서 3.4와 다른 배치): 테스트를 먼저 쓴다 — `BannedWordFilterTests.cs`의 `BannedWords_Rejects`를 쓰고 빨간 실패를 본 뒤 `Services\BannedWordFilter.cs`를 만든다. 그다음 `PublicEndpoints`에서 닉네임+메시지를 검사: (`FindBannedWord`: trim, 빈 단어 무시, 대소문자 무시 포함 검사) 걸리면 400 "사용할 수 없는 단어가 들어 있어요.".
  - 무엇을 단위 테스트하나: DB·네트워크 없이 입력 → 출력이 정해진 규칙(코드 매처, 이미지 처리기, 금지어). Day 25에 만든 테스트 프로젝트에 추가한다.
  - `DonationCodeMatcherTests.cs`(레퍼런스): 코드 형식, 대소문자 무시, `#AB123` 무시, 최소 치즈 미만 무시, 30분 지난 코드 무시, 이미 매칭된 후원 다시 안 맞춤. 경계값(999·1000·1001, 30분 ± 1초)을 설명한다.
  - `TestImages.cs`(레퍼런스): 테스트 이미지를 파일로 두지 않고 코드로 만든다 — SkiaSharp으로 PNG·JPEG, EXIF(APP1) 조각을 바이트로 끼운 JPEG(Orientation 6), 머리글에만 큰 크기를 적은 PNG, 코드에 바이트로 적어 둔 113바이트 3장면 GIF(SkiaSharp은 GIF를 저장하지 못함).
  - `ImageProcessorTests.cs`(레퍼런스): 이름만 바꾼 글자 파일 거절, 4형식 매직 넘버 통과, 가짜 머리글 + 쓰레기 거절, EXIF 제거·리사이즈(`Exif`·`ICCP` 글자가 결과에 없음), EXIF 방향 6 적용, 움직이는 GIF 첫 장면만, 해상도 상한, 큰 JPEG 축소 디코딩, 작은 이미지는 키우지 않음. `BannedWordFilterTests.cs`.
  - "테스트가 진짜 지키는지" 확인: `FindMatch`의 `<`를 `<=`로 바꿔 보거나 `>=`를 `>`로 바꿔 테스트가 실패하는 것을 보고 되돌린다.
- 이미 배운 것:
  - [Day 11](#/day/sp-d11) 이미지 처리, [Day 25](#/day/sp-d25) 테스트 프로젝트, [Day 27](#/day/sp-d27) 매칭, [Day 20](#/day/sp-d20) 금지어 저장
  - xUnit·Fact·Theory·Assert·AAA 패턴([P2 Day 35](#/day/p2-d35))
- 시작 상태:
  - [Day 32](#/day/sp-d32) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 32](#/day/sp-d32)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`, `.env.example`, `.env`, `docker-compose.yml`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `overlay.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`, `api.ts`, `donationList.ts`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`, `DonationForm.tsx`, `DonationResult.tsx`, `StreamerLayout.tsx`, `TestDonationPanel.tsx`
  - `C:\dev\image-donation\client\src\hooks\`: `useImagePreview.ts`, `useMe.ts`, `useDashboardHub.ts`
  - `C:\dev\image-donation\client\src\overlay\`: `main.tsx`, `Overlay.tsx`, `useOverlayHub.ts`, `overlay.css`
  - `C:\dev\image-donation\client\src\pages\`: `DonatePage.tsx`, `DashboardPage.tsx`, `LoginPage.tsx`, `OnboardingPage.tsx`, `SettingsPage.tsx`
  - `C:\dev\image-donation\server\`: `ImageDonation.slnx`
  - `C:\dev\image-donation\server\ImageDonation.Api\`: `ImageDonation.Api.csproj`, `appsettings.json`, `appsettings.Development.json`, `Program.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\`: `AppDbContext.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\`: `DonationDtos.cs`, `AuthDtos.cs`, `SettingsDto.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\`: `PublicEndpoints.cs`, `AuthEndpoints.cs`, `DashboardEndpoints.cs`, `ChzzkEndpoints.cs`, `TestModeEndpoints.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\`: `Streamer.cs`, `StreamerSettings.cs`, `Donation.cs`, `ChzzkToken.cs`, `DonationEvent.cs`, `BlockEntry.cs`, `Report.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Hubs\`: `OverlayHub.cs`, `DashboardHub.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\`: `<시각>_InitialCreate.cs (+ .Designer.cs)`, `<시각>_AddIdentity.cs (+ .Designer.cs)`, `<시각>_AddChzzkTokens.cs (+ .Designer.cs)`, `<시각>_AddDonationEvents.cs (+ .Designer.cs)`, `<시각>_AddSafety.cs (+ .Designer.cs)`, `<시각>_AddImageFileIndex.cs (+ .Designer.cs)`, `AppDbContextModelSnapshot.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Properties\`: `launchSettings.json`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\`: `ImageProcessor.cs`, `RetentionService.cs`, `DonationService.cs`, `DonationCodeMatcher.cs`, `ChzzkApiClient.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Events\`: `IDonationEventSource.cs`, `FakeDonationSource.cs`, `ChzzkSessionSource.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\`: `LocalImageStorage.cs`
  - `C:\dev\image-donation\server\ImageDonation.Tests\`: `ImageDonation.Tests.csproj`, `ChzzkEmulator.cs`, `ChzzkSessionSourceTests.cs`
  - `C:\dev\image-donation\tools\chzzk-emulator\`: `package.json`, `package-lock.json`, `emulator.cjs`
  - `C:\dev\sp-practice\`: `api.http`
  - `C:\dev\sp-practice\images\`: `(폴더)`
  - `dotnet test`가 9개 통과하는 상태(Day 28).
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\PublicEndpoints.cs` [바꿈] — + 금지어 검사(400 "사용할 수 없는 단어가 들어 있어요.") (레퍼런스 `server/ImageDonation.Api/Endpoints/PublicEndpoints.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\BannedWordFilter.cs` [새로] — `FindBannedWord`(trim, 빈 단어 무시, OrdinalIgnoreCase 포함 검사) (레퍼런스 `server/ImageDonation.Api/Services/BannedWordFilter.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Tests\DonationCodeMatcherTests.cs` [새로] — 코드 형식, 대소문자, 긴 토큰 무시, 최소 치즈, 만료, 이중 매칭 방지 (레퍼런스 `server/ImageDonation.Tests/DonationCodeMatcherTests.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Tests\ImageProcessorTests.cs` [새로] — 매직 넘버 2개, 가짜 머리글, EXIF 제거·리사이즈, EXIF 방향, GIF 첫 장면, 해상도 상한, 큰 JPEG 축소 디코딩, 작은 이미지 유지 (레퍼런스 `server/ImageDonation.Tests/ImageProcessorTests.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Tests\TestImages.cs` [새로] — 코드로 만드는 테스트 이미지(SkiaSharp PNG·JPEG, EXIF APP1 끼우기, 머리글만 큰 PNG, 113바이트 3장면 GIF) (레퍼런스 `server/ImageDonation.Tests/TestImages.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Tests\BannedWordFilterTests.cs` [새로] — `BannedWords_Rejects` — 필터보다 먼저 쓴다 (레퍼런스 `server/ImageDonation.Tests/BannedWordFilterTests.cs`)
- 끝 상태 확인:
  - `cd C:\dev\image-donation\server` → `dotnet test` → 실패 0. 개수는 작성자가 실행해 적는다(레퍼런스 기준 오늘 추가분: 매처 6, 이미지 9, 금지어 1).
  - 매처의 비교 연산자를 바꾸면 해당 테스트가 빨간 Failed로 바뀌고, 되돌리면 다시 통과.
  - 설정 금지어에 `광고` → 메시지에 `광고` 넣은 업로드 → 400 "사용할 수 없는 단어가 들어 있어요.". 금지어가 없는 메시지는 그대로 들어간다.
- 과제:
  - 1) "정확히 최소 금액이면 매칭된다" 테스트를 직접 하나 쓴다 → 정답 요지: PayAmount = minCheese인 이벤트로 FindMatch가 그 후원을 돌려주는지 `Assert.Equal`. 레퍼런스의 미만 테스트와 짝을 이룬다
  - 2) 금지어에 빈 문자열이 있어도 모든 글이 걸리지 않는지 확인하는 테스트를 쓴다 → 정답 요지: `FindBannedWord("안녕", ["", "  "])`가 null. 빈 금지어는 무시한다는 규칙
- 용어(사전 담당): `경계값`
  - 앞 프로젝트(P1·P2)에서 배운 용어, 다시 짚을 때 `[[제목]]`으로 링크: `[[단위 테스트]]`, `[[xUnit]]`, `[[Assert]]`
- 자주 막히는 곳 후보:
  - 테스트가 발견되지 않음(`No test is available`) → 클래스·메서드가 public인지, `[Fact]`
  - Windows에서 SkiaSharp 테스트가 네이티브 로드 오류 → Day 11과 같은 확인(레퍼런스는 Windows 실행 미확인)
  - 실패 메시지 `Assert.Equal() Failure` 아래의 Expected/Actual을 읽는 법
  - 테스트 이름은 영어(레퍼런스 그대로), 설명은 주석으로
  - 금지어를 `a`처럼 짧게 넣어 거의 모든 메시지가 거절됨 → 포함 검사라는 점
- 레퍼런스 대응:
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\PublicEndpoints.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Endpoints/PublicEndpoints.cs`)와 다름: 다시 바뀜 → [Day 36](#/day/sp-d36)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\BannedWordFilter.cs`: `reference/sp-image-donation/server/ImageDonation.Api/Services/BannedWordFilter.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Tests\DonationCodeMatcherTests.cs`: `reference/sp-image-donation/server/ImageDonation.Tests/DonationCodeMatcherTests.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Tests\ImageProcessorTests.cs`: `reference/sp-image-donation/server/ImageDonation.Tests/ImageProcessorTests.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Tests\TestImages.cs`: `reference/sp-image-donation/server/ImageDonation.Tests/TestImages.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Tests\BannedWordFilterTests.cs`: `reference/sp-image-donation/server/ImageDonation.Tests/BannedWordFilterTests.cs` 최종(같음)

## Day 34 — 통합·프론트 테스트 (115분)
- 목표:
  - `ImageDonation.Tests.csproj`에 `Microsoft.AspNetCore.Mvc.Testing`·`Microsoft.AspNetCore.SignalR.Client` 10.0.14. `ApiFactory.cs`(replaceServices 없이, Day 36에 추가): 진짜 `Program`을 메모리에서 실행, DB는 `TEST_DATABASE_URL`의 PostgreSQL에 **테스트마다 새 스키마**(`Search Path`)를 만들어 마이그레이션 적용·끝나면 `DROP SCHEMA … CASCADE`, 임시 MediaPath, 설정 덮어쓰기(IP 키·요청 제한·정리 간격), `CreateStreamerClientAsync`(가입·로그인·온보딩한 쿠키 클라이언트), `DonationForm`, 오버레이 연결(TestServer 안의 웹소켓), `StartOverlayAsync`(SignalR은 연결 응답을 먼저 보내고 그룹 가입을 나중에 하므로 아무 일 없는 `MarkShown(0)`으로 기다리는 요령).
  - 준비: 테스트 DB 만들기 — Docker `docker compose exec db psql -U imagedonation -d image_donation -c "CREATE DATABASE image_donation_test;"`, Docker 없는 경로는 psql.exe로 같은 SQL. `TEST_DATABASE_URL`을 내 값으로: `[Environment]::SetEnvironmentVariable("TEST_DATABASE_URL", "Host=127.0.0.1;Port=5432;Database=image_donation_test;Username=imagedonation;Password=<값>", "User")` 후 터미널 새로 열기. **Docker 없는 경로**(직접 설치한 PostgreSQL): `[Environment]::SetEnvironmentVariable("TEST_DATABASE_URL", "Host=localhost;Port=5432;Database=image_donation_test;Username=postgres;Password=<설치 때 정한 비밀번호>", "User")`. **레퍼런스 ApiFactory의 기본값(`Username=wzh;Password=wzh`)은 교재 작성 환경의 값**이라 학습자 PC에서는 맞지 않는다고 분명히 적는다.
  - 테스트가 많으므로 2~3개(예: `PublicDonation_FreeMode_CreatesPending`, `Approve_SendsShowDonation_ToOverlayGroup`)는 따라 쓰며 설명하고, 나머지 파일(`PublicDonationTests`, `OverlayHubTests`(파일 삭제 실패 테스트 제외), `SafetyTests`, `SettingsTests`, `TestModeTests`, `RetentionTests`)은 "오늘 끝 상태 전체 코드"를 붙여 넣고 테스트 이름을 읽어 무엇을 지키는지 표로 정리한다. (치지직 토큰 테스트는 테스트 대역을 배우는 Day 36.)
  - 프론트: `npm i -D vitest@5.0.5 @testing-library/react@16.3.3 @testing-library/dom@10.4.2 @testing-library/jest-dom@7.0.1 @testing-library/user-event@14.6.8 jsdom@30.1.3`, 스크립트 `"test": "vitest run"`, `vite.config.ts`의 `test` 블록과 `/// <reference types="vitest/config" />`, `src\test\setup.ts`, `DashboardPage.test.tsx`(`vi.mock`으로 API와 대시보드 허브를 가짜로, 승인 버튼, `<b>`가 글자로), `DonatePage.test.tsx`(MemoryRouter).
- 이미 배운 것:
  - [Day 7](#/day/sp-d07) psql, [Day 16](#/day/sp-d16)~[Day 19](#/day/sp-d19), [Day 33](#/day/sp-d33)
  - WebApplicationFactory 통합 테스트·`tsc --noEmit`([P2 Day 36](#/day/p2-d36)), 환경 변수([P2 Day 3](#/day/p2-d03)·[P2 Day 39](#/day/p2-d39))
- 시작 상태:
  - [Day 33](#/day/sp-d33) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 33](#/day/sp-d33)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`, `.env.example`, `.env`, `docker-compose.yml`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `overlay.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`, `api.ts`, `donationList.ts`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`, `DonationForm.tsx`, `DonationResult.tsx`, `StreamerLayout.tsx`, `TestDonationPanel.tsx`
  - `C:\dev\image-donation\client\src\hooks\`: `useImagePreview.ts`, `useMe.ts`, `useDashboardHub.ts`
  - `C:\dev\image-donation\client\src\overlay\`: `main.tsx`, `Overlay.tsx`, `useOverlayHub.ts`, `overlay.css`
  - `C:\dev\image-donation\client\src\pages\`: `DonatePage.tsx`, `DashboardPage.tsx`, `LoginPage.tsx`, `OnboardingPage.tsx`, `SettingsPage.tsx`
  - `C:\dev\image-donation\server\`: `ImageDonation.slnx`
  - `C:\dev\image-donation\server\ImageDonation.Api\`: `ImageDonation.Api.csproj`, `appsettings.json`, `appsettings.Development.json`, `Program.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\`: `AppDbContext.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\`: `DonationDtos.cs`, `AuthDtos.cs`, `SettingsDto.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\`: `PublicEndpoints.cs`, `AuthEndpoints.cs`, `DashboardEndpoints.cs`, `ChzzkEndpoints.cs`, `TestModeEndpoints.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\`: `Streamer.cs`, `StreamerSettings.cs`, `Donation.cs`, `ChzzkToken.cs`, `DonationEvent.cs`, `BlockEntry.cs`, `Report.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Hubs\`: `OverlayHub.cs`, `DashboardHub.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\`: `<시각>_InitialCreate.cs (+ .Designer.cs)`, `<시각>_AddIdentity.cs (+ .Designer.cs)`, `<시각>_AddChzzkTokens.cs (+ .Designer.cs)`, `<시각>_AddDonationEvents.cs (+ .Designer.cs)`, `<시각>_AddSafety.cs (+ .Designer.cs)`, `<시각>_AddImageFileIndex.cs (+ .Designer.cs)`, `AppDbContextModelSnapshot.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Properties\`: `launchSettings.json`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\`: `ImageProcessor.cs`, `RetentionService.cs`, `DonationService.cs`, `DonationCodeMatcher.cs`, `BannedWordFilter.cs`, `ChzzkApiClient.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Events\`: `IDonationEventSource.cs`, `FakeDonationSource.cs`, `ChzzkSessionSource.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\`: `LocalImageStorage.cs`
  - `C:\dev\image-donation\server\ImageDonation.Tests\`: `ImageDonation.Tests.csproj`, `ChzzkEmulator.cs`, `ChzzkSessionSourceTests.cs`, `DonationCodeMatcherTests.cs`, `ImageProcessorTests.cs`, `TestImages.cs`, `BannedWordFilterTests.cs`
  - `C:\dev\image-donation\tools\chzzk-emulator\`: `package.json`, `package-lock.json`, `emulator.cjs`
  - `C:\dev\sp-practice\`: `api.http`
  - `C:\dev\sp-practice\images\`: `(폴더)`
  - PostgreSQL 실행 중, `dotnet test` 통과 상태(Day 33).
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\client\package.json` [바꿈] — + 스크립트 `"test": "vitest run"`, devDependencies vitest 5.0.5, @testing-library/react 16.3.3·dom 10.4.2·jest-dom 7.0.1·user-event 14.6.8, jsdom 30.1.3 (레퍼런스 `client/package.json`)
  - `C:\dev\image-donation\client\package-lock.json` [바꿈] — npm이 갱신 (레퍼런스 `client/package-lock.json`)
  - `C:\dev\image-donation\client\vite.config.ts` [바꿈] — + `/// <reference types="vitest/config" />`, `test: { environment: "jsdom", setupFiles: "./src/test/setup.ts" }` (레퍼런스 `client/vite.config.ts`)
  - `C:\dev\image-donation\client\src\pages\DashboardPage.test.tsx` [새로] — vi.mock(api, useDashboardHub), 승인 버튼 → approveDonation(42) + "승인됨", 메시지 `<b>`가 글자로 보임 등 (레퍼런스 `client/src/pages/DashboardPage.test.tsx`)
  - `C:\dev\image-donation\client\src\pages\DonatePage.test.tsx` [새로] — MemoryRouter `/d/:slug`, 스트리머 불러오기·업로드·결과 화면 (레퍼런스 `client/src/pages/DonatePage.test.tsx`)
  - `C:\dev\image-donation\client\src\test\setup.ts` [새로] — `@testing-library/jest-dom/vitest`, afterEach cleanup (레퍼런스 `client/src/test/setup.ts`)
  - `C:\dev\image-donation\server\ImageDonation.Tests\ImageDonation.Tests.csproj` [바꿈] — + Microsoft.AspNetCore.Mvc.Testing 10.0.14, Microsoft.AspNetCore.SignalR.Client 10.0.14 (레퍼런스와 같아짐) (레퍼런스 `server/ImageDonation.Tests/ImageDonation.Tests.csproj`)
  - `C:\dev\image-donation\server\ImageDonation.Tests\ApiFactory.cs` [새로] — WebApplicationFactory<Program>, `TEST_DATABASE_URL`, 테스트마다 새 스키마(Search Path)·끝나면 DROP SCHEMA, 임시 MediaPath, 설정 덮어쓰기, `CreateStreamerClientAsync`, `DonationForm`, 오버레이 연결(TestServer 웹소켓), `StartOverlayAsync` (replaceServices 없이) (레퍼런스 `server/ImageDonation.Tests/ApiFactory.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Tests\PublicDonationTests.cs` [새로] — 무료 후원 Pending, 비이미지·금지어 400, 413, 429 (레퍼런스 `server/ImageDonation.Tests/PublicDonationTests.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Tests\OverlayHubTests.cs` [새로] — 승인 → 오버레이 그룹, 늦은 연결 백로그, 긴급 정지 Cleared·재연결 안 나옴, 다른 스트리머 오버레이 분리, 재발급(옛 연결 MarkShown에서 끊김·더 못 받음), 틀린 토큰 401 (파일 삭제 실패 테스트는 Day 36) (레퍼런스 `server/ImageDonation.Tests/OverlayHubTests.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Tests\SafetyTests.cs` [새로] — 거절 시 이미지 삭제, 차단 후 403, 신고(기록·거절·차단), 신고 이미지 증거 보관 → 7일 뒤 삭제, 사유 검증, 다른 스트리머 후원 404 (레퍼런스 `server/ImageDonation.Tests/SafetyTests.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Tests\SettingsTests.cs` [새로] — 범위 밖 400, null 금지어 400 (레퍼런스 `server/ImageDonation.Tests/SettingsTests.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Tests\TestModeTests.cs` [새로] — 테스트 후원 매칭, 이벤트 최소 저장, 로그인 필요 (레퍼런스 `server/ImageDonation.Tests/TestModeTests.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Tests\RetentionTests.cs` [새로] — 오래된 파일 삭제, 30분 만료, 그 사이 매칭된 후원은 만료하지 않음 (레퍼런스 `server/ImageDonation.Tests/RetentionTests.cs`)
- 끝 상태 확인:
  - 새 터미널에서 `cd C:\dev\image-donation\server` → `dotnet test` → 실패 0(레퍼런스 54개 중 Day 36에 추가할 4개를 뺀 50개 — 작성자가 실행해 정확한 수를 적는다).
  - `cd C:\dev\image-donation\client` → `npx tsc -b` 오류 0, `npm test` → 화면 테스트 8개 통과, `npm run lint` 경고 0.
  - psql로 테스트 DB를 보면 `test_…` 스키마가 남아 있지 않다(끝나면 지워짐).
- 과제:
  - 1) `OtherStreamersDonation_Is404`를 읽고 무엇을 확인하는지, 왜 403이 아니라 404인지 쓴다 → 정답 요지: 다른 스트리머의 후원을 승인하려 하면 404. 403이면 "그 id가 존재한다"는 정보를 알려 주게 된다(존재 여부도 숨김)
  - 2) DonatePage 테스트에 "없는 주소면 '없는 후원 페이지예요.'" 경우를 추가한다 → 정답 요지: `getStreamer`를 `vi.mocked(...).mockRejectedValue(new ApiError(404, '…'))`로 만들고 `findByRole('alert')`의 글자를 확인
- 용어(사전 담당): `Vitest`, `Testing Library`, `jsdom`, `모킹`, `테스트 스키마`
  - 앞 프로젝트(P1·P2)에서 배운 용어, 다시 짚을 때 `[[제목]]`으로 링크: `[[통합 테스트]]`, `[[WebApplicationFactory]]`, `[[환경 변수]]`
- 자주 막히는 곳 후보:
  - `28P01: password authentication failed for user "wzh"` → TEST_DATABASE_URL을 설정하지 않았거나 터미널을 다시 열지 않음
  - `3D000: database "image_donation_test" does not exist` → CREATE DATABASE
  - 환경 변수를 `$env:`로만 설정 → 그 터미널에서만 유지(VS Code 테스트 탐색기에는 안 보일 수 있음)
  - DB 컨테이너가 꺼짐 → `docker compose up -d`
  - `vi.mock` 경로가 테스트 파일 기준이 아님 → `'../api'`
  - 테스트가 오래 걸림(SkiaSharp·에뮬레이터·DB) → 정상, 실패한 것만 다시: `dotnet test --filter "FullyQualifiedName~SafetyTests"`
- 레퍼런스 대응:
  - `C:\dev\image-donation\client\package.json`: `reference/sp-image-donation/client/package.json` 최종(같음)
  - `C:\dev\image-donation\client\package-lock.json`: `reference/sp-image-donation/client/package-lock.json` 최종(같음) — npm이 만든다(버전 해석 결과는 설치 시점에 따라 조금 다를 수 있음)
  - `C:\dev\image-donation\client\vite.config.ts`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/client/vite.config.ts`)와 다름: 다시 바뀜 → [Day 37](#/day/sp-d37)
  - `C:\dev\image-donation\client\src\pages\DashboardPage.test.tsx`: `reference/sp-image-donation/client/src/pages/DashboardPage.test.tsx` 최종(같음)
  - `C:\dev\image-donation\client\src\pages\DonatePage.test.tsx`: `reference/sp-image-donation/client/src/pages/DonatePage.test.tsx` 최종(같음)
  - `C:\dev\image-donation\client\src\test\setup.ts`: `reference/sp-image-donation/client/src/test/setup.ts` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Tests\ImageDonation.Tests.csproj`: `reference/sp-image-donation/server/ImageDonation.Tests/ImageDonation.Tests.csproj` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Tests\ApiFactory.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Tests/ApiFactory.cs`)와 다름: 다시 바뀜 → [Day 36](#/day/sp-d36)
  - `C:\dev\image-donation\server\ImageDonation.Tests\PublicDonationTests.cs`: `reference/sp-image-donation/server/ImageDonation.Tests/PublicDonationTests.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Tests\OverlayHubTests.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Tests/OverlayHubTests.cs`)와 다름: 다시 바뀜 → [Day 36](#/day/sp-d36)
  - `C:\dev\image-donation\server\ImageDonation.Tests\SafetyTests.cs`: `reference/sp-image-donation/server/ImageDonation.Tests/SafetyTests.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Tests\SettingsTests.cs`: `reference/sp-image-donation/server/ImageDonation.Tests/SettingsTests.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Tests\TestModeTests.cs`: `reference/sp-image-donation/server/ImageDonation.Tests/TestModeTests.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Tests\RetentionTests.cs`: `reference/sp-image-donation/server/ImageDonation.Tests/RetentionTests.cs` 최종(같음)

## Day 35 — 관측성 (95분)
- 목표:
  - 구조화 로깅: 지금까지 쓴 로그(`"정리 완료: {Result}"`, `"긴급 정지 중 후원 {DonationId} 정리 실패"`, `"스트리머 {StreamerId}의 치지직 세션에 연결했습니다."`)를 다시 보며 문장 안에 값을 이어 붙이지 않고 이름 붙은 자리(`{DonationId}`)를 쓰는 이유, 수준(Information·Warning·Error) 고르는 법, 개인정보(닉네임·메시지·토큰)를 로그에 넣지 않는 규칙.
  - `appsettings.json`(최종): `"Microsoft.EntityFrameworkCore.Database.Command": "Warning"` → 실행한 SQL이 터미널을 덮지 않게(P2와 비교).
  - 헬스 체크: `AddHealthChecks()` + `MapHealthChecks("/healthz")` → `Healthy`. 이 체크는 앱이 응답하는지만 보고 DB까지는 확인하지 않는다(레퍼런스 그대로, 확장은 "더 알아보기").
  - 운영자 확인(관리자 화면은 아직 없음): README에 "신고 확인 (서비스 운영자)" 절 — 레퍼런스 README의 신고 조회 SQL(Reports ⋈ Streamers ⟕ Donations), 신고된 이미지는 `/media`로 열리지 않으니 `server\ImageDonation.Api\media`(Docker는 `appdata` 볼륨의 `/data/media`)에서 `ImageFile` 이름으로 직접 연다, **7일 보관 기간 안에** 확인해야 한다. 통계 SQL: 상태별 후원 수(`GROUP BY "Status"`), 오늘(한국 날짜) 받은 후원 수, 스트리머별 후원 수.
  - 오늘 처음(SQL): 집계 `count(*)`와 `GROUP BY`, 표 잇기 `JOIN … ON`과 `LEFT JOIN`(신고 조회 쿼리를 한 절씩 읽으며: 신고는 꼭 스트리머가 있으니 JOIN, 후원 행은 7일 뒤 지워질 수 있으니 LEFT JOIN). P2는 EF Core `Include`로 관계를 읽었고 SQL 조인은 여기서 처음 쓴다.
- 이미 배운 것:
  - [Day 12](#/day/sp-d12) 정리 로그, [Day 31](#/day/sp-d31) 신고, [Day 7](#/day/sp-d07) psql
  - ILogger·로그 수준·appsettings([P2 Day 24](#/day/p2-d24)), SQL SELECT·WHERE·ORDER BY([P2 Day 19](#/day/p2-d19)), 표 사이 관계·외래 키([P2 Day 22](#/day/p2-d22)), UTC ↔ 한국 날짜([P2 Day 29](#/day/p2-d29))
- 시작 상태:
  - [Day 34](#/day/sp-d34) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 34](#/day/sp-d34)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`, `.env.example`, `.env`, `docker-compose.yml`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `overlay.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`, `api.ts`, `donationList.ts`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`, `DonationForm.tsx`, `DonationResult.tsx`, `StreamerLayout.tsx`, `TestDonationPanel.tsx`
  - `C:\dev\image-donation\client\src\hooks\`: `useImagePreview.ts`, `useMe.ts`, `useDashboardHub.ts`
  - `C:\dev\image-donation\client\src\overlay\`: `main.tsx`, `Overlay.tsx`, `useOverlayHub.ts`, `overlay.css`
  - `C:\dev\image-donation\client\src\pages\`: `DonatePage.tsx`, `DashboardPage.tsx`, `LoginPage.tsx`, `OnboardingPage.tsx`, `SettingsPage.tsx`, `DashboardPage.test.tsx`, `DonatePage.test.tsx`
  - `C:\dev\image-donation\client\src\test\`: `setup.ts`
  - `C:\dev\image-donation\server\`: `ImageDonation.slnx`
  - `C:\dev\image-donation\server\ImageDonation.Api\`: `ImageDonation.Api.csproj`, `appsettings.json`, `appsettings.Development.json`, `Program.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\`: `AppDbContext.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\`: `DonationDtos.cs`, `AuthDtos.cs`, `SettingsDto.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\`: `PublicEndpoints.cs`, `AuthEndpoints.cs`, `DashboardEndpoints.cs`, `ChzzkEndpoints.cs`, `TestModeEndpoints.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\`: `Streamer.cs`, `StreamerSettings.cs`, `Donation.cs`, `ChzzkToken.cs`, `DonationEvent.cs`, `BlockEntry.cs`, `Report.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Hubs\`: `OverlayHub.cs`, `DashboardHub.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\`: `<시각>_InitialCreate.cs (+ .Designer.cs)`, `<시각>_AddIdentity.cs (+ .Designer.cs)`, `<시각>_AddChzzkTokens.cs (+ .Designer.cs)`, `<시각>_AddDonationEvents.cs (+ .Designer.cs)`, `<시각>_AddSafety.cs (+ .Designer.cs)`, `<시각>_AddImageFileIndex.cs (+ .Designer.cs)`, `AppDbContextModelSnapshot.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Properties\`: `launchSettings.json`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\`: `ImageProcessor.cs`, `RetentionService.cs`, `DonationService.cs`, `DonationCodeMatcher.cs`, `BannedWordFilter.cs`, `ChzzkApiClient.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Events\`: `IDonationEventSource.cs`, `FakeDonationSource.cs`, `ChzzkSessionSource.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\`: `LocalImageStorage.cs`
  - `C:\dev\image-donation\server\ImageDonation.Tests\`: `ImageDonation.Tests.csproj`, `ChzzkEmulator.cs`, `ChzzkSessionSourceTests.cs`, `DonationCodeMatcherTests.cs`, `ImageProcessorTests.cs`, `TestImages.cs`, `BannedWordFilterTests.cs`, `ApiFactory.cs`, `PublicDonationTests.cs`, `OverlayHubTests.cs`, `SafetyTests.cs`, `SettingsTests.cs`, `TestModeTests.cs`, `RetentionTests.cs`
  - `C:\dev\image-donation\tools\chzzk-emulator\`: `package.json`, `package-lock.json`, `emulator.cjs`
  - `C:\dev\sp-practice\`: `api.http`
  - `C:\dev\sp-practice\images\`: `(폴더)`
  - PostgreSQL 실행 중, 서버 실행 가능.
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\README.md` [바꿈] — "신고 확인 (서비스 운영자)" 절과 통계 SQL (레퍼런스 `README.md`)
  - `C:\dev\image-donation\server\ImageDonation.Api\appsettings.json` [바꿈] — + `Logging:LogLevel:"Microsoft.EntityFrameworkCore.Database.Command": "Warning"` (레퍼런스와 같아짐) (레퍼런스 `server/ImageDonation.Api/appsettings.json`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Program.cs` [바꿈] — + `AddHealthChecks()`, `MapHealthChecks("/healthz")` (레퍼런스 `server/ImageDonation.Api/Program.cs`)
- 끝 상태 확인:
  - `http://localhost:5080/healthz` → 글자 `Healthy`.
  - 대시보드에서 승인 몇 번 → 서버 터미널에 SQL 문이 쏟아지지 않는다.
  - README의 신고 조회 SQL을 psql에서 실행 → Day 31에 신고한 1행(사유·주소·이미지 파일 이름). 상태별 개수 SQL → 상태마다 한 줄.
- 과제:
  - 1) 상태별 후원 수를 세는 SQL을 쓴다 → 정답 요지: `SELECT "Status", count(*) FROM "Donations" GROUP BY "Status" ORDER BY 2 DESC;` — Status가 글자로 저장되어 바로 읽힌다(Day 9 결정)
  - 2) 로그에 `$"{nickname}님 후원 실패"`처럼 닉네임을 넣으면 안 되는 이유 두 가지 → 정답 요지: 로그는 오래 남고 여러 곳으로 복사돼 개인정보 보관 기간 약속을 깬다, 문자열을 이어 붙이면 값으로 검색·집계하기 어렵다
- 용어(사전 담당): `관측성`, `헬스 체크`, `구조화 로깅`
- 자주 막히는 곳 후보:
  - `/healthz`를 5173에서 열어 404 → Vite 프록시는 `/api`·`/hubs`·`/media`만 넘긴다 → 5080으로
  - 로그 수준 키 오타(대소문자 포함 정확히) → 설정이 무시됨
  - psql에서 오늘 날짜를 UTC로 셈 → `"CreatedAt" AT TIME ZONE 'Asia/Seoul'`로 한국 날짜
- 레퍼런스 대응:
  - `C:\dev\image-donation\README.md`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/README.md`)와 다름: 다시 바뀜 → [Day 37](#/day/sp-d37)
  - `C:\dev\image-donation\server\ImageDonation.Api\appsettings.json`: `reference/sp-image-donation/server/ImageDonation.Api/appsettings.json` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Api\Program.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Program.cs`)와 다름: 다시 바뀜 → [Day 36](#/day/sp-d36)

## Day 36 — 저장소 추상화 (110분)
- 목표:
  - 왜 인터페이스인가: 지금은 서버 PC의 `media` 폴더에 저장하지만, 서버를 여러 대 띄우거나 디스크가 사라지는 호스팅(Day 38)에서는 객체 스토리지가 필요하다. 사용하는 쪽이 "어디에 저장되는지" 모르게 하면 구현만 바꿔 끼울 수 있다([P2 Day 13](#/day/p2-d13) 다형성).
  - `Services\Storage\IImageStorage.cs`(최종): `SaveAsync`, `OpenRead`, `Exists`, `DeleteAsync`, `DeleteOlderThanAsync`. `LocalImageStorage : IImageStorage`. 쓰는 곳 네 군데(`DonationService`, `RetentionService`, `PublicEndpoints.GetMedia`, `Program.cs` 등록 `AddSingleton<IImageStorage, LocalImageStorage>()`)를 인터페이스로 바꾼다.
  - 테스트 대역: `FailingDeleteStorage`(지우기만 항상 `IOException("The process cannot access the file because it is being used by another process.")`, 나머지는 진짜 저장소에 맡김 — Windows에서 다른 프로그램이 파일을 잡은 상황), `ApiFactory`에 `replaceServices` → `ConfigureTestServices`, `OverlayHubTests`에 `EmergencyStop_ClearsOverlayFirst_EvenIfFileDeleteFails`.
  - S3 호환 구현은 개념과 설계만: 버킷·키·공개 여부, `/media` 대신 서명된 주소를 줄 수 있다는 점, 요금(저장 용량·요청 수·트래픽). 레퍼런스에 S3 코드가 없고 검증하지 않았으므로 **교재에 구현 코드를 싣지 않는다**.
  - 두 번째 테스트 대역(Day 34에서 옮김): 가짜 치지직 HTTP 처리기 `StubChzzkHandler`(1회용 리프레시 토큰을 흉내 냄: 마지막으로 준 값만 받고 쓰면 새 값으로) + `ChzzkApiClientTests` 3개 — 토큰 회전 r1 → r2 → r3, 두 요청이 동시에 갱신해도 1번만, 이미 쓴 토큰이면 401. Day 24의 `GetValidAccessTokenAsync`를 치지직 없이 처음 실제로 실행해 본다. 테스트 파일은 붙여 넣고 읽는다.
- 이미 배운 것:
  - [Day 24](#/day/sp-d24) 토큰 회전
  - [Day 10](#/day/sp-d10)~[Day 12](#/day/sp-d12) 저장소, [Day 31](#/day/sp-d31) 긴급 정지, [Day 34](#/day/sp-d34) ApiFactory
  - interface·다형성([P2 Day 13](#/day/p2-d13)), 의존성 주입·서비스 수명([P2 Day 23](#/day/p2-d23))
- 시작 상태:
  - [Day 35](#/day/sp-d35) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 35](#/day/sp-d35)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`, `.env.example`, `.env`, `docker-compose.yml`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `overlay.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`, `api.ts`, `donationList.ts`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`, `DonationForm.tsx`, `DonationResult.tsx`, `StreamerLayout.tsx`, `TestDonationPanel.tsx`
  - `C:\dev\image-donation\client\src\hooks\`: `useImagePreview.ts`, `useMe.ts`, `useDashboardHub.ts`
  - `C:\dev\image-donation\client\src\overlay\`: `main.tsx`, `Overlay.tsx`, `useOverlayHub.ts`, `overlay.css`
  - `C:\dev\image-donation\client\src\pages\`: `DonatePage.tsx`, `DashboardPage.tsx`, `LoginPage.tsx`, `OnboardingPage.tsx`, `SettingsPage.tsx`, `DashboardPage.test.tsx`, `DonatePage.test.tsx`
  - `C:\dev\image-donation\client\src\test\`: `setup.ts`
  - `C:\dev\image-donation\server\`: `ImageDonation.slnx`
  - `C:\dev\image-donation\server\ImageDonation.Api\`: `ImageDonation.Api.csproj`, `appsettings.json`, `appsettings.Development.json`, `Program.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\`: `AppDbContext.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\`: `DonationDtos.cs`, `AuthDtos.cs`, `SettingsDto.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\`: `PublicEndpoints.cs`, `AuthEndpoints.cs`, `DashboardEndpoints.cs`, `ChzzkEndpoints.cs`, `TestModeEndpoints.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\`: `Streamer.cs`, `StreamerSettings.cs`, `Donation.cs`, `ChzzkToken.cs`, `DonationEvent.cs`, `BlockEntry.cs`, `Report.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Hubs\`: `OverlayHub.cs`, `DashboardHub.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\`: `<시각>_InitialCreate.cs (+ .Designer.cs)`, `<시각>_AddIdentity.cs (+ .Designer.cs)`, `<시각>_AddChzzkTokens.cs (+ .Designer.cs)`, `<시각>_AddDonationEvents.cs (+ .Designer.cs)`, `<시각>_AddSafety.cs (+ .Designer.cs)`, `<시각>_AddImageFileIndex.cs (+ .Designer.cs)`, `AppDbContextModelSnapshot.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Properties\`: `launchSettings.json`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\`: `ImageProcessor.cs`, `RetentionService.cs`, `DonationService.cs`, `DonationCodeMatcher.cs`, `BannedWordFilter.cs`, `ChzzkApiClient.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Events\`: `IDonationEventSource.cs`, `FakeDonationSource.cs`, `ChzzkSessionSource.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\`: `LocalImageStorage.cs`
  - `C:\dev\image-donation\server\ImageDonation.Tests\`: `ImageDonation.Tests.csproj`, `ChzzkEmulator.cs`, `ChzzkSessionSourceTests.cs`, `DonationCodeMatcherTests.cs`, `ImageProcessorTests.cs`, `TestImages.cs`, `BannedWordFilterTests.cs`, `ApiFactory.cs`, `PublicDonationTests.cs`, `OverlayHubTests.cs`, `SafetyTests.cs`, `SettingsTests.cs`, `TestModeTests.cs`, `RetentionTests.cs`
  - `C:\dev\image-donation\tools\chzzk-emulator\`: `package.json`, `package-lock.json`, `emulator.cjs`
  - `C:\dev\sp-practice\`: `api.http`
  - `C:\dev\sp-practice\images\`: `(폴더)`
  - `dotnet test` 통과 상태(Day 34), PostgreSQL 실행 중.
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\server\ImageDonation.Api\Program.cs` [바꿈] — `AddSingleton<IImageStorage, LocalImageStorage>()`로 바꿈 (레퍼런스 `server/ImageDonation.Api/Program.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\PublicEndpoints.cs` [바꿈] — `GetMedia`가 `IImageStorage`를 받음 (레퍼런스와 같아짐) (레퍼런스 `server/ImageDonation.Api/Endpoints/PublicEndpoints.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\LocalImageStorage.cs` [바꿈] — `: IImageStorage` (레퍼런스와 같아짐) (레퍼런스 `server/ImageDonation.Api/Services/Storage/LocalImageStorage.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\IImageStorage.cs` [새로] — SaveAsync, OpenRead, Exists, DeleteAsync, DeleteOlderThanAsync (레퍼런스 `server/ImageDonation.Api/Services/Storage/IImageStorage.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\RetentionService.cs` [바꿈] — `IImageStorage`를 받음 (레퍼런스와 같아짐) (레퍼런스 `server/ImageDonation.Api/Services/RetentionService.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\DonationService.cs` [바꿈] — `IImageStorage`를 받음 (레퍼런스와 같아짐) (레퍼런스 `server/ImageDonation.Api/Services/DonationService.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Tests\ApiFactory.cs` [바꿈] — + 생성자 `replaceServices` → `ConfigureTestServices` (레퍼런스와 같아짐) (레퍼런스 `server/ImageDonation.Tests/ApiFactory.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Tests\OverlayHubTests.cs` [바꿈] — + `EmergencyStop_ClearsOverlayFirst_EvenIfFileDeleteFails` (레퍼런스와 같아짐) (레퍼런스 `server/ImageDonation.Tests/OverlayHubTests.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Tests\ChzzkApiClientTests.cs` [새로] — 토큰 회전(r1 → r2 → r3), 동시 갱신 1회, 갱신 실패 401 (Day 24 코드를 가짜 치지직으로 처음 실행) (레퍼런스 `server/ImageDonation.Tests/ChzzkApiClientTests.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Tests\StubChzzkHandler.cs` [새로] — 1회용 리프레시 토큰을 흉내 내는 가짜 HttpMessageHandler (레퍼런스 `server/ImageDonation.Tests/StubChzzkHandler.cs`)
  - `C:\dev\image-donation\server\ImageDonation.Tests\FailingDeleteStorage.cs` [새로] — 지우기만 항상 IOException을 내는 IImageStorage 테스트 대역 (레퍼런스 `server/ImageDonation.Tests/FailingDeleteStorage.cs`)
- 끝 상태 확인:
  - `dotnet build` 경고 0, `dotnet test` → 실패 0(레퍼런스와 같은 54개 — 작성자가 실제 수 확인).
  - 앱 동작은 그대로: 업로드·`/media` 보기·승인·긴급 정지.
  - `Services\Storage`에 `IImageStorage.cs`, `LocalImageStorage.cs` 두 파일.
- 과제:
  - 1) 테스트용 "메모리 저장소"를 설계한다(코드 개요) → 정답 요지: `Dictionary<string, byte[]>`에 저장, OpenRead는 `new MemoryStream(bytes)`, Exists는 ContainsKey, 이름은 같은 GUID 규칙. 실제로 넣지는 않는다(레퍼런스에 없음)
  - 2) 저장소를 S3로 바꾸면 `GET /media`는 어떻게 될 수 있는지 → 정답 요지: 서버가 스트림을 대신 읽어 주거나, 상태를 확인한 뒤 짧게 유효한 서명된 주소로 보내는 방식. 신고 이미지 격리 규칙(Day 31)은 그대로 지켜야 한다
- 용어(사전 담당): `객체 스토리지`, `S3 호환`, `테스트 대역`
- 자주 막히는 곳 후보:
  - `Unable to resolve service for type 'ImageDonation.Api.Services.Storage.LocalImageStorage'` → 아직 구체 클래스를 받는 곳이 남음 → 인터페이스로
  - `ConfigureTestServices`를 쓰려면 `using Microsoft.AspNetCore.TestHost;`
  - 테스트 대역을 본 앱 코드(ImageDonation.Api)에 넣음 → 테스트 프로젝트에만
- 레퍼런스 대응:
  - `C:\dev\image-donation\server\ImageDonation.Api\Program.cs`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/server/ImageDonation.Api/Program.cs`)와 다름: 다시 바뀜 → [Day 37](#/day/sp-d37)
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\PublicEndpoints.cs`: `reference/sp-image-donation/server/ImageDonation.Api/Endpoints/PublicEndpoints.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\LocalImageStorage.cs`: `reference/sp-image-donation/server/ImageDonation.Api/Services/Storage/LocalImageStorage.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\IImageStorage.cs`: `reference/sp-image-donation/server/ImageDonation.Api/Services/Storage/IImageStorage.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\RetentionService.cs`: `reference/sp-image-donation/server/ImageDonation.Api/Services/RetentionService.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\DonationService.cs`: `reference/sp-image-donation/server/ImageDonation.Api/Services/DonationService.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Tests\ApiFactory.cs`: `reference/sp-image-donation/server/ImageDonation.Tests/ApiFactory.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Tests\OverlayHubTests.cs`: `reference/sp-image-donation/server/ImageDonation.Tests/OverlayHubTests.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Tests\ChzzkApiClientTests.cs`: `reference/sp-image-donation/server/ImageDonation.Tests/ChzzkApiClientTests.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Tests\StubChzzkHandler.cs`: `reference/sp-image-donation/server/ImageDonation.Tests/StubChzzkHandler.cs` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Tests\FailingDeleteStorage.cs`: `reference/sp-image-donation/server/ImageDonation.Tests/FailingDeleteStorage.cs` 최종(같음)

## Day 37 — Docker 이미지 (120분)
- 목표:
  - P3([P3 Day 40](#/day/p3-d40))를 안 했다고 가정하고 Dockerfile·이미지 빌드·멀티스테이지를 처음부터 설명한다(사전 항목은 P3 것을 링크).
  - 하나의 앱으로: `vite.config.ts`(최종)의 `build.outDir: '../server/ImageDonation.Api/wwwroot'`, `emptyOutDir`, `rolldownOptions.input: { main: 'index.html', overlay: 'overlay.html' }`. `Program.cs`(최종): `UseDefaultFiles()`, `UseStaticFiles()`, 없는 `/api/...`는 404(`MapFallback("/api/{**path}", …)`), 나머지는 `MapFallbackToFile("index.html")`(BrowserRouter 새로고침, Day 6). [P2 Day 38](#/day/p2-d38)의 단일 앱과 같은 생각.
  - `Dockerfile`(최종): ① `node:26-slim`에서 `npm ci` + `npm run build` ② `mcr.microsoft.com/dotnet/sdk:10.0`에서 `dotnet restore`(csproj 먼저 복사해 캐시) + `dotnet publish -c Release` ③ `aspnet:10.0`에 결과물과 wwwroot만, `/data/media`·`/data/keys` 만들고 `USER $APP_UID`(루트가 아닌 사용자), `ENV Storage__MediaPath`·`DataProtection__KeysPath`, 8080. `.dockerignore`(최종): node_modules·bin·obj·wwwroot·media·Tests·tools·.env.
  - Data Protection 키를 볼륨에: `Program.cs`에 `DataProtection:KeysPath`가 있으면 `PersistKeysToFileSystem` → 컨테이너를 다시 만들어도 로그인 쿠키·치지직 토큰을 읽을 수 있다. 시작 로그의 `No XML encryptor configured` 경고 = 키가 평문 XML로 저장된다는 뜻 → 운영에서는 폴더 권한 제한.
  - `docker-compose.yml`(최종): `api` 서비스(build ., `8080:8080`, 환경 변수는 `:` 대신 `__`, 연결 문자열 `Host=db;…;GSS Encryption Mode=Disable`(런타임 이미지에 없는 Kerberos 라이브러리 경고 제거), `Security__IpHashKey`, `Chzzk__*`, 볼륨 `appdata:/data`, `depends_on: db: condition: service_healthy`). DB 포트 공개(`127.0.0.1:5432`)는 뺀다(운영 설정: DB를 밖에 열지 않음). `.env.example`(최종)·`.env`에 `IP_HASH_KEY`(Day 14와 같은 명령 `$b = New-Object byte[] 32; [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b); [Convert]::ToBase64String($b)`으로 만든 값), 치지직 값(선택). **DB 값은 Day 7과 같게 유지**. `.gitignore`(최종).
  - `cd C:\dev\image-donation` → `docker compose up --build -d` → `http://localhost:8080`. 끌 때 `docker compose down`, 데이터까지 지울 때만 `down -v`.
  - 이후 다시 개발 모드(`dotnet run` + `npm run dev`)로 돌아갈 때: `docker compose down`으로 전체 앱을 먼저 끄고 `docker compose run -d --rm --name image-donation-devdb -p 127.0.0.1:5432:5432 db`로 DB만 포트를 열어 띄운다(같은 `pgdata` 볼륨). 이 명령은 작성 환경(Linux, Docker Compose v5.6.1)에서 레퍼런스 compose로 실행해 `psql` 접속까지 확인했다. 끝나면 `docker stop image-donation-devdb`.
  - **Docker 없는 경로**: `cd C:\dev\image-donation\client` → `npm ci` → `npm run build`(wwwroot로) → `cd …\server\ImageDonation.Api` → `dotnet run` → `http://localhost:5080/login`(레퍼런스 README 실행 방법 B). Dockerfile·compose 파일은 같게 만들어 두고, Docker를 쓸 수 있게 되면 그때 실행한다. README에 실행 방법 A/B.
- 이미 배운 것:
  - [Day 7](#/day/sp-d07) compose·볼륨·.env, [Day 24](#/day/sp-d24) Data Protection, [Day 35](#/day/sp-d35) healthz
  - vite build → wwwroot·`dotnet publish`·`UseStaticFiles`·`MapFallbackToFile`([P2 Day 38](#/day/p2-d38)), 환경 변수 이름의 `__`·배포 설정([P2 Day 39](#/day/p2-d39))
- 시작 상태:
  - [Day 36](#/day/sp-d36) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 36](#/day/sp-d36)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`, `.env.example`, `.env`, `docker-compose.yml`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `overlay.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`, `api.ts`, `donationList.ts`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`, `DonationForm.tsx`, `DonationResult.tsx`, `StreamerLayout.tsx`, `TestDonationPanel.tsx`
  - `C:\dev\image-donation\client\src\hooks\`: `useImagePreview.ts`, `useMe.ts`, `useDashboardHub.ts`
  - `C:\dev\image-donation\client\src\overlay\`: `main.tsx`, `Overlay.tsx`, `useOverlayHub.ts`, `overlay.css`
  - `C:\dev\image-donation\client\src\pages\`: `DonatePage.tsx`, `DashboardPage.tsx`, `LoginPage.tsx`, `OnboardingPage.tsx`, `SettingsPage.tsx`, `DashboardPage.test.tsx`, `DonatePage.test.tsx`
  - `C:\dev\image-donation\client\src\test\`: `setup.ts`
  - `C:\dev\image-donation\server\`: `ImageDonation.slnx`
  - `C:\dev\image-donation\server\ImageDonation.Api\`: `ImageDonation.Api.csproj`, `appsettings.json`, `appsettings.Development.json`, `Program.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\`: `AppDbContext.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\`: `DonationDtos.cs`, `AuthDtos.cs`, `SettingsDto.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\`: `PublicEndpoints.cs`, `AuthEndpoints.cs`, `DashboardEndpoints.cs`, `ChzzkEndpoints.cs`, `TestModeEndpoints.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\`: `Streamer.cs`, `StreamerSettings.cs`, `Donation.cs`, `ChzzkToken.cs`, `DonationEvent.cs`, `BlockEntry.cs`, `Report.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Hubs\`: `OverlayHub.cs`, `DashboardHub.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\`: `<시각>_InitialCreate.cs (+ .Designer.cs)`, `<시각>_AddIdentity.cs (+ .Designer.cs)`, `<시각>_AddChzzkTokens.cs (+ .Designer.cs)`, `<시각>_AddDonationEvents.cs (+ .Designer.cs)`, `<시각>_AddSafety.cs (+ .Designer.cs)`, `<시각>_AddImageFileIndex.cs (+ .Designer.cs)`, `AppDbContextModelSnapshot.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Properties\`: `launchSettings.json`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\`: `ImageProcessor.cs`, `RetentionService.cs`, `DonationService.cs`, `DonationCodeMatcher.cs`, `BannedWordFilter.cs`, `ChzzkApiClient.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Events\`: `IDonationEventSource.cs`, `FakeDonationSource.cs`, `ChzzkSessionSource.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\`: `LocalImageStorage.cs`, `IImageStorage.cs`
  - `C:\dev\image-donation\server\ImageDonation.Tests\`: `ImageDonation.Tests.csproj`, `ChzzkEmulator.cs`, `ChzzkSessionSourceTests.cs`, `DonationCodeMatcherTests.cs`, `ImageProcessorTests.cs`, `TestImages.cs`, `BannedWordFilterTests.cs`, `ApiFactory.cs`, `PublicDonationTests.cs`, `OverlayHubTests.cs`, `SafetyTests.cs`, `SettingsTests.cs`, `TestModeTests.cs`, `RetentionTests.cs`, `ChzzkApiClientTests.cs`, `StubChzzkHandler.cs`, `FailingDeleteStorage.cs`
  - `C:\dev\image-donation\tools\chzzk-emulator\`: `package.json`, `package-lock.json`, `emulator.cjs`
  - `C:\dev\sp-practice\`: `api.http`
  - `C:\dev\sp-practice\images\`: `(폴더)`
  - Docker 경로: Docker Desktop 실행 중, 개발용 `dotnet run`·`npm run dev`는 끈다(포트·DB 충돌 방지). 디스크 여유 수 GB.
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\README.md` [바꿈] — 실행 방법 A(Docker)·B(Docker 없이) (레퍼런스 `README.md`)
  - `C:\dev\image-donation\.gitignore` [바꿈] — + `client/dist/`, `server/ImageDonation.Api/wwwroot/` (레퍼런스와 같은 순서·주석으로 정리) (레퍼런스 `.gitignore`)
  - `C:\dev\image-donation\.env.example` [바꿈] — + `IP_HASH_KEY`, `CHZZK_CLIENT_ID`, `CHZZK_CLIENT_SECRET`, `CHZZK_REDIRECT_URI` (레퍼런스와 같음) (레퍼런스 `.env.example`)
  - `C:\dev\image-donation\.env` [바꿈] — + `IP_HASH_KEY`(Day 14와 같은 PowerShell 명령으로 만든 무작위 값), 치지직 값(선택). DB 값은 Day 7과 같게 유지
  - `C:\dev\image-donation\docker-compose.yml` [바꿈] — 레퍼런스와 같게: `api` 서비스(build ., 8080, 환경 변수 `__`, `GSS Encryption Mode=Disable`, `appdata:/data`, `depends_on: service_healthy`) 추가, DB 포트 공개는 뺌 (레퍼런스 `docker-compose.yml`)
  - `C:\dev\image-donation\Dockerfile` [새로] — 3단계 멀티스테이지(`node:26-slim` → `mcr.microsoft.com/dotnet/sdk:10.0` → `aspnet:10.0`), `/data/media`·`/data/keys`, `USER $APP_UID`, 8080 (레퍼런스 `Dockerfile`)
  - `C:\dev\image-donation\.dockerignore` [새로] — node_modules·bin·obj·wwwroot·media·Tests·tools·.env 제외 (레퍼런스 `.dockerignore`)
  - `C:\dev\image-donation\client\vite.config.ts` [바꿈] — + `build: { outDir: "../server/ImageDonation.Api/wwwroot", emptyOutDir: true, rolldownOptions.input: { main, overlay } }` (레퍼런스 `client/vite.config.ts`)
  - `C:\dev\image-donation\server\ImageDonation.Api\Program.cs` [바꿈] — + `DataProtection:KeysPath`가 있으면 `PersistKeysToFileSystem`, `UseDefaultFiles`, `UseStaticFiles`, `MapFallback("/api/{**path}", 404)`, `MapFallbackToFile("index.html")` (레퍼런스와 같아짐) (레퍼런스 `server/ImageDonation.Api/Program.cs`)
- 끝 상태 확인:
  - Docker 경로: `docker compose up --build -d`가 끝나고 `docker compose ps`에 `api`·`db`가 실행 중. `http://localhost:8080/healthz` → `Healthy`, `/login` 화면.
  - Docker 앱은 Day 7부터 쓴 같은 `pgdata` 볼륨을 쓰므로 계정·스트리머가 이미 있다 → 8080에서 **기존 계정으로 로그인**(Docker 없이 개발해 compose DB를 처음 쓰는 사람만 새로 가입·온보딩) → 업로드·승인 → `http://localhost:8080/overlay.html?token=…`에 표시. 달라지는 것 두 가지를 본문에 설명: ① 개발 때 올린 이미지는 PC의 `server\ImageDonation.Api\media`에 있고 컨테이너는 `appdata` 볼륨의 `/data/media`를 쓰므로 옛 후원 이미지는 404(카드 이미지가 깨짐, 7일 뒤 정리 — 정상) ② Data Protection 키도 PC(`%LOCALAPPDATA%\ASP.NET\DataProtection-Keys`)와 컨테이너(`/data/keys`)가 달라서 개발 때의 로그인 쿠키는 무효(8080에서 다시 로그인)이고 저장된 치지직 토큰은 풀 수 없다 → 선택 단계라면 설정에서 치지직 계정을 다시 연결. `docker compose down` → `up -d` 후에는 로그인과 새 이미지가 남아 있다.
  - Docker 없는 경로: `npm run build` 후 `server\ImageDonation.Api\wwwroot\index.html`·`overlay.html`이 생기고, `http://localhost:5080/login`·`/d/my-stream`에서 새로고침해도 화면이 나온다. `/api/없는주소` → 404.
  - `git status`에 `wwwroot`·`.env`가 안 보인다.
- 과제:
  - 1) 멀티스테이지로 나누는 이유 두 가지 → 정답 요지: 최종 이미지에 SDK·Node·소스가 들어가지 않아 작고 안전하다, 단계별 캐시로 다시 빌드가 빠르다
  - 2) `.dockerignore`에 `.env`가 있는 이유 → 정답 요지: 없으면 `COPY`가 비밀 값을 이미지 안에 넣을 수 있고, 이미지를 공유하면 비밀이 샌다. 값은 실행할 때 compose가 환경 변수로 넣는다
- 용어(사전 담당): 없음(이 Day가 담당하는 새 용어 없음)
  - P3 사전 항목에 `[[제목]]`으로 링크하되 **P3를 안 했다고 가정하고 이 Day가 처음부터 설명**(정의만 P3 담당): `[[Dockerfile]]`, `[[멀티스테이지 빌드]]`, `[[레이어 캐시]]`, `[[.dockerignore]]`, `[[컨테이너 이미지]]`, `[[Docker Compose]]`, `[[볼륨]]`
  - 앞 프로젝트(P1·P2)에서 배운 용어, 다시 짚을 때 `[[제목]]`으로 링크: `[[wwwroot]]`, `[[dotnet publish]]`, `[[폴백 라우트]]`, `[[환경 변수]]`
- 자주 막히는 곳 후보:
  - `password authentication failed` → `.env`의 DB 비밀번호를 Day 7과 다르게 바꿈. PostgreSQL은 볼륨을 처음 만들 때의 비밀번호를 유지 → 원래 값으로 되돌린다(`down -v`로 초기화하면 데이터가 모두 지워진다는 경고와 함께)
  - `required variable IP_HASH_KEY is missing a value` → `.env`에 추가
  - 첫 빌드가 오래 걸림·네트워크 오류 → 인터넷 연결, 다시 실행
  - 8080 사용 중 → 다른 프로그램 종료 또는 compose 포트를 바꿔 실험(레퍼런스는 8080)
  - `npm ci` 실패(`package-lock.json`과 `package.json` 불일치) → `client`에서 `npm install` 후 lock 커밋
  - 개발 서버(5173)를 켜 둔 채 8080 앱을 봄 → 5173의 프록시 대상은 5080이라 Docker 앱과 다름
  - Docker 없는 경로에서 `The WebRootPath was not found` 경고 → 아직 빌드 안 함(P2와 같은 경고)
  - 치지직 리디렉션 URL: Docker로 실행하면 `http://localhost:8080/api/chzzk/callback`(선택 단계, 개발자 센터 등록값도 바꿔야 함)
- 레퍼런스 대응:
  - `C:\dev\image-donation\README.md`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/README.md`)와 다름: 다시 바뀜 → [Day 38](#/day/sp-d38)
  - `C:\dev\image-donation\.gitignore`: `reference/sp-image-donation/.gitignore` 최종(같음)
  - `C:\dev\image-donation\.env.example`: `reference/sp-image-donation/.env.example` 최종(같음)
  - `C:\dev\image-donation\.env`: 레퍼런스에 없음(비밀 값 파일. `.gitignore`가 무시하므로 레퍼런스(커밋된 파일)에 없음)
  - `C:\dev\image-donation\docker-compose.yml`: `reference/sp-image-donation/docker-compose.yml` 최종(같음)
  - `C:\dev\image-donation\Dockerfile`: `reference/sp-image-donation/Dockerfile` 최종(같음)
  - `C:\dev\image-donation\.dockerignore`: `reference/sp-image-donation/.dockerignore` 최종(같음)
  - `C:\dev\image-donation\client\vite.config.ts`: `reference/sp-image-donation/client/vite.config.ts` 최종(같음)
  - `C:\dev\image-donation\server\ImageDonation.Api\Program.cs`: `reference/sp-image-donation/server/ImageDonation.Api/Program.cs` 최종(같음)

## Day 38 — 배포와 HTTPS (100분)
- 목표:
  - 본선은 로컬이다: OBS가 같은 PC의 로컬 주소를 읽으므로 방송 PC에서 Docker(또는 `dotnet run`)로 실행하는 것이 자연스럽다. 다만 시청자는 인터넷에서 후원 페이지에 들어와야 하므로 공개 주소가 필요하다 → 배포는 **선택 단계**.
  - 작성 시점(2026-11, external-facts 13절, 대부분 `[검색요약]`) 선택지: Render 무료(Docker) — 15분 무트래픽이면 슬립, 디스크 휘발, 무료 Postgres는 30일 뒤 만료, 카드 요구 여부 미확인 / Google Cloud Run — 결제(청구) 계정 필요 / Fly.io — 신규 조직 무료 티어 없음·카드 필요. SP에 맞는 판단: 업로드 이미지(7일 보관)와 Data Protection 키가 휘발되면 안 되므로 무료 플랜은 연습용이고, 실제 운영은 영속 디스크나 객체 스토리지(Day 36)·관리형 DB가 필요하다. 카드가 필요한 서비스는 맨 위에 "카드 필요"라고 쓰고 비용 경고를 둔다. **작성 환경에서 SP를 실제로 배포해 보지는 못했다**고 명시한다.
  - HTTPS가 필요한 이유: 로그인 쿠키·state 쿠키의 `Secure`, 치지직 리디렉션 URL(https 주소 등록), 오버레이 토큰이 주소에 있음, Clipboard API(Day 20). 도메인 연결([P2 Day 39](#/day/p2-d39)).
  - [[리버스 프록시]] 뒤에서는 모든 요청이 프록시 IP에서 온 것처럼 보여 요청 제한(Day 14)·차단(Day 31)이 IP 기준이라 망가진다 → `UseForwardedHeaders`와 믿을 프록시 등록이 필요([P2 Day 39](#/day/p2-d39)). 레퍼런스는 직접 노출만 가정하고 이 코드가 없으므로, 교재는 "배포할 때 추가해야 할 것"으로 설명만 하고 코드를 바꾸지 않는다.
  - 공개 전 점검표(README): `Auth__LocalLoginEnabled=false`(치지직 로그인만), 비밀 값은 호스팅의 환경 변수(커밋 금지), 치지직 개발자 센터의 리디렉션 URL을 `https://<내 주소>/api/chzzk/callback`으로 갱신 + `CHZZK_REDIRECT_URI`, 처리방침·약관 공개 전 법률 자문(Day 32), 백업, 비용 한도 알림. 이 Day에는 코드 변경이 없다.
- 이미 배운 것:
  - [Day 14](#/day/sp-d14) 요청 제한, [Day 22](#/day/sp-d22) 리디렉션 URL, [Day 32](#/day/sp-d32), [Day 36](#/day/sp-d36)~[Day 37](#/day/sp-d37)
  - HTTPS·개발 인증서([P2 Day 34](#/day/p2-d34)), 배포·환경 변수·리버스 프록시·X-Forwarded-For([P2 Day 39](#/day/p2-d39))
- 시작 상태:
  - [Day 37](#/day/sp-d37) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 37](#/day/sp-d37)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`, `.env.example`, `.env`, `docker-compose.yml`, `Dockerfile`, `.dockerignore`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `overlay.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`, `api.ts`, `donationList.ts`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`, `DonationForm.tsx`, `DonationResult.tsx`, `StreamerLayout.tsx`, `TestDonationPanel.tsx`
  - `C:\dev\image-donation\client\src\hooks\`: `useImagePreview.ts`, `useMe.ts`, `useDashboardHub.ts`
  - `C:\dev\image-donation\client\src\overlay\`: `main.tsx`, `Overlay.tsx`, `useOverlayHub.ts`, `overlay.css`
  - `C:\dev\image-donation\client\src\pages\`: `DonatePage.tsx`, `DashboardPage.tsx`, `LoginPage.tsx`, `OnboardingPage.tsx`, `SettingsPage.tsx`, `DashboardPage.test.tsx`, `DonatePage.test.tsx`
  - `C:\dev\image-donation\client\src\test\`: `setup.ts`
  - `C:\dev\image-donation\server\`: `ImageDonation.slnx`
  - `C:\dev\image-donation\server\ImageDonation.Api\`: `ImageDonation.Api.csproj`, `appsettings.json`, `appsettings.Development.json`, `Program.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\`: `AppDbContext.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\`: `DonationDtos.cs`, `AuthDtos.cs`, `SettingsDto.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\`: `PublicEndpoints.cs`, `AuthEndpoints.cs`, `DashboardEndpoints.cs`, `ChzzkEndpoints.cs`, `TestModeEndpoints.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\`: `Streamer.cs`, `StreamerSettings.cs`, `Donation.cs`, `ChzzkToken.cs`, `DonationEvent.cs`, `BlockEntry.cs`, `Report.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Hubs\`: `OverlayHub.cs`, `DashboardHub.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\`: `<시각>_InitialCreate.cs (+ .Designer.cs)`, `<시각>_AddIdentity.cs (+ .Designer.cs)`, `<시각>_AddChzzkTokens.cs (+ .Designer.cs)`, `<시각>_AddDonationEvents.cs (+ .Designer.cs)`, `<시각>_AddSafety.cs (+ .Designer.cs)`, `<시각>_AddImageFileIndex.cs (+ .Designer.cs)`, `AppDbContextModelSnapshot.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Properties\`: `launchSettings.json`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\`: `ImageProcessor.cs`, `RetentionService.cs`, `DonationService.cs`, `DonationCodeMatcher.cs`, `BannedWordFilter.cs`, `ChzzkApiClient.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Events\`: `IDonationEventSource.cs`, `FakeDonationSource.cs`, `ChzzkSessionSource.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\`: `LocalImageStorage.cs`, `IImageStorage.cs`
  - `C:\dev\image-donation\server\ImageDonation.Tests\`: `ImageDonation.Tests.csproj`, `ChzzkEmulator.cs`, `ChzzkSessionSourceTests.cs`, `DonationCodeMatcherTests.cs`, `ImageProcessorTests.cs`, `TestImages.cs`, `BannedWordFilterTests.cs`, `ApiFactory.cs`, `PublicDonationTests.cs`, `OverlayHubTests.cs`, `SafetyTests.cs`, `SettingsTests.cs`, `TestModeTests.cs`, `RetentionTests.cs`, `ChzzkApiClientTests.cs`, `StubChzzkHandler.cs`, `FailingDeleteStorage.cs`
  - `C:\dev\image-donation\tools\chzzk-emulator\`: `package.json`, `package-lock.json`, `emulator.cjs`
  - `C:\dev\sp-practice\`: `api.http`
  - `C:\dev\sp-practice\images\`: `(폴더)`
  - Day 37의 Docker 앱(8080) 또는 빌드한 앱(5080)이 실행된다.
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\README.md` [바꿈] — 배포 결정표와 공개 전 점검표 (레퍼런스 `README.md`)
- 끝 상태 확인:
  - README에 배포 결정표(선택지·카드·제약·내 결정)와 공개 전 점검표가 보인다.
  - 선택 단계(배포했다면): `https://<내 주소>/healthz` → Healthy, 휴대폰 데이터(LTE)로 `/d/<주소>` 열림, (치지직 앱이 있으면) 치지직 로그인 리디렉션 성공.
- 과제:
  - 1) 무료 플랜에서 "7일 보관" 약속과 오버레이가 깨질 수 있는 이유 → 정답 요지: 디스크가 휘발되면 재시작·슬립 뒤 이미지와 Data Protection 키가 사라진다 → 이미지 404, 모두 로그아웃, 치지직 토큰 해독 불가
  - 2) 공개 전 점검표 7줄을 쓴다 → 정답 요지: 로컬 로그인 끄기, 비밀 값 환경 변수, HTTPS, 리디렉션 URL 갱신, ForwardedHeaders 필요성, 처리방침·약관 법률 자문, 백업·비용 알림
- 용어(사전 담당): `휘발성 파일 시스템`
  - P3 사전 항목에 `[[제목]]`으로 링크하되 **P3를 안 했다고 가정하고 이 Day가 처음부터 설명**(정의만 P3 담당): `[[도메인 이름]]`, `[[TLS]]`, `[[콜드 스타트]]`, `[[관리형 데이터베이스]]`
  - 앞 프로젝트(P1·P2)에서 배운 용어, 다시 짚을 때 `[[제목]]`으로 링크: `[[리버스 프록시]]`, `[[X-Forwarded-For]]`, `[[HTTPS]]`
- 자주 막히는 곳 후보:
  - 가입 중 카드 등록 요구 → 결정 전에 멈추고 비용 조건 확인(교재는 결제를 권하지 않음)
  - 슬립 후 첫 요청이 느려 오버레이가 끊긴 것처럼 보임 → 자동 재연결(Day 18)이 다시 붙음
  - 리디렉션 URL http/https·끝 슬래시 불일치
  - 배포 후 요청 제한에 모두가 걸림 → 프록시 뒤 IP 문제(위 목표)
  - 비밀 값을 저장소에 커밋해 배포 → 즉시 재발급(Client Secret, IP 해시 키, DB 비밀번호)
- 레퍼런스 대응:
  - `C:\dev\image-donation\README.md`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/README.md`)와 다름: 다시 바뀜 → [Day 39](#/day/sp-d39)

## Day 39 — 방송 리허설 (90분)
- 목표:
  - 리허설 체크리스트(README): 서버·DB 켜짐(`/healthz`), OBS 브라우저 소스 주소·1920×1080·투명 배경, 후원 페이지 주소 공지 문구, 설정(자동 승인 끔, 표시 시간·간격, 금지어), 테스트 후원 1건(무료 또는 테스트 모드), 긴급 정지 버튼 위치와 단축키 A/R, 오버레이 주소 유출 시 재발급 순서, 신고 처리 순서, PC 절전 끄기.
  - 실제 사람과 테스트: 친구 휴대폰(같은 Wi-Fi + Day 29의 `--host`·방화벽 개인 네트워크, 또는 Day 38 배포 주소)으로 후원 → 스트리머가 검수 → OBS 표시. 실제 스트리머 테스트는 계정·방송 환경이 필요하므로 학습자 상황에 맞게.
  - 사고 시나리오 연습: 부적절한 이미지 → 거절·차단·신고 / 이미 화면에 나감 → 긴급 정지 / 오버레이 주소가 방송에 보임 → 재발급 후 OBS 주소 바꾸기 / 서버가 꺼짐 → 재시작 후 자동 재연결 확인.
  - 방송 화면에 개인정보가 나가지 않게: 대시보드·설정 화면·터미널(user-secrets, `.env`)을 방송 장면에 넣지 않기, OBS 로컬 녹화로 화면을 먼저 확인.
  - 리허설 기록(문제 → 원인 → 고친 것)을 README에 남긴다. 이 Day에는 코드 변경이 없다.
- 이미 배운 것:
  - [Day 18](#/day/sp-d18) OBS, [Day 20](#/day/sp-d20) 설정·재발급, [Day 28](#/day/sp-d28)~[Day 31](#/day/sp-d31), [Day 37](#/day/sp-d37)~[Day 38](#/day/sp-d38)
- 시작 상태:
  - [Day 38](#/day/sp-d38) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 38](#/day/sp-d38)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`, `.env.example`, `.env`, `docker-compose.yml`, `Dockerfile`, `.dockerignore`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `overlay.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`, `api.ts`, `donationList.ts`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`, `DonationForm.tsx`, `DonationResult.tsx`, `StreamerLayout.tsx`, `TestDonationPanel.tsx`
  - `C:\dev\image-donation\client\src\hooks\`: `useImagePreview.ts`, `useMe.ts`, `useDashboardHub.ts`
  - `C:\dev\image-donation\client\src\overlay\`: `main.tsx`, `Overlay.tsx`, `useOverlayHub.ts`, `overlay.css`
  - `C:\dev\image-donation\client\src\pages\`: `DonatePage.tsx`, `DashboardPage.tsx`, `LoginPage.tsx`, `OnboardingPage.tsx`, `SettingsPage.tsx`, `DashboardPage.test.tsx`, `DonatePage.test.tsx`
  - `C:\dev\image-donation\client\src\test\`: `setup.ts`
  - `C:\dev\image-donation\server\`: `ImageDonation.slnx`
  - `C:\dev\image-donation\server\ImageDonation.Api\`: `ImageDonation.Api.csproj`, `appsettings.json`, `appsettings.Development.json`, `Program.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\`: `AppDbContext.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\`: `DonationDtos.cs`, `AuthDtos.cs`, `SettingsDto.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\`: `PublicEndpoints.cs`, `AuthEndpoints.cs`, `DashboardEndpoints.cs`, `ChzzkEndpoints.cs`, `TestModeEndpoints.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\`: `Streamer.cs`, `StreamerSettings.cs`, `Donation.cs`, `ChzzkToken.cs`, `DonationEvent.cs`, `BlockEntry.cs`, `Report.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Hubs\`: `OverlayHub.cs`, `DashboardHub.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\`: `<시각>_InitialCreate.cs (+ .Designer.cs)`, `<시각>_AddIdentity.cs (+ .Designer.cs)`, `<시각>_AddChzzkTokens.cs (+ .Designer.cs)`, `<시각>_AddDonationEvents.cs (+ .Designer.cs)`, `<시각>_AddSafety.cs (+ .Designer.cs)`, `<시각>_AddImageFileIndex.cs (+ .Designer.cs)`, `AppDbContextModelSnapshot.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Properties\`: `launchSettings.json`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\`: `ImageProcessor.cs`, `RetentionService.cs`, `DonationService.cs`, `DonationCodeMatcher.cs`, `BannedWordFilter.cs`, `ChzzkApiClient.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Events\`: `IDonationEventSource.cs`, `FakeDonationSource.cs`, `ChzzkSessionSource.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\`: `LocalImageStorage.cs`, `IImageStorage.cs`
  - `C:\dev\image-donation\server\ImageDonation.Tests\`: `ImageDonation.Tests.csproj`, `ChzzkEmulator.cs`, `ChzzkSessionSourceTests.cs`, `DonationCodeMatcherTests.cs`, `ImageProcessorTests.cs`, `TestImages.cs`, `BannedWordFilterTests.cs`, `ApiFactory.cs`, `PublicDonationTests.cs`, `OverlayHubTests.cs`, `SafetyTests.cs`, `SettingsTests.cs`, `TestModeTests.cs`, `RetentionTests.cs`, `ChzzkApiClientTests.cs`, `StubChzzkHandler.cs`, `FailingDeleteStorage.cs`
  - `C:\dev\image-donation\tools\chzzk-emulator\`: `package.json`, `package-lock.json`, `emulator.cjs`
  - `C:\dev\sp-practice\`: `api.http`
  - `C:\dev\sp-practice\images\`: `(폴더)`
  - Docker 앱(8080) 또는 빌드한 앱(5080) 실행, OBS, 휴대폰 또는 다른 PC.
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\README.md` [바꿈] — 방송 리허설 체크리스트와 리허설 기록 (레퍼런스 `README.md`)
- 끝 상태 확인:
  - 체크리스트의 모든 줄이 체크되어 있다.
  - OBS 로컬 녹화 영상에서 이미지가 투명 배경 위에 나타났다가 긴급 정지로 즉시 사라지고, 대시보드나 비밀 값이 화면에 보이지 않는다.
  - README에 리허설 기록 1개 이상.
- 과제:
  - 1) 사고 대응표(상황 → 첫 행동 → 다음 행동)를 4줄 쓴다 → 정답 요지: 부적절 이미지 대기 중 → 거절 → 차단/신고, 이미 표시 중 → 긴급 정지 → 신고, 주소 유출 → 재발급 → OBS 갱신, 서버 다운 → 재시작 → 오버레이 재연결 확인
  - 2) 15분짜리 리허설 진행 순서를 시간과 함께 쓴다 → 정답 요지: 예: 0~3분 점검표, 3~8분 무료 후원 2건, 8~11분 테스트 모드 치즈 흐름, 11~14분 사고 시나리오, 14~15분 기록
- 용어(사전 담당): 없음(이 Day가 담당하는 새 용어 없음)
  - P3 사전 항목에 `[[제목]]`으로 링크하되 **P3를 안 했다고 가정하고 이 Day가 처음부터 설명**(정의만 P3 담당): `[[방송 리허설]]`
- 자주 막히는 곳 후보:
  - 친구 휴대폰이 접속 못 함 → 같은 Wi-Fi·방화벽(개인 네트워크)·주소(`ipconfig`) 또는 배포 주소
  - OBS 화면 캡처에 대시보드가 잡힘 → 장면에서 창 캡처 소스 제거
  - 리허설 중 PC 절전으로 서버 중단 → 전원 설정
  - 오버레이가 옛 캐시를 보여 줌 → 브라우저 소스 "현재 페이지의 캐시를 새로 고침"
- 레퍼런스 대응:
  - `C:\dev\image-donation\README.md`: 중간 단계 — 레퍼런스(`reference/sp-image-donation/README.md`)와 다름: 다시 바뀜 → [Day 40](#/day/sp-d40)

## Day 40 — 회고와 다음 단계 (80분)
- 목표:
  - 회고: 잘한 것, 어려웠던 것, 다시 한다면 바꿀 것(README).
  - 운영 비용 계산 표: 서버·DB·파일 저장소(이미지 7일분)·도메인·트래픽(이미지 크기 × 하루 후원 수 × 오버레이·대시보드 조회), 무료 플랜의 한계(Day 38). 금액은 학습자가 고른 서비스의 요금표로 직접 채우고 작성 기준일을 적는다.
  - 확장 아이디어(설계만, 코드 없음): 영상 후원(재인코딩 비용·용량·저작권 위험이 이미지보다 큼), 다중 플랫폼(새 플랫폼은 `IDonationEventSource` 구현을 하나 더 붙이는 구조, Day 26), 운영자 관리자 화면(Day 35의 SQL을 화면으로), 서버 여러 대(토큰 갱신 DB 잠금, SignalR 백플레인, 객체 스토리지).
  - 포트폴리오: README 최종 정리(무엇을·왜·어떻게, 기술 선택 이유 — SkiaSharp 라이선스, 결제 없는 설계, 테스트 모드, 검증 방법과 미검증 항목), 화면 설명(스크린샷을 넣는다면 닉네임·토큰을 가림). VS Code `File: Compare Active File With...`로 내 코드와 레퍼런스 비교.
  - 공개 저장소에 올린다면: `git grep -n "Password="` 등으로 비밀 값이 없는지 확인 후 푸시(선택).
  - 다음 단계: P3를 아직 안 했으면 P3(Rust·WebSocket 게임, Docker·PostgreSQL을 다시 쓴다) — `[P3 한눈에 보기](#/project/p3)`, P3를 마쳤다면 졸업 로드맵(P3 완료 시 열림). SP는 다른 프로젝트를 해금하지 않는다.
- 이미 배운 것:
  - SP Day 1~39 전체
  - 회고·README([P1 Day 29](#/day/p1-d29)·[P1 Day 30](#/day/p1-d30)), 포트폴리오([P2 Day 40](#/day/p2-d40))
- 시작 상태:
  - [Day 39](#/day/sp-d39) 끝 상태와 같다. 아래 파일이 이렇게 있어야 한다(없으면 [Day 39](#/day/sp-d39)의 "오늘 끝 상태 전체 코드"로 맞춘다).
  - `C:\dev\image-donation\`: `README.md`, `.gitignore`, `.env.example`, `.env`, `docker-compose.yml`, `Dockerfile`, `.dockerignore`
  - `C:\dev\image-donation\client\`: `package.json`, `package-lock.json`, `.gitignore`, `.oxlintrc.json`, `index.html`, `overlay.html`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
  - `C:\dev\image-donation\client\public\`: `favicon.svg`
  - `C:\dev\image-donation\client\src\`: `main.tsx`, `App.tsx`, `index.css`, `api.ts`, `donationList.ts`
  - `C:\dev\image-donation\client\src\components\`: `DonationCard.tsx`, `DonationForm.tsx`, `DonationResult.tsx`, `StreamerLayout.tsx`, `TestDonationPanel.tsx`
  - `C:\dev\image-donation\client\src\hooks\`: `useImagePreview.ts`, `useMe.ts`, `useDashboardHub.ts`
  - `C:\dev\image-donation\client\src\overlay\`: `main.tsx`, `Overlay.tsx`, `useOverlayHub.ts`, `overlay.css`
  - `C:\dev\image-donation\client\src\pages\`: `DonatePage.tsx`, `DashboardPage.tsx`, `LoginPage.tsx`, `OnboardingPage.tsx`, `SettingsPage.tsx`, `DashboardPage.test.tsx`, `DonatePage.test.tsx`
  - `C:\dev\image-donation\client\src\test\`: `setup.ts`
  - `C:\dev\image-donation\server\`: `ImageDonation.slnx`
  - `C:\dev\image-donation\server\ImageDonation.Api\`: `ImageDonation.Api.csproj`, `appsettings.json`, `appsettings.Development.json`, `Program.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Data\`: `AppDbContext.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Dtos\`: `DonationDtos.cs`, `AuthDtos.cs`, `SettingsDto.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Endpoints\`: `PublicEndpoints.cs`, `AuthEndpoints.cs`, `DashboardEndpoints.cs`, `ChzzkEndpoints.cs`, `TestModeEndpoints.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Entities\`: `Streamer.cs`, `StreamerSettings.cs`, `Donation.cs`, `ChzzkToken.cs`, `DonationEvent.cs`, `BlockEntry.cs`, `Report.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Hubs\`: `OverlayHub.cs`, `DashboardHub.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Migrations\`: `<시각>_InitialCreate.cs (+ .Designer.cs)`, `<시각>_AddIdentity.cs (+ .Designer.cs)`, `<시각>_AddChzzkTokens.cs (+ .Designer.cs)`, `<시각>_AddDonationEvents.cs (+ .Designer.cs)`, `<시각>_AddSafety.cs (+ .Designer.cs)`, `<시각>_AddImageFileIndex.cs (+ .Designer.cs)`, `AppDbContextModelSnapshot.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Properties\`: `launchSettings.json`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\`: `ImageProcessor.cs`, `RetentionService.cs`, `DonationService.cs`, `DonationCodeMatcher.cs`, `BannedWordFilter.cs`, `ChzzkApiClient.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Events\`: `IDonationEventSource.cs`, `FakeDonationSource.cs`, `ChzzkSessionSource.cs`
  - `C:\dev\image-donation\server\ImageDonation.Api\Services\Storage\`: `LocalImageStorage.cs`, `IImageStorage.cs`
  - `C:\dev\image-donation\server\ImageDonation.Tests\`: `ImageDonation.Tests.csproj`, `ChzzkEmulator.cs`, `ChzzkSessionSourceTests.cs`, `DonationCodeMatcherTests.cs`, `ImageProcessorTests.cs`, `TestImages.cs`, `BannedWordFilterTests.cs`, `ApiFactory.cs`, `PublicDonationTests.cs`, `OverlayHubTests.cs`, `SafetyTests.cs`, `SettingsTests.cs`, `TestModeTests.cs`, `RetentionTests.cs`, `ChzzkApiClientTests.cs`, `StubChzzkHandler.cs`, `FailingDeleteStorage.cs`
  - `C:\dev\image-donation\tools\chzzk-emulator\`: `package.json`, `package-lock.json`, `emulator.cjs`
  - `C:\dev\sp-practice\`: `api.http`
  - `C:\dev\sp-practice\images\`: `(폴더)`
  - Day 39까지의 앱이 실행된다.
  - 도구가 만드는 폴더(`node_modules`, `bin`, `obj`, `dist`, 업로드된 `media` 파일)는 목록에서 뺐다.
- 오늘 만들/바꿀 파일:
  - `C:\dev\image-donation\README.md` [바꿈] — 최종 정리: 소개, 기술 선택 이유, 실행·테스트 방법, 회고, 다음 단계 (레퍼런스 `README.md`)
- 끝 상태 확인:
  - README 미리보기에 소개·기술 선택 이유·실행 방법 A/B·테스트 방법·미검증 항목·회고·다음 단계가 보인다.
  - `git status` 깨끗, `git log --oneline`에 Day별 커밋. (선택) `git grep`으로 비밀 값 0건.
- 과제:
  - 1) 하루 후원 100건 기준 월 운영 비용 표를 만든다 → 정답 요지: 이미지 1장 평균 크기(WebP로 줄어든 값) × 100 × 7일 = 저장 용량, 오버레이·대시보드 조회 트래픽, 서버·DB 월 요금. 숫자보다 "무엇이 비용을 키우는지"를 설명하는 것이 핵심
  - 2) 영상 후원을 추가한다면 바꿔야 할 곳 5군데 → 정답 요지: 업로드 크기 제한, 처리기(재인코딩 — 이미지보다 무거움), 저장소 용량·보관 기간, 오버레이 재생·표시 시간, 검수 화면 미리보기. 저작권 위험과 약관도
- 용어(사전 담당): `운영 비용`
- 자주 막히는 곳 후보:
  - `.env`나 user-secrets 값을 공개 저장소에 올림 → 즉시 재발급, Git 기록에서도 지워야 함
  - 스크린샷에 오버레이 토큰·시청자 닉네임 → 가리고 다시 찍기
  - 레퍼런스와 다른 곳을 찾으면 "틀린 것"인지 "내 선택"인지 구분해 회고에 적기
- 레퍼런스 대응:
  - `C:\dev\image-donation\README.md`: `reference/sp-image-donation/README.md` 최종(같음) — 구성과 사실은 레퍼런스 README를 따르고 글은 학습자 것

## 6. 파일 지도

경로는 `C:\dev\` 기준. 만듦·바뀜은 Day 번호. "최종" = 그 Day 이후 레퍼런스와 같음(글 내용·예시 데이터 제외).

- `image-donation/README.md` — 만듦 1, 바뀜 2, 7, 22, 32, 35, 37, 38, 39, 40 — 레퍼런스: `README.md`
- `image-donation/.gitignore` — 만듦 2, 바뀜 7, 10, 37 — 레퍼런스: `.gitignore`
- `image-donation/.env.example` — 만듦 7, 바뀜 37 — 레퍼런스: `.env.example`
- `image-donation/.env` — 만듦 7, 바뀜 37 — 레퍼런스: 없음
- `image-donation/docker-compose.yml` — 만듦 7, 바뀜 37 — 레퍼런스: `docker-compose.yml`
- `image-donation/Dockerfile` — 만듦 37 — 레퍼런스: `Dockerfile`
- `image-donation/.dockerignore` — 만듦 37 — 레퍼런스: `.dockerignore`
- `image-donation/client/package.json` — 만듦 3, 바뀜 6, 15, 34 — 레퍼런스: `client/package.json`
- `image-donation/client/package-lock.json` — 만듦 3, 바뀜 6, 15, 34 — 레퍼런스: `client/package-lock.json`
- `image-donation/client/.gitignore` — 만듦 3 — 레퍼런스: `client/.gitignore`
- `image-donation/client/.oxlintrc.json` — 만듦 3 — 레퍼런스: `client/.oxlintrc.json`
- `image-donation/client/index.html` — 만듦 3 — 레퍼런스: `client/index.html`
- `image-donation/client/overlay.html` — 만듦 15 — 레퍼런스: `client/overlay.html`
- `image-donation/client/public/favicon.svg` — 만듦 3 — 레퍼런스: `client/public/favicon.svg`
- `image-donation/client/public/sample-donations.json` — 만듦 5, 바뀜 19(지움) — 레퍼런스: 없음
- `image-donation/client/tsconfig.json` — 만듦 3 — 레퍼런스: `client/tsconfig.json`
- `image-donation/client/tsconfig.app.json` — 만듦 3 — 레퍼런스: `client/tsconfig.app.json`
- `image-donation/client/tsconfig.node.json` — 만듦 3 — 레퍼런스: `client/tsconfig.node.json`
- `image-donation/client/vite.config.ts` — 만듦 3, 바뀜 15, 34, 37 — 레퍼런스: `client/vite.config.ts`
- `image-donation/client/src/main.tsx` — 만듦 3, 바뀜 6 — 레퍼런스: `client/src/main.tsx`
- `image-donation/client/src/App.tsx` — 만듦 3, 바뀜 4, 5, 6, 19, 20, 30 — 레퍼런스: `client/src/App.tsx`
- `image-donation/client/src/index.css` — 만듦 3, 바뀜 4, 5, 6, 19, 20, 21, 29, 30, 31 — 레퍼런스: `client/src/index.css`
- `image-donation/client/src/api.ts` — 만듦 4, 바뀜 5, 15, 19, 20, 23, 27, 29, 30, 31 — 레퍼런스: `client/src/api.ts`
- `image-donation/client/src/donationList.ts` — 만듦 4 — 레퍼런스: `client/src/donationList.ts`
- `image-donation/client/src/components/DonationCard.tsx` — 만듦 3, 바뀜 4, 19, 27, 31 — 레퍼런스: `client/src/components/DonationCard.tsx`
- `image-donation/client/src/components/DonationForm.tsx` — 만듦 5, 바뀜 29 — 레퍼런스: `client/src/components/DonationForm.tsx`
- `image-donation/client/src/components/DonationResult.tsx` — 만듦 29 — 레퍼런스: `client/src/components/DonationResult.tsx`
- `image-donation/client/src/components/StreamerLayout.tsx` — 만듦 6, 바뀜 19, 20, 30 — 레퍼런스: `client/src/components/StreamerLayout.tsx`
- `image-donation/client/src/components/TestDonationPanel.tsx` — 만듦 30 — 레퍼런스: `client/src/components/TestDonationPanel.tsx`
- `image-donation/client/src/hooks/useImagePreview.ts` — 만듦 5 — 레퍼런스: `client/src/hooks/useImagePreview.ts`
- `image-donation/client/src/hooks/useMe.ts` — 만듦 19 — 레퍼런스: `client/src/hooks/useMe.ts`
- `image-donation/client/src/hooks/useDashboardHub.ts` — 만듦 19 — 레퍼런스: `client/src/hooks/useDashboardHub.ts`
- `image-donation/client/src/overlay/main.tsx` — 만듦 15, 바뀜 16 — 레퍼런스: `client/src/overlay/main.tsx`
- `image-donation/client/src/overlay/Overlay.tsx` — 만듦 15, 바뀜 18 — 레퍼런스: `client/src/overlay/Overlay.tsx`
- `image-donation/client/src/overlay/useOverlayHub.ts` — 만듦 15, 바뀜 16, 18 — 레퍼런스: `client/src/overlay/useOverlayHub.ts`
- `image-donation/client/src/overlay/overlay.css` — 만듦 15, 바뀜 18 — 레퍼런스: `client/src/overlay/overlay.css`
- `image-donation/client/src/pages/DonatePage.tsx` — 만듦 6, 바뀜 29 — 레퍼런스: `client/src/pages/DonatePage.tsx`
- `image-donation/client/src/pages/DashboardPage.tsx` — 만듦 6, 바뀜 19, 30, 31 — 레퍼런스: `client/src/pages/DashboardPage.tsx`
- `image-donation/client/src/pages/LoginPage.tsx` — 만듦 19, 바뀜 21, 23 — 레퍼런스: `client/src/pages/LoginPage.tsx`
- `image-donation/client/src/pages/OnboardingPage.tsx` — 만듦 30 — 레퍼런스: `client/src/pages/OnboardingPage.tsx`
- `image-donation/client/src/pages/SettingsPage.tsx` — 만듦 20, 바뀜 23 — 레퍼런스: `client/src/pages/SettingsPage.tsx`
- `image-donation/client/src/pages/DashboardPage.test.tsx` — 만듦 34 — 레퍼런스: `client/src/pages/DashboardPage.test.tsx`
- `image-donation/client/src/pages/DonatePage.test.tsx` — 만듦 34 — 레퍼런스: `client/src/pages/DonatePage.test.tsx`
- `image-donation/client/src/test/setup.ts` — 만듦 34 — 레퍼런스: `client/src/test/setup.ts`
- `image-donation/server/ImageDonation.slnx` — 만듦 8, 바뀜 25 — 레퍼런스: `server/ImageDonation.slnx`
- `image-donation/server/ImageDonation.Api/ImageDonation.Api.csproj` — 만듦 8, 바뀜 11, 13, 25 — 레퍼런스: `server/ImageDonation.Api/ImageDonation.Api.csproj`
- `image-donation/server/ImageDonation.Api/Properties/launchSettings.json` — 만듦 8 — 레퍼런스: `server/ImageDonation.Api/Properties/launchSettings.json`
- `image-donation/server/ImageDonation.Api/appsettings.json` — 만듦 8, 바뀜 10, 12, 13, 14, 21, 28, 35 — 레퍼런스: `server/ImageDonation.Api/appsettings.json`
- `image-donation/server/ImageDonation.Api/appsettings.Development.json` — 만듦 8 — 레퍼런스: `server/ImageDonation.Api/appsettings.Development.json`
- `image-donation/server/ImageDonation.Api/Program.cs` — 만듦 8, 바뀜 9, 10, 11, 12, 13, 14, 15, 16, 21, 24, 26, 28, 35, 36, 37 — 레퍼런스: `server/ImageDonation.Api/Program.cs`
- `image-donation/server/ImageDonation.Api/Data/AppDbContext.cs` — 만듦 8, 바뀜 9, 13, 23, 26, 31, 32 — 레퍼런스: `server/ImageDonation.Api/Data/AppDbContext.cs`
- `image-donation/server/ImageDonation.Api/Entities/Streamer.cs` — 만듦 9, 바뀜 13 — 레퍼런스: `server/ImageDonation.Api/Entities/Streamer.cs`
- `image-donation/server/ImageDonation.Api/Entities/StreamerSettings.cs` — 만듦 9 — 레퍼런스: `server/ImageDonation.Api/Entities/StreamerSettings.cs`
- `image-donation/server/ImageDonation.Api/Entities/Donation.cs` — 만듦 9 — 레퍼런스: `server/ImageDonation.Api/Entities/Donation.cs`
- `image-donation/server/ImageDonation.Api/Entities/ChzzkToken.cs` — 만듦 23 — 레퍼런스: `server/ImageDonation.Api/Entities/ChzzkToken.cs`
- `image-donation/server/ImageDonation.Api/Entities/DonationEvent.cs` — 만듦 26 — 레퍼런스: `server/ImageDonation.Api/Entities/DonationEvent.cs`
- `image-donation/server/ImageDonation.Api/Entities/BlockEntry.cs` — 만듦 31 — 레퍼런스: `server/ImageDonation.Api/Entities/BlockEntry.cs`
- `image-donation/server/ImageDonation.Api/Entities/Report.cs` — 만듦 31 — 레퍼런스: `server/ImageDonation.Api/Entities/Report.cs`
- `image-donation/server/ImageDonation.Api/Dtos/DonationDtos.cs` — 만듦 10, 바뀜 14, 15, 16, 26, 27, 31 — 레퍼런스: `server/ImageDonation.Api/Dtos/DonationDtos.cs`
- `image-donation/server/ImageDonation.Api/Dtos/AuthDtos.cs` — 만듦 13, 바뀜 23 — 레퍼런스: `server/ImageDonation.Api/Dtos/AuthDtos.cs`
- `image-donation/server/ImageDonation.Api/Dtos/SettingsDto.cs` — 만듦 16, 바뀜 20 — 레퍼런스: `server/ImageDonation.Api/Dtos/SettingsDto.cs`
- `image-donation/server/ImageDonation.Api/Endpoints/PublicEndpoints.cs` — 만듦 10, 바뀜 11, 12, 14, 31, 32, 33, 36 — 레퍼런스: `server/ImageDonation.Api/Endpoints/PublicEndpoints.cs`
- `image-donation/server/ImageDonation.Api/Endpoints/AuthEndpoints.cs` — 만듦 13, 바뀜 14, 23, 26 — 레퍼런스: `server/ImageDonation.Api/Endpoints/AuthEndpoints.cs`
- `image-donation/server/ImageDonation.Api/Endpoints/DashboardEndpoints.cs` — 만듦 16, 바뀜 17, 20, 31 — 레퍼런스: `server/ImageDonation.Api/Endpoints/DashboardEndpoints.cs`
- `image-donation/server/ImageDonation.Api/Endpoints/ChzzkEndpoints.cs` — 만듦 21, 바뀜 23, 24 — 레퍼런스: `server/ImageDonation.Api/Endpoints/ChzzkEndpoints.cs`
- `image-donation/server/ImageDonation.Api/Endpoints/TestModeEndpoints.cs` — 만듦 26 — 레퍼런스: `server/ImageDonation.Api/Endpoints/TestModeEndpoints.cs`
- `image-donation/server/ImageDonation.Api/Hubs/OverlayHub.cs` — 만듦 15, 바뀜 16, 17, 20 — 레퍼런스: `server/ImageDonation.Api/Hubs/OverlayHub.cs`
- `image-donation/server/ImageDonation.Api/Hubs/DashboardHub.cs` — 만듦 16 — 레퍼런스: `server/ImageDonation.Api/Hubs/DashboardHub.cs`
- `image-donation/server/ImageDonation.Api/Services/ImageProcessor.cs` — 만듦 11 — 레퍼런스: `server/ImageDonation.Api/Services/ImageProcessor.cs`
- `image-donation/server/ImageDonation.Api/Services/Storage/LocalImageStorage.cs` — 만듦 10, 바뀜 11, 12, 36 — 레퍼런스: `server/ImageDonation.Api/Services/Storage/LocalImageStorage.cs`
- `image-donation/server/ImageDonation.Api/Services/Storage/IImageStorage.cs` — 만듦 36 — 레퍼런스: `server/ImageDonation.Api/Services/Storage/IImageStorage.cs`
- `image-donation/server/ImageDonation.Api/Services/RetentionService.cs` — 만듦 12, 바뀜 26, 27, 36 — 레퍼런스: `server/ImageDonation.Api/Services/RetentionService.cs`
- `image-donation/server/ImageDonation.Api/Services/DonationService.cs` — 만듦 14, 바뀜 15, 16, 17, 26, 27, 28, 31, 36 — 레퍼런스: `server/ImageDonation.Api/Services/DonationService.cs`
- `image-donation/server/ImageDonation.Api/Services/DonationCodeMatcher.cs` — 만듦 27 — 레퍼런스: `server/ImageDonation.Api/Services/DonationCodeMatcher.cs`
- `image-donation/server/ImageDonation.Api/Services/BannedWordFilter.cs` — 만듦 33 — 레퍼런스: `server/ImageDonation.Api/Services/BannedWordFilter.cs`
- `image-donation/server/ImageDonation.Api/Services/ChzzkApiClient.cs` — 만듦 21, 바뀜 22, 24, 28 — 레퍼런스: `server/ImageDonation.Api/Services/ChzzkApiClient.cs`
- `image-donation/server/ImageDonation.Api/Services/Events/IDonationEventSource.cs` — 만듦 26 — 레퍼런스: `server/ImageDonation.Api/Services/Events/IDonationEventSource.cs`
- `image-donation/server/ImageDonation.Api/Services/Events/FakeDonationSource.cs` — 만듦 26 — 레퍼런스: `server/ImageDonation.Api/Services/Events/FakeDonationSource.cs`
- `image-donation/server/ImageDonation.Api/Services/Events/ChzzkSessionSource.cs` — 만듦 25, 바뀜 26, 28 — 레퍼런스: `server/ImageDonation.Api/Services/Events/ChzzkSessionSource.cs`
- `image-donation/server/ImageDonation.Api/Migrations/<시각>_InitialCreate.cs (+ .Designer.cs)` — 만듦 9 — 레퍼런스: 이름 다름(마이그레이션)
- `image-donation/server/ImageDonation.Api/Migrations/<시각>_AddIdentity.cs (+ .Designer.cs)` — 만듦 13 — 레퍼런스: 이름 다름(마이그레이션)
- `image-donation/server/ImageDonation.Api/Migrations/<시각>_AddChzzkTokens.cs (+ .Designer.cs)` — 만듦 23 — 레퍼런스: 이름 다름(마이그레이션)
- `image-donation/server/ImageDonation.Api/Migrations/<시각>_AddDonationEvents.cs (+ .Designer.cs)` — 만듦 26 — 레퍼런스: 이름 다름(마이그레이션)
- `image-donation/server/ImageDonation.Api/Migrations/<시각>_AddSafety.cs (+ .Designer.cs)` — 만듦 31 — 레퍼런스: 이름 다름(마이그레이션)
- `image-donation/server/ImageDonation.Api/Migrations/<시각>_AddImageFileIndex.cs (+ .Designer.cs)` — 만듦 32 — 레퍼런스: 이름 다름(마이그레이션)
- `image-donation/server/ImageDonation.Api/Migrations/AppDbContextModelSnapshot.cs` — 만듦 9, 바뀜 13, 23, 26, 31, 32 — 레퍼런스: `server/ImageDonation.Api/Migrations/AppDbContextModelSnapshot.cs`
- `image-donation/server/ImageDonation.Tests/ImageDonation.Tests.csproj` — 만듦 25, 바뀜 34 — 레퍼런스: `server/ImageDonation.Tests/ImageDonation.Tests.csproj`
- `image-donation/server/ImageDonation.Tests/ChzzkEmulator.cs` — 만듦 25 — 레퍼런스: `server/ImageDonation.Tests/ChzzkEmulator.cs`
- `image-donation/server/ImageDonation.Tests/ChzzkSessionSourceTests.cs` — 만듦 25, 바뀜 26, 28 — 레퍼런스: `server/ImageDonation.Tests/ChzzkSessionSourceTests.cs`
- `image-donation/server/ImageDonation.Tests/DonationCodeMatcherTests.cs` — 만듦 33 — 레퍼런스: `server/ImageDonation.Tests/DonationCodeMatcherTests.cs`
- `image-donation/server/ImageDonation.Tests/ImageProcessorTests.cs` — 만듦 33 — 레퍼런스: `server/ImageDonation.Tests/ImageProcessorTests.cs`
- `image-donation/server/ImageDonation.Tests/TestImages.cs` — 만듦 33 — 레퍼런스: `server/ImageDonation.Tests/TestImages.cs`
- `image-donation/server/ImageDonation.Tests/BannedWordFilterTests.cs` — 만듦 33 — 레퍼런스: `server/ImageDonation.Tests/BannedWordFilterTests.cs`
- `image-donation/server/ImageDonation.Tests/ApiFactory.cs` — 만듦 34, 바뀜 36 — 레퍼런스: `server/ImageDonation.Tests/ApiFactory.cs`
- `image-donation/server/ImageDonation.Tests/PublicDonationTests.cs` — 만듦 34 — 레퍼런스: `server/ImageDonation.Tests/PublicDonationTests.cs`
- `image-donation/server/ImageDonation.Tests/OverlayHubTests.cs` — 만듦 34, 바뀜 36 — 레퍼런스: `server/ImageDonation.Tests/OverlayHubTests.cs`
- `image-donation/server/ImageDonation.Tests/SafetyTests.cs` — 만듦 34 — 레퍼런스: `server/ImageDonation.Tests/SafetyTests.cs`
- `image-donation/server/ImageDonation.Tests/SettingsTests.cs` — 만듦 34 — 레퍼런스: `server/ImageDonation.Tests/SettingsTests.cs`
- `image-donation/server/ImageDonation.Tests/TestModeTests.cs` — 만듦 34 — 레퍼런스: `server/ImageDonation.Tests/TestModeTests.cs`
- `image-donation/server/ImageDonation.Tests/RetentionTests.cs` — 만듦 34 — 레퍼런스: `server/ImageDonation.Tests/RetentionTests.cs`
- `image-donation/server/ImageDonation.Tests/ChzzkApiClientTests.cs` — 만듦 36 — 레퍼런스: `server/ImageDonation.Tests/ChzzkApiClientTests.cs`
- `image-donation/server/ImageDonation.Tests/StubChzzkHandler.cs` — 만듦 36 — 레퍼런스: `server/ImageDonation.Tests/StubChzzkHandler.cs`
- `image-donation/server/ImageDonation.Tests/FailingDeleteStorage.cs` — 만듦 36 — 레퍼런스: `server/ImageDonation.Tests/FailingDeleteStorage.cs`
- `image-donation/tools/chzzk-emulator/package.json` — 만듦 25 — 레퍼런스: `tools/chzzk-emulator/package.json`
- `image-donation/tools/chzzk-emulator/package-lock.json` — 만듦 25 — 레퍼런스: `tools/chzzk-emulator/package-lock.json`
- `image-donation/tools/chzzk-emulator/emulator.cjs` — 만듦 25 — 레퍼런스: `tools/chzzk-emulator/emulator.cjs`
- `sp-practice/api.http` — 만듦 10, 바뀜 11, 13, 14, 16, 17, 26, 27 — 레퍼런스: 없음
- `sp-practice/images/` — 만듦 10, 바뀜 11 — 레퍼런스: 없음

## 7. 용어 배정표

### 7.1 SP가 담당하는 용어 (`textbook/content/glossary/sp.md`)

- [Day 1](#/day/sp-d01): 이미지 후원, 치지직, 치즈 후원, 검수, 결제 대행(PG), 정산, 테스트 모드
- [Day 2](#/day/sp-d02): 아키텍처, 구성도
- [Day 3](#/day/sp-d03): React, 컴포넌트, JSX, TSX, props, Oxlint
- [Day 4](#/day/sp-d04): 훅, useState, 조건부 렌더링, key (React), 불변 업데이트
- [Day 5](#/day/sp-d05): useEffect, 의존성 배열, 정리 함수, 커스텀 훅, 제어 컴포넌트, FileReader
- [Day 6](#/day/sp-d06): React Router, BrowserRouter, Outlet, 레이아웃 라우트
- [Day 8](#/day/sp-d08): Npgsql, 빠른 실패
- [Day 9](#/day/sp-d09): 상태 전이, 배열 열
- [Day 10](#/day/sp-d10): multipart/form-data, IFormFile, GUID, 경로 조작
- [Day 11](#/day/sp-d11): 매직 넘버, 디코딩, 재인코딩, EXIF, WebP, SkiaSharp, 압축 폭탄, 오픈소스 라이선스
- [Day 12](#/day/sp-d12): BackgroundService, 보관 기간, Cache-Control
- [Day 13](#/day/sp-d13): 온보딩, slug, 암호학적 난수, Base64Url
- [Day 14](#/day/sp-d14): HMAC, 공개 API
- [Day 15](#/day/sp-d15): SignalR, 허브, SignalR 그룹
- [Day 16](#/day/sp-d16): 오버레이 토큰, 보안 헤더
- [Day 17](#/day/sp-d17): 조건부 업데이트, ExecuteUpdate, 경쟁 상태
- [Day 18](#/day/sp-d18): 큐, useRef, useCallback, 자동 재연결
- [Day 19](#/day/sp-d19): 보호된 라우트
- [Day 20](#/day/sp-d20): 자동 승인, 금지어, useOutletContext, Clipboard API
- [Day 21](#/day/sp-d21): OAuth 2.0, 인가 코드, 액세스 토큰, 리프레시 토큰, state 값, OAuth 스코프, 리디렉션 URI
- [Day 22](#/day/sp-d22): 치지직 개발자 센터, Client ID, Client Secret, 치지직 Open API
- [Day 23](#/day/sp-d23): 토큰 교환, 계정 연결, 타이밍 공격
- [Day 24](#/day/sp-d24): Data Protection, 토큰 회전, SemaphoreSlim
- [Day 25](#/day/sp-d25): Socket.IO, Engine.IO, 세션 소켓, 에뮬레이터
- [Day 26](#/day/sp-d26): 페이로드, C# 이벤트, 브라우저 중계
- [Day 27](#/day/sp-d27): 후원 코드, 멱등성
- [Day 28](#/day/sp-d28): 할당량
- [Day 29](#/day/sp-d29): XMLHttpRequest, FormData, 업로드 진행률
- [Day 30](#/day/sp-d30): 사용자 여정
- [Day 31](#/day/sp-d31): 신고, 차단, 긴급 정지
- [Day 32](#/day/sp-d32): 개인정보, 최소 수집, 개인정보 처리방침, 이용약관, 초상권
- [Day 33](#/day/sp-d33): 경계값
- [Day 34](#/day/sp-d34): Vitest, Testing Library, jsdom, 모킹, 테스트 스키마
- [Day 35](#/day/sp-d35): 관측성, 헬스 체크, 구조화 로깅
- [Day 36](#/day/sp-d36): 객체 스토리지, S3 호환, 테스트 대역
- [Day 38](#/day/sp-d38): 휘발성 파일 시스템
- [Day 40](#/day/sp-d40): 운영 비용

### 7.2 다른 프로젝트 사전에 있는 용어 (`[[제목]]`으로 링크. P3 용어는 SP Day가 처음부터 가르치고, P1·P2 용어는 복습)

- [Day 2](#/day/sp-d02): 프론트엔드(P2), 백엔드(P2), API(P2), 포트(P2), localhost(P2), Git(P1), 커밋(P1)
- [Day 3](#/day/sp-d03): Vite(P2), 개발 서버(P2), 린터(P3), npm(P2), 실행 정책(P2)
- [Day 7](#/day/sp-d07): Docker(P3), 컨테이너(P3), 컨테이너 이미지(P3), Docker Hub(P3), Docker Desktop(P3), WSL 2(P3), 하드웨어 가상화(P3), Docker Compose(P3), 볼륨(P3), 포트 매핑(P3), PostgreSQL(P3), psql(P3), .env 파일(P3)
- [Day 8](#/day/sp-d08): 연결 문자열(P2), user-secrets(P2), EF Core(P2), DbContext(P2), NuGet(P2), 솔루션(P2), launchSettings.json(P2)
- [Day 9](#/day/sp-d09): 데이터베이스 인덱스(P3), 열거형(P2), 마이그레이션(P2), dotnet-ef(P2), 기본 키(P2)
- [Day 13](#/day/sp-d13): ASP.NET Core Identity(P2), 쿠키(P2), 인증(P2), 인가(P2), 검증(P2)
- [Day 14](#/day/sp-d14): 요청 제한(P2), 해싱(P2), 서비스 계층(P2), 의존성 주입(P2)
- [Day 15](#/day/sp-d15): WebSocket(P3), 프로토콜 업그레이드(P3), 폴링(P2), SSE(P2), 프록시(P2)
- [Day 16](#/day/sp-d16): 미들웨어(P2), 오버레이(P1), 브라우저 소스(P1)
- [Day 19](#/day/sp-d19): XSS(P2), 쿠키(P2), 출처(P2)
- [Day 25](#/day/sp-d25): WebSocket(P3), xUnit(P2)
- [Day 27](#/day/sp-d27): 정규 표현식(P1)
- [Day 29](#/day/sp-d29): LAN(P3), 사설 IP 주소(P3), Windows 방화벽(P3), 네트워크 프로필(P3)
- [Day 31](#/day/sp-d31): 트랜잭션(P3)
- [Day 33](#/day/sp-d33): 단위 테스트(P2), xUnit(P2), Assert(P2)
- [Day 34](#/day/sp-d34): 통합 테스트(P2), WebApplicationFactory(P2), 환경 변수(P2)
- [Day 37](#/day/sp-d37): Dockerfile(P3), 멀티스테이지 빌드(P3), 레이어 캐시(P3), .dockerignore(P3), 컨테이너 이미지(P3), Docker Compose(P3), 볼륨(P3), wwwroot(P2), dotnet publish(P2), 폴백 라우트(P2), 환경 변수(P2)
- [Day 38](#/day/sp-d38): 리버스 프록시(P2), X-Forwarded-For(P2), HTTPS(P2), 도메인 이름(P3), TLS(P3), 콜드 스타트(P3), 관리형 데이터베이스(P3)
- [Day 39](#/day/sp-d39): 방송 리허설(P3)

## 8. 확인하지 못한 것 (Day 작성자가 본문에 그대로 밝힐 것)

- 치지직 실서버 연동 전체(OAuth·토큰 교환·갱신·`users/me` 필드·세션 URL·구독·DONATION 페이로드 모양·`payAmount` 타입·채팅 전송), 개발자 센터의 `http://localhost` 리디렉션 URL 허용 여부, 스코프 심사 기간, Quota 수치, 개발자 센터 이용 약관 조항, 개발 중 `http://localhost:5173/api/chzzk/callback`(Vite 프록시 경유) 리디렉션 방식.
- Windows에서 SkiaSharp 실행(레퍼런스는 패키지 구성과 게시 결과만 확인).
- Windows 11 실기: PowerShell 명령 출력, winget PostgreSQL 설치 경로, Docker Desktop(특히 Home 에디션), Data Protection 키 기본 위치, 방화벽 창 문구, REST Client multipart 실행.
- OBS 실제 화면(브라우저 소스 투명 합성, 애니메이션).
- SP의 실제 배포(Day 38의 선택지는 문서 조사만).
- 이 환경에서 직접 확인한 것: 레퍼런스 README의 검증 기록(서버 54개·화면 8개 테스트, e2e, Docker), create-vite 9.3.3 `react-ts` 템플릿 파일 목록(`npm pack`으로 확인: README.md, `_gitignore`, `_oxlintrc.json`, index.html, package.json, public/favicon.svg, public/icons.svg, src/App.css, src/App.tsx, src/assets/{hero.png,react.svg,vite.svg}, src/index.css, src/main.tsx, tsconfig 3개, vite.config.ts — tsconfig 3개·`.oxlintrc.json`·`.gitignore`·favicon은 레퍼런스와 같고 index.html은 lang·title만 다름), Day 37의 `docker compose run -d --rm --name … -p 127.0.0.1:5432:5432 db`(레퍼런스 compose, Docker Compose v5.6.1, postgres 18.6에 psql 접속 확인).
- Day 작성자가 실행해서 원문을 캡처해야 하는 것: 각 Day의 오류 메시지 원문(TypeScript·dotnet·EF·SignalR·브라우저 콘솔), `dotnet new web`이 만드는 파일 목록, 테스트 개수.

## 9. 부록: 중간 단계 파일의 정해진 모양

레퍼런스에 없는 중간 단계 코드는 아래 모양을 **그대로** 쓴다(이름·타입·값을 바꾸지 않는다). 여러 Day가 이 모양을 이어받기 때문이다. 아래 코드는 작성 환경에서 컴파일·실행하지 않았다. Day 작성자는 CONTENT-GUIDE 6장대로 실행해 확인하고, 고쳐야 하면 이 개요와 함께 고친다.

### 부록 A. 예시 후원 3건 (Day 4 `App.tsx`의 배열, Day 5 `public\sample-donations.json`)

Day 4는 `App.tsx`에 `const initialDonations: Donation[] = [ … ]`로, Day 5는 같은 값을 JSON 파일로 옮긴다(Day 6 `DashboardPage`가 이어 쓰고 Day 19에서 지운다). 이미지는 아직 없어서 `imageUrl`은 모두 `null`이다(카드는 Day 3부터 `imageUrl`이 없으면 그림 자리를 비운다).

```json
[
  { "id": 3, "status": "Pending", "nickname": "고양이집사", "message": "오늘 방송 재밌어요!", "imageUrl": null, "createdAt": "2026-11-01T12:30:00Z" },
  { "id": 2, "status": "Pending", "nickname": "밤하늘", "message": "첫 후원이에요", "imageUrl": null, "createdAt": "2026-11-01T12:10:00Z" },
  { "id": 1, "status": "Approved", "nickname": "단골시청자", "message": "", "imageUrl": null, "createdAt": "2026-11-01T11:50:00Z" }
]
```

### 부록 B. Day 5 `DonationForm`의 props (Day 6이 쓰고 Day 29가 바꾼다)

```tsx
// Day 5: 보내기를 누르면 고른 값을 부모에게 넘긴다(서버 업로드는 Day 29)
export interface DonationDraft {
  file: File
  previewUrl: string | null // useImagePreview가 아직 읽는 중이면 null
  nickname: string
  message: string
}

interface Props {
  onSubmit: (draft: DonationDraft) => void
}
```

- Day 5 `App.tsx`: `onSubmit={(d) => setDonations((list) => [{ id: Date.now(), status: 'Pending', nickname: d.nickname, message: d.message, imageUrl: d.previewUrl, createdAt: new Date().toISOString() }, ...list])}`
- Day 6 `DonatePage.tsx`: ``onSubmit={(d) => window.alert(`${d.nickname}님의 후원을 보낼 준비가 됐어요. 진짜로 보내는 것은 Day 29에서 만들어요.`)}``
- Day 29: props가 레퍼런스의 `{ streamer: PublicStreamer; onDone: (result: CreateDonationResult) => void }`로 바뀌고 `DonationDraft`는 지운다.

### 부록 C. 오버레이 첫 버전 (Day 15 → Day 16에서 토큰 → Day 18에서 레퍼런스로)

```ts
// Day 15 src/overlay/useOverlayHub.ts의 겉모양
export type OverlayStatus = 'connecting' | 'connected' | 'failed'

// Day 15: 토큰 없음. 받은 후원을 setQueue로 큐 뒤에 붙이고, 연결 상태를 돌려준다
export function useOverlayHub(setQueue: Dispatch<SetStateAction<OverlayDonation[]>>): OverlayStatus
// Day 16: 첫 매개변수로 token 추가, 주소는 `/hubs/overlay?token=${encodeURIComponent(token)}`
export function useOverlayHub(token: string, setQueue: Dispatch<SetStateAction<OverlayDonation[]>>): OverlayStatus
// Day 18(레퍼런스): 'reconnecting' 추가, 돌려주는 값이 { status, markShown }으로 바뀐다
```

```tsx
// Day 15 src/overlay/Overlay.tsx (목록 버전. Day 16에서 ({ token }: { token: string })를 받는다)
import { useState } from 'react'
import type { OverlayDonation } from '../api'
import { useOverlayHub } from './useOverlayHub'

export default function Overlay() {
  const [queue, setQueue] = useState<OverlayDonation[]>([])
  const status = useOverlayHub(setQueue)

  return (
    <div className="overlay" data-status={status}>
      <p className="overlay-error">{status === 'connected' ? '연결됨' : status === 'failed' ? '연결 실패' : '연결 중…'}</p>
      {queue.map((d) => (
        <figure key={d.id} className="donation">
          <img src={d.imageUrl} alt="" />
          <figcaption>
            <strong>{d.nickname}</strong>
            {d.message && <span>{d.message}</span>}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
```

Day 15 `src/overlay/main.tsx`는 `createRoot(document.getElementById('overlay-root')!).render(<StrictMode><Overlay /></StrictMode>)`이고 `./overlay.css`를 import한다. Day 16에 레퍼런스(토큰 읽기·없으면 안내)로 바뀐다.

### 부록 D. `ChzzkSessionSource` 생성자 (Day 25 → 26 → 28)

```csharp
// Day 25: 아직 일반 클래스. 쓰는 것만 받는다(쓰지 않는 주 생성자 매개변수는 CS9113 경고가 난다)
public sealed class ChzzkSessionSource(ILogger<ChzzkSessionSource> logger)

// Day 26: 이벤트 출처가 되고, DONATION을 해석할 때 받은 시각이 필요하다
public sealed class ChzzkSessionSource(ILogger<ChzzkSessionSource> logger, TimeProvider time) : IDonationEventSource

// Day 28(레퍼런스): 스스로 세션을 점검하는 BackgroundService. 매개변수 순서도 레퍼런스와 같게
public sealed class ChzzkSessionSource(
    IServiceScopeFactory scopes,
    IOptions<ChzzkOptions> options,
    ILogger<ChzzkSessionSource> logger,
    TimeProvider time) : BackgroundService, IDonationEventSource
```

테스트의 `CreateSource()`도 같은 Day에 같이 바뀐다.

```csharp
// Day 25
private static ChzzkSessionSource CreateSource() => new(NullLogger<ChzzkSessionSource>.Instance);
// Day 26
private static ChzzkSessionSource CreateSource() => new(NullLogger<ChzzkSessionSource>.Instance, TimeProvider.System);
// Day 28: 레퍼런스의 CreateSource() 그대로(IServiceScopeFactory, Options.Create(new ChzzkOptions()), NullLogger, TimeProvider.System)
```

Day 26의 `Program.cs`는 `AddSingleton<ChzzkSessionSource>()`(로거·TimeProvider는 DI가 채움)이고, Day 28에 `AddHostedService(sp => sp.GetRequiredService<ChzzkSessionSource>())`를 더한다.

### 부록 E. Day 25 연습 테스트 (Day 26에서 레퍼런스의 `ChzzkSessionSource_ReceivesDonations_FromSocketIo2Emulator`로 바뀐다)

`ChzzkSessionSourceTests.cs`의 `Url(...)`, `WaitUntilAsync(...)` 도우미와 `SplitSessionUrl_MovesAuthToQueryOption`은 레퍼런스와 같게 쓰고, 이 테스트 하나를 더한다(using은 레퍼런스 파일 맨 위와 같음).

```csharp
[Fact]
public async Task ChzzkSessionSource_ConnectsToEmulator_GetsSessionKey()
{
    // 로컬 Socket.IO 2.5.0(EIO=3) 에뮬레이터: 실제 치지직 서버가 아니다
    await using var emulator = await ChzzkEmulator.StartAsync();
    var source = CreateSource();

    var gotKey = new TaskCompletionSource<string>();
    await source.ConnectAsync(7, Url(emulator), key =>
    {
        gotKey.TrySetResult(key); // 실제 서비스는 이 키로 후원 이벤트 구독 API를 부른다(Day 28)
        return Task.CompletedTask;
    });

    Assert.Equal("sess-123", await gotKey.Task.WaitAsync(TimeSpan.FromSeconds(15)));
    await WaitUntilAsync(() => emulator.Output.Contains("CONNECTED auth=test-auth-token EIO=3"));
    Assert.True(source.IsConnected(7));

    await source.DisconnectAllAsync();
    Assert.False(source.IsConnected(7));
}
```

### 부록 F. `C:\dev\sp-practice\api.http` (Day 10에 만들고 Day 11·13·14·16·17·26·27에 요청을 덧붙인다)

- 변수: `@host = http://localhost:5080`(바뀌지 않음), `@slug = test-stream`(Day 10~12) → Day 13부터 `@slug = my-stream`, `@id = 1`(Day 17부터, 목록에서 본 후원 번호로 고쳐 쓴다).
- 요청 이름은 `### 번호. 설명 (Day N)`으로 쓰고, 번호는 아래 순서를 지킨다(Day 작성자는 자기 Day의 요청만 덧붙인다).
- multipart 경계 문자열은 항상 `ImageDonationBoundary`(헤더는 `boundary=ImageDonationBoundary`, 본문 줄은 앞에 `--`, 마지막 줄은 `--ImageDonationBoundary--`).
- REST Client에서 실제로 보내 보는 것은 작성 환경에서 확인하지 못했다(작성자가 실행해 확인).

```http
@host = http://localhost:5080
@slug = my-stream
@id = 1

### 1. 이미지 후원 보내기 (Day 10)
POST {{host}}/api/public/streamers/{{slug}}/donations
Content-Type: multipart/form-data; boundary=ImageDonationBoundary

--ImageDonationBoundary
Content-Disposition: form-data; name="image"; filename="photo.jpg"
Content-Type: image/jpeg

< ./images/photo.jpg
--ImageDonationBoundary
Content-Disposition: form-data; name="nickname"

시청자
--ImageDonationBoundary
Content-Disposition: form-data; name="message"

안녕하세요
--ImageDonationBoundary--

### 2. 너무 큰 파일 → 413 (Day 10)
# 1번과 같고 filename="big.jpg", < ./images/big.jpg 만 다르다

### 3. 이름만 바꾼 글자 파일 → 400 (Day 11)
# 1번과 같고 filename="fake.png", Content-Type: image/png, < ./images/fake.png

### 4. 움직이는 GIF → 정지 WebP (Day 11)
# 1번과 같고 filename="animated.gif", Content-Type: image/gif, < ./images/animated.gif

### 5. 가입 (Day 13)
POST {{host}}/api/auth/register
Content-Type: application/json

{ "email": "me@example.com", "password": "<대문자·소문자·숫자·기호 6자 이상>" }

### 6. 로그인(쿠키) (Day 13)
POST {{host}}/api/auth/login?useCookies=true
Content-Type: application/json

{ "email": "me@example.com", "password": "<5번과 같은 비밀번호>" }

### 7. 내 정보 (Day 13)
GET {{host}}/api/auth/me

### 8. 온보딩 (Day 13)
POST {{host}}/api/auth/onboarding
Content-Type: application/json

{ "slug": "my-stream", "displayName": "내 방송" }

### 9. 로그아웃 (Day 13)
POST {{host}}/api/auth/logout

### 10. 후원 페이지 정보 (Day 14)
GET {{host}}/api/public/streamers/{{slug}}

### 11. 닉네임 21자 → 400 (Day 14)
# 1번과 같고 nickname 칸만 21자

### 12. 오버레이 토큰 (Day 16)
GET {{host}}/api/dashboard/overlay-token

### 13. 후원 목록 (Day 17)
GET {{host}}/api/dashboard/donations

### 14. 승인 (Day 17)
POST {{host}}/api/dashboard/donations/{{id}}/approve

### 15. 거절 (Day 17)
POST {{host}}/api/dashboard/donations/{{id}}/reject

### 16. 테스트 모드: 가짜 치즈 후원 (Day 26)
POST {{host}}/api/dashboard/test-donation
Content-Type: application/json

{ "amount": 1000, "message": "안녕" }

### 17. 테스트 모드: 코드를 넣은 가짜 치즈 후원 (Day 27)
# 치즈 모드에서 1번으로 받은 코드(예: #K3P9)로 바꿔 보낸다. 코드는 JSON 따옴표 안에 둔다(줄 맨 앞의 #은 주석)
POST {{host}}/api/dashboard/test-donation
Content-Type: application/json

{ "amount": 1000, "message": "이미지 부탁해요 #K3P9" }
```

Day 10~12 파일은 `@slug = test-stream`이고 1·2번 요청만(Day 11에 3·4번) 있다. 2·3·4·11번은 본문에서 1번을 복사해 바꾼 전체 요청을 싣는다(위 주석 줄은 개요용 줄임).

### 부록 G. Day 10 `LocalImageStorage` 첫 버전 (Day 11 `.webp`, Day 12 읽기·지우기, Day 36 `IImageStorage`)

```csharp
using System.Text.RegularExpressions;

namespace ImageDonation.Api.Services.Storage;

// 서버 PC의 폴더에 업로드 파일을 저장한다 (설정 Storage:MediaPath, 기본은 프로젝트 폴더의 media)
public sealed partial class LocalImageStorage
{
    private readonly string _root;

    public LocalImageStorage(IConfiguration configuration, IWebHostEnvironment env)
    {
        _root = Path.GetFullPath(configuration["Storage:MediaPath"] ?? "media", env.ContentRootPath);
        Directory.CreateDirectory(_root);
    }

    // 우리가 만든 이름(GUID 32자리 + .bin)만 허용 → "../" 같은 경로 조작을 원천 차단
    // 끝은 $가 아니라 \z: $는 맨 끝의 줄바꿈("…bin\n")도 통과시킨다
    [GeneratedRegex("^[0-9a-f]{32}\\.bin\\z")]
    private static partial Regex FileNamePattern();

    public static bool IsValidFileName(string fileName) => FileNamePattern().IsMatch(fileName);

    // .bin = 아직 무엇인지 검사하지 않은 바이트 (Day 11부터는 검사·재인코딩한 .webp)
    public async Task<string> SaveAsync(byte[] content, CancellationToken ct = default)
    {
        var fileName = $"{Guid.NewGuid():N}.bin"; // 시청자가 보낸 파일 이름은 쓰지 않는다
        await File.WriteAllBytesAsync(Path.Combine(_root, fileName), content, ct);
        return fileName;
    }
}
```

Day 10 엔드포인트는 `using var buffer = new MemoryStream(); await image.CopyToAsync(buffer, ct); var fileName = await storage.SaveAsync(buffer.ToArray(), ct);`로 부른다. Day 11에 레퍼런스처럼 `SaveAsync(byte[] content, string extension, CancellationToken ct = default)`(이름을 만든 뒤 `IsValidFileName`으로 확인)와 `.webp` 패턴으로 바뀐다.
