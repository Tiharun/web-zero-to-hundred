// 전 페이지 점검: 사이트맵(listRoutes)의 모든 화면과 404 두 개를 차례로 열어 기본 품질을 본다.
// 라이브러리: checkSite({ baseUrl, cur, width, launch }) → { visited, problems }
// 명령: npm run check:site -- <baseUrl>   (textbook 폴더에서. 실제 curriculum.json 을 쓴다)
//   예) npm run check:site -- https://tiharun.github.io/web-zero-to-hundred/
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { listRoutes } from '../../textbook/lib/site.mjs';
import { STORAGE_KEY } from '../../textbook/src/app/progress.js';

const NOT_FOUND_ROUTES = ['#/day/zz-d99', '#/nope'];
const TOPBAR_H = 56;

const decode = (s) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};

/**
 * @param {{ baseUrl: string, cur: { projects: { id: string, days: { id: string }[] }[], pages: { id: string }[] },
 *   width?: number, launch: () => Promise<import('playwright').Browser>, timeout?: number,
 *   onRoute?: (hash: string, page: import('playwright').Page) => Promise<string[]> }} options
 *   baseUrl: 교재 index.html 이 있는 주소(끝이 / 이면 그 폴더의 기본 문서). onRoute: 화면마다 더 볼 것(문제 목록을 돌려준다)
 * @returns {Promise<{ visited: number, problems: string[] }>}
 */
export async function checkSite({ baseUrl, cur, width = 375, launch, timeout = 10_000, onRoute = null }) {
  const routes = [...listRoutes(cur), ...NOT_FOUND_ROUTES];
  const docUrl = baseUrl.split('#')[0];
  const allowed = (url) => /^(data|blob|about):/.test(url) || url.startsWith(docUrl);

  // 모든 Day 를 끝낸 진도: 잠긴 화면 없이 전부 연다
  const completed = Object.fromEntries(cur.projects.flatMap((p) => p.days.map((d) => [d.id, '2026-01-01T00:00:00.000Z'])));
  const progress = { version: 1, completed, checks: {}, lastDay: null, theme: 'light' };

  const browser = await launch();
  const problems = [];
  let visited = 0;
  try {
    const context = await browser.newContext({ viewport: { width, height: 800 }, locale: 'ko-KR', colorScheme: 'light' });
    await context.addInitScript(
      ({ key, value }) => {
        try {
          localStorage.setItem(key, value);
        } catch {
          /* 저장소를 못 쓰는 환경이면 진도 없이 본다 */
        }
      },
      { key: STORAGE_KEY, value: JSON.stringify(progress) },
    );
    const page = await context.newPage();
    let errors = [];
    const external = new Set();
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('request', (r) => !allowed(r.url()) && external.add(r.url()));

    for (const hash of routes) {
      visited++;
      const report = (text) => problems.push(`${hash}: ${text}`);
      try {
        if (visited === 1) await page.goto(docUrl + hash);
        else await page.evaluate((h) => { location.hash = h; }, hash);
        await page.waitForFunction(
          (h) => {
            const d = (s) => { try { return decodeURIComponent(s); } catch { return s; } };
            return d(document.getElementById('main')?.dataset.hash ?? '') === d(h);
          },
          hash,
          { timeout },
        );
        await page.locator('main h1').first().waitFor({ state: 'visible', timeout });
      } catch {
        report('화면이 그려지지 않았어요 (main h1 없음)');
      }

      const shape = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        topbar: document.querySelector('.topbar')?.getBoundingClientRect().height ?? null,
        footer: document.querySelectorAll('.site-footer').length,
        notfound: document.querySelectorAll('[data-testid="notfound"]').length,
      }));
      if (shape.overflow > 0) report(`${width}px 가로 스크롤 (+${shape.overflow}px)`);
      if (shape.topbar !== TOPBAR_H) report(`상단 바 높이 ${shape.topbar}px (${TOPBAR_H}px 이어야 해요)`);
      if (shape.footer !== 1) report(`푸터 ${shape.footer}개`);
      const expectNotFound = NOT_FOUND_ROUTES.includes(hash);
      if (expectNotFound && shape.notfound !== 1) report('404 화면이 나오지 않았어요');
      if (!expectNotFound && shape.notfound !== 0) report('404 화면이 나왔어요');
      if (errors.length) report(`콘솔 오류 ${JSON.stringify(errors)}`);
      errors = [];
      if (onRoute) for (const p of await onRoute(hash, page)) report(p);
    }
    if (external.size) problems.push(`문서 밖 요청 ${external.size}개: ${[...external].slice(0, 5).join(', ')}`);
    await context.close();
  } finally {
    await browser.close();
  }
  return { visited, problems };
}

// ───────── 명령으로 실행 ─────────

async function main(argv) {
  const baseUrl = argv[0];
  if (!baseUrl) {
    console.log('사용법: npm run check:site -- <baseUrl>   예) http://127.0.0.1:8080/');
    return 1;
  }
  const { loadCurriculum } = await import('../../textbook/lib/curriculum.mjs');
  const { launch } = await import('./browser.mjs');
  const contentDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'textbook', 'content');
  const { curriculum } = await loadCurriculum(contentDir);
  const { visited, problems } = await checkSite({ baseUrl, cur: curriculum, launch });
  for (const p of problems) console.log(`문제 ${p}`);
  console.log(`방문 ${visited}개, 문제 ${problems.length}개`);
  return problems.length ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  process.exitCode = await main(process.argv.slice(2));
}
