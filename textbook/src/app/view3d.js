// 3D 그림(G4)의 순수 계산: 시점(끌기·버튼·보간·카메라 위치)과 층 데이터 검사. DOM 을 쓰지 않는다.
// 층 데이터는 평면(PLANE, y 는 아래로) 위의 네모와 깊이다. 3D 장면은 깊이마다 LAYER_GAP 만큼 앞으로 띄운다.

/** 처음 시점(도). yaw: 왼쪽·오른쪽으로 돈 각, pitch: 위에서 내려다본 각 */
export const HOME_VIEW = Object.freeze({ yaw: -35, pitch: 20 });
/** 시점 버튼 한 번에 도는 각(도) */
export const TURN_STEP = 30;
/** 끌기 1px 에 도는 각(도) */
export const DRAG_DEG_PER_PX = 0.5;
/** pitch 는 ±이 값 안에 둔다(도) */
export const PITCH_LIMIT = 60;
/** 깊이 1 사이의 거리, 판 두께, 층 평면 크기 (평면 단위) */
export const LAYER_GAP = 28;
export const SLAB = 4;
export const PLANE = Object.freeze({ w: 320, h: 240 });
/** 정적 그림(G1)에서 깊이 1마다 미는 거리(오른쪽, 위) */
export const OBLIQUE = Object.freeze({ dx: 14, dy: -10 });

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const rad = (deg) => (deg * Math.PI) / 180;

/** yaw 를 (-180, 180] 로 정리한다 */
export function normYaw(deg) {
  const r = (((deg + 180) % 360) + 360) % 360 - 180; // [-180, 180)
  return r === -180 ? 180 : r;
}

/** 끌기: 가로는 yaw(제한 없음), 세로는 pitch(±PITCH_LIMIT) */
export function dragView(view, dx, dy) {
  return { yaw: normYaw(view.yaw + dx * DRAG_DEG_PER_PX), pitch: clamp(view.pitch + dy * DRAG_DEG_PER_PX, -PITCH_LIMIT, PITCH_LIMIT) };
}

/** 시점 버튼: dir -1 은 왼쪽, 1 은 오른쪽으로 TURN_STEP 만큼 */
export function turnView(view, dir) {
  return { yaw: normYaw(view.yaw + dir * TURN_STEP), pitch: view.pitch };
}

/** 3차 감속(DESIGN.md Motion "3D 시점") */
export const easeOut = (t) => 1 - (1 - t) ** 3;

/** from → to 사이 t(0~1) 지점. yaw 는 짧은 쪽으로 돈다. t = 1 이면 to 그대로 */
export function tweenView(from, to, t) {
  if (t >= 1) return { yaw: to.yaw, pitch: to.pitch };
  const k = easeOut(Math.max(0, t));
  const turn = normYaw(to.yaw - from.yaw);
  return { yaw: normYaw(from.yaw + turn * k), pitch: from.pitch + (to.pitch - from.pitch) * k };
}

/** 장면 가운데를 보는 카메라의 위치(가운데 기준). 정면(0, 0)은 +z 축 위 */
export function cameraPosition(view, distance) {
  const y = rad(view.yaw);
  const p = rad(view.pitch);
  return { x: distance * Math.sin(y) * Math.cos(p), y: distance * Math.sin(p), z: distance * Math.cos(y) * Math.cos(p) };
}

/**
 * 층 데이터 검사. 문제 문장 목록을 돌려준다(빈 배열이면 정상).
 * 층: { id, label, depth, parent, x, y, w, h, code?, ghost? }. 뿌리는 하나(parent null, depth 0),
 * 자식은 부모보다 깊이가 정확히 1 크고 부모 네모 안에 있으며, 모든 네모는 평면 안에 있다.
 */
export function checkLayers(layers) {
  const problems = [];
  const byId = new Map();
  for (const l of layers) {
    if (byId.has(l.id)) problems.push(`id 가 겹쳐요: ${l.id}`);
    byId.set(l.id, l);
  }
  const roots = layers.filter((l) => l.parent === null);
  if (roots.length !== 1) problems.push(`뿌리는 하나여야 해요(지금 ${roots.length}개)`);
  for (const l of layers) {
    if (l.x < 0 || l.y < 0 || l.x + l.w > PLANE.w || l.y + l.h > PLANE.h) problems.push(`${l.id}: 평면 밖이에요`);
    if (l.parent === null) {
      if (l.depth !== 0) problems.push(`${l.id}: 뿌리의 깊이는 0이어야 해요`);
      continue;
    }
    const p = byId.get(l.parent);
    if (!p) {
      problems.push(`${l.id}: 없는 부모 ${l.parent}`);
      continue;
    }
    if (l.depth !== p.depth + 1) problems.push(`${l.id}: 깊이는 부모(${p.depth}) + 1 이어야 해요`);
    if (l.x < p.x || l.y < p.y || l.x + l.w > p.x + p.w || l.y + l.h > p.y + p.h) problems.push(`${l.id}: 부모 ${p.id} 밖이에요`);
  }
  return problems;
}
