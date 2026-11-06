## 파일 구조

```
index.html                         빌드 결과물(커밋)
README.md                          사용법·빌드·GitHub Pages 공개 방법           (Task 36)
HANDOFF.md                         인수인계                                       (Task 36)
docs/research/external-facts.md    버전·설치·외부 API 조사 결과와 출처            (Task 1)
docs/CONTENT-GUIDE.md              작성 규칙·Day 템플릿·리뷰 체크리스트          (Task 6)
docs/verification/<batch>.md       배치별 코드 실행 검증 기록                     (콘텐츠 Task들)
textbook/
  package.json                     type: module, scripts: build/check/test/test:e2e
  build.mjs                        CLI: 검증 → 렌더 → 조립 → ../index.html
  lib/markdown.mjs                 Markdown → HTML(확장 블록, 코드 강조, 체크박스, 용어 링크)
  lib/validate.mjs                 Day 소스 구조 검증
  lib/curriculum.mjs               curriculum.json 로드·검증, Day 파일 경로 결정
  lib/glossary.mjs                 용어 사전·문제 해결 파일 병합
  lib/assemble.mjs                 template에 CSS·JS·데이터·템플릿 인라인
  src/template.html, src/styles.css
  src/app/main.js                  진입점(esbuild로 IIFE 번들)
  src/app/progress.js              진도·해금 순수 로직
  src/app/storage.js               저장소 래퍼(메모리 대체)
  src/app/search.js                검색
  src/app/router.js                해시 라우팅
  src/app/views/{home,project,day,page,settings,search,shell}.js
  content/curriculum.json
  content/pages/{start,help,install,shortcuts,roadmap}.md
  content/glossary/*.md            용어 사전 조각(### 용어)
  content/troubleshooting/*.md     문제 해결 조각(### 증상)
  content/{p1,p2,p3,sp}/day-NN.md  Day 본문(NN = 01..)
  content/{p1,p2,p3,sp}/_outline.md 상세 개요(빌드 대상 아님: '_'로 시작하는 파일은 무시)
reference/
  p1-my-creator-site/  p2-streamer-hub/  p3-viewer-arena/  sp-image-donation/
tests/
  helpers/static-server.mjs        startStaticServer(root) → { url, close() }
  helpers/browser.mjs              launch(), collectConsoleErrors(page)
  unit/*.test.mjs                  렌더러·검증·런타임 로직
  build/*.test.mjs                 빌드 통합
  e2e/textbook.test.mjs            픽스처 교재로 UI 동작
  e2e/smoke.test.mjs               실제 index.html 전 Day 렌더 스모크
  reference/p1.test.mjs, p2.e2e.test.mjs, p3.e2e.test.mjs, sp.e2e.test.mjs
  fixtures/content/                작은 교재 픽스처(프로젝트 fa 2 Day, fb 1 Day, 페이지 2개)
```

공통 명령(모두 저장소 루트 기준):
- 설치: `cd textbook && npm ci`
- 콘텐츠 검사: `cd textbook && npm run check`(일부만: `npm run check -- --only p1-d02,p1-d03`)
- 빌드: `cd textbook && npm run build` → 루트 `index.html`
- 단위·빌드 테스트: `cd textbook && npm test`
- e2e: `cd textbook && npm run test:e2e`

