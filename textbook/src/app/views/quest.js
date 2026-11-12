// 홈 1행 왼쪽: 퀘스트 카드(상태 5종). DESIGN.md Cards "퀘스트 카드", pages/home.md 4절.
// 상태는 questState 가 prog 에서 매번 계산한다. 화면은 공통 틀(머리 + 큰 숫자 + 내용)에 kind 별 내용만 바꿔 넣는다.
import { isUnlocked, questState } from '../progress.js';
import { findDay, getPage, getProject, h, primaryButton, textLink, worldLabel } from './common.js';
import { px } from './icons.js';

/** 열려 있는 부록 페이지. 없거나 잠겼으면 null */
function openPage(ctx, id) {
  const page = getPage(ctx.cur, id);
  return page && isUnlocked(ctx.cur, ctx.prog, page.requires) ? page : null;
}

/** 예상 시간·체크리스트·보상·작업 폴더 */
function facts(ctx, project, day) {
  const checked = ctx.prog.checks[day.id]?.length ?? 0;
  const item = (dt, dd, cls) => h('div', { class: cls }, h('dt', null, dt), dd);
  return h(
    'dl',
    { class: 'quest-facts' },
    item('예상 시간', h('dd', { class: 'num' }, `${day.minutes}분`)),
    day.checkCount > 0 && item('체크리스트', h('dd', { class: 'num' }, checked > 0 ? `${checked} / ${day.checkCount}` : `${day.checkCount}개`)),
    item('보상', h('dd', { class: 'num xp-gain' }, px('coin'), `+${day.minutes} XP`)),
    project.folder && item('작업 폴더', h('dd', null, h('code', null, project.folder)), 'fact-wide'),
  );
}

/** kind 별 내용: 머리 글자·도트, 월드 링크, 큰 숫자, 제목, 그 아래, 주 버튼, 글자 링크 */
function content(ctx, state) {
  const { cur } = ctx;
  const target = state.dayId && findDay(cur, state.dayId);
  const today = { label: '오늘의 퀘스트', mark: 'quest' };

  switch (state.kind) {
    case 'start':
    case 'continue': {
      const { project, day } = target;
      const start = state.kind === 'start' && openPage(ctx, 'start');
      return {
        ...today,
        world: project,
        num: day.num,
        title: day.title,
        below: [h('p', { class: 'quest-summary' }, day.summary), facts(ctx, project, day)],
        primary: primaryButton(`#/day/${day.id}`, state.kind === 'start' ? '첫 Day 시작하기' : '이어서 하기', { testid: 'continue-button' }),
        link: start && textLink(`#/page/${start.id}`, '처음이면 시작하기부터'),
      };
    }
    case 'clear': {
      const cleared = getProject(cur, state.clearedId);
      const { project: next, day } = target;
      return {
        label: '월드 클리어',
        mark: 'trophy',
        world: cleared,
        num: cleared.days.length,
        title: `‘${cleared.title}’ 월드를 모두 마쳤어요`,
        below: [
          h('dl', { class: 'made' }, h('dt', null, '이 월드에서 만든 것'), h('dd', null, cleared.outcome)),
          h('p', { class: 'quest-next' }, '다음 월드가 열렸어요. ', h('strong', null, next.title), ` Day ${day.num} ‘${day.title}’부터 시작해요.`),
        ],
        primary: primaryButton(`#/day/${day.id}`, '다음 월드 시작하기', { testid: 'continue-button' }),
        link: textLink(`#/project/${cleared.id}`, `${cleared.title} 다시 보기`),
      };
    }
    case 'pending': {
      const { project, day } = target;
      const review = state.reviewId && findDay(cur, state.reviewId);
      return {
        ...today,
        world: project,
        num: day.num,
        pending: true,
        title: '다음 Day는 준비 중이에요',
        below: [h('p', { class: 'quest-summary' }, `Day ${day.num} ‘${day.title}’ 내용은 아직 쓰는 중이에요. 그동안 지난 Day를 복습해 두면 좋아요.`)],
        primary: review && primaryButton(`#/day/${review.day.id}`, `Day ${review.day.num} 복습하기`, { testid: 'review-button' }),
        link: textLink(`#/project/${project.id}`, `${project.title} Day 목록`),
      };
    }
    default: {
      const roadmap = openPage(ctx, 'roadmap');
      return {
        label: '모든 월드 클리어',
        mark: 'trophy',
        world: null,
        num: cur.projects.reduce((n, p) => n + p.days.length, 0),
        title: '열린 Day를 모두 마쳤어요',
        below: [
          h(
            'p',
            { class: 'quest-summary' },
            roadmap ? `정말 수고했어요. 다음에 갈 길은 ‘${roadmap.title}’에서 볼 수 있어요.` : '정말 수고했어요. 지나온 월드는 언제든 다시 볼 수 있어요.',
          ),
        ],
        primary: roadmap && primaryButton(`#/page/${roadmap.id}`, `${roadmap.title} 보기`, { testid: 'roadmap-button' }),
        link: null,
      };
    }
  }
}

/** 퀘스트 카드 한 장 */
export function questCard(ctx) {
  const state = questState(ctx.cur, ctx.prog);
  const c = content(ctx, state);
  return h(
    'section',
    { class: `card quest is-${state.kind}`, 'data-testid': 'quest-card', 'data-kind': state.kind, 'data-reveal': true, 'aria-labelledby': 'quest-h' },
    h(
      'div',
      { class: 'quest-head' },
      h('h2', { class: 'label quest-label', id: 'quest-h' }, px(c.mark), c.label),
      c.world && h('a', { class: 'world-link', href: `#/project/${c.world.id}` }, `${worldLabel(c.world)} `, h('span', null, c.world.title)),
    ),
    h(
      'div',
      { class: 'quest-body' },
      h('p', { class: c.pending ? 'bignum is-pending' : 'bignum' }, h('span', { class: 'bignum-unit label' }, 'Day'), h('span', { class: 'bignum-value num' }, String(c.num))),
      h(
        'div',
        { class: 'quest-main' },
        h('h3', { class: 'quest-title' }, c.title),
        c.below,
        (c.primary || c.link) && h('div', { class: 'actions' }, c.primary, c.link),
      ),
    ),
  );
}
