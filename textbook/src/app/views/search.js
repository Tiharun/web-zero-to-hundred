// 검색 결과 화면. 잠긴 결과(잠긴 프로젝트의 Day, 잠긴 페이지)는 제목만 보여 주고 본문 조각은 숨긴다.
import { isUnlocked, projectState } from '../progress.js';
import { search } from '../search.js';
import { getPage, h } from './common.js';

/** 색인 항목이 지금 잠겨 있는가 (알 수 없는 항목은 잠긴 것으로 본다) */
function isItemLocked(ctx, item) {
  const { cur, prog } = ctx;
  if (item.kind === 'day') return projectState(cur, prog, item.project) === 'locked';
  const page = getPage(cur, item.id);
  return !page || !isUnlocked(cur, prog, page.requires);
}

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** 검색어와 일치하는 부분을 <mark> 로 감싼 노드 목록 (글자는 textContent 로만 넣는다) */
function highlight(text, terms) {
  if (terms.length === 0) return [text];
  const pattern = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'giu');
  return text.split(pattern).map((part, i) => (i % 2 === 1 ? h('mark', null, part) : part));
}

const SEARCH_DELAY = 180; // 글자를 치다 멈춘 뒤 이만큼(ms) 지나면 검색한다

const searchHash = (query) => (query.trim() === '' ? '#/search' : `#/search?q=${encodeURIComponent(query)}`);
const titleFor = (q) => (q ? `검색: ${q}` : '검색');

/** 결과 목록과 요약 (검색어가 바뀔 때마다 이 부분만 다시 그린다) */
function resultNodes(ctx, query) {
  const { cur } = ctx;
  const q = query.trim();
  const terms = q.split(/\s+/).filter(Boolean);
  const results = q ? search(cur.search, q, (item) => isItemLocked(ctx, item)) : [];

  const items = results.map((result) => {
    const locked = result.snippet === null;
    const day = result.kind === 'day' ? cur.projects.flatMap((p) => p.days).find((d) => d.id === result.id) : null;
    const project = result.project ? cur.projects.find((p) => p.id === result.project) : null;
    const where = day ? `${project?.title ?? ''} · Day ${day.num}` : '부록';
    const href = result.kind === 'day' ? `#/day/${result.id}` : `#/page/${result.id}`;
    return h(
      'li',
      { class: 'result', 'data-testid': 'search-result', 'data-id': result.id, 'data-locked': String(locked) },
      h('a', { href }, locked && h('span', { 'aria-hidden': 'true' }, '🔒 '), h('strong', null, highlight(result.title, terms))),
      h('span', { class: 'result-where' }, where),
      locked ? h('p', { class: 'muted' }, '아직 잠겨 있어서 제목만 보여요. 앞 단계를 마치면 내용도 볼 수 있어요.') : h('p', { class: 'snippet' }, highlight(result.snippet, terms)),
    );
  });

  const summary = !q ? '검색칸에 찾고 싶은 낱말을 입력해 보세요.' : results.length === 0 ? `‘${q}’에 맞는 내용이 없어요. 다른 낱말로 찾아볼까요?` : `‘${q}’ 검색 결과 ${results.length}개`;
  return [h('p', { class: 'lead', role: 'status', 'data-testid': 'search-summary' }, summary), items.length > 0 && h('ul', { class: 'results' }, items)];
}

/**
 * 검색 화면: 맨 위 입력칸 + 결과. 치는 동안에는 화면 전체를 다시 그리지 않고 주소(replace)와 결과만 바꾼다.
 * 입력칸을 그대로 두어야 포커스와 한글 조합이 끊기지 않는다.
 */
export function renderSearch(ctx, query, root) {
  const area = h('div', { class: 'search-results' }, resultNodes(ctx, query));
  let timer = null;
  const input = h('input', {
    class: 'search-input',
    type: 'search',
    'data-testid': 'search-input',
    'aria-label': '교재 검색',
    placeholder: '낱말을 입력하세요',
    autocomplete: 'off',
    enterkeyhint: 'search',
    value: query,
  });
  const run = () => {
    clearTimeout(timer);
    // 대기 중에 다른 화면으로 갔으면 그 화면의 주소를 덮어쓰지 않는다
    if (!input.isConnected) return;
    const q = input.value.trim();
    ctx.replaceRoute(searchHash(input.value), titleFor(q));
    area.replaceChildren(...resultNodes(ctx, input.value).filter(Boolean));
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

  root.append(h('section', { class: 'search-view' }, h('h1', null, '검색'), input, area));
  return titleFor(query.trim());
}
