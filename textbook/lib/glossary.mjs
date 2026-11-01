// 용어 사전(content/glossary/*.md)과 문제 해결(content/troubleshooting/*.md) 조각을 합치고,
// 두 생성 페이지의 HTML을 만든다. 항목 본문은 하나씩 renderMarkdown 을 거친다
// (용어 링크·escape 규칙이 Day 와 똑같고, 오류를 원본 파일·줄 번호로 되짚을 수 있다).
import path from 'node:path';
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
 * @returns {{ groups: { project: string, entries: { title: string, md: string, file: string, line: number }[] }[], errors: object[] }}
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
      groups.get(prefix).entries.push({ title, md, file, line });
    }
  }
  return { groups: [...groups.values()], errors };
}

// ───────────────────────── 생성 페이지 ─────────────────────────

/** 제목 줄 + 본문을 한 번에 렌더하고, 오류를 원본 파일의 줄 번호로 바꾼다 */
function renderEntry({ level, title, md, file, line }, ctx) {
  const r = renderMarkdown(`${'#'.repeat(level)} ${title}\n${md}`, ctx);
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

/**
 * 용어 사전 페이지. 항목은 한글 사전순이고, 각 항목은 id="term-<slug>" 요소 안에 있다.
 * @param {{term,slug,md,file,line}[]} entries
 * @param {{ terms: Map<string,string>, routes: Set<string> }} ctx
 */
export function renderGlossaryPage(entries, { terms, routes }) {
  const sorted = [...entries].sort((a, b) => a.term.localeCompare(b.term, 'ko') || a.slug.localeCompare(b.slug));
  const parts = sorted.map((e) => {
    // 항목 안의 제목 id 가 section id(term-*)와 겹치지 않게 다른 접두어를 쓴다
    const r = renderEntry({ level: 2, title: e.term, md: e.md, file: e.file, line: e.line }, { idPrefix: `th-${e.slug}`, terms, routes });
    return { ...r, html: `<section class="term-entry" id="term-${e.slug}">\n${r.html}</section>\n` };
  });
  return joinPage(parts, '<p>아직 등록된 용어가 없어요.</p>\n');
}

/**
 * 문제 해결 페이지. 프로젝트 제목(h2) 아래에 증상(h3)을 쓴 순서대로 놓는다.
 * 그룹은 프로젝트 순서를 따르고, 프로젝트가 아닌 접두어는 접두어 이름 그대로 맨 뒤에 둔다.
 * @param {{project:string, entries:object[]}[]} groups
 * @param {{id:string,title:string}[]} projects 프로젝트 순서대로
 * @param {{ terms: Map<string,string>, routes: Set<string> }} ctx
 */
export function renderTroubleshootingPage(groups, projects, { terms, routes }) {
  const byProject = new Map(projects.map((p, i) => [p.id, { title: p.title, rank: i }]));
  const ordered = [...groups].sort((a, b) => {
    const ra = byProject.get(a.project)?.rank ?? Infinity;
    const rb = byProject.get(b.project)?.rank ?? Infinity;
    return ra - rb || a.project.localeCompare(b.project);
  });

  const parts = ordered.map((g) => {
    const gid = slugify(g.project) || 'etc';
    const title = byProject.get(g.project)?.title ?? g.project;
    const entries = g.entries.map((e, i) => {
      const r = renderEntry({ level: 3, title: e.title, md: e.md, file: e.file, line: e.line }, { idPrefix: `tsh-${gid}-${i + 1}`, terms, routes });
      return { ...r, html: `<section class="ts-entry">\n${r.html}</section>\n` };
    });
    const body = joinPage(entries, '');
    return {
      ...body,
      html: `<section class="ts-group" id="ts-${gid}">\n<h2 id="tsh-${gid}">${esc(title)}</h2>\n${body.html}</section>\n`,
      text: `${title} ${body.text}`.trim(),
    };
  });
  return joinPage(parts, '<p>아직 등록된 항목이 없어요.</p>\n');
}
