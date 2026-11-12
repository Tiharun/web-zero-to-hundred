// 겹쳐 뜨는 것들의 공용 동작: <dialog>(서랍·Modal)와 메뉴 버튼(Dropdown).
// DESIGN.md Navigation, 개편 설계서 5.1~5.3. 모양은 CSS(.drawer, .menu)가 맡고 여기는 동작만 둔다.
// 이 파일은 맨 위에서 document·HTMLDialogElement 를 읽지 않는다 (node 단위 테스트가 import 한다).
import { motionEnv } from '../motion.js';

/** 닫힘 애니메이션이 끝났다는 신호가 오지 않을 때 기다리는 시간 (DESIGN.md Motion "검색": setTimeout(done, 260)) */
export const DIALOG_CLOSE_FALLBACK_MS = 260;

/** 점 (x, y)가 사각형 바깥인가. 경계 위는 안쪽이다 */
export function isOutside(rect, x, y) {
  return x < rect.left || x > rect.right || y < rect.top || y > rect.bottom;
}

/** 메뉴 키 → 다음에 포커스할 항목 번호. 화살표는 끝에서 처음으로 돈다. 해당 없는 키나 항목이 없으면 null */
export function menuIndex(key, index, count) {
  if (count <= 0) return null;
  if (key === 'ArrowDown') return (index + 1 + count) % count;
  if (key === 'ArrowUp') return index <= 0 ? count - 1 : index - 1;
  if (key === 'Home') return 0;
  if (key === 'End') return count - 1;
  return null;
}

// ───────── <dialog> ─────────

const returnTo = new WeakMap(); // dialog → 닫힌 뒤 포커스를 돌려줄 요소

/**
 * ESC·바깥 클릭·닫힘 뒤 포커스 복귀를 붙인다. 바깥 클릭은 closedby 를 아는 브라우저면 속성으로,
 * 모르는 브라우저(Safari 등)면 백드롭 클릭 좌표로 감지한다.
 */
export function setupDialog(dlg, { proto = globalThis.HTMLDialogElement?.prototype } = {}) {
  if (proto && 'closedBy' in proto) {
    dlg.setAttribute('closedby', 'any');
  } else {
    dlg.addEventListener('click', (event) => {
      if (event.target !== dlg) return; // 안쪽 내용을 누른 것
      if (isOutside(dlg.getBoundingClientRect(), event.clientX, event.clientY)) closeDialog(dlg);
    });
  }
  // ESC: 기본 동작(바로 닫힘) 대신 애니메이션을 거쳐 닫는다
  dlg.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeDialog(dlg);
  });
  dlg.addEventListener('close', () => {
    dlg.classList.remove('is-closing');
    const back = returnTo.get(dlg);
    returnTo.delete(dlg);
    if (back?.isConnected) back.focus({ preventScroll: true });
  });
}

/** showModal 로 연다. 닫히면 opener(없으면 지금 포커스)로 돌아간다 */
export function openDialog(dlg, opener) {
  if (dlg.open) return;
  returnTo.set(dlg, opener ?? dlg.ownerDocument.activeElement);
  dlg.showModal();
}

/**
 * 닫는다. restoreFocus: 거짓이면 포커스를 돌려주지 않는다(화면을 옮길 때).
 * immediate 이거나 동작 줄이기면 바로 닫고, 아니면 is-closing 애니메이션이 끝난 뒤 닫는다.
 */
export function closeDialog(dlg, { restoreFocus = true, immediate = false, env = motionEnv() } = {}) {
  if (!dlg.open) return;
  if (!restoreFocus) returnTo.delete(dlg);
  if (immediate || env.reduce) {
    dlg.close();
    return;
  }
  if (dlg.classList.contains('is-closing')) return;
  dlg.classList.add('is-closing');
  // 애니메이션 끝과 대체 타이머 중 먼저 온 쪽이 닫고 다른 쪽을 지운다.
  // 남은 타이머가 그사이 다시 연 대화상자를 닫으면 안 된다
  let timer = 0;
  const onEnd = (event) => {
    if (event.target === dlg) done();
  };
  function done() {
    clearTimeout(timer);
    dlg.removeEventListener('animationend', onEnd);
    if (dlg.open) dlg.close();
  }
  dlg.addEventListener('animationend', onEnd);
  timer = setTimeout(done, DIALOG_CLOSE_FALLBACK_MS);
}

// ───────── 메뉴 버튼 (WAI-ARIA menu button) ─────────

/**
 * 버튼과 메뉴를 잇는다. ↓·↑로 열기, 화살표 순환·Home·End, Esc 는 버튼으로 복귀, Tab·바깥 누름은 그냥 닫기.
 * 항목을 고르는 일은 부르는 쪽이 menu 의 click 으로 처리한다.
 * @param {{ items: () => HTMLElement[], initialIndex?: () => number }} opts
 */
export function menuButton(button, menu, { items, initialIndex = () => 0 }) {
  const doc = button.ownerDocument;
  const isOpen = () => !menu.hidden;

  function open(index) {
    menu.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    const list = items();
    list[Math.min(Math.max(index ?? initialIndex(), 0), list.length - 1)]?.focus();
  }

  function close(returnFocus = true) {
    if (!isOpen()) return;
    menu.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    if (returnFocus) button.focus();
  }

  button.addEventListener('click', () => (isOpen() ? close() : open()));
  button.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      open(event.key === 'ArrowDown' ? 0 : items().length - 1);
    }
  });
  menu.addEventListener('keydown', (event) => {
    const list = items();
    const next = menuIndex(event.key, list.indexOf(doc.activeElement), list.length);
    if (next !== null) {
      event.preventDefault();
      list[next].focus();
    } else if (event.key === 'Escape') {
      event.preventDefault(); // 서랍 안이면 서랍까지 닫지 않는다
      event.stopPropagation();
      close();
    } else if (event.key === 'Tab') {
      close(false);
    }
  });
  doc.addEventListener('pointerdown', (event) => {
    if (isOpen() && !menu.contains(event.target) && !button.contains(event.target)) close(false);
  });

  return { open, close, isOpen };
}
