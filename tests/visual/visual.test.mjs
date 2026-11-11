// 시각 테스트: 장면(SCENES)을 375·768·1280 × 라이트·다크로 찍어 baseline/ 의 기준 이미지와 비교한다.
// 실행: cd textbook && npm run test:visual   (기준 이미지 갱신: npm run test:visual:update, 사용자 승인 뒤에만)
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { PNG } from './deps.mjs';
import { compare } from './compare.mjs';
import { build } from '../../textbook/build.mjs';
import { STORAGE_KEY } from '../../textbook/src/app/progress.js';
import { launch } from '../helpers/browser.mjs';
import { startStaticServer } from '../helpers/static-server.mjs';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const BASELINE = path.join(HERE, 'baseline');
const OUT = path.join(HERE, '.out');
const UPDATE = process.env.WZH_VISUAL_UPDATE === '1';
const TIMEOUT = { timeout: 60_000 };

const P1_FIRST_THREE = { completed: ['p1-d01', 'p1-d02', 'p1-d03'], lastDay: 'p1-d03' };

/** 찍을 장면. 장면을 늘릴 때는 여기에 한 줄을 더한다 */
export const SCENES = [
  { id: 'home', hash: '#/', progress: P1_FIRST_THREE },
  { id: 'day', hash: '#/day/p1-d01', progress: P1_FIRST_THREE },
  { id: 'settings', hash: '#/settings', progress: null },
  { id: 'notfound', hash: '#/nope', progress: null },
];
const WIDTHS = [375, 768, 1280];
const THEMES = ['light', 'dark'];
const FIXED_TIME = '2026-01-01T00:00:00+09:00';

/** 장면의 진도를 저장소 값으로 만든다. 테마도 진도에 함께 저장된다 */
function storedProgress(progress, theme) {
  const completed = Object.fromEntries((progress?.completed ?? []).map((id) => [id, '2026-01-01T00:00:00.000Z']));
  return { version: 1, completed, checks: {}, lastDay: progress?.lastDay ?? null, theme };
}

let tmp;
let server;
let browser;

before(async () => {
  tmp = await mkdtemp(path.join(tmpdir(), 'wzh-visual-'));
  const r = await build({ contentDir: path.join(ROOT, 'textbook', 'content'), allowMissing: true });
  assert.equal(r.ok, true, JSON.stringify(r.errors?.slice(0, 3)));
  await writeFile(path.join(tmp, 'index.html'), r.html);
  server = await startStaticServer(tmp);
  browser = await launch();
  await mkdir(OUT, { recursive: true });
});

after(async () => {
  await browser?.close();
  await server?.close();
  if (tmp) await rm(tmp, { recursive: true, force: true });
});

async function shoot(scene, width, theme) {
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
    locale: 'ko-KR',
    colorScheme: theme,
  });
  try {
    await context.addInitScript(
      ({ key, value }) => localStorage.setItem(key, value),
      { key: STORAGE_KEY, value: JSON.stringify(storedProgress(scene.progress, theme)) },
    );
    const page = await context.newPage();
    await page.clock.setFixedTime(new Date(FIXED_TIME));
    await page.goto(`${server.url}index.html${scene.hash}`);
    await page.locator('main h1').first().waitFor();
    await page.evaluate(() => document.fonts.ready.then(() => true));
    // 설정 화면의 빌드 날짜는 빌드할 때마다 바뀌므로 가린다
    const mask = [page.locator('main p', { hasText: /빌드 \d{4}/ })];
    return await page.screenshot({ fullPage: false, mask, animations: 'disabled', caret: 'hide' });
  } finally {
    await context.close();
  }
}

for (const scene of SCENES) {
  for (const width of WIDTHS) {
    for (const theme of THEMES) {
      const name = `${scene.id}-${width}-${theme}`;
      test(`visual: ${name}`, TIMEOUT, async () => {
        const actual = await shoot(scene, width, theme);
        const file = path.join(BASELINE, `${name}.png`);
        if (UPDATE) {
          await mkdir(BASELINE, { recursive: true });
          await writeFile(file, actual);
          return;
        }
        const expected = await readFile(file).catch(() => null);
        assert.ok(expected, `기준 이미지 없음: ${path.relative(ROOT, file)} — npm run test:visual:update`);
        const r = compare(expected, actual);
        if (!r.ok) {
          await writeFile(path.join(OUT, `${name}.actual.png`), actual);
          if (r.diffPng) await writeFile(path.join(OUT, `${name}.diff.png`), r.diffPng);
        }
        assert.ok(r.ok, `${name}: ${r.reason} → tests/visual/.out/ 에서 확인`);
      });
    }
  }
}

function solidPng(width, height, [r, g, b]) {
  const png = new PNG({ width, height });
  for (let i = 0; i < png.data.length; i += 4) png.data.set([r, g, b, 255], i);
  return PNG.sync.write(png);
}

function withBlock(buffer, x0, y0, w, h, [r, g, b]) {
  const png = PNG.sync.read(buffer);
  for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) png.data.set([r, g, b, 255], (y * png.width + x) * 4);
  return PNG.sync.write(png);
}

test('compare: identical passes, a changed block fails, different sizes fail', () => {
  const a = solidPng(100, 100, [255, 255, 255]);
  assert.equal(compare(a, a).ok, true);
  const b = withBlock(a, 10, 10, 20, 20, [0, 0, 0]); // 400픽셀 = 4%
  const r = compare(a, b);
  assert.equal(r.ok, false);
  assert.ok(r.diffRatio > 0.03, String(r.diffRatio));
  assert.ok(Buffer.isBuffer(r.diffPng));
  const sized = compare(a, solidPng(100, 101, [255, 255, 255]));
  assert.equal(sized.ok, false);
  assert.match(sized.reason, /크기/);
  // 0.1% 이하(10픽셀 미만)의 차이는 통과
  assert.equal(compare(a, withBlock(a, 0, 0, 3, 3, [0, 0, 0])).ok, true);
});

test('compare: a pale token shift is caught (paper #EEF2FF → #FFF0F0, OKLab distance 0.033)', () => {
  const paper = solidPng(50, 50, [0xee, 0xf2, 0xff]);
  assert.equal(compare(paper, solidPng(50, 50, [0xff, 0xf0, 0xf0])).ok, false);
  assert.equal(compare(paper, paper).ok, true);
});
