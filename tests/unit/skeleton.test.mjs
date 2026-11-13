// Skeleton 시간 규칙(DESIGN.md Skeleton, 개편 설계서 3.5): 200ms 안에 끝나면 안 보이고, 보이면 최소 300ms.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SKELETON_DELAY, SKELETON_MIN, skeletonGate } from '../../textbook/src/app/views/skeleton.js';

/** 손으로 돌리는 시계: advance(ms) 동안 때가 된 타이머를 시각 순서대로 부른다 */
function fakeClock() {
  let t = 0;
  let seq = 0;
  const timers = new Map();
  return {
    now: () => t,
    setTimeout(fn, ms) {
      const id = ++seq;
      timers.set(id, { at: t + ms, fn });
      return id;
    },
    clearTimeout(id) {
      timers.delete(id);
    },
    /** 그 자리에서 시간을 쓴다(느린 기기에서 DOM 을 그리는 시간). 타이머는 부르지 않는다 */
    spend(ms) {
      t += ms;
    },
    advance(ms) {
      const end = t + ms;
      for (;;) {
        const due = [...timers].filter(([, v]) => v.at <= end).sort((a, b) => a[1].at - b[1].at || a[0] - b[0])[0];
        if (!due) break;
        timers.delete(due[0]);
        t = due[1].at;
        due[1].fn();
      }
      t = end;
    },
  };
}

function setup() {
  const clock = fakeClock();
  const log = [];
  const gate = skeletonGate({ show: () => log.push(['show', clock.now()]), hide: () => log.push(['hide', clock.now()]) }, { clock });
  const apply = () => log.push(['apply', clock.now()]);
  return { clock, log, gate, apply };
}

test('DESIGN skeleton values', () => {
  assert.equal(SKELETON_DELAY, 200);
  assert.equal(SKELETON_MIN, 300);
});

test('skeletonGate: work done within 200ms never shows the skeleton', () => {
  const { clock, log, gate, apply } = setup();
  clock.advance(199);
  gate.finish(apply);
  clock.advance(1000);
  assert.deepEqual(log, [['apply', 199]]);
});

test('skeletonGate: slow work shows at 200ms and stays at least 300ms', () => {
  const { clock, log, gate, apply } = setup();
  clock.advance(250);
  gate.finish(apply);
  clock.advance(1000);
  assert.deepEqual(log, [['show', 200], ['hide', 500], ['apply', 500]]);
});

test('skeletonGate: finishing after the minimum applies at once', () => {
  const { clock, log, gate, apply } = setup();
  clock.advance(800);
  gate.finish(apply);
  assert.deepEqual(log, [['show', 200], ['hide', 800], ['apply', 800]]);
});

test('skeletonGate: cancel hides without applying, and later calls do nothing', () => {
  const { clock, log, gate, apply } = setup();
  clock.advance(250);
  gate.cancel();
  gate.finish(apply);
  gate.cancel();
  clock.advance(1000);
  assert.deepEqual(log, [['show', 200], ['hide', 250]]);
});

test('skeletonGate: the 300ms minimum counts from when the rows are on screen, even if drawing them was slow', () => {
  const clock = fakeClock();
  const log = [];
  const gate = skeletonGate(
    {
      show: () => {
        clock.spend(20); // 느린 기기: 자리표시 행을 붙이는 데 20ms
        log.push(['shown', clock.now()]);
      },
      hide: () => log.push(['hide', clock.now()]),
    },
    { clock },
  );
  clock.advance(250);
  gate.finish(() => log.push(['apply', clock.now()]));
  clock.advance(1000);
  assert.deepEqual(log, [['shown', 220], ['hide', 520], ['apply', 520]]);
});
