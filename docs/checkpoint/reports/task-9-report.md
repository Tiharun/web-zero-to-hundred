# Task 9 보고서: p1-days-02-10 (P1 Day 2~10)

상태: DONE_WITH_CONCERNS (콘텐츠와 자동 검증은 끝났고, Windows 전용 절차와 외부 서비스 화면은 실기 미확인이에요. 아래 "미검증" 참고)
커밋: 없음 (NO GIT)

## 만든 것

- `textbook/content/p1/day-02.md` ~ `day-10.md` (9개). 글자 수: 16.3k / 13.2k / 20.2k / 18.1k / 23.0k / 24.3k / 23.1k / 22.4k / 35.0k.
  - Day 2 개발 도구 설치(100분), Day 3 HTML 기본 구조(90), Day 4 텍스트·목록·링크(100), Day 5 이미지와 경로 완전정복(90), Day 6 시맨틱 구조(90), Day 7 Git·GitHub 시작(120), Day 8 표·폼·미디어(100), Day 9 CSS 시작(90), Day 10 박스 모델(90).
  - CONTENT-GUIDE의 섹션 순서, 막힘 방지 규칙 (a)~(g), 단계마다 어디서/무엇을/성공 상자, 용어 `**[[용어]]**(원어)` 정의(개요 3절 배정 그대로, 미래 Day 용어 링크 없음), 해요체, 마지막 줄 다음 Day 예고를 모두 적용했어요.
  - 단계 시간 합 = 따라하기, 개념+따라하기+과제+정리 = `_meta.json`의 `minutes`를 스크립트로 확인했어요.
- `textbook/content/troubleshooting/p1-days-02-10.md`: 문제 해결 항목 77개(Day별 6~13개). 각 Day의 "자주 막히는 곳" 6개는 이 파일에서 같은 글을 가져왔어요.
- `docs/verification/p1-days-02-10.md`: 검증 기록.
- 개요 밖 용어 추가는 없어요(`glossary/<batch>-extra.md` 없음).

## 검증

- `cd textbook && npm run check -- --only p1-d02,...,p1-d10` → 검사 통과(오류 0, `E_BOLD_UNRENDERED` 포함). 중간에 잡힌 굵게 오류 18건(`**[[용어]]**은` 같은 조사 붙음, `***`가 든 제목)은 모두 고쳤어요.
- 끝 상태 재구성: 9개 Day의 "오늘 끝 상태 전체 코드" 블록만 Day 1부터 쌓아 만든 폴더가 기준 스냅샷 92개 파일과 모두 같아요(바뀌지 않은 파일이라는 본문 설명도 맞음).
- `(일부)` 블록 적용 검증: Day 4 메뉴, Day 5 img, Day 8 iframe 섹션, Day 9 link·class 다섯 파일, Day 10 style.css 2~4단계 조각이 설명한 위치대로 적용돼 다음 끝 상태와 같아졌어요.
- 모든 HTML 📄 블록(일부 제외 57개)을 Day 파일 순서대로 `file://`로 열었어요: 실패 0.
- Playwright 111건 통과: 정적 서버(Live Preview 방식)와 `file://`, 1280/360px에서 콘솔 오류 0, 가로 스크롤 없음, Day별 끝 상태 항목(제목·h1·표 3열 7행·폼 동작·computed 스타일·크기·`.container` 960 가운데·곰 160 원·일정표 테두리 등).
- Day 7 `git` 명령 블록을 원문 그대로 스크래치 저장소에서 실행해 예상 출력과 비교(6건 일치, 푸시는 로컬 bare 저장소). 오류 원문(Author identity unknown, not a git repository, src refspec, remote already exists, rejected, `git add.`, LF→CRLF 경고)은 샌드박스에서 재현해 옮겼어요(Git 2.43.0).
- 교재 렌더: `npm run build -- --allow-missing`한 단일 HTML에서 Day 2~10을 1280/360px로 열어 `:::`·`**`·`@@`가 글자로 남은 곳 0, 외부 요청 0, 콘솔 오류 0. (이 확인으로 중간에 `d04pre`/`d09pre` 생성기 자리표시가 글자로 남은 문제를 찾아 고쳤어요.)

## 개요 문제 (2건)

1. Day 5 `back.html`: 개요의 `../../my-creator-site/images/profile.svg`는 VS Code에서 `C:\dev\hello`를 연 상태의 Live Preview 서버 루트 밖이라 미리 보기 창에서는 깨져요(0.2절 "Day 3~24는 두 방법 모두 동작"과 어긋남, 정적 서버로 재현 확인). 개요를 바꾸지 않고, 과제 2에서 "파일 탐색기에서 더블클릭(`file://`)으로 확인"하게 하고 정답 해설에 이유(서버는 열어 둔 폴더 안 파일만 보내 줌)를 넣었어요.
2. Day 3 과제 1(고장 난 HTML 고치기): 개요의 "오늘 만들/바꿀 파일"에 이 코드를 둘 파일이 없어서, 파일을 만들지 않고 코드를 읽고 문제 3개를 찾는 과제로 썼어요. 정답의 "화면에서 어떻게 깨지나"는 렌더로 확인한 대로 적었어요(`<titel>` → 탭 제목 비고 본문에 글자 한 번 더 나타남, 따옴표 누락 → 아래 문단 통째로 사라짐, `</h1>` 누락 → 아래 문단이 큰 제목 안으로).

개요와 달라진 점(의도적, 개요를 어기지 않음): Day 7에 `git config --global init.defaultBranch main` 추가(external-facts 부록 A의 대안), Day 9 header/footer class는 `Ctrl + Shift + H`(폴더 전체 바꾸기)로 한 번에, Day 10 HTML 다섯 파일은 파일 전체 붙여 넣기 + CSS는 구역 단위 3조각.

## 미검증 / 주의

- 실행 불가(공식 문서 대조 또는 "실기 미확인"으로 기록): VS Code·Git 설치 마법사 화면과 문구, VS Code 신뢰 창·확장 화면·소스 제어 패널·`Ctrl + Shift + H` 동작, Live Preview 아이콘/명령 이름/기본 포트 3000, GitHub 가입·저장소 생성·Settings 메뉴·첫 푸시 로그인 창, Edge `F12` 첫 확인 창, PowerShell 5.1의 `git : The term 'git' is not recognized …` 원문(영어 원문은 알려진 출력, 한국어 문구는 미확인), 개발자 도구 Computed·Styles 화면. 모두 본문에 "버전에 따라 조금 다를 수 있어요"를 붙였어요.
- YouTube `iframe` 재생은 오프라인이라 확인하지 못했어요(속성·위치만 확인). 본문은 "환경에 따라 달라요"로 안내했어요.
- 바깥 링크: MDN·VS Code·GitHub·Edge 문서는 공식 저장소의 원문 파일 존재로 확인. `support.google.com/youtube/answer/171780`, `git-scm.com`은 호스트 차단으로 미확인.
- HTML/CSS 코드 블록에 80자를 넘는 줄이 있어요(`<meta name="viewport" …>`, `<iframe …>`, 로고 `<img …>` 등 레퍼런스의 한 줄 요소). 복사해 붙여 넣을 코드를 레퍼런스와 같게 두려고 줄바꿈하지 않았어요.
- 휴대폰(360px) 전체 화면 스크린샷(JPEG)은 만들지 않았어요(스크립트로 가로 스크롤 0만 확인).

## 바꾼 파일 (컨트롤러가 커밋)

- `textbook/content/p1/day-02.md`
- `textbook/content/p1/day-03.md`
- `textbook/content/p1/day-04.md`
- `textbook/content/p1/day-05.md`
- `textbook/content/p1/day-06.md`
- `textbook/content/p1/day-07.md`
- `textbook/content/p1/day-08.md`
- `textbook/content/p1/day-09.md`
- `textbook/content/p1/day-10.md`
- `textbook/content/troubleshooting/p1-days-02-10.md`
- `docs/verification/p1-days-02-10.md`
- `.superpowers/sdd/2026-11-01-web-zero-to-hundred/task-9-report.md` (이 파일)

생성기와 검증 스크립트(`gen.mjs`, `build.mjs`, `verify-days.mjs` 등)는 스크래치 폴더(`/tmp/claude-0/-home-user-web-zero-to-hundred/a3ed5e68-2ed7-58a6-8548-3d657f4039ce/scratchpad/t9`)에만 있고 저장소에는 넣지 않았어요.

## 자기 검토

- 초보자 시뮬레이션: 단계마다 어디서/무엇을/성공 상자를 갖추고, 실패하기 쉬운 곳(`.txt` 확장자, 엉뚱한 폴더, `hello` 폴더 연 채로 `index.html` 만들기, 터미널 위치, 닫는 태그·따옴표 빠짐, 캐시)은 일찍 발견하도록 순서를 짰고 🧯 항목과 연결했어요.
- 약속 이어받기: Day 2는 Day 1의 `C:\dev\hello`를 VS Code로 열어요. Day 3~10의 시작 상태는 앞 Day 끝 상태와 같고, Day 10 끝 상태(색은 색상 코드 직접, `.header-inner`에 flex 없음, `.site-nav`·`.menu-list` class 없음)는 Day 11 개요의 시작 상태와 같아요.
- 이름은 레퍼런스와 같고(class 이름은 스크립트로 레퍼런스 HTML에 모두 있음을 확인), 중간 단계는 개요 2절 표대로예요(메뉴 `header`/`nav` 없음 Day 4~5, 색 코드 직접 Day 9~13 등).

## Fix round 1

Day line numbers below refer to the regenerated files. All items are fixed; the Day files are generated from sources in the scratchpad, so edits were made there and rebuilt.

| # | Finding | Change |
|---|---|---|
| 1 | Day 7 step 2 pointed to a 🧯 item missing from the Day | `day-07.md` 🧯 now has "설치 마법사의 편집기 목록에 VS Code가 없어요" (:577) and the step 2 pointer (:105) uses that exact title. To stay within 3~6 items, "not a git repository" and "로그인 창" moved to the 모음 only. |
| 2 | Day 2 SmartScreen/UAC not in the Day's 🧯 | `day-02.md:379` new item ("파란 Windows의 PC 보호 창…"); step 2 points to "두 번째 항목". "Live Preview 아이콘이 안 보여요" moved to the 모음 only (6 items kept). Audit script over all 9 Days: every quoted "아래 🧯 …" reference matches a heading in that Day's own 🧯 (0 mismatches). |
| 3 | Day 5 assignment 2 never returns to my-creator-site | `day-05.md:240` return step (파일 → 최근 항목 열기 → `C:\dev\my-creator-site`) plus checklist line. Day 8's assignment 2 checklist line got the same wording (:726). |
| 4 | Day 4 used 스크린 리더 before Day 5 | `day-04.md:28` short gloss, "Day 5에서 배워요". |
| 5 | Day 3 combined sample hides the `</h1>` symptom | `day-03.md:275` explains it and shows the effect with the quote fixed first (checked by rendering). |
| 6 | Day 10 style.css edits rely on selection | `day-10.md:120` and the step 3/4 equivalents add "Ctrl + A로 전체를 지우고 끝 상태 전체 코드의 style.css를 통째로 붙여 넣기". |
| 7 | Day 7 changed the reference sentence | `day-07.md:403` keeps the edit learner-owned and says later full codes use the original. Day 7~10 end-state `about.html` now use the original sentence (the edited line is only a one-line `(일부)` example in the answer). |
| 8 | Day 8 assignment 3 vs Day 9 "변경 0개" | `day-08.md:351` tells learners to revert or commit "Day 8: 대표 영상 바꾸기"; `day-09.md:19` start state notes it. |
| 9 | `rejected` recovery only deleted the repo; remote-exists only in the 모음 | `rejected` now offers rename-old-repo + new repo + `git remote set-url` (method 1) and delete (method 2); `error: remote origin already exists.` is now in Day 7's 🧯. `git remote set-url` run locally to confirm it changes the URL. |
| 10 | Missing Day-level 🧯 items | Day 3: tab-character indentation added to the indent item. Day 5: new "width·height 빠짐" item and "svg 더블클릭하면 다른 앱" item (:494 and :504); `src="C:\…"` folded into the broken-image item. |
| 11 | `font-weight: 700` unexplained | `day-10.md:255` explains it. |
| 12 | Day 5 text art 34 columns | `day-05.md:72` split into short lines. |

Commands run after the fixes:

- `cd textbook && npm run check -- --only p1-d02,...,p1-d10` → `검사 통과: Day 155개, 페이지 4개, 결과 크기 2.02 MB (--only: 9개 Day만 렌더)` (0 errors)
- Scratch end-state rebuild vs snapshots → `OK` (92 files, 0 differences); `(일부)` application → `ALL OK`; all 56 full-file HTML blocks opened → `총 56개 중 실패 0`; Playwright end-state checks → `총 111건 중 실패 0건`; structure and time lint → `LINT OK`.
- `docs/verification/p1-days-02-10.md` updated with a "Fix round 1" section.

Files changed: `textbook/content/p1/day-02.md` … `day-10.md` (all nine), `textbook/content/troubleshooting/p1-days-02-10.md`, `docs/verification/p1-days-02-10.md`, this report.
