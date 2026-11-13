// 읽기 위치 바(M9): 스크롤 위치를 0~1 로 바꾸는 계산. DESIGN.md Components "읽기 위치 바".
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readRatio } from '../../textbook/src/app/views/readbar.js';

test('readRatio maps scroll position to 0..1', () => {
  assert.equal(readRatio(0, 2000, 1000), 0);
  assert.equal(readRatio(500, 2000, 1000), 0.5);
  assert.equal(readRatio(1000, 2000, 1000), 1);
  assert.equal(readRatio(1200, 2000, 1000), 1); // 튕김 스크롤
  assert.equal(readRatio(-30, 2000, 1000), 0);
});

test('readRatio is 0 when the page cannot scroll or input is broken', () => {
  assert.equal(readRatio(0, 800, 1000), 0);
  assert.equal(readRatio(0, 1000, 1000), 0);
  assert.equal(readRatio(NaN, 2000, 1000), 0);
});
