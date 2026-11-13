// 토스트: 화면 아래 가운데에 잠깐 뜨는 알림(개편 설계서 5장). 영역은 <body> 바로 아래 하나라 화면을 옮겨도 남는다.
// 모양은 DESIGN.md Day 부품 "토스트"를 따른다(components.css .toast).
import { motionEnv } from '../motion.js';
import { px } from './icons.js';

export const TOAST_MS = 4000;
export const TOAST_MAX = 3;
export const TOAST_EXIT_MS = 180; // --dur-exit
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)'; // --ease-in

const live = new Map(); // 항목 → { remaining, startedAt, timer }
let paused = false;

function region(doc) {
  let el = doc.querySelector('[data-testid="toast-region"]');
  if (el) return el;
  el = doc.createElement('div');
  el.className = 'toast-region';
  el.dataset.testid = 'toast-region';
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  // 마우스를 올리거나 포커스가 안에 있으면 모든 토스트의 시간을 멈춘다
  const pause = () => {
    if (paused) return;
    paused = true;
    for (const state of live.values()) {
      clearTimeout(state.timer);
      state.remaining -= Date.now() - state.startedAt;
    }
  };
  const resume = () => {
    if (!paused) return;
    paused = false;
    for (const [item, state] of live) schedule(item, state);
  };
  el.addEventListener('pointerenter', pause);
  el.addEventListener('pointerleave', resume);
  el.addEventListener('focusin', pause);
  el.addEventListener('focusout', (event) => {
    if (!el.contains(event.relatedTarget)) resume();
  });
  doc.body.append(el);
  return el;
}

function schedule(item, state) {
  state.startedAt = Date.now();
  state.timer = setTimeout(() => dismiss(item), Math.max(state.remaining, 0));
}

function remove(item) {
  clearTimeout(live.get(item)?.timer);
  live.delete(item);
  item.remove();
}

function dismiss(item) {
  live.delete(item);
  if (motionEnv().reduce || typeof item.animate !== 'function') {
    item.remove();
    return;
  }
  item
    .animate([{ opacity: 1 }, { opacity: 0 }], { duration: TOAST_EXIT_MS, easing: EASE_IN, fill: 'forwards' })
    .finished.then(() => item.remove(), () => item.remove());
}

/**
 * 토스트 하나를 띄우고 그 항목을 돌려준다. 같은 문장이 떠 있으면 그것을 지우고 새로 띄운다(다시 읽히고 시간이 처음부터).
 * 항목이 TOAST_MAX 를 넘으면 가장 오래된 것부터 지운다. icon: 왼쪽에 둘 도트 아이콘 이름(없으면 글자만).
 */
export function showToast(text, { duration = TOAST_MS, doc = document, icon = null } = {}) {
  const area = region(doc);
  for (const old of [...area.children]) if (old.textContent === text) remove(old);
  const item = doc.createElement('p');
  item.className = 'toast';
  item.dataset.testid = 'toast';
  if (icon) {
    const span = doc.createElement('span');
    span.textContent = text;
    item.classList.add('has-icon');
    item.append(px(icon), span);
  } else {
    item.textContent = text;
  }
  area.append(item);
  while (area.children.length > TOAST_MAX) remove(area.firstElementChild);
  const state = { remaining: duration, startedAt: Date.now(), timer: 0 };
  live.set(item, state);
  if (!paused) schedule(item, state);
  return item;
}
