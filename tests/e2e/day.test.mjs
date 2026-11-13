// Day 읽기 e2e(M9): 머리(큰 번호·제목·메타 칩), 본문 리듬, 320px 넘침, 코드 복사, 읽기 위치 바.
// 모양·문구는 DESIGN.md Components "Day 부품"과 M9 계획서를 따른다. 실행: cd textbook && npm run test:e2e
// 픽스처를 복사해 고친다: fa-d01 끝에 긴 경로·넓은 표·긴 코드 줄·긴 단락을 더하고, fa-d02 는 지워 "준비 중"으로 만든다.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { appendFile, cp, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

import { build } from '../../textbook/build.mjs';
import { STORAGE_KEY } from '../../textbook/src/app/progress.js';
import { minutesText } from '../../textbook/src/app/views/common.js';
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
  const longPath = `C:\\dev\\${'a'.repeat(40)}\\${'b'.repeat(30)}\\index.html`;
  const cell = '아주긴낱말아주긴낱말 `inline-code-without-spaces`';
  const table = [`| ${Array.from({ length: 6 }, (_, i) => `열${i + 1}`).join(' | ')} |`, `|${' --- |'.repeat(6)}`, `| ${Array(6).fill(cell).join(' | ')} |`].join('\n');
  const paragraphs = Array.from({ length: 30 }, () => '긴 설명 단락이에요. '.repeat(20)).join('\n\n');
  await appendFile(
    path.join(content, 'fa', 'day-01.md'),
    [
      '',
      ':::path 📂 긴 경로',
      `- \`${longPath}\``,
      ':::',
      '',
      table,
      '',
      '```html',
      `<p>${'x'.repeat(200)}</p>`,
      '```',
      '',
      paragraphs,
      '',
    ].join('\n'),
  );
}

before(async () => {
  tmp = await mkdtemp(path.join(tmpdir(), 'wzh-day-'));
  const content = path.join(tmp, 'content');
  await cp(FIXTURE, content, { recursive: true });
  await prepareContent(content);
  const r = await build({ contentDir: content, allowMissing: true });
  assert.equal(r.ok, true, JSON.stringify(r.errors));
  const site = path.join(tmp, 'site');
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

async function newContext({ reducedMotion = 'no-preference', viewport = { width: 1280, height: 800 }, progress = null, permissions = [] } = {}) {
  const context = await browser.newContext({ viewport, reducedMotion, locale: 'ko-KR', permissions });
  if (progress) await context.addInitScript(([key, v]) => localStorage.setItem(key, v), [STORAGE_KEY, seedValue(progress)]);
  return context;
}

/** 새 컨텍스트로 hash 를 열어 fn(page, { context, errors }) 에 넘기고, 끝에서 콘솔 오류 0 을 확인한다 */
async function withPage(hash, fn, opts = {}) {
  const context = await newContext(opts);
  try {
    if (opts.init) await context.addInitScript(opts.init);
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

/** 앱에 내장된 교재 데이터(빌드가 id·num 을 채운 것) */
const curriculum = (page) => page.evaluate(() => JSON.parse(document.getElementById('wzh-data').textContent));

// ───────── 머리 ─────────

test('day head shows big number, title and meta chips', TIMEOUT, async () => {
  await withPage('#/day/fa-d01', async (page) => {
    const cur = await curriculum(page);
    const project = cur.projects.find((p) => p.id === 'fa');
    const day = project.days.find((d) => d.id === 'fa-d01');

    assert.equal(await page.locator('.lesson-num').getAttribute('aria-hidden'), 'true');
    assert.equal((await page.locator('.lesson-num .num').innerText()).trim(), String(day.num));
    assert.equal((await page.locator('.lesson-head h1').textContent()).trim(), `Day ${day.num} · ${day.title}`);
    const chips = await page.locator('.lesson-chips > li').allInnerTexts();
    assert.deepEqual(chips.slice(0, 3), [minutesText(day.minutes), project.folder, project.title]);
    assert.equal(await page.locator('.lesson-chips > li').nth(1).evaluate((el) => el.classList.contains('is-code')), true);
    assert.equal(await page.locator('.lesson-status').innerText(), '▶ 다음 할 Day');
    // One Big Number: 80px 글자는 하나
    const big = await page.evaluate(() => [...document.querySelectorAll('main *')].filter((el) => getComputedStyle(el).fontSize === '80px' && el.childElementCount === 0).length);
    assert.equal(big, 1);
  });
});

test('day head status chip reads 완료 when the day is done', TIMEOUT, async () => {
  await withPage(
    '#/day/fa-d01',
    async (page) => {
      assert.equal(await page.locator('.lesson-status').innerText(), '✅ 완료');
    },
    { progress: ['fa-d01'] },
  );
});

// ───────── 본문 ─────────

/** 토큰 색을 계산값(rgb)으로 읽는다 */
const tokenRgb = (page, name) =>
  page.evaluate((n) => {
    const probe = document.createElement('div');
    probe.style.color = `var(${n})`;
    document.body.append(probe);
    const value = getComputedStyle(probe).color;
    probe.remove();
    return value;
  }, name);

test('day body follows DESIGN.md rhythm', TIMEOUT, async () => {
  await withPage('#/day/fa-d01', async (page) => {
    const s = await page.evaluate(() => {
      const css = (q, p) => getComputedStyle(document.querySelector(q))[p];
      const h2s = document.querySelectorAll('.lesson-body h2');
      return {
        bodyLine: css('.lesson-body p', 'lineHeight'),
        h2Size: css('.lesson-body h2', 'fontSize'),
        h2Top: getComputedStyle(h2s[1]).marginTop,
        h2Border: getComputedStyle(h2s[1]).borderTopStyle,
        lessonMax: css('.lesson', 'maxWidth'),
        th: css('.lesson-body th', 'backgroundColor'),
        thWeight: css('.lesson-body th', 'fontWeight'),
        tableSize: css('.lesson-body table', 'fontSize'),
        codeFont: css('.lesson-body :not(pre) > code', 'fontSize'),
        codeBg: css('.lesson-body :not(pre) > code', 'backgroundColor'),
      };
    });
    const track = await page.evaluate(() => {
      const probe = document.createElement('div');
      probe.style.backgroundColor = 'var(--color-track)';
      document.body.append(probe);
      const v = getComputedStyle(probe).backgroundColor;
      probe.remove();
      return v;
    });
    assert.equal(s.bodyLine, '29.75px');
    assert.equal(s.h2Size, '26px');
    assert.equal(s.h2Top, '64px');
    assert.equal(s.h2Border, 'none');
    assert.equal(s.lessonMax, '720px');
    assert.equal(s.th, track);
    assert.equal(s.thWeight, '800');
    assert.equal(s.tableSize, '15px');
    assert.equal(s.codeFont, '14px');
    assert.equal(s.codeBg, track);
  });
});

test('day page has no horizontal scroll at 320px', TIMEOUT, async () => {
  await withPage(
    '#/day/fa-d01',
    async (page) => {
      await page.locator('.lesson-body table').waitFor();
      const r = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        // 코드·표(제 안에서만 넘친다) 안쪽을 빼고, 화면 오른쪽 밖으로 나간 요소
        escaped: [...document.querySelectorAll('main *')]
          .filter((el) => !el.closest('pre, table') && el.getBoundingClientRect().right > window.innerWidth + 0.5)
          .map((el) => el.tagName.toLowerCase() + '.' + el.className),
      }));
      assert.ok(r.scrollWidth <= r.clientWidth, `가로 스크롤 ${r.scrollWidth} > ${r.clientWidth}`);
      assert.deepEqual(r.escaped, []);

      const table = await page.locator('.lesson-body table').evaluate((el) => ({ sw: el.scrollWidth, cw: el.clientWidth, ox: getComputedStyle(el).overflowX }));
      assert.ok(table.sw > table.cw, '넓은 표는 표 안에서 스크롤돼야 해요');
      assert.equal(table.ox, 'auto');

      const box = await page.evaluate(() => {
        const body = document.querySelector('.lesson-body').getBoundingClientRect();
        const path = [...document.querySelectorAll('.callout-path')].at(-1).getBoundingClientRect();
        const h1 = document.querySelector('.lesson-head h1').getBoundingClientRect();
        return { bodyRight: body.right, pathRight: path.right, h1Right: h1.right, vw: window.innerWidth };
      });
      assert.ok(box.pathRight <= box.bodyRight + 0.5, JSON.stringify(box));
      assert.ok(box.h1Right <= box.vw, JSON.stringify(box));
    },
    { viewport: { width: 320, height: 640 } },
  );
});
