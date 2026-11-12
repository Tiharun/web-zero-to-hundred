import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LEVEL_XP, levelOf, totalXp } from '../../textbook/src/app/level.js';

const cur = {
  projects: [
    { id: 'fa', days: [{ id: 'fa-d01', minutes: 60 }, { id: 'fa-d02', minutes: 90 }] },
    { id: 'fb', days: [{ id: 'fb-d01', minutes: 75 }] },
  ],
};
const prog = (...ids) => ({ completed: Object.fromEntries(ids.map((id) => [id, 't'])) });

test('LEVEL_XP is 300', () => assert.equal(LEVEL_XP, 300));

test('levelOf follows the DESIGN.md HUD formula', () => {
  assert.deepEqual(levelOf(0), { xp: 0, level: 1, inLevel: 0, toNext: 300, ratio: 0 });
  assert.deepEqual(levelOf(299), { xp: 299, level: 1, inLevel: 299, toNext: 1, ratio: 299 / 300 });
  assert.deepEqual(levelOf(300), { xp: 300, level: 2, inLevel: 0, toNext: 300, ratio: 0 });
  assert.deepEqual(levelOf(1260), { xp: 1260, level: 5, inLevel: 60, toNext: 240, ratio: 0.2 });
});

test('totalXp sums minutes of completed days and ignores unknown ids', () => {
  assert.equal(totalXp(cur, prog()), 0);
  assert.equal(totalXp(cur, prog('fa-d01', 'zz-d99')), 60);
  assert.equal(totalXp(cur, prog('fa-d01', 'fa-d02', 'fb-d01')), 225);
});
