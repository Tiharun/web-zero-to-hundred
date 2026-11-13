// 교재 앱 진입점: 임베드된 데이터를 읽고, 진도를 불러오고, 주소(해시)에 맞는 화면을 그린다.
import { magneticIn } from './motion.js';
import { continueTarget, normalizeProgress } from './progress.js';
import { parseHash } from './router.js';
import { createStore } from './storage.js';
import { errorScreen, helpHref, notFoundScreen } from './views/common.js';
import { createConfirm } from './views/confirm.js';
import { renderDay } from './views/day.js';
import { renderHome } from './views/home.js';
import { anchorTarget, renderPage } from './views/page.js';
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
  notfound: (ctx, route, root) => ctx.notFound(root),
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
  let cleanups = []; // 지금 화면이 붙인 리스너·관찰자를 떼는 함수들. 다음 render 맨 앞에서 부른다
  let changeListeners = []; // 지금 화면이 진도·테마 변화를 따라가려고 건 것들. 화면을 새로 그릴 때마다 비운다

  // 404 빌드(GitHub Pages 의 404.html): 빈 주소는 404 화면이고, 틀의 링크는 사이트 주소(cur.url)로 간다
  const notFoundBuild = document.documentElement.hasAttribute('data-notfound');
  const siteBase = notFoundBuild ? cur.url : '';
  const confirmModal = createConfirm(document.getElementById('confirm-dialog'));

  const ctx = {
    cur,
    /** 지금 화면을 떠날 때(다음 render 시작) 한 번 부를 정리 함수를 등록한다 */
    onCleanup(fn) {
      cleanups.push(fn);
    },
    store,
    /** 404 빌드에서 틀의 링크 앞에 붙일 사이트 주소. 보통 빌드에서는 '' */
    siteBase,
    /** 없는 화면을 그리고 창 제목을 돌려준다 */
    notFound(root) {
      root.append(notFoundScreen({ homeHref: siteBase || '#/', helpHref: helpHref(cur, siteBase) }));
      return '찾을 수 없어요';
    },
    get prog() {
      return prog;
    },
    /** 진도를 바꾸고 저장하고, 틀(사이드바·테마·배너)을 맞춘다 */
    commit(next) {
      prog = next;
      store.save(prog);
      shell.refresh();
      for (const listener of changeListeners) listener();
    },
    /** 지금 화면이 진도·테마 변화를 따라가게 한다 (설정의 테마 선택처럼). 다른 화면으로 가면 저절로 해제된다 */
    onChange(listener) {
      changeListeners.push(listener);
    },
    setTheme(theme) {
      ctx.commit({ ...prog, theme });
    },
    now: () => new Date().toISOString(),
    announce: (text) => shell.announce(text),
    /** 되돌릴 수 없는 일 앞에서 확인 Modal 로 묻는다. 확인만 true (views/confirm.js) */
    confirm: (opts, opener) => confirmModal.ask(opts, opener),
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
    /** 화면을 다시 그리지 않고 주소(기록을 늘리지 않음)와 창 제목만 바꾼다. 검색칸에서 칠 때 쓴다 */
    replaceRoute(hash, title) {
      history.replaceState(null, '', hash);
      main.dataset.hash = hash;
      document.title = `${title} · ${cur.title}`;
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
    const emptyHash = location.hash === '' || location.hash === '#';
    const route = notFoundBuild && emptyHash ? { name: 'notfound' } : parseHash(location.hash);
    confirmModal.dismiss(); // 화면이 바뀌면(뒤로 가기 등) 묻던 것은 취소다
    for (const fn of cleanups.splice(0)) {
      try {
        fn();
      } catch (error) {
        console.error(error);
      }
    }
    changeListeners = [];
    main.replaceChildren();
    let title;
    try {
      title = (VIEWS[route.name] ?? VIEWS.notfound)(ctx, route, main);
    } catch (error) {
      console.error(error);
      main.replaceChildren(errorScreen({ homeHref: siteBase || '#/', base: siteBase }));
      title = '문제가 생겼어요';
    }
    ctx.onCleanup(magneticIn(main)); // DESIGN.md: 끌림은 주 버튼에만. 화면이 버튼을 다시 그려도 따라간다
    main.dataset.hash = location.hash || '#/'; // e2e 테스트가 "이 주소의 화면이 다 그려졌다"를 기다리는 표시일 뿐, 앱 동작에는 쓰지 않는다
    document.title = `${title} · ${cur.title}`;
    shell.onRoute(route);
    if (focus) main.focus({ preventScroll: true }); // 화면을 옮기면 본문으로 포커스를 옮겨 읽는 위치를 알린다
    // 용어 사전처럼 #/page/<id>/<anchor> 로 온 경우에는 페이지가 이미 그 자리로 스크롤했다 (본문 안의 id 일 때만)
    if (scroll && !(route.name === 'page' && anchorTarget(main, route.anchor))) window.scrollTo(0, 0);
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
