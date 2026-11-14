// 그림 e2e (DESIGN.md "그림 틀"): 실제 교재를 빌드해 로컬 서버(127.0.0.1)로 연다.
// 실행: cd textbook && npm run test:e2e
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { build } from '../../textbook/build.mjs';
import { STORAGE_KEY } from '../../textbook/src/app/progress.js';
import { STEPS as REQUEST_STEPS } from '../../textbook/src/figures/request-response.js';
import { STEPS as GIT_STEPS } from '../../textbook/src/figures/git-flow.js';
import { launch, collectConsoleErrors } from '../helpers/browser.mjs';
import { startStaticServer } from '../helpers/static-server.mjs';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const TIMEOUT = { timeout: 90_000 };
const DONE = '2026-01-01T00:00:00.000Z';
/** P1 Day 1~6 을 마친 진도: Day 7 까지 열린다 */
const PROGRESS = {
  version: 1,
  completed: Object.fromEntries(['p1-d01', 'p1-d02', 'p1-d03', 'p1-d04', 'p1-d05', 'p1-d06'].map((id) => [id, DONE])),
  checks: {},
  lastDay: 'p1-d06',
  theme: 'light',
};

let tmp;
let server;
let browser;

before(async () => {
  tmp = await mkdtemp(path.join(tmpdir(), 'wzh-figures-'));
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

/** Day(또는 부록)를 열고 그림 틀이 붙기를 기다린다 */
async function openFigure(hash, id, { reduce = false, width = 1280 } = {}) {
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    reducedMotion: reduce ? 'reduce' : 'no-preference',
    locale: 'ko-KR',
  });
  await context.addInitScript(({ key, value }) => localStorage.setItem(key, value), { key: STORAGE_KEY, value: JSON.stringify(PROGRESS) });
  const page = await context.newPage();
  const errors = collectConsoleErrors(page);
  await page.goto(`${server.url}index.html${hash}`);
  const fig = page.locator(`figure[data-figure="${id}"]`);
  await fig.locator('.figure-art svg').waitFor();
  return { context, page, fig, errors };
}

/** 단계 줄과 버튼 글자 */
async function stepState(fig) {
  return {
    label: await fig.locator('.figure-step .label').textContent(),
    text: await fig.locator('.figure-step span:not(.label)').textContent(),
    button: await fig.locator('.figure-next').textContent(),
  };
}

/** 단계 k 에서 보여야 하는 것만 보이는가: [data-step] ≤ k, [data-step-only] = k */
async function visibleMatchesStep(fig, k) {
  return fig.evaluate((el, step) => {
    const wrong = [...el.querySelectorAll('[data-step], [data-step-only]')].filter((n) => {
      const on = n.dataset.stepOnly ? Number(n.dataset.stepOnly) === step : Number(n.dataset.step) <= step;
      return on === n.classList.contains('is-off');
    });
    return wrong.length;
  }, k);
}

test('day 1 figure steps through the request and response', TIMEOUT, async () => {
  const { context, fig, errors } = await openFigure('#/day/p1-d01', 'request-response');
  try {
    assert.equal(await fig.locator('.figure-fallback').count(), 0);
    assert.equal(await fig.locator('.figure-art').getAttribute('role'), 'img');
    assert.deepEqual(await stepState(fig), { label: '단계 1/4', text: REQUEST_STEPS[0], button: '▶ 다음 단계' });
    assert.equal(await visibleMatchesStep(fig, 1), 0);
    for (const k of [2, 3, 4]) {
      await fig.locator('.figure-next').click();
      assert.equal((await stepState(fig)).label, `단계 ${k}/4`);
      assert.equal(await visibleMatchesStep(fig, k), 0, `단계 ${k}`);
    }
    assert.deepEqual(await stepState(fig), { label: '단계 4/4', text: REQUEST_STEPS[3], button: '↺ 처음부터' });
    await fig.locator('.figure-next').click();
    assert.equal((await stepState(fig)).label, '단계 1/4');
    assert.equal(await visibleMatchesStep(fig, 1), 0);
    assert.deepEqual(errors, []);
  } finally {
    await context.close();
  }
});

test('reduced motion shows the final step and never animates', TIMEOUT, async () => {
  const { context, fig } = await openFigure('#/day/p1-d01', 'request-response', { reduce: true });
  // 동작 줄이기 전역 규칙(transition-duration: 0.01ms)이 만드는 0.01ms 전환은 움직임이 아니므로 뺀다
  const animations = () =>
    fig.locator('.figure-art').evaluate((el) => el.getAnimations({ subtree: true }).filter((a) => Number(a.effect.getTiming().duration) > 1).length);
  try {
    assert.deepEqual(await stepState(fig), { label: '단계 4/4', text: REQUEST_STEPS[3], button: '↺ 처음부터' });
    assert.equal(await visibleMatchesStep(fig, 4), 0); // 마지막 단계(최종 상태). 앞 단계만의 강조(data-step-only)는 꺼져 있다
    assert.equal(await fig.locator('[data-step].is-off').count(), 0);
    assert.equal(await animations(), 0);
    await fig.locator('.figure-next').click();
    assert.equal((await stepState(fig)).label, '단계 1/4');
    assert.equal(await animations(), 0);
    await fig.locator('.figure-next').click();
    assert.equal((await stepState(fig)).label, '단계 2/4');
    assert.equal(await animations(), 0);
  } finally {
    await context.close();
  }
});

test('stepping forward animates only what appears', TIMEOUT, async () => {
  const { context, fig } = await openFigure('#/day/p1-d01', 'request-response');
  try {
    // 그림 안(.figure-art)만 센다: 그림 틀 Reveal 과 버튼의 CSS 전환은 다른 규칙이다
    await fig.locator('.figure-next').click();
    const targets = await fig.locator('.figure-art').evaluate((el) =>
      el.getAnimations({ subtree: true }).map((a) => {
        const owner = a.effect.target.closest('[data-step], [data-step-only]');
        return owner?.dataset.step ?? owner?.dataset.stepOnly ?? null;
      }),
    );
    assert.ok(targets.length > 0, '앞으로 갈 때 움직임이 없다');
    assert.ok(targets.every((s) => s === '2'), JSON.stringify(targets));
  } finally {
    await context.close();
  }
});

test('day 7 git figure moves the file down to GitHub', TIMEOUT, async () => {
  const { context, fig, errors } = await openFigure('#/day/p1-d07', 'git-flow');
  try {
    assert.deepEqual(await stepState(fig), { label: '단계 1/4', text: GIT_STEPS[0], button: '▶ 다음 단계' });
    const visible = (sel) => fig.locator(sel).evaluate((el) => !el.closest('.is-off'));
    assert.equal(await visible('[data-cell="work"] .fig-file'), true);
    for (const k of [2, 3, 4]) {
      await fig.locator('.figure-next').click();
      assert.equal(await visibleMatchesStep(fig, k), 0, `단계 ${k}`);
    }
    assert.deepEqual(await stepState(fig), { label: '단계 4/4', text: GIT_STEPS[3], button: '↺ 처음부터' });
    assert.equal(await visible('[data-cell="history"] .fig-commit'), true);
    assert.equal(await visible('[data-cell="github"] .fig-commit'), true);
    assert.equal(await visible('[data-cell="work"] .fig-file'), false);
    assert.deepEqual(errors, []);
  } finally {
    await context.close();
  }
});

test('figure state resets after leaving the day', TIMEOUT, async () => {
  const { context, page, fig, errors } = await openFigure('#/day/p1-d01', 'request-response');
  try {
    await fig.locator('.figure-next').click();
    await fig.locator('.figure-next').click();
    assert.equal((await stepState(fig)).label, '단계 3/4');
    await page.goto(`${server.url}index.html#/`);
    await page.locator('.home').waitFor();
    await page.goBack();
    await fig.locator('.figure-art svg').waitFor();
    assert.equal((await stepState(fig)).label, '단계 1/4');
    assert.deepEqual(errors, []);
  } finally {
    await context.close();
  }
});
