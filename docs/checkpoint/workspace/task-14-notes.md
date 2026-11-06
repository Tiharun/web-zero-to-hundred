### T14 (P2 개요) — `reference/p2-streamer-hub` 관련
- `GET /api/me`는 비로그인 시 **204**를 돌려줍니다(401이 아님. 공개 페이지에서 콘솔 오류를 피하려는 의도). 이 동작과 이유를 가르칩니다.
- Day 27(CORS)과 Day 34(HTTPS·CSRF)는 코드에 직접 대응하는 부분이 없습니다(Vite 프록시와 SameSite=Lax 때문). 그래서 작은 실험과 설명을 개요에 넣습니다.
- Day 39: 리버스 프록시 뒤에서는 `UseForwardedHeaders`(ForwardedHeaders = XForwardedFor + KnownProxies/KnownIPNetworks)를 `UseRateLimiter`보다 **앞에** 둬야 합니다.
- `Dtos/HttpUrlAttribute.cs`(override, is 패턴, out var)는 그 Day에 문법을 소개하거나 "읽기만 하고 나중에 이해해요" 상자로 처리합니다.
- 관리자 시드는 `CheckPasswordAsync`가 성공할 때만 기존 계정을 승격합니다. 같은 이메일을 먼저 가입해 두는 위험을 가르칩니다.
- SQLite는 UTC 표식을 잃기 때문에 `UtcDateTimeConverter`를 씁니다. 저장은 UTC, 표시는 `Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul'})`(Day 29)이며, P1의 로컬 시간과 비교해 설명합니다.
- 가입 흐름은 register → login → PUT /api/me(닉네임)이고, 닉네임 저장이 실패하면 재시도할 수 있습니다.
- 서버는 DisplayName을 trim하지 않습니다(보류 Minor).
- Windows에서 막힐 수 있는 지점을 Day에 배정합니다: PowerShell 실행 정책(Day 3, npm.ps1 오류), `dotnet dev-certs https --trust`, 포트 충돌, 첫 `dotnet run` 때의 방화벽 창, user-secrets 위치, SQLite 파일 위치, CRLF.
- `Microsoft.AspNetCore.Mvc.Testing` 10.0.14, xunit runner, Prettier 옵션(`--single-quote --print-width 120`)은 조사 문서에 아직 없습니다(Day 35~37 작성자에게 알립니다).

### 모든 콘텐츠 배치 공통
- `docs/CONTENT-GUIDE.md`를 따릅니다. 빌드가 막는 규칙은 다음과 같습니다.
  - `:::`는 0열에 씁니다
  - 원시 HTML은 escape됩니다
  - Markdown 이미지는 쓸 수 없습니다
  - TODO 같은 자리표시 단어는 금지입니다
  - 코드 블록에는 언어를 표기합니다
  - `[[용어]]`는 정확한 대소문자로 씁니다
  - `E_BOLD_UNRENDERED`
- Docker를 쓰는 Day(P3·SP)에는 항상 Docker 없는 경로를 함께 두고, 설치 전에 `winver`와 Windows 에디션을 확인하게 합니다. Windows 11 Home의 Docker Desktop 지원 여부는 **미확인**입니다.
- 검증 기록은 `docs/verification/<batch>.md`, 화면 캡처는 축소한 JPEG로 남깁니다(R26).
