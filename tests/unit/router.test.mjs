import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseHash } from '../../textbook/src/app/router.js';

test('parses all routes', () => {
  assert.deepEqual(parseHash(''), { name: 'home' });
  assert.deepEqual(parseHash('#/'), { name: 'home' });
  assert.deepEqual(parseHash('#/project/p1'), { name: 'project', pid: 'p1' });
  assert.deepEqual(parseHash('#/day/p1-d01'), { name: 'day', dayId: 'p1-d01' });
  assert.deepEqual(parseHash('#/page/glossary'), { name: 'page', id: 'glossary', anchor: null });
  assert.deepEqual(parseHash('#/page/glossary/term-html'), { name: 'page', id: 'glossary', anchor: 'term-html' });
  assert.deepEqual(parseHash('#/settings'), { name: 'settings' });
  assert.deepEqual(parseHash('#/search?q=html'), { name: 'search', q: 'html' });
});

test('decodes percent-encoded anchor', () => {
  assert.deepEqual(parseHash('#/page/glossary/term-%EC%83%81%EB%8C%80'), { name: 'page', id: 'glossary', anchor: 'term-상대' });
});

test('search query is url-decoded', () => {
  assert.deepEqual(parseHash('#/search?q=%ED%95%9C%EA%B8%80%20%EA%B2%80%EC%83%89'), { name: 'search', q: '한글 검색' });
  assert.deepEqual(parseHash('#/search?q=c%2B%2B'), { name: 'search', q: 'c++' });
  assert.deepEqual(parseHash('#/search?q=c++'), { name: 'search', q: 'c++' }, '+ 는 그대로 둔다');
  assert.deepEqual(parseHash('#/search?x=1&q=a%26b'), { name: 'search', q: 'a&b' });
  assert.deepEqual(parseHash('#/search?q=a=b'), { name: 'search', q: 'a=b' });
  assert.deepEqual(parseHash('#/search'), { name: 'search', q: '' });
  assert.deepEqual(parseHash('#/search?q='), { name: 'search', q: '' });
  assert.deepEqual(parseHash('#/search?other=1'), { name: 'search', q: '' });
});

test('unknown is notfound', () => {
  for (const hash of ['#/nope', '#nope', '#/day', '#/day/', '#/project', '#/project/', '#/page', '#/page/', '#/day/a/b', '#/project/a/b', '#/settings/x', '#/search/x', '#/page/a/b/c', 'project/p1', '#day/p1-d01']) {
    assert.deepEqual(parseHash(hash), { name: 'notfound' }, hash);
  }
  assert.deepEqual(parseHash('#/Day/p1-d01'), { name: 'notfound' }, '경로는 대소문자를 구분한다');
});

test('ids are not validated, only decoded', () => {
  assert.deepEqual(parseHash('#/day/does-not-exist'), { name: 'day', dayId: 'does-not-exist' });
  assert.deepEqual(parseHash('#/project/%ED%95%9C%EA%B8%80'), { name: 'project', pid: '한글' });
});

test('malformed percent-encoding does not throw', () => {
  assert.deepEqual(parseHash('#/page/glossary/term-%E0%A4%A'), { name: 'page', id: 'glossary', anchor: 'term-%E0%A4%A' });
  assert.deepEqual(parseHash('#/search?q=100%'), { name: 'search', q: '100%' });
  assert.deepEqual(parseHash('#/day/%'), { name: 'day', dayId: '%' });
});

test('tolerates a trailing slash, a bare # and a query on other routes', () => {
  assert.deepEqual(parseHash('#'), { name: 'home' });
  assert.deepEqual(parseHash('#/project/p1/'), { name: 'project', pid: 'p1' });
  assert.deepEqual(parseHash('#/page/glossary/'), { name: 'page', id: 'glossary', anchor: null });
  assert.deepEqual(parseHash('#/settings?x=1'), { name: 'settings' });
});

test('non-string input is treated as an empty hash', () => {
  assert.deepEqual(parseHash(undefined), { name: 'home' });
  assert.deepEqual(parseHash(null), { name: 'home' });
});
