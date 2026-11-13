// 검색 Modal(Ctrl+K·검색 버튼): <dialog> showModal 안의 WAI-ARIA combobox + listbox. DESIGN.md Navigation "검색 Modal".
// 포커스는 늘 입력칸에 두고, 고른 행은 aria-activedescendant 로 알린다. 행 모양은 검색 페이지와 같다(views/results.js).
import { h } from './common.js';
import { closeDialog, comboKey, openDialog, setupDialog } from './overlay.js';
import { createResultsView, resultParts } from './results.js';

/** 결과 행 하나: li[role=option]. 포커스는 받지 않는다(입력칸이 가진다) */
const optionRow = (model, terms, i) =>
  h(
    'li',
    {
      class: 'result',
      role: 'option',
      id: `search-opt-${i}`,
      'aria-selected': 'false',
      'data-testid': 'search-option',
      'data-id': model.id,
      'data-locked': String(model.locked),
    },
    resultParts(model, terms),
  );

/**
 * @returns {{ open(opener?: Element): void, close(opts?: { restoreFocus?: boolean, immediate?: boolean }): void, isOpen(): boolean, focusInput(): void }}
 */
export function createSearchModal(ctx, dlg) {
  const input = dlg.querySelector('[data-testid="search-modal-input"]');
  const list = dlg.querySelector('#search-results');
  const view = createResultsView(ctx, {
    list,
    hint: dlg.querySelector('#search-hint'),
    empty: dlg.querySelector('.search-empty'),
    row: optionRow,
  });
  let active = -1;
  const options = () => [...list.querySelectorAll('[role="option"]')];

  /** index 번 행을 고른 행으로 둔다 (행이 없으면 -1: 접힌 combobox) */
  function select(index) {
    const all = options();
    active = all.length === 0 ? -1 : index;
    all.forEach((el, i) => el.setAttribute('aria-selected', String(i === active)));
    input.setAttribute('aria-expanded', String(all.length > 0));
    if (active < 0) {
      input.removeAttribute('aria-activedescendant');
      return;
    }
    input.setAttribute('aria-activedescendant', all[active].id);
    all[active].scrollIntoView({ block: 'nearest' });
  }
  // 목록을 새로 그리면(결과·바로 가기·Skeleton) 고른 행은 처음으로 돌아간다
  new MutationObserver(() => select(0)).observe(list, { childList: true });

  function close(opts) {
    closeDialog(dlg, opts);
  }

  /** 고른 결과로 간다. 지금 화면이어도 다시 그리고 본문으로 포커스를 옮긴다(ctx.go) */
  function choose(index) {
    const model = view.models()[index];
    if (!model) return;
    close({ restoreFocus: false, immediate: true });
    ctx.go(model.href);
    ctx.announce(`‘${model.title}’ 화면을 열었어요.`);
  }

  setupDialog(dlg);
  dlg.addEventListener('close', () => view.cancel());
  dlg.querySelector('#search-close').addEventListener('click', () => close());
  input.addEventListener('input', () => view.update(input.value));
  input.addEventListener('keydown', (event) => {
    const action = comboKey(event.key, { index: active, count: options().length, composing: event.isComposing || event.keyCode === 229 });
    if (!action) return;
    event.preventDefault(); // ↑↓는 글자 커서를, Esc 는 검색칸 지우기·대화상자 기본 닫기를 막는다
    if (action.type === 'move') select(action.index);
    else if (action.type === 'choose') choose(active);
    else close();
  });
  list.addEventListener('click', (event) => {
    const option = event.target.closest('[role="option"]');
    if (option) choose(options().indexOf(option));
  });
  // 행을 눌러도 포커스가 입력칸을 떠나지 않게 한다
  list.addEventListener('mousedown', (event) => event.preventDefault());

  return {
    open(opener) {
      if (dlg.open) {
        input.focus();
        return;
      }
      input.value = '';
      view.update('');
      openDialog(dlg, opener);
      input.focus();
    },
    close,
    isOpen: () => dlg.open,
    focusInput: () => input.focus(),
  };
}
