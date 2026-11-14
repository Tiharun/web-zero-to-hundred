// 그림 틀 공용 부품 (DESIGN.md Components "Day 부품" 그림 틀).
// 빌드가 :::figure 블록을 <figure class="figure" data-figure="id"> 틀로 만들고, 앱이 등록된 그림을 그 안에 붙인다.
// 그림 모듈(src/figures/*)이 이 파일을 import 하므로 여기서는 등록표(src/figures/index.js)를 import 하지 않는다(순환 방지).
// 빌드가 Node 에서 그림 모듈을 import 하므로 최상위에서 document·window 를 쓰지 않는다.
import { motionEnv, rise, strokeIn } from '../motion.js';
import { h, svg } from './common.js';

/** 단계 줄의 Label, 단계 버튼 글자, 버튼을 누르면 갈 단계 */
export function stepView(step, total) {
  const last = step >= total;
  return { label: `단계 ${step}/${total}`, button: last ? '↺ 처음부터' : '▶ 다음 단계', next: last ? 1 : step + 1 };
}

/** 값 고르기 그림의 라디오 name: 한 페이지에 같은 그림이 둘 있어도 겹치지 않게 그림 id(빌드가 붙인 fig 번호)를 쓴다 */
export const choiceName = (figId, key) => `${figId}-${key}`;

/**
 * root 안의 그림 틀마다 등록된 그림을 붙인다.
 * 등록되지 않은 id 이거나 붙이다 예외가 나면 빌드가 넣은 대체 설명으로 되돌리고 is-fallback 을 단다(콘솔에는 쓰지 않는다).
 * @param {ParentNode} root
 * @param {Record<string, (fig: HTMLElement, opts: { reducedMotion: boolean }) => (() => void) | void>} figures 등록표
 * @returns {() => void} 붙인 그림들을 정리한다
 */
export function mountFigures(root, figures, env = motionEnv()) {
  const disposers = [];
  for (const fig of root.querySelectorAll('figure.figure[data-figure]')) {
    const id = fig.dataset.figure;
    const mount = Object.hasOwn(figures, id) ? figures[id] : null;
    const before = fig.innerHTML; // 빌드가 escape 해 넣은 틀 그대로다
    try {
      if (typeof mount !== 'function') throw new Error(`unknown figure: ${id}`);
      const dispose = mount(fig, { reducedMotion: env.reduce });
      if (typeof dispose === 'function') disposers.push(dispose);
    } catch {
      fig.innerHTML = before;
      fig.classList.add('is-fallback');
    }
  }
  return () => disposers.splice(0).forEach((dispose) => dispose());
}

/**
 * 단계 그림 (DESIGN.md "그림 틀" 단계 그림, Motion "그림 단계").
 * fig 안의 [data-step="n"] 은 n 단계부터 계속, [data-step-only="n"] 은 n 단계에서만 보인다(꺼진 요소는 is-off).
 * 무대 끝에 단계 줄, figcaption 앞에 단계 버튼을 둔다. 처음은 1단계, 동작 줄이기면 마지막 단계에서 시작한다.
 * @param {HTMLElement} fig
 * @param {{ steps: string[], reducedMotion: boolean }} opts steps: 단계마다 단계 줄에 보일 문장
 * @returns {() => void}
 */
export function stepFigure(fig, { steps, reducedMotion }) {
  const env = { reduce: reducedMotion };
  const total = steps.length;
  const items = [...fig.querySelectorAll('[data-step], [data-step-only]')];
  const label = h('span', { class: 'label' });
  const text = h('span');
  const line = h('p', { class: 'figure-step', 'aria-live': 'polite' }, label, text);
  const button = h('button', { class: 'btn figure-next', type: 'button' });
  fig.querySelector('.figure-stage').append(line);
  fig.insertBefore(button, fig.querySelector('figcaption')); // figcaption 은 figure 의 마지막 자식으로 둔다
  let step = reducedMotion ? total : 1;
  let running = [];

  const isOn = (el, n) => (el.dataset.stepOnly ? Number(el.dataset.stepOnly) === n : Number(el.dataset.step) <= n);
  function show(n, forward) {
    running.forEach((a) => a.cancel());
    running = [];
    for (const el of items) {
      const on = isOn(el, n);
      const wasOff = el.classList.contains('is-off');
      el.classList.toggle('is-off', !on);
      if (forward && on && wasOff) running.push(...enter(el, env));
    }
    const view = stepView(n, total);
    label.textContent = view.label;
    text.textContent = steps[n - 1];
    button.textContent = view.button;
    step = n;
  }
  const onClick = () => {
    const { next } = stepView(step, total);
    show(next, next > step);
  };
  show(step, false);
  button.addEventListener('click', onClick);
  return () => {
    button.removeEventListener('click', onClick);
    running.forEach((a) => a.cancel());
  };
}

/**
 * 새로 보이는 요소의 움직임: 선(.fig-line)은 그리고, 선을 품은 묶음은 선을 그리며 나머지 자식을 올리고, 그 밖은 올린다
 * @returns {Animation[]}
 */
function enter(el, env) {
  if (el.classList.contains('fig-line')) return [strokeIn(el, env)].filter(Boolean);
  const lines = [...el.querySelectorAll('.fig-line')];
  if (!lines.length) return [rise(el, env)].filter(Boolean);
  return [...lines.map((l) => strokeIn(l, env)), ...lineFree(el).map((c) => rise(c, env))].filter(Boolean);
}

/** 선이 없는 가장 큰 하위 묶음들 (화살표 머리, 글자 등): 겹쳐 두 번 움직이지 않게 */
function lineFree(el) {
  return [...el.children].flatMap((c) => {
    if (c.classList.contains('fig-line')) return [];
    return c.querySelector('.fig-line') ? lineFree(c) : [c];
  });
}

const HEAD = 8;

/**
 * 화살표: (x1, y1) 에서 (x2, y2) 로 가는 직선과 끝의 삼각형 머리. 선은 머리 밑동에서 멈춘다.
 * 선은 pathLength="1" 이라 strokeIn 으로 그릴 수 있다.
 */
export function arrow(x1, y1, x2, y2) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const [ux, uy] = [(x2 - x1) / len, (y2 - y1) / len];
  const r = (n) => Math.round(n * 10) / 10;
  const [bx, by] = [x2 - ux * HEAD, y2 - uy * HEAD];
  const [px, py] = [-uy * (HEAD / 2), ux * (HEAD / 2)];
  return svg(
    'g',
    { class: 'fig-arrow' },
    svg('path', { class: 'fig-line', pathLength: 1, d: `M${r(x1)} ${r(y1)}L${r(bx)} ${r(by)}` }),
    svg('path', { class: 'fig-head', d: `M${r(x2)} ${r(y2)}L${r(bx + px)} ${r(by + py)}L${r(bx - px)} ${r(by - py)}Z` }),
  );
}

/**
 * 값 고르기 그림의 선택 묶음 (DESIGN.md "그림 틀" 값 고르기 그림). 묶음은 한 번만 만들고 다시 그리지 않는다.
 * 놓을 자리는 부르는 쪽이 정한다(무대 안, 그림 아래).
 * @param {HTMLElement} fig
 * @param {{ key: string, legend: string, options: { value: string, label: string }[], value: string, onChange: (value: string) => void }} opts
 * @returns {HTMLFieldSetElement}
 */
export function choiceGroup(fig, { key, legend, options, value, onChange }) {
  const name = choiceName(fig.id, key);
  const set = h(
    'fieldset',
    { class: 'figure-choice' },
    h('legend', { class: 'label' }, legend),
    h(
      'div',
      { class: 'figure-options' },
      options.map((o) => h('label', { class: 'radio' }, h('input', { type: 'radio', name, value: o.value, checked: o.value === value }), h('code', null, o.label))),
    ),
  );
  set.addEventListener('change', (e) => {
    if (e.target.name === name) onChange(e.target.value);
  });
  return set;
}
