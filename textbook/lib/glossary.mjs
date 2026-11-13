// 용어 사전(content/glossary/*.md)과 문제 해결(content/troubleshooting/*.md) 조각을 합치고,
// 두 생성 페이지의 HTML을 만든다. 항목 본문은 하나씩 renderMarkdown 을 거친다
// (용어 링크·escape 규칙이 Day 와 똑같고, 오류를 원본 파일·줄 번호로 되짚을 수 있다).
import path from 'node:path';
import { iconSvg } from '../src/app/views/icons.js';
import { fenceMask, normalizeSource, renderMarkdown, slugify } from './markdown.mjs';

const buildError = (code, file, line, message) => ({ code, file, line, message });

const H3 = /^ {0,3}###(?:[ \t]+(.*?))?[ \t]*$/;
const H1_OR_H2 = /^ {0,3}#{1,2}(?:[ \t]|$)/;

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ESCAPES[c]);

/**
 * 파일 하나를 '### 제목' 단위로 나눈다. 첫 ### 앞의 글(파일 제목·소개)은 버린다.
 * # / ## 줄은 앞 항목을 끝내는 구분선이다(묶음 제목으로 쓸 수 있고, 항목 본문에 섞이지 않는다).
 * 코드 펜스 안의 줄은 건드리지 않는다.
 * @returns {{ title: string, line: number, md: string }[]} line 은 ### 줄의 원본 줄 번호(1부터)
 */
function splitEntries(src) {
  const lines = normalizeSource(src).split('\n');
  const inFence = fenceMask(lines);
  const entries = [];
  let current = null;
  lines.forEach((text, i) => {
    if (!inFence[i]) {
      const h3 = H3.exec(text);
      if (h3) {
        const title = (h3[1] ?? '').replace(/[ \t]+#+$/, '').trim();
        current = { title, line: i + 1, body: [] };
        entries.push(current);
        return;
      }
      if (H1_OR_H2.test(text)) {
        current = null;
        return;
      }
    }
    current?.body.push(text);
  });
  return entries.map(({ title, line, body }) => ({ title, line, md: body.join('\n').replace(/\s+$/, '') }));
}

// ───────────────────────── 병합 ─────────────────────────

/**
 * @param {{ file: string, src: string }[]} files 처리할 순서대로
 * @returns {{ entries: { term: string, slug: string, md: string, file: string, line: number }[], errors: object[] }}
 */
export function parseGlossary(files) {
  const entries = [];
  const errors = [];
  const firstSeen = new Map(); // 대소문자·공백을 무시한 용어 → 처음 정의한 위치
  const slugs = new Set();

  for (const { file, src } of files) {
    for (const { title: term, line, md } of splitEntries(src)) {
      if (!term) {
        errors.push(buildError('E_TERM_EMPTY', file, line, '### 뒤에 용어 이름이 없어요.'));
        continue;
      }
      const key = term.replace(/\s+/g, ' ').toLowerCase();
      if (firstSeen.has(key)) {
        errors.push(
          buildError('E_TERM_DUPLICATE', file, line, `이미 ${firstSeen.get(key)} 에서 정의한 용어예요: "${term}" (대소문자는 구분하지 않아요)`),
        );
        continue;
      }
      firstSeen.set(key, `${path.basename(file)}:${line}`);

      // 제목 id 는 같은 규칙으로 -2, -3 을 붙이므로 slug 도 똑같이 맞춘다(예: C#, C++ → c, c-2)
      const base = slugify(term) || 'term';
      let slug = base;
      for (let n = 2; slugs.has(slug); n++) slug = `${base}-${n}`;
      slugs.add(slug);

      entries.push({ term, slug, md, file, line });
    }
  }
  return { entries, errors };
}

/**
 * 파일 이름 접두어(p1-html.md → p1)로 그룹을 나눈다. 그룹·항목은 주어진 순서대로 쌓는다.
 * 항목의 day 는 본문 "- 관련:" 줄의 첫 Day 링크 id(없으면 null)다.
 * @returns {{ groups: { project: string, entries: { title: string, md: string, file: string, line: number, day: string | null }[] }[], errors: object[] }}
 */
export function parseTroubleshooting(files) {
  const groups = new Map();
  const errors = [];
  for (const { file, src } of files) {
    const prefix = path.basename(file).replace(/\.md$/i, '').split('-')[0];
    for (const { title, line, md } of splitEntries(src)) {
      if (!title) {
        errors.push(buildError('E_TS_EMPTY', file, line, '### 뒤에 증상(제목)이 없어요.'));
        continue;
      }
      if (!groups.has(prefix)) groups.set(prefix, { project: prefix, entries: [] });
      groups.get(prefix).entries.push({ title, md, file, line, day: RELATED_DAY.exec(md)?.[1] ?? null });
    }
  }
  return { groups: [...groups.values()], errors };
}

const RELATED_DAY = /^-\s*관련:.*?\(#\/day\/([^)\s]+)\)/m;

/**
 * 공개 범위 밖 Day 의 증상을 뺀다. 관련 Day 가 없는 증상은 남기고, 빈 그룹은 뺀다.
 * @param {{project:string, entries:{day:string|null}[]}[]} groups
 * @param {Set<string> | null} ids 공개 Day id. null 이면 거르지 않는다
 */
export function filterPublished(groups, ids) {
  if (!ids) return groups;
  return groups
    .map((g) => ({ ...g, entries: g.entries.filter((e) => !e.day || ids.has(e.day)) }))
    .filter((g) => g.entries.length > 0);
}

// ───────────────────────── 생성 페이지 ─────────────────────────

/** 제목 줄 + 본문을 한 번에 렌더하고, 오류를 원본 파일의 줄 번호로 바꾼다 */
function renderEntry({ level, title, md, file, line }, ctx) {
  // level 0: 제목 줄 없이 본문만. 빈 첫 줄을 두어 본문의 줄 번호가 제목이 있을 때와 같다
  const r = renderMarkdown(level ? `${'#'.repeat(level)} ${title}\n${md}` : `\n${md}`, ctx);
  // 렌더 원문의 1번째 줄이 파일의 ### 줄이고, 본문은 그 뒤로 이어진다
  const errors = r.errors.map((e) => ({ ...e, file, line: e.line == null ? line : line + e.line - 1 }));
  return { ...r, errors };
}

function joinPage(parts, empty) {
  return {
    html: parts.length ? parts.map((p) => p.html).join('') : empty,
    text: parts.map((p) => p.text).join(' ').trim(),
    checkCount: parts.reduce((n, p) => n + p.checkCount, 0),
    errors: parts.flatMap((p) => p.errors),
  };
}

// 한글 초성 19자 → 색인 14자. 겹자음(ㄲ ㄸ ㅃ ㅆ ㅉ)은 홑자음 묶음에 넣는다
const CHOSEONG = 'ㄱㄱㄴㄷㄷㄹㅁㅂㅂㅅㅅㅇㅈㅈㅊㅋㅌㅍㅎ';
const KO_LABELS = 'ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ';

/**
 * 용어 색인 묶음. 한글 음절은 초성(14자), 라틴 글자는 대문자, 그 밖(기호·숫자 등)은 한 묶음.
 * @returns {{ key: string, label: string }} key 는 'ko-1'…'ko-14', 'en-a'…'en-z', 'etc'
 */
export function glossaryIndexKey(term) {
  const ch = String(term).normalize('NFC').charAt(0);
  const code = ch.charCodeAt(0);
  if (code >= 0xac00 && code <= 0xd7a3) {
    const label = CHOSEONG[Math.floor((code - 0xac00) / 588)];
    return { key: `ko-${KO_LABELS.indexOf(label) + 1}`, label };
  }
  if (/^[a-z]$/i.test(ch)) return { key: `en-${ch.toLowerCase()}`, label: ch.toUpperCase() };
  return { key: 'etc', label: '기호·숫자' };
}

/** 묶음 순서: 기호·숫자 → ㄱ…ㅎ → A…Z */
const groupRank = (key) => (key === 'etc' ? 0 : key.startsWith('ko-') ? Number(key.slice(3)) : 100 + key.charCodeAt(3));

/**
 * 용어 사전 페이지. 맨 앞에 ㄱㄴㄷ 색인, 이어서 묶음(h2)마다 용어(h3)를 한글 사전순으로 놓는다.
 * 각 항목은 id="term-<slug>" 요소 안에 있다.
 * @param {{term,slug,md,file,line}[]} entries
 * @param {{ terms: Map<string,string>, routes: Set<string> }} ctx
 */
export function renderGlossaryPage(entries, { terms, routes }) {
  const sorted = [...entries].sort((a, b) => a.term.localeCompare(b.term, 'ko') || a.slug.localeCompare(b.slug));
  const groups = new Map();
  for (const e of sorted) {
    const { key, label } = glossaryIndexKey(e.term);
    if (!groups.has(key)) groups.set(key, { key, label, entries: [] });
    groups.get(key).entries.push(e);
  }
  const ordered = [...groups.values()].sort((a, b) => groupRank(a.key) - groupRank(b.key));

  const parts = ordered.map((g) => {
    const items = g.entries.map((e) => {
      // 항목 안의 제목 id 가 section id(term-*)와 겹치지 않게 다른 접두어를 쓴다
      const r = renderEntry({ level: 3, title: e.term, md: e.md, file: e.file, line: e.line }, { idPrefix: `th-${e.slug}`, terms, routes });
      return { ...r, html: `<section class="term-entry" id="term-${e.slug}">\n${r.html}</section>\n` };
    });
    const body = joinPage(items, '');
    return {
      ...body,
      html: `<section class="gl-group" id="gl-${g.key}" aria-labelledby="glh-${g.key}">\n<h2 id="glh-${g.key}">${esc(g.label)}</h2>\n${body.html}</section>\n`,
    };
  });
  const page = joinPage(parts, '<p>아직 등록된 용어가 없어요.</p>\n');
  if (ordered.length === 0) return page;

  const links = ordered
    .map((g) => `<li><a href="#/page/glossary/gl-${g.key}" aria-label="${esc(g.label)}, 용어 ${g.entries.length}개">${esc(g.label)}</a></li>`)
    .join('');
  const index = `<nav class="toc gl-index" aria-labelledby="gl-index-h">\n<h2 class="label" id="gl-index-h">ㄱㄴㄷ 색인</h2>\n<ul>${links}</ul>\n</nav>\n`;
  return { ...page, html: index + page.html };
}

/** 증상 하나: 요약 줄(꺾쇠 + 제목 인라인 HTML)과 펼친 내용. 제목은 heading 이 아니다 */
function renderSymptom(e, id, ctx) {
  const head = renderEntry({ level: 3, title: e.title, md: '', file: e.file, line: e.line }, { ...ctx, idPrefix: `tsh-${id}` });
  const body = renderEntry({ level: 0, title: '', md: e.md, file: e.file, line: e.line }, { ...ctx, idPrefix: `tsb-${id}` });
  const title = head.html.replace(/^<h3[^>]*>/, '').replace(/<\/h3>\s*$/, '');
  return {
    html: `<details class="ts-entry" id="${id}">\n<summary>${iconSvg('chevron', 'ts-chev')}<span class="ts-title">${title}</span></summary>\n<div class="ts-body">\n${body.html}</div>\n</details>\n`,
    text: `${head.text} ${body.text}`.trim(),
    checkCount: body.checkCount,
    errors: [...head.errors, ...body.errors],
  };
}

/**
 * 문제 해결 페이지. 맨 앞에 목차, 이어서 월드(h2) → Day 묶음(h3) → 증상(details) 순서로 놓는다.
 * 월드는 프로젝트 순서를 따르고, 프로젝트가 아닌 접두어는 접두어 이름 그대로 맨 뒤에 둔다.
 * Day 묶음은 그 월드의 Day 순서이고, 관련 Day 가 없거나 다른 월드의 Day 인 증상은 맨 뒤 "그 밖의 증상"이다.
 * @param {{project:string, entries:object[]}[]} groups
 * @param {{id:string,title:string,days?:{id:string,num:number,title:string}[]}[]} projects 프로젝트 순서대로
 * @param {{ terms: Map<string,string>, routes: Set<string>, pageId?: string }} ctx
 */
export function renderTroubleshootingPage(groups, projects, { terms, routes, pageId = 'troubleshooting' }) {
  const byProject = new Map(projects.map((p, i) => [p.id, { ...p, rank: i }]));
  const ordered = [...groups].sort((a, b) => {
    const ra = byProject.get(a.project)?.rank ?? Infinity;
    const rb = byProject.get(b.project)?.rank ?? Infinity;
    return ra - rb || a.project.localeCompare(b.project);
  });
  const href = (anchor) => `#/page/${pageId}/${anchor}`;

  const worlds = ordered.map((g) => {
    const gid = slugify(g.project) || 'etc';
    const project = byProject.get(g.project);
    const title = project?.title ?? g.project;
    const buckets = new Map(
      (project?.days ?? []).map((d) => [d.id, { key: d.id.slice(g.project.length + 1), name: `Day ${d.num}`, title: `Day ${d.num} · ${d.title}`, entries: [] }]),
    );
    const etc = { key: 'etc', name: '그 밖의 증상', title: '그 밖의 증상', entries: [] };
    for (const e of g.entries) (buckets.get(e.day) ?? etc).entries.push(e);
    const used = [...buckets.values(), etc].filter((b) => b.entries.length > 0);

    const sections = used.map((b) => {
      const sid = `ts-${gid}-${b.key}`;
      const inner = joinPage(
        b.entries.map((e, i) => renderSymptom(e, `${sid}-${i + 1}`, { terms, routes })),
        '',
      );
      return { ...inner, html: `<section class="ts-day" id="${sid}" aria-labelledby="tsh-${sid}">\n<h3 id="tsh-${sid}">${esc(b.title)}</h3>\n${inner.html}</section>\n` };
    });
    const body = joinPage(sections, '');
    const links = used.map((b) => `<li><a href="${href(`ts-${gid}-${b.key}`)}" aria-label="${esc(b.name)}, 증상 ${b.entries.length}개">${esc(b.name)}</a></li>`).join('');
    return {
      ...body,
      html: `<section class="ts-group" id="ts-${gid}">\n<h2 id="tsh-${gid}">${esc(title)}</h2>\n${body.html}</section>\n`,
      text: `${title} ${body.text}`.trim(),
      toc: `<div class="ts-toc-world">\n<a href="${href(`ts-${gid}`)}">${esc(title)}</a> <span class="label">증상 ${g.entries.length}개</span>\n<ol>${links}</ol>\n</div>\n`,
    };
  });
  const page = joinPage(worlds, '<p>아직 등록된 항목이 없어요.</p>\n');
  if (worlds.length === 0) return page;
  const toc = `<nav class="toc ts-toc" aria-labelledby="ts-toc-h">\n<h2 class="label" id="ts-toc-h">목차</h2>\n${worlds.map((w) => w.toc).join('')}</nav>\n`;
  return { ...page, html: toc + page.html };
}
