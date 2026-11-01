// 부록 페이지(시작하기, 용어 사전, 문제 해결 …). 앞 단계가 끝나야 열리는 페이지는 잠금 화면.
import { isUnlocked } from '../progress.js';
import { breadcrumb, getPage, h, lockScreen, notFoundScreen } from './common.js';

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
    root.append(notFoundScreen());
    return '찾을 수 없어요';
  }
  if (!isUnlocked(cur, ctx.prog, page.requires)) {
    root.append(lockScreen(ctx, page.title, page.requires));
    return `잠김 · ${page.title}`;
  }

  const body = h('div', { class: 'page-body' });
  body.append(template.content.cloneNode(true));
  root.append(h('article', { class: 'page-article', dataset: { page: id } }, breadcrumb({ text: '홈', href: '#/' }, { text: page.title }), h('h1', null, page.title), body));

  // 용어 사전 항목처럼 #/page/<id>/<anchor> 로 온 경우 그 자리로 간다
  const target = anchorTarget(root, anchor);
  if (target) {
    target.classList.add('is-target');
    target.scrollIntoView();
  }
  return page.title;
}
