// 교재 앱 진입점: 임베드된 데이터를 읽고, 진도를 불러오고, 주소(해시)에 맞는 화면을 그린다.
import { continueTarget, normalizeProgress } from './progress.js';
import { parseHash } from './router.js';
import { createStore } from './storage.js';
import { h, notFoundScreen } from './views/common.js';
import { renderDay } from './views/day.js';
import { renderHome } from './views/home.js';
import { renderPage } from './views/page.js';
import { renderProject } from './views/project.js';
import { renderSearch } from './views/search.js';
import { renderSettings } from './views/settings.js';
import { createShell } from './views/shell.js';

/** 라우트 → 화면. 각 화면은 main 에 내용을 붙이고 창 제목에 쓸 이름을 돌려준다 */
const VIEWS = {
  home: (ctx, route, root) => renderHome(ctx, root),
  project: (ctx, route, root) => renderProject(ctx, route.pid, root),
  day: (ctx, route, root) => renderDay(ctx, route.dayId, root),
  page: (ctx, route, root) => renderPage(ctx, route.id, route.anchor, root),
  settings: (ctx, route, root) => renderSettings(ctx, root),
  search: (ctx, route, root) => renderSearch(ctx, route.q, root),
  notfound: (ctx, route, root) => {
    root.append(notFoundScreen());
    return '찾을 수 없어요';
  },
};

function readData() {
  return JSON.parse(document.getElementById('wzh-data').textContent);
}

function start() {
  const main = document.getElementById('main');
  const cur = readData();
  const store = createStore();
  let prog = normalizeProgress(store.load(), cur);
  let notice = null; // 다음에 그리는 홈에서 한 번만 보여 줄 안내
  let shell = null;
  let keepFocusNext = false; // 다음 hashchange 에서 포커스를 본문으로 옮기지 않는다 (검색창에서 칠 때)

  const ctx = {
    cur,
    store,
    get prog() {
      return prog;
    },
    /** 진도를 바꾸고 저장하고, 틀(사이드바·테마·배너)을 맞춘다 */
    commit(next) {
      prog = next;
      store.save(prog);
      shell.refresh();
    },
    setTheme(theme) {
      ctx.commit({ ...prog, theme });
    },
    now: () => new Date().toISOString(),
    announce: (text) => shell.announce(text),
    /** 지금 할 수 있는 곳의 주소 (없으면 null) */
    continueHref() {
      const target = continueTarget(cur, prog);
      return target ? `#/day/${target}` : null;
    },
    setNotice(text) {
      notice = text;
    },
    takeNotice() {
      const text = notice;
      notice = null;
      return text;
    },
    /** 화면을 옮긴다. replace: 기록을 늘리지 않고 바꾼다(스크롤도 그대로), keepFocus: 포커스를 본문으로 옮기지 않는다 */
    go(hash, { replace = false, keepFocus = false } = {}) {
      if (replace) {
        history.replaceState(null, '', hash);
        render({ focus: false, scroll: false });
      } else if (location.hash === hash) {
        render({ focus: !keepFocus, scroll: true });
      } else {
        keepFocusNext = keepFocus;
        location.hash = hash; // hashchange 가 그린다
      }
    },
  };

  function render({ focus, scroll }) {
    const route = parseHash(location.hash);
    main.replaceChildren();
    let title;
    try {
      title = (VIEWS[route.name] ?? VIEWS.notfound)(ctx, route, main);
    } catch (error) {
      console.error(error);
      main.replaceChildren(h('section', { class: 'notfound' }, h('h1', null, '화면을 그리다 문제가 생겼어요'), h('p', { class: 'lead' }, '새로고침하면 대부분 해결돼요. 계속되면 설정에서 진도를 백업해 두세요.')));
      title = '문제가 생겼어요';
    }
    main.dataset.hash = location.hash || '#/';
    document.title = `${title} · ${cur.title}`;
    shell.onRoute(route);
    if (focus) main.focus({ preventScroll: true }); // 화면을 옮기면 본문으로 포커스를 옮겨 읽는 위치를 알린다
    // 용어 사전처럼 #/page/<id>/<anchor> 로 온 경우에는 페이지가 이미 그 자리로 스크롤했다
    if (scroll && !(route.name === 'page' && route.anchor && document.getElementById(route.anchor))) window.scrollTo(0, 0);
  }

  shell = createShell(ctx);
  window.addEventListener('hashchange', () => {
    const focus = !keepFocusNext;
    keepFocusNext = false;
    render({ focus, scroll: true });
  });
  render({ focus: false, scroll: false }); // 처음 열 때는 포커스를 옮기지 않는다 (건너뛰기 링크가 맨 앞에 있게)
}

start();
