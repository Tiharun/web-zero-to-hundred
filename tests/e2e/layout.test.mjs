// 공통 레이아웃·공용 컴포넌트 e2e: 픽스처 교재를 빌드해 로컬 서버(127.0.0.1)로 연다.
// 값은 DESIGN.md(Components·Elevation)와 같아야 한다. 실행: cd textbook && npm run test:e2e
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { build } from '../../textbook/build.mjs';
import { launch, collectConsoleErrors } from '../helpers/browser.mjs';
import { startStaticServer } from '../helpers/static-server.mjs';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const FIXTURE = path.join(ROOT, 'tests', 'fixtures', 'content');
const TIMEOUT = { timeout: 90_000 };

let tmp;
let server;
let browser;
const opened = [];

before(async () => {
  tmp = await mkdtemp(path.join(tmpdir(), 'wzh-layout-'));
  const r = await build({ contentDir: FIXTURE });
  assert.equal(r.ok, true, JSON.stringify(r.errors));
  await writeFile(path.join(tmp, 'index.html'), r.html);

  // 아주 긴 사이트 이름(60자)으로 바꾼 픽스처 사본
  const longDir = path.join(tmp, 'long-content');
  await cp(FIXTURE, longDir, { recursive: true });
  const curFile = path.join(longDir, 'curriculum.json');
  const cur = JSON.parse(await readFile(curFile, 'utf8'));
  cur.title = '아주아주긴교재이름'.repeat(7).slice(0, 60);
  await writeFile(curFile, JSON.stringify(cur, null, 2));
  const long = await build({ contentDir: longDir });
  assert.equal(long.ok, true, JSON.stringify(long.errors));
  await writeFile(path.join(tmp, 'long.html'), long.html);

  // 부록 "막혔을 때"(help)가 있는 픽스처 사본: 404 화면의 도움말 링크를 본다
  const helpDir = path.join(tmp, 'help-content');
  await cp(FIXTURE, helpDir, { recursive: true });
  const helpCurFile = path.join(helpDir, 'curriculum.json');
  const helpCur = JSON.parse(await readFile(helpCurFile, 'utf8'));
  helpCur.pages.push({ id: 'help', title: '막혔을 때', file: 'help.md' });
  await writeFile(helpCurFile, JSON.stringify(helpCur, null, 2));
  await writeFile(path.join(helpDir, 'pages', 'help.md'), '# 막혔을 때\n\n픽스처 도움말이에요.\n');
  const withHelp = await build({ contentDir: helpDir });
  assert.equal(withHelp.ok, true, JSON.stringify(withHelp.errors));
  await writeFile(path.join(tmp, 'help.html'), withHelp.html);

  // GitHub Pages 의 404.html 로 쓰는 빌드
  const nf = await build({ contentDir: FIXTURE, notFound: true });
  assert.equal(nf.ok, true, JSON.stringify(nf.errors));
  await writeFile(path.join(tmp, '404.html'), nf.html);

  server = await startStaticServer(tmp);
  browser = await launch();
});

after(async () => {
  for (const { context } of opened) await context.close();
  await browser?.close();
  await server?.close();
  if (tmp) await rm(tmp, { recursive: true, force: true });
});

/** 새 컨텍스트(깨끗한 저장소)로 화면 하나를 연다. theme 은 시스템 색 모드로 흉내 낸다 */
async function open(hash, { width = 1280, height = 900, theme = 'light', file = 'index.html', init = null } = {}) {
  const context = await browser.newContext({ viewport: { width, height }, colorScheme: theme });
  if (init) await context.addInitScript(init);
  const page = await context.newPage();
  const errors = collectConsoleErrors(page);
  opened.push({ context, errors });
  await page.goto(`${server.url}${file}${hash}`);
  await page.locator('main h1').first().waitFor();
  return page;
}

const noHorizontalScroll = (page) => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

/** 테마 메뉴를 열어 하나를 고른다 */
async function pickTheme(page, value) {
  await page.getByTestId('theme-toggle').click();
  await page.locator(`#theme-menu [data-theme-value="${value}"]`).click();
}

test('the primary button presses into its ledge and meets the size floor', TIMEOUT, async () => {
  const page = await open('#/', { width: 1280 });
  const btn = page.locator('main .btn-primary');
  assert.equal(await btn.count(), 1, '주 버튼은 한 화면에 하나');
  const box = await btn.boundingBox();
  assert.ok(box.height >= 48, `높이 ${box.height}`);
  const style = await btn.evaluate((el) => {
    const s = getComputedStyle(el);
    return [s.backgroundColor, s.fontWeight, s.borderRadius, s.boxShadow, s.fontSize];
  });
  assert.deepEqual(style.slice(0, 3), ['rgb(219, 39, 119)', '800', '6px']);
  assert.match(style[3], /rgb\(157, 23, 77\) 0px 4px 0px 0px/);
  assert.equal(style[4], '17px');
});

test('focus ring is the focus token, 2px, offset 2px', TIMEOUT, async () => {
  const page = await open('#/', { width: 1280 });
  const btn = page.locator('main .btn-primary');
  for (let i = 0; i < 40 && !(await btn.evaluate((el) => el === document.activeElement)); i++) await page.keyboard.press('Tab');
  const ring = await btn.evaluate((el) => {
    const s = getComputedStyle(el);
    return [el === document.activeElement, s.outlineStyle, s.outlineWidth, s.outlineColor, s.outlineOffset];
  });
  assert.deepEqual(ring, [true, 'solid', '2px', 'rgb(219, 39, 119)', '2px']);
});

test('no blurred shadow anywhere on the home screen', TIMEOUT, async () => {
  for (const theme of ['light', 'dark']) {
    const page = await open('#/', { width: 1280, theme });
    const blurred = await page.evaluate(() =>
      [...document.querySelectorAll('*')]
        .filter((el) => /\dpx \dpx [1-9]\d*px/.test(getComputedStyle(el).boxShadow))
        .map((el) => `${el.tagName}.${el.className}`),
    );
    assert.deepEqual(blurred, [], theme);
  }
});

test('technology chips use the track chip from DESIGN.md', TIMEOUT, async () => {
  // 공용 함수는 번들 안에 있어서 직접 부르지 않는다. 화면에 그려진 부품으로 확인한다.
  const page = await open('#/', { width: 1280 });
  const chip = page.locator('main .chips li').first();
  assert.ok((await chip.count()) > 0, '홈의 기술 칩');
  const chipStyle = await chip.evaluate((el) => {
    const s = getComputedStyle(el);
    return [s.backgroundColor, s.borderRadius, s.paddingTop, s.paddingLeft, s.fontSize];
  });
  assert.deepEqual(chipStyle, ['rgb(241, 245, 249)', '6px', '2px', '8px', '15px']);
});

// ───────── 공통 레이아웃: 헤더, 테마 메뉴, 본문 틀, 푸터 ─────────

test('header: wordmark, search link, theme menu — same on every kind of page', TIMEOUT, async () => {
  for (const hash of ['#/', '#/project/fa', '#/day/fa-d01', '#/page/start', '#/settings', '#/search', '#/nope']) {
    const page = await open(hash, { width: 1280 });
    const bar = await page.locator('.topbar').boundingBox();
    assert.equal(bar.height, 56, hash);
    assert.equal(await page.locator('.wordmark svg.px').count(), 1, hash);
    assert.equal(await page.locator('.wordmark').evaluate((el) => getComputedStyle(el).fontWeight), '800', hash);
    assert.equal(await page.locator('#menu-toggle').isVisible(), false, hash);
    assert.equal(await page.locator('#search-open').isVisible(), true, hash);
    assert.equal(await page.locator('.site-footer').count(), 1, hash);
    assert.equal(await page.locator('#sidebar').isVisible(), true, hash);
  }
});

test('header matches the prototype: pawn is pink-filled, search button has a rule border', TIMEOUT, async () => {
  const page = await open('#/', { width: 1280 });
  const fills = await page.locator('.wordmark svg.px').evaluate((svg) => ['p1', 'p2', 'p3'].map((c) => getComputedStyle(svg.querySelector(`.${c}`)).fill));
  assert.deepEqual(fills, ['rgb(49, 46, 129)', 'rgb(219, 39, 119)', 'rgb(190, 24, 93)']);
  const border = await page.locator('#search-open').evaluate((el) => getComputedStyle(el).borderTopColor);
  assert.equal(border, 'rgb(216, 221, 244)');
  const narrow = await open('#/', { width: 375 });
  assert.equal(await narrow.locator('#search-open').evaluate((el) => getComputedStyle(el).borderTopColor), 'rgba(0, 0, 0, 0)', '좁은 화면에서는 테두리 없이 아이콘만');
});

test('theme menu: arrows move, Enter applies, focus returns, choice survives reload', TIMEOUT, async () => {
  const page = await open('#/', { width: 1280 });
  const btn = page.getByTestId('theme-toggle');
  const menu = page.locator('#theme-menu');
  const theme = () => page.locator('html').getAttribute('data-theme');

  await btn.focus();
  await page.keyboard.press('ArrowDown');
  assert.equal(await menu.isVisible(), true);
  assert.equal(await btn.getAttribute('aria-expanded'), 'true');
  assert.equal(await page.evaluate(() => document.activeElement.dataset.themeValue), 'system', '↓ 는 첫 항목');
  await page.keyboard.press('ArrowUp');
  assert.equal(await page.evaluate(() => document.activeElement.dataset.themeValue), 'dark', '↑ 는 끝으로 돈다');
  await page.keyboard.press('Home');
  assert.equal(await page.evaluate(() => document.activeElement.dataset.themeValue), 'system');
  await page.keyboard.press('End');
  await page.keyboard.press('Enter'); // 다크
  assert.equal(await theme(), 'dark');
  assert.equal(await menu.isHidden(), true);
  assert.equal(await btn.getAttribute('aria-expanded'), 'false');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'theme-btn');
  assert.equal(await btn.getAttribute('aria-label'), '테마: 다크');
  assert.equal(await page.locator('#theme-menu [data-theme-value="dark"]').getAttribute('aria-checked'), 'true');

  await page.reload();
  await page.locator('main h1').first().waitFor();
  assert.equal(await theme(), 'dark');
  assert.equal(await btn.getAttribute('aria-label'), '테마: 다크');

  // Esc 로 닫히고 포커스는 버튼으로
  await btn.click();
  assert.equal(await menu.isVisible(), true);
  await page.keyboard.press('Escape');
  assert.equal(await menu.isHidden(), true);
  assert.equal(await page.evaluate(() => document.activeElement.id), 'theme-btn');
  // 바깥 클릭으로 닫힌다
  await btn.click();
  await page.mouse.click(640, 600);
  assert.equal(await menu.isHidden(), true);
  // Tab 으로 메뉴를 벗어나면 닫힌다
  await btn.click();
  await page.keyboard.press('Tab');
  assert.equal(await menu.isHidden(), true);
  // 시스템을 고르면 data-theme 가 없어진다
  await pickTheme(page, 'system');
  assert.equal(await theme(), null);
  assert.equal(await btn.getAttribute('aria-label'), '테마: 시스템');
});

test('stored dark theme paints before the app script runs', TIMEOUT, async () => {
  const page = await open('#/', {
    init: () => {
      try {
        localStorage.setItem('wzh:v1:progress', JSON.stringify({ version: 1, completed: {}, checks: {}, theme: 'dark' }));
      } catch {}
      new MutationObserver(() => {
        const root = document.documentElement;
        if (!window.__themeEarly && root?.hasAttribute('data-theme')) {
          window.__themeEarly = { value: root.getAttribute('data-theme'), topbar: Boolean(document.querySelector('.topbar')) };
        }
      }).observe(document, { subtree: true, attributes: true, attributeFilter: ['data-theme'] });
    },
  });
  const early = await page.evaluate(() => window.__themeEarly);
  assert.deepEqual(early, { value: 'dark', topbar: false }, '헤더가 그려지기 전에 다크가 붙는다');
});

test('375px: menu button shows, wordmark stays on one line, no horizontal scroll', TIMEOUT, async () => {
  for (const theme of ['light', 'dark']) {
    const page = await open('#/', { width: 375, theme });
    assert.equal(await page.locator('#menu-toggle').isVisible(), true);
    assert.equal(await page.locator('.search-word').isVisible(), false);
    assert.equal(await page.locator('#sidebar').isVisible(), false, '좁은 화면에서 목차는 서랍');
    const mark = await page.locator('.wordmark').boundingBox();
    assert.ok(mark.height <= 44, '워드마크 한 줄');
    assert.equal(await noHorizontalScroll(page), 0);
  }
});

test('a very long site title does not break the header at 375px', TIMEOUT, async () => {
  const page = await open('#/', { width: 375, file: 'long.html' });
  assert.equal(await noHorizontalScroll(page), 0);
  assert.equal((await page.locator('.topbar').boundingBox()).height, 56);
  for (const sel of ['#menu-toggle', '#search-open', '#theme-btn']) {
    const box = await page.locator(sel).boundingBox();
    assert.ok(box.x >= 0 && box.x + box.width <= 375, `${sel} 가 화면 안에 있다`);
  }
});

test('footer: links work, sits at the bottom on a short page, shows no personal data', TIMEOUT, async () => {
  const page = await open('#/settings', { width: 1280 });
  const foot = await page.locator('.site-footer').boundingBox();
  const vh = page.viewportSize().height;
  assert.ok(foot.y + foot.height >= vh - 1, `짧은 화면에서도 바닥에 붙는다 (${foot.y + foot.height} / ${vh})`);
  assert.equal(await page.locator('.footer-brand').innerText(), '픽스처 교재');
  // 사용자 결정(2026-11-12): 작성·빌드 날짜는 푸터에 두지 않는다. Label 은 글꼴 라이선스 한 줄
  assert.deepEqual(await page.locator('.site-footer .footer-meta').allInnerTexts(), ['글꼴: Wanted Sans · Galmuri11 · D2Coding (SIL Open Font License 1.1)']);
  assert.doesNotMatch(await page.locator('.site-footer').innerText(), /작성 기준|빌드 \d/);
  // 부록 링크는 그 페이지가 있을 때만 보인다(픽스처에는 start 만 있다)
  assert.equal(await page.locator('.footer-links a[href="#/page/start"]').isVisible(), true);
  assert.equal(await page.locator('.footer-links a[href="#/page/help"]').count(), 0);
  const text = await page.locator('.site-footer').innerText();
  assert.doesNotMatch(text, /@|만든 사람|명이|후기/);

  await page.locator('.footer-links a[href="#/page/start"]').click();
  await page.waitForFunction(() => document.getElementById('main').dataset.hash === '#/page/start');
  await page.locator('#settings-link').scrollIntoViewIfNeeded();
  await page.locator('#settings-link').click();
  await page.waitForFunction(() => document.getElementById('main').dataset.hash === '#/settings');
});

test('search page carries its own input that searches as you type', TIMEOUT, async () => {
  const page = await open('#/', { width: 1280 });
  await page.locator('#search-open').click();
  await page.waitForFunction(() => document.getElementById('main').dataset.hash === '#/search');
  const input = page.getByTestId('search-input');
  assert.equal(await input.getAttribute('aria-label'), '교재 검색');
  const before = await page.evaluate(() => history.length);
  await input.fill('픽스처');
  await page.waitForFunction(() => location.hash.startsWith('#/search?q='));
  assert.equal(await page.evaluate(() => document.activeElement?.dataset.testid), 'search-input', '치는 동안 포커스가 남는다');
  assert.equal(await page.evaluate(() => history.length), before, '검색어는 기록을 늘리지 않는다(replace)');
  assert.ok((await page.getByTestId('search-result').count()) > 0);
});

// ───────── 404 와 전 페이지 점검 ─────────

test('unknown ids and unknown paths show the 404 screen with a way home', TIMEOUT, async () => {
  for (const hash of ['#/nope', '#/day/zz-d99', '#/project/zz', '#/page/zz', '#/day/fa-d01/extra']) {
    const page = await open(hash, { width: 375 });
    assert.equal(await page.getByTestId('notfound').count(), 1, hash);
    assert.equal(await page.locator('main .btn-primary').count(), 1, hash);
    assert.equal(await page.locator('main .btn-primary').getAttribute('href'), '#/', hash);
    assert.equal(await page.locator('main .notfound svg.px-wrench').count(), 1, hash);
    assert.match(await page.title(), /^찾을 수 없어요 · /, hash);
    assert.equal(await noHorizontalScroll(page), 0, hash);
  }
});

test('404 actions: the help link sits on the same middle line as the home button', TIMEOUT, async () => {
  for (const width of [375, 1280]) {
    const page = await open('#/nope', { width, file: 'help.html' });
    // 상자가 줄 높이만큼 늘어날 수 있으므로 글자(텍스트 노드)가 그려진 자리를 잰다
    const textBox = (sel) =>
      page.locator(`main .notfound ${sel}`).evaluate((el) => {
        const range = document.createRange();
        range.selectNodeContents(el);
        const r = range.getBoundingClientRect();
        return { y: r.y, height: r.height };
      });
    const [btn, link] = [await textBox('.btn-primary'), await textBox('.text-link')];
    const mid = (b) => b.y + b.height / 2;
    assert.ok(Math.abs(mid(btn) - mid(link)) <= 3, `${width}px: 버튼 가운데 ${mid(btn)}, 링크 가운데 ${mid(link)}`);
  }
});

test('the notfound build shows 404 at an empty hash and links home by the configured url', TIMEOUT, async () => {
  const page = await open('', { width: 375, file: '404.html' });
  assert.equal(await page.getByTestId('notfound').count(), 1);
  assert.equal(await page.locator('main .btn-primary').getAttribute('href'), 'https://example.test/fixture/');
  assert.equal(await page.locator('.wordmark').getAttribute('href'), 'https://example.test/fixture/#/');
  const footerHrefs = await page.locator('.footer-links a').evaluateAll((els) => els.map((a) => a.getAttribute('href')));
  assert.ok(footerHrefs.length > 0 && footerHrefs.every((href) => href.startsWith('https://example.test/fixture/#/')), footerHrefs.join(' '));
  const sideHrefs = await page.locator('#sidebar a').evaluateAll((els) => els.map((a) => a.getAttribute('href')));
  assert.ok(sideHrefs.length > 0 && sideHrefs.every((href) => href.startsWith('https://example.test/fixture/#/')), sideHrefs.join(' '));
  assert.match(await page.title(), /^찾을 수 없어요 · /);
});

test('the normal build has no notfound flag', TIMEOUT, async () => {
  const page = await open('', { width: 375 });
  assert.equal(await page.locator('html').getAttribute('data-notfound'), null);
  assert.equal(await page.getByTestId('notfound').count(), 0, '빈 해시는 홈');
});

test('checkSite visits every route plus two 404s and reports no problems on the fixture', TIMEOUT, async () => {
  const { checkSite } = await import('../helpers/site-check.mjs');
  const { loadCurriculum } = await import('../../textbook/lib/curriculum.mjs');
  const { listRoutes } = await import('../../textbook/lib/site.mjs');
  const { curriculum } = await loadCurriculum(FIXTURE);
  const result = await checkSite({ baseUrl: server.url, cur: curriculum, launch });
  assert.deepEqual(result.problems, []);
  assert.equal(result.visited, listRoutes(curriculum).length + 2);
});

test('checkSite reports a page that never renders, scrolls sideways and logs errors', TIMEOUT, async () => {
  const { checkSite } = await import('../helpers/site-check.mjs');
  const dir = path.join(tmp, 'broken');
  await mkdir(dir, { recursive: true });
  await writeFile(
    path.join(dir, 'index.html'),
    '<!doctype html><html><body><div style="width:3000px">넓다</div><script>console.error("깨짐")</script></body></html>',
  );
  const broken = await startStaticServer(dir);
  try {
    const cur = { projects: [{ id: 'fa', days: [{ id: 'fa-d01' }] }], pages: [] };
    const result = await checkSite({ baseUrl: broken.url, cur, launch, timeout: 500 });
    assert.equal(result.visited, 7); // 홈·설정·검색·프로젝트·Day 5개 + 404 두 개. 실패해도 끝까지 돈다
    const all = result.problems.join('\n');
    for (const want of ['화면이 그려지지 않았어요', '가로 스크롤', '콘솔 오류']) assert.ok(all.includes(want), `${want}\n${all}`);
  } finally {
    await broken.close();
  }
});

test('no console errors on the opened screens', TIMEOUT, () => {
  for (const { errors } of opened) assert.deepEqual(errors, []);
});
