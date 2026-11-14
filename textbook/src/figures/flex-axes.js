// Day 11 그림: Flexbox 주축·교차축과 정렬 (값 고르기 그림, DESIGN.md "그림 틀").
// 그림은 실제 Flexbox 다: 고른 값을 부모 상자의 style 에 넣어 자식 셋이 그대로 움직인다.
import { h } from '../app/views/common.js';
import { choiceGroup } from '../app/views/figure.js';

/** 방향에 따른 주축·교차축 */
export const flexAxes = (direction) => (direction === 'column' ? { main: '세로', cross: '가로' } : { main: '가로', cross: '세로' });

/** 부모 규칙(결과 줄에 보이는 CSS) */
export const flexCss = ({ direction, justify, align }) =>
  `display: flex; flex-direction: ${direction}; justify-content: ${justify}; align-items: ${align};`;

const GROUPS = [
  { key: 'direction', legend: 'flex-direction', values: ['row', 'column'] },
  { key: 'justify', legend: 'justify-content', values: ['flex-start', 'center', 'space-between', 'flex-end'] },
  { key: 'align', legend: 'align-items', values: ['stretch', 'flex-start', 'center', 'flex-end'] },
];
const CHILDREN = ['로고', '메뉴', '버튼'];

/** 축 글자: 가로 축은 부모 위, 세로 축은 부모 옆. 주축이 어느 쪽인지에 따라 이름이 바뀐다 */
function axisText(direction) {
  const { main } = flexAxes(direction);
  return {
    across: `${main === '가로' ? '주축' : '교차축'} (가로) →`,
    down: `${main === '세로' ? '주축' : '교차축'} (세로) ↓`,
  };
}

export function mount(fig) {
  const value = { direction: 'row', justify: 'flex-start', align: 'stretch' };
  const across = h('p', { class: 'flex-axis is-across' });
  const down = h('p', { class: 'flex-axis is-down' });
  const demo = h('div', { class: 'flex-demo' }, CHILDREN.map((name) => h('span', { class: 'flex-item' }, name)));
  const out = h('div', { class: 'figure-out', 'aria-live': 'polite' });
  const render = () => {
    demo.style.flexDirection = value.direction;
    demo.style.justifyContent = value.justify;
    demo.style.alignItems = value.align;
    const axis = axisText(value.direction);
    across.textContent = axis.across;
    down.textContent = axis.down;
    out.replaceChildren(h('p', null, h('code', null, `.flex-demo { ${flexCss(value)} }`)));
  };
  fig.querySelector('.figure-art').replaceChildren(h('div', { class: 'flex-figure' }, across, demo, down));
  fig.querySelector('.figure-stage').append(
    ...GROUPS.map((g) =>
      choiceGroup(fig, {
        key: g.key,
        legend: g.legend,
        options: g.values.map((v) => ({ value: v, label: v })),
        value: value[g.key],
        onChange: (v) => {
          value[g.key] = v;
          render();
        },
      }),
    ),
    out,
  );
  render();
  return () => {};
}
