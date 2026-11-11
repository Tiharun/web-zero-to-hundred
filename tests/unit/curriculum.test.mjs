import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, rm, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCurriculum } from '../../textbook/lib/curriculum.mjs';

const FIXTURE = fileURLToPath(new URL('../fixtures/content', import.meta.url));

/** 픽스처 복사본을 만들어 mutate(dir, curriculum)로 고친 뒤 로드한다 */
async function loadModified(mutate) {
  const dir = await mkdtemp(path.join(tmpdir(), 'wzh-cur-'));
  try {
    await cp(FIXTURE, dir, { recursive: true });
    const file = path.join(dir, 'curriculum.json');
    const cur = JSON.parse(await readFile(file, 'utf8'));
    const result = (await mutate?.(dir, cur)) ?? cur;
    await writeFile(file, JSON.stringify(result, null, 2));
    return { dir, ...(await loadCurriculum(dir)) };
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

const codes = (errors) => errors.map((e) => e.code);

test('fixture loads with derived ids', async () => {
  const { curriculum, errors } = await loadCurriculum(FIXTURE);
  assert.deepEqual(errors, []);
  assert.deepEqual(
    curriculum.projects.flatMap((p) => p.days.map((d) => d.id)),
    ['fa-d01', 'fa-d02', 'fb-d01'],
  );
  const day = curriculum.projects[0].days[1];
  assert.equal(day.num, 2);
  assert.equal(day.file, path.join(FIXTURE, 'fa', 'day-02.md'));
  assert.equal(curriculum.projects[1].days[0].file, path.join(FIXTURE, 'fb', 'day-01.md'));
  assert.deepEqual(curriculum.projects[1].requires, ['fa']);
  assert.equal(curriculum.validation.minDayChars, 200);
  assert.deepEqual(
    curriculum.pages.map((p) => p.id),
    ['start', 'secret', 'glossary'],
  );
  assert.equal(curriculum.pages[0].file, path.join(FIXTURE, 'pages', 'start.md'));
  assert.equal(curriculum.pages[2].generated, 'glossary');
});

test('requires cycle is an error', async () => {
  const { errors } = await loadModified((dir, cur) => {
    cur.projects[0].requires = ['fb']; // fa -> fb -> fa
    return cur;
  });
  const e = errors.find((x) => x.code === 'E_CUR_REQUIRES');
  assert.ok(e, JSON.stringify(errors));
  assert.match(e.message, /fa/);
  assert.match(e.message, /fb/);
});

test('project requiring itself or an unknown project is an error', async () => {
  const self = await loadModified((dir, cur) => {
    cur.projects[0].requires = ['fa'];
    return cur;
  });
  assert.ok(codes(self.errors).includes('E_CUR_REQUIRES'));

  const unknown = await loadModified((dir, cur) => {
    cur.projects[1].requires = ['nope'];
    cur.pages[1].requires = ['ghost'];
    return cur;
  });
  const reqs = unknown.errors.filter((x) => x.code === 'E_CUR_REQUIRES');
  assert.equal(reqs.length, 2, JSON.stringify(unknown.errors));
  assert.ok(reqs.some((x) => x.message.includes('nope')));
  assert.ok(reqs.some((x) => x.message.includes('ghost')));
});

test('missing day file is an error', async () => {
  const { errors, curriculum } = await loadModified(async (dir, cur) => {
    await rm(path.join(dir, 'fa', 'day-02.md'));
    return cur;
  });
  const missing = errors.filter((e) => e.code === 'E_CUR_FILE_MISSING');
  assert.equal(missing.length, 1, JSON.stringify(errors));
  assert.match(missing[0].file, /fa[\\/]day-02\.md$/);
  assert.equal(missing[0].dayId, 'fa-d02');
  // 로더는 계속 쓸 수 있는 커리큘럼을 돌려주고, 없는 파일에는 표시를 남긴다
  assert.equal(curriculum.projects[0].days[1].missing, true);
  assert.equal(curriculum.projects[0].days[0].missing, false);
});

test('missing page file is an error', async () => {
  const { errors } = await loadModified(async (dir) => {
    await rm(path.join(dir, 'pages', 'start.md'));
  });
  assert.deepEqual(codes(errors), ['E_CUR_FILE_MISSING']);
  assert.match(errors[0].file, /pages[\\/]start\.md$/);
});

test('orphan day file is an error', async () => {
  const { errors } = await loadModified(async (dir) => {
    await writeFile(path.join(dir, 'fb', 'day-02.md'), '# 아직 커리큘럼에 없어요\n');
    await writeFile(path.join(dir, 'fa', 'day-3.md'), '이름 형식이 달라요\n'); // day-NN 이 아닌 이름
    await mkdir(path.join(dir, 'zz'));
    await writeFile(path.join(dir, 'zz', 'day-01.md'), '없는 프로젝트 폴더\n');
  });
  const orphans = errors.filter((e) => e.code === 'E_CUR_ORPHAN_FILE');
  assert.deepEqual(
    orphans.map((e) => path.basename(path.dirname(e.file)) + '/' + path.basename(e.file)).sort(),
    ['fa/day-3.md', 'fb/day-02.md', 'zz/day-01.md'],
  );
  assert.equal(errors.length, 3);
});

test('underscore files are ignored', async () => {
  const { errors } = await loadModified(async (dir) => {
    await writeFile(path.join(dir, 'fa', '_outline.md'), '개요\n');
    await writeFile(path.join(dir, 'fb', '_day-09.md'), '임시\n');
    await writeFile(path.join(dir, 'pages', '_draft.md'), '임시\n');
    await mkdir(path.join(dir, '_notes'));
    await writeFile(path.join(dir, '_notes', 'day-01.md'), '임시\n');
    await writeFile(path.join(dir, 'fa', 'README.txt'), '메모\n');
  });
  assert.deepEqual(errors, []);
});

test('schema: day minutes must be 60..120', async () => {
  for (const minutes of [59, 121, 90.5, '90', null]) {
    const { errors, curriculum } = await loadModified((dir, cur) => {
      cur.projects[0].days[0].minutes = minutes;
      return cur;
    });
    const e = errors.find((x) => x.code === 'E_CUR_SCHEMA');
    assert.ok(e, `minutes=${minutes}: ${JSON.stringify(errors)}`);
    assert.match(e.message, /minutes/);
    assert.match(e.file, /curriculum\.json$/);
    assert.equal(curriculum, null);
  }
  for (const minutes of [60, 120]) {
    const { errors } = await loadModified((dir, cur) => {
      cur.projects[0].days[0].minutes = minutes;
      return cur;
    });
    assert.deepEqual(errors, [], `minutes=${minutes}`);
  }
});

test('schema: field types and enums are checked, all problems reported together', async () => {
  const { errors } = await loadModified((dir, cur) => {
    cur.version = 2;
    cur.projects[0].track = 'side';
    cur.projects[0].stack = 'HTML';
    cur.projects[1].id = 'F B';
    cur.validation.minDayChars = -1;
    cur.pages[0].file = undefined; // file도 generated도 없다
    cur.pages[1].generated = 'glossary'; // file과 generated를 함께 쓸 수 없다
    cur.pages[2].id = 'terms'; // glossary 링크가 #/page/glossary/... 로 고정이라 id가 달라질 수 없다
    return cur;
  });
  assert.ok(errors.every((e) => e.code === 'E_CUR_SCHEMA'), JSON.stringify(errors));
  const text = errors.map((e) => e.message).join('\n');
  for (const needle of ['version', 'track', 'stack', 'id', 'minDayChars', 'pages[0]', 'pages[1]', 'glossary']) {
    assert.ok(text.includes(needle), `${needle} 오류가 없어요:\n${text}`);
  }
});

test('schema: unreadable or invalid JSON is E_CUR_SCHEMA, absent file too', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'wzh-cur-'));
  try {
    const none = await loadCurriculum(dir);
    assert.equal(none.curriculum, null);
    assert.deepEqual(codes(none.errors), ['E_CUR_SCHEMA']);

    await writeFile(path.join(dir, 'curriculum.json'), '{ "version": 1, ');
    const bad = await loadCurriculum(dir);
    assert.equal(bad.curriculum, null);
    assert.deepEqual(codes(bad.errors), ['E_CUR_SCHEMA']);
    assert.match(bad.errors[0].message, /JSON/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('page file paths cannot leave the content folder', async () => {
  const { errors } = await loadModified((dir, cur) => {
    cur.pages[0].file = '../curriculum.json';
    return cur;
  });
  assert.ok(codes(errors).includes('E_CUR_SCHEMA'));
});

test('page file may be written as start.md or pages/start.md', async () => {
  const { errors, curriculum } = await loadModified((dir, cur) => {
    cur.pages[0].file = 'pages/start.md';
    return cur;
  });
  assert.deepEqual(errors, []);
  assert.match(curriculum.pages[0].file.replaceAll('\\', '/'), /\/pages\/start\.md$/);
  assert.doesNotMatch(curriculum.pages[0].file.replaceAll('\\', '/'), /pages\/pages\//);
});

test('duplicate project ids and page ids are E_CUR_DUP_ID', async () => {
  const dupProject = await loadModified((dir, cur) => {
    cur.projects[1].id = 'fa';
    return cur;
  });
  assert.ok(codes(dupProject.errors).includes('E_CUR_DUP_ID'), JSON.stringify(dupProject.errors));

  const dupPage = await loadModified((dir, cur) => {
    cur.pages[1].id = 'start';
    return cur;
  });
  assert.ok(codes(dupPage.errors).includes('E_CUR_DUP_ID'), JSON.stringify(dupPage.errors));
});

test('projects are returned in order', async () => {
  const { curriculum } = await loadModified((dir, cur) => {
    cur.projects.reverse();
    cur.projects[0].order = 2; // fb
    cur.projects[1].order = 1; // fa
    return cur;
  });
  assert.deepEqual(
    curriculum.projects.map((p) => p.id),
    ['fa', 'fb'],
  );
});

/** 픽스처 사본에 patch 를 덮어쓴 뒤 로드한다(값이 undefined 인 키는 지운다) */
const loadWith = (patch) => loadModified((dir, cur) => {
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined) delete cur[k];
    else cur[k] = v;
  }
  return cur;
});

test('url must be https and end with a slash; description must be text', async () => {
  for (const [patch, where] of [
    [{ url: 'http://example.test/book/' }, 'url'],
    [{ url: 'https://example.test/book' }, 'url'],
    [{ url: 'https://exa mple.test/book/' }, 'url'],
    [{ url: undefined }, 'url'],
    [{ description: '' }, 'description'],
    [{ description: undefined }, 'description'],
  ]) {
    const { errors } = await loadWith(patch);
    assert.ok(errors.some((e) => e.code === 'E_CUR_SCHEMA' && e.message.startsWith(where)), `${where} ${JSON.stringify(patch)}`);
  }
});
