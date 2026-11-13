// 검색 e2e(M5): 검색 페이지(#/search)와 검색 Modal(Ctrl+K). 픽스처 교재를 빌드해 로컬 서버(127.0.0.1)로 연다.
// 모양·문구는 DESIGN.md Navigation "검색 Modal"과 M5 계획서 "범위 판정"을 따른다. 실행: cd textbook && npm run test:e2e
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
const SECRET = '비밀단어zz';
const SHORTCUTS = ['fa-d01', 'start', 'secret', 'glossary'];
const LOCK_A = '‘픽스처 프로젝트 A’ 프로젝트를 끝내면 열려요.';

let tmp;
let server;
let browser;

before(async () => {
  tmp = await mkdtemp(path.join(tmpdir(), 'wzh-search-'));
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

/** 새 컨텍스트(깨끗한 저장소)로 hash 를 열어 fn(page, context) 에 넘기고, 끝에서 콘솔 오류 0 을 확인한다 */
async function withPage(hash, fn, { reducedMotion = 'no-preference', viewport = { width: 1280, height: 800 }, progress = null } = {}) {
  const context = await browser.newContext({ viewport, reducedMotion, locale: 'ko-KR' });
  try {
    if (progress) {
      const value = JSON.stringify({
        version: 1,
        completed: Object.fromEntries(progress.map((id) => [id, '2026-11-13T00:00:00.000Z'])),
        checks: {},
        lastDay: progress.at(-1) ?? null,
        theme: 'system',
      });
      await context.addInitScript(([key, v]) => localStorage.setItem(key, v), [STORAGE_KEY, value]);
    }
    const page = await context.newPage();
    const errors = collectConsoleErrors(page);
    await page.goto(`${server.url}index.html${hash}`);
    await page.locator('main h1').first().waitFor();
    await fn(page, context);
    assert.deepEqual(errors, []);
  } finally {
    await context.close();
  }
}

const rows = (page) => page.getByTestId('search-result');
const rowIds = (page) => rows(page).evaluateAll((els) => els.map((el) => el.dataset.id));
const summary = (page) => page.getByTestId('search-summary');
const noHorizontalScroll = (page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

// ───────── 검색 페이지 ─────────

test('search page with no query lists the shortcuts', TIMEOUT, async () => {
  await withPage('#/search', async (page) => {
    await eventually(async () => assert.equal(await summary(page).innerText(), '바로 가기'));
    assert.deepEqual(await rowIds(page), SHORTCUTS);
    const today = rows(page).first();
    assert.equal(await today.locator('.result-why').innerText(), '오늘의 퀘스트');
    assert.equal(await today.locator('.result-tag').innerText(), '오늘');
    assert.equal(await today.locator('a.result').getAttribute('href'), '#/day/fa-d01');
    assert.equal(await page.locator('[data-testid="search-result"][data-id="secret"] .result-tag').innerText(), '잠김');
    assert.equal(await page.locator('.search-empty').isVisible(), false);
  });
});

test('search page shows the guidance sentence when nothing matches', TIMEOUT, async () => {
  await withPage(`#/search?q=${encodeURIComponent('zzqq없음')}`, async (page) => {
    const empty = page.locator('.search-empty');
    await eventually(async () => assert.equal(await empty.isVisible(), true));
    assert.equal(await empty.innerText(), '‘zzqq없음’에 맞는 내용이 없어요. 다른 낱말로 찾아보세요.');
    assert.equal(await rows(page).count(), 0);
    assert.equal(await summary(page).innerText(), '');
  });
});

test('search page: a locked day shows its title and lock reason, never its text', TIMEOUT, async () => {
  await withPage(`#/search?q=${encodeURIComponent(SECRET)}`, async (page) => {
    const locked = page.locator('[data-testid="search-result"][data-id="fb-d01"]');
    await locked.waitFor();
    assert.equal(await locked.getAttribute('data-locked'), 'true');
    assert.equal(await locked.locator('.result-tag').innerText(), '잠김');
    assert.equal(await locked.locator('.result-why').innerText(), LOCK_A);
    assert.match(await locked.innerText(), /비밀 Day/);
    assert.ok(!(await locked.innerText()).includes(SECRET));
    assert.ok(!(await page.locator('main').innerHTML()).includes('고유 단어는'), '본문 조각은 DOM 에도 없다');
  });
});

test("typing fast shows only the last query's results", TIMEOUT, async () => {
  await withPage('#/search', async (page) => {
    const input = page.getByTestId('search-input');
    await input.pressSequentially('첫 번째', { delay: 0 });
    await page.waitForFunction(() => location.hash === `#/search?q=${encodeURIComponent('첫 번째')}`);
    await eventually(async () => assert.equal((await rowIds(page))[0], 'fa-d01'));
    const n = await rows(page).count();
    assert.equal(await summary(page).innerText(), `찾은 곳 ${n}개`);
    // '첫'·'번째'가 다 들어간 항목만: 첫 번째 Day(제목), 두 번째 Day·시작하기(본문). 앞 글자 '첫'만의 결과가 남지 않는다
    assert.deepEqual((await rowIds(page)).sort(), ['fa-d01', 'fa-d02', 'start']);
    assert.equal(n, 3);
  });
});

test('typed HTML stays text in the results', TIMEOUT, async () => {
  await withPage('#/search', async (page) => {
    const input = page.getByTestId('search-input');
    for (const q of ['<img src=x onerror=alert(1)>', '(.*']) {
      await input.fill(q);
      const empty = page.locator('.search-empty');
      await eventually(async () => assert.equal(await empty.innerText(), `‘${q}’에 맞는 내용이 없어요. 다른 낱말로 찾아보세요.`));
      assert.equal(await page.locator('main img').count(), 0);
    }
  });
});

test('search page fits 320px with no horizontal scroll', TIMEOUT, async () => {
  await withPage(
    `#/search?q=${encodeURIComponent('Day')}`,
    async (page) => {
      await rows(page).first().waitFor();
      assert.equal(await noHorizontalScroll(page), 0);
      const card = await page.locator('.search-card').boundingBox();
      for (const box of await rows(page).evaluateAll((els) => els.map((el) => el.getBoundingClientRect().toJSON()))) {
        assert.ok(box.right <= card.x + card.width + 0.5, JSON.stringify(box));
      }
    },
    { viewport: { width: 320, height: 700 } },
  );
});
