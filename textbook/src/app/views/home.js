// 홈: 1행(퀘스트 카드 + 레벨 패널), 월드맵, 다른 월드, 부록 바로가기.
import { levelOf, totalXp } from '../level.js';
import { onceInSession, stagger, tilt, xpFill } from '../motion.js';
import { isUnlocked } from '../progress.js';
import { h, notice as noticeLine } from './common.js';
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
  const others = otherWorlds(ctx);
  root.append(
    h(
      'div',
      { class: 'home' },
      h('h1', { class: 'sr-only' }, '홈'),
      noticeEl,
      h('div', { class: 'top-row' }, quest, levelPanel(ctx)),
      worldMap(ctx),
      others.el,
      cur.pages.length > 0 &&
        h(
          'section',
          { class: 'appendix', 'data-reveal': true },
          h('h2', null, '부록'),
          h(
            'ul',
            { class: 'link-grid' },
            cur.pages.map((page) => {
              const open = isUnlocked(cur, ctx.prog, page.requires);
              return h('li', null, h('a', { href: `#/page/${page.id}` }, open ? page.title : `🔒 ${page.title}`));
            }),
          ),
        ),
    ),
  );
  ctx.onCleanup(tilt(quest, 2)); // DESIGN.md Motion: 퀘스트 카드 Tilt 2°
  ctx.onCleanup(others.mount()); // 월드 카드 Tilt 4°·Reveal·캐러셀
  if (onceInSession('home')) stagger(root.querySelectorAll('[data-reveal]')); // DESIGN.md Motion: 홈 구역 첫 표시, 세션에 한 번
  // DESIGN.md Motion: XP 막대는 세션에 한 번 왼쪽에서 채운다(홈 Stagger 와 따로 센다). 0 이면 채울 것이 없다
  if (levelOf(totalXp(cur, ctx.prog)).inLevel > 0 && onceInSession('xp')) xpFill(root.querySelector('[data-xp-fill]'));
  return '홈';
}
