import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  filterPublished,
  glossaryIndexKey,
  parseGlossary,
  parseTroubleshooting,
  renderGlossaryPage,
  renderTroubleshootingPage,
} from '../../textbook/lib/glossary.mjs';

const GLOSSARY_A = `# 용어 모음

앞부분의 소개 글은 용어가 아니라서 무시해요.

### HTML
웹 페이지의 **뼈대**를 적는 언어예요.

\`\`\`html
### 코드 안의 이 줄은 용어가 아니에요
<p>안녕</p>
\`\`\`

### C#
마이크로소프트가 만든 언어예요.

## 가나다순 묶음 제목은 용어가 아니에요

### CSS
스타일을 적는 언어예요.
`;

const GLOSSARY_B = `### 서버
요청을 받아 응답하는 프로그램이에요.
`;

test('entries are split by h3 and slugged', () => {
  const { entries, errors } = parseGlossary([
    { file: '/c/glossary/a.md', src: GLOSSARY_A },
    { file: '/c/glossary/b.md', src: GLOSSARY_B },
  ]);
  assert.deepEqual(errors, []);
  assert.deepEqual(
    entries.map((e) => [e.term, e.slug, e.file]),
    [
      ['HTML', 'html', '/c/glossary/a.md'],
      ['C#', 'c', '/c/glossary/a.md'],
      ['CSS', 'css', '/c/glossary/a.md'],
      ['서버', '서버', '/c/glossary/b.md'],
    ],
  );
  // 본문은 제목 줄을 뺀 Markdown 원문이다. 코드 펜스 안의 ###, 묶음 제목(##)은 영향을 주지 않는다
  assert.match(entries[0].md, /\*\*뼈대\*\*/);
  assert.match(entries[0].md, /### 코드 안의 이 줄은 용어가 아니에요/);
  assert.doesNotMatch(entries[1].md, /가나다순/);
  assert.doesNotMatch(entries[0].md, /^### HTML/m);
  // 오류 줄 번호를 되짚으려고 제목 줄 번호를 남긴다
  assert.deepEqual(
    entries.map((e) => e.line),
    [5, 13, 18, 1],
  );
});

test('duplicate term across files is an error', () => {
  const { entries, errors } = parseGlossary([
    { file: '/c/glossary/a.md', src: '### HTML\n하나\n' },
    { file: '/c/glossary/b.md', src: '### html\n대소문자만 달라요\n\n### 다른 용어\n정상\n' },
  ]);
  assert.equal(errors.length, 1, JSON.stringify(errors));
  assert.equal(errors[0].code, 'E_TERM_DUPLICATE');
  assert.equal(errors[0].file, '/c/glossary/b.md');
  assert.equal(errors[0].line, 1);
  assert.match(errors[0].message, /a\.md/); // 처음 정의한 곳을 알려 준다
  // 중복 항목은 버리고 나머지는 남긴다
  assert.deepEqual(
    entries.map((e) => e.term),
    ['HTML', '다른 용어'],
  );
});

test('duplicate inside one file and empty term names are errors', () => {
  const { errors } = parseGlossary([
    { file: '/c/glossary/a.md', src: '### API\n하나\n\n### api\n둘\n\n###\n이름 없음\n' },
  ]);
  assert.deepEqual(
    errors.map((e) => [e.code, e.line]),
    [
      ['E_TERM_DUPLICATE', 4],
      ['E_TERM_EMPTY', 7],
    ],
  );
});

test('slugs that collide get a numeric suffix like heading ids do', () => {
  const { entries, errors } = parseGlossary([
    { file: '/c/glossary/a.md', src: '### C#\n하나\n\n### C++\n둘\n\n### C\n셋\n' },
  ]);
  assert.deepEqual(errors, []);
  assert.deepEqual(
    entries.map((e) => e.slug),
    ['c', 'c-2', 'c-3'],
  );
});

test('CRLF sources split the same way', () => {
  const { entries } = parseGlossary([{ file: 'a.md', src: '### A\r\n하나\r\n\r\n### B\r\n둘\r\n' }]);
  assert.deepEqual(
    entries.map((e) => e.term),
    ['A', 'B'],
  );
  assert.doesNotMatch(entries[0].md, /\r/);
});

test('troubleshooting groups by file name prefix', () => {
  const { groups, errors } = parseTroubleshooting([
    { file: '/c/troubleshooting/p1-html.md', src: '### 화면이 비어 있어요\n저장했는지 확인해요.\n\n### 글자가 깨져요\nUTF-8로 저장해요.\n' },
    { file: '/c/troubleshooting/p1.md', src: '### 포트가 사용 중이에요\n다른 포트를 써요.\n' },
    { file: '/c/troubleshooting/sp-donation.md', src: '### 후원이 안 보여요\n테스트 모드를 켜요.\n' },
  ]);
  assert.deepEqual(errors, []);
  assert.deepEqual(
    groups.map((g) => [g.project, g.entries.map((e) => e.title)]),
    [
      ['p1', ['화면이 비어 있어요', '글자가 깨져요', '포트가 사용 중이에요']],
      ['sp', ['후원이 안 보여요']],
    ],
  );
  assert.match(groups[0].entries[0].md, /저장했는지/);
  assert.equal(groups[0].entries[1].line, 4);
});

test('troubleshooting entry without a title is an error', () => {
  const { errors } = parseTroubleshooting([{ file: '/c/troubleshooting/p1.md', src: '### \n내용\n' }]);
  assert.deepEqual(
    errors.map((e) => [e.code, e.line]),
    [['E_TS_EMPTY', 1]],
  );
});

// ───────────── 생성 페이지 ─────────────

const routes = new Set(['#/day/fa-d01', '#/page/glossary']);

function makeGlossary(files) {
  const { entries, errors } = parseGlossary(files);
  assert.deepEqual(errors, []);
  const terms = new Map(entries.map((e) => [e.term, e.slug]));
  return { entries, terms };
}

test('glossary page sorts entries in Korean order and gives each an id', () => {
  const { entries, terms } = makeGlossary([
    {
      file: '/c/glossary/a.md',
      src: '### 하늘\n나중\n\n### 바다\n[[하늘]]을 봐요.\n\n### 가나\n처음\n\n### C#\n영문\n',
    },
  ]);
  const page = renderGlossaryPage(entries, { terms, routes });
  assert.deepEqual(page.errors, []);
  const ids = [...page.html.matchAll(/<section class="term-entry" id="(term-[^"]+)"/g)].map((m) => m[1]);
  // localeCompare('ko'): 한글이 영문보다 앞에 오고, 한글끼리는 사전순이다
  assert.deepEqual(ids, ['term-가나', 'term-바다', 'term-하늘', 'term-c']);
  assert.match(page.html, /<h3[^>]*>가나<\/h3>/); // 용어는 h3, 묶음(ㄱ 등)이 h2
  // 본문은 renderMarkdown을 거친다: 용어 링크가 같은 규칙으로 걸린다
  assert.match(page.html, /<a class="term" href="#\/page\/glossary\/term-하늘">하늘<\/a>/);
  assert.match(page.text, /가나 처음/);
});

test('glossary page escapes raw HTML in term names and bodies', () => {
  const { entries, terms } = makeGlossary([
    { file: '/c/glossary/a.md', src: '### <script>alert(1)</script>\n<img src=x onerror=alert(1)>\n' },
  ]);
  const page = renderGlossaryPage(entries, { terms, routes });
  assert.doesNotMatch(page.html, /<script|<img/i);
  assert.match(page.html, /&lt;script&gt;/);
});

test('glossary page errors point at the source file and line', () => {
  const { entries, terms } = makeGlossary([
    {
      file: '/c/glossary/a.md',
      src: '### 하나\n정상이에요.\n\n### 둘\n첫 줄\n\n모르는 [[없는용어]] 와 [없는 곳](#/day/zz-d99) 이 있어요.\n',
    },
  ]);
  const page = renderGlossaryPage(entries, { terms, routes });
  const byCode = Object.fromEntries(page.errors.map((e) => [e.code, e]));
  assert.deepEqual(Object.keys(byCode).sort(), ['E_LINK_UNKNOWN', 'E_TERM_UNKNOWN']);
  for (const e of page.errors) {
    assert.equal(e.file, '/c/glossary/a.md');
    assert.equal(e.line, 7);
  }
});

test('troubleshooting page groups by project title and keeps authored order', () => {
  const { groups, errors } = parseTroubleshooting([
    { file: '/c/ts/p1.md', src: '### 증상 하나\n[[용어]]를 봐요.\n\n### `npm` 이 안 돼요\n해결\n' },
    { file: '/c/ts/zz-extra.md', src: '### 기타\n내용\n' },
    { file: '/c/ts/sp.md', src: '### 후원 증상\n내용\n' },
  ]);
  assert.deepEqual(errors, []);
  const projects = [
    { id: 'p1', title: '나의 크리에이터 홈페이지' },
    { id: 'sp', title: '이미지 도네이션' },
  ];
  const terms = new Map([['용어', '용어']]);
  const page = renderTroubleshootingPage(groups, projects, { terms, routes });
  assert.deepEqual(page.errors, []);
  // 목차 머리("목차")를 빼고 월드 묶음의 h2 만 본다
  const heads = [...page.html.matchAll(/<section class="ts-group"[^>]*>\n<h2[^>]*>(.*?)<\/h2>/g)].map((m) => m[1].replace(/<[^>]+>/g, ''));
  // 월드 제목 앞에는 그 월드의 문장(도트 그림) 칸. 프로젝트가 아닌 접두어는 별
  assert.match(page.html, /<h2 id="tsh-p1"><span class="badge"><svg class="px px-house emblem"/);
  assert.match(page.html, /<h2 id="tsh-zz"><span class="badge"><svg class="px px-star emblem"/);
  // 프로젝트 순서(p1, sp) 다음에, 프로젝트가 아닌 접두어는 접두어 이름 그대로 맨 뒤에
  assert.deepEqual(heads, ['나의 크리에이터 홈페이지', '이미지 도네이션', 'zz']);
  assert.match(page.html, /<section class="ts-group" id="ts-p1">/);
  // 증상 제목은 heading 이 아니라 Accordion 요약 줄이다
  assert.match(page.html, /<summary>[^]*?<span class="ts-title">증상 하나<\/span><\/summary>/);
  assert.match(page.html, /<span class="ts-title"><code>npm<\/code> 이 안 돼요<\/span><\/summary>/);
  assert.match(page.html, /<a class="term" href="#\/page\/glossary\/term-용어">용어<\/a>/);
  assert.ok(page.html.indexOf('증상 하나') < page.html.indexOf('이 안 돼요'));
});

test('troubleshooting page errors point at the source line', () => {
  const { groups } = parseTroubleshooting([
    { file: '/c/ts/p1.md', src: '### 하나\n정상\n\n### 둘\n\n```\n언어 없는 코드\n```\n' },
  ]);
  const page = renderTroubleshootingPage(groups, [{ id: 'p1', title: 'P1' }], { terms: new Map(), routes });
  assert.deepEqual(
    page.errors.map((e) => [e.code, e.file, e.line]),
    [['E_FENCE_LANG', '/c/ts/p1.md', 6]],
  );
});

test('empty generated pages still render', () => {
  assert.equal(renderGlossaryPage([], { terms: new Map(), routes }).errors.length, 0);
  const page = renderTroubleshootingPage([], [], { terms: new Map(), routes });
  assert.deepEqual(page.errors, []);
  assert.equal(typeof page.html, 'string');
});


test('glossaryIndexKey groups by merged initial consonant, Latin letter or symbol', () => {
  assert.deepEqual(glossaryIndexKey('가변 참조'), { key: 'ko-1', label: 'ㄱ' });
  assert.deepEqual(glossaryIndexKey('깃허브'), { key: 'ko-1', label: 'ㄱ' });
  assert.deepEqual(glossaryIndexKey('쓰레드'), { key: 'ko-7', label: 'ㅅ' });
  assert.deepEqual(glossaryIndexKey('후원'), { key: 'ko-14', label: 'ㅎ' });
  assert.deepEqual(glossaryIndexKey('xUnit'), { key: 'en-x', label: 'X' });
  assert.deepEqual(glossaryIndexKey('.NET'), { key: 'etc', label: '기호·숫자' });
  assert.deepEqual(glossaryIndexKey('1:N 관계'), { key: 'etc', label: '기호·숫자' });
});

test('glossary page has an index and groups in symbol, Hangul, Latin order', () => {
  const { entries, terms } = makeGlossary([{ file: '/c/glossary/a.md', src: '### API\n영문\n\n### 하나\n끝\n\n### .env\n기호\n\n### 가나다\n처음\n' }]);
  const page = renderGlossaryPage(entries, { terms, routes });
  assert.deepEqual(page.errors, []);
  const groups = [...page.html.matchAll(/<section class="gl-group" id="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(groups, ['gl-etc', 'gl-ko-1', 'gl-ko-14', 'gl-en-a']);
  const index = page.html.slice(0, page.html.indexOf('</nav>'));
  assert.match(index, /^<nav class="toc gl-index" aria-labelledby="gl-index-h">/);
  const links = [...index.matchAll(/<a href="([^"]+)" aria-label="([^"]+)">([^<]+)<\/a>/g)].map((m) => [m[1], m[2], m[3]]);
  assert.deepEqual(links, [
    ['#/page/glossary/gl-etc', '기호·숫자, 용어 1개', '기호·숫자'],
    ['#/page/glossary/gl-ko-1', 'ㄱ, 용어 1개', 'ㄱ'],
    ['#/page/glossary/gl-ko-14', 'ㅎ, 용어 1개', 'ㅎ'],
    ['#/page/glossary/gl-en-a', 'A, 용어 1개', 'A'],
  ]);
  const ids = [...page.html.matchAll(/<section class="term-entry" id="(term-[^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(ids, ['term-env', 'term-가나다', 'term-하나', 'term-api']);
  // 묶음 머리: 첫 자음 제목 옆에 용어 수 라벨
  assert.match(page.html, /<div class="gl-head">\n<h2 id="glh-ko-1">ㄱ<\/h2>\n<span class="label">용어 1개<\/span>\n<\/div>/);
  assert.match(page.html, /<h3[^>]*>API<\/h3>/);
});

test('troubleshooting entries remember their first related day', () => {
  const { groups } = parseTroubleshooting([{ file: '/c/ts/p1.md', src: '### 하나\n- 관련: [P1 Day 2](#/day/p1-d02), [P1 Day 1](#/day/p1-d01)\n\n본문\n\n### 둘\n본문\n' }]);
  assert.deepEqual(groups[0].entries.map((e) => e.day), ['p1-d02', null]);
});

test('filterPublished drops entries of unpublished days and empty groups', () => {
  const entry = (title, day) => ({ title, md: '', file: 'f', line: 1, day });
  const groups = [
    { project: 'p1', entries: [entry('a', 'p1-d01'), entry('b', 'p1-d02'), entry('c', null)] },
    { project: 'sp', entries: [entry('d', 'sp-d01')] },
  ];
  const kept = filterPublished(groups, new Set(['p1-d01']));
  assert.deepEqual(
    kept.map((g) => [g.project, g.entries.map((e) => e.day)]),
    [['p1', ['p1-d01', null]]],
  );
  assert.equal(filterPublished(groups, null), groups);
});

test('troubleshooting page has a toc and day groups of details with no heading inside summary', () => {
  const src = [
    '### A\n- 관련: [Day 2](#/day/p1-d02)\n\n본문 A\n',
    '### B\n- 관련: [Day 1](#/day/p1-d01)\n\n본문 B\n',
    '### `npm` 이 안 돼요\n- 관련: [Day 1](#/day/p1-d01)\n\n본문\n',
    '### C\n관련 줄 없음\n',
    '### D\n- 관련: [다른 월드](#/day/p9-d01)\n\n본문 D\n',
  ].join('\n');
  const { groups } = parseTroubleshooting([{ file: '/c/ts/p1.md', src }]);
  const projects = [{ id: 'p1', title: 'P1', days: [{ id: 'p1-d01', num: 1, title: '첫날' }, { id: 'p1-d02', num: 2, title: '둘째날' }] }];
  const routes2 = new Set([...routes, '#/day/p1-d01', '#/day/p1-d02', '#/day/p9-d01']);
  const page = renderTroubleshootingPage(groups, projects, { terms: new Map(), routes: routes2 });
  assert.deepEqual(page.errors, []);
  // 화면 낭독기가 읽는 제목(aria-hidden 칸을 뺀 글자)은 "Day n · 제목"
  const spoken = (html) => html.replace(/<span[^>]*aria-hidden="true"[^>]*>[^<]*<\/span>/g, '').replace(/<[^>]+>/g, '');
  const days = [...page.html.matchAll(/<section class="ts-day" id="([^"]+)"[^>]*>\n<h3[^>]*>(.*?)<\/h3>/g)].map((m) => [m[1], spoken(m[2])]);
  // 눈에는 Day 칸(번호)과 제목이 보인다. 그 밖의 증상에는 칸이 없다
  assert.match(page.html, /<h3 id="tsh-ts-p1-d01"><span class="day-tile" aria-hidden="true">1<\/span><span class="sr-only">Day 1 · <\/span>첫날<\/h3>/);
  assert.match(page.html, /<h3 id="tsh-ts-p1-etc">그 밖의 증상<\/h3>/);
  assert.deepEqual(days, [
    ['ts-p1-d01', 'Day 1 · 첫날'],
    ['ts-p1-d02', 'Day 2 · 둘째날'],
    ['ts-p1-etc', '그 밖의 증상'],
  ]);
  const ids = [...page.html.matchAll(/<details class="ts-entry" id="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(ids, ['ts-p1-d01-1', 'ts-p1-d01-2', 'ts-p1-d02-1', 'ts-p1-etc-1', 'ts-p1-etc-2']);
  assert.match(page.html, /<summary>[^]*?<code>npm<\/code> 이 안 돼요[^]*?<\/summary>/);
  for (const m of page.html.matchAll(/<summary>([^]*?)<\/summary>/g)) assert.doesNotMatch(m[1], /<h\d/, 'summary 안에는 heading 이 없다');
  // D(다른 월드의 Day)는 그 밖의 증상 묶음의 둘째
  assert.match(page.html, /id="ts-p1-etc-2"[^]*?<span class="ts-title">D<\/span>/);
  const toc = page.html.slice(0, page.html.indexOf('</nav>'));
  assert.match(toc, /^<nav class="toc ts-toc" aria-labelledby="ts-toc-h">/);
  assert.match(toc, /<a href="#\/page\/troubleshooting\/ts-p1">P1<\/a>/);
  assert.match(toc, /<span class="label">증상 5개<\/span>/);
  const links = [...toc.matchAll(/<li><a href="([^"]+)" aria-label="([^"]+)">([^<]+)<\/a><\/li>/g)].map((m) => [m[1], m[2], m[3]]);
  assert.deepEqual(links, [
    ['#/page/troubleshooting/ts-p1-d01', 'Day 1, 증상 2개', 'Day 1'],
    ['#/page/troubleshooting/ts-p1-d02', 'Day 2, 증상 1개', 'Day 2'],
    ['#/page/troubleshooting/ts-p1-etc', '그 밖의 증상, 증상 2개', '그 밖의 증상'],
  ]);
  const help = renderTroubleshootingPage(groups, projects, { terms: new Map(), routes: routes2, pageId: 'help' });
  assert.match(help.html, /href="#\/page\/help\/ts-p1-d01"/);
  assert.doesNotMatch(help.html, /#\/page\/troubleshooting\//);
});
