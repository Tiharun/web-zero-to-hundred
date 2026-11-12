// 사이드바 목록(DESIGN.md Navigation "사이드바"·"Day 행"). 넓은 화면의 #sidebar 와 좁은 화면의 서랍이
// 이 목록 한 벌을 옮겨 쓴다. 틀은 한 번만 만들고, 진도가 바뀌면 바뀐 행만 새로 만든다 (포커스·스크롤을 지키려고).
import { shake } from '../motion.js';
import { continueTarget, isUnlocked, navDayState, projectState } from '../progress.js';
import { doneCount, h, lockReason, worldLabel } from './common.js';
import { icon, px } from './icons.js';
import { menuButton } from './overlay.js';
import { showToast } from './toast.js';

/** 화면 낭독기가 읽는 행 상태 (준비 중은 글자가 이미 보인다) */
const STATE_TEXT = { done: '완료', today: '오늘', locked: '잠김', draft: '', open: '' };
/** Accordion 등장(160ms, DESIGN.md Motion)이 끝난 뒤 표시 클래스를 뗀다 */
const ACCORDION_CLEAR_MS = 400;

export function createSidebar(ctx) {
  const { cur } = ctx;
  const base = ctx.siteBase ?? ''; // 404 빌드에서는 사이트 주소를 앞에 붙인다
  const worlds = new Map(); // pid → { details, count, lock, list, state(마지막으로 본 값) }
  const rows = new Map(); // dayId → { el, state }
  const pageRows = new Map(); // pageId → { el, mark }
  const menuItems = new Map(); // pid → { el, count }
  let route = { name: 'home' };
  let currentProjectId = null; // 지금 화면이 속한 월드 (사이드바에서 펼쳐 둔다)

  // ───────── 머리: 홈 · 월드 메뉴 · 모두 펼치기 ─────────

  const homeLink = h('a', { class: 'side-home', href: `${base}#/`, dataset: { nav: 'home' } }, '홈');
  const expandBtn = h('button', { type: 'button', class: 'text-btn', dataset: { expandAll: '' } }, '모두 펼치기');

  // 월드 Dropdown (DESIGN.md Navigation "월드 Dropdown"): 항목은 그 월드 페이지로 가는 menuitem 링크
  const worldBtn = h(
    'button',
    { id: 'world-btn', type: 'button', class: 'text-btn world-btn', 'aria-haspopup': 'menu', 'aria-controls': 'world-menu', 'aria-expanded': 'false' },
    '월드',
    icon('chevron'),
  );
  const worldMenu = h('div', { id: 'world-menu', class: 'menu world-menu', role: 'menu', 'aria-labelledby': 'world-btn', hidden: true });
  for (const project of cur.projects) {
    const count = h('span', { class: 'world-count' }); // 사이드바 월드 요약과 같은 진도 표시
    const el = h(
      'a',
      { role: 'menuitem', tabindex: '-1', href: `${base}#/project/${project.id}`, dataset: { project: project.id } },
      h('span', { class: 'world-sum' }, h('span', { class: 'world-tag label' }, worldLabel(project)), h('span', { class: 'world-menu-name' }, project.title)),
      count,
      icon('check', 'tick'),
    );
    menuItems.set(project.id, { el, count });
    worldMenu.append(el);
  }
  const menuList = () => [...menuItems.values()].map((m) => m.el);
  const worldCtl = menuButton(worldBtn, worldMenu, {
    items: menuList,
    initialIndex: () => Math.max(menuList().findIndex((el) => el.getAttribute('aria-current') === 'page'), 0),
  });
  // 잠긴 월드는 이동하지 않고 흔들며 이유를 알린다 (메뉴는 열어 둔다). 열린 월드는 메뉴를 닫고 링크대로 간다
  worldMenu.addEventListener('click', (event) => {
    const item = event.target.closest('[role="menuitem"]');
    if (!item) return;
    if (item.getAttribute('aria-disabled') === 'true') {
      event.preventDefault();
      explainLocked(item, cur.projects.find((p) => p.id === item.dataset.project));
      return;
    }
    worldCtl.close(false);
  });

  const head = h('div', { class: 'side-head' }, homeLink, worldBtn, expandBtn, worldMenu);

  // ───────── 월드 ─────────

  const worldList = h('div', { class: 'side-worlds' });
  for (const project of cur.projects) {
    const count = h('span', { class: 'world-count' });
    const summary = h(
      'summary',
      null,
      h('span', { class: 'world-sum' }, h('span', { class: 'world-tag label' }, worldLabel(project)), h('span', { class: 'world-name' }, project.title)),
      count,
      icon('chevron', 'world-chev'),
    );
    const lock = h('p', { class: 'world-lock', hidden: true }, lockReason(cur, project.requires));
    const list = h('ol', { class: 'rows' });
    const details = h('details', { class: 'world', dataset: { project: project.id } }, summary, lock, list);
    worlds.set(project.id, { details, count, lock, list, state: null });
    worldList.append(details);
  }

  // ───────── 부록 ─────────

  let appendix = null;
  if (cur.pages.length > 0) {
    const list = h('ul', { class: 'rows' });
    for (const page of cur.pages) {
      const mark = h('span', { class: 'row-mark' });
      const el = h('a', { class: 'row', href: `${base}#/page/${page.id}`, dataset: { page: page.id, nav: `page:${page.id}` } }, h('span', { class: 'row-title' }, page.title), mark);
      pageRows.set(page.id, { el, mark });
      list.append(h('li', null, el));
    }
    appendix = h('section', { class: 'side-appendix', 'aria-labelledby': 'side-appendix-title' }, h('h2', { id: 'side-appendix-title', class: 'label' }, '부록'), list);
  }

  const nav = h('nav', { class: 'side', 'aria-label': '교재 목차' }, head, worldList, appendix);

  // ───────── 행 ─────────

  function explainLocked(el, project) {
    shake(el);
    showToast(lockReason(cur, project.requires) || '앞 단계를 마치면 열려요.');
  }

  function renderRow(project, day, state) {
    const mark = state === 'done' ? px('check') : state === 'locked' ? px('lock') : state === 'draft' ? h('span', { class: 'row-draft' }, '준비 중') : null;
    const kids = [
      h('span', { class: 'row-num' }, String(day.num)),
      h('span', { class: 'row-title' }, day.title),
      h('span', { class: 'row-mark' }, mark, STATE_TEXT[state] && h('span', { class: 'sr-only' }, ` ${STATE_TEXT[state]}`)),
    ];
    const props = { class: `row is-${state}`, dataset: { day: day.id, state } };
    // 잠긴 행은 링크가 아니다. 눌러서 이유를 듣는 버튼이다 (키보드 Enter·Space 도 같다)
    if (state === 'locked') return h('button', { ...props, type: 'button', onclick: (event) => explainLocked(event.currentTarget, project) }, ...kids);
    return h('a', { ...props, href: `${base}#/day/${day.id}` }, ...kids);
  }

  /** 지금 화면 행은 page, 오늘 행은 step. 오늘 행이 지금 화면이면 page 가 이긴다 */
  function currentEl() {
    if (route.name === 'home') return homeLink;
    if (route.name === 'day') return rows.get(route.dayId)?.el ?? null;
    if (route.name === 'page') return pageRows.get(route.id)?.el ?? null;
    return null;
  }

  function applyCurrent() {
    const current = currentEl();
    homeLink.toggleAttribute('aria-current', false);
    for (const { el } of pageRows.values()) el.removeAttribute('aria-current');
    for (const { el, state } of rows.values()) {
      if (state === 'today') el.setAttribute('aria-current', 'step');
      else el.removeAttribute('aria-current');
    }
    current?.setAttribute('aria-current', 'page');
    for (const [pid, { el }] of menuItems) {
      if (pid === currentProjectId) el.setAttribute('aria-current', 'page');
      else el.removeAttribute('aria-current');
    }
    return current;
  }

  function syncExpand() {
    const all = [...worlds.values()].every((w) => w.details.open);
    expandBtn.textContent = all ? '모두 접기' : '모두 펼치기';
  }

  /** 사용자가 펼칠 때만 내용이 올라온다 (페이지를 열 때 이미 펼쳐진 월드는 그대로) */
  function animateOpen(details) {
    details.classList.add('is-animating');
    setTimeout(() => details.classList.remove('is-animating'), ACCORDION_CLEAR_MS);
  }

  worldList.addEventListener('click', (event) => {
    const summary = event.target.closest('details.world > summary');
    if (summary) animateOpen(summary.parentElement);
  });
  expandBtn.addEventListener('click', () => {
    const open = ![...worlds.values()].every((w) => w.details.open);
    for (const { details } of worlds.values()) {
      if (open && !details.open) animateOpen(details);
      details.open = open;
    }
    syncExpand();
  });
  // toggle 은 거품이 일지 않으므로 capture 로 받는다
  nav.addEventListener('toggle', (event) => event.target.matches?.('details.world') && syncExpand(), true);

  function refresh() {
    const { prog } = ctx;
    const todayId = continueTarget(cur, prog);
    for (const project of cur.projects) {
      const w = worlds.get(project.id);
      const state = projectState(cur, prog, project.id);
      w.details.dataset.state = state;
      w.lock.hidden = state !== 'locked';
      const m = menuItems.get(project.id);
      if (state === 'locked') m.el.setAttribute('aria-disabled', 'true');
      else m.el.removeAttribute('aria-disabled');
      for (const box of [w.count, m.count]) {
        if (state === 'locked') box.replaceChildren(px('lock'), h('span', { class: 'sr-only' }, '잠김'));
        else box.replaceChildren(String(doneCount(prog, project)), h('span', { class: 'sr-only' }, '개 완료, 전체'), ` / ${project.days.length}`);
      }
      // 상태가 바뀔 때만 기본 펼침을 다시 정한다: 지금 하는 월드와 보고 있는 월드는 펼치고, 끝났거나 잠긴 것은 접는다
      if (w.state !== state) w.details.open = state === 'active' || project.id === currentProjectId;
      w.state = state;
      for (const day of project.days) {
        const next = navDayState(cur, prog, day.id, todayId);
        const old = rows.get(day.id);
        if (old?.state === next) continue;
        const el = renderRow(project, day, next);
        if (old) old.el.replaceWith(el);
        else w.list.append(h('li', null, el));
        rows.set(day.id, { el, state: next });
      }
    }
    for (const page of cur.pages) {
      const { el, mark } = pageRows.get(page.id);
      const unlocked = isUnlocked(cur, prog, page.requires);
      el.dataset.state = unlocked ? 'open' : 'locked';
      mark.replaceChildren(...(unlocked ? [] : [px('lock'), h('span', { class: 'sr-only' }, ' 잠김')]));
    }
    applyCurrent();
    syncExpand();
  }

  /** 지금 보고 있는 화면을 표시한다. open: 그 월드를 펼친다 (화면을 옮겼을 때만) */
  function markCurrent(next, { open = false } = {}) {
    route = next;
    currentProjectId =
      next.name === 'project' ? next.pid : next.name === 'day' ? (cur.projects.find((p) => p.days.some((d) => d.id === next.dayId))?.id ?? null) : null;
    if (open && currentProjectId && worlds.has(currentProjectId)) worlds.get(currentProjectId).details.open = true;
    if (open) worldCtl.close(false); // 화면을 옮기면 메뉴는 닫는다
    return applyCurrent();
  }

  return {
    nav,
    refresh,
    markCurrent,
    /** 서랍을 열 때 포커스할 곳: 오늘 행 → 지금 화면 → 첫 링크 */
    // 월드 메뉴 항목도 aria-current 를 갖지만 메뉴가 닫혀 있으면 숨어 있으므로 목록 행과 홈 링크에서만 찾는다
    focusTarget: () =>
      nav.querySelector('.row.is-today') ?? nav.querySelector('.side-home[aria-current="page"], .row[aria-current="page"]') ?? nav.querySelector('a[href]'),
    /** 서랍 Stagger 대상 */
    summaries: () => [...nav.querySelectorAll('.world > summary')],
  };
}
