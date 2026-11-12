// content/ → index.html. 검증하고, 렌더하고, 단일 HTML 파일 하나로 조립한다.
//   node build.mjs [--check] [--only id1,id2] [--allow-missing] [--notfound] [--published] [--content <dir>] [--out <file>]
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build as esbuild } from 'esbuild';
import { loadCurriculum } from './lib/curriculum.mjs';
import { parseGlossary, parseTroubleshooting, renderGlossaryPage, renderTroubleshootingPage } from './lib/glossary.mjs';
import { assemble } from './lib/assemble.mjs';
import { faviconDataUri, fillIcons, headTags, listRoutes } from './lib/site.mjs';
import { readStyles, lintStyles } from './lib/styles.mjs';
import { collectGlyphs, embedFonts } from './lib/fonts.mjs';
import { renderMarkdown } from './lib/markdown.mjs';
import { validateDaySource } from './lib/validate.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SIZE_LIMIT = 16 * 1024 * 1024;
const PLACEHOLDER_HTML = '<p class="coming-soon">이 Day는 아직 준비 중이에요.</p>\n';
// 이 코드의 오류가 나면 커리큘럼 구조를 믿을 수 없어 렌더를 시작하지 않는다
const STRUCTURE_CODES = new Set(['E_CUR_SCHEMA', 'E_CUR_DUP_ID', 'E_CUR_REQUIRES']);

const USAGE = `사용법: node build.mjs [옵션]
  --check            검사만 하고 파일을 쓰지 않아요
  --only id1,id2     지정한 Day만 렌더·검증해요 (예: p1-d02,p1-d03). 용어·링크는 전체 기준이에요
  --allow-missing    Day 파일이 없으면 경고만 하고 "준비 중" 화면으로 대신해요
  --content <dir>    content 폴더 (기본값: textbook/content)
  --out <file>       결과 파일 (기본값: 저장소 루트의 index.html)
  --notfound         GitHub Pages 의 404.html 로 쓸 빌드를 만들어요 (빈 주소에서 404 화면)
  --published        content/published.json 의 공개 범위 밖 Day 는 "준비 중" 화면으로 만들어요`;

const issue = (code, message, extra = {}) => ({ code, line: null, message, file: null, ...extra });

/**
 * content/published.json 을 읽어 공개할 Day id 집합을 만든다.
 * 형식: { "<프로젝트 id>": [처음 Day, 끝 Day] }. 목록에 없는 프로젝트는 0개 공개.
 * @returns {Promise<{ ids: Set<string> | null, errors: object[] }>}
 */
async function loadPublished(contentDir, curriculum) {
  const file = path.join(contentDir, 'published.json');
  const fail = (message) => ({ ids: null, errors: [issue('E_PUBLISHED_SCHEMA', message, { file })] });
  let data;
  try {
    data = JSON.parse(await readFile(file, 'utf8'));
  } catch (e) {
    return fail(`공개 목록(published.json)을 읽을 수 없어요: ${e.message}`);
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return fail('공개 목록은 { "프로젝트 id": [처음, 끝] } 모양이어야 해요');
  const projects = new Map(curriculum.projects.map((p) => [p.id, p]));
  const ids = new Set();
  const errors = [];
  for (const [pid, range] of Object.entries(data)) {
    if (!projects.has(pid)) return fail(`공개 목록에 없는 프로젝트 id 가 있어요: ${pid}`);
    const ok = Array.isArray(range) && range.length === 2 && range.every(Number.isInteger) && range[0] >= 1 && range[0] <= range[1];
    if (!ok) return fail(`${pid} 의 범위는 [처음, 끝] 정수(1 이상, 처음 ≤ 끝)여야 해요: ${JSON.stringify(range)}`);
    const days = projects.get(pid).days;
    for (let num = range[0]; num <= range[1]; num++) {
      const day = days[num - 1];
      const id = `${pid}-d${String(num).padStart(2, '0')}`;
      if (!day || day.missing) errors.push(issue('E_PUBLISHED_MISSING', `공개 목록에 있는 Day 의 파일이 없어요: ${id}`, { dayId: id, file: day?.file ?? null }));
      else ids.add(day.id);
    }
  }
  return { ids, errors };
}
const byLine = (a, b) => (a.line ?? Infinity) - (b.line ?? Infinity);
const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

/** 폴더의 .md 파일을 이름순으로 읽는다. '_'로 시작하는 파일은 건너뛴다. 폴더가 없으면 빈 목록 */
async function readMarkdownDir(dir) {
  let names;
  try {
    names = await readdir(dir);
  } catch (e) {
    if (e.code === 'ENOENT') return [];
    throw e;
  }
  const files = names.filter((n) => n.endsWith('.md') && !n.startsWith('_')).sort();
  return Promise.all(files.map(async (n) => ({ file: path.join(dir, n), src: await readFile(path.join(dir, n), 'utf8') })));
}

/** JS 번들. esbuild 오류는 빌드 오류 형식으로 바꾼다 */
async function bundleJs(entry) {
  try {
    const result = await esbuild({
      entryPoints: [entry],
      bundle: true,
      format: 'iife',
      minify: true,
      target: 'es2020',
      write: false,
      legalComments: 'none',
      logLevel: 'silent',
    });
    return { js: result.outputFiles.map((f) => f.text).join(''), errors: [] };
  } catch (e) {
    const errors = (e.errors ?? [{ text: e.message }]).map((m) =>
      issue('E_JS_BUNDLE', m.text, { file: m.location ? path.resolve(m.location.file) : entry, line: m.location?.line ?? null }),
    );
    return { js: '', errors };
  }
}

/**
 * 빌드 본체. 파일을 쓰는 일은 하지 않는다(CLI 가 쓴다).
 * @returns {Promise<{ ok: boolean, errors: object[], warnings: object[], html?: string, stats?: { days: number, rendered: number, pages: number, bytes: number } }>}
 *   오류·경고는 { code, message, file, line } 이고 file 은 절대 경로(없으면 null)
 */
export async function build({
  contentDir,
  srcDir = path.join(HERE, 'src'),
  only = null,
  allowMissing = false,
  fontsDir = path.join(HERE, 'fonts'),
  cacheDir = path.join(HERE, '.cache', 'fonts'),
  notFound = false,
  publishedOnly = false,
}) {
  const errors = [];
  const warnings = [];

  // 1. 커리큘럼. 없는 Day 파일은 옵션에 따라 오류·경고·무시로 나눈다
  const { curriculum, errors: curErrors } = await loadCurriculum(contentDir);
  const onlySet = only ? new Set(only) : null;
  for (const e of curErrors) {
    if (e.code === 'E_CUR_FILE_MISSING' && e.dayId) {
      if (onlySet && !onlySet.has(e.dayId)) continue;
      (allowMissing ? warnings : errors).push(e);
    } else {
      errors.push(e);
    }
  }
  if (!curriculum || errors.some((e) => STRUCTURE_CODES.has(e.code))) return { ok: false, errors, warnings };

  const days = curriculum.projects.flatMap((p) => p.days.map((d) => ({ ...d, project: p.id })));
  if (onlySet) {
    const known = new Set(days.map((d) => d.id));
    for (const id of onlySet) {
      if (!known.has(id)) errors.push(issue('E_ONLY_UNKNOWN', `--only 에 없는 Day id 가 있어요: ${id}`));
    }
    if (errors.length) return { ok: false, errors, warnings };
  }

  // 1-1. 공개 목록: 목록 밖의 Day 는 파일이 있어도 "준비 중"으로 만든다
  let published = null;
  if (publishedOnly) {
    const r = await loadPublished(contentDir, curriculum);
    if (r.errors.length) return { ok: false, errors: [...errors, ...r.errors], warnings };
    published = r.ids;
  }

  // 2. 용어 사전·문제 해결 조각
  const glossary = parseGlossary(await readMarkdownDir(path.join(contentDir, 'glossary')));
  const trouble = parseTroubleshooting(await readMarkdownDir(path.join(contentDir, 'troubleshooting')));
  errors.push(...glossary.errors, ...trouble.errors);
  const terms = new Map(glossary.entries.map((e) => [e.term, e.slug]));

  // 3. 링크로 갈 수 있는 화면 (항상 전체 커리큘럼 기준)
  const routes = new Set(listRoutes(curriculum));
  terms.forEach((slug) => routes.add(`#/page/glossary/term-${slug}`));

  // 4. Day 렌더·검증
  const minChars = curriculum.validation.minDayChars;
  const rendered = new Map(); // dayId → { html, text, checkCount }
  let renderedCount = 0;
  for (const day of days) {
    if ((onlySet && !onlySet.has(day.id)) || day.missing || (published && !published.has(day.id))) {
      rendered.set(day.id, { html: PLACEHOLDER_HTML, text: '', checkCount: 0, ready: false });
      continue;
    }
    const src = await readFile(day.file, 'utf8');
    const r = renderMarkdown(src, { idPrefix: day.id, terms, routes });
    const found = [...validateDaySource(src, { minChars }), ...r.errors].sort(byLine);
    errors.push(...found.map((e) => ({ ...e, file: day.file })));
    rendered.set(day.id, { html: r.html, text: r.text, checkCount: r.checkCount, ready: true });
    renderedCount++;
  }

  // 5. 페이지 렌더 (--only 여도 페이지는 모두 만든다: 용어 사전 등이 화면에 필요하다)
  const pageResults = new Map();
  for (const page of curriculum.pages) {
    let r;
    if (page.generated === 'glossary') {
      r = renderGlossaryPage(glossary.entries, { terms, routes });
    } else if (page.generated === 'troubleshooting') {
      r = renderTroubleshootingPage(trouble.groups, curriculum.projects, { terms, routes });
    } else {
      if (page.missing) continue; // 파일이 없다는 오류는 이미 담겨 있다
      r = renderMarkdown(await readFile(page.file, 'utf8'), { idPrefix: page.id, terms, routes });
      r = { ...r, errors: r.errors.map((e) => ({ ...e, file: page.file })) };
    }
    errors.push(...r.errors);
    pageResults.set(page.id, r);
  }

  if (errors.length) return { ok: false, errors, warnings };

  // 6. 조립
  const templates = [
    ...days.map((d) => ({ id: `t-day-${d.id}`, html: rendered.get(d.id).html })),
    ...curriculum.pages.map((pg) => ({ id: `t-page-${pg.id}`, html: pageResults.get(pg.id).html })),
  ];
  const data = {
    title: curriculum.title,
    url: curriculum.url,
    description: curriculum.description,
    writtenAt: curriculum.writtenAt,
    builtAt: new Date().toISOString().slice(0, 10), // 날짜만: 같은 날 다시 빌드해도 index.html 이 바뀌지 않는다
    projects: curriculum.projects.map((p) => ({
      id: p.id,
      order: p.order,
      track: p.track,
      title: p.title,
      subtitle: p.subtitle,
      folder: p.folder,
      stack: p.stack,
      requires: p.requires,
      summary: p.summary,
      outcome: p.outcome,
      days: p.days.map((d) => ({
        id: d.id,
        num: d.num,
        title: d.title,
        minutes: d.minutes,
        summary: d.summary,
        checkCount: rendered.get(d.id).checkCount,
        ready: rendered.get(d.id).ready, // false 면 "준비 중" 화면이다 (사이드바 행 표시)
      })),
    })),
    pages: curriculum.pages.map((pg) => ({ id: pg.id, title: pg.title, requires: pg.requires })),
    search: [
      ...days.map((d) => ({ id: d.id, kind: 'day', project: d.project, title: d.title, text: rendered.get(d.id).text })),
      ...curriculum.pages.map((pg) => ({ id: pg.id, kind: 'page', project: null, title: pg.title, text: pageResults.get(pg.id).text })),
    ],
  };

  const bundle = await bundleJs(path.join(srcDir, 'app', 'main.js'));
  if (bundle.errors.length) return { ok: false, errors: bundle.errors, warnings };

  const styles = await readStyles(srcDir);
  if (styles.errors.length) return { ok: false, errors: styles.errors, warnings };
  const lint = lintStyles(styles.files);
  if (lint.length) return { ok: false, errors: lint, warnings };
  const templateFile = path.join(srcDir, 'template.html');
  const filled = fillIcons(await readFile(templateFile, 'utf8'), templateFile);
  if (filled.errors.length) return { ok: false, errors: filled.errors, warnings };
  // 404 빌드: 앱이 빈 주소를 404 로 보도록 <html> 에 표시를 단다
  const templateHtml = notFound ? filled.html.replace('<html lang="ko">', '<html lang="ko" data-notfound>') : filled.html;

  // 글꼴: 화면에 나올 수 있는 글자(틀·본문·스크립트 문구·데이터)만 서브셋해 스타일 맨 앞에 넣는다
  const glyphs = collectGlyphs({ html: [templateHtml, ...templates.map((t) => t.html), bundle.js].join('\n'), css: styles.css, dataJson: JSON.stringify(data) });
  const fonts = await embedFonts({ ...glyphs, fontsDir, cacheDir });
  if (fonts.errors.length) return { ok: false, errors: fonts.errors, warnings };
  const css = `${fonts.css}\n${styles.css}`;

  const site = { title: curriculum.title, url: curriculum.url, description: curriculum.description };
  const tokens = styles.files.find((f) => f.name === 'tokens');
  let favicon;
  try {
    favicon = faviconDataUri(tokens.src);
  } catch (e) {
    return { ok: false, errors: [issue('E_CSS_TOKEN', e.message, { file: tokens.file })], warnings };
  }
  const head = headTags(site, favicon);
  const html = assemble({ templateHtml, css, js: bundle.js, data, templates, head, title: site.title });
  const bytes = Buffer.byteLength(html);
  if (bytes >= SIZE_LIMIT) {
    return { ok: false, errors: [issue('E_SIZE_LIMIT', `결과 파일이 너무 커요: ${mb(bytes)} (16 MB 미만이어야 해요)`)], warnings };
  }
  return { ok: true, errors, warnings, html, stats: { days: days.length, rendered: renderedCount, pages: curriculum.pages.length, bytes, fonts: fonts.bytes } };
}

// ───────────────────────── CLI ─────────────────────────

/** 'path:line CODE message' (줄이 없으면 'path CODE message'). 경로는 현재 폴더 기준 상대 경로 */
function formatIssue(e, cwd) {
  const where = e.file ? path.relative(cwd, e.file) + (e.line ? `:${e.line}` : '') + ' ' : '';
  return `${where}${e.code} ${e.message}`;
}

/** 없는 Day 파일 경고는 프로젝트별로 한 줄로 묶는다 */
function summarizeWarnings(warnings, cwd) {
  const missing = new Map();
  const rest = [];
  for (const w of warnings) {
    if (w.code === 'E_CUR_FILE_MISSING' && w.dayId) {
      if (!missing.has(w.projectId)) missing.set(w.projectId, []);
      missing.get(w.projectId).push(w);
    } else {
      rest.push(formatIssue(w, cwd));
    }
  }
  const lines = [...missing.entries()].map(([pid, list]) => {
    const ids = list.length > 4 ? `${list.slice(0, 4).map((w) => w.dayId).join(', ')} 외 ${list.length - 4}개` : list.map((w) => w.dayId).join(', ');
    return `E_CUR_FILE_MISSING ${pid}: Day 파일 ${list.length}개가 없어 "준비 중" 화면으로 대신해요 (${ids})`;
  });
  return [...lines, ...rest].map((l) => `경고 ${l}`);
}

async function main(argv) {
  const cwd = process.cwd();
  let values;
  try {
    ({ values } = parseArgs({
      args: argv,
      strict: true,
      options: {
        check: { type: 'boolean' },
        only: { type: 'string' },
        content: { type: 'string' },
        out: { type: 'string' },
        'allow-missing': { type: 'boolean' },
        notfound: { type: 'boolean' },
        published: { type: 'boolean' },
        help: { type: 'boolean', short: 'h' },
      },
    }));
  } catch (e) {
    console.log(`${e.message}\n${USAGE}`);
    return 1;
  }
  if (values.help) {
    console.log(USAGE);
    return 0;
  }

  const contentDir = values.content ? path.resolve(cwd, values.content) : path.join(HERE, 'content');
  const outFile = values.out ? path.resolve(cwd, values.out) : path.join(HERE, '..', 'index.html');
  const only = values.only ? values.only.split(',').map((s) => s.trim()).filter(Boolean) : null;

  const result = await build({ contentDir, only, allowMissing: Boolean(values['allow-missing']), notFound: Boolean(values.notfound), publishedOnly: Boolean(values.published) });
  for (const line of summarizeWarnings(result.warnings, cwd)) console.log(line);

  if (!result.ok) {
    for (const e of result.errors) console.log(formatIssue(e, cwd));
    console.log(`\n오류 ${result.errors.length}개: 빌드를 멈췄어요.`);
    return 1;
  }

  const { days, rendered, pages, bytes, fonts } = result.stats;
  for (const [family, size] of Object.entries(fonts)) console.log(`글꼴 ${family}: ${Math.round(size / 1024)} KB`);
  const scope = only ? ` (--only: ${rendered}개 Day만 렌더)` : '';
  if (values.check) {
    console.log(`검사 통과: Day ${days}개, 페이지 ${pages}개, 결과 크기 ${mb(bytes)}${scope}`);
  } else {
    await mkdir(path.dirname(outFile), { recursive: true });
    await writeFile(outFile, result.html);
    console.log(`빌드 완료: Day ${days}개, 페이지 ${pages}개 → ${path.relative(cwd, outFile)} (${mb(bytes)})${scope}`);
  }
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).then(
    (code) => {
      process.exitCode = code;
    },
    (e) => {
      console.error(e);
      process.exitCode = 1;
    },
  );
}
