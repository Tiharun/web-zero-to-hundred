### T21 (P3 개요) — `reference/p3-viewer-arena` 관련
- 서버는 `DATABASE_URL` 없이도 실행됩니다(랭킹은 꺼지고 경고만 남음). Day 33 이전 단계와 Docker 없는 경로에서 이 점을 씁니다. DB 테스트는 `TEST_DATABASE_URL`이 없으면 조용히 건너뛴다는 사실을 테스트 Day에 명시합니다.
- `HOST`의 기본값은 127.0.0.1입니다. 같은 와이파이의 휴대폰으로 플레이하려면 `HOST=0.0.0.0` + Windows 방화벽 "허용"이 필요합니다.
- 예측은 서버 위치를 향한 부드러운 보정입니다(프로토콜에 입력 ack가 없음). 보정(reconciliation)은 개념으로 설명합니다.
- 랭킹 `day`는 "최근 24시간"입니다.
- 안전 장치:
  - 메시지 크기 1 KB 제한
  - 연결당 초당 30프레임(바이너리 프레임 포함)
  - 10초 유휴 타임아웃. 쓰기도 마감 시간 안에서만 합니다(`write()` + `timeout_at`)
  - 닉네임 1~12자. 보이지 않는 문자·포맷 문자·한글 채움 문자(U+3164 등)를 거부하는 거부 목록 방식이므로 허용 목록 방식과의 장단점을 설명합니다
  - 중복 닉네임 거부, 금지어
- 모듈 의존은 한 방향입니다(`Phase`는 protocol.rs에 있음). Day 11 예시로 쓰기 좋습니다.
- 추가 crate: tower-http, dotenvy(.env는 cargo가 아니라 dotenvy가 읽음), 테스트 전용 tokio-tungstenite/futures-util/reqwest. QR은 브라우저의 qrcode-generator 2.0.4를 씁니다.
- Docker 캐시는 변경이 없을 때만 효과가 있습니다. 관리형 Postgres가 TLS를 요구하면 sqlx에 TLS feature가 필요합니다(Day 41/42).
- 호스트 화면은 3초마다 다시 연결합니다. 방은 메모리에만 있으므로 서버를 재시작하면 새 OBS URL이 필요합니다.
- 설계서 3.3의 구조를 유지합니다: Rust 기초 1–12 → TS 로컬 게임 13–18 → Day 19에 Rust로 이식 → Day 20 WASM → 네트워크 21–32 → Docker/DB 33–40 → 배포·리허설·회고 41–45. 유니티 Update(), 언리얼 데디케이티드 서버, C++ RAII와의 연결은 `:::info`로 넣습니다.

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
