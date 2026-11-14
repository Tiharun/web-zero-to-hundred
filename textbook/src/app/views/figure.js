// 그림 틀 공용 부품 (DESIGN.md Components "Day 부품" 그림 틀).
// 빌드가 :::figure 블록을 <figure class="figure" data-figure="id"> 틀로 만들고, 앱이 등록된 그림을 그 안에 붙인다.
// 그림 모듈(src/figures/*)이 이 파일을 import 하므로 여기서는 등록표(src/figures/index.js)를 import 하지 않는다(순환 방지).
// 빌드가 Node 에서 그림 모듈을 import 하므로 최상위에서 document·window 를 쓰지 않는다.
import { motionEnv, rise, strokeIn } from '../motion.js';
import { h } from './common.js';

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
      if (!forward || !on || !wasOff) continue;
      const anim = el.classList.contains('fig-line') ? strokeIn(el, env) : rise(el, env);
      if (anim) running.push(anim);
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
