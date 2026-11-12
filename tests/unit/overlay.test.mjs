import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DIALOG_CLOSE_FALLBACK_MS, isOutside, menuIndex } from '../../textbook/src/app/views/overlay.js';

test('isOutside: edges count as inside', () => {
  const r = { left: 0, right: 280, top: 0, bottom: 740 };
  assert.equal(isOutside(r, 300, 10), true);
  assert.equal(isOutside(r, 280, 740), false);
  assert.equal(isOutside(r, 0, 0), false);
  assert.equal(isOutside(r, 10, -1), true);
});

test('menuIndex wraps and jumps', () => {
  assert.equal(menuIndex('ArrowDown', 2, 3), 0);
  assert.equal(menuIndex('ArrowDown', 0, 3), 1);
  assert.equal(menuIndex('ArrowUp', 0, 3), 2);
  assert.equal(menuIndex('ArrowUp', -1, 3), 2);
  assert.equal(menuIndex('Home', 1, 3), 0);
  assert.equal(menuIndex('End', 0, 3), 2);
  assert.equal(menuIndex('Enter', 0, 3), null);
  assert.equal(menuIndex('ArrowDown', 0, 0), null, '항목이 없으면 움직이지 않는다');
});

test('close fallback waits longer than the exit animation', () => {
  assert.equal(DIALOG_CLOSE_FALLBACK_MS, 260);
});
