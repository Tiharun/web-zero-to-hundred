import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assemble } from '../../textbook/lib/assemble.mjs';

const TEMPLATE = `<!doctype html>
<html lang="ko"><head>
<!--WZH:HEAD-->
<!--WZH:CSS-->
</head><body>
<!--WZH:DATA-->
<!--WZH:TEMPLATES-->
<!--WZH:JS-->
</body></html>`;

const base = () => ({
  templateHtml: TEMPLATE,
  css: 'body{margin:0}',
  js: '(()=>{})();',
  data: { title: '교재', projects: [] },
  templates: [{ id: 't-day-fa-d01', html: '<p>안녕</p>' }],
  head: '<title>t</title>',
  title: '교재',
});

/** 결과에서 데이터 스크립트의 JSON만 꺼내 파싱한다 */
function readData(html) {
  const m = /<script id="wzh-data" type="application\/json">([\s\S]*?)<\/script>/.exec(html);
  assert.ok(m, 'wzh-data script not found');
  return { raw: m[1], parsed: JSON.parse(m[1]) };
}

test('fills the four placeholders', () => {
  const out = assemble(base());
  assert.doesNotMatch(out, /<!--WZH:/);
  assert.match(out, /<style>body\{margin:0\}<\/style>/);
  assert.match(out, /<template id="t-day-fa-d01"><p>안녕<\/p><\/template>/);
  assert.match(out, /<script>\(\(\)=>\{\}\)\(\);<\/script>/);
  assert.deepEqual(readData(out).parsed, { title: '교재', projects: [] });
  // 순서: 스타일 → 데이터 → 템플릿 → 스크립트
  const at = (s) => out.indexOf(s);
  assert.ok(at('<style>') < at('wzh-data') && at('wzh-data') < at('<template') && at('<template') < at('<script>('));
});

test('embedded data cannot break out of the script element', () => {
  const evil = {
    a: '</script><script>alert(1)</script>',
    b: '<!-- <script>',
    c: 'line\u2028sep\u2029end',
    d: '"quote" \\ back',
  };
  const out = assemble({ ...base(), data: evil });
  const { raw, parsed } = readData(out);
  assert.deepEqual(parsed, evil); // 되돌리면 원본과 같다
  assert.ok(!raw.includes('</'), raw);
  assert.ok(raw.includes('<\\/script>'));
  assert.ok(!raw.includes('<!--'));
  assert.ok(!raw.includes('\u2028') && !raw.includes('\u2029'));
  // 문서 전체에서 </script> 는 우리가 닫는 것만 남는다
  assert.equal((out.match(/<\/script>/gi) ?? []).length, 2);
});

test('$ patterns in css, js and data are inserted literally', () => {
  const css = 'a::after{content:"$&$1$`$\'"}';
  const js = 'var s = "$& $1 $$ $` $\'";';
  const out = assemble({ ...base(), css, js, data: { s: "$& $' $$" } });
  assert.ok(out.includes(`<style>${css}</style>`));
  assert.ok(out.includes(`<script>${js}</script>`));
  assert.deepEqual(readData(out).parsed, { s: "$& $' $$" });
});

test('placeholder-looking text inside content is not expanded again', () => {
  const out = assemble({ ...base(), css: '/* <!--WZH:JS--> */', templates: [{ id: 't-page-x', html: '<p>&lt;!--WZH:DATA--&gt;</p>' }] });
  assert.equal((out.match(/<script id="wzh-data"/g) ?? []).length, 1);
  assert.ok(out.includes('/* <!--WZH:JS--> */'));
});

test('script and style content is made safe', () => {
  const js = 'var a="</script><b>";var c="<!--";';
  const out = assemble({ ...base(), js });
  assert.equal((out.match(/<\/script>/gi) ?? []).length, 2); // 데이터 스크립트 + 코드 스크립트의 닫는 태그만
  assert.ok(!out.includes('<!--";'), 'raw <!-- must not survive in script');
  // 이스케이프한 코드는 같은 값으로 실행된다
  const run = new Function(`${/<script>(var a[\s\S]*?)<\/script>/.exec(out)[1]}; return [a, c];`);
  assert.deepEqual(run(), ['</script><b>', '<!--']);
  assert.throws(() => assemble({ ...base(), css: 'a{}</style><script>x</script>' }), /style/i);
});

test('template ids must be t-day-* or t-page-* and unique', () => {
  assert.throws(() => assemble({ ...base(), templates: [{ id: 'bad id"', html: '' }] }), /id/);
  assert.throws(() => assemble({ ...base(), templates: [{ id: 'other-x', html: '' }] }), /id/);
  assert.throws(
    () => assemble({ ...base(), templates: [{ id: 't-day-a', html: '' }, { id: 't-day-a', html: '' }] }),
    /t-day-a/,
  );
});

test('placeholders must each appear exactly once', () => {
  assert.throws(() => assemble({ ...base(), templateHtml: TEMPLATE.replace('<!--WZH:JS-->', '') }), /WZH:JS/);
  assert.throws(() => assemble({ ...base(), templateHtml: TEMPLATE + '<!--WZH:CSS-->' }), /WZH:CSS/);
});

test('head is filled and {{WZH_TITLE}} is replaced everywhere, escaped', () => {
  const templateHtml = TEMPLATE.replace('</head>', '<a class="brand">{{WZH_TITLE}}</a></head>').replace('</body>', '<p>{{WZH_TITLE}}</p></body>');
  const out = assemble({ ...base(), templateHtml, title: 'A & B' });
  assert.match(out, /<title>t<\/title>/);
  assert.equal((out.match(/A &amp; B/g) ?? []).length, 2);
  assert.doesNotMatch(out, /\{\{WZH_TITLE\}\}/);
});

test('a template without the HEAD placeholder throws', () => {
  assert.throws(() => assemble({ ...base(), templateHtml: TEMPLATE.replace('<!--WZH:HEAD-->', '') }), /WZH:HEAD/);
});
