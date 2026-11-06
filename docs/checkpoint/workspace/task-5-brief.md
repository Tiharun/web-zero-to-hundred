### Task 5: 런타임 UI·스타일과 e2e

**Files:**
- Create: `textbook/src/app/views/{shell,home,project,day,page,settings,search}.js`, `textbook/src/styles.css`, `tests/helpers/browser.mjs`, `tests/helpers/static-server.mjs`
- Modify: `textbook/src/app/main.js`
- Test: `tests/e2e/textbook.test.mjs`

**Interfaces:**
- Consumes: Task 4의 모든 함수, Task 3의 data·템플릿 id
- Produces(테스트·후속 Task가 쓰는 DOM 계약):
  - `data-testid`: `progress-main`, `progress-special`, `continue-button`, `complete-button`, `uncomplete-button`, `lock-screen`, `storage-banner`, `unlock-banner`, `answer-gate`, `answer-gate-confirm`, `search-input`, `theme-toggle`, `export-button`, `import-input`, `import-message`, `reset-button`
  - 사이드바 Day 링크: `a[data-day="<dayId>"][data-state="locked|done|next|open"]`
  - `startStaticServer(rootDir) → Promise<{ url: string, close(): Promise<void> }>`, `launch() → Promise<Browser>`(createRequire로 전역 playwright를 불러온다), `collectConsoleErrors(page) → string[]`(live 배열)

- [ ] **Step 1: 실패하는 e2e를 쓴다.** `before`에서 픽스처를 임시 `index.html`로 빌드하고 `file://` URL로 연다. 모든 테스트 끝에서 `collectConsoleErrors`가 빈 배열이어야 한다.
  - `home shows 0% and continue goes to fa-d01`
  - `complete flow unlocks next project`: fa-d01 체크 3개 → 완료 → fa-d02 완료 → `unlock-banner`에 fb 제목, 사이드바 fb-d01이 `data-state="next"`
  - `complete disabled until previous done`: fa-d02로 바로 이동 → `complete-button` disabled + 이유 문구
  - `locked deep link shows lock screen`: 새 컨텍스트에서 `#/day/fb-d01` → `lock-screen` 보임, 본문 단어 `비밀단어zz` 없음
  - `storage unavailable banner`: `addInitScript`로 `localStorage` getter가 throw하게 함 → 홈 렌더 + `storage-banner` 보임
  - `corrupt backup keeps progress`: fa-d01 완료 → 설정에서 `{"app":"other"}` 파일 import → `import-message`에 오류, fa-d01은 여전히 done
  - `answer gate`: 정답 summary 클릭 → `answer-gate` 보이고 내용 숨김 → `answer-gate-confirm` → details open
  - `search hides locked snippet`: `비밀단어zz` 검색 → fb-d01 결과는 제목만, `fa` 결과는 snippet 있음
  - `theme persists after reload`
  - `no horizontal page scroll at 360px`: viewport 360×740, fa-d01 → `document.documentElement.scrollWidth <= innerWidth`
  - `copy falls back when clipboard denied`: `navigator.clipboard.writeText`가 reject → 복사 버튼 문구가 `복사됨`
  - `raw html shown as text`: fa-d01의 `main b` 요소가 0개
  - `reset clears progress after confirm`: fa-d01 완료 → 설정에서 `reset-button` → 확인 대화상자 수락 → 홈 `progress-main`이 0%
  - `keyboard reachable`: Day 화면에서 Tab만으로 사이드바 링크·체크박스·`complete-button`에 포커스가 가고, 포커스 표시(outline)가 보임
- [ ] **Step 2: 실행해서 실패를 확인한다** — `npm run test:e2e` → FAIL
- [ ] **Step 3: 구현한다.**
  - 라우터: `hashchange`에서 렌더하고 `#main`으로 포커스를 옮긴다.
  - Day 뷰: `template.content.cloneNode(true)` → 체크박스 상태 바인딩(`data-check`) → 정답 게이트(첫 클릭에 summary 기본 동작을 막고 게이트 표시. 확인은 세션 메모리에만 기록) → 복사 버튼(clipboard 실패 시 숨긴 textarea + `document.execCommand('copy')`) → 하단(완료·완료 취소·이전/다음).
  - 완료 후 `newlyUnlocked`가 있으면 배너를 띄운다.
  - 스타일: `:root` 토큰. 다크 모드는 `@media (prefers-color-scheme: dark)`를 `:root:not([data-theme="light"])`로 감싸고, `:root[data-theme="dark"]`에도 같은 값을 둔다. 글꼴은 `"Malgun Gothic","Apple SD Gothic Neo",system-ui,sans-serif`, 코드는 `Consolas,"D2Coding",monospace`. 960px 미만에서는 사이드바를 오프캔버스로 바꾼다. `pre { overflow-x:auto }`, `main { min-width:0 }`. hljs 토큰 색은 두 테마 모두 명도 대비 4.5:1 이상. `prefers-reduced-motion`을 존중한다.
- [ ] **Step 4: 실행해서 통과를 확인한다** — `npm run test:e2e` → PASS, 그리고 `npm test` → PASS
- [ ] **Step 5: 커밋** — `feat(textbook): runtime UI, styles and e2e tests`

