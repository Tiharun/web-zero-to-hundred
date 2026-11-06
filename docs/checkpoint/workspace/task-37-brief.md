### Task 37: 최종 검증과 전체 리뷰

- [ ] **Step 1: 깨끗한 상태에서 전체를 다시 실행한다**
  - `cd textbook && rm -rf node_modules && npm ci && npm test && npm run check && npm run build && npm run test:e2e`
  - `node --test tests/reference/`
  - 각 레퍼런스의 네이티브 테스트(`dotnet test` ×2, `cargo test --workspace`, client 빌드)
  - 모두 PASS 출력을 기록한다.
- [ ] **Step 2: 결과물 확인** — `index.html` 크기 < 16MB, 외부 URL을 참조하는 `src=`/`href=` 0건(본문의 외부 문서 링크 `a[href^=http]`는 허용), Day 수 155
- [ ] **Step 3: 전체 브랜치 리뷰** — 가장 유능한 모델의 새 리뷰어가 설계서 대비 누락·불일치를 검토한다. 지적 사항을 반영한다.
- [ ] **Step 4: 최종 커밋·푸시와 보고** — 사용자에게 `index.html`을 전달하고, 검증 범위와 미검증 항목을 정직하게 보고한다.
