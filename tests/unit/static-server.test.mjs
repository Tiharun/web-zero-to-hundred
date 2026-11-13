import { test } from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import { freePort, isBadPort, startStaticServer } from '../helpers/static-server.mjs';

test('isBadPort follows the Fetch bad port list (browsers refuse these with ERR_UNSAFE_PORT)', () => {
  for (const port of [0, 1, 22, 4045, 5060, 6000, 6665, 6669, 6697, 10080]) assert.equal(isBadPort(port), true, String(port));
  for (const port of [80, 443, 3000, 4044, 4046, 6061, 8080, 49152]) assert.equal(isBadPort(port), false, String(port));
});

test('startStaticServer skips ports the browser would refuse and frees the ones it skipped', async () => {
  const seen = [];
  // 처음 두 포트를 "막힌 포트"로 본다: 세 번째 포트를 써야 하고, 건너뛴 두 포트는 닫혀야 한다
  const server = await startStaticServer(os.tmpdir(), {
    isBad: (port) => {
      seen.push(port);
      return seen.length <= 2;
    },
  });
  try {
    assert.equal(seen.length, 3);
    assert.equal(new Set(seen).size, 3, '건너뛴 포트를 잡아 두어 같은 포트를 다시 받지 않는다');
    assert.equal(server.url, `http://127.0.0.1:${seen[2]}/`);
    for (const port of seen.slice(0, 2)) {
      await assert.rejects(fetch(`http://127.0.0.1:${port}/`), undefined, `건너뛴 포트 ${port} 는 닫혀 있어야 한다`);
    }
    assert.equal((await fetch(server.url)).status, 404);
  } finally {
    await server.close();
  }
});

test('freePort skips ports the browser would refuse and returns a closed, usable port', async () => {
  const seen = [];
  const port = await freePort({
    isBad: (p) => {
      seen.push(p);
      return seen.length === 1;
    },
  });
  assert.equal(seen.length, 2);
  assert.equal(port, seen[1]);
  assert.notEqual(port, seen[0]);
  await assert.rejects(fetch(`http://127.0.0.1:${port}/`), undefined, '돌려준 포트는 닫혀 있어야 한다');
});
