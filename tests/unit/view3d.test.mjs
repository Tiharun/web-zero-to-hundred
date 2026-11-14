import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HOME_VIEW, cameraPosition, checkLayers, dragView, normYaw, turnView, tweenView } from '../../textbook/src/app/view3d.js';

test('drag turns yaw freely and clamps pitch', () => {
  assert.deepEqual(dragView(HOME_VIEW, 120, 0), { yaw: 25, pitch: 20 });
  assert.equal(dragView({ yaw: 170, pitch: 0 }, 40, 0).yaw, -170);
  assert.equal(dragView({ yaw: 0, pitch: 50 }, 0, 100).pitch, 60);
  assert.equal(dragView({ yaw: 0, pitch: -50 }, 0, -100).pitch, -60);
});

test('normYaw keeps yaw in (-180, 180]', () => {
  assert.equal(normYaw(180), 180);
  assert.equal(normYaw(-180), 180);
  assert.equal(normYaw(190), -170);
  assert.equal(normYaw(-370), -10);
  assert.equal(normYaw(0), 0);
});

test('turn buttons move by 30 degrees', () => {
  assert.deepEqual(turnView(HOME_VIEW, 1), { yaw: -5, pitch: 20 });
  assert.deepEqual(turnView(HOME_VIEW, -1), { yaw: -65, pitch: 20 });
  assert.equal(turnView({ yaw: 180, pitch: 0 }, 1).yaw, -150);
});

test('tween goes the short way and lands exactly', () => {
  assert.deepEqual(tweenView({ yaw: 170, pitch: 0 }, { yaw: -170, pitch: 0 }, 1), { yaw: -170, pitch: 0 });
  assert.equal(tweenView({ yaw: 170, pitch: 0 }, { yaw: -170, pitch: 0 }, 0.5).yaw, normYaw(170 + 20 * 0.875)); // 1-(0.5)^3 = 0.875, 180을 넘어 돈다
  assert.deepEqual(tweenView(HOME_VIEW, { yaw: 0, pitch: 0 }, 0), HOME_VIEW);
});

test('camera sits on the z axis at the front view', () => {
  const p = cameraPosition({ yaw: 0, pitch: 0 }, 500);
  assert.deepEqual([Math.round(p.x), Math.round(p.y), Math.round(p.z)], [0, 0, 500]);
  assert.ok(cameraPosition({ yaw: 90, pitch: 0 }, 500).x > 499);
  assert.ok(cameraPosition({ yaw: 0, pitch: 30 }, 500).y > 249);
});

test('checkLayers finds broken nesting', () => {
  const ok = [
    { id: 'a', label: 'a', depth: 0, parent: null, x: 0, y: 0, w: 320, h: 240 },
    { id: 'b', label: 'b', depth: 1, parent: 'a', x: 10, y: 10, w: 100, h: 50 },
  ];
  assert.deepEqual(checkLayers(ok), []);
  assert.ok(checkLayers([ok[0], { ...ok[1], x: 300 }]).some((p) => p.includes('부모 a 밖'))); // 부모 밖
  assert.equal(checkLayers([ok[0], { ...ok[1], depth: 2 }]).length, 1); // 깊이 건너뜀
  assert.equal(checkLayers([ok[0], { ...ok[1], parent: 'z' }]).length, 1); // 없는 부모
  assert.equal(checkLayers([ok[0], { ...ok[0] }]).length >= 1, true); // 같은 id
  assert.equal(checkLayers([{ ...ok[0], w: 400 }]).length, 1); // 평면(320×240) 밖
  assert.equal(checkLayers([ok[1]]).length >= 1, true); // 뿌리 없음
});
