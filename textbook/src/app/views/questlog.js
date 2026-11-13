// 퀘스트 로그: Day 섹션 목록과 "지금 읽는 섹션". DESIGN.md Components "Day 부품" 퀘스트 로그.
// 이 파일은 맨 위에서 document 를 읽지 않는다 (node 단위 테스트가 import 한다).
import { motionEnv } from '../motion.js';
import { h } from './common.js';
import { icon, px } from './icons.js';

/** 상단 바 아래 기준선(px). 이 선을 지난 마지막 제목이 지금 단계다. 승인 시안 proto.js 값 */
export const READ_LINE = 96;

/**
 * 지금 단계의 인덱스. 맨 아래에 닿았으면 마지막, 아니면 top 이 line 이하인 마지막 제목, 그런 제목이 없으면 0. 제목이 없으면 -1.
 * @param {number[]} tops 제목들의 getBoundingClientRect().top
 * @param {number} line 기준선(뷰포트 좌표)
 * @param {boolean} atBottom 페이지 맨 아래인가
 */
export function currentStep(tops, line, atBottom) {
  if (tops.length === 0) return -1;
  if (atBottom) return tops.length - 1;
  let step = 0;
  tops.forEach((top, i) => {
    if (top <= line) step = i;
  });
  return step;
}

/**
 * 퀘스트 로그 두 벌을 만든다: 1280px 이상 오른쪽 열(nav)과 그보다 좁을 때 본문 위 접힘 카드(details). CSS 가 하나만 보인다.
 * scroll·resize 때 rAF 로 지금 단계를 갱신한다. 제목이 없으면 null.
 * @param {HTMLElement[]} headings 섹션 제목(h2[id])
 * @returns {{ log: HTMLElement, mini: HTMLDetailsElement, dispose: () => void } | null}
 */
export function mountQuestLog(headings, env = motionEnv()) {
  if (headings.length === 0) return null;
  const total = headings.length;
  const stepText = (i) => `단계 ${i + 1}/${total}`;

  const jump = (heading) => {
    heading.scrollIntoView({ behavior: env.reduce ? 'auto' : 'smooth', block: 'start' });
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  };
  const list = () =>
    h(
      'ol',
      { class: 'quest-list' },
      // 커서 자리(지금 단계에서만 보이는 도트 화살표) → 번호 칸(작은 보드게임 칸) → 제목. DESIGN.md "Day 부품" 퀘스트 로그
      headings.map((heading, i) =>
        h(
          'li',
          null,
          h(
            'button',
            { type: 'button', class: 'quest-item', onclick: () => jump(heading) },
            h('span', { class: 'quest-cursor', 'aria-hidden': 'true' }, px('arrow')),
            h('span', { class: 'quest-no' }, String(i + 1)),
            h('span', { class: 'quest-name' }, heading.textContent.trim()),
          ),
        ),
      ),
    );

  const step = h('span', { class: 'quest-step' });
  const log = h('nav', { class: 'quest-log', 'aria-label': '퀘스트 로그' }, h('p', { class: 'quest-head' }, h('span', { class: 'label' }, '퀘스트 로그'), step), list());
  const miniStep = h('span', { class: 'quest-mini-step' });
  const mini = h(
    'details',
    { class: 'quest-mini' },
    h('summary', null, h('span', { class: 'quest-mini-title' }, '퀘스트 로그 · ', miniStep), icon('chevron', 'quest-chev')),
    h('nav', { 'aria-label': '퀘스트 로그' }, list()),
  );
  const buttons = [...log.querySelectorAll('.quest-item'), ...mini.querySelectorAll('.quest-item')];

  let current = -1;
  const show = (next) => {
    if (next === current) return;
    current = next;
    step.textContent = stepText(current);
    miniStep.textContent = stepText(current);
    buttons.forEach((btn, i) => {
      if (i % total === current) btn.setAttribute('aria-current', 'step');
      else btn.removeAttribute('aria-current');
    });
  };
  let frame = 0;
  const update = () => {
    frame = 0;
    if (!headings[0].isConnected) return; // 화면에 붙기 전에는 잴 수 없다
    const el = document.scrollingElement ?? document.documentElement;
    const atBottom = el.scrollTop > 0 && el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
    const line = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--topbar-h')) + READ_LINE || READ_LINE;
    show(currentStep(headings.map((hd) => hd.getBoundingClientRect().top), line, atBottom));
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  show(0); // 붙이기 전(만든 직후)에는 첫 단계. 실제 위치는 다음 프레임에 잰다
  schedule();
  return {
    log,
    mini,
    dispose: () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    },
  };
}
