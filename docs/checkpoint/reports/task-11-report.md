# Task 11 보고: p1-days-21-30

상태: DONE_WITH_CONCERNS (커밋 없음 — NO GIT)

## 만든 파일
- textbook/content/p1/day-21.md ~ day-30.md (10개)
- textbook/content/troubleshooting/p1-days-21-30.md (항목 약 30개, 원문은 모두 실측)
- docs/verification/p1-days-21-30.md
- (glossary extra 없음: 개요의 용어만 사용)

## 검증 요약
- Day 20 끝 상태를 개요에서 재구성하고 Day 본문의 편집 지시를 같은 코드 조각으로 차례로 적용해 Day별 끝 상태를 만듦. Day 28 끝 상태는 레퍼런스(README 제외 21개 파일)와 diff 차이 없음.
- Day 본문의 파일 전체 코드 블록 41개는 끝 상태 파일과 글자 단위로 같음.
- Playwright(정적 서버, 360/1280/1920px, page.clock 고정)로 Day마다 "끝 상태 확인" 항목 검사: 콘솔 오류 0, 총 246개 확인 통과. 오류 원문(🧯)은 모두 변형 코드를 실행해 얻음. Lighthouse 12.8.2 실측(Day 27 홈 SEO 91 → Day 28 100).
- `npm run check -- --only p1-d21,…,p1-d30` 오류 0.
- Windows/OBS/GitHub Actions/Lighthouse 탭 화면은 "공식 문서 대조/실기 미확인"으로 기록.

## 컨트롤러 메모 반영
1. 모든 "아래 🧯 …" 참조가 같은 Day 🧯의 실제 항목을 가리키도록 확인·수정.
2. 과제로 파일이 커밋 뒤에 바뀌는 Day(24, 25, 26, 28, 29)에 커밋 또는 되돌리기 안내를 추가. 과제가 다른 폴더를 여는 일은 없음.
3. 학습자에게 보이는 글은 레퍼런스/후속 Day 전체 코드와 같음. Day 20 시작 상태에서 가정한 글(영상 안내 문장, 일정 안내 문장, 문의 폼 Day 8 마크업)은 Day 23·26·24에서 개요대로 교체됨.

## 개요 문제 / 우려
1. Day 20 끝 상태(= Day 21 시작)가 글 내용·주석 단위로는 명시되지 않아 이 배치가 가정함(앞 배치와 다를 수 있음). 그래서 머리글·문의 폼·`<main>`·768px 블록을 통째로 바꾸는 방식으로 씀.
2. Day 27 과제 1 `start=7:5`: 지금이 07:05 이후면 곧바로 `곧 시작해요!`. 본문에 조건 명시.
3. Day 28 "Edge에도 Lighthouse 탭 — 실측": 환경상 실측 불가, Chrome 기준 + "있을 수 있어요"로 표기.
4. Day 21 8번 구역 "주석을 h1 다음으로 옮김": 학습자의 Day 13 블록 순서를 알 수 없어 블록 전체 교체로 표현(결과 동일).

## 미검증
Windows 화면 전부, OBS 실행, GitHub Actions/Pages 배포, Edge DevTools 탭 이름, 저장소 차단(설정) 시 오류 꼬리 문구.
