// 월드맵 뱀 배치 계산. DOM 없이 좌표·경로·화살표만 만든다. DESIGN.md Layout "월드맵 배치".
// 칸 하나 = viewBox 100단위. x·y는 지도 폭·높이의 %(곱셈을 먼저 해 소수 오차를 줄인다).

/** 배치 3종: 열 수와 줄 높이(px) */
export const LAYOUTS = {
  s: { cols: () => 5, rowH: 84 },
  m: { cols: () => 10, rowH: 84 },
  // 한 줄 15칸까지: 40·45 Day 월드도 칸 사이가 좁아지지 않는다
  l: { cols: (n) => Math.min(15, Math.ceil(n / 2)), rowH: 88 },
};

/** n칸을 cols열 뱀 모양으로 놓는다: 짝수 줄 왼→오, 홀수 줄 오→왼 */
export function geometry(n, cols) {
  const rows = Math.ceil(n / cols);
  const pts = [];
  for (let i = 0; i < n; i++) {
    const r = Math.floor(i / cols);
    const c = r % 2 === 0 ? i % cols : cols - 1 - (i % cols);
    pts.push({ r, c, x: ((c + 0.5) * 100) / cols, y: ((r + 0.5) * 100) / rows, vx: (c + 0.5) * 100, vy: (r + 0.5) * 100 });
  }
  return { rows, cols, pts };
}

/** 세 배치의 geometry */
export function layouts(n) {
  return Object.fromEntries(Object.entries(LAYOUTS).map(([k, L]) => [k, geometry(n, L.cols(n))]));
}

/** 0번부터 upto번 칸까지의 SVG 경로. 줄이 바뀌면 줄 끝 바깥으로 둥글게 돈다 */
export function pathD(pts, upto) {
  if (upto < 1) return '';
  let d = `M${pts[0].vx} ${pts[0].vy}`;
  for (let i = 1; i <= upto; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    if (a.r === b.r) d += ` L${b.vx} ${b.vy}`;
    else {
      const bulge = a.c === 0 ? -42 : 42;
      d += ` C${a.vx + bulge} ${a.vy} ${b.vx + bulge} ${b.vy} ${b.vx} ${b.vy}`;
    }
  }
  return d;
}

/** 처음부터 이어서 끝낸 마지막 칸 번호. 없으면 -1 */
export function streakEnd(done) {
  let end = -1;
  while (end + 1 < done.length && done[end + 1]) end++;
  return end;
}

/** 줄마다 가운데 두 칸 사이의 진행 방향 화살표. 칸이 하나뿐인 줄은 건너뛴다 */
export function rowArrows(geo, streak) {
  const n = geo.pts.length;
  const out = [];
  for (let r = 0; r < geo.rows; r++) {
    const from = r * geo.cols;
    const len = Math.min(n, from + geo.cols) - from;
    if (len < 2) continue;
    const j = from + Math.floor((len - 2) / 2);
    const a = geo.pts[j];
    const b = geo.pts[j + 1];
    out.push({ x: (a.x + b.x) / 2, y: a.y, back: b.c < a.c, done: j + 1 <= streak });
  }
  return out;
}

/** 툴팁을 칸의 어느 쪽에 붙일지: 왼쪽 절반은 start, 오른쪽 절반은 end */
export function tipSide(pt, cols) {
  return pt.c < cols / 2 ? 'start' : 'end';
}
