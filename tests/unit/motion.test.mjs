import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ACCORDION_CLEAR_MS,
  EASE_OUT,
  accordionOpened,
  confettiPlan,
  drawPath,
  linkHover,
  magnetic,
  magneticIn,
  magneticOffset,
  motionEnv,
  onceInSession,
  pawnHop,
  seenInSession,
  reveal,
  shake,
  stagger,
  staggerDelays,
  tilt,
  tiltAngles,
  xpFill,
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
  assert.equal(onceInSession('blocked-a', storage), true);
  assert.equal(onceInSession('blocked-a', storage), false, '저장소가 막히면 이 페이지 메모리로 센다');
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

const frame = () => new Promise((r) => setTimeout(r, 40)); // Node 에는 requestAnimationFrame 이 없어 setTimeout 으로 돈다

test('magneticIn pulls whichever primary button is current and skips a disabled one', async () => {
  const doc = fakeDoc();
  let current = fakeEl();
  const root = { ownerDocument: doc, querySelector: () => current };
  const dispose = magneticIn(root, { reduce: false, fine: true }, doc);
  const move = () => doc.listeners[0][1]({ pointerType: 'mouse', clientX: 110, clientY: 24 });
  move();
  await frame();
  assert.ok(parseFloat(current.props['--mx']) > 0, '지금 버튼이 끌린다');
  const old = current;
  current = fakeEl(); // 화면이 버튼을 새로 만들었다
  move();
  await frame();
  assert.ok(parseFloat(current.props['--mx']) > 0, '새 버튼이 끌린다');
  assert.equal(old.props['--mx'], '0px', '옛 버튼은 제자리로');
  current.disabled = true;
  move();
  await frame();
  assert.equal(current.props['--mx'], '0px', '비활성 버튼은 끌리지 않는다');
  dispose();
  assert.equal(doc.listeners.length, 0);
});

test('xpFill: 600ms after 240ms from the left edge, skipped when reduced', () => {
  const el = fakeEl();
  el.ownerDocument = { defaultView: { getComputedStyle: () => ({ clipPath: 'inset(0px 80% 0px 0px)' }) } };
  const anim = xpFill(el, { reduce: false, fine: true });
  assert.ok(anim);
  const [kf, opt] = el.calls.at(-1);
  assert.deepEqual(kf, [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0px 80% 0px 0px)' }]);
  assert.deepEqual([opt.duration, opt.delay, opt.fill], [600, 240, 'backwards']);
  assert.equal(xpFill(fakeEl(), { reduce: true, fine: true }), null);
});

// ───────── 홈 모션 (M4) ─────────

test('drawPath: 900ms after 200ms once 40% is visible, skipped when reduced', () => {
  const paths = [fakeEl(), fakeEl()];
  const watch = fakeEl();
  let made = null;
  const IO = class {
    constructor(cb, opt) {
      made = { cb, opt, observed: [], disconnected: false };
      this.observe = (el) => made.observed.push(el);
      this.disconnect = () => { made.disconnected = true; };
    }
  };
  drawPath(paths, watch, { reduce: false, fine: true }, IO);
  assert.deepEqual(made.opt, { threshold: 0.4 });
  assert.deepEqual(made.observed, [watch]);
  assert.equal(paths[0].calls.length, 0, '보이기 전에는 그리지 않는다');
  made.cb([{ isIntersecting: true, target: watch }]);
  for (const path of paths) {
    const [kf, opt] = path.calls[0];
    assert.deepEqual(kf, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }]);
    assert.deepEqual(opt, { duration: 900, delay: 200, easing: EASE_OUT, fill: 'backwards' });
    assert.equal(path.style.strokeDasharray, '1 1');
  }
  assert.equal(made.disconnected, true, '한 번만');

  made = null;
  const still = fakeEl();
  drawPath([still], watch, { reduce: true, fine: true }, IO)();
  assert.equal(made, null);
  assert.equal(still.calls.length, 0);
});

test('pawnHop: three 8px hops after 700ms, none when reduced', () => {
  const el = fakeEl();
  pawnHop(el, { reduce: false, fine: false });
  const [kf, opt] = el.calls[0];
  assert.deepEqual(kf, [{ transform: 'translateX(-50%)' }, { transform: 'translate(-50%, -8px)', offset: 0.45 }, { transform: 'translateX(-50%)' }]);
  assert.deepEqual(opt, { duration: 480, delay: 700, iterations: 3, easing: EASE_OUT });
  const still = fakeEl();
  assert.equal(pawnHop(still, { reduce: true, fine: false }), null);
  assert.equal(still.calls.length, 0);
});

test('confettiPlan: 18 bits, four colors in turn, all thrown upward, delays 500 + 30 steps', () => {
  const bits = confettiPlan();
  assert.equal(bits.length, 18);
  assert.deepEqual(bits.slice(0, 4).map((b) => b.color), ['var(--color-accent)', 'var(--color-progress)', 'var(--color-coin)', 'var(--color-edge)']);
  assert.ok(bits.every((b) => b.y < 0));
  assert.deepEqual(bits.slice(0, 7).map((b) => b.delay), [500, 530, 560, 590, 620, 650, 500]);
  assert.deepEqual(bits.slice(0, 2).map((b) => b.spin), [-1, 1]);
});

test('linkHover: pointer and focus add the class, leaving removes it, dispose unhooks', () => {
  const source = fakeEl();
  const target = fakeEl();
  const dispose = linkHover(source, target);
  const fire = (type) => source.listeners.filter(([t]) => t === type).forEach(([, fn]) => fn());
  fire('pointerenter');
  fire('focusin');
  assert.deepEqual(target.added, ['is-linked', 'is-linked']);
  fire('pointerleave');
  fire('focusout');
  assert.deepEqual(target.removed, ['is-linked', 'is-linked']);
  dispose();
  assert.equal(source.listeners.length, 0);
});

test('onceInSession: a storage getter that throws counts as first time', () => {
  const desc = Object.getOwnPropertyDescriptor(globalThis, 'sessionStorage');
  Object.defineProperty(globalThis, 'sessionStorage', {
    configurable: true,
    get() {
      throw new Error('blocked');
    },
  });
  try {
    assert.equal(onceInSession('x'), true);
  } finally {
    if (desc) Object.defineProperty(globalThis, 'sessionStorage', desc);
    else delete globalThis.sessionStorage;
  }
});

test('drawPath hides the paths until they draw, records the draw, and clears on dispose', () => {
  const paths = [fakeEl()];
  const watch = fakeEl();
  let cb = null;
  const IO = class {
    constructor(fn) {
      cb = fn;
      this.observe = () => {};
      this.disconnect = () => {};
    }
  };
  let drawn = 0;
  drawPath(paths, watch, { reduce: false, fine: true }, IO, () => drawn++);
  assert.equal(paths[0].style.strokeDasharray, '1 1', '보이기 전에도 숨겨 둔다(번쩍임 방지)');
  assert.equal(paths[0].style.strokeDashoffset, '1');
  assert.equal(drawn, 0, '보이기 전에는 기록하지 않는다');
  cb([{ isIntersecting: true, target: watch }]);
  assert.equal(drawn, 1);
  assert.equal(paths[0].style.strokeDashoffset, '', '애니메이션이 맡는다');

  const left = [fakeEl()];
  drawPath(left, watch, { reduce: false, fine: true }, IO, () => drawn++)();
  assert.equal(left[0].style.strokeDasharray, '', '그리기 전에 떠나면 원래대로');
  assert.equal(left[0].style.strokeDashoffset, '');
  assert.equal(drawn, 1);
});

test('seenInSession reads without recording, also from page memory', () => {
  const store = new Map();
  const storage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
  assert.equal(seenInSession('seen-a', storage), false);
  assert.equal(seenInSession('seen-a', storage), false);
  onceInSession('seen-a', storage);
  assert.equal(seenInSession('seen-a', storage), true);
  const blocked = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); } };
  assert.equal(seenInSession('seen-b', blocked), false);
  onceInSession('seen-b', blocked);
  assert.equal(seenInSession('seen-b', blocked), true);
});

test('accordionOpened adds is-animating and clears it after ACCORDION_CLEAR_MS', () => {
  mock.timers.enable({ apis: ['setTimeout'] });
  try {
    assert.equal(ACCORDION_CLEAR_MS, 400);
    const el = fakeEl();
    accordionOpened(el, { reduce: false, fine: true });
    assert.deepEqual(el.added, ['is-animating']);
    mock.timers.tick(ACCORDION_CLEAR_MS - 1);
    assert.deepEqual(el.removed, []);
    mock.timers.tick(1);
    assert.deepEqual(el.removed, ['is-animating']);
    // 움직임 줄이기: 표시 클래스를 붙이지 않아 내용이 바로 보인다
    const still = fakeEl();
    accordionOpened(still, { reduce: true, fine: false });
    assert.deepEqual(still.added, []);
  } finally {
    mock.timers.reset();
  }
});
