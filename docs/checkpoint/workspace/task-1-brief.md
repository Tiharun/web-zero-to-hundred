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

