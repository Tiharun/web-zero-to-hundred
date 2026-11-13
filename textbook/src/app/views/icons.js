// 아이콘 두 체계 (DESIGN.md Icons, The Two Icon Rule).
// 선 아이콘: 조작(메뉴, 검색, 닫기, 테마, 화살표, 펼침, 경고, 메뉴 체크). 도트 아이콘: 게임 물건과 내용 표시.
// 모두 장식(aria-hidden)이고 뜻은 옆 글자가 맡는다. 원문은 DESIGN.md 와 같아야 한다(테스트가 비교한다).
// 위쪽 문자열 함수는 DOM 없이 돌아서 빌드(Node)도 쓴다. innerHTML 은 이 파일의 고정 SVG 문자열에만 쓴다.

export const ICON_PATHS = {
  check: '<path d="M3.5 8.5l3 3 6-7"/>',
  search: '<circle cx="7" cy="7" r="4.25"/><path d="M10.25 10.25L13.5 13.5"/>',
  menu: '<path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11"/>',
  close: '<path d="M4 4l8 8M12 4l-8 8"/>',
  sun: '<circle cx="8" cy="8" r="2.75"/><path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1.06 1.06M11.54 11.54l1.06 1.06M3.4 12.6l1.06-1.06M11.54 4.46l1.06-1.06"/>',
  moon: '<path d="M13 9.5A5.5 5.5 0 016.5 3a5.5 5.5 0 106.5 6.5z"/>',
  monitor: '<rect x="1.75" y="2.5" width="12.5" height="8.5" rx="1.25"/><path d="M5.5 14h5M8 11v3"/>',
  left: '<path d="M10 3.5L5.5 8l4.5 4.5"/>',
  right: '<path d="M6 3.5L10.5 8 6 12.5"/>',
  chevron: '<path d="M4 6l4 4 4-4"/>',
  alert: '<path d="M8 2l6.25 11H1.75z"/><path d="M8 6.5v3M8 11.5v.01"/>',
};

// '#' 윤곽(--px-1, 기본 currentColor), 'o' 채움(--px-2), 'h' 반짝임(--px-3), '.' 빈칸
export const PIXELS = {
  check: ['........', '.......#', '......##', '#....##.', '##..##..', '.####...', '..##....', '........'],
  star: ['...##...', '...##...', '########', '.######.', '..####..', '.##..##.', '##....##', '........'],
  coin: ['..####..', '.#oooo#.', '#ohoooo#', '#ohoooo#', '#ohoooo#', '#oooooo#', '.#oooo#.', '..####..'],
  pawn: ['..####..', '.#hooo#.', '.#oooo#.', '..#oo#..', '..#oo#..', '.#oooo#.', '#oooooo#', '########'],
  flag: ['.##.....', '.#ooooo.', '.#oooooo', '.#ooooo.', '.#......', '.#......', '.#......', '###.....'],
  lock: ['..####..', '.#....#.', '.#....#.', '########', '#oooooo#', '#oo##oo#', '#oooooo#', '########'],
  quest: ['.##.', '#oo#', '#oo#', '#oo#', '.##.', '....', '.##.', '#oo#', '.##.'],
  house: ['...##...', '..#oo#..', '.#oooo#.', '#oooooo#', '.#o##o#.', '.#o##o#.', '.#o##o#.', '.######.'],
  tv: ['..#..#..', '...##...', '########', '#oooooo#', '#ohoooo#', '#oooooo#', '########', '.#....#.'],
  pad: ['........', '.######.', '#oo#ooo#', '#o###oh#', '#oo#oho#', '#oooooo#', '.##..##.', '........'],
  gift: ['.##..##.', '...##...', '########', '#oo##oo#', '########', '.#o##o#.', '.#o##o#.', '.######.'],
  trophy: ['.######.', '##hooo##', '#.#oo#.#', '.##oo##.', '...##...', '...##...', '..####..', '.######.'],
  ladder: ['.#....#.', '.######.', '.#....#.', '.#....#.', '.######.', '.#....#.', '.#....#.', '.######.'],
  wrench: ['.....#.#', '.....###', '....###.', '...###..', '..###...', '.###....', '###.....', '.#......'],
  words: ['.######.', '#oooooo#', '#o##o#o#', '#oooooo#', '#o###oo#', '.######.', '..##....', '.#......'],
  book: ['........', '###..###', '#oo##oo#', '#oo##oo#', '#oo##oo#', '#oo##oo#', '########', '........'],
  arrow: ['##...', '.##..', '..##.', '...##', '..##.', '.##..', '##...'],
};

const LAYERS = [
  ['#', 'p1'],
  ['o', 'p2'],
  ['h', 'p3'],
];

/** 선 아이콘 SVG 문자열 */
export function iconSvg(name, cls = '') {
  const d = ICON_PATHS[name];
  if (!d) throw new Error(`모르는 선 아이콘: ${name}`);
  return `<svg class="icon${cls ? ` ${cls}` : ''}" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${d}</svg>`;
}

/** 격자의 한 글자(층)를 가로 줄 조각 path 하나로 합친다 */
export function pixelPath(rows, ch) {
  let d = '';
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; ) {
      let end = x;
      while (end < row.length && row[end] === row[x]) end++;
      if (row[x] === ch) d += `M${x} ${y}h${end - x}v1h-${end - x}z`;
      x = end;
    }
  });
  return d;
}

/** 도트 아이콘 SVG 문자열. 격자 한 칸 = scale px (정수만) */
export function pxSvg(name, { cls = '', scale = 2 } = {}) {
  const rows = PIXELS[name];
  if (!rows) throw new Error(`모르는 도트 아이콘: ${name}`);
  if (!Number.isInteger(scale) || scale < 1) throw new Error(`도트 아이콘은 정수배로만 키워요: ${scale}`);
  const w = rows[0].length;
  const h = rows.length;
  const paths = LAYERS.map(([ch, layer]) => [layer, pixelPath(rows, ch)])
    .filter(([, d]) => d)
    .map(([layer, d]) => `<path class="${layer}" d="${d}"/>`)
    .join('');
  return `<svg class="px px-${name}${cls ? ` ${cls}` : ''}" viewBox="0 0 ${w} ${h}" width="${w * scale}" height="${h * scale}" shape-rendering="crispEdges" aria-hidden="true" focusable="false">${paths}</svg>`;
}

// ───────── DOM: 같은 문자열을 한 번만 해석해 복제한다 ─────────

const cache = new Map();
function fromString(key, make) {
  if (!cache.has(key)) {
    const t = document.createElement('template');
    t.innerHTML = make(); // 이 파일의 고정 SVG 문자열만 들어간다
    cache.set(key, t.content.firstElementChild);
  }
  return cache.get(key).cloneNode(true);
}

/** @returns {SVGElement} */
export const icon = (name, cls = '') => fromString(`i:${name}:${cls}`, () => iconSvg(name, cls));
/** @returns {SVGElement} */
export const px = (name, opts = {}) => fromString(`p:${name}:${opts.cls ?? ''}:${opts.scale ?? 2}`, () => pxSvg(name, opts));

/** 월드 엠블럼 도트 아이콘 이름 (DESIGN.md Icons). 모르는 월드는 별 */
export const worldEmblem = (project) => ({ p1: 'house', p2: 'tv', p3: 'pad', sp: 'gift', grad: 'trophy' })[project.id] ?? 'star';

/** 부록 페이지 도트 그림 이름 (DESIGN.md Cards "부록 머리"·"막혔을 때 칸"). 그림이 없는 페이지는 null */
export const pageArt = (id) => ({ help: 'ladder', troubleshooting: 'wrench', glossary: 'words', start: 'book' })[id] ?? null;
