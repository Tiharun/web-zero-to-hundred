import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ICON_PATHS, PIXELS, iconSvg, pxSvg } from '../../textbook/src/app/views/icons.js';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));

test('icon data equals DESIGN.md', async () => {
  const design = await readFile(path.join(ROOT, 'DESIGN.md'), 'utf8');
  for (const [name, d] of Object.entries(ICON_PATHS)) assert.ok(design.includes(`${name}: '${d}'`), name);
  for (const [name, rows] of Object.entries(PIXELS)) assert.ok(design.includes(`${name}: [${rows.map((r) => `'${r}'`).join(', ')}]`), name);
  assert.equal(Object.keys(ICON_PATHS).length, 11);
  assert.equal(Object.keys(PIXELS).length, 17);
});

test('pxSvg draws one path per layer at an integer scale', () => {
  const svg = pxSvg('coin', { scale: 2 });
  assert.match(svg, /width="16" height="16"/);
  assert.match(svg, /viewBox="0 0 8 8"/);
  assert.match(svg, /shape-rendering="crispEdges"/);
  assert.match(svg, /aria-hidden="true"/);
  assert.equal((svg.match(/<path /g) ?? []).length, 3); // # o h
  assert.equal((pxSvg('check').match(/<path /g) ?? []).length, 1); // # 만
  assert.match(pxSvg('wrench', { scale: 3, cls: 'big' }), /class="px px-wrench big"[^>]*width="24" height="24"/);
  assert.throws(() => pxSvg('coin', { scale: 1.5 }));
  assert.throws(() => pxSvg('coin', { scale: 0 }));
  assert.throws(() => pxSvg('nope'));
});

test('iconSvg is decorative and uses currentColor', () => {
  const svg = iconSvg('search');
  assert.match(svg, /^<svg class="icon" /);
  assert.match(svg, /aria-hidden="true"/);
  assert.match(svg, /stroke="currentColor"/);
  assert.match(svg, /stroke-width="1\.75"/);
  assert.match(svg, /viewBox="0 0 16 16" width="16" height="16"/);
  assert.match(iconSvg('check', 'tick'), /^<svg class="icon tick" /);
  assert.throws(() => iconSvg('nope'));
});
