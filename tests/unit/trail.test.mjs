import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LAYOUTS, geometry, layouts, pathD, rowArrows, streakEnd, tipSide } from '../../textbook/src/app/trail.js';

test('LAYOUTS: s 5 columns 84px, m 10 columns 84px, l up to 15 columns 88px', () => {
  assert.equal(LAYOUTS.s.cols(30), 5);
  assert.equal(LAYOUTS.m.cols(30), 10);
  assert.equal(LAYOUTS.l.cols(30), 15);
  assert.equal(LAYOUTS.l.cols(45), 15);
  assert.equal(LAYOUTS.l.cols(10), 5);
  assert.deepEqual([LAYOUTS.s.rowH, LAYOUTS.m.rowH, LAYOUTS.l.rowH], [84, 84, 88]);
});

test('geometry snakes: even rows left to right, odd rows right to left', () => {
  const g = geometry(7, 5);
  assert.equal(g.rows, 2);
  assert.deepEqual([g.pts[4].r, g.pts[4].c, g.pts[5].r, g.pts[5].c, g.pts[6].c], [0, 4, 1, 4, 3]);
  assert.deepEqual([g.pts[0].x, g.pts[0].y, g.pts[0].vx, g.pts[0].vy], [10, 25, 50, 50]);
});

test('geometry: 45 days at 15 columns make 3 rows and end on the right', () => {
  const g = geometry(45, 15);
  assert.equal(g.rows, 3);
  assert.deepEqual([g.pts[44].r, g.pts[44].c], [2, 14]);
});

test('geometry: zero days have no rows and no points', () => {
  assert.deepEqual(geometry(0, 5), { rows: 0, cols: 5, pts: [] });
});

test('layouts: one geometry per layout with its own column count', () => {
  const all = layouts(30);
  assert.deepEqual([all.s.cols, all.m.cols, all.l.cols], [5, 10, 15]);
  assert.deepEqual([all.s.rows, all.m.rows, all.l.rows], [6, 3, 2]);
});

test('pathD: straight in a row, outward curve at the right turn', () => {
  const { pts } = geometry(6, 5);
  const d = pathD(pts, 5);
  assert.ok(d.startsWith('M50 50 L150 50'));
  assert.ok(d.endsWith(' C492 50 492 150 450 150'));
  assert.equal(pathD(pts, 0), '');
});

test('pathD: a turn on the left edge bulges left', () => {
  assert.ok(pathD(geometry(11, 5).pts, 10).endsWith(' C8 150 8 250 50 250'));
});

test('streakEnd counts only the leading run', () => {
  assert.equal(streakEnd([]), -1);
  assert.equal(streakEnd([false, true]), -1);
  assert.equal(streakEnd([true, true, false, true]), 1);
});

test('rowArrows: one per row between the middle tiles, flipped on return rows, green when passed', () => {
  assert.deepEqual(rowArrows(geometry(10, 5), 2), [
    { x: 40, y: 25, back: false, done: true },
    { x: 60, y: 75, back: true, done: false },
  ]);
});

test('rowArrows skips a row with one tile', () => {
  assert.equal(rowArrows(geometry(6, 5), -1).length, 1);
});

test('tipSide: left half start, right half end', () => {
  const { pts } = geometry(5, 5);
  assert.deepEqual(
    pts.map((p) => tipSide(p, 5)),
    ['start', 'start', 'start', 'end', 'end'],
  );
});
