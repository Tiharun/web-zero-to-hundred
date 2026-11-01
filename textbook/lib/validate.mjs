// Day 소스(Markdown) 구조 검증. 렌더링은 하지 않고 섹션·체크리스트·자리표시자만 본다.
import { Marked } from 'marked';
import { fenceMask, normalizeSource, parseContainerOpen } from './markdown.mjs';

// 필수 h2 제목, 정해진 순서. 비교할 때 U+FE0F(변형 선택자)는 양쪽에서 무시한다.
const REQUIRED_SECTIONS = [
  '🎯 오늘의 목표',
  '📖 개념 이해',
  '🛠️ 따라하기',
  '✍️ 과제',
  '✅ 정답',
  '🧯 자주 막히는 곳',
  '📝 오늘의 체크리스트',
];
const OPTIONAL_LAST_SECTION = '📚 더 알아보기';

const ANSWER_SECTION = '✅ 정답';
const CHECKLIST_SECTION = '📝 오늘의 체크리스트';
const MIN_CHECKLIST_ITEMS = 3;

const PLACEHOLDER = /\b(?:TODO|TBD|FIXME)\b|작성 예정/;
const TASK_ITEM = /^\s*(?:[-*+]|\d+[.)])\s+\[[ xX]\]\s+\S/;

const key = (title) => title.replace(/️/g, '').replace(/\s+/g, ' ').trim();
const REQUIRED_KEYS = REQUIRED_SECTIONS.map(key);
const OPTIONAL_KEY = key(OPTIONAL_LAST_SECTION);
const countNewlines = (s) => (s.match(/\n/g) ?? []).length;

const buildError = (code, line, message) => ({ code, line, message });

/**
 * @param {string} src Day 파일 원문
 * @param {{ minChars: number }} opts
 * @returns {{ code: string, line: number|null, message: string }[]} 줄 번호 순(줄 없는 오류는 맨 뒤)
 */
export function validateDaySource(src, { minChars = 0 } = {}) {
  const text = normalizeSource(src);
  const lines = text.split('\n');
  const inFence = fenceMask(lines);
  const errors = [];

  // 코드 펜스 안의 '#'은 제목이 아니므로 줄 번호는 marked 토큰의 원문 길이로 센다.
  const h2s = [];
  let line = 1;
  for (const token of new Marked().lexer(text)) {
    if (token.type === 'heading' && token.depth === 1) {
      errors.push(
        buildError('E_H1', line, 'Day 본문에는 # 제목(h1)을 쓸 수 없어요. 제목은 화면에서 자동으로 붙어요.'),
      );
    }
    if (token.type === 'heading' && token.depth === 2) {
      h2s.push({ line, title: token.text.replace(/\s+/g, ' ').trim(), key: key(token.text) });
    }
    line += countNewlines(token.raw);
  }

  // 모르는 제목, 그리고 마지막이 아닌 '더 알아보기'
  h2s.forEach((h, i) => {
    if (h.key === OPTIONAL_KEY) {
      if (i !== h2s.length - 1) {
        errors.push(
          buildError('E_SECTION_UNKNOWN', h.line, `"## ${h.title}" 는 맨 마지막 섹션으로만 둘 수 있어요.`),
        );
      }
    } else if (!REQUIRED_KEYS.includes(h.key)) {
      errors.push(
        buildError(
          'E_SECTION_UNKNOWN',
          h.line,
          `정해진 섹션이 아니에요: "## ${h.title}" (필수 섹션과 선택 섹션 "## ${OPTIONAL_LAST_SECTION}" 만 쓸 수 있어요)`,
        ),
      );
    }
  });

  // 빠진 필수 섹션
  REQUIRED_SECTIONS.forEach((title, i) => {
    if (!h2s.some((h) => h.key === REQUIRED_KEYS[i])) {
      errors.push(buildError('E_SECTION_MISSING', null, `필수 섹션이 없어요: "## ${title}"`));
    }
  });

  // 순서 (같은 섹션이 두 번 나오는 것도 여기서 잡힌다). 처음 어긋난 곳 한 군데만 알린다.
  const known = h2s
    .map((h) => ({ ...h, index: REQUIRED_KEYS.indexOf(h.key) }))
    .filter((h) => h.index >= 0);
  for (let i = 1; i < known.length; i++) {
    const prev = known[i - 1];
    const cur = known[i];
    if (cur.index > prev.index) continue;
    errors.push(
      buildError(
        'E_SECTION_ORDER',
        cur.line,
        cur.index === prev.index
          ? `같은 섹션이 두 번 나와요: "## ${cur.title}"`
          : `섹션 순서가 달라요: "## ${cur.title}" 는 "## ${prev.title}" 보다 앞에 와야 해요.`,
      ),
    );
    break;
  }

  // 섹션 안쪽 검사 (코드 펜스 안의 줄은 제외)
  const section = (title) => {
    const at = h2s.findIndex((h) => h.key === key(title));
    if (at < 0) return null;
    const from = h2s[at].line; // 제목 다음 줄(0부터 세면 제목 줄 번호가 곧 다음 줄 인덱스)
    const to = at + 1 < h2s.length ? h2s[at + 1].line - 1 : lines.length;
    return { heading: h2s[at], indexes: Array.from({ length: Math.max(to - from, 0) }, (_, k) => from + k) };
  };
  const outsideFences = (s) => s.indexes.filter((i) => !inFence[i]).map((i) => lines[i]);

  const answer = section(ANSWER_SECTION);
  if (answer && !outsideFences(answer).some((l) => parseContainerOpen(l)?.kind === 'answer')) {
    errors.push(
      buildError('E_ANSWER_MISSING', answer.heading.line, '"## ✅ 정답" 섹션에 :::answer 블록이 없어요.'),
    );
  }

  const checklist = section(CHECKLIST_SECTION);
  if (checklist) {
    const items = outsideFences(checklist).filter((l) => TASK_ITEM.test(l)).length;
    if (items < MIN_CHECKLIST_ITEMS) {
      errors.push(
        buildError(
          'E_CHECKLIST_SHORT',
          checklist.heading.line,
          `체크리스트 항목이 ${items}개예요. - [ ] 항목을 ${MIN_CHECKLIST_ITEMS}개 이상 써 주세요.`,
        ),
      );
    }
  }

  // 자리표시자
  lines.forEach((l, i) => {
    const m = PLACEHOLDER.exec(l);
    if (m) {
      errors.push(buildError('E_PLACEHOLDER', i + 1, `아직 채우지 않은 자리표시자가 있어요: "${m[0]}"`));
    }
  });

  if (text.length < minChars) {
    errors.push(
      buildError('E_TOO_SHORT', null, `본문이 너무 짧아요: ${text.length}자 (최소 ${minChars}자)`),
    );
  }

  return errors.sort((a, b) => (a.line ?? Infinity) - (b.line ?? Infinity) || 0);
}
