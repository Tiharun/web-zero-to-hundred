// P1 레퍼런스(나의 크리에이터 홈페이지) 검증 테스트
// 실행: node --test tests/reference/p1.test.mjs
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { startStaticServer } from '../helpers/static-server.mjs';
import { launch, collectConsoleErrors } from '../helpers/browser.mjs';

const ROOT = fileURLToPath(new URL('../../reference/p1-my-creator-site/', import.meta.url));
const PAGES = ['index.html', 'about.html', 'contents.html', 'schedule.html', 'contact.html'];
const OVERLAY_PATH = 'overlay/countdown.html';

const videos = JSON.parse(readFileSync(ROOT + 'data/videos.json', 'utf8'));
const schedule = JSON.parse(readFileSync(ROOT + 'data/schedule.json', 'utf8'));

let server;
let browser;

before(async () => {
  server = await startStaticServer(ROOT);
  browser = await launch();
});

after(async () => {
  await browser?.close();
  await server?.close();
});

// ---------- 도우미 ----------

// 테스트마다 새 브라우저 컨텍스트를 만들어서 localStorage가 섞이지 않게 한다.
// 127.0.0.1 이외의 요청(YouTube 등)은 가짜 응답으로 막아서 네트워크에 의존하지 않게 한다.
async function openContext(t, options = {}) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    locale: 'ko-KR',
    timezoneId: 'Asia/Seoul',
    colorScheme: 'light',
    ...options,
  });
  t.after(() => context.close());

  const external = [];
  await context.route(
    (url) => url.hostname !== '127.0.0.1',
    (route) => {
      external.push(route.request().url());
      return route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>stub</title>' });
    },
  );

  const page = await context.newPage();
  const errors = collectConsoleErrors(page);
  return { context, page, errors, external };
}

// 페이지를 열고, 자바스크립트가 그려 주는 내용까지 기다린다.
async function gotoPage(page, path) {
  const response = await page.goto(server.url + path);
  if (path.startsWith('contents.html')) await page.waitForSelector('#video-list .card');
  if (path.startsWith('schedule.html')) await page.waitForFunction(() => document.querySelector('#next-broadcast')?.textContent.trim() !== '');
  await page.waitForLoadState('networkidle');
  return response;
}

// 한국 시간 "HH:MM" 문자열 (테스트가 돌아가는 컴퓨터의 시간대와 상관없이 계산)
function seoulHHMM(date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type) => parts.find((part) => part.type === type).value;
  return `${get('hour')}:${get('minute')}`;
}

const overlayUrl = (title, start) => `${OVERLAY_PATH}?title=${encodeURIComponent(title)}&start=${encodeURIComponent(start)}`;

// ---------- 테스트 ----------

test('all pages load without console errors', async (t) => {
  const { page, errors } = await openContext(t);
  for (const path of [...PAGES, overlayUrl('테스트', '23:59')]) {
    const response = await gotoPage(page, path);
    assert.equal(response.status(), 200, `${path} 응답 코드`);
  }
  assert.deepEqual(errors, []);
});

test('all internal links resolve', async (t) => {
  const { page, external } = await openContext(t);
  const allowedExternal = /^https:\/\/(www\.)?(youtube\.com|youtube-nocookie\.com)\//;
  const hasScheme = /^[a-z][a-z0-9+.-]*:/i;
  let checked = 0;

  for (const path of [...PAGES, overlayUrl('테스트', '23:59')]) {
    await gotoPage(page, path);
    const refs = await page.$$eval('a[href], img[src], link[href], script[src], iframe[src]', (elements) =>
      elements.map((element) => ({
        tag: element.tagName.toLowerCase(),
        value: element.getAttribute('href') ?? element.getAttribute('src'),
      })),
    );
    assert.ok(refs.length > 0, `${path}: 검사할 링크가 있어야 해요`);

    for (const { tag, value } of refs) {
      const label = `${path} <${tag}> ${value}`;
      if (value.startsWith('#')) {
        // 같은 페이지 안 이동: 가리키는 id가 있어야 한다
        const exists = await page.$(`[id="${value.slice(1)}"]`);
        assert.ok(exists, `${label}: 가리키는 id가 없어요`);
      } else if (hasScheme.test(value)) {
        assert.match(value, allowedExternal, `${label}: 허용한 외부 주소(YouTube)가 아니에요`);
      } else {
        assert.ok(!value.startsWith('/'), `${label}: 상대 경로여야 해요`);
        const response = await fetch(new URL(value, page.url()));
        assert.equal(response.status, 200, `${label}: 200이어야 해요`);
        checked += 1;
      }
    }
  }
  assert.ok(checked >= 30, `상대 경로 ${checked}개만 검사했어요`);

  // 외부로 나간 요청은 YouTube 임베드뿐이어야 한다
  for (const url of external) assert.match(url, allowedExternal, `예상하지 못한 외부 요청: ${url}`);
});

test('mobile menu toggles at 375px', async (t) => {
  const { page } = await openContext(t, { viewport: { width: 375, height: 700 } });
  await gotoPage(page, 'index.html');

  const toggle = page.locator('.menu-toggle');
  const nav = page.locator('#site-nav');
  assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
  assert.equal(await nav.isVisible(), false);

  await toggle.click();
  assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
  assert.equal(await nav.isVisible(), true);

  await toggle.click();
  assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
  assert.equal(await nav.isVisible(), false);
});

test('desktop shows the menu without a toggle button', async (t) => {
  const { page } = await openContext(t, { viewport: { width: 1024, height: 700 } });
  await gotoPage(page, 'index.html');
  assert.equal(await page.locator('.menu-toggle').isVisible(), false);
  assert.equal(await page.locator('#site-nav').isVisible(), true);
  assert.equal(await page.locator('#site-nav a[aria-current="page"]').count(), 1);
});

test('theme toggle persists', async (t) => {
  const { page } = await openContext(t);
  await gotoPage(page, 'index.html');

  const bodyBackground = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const theme = () => page.evaluate(() => document.documentElement.dataset.theme);
  const stored = () => page.evaluate(() => localStorage.getItem('theme'));
  const toggle = page.locator('.theme-toggle');

  assert.equal(await theme(), 'light');
  assert.equal(await toggle.getAttribute('aria-pressed'), 'false');
  const lightBackground = await bodyBackground();
  const label = (await toggle.textContent()).trim();
  assert.match(label, /다크 모드/);

  await toggle.click();
  assert.equal(await theme(), 'dark');
  assert.equal(await stored(), 'dark');
  // 켜졌는지는 aria-pressed로 알리고, 버튼 글자는 그대로 둔다
  assert.equal(await toggle.getAttribute('aria-pressed'), 'true');
  assert.equal((await toggle.textContent()).trim(), label);
  // 배경색은 0.2초 동안 부드럽게 바뀌므로(transition) 다크 배경색(#14121f)이 될 때까지 기다린다
  await page.waitForFunction(() => getComputedStyle(document.body).backgroundColor === 'rgb(20, 18, 31)');
  assert.notEqual(await bodyBackground(), lightBackground);

  // 새로고침하고 다른 페이지로 가도 다크 모드가 유지된다
  await page.reload();
  assert.equal(await theme(), 'dark');
  await gotoPage(page, 'about.html');
  assert.equal(await theme(), 'dark');

  await page.locator('.theme-toggle').click();
  assert.equal(await theme(), 'light');
  assert.equal(await stored(), 'light');
  assert.equal(await page.locator('.theme-toggle').getAttribute('aria-pressed'), 'false');
  assert.equal((await page.locator('.theme-toggle').textContent()).trim(), label);
});

test('theme follows the system preference until a choice is saved', async (t) => {
  const { page } = await openContext(t, { colorScheme: 'dark' });
  await gotoPage(page, 'index.html');
  assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), 'dark');
  assert.equal(await page.evaluate(() => localStorage.getItem('theme')), null);
});

test('home greeting matches the time of day', async (t) => {
  const { page, errors } = await openContext(t);
  await page.clock.setFixedTime(new Date('2026-11-01T01:00:00Z')); // 한국 시간 오전 10시
  await gotoPage(page, 'index.html');
  assert.match(await page.locator('#greeting').textContent(), /아침/);

  await page.clock.setFixedTime(new Date('2026-11-01T11:00:00Z')); // 한국 시간 저녁 8시
  await page.reload();
  assert.match(await page.locator('#greeting').textContent(), /저녁/);
  assert.deepEqual(errors, []);
});

test('contents render from json and filter by category', async (t) => {
  const { page, errors } = await openContext(t);
  await gotoPage(page, 'contents.html');

  const cards = page.locator('#video-list .card');
  const count = page.locator('#result-count');
  const filter = (category) => page.locator(`#category-filters button[data-category="${category}"]`);
  assert.equal(await cards.count(), videos.length);
  assert.match(await count.textContent(), new RegExp(String(videos.length)));

  // 카테고리 필터
  for (const category of ['game', 'talk', 'music']) {
    await filter(category).click();
    const expected = videos.filter((video) => video.category === category);
    assert.equal(await cards.count(), expected.length, `${category} 카드 수`);
    assert.equal(await filter(category).getAttribute('aria-pressed'), 'true');
    assert.equal(await filter('all').getAttribute('aria-pressed'), 'false');
    const titles = await cards.locator('h3').allTextContents();
    assert.deepEqual(titles.sort(), expected.map((video) => video.title).sort());
  }

  // 검색 (카테고리와 함께 동작)
  await filter('all').click();
  assert.equal(await cards.count(), videos.length);
  const word = videos[0].title.slice(0, 2);
  await page.fill('#search', word);
  assert.equal(await cards.count(), videos.filter((video) => video.title.includes(word)).length);

  await page.fill('#search', '이런제목은없어요');
  assert.equal(await cards.count(), 0);
  assert.equal(await page.locator('#empty-message').isVisible(), true);

  await page.fill('#search', '');
  assert.equal(await cards.count(), videos.length);
  assert.equal(await page.locator('#empty-message').isVisible(), false);

  // 카드 안의 링크는 YouTube 영상으로 연결된다
  const hrefs = await cards.locator('a').evaluateAll((links) => links.map((link) => link.href));
  assert.deepEqual(hrefs.sort(), videos.map((video) => `https://www.youtube.com/watch?v=${video.youtubeId}`).sort());

  assert.deepEqual(errors, []);
});

test('contents shows a friendly message when the json cannot be loaded', async (t) => {
  const { page, context } = await openContext(t);
  await context.route('**/data/videos.json', (route) => route.abort());
  await page.goto(server.url + 'contents.html');
  const message = page.locator('#load-error');
  await message.waitFor();
  assert.match(await message.textContent(), /불러오지 못했어요/);
  assert.equal(await page.locator('#video-list .card').count(), 0);
});

test('contents keeps the loading state until videos.json arrives', async (t) => {
  const { page, context } = await openContext(t);
  // videos.json 응답을 우리가 풀어 줄 때까지 붙잡아 둔다
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  t.after(() => release());
  await context.route('**/data/videos.json', async (route) => {
    await gate;
    await route.continue();
  });

  await page.goto(server.url + 'contents.html');
  const loading = page.locator('#load-status');
  await loading.waitFor();

  // 불러오는 중에 버튼을 누르고 검색해도 "영상 0개" 같은 잘못된 안내가 나오면 안 된다
  await page.click('#category-filters button[data-category="game"]');
  await page.fill('#search', '신작');
  assert.equal(await page.locator('#empty-message').isVisible(), false);
  assert.equal((await page.locator('#result-count').textContent()).trim(), '');
  assert.equal(await loading.isVisible(), true);

  // 데이터가 오면, 그 사이에 고른 카테고리와 검색어가 바로 적용된다
  release();
  await page.waitForSelector('#video-list .card');
  const expected = videos.filter((video) => video.category === 'game' && video.title.includes('신작'));
  assert.ok(expected.length > 0);
  assert.equal(await page.locator('#video-list .card').count(), expected.length);
  assert.equal(await loading.isVisible(), false);
  assert.match(await page.locator('#result-count').textContent(), new RegExp(String(expected.length)));
});

test('contact shows validation errors then success', async (t) => {
  const { page, errors } = await openContext(t);
  await gotoPage(page, 'contact.html');

  const status = page.locator('#form-status');
  const error = (id) => page.locator(`#${id}-error`);
  const submit = () => page.click('#contact-form button[type="submit"]');

  // role="status"는 이미 aria-live 영역이라 aria-live를 또 쓰지 않는다
  assert.equal(await status.getAttribute('role'), 'status');
  assert.equal(await status.getAttribute('aria-live'), null);

  // 1) 빈 채로 보내면 필수 칸 3개에 오류가 보인다 (닉네임은 선택이라 괜찮다)
  await submit();
  for (const id of ['name', 'email', 'message']) {
    assert.ok((await error(id).textContent()).trim().length > 0, `${id} 오류 메시지`);
    assert.equal(await page.locator(`#${id}`).getAttribute('aria-invalid'), 'true');
  }
  assert.equal((await error('nickname').textContent()).trim(), '');
  assert.equal(await page.locator('#nickname').getAttribute('aria-invalid'), null);
  assert.match(await status.textContent(), /3군데/);
  assert.equal(await page.evaluate(() => document.activeElement.id), 'name', '첫 오류 칸으로 포커스가 가요');

  // 2) 고치는 동안 오류 문장과 맨 아래 안내의 개수가 함께 줄어든다
  await page.fill('#name', '시청자');
  assert.equal((await error('name').textContent()).trim(), '');
  assert.match(await status.textContent(), /2군데/);
  await page.fill('#email', 'abc');
  assert.match(await error('email').textContent(), /형식/);
  assert.match(await status.textContent(), /2군데/);
  await page.fill('#message', '방송 잘 보고 있어요! 응원합니다.');
  assert.match(await status.textContent(), /1군데/);

  // 3) 다시 보내도 이메일 칸만 오류가 남는다
  await submit();
  assert.equal((await error('name').textContent()).trim(), '');
  assert.match(await error('email').textContent(), /형식/);
  assert.equal((await error('message').textContent()).trim(), '');
  assert.match(await status.textContent(), /1군데/);

  // 4) 마지막 오류를 고치면 "고칠 곳이 N군데" 안내가 사라진다
  await page.fill('#email', 'viewer@example.com');
  assert.equal((await error('email').textContent()).trim(), '', '입력하면 바로 오류가 지워져요');
  assert.equal((await status.textContent()).trim(), '');
  assert.equal(await status.getAttribute('class'), 'form-status');

  // 5) 보내면 성공 메시지가 나오고 폼이 비워진다
  await submit();
  assert.match(await status.textContent(), /감사/);
  assert.equal(await page.inputValue('#name'), '', '성공 뒤에는 폼을 비워요');
  assert.equal(await page.locator('#name').getAttribute('aria-invalid'), null);

  assert.deepEqual(errors, []);
});

test('contact validates the optional nickname with the pattern attribute', async (t) => {
  const { page, errors } = await openContext(t);
  await gotoPage(page, 'contact.html');

  const nickname = page.locator('#nickname');
  const status = page.locator('#form-status');
  assert.equal(await nickname.getAttribute('pattern'), '[A-Za-z0-9가-힣_]{2,20}');

  await page.fill('#name', '시청자');
  await page.fill('#email', 'viewer@example.com');
  await page.fill('#message', '방송 잘 보고 있어요! 응원합니다.');

  // 규칙에 맞지 않는 닉네임: 너무 짧음, 공백, 특수문자, 너무 김
  for (const bad of ['가', 'a b', 'a!b', 'a'.repeat(21)]) {
    await nickname.fill(bad);
    await page.click('#contact-form button[type="submit"]');
    assert.equal(await nickname.getAttribute('aria-invalid'), 'true', `"${bad}"는 오류여야 해요`);
    assert.match(await page.locator('#nickname-error').textContent(), /닉네임/);
    assert.match(await status.textContent(), /1군데/);
    assert.equal(await page.evaluate(() => document.activeElement.id), 'nickname');
  }

  // 규칙에 맞게 고치면 오류와 안내가 지워지고, 보내면 성공한다
  await nickname.fill('달빛_곰2');
  assert.equal((await page.locator('#nickname-error').textContent()).trim(), '');
  assert.equal((await status.textContent()).trim(), '');
  await page.click('#contact-form button[type="submit"]');
  assert.match(await status.textContent(), /감사/);
  assert.equal(await nickname.inputValue(), '');

  assert.deepEqual(errors, []);
});

test('schedule table matches schedule.json', async (t) => {
  const { page } = await openContext(t);
  await gotoPage(page, 'schedule.html');

  for (let day = 0; day <= 6; day += 1) {
    const rows = page.locator(`#schedule-table tbody tr[data-day="${day}"]`);
    assert.equal(await rows.count(), 1, `data-day=${day} 행은 하나`);
    const entry = schedule.find((item) => item.day === day);
    const text = await rows.first().textContent();
    if (entry) {
      assert.ok(text.includes(entry.start), `${day}요일 시간`);
      assert.ok(text.includes(entry.title), `${day}요일 제목`);
    } else {
      assert.match(text, /휴방/);
    }
  }
});

test('schedule highlights today and counts down to the next broadcast', async (t) => {
  // 컴퓨터 시간이 한국 시간(Asia/Seoul)이라고 가정하는 코드다. 시계를 고정해서 확인한다.
  // 2026-11-01 16:00 UTC = 한국 시간 월요일 01:00
  const { page } = await openContext(t);
  await page.clock.setFixedTime(new Date('2026-11-01T16:00:00Z'));
  await gotoPage(page, 'schedule.html');

  assert.deepEqual(await page.locator('#schedule-table tr.today').evaluateAll((rows) => rows.map((row) => row.dataset.day)), ['1']);
  const next = await page.locator('#next-broadcast').textContent();
  assert.match(next, /월요일/);
  assert.match(next, /20:00/);
  assert.match(next, /19:00:00/);

  // 월요일 방송이 끝난 저녁에는 다음 방송(수요일 21:00)까지 2일 남는다
  await page.clock.setFixedTime(new Date('2026-11-02T12:00:00Z')); // 한국 시간 월요일 21:00
  await page.waitForFunction(() => document.querySelector('#next-broadcast').textContent.includes('수요일'));
  assert.match(await page.locator('#next-broadcast').textContent(), /2일 00:00:00/);
});

test('overlay shows countdown and transparent background', async (t) => {
  const { page, errors } = await openContext(t);
  await page.goto(server.url + overlayUrl('테스트', '23:59'));

  assert.equal(await page.locator('#title').textContent(), '테스트');

  // 한국 시간이 23:59를 넘었다면 "곧 시작해요!"가 맞는 상태다
  const countdown = page.locator('#countdown');
  await page.waitForFunction(() => /^(\d{2}:\d{2}:\d{2}|곧 시작해요!)$/.test(document.querySelector('#countdown').textContent.trim()));
  assert.match((await countdown.textContent()).trim(), /^(\d{2}:\d{2}:\d{2}|곧 시작해요!)$/);

  const backgrounds = await page.evaluate(() => ({
    html: getComputedStyle(document.documentElement).backgroundColor,
    body: getComputedStyle(document.body).backgroundColor,
  }));
  assert.equal(backgrounds.body, 'rgba(0, 0, 0, 0)');
  assert.equal(backgrounds.html, 'rgba(0, 0, 0, 0)');
  assert.deepEqual(errors, []);
});

test('overlay counts down to a start time 2 minutes ahead', async (t) => {
  // 시계를 한국 시간 14:00:00으로 고정하고, 지금(한국 시간) + 2분을 start로 넘긴다.
  const { page } = await openContext(t);
  const now = new Date('2026-11-01T05:00:00Z');
  await page.clock.install({ time: now });
  await page.clock.pauseAt(new Date(now.getTime() + 1000));
  const start = seoulHHMM(new Date(now.getTime() + 2 * 60 * 1000));
  assert.equal(start, '14:02');

  await page.goto(server.url + overlayUrl('저녁 방송', start));
  const countdown = page.locator('#countdown');
  assert.equal((await countdown.textContent()).trim(), '00:01:59'); // pauseAt으로 1초 흐른 뒤

  await page.clock.runFor(60 * 1000);
  assert.equal((await countdown.textContent()).trim(), '00:00:59');

  // 시간이 지나면 "곧 시작해요!"
  await page.clock.runFor(60 * 1000);
  assert.equal((await countdown.textContent()).trim(), '곧 시작해요!');
});

test('overlay says it is about to start when the time has already passed', async (t) => {
  const { page } = await openContext(t);
  await page.clock.setFixedTime(new Date('2026-11-01T05:00:00Z')); // 한국 시간 14:00
  await page.goto(server.url + overlayUrl('이미 지난 방송', '13:00'));
  await page.waitForFunction(() => document.querySelector('#countdown').textContent.trim() === '곧 시작해요!');
  assert.equal(await page.locator('#title').textContent(), '이미 지난 방송');
});

test('overlay explains how to use the url when parameters are missing', async (t) => {
  const { page, errors } = await openContext(t);
  await page.goto(server.url + OVERLAY_PATH);
  const hint = await page.locator('#countdown').textContent();
  assert.match(hint, /start=/);

  // 시(0~23)와 분(0~59) 범위를 벗어나거나 HH:MM 모양이 아니면 모두 안내 문장이 나온다
  for (const bad of ['25:99', '24:00', '12:60', '-1:30', 'abc', 'ab:cd', '20:', ':30', '1230', '10:30:00']) {
    await page.goto(server.url + overlayUrl('잘못된 시간', bad));
    assert.match(await page.locator('#countdown').textContent(), /start=/, `start=${bad}`);
  }

  // 범위 안의 값은 안내가 아니라 카운트다운(또는 "곧 시작해요!")이다
  for (const good of ['00:00', '07:05', '23:59']) {
    await page.goto(server.url + overlayUrl('올바른 시간', good));
    const text = (await page.locator('#countdown').textContent()).trim();
    assert.match(text, /^(\d{2}:\d{2}:\d{2}|곧 시작해요!)$/, `start=${good}`);
  }
  assert.deepEqual(errors, []);
});

test('no horizontal scroll at 360px on every page', async (t) => {
  const { page } = await openContext(t, { viewport: { width: 360, height: 740 } });
  const overflow = () => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

  for (const path of [...PAGES, overlayUrl('가로 스크롤 확인용 아주 긴 방송 제목입니다', '23:59')]) {
    await gotoPage(page, path);
    assert.ok((await overflow()) <= 0, `${path}: 가로 스크롤이 생겨요`);

    // 모바일 메뉴를 열어 둔 상태에서도 확인
    const toggle = page.locator('.menu-toggle');
    if (await toggle.count()) {
      await toggle.click();
      assert.ok((await overflow()) <= 0, `${path} (메뉴 열림): 가로 스크롤이 생겨요`);
    }
  }
});

test('accessibility and SEO basics on every page', async (t) => {
  const { page } = await openContext(t);

  for (const path of PAGES) {
    await gotoPage(page, path);
    const info = await page.evaluate(() => ({
      lang: document.documentElement.lang,
      title: document.title.trim(),
      description: document.querySelector('meta[name="description"]')?.content.trim() ?? '',
      viewport: document.querySelector('meta[name="viewport"]')?.content ?? '',
      ogTitle: document.querySelector('meta[property="og:title"]')?.content ?? '',
      icon: document.querySelector('link[rel="icon"]')?.getAttribute('href') ?? '',
      h1Count: document.querySelectorAll('h1').length,
      mainCount: document.querySelectorAll('main').length,
      imagesWithoutAlt: [...document.querySelectorAll('img')].filter((img) => !img.hasAttribute('alt')).length,
      images: document.querySelectorAll('img').length,
      headingLevels: [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')].map((heading) => Number(heading.tagName[1])),
      unlabeledFields: [...document.querySelectorAll('input, select, textarea')].filter((field) => !field.labels || field.labels.length === 0).length,
    }));

    assert.equal(info.lang, 'ko', `${path}: lang`);
    assert.ok(info.title.length > 0, `${path}: title`);
    assert.ok(info.description.length > 0, `${path}: meta description`);
    assert.match(info.viewport, /width=device-width/, `${path}: viewport`);
    assert.ok(info.ogTitle.length > 0, `${path}: og:title`);
    assert.equal(info.icon, 'favicon.svg', `${path}: favicon`);
    assert.equal(info.h1Count, 1, `${path}: h1은 하나`);
    assert.equal(info.mainCount, 1, `${path}: main은 하나`);
    assert.ok(info.images > 0, `${path}: 이미지가 있어야 해요`);
    assert.equal(info.imagesWithoutAlt, 0, `${path}: alt 없는 img`);
    assert.equal(info.unlabeledFields, 0, `${path}: label 없는 입력칸`);

    // 제목 단계는 건너뛰지 않는다 (h1 다음에 h3이 바로 오면 안 돼요)
    info.headingLevels.forEach((level, index) => {
      const previous = index === 0 ? 0 : info.headingLevels[index - 1];
      assert.ok(level <= previous + 1, `${path}: h${previous} 다음에 h${level}이 와요`);
    });
  }
});
