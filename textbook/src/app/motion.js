// 공용 모션 도우미. 값은 DESIGN.md Components > Motion·Buttons 를 따른다.
// 숫자 계산(순수 함수)과 DOM 적용 함수로 나눈다. DOM 함수는 env = { reduce, fine } 을 받고,
// 붙인 것을 떼는 함수를 돌려준다. 가져올 때 window·document 를 건드리지 않는다(Node 단위 테스트).

export const STAGGER_STEP = 40;
export const STAGGER_MAX = 8;
export const ENTER_MS = 280; // --dur-enter
export const SHAKE_MS = 300;
export const PULL = 6;
export const REACH = 32;
export const EASE_OUT = 'cubic-bezier(0.2, 0.8, 0.2, 1)'; // --ease-out

const SESSION_PREFIX = 'wzh:v1:motion:';
const RISE = [
  { opacity: 0, transform: 'translateY(8px)' },
  { opacity: 1, transform: 'none' },
];
const noop = () => {};
const round2 = (n) => Math.round(n * 100) / 100 + 0; // + 0: -0 을 0 으로

/** 동작 줄이기와 정밀 포인터(마우스) 여부. matchMedia 가 없으면 움직이지 않는 쪽으로 본다 */
export function motionEnv(win = globalThis) {
  if (typeof win?.matchMedia !== 'function') return { reduce: true, fine: false };
  return {
    reduce: win.matchMedia('(prefers-reduced-motion: reduce)').matches,
    fine: win.matchMedia('(hover: hover) and (pointer: fine)').matches,
  };
}

/** Stagger 지연(ms): i * 40, 최대 8개 */
export function staggerDelays(count) {
  return Array.from({ length: Math.min(Math.max(count, 0), STAGGER_MAX) }, (_, i) => i * STAGGER_STEP);
}

/** 버튼 가운데에서 포인터까지 거리(dx, dy)로 끌림 크기를 구한다. 둘레 32px 밖이면 0 */
export function magneticOffset({ dx, dy, width, height }) {
  const rx = width / 2 + REACH;
  const ry = height / 2 + REACH;
  const inside = Math.abs(dx) < rx && Math.abs(dy) < ry;
  if (!inside) return { x: 0, y: 0, inside: false };
  return { x: round2((dx / rx) * PULL), y: round2((dy / ry) * PULL), inside: true };
}

/** 요소 가운데 기준 포인터 위치(px, py: -0.5~0.5)를 기울기 각도로 바꾼다 */
export function tiltAngles({ px, py }, maxDeg) {
  return { rx: round2(-py * 2 * maxDeg), ry: round2(px * 2 * maxDeg) };
}

/** 이 세션에서 처음이면 true 를 돌려주고 기록한다. 저장소를 쓸 수 없으면 늘 처음으로 본다 */
export function onceInSession(name, storage = globalThis.sessionStorage) {
  const key = SESSION_PREFIX + name;
  try {
    if (!storage) return true;
    if (storage.getItem(key) !== null) return false;
    storage.setItem(key, '1');
  } catch {
    // 사생활 보호 모드 등: 기록하지 못해도 동작은 같다
  }
  return true;
}

const canAnimate = (el) => typeof el?.animate === 'function';

/** 앞 8개를 아래 8px 에서 차례로 올린다 */
export function stagger(els, env = motionEnv()) {
  if (env.reduce) return [];
  const list = Array.from(els).slice(0, STAGGER_MAX);
  const delays = staggerDelays(list.length);
  return list
    .map((el, i) => (canAnimate(el) ? el.animate(RISE, { duration: ENTER_MS, delay: delays[i], easing: EASE_OUT, fill: 'backwards' }) : null))
    .filter(Boolean);
}

/** 좌우 4px 네 번 흔든다. 돌고 있으면 처음부터 다시 */
export function shake(el, env = motionEnv()) {
  if (env.reduce || !canAnimate(el)) return null;
  el.getAnimations?.().forEach((a) => {
    if (a.id === 'shake') a.cancel();
  });
  const x = (n) => ({ transform: `translateX(${n}px)` });
  return el.animate([{ transform: 'none' }, x(-4), x(4), x(-4), x(4), { transform: 'none' }], {
    duration: SHAKE_MS,
    easing: EASE_OUT,
    id: 'shake',
  });
}

/** 화면에 들어올 때 한 번 올라오게 한다. 숨김 클래스는 관찰할 수 있을 때만 붙인다 */
export function reveal(els, env = motionEnv(), IO = globalThis.IntersectionObserver) {
  if (env.reduce || typeof IO !== 'function') return noop;
  const observer = new IO(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target;
        el.classList.remove('reveal-pending');
        if (canAnimate(el)) el.animate(RISE, { duration: ENTER_MS, delay: 0, easing: EASE_OUT, fill: 'backwards' });
        observer.unobserve(el);
      }
    },
    { threshold: 0.1 },
  );
  for (const el of els) {
    el.classList.add('reveal-pending');
    observer.observe(el);
  }
  return () => observer.disconnect();
}

/** 마우스가 둘레 32px 안에 오면 최대 6px 끌린다. 주 버튼에만 쓴다 */
export function magnetic(el, env = motionEnv(), doc = el.ownerDocument) {
  if (env.reduce || !env.fine || !doc) return noop;
  const raf = globalThis.requestAnimationFrame ?? ((fn) => setTimeout(fn, 16));
  const caf = globalThis.cancelAnimationFrame ?? clearTimeout;
  let frame = 0;
  let last = null;
  const apply = () => {
    frame = 0;
    const r = el.getBoundingClientRect();
    const { x, y, inside } = magneticOffset({
      dx: last.clientX - (r.left + r.width / 2),
      dy: last.clientY - (r.top + r.height / 2),
      width: r.width,
      height: r.height,
    });
    el.style.setProperty('--mx', `${x}px`);
    el.style.setProperty('--my', `${y}px`);
    if (inside) el.classList.add('is-pulling');
    else el.classList.remove('is-pulling');
  };
  const onMove = (event) => {
    if (event.pointerType !== 'mouse') return;
    last = event;
    if (!frame) frame = raf(apply);
  };
  doc.addEventListener('pointermove', onMove, { passive: true });
  return () => {
    doc.removeEventListener('pointermove', onMove);
    if (frame) caf(frame);
    frame = 0;
    el.style.setProperty('--mx', '0px');
    el.style.setProperty('--my', '0px');
    el.classList.remove('is-pulling');
  };
}

/** 마우스 위치에 따라 최대 maxDeg 만큼 기울인다. 나가면 CSS 전환(--dur-short)으로 돌아온다 */
export function tilt(el, maxDeg, env = motionEnv()) {
  if (env.reduce || !env.fine) return noop;
  const onMove = (event) => {
    if (event.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    const { rx, ry } = tiltAngles(
      { px: (event.clientX - r.left) / r.width - 0.5, py: (event.clientY - r.top) / r.height - 0.5 },
      maxDeg,
    );
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  };
  const onLeave = () => {
    el.style.transform = '';
  };
  el.addEventListener('pointermove', onMove);
  el.addEventListener('pointerleave', onLeave);
  return () => {
    el.removeEventListener('pointermove', onMove);
    el.removeEventListener('pointerleave', onLeave);
    el.style.transform = '';
  };
}
