// Day 1 그림: 주소를 입력한 뒤 화면이 보이기까지 (단계 그림, DESIGN.md "그림 틀").
// 나 | 브라우저 | 서버 세 줄기 사이를 요청·응답 화살표가 오간다. 지금 단계에서 움직이는 쪽 상자를 강조한다.
import { svg } from '../app/views/common.js';
import { arrow, stepFigure } from '../app/views/figure.js';

export const STEPS = [
  '나: 주소(URL)를 입력하면 브라우저가 서버에 "이 페이지 주세요"라고 요청해요.',
  '서버: 요청받은 HTML 파일(hello.html)을 보내요.',
  '브라우저: 받은 HTML을 읽고 화면에 그려요.',
  '나: 웹페이지를 봐요.',
];

const ACTORS = [
  { key: 'me', name: '나', x: 44 },
  { key: 'browser', name: '브라우저', x: 160 },
  { key: 'server', name: '서버', x: 276 },
];
/** 단계마다 움직이는 쪽 */
const HOT = ['me', 'server', 'browser', 'me'];
const [ME, BROWSER, SERVER] = ACTORS.map((a) => a.x);

const text = (x, y, words, cls) => svg('text', { class: cls, x, y, 'text-anchor': 'middle' }, words);

function actor(a) {
  const box = { x: a.x - 40, y: 4, width: 80, height: 36 };
  return svg(
    'g',
    { 'data-actor': a.key },
    svg('path', { class: 'fig-life', d: `M${a.x} 40V196` }),
    svg('rect', { class: 'fig-box', ...box }),
    HOT.map((key, i) => key === a.key && svg('rect', { class: 'fig-box is-hot', ...box, 'data-step-only': i + 1 })),
    text(a.x, 27, a.name, 'fig-name'),
  );
}

function draw() {
  return svg(
    'svg',
    { viewBox: '0 0 320 200', 'aria-hidden': 'true', focusable: 'false' },
    ACTORS.map(actor),
    svg('g', { 'data-step': 1 }, arrow(ME, 72, BROWSER, 72), text(102, 64, 'URL'), arrow(BROWSER, 72, SERVER, 72), text(218, 64, '이 페이지 주세요')),
    svg('g', { 'data-step': 2 }, arrow(SERVER, 112, BROWSER, 112), text(218, 104, 'hello.html', 'fig-code')),
    svg(
      'g',
      { 'data-step': 3 },
      svg('rect', { class: 'fig-box', x: 132, y: 124, width: 56, height: 44 }),
      svg('path', { class: 'fig-page', d: 'M142 136H178M142 146H168M142 156H174' }),
    ),
    svg('g', { 'data-step': 4 }, arrow(BROWSER, 186, ME, 186), text(102, 178, '웹페이지')),
  );
}

export function mount(fig, { reducedMotion }) {
  fig.querySelector('.figure-art').replaceChildren(draw());
  return stepFigure(fig, { steps: STEPS, reducedMotion });
}
