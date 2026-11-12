// 홈: 1행(퀘스트 카드 + 레벨 패널), 월드맵, 다른 월드, 막혔을 때.
import { levelOf, totalXp } from '../level.js';
import { confetti, drawPath, linkHover, onceInSession, pawnHop, seenInSession, stagger, tilt, xpFill } from '../motion.js';
import { questState } from '../progress.js';
import { h, notice as noticeLine } from './common.js';
import { helpRow } from './helprow.js';
import { levelPanel } from './hud.js';
import { questCard } from './quest.js';
import { worldMap } from './worldmap.js';
import { otherWorlds } from './worlds.js';

export function renderHome(ctx, root) {
  const { cur } = ctx;

  const notice = ctx.takeNotice();
  const noticeEl = notice && noticeLine(notice);
  noticeEl?.setAttribute('data-reveal', '');
  const quest = questCard(ctx);
  const map = worldMap(ctx);
  const others = otherWorlds(ctx);
  root.append(
    h(
      'div',
      { class: 'home' },
      h('h1', { class: 'sr-only' }, '홈'),
      noticeEl,
      h('div', { class: 'top-row' }, quest, levelPanel(ctx)),
      map,
      others.el,
      helpRow(ctx),
    ),
  );
  ctx.onCleanup(tilt(quest, 2)); // DESIGN.md Motion: 퀘스트 카드 Tilt 2°
  ctx.onCleanup(others.mount()); // 월드 카드 Tilt 4°·Reveal·캐러셀
  if (onceInSession('home')) stagger(root.querySelectorAll('[data-reveal]')); // DESIGN.md Motion: 홈 구역 첫 표시, 세션에 한 번
  // DESIGN.md Motion: XP 막대는 세션에 한 번 왼쪽에서 채운다(홈 Stagger 와 따로 센다). 0 이면 채울 것이 없다
  if (levelOf(totalXp(cur, ctx.prog)).inLevel > 0 && onceInSession('xp')) xpFill(root.querySelector('[data-xp-fill]'));
  homeMotion(ctx, quest, map);
  return '홈';
}

/** DESIGN.md Motion: 퀘스트-오늘 칸 연결, 말 점프·경로 그리기·클리어 축하(각각 세션에 한 번) */
function homeMotion(ctx, quest, map) {
  const today = map?.querySelector('.node.is-today');
  if (today) ctx.onCleanup(linkHover(quest, today));
  const pawn = map?.querySelector('.pawn');
  if (pawn && onceInSession('pawn')) pawnHop(pawn);
  const done = map?.querySelectorAll('[data-draw]') ?? [];
  // 실제로 그렸을 때만 기록한다: 지도까지 내려오지 않고 떠났으면 다음 방문에 그린다
  if (done.length > 0 && !seenInSession('trail')) {
    ctx.onCleanup(drawPath(done, map.querySelector('.trail'), undefined, undefined, () => onceInSession('trail')));
  }
  const state = questState(ctx.cur, ctx.prog);
  if ((state.kind === 'clear' || state.kind === 'done') && onceInSession(`celebrate:${state.clearedId ?? 'all'}`)) {
    confetti(quest, quest.querySelector('.bignum-value'));
  }
}
