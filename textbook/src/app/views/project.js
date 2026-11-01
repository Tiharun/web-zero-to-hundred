// 프로젝트 화면: 소개, 진도, Day 목록. 잠긴 프로젝트는 잠금 화면.
import { dayState, projectState } from '../progress.js';
import { breadcrumb, doneCount, getProject, h, lockScreen, meter, minutesText, notFoundScreen } from './common.js';

const DAY_ICON = { locked: '🔒', done: '✅', next: '▶', open: '○' };
const DAY_TEXT = { locked: '잠김', done: '완료', next: '다음 할 Day', open: '' };

export function renderProject(ctx, pid, root) {
  const { cur, prog } = ctx;
  const project = getProject(cur, pid);
  if (!project) {
    root.append(notFoundScreen());
    return '찾을 수 없어요';
  }
  if (projectState(cur, prog, pid) === 'locked') {
    root.append(lockScreen(ctx, project.title, project.requires));
    return `잠김 · ${project.title}`;
  }

  const total = project.days.length;
  const done = doneCount(prog, project);
  const pct = Math.floor((done * 100) / Math.max(total, 1));

  root.append(
    h(
      'article',
      { class: 'project', dataset: { project: project.id } },
      breadcrumb({ text: '홈', href: '#/' }, { text: project.title }),
      h(
        'header',
        { class: 'project-head' },
        h('h1', null, project.title),
        h('p', { class: 'lead' }, project.subtitle),
        h('p', { class: 'chips' }, (project.stack ?? []).map((tech) => h('span', { class: 'chip' }, tech))),
      ),
      h(
        'dl',
        { class: 'facts' },
        h('div', null, h('dt', null, '이 프로젝트에서는'), h('dd', null, project.summary)),
        h('div', null, h('dt', null, '끝나면 남는 결과물'), h('dd', null, project.outcome)),
        h('div', null, h('dt', null, '작업 폴더'), h('dd', null, h('code', null, project.folder))),
      ),
      h('div', { class: 'project-progress' }, h('p', null, h('strong', null, `${done} / ${total} Day 완료`), ` (${pct}%)`), meter(pct, `${project.title} 진도`)),
      h('h2', null, 'Day 목록'),
      h(
        'ol',
        { class: 'day-list' },
        project.days.map((day) => {
          const state = dayState(cur, prog, day.id);
          return h(
            'li',
            null,
            h(
              'a',
              { class: 'day-row', href: `#/day/${day.id}`, dataset: { row: day.id, state } },
              h('span', { class: 'mark', 'aria-hidden': 'true' }, DAY_ICON[state]),
              h('span', { class: 'day-row-body' }, h('strong', null, `Day ${day.num} · ${day.title}`), h('span', { class: 'muted' }, day.summary)),
              h('span', { class: 'day-row-meta' }, minutesText(day.minutes), DAY_TEXT[state] && h('span', { class: 'sr-only' }, ` (${DAY_TEXT[state]})`)),
            ),
          );
        }),
      ),
    ),
  );
  return project.title;
}
