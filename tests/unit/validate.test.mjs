import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateDaySource } from '../../textbook/lib/validate.mjs';

// U+FE0F(변형 선택자)를 명시해 둔다. 에디터가 지워도 테스트 의도가 유지된다.
const T = {
  goal: '🎯 오늘의 목표',
  concept: '📖 개념 이해',
  steps: '🛠\uFE0F 따라하기',
  task: '✍\uFE0F 과제',
  answer: '✅ 정답',
  stuck: '🧯 자주 막히는 곳',
  check: '📝 오늘의 체크리스트',
  more: '📚 더 알아보기',
};

const BODY = {
  [T.goal]: '- 웹 페이지를 열 수 있어요\n- 예상 시간: 60분',
  [T.concept]: '웹 페이지는 집과 비슷해요. 정확히는 HTML 문서예요.',
  [T.steps]: '1. 폴더를 만들어요.\n\n```powershell\nmkdir C:\\dev\\my-creator-site\n```',
  [T.task]: '1. 제목을 바꿔 보세요. (쉬움)',
  [T.answer]: ':::answer 과제 1 정답\n`<h1>` 안의 글자를 바꿔요.\n:::',
  [T.stuck]: '증상: 화면이 비어 있어요. 원인: 저장하지 않았어요. 해결: Ctrl+S를 눌러요.',
  [T.check]: '- [ ] 폴더를 만들었어요\n- [ ] 파일을 저장했어요\n- [ ] 브라우저에서 열었어요',
  [T.more]: '- [MDN](https://developer.mozilla.org)',
};

const ORDER = [T.goal, T.concept, T.steps, T.task, T.answer, T.stuck, T.check];

function day(titles = ORDER, overrides = {}) {
  return titles
    .map((t) => `## ${t}\n\n${overrides[t] ?? BODY[t]}\n`)
    .join('\n');
}

const codes = (errors) => errors.map((e) => e.code);
const validate = (src, minChars = 50) => validateDaySource(src, { minChars });

test('valid day passes', () => {
  assert.deepEqual(validate(day()), []);
  assert.deepEqual(validate(day([...ORDER, T.more])), []);
  // Windows 줄바꿈도 같다
  assert.deepEqual(validate(day().replace(/\n/g, '\r\n')), []);
});

test('missing section', () => {
  const titles = ORDER.filter((t) => t !== T.concept);
  const errors = validate(day(titles));
  assert.deepEqual(codes(errors), ['E_SECTION_MISSING']);
  assert.ok(errors[0].message.includes('개념 이해'), errors[0].message);
  assert.match(errors[0].message, /[가-힣]/);

  // 여러 개가 빠지면 하나씩 알려 준다
  const two = validate(day(ORDER.filter((t) => t !== T.goal && t !== T.stuck)));
  assert.deepEqual(codes(two), ['E_SECTION_MISSING', 'E_SECTION_MISSING']);
});

test('wrong order', () => {
  const titles = [...ORDER];
  [titles[1], titles[2]] = [titles[2], titles[1]];
  const errors = validate(day(titles));
  assert.deepEqual(codes(errors), ['E_SECTION_ORDER']);
  assert.equal(typeof errors[0].line, 'number');

  // 같은 섹션이 두 번 나와도 순서 오류다
  const dup = validate(day([...ORDER, T.check]));
  assert.deepEqual(codes(dup), ['E_SECTION_ORDER']);
});

test('variation selector tolerated', () => {
  const titles = ORDER.map((t) => t.replace(/\uFE0F/g, ''));
  assert.deepEqual(validate(day(titles)), []);
  // 반대로 FE0F가 붙은 쪽도 통과한다
  const withSel = day().replace('## 🎯 ', '## 🎯\uFE0F ');
  assert.deepEqual(validate(withSel), []);
  // 공백 개수 차이는 무시한다
  assert.deepEqual(validate(day().replace('## ✅ 정답', '##  ✅   정답')), []);
});

test('extra h2 not allowed', () => {
  const extra = day(ORDER) + '\n## 🍕 보너스\n\n내용이에요.\n';
  const errors = validate(extra);
  assert.deepEqual(codes(errors), ['E_SECTION_UNKNOWN']);
  assert.ok(errors[0].message.includes('보너스'));

  // 📚 더 알아보기는 마지막에만 허용된다
  assert.deepEqual(validate(day([...ORDER, T.more])), []);
  const middle = [...ORDER.slice(0, 6), T.more, T.check];
  assert.deepEqual(codes(validate(day(middle))), ['E_SECTION_UNKNOWN']);
  const notLast = day([...ORDER, T.more]) + '\n## 🍕 보너스\n\n내용이에요.\n';
  assert.ok(codes(validate(notLast)).includes('E_SECTION_UNKNOWN'));
});

test('h1 not allowed', () => {
  const errors = validate('# Day 1 제목\n\n' + day());
  assert.deepEqual(codes(errors), ['E_H1']);
  assert.equal(errors[0].line, 1);
});

test('headings inside code fences are not sections', () => {
  const withFence = day(ORDER, {
    [T.steps]: '```md\n# 제목\n## 가짜 섹션\n```',
  });
  assert.deepEqual(validate(withFence), []);
});

test('answer section needs :::answer', () => {
  const errors = validate(day(ORDER, { [T.answer]: '정답은 나중에 알려 줄게요.' }));
  assert.deepEqual(codes(errors), ['E_ANSWER_MISSING']);
  // 다른 섹션에 있는 :::answer는 세지 않는다
  const elsewhere = validate(
    day(ORDER, {
      [T.answer]: '정답은 나중에 알려 줄게요.',
      [T.task]: ':::answer 엉뚱한 곳\nx\n:::',
    }),
  );
  assert.deepEqual(codes(elsewhere), ['E_ANSWER_MISSING']);
  // 코드 펜스 안의 :::answer도 세지 않는다
  const fenced = validate(
    day(ORDER, { [T.answer]: '```md\n:::answer 예시\nx\n:::\n```' }),
  );
  assert.deepEqual(codes(fenced), ['E_ANSWER_MISSING']);
});

test('checklist needs >= 3 items', () => {
  const errors = validate(day(ORDER, { [T.check]: '- [ ] 하나\n- [ ] 둘' }));
  assert.deepEqual(codes(errors), ['E_CHECKLIST_SHORT']);
  const none = validate(day(ORDER, { [T.check]: '체크할 것이 없어요.' }));
  assert.deepEqual(codes(none), ['E_CHECKLIST_SHORT']);
  // 코드 펜스 안의 항목은 세지 않는다
  const fenced = validate(
    day(ORDER, { [T.check]: '- [ ] 하나\n- [ ] 둘\n\n```md\n- [ ] 셋\n```' }),
  );
  assert.deepEqual(codes(fenced), ['E_CHECKLIST_SHORT']);
  assert.deepEqual(validate(day(ORDER, { [T.check]: '- [ ] 1\n- [x] 2\n* [ ] 3\n1. [ ] 4' })), []);
});

test('placeholder text rejected', () => {
  for (const word of ['TODO', 'TBD', 'FIXME', '작성 예정']) {
    const errors = validate(day(ORDER, { [T.concept]: `여기는 ${word} 이에요.` }));
    assert.deepEqual(codes(errors), ['E_PLACEHOLDER'], word);
    assert.equal(typeof errors[0].line, 'number');
    assert.ok(errors[0].message.includes(word), errors[0].message);
  }
  // 다른 낱말의 일부는 걸리지 않는다
  assert.deepEqual(validate(day(ORDER, { [T.concept]: 'todo 앱과 Autodoc 문서' })), []);
});

test('too short rejected', () => {
  const src = day();
  assert.deepEqual(validate(src, src.length), []);
  const errors = validate(src, src.length + 1);
  assert.deepEqual(codes(errors), ['E_TOO_SHORT']);
  assert.equal(errors[0].line, null);
  assert.match(errors[0].message, /[가-힣]/);
});

test('errors are sorted by line with line-less errors last', () => {
  const src = '# 제목\n\n' + day(ORDER.filter((t) => t !== T.concept)) + '\nTODO\n';
  const errors = validate(src, 100000);
  const lines = errors.map((e) => e.line);
  const numeric = lines.filter((l) => l !== null);
  assert.deepEqual(numeric, [...numeric].sort((a, b) => a - b));
  assert.equal(lines.at(-1), null);
  assert.ok(codes(errors).includes('E_H1'));
  assert.ok(codes(errors).includes('E_SECTION_MISSING'));
  assert.ok(codes(errors).includes('E_PLACEHOLDER'));
  assert.ok(codes(errors).includes('E_TOO_SHORT'));
});
