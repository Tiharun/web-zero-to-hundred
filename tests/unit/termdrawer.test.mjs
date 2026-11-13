import { test } from 'node:test';
import assert from 'node:assert/strict';

import { termSlug } from '../../textbook/src/app/views/termdrawer.js';

test('termSlug', () => {
  assert.equal(termSlug('#/page/glossary/term-html'), 'html');
  assert.equal(termSlug('#/page/glossary/term-픽스처용어'), '픽스처용어');
  assert.equal(termSlug('#/page/glossary/gl-a'), null);
  assert.equal(termSlug('#/page/glossary'), null);
  assert.equal(termSlug('#/day/p1-d01'), null);
  assert.equal(termSlug(null), null);
});
