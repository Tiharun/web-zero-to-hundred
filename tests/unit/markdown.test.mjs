import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderMarkdown, slugify, LANG_MAP } from '../../textbook/lib/markdown.mjs';

const ctx = (over = {}) => ({
  idPrefix: 'p1-d01',
  terms: new Map(),
  routes: new Set(),
  ...over,
});
const render = (src, over) => renderMarkdown(src, ctx(over));
const codes = (r) => r.errors.map((e) => e.code);

test('raw HTML in prose is escaped', () => {
  const r = render('문단 <script>alert(1)</script> 끝');
  assert.ok(!r.html.includes('<script>'), r.html);
  assert.ok(r.html.includes('&lt;script&gt;'), r.html);
  assert.deepEqual(r.errors, []);

  const block = render('<div>x</div>');
  assert.ok(!block.html.includes('<div>'), block.html);
  assert.ok(block.html.includes('&lt;div&gt;x&lt;/div&gt;'), block.html);

  // 실행·레이아웃 파괴 경로를 하나씩 막는다
  for (const src of [
    '<h1>제목처럼</h1>',
    '문장 <img src=x onerror=alert(1)> 끝',
    '<script>if (a < b && c > d) { x(); }</script>',
    '<pre><img src=x onerror=alert(1)></pre>',
    '- 목록 <iframe src="https://example.com"></iframe>',
    '| a |\n|---|\n| <style>*{display:none}</style> |',
    '<!-- 숨긴 주석 -->',
  ]) {
    const out = render(src).html;
    assert.ok(!/<(script|h1|img|iframe|style|pre|div)\b/i.test(out), `${src}\n=> ${out}`);
    assert.ok(!/<!--/.test(out), `${src}\n=> ${out}`);
  }
});

test('raw HTML inside headings and lists is escaped too', () => {
  const heading = render('# 제목 <script>alert(1)</script>').html;
  assert.ok(!heading.includes('<script'), heading);
  assert.ok(heading.includes('&lt;script&gt;'), heading);
});

test('container renders with class and title', () => {
  const r = render(':::tip 꿀팁\n내용\n:::');
  assert.ok(r.html.includes('<aside class="callout callout-tip">'), r.html);
  assert.ok(r.html.includes('꿀팁'), r.html);
  assert.ok(r.html.includes('<p>내용</p>'), r.html);
  assert.deepEqual(r.errors, []);
  for (const kind of ['warn', 'info', 'path', 'success']) {
    assert.ok(render(`:::${kind}\nx\n:::`).html.includes(`callout callout-${kind}`), kind);
  }
});

test('answer container renders details', () => {
  const r = render(':::answer 과제 1 정답\n**굵게**\n:::');
  assert.ok(r.html.includes('<details class="answer" data-answer="p1-d01-a1">'), r.html);
  assert.match(r.html, /<summary><svg class="icon answer-chev"[^]*<span>과제 1 정답<\/span><\/summary>/);
  assert.ok(r.html.includes('<strong>굵게</strong>'), r.html);
  assert.equal(r.answerCount, 1);
  assert.deepEqual(r.errors, []);

  const two = render(':::answer 하나\na\n:::\n\n:::answer 둘\nb\n:::');
  assert.equal(two.answerCount, 2);
  assert.ok(two.html.includes('data-answer="p1-d01-a1"') && two.html.includes('data-answer="p1-d01-a2"'));
});

test('fence without language is an error', () => {
  const r = render('문단\n\n```\ncode\n```');
  assert.deepEqual(codes(r), ['E_FENCE_LANG']);
  assert.equal(r.errors[0].line, 3);
  assert.match(r.errors[0].message, /[가-힣]/);
  // 줄 번호는 컨테이너 안에서도 원문 기준이다
  const inBox = render('a\n\n:::tip\n```\nx\n```\n:::');
  assert.equal(inBox.errors[0].code, 'E_FENCE_LANG');
  assert.equal(inBox.errors[0].line, 4);
});

test('unknown fence language is an error', () => {
  const r = render('```cobol\nDISPLAY "HI".\n```');
  assert.deepEqual(codes(r), ['E_FENCE_LANG_UNKNOWN']);
  assert.equal(r.errors[0].line, 1);
  assert.ok(r.errors[0].message.includes('cobol'));
});

test('file caption attaches to following fence', () => {
  const r = render('📄 C:\\dev\\a\\index.html\n```html\n<p>x</p>\n```');
  assert.ok(r.html.includes('<figure class="code"'), r.html);
  assert.ok(r.html.includes('<figcaption>C:\\dev\\a\\index.html</figcaption>'), r.html);
  assert.ok(!/<p>[^<]*C:/.test(r.html), '경로 문단이 따로 남으면 안 돼요');
  assert.ok(!r.html.includes('📄'), r.html);
  // 하이라이트가 태그 이름을 span으로 감싸므로 `&lt;`와 hljs-name으로 확인한다
  assert.ok(r.html.includes('&lt;'), r.html);
  assert.ok(r.html.includes('<span class="hljs-name">p</span>'), r.html);
  assert.ok(!r.html.includes('<p>x</p>'), r.html);
  assert.ok(r.html.includes('<button class="copy"'), r.html);
  assert.deepEqual(r.errors, []);

  // 강조하지 않는 블록은 글자 그대로 escape된다
  const plain = render('```text\n<p>x</p>\n```');
  assert.ok(plain.html.includes('&lt;p&gt;x&lt;/p&gt;'), plain.html);
});

test('file caption works inside a numbered step and after prose', () => {
  const r = render('1. 파일을 만들어요.\n   📄 C:\\dev\\a\\a.html\n   ```html\n   <p>x</p>\n   ```\n2. 다음');
  assert.ok(r.html.includes('<figcaption>C:\\dev\\a\\a.html</figcaption>'), r.html);
  assert.ok(!r.html.includes('📄'), r.html);
  assert.deepEqual(r.errors, []);

  const after = render('앞 문장이에요.\n📄 C:\\dev\\b.css\n```css\na { color: red; }\n```');
  assert.ok(after.html.includes('<figcaption>C:\\dev\\b.css</figcaption>'), after.html);
  assert.ok(after.html.includes('<p>앞 문장이에요.</p>'), after.html);

  // 코드 블록 없이 홀로 있는 📄 줄은 평범한 문단이다
  const lone = render('📄 설명만 있어요');
  assert.ok(lone.html.includes('<p>📄 설명만 있어요</p>'), lone.html);
  assert.ok(!lone.html.includes('<figure'));
});

test('code block is highlighted', () => {
  const r = render('```js\nconst a = 1;\n```');
  assert.ok(r.html.includes('hljs-keyword'), r.html);
  assert.deepEqual(r.errors, []);
  assert.ok(r.html.includes('<figure class="code"'));
});

test('every allowed fence language maps to a registered highlighter', () => {
  for (const [lang, name] of Object.entries(LANG_MAP)) {
    // 등록되지 않은 highlight.js 언어면 렌더링 중에 예외가 난다
    const r = render('```' + lang + '\nx\n```');
    assert.deepEqual(r.errors, [], lang);
    assert.ok(r.html.includes(`language-${name}`), `${lang} -> ${name}`);
    assert.ok(r.html.includes(`data-lang="${lang}"`), lang);
  }
  assert.deepEqual(
    { ...LANG_MAP },
    {
      html: 'xml', xml: 'xml', css: 'css',
      js: 'javascript', javascript: 'javascript', jsx: 'javascript',
      ts: 'typescript', typescript: 'typescript', tsx: 'typescript',
      json: 'json', powershell: 'powershell', csharp: 'csharp', cs: 'csharp',
      sql: 'sql', rust: 'rust', toml: 'ini', dockerfile: 'dockerfile',
      yaml: 'yaml', yml: 'yaml', http: 'http', diff: 'diff',
      md: 'markdown', markdown: 'markdown', text: 'plaintext', plaintext: 'plaintext',
      bash: 'bash',
    },
  );
  assert.ok(Object.isFrozen(LANG_MAP));
});

test('task list items become tracked checkboxes', () => {
  const r = render('- [ ] 하나\n- [ ] 둘');
  assert.ok(r.html.includes('data-check="0"'), r.html);
  assert.ok(r.html.includes('data-check="1"'), r.html);
  assert.equal(r.checkCount, 2);
  assert.ok(!r.html.includes('disabled'), r.html);
  assert.ok(!r.html.includes('checked'), '저장된 진도만 체크 상태를 정해요');
  assert.ok(r.html.includes('type="checkbox"'));
  assert.ok(r.html.includes('aria-label="하나"'), r.html);

  // [x]로 써도 초기 상태는 항상 해제, 인덱스는 문서 순서
  const mixed = render('- [x] 먼저\n\n문단\n\n- [ ] 나중\n  - [ ] 안쪽');
  assert.equal(mixed.checkCount, 3);
  assert.ok(!mixed.html.includes('checked'), mixed.html);
  assert.ok(mixed.html.includes('data-check="2"'));
});

test('known term links to glossary', () => {
  const r = render('[[HTML]] 배우기', { terms: new Map([['HTML', 'html']]) });
  assert.ok(
    r.html.includes('<a class="term" href="#/page/glossary/term-html">HTML</a>'),
    r.html,
  );
  assert.deepEqual(r.errors, []);
});

test('unknown term is an error', () => {
  const r = render('[[CSS]] 배우기', { terms: new Map([['HTML', 'html']]) });
  assert.deepEqual(codes(r), ['E_TERM_UNKNOWN']);
  assert.equal(r.errors[0].line, 1);
  assert.ok(r.errors[0].message.includes('CSS'));
});

test('term syntax is ignored inside code', () => {
  const r = render('`[[CSS]]`\n\n```text\n[[CSS]]\n```');
  assert.deepEqual(r.errors, []);
  assert.ok(!r.html.includes('class="term"'));
});

test('internal link to unknown route is an error', () => {
  const bad = render('[x](#/day/p9-d01)', { routes: new Set(['#/day/p1-d01']) });
  assert.deepEqual(codes(bad), ['E_LINK_UNKNOWN']);
  assert.equal(bad.errors[0].line, 1);

  const ok = render('[x](#/day/p1-d01) 와 [y](#/page/start)', {
    routes: new Set(['#/day/p1-d01', '#/page/start']),
  });
  assert.deepEqual(ok.errors, []);
  assert.ok(ok.html.includes('<a href="#/day/p1-d01">x</a>'), ok.html);
  assert.ok(!ok.html.includes('target='), '내부 링크는 새 탭으로 열지 않아요');
});

test('external link opens safely', () => {
  const r = render('[MDN](https://developer.mozilla.org)');
  assert.ok(r.html.includes('target="_blank" rel="noopener noreferrer"'), r.html);
  assert.ok(r.html.includes('href="https://developer.mozilla.org"'), r.html);
  assert.deepEqual(r.errors, []);
});

test('unsafe or unsupported links and images are errors, not output', () => {
  const js = render('[클릭](javascript:alert(1))');
  assert.deepEqual(codes(js), ['E_LINK_UNSUPPORTED']);
  assert.ok(!js.html.includes('javascript:'), js.html);
  assert.ok(!js.html.includes('<a '), js.html);

  const rel = render('[파일](./a.html) [프로토콜](//evil.example/x)');
  assert.deepEqual(codes(rel), ['E_LINK_UNSUPPORTED', 'E_LINK_UNSUPPORTED']);

  const img = render('![고양이](https://example.com/cat.png)');
  assert.deepEqual(codes(img), ['E_IMAGE_UNSUPPORTED']);
  assert.ok(!img.html.includes('<img'), img.html);
});

test('headings get prefixed ids', () => {
  const r = render('## 🛠\uFE0F 따라하기\n\n### Node.js 설치');
  assert.ok(r.html.includes('<h2 id="p1-d01-따라하기">'), r.html);
  assert.deepEqual(r.headings, [
    { level: 2, text: '🛠\uFE0F 따라하기', id: 'p1-d01-따라하기' },
    { level: 3, text: 'Node.js 설치', id: 'p1-d01-nodejs-설치' },
  ]);
});

test('duplicate and empty headings still get unique ids', () => {
  const r = render('### 증상\n\n내용\n\n### 증상\n\n### 🎯');
  assert.deepEqual(
    r.headings.map((h) => h.id),
    ['p1-d01-증상', 'p1-d01-증상-2', 'p1-d01-section'],
  );
  // 접두사가 없어도 id가 '-'로 시작하지 않는다
  assert.equal(renderMarkdown('## 가나', { idPrefix: '', terms: new Map(), routes: new Set() }).headings[0].id, '가나');
});

test('heading text is plain text without markup', () => {
  const r = render('## `npm` **굵게** &lt;div&gt; [[HTML]]', { terms: new Map([['HTML', 'html']]) });
  assert.equal(r.headings[0].text, 'npm 굵게 <div> HTML');
});

test('slugify lowercases, hyphenates whitespace and strips other characters', () => {
  assert.equal(slugify('🛠\uFE0F 따라하기'), '따라하기');
  assert.equal(slugify('Hello World'), 'hello-world');
  assert.equal(slugify('  Node.js   v22 설치!  '), 'nodejs-v22-설치');
  assert.equal(slugify('a - - b'), 'a-b');
  assert.equal(slugify('--가--'), '가');
  assert.equal(slugify('😀'), '');
  assert.equal(slugify('under_score'), 'underscore');
});

test('container markers inside code fences are ignored', () => {
  const src = '```md\n:::tip 꿀팁\n안쪽\n:::\n```';
  const r = render(src);
  assert.deepEqual(r.errors, []);
  assert.ok(!r.html.includes('callout'), r.html);
  assert.ok(r.html.includes(':::tip'), r.html);

  // 컨테이너 안의 펜스에서도 같다
  const inBox = render(':::answer 정답\n```md\n:::tip x\n:::\n```\n:::');
  assert.deepEqual(inBox.errors, []);
  assert.equal(inBox.answerCount, 1);

  // 들여쓴 표식과 콜론 4개도 펜스 안에서는 그냥 코드다
  const indented = render('1. 단계\n   ```md\n   :::warn 주의\n   내용\n   :::\n   ::::tip\n   ```');
  assert.deepEqual(indented.errors, []);
  assert.ok(!indented.html.includes('callout'), indented.html);
  const colons = render('~~~md\n::::tip 꿀팁\n    :::\n~~~');
  assert.deepEqual(colons.errors, []);
});

test('indented container marker is an error', () => {
  const step = render('1. 단계\n   :::warn 주의\n   내용\n   :::');
  assert.deepEqual(codes(step), ['E_CONTAINER_INDENT', 'E_CONTAINER_INDENT']);
  assert.deepEqual(step.errors.map((e) => e.line), [2, 4]);
  assert.match(step.errors[0].message, /맨 앞/);
  assert.ok(!step.html.includes('callout'), step.html);

  const top = render('문단\n\n  :::tip 꿀팁\n  내용\n:::');
  assert.equal(top.errors[0].code, 'E_CONTAINER_INDENT');
  assert.equal(top.errors[0].line, 3);

  // 탭 들여쓰기도 같다
  assert.deepEqual(codes(render('문단\n\t:::info')), ['E_CONTAINER_INDENT']);
  // 문장 속의 콜론 세 개는 문제 없다
  assert.deepEqual(render('비율은 1:::2 가 아니에요').errors, []);
  assert.deepEqual(render('설명 :::tip 은 줄 맨 앞에서만').errors, []);
});

test('four colons is an error', () => {
  const r = render('::::tip 꿀팁\n내용\n::::');
  assert.deepEqual(codes(r), ['E_CONTAINER_INDENT', 'E_CONTAINER_INDENT']);
  assert.deepEqual(r.errors.map((e) => e.line), [1, 3]);
  assert.match(r.errors[0].message, /[가-힣]/);
  assert.ok(!r.html.includes('callout'), r.html);
  // 정상 컨테이너 안에서도 잡힌다
  const inBox = render(':::tip\n::::\n:::');
  assert.deepEqual(codes(inBox), ['E_CONTAINER_INDENT']);
  assert.equal(inBox.errors[0].line, 2);
});

test('nested container is an error', () => {
  const r = render(':::tip 바깥\n:::warn 안쪽\nx\n:::\n:::');
  assert.deepEqual(codes(r), ['E_CONTAINER_NESTED']);
  assert.equal(r.errors[0].line, 2);
});

test('unclosed container is an error', () => {
  const r = render('문단\n\n:::tip 열고\n닫지 않음');
  assert.deepEqual(codes(r), ['E_CONTAINER_UNCLOSED']);
  assert.equal(r.errors[0].line, 3);
});

test('unknown container type is an error', () => {
  const r = render(':::danger 위험\nx\n:::');
  assert.deepEqual(codes(r), ['E_CONTAINER_TYPE']);
  assert.equal(r.errors[0].line, 1);
  assert.ok(r.errors[0].message.includes('danger'));
});

test('stray container end and unclosed fence are errors', () => {
  assert.deepEqual(codes(render('문단\n:::')), ['E_CONTAINER_STRAY']);
  const open = render('```js\nconst a = 1;');
  assert.deepEqual(codes(open), ['E_FENCE_UNCLOSED']);
  assert.equal(open.errors[0].line, 1);
});

test('text entities written by authors keep their meaning', () => {
  const r = render('쓰려면 &lt;div&gt; 와 AT&T 와 \\<b\\>');
  assert.ok(r.html.includes('&lt;div&gt;'), r.html);
  assert.ok(r.html.includes('AT&amp;T'), r.html);
  assert.ok(!r.html.includes('<b>'), r.html);
});

test('CRLF sources render like LF sources', () => {
  const lf = render('## 제목\n\n```js\nconst a = 1;\n```\n\n:::tip\nx\n:::');
  const crlf = render('## 제목\r\n\r\n```js\r\nconst a = 1;\r\n```\r\n\r\n:::tip\r\nx\r\n:::');
  assert.equal(crlf.html, lf.html);
  assert.deepEqual(crlf.errors, []);
});

test('text strips markup for search', () => {
  const r = render(
    '## 제목\n\n**굵게** 와 [링크](https://example.com) 와 `인라인`\n\n:::tip 꿀팁\n상자 안\n:::\n\n```js\nconst a = 1;\n```\n\n- [ ] 체크',
  );
  assert.ok(!/<[a-z/!]/i.test(r.text), r.text);
  for (const word of ['제목', '굵게', '링크', '인라인', '꿀팁', '상자 안', 'const a = 1;', '체크']) {
    assert.ok(r.text.includes(word), `${word} :: ${r.text}`);
  }
  assert.ok(!r.text.includes('복사'), '복사 버튼 글자는 검색 대상이 아니에요');
  assert.ok(!r.text.includes('hljs'), r.text);
  // 문단 사이에 공백이 들어간다
  assert.ok(render('가\n\n나').text.includes('가 나'));
});

test('code content in search text is decoded', () => {
  const r = render('```html\n<p>x & y</p>\n```');
  assert.ok(r.text.includes('<p>x & y</p>'), r.text);
});

test('unrendered bold before Korean particle is an error', () => {
  const r = render('**x)**는');
  assert.deepEqual(codes(r), ['E_BOLD_UNRENDERED']);
  assert.equal(r.errors[0].line, 1);
  assert.match(r.errors[0].message, /굵게/);

  // 줄 번호는 원문 기준이고, 제목·목록·표·컨테이너 안에서도 잡힌다
  const deep = render('문단\n\n- 목록 **a)**가\n\n:::tip\n표는 **b)**를\n:::\n\n## 제목 **c)**는');
  assert.deepEqual(codes(deep), ['E_BOLD_UNRENDERED', 'E_BOLD_UNRENDERED', 'E_BOLD_UNRENDERED']);
  assert.deepEqual(deep.errors.map((e) => e.line), [3, 6, 9]);
});

test('rendered bold is fine', () => {
  const r = render('**용어**는 이런 뜻이에요. **x)** 는 괜찮고, **a** 와 **b** 도 괜찮아요.');
  assert.deepEqual(r.errors, []);
  assert.ok(r.html.includes('<strong>용어</strong>는'), r.html);
  // 백슬래시로 막은 별표는 작성자가 글자로 쓴 것이다
  assert.deepEqual(render('\\*\\*리터럴').errors, []);
});

test('asterisks in code are fine', () => {
  const r = render('인라인 `a ** b` 와\n\n```js\nconst x = 2 ** 3;\n```\n\n[링크](https://example.com/a**b)');
  assert.deepEqual(r.errors, []);
  assert.ok(r.html.includes('<code>a ** b</code>'), r.html);
  assert.ok(r.html.includes('</span> ** <span'), r.html);
  assert.ok(r.html.includes('href="https://example.com/a**b"'), r.html);
});

test('bare and angle-bracket URLs containing ** are not bold errors', () => {
  const bare = render('자세한 내용은 https://example.com/a**b 를 보세요.');
  assert.deepEqual(bare.errors, []);
  assert.ok(bare.html.includes('>https://example.com/a**b</a>'), bare.html);
  const angle = render('주소는 <https://example.com/a**b> 예요.');
  assert.deepEqual(angle.errors, []);
  assert.ok(angle.html.includes('>https://example.com/a**b</a>'), angle.html);
});

test('bold markers in container titles are errors', () => {
  const tip = render('문단\n\n:::tip 이름 **x)**는\n내용\n:::');
  assert.deepEqual(codes(tip), ['E_BOLD_UNRENDERED']);
  assert.equal(tip.errors[0].line, 3);
  const answer = render(':::answer **x)**는\n내용\n:::');
  assert.deepEqual(codes(answer), ['E_BOLD_UNRENDERED']);
  assert.equal(answer.errors[0].line, 1);
  // 별표가 없는 제목은 그대로 괜찮다
  assert.deepEqual(render(':::tip 꿀팁\n내용\n:::').errors, []);
});

test('unrendered bold reports the line it is on', () => {
  const r = render('첫 줄\n둘째 **x)**는');
  assert.deepEqual(codes(r), ['E_BOLD_UNRENDERED']);
  assert.equal(r.errors[0].line, 2);
  // 문단이 시작된 뒤 여러 줄 아래에 있어도 정확하다
  const deep = render('가\n\n나 나 나\n다 다\n라 **y)**는\n마');
  assert.equal(deep.errors[0].line, 5);
  // 앞 줄에 정상 굵게가 있어도 영향이 없다
  const mixed = render('**정상**이에요\n그리고 **z)**가');
  assert.equal(mixed.errors[0].line, 2);
});

test('stray ** gets a code-wrapping hint, broken pair gets the particle hint', () => {
  const stray = render('식은 2 ** 3 이에요.');
  assert.deepEqual(codes(stray), ['E_BOLD_UNRENDERED']);
  assert.match(stray.errors[0].message, /백틱/);
  assert.match(stray.errors[0].message, /짝이 없는/);
  const pair = render('**x)**는');
  assert.match(pair.errors[0].message, /조사/);
  assert.ok(!pair.errors[0].message.includes('백틱'));
});

test('result has the documented shape', () => {
  const r = render('안녕');
  assert.deepEqual(Object.keys(r).sort(), [
    'answerCount', 'checkCount', 'errors', 'headings', 'html', 'text',
  ]);
  assert.equal(r.checkCount, 0);
  assert.equal(r.answerCount, 0);
  assert.deepEqual(r.headings, []);
  assert.deepEqual(r.errors, []);
});

// ───────── 🧯 증상 Accordion (M10, DESIGN.md "Day 증상 Accordion") ─────────

const TROUBLE = [
  '## 🧯 자주 막히는 곳',
  '',
  '먼저 이것부터 확인해요.',
  '',
  '### 증상 A',
  '',
  '원인을 찾아요.',
  '',
  '```html',
  '<p>x</p>',
  '```',
  '',
  ':::tip 꿀팁',
  '저장부터 해요.',
  ':::',
  '',
  '### 증상 B',
  '',
  '1. 하나',
  '2. 둘',
  '',
  '## 📝 오늘의 체크리스트',
  '',
  '- [ ] 하나',
].join('\n');
const count = (s, needle) => s.split(needle).length - 1;

test('symptom h3s under the 🧯 section become ts-entry details', () => {
  const { html, errors } = render(TROUBLE, { idPrefix: 'x', symptoms: true });
  assert.deepEqual(errors, []);
  assert.equal(count(html, '<details class="ts-entry"'), 2, html);
  assert.ok(html.includes('id="x-증상-a"'), html);
  assert.ok(html.includes('id="x-증상-b"'), html);
  assert.equal(count(html, '<h3'), 0, html);
  assert.ok(html.indexOf('먼저 이것부터') < html.indexOf('<details'), '안내 단락은 첫 증상 앞');
  const firstClose = html.indexOf('</details>');
  assert.ok(html.indexOf('<figure class="code"') < firstClose, '코드 블록은 첫 증상 안');
  assert.ok(html.indexOf('callout-tip') < firstClose, '알림 상자는 첫 증상 안');
  assert.ok(html.indexOf('callout-tip') > html.indexOf('<details'), '알림 상자는 첫 증상 안');
  assert.equal(count(html, '</details>'), 2);
  assert.ok(html.lastIndexOf('</details>') < html.lastIndexOf('<h2'), '다음 h2 는 증상 밖');
  assert.ok(html.includes('<summary><svg class="icon ts-chev"'), html);
  assert.ok(html.includes('<span class="ts-title">증상 A</span>'), html);
});

test('h3s stay headings outside the 🧯 section or without the symptoms option', () => {
  const steps = render('## 🛠️ 따라 하기\n\n### 단계\n\n글', { idPrefix: 'x', symptoms: true }).html;
  assert.ok(steps.includes('<h3 id='), steps);
  assert.equal(count(steps, '<details'), 0);
  assert.equal(count(render(TROUBLE, { idPrefix: 'x' }).html, 'ts-entry'), 0);
});

test('a symptom section that ends the document closes its details', () => {
  const { html } = render('## 🧯 자주 막히는 곳\n\n### 증상\n\n글', { idPrefix: 'x', symptoms: true });
  assert.equal(count(html, '<details'), 1, html);
  assert.equal(count(html, '</details>'), 1, html);
  assert.ok(html.trimEnd().endsWith('</details>'), html);
});

test('answer summary carries a chevron icon', () => {
  const { html } = render(':::answer 과제 1 정답\n답이에요.\n:::');
  assert.match(html, /<summary><svg class="icon answer-chev"[^]*<\/svg><span>과제 1 정답<\/span><\/summary>/);
});
