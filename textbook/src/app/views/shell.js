// 화면 틀: 윗줄(메뉴·워드마크·검색·테마 메뉴), 사이드바(목차), 푸터, 저장 안내 배너, 스크린 리더용 안내 영역.
// 틀은 한 번만 만들고, 진도나 주소가 바뀌면 refresh()/onRoute() 로 속성만 고친다 (포커스·스크롤 위치를 지키려고).
import { stagger } from '../motion.js';
import { h } from './common.js';
import { icon } from './icons.js';
import { closeDialog, menuButton, openDialog, setupDialog } from './overlay.js';
import { createSearchModal } from './searchmodal.js';
import { createSidebar } from './sidebar.js';

const WIDE = '(min-width: 64rem)'; // 이 폭부터 사이드바가 보이고 서랍은 쓰지 않는다 (shell.css 와 같은 값)
const THEME_NAME = { system: '시스템', light: '라이트', dark: '다크' };
const THEME_ICON = { system: 'monitor', light: 'sun', dark: 'moon' };

export function createShell(ctx) {
  const { cur } = ctx;
  const $ = (id) => document.getElementById(id);
  const sidebar = $('sidebar');
  const main = $('main');
  const menuToggle = $('menu-toggle');
  const drawer = $('drawer');
  const drawerBody = drawer.querySelector('.drawer-body');
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

  // ───────── 서랍 (DESIGN.md Navigation "Drawer": 1024px 아래, <dialog> showModal) ─────────

  /** 서랍 목록 안에서 el 이 가운데 오도록 그 칸만 스크롤한다 (뒤 문서는 건드리지 않는다) */
  function centerInDrawer(el) {
    const box = drawerBody.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    drawerBody.scrollTop += rect.top - box.top - (box.height - rect.height) / 2;
  }

  // 닫힌 뒤 포커스할 곳. undefined: 연 버튼으로 돌아간다, null: 그대로 둔다, 요소: 그 요소
  let focusAfterClose;

  function openDrawer() {
    drawerBody.append(side.nav); // 목록 한 벌을 서랍으로 옮긴다
    openDialog(drawer, menuToggle);
    menuToggle.setAttribute('aria-expanded', 'true');
    const target = side.focusTarget();
    if (target) {
      const world = target.closest('details.world');
      if (world && !world.open) world.open = true; // 접혀 있으면 포커스할 수 없다
      centerInDrawer(target);
      target.focus({ preventScroll: true });
    }
    stagger(side.summaries());
  }

  /**
   * 서랍을 닫는다. focus: 생략하면 연 버튼으로, null 이면 그대로, 요소면 그 요소로.
   * 모달이 닫힐 때 브라우저가 연 버튼으로 포커스를 돌려놓으므로 다른 곳은 close 뒤에 옮긴다.
   */
  function closeDrawer({ focus, immediate = false } = {}) {
    if (!drawer.open) return;
    focusAfterClose = focus;
    closeDialog(drawer, { restoreFocus: focus === undefined, immediate });
  }

  setupDialog(drawer);
  // 닫히는 순간(open 속성이 빠질 때) 목록을 사이드바로 돌려놓고 버튼 상태와 포커스를 맞춘다.
  // close 이벤트는 다음 태스크에 오므로 기다리지 않는다. 브라우저가 close() 안에서 연 버튼으로 포커스를
  // 돌려놓은 직후(같은 태스크의 마이크로태스크)라서, 다른 곳으로 보낼 포커스도 여기서 옮긴다
  new MutationObserver(() => {
    if (drawer.open) return;
    sidebar.append(side.nav);
    menuToggle.setAttribute('aria-expanded', 'false');
    const target = focusAfterClose;
    focusAfterClose = undefined;
    if (target?.isConnected) target.focus({ preventScroll: true });
  }).observe(drawer, { attributes: true, attributeFilter: ['open'] });
  menuToggle.addEventListener('click', openDrawer);
  $('drawer-close').addEventListener('click', () => closeDrawer());
  // 서랍 안의 링크를 누르면 닫고 본문으로 간다 (지금 화면 링크여도 닫는다). 잠긴 월드 메뉴처럼 막힌 링크는 그대로 둔다
  drawer.addEventListener('click', (event) => {
    if (!event.defaultPrevented && event.target.closest('a[href]')) closeDrawer({ focus: main });
  });
  // 창이 넓어지면 서랍 대신 사이드바가 보인다: 바로 닫고, 보고 있던 행에 포커스를 둔다
  window.matchMedia(WIDE).addEventListener('change', (event) => {
    if (!event.matches || !drawer.open) return;
    const active = document.activeElement;
    closeDrawer({ focus: side.nav.contains(active) ? active : null, immediate: true });
  });

  // ───────── 검색 Modal (DESIGN.md Navigation "검색 Modal": Ctrl+K·검색 버튼) ─────────

  const searchOpen = $('search-open');
  const searchModal = createSearchModal(ctx, $('search-dialog'));

  /**
   * 검색을 연다. 검색 화면에서는 그 화면의 입력칸으로, 그 밖에서는 Modal 로.
   * 서랍이 열려 있으면 바로 닫고 Modal 이 닫힌 뒤에는 메뉴 버튼으로 돌아간다. 404 빌드는 사이트의 검색 화면으로 간다.
   */
  function openSearch(opener) {
    if (ctx.siteBase) {
      location.assign(`${ctx.siteBase}#/search`);
      return;
    }
    themeMenuCtl.close(false);
    if (drawer.open) {
      closeDrawer({ focus: null, immediate: true });
      opener = menuToggle;
    }
    if (currentRoute.name === 'search') document.querySelector('[data-testid="search-input"]')?.focus();
    else searchModal.open(opener);
  }

  document.addEventListener('keydown', (event) => {
    // Ctrl+K(맥은 ⌘K). 누르고 있어 반복되는 키는 무시한다
    if ((event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === 'k' && !event.isComposing && !event.repeat) {
      event.preventDefault();
      if (document.getElementById('confirm-dialog')?.open) return; // 확인 Modal 위에 검색을 겹쳐 열지 않는다
      openSearch(document.activeElement);
    }
  });
  // 그냥 누른 클릭만 Modal 로. 수정 키·가운데 버튼은 링크(#/search) 그대로 둔다(새 탭 등). 404 빌드는 링크가 사이트 주소다
  searchOpen.addEventListener('click', (event) => {
    if (ctx.siteBase || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    openSearch(event.currentTarget);
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
  // 404 빌드는 아무 주소에서나 열리므로, 틀의 교재 링크는 사이트 주소로 보낸다
  if (ctx.siteBase) {
    for (const a of document.querySelectorAll('.topbar a[href^="#/"], .site-footer a[href^="#/"]')) {
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
      closeDrawer({ focus: main }); // 뒤로 가기 등으로 화면이 바뀌어도 닫는다. 닫힌 뒤 본문으로
      searchModal.close({ restoreFocus: false, immediate: true });
      themeMenuCtl.close(false);
      revealInSidebar(link);
      if (route.name === 'search') searchOpen.setAttribute('aria-current', 'page');
      else searchOpen.removeAttribute('aria-current');
    },
    announce,
  };
}
