import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  STORAGE_KEY,
  emptyProgress,
  normalizeProgress,
  isProjectComplete,
  isUnlocked,
  projectState,
  dayState,
  canComplete,
  canUncomplete,
  completeDay,
  uncompleteDay,
  toggleCheck,
  newlyUnlocked,
  continueTarget,
  percent,
  exportBackup,
  importBackup,
} from '../../textbook/src/app/progress.js';

// 입력 객체를 바꾸면 TypeError 가 나도록 깊게 얼린다 (순수 함수 검증)
function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const v of Object.values(value)) deepFreeze(v);
  }
  return value;
}

const day = (id, num, checkCount = 3) => ({ id, num, title: `Day ${num}`, minutes: 60, summary: '', checkCount });

/** 픽스처 data: fa 2 Day, fb 1 Day(fa 필요), 페이지 secret(fb 필요) */
function makeCur({ withSpecial = false } = {}) {
  const projects = [
    { id: 'fa', order: 1, track: 'main', requires: [], days: [day('fa-d01', 1), day('fa-d02', 2)] },
    { id: 'fb', order: 2, track: 'main', requires: ['fa'], days: [day('fb-d01', 1)] },
  ];
  if (withSpecial) {
    projects.push({ id: 'sp', order: 3, track: 'special', requires: ['fa'], days: [day('sp-d01', 1), day('sp-d02', 2)] });
  }
  return deepFreeze({
    projects,
    pages: [
      { id: 'start', title: '시작하기', requires: [] },
      { id: 'secret', title: '비밀 페이지', requires: ['fb'] },
      { id: 'glossary', title: '용어 사전' }, // requires 없음
    ],
  });
}

const T1 = '2026-11-01T01:00:00.000Z';
const T2 = '2026-11-01T02:00:00.000Z';
const T3 = '2026-11-01T03:00:00.000Z';

/** 주어진 Day 들을 차례로 완료한 진도 (얼린 채로 돌려준다) */
function completed(cur, ...dayIds) {
  let p = emptyProgress();
  dayIds.forEach((id, i) => {
    p = completeDay(cur, p, id, `2026-11-01T0${i + 1}:00:00.000Z`);
  });
  return deepFreeze(p);
}

test('storage key and empty progress shape', () => {
  assert.equal(STORAGE_KEY, 'wzh:v1:progress');
  assert.deepEqual(emptyProgress(), { version: 1, completed: {}, checks: {}, lastDay: null, theme: 'system' });
  assert.notEqual(emptyProgress(), emptyProgress(), '호출할 때마다 새 객체');
  assert.notEqual(emptyProgress().completed, emptyProgress().completed);
});

test('first day is next, second is open', () => {
  const cur = makeCur();
  const prog = deepFreeze(emptyProgress());
  assert.equal(dayState(cur, prog, 'fa-d01'), 'next');
  assert.equal(dayState(cur, prog, 'fa-d02'), 'open');
  assert.equal(dayState(cur, prog, 'fb-d01'), 'locked');
  assert.equal(projectState(cur, prog, 'fa'), 'active');
  assert.equal(projectState(cur, prog, 'fb'), 'locked');
});

test('unknown project or day is locked', () => {
  const cur = makeCur();
  const prog = deepFreeze(emptyProgress());
  assert.equal(projectState(cur, prog, 'nope'), 'locked');
  assert.equal(dayState(cur, prog, 'nope-d01'), 'locked');
  assert.equal(canComplete(cur, prog, 'nope-d01'), false);
  assert.equal(canUncomplete(cur, prog, 'nope-d01'), false);
  assert.equal(isProjectComplete(cur, prog, 'nope'), false);
});

test('isUnlocked treats missing requires as unlocked', () => {
  const cur = makeCur();
  const prog = deepFreeze(emptyProgress());
  assert.equal(isUnlocked(cur, prog, undefined), true);
  assert.equal(isUnlocked(cur, prog, []), true);
  assert.equal(isUnlocked(cur, prog, ['fa']), false);
  assert.equal(isUnlocked(cur, completed(cur, 'fa-d01', 'fa-d02'), ['fa']), true);
  assert.equal(isUnlocked(cur, prog, ['nope']), false, '모르는 프로젝트가 필요하면 잠김');
});

test('cannot complete second before first', () => {
  const cur = makeCur();
  const prog = deepFreeze(emptyProgress());
  assert.equal(canComplete(cur, prog, 'fa-d01'), true);
  assert.equal(canComplete(cur, prog, 'fa-d02'), false);
  assert.equal(canComplete(cur, prog, 'fb-d01'), false, '잠긴 프로젝트는 완료할 수 없다');
  assert.throws(() => completeDay(cur, prog, 'fa-d02', T1), { message: 'cannot-complete' });
  assert.throws(() => completeDay(cur, prog, 'fb-d01', T1), { message: 'cannot-complete' });
  assert.throws(() => completeDay(cur, prog, 'nope-d01', T1), { message: 'cannot-complete' });
});

test('completeDay records time and last day without touching the input', () => {
  const cur = makeCur();
  const before = deepFreeze(emptyProgress());
  const after = completeDay(cur, before, 'fa-d01', T1);
  assert.deepEqual(after.completed, { 'fa-d01': T1 });
  assert.equal(after.lastDay, 'fa-d01');
  assert.deepEqual(before, emptyProgress(), '입력은 그대로');
  assert.equal(dayState(cur, after, 'fa-d01'), 'done');
  assert.equal(dayState(cur, after, 'fa-d02'), 'next');
  assert.equal(canComplete(cur, after, 'fa-d01'), false, '이미 완료한 Day 는 다시 완료할 수 없다');
  assert.throws(() => completeDay(cur, after, 'fa-d01', T2), { message: 'cannot-complete' });
});

test('completing all fa unlocks fb', () => {
  const cur = makeCur();
  const p0 = deepFreeze(emptyProgress());
  const p1 = deepFreeze(completeDay(cur, p0, 'fa-d01', T1));
  assert.deepEqual(newlyUnlocked(cur, p0, p1), [], '프로젝트 끝나기 전에는 아무것도 열리지 않는다');
  const p2 = deepFreeze(completeDay(cur, p1, 'fa-d02', T2));
  assert.deepEqual(newlyUnlocked(cur, p0, p2), ['fb']);
  assert.deepEqual(newlyUnlocked(cur, p1, p2), ['fb']);
  assert.equal(projectState(cur, p2, 'fa'), 'complete');
  assert.equal(projectState(cur, p2, 'fb'), 'active');
  assert.equal(dayState(cur, p2, 'fb-d01'), 'next');
});

test('newlyUnlocked reports unlocked pages as well as projects', () => {
  const cur = makeCur();
  const p2 = completed(cur, 'fa-d01', 'fa-d02');
  const p3 = deepFreeze(completeDay(cur, p2, 'fb-d01', T3));
  assert.deepEqual(newlyUnlocked(cur, p2, p3), ['secret']);
  assert.deepEqual(newlyUnlocked(cur, emptyProgress(), p3), ['fb', 'secret']);
  assert.deepEqual(newlyUnlocked(cur, p3, p3), []);
  assert.deepEqual(newlyUnlocked(cur, p3, p2), [], '다시 잠기는 것은 보고하지 않는다');
});

test('uncomplete only latest', () => {
  const cur = makeCur();
  const prog = completed(cur, 'fa-d01', 'fa-d02');
  assert.equal(canUncomplete(cur, prog, 'fa-d01'), false, '다음 Day 가 완료돼 있으면 못 되돌린다');
  assert.equal(canUncomplete(cur, prog, 'fa-d02'), true);
  assert.throws(() => uncompleteDay(cur, prog, 'fa-d01'), { message: 'cannot-uncomplete' });

  const back = uncompleteDay(cur, prog, 'fa-d02');
  assert.deepEqual(Object.keys(back.completed), ['fa-d01']);
  assert.deepEqual(Object.keys(prog.completed), ['fa-d01', 'fa-d02'], '입력은 그대로');
  assert.equal(canUncomplete(cur, back, 'fa-d02'), false, '완료하지 않은 Day');
  assert.equal(canUncomplete(cur, back, 'fa-d01'), true);
  assert.equal(dayState(cur, back, 'fa-d02'), 'next');
  assert.equal(projectState(cur, back, 'fb'), 'locked', '되돌리면 다음 프로젝트가 다시 잠긴다');
});

test('uncomplete blocked when dependent project has progress', () => {
  const cur = makeCur();
  const withFb = completed(cur, 'fa-d01', 'fa-d02', 'fb-d01');
  assert.equal(canUncomplete(cur, withFb, 'fa-d02'), false, 'fb 에 완료한 Day 가 있다');
  assert.throws(() => uncompleteDay(cur, withFb, 'fa-d02'), { message: 'cannot-uncomplete' });

  const noFb = uncompleteDay(cur, withFb, 'fb-d01');
  assert.equal(canUncomplete(cur, noFb, 'fa-d02'), true, 'fb 진도가 없어지면 되돌릴 수 있다');
});

test('toggleCheck toggles an index on and off, sorted, without touching the input', () => {
  const p0 = deepFreeze(emptyProgress());
  const p1 = toggleCheck(p0, 'fa-d01', 2);
  assert.deepEqual(p1.checks, { 'fa-d01': [2] });
  const p2 = toggleCheck(p1, 'fa-d01', 0);
  assert.deepEqual(p2.checks['fa-d01'], [0, 2]);
  const p3 = toggleCheck(toggleCheck(p2, 'fa-d01', 2), 'fa-d01', 0);
  assert.deepEqual(p3.checks, {}, '비면 키를 지운다');
  assert.deepEqual(p0, emptyProgress());
  // 이상한 index 는 무시 (새 객체로 돌려준다)
  for (const bad of [-1, 1.5, NaN, '1', null, undefined]) {
    const same = toggleCheck(p1, 'fa-d01', bad);
    assert.deepEqual(same, p1);
    assert.notEqual(same, p1);
  }
});

test('continueTarget moves to fb after fa', () => {
  const cur = makeCur();
  assert.equal(continueTarget(cur, emptyProgress()), 'fa-d01');
  assert.equal(continueTarget(cur, completed(cur, 'fa-d01')), 'fa-d02');
  assert.equal(continueTarget(cur, completed(cur, 'fa-d01', 'fa-d02')), 'fb-d01');
  assert.equal(continueTarget(cur, completed(cur, 'fa-d01', 'fa-d02', 'fb-d01')), null);
});

test('continueTarget prefers main track, then falls back to special', () => {
  const cur = makeCur({ withSpecial: true });
  // fa 를 끝내면 sp 도 열리지만 main(fb)이 먼저다
  assert.equal(continueTarget(cur, completed(cur, 'fa-d01', 'fa-d02')), 'fb-d01');
  assert.equal(continueTarget(cur, completed(cur, 'fa-d01', 'fa-d02', 'fb-d01')), 'sp-d01');
  const midSp = completeDay(cur, completed(cur, 'fa-d01', 'fa-d02', 'fb-d01'), 'sp-d01', T3);
  assert.equal(continueTarget(cur, midSp), 'sp-d02');
  const all = completeDay(cur, midSp, 'sp-d02', T3);
  assert.equal(continueTarget(cur, all), null);
});

test('continueTarget walks main projects by order, not by array position', () => {
  const base = makeCur();
  const shuffled = deepFreeze({ ...base, projects: [base.projects[1], base.projects[0]] });
  assert.equal(continueTarget(shuffled, emptyProgress()), 'fa-d01');
});

test('percent floors', () => {
  const cur = makeCur({ withSpecial: true });
  assert.equal(percent(cur, emptyProgress(), 'main'), 0);
  assert.equal(percent(cur, completed(cur, 'fa-d01'), 'main'), 33, '1/3 → 33');
  assert.equal(percent(cur, completed(cur, 'fa-d01', 'fa-d02'), 'main'), 66, '2/3 → 66');
  assert.equal(percent(cur, completed(cur, 'fa-d01', 'fa-d02', 'fb-d01'), 'main'), 100);
  assert.equal(percent(cur, completed(cur, 'fa-d01', 'fa-d02'), 'special'), 0);
  const noSpecial = makeCur();
  assert.equal(percent(noSpecial, completed(noSpecial, 'fa-d01'), 'special'), 0, 'Day 가 없는 트랙은 0');
  assert.equal(percent(noSpecial, completed(noSpecial, 'fa-d01'), 'nope'), 0);
});

test('normalize drops unknown days and bad checks', () => {
  const cur = makeCur();
  const raw = deepFreeze({
    version: 1,
    completed: {
      'fa-d01': T1,
      'zz-d99': T2, // 모르는 Day
      'fa-d02': 12345, // 시각이 문자열이 아님
      'fb-d01': 'not a date', // 시각으로 읽을 수 없음
    },
    checks: {
      'fa-d01': [2, 0, 2, 3, -1, 1.5, '1', null, 99], // checkCount 3 → 0..2 만
      'fa-d02': [7, 8], // 전부 범위 밖 → 키째 버린다
      'zz-d99': [0], // 모르는 Day
      'fb-d01': 'oops', // 배열 아님
    },
    lastDay: 'zz-d99',
    theme: 'neon',
  });
  const out = normalizeProgress(raw, cur);
  assert.deepEqual(out, {
    version: 1,
    completed: { 'fa-d01': T1 },
    checks: { 'fa-d01': [0, 2] },
    lastDay: null,
    theme: 'system',
  });
  assert.notEqual(out.completed, raw.completed, '입력을 그대로 돌려주지 않는다');
});

test('normalize keeps valid values', () => {
  const cur = makeCur();
  const raw = { version: 1, completed: { 'fa-d01': T1 }, checks: { 'fa-d02': [1] }, lastDay: 'fa-d02', theme: 'dark' };
  assert.deepEqual(normalizeProgress(raw, cur), raw);
});

test('normalize returns empty progress for garbage input', () => {
  const cur = makeCur();
  for (const raw of [null, undefined, 'x', 5, true, [], [1, 2], { completed: [] }, { completed: 'x', checks: 3 }]) {
    assert.deepEqual(normalizeProgress(raw, cur), emptyProgress(), JSON.stringify(raw));
  }
  // cur 가 깨져 있어도 던지지 않고 빈 진도
  assert.deepEqual(normalizeProgress({ completed: { 'fa-d01': T1 } }, null), emptyProgress());
  assert.deepEqual(normalizeProgress({ completed: { 'fa-d01': T1 } }, { projects: 'x' }), emptyProgress());
});

test('normalize ignores __proto__ style keys', () => {
  const cur = makeCur();
  const raw = JSON.parse(`{"completed":{"__proto__":"${T1}","fa-d01":"${T1}"},"checks":{"__proto__":[0]}}`);
  const out = normalizeProgress(raw, cur);
  assert.deepEqual(out.completed, { 'fa-d01': T1 });
  assert.deepEqual(out.checks, {});
  assert.equal(Object.getPrototypeOf(out.completed), Object.prototype);
});

test('importBackup rejects garbage', () => {
  const cur = makeCur();
  const cases = [
    ['not json', /JSON/],
    ['', /JSON/],
    ['[1,2]', /백업/],
    ['null', /백업/],
    ['{"app":"other"}', /교재/],
    ['{"app":"web-zero-to-hundred","schema":2,"progress":{}}', /지원하지 않/],
    ['{"app":"web-zero-to-hundred","progress":{}}', /지원하지 않/],
    ['{"app":"web-zero-to-hundred","schema":1}', /진도/],
    ['{"app":"web-zero-to-hundred","schema":1,"progress":"x"}', /진도/],
    ['{"app":"web-zero-to-hundred","schema":1,"progress":[]}', /진도/],
  ];
  for (const [text, pattern] of cases) {
    const res = importBackup(text, cur);
    assert.equal(res.ok, false, text);
    assert.match(res.error, pattern, text);
    assert.match(res.error, /[가-힣]/, '오류 메시지는 한국어');
  }
  assert.equal(importBackup(undefined, cur).ok, false);
  assert.equal(importBackup({ app: 'web-zero-to-hundred' }, cur).ok, false);
});

test('importBackup drops unknown days', () => {
  const cur = makeCur();
  const text = JSON.stringify({
    app: 'web-zero-to-hundred',
    schema: 1,
    exportedAt: T3,
    progress: {
      version: 1,
      completed: { 'fa-d01': T1, 'old-d07': T2 },
      checks: { 'fa-d01': [0], 'old-d07': [1] }, // 같은 모르는 Day 는 한 번만 센다
      lastDay: 'fa-d01',
      theme: 'light',
    },
  });
  const res = importBackup(text, cur);
  assert.equal(res.ok, true);
  assert.equal(res.dropped, 1);
  assert.deepEqual(res.progress, {
    version: 1,
    completed: { 'fa-d01': T1 },
    checks: { 'fa-d01': [0] },
    lastDay: 'fa-d01',
    theme: 'light',
  });
});

test('importBackup accepts a UTF-8 BOM and reports zero dropped for a clean file', () => {
  const cur = makeCur();
  const text = '﻿' + exportBackup(completed(cur, 'fa-d01'), T3);
  const res = importBackup(text, cur);
  assert.equal(res.ok, true);
  assert.equal(res.dropped, 0);
  assert.deepEqual(Object.keys(res.progress.completed), ['fa-d01']);
});

test('export→import roundtrip', () => {
  const cur = makeCur();
  let prog = completed(cur, 'fa-d01', 'fa-d02');
  prog = toggleCheck(toggleCheck(prog, 'fb-d01', 1), 'fa-d01', 2);
  prog = { ...prog, theme: 'dark' };
  deepFreeze(prog);

  const text = exportBackup(prog, T3);
  assert.equal(typeof text, 'string');
  const parsed = JSON.parse(text);
  assert.equal(parsed.app, 'web-zero-to-hundred');
  assert.equal(parsed.schema, 1);
  assert.equal(parsed.exportedAt, T3);
  assert.deepEqual(parsed.progress, prog);

  const res = importBackup(text, cur);
  assert.equal(res.ok, true);
  assert.equal(res.dropped, 0);
  assert.deepEqual(res.progress, prog);
});
