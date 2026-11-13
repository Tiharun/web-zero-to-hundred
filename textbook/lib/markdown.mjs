// Markdown → HTML 렌더러.
// 교재 본문은 작성자가 쓴 글이지만 HTML 튜토리얼을 다루므로, 본문 속 HTML(블록·인라인)은
// 전부 글자 그대로 escape한다. 실행 가능한 HTML은 이 렌더러가 만든 것뿐이다.
import { Marked } from 'marked';
import hljs from 'highlight.js';
import { iconSvg, pxSvg } from '../src/app/views/icons.js';

/** 허용하는 코드 펜스 언어 → highlight.js 언어 이름 */
export const LANG_MAP = Object.freeze({
  html: 'xml',
  xml: 'xml',
  css: 'css',
  js: 'javascript',
  javascript: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  typescript: 'typescript',
  tsx: 'typescript',
  json: 'json',
  powershell: 'powershell',
  csharp: 'csharp',
  cs: 'csharp',
  sql: 'sql',
  rust: 'rust',
  toml: 'ini',
  dockerfile: 'dockerfile',
  yaml: 'yaml',
  yml: 'yaml',
  http: 'http',
  diff: 'diff',
  md: 'markdown',
  markdown: 'markdown',
  text: 'plaintext',
  plaintext: 'plaintext',
  bash: 'bash',
});

const CONTAINER_KINDS = ['tip', 'warn', 'info', 'path', 'success', 'answer'];

/** 제목 id용 문자열. 소문자, 공백→'-', [a-z0-9가-힣-] 밖의 글자 제거, '-' 정리 */
export function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9가-힣-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// ───────────────────────── 문자열 도우미 ─────────────────────────

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** 글자 그대로 보이게 하는 완전한 escape (코드, 속성값, 원본 HTML) */
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ESCAPES[c]);

/** 본문 글자용 escape. 작성자가 쓴 엔티티(&lt; 등)는 Markdown 관례대로 그대로 둔다 */
const escText = (s) =>
  s
    .replace(/&(?!(?:#\d{1,7}|#[xX][0-9a-fA-F]{1,6}|\w+);)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const NAMED_ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

const decode = (s) =>
  s.replace(/&(#\d{1,7}|#[xX][0-9a-fA-F]{1,6}|[a-zA-Z]+);/g, (whole, name) => {
    if (name[0] === '#') {
      const code = name[1] === 'x' || name[1] === 'X' ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
      try {
        return String.fromCodePoint(code);
      } catch {
        return whole;
      }
    }
    return NAMED_ENTITIES[name] ?? whole;
  });

const countNewlines = (s) => (s.match(/\n/g) ?? []).length;

// 굵게(**)가 적용되지 않고 글자로 남았을 때의 안내 (E_BOLD_UNRENDERED)
const BOLD_PAIR_MESSAGE =
  '굵게(**)가 적용되지 않았어요. 닫는 ** 바로 뒤에 조사가 오고 앞이 문장부호면 깨져요. 굵게를 글자로 끝내거나 괄호를 굵게 밖으로 빼세요.';
const BOLD_STRAY_MESSAGE =
  '짝이 없는 **가 글자로 남았어요. 코드나 수식이면 백틱(`)으로 감싸세요. 굵게를 쓰려면 닫는 **도 써 주세요.';
const BOLD_TITLE_MESSAGE =
  '::: 블록 제목에는 굵게(**)를 쓸 수 없어요. 제목은 글자 그대로 나오니 ** 를 빼 주세요.';
const boldMessage = (text) => (text.split('**').length === 2 ? BOLD_STRAY_MESSAGE : BOLD_PAIR_MESSAGE);

/** BOM 제거, 줄바꿈을 \n으로 통일 */
export const normalizeSource = (src) => String(src).replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');

// ───────────────────────── 줄 단위 구조 (펜스·컨테이너) ─────────────────────────

const FENCE_OPEN = /^(\s*)(`{3,}|~{3,})(.*)$/;
const FENCE_CLOSE = /^\s*(`{3,}|~{3,})\s*$/;
const CONTAINER_OPEN = /^:::[ \t]*([^\s:]\S*)(?:[ \t]+(.*?))?[ \t]*$/;
const CONTAINER_CLOSE = /^:::[ \t]*$/;
const INDENTED_MARKER = /^\s+:::/;
const EXTRA_COLONS = /^:{4,}/;
const CAPTION = /^\s*📄[ \t]+(\S.*?)\s*$/;
const CAPTION_MARK = /\s*⟦cap:(\d+)⟧\s*$/;

function openFence(line) {
  const m = FENCE_OPEN.exec(line);
  if (!m) return null;
  const [, indent, fence, info] = m;
  if (fence[0] === '`' && info.includes('`')) return null; // 백틱 펜스의 정보 문자열에는 백틱이 없다
  return { indent, fence, char: fence[0], len: fence.length, info };
}

const closesFence = (line, open) => {
  const m = FENCE_CLOSE.exec(line);
  return m !== null && m[1][0] === open.char && m[1].length >= open.len;
};

/** 각 줄이 코드 펜스 안(여는 줄·닫는 줄 포함)이면 true */
export function fenceMask(lines) {
  const mask = new Array(lines.length).fill(false);
  let open = null;
  lines.forEach((line, i) => {
    if (open) {
      mask[i] = true;
      if (closesFence(line, open)) open = null;
    } else {
      const f = openFence(line);
      if (f) {
        mask[i] = true;
        open = f;
      }
    }
  });
  return mask;
}

/** ':::종류 제목' 줄이면 { kind, title }, 아니면 null */
export function parseContainerOpen(line) {
  const m = CONTAINER_OPEN.exec(line);
  return m ? { kind: m[1], title: (m[2] ?? '').trim() } : null;
}

/**
 * 원문 줄을 Markdown 덩어리({type:'md'})와 ::: 컨테이너({type:'box'})로 나눈다.
 * 코드 펜스 안의 ':::'는 건드리지 않는다. 📄 캡션 연결도 여기서 한다
 * (캡션은 다음 펜스 여는 줄의 정보 문자열에 표식으로 옮기고, 원래 줄은 빈 줄로 만든다).
 * 펜스 언어 검사는 인용문·목록 안의 펜스까지 보도록 렌더러의 code()에서 한다.
 */
function splitBlocks(lines, state) {
  const segments = [];
  let md = { type: 'md', line: 1, lines: [] };
  let box = null;
  let fence = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const no = i + 1;
    const target = box ? box.lines : md.lines;

    if (fence) {
      if (closesFence(line, fence)) fence = null;
      target.push(line);
      continue;
    }

    const open = openFence(line);
    if (open) {
      let out = line;
      const caption = i > 0 ? CAPTION.exec(lines[i - 1]) : null;
      if (caption) {
        target[target.length - 1] = '';
        state.captions.push(caption[1].replace(/^`+|`+$/g, '').trim());
        out = `${open.indent}${open.fence}${open.info.trim()} ⟦cap:${state.captions.length - 1}⟧`;
      }
      target.push(out);
      fence = { ...open, line: no };
      continue;
    }

    // 들여쓴 ':::'나 4개 이상의 콜론은 컨테이너로 인식되지 않아 글자로 남으므로 오류로 알린다
    if (INDENTED_MARKER.test(line)) {
      state.error('E_CONTAINER_INDENT', no, '::: 는 줄 맨 앞(들여쓰기 없이)에 써야 해요.');
    } else if (EXTRA_COLONS.test(line)) {
      state.error('E_CONTAINER_INDENT', no, '::: 는 콜론이 정확히 3개예요. 4개 이상(::::)은 쓸 수 없어요.');
    }

    if (line.startsWith(':::')) {
      if (CONTAINER_CLOSE.test(line)) {
        if (!box) {
          state.error('E_CONTAINER_STRAY', no, '짝이 없는 ::: 가 있어요. 위쪽에 :::종류 로 여는 줄이 필요해요.');
        } else if (box.depth > 0) {
          box.depth -= 1;
        } else {
          segments.push(box);
          box = null;
          md = { type: 'md', line: no + 1, lines: [] };
        }
        continue;
      }
      const head = parseContainerOpen(line);
      if (head) {
        if (box) {
          state.error('E_CONTAINER_NESTED', no, '::: 블록 안에 다른 ::: 블록을 넣을 수 없어요. 블록을 나란히 두세요.');
          box.depth += 1; // 짝이 맞게 세어 연쇄 오류를 막는다
          continue;
        }
        if (md.lines.length) segments.push(md);
        if (!CONTAINER_KINDS.includes(head.kind)) {
          state.error(
            'E_CONTAINER_TYPE',
            no,
            `알 수 없는 ::: 블록 종류예요: "${head.kind}" (${CONTAINER_KINDS.join(', ')} 중에서 골라 주세요)`,
          );
        }
        box = { type: 'box', kind: head.kind, title: head.title, line: no, bodyLine: no + 1, lines: [], depth: 0 };
        continue;
      }
    }

    target.push(line);
  }

  if (fence) {
    state.error('E_FENCE_UNCLOSED', fence.line, '코드 블록을 닫는 ``` 가 없어요.');
  }
  if (box) {
    state.error('E_CONTAINER_UNCLOSED', box.line, `:::${box.kind} 블록을 닫는 ::: 줄이 없어요.`);
    segments.push(box);
  } else if (md.lines.length) {
    segments.push(md);
  }
  return segments;
}

// ───────────────────────── 토큰 도우미 ─────────────────────────

/** 모든 토큰에 원문 시작 줄(_line)을 붙인다. 오류 보고용이라 목록 안쪽은 근사치다 */
function annotate(tokens, line) {
  for (const t of tokens) {
    t._line = line;
    if (t.type === 'list') {
      let at = line;
      for (const item of t.items) {
        item._line = at;
        annotate(item.tokens, at);
        at += countNewlines(item.raw);
      }
    } else if (t.type === 'table') {
      for (const cell of t.header) annotate(cell.tokens, line);
      t.rows.forEach((row, r) => row.forEach((cell) => annotate(cell.tokens, line + 2 + r)));
    } else if (t.tokens) {
      annotate(t.tokens, line);
    }
    line += countNewlines(t.raw);
  }
}

const BLOCK_TOKENS = new Set(['paragraph', 'list', 'list_item', 'blockquote', 'code', 'heading', 'table', 'html']);

/** 토큰에서 화면에 보이는 글자만 모은다(제목 텍스트, 체크박스 라벨용) */
function plainText(tokens = []) {
  let out = '';
  for (const t of tokens) {
    switch (t.type) {
      case 'checkbox':
      case 'space':
      case 'def':
      case 'hr':
      case 'table':
        break;
      case 'codespan':
      case 'code':
        out += t.text;
        break;
      case 'html': // 화면에는 글자 그대로 보인다
        out += t.raw;
        break;
      case 'br':
        out += ' ';
        break;
      case 'list':
        out += ` ${plainText(t.items)} `;
        break;
      default:
        if (t.tokens) out += plainText(t.tokens);
        else if (typeof t.text === 'string') out += decode(t.text);
    }
    if (BLOCK_TOKENS.has(t.type)) out += ' ';
  }
  return out;
}

const tidy = (s) => s.replace(/\s+/g, ' ').trim();

/** 렌더 결과 HTML → 검색용 순수 텍스트 */
function htmlToText(html) {
  const stripped = html
    .replace(/<button\b[^>]*>[\s\S]*?<\/button>/g, ' ')
    .replace(/<\/?(?:span|strong|em|code|a|del|b|i|u|mark|sub|sup)\b[^>]*>/g, '')
    .replace(/<[^>]+>/g, ' ');
  return tidy(decode(stripped));
}

// ───────────────────────── marked 설정 ─────────────────────────

function createMarked(state, { terms, routes, prefixed }) {
  const claimId = (base) => {
    let id = base;
    for (let n = 2; state.ids.has(id); n++) id = `${base}-${n}`;
    state.ids.add(id);
    return id;
  };

  const termExtension = {
    name: 'term',
    level: 'inline',
    start(src) {
      const at = src.indexOf('[[');
      return at < 0 ? undefined : at;
    },
    tokenizer(src) {
      const m = /^\[\[([^[\]\n]+?)\]\]/.exec(src);
      if (!m) return undefined;
      return { type: 'term', raw: m[0], text: m[1].trim(), inLink: Boolean(this.lexer.state.inLink) };
    },
    renderer(token) {
      const slug = terms.get(token.text);
      if (slug === undefined) {
        state.error('E_TERM_UNKNOWN', token._line, `용어 사전에 없는 용어예요: [[${token.text}]]`);
        return esc(token.text);
      }
      if (token.inLink) return esc(token.text); // 링크 안에 링크를 만들지 않는다
      return `<a class="term" href="#/page/glossary/term-${esc(slug)}">${esc(token.text)}</a>`;
    },
  };

  const renderer = {
    // 원본 HTML은 어떤 경우에도 글자로만 보인다
    html(token) {
      const raw = token.raw ?? token.text ?? '';
      return token.block ? `<p>${esc(raw.trim())}</p>\n` : esc(raw);
    },

    // marked의 text는 raw HTML 블록 안에서 escape를 건너뛰므로(escaped 플래그) 직접 처리한다
    text(token) {
      if (token.tokens) return this.parser.parseInline(token.tokens);
      // CommonMark 한글 함정: `**x)**는` 처럼 닫는 ** 앞이 문장부호이고 뒤가 글자면 굵게가 안 되고 ** 가 그대로 남는다
      const at = token.text.indexOf('**');
      if (at >= 0) {
        // 여러 줄 문단은 글자 덩어리 하나라서, ** 앞의 줄바꿈 수만큼 줄 번호를 더한다
        const line = token._line == null ? null : token._line + countNewlines(token.text.slice(0, at));
        state.error('E_BOLD_UNRENDERED', line, boldMessage(token.text));
      }
      return escText(token.text);
    },

    code(token) {
      const mark = CAPTION_MARK.exec(token.lang ?? '');
      const info = mark ? token.lang.slice(0, mark.index) : (token.lang ?? '');
      const caption = mark ? state.captions[Number(mark[1])] : null;
      const lang = info.trim().split(/\s+/)[0].toLowerCase();
      const known = Object.hasOwn(LANG_MAP, lang);
      if (token.codeBlockStyle === 'indented') {
        state.error('E_FENCE_LANG', token._line, '들여쓰기로 만든 코드 블록은 쓸 수 없어요. ```언어 로 감싸 주세요.');
      } else if (!lang) {
        state.error('E_FENCE_LANG', token._line, '코드 블록에 언어가 없어요. ```html 처럼 언어를 적어 주세요.');
      } else if (!known) {
        state.error(
          'E_FENCE_LANG_UNKNOWN',
          token._line,
          `알 수 없는 코드 언어예요: "${lang}" (허용: ${Object.keys(LANG_MAP).join(', ')})`,
        );
      }
      const hlName = known ? LANG_MAP[lang] : null;
      const source = token.text.replace(/\n$/, '');
      const inner =
        hlName && hlName !== 'plaintext'
          ? hljs.highlight(source, { language: hlName, ignoreIllegals: true }).value
          : esc(source);
      return (
        `<figure class="code"${hlName ? ` data-lang="${esc(lang)}"` : ''}>\n` +
        (caption ? `<figcaption>${esc(caption)}</figcaption>\n` : '') +
        `<button class="copy" type="button" aria-label="코드 복사">복사</button>\n` +
        `<pre><code class="hljs${hlName ? ` language-${hlName}` : ''}">${inner}</code></pre>\n` +
        `</figure>\n`
      );
    },

    heading(token) {
      const text = tidy(plainText(token.tokens));
      const id = claimId(prefixed(slugify(text) || 'section'));
      state.headings.push({ level: token.depth, text, id });
      // 🧯 섹션의 h3 는 증상 Accordion 하나가 된다(DESIGN.md "Day 증상 Accordion"). 다음 h3·h2·문서 끝에서 닫는다
      const close = token.depth <= 3 ? state.closeEntry() : '';
      if (token.depth === 2) state.inTrouble = text.startsWith('🧯');
      if (state.symptoms && state.inTrouble && token.depth === 3) {
        state.entryOpen = true;
        const title = this.parser.parseInline(token.tokens);
        return `${close}<details class="ts-entry" id="${esc(id)}"><summary>${iconSvg('chevron', 'ts-chev')}<span class="ts-title">${title}</span></summary><div class="ts-body">\n`;
      }
      return close + `<h${token.depth} id="${esc(id)}">${this.parser.parseInline(token.tokens)}</h${token.depth}>\n`;
    },

    listitem(item) {
      const outer = state.taskLabel;
      if (item.task) state.taskLabel = tidy(plainText(item.tokens.filter((t) => t.type !== 'list')));
      const body = this.parser.parse(item.tokens);
      state.taskLabel = outer;
      return item.task ? `<li class="task">${body}</li>\n` : `<li>${body}</li>\n`;
    },

    // 체크 상태는 저장된 진도가 정한다. 원문의 [x]는 무시하고 항상 해제 상태로 낸다
    checkbox() {
      const index = state.checkCount++;
      const label = state.taskLabel ? ` aria-label="${esc(state.taskLabel)}"` : '';
      return `<input type="checkbox" data-check="${index}"${label}> `;
    },

    link(token) {
      const href = token.href ?? '';
      // 자동 링크(주소 그대로)의 글자는 본문이 아니라 주소이므로 ** 검사 없이 글자 그대로 낸다
      const inner = token.autolink ? esc(token.text) : this.parser.parseInline(token.tokens ?? []);
      const title = token.title ? ` title="${esc(token.title)}"` : '';
      if (href.startsWith('#')) {
        if (!routes.has(href)) {
          state.error('E_LINK_UNKNOWN', token._line, `없는 화면으로 가는 링크예요: ${href}`);
        }
        return `<a href="${esc(href)}"${title}>${inner}</a>`;
      }
      if (/^https?:\/\//i.test(href)) {
        return `<a href="${esc(href)}"${title} target="_blank" rel="noopener noreferrer">${inner}</a>`;
      }
      if (/^mailto:/i.test(href)) {
        return `<a href="${esc(href)}"${title}>${inner}</a>`;
      }
      state.error(
        'E_LINK_UNSUPPORTED',
        token._line,
        `쓸 수 없는 링크예요: "${href}" (교재 안 이동은 #/..., 바깥은 https://... 만 쓸 수 있어요)`,
      );
      return inner;
    },

    // 교재는 오프라인 단일 파일이라 이미지를 넣을 수 없다(외부 요청 0건 원칙)
    image(token) {
      state.error(
        'E_IMAGE_UNSUPPORTED',
        token._line,
        '이미지는 쓸 수 없어요. 글이나 코드 블록으로 설명해 주세요.',
      );
      return esc(token.text ?? '');
    },
  };

  return new Marked({ gfm: true, breaks: false, extensions: [termExtension], renderer });
}

// ───────────────────────── 공개 함수 ─────────────────────────

/**
 * Markdown 원문을 교재용 HTML로 바꾼다. 원문 속 HTML은 전부 글자로 escape한다.
 *
 * 주의: `headings[].text`와 `text`는 escape하지 않은 순수 글자다(`<`, `&`가 그대로 들어 있다).
 * HTML에 넣을 때는 반드시 escape하거나 textContent로 넣을 것. `html`만 그대로 넣어도 안전하다.
 * `text`는 검색용이며 `:::answer` 블록 안의 글자도 포함한다(코드 내용 포함, 복사 버튼 글자 제외).
 *
 * @param {string} src Markdown 원문
 * @param {{ idPrefix: string, terms: Map<string,string>, routes: Set<string> }} ctx
 * @returns {{ html: string, text: string, checkCount: number, answerCount: number,
 *   headings: {level:number,text:string,id:string}[],
 *   errors: {code:string,line:number|null,message:string}[] }}
 */
export function renderMarkdown(src, ctx = {}) {
  const { idPrefix = '', terms = new Map(), routes = new Set() } = ctx;
  const prefixed = (name) => (idPrefix ? `${idPrefix}-${name}` : name);

  const errors = [];
  const state = {
    errors,
    headings: [],
    ids: new Set(),
    captions: [],
    checkCount: 0,
    answerCount: 0,
    taskLabel: '',
    symptoms: Boolean(ctx.symptoms),
    inTrouble: false,
    entryOpen: false,
    closeEntry() {
      if (!this.entryOpen) return '';
      this.entryOpen = false;
      return '</div></details>\n';
    },
    error: (code, line, message) => errors.push({ code, line: line ?? null, message }),
  };
  const marked = createMarked(state, { terms, routes, prefixed });

  const renderChunk = (lines, firstLine) => {
    const tokens = marked.lexer(lines.join('\n'));
    annotate(tokens, firstLine);
    return marked.parser(tokens);
  };

  const renderBox = (box) => {
    // 제목은 Markdown으로 처리하지 않고 글자 그대로 내므로 ** 가 보이게 된다
    if (CONTAINER_KINDS.includes(box.kind) && box.title.includes('**')) {
      state.error('E_BOLD_UNRENDERED', box.line, BOLD_TITLE_MESSAGE);
    }
    const body = renderChunk(box.lines, box.bodyLine);
    if (box.kind === 'answer') {
      const n = ++state.answerCount;
      return (
        `<details class="answer" data-answer="${esc(prefixed(`a${n}`))}">\n` +
        `<summary>${iconSvg('chevron', 'answer-chev')}${pxSvg('gift', { cls: 'answer-gift' })}<span>${esc(box.title || '정답 보기')}</span></summary>\n` +
        `<div class="answer-body">\n${body}</div>\n` +
        `</details>\n`
      );
    }
    if (!CONTAINER_KINDS.includes(box.kind)) return body; // 종류 오류는 이미 보고됨
    return (
      `<aside class="callout callout-${box.kind}">\n` +
      (box.title ? `<p class="callout-title">${esc(box.title)}</p>\n` : '') +
      `<div class="callout-body">\n${body}</div>\n` +
      `</aside>\n`
    );
  };

  const segments = splitBlocks(normalizeSource(src).split('\n'), state);
  const html = segments
    .map((seg) => (seg.type === 'box' ? renderBox(seg) : renderChunk(seg.lines, seg.line)))
    .join('') + state.closeEntry();

  errors.sort((a, b) => (a.line ?? Infinity) - (b.line ?? Infinity) || 0);
  return {
    html,
    text: htmlToText(html),
    checkCount: state.checkCount,
    answerCount: state.answerCount,
    headings: state.headings,
    errors,
  };
}
