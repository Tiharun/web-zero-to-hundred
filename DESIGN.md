---
name: 웹 제로 투 헌드레드
description: 초보자가 계속 공부하고 싶어지는 오프라인 단일 HTML 웹 개발 교재
colors:
  paper: "#EEF2FF"
  card: "#FFFFFF"
  ink: "#312E81"
  ink-2: "#475569"
  accent: "#DB2777"
  accent-hover: "#BE185D"
  accent-ink: "#FFFFFF"
  accent-text: "#BE185D"
  focus: "#DB2777"
  progress: "#16A34A"
  progress-ink: "#FFFFFF"
  track: "#F1F5F9"
  rule: "#D8DDF4"
  line: "#7A83BC"
  scrim: "rgb(49 46 129 / 0.34)"
  edge: "#312E81"
  accent-deep: "#9D174D"
  progress-deep: "#15803D"
  cell: "#D8DDF4"
  xp: "#15803D"
  coin: "#F59E0B"
  coin-deep: "#B45309"
  coin-hi: "#FEF3C7"
  star: "#B45309"
  dark-paper: "#0D0F1F"
  dark-card: "#151833"
  dark-ink: "#EEF2FF"
  dark-ink-2: "#A3A9C9"
  dark-accent: "#F472B6"
  dark-accent-hover: "#F9A8D4"
  dark-accent-ink: "#0D0F1F"
  dark-accent-text: "#F472B6"
  dark-focus: "#F472B6"
  dark-progress: "#4ADE80"
  dark-progress-ink: "#0D0F1F"
  dark-track: "#2A2F55"
  dark-rule: "#2A2F55"
  dark-line: "#5A62A0"
  dark-scrim: "rgb(5 6 15 / 0.62)"
  dark-edge: "#5A62A0"
  dark-accent-deep: "#BE185D"
  dark-progress-deep: "#15803D"
  dark-cell: "#2A2F55"
  dark-xp: "#4ADE80"
  dark-coin: "#FBBF24"
  dark-coin-deep: "#FDE68A"
  dark-coin-hi: "#FFFBEB"
  dark-star: "#FBBF24"
typography:
  display:
    fontFamily: "\"WZH Wanted Sans\", \"Malgun Gothic\", system-ui, sans-serif"
    fontSize: "80px"
    fontWeight: 800
    lineHeight: 0.85
    letterSpacing: "-0.04em"
    fontFeature: "tnum"
  headline:
    fontFamily: "\"WZH Wanted Sans\", \"Malgun Gothic\", system-ui, sans-serif"
    fontSize: "38px"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  title:
    fontFamily: "\"WZH Wanted Sans\", \"Malgun Gothic\", system-ui, sans-serif"
    fontSize: "26px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title-sm:
    fontFamily: "\"WZH Wanted Sans\", \"Malgun Gothic\", system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 800
    lineHeight: 1.3
  hud-number:
    fontFamily: "\"WZH Wanted Sans\", \"Malgun Gothic\", system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
  body:
    fontFamily: "\"WZH Wanted Sans\", \"Malgun Gothic\", system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.65
  ui:
    fontFamily: "\"WZH Wanted Sans\", \"Malgun Gothic\", system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
  label:
    fontFamily: "\"WZH Galmuri11\", \"WZH Wanted Sans\", \"Malgun Gothic\", sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.4
  code:
    fontFamily: "\"WZH Code\", Consolas, monospace"
    fontSize: "14px"
    fontWeight: 400
rounded:
  btn: "6px"
  card: "12px"
  pill: "999px"
spacing:
  3xs: "2px"
  2xs: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.btn}"
    height: "48px"
    padding: "0 24px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  button-primary-dark:
    backgroundColor: "{colors.dark-accent}"
    textColor: "{colors.dark-accent-ink}"
    rounded: "{rounded.btn}"
    height: "48px"
    padding: "0 24px"
  button-primary-dark-hover:
    backgroundColor: "{colors.dark-accent-hover}"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
  card-dark:
    backgroundColor: "{colors.dark-card}"
    textColor: "{colors.dark-ink}"
    rounded: "{rounded.card}"
  quest-card:
    padding: "32px"
  board-tile:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.btn}"
    size: "34px"
  board-tile-dark:
    backgroundColor: "{colors.dark-card}"
    textColor: "{colors.dark-ink-2}"
  board-tile-done:
    backgroundColor: "{colors.progress}"
    textColor: "{colors.progress-ink}"
  board-tile-done-dark:
    backgroundColor: "{colors.dark-progress}"
    textColor: "{colors.dark-progress-ink}"
  board-tile-today:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    size: "46px"
  board-tile-today-dark:
    backgroundColor: "{colors.dark-accent}"
    textColor: "{colors.dark-accent-ink}"
  xp-bar:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.btn}"
    height: "24px"
  xp-bar-fill:
    backgroundColor: "{colors.xp}"
  xp-bar-fill-dark:
    backgroundColor: "{colors.dark-xp}"
  lv-badge:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.btn}"
    width: "76px"
  tooltip:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.btn}"
    padding: "4px 12px"
  tooltip-dark:
    backgroundColor: "{colors.dark-ink}"
    textColor: "{colors.dark-paper}"
  chip:
    backgroundColor: "{colors.track}"
    rounded: "{rounded.btn}"
    padding: "2px 8px"
  search-modal:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.card}"
    width: "min(40rem, calc(100% - 32px))"
  drawer:
    backgroundColor: "{colors.card}"
    width: "min(280px, calc(100% - 48px))"
---

<!-- 기준: 사용자가 승인한 홈 시안(hallmark → bolder → polish, 2026-11-11)의 style.css·view.mjs·app.js·template.html·build-home.mjs. 시안 폴더는 git에서 제외되어 있으므로 이 문서만으로 같은 값을 재현할 수 있게 썼다. 모든 값은 코드 그대로이고 반올림하지 않았다(대비값만 소수 둘째 자리 반올림). frontmatter와 표의 이름은 CSS 변수 이름에서 앞부분(--color- 등)을 뗀 것이다. dark- 접두사는 다크 테마 값이다. -->

# Design System: 웹 제로 투 헌드레드

## Overview

**Creative North Star: "공부 퀘스트 보드"** (이름은 미확정 제안)

연한 남색 종이 위에 흰 카드가 장난감처럼 놓인 보드다. 카드와 버튼은 흐림 그림자 대신 단색 **바닥 턱**(아래로 4px 붙은 단색 면)을 달고 있어서, 누르면 턱만큼 내려간다. 지금 월드의 Day는 둥근 네모 **보드게임 칸**으로 줄지어 있고, 오늘 칸 위에 말이 서 있다. 레벨 패널은 게임의 상태 표시줄(HUD)처럼 LV 배지와 10칸 XP 막대로 보여 준다.

게임 느낌은 세 군데에서만 난다: 도트 그림(게임 물건), 픽셀 글꼴 라벨, 바닥 턱과 튀는 움직임. 글은 반듯한 고딕 한 가족이고, Day 제목·요약·본문 어휘는 바꾸지 않는다. 분홍은 "지금 누를 것", 초록은 "실제로 끝낸 것", 금색은 "보상 그림"에만 쓴다.

홈은 할 일로 바로 들어가는 출발 화면(Operate)이다. Day 페이지는 긴 글을 읽는 화면(Read)이며 같은 토큰을 쓴다. 큰 숫자와 강한 표현은 홈의 퀘스트 카드와 지도에 모으고, 읽는 화면에서는 줄인다.

**Key Characteristics:**
- 남색 잉크, 흰 카드, 연한 남색 바탕. 라이트·다크가 같은 역할 이름을 쓴다.
- 흐림 없는 단색 바닥 턱(`--ledge` 4px)과 2px 테두리
- 행동색 분홍 하나, 진도색 초록 하나, 보상 금색은 도트 아이콘 채움에만
- 조작은 선 아이콘, 게임 물건은 도트 아이콘
- 큰 Day 번호 하나(80px)가 화면의 초점
- 픽셀 글꼴은 12px 라벨에만

## Colors

남색 종이에 분홍 행동색, 초록 진도색, 금색 보상색을 하나씩 더한 팔레트다. 다크 테마는 `prefers-color-scheme: dark`(사용자가 라이트를 고르지 않았을 때)와 `[data-theme="dark"]` 두 곳에 같은 값을 둔다.

### Primary (행동)
- **Quest Pink** (`accent`): 주 버튼 바탕, 오늘 칸 바탕, 사이드바의 오늘 Day 번호 바탕, 선택 영역(`::selection`), 입력 커서, 검색 결과 선택 막대, 검색어 밑줄.
- **Quest Pink Hover** (`accent-hover`): 주 버튼 hover 바탕, 말 아이콘의 반짝임 칸.
- **On Pink** (`accent-ink`): 분홍 바탕 위 글자. 라이트는 흰색, 다크는 밤색.
- **Pink Text** (`accent-text`): 분홍 계열 **글자**(링크 hover, 메뉴 체크 표시, 오늘 칸 아래 "오늘", 눌린 글자 버튼). 라이트는 바탕(`paper`) 위에서도 기준을 넘도록 짙은 분홍을 쓴다.
- **Focus Ring** (`focus`): 키보드 포커스 링과 검색 입력칸 밑줄.
- **Pink Ledge** (`accent-deep`): 분홍 면 아래 바닥 턱(주 버튼, 오늘 칸, 사이드바 오늘 번호).

### Secondary (진도)
- **Clear Green** (`progress`): 완료 칸 바탕, 완료 경로선, 완료 체크, 범례 완료 칸.
- **On Green** (`progress-ink`): 초록 위 체크 표시.
- **Green Ledge** (`progress-deep`): 완료 칸의 테두리와 턱, 지나온 길의 방향 화살표.
- **XP Green** (`xp`): XP 막대의 채운 칸.

### Tertiary (보상)
- **Coin Gold** (`coin`): 코인·트로피·퀘스트 도트 아이콘의 채움, 깃발 천, 월드 엠블럼 채움, 축하 조각 한 색.
- **Coin Outline** (`coin-deep`): 코인·트로피·퀘스트 아이콘 윤곽.
- **Coin Shine** (`coin-hi`): 코인·트로피·엠블럼의 반짝임 칸.
- **Star** (`star`): 별 도트 아이콘(클리어한 월드, 완료한 Day 통계).

### Neutral
- **Indigo Mist** (`paper`): 페이지 바탕, LV 배지와 월드 문장 칸의 바탕, 잠긴 월드 카드 바탕, 툴팁 글자.
- **Card White** (`card`): 카드·상단 바·사이드바·서랍·검색·메뉴 바탕, 방향 화살표 받침.
- **Deep Indigo Ink** (`ink`): 본문·제목 글자, 툴팁 바탕, 도트 아이콘 기본 윤곽.
- **Slate Sub** (`ink-2`): 보조 글자, 남은 칸의 테두리와 턱, 알림 상자 테두리.
- **Track** (`track`): hover 바탕, 기술 칩 바탕, 검색 선택 행 바탕.
- **Rule** (`rule`): 구분선과 카드 테두리, 카드 바닥 턱, 눌림(active) 바탕.
- **Line** (`line`): 남은 경로선(점선), 남은 길의 방향 화살표, 스크롤바 막대.
- **Edge** (`edge`): 퀘스트 카드와 LV 배지의 진한 테두리·턱, 축하 조각 한 색.
- **Cell** (`cell`): XP 막대의 빈 칸, 도움말 아이콘 채움.
- **Scrim** (`scrim`): 서랍·검색 뒤 백드롭.

### 색 토큰 표

| 토큰 | 라이트 | 다크 | 쓰는 곳 |
|---|---|---|---|
| `--color-paper` | `#EEF2FF` | `#0D0F1F` | 페이지 바탕 |
| `--color-card` | `#FFFFFF` | `#151833` | 카드·패널 바탕 |
| `--color-ink` | `#312E81` | `#EEF2FF` | 본문 글자, 툴팁 바탕 |
| `--color-ink-2` | `#475569` | `#A3A9C9` | 보조 글자, 남은 칸 테두리 |
| `--color-accent` | `#DB2777` | `#F472B6` | 행동색 면 |
| `--color-accent-hover` | `#BE185D` | `#F9A8D4` | 주 버튼 hover |
| `--color-accent-ink` | `#FFFFFF` | `#0D0F1F` | 분홍 위 글자 |
| `--color-accent-text` | `#BE185D` | `#F472B6` | 분홍 글자 |
| `--color-focus` | `#DB2777` | `#F472B6` | 포커스 링 |
| `--color-progress` | `#16A34A` | `#4ADE80` | 완료 면·선 |
| `--color-progress-ink` | `#FFFFFF` | `#0D0F1F` | 초록 위 체크 |
| `--color-track` | `#F1F5F9` | `#2A2F55` | hover·칩 바탕 |
| `--color-rule` | `#D8DDF4` | `#2A2F55` | 구분선·카드 테두리·카드 턱 |
| `--color-line` | `#7A83BC` | `#5A62A0` | 남은 경로선·스크롤바 |
| `--color-scrim` | `rgb(49 46 129 / 0.34)` | `rgb(5 6 15 / 0.62)` | 백드롭 |
| `--color-edge` | `#312E81` | `#5A62A0` | 퀘스트 카드·LV 배지 테두리와 턱 |
| `--color-accent-deep` | `#9D174D` | `#BE185D` | 분홍 면의 턱 |
| `--color-progress-deep` | `#15803D` | `#15803D` | 완료 칸 턱, 지난 길 화살표 |
| `--color-cell` | `#D8DDF4` | `#2A2F55` | XP 빈 칸 |
| `--color-xp` | `#15803D` | `#4ADE80` | XP 채운 칸 |
| `--color-coin` | `#F59E0B` | `#FBBF24` | 보상 아이콘 채움 |
| `--color-coin-deep` | `#B45309` | `#FDE68A` | 보상 아이콘 윤곽 |
| `--color-coin-hi` | `#FEF3C7` | `#FFFBEB` | 보상 아이콘 반짝임 |
| `--color-star` | `#B45309` | `#FBBF24` | 별 아이콘 |

### 대비 (WCAG 2.x 상대 휘도, 측정)

기준: 글자 4.5:1, 막대·링·칸 테두리 같은 비문자 3:1. "장식"은 정보를 다른 수단(글자, 모양, 다른 대비)이 맡는 쌍이다.

| 쌍 (앞 / 뒤) | 라이트 | 다크 | 판정 |
|---|---|---|---|
| `ink` / `paper` | 10.22 | 16.99 | 글자 통과 |
| `ink` / `card` | 11.42 | 15.52 | 글자 통과 |
| `ink` / `track` | 10.43 | 11.48 | 칩 글자 통과 |
| `ink-2` / `paper` | 6.78 | 8.21 | 글자 통과 |
| `ink-2` / `card` | 7.58 | 7.50 | 글자·남은 칸 테두리 통과 |
| `ink-2` / `track` | 6.92 | 5.55 | 글자 통과 |
| `accent-ink` / `accent` | 4.60 | 7.17 | 버튼 글자 통과 |
| `accent-ink` / `accent-hover` | 6.04 | 10.48 | hover 글자 통과 |
| `accent` / `card` | 4.60 | 6.55 | 오늘 칸 면 통과 |
| `accent` / `paper` | 4.11 | 7.17 | 비문자만. 라이트에서 바탕 위 분홍 글자 금지 |
| `accent-text` / `paper` | 5.40 | 7.17 | 글자 통과 |
| `accent-text` / `card` | 6.04 | 6.55 | 글자 통과 |
| `accent-text` / `track` | 5.51 | 4.85 | 글자 통과 |
| `focus` / `paper` | 4.11 | 7.17 | 링 통과 |
| `focus` / `card` | 4.60 | 6.55 | 링 통과 |
| `progress` / `card` | 3.30 | 9.96 | 완료 칸·경로 통과 |
| `progress-ink` / `progress` | 3.30 | 10.90 | 체크 통과 |
| `line` / `card` | 3.62 | 3.05 | 남은 경로·화살표 통과 |
| `line` / `paper` | 3.24 | 3.34 | 스크롤바 통과 |
| `edge` / `paper` | 10.22 | 3.34 | LV 배지 테두리 통과 |
| `edge` / `card` | 11.42 | 3.05 | 퀘스트 카드 테두리 통과 |
| `accent-deep` / `paper` | 7.05 | 3.15 | 턱 |
| `accent-deep` / `card` | 7.88 | 2.87 | 턱(장식, 다크 3:1 미만. 버튼 면이 6.55로 식별을 맡는다) |
| `progress-deep` / `card` | 5.02 | 3.46 | 지난 길 화살표 통과(다크 3.46 유지, 결정) |
| `xp` / `cell` | 3.72 | 7.37 | XP 채운 칸과 빈 칸 구분 통과 |
| `xp` / `card` | 5.02 | 9.96 | 통과 |
| `coin-deep` / `card` | 5.02 | 13.93 | 보상 아이콘 윤곽 통과 |
| `coin-deep` / `paper` | 4.49 | 15.26 | 통과 |
| `coin` / `card` | 2.15 | 10.39 | 채움(장식, 윤곽이 대비를 맡는다) |
| `star` / `card` | 5.02 | 10.39 | 통과 |
| `star` / `paper` | 4.49 | 11.38 | 통과 |
| `paper` / `ink` | 10.22 | 16.99 | 툴팁 글자 통과 |
| `rule` / `card` | 1.35 | 1.35 | 장식(카드 경계는 면 색과 턱이 맡는다) |
| `rule` / `paper` | 1.21 | 1.48 | 장식 |
| `cell` / `card` | 1.35 | 1.35 | 장식(빈 칸 구분은 막대 테두리 안에서만) |

### Named Rules
**The One Pink Rule.** 행동을 부르는 색은 분홍 하나다. 한 화면에 주 버튼(분홍 면)은 하나만 둔다. 분홍 면은 그 버튼과 "오늘" 표시(오늘 칸, 사이드바 오늘 번호)에만 쓰고, 장식·배경 띠·제목 색으로 쓰지 않는다. 코인 금색(`coin`)은 도트 아이콘의 채움에만 쓰고 글자·버튼·배경에는 쓰지 않는다.

**The Paper Check Rule.** 분홍 글자는 늘 `accent-text`로 쓴다. 라이트 `accent`는 바탕(`paper`) 위 4.11:1이라 글자로 쓸 수 없다.

**The Real Progress Rule.** 초록(`progress`, `progress-deep`, `xp`)은 실제로 완료한 것만 칠한다. 경로선의 초록 구간은 Day 1부터 **연속으로** 끝낸 마지막 Day까지만이다. 예정·잠김·준비 중에는 초록을 쓰지 않는다. 숫자도 같다: 화면의 모든 수치는 진도 데이터에서 계산한 값이고 지어낸 수치(연속 학습일, 순위, 학습자 수)는 넣지 않는다.

## Typography

**Display / Body Font:** WZH Wanted Sans (Wanted Sans 서브셋, 대체: 맑은 고딕, system-ui)
**Label Font:** WZH Galmuri11 (Galmuri11 서브셋, 대체: WZH Wanted Sans, 맑은 고딕)
**Code Font:** WZH Code (D2Coding 서브셋, 대체: Consolas)

**Character:** 반듯한 현대 고딕 한 가족이 제목과 본문을 모두 맡고, 도트 글꼴은 작은 라벨에만 얹어 게임 화면의 상태 글씨처럼 보이게 한다. 굵기는 400과 800 두 개뿐이다.

### 글꼴 토큰

| 토큰 | 라이트 | 다크 | 역할 |
|---|---|---|---|
| `--font-body` | `"WZH Wanted Sans", "Malgun Gothic", system-ui, sans-serif` | 같음 | 제목·본문·버튼·숫자 |
| `--font-label` | `"WZH Galmuri11", "WZH Wanted Sans", "Malgun Gothic", sans-serif` | 같음 | 게임 라벨, 작은 번호 |
| `--font-code` | `"WZH Code", Consolas, monospace` | 같음 | 폴더 경로, 단축키, 코드 |

### 글자 크기 토큰

| 토큰 | 라이트 | 다크 | 쓰는 곳 |
|---|---|---|---|
| `--text-display` | `80px` | 같음 | 퀘스트 카드의 큰 Day 번호 하나 |
| `--text-headline` | `38px` | 같음 | 퀘스트 제목 |
| `--text-h2` | `26px` | 같음 | 월드맵 이름 |
| `--text-h3` | `20px` | 같음 | 구역 제목("다른 월드", "막혔을 때"), 월드 카드 제목 |
| `--text-body` | `17px` | 같음 | 본문, 주 버튼, 워드마크, 오늘 칸 숫자 |
| `--text-ui` | `15px` | 같음 | 사이드바 행, 메타, 통계 이름, 칩, 툴팁, 메뉴 |
| `--text-code` | `14px` | 같음 | `code` |
| `--text-label` | `12px` | 같음 | Galmuri 라벨, `kbd` |

### Hierarchy
- **Display** (800, 80px, `line-height: 0.85`, `letter-spacing: -0.04em`, 고정폭 숫자): 큰 Day 번호. 앞에 Galmuri "Day" 라벨이 붙는다. 준비 중 상태에서는 `ink-2` 색.
- **Headline** (800, 38px, `line-height: 1.15`, `letter-spacing: -0.025em`, `max-width: 20ch`): 퀘스트 제목.
- **Title** (800, 26px, `line-height: 1.2`, `letter-spacing: -0.02em`): 월드맵 이름.
- **Title small** (800, 20px, `line-height: 1.3`): 구역 제목과 월드 카드 제목.
- **HUD number** (800, 32px, `letter-spacing: -0.02em`, 줄간격 1): LV 숫자. 크기는 토큰 없이 `font-size: 32px`로 고정돼 있다.
- **Body** (400, 17px, `line-height: 1.65`): 요약·설명. 요약 글은 `max-width: 46ch`.
- **UI** (400 또는 800, 15px): 줄간격은 쓰임별로 사이드바 행 `line-height: 1.35`, 메타 1.4, 알림·칩·격려 문구 1.5, 월드 카드 설명 `line-height: 1.55`.
- **Label** (Galmuri 400, 12px, 줄간격 1.4, 색 `ink-2`): "오늘의 퀘스트", "레벨", "LV", "Day", XP 수치, 월드 태그, 사이드바·칸 번호, "준비 중", 검색 결과 위치·태그.
- **Code** (WZH Code 400, 14px): 작업 폴더 경로. 긴 경로는 `word-break: break-all`.

### 글자 처리
- 모든 글: `word-break: keep-all`, `overflow-wrap: break-word`, `font-synthesis: none`.
- 제목은 `text-wrap: balance`, 단락은 `text-wrap: pretty`.
- 숫자 표시(`.num`)는 `font-variant-numeric: tabular-nums`.
- 밑줄: `text-underline-offset: 0.18em`, 두께 1px. 검색어 강조만 분홍 2px 밑줄이다.

### 넣는 방법
- 세 글꼴 모두 화면에 쓰인 글자만 서브셋해 woff2 base64로 HTML 안에 넣는다(외부 요청 0). Wanted Sans는 가변 글꼴을 `wght: [400, 800]` 범위로 잘라 굵기 범위 400~800(`weight: '400 800'`)으로 선언한다. Galmuri11과 D2Coding은 400 하나다. 코드 글꼴은 코드에 쓰인 글자만 남긴다.
- 서브셋에 남기는 OpenType 기능: `layout_features = ['kern', 'liga', 'calt', 'tnum', 'locl', 'ccmp']`.
- `font-display: swap`. 글꼴이 안 불러와져도 대체 글꼴로 읽힌다.
- 서브셋은 OFL상 수정본이므로 이름을 `WZH` 접두사로 바꾼다(D2Coding은 예약 이름이 있어 필수). 각 글꼴의 OFL 문서를 함께 둔다.

### Named Rules
**The Label-Only Pixel Rule.** Galmuri11은 12px 라벨과 작은 번호에만 쓴다. 제목·본문·버튼 문장·큰 숫자(LV 숫자, 오늘 칸 숫자, 큰 Day 번호)에는 Wanted Sans 800을 쓴다. Galmuri를 크게 키우면 획이 가늘어 보인다.

**The One Big Number Rule.** Display(80px)는 한 화면에 하나만 둔다. 홈에서는 퀘스트 카드의 Day 번호다.

**The Section Title Rule.** 홈의 구역 제목("다른 월드", "막혔을 때")은 모두 Title small(20px, 800)로 같게 쓴다. 카드 안의 작은 머리말("오늘의 퀘스트", "레벨")만 Label이다.

## Layout

### 셸
- 상단 바: 높이 `--topbar-h`(56px), `position: sticky`, `z-index: var(--z-sticky-nav)`, 카드 바탕, 아래 1px `rule` 선. 왼쪽 메뉴 버튼(1024px 미만), 워드마크(말 아이콘 + 이름, 17px 800), 오른쪽 검색 버튼(Ctrl K)과 테마 버튼.
- 사이드바: 1024px 이상에서 폭 `--sidebar-w`(280px)로 늘 보인다. 상단 바 아래에 붙어(`position: sticky`) 자기 영역만 스크롤한다. 오른쪽 1px `rule` 선. 1024px 미만에서는 같은 내용이 서랍(Drawer)으로 열린다.
- 본문: `container-type: inline-size`. 안쪽 여백 32·24·64px(위·좌우·아래), 640px 이하에서 16·16·48px.
- 홈 열: `max-width: var(--content-max)`(1120px), 가운데 정렬, 한 열 격자, 구역 사이 48px.
- 앵커 이동 시 상단 바에 가리지 않게 `scroll-padding-top: calc(var(--topbar-h) + var(--space-lg))`.
- 가로 넘침 금지: `html, body`에 `overflow-x: clip`. 360px에서 가로 스크롤 0.

### 홈 순서
저장 불가 알림(있을 때만) → 1행 퀘스트 카드 + 레벨 패널 → 월드맵 카드 → 다른 월드 → 막혔을 때.

### 간격 토큰 (4px 격자, 2px는 칸 안 미세 간격에만)

| 토큰 | 라이트 | 다크 |
|---|---|---|
| `--space-3xs` | `2px` | 같음 |
| `--space-2xs` | `4px` | 같음 |
| `--space-xs` | `8px` | 같음 |
| `--space-sm` | `12px` | 같음 |
| `--space-md` | `16px` | 같음 |
| `--space-lg` | `24px` | 같음 |
| `--space-xl` | `32px` | 같음 |
| `--space-2xl` | `48px` | 같음 |
| `--space-3xl` | `64px` | 같음 |

### 크기 토큰

| 토큰 | 라이트 | 다크 | 쓰는 곳 |
|---|---|---|---|
| `--topbar-h` | `56px` | 같음 | 상단 바, 서랍 머리 |
| `--sidebar-w` | `280px` | 같음 | 사이드바, 서랍 폭 상한 |
| `--content-max` | `1120px` | 같음 | 홈 열 최대 폭 |

### 브레이크포인트 (미디어 쿼리)

| 조건 | 바뀌는 것 |
|---|---|
| `(max-width: 40rem)` (640px) | 본문·퀘스트·월드맵 카드 여백을 줄인다. 검색 버튼이 아이콘만 남는다 |
| `(max-width: 22.5rem)` (360px) | 워드마크 15px |
| `(min-width: 64rem)` (1024px) | 사이드바 280px 열이 생기고 메뉴 버튼이 사라진다. 서랍이 열려 있으면 닫는다 |
| `(pointer: coarse)` | 사이드바 행 최소 높이 44px |
| `(hover: hover) and (pointer: fine)` | 툴팁(지도 폭 30rem 이상일 때), Tilt, Magnetic을 켠다 |
| `(prefers-reduced-motion: reduce)` | 모션 끔(Components의 Motion 참고) |
| `print` | 상단 바, 사이드바, 캐러셀 버튼, `dialog`를 숨긴다 |

### 컨테이너 쿼리

| 컨테이너 | 조건 | 바뀌는 것 |
|---|---|---|
| 본문 `.main` | `(min-width: 42rem)` | 1행이 `minmax(0, 2fr) minmax(0, 1fr)`(퀘스트 2/3, 레벨 1/3)로 나뉜다 |
| 본문 `.main` | `(max-width: 41.99rem)` | 레벨 통계 3개가 가로 3칸으로 놓이고 아이콘을 숨긴다 |
| 본문 `.main` | `(min-width: 30rem)` / `(min-width: 56rem)` | 막혔을 때 2칸 / 4칸 |
| 퀘스트 카드 | `(min-width: 32rem)` | 큰 번호 열과 내용 열 2단(사이 32px), 번호 위에 "Day" 라벨이 올라간다 |
| 지도 `.trail-wrap` | `(min-width: 30rem)` / `(min-width: 47.5rem)` | 지도 배치 s → m → l |
| 다른 월드 `others` | `others (min-width: 30rem)` | 캐러셀에 카드 2장씩 |
| 다른 월드 `others` | `others (min-width: 47.5rem)` | 4칸 격자, 카드 줄을 subgrid로 맞춘다. 캐러셀 버튼 숨김 |

### Named Rules
**The Fluid Rule (반응형).** 모든 화면은 한 마크업으로 320px부터 넓은 화면까지 맞춘다. 폭은 고정 px 대신 `%`·`minmax()`·`max-width`·`min()`과 컨테이너 쿼리로 정하고, 바뀌는 지점은 위 브레이크포인트·컨테이너 쿼리 표의 값만 쓴다(새 지점이 필요하면 이 표를 먼저 고친다). 설계 기준 폭은 360px 이상이고, 320px(WCAG 2.2 1.4.10 Reflow, 1280px를 400% 확대한 폭)에서도 가로 스크롤 없이 정보와 기능이 모두 남는다. 표·코드·지도처럼 2차원 배치가 필요한 부분만 자기 상자 안에서 가로로 스크롤한다. 손가락 포인터(`pointer: coarse`)에서는 누르는 대상이 44px 이상이다. 새 화면은 375·768·1280 × 라이트·다크 시각 테스트와 320·375·768·1280 전 페이지 점검(`check:site`)을 통과해야 끝난다.

### 월드맵 배치
- Day 칸은 뱀 모양으로 줄을 바꿔 가며 놓는다(짝수 줄 왼→오, 홀수 줄 오→왼). 줄이 바뀌는 곳은 바깥으로 둥글게 도는 곡선(`bulge = a.c === 0 ? -42 : 42`, 칸 한 개 = viewBox 100).
- 배치 s(기본): 한 줄 5칸, 줄 높이 84px. 배치 m: 한 줄 10칸, 84px. 배치 l: `cols: (n) => Math.min(15, Math.ceil(n / 2))`, `rowH: 88`. 넓은 지도는 한 줄 최대 15칸이며 Day가 30개를 넘으면 3줄이 된다.
- 줄마다 가운데 칸 사이에 방향 화살표 하나(Components 참고).

### 다른 월드
- 좁은 화면: 가로 Scroll Snap 캐러셀(`scroll-snap-type: x mandatory`, 카드 폭 84%, `scroll-padding-inline: var(--space-2xs)`), 이전·다음 버튼과 ←→ 키. 스크롤바는 숨긴다.
- 넓은 화면(47.5rem 이상): 4칸 격자. 카드마다 `grid-row: span 5`와 `grid-template-rows: subgrid`로 제목·메타·설명·기술·발판 줄을 맞춘다.

## Elevation & Depth

흐림 그림자가 없다. 깊이는 **단색 바닥 턱** 하나로 낸다: 면 바로 아래에 흐림 0, 가로 이동 0인 같은 계열 단색 띠를 붙인다(`box-shadow: 0 <턱 높이> 0 <턱 색>`). 누를 수 있는 것은 누르면 턱만큼 내려가고 턱이 1px로 줄어든다. 메뉴·검색 모달·서랍에도 그림자가 없고 1px `rule` 테두리로 구분한다.

| 토큰 | 라이트 | 다크 | 쓰는 곳 |
|---|---|---|---|
| `--ledge` | `4px` | 같음 | 기본 바닥 턱 높이 |
| `--shadow-lift` | `0 4px 12px rgb(49 46 129 / 0.10)` | `0 4px 12px rgb(0 0 0 / 0.35)` | 정의만 있고 쓰지 않는다. 새 화면에서도 쓰지 않는다 |

### 바닥 턱 목록

| 대상 | 쉴 때 | hover | 누를 때 |
|---|---|---|---|
| 카드 `.card` | `box-shadow: 0 var(--ledge) 0 var(--color-rule)` | 없음 | 없음 |
| 퀘스트 카드 | `box-shadow: 0 calc(var(--ledge) + 2px) 0 var(--color-edge)` (6px) | 없음(Tilt) | 없음 |
| 주 버튼 | `box-shadow: 0 var(--ledge) 0 var(--color-accent-deep)` | `transform: translateY(-2px)`, `box-shadow: 0 calc(var(--ledge) + 2px) 0 var(--color-accent-deep)` | `transform: translateY(calc(var(--ledge) - 1px))`, 턱 1px |
| 남은 칸·완료 칸 | `box-shadow: 0 3px 0 var(--tile-edge)` | `transform: translateY(-3px)`, `box-shadow: 0 6px 0 var(--tile-edge)` | `transform: translateY(2px)`, `box-shadow: 0 1px 0 var(--tile-edge)` |
| 오늘 칸 | `box-shadow: 0 var(--ledge) 0 var(--tile-edge)` | 위와 같음 | 위와 같음 |
| 오늘 칸(퀘스트 카드와 연결) | `transform: translateY(-4px)`, `box-shadow: 0 calc(var(--ledge) + 4px) 0 var(--tile-edge)` | | |
| LV 배지 | `box-shadow: 0 var(--ledge) 0 var(--color-edge)` | | |
| 막혔을 때 칸 | `box-shadow: 0 var(--ledge) 0 var(--color-rule)` | 제목 밑줄만 | `transform: translateY(calc(var(--ledge) - 1px))`, `box-shadow: 0 1px 0 var(--color-rule)` |
| 사이드바 오늘 번호 | `box-shadow: 0 2px 0 var(--color-accent-deep)` | | |

- 턱이 레이아웃을 밀지 않도록 주 버튼은 `margin-bottom: var(--ledge)`로 자리를 미리 잡는다.
- 누름은 `transition-duration: 60ms`로 빠르게, 떠오름은 200ms `--ease-bounce`로 살짝 튄다.
- 잠긴 월드 카드와 준비 중 칸은 턱이 없다(`box-shadow: none`). 떠 있지 않다는 것이 "아직 못 누른다"는 뜻이다.

### 쌓임 순서 (z-index)

| 토큰 | 라이트 | 다크 | 쓰는 곳 |
|---|---|---|---|
| `--z-raised` | `10` | 같음 | 월드 카드 전체 클릭 영역, 축하 조각 |
| `--z-dropdown` | `100` | 같음 | 테마 메뉴 |
| `--z-sticky` | `200` | 같음 | 예약(홈에서 안 씀) |
| `--z-sticky-nav` | `300` | 같음 | 상단 바 |
| `--z-modal` | `400` | 같음 | 예약. 서랍·검색은 `<dialog>` top layer라 z-index가 필요 없다 |
| `--z-tooltip` | `600` | 같음 | 툴팁, 툴팁을 띄운 노드, 건너뛰기 링크 |

### Named Rules
**The Solid Ledge Rule.** 깊이는 흐림 0의 단색 바닥 턱으로만 낸다. 턱 색은 그 면의 테두리 색이거나 같은 색 계열의 더 짙은 색이다. 흐림 그림자(`--shadow-lift` 포함)는 쓰지 않는다.

**The Press Rule.** 누를 수 있는 면은 누르면 턱 높이에서 1px을 뺀 만큼 내려가고 턱은 1px만 남는다.

## Shapes

| 토큰 | 라이트 | 다크 | 쓰는 곳 |
|---|---|---|---|
| `--radius-btn` | `6px` | 같음 | 버튼, 보드게임 칸, LV 배지, 월드 문장 칸, 칩, 사이드바 행, 메뉴 항목, 검색 결과, 툴팁, XP 막대 겉 |
| `--radius-card` | `12px` | 같음 | 카드, 알림 상자, 막혔을 때 칸, 메뉴, 검색 모달, 칸의 넓힌 클릭 영역 |
| `--radius-pill` | `999px` | 같음 | 정의만 있고 쓰지 않는다(알약 모양은 없다) |

- 그 밖의 모서리: XP 막대 안쪽 칸 영역 `--space-3xs`(2px), `kbd`와 월드 링크 `--space-2xs`(4px), 범례 칸 4px.
- 테두리: 카드·칸·배지·XP 막대는 2px, 상단 바·사이드바·서랍·검색·메뉴·구분선은 1px. 알림 상자는 1px `ink-2`.
- 점선(`dashed`)은 "아직"의 모양이다: 잠긴 월드 카드와 그 문장 칸, 준비 중 칸, 범례의 준비 중.
- 도트 그림은 8칸 격자의 정사각 픽셀이고 `shape-rendering="crispEdges"`로 모서리를 또렷하게 그린다.

## Components

### Buttons
- **Primary(주 버튼):** 분홍 면, 흰(다크는 밤색) 글자 17px 800, `min-height: 48px`, 좌우 24px, 모서리 6px, 분홍 턱 4px. 한 화면에 하나. 문구는 상태별: "이어서 하기", "첫 Day 시작하기", "다음 월드 시작하기", "Day n 복습하기", "졸업 로드맵 보기".
- **Hover / Active:** hover는 `accent-hover` 면과 2px 떠오름, 누르면 턱 안으로 내려간다(Elevation 표). 전환: 바탕 120ms `--ease-out`, 위치·턱 200ms `--ease-bounce`.
- **Magnetic:** 마우스가 버튼 둘레 32px 안에 오면 최대 6px 끌린다(`PULL = 6`, `REACH = 32`, `translate: var(--mx, 0px) var(--my, 0px)`). 주 버튼에만.
- **아이콘·도구 버튼:** 최소 40×40px, 투명 바탕, 1px 투명 테두리, 모서리 6px. hover `track`, active `rule`, 비활성은 투명도 0.4. 검색 버튼만 1px `rule` 테두리와 `ink-2` 글자, 640px 이하에서 아이콘만.
- **글자 링크(보조 행동):** 밑줄 있는 `ink` 글자 400, hover에서 `accent-text`. 예: "처음이면 시작하기부터", "월드 다시 보기".
- **글자 버튼:** `min-height: 32px`, 15px `ink-2` 밑줄, hover `ink`, 누르면 `accent-text`. 예: "모두 펼치기".

### Cards / Containers
- **기본 카드:** 바탕 `card`, 2px `rule` 테두리, 모서리 12px, `rule` 턱 4px.
- **퀘스트 카드:** 테두리와 턱이 `edge`(진한 남색), 턱 6px, 안쪽 32px(640px 이하 24·16px). 머리말 Label + 퀘스트(또는 트로피) 도트 아이콘, 오른쪽에 월드 링크. 몸통은 큰 Day 번호 | 제목·요약·사실 목록·버튼. 사실 목록(`dl`)은 예상 시간, 체크리스트(있을 때만), 보상(코인 아이콘 + "+분 XP"), 작업 폴더. 위에 1px `rule` 선. Tilt 2°.
- **레벨 패널:** 안쪽 24px, 세로 간격 16px. HUD → 통계 3행 → 격려 문구 한 줄(15px `ink-2`).
- **월드 카드:** 안쪽 24px, 세로 간격 12px. 월드 문장 칸 + 제목, 메타 Label(클리어하면 별), 결과물 설명(최대 4줄), 기술 칩(최대 4개 + "외 n개"), 발판(1px `rule` 위 선, 진도 또는 잠김 이유). 카드 전체가 하나의 클릭 영역(투명 레이어가 카드를 덮는다). hover: 제목 밑줄, 문장 칸 흔들림. 누름: 1px 내려감. Tilt 4°.
- **잠긴 월드 카드:** 점선 테두리, 턱 없음, 바탕 `paper`, 제목·설명 `ink-2`, 엠블럼은 `ink-2` 윤곽만. 누르면 카드가 흔들리고 발판 문장이 `ink` 800으로 강조되며 이유가 `role="status"`로 읽힌다.
- **막혔을 때 칸:** 안쪽 16px, 도트 아이콘 24px + 제목(15px 800, hover 밑줄) + 설명(15px `ink-2`). 2px `rule` 테두리와 턱.
- **알림 상자:** 1px `ink-2` 테두리, 모서리 12px, 15px, 줄간격 1.5, 선 아이콘 alert, `role="status"`. 저장소를 못 쓸 때 홈 맨 위에 한 줄.
- **설정 카드:** 기본 카드, 안쪽 `var(--space-lg)`(640px 이하 `var(--space-md)`), 카드 사이 `var(--space-lg)`. 제목 Title small, 설명 Body `ink-2`. 결과 문장(백업 불러오기)은 알림 상자 모양이고 종류별 색은 알림 상자 색이 정해질 때(M8) 입힌다.
- **상태 화면(404·잠김·오류):** 도트 아이콘 3배(404·오류 렌치, 잠김 자물쇠) → 제목 → lead → 주 버튼 하나 + 글자 링크. 셸(상단 바·사이드바)은 그대로 둔다.
- **준비 중 Day 칸:** 점선 2px `line`(404·잠김 화면과 같다), 턱 없음, 바탕 `paper`, 모서리 12px, 글자 `ink-2`. "이 Day는 아직 준비 중이에요." + 복습 글자 링크(앞 Day가 있을 때) 또는 "홈으로".
- **월드 페이지:** 빵부스러기 → 머리(월드 카드와 같은 40px 문장 칸 + 엠블럼 3배, 월드 태그 Label, 제목, lead, 설명 Body `ink-2`) → 결과물 카드(기본 카드, 안쪽 `var(--space-lg)`, 640px 이하 `var(--space-md)`, 세로 간격 `var(--space-sm)`: Label 머리 "끝나면 남는 결과물", 결과물 문장 Body `ink` 800, 기술 칩 전부, 사실 줄 작업 폴더·진도 `n / 전체 Day 완료`, 진도 막대) → 제목 "Day 목록" → Day 목록 카드(기본 카드, 안쪽 `var(--space-2xs)`). 주 버튼은 두지 않는다.
- **월드 페이지 Day 행:** `grid-template-columns: 28px minmax(0, 1fr) auto`, 최소 48px, 안쪽 `var(--space-sm)`, 모서리 6px, 행 사이 1px `rule` 선, hover `track`, 누름 `rule`. 번호는 사이드바 Day 행과 같다(오늘은 24px 분홍 네모, `aria-current="step"`. 오늘 Day가 다른 월드에 있으면 분홍이 없다). 가운데는 제목(15px 800)과 요약(15px `ink-2`). 오른쪽은 예상 시간 Label과 상태 표시(완료 초록 도트 체크와 제목 `ink-2`, 준비 중 Galmuri "준비 중"). 640px 이하에서 오른쪽 칸은 가운데 칸 아래로 내려간다.
- **진도 막대:** 높이 `var(--space-sm)`, 바탕 `track`, 모서리 `--radius-btn`, 채움 `progress`(완료 비율만). 폭은 움직이지 않는다.
- **부록 머리:** 빵부스러기 → 도움말 도트 그림 3배(막혔을 때 칸과 같은 그림) → 제목 → lead(`ink-2`, 페이지 설명). 그림이 없는 페이지는 그림 없이 같다.
- **목차 카드(용어 색인·문제 해결 목차):** 기본 카드, 안쪽 `var(--space-md)`, Label 머리. 색인·Day 링크 칸: 최소 40×40px(`pointer: coarse`에서 44px), 15px 800 `ink`, 모서리 6px, 1px `rule` 테두리, hover `track`, 칸 사이 `var(--space-2xs)`, 줄바꿈 허용.
- **용어 묶음:** 묶음 제목(Title small) 아래 용어 항목. 항목 사이 1px `rule` 선, 위아래 `var(--space-md)`.
- **찾아온 항목:** 주소로 찾아온 용어·증상은 `track` 바탕(사방 `var(--space-xs)` 같은 색 띠)으로 표시하고 2.4초 뒤 사라진다(분홍을 쓰지 않는다).

### Board Tiles (signature)
보드게임 칸. 둥근 네모(모서리 6px)에 2px 테두리와 같은 색 턱. 테두리·턱 색은 `--tile-edge` 하나로 묶는다.

| 상태 | 크기 | 면 / 글자 | 테두리·턱 (`--tile-edge`) | 얼굴 |
|---|---|---|---|---|
| 남음 | 34px | `card` / `ink-2` | `ink-2`, 턱 3px | Galmuri 12px 번호 |
| 완료 | 34px | `progress` / `progress-ink` | `progress-deep`, 턱 3px | 도트 체크 |
| 오늘 | 46px | `accent` / `accent-ink` | `accent-deep`, 턱 4px | Wanted Sans 800 17px 번호, 위에 말, 아래에 "오늘" Label(`accent-text`) |
| 준비 중 | 34px | 남음과 같음 | 점선, 턱 없음 | 번호 |
| 잠김 | 34px | 남음과 같음 | 남음과 같음 | 번호 |

- 배포 Day(제목에 "배포")는 깃발 도트 아이콘을 칸 윗면 오른쪽 바깥에 꽂는다(깃대 밑동이 테두리 바깥에 닿고 칸 안으로 들어오지 않는다).
- 클릭 영역은 칸보다 사방 6px 넓다(`inset: -6px`).
- 퀘스트 카드에 마우스나 포커스가 가면 오늘 칸이 4px 떠오르고 말이 계속 뛴다.
- **경로선:** 남은 길 `stroke: var(--color-line)`, `stroke-width: 4`, `stroke-dasharray: 4 6`. 완료 구간 `progress`, `stroke-width: 6`, `stroke-linecap: square`. 선 두께는 확대해도 같다(`non-scaling-stroke`).
- **방향 화살표:** 줄마다 가운데 두 칸 사이에 도트 화살표 하나. `card` 받침(2px 여백)에 얹는다. 남은 길은 `line`, 지나온 길은 `progress-deep`. 돌아오는 줄은 좌우를 뒤집는다.
- **범례:** 지금 지도에 실제로 있는 표시만 보여 준다(완료, 오늘=말, 남음, 준비 중=점선, 배포=깃발). 범례 칸은 16px, 모서리 4px.

### HUD (레벨 패널)
- **LV 배지:** 최소 폭 76px, 안쪽 8·12·4px, 2px `edge` 테두리, 모서리 6px, 바탕 `paper`, `edge` 턱 4px. 위에 Galmuri "LV"(12px `ink-2`), 아래 LV 숫자(HUD number).
- **XP 글자:** 코인 아이콘 + "n / 300 XP"(Label, `ink`). 그 아래 "LV n+1까지 N XP"(15px `ink-2`, 숫자만 `ink` 800).
- **XP 막대:** 배지와 글자 아래 전체 폭. 높이 24px, 2px `rule` 테두리, 모서리 6px, 바탕 `card`. 안쪽 4px 들여 2px 모서리 영역에 10칸을 그린다(`repeating-linear-gradient(90deg, var(--color-cell) 0 calc(10% - 3px), transparent calc(10% - 3px) 10%)`, 칸 사이 3px). 채운 칸은 같은 무늬를 `xp` 색으로 그리고 실제 비율만큼 잘라 보인다(`clip-path: inset(0 calc((1 - var(--p)) * 100%) 0 0)`). 칸 단위로 반올림하지 않는다. 칸 하나 = 30 XP.
- 막대는 `role="progressbar"`와 `aria-valuenow`·`aria-valuetext`를 갖고, 옆에 늘 숫자 글자가 있다.
- **통계:** 누적 XP(코인), 완료한 Day `n / 전체`(별), 지금 월드 `n / 전체`(월드 엠블럼). 행마다 1px `rule` 위 선. 패널이 퀘스트 카드 높이로 늘어나면 남는 높이를 세 행이 똑같이 나눈다(`grid-auto-rows: 1fr`).
- **XP 공식(규칙):** XP는 완료한 Day의 예상 시간(분) 합이다(`s + d.minutes`). 300 XP마다 1레벨(`LEVEL_XP = 300`). 레벨 = `Math.floor(xp / LEVEL_XP) + 1`, 이번 레벨 XP = `xp % LEVEL_XP`, 다음 레벨까지 = 300 − 이번 레벨 XP. 퀘스트 카드의 보상은 그 Day의 분 수를 그대로 "+n XP"로 적는다.

### Icons (두 체계)
**The Two Icon Rule.** 조작(메뉴, 검색, 닫기, 테마, 화살표, 펼침, 경고, 메뉴 체크)은 **선 아이콘**, 게임 물건과 내용 표시(완료, 별, 코인, 말, 깃발, 자물쇠, 퀘스트, 트로피, 월드 엠블럼, 도움말 그림, 방향 화살표)는 **도트 아이콘**이다. 둘을 섞지 않는다. 모든 아이콘은 장식이며 `aria-hidden="true"`이고 뜻은 글자가 맡는다.

- **선 아이콘:** 16×16 viewBox, 선 1.75, 둥근 끝과 이음, `currentColor`, 16px. 경로 원문:

```js
  check: '<path d="M3.5 8.5l3 3 6-7"/>',
  search: '<circle cx="7" cy="7" r="4.25"/><path d="M10.25 10.25L13.5 13.5"/>',
  menu: '<path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11"/>',
  close: '<path d="M4 4l8 8M12 4l-8 8"/>',
  sun: '<circle cx="8" cy="8" r="2.75"/><path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1.06 1.06M11.54 11.54l1.06 1.06M3.4 12.6l1.06-1.06M11.54 4.46l1.06-1.06"/>',
  moon: '<path d="M13 9.5A5.5 5.5 0 016.5 3a5.5 5.5 0 106.5 6.5z"/>',
  monitor: '<rect x="1.75" y="2.5" width="12.5" height="8.5" rx="1.25"/><path d="M5.5 14h5M8 11v3"/>',
  left: '<path d="M10 3.5L5.5 8l4.5 4.5"/>',
  right: '<path d="M6 3.5L10.5 8 6 12.5"/>',
  chevron: '<path d="M4 6l4 4 4-4"/>',
  alert: '<path d="M8 2l6.25 11H1.75z"/><path d="M8 6.5v3M8 11.5v.01"/>',
```

- **도트 아이콘:** 격자 문자열로 정의한다. `#` 윤곽(`--px-1`, 기본 `currentColor`), `o` 채움(`--px-2`, 기본 투명), `h` 반짝임(`--px-3`, 기본은 `--px-2`), `.` 빈칸. 같은 문자끼리 path 하나로 합치고 `shape-rendering="crispEdges"`로 그린다. 크기는 격자 한 칸 = 정수 px만 쓴다(기본 2배: 8칸 → 16px, 엠블럼·말·도움말 3배: 24px, 범례 1배: 8px). 격자 원문:

```js
  check: ['........', '.......#', '......##', '#....##.', '##..##..', '.####...', '..##....', '........'],
  star: ['...##...', '...##...', '########', '.######.', '..####..', '.##..##.', '##....##', '........'],
  coin: ['..####..', '.#oooo#.', '#ohoooo#', '#ohoooo#', '#ohoooo#', '#oooooo#', '.#oooo#.', '..####..'],
  pawn: ['..####..', '.#hooo#.', '.#oooo#.', '..#oo#..', '..#oo#..', '.#oooo#.', '#oooooo#', '########'],
  flag: ['.##.....', '.#ooooo.', '.#oooooo', '.#ooooo.', '.#......', '.#......', '.#......', '###.....'],
  lock: ['..####..', '.#....#.', '.#....#.', '########', '#oooooo#', '#oo##oo#', '#oooooo#', '########'],
  quest: ['.##.', '#oo#', '#oo#', '#oo#', '.##.', '....', '.##.', '#oo#', '.##.'],
  house: ['...##...', '..#oo#..', '.#oooo#.', '#oooooo#', '.#o##o#.', '.#o##o#.', '.#o##o#.', '.######.'],
  tv: ['..#..#..', '...##...', '########', '#oooooo#', '#ohoooo#', '#oooooo#', '########', '.#....#.'],
  pad: ['........', '.######.', '#oo#ooo#', '#o###oh#', '#oo#oho#', '#oooooo#', '.##..##.', '........'],
  gift: ['.##..##.', '...##...', '########', '#oo##oo#', '########', '.#o##o#.', '.#o##o#.', '.######.'],
  trophy: ['.######.', '##hooo##', '#.#oo#.#', '.##oo##.', '...##...', '...##...', '..####..', '.######.'],
  ladder: ['.#....#.', '.######.', '.#....#.', '.#....#.', '.######.', '.#....#.', '.#....#.', '.######.'],
  wrench: ['.....#.#', '.....###', '....###.', '...###..', '..###...', '.###....', '###.....', '.#......'],
  words: ['.######.', '#oooooo#', '#o##o#o#', '#oooooo#', '#o###oo#', '.######.', '..##....', '.#......'],
  book: ['........', '###..###', '#oo##oo#', '#oo##oo#', '#oo##oo#', '#oo##oo#', '########', '........'],
  arrow: ['##...', '.##..', '..##.', '...##', '..##.', '.##..', '##...'],
```

- **도트 색 배정:**

| 아이콘 | `--px-1` 윤곽 | `--px-2` 채움 | `--px-3` 반짝임 |
|---|---|---|---|
| 코인·트로피·퀘스트 | `coin-deep` | `coin` | `coin-hi` |
| 별 | `star` | — | — |
| 말 | `ink` | `accent` | `accent-hover` |
| 깃발 | `ink` | `coin` | — |
| 월드 엠블럼 | `ink` | `coin` | `coin-hi` |
| 잠긴 월드 엠블럼 | `ink-2` | 투명 | 투명 |
| 도움말 그림 | `ink` | `cell` | — |
| 방향 화살표 | `line`(지난 길 `progress-deep`) | — | — |
| 체크·자물쇠 | `currentColor` | — | — |

- 월드 엠블럼: P1 house, P2 tv, P3 pad, SP gift, 졸업 trophy. 엠블럼은 2px `rule` 테두리, 모서리 6px, 바탕 `paper`인 40px 문장 칸 안에 24px로 둔다. 도움말 그림: 탈출 가이드 ladder, 문제 해결 wrench, 용어 사전 words, 시작하기 book.

### Navigation
- **사이드바:** 머리에 "홈" 링크, "월드" Dropdown 버튼(글자 버튼 + 선 꺾쇠), "모두 펼치기" 글자 버튼(모두 펼쳐져 있으면 "모두 접기"). 월드마다 `<details>` Accordion(지금 월드만 펼침, 사용자가 접고 편 것은 진도가 바뀌어도 유지). 요약 줄은 최소 52px: 월드 태그(Label, "월드 n" 또는 "특별 월드"), 이름(15px 800), 진도 `n / 전체` 또는 자물쇠, 펼침 꺾쇠(열리면 180° 회전). 잠긴 월드는 "무엇을 끝내면 열리는지" 한 줄. 월드 목록 아래에 Label 머리 "부록"과 부록 행(Day 행과 같은 모양, 번호 칸 없음, 잠기면 자물쇠).
- **월드 Dropdown:** 테마 Dropdown과 같은 메뉴 모양과 키보드(메뉴 버튼 패턴, 항목은 `menuitem` 링크). 폭은 내용만큼, 최대 `calc(var(--sidebar-w) - var(--space-lg))`. 항목 40px 이상: 월드 태그(Label) | 이름(15px) | 진도 `n / 전체` 또는 자물쇠. 지금 화면이 속한 월드는 800과 선 체크(`accent-text`). 고르면 그 월드 페이지로 간다. 잠긴 월드는 `ink-2`이고, 누르면 이동하지 않고 항목이 흔들리며 이유가 토스트로 나온다.
- **Day 행:** `grid-template-columns: 28px minmax(0, 1fr) auto`, 최소 36px(터치 44px), 15px, 모서리 6px, hover `track`, 누름 `rule`. 번호는 Galmuri 12px `ink-2` 고정폭. 완료: 초록 도트 체크, 제목 `ink-2`. 오늘: 800, 번호를 24px 분홍 네모(턱 2px)에 넣고 `aria-current="step"`. 잠김: 링크 없음, `ink-2`, 자물쇠. 준비 중: Galmuri "준비 중". 지금 보고 있는 화면의 행은 `track` 바탕과 `aria-current="page"`(오늘 행이 지금 화면이면 `page`가 우선하고 분홍 네모는 그대로). 잠긴 행은 `<button>`이고 누르면 행이 흔들리며 이유가 토스트로 나온다.
- **서랍(Drawer):** `<dialog>`를 `showModal()`로 연다. 왼쪽에 붙고 높이 100dvh, 폭 `min(var(--sidebar-w), calc(100% - var(--space-2xl)))`, 오른쪽 1px `rule`, 백드롭 `scrim`. 머리 56px(제목 17px 800 + 닫기). 열면 오늘 Day로 포커스·스크롤하고 월드 요약 줄이 stagger로 나타난다. 닫힘: ESC, 백드롭 클릭(`closedby="any"`, 미지원 브라우저는 백드롭 클릭 좌표 감지로 대신), 닫기 버튼, 안의 링크 클릭, 창이 1024px 이상이 될 때. 닫히면 연 버튼으로 포커스가 돌아간다. 열려 있는 동안 문서 스크롤을 잠근다(`:root:has(.drawer[open]) { overflow: hidden; }`). 사이드바와 서랍은 같은 목록 한 벌을 옮겨 쓴다.
- **테마 Dropdown:** 메뉴 버튼 패턴(`menuitemradio` 3개: 시스템·라이트·다크). 메뉴는 최소 160px, 안쪽 4px, `card` 바탕, 1px `rule`, 모서리 12px, 그림자 없음. 항목 40px, 15px, 모서리 6px, hover·포커스 `track`, 고른 항목은 800과 선 체크(`accent-text`). ↓·↑로 열기, 화살표 순환, Home·End, ESC·Tab·바깥 클릭으로 닫기, Enter 적용 뒤 버튼으로 포커스 복귀. 고른 테마는 저장한다.
- **검색 Modal:** `<dialog>`, `margin: 10dvh auto auto`, 폭 `min(40rem, calc(100% - var(--space-xl)))`, 최대 높이 76dvh, 1px `rule`, 모서리 12px, 그림자 없음. 입력 줄: 선 검색 아이콘, 40px 높이 17px 입력칸(외곽선 없음), 포커스는 입력 줄 밑의 `box-shadow: inset 0 -2px 0 var(--color-focus)`. 결과 행: 최소 48px, 모서리 6px, 위치(Label) | 제목(15px 800) + 이유(15px `ink-2`, 한 줄 말줄임) | 태그(Label). 고른 행은 `track` 바탕과 `box-shadow: inset 2px 0 0 var(--color-accent)`. 일치 글자는 바탕 없이 분홍 2px 밑줄. 아래에 `kbd` 안내(↑ ↓ 고르기, Enter 열기, Esc 닫기). Ctrl+K로 열고, 빈 검색어에는 바로 가기(오늘의 퀘스트 + 부록), ESC 한 번에 닫힌다. combobox + listbox, `aria-activedescendant`. 위치 칸은 최소 72px이다. 잠긴 결과는 이유 자리에 여는 조건 문장을 두고 태그를 "잠김"으로 한다. 본문 조각은 보이지 않는다. 결과가 없으면 목록 자리에 "‘검색어’에 맞는 내용이 없어요. 다른 낱말로 찾아보세요."(15px `ink-2`)가 나온다. 검색 페이지(`#/search`)도 같은 입력 줄과 결과 행을 카드 안에 쓴다(행은 링크).
- **확인 Modal:** 되돌릴 수 없는 일(진도 복원 덮어쓰기, 진도 초기화) 앞에서만 쓴다. `<dialog role="alertdialog">`를 `showModal()`로 연다. 가운데(`margin: auto`), 폭 `min(28rem, calc(100% - var(--space-xl)))`, 안쪽 `var(--space-lg)`(640px 이하 `var(--space-md)`), `card` 바탕, 1px `rule`, 모서리 12px, 그림자 없음, 백드롭 `scrim`. 제목 Title small(800, `--text-h3`), 설명 Body(`ink-2`). 버튼 줄은 오른쪽 정렬·`var(--space-sm)` 간격·줄바꿈 허용: "취소"(`btn`) | 확인(복원은 주 버튼, 초기화는 위험 버튼). 처음 포커스는 "취소". ESC·바깥 클릭·"취소"는 모두 취소이고 아무것도 바뀌지 않는다. 열림·닫힘 모션은 검색 Modal과 같다. 닫히면 연 버튼으로 포커스가 돌아간다. 열려 있는 동안 Ctrl+K는 듣지 않고, 화면이 바뀌면 취소로 바로 닫힌다.
- **푸터:** 본문 아래 전체 폭. 위 1px `rule`, 바탕 `card`, 안쪽 24px(640px 이하 16px), 턱 없음. 말 도트 아이콘 + 사이트 이름(15px 800 `ink`), 글자 링크 줄(시작하기, 막혔을 때, 설정 · 진도 백업), Label 한 줄(글꼴 라이선스). 작성·빌드 날짜는 두지 않는다. 짧은 화면에서도 화면 바닥에 붙는다. 인쇄에서는 숨긴다.

### Skeleton
- 늦게 준비되는 곳(검색 결과의 첫 계산, 3D 그림)에만 쓴다. 시작 후 200ms 안에 준비되면 보이지 않고, 한 번 보이면 최소 300ms 보인다.
- 실제 내용과 같은 크기의 자리표시다. 검색은 48px 행 3개이고, 각 행에 `track` 바 2개(위치 72px, 제목 60%)를 둔다. 바의 높이는 `--text-label`, 모서리는 `--radius-btn`이다.
- 투명도 1 → 0.5 → 1을 `--dur-skeleton`으로 반복한다(동작 줄이기면 정지). 기다리는 목록에 `aria-busy="true"`를 두고, 자리표시는 `aria-hidden`이다.

### Tooltip
- 지도 칸에만 있고 `(hover: hover) and (pointer: fine)`이면서 지도 폭이 30rem 이상(배치 m·l)일 때만 보인다. 터치와 좁은 지도(배치 s, 한 줄 툴팁이 카드 밖으로 잘린다)에서는 없다(칸의 `aria-label`이 같은 내용을 갖고, 툴팁은 `aria-hidden`).
- 칸 위 `bottom: calc(100% + var(--space-xs))`, 오늘 칸은 말을 피해 `bottom: calc(100% + var(--space-2xl))`. 칸이 줄의 왼쪽 절반이면 왼쪽, 오른쪽 절반이면 오른쪽 가장자리에 맞춘다(-8px).
- `ink` 바탕, `paper` 글자 15px 800 줄간격 1.4, 안쪽 4·12px, 모서리 6px, 한 줄.
- 나타남: 마우스는 800ms 기다린 뒤 200ms 페이드(`transition: opacity var(--dur-short) var(--ease-out) 800ms, visibility 0s linear 800ms`), 키보드 포커스는 바로. 사라짐 120ms.
- **The Tooltip Raise Rule.** 칸(`.node`)의 `transform`이 쌓임 맥락을 만들어 툴팁의 z-index가 칸 안에 갇힌다. 그래서 툴팁을 띄운 칸 자체를 앞으로 올린다: `.node:hover, .node:focus-within { z-index: var(--z-tooltip); }`. transform이 걸린 부모 안에 툴팁·팝오버를 넣을 때는 늘 이 규칙을 같이 둔다.

### Forms
- **라디오:** 브라우저 기본 모양 대신 `appearance: none`. 1.15em 원, 2px `ink-2` 테두리(경계 대비 3:1), `card` 바탕. hover 테두리 `ink`. 고르면 테두리와 가운데 점이 `accent-text`.
- **체크박스:** 브라우저 기본 모양에 `accent-color: var(--color-accent-text)`.
- 고른 상태의 분홍은 테마 메뉴의 선 체크와 같은 `accent-text`다(분홍 면이 아니므로 One Pink Rule과 겹치지 않는다).

### Chips
- 기술 칩: `track` 바탕, 모서리 6px, 안쪽 2·8px, 15px, 줄간격 1.5. 최대 4개, 넘으면 바탕 없는 `ink-2` "외 n개".

### Motion
| 토큰 | 라이트 | 다크 | 쓰는 곳 |
|---|---|---|---|
| `--dur-micro` | `120ms` | 같음 | 바탕·색 전환, 테마 아이콘 바뀜, 툴팁 사라짐 |
| `--dur-short` | `200ms` | 같음 | 떠오름·턱, 메뉴 열림, 꺾쇠 회전, Tilt 복귀, 툴팁 나타남 |
| `--dur-enter` | `280ms` | 같음 | 서랍·검색 들어옴, 백드롭 |
| `--dur-exit` | `180ms` | 같음 | 서랍·검색 나감 |
| `--dur-celebrate` | `600ms` | 같음 | XP 채움 시간과 같은 값(JS는 600을 직접 쓴다) |
| `--dur-skeleton` | `1200ms` | 같음 | Skeleton 반복 |
| `--ease-out` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | 같음 | 들어옴·기본 |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | 같음 | 나감 |
| `--ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 같음 | 주 버튼·보드게임 칸·막혔을 때 칸의 떠오름과 턱, 월드 문장 흔들림 |

| 기법 | 자리 | 값 |
|---|---|---|
| 누름 | 주 버튼, 칸, 막혔을 때 칸 | `transition-duration: 60ms` |
| Stagger | 홈 구역(`data-reveal`) 첫 표시, 서랍 월드 요약 줄 | 아래 8px에서 올라오며 투명도 0→1, `duration: 280`, `delay: i * 40`, 최대 8개(`els.slice(0, 8)`), `--ease-out` |
| XP 채움 | XP 막대 | 왼쪽 끝에서 실제 비율까지 `clip-path`, `duration: 600, delay: 240`. 이번 레벨 XP가 0이면 생략 |
| Path Drawing | 완료 경로선 | `stroke-dashoffset` 1→0, `duration: 900, delay: 200`, 지도가 40% 보일 때(`threshold: 0.4`) |
| 말 점프 | 오늘 칸의 말 | 첫 표시 때 8px 3번(`duration: 480, delay: 700, iterations: 3`). 퀘스트 카드와 연결된 동안은 `animation: hop 520ms var(--ease-out) infinite`, 7px |
| 축하 조각 | 월드 클리어·모두 클리어 상태의 큰 Day 번호 | 8px 도트 조각 18개, 색 `accent`·`progress`·`coin`·`edge` 순환, 위로 부채꼴로 튀었다 떨어지며 사라짐. `duration: 1100, delay: 500 + (i % 6) * 30`, `easing: 'cubic-bezier(0.2, 0.7, 0.4, 1)'` |
| Tilt | 퀘스트 카드 2°(`tilt(el, 2)`), 월드 카드 4°(`tilt(el, 4)`) | `perspective(1000px)`, 마우스·정밀 포인터만, 나가면 200ms로 복귀 |
| Magnetic | 주 버튼 | 최대 6px(Buttons 참고) |
| Shake | 잠긴 월드 카드 | 300ms, 좌우 4px(`transform: translateX(-4px)` ↔ 4px, 네 번). 이유 문장을 반드시 같이 보여 준다 |
| Wiggle | 월드 카드 hover 때 문장 칸 | 420ms `--ease-bounce`, `transform: rotate(-8deg) scale(1.08)` → `transform: rotate(6deg) scale(1.08)` |
| Accordion | 사용자가 연 월드의 내용 | 160ms, `transform: translateY(4px)`에서 투명도와 함께. 페이지를 열 때 이미 펼쳐진 월드는 움직이지 않는다 |
| 메뉴 | 테마 메뉴 열림 | `pop-in`(`from { opacity: 0; transform: translateY(-4px) scale(0.98); }`) 200ms |
| 검색 | 열림 / 닫힘 | `pop-in` 280ms / 페이드 180ms. 닫힘 애니메이션이 끝나지 않으면 `setTimeout(done, 260)`으로 닫는다 |
| Skeleton | 검색 결과 자리 | 200ms 뒤에 보임, 최소 300ms, 투명도 1 → 0.5 → 1 `var(--dur-skeleton) ease-in-out infinite` |
| 서랍 | 열림 / 닫힘 | `transform: translateX(-100%)`에서 280ms `--ease-out` / 180ms `--ease-in`, 백드롭은 투명도만 |
| 테마 아이콘 | 테마 바꿈 | 120ms `transform: rotate(-45deg) scale(0.6)`로 사라졌다가 새 아이콘 |

- **한 번만:** Stagger, XP 채움, Path Drawing, 첫 말 점프, 축하 조각은 세션에서 처음 볼 때 한 번만 돈다(시안은 상태별 `sessionStorage` 키). 다시 열면 최종 상태로 보인다.
- **움직이는 속성:** `transform`, `translate`, `opacity`, `box-shadow`(턱), `clip-path`(XP), `stroke-dashoffset`(경로), 색. 레이아웃 속성(폭·높이·위치)은 움직이지 않는다.
- **동작 줄이기:** `(prefers-reduced-motion: reduce)`이면 모든 애니메이션과 전환을 사실상 0으로 만든다(`animation-duration: 0.01ms !important`, 반복 1회, `transition-delay: 0s !important`, `scroll-behavior: auto !important`). 주 버튼의 끌림과 hover 떠오름, 칸의 hover·연결 떠오름, Tilt를 없애고 축하 조각을 숨긴다. JS도 Stagger·XP 채움·Path Drawing·말 점프·축하·Tilt·Magnetic·Shake를 건너뛰고 서랍·검색은 바로 닫는다. 정보와 기능은 하나도 빠지지 않는다(Shake 대신 이유 문장 강조와 알림은 그대로).

### Accessibility
- **포커스:** `:focus-visible`에만 `outline: 2px solid var(--color-focus)`, `outline-offset: 2px`. 메뉴 항목과 월드 캐러셀처럼 잘리는 곳은 `outline-offset: -2px`. 검색 입력은 입력 줄 밑 2px 선. 월드 카드는 안의 클릭 레이어가 포커스를 받으면 카드 전체에 링을 그린다(`:has(.card-hit:focus-visible)`).
- **건너뛰기 링크:** "본문으로 건너뛰기"가 포커스를 받을 때만 내려온다.
- **대상 크기:** 주 버튼 48px, 아이콘 버튼 40px, 사이드바 행 36px(터치 44px), 칸 클릭 영역 46px(34px + 사방 6px), 오늘 칸 58px.
- **이름과 상태:** 지도 칸은 `aria-label="Day n 제목, 상태[, 배포 Day]"`, 오늘은 `aria-current="step"`. 사이드바 상태는 `visually-hidden` 글자. 진도는 `role="progressbar"`. 테마 변경, 잠김 이유, 검색 선택은 `role="status"`로 알린다.
- **키보드:** 서랍과 검색은 `showModal`로 바깥을 inert로 만들고 포커스를 가둔다. 캐러셀은 ←→, 검색은 ↑↓ Enter Esc, 메뉴는 화살표·Home·End·Esc. 확인 Modal도 `showModal`로 포커스를 가두고 처음 포커스는 취소다.
- **JS 없이:** 빌드가 기본 상태를 미리 그려 둔다. 숨긴 채 시작하는 상태를 CSS로 만들지 않는다.

## Do's and Don'ts

### Do:
- **Do** 모든 색을 이 문서의 토큰 이름으로 쓰고, 라이트·다크 값을 같은 이름으로 짝지어 둔다.
- **Do** 새 색 조합을 넣으면 글자 4.5:1, 비문자 3:1을 재고 대비 표에 적는다.
- **Do** 누를 수 있는 면에는 단색 바닥 턱과 누름(턱 −1px, 60ms)을 함께 준다.
- **Do** 분홍 글자는 `accent-text`로 쓴다.
- **Do** 게임 물건은 도트 아이콘, 조작은 선 아이콘으로 그린다. 도트는 정수배로만 키운다.
- **Do** transform이 걸린 요소 안의 툴팁·팝오버에는 Tooltip Raise Rule을 같이 둔다.
- **Do** 모든 모션에 동작 줄이기 대체(최종 상태 바로 보기)를 둔다. 보상 연출은 세션에 한 번만.
- **Do** 게임 어휘(퀘스트, 월드, LV, XP, 클리어, 보상)는 화면 라벨과 진행 표시에만 쓴다.

### Don't:
- **Don't** 흐림 그림자를 쓰지 않는다(`--shadow-lift` 포함). 깊이는 바닥 턱으로만.
- **Don't** 분홍을 장식·배경·제목 색으로 쓰지 않는다. 주 버튼을 한 화면에 두 개 두지 않는다.
- **Don't** 금색(`coin`)을 글자·버튼·배경에 쓰지 않는다.
- **Don't** 완료하지 않은 것을 초록으로 칠하지 않는다.
- **Don't** XP 막대를 알약 모양으로 만들지 않는다(`--radius-pill`은 쓰지 않는다).
- **Don't** Galmuri11을 본문·제목·버튼 문장·큰 숫자에 쓰지 않는다. Display 크기를 한 화면에 두 번 쓰지 않는다.
- **Don't** 지어낸 수치(연속 학습일, 순위, 학습자 수, 후기)를 넣지 않는다.
- **Don't** Day 제목·요약·본문 어휘를 게임 말로 바꾸지 않는다.
- **Don't** 외부 글꼴·CDN·외부 이미지를 불러오지 않는다(외부 요청 0).
- **Don't** 화면과 저장소 산출물에 만든 사람의 실명·이메일·계정 같은 개인정보를 넣지 않는다.

## 아직 정하지 않은 것
- North Star 이름("공부 퀘스트 보드")은 제안이다.
- Day 본문(긴 글) 줄간격: 홈 Body는 1.65, 현재 Day 본문은 1.75.
- 알림 상자 종류별 색(팁·경고·정보·경로·성공), 코드 블록과 구문 강조 색, 위험(danger) 색. 홈 시안에 없다.
- 업적 토스트, 레벨업 Modal, Day 페이지 부품(읽기 위치 바, 퀘스트 로그 등)의 모양. 홈 시안에 없다.

## 부록: 토큰 원문 (CSS)

위 표와 같은 값이다. 새 화면은 이 블록을 그대로 복사해 시작한다.

```css
:root {
  color-scheme: light;
  --color-paper: #EEF2FF;
  --color-card: #FFFFFF;
  --color-ink: #312E81;
  --color-ink-2: #475569;
  --color-accent: #DB2777;
  --color-accent-hover: #BE185D;
  --color-accent-ink: #FFFFFF;
  --color-accent-text: #BE185D;
  --color-focus: #DB2777;
  --color-progress: #16A34A;
  --color-progress-ink: #FFFFFF;
  --color-track: #F1F5F9;
  --color-rule: #D8DDF4;
  --color-line: #7A83BC;
  --color-scrim: rgb(49 46 129 / 0.34);
  --shadow-lift: 0 4px 12px rgb(49 46 129 / 0.10);
  /* bolder 회차: 보드게임 칸·버튼의 바닥 턱, 보상(코인·별) 색. 규칙 변경 제안은 REPORT.md */
  --color-edge: #312E81;
  --color-accent-deep: #9D174D;
  --color-progress-deep: #15803D;
  --color-cell: #D8DDF4;
  --color-xp: #15803D;
  --color-coin: #F59E0B;
  --color-coin-deep: #B45309;
  --color-coin-hi: #FEF3C7;
  --color-star: #B45309;
  --ledge: 4px;

  --font-body: "WZH Wanted Sans", "Malgun Gothic", system-ui, sans-serif;
  --font-label: "WZH Galmuri11", "WZH Wanted Sans", "Malgun Gothic", sans-serif;
  --font-code: "WZH Code", Consolas, monospace;

  --text-display: 80px;
  --text-headline: 38px;
  --text-h2: 26px;
  --text-h3: 20px;
  --text-body: 17px;
  --text-ui: 15px;
  --text-code: 14px;
  --text-label: 12px;

  --space-3xs: 2px; --space-2xs: 4px; --space-xs: 8px; --space-sm: 12px; --space-md: 16px;
  --space-lg: 24px; --space-xl: 32px; --space-2xl: 48px; --space-3xl: 64px;

  --radius-btn: 6px;
  --radius-card: 12px;
  --radius-pill: 999px;

  --topbar-h: 56px;
  --sidebar-w: 280px;
  --content-max: 1120px;

  --dur-micro: 120ms;
  --dur-short: 200ms;
  --dur-enter: 280ms;
  --dur-exit: 180ms;
  --dur-celebrate: 600ms;
  --dur-skeleton: 1200ms;
  --ease-out: cubic-bezier(0.2, 0.8, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

  --z-raised: 10; --z-dropdown: 100; --z-sticky: 200; --z-sticky-nav: 300; --z-modal: 400; --z-tooltip: 600;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;
    --color-paper: #0D0F1F;
    --color-card: #151833;
    --color-ink: #EEF2FF;
    --color-ink-2: #A3A9C9;
    --color-accent: #F472B6;
    --color-accent-hover: #F9A8D4;
    --color-accent-ink: #0D0F1F;
    --color-accent-text: #F472B6;
    --color-focus: #F472B6;
    --color-progress: #4ADE80;
    --color-progress-ink: #0D0F1F;
    --color-track: #2A2F55;
    --color-rule: #2A2F55;
    --color-line: #5A62A0;
    --color-scrim: rgb(5 6 15 / 0.62);
    --shadow-lift: 0 4px 12px rgb(0 0 0 / 0.35);
    --color-edge: #5A62A0;
    --color-accent-deep: #BE185D;
    --color-progress-deep: #15803D;
    --color-cell: #2A2F55; --color-xp: #4ADE80;
    --color-coin: #FBBF24;
    --color-coin-deep: #FDE68A;
    --color-coin-hi: #FFFBEB;
    --color-star: #FBBF24;
  }
}
:root[data-theme="dark"] {
  color-scheme: dark;
  --color-paper: #0D0F1F;
  --color-card: #151833;
  --color-ink: #EEF2FF;
  --color-ink-2: #A3A9C9;
  --color-accent: #F472B6;
  --color-accent-hover: #F9A8D4;
  --color-accent-ink: #0D0F1F;
  --color-accent-text: #F472B6;
  --color-focus: #F472B6;
  --color-progress: #4ADE80;
  --color-progress-ink: #0D0F1F;
  --color-track: #2A2F55;
  --color-rule: #2A2F55;
  --color-line: #5A62A0;
  --color-scrim: rgb(5 6 15 / 0.62);
  --shadow-lift: 0 4px 12px rgb(0 0 0 / 0.35);
  --color-edge: #5A62A0;
  --color-accent-deep: #BE185D;
  --color-progress-deep: #15803D;
  --color-cell: #2A2F55; --color-xp: #4ADE80;
  --color-coin: #FBBF24;
  --color-coin-deep: #FDE68A;
  --color-coin-hi: #FFFBEB;
  --color-star: #FBBF24;
}
```
