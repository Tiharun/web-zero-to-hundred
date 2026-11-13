// 보상 Modal(레벨업·월드 클리어): DESIGN.md Day 부품 "보상 Modal". <dialog> 하나(template.html)를 내용만 바꿔 쓴다.
// 무엇을 띄울지는 reward.js 가 정하고, "세션에 한 번"은 부르는 쪽(day.js)이 onceInSession 으로 정한다.
import { confetti } from '../motion.js';
import { getProject, h } from './common.js';
import { lvBadge } from './hud.js';
import { px, worldEmblem } from './icons.js';
import { closeDialog, openDialog, setupDialog } from './overlay.js';

/**
 * @param {HTMLDialogElement} dlg #reward-dialog
 * @returns {{ show(modal: object, cur: object, opener?: Element): Promise<void>, dismiss(): void, isOpen(): boolean }}
 */
export function createRewardModal(dlg) {
  let settle = null; // 지금 열린 Modal 이 닫히면 끝낼 약속

  setupDialog(dlg);
  dlg.addEventListener('close', () => {
    const done = settle;
    settle = null;
    done?.();
  });

  function content(modal, cur) {
    const ok = h('button', { class: 'btn-primary', type: 'button', 'data-testid': 'reward-ok', onclick: () => closeDialog(dlg) }, '계속하기');
    if (modal.kind === 'level') {
      return {
        ok,
        nodes: [
          h('p', { class: 'label' }, '레벨 업'),
          lvBadge(modal.level),
          h('h2', { class: 'reward-title', id: 'reward-title' }, '레벨이 올랐어요'),
          h('p', { class: 'reward-next' }, '다음 레벨까지 XP ', h('span', { class: 'num' }, String(modal.toNext))),
          ok,
        ],
      };
    }
    const project = getProject(cur, modal.pid);
    const badge = h('span', { class: 'badge' }, px(worldEmblem(project), { cls: 'emblem', scale: 3 }));
    return {
      ok,
      badge,
      nodes: [
        h('p', { class: 'label' }, '월드 클리어'),
        badge,
        h('h2', { class: 'reward-title', id: 'reward-title' }, `‘${project.title}’ 클리어!`),
        project.outcome && h('p', { class: 'reward-outcome' }, project.outcome),
        modal.level !== null && h('p', { class: 'reward-level' }, `LV ${modal.level} 달성`),
        ok,
      ],
    };
  }

  return {
    show(modal, cur, opener) {
      settle?.(); // 앞의 약속이 남아 있으면 끝낸다
      const { ok, badge, nodes } = content(modal, cur);
      dlg.replaceChildren(...nodes.filter(Boolean));
      const closed = new Promise((resolve) => {
        settle = resolve;
      });
      openDialog(dlg, opener);
      ok.focus();
      if (badge) confetti(dlg, badge);
      return closed;
    },
    /** 화면이 바뀔 때: 열려 있으면 바로 닫는다(포커스는 새 화면이 정한다) */
    dismiss() {
      if (!dlg.open) return;
      closeDialog(dlg, { restoreFocus: false, immediate: true });
    },
    isOpen: () => dlg.open,
  };
}
