### Task 6: 작성 가이드와 견본 Day(P1 Day 1)

**Files:**
- Create: `docs/CONTENT-GUIDE.md`, `textbook/content/curriculum.json`(P1 메타 30개 + pages `start`, `help`, `glossary`, `troubleshooting`), `textbook/content/p1/day-01.md`, `textbook/content/glossary/p1.md`(Day 1 용어만), `textbook/content/troubleshooting/p1.md`
- Test: `npm run check`, `npm run build`, 수동 렌더 확인

**Interfaces:**
- Consumes: Task 1(VS Code·브라우저 사실), Task 2~5 엔진
- Produces: 모든 콘텐츠 Task가 따르는 `docs/CONTENT-GUIDE.md`. 반드시 포함할 내용:
  1. 설계서 5장 규칙 전부(섹션 순서, 블록, 문체)
  2. **막힘 방지 규칙**
     - (a) `🎯 오늘의 목표` 끝에 `:::path 📂 시작 상태`를 둔다. 어제 끝난 시점에 있어야 할 파일·폴더를 전체 경로로 적는다.
     - (b) 따라하기의 모든 단계에 [어디서(앱·메뉴·전체 경로) / 무엇을(정확한 입력·명령) / 결과(`:::success`)]를 적는다.
     - (c) 앞 Day에서 배우지 않은 개념·도구를 쓰지 않는다(개요의 "이미 배운 것" 기준).
     - (d) `✅ 정답`에는 과제 정답과 함께 **"오늘 끝 상태 전체 코드"**를 둔다. 오늘 바뀐 파일은 200줄 이하면 전체를, 초과하면 바뀐 함수·블록 전체 + 정확한 삽입 위치를 싣는다. 막힌 학습자가 이 코드로 따라잡을 수 있게 하기 위해서다.
     - (e) 오류 메시지는 영어 원문을 그대로 싣고 한국어로 풀이한다.
     - (f) 명령어 블록 바로 아래에 예상 출력을 둔다.
     - (g) 각 Day 끝에 다음 Day 예고를 한 줄 넣는다.
  3. 코드 블록 규칙(`📄 전체 경로` 캡션, 언어 표기, Windows 줄바꿈 이슈)
  4. 용어 규칙: 처음 등장할 때 `[[용어]]` + 한 줄 정의. 용어 사전 항목 형식은 `### 용어` / 첫 줄 `- 처음 등장: [P1 Day N](#/day/p1-dNN)` / 2~4문장 정의
  5. 문제 해결 항목 형식: `### 증상(원문 오류 메시지)` / 원인 / 해결 단계
  6. 배치 작성자의 실행 검증 방법(프로젝트별 명령)과 `docs/verification/<batch>.md` 표 형식: `| Day | 블록(캡션) | 방법 | 결과 |`
  7. 리뷰 체크리스트 두 종류
     - **초보자 시뮬레이션**: 0% 초보자가 Windows 11에서 이 Day만 보고 끝까지 갈 수 있는가? 정의 없이 나온 용어가 있는가? 경로·메뉴 위치가 빠졌는가? 성공 확인이 빠진 단계가 있는가? 시간이 120분을 넘는가?
     - **기술 정확성**: reference·공식 문서와 일치하는가? 버전 표기가 맞는가? 보안상 나쁜 습관을 가르치지 않는가?
- [ ] **Step 1: 가이드를 쓴다**(위 7개 항목)
- [ ] **Step 2: 견본 P1 Day 1을 쓴다.** 내용: 컴퓨터와 웹의 첫걸음. 파일 탐색기 "보기 → 표시 → 파일 확장명" 켜기, `C:\dev` 만들기, 메모장으로 `C:\dev\hello\hello.html` 만들어 Edge/Chrome으로 열기, 과제 1~2개, 정답, 자주 막히는 곳(`hello.html.txt`로 저장되는 문제 등), 체크리스트. 가이드의 모든 규칙을 보여 주는 예시가 되게 한다.
- [ ] **Step 3: 검증한다** — `npm run check` → 0 errors. `npm run build` → `index.html`. Playwright로 Day 1 화면을 데스크톱·360px 두 크기로 스크린샷해 `docs/verification/p1-day-01.png`, `-mobile.png`로 저장하고 직접 본다.
- [ ] **Step 4: 리뷰 게이트** — 새 리뷰어 에이전트가 가이드 + Day 1을 초보자 시뮬레이션 체크리스트로 검토한다. 지적 사항을 반영한다.
- [ ] **Step 5: 커밋·푸시** — `docs: content guide and exemplar P1 Day 1`

---

## Phase 1 — P1 나의 크리에이터 홈페이지

