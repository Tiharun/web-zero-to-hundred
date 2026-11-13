// 여러 화면이 같이 쓰는 도우미: DOM 만들기, 데이터 찾기, 잠금 화면, 없는 화면.
// 화면에 들어가는 글자는 모두 textContent(createTextNode)로 넣는다. innerHTML 을 쓰지 않는다.
import { isProjectComplete, projectState } from '../progress.js';
import { icon, px } from './icons.js';

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

/** 월드 태그 글자: 메인 과정은 "월드 n", 특별 과정은 "특별 월드" */
export const worldLabel = (project) => (project.track === 'special' ? '특별 월드' : `월드 ${project.order}`);

/** 잠긴 것이 열리는 조건 한 문장. 홈 카드·사이드바·월드 메뉴가 같이 쓴다. 알 수 있는 조건이 없으면 '' */
export function lockReason(cur, requires) {
  const titles = (requires ?? []).map((pid) => getProject(cur, pid)?.title).filter(Boolean);
  return titles.length > 0 ? `${titles.map((t) => `‘${t}’`).join(', ')} 프로젝트를 끝내면 열려요.` : '';
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

// ───────── 공용 부품 (DESIGN.md Components) ─────────

/** 카드: card 바탕, 2px rule 테두리, 4px 턱. props.class 는 card 뒤에 붙는다 */
export function card(props, ...children) {
  const { class: cls, ...rest } = props ?? {};
  return h('section', { ...rest, class: cls ? `card ${cls}` : 'card' }, ...children);
}

/** 주 버튼(분홍 면 + 턱). 한 화면에 하나만 쓴다 */
export function primaryButton(href, text, { testid = null } = {}) {
  return h('a', { class: 'btn-primary', href, 'data-testid': testid }, text);
}

/** 밑줄 글자 링크 */
export function textLink(href, text) {
  return h('a', { class: 'text-link', href }, text);
}

/** 기술 칩 하나 */
export const chip = (text) => h('li', null, text);

/** 기술 칩 목록. max 를 넘으면 마지막에 "외 n개" */
export function chips(items, max = 4) {
  const shown = items.slice(0, max);
  const rest = items.length - shown.length;
  return h('ul', { class: 'chips' }, shown.map(chip), rest > 0 && h('li', { class: 'chip-more' }, `외 ${rest}개`));
}

/** 안내 한 줄: 선 경고 아이콘 + 글자. 화면 낭독기에 알린다 */
export function notice(text, { testid = null } = {}) {
  return h('p', { class: 'notice', role: 'status', 'data-testid': testid }, icon('alert'), h('span', null, text));
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
    px('lock', { cls: 'notfound-icon', scale: 3 }),
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
    h('div', { class: 'lock-actions' }, target ? primaryButton(target, '지금 할 수 있는 곳으로 가기') : null, textLink('#/', '홈으로')),
  );
}

/**
 * 화면을 그리다 예외가 났을 때: 렌치 도트 아이콘, 제목, 설명, 주 버튼 "홈으로 가기", 글자 링크 "설정 · 진도 백업". 셸은 그대로 둔다.
 * base 는 404 빌드에서 붙이는 사이트 주소 (helpHref 와 같다)
 */
export function errorScreen({ homeHref = '#/', base = '' } = {}) {
  return h(
    'section',
    { class: 'notfound', 'data-testid': 'error-screen', 'aria-labelledby': 'error-title' },
    px('wrench', { cls: 'notfound-icon', scale: 3 }),
    h('h1', { id: 'error-title' }, '화면을 그리다 문제가 생겼어요'),
    h('p', { class: 'lead' }, '새로고침하면 대부분 해결돼요. 계속되면 설정에서 진도를 백업해 두세요.'),
    h('div', { class: 'lock-actions' }, primaryButton(homeHref, '홈으로 가기'), textLink(`${base}#/settings`, '설정 · 진도 백업')),
  );
}

/** 부록 "막혔을 때"(help) 주소. 그 페이지가 없으면 null. base 는 404 빌드에서 붙이는 사이트 주소 */
export const helpHref = (cur, base = '') => (getPage(cur, 'help') ? `${base}#/page/help` : null);

/** 없는 주소: 렌치 도트 아이콘, 제목, 설명, 주 버튼 "홈으로 가기", (있으면) 글자 링크 "막혔을 때" */
export function notFoundScreen({ homeHref = '#/', helpHref = null } = {}) {
  return h(
    'section',
    { class: 'notfound', 'data-testid': 'notfound', 'aria-labelledby': 'notfound-title' },
    px('wrench', { cls: 'notfound-icon', scale: 3 }),
    h('h1', { id: 'notfound-title' }, '찾을 수 없는 화면이에요'),
    h('p', { class: 'lead' }, '주소가 잘못됐거나 없어진 화면이에요. 홈에서 다시 시작해 볼까요?'),
    h('div', { class: 'lock-actions' }, primaryButton(homeHref, '홈으로 가기'), helpHref && textLink(helpHref, '막혔을 때')),
  );
}
