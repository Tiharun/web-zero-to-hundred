# (보관본) 체크포인트 2026-11-05

> **이 문서는 보관본입니다. 최신은 `docs/CHECKPOINT.md`입니다.** 이 문서에 나오는 경로 `docs/checkpoint/ledger.md`, `docs/checkpoint/reports/` 등은 `docs/checkpoint/workspace/`로 옮겨졌습니다.

> **2026-11-06 업데이트 (최신 — 아래 본문보다 우선합니다)**
> - 상태: **중지됨** (사용자 요청 "모든 작업을 멈춥니다"). 실행 중인 에이전트는 없습니다. 마지막 커밋은 `4288567`입니다.
> - 진행 기록은 `docs/checkpoint/ledger.md`에 있습니다. 끝부분의 "STOPPED by user" 항목이 멈춘 지점과 재개 순서이고, 판정은 R37–R58이 새로 추가되었습니다. 배치 규칙은 `docs/checkpoint/content-batch-rules.md`, 커리큘럼 병합 스크립트는 `docs/checkpoint/merge-meta.mjs`에 있습니다.
> - 완료(리뷰 통과): T1–T8, T9–T11(P1 Day 2–30), T13, T14, T20, T21, T28, T29. 개요 4개는 `curriculum.json`에 병합되어 있습니다(Day 155개). T12 1단계(스모크 테스트, Day 1 보류 수정, 미리보기 `index.html`)는 `6166d21`에 커밋되었습니다.
> - 남은 일(재개 순서):
>   1. T15(P2 Day 1–10) 1차 수정 재리뷰. 범위는 `3173b9a..6115e79`이고, Day 8 무결성도 확인합니다.
>   2. T12 리뷰어 ①(초보자 시뮬레이션)과 ②(기술 정확성) → 반영 → 사용자에게 미리보기 전달.
>   3. T16–T18(P2 Day 11–40) 작성 마무리 → 리뷰 → T19.
>   4. 이후 P3·SP 본문과 T35–T37.
> - `textbook/content/p2/day-11.md` 이후 파일은 **리뷰 전 WIP**입니다(`wip(...)` 커밋).

- 작성일: 2026-11-05
- 상태: **일시 정지됨** (사용자 요청 "잠시 작업 멈춰"). 실행 중인 에이전트는 없습니다.
- 저장소: `tiharun/web-zero-to-hundred` / 브랜치 `claude/gifted-goldberg-u1f9c6` (이 브랜치에만 push)
- 마지막 커밋: `d76194d` (WIP. 아래 4.1 참고). 마지막으로 리뷰를 통과한 커밋은 `21b63fa`입니다.
- 이 문서는 새 세션이 **다른 파일을 읽기 전에** 읽는 첫 문서입니다. 이전 세션의 작업 기록은 git에 포함되지 않는 `.superpowers/` 폴더에 있었는데, 그 내용을 `docs/checkpoint/`로 옮겨 두었습니다.

---

## 0. 30초 요약

1. **만드는 것**: 지식 0% 초보자(Windows 11, 하루 1~2시간)가 혼자 따라가는 **단일 HTML 교재** `index.html`. 총 155 Day입니다.
   - P1 크리에이터 홈페이지 30
   - P2 스트리머 허브 40
   - P3 시청자 참여 실시간 게임 45
   - 특별 프로젝트 SP 이미지 도네이션 40
   - 부록 + 졸업 로드맵
2. **가장 중요한 요구**: "중간에 막히지 않고 잘 따라갈 수 있는 것" (사용자의 말).
3. **진행 정도**: 37개 Task 중 **Phase 0(기반) 7개와 완성 코드 4개 중 3개**가 리뷰를 통과했습니다.
   - SP 완성 코드는 2차 수정이 거의 끝난 WIP 상태입니다.
   - Day 본문은 **P1 Day 1(견본) 하나만** 완성되어 있습니다.
4. **다음 할 일**: 5장 "재개 절차"를 그대로 따르세요. ① 환경 복구 → ② SP WIP 마무리와 리뷰 → ③ P1·P2·P3 개요(T8·T14·T21)를 처음부터 다시 실행 → 이후 계획서 순서대로 진행합니다.

---

## 1. 반드시 읽을 문서 (순서대로)

| 순서 | 파일 | 내용 |
|---|---|---|
| 1 | `docs/CHECKPOINT.md` (이 문서) | 현재 위치, 재개 절차, 판정 목록 |
| 2 | `docs/superpowers/specs/2026-11-01-web-zero-to-hundred-design.md` | **설계서(최상위 기준)**. 사용자가 승인했습니다. 155 Day 전체 일정이 들어 있습니다 |
| 3 | `docs/superpowers/plans/2026-11-01-web-zero-to-hundred.md` | **구현 계획서**. 사용자가 승인했습니다. Task 1~37, 각 Task의 인터페이스·테스트 |
| 4 | `docs/checkpoint/ledger.md` | 이전 세션의 진행 기록 원본. 모든 판정(Ruling)과 보류된 Minor 지적이 들어 있습니다 |
| 5 | `docs/checkpoint/implementer-contract.md` | 작업 에이전트에게 주던 공통 계약. NO GIT 규칙, 환경 메모, 보고 형식 |
| 6 | `docs/checkpoint/outline-rules.md` | 개요 Task(T8·T14·T21·T29) 전용 규칙. `_meta.json` 방식 포함 |
| 7 | `docs/checkpoint/global-constraints.md`, `review-focus.md`, `file-structure.md` | 계획서에서 뽑아 둔 전역 제약, 리뷰 초점, 파일 구조 |
| 8 | `docs/CONTENT-GUIDE.md` | 콘텐츠 작성 가이드(막힘 방지 규칙 (a)~(g), 문법, 검증법, 리뷰 체크리스트) |
| 9 | `docs/research/external-facts.md` | 버전·설치 절차·치지직 API 등 외부 사실과 출처(작성 기준 2026-11-01) |
| 10 | `docs/checkpoint/reports/task-N-report.md` | 완료된 Task별 구현 보고서(설계 선택과 미검증 항목) |

> 주의: `docs/checkpoint/implementer-contract.md` 안의 경로 `.superpowers/sdd/2026-11-01-web-zero-to-hundred/...`는 이전 세션의 작업 폴더입니다. 새 세션에서는 5.2에서 작업 폴더를 다시 만들고, 이 폴더의 파일을 그곳에 복사해서 씁니다.

---

## 2. 사용자와 확정된 결정 (다시 묻지 말 것)

- 사용자: 지식 0% 초보자, Windows 11, 하루 1~2시간. 장기 목표는 사이트·게임·리깅·유니티·언리얼 개발자, 콘텐츠를 자급자족하는 스트리머·유튜버, 외주, MCN 창업. 최종적으로 배울 언어는 C++과 Rust입니다. 취업보다 성장이 우선입니다.
- 언어 경로: HTML/CSS/JS(P1) → TypeScript + C#(P2) → Rust(P3) → 졸업 후 C++·언리얼 / 유니티.
- P2 스택은 **A안**(TS + C# ASP.NET Core + SQLite)으로 확정했습니다.
- P3는 **시청자 참여 멀티플레이 웹게임**(Rust 서버 + Rust→WASM + TS Canvas + PostgreSQL + Docker)입니다.
- SP(특별 프로젝트)는 **이미지 도네이션 서비스**(C# + SignalR + React + PostgreSQL + Docker + 치지직 API)입니다. P2를 마치면 언제든 해금됩니다.
  - **운영자는 돈을 받지 않습니다.**
  - 모드는 무료 이미지 후원, 그리고 치즈 후원 메시지 코드 매칭(선택) 두 가지입니다.
  - 테스트 모드가 있어야 합니다.
- 해금 순서: P1 → P2 → (P3 → 졸업 로드맵) / (SP 언제든).
- 3차를 마치면 **졸업 로드맵**을 반드시 넣습니다.
- 4차 프로젝트를 나중에 추가할 수 있도록 **HANDOFF.md**(Task 36)를 반드시 씁니다.
- 실행 방식은 **Subagent 방식**입니다(사용자가 선택). 작업마다 새 구현 에이전트를 쓰고, 작업마다 리뷰 → 수정 → 재리뷰를 거치며, 마지막에 전체 리뷰를 합니다.
- 사용자 선호: 답변은 한국어로 합니다. 정확성, 실무 표준, 추측 금지, 모르는 것은 명시합니다.

---

## 3. 진행 현황표

범례: ✅ 리뷰를 통과해 완료 / 🟡 WIP(리뷰 전) / ⏸ 시작했지만 중단됨(산출물 없음) / ⬜ 시작 전

### Phase 0 — 기반 ✅ 전체 완료
| Task | 내용 | 상태 | 핵심 커밋 |
|---|---|---|---|
| T1 | 외부 사실 조사 `docs/research/external-facts.md` | ✅ | 0326afd, 8c1884c (+afc8662, 6580cee, 21b63fa에서 일부 갱신) |
| T2 | 렌더러·검증기 `textbook/lib/markdown.mjs`, `validate.mjs` | ✅ | 7250704, 111735f |
| R27 | 굵게 깨짐 빌드 오류 `E_BOLD_UNRENDERED` | ✅ | 2cb312d, 02ae6e8 |
| T3 | 커리큘럼 로더·용어 병합·단일 파일 조립·빌드 CLI | ✅ | 8f71f0c |
| T4 | 진도·해금·저장·검색·라우터 로직 | ✅ | ca0fb77, dc3e978 |
| T5 | 런타임 화면·스타일·e2e | ✅ | 08e71d9, 1cb0557 |
| T6 | `docs/CONTENT-GUIDE.md` + 견본 `textbook/content/p1/day-01.md` + curriculum(P1 30 Day 메타 초안) | ✅ | e81daf6, afc8662 |
| T7 | P1 완성 코드 `reference/p1-my-creator-site/` | ✅ | a29862b, fa134f8 |

### 완성 코드(정답의 원천)
| Task | 내용 | 상태 | 커밋 |
|---|---|---|---|
| T13 | P2 `reference/p2-streamer-hub/` | ✅ | 356116c, 7648078 |
| T20 | P3 `reference/p3-viewer-arena/` | ✅ | bf9ac3f, d21948b, 81a777e |
| T28 | SP `reference/sp-image-donation/` | 🟡 2차 수정 WIP | 070f5df, 6580cee, 21b63fa(1차 수정 리뷰 통과), **d76194d(2차 WIP)** |

### Phase 1~5
| Task | 내용 | 상태 |
|---|---|---|
| T8 | P1 상세 개요 + 시작하기·막혔을 때 페이지 | ⏸ (산출물 없음, 처음부터 다시) |
| T9–T11 | P1 Day 2–30 본문(병렬 3배치) | ⬜ |
| T12 | P1 통합 리뷰 + 스모크 테스트 + **사용자에게 미리보기 전달** | ⬜ |
| T14 | P2 상세 개요·용어 | ⏸ (산출물 없음, 처음부터 다시) |
| T15–T18 | P2 Day 1–40 본문(병렬 4배치) | ⬜ |
| T19 | P2 통합 리뷰 | ⬜ |
| T21 | P3 상세 개요·용어 | ⏸ (산출물 없음, 처음부터 다시) |
| T22–T26 | P3 Day 1–45 본문(병렬 5배치) | ⬜ |
| T27 | P3 통합 리뷰 | ⬜ |
| T29 | SP 상세 개요·용어 (T28 완료 후) | ⬜ |
| T30–T33 | SP Day 1–40 본문(병렬 4배치) | ⬜ |
| T34 | SP 통합 리뷰 | ⬜ |
| T35 | 부록(설치 체크리스트·단축키·졸업 로드맵) | ⬜ |
| T36 | README.md + HANDOFF.md | ⬜ |
| T37 | 최종 검증 + 전체 브랜치 리뷰 | ⬜ |

### 2026-11-05에 확인한 상태 (이 문서를 쓸 때 직접 실행)
- `cd textbook && npm test` → **168/168 통과**
- `cd textbook && npm run check -- --only p1-d01` → 통과("Day 30개, 페이지 2개", Day 1만 렌더)
- SP WIP(`d76194d`): `dotnet test` **54/54 통과**, 클라이언트 `tsc -b` 통과, `npm test` **8/8 통과**. **e2e와 Docker 스모크는 아직 실행하지 않았습니다.**
- 루트 `index.html`은 **아직 만들지 않았습니다**(P1이 완성되는 T12에서 처음 빌드합니다).

---

## 4. 멈춘 지점 상세

### 4.1 T28 SP 완성 코드 — 2차 수정 (WIP 커밋 `d76194d`)
2차 수정에서 요청한 4가지(판정 R36)는 다음과 같습니다.
1. 긴급 정지 시 오버레이에 `Clear()`를 **먼저** 보내고, 그다음 상태를 저장합니다. 항목 하나가 실패해도 나머지는 계속 처리합니다. 파일 삭제가 실패해도 Clear가 도착하는지 확인하는 테스트를 둡니다(`FailingDeleteStorage.cs`).
2. `DashboardPage.tsx`: 신고에 실패했는데 "신고했어요."로 덮어쓰는 문제를 고치고, 실패 경로 테스트를 추가합니다.
3. `/media/{file}`: DB를 조회하기 전에 파일 이름 형식을 먼저 검사합니다.
4. `DonationCard.tsx`: 이미지가 이미 없는 후원(일반 거절·Cleared·Expired)에서는 신고 버튼을 숨기거나 설명을 붙입니다. 신고된 후원은 "증거로 보관 중(7일 뒤 삭제)"으로 표시합니다.

중단 직전에 에이전트가 남긴 마지막 말은 "Both pass under double load. Noting the second `Clear()` in the README, then final client + e2e runs."입니다. 따라서 **남은 일은 README 한 줄 보강, e2e 실행, 보고서 작성**입니다.

마무리 방법:
1. 새 구현 에이전트(opus)에게 다음을 맡깁니다.
   - 위 4개 항목이 코드에 다 들어갔는지 확인하고, README에 "긴급 정지는 Clear()를 먼저 보낸다"를 적습니다.
   - `dotnet build -c Release`, `dotnet test`, 클라이언트 `npx tsc -b && npm test && npm run build`, `node --test tests/reference/sp.e2e.test.mjs`를 실행합니다.
   - 결과를 `docs/checkpoint/reports/task-28-report.md`에 "fix round 2" 절로 추가합니다.
2. 재리뷰어(sonnet)에게 `21b63fa..HEAD`(경로 `reference/sp-image-donation`) 범위 diff로 위 4개 항목의 판정을 받습니다.
3. 통과하면 진행 기록에 `Task 28: complete`를 남깁니다. 그다음 T29(SP 개요)를 시작할 수 있습니다.

### 4.2 T8 · T14 · T21 개요 — 중단됨, 산출물 없음
- 세 에이전트 모두 디스크에 파일을 쓰기 전에 중지했습니다(`textbook/content/p1/_outline.md`, `pages/`, `p2/`, `p3/`, `glossary/p2.md` 모두 없음).
- **처음부터 다시 실행**합니다. 셋 다 병렬로 실행해도 됩니다(판정 R32). 서로 다른 파일만 쓰고, `curriculum.json`은 직접 고치지 않습니다.
- 각 Task 지시문에 넣어야 할 "알려진 사실 메모"는 **7장**에 정리했습니다. 이전 세션의 실제 지시문 내용도 7장에 반영해 두었습니다.

---

## 5. 재개 절차 (새 세션에서 그대로 따라 하기)

### 5.1 환경 복구 (컨테이너가 새로 시작되면 매번)
```bash
cd /home/user/web-zero-to-hundred && git fetch origin claude/gifted-goldberg-u1f9c6 && git checkout claude/gifted-goldberg-u1f9c6 && git pull origin claude/gifted-goldberg-u1f9c6
```
```bash
cd /home/user/web-zero-to-hundred/textbook && npm ci
```
```bash
command -v dotnet || apt-get install -y dotnet-sdk-10.0
```
```bash
rustup target add wasm32-unknown-unknown && (command -v wasm-bindgen || cargo install wasm-bindgen-cli --version 0.2.130 --locked)
```
PostgreSQL(테스트 전용 계정. 이미 있으면 CREATE는 오류가 나지만 무시해도 됩니다):
```bash
pg_ctlcluster 16 main start
```
```bash
su postgres -c "psql -q" <<'EOF'
CREATE ROLE wzh LOGIN SUPERUSER PASSWORD 'wzh';
CREATE DATABASE viewer_arena OWNER wzh;
CREATE DATABASE viewer_arena_test OWNER wzh;
CREATE DATABASE image_donation OWNER wzh;
CREATE DATABASE image_donation_test OWNER wzh;
EOF
```
Docker: Docker Hub 익명 pull이 429로 막히므로 미러를 설정합니다.
```bash
mkdir -p /etc/docker && echo '{"registry-mirrors":["https://mirror.gcr.io"]}' > /etc/docker/daemon.json && (nohup dockerd > /tmp/dockerd.log 2>&1 &) && sleep 6 && docker info --format '{{.ServerVersion}}'
```
- 컨테이너 안에서 빌드할 때는 프록시 CA를 신뢰하지 않아 `docker compose up --build`가 실패할 수 있습니다. 이전 세션은 **검증용 복사본 Dockerfile**(스크래치 폴더)에 프록시 CA를 추가해 검증했고, 저장소의 Dockerfile은 바꾸지 않았습니다. 방법은 `/root/.ccr/README.md`에 있습니다.
- 네트워크: npm, crates.io, NuGet, apt, mcr.microsoft.com, mirror.gcr.io는 접속됩니다. **github.com 릴리스 다운로드와 Microsoft 다운로드 서버(dot.net)는 차단**되어 있습니다. 공식 문서 사이트 일부(learn.microsoft.com, support.microsoft.com, docs.docker.com, chzzk 문서)도 열리지 않아서, 이전 세션은 GitHub raw 소스나 검색 요약으로 확인했습니다.

### 5.2 작업 폴더(진행 기록) 복구
이 프로젝트는 superpowers `subagent-driven-development` 방식으로 진행했습니다. 작업 폴더는 git에 포함되지 않습니다(`.superpowers/sdd/.gitignore`).
```bash
cd /home/user/web-zero-to-hundred && SK=$(dirname "$(find /root/.claude -path '*skills/subagent-driven-development/scripts/sdd-workspace' 2>/dev/null | head -1)") && WS=$(bash $SK/sdd-workspace docs/superpowers/plans/2026-11-01-web-zero-to-hundred.md) && echo $WS
```
```bash
cd /home/user/web-zero-to-hundred && WS=.superpowers/sdd/2026-11-01-web-zero-to-hundred && cp docs/checkpoint/ledger.md $WS/progress.md && cp docs/checkpoint/{implementer-contract,outline-rules,global-constraints,review-focus,file-structure}.md $WS/ && cp docs/checkpoint/reports/*.md $WS/
```
- 진행 기록(`progress.md`)의 첫 줄은 `# SDD ledger — plan: docs/superpowers/plans/2026-11-01-web-zero-to-hundred.md`입니다. 스킬 규칙상 `Task N: complete` 줄이 있는 Task는 **다시 실행하지 않습니다.**
- 진행 기록에 이어서 쓴 뒤, 필요할 때마다 `docs/checkpoint/ledger.md`에도 복사해 커밋해 두세요. 컨테이너가 사라져도 기록이 남습니다.
- Task 지시문(brief)은 스크립트로 계획서에서 다시 뽑습니다: `bash $SK/task-brief docs/superpowers/plans/2026-11-01-web-zero-to-hundred.md N`
  - **주의(판정 R7)**: 묶음 Task의 제목이 `### Task 9 / 10 / 11:`처럼 되어 있어서, N=10·11은 추출에 실패합니다. N=9로 뽑은 지시문에 "이번 배치는 Day 11–20" 같은 배치 정보를 덧붙여 씁니다. 15–18(→15), 22–26(→22), 30–33(→30)도 같습니다.
  - T14·T19·T21·T27·T29·T34처럼 "Task 8/9/12와 같다"고만 적힌 Task는 **참조된 Task의 지시문도 함께** 줍니다.

### 5.3 재개 순서
1. **T28 마무리**(4.1) — T29의 선행 조건입니다.
2. **T8 · T14 · T21** 병렬 실행(4.2, 7장 메모 포함) → 각각 리뷰(opus, 선행 지식 순서 검사) → 수정 → 재리뷰.
   - 끝날 때마다 각 `textbook/content/<pid>/_meta.json`을 `curriculum.json`에 합칩니다. 오케스트레이터가 직접 하고, 프로젝트 순서는 p1, p2, p3, sp, 페이지는 start, help, glossary, troubleshooting 순입니다.
   - 합친 뒤에는 `npm run check -- --allow-missing`이 오류 0이어야 합니다.
3. T28이 끝나면 **T29**(SP 개요)를 실행합니다.
4. 개요가 확정된 프로젝트부터 **Day 본문 배치**를 병렬로 돌립니다: T9–11 → T12(P1 통합, **사용자에게 미리보기 index.html 전달**) → T15–18 → T19 …
5. T35 → T36(HANDOFF) → T37 → 전체 브랜치 최종 리뷰(가장 유능한 모델) → superpowers `finishing-a-development-branch`.

---

## 6. 작업 방식 (이전 세션에서 실제로 쓴 규칙)

- **병렬 실행 (진행 기록의 Setup rulings)**
  - 파일이 겹치지 않는 Task는 병렬로 실행합니다(동시 최대 5개).
  - 병렬 작업 에이전트는 **NO GIT**입니다. add, commit, push, stash, checkout, reset을 모두 하지 않습니다.
  - 에이전트가 보고하면 **오케스트레이터가 그 Task의 경로만 골라 커밋 1개**를 만듭니다. 그다음 리뷰 패키지(`review-package` 스크립트, 또는 경로 필터를 건 `git diff`)를 만들어 리뷰어에게 줍니다.
  - 같은 파일에 두 Task의 변경이 섞이면 hunk 단위로 나눠 stage합니다. T28과 T6이 함께 고친 `external-facts.md`에서 실제로 그렇게 했습니다.
- **리뷰 루프**
  - 구현 → 리뷰(스펙 준수 + 품질) → Critical·Important가 있으면 같은 에이전트를 재개해서 고치고(1~3회차), 범위를 좁혀 재리뷰합니다. 최대 5회입니다.
  - 정답 코드와 견본 Day는 "초보자가 그대로 배우는 코드"입니다. 그래서 **가르치는 데 영향을 주는 Minor는 수정 대상으로 올렸습니다**(판정 R11·R12·R17·R22·R24·R25·R30·R31·R34·R36). 올리지 않은 Minor는 진행 기록에 `minor (deferred)`로 남깁니다.
- **모델 선택**
  - 설계·판단이 필요한 일에는 opus를 씁니다: 완성 코드 P2·P3·SP, 개요, 가이드, 견본 Day, 큰 리뷰, 최종 리뷰.
  - 명세가 분명한 구현과 일반 리뷰에는 sonnet, 작은 재리뷰에는 haiku를 씁니다.
  - Day 본문 배치는 sonnet으로 계획했습니다.
- 작업 에이전트는 다른 프로세스를 죽이면 안 됩니다(`pkill` 금지). 자기가 띄운 프로세스만 PID로 종료합니다. 실제로 `pkill -x node` 사고가 한 번 있었습니다.
- 커밋 메시지 끝에는 시스템이 지정한 attribution 줄을 넣습니다. 저장소 파일에 모델 식별자를 쓰지 않습니다.
- PR은 사용자가 요청할 때만 만듭니다(아직 요청 없음).

---

## 7. 다음 Task에 반드시 넣을 메모 (리뷰에서 나온 사실)

### T8 (P1 개요) — `reference/p1-my-creator-site` 관련
- Day 1은 이미 완성되어 있습니다(`textbook/content/p1/day-01.md`). Day 2는 "VS Code로 `C:\dev\hello`를 연다"는 약속을 이어받아야 합니다. `glossary/p1.md`의 Day 1 용어 15개는 그대로 유지합니다.
- `js/main.js`의 테마 코드는 Day 22에서 try/catch를 씁니다(주석으로 "try/catch는 Day 25에서 배워요"라고 예고). 따라서 Day 22는 try/catch 없는 버전 또는 예고를 넣은 버전으로 가르치고, Day 25에서 설명합니다.
- 시간 코드는 **브라우저 로컬 시간**을 씁니다(PC 시계가 한국 시간이라고 가정. 시간대는 P2 Day 29에서 다룹니다). YouTube ID는 예시이므로 학습자가 자기 ID로 바꿉니다.
- 연락 폼에는 선택 항목 `채팅 닉네임`(`pattern="[A-Za-z0-9가-힣_]{2,20}"`)이 있고 `validity.patternMismatch`로 검사합니다. 그래서 Day 24에서 Constraint Validation API를 소개합니다.
- 오버레이는 `?title=&start=HH:MM`을 `split(':')` + `Number()` + 범위 검사로 읽습니다.
- JS는 템플릿 리터럴(Day 16)과 화살표 함수 콜백(Day 18)을 일관되게 씁니다.
- 설계서 3.1에 이름이 없는 메서드는 처음 등장하는 Day에 소개합니다: padStart, split, trim, includes, closest, dataset, setAttribute/removeAttribute, hidden, URLSearchParams, Number, Math.floor.
- 테마 토글은 고정 라벨 "다크 모드" + `aria-pressed`이고, contents.html에는 h2 "영상 목록"이 있습니다.
- start.md(교재 사용법·학습 원칙·전체 지도·준비물)와 help.md(막혔을 때 탈출 가이드)를 쓰고, `_meta.json`의 pages에 start → help 순서로 넣습니다.

### T12 (P1 통합 리뷰)에서 Day 1에 함께 고칠 것 (T6 보류 Minor)
- "글자를 치면 이름이 통째로 지워지니" 문장이 부정확합니다. 실제로는 선택된 부분만 바뀝니다.
- "열린 상태에서 이미 이름을 바꿨다면" 경로에 5단계 잔여 파일 안내가 빠져 있습니다.
- 한/영 전환 뒤 영어로 되돌리라는 말이 없습니다.
- CONTENT-GUIDE §1.5 제목 "빌드는 통과하지만…"이 이제 사실과 다릅니다.
- "Destination Folder Access Denied" 안내에 인라인 "계속 → 예"와 되돌아가는 링크가 없습니다.
- 메모장에 "항상"을 눌렀을 때의 복구 방법이 없습니다.

### T14 (P2 개요) — `reference/p2-streamer-hub` 관련
- `GET /api/me`는 비로그인 시 **204**를 돌려줍니다(401이 아님. 공개 페이지에서 콘솔 오류를 피하려는 의도). 이 동작과 이유를 가르칩니다.
- Day 27(CORS)과 Day 34(HTTPS·CSRF)는 코드에 직접 대응하는 부분이 없습니다(Vite 프록시와 SameSite=Lax 때문). 그래서 작은 실험과 설명을 개요에 넣습니다.
- Day 39: 리버스 프록시 뒤에서는 `UseForwardedHeaders`(ForwardedHeaders = XForwardedFor + KnownProxies/KnownIPNetworks)를 `UseRateLimiter`보다 **앞에** 둬야 합니다.
- `Dtos/HttpUrlAttribute.cs`(override, is 패턴, out var)는 그 Day에 문법을 소개하거나 "읽기만 하고 나중에 이해해요" 상자로 처리합니다.
- 관리자 시드는 `CheckPasswordAsync`가 성공할 때만 기존 계정을 승격합니다. 같은 이메일을 먼저 가입해 두는 위험을 가르칩니다.
- SQLite는 UTC 표식을 잃기 때문에 `UtcDateTimeConverter`를 씁니다. 저장은 UTC, 표시는 `Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul'})`(Day 29)이며, P1의 로컬 시간과 비교해 설명합니다.
- 가입 흐름은 register → login → PUT /api/me(닉네임)이고, 닉네임 저장이 실패하면 재시도할 수 있습니다.
- 서버는 DisplayName을 trim하지 않습니다(보류 Minor).
- Windows에서 막힐 수 있는 지점을 Day에 배정합니다: PowerShell 실행 정책(Day 3, npm.ps1 오류), `dotnet dev-certs https --trust`, 포트 충돌, 첫 `dotnet run` 때의 방화벽 창, user-secrets 위치, SQLite 파일 위치, CRLF.
- `Microsoft.AspNetCore.Mvc.Testing` 10.0.14, xunit runner, Prettier 옵션(`--single-quote --print-width 120`)은 조사 문서에 아직 없습니다(Day 35~37 작성자에게 알립니다).

### T21 (P3 개요) — `reference/p3-viewer-arena` 관련
- 서버는 `DATABASE_URL` 없이도 실행됩니다(랭킹은 꺼지고 경고만 남음). Day 33 이전 단계와 Docker 없는 경로에서 이 점을 씁니다. DB 테스트는 `TEST_DATABASE_URL`이 없으면 조용히 건너뛴다는 사실을 테스트 Day에 명시합니다.
- `HOST`의 기본값은 127.0.0.1입니다. 같은 와이파이의 휴대폰으로 플레이하려면 `HOST=0.0.0.0` + Windows 방화벽 "허용"이 필요합니다.
- 예측은 서버 위치를 향한 부드러운 보정입니다(프로토콜에 입력 ack가 없음). 보정(reconciliation)은 개념으로 설명합니다.
- 랭킹 `day`는 "최근 24시간"입니다.
- 안전 장치:
  - 메시지 크기 1 KB 제한
  - 연결당 초당 30프레임(바이너리 프레임 포함)
  - 10초 유휴 타임아웃. 쓰기도 마감 시간 안에서만 합니다(`write()` + `timeout_at`)
  - 닉네임 1~12자. 보이지 않는 문자·포맷 문자·한글 채움 문자(U+3164 등)를 거부하는 거부 목록 방식이므로 허용 목록 방식과의 장단점을 설명합니다
  - 중복 닉네임 거부, 금지어
- 모듈 의존은 한 방향입니다(`Phase`는 protocol.rs에 있음). Day 11 예시로 쓰기 좋습니다.
- 추가 crate: tower-http, dotenvy(.env는 cargo가 아니라 dotenvy가 읽음), 테스트 전용 tokio-tungstenite/futures-util/reqwest. QR은 브라우저의 qrcode-generator 2.0.4를 씁니다.
- Docker 캐시는 변경이 없을 때만 효과가 있습니다. 관리형 Postgres가 TLS를 요구하면 sqlx에 TLS feature가 필요합니다(Day 41/42).
- 호스트 화면은 3초마다 다시 연결합니다. 방은 메모리에만 있으므로 서버를 재시작하면 새 OBS URL이 필요합니다.
- 설계서 3.3의 구조를 유지합니다: Rust 기초 1–12 → TS 로컬 게임 13–18 → Day 19에 Rust로 이식 → Day 20 WASM → 네트워크 21–32 → Docker/DB 33–40 → 배포·리허설·회고 41–45. 유니티 Update(), 언리얼 데디케이티드 서버, C++ RAII와의 연결은 `:::info`로 넣습니다.

### T29 (SP 개요) — `reference/sp-image-donation` 관련
- 이미지 라이브러리는 **SkiaSharp 4.154.0(MIT)**입니다. ImageSharp는 Release 빌드에 라이선스 키가 필요하고 매출 기준 상용 라이선스가 있어서 제외했습니다(R28).
- 애니메이션 GIF는 첫 프레임만 씁니다(R29). EXIF 회전을 적용하고 WebP로 재인코딩합니다. 디코딩 한도는 헤더 1억 픽셀, 디코딩 4096²입니다.
- 상태: AwaitingCheese, Pending, Approved, Shown, Rejected, Expired, **Cleared**(긴급 정지).
  - 모든 전이는 조건부 `ExecuteUpdate`로 합니다.
  - 오버레이에 연결하면 최근 30분 안에 승인된 후원을 다시 보냅니다.
  - 긴급 정지는 Clear()를 먼저 보내고(WIP 항목) 상태를 Cleared로 저장합니다.
- **신고(R33·R35)**
  - 스트리머가 운영자에게 신고하면 Report 행을 만들고, 거절과 차단을 한 번에 처리합니다.
  - 이미지는 증거로 보관하되 `/media`로는 제공하지 않고(404), 7일 보존 기간이 끝나면 삭제합니다.
  - 운영자 화면은 없고 SQL로 검토합니다.
- 치지직
  - 소켓은 SocketIOClient 4.0.5, `EIO=V3`이고 인증값은 `Query["auth"]`로 넘깁니다. 로컬 에뮬레이터(Socket.IO 2.5.0)로만 검증했고 **실서버는 검증하지 못했습니다.**
  - 리프레시 토큰은 1회용이며 회전합니다. 잠금 안에서 다시 읽고 저장하는데, 잠금은 프로세스 하나 안에서만 유효합니다.
  - 매칭되지 않은 후원 이벤트의 닉네임·메시지는 저장하지 않습니다(최소 수집).
- React 템플릿의 기본 린터 Oxlint를 씁니다(ESLint 없음, R23). `/api/auth/me`는 비로그인 시 204입니다.
- 운영자가 결제를 다루지 않는 원칙, 테스트 모드를 기본 경로로 둘 것, 법적 고려(Day 32)에 "법률 자문 필요"를 명시할 것은 계획서 T29에 이미 들어 있습니다.

### 모든 콘텐츠 배치 공통
- `docs/CONTENT-GUIDE.md`를 따릅니다. 빌드가 막는 규칙은 다음과 같습니다.
  - `:::`는 0열에 씁니다
  - 원시 HTML은 escape됩니다
  - Markdown 이미지는 쓸 수 없습니다
  - TODO 같은 자리표시 단어는 금지입니다
  - 코드 블록에는 언어를 표기합니다
  - `[[용어]]`는 정확한 대소문자로 씁니다
  - `E_BOLD_UNRENDERED`
- Docker를 쓰는 Day(P3·SP)에는 항상 Docker 없는 경로를 함께 두고, 설치 전에 `winver`와 Windows 에디션을 확인하게 합니다. Windows 11 Home의 Docker Desktop 지원 여부는 **미확인**입니다.
- 검증 기록은 `docs/verification/<batch>.md`, 화면 캡처는 축소한 JPEG로 남깁니다(R26).

---

## 8. 판정(Ruling) 목록 요약 — 사용자 대신 내린 결정

자세한 내용은 `docs/checkpoint/ledger.md`에 있습니다. 틀렸다면 되돌릴 수 있는 결정들입니다.

| ID | 결정 | 틀렸을 때 비용 |
|---|---|---|
| Setup | worktree 없이 지정 브랜치에서 직접 작업. 병렬 에이전트는 NO GIT, 오케스트레이터가 경로별로 커밋. 판단 작업은 opus | 낮음 |
| R1 | slugify가 앞뒤 `-`를 잘라 `p1-d01-따라하기` 형태의 id를 만듦 | 없음 |
| R3 | Day minutes 60~120 범위 밖이면 스키마 오류 | 없음 |
| R4 | 빌드 `--allow-missing`(미작성 Day는 "준비 중"으로 표시), `--only` | 낮음 |
| R5 | 테스트 헬퍼는 T7이 만들고 T5가 사용 | 없음 |
| R6 | start·help 페이지는 T8에서 추가 | 없음 |
| R7 | 묶음 Task는 대표 Task의 지시문 + 배치 정보로 실행 | 없음 |
| R8 | 빌드 의존성 버전 정확 고정(marked 18.1.2, highlight.js 11.12.0, esbuild 0.28.2) | 없음 |
| R9 | TODO 금지 검사는 코드 안까지 적용. 힌트는 "// 여기에 코드를 작성하세요" | 낮음 |
| R10 | Markdown 이미지 금지(단일 오프라인 파일이므로) | 그림이 필요하면 나중에 data URI 지원 추가 |
| R13 | P1 시간 코드는 로컬 시간 기준(시간대는 P2) | PC 시계가 한국 시간이 아니면 오버레이 시간이 어긋남(주석으로 안내) |
| R14·R19 | 완성 코드 작업은 조사(T1) 리뷰 후 시작 | 없음 |
| R15 | styles.css가 없으면 빌드 오류, builtAt은 날짜만 | 없음 |
| R16 | 검색 색인에 정답 내용 포함(짧은 미리보기에 정답이 보일 수 있음) | 작음 |
| R18 | P3·SP의 Docker 수업에는 Docker 없는 경로 병기 + 에디션 확인 | 글 분량 증가 |
| R20·R21 | 잠긴 페이지·Day는 검색 결과에서 제목만 보임. `search(index, q, isItemLocked)` | 없음 |
| R23 | SP React는 Oxlint만 사용 | ESLint를 언급하는 정도 |
| R26 | 검증 스크린샷은 축소 JPEG | 화질 낮음 |
| R27 | 굵게가 깨지면 빌드 오류(`E_BOLD_UNRENDERED`) | 작은 엔진 변경 |
| R28 | ImageSharp 대신 SkiaSharp(MIT) | 이미 반영 |
| R29 | 애니메이션 GIF는 첫 프레임만 | GIF가 정지 이미지로 나옴 |
| R32 | 개요 Task는 `_meta.json`에 쓰고, 오케스트레이터가 curriculum.json에 병합 | 병합 단계 1회 |
| R33·R35 | SP 신고 기능 최소 구현, 신고 이미지는 7일 동안 격리 보관 | 최대 7일 보관 |
| R11·R12·R17·R22·R24·R25·R30·R31·R34·R36 | 가르치는 데 영향을 주는 Minor를 수정 대상으로 올림 | 수정 회차 증가 |
| (T5 보류) | 용어 딥링크로 들어오면 첫 Tab 위치가 본문으로 감(의도된 동작으로 유지) | 키보드 사용자가 Shift+Tab을 한 번 누름 |

---

## 9. 검증하지 못한 것 (정직하게 기록)

- Windows 11 실제 화면과 메뉴 문구. 한국어 Windows 문구 일부는 "버전에 따라 다를 수 있어요"로 대비했습니다. 새 복구 경로(Day 1)는 Windows에서 실행해 보지 못했습니다.
- Edge 렌더링, Malgun Gothic·Consolas 글꼴, Edge의 클립보드 대체 경로(Chromium에서만 확인).
- 치지직 실서버 연동 전체(OAuth, 세션, 후원 이벤트, 채팅). 앱 심사 기준, 약관, 할당량도 확인하지 못했습니다.
- Windows 11 Home에서 Docker Desktop이 지원되는지(현재 공식 요구사항 목록에 Home이 없음).
- SkiaSharp를 Windows에서 실제로 실행하는 것(패키지에 libSkiaSharp.dll이 포함된 것만 확인).
- `npm.cmd`로 실행 정책을 우회하는 방법과 정확한 한국어 PowerShell 오류 문구.
- 무료 배포 호스팅 정책(작성 시점의 조사 결과만 있음).
- SP WIP(`d76194d`)의 e2e와 Docker 스모크(4.1에서 실행 예정).

---

## 10. 사용자에게 보고할 때
- 사용자에게는 한국어로 짧게 보고합니다. 큰 단계(P1 완성 등)마다 결과물을 보냅니다. T12에서는 `index.html` 미리보기를 보냅니다.
- 끝날 때(최종 보고) 8장의 판정 목록(진행 기록의 모든 `Ruling:` 줄)을 "제가 내린 결정"으로 정리해 사용자에게 알립니다.
