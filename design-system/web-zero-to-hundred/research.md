# 디자인 리서치: 팔레트·글꼴 비교 (2026-11-11)

shape 전 참고 자료다. 결정 문서가 아니다. 결정은 shape와 DESIGN.md에서 한다.

## 1. 검색한 것과 맞는 정도

`ui-ux-pro-max` `--design-system` 검색 5건. 결과는 이 도구의 내장 DB에서 나온 것이고, 실제 사이트를 둘러본 결과가 아니다.

| 검색어 | 나온 스타일 | 이 교재에 맞는 점 | 맞지 않는 점 |
|---|---|---|---|
| online course e-learning education platform | Claymorphism, 교육 청록+주황 | 진도 색(청록)과 성취 색(주황)의 구분 | 패턴이 "후기+CTA" 랜딩(우리는 후기가 없음), 아이용 글꼴 |
| interactive coding tutorial learning | Vibrant & Block-based, 빨강+호박 | 큰 글자, 블록 구분 | 음악·엔터 팔레트로 잘못 연결됨 |
| gamified learning game progress | Claymorphism, 남색+초록 | 학습 남색 + 진도 초록 | 아이용 글꼴, 랜딩 패턴 |
| developer documentation tutorial reading | Minimalism & Swiss, 코드 다크+초록 | 읽기 화면, 다크 모드, 코드 중심 | 게임 느낌이 약함 |
| gaming platform dark esports | 3D & Hyperrealism, 네온 보라+장미 | 게임 느낌 | 접근성 위험 높음, 성능 비용 높음. 공부 화면 본문에는 부적합 |

`MASTER.md`는 첫 번째 검색을 저장한 원본이다. 그 안의 Google Fonts `@import`는 오프라인 단일 파일 제약(PRODUCT.md) 때문에 그대로 쓸 수 없다.

## 2. 추천 팔레트 3개

대비는 WCAG 공식으로 직접 계산했다(측정). 본문 글자 기준 4.5:1 이상이 AA다.

| | A. 코스 청록 + 성취 주황 | B. 학습 남색 + 진도 초록 | C. 코드 다크 + 초록 |
|---|---|---|---|
| 출처(DB) | Online Course / LMS | Language Learning App | Developer docs (Swiss) |
| 주색 | `#0D9488` | `#4F46E5` | `#22C55E` (포인트) |
| 보조/포인트 | `#2DD4BF` / `#EA580C` | `#818CF8` / `#16A34A` | `#1E293B` |
| 배경 / 카드 | `#F0FDFA` / `#FFFFFF` | `#EEF2FF` / `#FFFFFF` | `#020617` / `#0E1223` |
| 본문 글자 | `#134E4A` (배경 대비 9.09) | `#312E81` (10.22) | `#F8FAFC` (카드 대비 17.77) |
| 흐린 글자 | `#475569` (6.61) | `#475569` (6.54) | `#94A3B8` (7.25) |
| 주의할 대비 | 흰 글자/청록 3.74 **미달** → 검정 글자(5.61) 사용. 청록 글자/배경 3.59 **미달** → 링크·작은 글자에 쓰지 말 것 | 흰 글자/남색 6.29 통과 | 초록 글자/카드 8.16, 검정 글자/초록 7.83 통과 |
| 느낌 | 편안함, 지난 시안 v2와 가장 가까움 | 또렷한 학습 앱, 게임 UI와 잘 붙음 | 개발자 도구, 집중. 다크 전용 성격 |
| 다크 모드 | 따로 설계 필요 | 따로 설계 필요 | 기본이 다크. 라이트는 따로 설계 필요 |

## 3. 추천 글꼴 조합 3개와 한글 대안

DB의 라틴 글꼴에는 한글 글자가 없다. 그래서 화면 대부분인 한글은 대체 글꼴로 나온다. 실제로 고를 것은 한글 글꼴이다.

| | 1. 개발자 문서형 | 2. 친근한 게임형 | 3. 단일 서체형 |
|---|---|---|---|
| DB 조합 | 제목 JetBrains Mono + 본문 IBM Plex Sans | 제목 Fredoka + 본문 Nunito | Plus Jakarta Sans 하나 |
| 성격 | 정확함, 기술적 | 둥글고 친근함 | 깔끔한 앱 UI |
| 한글 웹폰트 대안 | 본문 Pretendard + 코드 D2Coding | 본문 Pretendard 또는 Wanted Sans + 게임 라벨(레벨·XP)에만 Galmuri | Wanted Sans 또는 Pretendard 하나 |
| 시스템 글꼴 대안(외부 파일 없음) | 맑은 고딕 + Cascadia Mono / Consolas | 맑은 고딕 + 숫자는 굵게 | 맑은 고딕 |

참고: 검색 결과 1위였던 Baloo 2 + Comic Neue는 아이용(DB 설명: "Children's apps")이라 성인 초보자 교재에는 맞지 않아 뺐다.

### 한글 글꼴 라이선스

| 글꼴 | 라이선스 | 근거 |
|---|---|---|
| Pretendard | SIL OFL 1.1 | [GitHub](https://github.com/orioncactus/pretendard), [1.3.9 고지](https://office.dooray.com/cloud-office/help/Hcell/ko_kr/oss/Pretendard-1.3.9_Notice.txt) (검색 확인) |
| Wanted Sans | SIL OFL, 가변 글꼴 제공 | [GitHub](https://github.com/wanteddev/wanted-sans) (검색 확인) |
| Galmuri (픽셀) | SIL OFL 1.1 | [산돌구름](https://www.sandollcloud.com/free-font/17347/Galmuri11) (검색 확인) |
| D2Coding (코드) | SIL OFL 1.1 | [npm 패키지 고지](https://www.npmjs.com/package/@kfonts/d2coding) (검색 확인, 네이버 원본 LICENSE는 직접 못 봄) |
| SUIT | 확인되지 않음 | 검색에서 라이선스 원문을 찾지 못함 |
| Noto Sans KR | 확인되지 않음 | 이번 검색에서 원문 확인 못 함 |

OFL은 상업적 사용, 수정, 재배포를 허용하고 글꼴만 따로 파는 것을 금지한다(검색 확인). 교재 파일 안에 넣어 배포할 때는 라이선스 문서를 함께 두어야 한다.

### 이 PC에 있는 시스템 글꼴 (측정: `C:\Windows\Fonts`)

`malgun.ttf`(맑은 고딕), `CascadiaMono.ttf`, `CascadiaCode.ttf`, `consola.ttf`, `segoeui.ttf`.

## 4. 결정 전에 정해야 할 것

1. **웹폰트: 넣기로 함(2026-11-11 사용자 결정).** 외부 요청 0건은 유지하고 글꼴 파일을 `index.html` 안에 넣는다. PRODUCT.md에 반영함.

### 크기 미리 재기 (측정, 시스템 글꼴로 대신 잼)

후보 글꼴을 아직 내려받지 않아서, 이 PC의 맑은 고딕으로 같은 방식의 서브셋을 만들어 크기를 쟀다(`fontTools` 4.66.1, woff2). 맑은 고딕은 배포용이 아니라 크기 짐작용이다.

| 글자 범위 | 맑은 고딕 보통 | 맑은 고딕 굵게 | Cascadia Mono |
|---|---|---|---|
| 교재에 실제 쓰인 글자만(현재 1,167자 + ASCII, 한글 957자) | 161 KB | 191 KB | 20 KB |
| 한글 전체 11,172자 + ASCII | 1,229 KB | 1,079 KB | 17 KB(한글 없음) |

- `index.html` 안에 넣으면 base64 때문에 약 4/3배가 된다(추측 아닌 계산). 쓰인 글자만 넣으면 굵기 2개에 약 0.5 MB 늘어난다(맑은 고딕 기준 짐작).
- 쓰인 글자만 넣으면 P2 뒤쪽·P3·SP를 쓸 때 새 글자가 계속 생긴다. 그래서 빌드할 때마다 서브셋을 다시 만들어야 한다(설계 때 정할 것). 빠진 글자는 시스템 글꼴로 나온다.
- 후보 글꼴은 아래에서 실제로 잼.

### 후보 글꼴 실측 (측정, 2026-11-11)

공식 GitHub 최신 릴리스(Pretendard 1.3.9, Wanted Sans 1.0.3, Galmuri 2.40.4, D2Coding 1.4.0)를 저장소 밖 임시 폴더에 받아 `fontTools` 4.66.1로 woff2 서브셋을 만들었다. "쓰인 글자"는 현재 콘텐츠와 앱 코드의 글자 + ASCII다. `index.html`에 넣으면 약 4/3배(base64)가 된다.

| 글꼴 | 원본 | 쓰인 글자만 | 한글 전체 | 이 글꼴에 없는 글자(쓰인 글자 중) |
|---|---|---|---|---|
| Pretendard Regular / Bold | 2.6 MB | 87 / 87 KB | 594 / 618 KB | 47자: 이모지, 상자 그림 선(─│┌), 일부 화살표 |
| Pretendard Variable(모든 굵기) | 6.4 MB | 213 KB | 1,692 KB | 위와 같음 |
| Wanted Sans Regular / Bold | 2.3 MB | 83 / 84 KB | 587 / 600 KB | 62자: 위 + ≤ ≥ √ ▶ ▲ 전각 괄호 |
| Wanted Sans Variable(모든 굵기) | 4.5 MB | 156 KB | 1,192 KB | 위와 같음 |
| Galmuri11 / Bold (픽셀) | 5.1 MB | 23 / 20 KB | 142 / 123 KB | 36~49자 |
| D2Coding / Bold (코드) | 3.9 MB | 121 / 136 KB | 409 / 444 KB | 27자: 이모지 등 |

- 없는 글자는 시스템 글꼴(맑은 고딕, Segoe UI Emoji)로 나온다. 이모지는 어느 후보에도 없다.
- 예: 본문 Wanted Sans Variable + 게임 라벨 Galmuri11 + 코드 D2Coding(보통)을 쓰인 글자만 넣으면 156 + 23 + 121 = 300 KB, `index.html`에서는 약 400 KB 늘어난다(계산).

### 라이선스 조건: 서브셋과 예약 이름 (검색 확인 + 측정)

- [OFL FAQ 1.1-update8](https://openfontlicense.org/ofl-faq/) 2.6: 웹폰트 서브셋은 수정(Modified Version)이다. OFL은 이를 허용하지만, 보통은 예약 글꼴 이름(RFN)을 쓸 수 없다.
- 받은 라이선스 파일을 확인한 결과(측정): **Pretendard**와 **D2Coding**은 RFN을 선언했다. **Wanted Sans**와 **Galmuri**는 선언하지 않았다.
- 따라서 Pretendard나 D2Coding을 서브셋해서 넣으면, 글꼴 안의 이름과 CSS `font-family` 이름을 바꿔야 한다(예: `WZH Sans`). Wanted Sans와 Galmuri는 이름을 그대로 써도 된다.
- 어느 경우든 OFL 본문과 저작권 고지를 교재와 함께 둔다.


2. **넣는다면 범위.** 본문 전체(가장 큼), 제목과 게임 라벨만(작은 글자 집합으로 줄일 수 있음, 추측), 코드 글꼴만.
3. **팔레트 방향.** A는 지난 v2의 편안함, B는 게임 UI와의 궁합, C는 다크 집중 화면. A의 청록은 작은 글자색으로 쓰면 대비가 미달이다.

## 5. 출처

- 내장 DB: `ui-ux-pro-max` 2.15.0 `--design-system`, `--domain color`, `--domain typography`
- [Pretendard GitHub](https://github.com/orioncactus/pretendard)
- [Wanted Sans GitHub](https://github.com/wanteddev/wanted-sans)
- [Galmuri11 산돌구름](https://www.sandollcloud.com/free-font/17347/Galmuri11)
- [D2Coding npm](https://www.npmjs.com/package/@kfonts/d2coding)
- [web.dev 웹 글꼴 최적화](https://web.dev/learn/performance/optimize-web-fonts?hl=ko)
