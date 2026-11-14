// 넓은 화면 e2e: 화면 묶음이 본문 영역 가운데에 오는지 본다(DESIGN.md Layout "화면 묶음").
// 실제 교재(textbook/content)를 빌드해 로컬 서버(127.0.0.1)로 연다. 실행: cd textbook && npm run test:e2e
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { build } from '../../textbook/build.mjs';
import { STORAGE_KEY } from '../../textbook/src/app/progress.js';
import { launch } from '../helpers/browser.mjs';
import { startStaticServer } from '../helpers/static-server.mjs';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const TIMEOUT = { timeout: 120_000 };
const P1_FIRST_THREE = {
  version: 1,
  completed: { 'p1-d01': '2026-01-01T00:00:00.000Z', 'p1-d02': '2026-01-01T00:00:00.000Z', 'p1-d03': '2026-01-01T00:00:00.000Z' },
  checks: {},
  lastDay: 'p1-d03',
  theme: 'light',
};

/** 잠긴 Day 하나: order 로 정렬한 두 번째 프로젝트의 첫 Day */
const LOCKED_DAY = (() => {
  const cur = JSON.parse(readFileSync(path.join(ROOT, 'textbook', 'content', 'curriculum.json'), 'utf8'));
  return `${[...cur.projects].sort((a, b) => a.order - b.order)[1].id}-d01`;
})();

/** [주소, 화면 묶음 선택자] */
const SCREENS = [
  ['#/', '.home'],
  ['#/day/p1-d04', '.lesson'],
  ['#/project/p1', '.world-page'],
  ['#/page/glossary', '.page-article'],
  ['#/settings', '.settings'],
  ['#/search', '.search-view'],
  ['#/nope', '.notfound'],
  [`#/day/${LOCKED_DAY}`, '.lock-screen'],
];

let tmp;
let server;
let browser;

before(async () => {
  tmp = await mkdtemp(path.join(tmpdir(), 'wzh-wide-'));
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

async function openAt(width, hash, sel) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce', locale: 'ko-KR' });
  await context.addInitScript(({ key, value }) => localStorage.setItem(key, value), { key: STORAGE_KEY, value: JSON.stringify(P1_FIRST_THREE) });
  const page = await context.newPage();
  await page.goto(`${server.url}index.html${hash}`);
  await page.locator(sel).first().waitFor();
  await page.evaluate(() => document.fonts.ready.then(() => true));
  return { context, page };
}

/**
 * 묶음의 좌우 여백: 본문 안쪽(패딩 안) 기준.
 * 묶음 상자가 꽉 차도 안의 내용이 한쪽에 붙을 수 있으므로, 보이는 자식들을 합친 범위로 잰다
 */
function gaps(sel) {
  const main = document.querySelector('#main');
  const cs = getComputedStyle(main);
  const r = main.getBoundingClientRect();
  const kids = [...document.querySelector(sel).children].map((el) => el.getBoundingClientRect()).filter((k) => k.width > 0);
  const b = { left: Math.min(...kids.map((k) => k.left)), right: Math.max(...kids.map((k) => k.right)) };
  const de = document.documentElement;
  return {
    left: b.left - (r.left + parseFloat(cs.paddingLeft)),
    right: r.right - parseFloat(cs.paddingRight) - b.right,
    scroll: de.scrollWidth - de.clientWidth,
  };
}

test('wide layout centers each screen', TIMEOUT, async () => {
  for (const width of [1280, 1440, 1920]) {
    for (const [hash, sel] of SCREENS) {
      const { context, page } = await openAt(width, hash, sel);
      try {
        const g = await page.evaluate(gaps, sel);
        assert.ok(Math.abs(g.left - g.right) <= 2, `${width} ${hash}: ${g.left} vs ${g.right}`);
        assert.ok(g.left >= -2 && g.right >= -2, `${width} ${hash}: ${g.left} / ${g.right}`);
        assert.equal(g.scroll, 0, `${width} ${hash}: 가로 스크롤`);
      } finally {
        await context.close();
      }
    }
  }
});

test('1920px day keeps a 720px text column and a 220px sticky quest log', TIMEOUT, async () => {
  const { context, page } = await openAt(1920, '#/day/p1-d04', '.lesson');
  try {
    const width = (sel) => page.locator(sel).first().evaluate((el) => el.getBoundingClientRect().width);
    assert.equal(Math.round(await width('.lesson-body')), 720);
    assert.equal(Math.round(await width('.quest-log')), 220);
    const log = await page.evaluate(async () => {
      window.scrollTo(0, 1500);
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const el = document.querySelector('.quest-log');
      return { position: getComputedStyle(el).position, top: el.getBoundingClientRect().top };
    });
    assert.equal(log.position, 'sticky');
    assert.ok(Math.abs(log.top - (56 + 24)) <= 1, `quest log top ${log.top}`);
  } finally {
    await context.close();
  }
});

test('footer content lines up with the home column at 1920px', TIMEOUT, async () => {
  const { context, page } = await openAt(1920, '#/', '.home');
  try {
    const left = (sel) => page.locator(sel).first().evaluate((el) => el.getBoundingClientRect().left);
    const diff = Math.abs((await left('.footer-brand')) - (await left('.home')));
    assert.ok(diff <= 2, `footer ${diff}px off the home column`);
  } finally {
    await context.close();
  }
});
