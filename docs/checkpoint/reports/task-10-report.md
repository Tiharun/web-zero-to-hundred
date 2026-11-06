# Task 10 보고: p1-days-11-20

상태: DONE (NO GIT, 커밋 없음)

## 만든 파일
- textbook/content/p1/day-11.md ~ day-20.md (10개)
- textbook/content/troubleshooting/p1-days-11-20.md (66항목: Day별 🧯 항목 + 보충 7개)
- docs/verification/p1-days-11-20.md, docs/verification/p1-days-11-20-day20.jpg

## 검증 요약
- 끝 상태를 스크래치에 재구성, 정적 서버 + file:// , 1280/360px: 116건 통과. 단계별 중간 상태 16건, 블록 대조(전체 28·일부 49 일치), lab.js 조각 대조, 렌더 확인 통과.
- `npm run check -- --only p1-d11,...,p1-d20`: 오류 0.
- 컨트롤러 메모 반영: 🧯 참조 제목 일치 확인(2건 수정), 연습장 창·커밋 상태 안내(Day 12, 17), 본문 문구는 레퍼런스·개요와 동일.

## 개요 문제 (8건, 상세는 검증 기록)
Day 20 오류 원문 불일치, Day 11/13 주석 중복, Day 10 끝 상태 재구성, Day 14 전체 파일, 80자 초과 데이터 줄, 과제 커밋 처리, Day 18 예제 추가.

## 미확인
Windows·VS Code·GitHub·Chrome UI 절차(공식 문서 대조 또는 실기 미확인), 콘솔 붙여 넣기 경고 문구.

## Fix round 1
(줄 번호는 수정 후 textbook/content/p1/ 기준, 해당 항목을 찾은 줄)
1. contents.html 안내 문장을 Day 11~20 전체에서 `지난 방송 영상을 모아 두는 페이지예요.`로 통일(스크래치 생성기 수정 후 재생성). 앵커 문장은 Day 12 과제 2와 Day 20 3단계에서 같은 문장으로 고침. Day 10 끝 상태와 5페이지·style.css 재대조 결과 일치(contact.html 폼 빈 줄 제거). about.html은 이미 `2026년에 방송을 시작한`.
2. day-12.md 🧯 "카드가 계속 세로로만 쌓여요"와 troubleshooting 항목: "2단계 블록" → "3단계 블록".
3. day-19.md 🧯 참조를 "영상 페이지 콘솔에 아무것도 안 나와요"로, day-20.md 3곳(카드 확인·createCard 설명)이 항목 제목을 직접 이름.
4. day-15.md 과제 2 해설: 콘솔은 오류 없이 재선언됨(CDP replMode 실측), 파일은 오류 + 문제 해결 모음의 "Identifier 'days'…" 항목 안내. 
5. day-11.md 과제 2 힌트와 🧯: aria-current 검색 합계 6줄(style.css 1 + 페이지 5). 3단계의 "5개"는 그 시점에 CSS 규칙이 아직 없어 맞아서 그대로.
6. day-12.md 과제 2: 커밋·푸시를 필수로, 체크리스트에 두 번째 커밋 추가.
7. day-13.md 🧯: "휴대폰에서 PC 화면이 깨알처럼…(viewport 줄이 없어요)" 추가(6개 유지를 위해 "메뉴 세로 목록이 길어요"는 문제 해결 모음으로 이동).
8. day-16.md 1단계: `Shift + \`와 한국어 키보드의 `₩` 표기를 함께 설명.
9. day-19.md 6단계: "최상위 `let`·`const`"로 수정.
10. day-17.md 3단계, day-19.md 1단계의 첫 블록 캡션에서 "(일부)" 제거(새 파일).

명령 출력: `npm run check -- --only p1-d11,…,p1-d20` → "검사 통과: Day 155개, 페이지 4개, 결과 크기 2.10 MB (--only: 10개 Day만 렌더)". 끝 상태 검사 116건, 단계 검사 16건 통과.
