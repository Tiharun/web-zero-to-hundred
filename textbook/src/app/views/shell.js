// 화면 틀: 윗줄(메뉴·워드마크·검색·테마 메뉴), 사이드바(목차), 푸터, 저장 안내 배너, 스크린 리더용 안내 영역.
// 틀은 한 번만 만들고, 진도나 주소가 바뀌면 refresh()/onRoute() 로 속성만 고친다 (포커스·스크롤 위치를 지키려고).
import { h } from './common.js';
import { icon } from './icons.js';
import { menuButton } from './overlay.js';
import { createSidebar } from './sidebar.js';

const MOBILE = '(max-width: 63.99rem)'; // 이 폭 이하에서는 사이드바가 서랍이 된다 (shell.css 와 같은 값)
const THEME_NAME = { system: '시스템', light: '라이트', dark: '다크' };
const THEME_ICON = { system: 'monitor', light: 'sun', dark: 'moon' };

export function createShell(ctx) {
  const { cur } = ctx;
  const $ = (id) => document.getElementById(id);
  const sidebar = $('sidebar');
  const main = $('main');
  const menuToggle = $('menu-toggle');
  const themeBtn = $('theme-btn');
  const themeMenu = $('theme-menu');
  const themeItems = [...themeMenu.querySelectorAll('[role="menuitemradio"]')];
  const banner = $('storage-banner');
  const live = $('live');

  /** 스크린 리더가 읽어 주는 짧은 안내 */
  function announce(text) {
    live.textContent = '';
    // 같은 글이 다시 와도 읽히도록 한 박자 늦춰 넣는다
    setTimeout(() => { live.textContent = text; }, 30);
  }
  const backdrop = h('div', { class: 'nav-backdrop', onclick: () => setNav(false) });
  document.body.append(backdrop);

  let currentRoute = { name: 'home' };
  let bannerDismissed = false;
  let shownTheme = null; // 버튼 아이콘에 그려 둔 테마 (같으면 다시 그리지 않는다)

  // 이름은 curriculum.json 의 title 하나에서 온다. 템플릿의 글자는 스크립트가 돌기 전 대체값이다
  document.querySelector('.wordmark-text').textContent = cur.title;
  document.querySelector('.footer-brand span').textContent = cur.title;

  // ───────── 푸터 (날짜는 두지 않는다: 사용자 결정) ─────────

  // 부록 바로 가기는 그 페이지가 교재에 있을 때만 둔다
  for (const link of document.querySelectorAll('.footer-links [data-page-link]')) {
    if (!cur.pages.some((p) => p.id === link.dataset.pageLink)) link.remove();
  }

  // ───────── 사이드바 ─────────

  const side = createSidebar(ctx);
  sidebar.append(side.nav);

  /**
   * 사이드바 안에서 링크가 보이도록 사이드바만 스크롤한다.
   * scrollIntoView 는 쓰지 않는다: 브라우저가 Tab 의 시작점을 그 링크로 옮겨서, 처음 열었을 때 첫 Tab 이
   * 건너뛰기 링크·윗줄을 건너뛰고 사이드바 한가운데로 가 버린다.
   */
  function revealInSidebar(link) {
    if (!link) return;
    const box = sidebar.getBoundingClientRect();
    const rect = link.getBoundingClientRect();
    const margin = 8;
    if (rect.top < box.top) sidebar.scrollTop -= box.top - rect.top + margin;
    else if (rect.bottom > box.bottom) sidebar.scrollTop += rect.bottom - box.bottom + margin;
  }

  // ───────── 모바일 서랍 ─────────

  function navOpen() {
    return document.body.classList.contains('nav-open');
  }

  function setNav(open, { restoreFocus = true } = {}) {
    document.body.classList.toggle('nav-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    main.inert = open; // 서랍이 열려 있는 동안 뒤쪽 본문으로는 Tab 이 가지 않는다
    if (open) {
      const current = sidebar.querySelector('[aria-current]');
      revealInSidebar(current);
      (current ?? sidebar.querySelector('a'))?.focus({ preventScroll: true });
    } else if (restoreFocus && document.activeElement && sidebar.contains(document.activeElement)) {
      menuToggle.focus({ preventScroll: true });
    }
  }

  menuToggle.addEventListener('click', () => setNav(!navOpen()));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navOpen()) {
      event.preventDefault();
      setNav(false);
    }
    // Ctrl+K(맥은 ⌘K): 검색 화면으로 가서 입력칸에 포커스. M5 에서 검색 Modal 로 바뀐다
    if ((event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === 'k' && !event.isComposing) {
      event.preventDefault();
      if (navOpen()) setNav(false, { restoreFocus: false });
      const focusInput = () => document.querySelector('[data-testid="search-input"]')?.focus();
      if (location.hash.startsWith('#/search')) focusInput();
      else {
        window.addEventListener('hashchange', () => queueMicrotask(focusInput), { once: true }); // 화면이 다 그려지고 본문 포커스를 옮긴 뒤
        location.hash = '#/search';
      }
    }
  });
  window.matchMedia(MOBILE).addEventListener('change', (event) => {
    if (!event.matches && navOpen()) setNav(false, { restoreFocus: false });
  });

  // ───────── 테마 메뉴 (DESIGN.md Navigation "테마 Dropdown", 메뉴 버튼 패턴) ─────────

  function applyTheme() {
    const value = ctx.prog.theme;
    const root = document.documentElement;
    if (value === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', value);
    for (const item of themeItems) item.setAttribute('aria-checked', String(item.dataset.themeValue === value));
    themeBtn.setAttribute('aria-label', `테마: ${THEME_NAME[value]}`);
    if (shownTheme !== value) {
      themeBtn.replaceChildren(icon(THEME_ICON[value]));
      shownTheme = value;
    }
  }

  const themeMenuCtl = menuButton(themeBtn, themeMenu, {
    items: () => themeItems,
    initialIndex: () => Math.max(themeItems.findIndex((item) => item.getAttribute('aria-checked') === 'true'), 0),
  });

  function choose(item) {
    const value = item.dataset.themeValue;
    themeMenuCtl.close();
    if (value !== ctx.prog.theme) ctx.setTheme(value);
    announce(`${THEME_NAME[value]} 테마로 바꿨어요.`);
  }

  // 버튼 요소라서 Enter·Space 도 click 으로 온다
  themeMenu.addEventListener('click', (event) => {
    const item = event.target.closest('[role="menuitemradio"]');
    if (item) choose(item);
  });

  // ───────── 저장 안내 배너 ─────────

  banner.append(
    h('p', null, h('strong', null, '진도가 저장되지 않아요. '), '이 브라우저에서는 저장소를 쓸 수 없어서, 이 창을 닫으면 진도가 사라져요. 설정에서 백업 파일을 내보내 두면 안전해요.'),
    h(
      'div',
      { class: 'banner-actions' },
      h('a', { class: 'btn btn-small', href: '#/settings' }, '백업하러 가기'),
      h('button', { class: 'btn btn-small', type: 'button', onclick: () => { bannerDismissed = true; updateBanner(); } }, '닫기'),
    ),
  );

  function updateBanner() {
    banner.hidden = ctx.store.available || bannerDismissed; // available 은 getter 라서 매번 읽는다
  }

  // ───────── 그 밖의 연결 ─────────

  // 건너뛰기 링크(#main)는 교재 주소가 아니라서 해시를 바꾸지 않고 포커스만 옮긴다
  document.querySelector('.skip-link').addEventListener('click', (event) => {
    event.preventDefault();
    main.focus();
  });
  // 서랍 안에서 화면을 옮기면 서랍을 닫는다
  sidebar.addEventListener('click', (event) => {
    if (event.target.closest('a') && navOpen()) setNav(false, { restoreFocus: false });
  });

  // 404 빌드는 아무 주소에서나 열리므로, 틀의 교재 링크는 사이트 주소로 보낸다
  if (ctx.siteBase) {
    for (const a of document.querySelectorAll('.topbar a[href^="#/"], .site-footer a[href^="#/"], #sidebar a[href^="#/"]')) {
      a.setAttribute('href', ctx.siteBase + a.getAttribute('href'));
    }
  }
  side.refresh();
  applyTheme();
  updateBanner();

  return {
    /** 진도·테마·저장 상태가 바뀐 뒤 */
    refresh() {
      side.refresh();
      applyTheme();
      updateBanner();
      side.markCurrent(currentRoute);
    },
    /** 화면을 옮긴 뒤 */
    onRoute(route) {
      currentRoute = route;
      const link = side.markCurrent(route, { open: true });
      if (navOpen()) setNav(false, { restoreFocus: false });
      themeMenuCtl.close(false);
      revealInSidebar(link);
      if (route.name === 'search') $('search-open').setAttribute('aria-current', 'page');
      else $('search-open').removeAttribute('aria-current');
    },
    announce,
  };
}
