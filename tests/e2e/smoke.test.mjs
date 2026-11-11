// 통합 스모크 테스트: 실제 교재 전체를 index.html 로 빌드해 열고, 사이트맵(listRoutes)의 모든 화면과 404 두 개를 방문한다.
// 공통 점검(h1·콘솔 오류·가로 스크롤·상단 바·푸터·문서 밖 요청)은 tests/helpers/site-check.mjs 의 checkSite 가 맡고,
// Day 전용 점검(필수 h2 순서, 복사 버튼)은 여기서 onRoute 로 더한다.
// 실행: cd textbook && npm run test:e2e
// 다른 index.html(예: 저장소 루트의 미리보기)을 검사하려면 SMOKE_INDEX=<파일 경로> 를 준다. 그러면 새로 빌드하지 않는다.
// 주입한 진도: 모든 Day 완료 → 모든 Day·페이지가 열려 있다. 화면 폭은 360px.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { build } from '../../textbook/build.mjs';
import { loadCurriculum } from '../../textbook/lib/curriculum.mjs';
import { listRoutes } from '../../textbook/lib/site.mjs';
import { launch } from '../helpers/browser.mjs';
import { checkSite } from '../helpers/site-check.mjs';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
// SMOKE_CONTENT=<폴더> 로 다른 content 사본을 검사할 수 있다 (누락 Day 를 잡는지 확인할 때 사용).
const CONTENT = process.env.SMOKE_CONTENT ? path.resolve(process.env.SMOKE_CONTENT) : path.join(ROOT, 'textbook', 'content');
const TIMEOUT = { timeout: 300_000 };

// Day 필수 h2 (U+FE0F 유무는 무시). "📚 더 알아보기"는 선택이라 검사하지 않는다.
const REQUIRED_H2 = ['🎯 오늘의 목표', '📖 개념 이해', '🛠️ 따라하기', '✍️ 과제', '✅ 정답', '🧯 자주 막히는 곳', '📝 오늘의 체크리스트'];
const plain = (s) => s.replace(/️/g, '').replace(/\s+/g, ' ').trim();

let tmp;
let indexUrl;
let curriculum;

before(async () => {
  ({ curriculum } = await loadCurriculum(CONTENT));

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
});

after(async () => {
  if (tmp) await rm(tmp, { recursive: true, force: true });
});

test('smoke: every route in the sitemap renders cleanly at 360px', TIMEOUT, async () => {
  const stats = { withFile: 0, p1WithFile: 0, comingSoon: 0, codeBlocks: 0 };

  /** Day 화면만 더 본다: 준비 중이 아니면 필수 h2 순서와 코드 블록마다 복사 버튼 */
  async function dayChecks(hash, page) {
    if (!hash.startsWith('#/day/')) return [];
    const dayId = hash.slice('#/day/'.length);
    if (!curriculum.projects.some((p) => p.days.some((d) => d.id === dayId))) return []; // 404 확인용 경로
    const problems = [];
    const soon = (await page.locator('main .coming-soon').count()) > 0;
    if (soon) {
      stats.comingSoon++;
      // P1 은 30일 모두 내용이 있어야 한다 (다른 프로젝트는 준비 중일 수 있다)
      if (dayId.startsWith('p1-')) problems.push('P1 Day 가 준비 중(coming-soon)으로 나와요');
      return problems;
    }
    stats.withFile++;
    if (dayId.startsWith('p1-')) stats.p1WithFile++;
    const h2 = (await page.locator('main h2').allInnerTexts()).map(plain);
    const codeBlocks = await page.locator('main figure.code').count();
    const copyButtons = await page.locator('main figure.code button.copy').count();
    stats.codeBlocks += codeBlocks;
    // 필수 h2 7개가 이 순서로 모두 있어야 한다 (사이에 다른 h2 가 끼는 것은 막지 않는다)
    let at = -1;
    for (const want of REQUIRED_H2.map(plain)) {
      const found = h2.indexOf(want, at + 1);
      if (found === -1) {
        problems.push(`h2 "${want}" 없음 또는 순서 어긋남 (있는 h2: ${h2.join(' | ')})`);
        break;
      }
      at = found;
    }
    if (copyButtons !== codeBlocks) problems.push(`복사 버튼 ${copyButtons}개, 코드 블록 ${codeBlocks}개`);
    return problems;
  }

  const { visited, problems } = await checkSite({ baseUrl: indexUrl, cur: curriculum, width: 360, launch, onRoute: dayChecks });
  console.log(`smoke: 방문 ${visited}개(사이트맵 ${listRoutes(curriculum).length} + 404 2), Day ${stats.withFile}개 검사, 준비 중 ${stats.comingSoon}개, 코드 블록 ${stats.codeBlocks}개`);
  assert.deepEqual(problems, [], `\n${problems.join('\n')}`);
  assert.equal(visited, listRoutes(curriculum).length + 2);
  assert.equal(stats.p1WithFile, 30, 'P1 Day 30개는 모두 내용이 있어야 해요');
});
