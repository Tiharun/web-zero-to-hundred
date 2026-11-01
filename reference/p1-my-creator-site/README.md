# 달빛곰 방송국 (P1 완성본)

"나의 크리에이터 홈페이지" 프로젝트의 완성 예시예요. HTML, CSS, JavaScript만 써서 만들었고, 설치할 것이 없어요.
Day 1~30을 따라 하면 이 모양에 가까운 사이트를 직접 만들 수 있어요. (작성 기준일 2026-11)

## 폴더 구조

```text
my-creator-site/
├─ index.html          홈 (소개, 방송 카드, 대표 영상)
├─ about.html          소개
├─ contents.html       영상 목록 (필터·검색)
├─ schedule.html       방송 일정표 + 다음 방송 카운트다운
├─ contact.html        문의 폼 (입력 검증)
├─ favicon.svg         브라우저 탭 아이콘
├─ css/style.css       모든 페이지의 스타일 (변수, 다크 모드, 반응형)
├─ js/
│  ├─ main.js          메뉴 토글, 다크 모드, 시간대별 인사말
│  ├─ contents.js      videos.json 불러오기, 카드 그리기, 필터·검색
│  ├─ schedule.js      오늘 요일 강조, 다음 방송 카운트다운
│  └─ contact.js       폼 검증, aria-live 메시지
├─ data/
│  ├─ videos.json      영상 목록
│  └─ schedule.json    방송 일정
├─ images/             프로필, 로고, 썸네일 자리 이미지 (SVG)
└─ overlay/            OBS 카운트다운 오버레이 (countdown.html / .css / .js)
```

## 열어 보는 방법

- **VS Code의 Live Preview**로 `index.html`을 열어요. (파일을 더블클릭해서 열면 `fetch`가 막혀서 영상 목록과 방송 일정 카운트다운이 나오지 않아요. 이유는 Day 25에서 배워요.)
- GitHub Pages로 배포한 주소로 열어도 돼요. (Day 14, Day 30)

## OBS 카운트다운 오버레이

`overlay/countdown.html` 뒤에 주소 값을 붙여서 써요.

```text
overlay/countdown.html?title=저녁 방송&start=20:00
```

| 값 | 뜻 | 예 |
|---|---|---|
| `title` | 화면에 보일 방송 제목 | `저녁 방송` (띄어쓰기는 `%20`으로 써도 돼요) |
| `start` | 오늘 방송 시작 시각, **한국 시간** `HH:MM` | `20:00` |

- 남은 시간이 `HH:MM:SS`로 줄어들다가, 시작 시각이 지나면 **곧 시작해요!** 로 바뀌어요.
- 배경이 투명(`transparent`)이라서 OBS에서 화면 위에 글자만 보여요.
- OBS 사용법: 소스 추가 → **브라우저** → URL에 배포한 주소를 붙여 넣어요. 너비·높이는 화면에 맞게 정해요. (OBS 메뉴 이름은 버전에 따라 조금 달라요)
- 일반 브라우저로 열면 배경이 흰색이라 글자가 흐리게 보여요. 정상이에요.

## 데이터 파일 형식

`data/videos.json`

```json
[{ "id": "v001", "title": "영상 제목", "category": "game", "youtubeId": "영상ID 11글자", "date": "2026-10-27" }]
```

`category`는 `game`, `talk`, `music` 중 하나예요.

`data/schedule.json`

```json
[{ "day": 1, "start": "20:00", "title": "방송 내용" }]
```

`day`는 일요일 `0`부터 토요일 `6`까지예요. `schedule.html`의 표(`data-day`)와 같은 값으로 맞춰 주세요.

## 알아 두면 좋은 점

- 영상 ID와 대표 영상은 **예시**예요. 내 YouTube 영상 주소 `watch?v=` 뒤의 11글자로 바꿔 주세요. `file://`로 열면 YouTube 임베드가 재생되지 않을 수 있어요.
- 다크 모드 선택은 브라우저의 `localStorage`에 `theme`(`light` 또는 `dark`)로 저장돼요.
- 문의 폼은 연습용이라 서버로 보내지 않아요.
- 외부 라이브러리·CDN·웹폰트는 쓰지 않았어요. 외부 주소는 YouTube뿐이에요.
- `og:image`는 배포 주소가 정해진 뒤에 `https://...` 전체 주소로 추가해요. (Day 28)
