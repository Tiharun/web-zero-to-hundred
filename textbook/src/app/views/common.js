// 여러 화면이 같이 쓰는 도우미: DOM 만들기, 데이터 찾기, 잠금 화면, 없는 화면.
// 화면에 들어가는 글자는 모두 textContent(createTextNode)로 넣는다. innerHTML 을 쓰지 않는다.
import { isProjectComplete, projectState } from '../progress.js';

/**
 * 작은 DOM 도우미. h('a', { href: '#/', class: 'btn' }, '글자', 자식…)
 * props: class, dataset(객체), on<event>(함수), 그 밖의 값은 속성으로. false/null/undefined 는 건너뛴다.
 * 자식: 글자, 노드, 배열(펼침), null/false(건너뜀)
 */
export function h(tag, props, ...children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(props ?? {})) {
    if (value == null || value === false) continue;
    if (key === 'class') el.className = value;
    else if (key === 'dataset') Object.assign(el.dataset, value);
    else if (key.startsWith('on') && typeof value === 'function') el.addEventListener(key.slice(2).toLowerCase(), value);
    else el.setAttribute(key, value === true ? '' : String(value));
  }
  append(el, children);
  return el;
}

function append(parent, children) {
  for (const child of children) {
    if (child == null || child === false) continue;
    if (Array.isArray(child)) append(parent, child);
    else parent.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
}

// ───────── 데이터 찾기 ─────────

export const isDone = (prog, dayId) => Object.hasOwn(prog.completed, dayId);
export const getProject = (cur, pid) => cur.projects.find((p) => p.id === pid);
export const getPage = (cur, id) => cur.pages.find((p) => p.id === id);

/** Day 가 속한 프로젝트와 위치. 모르는 Day 면 null */
export function findDay(cur, dayId) {
  for (const project of cur.projects) {
    const index = project.days.findIndex((d) => d.id === dayId);
    if (index >= 0) return { project, day: project.days[index], index };
  }
  return null;
}

export const doneCount = (prog, project) => project.days.filter((d) => isDone(prog, d.id)).length;
export const minutesText = (minutes) => `약 ${minutes}분`;

// ───────── 조각 ─────────

/** 진도 막대. 값은 0..100 */
export function meter(percent, label) {
  return h(
    'div',
    { class: 'meter', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': percent, 'aria-label': label },
    h('span', { style: `width:${percent}%` }),
  );
}

/** 빵부스러기 길: 홈 › 프로젝트 */
export function breadcrumb(...items) {
  return h(
    'nav',
    { class: 'breadcrumb', 'aria-label': '현재 위치' },
    h('ol', null, items.map((item) => h('li', null, item.href ? h('a', { href: item.href }, item.text) : h('span', { 'aria-current': 'page' }, item.text)))),
  );
}

/** 이어서 하기 링크 모양의 버튼 */
export function linkButton(href, text, { primary = false, testid = null } = {}) {
  return h('a', { class: primary ? 'btn btn-primary' : 'btn', href, 'data-testid': testid }, text);
}

// ───────── 잠금 화면 · 없는 화면 ─────────

/**
 * 잠긴 프로젝트·Day·페이지 대신 보여 주는 화면. 본문은 어디에도 붙이지 않는다.
 * @param {string} what 잠긴 대상의 이름 (제목만 쓴다)
 * @param {string[]} requires 열리려면 끝내야 하는 프로젝트 id
 */
export function lockScreen(ctx, what, requires) {
  const { cur, prog } = ctx;
  const missing = (requires ?? []).map((pid) => getProject(cur, pid)).filter((p) => p && !isProjectComplete(cur, prog, p.id));
  const target = ctx.continueHref();

  return h(
    'section',
    { class: 'lock-screen', 'data-testid': 'lock-screen', 'aria-labelledby': 'lock-title' },
    h('p', { class: 'lock-icon', 'aria-hidden': 'true' }, '🔒'),
    h('h1', { id: 'lock-title' }, '아직 잠겨 있어요'),
    h('p', { class: 'lead' }, `‘${what}’ 화면은 앞 단계를 마치면 저절로 열려요. 서두르지 않아도 괜찮아요. 순서대로 가면 가장 편해요.`),
    missing.length > 0 && [
      h('h2', null, '이렇게 하면 열려요'),
      h(
        'ul',
        { class: 'lock-needs' },
        missing.map((p) => {
          const note = projectState(cur, prog, p.id) === 'locked' ? '이 프로젝트도 아직 잠겨 있어요' : `${doneCount(prog, p)} / ${p.days.length} Day 완료`;
          return h('li', null, h('a', { href: `#/project/${p.id}` }, p.title), '의 모든 Day를 완료해요 ', h('span', { class: 'muted' }, `(${note})`));
        }),
      ),
    ],
    h('div', { class: 'lock-actions' }, target ? linkButton(target, '지금 할 수 있는 곳으로 가기', { primary: true }) : null, linkButton('#/', '홈으로')),
  );
}

/** 없는 주소 */
export function notFoundScreen() {
  return h(
    'section',
    { class: 'notfound' },
    h('h1', null, '찾을 수 없는 화면이에요'),
    h('p', { class: 'lead' }, '주소가 잘못됐거나 없어진 화면이에요. 홈에서 다시 시작해 볼까요?'),
    h('div', { class: 'lock-actions' }, linkButton('#/', '홈으로 가기', { primary: true })),
  );
}
