### Task 7: P1 레퍼런스 완성 코드

**Files:**
- Create: `reference/p1-my-creator-site/` — `index.html`, `about.html`, `contents.html`, `schedule.html`, `contact.html`, `css/style.css`, `js/main.js`(메뉴 토글·다크 모드), `js/contents.js`(videos.json fetch·렌더·카테고리 필터·검색), `js/schedule.js`(오늘 요일 강조·다음 방송 카운트다운), `js/contact.js`(폼 검증·aria-live 메시지), `data/videos.json`, `data/schedule.json`, `images/*.svg`(프로필·로고·썸네일 자리 이미지. 바이너리 없음), `favicon.svg`, `overlay/countdown.html`, `overlay/countdown.css`, `overlay/countdown.js`, `README.md`
- Test: `tests/reference/p1.test.mjs`

**Interfaces:**
- Produces(개요·Day가 따르는 계약):
  - 오버레이 URL 파라미터: `?title=<방송 제목>&start=<HH:MM>`(오늘 기준 한국 시간). 시간이 지나면 "곧 시작해요!" 표시. 배경 `transparent`
  - `data/videos.json`: `[{ "id", "title", "category": "game"|"talk"|"music", "youtubeId", "date": "YYYY-MM-DD" }]`
  - `data/schedule.json`: `[{ "day": 0..6, "start": "HH:MM", "title" }]`
  - localStorage 키 `theme`(`light`|`dark`)
  - 외부 의존성 없음(YouTube iframe 제외). Day 1~30에서 배우는 문법만 사용(클래스·모듈 번들러 없음)

- [ ] **Step 1: 실패하는 테스트를 쓴다**(static-server로 제공)
  - `all pages load without console errors`
  - `all internal links resolve`(모든 `a[href]`와 `img[src]`가 상대 경로이고 200)
  - `mobile menu toggles at 375px`(`aria-expanded` 변화)
  - `theme toggle persists`
  - `contents render from json and filter by category`
  - `contact shows validation errors then success`
  - `overlay shows countdown and transparent background`(`?title=테스트&start=23:59` → 제목 표시, 시간 형식 `HH:MM:SS`, `body` 배경 `rgba(0, 0, 0, 0)`)
  - `no horizontal scroll at 360px on every page`
- [ ] **Step 2: 실행해서 실패를 확인한다** — `node --test tests/reference/p1.test.mjs` → FAIL
- [ ] **Step 3: 구현한다**(초보자가 30 Day 안에 이해할 수 있는 단순하고 관용적인 코드. 핵심 줄에 한국어 주석)
- [ ] **Step 4: 실행해서 통과를 확인한다** — PASS. Lighthouse 대신 Playwright로 `img[alt]` 누락 0개와 `meta[name=description]` 존재를 검사하는 테스트를 추가한다.
- [ ] **Step 5: 커밋** — `feat(reference): P1 creator homepage reference implementation`

