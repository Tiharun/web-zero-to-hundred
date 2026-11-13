// 보상과 연결 e2e(M11): 업적 토스트, 레벨업·월드 클리어 Modal, 용어 서랍, 화면 전환.
// 모양·문구는 DESIGN.md "보상 Modal"·"업적 토스트"·"용어 서랍"·Motion "화면 전환"과 M11 계획서를 따른다. 실행: cd textbook && npm run test:e2e
// 픽스처는 Day 3개·225분이라 레벨이 오르지 않는다. 그래서 복사본 두 벌을 만든다(분 범위 60~120).
//   빌드 a: fa 120·120·120·60, fb 120 → fa-d03 완료 = 레벨업만, fa-d04 완료 = 월드 클리어만
//   빌드 b: fa 120·60·60·120          → fa-d04 완료 = 월드 클리어 + 레벨업
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { appendFile, copyFile, cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
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

/** 픽스처 복사본: fa 에 Day 두 개를 더하고 분을 바꾼다. 용어 정의 안에 다른 용어 링크를 하나 둔다 */
async function prepareContent(content, { fa, fb }) {
  const curPath = path.join(content, 'curriculum.json');
  const cur = JSON.parse(await readFile(curPath, 'utf8'));
  const [pa, pb] = cur.projects;
  for (const n of [3, 4]) {
    await copyFile(path.join(content, 'fa', 'day-02.md'), path.join(content, 'fa', `day-0${n}.md`));
    pa.days.push({ ...pa.days[1], title: `${n}번째 Day` });
  }
  pa.days.forEach((d, i) => (d.minutes = fa[i]));
  pb.days[0].minutes = fb;
  await writeFile(curPath, JSON.stringify(cur, null, 2));
  const glossary = path.join(content, 'glossary', 'fixture.md');
  const src = await readFile(glossary, 'utf8');
  await writeFile(glossary, src.replace('만든 항목이에요.', '만든 항목이에요. [[가나다 용어]]와 함께 봐요.'));
}

async function buildSite(name, minutes) {
  const content = path.join(tmp, `content-${name}`);
  await cp(FIXTURE, content, { recursive: true });
  await prepareContent(content, minutes);
  const r = await build({ contentDir: content, allowMissing: true });
  assert.equal(r.ok, true, JSON.stringify(r.errors));
  const dir = path.join(tmp, 'site', name);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'index.html'), r.html);
}

before(async () => {
  tmp = await mkdtemp(path.join(tmpdir(), 'wzh-reward-'));
  await buildSite('a', { fa: [120, 120, 120, 60], fb: 120 });
  await buildSite('b', { fa: [120, 60, 60, 120], fb: 120 });
  server = await startStaticServer(path.join(tmp, 'site'));
  browser = await launch();
});

after(async () => {
  await browser?.close();
  await server?.close();
  if (tmp) await rm(tmp, { recursive: true, force: true });
});

const seedValue = (completed) =>
  JSON.stringify({
    version: 1,
    completed: Object.fromEntries(completed.map((id) => [id, '2026-11-14T00:00:00.000Z'])),
    checks: {},
    lastDay: completed.at(-1) ?? null,
    theme: 'system',
  });

const BLOCK_STORAGE = () => {
  for (const name of ['localStorage', 'sessionStorage']) {
    Object.defineProperty(window, name, {
      configurable: true,
      get() {
        throw new DOMException('blocked', 'SecurityError');
      },
    });
  }
};

/** 새 컨텍스트로 빌드 site 의 hash 를 열어 fn(page, { context }) 에 넘기고, 끝에서 콘솔 오류 0 을 확인한다 */
async function withPage(site, hash, fn, { reducedMotion = 'no-preference', viewport = { width: 1280, height: 800 }, progress = null, init = null } = {}) {
  const context = await browser.newContext({ viewport, reducedMotion, locale: 'ko-KR' });
  try {
    if (progress) await context.addInitScript(([key, v]) => localStorage.setItem(key, v), [STORAGE_KEY, seedValue(progress)]);
    if (init) await context.addInitScript(init);
    const page = await context.newPage();
    const errors = collectConsoleErrors(page);
    await page.goto(`${server.url}${site}/index.html${hash}`);
    await page.locator('main h1').first().waitFor();
    await fn(page, { context });
    assert.deepEqual(errors, [], '콘솔 오류가 없어야 해요');
  } finally {
    await context.close();
  }
}

const reward = (page) => page.locator('#reward-dialog');
const rewardOpen = (page) => page.evaluate(() => document.getElementById('reward-dialog').open);
const activeTestid = (page) => page.evaluate(() => document.activeElement?.dataset.testid ?? document.activeElement?.id ?? null);
const goHash = async (page, hash) => {
  await page.evaluate((h) => (location.hash = h), hash);
  await page.waitForFunction((h) => document.getElementById('main').dataset.hash === h, hash);
};
const completeDay = (page) => page.getByTestId('complete-button').click();

// ───────── 업적 토스트·보상 Modal ─────────

test('day complete shows achievement toast', TIMEOUT, async () => {
  await withPage('a', '#/day/fa-d01', async (page) => {
    await completeDay(page);
    const toast = page.locator('.toast.has-icon');
    await toast.waitFor();
    assert.equal((await toast.innerText()).trim(), 'Day 1 완료! 보상 +120 XP');
    assert.equal(await toast.locator('svg').count(), 1, '트로피 도트');
    assert.equal(await rewardOpen(page), false);
  });
});

test('level up opens reward modal once, then the toast', TIMEOUT, async () => {
  await withPage(
    'a',
    '#/day/fa-d03',
    async (page) => {
      await completeDay(page);
      await page.locator('#reward-dialog[open]').waitFor();
      assert.equal((await reward(page).locator('#reward-title').innerText()).trim(), '레벨이 올랐어요');
      assert.equal((await reward(page).locator('.lv-value').innerText()).trim(), '2');
      assert.match(await reward(page).locator('.reward-next').innerText(), /다음 레벨까지 XP\s*240/);
      assert.equal(await activeTestid(page), 'reward-ok');
      assert.equal(await page.locator('.toast').count(), 0, 'Modal 이 닫힌 뒤에 토스트');
      await page.getByTestId('reward-ok').click();
      await page.waitForFunction(() => !document.getElementById('reward-dialog').open);
      assert.equal(await activeTestid(page), 'completion-status');
      await page.locator('.toast.has-icon').waitFor();

      // 같은 세션에서 완료 취소 → 다시 완료: Modal 은 다시 뜨지 않고 토스트만
      await page.getByTestId('uncomplete-button').click();
      await completeDay(page);
      await page.locator('.toast.has-icon').first().waitFor();
      await sleep(300);
      assert.equal(await rewardOpen(page), false, '레벨업 Modal 은 세션에 한 번');
    },
    { progress: ['fa-d01', 'fa-d02'] },
  );
});

test('world clear modal with confetti', TIMEOUT, async () => {
  await withPage(
    'a',
    '#/day/fa-d04',
    async (page) => {
      await completeDay(page);
      await page.locator('#reward-dialog[open]').waitFor();
      assert.equal((await reward(page).locator('#reward-title').innerText()).trim(), '‘픽스처 프로젝트 A’ 클리어!');
      assert.equal((await reward(page).locator('.reward-outcome').innerText()).trim(), '작은 웹 페이지 하나를 만들어요.');
      assert.equal(await reward(page).locator('.reward-level').count(), 0);
      assert.equal(await reward(page).locator('.badge svg').count(), 1, '엠블럼 배지');
      assert.equal(await reward(page).locator('.confetti').count(), 1, '축하 조각');
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => !document.getElementById('reward-dialog').open);
      await page.locator('.toast.has-icon').waitFor();
      assert.match(await page.locator('.toast.has-icon').innerText(), /새로 열린 곳이 있어요/);
    },
    { progress: ['fa-d01', 'fa-d02', 'fa-d03'] },
  );
});

test('world clear with level up is one modal', TIMEOUT, async () => {
  await withPage(
    'b',
    '#/day/fa-d04',
    async (page) => {
      await completeDay(page);
      await page.locator('#reward-dialog[open]').waitFor();
      assert.match(await reward(page).locator('#reward-title').innerText(), /클리어!/);
      assert.equal((await reward(page).locator('.reward-level').innerText()).trim(), 'LV 2 달성');
      await page.getByTestId('reward-ok').click();
      await page.locator('.toast.has-icon').waitFor();
      await sleep(300);
      assert.equal(await rewardOpen(page), false, 'Modal 은 하나만');
    },
    { progress: ['fa-d01', 'fa-d02', 'fa-d03'] },
  );
});

test('reward modal closes on navigation and blocks ctrl+k', TIMEOUT, async () => {
  await withPage(
    'a',
    '#/day/fa-d03',
    async (page) => {
      await completeDay(page);
      await page.locator('#reward-dialog[open]').waitFor();
      await page.keyboard.press('Control+k');
      await sleep(200);
      assert.equal(await page.evaluate(() => document.getElementById('search-dialog').open), false, 'Modal 위에 검색을 겹쳐 열지 않는다');
      assert.equal(await rewardOpen(page), true);
      await goHash(page, '#/');
      assert.equal(await rewardOpen(page), false, '화면이 바뀌면 바로 닫힌다');
      await page.locator('.toast.has-icon').waitFor();
    },
    { progress: ['fa-d01', 'fa-d02'] },
  );
});

test('reward works without storage', TIMEOUT, async () => {
  await withPage(
    'a',
    '#/day/fa-d01',
    async (page) => {
      await completeDay(page);
      await page.locator('.toast.has-icon').waitFor();
      for (const id of ['fa-d02', 'fa-d03']) {
        await goHash(page, `#/day/${id}`);
        await completeDay(page);
      }
      await page.locator('#reward-dialog[open]').waitFor();
      assert.equal((await reward(page).locator('.lv-value').innerText()).trim(), '2');
    },
    { init: BLOCK_STORAGE },
  );
});

test('reduced motion: modal opens and closes at once, no confetti', TIMEOUT, async () => {
  await withPage(
    'a',
    '#/day/fa-d04',
    async (page) => {
      await completeDay(page);
      await page.locator('#reward-dialog[open]').waitFor();
      assert.equal(await reward(page).locator('.confetti').count(), 0);
      await page.keyboard.press('Escape');
      assert.equal(await rewardOpen(page), false, '동작 줄이기면 바로 닫힌다');
    },
    { progress: ['fa-d01', 'fa-d02', 'fa-d03'], reducedMotion: 'reduce' },
  );
});

test('reward modal fits 320px without horizontal scroll', TIMEOUT, async () => {
  await withPage(
    'b',
    '#/day/fa-d04',
    async (page) => {
      await completeDay(page);
      await page.locator('#reward-dialog[open]').waitFor();
      const box = await reward(page).boundingBox();
      assert.ok(box.x >= 0 && box.x + box.width <= 320, `Modal 이 화면 안에 있어요 (${JSON.stringify(box)})`);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      await page.emulateMedia({ media: 'print' });
      assert.equal(await reward(page).isVisible(), false, '인쇄에는 열린 Modal 이 나오지 않는다');
    },
    { progress: ['fa-d01', 'fa-d02', 'fa-d03'], viewport: { width: 320, height: 640 } },
  );
});

// ───────── 용어 서랍 ─────────

const drawer = (page) => page.locator('#term-drawer');
const drawerOpen = (page) => page.evaluate(() => document.getElementById('term-drawer').open);
const hashNow = (page) => page.evaluate(() => decodeURIComponent(location.hash));
const openTerm = async (page) => {
  await page.locator('main a.term').first().click();
  await page.locator('#term-drawer[open]').waitFor();
  await drawer(page).evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished))); // 들어오는 애니메이션이 끝난 자리
};

test('term link opens right drawer', TIMEOUT, async () => {
  for (const viewport of [{ width: 1280, height: 800 }, { width: 375, height: 700 }]) {
    await withPage(
      'a',
      '#/day/fa-d01',
      async (page) => {
        await openTerm(page);
        assert.equal(await hashNow(page), '#/day/fa-d01', '주소는 그대로');
        assert.equal((await drawer(page).locator('#term-drawer-title').innerText()).trim(), '픽스처용어');
        assert.match(await drawer(page).locator('.term-drawer-body').innerText(), /교재 테스트에 쓰는 가짜 용어예요/);
        assert.equal(await drawer(page).locator('.term-drawer-body h3').count(), 0, '제목은 머리로 옮긴다');
        assert.equal(await drawer(page).locator('.term-drawer-body [id]').count(), 0, '복제본에 id 가 남지 않는다');
        assert.equal(await activeTestid(page), 'term-drawer-title');
        const box = await drawer(page).boundingBox();
        assert.ok(Math.abs(box.x + box.width - viewport.width) <= 1, `오른쪽에 붙는다 (${JSON.stringify(box)})`);
        assert.ok(box.width < viewport.width, '뒤가 조금 보인다');
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, '가로 스크롤 0');
      },
      { viewport },
    );
  }
});

test('term drawer closes and returns focus', TIMEOUT, async () => {
  await withPage('a', '#/day/fa-d01', async (page) => {
    await openTerm(page);
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.getElementById('term-drawer').open);
    assert.equal(await page.evaluate(() => document.activeElement?.matches('main a.term')), true, '누른 용어 링크로 돌아간다');

    await openTerm(page);
    await page.mouse.click(40, 400); // 서랍 왼쪽 바깥(백드롭)
    await page.waitForFunction(() => !document.getElementById('term-drawer').open);

    await openTerm(page);
    await page.getByRole('button', { name: '용어 설명 닫기' }).click();
    await page.waitForFunction(() => !document.getElementById('term-drawer').open);
    assert.equal(await page.evaluate(() => document.activeElement?.matches('main a.term')), true);
  });
});

test('term drawer more link goes to glossary', TIMEOUT, async () => {
  await withPage('a', '#/day/fa-d01', async (page) => {
    await openTerm(page);
    const more = page.getByTestId('term-drawer-more');
    assert.equal((await more.innerText()).trim(), '용어 사전에서 보기 →');
    await more.click();
    await page.waitForFunction(() => decodeURIComponent(document.getElementById('main').dataset.hash) === '#/page/glossary/term-픽스처용어');
    assert.equal(await drawerOpen(page), false);
    assert.equal(await page.locator('#term-픽스처용어').evaluate((el) => el.classList.contains('is-target')), true);
  });
});

test('term link inside drawer swaps entry', TIMEOUT, async () => {
  await withPage('a', '#/day/fa-d01', async (page) => {
    await openTerm(page);
    await drawer(page).locator('.term-drawer-body a.term').click();
    await page.waitForFunction(() => document.getElementById('term-drawer-title').textContent.trim() === '가나다 용어');
    assert.equal(await drawerOpen(page), true, '서랍은 열린 채');
    assert.equal(await hashNow(page), '#/day/fa-d01', '주소 그대로');
    assert.match(await drawer(page).locator('.term-drawer-body').innerText(), /정렬 순서를 확인하는 용어예요/);
    assert.match(decodeURIComponent(await page.getByTestId('term-drawer-more').getAttribute('href')), /term-가나다/);
    // 닫으면 처음 누른 본문 링크로 돌아간다
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.getElementById('term-drawer').open);
    assert.equal(await page.evaluate(() => document.activeElement?.matches('main a.term')), true);
  });
});

test('glossary page links and modified clicks still navigate', TIMEOUT, async () => {
  await withPage('a', '#/page/glossary', async (page) => {
    await page.locator('main a.term').first().click();
    await page.waitForFunction(() => decodeURIComponent(location.hash).startsWith('#/page/glossary/term-가나다'));
    assert.equal(await drawerOpen(page), false, '용어 사전 안에서는 서랍 없이 이동');
  });
  await withPage('a', '#/day/fa-d01', async (page, { context }) => {
    const popup = context.waitForEvent('page', { timeout: 5_000 }).catch(() => null);
    await page.locator('main a.term').first().click({ modifiers: ['Control'] });
    await popup;
    await sleep(200);
    assert.equal(await drawerOpen(page), false, 'Ctrl+클릭은 서랍을 열지 않는다');
  });
});

test('ctrl+k from term drawer opens search', TIMEOUT, async () => {
  await withPage('a', '#/day/fa-d01', async (page) => {
    await openTerm(page);
    await page.keyboard.press('Control+k');
    await page.locator('#search-dialog[open]').waitFor();
    assert.equal(await drawerOpen(page), false);
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.getElementById('search-dialog').open);
    await page.waitForFunction(() => document.activeElement?.id === 'main'); // 검색을 닫으면 본문으로
  });
});

test('term drawer hidden in print and closes on navigation', TIMEOUT, async () => {
  await withPage('a', '#/day/fa-d01', async (page) => {
    await openTerm(page);
    await page.emulateMedia({ media: 'print' });
    assert.equal(await drawer(page).isVisible(), false);
    await page.emulateMedia({ media: 'screen' });
    await goHash(page, '#/');
    assert.equal(await drawerOpen(page), false, '화면이 바뀌면 바로 닫힌다');
  });
});
