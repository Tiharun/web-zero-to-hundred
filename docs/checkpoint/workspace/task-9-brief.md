### Task 9 / 10 / 11: P1 Day 본문 작성(병렬)

| Task | Day | 배치 이름 |
|---|---|---|
| 9 | 2–10 | `p1-days-02-10` |
| 10 | 11–20 | `p1-days-11-20` |
| 11 | 21–30 | `p1-days-21-30` |

**Files(배치마다):**
- Create: `textbook/content/p1/day-NN.md`(배치 범위), `textbook/content/troubleshooting/<batch>.md`, `docs/verification/<batch>.md`
- (필요할 때만) Create: `textbook/content/glossary/<batch>-extra.md`(개요에 없던 용어)

**Interfaces:**
- Consumes: CONTENT-GUIDE, `_outline.md`, `reference/p1-my-creator-site/`, `glossary/p1.md`, 이미 있는 Day(앞 배치는 없을 수 있으니 개요의 시작 상태를 기준으로 한다)
- Produces: 배치 범위의 Day 파일(id `p1-dNN`)

- [ ] **Step 1: 입력을 모두 읽는다**(가이드, 개요 전체, 레퍼런스 전체, Day 1 견본)
- [ ] **Step 2: Day 파일을 쓴다**(가이드의 막힘 방지 규칙 (a)~(g) 전부 적용)
- [ ] **Step 3: 코드 실행 검증** — 각 Day의 "오늘 끝 상태 전체 코드"를 스크래치 폴더에 재구성하고, static-server + Playwright로 열어 콘솔 오류 0과 끝 상태 확인 항목을 검사한다. 결과를 `docs/verification/<batch>.md` 표에 기록한다. Windows 전용 절차(설치 화면·메뉴)는 "공식 문서 대조"로 기록한다.
- [ ] **Step 4: 검사** — `npm run check -- --only <배치 Day id들>` → 0 errors
- [ ] **Step 5: 보고** — 바꾼 파일 목록, 검증 결과, 개요와 달라진 점을 보고한다(커밋하지 않음)

