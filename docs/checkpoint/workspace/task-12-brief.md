### Task 12: P1 통합 리뷰와 미리보기 전달

**Files:**
- Modify: P1 Day 파일·용어·문제 해결(리뷰 반영)
- Test: `tests/e2e/smoke.test.mjs`(Create)

**Interfaces:**
- Produces: `smoke.test.mjs` — 실제 `index.html`을 연다. `addInitScript`로 모든 Day를 완료한 진도를 주입하고, 모든 Day·페이지 route를 차례로 방문해 다음을 확인한다. 각 Day에 필수 h2 7개가 있다. `figure.code`의 copy 버튼 수가 코드 블록 수와 같다. 콘솔 오류가 0이다. 360px에서 가로 스크롤이 없다.

- [ ] **Step 1: 스모크 테스트를 쓰고 실행한다** — `npm run build && npm run test:e2e` → PASS
- [ ] **Step 2: 리뷰 게이트(새 에이전트 2명, 병렬)**
  - ① **초보자 시뮬레이션**: Day 1→30을 순서대로 읽으며 막힐 지점을 `Day/단계/이유/수정안`으로 보고한다.
  - ② **기술 정확성**: 레퍼런스·MDN 대조, 검증 기록 확인.
- [ ] **Step 3: 지적 사항을 모두 반영하고** check·build·e2e를 다시 통과시킨다. 용어 중복을 정리한다.
- [ ] **Step 4: 커밋·푸시** — `feat(p1): 30-day creator homepage course`
- [ ] **Step 5: 사용자에게 미리보기를 전달한다** — 빌드된 `index.html`을 SendUserFile로 보내고, 피드백이 있으면 이후 Phase에 반영한다.

---

## Phase 2 — P2 스트리머 허브

