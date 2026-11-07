# Task 15 재리뷰 (수정 회차 1) — 3173b9a..6115e79

방법: diff 1회 정독 + grep/계산으로 Day 7·8 확인. 테스트 재실행 없음(구현자의 tsc/build 주장은 미재검증).

## Finding Verdicts
| # | 항목 | 판정 | 비고 |
|---|---|---|---|
| I1 | D8 과제 1 `wait` import | ADDRESSED | 과제·정답에 import 줄과 noUnusedLocals 설명 |
| I2 | D4 `.join(', ')` | ADDRESSED | 첫 사용 단계 5에 설명 |
| I3 | D8 `append`/HTMLLIElement/HTMLUListElement | ADDRESSED | 단계 5 항목 5·6 추가 |
| tip | D1 `:::tip 이 교재를 읽는 방법` | ADDRESSED | 시작 상태 직전. `#/page/glossary` 경로는 CONTENT-GUIDE 161행과 일치 |
| M1 | `node -e` | ADDRESSED | D4 단계 2 |
| M2 | D4 들여쓰기 주장 | ADDRESSED | `"use strict";`/`export {};` 차이로 교체 |
| M3 | D8 unblock 복구 | ADDRESSED | ⋮ → More tools → Network request blocking. 이름 hedge는 추가했으나 실기 미확인(검증 문서에 기록) |
| M4 | D8 css 빈 줄·`.card h2` | ADDRESSED | 빈 줄 추가, Day 28 안내 |
| M5 | rule (d) D6–8 전체 파일 | ADDRESSED | D6 3파일, D7 4파일, D8 JSON×2·ui·api 전체. style.css만 부분(244줄, 명시) |
| M6 | D3 push 해시 | ADDRESSED | `9d8c7b6..2b3c4d5`가 D3 570행 log와 일치 |
| M7 | D9 C# 자산 프롬프트·.vscode | ADDRESSED | 아니요 선택, .vscode 무해, 한국어 문구 미확인 표기 |
| M8 | 백틱/₩ 표현 | ADDRESSED | D2 단계 2·6, D3 단계 5 |
| M9 | D7 HMR 표현 | **NOT ADDRESSED (새 결함 포함)** | 아래 New Breakage #1: 추가한 CSS 실습이 지금 시점에 따라 할 수 없음 |
| M10 | D8 `npx tsc --noEmit` | ADDRESSED | 체크리스트에서 제거 |
| M11 | `Copy-Item` 설명 | ADDRESSED | D7 |
| M12 | D9 버전 기준일 | ADDRESSED | 2곳 |
| M13 | D7/D8 과제 미커밋 → git 더러움 | ADDRESSED | D7·D8 "마무리" 단계 + 체크리스트 + D8 `6 files changed` 수정. D8 시작 문구 "Day 7 과제까지 이미 올렸으니" 일치 |
| M14 | D1 시간 합 | ADDRESSED | 5분 항목 분 조정: 단계 4+9+4+5+4+9+(1단계) 합 40, 과제 4+4+2=10 → 75 |

(핑거: 19개 중 ADDRESSED 18, NOT ADDRESSED 1 — M9. ₩ 키 D2 단계 2 인라인 노트는 M8에 포함해 판정, 🧯 상한 유지됨.)

## Day 8 Integrity
**무결함.** `git diff --stat`: +173/−12. diff의 삭제 12줄은 모두 의도한 수정(단계 5 교체, 차단 해제 문장, 단계 8 문구, `7 files` 줄, 과제 1 줄, 정답 문장 3개, 과제 3 분, 끝 상태 문장 2개, 체크리스트 2줄)과 일치. h2 순서 동일(목표→개념→따라하기→과제→정답→🧯→체크리스트→더 알아보기), h2 중복 없음. 코드 펜스 60→76(= 새 끝 상태 블록 5개 ×2 + 정답 import 블록 + 마무리 3블록 ×2 …, 홀수 없음) 짝수. 🧯 줄 수 1 유지. 중복 줄은 새 끝 상태의 JSON/코드가 본문과 같은 것뿐이며 문단 중복 없음. 의도하지 않은 내용 손실 없음.

## New Breakage in the Fix Diff
1. **[Important] D7 단계 3 새 항목 5가 따라 할 수 없음** (`day-07.md:190`). `client\src\style.css`의 `--bg: #fff;` 줄을 고치라는데, 이 시점의 style.css는 Vite 템플릿 원본이고 우리 `style.css`(`--bg: #ffffff;`, 312행)는 6단계(295행)에서 비로소 쓴다. 템플릿엔 `--bg`가 없고, 6단계 뒤에도 값은 `#ffffff`라 `#fff` 검색이 안 맞는다. 막힘 위험. 수정안: 실습을 6단계 직후로 옮기거나 `#ffffff`로 쓰고 6단계 뒤에 안내.
2. [Minor] D7 따라하기 단계 합 67분 vs 머리말 68분(수정 전에도 같은 차이, 수정이 만든 것은 아님). 과제 20+마무리 2=22 ✓, D8 68/22 ✓.
3. 🧯: 수정 diff는 🧯 섹션을 건드리지 않음 → 개수 변동 없음. "아래 🧯" 참조(D1·D7) 대상 그대로 존재. D1 tip의 "아래 **🧯 자주 막히는 곳**"도 해결됨.
4. 상태 연결: D7 끝(마무리 커밋 후 clean) → D8 시작 일치. D8 끝 clean → D9 시작(별도 폴더) 일치. 시간 변경: D1(75 유지), D7 과제 2 12→10, D8 과제 3 12→10은 마무리 2분 편입으로 합 22 유지 ✓.
5. 형식: D1 tip 위치·제목이 CONTENT-GUIDE 63행 준수.

## Out-of-Scope Observations
- D7 `:::success` 첫 글머리표 "main.ts를 고친 경우 … 자동 새로 고침"이라는 표현은 구현자가 실행으로 확인했다고 검증 문서에 적음(내가 재검증하지 않음).
- D7 따라하기 합계 67 vs 68(기존).
- 구현자 주장 "Day 6/7/8 코드 재실행 통과"는 이번에 재실행하지 않음(요청 범위 밖).

## Verdict
**Findings remain open:**
- M9 (D7 HMR 실습): 새 항목 5의 `style.css` 편집이 6단계 전에는 불가능 → Important. 18/19 해결, 이 1건이 열려 있음.
