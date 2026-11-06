// Merge textbook/content/<pid>/_meta.json into curriculum.json (ruling R32/R46).
// Projects ordered p1,p2,p3,sp; pages ordered start,help,glossary,troubleshooting (others after, stable).
import fs from 'node:fs';
import path from 'node:path';
const content = path.resolve(process.argv[2]);
const curPath = path.join(content, 'curriculum.json');
const raw = fs.readFileSync(curPath, 'utf8');
const cur = JSON.parse(raw);
const order = ['p1', 'p2', 'p3', 'sp'];
const pageOrder = ['start', 'help', 'glossary', 'troubleshooting'];
for (const id of order) {
  const metaPath = path.join(content, id, '_meta.json');
  if (!fs.existsSync(metaPath)) continue;
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  if (meta.project.id !== id) throw new Error(`${metaPath}: project.id ${meta.project.id} != ${id}`);
  cur.projects = cur.projects.filter((p) => p.id !== id).concat(meta.project);
  for (const pg of meta.pages ?? []) cur.pages = cur.pages.filter((p) => p.id !== pg.id).concat(pg);
}
const rank = (list, id) => { const i = list.indexOf(id); return i === -1 ? list.length : i; };
cur.projects.sort((a, b) => rank(order, a.id) - rank(order, b.id));
cur.pages = cur.pages.map((p, i) => [p, i]).sort((a, b) => rank(pageOrder, a[0].id) - rank(pageOrder, b[0].id) || a[1] - b[1]).map(([p]) => p);
const indent = /^\{\n( +)/.exec(raw)?.[1].length ?? 2;
fs.writeFileSync(curPath, JSON.stringify(cur, null, indent) + '\n');
console.log('projects', cur.projects.map((p) => `${p.id}:${p.days.length}`).join(' '), '| pages', cur.pages.map((p) => p.id).join(','));
