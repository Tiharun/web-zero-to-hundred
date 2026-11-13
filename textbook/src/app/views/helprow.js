// 홈 "막혔을 때": 도움 페이지 바로가기 칸. DESIGN.md Cards "막혔을 때 칸", Layout(.main 30rem 2칸, 56rem 4칸).
// 순서는 고정(help → troubleshooting → glossary → start)이고 교재에 있는 페이지만 보인다. 설명의 개수는 빌드가 센 값이다.
import { isUnlocked } from '../progress.js';
import { getPage, h } from './common.js';
import { pageArt, px } from './icons.js';

const ORDER = ['help', 'troubleshooting', 'glossary', 'start'];

/** 막혔을 때 구역. 해당 페이지가 하나도 없으면 null */
export function helpRow(ctx) {
  const { cur, prog } = ctx;
  const items = ORDER.map((id) => [getPage(cur, id), pageArt(id)]).filter(([page]) => page);
  if (items.length === 0) return null;

  return h(
    'section',
    { class: 'help', 'data-testid': 'help-row', 'data-reveal': true, 'aria-labelledby': 'help-h' },
    h('h2', { class: 'section-title', id: 'help-h' }, '막혔을 때'),
    h(
      'ul',
      { class: 'help-list' },
      items.map(([page, art]) => {
        const locked = !isUnlocked(cur, prog, page.requires);
        return h(
          'li',
          null,
          h(
            'a',
            { class: 'help-link', href: `#/page/${page.id}`, dataset: { page: page.id } },
            px(art, { cls: 'help-icon', scale: 3 }),
            h(
              'span',
              { class: 'help-text' },
              h('span', { class: 'help-title' }, page.title, locked && [px('lock'), h('span', { class: 'sr-only' }, '잠김')]),
              page.meta && h('span', { class: 'help-meta' }, page.meta),
            ),
          ),
        );
      }),
    ),
  );
}
