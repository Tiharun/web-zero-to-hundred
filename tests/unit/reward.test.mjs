import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rewardEvents, rewardKey, rewardModal, rewardToast } from '../../textbook/src/app/reward.js';

const day = (id, num, minutes) => ({ id, num, minutes });
const cur = {
  projects: [
    { id: 'a', requires: [], days: [day('a1', 1, 120), day('a2', 2, 120), day('a3', 3, 120), day('a4', 4, 60)] },
    { id: 'b', requires: ['a'], days: [day('b1', 1, null)] },
  ],
  pages: [],
};
const P = (ids) => ({ version: 1, completed: Object.fromEntries(ids.map((id) => [id, 't'])), checks: {}, lastDay: null, theme: 'system' });
const base = { day: { id: 'a1', num: 1, minutes: 120 }, levelUp: null, worldClear: null, unlocked: [] };

test('rewardEvents: no level, no world', () => {
  const e = rewardEvents(cur, P([]), P(['a1']), 'a1');
  assert.deepEqual(e, base);
});

test('rewardEvents: crossing 300 XP is a level up', () => {
  const e = rewardEvents(cur, P(['a1', 'a2']), P(['a1', 'a2', 'a3']), 'a3');
  assert.deepEqual(e.levelUp, { from: 1, to: 2, toNext: 240 });
  assert.equal(e.worldClear, null);
});

test('rewardEvents: last day of a world clears it and unlocks the next', () => {
  const e = rewardEvents(cur, P(['a1', 'a2', 'a3']), P(['a1', 'a2', 'a3', 'a4']), 'a4');
  assert.equal(e.worldClear, 'a');
  assert.equal(e.levelUp, null);
  assert.deepEqual(e.unlocked, ['b']);
});

test('rewardEvents: a day without numeric minutes gives no XP', () => {
  const all = ['a1', 'a2', 'a3', 'a4'];
  const e = rewardEvents(cur, P(all), P([...all, 'b1']), 'b1');
  assert.deepEqual(e.day, { id: 'b1', num: 1, minutes: null });
  assert.equal(e.levelUp, null);
  assert.equal(e.worldClear, 'b');
});

test('rewardModal: world wins over level and carries the level', () => {
  assert.deepEqual(rewardModal({ ...base, levelUp: { from: 1, to: 2, toNext: 240 }, worldClear: 'a' }), { kind: 'world', pid: 'a', level: 2 });
  assert.deepEqual(rewardModal({ ...base, worldClear: 'a' }), { kind: 'world', pid: 'a', level: null });
  assert.deepEqual(rewardModal({ ...base, levelUp: { from: 1, to: 2, toNext: 240 } }), { kind: 'level', level: 2, toNext: 240 });
  assert.equal(rewardModal(base), null);
});

test('rewardKey', () => {
  assert.equal(rewardKey({ kind: 'world', pid: 'a', level: null }), 'celebrate:a');
  assert.equal(rewardKey({ kind: 'level', level: 3, toNext: 10 }), 'levelup:3');
});

test('rewardToast', () => {
  assert.equal(rewardToast(base), 'Day 1 완료! 보상 +120 XP');
  assert.equal(rewardToast({ ...base, day: { id: 'b1', num: 1, minutes: null } }), 'Day 1 완료!');
  assert.equal(rewardToast({ ...base, unlocked: ['b'] }), 'Day 1 완료! 보상 +120 XP · 새로 열린 곳이 있어요');
});
