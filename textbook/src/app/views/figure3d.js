// 3D 층 그림 틀 (DESIGN.md Components "그림 틀" 3D 그림(G4), Motion "3D 시점").
// 평면 위 네모(층)를 깊이만큼 띄운 판으로 그린다. 끌기·시점 버튼으로 돌리고, 저절로 돌지 않는다(바뀔 때만 그린다).
// WebGL 2 가 없거나 엔진·장면이 실패하면 같은 층을 비스듬히 그린 정적 SVG 와 대체 설명을 보인다.
// 빌드가 Node 에서 그림 모듈을 import 하므로 최상위에서 document·window 를 쓰지 않는다.
import { ENTER_MS } from '../motion.js';
import { loadThree, webgl2Context } from '../three.js';
import { HOME_VIEW, LAYER_GAP, OBLIQUE, PLANE, SLAB, cameraPosition, dragView, turnView, tweenView } from '../view3d.js';
import { h, svg } from './common.js';
import { skeletonGate } from './skeleton.js';

const FOV = 35;
const DISTANCE = 520;
const MAX_DPR = 2;
/** 이름표 안에서 코드 글꼴로 쓰는 부분(영문 이름·태그) */
const CODE_PART = /([A-Za-z<>/][A-Za-z0-9<>/#.-]*)/;

/** 이름표 글을 [글, 코드인가] 조각으로 나눈다. code 가 아닌 층은 통째로 글 */
function labelParts(layer) {
  if (!layer.code) return [[layer.label, false]];
  return layer.label
    .split(CODE_PART) // 홀수 칸이 잡힌 코드 조각이다
    .map((part, i) => [part, i % 2 === 1])
    .filter(([part]) => part);
}

/** 깊이 오름차순(같은 깊이는 원래 순서) */
const byDepth = (layers) => [...layers].sort((a, b) => a.depth - b.depth);

/**
 * 정적 그림(G1): 깊이마다 OBLIQUE 만큼 민 네모. ghost 는 면 없는 점선.
 * @param {{ id: string, label: string, depth: number, x: number, y: number, w: number, h: number, code?: boolean, ghost?: boolean }[]} layers
 * @returns {SVGSVGElement}
 */
export function obliqueSvg(layers) {
  const deepest = Math.max(0, ...layers.map((l) => l.depth));
  const ox = deepest * OBLIQUE.dx;
  const oy = deepest * OBLIQUE.dy;
  const viewBox = [Math.min(0, ox), Math.min(0, oy), PLANE.w + Math.abs(ox), PLANE.h + Math.abs(oy)].join(' ');
  return svg(
    'svg',
    { class: 'fig3d-static', viewBox, 'aria-hidden': 'true', focusable: 'false' },
    byDepth(layers).map((l) => {
      const x = l.x + l.depth * OBLIQUE.dx;
      const y = l.y + l.depth * OBLIQUE.dy;
      return [
        svg('rect', { class: l.ghost ? 'fig-ghost' : 'fig-box', x, y, width: l.w, height: l.h }),
        svg(
          'text',
          { x: x + 6, y: y + 17, class: 'fig-name' },
          labelParts(l).map(([text, code]) => svg('tspan', { class: code ? 'fig-code' : null }, text)),
        ),
      ];
    }),
  );
}

const nextFrame = (win) => new Promise((resolve) => win.requestAnimationFrame(() => resolve()));

/**
 * 3D 층 그림을 빌드가 만든 틀(fig) 안에 붙인다. 그림이 화면 근처(200px)에 오면 엔진을 꺼내 장면을 만든다.
 * .fig3d[data-state]: wait → loading → ready | static. ready 에서 data-yaw·data-pitch 는 반올림한 지금 시점이다.
 * @param {HTMLElement} fig
 * @param {{ layers: object[], reducedMotion?: boolean, load?: (doc: Document) => Promise<object | null>, IO?: typeof IntersectionObserver }} opts
 * @returns {() => void} dispose
 */
export function layerFigure(fig, { layers, reducedMotion = false, load = loadThree, IO = globalThis.IntersectionObserver }) {
  const doc = fig.ownerDocument;
  const win = doc.defaultView;
  const art = fig.querySelector('.figure-art');
  const alt = art.getAttribute('aria-label') ?? '';

  const labels = layers.map((l) =>
    h('span', { class: 'fig3d-label' }, labelParts(l).map(([text, code]) => (code ? h('span', { class: 'fig3d-code' }, text) : text))),
  );
  const labelBox = h('div', { class: 'fig3d-labels', 'aria-hidden': 'true' }, labels);
  const box = h('div', { class: 'fig3d', dataset: { state: 'wait' } }, labelBox, obliqueSvg(layers));
  const skeleton = h('div', { class: 'skeleton-block', 'aria-hidden': 'true' });
  const desc = h('p', { class: 'figure-fallback fig3d-desc', 'aria-hidden': 'true', hidden: true }, alt);
  const views = h(
    'div',
    { class: 'figure-views', role: 'group', 'aria-label': '시점 바꾸기', hidden: true },
    h('button', { class: 'btn', type: 'button', onClick: () => goTo(turnView(aim(), 1)) }, '← 왼쪽으로'),
    h('button', { class: 'btn', type: 'button', onClick: () => goTo(turnView(aim(), -1)) }, '오른쪽으로 →'),
    h('button', { class: 'btn', type: 'button', onClick: () => goTo({ ...HOME_VIEW }) }, '↺ 처음 시점'),
  );
  art.replaceChildren(box);
  art.after(desc, views);

  let disposed = false;
  let io = null;
  let gate = null;
  let canvas = null;
  let gl = null;
  let three = null; // { T, renderer, scene, camera, mats, geos, anchor }
  let ro = null;
  let view = { ...HOME_VIEW };
  let target = null; // 보간 중인 목표 시점
  let tween = 0;
  let drag = null;
  const media = win.matchMedia?.('(prefers-color-scheme: dark)');
  const themeWatch = new win.MutationObserver(() => repaint());
  themeWatch.observe(doc.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  media?.addEventListener('change', repaint);

  const setState = (s) => {
    box.dataset.state = s;
  };
  const aim = () => target ?? view;

  function zOf(layer, deepest) {
    return (layer.depth - deepest / 2) * LAYER_GAP;
  }

  function colors() {
    const cs = win.getComputedStyle(fig);
    const read = (name) => new three.T.Color(cs.getPropertyValue(name).trim());
    return { paper: read('--color-paper'), card: read('--color-card'), ink: read('--color-ink'), ink2: read('--color-ink-2') };
  }

  function paint() {
    const c = colors();
    three.scene.background = c.paper;
    three.mats.face.color = c.card;
    three.mats.line.color = c.ink;
    three.mats.ghost.color = c.ink2;
  }

  function repaint() {
    if (!three) return;
    paint();
    render();
  }

  function buildScene(T) {
    const renderer = new T.WebGLRenderer({ canvas, context: gl, antialias: true });
    renderer.setPixelRatio(Math.min(win.devicePixelRatio || 1, MAX_DPR));
    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(FOV, 4 / 3, 1, DISTANCE * 4);
    const mats = {
      face: new T.MeshBasicMaterial({ polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }),
      line: new T.LineBasicMaterial(),
      ghost: new T.LineDashedMaterial({ dashSize: 6, gapSize: 4 }),
    };
    const geos = [];
    const deepest = Math.max(0, ...layers.map((l) => l.depth));
    for (const l of layers) {
      const slab = new T.BoxGeometry(l.w, l.h, SLAB);
      const edges = new T.EdgesGeometry(slab);
      geos.push(slab, edges);
      const group = new T.Group();
      group.position.set(l.x + l.w / 2 - PLANE.w / 2, PLANE.h / 2 - (l.y + l.h / 2), zOf(l, deepest));
      if (!l.ghost) group.add(new T.Mesh(slab, mats.face));
      const outline = new T.LineSegments(edges, l.ghost ? mats.ghost : mats.line);
      if (l.ghost) outline.computeLineDistances();
      group.add(outline);
      scene.add(group);
    }
    // 이름표가 붙는 점: 판 앞면의 왼쪽 위 모서리
    const anchor = layers.map((l) => new T.Vector3(l.x - PLANE.w / 2, PLANE.h / 2 - l.y, zOf(l, deepest) + SLAB / 2));
    three = { T, renderer, scene, camera, mats, geos, anchor, point: new T.Vector3() };
    paint();
  }

  function resize() {
    const w = canvas.clientWidth;
    const hgt = canvas.clientHeight;
    if (!w || !hgt) return;
    three.renderer.setSize(w, hgt, false);
    three.camera.aspect = w / hgt;
    three.camera.updateProjectionMatrix();
  }

  function render() {
    if (!three) return;
    const { renderer, scene, camera, anchor, point } = three;
    const p = cameraPosition(view, DISTANCE);
    camera.position.set(p.x, p.y, p.z);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
    renderer.render(scene, camera);
    const w = canvas.clientWidth;
    const hgt = canvas.clientHeight;
    anchor.forEach((a, i) => {
      point.copy(a).project(camera);
      labels[i].style.transform = `translate(${Math.round(((point.x + 1) / 2) * w)}px, ${Math.round(((1 - point.y) / 2) * hgt)}px)`;
    });
    box.dataset.yaw = String(Math.round(view.yaw));
    box.dataset.pitch = String(Math.round(view.pitch));
  }

  function stopTween() {
    if (tween) win.cancelAnimationFrame(tween);
    tween = 0;
    target = null;
  }

  function goTo(next) {
    stopTween();
    if (reducedMotion) {
      view = next;
      render();
      return;
    }
    const from = view;
    const t0 = win.performance.now();
    target = next;
    const step = (now) => {
      const t = (now - t0) / ENTER_MS;
      view = tweenView(from, next, t);
      render();
      if (t >= 1) {
        tween = 0;
        target = null;
      } else tween = win.requestAnimationFrame(step);
    };
    tween = win.requestAnimationFrame(step);
  }

  function onDown(e) {
    if (e.button !== 0 || box.dataset.state !== 'ready') return;
    stopTween();
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY };
    canvas.setPointerCapture(e.pointerId);
    box.classList.add('is-dragging');
  }
  function onMove(e) {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    drag.x = e.clientX;
    drag.y = e.clientY;
    view = dragView(view, -dx, dy); // 끈 쪽으로 물체가 돈다: 카메라는 반대로 돈다
    render();
  }
  function onUp(e) {
    if (!drag || e.pointerId !== drag.id) return;
    drag = null;
    box.classList.remove('is-dragging');
  }
  const onLost = () => toStatic();

  /** 캔버스·장면·관찰자를 모두 정리한다(상태는 바꾸지 않는다) */
  function teardown() {
    stopTween();
    gate?.cancel();
    gate = null;
    ro?.disconnect();
    ro = null;
    if (canvas) {
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
    }
    if (three) {
      three.geos.forEach((g) => g.dispose());
      Object.values(three.mats).forEach((m) => m.dispose());
      three.renderer.dispose();
      three = null;
    }
    if (gl && !gl.isContextLost()) gl.getExtension('WEBGL_lose_context')?.loseContext();
    gl = null;
    canvas?.remove();
    canvas = null;
    drag = null;
  }

  function toStatic() {
    if (disposed) return;
    teardown();
    art.removeAttribute('aria-busy');
    views.hidden = true;
    desc.hidden = false;
    setState('static');
  }

  async function start() {
    setState('loading');
    art.setAttribute('aria-busy', 'true');
    gate = skeletonGate({ show: () => box.append(skeleton), hide: () => skeleton.remove() });
    try {
      canvas = h('canvas', { 'aria-hidden': 'true' });
      gl = webgl2Context(canvas);
      if (!gl) return toStatic();
      canvas.addEventListener('webglcontextlost', onLost);
      const T = await load(doc);
      if (disposed || !canvas) return; // 기다리는 동안 정리됐거나(컨텍스트를 잃어) 이미 정적 그림이다
      if (!T) return toStatic();
      gate.poll(); // 엔진 실행이 길어 지연 타이머가 못 돌았으면 지금 자리표시를 보인다
      await nextFrame(win);
      if (disposed || !canvas) return;
      box.prepend(canvas);
      buildScene(T);
      resize();
      render();
      ro = new win.ResizeObserver(() => {
        if (!three) return;
        resize();
        render();
      });
      ro.observe(box);
      canvas.addEventListener('pointerdown', onDown);
      canvas.addEventListener('pointermove', onMove);
      canvas.addEventListener('pointerup', onUp);
      canvas.addEventListener('pointercancel', onUp);
      gate.finish(() => {
        if (!three) return;
        art.removeAttribute('aria-busy');
        views.hidden = false;
        setState('ready');
        render(); // 이름표가 보이게 된 뒤 자리를 다시 잡는다
      });
    } catch {
      toStatic();
    }
  }

  if (typeof IO === 'function') {
    io = new IO(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        io = null;
        start();
      },
      { rootMargin: '200px 0px' },
    );
    io.observe(box);
  } else start();

  return function dispose() {
    if (disposed) return;
    disposed = true;
    io?.disconnect();
    io = null;
    themeWatch.disconnect();
    media?.removeEventListener('change', repaint);
    teardown();
  };
}
