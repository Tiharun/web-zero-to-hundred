### Task 4: 런타임 로직(진도·해금·저장·검색·라우팅)

**Files:**
- Create: `textbook/src/app/progress.js`, `textbook/src/app/storage.js`, `textbook/src/app/search.js`, `textbook/src/app/router.js`
- Test: `tests/unit/progress.test.mjs`, `tests/unit/storage.test.mjs`, `tests/unit/search.test.mjs`, `tests/unit/router.test.mjs`

**Interfaces:**
- Consumes: Task 3의 임베드 data 형태(`cur` = data)
- Produces(모두 순수 함수, 입력 객체를 바꾸지 않는다):
  - `STORAGE_KEY = 'wzh:v1:progress'`
  - `Progress = { version:1, completed: {[dayId]: isoString}, checks: {[dayId]: number[]}, lastDay: string|null, theme: 'system'|'light'|'dark' }`
  - `emptyProgress() → Progress`
  - `normalizeProgress(raw: unknown, cur) → Progress`: 형식이 틀린 값은 버리고, 알 수 없는 dayId를 제거하고, checks 인덱스는 `0..checkCount-1`만 남긴다. 실패하면 빈 진도를 반환한다.
  - `isProjectComplete(cur, prog, pid) → boolean`, `isUnlocked(cur, prog, requires: string[]) → boolean`
  - `projectState(cur, prog, pid) → 'locked'|'active'|'complete'`
  - `dayState(cur, prog, dayId) → 'locked'|'done'|'next'|'open'`: `next` = 해금된 프로젝트에서 가장 앞의 미완료 Day, `open` = 해금되었지만 아직 완료할 수 없는 Day
  - `canComplete(cur, prog, dayId) → boolean`: 프로젝트가 해금되었고, 첫 Day이거나 이전 Day가 완료된 경우
  - `canUncomplete(cur, prog, dayId) → boolean`: 완료된 상태이고, 같은 프로젝트의 다음 Day가 미완료이며, 이 프로젝트를 requires로 둔 프로젝트에 완료된 Day가 하나도 없는 경우
  - `completeDay(cur, prog, dayId, nowIso) → Progress`(불가하면 throw `Error('cannot-complete')`), `uncompleteDay(cur, prog, dayId) → Progress`
  - `toggleCheck(prog, dayId, index) → Progress`
  - `newlyUnlocked(cur, before, after) → string[]`(해금된 프로젝트·페이지 id. 축하 배너에 쓴다)
  - `continueTarget(cur, prog) → dayId|null`: main track을 order 순으로 보고 첫 `next`를 고른다. main이 끝났으면 special의 `next`, 그것도 없으면 null
  - `percent(cur, prog, track) → integer 0..100`(내림)
  - `exportBackup(prog, nowIso) → string`: `{ app:'web-zero-to-hundred', schema:1, exportedAt, progress }`
  - `importBackup(text, cur) → { ok:true, progress, dropped:number } | { ok:false, error:string }`(한국어 오류: JSON 아님, 다른 앱 파일, 지원하지 않는 schema)
  - `createStore(storage?: Storage) → { available: boolean, load(): unknown|null, save(p): boolean }`: 모든 접근을 try/catch로 감싼다. 저장소를 쓸 수 없으면 메모리에 보관하고 `available=false`
  - `search(index, query, isProjectUnlocked: (pid)=>boolean, limit=30) → {id, kind, project, title, snippet: string|null}[]`: NFC 정규화·소문자화, 공백으로 나눈 모든 단어가 title+text에 있어야 한다. 점수는 제목 일치 ×10 + 본문 등장 횟수. 잠긴 프로젝트의 결과는 snippet을 null로 한다. snippet은 첫 일치 위치 앞뒤 40자.
  - `parseHash(hash: string) → Route`: `''|'#/'`→`{name:'home'}`, `#/project/<pid>`, `#/day/<dayId>`, `#/page/<id>[/<anchor>]`(anchor는 decodeURIComponent), `#/settings`, `#/search?q=<q>`, 그 외 `{name:'notfound'}`

- [ ] **Step 1: 실패하는 테스트를 쓴다**(픽스처 data는 테스트 안에서 fa 2 Day·fb 1 Day·secret 페이지로 만든다)
  - progress: `first day is next, second is open`, `cannot complete second before first`, `completing all fa unlocks fb`(`newlyUnlocked` → `['fb']`), `uncomplete only latest`, `uncomplete blocked when dependent project has progress`, `continueTarget moves to fb after fa`, `percent floors`, `normalize drops unknown days and bad checks`, `importBackup rejects garbage`(`'not json'`, `'{"app":"other"}'`, schema 2), `importBackup drops unknown days`(dropped === 1), `export→import roundtrip`
  - storage: `store falls back to memory when storage throws`(getItem/setItem이 throw하는 가짜 Storage → available false, save true, load는 저장한 값)
  - search: `matches all terms`, `title match ranks first`, `locked project hides snippet`, `korean NFC query matches`
  - router: `parses all routes`, `decodes percent-encoded anchor`(`#/page/glossary/term-%EC%83%81%EB%8C%80` → anchor `term-상대`), `unknown is notfound`
- [ ] **Step 2: 실행해서 실패를 확인한다** — `npm test` → FAIL
- [ ] **Step 3: 구현한다**(위 시그니처대로)
- [ ] **Step 4: 실행해서 통과를 확인한다** — `npm test` → PASS
- [ ] **Step 5: 커밋** — `feat(textbook): progress, unlock, storage, search and router logic`

