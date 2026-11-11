// 웹폰트 내장: 교재에 쓰인 글자만 서브셋해 woff2 base64 @font-face 로 만든다(외부 요청 0).
// 서브셋은 Python(fontTools·brotli)이 한다. 같은 글자 묶음이면 캐시를 써서 Python 을 부르지 않는다.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT = fileURLToPath(new URL('./subset_fonts.py', import.meta.url));
const INSTALL = 'Python 3.11 이상과 도구를 설치해 주세요: pip install fonttools brotli';

/** DESIGN.md 글꼴 토큰의 세 글꼴. family 는 tokens.css 의 이름과 같아야 한다 */
export const FONT_FACES = [
  { family: 'WZH Wanted Sans', file: 'WantedSansVariable.ttf', text: 'all', wght: [400, 800], weight: '400 800' },
  { family: 'WZH Galmuri11', file: 'Galmuri11.ttf', text: 'all', weight: '400' },
  { family: 'WZH Code', file: 'D2Coding.ttf', text: 'code', weight: '400' },
];

const PRINTABLE_ASCII = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join('');
const byCodePoint = (a, b) => a.codePointAt(0) - b.codePointAt(0);
// 짝 없는 서로게이트(깨진 글자)는 글꼴에 넣을 수 없으므로 뺀다
const isLoneSurrogate = (ch) => ch.length === 1 && ch.charCodeAt(0) >= 0xd800 && ch.charCodeAt(0) <= 0xdfff;
const uniqueSorted = (text) => [...new Set(text)].filter((ch) => !isLoneSurrogate(ch)).sort(byCodePoint).join('');

/** 줄인 스크립트의 \uXXXX·\u{…}, HTML 숫자 참조를 글자로 되돌린다(글자 수집용) */
function decodeEscapes(text) {
  return text
    .replace(/\\u\{([0-9a-fA-F]+)\}/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)));
}

/**
 * @param {{ html: string, css: string, dataJson: string }} parts html 에는 템플릿·틀·스크립트를 모두 넣는다
 * @returns {{ textAll: string, textCode: string }} 코드 포인트 순, 중복 없음
 */
export function collectGlyphs({ html, css, dataJson }) {
  const source = decodeEscapes(`${html}${css}${dataJson}`);
  const code = [...source.matchAll(/<(pre|code)\b[^>]*>([\s\S]*?)<\/\1>/g)].map((m) => m[2].replace(/<[^>]*>/g, '')).join('');
  return {
    textAll: uniqueSorted(`${source}0123456789`),
    textCode: uniqueSorted(`${PRINTABLE_ASCII}${code}↑↓`),
  };
}

function runPython(python, input) {
  return spawnSync(python, ['-E', '-P', SCRIPT], { input, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, windowsHide: true });
}

/**
 * @param {{ textAll: string, textCode: string, fontsDir: string, cacheDir: string, python?: string }} opts
 *   python 을 주지 않으면 python, 실패하면 python3 을 한 번 더 시도한다
 * @returns {Promise<{ css: string, bytes: Record<string, number>, errors: object[] }>}
 */
export async function embedFonts({ textAll, textCode, fontsDir, cacheDir, python }) {
  const fail = (code, message, file = null) => ({ css: '', bytes: {}, errors: [{ code, line: null, message, file }] });

  // 캐시 열쇠: 글자 묶음 + 원본 파일의 크기·수정 시각 + 서브셋 스크립트 내용
  const hash = createHash('sha256').update(`${textAll}\0${textCode}\0`);
  for (const face of FONT_FACES) {
    const file = path.join(fontsDir, face.file);
    try {
      const s = await stat(file);
      hash.update(`${face.file}:${s.size}:${s.mtimeMs}\0`);
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
      return fail('E_FONT_SOURCE', `글꼴 원본이 없어요: ${face.file} (textbook/fonts/ 에 두어야 해요)`, file);
    }
  }
  hash.update(await readFile(SCRIPT));
  const cacheFile = path.join(cacheDir, `${hash.digest('hex')}.json`);

  let b64;
  try {
    b64 = JSON.parse(await readFile(cacheFile, 'utf8'));
  } catch {
    const jobs = FONT_FACES.map((f) => ({ family: f.family, src: path.join(fontsDir, f.file), text: f.text === 'code' ? textCode : textAll, ...(f.wght ? { wght: f.wght } : {}) }));
    const input = `${JSON.stringify(jobs)}\n`;
    let r = runPython(python ?? 'python', input);
    if (!python && r.status !== 0) r = runPython('python3', input);
    if (r.error || r.status !== 0) {
      const why = (r.error?.message ?? r.stderr ?? '').trim().split('\n').slice(-1)[0];
      return fail('E_FONT_TOOL', `글꼴 서브셋을 만들 수 없어요(${why}). ${INSTALL}`);
    }
    b64 = JSON.parse(r.stdout);
    await mkdir(cacheDir, { recursive: true });
    await writeFile(cacheFile, JSON.stringify(b64));
  }

  const bytes = {};
  const css = FONT_FACES.map((f) => {
    bytes[f.family] = Buffer.byteLength(b64[f.family], 'base64');
    return `@font-face { font-family: "${f.family}"; src: url(data:font/woff2;base64,${b64[f.family]}) format("woff2"); font-weight: ${f.weight}; font-style: normal; font-display: swap; }`;
  }).join('\n');
  return { css, bytes, errors: [] };
}
