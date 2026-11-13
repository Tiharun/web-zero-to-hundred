// 월드 페이지·부록 페이지 e2e(M7): 월드 페이지, 부록 머리, 용어 색인, 문제 해결 목차·Accordion.
// 모양·문구는 DESIGN.md(월드 페이지, 부록 머리, 목차 카드, 증상 Accordion)와 M7 계획서를 따른다. 실행: cd textbook && npm run test:e2e
// 픽스처를 복사해 고친다: fa-d02 는 파일을 지워 "준비 중"으로 만들고, 용어 사전에 라틴 글자 용어(API)를 더한다.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { appendFile, cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
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
  await appendFile(path.join(content, 'glossary', 'fixture.md'), '\n### API\n- 처음 등장: [Day 1](#/day/fa-d01)\n\n프로그램끼리 주고받는 약속이에요.\n');
  // 문제 해결 페이지: Day 1·Day 2 증상 하나씩(Day 2 는 아주 긴 제목), 관련 줄 없는 증상 하나
  const file = path.join(content, 'curriculum.json');
  const cur = JSON.parse(await readFile(file, 'utf8'));
  cur.pages.push({ id: 'troubleshooting', title: '문제 해결 모음', meta: '증상 {n}가지와 해결 방법', generated: 'troubleshooting' });
  await writeFile(file, JSON.stringify(cur));
  await mkdir(path.join(content, 'troubleshooting'));
  await writeFile(
    path.join(content, 'troubleshooting', 'fa.md'),
    [
      '### 화면이 하얘요\n- 관련: [Day 1](#/day/fa-d01)\n\n저장했는지 확인해요.\n',
      '### `npm` 이 안 돼요: 터미널에 명령을 입력했는데 아무 반응이 없거나 알 수 없는 명령이라는 오류가 나와요 (아주 긴 제목)\n- 관련: [Day 2](#/day/fa-d02)\n\n터미널을 새로 열어요.\n',
      '### 그 밖의 증상 하나\n관련 Day 가 없는 증상이에요.\n',
    ].join('\n'),
  );
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
    // 보상 XP 는 Day 예상 시간의 합(60 + 90), 머리 글자는 트로피 도트 아이콘과 함께
    assert.equal(await world.locator('.world-xp').innerText(), '+150 XP');
    assert.equal(await world.locator('.world-outcome-head .px').count(), 1);
  });
});

test('a done day turns green and the meter shows the real ratio', TIMEOUT, async () => {
  await withPage(
    '#/project/fa',
    async (page) => {
      const done = page.locator('.world-day[data-day="fa-d01"]');
      assert.equal(await done.getAttribute('data-state'), 'done');
      assert.equal(await done.locator('.day-tile .px').count(), 1);
      assert.equal(await page.locator('.world-day[data-day="fa-d02"]').getAttribute('data-state'), 'today');
      const meter = page.locator('.world-outcome .meter');
      assert.equal(await meter.getAttribute('aria-valuenow'), '50');
      assert.match(await page.locator('.world-facts').innerText(), /1 \/ 2 Day 완료/);
      // Day 한 칸씩 끊긴 막대: 채움 무늬는 progress 색, 칸 수는 Day 수
      assert.ok((await css(meter.locator('.meter-fill'), 'backgroundImage')).includes(await tokenColor(page, '--color-progress')));
      assert.equal(await meter.evaluate((el) => el.style.getPropertyValue('--n')), '2');
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
    // Day 칸은 보드게임 칸과 같은 크기와 턱
    const tile = page.locator('.world-day.is-today .day-tile');
    assert.equal(await css(tile, 'backgroundColor'), await tokenColor(page, '--color-accent'));
    assert.equal(await css(tile, 'width'), '34px');
    assert.match(await css(tile, 'boxShadow'), /\b3px\b/);
    assert.equal(await css(page.locator('.world-day.is-draft .day-tile'), 'borderTopStyle'), 'dashed');
    const meter = page.locator('.world-outcome .meter');
    assert.equal(await css(meter, 'borderTopLeftRadius'), '6px');
  });
});

// ───────── 부록 머리·용어 색인 ─────────

test('appendix pages share one head: dot art, title and description', TIMEOUT, async () => {
  await withPage('#/page/start', async (page) => {
    const head = page.locator('.page-article .page-head');
    assert.equal(await head.locator('.badge > .page-art').count(), 1, '그림은 월드 문장과 같은 칸 안에');
    assert.equal(await head.locator('h1').innerText(), '시작하기');
    assert.equal(await head.locator('.lead').innerText(), '교재 쓰는 법, 공부 원칙, 준비물');
  });
  await withPage('#/page/glossary', async (page) => {
    const head = page.locator('.page-article .page-head');
    assert.equal(await head.locator('.page-art').count(), 1);
    assert.equal(await head.locator('.lead').innerText(), '용어 3개를 한 줄 정의로');
  });
  await withPage('#/page/secret', async (page) => {
    assert.equal(await page.locator('.page-head').count(), 0, '잠긴 페이지는 잠금 화면이에요');
  });
  await withPage(
    '#/page/secret',
    async (page) => {
      const head = page.locator('.page-article .page-head');
      assert.equal(await head.locator('h1').innerText(), '비밀 페이지');
      assert.equal(await head.locator('.page-art').count(), 0, '그림이 없는 페이지는 그림 없이 같은 머리');
      assert.equal(await head.locator('.lead').count(), 0);
    },
    { progress: ['fa-d01', 'fa-d02', 'fb-d01'] },
  );
});

test('the glossary index jumps to a group and a term link lands on the term', TIMEOUT, async () => {
  await withPage(
    '#/page/glossary',
    async (page) => {
      const links = page.locator('.gl-index a');
      assert.deepEqual(await links.allInnerTexts(), ['ㄱ', 'ㅍ', 'A']);
      // 색인 열쇠: 2px 테두리 + 3px 턱(보드게임 칸)
      assert.equal(await css(links.first(), 'borderTopWidth'), '2px');
      assert.match(await css(links.first(), 'boxShadow'), /\b3px\b/);
      assert.equal(await page.locator('#gl-en-a .gl-head .label').innerText(), '용어 1개');
      await links.filter({ hasText: 'A' }).click();
      await page.waitForURL(/#\/page\/glossary\/gl-en-a$/);
      const bar = await page.locator('.topbar').boundingBox();
      await eventually(async () => {
        const box = await page.locator('#gl-en-a').boundingBox();
        assert.ok(box.y >= bar.y + bar.height, `묶음이 상단 바 아래에 보여요 (${box.y})`);
        assert.ok(box.y < 800);
      });
      assert.equal(await page.locator('#gl-en-a.is-target').count(), 0, '묶음 전체는 찾아온 항목 띠를 쓰지 않아요');
    },
    { viewport: { width: 1280, height: 800 } },
  );
  // 움직임 줄이기: 띠가 사라지는 애니메이션 없이 표시만 남아 색을 확실히 읽는다
  await withPage(
    '#/page/glossary/term-api',
    async (page) => {
      const entry = page.locator('#term-api.is-target');
      assert.equal(await entry.count(), 1);
      assert.equal(await css(entry, 'backgroundColor'), await tokenColor(page, '--color-track'));
    },
    { reducedMotion: 'reduce' },
  );
});

// ───────── 문제 해결 목차·증상 Accordion ─────────

test('troubleshooting shows a toc and symptoms open one by one', TIMEOUT, async () => {
  await withPage('#/page/troubleshooting', async (page) => {
    const toc = page.locator('.ts-toc');
    assert.equal(await toc.locator('.ts-toc-world > a').count(), 1);
    assert.deepEqual(await toc.locator('li a').allInnerTexts(), ['Day 1', 'Day 2', '그 밖의 증상']);
    // 월드 제목에는 문장 칸, Day 묶음 제목에는 Day 칸(번호). 화면 낭독기 이름은 "Day n · 제목"
    assert.equal(await page.locator('.ts-group > h2 .badge .emblem').count(), 1);
    const dayHead = page.locator('.ts-day > h3').first();
    assert.equal(await dayHead.locator('.day-tile').innerText(), '1');
    assert.match(await css(dayHead.locator('.day-tile'), 'boxShadow'), /\b3px\b/);
    assert.match(await page.getByRole('heading', { level: 3, name: /^Day 1 · / }).innerText(), /첫 번째 Day/);
    const entries = page.locator('.ts-entry');
    assert.equal(await entries.count(), 3);
    assert.equal(await page.locator('.ts-entry[open]').count(), 0);
    const first = entries.first();
    await first.locator('summary').click();
    assert.equal(await first.evaluate((el) => el.open), true);
    assert.equal(await first.locator('.ts-body').isVisible(), true);
    await first.locator('summary').click();
    assert.equal(await first.evaluate((el) => el.open), false);
    const second = entries.nth(1);
    await second.locator('summary').focus();
    await page.keyboard.press('Enter');
    assert.equal(await second.evaluate((el) => el.open), true);
  });
});

test('expand all opens every symptom and the label follows', TIMEOUT, async () => {
  await withPage('#/page/troubleshooting', async (page) => {
    const btn = page.locator('.page-head [data-expand-all]');
    assert.equal(await btn.innerText(), '모두 펼치기');
    await btn.click();
    assert.equal(await page.locator('.ts-entry[open]').count(), 3);
    await eventually(async () => assert.equal(await btn.innerText(), '모두 접기'));
    await btn.click();
    assert.equal(await page.locator('.ts-entry[open]').count(), 0);
    await eventually(async () => assert.equal(await btn.innerText(), '모두 펼치기'));
    await btn.click();
    await page.locator('.ts-entry').first().locator('summary').click();
    await eventually(async () => assert.equal(await btn.innerText(), '모두 펼치기'));
  });
});

test('a deep link opens and scrolls to that symptom', TIMEOUT, async () => {
  await withPage('#/page/troubleshooting/ts-fa-d02-1', async (page) => {
    const entry = page.locator('#ts-fa-d02-1');
    assert.equal(await entry.evaluate((el) => el.open), true);
    assert.equal(await entry.evaluate((el) => el.classList.contains('is-target')), true);
    const bar = await page.locator('.topbar').boundingBox();
    await eventually(async () => {
      const box = await entry.boundingBox();
      assert.ok(box.y >= bar.y + bar.height && box.y < 800, `증상이 상단 바 아래 화면 안에 있어요 (${box.y})`);
    });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator('.ts-toc li a', { hasText: 'Day 2' }).click();
    await page.waitForURL(/#\/page\/troubleshooting\/ts-fa-d02$/);
    await eventually(async () => {
      const box = await page.locator('#ts-fa-d02').boundingBox();
      assert.ok(box.y >= bar.y + bar.height && box.y < 800, `Day 묶음이 화면 안에 있어요 (${box.y})`);
    });
  });
});

test('an unknown anchor opens the page at the top with everything closed', TIMEOUT, async () => {
  for (const hash of ['#/page/troubleshooting/nope', '#/page/troubleshooting/main']) {
    await withPage(hash, async (page) => {
      await page.locator('.ts-entry').first().waitFor();
      assert.equal(await page.evaluate(() => window.scrollY), 0, hash);
      assert.equal(await page.locator('.ts-entry[open]').count(), 0, hash);
      assert.equal(await page.locator('.is-target').count(), 0, hash);
    });
  }
});

test('reduced motion: a symptom opens with no animation', TIMEOUT, async () => {
  await withPage(
    '#/page/troubleshooting',
    async (page) => {
      const entry = page.locator('.ts-entry').first();
      await entry.locator('summary').click();
      assert.equal(await entry.evaluate((el) => el.open), true);
      const running = await entry.locator('.ts-body').evaluate((el) => el.getAnimations().filter((a) => a.playState === 'running').length);
      assert.equal(running, 0);
    },
    { reducedMotion: 'reduce' },
  );
});

test('world and appendix pages have no sideways scroll from 320px up', TIMEOUT, async () => {
  for (const width of [320, 375, 768, 1280]) {
    for (const hash of ['#/project/fa', '#/page/start', '#/page/glossary', '#/page/troubleshooting']) {
      await withPage(
        hash,
        async (page) => {
          if (hash.endsWith('troubleshooting')) {
            await page.locator('.page-head [data-expand-all]').click();
            assert.equal(await page.locator('.ts-entry[open]').count(), 3);
          }
          const { sw, cw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
          assert.ok(sw <= cw, `${hash} @${width}px: scrollWidth ${sw} > ${cw}`);
        },
        { viewport: { width, height: 800 } },
      );
    }
  }
});
