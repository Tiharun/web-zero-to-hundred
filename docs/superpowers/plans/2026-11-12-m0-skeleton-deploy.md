# M0 골격+배포 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task (사용자 결정: Native, 한 세션). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 교재의 모든 페이지가 새 디자인 토큰·공통 레이아웃(헤더, 사이드바, 본문, 푸터)·공용 컴포넌트 위에서 열리고, push하면 GitHub Pages에 자동으로 배포된다.

**Architecture:** 기존 빌드·로직·테스트를 유지하는 제자리 개편이다. `styles.css`를 `styles/` 폴더로 나누고 `DESIGN.md` 토큰을 `tokens.css` 한 곳에 둔다. 아직 개편하지 않은 화면(홈 본문, Day 본문, 검색, 설정)은 `legacy.css`의 옛 변수 이름을 새 토큰에 이어 붙여 같은 팔레트로 보이게 하고, 뒤 마일스톤이 화면마다 `legacy.css`를 줄여 간다. 사이트 이름·주소·설명은 `curriculum.json` 한 곳에서 읽어 빌드가 채운다.

**Tech Stack:** Node.js 22(ESM), esbuild 0.28.2, marked 18.1.2, highlight.js 11.12.0, `node:test`, 전역 Playwright 1.63.0, Python 3 + fontTools + brotli(글꼴 서브셋), pixelmatch 8.0.0 + pngjs 7.0.0(시각 비교), GitHub Actions + GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-11-12-unified-roadmap-design.md` (11.1 M0, 4·5·7·8·9장). 시각 값은 `DESIGN.md`, 승인 시안은 `design-system/web-zero-to-hundred/prototype/src/`(로컬 전용).

## 범위 (사용자 지정, 2026-11-12)

스펙 11.1의 M0에 사용자가 다음을 더했다: **사이트맵 전 페이지, 공통 레이아웃, 공용 컴포넌트, 404, siteConfig, 자동 배포**. 추가 완료 기준: **배포 URL에서 전 페이지가 열리고, 헤더·푸터가 홈(승인 시안)과 같은 품질**.

헤더가 시안과 같으려면 글꼴과 아이콘이 필요하다. 그래서 스펙의 M1에 있던 웹폰트·아이콘·공용 부품과 M2에 있던 상단 바·테마 Dropdown이 M0로 온다(Task 10에서 스펙 11장을 고친다).

**M0에 넣지 않는 것** (스펙의 뒤 마일스톤):
- 사이드바의 Day 행 상태 5종·월드 Accordion 모양·`<dialog>` Drawer·월드 전환 메뉴 → M2. M0의 사이드바는 구조와 서랍 동작을 그대로 두고 토큰 색만 입힌다.
- 검색 Modal(Ctrl+K) → M5. M0의 헤더 검색 버튼은 `#/search` 페이지로 간다.
- `motion.js`(Tilt, Magnetic, Reveal, stagger) → M1. M0의 모션은 CSS 전환(누름, hover, 메뉴 열림)뿐이다.
- 홈·월드·Day·검색·설정 **본문**의 새 모양 → M3~M11. M0에서는 새 팔레트·새 글꼴로 열리기만 한다.
- 부록 설치 체크리스트·단축키표·졸업 로드맵 → C33(본문이 아직 없다).

## Global Constraints

- 색·글꼴·크기·간격·모서리·턱·모션 값은 `DESIGN.md` 토큰(`var(--…)`)만 쓴다. 색 값과 `font-family` 글꼴 이름은 `styles/tokens.css`와 `styles/legacy.css`에만 있을 수 있다.
- `DESIGN.md`에 없는 값이 필요하면 멈추고 수정안을 사용자에게 보인다. 푸터는 `DESIGN.md`에 없는 부품이므로 Task 6의 승인 단계를 거친다.
- 사이트 이름·주소·설명은 `textbook/content/curriculum.json`의 `title`, `url`, `description`만 원천이다. 다른 파일에 직접 쓰지 않는다.
- `index.html` 파일 하나, 외부 요청 0건, 더블클릭(`file:`)으로 동작한다.
- Named Rules: One Pink(한 화면에 분홍 면은 주 버튼 하나와 "오늘" 표시뿐), Paper Check(분홍 글자는 `accent-text`), Solid Ledge(흐림 그림자 금지), Press(누르면 턱 −1px, 60ms), Two Icon(조작은 선 아이콘, 게임 물건은 도트 아이콘), Label-Only Pixel(Galmuri는 12px 라벨에만).
- 굵기는 400과 800만 쓴다. 테두리는 카드 2px, 상단 바·사이드바·푸터·구분선 1px.
- 화면 글자는 `textContent`로 넣는다. `innerHTML`은 `icons.js`의 고정 SVG 문자열에만 쓴다.
- 버전·명령·URL은 `docs/research/external-facts.md`에 먼저 적고 인용한다.
- 저장소 파일에 모델 식별자와 개인정보를 쓰지 않는다. 커밋 메시지에 attribution 줄을 붙이지 않는다.
- 커밋과 push는 사용자 허락이 있어야 한다. 이 계획은 push 없이는 배포 기준을 확인할 수 없으므로, **세션을 시작할 때 "Task마다 커밋하고 Task 9에서 push해도 되는지" 한 번 묻는다.** 허락이 없으면 커밋 단계를 건너뛰고 Task 9 앞에서 멈춘다.
- Playwright는 `file:` 대신 `tests/helpers/static-server.mjs`의 `127.0.0.1` 서버로 연다(기존 e2e의 `file:` 사용은 그대로 둔다).
- 완료를 말하기 전에 실행한 명령과 출력을 보고에 넣는다. 화면은 375·768·1280 × 라이트·다크 스크린샷을 보인다.

## 확인한 사실 (2026-11-12)

| 항목 | 값 | 근거 |
|---|---|---|
| `actions/checkout` | `v7.0.1` | 측정: `gh api repos/actions/checkout/releases/latest` |
| `actions/setup-node` | `v7.1.0` | 측정: 같은 방법 |
| `actions/setup-python` | `v7.1.0` | 측정 |
| `actions/configure-pages` | `v6.0.0` | 측정 |
| `actions/upload-pages-artifact` | `v5.0.0` | 측정 |
| `actions/deploy-pages` | `v5.0.1` | 측정 |
| `pixelmatch` | `8.0.0`, ESM | 측정: `npm view pixelmatch version`, `type` |
| `pngjs` | `7.0.0`, Node ≥ 14.19 | 측정: `npm view pngjs` |
| 이 PC | Node `v22.21.0`, Python `3.12.4`, fontTools `4.66.1`, brotli 있음 | 측정 |
| 글꼴 원본 | `design-system/web-zero-to-hundred/prototype/.fonts/`에 `WantedSansVariable.ttf`(4.7MB), `Galmuri11.ttf`(5.4MB), `D2Coding.ttf`(4.1MB), `OFL-*.txt` 3개. git 제외 폴더 | 측정 |
| 배포 job 권한 | `pages: write`, `id-token: write`, `github-pages` 환경 | 검색: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages |
| 저장소 | 공개, Pages 꺼짐, 브랜치 `claude/gifted-goldberg-u1f9c6` 하나 | 측정 |

스펙 9장에 적힌 액션 버전(v5/v4/v4)은 검색 결과였고 낡았다. 위 값이 맞다(Task 10에서 스펙을 고친다).

**확인되지 않음**: 각 액션의 새 주 버전에서 입력 이름이 바뀌었는지. Task 9의 첫 단계에서 각 저장소의 `README`를 읽고 워크플로를 쓴다.

## Review Focus

1. **`url`이 `/`로 끝나지 않거나 `http:`일 때**: 빌드가 `E_CUR_SCHEMA`로 멈춰야 한다. 잘못된 주소가 canonical·404 링크에 들어가면 안 된다. → Task 1
2. **Python이나 fontTools가 없는 PC에서 빌드할 때**: 스택 추적 대신 `E_FONT_TOOL`과 설치 방법 한 줄이 나와야 한다. → Task 3
3. **저장된 테마가 `dark`인데 시스템은 라이트일 때 첫 화면**: 스크립트가 돌기 전에도 다크로 그려져야 한다(깜빡임 없음). 기존 `theme-init` 동작이 헤더 개편 뒤에도 유지돼야 한다. → Task 6
4. **없는 Day·월드·부록 id(`#/day/zz-d99`)와 배포본의 없는 경로(`/web-zero-to-hundred/abc`)**: 둘 다 404 화면과 홈으로 가는 링크가 나와야 한다. → Task 7
5. **375px에서 긴 사이트 이름**: 워드마크가 줄바꿈되거나 헤더 밖으로 넘치지 않고, 가로 스크롤이 0이어야 한다. → Task 6

## 파일 구조

| 파일 | 책임 | 상태 |
|---|---|---|
| `textbook/content/curriculum.json` | `title`, `url`, `description` 추가(siteConfig) | 수정 |
| `textbook/lib/curriculum.mjs` | `url`, `description` 스키마 검사 | 수정 |
| `textbook/lib/site.mjs` | `headTags(site, favicon)`, `faviconDataUri(tokensCss)`, `listRoutes(cur)` | 신규 |
| `textbook/lib/styles.mjs` | `readStyles(srcDir)`, `lintStyles(files)` | 신규 |
| `textbook/lib/fonts.mjs` | `embedFonts({ textAll, textCode, fontsDir, cacheDir })` | 신규 |
| `textbook/lib/assemble.mjs` | 자리표시자 `HEAD` 추가, `{{WZH_TITLE}}` 치환 | 수정 |
| `textbook/build.mjs` | 위 모듈 연결, `--notfound` 변형 | 수정 |
| `textbook/fonts/` | 글꼴 원본 3개 + `OFL-*.txt` 3개 | 신규(복사) |
| `textbook/src/template.html` | 헤더·셸·푸터 뼈대, `<!--WZH:HEAD-->` | 수정 |
| `textbook/src/styles/tokens.css` | `DESIGN.md` 부록의 토큰 블록 그대로 | 신규 |
| `textbook/src/styles/legacy.css` | 옛 변수 이름 → 새 토큰. 미정 색(알림·코드·강조·위험) 보관 | 신규 |
| `textbook/src/styles/base.css`, `shell.css`, `components.css`, `home.css`, `day.css`, `pages.css`, `print.css` | 기존 `styles.css`를 구역별로 나눈 것 | 신규(분리) |
| `textbook/src/styles.css` | 삭제 | 삭제 |
| `textbook/src/app/views/icons.js` | 선 아이콘, 도트 아이콘 | 신규 |
| `textbook/src/app/views/common.js` | `card`, `chip`, `chips`, `notice`, `textLink`, `primaryButton` 추가. `notFoundScreen` 개편 | 수정 |
| `textbook/src/app/views/shell.js` | 헤더(워드마크, 검색 버튼, 테마 메뉴), 푸터 | 수정 |
| `textbook/src/app/views/search.js` | 검색 입력칸을 검색 페이지로 옮김 | 수정 |
| `textbook/src/app/main.js` | 없는 id → 404, `data-notfound` 처리 | 수정 |
| `textbook/package.json` | `test:visual`, `check:site` 스크립트, devDependency 2개 | 수정 |
| `tests/unit/site.test.mjs`, `styles.test.mjs`, `fonts.test.mjs`, `icons.test.mjs` | 단위 | 신규 |
| `tests/build/build.test.mjs`, `tests/e2e/textbook.test.mjs`, `tests/e2e/smoke.test.mjs` | 바뀐 헤더·자리표시자에 맞춤, 사이트맵 전 경로 | 수정 |
| `tests/e2e/layout.test.mjs` | 헤더·테마 메뉴·푸터·404 동작 | 신규 |
| `tests/visual/visual.test.mjs`, `tests/visual/baseline/` | 스크린샷 비교 | 신규 |
| `tests/helpers/site-check.mjs` | 주어진 주소의 전 경로 점검(로컬·배포 공용) | 신규 |
| `.github/workflows/deploy.yml` | 테스트 → 빌드 → Pages | 신규 |
| `docs/research/external-facts.md` | 위 "확인한 사실" 표 추가 | 수정 |
| `docs/CHECKPOINT.md`, `CLAUDE.md`, 스펙 9·11장, `DESIGN.md`(Footer) | 문서 갱신 | 수정 |

---

### Task 1: 기준선과 siteConfig

**Files:**
- Modify: `textbook/content/curriculum.json`, `tests/fixtures/content/curriculum.json`, `textbook/lib/curriculum.mjs`, `textbook/lib/assemble.mjs`, `textbook/build.mjs`, `textbook/src/template.html`, `docs/research/external-facts.md`
- Create: `textbook/lib/site.mjs`
- Test: `tests/unit/site.test.mjs`, `tests/unit/curriculum.test.mjs`, `tests/unit/assemble.test.mjs`, `tests/build/build.test.mjs`

**Interfaces:**
- Produces:
  - `curriculum.json` 최상위 키 `url`(글자, `https://`로 시작하고 `/`로 끝남), `description`(비어 있지 않은 글자)
  - `headTags(site: { title, url, description }, faviconHref: string): string` — `<title>`, `<meta name="description">`, `<link rel="canonical">`, `<meta property="og:title|og:description|og:url|og:type">`, `<link rel="icon">`. 모든 값은 HTML 속성 이스케이프를 거친다
  - `listRoutes(cur): string[]` — `#/`, `#/settings`, `#/search`, `#/project/<pid>`…, `#/day/<id>`…, `#/page/<id>`… 순서
  - `assemble({ templateHtml, css, js, data, templates, head, title })` — 자리표시자 `CSS`, `HEAD`, `DATA`, `TEMPLATES`, `JS` 각각 정확히 하나. `{{WZH_TITLE}}`는 몇 번이든 이스케이프한 `title`로 바꾼다
  - 실행 데이터 `data.url`, `data.description`

- [ ] **Step 1: 기준선을 잰다**

Run (PowerShell, `textbook/`에서): `$env:NODE_PATH = (npm root -g); npm ci; npm test; npm run check -- --allow-missing; npm run test:e2e`
Expected: 단위·빌드 168 통과, "검사 통과: Day 155개", e2e 26 통과. 숫자가 다르면 멈추고 원인을 보고한다.

- [ ] **Step 2: 확인한 사실을 `external-facts.md`에 적는다**

이 계획의 "확인한 사실" 표를 "교재 사이트 빌드·배포" 절로 추가한다(확인 날짜 2026-11-12, 확인 명령 포함).

- [ ] **Step 3: 실패하는 테스트를 쓴다**

`tests/unit/curriculum.test.mjs`에 추가:
```js
test('url must be https and end with a slash; description must be text', async () => {
  for (const [patch, where] of [
    [{ url: 'http://example.test/book/' }, 'url'],
    [{ url: 'https://example.test/book' }, 'url'],
    [{ url: undefined }, 'url'],
    [{ description: '' }, 'description'],
  ]) {
    const { errors } = await loadWith(patch); // 픽스처 사본에 patch 를 덮어쓴 뒤 loadCurriculum
    assert.ok(errors.some((e) => e.code === 'E_CUR_SCHEMA' && e.message.startsWith(where)), where);
  }
});
```
`tests/unit/site.test.mjs`:
```js
test('headTags escapes values and carries the one configured url', () => {
  const html = headTags({ title: 'A & "B"', url: 'https://example.test/book/', description: '<설명>' }, 'data:image/svg+xml,x');
  assert.match(html, /<title>A &amp; &quot;B&quot;<\/title>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/example\.test\/book\/">/);
  assert.match(html, /<meta property="og:url" content="https:\/\/example\.test\/book\/">/);
  assert.match(html, /<meta name="description" content="&lt;설명&gt;">/);
  assert.match(html, /<link rel="icon" href="data:image\/svg\+xml,x">/);
});
test('listRoutes lists every screen once', () => {
  const routes = listRoutes({ projects: [{ id: 'fa', days: [{ id: 'fa-d01' }, { id: 'fa-d02' }] }], pages: [{ id: 'start' }] });
  assert.deepEqual(routes, ['#/', '#/settings', '#/search', '#/project/fa', '#/day/fa-d01', '#/day/fa-d02', '#/page/start']);
});
```
`tests/unit/assemble.test.mjs`에 추가: `{{WZH_TITLE}}`가 두 번 있는 템플릿에서 둘 다 `A &amp; B`로 바뀌고, `<!--WZH:HEAD-->`가 없으면 던진다.
`tests/build/build.test.mjs`에 추가:
```js
test('site name and address come from curriculum.json only', async () => {
  // 픽스처 사본의 title 을 '바꾼 이름', url 을 'https://example.test/x/' 로 바꿔 빌드
  assert.match(html, /<title>바꾼 이름<\/title>/);
  assert.equal(html.includes('픽스처 교재'), false);
  assert.equal(embeddedData(html).url, 'https://example.test/x/');
  // 저장소 소스에 이름·주소가 직접 적혀 있지 않다
  for (const f of await sourceFiles('textbook/src', 'textbook/lib', 'textbook/build.mjs')) {
    const src = await readFile(f, 'utf8');
    assert.equal(src.includes(realCur.title), false, f);
    assert.equal(src.includes(realCur.url), false, f);
  }
});
```

- [ ] **Step 4: 실패를 확인한다**

Run: `npm test`
Expected: 새 테스트가 `headTags is not a function`, `E_CUR_SCHEMA` 없음 등으로 실패.

- [ ] **Step 5: 구현한다**

- `curriculum.json`에 `"url"`과 `"description"`을 `title` 아래에 추가한다. `description`: `"프로그래밍이 처음인 사람이 Day 1부터 혼자 따라가는 웹 개발 교재"`. `url`: GitHub Pages 프로젝트 사이트 주소(`gh api repos/{owner}/{repo} --jq '"https://" + .owner.login + ".github.io/" + .name + "/"'`의 출력). Task 9에서 실제 `html_url`과 같은지 다시 확인한다.
- 픽스처 `curriculum.json`에 `"url": "https://example.test/fixture/"`, `"description": "픽스처 설명"`.
- `curriculum.mjs`: `title` 검사 옆에 `url`(정규식 `^https:\/\/[^\s]+\/$`), `description` 검사.
- `site.mjs`: `headTags`, `listRoutes`. (`faviconDataUri`는 Task 4에서 추가한다. 이 Task에서는 `build.mjs`가 `'data:,'`를 넘긴다.)
- `assemble.mjs`: `PLACEHOLDERS`에 `HEAD`, `{{WZH_TITLE}}` 치환.
- `template.html`: `<title>…</title>`을 지우고 `<!--WZH:HEAD-->`를 둔다. `.brand` 글자를 `{{WZH_TITLE}}`로 바꾼다.
- `build.mjs`: `data`에 `url`, `description` 추가. `routes` 집합을 `listRoutes(curriculum)` + 용어 경로로 만든다. `assemble`에 `head`, `title`을 넘긴다.

- [ ] **Step 6: 통과를 확인한다**

Run: `npm test; npm run check -- --allow-missing; npm run test:e2e`
Expected: 전부 통과(단위·빌드 수는 168 + 새 테스트 수).

- [ ] **Step 7: 커밋(허락받았을 때)**

```bash
git add textbook/content/curriculum.json tests/fixtures/content/curriculum.json textbook/lib textbook/build.mjs textbook/src/template.html tests/unit tests/build docs/research/external-facts.md
git commit -m "feat(site): single-source site title, url and description"
```

---

### Task 2: 스타일 분리, 토큰, 토큰 검사

**Files:**
- Create: `textbook/lib/styles.mjs`, `textbook/src/styles/{tokens,legacy,base,shell,components,home,day,pages,print}.css`
- Delete: `textbook/src/styles.css`
- Modify: `textbook/build.mjs`
- Test: `tests/unit/styles.test.mjs`, `tests/build/build.test.mjs`, `tests/e2e/textbook.test.mjs`

**Interfaces:**
- Produces:
  - `STYLE_ORDER = ['tokens', 'legacy', 'base', 'shell', 'components', 'home', 'day', 'pages', 'print']`
  - `readStyles(srcDir): Promise<{ css: string, files: { name: string, file: string, src: string }[] }>` — `srcDir/styles/<name>.css`를 `STYLE_ORDER` 순서로 읽어 이어 붙인다. 폴더가 없거나 `tokens.css`가 없으면 `E_NO_CSS`
  - `lintStyles(files): Issue[]` — 오류 코드 `E_CSS_RAW_COLOR`(색 값: `#` 뒤 3~8자리 16진수, `rgb(`, `rgba(`, `hsl(`, `hsla(`, `oklch(`, `color-mix(`), `E_CSS_RAW_FONT`(`font-family:` 값이 `var(--font-`로 시작하지 않고 `inherit`도 아님). `tokens.css`와 `legacy.css`는 검사하지 않는다. 주석 안은 무시한다. `{ code, message, file, line }`
  - `legacy.css`가 정의할 수 있는 변수 이름의 허용 목록 `LEGACY_VARS`(아래 표). 다른 이름이 있으면 `E_CSS_LEGACY_VAR`

- [ ] **Step 1: 실패하는 테스트를 쓴다**

`tests/unit/styles.test.mjs`:
```js
test('lintStyles flags raw colours and font names outside tokens and legacy', () => {
  const issues = lintStyles([
    { name: 'tokens', file: 't.css', src: ':root{--color-ink:#312E81;--font-body:"A",sans-serif}' },
    { name: 'legacy', file: 'l.css', src: ':root{--tip-bg:#fff7d6}' },
    { name: 'base', file: 'b.css', src: 'a{color:#fff}\n/* #000 주석 */\nb{background:rgb(0 0 0 / .5)}\nc{font-family:Arial}\nd{font-family:var(--font-body)}\ne{color:var(--color-ink)}' },
  ]);
  assert.deepEqual(issues.map((i) => [i.code, i.line]), [['E_CSS_RAW_COLOR', 1], ['E_CSS_RAW_COLOR', 3], ['E_CSS_RAW_FONT', 4]]);
});
test('legacy.css may define only the allow-listed names', () => {
  const issues = lintStyles([{ name: 'legacy', file: 'l.css', src: ':root{--bg:var(--color-paper);--brand-new:#123}' }]);
  assert.deepEqual(issues.map((i) => i.code), ['E_CSS_LEGACY_VAR']);
});
test('tokens.css equals the token block in DESIGN.md', async () => {
  const design = await readFile(path.join(ROOT, 'DESIGN.md'), 'utf8');
  const block = /## 부록: 토큰 원문 \(CSS\)[\s\S]*?```css\n([\s\S]*?)```/.exec(design)[1];
  const tokens = await readFile(path.join(ROOT, 'textbook/src/styles/tokens.css'), 'utf8');
  assert.equal(normalize(tokens), normalize(block)); // normalize: 주석 제거, 공백 한 칸으로
});
```
`tests/build/build.test.mjs`: 기존 "styles.css is inlined", "missing styles.css is E_NO_CSS" 두 테스트를 `styles/` 폴더 기준으로 고치고, 추가:
```js
test('the real styles pass the token lint', async () => {
  const { files } = await readStyles(path.join(ROOT, 'textbook/src'));
  assert.deepEqual(lintStyles(files), []);
});
```

- [ ] **Step 2: 실패를 확인한다**

Run: `npm test`
Expected: `readStyles`/`lintStyles` 없음으로 실패.

- [ ] **Step 3: `tokens.css`와 `legacy.css`를 만든다**

`tokens.css`: `DESIGN.md` "부록: 토큰 원문 (CSS)" 블록을 그대로 복사한다.

`legacy.css`: 라이트·다크(시스템·수동 두 곳) 세 블록에 같은 이름을 둔다.

| 옛 변수 | 새 값 |
|---|---|
| `--bg` | `var(--color-paper)` |
| `--surface` | `var(--color-card)` |
| `--surface-2`, `--accent-soft`, `--ok-soft` | `var(--color-track)` |
| `--text`, `--link` | `var(--color-ink)` |
| `--muted` | `var(--color-ink-2)` |
| `--border` | `var(--color-rule)` |
| `--border-strong` | `var(--color-line)` |
| `--accent` | `var(--color-ink)` (One Pink Rule: 옛 화면에서 분홍이 퍼지지 않게 남색으로 둔다) |
| `--on-accent` | `var(--color-card)` |
| `--focus` | `var(--color-focus)` |
| `--ok` | `var(--color-xp)` |
| `--ok-bar` | `var(--color-progress)` |
| `--overlay` | `var(--color-scrim)` |
| `--shadow` | `none` |
| `--font-sans` | `var(--font-body)` |
| `--font-mono` | `var(--font-code)` |
| `--radius` | `var(--radius-card)` |
| `--radius-sm` | `var(--radius-btn)` |
| `--measure` | `72ch` (그대로) |
| `--danger`, `--on-danger`, `--code-*` 4개, `--tip-*`·`--warn-*`·`--info-*`·`--path-*`·`--success-*` 각 3개, `--callout-*` 3개, `--tok-*` 12개 | 지금 `styles.css`의 값 그대로(M8에서 정하고 M9에서 지운다) |

`--topbar-h`와 `--sidebar-w`는 `tokens.css`의 값(56px, 280px)을 쓰고 `legacy.css`에 두지 않는다.

- [ ] **Step 4: `styles.css`를 구역별 파일로 나눈다**

지금 파일의 구역 주석 기준이다. 규칙 본문은 바꾸지 않고 옮기기만 한다(색 값 직접 표기만 변수로 바꾼다).

| 새 파일 | 옛 `styles.css` 구역 |
|---|---|
| `base.css` | "바탕" (`:root` 블록은 버린다. `tokens.css`·`legacy.css`가 대신한다) |
| `shell.css` | "윗줄", "사이드바", "본문 틀", "좁은 화면: 사이드바는 서랍" |
| `components.css` | "버튼 · 조각", "잠금 · 없는 화면" |
| `home.css` | "홈", "프로젝트" |
| `day.css` | "글 (Day · 부록 본문)", "코드 블록", "알림 상자", "정답 · 체크리스트", "Day 아래쪽" |
| `pages.css` | "검색 · 설정" |
| `print.css` | 새 파일. `@media print { .topbar, #sidebar, .site-footer, dialog { display: none; } }` |
| `base.css` 끝 | "움직임을 줄여 달라는 설정" |

`base.css`의 `body`에 `DESIGN.md` 글자 처리를 넣는다: `font-family: var(--font-body)`, `font-size: var(--text-body)`, `line-height: 1.65`, `word-break: keep-all`, `overflow-wrap: break-word`, `font-synthesis: none`, `html, body { overflow-x: clip; }`, `scroll-padding-top: calc(var(--topbar-h) + var(--space-lg))`. Day 본문의 줄간격 1.75(`.prose` 쪽 선언)는 그대로 둔다(미정 값, M8).

- [ ] **Step 5: `styles.mjs`를 구현하고 `build.mjs`에 연결한다**

`build.mjs`의 `readFile(styles.css)` 블록을 `readStyles(srcDir)`로 바꾸고, `lintStyles(files)` 결과를 빌드 오류로 낸다.

- [ ] **Step 6: 남은 색 값을 변수로 바꾼다**

Run: `npm run check -- --allow-missing`
Expected: 처음에는 `E_CSS_RAW_COLOR`가 나온다. 나온 줄마다 가장 가까운 토큰으로 바꾼다. 맞는 토큰이 없으면(예: 반투명 강조) `legacy.css`의 기존 이름을 쓰고, 그것도 없으면 멈추고 사용자에게 보인다. 끝나면 "검사 통과".

- [ ] **Step 7: 다크 값 짝 검사를 고친다**

`tests/e2e/textbook.test.mjs`의 "다크 값이 두 곳에 똑같이 있다" 검사(729행 근처)가 옛 변수 이름을 본다면 `--color-*` 이름으로 고친다. 검사 내용(두 다크 블록의 값이 같다)은 유지한다.

- [ ] **Step 8: 통과와 눈 확인**

Run: `npm test; npm run check -- --allow-missing; npm run test:e2e`
Expected: 전부 통과.
그다음 `npm run build -- --allow-missing --out <스크래치>/index.html`로 빌드해 로컬 서버로 열고 홈·Day 1·설정을 1280px 라이트·다크로 찍어 본다. 바탕이 `#EEF2FF`(다크 `#0D0F1F`), 카드가 `#FFFFFF`(다크 `#151833`), 글자가 `#312E81`(다크 `#EEF2FF`)인지 `getComputedStyle`로 확인한다.

- [ ] **Step 9: 커밋(허락받았을 때)**

```bash
git add textbook/src/styles textbook/lib/styles.mjs textbook/build.mjs tests
git rm textbook/src/styles.css
git commit -m "refactor(styles): split into styles/, adopt DESIGN.md tokens, lint raw colours"
```

---

### Task 3: 웹폰트 내장

**Files:**
- Create: `textbook/fonts/{WantedSansVariable.ttf,Galmuri11.ttf,D2Coding.ttf,OFL-WantedSans.txt,OFL-Galmuri.txt,OFL-D2Coding.txt}`, `textbook/lib/fonts.mjs`, `textbook/lib/subset_fonts.py`
- Modify: `textbook/build.mjs`, `.gitignore`(`textbook/.cache/` 추가)
- Test: `tests/unit/fonts.test.mjs`, `tests/build/build.test.mjs`

**Interfaces:**
- Consumes: `readStyles`의 `css`
- Produces:
  - `collectGlyphs({ html, css, dataJson }): { textAll: string, textCode: string }` — `textAll`은 세 입력의 서로 다른 글자 전부 + `0123456789`. `textCode`는 U+0020~U+007E 95자 + `<pre>`·`<code>` 안에 나온 글자 + `↑↓`. 둘 다 코드 포인트 순으로 정렬한다
  - `embedFonts({ textAll, textCode, fontsDir, cacheDir }): Promise<{ css: string, bytes: Record<string, number>, errors: Issue[] }>` — `@font-face` 세 개(`"WZH Wanted Sans"` `font-weight: 400 800`, `"WZH Galmuri11"` 400, `"WZH Code"` 400). 모두 `src: url(data:font/woff2;base64,…) format("woff2")`, `font-style: normal`, `font-display: swap`
  - 오류 `E_FONT_TOOL`(python 실행 실패, fontTools·brotli 없음. 메시지에 `pip install fonttools brotli` 포함), `E_FONT_SOURCE`(원본 파일 없음)
  - 캐시: `cacheDir/<sha256(textAll + '\0' + textCode + 원본 파일 크기·수정시각)>.json`. 있으면 Python을 부르지 않는다

- [ ] **Step 1: 글꼴 원본을 옮긴다**

`design-system/web-zero-to-hundred/prototype/.fonts/`의 여섯 파일을 `textbook/fonts/`로 복사한다. 저장소가 약 14MB 커진다(보고에 적는다). 각 `OFL-*.txt`의 저작권 줄과 예약 이름(RFN) 줄이 있는지 읽어 확인한다.

- [ ] **Step 2: 실패하는 테스트를 쓴다**

`tests/unit/fonts.test.mjs`:
```js
test('collectGlyphs is sorted, unique, and always has digits and printable ASCII for code', () => {
  const { textAll, textCode } = collectGlyphs({ html: '<p>나가</p><pre>λ</pre>', css: 'a{}', dataJson: '{"t":"다"}' });
  assert.equal(textAll, [...new Set(textAll)].sort((a, b) => a.codePointAt(0) - b.codePointAt(0)).join(''));
  for (const ch of '가나다0123456789') assert.ok(textAll.includes(ch), ch);
  for (const ch of ' ~Az09λ↑↓') assert.ok(textCode.includes(ch), ch);
});
test('embedFonts returns three WZH faces as inline woff2 and is byte-stable', async () => {
  const args = { textAll: '가나다 ABC 0123456789', textCode: ' !~Az09', fontsDir: FONTS, cacheDir: tmpA };
  const a = await embedFonts(args);
  const b = await embedFonts({ ...args, cacheDir: tmpB }); // 캐시 없이 다시
  assert.deepEqual(a.errors, []);
  assert.equal(a.css, b.css);
  assert.equal((a.css.match(/@font-face/g) ?? []).length, 3);
  assert.match(a.css, /font-family: "WZH Wanted Sans";[^}]*font-weight: 400 800;/);
  assert.match(a.css, /font-family: "WZH Galmuri11";/);
  assert.match(a.css, /font-family: "WZH Code";/);
  assert.equal(/url\((?!data:font\/woff2;base64,)/.test(a.css), false);
});
test('a second call with the same glyphs is served from the cache', async () => { /* 같은 cacheDir 로 두 번: 두 번째는 PATH 에 python 이 없어도 성공 */ });
test('missing python or source file is a build error, not a crash', async () => {
  const r1 = await embedFonts({ textAll: 'a', textCode: 'a', fontsDir: emptyDir, cacheDir: tmpC });
  assert.equal(r1.errors[0].code, 'E_FONT_SOURCE');
  const r2 = await embedFonts({ textAll: 'a', textCode: 'a', fontsDir: FONTS, cacheDir: tmpD, python: 'no-such-python' });
  assert.equal(r2.errors[0].code, 'E_FONT_TOOL');
  assert.match(r2.errors[0].message, /pip install fonttools brotli/);
});
```
`tests/build/build.test.mjs`에 추가: 실제 `src`로 픽스처를 빌드한 `html`에 `@font-face`가 3개이고, `https?://`로 시작하는 `url(`이 0개다.

- [ ] **Step 3: 실패를 확인한다**

Run: `npm test`
Expected: `embedFonts` 없음으로 실패.

- [ ] **Step 4: 구현한다**

`subset_fonts.py`는 시안 `build-home.mjs`의 `PY` 문자열을 파일로 옮긴 것이다. 다르게 할 것 두 가지:
- `TTFont(job['src'], lazy=False, recalcTimestamp=False)` — 저장할 때 수정 시각을 새로 쓰지 않아 결과가 같은 입력에 같은 바이트가 된다.
- 남기는 OpenType 기능은 `['kern', 'liga', 'calt', 'tnum', 'locl', 'ccmp']`, Wanted Sans는 `wght` 400~800으로 자른다, 이름 ID 1·4·16·21은 `WZH …`, 6은 공백을 뺀 이름.

`fonts.mjs`는 `spawnSync(python ?? 'python', ['-E', '-P', scriptPath], { input })`로 부른다. Linux CI에서는 `python`이 없을 수 있으니 `python`이 실패하면 `python3`를 한 번 더 시도한다.

`build.mjs`: 조립 직전에 `collectGlyphs({ html: 템플릿 HTML 전부 + template.html, css, dataJson })` → `embedFonts(…, cacheDir: textbook/.cache/fonts)` → 반환된 `css`를 스타일 맨 앞에 붙인다. `build()`에 `fontsDir`, `cacheDir` 선택 인자를 추가한다(기본값은 `textbook/fonts`, `textbook/.cache/fonts`).

- [ ] **Step 5: 통과와 크기를 확인한다**

Run: `npm test; npm run build -- --allow-missing --out <스크래치>/index.html`
Expected: 통과. 빌드가 글꼴별 KB를 한 줄씩 찍는다. 세 글꼴의 합과 `index.html` 전체 크기를 적어 둔다(보고에 넣는다). 16MB 미만이어야 한다.
같은 명령을 한 번 더 돌려 두 번째가 캐시로 빨라지는지(Python 호출 없음) 확인한다.

- [ ] **Step 6: 화면에서 글꼴을 확인한다**

로컬 서버로 열고 `document.fonts.check('800 17px "WZH Wanted Sans"')`, `'12px "WZH Galmuri11"'`, `'14px "WZH Code"'`가 모두 `true`인지, 네트워크 요청이 문서 하나뿐인지 확인한다.

- [ ] **Step 7: 커밋(허락받았을 때)**

```bash
git add textbook/fonts textbook/lib/fonts.mjs textbook/lib/subset_fonts.py textbook/build.mjs .gitignore tests
git commit -m "feat(fonts): embed subset WZH fonts as inline woff2"
```

---

### Task 4: 아이콘과 파비콘

**Files:**
- Create: `textbook/src/app/views/icons.js`
- Modify: `textbook/lib/site.mjs`, `textbook/build.mjs`, `textbook/src/styles/components.css`
- Test: `tests/unit/icons.test.mjs`, `tests/unit/site.test.mjs`

**Interfaces:**
- Produces (`icons.js`, DOM을 쓰지 않는 순수 부분):
  - `ICON_PATHS`: `DESIGN.md` Icons의 선 아이콘 11개(`check, search, menu, close, sun, moon, monitor, left, right, chevron, alert`) 원문 그대로
  - `PIXELS`: `DESIGN.md`의 도트 격자 17개 원문 그대로
  - `iconSvg(name: string, cls = ''): string` — `<svg class="icon {cls}" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">…</svg>`. 모르는 이름이면 던진다
  - `pxSvg(name: string, { cls = '', scale = 2 } = {}): string` — 격자를 `#`→`.p1`, `o`→`.p2`, `h`→`.p3` 세 `<path>`로 합친 `<svg class="px {cls}" shape-rendering="crispEdges" aria-hidden="true">`. `width`·`height`는 격자 크기 × `scale`(정수만). 정수가 아닌 `scale`이면 던진다
  - DOM 부분: `icon(name, cls): SVGElement`, `px(name, opts): SVGElement` — 위 문자열을 `<template>`의 `innerHTML`로 한 번 만들어 복제한다
- Produces (`site.mjs`): `faviconDataUri(tokensCss: string): string` — `pawn` 도트 아이콘을 32px로 그린 SVG의 `data:image/svg+xml,…`. 색은 `tokensCss`의 첫 `:root` 블록에서 `--color-ink`, `--color-accent`, `--color-accent-hover` 값을 읽어 넣는다
- CSS: `.px .p1 { fill: var(--px-1, currentColor); } .px .p2 { fill: var(--px-2, transparent); } .px .p3 { fill: var(--px-3, var(--px-2, transparent)); }`

- [ ] **Step 1: 실패하는 테스트를 쓴다**

`tests/unit/icons.test.mjs`:
```js
test('icon data equals DESIGN.md', async () => {
  const design = await readFile(path.join(ROOT, 'DESIGN.md'), 'utf8');
  for (const [name, d] of Object.entries(ICON_PATHS)) assert.ok(design.includes(`${name}: '${d}'`), name);
  for (const [name, rows] of Object.entries(PIXELS)) assert.ok(design.includes(`${name}: [${rows.map((r) => `'${r}'`).join(', ')}]`), name);
  assert.equal(Object.keys(ICON_PATHS).length, 11);
  assert.equal(Object.keys(PIXELS).length, 17);
});
test('pxSvg draws one path per layer at an integer scale', () => {
  const svg = pxSvg('coin', { scale: 2 });
  assert.match(svg, /width="16" height="16"/);
  assert.match(svg, /shape-rendering="crispEdges"/);
  assert.equal((svg.match(/<path /g) ?? []).length, 3); // # o h
  assert.equal((pxSvg('check').match(/<path /g) ?? []).length, 1); // # 만
  assert.throws(() => pxSvg('coin', { scale: 1.5 }));
  assert.throws(() => pxSvg('nope'));
});
test('iconSvg is decorative and uses currentColor', () => {
  const svg = iconSvg('search');
  assert.match(svg, /aria-hidden="true"/);
  assert.match(svg, /stroke="currentColor"/);
  assert.match(svg, /stroke-width="1\.75"/);
});
```
`tests/unit/site.test.mjs`에 추가: `faviconDataUri(':root{--color-ink:#111111;--color-accent:#222222;--color-accent-hover:#333333}')`가 `data:image/svg+xml,`로 시작하고 세 색을 (URL 인코딩된 형태로) 담는다.

- [ ] **Step 2: 실패 확인** — Run: `npm test` → `icons.js` 없음.

- [ ] **Step 3: 구현한다**

시안 `view.mjs`의 `icon`, `px` 함수(14~70행)가 같은 일을 한다. 그 알고리즘을 옮기되 위 서명에 맞춘다. `build.mjs`는 `headTags(site, faviconDataUri(tokensCss))`를 넘긴다.

- [ ] **Step 4: 통과 확인** — Run: `npm test; npm run check -- --allow-missing` → 통과.

- [ ] **Step 5: 커밋(허락받았을 때)**

```bash
git add textbook/src/app/views/icons.js textbook/lib/site.mjs textbook/build.mjs textbook/src/styles/components.css tests/unit
git commit -m "feat(icons): line and pixel icon sets, pawn favicon"
```

---

### Task 5: 공용 컴포넌트

**Files:**
- Modify: `textbook/src/app/views/common.js`, `textbook/src/styles/components.css`
- Test: `tests/e2e/layout.test.mjs`(신규, 이 Task에서는 컴포넌트 부분만)

**Interfaces:**
- Consumes: `icon`, `px` (Task 4)
- Produces (`common.js`에 추가. 기존 내보내기는 그대로 둔다):
  - `card(props, ...children): HTMLElement` — `<section class="card …">`. `props.class`는 `card` 뒤에 붙는다
  - `primaryButton(href: string, text: string, { testid = null } = {}): HTMLAnchorElement` — `<a class="btn-primary">`. 한 화면에 하나만 쓴다
  - `textLink(href: string, text: string): HTMLAnchorElement` — `<a class="text-link">`
  - `chip(text: string): HTMLLIElement`, `chips(items: string[], max = 4): HTMLUListElement` — `max`를 넘으면 마지막에 `<li class="chip-more">외 n개</li>`
  - `notice(text: string | Node[], { testid = null } = {}): HTMLElement` — `<p class="notice" role="status">` + 선 아이콘 `alert`
  - `linkButton(href, text, { primary })`는 유지한다. `primary: true`이면 `primaryButton`과 같은 클래스(`btn-primary`)를 쓴다
- CSS(`components.css`, 값은 `DESIGN.md` Components·Elevation 표 그대로. 시안 `style.css`의 `.btn-primary`·`.icon-btn`·`.tool-btn`·`.card`·`.notice`·`.chips`·`.menu`·`kbd` 블록을 옮긴다):
  - `.btn-primary`: `accent` 면, `accent-ink` 글자 17px 800, `min-height: 48px`, 좌우 24px, 모서리 `--radius-btn`, `box-shadow: 0 var(--ledge) 0 var(--color-accent-deep)`, `margin-bottom: var(--ledge)`. hover: `accent-hover`, `translateY(-2px)`, 턱 +2px. active: `translateY(calc(var(--ledge) - 1px))`, 턱 1px, `transition-duration: 60ms`
  - `.icon-btn`, `.tool-btn`: 최소 40×40px, 투명 바탕, 1px 투명 테두리, hover `track`, active `rule`, 비활성 투명도 0.4
  - `.card`: `card` 바탕, 2px `rule`, 모서리 12px, 턱 4px `rule`
  - `.notice`: 1px `ink-2`, 모서리 12px, 15px, 줄간격 1.5
  - `.chips li`: `track` 바탕, 모서리 6px, 안쪽 2·8px, 15px
  - `.text-link`: `ink` 400 밑줄(`text-underline-offset: 0.18em`, 1px), hover `accent-text`
  - `:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px; }`
  - `.label`: `--font-label`, 12px, 줄간격 1.4, `ink-2`

- [ ] **Step 1: 실패하는 e2e를 쓴다**

`tests/e2e/layout.test.mjs`(픽스처를 빌드해 `startStaticServer`로 연다. 헬퍼 `open(hash, { width, theme })`를 둔다):
```js
test('the primary button presses into its ledge and meets the size floor', async () => {
  const page = await open('#/', { width: 1280 });
  const btn = page.locator('main .btn-primary');
  assert.equal(await btn.count(), 1, '주 버튼은 한 화면에 하나');
  const box = await btn.boundingBox();
  assert.ok(box.height >= 48);
  const style = await btn.evaluate((el) => { const s = getComputedStyle(el); return [s.backgroundColor, s.fontWeight, s.borderRadius, s.boxShadow]; });
  assert.deepEqual(style.slice(0, 3), ['rgb(219, 39, 119)', '800', '6px']);
  assert.match(style[3], /rgb\(157, 23, 77\) 0px 4px 0px 0px/);
});
test('focus ring is the focus token, 2px, offset 2px', async () => { /* Tab 으로 주 버튼에 포커스 → outline 2px solid rgb(219, 39, 119), offset 2px */ });
test('no blurred shadow anywhere on the home screen', async () => {
  const blurred = await page.evaluate(() => [...document.querySelectorAll('*')].filter((el) => /\dpx \dpx [1-9]\d*px/.test(getComputedStyle(el).boxShadow)).map((el) => el.className));
  assert.deepEqual(blurred, []);
});
```

- [ ] **Step 2: 실패 확인** — Run: `npm run test:e2e` → 새 테스트 실패.

- [ ] **Step 3: 구현한다** — `common.js` 함수와 `components.css`. 홈의 "이어서 하기"가 `linkButton(..., { primary: true })`를 쓰고 있으므로 따로 고치지 않아도 새 모양이 된다. 홈에 주 버튼이 둘 이상이면(옛 홈 구조) 첫 번째만 `primary`로 남기고 나머지는 `btn`으로 내린다.

- [ ] **Step 4: 통과 확인** — Run: `npm test; npm run test:e2e` → 통과.

- [ ] **Step 5: 커밋(허락받았을 때)**

```bash
git add textbook/src/app/views/common.js textbook/src/styles/components.css tests/e2e/layout.test.mjs
git commit -m "feat(ui): shared card, primary button, chip, notice, text link"
```

---

### Task 6: 공통 레이아웃 (헤더, 테마 메뉴, 본문 틀, 푸터)

**Files:**
- Modify: `textbook/src/template.html`, `textbook/src/app/views/shell.js`, `textbook/src/app/views/search.js`, `textbook/src/styles/shell.css`, `tests/e2e/textbook.test.mjs`, `DESIGN.md`(푸터 승인 뒤)
- Test: `tests/e2e/layout.test.mjs`

**Interfaces:**
- Consumes: `icon`, `px`, `iconSvg`, `pxSvg`(Task 4), `data.title`·`data.writtenAt`·`data.builtAt`(기존), 공용 CSS(Task 5)
- Produces:
  - 헤더 DOM(`template.html`, 빌드가 아이콘을 채운다. `build.mjs`가 `{{ICON:name}}`·`{{PX:name}}`을 `iconSvg`·`pxSvg`로 바꾼다):
    ```html
    <header class="topbar">
      <button id="menu-toggle" class="icon-btn menu-btn" type="button" aria-controls="sidebar" aria-expanded="false" aria-label="Day 목록 열기">{{ICON:menu}}</button>
      <a class="brand wordmark" href="#/">{{PX:pawn}}{{WZH_TITLE}}</a>
      <div class="topbar-tools">
        <a id="search-open" class="tool-btn search-btn" href="#/search">{{ICON:search}}<span class="search-word">검색</span></a>
        <div class="theme">
          <button id="theme-btn" data-testid="theme-toggle" class="icon-btn theme-btn" type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="theme-menu" aria-label="테마: 시스템">{{ICON:monitor}}</button>
          <div id="theme-menu" class="menu" role="menu" aria-labelledby="theme-btn" hidden>
            <button type="button" role="menuitemradio" aria-checked="true" data-theme-value="system" tabindex="-1">{{ICON:monitor}}시스템{{ICON:check:tick}}</button>
            <button type="button" role="menuitemradio" aria-checked="false" data-theme-value="light" tabindex="-1">{{ICON:sun}}라이트{{ICON:check:tick}}</button>
            <button type="button" role="menuitemradio" aria-checked="false" data-theme-value="dark" tabindex="-1">{{ICON:moon}}다크{{ICON:check:tick}}</button>
          </div>
        </div>
      </div>
    </header>
    <div class="shell">
      <nav id="sidebar" class="sidebar" aria-label="교재 목차"></nav>
      <div class="shell-main">
        <main id="main" class="main" tabindex="-1"><noscript>…</noscript></main>
        <footer class="site-footer">…</footer>
      </div>
    </div>
    ```
    `Ctrl K` `kbd`는 넣지 않는다(검색 Modal은 M5).
  - 푸터 DOM:
    ```html
    <footer class="site-footer">
      <p class="footer-brand">{{PX:pawn}}<span>{{WZH_TITLE}}</span></p>
      <nav class="footer-links" aria-label="바로 가기">
        <a class="text-link" href="#/page/start">시작하기</a>
        <a class="text-link" href="#/page/help">막혔을 때</a>
        <a id="settings-link" class="text-link" href="#/settings">설정 · 진도 백업</a>
      </nav>
      <p class="footer-meta label"><span id="footer-written"></span><span id="footer-built"></span></p>
      <p class="footer-meta label">글꼴: Wanted Sans · Galmuri11 · D2Coding (SIL Open Font License 1.1)</p>
    </footer>
    ```
    `shell.js`가 `#footer-written`에 `작성 기준 ${cur.writtenAt}`, `#footer-built`에 `빌드 ${cur.builtAt}`를 넣는다. 부록 링크 두 개는 `cur.pages`에 그 id가 있을 때만 보인다(픽스처에 없으면 숨긴다). 지어낸 수치·만든 사람 이름은 넣지 않는다.
  - 테마 메뉴 동작(`shell.js`, `DESIGN.md` Navigation "테마 Dropdown"): 버튼 클릭·↓·↑로 열림, 화살표 순환, Home·End, ESC·Tab·바깥 클릭으로 닫힘, Enter·Space·클릭으로 적용 뒤 버튼으로 포커스 복귀. 버튼 아이콘과 `aria-label`은 고른 값(`테마: 시스템|라이트|다크`). 적용은 기존 `ctx.setTheme(value)`
  - 검색 페이지(`search.js`)가 맨 위에 `<input data-testid="search-input" type="search" aria-label="교재 검색">`을 그린다. 입력 동작(180ms 뒤 `#/search?q=`로 `replace`)은 `shell.js`에서 옮겨 온다
- CSS(`shell.css`, `DESIGN.md` Layout "셸"):
  - `.topbar`: 높이 `--topbar-h`, `position: sticky; top: 0`, `z-index: var(--z-sticky-nav)`, `card` 바탕, 아래 1px `rule`, 좌우 안쪽 `--space-md`
  - `.wordmark`: 17px 800, `letter-spacing: -0.02em`, `white-space: nowrap`, 최소 높이 40px. `(max-width: 22.5rem)`에서 15px
  - `.search-btn`: 1px `rule` 테두리, `ink-2` 글자. `(max-width: 40rem)`에서 `.search-word` 숨김
  - `.shell`: `(min-width: 64rem)`에서 `grid-template-columns: var(--sidebar-w) minmax(0, 1fr)`. 그 미만에서는 한 열이고 `.menu-btn`이 보인다. 기존 서랍의 `959px` 기준을 `1023px`(`(max-width: 63.99rem)`)로 바꾼다(`shell.js`의 `MOBILE`도 같이)
  - `.sidebar`(넓은 화면): `position: sticky; top: var(--topbar-h)`, 높이 `calc(100dvh - var(--topbar-h))`, 자기 영역 스크롤, 오른쪽 1px `rule`, `card` 바탕
  - `.main`: `container-type: inline-size`, 안쪽 32·24·64px, `(max-width: 40rem)`에서 16·16·48px
  - `.shell-main`: `display: flex; flex-direction: column; min-height: calc(100dvh - var(--topbar-h))`. `.main`이 `flex: 1`이라 짧은 화면에서도 푸터가 바닥에 붙는다
  - `.site-footer`: 위 1px `rule`, `card` 바탕, 안쪽 24px(640px 이하 16px), 세로 간격 `--space-sm`, 글자 15px `ink-2`, `.footer-brand`만 `ink` 800. 링크 줄은 `display: flex; flex-wrap: wrap; gap: var(--space-xs) var(--space-lg)`. 턱·그림자 없음
  - `.menu`: 최소 160px, 안쪽 4px, `card`, 1px `rule`, 모서리 12px, 그림자 없음, `z-index: var(--z-dropdown)`, 열릴 때 `pop-in` 200ms. 항목 40px, 15px, hover·포커스 `track`, 고른 항목 800 + `tick`(`accent-text`)

- [ ] **Step 1: 실패하는 e2e를 쓴다**

`tests/e2e/layout.test.mjs`에 추가:
```js
test('header: wordmark, search link, theme menu — same on every kind of page', async () => {
  for (const hash of ['#/', '#/project/fa', '#/day/fa-d01', '#/page/start', '#/settings', '#/search', '#/nope']) {
    const page = await open(hash, { width: 1280 });
    const bar = await page.locator('.topbar').boundingBox();
    assert.equal(bar.height, 56, hash);
    assert.equal(await page.locator('.wordmark svg.px').count(), 1, hash);
    assert.equal(await page.locator('.wordmark').evaluate((el) => getComputedStyle(el).fontWeight), '800', hash);
    assert.equal(await page.locator('#menu-toggle').isVisible(), false, hash);
    assert.equal(await page.locator('.site-footer').count(), 1, hash);
  }
});
test('theme menu: arrows move, Enter applies, focus returns, choice survives reload', async () => {
  const page = await open('#/', { width: 1280 });
  const btn = page.getByTestId('theme-toggle');
  await btn.focus(); await page.keyboard.press('ArrowDown');
  assert.equal(await page.locator('#theme-menu').isVisible(), true);
  await page.keyboard.press('End'); await page.keyboard.press('Enter'); // 다크
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  assert.equal(await page.locator('#theme-menu').isHidden(), true);
  assert.equal(await page.evaluate(() => document.activeElement.id), 'theme-btn');
  assert.equal(await btn.getAttribute('aria-label'), '테마: 다크');
  await page.reload();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  // Esc 와 바깥 클릭으로 닫힌다, 시스템을 고르면 data-theme 가 없어진다
});
test('stored dark theme paints before the app script runs', async () => { /* Review Focus 3: 기존 theme-init 테스트와 같은 MutationObserver 방식으로, 헤더 개편 뒤에도 #main 이 생기기 전에 data-theme 가 붙는다 */ });
test('375px: menu button shows, wordmark stays on one line, no horizontal scroll', async () => {
  const page = await open('#/', { width: 375 });
  assert.equal(await page.locator('#menu-toggle').isVisible(), true);
  assert.equal(await page.locator('.search-word').isVisible(), false);
  const mark = await page.locator('.wordmark').boundingBox();
  assert.ok(mark.height <= 44, '워드마크 한 줄');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), 0);
});
test('a very long site title does not break the header at 375px', async () => { /* Review Focus 5: title 을 60자로 바꾼 픽스처 사본을 빌드. 가로 스크롤 0, 헤더 높이 56, 도구 버튼이 화면 안에 있다 */ });
test('footer: links work, sits at the bottom on a short page, shows no personal data', async () => {
  const page = await open('#/settings', { width: 1280 });
  const foot = await page.locator('.site-footer').boundingBox();
  const vh = page.viewportSize().height;
  assert.ok(foot.y + foot.height >= vh - 1, '짧은 화면에서도 바닥에 붙는다');
  assert.match(await page.locator('#footer-written').innerText(), /^작성 기준 2026-11$/);
  await page.locator('#settings-link').click();
  await page.waitForFunction(() => document.getElementById('main').dataset.hash === '#/settings');
});
```

- [ ] **Step 2: 실패 확인** — Run: `npm run test:e2e` → 새 테스트 실패.

- [ ] **Step 3: 구현한다**

`template.html`, `shell.js`(테마 토글 → 메뉴, 검색 입력 제거, 푸터 채우기, `MOBILE` 기준 변경), `search.js`(입력칸), `shell.css`, `build.mjs`(`{{ICON:…}}`·`{{PX:…}}` 치환). 워드마크가 긴 이름에서 넘치지 않게 `.wordmark`에 `min-width: 0; overflow: hidden; text-overflow: ellipsis`를 두고 `.topbar-tools`는 `flex: none`으로 둔다.

- [ ] **Step 4: 기존 e2e를 새 헤더에 맞춘다**

`tests/e2e/textbook.test.mjs`에서 바뀌는 곳(측정: 13곳):
- `page.getByTestId('theme-toggle').click()`으로 다크·라이트를 오가던 테스트(409~423, 869~888행 근처) → 헬퍼 `pickTheme(page, 'dark' | 'light' | 'system')`(버튼 클릭 뒤 `[data-theme-value=…]` 클릭)로 바꾼다. `aria-label` 기대값은 `테마: 라이트` 형식으로.
- 헤더 검색칸에 치던 테스트(354행 근처) → 먼저 `#search-open`을 누르고 검색 페이지의 `search-input`에 친다.
- `#settings-link`(281, 534행) → 그대로 동작한다(푸터로 옮겨졌다). 클릭 전에 `scrollIntoViewIfNeeded`.
- "둘째 Tab은 윗줄 제목"(827~838행) → `.brand` 클래스가 남아 있으므로 그대로. 넓은 화면에서는 `#menu-toggle`이 숨겨져 순서가 같다.
- 서랍 테스트(647행 근처)의 화면 폭이 960~1023px 사이라면 1023px 이하로 맞춘다.

검증하는 동작은 줄이지 않는다. 고친 테스트 이름과 이유를 보고에 적는다.

- [ ] **Step 5: 통과 확인** — Run: `npm test; npm run check -- --allow-missing; npm run test:e2e` → 전부 통과.

- [ ] **Step 6: 헤더를 시안과 대조하고 푸터 승인을 받는다**

실제 교재를 빌드해 로컬 서버로 열고, 헤더와 푸터를 375·768·1280 × 라이트·다크로 찍는다(12장). 시안(`node design-system/web-zero-to-hundred/prototype/build-home.mjs` → `prototype/home.html`)의 헤더를 같은 폭으로 찍어 나란히 본다. 다른 점은 검색 버튼의 `Ctrl K` 표시가 없는 것 하나여야 한다.

사용자에게 스크린샷을 보이고 묻는다: **"푸터는 DESIGN.md에 없던 부품입니다. 이 모양으로 확정하고 DESIGN.md Components에 Footer 항목을 추가해도 될까요?"** 승인되면 `DESIGN.md` Components의 Navigation 아래에 다음을 추가한다:

> **푸터:** 본문 아래 전체 폭. 위 1px `rule`, 바탕 `card`, 안쪽 24px(640px 이하 16px), 턱 없음. 말 도트 아이콘 + 사이트 이름(15px 800 `ink`), 글자 링크 줄(시작하기, 막혔을 때, 설정 · 진도 백업), Label 두 줄(작성 기준·빌드 날짜, 글꼴 라이선스). 짧은 화면에서도 화면 바닥에 붙는다. 인쇄에서는 숨긴다.

고쳐 달라고 하면 고치고 다시 찍는다.

- [ ] **Step 7: 커밋(허락받았을 때)**

```bash
git add textbook/src textbook/build.mjs tests/e2e DESIGN.md
git commit -m "feat(shell): header with wordmark and theme menu, page frame, footer"
```

---

### Task 7: 사이트맵 전 페이지와 404

**Files:**
- Create: `tests/helpers/site-check.mjs`
- Modify: `textbook/src/app/main.js`, `textbook/src/app/views/common.js`, `textbook/src/app/views/day.js`, `project.js`, `page.js`(없는 id 처리 확인), `textbook/build.mjs`, `textbook/package.json`, `tests/e2e/smoke.test.mjs`, `textbook/src/styles/components.css`
- Test: `tests/e2e/layout.test.mjs`, `tests/e2e/smoke.test.mjs`, `tests/build/build.test.mjs`

**Interfaces:**
- Consumes: `listRoutes(cur)`(Task 1), `primaryButton`, `px`(Task 4·5)
- Produces:
  - `notFoundScreen({ homeHref = '#/' } = {}): HTMLElement` — `<section class="notfound" data-testid="notfound">`: `wrench` 도트 아이콘 24px(`px('wrench', { scale: 3 })`), `<h1>찾을 수 없는 화면이에요</h1>`, 설명 한 줄, 주 버튼 "홈으로 가기"(`homeHref`), 글자 링크 "막혔을 때"(부록 `help`가 있을 때)
  - 없는 id: `renderDay`·`renderProject`·`renderPage`가 모르는 id를 받으면 `notFoundScreen()`을 붙이고 `'찾을 수 없어요'`를 돌려준다(지금 동작을 확인하고, 아니면 맞춘다)
  - `build({ …, notFound: boolean })`와 CLI `--notfound`: `<html lang="ko" data-notfound>`로 만든다. `main.js`는 `document.documentElement.hasAttribute('data-notfound')`이고 `location.hash`가 비어 있으면 경로를 `notfound`로 보고, `notFoundScreen({ homeHref: cur.url })`을 그린다. 헤더의 워드마크·푸터·사이드바 링크도 이 모드에서는 `cur.url + '#/…'`로 간다(`shell.js`가 `a[href^="#/"]`의 `href` 앞에 `cur.url`을 붙인다)
  - `checkSite({ baseUrl, cur, width = 375, launch }): Promise<{ visited: number, problems: string[] }>` — `listRoutes(cur)` 전부 + `#/day/zz-d99`·`#/nope`(404 기대)를 열어 ① `main h1`이 보인다 ② 콘솔 오류 0 ③ 가로 스크롤 0 ④ `.topbar` 높이 56, `.site-footer` 있음 ⑤ 문서 밖 요청 0(`baseUrl`과 `data:` 외)을 본다. 진도는 "모든 Day 완료"를 주입한다
  - `npm run check:site -- <baseUrl>` → `node ../tests/helpers/site-check.mjs <baseUrl>`: 실제 `curriculum.json`으로 `checkSite`를 돌리고 `방문 N개, 문제 0개`를 찍는다. 문제가 있으면 목록을 찍고 종료 코드 1

- [ ] **Step 1: 실패하는 테스트를 쓴다**

`tests/e2e/layout.test.mjs`:
```js
test('unknown ids and unknown paths show the 404 screen with a way home', async () => {
  for (const hash of ['#/nope', '#/day/zz-d99', '#/project/zz', '#/page/zz', '#/day/fa-d01/extra']) {
    const page = await open(hash, { width: 375 });
    assert.equal(await page.getByTestId('notfound').count(), 1, hash);
    assert.equal(await page.locator('main .btn-primary').getAttribute('href'), '#/', hash);
    assert.match(await page.title(), /^찾을 수 없어요 · /, hash);
  }
});
test('the notfound build shows 404 at an empty hash and links home by the configured url', async () => {
  // build({ contentDir: FIXTURE, notFound: true }) 를 /404.html 로 서빙
  const page = await openFile('/404.html', { width: 375 });
  assert.equal(await page.getByTestId('notfound').count(), 1);
  assert.equal(await page.locator('main .btn-primary').getAttribute('href'), 'https://example.test/fixture/');
  assert.equal(await page.locator('.wordmark').getAttribute('href'), 'https://example.test/fixture/#/');
});
```
`tests/e2e/smoke.test.mjs`: 손으로 적은 경로 목록(`['#/', '#/settings', '#/project/p1']`와 Day·페이지 반복)을 `listRoutes(curriculum)`으로 바꾼다. Day 전용 검사(h2 순서, 복사 버튼)는 `#/day/`로 시작하는 경로에 그대로 적용한다. 끝에 `assert.equal(visited, listRoutes(curriculum).length)`.

- [ ] **Step 2: 실패 확인** — Run: `npm run test:e2e` → 실패.

- [ ] **Step 3: 구현한다** — 위 Interfaces대로. `smoke.test.mjs`의 방문 로직을 `site-check.mjs`의 `checkSite`로 옮기고 스모크가 그것을 부르게 해도 된다(중복을 없앤다). 단 스모크의 Day 전용 검사는 스모크에 남긴다.

- [ ] **Step 4: 통과 확인**

Run: `npm test; npm run test:e2e`
Expected: 통과. 스모크 출력의 방문 수가 `3 + 월드 4 + Day 155 + 부록 4 = 166`이다.

- [ ] **Step 5: 로컬에서 전 페이지 점검을 돌린다**

실제 교재를 빌드한 폴더를 `startStaticServer`로 띄우고 `npm run check:site -- http://127.0.0.1:<포트>/`.
Expected: `방문 168개, 문제 0개`(166 + 404 두 개).

- [ ] **Step 6: 커밋(허락받았을 때)**

```bash
git add textbook tests
git commit -m "feat(site): every route from one sitemap, 404 screen and 404 build"
```

---

### Task 8: 시각 테스트 틀

**Files:**
- Create: `tests/visual/visual.test.mjs`, `tests/visual/baseline/`(이미지), `tests/visual/README.md`
- Modify: `textbook/package.json`, `.gitignore`(`tests/visual/.out/`)
- Test: 자기 자신

**Interfaces:**
- Consumes: `build`, `startStaticServer`, `launch`
- Produces:
  - `npm run test:visual` → `node --test "../tests/visual/**/*.test.mjs"`
  - `npm run test:visual:update` → 같은 명령에 환경 변수 `WZH_VISUAL_UPDATE=1`(`node --env-file` 없이 `cross-env` 없이 되도록 스크립트를 `node ../tests/visual/run.mjs --update`로 둔다. `run.mjs`는 환경 변수를 세우고 `node --test`를 자식으로 띄운다)
  - 장면 목록 `SCENES`: `{ id, hash, progress }[]`. M0의 장면: `home`(`#/`, P1 Day 1~3 완료), `day`(`#/day/p1-d01`, 같은 진도), `settings`(`#/settings`), `notfound`(`#/nope`)
  - 화면 폭 `[375, 768, 1280]` × 테마 `['light', 'dark']` → 장면마다 6장. 파일 이름 `baseline/<id>-<width>-<theme>.png`. M0는 24장
  - 고정: 뷰포트 높이 900, `deviceScaleFactor: 1`, `reducedMotion: 'reduce'`, `locale: 'ko-KR'`, 진도는 `addInitScript`로 주입, `page.clock`(Playwright)으로 시각을 `2026-01-01T00:00:00+09:00`에 고정, `document.fonts.ready`를 기다린 뒤 뷰포트만 찍는다(`fullPage: false`). 빌드 날짜가 푸터에 보이므로 `#footer-built`는 `mask`로 가린다
  - 비교: `pixelmatch(a, b, diff, w, h, { threshold: 0.1 })`. 다른 픽셀이 전체의 0.1%를 넘으면 실패하고 `tests/visual/.out/<name>.diff.png`와 `.actual.png`를 남긴다. 크기가 다르면 바로 실패. 기준 이미지가 없으면 "기준 이미지 없음: `npm run test:visual:update`"로 실패(업데이트 모드에서는 저장)

- [ ] **Step 1: 의존성을 넣는다**

Run (`textbook/`): `npm install --save-dev --save-exact pixelmatch@8.0.0 pngjs@7.0.0`
`package.json`의 `devDependencies`에 정확한 버전으로 들어갔는지 확인한다.

- [ ] **Step 2: 비교 함수의 실패하는 테스트를 쓴다**

`tests/visual/visual.test.mjs` 맨 위에 순수 함수 테스트:
```js
test('compare: identical passes, a changed block fails, different sizes fail', () => {
  const a = solidPng(100, 100, [255, 255, 255]);
  assert.equal(compare(a, a).ok, true);
  const b = withBlock(a, 10, 10, 20, 20, [0, 0, 0]); // 400픽셀 = 4%
  const r = compare(a, b);
  assert.equal(r.ok, false);
  assert.ok(r.diffRatio > 0.03);
  assert.equal(compare(a, solidPng(100, 101, [255, 255, 255])).ok, false);
});
```

- [ ] **Step 3: 실패 확인** — Run: `npm run test:visual` → `compare` 없음.

- [ ] **Step 4: 구현한다** — `compare(aBuffer, bBuffer): { ok, diffRatio, diffPng }`, 장면 반복, 업데이트 모드.

- [ ] **Step 5: 기준 이미지를 만들고 눈으로 본다**

Run: `npm run test:visual:update` → 24장 생성. 24장을 모두 열어 본다(Read 도구). 확인할 것: 헤더·푸터가 Task 6에서 승인받은 모양, 글꼴이 내장 글꼴, 다크에서 글자가 읽힌다, 가로로 잘린 요소가 없다. 이상이 있으면 고치고 다시 만든다.

- [ ] **Step 6: 흔들림이 없는지 확인한다**

Run: `npm run test:visual` 을 세 번.
Expected: 세 번 모두 24/24 통과. 한 번이라도 실패하면 흔들리는 원인(애니메이션, 글꼴 로드 시점, 스크롤바)을 찾아 고정한다. 문턱값을 올려서 덮지 않는다.

- [ ] **Step 7: 일부러 깨뜨려 본다**

`tokens.css`의 `--color-paper`를 임시로 바꾸고 `npm run test:visual` → 실패하고 `.out/`에 diff가 생기는지 확인한 뒤 되돌린다.

- [ ] **Step 8: `tests/visual/README.md`를 쓴다**

내용: 실행 명령 두 개, 기준 이미지는 이 PC(Windows)에서만 만들고 비교한다, 의도한 변경이면 사용자 승인 뒤 `update`, 장면을 추가하는 방법(`SCENES`에 한 줄).

- [ ] **Step 9: 커밋(허락받았을 때)**

```bash
git add tests/visual textbook/package.json textbook/package-lock.json .gitignore
git commit -m "test(visual): screenshot baselines at 375/768/1280, light and dark"
```

---

### Task 9: 자동 배포

**Files:**
- Create: `.github/workflows/deploy.yml`, `textbook/content/published.json`
- Modify: `textbook/build.mjs`, `textbook/package.json`, `docs/research/external-facts.md`
- Test: `tests/build/build.test.mjs`

**Interfaces:**
- Consumes: `build({ notFound })`, `npm run check:site`
- Produces:
  - `textbook/content/published.json`: `{ "p1": [1, 30], "p2": [1, 10] }` — 프로젝트 id → 리뷰를 통과한 Day 범위(처음, 끝). 없는 프로젝트는 0개
  - `build({ …, publishedOnly: boolean })`와 CLI `--published`: 목록 밖의 Day는 파일이 있어도 "준비 중" 화면으로 만든다. 목록에 있는데 파일이 없으면 `E_PUBLISHED_MISSING`
  - `npm run build:site` → `node build.mjs --published --allow-missing --out ../_site/index.html` 뒤 `node build.mjs --published --allow-missing --notfound --out ../_site/404.html`. `_site/`는 `.gitignore`에 넣는다
  - 워크플로 `deploy.yml`: `on: push`(브랜치 `claude/gifted-goldberg-u1f9c6`)와 `workflow_dispatch`. `concurrency: { group: pages, cancel-in-progress: false }`

- [ ] **Step 1: 액션의 현재 사용법을 읽는다**

`gh api repos/actions/configure-pages/readme --jq .content | base64 -d`(같은 방법으로 `upload-pages-artifact`, `deploy-pages`, `setup-node`, `setup-python`). 입력 이름(`path` 등)과 필요한 권한이 아래 초안과 다르면 README를 따른다. 읽은 내용을 `external-facts.md`의 같은 절에 한 줄씩 적는다.

- [ ] **Step 2: `published` 빌드의 실패하는 테스트를 쓴다**

```js
test('published build hides days outside the reviewed ranges', async () => {
  // 픽스처 사본에 published.json { "fa": [1, 1] } 을 둔다 (fa 는 Day 2개)
  const r = await build({ contentDir: content, publishedOnly: true });
  assert.equal(r.ok, true);
  assert.match(template(r.html, 't-day-fa-d02'), /coming-soon/);
  assert.doesNotMatch(template(r.html, 't-day-fa-d01'), /coming-soon/);
  assert.equal(embeddedData(r.html).search.find((s) => s.id === 'fa-d02').text, '');
});
test('a published day without a file is E_PUBLISHED_MISSING', async () => { /* { "fa": [1, 3] } */ });
```

- [ ] **Step 3: 실패 확인 → 구현 → 통과 확인**

Run: `npm test` (실패) → `build.mjs` 구현, `published.json` 작성 → `npm test` (통과).

- [ ] **Step 4: 워크플로를 쓴다**

```yaml
name: deploy
on:
  push:
    branches: [claude/gifted-goldberg-u1f9c6]
  workflow_dispatch:
permissions:
  contents: read
concurrency:
  group: pages
  cancel-in-progress: false
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7.0.1
      - uses: actions/setup-node@v7.1.0
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: textbook/package-lock.json
      - uses: actions/setup-python@v7.1.0
        with:
          python-version: '3.12'
      - run: pip install fonttools brotli
      - run: npm ci
        working-directory: textbook
      - run: npm install -g playwright@1.63.0 && npx -y playwright@1.63.0 install --with-deps chromium
      - run: echo "NODE_PATH=$(npm root -g)" >> "$GITHUB_ENV"
      - run: npm test
        working-directory: textbook
      - run: npm run check -- --allow-missing
        working-directory: textbook
      - run: npm run test:e2e
        working-directory: textbook
      - run: npm run build:site
        working-directory: textbook
      - uses: actions/configure-pages@v6.0.0
      - uses: actions/upload-pages-artifact@v5.0.0
        with:
          path: _site
  deploy:
    needs: build
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5.0.1
```
시각 테스트는 CI에서 돌리지 않는다(스펙 8장). `fonttools`와 `brotli`는 버전을 고정하지 않는다. 고정이 필요해지면(결과 바이트가 달라져 문제가 되면) `external-facts.md`에 버전을 적고 고정한다.

- [ ] **Step 5: 로컬에서 배포 묶음을 확인한다**

Run: `npm run build:site` → `_site/index.html`, `_site/404.html`이 생긴다. `_site`를 로컬 서버로 띄우고 `npm run check:site -- http://127.0.0.1:<포트>/` → `문제 0개`. `/404.html`을 열어 404 화면을 확인한다. `#/day/p2-d11`이 "준비 중"으로 나오는지 확인한다(목록 밖).

- [ ] **Step 6: 사용자에게 확인받는다 (되돌리기 어려운 단계)**

묻는다: **"지금까지의 커밋을 push하고 저장소 설정에서 GitHub Pages를 켜면(소스: GitHub Actions) 교재가 `<url>`에 공개됩니다. 진행할까요?"** 답이 없거나 아니면 여기서 멈추고 Task 10의 문서 갱신만 한다.

- [ ] **Step 7: Pages를 켜고 push한다 (승인 뒤)**

```bash
gh api -X POST repos/{owner}/{repo}/pages -f build_type=workflow
```
```bash
git add .github textbook .gitignore tests docs/research/external-facts.md
git commit -m "ci: test, build and deploy the textbook to GitHub Pages"
```
```bash
git push origin claude/gifted-goldberg-u1f9c6
```
위 `gh api -X POST …/pages` 호출의 인자(`build_type=workflow`)는 확인되지 않았다. 실패하면 오류 문구를 읽고 GitHub REST 문서의 "Create a GitHub Pages site"를 확인한다. 그래도 안 되면 사용자에게 부탁한다: 저장소 페이지 → Settings → 왼쪽 Pages → "Build and deployment"의 Source를 "GitHub Actions"로.
`gh api repos/{owner}/{repo}/pages --jq .html_url`의 출력이 `curriculum.json`의 `url`과 글자 하나까지 같은지 확인한다. 다르면 `curriculum.json`을 고치고 다시 커밋·push한다.
`github-pages` 환경이 이 브랜치의 배포를 막으면(배포 브랜치 제한), 오류 문구를 사용자에게 보이고 저장소 Settings → Environments → github-pages → Deployment branches에 이 브랜치를 더할지 묻는다. 임의로 설정을 바꾸지 않는다.

- [ ] **Step 8: 배포를 확인한다**

`gh run watch`(백그라운드)로 워크플로가 끝나기를 기다린다. 실패하면 `gh run view --log-failed`로 원인을 읽고 고친다(테스트를 끄거나 건너뛰지 않는다).
성공하면: `npm run check:site -- <url>`
Expected: `방문 168개, 문제 0개`.
그다음 배포 주소를 375·1280 × 라이트·다크로 찍어(홈, Day 1, 404) 로컬 기준 이미지와 눈으로 비교한다. `<url>없는경로`를 열어 404 화면과 "홈으로 가기"가 `<url>`로 가는지 확인한다.

---

### Task 10: 문서 갱신과 완료 보고

**Files:**
- Modify: `docs/superpowers/specs/2026-11-12-unified-roadmap-design.md`(9장, 11장), `docs/CHECKPOINT.md`, `CLAUDE.md`, `docs/checkpoint/workspace/progress.md`, 저장소 루트 `index.html`

- [ ] **Step 1: 스펙을 고친다**

- 9장: 액션 버전을 이 계획의 "확인한 사실" 값으로 바꾸고 근거를 [측정]으로 바꾼다.
- 11.1 M0: 내용에 "웹폰트, 아이콘, 공용 부품, 헤더·테마 메뉴·푸터, 404, 전 페이지 점검"을 더하고, 완료 기준에 "배포 URL에서 전 페이지가 열린다", "헤더·푸터가 승인 시안과 같은 품질"을 더한다.
- 11.2 M1: "웹폰트·아이콘·공용 부품"을 빼고 "`motion.js`(Reveal, stagger, Tilt, Magnetic, Shake, 세션 1회 기록)와 토스트 틀"로 줄인다. 완료 기준을 그에 맞게 고친다(주 버튼 Magnetic, 동작 줄이기에서 꺼짐).
- 11.2 M2: "상단 바, 테마 Dropdown, 건너뛰기 링크"를 빼고 "사이드바 Accordion·Day 행 상태 5종·`<dialog>` Drawer·월드 전환 메뉴"로 줄인다.
- 12장 대응표의 해당 줄을 맞춘다.

- [ ] **Step 2: `CHECKPOINT.md`와 `CLAUDE.md`를 고친다**

- `CHECKPOINT.md`: 맨 위 상태를 "M0 완료, 다음은 M1"로. 3장의 "실행 방식은 Subagent 방식"을 "Native: `executing-plans`로 한 세션이 한 마일스톤"으로. 7·8장(재개 절차, 작업 방식 규칙)을 "통합 로드맵 설계서 10·11장을 따른다"는 안내로 바꾸고 옛 내용은 `docs/checkpoint/CHECKPOINT-2026-11-06.md`로 보관한다. 기준선 숫자를 새로 잰 값으로.
- `CLAUDE.md`: 명령에 `npm run test:visual`, `npm run check:site -- <주소>`, `npm run build:site`를 더한다. 스택에 Python 3 + fontTools + brotli(빌드 필수), pixelmatch·pngjs를 더한다. 문서 지도에 통합 로드맵 설계서와 이 계획서를 더한다. 규칙 2의 "공개 주소 설정은 아직 없다"를 "`url` 키"로 고친다. 규칙 4의 스크린샷 폭을 375·768·1280으로 고친다. 코드 위치에 `styles/`, `lib/site.mjs`·`styles.mjs`·`fonts.mjs`, `views/icons.js`를 더한다.

- [ ] **Step 3: 저장소 루트 `index.html`을 다시 빌드한다**

Run: `node build.mjs --published --allow-missing` (기본 출력이 루트 `index.html`). 더블클릭(`file:`)으로 열어 홈이 뜨는지 확인한다(이 확인은 사용자에게 부탁하거나, Playwright가 `file:`을 못 쓰므로 "확인하지 못함"으로 적는다).

- [ ] **Step 4: 전체 검증**

Run: `npm test; npm run check -- --allow-missing; npm run test:e2e; npm run test:visual; npm run check:site -- <url>`
Expected: 전부 통과. 각 명령의 마지막 요약 줄을 보고에 넣는다.

- [ ] **Step 5: `progress.md`에 기록하고 커밋·push(허락받았을 때)**

`progress.md` 끝에: `- M0: complete (commits <처음>..<끝>; 배포 <url>; 단위·빌드 N, e2e N, 시각 24, 전 페이지 168)`.
```bash
git add docs CLAUDE.md index.html
git commit -m "docs: M0 complete — native workflow, commands, roadmap scope shift"
```
```bash
git push origin claude/gifted-goldberg-u1f9c6
```

- [ ] **Step 6: 완료 보고**

M0 완료 기준 여섯 개를 증거와 함께 보고한다.

| 기준 | 증거 |
|---|---|
| ① 공개 주소에서 교재가 열린다 | 주소, 배포본 홈 스크린샷 |
| ② 새 남색 팔레트, 다크 전환 | 라이트·다크 스크린샷 |
| ③ push 뒤 Actions가 초록 | `gh run list --limit 1` 출력 |
| ④ `npm run test:visual`이 3폭 스크린샷을 비교한다 | 24/24 출력 |
| ⑤ 배포 URL에서 전 페이지가 열린다 | `check:site` 출력(`방문 168개, 문제 0개`) |
| ⑥ 헤더·푸터가 홈 시안과 같은 품질 | 시안과 나란히 놓은 헤더 스크린샷, 승인받은 푸터 스크린샷 |

확인하지 못한 것을 적는다: Safari·Firefox, 휴대폰 실기기, 화면 낭독기, `file:` 더블클릭(직접 못 했다면).

---

## 한 세션에 끝나지 않을 때

이 계획은 스펙의 M0보다 크다(M1·M2의 일부가 들어왔다). 세션이 길어지면 Task 경계에서 멈춘다. 멈출 수 있는 자리는 Task 2 뒤(새 팔레트), Task 6 뒤(레이아웃 완성), Task 8 뒤(배포 직전)다. `progress.md`에 `M0: Task N까지 완료`를 적고 다음 세션이 이 계획서의 다음 Task부터 이어서 한다.
