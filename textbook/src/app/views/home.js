// 홈: 전체 진도, 이어서 하기, 학습 경로 지도, 부록 바로가기.
import { onceInSession, shake, stagger } from '../motion.js';
import { continueTarget, isUnlocked, percent, projectState } from '../progress.js';
import { chips, doneCount, h, isDone, linkButton, lockReason, meter, notice as noticeLine } from './common.js';
import { showToast } from './toast.js';

const PROJECT_LABEL = { locked: '🔒 잠김', active: '▶ 진행 중', complete: '✅ 완료' };

/** 퍼센트에 맞춘 격려 한 줄. 모자란 점을 말하지 않는다 */
function encouragement(pct, hasProgress) {
  if (pct >= 100) return '모두 마쳤어요! 여기까지 온 것만으로도 정말 대단해요. 🎉';
  if (!hasProgress) return '아직 시작 전이에요. 첫 Day부터 가볍게 시작해 봐요.';
  if (pct < 50) return '좋은 출발이에요. 하루에 한 Day씩만 해도 충분해요.';
  return '절반을 넘었어요! 꾸준히 해 온 만큼 실력도 쌓였어요.';
}

function trackCard(ctx, track, title, testid) {
  const { cur, prog } = ctx;
  const days = cur.projects.filter((p) => p.track === track).flatMap((p) => p.days);
  const done = days.filter((d) => isDone(prog, d.id)).length;
  const pct = percent(cur, prog, track);
  return h(
    'div',
    { class: 'progress-card', 'data-testid': testid, 'data-percent': pct, dataset: { track } },
    h('h3', null, title),
    h('p', { class: 'pc-figure' }, h('span', { class: 'pc-percent' }, `${pct}%`), h('span', { class: 'pc-count' }, `${done} / ${days.length} Day 완료`)),
    meter(pct, `${title} 진도 ${pct}%`),
    h('p', { class: 'pc-note' }, encouragement(pct, done > 0)),
  );
}

/** 학습 경로의 프로젝트 카드 하나 */
function projectCard(ctx, project) {
  const { cur, prog } = ctx;
  const state = projectState(cur, prog, project.id);
  const total = project.days.length;
  const done = doneCount(prog, project);
  const note =
    state === 'locked'
      ? lockReason(cur, project.requires)
      : state === 'complete'
        ? '모든 Day를 마쳤어요. 언제든 다시 읽어도 좋아요.'
        : done === 0
          ? '아직 시작하지 않았어요.'
          : `${done}개 Day를 마쳤어요.`;

  // 잠긴 카드: 누르면 이동하지 않고 흔들리며 이유를 알린다. href 는 남겨 새 탭·JS 없음에서는 잠금 화면으로 간다
  const onLockedClick = (event) => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    shake(event.currentTarget);
    showToast(note);
  };
  return h(
    'li',
    { class: 'path-item', dataset: { project: project.id, state } },
    h(
      'a',
      { class: 'path-card', href: `#/project/${project.id}`, 'aria-disabled': state === 'locked' ? 'true' : null, onclick: state === 'locked' ? onLockedClick : null },
      h('span', { class: 'path-state' }, PROJECT_LABEL[state]),
      h('strong', { class: 'path-title' }, project.title),
      h('span', { class: 'path-subtitle' }, project.subtitle),
      chips(project.stack ?? []),
      state !== 'locked' && meter(Math.floor((done * 100) / Math.max(total, 1)), `${project.title} 진도`),
      h('span', { class: 'path-note' }, `${done} / ${total} Day · ${note}`),
    ),
  );
}

function continueArea(ctx) {
  const { cur, prog } = ctx;
  const target = continueTarget(cur, prog);
  if (target) {
    const day = cur.projects.flatMap((p) => p.days).find((d) => d.id === target);
    const started = Object.keys(prog.completed).length > 0;
    return h(
      'div',
      { class: 'continue' },
      linkButton(`#/day/${target}`, started ? '이어서 하기' : '첫 Day 시작하기', { primary: true, testid: 'continue-button' }),
      h('span', { class: 'continue-hint' }, `다음은 Day ${day.num} · ${day.title}`),
    );
  }
  const roadmap = cur.pages.find((p) => p.id === 'roadmap');
  return h(
    'div',
    { class: 'continue' },
    h('p', { class: 'done-note' }, '열려 있는 Day를 모두 마쳤어요. 정말 수고했어요! 🎉'),
    roadmap && isUnlocked(cur, prog, roadmap.requires) && linkButton(`#/page/${roadmap.id}`, roadmap.title, { primary: true }),
  );
}

export function renderHome(ctx, root) {
  const { cur } = ctx;
  const hasSpecial = cur.projects.some((p) => p.track === 'special' && p.days.length > 0);
  const ordered = [...cur.projects].sort((a, b) => (a.track === b.track ? a.order - b.order : a.track === 'main' ? -1 : 1));
  const main = ordered.filter((p) => p.track === 'main');
  const special = ordered.filter((p) => p.track === 'special');

  const notice = ctx.takeNotice();
  const noticeEl = notice && noticeLine(notice);
  noticeEl?.setAttribute('data-reveal', '');
  root.append(
    h(
      'div',
      { class: 'home' },
      noticeEl,
      h('section', { class: 'hero', 'data-reveal': true }, h('h1', null, cur.title), h('p', { class: 'lead' }, '처음이어도 괜찮아요. 하루에 한 Day씩, 내 속도로 따라와 보세요.'), continueArea(ctx)),
      h('section', { class: 'progress-grid', 'aria-label': '전체 진도', 'data-reveal': true }, trackCard(ctx, 'main', '메인 과정', 'progress-main'), hasSpecial && trackCard(ctx, 'special', '특별 과정', 'progress-special')),
      h(
        'section',
        { class: 'path', 'data-reveal': true },
        h('h2', null, '학습 경로'),
        h('p', { class: 'muted' }, '앞 프로젝트를 끝내면 다음 프로젝트가 열려요.'),
        h('ol', { class: 'path-list' }, main.map((p) => projectCard(ctx, p))),
        special.length > 0 && [h('h3', { class: 'path-sub' }, '⭐ 특별 과정'), h('ol', { class: 'path-list' }, special.map((p) => projectCard(ctx, p)))],
      ),
      cur.pages.length > 0 &&
        h(
          'section',
          { class: 'appendix', 'data-reveal': true },
          h('h2', null, '부록'),
          h(
            'ul',
            { class: 'link-grid' },
            cur.pages.map((page) => {
              const open = isUnlocked(cur, ctx.prog, page.requires);
              return h('li', null, h('a', { href: `#/page/${page.id}` }, open ? page.title : `🔒 ${page.title}`));
            }),
          ),
        ),
    ),
  );
  if (onceInSession('home')) stagger(root.querySelectorAll('[data-reveal]')); // DESIGN.md Motion: 홈 구역 첫 표시, 세션에 한 번
  return '홈';
}
