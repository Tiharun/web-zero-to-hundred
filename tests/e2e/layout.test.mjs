// 공통 레이아웃·공용 컴포넌트 e2e: 픽스처 교재를 빌드해 로컬 서버(127.0.0.1)로 연다.
// 값은 DESIGN.md(Components·Elevation)와 같아야 한다. 실행: cd textbook && npm run test:e2e
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { build } from '../../textbook/build.mjs';
import { launch, collectConsoleErrors } from '../helpers/browser.mjs';
import { startStaticServer } from '../helpers/static-server.mjs';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const FIXTURE = path.join(ROOT, 'tests', 'fixtures', 'content');
const TIMEOUT = { timeout: 90_000 };

let tmp;
let server;
let browser;
const opened = [];

before(async () => {
  tmp = await mkdtemp(path.join(tmpdir(), 'wzh-layout-'));
  const r = await build({ contentDir: FIXTURE });
  assert.equal(r.ok, true, JSON.stringify(r.errors));
  await writeFile(path.join(tmp, 'index.html'), r.html);
  server = await startStaticServer(tmp);
  browser = await launch();
});

after(async () => {
  for (const { context } of opened) await context.close();
  await browser?.close();
  await server?.close();
  if (tmp) await rm(tmp, { recursive: true, force: true });
});

/** 새 컨텍스트(깨끗한 저장소)로 화면 하나를 연다. theme 은 시스템 색 모드로 흉내 낸다 */
async function open(hash, { width = 1280, theme = 'light' } = {}) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: theme });
  const page = await context.newPage();
  const errors = collectConsoleErrors(page);
  opened.push({ context, errors });
  await page.goto(`${server.url}index.html${hash}`);
  await page.locator('main h1').first().waitFor();
  return page;
}

test('the primary button presses into its ledge and meets the size floor', TIMEOUT, async () => {
  const page = await open('#/', { width: 1280 });
  const btn = page.locator('main .btn-primary');
  assert.equal(await btn.count(), 1, '주 버튼은 한 화면에 하나');
  const box = await btn.boundingBox();
  assert.ok(box.height >= 48, `높이 ${box.height}`);
  const style = await btn.evaluate((el) => {
    const s = getComputedStyle(el);
    return [s.backgroundColor, s.fontWeight, s.borderRadius, s.boxShadow, s.fontSize];
  });
  assert.deepEqual(style.slice(0, 3), ['rgb(219, 39, 119)', '800', '6px']);
  assert.match(style[3], /rgb\(157, 23, 77\) 0px 4px 0px 0px/);
  assert.equal(style[4], '17px');
});

test('focus ring is the focus token, 2px, offset 2px', TIMEOUT, async () => {
  const page = await open('#/', { width: 1280 });
  const btn = page.locator('main .btn-primary');
  for (let i = 0; i < 40 && !(await btn.evaluate((el) => el === document.activeElement)); i++) await page.keyboard.press('Tab');
  const ring = await btn.evaluate((el) => {
    const s = getComputedStyle(el);
    return [el === document.activeElement, s.outlineStyle, s.outlineWidth, s.outlineColor, s.outlineOffset];
  });
  assert.deepEqual(ring, [true, 'solid', '2px', 'rgb(219, 39, 119)', '2px']);
});

test('no blurred shadow anywhere on the home screen', TIMEOUT, async () => {
  for (const theme of ['light', 'dark']) {
    const page = await open('#/', { width: 1280, theme });
    const blurred = await page.evaluate(() =>
      [...document.querySelectorAll('*')]
        .filter((el) => /\dpx \dpx [1-9]\d*px/.test(getComputedStyle(el).boxShadow))
        .map((el) => `${el.tagName}.${el.className}`),
    );
    assert.deepEqual(blurred, [], theme);
  }
});

test('technology chips use the track chip from DESIGN.md', TIMEOUT, async () => {
  // 공용 함수는 번들 안에 있어서 직접 부르지 않는다. 화면에 그려진 부품으로 확인한다.
  const page = await open('#/', { width: 1280 });
  const chip = page.locator('main .chips li').first();
  assert.ok((await chip.count()) > 0, '홈의 기술 칩');
  const chipStyle = await chip.evaluate((el) => {
    const s = getComputedStyle(el);
    return [s.backgroundColor, s.borderRadius, s.paddingTop, s.paddingLeft, s.fontSize];
  });
  assert.deepEqual(chipStyle, ['rgb(241, 245, 249)', '6px', '2px', '8px', '15px']);
});

test('no console errors on the opened screens', TIMEOUT, () => {
  for (const { errors } of opened) assert.deepEqual(errors, []);
});
