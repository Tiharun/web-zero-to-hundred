// 시각 테스트: 장면(SCENES)을 375·768·1280(넓은 화면 장면은 1440·1920) × 라이트·다크로 찍어 baseline/ 의 기준 이미지와 비교한다.
// 실행: cd textbook && npm run test:visual   (기준 이미지 갱신: npm run test:visual:update, 사용자 승인 뒤에만)
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { PNG } from './deps.mjs';
import { compare } from './compare.mjs';
import { build } from '../../textbook/build.mjs';
import { STORAGE_KEY } from '../../textbook/src/app/progress.js';
import { launch } from '../helpers/browser.mjs';
import { startStaticServer } from '../helpers/static-server.mjs';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const BASELINE = path.join(HERE, 'baseline');
const OUT = path.join(HERE, '.out');
const UPDATE = process.env.WZH_VISUAL_UPDATE === '1';
const TIMEOUT = { timeout: 60_000 };

const P1_FIRST_THREE = { completed: ['p1-d01', 'p1-d02', 'p1-d03'], lastDay: 'p1-d03' };
/** P1 Day 1~10 을 마친 상태: 그림이 있는 Day 11 까지 열린다 */
const P1_FIRST_TEN = { completed: Array.from({ length: 10 }, (_, i) => `p1-d${String(i + 1).padStart(2, '0')}`), lastDay: 'p1-d10' };
/** P1 30 Day 를 모두 마친 직후: 홈 퀘스트 카드가 "월드 클리어" 상태다 */
const P1_CLEAR = { completed: Array.from({ length: 30 }, (_, i) => `p1-d${String(i + 1).padStart(2, '0')}`), lastDay: 'p1-d30' };
/** P1 마지막 Day 만 남은 상태: p1-d30 을 마치면 월드 클리어(와 레벨업) */
const P1_ALMOST = { completed: P1_CLEAR.completed.slice(0, 29), lastDay: 'p1-d29' };
/** 잠긴 Day 하나: order 로 정렬한 두 번째 프로젝트의 첫 Day (진도가 없으면 잠금 화면이다) */
const LOCKED_DAY = (() => {
  const cur = JSON.parse(readFileSync(path.join(ROOT, 'textbook', 'content', 'curriculum.json'), 'utf8'));
  return `${[...cur.projects].sort((a, b) => a.order - b.order)[1].id}-d01`;
})();
/** 실제 교재의 모든 Day 를 마친 상태: 퀘스트 카드 "모든 월드 클리어", lastDay 는 마지막 프로젝트의 마지막 Day */
const ALL_DONE = (() => {
  const cur = JSON.parse(readFileSync(path.join(ROOT, 'textbook', 'content', 'curriculum.json'), 'utf8'));
  const ids = [...cur.projects]
    .sort((a, b) => a.order - b.order)
    .flatMap((p) => p.days.map((_, i) => `${p.id}-d${String(i + 1).padStart(2, '0')}`));
  return { completed: ids, lastDay: ids.at(-1) };
})();

/**
 * 찍을 장면. 장면을 늘릴 때는 여기에 한 줄을 더한다.
 * widths: 이 폭에서만 찍는다(없으면 WIDTHS), open: 찍기 전에 누를 선택자(첫 번째 일치만), waitFor: 누른 뒤 나타나기를 기다릴 선택자,
 * fullPage: 화면 아래까지 전체를 찍는다(없으면 첫 화면만)
 */
export const SCENES = [
  { id: 'home', hash: '#/', progress: P1_FIRST_THREE, fullPage: true },
  { id: 'day', hash: '#/day/p1-d01', progress: P1_FIRST_THREE },
  // M9: 본문 아래쪽 부품. scrollTo 의 첫 요소를 상단 바 바로 아래로 옮겨 찍는다
  { id: 'day-code', hash: '#/day/p1-d01', progress: P1_FIRST_THREE, scrollTo: 'figure.code' },
  { id: 'day-table', hash: '#/day/p1-d01', progress: P1_FIRST_THREE, scrollTo: '.lesson-body table' },
  { id: 'day-answer', hash: '#/day/p1-d01', progress: P1_FIRST_THREE, scrollTo: 'details.answer' },
  { id: 'day-trouble', hash: '#/day/p1-d01', progress: P1_FIRST_THREE, open: '.lesson-body .ts-entry > summary', waitFor: '.lesson-body .ts-entry[open]', scrollTo: '.lesson-body .ts-entry' },
  { id: 'day-foot', hash: '#/day/p1-d01', progress: P1_FIRST_THREE, scrollTo: '.lesson-foot' },
  { id: 'day-check', hash: '#/day/p1-d04', progress: P1_FIRST_THREE, open: '.lesson-body li.task input[data-check]', waitFor: '.lesson-body li.task.is-checked', scrollTo: '.lesson-body li.task' },
  { id: 'day-goal', hash: '#/day/p1-d04', progress: P1_FIRST_THREE, open: '.lesson-body li.task input[data-check]', waitFor: '.lesson-body li.task.is-checked', scrollTo: '.lesson-foot' },
  { id: 'day-quest', hash: '#/day/p1-d01', progress: P1_FIRST_THREE, widths: [375, 768], open: '.quest-mini > summary', waitFor: '.quest-mini[open]' },
  { id: 'settings', hash: '#/settings', progress: null },
  { id: 'notfound', hash: '#/nope', progress: null },
  { id: 'confirm', hash: '#/settings', progress: null, open: '[data-testid="reset-button"]', waitFor: '#confirm-dialog[open]' },
  { id: 'locked', hash: `#/day/${LOCKED_DAY}`, progress: null, widths: [375, 1280] },
  { id: 'drawer', hash: '#/', progress: P1_FIRST_THREE, widths: [375, 768], open: '#menu-toggle', waitFor: '#drawer[open]' },
  { id: 'search', hash: '#/', progress: P1_FIRST_THREE, open: '#search-open', waitFor: '#search-dialog[open]' },
  { id: 'search-page', hash: '#/search', progress: P1_FIRST_THREE },
  { id: 'home-first', hash: '#/', progress: null, widths: [375, 1280], fullPage: true },
  { id: 'home-clear', hash: '#/', progress: P1_CLEAR, widths: [375, 1280], fullPage: true },
  { id: 'home-done', hash: '#/', progress: ALL_DONE, widths: [375, 1280], fullPage: true },
  { id: 'world', hash: '#/project/p1', progress: P1_FIRST_THREE },
  { id: 'start', hash: '#/page/start', progress: null },
  { id: 'glossary', hash: '#/page/glossary', progress: null },
  { id: 'troubleshooting', hash: '#/page/troubleshooting', progress: null, open: '.ts-entry > summary', waitFor: '.ts-entry[open]' },
  { id: 'toast', hash: '#/', progress: null, widths: [375, 1280], open: '.world-card.is-locked .card-hit', waitFor: '.toast' },
  // M11 보상과 연결: P1 Day 1~3 = 280 XP, Day 4 완료로 LV 2 / P1 마지막 Day 완료로 월드 클리어 + LV 달성 줄
  { id: 'levelup', hash: '#/day/p1-d04', progress: P1_FIRST_THREE, open: '[data-testid="complete-button"]', waitFor: '#reward-dialog[open]' },
  { id: 'world-clear', hash: '#/day/p1-d30', progress: P1_ALMOST, widths: [375, 1280], open: '[data-testid="complete-button"]', waitFor: '#reward-dialog[open]' },
  { id: 'term', hash: '#/day/p1-d01', progress: P1_FIRST_THREE, open: '.lesson-body a.term', waitFor: '#term-drawer[open]' },
  { id: 'toast-reward', hash: '#/day/p1-d01', progress: null, widths: [375, 1280], open: '[data-testid="complete-button"]', waitFor: '.toast.has-icon' },
  // M12 넓은 화면: 화면 묶음이 본문 가운데에 오는지(DESIGN.md Layout 화면 묶음)
  { id: 'wide-home', hash: '#/', progress: P1_FIRST_THREE, widths: [1440, 1920], fullPage: true },
  { id: 'wide-day', hash: '#/day/p1-d04', progress: P1_FIRST_THREE, widths: [1440, 1920] },
  { id: 'wide-world', hash: '#/project/p1', progress: P1_FIRST_THREE, widths: [1440, 1920] },
  { id: 'wide-glossary', hash: '#/page/glossary', progress: null, widths: [1440, 1920] },
  { id: 'wide-settings', hash: '#/settings', progress: null, widths: [1440, 1920] },
  // M12: Day 그림. 시각 테스트는 동작 줄이기가 켜져 있어 단계 그림은 마지막 단계, 값 고르기 그림은 기본값이다
  { id: 'fig-request', hash: '#/day/p1-d01', progress: P1_FIRST_THREE, scrollTo: 'figure.figure' },
  { id: 'fig-paths-site', hash: '#/day/p1-d04', progress: P1_FIRST_THREE, widths: [375, 1280], scrollTo: 'figure.figure' },
  { id: 'fig-paths-dev', hash: '#/day/p1-d05', progress: P1_FIRST_TEN, scrollTo: 'figure.figure' },
  { id: 'fig-git', hash: '#/day/p1-d07', progress: P1_FIRST_TEN, scrollTo: 'figure.figure' },
  { id: 'fig-flex', hash: '#/day/p1-d11', progress: P1_FIRST_TEN, scrollTo: 'figure.figure' },
];
const WIDTHS = [375, 768, 1280];
const THEMES = ['light', 'dark'];
const FIXED_TIME = '2026-01-01T00:00:00+09:00';

/** 장면의 진도를 저장소 값으로 만든다. 테마도 진도에 함께 저장된다 */
function storedProgress(progress, theme) {
  const completed = Object.fromEntries((progress?.completed ?? []).map((id) => [id, '2026-01-01T00:00:00.000Z']));
  return { version: 1, completed, checks: {}, lastDay: progress?.lastDay ?? null, theme };
}

let tmp;
let server;
let browser;

before(async () => {
  tmp = await mkdtemp(path.join(tmpdir(), 'wzh-visual-'));
  const r = await build({ contentDir: path.join(ROOT, 'textbook', 'content'), allowMissing: true });
  assert.equal(r.ok, true, JSON.stringify(r.errors?.slice(0, 3)));
  await writeFile(path.join(tmp, 'index.html'), r.html);
  server = await startStaticServer(tmp);
  browser = await launch();
  await mkdir(OUT, { recursive: true });
});

after(async () => {
  await browser?.close();
  await server?.close();
  if (tmp) await rm(tmp, { recursive: true, force: true });
});

async function shoot(scene, width, theme) {
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
    locale: 'ko-KR',
    colorScheme: theme,
  });
  try {
    await context.addInitScript(
      ({ key, value }) => localStorage.setItem(key, value),
      { key: STORAGE_KEY, value: JSON.stringify(storedProgress(scene.progress, theme)) },
    );
    const page = await context.newPage();
    await page.clock.setFixedTime(new Date(FIXED_TIME));
    await page.goto(`${server.url}index.html${scene.hash}`);
    await page.locator('main h1').first().waitFor();
    if (scene.open) {
      await page.locator(scene.open).first().click();
      await page.locator(scene.waitFor).waitFor();
    }
    await page.evaluate(() => document.fonts.ready.then(() => true));
    if (scene.scrollTo) {
      await page.locator(scene.scrollTo).first().evaluate(async (el) => {
        el.scrollIntoView({ block: 'start' });
        // 고정된 상단 바에 가리지 않게 바 높이 + 16px 만큼 되돌린다
        window.scrollBy(0, -((document.querySelector('.topbar')?.offsetHeight ?? 0) + 16));
        // 프로그램 스크롤의 scroll 이벤트가 늦게 올 때가 있어, 퀘스트 로그가 옮긴 위치로 다시 재게 직접 한 번 보낸다
        window.dispatchEvent(new Event('scroll'));
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      });
    }
    // 설정 화면의 빌드 날짜는 빌드할 때마다 바뀌므로 가린다
    const mask = [page.locator('main p', { hasText: /빌드 \d{4}/ })];
    return await page.screenshot({ fullPage: scene.fullPage ?? false, mask, animations: 'disabled', caret: 'hide' });
  } finally {
    await context.close();
  }
}

for (const scene of SCENES) {
  for (const width of scene.widths ?? WIDTHS) {
    for (const theme of THEMES) {
      const name = `${scene.id}-${width}-${theme}`;
      test(`visual: ${name}`, TIMEOUT, async () => {
        const actual = await shoot(scene, width, theme);
        const file = path.join(BASELINE, `${name}.png`);
        if (UPDATE) {
          await mkdir(BASELINE, { recursive: true });
          await writeFile(file, actual);
          return;
        }
        const expected = await readFile(file).catch(() => null);
        if (!expected) await writeFile(path.join(OUT, `${name}.actual.png`), actual); // 새 장면도 눈으로 볼 수 있게
        assert.ok(expected, `기준 이미지 없음: ${path.relative(ROOT, file)} — npm run test:visual:update`);
        const r = compare(expected, actual);
        if (!r.ok) {
          await writeFile(path.join(OUT, `${name}.actual.png`), actual);
          if (r.diffPng) await writeFile(path.join(OUT, `${name}.diff.png`), r.diffPng);
        }
        assert.ok(r.ok, `${name}: ${r.reason} → tests/visual/.out/ 에서 확인`);
      });
    }
  }
}

function solidPng(width, height, [r, g, b]) {
  const png = new PNG({ width, height });
  for (let i = 0; i < png.data.length; i += 4) png.data.set([r, g, b, 255], i);
  return PNG.sync.write(png);
}

function withBlock(buffer, x0, y0, w, h, [r, g, b]) {
  const png = PNG.sync.read(buffer);
  for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) png.data.set([r, g, b, 255], (y * png.width + x) * 4);
  return PNG.sync.write(png);
}

test('compare: identical passes, a changed block fails, different sizes fail', () => {
  const a = solidPng(100, 100, [255, 255, 255]);
  assert.equal(compare(a, a).ok, true);
  const b = withBlock(a, 10, 10, 20, 20, [0, 0, 0]); // 400픽셀 = 4%
  const r = compare(a, b);
  assert.equal(r.ok, false);
  assert.ok(r.diffRatio > 0.03, String(r.diffRatio));
  assert.ok(Buffer.isBuffer(r.diffPng));
  const sized = compare(a, solidPng(100, 101, [255, 255, 255]));
  assert.equal(sized.ok, false);
  assert.match(sized.reason, /크기/);
  // 0.1% 이하(10픽셀 미만)의 차이는 통과
  assert.equal(compare(a, withBlock(a, 0, 0, 3, 3, [0, 0, 0])).ok, true);
});

test('compare: a pale token shift is caught (paper #EEF2FF → #FFF0F0, OKLab distance 0.033)', () => {
  const paper = solidPng(50, 50, [0xee, 0xf2, 0xff]);
  assert.equal(compare(paper, solidPng(50, 50, [0xff, 0xf0, 0xf0])).ok, false);
  assert.equal(compare(paper, paper).ok, true);
});
