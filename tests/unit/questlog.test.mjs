import { test } from 'node:test';
import assert from 'node:assert/strict';
import { currentStep, READ_LINE } from '../../textbook/src/app/views/questlog.js';

test('currentStep picks the last heading that passed the line', () => {
  assert.equal(currentStep([10, 500, 900], 152, false), 0);
  assert.equal(currentStep([-400, 100, 900], 152, false), 1);
  assert.equal(currentStep([-900, -500, -100], 152, false), 2);
});

test('currentStep is the first step before any heading passes, and the last at the bottom', () => {
  assert.equal(currentStep([300, 800], 152, false), 0);
  assert.equal(currentStep([-400, 100, 400], 152, true), 2); // 짧은 마지막 섹션
  assert.equal(currentStep([], 152, false), -1);
  assert.equal(currentStep([], 152, true), -1);
});

test('READ_LINE is the prototype offset below the top bar', () => {
  assert.equal(READ_LINE, 96);
});
