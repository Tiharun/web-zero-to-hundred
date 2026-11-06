# 체크포인트 — 로컬 세션에서 여기서부터 이어서 하세요

- 작성일: 2026-11-06 (클라우드 세션 → **로컬 세션 인계본**)
- 상태: **중지됨**. 실행 중인 에이전트가 없습니다. 클라우드 쪽 에이전트 대화 기록은 로컬로 넘어오지 않습니다. 따라서 진행 중이던 작업은 모두 **새 에이전트로 다시 실행**합니다(7장).
- 저장소: `tiharun/web-zero-to-hundred` / 브랜치 **`claude/gifted-goldberg-u1f9c6`**. 이 브랜치에서만 작업하고 push합니다. PR은 아직 만들지 않았고, 사용자가 요청할 때만 만듭니다.
- 인계 시점 기준선(이 커밋에서 직접 실행한 결과)
  - `npm test`: 168/168 통과
  - `npm run check -- --allow-missing`: "검사 통과: Day 155개"
  - `npm run test:e2e`: 26/26 통과
- 이 문서는 새 세션이 **다른 파일보다 먼저** 읽는 문서입니다. 이전 판(2026-11-05)은 `docs/checkpoint/CHECKPOINT-2026-11-05.md`에 보관했습니다. 내용이 다르면 이 문서가 우선합니다.

---

## 0. 30초 요약

1. **만드는 것**: 지식 0% 초보자(Windows 11, 하루 1~2시간)가 혼자 따라가는 **단일 HTML 교재** `index.html`. 모두 155 Day입니다.
   - P1 크리에이터 홈페이지 30
   - P2 스트리머 허브 40
   - P3 시청자 참여 게임 45
   - SP 이미지 도네이션 40
   - 부록 + 졸업 로드맵
2. **가장 중요한 요구**(사용자의 말): "중간에 막히지 않고 잘 따라갈 수 있는 것".
3. **끝난 것**(리뷰 통과)
   - 기반 T1–T7
   - 완성 코드 4개: T7 P1, T13 P2, T20 P3, T28 SP
   - 개요 4개: T8, T14, T21, T29. 모두 `curriculum.json`에 병합했습니다.
   - **P1 본문 30 Day 전체**: T6 Day 1, T9, T10, T11
   - **T12 1단계**: 스모크 테스트, Day 1 보류 수정, 미리보기 빌드
4. **멈춘 것**: T15 재리뷰, T12 리뷰어 2명, T16–T18 P2 본문.
5. **로컬에서 처음 할 일**: 1장 → 5장(환경) → 6장(작업 폴더 복구) → 7장(재개 절차) 순서로 하면 됩니다.

---

## 1. 로컬에서 처음 하는 순서 (체크리스트)

1. 저장소를 받습니다.
   ```bash
   git clone https://github.com/tiharun/web-zero-to-hundred.git
   ```
   ```bash
   cd web-zero-to-hundred && git checkout claude/gifted-goldberg-u1f9c6 && git pull origin claude/gifted-goldberg-u1f9c6
   ```
2. 도구를 준비합니다(5장). 최소 Node 22 + Playwright가 있어야 교재 작업을 할 수 있습니다. 레퍼런스 테스트와 P2·P3·SP 본문 검증에는 .NET 10, Rust, PostgreSQL이 필요합니다.
3. 교재 빌드 도구를 설치합니다.
   ```bash
   cd textbook && npm ci
   ```
4. 기준선을 확인합니다. 결과가 위 숫자와 같아야 합니다.
   ```bash
   cd textbook && npm test && npm run check -- --allow-missing && npm run test:e2e
   ```
5. 작업 폴더(진행 기록·지시문·보고서)를 복구합니다(6장).
   ```bash
   bash docs/checkpoint/restore-workspace.sh
   ```
6. superpowers 플러그인이 있으면 `subagent-driven-development` 스킬을 켭니다. 없어도 진행할 수 있습니다(6.3).
7. 7장의 재개 절차를 순서대로 실행합니다.

---

## 2. 읽을 문서 (순서대로)

| 순서 | 파일 | 내용 |
|---|---|---|
| 1 | `docs/CHECKPOINT.md` (이 문서) | 현재 위치, 환경, 재개 절차 |
| 2 | `docs/checkpoint/workspace/progress.md` | **진행 기록(ledger)**. 모든 Task의 완료 줄, 판정, 보류 Minor. 첫 줄이 계획서 경로입니다 |
| 3 | `docs/checkpoint/workspace/rulings.md` | 판정(Ruling) 전체 목록(R1–R58 + Setup). 사용자에게 최종 보고할 "제가 내린 결정" |
| 4 | `docs/checkpoint/workspace/dispatch-templates.md` | **에이전트에게 보내는 지시문 틀**: Day 배치 작성 / 배치 리뷰 / 수정 회차 / 재리뷰 / 통합 리뷰 2종 |
| 5 | `docs/superpowers/specs/2026-11-01-web-zero-to-hundred-design.md` | 설계서(최상위 기준, 사용자 승인) |
| 6 | `docs/superpowers/plans/2026-11-01-web-zero-to-hundred.md` | 구현 계획서(Task 1~37, 사용자 승인). 오케스트레이터는 한 번만 읽고, 에이전트에게는 지시문(brief) 파일만 줍니다 |
| 7 | `docs/checkpoint/workspace/implementer-contract.md` | 작업 에이전트 공통 계약: NO GIT, 환경, 보고 형식. 로컬 환경용으로 고쳐 두었습니다 |
| 8 | `docs/checkpoint/workspace/content-batch-rules.md` | Day 본문 배치 규칙: 파일 소유권, 검증, 공유 문서 수정 금지 |
| 9 | `docs/checkpoint/workspace/task-N-brief.md` | Task별 지시문(계획서에서 미리 추출. 묶음 Task는 대표 번호 9·15·22·30) |
| 10 | `docs/checkpoint/workspace/task-{8,12,14,21,29}-notes.md` | 프로젝트별 "리뷰에서 나온 사실" 메모. 본문 배치에 반드시 함께 줍니다 |
| 11 | `docs/CONTENT-GUIDE.md` | 콘텐츠 작성 가이드: 막힘 방지 규칙 (a)~(g), 🧯 3~6개, 리뷰 체크리스트 |
| 12 | `docs/research/external-facts.md` | 버전·설치·치지직 API 등 외부 사실과 출처(작성 기준 2026-11) |
| 13 | `textbook/content/<pid>/_outline.md` | 프로젝트별 상세 개요. Day 본문의 계약이고 확정되었습니다 |

---

## 3. 사용자와 확정된 결정 (다시 묻지 말 것)

- **사용자**
  - 지식 0% 초보자이고 Windows 11을 씁니다. 하루 1~2시간 공부합니다.
  - 장기 목표는 사이트·게임·리깅·유니티·언리얼 개발자, 콘텐츠를 자급자족하는 스트리머·유튜버, 외주, MCN 창업입니다.
  - 최종적으로 배울 언어는 C++과 Rust입니다. 취업보다 성장을 우선합니다.
- **언어 경로**: HTML/CSS/JS(P1) → TypeScript + C#(P2) → Rust(P3) → 졸업 후 C++·언리얼 / 유니티.
- **P2**: TS + C# ASP.NET Core + SQLite.
- **P3**: Rust 서버 + Rust→WASM + TS Canvas + PostgreSQL + Docker 기반 시청자 참여 멀티플레이 웹게임.
- **SP**: 이미지 도네이션 서비스(C# + SignalR + React + PostgreSQL + Docker + 치지직 API).
  - **운영자는 돈을 받지 않습니다.**
  - 모드는 두 가지입니다: 무료 이미지 후원, 치즈 후원 메시지 코드 매칭(선택).
  - 테스트 모드가 있어야 합니다.
  - P2를 마치면 언제든 해금됩니다.
- **해금 순서**: P1 → P2 → (P3 → 졸업 로드맵) / (SP 언제든).
- P3 다음에 **졸업 로드맵**을 반드시 둡니다. 4차 프로젝트를 나중에 붙일 수 있도록 **HANDOFF.md**(T36)를 반드시 씁니다.
- **실행 방식은 Subagent 방식**입니다(사용자 선택).
  - 작업마다 새 구현 에이전트를 씁니다.
  - 작업마다 리뷰 → 수정 → 재리뷰를 거칩니다.
  - 마지막에 전체 리뷰를 합니다.
- **응답 선호**
  - 한국어로 답합니다.
  - 정확성과 실무 표준을 지킵니다.
  - 추측하지 않고, 모르는 것은 모른다고 밝힙니다.
  - 큰 단계마다 결과물을 전달합니다(P1 완성 시 미리보기 `index.html`).

---

## 4. 진행 현황표 (인계 시점)

범례: ✅ 리뷰 통과·완료 / 🟡 진행 중(멈춤) / ⬜ 시작 전

| Task | 내용 | 상태 | 커밋(범위) |
|---|---|---|---|
| T1–T7, R27 | 조사·렌더러·로더·런타임·UI·가이드+Day 1·P1 완성 코드 | ✅ | `885e2f7..fa134f8` 외 (ledger 참고) |
| T13 | P2 완성 코드 `reference/p2-streamer-hub/` | ✅ | `356116c`, `7648078` |
| T20 | P3 완성 코드 `reference/p3-viewer-arena/` | ✅ | `bf9ac3f..81a777e` |
| T28 | SP 완성 코드 `reference/sp-image-donation/` | ✅ | `070f5df..d76194d` (+ README 한 줄 `066fdaf`, R47) |
| T8 | P1 개요 + 시작하기·막혔을 때 + 용어 172 | ✅ | `9ff7ac2..b8a6f7f` |
| T14 | P2 개요 + 용어 211 | ✅ | `37f03e1..d411c91` |
| T21 | P3 개요 + 용어 162 | ✅ | `f85155c..f10a2c7` |
| T29 | SP 개요 + 용어 125 | ✅ | `8e30f25..773967a` |
| (병합) | 4개 `_meta.json` → `curriculum.json` (Day 155) | ✅ | `02eae44` 이후 재병합 여러 번(R46) |
| T9 | P1 Day 2–10 | ✅ | `342c1ed..a901b47` |
| T10 | P1 Day 11–20 | ✅ | `342c1ed..30a8cca` |
| T11 | P1 Day 21–30 | ✅ | `342c1ed..5302192` |
| **T12** | P1 통합 | 🟡 1단계 완료(`6166d21`). 리뷰어 ①②, 반영, 미리보기 전달 남음 | |
| **T15** | P2 Day 1–10 | 🟡 1차 수정 완료(`6115e79`). **재리뷰 남음** | |
| **T16** | P2 Day 11–20 | 🟡 `day-11~20.md`는 있음(WIP). 문제 해결 모음·검증 기록·보고서 없음 | |
| **T17** | P2 Day 21–30 | ⬜ 저장소에 파일 없음. 처음부터 | |
| **T18** | P2 Day 31–40 | ⬜ 저장소에 파일 없음. 처음부터 | |
| T19 | P2 통합 | ⬜ | |
| T22–T26 | P3 Day 1–9 / 10–18 / 19–27 / 28–36 / 37–45 | ⬜ | |
| T27 | P3 통합 | ⬜ | |
| T30–T33 | SP Day 1–10 / 11–20 / 21–30 / 31–40 | ⬜ | |
| T34 | SP 통합 | ⬜ | |
| T35 | 부록(설치·단축키·졸업 로드맵) | ⬜ (P3 Day 45에 로드맵 링크를 넣는 일 포함, R39) | |
| T36 | README + HANDOFF | ⬜ | |
| T37 | 최종 검증 + 전체 브랜치 리뷰 | ⬜ | |

> `wip(...)`로 시작하는 커밋은 리뷰 전 스냅샷입니다(R45). 리뷰 범위는 항상 기록해 둔 기준 커밋(BASE/FIX_BASE)부터 잡습니다.

---

## 5. 로컬 환경 준비

### 5.1 필요한 도구와 이 프로젝트가 검증에 쓴 버전

| 도구 | 검증에 쓴 버전 | 필요한 곳 | 확인 명령 |
|---|---|---|---|
| Node.js | 22.23.4 | 교재 빌드·테스트, 모든 TS | `node --version` |
| Playwright(전역) | **1.63.0** + Chromium | 교재 e2e, 레퍼런스 e2e, 본문 검증 | `node -e "console.log(require('playwright/package.json').version)"` |
| .NET SDK | 10.0.114 | P2·SP 완성 코드, P2·SP 본문 검증 | `dotnet --version` |
| Rust / cargo | 1.97.0 + target `wasm32-unknown-unknown` | P3 완성 코드, P3 본문 검증 | `rustc --version`, `rustup target list --installed` |
| wasm-bindgen-cli | **0.2.130** (P3 `Cargo.lock`과 같아야 함) | P3 | `wasm-bindgen --version` |
| PostgreSQL | 16 (학습자는 18) | P3·SP DB 테스트 | `psql --version` |
| Docker | 29.x (선택) | P3·SP Docker 스모크 | `docker info` |
| Git | 2.4x 이상 | 전부 | `git --version` |

- 설치 방법은 운영체제마다 다릅니다. 각 도구의 공식 설치 프로그램이나 패키지 관리자를 쓰세요(Windows는 winget, macOS는 Homebrew, Linux는 apt 등).
- 버전은 위 표와 **주 버전이 같으면** 됩니다. 단, Playwright 1.63.0과 wasm-bindgen 0.2.130은 정확히 맞춥니다.

### 5.2 Playwright 전역 설치(중요)

테스트는 `tests/helpers/browser.mjs`에서 **전역 Playwright**를 `require('playwright')`로 불러옵니다. 저장소의 package.json에는 Playwright가 없습니다.
```bash
npm install -g playwright@1.63.0
```
```bash
npx -y playwright@1.63.0 install chromium
```
Node가 전역 모듈을 찾을 수 있게 `NODE_PATH`를 전역 경로로 지정합니다.
- macOS/Linux:
  ```bash
  export NODE_PATH="$(npm root -g)"
  ```
- Windows PowerShell:
  ```powershell
  $env:NODE_PATH = (npm root -g)
  ```
  영구로 두려면 사용자 환경 변수 `NODE_PATH`에 `npm root -g`의 출력 경로를 넣습니다.

확인:
```bash
node -e "require('playwright'); console.log('ok')"
```

### 5.3 Rust WASM 준비 (P3)
```bash
rustup target add wasm32-unknown-unknown
```
```bash
cargo install wasm-bindgen-cli --version 0.2.130 --locked
```

### 5.4 PostgreSQL 테스트 전용 계정·DB (P3·SP 테스트)

완성 코드의 테스트와 작업 에이전트 계약은 아래 계정을 기준으로 합니다. SP의 `ApiFactory.cs`도 기본값이 `wzh/wzh`입니다(학습자용 본문은 각자 값을 쓰게 안내합니다). **테스트 전용 계정입니다. 실제 서비스에 쓰지 마세요.**
```sql
CREATE ROLE wzh LOGIN SUPERUSER PASSWORD 'wzh';
CREATE DATABASE viewer_arena OWNER wzh;
CREATE DATABASE viewer_arena_test OWNER wzh;
CREATE DATABASE image_donation OWNER wzh;
CREATE DATABASE image_donation_test OWNER wzh;
```
- 이 SQL은 `psql -U postgres`로 접속한 상태에서 실행합니다.
- 테스트가 DB를 찾는 위치
  - P3 DB 테스트: 환경 변수 `TEST_DATABASE_URL`이 없으면 건너뜁니다. 예: `postgres://wzh:wzh@127.0.0.1:5432/viewer_arena_test`
  - SP: `ApiFactory.cs`의 기본값을 씁니다.

### 5.5 Docker (선택)
- 클라우드에서는 Docker Hub 익명 pull 제한 때문에 미러를 썼습니다. 컨테이너 빌드 때 프록시 인증서 문제도 있었습니다.
- 로컬 Docker Desktop에서는 대개 필요 없습니다.
- Docker가 없으면 Docker 스모크만 "미실행"으로 기록하고 진행합니다.

### 5.6 로컬 환경 주의
- 작업 에이전트용 스크래치 폴더는 **저장소 밖**에 둡니다. 예: `<repo>/../wzh-scratch/t16`.
  - 클라우드에서는 `/tmp/claude-0/.../scratchpad`를 썼습니다. 로컬에서는 지시문의 `{SCRATCH}`를 바꿔 넣습니다.
- 로컬 PC는 버리는 컨테이너가 아닙니다. 에이전트가 전역 설정·시스템 패키지를 바꾸지 않도록 계약에 적어 두었습니다.
- 다른 프로세스는 이름으로 죽이지 않습니다(`pkill`·`taskkill /im` 금지). 자기가 띄운 서버만 PID로 종료합니다.
- Windows에서 Claude Code의 Bash 도구는 Git Bash로 실행됩니다. 이 문서의 `bash …` 명령과 `.sh` 스크립트는 Git Bash에서 그대로 돕니다.
- 클라우드에서는 stop 훅이 "커밋 안 된 변경이 있다"고 계속 알렸습니다. 그래서 작업 중 파일을 `wip(...)` 스냅샷으로 자주 커밋했습니다(R45). 로컬에서는 컨테이너 유실 위험이 없으므로 **Task나 수정 회차가 끝날 때만 커밋해도 됩니다**. 다만 push는 Task마다 합니다.

---

## 6. 작업 폴더(진행 기록) 복구

### 6.1 왜 필요한가
이 프로젝트는 superpowers `subagent-driven-development` 방식으로 진행합니다. 오케스트레이터의 작업 폴더 `.superpowers/sdd/2026-11-01-web-zero-to-hundred/`는 git에서 제외됩니다(`.superpowers/sdd/.gitignore` = `*`). 그래서 같은 내용을 **`docs/checkpoint/workspace/`에 미러로 커밋**해 두었습니다. 리뷰용 diff 파일만 빼고 60개 파일입니다.

### 6.2 복구 명령
```bash
bash docs/checkpoint/restore-workspace.sh
```
- 작업 폴더를 만들고 미러를 복사합니다. 이미 있는 파일은 덮어쓰지 않습니다. 덮어쓰려면 `--force`를 붙입니다.
- 끝나면 진행 기록의 첫 줄이 다음과 같아야 합니다.
  `# SDD ledger — plan: docs/superpowers/plans/2026-11-01-web-zero-to-hundred.md`
- 스킬 규칙상 `Task N: complete` 줄이 있는 Task는 **다시 실행하지 않습니다.**

### 6.3 superpowers 스킬이 있을 때 / 없을 때
- **있을 때**
  - 스킬 스크립트 위치를 찾습니다.
    ```bash
    find ~/.claude -path '*subagent-driven-development/scripts/sdd-workspace' 2>/dev/null | head -1
    ```
  - `sdd-workspace PLAN`은 위와 같은 경로를 출력합니다.
  - `task-brief PLAN N`은 지시문을 다시 뽑습니다.
  - `review-package PLAN BASE HEAD`는 리뷰 패키지를 만듭니다.
- **없을 때**
  - 지시문은 이미 `workspace/task-N-brief.md`로 다 뽑아 두었습니다.
  - 리뷰 diff는 직접 만듭니다.
    ```bash
    git diff -U4 BASE HEAD -- <경로들> > .superpowers/sdd/2026-11-01-web-zero-to-hundred/review-tN.diff
    ```
- **묶음 Task 주의(R7)**: 계획서 제목이 `### Task 15 / 16 / 17 / 18:` 형식이라 대표 번호(9·15·22·30)로만 추출됩니다. 배치 정보(Day 범위·배치 이름)는 dispatch 문장에 넣습니다.

### 6.4 기록을 저장소에 남기기
진행 기록을 갱신할 때마다 미러에 복사하고 커밋합니다.
```bash
cp .superpowers/sdd/2026-11-01-web-zero-to-hundred/{progress.md,rulings.md,*-report.md} docs/checkpoint/workspace/
```
새 판정이 생기면 `rulings.md`도 다시 만듭니다.
```bash
WS=.superpowers/sdd/2026-11-01-web-zero-to-hundred; { head -4 docs/checkpoint/workspace/rulings.md; grep -E "^- (Ruling|Task [0-9]+: parked)" $WS/progress.md; } > $WS/rulings.md.new && mv $WS/rulings.md.new $WS/rulings.md
```

---

## 7. 재개 절차 (순서대로, 정확히)

공통으로 지킬 것은 세 가지입니다.
- **동시 실행 최대 5개**입니다(R57). 사용량 한도에 두 번 걸렸습니다.
- 병렬 작업 에이전트는 **NO GIT**이고, 커밋은 오케스트레이터가 Task 경로만 골라서 합니다.
- 지시문은 `dispatch-templates.md`의 틀을 씁니다.

### 7.1 T15 (P2 Day 1–10) — 재리뷰부터
- 수정은 끝났고 `6115e79`에 커밋되어 있습니다. 재리뷰만 남았습니다.
- **템플릿 D**로 재리뷰합니다. sonnet, 범위 `3173b9a..6115e79`.
  - 경로: `textbook/content/p2/day-0[1-9].md day-10.md`, `textbook/content/troubleshooting/p2-days-01-10.md`, `docs/verification/p2-days-01-10.md`
  - 확인할 지적 19개는 `progress.md`의 "T15 review" 줄과 "Task 15: fix round 1/5 dispatched" 줄, 그리고 `task-15-report.md`의 "## Fix round 1" 절에 있습니다.
  - **Day 8 무결성도 꼭 확인합니다.** 수정 중 잘못 편집해서 중복된 뒤 다시 만든 파일입니다. 중복 문단, 제목 순서, 코드 블록 개수, 수정 전 대비 빠진 내용을 봅니다.
- 통과하면 `Task 15: fix round 1/5 (…)`와 `Task 15: complete (commits 3173b9a..6115e79, review clean)`를 기록합니다.
  - 실패하면 **새** 구현 에이전트로 수정 회차를 이어 갑니다(템플릿 C의 "원래 에이전트가 없을 때"). 보고서 파일이 기억 역할을 합니다.

### 7.2 T12 (P1 통합) — 리뷰어 2명 → 반영 → 미리보기 전달
1. **템플릿 E1**(초보자 시뮬레이션)과 **E2**(기술 정확성)를 opus로 **동시에** 보냅니다.
   - E2는 `tests/e2e/smoke.test.mjs`도 리뷰합니다.
   - T12에 넘길 보류 항목은 `task-12-notes.md`에 있습니다. Day 1 보류 6개는 이미 고쳤고 나머지는 참고용입니다.
2. 두 리뷰의 지적을 **한 명의** 수정 에이전트(sonnet)에게 몰아 줍니다. 이 에이전트는 P1 Day 전체와 용어·모음을 고칠 수 있습니다.
3. 재리뷰(템플릿 D)를 합니다.
4. `cd textbook && npm test && npm run check -- --allow-missing && npm run test:e2e`가 통과해야 합니다.
5. **미리보기를 다시 빌드합니다(R55).** 리뷰가 끝난 Day만 넣고, P2·P3·SP의 Day 파일은 뺍니다.
   ```bash
   S=../wzh-scratch/preview && rm -rf $S && mkdir -p $S && cp -r textbook/content $S/content && find $S/content/p2 $S/content/p3 $S/content/sp -name 'day-*.md' -delete && node textbook/build.mjs --allow-missing --content $S/content --out index.html
   ```
   - 이때 이미 리뷰를 통과한 P2 Day(예: T15)는 넣어도 됩니다. 넣으면 사용자에게 어떤 Day를 넣었는지 알립니다.
6. 커밋(`feat(p1): 30-day creator homepage course`) → push → **사용자에게 `index.html`을 전달**하고 피드백을 받습니다.
7. 진행 기록에 `Task 12: complete …`를 남기고 Phase 1 완료로 표시합니다.

### 7.3 T16 (P2 Day 11–20) — 마무리 작업으로 새로 실행
- 저장소에 `textbook/content/p2/day-11.md`~`day-20.md`가 있습니다. 이전 에이전트가 Day 20 검증 중에 멈췄습니다.
- **없는 파일**: `textbook/content/troubleshooting/p2-days-11-20.md`, `docs/verification/p2-days-11-20.md`, 작업 폴더의 `task-16-report.md`.
- **템플릿 A**(sonnet)에 아래를 덧붙여 새로 실행합니다.
  > "이 배치의 Day 파일 10개는 이전 작업자가 썼고 리뷰 전입니다. 처음부터 다시 쓰지 말고, 개요·규칙과 대조해 고칠 곳을 고친 뒤 코드 검증(Day 11–20 전체, 특히 Day 20)을 수행하고, 문제 해결 모음·검증 기록·보고서를 작성하세요."
- 이 배치가 조사 문서에 추가한 sqlite3·EF Core 사실 두 줄은 이미 커밋되어 있습니다(R56).
- 끝나면 **템플릿 B**로 리뷰 → 수정(C) → 재리뷰(D)를 진행합니다.

### 7.4 T17 (P2 Day 21–30), T18 (P2 Day 31–40) — 처음부터
- **템플릿 A**로 새로 실행합니다(sonnet).
- T17에 특히 넣을 사실(`task-14-notes.md`에도 있음)
  - Day 26 `/api/me` 204와 관리자 시드 시나리오의 순서
  - Day 26 user-secrets
  - Day 27 CORS 실험
  - Day 29 `UtcDateTimeConverter` + `Intl.DateTimeFormat`, `change` 이벤트
- T18에 특히 넣을 사실
  - Day 31 가입 흐름 재시도
  - Day 34 HTTPS·CSRF 실험과 `dotnet dev-certs https --trust`
  - Day 36 통합 테스트 15개(8 + 15 = 23)
  - Mvc.Testing·xunit runner·Prettier 버전과 Prettier CRLF 동작은 **직접 확인해 검증 기록에 남길 것**(조사 문서에 없음)
  - Day 39 `UseForwardedHeaders`를 `UseRateLimiter`보다 앞에 둘 것
- 끝나면 각각 리뷰(B) → 수정(C) → 재리뷰(D)를 진행합니다.

### 7.5 그다음 순서
1. **T19 P2 통합**: T12와 같은 방식(E1·E2)입니다. 기술 리뷰어는 Microsoft Learn과 대조합니다. 끝나면 사용자에게 P2까지 들어간 미리보기를 전달합니다.
2. **T22–T26 P3 본문**: 배치 5개(9 Day씩)이고 템플릿 A를 씁니다.
   - 지시문은 `task-22-brief.md`, 메모는 `task-21-notes.md`입니다.
   - P3 개요에 §4 "중간 코드 모양 표"(R42)가 있으니 반드시 따르게 합니다.
   - Day 45에는 로드맵 링크를 넣지 않습니다(R39).
3. **T27 P3 통합**: The Rust Book·Axum·Tokio와 대조합니다.
4. **T30–T33 SP 본문**: 배치 4개이고 템플릿 A를 씁니다.
   - 지시문은 `task-30-brief.md`, 메모는 `task-29-notes.md`입니다.
   - SP 개요 §9 "중간 파일 뼈대"(R42)를 따르게 합니다.
   - Docker·PostgreSQL은 SP 안에서 처음부터 가르칩니다(R38).
5. **T34 SP 통합**: 치지직 문서·Microsoft Learn·React와 대조합니다.
6. **T35 부록**: install·shortcuts·roadmap 페이지(roadmap은 `requires:["p3"]`)를 씁니다. **P3 Day 45에 로드맵 링크도 추가**합니다(R39). 끝나면 `merge-meta`로 pages를 갱신합니다.
7. **T36 README + HANDOFF**: 계획서 T36의 모든 항목을 씁니다. P3 개요의 설계서 대비 변경 7가지(`task-21-report.md` "Fix round 1")를 HANDOFF에 옮깁니다.
8. **T37 최종 검증 + 전체 브랜치 리뷰**: 가장 유능한 모델로 합니다.
   - 범위: 저장소 첫 커밋부터 HEAD까지. 원격에는 `main`이 없고 이 브랜치만 있습니다(인계 시점 확인). 첫 커밋 `105a5eb`는 설계서만 담고 있으므로, 리뷰 범위는 `105a5eb..HEAD`입니다.
     ```bash
     git rev-list --max-parents=0 HEAD
     ```
   - 보류 Minor 목록(`progress.md`의 `minor (deferred)` 줄)도 함께 넘깁니다.
9. superpowers `finishing-a-development-branch`로 마무리합니다. 사용자에게 `rulings.md` 전체를 "제가 내린 결정"으로 보고합니다.

### 7.6 curriculum 병합 (개요의 `_meta.json`이 바뀔 때마다)
```bash
cd textbook && node ../.superpowers/sdd/2026-11-01-web-zero-to-hundred/merge-meta.mjs content && npm run check -- --allow-missing
```
- 프로젝트 순서는 p1, p2, p3, sp입니다. 페이지 순서는 start, help, glossary, troubleshooting이고 그 밖의 페이지는 뒤에 붙습니다.
- T35에서 페이지를 추가할 때는 `curriculum.json`의 pages를 직접 수정해도 됩니다.

---

## 8. 작업 방식 규칙 (지금까지 실제로 쓴 것)

- **Task 루프**
  - 구현 → 리뷰(스펙 + 품질) → Critical·Important가 있으면 수정(1~3회차는 같은 에이전트, 4~5회차는 더 강한 모델의 새 에이전트) → **회차마다 범위를 좁힌 재리뷰** → 통과하면 `Task N: complete`.
  - 최대 5회차입니다. 넘으면 판정(Ruling)으로 정리하고 진행합니다.
- **Minor 처리**
  - 가르치는 데나 막힘에 영향을 주는 Minor는 수정 대상으로 올리고, 판정으로 기록합니다(R40·R41·R48·R51·R52·R53·R58).
  - 나머지는 `Task N: minor (deferred): …`로 남겨 최종 리뷰에 넘깁니다.
- **모델**
  - opus: 설계·판단(개요, 완성 코드, 통합 리뷰, 최종 리뷰)
  - sonnet: Day 배치 작성과 배치 리뷰, 중간 크기 재리뷰
  - haiku: 아주 작은 재리뷰
  - 모델은 항상 명시합니다(R50).
- **병렬**
  - 파일이 겹치지 않는 Task만 병렬로 돌리고, 동시에 최대 5개입니다.
  - Day 배치마다 쓰는 파일은 `day-NN.md`, `troubleshooting/<batch>.md`, `docs/verification/<batch>.md`뿐입니다.
- **공유 문서 수정 금지(R56)**
  - 대상: 작업 에이전트는 `external-facts.md`, `CONTENT-GUIDE.md`, 개요, 기존 용어집을 고치지 않습니다.
  - 새로 확인한 사실은 자기 검증 기록에 적고, 오케스트레이터가 옮깁니다.
- **커밋**
  - Task 경로만 골라서 커밋합니다.
  - 메시지 끝에는 세션이 지정하는 attribution 줄을 붙입니다.
  - 저장소 파일에 모델 식별자를 쓰지 않습니다.
- **기타**
  - 리뷰어에게 "이건 지적하지 마라" 같은 선입견을 주지 않습니다.
  - 오케스트레이터는 직접 고치지 않습니다. 수정은 항상 에이전트가 하고 리뷰를 거칩니다.

---

## 9. 리뷰에서 반복해서 나온 교훈 (모든 Day 배치에 미리 넣을 것)

`dispatch-templates.md` §A의 (a)~(g)에 이미 들어 있습니다. 근거가 된 사례는 다음과 같습니다.
1. "아래 🧯을 보세요"가 그 Day에 없는 항목을 가리켰습니다(P1 Day 2·7). 참조는 그 Day 안에서 해결되어야 합니다.
2. 🧯이 7~9개로 늘어났습니다(P1 Day 21–29). **Day마다 3~6개**이고, 나머지는 모음으로 옮깁니다. 모음에도 모든 항목이 있어야 하며, 제목은 같은 뜻이면 됩니다(R54).
3. 과제에서 다른 폴더를 열고 끝나서 다음 Day가 막혔습니다(P1 Day 5). 과제 뒤 커밋을 하지 않아 다음 Day의 "변경 0개"와 어긋났습니다(P1 Day 8, P2 Day 7·8). → **"과제 후 커밋"을 필수**로 하고, 열린 폴더도 되돌립니다.
4. 화면 문구가 배치마다 달라졌습니다(P1 contents.html 안내 문장, about.html 문장). → 개요가 정한 Day에만 바꿉니다.
5. 선택 도구를 설치되어 있다고 가정했습니다(P1 Day 28 Chrome, P3 OBS). → Edge가 기본이고, Chrome·OBS는 "없으면 설치" 단계를 둡니다.
6. 배우지 않은 메서드·문법을 썼습니다(`.join`, `append`, `change` 이벤트, `minlength`, `ReadOnlySpan` 등). → 처음 쓰는 곳에서 한 문장으로 소개합니다.
7. 과제가 import를 빠뜨려 그대로는 실패했습니다(P2 Day 8 `wait`). → 정답에 바뀌는 줄을 모두 보여 줍니다.
8. 재현되지 않는 실습이 있었습니다(P2 Day 26 관리자 시드). → 실제로 실행해 확인한 순서만 싣습니다.
9. PowerShell 5.1에서 안 되는 명령을 썼습니다(.NET 6+ 정적 메서드). → Windows PowerShell 5.1 기준으로 쓰고, 실행 못 했으면 "실기 미확인"으로 표시합니다.

---

## 10. 검증하지 못한 것 (정직하게 기록)

- Windows 11 실제 화면과 메뉴 문구(한국어 Windows, VS Code, Edge DevTools의 Lighthouse·Network request blocking, SmartScreen·UAC, 설치 프로그램).
- PowerShell 5.1의 실제 오류 문구와 출력(이 환경에는 PowerShell이 없었습니다).
- 치지직 실서버 연동 전체(OAuth, 세션, 후원 이벤트, 채팅)와 앱 심사·약관·할당량. 로컬 에뮬레이터로만 검증했습니다.
- Windows 11 Home의 Docker Desktop 지원 여부(공식 요구사항 목록에 Home이 없습니다).
- SkiaSharp을 Windows에서 실제로 실행하는 것.
- OBS 33.0.1 설치 화면, GitHub 웹 화면(저장소 이름 바꾸기 등).
- 무료 배포 호스팅 정책(작성 시점의 조사 결과만 있음).
- SP·P3 개요의 중간 코드 뼈대(R42)는 컴파일하지 않았습니다. Day 작성자가 실행해서 확인해야 합니다.
- 로컬에 PowerShell(Windows)이 있으면 이 목록 중 일부를 실제로 확인해 `docs/verification/`에 남기는 것을 권장합니다.

---

## 11. 사용자에게 보고할 때
- 한국어로 짧게 보고하고, 큰 단계마다 결과물을 보냅니다.
  - T12: P1 미리보기 `index.html`
  - T19: P2 포함본
  - T37: 최종본
- 판정(Ruling)과 미검증 항목은 숨기지 않습니다. 최종 보고에서는 `rulings.md` 전체를 정리해 전달합니다.
