// 모션·토스트 e2e: 픽스처 교재를 빌드해 로컬 서버(127.0.0.1)로 연다.
// 값은 DESIGN.md Components > Motion·Buttons 와 같아야 한다. 실행: cd textbook && npm run test:e2e
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
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

before(async () => {
  tmp = await mkdtemp(path.join(tmpdir(), 'wzh-motion-'));
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
async function withPage(hash, fn, { reducedMotion = 'no-preference', hasTouch = false, viewport = { width: 1280, height: 800 }, clock = false } = {}) {
  const context = await browser.newContext({ viewport, reducedMotion, hasTouch, isMobile: hasTouch, locale: 'ko-KR' });
  try {
    if (clock) await context.clock.install();
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

const go = async (page, hash) => {
  await page.evaluate((h) => { location.hash = h; }, hash);
  await page.locator(`main[data-hash="${hash}"]`).waitFor();
};
const mx = (handle) => handle.evaluate((el) => el.style.getPropertyValue('--mx'));
const isZero = (v) => v === '' || v === '0px';

// ───────── Magnetic ─────────

test('primary button follows the mouse within 6px', TIMEOUT, async () => {
  await withPage('#/', async (page) => {
    const btn = page.getByTestId('continue-button');
    assert.equal((await btn.textContent()).trim(), '첫 Day 시작하기');
    const box = await btn.boundingBox();
    await page.mouse.move(box.x + box.width + 16, box.y + box.height / 2, { steps: 4 });
    await eventually(async () => {
      const v = parseFloat(await mx(btn));
      assert.ok(v > 0 && v <= 6, `--mx ${v}`);
      assert.equal(await btn.evaluate((el) => el.classList.contains('is-pulling')), true);
    });
    await page.mouse.move(5, 795, { steps: 4 });
    await eventually(async () => assert.equal(await mx(btn), '0px'));
  });
});

test('reduced motion: primary button stays put', TIMEOUT, async () => {
  await withPage(
    '#/',
    async (page) => {
      const btn = page.getByTestId('continue-button');
      const box = await btn.boundingBox();
      await page.mouse.move(box.x + box.width + 16, box.y + box.height / 2, { steps: 4 });
      await sleep(200);
      assert.ok(isZero(await mx(btn)));
      await btn.hover();
      await sleep(100);
      const s = await btn.evaluate((el) => [getComputedStyle(el).transform, getComputedStyle(el).translate]);
      assert.deepEqual(s, ['none', 'none']);
    },
    { reducedMotion: 'reduce' },
  );
});

test('touch context never pulls the primary button', TIMEOUT, async () => {
  await withPage(
    '#/',
    async (page) => {
      const btn = page.getByTestId('continue-button');
      const box = await btn.boundingBox();
      await page.mouse.move(box.x + box.width / 2 + 10, box.y + box.height / 2, { steps: 4 });
      await sleep(200);
      assert.ok(isZero(await mx(btn)), `--mx ${await mx(btn)}`);
    },
    { hasTouch: true, viewport: { width: 375, height: 812 } },
  );
});

test('leaving home detaches magnetic from the old button', TIMEOUT, async () => {
  await withPage('#/', async (page) => {
    const old = await page.getByTestId('continue-button').elementHandle();
    const box = await old.boundingBox();
    await go(page, '#/settings');
    // 떼어 낸 뒤에도 리스너가 남아 있으면 옛 버튼의 style.setProperty 가 불린다
    await old.evaluate((el) => {
      el.__writes = 0;
      const set = el.style.setProperty.bind(el.style);
      el.style.setProperty = (...args) => {
        el.__writes++;
        set(...args);
      };
    });
    await page.mouse.move(box.x + box.width + 10, box.y + box.height / 2, { steps: 4 });
    await sleep(200);
    assert.equal(await old.evaluate((el) => el.__writes), 0, '옛 버튼에 붙은 pointermove 가 떨어져야 한다');
    assert.ok(isZero(await mx(old)), `옛 버튼 --mx ${await mx(old)}`);
  });
});

// ───────── Stagger · Reveal ─────────

const runningIn = (page, selector) =>
  page.evaluate((s) => [...document.querySelectorAll(s)].reduce((n, el) => n + el.getAnimations().length, 0), selector);

test('home sections stagger once per session', TIMEOUT, async () => {
  await withPage('#/', async (page) => {
    assert.ok((await page.locator('[data-reveal]').count()) >= 3);
    assert.ok((await runningIn(page, '[data-reveal]')) > 0, '처음 열면 올라온다');
    await go(page, '#/settings');
    await go(page, '#/');
    assert.equal(await runningIn(page, '[data-reveal]'), 0, '두 번째는 움직이지 않는다');
  });
});

test('reduced motion: no stagger and no reveal', TIMEOUT, async () => {
  await withPage(
    '#/',
    async (page) => {
      assert.equal(await runningIn(page, '[data-reveal]'), 0);
      await go(page, '#/day/fa-d01');
      assert.equal(await page.locator('.reveal-pending').count(), 0);
    },
    { reducedMotion: 'reduce' },
  );
});

test('day headings reveal when scrolled into view', TIMEOUT, async () => {
  await withPage(
    '#/day/fa-d01',
    async (page) => {
      const last = page.locator('.lesson-body h2[id]').last();
      const box = await last.boundingBox();
      assert.ok(box.y > 400, `맨 아래 제목이 창 밖이어야 한다 (y=${box.y})`);
      assert.equal(await last.evaluate((el) => el.classList.contains('reveal-pending')), true);
      await last.evaluate((el) => el.scrollIntoView());
      await eventually(async () => assert.equal(await last.evaluate((el) => el.classList.contains('reveal-pending')), false));
    },
    { viewport: { width: 1280, height: 400 } },
  );
});

test('print shows headings that have not been revealed yet', TIMEOUT, async () => {
  await withPage(
    '#/day/fa-d01',
    async (page) => {
      const last = page.locator('.lesson-body h2[id]').last();
      assert.equal(await last.evaluate((el) => el.classList.contains('reveal-pending')), true);
      await page.emulateMedia({ media: 'print' });
      assert.equal(await last.evaluate((el) => getComputedStyle(el).opacity), '1');
    },
    { viewport: { width: 1280, height: 400 } },
  );
});

// ───────── 토스트 · 잠긴 프로젝트 카드 Shake ─────────
// 픽스처에서 fb 는 fa 를 끝내야 열리므로 잠겨 있다.

const LOCKED = '.path-item[data-project="fb"] .path-card';
// hover 전환(CSS transition)도 getAnimations 에 잡히므로 흔들림만 센다
const shakes = (locator) => locator.evaluate((el) => el.getAnimations().filter((a) => a.id === 'shake').length);
const toasts = (page) => page.getByTestId('toast');
/** 잠긴 카드는 aria-disabled 라 Playwright 의 locator.click 이 "enabled 아님"으로 기다린다. 사람처럼 좌표로 누른다 */
async function clickAt(page, locator) {
  await locator.evaluate((el) => el.scrollIntoView({ block: 'center' }));
  const box = await locator.boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
}

test('locked card shakes and explains instead of opening', TIMEOUT, async () => {
  await withPage('#/', async (page) => {
    const card = page.locator(LOCKED);
    assert.equal(await card.getAttribute('aria-disabled'), 'true');
    await clickAt(page, card);
    assert.equal(await page.evaluate(() => location.hash), '#/');
    assert.equal(await shakes(card), 1, '흔들린다');
    await toasts(page).first().waitFor();
    assert.equal(await toasts(page).count(), 1);
    assert.match(await toasts(page).first().textContent(), /끝내면 열려요/);
    assert.equal(await page.getByTestId('toast-region').getAttribute('role'), 'status');
  });
});

test('reduced motion: locked card does not shake but still explains', TIMEOUT, async () => {
  await withPage(
    '#/',
    async (page) => {
      const card = page.locator(LOCKED);
      await clickAt(page, card);
      assert.equal(await shakes(card), 0);
      await toasts(page).first().waitFor();
      assert.match(await toasts(page).first().textContent(), /끝내면 열려요/);
    },
    { reducedMotion: 'reduce' },
  );
});

test('locked card responds to Enter', TIMEOUT, async () => {
  await withPage('#/', async (page) => {
    await page.locator(LOCKED).focus();
    await page.keyboard.press('Enter');
    await toasts(page).first().waitFor();
    assert.equal(await page.evaluate(() => location.hash), '#/');
  });
});

test('locked card: rapid clicks keep at most three toasts', TIMEOUT, async () => {
  await withPage('#/', async (page) => {
    const card = page.locator(LOCKED);
    for (let i = 0; i < 5; i++) await clickAt(page, card);
    await toasts(page).first().waitFor();
    const n = await toasts(page).count();
    assert.ok(n >= 1 && n <= 3, `토스트 ${n}개`);
    assert.equal(await page.evaluate(() => location.hash), '#/');
  });
});

test('toast hides after four seconds and pauses on hover', TIMEOUT, async () => {
  await withPage(
    '#/',
    async (page) => {
      await clickAt(page, page.locator(LOCKED));
      const toast = toasts(page).first();
      await toast.waitFor();
      await page.clock.runFor(3000);
      assert.equal(await toasts(page).count(), 1, '3초에는 보인다');
      await toast.hover();
      await page.clock.runFor(5000);
      assert.equal(await toasts(page).count(), 1, '마우스를 올리면 멈춘다');
      await page.mouse.move(5, 5);
      await page.clock.runFor(4000);
      await eventually(async () => assert.equal(await toasts(page).count(), 0));
    },
    { clock: true },
  );
});

test('unlocked card still opens its project', TIMEOUT, async () => {
  await withPage('#/', async (page) => {
    await page.locator('.path-item[data-project="fa"] .path-card').click();
    await page.locator('main[data-hash="#/project/fa"]').waitFor();
  });
});

test('toast survives moving to another screen', TIMEOUT, async () => {
  await withPage('#/', async (page) => {
    await clickAt(page, page.locator(LOCKED));
    await toasts(page).first().waitFor();
    await go(page, '#/settings');
    assert.equal(await toasts(page).count(), 1);
    assert.equal(await page.locator('main [data-testid="toast-region"]').count(), 0, '영역은 main 밖에 있다');
  });
});

test('magnetic follows the Day complete button after the footer redraws, and skips it while disabled', TIMEOUT, async () => {
  await withPage('#/day/fa-d01', async (page) => {
    const near = async () => {
      const btn = page.getByTestId('complete-button');
      await btn.evaluate((el) => el.scrollIntoView({ block: 'center' }));
      const box = await btn.boundingBox();
      await page.mouse.move(5, 5);
      await page.mouse.move(box.x + box.width + 14, box.y + box.height / 2, { steps: 4 });
      await sleep(150);
      return { disabled: await btn.isDisabled(), mx: await mx(btn) };
    };
    // 체크박스를 눌러 푸터를 다시 그리게 한다 (버튼이 새로 만들어진다)
    const box = page.locator('.lesson-body input[type="checkbox"]').first();
    await box.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await box.check();
    const after = await near();
    if (after.disabled) assert.ok(isZero(after.mx), `비활성 버튼은 끌리지 않는다 (${after.mx})`);
    else assert.ok(parseFloat(after.mx) > 0, `다시 그린 버튼도 끌린다 (${after.mx})`);
  });
});

// ───────── M2: 잠긴 사이드바 행 ─────────

test('reduced motion: locked sidebar row does not shake but still explains', TIMEOUT, async () => {
  await withPage(
    '#/',
    async (page) => {
      await page.locator('#sidebar details.world[data-project="fb"] > summary').click();
      const row = page.locator('#sidebar [data-day="fb-d01"]');
      await row.click();
      await eventually(async () => assert.equal(await page.locator('.toast').count(), 1));
      assert.equal(await row.evaluate((el) => el.getAnimations().length), 0);
    },
    { reducedMotion: 'reduce' },
  );
});

test('locked sidebar row shakes', TIMEOUT, async () => {
  await withPage('#/', async (page) => {
    await page.locator('#sidebar details.world[data-project="fb"] > summary').click();
    const row = page.locator('#sidebar [data-day="fb-d01"]');
    await row.click();
    assert.equal(await row.evaluate((el) => el.getAnimations().some((a) => a.id === 'shake')), true);
  });
});

// ───────── 서랍 ─────────

test('drawer staggers world summaries', TIMEOUT, async () => {
  await withPage(
    '#/',
    async (page) => {
      await page.locator('#menu-toggle').click();
      const first = page.locator('#drawer .world > summary').first();
      assert.ok((await first.evaluate((el) => el.getAnimations().length)) > 0, '열 때마다 월드 요약이 차례로 올라온다');
    },
    { viewport: { width: 375, height: 740 } },
  );
});

test('reduced motion: drawer closes at once without stagger', TIMEOUT, async () => {
  await withPage(
    '#/',
    async (page) => {
      await page.locator('#menu-toggle').click();
      const first = page.locator('#drawer .world > summary').first();
      assert.equal(await first.evaluate((el) => el.getAnimations().length), 0);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#drawer').evaluate((d) => d.open), false, '애니메이션을 기다리지 않고 바로 닫힌다');
    },
    { viewport: { width: 375, height: 740 }, reducedMotion: 'reduce' },
  );
});
