// 월드(프로젝트) 페이지 (DESIGN.md Cards "월드 페이지"·"월드 페이지 Day 행"): 머리, 결과물 카드, Day 목록.
// 잠긴 월드는 잠금 화면이다. 분홍은 오늘 Day 번호 네모 하나뿐이고, 오늘이 다른 월드에 있으면 없다.
import { continueTarget, navDayState, projectState } from '../progress.js';
import { breadcrumb, chips, doneCount, getProject, h, lockScreen, meter, minutesText, worldLabel } from './common.js';
import { px, worldEmblem } from './icons.js';

/** 화면 낭독기가 읽는 행 상태 (준비 중은 글자가 이미 보인다) */
const STATE_TEXT = { done: '완료', today: '오늘', draft: '', open: '' };

function dayRow(day, state) {
  const mark = state === 'draft' ? h('span', { class: 'row-draft' }, '준비 중') : null;
  // 보드게임 칸(DESIGN.md Board Tiles): 완료는 초록 칸에 도트 체크, 오늘은 분홍 칸, 그 밖은 번호
  const tile = h('span', { class: 'day-tile', 'aria-hidden': 'true' }, state === 'done' ? px('check') : String(day.num));
  return h(
    'li',
    null,
    h(
      'a',
      {
        class: `world-day is-${state}`,
        href: `#/day/${day.id}`,
        'aria-current': state === 'today' ? 'step' : null,
        dataset: { day: day.id, state },
      },
      tile,
      h('span', { class: 'sr-only' }, `Day ${day.num} `),
      h('span', { class: 'world-day-body' }, h('span', { class: 'world-day-title' }, day.title), h('span', { class: 'world-day-summary' }, day.summary)),
      h(
        'span',
        { class: 'world-day-meta' },
        h('span', { class: 'label' }, minutesText(day.minutes)),
        h('span', { class: 'row-mark' }, mark),
        STATE_TEXT[state] && h('span', { class: 'sr-only' }, `, ${STATE_TEXT[state]}`),
      ),
    ),
  );
}

export function renderProject(ctx, pid, root) {
  const { cur, prog } = ctx;
  const project = getProject(cur, pid);
  if (!project) {
    return ctx.notFound(root);
  }
  if (projectState(cur, prog, pid) === 'locked') {
    root.append(lockScreen(ctx, project.title, project.requires));
    return `잠김 · ${project.title}`;
  }

  const total = project.days.length;
  const done = doneCount(prog, project);
  const todayId = continueTarget(cur, prog);
  // 보상 XP: 이 월드 Day 들의 예상 시간 합 (DESIGN.md HUD "XP 공식")
  const reward = project.days.reduce((n, d) => n + d.minutes, 0);

  root.append(
    h(
      'article',
      { class: 'world-page', dataset: { project: project.id } },
      breadcrumb({ text: '홈', href: '#/' }, { text: project.title }),
      h(
        'header',
        { class: 'world-head' },
        h('span', { class: 'badge' }, px(worldEmblem(project), { cls: 'emblem', scale: 3 })),
        h('p', { class: 'label world-head-tag' }, worldLabel(project)),
        h('h1', null, project.title),
        project.subtitle && h('p', { class: 'lead' }, project.subtitle),
        project.summary && h('p', { class: 'world-summary' }, project.summary),
      ),
      h(
        'section',
        { class: 'card world-outcome', 'aria-labelledby': 'world-outcome-h' },
        h('h2', { class: 'label world-outcome-head', id: 'world-outcome-h' }, px('trophy'), '클리어 보상'),
        h('p', { class: 'world-outcome-text' }, project.outcome),
        project.stack?.length > 0 && chips(project.stack, Infinity),
        h(
          'dl',
          { class: 'world-facts' },
          h('div', null, h('dt', null, '작업 폴더'), h('dd', null, h('code', null, project.folder))),
          h('div', null, h('dt', null, '보상'), h('dd', { class: 'num world-xp' }, px('coin'), `+${reward} XP`)),
          h('div', null, h('dt', null, '진도'), h('dd', null, h('span', { class: 'num' }, `${done} / ${total}`), ' Day 완료')),
        ),
        meter(done, total, `${project.title} 진도`),
      ),
      h('h2', { class: 'world-days-title', id: 'world-days-h' }, 'Day 목록'),
      h(
        'ol',
        { class: 'card world-days', 'aria-labelledby': 'world-days-h' },
        project.days.map((day) => dayRow(day, navDayState(cur, prog, day.id, todayId))),
      ),
    ),
  );
  return project.title;
}
