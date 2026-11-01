import { test } from 'node:test';
import assert from 'node:assert/strict';
import { search } from '../../textbook/src/app/search.js';

function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const v of Object.values(value)) deepFreeze(v);
  }
  return value;
}

const index = deepFreeze([
  { id: 'fa-d01', kind: 'day', project: 'fa', title: '첫 번째 Day', text: 'HTML 로 제목과 문단을 써요. 그다음 CSS 로 색을 바꿔요.' },
  { id: 'fa-d02', kind: 'day', project: 'fa', title: 'Flexbox 배치', text: '카드를 가로로 놓아요. 다른 설명은 길어요. flexbox 는 한 줄 배치에 좋아요.' },
  { id: 'fa-d03', kind: 'day', project: 'fa', title: '레이아웃 복습', text: 'flexbox flexbox flexbox flexbox 를 연습해요. 그리고 flexbox 한 번 더.' },
  { id: 'fb-d01', kind: 'day', project: 'fb', title: '비밀 Day', text: '잠금이 풀린 뒤에만 읽는 내용이에요. 고유 단어는 비밀단어zz 예요.' },
  { id: 'start', kind: 'page', project: null, title: '시작하기', text: '이 교재는 HTML 부터 시작해요.' },
  { id: 'secret', kind: 'page', project: null, title: '비밀 페이지', text: '프로젝트 B를 끝내야 열리는 페이지예요. 고유 단어는 비밀페이지zz 예요.' },
]);

const nothingLocked = () => false;
const ids = (results) => results.map((r) => r.id);

test('matches all terms', () => {
  assert.deepEqual(ids(search(index, 'html css', nothingLocked)), ['fa-d01']);
  assert.deepEqual(ids(search(index, 'html', nothingLocked)).sort(), ['fa-d01', 'start']);
  assert.deepEqual(search(index, 'html 없는단어', nothingLocked), []);
  // 단어 순서와 대소문자는 상관없다
  assert.deepEqual(ids(search(index, 'CSS   HTML', nothingLocked)), ['fa-d01']);
});

test('a term may match the title while another matches the body', () => {
  assert.deepEqual(ids(search(index, '배치 카드', nothingLocked)), ['fa-d02']);
});

test('title match ranks first', () => {
  // fa-d02: 제목에 1번(10점) + 본문 1번 = 11점. fa-d03: 본문에만 5번 = 5점
  const res = search(index, 'flexbox', nothingLocked);
  assert.deepEqual(ids(res), ['fa-d02', 'fa-d03']);
  assert.deepEqual(Object.keys(res[0]).sort(), ['id', 'kind', 'project', 'snippet', 'title']);
  assert.equal(res[0].kind, 'day');
  assert.equal(res[0].project, 'fa');
  assert.equal(res[0].title, 'Flexbox 배치', '제목은 원문 그대로');
});

test('equal scores keep index order', () => {
  const same = deepFreeze([
    { id: 'b', kind: 'day', project: 'fa', title: 'x', text: 'foo' },
    { id: 'a', kind: 'day', project: 'fa', title: 'y', text: 'foo' },
  ]);
  assert.deepEqual(ids(search(same, 'foo', nothingLocked)), ['b', 'a']);
});

test('locked project hides snippet', () => {
  const isLocked = (item) => item.project === 'fb';
  const res = search(index, '비밀단어zz', isLocked);
  assert.deepEqual(ids(res), ['fb-d01']);
  assert.equal(res[0].snippet, null);
  assert.equal(res[0].title, '비밀 Day', '제목은 보여 준다');

  const open = search(index, '비밀단어zz', nothingLocked);
  assert.match(open[0].snippet, /비밀단어zz/);

  // 해금된 프로젝트의 결과에는 snippet 이 있다
  const mixed = search(index, 'day', isLocked);
  assert.ok(mixed.length >= 1);
  for (const r of mixed) assert.equal(r.snippet === null, r.project === 'fb');
});

test('locked page returns title only', () => {
  const seen = [];
  const isLocked = (item) => (seen.push(item), item.kind === 'page' && item.id === 'secret');
  const res = search(index, '비밀페이지zz', isLocked);
  assert.deepEqual(ids(res), ['secret'], '잠겨 있어도 본문 단어로 찾아진다');
  assert.equal(res[0].snippet, null);
  assert.equal(res[0].title, '비밀 페이지');
  assert.equal(res[0].kind, 'page');
  assert.equal(res[0].project, null);
  assert.deepEqual(seen.map((item) => item.id), ['secret'], '술어는 색인 항목을 받는다(일치한 항목만)');
  assert.equal(seen[0], index.find((item) => item.id === 'secret'));
});

test('unlocked page keeps snippet', () => {
  // 다른 페이지가 잠겨 있어도 열린 페이지(start)와 project 가 없는 항목의 snippet 은 그대로다
  const isLocked = (item) => item.id === 'secret';
  const res = search(index, 'html', isLocked);
  const start = res.find((r) => r.id === 'start');
  assert.equal(start.snippet, '이 교재는 HTML 부터 시작해요.');
  const secret = search(index, '비밀페이지zz', () => false);
  assert.match(secret[0].snippet, /비밀페이지zz/, '열려 있으면 잠긴 적 없는 것처럼 snippet 이 나온다');
});

test('days of locked projects and locked pages are both gated by the same predicate', () => {
  const isLocked = (item) => item.project === 'fb' || item.id === 'secret';
  const res = search(index, '비밀', isLocked);
  assert.deepEqual(ids(res).sort(), ['fb-d01', 'secret']);
  for (const r of res) assert.equal(r.snippet, null, r.id);
});

test('korean NFC query matches', () => {
  const nfdQuery = '문단'.normalize('NFD');
  assert.notEqual(nfdQuery, '문단');
  assert.deepEqual(ids(search(index, nfdQuery, nothingLocked)), ['fa-d01']);

  // 색인이 NFD 로 들어 있어도 NFC 질의로 찾는다
  const nfdIndex = deepFreeze([{ id: 'k', kind: 'day', project: 'fa', title: '한글'.normalize('NFD'), text: '자음과 모음'.normalize('NFD') }]);
  assert.deepEqual(ids(search(nfdIndex, '모음', nothingLocked)), ['k']);
  assert.deepEqual(ids(search(nfdIndex, '한글', nothingLocked)), ['k']);
});

test('snippet is up to 40 characters around the first match', () => {
  const body = `${'가'.repeat(100)} 목표단어 ${'나'.repeat(100)}`;
  const one = deepFreeze([{ id: 'long', kind: 'day', project: 'fa', title: '긴 글', text: body }]);
  const [res] = search(one, '목표단어', nothingLocked);
  assert.ok(res.snippet.includes('목표단어'));
  assert.ok(res.snippet.startsWith('…'), '앞이 잘렸다는 표시');
  assert.ok(res.snippet.endsWith('…'), '뒤가 잘렸다는 표시');
  const inner = res.snippet.slice(1, -1);
  const at = inner.indexOf('목표단어');
  assert.equal(at, 40, '일치 앞 40자');
  assert.equal(inner.length - at - '목표단어'.length, 40, '일치 뒤 40자');
});

test('snippet has no ellipsis when the whole text fits, and keeps original case', () => {
  const [res] = search(index, 'html', (item) => item.project !== 'fa').filter((r) => r.id === 'fa-d01');
  assert.equal(res.snippet, 'HTML 로 제목과 문단을 써요. 그다음 CSS 로 색을 바꿔요.');
});

test('snippet follows the earliest match among the terms', () => {
  const one = deepFreeze([{ id: 'x', kind: 'day', project: 'fa', title: 't', text: `${'a'.repeat(120)} beta ${'b'.repeat(10)} alpha ${'c'.repeat(120)}` }]);
  const [res] = search(one, 'alpha beta', nothingLocked);
  assert.ok(res.snippet.includes('beta'));
});

test('title-only match still gives an opening snippet for unlocked items', () => {
  const one = deepFreeze([{ id: 'x', kind: 'day', project: 'fa', title: '제목에만 있는 낱말', text: '본문은 다른 이야기를 해요. '.repeat(20) }]);
  const [res] = search(one, '낱말', nothingLocked);
  assert.equal(typeof res.snippet, 'string');
  assert.ok(res.snippet.length > 0 && res.snippet.length <= 82);
  assert.ok(res.snippet.startsWith('본문은'));
  assert.equal(search(one, '낱말', () => true)[0].snippet, null);
});

test('snippet does not cut a surrogate pair in half', () => {
  const text = `${'😀'.repeat(30)}목표${'😀'.repeat(30)}`;
  const one = deepFreeze([{ id: 'e', kind: 'day', project: 'fa', title: 't', text }]);
  const [res] = search(one, '목표', nothingLocked);
  assert.doesNotMatch(res.snippet, /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/, '짝 없는 서로게이트 없음');
});

test('limit caps the result count (default 30)', () => {
  const many = deepFreeze(Array.from({ length: 40 }, (_, i) => ({ id: `d${i}`, kind: 'day', project: 'fa', title: `t${i}`, text: 'common' })));
  assert.equal(search(many, 'common', nothingLocked).length, 30);
  assert.equal(search(many, 'common', nothingLocked, 5).length, 5);
  assert.equal(search(many, 'common', nothingLocked, 100).length, 40);
});

test('empty or odd queries return no results', () => {
  for (const q of ['', '   ', undefined, null, 42]) assert.deepEqual(search(index, q, nothingLocked), [], String(q));
  assert.deepEqual(search(undefined, 'html', nothingLocked), []);
  assert.deepEqual(search([], 'html', nothingLocked), []);
});

test('regex characters in the query are literal', () => {
  const one = deepFreeze([{ id: 'r', kind: 'day', project: 'fa', title: 't', text: 'C++ (괄호) [대괄호] a.b' }]);
  assert.deepEqual(ids(search(one, 'c++', nothingLocked)), ['r']);
  assert.deepEqual(ids(search(one, '(괄호)', nothingLocked)), ['r']);
  assert.deepEqual(ids(search(one, '[대괄호]', nothingLocked)), ['r']);
  assert.deepEqual(search(one, 'a.c', nothingLocked), []);
  assert.deepEqual(ids(search(one, 'a.b', nothingLocked)), ['r']);
});
