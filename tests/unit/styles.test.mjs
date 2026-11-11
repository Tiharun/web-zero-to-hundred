import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lintStyles, STYLE_ORDER } from '../../textbook/lib/styles.mjs';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));

/** 주석을 지우고 공백을 한 칸으로 */
const normalize = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').trim();

test('STYLE_ORDER starts with tokens and legacy', () => {
  assert.deepEqual(STYLE_ORDER, ['tokens', 'legacy', 'base', 'shell', 'components', 'home', 'day', 'pages', 'print']);
});

test('lintStyles flags raw colours and font names outside tokens and legacy', () => {
  const issues = lintStyles([
    { name: 'tokens', file: 't.css', src: ':root{--color-ink:#312E81;--font-body:"A",sans-serif}' },
    { name: 'legacy', file: 'l.css', src: ':root{--tip-bg:#fff7d6}' },
    { name: 'base', file: 'b.css', src: 'a{color:#fff}\n/* #000 주석 */\nb{background:rgb(0 0 0 / .5)}\nc{font-family:Arial}\nd{font-family:var(--font-body)}\ne{color:var(--color-ink)}' },
  ]);
  assert.deepEqual(issues.map((i) => [i.code, i.line]), [['E_CSS_RAW_COLOR', 1], ['E_CSS_RAW_COLOR', 3], ['E_CSS_RAW_FONT', 4]]);
  assert.equal(issues[0].file, 'b.css');
});

test('a multi-line comment does not hide or shift later lines', () => {
  const issues = lintStyles([{ name: 'base', file: 'b.css', src: '/* 한\n#123456\n둘 */\na{color:hsl(0 0% 0%)}\nb{font-family:inherit}\nc{color:#abc;}' }]);
  assert.deepEqual(issues.map((i) => [i.code, i.line]), [['E_CSS_RAW_COLOR', 4], ['E_CSS_RAW_COLOR', 6]]);
});

test('legacy.css may define only the allow-listed names', () => {
  const issues = lintStyles([{ name: 'legacy', file: 'l.css', src: ':root{--bg:var(--color-paper);--brand-new:#123}' }]);
  assert.deepEqual(issues.map((i) => i.code), ['E_CSS_LEGACY_VAR']);
});

test('tokens.css equals the token block in DESIGN.md', async () => {
  const design = await readFile(path.join(ROOT, 'DESIGN.md'), 'utf8');
  const block = /## 부록: 토큰 원문 \(CSS\)[\s\S]*?```css\n([\s\S]*?)```/.exec(design.replace(/\r\n/g, '\n'))[1];
  const tokens = await readFile(path.join(ROOT, 'textbook/src/styles/tokens.css'), 'utf8');
  assert.equal(normalize(tokens), normalize(block));
});
