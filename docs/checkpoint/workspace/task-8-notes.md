### T8 (P1 개요) — `reference/p1-my-creator-site` 관련
- Day 1은 이미 완성되어 있습니다(`textbook/content/p1/day-01.md`). Day 2는 "VS Code로 `C:\dev\hello`를 연다"는 약속을 이어받아야 합니다. `glossary/p1.md`의 Day 1 용어 15개는 그대로 유지합니다.
- `js/main.js`의 테마 코드는 Day 22에서 try/catch를 씁니다(주석으로 "try/catch는 Day 25에서 배워요"라고 예고). 따라서 Day 22는 try/catch 없는 버전 또는 예고를 넣은 버전으로 가르치고, Day 25에서 설명합니다.
- 시간 코드는 **브라우저 로컬 시간**을 씁니다(PC 시계가 한국 시간이라고 가정. 시간대는 P2 Day 29에서 다룹니다). YouTube ID는 예시이므로 학습자가 자기 ID로 바꿉니다.
- 연락 폼에는 선택 항목 `채팅 닉네임`(`pattern="[A-Za-z0-9가-힣_]{2,20}"`)이 있고 `validity.patternMismatch`로 검사합니다. 그래서 Day 24에서 Constraint Validation API를 소개합니다.
- 오버레이는 `?title=&start=HH:MM`을 `split(':')` + `Number()` + 범위 검사로 읽습니다.
- JS는 템플릿 리터럴(Day 16)과 화살표 함수 콜백(Day 18)을 일관되게 씁니다.
- 설계서 3.1에 이름이 없는 메서드는 처음 등장하는 Day에 소개합니다: padStart, split, trim, includes, closest, dataset, setAttribute/removeAttribute, hidden, URLSearchParams, Number, Math.floor.
- 테마 토글은 고정 라벨 "다크 모드" + `aria-pressed`이고, contents.html에는 h2 "영상 목록"이 있습니다.
- start.md(교재 사용법·학습 원칙·전체 지도·준비물)와 help.md(막혔을 때 탈출 가이드)를 쓰고, `_meta.json`의 pages에 start → help 순서로 넣습니다.

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
