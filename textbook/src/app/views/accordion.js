// 증상 Accordion 의 "모두 펼치기" 버튼: 문제 해결 부록과 Day 의 🧯 섹션이 함께 쓴다.
import { accordionOpened } from '../motion.js';
import { h } from './common.js';

/**
 * 증상 Accordion(DESIGN.md Cards "증상 Accordion"): 사용자가 열 때만 내용이 올라오고, "모두 펼치기" 글자가 따라간다.
 * @returns {HTMLButtonElement | null} 증상이 없으면 null
 */
export function symptomAccordions(body) {
  const entries = [...body.querySelectorAll('details.ts-entry')];
  if (entries.length === 0) return null;
  const btn = h('button', { type: 'button', class: 'text-btn', dataset: { expandAll: '' } }, '모두 펼치기');
  const sync = () => {
    btn.textContent = entries.every((d) => d.open) ? '모두 접기' : '모두 펼치기';
  };
  body.addEventListener('click', (event) => {
    const summary = event.target.closest('details.ts-entry > summary');
    if (summary && !summary.parentElement.open) accordionOpened(summary.parentElement);
  });
  btn.addEventListener('click', () => {
    const open = !entries.every((d) => d.open);
    for (const d of entries) {
      if (open && !d.open) accordionOpened(d);
      d.open = open;
    }
    sync();
  });
  // toggle 은 거품이 일지 않으므로 capture 로 받는다
  body.addEventListener('toggle', (event) => event.target.matches?.('details.ts-entry') && sync(), true);
  return btn;
}
