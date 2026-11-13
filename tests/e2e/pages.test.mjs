// 월드 페이지·부록 페이지 e2e(M7): 월드 페이지, 부록 머리, 용어 색인, 문제 해결 목차·Accordion.
// 모양·문구는 DESIGN.md(월드 페이지, 부록 머리, 목차 카드, 증상 Accordion)와 M7 계획서를 따른다. 실행: cd textbook && npm run test:e2e
// 픽스처를 복사해 고친다: fa-d02 는 파일을 지워 "준비 중"으로 만든다.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
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

/** 픽스처 복사본을 이 파일의 장면에 맞게 고친다 */
async function prepareContent(content) {
  await rm(path.join(content, 'fa', 'day-02.md'));
}

before(async () => {
  tmp = await mkdtemp(path.join(tmpdir(), 'wzh-pages-'));
  const content = path.join(tmp, 'content');
  await cp(FIXTURE, content, { recursive: true });
  await prepareContent(content);
  const r = await build({ contentDir: content, allowMissing: true });
  assert.equal(r.ok, true, JSON.stringify(r.errors));
  const site = path.join(tmp, 'site'); // 정적 서버는 빌드 결과만 내보낸다 (원본 폴더는 따로)
  await mkdir(site);
  await writeFile(path.join(site, 'index.html'), r.html);
  server = await startStaticServer(site);
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

async function newContext({ reducedMotion = 'no-preference', viewport = { width: 1280, height: 800 }, progress = null } = {}) {
  const context = await browser.newContext({ viewport, reducedMotion, locale: 'ko-KR' });
  if (progress) await context.addInitScript(([key, v]) => localStorage.setItem(key, v), [STORAGE_KEY, seedValue(progress)]);
  return context;
}

/** 새 컨텍스트로 hash 를 열어 fn(page, { context, errors }) 에 넘기고, 끝에서 콘솔 오류 0 을 확인한다 */
async function withPage(hash, fn, opts = {}) {
  const context = await newContext(opts);
  try {
    const page = await context.newPage();
    const errors = collectConsoleErrors(page);
    await page.goto(`${server.url}index.html${hash}`);
    await page.locator('main h1').first().waitFor();
    await fn(page, { context, errors });
    assert.deepEqual(errors, [], '콘솔 오류가 없어야 해요');
  } finally {
    await context.close();
  }
}

/** 토큰 색을 계산값(rgb)으로 읽는다 */
const tokenColor = (page, name) =>
  page.evaluate((n) => {
    const probe = document.createElement('div');
    probe.style.backgroundColor = `var(${n})`;
    document.body.append(probe);
    const value = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return value;
  }, name);

const css = (locator, prop) => locator.evaluate((el, p) => getComputedStyle(el)[p], prop);

// ───────── 월드 페이지 ─────────

test('world page shows the outcome sentence, every stack chip and the day list', TIMEOUT, async () => {
  await withPage('#/project/fa', async (page) => {
    const world = page.locator('.world-page[data-project="fa"]');
    assert.equal(await world.locator('.world-head h1').innerText(), '픽스처 프로젝트 A');
    assert.equal(await world.locator('.world-head-tag').innerText(), '월드 1');
    assert.equal(await world.locator('.world-head .badge .emblem').count(), 1);
    assert.ok((await world.locator('.world-outcome-text').innerText()).length > 0);
    assert.deepEqual(await world.locator('.world-outcome .chips li').allInnerTexts(), ['HTML', 'CSS']);
    assert.deepEqual(await world.locator('.world-day').evaluateAll((els) => els.map((e) => e.dataset.state)), ['today', 'draft']);
    assert.equal(await world.locator('.world-day[aria-current="step"]').getAttribute('data-day'), 'fa-d01');
    assert.match(await world.locator('.world-day.is-draft').innerText(), /준비 중/);
    assert.match(await world.locator('.world-facts').innerText(), /0 \/ 2 Day 완료/);
  });
});

test('a done day turns green and the meter shows the real ratio', TIMEOUT, async () => {
  await withPage(
    '#/project/fa',
    async (page) => {
      const done = page.locator('.world-day[data-day="fa-d01"]');
      assert.equal(await done.getAttribute('data-state'), 'done');
      assert.equal(await done.locator('.row-mark .px').count(), 1);
      assert.equal(await page.locator('.world-day[data-day="fa-d02"]').getAttribute('data-state'), 'today');
      const meter = page.locator('.world-outcome .meter');
      assert.equal(await meter.getAttribute('aria-valuenow'), '50');
      assert.match(await page.locator('.world-facts').innerText(), /1 \/ 2 Day 완료/);
      assert.equal(await css(meter.locator('span'), 'backgroundColor'), await tokenColor(page, '--color-progress'));
    },
    { progress: ['fa-d01'] },
  );
});

test('no pink square when today is in another world', TIMEOUT, async () => {
  await withPage(
    '#/project/fa',
    async (page) => {
      await page.locator('.world-day').first().waitFor();
      assert.equal(await page.locator('.world-day.is-today').count(), 0);
      assert.equal(await page.locator('.world-page [aria-current="step"]').count(), 0);
    },
    { progress: ['fa-d01', 'fa-d02'] },
  );
});

test('world page rows follow DESIGN.md', TIMEOUT, async () => {
  await withPage('#/project/fa', async (page) => {
    const row = page.locator('.world-day').first();
    assert.equal(await css(row, 'minHeight'), '48px');
    assert.equal(await css(row, 'borderTopLeftRadius'), '6px');
    const list = page.locator('.world-days');
    assert.equal(await css(list, 'borderTopWidth'), '2px');
    assert.match(await css(list, 'boxShadow'), /\b4px\b/);
    const num = page.locator('.world-day.is-today .row-num');
    assert.equal(await css(num, 'backgroundColor'), await tokenColor(page, '--color-accent'));
    assert.equal(await css(num, 'width'), '24px');
    const meter = page.locator('.world-outcome .meter');
    assert.equal(await css(meter, 'borderTopLeftRadius'), '6px');
  });
});
