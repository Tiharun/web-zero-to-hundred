import { test } from 'node:test';
import assert from 'node:assert/strict';
import { closeDialog, DIALOG_CLOSE_FALLBACK_MS, isOutside, menuIndex } from '../../textbook/src/app/views/overlay.js';

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

/** closeDialog 가 쓰는 만큼만 흉내 낸 <dialog>. close 이벤트가 오면 is-closing 을 떼는 것은 setupDialog 와 같다 */
function fakeDialog() {
  const listeners = new Map();
  const classes = new Set();
  const dlg = {
    open: true,
    classList: { add: (c) => classes.add(c), remove: (c) => classes.delete(c), contains: (c) => classes.has(c) },
    addEventListener: (type, fn) => listeners.set(type, [...(listeners.get(type) ?? []), fn]),
    removeEventListener: (type, fn) => listeners.set(type, (listeners.get(type) ?? []).filter((f) => f !== fn)),
    dispatch: (type, event = {}) => (listeners.get(type) ?? []).forEach((fn) => fn({ target: dlg, ...event })),
    close() {
      dlg.open = false;
      classes.delete('is-closing');
    },
  };
  return dlg;
}

test('a stale close fallback does not close a dialog that was opened again', async () => {
  const dlg = fakeDialog();
  closeDialog(dlg, { env: { reduce: false } });
  assert.equal(dlg.classList.contains('is-closing'), true);
  dlg.dispatch('animationend'); // 애니메이션이 끝나 먼저 닫힌다
  assert.equal(dlg.open, false);
  dlg.open = true; // 곧바로 다시 연다
  await new Promise((resolve) => setTimeout(resolve, DIALOG_CLOSE_FALLBACK_MS + 40));
  assert.equal(dlg.open, true, '앞선 닫기의 대체 타이머가 새로 연 대화상자를 닫으면 안 된다');
});

test('close fallback still closes when animationend never comes', async () => {
  const dlg = fakeDialog();
  closeDialog(dlg, { env: { reduce: false } });
  await new Promise((resolve) => setTimeout(resolve, DIALOG_CLOSE_FALLBACK_MS + 40));
  assert.equal(dlg.open, false);
});
