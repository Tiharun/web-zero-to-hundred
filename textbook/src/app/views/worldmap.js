// 홈 월드맵: 지금 월드의 Day를 뱀 모양 보드게임 칸으로. DESIGN.md Layout "월드맵 배치", Components > Board Tiles·Tooltip.
// 칸 상태는 사이드바와 같은 navDayState(잠김 > 완료 > 오늘 > 준비 중 > 남음). 지도 상태는 저장하지 않는다.
import { navDayState, questState } from '../progress.js';
import { LAYOUTS, layouts, pathD, rowArrows, streakEnd, tipSide } from '../trail.js';
import { doneCount, getProject, h, isDone } from './common.js';
import { px, worldEmblem } from './icons.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const STATE_TEXT = { locked: '잠김', done: '완료', today: '오늘', draft: '준비 중', open: '남음' };

/** 배포 Day: 제목에 "배포"가 들어간 Day(DESIGN.md Board Tiles) */
export const isDeployDay = (day) => /배포/.test(day.title);

/** SVG 요소 하나 */
function svg(tag, attrs, ...children) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) if (value != null) el.setAttribute(key, String(value));
  el.append(...children);
  return el;
}

/** 범례: 지도에 실제로 있는 표시만, 완료 → 오늘 → 남음 → 준비 중 → 배포 */
function legend(world, states) {
  const rest = world.days.filter((_, i) => states[i] === 'open' || states[i] === 'draft' || states[i] === 'locked');
  return h(
    'ul',
    { class: 'legend', 'aria-label': '표시 뜻' },
    states.includes('done') && h('li', null, h('span', { class: 'lg lg-done' }, px('check', { scale: 1 })), '완료'),
    states.includes('today') && h('li', null, px('pawn', { cls: 'px-pawn lg-pawn' }), '오늘'),
    rest.some((d) => d.ready !== false) && h('li', null, h('span', { class: 'lg lg-open' }), '남음'),
    rest.some((d) => d.ready === false) && h('li', null, h('span', { class: 'lg lg-draft' }), '준비 중'),
    world.days.some(isDeployDay) && h('li', null, px('flag', { cls: 'lg-flag' }), '배포'),
  );
}

/** 칸 하나 */
function tile(day, index, state, geo) {
  const num = day.num;
  const deploy = isDeployDay(day);
  const today = state === 'today';
  const style = Object.keys(LAYOUTS)
    .map((k) => `--x${k}:${geo[k].pts[index].x.toFixed(3)};--y${k}:${geo[k].pts[index].y.toFixed(3)}`)
    .join(';');
  const sides = Object.fromEntries(Object.keys(LAYOUTS).map((k) => [`data-${k}`, tipSide(geo[k].pts[index], geo[k].cols)]));
  const face = state === 'done' ? px('check') : h('span', { class: 'node-num' }, String(num));
  const label = `Day ${num} ${day.title}, ${STATE_TEXT[state]}${deploy ? ', 배포 Day' : ''}`;
  const inner = [
    face,
    deploy && px('flag', { cls: 'node-flag' }),
    h('span', { class: 'tip', ...sides, 'aria-hidden': 'true' }, `Day ${num} ${day.title}`),
  ];
  // 잠긴 칸은 링크가 아니다
  const body =
    state === 'locked'
      ? h('span', { class: 'node-face', role: 'img', 'aria-label': label }, inner)
      : h('a', { href: `#/day/${day.id}`, 'aria-label': label, 'data-today': today || null, 'aria-current': today ? 'step' : null }, inner);
  return h(
    'li',
    { class: `node is-${state}${deploy ? ' is-deploy' : ''}`, style, dataset: { day: day.id } },
    today && h('span', { class: 'pawn', 'aria-hidden': 'true' }, px('pawn', { cls: 'px-pawn', scale: 3 })),
    body,
    today && h('span', { class: 'node-today label', 'aria-hidden': 'true' }, '오늘'),
  );
}

/** 월드맵 카드. 월드가 없으면 null */
export function worldMap(ctx) {
  const { cur, prog } = ctx;
  const state = questState(cur, prog);
  const world = state.worldId && getProject(cur, state.worldId);
  if (!world) return null;

  const n = world.days.length;
  const geo = layouts(n);
  const states = world.days.map((d) => navDayState(cur, prog, d.id, state.dayId));
  const streak = streakEnd(world.days.map((d) => isDone(prog, d.id)));

  const svgs = Object.entries(geo).map(([k, g]) =>
    svg(
      'svg',
      { class: `trail-svg trail-${k}`, viewBox: `0 0 ${g.cols * 100} ${g.rows * 100}`, preserveAspectRatio: 'none', 'aria-hidden': 'true', focusable: 'false' },
      svg('path', { class: 'trail-track', d: pathD(g.pts, n - 1) }),
      ...(streak >= 1 ? [svg('path', { class: 'trail-done', 'data-draw': '', pathLength: 1, d: pathD(g.pts, streak) })] : []),
    ),
  );
  const dirs = Object.entries(geo).flatMap(([k, g]) =>
    rowArrows(g, streak).map((a) =>
      h(
        'span',
        { class: `dir dir-${k}${a.back ? ' is-back' : ''}${a.done ? ' is-done' : ''}`, style: `left:${a.x.toFixed(3)}%;top:${a.y.toFixed(3)}%` },
        px('arrow'),
      ),
    ),
  );
  const heights = Object.entries(LAYOUTS)
    .map(([k, L]) => `--h-${k}:${geo[k].rows * L.rowH}px`)
    .join(';');

  return h(
    'section',
    { class: 'map', 'data-testid': 'world-map', 'data-reveal': true, 'aria-labelledby': 'map-h' },
    h(
      'div',
      { class: 'card map-card' },
      h(
        'div',
        { class: 'map-head' },
        h('h2', { class: 'map-name', id: 'map-h' }, h('span', { class: 'badge' }, px(worldEmblem(world), { cls: 'emblem', scale: 3 })), world.title),
        h('p', { class: 'map-count' }, h('span', { class: 'num' }, `${doneCount(prog, world)} / ${n}`), ' Day 완료'),
      ),
      legend(world, states),
      h(
        'div',
        { class: 'trail-wrap' },
        svgs, // 경로 그림은 목록(ol) 밖, 칸보다 먼저 둔다(칸이 위에 그려진다)
        h(
          'ol',
          { class: 'trail', style: heights, 'aria-label': `${world.title} Day ${n}개` },
          world.days.map((d, i) => tile(d, i, states[i], geo)),
        ),
        h('div', { class: 'trail-dirs', 'aria-hidden': 'true' }, dirs),
      ),
    ),
  );
}
