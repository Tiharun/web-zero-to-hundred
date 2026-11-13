// 부록 페이지(시작하기, 용어 사전, 문제 해결 …). 앞 단계가 끝나야 열리는 페이지는 잠금 화면.
import { accordionOpened } from '../motion.js';
import { isUnlocked } from '../progress.js';
import { breadcrumb, getPage, h, lockScreen } from './common.js';
import { pageArt, px } from './icons.js';

/**
 * #/page/<id>/<anchor> 의 anchor 가 가리키는, 페이지 본문 안의 요소. 본문 밖의 id(#main, #sidebar …)나 없는 id 면 null.
 * 화면을 그린 뒤에 부른다 (root 안에 .page-body 가 있어야 한다)
 */
export function anchorTarget(root, anchor) {
  const body = root.querySelector('.page-body');
  const target = anchor && body ? document.getElementById(anchor) : null;
  return target && body.contains(target) ? target : null;
}

export function renderPage(ctx, id, anchor, root) {
  const { cur } = ctx;
  const page = getPage(cur, id);
  const template = page && document.getElementById(`t-page-${id}`);
  if (!page || !(template instanceof HTMLTemplateElement)) {
    return ctx.notFound(root);
  }
  if (!isUnlocked(cur, ctx.prog, page.requires)) {
    root.append(lockScreen(ctx, page.title, page.requires));
    return `잠김 · ${page.title}`;
  }

  const body = h('div', { class: 'page-body' });
  body.append(template.content.cloneNode(true));
  const art = pageArt(id);
  const lead = page.meta && h('p', { class: 'lead' }, page.meta);
  const expandBtn = symptomAccordions(body);
  // 부록 머리 (DESIGN.md Cards "부록 머리"): 도트 그림 → 제목 → 설명. 증상 Accordion 이 있으면 설명 줄 오른쪽에 "모두 펼치기"
  const head = h(
    'header',
    { class: 'page-head' },
    art && h('span', { class: 'badge' }, px(art, { cls: 'page-art', scale: 3 })),
    h('h1', null, page.title),
    expandBtn ? h('div', { class: 'page-head-row' }, lead, expandBtn) : lead,
  );
  root.append(h('article', { class: 'page-article', dataset: { page: id } }, breadcrumb({ text: '홈', href: '#/' }, { text: page.title }), head, body));

  // 용어 사전 항목처럼 #/page/<id>/<anchor> 로 온 경우 그 자리로 간다. 닫힌 증상 안이면 먼저 연다.
  // 묶음(색인의 ㄱ, 목차의 월드·Day)은 자리만 옮긴다: 묶음 전체에 "찾아온 항목" 띠를 두르지 않는다
  const target = anchorTarget(root, anchor);
  if (target) {
    for (let d = target.closest('details'); d; d = d.parentElement?.closest('details')) d.open = true;
    if (!target.matches('.gl-group, .ts-group, .ts-day')) target.classList.add('is-target');
    target.scrollIntoView();
  }
  return page.title;
}

/**
 * 증상 Accordion(DESIGN.md Cards "증상 Accordion"): 사용자가 열 때만 내용이 올라오고, "모두 펼치기" 글자가 따라간다.
 * @returns {HTMLButtonElement | null} 증상이 없으면 null
 */
function symptomAccordions(body) {
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
