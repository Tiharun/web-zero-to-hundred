// Day 화면: 본문 템플릿을 붙이고, 체크박스·정답 게이트·코드 복사·완료 버튼을 연결한다.
import { onceInSession, reveal, shake } from '../motion.js';
import { canComplete, canUncomplete, completeDay, dayState, isProjectComplete, newlyUnlocked, toggleCheck, uncompleteDay } from '../progress.js';
import { rewardEvents, rewardKey, rewardModal, rewardToast } from '../reward.js';
import { symptomAccordions } from './accordion.js';
import { breadcrumb, chips, findDay, getPage, getProject, h, isDone, lockScreen, minutesText, textLink } from './common.js';
import { px } from './icons.js';
import { mountQuestLog } from './questlog.js';
import { mountReadBar } from './readbar.js';
import { showToast } from './toast.js';

const COPY_RESET_MS = 2000;

// 정답을 확인한 id. 새로고침하면 사라지는 메모리 기록이다 (저장하지 않는다)
const confirmedAnswers = new Set();

// ───────── 코드 복사 ─────────

/** 숨긴 입력칸에 글자를 넣고 execCommand('copy') 로 복사한다. clipboard API 를 못 쓰는 환경의 대체 경로 */
function copyWithTextarea(text) {
  const previous = document.activeElement;
  const area = h('textarea', { class: 'copy-buffer', readonly: true, 'aria-hidden': 'true', tabindex: '-1' });
  area.value = text;
  document.body.append(area);
  let ok = false;
  try {
    area.focus({ preventScroll: true });
    area.select();
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  } finally {
    area.remove();
    previous?.focus?.({ preventScroll: true });
  }
  return ok;
}

/** 복사에 성공하면 true. 먼저 clipboard API, 안 되면 대체 경로 */
async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // 권한이 없거나 안전하지 않은 환경: 아래 대체 경로로 간다
  }
  return copyWithTextarea(text);
}

function bindCopyButtons(ctx, body) {
  const timers = new WeakMap();
  body.addEventListener('click', async (event) => {
    const button = event.target.closest('button.copy');
    if (!button || !body.contains(button)) return;
    const code = button.closest('figure.code')?.querySelector('pre code');
    if (!code) return;

    const ok = await copyText(code.textContent);
    if (!ok) {
      // 마지막 수단: 코드를 선택해 두고 직접 Ctrl+C 하게 한다
      window.getSelection()?.selectAllChildren(code);
    }
    clearTimeout(timers.get(button));
    button.textContent = ok ? '복사됨' : '직접 복사해 주세요';
    button.dataset.copied = ok ? 'yes' : 'no';
    ctx.announce(ok ? '코드를 복사했어요.' : '자동 복사가 안 돼서 코드를 선택해 뒀어요. Ctrl+C를 눌러 주세요.');
    timers.set(
      button,
      setTimeout(() => {
        button.textContent = '복사';
        delete button.dataset.copied;
      }, COPY_RESET_MS),
    );
  });
}

// ───────── 정답 게이트 ─────────

function bindAnswerGate(body) {
  body.addEventListener('click', (event) => {
    const summary = event.target.closest('summary');
    const details = summary?.parentElement;
    if (!details?.matches('details.answer') || !body.contains(details)) return;
    if (details.open || confirmedAnswers.has(details.dataset.answer)) return; // 접는 일, 이미 확인한 정답은 그대로 둔다

    event.preventDefault(); // 처음 펼치는 클릭은 기본 동작을 막고 게이트를 보여 준다
    const existing = details.previousElementSibling;
    if (existing?.matches('.answer-gate')) {
      existing.focus();
      return;
    }
    const gate = h(
      'div',
      { class: 'answer-gate', 'data-testid': 'answer-gate', role: 'group', 'aria-label': '정답을 보기 전에', tabindex: '-1' },
      h('p', null, h('strong', null, '잠깐, 먼저 직접 풀어 보세요.'), ' 막힌 곳을 스스로 찾아보는 시간이 가장 오래 기억에 남아요. 충분히 해 봤다면 정답을 열어도 괜찮아요.'),
      h(
        'div',
        { class: 'gate-actions' },
        h(
          'button',
          {
            class: 'btn', // 주 버튼(분홍)은 Day 완료 하나. 정답 보기는 권하는 행동이 아니다
            type: 'button',
            'data-testid': 'answer-gate-confirm',
            onclick: () => {
              confirmedAnswers.add(details.dataset.answer);
              gate.remove();
              details.open = true;
              summary.focus({ preventScroll: true });
            },
          },
          '그래도 정답 볼래요',
        ),
        h('button', { class: 'btn', type: 'button', onclick: () => { gate.remove(); summary.focus({ preventScroll: true }); } }, '조금 더 풀어 볼게요'),
      ),
    );
    details.before(gate);
    gate.focus({ preventScroll: true });
  });
}

// ───────── 🧯 증상 ─────────

/** 🧯 섹션 제목 바로 아래 줄 오른쪽 끝에 "모두 펼치기" (DESIGN.md "Day 증상 Accordion") */
function bindSymptoms(body) {
  const btn = symptomAccordions(body);
  const heading = [...body.querySelectorAll(':scope > h2')].find((el) => el.textContent.trim().startsWith('🧯'));
  if (btn && heading) heading.after(h('div', { class: 'trouble-tools' }, btn));
}

// ───────── 체크박스 ─────────

function bindChecklist(ctx, dayId, body, onChange) {
  const boxes = [...body.querySelectorAll('input[type="checkbox"][data-check]')];
  // 체크 칸 위에 얹는 도트 체크(장식). 체크했을 때만 CSS 가 보인다 (DESIGN.md "Day 부품" 체크리스트)
  for (const box of boxes) box.after(h('span', { class: 'task-check', 'aria-hidden': 'true' }, px('check')));
  const sync = () => {
    const checked = new Set(ctx.prog.checks[dayId] ?? []);
    for (const box of boxes) {
      box.checked = checked.has(Number(box.dataset.check));
      box.closest('li')?.classList.toggle('is-checked', box.checked);
    }
  };
  sync();

  body.addEventListener('change', (event) => {
    const box = event.target;
    if (!(box instanceof HTMLInputElement) || !box.matches('input[data-check]')) return;
    ctx.commit(toggleCheck(ctx.prog, dayId, Number(box.dataset.check)));
    sync();
    onChange(boxes.filter((b) => b.checked).length, boxes.length);
  });
  // 글자를 눌러도 체크되게 한다 (링크·글자 선택 중에는 제외)
  body.addEventListener('click', (event) => {
    const item = event.target.closest('li.task');
    if (!item || event.target.closest('a, input, button') || window.getSelection()?.toString()) return;
    item.querySelector(':scope > input[data-check]')?.click();
  });
  return { checked: () => boxes.filter((b) => b.checked).length, total: boxes.length };
}

/** 아직 쓰지 않은 Day: 안내와 복습 링크(앞 Day가 있을 때) 또는 홈 링크. DESIGN.md Cards "준비 중 Day 칸" */
function comingSoon(previous) {
  return h(
    'section',
    { class: 'coming-soon', 'data-testid': 'coming-soon' },
    h('p', { class: 'coming-soon-title' }, '이 Day는 아직 준비 중이에요.'),
    h('p', null, '내용은 지금 쓰는 중이에요. 그동안 지난 Day를 복습해 두면 좋아요.'),
    previous ? textLink(`#/day/${previous.id}`, `Day ${previous.num} 복습하기`) : textLink('#/', '홈으로'),
  );
}

// ───────── 화면 ─────────

export function renderDay(ctx, dayId, root) {
  const { cur } = ctx;
  const found = findDay(cur, dayId);
  const template = found && document.getElementById(`t-day-${dayId}`);
  if (!found || !(template instanceof HTMLTemplateElement)) {
    return ctx.notFound(root);
  }
  const { project, day, index } = found;
  if (dayState(cur, ctx.prog, dayId) === 'locked') {
    root.append(lockScreen(ctx, `Day ${day.num} · ${day.title}`, project.requires));
    return `잠김 · ${day.title}`;
  }

  ctx.onCleanup(mountReadBar()); // 본문(준비 중 포함)을 그리는 Day 화면에만. 잠김·없는 Day 는 위에서 돌아간다
  const previous = project.days[index - 1] ?? null;
  const next = project.days[index + 1] ?? null;
  const body = h('div', { class: 'lesson-body' });
  if (day.ready === false) body.append(comingSoon(previous));
  else body.append(template.content.cloneNode(true));

  const statusChip = h('li', { class: 'lesson-status' });
  const checklist = bindChecklist(ctx, dayId, body, () => renderFooter());
  bindAnswerGate(body);
  bindCopyButtons(ctx, body);
  bindSymptoms(body);

  const footer = h('footer', { class: 'lesson-foot' });
  let justUnlocked = []; // 이 화면에서 방금 열린 프로젝트·페이지 id

  function renderFooter() {
    const prog = ctx.prog;
    const done = isDone(prog, dayId);
    const state = dayState(cur, prog, dayId);
    statusChip.textContent = done ? '✅ 완료' : state === 'next' ? '▶ 다음 할 Day' : '';
    statusChip.hidden = !statusChip.textContent;
    const checks = checklist.total > 0 ? `체크리스트 ${checklist.checked()} / ${checklist.total}` : null;

    const parts = [];
    if (justUnlocked.length > 0) parts.push(unlockBanner(ctx, justUnlocked));

    if (done) {
      const allowed = canUncomplete(cur, prog, dayId);
      const reasonId = 'uncomplete-reason';
      parts.push(
        h(
          'section',
          { class: 'completion card is-done', 'aria-label': 'Day 완료' },
          completionLabel('퀘스트 클리어!'),
          h('p', { class: 'completion-status', id: 'completion-status', tabindex: '-1' }, `✅ Day ${day.num} 완료! 오늘도 한 걸음 나아갔어요.`),
          Number.isFinite(day.minutes) && h('p', { class: 'completion-reward' }, px('coin'), h('span', null, '보상 ', h('span', { class: 'num' }, `+${day.minutes}`), ' XP 획득')),
          isProjectComplete(cur, prog, project.id) && h('p', { class: 'celebrate' }, `🎉 프로젝트 ‘${project.title}’를 모두 마쳤어요. 정말 대단해요!`),
          h(
            'div',
            { class: 'completion-actions' },
            h('button', { class: 'btn', type: 'button', 'data-testid': 'uncomplete-button', disabled: !allowed, 'aria-describedby': allowed ? null : reasonId, onclick: uncomplete }, '완료 취소'),
          ),
          !allowed && h('p', { class: 'reason', id: reasonId }, uncompleteReason(cur, prog, project, index)),
        ),
      );
    } else {
      const allowed = canComplete(cur, prog, dayId);
      const reasonId = 'complete-reason';
      parts.push(
        h(
          'section',
          { class: 'completion card', 'aria-label': 'Day 완료' },
          completionLabel('퀘스트 완료 조건'),
          h('p', { class: 'completion-status', id: 'completion-status', tabindex: '-1' }, checks ?? '오늘 할 일을 마쳤나요?'),
          checklist.total > 0 && checkBar(checklist.checked(), checklist.total),
          h(
            'div',
            { class: 'completion-actions' },
            h('button', { class: 'btn btn-primary', type: 'button', 'data-testid': 'complete-button', 'aria-disabled': allowed ? null : 'true', 'aria-describedby': allowed ? null : reasonId, onclick: complete }, 'Day 완료'),
          ),
          allowed
            ? h('p', { class: 'reason' }, '준비가 됐을 때 눌러 주세요. 잘못 눌러도 완료를 취소할 수 있어요.')
            : h('p', { class: 'reason', id: reasonId }, previous ? `먼저 이전 Day(Day ${previous.num})를 완료해 주세요. 순서대로 하면 빠뜨리는 내용이 없어요.` : '지금은 완료할 수 없어요.'),
        ),
      );
    }

    parts.push(dayNav(project, previous, next, done && index === project.days.length - 1));
    footer.replaceChildren(...parts);
  }

  function complete(event) {
    // 조건이 안 되면(aria-disabled: 포커스는 받는다) 진도는 그대로 두고, 버튼을 흔들고 이유를 강조해 알린다 (DESIGN.md "Day 완료 카드")
    if (!canComplete(cur, ctx.prog, dayId)) {
      const reason = document.getElementById('complete-reason');
      if (!reason) {
        renderFooter(); // 그 사이에 상태가 바뀐 경우: 버튼과 이유를 다시 그려 맞춘다
        return;
      }
      shake(event.currentTarget);
      reason.classList.add('is-alert');
      ctx.announce(reason.textContent);
      return;
    }
    const before = ctx.prog;
    let after;
    try {
      after = completeDay(cur, before, dayId, ctx.now());
    } catch {
      renderFooter(); // 그 사이에 상태가 바뀐 경우: 버튼을 다시 그려 맞춘다
      return;
    }
    ctx.commit(after);
    justUnlocked = newlyUnlocked(cur, before, after);
    renderFooter();
    const status = document.getElementById('completion-status');
    status?.focus({ preventScroll: true });
    // 보상(DESIGN.md "보상 Modal"·"업적 토스트"): Modal 이 뜨면 닫힌 뒤에 토스트. 토스트 문장이 완료 알림이다
    const events = rewardEvents(cur, before, after, dayId);
    const modal = rewardModal(events);
    const toast = () => showToast(rewardToast(events), { icon: 'trophy' });
    if (modal && onceInSession(rewardKey(modal))) ctx.reward.show(modal, cur, status).then(toast);
    else toast();
  }

  function uncomplete() {
    try {
      ctx.commit(uncompleteDay(cur, ctx.prog, dayId));
    } catch {
      renderFooter();
      return;
    }
    justUnlocked = [];
    renderFooter();
    ctx.announce(`Day ${day.num}의 완료를 취소했어요.`);
    document.querySelector('[data-testid="complete-button"]')?.focus({ preventScroll: true });
  }

  renderFooter();
  // 퀘스트 로그(DESIGN.md "Day 부품"): 좁으면 본문 위 접힘 카드, 1280px 이상이면 오른쪽 열. 섹션이 없는(준비 중) Day 에는 없다
  const quest = mountQuestLog([...body.querySelectorAll(':scope > h2[id]')]);
  if (quest) ctx.onCleanup(quest.dispose);
  root.append(
    h(
      'article',
      { class: quest ? 'lesson has-aside' : 'lesson', dataset: { dayId } },
      breadcrumb({ text: '홈', href: '#/' }, { text: project.title, href: `#/project/${project.id}` }, { text: `Day ${day.num}` }),
      dayHead(project, day, statusChip),
      quest?.mini,
      body,
      footer,
      quest?.log,
    ),
  );
  ctx.onCleanup(reveal(body.querySelectorAll('h2[id]'))); // 개편 설계서 6.3: Day 섹션 제목은 보일 때 올라온다
  return `Day ${day.num} · ${day.title}`;
}

/**
 * Day 머리 (DESIGN.md "Day 부품" Day 머리): 큰 번호(장식) → 제목 → 메타 칩(예상 시간, 작업 폴더, 월드 이름, 상태).
 * 화면 낭독기는 h1 안의 숨긴 "Day n · " 로 번호를 읽는다. statusChip 의 글자는 renderFooter 가 바꾼다.
 */
function dayHead(project, day, statusChip) {
  const meta = chips([minutesText(day.minutes), project.folder, project.title], Infinity);
  meta.classList.add('lesson-chips');
  meta.children[1]?.classList.add('is-code');
  if (Number.isFinite(day.minutes)) meta.append(h('li', { class: 'chip-reward' }, px('coin'), h('span', null, '보상 ', h('span', { class: 'num' }, `+${day.minutes}`), ' XP')));
  meta.append(statusChip);
  return h(
    'header',
    { class: 'lesson-head' },
    h('p', { class: 'lesson-num', 'aria-hidden': 'true', dataset: { vt: `day-${day.id}` } }, h('span', { class: 'label' }, 'Day'), h('span', { class: 'num' }, String(day.num))),
    h('h1', null, h('span', { class: 'sr-only' }, `Day ${day.num} · `), day.title),
    meta,
  );
}

/** 완료 카드 맨 위 Label 줄: 트로피 도트 + 글자 (DESIGN.md "Day 완료 카드") */
const completionLabel = (text) => h('p', { class: 'completion-label label' }, px('trophy'), h('span', null, text));

/** 체크 칸 막대: 칸 수 = 항목 수, 채운 칸 = 체크한 수. 숫자는 상태 줄이 말하므로 장식 (DESIGN.md "Day 완료 카드") */
function checkBar(checked, total) {
  const bar = h('div', { class: 'check-bar', 'aria-hidden': 'true' }, h('span', { class: 'check-fill' }));
  bar.style.setProperty('--n', String(total));
  bar.style.setProperty('--p', String(checked / total));
  return bar;
}

function uncompleteReason(cur, prog, project, index) {
  const following = project.days[index + 1];
  if (following && isDone(prog, following.id)) return `다음 Day(Day ${following.num})를 이미 완료해서 되돌릴 수 없어요. 뒤쪽 Day부터 차례로 취소해야 해요.`;
  return '이 프로젝트를 이어받는 다음 프로젝트에 이미 진도가 있어서 되돌릴 수 없어요.';
}

/** 방금 새로 열린 프로젝트·페이지를 알리는 배너 */
function unlockBanner(ctx, ids) {
  const { cur } = ctx;
  const items = ids
    .map((id) => {
      const project = getProject(cur, id);
      if (project) return h('li', null, '프로젝트 ', h('a', { href: `#/project/${project.id}` }, project.title));
      const page = getPage(cur, id);
      return page ? h('li', null, '부록 ', h('a', { href: `#/page/${page.id}` }, page.title)) : null;
    })
    .filter(Boolean);
  return h('div', { class: 'unlock-banner', 'data-testid': 'unlock-banner', role: 'status' }, h('p', { class: 'label' }, '🎉 새로 열렸어요'), h('ul', null, items));
}

function dayNav(project, previous, next, projectDone) {
  const card = (rel, label, href, title) => h('a', { class: `nav-card nav-${rel}`, rel, href }, h('span', { class: 'label' }, label), h('strong', null, title));
  return h(
    'nav',
    { class: 'day-nav', 'aria-label': 'Day 이동' },
    previous ? card('prev', '← 이전', `#/day/${previous.id}`, `Day ${previous.num} · ${previous.title}`) : card('prev', '← 처음', `#/project/${project.id}`, '프로젝트 한눈에 보기'),
    next ? card('next', '다음 →', `#/day/${next.id}`, `Day ${next.num} · ${next.title}`) : card('next', projectDone ? '마무리 →' : '마지막 Day예요', `#/project/${project.id}`, projectDone ? '프로젝트 정리 보기' : '프로젝트 한눈에 보기'),
  );
}
