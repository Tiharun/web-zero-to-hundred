# 시각 테스트

교재 화면을 찍어 `baseline/`의 기준 이미지와 픽셀 단위로 비교한다.

## 실행

`textbook/` 폴더에서 실행한다. 먼저 `NODE_PATH`를 `npm root -g`의 출력 경로로 맞춘다(`docs/CHECKPOINT.md` 5.2).

```bash
npm run test:visual
```

```bash
npm run test:visual:update
```

- `test:visual`: 비교만 한다. 실패하면 `tests/visual/.out/`에 `<이름>.actual.png`(새로 찍은 것)와 `<이름>.diff.png`(다른 곳이 빨간색)를 남긴다. 이 폴더는 git에서 제외된다.
- `test:visual:update`: 기준 이미지를 새로 저장한다. **의도한 화면 변경이고 사용자가 승인했을 때만** 실행한다. 실행한 뒤 바뀐 이미지를 모두 열어 확인하고 함께 커밋한다.

## 무엇을 비교하나

- 장면 4개(`home`, `day`, `settings`, `notfound`) × 폭 375·768·1280 × 라이트·다크 = 24장.
- 파일 이름: `baseline/<장면>-<폭>-<테마>.png`.
- 고정 조건: 실제 교재(`textbook/content`) 빌드, 뷰포트 높이 900, 배율 1, 움직임 줄이기, `ko-KR`, 시각 `2026-01-01T00:00:00+09:00`, 내장 글꼴 로드 후 보이는 부분만 촬영. 설정 화면의 빌드 날짜는 가린다.
- 판정: 색 거리 문턱값 0.02(OKLab, pixelmatch 8)를 넘는 픽셀이 전체의 0.1%보다 많으면 실패. 크기가 다르면 바로 실패. 문턱값은 `compare.mjs`에 있다.

## 기준 이미지는 이 PC(Windows)에서만 만든다

글꼴 렌더링과 이모지 글꼴은 운영체제마다 다르다. 다른 운영체제나 CI에서 돌리면 화면이 같아도 실패한다. 기준 이미지를 만든 환경과 같은 Windows + 전역 Playwright Chromium에서만 비교한다.

## 장면 추가

`visual.test.mjs`의 `SCENES`에 한 줄을 더한다.

```js
{ id: 'search', hash: '#/search', progress: null },
```

`progress`는 `{ completed: ['p1-d01', …], lastDay: 'p1-d01' }` 또는 `null`(진도 없음)이다. 추가한 뒤 `test:visual:update`로 6장을 만들고 모두 열어 확인한다.
