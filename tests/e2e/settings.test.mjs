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

// ───────── 진도 백업: 불러오기 · Shake · 왕복 ─────────

/** Element.animate 를 감싸 id 가 있는 애니메이션을 window.__anims 에 쌓는다 (300ms 짜리 Shake 를 놓치지 않는다) */
function recordAnimations() {
  window.__anims = [];
  const original = Element.prototype.animate;
  Element.prototype.animate = function (keyframes, options) {
    if (options && typeof options === 'object' && options.id) window.__anims.push({ id: options.id, cls: String(this.className) });
    return original.call(this, keyframes, options);
  };
}
const shakesOn = (page, cls) => page.evaluate((c) => window.__anims.filter((a) => a.id === 'shake' && a.cls.split(/\s+/).includes(c)).length, cls);

/** fa-d01 을 끝낸 백업 파일 내용 (completed 에 더할 Day 를 넣을 수 있다) */
function backupText(extra = []) {
  const completed = Object.fromEntries(['fa-d01', ...extra].map((id) => [id, '2026-11-13T00:00:00.000Z']));
  return JSON.stringify({ app: 'web-zero-to-hundred', schema: 1, exportedAt: '2026-11-13T00:00:00.000Z', progress: { version: 1, completed, checks: {}, lastDay: null, theme: 'system' } });
}
const jsonFile = (name, text) => ({ name, mimeType: 'application/json', buffer: Buffer.from(text) });

/** 홈에서 진도가 같은지 견줄 값들 */
async function homeSnapshot(page) {
  await page.getByTestId('level-panel').waitFor();
  return {
    days: await stat(page, 'days'),
    xp: await stat(page, 'xp'),
    next: await page.getByTestId('continue-button').getAttribute('href'),
    fb: await sidebarState(page, 'fb-d01'),
  };
}

test('a backup round-trips into a fresh browser with the same home', TIMEOUT, async () => {
  const a = await newContext({ progress: ['fa-d01', 'fa-d02'] });
  const b = await newContext();
  try {
    const { page: pa, errors: ea } = await openPage(a, '#/');
    const expected = await homeSnapshot(pa);
    await pa.locator('#settings-link').click();
    await waitRoute(pa, '#/settings');
    const [download] = await Promise.all([pa.waitForEvent('download'), pa.getByTestId('export-button').click()]);
    assert.match(download.suggestedFilename(), /^web-zero-to-hundred-progress-\d{4}-\d{2}-\d{2}\.json$/);
    const file = await download.path();

    const { page: pb, errors: eb } = await openPage(b, '#/settings');
    await pb.getByTestId('import-input').setInputFiles(file);
    await pb.getByTestId('confirm-modal').waitFor();
    assert.equal(await pb.locator('#confirm-title').innerText(), '지금 진도를 백업 파일의 진도로 바꿀까요?');
    const ok = pb.getByTestId('confirm-ok');
    assert.equal(await ok.innerText(), '백업으로 바꾸기');
    assert.match(await ok.getAttribute('class'), /\bbtn-primary\b/);
    await ok.click();
    await eventually(async () => assert.match(await pb.getByTestId('import-message').innerText(), /완료한 Day 2개/));
    await pb.locator('.brand').first().click();
    await waitRoute(pb, '#/');
    assert.deepEqual(await homeSnapshot(pb), expected, '다른 브라우저의 홈도 진도가 같다');
    await pb.reload();
    assert.deepEqual(await homeSnapshot(pb), expected, '불러온 진도는 저장된다');
    assert.deepEqual([...ea, ...eb], []);
  } finally {
    await a.close();
    await b.close();
  }
});

test('cancelling the import modal keeps progress and says so', TIMEOUT, async () => {
  await withPage(
    '#/settings',
    async (page) => {
      await page.getByTestId('import-input').setInputFiles(jsonFile('backup.json', backupText(['fa-d02'])));
      await page.getByTestId('confirm-modal').waitFor();
      await page.getByTestId('confirm-cancel').click();
      await eventually(async () => assert.equal(await page.getByTestId('import-message').innerText(), '가져오기를 취소했어요. 지금 진도는 그대로예요.'));
      assert.equal(await sidebarState(page, 'fa-d02'), 'today');
      await eventually(async () => assert.equal(await activeTestId(page), 'import-input', '진도 불러오기 칸으로 돌아온다'));
    },
    { progress: ['fa-d01'] },
  );
});

test('unknown days are skipped after confirming and counted', TIMEOUT, async () => {
  await withPage(
    '#/settings',
    async (page) => {
      await page.getByTestId('import-input').setInputFiles(jsonFile('backup.json', backupText(['fa-d02', 'zz-d99'])));
      await page.getByTestId('confirm-modal').waitFor();
      assert.match(await page.locator('#confirm-body').innerText(), /이 교재에 없는 Day 1개는 건너뛰어요\./);
      await page.getByTestId('confirm-ok').click();
      await eventually(async () => assert.match(await page.getByTestId('import-message').innerText(), /이 교재에 없는 Day 1개는 건너뛰었어요\./));
      assert.equal(await sidebarState(page, 'fa-d02'), 'done');
    },
    { progress: ['fa-d01'] },
  );
});

test('a broken or foreign file shakes the import button and explains without touching progress', TIMEOUT, async () => {
  await withPage(
    '#/settings',
    async (page) => {
      const message = page.getByTestId('import-message');
      const cases = [
        ['other.json', '{"app":"other"}', '이 교재의 백업 파일이 아니에요. 이 교재에서 내보낸 백업 파일을 골라 주세요.'],
        ['broken.json', 'not json', 'JSON 파일이 아니에요. 이 교재에서 내보낸 백업 파일(.json)을 골라 주세요.'],
      ];
      for (const [i, [name, text, reason]] of cases.entries()) {
        await page.getByTestId('import-input').setInputFiles(jsonFile(name, text));
        await eventually(async () => assert.equal(await message.innerText(), reason));
        assert.equal(await message.getAttribute('data-kind'), 'error');
        assert.equal(await message.getAttribute('role'), 'status');
        assert.equal(await shakesOn(page, 'file-btn'), i + 1, `${name}: 불러오기 버튼이 흔들린다`);
        assert.equal(await page.getByTestId('confirm-modal').isVisible(), false, '확인 Modal 은 열리지 않는다');
        assert.equal(await sidebarState(page, 'fa-d01'), 'done');
      }
    },
    { progress: ['fa-d01'], init: recordAnimations },
  );
});

test('an empty file shakes and explains without touching progress', TIMEOUT, async () => {
  await withPage(
    '#/settings',
    async (page) => {
      const message = page.getByTestId('import-message');
      await page.getByTestId('import-input').setInputFiles(jsonFile('empty.json', ''));
      await eventually(async () => assert.notEqual(await message.innerText(), ''));
      assert.equal(await message.getAttribute('data-kind'), 'error');
      assert.equal(await shakesOn(page, 'file-btn'), 1);
      assert.equal(await sidebarState(page, 'fa-d01'), 'done');
    },
    { progress: ['fa-d01'], init: recordAnimations },
  );
});

test('reduced motion: a failed import explains without shaking', TIMEOUT, async () => {
  await withPage(
    '#/settings',
    async (page) => {
      const message = page.getByTestId('import-message');
      await page.getByTestId('import-input').setInputFiles(jsonFile('other.json', '{"app":"other"}'));
      await eventually(async () => assert.match(await message.innerText(), /백업 파일이 아니에요/));
      assert.equal(await shakesOn(page, 'file-btn'), 0);
    },
    { reducedMotion: 'reduce', init: recordAnimations },
  );
});

test('import works in memory when storage is blocked', TIMEOUT, async () => {
  await withPage(
    '#/settings',
    async (page) => {
      assert.match(await page.locator('.settings .notice').innerText(), /저장할 수 없어요/);
      assert.equal(await page.locator('.settings .notice').getAttribute('role'), 'status');
      await page.getByTestId('import-input').setInputFiles(jsonFile('backup.json', backupText(['fa-d02'])));
      await page.getByTestId('confirm-ok').click();
      await eventually(async () => assert.equal(await sidebarState(page, 'fa-d02'), 'done'));
      assert.equal(await page.getByTestId('storage-banner').isVisible(), true);
    },
    {
      init: () => {
        Object.defineProperty(window, 'localStorage', {
          configurable: true,
          get() {
            throw new DOMException('access denied', 'SecurityError');
          },
        });
      },
    },
  );
});
