// 해시 라우터 (Day 28)
// 주소의 # 뒤(예: #/streamers/3)를 보고 어떤 화면을 그릴지 정해요.
// # 뒤만 바뀌면 브라우저는 페이지를 새로 불러오지 않아요. 그래서 서버에는 index.html 하나만 있으면 돼요.

// 주소에서 뽑은 값. "/streamers/:id"에 "/streamers/3"이 오면 { id: "3" }
export type Params = Record<string, string>;

// 화면 하나 = 그릴 곳(view)과 주소에서 뽑은 값(params, query)을 받아서 그리는 함수
export type Page = (view: HTMLElement, params: Params, query: URLSearchParams) => void | Promise<void>;

interface Route {
  pattern: string;
  page: Page;
}

const routes: Route[] = [];

// 주소 모양과 화면을 짝지어 등록해요. 위에서부터 차례로 비교해요
export function addRoute(pattern: string, page: Page): void {
  routes.push({ pattern, page });
}

// pattern과 path를 한 칸씩 비교해요. ":"로 시작하는 칸은 아무 값이나 받아서 params에 넣어요. 안 맞으면 null
export function matchRoute(pattern: string, path: string): Params | null {
  const patternParts = pattern.split('/');
  const pathParts = path.split('/');
  if (patternParts.length !== pathParts.length) {
    return null;
  }

  const params: Params = {};
  for (let i = 0; i < patternParts.length; i++) {
    const expected = patternParts[i];
    const actual = pathParts[i];
    if (expected.startsWith(':')) {
      params[expected.slice(1)] = decodeURIComponent(actual);
    } else if (expected !== actual) {
      return null;
    }
  }
  return params;
}

// "#/board?page=2" → path "/board", query page=2
function readHash(): { path: string; query: URLSearchParams } {
  const hash = location.hash.slice(1) || '/'; // 앞의 #를 떼요. 아무것도 없으면 홈
  const [path, queryString = ''] = hash.split('?');
  return { path, query: new URLSearchParams(queryString) };
}

async function render(app: HTMLElement): Promise<void> {
  const { path, query } = readHash();

  // 새 화면용 상자를 만들어서 통째로 바꿔 끼워요.
  // 앞 화면의 데이터가 늦게 도착해도 이미 떼어 낸 상자에 그려지니까 화면이 섞이지 않아요.
  const view = document.createElement('div');
  app.replaceChildren(view);
  window.scrollTo(0, 0);

  for (const route of routes) {
    const params = matchRoute(route.pattern, path);
    if (params !== null) {
      try {
        await route.page(view, params, query);
      } catch (error) {
        view.textContent = '화면을 그리다가 문제가 생겼어요. 새로고침해 보세요.';
        console.error(error); // 개발자 도구(F12) 콘솔에서 자세한 내용을 볼 수 있어요
      }
      return;
    }
  }
  view.innerHTML = '<h1>페이지를 찾을 수 없어요</h1><p><a href="#/">홈으로 가기</a></p>';
}

// 처음 한 번 그리고, 그다음부터는 # 뒤가 바뀔 때마다 다시 그려요
export function startRouter(app: HTMLElement): void {
  window.addEventListener('hashchange', () => render(app));
  render(app);
}
