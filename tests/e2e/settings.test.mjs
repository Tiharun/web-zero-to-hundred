// 설정·상태 화면 e2e(M6): 확인 Modal, 진도 백업(내보내기·불러오기·왕복), 설정 카드, 오류 화면.
// 모양·문구는 DESIGN.md(확인 Modal, 설정 카드, 상태 화면)와 M6 계획서를 따른다. 실행: cd textbook && npm run test:e2e
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

import { build } from '../../textbook/build.mjs';
import { STORAGE_KEY } from '../../textbook/src/app/progress.js';
import { launch, collectConsoleErrors } from '../helpers/browser.mjs';
import { startStaticServer } from '../helpers/static-server.mjs';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const FIXTURE = path.join(ROOT, 'tests', 'fixtures', 'content');
const TIMEOUT = { timeout: 90_000 };

let tmp;
let server;
let browser;

before(async () => {
  tmp = await mkdtemp(path.join(tmpdir(), 'wzh-settings-'));
  const r = await build({ contentDir: FIXTURE });
  assert.equal(r.ok, true, JSON.stringify(r.errors));
  await writeFile(path.join(tmp, 'index.html'), r.html);
  server = await startStaticServer(tmp);
  browser = await launch();
});

after(async () => {
  await browser?.close();
  await server?.close();
  if (tmp) await rm(tmp, { recursive: true, force: true });
});

async function eventually(check, timeout = 5000) {
  const end = Date.now() + timeout;
  for (;;) {
    try {
      return await check();
    } catch (error) {
      if (Date.now() > end) throw error;
      await sleep(50);
    }
  }
}

const seedValue = (completed) =>
  JSON.stringify({
    version: 1,
    completed: Object.fromEntries(completed.map((id) => [id, '2026-11-13T00:00:00.000Z'])),
    checks: {},
    lastDay: completed.at(-1) ?? null,
    theme: 'system',
  });

/** 새 컨텍스트(깨끗한 저장소)를 만든다. progress 가 있으면 저장소에 미리 넣는다 */
async function newContext({ reducedMotion = 'no-preference', viewport = { width: 1280, height: 800 }, progress = null, init = null } = {}) {
  const context = await browser.newContext({ viewport, reducedMotion, locale: 'ko-KR', acceptDownloads: true });
  if (progress) await context.addInitScript(([key, v]) => localStorage.setItem(key, v), [STORAGE_KEY, seedValue(progress)]);
  if (init) await context.addInitScript(init);
  return context;
}

/** context 에서 hash 를 열고 본문 제목을 기다린다 */
async function openPage(context, hash) {
  const page = await context.newPage();
  const errors = collectConsoleErrors(page);
  await page.goto(`${server.url}index.html${hash}`);
  await page.locator('main h1').first().waitFor();
  return { page, errors };
}

/** 새 컨텍스트로 hash 를 열어 fn(page, { context, errors }) 에 넘기고, 끝에서 콘솔 오류 0 을 확인한다 */
async function withPage(hash, fn, opts = {}) {
  const context = await newContext(opts);
  try {
    const { page, errors } = await openPage(context, hash);
    await fn(page, { context, errors });
    assert.deepEqual(errors, [], '콘솔 오류가 없어야 해요');
  } finally {
    await context.close();
  }
}

const sidebarState = (page, dayId) => page.locator(`#sidebar [data-day="${dayId}"]`).getAttribute('data-state');
const stat = (page, name) => page.locator(`[data-testid="level-panel"] [data-stat="${name}"] dd`).innerText();
const activeTestId = (page) => page.evaluate(() => document.activeElement?.dataset?.testid ?? null);
const waitRoute = (page, hash) => page.waitForFunction((h) => location.hash === h && document.getElementById('main').dataset.hash === h, hash);

// ───────── 확인 Modal · 초기화 ─────────

test('reset asks in a modal; cancel, Escape and backdrop change nothing', TIMEOUT, async () => {
  await withPage(
    '#/settings',
    async (page) => {
      const modal = page.getByTestId('confirm-modal');
      const reset = page.getByTestId('reset-button');
      for (const close of ['cancel', 'Escape', 'backdrop']) {
        await reset.click();
        await modal.waitFor();
        assert.equal(await modal.getAttribute('role'), 'alertdialog');
        assert.equal(await page.locator('#confirm-title').innerText(), '모든 진도를 지울까요?');
        assert.equal(await activeTestId(page), 'confirm-cancel', '처음 포커스는 취소');
        if (close === 'cancel') await page.getByTestId('confirm-cancel').click();
        else if (close === 'Escape') await page.keyboard.press('Escape');
        else await page.mouse.click(5, 5);
        await modal.waitFor({ state: 'hidden' });
        await eventually(async () => assert.equal(await activeTestId(page), 'reset-button', '연 버튼으로 돌아간다'));
        assert.equal(await sidebarState(page, 'fa-d01'), 'done', `${close}: 진도는 그대로`);
      }
    },
    { progress: ['fa-d01'] },
  );
});

test('reset confirms in the modal and goes home with no progress', TIMEOUT, async () => {
  await withPage(
    '#/settings',
    async (page) => {
      await page.getByTestId('reset-button').click();
      const ok = page.getByTestId('confirm-ok');
      await ok.waitFor();
      assert.equal(await ok.innerText(), '모두 지우기');
      assert.match(await ok.getAttribute('class'), /\bbtn-danger\b/);
      await ok.click();
      await waitRoute(page, '#/');
      await page.getByTestId('level-panel').waitFor();
      assert.equal(await stat(page, 'days'), '0 / 3');
      assert.match(await page.locator('main').innerText(), /진도를 모두 지웠어요/);
      assert.equal(await sidebarState(page, 'fa-d01'), 'today');
    },
    { progress: ['fa-d01'] },
  );
});

test('back navigation while the confirm modal is open cancels it', TIMEOUT, async () => {
  await withPage(
    '#/',
    async (page) => {
      await page.locator('#settings-link').click();
      await waitRoute(page, '#/settings');
      await page.getByTestId('reset-button').click();
      await page.getByTestId('confirm-modal').waitFor();
      await page.goBack();
      await waitRoute(page, '#/');
      assert.equal(await page.evaluate(() => document.getElementById('confirm-dialog').open), false);
      assert.equal(await sidebarState(page, 'fa-d01'), 'done');
    },
    { progress: ['fa-d01'] },
  );
});

test('ctrl+k does nothing while the confirm modal is open', TIMEOUT, async () => {
  await withPage('#/settings', async (page) => {
    await page.getByTestId('reset-button').click();
    await page.getByTestId('confirm-modal').waitFor();
    await page.keyboard.press('Control+k');
    await sleep(100);
    assert.equal(await page.locator('#search-dialog[open]').count(), 0);
    assert.equal(await page.getByTestId('confirm-modal').isVisible(), true);
  });
});

test('reduced motion: the confirm modal opens and closes at once', TIMEOUT, async () => {
  await withPage(
    '#/settings',
    async (page) => {
      await page.getByTestId('reset-button').click();
      await page.getByTestId('confirm-modal').waitFor();
      const open = await page.evaluate(() => {
        document.querySelector('[data-testid="confirm-cancel"]').click();
        return document.getElementById('confirm-dialog').open;
      });
      assert.equal(open, false);
    },
    { reducedMotion: 'reduce' },
  );
});
