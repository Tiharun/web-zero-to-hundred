import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  EASE_OUT,
  magnetic,
  magneticOffset,
  motionEnv,
  onceInSession,
  reveal,
  shake,
  stagger,
  staggerDelays,
  tilt,
  tiltAngles,
} from '../../textbook/src/app/motion.js';

/** DOM 없는 Node 에서 쓰는 가짜 요소: animate·classList·style·리스너 기록 */
function fakeEl() {
  const el = {
    calls: [],
    added: [],
    removed: [],
    listeners: [],
    props: {},
    animate(kf, opt) {
      el.calls.push([kf, opt]);
      return { kf, opt, cancel() {} };
    },
    getAnimations: () => [],
    classList: {
      add: (c) => el.added.push(c),
      remove: (c) => el.removed.push(c),
      toggle() {},
    },
    style: { setProperty: (k, v) => { el.props[k] = v; }, transform: '' },
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 100, height: 48 }),
    addEventListener: (type, fn) => el.listeners.push([type, fn]),
    removeEventListener: (type, fn) => {
      el.listeners = el.listeners.filter(([t, f]) => t !== type || f !== fn);
    },
  };
  return el;
}

function fakeDoc() {
  const doc = {
    listeners: [],
    addEventListener: (type, fn) => doc.listeners.push([type, fn]),
    removeEventListener: (type, fn) => {
      doc.listeners = doc.listeners.filter(([t, f]) => t !== type || f !== fn);
    },
  };
  return doc;
}

test('motionEnv: matchMedia가 없으면 움직이지 않는다', () => {
  assert.deepEqual(motionEnv({}), { reduce: true, fine: false });
});

test('motionEnv reads reduce and fine pointer queries', () => {
  const win = { matchMedia: (q) => ({ matches: q.includes('reduce') ? false : true }) };
  assert.deepEqual(motionEnv(win), { reduce: false, fine: true });
});

test('staggerDelays caps at eight, 40ms apart', () => {
  assert.deepEqual(staggerDelays(3), [0, 40, 80]);
  assert.deepEqual(staggerDelays(20), [0, 40, 80, 120, 160, 200, 240, 280]);
  assert.deepEqual(staggerDelays(0), []);
});

test('magneticOffset pulls at most 6px inside the 32px reach', () => {
  const box = { width: 100, height: 48 };
  assert.deepEqual(magneticOffset({ dx: 0, dy: 0, ...box }), { x: 0, y: 0, inside: true });
  const edge = magneticOffset({ dx: 81.9, dy: 0, ...box }); // 50 + 32 바로 안
  assert.equal(edge.inside, true);
  assert.ok(edge.x > 5.9 && edge.x <= 6);
  assert.deepEqual(magneticOffset({ dx: 82, dy: 0, ...box }), { x: 0, y: 0, inside: false });
  assert.deepEqual(magneticOffset({ dx: 0, dy: 57, ...box }), { x: 0, y: 0, inside: false }); // 24 + 32 넘음
});

test('tiltAngles maps the pointer to ±maxDeg', () => {
  assert.deepEqual(tiltAngles({ px: 0.5, py: -0.5 }, 4), { rx: 4, ry: 4 });
  assert.deepEqual(tiltAngles({ px: 0, py: 0 }, 2), { rx: 0, ry: 0 });
});

test('onceInSession is true only the first time', () => {
  const store = new Map();
  const storage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
  assert.equal(onceInSession('home', storage), true);
  assert.equal(onceInSession('home', storage), false);
  assert.equal(store.has('wzh:v1:motion:home'), true);
});

test('onceInSession treats a throwing storage as first time', () => {
  const storage = {
    getItem() { throw new Error('denied'); },
    setItem() { throw new Error('denied'); },
  };
  assert.equal(onceInSession('home', storage), true);
  assert.equal(onceInSession('home', undefined), true);
});

test('stagger animates the first eight with the DESIGN.md values', () => {
  const els = Array.from({ length: 10 }, fakeEl);
  const runs = stagger(els, { reduce: false, fine: true });
  assert.equal(runs.length, 8);
  assert.deepEqual(els[2].calls[0][0], [
    { opacity: 0, transform: 'translateY(8px)' },
    { opacity: 1, transform: 'none' },
  ]);
  assert.deepEqual(els[2].calls[0][1], { duration: 280, delay: 80, easing: EASE_OUT, fill: 'backwards' });
  assert.equal(els[9].calls.length, 0);
});

test('reduced motion: stagger, shake, reveal, magnetic and tilt do nothing', () => {
  const env = { reduce: true, fine: true };
  const el = fakeEl();
  assert.deepEqual(stagger([el], env), []);
  assert.equal(shake(el, env), null);
  let observed = 0;
  const IO = class { observe() { observed++; } disconnect() {} };
  reveal([el], env, IO)();
  assert.equal(observed, 0);
  assert.equal(el.added.length, 0, 'Reveal 전 클래스를 붙이지 않는다');
  const doc = fakeDoc();
  magnetic(el, env, doc)();
  tilt(el, 4, env)();
  assert.equal(doc.listeners.length, 0);
  assert.equal(el.listeners.length, 0);
  assert.equal(el.calls.length, 0);
});

test('shake: 300ms, 4px left and right four times', () => {
  const el = fakeEl();
  shake(el, { reduce: false, fine: false });
  const [kf, opt] = el.calls[0];
  assert.deepEqual(kf.map((k) => k.transform), [
    'none', 'translateX(-4px)', 'translateX(4px)', 'translateX(-4px)', 'translateX(4px)', 'none',
  ]);
  assert.equal(opt.duration, 300);
});

test('reveal without IntersectionObserver leaves content visible', () => {
  const el = fakeEl();
  reveal([el], { reduce: false, fine: true }, undefined)();
  assert.equal(el.added.length, 0);
});

test('reveal marks pending and dispose disconnects', () => {
  const el = fakeEl();
  let disconnected = false;
  const IO = class {
    constructor(cb) { this.cb = cb; }
    observe() {}
    unobserve() {}
    disconnect() { disconnected = true; }
  };
  const dispose = reveal([el], { reduce: false, fine: true }, IO);
  assert.deepEqual(el.added, ['reveal-pending']);
  dispose();
  assert.equal(disconnected, true);
});

test('magnetic needs a fine pointer', () => {
  const doc = fakeDoc();
  magnetic(fakeEl(), { reduce: false, fine: false }, doc);
  assert.equal(doc.listeners.length, 0);
});

test('magnetic dispose removes the listener it added', () => {
  const doc = fakeDoc();
  const dispose = magnetic(fakeEl(), { reduce: false, fine: true }, doc);
  assert.equal(doc.listeners.length, 1);
  dispose();
  assert.equal(doc.listeners.length, 0);
});
