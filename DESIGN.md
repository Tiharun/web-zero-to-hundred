---
name: 웹 제로 투 헌드레드
description: 초보자가 계속 공부하고 싶어지는 오프라인 단일 HTML 웹 개발 교재
colors:
  page-indigo-mist: "#EEF2FF"
  card-white: "#FFFFFF"
  ink-deep-indigo: "#312E81"
  ink-slate-sub: "#475569"
  quest-pink: "#DB2777"
  quest-pink-deep: "#BE185D"
  on-quest-pink: "#FFFFFF"
  xp-green: "#16A34A"
  xp-track: "#F1F5F9"
  dark-page-night: "#0D0F1F"
  dark-card-indigo: "#151833"
  dark-ink-mist: "#EEF2FF"
  dark-ink-sub: "#A3A9C9"
  dark-quest-pink: "#F472B6"
  dark-quest-pink-soft: "#F9A8D4"
  dark-on-quest-pink: "#0D0F1F"
  dark-xp-green: "#4ADE80"
  dark-xp-track: "#2A2F55"
typography:
  display:
    fontFamily: "WZH Wanted Sans, Malgun Gothic, system-ui, sans-serif"
    fontSize: "80px"
    fontWeight: 800
    lineHeight: 0.85
    letterSpacing: "-0.04em"
    fontFeature: "tnum"
  headline:
    fontFamily: "WZH Wanted Sans, Malgun Gothic, system-ui, sans-serif"
    fontSize: "38px"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  body:
    fontFamily: "WZH Wanted Sans, Malgun Gothic, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "WZH Galmuri11, WZH Wanted Sans, Malgun Gothic, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.4
  code:
    fontFamily: "WZH Code, Consolas, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  button: "6px"
  card: "12px"
  pill: "999px"
components:
  button-primary:
    backgroundColor: "{colors.quest-pink}"
    textColor: "{colors.on-quest-pink}"
    rounded: "{rounded.button}"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.quest-pink-deep}"
    textColor: "{colors.on-quest-pink}"
  button-primary-dark:
    backgroundColor: "{colors.dark-quest-pink}"
    textColor: "{colors.dark-on-quest-pink}"
    rounded: "{rounded.button}"
    height: "48px"
  button-primary-dark-hover:
    backgroundColor: "{colors.dark-quest-pink-soft}"
    textColor: "{colors.dark-on-quest-pink}"
  card-quest:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.ink-deep-indigo}"
    rounded: "{rounded.card}"
  card-quest-dark:
    backgroundColor: "{colors.dark-card-indigo}"
    textColor: "{colors.dark-ink-mist}"
    rounded: "{rounded.card}"
  xp-bar:
    backgroundColor: "{colors.xp-track}"
    rounded: "{rounded.pill}"
    height: "12px"
  xp-bar-dark:
    backgroundColor: "{colors.dark-xp-track}"
    rounded: "{rounded.pill}"
    height: "12px"
---

<!-- SEED: 구현 전에 사용자와 정하고 확정한 방향(2026-11-11). "열린 결정"은 아직 미정이다. 색·글꼴·크기·모서리는 사용자가 홈 히어로 플레이그라운드에서 고른 값이다. 코드가 생기면 /impeccable document 를 다시 돌려 실제 토큰과 사이드카(.impeccable/design.json)를 만든다. -->

# Design System: 웹 제로 투 헌드레드

## Overview

**Creative North Star: "공부 퀘스트 보드"** (제안. 이름은 바꿔도 된다)

조용한 남색 종이 위에 오늘 할 일 하나가 크게 놓인 보드다. 화면 대부분은 남색 글자와 흰 카드로 차분하게 둔다. 분홍은 "지금 누를 것"에만, 초록은 "실제로 쌓인 진도"에만 쓴다. 게임 느낌은 라벨용 픽셀 글꼴과 레벨·XP 표시에서만 난다. Day 본문은 읽기 쉬운 교재 글로 남는다.

밀도는 보통이다. 홈은 할 일로 바로 들어가는 출발 화면(Operate)이고, Day 페이지는 긴 글을 읽는 화면(Read)이다. 둘 다 같은 색과 글꼴을 쓰되, 큰 숫자와 강한 포인트는 홈 히어로에 모은다.

**Key Characteristics:**
- 남색 잉크 + 흰 카드 + 연한 남색 바탕, 라이트/다크 같은 구조
- 분홍 포인트 하나, 초록 진도 하나. 그 밖의 강조색은 없다
- 큰 Day 번호(제목의 2.1배)가 히어로의 초점
- 게임 어휘와 픽셀 글꼴은 라벨에만

## Colors

차분한 남색 바탕에 분홍 행동색과 초록 진도색을 하나씩 더한 팔레트다.

### Primary
- **Quest Pink** (`quest-pink`): 주 버튼("이어서 하기") 배경, 카드 위 포인트 글자, 포커스 링, 현재 Day 표시. 흰 글자와 대비 4.60:1, 흰 카드 위 글자로 4.60:1.
- **Quest Pink Deep** (`quest-pink-deep`): 주 버튼 hover, 그리고 **페이지 바탕(`page-indigo-mist`) 위에 놓이는 포인트 글자·링크**. 바탕 위 5.40:1, 흰 글자와 6.04:1.

### Secondary
- **XP Green** (`xp-green`): XP 막대 채움, 완료 표시. 흰 카드와 3.30:1, 트랙(`xp-track`)과 3.01:1(비문자 기준 3:1 통과, 여유 적음).

### Neutral
- **Indigo Mist** (`page-indigo-mist`): 페이지 바탕.
- **Card White** (`card-white`): 카드·패널 바탕.
- **Deep Indigo Ink** (`ink-deep-indigo`): 본문과 제목 글자. 바탕 위 10.22:1, 카드 위 11.42:1.
- **Slate Sub** (`ink-slate-sub`): 보조 글자(예상 시간 라벨, 설명). 바탕 위 6.78:1, 카드 위 7.58:1.
- **XP Track** (`xp-track`): XP 막대 빈 칸.

### Dark pair (같은 역할, 다크 모드)
| 역할 | 라이트 | 다크 | 다크 대비(측정) |
|---|---|---|---|
| 바탕 | `page-indigo-mist` | `dark-page-night` | |
| 카드 | `card-white` | `dark-card-indigo` | |
| 본문 글자 | `ink-deep-indigo` | `dark-ink-mist` | 카드 15.52, 바탕 16.99 |
| 보조 글자 | `ink-slate-sub` | `dark-ink-sub` | 카드 7.50, 바탕 8.21 |
| 포인트(버튼·글자·링) | `quest-pink` | `dark-quest-pink` | 카드 6.55, 바탕 7.17 |
| 버튼 글자 | `on-quest-pink` | `dark-on-quest-pink` | 버튼 위 7.17 |
| 포인트 hover | `quest-pink-deep` | `dark-quest-pink-soft` | 버튼 글자 10.48 |
| XP 채움 / 트랙 | `xp-green` / `xp-track` | `dark-xp-green` / `dark-xp-track` | 카드 9.96, 트랙 7.37 |

다크에서는 포인트가 밝아지므로 버튼 글자를 흰색이 아닌 어두운 색으로 바꾼다. 바탕 위 글자를 따로 짙게 할 필요가 없다(바탕 위 7.17:1).

### 아직 정하지 않은 색
테두리·구분선, 알림 상자(팁·경고·정보·경로·성공), 코드 블록과 구문 강조, 위험(danger) 색은 현재 `textbook/src/styles.css` 값이 남색 팔레트와 맞는지 구현 때 다시 재고 정한다. 지금 값을 이 문서의 결정으로 보지 않는다.

### Named Rules
**The One Pink Rule.** 분홍은 한 화면에서 "다음에 누를 것" 하나와 그 주변 표시에만 쓴다. 장식, 배경 띠, 제목 색으로 쓰지 않는다.

**The Paper Check Rule.** 라이트 모드에서 `quest-pink`는 흰 카드 위에서만 글자로 쓴다. 페이지 바탕 위에서는 4.11:1로 기준 미달이므로 `quest-pink-deep`을 쓴다.

**The Real Progress Rule.** 초록은 실제로 완료한 것만 칠한다. 예정·잠김·준비 중에는 쓰지 않는다.

## Typography

**Display / Body Font:** Wanted Sans (대체: 맑은 고딕, system-ui)
**Label Font:** Galmuri11 (대체: Wanted Sans)
**Code Font:** D2Coding (대체: Consolas)

**Character:** 반듯한 현대 고딕 한 가족으로 제목과 본문을 모두 쓰고, 픽셀 글꼴을 라벨에만 얹어 게임 느낌을 낸다. 제목도 본문과 같은 고딕이다.

### Hierarchy
- **Display** (800, Day 제목 크기의 2.1배, 반올림 80px, 줄간격 0.85, 숫자 고정폭): 홈 히어로의 큰 Day 번호 하나에만.
- **Headline** (800, 38px, 1.15): 홈 히어로의 Day 제목.
- **Body** (400, 17px, 1.65): 요약·설명 글. 한국어는 `word-break: keep-all`.
- **Label** (Galmuri11, 12px): "오늘의 퀘스트", "레벨", "XP", 월드 상태 같은 게임 라벨. 12px는 Galmuri11의 기본 크기다. 더 크게 쓸 때는 24px(2배)를 쓴다.
- **Code** (D2Coding, 14px): 작업 폴더, 명령어, 코드 블록.

### 넣는 방법(제약)
- 세 글꼴 모두 `index.html` 안에 넣는다(외부 요청 0건). 쓰는 글자만 남겨 크기를 줄인다.
- 글꼴 서브셋은 OFL상 수정본이다. **D2Coding은 예약 이름이 있으므로** 넣을 때 이름을 바꾼다(예: `WZH Code`). Wanted Sans와 Galmuri11은 예약 이름이 없다(측정). 혼동을 막으려고 세 글꼴 모두 `WZH` 접두사 이름을 쓴다.
- 각 글꼴의 OFL 문서를 함께 둔다. 글꼴이 안 불러와져도 대체 글꼴로 읽혀야 한다.

### Named Rules
**The Label-Only Pixel Rule.** Galmuri11은 라벨과 짧은 수치에만 쓴다. Day 제목·본문·버튼 문장에는 쓰지 않는다.

**The One Big Number Rule.** Display 크기는 화면에 하나만 둔다.

## Layout

홈 히어로는 `design-system/web-zero-to-hundred/pages/home.md`를 따른다: 넓은 화면에서 오늘의 퀘스트(약 2/3) + 레벨 패널(약 1/3), 아래에 월드맵과 막혔을 때 줄. 360px에서는 세로 한 줄이며 가로 스크롤이 없다. 간격 단위와 최대 폭은 구현 때 정한다.

## Elevation & Depth

기본은 평평하다. 카드는 그림자 대신 흰 면과 얇은 테두리로 바탕과 구분한다(테두리 색은 미정). 다크에서도 같다.

## Shapes

모서리는 살짝 둥글다. 버튼 6px, 카드 12px(버튼 +6px). XP 막대만 완전히 둥근 알약 모양이다.

## Components

### Buttons
- **Shape:** 살짝 둥근 모서리(6px), 높이 48px 이상.
- **Primary:** 분홍 바탕에 흰 굵은 글자. 한 화면에 하나.
- **Hover / Focus:** hover는 더 짙은 분홍. 키보드 포커스는 분홍 링을 버튼 바깥에 두른다(링 두께·간격은 구현 때 정함).
- **Secondary:** 버튼 모양 대신 밑줄 글자 링크(예: "막혔을 때 탈출 가이드").

### Cards / Containers
- **Corner Style:** 12px.
- **Background:** 라이트 흰색, 다크 `dark-card-indigo`.
- **Shadow Strategy:** 없음(Elevation 참고).

### XP Bar (signature)
- 높이 12px 알약 모양. 채움은 초록, 빈 칸은 트랙 색.
- 막대만으로 뜻을 전하지 않는다. 옆에 "80 / 300 XP" 같은 숫자 글자를 늘 둔다.
- Day 완료 뒤 홈에 왔을 때 한 번만 늘어난다. `prefers-reduced-motion`이면 바로 최종 상태.

## Do's and Don'ts

### Do:
- **Do** 다크 모드 값을 라이트와 같은 역할 이름으로 짝지어 둔다(위 Dark pair 표).
- **Do** 새 색 조합을 넣을 때 글자 4.5:1, 막대·링 같은 비문자 3:1을 재고 적는다.
- **Do** 라이트 바탕 위 포인트 글자에는 `quest-pink-deep`을 쓴다.

### Don't:
- **Don't** 분홍을 장식·배경·제목 색으로 쓰지 않는다.
- **Don't** Galmuri11을 본문이나 버튼 문장에 쓰지 않는다.
- **Don't** 외부 글꼴·CDN을 불러오지 않는다.
- **Don't** 완료하지 않은 것을 초록으로 칠하지 않는다.

## 열린 결정

- Day 본문(긴 글) 줄간격: 이 문서의 Body는 1.65다. 현재 Day 본문은 1.75다. Day 페이지에도 1.65를 쓸지 정해야 한다.
- 본문 글자 크기 17px은 현재 값을 그대로 옮긴 것이다(플레이그라운드에서 고르지 않음).
- 테두리, 알림 상자, 코드 구문 색, 간격 단위, 포커스 링 세부.
- XP 공식(예상 분, 300 XP/레벨)은 임시다.
- North Star 이름은 제안이다.
