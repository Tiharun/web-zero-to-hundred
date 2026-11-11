import { test } from 'node:test';
import assert from 'node:assert/strict';
import { faviconDataUri, headTags, listRoutes } from '../../textbook/lib/site.mjs';

test('faviconDataUri draws the pawn with the three token colours', () => {
  const uri = faviconDataUri(':root{--color-ink:#111111;--color-accent:#222222;--color-accent-hover:#333333}\n:root[data-theme="dark"]{--color-ink:#999999}');
  assert.ok(uri.startsWith('data:image/svg+xml,'), uri);
  const svg = decodeURIComponent(uri.slice('data:image/svg+xml,'.length));
  for (const c of ['#111111', '#222222', '#333333']) assert.ok(svg.includes(c), c);
  assert.equal(svg.includes('#999999'), false, '첫 :root(라이트) 값만 쓴다');
  assert.match(svg, /width="32" height="32"/);
  assert.match(svg, /shape-rendering="crispEdges"/);
  assert.throws(() => faviconDataUri(':root{--color-ink:#111}'), /color-accent/);
});

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
