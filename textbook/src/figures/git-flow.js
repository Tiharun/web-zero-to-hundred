// Day 7 그림: 고친 파일이 GitHub에 올라가기까지 (단계 그림, DESIGN.md "그림 틀").
// 위에서 아래로 칸 넷. 파일·커밋 표시가 단계마다 아래 칸으로 내려가고, 지금 단계의 칸을 강조한다.
import { svg } from '../app/views/common.js';
import { arrow, stepFigure } from '../app/views/figure.js';

export const STEPS = [
  '파일을 고쳤어요. 아직 작업 폴더에만 있어요.',
  'git add: 다음 커밋에 넣을 변경을 스테이징에 올려 둬요.',
  'git commit: 올려 둔 변경을 메시지와 함께 기록 하나로 남겨요.',
  'git push: 내 컴퓨터의 커밋을 GitHub로 올려 보내요.',
];

const CELL_H = 56;
const CELLS = [
  { key: 'work', name: '작업 폴더', y: 4, item: { cls: 'fig-file', label: 'index.html', code: true, attr: { 'data-step-only': 1 } } },
  { key: 'stage', name: '스테이징', y: 82, item: { cls: 'fig-file', label: 'index.html', code: true, attr: { 'data-step-only': 2 } } },
  { key: 'history', name: '내 컴퓨터의 기록', y: 160, item: { cls: 'fig-commit', label: '커밋', attr: { 'data-step': 3 } } },
  { key: 'github', name: 'GitHub (인터넷)', y: 238, item: { cls: 'fig-commit', label: '커밋', attr: { 'data-step': 4 } } },
];
const COMMANDS = ['git add', 'git commit', 'git push'];

function cell(c, i) {
  const box = { x: 4, y: c.y, width: 312, height: CELL_H };
  const { item } = c;
  return svg(
    'g',
    { 'data-cell': c.key },
    svg('rect', { class: 'fig-box', ...box }),
    svg('rect', { class: 'fig-box is-hot', ...box, 'data-step-only': i + 1 }),
    svg('text', { class: 'fig-name', x: 16, y: c.y + 33 }, c.name),
    svg(
      'g',
      { class: item.cls, ...item.attr },
      svg('rect', { class: 'fig-box', x: 212, y: c.y + 14, width: 92, height: 28 }),
      svg('text', { class: item.code ? 'fig-code' : null, x: 258, y: c.y + 33, 'text-anchor': 'middle' }, item.label),
    ),
  );
}

function command(name, i) {
  const top = CELLS[i].y + CELL_H + 1;
  const bottom = CELLS[i + 1].y - 1;
  return svg('g', { 'data-step': i + 2 }, arrow(48, top, 48, bottom), svg('text', { class: 'fig-code', x: 62, y: (top + bottom) / 2 + 5 }, name));
}

function draw() {
  return svg('svg', { viewBox: '0 0 320 300', 'aria-hidden': 'true', focusable: 'false' }, CELLS.map(cell), COMMANDS.map(command));
}

export function mount(fig, { reducedMotion }) {
  fig.querySelector('.figure-art').replaceChildren(draw());
  return stepFigure(fig, { steps: STEPS, reducedMotion });
}
