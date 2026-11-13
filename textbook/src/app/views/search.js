// 검색 화면(#/search?q=): 검색 Modal 과 같은 입력 줄·결과 행을 카드 안에 둔다. 행은 링크다.
// 잠긴 결과(잠긴 프로젝트의 Day, 잠긴 페이지)는 제목과 여는 조건만 보여 주고 본문 조각은 두지 않는다(views/results.js).
import { h } from './common.js';
import { icon } from './icons.js';
import { createResultsView, resultParts } from './results.js';

const SEARCH_DELAY = 180; // 글자를 치다 멈춘 뒤 이만큼(ms) 지나면 검색한다

const searchHash = (query) => (query.trim() === '' ? '#/search' : `#/search?q=${encodeURIComponent(query)}`);
const titleFor = (q) => (q ? `검색: ${q}` : '검색');

/** 결과 행 하나: li > a.result */
const pageRow = (model, terms) =>
  h(
    'li',
    { 'data-testid': 'search-result', 'data-id': model.id, 'data-locked': String(model.locked) },
    h('a', { class: 'result', href: model.href }, resultParts(model, terms)),
  );

/**
 * 검색 화면: 맨 위 입력칸 + 결과. 치는 동안에는 화면 전체를 다시 그리지 않고 주소(replace)와 결과만 바꾼다.
 * 입력칸을 그대로 두어야 포커스와 한글 조합이 끊기지 않는다.
 */
export function renderSearch(ctx, query, root) {
  const hint = h('p', { class: 'search-hint label', role: 'status', 'data-testid': 'search-summary' });
  const list = h('ul', { class: 'results', 'aria-label': '검색 결과' });
  const empty = h('p', { class: 'search-empty', hidden: true });
  const view = createResultsView(ctx, { list, hint, empty, row: pageRow });
  ctx.onCleanup(view.cancel);

  let timer = null;
  const input = h('input', {
    class: 'search-input',
    type: 'search',
    'data-testid': 'search-input',
    'aria-label': '교재 검색',
    placeholder: 'Day 제목이나 낱말로 찾기',
    autocomplete: 'off',
    spellcheck: 'false',
    enterkeyhint: 'search',
    value: query,
  });
  const run = () => {
    clearTimeout(timer);
    // 대기 중에 다른 화면으로 갔으면 그 화면의 주소를 덮어쓰지 않는다
    if (!input.isConnected) return;
    const q = input.value.trim();
    ctx.replaceRoute(searchHash(input.value), titleFor(q));
    view.update(input.value);
  };
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(run, SEARCH_DELAY);
  });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.isComposing) {
      event.preventDefault();
      run();
    }
  });
  ctx.onCleanup(() => clearTimeout(timer));

  root.append(
    h(
      'section',
      { class: 'search-view' },
      h('h1', null, '검색'),
      h('div', { class: 'card search-card' }, h('label', { class: 'search-field' }, icon('search'), input), h('div', { class: 'search-body' }, hint, list, empty)),
    ),
  );
  view.update(query);
  return titleFor(query.trim());
}
