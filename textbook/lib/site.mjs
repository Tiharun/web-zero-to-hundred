// 사이트 단위 정보: <head> 태그, 화면 경로 목록.
// 이름·주소·설명은 curriculum.json 에서만 받는다. 이 파일에 직접 쓰지 않는다.
import { PIXELS, pixelPath } from '../src/app/views/icons.js';

/** HTML 글자·속성 값 이스케이프 */
export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * @param {{ title: string, url: string, description: string }} site
 * @param {string} faviconHref
 * @returns {string} <head> 안에 넣을 태그들
 */
export function headTags({ title, url, description }, faviconHref) {
  const t = escapeHtml(title);
  const u = escapeHtml(url);
  const d = escapeHtml(description);
  return [
    `<title>${t}</title>`,
    `<meta name="description" content="${d}">`,
    `<link rel="canonical" href="${u}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:title" content="${t}">`,
    `<meta property="og:description" content="${d}">`,
    `<meta property="og:url" content="${u}">`,
    `<link rel="icon" href="${escapeHtml(faviconHref)}">`,
  ].join('\n');
}

/**
 * 파비콘: 말 도트 아이콘을 32px(격자 한 칸 4px)로 그린 SVG data URI.
 * 색은 tokens.css 의 첫 :root(라이트) 블록에서 읽는다: 윤곽 ink, 채움 accent, 반짝임 accent-hover (DESIGN.md 도트 색 배정)
 * @param {string} tokensCss
 */
export function faviconDataUri(tokensCss) {
  const root = /:root\s*\{([^}]*)\}/.exec(tokensCss)?.[1] ?? '';
  const color = (name) => {
    const m = new RegExp(`--${name}\\s*:\\s*([^;]+);?`).exec(root);
    if (!m) throw new Error(`tokens.css 의 첫 :root 에 --${name} 이 없어요 (파비콘 색)`);
    return m[1].trim();
  };
  const fill = { p1: color('color-ink'), p2: color('color-accent'), p3: color('color-accent-hover') };
  const rows = PIXELS.pawn;
  const paths = [['#', 'p1'], ['o', 'p2'], ['h', 'p3']]
    .map(([ch, layer]) => [layer, pixelPath(rows, ch)])
    .filter(([, d]) => d)
    .map(([layer, d]) => `<path fill="${fill[layer]}" d="${d}"/>`)
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${rows[0].length} ${rows.length}" width="32" height="32" shape-rendering="crispEdges">${paths}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * 교재의 모든 화면 경로. 홈, 설정, 검색, 프로젝트(월드), Day, 부록 순서
 * @param {{ projects: { id: string, days: { id: string }[] }[], pages: { id: string }[] }} cur
 * @returns {string[]}
 */
export function listRoutes(cur) {
  return [
    '#/',
    '#/settings',
    '#/search',
    ...cur.projects.map((p) => `#/project/${p.id}`),
    ...cur.projects.flatMap((p) => p.days.map((d) => `#/day/${d.id}`)),
    ...cur.pages.map((pg) => `#/page/${pg.id}`),
  ];
}
