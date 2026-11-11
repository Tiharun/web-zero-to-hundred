// src/styles/*.css 를 정해진 순서로 읽어 이어 붙이고, 토큰 규칙을 검사한다.
// 색 값과 글꼴 이름은 tokens.css(DESIGN.md 토큰)와 legacy.css(옛 이름 → 새 토큰)에만 둘 수 있다.
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const STYLE_ORDER = ['tokens', 'legacy', 'base', 'shell', 'components', 'home', 'day', 'pages', 'print'];

/** 검사하지 않는 파일: 토큰의 원천 두 곳 */
const SOURCE_FILES = new Set(['tokens', 'legacy']);

/** legacy.css 가 정의할 수 있는 옛 변수 이름. 화면을 개편하는 마일스톤마다 줄여 간다 */
export const LEGACY_VARS = new Set([
  'bg', 'surface', 'surface-2', 'accent-soft', 'ok-soft', 'text', 'link', 'muted', 'border', 'border-strong',
  'accent', 'on-accent', 'focus', 'ok', 'ok-bar', 'overlay', 'shadow', 'font-sans', 'font-mono', 'radius', 'radius-sm',
  'measure', 'danger', 'on-danger', 'code-bg', 'code-fg', 'code-head', 'code-border',
  ...['tip', 'warn', 'info', 'path', 'success', 'callout'].flatMap((k) => [`${k}-bg`, `${k}-line`, `${k}-ink`]),
  ...['keyword', 'string', 'number', 'comment', 'title', 'attr', 'variable', 'meta', 'tag', 'name', 'deletion', 'addition'].map((k) => `tok-${k}`),
]);

const RAW_COLOR = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|oklch|color-mix)\(/i;
// 선언 하나: 이름: 값; 또는 이름: 값} (선택자의 a:hover { 는 { 앞이라 걸리지 않는다)
const DECLARATION = /(--[\w-]+|[a-z-]+)\s*:\s*([^;{}]*)(?=[;}])/gi;

/** 주석을 같은 길이의 공백으로 바꾼다(줄바꿈은 남겨 줄 번호를 지킨다) */
const blankComments = (src) => src.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '));
const lineAt = (src, index) => src.slice(0, index).split('\n').length;

/**
 * @param {string} srcDir textbook/src
 * @returns {Promise<{ css: string, files: { name: string, file: string, src: string }[], errors: object[] }>}
 */
export async function readStyles(srcDir) {
  const files = [];
  for (const name of STYLE_ORDER) {
    const file = path.join(srcDir, 'styles', `${name}.css`);
    try {
      files.push({ name, file, src: await readFile(file, 'utf8') });
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
      if (name === 'tokens') {
        // 토큰 없는 교재는 색·글꼴이 없어 읽을 수 없으므로 조용히 만들지 않고 멈춘다
        const message = 'styles/tokens.css 가 없어요. 디자인 토큰 없이는 교재를 만들 수 없어요.';
        return { css: '', files: [], errors: [{ code: 'E_NO_CSS', line: null, message, file }] };
      }
    }
  }
  return { css: files.map((f) => f.src).join('\n'), files, errors: [] };
}

/**
 * @param {{ name: string, file: string, src: string }[]} files
 * @returns {{ code: string, message: string, file: string, line: number }[]}
 */
export function lintStyles(files) {
  const issues = [];
  for (const { name, file, src } of files) {
    const clean = blankComments(src);
    for (const m of clean.matchAll(DECLARATION)) {
      const [, prop, value] = m;
      const valueAt = m.index + m[0].length - value.length;
      if (name === 'legacy') {
        if (prop.startsWith('--') && !LEGACY_VARS.has(prop.slice(2))) {
          issues.push({ code: 'E_CSS_LEGACY_VAR', message: `legacy.css 에는 옛 변수 이름만 둘 수 있어요: ${prop}`, file, line: lineAt(clean, m.index) });
        }
        continue;
      }
      if (SOURCE_FILES.has(name)) continue;
      const color = RAW_COLOR.exec(value);
      if (color) {
        issues.push({ code: 'E_CSS_RAW_COLOR', message: `색 값은 토큰(var(--color-…))으로만 써요: ${prop}: ${value.trim()}`, file, line: lineAt(clean, valueAt + color.index) });
      }
      if (prop.toLowerCase() === 'font-family') {
        const v = value.trim();
        if (!v.startsWith('var(--font-') && v !== 'inherit') {
          issues.push({ code: 'E_CSS_RAW_FONT', message: `글꼴은 토큰(var(--font-…))으로만 써요: font-family: ${v}`, file, line: lineAt(clean, valueAt) });
        }
      }
    }
  }
  return issues;
}
