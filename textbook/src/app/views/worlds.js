// 홈 "다른 월드": 지도에 그린 월드를 뺀 월드 카드 + 졸업 카드. 좁으면 Scroll Snap 캐러셀, 넓으면 4칸 격자.
// DESIGN.md Layout "다른 월드", Cards "월드 카드"·"잠긴 월드 카드", Motion(Tilt 4°·Shake·Reveal).
import { motionEnv, reveal, shake, tilt } from '../motion.js';
import { isUnlocked, questState } from '../progress.js';
import { chips, doneCount, getPage, h, lockReason, worldLabel } from './common.js';
import { icon, px, worldEmblem } from './icons.js';
import { showToast } from './toast.js';

const GRAD_ID = 'grad';
const EDGE = 2; // 스크롤 끝 판정 여유(px)

/** 메인 → 특별, 각각 order 순 */
const ordered = (cur) => [...cur.projects].sort((a, b) => (a.track === b.track ? a.order - b.order : a.track === 'main' ? -1 : 1));

/** 졸업 카드 자료. roadmap 페이지가 있으면 그 제목·조건을 쓴다 */
function graduation(cur) {
  const page = getPage(cur, 'roadmap');
  const lastMain = ordered(cur)
    .filter((p) => p.track === 'main')
    .at(-1);
  return {
    id: GRAD_ID,
    title: page?.title ?? '졸업 로드맵',
    outcome: '다음 학습 경로와 4차 프로젝트 후보를 정리한 마지막 안내',
    requires: page?.requires ?? (lastMain ? [lastMain.id] : []),
    written: Boolean(page),
  };
}

/** 월드 카드 하나 */
function worldCard(ctx, world) {
  const { cur, prog } = ctx;
  const isGrad = world.id === GRAD_ID;
  const locked = !isUnlocked(cur, prog, world.requires);
  const total = isGrad ? 0 : world.days.length;
  const done = isGrad ? 0 : doneCount(prog, world);
  const cleared = !isGrad && !locked && done === total;
  const status = locked ? '잠김' : isGrad ? (world.written ? '열림' : '준비 중') : cleared ? '클리어' : done > 0 ? '진행 중' : '열림';
  const reason = lockReason(cur, world.requires) || '아직 열리지 않았어요.';

  const foot = h(
    'p',
    { class: 'wc-foot' },
    locked
      ? [px('lock'), h('span', null, reason)]
      : isGrad
        ? h('span', null, world.written ? '모든 월드를 마친 다음 볼 안내예요.' : '아직 쓰는 중이에요.')
        : h('span', null, h('span', { class: 'num' }, `${done} / ${total}`), ' Day 완료'),
  );

  let hit = null;
  if (locked) {
    hit = h('button', { type: 'button', class: 'card-hit', 'aria-label': `${world.title}, 잠김` });
  } else if (!isGrad || world.written) {
    hit = h('a', { class: 'card-hit', href: isGrad ? '#/page/roadmap' : `#/project/${world.id}`, 'aria-label': `${world.title} 보기` });
  }

  const card = h(
    'li',
    { class: `world-card card is-${locked ? 'locked' : 'open'}${cleared ? ' is-cleared' : ''}`, dataset: { world: world.id } },
    h('h3', { class: 'wc-title' }, h('span', { class: 'badge', dataset: !isGrad && { vt: `world-${world.id}` } }, px(worldEmblem(world), { cls: 'emblem', scale: 3 })), world.title),
    h('p', { class: 'wc-meta label' }, cleared && px('star', { cls: 'star' }), `${isGrad ? '졸업' : worldLabel(world)}, ${status}`),
    world.outcome && h('p', { class: 'wc-outcome' }, world.outcome),
    world.stack?.length > 0 && chips(world.stack),
    foot,
    hit,
  );

  // 잠긴 카드: 이동하지 않고 흔들리며 이유를 알린다. 다시 눌러도 강조가 다시 붙도록 뗐다 붙인다
  if (locked) {
    hit.addEventListener('click', () => {
      shake(card);
      showToast(`‘${world.title}’ 월드는 ${reason}`);
      foot.classList.remove('is-told');
      void foot.offsetWidth;
      foot.classList.add('is-told');
    });
  }
  return card;
}

const LIST_LABEL = '다른 월드 목록';
const LIST_LABEL_SCROLL = '다른 월드 목록, 좌우 화살표로 넘겨요';

/**
 * 캐러셀: 한 장 = 첫 카드 폭 + column-gap. 목록 자신에 포커스가 있을 때만 ←→로 넘긴다.
 * 끝에서는 버튼이 aria-disabled. 넓어서 격자가 되면 스크롤이 없으니 두 버튼 모두 끝 상태다.
 */
export function bindCarousel(list, prev, next, env = motionEnv()) {
  const win = list.ownerDocument.defaultView;
  let frame = 0;
  const sync = () => {
    frame = 0;
    const max = list.scrollWidth - list.clientWidth - EDGE;
    prev.setAttribute('aria-disabled', String(list.scrollLeft <= EDGE));
    next.setAttribute('aria-disabled', String(list.scrollLeft >= max));
    // 넘길 것이 없으면(넓은 격자) 탭 멈춤과 화살표 안내를 뺀다
    const scrolls = max > 0;
    if (scrolls) list.setAttribute('tabindex', '0');
    else list.removeAttribute('tabindex');
    list.setAttribute('aria-label', scrolls ? LIST_LABEL_SCROLL : LIST_LABEL);
  };
  const step = (dir) => {
    const card = list.firstElementChild;
    if (!card) return;
    const gap = parseFloat(win.getComputedStyle(list).columnGap) || 0;
    list.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: env.reduce ? 'auto' : 'smooth' });
  };
  const onButton = (event) => {
    const btn = event.currentTarget;
    if (btn.getAttribute('aria-disabled') !== 'true') step(Number(btn.dataset.carousel));
  };
  // 카드 안 버튼에 포커스가 있을 때 ←→의 기본 동작(가까운 스크롤 상자 밀기)은 포커스한 카드를 화면 밖으로 밀어낸다. 막기만 한다
  const onKey = (event) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return; // 뒤로 가기 등 브라우저·보조 기술의 조합 키
    event.preventDefault();
    if (event.target === list) step(event.key === 'ArrowRight' ? 1 : -1);
  };
  const onScroll = () => {
    if (!frame) frame = win.requestAnimationFrame(sync);
  };
  prev.addEventListener('click', onButton);
  next.addEventListener('click', onButton);
  list.addEventListener('keydown', onKey);
  list.addEventListener('scroll', onScroll, { passive: true });
  const ro = typeof win.ResizeObserver === 'function' ? new win.ResizeObserver(sync) : null;
  ro?.observe(list);
  sync();
  return () => {
    prev.removeEventListener('click', onButton);
    next.removeEventListener('click', onButton);
    list.removeEventListener('keydown', onKey);
    list.removeEventListener('scroll', onScroll);
    ro?.disconnect();
    if (frame) win.cancelAnimationFrame(frame);
  };
}

/** 다른 월드 구역. mount() 는 DOM 에 붙은 뒤 부르고, 정리 함수를 돌려준다 */
export function otherWorlds(ctx) {
  const { cur, prog } = ctx;
  const mapId = questState(cur, prog).worldId;
  const worlds = [...ordered(cur).filter((p) => p.id !== mapId), graduation(cur)];
  const cards = worlds.map((w) => worldCard(ctx, w));

  const prev = h('button', { type: 'button', class: 'icon-btn', 'data-carousel': '-1', 'aria-label': '이전 월드' }, icon('left'));
  const next = h('button', { type: 'button', class: 'icon-btn', 'data-carousel': '1', 'aria-label': '다음 월드' }, icon('right'));
  const list = h('ul', { class: 'worlds', tabindex: '0', 'aria-label': LIST_LABEL_SCROLL }, cards);

  const el = h(
    'section',
    { class: 'others', 'data-testid': 'other-worlds', 'aria-labelledby': 'others-h' },
    h('div', { class: 'others-head' }, h('h2', { class: 'section-title', id: 'others-h' }, '다른 월드'), h('div', { class: 'carousel-btns' }, prev, next)),
    h('div', { class: 'worlds-wrap' }, list),
  );

  const mount = () => {
    const env = motionEnv();
    const disposers = [...cards.map((c) => tilt(c, 4, env)), reveal(cards, env), bindCarousel(list, prev, next, env)];
    return () => disposers.forEach((d) => d());
  };
  return { el, mount };
}
