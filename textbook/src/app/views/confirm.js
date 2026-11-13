// 확인 Modal: 되돌릴 수 없는 일(진도 복원 덮어쓰기, 진도 초기화) 앞에서만 묻는다. DESIGN.md Navigation "확인 Modal".
// <dialog role="alertdialog"> 하나(template.html)를 채워 쓴다. 열고 닫기는 views/overlay.js 를 쓴다.
// 확인 버튼을 눌렀을 때만 true 이고, 취소·ESC·바깥 클릭·화면 이동은 모두 false 다(아무것도 바뀌지 않는다).
import { closeDialog, openDialog, setupDialog } from './overlay.js';

/**
 * @param {HTMLDialogElement} dlg #confirm-dialog
 * @returns {{ ask(opts: { title: string, body: string, ok: string, danger?: boolean }, opener?: Element): Promise<boolean>, dismiss(): void, isOpen(): boolean }}
 */
export function createConfirm(dlg) {
  const title = dlg.querySelector('#confirm-title');
  const body = dlg.querySelector('#confirm-body');
  const cancelButton = dlg.querySelector('[data-testid="confirm-cancel"]');
  const okButton = dlg.querySelector('[data-testid="confirm-ok"]');
  let settle = null; // 지금 기다리는 약속을 끝내는 함수
  let accepted = false;

  /** 기다리는 약속을 한 번만 끝낸다 */
  function finish(value) {
    const done = settle;
    settle = null;
    done?.(value);
  }

  setupDialog(dlg);
  // 결과는 닫힌 순간 한 번만 정한다: 확인 버튼을 거쳐 닫혔을 때만 true
  dlg.addEventListener('close', () => finish(accepted));
  cancelButton.addEventListener('click', () => closeDialog(dlg));
  okButton.addEventListener('click', () => {
    accepted = true;
    closeDialog(dlg);
  });

  return {
    ask({ title: heading, body: text, ok, danger = false }, opener) {
      finish(false); // 앞에서 기다리던 질문은 취소로 끝낸다
      if (dlg.open) closeDialog(dlg, { restoreFocus: false, immediate: true });
      accepted = false;
      title.textContent = heading;
      body.textContent = text;
      okButton.textContent = ok;
      okButton.className = danger ? 'btn btn-danger' : 'btn-primary';
      const answer = new Promise((resolve) => {
        settle = resolve;
      });
      openDialog(dlg, opener);
      cancelButton.focus(); // 덜 위험한 쪽에 처음 포커스 (W3C APG Alert Dialog)
      return answer;
    },
    /** 화면이 바뀔 때: 열려 있으면 취소로 바로 닫는다 */
    dismiss() {
      if (!dlg.open) return;
      closeDialog(dlg, { restoreFocus: false, immediate: true });
    },
    isOpen: () => dlg.open,
  };
}
