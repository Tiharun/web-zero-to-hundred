### T29 (SP 개요) — `reference/sp-image-donation` 관련
- 이미지 라이브러리는 **SkiaSharp 4.154.0(MIT)**입니다. ImageSharp는 Release 빌드에 라이선스 키가 필요하고 매출 기준 상용 라이선스가 있어서 제외했습니다(R28).
- 애니메이션 GIF는 첫 프레임만 씁니다(R29). EXIF 회전을 적용하고 WebP로 재인코딩합니다. 디코딩 한도는 헤더 1억 픽셀, 디코딩 4096²입니다.
- 상태: AwaitingCheese, Pending, Approved, Shown, Rejected, Expired, **Cleared**(긴급 정지).
  - 모든 전이는 조건부 `ExecuteUpdate`로 합니다.
  - 오버레이에 연결하면 최근 30분 안에 승인된 후원을 다시 보냅니다.
  - 긴급 정지는 Clear()를 먼저 보내고(WIP 항목) 상태를 Cleared로 저장합니다.
- **신고(R33·R35)**
  - 스트리머가 운영자에게 신고하면 Report 행을 만들고, 거절과 차단을 한 번에 처리합니다.
  - 이미지는 증거로 보관하되 `/media`로는 제공하지 않고(404), 7일 보존 기간이 끝나면 삭제합니다.
  - 운영자 화면은 없고 SQL로 검토합니다.
- 치지직
  - 소켓은 SocketIOClient 4.0.5, `EIO=V3`이고 인증값은 `Query["auth"]`로 넘깁니다. 로컬 에뮬레이터(Socket.IO 2.5.0)로만 검증했고 **실서버는 검증하지 못했습니다.**
  - 리프레시 토큰은 1회용이며 회전합니다. 잠금 안에서 다시 읽고 저장하는데, 잠금은 프로세스 하나 안에서만 유효합니다.
  - 매칭되지 않은 후원 이벤트의 닉네임·메시지는 저장하지 않습니다(최소 수집).
- React 템플릿의 기본 린터 Oxlint를 씁니다(ESLint 없음, R23). `/api/auth/me`는 비로그인 시 204입니다.
- 운영자가 결제를 다루지 않는 원칙, 테스트 모드를 기본 경로로 둘 것, 법적 고려(Day 32)에 "법률 자문 필요"를 명시할 것은 계획서 T29에 이미 들어 있습니다.

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
