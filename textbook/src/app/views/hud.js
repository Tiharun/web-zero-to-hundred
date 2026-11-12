// 홈 1행 오른쪽: 레벨 패널(HUD + 통계 3행 + 격려 한 줄). DESIGN.md Cards "레벨 패널", Components > HUD.
// 숫자는 모두 prog 와 cur 에서 계산한다(Real Progress). XP 막대는 meter 와 모양이 달라 여기에만 둔다.
import { LEVEL_XP, levelOf, totalXp } from '../level.js';
import { percent, questState } from '../progress.js';
import { doneCount, getProject, h } from './common.js';
import { px, worldEmblem } from './icons.js';

const formatNumber = new Intl.NumberFormat('ko-KR');

/** 메인 과정 진도에 맞춘 격려 한 줄. 모자란 점을 말하지 않는다 */
function encouragement(ctx, kind, done) {
  if (kind === 'done') return '모두 마쳤어요. 여기까지 온 것만으로도 정말 대단해요.';
  if (done === 0) return '아직 시작 전이에요. 첫 Day부터 가볍게 시작해 봐요.';
  if (percent(ctx.cur, ctx.prog, 'main') < 50) return '좋은 출발이에요. 하루에 한 Day씩만 해도 충분해요.';
  return '절반을 넘었어요. 꾸준히 해 온 만큼 실력도 쌓였어요.';
}

/** 통계 한 행: 도트 아이콘 + 이름 | 값 */
const statRow = (name, mark, label, value) => h('div', { 'data-stat': name }, h('dt', null, mark, label), h('dd', { class: 'num' }, value));

/** 레벨 패널 한 장 */
export function levelPanel(ctx) {
  const { cur, prog } = ctx;
  const { xp, level, inLevel, toNext, ratio } = levelOf(totalXp(cur, prog));
  const state = questState(cur, prog);
  const world = getProject(cur, state.worldId);
  const days = cur.projects.flatMap((p) => p.days);
  const done = cur.projects.reduce((n, p) => n + doneCount(prog, p), 0);
  const xpText = `${inLevel} / ${LEVEL_XP} XP`;

  return h(
    'section',
    { class: 'card level', 'data-testid': 'level-panel', 'data-reveal': true, 'aria-labelledby': 'level-h' },
    h('h2', { class: 'label', id: 'level-h' }, '레벨'),
    h(
      'div',
      { class: 'hud' },
      h('p', { class: 'lv' }, h('span', { class: 'lv-unit' }, 'LV'), h('span', { class: 'lv-value num' }, String(level))),
      h(
        'div',
        { class: 'xp' },
        // 좁은 패널에서 줄이 바뀌어도 "300 XP"(숫자와 단위)는 한 덩어리로 둔다
        h('p', { class: 'xp-text label num' }, px('coin'), h('span', null, `${inLevel} / `, h('span', { class: 'xp-max' }, `${LEVEL_XP} XP`))),
        h('p', { class: 'xp-next' }, `LV ${level + 1}까지 `, h('span', { class: 'num' }, String(toNext)), ' XP'),
      ),
      h(
        'div',
        {
          class: 'xp-bar',
          role: 'progressbar',
          'aria-label': '이번 레벨 XP',
          'aria-valuemin': 0,
          'aria-valuemax': LEVEL_XP,
          'aria-valuenow': inLevel,
          'aria-valuetext': xpText,
        },
        h('span', { class: 'xp-fill', 'data-xp-fill': true, style: `--p:${ratio.toFixed(4)}` }),
      ),
    ),
    h(
      'dl',
      { class: 'stats' },
      statRow('xp', px('coin'), '누적 XP', formatNumber.format(xp)),
      statRow('days', px('star'), '완료한 Day', `${done} / ${days.length}`),
      world && statRow('world', px(worldEmblem(world), { cls: 'emblem' }), '지금 월드', `${doneCount(prog, world)} / ${world.days.length}`),
    ),
    h('p', { class: 'cheer' }, encouragement(ctx, state.kind, done)),
  );
}
