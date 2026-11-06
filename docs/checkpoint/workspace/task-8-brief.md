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

