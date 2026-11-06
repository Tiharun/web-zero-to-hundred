### Task 36: README와 HANDOFF

**Files:**
- Create: `README.md`, `HANDOFF.md`

- [ ] **Step 1: README를 쓴다.** 교재 여는 법(다운로드 → `index.html` 더블클릭), GitHub Pages 공개 방법(Task 1에서 확인한 메뉴 경로, 비공개 저장소 제약), 빌드·테스트 명령, 폴더 구조.
- [ ] **Step 2: HANDOFF를 쓴다**(설계서 8장 1~8 전부). 특히 다음을 넣는다.
  - **4차 프로젝트 추가 절차**를 명령 단위로 적는다: curriculum.json에 `p4` 추가(requires 결정) → `reference/p4-*` + 테스트 → `content/p4/_outline.md` → `glossary/p4.md` → Day 배치 작성 → `npm run check` → 리뷰 게이트 → build → e2e → 커밋
  - 검증 현황표(`docs/verification/*` 요약, 미검증 항목: Windows 화면 절차, 치지직 실연동, Docker를 쓸 수 없었다면 그 사실)
  - 외부 사실 재확인 시점(예: .NET·Node LTS 교체 주기, 치지직 API 변경)
  - 알려진 한계: 잠금은 동기 부여 장치일 뿐 보안이 아님(원본에 전체 본문이 들어 있음), 진도는 브라우저별로 저장됨
- [ ] **Step 3: 커밋·푸시** — `docs: README and HANDOFF for future sessions`

