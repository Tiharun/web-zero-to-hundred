// curriculum.json 로드·검증. Day마다 id·번호·파일 경로를 붙이고, 파일이 실제로 있는지 확인한다.
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

export const MINUTES_MIN = 60;
export const MINUTES_MAX = 120;

const TRACKS = ['main', 'special'];
const GENERATED_PAGES = ['glossary', 'troubleshooting'];
// content/ 아래에서 프로젝트 폴더가 아닌 폴더 이름
const RESERVED_DIRS = new Set(['pages', 'glossary', 'troubleshooting']);

const PROJECT_ID = /^[a-z][a-z0-9]*$/;
const PAGE_ID = /^[a-z][a-z0-9-]*$/;
const DAY_FILE = /^day-\d+\.md$/;

/** 1 → 'day-01.md' */
export const dayFileName = (num) => `day-${String(num).padStart(2, '0')}.md`;

const buildError = (code, file, message, extra = {}) => ({ code, line: null, message, file, ...extra });

const isText = (v) => typeof v === 'string' && v.trim() !== '';
const isTextList = (v) => Array.isArray(v) && v.every((x) => typeof x === 'string' && x.trim() !== '');
const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

// ───────────────────────── 스키마 ─────────────────────────

/** 모양·타입 검사. 찾은 문제를 한꺼번에 돌려준다(첫 오류에서 멈추지 않는다) */
function checkSchema(cur, file) {
  const problems = [];
  const bad = (where, why) => problems.push(buildError('E_CUR_SCHEMA', file, `${where}: ${why}`));

  if (!isObject(cur)) return [buildError('E_CUR_SCHEMA', file, '최상위는 { ... } 객체여야 해요.')];

  if (cur.version !== 1) bad('version', `1이어야 해요 (현재 ${JSON.stringify(cur.version)})`);
  if (!isText(cur.title)) bad('title', '비어 있지 않은 글자여야 해요.');
  if (!isText(cur.writtenAt)) bad('writtenAt', '"2026-11" 같은 글자여야 해요.');
  const min = cur.validation?.minDayChars;
  if (!Number.isInteger(min) || min < 0) bad('validation.minDayChars', '0 이상의 정수여야 해요.');

  if (!Array.isArray(cur.projects) || cur.projects.length === 0) {
    bad('projects', '프로젝트가 하나 이상 있는 배열이어야 해요.');
  } else {
    cur.projects.forEach((p, i) => {
      const at = `projects[${i}]`;
      if (!isObject(p)) return bad(at, '객체여야 해요.');
      if (typeof p.id !== 'string' || !PROJECT_ID.test(p.id) || RESERVED_DIRS.has(p.id)) {
        bad(`${at}.id`, `영소문자로 시작하는 영소문자·숫자 id여야 해요 (현재 ${JSON.stringify(p.id)})`);
      }
      if (typeof p.order !== 'number' || !Number.isFinite(p.order)) bad(`${at}.order`, '숫자여야 해요.');
      if (!TRACKS.includes(p.track)) bad(`${at}.track`, `${TRACKS.join(' 또는 ')} 이어야 해요 (현재 ${JSON.stringify(p.track)})`);
      for (const key of ['title', 'subtitle', 'folder', 'summary', 'outcome']) {
        if (!isText(p[key])) bad(`${at}.${key}`, '비어 있지 않은 글자여야 해요.');
      }
      for (const key of ['stack', 'requires']) {
        if (!isTextList(p[key])) bad(`${at}.${key}`, '글자 배열이어야 해요.');
      }
      if (!Array.isArray(p.days) || p.days.length === 0) {
        bad(`${at}.days`, 'Day가 하나 이상 있는 배열이어야 해요.');
        return;
      }
      p.days.forEach((d, j) => {
        const dat = `${at}.days[${j}]`;
        if (!isObject(d)) return bad(dat, '객체여야 해요.');
        if (!isText(d.title)) bad(`${dat}.title`, '비어 있지 않은 글자여야 해요.');
        if (!Number.isInteger(d.minutes) || d.minutes < MINUTES_MIN || d.minutes > MINUTES_MAX) {
          bad(`${dat}.minutes`, `${MINUTES_MIN}~${MINUTES_MAX} 사이의 정수(분)여야 해요 (현재 ${JSON.stringify(d.minutes)})`);
        }
        if (!isText(d.summary)) bad(`${dat}.summary`, '비어 있지 않은 글자여야 해요.');
        if (!isTextList(d.keywords)) bad(`${dat}.keywords`, '글자 배열이어야 해요.');
      });
    });
  }

  if (!Array.isArray(cur.pages)) {
    bad('pages', '배열이어야 해요.');
  } else {
    cur.pages.forEach((pg, i) => {
      const at = `pages[${i}]`;
      if (!isObject(pg)) return bad(at, '객체여야 해요.');
      if (typeof pg.id !== 'string' || !PAGE_ID.test(pg.id)) {
        bad(`${at}.id`, `영소문자로 시작하는 영소문자·숫자·- id여야 해요 (현재 ${JSON.stringify(pg.id)})`);
      }
      if (!isText(pg.title)) bad(`${at}.title`, '비어 있지 않은 글자여야 해요.');
      if (pg.requires !== undefined && !isTextList(pg.requires)) bad(`${at}.requires`, '글자 배열이어야 해요.');
      const hasFile = pg.file !== undefined;
      const hasGenerated = pg.generated !== undefined;
      if (hasFile === hasGenerated) {
        bad(at, `file(Markdown 파일) 또는 generated(${GENERATED_PAGES.join('/')}) 중 하나만 있어야 해요.`);
      }
      if (hasFile && !pageFileParts(pg.file)) {
        bad(`${at}.file`, `content 폴더 안의 상대 경로여야 해요 (현재 ${JSON.stringify(pg.file)})`);
      }
      if (hasGenerated && !GENERATED_PAGES.includes(pg.generated)) {
        bad(`${at}.generated`, `${GENERATED_PAGES.join(' 또는 ')} 이어야 해요 (현재 ${JSON.stringify(pg.generated)})`);
      }
      // 용어 링크가 #/page/glossary/term-... 로 고정이라 용어 사전 페이지의 id는 정해져 있다
      if (pg.generated === 'glossary' && pg.id !== 'glossary') {
        bad(`${at}.id`, `generated: "glossary" 페이지의 id는 "glossary"여야 해요 (용어 링크가 #/page/glossary/... 로 이어져요).`);
      }
    });
  }
  return problems;
}

/** 'start.md' / 'pages/start.md' → ['pages','start.md']. 폴더 밖으로 나가는 경로는 null */
function pageFileParts(file) {
  if (typeof file !== 'string' || !file.trim()) return null;
  const parts = file.replaceAll('\\', '/').split('/');
  if (parts.some((s) => s === '' || s === '.' || s === '..' || /^[a-zA-Z]:$/.test(s))) return null;
  return parts[0] === 'pages' ? parts : ['pages', ...parts];
}

// ───────────────────────── 관계 검사 ─────────────────────────

function findDuplicates(items, label, file) {
  const seen = new Set();
  const errors = [];
  for (const { id, at } of items) {
    if (seen.has(id)) errors.push(buildError('E_CUR_DUP_ID', file, `${label} id가 겹쳐요: "${id}" (${at})`));
    seen.add(id);
  }
  return errors;
}

/** requires 가 없는 프로젝트를 가리키거나 서로 물고 물리면 오류 */
function checkRequires(projects, pages, file) {
  const errors = [];
  const ids = new Set(projects.map((p) => p.id));

  for (const p of projects) {
    for (const r of p.requires) {
      if (!ids.has(r)) {
        errors.push(buildError('E_CUR_REQUIRES', file, `프로젝트 "${p.id}" 가 없는 프로젝트 "${r}" 를 요구해요.`));
      }
    }
  }
  for (const pg of pages) {
    for (const r of pg.requires) {
      if (!ids.has(r)) {
        errors.push(buildError('E_CUR_REQUIRES', file, `페이지 "${pg.id}" 가 없는 프로젝트 "${r}" 를 요구해요.`));
      }
    }
  }

  // 순환: 깊이 우선 탐색, 탐색 중인 노드를 다시 만나면 순환이다
  const byId = new Map(projects.map((p) => [p.id, p]));
  const state = new Map(); // id → 'visiting' | 'done'
  const reported = new Set();
  const stack = [];
  const visit = (id) => {
    if (state.get(id) === 'done' || !byId.has(id)) return;
    if (state.get(id) === 'visiting') {
      const cycle = stack.slice(stack.indexOf(id));
      const key = [...cycle].sort().join(',');
      if (!reported.has(key)) {
        reported.add(key);
        errors.push(
          buildError('E_CUR_REQUIRES', file, `프로젝트 requires 가 순환해요: ${[...cycle, id].join(' → ')}`),
        );
      }
      return;
    }
    state.set(id, 'visiting');
    stack.push(id);
    for (const r of byId.get(id).requires) visit(r);
    stack.pop();
    state.set(id, 'done');
  };
  projects.forEach((p) => visit(p.id));
  return errors;
}

// ───────────────────────── 파일 확인 ─────────────────────────

async function listDir(dir) {
  try {
    return await readdir(dir, { withFileTypes: true });
  } catch (e) {
    if (e.code === 'ENOENT' || e.code === 'ENOTDIR') return [];
    throw e;
  }
}

/** Day 파일이 있는지(missing 표시), 커리큘럼에 없는 day-NN.md 가 있는지 확인한다 */
async function checkFiles(contentDir, projects, pages) {
  const errors = [];

  for (const p of projects) {
    const dir = path.join(contentDir, p.id);
    const files = new Set((await listDir(dir)).filter((e) => e.isFile()).map((e) => e.name));
    const expected = new Set();
    for (const day of p.days) {
      expected.add(path.basename(day.file));
      day.missing = !files.has(path.basename(day.file));
      if (day.missing) {
        errors.push(
          buildError('E_CUR_FILE_MISSING', day.file, `Day 파일이 없어요: ${p.id}/${path.basename(day.file)} (${day.id} "${day.title}")`, {
            dayId: day.id,
            projectId: p.id,
          }),
        );
      }
    }
    for (const name of [...files].sort()) {
      if (DAY_FILE.test(name) && !expected.has(name)) {
        errors.push(
          buildError('E_CUR_ORPHAN_FILE', path.join(dir, name), `curriculum.json 에 없는 Day 파일이에요: ${p.id}/${name} (${p.days.length}개 Day만 있어요)`),
        );
      }
    }
  }

  // 프로젝트가 아닌 폴더에 놓인 day-NN.md (프로젝트 id 오타 등)
  const known = new Set(projects.map((p) => p.id));
  for (const entry of await listDir(contentDir)) {
    const name = entry.name;
    if (!entry.isDirectory() || known.has(name) || RESERVED_DIRS.has(name) || name.startsWith('_') || name.startsWith('.')) continue;
    for (const f of await listDir(path.join(contentDir, name))) {
      if (f.isFile() && DAY_FILE.test(f.name)) {
        errors.push(
          buildError('E_CUR_ORPHAN_FILE', path.join(contentDir, name, f.name), `curriculum.json 에 없는 프로젝트 폴더의 Day 파일이에요: ${name}/${f.name}`),
        );
      }
    }
  }

  for (const pg of pages) {
    if (!pg.file) continue;
    const dir = path.dirname(pg.file);
    const files = new Set((await listDir(dir)).filter((e) => e.isFile()).map((e) => e.name));
    pg.missing = !files.has(path.basename(pg.file));
    if (pg.missing) {
      errors.push(buildError('E_CUR_FILE_MISSING', pg.file, `페이지 파일이 없어요: ${path.relative(contentDir, pg.file)} (page "${pg.id}")`));
    }
  }
  return errors;
}

// ───────────────────────── 공개 함수 ─────────────────────────

/**
 * @param {string} contentDir curriculum.json 이 있는 content 폴더
 * @returns {Promise<{ curriculum: object|null, errors: object[] }>}
 *   스키마 오류가 있으면 curriculum 은 null. 그 밖의 오류(DUP_ID·REQUIRES·FILE_MISSING·ORPHAN_FILE)는
 *   curriculum 과 함께 돌려준다. 오류 객체는 { code, line:null, message, file } 이다.
 */
export async function loadCurriculum(contentDir) {
  const file = path.join(contentDir, 'curriculum.json');

  let raw;
  try {
    raw = JSON.parse(await readFile(file, 'utf8'));
  } catch (e) {
    const why = e.code === 'ENOENT' ? 'curriculum.json 파일이 없어요.' : `JSON을 읽을 수 없어요: ${e.message}`;
    return { curriculum: null, errors: [buildError('E_CUR_SCHEMA', file, why)] };
  }

  const schemaErrors = checkSchema(raw, file);
  if (schemaErrors.length) return { curriculum: null, errors: schemaErrors };

  // order 순서로 정렬(같으면 적은 순서 유지), Day 에 id·번호·파일 경로를 붙인다
  const projects = [...raw.projects]
    .sort((a, b) => a.order - b.order)
    .map((p) => ({
      ...p,
      days: p.days.map((d, i) => {
        const num = i + 1;
        return {
          ...d,
          id: `${p.id}-d${String(num).padStart(2, '0')}`,
          num,
          file: path.join(contentDir, p.id, dayFileName(num)),
          missing: false,
        };
      }),
    }));
  const pages = raw.pages.map((pg) => ({
    ...pg,
    requires: pg.requires ?? [],
    ...(pg.file ? { file: path.join(contentDir, ...pageFileParts(pg.file)), missing: false } : {}),
  }));

  const errors = [
    ...findDuplicates(projects.map((p, i) => ({ id: p.id, at: `projects[${i}]` })), '프로젝트', file),
    ...findDuplicates(pages.map((pg, i) => ({ id: pg.id, at: `pages[${i}]` })), '페이지', file),
    ...checkRequires(projects, pages, file),
    ...(await checkFiles(contentDir, projects, pages)),
  ];

  return { curriculum: { ...raw, projects, pages }, errors };
}
