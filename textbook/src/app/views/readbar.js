// 읽기 위치 바: Day 화면 상단 바 바로 아래, 얼마나 읽었는지를 가로 막대로 보인다. DESIGN.md Components "읽기 위치 바".
// 이 파일은 맨 위에서 document 를 읽지 않는다 (node 단위 테스트가 import 한다).
import { h } from './common.js';

/** 스크롤 위치를 0~1 로. 스크롤할 수 없거나 값이 이상하면 0 */
export function readRatio(scrollTop, scrollHeight, clientHeight) {
  const range = scrollHeight - clientHeight;
  if (!Number.isFinite(scrollTop) || !Number.isFinite(range) || range <= 0) return 0;
  return Math.min(1, Math.max(0, scrollTop / range));
}

/**
 * body 에 바를 하나 붙인다(있던 것은 지운다). 스크롤 타임라인을 지원하면 CSS 가 채우고,
 * 아니면 scroll·resize·본문 크기 변화(정답 펼치기 등) 때 rAF 로 --read 를 쓴다. 돌려준 함수가 리스너와 바를 모두 지운다.
 * @returns {() => void}
 */
export function mountReadBar() {
  document.querySelector('.read-bar')?.remove();
  const bar = h('div', { class: 'read-bar', 'aria-hidden': 'true' }, h('span', { class: 'read-bar-fill' }));
  document.body.append(bar);
  if (globalThis.CSS?.supports?.('animation-timeline: scroll()')) return () => bar.remove();

  let frame = 0;
  const update = () => {
    frame = 0;
    const el = document.scrollingElement ?? document.documentElement;
    bar.style.setProperty('--read', readRatio(el.scrollTop, el.scrollHeight, el.clientHeight).toFixed(4));
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  const grow = typeof ResizeObserver === 'function' ? new ResizeObserver(schedule) : null;
  grow?.observe(document.body);
  schedule();
  return () => {
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    grow?.disconnect();
    if (frame) cancelAnimationFrame(frame);
    bar.remove();
  };
}
