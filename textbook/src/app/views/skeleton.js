// Skeleton 자리표시: 늦게 준비되는 곳(검색 결과의 첫 계산, 3D 그림)에만 쓴다. DESIGN.md Skeleton, 개편 설계서 3.5.
// 이 파일은 맨 위에서 document 를 읽지 않는다 (node 단위 테스트가 import 한다).
import { h } from './common.js';

/** 이 시간(ms) 안에 끝나면 보이지 않는다 */
export const SKELETON_DELAY = 200;
/** 한 번 보이면 최소 이 시간(ms) 보인다 (깜빡임 방지) */
export const SKELETON_MIN = 300;

const realClock = () => ({ now: () => performance.now(), setTimeout: (fn, ms) => setTimeout(fn, ms), clearTimeout: (id) => clearTimeout(id) });

/**
 * 오래 걸릴 때만 자리표시를 보인다. 만들 때 시계가 돈다.
 * finish(apply): 안 보였으면 바로 apply, 보였으면 최소 시간을 채운 뒤 hide → apply.
 * cancel(): 타이머를 지우고, 보였으면 hide. apply 는 부르지 않는다(finish 가 최소 시간을 기다리던 apply 도 버린다).
 * 그 밖의 두 번째 호출은 아무 일도 하지 않는다.
 */
export function skeletonGate({ show, hide }, { delay = SKELETON_DELAY, min = SKELETON_MIN, clock = realClock() } = {}) {
  let shownAt = null;
  let settled = false;
  let timer = clock.setTimeout(() => {
    timer = null;
    shownAt = clock.now();
    show();
  }, delay);

  function stop() {
    settled = true;
    if (timer !== null) clock.clearTimeout(timer);
    timer = null;
  }

  return {
    finish(apply) {
      if (settled) return;
      stop();
      if (shownAt === null) return apply();
      const wait = shownAt + min - clock.now();
      const done = () => {
        hide();
        apply();
      };
      if (wait <= 0) done();
      else timer = clock.setTimeout(done, wait);
    },
    cancel() {
      if (settled) {
        if (timer !== null) {
          clock.clearTimeout(timer); // finish 가 최소 시간을 기다리는 중이었다
          timer = null;
          hide();
        }
        return;
      }
      stop();
      if (shownAt !== null) hide();
    },
  };
}

/** 결과 행과 같은 크기의 자리표시 행. 화면 낭독기에는 숨긴다 */
export function skeletonRows(count = 3) {
  return Array.from({ length: count }, () =>
    h('li', { class: 'skeleton-row', 'aria-hidden': 'true' }, h('span', { class: 'skeleton-bar' }), h('span', { class: 'skeleton-bar' })),
  );
}
