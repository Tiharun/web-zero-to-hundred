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
      { title: '특별 둘째 Day', minutes: 60, summary: '아직 준비 중인 Day예요.', keywords: ['준비'] },
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

const sidebarState = (page, dayId) => page.locator(`#sidebar a[data-day="${dayId}"]`).getAttribute('data-state');
const percentOf = (page, which) => page.getByTestId(`progress-${which}`).getAttribute('data-percent');

/** Day 화면에서 [완료]를 누른다 */
async function completeDay(page, dayId) {
  await page.getByTestId('complete-button').click();
  await page.getByTestId('uncomplete-button').waitFor();
  assert.equal(await sidebarState(page, dayId), 'done');
}

// ───────────────────────── 요구된 테스트 ─────────────────────────

test('home shows 0% and continue goes to fa-d01', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/');
    const main = page.getByTestId('progress-main');
    await main.waitFor();
    assert.equal(await main.getAttribute('data-percent'), '0');
    assert.match(await main.innerText(), /0%/);
    assert.equal(await page.getByTestId('progress-special').count(), 0, '특별 과정이 없는 교재에는 특별 진도 카드를 만들지 않아요');

    const link = page.getByTestId('continue-button');
    assert.equal(await link.getAttribute('href'), '#/day/fa-d01');
    await link.click();
    await waitRoute(page, '#/day/fa-d01');
    assert.match(await page.locator('main h1').innerText(), /첫 번째 Day/);
    assert.equal(await sidebarState(page, 'fa-d01'), 'next');
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
    assert.equal(await sidebarState(page, 'fa-d02'), 'next');
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
    assert.equal(await sidebarState(page, 'fb-d01'), 'next');

    // 홈: 3 Day 중 2 Day = 66%, 이어서 하기는 fb-d01
    await page.getByRole('link', { name: '홈', exact: true }).first().click();
    await waitRoute(page, '#/');
    assert.equal(await percentOf(page, 'main'), '66');
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
      await page.getByTestId('progress-main').waitFor();
      const banner = page.getByTestId('storage-banner');
      await banner.waitFor({ state: 'visible' });
      assert.match(await banner.innerText(), /저장되지 않아요/);

      // 저장은 못 해도 이번 방문 동안은 메모리로 정상 동작한다
      await page.getByTestId('continue-button').click();
      await waitRoute(page, '#/day/fa-d01');
      await completeDay(page, 'fa-d01');
      assert.equal(await sidebarState(page, 'fa-d02'), 'next');
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

    await page.getByTestId('theme-toggle').click();
    assert.equal(await root.getAttribute('data-theme'), 'dark');
    const darkBg = await bg();
    assert.notEqual(darkBg, lightBg);

    await page.reload();
    await waitRoute(page, '#/');
    assert.equal(await root.getAttribute('data-theme'), 'dark');
    assert.equal(await bg(), darkBg);

    await page.getByTestId('theme-toggle').click();
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
    const main = page.getByTestId('progress-main');
    await main.waitFor();
    assert.equal(await main.getAttribute('data-percent'), '0');
    assert.match(await main.innerText(), /0%/);
    assert.equal(await sidebarState(page, 'fa-d01'), 'next');
    assert.equal(await page.getByTestId('continue-button').getAttribute('href'), '#/day/fa-d01');

    await page.reload(); // 저장소도 비워졌다
    await waitRoute(page, '#/');
    assert.equal(await percentOf(page, 'main'), '0');
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
    assert.equal(await sidebarState(page, 'fa-d02'), 'next', '취소하면 진도가 그대로예요');

    accept = true;
    await page.getByTestId('import-input').setInputFiles(file);
    await eventually(async () => assert.match(await message.innerText(), /1개/));
    assert.match(await message.innerText(), /건너뛰/);
    assert.equal(await sidebarState(page, 'fa-d02'), 'done');
    assert.equal(await sidebarState(page, 'fb-d01'), 'next');
    await page.reload();
    await waitRoute(page, '#/settings');
    assert.equal(await sidebarState(page, 'fb-d01'), 'next', '가져온 진도는 저장돼요');
  });
});

test('mobile menu opens as a drawer and closes again', TIMEOUT, async () => {
  await withPage(
    async (page, app) => {
      await visit(page, app, '#/');
      const sidebar = page.locator('#sidebar');
      const toggle = page.locator('#menu-toggle');
      assert.equal(await toggle.isVisible(), true);
      assert.equal(await sidebar.isVisible(), false, '좁은 화면에서 사이드바는 닫혀 있어요');

      await toggle.click();
      await sidebar.waitFor({ state: 'visible' });
      assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
      await page.keyboard.press('Escape');
      await sidebar.waitFor({ state: 'hidden' });
      assert.equal(await toggle.getAttribute('aria-expanded'), 'false');

      await toggle.click();
      await sidebar.waitFor({ state: 'visible' });
      await page.locator('#sidebar a[data-day="fa-d01"]').click();
      await waitRoute(page, '#/day/fa-d01');
      await sidebar.waitFor({ state: 'hidden' });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    },
    { viewport: { width: 360, height: 740 } },
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

test('special track is counted apart and placeholder days are styled', TIMEOUT, async () => {
  await withPage(
    async (page, app) => {
      await visit(page, app, '#/');
      await page.getByTestId('progress-special').waitFor();
      assert.equal(await percentOf(page, 'special'), '0');
      assert.equal(await percentOf(page, 'main'), '0');
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
      assert.equal(await percentOf(page, 'main'), '66');
      assert.equal(await percentOf(page, 'special'), '50');
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
        const link = document.querySelector('#sidebar a[aria-current="page"]').getBoundingClientRect();
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

test('settings theme radios follow the top-bar toggle', TIMEOUT, async () => {
  await withPage(async (page, app) => {
    await visit(page, app, '#/settings');
    const checked = () => page.evaluate(() => document.querySelector('input[name="theme"]:checked')?.value ?? null);
    const theme = () => page.locator('html').getAttribute('data-theme');
    assert.equal(await checked(), 'system');

    await page.getByTestId('theme-toggle').click();
    assert.equal(await theme(), 'dark');
    assert.equal(await checked(), 'dark', '윗줄 버튼으로 바꾸면 설정의 선택도 따라가요');
    await page.getByTestId('theme-toggle').click();
    assert.equal(await theme(), 'light');
    assert.equal(await checked(), 'light');

    // 설정에서 직접 고르면 반대로 윗줄 버튼 쪽이 따라간다
    await page.getByLabel('어둡게').check();
    assert.equal(await theme(), 'dark');
    assert.match((await page.getByTestId('theme-toggle').getAttribute('aria-label')) ?? '', /라이트/);
    await page.getByLabel('기기 설정 따르기').check();
    assert.equal(await theme(), null);
    assert.equal(await checked(), 'system');

    // 설정 화면을 떠났다 돌아와도 현재 값으로 그려진다
    await page.getByTestId('theme-toggle').click();
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
