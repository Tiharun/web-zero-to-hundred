// Day 화면: 본문 템플릿을 붙이고, 체크박스·정답 게이트·코드 복사·완료 버튼을 연결한다.
import { reveal } from '../motion.js';
import { canComplete, canUncomplete, completeDay, dayState, isProjectComplete, newlyUnlocked, toggleCheck, uncompleteDay } from '../progress.js';
import { breadcrumb, findDay, getPage, getProject, h, isDone, lockScreen, minutesText } from './common.js';

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
            class: 'btn btn-primary',
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

// ───────── 체크박스 ─────────

function bindChecklist(ctx, dayId, body, onChange) {
  const boxes = [...body.querySelectorAll('input[type="checkbox"][data-check]')];
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

// ───────── 목차 ─────────

function outline(body) {
  const headings = [...body.querySelectorAll('h2[id]')];
  if (headings.length < 2) return null;
  return h(
    'nav',
    { class: 'day-outline', 'aria-label': '이 Day의 순서' },
    h('p', { class: 'outline-title' }, '이 Day의 순서'),
    h(
      'ol',
      null,
      headings.map((heading) =>
        h(
          'li',
          null,
          h(
            'button',
            {
              type: 'button',
              onclick: () => {
                heading.scrollIntoView();
                heading.tabIndex = -1;
                heading.focus({ preventScroll: true });
              },
            },
            heading.textContent,
          ),
        ),
      ),
    ),
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

  const previous = project.days[index - 1] ?? null;
  const next = project.days[index + 1] ?? null;
  const body = h('div', { class: 'lesson-body' });
  body.append(template.content.cloneNode(true));

  const statusChip = h('span', { class: 'chip' });
  const checklist = bindChecklist(ctx, dayId, body, () => renderFooter());
  bindAnswerGate(body);
  bindCopyButtons(ctx, body);

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
          { class: 'completion is-done', 'aria-label': 'Day 완료' },
          h('p', { class: 'completion-status', id: 'completion-status', tabindex: '-1' }, `✅ Day ${day.num} 완료! 오늘도 한 걸음 나아갔어요.`),
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
          { class: 'completion', 'aria-label': 'Day 완료' },
          h('p', { class: 'completion-status', id: 'completion-status', tabindex: '-1' }, checks ?? '오늘 할 일을 마쳤나요?'),
          h(
            'div',
            { class: 'completion-actions' },
            h('button', { class: 'btn btn-primary', type: 'button', 'data-testid': 'complete-button', disabled: !allowed, 'aria-describedby': allowed ? null : reasonId, onclick: complete }, 'Day 완료'),
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

  function complete() {
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
    document.getElementById('completion-status')?.focus({ preventScroll: true });
    ctx.announce(`Day ${day.num} 완료했어요.` + (justUnlocked.length > 0 ? ' 새로 열린 곳이 있어요.' : ''));
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

  const toc = outline(body);
  renderFooter();
  root.append(
    h(
      'article',
      { class: 'lesson', dataset: { dayId } },
      breadcrumb({ text: '홈', href: '#/' }, { text: project.title, href: `#/project/${project.id}` }, { text: `Day ${day.num}` }),
      h(
        'header',
        { class: 'lesson-head' },
        h('h1', null, `Day ${day.num} · ${day.title}`),
        h('p', { class: 'lesson-meta' }, `${project.title} · ${index + 1} / ${project.days.length} · ${minutesText(day.minutes)}`, ' ', statusChip),
        toc,
      ),
      body,
      footer,
    ),
  );
  ctx.onCleanup(reveal(body.querySelectorAll('h2[id]'))); // 개편 설계서 6.3: Day 섹션 제목은 보일 때 올라온다
  return `Day ${day.num} · ${day.title}`;
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
  return h('div', { class: 'unlock-banner', 'data-testid': 'unlock-banner', role: 'status' }, h('p', null, h('strong', null, '🎉 새로 열렸어요!')), h('ul', null, items));
}

function dayNav(project, previous, next, projectDone) {
  const card = (rel, label, href, title) => h('a', { class: `nav-card nav-${rel}`, rel, href }, h('span', { class: 'nav-label' }, label), h('strong', null, title));
  return h(
    'nav',
    { class: 'day-nav', 'aria-label': 'Day 이동' },
    previous ? card('prev', '← 이전', `#/day/${previous.id}`, `Day ${previous.num} · ${previous.title}`) : card('prev', '← 처음', `#/project/${project.id}`, '프로젝트 한눈에 보기'),
    next ? card('next', '다음 →', `#/day/${next.id}`, `Day ${next.num} · ${next.title}`) : card('next', projectDone ? '마무리 →' : '마지막 Day예요', `#/project/${project.id}`, projectDone ? '프로젝트 정리 보기' : '프로젝트 한눈에 보기'),
  );
}
