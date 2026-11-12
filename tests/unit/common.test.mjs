import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lockReason, worldLabel } from '../../textbook/src/app/views/common.js';

test('worldLabel names main and special worlds', () => {
  assert.equal(worldLabel({ track: 'main', order: 2 }), '월드 2');
  assert.equal(worldLabel({ track: 'special', order: 1 }), '특별 월드');
});

test('lockReason lists required titles and skips unknown ids', () => {
  const cur = { projects: [{ id: 'fa', title: 'A' }, { id: 'fb', title: 'B' }], pages: [] };
  assert.equal(lockReason(cur, ['fa', 'fb']), '‘A’, ‘B’ 프로젝트를 끝내면 열려요.');
  assert.equal(lockReason(cur, ['zz']), '');
  assert.equal(lockReason(cur, undefined), '');
});
