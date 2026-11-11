// 사이트 단위 정보: <head> 태그, 화면 경로 목록.
// 이름·주소·설명은 curriculum.json 에서만 받는다. 이 파일에 직접 쓰지 않는다.

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
