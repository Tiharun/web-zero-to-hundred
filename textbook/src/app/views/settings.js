// 설정: 테마, 진도 백업(내보내기·불러오기), 진도 초기화, 교재 정보.
import { emptyProgress, exportBackup, importBackup } from '../progress.js';
import { h } from './common.js';

const THEME_OPTIONS = [
  ['system', '기기 설정 따르기'],
  ['light', '밝게'],
  ['dark', '어둡게'],
];

const pad = (n) => String(n).padStart(2, '0');
const localDate = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/** 글자를 파일로 내려받게 한다 */
function download(filename, text) {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const link = h('a', { href: url, download: filename, hidden: true });
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export function renderSettings(ctx, root) {
  const { cur } = ctx;
  const message = h('p', { class: 'message', 'data-testid': 'import-message', role: 'status', 'aria-live': 'polite' });

  const showMessage = (text, kind) => {
    message.textContent = text;
    message.dataset.kind = kind;
  };

  async function onImport(event) {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;
    let text;
    try {
      text = await file.text();
    } catch {
      showMessage('파일을 읽지 못했어요. 다른 파일로 다시 해 보세요.', 'error');
      input.value = '';
      return;
    }
    input.value = ''; // 같은 파일을 다시 골라도 change 가 일어나게 비운다
    const result = importBackup(text, cur);
    if (!result.ok) {
      showMessage(result.error, 'error');
      return;
    }
    const days = Object.keys(result.progress.completed).length;
    if (!window.confirm(`지금 진도를 백업 파일의 진도로 바꿀까요?\n\n백업 파일에는 완료한 Day가 ${days}개 있어요. 지금 진도는 사라지고 되돌릴 수 없어요.`)) {
      showMessage('가져오기를 취소했어요. 지금 진도는 그대로예요.', 'info');
      return;
    }
    ctx.commit({ ...result.progress, theme: ctx.prog.theme }); // 테마는 이 기기의 취향이라 그대로 둔다
    const skipped = result.dropped > 0 ? ` 이 교재에 없는 Day ${result.dropped}개는 건너뛰었어요.` : '';
    showMessage(`진도를 가져왔어요. 완료한 Day ${days}개를 불러왔어요.${skipped}`, 'ok');
    ctx.announce('진도를 가져왔어요.');
  }

  function onReset() {
    if (!window.confirm('모든 진도를 지울까요?\n\n완료한 Day와 체크리스트 기록이 모두 사라지고 되돌릴 수 없어요. 먼저 백업 파일을 내보내 두면 안전해요.')) return;
    ctx.commit({ ...emptyProgress(), theme: ctx.prog.theme });
    ctx.setNotice('진도를 모두 지웠어요. 처음부터 천천히 다시 시작해 봐요.');
    ctx.go('#/');
  }

  const saved = ctx.store.available;
  // 윗줄의 테마 버튼으로 바꿔도 이 화면의 선택이 따라가게 한다
  ctx.onChange(() => {
    for (const radio of root.querySelectorAll('input[name="theme"]')) radio.checked = radio.value === ctx.prog.theme;
  });
  root.append(
    h(
      'div',
      { class: 'settings' },
      h('h1', null, '설정'),

      h(
        'section',
        { class: 'panel' },
        h('h2', null, '화면 모양'),
        h(
          'div',
          { class: 'radio-row', role: 'radiogroup', 'aria-label': '테마' },
          THEME_OPTIONS.map(([value, label]) =>
            h('label', { class: 'radio' }, h('input', { type: 'radio', name: 'theme', value, checked: ctx.prog.theme === value, onchange: () => ctx.setTheme(value) }), label),
          ),
        ),
      ),

      h(
        'section',
        { class: 'panel' },
        h('h2', null, '진도 백업'),
        h('p', { class: saved ? 'muted' : 'warn-text' }, saved ? '진도는 이 브라우저 안에 저장돼요. 브라우저 기록을 지우거나 다른 컴퓨터로 옮길 때는 백업 파일이 필요해요.' : '이 브라우저에서는 진도를 저장할 수 없어요. 이 창을 닫기 전에 꼭 백업 파일을 내보내 두세요.'),
        h(
          'div',
          { class: 'button-row' },
          h('button', { class: 'btn', type: 'button', 'data-testid': 'export-button', onclick: () => download(`web-zero-to-hundred-progress-${localDate(new Date())}.json`, exportBackup(ctx.prog, ctx.now())) }, '진도 내보내기'),
          h('label', { class: 'btn file-btn' }, '진도 불러오기', h('input', { class: 'sr-only', type: 'file', accept: '.json,application/json', 'data-testid': 'import-input', onchange: onImport })),
        ),
        message,
      ),

      h(
        'section',
        { class: 'panel' },
        h('h2', null, '진도 초기화'),
        h('p', { class: 'muted' }, '처음부터 다시 하고 싶을 때만 눌러 주세요. 먼저 백업 파일을 내보내 두면 안전해요.'),
        h('div', { class: 'button-row' }, h('button', { class: 'btn btn-danger', type: 'button', 'data-testid': 'reset-button', onclick: onReset }, '진도 모두 지우기')),
      ),

      h('section', { class: 'panel' }, h('h2', null, '이 교재에 대해'), h('p', { class: 'muted' }, `${cur.title} · 작성 기준일 ${cur.writtenAt} · 빌드 ${cur.builtAt}`)),
    ),
  );
  return '설정';
}
