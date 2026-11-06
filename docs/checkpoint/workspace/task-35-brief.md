### Task 35: 부록과 졸업 로드맵

**Files:**
- Create: `textbook/content/pages/{install,shortcuts,roadmap}.md`
- Modify: `textbook/content/curriculum.json`(pages에 install, shortcuts, roadmap(`requires:["p3"]`) 추가)

- [ ] **Step 1: 페이지를 쓴다**
  - `install.md`: 프로젝트별 설치 체크리스트(도구 · 공식 URL · 확인 명령 · 예상 출력)
  - `shortcuts.md`: Windows·VS Code·브라우저 개발자도구·PowerShell 단축키
  - `roadmap.md`: 설계서 3.5 전부. 유니티(C#) → 언리얼(C++) 순서와 이유, C++ 학습 경로, Rust 심화(Bevy), 리깅(Blender·Python), 방송 도구(OBS 플러그인·치지직 봇·Tauri), 웹 심화, 외주(세금 등은 전문가 확인 필요 명시), MCN 아이디어, **4차 프로젝트 후보 3~5개**(각각 목표·스택·선행 조건)
- [ ] **Step 2: 검증한다** — `npm run check && npm run build && npm run test:e2e` → PASS. 스모크 테스트가 roadmap을 포함하는지 확인한다.
- [ ] **Step 3: 커밋·푸시** — `docs: install checklist, shortcuts and graduation roadmap`

