// 화면 틀: 사이드바(목차), 윗줄(메뉴·검색·테마), 저장 안내 배너, 스크린 리더용 안내 영역.
// 틀은 한 번만 만들고, 진도나 주소가 바뀌면 refresh()/onRoute() 로 속성만 고친다 (포커스·스크롤 위치를 지키려고).
import { dayState, isUnlocked, projectState } from '../progress.js';
import { doneCount, h } from './common.js';

const STATE_ICON = { locked: '🔒', done: '✅', next: '▶', open: '○' };
const STATE_TEXT = { locked: '잠김', done: '완료', next: '다음 할 Day', open: '' };
const SEARCH_DELAY = 180; // 글자를 치다 멈춘 뒤 이만큼(ms) 지나면 검색한다
const MOBILE = '(max-width: 959px)';

export function createShell(ctx) {
  const { cur } = ctx;
  const $ = (id) => document.getElementById(id);
  const sidebar = $('sidebar');
  const main = $('main');
  const menuToggle = $('menu-toggle');
  const themeToggle = $('theme-toggle');
  const searchInput = $('search-input');
  const banner = $('storage-banner');
  const live = $('live');
  const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const backdrop = h('div', { class: 'nav-backdrop', onclick: () => setNav(false) });
  document.body.append(backdrop);

  const projectEls = new Map(); // pid → { details, title, count, state(마지막으로 본 값) }
  const dayLinks = new Map(); // dayId → { link, icon, hint }
  const pageLinks = new Map(); // pageId → { link, icon, hint }
  let currentRoute = { name: 'home' };
  let currentProjectId = null; // 지금 보는 화면이 속한 프로젝트 (사이드바에서 펼쳐 둔다)
  let bannerDismissed = false;
  let searchTimer = null;

  document.querySelector('.brand').textContent = cur.title;

  // ───────── 사이드바 ─────────

  function stateMarks(state) {
    return [h('span', { class: 'mark', 'aria-hidden': 'true' }, STATE_ICON[state]), h('span', { class: 'sr-only' })];
  }

  function buildSidebar() {
    const nodes = [h('a', { class: 'side-home', href: '#/', 'data-nav': 'home' }, h('span', { class: 'mark', 'aria-hidden': 'true' }, '🏠'), '홈')];

    for (const project of cur.projects) {
      const title = h('span', { class: 'side-title' }, project.title);
      const count = h('span', { class: 'side-count' });
      const details = h('details', { class: 'side-project', dataset: { project: project.id } }, h('summary', null, title, count));
      const list = h('ol', { class: 'side-days' }, h('li', null, h('a', { class: 'side-overview', href: `#/project/${project.id}`, 'data-nav': `project:${project.id}` }, '프로젝트 한눈에 보기')));
      for (const day of project.days) {
        const marks = stateMarks('open');
        const link = h('a', { href: `#/day/${day.id}`, 'data-day': day.id, 'data-state': 'open' }, marks, h('span', { class: 'side-num' }, `Day ${day.num}`), h('span', { class: 'side-day-title' }, day.title));
        dayLinks.set(day.id, { link, icon: marks[0], hint: marks[1] });
        list.append(h('li', null, link));
      }
      details.append(list);
      // 사용자가 직접 접고 펼친 것은 존중한다: 처음 열 때 정한 값을 바꾸지 않는다
      projectEls.set(project.id, { details, title, count, state: null });
      nodes.push(details);
    }

    if (cur.pages.length > 0) {
      const list = h('ul', { class: 'side-pages' });
      for (const page of cur.pages) {
        const marks = stateMarks('open');
        const link = h('a', { href: `#/page/${page.id}`, 'data-page': page.id, 'data-nav': `page:${page.id}` }, marks, page.title);
        pageLinks.set(page.id, { link, icon: marks[0], hint: marks[1] });
        list.append(h('li', null, link));
      }
      nodes.push(h('section', { class: 'side-appendix' }, h('h2', null, '부록'), list));
    }
    sidebar.replaceChildren(...nodes);
  }

  function setMark(entry, state, hintText) {
    entry.icon.textContent = STATE_ICON[state] ?? '○';
    entry.hint.textContent = hintText ? ` (${hintText})` : '';
  }

  function refreshSidebar() {
    const { prog } = ctx;
    for (const project of cur.projects) {
      const el = projectEls.get(project.id);
      const state = projectState(cur, prog, project.id);
      el.details.dataset.state = state;
      el.count.textContent = state === 'locked' ? '🔒' : `${doneCount(prog, project)}/${project.days.length}`;
      el.count.setAttribute('aria-label', state === 'locked' ? '잠김' : `${project.days.length}개 중 ${doneCount(prog, project)}개 완료`);
      // 상태가 바뀔 때만 기본 펼침을 다시 정한다: 지금 하는 프로젝트는 펼치고, 끝났거나 잠긴 것은 접는다.
      // 지금 보고 있는 프로젝트는 접지 않는다
      if (el.state !== state) el.details.open = state === 'active' || project.id === currentProjectId;
      el.state = state;
      for (const day of project.days) {
        const dayStateNow = dayState(cur, prog, day.id);
        const entry = dayLinks.get(day.id);
        entry.link.dataset.state = dayStateNow;
        setMark(entry, dayStateNow, STATE_TEXT[dayStateNow]);
      }
    }
    for (const page of cur.pages) {
      const unlocked = isUnlocked(cur, prog, page.requires);
      const entry = pageLinks.get(page.id);
      entry.link.dataset.state = unlocked ? 'open' : 'locked';
      setMark(entry, unlocked ? 'open' : 'locked', unlocked ? '' : '잠김');
      // 부록 쪽 표시는 잠금일 때만 보여 준다 (평소에는 글자만)
      entry.icon.hidden = unlocked;
    }
  }

  /** 지금 보고 있는 화면을 사이드바에 표시한다. open: 그 프로젝트를 펼친다 (화면을 옮겼을 때만) */
  function markCurrent(route, { open = false } = {}) {
    let projectId = null;
    let link = null;
    if (route.name === 'home') link = sidebar.querySelector('a[data-nav="home"]');
    else if (route.name === 'project') [projectId, link] = [route.pid, sidebar.querySelector(`a[data-nav="project:${CSS.escape(route.pid)}"]`)];
    else if (route.name === 'page') link = pageLinks.get(route.id)?.link ?? null;
    else if (route.name === 'day') {
      link = dayLinks.get(route.dayId)?.link ?? null;
      projectId = cur.projects.find((p) => p.days.some((d) => d.id === route.dayId))?.id ?? null;
    }
    for (const el of sidebar.querySelectorAll('[aria-current]')) el.removeAttribute('aria-current');
    link?.setAttribute('aria-current', 'page');
    currentProjectId = projectId;
    if (open && projectId && projectEls.has(projectId)) projectEls.get(projectId).details.open = true;
    return link;
  }

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
  });
  window.matchMedia(MOBILE).addEventListener('change', (event) => {
    if (!event.matches && navOpen()) setNav(false, { restoreFocus: false });
  });

  // ───────── 테마 ─────────

  const effectiveTheme = () => (ctx.prog.theme === 'system' ? (darkQuery.matches ? 'dark' : 'light') : ctx.prog.theme);

  function applyTheme() {
    const root = document.documentElement;
    if (ctx.prog.theme === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', ctx.prog.theme);
    const dark = effectiveTheme() === 'dark';
    themeToggle.querySelector('.icon').textContent = dark ? '☀️' : '🌙';
    themeToggle.querySelector('.label').textContent = dark ? '라이트' : '다크';
    themeToggle.setAttribute('aria-label', dark ? '라이트 모드로 바꾸기' : '다크 모드로 바꾸기');
  }

  themeToggle.addEventListener('click', () => ctx.setTheme(effectiveTheme() === 'dark' ? 'light' : 'dark'));
  darkQuery.addEventListener('change', applyTheme);

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

  // ───────── 검색창 ─────────

  function searchHash(query) {
    return query.trim() === '' ? '#/search' : `#/search?q=${encodeURIComponent(query)}`;
  }

  function goSearch(immediate = false) {
    clearTimeout(searchTimer);
    const run = () => {
      const onSearch = currentRoute.name === 'search';
      if (!onSearch && searchInput.value.trim() === '') return; // 빈 칸이면 화면을 옮기지 않는다
      ctx.go(searchHash(searchInput.value), { replace: onSearch, keepFocus: true });
    };
    if (immediate) run();
    else searchTimer = setTimeout(run, SEARCH_DELAY);
  }

  searchInput.addEventListener('input', () => goSearch());
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      goSearch(true);
    }
  });

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

  buildSidebar();
  refreshSidebar();
  applyTheme();
  updateBanner();

  return {
    /** 진도·테마·저장 상태가 바뀐 뒤 */
    refresh() {
      refreshSidebar();
      applyTheme();
      updateBanner();
      markCurrent(currentRoute);
    },
    /** 화면을 옮긴 뒤 */
    onRoute(route) {
      currentRoute = route;
      const link = markCurrent(route, { open: true });
      if (navOpen()) setNav(false, { restoreFocus: false });
      revealInSidebar(link);
      if (route.name === 'search') {
        if (document.activeElement !== searchInput) searchInput.value = route.q;
      } else if (searchInput.value !== '') {
        searchInput.value = '';
      }
    },
    /** 스크린 리더가 읽어 주는 짧은 안내 */
    announce(text) {
      live.textContent = '';
      // 같은 글이 다시 와도 읽히도록 한 박자 늦춰 넣는다
      setTimeout(() => { live.textContent = text; }, 30);
    },
  };
}
