// 용어 서랍: DESIGN.md Navigation "용어 서랍". 본문의 용어 링크를 누르면 오른쪽 서랍에 용어 사전 항목을 보여 준다.
// 내용은 용어 사전 페이지 템플릿(#t-page-glossary)의 항목(#term-<slug>)을 복제해 쓴다. 틀은 template.html 의 #term-drawer.
// 이 파일은 맨 위에서 document 를 읽지 않는다 (node 단위 테스트가 termSlug 를 import 한다).
import { closeDialog, openDialog, setupDialog } from './overlay.js';

const TERM_HREF = /^#\/page\/glossary\/term-(.+)$/;

/** 용어 링크 주소(getAttribute('href') 값)의 slug. 용어 항목 주소가 아니면 null */
export function termSlug(href) {
  const m = typeof href === 'string' ? TERM_HREF.exec(href) : null;
  return m ? m[1] : null;
}

/**
 * @param {HTMLDialogElement} dlg #term-drawer
 * @returns {{ open(slug: string, opener?: Element): boolean, close(opts?: object): void, isOpen(): boolean }}
 */
export function createTermDrawer(dlg, { doc = document } = {}) {
  const title = dlg.querySelector('#term-drawer-title'); // 열면 여기로 포커스
  const titleText = title.querySelector('span');
  const body = dlg.querySelector('.term-drawer-body');
  const more = dlg.querySelector('[data-testid="term-drawer-more"]');

  setupDialog(dlg);
  dlg.querySelector('.term-drawer-close').addEventListener('click', () => closeDialog(dlg));
  // 정의 안의 용어 링크는 서랍 안에서 바꾼다. 다른 링크(더 보기 포함)는 그대로 이동하고, 화면이 바뀌면 render() 가 닫는다
  dlg.addEventListener('click', (event) => {
    const link = event.target.closest('a.term');
    if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    if (api.open(termSlug(link.getAttribute('href')))) event.preventDefault();
  });

  /** 용어 사전 템플릿에서 항목을 찾는다. 없으면 null */
  function entry(slug) {
    const template = doc.getElementById('t-page-glossary');
    if (!slug || !(template instanceof doc.defaultView.HTMLTemplateElement)) return null;
    return template.content.getElementById(`term-${slug}`);
  }

  const api = {
    open(slug, opener) {
      const found = entry(slug);
      if (!found) return false;
      const copy = found.cloneNode(true);
      const head = copy.querySelector('h1, h2, h3, h4');
      titleText.textContent = head ? head.textContent.trim() : slug;
      head?.remove();
      copy.removeAttribute('id');
      for (const el of copy.querySelectorAll('[id]')) el.removeAttribute('id');
      body.replaceChildren(...copy.childNodes);
      body.scrollTop = 0;
      more.setAttribute('href', `#/page/glossary/term-${slug}`);
      openDialog(dlg, opener); // 이미 열려 있으면 내용만 바뀌고 돌아갈 곳은 처음 연 링크다
      title.focus({ preventScroll: true });
      return true;
    },
    close(opts) {
      closeDialog(dlg, opts);
    },
    isOpen: () => dlg.open,
  };
  return api;
}
