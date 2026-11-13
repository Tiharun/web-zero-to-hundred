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

/**
 * 새 컨텍스트(깨끗한 저장소)로 hash 를 열어 fn(page, context) 에 넘기고, 끝에서 콘솔 오류 0 을 확인한다.
 * progress: 미리 끝낸 Day id 목록(마지막이 lastDay), init: 페이지 스크립트보다 먼저 돌릴 함수
 */
async function withPage(
  hash,
  fn,
  { reducedMotion = 'no-preference', hasTouch = false, viewport = { width: 1280, height: 800 }, clock = false, progress = null, init = null } = {},
) {
  const context = await browser.newContext({ viewport, reducedMotion, hasTouch, isMobile: hasTouch, locale: 'ko-KR' });
  try {
    if (clock) await context.clock.install();
    if (progress) {
      const value = JSON.stringify({
        version: 1,
        completed: Object.fromEntries(progress.map((id) => [id, '2026-11-12T00:00:00.000Z'])),
        checks: {},
        lastDay: progress.at(-1) ?? null,
        theme: 'system',
      });
      await context.addInitScript(([key, v]) => localStorage.setItem(key, v), [STORAGE_KEY, value]);
    }
    if (init) await context.addInitScript(init);
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

const LOCKED = '.world-card[data-world="fb"] .card-hit';
const LOCKED_CARD = '.world-card[data-world="fb"]';
// hover 전환(CSS transition)도 getAnimations 에 잡히므로 흔들림만 센다
const shakes = (locator) => locator.evaluate((el) => el.getAnimations().filter((a) => a.id === 'shake').length);
const toasts = (page) => page.getByTestId('toast');
/** 사람처럼 카드 가운데 좌표를 누른다 */
async function clickAt(page, locator) {
  await locator.evaluate((el) => el.scrollIntoView({ block: 'center' }));
  const box = await locator.boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
}

test('locked card shakes and explains instead of opening', TIMEOUT, async () => {
  await withPage('#/', async (page) => {
    const hit = page.locator(LOCKED);
    const card = page.locator(LOCKED_CARD);
    assert.equal(await hit.evaluate((el) => el.tagName), 'BUTTON');
    await clickAt(page, hit);
    assert.equal(await page.evaluate(() => location.hash), '#/');
    assert.equal(await shakes(card), 1, '흔들린다');
    assert.match(await card.locator('.wc-foot').getAttribute('class'), /is-told/, '발판 문장을 강조한다');
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
      await clickAt(page, page.locator(LOCKED));
      assert.equal(await shakes(page.locator(LOCKED_CARD)), 0);
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

// ───────── 퀘스트 카드 Tilt (M3) ─────────

test('quest card tilts under the mouse and settles on leave', TIMEOUT, async () => {
  await withPage('#/', async (page) => {
    const card = page.locator('.quest');
    const box = await card.boundingBox();
    await page.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.1);
    await page.mouse.move(box.x + box.width * 0.95, box.y + box.height * 0.05);
    assert.match(await card.evaluate((el) => el.style.transform), /^perspective\(1000px\) rotateX\(.+deg\) rotateY\(.+deg\)$/);
    await page.mouse.move(0, box.y + box.height + 200);
    assert.equal(await card.evaluate((el) => el.style.transform), '');
  });
});

test('reduced motion: quest card does not tilt', TIMEOUT, async () => {
  await withPage('#/', async (page) => {
    const card = page.locator('.quest');
    const box = await card.boundingBox();
    await page.mouse.move(box.x + box.width * 0.9, box.y + 10);
    await page.mouse.move(box.x + box.width * 0.95, box.y + 5);
    assert.equal(await card.evaluate((el) => el.style.transform), '');
  }, { reducedMotion: 'reduce' });
});

// ───────── 월드 카드 Tilt·Reveal (M4) ─────────

const angles = (t) => (t.match(/-?[\d.]+(?=deg)/g) ?? []).map(Number);

test('world card tilts up to 4° under a mouse and not when reduced', TIMEOUT, async () => {
  for (const reducedMotion of ['no-preference', 'reduce']) {
    await withPage('#/', async (page) => {
      const card = page.locator(LOCKED_CARD);
      await card.evaluate((el) => el.scrollIntoView({ block: 'center' }));
      await page.waitForTimeout(400);
      const box = await card.boundingBox();
      await page.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.1);
      await page.mouse.move(box.x + box.width * 0.95, box.y + box.height * 0.15);
      const t = await card.evaluate((el) => el.style.transform);
      if (reducedMotion === 'reduce') assert.equal(t, '');
      else {
        assert.match(t, /^perspective\(1000px\) rotateX\(.+deg\) rotateY\(.+deg\)$/);
        const [rx, ry] = angles(t);
        assert.ok(Math.abs(rx) <= 4 && Math.abs(ry) <= 4 && Math.abs(ry) > 3, `각도 ${rx}, ${ry}`);
      }
    }, { reducedMotion });
  }
});

test('world cards rise into view once', TIMEOUT, async () => {
  await withPage('#/', async (page) => {
    const card = page.locator(LOCKED_CARD);
    assert.ok((await card.boundingBox()).y > 800, '처음에는 화면 밖');
    assert.match(await card.getAttribute('class'), /reveal-pending/);
    await card.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await eventually(async () => assert.doesNotMatch(await card.getAttribute('class'), /reveal-pending/));
  });
});

// ───────── XP 막대 채움 (M3) ─────────

test('xp bar fills from the left on the first visit', TIMEOUT, async () => {
  await withPage('#/day/fa-d01', async (page) => {
    await page.getByTestId('complete-button').click();
    await go(page, '#/');
    const fill = page.locator('.xp-fill');
    assert.equal(await fill.evaluate((el) => el.getAnimations().length), 1);
  });
});

test('reduced motion: xp bar is drawn at its final width', TIMEOUT, async () => {
  await withPage('#/day/fa-d01', async (page) => {
    await page.getByTestId('complete-button').click();
    await go(page, '#/');
    const fill = page.locator('.xp-fill');
    assert.equal(await fill.evaluate((el) => el.getAnimations().length), 0);
    assert.match(await fill.evaluate((el) => getComputedStyle(el).clipPath), /inset\(0px 80%/);
  }, { reducedMotion: 'reduce' });
});

// ───────── 홈 모션 (M4): 퀘스트 연결, 말 점프, 경로 그리기, 축하 ─────────

const CLEARED = ['fa-d01', 'fa-d02'];
const todayNode = (page) => page.locator('[data-testid="world-map"] .node.is-today');
const translateY = (locator) =>
  locator.evaluate((el) => {
    const t = getComputedStyle(el).transform;
    return t === 'none' ? 0 : new DOMMatrixReadOnly(t).m42;
  });
const hopLoop = (locator) =>
  locator.evaluate((el) => el.getAnimations().filter((a) => a.animationName === 'hop').map((a) => a.effect.getTiming().iterations));
const motionCount = (page, selector) =>
  page.evaluate((sel) => [...document.querySelectorAll(sel)].reduce((n, el) => n + el.getAnimations().filter((a) => !a.animationName && !a.transitionProperty).length, 0), selector);

test('quest card lifts today 4px and keeps the pawn hopping while hovered or focused', TIMEOUT, async () => {
  await withPage('#/', async (page) => {
    const node = todayNode(page);
    const box = await page.locator('.quest').boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await eventually(async () => assert.match(await node.getAttribute('class'), /is-linked/));
    await eventually(async () => assert.equal(await translateY(node.locator('a')), -4));
    assert.deepEqual(await hopLoop(node.locator('.pawn')), [Infinity]);
    await page.mouse.move(box.x + box.width / 2, box.y + box.height + 600);
    await eventually(async () => assert.doesNotMatch(await node.getAttribute('class'), /is-linked/));
    await page.getByTestId('continue-button').focus();
    await eventually(async () => assert.match(await node.getAttribute('class'), /is-linked/));
  });
});

test('reduced motion: the linked tile does not lift', TIMEOUT, async () => {
  await withPage(
    '#/',
    async (page) => {
      const node = todayNode(page);
      await page.getByTestId('continue-button').focus();
      await eventually(async () => assert.match(await node.getAttribute('class'), /is-linked/));
      assert.equal(await node.locator('a').evaluate((el) => getComputedStyle(el).transform), 'none');
      assert.deepEqual(await hopLoop(node.locator('.pawn')), []);
    },
    { reducedMotion: 'reduce' },
  );
});

test('home motion plays once per session', TIMEOUT, async () => {
  await withPage('#/', async (page) => {
    assert.equal(await motionCount(page, '.pawn'), 1, '첫 방문에 말이 뛴다');
    await go(page, '#/settings');
    await go(page, '#/');
    assert.equal(await motionCount(page, '.pawn'), 0, '같은 세션에서는 다시 뛰지 않는다');
  });
  await withPage(
    '#/',
    async (page) => {
      assert.equal(await page.locator('.quest .confetti i').count(), 18, '월드 클리어 축하 조각');
      // 경로는 지도가 보이자마자 1.1초 안에 그리고 끝나므로 축하 조각이 사라지기 전에 본다
      await page.locator('[data-testid="world-map"] .trail').evaluate((el) => el.scrollIntoView({ block: 'center' }));
      await eventually(async () => assert.ok((await motionCount(page, '[data-draw]')) >= 1, '완료 경로를 그린다'));
      await eventually(async () => assert.equal(await page.locator('.confetti').count(), 0), 4000);
      await go(page, '#/settings');
      await go(page, '#/');
      await page.locator('[data-testid="world-map"] .trail').evaluate((el) => el.scrollIntoView({ block: 'center' }));
      await sleep(400);
      assert.equal(await motionCount(page, '[data-draw]'), 0);
      assert.equal(await page.locator('.confetti').count(), 0);
    },
    { progress: CLEARED },
  );
});

test('reduced motion: no trail drawing, pawn hop or confetti', TIMEOUT, async () => {
  await withPage('#/', async (page) => assert.equal(await motionCount(page, '.pawn'), 0), { reducedMotion: 'reduce' });
  await withPage(
    '#/',
    async (page) => {
      await page.locator('[data-testid="world-map"] .trail').evaluate((el) => el.scrollIntoView({ block: 'center' }));
      await sleep(400);
      assert.equal(await motionCount(page, '[data-draw]'), 0);
      assert.equal(await page.locator('.confetti').count(), 0);
    },
    { reducedMotion: 'reduce', progress: CLEARED },
  );
});

test('touch: tiles have no tooltip', TIMEOUT, async () => {
  await withPage(
    '#/',
    async (page) => {
      const tips = await page.locator('[data-testid="world-map"] .tip').evaluateAll((els) => els.map((el) => getComputedStyle(el).display));
      assert.ok(tips.length > 0);
      assert.ok(tips.every((d) => d === 'none'), tips.join());
    },
    { hasTouch: true, viewport: { width: 375, height: 800 } },
  );
});

test('blocked session storage still renders the home', TIMEOUT, async () => {
  await withPage(
    '#/',
    async (page) => {
      for (const id of ['world-map', 'other-worlds', 'help-row']) assert.equal(await page.getByTestId(id).isVisible(), true, id);
      assert.equal(await motionCount(page, '.pawn'), 1);
      await go(page, '#/settings');
      await go(page, '#/');
      assert.equal(await motionCount(page, '.pawn'), 0, '저장소가 막혀도 이 페이지 안에서는 한 번만');
    },
    {
      init: () =>
        Object.defineProperty(window, 'sessionStorage', {
          configurable: true,
          get() {
            throw new DOMException('blocked', 'SecurityError');
          },
        }),
    },
  );
});

test('phone: the done trail stays hidden below the fold and draws when scrolled to, even after leaving first', TIMEOUT, async () => {
  await withPage(
    '#/',
    async (page) => {
      const trail = page.locator('[data-testid="world-map"] .trail');
      assert.ok((await trail.evaluate((el) => el.getBoundingClientRect().top)) > 812, '전제: 지도가 첫 화면 아래');
      const hidden = () => page.locator('[data-draw]').evaluateAll((els) => els.map((el) => el.style.strokeDasharray));
      assert.ok((await hidden()).every((v) => /^1,? 1$/.test(v)), '보이기 전에는 숨겨 둔다');
      await go(page, '#/settings');
      await go(page, '#/');
      await trail.evaluate((el) => el.scrollIntoView({ block: 'center' }));
      await eventually(async () => assert.ok((await motionCount(page, '[data-draw]')) >= 1, '보지 않고 떠났으면 다음에 그린다'));
    },
    { viewport: { width: 375, height: 812 }, hasTouch: true, progress: CLEARED },
  );
});

test('narrow map: no tooltip even with a mouse, wide map keeps it', TIMEOUT, async () => {
  const shown = (page) =>
    page.locator('[data-testid="world-map"] .tip').evaluateAll((els) => els.map((el) => getComputedStyle(el).display));
  await withPage('#/', async (page) => {
    const tips = await shown(page);
    assert.ok(tips.length > 0);
    assert.ok(tips.every((d) => d === 'none'), `지도 폭 30rem 미만에서는 잘리므로 숨긴다: ${tips.join()}`);
  }, { viewport: { width: 375, height: 800 } });
  await withPage('#/', async (page) => {
    assert.ok((await shown(page)).every((d) => d === 'block'));
  });
});

// ───────── 토스트 확정 모양 (DESIGN.md Day 부품 "토스트") ─────────
test('toast uses the final shape', TIMEOUT, async () => {
  await withPage('#/', async (page) => {
    await clickAt(page, page.locator(LOCKED));
    const toast = toasts(page).first();
    await toast.waitFor();
    const r = await toast.evaluate((el) => {
      const probe = document.createElement('span');
      probe.style.cssText = 'transition:none;color:var(--color-edge)';
      document.body.append(probe);
      const edge = getComputedStyle(probe).color;
      probe.remove();
      const root = getComputedStyle(document.documentElement);
      const s = getComputedStyle(el);
      return { width: s.borderTopWidth, color: s.borderTopColor, shadow: s.boxShadow, radius: s.borderTopLeftRadius, edge, ledge: root.getPropertyValue('--ledge').trim(), card: root.getPropertyValue('--radius-card').trim() };
    });
    assert.equal(r.width, '2px');
    assert.equal(r.color, r.edge, '테두리는 edge');
    assert.ok(r.shadow.includes(r.edge) && r.shadow.includes(`0px ${r.ledge}`), `턱은 edge ${r.ledge}: ${r.shadow}`);
    assert.equal(r.radius, r.card);
  });
});

test('reduced motion shows the toast without movement', TIMEOUT, async () => {
  await withPage(
    '#/',
    async (page) => {
      await clickAt(page, page.locator(LOCKED));
      const toast = toasts(page).first();
      await toast.waitFor();
      const durations = await toast.evaluate((el) => el.getAnimations().map((a) => Number(a.effect.getComputedTiming().duration)));
      assert.ok(durations.every((d) => d <= 0.01), `등장 애니메이션 ${durations.join(',')}ms`);
    },
    { reducedMotion: 'reduce' },
  );
});
