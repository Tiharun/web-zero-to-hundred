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
    assert.equal(await page.locator('main .search-empty').isVisible(), false);
  });
});

test('search page shows the guidance sentence when nothing matches', TIMEOUT, async () => {
  await withPage(`#/search?q=${encodeURIComponent('zzqq없음')}`, async (page) => {
    const empty = page.locator('main .search-empty');
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
      const empty = page.locator('main .search-empty');
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

// ───────── 검색 Modal (Ctrl+K) ─────────

const modal = (page) => page.getByTestId('search-modal');
const modalInput = (page) => page.getByTestId('search-modal-input');
const opts = (page) => modal(page).locator('[role="option"]');
const optIds = (page) => opts(page).evaluateAll((els) => els.map((el) => el.dataset.id));
const isOpen = (page) => page.locator('#search-dialog').evaluate((d) => d.open);
const activeTestId = (page) => page.evaluate(() => document.activeElement?.dataset.testid ?? null);
const activeId = (page) => page.evaluate(() => document.activeElement?.id ?? null);
const hrefOf = (id) => (/-d\d+$/.test(id) ? `#/day/${id}` : `#/page/${id}`);

async function openModal(page) {
  await page.keyboard.press('Control+k');
  await page.locator('#search-dialog[open]').waitFor();
}

/** Modal 입력칸에 검색어를 넣고 결과(또는 결과 없음 문장)가 그려질 때까지 기다린다 */
async function typeQuery(page, q) {
  await modalInput(page).fill(q);
  await eventually(async () => {
    const hint = await page.locator('#search-hint').innerText();
    const none = await modal(page).locator('.search-empty').isVisible();
    assert.ok(hint.startsWith('찾은 곳') || none, hint);
  });
}

test('Ctrl+K opens the search modal with shortcuts and focus in the input', TIMEOUT, async () => {
  await withPage('#/settings', async (page) => {
    await openModal(page);
    assert.equal(await activeTestId(page), 'search-modal-input');
    assert.equal(await page.evaluate(() => location.hash), '#/settings', '주소는 그대로');
    assert.equal(await page.locator('#search-hint').innerText(), '바로 가기');
    assert.deepEqual(await optIds(page), SHORTCUTS);
    const input = modalInput(page);
    assert.equal(await input.getAttribute('aria-expanded'), 'true');
    const firstId = await opts(page).first().getAttribute('id');
    assert.equal(await input.getAttribute('aria-activedescendant'), firstId);
    assert.equal(await opts(page).first().getAttribute('aria-selected'), 'true');
    assert.equal(await page.locator('#search-open').getAttribute('aria-keyshortcuts'), 'Control+K');
    assert.equal(await page.locator('#search-open kbd').textContent(), 'Ctrl K');
  });
});

test('arrow keys move the active option and Enter opens it', TIMEOUT, async () => {
  await withPage('#/', async (page) => {
    await openModal(page);
    await typeQuery(page, 'Day');
    const ids = await optIds(page);
    assert.ok(ids.length >= 3, ids.join(','));
    const input = modalInput(page);
    await page.keyboard.press('ArrowDown');
    assert.equal(await opts(page).nth(1).getAttribute('aria-selected'), 'true');
    assert.equal(await opts(page).first().getAttribute('aria-selected'), 'false');
    assert.equal(await input.getAttribute('aria-activedescendant'), await opts(page).nth(1).getAttribute('id'));
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowUp');
    assert.equal(await opts(page).last().getAttribute('aria-selected'), 'true', '처음에서 ↑ 는 마지막으로');
    await page.keyboard.press('Enter');
    await page.locator(`main[data-hash="${hrefOf(ids.at(-1))}"]`).waitFor();
    assert.equal(await isOpen(page), false);
    assert.equal(await activeId(page), 'main');
    await eventually(async () => assert.match(await page.locator('#live').textContent(), /화면을 열었어요\.$/));
  });
});

test('locked results in the modal show only the title and why', TIMEOUT, async () => {
  await withPage('#/', async (page) => {
    await openModal(page);
    await typeQuery(page, SECRET);
    assert.deepEqual(await optIds(page), ['fb-d01']);
    const row = opts(page).first();
    assert.equal(await row.getAttribute('data-locked'), 'true');
    assert.equal(await row.locator('.result-tag').innerText(), '잠김');
    assert.equal(await row.locator('.result-why').innerText(), LOCK_A);
    assert.ok(!(await row.innerText()).includes(SECRET));
    assert.ok(!(await modal(page).locator('.results').innerHTML()).includes('고유 단어는'));
  });
});

test('no results: guidance sentence, collapsed combobox, Enter stays put', TIMEOUT, async () => {
  await withPage('#/', async (page) => {
    await openModal(page);
    await typeQuery(page, 'zzqq없음');
    assert.equal(await modal(page).locator('.search-empty').innerText(), '‘zzqq없음’에 맞는 내용이 없어요. 다른 낱말로 찾아보세요.');
    assert.equal(await opts(page).count(), 0);
    const input = modalInput(page);
    assert.equal(await input.getAttribute('aria-expanded'), 'false');
    assert.equal(await input.getAttribute('aria-activedescendant'), null);
    await page.keyboard.press('Enter');
    assert.equal(await isOpen(page), true);
    assert.equal(await page.evaluate(() => location.hash), '#/');
  });
});

test('Esc closes at once even with text, and focus returns to the search button', TIMEOUT, async () => {
  await withPage('#/', async (page) => {
    await page.locator('#search-open').click();
    await page.locator('#search-dialog[open]').waitFor();
    await modalInput(page).pressSequentially('abc');
    await page.keyboard.press('Escape');
    await eventually(async () => assert.equal(await isOpen(page), false));
    assert.equal(await activeId(page), 'search-open');
    assert.equal(await page.evaluate(() => location.hash), '#/');
  });
});

test('a plain click on the search button opens the modal, a modified click keeps the link', TIMEOUT, async () => {
  await withPage('#/', async (page) => {
    const prevented = await page.evaluate(() => {
      let seen = null;
      // 앱의 처리(버튼에 붙어 있다)가 끝난 뒤 문서에서 결과를 보고, 실제 이동은 막는다
      document.addEventListener('click', (event) => { seen = event.defaultPrevented; event.preventDefault(); }, { once: true });
      document.getElementById('search-open').dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true }));
      return seen;
    });
    assert.equal(prevented, false, '수정 키 클릭은 링크 그대로(새 탭 등)');
    assert.equal(await isOpen(page), false);
    await page.locator('#search-open').click();
    await page.locator('#search-dialog[open]').waitFor();
    assert.equal(await page.evaluate(() => location.hash), '#/');
    assert.equal(await activeTestId(page), 'search-modal-input');
  });
});

test('Ctrl+K from the open drawer closes it and opens the modal', TIMEOUT, async () => {
  await withPage(
    '#/',
    async (page) => {
      await page.locator('#menu-toggle').click();
      await page.locator('#drawer[open]').waitFor();
      await openModal(page);
      assert.equal(await page.locator('#drawer').evaluate((d) => d.open), false);
      assert.equal(await activeTestId(page), 'search-modal-input');
      await page.keyboard.press('Escape');
      await eventually(async () => assert.equal(await isOpen(page), false));
      assert.equal(await activeId(page), 'menu-toggle');
    },
    { viewport: { width: 375, height: 740 } },
  );
});

test('Ctrl+K while the modal is open keeps one modal', TIMEOUT, async () => {
  await withPage('#/', async (page) => {
    await openModal(page);
    await modalInput(page).fill('Day');
    await page.locator('#search-close').focus();
    await page.keyboard.press('Control+k');
    assert.equal(await page.locator('dialog[open]').count(), 1);
    assert.equal(await activeTestId(page), 'search-modal-input');
    assert.equal(await modalInput(page).inputValue(), 'Day', '다시 눌러도 쓰던 글자는 남는다');
  });
});

test('Ctrl+K on the search page focuses the page input instead', TIMEOUT, async () => {
  await withPage('#/search', async (page) => {
    await page.locator('#main').focus();
    await page.keyboard.press('Control+k');
    assert.equal(await activeTestId(page), 'search-input');
    assert.equal(await isOpen(page), false);
  });
});

test('choosing the current screen closes the modal and focuses the main', TIMEOUT, async () => {
  await withPage('#/day/fa-d01', async (page) => {
    await openModal(page);
    assert.equal((await optIds(page))[0], 'fa-d01');
    await page.keyboard.press('Enter');
    await eventually(async () => assert.equal(await activeId(page), 'main'));
    assert.equal(await isOpen(page), false);
    assert.equal(await page.evaluate(() => location.hash), '#/day/fa-d01');
  });
});

test('going back closes the modal', TIMEOUT, async () => {
  await withPage('#/', async (page) => {
    await page.evaluate(() => { location.hash = '#/settings'; });
    await page.locator('main[data-hash="#/settings"]').waitFor();
    await openModal(page);
    await page.evaluate(() => history.back());
    await page.locator('main[data-hash="#/"]').waitFor();
    assert.equal(await isOpen(page), false);
  });
});

test('reduced motion closes the modal at once', TIMEOUT, async () => {
  await withPage(
    '#/',
    async (page) => {
      await openModal(page);
      await page.keyboard.press('Escape');
      assert.equal(await isOpen(page), false, '기다리지 않고 바로 닫힌다');
    },
    { reducedMotion: 'reduce' },
  );
});

test('the modal fits 320px with no horizontal scroll', TIMEOUT, async () => {
  await withPage(
    '#/',
    async (page) => {
      await openModal(page);
      await typeQuery(page, 'Day');
      // 여는 애니메이션(pop-in: 0.98 배에서 시작)이 끝난 크기를 잰다
      await page.locator('#search-dialog').evaluate((d) => Promise.all(d.getAnimations().map((a) => a.finished)));
      const box = await modal(page).boundingBox();
      assert.ok(Math.abs(box.width - (320 - 32)) <= 1, `폭 ${box.width}`);
      assert.ok(box.x >= 0 && box.x + box.width <= 320);
      assert.equal(await noHorizontalScroll(page), 0);
      for (const r of await opts(page).evaluateAll((els) => els.map((el) => el.getBoundingClientRect().toJSON()))) {
        assert.ok(r.right <= box.x + box.width + 0.5, JSON.stringify(r));
      }
    },
    { viewport: { width: 320, height: 640 } },
  );
});
