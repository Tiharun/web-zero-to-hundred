// 교재 앱 e2e: 작은 픽스처 교재를 임시 폴더의 index.html 로 빌드해서 file:// 로 연다.
// 실행: cd textbook && npm run test:e2e
// 테스트마다 새 브라우저 컨텍스트(깨끗한 localStorage)를 쓰고, 끝에서 콘솔 오류가 하나도 없어야 한다.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, rm, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { build } from '../../textbook/build.mjs';
import { STORAGE_KEY } from '../../textbook/src/app/progress.js';
import { launch, collectConsoleErrors } from '../helpers/browser.mjs';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const FIXTURE = path.join(ROOT, 'tests', 'fixtures', 'content');
const SECRET = '비밀단어zz';
const TIMEOUT = { timeout: 90_000 };

let tmp;
let browser;
let INDEX_URL; // file:///.../index.html
let VARIANT_URL; // 특별 과정과 "준비 중" Day 가 있는 변형 교재

async function buildTo(file, { contentDir, allowMissing = false }) {
  const r = await build({ contentDir, allowMissing });
  assert.equal(r.ok, true, JSON.stringify(r.errors));
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, r.html);
  return pathToFileURL(file).href;
}

before(async () => {
  tmp = await mkdtemp(path.join(tmpdir(), 'wzh-e2e-'));
  INDEX_URL = await buildTo(path.join(tmp, 'main', 'index.html'), { contentDir: FIXTURE });

  // 변형: 메인 과정과 따로 세는 특별 과정 fs(2 Day, 둘째는 파일이 없어 "준비 중") — fa 를 끝내야 열린다
  const content = path.join(tmp, 'variant-content');
  await cp(FIXTURE, content, { recursive: true });
  const curFile = path.join(content, 'curriculum.json');
  const cur = JSON.parse(await readFile(curFile, 'utf8'));
  cur.projects.push({
    id: 'fs',
    order: 3,
    track: 'special',
    title: '특별 프로젝트',
    subtitle: '메인과 따로 세는 과정',
    folder: 'C:\\dev\\fixture-s',
    stack: ['HTML'],
    requires: ['fa'],
    summary: '특별 과정이에요.',
    outcome: '특별한 결과물이에요.',
    days: [
      { title: '특별 첫 Day', minutes: 60, summary: '특별 과정의 첫 Day예요.', keywords: ['특별'] },
      { title: '특별 둘째 Day 배포', minutes: 60, summary: '아직 준비 중인 Day예요.', keywords: ['준비'] },
    ],
  });
  await writeFile(curFile, JSON.stringify(cur));
  await mkdir(path.join(content, 'fs'));
  await cp(path.join(content, 'fb', 'day-01.md'), path.join(content, 'fs', 'day-01.md'));
  VARIANT_URL = await buildTo(path.join(tmp, 'variant', 'index.html'), { contentDir: content, allowMissing: true });

  browser = await launch();
});

after(async () => {
  await browser?.close();
  await rm(tmp, { recursive: true, force: true });
});

// ───────────────────────── 도우미 ─────────────────────────

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** 검사가 통과할 때까지 짧게 다시 해 본다 (화면이 그려지길 기다리는 용도) */
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
 * 새 컨텍스트와 페이지를 열어 fn 에 넘기고, 끝에서 콘솔 오류가 없는지 확인한다.
 * init: 페이지 스크립트보다 먼저 실행할 함수(addInitScript, initArg 를 인자로 받는다), viewport/colorScheme: 컨텍스트 옵션
 */
async function withPage(fn, { init, initArg, viewport = { width: 1280, height: 800 }, colorScheme = 'light', url = INDEX_URL } = {}) {
  const context = await browser.newContext({ viewport, colorScheme, locale: 'ko-KR', acceptDownloads: true });
  try {
    if (init) await context.addInitScript(init, initArg);
    const page = await context.newPage();
    const errors = collectConsoleErrors(page);
    // 외부 요청 0건: 교재 파일 자신(file:)과 data:/blob: 말고는 아무 데도 요청하지 않는다
    const external = [];
    page.on('request', (request) => {
      if (!/^(file|data|blob|about):/.test(request.url())) external.push(request.url());
    });
    const app = { url, errors };
    await fn(page, app);
    assert.deepEqual(errors, [], '콘솔 오류가 없어야 해요');
    assert.deepEqual(external, [], '외부 요청이 없어야 해요');
  } finally {
    await context.close();
  }
}

/** 윗줄 테마 메뉴를 열어 하나를 고른다 ('system' | 'light' | 'dark') */
async function pickTheme(page, value) {
  await page.getByTestId('theme-toggle').click();
  await page.locator(`#theme-menu [data-theme-value="${value}"]`).click();
}

// 주소의 한글은 브라우저가 %XX 로 바꿔 두므로, 둘 다 풀어서 견준다
const waitRoute = (page, hash) =>
  page.waitForFunction(
    (h) => {
      const decode = (s) => {
        try {
          return decodeURIComponent(s);
        } catch {
          return s;
        }
      };
      return decode(document.getElementById('main')?.dataset.hash ?? '') === decode(h);
    },
    hash,
    { timeout: 10_000 },
  );

/** 처음이면 주소를 열고, 이미 열려 있으면 해시만 바꾼다. 화면이 그려질 때까지 기다린다 */
async function visit(page, app, hash) {
  if (page.url() === 'about:blank') await page.goto(app.url + hash);
  else await page.evaluate((h) => { location.hash = h; }, hash);
  await waitRoute(page, hash);
}

/** 조건 함수가 참을 돌려줄 때까지 기다린다 (eventually 는 예외가 날 때만 다시 시도한다) */
const until = (fn) => eventually(async () => assert.ok(await fn()));
const sidebarState = (page, dayId) => page.locator(`#sidebar [data-day="${dayId}"]`).getAttribute('data-state');
const stat = (page, name) => page.locator(`[data-testid="level-panel"] [data-stat="${name}"] dd`).innerText();
const xpNow = (page) => page.locator('[data-testid="level-panel"] .xp-bar').getAttribute('aria-valuenow');

/** Day 화면에서 [완료]를 누른다 */
async function completeDay(page, dayId) {
  await page.getByTestId('complete-button').click();
  await page.getByTestId('uncomplete-button').waitFor();
  assert.equal(await sidebarState(page, dayId), 'done');
}

/** 저장소에 진도를 미리 넣는다 (withPage 의 init/initArg 로 넘긴다) */
const seed = (completed, { lastDay = completed.at(-1) ?? null, checks = {} } = {}) => ({
  init: ([key, value]) => localStorage.setItem(key, value),
  initArg: [STORAGE_KEY, JSON.stringify({ version: 1, completed: Object.fromEntries(completed.map((id) => [id, '2026-11-12T00:00:00.000Z'])), checks, lastDay, theme: 'system' })],
});
const quest = (page) => page.getByTestId('quest-card');

// ───────────────────────── 요구된 테스트 ─────────────────────────

test('home quest goes to fa-d01', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/');
    await quest(page).waitFor();

    const link = page.getByTestId('continue-button');
    assert.equal(await link.getAttribute('href'), '#/day/fa-d01');
    await link.click();
    await waitRoute(page, '#/day/fa-d01');
    assert.match(await page.locator('main h1').innerText(), /첫 번째 Day/);
    assert.equal(await sidebarState(page, 'fa-d01'), 'today');
    assert.equal(await sidebarState(page, 'fa-d02'), 'open');
    assert.equal(await sidebarState(page, 'fb-d01'), 'locked');
  });
});

test('complete flow unlocks next project', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/day/fa-d01');
    const boxes = page.locator('main input[type="checkbox"][data-check]');
    assert.equal(await boxes.count(), 3);
    for (let i = 0; i < 3; i++) await boxes.nth(i).check();
    assert.equal(await page.locator('main input[data-check]:checked').count(), 3);

    await page.getByTestId('complete-button').click();
    await page.getByTestId('uncomplete-button').waitFor();
    assert.equal(await page.getByTestId('complete-button').count(), 0, '완료한 Day 에는 완료 버튼이 없어요');
    assert.equal(await page.getByTestId('unlock-banner').count(), 0, 'fa 를 아직 다 끝내지 않았어요');
    assert.equal(await sidebarState(page, 'fa-d01'), 'done');
    assert.equal(await sidebarState(page, 'fa-d02'), 'today');
    assert.equal(await sidebarState(page, 'fb-d01'), 'locked');

    // 체크 상태와 완료는 새로고침해도 남는다
    await page.reload();
    await waitRoute(page, '#/day/fa-d01');
    assert.equal(await page.locator('main input[data-check]:checked').count(), 3);
    assert.equal(await sidebarState(page, 'fa-d01'), 'done');

    await page.locator('.day-nav a[rel="next"]').click();
    await waitRoute(page, '#/day/fa-d02');
    await page.getByTestId('complete-button').click();
    const banner = page.getByTestId('unlock-banner');
    await banner.waitFor();
    assert.match(await banner.innerText(), /픽스처 프로젝트 B/);
    assert.equal(await sidebarState(page, 'fb-d01'), 'today');

    // 홈: 3 Day 중 2 Day, XP 60+90, 이어서 하기는 fb-d01
    await page.getByRole('link', { name: '홈', exact: true }).first().click();
    await waitRoute(page, '#/');
    assert.equal(await stat(page, 'days'), '2 / 3');
    assert.equal(await xpNow(page), '150');
    assert.equal(await page.getByTestId('continue-button').getAttribute('href'), '#/day/fb-d01');
  });
});

test('complete disabled until previous done', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/day/fa-d02');
    const button = page.getByTestId('complete-button');
    await button.waitFor();
    assert.equal(await button.isDisabled(), true);
    const reasonId = await button.getAttribute('aria-describedby');
    assert.ok(reasonId, '버튼이 이유 문구와 연결돼 있어야 해요');
    const reason = await page.locator(`#${reasonId}`).innerText();
    assert.match(reason, /Day 1/);
    assert.match(reason, /먼저/);
    assert.equal(await page.getByTestId('uncomplete-button').count(), 0);
  });
});

test('locked deep link shows lock screen', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/day/fb-d01');
    const lock = page.getByTestId('lock-screen');
    await lock.waitFor();
    const text = await lock.innerText();
    assert.match(text, /픽스처 프로젝트 A/, '해금 조건이 보여야 해요');
    assert.ok(!(await page.locator('body').innerText()).includes(SECRET), '잠긴 본문이 화면에 있으면 안 돼요');
    assert.ok(!(await page.locator('main').innerHTML()).includes(SECRET), '잠긴 본문이 main 에 붙으면 안 돼요');
    assert.equal(await page.locator('main input[data-check]').count(), 0);
    assert.equal(await page.getByTestId('complete-button').count(), 0);

    // 잠긴 프로젝트·페이지도 같은 잠금 화면이다
    await visit(page, app, '#/project/fb');
    await page.getByTestId('lock-screen').waitFor();
    await visit(page, app, '#/page/secret');
    await page.getByTestId('lock-screen').waitFor();
    assert.ok(!(await page.locator('body').innerText()).includes('비밀페이지zz'));
  });
});

test('storage unavailable banner', TIMEOUT, async () => {
  await withPage(
    async (page, app) => {
      await visit(page, app, '#/');
      await quest(page).waitFor();
      const banner = page.getByTestId('storage-banner');
      await banner.waitFor({ state: 'visible' });
      assert.match(await banner.innerText(), /저장되지 않아요/);

      // 저장은 못 해도 이번 방문 동안은 메모리로 정상 동작한다
      await page.getByTestId('continue-button').click();
      await waitRoute(page, '#/day/fa-d01');
      await completeDay(page, 'fa-d01');
      assert.equal(await sidebarState(page, 'fa-d02'), 'today');
      assert.equal(await banner.isVisible(), true);
    },
    {
      init: () => {
        Object.defineProperty(window, 'localStorage', {
          configurable: true,
          get() {
            throw new DOMException('access denied', 'SecurityError');
          },
        });
      },
    },
  );
});

test('corrupt backup keeps progress', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    let dialogs = 0;
    page.on('dialog', (dialog) => {
      dialogs++;
      return dialog.dismiss();
    });
    await visit(page, app, '#/day/fa-d01');
    await completeDay(page, 'fa-d01');

    await page.locator('#settings-link').click();
    await waitRoute(page, '#/settings');
    await page.getByTestId('import-input').setInputFiles({
      name: 'other.json',
      mimeType: 'application/json',
      buffer: Buffer.from('{"app":"other"}'),
    });
    const message = page.getByTestId('import-message');
    await message.waitFor({ state: 'visible' });
    assert.match(await message.innerText(), /백업 파일이 아니에요/);
    assert.equal(dialogs, 0, '오류인 파일은 덮어쓸지 묻지도 않아요');

    // JSON 이 아닌 파일도 같은 방식으로 거절한다
    await page.getByTestId('import-input').setInputFiles({ name: 'broken.json', mimeType: 'application/json', buffer: Buffer.from('{oops') });
    await eventually(async () => assert.match(await message.innerText(), /JSON 파일이 아니에요/));

    assert.equal(await sidebarState(page, 'fa-d01'), 'done');
    await page.reload();
    await waitRoute(page, '#/settings');
    assert.equal(await sidebarState(page, 'fa-d01'), 'done', '새로고침 뒤에도 진도가 남아 있어요');
  });
});

test('answer gate', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/day/fa-d01');
    const details = page.locator('details.answer');
    const body = details.locator('.answer-body');
    assert.equal(await details.count(), 1);
    assert.equal(await body.isVisible(), false);
    assert.equal(await page.getByTestId('answer-gate').count(), 0);

    await details.locator('summary').click();
    const gate = page.getByTestId('answer-gate');
    await gate.waitFor({ state: 'visible' });
    assert.match(await gate.innerText(), /먼저 직접 풀어/);
    assert.equal(await details.evaluate((el) => el.open), false, '확인하기 전에는 열리지 않아요');
    assert.equal(await body.isVisible(), false);
    assert.equal(await page.locator('main .btn-primary').count(), 1, '게이트가 떠도 주 버튼은 Day 완료 하나 (One Pink)');

    // 다시 눌러도 게이트가 늘어나지 않고 그대로다
    await details.locator('summary').click();
    assert.equal(await page.getByTestId('answer-gate').count(), 1);
    assert.equal(await details.evaluate((el) => el.open), false);

    await page.getByTestId('answer-gate-confirm').click();
    await body.waitFor({ state: 'visible' });
    assert.equal(await details.evaluate((el) => el.open), true);
    assert.equal(await page.getByTestId('answer-gate').count(), 0);
    assert.match(await body.innerText(), /속성 이름만 바꾸면/);

    // 한 번 확인한 정답은 접었다 펼쳐도 묻지 않는다 (세션 메모리에만 기록)
    await details.locator('summary').click();
    assert.equal(await details.evaluate((el) => el.open), false);
    await details.locator('summary').click();
    assert.equal(await details.evaluate((el) => el.open), true);
    assert.equal(await page.getByTestId('answer-gate').count(), 0);

    // 새로고침하면 기록이 사라져 다시 묻는다
    await page.reload();
    await waitRoute(page, '#/day/fa-d01');
    await page.locator('details.answer summary').click();
    await page.getByTestId('answer-gate').waitFor();

    // "조금 더 풀어 볼게요" 는 게이트만 닫는다
    await page.getByTestId('answer-gate').getByRole('button', { name: /조금 더/ }).click();
    assert.equal(await page.getByTestId('answer-gate').count(), 0);
    assert.equal(await page.locator('details.answer').evaluate((el) => el.open), false);
  });
});

test('search hides locked snippet', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/');
    await page.locator('#search-open').click(); // 검색칸은 검색 화면에 있다
    await waitRoute(page, '#/search');
    const input = page.getByTestId('search-input');

    await input.fill(SECRET);
    await waitRoute(page, `#/search?q=${encodeURIComponent(SECRET)}`);
    const locked = page.locator('[data-testid="search-result"][data-id="fb-d01"]');
    await locked.waitFor();
    assert.equal(await locked.getAttribute('data-locked'), 'true');
    assert.equal(await locked.locator('.snippet').count(), 0, '잠긴 결과는 제목만 보여 줘요');
    assert.ok(!(await locked.innerText()).includes(SECRET));
    assert.match(await locked.innerText(), /비밀 Day/);
    assert.equal(await page.getByTestId('search-result').count(), 1);

    // 잠긴 페이지도 같다
    await input.fill('비밀페이지zz');
    await waitRoute(page, `#/search?q=${encodeURIComponent('비밀페이지zz')}`);
    const secretPage = page.locator('[data-testid="search-result"][data-id="secret"]');
    await secretPage.waitFor();
    assert.equal(await secretPage.locator('.snippet').count(), 0);
    assert.ok(!(await secretPage.innerText()).includes('비밀페이지zz'));

    // 열린 프로젝트(fa)의 결과에는 본문 조각이 있다
    await input.fill('복습');
    await waitRoute(page, `#/search?q=${encodeURIComponent('복습')}`);
    const open = page.locator('[data-testid="search-result"][data-id="fa-d02"]');
    await open.waitFor();
    assert.equal(await open.getAttribute('data-locked'), 'false');
    assert.match(await open.locator('.snippet').innerText(), /복습/);
    assert.equal(await open.locator('mark').first().innerText(), '복습');

    // 결과를 누르면 그 Day 로 간다
    await open.locator('a').first().click();
    await waitRoute(page, '#/day/fa-d02');

    // 프로젝트 fa 를 끝내면 같은 검색이 본문 조각을 보여 준다
    await visit(page, app, '#/day/fa-d01');
    await completeDay(page, 'fa-d01');
    await visit(page, app, '#/day/fa-d02');
    await completeDay(page, 'fa-d02');
    await page.locator('#search-open').click();
    await waitRoute(page, '#/search');
    await input.fill(SECRET);
    await waitRoute(page, `#/search?q=${encodeURIComponent(SECRET)}`);
    const unlocked = page.locator('[data-testid="search-result"][data-id="fb-d01"]');
    await unlocked.waitFor();
    assert.equal(await unlocked.getAttribute('data-locked'), 'false');
    assert.match(await unlocked.locator('.snippet').innerText(), new RegExp(SECRET));
  });
});

test('theme persists after reload', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/');
    const root = page.locator('html');
    const bg = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    const lightBg = await bg();
    assert.equal(await root.getAttribute('data-theme'), null, '처음에는 시스템 설정을 따라요');

    await pickTheme(page, 'dark');
    assert.equal(await root.getAttribute('data-theme'), 'dark');
    const darkBg = await bg();
    assert.notEqual(darkBg, lightBg);

    await page.reload();
    await waitRoute(page, '#/');
    assert.equal(await root.getAttribute('data-theme'), 'dark');
    assert.equal(await bg(), darkBg);

    await pickTheme(page, 'light');
    assert.equal(await root.getAttribute('data-theme'), 'light');
    await page.reload();
    await waitRoute(page, '#/');
    assert.equal(await root.getAttribute('data-theme'), 'light');
    assert.equal(await bg(), lightBg);
  });
});

test('no horizontal page scroll at 360px', TIMEOUT, async () => {
  await withPage(
    async (page, app) => {
      await visit(page, app, '#/day/fa-d01');
      await page.locator('figure.code').waitFor();
      const overflowing = () =>
        page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
          // 코드 블록 안쪽을 빼고, 화면 오른쪽 밖으로 나간 요소
          escaped: [...document.querySelectorAll('main *, .topbar *')]
            .filter((el) => !el.closest('pre') && el.getBoundingClientRect().right > window.innerWidth + 0.5)
            .map((el) => el.tagName.toLowerCase() + '.' + el.className),
        }));

      const day = await overflowing();
      assert.ok(day.scrollWidth <= day.innerWidth, `가로 스크롤이 생겼어요: ${day.scrollWidth} > ${day.innerWidth}`);
      assert.deepEqual(day.escaped, []);

      // 긴 코드 줄은 코드 블록 안에서만 스크롤된다
      const pre = await page.locator('figure.code pre').evaluate((el) => ({
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
        overflowX: getComputedStyle(el).overflowX,
      }));
      assert.ok(pre.scrollWidth > pre.clientWidth, '긴 줄이 코드 블록 안에서 스크롤돼야 해요');
      assert.ok(['auto', 'scroll'].includes(pre.overflowX), pre.overflowX);

      for (const hash of ['#/', '#/project/fa', '#/settings', '#/page/start', '#/page/glossary', '#/day/fb-d01', `#/search?q=${encodeURIComponent('Day')}`]) {
        await visit(page, app, hash);
        const r = await overflowing();
        assert.ok(r.scrollWidth <= r.innerWidth, `${hash}: 가로 스크롤 ${r.scrollWidth} > ${r.innerWidth}`);
        assert.deepEqual(r.escaped, [], hash);
      }
    },
    { viewport: { width: 360, height: 740 } },
  );
});

test('copy falls back when clipboard denied', TIMEOUT, async () => {
  await withPage(
    async (page, app) => {
      await visit(page, app, '#/day/fa-d01');
      const button = page.locator('figure.code button.copy');
      assert.equal((await button.innerText()).trim(), '복사');
      await button.click();
      await eventually(async () => assert.equal((await button.innerText()).trim(), '복사됨'));

      // 대체 경로가 실제로 코드를 복사했는지: execCommand 호출 때 선택돼 있던 글자를 확인한다
      const calls = await page.evaluate(() => window.__copyCalls);
      assert.equal(calls.writeText, 1, '먼저 clipboard API 를 시도해요');
      assert.equal(calls.exec.length, 1);
      assert.equal(calls.exec[0].command, 'copy');
      assert.match(calls.exec[0].selected, /^<div data-long="x{300,}"><\/div>$/);
      assert.equal(await page.locator('textarea').count(), 0, '임시 입력칸은 지워져요');

      // 잠시 뒤 원래 글자로 돌아온다
      await eventually(async () => assert.equal((await button.innerText()).trim(), '복사'), 6000);
    },
    {
      init: () => {
        window.__copyCalls = { writeText: 0, exec: [] };
        Object.defineProperty(navigator, 'clipboard', {
          configurable: true,
          value: {
            writeText() {
              window.__copyCalls.writeText++;
              return Promise.reject(new DOMException('denied', 'NotAllowedError'));
            },
          },
        });
        const original = document.execCommand.bind(document);
        document.execCommand = (command, ...rest) => {
          const el = document.activeElement;
          const selected = el && 'value' in el ? el.value.slice(el.selectionStart, el.selectionEnd) : String(getSelection());
          window.__copyCalls.exec.push({ command, selected });
          return original(command, ...rest);
        };
      },
    },
  );
});

test('raw html shown as text', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/day/fa-d01');
    await page.locator('main h1').waitFor();
    assert.equal(await page.locator('main b').count(), 0);
    assert.match(await page.locator('main').innerText(), /<b>굵게아님<\/b>/);
    // 본문 안에서 실행 가능한 요소가 생기지 않는다
    assert.equal(await page.locator('main .lesson-body script, main .lesson-body iframe, main .lesson-body img').count(), 0);
  });
});

test('reset clears progress after confirm', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    const messages = [];
    let accept = false;
    page.on('dialog', (dialog) => {
      messages.push(dialog.message());
      return accept ? dialog.accept() : dialog.dismiss();
    });
    await visit(page, app, '#/day/fa-d01');
    await completeDay(page, 'fa-d01');
    await page.locator('main input[data-check]').first().check();

    await page.locator('#settings-link').click();
    await waitRoute(page, '#/settings');
    await page.getByTestId('reset-button').click(); // 취소
    await eventually(async () => assert.equal(messages.length, 1));
    assert.match(messages[0], /진도/);
    assert.equal(await sidebarState(page, 'fa-d01'), 'done', '취소하면 그대로예요');

    accept = true;
    await page.getByTestId('reset-button').click();
    await waitRoute(page, '#/');
    await page.getByTestId('level-panel').waitFor();
    assert.equal(await stat(page, 'days'), '0 / 3');
    assert.equal(await xpNow(page), '0');
    assert.equal(await sidebarState(page, 'fa-d01'), 'today');
    assert.equal(await page.getByTestId('continue-button').getAttribute('href'), '#/day/fa-d01');

    await page.reload(); // 저장소도 비워졌다
    await waitRoute(page, '#/');
    assert.equal(await stat(page, 'days'), '0 / 3');
    await visit(page, app, '#/day/fa-d01');
    assert.equal(await page.locator('main input[data-check]:checked').count(), 0);
  });
});

test('keyboard reachable', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/day/fa-d01');
    await page.locator('main h1').waitFor();
    const wanted = { sidebarLink: false, checkbox: false, completeButton: false };
    const visibleFocus = [];

    for (let i = 0; i < 60 && !Object.values(wanted).every(Boolean); i++) {
      await page.keyboard.press('Tab');
      const focus = await page.evaluate(() => {
        const el = document.activeElement;
        const style = getComputedStyle(el);
        return {
          sidebarLink: Boolean(el.closest('#sidebar')) && el.matches('a[data-day]'),
          checkbox: el.matches('main input[type="checkbox"][data-check]'),
          completeButton: el.dataset.testid === 'complete-button',
          outlineStyle: style.outlineStyle,
          outlineWidth: parseFloat(style.outlineWidth),
          label: el.tagName.toLowerCase() + (el.dataset.day ? `[${el.dataset.day}]` : ''),
        };
      });
      for (const key of Object.keys(wanted)) {
        if (focus[key]) {
          wanted[key] = true;
          visibleFocus.push(focus);
        }
      }
    }

    assert.deepEqual(wanted, { sidebarLink: true, checkbox: true, completeButton: true }, '키보드 Tab 만으로 닿아야 해요');
    for (const focus of visibleFocus) {
      assert.notEqual(focus.outlineStyle, 'none', `${focus.label}: 포커스 표시가 없어요`);
      assert.ok(focus.outlineWidth >= 2, `${focus.label}: 포커스 표시가 너무 가늘어요 (${focus.outlineWidth}px)`);
    }
  });
});

// ───────────────────────── 더 확인하는 것들 ─────────────────────────

test('valid backup imports only after confirmation and reports skipped days', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    const asked = [];
    let accept = false;
    page.on('dialog', (dialog) => {
      asked.push(dialog.message());
      return accept ? dialog.accept() : dialog.dismiss();
    });
    await visit(page, app, '#/day/fa-d01');
    await completeDay(page, 'fa-d01');
    await visit(page, app, '#/settings');

    // 내보내기: 이 교재의 백업 파일이 내려받아진다
    const [download] = await Promise.all([page.waitForEvent('download'), page.getByTestId('export-button').click()]);
    assert.match(download.suggestedFilename(), /^web-zero-to-hundred-.*\.json$/);
    const exported = JSON.parse(await readFile(await download.path(), 'utf8'));
    assert.equal(exported.app, 'web-zero-to-hundred');
    assert.deepEqual(Object.keys(exported.progress.completed), ['fa-d01']);

    // fa-d02 도 끝낸 백업 + 이 교재에 없는 Day 하나
    const backup = structuredClone(exported);
    backup.progress.completed['fa-d02'] = '2026-11-01T01:00:00.000Z';
    backup.progress.completed['zz-d99'] = '2026-11-01T01:00:00.000Z';
    const file = { name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(backup)) };
    const message = page.getByTestId('import-message');

    await page.getByTestId('import-input').setInputFiles(file); // 취소
    await eventually(async () => assert.equal(asked.length, 1));
    assert.match(asked[0], /바꿀까요|덮어/);
    await eventually(async () => assert.match(await message.innerText(), /취소/));
    assert.equal(await sidebarState(page, 'fa-d02'), 'today', '취소하면 진도가 그대로예요');

    accept = true;
    await page.getByTestId('import-input').setInputFiles(file);
    await eventually(async () => assert.match(await message.innerText(), /1개/));
    assert.match(await message.innerText(), /건너뛰/);
    assert.equal(await sidebarState(page, 'fa-d02'), 'done');
    assert.equal(await sidebarState(page, 'fb-d01'), 'today');
    await page.reload();
    await waitRoute(page, '#/settings');
    assert.equal(await sidebarState(page, 'fb-d01'), 'today', '가져온 진도는 저장돼요');
  });
});

test('mobile drawer opens as a dialog and closes by Escape, backdrop, button and link', TIMEOUT, async () => {
  await withPage(
    async (page, app) => {
      await visit(page, app, '#/');
      const toggle = page.locator('#menu-toggle');
      const isOpen = () => page.locator('#drawer').evaluate((d) => d.open);
      const openIt = async () => {
        await toggle.click();
        await until(isOpen);
      };
      const closed = () => until(async () => !(await isOpen()));

      await openIt();
      assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
      assert.equal(await page.evaluate(() => document.activeElement.classList.contains('is-today')), true, '오늘 Day 로 포커스');
      assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).overflow), 'hidden', '문서 스크롤 잠금');
      await page.keyboard.press('Escape');
      await closed();
      assert.equal(await page.evaluate(() => document.activeElement.id), 'menu-toggle', '연 버튼으로 복귀');
      assert.equal(await toggle.getAttribute('aria-expanded'), 'false');

      await openIt();
      await page.mouse.click(360, 400); // 서랍 폭 280px 바깥
      await closed();
      await openIt();
      await page.locator('#drawer-close').click();
      await closed();
      await openIt();
      await page.waitForTimeout(400); // 앞선 닫기의 대체 타이머(260ms)가 다시 연 서랍을 닫지 않는다
      assert.equal(await isOpen(), true, '곧바로 다시 연 서랍은 열려 있다');
      await page.locator('#drawer [data-day="fa-d01"]').click();
      await waitRoute(page, '#/day/fa-d01');
      await closed();
      assert.equal(await page.evaluate(() => document.activeElement.id), 'main', '화면을 옮기면 본문으로 포커스');
      assert.equal(await page.locator('#sidebar [data-day="fa-d01"]').count(), 1, '닫히면 목록이 사이드바로 돌아온다');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    },
    { viewport: { width: 375, height: 740 } },
  );
});

test('drawer backdrop fallback closes without closedBy', TIMEOUT, async () => {
  await withPage(
    async (page, app) => {
      await visit(page, app, '#/');
      assert.equal(await page.locator('#drawer').getAttribute('closedby'), null);
      await page.locator('#menu-toggle').click();
      await until(() => page.locator('#drawer').evaluate((d) => d.open));
      await page.mouse.click(360, 400);
      await until(async () => !(await page.locator('#drawer').evaluate((d) => d.open)));
    },
    {
      viewport: { width: 375, height: 740 },
      init: () => {
        delete HTMLDialogElement.prototype.closedBy;
      },
    },
  );
});

test('drawer closes and returns the nav when the window grows', TIMEOUT, async () => {
  await withPage(
    async (page, app) => {
      await visit(page, app, '#/');
      await page.locator('#menu-toggle').click();
      await until(() => page.locator('#drawer').evaluate((d) => d.open));
      await page.setViewportSize({ width: 1280, height: 800 });
      await until(async () => !(await page.locator('#drawer').evaluate((d) => d.open)));
      assert.equal(await page.locator('#sidebar nav.side').count(), 1);
      assert.notEqual(await page.evaluate(() => document.activeElement.id), 'menu-toggle');
    },
    { viewport: { width: 375, height: 740 } },
  );
});

test('drawer closes on a link to the current screen and keeps Tab inside', TIMEOUT, async () => {
  await withPage(
    async (page, app) => {
      await visit(page, app, '#/');
      await page.locator('#menu-toggle').click();
      await until(() => page.locator('#drawer').evaluate((d) => d.open));
      for (let i = 0; i < 25; i++) {
        await page.keyboard.press('Tab');
        // 모달 바깥(상단 바·본문·푸터)으로는 가지 않는다. 브라우저 UI 로 잠깐 나가 body 가 되는 것은 허용
        const outside = await page.evaluate(() => {
          const a = document.activeElement;
          return a !== document.body && !document.getElementById('drawer').contains(a);
        });
        assert.equal(outside, false);
      }
      await page.locator('#drawer a.side-home').click(); // 지금 화면(홈)
      await until(async () => !(await page.locator('#drawer').evaluate((d) => d.open)));
    },
    { viewport: { width: 375, height: 740 } },
  );
});

test('Ctrl+K from the open drawer goes to search', TIMEOUT, async () => {
  await withPage(
    async (page, app) => {
      await visit(page, app, '#/');
      await page.locator('#menu-toggle').click();
      await until(() => page.locator('#drawer').evaluate((d) => d.open));
      await page.keyboard.press('Control+k');
      await waitRoute(page, '#/search');
      assert.equal(await page.locator('#drawer').evaluate((d) => d.open), false);
    },
    { viewport: { width: 375, height: 740 } },
  );
});

test('code token colors keep 4.5:1 contrast in light and dark themes', TIMEOUT, async () => {
  const measure = (page) =>
    page.evaluate(() => {
      const channels = (css) => css.match(/[\d.]+/g).slice(0, 3).map(Number);
      const luminance = (css) => {
        const [r, g, b] = channels(css).map((v) => {
          const c = v / 255;
          return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      const ratio = (a, b) => {
        const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
        return (hi + 0.05) / (lo + 0.05);
      };
      // 스타일시트에 정의된 hljs 토큰 클래스를 모두 모은다
      const classes = new Set();
      const walk = (rules) => {
        for (const rule of rules) {
          for (const m of (rule.selectorText ?? '').matchAll(/\.(hljs-[\w-]+)/g)) classes.add(m[1]);
          if (rule.cssRules) walk(rule.cssRules);
        }
      };
      for (const sheet of document.styleSheets) walk(sheet.cssRules);

      const pre = document.querySelector('figure.code pre');
      const code = pre.querySelector('code');
      const background = getComputedStyle(pre).backgroundColor;
      const rows = [['(기본 글자)', ratio(getComputedStyle(code).color, background)]];
      for (const name of classes) {
        const span = document.createElement('span');
        span.className = name;
        span.textContent = 'x';
        code.append(span);
        rows.push([name, ratio(getComputedStyle(span).color, background)]);
        span.remove();
      }
      const colors = [...classes].sort().map((name) => {
        const span = document.createElement('span');
        span.className = name;
        code.append(span);
        const color = getComputedStyle(span).color;
        span.remove();
        return `${name}=${color}`;
      });
      return { background, rows, colors };
    });

  const results = {};
  const scenarios = [
    ['light (system)', { colorScheme: 'light', theme: null }],
    ['dark (system)', { colorScheme: 'dark', theme: null }],
    ['dark (manual over light system)', { colorScheme: 'light', theme: 'dark' }],
    ['light (manual over dark system)', { colorScheme: 'dark', theme: 'light' }],
  ];
  for (const [name, { colorScheme, theme }] of scenarios) {
    await withPage(
      async (page, app) => {
        await visit(page, app, '#/day/fa-d01');
        await page.locator('figure.code pre').waitFor();
        if (theme) await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
        const r = await measure(page);
        results[name] = r;
        assert.ok(r.rows.length > 10, '토큰 클래스가 충분히 정의돼 있어야 해요');
        for (const [token, value] of r.rows) {
          assert.ok(value >= 4.5, `${name}: ${token} 대비 ${value.toFixed(2)}:1 < 4.5:1 (배경 ${r.background})`);
        }
      },
      { colorScheme },
    );
  }
  // 시스템 다크와 수동 다크, 시스템 라이트와 수동 라이트는 같은 색이어야 한다 (CSS 두 곳의 값이 어긋나지 않았는지)
  assert.deepEqual(results['dark (system)'].colors, results['dark (manual over light system)'].colors);
  assert.deepEqual(results['light (system)'].colors, results['light (manual over dark system)'].colors);
  assert.notDeepEqual(results['light (system)'].colors, results['dark (system)'].colors);
});

test('special days count toward the level panel and placeholder days are styled', TIMEOUT, async () => {
  await withPage(
    async (page, app) => {
      await visit(page, app, '#/');
      await page.getByTestId('level-panel').waitFor();
      assert.equal(await sidebarState(page, 'fs-d01'), 'locked');

      for (const dayId of ['fa-d01', 'fa-d02']) {
        await visit(page, app, `#/day/${dayId}`);
        await completeDay(page, dayId);
      }
      assert.match(await page.getByTestId('unlock-banner').innerText(), /특별 프로젝트|픽스처 프로젝트 B/);

      await visit(page, app, '#/day/fs-d01');
      await completeDay(page, 'fs-d01');
      await visit(page, app, '#/day/fs-d02');
      const soon = page.locator('main .coming-soon');
      await soon.waitFor();
      const style = await soon.evaluate((el) => {
        const s = getComputedStyle(el);
        return { borderStyle: s.borderTopStyle, padding: parseFloat(s.paddingTop) };
      });
      assert.equal(style.borderStyle, 'dashed');
      assert.ok(style.padding >= 12, '준비 중 안내가 눈에 띄게 꾸며져 있어야 해요');

      await visit(page, app, '#/');
      assert.equal(await stat(page, 'days'), '3 / 5');
      assert.equal(await stat(page, 'xp'), '210');
      // 메인 과정이 먼저: 이어서 하기는 fb-d01
      assert.equal(await page.getByTestId('continue-button').getAttribute('href'), '#/day/fb-d01');
    },
    { url: VARIANT_URL },
  );
});

test('glossary term link scrolls to its entry and unknown routes say so', TIMEOUT, async () => {
  // 낮은 창: 용어 사전이 한 화면을 넘어야 "그 자리로 스크롤"을 확인할 수 있다
  await withPage(
    async (page, app) => {
      await visit(page, app, '#/day/fa-d01');
      await page.locator('main a.term').click();
      await waitRoute(page, '#/page/glossary/term-픽스처용어');
      assert.match(await page.locator('main h1').innerText(), /용어 사전/);
      const entry = page.locator('#term-픽스처용어');
      assert.equal(await entry.evaluate((el) => el.classList.contains('is-target')), true, '찾아온 항목이 표시돼요');
      await eventually(async () => {
        const box = await entry.boundingBox();
        assert.ok(box && box.y >= 56 && box.y < 120, `용어 항목이 윗줄 바로 아래에 보여야 해요 (y=${box?.y})`);
      });
      assert.ok((await page.evaluate(() => window.scrollY)) > 0, '창이 스크롤됐어요');

      // 다른 화면으로 가면 맨 위로 돌아온다
      await visit(page, app, '#/page/start');
      assert.equal(await page.evaluate(() => window.scrollY), 0);

      await visit(page, app, '#/day/nope-d99');
      assert.match(await page.locator('main h1').innerText(), /찾을 수 없/);
      await visit(page, app, '#/whatever');
      assert.match(await page.locator('main h1').innerText(), /찾을 수 없/);
    },
    { viewport: { width: 1280, height: 300 } },
  );
});

test('the early theme script reads the same storage key as the app', async () => {
  // 화면이 처음 그려질 때 깜빡이지 않게 head 의 작은 스크립트가 테마를 먼저 적용한다. 키가 어긋나면 조용히 효과가 사라진다
  const template = await readFile(path.join(ROOT, 'textbook', 'src', 'template.html'), 'utf8');
  const early = /<script id="theme-init">([\s\S]*?)<\/script>/.exec(template);
  assert.ok(early, 'theme-init script is in template.html');
  assert.ok(early[1].includes(`"${STORAGE_KEY}"`), `theme-init must read ${STORAGE_KEY}`);
});

// ───────────────────────── 수정 1차 (리뷰 반영) ─────────────────────────

test('first Tab reaches skip link', TIMEOUT, async () => {
  // 처음 열었을 때 Tab 의 시작점이 맨 앞이어야 한다: 건너뛰기 링크 -> 윗줄 -> 사이드바 순서
  const active = (page) =>
    page.evaluate(() => {
      const el = document.activeElement;
      return { skip: el.matches('.skip-link'), brand: el.matches('.brand'), label: el.tagName.toLowerCase() + '.' + el.className };
    });
  for (const hash of ['#/', '#/day/fa-d01', '#/day/fa-d02', '#/project/fa', '#/settings']) {
    await withPage(async (page, app) => {
      await visit(page, app, hash);
      await page.locator('main h1').waitFor();
      await page.keyboard.press('Tab');
      const first = await active(page);
      assert.equal(first.skip, true, `${hash}: 첫 Tab 이 건너뛰기 링크가 아니라 ${first.label} 로 갔어요`);
      await page.keyboard.press('Tab');
      const second = await active(page);
      assert.equal(second.brand, true, `${hash}: 둘째 Tab 은 윗줄 제목이어야 해요 (${second.label})`);
    });
  }
});

test('sidebar shows the current link without moving the Tab start', TIMEOUT, async () => {
  // 낮은 창에서는 현재 Day 링크가 사이드바 아래쪽에 가려진다: 사이드바만 스크롤돼야 하고 Tab 시작점은 그대로여야 한다
  await withPage(
    async (page, app) => {
      await visit(page, app, '#/day/fa-d02');
      await page.locator('main h1').waitFor();
      const fit = await page.evaluate(() => {
        const sidebar = document.getElementById('sidebar');
        const box = sidebar.getBoundingClientRect();
        const link = document.querySelector('#sidebar a.row[aria-current="page"]').getBoundingClientRect();
        return { scrollTop: sidebar.scrollTop, top: box.top, bottom: box.bottom, linkTop: link.top, linkBottom: link.bottom, pageScroll: window.scrollY };
      });
      assert.ok(fit.scrollTop > 0, '현재 링크가 보이도록 사이드바가 스크롤돼야 해요');
      assert.ok(fit.linkTop >= fit.top - 1 && fit.linkBottom <= fit.bottom + 1, `현재 링크가 사이드바 안에 보여야 해요 (${JSON.stringify(fit)})`);
      assert.equal(fit.pageScroll, 0, '본문 쪽은 스크롤되지 않아요');
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement.matches('.skip-link')), true);
    },
    { viewport: { width: 1280, height: 200 } },
  );
});

test('settings theme radios follow the top-bar theme menu', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/settings');
    const checked = () => page.evaluate(() => document.querySelector('input[name="theme"]:checked')?.value ?? null);
    const theme = () => page.locator('html').getAttribute('data-theme');
    assert.equal(await checked(), 'system');

    await pickTheme(page, 'dark');
    assert.equal(await theme(), 'dark');
    assert.equal(await checked(), 'dark', '윗줄 메뉴로 바꾸면 설정의 선택도 따라가요');
    await pickTheme(page, 'light');
    assert.equal(await theme(), 'light');
    assert.equal(await checked(), 'light');

    // 설정에서 직접 고르면 반대로 윗줄 메뉴 쪽이 따라간다
    await page.getByLabel('어둡게').check();
    assert.equal(await theme(), 'dark');
    assert.equal(await page.getByTestId('theme-toggle').getAttribute('aria-label'), '테마: 다크');
    assert.equal(await page.locator('#theme-menu [data-theme-value="dark"]').getAttribute('aria-checked'), 'true');
    await page.getByLabel('기기 설정 따르기').check();
    assert.equal(await theme(), null);
    assert.equal(await checked(), 'system');
    assert.equal(await page.getByTestId('theme-toggle').getAttribute('aria-label'), '테마: 시스템');

    // 설정 화면을 떠났다 돌아와도 현재 값으로 그려진다
    await pickTheme(page, 'dark');
    await visit(page, app, '#/');
    await visit(page, app, '#/settings');
    assert.equal(await checked(), await theme());
  });
});

test('page anchor that points outside the page body falls back to the top', TIMEOUT, async () => {
  // #main, #sidebar 처럼 문서에는 있지만 이 페이지 본문 안이 아닌 id, 없는 id 는 맨 위로 간다
  await withPage(
    async (page, app) => {
      for (const anchor of ['main', 'sidebar', 'nope']) {
        await visit(page, app, '#/day/fa-d01');
        await page.evaluate(() => window.scrollTo(0, 400));
        assert.ok((await page.evaluate(() => window.scrollY)) > 0, '먼저 아래로 스크롤해 둬요');
        await visit(page, app, `#/page/start/${anchor}`);
        await page.locator('main h1').waitFor();
        assert.equal(await page.evaluate(() => window.scrollY), 0, `#/page/start/${anchor}: 맨 위로 가야 해요`);
        assert.equal(await page.locator('.is-target').count(), 0);
      }
      // 본문 안의 id 는 그 자리로 간다 (용어 사전)
      await visit(page, app, '#/page/glossary/term-픽스처용어');
      assert.equal(await page.locator('#term-픽스처용어.is-target').count(), 1);
    },
    { viewport: { width: 1280, height: 300 } },
  );
});

test('early theme script applies the stored theme before the page body is parsed', TIMEOUT, async () => {
  // 깜빡임 방지: head 의 작은 스크립트가 저장된 테마를 본문(#main)이 만들어지기 전에 html 에 붙여야 한다.
  // 앱 번들이 붙이는 것과 구별하려고, data-theme 가 처음 붙는 순간 #main 이 이미 있었는지 기록한다.
  const seed = (stored) => {
    localStorage.setItem('wzh:v1:progress', JSON.stringify({ version: 1, completed: {}, checks: {}, lastDay: null, theme: stored }));
    window.__themeEarly = null;
    new MutationObserver(() => {
      const root = document.documentElement;
      if (!window.__themeEarly && root.hasAttribute('data-theme')) {
        window.__themeEarly = { value: root.getAttribute('data-theme'), mainExisted: Boolean(document.getElementById('main')) };
      }
    }).observe(document, { subtree: true, attributes: true, attributeFilter: ['data-theme'] });
  };
  for (const [stored, colorScheme] of [['dark', 'light'], ['light', 'dark']]) {
    await withPage(
      async (page, app) => {
        await visit(page, app, '#/');
        const early = await page.evaluate(() => window.__themeEarly);
        assert.deepEqual(early, { value: stored, mainExisted: false }, `${stored}: 본문을 읽기 전에 테마가 붙어야 해요`);
        assert.equal(await page.locator('html').getAttribute('data-theme'), stored);
      },
      { init: seed, initArg: stored, colorScheme },
    );
  }
});

// ───────────────────────── M2: 사이드바 Accordion · Day 행 5종 ─────────────────────────

test('sidebar rows show the five states', TIMEOUT, async () => {
  await withPage(
    async (page, app) => {
      await visit(page, app, '#/day/fa-d01');
      const row = (id) => page.locator(`#sidebar [data-day="${id}"]`);
      assert.equal(await sidebarState(page, 'fa-d01'), 'today');
      assert.equal(await row('fa-d01').getAttribute('aria-current'), 'page', '지금 화면이면 page 가 우선');
      assert.match(await row('fa-d01').getAttribute('class'), /is-today/);
      assert.equal(await sidebarState(page, 'fa-d02'), 'open');
      assert.equal(await row('fb-d01').evaluate((el) => el.tagName), 'BUTTON');
      assert.equal(await row('fs-d02').getAttribute('data-state'), 'locked', '잠김이 준비 중보다 먼저');
      // 1단계: fa-d01 만 끝낸다. 프로젝트 상태(fa active, fs locked)가 그대로이므로 사용자가 편 월드는 유지된다
      const fsWorld = page.locator('#sidebar details.world[data-project="fs"]');
      await fsWorld.locator('> summary').click();
      await completeDay(page, 'fa-d01');
      assert.equal(await sidebarState(page, 'fa-d01'), 'done');
      assert.equal(await sidebarState(page, 'fa-d02'), 'today');
      assert.equal(await fsWorld.evaluate((d) => d.open), true, '사용자가 편 월드는 그대로');
      // 2단계: fa 를 끝내면 fb·fs 가 열린다
      await visit(page, app, '#/day/fa-d02');
      await completeDay(page, 'fa-d02');
      assert.equal(await sidebarState(page, 'fb-d01'), 'today');
      assert.equal(await row('fb-d01').evaluate((el) => el.tagName), 'A', '열리면 링크로 바뀐다');
      assert.equal(await sidebarState(page, 'fs-d01'), 'open', '다른 월드의 첫 Day 는 오늘이 아니다');
      assert.equal(await sidebarState(page, 'fs-d02'), 'draft');
      assert.match(await row('fs-d02').innerText(), /준비 중/);
      assert.equal(await page.locator('#sidebar .row.is-today').count(), 1, '분홍 네모는 하나');
    },
    { url: VARIANT_URL },
  );
});

test('today row number is a 24px pink square', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/');
    const r = await page.locator('#sidebar .row.is-today .row-num').evaluate((el) => {
      const probe = document.createElement('i');
      probe.style.background = 'var(--color-accent)';
      document.body.append(probe);
      const pink = getComputedStyle(probe).backgroundColor;
      probe.remove();
      const s = getComputedStyle(el);
      return { bg: s.backgroundColor, pink, w: el.getBoundingClientRect().width, shadow: s.boxShadow };
    });
    assert.equal(r.bg, r.pink);
    assert.equal(Math.round(r.w), 24);
    assert.match(r.shadow, /0px 2px 0px/);
  });
});

test('locked day row explains on click and keyboard', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/');
    await page.locator('#sidebar details.world[data-project="fb"] > summary').click();
    const locked = page.locator('#sidebar [data-day="fb-d01"]');
    // 같은 문장의 토스트는 하나로 합쳐진다(toast.js). 그래서 떠 있는 수 대신 새로 뜬 횟수를 센다
    await page.evaluate(() => {
      window.__toasts = 0;
      new MutationObserver((list) => {
        for (const m of list) for (const n of m.addedNodes) if (n.classList?.contains('toast')) window.__toasts += 1;
      }).observe(document.body, { childList: true, subtree: true });
    });
    const shown = () => page.evaluate(() => window.__toasts);
    await locked.click();
    await until(async () => (await shown()) === 1);
    assert.match(await page.locator('.toast').first().innerText(), /프로젝트를 끝내면 열려요/);
    assert.equal(await page.evaluate(() => location.hash), '#/');
    await locked.focus();
    await page.keyboard.press('Enter');
    await until(async () => (await shown()) === 2);
    await page.keyboard.press('Space');
    await until(async () => (await shown()) === 3);
    assert.equal(await page.evaluate(() => location.hash), '#/');
  });
});

test('expand all opens every world and flips its label', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/');
    const btn = page.locator('#sidebar [data-expand-all]');
    const opens = () => page.locator('#sidebar details.world').evaluateAll((ds) => ds.map((d) => d.open));
    assert.deepEqual(await opens(), [true, false], '지금 월드만 펼침');
    assert.equal(await btn.innerText(), '모두 펼치기');
    await btn.click();
    assert.deepEqual(await opens(), [true, true]);
    assert.equal(await btn.innerText(), '모두 접기');
    await btn.click();
    assert.deepEqual(await opens(), [false, false]);
    assert.equal(await btn.innerText(), '모두 펼치기');
  });
});

test('world menu moves to another world and explains a locked one', TIMEOUT, async () => {
  await withPage(
    async (page, app) => {
      await visit(page, app, '#/');
      const btn = page.locator('#world-btn');
      const item = (id) => page.locator(`#world-menu [data-project="${id}"]`);
      await btn.click();
      assert.equal(await page.locator('#world-menu [role="menuitem"]').count(), 2);
      assert.equal(await item('fb').getAttribute('aria-disabled'), 'true');
      await item('fb').click({ force: true }); // aria-disabled 라서 Playwright 의 '누를 수 있음' 검사를 건너뛴다
      await until(async () => (await page.locator('.toast').count()) === 1);
      assert.equal(await page.evaluate(() => location.hash), '#/', '잠긴 월드로는 이동하지 않는다');
      assert.equal(await page.locator('#world-menu').isHidden(), false, '잠긴 항목을 눌러도 메뉴는 열려 있다');
      await item('fa').click();
      await waitRoute(page, '#/project/fa');
      assert.equal(await page.locator('#world-menu').isHidden(), true);
      assert.equal(await page.locator('#sidebar details.world[data-project="fa"]').evaluate((d) => d.open), true);
      await btn.click();
      assert.equal(await item('fa').getAttribute('aria-current'), 'page');
      assert.equal(await item('fb').getAttribute('aria-current'), null);
    },
    { viewport: { width: 1280, height: 800 } },
  );
});

test('world menu keyboard: arrows, End, Escape and Tab', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/');
    const focusedProject = () => page.evaluate(() => document.activeElement.dataset.project ?? document.activeElement.id);
    await page.locator('#world-btn').focus();
    await page.keyboard.press('ArrowDown');
    assert.equal(await focusedProject(), 'fa');
    await page.keyboard.press('End');
    assert.equal(await focusedProject(), 'fb');
    await page.keyboard.press('ArrowDown');
    assert.equal(await focusedProject(), 'fa', '끝에서 처음으로');
    await page.keyboard.press('Escape');
    assert.equal(await focusedProject(), 'world-btn');
    assert.equal(await page.locator('#world-btn').getAttribute('aria-expanded'), 'false');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('#world-menu').isHidden(), true, 'Tab 은 메뉴를 닫는다');
    await page.locator('#world-btn').focus();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await waitRoute(page, '#/project/fa');
  });
});

test('world menu works inside the drawer', TIMEOUT, async () => {
  await withPage(
    async (page, app) => {
      await visit(page, app, '#/');
      await page.locator('#menu-toggle').click();
      await page.locator('#drawer #world-btn').click();
      const menu = page.locator('#drawer #world-menu');
      const box = await menu.boundingBox();
      const drawerBox = await page.locator('#drawer').boundingBox();
      assert.ok(box.x >= drawerBox.x && box.x + box.width <= drawerBox.x + drawerBox.width, '메뉴가 서랍 폭 안에 들어간다');
      // 메뉴 안 Escape 는 메뉴만 닫고 서랍은 그대로
      await page.keyboard.press('Escape');
      assert.equal(await menu.isHidden(), true);
      assert.equal(await page.locator('#drawer').evaluate((d) => d.open), true);
      await page.locator('#drawer #world-btn').click();
      await page.locator('#drawer #world-menu [data-project="fb"]').click({ force: true }); // 잠김: 서랍도 닫히지 않는다
      assert.equal(await page.locator('#drawer').evaluate((d) => d.open), true);
      await page.locator('#drawer #world-menu [data-project="fa"]').click();
      await waitRoute(page, '#/project/fa');
      await until(async () => !(await page.locator('#drawer').evaluate((d) => d.open)));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    },
    { viewport: { width: 320, height: 640 } },
  );
});

test('drawer focuses the current row when there is no today Day', TIMEOUT, async () => {
  await withPage(
    async (page, app) => {
      await visit(page, app, '#/day/fa-d02');
      await page.locator('#menu-toggle').click();
      await until(() => page.locator('#drawer').evaluate((d) => d.open));
      // 오늘 행이 없으면 지금 화면 행으로 간다 (숨은 월드 메뉴 항목이 아니라)
      assert.equal(await page.evaluate(() => document.activeElement.dataset.day ?? document.activeElement.outerHTML.slice(0, 80)), 'fa-d02');
    },
    {
      viewport: { width: 375, height: 740 },
      init: () => {
        const at = '2026-01-01T00:00:00.000Z';
        localStorage.setItem('wzh:v1:progress', JSON.stringify({ version: 1, completed: { 'fa-d01': at, 'fa-d02': at, 'fb-d01': at }, checks: {}, lastDay: 'fb-d01', theme: 'system' }));
      },
    },
  );
});

test('locked world menu item is not a link but still explains from the keyboard', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/');
    const fb = page.locator('#world-menu [data-project="fb"]');
    // 링크가 아니므로 가운데 클릭·Ctrl+클릭으로 새 탭에 열리지 않는다
    assert.equal(await fb.getAttribute('href'), null);
    assert.equal(await page.locator('#world-menu [data-project="fa"]').getAttribute('href'), '#/project/fa');
    await page.locator('#world-btn').focus();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('End');
    await page.keyboard.press('Enter');
    await until(async () => (await page.locator('.toast').count()) === 1);
    assert.match(await page.locator('.toast').first().innerText(), /프로젝트를 끝내면 열려요/);
    assert.equal(await page.evaluate(() => location.hash), '#/');
    assert.equal(await page.locator('#world-menu').isHidden(), false, '잠긴 항목에서는 메뉴가 열려 있다');
  });
});

test('world menu item becomes a link once its world unlocks', TIMEOUT, async () => {
  await withPage(
    async (page, app) => {
      await visit(page, app, '#/');
      const fb = page.locator('#world-menu [data-project="fb"]');
      assert.equal(await fb.getAttribute('href'), '#/project/fb');
      assert.equal(await fb.getAttribute('aria-disabled'), null);
    },
    {
      init: () => {
        const at = '2026-01-01T00:00:00.000Z';
        localStorage.setItem('wzh:v1:progress', JSON.stringify({ version: 1, completed: { 'fa-d01': at, 'fa-d02': at }, checks: {}, lastDay: 'fa-d02', theme: 'system' }));
      },
    },
  );
});

test('drawer state follows the dialog without waiting for the close event', TIMEOUT, async () => {
  await withPage(
    async (page, app) => {
      await visit(page, app, '#/');
      await page.locator('#menu-toggle').click();
      await until(() => page.locator('#drawer').evaluate((d) => d.open));
      // close 이벤트는 다음 태스크에 온다. 그 전(마이크로태스크)에 이미 버튼 상태와 목록 위치가 맞아야 한다
      const state = await page.evaluate(async () => {
        document.getElementById('drawer').close();
        await Promise.resolve();
        return {
          expanded: document.getElementById('menu-toggle').getAttribute('aria-expanded'),
          navInSidebar: document.querySelector('#sidebar > nav.side') !== null,
        };
      });
      assert.deepEqual(state, { expanded: 'false', navInSidebar: true });
    },
    { viewport: { width: 375, height: 740 } },
  );
});

// ───────────────────────── 홈 퀘스트 카드 (M3) ─────────────────────────

test('quest card: first visit starts at Day 1', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/');
    assert.equal(await quest(page).getAttribute('data-kind'), 'start');
    assert.match(await quest(page).locator('.quest-label').innerText(), /오늘의 퀘스트/);
    assert.equal(await quest(page).locator('.bignum-value').innerText(), '1');
    assert.match(await quest(page).locator('.quest-title').innerText(), /첫 번째 Day/);
    const facts = await quest(page).locator('.quest-facts').innerText();
    assert.match(facts, /60분/);
    assert.match(facts, /3개/);
    assert.match(facts, /\+60 XP/);
    assert.match(facts, /C:\\dev\\fixture-a/);
    const btn = page.getByTestId('continue-button');
    assert.equal(await btn.innerText(), '첫 Day 시작하기');
    assert.equal(await btn.getAttribute('href'), '#/day/fa-d01');
    assert.equal(await quest(page).getByRole('link', { name: '처음이면 시작하기부터' }).getAttribute('href'), '#/page/start');
    assert.match(await quest(page).locator('.world-link').innerText(), /월드 1\s*픽스처 프로젝트 A/);
  });
});

test('quest card: continue shows checked count and next day', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/');
    assert.equal(await quest(page).getAttribute('data-kind'), 'continue');
    assert.equal(await quest(page).locator('.bignum-value').innerText(), '2');
    assert.match(await quest(page).locator('.quest-facts').innerText(), /1 \/ 3/);
    assert.equal(await page.getByTestId('continue-button').innerText(), '이어서 하기');
    assert.equal(await quest(page).getByRole('link', { name: '처음이면 시작하기부터' }).count(), 0);
  }, seed(['fa-d01'], { checks: { 'fa-d02': [0] } }));
});

test('quest card: world clear names what was made and opens the next world', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/');
    assert.equal(await quest(page).getAttribute('data-kind'), 'clear');
    assert.match(await quest(page).locator('.quest-label').innerText(), /월드 클리어/);
    assert.equal(await quest(page).locator('.bignum-value').innerText(), '2');
    assert.match(await quest(page).locator('.quest-title').innerText(), /‘픽스처 프로젝트 A’ 월드를 모두 마쳤어요/);
    assert.match(await quest(page).locator('.made').innerText(), /작은 웹 페이지 하나를 만들어요/);
    assert.match(await quest(page).locator('.quest-next').innerText(), /픽스처 프로젝트 B.*Day 1 ‘비밀 Day’/);
    const btn = page.getByTestId('continue-button');
    assert.equal(await btn.innerText(), '다음 월드 시작하기');
    assert.equal(await btn.getAttribute('href'), '#/day/fb-d01');
    assert.equal(await quest(page).getByRole('link', { name: '픽스처 프로젝트 A 다시 보기' }).getAttribute('href'), '#/project/fa');
  }, seed(['fa-d01', 'fa-d02']));
});

test('quest card: all done has no primary button without a roadmap page', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/');
    assert.equal(await quest(page).getAttribute('data-kind'), 'done');
    assert.match(await quest(page).locator('.quest-label').innerText(), /모든 월드 클리어/);
    assert.equal(await quest(page).locator('.bignum-value').innerText(), '3');
    assert.match(await quest(page).locator('.quest-title').innerText(), /열린 Day를 모두 마쳤어요/);
    assert.equal(await quest(page).locator('.world-link').count(), 0);
    assert.equal(await page.locator('main .btn-primary').count(), 0);
  }, seed(['fa-d01', 'fa-d02', 'fb-d01']));
});

test('quest card: next day not written yet offers a review', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/');
    assert.equal(await quest(page).getAttribute('data-kind'), 'pending');
    assert.match(await quest(page).locator('.quest-title').innerText(), /다음 Day는 준비 중이에요/);
    assert.match(await quest(page).locator('.quest-summary').innerText(), /Day 2 ‘특별 둘째 Day 배포’ 내용은 아직 쓰는 중이에요/);
    const btn = page.getByTestId('review-button');
    assert.equal(await btn.innerText(), 'Day 1 복습하기');
    assert.equal(await btn.getAttribute('href'), '#/day/fs-d01');
    assert.equal(await quest(page).getByRole('link', { name: '특별 프로젝트 Day 목록' }).getAttribute('href'), '#/project/fs');
  }, { url: VARIANT_URL, ...seed(['fa-d01', 'fa-d02', 'fb-d01', 'fs-d01']) });
});

// ───────────────────────── 홈 레벨 패널 (M3) ─────────────────────────

test('level panel starts at LV 1 with 0 XP', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/');
    const panel = page.getByTestId('level-panel');
    assert.equal(await panel.locator('.lv-value').innerText(), '1');
    assert.match(await panel.locator('.xp-text').innerText(), /0 \/ 300 XP/);
    assert.match(await panel.locator('.xp-next').innerText(), /LV 2까지 300 XP/);
    assert.equal(await xpNow(page), '0');
    assert.deepEqual([await stat(page, 'xp'), await stat(page, 'days'), await stat(page, 'world')], ['0', '0 / 3', '0 / 2']);
    assert.match(await panel.locator('.cheer').innerText(), /아직 시작 전이에요/);
  });
});

test('xp grows after completing a day and fills only once per session', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/day/fa-d01');
    await completeDay(page, 'fa-d01');
    await visit(page, app, '#/');
    assert.equal(await xpNow(page), '60');
    assert.match(await page.locator('.xp-text').innerText(), /60 \/ 300 XP/);
    assert.equal(await page.locator('.xp-fill').evaluate((el) => el.style.getPropertyValue('--p')), '0.2000');
    assert.deepEqual([await stat(page, 'xp'), await stat(page, 'days'), await stat(page, 'world')], ['60', '1 / 3', '1 / 2']);
    assert.match(await page.locator('.cheer').innerText(), /좋은 출발이에요/);
    await visit(page, app, '#/day/fa-d02');
    await completeDay(page, 'fa-d02');
    await visit(page, app, '#/');
    assert.equal(await xpNow(page), '150');
    assert.equal(await page.locator('.xp-fill').evaluate((el) => el.getAnimations().length), 0, '두 번째로 본 막대는 움직이지 않는다');
  });
});

// ───────────────────────── 홈 월드맵 (M4) ─────────────────────────

const mapNode = (page, id) => page.locator(`[data-testid="world-map"] .node[data-day="${id}"]`);

test('world map: first visit shows the current world with the pawn on today', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/');
    const map = page.getByTestId('world-map');
    assert.match(await map.locator('.map-name').innerText(), /픽스처 프로젝트 A/);
    assert.equal(await map.locator('.node').count(), 2);
    assert.equal(await map.locator('.map-count .num').innerText(), '0 / 2');
    assert.match(await mapNode(page, 'fa-d01').getAttribute('class'), /is-today/);
    assert.equal(await mapNode(page, 'fa-d01').locator('.pawn').count(), 1);
    assert.equal(await mapNode(page, 'fa-d01').locator('a').getAttribute('aria-current'), 'step');
    assert.equal(await mapNode(page, 'fa-d01').locator('a').getAttribute('aria-label'), 'Day 1 첫 번째 Day, 오늘');
    assert.equal(await mapNode(page, 'fa-d02').locator('a').getAttribute('aria-label'), 'Day 2 두 번째 Day, 남음');
    assert.deepEqual(await map.locator('.legend li').allInnerTexts(), ['오늘', '남음']);
  });
});

test('world map: a cleared world is all green with a green trail and no pawn', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/');
    const map = page.getByTestId('world-map');
    for (const id of ['fa-d01', 'fa-d02']) {
      assert.match(await mapNode(page, id).getAttribute('class'), /is-done/);
      assert.equal(await mapNode(page, id).locator('a').evaluate((el) => getComputedStyle(el).backgroundColor), 'rgb(22, 163, 74)');
    }
    assert.equal(await map.locator('.trail-done').count(), 3);
    assert.equal(await map.locator('.pawn').count(), 0);
    assert.deepEqual(await map.locator('.legend li').allInnerTexts(), ['완료']);
  }, seed(['fa-d01', 'fa-d02']));
});

test('world map: a skipped day stays green but the green trail starts only from day 1', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/');
    assert.match(await mapNode(page, 'fa-d01').getAttribute('class'), /is-today/);
    assert.match(await mapNode(page, 'fa-d02').getAttribute('class'), /is-done/);
    assert.equal(await page.locator('[data-testid="world-map"] .trail-done').count(), 0);
  }, seed(['fa-d02']));
});

test('world map: unwritten days are dashed and deploy days carry a flag', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/');
    const map = page.getByTestId('world-map');
    assert.match(await map.locator('.map-name').innerText(), /특별 프로젝트/);
    assert.match(await mapNode(page, 'fs-d01').getAttribute('class'), /is-today/);
    const draft = mapNode(page, 'fs-d02');
    assert.match(await draft.getAttribute('class'), /is-draft/);
    assert.match(await draft.getAttribute('class'), /is-deploy/);
    const look = await draft.locator('a').evaluate((el) => [getComputedStyle(el).borderTopStyle, getComputedStyle(el).boxShadow]);
    assert.deepEqual(look, ['dashed', 'none']);
    assert.equal(await draft.locator('.node-flag').count(), 1);
    assert.equal(await draft.locator('a').getAttribute('aria-label'), 'Day 2 특별 둘째 Day 배포, 준비 중, 배포 Day');
    assert.deepEqual(await map.locator('.legend li').allInnerTexts(), ['오늘', '준비 중', '배포']);
  }, { url: VARIANT_URL, ...seed(['fa-d01', 'fa-d02', 'fb-d01'], { lastDay: null }) });
});
