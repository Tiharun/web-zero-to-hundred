# Task 12 Re-review 1 (fix round 1)

범위: `fb891d6..4500fc9` diff 한 번 읽기 + 의심 지점만 현재 파일 확인. 테스트는 재실행하지 않음(controller 결과 사용). 근거 구분: 측정 = 현재 파일 grep/읽기.

## Finding Verdicts

| 출처 | 항목 | 판정 | 근거 |
|---|---|---|---|
| R1 Critical | d07 첫 푸시 실패 복구 | ADDRESSED | 7단계에 `moonbear-dev` 교체, 로그인 창 숨김, 창 닫음 안내. 🧯 "푸시 주소·로그인 오류"에 4개 오류와 `remote set-url` 절차. 🧯 6개 유지(측정). 이 제목을 가리키는 참조도 갱신됨 |
| R1 I | d04:128 성공 상자 "아직 index.html … 없어서" | **NOT ADDRESSED** | `day-04.md:128`에 원문이 그대로 있음(측정). 보고서는 "d04 homepage success box"를 고쳤다고 하나 diff에서 이 줄은 변경되지 않음 |
| R1 I | 미리 보기 "새로 고침"/`F5` (d04·d05·d09) | ADDRESSED | Day 2 tip "미리 보기 사용법", 각 지점 문구 교체, help.md:54 수정. 새로 고침 버튼 존재는 쓰지 않음(증거 로그 "미확인") |
| R1 I | 하위 폴더 새 파일 아이콘 (d05·d06·d09·d12) | ADDRESSED | 모두 "오른쪽 클릭 → 새 파일"(diff 확인) |
| R1 I | d06:186 메뉴가 세로 | ADDRESSED | "점 목록으로 세로 5줄, CSS 전이라 정상" |
| R1 I | d07 한글 커밋 깨짐 | ADDRESSED | 8단계에 "표시 문제, 기록은 정상" 추가. 이 PC에서 재현 안 됨을 증거 로그에 기록 |
| R1 I | d07 시간 여유 0 | ADDRESSED | "여기까지 하고 쉬어도 돼요" tip + 이어 시작 방법 |
| R1 I | d08:83 미리 보기 닫힘 | ADDRESSED | Day 2 링크 + 메뉴 이동 안내. Day 9·10 시작 한 줄은 없으나 Day 2 tip이 다음 날 재오픈을 다룸 |
| R1 I | d08/d09/d10 `.git` 누락·덮어쓰기 후 커밋 | ADDRESSED | 끝 상태 문장 교체(`.git` 보존, 커밋·동기화). Day 11~20·21~ 도 동일 문구 |
| R1 I | d09 `Ctrl+F5` 습관 / d10:634 | ADDRESSED | "브라우저 탭에서만", d10:634 브라우저로 고정 |
| R1 I | d09:202 검색 패널 기준 | ADDRESSED | `site-header` 입력 기준으로 교체 |
| R1 I | d10:92/173/293 F5 | ADDRESSED | 두 성공 상자와 개념 문단에 추가 |
| R1 I | d10:298 `Ctrl+A` 내 글 삭제 | ADDRESSED | `:::warn` 추가, 복구 안내 포함 |
| R1 I | d12:99 새 파일 / d12:382 360px | ADDRESSED | 오른쪽 클릭, 과제 360px는 Day 13으로 이동(정답은 결과 유지) |
| R1 I | d13:119 F5 공통 문장 | ADDRESSED | 공통 문장 추가 |
| R1 I | d14 Actions 빨간 ✕ | ADDRESSED | Re-run all jobs, help §7 링크 |
| R1 I | d14 메뉴만 404 | ADDRESSED | 🧯 404에 항목 추가(6개 유지) |
| R1 I | d14:842 대소문자 함정 | ADDRESSED | 임시 이름 경유 → help §7, `src` 쪽을 고치는 쪽이 쉽다고 병기 |
| R1 I | d14 시간 / 끝 상태 푸시 | ADDRESSED | 6단계 뒤 tip, 끝 상태 "커밋·동기화" |
| R1 I | d15:828~837 콘솔 🧯 | ADDRESSED | `Failed to load resource` 중심으로 재작성, `defer` 항목 삭제(항목 수 6 유지) |
| R1 I | d15·d16·d19·d21 오류 링크→Sources | ADDRESSED | "줄 번호를 읽고 VS Code에서 그 줄을 열어요", Sources 설명 |
| R1 I | d15:329 / d20:458 배포 실패 복구 | ADDRESSED | d15·d20에 warn 상자 → help §7 |
| R1 I | d16:260 F5 | ADDRESSED | "Live Preview는 저절로, 더블클릭 탭은 F5" |
| R1 I | d22 5단계 새 창 / `setAttribute` null | ADDRESSED | 5단계 새 창 안내, 5페이지 확인, 🧯 추가(6개 유지) |
| R1 I | d25:265 첫 fetch 배포 | ADDRESSED | 성공 상자에 Network `videos.json` 확인 안내(원문 일부 줄임, 신뢰) |
| R1 I | d25 🧯 404 대소문자 | ADDRESSED | 임시 이름 경유 + help §7 |
| R1 I | d27:791 / d29:705 변경 0개 ≠ 푸시 | ADDRESSED | "동기화 버튼 숫자 없음 + 커밋 목록" 기준으로 교체 |
| R1 I | d28:241/🧯 클릭 후 Tab | ADDRESSED | "F5 후 클릭 없이 Tab, 이미 클릭했다면 F5" |
| R1 I | d30:77·104 복구 경로가 기능 삭제 | ADDRESSED | 옛 Day 코드 덮어쓰기 금지 + 파일별 최신 전체본 표 + 내 글 경고 |
| R1 I | d30 마지막 배포 복구 | ADDRESSED | help §7 연결, 🧯 병합 항목(6개 유지), "임시 이름" 문구 |
| Cross-Day 1 | `style.css` 복구 체인 | ADDRESSED | Day 20·25·30 전체본. Day 30본은 reference와 바이트 동일(구현자 측정, 미재검증) |
| Cross-Day (Important 나머지) | Day 완료 버튼 등 | ADDRESSED | Day 1 체크리스트, Day 30 7단계 catch-up |
| Top 5 #1~#5 | | ADDRESSED | #1 Critical, #2 표·전체본, #3 help §7, #4 오류·Tab, #5 경고 문구 |
| R2 I-1 | `innerHTML`/`<script>` 설명 | ADDRESSED | `day-20` 개념·정답 모두 `<script>` 비실행, `onerror` 위험으로 수정 |
| R2 I-2 | 스모크 P1 누락 | ADDRESSED | `p1WithFile === 30`, P1 `coming-soon`은 문제. 음성 시험 보고(구현자 실행) |

집계: 대상 Important/Critical 항목 ADDRESSED, NOT ADDRESSED 1건(d04:128). 위 표는 그룹 단위이며, 한 줄에 묶은 항목은 diff 안에서 개별 지점을 확인했다.

## New Breakage in the Fix Diff

- 🧯 개수: 변경한 Day 7, 14, 15, 20, 22, 25~30 모두 6개(측정, awk `###` 수). 범위 3~6 안.
- "아래 🧯" 참조: Day 7의 이름 바뀐 항목을 가리키는 참조는 새 제목으로 갱신됨. 해소 안 되는 참조 못 찾음(전수 검사는 아님).
- help.md 링크: 모두 `#/page/help`, 대상 `## 7.` 존재(측정). 앵커가 없어 학습자가 7번까지 스크롤해야 함 → Minor.
- 끝 상태 ↔ 다음 시작: Day 7·14 쉬는 지점은 tip으로만 안내하고 끝 상태는 불변. Day 21 시간 110→115(개념25+65+20+5=115)로 합산 일치.
- 새 사실 주장 근거: help §7 "Re-run all jobs", 대소문자 Git 동작은 링크 근거가 있고, 증거 로그에 "미확인"으로 표시됨. 한글 커밋 깨짐은 재현 안 됨을 명시. `F10/F8` 노트북 키는 추측이라 로그에 표시. 허용 가능.
- 개념 선행: "소스 제어", "변경 내용 동기화"는 Day 7(9단계)에서 도입 → Day 8 이후 사용 OK. Day 5 `profile.jpg` 정리 문구는 탐색기 삭제로 표현해 선행 개념 없음.
- Minor 신규: (a) Day 28 `day-28.md:241` "index.html을 브라우저 탭에서 F5"인데 직전 흐름이 Live Preview라 브라우저 탭이 열려 있다는 보장이 없음. 제안: "Edge에서 Live Preview 주소를 열어 둔 탭에서". (b) Day 29의 "파일 22개" 안내는 근거를 못 확인함(구현자 보고만).
- Critical/Important 신규 파손: 없음.

## Out-of-Scope Observations

- d12 반응형 문구를 1000px→800px로 바꾼 근거가 증거 로그에 없음(그리드 최소 폭 기준 계산으로는 타당해 보이나 실측 아님).
- 보고서의 Deferred 목록(11개) 모두 1차 리뷰에서 Minor 또는 미확인 UI(`7 files changed` Minor, d10 `display` Minor, d12 과제 순서 Minor, d15 IME Minor, d16/d20 leftover Minor, d04:259/593 Minor). Important가 이월된 것 없음(R62 준수). 단 d04:128은 "수정했다"고 보고되었으나 실제로는 미수정.

## Verdict

**Findings remain open** (1건).

1. `textbook/content/p1/day-04.md:128` — 성공 상자가 아직 `index.html`이 없다고 말함(`index.html`은 Day 3에 존재). 제안 수정: "홈 링크는 어제 만든 메뉴 없는 `index.html`로 열려요. 나머지 3개(`contents.html` 등)는 아직 없어서 안 열려요. 2단계에서 만들어요." (Day 4 실제 파일 상태에 맞게 개수 확인.) 이후 `npm run check -- --only p1-d04`만 재실행.

그 외 모든 Critical/Important 항목은 ADDRESSED, 신규 Critical/Important 파손 없음.
