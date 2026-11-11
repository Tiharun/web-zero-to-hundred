import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectGlyphs, embedFonts } from '../../textbook/lib/fonts.mjs';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const FONTS = path.join(ROOT, 'textbook', 'fonts');
const byCodePoint = (a, b) => a.codePointAt(0) - b.codePointAt(0);

async function withDirs(n, fn) {
  const dirs = await Promise.all(Array.from({ length: n }, () => mkdtemp(path.join(tmpdir(), 'wzh-font-test-'))));
  try {
    return await fn(...dirs);
  } finally {
    await Promise.all(dirs.map((d) => rm(d, { recursive: true, force: true })));
  }
}

test('collectGlyphs is sorted, unique, and always has digits and printable ASCII for code', () => {
  const { textAll, textCode } = collectGlyphs({ html: '<p>나가</p><pre>λ</pre>', css: 'a{}', dataJson: '{"t":"다"}' });
  assert.equal(textAll, [...new Set(textAll)].sort(byCodePoint).join(''));
  assert.equal(textCode, [...new Set(textCode)].sort(byCodePoint).join(''));
  for (const ch of '가나다0123456789') assert.ok(textAll.includes(ch), ch);
  for (const ch of ' ~Az09λ↑↓') assert.ok(textCode.includes(ch), ch);
  assert.equal(textCode.includes('나'), false, '<pre>·<code> 밖의 글자는 코드 글꼴에 넣지 않는다');
});

test('collectGlyphs reads \\u escapes from the minified script and code inside <code>', () => {
  const { textAll, textCode } = collectGlyphs({ html: 'x="\\uD55C\\uAE00"<code>경로</code>', css: '', dataJson: '' });
  assert.ok(textAll.includes('한') && textAll.includes('글'), textAll);
  assert.ok(textCode.includes('경') && textCode.includes('로'));
});

test('a lone surrogate from an escape is dropped, a real pair is kept', () => {
  const { textAll } = collectGlyphs({ html: 'a="\\uD800" b="\\uD83D\\uDE00"', css: '', dataJson: '' });
  assert.equal([...textAll].some((ch) => ch.length === 1 && /[\uD800-\uDFFF]/.test(ch)), false);
  assert.ok(textAll.includes('😀'));
});

test('embedFonts returns three WZH faces as inline woff2 and is byte-stable', async () => {
  await withDirs(2, async (tmpA, tmpB) => {
    const args = { textAll: '가나다 ABC 0123456789', textCode: ' !~Az09', fontsDir: FONTS, cacheDir: tmpA };
    const a = await embedFonts(args);
    const b = await embedFonts({ ...args, cacheDir: tmpB }); // 캐시 없이 다시
    assert.deepEqual(a.errors, []);
    assert.equal(a.css, b.css);
    assert.equal((a.css.match(/@font-face/g) ?? []).length, 3);
    assert.match(a.css, /font-family: "WZH Wanted Sans";[^}]*font-weight: 400 800;/);
    assert.match(a.css, /font-family: "WZH Galmuri11";[^}]*font-weight: 400;/);
    assert.match(a.css, /font-family: "WZH Code";[^}]*font-weight: 400;/);
    assert.match(a.css, /font-display: swap;/);
    assert.equal(/url\((?!data:font\/woff2;base64,)/.test(a.css), false);
    assert.deepEqual(Object.keys(a.bytes), ['WZH Wanted Sans', 'WZH Galmuri11', 'WZH Code']);
    for (const n of Object.values(a.bytes)) assert.ok(n > 0);
  });
});

test('a second call with the same glyphs is served from the cache', async () => {
  await withDirs(1, async (cacheDir) => {
    const args = { textAll: '라마', textCode: 'ab', fontsDir: FONTS, cacheDir };
    const first = await embedFonts(args);
    assert.deepEqual(first.errors, []);
    const second = await embedFonts({ ...args, python: 'no-such-python' }); // Python 을 부르면 실패한다
    assert.deepEqual(second.errors, []);
    assert.equal(second.css, first.css);
  });
});

test('missing python or source file is a build error, not a crash', async () => {
  await withDirs(3, async (emptyDir, tmpC, tmpD) => {
    const r1 = await embedFonts({ textAll: 'a', textCode: 'a', fontsDir: emptyDir, cacheDir: tmpC });
    assert.equal(r1.errors[0].code, 'E_FONT_SOURCE');
    assert.match(r1.errors[0].message, /WantedSansVariable\.ttf/);
    const r2 = await embedFonts({ textAll: 'a', textCode: 'a', fontsDir: FONTS, cacheDir: tmpD, python: 'no-such-python' });
    assert.equal(r2.errors[0].code, 'E_FONT_TOOL');
    assert.match(r2.errors[0].message, /pip install fonttools brotli/);
  });
});
