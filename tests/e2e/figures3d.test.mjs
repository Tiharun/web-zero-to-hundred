// 3D 그림 e2e (DESIGN.md "그림 틀" 3D 그림, 개편 설계서 7.3): 실제 교재를 빌드해 로컬 서버(127.0.0.1)로 연다.
// 헤드리스 Chromium 은 launch() 의 --enable-unsafe-swiftshader 로 WebGL(소프트웨어)을 쓴다.
// 실행: cd textbook && npm run test:e2e
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { build } from '../../textbook/build.mjs';
import { STORAGE_KEY } from '../../textbook/src/app/progress.js';
import { HOME_VIEW } from '../../textbook/src/app/view3d.js';
import { launch, collectConsoleErrors } from '../helpers/browser.mjs';
import { startStaticServer } from '../helpers/static-server.mjs';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const TIMEOUT = { timeout: 120_000 };
const DONE = '2026-01-01T00:00:00.000Z';
/** P1 Day 1~19 를 마친 진도: Day 20 까지 열린다 */
const PROGRESS = {
  version: 1,
  completed: Object.fromEntries(Array.from({ length: 19 }, (_, i) => [`p1-d${String(i + 1).padStart(2, '0')}`, DONE])),
  checks: {},
  lastDay: 'p1-d19',
  theme: 'light',
};
const BOX = { hash: '#/day/p1-d10', id: 'box-model-3d' };

let tmp;
let server;
let browser;

before(async () => {
  tmp = await mkdtemp(path.join(tmpdir(), 'wzh-figures3d-'));
  const r = await build({ contentDir: path.join(ROOT, 'textbook', 'content'), allowMissing: true });
  assert.equal(r.ok, true, JSON.stringify(r.errors?.slice(0, 3)));
  await writeFile(path.join(tmp, 'index.html'), r.html);
  server = await startStaticServer(tmp);
  browser = await launch();
});

after(async () => {
  await browser?.close();
  await server?.close();
  if (tmp) await rm(tmp, { recursive: true, force: true });
});

/** WebGL 2(와 1)를 못 쓰는 브라우저처럼 만든다 */
function noWebgl() {
  const original = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
    return type === 'webgl2' || type === 'webgl' ? null : original.call(this, type, ...rest);
  };
}

/** Day 를 열고 3D 그림을 화면에 스크롤한 뒤 상태(state)가 되기를 기다린다 */
async function open3d({ hash, id } = BOX, { width = 1280, height = 900, reduce = false, webgl = true, touch = false, scale = 1, js = true, state = 'ready', setup } = {}) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: scale,
    hasTouch: touch,
    javaScriptEnabled: js,
    reducedMotion: reduce ? 'reduce' : 'no-preference',
    locale: 'ko-KR',
  });
  await context.addInitScript(({ key, value }) => localStorage.setItem(key, value), { key: STORAGE_KEY, value: JSON.stringify(PROGRESS) });
  if (!webgl) await context.addInitScript(noWebgl);
  const page = await context.newPage();
  const errors = collectConsoleErrors(page);
  const messages = [];
  page.on('console', (m) => messages.push(`${m.type()}: ${m.text()}`));
  if (setup) await setup(page, context);
  await page.goto(`${server.url}index.html${hash}`);
  const fig = page.locator(`figure[data-figure="${id}"]`);
  await fig.waitFor();
  await fig.scrollIntoViewIfNeeded();
  if (state) await fig.locator(`.fig3d[data-state="${state}"]`).waitFor({ timeout: 60_000 });
  return { context, page, fig, errors, messages };
}

const view = async (fig) => ({ yaw: Number(await fig.locator('.fig3d').getAttribute('data-yaw')), pitch: Number(await fig.locator('.fig3d').getAttribute('data-pitch')) });

test('box model figure turns by mouse drag', TIMEOUT, async () => {
  const { context, page, fig, errors } = await open3d();
  assert.deepEqual(await view(fig), HOME_VIEW);
  const canvas = fig.locator('canvas');
  const before = await canvas.screenshot();
  const label = fig.locator('.fig3d-label').first();
  const labelBefore = await label.evaluate((el) => el.style.transform);
  const box = await canvas.boundingBox();
  const [cx, cy] = [box.x + box.width / 2, box.y + box.height / 2];
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(cx + 120, cy, { steps: 6 });
  await page.mouse.up();
  // 오른쪽으로 끌면 물체가 손을 따라 오른쪽으로 돈다: 카메라 yaw 는 120px × 0.5° 만큼 줄어든다
  assert.deepEqual(await view(fig), { yaw: -95, pitch: 20 });
  assert.notDeepEqual(await canvas.screenshot(), before);
  assert.notEqual(await label.evaluate((el) => el.style.transform), labelBefore);
  assert.deepEqual(errors, []);
  await context.close();
});

test('view buttons turn and reset by keyboard', TIMEOUT, async () => {
  const { context, page, fig, errors } = await open3d(BOX, { reduce: true });
  const right = fig.getByRole('button', { name: '오른쪽으로 →' });
  await right.focus();
  await page.keyboard.press('Enter');
  assert.deepEqual(await view(fig), { yaw: -65, pitch: 20 });
  await fig.getByRole('button', { name: '← 왼쪽으로' }).focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');
  assert.deepEqual(await view(fig), { yaw: -5, pitch: 20 });
  const home = fig.getByRole('button', { name: '↺ 처음 시점' });
  await home.focus();
  await page.keyboard.press('Enter');
  assert.deepEqual(await view(fig), HOME_VIEW);
  assert.equal(await page.evaluate(() => document.activeElement.textContent), '↺ 처음 시점');
  assert.equal(await fig.locator('.figure-views').getAttribute('role'), 'group');
  assert.equal(await fig.locator('.figure-views').getAttribute('aria-label'), '시점 바꾸기');
  assert.deepEqual(errors, []);
  await context.close();
});

test('buttons ease over 280ms without reduced motion', TIMEOUT, async () => {
  const { context, page, fig } = await open3d();
  const mid = await page.evaluate(async () => {
    const fig3d = document.querySelector('.fig3d');
    [...document.querySelectorAll('.figure-views button')].find((b) => b.textContent === '오른쪽으로 →').click();
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    return Number(fig3d.dataset.yaw);
  });
  assert.ok(mid < -35 && mid > -65, `mid yaw ${mid}`);
  await page.waitForTimeout(400);
  assert.deepEqual(await view(fig), { yaw: -65, pitch: 20 });
  await context.close();
});

test('no WebGL shows the static figure and the description', TIMEOUT, async () => {
  const { context, fig, errors } = await open3d(BOX, { webgl: false, state: 'static' });
  assert.equal(await fig.locator('svg.fig3d-static').isVisible(), true);
  const desc = fig.locator('.fig3d-desc');
  assert.equal(await desc.isVisible(), true);
  assert.equal(await desc.textContent(), await fig.locator('.figure-art').getAttribute('aria-label'));
  assert.equal(await fig.locator('canvas').count(), 0);
  assert.equal(await fig.locator('.figure-views').isVisible(), false);
  assert.equal(await fig.locator('.figure-art').getAttribute('aria-busy'), null);
  assert.deepEqual(errors, []);
  await context.close();
});

test('context loss falls back to the static figure', TIMEOUT, async () => {
  const { context, fig, errors } = await open3d();
  await fig.locator('canvas').evaluate((c) => c.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
  await fig.locator('.fig3d[data-state="static"]').waitFor();
  assert.equal(await fig.locator('svg.fig3d-static').isVisible(), true);
  assert.equal(await fig.locator('.fig3d-desc').isVisible(), true);
  assert.equal(await fig.locator('.figure-views').isVisible(), false);
  assert.deepEqual(errors, []);
  await context.close();
});

test('slow start shows the skeleton for at least 300ms', TIMEOUT, async () => {
  const { context, fig } = await open3d(BOX, {
    state: null,
    setup: async (page, ctx) => {
      // 자리표시가 붙고 떨어진 때와 그때의 aria-busy 를 기록한다
      await ctx.addInitScript(() => {
        window.__skel = [];
        new MutationObserver((list) => {
          for (const m of list) {
            for (const n of m.addedNodes) if (n.classList?.contains('skeleton-block')) window.__skel.push(['show', performance.now(), n.closest('.figure-art')?.getAttribute('aria-busy')]);
            for (const n of m.removedNodes) if (n.classList?.contains('skeleton-block')) window.__skel.push(['hide', performance.now()]);
          }
        }).observe(document, { childList: true, subtree: true });
      });
      const cdp = await ctx.newCDPSession(page);
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 10 });
    },
  });
  await fig.locator('.fig3d[data-state="ready"]').waitFor({ timeout: 90_000 });
  const log = await fig.evaluate(() => window.__skel);
  const show = log.find((e) => e[0] === 'show');
  const hide = log.find((e) => e[0] === 'hide');
  assert.ok(show && hide, JSON.stringify(log));
  assert.equal(show[2], 'true');
  assert.ok(hide[1] - show[1] >= 300, `skeleton ${hide[1] - show[1]}ms`);
  assert.equal(await fig.locator('.skeleton-block').count(), 0);
  await context.close();
});

test('theme switch repaints the 3D figure', TIMEOUT, async () => {
  const { context, page, fig, errors } = await open3d();
  const canvas = fig.locator('canvas');
  const light = await canvas.screenshot();
  await page.getByTestId('theme-toggle').click();
  await page.locator('#theme-menu [data-theme-value="dark"]').click();
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  assert.notDeepEqual(await canvas.screenshot(), light);
  assert.equal(await fig.locator('.fig3d').getAttribute('data-state'), 'ready');
  assert.deepEqual(errors, []);
  await context.close();
});

test('leaving and returning six times leaks no WebGL context', TIMEOUT, async () => {
  const { context, page, fig, messages } = await open3d();
  for (let i = 0; i < 6; i++) {
    await page.evaluate(() => (location.hash = '#/'));
    await page.locator('.home').waitFor();
    await page.evaluate((h) => (location.hash = h), BOX.hash);
    await fig.waitFor();
    await fig.scrollIntoViewIfNeeded();
    await fig.locator('.fig3d[data-state="ready"]').waitFor();
  }
  assert.equal(await page.locator('canvas').count(), 1);
  assert.deepEqual(messages.filter((m) => /webgl|context/i.test(m) && !m.startsWith('log:')), []);
  await context.close();
});

test('touch scroll passes through the 3D figure', TIMEOUT, async () => {
  const { context, page, fig } = await open3d(BOX, { width: 375, height: 812, touch: true });
  assert.equal(await fig.locator('canvas').evaluate((c) => getComputedStyle(c).touchAction), 'pan-y');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
  await context.close();
});

test('3D figure prints as the static figure', TIMEOUT, async () => {
  const { context, page, fig } = await open3d();
  await page.emulateMedia({ media: 'print' });
  assert.equal(await fig.locator('svg.fig3d-static').isVisible(), true);
  assert.equal(await fig.locator('canvas').isVisible(), false);
  assert.equal(await fig.locator('.figure-views').isVisible(), false);
  assert.equal(await fig.locator('.fig3d-labels').isVisible(), false);
  await context.close();
});

test('3D figure prints at full width on wide paper', TIMEOUT, async () => {
  const { context, page, fig } = await open3d();
  await page.emulateMedia({ media: 'print' });
  const width = await fig.locator('.fig3d').evaluate((el) => el.getBoundingClientRect().width);
  assert.ok(width >= 300, `printed figure width ${width}`);
  await context.close();
});

test('JS off keeps the notice and the built description', TIMEOUT, async () => {
  // 교재는 JS 가 있어야 열린다(noscript 안내). 빌드한 Day 10 틀에는 그림 자리의 대체 설명이 그대로 들어 있다
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${server.url}index.html${BOX.hash}`);
  assert.match(await page.locator('main').innerText(), /JavaScript가 켜져 있어야/); // getByText 는 noscript 안 글을 찾지 않는다
  const html = await page.content();
  const tpl = /<template id="t-day-p1-d10">([\s\S]*?)<\/template>/.exec(html)?.[1] ?? '';
  assert.match(tpl, /data-figure="box-model-3d"[\s\S]*?<p class="figure-fallback">가운데 내용\(content\)을 padding/);
  await context.close();
});

test('pixel ratio is capped at 2', TIMEOUT, async () => {
  const { context, fig } = await open3d(BOX, { scale: 3 });
  const [w, cw] = await fig.locator('canvas').evaluate((c) => [c.width, c.clientWidth]);
  assert.equal(w, Math.round(cw * 2));
  await context.close();
});
