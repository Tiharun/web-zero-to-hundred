import { test } from 'node:test';
import assert from 'node:assert/strict';
import { headTags, listRoutes } from '../../textbook/lib/site.mjs';

test('headTags escapes values and carries the one configured url', () => {
  const html = headTags({ title: 'A & "B"', url: 'https://example.test/book/', description: '<설명>' }, 'data:image/svg+xml,x');
  assert.match(html, /<title>A &amp; &quot;B&quot;<\/title>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/example\.test\/book\/">/);
  assert.match(html, /<meta property="og:url" content="https:\/\/example\.test\/book\/">/);
  assert.match(html, /<meta property="og:title" content="A &amp; &quot;B&quot;">/);
  assert.match(html, /<meta property="og:description" content="&lt;설명&gt;">/);
  assert.match(html, /<meta property="og:type" content="website">/);
  assert.match(html, /<meta name="description" content="&lt;설명&gt;">/);
  assert.match(html, /<link rel="icon" href="data:image\/svg\+xml,x">/);
});

test('listRoutes lists every screen once', () => {
  const routes = listRoutes({ projects: [{ id: 'fa', days: [{ id: 'fa-d01' }, { id: 'fa-d02' }] }], pages: [{ id: 'start' }] });
  assert.deepEqual(routes, ['#/', '#/settings', '#/search', '#/project/fa', '#/day/fa-d01', '#/day/fa-d02', '#/page/start']);
});
