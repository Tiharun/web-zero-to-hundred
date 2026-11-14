# M13 Three.js 3D 그림 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> 이 프로젝트는 Native 방식이다(통합 로드맵 10장). `executing-plans`로 이 세션이 끝까지 하고, 서브에이전트·자식 세션을 쓰지 않는다. 최종 리뷰도 직접 한다.

**Goal:** Three.js를 `index.html` 안에 넣고(첫 화면 비용 없이), 3D 그림 3개(Day 10 박스 모델, Day 6·20 DOM 트리)를 Skeleton·정적 대체 그림과 함께 넣는다. 완료 기준은 로드맵 M13 ①~③과 M5 넘김 메모(Skeleton은 `skeletonGate`를 쓴다)다.

**Architecture:**
- **엔진은 따로 묶고 늦게 실행한다.** `src/three/entry.js`(쓰는 클래스만 다시 내보냄)를 esbuild가 IIFE(`globalName: 'WZH_THREE'`)로 묶어 `<script type="text/plain" id="three-src">`에 넣는다. 3D 그림이 화면 근처에 오면 `app/three.js`의 `loadThree()`가 그 글을 `<script>`로 붙여 한 번 실행한다. 앱 번들과 Node 빌드는 `three`를 import하지 않는다.
- **3D 그림은 "층 상자" 하나의 틀이다.** 박스 모델과 DOM 트리 모두 평면 위의 네모(층 데이터)를 깊이만큼 띄운 장면이다. 공용 틀 `views/figure3d.js`의 `layerFigure(fig, { layers, reducedMotion })`가 Skeleton·WebGL 검사·장면·끌기·시점 버튼·테마 색·대체 그림·정리를 맡고, 그림 모듈은 층 데이터만 갖는다.
- **순수 계산은 분리한다.** 시점(끌기·버튼·카메라 위치·보간)과 층 데이터 검사는 `app/view3d.js`의 순수 함수로 두고 단위 테스트한다. 렌더는 바뀔 때만 한 번 그린다(계속 도는 루프가 없다).

**Tech Stack:** 바닐라 JS(ESM), three 0.187.0(신규 devDependency), esbuild 0.28.2, `node:test`, 전역 Playwright 1.63.0 + Chromium, pixelmatch 8.0.0.

**Spec:**
- 기준: `docs/superpowers/specs/2026-11-12-unified-roadmap-design.md` 11장 M13 행(M5 넘김 포함), 4장(전역 제약), 7장("WebGL 불가·그림 오류 → 같은 id의 정적 SVG + 대체 설명"), 13장 위험표(3D 700KB 예산).
- 세부: `docs/superpowers/specs/2026-11-11-textbook-redesign-design.md` 3.5(Skeleton), 6.1(저절로 움직이지 않음), 7.1(G4는 깊이가 개념일 때만), 7.2(`mount → dispose`), **7.3(3D 규칙 전부)**, 7.4(Day 6·20, 10), 10장(3D 활성 1개).
- 시각 값의 유일한 기준은 `DESIGN.md`다. 3D 그림 부분은 아래 Task 3 Step 1 문안을 넣은 뒤 그것을 따른다.

## Global Constraints

- **토큰:** 색·글꼴·크기·간격·모서리·모션 값은 DESIGN.md 토큰만 쓴다. WebGL 색은 JS에 쓰지 않고 실행 때 `getComputedStyle(fig).getPropertyValue('--color-…')`로 읽는다. 그림 코드(`src/figures/*.js`, `views/figure.js`, `views/figure3d.js`, `app/view3d.js`, `app/three.js`)에 색 값이 없어야 한다(기존 빌드 테스트 `figure code has no raw colors`를 넓힌다).
- **새 값:** Task 3 Step 1의 DESIGN.md 문안과 Task 4 Step 1의 CONTENT-GUIDE 문안이 수정안이다. **이 계획을 승인하면 그 문안도 승인한 것**으로 본다. 새 토큰은 없다. 그 밖의 새 값이 필요해지면 멈추고 묻는다.
- **3D 규칙(개편 7.3):** 화면에 들어올 때 시작, 바뀔 때만 렌더(루프 없음), 한 페이지에 3D 하나, `setPixelRatio(Math.min(devicePixelRatio, 2))`, WebGL 2가 없으면 정적 SVG + 대체 설명, 시점 버튼은 키보드로 쓸 수 있음, 자동 회전 없음(개편 6.1 "본문을 읽을 때 저절로 움직이지 않는다"에 맞춰 동작 줄이기와 상관없이 끈다).
- **크기:** 3D 때문에 늘어나는 `index.html`은 **700,000바이트 이하**[선택: KB를 1000바이트로 엄격하게 읽는다]. 엔진 블록 자체는 빌드 테스트로 640,000바이트 이하(나머지 60,000은 그림 코드·CSS·본문 몫).
- **The Fluid Rule:** 320px부터 가로 스크롤 0, 그림 폭 최대 30rem, 브레이크포인트는 DESIGN.md 표의 값만.
- **The Game Frame Rule:** 시점 버튼은 보조 버튼(턱)이고 그림 틀 아래 줄 Label "그림 n"이 게임 신호다. 그림 안은 글 열이라 도트 그림을 넣지 않는다.
- **Real Progress·One Pink:** 그림 안에 초록·분홍·금색을 쓰지 않는다(DESIGN.md "그림 안").
- **본문:** Day 제목·요약·어휘는 바꾸지 않는다. 바꾸는 것은 아래 Task 3·4에 적은 그림 블록 자리뿐이다.
- **파일·이름·기록:** 파일 하나, 외부 요청 0건. 이름·주소는 `curriculum.json`에서만. 저장소 파일에 모델 식별자·개인정보·로컬 경로를 쓰지 않는다.
- **외부 사실:** three 버전·라이선스·WebGL 2 요구는 Task 1에서 `external-facts.md`에 먼저 적고 그 값만 쓴다.
- **커밋:** 커밋·push는 사용자 요청 때만. "Commit" 단계는 실행 세션 시작 때 사용자에게 한 번 확인하고 따른다. 커밋마다 CLAUDE.md 8장의 비밀값 grep을 먼저 돌린다.
- **미루지 않기:** 찾은 작은 문제는 이 마일스톤에서 고친다. 다른 마일스톤 화면이 필요한 일만 로드맵 11장 해당 행에 `(M13에서 넘김: …)`.
- **기준 이미지:** 이 PC에서, 사용자 승인 뒤에만 `npm run test:visual:update`.
- **브라우저 테스트:** PowerShell에서 `$env:NODE_PATH = (npm root -g)` 뒤 실행. `127.0.0.1` 정적 서버로 연다. 명령은 `textbook/`에서.
- **기준선(M12 끝):** unit 332, e2e 252, visual 206(기준 이미지 204), check:site 5폭 각 168/0, 루트 `index.html` 6,801,317바이트(`d900f83`).

## 결정 기록 (계획 단계, 근거 포함)

- **three 0.187.0** [측정: `npm view three`, 2026-11-14. latest, 2026-10-30 출시, MIT]. r163부터 WebGLRenderer는 WebGL 2만 쓴다 [검색: three.js r163 릴리스 노트, WebGLRenderer 문서]. 그래서 지원 검사는 `getContext('webgl2')` 하나다.
- **크기** [측정: 임시 폴더에서 esbuild 0.28.2 minify, 이 계획에서 쓸 클래스만]: 539,877바이트(gzip 135,454). 예산 700,000 안에 들어간다. 애드온(OrbitControls)과 글꼴 지오메트리는 쓰지 않는다. 끌기는 직접 만들고(포인터 이벤트 몇 줄), 이름표는 DOM `span`이라 글꼴이 교재 글꼴 그대로다.
- **"파싱 비용까지 미루는 방식"** [측정: Chromium, 같은 번들, 7회 중앙값]: 보통 `<script>`로 넣으면 첫 화면에서 31.1ms, `type="text/plain"`으로 넣으면 4.7ms(글자 읽기만), 필요할 때 붙여 실행하면 그때 25.5ms. 첫 화면 비용이 약 26ms 줄고, 붙이는 순간도 Long Task 기준(50ms) 아래라 **text/plain + 필요할 때 실행**으로 정한다. `file:`로 열어도 되는 방식이다(외부 요청·Blob URL 없음).
- **헤드리스 WebGL** [측정: 이 PC 헤드리스 Chromium은 기본으로 SwiftShader WebGL이 된다. `--disable-webgl`이면 `null`]. Chromium은 SwiftShader 자동 대체를 없애는 중이고 `--enable-unsafe-swiftshader`로 켠다 [검색: Chromium docs/gpu/swiftshader.md, blink-dev "Intent to Remove: SwiftShader Fallback"]. CI(Linux)에서도 같게 하려고 테스트 도우미 `launch()`에 이 플래그를 기본으로 준다. 테스트는 이 저장소의 로컬 페이지만 열므로 보안 약화의 영향이 없다. WebGL을 끈 경우는 `getContext('webgl2')`가 `null`을 내게 하는 init script로 만든다(브라우저를 따로 띄우지 않는다).
- **라이선스:** MIT는 사본에 저작권·허가 문구를 넣어야 한다. 빌드가 `node_modules/three/LICENSE` 전문을 엔진 블록 바로 앞 HTML 주석으로 넣는다(`legalComments: 'none'`이 지우는 것을 대신). 라이선스 문서 항목은 M14 일이므로 로드맵 M14 행에 넘김 메모를 적는다.
- **장면 모양:** 층 데이터의 네모는 320×240 평면 좌표(`x, y, w, h`, y는 아래로)와 `depth`(0부터)를 갖는다. 3D에서는 두께 4의 판을 `depth × 28`만큼 앞으로 띄운다. 판 면은 `card`, 테두리 선은 `ink`, 화면에 그려지지 않는 것(박스 모델의 margin, DOM의 `head`)은 `ghost: true`라 면이 없고 선이 점선(`ink-2`)이다. 바탕은 `paper`. 정면(yaw 0, pitch 0)에서는 겹친 상자 = 페이지 모양, 돌리면 층 = 나무가 보인다. 이것이 G4를 쓰는 이유(깊이가 개념)다.
- **시점:** 처음 시점 `HOME_VIEW = { yaw: -35, pitch: 20 }`. 끌기 1px = 0.5°. yaw는 제한 없이 돌고 (-180, 180]로 정리, pitch는 [-60, 60]으로 자른다. 버튼은 "← 왼쪽으로"(yaw −30), "오른쪽으로 →"(yaw +30), "↺ 처음 시점". 버튼 이동은 280ms(`ENTER_MS`) 3차 감속 보간, 동작 줄이기면 바로. 끌기는 손을 그대로 따라간다. 휠·핀치 확대는 없다(페이지 스크롤을 가로채지 않는다).
- **터치:** 캔버스 `touch-action: pan-y`. 가로로 끌면 돌고, 세로로 밀면 페이지가 스크롤된다(pitch는 마우스로만 바뀐다).
- **접근성:** 그림 정보는 지금처럼 `figure-art[role="img"]`의 `aria-label`(대체 설명)이 맡는다. 캔버스·이름표·정적 SVG는 `aria-hidden="true"`다(`role="img"` 안에 `role="img"`를 겹치지 않는다. 개편 7.3의 "캔버스에 role=img"는 이 바깥 요소가 대신한다). 시점 버튼 묶음은 `role="group"` `aria-label="시점 바꾸기"`이고 `figure-art` 밖(무대 안 아래)에 둔다.
- **상태 이름:** `.fig3d`의 `data-state`는 `wait`(아직 화면 밖) → `loading` → `ready` | `static`. `data-yaw`·`data-pitch`(반올림 정수)는 지금 시점이다. CSS와 테스트가 이 값을 본다.
- **Skeleton:** `skeletonGate`(M5)를 그대로 쓴다. `loading`이 200ms를 넘으면 그림 자리 크기(4:3)의 `span.skeleton-block`이 보이고 최소 300ms 유지된다. 엔진 실행 같은 긴 동기 작업 뒤에 `gate.poll()`을 부른다(M9의 쉬는 틈 규칙).
- **대체 그림(G1):** 같은 층 데이터로 비스듬한 정적 SVG(`depth`마다 오른쪽 위로 `(14, −10)` 밀어 뒤에서 앞으로 그림)를 만든다. JS가 켜져 있으면 늘 만들어 두고 `ready`일 때만 숨긴다. 그래서 WebGL 없음·컨텍스트 잃음·엔진 실패·인쇄가 모두 같은 그림을 쓴다. `static`일 때는 대체 설명 문단도 그림 아래에 보인다(로드맵 M13 ②). JS가 꺼지면 지금처럼 빌드가 넣은 대체 설명만 보인다.
- **한 페이지에 3D 하나:** 등록표가 `THREE_D` 집합을 내보내고, 빌드 테스트가 모든 Markdown 문서에서 3D id가 하나 이하인지 본다. 실행 중 관리자를 따로 만들지 않는다(YAGNI).
- **본문 자리:** Day 10은 개념 절의 박스 모델 `text` 블록을 그림으로 **바꾼다**(M12 선례, 정보는 대체 설명으로). Day 20의 `text` 나무 블록은 1단계(Elements 들여쓰기 비교)가 참고하므로 **남기고** 그 바로 뒤에 그림을 둔다. Day 6은 `text` 블록이 없어 "개발자 도구" 절 첫 문단 뒤(`:::warn` 앞)에 그림을 넣는다.

## Review Focus

1. **휴대폰(375px, 터치)에서 그림 위를 세로로 밀기**
   - 기대: 페이지가 스크롤되고 그림에 갇히지 않는다. 가로로 끌면 돈다. 가로 스크롤 0.
   - 확인: Task 3 e2e `touch scroll passes through the 3D figure`.
2. **Day를 여러 번 떠났다 돌아오기**
   - 기대: 매번 새로 시작하고 남는 WebGL 컨텍스트·리스너가 없다. 6번 왕복 뒤에도 콘솔 경고·오류 0, 문서 안 캔버스 1개.
   - 확인: Task 3 e2e `leaving and returning six times leaks no WebGL context`.
3. **보는 중에 테마 바꾸기**
   - 기대: 3D 바탕·판·선이 새 테마 색으로 다시 그려진다(새로고침 없이).
   - 확인: Task 3 e2e `theme switch repaints the 3D figure`.
4. **보는 중에 WebGL 컨텍스트를 잃음(GPU 재시작 등)**
   - 기대: 오류 없이 정적 그림 + 대체 설명으로 바뀌고 시점 버튼이 숨는다.
   - 확인: Task 3 e2e `context loss falls back to the static figure`.
5. **320px에서 이름표**
   - 기대: 이름표가 그림 틀 밖으로 나가지 않고(넘치면 잘림), 페이지 가로 스크롤 0, 시점 버튼 줄이 감긴다.
   - 확인: Task 4 e2e `3D figures fit 320px`.

---

## 파일 구조

| 파일 | 책임 | Task |
|---|---|---|
| `textbook/package.json`, `package-lock.json` | `three` 0.187.0 devDependency | 1 |
| `docs/research/external-facts.md` | three 버전·라이선스·WebGL 2·SwiftShader 플래그 | 1 |
| `textbook/src/three/entry.js` (신규) | 3D 번들 입구: 쓰는 three 클래스만 다시 내보냄 | 1 |
| `textbook/build.mjs`, `textbook/lib/assemble.mjs` | 3D 번들 묶기, `text/plain` 블록과 라이선스 주석 넣기, 글자 수집에서 제외 | 1 |
| `textbook/src/app/three.js` (신규) | `loadThree()`, `webgl2Context()` | 1 |
| `tests/helpers/browser.mjs` | `launch()` 기본 플래그 | 1 |
| `textbook/src/app/view3d.js` (신규) | 시점 계산·보간·층 데이터 검사(순수) | 2 |
| `textbook/src/app/views/figure3d.js` (신규) | 3D 그림 틀 `layerFigure`, 정적 SVG `obliqueSvg` | 3 |
| `textbook/src/styles/figures.css` | `.fig3d`, 이름표, 시점 버튼 줄, Skeleton 블록, 인쇄 | 3 |
| `textbook/src/styles/components.css` | `.skeleton-block`(기존 pulse 공유) | 3 |
| `DESIGN.md` | 그림 틀 "3D 그림" 문안, Motion·Skeleton 줄 | 3 |
| `textbook/src/figures/box-model-3d.js` (신규) | Day 10 층 데이터 + `mount` | 3 |
| `textbook/src/figures/dom-tree-3d.js` (신규) | Day 6·20 층 데이터 + `mountSite`·`mountCards` | 4 |
| `textbook/src/figures/index.js` | 등록 3개, `THREE_D` | 3, 4 |
| `textbook/content/p1/day-06.md`, `day-10.md`, `day-20.md` | 그림 블록 | 3, 4 |
| `docs/CONTENT-GUIDE.md` | 1.7 G4 줄과 3D 규칙 | 4 |
| `tests/unit/view3d.test.mjs` (신규) | 시점·층 검사 | 2, 3, 4 |
| `tests/build/build.test.mjs` | 엔진 블록·예산·라이선스·색·3D 하나 | 1, 3, 4 |
| `tests/e2e/figures3d.test.mjs` (신규) | 3D 동작·대체·Skeleton·정리 | 3, 4 |
| `tests/visual/visual.test.mjs` | 3D 장면 4개, `ready`·`webgl` 장면 옵션 | 5 |
| `docs/CHECKPOINT.md`, `docs/checkpoint/workspace/progress.md`, 로드맵 11장 M14 행 | 완료 기록, 넘김 메모 | 5 |

---

### Task 1: 엔진 내장과 늦은 실행

**Files:**
- Modify: `textbook/package.json`, `textbook/package-lock.json`, `docs/research/external-facts.md`, `textbook/build.mjs`, `textbook/lib/assemble.mjs`, `tests/helpers/browser.mjs`
- Create: `textbook/src/three/entry.js`, `textbook/src/app/three.js`
- Test: `tests/build/build.test.mjs`

**Interfaces:**
- Produces: 전역 `window.WZH_THREE` = `{ WebGLRenderer, Scene, PerspectiveCamera, BoxGeometry, EdgesGeometry, LineSegments, LineBasicMaterial, LineDashedMaterial, Mesh, MeshBasicMaterial, Group, Color, Vector3 }`(엔진을 실행한 뒤).
- Produces: `app/three.js`
  - `loadThree(doc = document) → Promise<object|null>`: 이미 실행했으면 그 객체, `#three-src`가 없거나 실행 뒤에도 `WZH_THREE`가 없으면 `null`. 한 번만 실행한다.
  - `webgl2Context(canvas) → WebGL2RenderingContext|null`: `canvas.getContext('webgl2', { antialias: true, alpha: false })`, 예외면 `null`.
- Produces: `assemble({ …, lazyScripts: [{ id, js, notice }] })`: JS 자리의 앱 `<script>` **앞**에 `<!--\n{notice}\n-->` + `<script type="text/plain" id="{id}">…</script>`. 안쪽은 앱 스크립트와 같은 `</script`·`<!--` 치환을 쓴다. `notice` 안의 `--`는 `- -`로 바꿔 주석이 끊기지 않게 한다.
- Produces: `launch({ args } = {})`: 기본 `args`는 `['--enable-unsafe-swiftshader']`.

- [ ] **Step 1: 외부 사실 기록**

`external-facts.md`에 새 절(마지막 절 번호 다음)을 더한다: three 0.187.0(npm latest, 2026-10-30 출시, MIT, `exports["."].import = ./build/three.module.js`, 확인 명령 `npm view three version time license`), WebGLRenderer는 r163부터 WebGL 2만 [출처: https://www.github.com/mrdoob/three.js/releases/tag/r163, https://threejs.org/docs/pages/WebGLRenderer.html], 헤드리스 Chromium SwiftShader 대체는 `--enable-unsafe-swiftshader`로 켬 [출처: https://chromium.googlesource.com/chromium/src/+/da170c2267b2201954efe1c8fa5d2d89ab09f7bf/docs/gpu/swiftshader.md, https://groups.google.com/a/chromium.org/g/blink-dev/c/yhFguWS_3pM]. 확인 날짜 2026-11-14.

- [ ] **Step 2: 의존성 추가**

Run: `npm install --save-dev --save-exact three@0.187.0`
Expected: `package.json` devDependencies에 `"three": "0.187.0"`, `npm ci`가 통과한다.

- [ ] **Step 3: 실패하는 빌드 테스트 쓰기** (`tests/build/build.test.mjs`)

```js
test('3D engine is embedded as a lazy text block within budget', async () => {
  const r = await build({ contentDir: CONTENT, allowMissing: true });
  const m = r.html.match(/<script type="text\/plain" id="three-src">([\s\S]*?)<\/script>/);
  assert.ok(m, 'three-src block');
  assert.ok(Buffer.byteLength(m[1]) <= 640_000, `engine ${Buffer.byteLength(m[1])} bytes`);
  assert.match(m[1], /WZH_THREE/);
  const appJs = r.html.match(/<script>(?![\s\S]*<script>)([\s\S]*?)<\/script>/)[1]; // 마지막 앱 스크립트
  assert.ok(!appJs.includes('WebGLRenderer'), 'three must not be in the app bundle');
});

test('3D engine carries the three.js MIT notice', async () => {
  const r = await build({ contentDir: CONTENT, allowMissing: true });
  const license = (await readFile(path.join(ROOT, 'textbook', 'node_modules', 'three', 'LICENSE'), 'utf8')).trim();
  const firstLine = license.split('\n').find((l) => l.includes('Copyright'));
  assert.ok(r.html.includes(firstLine.replace(/--/g, '- -')));
  assert.ok(r.html.indexOf(firstLine) < r.html.indexOf('id="three-src"'));
});
```

`assemble` 단위 확인도 한 개 더한다: `lazyScripts: [{ id: 'x', js: 'a="</script>"', notice: 'n--n' }]` → 결과에 `<script type="text/plain" id="x">a="<\/script>"</script>`와 `<!--\nn- -n\n-->`가 있다.

- [ ] **Step 4: 실패 확인**

Run: `npm test`
Expected: 새 테스트 3개 FAIL("three-src block").

- [ ] **Step 5: 구현**
- `src/three/entry.js`: 위 Interfaces의 클래스만 `export { … } from 'three';`.
- `build.mjs`: `bundleJs(entry, { globalName })` 옵션을 더해 `src/three/entry.js`를 `globalName: 'WZH_THREE'`로 묶고, `LICENSE`를 읽어 `lazyScripts: [{ id: 'three-src', js, notice }]`로 `assemble`에 넘긴다. 글자 수집(`collectGlyphs`)에는 엔진 글을 넣지 않는다. 실패는 기존 `E_JS_BUNDLE` 형식.
- `app/three.js`: `loadThree`는 `#three-src`의 `textContent`로 새 `<script>`를 만들어 `doc.head`에 붙인 뒤 `doc.defaultView.WZH_THREE`를 돌려준다. 결과를 모듈 변수에 기억한다(실패도 `null`로 기억).
- `browser.mjs`: `launch({ args = ['--enable-unsafe-swiftshader'] } = {})`.

- [ ] **Step 6: 통과 확인**

Run: `npm test` → 모두 PASS(332 + 3). Run: `npm run test:e2e`, `npm run test:visual` → 기준선과 같은 수 PASS(플래그가 다른 화면을 바꾸지 않음을 확인).

- [ ] **Step 7: Commit**

```bash
git add textbook/package.json textbook/package-lock.json docs/research/external-facts.md textbook/src/three/entry.js textbook/src/app/three.js textbook/build.mjs textbook/lib/assemble.mjs tests/helpers/browser.mjs tests/build/build.test.mjs
git commit -m "feat(build): embed three.js as a lazy text block with its MIT notice"
```

---

### Task 2: 시점 계산과 층 데이터 검사 (순수 함수)

**Files:**
- Create: `textbook/src/app/view3d.js`
- Test: `tests/unit/view3d.test.mjs`

**Interfaces:**
- Produces (`app/view3d.js`, DOM 없음):
  - 상수 `HOME_VIEW = { yaw: -35, pitch: 20 }`, `TURN_STEP = 30`, `DRAG_DEG_PER_PX = 0.5`, `PITCH_LIMIT = 60`, `LAYER_GAP = 28`, `SLAB = 4`, `PLANE = { w: 320, h: 240 }`, `OBLIQUE = { dx: 14, dy: -10 }`.
  - `normYaw(deg) → number` (-180, 180]
  - `dragView(view, dx, dy) → view`
  - `turnView(view, dir: -1|1) → view`
  - `tweenView(from, to, t) → view`: t는 0~1, 감속 `1 - (1 - t) ** 3`, yaw는 짧은 쪽으로 돈다.
  - `cameraPosition(view, distance) → { x, y, z }`: `x = d·sin(yaw)·cos(pitch)`, `y = d·sin(pitch)`, `z = d·cos(yaw)·cos(pitch)`(도 → 라디안).
  - `checkLayers(layers) → string[]`: 문제 문장 목록(빈 배열이면 정상). 층 `{ id, label, depth, parent, x, y, w, h, code?, ghost? }`.

- [ ] **Step 1: 실패하는 테스트 쓰기**

```js
test('drag turns yaw freely and clamps pitch', () => {
  assert.deepEqual(dragView(HOME_VIEW, 120, 0), { yaw: 25, pitch: 20 });
  assert.equal(dragView({ yaw: 170, pitch: 0 }, 40, 0).yaw, -170);
  assert.equal(dragView({ yaw: 0, pitch: 50 }, 0, 100).pitch, 60);
  assert.equal(dragView({ yaw: 0, pitch: -50 }, 0, -100).pitch, -60);
});
test('turn buttons move by 30 degrees', () => {
  assert.deepEqual(turnView(HOME_VIEW, 1), { yaw: -5, pitch: 20 });
  assert.equal(turnView({ yaw: 180, pitch: 0 }, 1).yaw, -150);
});
test('tween goes the short way and lands exactly', () => {
  assert.deepEqual(tweenView({ yaw: 170, pitch: 0 }, { yaw: -170, pitch: 0 }, 1), { yaw: -170, pitch: 0 });
  assert.equal(tweenView({ yaw: 170, pitch: 0 }, { yaw: -170, pitch: 0 }, 0.5).yaw, normYaw(170 + 20 * 0.875)); // 1-(0.5)^3 = 0.875, 180을 넘어 돈다
  assert.deepEqual(tweenView(HOME_VIEW, { yaw: 0, pitch: 0 }, 0), HOME_VIEW);
});
test('camera sits on the z axis at the front view', () => {
  const p = cameraPosition({ yaw: 0, pitch: 0 }, 500);
  assert.deepEqual([p.x, p.y, Math.round(p.z)], [0, 0, 500]);
  assert.ok(cameraPosition({ yaw: 90, pitch: 0 }, 500).x > 499);
});
test('checkLayers finds broken nesting', () => {
  const ok = [{ id: 'a', label: 'a', depth: 0, parent: null, x: 0, y: 0, w: 320, h: 240 }, { id: 'b', label: 'b', depth: 1, parent: 'a', x: 10, y: 10, w: 100, h: 50 }];
  assert.deepEqual(checkLayers(ok), []);
  assert.equal(checkLayers([ok[0], { ...ok[1], x: 300 }]).length, 1); // 부모 밖
  assert.equal(checkLayers([ok[0], { ...ok[1], depth: 2 }]).length, 1); // 깊이 건너뜀
  assert.equal(checkLayers([ok[0], { ...ok[1], parent: 'z' }]).length, 1); // 없는 부모
  assert.equal(checkLayers([ok[0], { ...ok[0] }]).length, 1); // 같은 id
  assert.equal(checkLayers([{ ...ok[0], w: 400 }]).length, 1); // 평면(320×240) 밖
});
```

- [ ] **Step 2: 실패 확인** — Run: `npm test` → FAIL(모듈 없음).
- [ ] **Step 3: `app/view3d.js` 구현** — 위 시그니처 그대로. `checkLayers`는 루트가 정확히 하나(`parent: null`, `depth: 0`)인지도 본다.
- [ ] **Step 4: 통과 확인** — Run: `npm test` → PASS.
- [ ] **Step 5: Commit**

```bash
git add textbook/src/app/view3d.js tests/unit/view3d.test.mjs
git commit -m "feat(figures): pure view math and layer checks for 3D figures"
```

---

### Task 3: 3D 그림 틀과 Day 10 박스 모델

**Files:**
- Modify: `DESIGN.md`, `textbook/src/styles/figures.css`, `textbook/src/styles/components.css`, `textbook/src/figures/index.js`, `textbook/content/p1/day-10.md`, `tests/build/build.test.mjs`, `tests/unit/view3d.test.mjs`
- Create: `textbook/src/app/views/figure3d.js`, `textbook/src/figures/box-model-3d.js`, `tests/e2e/figures3d.test.mjs`

**Interfaces:**
- Consumes: `loadThree`, `webgl2Context`(Task 1); `view3d.js` 전부(Task 2); `skeletonGate`(`views/skeleton.js`); `h`, `svg`(`views/common.js`); `ENTER_MS`, `motionEnv`(`motion.js`).
- Produces (`views/figure3d.js`):
  - `obliqueSvg(layers) → SVGSVGElement`: `viewBox`는 평면 + 최대 깊이 × `OBLIQUE`만큼 넓힌 상자, 깊이 오름차순으로 `rect.fig-box`(ghost면 `rect.fig-ghost`) + 이름 `text`(`code`면 `fig-code`), `aria-hidden="true"`, 클래스 `fig3d-static`.
  - `layerFigure(fig, { layers, reducedMotion, load = loadThree, IO = globalThis.IntersectionObserver }) → () => void`
- Produces (`figures/box-model-3d.js`): `BOX_LAYERS`(층 4개: `margin`(ghost, depth 0) ⊃ `border` ⊃ `padding` ⊃ `content`, 이름표 "margin (바깥 여백)", "border (테두리)", "padding (안쪽 여백)", "내용 (content)", 이름 부분은 `code: true`), `mount(fig, { reducedMotion })`.
- Produces (`figures/index.js`): `FIGURES['box-model-3d']`, `export const THREE_D = new Set(['box-model-3d'])`(Task 4에서 둘 더).

`layerFigure`가 만드는 DOM(빌드가 만든 틀 안):
- `figure-art` 자식을 `div.fig3d[data-state="wait"]`(4:3) 하나로 바꾼다: `canvas`(aria-hidden, 처음엔 없음, `ready`에서 붙임) + `div.fig3d-labels`(aria-hidden, `span.fig3d-label` 층마다) + `obliqueSvg(layers)`.
- 무대 안 `figure-art` 뒤: `p.figure-fallback.fig3d-desc[aria-hidden="true"]`(대체 설명 글, `static`일 때만 보임), `div.figure-views[role="group"][aria-label="시점 바꾸기"][hidden]`에 `button.btn` 셋("← 왼쪽으로", "오른쪽으로 →", "↺ 처음 시점").
- 흐름: IO(`rootMargin: '200px 0px'`)가 처음 닿으면 `loading`(`figure-art`에 `aria-busy="true"`, 끝나면 뗀다) → `skeletonGate` 시작 → `canvas`를 만들어 `webgl2Context` → 없으면 `static` → `await load()` → `gate.poll()` → 다음 프레임 → 장면 생성(`new T.WebGLRenderer({ canvas, context })`, `setPixelRatio(Math.min(devicePixelRatio, 2))`, 카메라 fov 35, 거리 520, 층마다 `BoxGeometry(w, h, SLAB)` 면 + `EdgesGeometry` 선, ghost는 면 없이 `LineDashedMaterial`) → 첫 렌더 → `gate.finish(() => ready)`. 어느 단계든 예외면 `static`.
- `ready`: 정적 SVG를 숨기고 버튼 줄을 보인다. 끌기(`pointerdown` + `setPointerCapture`, `pointermove` → `dragView`), 버튼(`turnView`/`HOME_VIEW`를 `tweenView`로 `ENTER_MS` 동안, 동작 줄이기면 바로), 렌더할 때마다 이름표 위치(층의 왼쪽 위 모서리를 화면 좌표로 투영해 `transform: translate()`)와 `data-yaw`·`data-pitch`를 고친다.
- 색: `--color-paper`(바탕), `--color-card`(면), `--color-ink`(선), `--color-ink-2`(ghost 선)를 읽어 `new T.Color(value)`. `documentElement`의 `data-theme` MutationObserver와 `matchMedia('(prefers-color-scheme: dark)')` change에 다시 읽고 렌더.
- 크기: ResizeObserver로 `renderer.setSize(w, h, false)`와 `camera.aspect`.
- `webglcontextlost` → 정리하고 `static`.
- dispose: IO·RO·MO·미디어 리스너·포인터 리스너·보간 rAF를 끊고, `gate.cancel()`, 지오메트리·재질 `dispose()`, `renderer.dispose()` + `renderer.forceContextLoss()`.

- [ ] **Step 1: DESIGN.md 문안 넣기**

Components "Day 부품" 그림 틀의 "값 고르기 그림" 다음에 이 줄을 넣는다.

```md
  - 3D 그림(G4): 무대의 그림 자리는 `aspect-ratio: 4 / 3`로 미리 잡는다(늦게 그려져도 밀리지 않는다). 장면은 평면의 네모를 깊이만큼 띄운 판이다. 판 면 `card`, 테두리 선 `ink`, 화면에 그려지지 않는 것(margin, `head`)은 면 없이 `ink-2` 점선. 바탕 `paper`. 이름표는 판 왼쪽 위에 붙는 글자 칸(`card` 바탕, 1px `rule`, 모서리 `var(--space-2xs)`, 안쪽 `0 var(--space-2xs)`, 15px `ink` 800, 코드 이름은 WZH Code)이고 그림 자리 밖으로 넘치면 잘린다. 캔버스는 끌면 돌고(커서 `grab` / `grabbing`, 터치는 가로로만, 세로로 밀면 페이지가 스크롤된다), 무대 아래 시점 버튼 줄(보조 버튼 "← 왼쪽으로", "오른쪽으로 →", "↺ 처음 시점", 사이 `var(--space-xs)`, 줄바꿈 허용)로도 돌린다. 저절로 돌지 않는다. WebGL을 쓸 수 없거나 실패하면 같은 판을 비스듬히 그린 정적 그림과 대체 설명(Body `ink-2`)이 보이고 시점 버튼은 없다. 인쇄도 정적 그림이다.
```

Skeleton 첫 줄 뒤에 "3D 그림은 그림 자리(4:3) 전체 크기의 `track` 상자 하나(모서리 `--radius-btn`)다."를 더하고, Motion 표의 Skeleton 행 "쓰는 곳"을 "검색 결과 자리, 3D 그림 자리"로 고치고, 이 행을 더한다.

```md
| 3D 시점 | 3D 그림의 시점 버튼 | 280ms(`--dur-enter`) 3차 감속(`1 - (1 - t)³`, 카메라는 CSS 곡선을 쓸 수 없어서). 끌기는 손을 바로 따라가고 애니메이션이 없다. 동작 줄이기면 버튼도 바로 바뀐다 |
```

- [ ] **Step 2: 실패하는 테스트 쓰기**

`tests/unit/view3d.test.mjs`에:

```js
test('box model layers nest content in padding in border in margin', async () => {
  const { BOX_LAYERS } = await import('../../textbook/src/figures/box-model-3d.js');
  assert.deepEqual(checkLayers(BOX_LAYERS), []);
  assert.deepEqual(BOX_LAYERS.map((l) => [l.id, l.depth, !!l.ghost]), [['margin', 0, true], ['border', 1, false], ['padding', 2, false], ['content', 3, false]]);
});
```

`tests/build/build.test.mjs`: 기존 `figure code has no raw colors`의 파일 목록에 `views/figure3d.js`, `app/view3d.js`, `app/three.js`를 더한다(없는 파일이면 실패하도록 목록을 고정).

`tests/e2e/figures3d.test.mjs`(M12 `figures.test.mjs`의 서버·컨텍스트 틀을 따른다. 진도는 Day 1~19 완료, 열기 도우미 `open3d(hash, id, { width, reduce, webgl = true, touch = false })`는 `webgl: false`면 init script로 `HTMLCanvasElement.prototype.getContext`가 `'webgl2'`에 `null`을 내게 하고, `.fig3d`를 화면에 스크롤한 뒤 `data-state`가 `ready` 또는 `static`이 되기를 기다린다):
- `box model figure turns by mouse drag`: Day 10, `data-state="ready"`, 캔버스 스크린샷 A → 캔버스 가운데에서 오른쪽으로 120px 끌기 → `data-yaw`가 `25`, 스크린샷 B ≠ A, 첫 이름표 `transform`이 바뀜, 콘솔 오류 0.
- `view buttons turn and reset by keyboard`: 동작 줄이기, "오른쪽으로 →"에 포커스하고 Enter → `data-yaw="-5"`, "↺ 처음 시점" Enter → `-35`/`20`, 포커스는 누른 버튼에 남음.
- `buttons ease over 280ms without reduced motion`: 버튼을 누른 직후 `data-yaw`가 −35와 −5 사이, 400ms 뒤 `-5`.
- `no WebGL shows the static figure and the description`: `webgl: false` → `data-state="static"`, `svg.fig3d-static` 보임, `.fig3d-desc`가 보이고 글이 `figure-art`의 `aria-label`과 같음, `canvas` 없음, `.figure-views` 숨김, 콘솔 오류 0.
- `context loss falls back to the static figure`: ready 뒤 `canvas.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext()` → `static`, 오류 0.
- `slow start shows the skeleton for at least 300ms`: CDP `Emulation.setCPUThrottlingRate { rate: 20 }`를 건 뒤 스크롤 → `.skeleton-block`이 보인 시각과 사라진 시각의 차가 300ms 이상, 그 뒤 `ready`, 보이는 동안 `figure-art[aria-busy="true"]`.
- `theme switch repaints the 3D figure`: ready 뒤 캔버스 스크린샷 → 테마 메뉴로 다크 → 스크린샷이 다름, `data-state` 그대로.
- `leaving and returning six times leaks no WebGL context`: Day 10 ↔ 홈 6번(`location.hash`) → 문서 안 `canvas` 1개, 콘솔 메시지(경고 포함)에 `WebGL` 0건.
- `touch scroll passes through the 3D figure`: 375px, `hasTouch: true`, 캔버스 `touch-action`이 `pan-y`, `document.documentElement.scrollWidth <= innerWidth`.
- `3D figure prints as the static figure`: `page.emulateMedia({ media: 'print' })` → `svg.fig3d-static` 보임, `canvas`·`.figure-views` 안 보임.
- `JS off keeps the built description`: `javaScriptEnabled: false` → Day 10 그림 자리에 대체 설명 문단.
- `pixel ratio is capped at 2`: `deviceScaleFactor: 3` 컨텍스트에서 ready 뒤 `canvas.width === Math.round(canvas.clientWidth * 2)`.

- [ ] **Step 3: 실패 확인**

Run: `npm test` → 새 단위 FAIL. Run: `node --test ../tests/e2e/figures3d.test.mjs` → FAIL(`figure[data-figure="box-model-3d"]` 없음).

- [ ] **Step 4: 구현**
- `views/figure3d.js`: 위 흐름 그대로. 모듈 맨 위에서 `document`·`window`를 읽지 않는다(빌드가 Node에서 등록표를 import한다).
- `figures/box-model-3d.js`: 층 데이터(평면 320×240 안, 안쪽 간격 margin→border 24, border→padding 10, padding→content 28) + `mount = (fig, opts) => layerFigure(fig, { layers: BOX_LAYERS, ...opts })`.
- `figures.css`: `.fig3d`(position relative, `aspect-ratio: 4 / 3`, overflow hidden, 모서리 `var(--space-2xs)`), `canvas`(block, 100%, `touch-action: pan-y`, `cursor: grab`, 누르는 중 `grabbing`), `.fig3d-labels`(absolute inset 0, `pointer-events: none`), `.fig3d-label`(DESIGN 문안), `.fig3d-static`(100%), `[data-state="ready"] .fig3d-static { display: none }`, `.fig3d-desc`는 `static`일 때만, `.fig-ghost`(면 없음, `ink-2` 점선), `.figure-views`(flex wrap, gap `var(--space-xs)`), `@media print`(캔버스·이름표·버튼 숨김, 정적 그림 보임).
- `components.css`: `.skeleton-block`(absolute inset 0, `track`, `--radius-btn`, 기존 `skeleton-pulse` 공유, 동작 줄이기 정지 규칙에 같이 넣음).
- `day-10.md`: "안쪽부터 네 겹이에요." 뒤의 `text` 블록을 아래로 바꾼다.

```md
:::figure box-model-3d
캡션: CSS 박스 모델 — 내용, 안쪽 여백, 테두리, 바깥 여백
대체 설명: 가운데 내용(content)을 padding(안쪽 여백)이 감싸고, 그 바깥을 border(테두리)가, 맨 바깥을 margin(바깥 여백)이 감싸요. 그림을 끌거나 시점 버튼으로 돌려 보면 네 겹이 한 층씩 떨어져 있어서, 정면에서 겹쳐 보이던 상자가 어떤 순서로 쌓였는지 보여요. margin은 화면에 색이 칠해지지 않는 빈 공간이라 점선으로 그렸어요.
:::
```

- [ ] **Step 5: 통과 확인**

Run: `npm test`, `npm run check -- --allow-missing`, `node --test ../tests/e2e/figures3d.test.mjs` → 모두 PASS. 실패하면 원인을 고치고 다시 돈다.

- [ ] **Step 6: 눈으로 확인**

`npm run build`로 만든 페이지를 로컬 서버로 열어 Day 10 그림을 375·768·1280 × 라이트·다크로 찍고(저장소 밖 스크래치), DESIGN 문안과 대조한다. 이름표가 겹치거나 판이 잘리면 층 간격·카메라 거리를 고친다(값은 `view3d.js` 상수와 층 데이터).

- [ ] **Step 7: Commit**

```bash
git add DESIGN.md textbook/src/app/views/figure3d.js textbook/src/figures/box-model-3d.js textbook/src/figures/index.js textbook/src/styles/figures.css textbook/src/styles/components.css textbook/content/p1/day-10.md tests/unit/view3d.test.mjs tests/build/build.test.mjs tests/e2e/figures3d.test.mjs
git commit -m "feat(figures): 3D layer figure frame with skeleton and static fallback, box model for day 10"
```

---

### Task 4: DOM 트리 그림(Day 6·20)과 콘텐츠 규칙

**Files:**
- Create: `textbook/src/figures/dom-tree-3d.js`
- Modify: `textbook/src/figures/index.js`, `textbook/content/p1/day-06.md`, `textbook/content/p1/day-20.md`, `docs/CONTENT-GUIDE.md`, `tests/unit/view3d.test.mjs`, `tests/build/build.test.mjs`, `tests/e2e/figures3d.test.mjs`

**Interfaces:**
- Consumes: `layerFigure`(Task 3), `checkLayers`(Task 2).
- Produces (`figures/dom-tree-3d.js`): `SITE_LAYERS`(Day 6: `body` 0 → `header`·`main`·`footer` 1 → `a`·`nav`(header 안)·`section`(main 안) 2), `CARD_LAYERS`(Day 20: `html` 0 → `head`(ghost)·`body` 1 → `header`·`main` 2 → `h1`·`div#video-list` 3 → `article.card` ×2(id `card-1`, `card-2`) 4), `mountSite`, `mountCards`. 이름표는 태그 글자 그대로(`code: true`). `div#video-list` 층의 id는 `video-list`다. 배열 순서는 깊이 오름차순, 같은 깊이는 위에서 아래(왼쪽에서 오른쪽) 순서다(이름표·e2e가 이 순서를 쓴다).
- Produces (`figures/index.js`): `'dom-tree-site'`(Day 6), `'dom-tree-cards'`(Day 20) 등록, `THREE_D`에 둘 더함.

- [ ] **Step 1: CONTENT-GUIDE 1.7 고치기**

등급 표의 G4 줄을 `| G4 | 3D 그림: 끌거나 시점 버튼으로 돌려 본다 | 박스 모델, DOM 트리 |`로 바꾸고, 목록 끝에 두 줄을 더한다.

```md
- G4는 깊이(겹침·층·앞뒤)가 개념 자체일 때만 쓴다. 한 문서에 3D 그림은 하나만 둔다(빌드 테스트가 막는다). 대체 설명에는 돌려 봐야 보이는 것(층의 순서)까지 글로 쓴다.
- WebGL을 쓸 수 없는 컴퓨터에서는 같은 그림의 정적 모양과 대체 설명이 보인다. 그래서 본문에 "그림을 돌려 보세요"만으로 끝나는 지시를 쓰지 않는다.
```

- [ ] **Step 2: 실패하는 테스트 쓰기**

단위:

```js
test('dom tree layers follow the day 6 and day 20 nesting', async () => {
  const { SITE_LAYERS, CARD_LAYERS } = await import('../../textbook/src/figures/dom-tree-3d.js');
  assert.deepEqual(checkLayers(SITE_LAYERS), []);
  assert.deepEqual(checkLayers(CARD_LAYERS), []);
  assert.deepEqual(SITE_LAYERS.filter((l) => l.depth === 1).map((l) => l.label), ['header', 'main', 'footer']);
  assert.deepEqual(CARD_LAYERS.filter((l) => l.depth === 4).map((l) => [l.label, l.parent]), [['article.card', 'video-list'], ['article.card', 'video-list']]);
  assert.equal(CARD_LAYERS.find((l) => l.label === 'head').ghost, true);
});
```

빌드:

```js
test('a document has at most one 3D figure', async () => {
  const { THREE_D } = await import('../../textbook/src/figures/index.js');
  const files = (await readdir(path.join(ROOT, 'textbook', 'content'), { recursive: true })).filter((f) => f.endsWith('.md')).map((f) => path.join(ROOT, 'textbook', 'content', f));
  for (const file of files) {
    const ids = [...(await readFile(file, 'utf8')).matchAll(/^:::figure (\S+)/gm)].map((m) => m[1]).filter((id) => THREE_D.has(id));
    assert.ok(ids.length <= 1, `${path.relative(ROOT, file)}: ${ids.join(', ')}`);
  }
  assert.deepEqual([...THREE_D].sort(), ['box-model-3d', 'dom-tree-cards', 'dom-tree-site']);
});
```

e2e:
- `day 6 and day 20 DOM trees open and turn`: 두 Day 각각 `ready`, 이름표 글이 층 데이터 순서와 같음(Day 6: `body, header, main, footer, a, nav, section`), "오른쪽으로 →" 뒤 `data-yaw` 변화, 오류 0.
- `3D figures fit 320px`: 320px에서 Day 6·10·20 각각 `scrollWidth <= innerWidth`, `.fig3d` 오른쪽 끝 ≤ 글 열 오른쪽 끝, 모든 `.fig3d-label`이 보이는 영역 밖으로 넘친 부분은 `.fig3d`가 잘라 문서 폭을 늘리지 않음, 시점 버튼 줄이 두 줄 이상이어도 버튼마다 44px 이상 높이.

- [ ] **Step 3: 실패 확인** — Run: `npm test` → FAIL(모듈 없음, `THREE_D` 하나뿐).

- [ ] **Step 4: 구현과 본문**
- `dom-tree-3d.js`: 층 데이터(평면 320×240 안, 자식은 부모 안쪽 위에서 아래로 배치) + `mountSite`/`mountCards` = `layerFigure`에 각 데이터.
- `day-06.md`: "개발자 도구: 웹페이지의 엑스레이" 절 첫 문단 뒤, `:::warn` 앞에 넣는다.

```md
:::figure dom-tree-site
캡션: 겹쳐 놓인 HTML 상자를 옆에서 보면 나무가 돼요
대체 설명: body 안에 header, main, footer 세 상자가 있어요. header 안에는 로고 링크 a와 메뉴 nav가, main 안에는 section이 들어 있어요. 정면에서 보면 상자가 겹쳐 놓인 페이지 모양이고, 옆으로 돌리면 안쪽 상자일수록 한 층씩 위에 떠 있어서 body를 뿌리로 하는 나무가 보여요. Elements 패널에서 들여쓰기 한 칸이 이 그림의 한 층이에요.
:::
```

- `day-20.md`: 개념 절의 `text` 나무 블록 바로 뒤에 넣는다(블록은 남긴다).

```md
:::figure dom-tree-cards
캡션: HTML 상자와 DOM 나무는 같은 구조예요
대체 설명: html 아래에 head와 body가 있고, body 안에 header와 main이, main 안에 h1과 div#video-list가, div#video-list 안에 article.card 두 개가 있어요. 정면에서는 상자가 겹친 페이지로 보이고, 옆으로 돌리면 안쪽 요소일수록 한 층씩 높이 떠서 위 나무 그림과 같은 층이 보여요. head는 화면에 그려지지 않는 요소라 점선으로 그렸어요.
:::
```

- [ ] **Step 5: 통과 확인**

Run: `npm test`, `npm run check -- --allow-missing`, `npm run test:e2e` → 모두 PASS(기존 252 + 새 e2e).

- [ ] **Step 6: 눈으로 확인** — Day 6·20 그림을 375·1280 × 2테마로 찍어 이름표 겹침·잘림을 확인하고 층 데이터를 다듬는다.

- [ ] **Step 7: Commit**

```bash
git add textbook/src/figures/dom-tree-3d.js textbook/src/figures/index.js textbook/content/p1/day-06.md textbook/content/p1/day-20.md docs/CONTENT-GUIDE.md tests/unit/view3d.test.mjs tests/build/build.test.mjs tests/e2e/figures3d.test.mjs
git commit -m "feat(figures): 3D DOM tree figures for day 6 and day 20"
```

---

### Task 5: 기준 이미지, 전 페이지 점검, 크기, 마무리

**Files:**
- Modify: `tests/visual/visual.test.mjs`, `tests/visual/README.md`(장면 옵션 설명이 있으면), `tests/visual/baseline/`(승인 뒤), `docs/superpowers/specs/2026-11-12-unified-roadmap-design.md`(11장 M14 행), `docs/CHECKPOINT.md`, `docs/checkpoint/workspace/progress.md`, 루트 `index.html`

**Interfaces:**
- Consumes: `.fig3d[data-state]`(Task 3).
- Produces: 장면 옵션 `ready`(찍기 전에 기다릴 선택자)와 `webgl: false`(init script로 `getContext('webgl2')` → `null`).

- [ ] **Step 1: 장면 추가**

```js
{ id: 'fig-box-3d', hash: '#/day/p1-d10', progress: P1_FIRST_TEN, scrollTo: 'figure.figure', ready: '.fig3d[data-state="ready"]' },
{ id: 'fig-box-static', hash: '#/day/p1-d10', progress: P1_FIRST_TEN, widths: [375, 1280], webgl: false, scrollTo: 'figure.figure', ready: '.fig3d[data-state="static"]' },
{ id: 'fig-dom-site', hash: '#/day/p1-d06', progress: P1_FIRST_TEN, widths: [375, 1280], scrollTo: 'figure.figure', ready: '.fig3d[data-state="ready"]' },
{ id: 'fig-dom-cards', hash: '#/day/p1-d20', progress: P1_FIRST_NINETEEN, widths: [1280], scrollTo: 'figure.figure', ready: '.fig3d[data-state="ready"]' },
```

`P1_FIRST_NINETEEN`은 `P1_FIRST_TEN`과 같은 방식(Day 1~19, `lastDay: 'p1-d19'`). 새 기준 이미지는 6 + 4 + 4 + 2 = 16장(204 → 220).

- [ ] **Step 2: 새 장면을 찍어 사용자에게 보이고 승인받기**

Run: `npm run test:visual` → 새 장면만 "기준 없음"으로 실패하고 기존 204장은 PASS여야 한다(기존 장면이 바뀌면 원인을 찾는다). 새 16장을 보여 주고 승인 뒤 `npm run test:visual:update`. 같은 PC에서 두 번 연속 `npm run test:visual`이 PASS인지 본다(SwiftShader 렌더가 흔들리지 않는지).

- [ ] **Step 3: 전 페이지 점검**

Run: `npm run build:site` 뒤 `_site`를 로컬 정적 서버로 띄우고 `npm run check:site -- <그 주소>` → 320·375·768·1280·1920 각각 "방문 168개, 문제 0개".

- [ ] **Step 4: 크기 측정(완료 기준 ③)**

Run: `npm run build` 뒤 루트 `index.html` 바이트 수와 `d900f83`의 6,801,317바이트 차이를 잰다. 3D와 무관한 증가(본문 몇 줄)를 빼지 않고 전체 차이로 본다.
Expected: 차이 ≤ 700,000. 넘으면 `entry.js`에서 안 쓰는 클래스를 빼거나 그림 코드를 줄이고 다시 잰다.

- [ ] **Step 5: 기준선 전체**

Run: `npm test`, `npm run check -- --allow-missing`, `npm run test:e2e`, `npm run test:visual` → 모두 PASS, 통과 수를 적는다.

- [ ] **Step 6: 브랜치 자체 리뷰**

`git diff d900f83..HEAD`를 처음부터 읽고 Review Focus 5개, Global Constraints, 개편 7.3 목록(시작 시점, 루프 없음, 하나, 픽셀 비, 실패, 접근성)을 하나씩 대조한다. 찾은 것은 재현 테스트 → 수정 → 전체 테스트로 바로 끝낸다.

- [ ] **Step 7: 문서**
- 로드맵 11장 M14 행 끝에 `(M13에서 넘김: 라이선스 문서에 three.js MIT 표기를 넣는다. 지금은 index.html의 엔진 블록 앞 주석에 LICENSE 전문이 있다)`.
- `progress.md`에 `M13: complete` 줄(테스트 수, 크기 차이, 확인하지 못한 것: Safari·Firefox의 3D, 실제 GPU, 화면 낭독기, 휴대폰 실기기 터치).
- `CHECKPOINT.md` 맨 위 상태·기준선 숫자·0장 "끝난 것"에 M13 한 항목, 다음은 M14.

- [ ] **Step 8: Commit**

```bash
git add tests/visual docs/superpowers/specs/2026-11-12-unified-roadmap-design.md docs/CHECKPOINT.md docs/checkpoint/workspace/progress.md index.html
git commit -m "docs: M13 complete"
```

완료 보고에 넣을 것: 테스트 명령과 통과 수, Day 10 그림을 끈 전·후(끌기 전·후) 스크린샷, WebGL 끈 정적 그림 스크린샷, 크기 차이 숫자, 확인하지 못한 것.
