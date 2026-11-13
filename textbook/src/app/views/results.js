// 검색 결과 행 공용 부품: 검색 Modal 과 검색 페이지가 같이 쓴다. DESIGN.md Navigation "검색 Modal".
// 행 = 위치(Label) | 제목 + 이유(한 줄) | 태그(Label). 잠긴 결과는 이유 자리에 여는 조건 문장만 둔다(본문 조각 없음).
// 이 파일은 맨 위에서 document 를 읽지 않는다 (node 단위 테스트가 import 한다).
import { isUnlocked, navDayState, projectState, questState } from '../progress.js';
import { searchAsync } from '../search.js';
import { findDay, getPage, getProject, h, lockReason } from './common.js';
import { skeletonGate, skeletonRows } from './skeleton.js';

const DAY_TAG = { locked: '잠김', done: '완료', today: '오늘', draft: '준비 중', open: '' };

/** 색인 항목이 지금 잠겨 있는가 (알 수 없는 항목은 잠긴 것으로 본다) */
export function isItemLocked(ctx, item) {
  const { cur, prog } = ctx;
  if (item.kind === 'day') return projectState(cur, prog, item.project) === 'locked';
  const page = getPage(cur, item.id);
  return !page || !isUnlocked(cur, prog, page.requires);
}

function dayModel(ctx, dayId, why) {
  const { cur, prog } = ctx;
  const found = findDay(cur, dayId);
  const project = found?.project ?? null;
  const state = navDayState(cur, prog, dayId);
  const locked = state === 'locked';
  return {
    id: dayId,
    href: `#/day/${dayId}`,
    where: project && found ? `${project.id.toUpperCase()} Day ${found.day.num}` : 'Day',
    title: found?.day.title ?? dayId,
    why: locked ? lockReason(cur, project?.requires) : why,
    tag: DAY_TAG[state] ?? '',
    locked,
  };
}

function pageModel(ctx, page, why) {
  const locked = !isUnlocked(ctx.cur, ctx.prog, page.requires);
  return {
    id: page.id,
    href: `#/page/${page.id}`,
    where: '부록',
    title: page.title,
    why: locked ? lockReason(ctx.cur, page.requires) : why,
    tag: locked ? '잠김' : '',
    locked,
  };
}

/** search() 결과 하나 → 화면용 모델 */
export function resultModel(ctx, result) {
  if (result.kind === 'day') return { ...dayModel(ctx, result.id, result.snippet ?? ''), title: result.title };
  const page = getPage(ctx.cur, result.id);
  if (!page) return { id: result.id, href: `#/page/${result.id}`, where: '부록', title: result.title, why: '', tag: '잠김', locked: true };
  return { ...pageModel(ctx, page, result.snippet ?? ''), title: result.title };
}

/** 빈 검색어의 바로 가기: 오늘의 퀘스트(있으면) + 부록 전부 */
export function shortcutModels(ctx) {
  const { dayId } = questState(ctx.cur, ctx.prog);
  const today = dayId ? [dayModel(ctx, dayId, '오늘의 퀘스트')] : [];
  return [...today, ...ctx.cur.pages.map((page) => pageModel(ctx, page, page.meta ?? ''))];
}

/** 결과 목록 위 머리 글자 */
export function hintText(query, count) {
  if (query.trim() === '') return '바로 가기';
  return count > 0 ? `찾은 곳 ${count}개` : '';
}

/** 결과가 없을 때의 안내 문장 */
export const emptyText = (query) => `‘${query.trim()}’에 맞는 내용이 없어요. 다른 낱말로 찾아보세요.`;

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** 검색어와 일치하는 부분을 <mark> 로 감싼 노드 목록 (글자는 textContent 로만 넣는다) */
export function highlight(text, terms) {
  if (terms.length === 0 || !text) return [text];
  const pattern = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'giu');
  return text.split(pattern).map((part, i) => (i % 2 === 1 ? h('mark', null, part) : part));
}

/** 행 안의 세 칸: 위치 | 제목 + 이유 | 태그 */
export function resultParts(model, terms) {
  return [
    h('span', { class: 'result-where label' }, model.where),
    h(
      'span',
      { class: 'result-body' },
      h('span', { class: 'result-title' }, highlight(model.title, terms)),
      model.why && h('span', { class: 'result-why' }, model.locked ? model.why : highlight(model.why, terms)),
    ),
    h('span', { class: 'result-tag label' }, model.tag),
  ];
}

const termsOf = (query) => query.trim().split(/\s+/).filter(Boolean);

/**
 * 결과 목록 하나를 맡는다. update(query) 가 앞 계산을 멈추고 새로 계산한다.
 * 늦으면(200ms) Skeleton 을 보이고, 끝나면 row(model, terms, i) 로 그린 행, 머리 글자, 안내 문장을 맞춘다.
 * @param {{ list: HTMLElement, hint: HTMLElement, empty: HTMLElement, row: (model: object, terms: string[], i: number) => HTMLElement }} parts
 */
export function createResultsView(ctx, { list, hint, empty, row }) {
  let shown = [];
  let controller = null;
  let gate = null;

  function stop() {
    controller?.abort();
    controller = null;
    gate?.cancel();
    gate = null;
  }

  function render(query, models) {
    const terms = termsOf(query);
    shown = models;
    list.replaceChildren(...models.map((model, i) => row(model, terms, i)));
    hint.textContent = hintText(query, models.length);
    const none = query.trim() !== '' && models.length === 0;
    empty.hidden = !none;
    empty.textContent = none ? emptyText(query) : '';
  }

  return {
    async update(query) {
      stop();
      if (query.trim() === '') {
        render(query, shortcutModels(ctx));
        return;
      }
      const mine = new AbortController();
      const myGate = skeletonGate({
        show: () => {
          list.replaceChildren(...skeletonRows());
          list.setAttribute('aria-busy', 'true');
          empty.hidden = true;
        },
        hide: () => list.removeAttribute('aria-busy'),
      });
      controller = mine;
      gate = myGate;
      const results = await searchAsync(ctx.cur.search, query.trim(), (item) => isItemLocked(ctx, item), { signal: mine.signal });
      if (results === null || controller !== mine) return; // 더 새 검색어가 왔다
      await new Promise((resolve) => myGate.finish(resolve));
      if (controller !== mine) return; // 최소 시간을 기다리는 동안 새 검색어가 왔다
      controller = null;
      gate = null;
      render(query, results.map((result) => resultModel(ctx, result)));
    },
    models: () => shown,
    cancel: stop,
  };
}
