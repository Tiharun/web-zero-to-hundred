// Day 4·5 그림: 상대 경로 (값 고르기 그림, DESIGN.md "그림 틀").
// 폴더 트리에서 지금 파일과 갈 파일을 고르면 지나는 폴더를 강조하고, 링크에 쓸 상대 경로를 계산한다.
// 경로는 루트 기준 '/' 경로('hello/pages/back.html')로 다룬다. 화면의 Windows 경로는 winPath 로 만든다.
import { h } from '../app/views/common.js';
import { choiceGroup } from '../app/views/figure.js';

const dirOf = (p) => p.split('/').slice(0, -1);
const nameOf = (p) => p.split('/').at(-1);
/** 두 폴더 목록이 처음부터 같은 칸 수 */
function common(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
}

/** from 파일에서 to 파일로 가는 상대 경로 */
export function relativePath(from, to) {
  const a = dirOf(from);
  const b = dirOf(to);
  const i = common(a, b);
  return [...Array(a.length - i).fill('..'), ...b.slice(i), nameOf(to)].join('/');
}

/** 내 컴퓨터의 전체 경로: 루트(C:\…) 뒤에 '\' 로 잇는다 */
export const winPath = (root, p) => [root, ...p.split('/')].join('\\');

/** 화면에 쓰는 길: 시작 폴더 → 한 칸씩 올라가기 → 내려가기 → 파일 이름 */
export function routeSteps(root, from, to) {
  const a = dirOf(from);
  const b = dirOf(to);
  const i = common(a, b);
  const lines = [`시작: ${[root, ...a].join('\\')}`];
  for (let up = 1; up <= a.length - i; up++) lines.push(`${'../'.repeat(up)} → ${[root, ...a.slice(0, a.length - up)].join('\\')}`);
  const down = b.slice(i);
  if (down.length) lines.push(`내려가기: ${down.map((d) => `${d}/`).join('')}`);
  lines.push(nameOf(to));
  return lines;
}

/** 트리 행: 루트, 폴더(처음 나올 때 한 번), 파일. key 는 루트 기준 경로(루트는 '') */
function treeRows(rootLabel, files) {
  const rows = [{ key: '', name: rootLabel, depth: 0 }];
  const seen = new Set();
  for (const file of files) {
    const dirs = dirOf(file);
    dirs.forEach((dir, k) => {
      const key = dirs.slice(0, k + 1).join('/');
      if (seen.has(key)) return;
      seen.add(key);
      rows.push({ key, name: `${dir}\\`, depth: k + 1 });
    });
    rows.push({ key: file, name: nameOf(file), depth: dirs.length + 1, file: true });
  }
  return rows;
}

/** 길에 지나는 폴더: 시작 폴더에서 공통 폴더까지 올라가고, 거기서 도착 폴더까지 내려간다 */
function walkedFolders(from, to) {
  const a = dirOf(from);
  const b = dirOf(to);
  const i = common(a, b);
  const keys = new Set();
  for (let k = i; k <= a.length; k++) keys.add(a.slice(0, k).join('/'));
  for (let k = i; k <= b.length; k++) keys.add(b.slice(0, k).join('/'));
  return keys;
}

const CONFIGS = {
  site: {
    root: 'C:\\dev\\my-creator-site',
    rootLabel: 'my-creator-site\\',
    files: ['index.html', 'about.html', 'contents.html', 'schedule.html', 'contact.html'],
    from: 'index.html',
    to: 'about.html',
    attr: 'href',
  },
  dev: {
    root: 'C:\\dev',
    rootLabel: 'C:\\dev\\',
    files: ['hello/hello.html', 'hello/pages/back.html', 'my-creator-site/index.html', 'my-creator-site/images/profile.svg'],
    from: 'hello/pages/back.html',
    to: 'my-creator-site/images/profile.svg',
    attr: 'src',
    route: true,
  },
};

const code = (text) => h('code', null, text);

function outLines(cfg, from, to) {
  const link = `${cfg.attr}="${relativePath(from, to)}"`;
  if (cfg.route) {
    return [...routeSteps(cfg.root, from, to).map((line) => h('p', null, code(line))), h('p', null, '경로: ', code(link))];
  }
  return [h('p', null, '상대 경로: ', code(link)), h('p', null, '내 컴퓨터 경로(링크에 쓰지 않아요): ', code(winPath(cfg.root, to)))];
}

function treeItems(cfg, from, to) {
  const walked = walkedFolders(from, to);
  return treeRows(cfg.rootLabel, cfg.files).map((row) => {
    const tags = row.file ? [row.key === from && '시작', row.key === to && '도착'].filter(Boolean) : [];
    const cls = tags.length ? 'is-hot' : !row.file && walked.has(row.key) ? 'is-path' : null;
    return h('li', { class: cls, style: `--depth:${row.depth}` }, h('span', null, row.name), tags.map((t) => h('span', { class: 'label fig-tag' }, t)));
  });
}

function pathFigure(cfg) {
  return function mount(fig) {
    let from = cfg.from;
    let to = cfg.to;
    const tree = h('ul', { class: 'fig-tree' });
    const out = h('div', { class: 'figure-out', 'aria-live': 'polite' });
    const render = () => {
      tree.replaceChildren(...treeItems(cfg, from, to));
      out.replaceChildren(...outLines(cfg, from, to));
    };
    const options = (files) => files.map((f) => ({ value: f, label: nameOf(f) }));
    fig.querySelector('.figure-art').replaceChildren(tree);
    fig.querySelector('.figure-stage').append(
      choiceGroup(fig, { key: 'from', legend: '지금 파일', options: options(cfg.files.filter((f) => f.endsWith('.html'))), value: from, onChange: (v) => { from = v; render(); } }),
      choiceGroup(fig, { key: 'to', legend: '갈 파일', options: options(cfg.files), value: to, onChange: (v) => { to = v; render(); } }),
      out,
    );
    render();
    return () => {};
  };
}

export const mountSite = pathFigure(CONFIGS.site);
export const mountDev = pathFigure(CONFIGS.dev);
