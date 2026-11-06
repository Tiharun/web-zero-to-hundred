// P1 통합 스모크 테스트: 실제 교재 전체를 index.html 로 빌드해 열고, 모든 Day·페이지 route 를 차례로 방문한다.
// 실행: cd textbook && npm run test:e2e
// 다른 index.html(예: 저장소 루트의 미리보기)을 검사하려면 SMOKE_INDEX=<파일 경로> 를 준다. 그러면 새로 빌드하지 않는다.
// 주입한 진도: 모든 Day 완료 → 모든 Day·페이지가 열려 있다. 화면 폭은 360px.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { build } from '../../textbook/build.mjs';
import { STORAGE_KEY } from '../../textbook/src/app/progress.js';
import { launch, collectConsoleErrors } from '../helpers/browser.mjs';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const CONTENT = path.join(ROOT, 'textbook', 'content');
const TIMEOUT = { timeout: 300_000 };

// Day 필수 h2 (U+FE0F 유무는 무시). "📚 더 알아보기"는 선택이라 검사하지 않는다.
const REQUIRED_H2 = ['🎯 오늘의 목표', '📖 개념 이해', '🛠️ 따라하기', '✍️ 과제', '✅ 정답', '🧯 자주 막히는 곳', '📝 오늘의 체크리스트'];
const plain = (s) => s.replace(/️/g, '').replace(/\s+/g, ' ').trim();

let tmp;
let browser;
let context;
let indexUrl;
let days = []; // { id, ... }
let pages = [];

before(async () => {
  const curriculum = JSON.parse(await readFile(path.join(CONTENT, 'curriculum.json'), 'utf8'));
  for (const p of curriculum.projects) {
    p.days.forEach((_, i) => days.push(`${p.id}-d${String(i + 1).padStart(2, '0')}`));
  }
  pages = curriculum.pages.map((pg) => pg.id);

  if (process.env.SMOKE_INDEX) {
    const file = path.resolve(process.env.SMOKE_INDEX);
    await stat(file);
    indexUrl = pathToFileURL(file).href;
  } else {
    tmp = await mkdtemp(path.join(tmpdir(), 'wzh-smoke-'));
    const r = await build({ contentDir: CONTENT, allowMissing: true });
    assert.equal(r.ok, true, JSON.stringify(r.errors));
    const file = path.join(tmp, 'index.html');
    await writeFile(file, r.html);
    indexUrl = pathToFileURL(file).href;
  }

  const progress = {
    version: 1,
    completed: Object.fromEntries(days.map((id) => [id, '2026-01-01T00:00:00.000Z'])),
    checks: {},
    lastDay: null,
    theme: 'light',
  };
  browser = await launch();
  context = await browser.newContext({ viewport: { width: 360, height: 800 }, locale: 'ko-KR', colorScheme: 'light' });
  await context.addInitScript(
    ({ key, value }) => {
      try {
        localStorage.setItem(key, value);
      } catch {
        /* 무시 */
      }
    },
    { key: STORAGE_KEY, value: JSON.stringify(progress) },
  );
});

after(async () => {
  await context?.close();
  await browser?.close();
  if (tmp) await rm(tmp, { recursive: true, force: true });
});

const decode = (s) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};

/** 한 화면을 열고 그려질 때까지 기다린 뒤, 콘솔 오류·외부 요청·가로 스크롤을 점검한다. */
async function visitAndCheck(page, errors, hash, inspect) {
  const before = errors.length;
  if (page.url() === 'about:blank') await page.goto(indexUrl + hash);
  else await page.evaluate((h) => { location.hash = h; }, hash);
  await page.waitForFunction((h) => {
    const d = (s) => { try { return decodeURIComponent(s); } catch { return s; } };
    return d(document.getElementById('main')?.dataset.hash ?? '') === d(h);
  }, hash, { timeout: 10_000 });
  await page.locator('main h1').first().waitFor();

  const info = await inspect(page);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  const newErrors = errors.slice(before);
  return { info, overflow, newErrors };
}

test('smoke: every day and page route renders cleanly at 360px', TIMEOUT, async () => {
  const page = await context.newPage();
  const errors = collectConsoleErrors(page);
  const external = [];
  page.on('request', (request) => {
    if (!/^(file|data|blob|about):/.test(request.url())) external.push(request.url());
  });

  const problems = [];
  const stats = { withFile: 0, comingSoon: 0, pages: 0, codeBlocks: 0 };

  for (const dayId of days) {
    const hash = `#/day/${dayId}`;
    const r = await visitAndCheck(page, errors, hash, async (p) => {
      const soon = (await p.locator('main .coming-soon').count()) > 0;
      const h2 = (await p.locator('main h2').allInnerTexts()).map(plain);
      const codeBlocks = await p.locator('main figure.code').count();
      const copyButtons = await p.locator('main figure.code button.copy').count();
      return { soon, h2, codeBlocks, copyButtons };
    });
    const { soon, h2, codeBlocks, copyButtons } = r.info;
    if (soon) {
      stats.comingSoon++;
    } else {
      stats.withFile++;
      stats.codeBlocks += codeBlocks;
      // 필수 h2 7개가 이 순서로 모두 있어야 한다 (사이에 다른 h2 가 끼는 것은 막지 않는다)
      let at = -1;
      for (const want of REQUIRED_H2.map(plain)) {
        const found = h2.indexOf(want, at + 1);
        if (found === -1) {
          problems.push(`${dayId}: h2 "${want}" 없음 또는 순서 어긋남 (있는 h2: ${h2.join(' | ')})`);
          break;
        }
        at = found;
      }
      if (copyButtons !== codeBlocks) problems.push(`${dayId}: 복사 버튼 ${copyButtons}개, 코드 블록 ${codeBlocks}개`);
    }
    if (r.newErrors.length) problems.push(`${dayId}: 콘솔 오류 ${JSON.stringify(r.newErrors)}`);
    if (r.overflow > 0) problems.push(`${dayId}: 360px 가로 스크롤 (+${r.overflow}px)`);
  }

  for (const pageId of pages) {
    const r = await visitAndCheck(page, errors, `#/page/${pageId}`, async () => null);
    stats.pages++;
    if (r.newErrors.length) problems.push(`page ${pageId}: 콘솔 오류 ${JSON.stringify(r.newErrors)}`);
    if (r.overflow > 0) problems.push(`page ${pageId}: 360px 가로 스크롤 (+${r.overflow}px)`);
  }

  // 홈, 설정, 프로젝트 화면도 같은 기준으로 본다
  for (const hash of ['#/', '#/settings', '#/project/p1']) {
    const r = await visitAndCheck(page, errors, hash, async () => null);
    if (r.newErrors.length) problems.push(`${hash}: 콘솔 오류 ${JSON.stringify(r.newErrors)}`);
    if (r.overflow > 0) problems.push(`${hash}: 360px 가로 스크롤 (+${r.overflow}px)`);
  }

  if (external.length) problems.push(`외부 요청: ${external.join(', ')}`);
  console.log(`smoke: Day ${stats.withFile}개 검사, 준비 중 ${stats.comingSoon}개, 페이지 ${stats.pages}개, 코드 블록 ${stats.codeBlocks}개`);
  await page.close();
  assert.deepEqual(problems, [], `\n${problems.join('\n')}`);
  assert.ok(stats.withFile >= 30, 'P1 Day 30개는 모두 내용이 있어야 해요');
});
