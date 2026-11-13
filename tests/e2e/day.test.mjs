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
        lessonCols: css('.lesson', 'gridTemplateColumns'), // 1280px: 글 열(최대 --lesson-max) + 퀘스트 로그 열
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
    const cols = s.lessonCols.match(/^([\d.]+)px 220px$/);
    assert.ok(cols && Number(cols[1]) <= 720, `글 열 ${s.lessonCols}`);
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

// ───────── 코드 블록 ─────────

test('copy button copies code and shows 복사됨', TIMEOUT, async () => {
  await withPage(
    '#/day/fa-d01',
    async (page) => {
      const button = page.locator('figure.code button.copy').first();
      const code = await page.locator('figure.code pre code').first().textContent();
      await button.click();
      await eventually(async () => assert.equal((await button.innerText()).trim(), '복사됨'));
      assert.equal(await page.evaluate(() => navigator.clipboard.readText()), code);
      assert.equal(await button.evaluate((el) => getComputedStyle(el).color), await tokenRgb(page, '--color-tok-string'));
      const box = await button.boundingBox();
      assert.ok(box.width >= 72 && box.height >= 40, JSON.stringify(box));
      await eventually(async () => assert.equal((await button.innerText()).trim(), '복사'), 4000);
    },
    { permissions: ['clipboard-read', 'clipboard-write'] },
  );
});

test('code block head and body follow DESIGN.md', TIMEOUT, async () => {
  await withPage('#/day/fa-d01', async (page) => {
    const s = await page.locator('figure.code').first().evaluate((fig) => {
      const cs = (el) => getComputedStyle(el);
      const button = fig.querySelector('.copy');
      return {
        margin: [cs(fig).marginTop, cs(fig).marginBottom],
        pre: cs(fig.querySelector('pre')).padding,
        weight: cs(button).fontWeight,
        size: cs(button).fontSize,
      };
    });
    const caption = await page.locator('figure.code figcaption').first().evaluate((el) => [getComputedStyle(el).fontSize, getComputedStyle(el).padding]);
    assert.deepEqual(s.margin, ['24px', '24px']);
    assert.equal(s.pre, '16px');
    assert.equal(s.weight, '800');
    assert.equal(s.size, '15px');
    assert.deepEqual(caption, ['14px', '8px 16px']);
    const head = await page.locator('figure.code:has(figcaption) .copy').first().evaluate((el) => el.getBoundingClientRect().height);
    assert.ok(head >= 40, `윗줄 ${head}px`);
  });
});

// ───────── 읽기 위치 바 ─────────

const PHONE = { width: 375, height: 640 };

/** .read-bar-fill 의 가로 배율(계산된 transform 행렬의 a). transform 이 none 이면 1 */
const scaleOf = (page) =>
  page.locator('.read-bar-fill').evaluate((el) => {
    const t = getComputedStyle(el).transform;
    return t === 'none' ? 1 : new DOMMatrixReadOnly(t).a;
  });

/** 맨 아래까지 스크롤할 수 있는 비율(0~1)로 옮기고 두 프레임 기다린다 */
const scrollToRatio = (page, ratio) =>
  page.evaluate(async (r) => {
    const el = document.scrollingElement;
    window.scrollTo(0, (el.scrollHeight - el.clientHeight) * r);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }, ratio);

const goHash = async (page, hash) => {
  await page.evaluate((h) => {
    location.hash = h;
  }, hash);
  await page.locator(`main[data-hash="${hash}"]`).waitFor();
};

test('read bar fills as the page scrolls', TIMEOUT, async () => {
  await withPage(
    '#/day/fa-d01',
    async (page) => {
      const bar = page.locator('.read-bar');
      assert.equal(await bar.count(), 1);
      assert.equal(await bar.getAttribute('aria-hidden'), 'true');
      const r = await bar.evaluate((el) => el.getBoundingClientRect().toJSON());
      assert.equal(r.top, 56);
      assert.equal(r.height, 3);
      await eventually(async () => assert.ok((await scaleOf(page)) <= 0.02, `맨 위 ${await scaleOf(page)}`));
      await scrollToRatio(page, 0.5);
      await eventually(async () => {
        const s = await scaleOf(page);
        assert.ok(s >= 0.4 && s <= 0.6, `가운데 ${s}`);
      });
      await scrollToRatio(page, 1);
      await eventually(async () => assert.ok((await scaleOf(page)) >= 0.98, `맨 아래 ${await scaleOf(page)}`));
    },
    { viewport: PHONE },
  );
});

test('read bar keeps tracking with reduced motion', TIMEOUT, async () => {
  await withPage(
    '#/day/fa-d01',
    async (page) => {
      await scrollToRatio(page, 1);
      await eventually(async () => assert.ok((await scaleOf(page)) >= 0.98, `맨 아래 ${await scaleOf(page)}`));
    },
    { viewport: PHONE, reducedMotion: 'reduce' },
  );
});

test('read bar falls back to --read without scroll timelines', TIMEOUT, async () => {
  await withPage(
    '#/day/fa-d01',
    async (page) => {
      await scrollToRatio(page, 1);
      await eventually(async () => assert.equal(await page.locator('.read-bar').evaluate((el) => el.style.getPropertyValue('--read')), '1.0000'));
    },
    {
      viewport: PHONE,
      init: () => {
        const supports = CSS.supports.bind(CSS);
        CSS.supports = (...args) => (String(args.join(' ')).includes('animation-timeline') ? false : supports(...args));
      },
    },
  );
});

test('read bar fallback follows content that grows without scrolling', TIMEOUT, async () => {
  await withPage(
    '#/day/fa-d01',
    async (page) => {
      const read = async () => Number(await page.locator('.read-bar').evaluate((el) => el.style.getPropertyValue('--read')));
      await scrollToRatio(page, 0.5);
      await eventually(async () => assert.ok(Math.abs((await read()) - 0.5) < 0.05, `가운데 ${await read()}`));
      // 정답 펼치기처럼 스크롤 없이 화면 아래쪽 본문이 길어지면, 읽은 비율은 줄어든다
      await page.evaluate(() => document.querySelector('.lesson-foot').append(Object.assign(document.createElement('div'), { style: 'height: 6000px' })));
      await eventually(async () => assert.ok((await read()) < 0.4, `--read ${await read()}`));
    },
    {
      viewport: PHONE,
      init: () => {
        const supports = CSS.supports.bind(CSS);
        CSS.supports = (...args) => (String(args.join(' ')).includes('animation-timeline') ? false : supports(...args));
      },
    },
  );
});

test('read bar exists only on day screens', TIMEOUT, async () => {
  await withPage(
    '#/day/fa-d01',
    async (page) => {
      const bars = page.locator('.read-bar');
      assert.equal(await bars.count(), 1);
      await goHash(page, '#/');
      assert.equal(await bars.count(), 0, '홈에는 없다');
      await goHash(page, '#/day/fa-d01');
      await goHash(page, '#/day/fa-d02');
      assert.equal(await bars.count(), 1, '준비 중 Day 에도 하나');
      await eventually(async () => assert.ok((await scaleOf(page)) <= 0.02, `준비 중 ${await scaleOf(page)}`));
      await goHash(page, '#/day/fb-d01');
      assert.equal(await bars.count(), 0, '잠긴 Day 에는 없다');
    },
    { viewport: PHONE },
  );
});

test('read bar is hidden in print', TIMEOUT, async () => {
  await withPage(
    '#/day/fa-d01',
    async (page) => {
      await page.emulateMedia({ media: 'print' });
      assert.equal(await page.locator('.read-bar').evaluate((el) => getComputedStyle(el).display), 'none');
    },
    { viewport: PHONE },
  );
});

// ───────── 🧯 증상 Accordion (M10) ─────────

test('day symptoms open one by one and expand all follows', TIMEOUT, async () => {
  await withPage(
    '#/day/fa-d01',
    async (page) => {
      const entries = page.locator('.lesson-body details.ts-entry');
      assert.equal(await entries.count(), 2);
      assert.deepEqual(await entries.evaluateAll((els) => els.map((d) => d.open)), [false, false]);
      const btn = page.locator('.lesson-body [data-expand-all]');
      await entries.first().locator('summary').click();
      assert.deepEqual(await entries.evaluateAll((els) => els.map((d) => d.open)), [true, false]);
      assert.equal(await btn.innerText(), '모두 펼치기');
      await btn.click();
      assert.deepEqual(await entries.evaluateAll((els) => els.map((d) => d.open)), [true, true]);
      assert.equal(await btn.innerText(), '모두 접기');
      await btn.click();
      assert.deepEqual(await entries.evaluateAll((els) => els.map((d) => d.open)), [false, false]);
      const [btnTop, h2Bottom] = await page.evaluate(() => {
        const h2 = [...document.querySelectorAll('.lesson-body > h2')].find((el) => el.textContent.trim().startsWith('🧯'));
        return [document.querySelector('.lesson-body [data-expand-all]').getBoundingClientRect().top, h2.getBoundingClientRect().bottom];
      });
      assert.ok(btnTop >= h2Bottom - 0.5, `버튼은 🧯 제목 아래 (${btnTop} < ${h2Bottom})`);
    },
    { viewport: PHONE },
  );
});

test('day symptoms work from the keyboard', TIMEOUT, async () => {
  await withPage(
    '#/day/fa-d01',
    async (page) => {
      const entries = page.locator('.lesson-body details.ts-entry');
      await entries.first().locator('summary').focus();
      await page.keyboard.press('Enter');
      assert.equal(await entries.first().evaluate((d) => d.open), true);
      await entries.first().locator('summary').evaluate((el) => el.blur());
      await page.locator('.lesson-body [data-expand-all]').focus();
      await page.keyboard.press('Enter');
      assert.deepEqual(await entries.evaluateAll((els) => els.map((d) => d.open)), [true, true]);
      // Tab 순서: 모두 펼치기 → 첫 증상 summary
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement === document.querySelector('.lesson-body details.ts-entry > summary')), true);
    },
    { viewport: PHONE },
  );
});

// ───────── 퀘스트 로그 (M10) ─────────

const frames = (page) => page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
const sectionCount = (page) => page.locator('.lesson-body > h2[id]').count();
const currentIndex = (scope) => scope.locator('button.quest-item').evaluateAll((els) => els.findIndex((el) => el.getAttribute('aria-current') === 'step'));

test('quest log marks the section being read at 1280px', TIMEOUT, async () => {
  await withPage('#/day/fa-d01', async (page) => {
    const log = page.locator('.quest-log');
    assert.equal(await log.isVisible(), true);
    assert.equal(await page.locator('.quest-mini').evaluate((el) => getComputedStyle(el).display), 'none');
    const [logLeft, bodyRight] = await page.evaluate(() => [
      document.querySelector('.quest-log').getBoundingClientRect().left,
      document.querySelector('.lesson-body').getBoundingClientRect().right,
    ]);
    assert.ok(logLeft > bodyRight, `오른쪽 열 (${logLeft} <= ${bodyRight})`);
    const n = await sectionCount(page);
    assert.ok(n >= 7, `섹션 ${n}개`);
    assert.equal(await log.locator('.quest-step').innerText(), `단계 1/${n}`);
    assert.equal(await currentIndex(log), 0);
    assert.equal(await log.locator('[aria-current="step"]').count(), 1);

    await page.locator('.lesson-body > h2[id]').nth(3).evaluate((el) => el.scrollIntoView());
    await eventually(async () => assert.equal(await currentIndex(log), 3));
    assert.equal(await log.locator('.quest-step').innerText(), `단계 4/${n}`);
    const top = await log.evaluate((el) => el.getBoundingClientRect().top);
    assert.ok(Math.abs(top - 80) <= 2, `sticky top ${top}`);

    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await eventually(async () => assert.equal(await currentIndex(log), n - 1));
  });
});

test('quest log button scrolls to the heading and focuses it', TIMEOUT, async () => {
  await withPage(
    '#/day/fa-d01',
    async (page) => {
      await page.locator('.quest-log button.quest-item').nth(4).click();
      await frames(page);
      const r = await page.evaluate(() => {
        const h2 = document.querySelectorAll('.lesson-body > h2[id]')[4];
        return { focused: document.activeElement === h2, top: h2.getBoundingClientRect().top };
      });
      assert.equal(r.focused, true, '제목에 포커스');
      assert.ok(Math.abs(r.top - 80) <= 4, `제목 위치 ${r.top}`);
    },
    { reducedMotion: 'reduce' },
  );
});

test('narrow screens get the quest log as a details card above the body', TIMEOUT, async () => {
  await withPage(
    '#/day/fa-d01',
    async (page) => {
      assert.equal(await page.locator('.quest-log').isVisible(), false);
      const mini = page.locator('.quest-mini');
      assert.equal(await mini.evaluate((el) => el.nextElementSibling?.classList.contains('lesson-body')), true);
      const n = await sectionCount(page);
      assert.match(await mini.locator('summary').innerText(), new RegExp(`퀘스트 로그 · 단계 1/${n}`));
      await mini.locator('summary').focus();
      await page.keyboard.press('Enter');
      assert.equal(await mini.evaluate((d) => d.open), true);
      for (let i = 0; i < 3; i++) await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement === document.querySelectorAll('.quest-mini button.quest-item')[2]), true);
      await page.keyboard.press('Enter');
      await eventually(async () =>
        assert.equal(await page.evaluate(() => document.activeElement === document.querySelectorAll('.lesson-body > h2[id]')[2]), true),
      );
    },
    { viewport: PHONE, reducedMotion: 'reduce' },
  );
});

test('quest log leaves with the day', TIMEOUT, async () => {
  await withPage(
    '#/day/fa-d01',
    async (page) => {
      assert.equal(await page.locator('.quest-log').count(), 1);
      await goHash(page, '#/');
      assert.equal(await page.locator('.quest-log, .quest-mini').count(), 0, '홈에는 없다');
      await goHash(page, '#/day/fa-d02');
      assert.equal(await page.locator('.quest-log, .quest-mini').count(), 0, '준비 중 Day 에는 없다');
    },
    { viewport: PHONE },
  );
});

test('old day outline is gone', TIMEOUT, async () => {
  await withPage('#/day/fa-d01', async (page) => {
    assert.equal(await page.locator('.day-outline').count(), 0);
  });
});

// ───────── Day 완료 조건 (M10, 완료 기준 ②③) ─────────

/** 이전 Day(fa-d01)를 안 끝낸 Day. 이 파일에서는 준비 중이지만 완료 카드는 그대로 있다 */
const BLOCKED = '#/day/fa-d02';
const liveText = (page) => page.locator('#live').innerText();
const storedDone = (page, id) => page.evaluate(([key, d]) => Boolean(JSON.parse(localStorage.getItem(key) ?? '{}').completed?.[d]), [STORAGE_KEY, id]);

test('pressing a blocked Day complete shakes and explains', TIMEOUT, async () => {
  await withPage(
    BLOCKED,
    async (page) => {
      const btn = page.getByTestId('complete-button');
      await btn.scrollIntoViewIfNeeded();
      await btn.click({ force: true }); // Playwright 는 aria-disabled 버튼을 기다리므로 실제 사용자처럼 바로 누른다
      assert.equal(await btn.evaluate((el) => el.getAnimations().some((a) => a.id === 'shake')), true, '흔들린다');
      const reason = page.locator('#complete-reason');
      assert.match(await reason.getAttribute('class'), /is-alert/);
      assert.equal(await reason.evaluate((el) => getComputedStyle(el).fontWeight), '800');
      const text = await reason.innerText();
      await eventually(async () => assert.equal(await liveText(page), text));
      assert.equal(await storedDone(page, 'fa-d02'), false);
    },
    { viewport: PHONE },
  );
});

test('blocked Day complete from the keyboard, pressed again and again', TIMEOUT, async () => {
  await withPage(
    BLOCKED,
    async (page) => {
      const btn = page.getByTestId('complete-button');
      await btn.focus();
      assert.equal(await btn.evaluate((el) => el === document.activeElement), true, '포커스를 받는다');
      for (let i = 0; i < 3; i++) await page.keyboard.press('Enter');
      assert.equal(await page.locator('.completion .reason').count(), 1);
      assert.equal(await btn.evaluate((el) => el === document.activeElement), true, '포커스는 버튼에 남는다');
      assert.match(await page.locator('#complete-reason').getAttribute('class'), /is-alert/);
      assert.equal(await storedDone(page, 'fa-d02'), false);
    },
    { viewport: PHONE },
  );
});

test('reduced motion: blocked Day complete does not shake but still explains', TIMEOUT, async () => {
  await withPage(
    BLOCKED,
    async (page) => {
      const btn = page.getByTestId('complete-button');
      await btn.scrollIntoViewIfNeeded();
      await btn.click({ force: true }); // Playwright 는 aria-disabled 버튼을 기다리므로 실제 사용자처럼 바로 누른다
      assert.equal(await btn.evaluate((el) => el.getAnimations().filter((a) => a.id === 'shake').length), 0);
      assert.match(await page.locator('#complete-reason').getAttribute('class'), /is-alert/);
      const text = await page.locator('#complete-reason').innerText();
      await eventually(async () => assert.equal(await liveText(page), text));
    },
    { viewport: PHONE, reducedMotion: 'reduce' },
  );
});

test('checklist keeps partial checks after reload and toggles with Space', TIMEOUT, async () => {
  await withPage(
    '#/day/fa-d01',
    async (page) => {
      const boxes = page.locator('.lesson-body input[type="checkbox"][data-check]');
      const n = await boxes.count();
      await boxes.nth(1).focus();
      await page.keyboard.press('Space');
      await page.reload();
      await boxes.first().waitFor();
      assert.deepEqual(await boxes.evaluateAll((els) => els.map((b) => b.checked)), Array.from({ length: n }, (_, i) => i === 1));
      assert.equal(await page.locator('#completion-status').innerText(), `체크리스트 1 / ${n}`);
    },
    { viewport: PHONE },
  );
});

test('day controls are reachable by Tab in order', TIMEOUT, async () => {
  await withPage(
    '#/day/fa-d01',
    async (page) => {
      const want = await page.evaluate(() => {
        const mark = (el, name) => el && el.setAttribute('data-tab-probe', name);
        mark(document.querySelector('.quest-mini > summary'), 'quest');
        mark(document.querySelector('details.answer > summary'), 'answer');
        mark(document.querySelector('.lesson-body [data-expand-all]'), 'expand');
        mark(document.querySelector('.lesson-body details.ts-entry > summary'), 'symptom');
        document.querySelectorAll('.lesson-body input[data-check]').forEach((b, i) => mark(b, `check${i}`));
        mark(document.querySelector('[data-testid="complete-button"]'), 'complete');
        mark(document.querySelector('.nav-card.nav-prev'), 'prev');
        mark(document.querySelector('.nav-card.nav-next'), 'next');
        return [...document.querySelectorAll('[data-tab-probe]')].map((el) => el.getAttribute('data-tab-probe'));
      });
      assert.ok(want.length >= 9, want.join(','));
      await page.locator('main h1').focus();
      const seen = [];
      for (let i = 0; i < 200 && seen.length < want.length; i++) {
        await page.keyboard.press('Tab');
        const probe = await page.evaluate(() => document.activeElement?.getAttribute('data-tab-probe'));
        if (probe && !seen.includes(probe)) seen.push(probe);
      }
      assert.deepEqual(seen, want);
    },
    { viewport: PHONE },
  );
});

// ───────── Day 아래쪽·정답·체크리스트 모양 (M10, DESIGN.md "Day 부품") ─────────

/** CSS 변수의 계산된 색 (probe 요소 바탕색으로 읽는다) */
const tokenColor = (page, name) =>
  page.evaluate((n) => {
    const probe = document.createElement('i');
    probe.style.backgroundColor = `var(${n})`;
    document.body.append(probe);
    const v = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return v;
  }, name);

test('day foot follows DESIGN tokens', TIMEOUT, async () => {
  for (const viewport of [PHONE, { width: 1280, height: 800 }]) {
    await withPage(
      '#/day/fa-d01',
      async (page) => {
        const rule = await tokenColor(page, '--color-rule');
        const s = await page.evaluate(() => {
          const cs = (sel) => getComputedStyle(document.querySelector(sel));
          const cards = [...document.querySelectorAll('.nav-card')].map((el) => el.getBoundingClientRect());
          return {
            footLine: cs('.lesson-foot').borderTopWidth,
            footColor: cs('.lesson-foot').borderTopColor,
            cardBorder: cs('.completion').borderTopWidth,
            cardRadius: cs('.completion').borderTopLeftRadius,
            navBorder: cs('.nav-card').borderTopWidth,
            sameColumn: Math.abs(cards[0].left - cards[1].left) < 1,
            task: Math.min(...[...document.querySelectorAll('.lesson-body li.task')].map((el) => el.getBoundingClientRect().height)),
          };
        });
        assert.equal(s.footLine, '1px');
        assert.equal(s.footColor, rule);
        assert.equal(s.cardBorder, '2px');
        assert.equal(s.cardRadius, '12px');
        assert.equal(s.navBorder, '2px');
        assert.equal(s.sameColumn, viewport.width < 640, `이전·다음 칸 (${viewport.width}px)`);
        assert.ok(s.task >= 44, `체크리스트 행 ${s.task}px`);
      },
      { viewport },
    );
  }
});

test('answer summary rotates its chevron when open', TIMEOUT, async () => {
  await withPage(
    '#/day/fa-d01',
    async (page) => {
      const summary = page.locator('details.answer > summary').first();
      assert.ok((await summary.boundingBox()).height >= 48);
      await summary.click();
      await page.getByTestId('answer-gate-confirm').click();
      await eventually(async () => {
        const t = await page.locator('details.answer .answer-chev').first().evaluate((el) => getComputedStyle(el).transform);
        const [a, b] = t.match(/matrix\(([^)]+)\)/)[1].split(',').map(Number);
        assert.ok(Math.abs(a + 1) < 0.01 && Math.abs(b) < 0.01, `180° 회전 ${t}`);
      });
    },
    { viewport: PHONE },
  );
});

test('completed day card uses success colors', TIMEOUT, async () => {
  await withPage(
    '#/day/fa-d01',
    async (page) => {
      const ok = await tokenColor(page, '--color-success-bg');
      const btn = page.getByTestId('complete-button');
      await btn.scrollIntoViewIfNeeded();
      await btn.click();
      const bg = await page.locator('.completion.is-done').evaluate((el) => getComputedStyle(el).backgroundColor);
      assert.equal(bg, ok);
    },
    { viewport: PHONE },
  );
});

// ───────── 게임 틀 (DESIGN.md The Game Frame Rule) ─────────

test('day head shows a reward chip worth the day minutes', TIMEOUT, async () => {
  await withPage('#/day/fa-d01', async (page) => {
    const cur = await curriculum(page);
    const day = cur.projects.find((p) => p.id === 'fa').days.find((d) => d.id === 'fa-d01');
    const chip = page.locator('.lesson-chips > li.chip-reward');
    assert.equal((await chip.innerText()).trim(), `보상 +${day.minutes} XP`);
    assert.equal(await chip.locator('svg.px-coin').count(), 1);
    const order = await page.locator('.lesson-chips > li').evaluateAll((els) => els.map((el) => el.className));
    assert.ok(order.indexOf('chip-reward') === 3 && order.at(-1).includes('lesson-status'), order.join(','));
  });
});

test('quest log steps have tile numbers and a pixel cursor on the current step', TIMEOUT, async () => {
  await withPage('#/day/fa-d01', async (page) => {
    const ink = await tokenColor(page, '--color-ink');
    const card = await tokenColor(page, '--color-card');
    const progress = await tokenColor(page, '--color-progress');
    await page.evaluate(() => window.scrollTo(0, document.querySelectorAll('.lesson-body > h2[id]')[1].offsetTop));
    await eventually(async () => {
      const items = await page.locator('.quest-log .quest-item').evaluateAll((els) =>
        els.map((el) => {
          const no = el.querySelector('.quest-no');
          const cursor = el.querySelector('.quest-cursor');
          const r = no.getBoundingClientRect();
          return {
            no: no.textContent,
            size: [Math.round(r.width), Math.round(r.height)],
            bg: getComputedStyle(no).backgroundColor,
            current: el.getAttribute('aria-current') === 'step',
            cursorShown: getComputedStyle(cursor).visibility === 'visible',
            arrow: cursor.querySelectorAll('svg.px-arrow').length,
            nameSize: getComputedStyle(el.querySelector('.quest-name')).fontSize,
          };
        }),
      );
      assert.ok(items.length > 2);
      items.forEach((it, i) => {
        assert.equal(it.no, String(i + 1));
        assert.deepEqual(it.size, [22, 22]);
        assert.equal(it.arrow, 1);
        assert.equal(it.nameSize, '15px', `제목 글자 (${i + 1})`);
        assert.equal(it.cursorShown, it.current, `커서는 지금 단계에만 (${i + 1})`);
        assert.equal(it.bg, it.current ? ink : card, `번호 칸 면 (${i + 1})`);
        assert.notEqual(it.bg, progress, '읽은 단계를 초록으로 칠하지 않는다');
      });
      assert.equal(items.filter((it) => it.current).length, 1);
    });
  });
});

test('checklist boxes are pixel tiles that turn green with a pixel check', TIMEOUT, async () => {
  await withPage(
    '#/day/fa-d01',
    async (page) => {
      const progress = await tokenColor(page, '--color-progress');
      const card = await tokenColor(page, '--color-card');
      const box = page.locator('li.task input[data-check]').first();
      await box.scrollIntoViewIfNeeded();
      const read = () =>
        box.evaluate((el) => {
          const r = el.getBoundingClientRect();
          const check = el.closest('li').querySelector('.task-check');
          return {
            appearance: getComputedStyle(el).appearance,
            size: [Math.round(r.width), Math.round(r.height)],
            bg: getComputedStyle(el).backgroundColor,
            check: check ? getComputedStyle(check).visibility : 'missing',
            px: check?.querySelectorAll('svg.px-check').length ?? 0,
          };
        });
      let s = await read();
      assert.equal(s.appearance, 'none');
      assert.deepEqual(s.size, [22, 22]);
      assert.equal(s.bg, card);
      assert.equal(s.check, 'hidden');
      assert.equal(s.px, 1);
      await box.click();
      await eventually(async () => {
        s = await read();
        assert.equal(s.bg, progress);
        assert.equal(s.check, 'visible');
      });
    },
    { viewport: PHONE },
  );
});

test('completion card has a quest label and a checklist tile bar that follows checks', TIMEOUT, async () => {
  await withPage(
    '#/day/fa-d01',
    async (page) => {
      const label = page.locator('.completion .completion-label');
      assert.equal((await label.innerText()).trim(), '퀘스트 완료 조건');
      assert.equal(await label.locator('svg.px-trophy').count(), 1);
      const bar = page.locator('.completion .check-bar');
      assert.equal(await bar.getAttribute('aria-hidden'), 'true');
      const vars = () => bar.evaluate((el) => [el.style.getPropertyValue('--n'), Number(el.style.getPropertyValue('--p'))]);
      assert.deepEqual(await vars(), ['3', 0]);
      await page.locator('li.task input[data-check]').first().click();
      await eventually(async () => {
        const [n, p] = await vars();
        assert.equal(n, '3');
        assert.ok(Math.abs(p - 1 / 3) < 0.001, String(p));
      });
    },
    { viewport: PHONE },
  );
});

test('cleared day card says 퀘스트 클리어 and shows the XP reward', TIMEOUT, async () => {
  await withPage(
    '#/day/fa-d01',
    async (page) => {
      const btn = page.getByTestId('complete-button');
      await btn.scrollIntoViewIfNeeded();
      await btn.click();
      const label = page.locator('.completion.is-done .completion-label');
      assert.equal((await label.innerText()).trim(), '퀘스트 클리어!');
      assert.equal(await label.locator('svg.px-trophy').count(), 1);
      const reward = page.locator('.completion.is-done .completion-reward');
      assert.equal((await reward.innerText()).trim(), '보상 +60 XP 획득');
      assert.equal(await reward.locator('svg.px-coin').count(), 1);
      assert.equal(await page.locator('.completion.is-done .check-bar').count(), 0);
    },
    { viewport: PHONE },
  );
});

test('prev and next cards sit on a ledge and press down', TIMEOUT, async () => {
  await withPage(
    '#/day/fa-d01',
    async (page) => {
      const rule = await tokenColor(page, '--color-rule');
      const next = page.locator('.nav-card.nav-next');
      await next.scrollIntoViewIfNeeded();
      const shadow = await next.evaluate((el) => getComputedStyle(el).boxShadow);
      assert.ok(shadow.startsWith(`${rule} 0px 4px 0px`), shadow);
      const box = await next.boundingBox();
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await eventually(async () => {
        const t = await next.evaluate((el) => getComputedStyle(el).transform);
        assert.equal(t, 'matrix(1, 0, 0, 1, 0, 3)');
      });
      await page.mouse.move(0, 0);
      await page.mouse.up();
    },
    { viewport: PHONE },
  );
});
