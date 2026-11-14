# 체크포인트 — 로컬 세션에서 여기서부터 이어서 하세요

- 작성일: 2026-11-14 (M13 완료 시점)
- 상태: **M13 완료, 다음은 M14**. 마일스톤 목록과 순서는 `docs/superpowers/specs/2026-11-12-unified-roadmap-design.md` 11장입니다.
- 공개 주소: https://tiharun.github.io/web-zero-to-hundred/ (push하면 GitHub Actions가 테스트 → 빌드 → Pages 배포. 공개 범위는 `textbook/content/published.json`)
- 저장소: `tiharun/web-zero-to-hundred` / 브랜치 **`claude/gifted-goldberg-u1f9c6`**. 이 브랜치에서만 작업하고 push합니다. PR은 아직 만들지 않았고, 사용자가 요청할 때만 만듭니다.
- 기준선(M13 완료 시점에 직접 실행한 결과, `textbook/`에서)
  - `npm test`: 345/345 통과
  - `npm run check -- --allow-missing`: "검사 통과: Day 155개, 페이지 4개"
  - `npm run test:e2e`: 267/267 통과(M13에서 `tests/e2e/figures3d.test.mjs` 3D 그림 15개 추가. 3D는 헤드리스 Chromium의 `--enable-unsafe-swiftshader`로 그린다. M12에서 `tests/e2e/wide.test.mjs` 넓은 화면 정렬, `tests/e2e/figures.test.mjs` 그림 11개 추가)(이 PC 약 2분. 보상·용어 서랍·화면 전환은 `tests/e2e/reward.test.mjs`가 픽스처 복사본 두 벌(분을 바꿔 레벨업·월드 클리어가 나게)로 본다. 느린 첫 검색 Skeleton은 `String.prototype.normalize`를 느리게 바꿔 결정적으로 잰다. 테스트 정적 서버는 브라우저가 막는 포트(Fetch bad port, 예: 4045)를 건너뛴다)
  - `npm run test:visual`: 222/222 통과(기준 이미지 220장: M13에서 3D 그림 4장면 16장 추가(사용자 승인, 장면 옵션 `ready`·`webgl: false`). M12에서 넓은 화면 5장면 × 1440·1920 × 2테마 20장, 그림 5장면 28장(경로 Day 4는 375·1280) 추가, 가운데 정렬과 Day 1·4 그림 삽입으로 바뀐 72장 갱신(모두 사용자 승인). M11까지 156장: M11에서 레벨업 Modal·용어 서랍 × 3폭 × 2테마, 월드 클리어 Modal·업적 토스트 375·1280 × 2테마 20장 추가(사용자 승인). M10에서 정답·증상·완료 카드·퀘스트 로그(375·768)·체크리스트·완료 조건 장면 추가와 퀘스트 로그 열·게임 틀에 따른 갱신(사용자 승인). 스크롤한 장면은 scroll 이벤트를 직접 한 번 보내 퀘스트 로그를 다시 재고 찍는다. M9에서 Day 머리·본문·코드 블록·표 장면 추가와 인라인 코드 공통 규칙에 따른 갱신(사용자 승인). M8에서 토스트 375·1280 × 2테마 4장 추가. M7에서 월드·시작하기·용어 사전·문제 해결(증상 하나 연 상태) × 3폭 × 2테마 24장 추가. 4장면 × 3폭 × 2테마 + 확인 Modal × 3폭 × 2테마 + 잠금 화면 375·1280 × 2테마 + 서랍 375·768 × 2테마 + 홈 처음·월드 클리어·모두 완료 375·1280 × 2테마 + 검색 Modal·검색 페이지 × 3폭 × 2테마, 비교 함수 2개. 홈 장면은 전체 페이지로 찍는다)
  - `npm run check:site -- <주소>`: 320·375·768·1280·1920px 각각 "방문 168개, 문제 0개"(M12에서 1920 추가. M5~M12는 `npm run build:site`로 만든 `_site`를 로컬 정적 서버로 띄워 확인, 이 PC 약 20초. 서버를 같은 Node 프로세스에서 띄울 때 `spawnSync`로 점검을 부르면 서버가 멈춰 끝나지 않으므로 비동기로 부른다)
- 이 문서는 새 세션이 **다른 파일보다 먼저** 읽는 문서입니다. 이전 판은 `docs/checkpoint/CHECKPOINT-2026-11-06.md`(Subagent 방식 시절 재개 절차 포함)와 `CHECKPOINT-2026-11-05.md`에 보관했습니다. 내용이 다르면 이 문서가 우선합니다.

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
   - **T12 P1 통합**, **T15 P2 Day 1–10**
   - **M0 골격**(통합 로드맵): 새 토큰·글꼴·아이콘·공용 부품, 헤더·테마 메뉴·푸터, 404, 전 페이지 점검, 시각 테스트, Pages 자동 배포
   - **M1 모션·토스트**: `motion.js`(Reveal·Stagger·Tilt·Magnetic·Shake·세션 1회), `views/toast.js`, 잠긴 프로젝트 카드 Shake, Ctrl+K 검색 이동, 라디오 모양, CI 이미지 고정, 4폭 전 페이지 점검, 반응형(The Fluid Rule)·미루지 않기 규칙
   - **M2 사이드바·서랍**: `views/sidebar.js`(월드 Accordion, Day 행 상태 5종, 오늘 Day 분홍 네모, 잠긴 행 Shake + 토스트, 모두 펼치기, 월드 전환 메뉴), `views/overlay.js`(`<dialog>` 열고 닫기·메뉴 버튼 공용), 1024px 아래 `<dialog>` 서랍(Stagger, 스크롤 잠금, closedby 대체 경로), 빌드의 Day `ready` 플래그
   - **M3 홈 1행**: `level.js`(XP·레벨 계산), `questState`(퀘스트 상태 5종, 저장하지 않고 계산), `views/quest.js`(퀘스트 카드, Tilt 2°), `views/hud.js`(LV 배지·XP 막대·통계 3행·격려), `xpFill`(세션에 한 번), `worldEmblem`. 진도율 카드와 소개 문구를 뺐다
   - **M4 월드맵·다른 월드·막혔을 때**: `trail.js`(뱀 배치 3종 좌표·경로·방향 화살표), `views/worldmap.js`(칸 상태 5종, 말, 배포 깃발, 범례, 툴팁), `views/worlds.js`(캐러셀·4칸 격자, 졸업 카드, 잠긴 월드 Shake + 토스트, Tilt 4°·Reveal), `views/helprow.js`(페이지 `meta`의 `{n}`을 빌드가 센 실제 개수로 채움), 홈 모션(`drawPath`·`pawnHop`·`confetti`·`linkHover`, 세션에 한 번). 학습 경로와 부록 목록을 뺐다
   - **M5 검색 Modal**: `views/searchmodal.js`(Ctrl+K·검색 버튼, combobox + listbox, ↑↓ Enter Esc, 서랍에서 열기, 뒤로 가기에 닫힘, 닫히는 중 다시 열기), `views/results.js`(검색 Modal·검색 페이지가 같이 쓰는 행: 위치 | 제목 + 이유 | 태그, 잠긴 결과는 여는 조건만, 바로 가기), `searchAsync`(나눠 계산·멈춤), `views/skeleton.js`(200ms 뒤 보임·최소 300ms). 404 빌드의 검색은 사이트의 검색 화면으로 간다
   - **M7 월드·부록 페이지**: `views/project.js` 월드 페이지(머리 문장 칸, 클리어 보상 카드: 결과물 문장·기술 칩 전부·작업 폴더·보상 XP·진도, Day 칸 진도 막대 `meter(done, total, label)`, Day 목록 보드게임 칸 `.day-tile`), `views/page.js` 부록 머리(문장 칸 그림·제목·설명)와 증상 Accordion(모두 펼치기, `motion.js accordionOpened`), `lib/glossary.mjs` 용어 사전 ㄱㄴㄷ 색인(`glossaryIndexKey`)과 묶음, 문제 해결 목차(월드 → Day, 증상 수)·Day 묶음·`filterPublished`(공개 범위 밖 Day의 증상 제외). 목차 링크는 턱 있는 열쇠
   - **M8 Day 페이지 시안과 미정 값**: 시안(`design-system/…/prototype/day/`, git 밖)을 사용자가 승인해 DESIGN.md에 확정했다. 본문 줄간격 1.75(Hierarchy "Body long"), 알림 상자 6종 색(`--color-{tip,warn,info,path,success,answer}-{bg,line,ink}`, 성공은 청록), 밤 코드(`--color-code-*`·`--color-tok-*`, 두 테마 같은 값이라 `:root`에만), 위험 색(`--color-danger{,-ink,-deep}`), Components "Day 부품"(알림 상자, 코드 블록, 읽기 위치 바, 퀘스트 로그, 토스트, 레벨업 Modal, 설정 결과 문장, 그림 틀), Buttons 보조·위험 버튼. 교재에 입힌 것: 알림 상자·정답 상자·코드 블록, 확정 토스트, 종류별 설정 결과 문장, 보조 버튼 `.btn`(각진 2px 테두리와 턱), 위험 버튼. `legacy.css`는 옛 이름을 새 토큰으로 잇기만 한다(`--danger`·`--on-danger`는 지웠다). 읽기 위치 바·퀘스트 로그·레벨업 Modal·그림 틀은 M9~M12에서 화면에 넣는다(로드맵 11장 넘김 메모)
   - **M9 Day 읽기 화면**: Day 머리(`day.js dayHead`: Display Day 번호·제목·칩(예상 시간·작업 폴더·월드 이름·상태)), 글 열 `--lesson-max`(720px)와 본문 리듬(`.lesson-body`, 표·인라인 코드), 밤 코드 블록 머리·복사 버튼(DESIGN.md 토큰, "복사됨"), `views/readbar.js` 읽기 위치 바(스크롤 타임라인 `scroll(root block)`, 미지원이면 rAF + ResizeObserver로 `--read`, 동작 줄이기에서도 따라감, 인쇄에서 숨김, Firefox용 1ms 자리값), `skeletonGate.poll()`(느린 검색이 쉬는 틈에 Skeleton을 보임). 시각 장면 `day-code`·`day-table`. 테스트 정리: 자석 테스트는 프레임(rAF 두 번)을 기다린 뒤 읽고, 정적 서버·`freePort`는 Fetch bad port를 건너뛴다
   - **M6 설정·상태 화면**: `views/confirm.js`(확인 Modal: `role="alertdialog"`, 처음 포커스 취소, ESC·바깥 클릭·뒤로 가기는 취소, `ctx.confirm(opts, opener)`), 설정 카드 4개, 진도 불러오기 확인 Modal과 실패 Shake + 이유 문장, `backupFilename`, 백업 왕복 e2e(새 브라우저 컨텍스트), 오류 화면(`errorScreen`: 홈 버튼 + 설정 링크, 셸 유지), 잠금 화면 도트 자물쇠, 준비 중 Day 칸(복습 링크). 새 e2e 파일 `tests/e2e/settings.test.mjs`
   - **M10 Day 조작 부품**: `views/questlog.js` 퀘스트 로그(80rem 이상 오른쪽 sticky 열, 좁으면 본문 위 접힘 카드, 지금 단계 `aria-current="step"`, 맨 아래면 마지막 단계, 누르면 그 제목으로 이동·포커스), 🧯 섹션 증상 Accordion(`lib/markdown.mjs` `symptoms`, `views/accordion.js` 모두 펼치기를 문제 해결 부록과 같이 씀), "Day 완료"는 `aria-disabled`(포커스 받음, 누르면 Shake + 이유 문장 강조 + 알림), 부록 목차 카드 80rem 오른쪽 열. 사용자 요청으로 **The Game Frame Rule**(DESIGN.md·로드맵 결정 10)을 정하고 Day 틀에 적용: 보상 칩, 퀘스트 로그 번호 칸·커서, 도트 체크 칸, 체크 칸 막대, "퀘스트 클리어!"·보상 줄, 정답 선물 도트, 이전·다음 턱. 옛 `.day-outline` 삭제
   - **M13 3D 그림**: three 0.187.0을 따로 묶어 `<script type="text/plain" id="three-src">`로 넣고(MIT LICENSE 전문은 블록 앞 주석), 그림이 화면 근처에 오면 실행한다(`src/app/three.js`). 층 그림 틀 `views/figure3d.js`(끌기·시점 버튼·Skeleton·WebGL 2 없거나 컨텍스트를 잃으면 정적 SVG와 대체 설명, 인쇄도 정적), 순수 계산 `view3d.js`. 그림: Day 10 `box-model-3d`, Day 6 `dom-tree-site`, Day 20 `dom-tree-cards`. 한 문서에 3D 그림은 하나(빌드 테스트). `index.html` 증가 578,419B(한도 700,000B). 인쇄에서 셸을 한 칸으로 바꿔 넓은 종이에서 본문이 사이드바 칸에 갇히던 문제도 고쳤다.
   - **M12 그림 틀과 넓은 화면**: 넓은 화면 가운데 정렬(`.main > *`에 `max-width: var(--content-max)`·`margin-inline: auto`, 두 열 묶음 상한, 푸터 안쪽 맞춤, DESIGN.md Layout "화면 묶음"), `:::figure <id>` 문법(`캡션:`·`대체 설명:` 두 줄, 빌드가 `src/figures/index.js` 등록표로 id 검사, `lib/figures.mjs`), `views/figure.js`(`mountFigures` 실패 시 대체 설명, 단계 그림 `stepFigure`, 값 고르기 `choiceGroup`, 화살표 `arrow`), `styles/figures.css`, 모션 `rise`·`strokeIn`, P1 그림 5개: Day 1 요청·응답(4단계), Day 4·5 상대 경로(폴더 트리·경로 계산), Day 7 Git 흐름(4단계), Day 11 Flexbox(실제 flex 부모, 값 3묶음). 동작 줄이기면 단계 그림은 마지막 단계에서 시작한다. CONTENT-GUIDE 1.7 그림 절
   - **M11 보상과 연결**: `reward.js`(완료 전후 진도로 레벨업·월드 클리어·새로 열림 사건을 계산), `views/rewardmodal.js`(보상 Modal 하나에 레벨업·월드 클리어 두 종류, 같이 나면 월드 클리어 하나에 "LV n 달성", 세션에 한 번 `onceInSession`, 닫힌 뒤 업적 토스트), 업적 토스트(트로피 도트, 완료 알림 겸함), `views/termdrawer.js`(본문 용어 링크 → 오른쪽 용어 서랍, 서랍 안 용어 링크는 내용만 바꿈, 용어 사전 페이지·수정 키 클릭은 그대로 이동), 화면 전환(`motion.js sharedTransition`: 퀘스트 카드 번호 ↔ Day 머리, 월드 카드 엠블럼 ↔ 월드 머리. `:root { view-transition-name: none }`으로 나머지는 바로 바뀌고 전환 중 클릭이 문서로 감, 새 화면에 짝이 없으면 `skipTransition`). 인쇄에서 모든 `<dialog>` 숨김
4. **남은 것**: 통합 로드맵 11장 M14부터(기능 M11–M14, 콘텐츠 E1·C1–C35, 품질 Q1–Q5).
5. **처음 할 일**: 1장 → 5장(환경) → 7장(재개 절차) 순서로 하면 됩니다.

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
   cd textbook && npm test && npm run check -- --allow-missing && npm run test:e2e && npm run test:visual
   ```
5. 작업 폴더(진행 기록·지시문·보고서)를 복구합니다(6장).
   ```bash
   bash docs/checkpoint/restore-workspace.sh
   ```
6. superpowers 플러그인의 `writing-plans`·`executing-plans` 스킬로 진행합니다(Native, 7장).
7. 7장의 재개 절차를 따릅니다.

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
- **실행 방식은 Native**입니다(사용자 선택, 2026-11-12. 이전의 Subagent 방식을 대체).
  - `executing-plans`로 한 세션이 한 마일스톤을 끝까지 합니다. 작업 에이전트·자식 세션을 나누지 않습니다.
  - 마일스톤 끝에 같은 세션이 브랜치 전체를 다시 리뷰합니다(자체 리뷰. 서브에이전트를 쓰지 않는다는 사용자 결정 때문).
  - 본문은 묶음마다 작성(W) 세션과 리뷰·수정(R) 세션을 나눕니다.
- **응답 선호**
  - 한국어로 답합니다.
  - 정확성과 실무 표준을 지킵니다.
  - 추측하지 않고, 모르는 것은 모른다고 밝힙니다.
  - 큰 단계마다 결과물을 전달합니다(P1 완성 시 미리보기 `index.html`).

---

## 4. 진행 현황표 (옛 계획서 Task 기준. 이후 순서는 통합 로드맵 11장)

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
| T12 | P1 통합 | ✅ | `da77b87..1521443` (workspace/progress.md 350행) |
| T15 | P2 Day 1–10 | ✅ | `3173b9a..b0e31da` (workspace/progress.md 336행) |
| M0 | 통합 로드맵 골격 | ✅ | `f898950..105a0c9` (보안·검색 수정 포함) |
| M1 | 모션(`motion.js`)·토스트 틀, M0 보류 정리, 반응형 규칙 | ✅ | `c377eb3..` (이 문서를 고친 커밋까지) |
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

## 7. 재개 절차

통합 로드맵 설계서 `docs/superpowers/specs/2026-11-12-unified-roadmap-design.md` **10장(작업 방식)과 11장(마일스톤)**을 따릅니다.

1. `CLAUDE.md` → 이 문서 → 설계서 11장에서 다음 마일스톤(지금은 **M14**)을 고릅니다. 행 끝의 `(Mn에서 넘김: …)`도 그 마일스톤의 범위입니다.
2. `writing-plans`로 그 마일스톤의 계획서를 `docs/superpowers/plans/`에 쓰고 사용자 승인을 받습니다.
3. `executing-plans`로 같은 세션이 실행합니다. 마일스톤 끝에 완료 기준을 증거(테스트 출력, 스크린샷, 공개 주소)와 함께 보고합니다.
4. `docs/checkpoint/workspace/progress.md`에 `Mn: complete` 줄을 남기고 이 문서 맨 위 상태를 고칩니다.
5. 리뷰(R) 세션이 끝난 Day 묶음은 `textbook/content/published.json`에 범위를 더해 배포본에 공개합니다.

옛 Subagent 방식의 재개 절차(T15·T12·T16… 지시문 틀)는 `docs/checkpoint/CHECKPOINT-2026-11-06.md` 7장에 보관했습니다.

---

## 8. 작업 방식 규칙

설계서 10장과 `CLAUDE.md` 규칙을 따릅니다. 옛 규칙(에이전트 계약, 파일 소유권 등)은 `docs/checkpoint/CHECKPOINT-2026-11-06.md` 8장에 보관했습니다. 그중 지금도 쓰는 것은 `CLAUDE.md` 규칙 5에 옮겨 두었습니다.

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
