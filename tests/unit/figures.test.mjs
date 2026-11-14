// 그림 틀 공용 부품(views/figure.js): 단계 문구, 선택 이름, 그림 붙이기와 실패 시 대체 설명
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { choiceName, mountFigures, stepView } from '../../textbook/src/app/views/figure.js';

test('stepView labels, button text and next step', () => {
  assert.deepEqual(stepView(1, 4), { label: '단계 1/4', button: '▶ 다음 단계', next: 2 });
  assert.deepEqual(stepView(4, 4), { label: '단계 4/4', button: '↺ 처음부터', next: 1 });
});

test('choiceName is unique per figure and key', () => {
  assert.equal(choiceName('p1-d11-fig1', 'justify'), 'p1-d11-fig1-justify');
});

/** DOM 없는 Node 에서 쓰는 가짜 figure */
function fakeFigure(id) {
  const classes = new Set();
  return { dataset: { figure: id }, innerHTML: `<p>${id}</p>`, classList: { add: (c) => classes.add(c), has: (c) => classes.has(c) } };
}

test('mountFigures mounts known figures and keeps the fallback when one throws', () => {
  const ok = fakeFigure('ok');
  const bad = fakeFigure('bad');
  const unknown = fakeFigure('nope');
  const root = { querySelectorAll: (sel) => (assert.equal(sel, 'figure.figure[data-figure]'), [ok, bad, unknown]) };
  const calls = [];
  let disposed = 0;
  const figures = {
    ok: (fig, opts) => {
      calls.push([fig, opts]);
      fig.innerHTML = '<svg></svg>';
      return () => disposed++;
    },
    bad: (fig) => {
      fig.innerHTML = '반쯤 그림';
      throw new Error('x');
    },
  };
  const dispose = mountFigures(root, figures, { reduce: false });
  assert.deepEqual(calls, [[ok, { reducedMotion: false }]]);
  assert.equal(ok.innerHTML, '<svg></svg>');
  assert.equal(ok.classList.has('is-fallback'), false);
  assert.equal(bad.innerHTML, '<p>bad</p>');
  assert.equal(bad.classList.has('is-fallback'), true);
  assert.equal(unknown.classList.has('is-fallback'), true);
  dispose();
  assert.equal(disposed, 1);
});
