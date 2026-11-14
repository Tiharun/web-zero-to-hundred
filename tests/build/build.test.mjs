import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, rm, stat, writeFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from '../../textbook/build.mjs';
import { readStyles, lintStyles, RAW_COLOR } from '../../textbook/lib/styles.mjs';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const FIXTURE = path.join(ROOT, 'tests', 'fixtures', 'content');
const BUILD = path.join(ROOT, 'textbook', 'build.mjs');

/** 임시 폴더를 만들어 fn(tmp)을 실행하고 지운다 */
async function withTmp(fn) {
  const tmp = await mkdtemp(path.join(tmpdir(), 'wzh-build-'));
  try {
    return await fn(tmp);
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
}

/** 픽스처 복사본에서 시작한다 */
async function withContentCopy(fn) {
  return withTmp(async (tmp) => {
    const content = path.join(tmp, 'content');
    await cp(FIXTURE, content, { recursive: true });
    return fn({ tmp, content, out: path.join(tmp, 'out', 'index.html') });
  });
}

function runBuild(args) {
  const r = spawnSync(process.execPath, [BUILD, ...args], { cwd: path.join(ROOT, 'textbook'), encoding: 'utf8' });
  return { status: r.status, stdout: r.stdout, stderr: r.stderr, output: `${r.stdout}\n${r.stderr}` };
}

function embeddedData(html) {
  const m = /<script id="wzh-data" type="application\/json">([\s\S]*?)<\/script>/.exec(html);
  assert.ok(m, 'wzh-data not found');
  return JSON.parse(m[1]);
}

const template = (html, id) => {
  const m = new RegExp(`<template id="${id}">([\\s\\S]*?)</template>`).exec(html);
  assert.ok(m, `template ${id} not found`);
  return m[1];
};

test('fixture builds to single file', async () => {
  await withTmp(async (tmp) => {
    const out = path.join(tmp, 'index.html');
    const r = runBuild(['--content', FIXTURE, '--out', out]);
    assert.equal(r.status, 0, r.output);
    assert.ok(existsSync(out));
    const html = await readFile(out, 'utf8');

    // 단일 파일: 외부 자원 없음
    assert.match(html, /<template id="t-day-fa-d01">/);
    assert.match(html, /<script id="wzh-data" type="application\/json">/);
    assert.ok(!html.includes('<script src='), 'external script');
    assert.doesNotMatch(html, /<link rel="stylesheet" href=/);
    // canonical 은 주소 표기일 뿐 불러오는 자원이 아니다
    assert.doesNotMatch(html, /<link(?![^>]*rel="canonical")[^>]+href=["']https?:/i);
    assert.ok((await stat(out)).size < 16 * 1024 * 1024);
    assert.doesNotMatch(html, /<!--WZH:/);

    // 쉘
    assert.match(html, /^<!doctype html>/i);
    assert.match(html, /<html lang="ko">/);
    assert.match(html, /<title>픽스처 교재<\/title>/);
    assert.match(html, /<meta name="viewport"/);
    for (const re of [
      /<a class="skip-link" href="#main"/,
      /<header class="topbar">/,
      /<aside id="sidebar"/,
      /<main id="main"[^>]*tabindex="-1"/,
      /<div id="storage-banner"[^>]*\bhidden\b/,
    ]) {
      assert.match(html, re);
    }

    // 템플릿: Day 3개 + 페이지 3개
    const ids = [...html.matchAll(/<template id="([^"]+)">/g)].map((m) => m[1]);
    assert.deepEqual(ids, ['t-day-fa-d01', 't-day-fa-d02', 't-day-fb-d01', 't-page-start', 't-page-secret', 't-page-glossary']);

    // 렌더 결과: 본문 속 HTML은 글자 그대로, 긴 코드 한 줄, 정답, 체크리스트, 용어 링크
    const d1 = template(html, 't-day-fa-d01');
    assert.match(d1, /&lt;b&gt;굵게아님&lt;\/b&gt;/);
    assert.doesNotMatch(d1, /<b>/);
    assert.match(d1, /<details class="answer" data-answer="fa-d01-a1">/);
    assert.equal((d1.match(/data-check="/g) ?? []).length, 3);
    assert.match(d1, /<a class="term" href="#\/page\/glossary\/term-픽스처용어">픽스처용어<\/a>/);
    assert.match(d1, /<h2 id="fa-d01-따라하기">/);
    assert.ok(/x{300,}/.test(d1));
    assert.match(d1, /<figcaption>C:\\dev\\fixture-a\\index\.html<\/figcaption>/);
    assert.match(template(html, 't-page-start'), /href="#\/day\/fa-d01"/);

    // 용어 사전 페이지: 한글 사전순, 항목마다 term-<slug>
    const glossary = template(html, 't-page-glossary');
    const termIds = [...glossary.matchAll(/<section class="term-entry" id="([^"]+)"/g)].map((m) => m[1]);
    assert.deepEqual(termIds, ['term-가나다-용어', 'term-픽스처용어']);

    // 임베드 데이터
    const data = embeddedData(html);
    assert.equal(data.title, '픽스처 교재');
    assert.equal(data.writtenAt, '2026-11');
    assert.match(data.builtAt, /^\d{4}-\d{2}-\d{2}$/, 'builtAt is the date only, so rebuilding on the same day does not change index.html');
    assert.deepEqual(
      data.projects.map((p) => p.id),
      ['fa', 'fb'],
    );
    const fa = data.projects[0];
    assert.deepEqual(
      Object.keys(fa).sort(),
      ['days', 'folder', 'id', 'order', 'outcome', 'requires', 'stack', 'subtitle', 'summary', 'title', 'track'].sort(),
    );
    assert.deepEqual(fa.days[0], {
      id: 'fa-d01',
      num: 1,
      title: '첫 번째 Day',
      minutes: 60,
      summary: '교재 화면 구성 요소를 확인해요.',
      checkCount: 3,
      ready: true,
    });
    assert.deepEqual(data.projects[1].requires, ['fa']);
    assert.deepEqual(data.pages, [
      { id: 'start', title: '시작하기', requires: [], meta: '교재 쓰는 법, 공부 원칙, 준비물' },
      { id: 'secret', title: '비밀 페이지', requires: ['fb'], meta: '' },
      { id: 'glossary', title: '용어 사전', requires: [], meta: '용어 2개를 한 줄 정의로' },
    ]);
    assert.deepEqual(
      data.search.map((s) => [s.id, s.kind, s.project]),
      [
        ['fa-d01', 'day', 'fa'],
        ['fa-d02', 'day', 'fa'],
        ['fb-d01', 'day', 'fb'],
        ['start', 'page', null],
        ['secret', 'page', null],
        ['glossary', 'page', null],
      ],
    );
    const secret = data.search.find((s) => s.id === 'fb-d01');
    assert.equal(secret.title, '비밀 Day');
    assert.match(secret.text, /비밀단어zz/);
    assert.match(data.search.find((s) => s.id === 'secret').text, /비밀페이지zz/);
    // 파일 경로는 임베드하지 않는다
    assert.ok(!JSON.stringify(data).includes(FIXTURE), 'absolute path leaked into data');
    assert.ok(!/day-0\d\.md/.test(JSON.stringify(data)), 'file names leaked into data');

    // 성공 요약: Day 수와 결과 크기(MB)
    assert.match(r.stdout, /Day 3/);
    assert.match(r.stdout, /\d+\.\d+ ?MB/);
  });
});

test('invalid content fails build', async () => {
  await withContentCopy(async ({ content, out }) => {
    const file = path.join(content, 'fa', 'day-01.md');
    const src = await readFile(file, 'utf8');
    await writeFile(file, src.replace('## ✅ 정답', ''));
    const r = runBuild(['--content', content, '--out', out]);
    assert.equal(r.status, 1, r.output);
    assert.match(r.stdout, /E_SECTION_MISSING/);
    assert.ok(!existsSync(out), 'must not write output on failure');
  });
});

test('errors are printed as path:line CODE message from both validator and renderer', async () => {
  await withContentCopy(async ({ content, out }) => {
    const file = path.join(content, 'fa', 'day-01.md');
    const src = await readFile(file, 'utf8');
    await writeFile(file, src.replace('[[픽스처용어]]', '[[없는용어]]').replace('## 🧯 자주 막히는 곳', '## 🧯 자주 막히는 곳\n\nTODO 나중에 채워요.'));
    const r = runBuild(['--content', content, '--out', out]);
    assert.equal(r.status, 1, r.output);
    const lines = r.stdout.split('\n');
    const term = lines.find((l) => l.includes('E_TERM_UNKNOWN'));
    const todo = lines.find((l) => l.includes('E_PLACEHOLDER'));
    assert.ok(term, r.stdout);
    assert.ok(todo, r.stdout);
    assert.match(term, /fa[\\/]day-01\.md:\d+ E_TERM_UNKNOWN .*없는용어/);
    assert.match(todo, /fa[\\/]day-01\.md:\d+ E_PLACEHOLDER /);
    assert.ok(!path.isAbsolute(term.split(':')[0]), 'paths are printed relative');
  });
});

test('check mode writes nothing', async () => {
  await withTmp(async (tmp) => {
    const out = path.join(tmp, 'out', 'index.html');
    const r = runBuild(['--check', '--content', FIXTURE, '--out', out]);
    assert.equal(r.status, 0, r.output);
    assert.ok(!existsSync(out));
    assert.ok(!existsSync(path.dirname(out)));
    assert.deepEqual(await readdir(tmp), []);
    assert.match(r.stdout, /Day 3/);
  });
});

test('missing day file fails by default', async () => {
  await withContentCopy(async ({ content, out }) => {
    await rm(path.join(content, 'fa', 'day-02.md'));
    const r = runBuild(['--content', content, '--out', out]);
    assert.equal(r.status, 1, r.output);
    assert.match(r.stdout, /fa[\\/]day-02\.md E_CUR_FILE_MISSING/);
    assert.ok(!existsSync(out));
  });
});

test('allow-missing builds with placeholder', async () => {
  await withContentCopy(async ({ content, out }) => {
    await rm(path.join(content, 'fa', 'day-02.md'));
    const r = runBuild(['--allow-missing', '--content', content, '--out', out]);
    assert.equal(r.status, 0, r.output);
    assert.match(r.stdout, /E_CUR_FILE_MISSING/); // 경고로 출력한다
    assert.match(r.stdout, /경고/);
    const html = await readFile(out, 'utf8');
    const body = template(html, 't-day-fa-d02');
    assert.match(body, /이 Day는 아직 준비 중이에요\./);
    assert.doesNotMatch(body, /data-check/);
    const data = embeddedData(html);
    const day = data.projects[0].days[1];
    assert.equal(day.id, 'fa-d02');
    assert.equal(day.checkCount, 0);
    assert.equal(day.ready, false, '준비 중 Day 는 ready: false');
    assert.equal(data.projects[0].days[0].ready, true);
    // 다른 Day는 그대로 렌더된다
    assert.match(template(html, 't-day-fa-d01'), /data-check/);
  });
});

test('allow-missing does not hide other errors', async () => {
  await withContentCopy(async ({ content, out }) => {
    await rm(path.join(content, 'fa', 'day-02.md'));
    const file = path.join(content, 'fb', 'day-01.md');
    await writeFile(file, (await readFile(file, 'utf8')).replace('## ✅ 정답', ''));
    const r = runBuild(['--allow-missing', '--content', content, '--out', out]);
    assert.equal(r.status, 1, r.output);
    assert.match(r.stdout, /E_SECTION_MISSING/);
  });
});

test('only mode ignores other missing days', async () => {
  await withContentCopy(async ({ content, out }) => {
    await rm(path.join(content, 'fa', 'day-02.md'));
    // 나머지 Day가 깨져 있어도 지정하지 않았으면 보지 않는다
    const broken = path.join(content, 'fb', 'day-01.md');
    await writeFile(broken, '## 엉터리\n');
    const r = runBuild(['--only', 'fa-d01', '--content', content, '--out', out]);
    assert.equal(r.status, 0, r.output);
    assert.doesNotMatch(r.stdout, /E_CUR_FILE_MISSING/);
    const html = await readFile(out, 'utf8');
    assert.match(template(html, 't-day-fa-d01'), /data-check/);
    // 지정하지 않은 Day도 템플릿은 있어서 화면이 깨지지 않는다
    assert.match(template(html, 't-day-fa-d02'), /아직 준비 중이에요/);
    assert.match(template(html, 't-day-fb-d01'), /아직 준비 중이에요/);
    // 용어·route는 전체 커리큘럼 기준: fb-d01로 가는 링크도 유효하다
    assert.equal(embeddedData(html).projects.length, 2);
  });
});

test('only mode still fails when a listed day is missing or invalid', async () => {
  await withContentCopy(async ({ content, out }) => {
    await rm(path.join(content, 'fa', 'day-02.md'));
    const missing = runBuild(['--only', 'fa-d02', '--content', content, '--out', out]);
    assert.equal(missing.status, 1, missing.output);
    assert.match(missing.stdout, /E_CUR_FILE_MISSING/);

    const file = path.join(content, 'fa', 'day-01.md');
    await writeFile(file, (await readFile(file, 'utf8')).replace('## ✅ 정답', ''));
    const invalid = runBuild(['--only', 'fa-d01', '--content', content, '--out', out]);
    assert.equal(invalid.status, 1, invalid.output);
    assert.match(invalid.stdout, /E_SECTION_MISSING/);

    const unknown = runBuild(['--only', 'fa-d01,zz-d09', '--content', content, '--out', out]);
    assert.equal(unknown.status, 1, unknown.output);
    assert.match(unknown.stdout, /zz-d09/);
  });
});

test('only mode validates routes against the whole curriculum', async () => {
  await withContentCopy(async ({ content, out }) => {
    const file = path.join(content, 'fa', 'day-01.md');
    await writeFile(file, (await readFile(file, 'utf8')) + '\n[잠긴 Day](#/day/fb-d01) [프로젝트](#/project/fb) [설정](#/settings) [처음](#/)\n');
    const ok = runBuild(['--only', 'fa-d01', '--content', content, '--out', out]);
    assert.equal(ok.status, 0, ok.output);
    await writeFile(file, (await readFile(file, 'utf8')) + '\n[없음](#/day/zz-d09) [없음2](#/page/nope)\n');
    const bad = runBuild(['--only', 'fa-d01', '--content', content, '--out', out]);
    assert.equal(bad.status, 1);
    assert.equal((bad.stdout.match(/E_LINK_UNKNOWN/g) ?? []).length, 2, bad.stdout);
  });
});

test('curriculum errors stop the build with path and code', async () => {
  await withContentCopy(async ({ content, out }) => {
    const file = path.join(content, 'curriculum.json');
    const cur = JSON.parse(await readFile(file, 'utf8'));
    cur.projects[0].days[0].minutes = 30;
    await writeFile(file, JSON.stringify(cur));
    const r = runBuild(['--content', content, '--out', out]);
    assert.equal(r.status, 1, r.output);
    assert.match(r.stdout, /curriculum\.json E_CUR_SCHEMA .*minutes/);
  });
});

test('orphan day file fails the build', async () => {
  await withContentCopy(async ({ content, out }) => {
    await writeFile(path.join(content, 'fb', 'day-02.md'), '## 아직 없는 Day\n');
    await writeFile(path.join(content, 'fb', '_outline.md'), '개요는 무시해요\n');
    const r = runBuild(['--content', content, '--out', out]);
    assert.equal(r.status, 1, r.output);
    assert.match(r.stdout, /fb[\\/]day-02\.md E_CUR_ORPHAN_FILE/);
    assert.doesNotMatch(r.stdout, /_outline/);
  });
});

test('duplicate glossary terms and a bad term link fail the build', async () => {
  await withContentCopy(async ({ content, out }) => {
    await writeFile(path.join(content, 'glossary', 'more.md'), '### 픽스처용어\n중복이에요.\n');
    const r = runBuild(['--content', content, '--out', out]);
    assert.equal(r.status, 1, r.output);
    assert.match(r.stdout, /glossary[\\/]more\.md:1 E_TERM_DUPLICATE/);
  });
});

test('troubleshooting page is generated from its fragments', async () => {
  await withContentCopy(async ({ content, out }) => {
    const file = path.join(content, 'curriculum.json');
    const cur = JSON.parse(await readFile(file, 'utf8'));
    cur.pages.push({ id: 'help', title: '문제 해결', generated: 'troubleshooting' });
    await writeFile(file, JSON.stringify(cur));
    await mkdir(path.join(content, 'troubleshooting'));
    await writeFile(path.join(content, 'troubleshooting', 'fa-basic.md'), '### 화면이 비어 있어요\n저장했는지 확인해요. [[픽스처용어]]\n');
    const r = runBuild(['--content', content, '--out', out]);
    assert.equal(r.status, 0, r.output);
    const html = await readFile(out, 'utf8');
    const page = template(html, 't-page-help');
    assert.match(page, /<h2[^>]*><span class="badge">[^]*?<\/span>픽스처 프로젝트 A<\/h2>/);
    assert.match(page, /화면이 비어 있어요/);
    assert.match(embeddedData(html).search.find((s) => s.id === 'help').text, /저장했는지/);
  });
});

test('size over 16MB is an error', async () => {
  await withContentCopy(async ({ content, out }) => {
    const file = path.join(content, 'fa', 'day-02.md');
    const src = await readFile(file, 'utf8');
    // 코드 한 줄을 17MB 만큼 늘린다 (렌더 결과가 한도를 넘는다)
    await writeFile(file, src.replace('1. 파일을 다시 열어요.', '```text\n' + 'a'.repeat(17 * 1024 * 1024) + '\n```'));
    const r = runBuild(['--content', content, '--out', out]);
    assert.equal(r.status, 1);
    assert.match(r.stdout, /E_SIZE_LIMIT/);
    assert.ok(!existsSync(out));
  });
});

test('unknown flags exit 1 with usage', () => {
  const r = runBuild(['--nope']);
  assert.equal(r.status, 1);
  assert.match(r.output, /--only/);
});

/** 파비콘이 읽는 색 토큰 세 개 (없으면 E_CSS_TOKEN) */
const FAVICON_TOKENS = ':root{--color-ink:#312E81;--color-accent:#DB2777;--color-accent-hover:#BE185D}';

test('tokens without the favicon colours stop the build with E_CSS_TOKEN', async () => {
  const r = await buildWithSrc({ 'styles/tokens.css': ':root{--x:#f00}', 'app/main.js': 'window.__wzh = 1;' });
  assert.equal(r.ok, false);
  assert.deepEqual(r.errors.map((e) => e.code), ['E_CSS_TOKEN']);
  assert.match(r.errors[0].file, /tokens\.css$/);
});

/** src 폴더 복사본(template.html 은 실제 파일, 그림 등록표는 빈 것, 나머지는 테스트용)으로 in-process 빌드한다 */
async function buildWithSrc(files) {
  return withTmp(async (tmp) => {
    const srcDir = path.join(tmp, 'src');
    await mkdir(path.join(srcDir, 'app'), { recursive: true });
    await cp(path.join(ROOT, 'textbook', 'src', 'template.html'), path.join(srcDir, 'template.html'));
    for (const [name, text] of Object.entries({ 'figures/index.js': 'export const FIGURES = {};', ...files })) {
      await mkdir(path.dirname(path.join(srcDir, name)), { recursive: true });
      await writeFile(path.join(srcDir, name), text);
    }
    return build({ contentDir: FIXTURE, srcDir });
  });
}

test('src/app is bundled into one inline script and styles/ is inlined in order', async () => {
  const r = await buildWithSrc({
    'styles/tokens.css': `${FAVICON_TOKENS}:root{--x:#f00}`,
    'styles/base.css': 'body{color:var(--x)}',
    'styles/day.css': '.x::after{content:"$&"}',
    'app/util.js': 'export const greet = (n) => `안녕 ${n} </script> $&`;',
    'app/main.js': 'import { greet } from "./util.js"; window.__wzh = greet("교재");',
  });
  assert.equal(r.ok, true, JSON.stringify(r.errors));
  assert.deepEqual(r.warnings, []);
  const css = /<style>([\s\S]*?)<\/style>/.exec(r.html)[1];
  const at = (s) => css.indexOf(s);
  assert.ok(at(':root{--x:#f00}') >= 0 && at(':root{--x:#f00}') < at('body{color:var(--x)}') && at('body{color:var(--x)}') < at('.x::after{content:"$&"}'), css);
  assert.doesNotMatch(r.html, /\bimport\b.*from/);
  assert.equal((r.html.match(/<script>/g) ?? []).length, 1);
  // 번들 안의 </script> 는 닫는 태그가 되지 않고, 실행하면 원래 값이 나온다
  const code = /<script>([\s\S]*?)<\/script>\s*<\/body>/.exec(r.html)[1];
  const win = {};
  new Function('window', code)(win);
  assert.equal(win.__wzh, '안녕 교재 </script> $&');
});

test('a broken script is reported as E_JS_BUNDLE with file and line', async () => {
  const r = await buildWithSrc({ 'app/main.js': 'const ok = 1;\nconst = ;\n' });
  assert.equal(r.ok, false);
  assert.equal(r.errors[0].code, 'E_JS_BUNDLE');
  assert.match(r.errors[0].file, /main\.js$/);
  assert.equal(r.errors[0].line, 2);
});

test('a missing styles/tokens.css is an error (E_NO_CSS), not a silent unstyled build', async () => {
  for (const files of [{}, { 'styles/base.css': 'body{margin:0}' }]) {
    const r = await buildWithSrc({ ...files, 'app/main.js': 'window.__wzh = 1;' });
    assert.equal(r.ok, false);
    assert.deepEqual(r.errors.map((e) => e.code), ['E_NO_CSS']);
    assert.match(r.errors[0].file, /tokens\.css$/);
    assert.match(r.errors[0].message, /tokens\.css/);
    assert.equal(r.html, undefined);
  }
});

test('a raw colour outside tokens and legacy stops the build with file and line', async () => {
  const r = await buildWithSrc({
    'styles/tokens.css': ':root{--x:#f00}',
    'styles/shell.css': 'a{color:var(--x)}\nb{color:#00ff00}',
    'app/main.js': 'window.__wzh = 1;',
  });
  assert.equal(r.ok, false);
  assert.deepEqual(r.errors.map((e) => [e.code, e.line]), [['E_CSS_RAW_COLOR', 2]]);
  assert.match(r.errors[0].file, /shell\.css$/);
});

test('the build embeds three subset fonts and loads nothing over the network', async () => {
  const r = await build({ contentDir: FIXTURE });
  assert.equal(r.ok, true, JSON.stringify(r.errors));
  const css = /<style>([\s\S]*?)<\/style>/.exec(r.html)[1];
  assert.equal((css.match(/@font-face/g) ?? []).length, 3);
  assert.equal((r.html.match(/url\(\s*["']?https?:/g) ?? []).length, 0);
  assert.deepEqual(Object.keys(r.stats.fonts), ['WZH Wanted Sans', 'WZH Galmuri11', 'WZH Code']);
});

test('a missing font source stops the build with E_FONT_SOURCE', async () => {
  await withTmp(async (tmp) => {
    const r = await build({ contentDir: FIXTURE, fontsDir: tmp, cacheDir: path.join(tmp, 'cache') });
    assert.equal(r.ok, false);
    assert.equal(r.errors[0].code, 'E_FONT_SOURCE');
  });
});

test('the real styles pass the token lint', async () => {
  const { files } = await readStyles(path.join(ROOT, 'textbook/src'));
  assert.deepEqual(lintStyles(files), []);
});

test('the real src builds the fixture without warnings and without churn on rebuild', async () => {
  const first = await build({ contentDir: FIXTURE });
  assert.equal(first.ok, true, JSON.stringify(first.errors));
  assert.deepEqual(first.warnings, []);
  const second = await build({ contentDir: FIXTURE });
  assert.equal(second.html, first.html, 'two builds on the same day are byte-identical');
});

/** 폴더(또는 파일) 아래의 .js·.mjs·.html·.css 파일 경로 전부 */
async function sourceFiles(...entries) {
  const out = [];
  for (const entry of entries) {
    const abs = path.join(ROOT, entry);
    if ((await stat(abs)).isFile()) { out.push(abs); continue; }
    for (const name of await readdir(abs, { recursive: true })) {
      if (/\.(m?js|html|css)$/.test(name)) out.push(path.join(abs, name));
    }
  }
  return out;
}

test('site name and address come from curriculum.json only', async () => {
  const realCur = JSON.parse(await readFile(path.join(ROOT, 'textbook', 'content', 'curriculum.json'), 'utf8'));
  await withContentCopy(async ({ content }) => {
    const file = path.join(content, 'curriculum.json');
    const cur = JSON.parse(await readFile(file, 'utf8'));
    await writeFile(file, JSON.stringify({ ...cur, title: '바꾼 이름', url: 'https://example.test/x/' }, null, 2));
    const r = await build({ contentDir: content });
    assert.equal(r.ok, true, JSON.stringify(r.errors));
    assert.match(r.html, /<title>바꾼 이름<\/title>/);
    assert.match(r.html, /<a class="brand[^"]*" href="#\/">[\s\S]*?바꾼 이름<\/span><\/a>/);
    assert.match(r.html, /<p class="footer-brand">[\s\S]*?<span>바꾼 이름<\/span><\/p>/);
    // Day 본문·데이터를 뺀 틀(헤더·<head>)에 옛 이름이 남지 않는다
    const frame = r.html.replace(/<template[\s\S]*?<\/template>/g, '').replace(/<script id="wzh-data"[\s\S]*?<\/script>/, '');
    assert.equal(frame.includes('픽스처 교재'), false);
    assert.equal(embeddedData(r.html).url, 'https://example.test/x/');
    assert.equal(embeddedData(r.html).description, '픽스처 설명');
  });
  // 저장소 소스에 이름·주소가 직접 적혀 있지 않다
  for (const f of await sourceFiles('textbook/src', 'textbook/lib', 'textbook/build.mjs')) {
    const src = await readFile(f, 'utf8');
    assert.equal(src.includes(realCur.title), false, f);
    assert.equal(src.includes(realCur.url), false, f);
  }
});

test('notFound build marks <html data-notfound>, the normal build does not', async () => {
  const normal = await build({ contentDir: FIXTURE });
  const nf = await build({ contentDir: FIXTURE, notFound: true });
  assert.equal(normal.ok && nf.ok, true, JSON.stringify([...(normal.errors ?? []), ...(nf.errors ?? [])]));
  assert.match(normal.html, /<html lang="ko">/);
  assert.match(nf.html, /<html lang="ko" data-notfound>/);
});

test('CLI --notfound writes the 404 build to --out', async () => {
  await withContentCopy(async ({ content, out }) => {
    const r = runBuild(['--content', content, '--out', out, '--notfound']);
    assert.equal(r.status, 0, r.output);
    assert.match(await readFile(out, 'utf8'), /<html lang="ko" data-notfound>/);
  });
});

const writePublished = (content, value) => writeFile(path.join(content, 'published.json'), JSON.stringify(value));

test('published build hides days outside the reviewed ranges', async () => {
  await withContentCopy(async ({ content }) => {
    await writePublished(content, { fa: [1, 1] }); // fa 는 Day 2개, fb 는 목록에 없다
    const r = await build({ contentDir: content, publishedOnly: true });
    assert.equal(r.ok, true, JSON.stringify(r.errors));
    assert.match(template(r.html, 't-day-fa-d02'), /coming-soon/);
    assert.match(template(r.html, 't-day-fb-d01'), /coming-soon/);
    assert.doesNotMatch(template(r.html, 't-day-fa-d01'), /coming-soon/);
    const search = embeddedData(r.html).search;
    assert.equal(search.find((s) => s.id === 'fa-d02').text, '');
    assert.notEqual(search.find((s) => s.id === 'fa-d01').text, '');
    // 목록이 없는 보통 빌드는 그대로 모두 보인다
    const all = await build({ contentDir: content });
    assert.doesNotMatch(template(all.html, 't-day-fa-d02'), /coming-soon/);
  });
});

test('published build drops symptoms of unpublished days', async () => {
  await withContentCopy(async ({ content }) => {
    const file = path.join(content, 'curriculum.json');
    const cur = JSON.parse(await readFile(file, 'utf8'));
    cur.pages.push({ id: 'troubleshooting', title: '문제 해결 모음', meta: '증상 {n}가지와 해결 방법', generated: 'troubleshooting' });
    await writeFile(file, JSON.stringify(cur));
    await mkdir(path.join(content, 'troubleshooting'));
    await writeFile(path.join(content, 'troubleshooting', 'fa.md'), '### 공개된 증상\n- 관련: [Day 1](#/day/fa-d01)\n\n해결\n');
    await writeFile(path.join(content, 'troubleshooting', 'fb.md'), '### 숨은 증상\n- 관련: [Day 1](#/day/fb-d01)\n\n해결\n');
    await writePublished(content, { fa: [1, 2] });
    const r = await build({ contentDir: content, publishedOnly: true });
    assert.equal(r.ok, true, JSON.stringify(r.errors));
    const page = template(r.html, 't-page-troubleshooting');
    assert.match(page, /공개된 증상/);
    assert.doesNotMatch(page, /숨은 증상/);
    assert.doesNotMatch(page, /ts-fb/);
    assert.equal(embeddedData(r.html).pages.find((p) => p.id === 'troubleshooting').meta, '증상 1가지와 해결 방법');
    // 공개 목록이 없는 보통 빌드는 둘 다 있다
    const all = await build({ contentDir: content });
    assert.match(template(all.html, 't-page-troubleshooting'), /숨은 증상/);
    assert.equal(embeddedData(all.html).pages.find((p) => p.id === 'troubleshooting').meta, '증상 2가지와 해결 방법');
  });
});

test('a published day without a file is E_PUBLISHED_MISSING, even with allowMissing', async () => {
  await withContentCopy(async ({ content }) => {
    await writePublished(content, { fa: [1, 3] });
    const r = await build({ contentDir: content, publishedOnly: true, allowMissing: true });
    assert.equal(r.ok, false);
    assert.deepEqual(r.errors.map((e) => e.code), ['E_PUBLISHED_MISSING']);
    assert.match(r.errors[0].message, /fa-d03/);
  });
});

test('a missing or malformed published.json is E_PUBLISHED_SCHEMA', async () => {
  await withContentCopy(async ({ content }) => {
    const none = await build({ contentDir: content, publishedOnly: true });
    assert.equal(none.ok, false);
    assert.equal(none.errors[0].code, 'E_PUBLISHED_SCHEMA');
    for (const bad of [{ zz: [1, 1] }, { fa: [2, 1] }, { fa: [0, 1] }, { fa: '1-2' }, [1, 2]]) {
      await writePublished(content, bad);
      const r = await build({ contentDir: content, publishedOnly: true });
      assert.equal(r.ok, false, JSON.stringify(bad));
      assert.equal(r.errors[0].code, 'E_PUBLISHED_SCHEMA', JSON.stringify(bad));
    }
  });
});

test('CLI --published builds only the reviewed days', async () => {
  await withContentCopy(async ({ content, out }) => {
    await writePublished(content, { fa: [1, 1] });
    const r = runBuild(['--content', content, '--out', out, '--published']);
    assert.equal(r.status, 0, r.output);
    assert.match(template(await readFile(out, 'utf8'), 't-day-fa-d02'), /coming-soon/);
  });
});

// M12 그림 블록: 등록표(src/figures/index.js)에 없는 id 는 빌드를 멈춘다
test('build stops on an unknown figure id', async () => {
  await withContentCopy(async ({ content }) => {
    const file = path.join(content, 'fa', 'day-01.md');
    const src = await readFile(file, 'utf8');
    await writeFile(file, src.replace('## 📖 개념 이해\n', '## 📖 개념 이해\n\n:::figure nope\n캡션: a\n대체 설명: b\n:::\n'));
    const r = await build({ contentDir: content, allowMissing: true });
    assert.equal(r.ok, false);
    assert.ok(r.errors.some((e) => e.code === 'E_FIGURE_UNKNOWN' && e.file.endsWith('day-01.md')), JSON.stringify(r.errors));
  });
});

test('figure registry ids are kebab-case functions', async () => {
  const { FIGURES } = await import('../../textbook/src/figures/index.js');
  for (const [id, mount] of Object.entries(FIGURES)) {
    assert.match(id, /^[a-z0-9-]+$/);
    assert.equal(typeof mount, 'function');
  }
});

test('build stops when the figure registry cannot be read', async () => {
  await withTmp(async (tmp) => {
    const r = await build({ contentDir: FIXTURE, srcDir: tmp });
    assert.equal(r.ok, false);
    assert.deepEqual(r.errors.map((e) => e.code), ['E_FIGURE_REGISTRY']);
  });
});

// 그림 안 색은 CSS 토큰으로만 칠한다(DESIGN.md "그림 틀"): 그림 코드에 색 값을 직접 쓰지 않는다
test('figure code has no raw colors', async () => {
  const figDir = path.join(ROOT, 'textbook', 'src', 'figures');
  const files = [path.join(ROOT, 'textbook', 'src', 'app', 'views', 'figure.js'), ...(await readdir(figDir)).filter((f) => f.endsWith('.js')).map((f) => path.join(figDir, f))];
  for (const file of files) {
    const hit = RAW_COLOR.exec(await readFile(file, 'utf8'));
    assert.equal(hit, null, `${path.relative(ROOT, file)}: ${hit?.[0]}`);
  }
});
