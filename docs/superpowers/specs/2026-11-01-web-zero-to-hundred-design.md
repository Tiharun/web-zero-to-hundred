# Web Zero to Hundred — 설계서 (Design Spec)

- 작성일: 2026-11-01
- 상태: 사용자 검토 대기
- 리포지토리: `tiharun/web-zero-to-hundred`
- 작업 브랜치: `claude/gifted-goldberg-u1f9c6`

---

## 1. 목적과 독자

### 1.1 사용자가 말한 것
- 프로그래밍 공부의 **첫 단추**로 웹사이트를 0%부터 100%까지 혼자 만들어 보고 싶다.
- 교재는 **단일 HTML 웹사이트**여야 한다. Day 1부터 마지막 날까지의 일정·계획·과제·정답을 담는다.
- 프로젝트를 차례로 **해금**한다. 1차를 완수해야 2차가 열리고, 각 프로젝트는 Day 1부터 시작한다.
- 독자는 **지식 0%의 초보자**다. 설명은 친절해야 하고 경로는 자세해야 한다.
- 사용 환경은 **Windows 11**이고, 하루 공부 시간은 **약 1~2시간**이다.
- 최종 목표: 사이트·게임·리깅·유니티·언리얼 등을 다루는 실력 있는 개발자, 콘텐츠를 자급자족하는 스트리머·유튜버, 외주, MCN 회사 창업.
- 최종적으로 배우고 싶은 언어는 **C++과 Rust**다(먼 미래).
- 이미지 도네이션 서비스(스트리머가 쓰고 시청자가 이미지를 후원하는 서비스)는 오래전부터 만들고 싶던 프로젝트다. 운영자가 돈을 받는 구조가 아니다. → **특별 프로젝트**로 분리한다.
- 3차 프로젝트까지 완수하면 **졸업 로드맵**을 반드시 넣는다.
- 4차 프로젝트를 추가할 수 있도록, 다른 세션이 바로 이어받을 수 있는 **MD 인수인계 문서**를 만든다.

### 1.2 설계상 가정 (사용자 확인 완료 또는 합리적 기본값)
- 교재는 인터넷 없이 `index.html`을 더블클릭해도 동작한다(외부 CDN 없음).
- 진도는 브라우저 `localStorage`에 저장하고, 백업 파일 내보내기와 불러오기를 제공한다.
- 정답은 처음에 가려 둔다.
- 학습자 작업 폴더의 루트는 `C:\dev\`다. 공백·한글·OneDrive 동기화 경로는 피한다.

### 1.3 성공 기준
1. 0% 초보자가 교재만 보고 Day 1부터 막힘 없이 따라갈 수 있다. 막히는 곳은 "자주 막히는 곳"과 "문제 해결 모음"으로 안내한다.
2. 모든 Day는 끝나면 눈에 보이는 결과물이 남는다.
3. 프로젝트 1이 끝나면 인터넷에 실제로 공개된 내 웹사이트(GitHub Pages)가 생긴다.
4. 교재의 정답 코드는 작성 환경에서 **실제로 빌드·실행·테스트되어 검증**되었다. 검증하지 못한 부분은 명시한다.
5. 다음 세션이 `HANDOFF.md`만 읽고 4차 프로젝트를 추가할 수 있다.

---

## 2. 커리큘럼 전체 구조

### 2.1 언어 성장 경로
```
HTML/CSS/JS ──▶ TypeScript ──▶ C# ──▶ Rust ──▶ (졸업 후) C++ · 언리얼 / 유니티
 (P1)            (P2)          (P2·SP)  (P3)
```
- **JS → TS**: 같은 문법에 "타입"을 더한다.
- **TS → C#**: 정적 타입 + 컴파일 언어. 유니티의 언어다.
- **C# → Rust**: GC 없는 메모리 관리(소유권). 이 개념이 C++(언리얼)로 이어진다.
- C++을 웹 서버로 쓰는 경우는 실무에서 드물다. 그래서 C++은 졸업 로드맵에서 언리얼과 함께 다룬다.

### 2.2 해금 순서
```
P1 (30 Day) ──▶ P2 (40 Day) ──┬──▶ P3 (45 Day) ──▶ 🎓 졸업 로드맵
                              └──▶ ⭐ SP 특별 (40 Day) — P2 완료 후 언제든 (P3 전·후 모두 가능)
```
- 총 155 Day. 하루 1~2시간 기준으로 약 5~6개월이다.

### 2.3 프로젝트별 요약

| ID | 이름 | 결과물 | 스택 | Day |
|---|---|---|---|---|
| `p1` | 첫 웹사이트 | **나의 크리에이터 홈페이지** + OBS 카운트다운 오버레이 | HTML, CSS, JavaScript, Git/GitHub, GitHub Pages | 30 |
| `p2` | 더 발전된 웹사이트 | **스트리머 허브**: 스트리머 목록, 방송 일정, 팬 게시판, 로그인, 관리자, 실시간 공지 오버레이 | TypeScript(Vite), C#·ASP.NET Core(.NET 10 LTS), SQL·SQLite·EF Core, ASP.NET Core Identity, xUnit | 40 |
| `p3` | 시청자 참여 실시간 게임 | **시청자 참여 멀티플레이 웹게임**: OBS 화면에 아레나가 뜨고, 시청자가 휴대폰으로 QR 접속해 조종 | Rust(Axum·Tokio·WebSocket), Rust→WebAssembly, TypeScript·Canvas 2D, PostgreSQL·SQLx, Docker | 45 |
| `sp` | 특별: 이미지 도네이션 | **이미지 후원 서비스**: 스트리머가 가입하면 후원 페이지와 오버레이가 발급되고, 시청자가 이미지를 후원하며, 검수를 거쳐 방송에 표시 | C#·ASP.NET Core·SignalR, React+TS, PostgreSQL·EF Core(Npgsql), Docker, 치지직 Open API·OAuth 2.0 | 40 |
| `grad` | 졸업 로드맵 | 다음 학습 경로 + 4차 프로젝트 후보 | — | — |

### 2.4 특별 프로젝트의 돈 흐름 원칙 (중요)
- 운영자(학습자)는 결제를 **전혀 다루지 않는다**. PG 연동도 없고 정산도 없다.
- 모드 ① **무료 이미지 후원**: 시청자가 이미지와 메시지를 보낸다. 돈은 오가지 않는다.
- 모드 ② **치즈 연동(선택)**: 시청자가 치지직 공식 "치즈 후원"을 할 때 메시지에 후원 코드를 넣는다. 서버는 치지직 세션 이벤트로 이를 확인한 뒤 이미지를 표시한다. 돈은 치지직이 스트리머에게 직접 정산한다.
- **테스트 모드**(가짜 후원 이벤트 발생기)를 둔다. 치지직 API 승인이 없어도 전체 흐름을 실습할 수 있다.

### 2.5 치지직 Open API 관련 확인 사항과 위험
SDK 문서를 통해 확인한 사항이다. 공식 문서는 구현 시점에 다시 확인한다.
- 개발자 센터에 앱을 등록하고 Client ID/Secret을 발급받는다. OAuth 로그인을 쓴다.
- 채팅 전송, 채널·라이브 조회, 세션 소켓(**Socket.IO 2.x**)을 통한 채팅·후원 이벤트 구독을 제공한다.
- 제약: 미션 후원은 받을 수 없다. 리프레시 토큰은 1회용이며 회전한다. 90일 동안 쓰지 않은 앱은 자동 삭제된다. 세션 URL은 1회용이다.
- **API로 방송 화면에 미디어를 직접 넣는 기능은 없다.** 모든 화면 표시는 **OBS 브라우저 소스**(우리가 만든 웹페이지)로 한다.
- 위험: .NET용 Socket.IO 클라이언트가 2.x(EIO v3)를 지원하는지 구현 시 검증해야 한다. 지원하지 않으면 **브라우저 대시보드가 세션 소켓에 연결해 서버로 중계**하는 방식으로 바꾼다.

---

## 3. Day 단위 일정 (전체)

> 각 Day는 약 1~2시간 분량이다. 제목과 핵심 내용만 적는다. 상세 목표와 키워드는 `textbook/content/curriculum.json`에 둔다.

### 3.1 P1 — 나의 크리에이터 홈페이지 (`C:\dev\my-creator-site\`)
| Day | 제목 | 핵심 |
|---|---|---|
| 1 | 컴퓨터와 웹의 첫걸음 | 인터넷·브라우저·웹사이트, 파일·폴더·확장자, 확장자 표시 켜기, `C:\dev` 만들기, 메모장으로 첫 HTML |
| 2 | 개발 도구 설치 | VS Code(한국어 팩, Live Preview), Chrome, 폴더 열기, 저장·자동 저장 |
| 3 | HTML 기본 구조 | 태그·요소·속성, `<!DOCTYPE>`, head/body, 제목·문단, 주석, Emmet `!` |
| 4 | 텍스트·목록·링크 | strong/em, ul/ol, `<a>`, **절대 경로 vs 상대 경로**, 여러 페이지 |
| 5 | 이미지와 경로 완전정복 | `<img>`, `images/` 폴더, `./` `../`, 파일명 규칙, 이미지 형식 |
| 6 | 시맨틱 구조 | header/nav/main/section/footer, div/span, 개발자도구 Elements |
| 7 | Git·GitHub 시작 | Git 설치(옵션 설명), 사용자 설정, GitHub 가입, 저장소, 커밋·푸시 |
| 8 | 표·폼·미디어 | 방송 일정표(table), 연락 폼, YouTube iframe |
| 9 | CSS 시작 | link 연결, 선택자, 색·글꼴, `css/style.css` |
| 10 | 박스 모델 | margin/padding/border, box-sizing, 단위(px/rem/%) |
| 11 | Flexbox | 내비게이션 바, 정렬, gap, wrap |
| 12 | Grid | 콘텐츠 카드 그리드, repeat/minmax/auto-fit |
| 13 | 반응형 웹 | viewport, 미디어 쿼리, 모바일 우선, 기기 모드 |
| 14 | 꾸미기 + 첫 배포 | CSS 변수, hover/transition, **GitHub Pages 배포** |
| 15 | JavaScript 시작 | script·defer, Console, let/const, 자료형, 연산자 |
| 16 | 조건문 | if/else, `===`, 논리 연산, 템플릿 리터럴, 시간대별 인사 |
| 17 | 반복문과 배열 | for, for…of, 배열 기본 |
| 18 | 함수 | 선언·매개변수·return, 화살표 함수, 스코프 |
| 19 | 객체와 배열 메서드 | 객체, 영상 목록 데이터, map/filter/forEach |
| 20 | DOM 다루기 | querySelector, textContent, classList, createElement, 데이터로 카드 그리기 |
| 21 | 이벤트 | addEventListener, 모바일 햄버거 메뉴, 이벤트 위임 |
| 22 | 다크 모드와 localStorage | 테마 토글, 저장, prefers-color-scheme |
| 23 | 필터와 검색 | input 이벤트, 카테고리 필터 |
| 24 | 폼 검증 | required/pattern, JS 검증, aria-live 피드백 |
| 25 | JSON과 fetch | JSON, `data/videos.json`, async/await, file:// 제약, 오류 처리 |
| 26 | 날짜와 타이머 | Date, 오늘 요일 강조, 다음 방송 카운트다운 |
| 27 | OBS 오버레이 위젯 | `overlay/countdown.html`, 투명 배경, URL 파라미터, OBS 브라우저 소스 |
| 28 | 품질 높이기 | 접근성, SEO·Open Graph·파비콘, 성능, Lighthouse |
| 29 | 디버깅과 정리 | 디버거 중단점, 흔한 오류, 폴더 정리, README.md |
| 30 | 최종 배포와 회고 | 최종 점검표, 배포 확인, 회고 → **P2 해금** |

### 3.2 P2 — 스트리머 허브 (`C:\dev\streamer-hub\` = `client\` + `server\`)
| Day | 제목 | 핵심 |
|---|---|---|
| 1 | 풀스택 큰 그림 | 프론트·백·DB·API, 요청/응답, 완성본 미리보기 |
| 2 | 터미널 기초 | Windows Terminal·PowerShell, cd/dir/mkdir, 경로, 탭 완성 |
| 3 | Node.js와 npm | LTS 설치, package.json, node_modules, **실행 정책 오류 해결** |
| 4 | TypeScript 시작 | 왜 TS인가, tsc, 기본 타입, 추론, 오류 읽기 |
| 5 | 타입 설계 | interface/type, optional, union, literal — Streamer 타입 |
| 6 | 함수·제네릭·모듈 | 함수 타입, 제네릭 기초, import/export |
| 7 | Vite 프로젝트 | vanilla-ts 템플릿, dev 서버, 빌드 |
| 8 | 비동기 깊게 | Promise, async/await, 타입 있는 fetch, 로딩·오류 UI |
| 9 | .NET과 첫 C# | .NET 10 SDK, C# Dev Kit, `dotnet new console`, 컴파일 |
| 10 | C# 기본 문법 | 타입, 문자열 보간, if/switch, 반복 |
| 11 | 메서드와 컬렉션 | 메서드, List/Dictionary, nullable |
| 12 | 클래스와 객체 | 생성자, 속성, 접근 제한자, record — 유니티 연결 |
| 13 | 상속과 인터페이스 | virtual/override, interface, 다형성 |
| 14 | LINQ와 람다 | Where/Select/OrderBy, JS map/filter와 비교 |
| 15 | 예외와 async | try/catch, Task, async/await |
| 16 | HTTP와 REST | 메서드·상태 코드·헤더·JSON, REST 설계, `.http` 파일 |
| 17 | 첫 웹 API | Minimal API, MapGet, 포트, `dotnet watch` |
| 18 | 메모리 CRUD API | 라우트 파라미터, POST/PUT/DELETE, TypedResults |
| 19 | DB와 SQL 기초 | 테이블·키, SELECT/INSERT/UPDATE/DELETE, SQLite |
| 20 | EF Core 연결 | DbContext, 엔티티, 마이그레이션(dotnet-ef) |
| 21 | DB CRUD | API를 DB로 전환, 비동기 쿼리, 시드 |
| 22 | 관계 설계 | 1:N(스트리머-일정), 외래키, Include |
| 23 | 구조화 | DTO, 검증, 의존성 주입, 서비스 계층, MapGroup |
| 24 | 오류·설정·로깅 | ProblemDetails, appsettings, 환경, ILogger |
| 25 | 회원가입·로그인 | 인증/인가, 해싱, 쿠키, Identity API 엔드포인트 |
| 26 | 권한 | 역할(Admin), RequireAuthorization, /api/me, 관리자 시드 |
| 27 | 프론트↔백 연결 | CORS, Vite 프록시, 타입 있는 API 클라이언트 |
| 28 | 목록·상세 페이지 | 해시 라우터 직접 구현, 상세 화면 |
| 29 | 방송 일정 페이지 | 주간 일정, **UTC vs 한국 시간**, 필터 |
| 30 | 팬 게시판 API | 작성자 연결, 페이지네이션, 본인만 수정·삭제 |
| 31 | 팬 게시판 화면 | 목록·작성·수정·삭제, 로그인/가입 화면 |
| 32 | 관리자 화면 | 스트리머·일정 관리, 역할 기반 UI |
| 33 | 실시간 공지 오버레이 | 공지 API, OBS 오버레이, 폴링 → SSE |
| 34 | 보안 점검 | XSS, CSRF·SameSite, SQL 인젝션, 요청 제한, HTTPS |
| 35 | 단위 테스트 | xUnit, 서비스 테스트 |
| 36 | 통합 테스트 | WebApplicationFactory, `tsc --noEmit` |
| 37 | 코드 품질과 Git 흐름 | dotnet format, Prettier, 브랜치·PR |
| 38 | 프로덕션 빌드 | vite build → wwwroot, `dotnet publish`, 단일 앱 |
| 39 | 배포 | 작성 시점에 검증한 배포 옵션, DB 파일 위치, 백업 |
| 40 | 최종 점검과 회고 | README·스크린샷, 회고 → **P3·SP 해금** |

### 3.3 P3 — 시청자 참여 실시간 게임 (`C:\dev\viewer-arena\` = Rust workspace + `client\`)
| Day | 제목 | 핵심 |
|---|---|---|
| 1 | 왜 Rust인가 + 설치 | rustup, **VS C++ Build Tools**, rust-analyzer, cargo |
| 2 | 변수·타입·함수 | let/mut, 섀도잉, 표현식 |
| 3 | 제어 흐름 | if, loop/while/for, match 기초 |
| 4 | 소유권 ① | 스택/힙, move, clone, Copy — GC와 비교, C++ 연결 |
| 5 | 소유권 ② 빌림 | `&`, `&mut`, 규칙, 슬라이스, String vs &str |
| 6 | 구조체와 메서드 | struct, impl — **Vec2 만들기** |
| 7 | 열거형과 match | enum, Option, if let — 게임 메시지 타입 |
| 8 | 오류 처리 | Result, `?`, panic, 사용자 오류 타입 |
| 9 | 컬렉션과 반복자 | Vec, HashMap, iterator, closure |
| 10 | 트레이트와 제네릭 | trait, derive, 연산자 오버로딩(Vec2 + Vec2) |
| 11 | 모듈·워크스페이스·테스트 | mod/pub/use, workspace, cargo test, serde |
| 12 | 수명·스마트 포인터·동시성 맛보기 | lifetime, Box/Rc/Arc, Mutex, 스레드 |
| 13 | 게임 루프의 원리 | update/render, delta time, requestAnimationFrame |
| 14 | Canvas 2D | 도형, 좌표계, DPR 대응 |
| 15 | 입력 처리 | 키보드, 터치, 가상 조이스틱 |
| 16 | 벡터와 이동 | 속도·가속·마찰, 정규화 |
| 17 | 충돌 | 원-원·경계 충돌, 밀어내기 |
| 18 | 게임 규칙 | 아이템, 점수, 라운드, 상태 머신 |
| 19 | game-core 크레이트 | TS 로직 → Rust 이식, 고정 틱, 단위 테스트 |
| 20 | WebAssembly | wasm32 타깃, wasm-bindgen, Vite에서 로드 |
| 21 | 네트워크 게임의 원리 | 권위 서버, 지연, 틱 레이트 — 유니티·언리얼 넷코드 연결 |
| 22 | Tokio와 Axum | async Rust, 라우터, 핸들러, State |
| 23 | WebSocket 기초 | 업그레이드, 에코 서버, 브라우저 연결 |
| 24 | 메시지 프로토콜 | serde enum, 버전 필드, 검증 |
| 25 | 서버 게임 루프 | 고정 틱, **액터 패턴(mpsc)** |
| 26 | 입장/퇴장 | 연결 관리, broadcast, 끊김 처리 |
| 27 | 상태 동기화 | 스냅샷, 보간 |
| 28 | 입력과 예측 | 입력 전송, 클라이언트 예측(WASM 재사용), 보정 개념 |
| 29 | 방 시스템 | 방 코드, 다중 방, 정리 |
| 30 | 호스트 화면(OBS) | 관전 화면, 리더보드, 투명 배경, QR 참가 |
| 31 | 플레이어 화면(휴대폰) | 컨트롤러 UI, 같은 Wi-Fi 접속, **Windows 방화벽 허용** |
| 32 | 치팅과 안전 | 서버 검증, 메시지 크기·빈도 제한, 닉네임 필터 |
| 33 | Docker 시작 | 컨테이너 개념, Docker Desktop(WSL 2), hello-world |
| 34 | PostgreSQL in Docker | 컨테이너 DB, psql, SQL 복습 |
| 35 | SQLx 연결 | 연결 풀, 마이그레이션, 경기 결과 저장 |
| 36 | 랭킹 | 리더보드 API·화면 |
| 37 | 설정·로깅·종료 | 환경 변수, tracing, graceful shutdown |
| 38 | 테스트와 린트 | 단위·통합 테스트, clippy, rustfmt |
| 39 | 성능 | 릴리스 빌드, 스냅샷 크기, 봇 부하 테스트 |
| 40 | Docker로 묶기 | 멀티스테이지 Dockerfile, compose |
| 41 | 배포 준비 | 도메인·HTTPS·WSS, 리버스 프록시 |
| 42 | 배포 | 작성 시점에 검증한 옵션, 비용·보안 주의 |
| 43 | 방송 리허설 | OBS 설정, 친구와 테스트, 대응 체크리스트 |
| 44 | 확장 설계 | 치지직 채팅 참가(!join) 설계, SP와 연결 |
| 45 | 회고와 졸업 | 포트폴리오, 회고 → **졸업 로드맵 해금** |

### 3.4 SP — 이미지 도네이션 서비스 (`C:\dev\image-donation\` = `client\` + `server\`)
| Day | 제목 | 핵심 |
|---|---|---|
| 1 | 서비스 기획 | 사용자·기능·화면 흐름, 위험(부적절 이미지·개인정보·저작권) |
| 2 | 아키텍처 | 구성도(React·API·SignalR·PostgreSQL·저장소·치지직), 저장소 구조 |
| 3 | React ① | react-ts 템플릿, 컴포넌트, TSX, props |
| 4 | React ② | useState, 이벤트, 조건부·목록 렌더링, key |
| 5 | React ③ | useEffect, 데이터 가져오기, 커스텀 훅, 폼 |
| 6 | React ④ | React Router, 레이아웃 |
| 7 | Docker + PostgreSQL | Docker Desktop, compose로 DB 실행 |
| 8 | API 뼈대 | Npgsql EF Core, 연결 문자열, user-secrets |
| 9 | 데이터 모델링 | Streamer·Donation·Settings, 상태 전이, 마이그레이션 |
| 10 | 파일 업로드 ① | multipart, IFormFile, 크기 제한, 저장 위치, 파일명 무작위화 |
| 11 | 파일 업로드 ② 보안 | 매직 넘버, 디코딩 검증, 리사이즈, EXIF 제거, 재인코딩 |
| 12 | 이미지 제공과 정리 | 정적 제공, 캐시, 보관 기간 후 자동 삭제(BackgroundService) |
| 13 | 인증 설계 | 개발용 로컬 로그인(Identity) → 이후 치지직 로그인 |
| 14 | 후원 페이지 API | `/d/{slug}`, 후원 생성, 요청 제한, 입력 검증 |
| 15 | 실시간 통신 원리 | 폴링/SSE/WebSocket, SignalR(허브·그룹) |
| 16 | SignalR 허브 | 스트리머별 그룹, 오버레이 토큰 인증 |
| 17 | 검수 API | 대기열, 승인/거절, 승인 → 오버레이 전송 |
| 18 | 오버레이 페이지 | 투명 배경, 애니메이션, 큐, 표시 시간 |
| 19 | 검수 대시보드(React) | 실시간 대기열, 미리보기, 단축키 |
| 20 | 설정 화면 | 자동 승인, 표시 시간, 간격, 금지어, 오버레이 URL 재발급 |
| 21 | OAuth 2.0 원리 | 인가 코드 흐름, 토큰, state, 스코프 |
| 22 | 치지직 개발자 센터 | 앱 등록, 리다이렉트 URI, Secret 보관, 심사 유의 |
| 23 | 치지직 로그인 | 콜백, 토큰 교환, 채널 정보, 계정 연결 |
| 24 | 토큰 관리 | 암호화 저장(Data Protection), 1회용 리프레시 토큰 회전 |
| 25 | 세션 소켓 이해 | 세션 생성, Socket.IO 2.x, 이벤트 구독, 재연결 |
| 26 | 후원 이벤트 수신 | 수신기 구현(서버 직접 또는 브라우저 중계), 이벤트 로그 |
| 27 | 후원 코드 매칭 | 코드 발급·추출, 최소 금액, 만료, 중복 방지 |
| 28 | 테스트 모드·채팅 안내 | 가짜 후원 발생기, 채팅 전송, 실패 처리 |
| 29 | 후원 페이지 화면 | 이미지 선택·미리보기·진행률, 코드 안내, 모바일 |
| 30 | 스트리머 온보딩 | 가입 → 오버레이 URL → OBS 가이드 → 테스트 후원 |
| 31 | 안전 장치 | 신고, 차단, 금지어, 긴급 정지 |
| 32 | 개인정보·법적 고려 | 최소 수집, 보관 기간, 약관·방침 초안(법률 자문 필요 명시) |
| 33 | 단위 테스트 | 매칭 로직, 이미지 검증 |
| 34 | 통합·프론트 테스트 | WebApplicationFactory, SignalR, Vitest + Testing Library |
| 35 | 관측성 | 구조화 로깅, 헬스 체크, 관리자 통계 |
| 36 | 저장소 추상화 | 로컬 → 객체 스토리지(S3 호환) 인터페이스 |
| 37 | Docker 이미지 | API Dockerfile, React 빌드 포함, compose |
| 38 | 배포와 HTTPS | 작성 시점에 검증한 옵션, 도메인, 리다이렉트 URI 갱신 |
| 39 | 방송 리허설 | 실제 스트리머 테스트, 체크리스트 |
| 40 | 회고와 다음 단계 | 운영 비용, 확장(영상 후원·다중 플랫폼), 포트폴리오 |

### 3.5 졸업 로드맵 (`grad`, P3 완료 시 해금)
- 게임: 유니티(C#, 가장 먼저 추천) → 언리얼(C++). Rust 게임 엔진 Bevy.
- C++ 학습 경로: 포인터·메모리·RAII·모던 C++ → 언리얼 C++.
- 리깅: Blender(+Python 스크립팅), Maya(Python).
- 방송 도구: OBS 플러그인(C/C++), 치지직 봇, 데스크톱 앱(Tauri = Rust + TS).
- 웹 심화: Next.js, 클라우드(AWS·Azure), CI/CD.
- 외주: 포트폴리오, 견적, 계약, 세금 기본(전문가 확인 필요 명시).
- MCN: 콘텐츠 지원 도구 아이디어.
- 4차 프로젝트 후보 목록.

---

## 4. 교재 웹사이트 기능

| 기능 | 상세 |
|---|---|
| 홈 대시보드 | 전체 진도(완료 Day 수 / 전체 Day 수, %), 학습 경로 지도, "이어서 하기" |
| 사이드바 | 프로젝트별 Day 목록. 🔒 잠김 / ▶ 다음 할 Day / ✅ 완료 |
| Day 페이지 | 고정 섹션 순서(5장 참고), 이전/다음 Day 이동 |
| 잠금 규칙 | 프로젝트 단위 **강제 잠금**(`requires`). 잠긴 프로젝트는 본문이 보이지 않는다. 해금된 프로젝트의 Day는 미리 읽을 수 있다. "Day 완료"는 **이전 Day를 완료해야** 누를 수 있다 |
| 정답 | 기본은 접혀 있다. 처음 펼칠 때 "먼저 직접 풀어 보세요" 확인 문구를 보여 준다 |
| 체크리스트 | Day 본문의 `- [ ]` 항목을 클릭 가능한 체크박스로 바꾸고 저장한다 |
| 진도 저장 | `localStorage` 키 `wzh:v1:progress`(스키마 버전 포함). 저장소를 쓸 수 없으면 메모리로 동작하고 안내한다 |
| 백업/복원 | 진도를 JSON 파일로 내보내고 불러온다(검증 후 덮어쓰기 확인). 진도 초기화 |
| 검색 | 빌드할 때 만든 텍스트 색인으로 전체 Day를 검색한다. 잠긴 프로젝트 결과는 제목만 보여 준다 |
| 부록 | 시작하기(교재 사용법), 용어 사전, 문제 해결 모음(오류 메시지별), 설치 체크리스트, 단축키표 |
| 편의 | 코드 복사 버튼, 다크/라이트 모드(시스템 기본 + 수동), 휴대폰 화면 대응, 키보드 이동 |
| 오프라인 | 외부 요청 0건. 코드 강조는 빌드 시점에 적용한다. 글꼴은 시스템 글꼴(맑은 고딕 등)을 쓴다 |
| 접근성 | 시맨틱 HTML, 키보드 포커스 표시, 충분한 명도 대비, `prefers-reduced-motion` 존중 |

---

## 5. 콘텐츠 형식

### 5.1 Day 본문 고정 섹션 순서
1. `## 🎯 오늘의 목표` — 오늘 끝나면 할 수 있게 되는 것 2~4개 + 예상 시간
2. `## 📖 개념 이해` — 비유 → 정확한 정의 → 실무 맥락
3. `## 🛠️ 따라하기` — 번호가 붙은 단계. 각 단계에 **정확한 경로**, 화면 위치(예: "왼쪽 위 [파일] 메뉴"), 입력할 명령, **"이렇게 보이면 성공"**
4. `## ✍️ 과제` — 1~3개. 난이도 표시
5. `## ✅ 정답` — `:::answer` 블록. 정답 코드와 "왜 이렇게 하는가" 해설
6. `## 🧯 자주 막히는 곳` — 증상 → 원인 → 해결
7. `## 📝 오늘의 체크리스트` — `- [ ]` 항목
8. `## 📚 더 알아보기`(선택) — 공식 문서 링크(MDN, Microsoft Learn, The Rust Book 등)

### 5.2 Markdown 확장 블록
| 블록 | 용도 |
|---|---|
| `:::tip` | 꿀팁 |
| `:::warn` | 주의(데이터 손실·보안 등) |
| `:::info` | 배경 지식, 실무 이야기 |
| `:::path` | 경로·위치 강조 박스(예: `C:\dev\my-creator-site\index.html`) |
| `:::success` | "이렇게 보이면 성공" |
| `:::answer 제목` | 접힌 정답 |

코드 블록은 언어를 표기한다(` ```html `, ` ```powershell ` 등). 파일 경로는 코드 블록 바로 위에 `📄 C:\dev\...` 형태로 적는다.

### 5.3 작성 원칙 (스타일 가이드 요약)
- 존댓말 해요체를 쓰고 한 문장은 짧게 쓴다. 처음 나오는 용어는 **굵게** + 한 줄 정의를 붙이고 용어 사전과 연결한다.
- "왜"를 먼저 설명하고 "어떻게"를 뒤에 둔다. 비유 다음에 반드시 정확한 정의를 둔다(비유만 남기지 않는다).
- Toy 예제와 실무 방식을 구분해 표시한다(`:::info 실무에서는`).
- 경로는 항상 Windows 11 기준 전체 경로로 적는다. 터미널은 PowerShell 기준이다.
- 버전에 민감한 내용(설치 화면, 메뉴 이름)에는 "작성 기준일 2026-11"을 표시하고 확인 방법(`--version`)을 함께 둔다.
- 존재하지 않는 API·옵션을 쓰지 않는다. 정답 코드는 7장의 검증을 거친 것만 싣는다.

---

## 6. 소스 구조와 빌드

```
web-zero-to-hundred/
├─ index.html                     ← 빌드 결과물(커밋함). 이것 하나로 교재 전체가 동작
├─ README.md                      ← 사용법(열기, GitHub Pages 공개, 빌드)
├─ HANDOFF.md                     ← 다음 세션 인수인계(설계 결정, 형식, 4차 추가 절차, 검증 방법)
├─ docs/superpowers/specs|plans/  ← 설계서·구현 계획
├─ textbook/
│  ├─ package.json                ← devDependencies: marked, highlight.js (빌드 전용)
│  ├─ build.mjs                   ← content → index.html (CSS/JS/본문/검색 색인 인라인)
│  ├─ src/template.html, styles.css, app.js
│  ├─ content/curriculum.json     ← 프로젝트·Day 메타·해금 조건의 단일 원천
│  ├─ content/pages/*.md          ← 시작하기, 용어 사전, 문제 해결, 졸업 로드맵 등
│  └─ content/{p1,p2,p3,sp}/day-NN.md
├─ reference/                     ← 각 프로젝트의 검증된 완성 코드(정답의 원천)
│  ├─ p1-my-creator-site/  p2-streamer-hub/  p3-viewer-arena/  sp-image-donation/
└─ tests/                         ← 빌드 검증 + Playwright 교재 동작 테스트
```

- **빌드**: `cd textbook && npm ci && npm run build` 명령으로 루트 `index.html`을 생성한다.
- **빌드 검증(실패 시 빌드 중단)**: curriculum의 모든 Day 파일이 있는지, 필수 섹션이 순서대로 있는지, `:::` 블록이 짝이 맞는지, 내부 링크가 유효한지, 코드 블록에 언어가 표기되었는지 확인한다.
- **런타임 렌더링**: 각 Day HTML을 `<template>`에 넣어 두고 이동할 때만 화면에 붙인다(초기 렌더링 비용 최소화).
- **결과물 크기 목표**: 16MB 미만(예상 3~6MB).

---

## 7. 검증 전략

| 대상 | 방법 | 이 환경에서 가능 여부 |
|---|---|---|
| P1 완성 코드 | 정적 서버 + Playwright(링크·반응형·JS 동작·오버레이 파라미터) | 가능 |
| P2 완성 코드 | .NET 10 SDK(apt)로 `dotnet build`, `dotnet test`. Vite 빌드, `tsc --noEmit` | 가능(apt 설치) |
| P3 완성 코드 | `cargo build/test/clippy`, wasm32 빌드(타깃 설치 가능 시), 서버 + 봇 클라이언트 통합 테스트, Docker 빌드(데몬 기동 가능 시) | 대부분 가능. 불가 항목은 HANDOFF에 기록 |
| SP 완성 코드 | `dotnet build/test`, React 빌드·테스트, PostgreSQL 연동 테스트. 치지직 실연동은 **불가**(인증 정보 없음) → 테스트 모드로 흐름 검증, 실연동 코드는 공식 문서 대조만 | 부분 가능. 명시 |
| Day 본문 코드 | 완성 코드에서 발췌하거나 같은 방식으로 실행 확인 | — |
| 교재 사이트 | Playwright: 해금 흐름, 체크·완료 저장, 백업/복원, 정답 펼치기, 검색, 다크 모드, 모바일 폭, 콘솔 오류 0건 | 가능 |
| 최신성 | Node·.NET·Rust·Docker·PostgreSQL·치지직 API 등 버전·설치 절차를 공식 출처로 확인하고 출처를 HANDOFF에 기록 | 웹 검색 |

Windows 고유 절차(설치 화면, 방화벽, 실행 정책 등)는 이 Linux 환경에서 직접 실행할 수 없다. 공식 문서를 근거로 작성하고, 교재에 "작성 기준일"과 확인 방법을 함께 둔다.

---

## 8. 인수인계 문서 (`HANDOFF.md`) 필수 내용
1. 프로젝트 목적·사용자 프로필(초보, Windows 11, 하루 1~2시간, 장기 목표)
2. 확정된 설계 결정과 이유(스택 선택, 해금 구조, SP 돈 흐름 원칙)
3. 리포지토리 구조, 빌드·테스트 명령
4. 콘텐츠 형식(섹션 순서, 확장 블록, 스타일 가이드)
5. **4차 프로젝트 추가 절차**(curriculum.json 항목 → content/p4 → reference/p4 → 검증 → 빌드 → 해금 조건)
6. 검증 현황표(무엇을 어디까지 검증했는지, 미검증 항목)
7. 외부 의존 정보와 출처(버전, 치지직 API 확인 사항), 재확인 필요 시점
8. 알려진 한계와 개선 아이디어

---

## 9. 범위 밖 (YAGNI)
- 서버나 계정 기반 진도 동기화(백업 파일로 대체)
- 영어 등 다국어 지원
- 동영상 강의 제작
- 교재 사이트의 GitHub Pages 공개 설정 자체(README에 방법만 안내. 공개 여부는 사용자가 결정)
- Day별 전체 코드 스냅샷 저장소(최종 완성본 + 각 Day 본문 코드로 대체)

## 10. 위험과 대응
| 위험 | 대응 |
|---|---|
| 분량이 매우 커서(155 Day) 품질 편차가 생김 | 스타일 가이드 + 견본 Day를 먼저 확정하고, 빌드 검증과 리뷰 단계를 둔다 |
| 설치 화면·메뉴명 변경 | 작성 기준일 표기, `--version` 확인법, 문제 해결 모음 |
| 치지직 API 사양 변경·승인 지연 | 테스트 모드로 학습이 막히지 않게 하고, 출처와 확인 날짜를 기록 |
| .NET용 Socket.IO 2.x 호환 불확실 | 구현 시 검증. 불가하면 브라우저 중계 방식 |
| WebAssembly 도구 체계 변동 | 구현 시 현재 권장 도구(wasm-bindgen/wasm-pack 등)를 확인하고 반영 |
| 무료 배포 호스팅 정책 변동 | 작성 시점에 검증한 옵션 1개 + 비용 주의 + 로컬 실행 대안 |
| localStorage 초기화로 진도 유실 | 백업/복원 기능, 첫 화면 안내 |
