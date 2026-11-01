import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createStore } from '../../textbook/src/app/storage.js';
import { STORAGE_KEY, emptyProgress } from '../../textbook/src/app/progress.js';

/** Map 으로 만든 가짜 Storage */
function memoryStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    map,
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => void map.set(k, String(v)),
    removeItem: (k) => void map.delete(k),
  };
}

const sample = () => ({ ...emptyProgress(), completed: { 'fa-d01': '2026-11-01T01:00:00.000Z' }, theme: 'dark' });

test('store falls back to memory when storage throws', () => {
  const broken = {
    getItem() {
      throw new Error('SecurityError');
    },
    setItem() {
      throw new Error('QuotaExceededError');
    },
    removeItem() {
      throw new Error('SecurityError');
    },
  };
  const store = createStore(broken);
  assert.equal(store.available, false);
  assert.equal(store.load(), null, '저장한 것이 없으면 null');
  assert.equal(store.save(sample()), true, '메모리에는 저장했으므로 true');
  assert.deepEqual(store.load(), sample());
  assert.equal(store.available, false);
});

test('memory fallback hands out copies, not the saved object', () => {
  const store = createStore(null);
  const prog = sample();
  store.save(prog);
  prog.theme = 'light'; // 저장한 뒤에 바꿔도 저장된 값은 그대로
  const loaded = store.load();
  assert.equal(loaded.theme, 'dark');
  loaded.completed['zz'] = 'x';
  assert.deepEqual(store.load(), sample());
});

test('store uses the given storage when it works', () => {
  const storage = memoryStorage();
  const store = createStore(storage);
  assert.equal(store.available, true);
  assert.equal(store.load(), null);
  assert.equal(store.save(sample()), true);
  assert.deepEqual(JSON.parse(storage.map.get(STORAGE_KEY)), sample());
  assert.deepEqual([...storage.map.keys()], [STORAGE_KEY], '검사용 키를 남기지 않는다');
  assert.deepEqual(createStore(storage).load(), sample(), '새 store 도 같은 값을 읽는다');
  assert.equal(store.available, true);
});

test('load returns null for corrupt JSON instead of throwing', () => {
  const store = createStore(memoryStorage({ [STORAGE_KEY]: '{not json' }));
  assert.equal(store.available, true);
  assert.equal(store.load(), null);
});

test('storage that fails after startup flips to memory and keeps the latest value', () => {
  const storage = memoryStorage();
  let full = false;
  const real = storage.setItem;
  storage.setItem = (k, v) => {
    if (full && k === STORAGE_KEY) throw new Error('QuotaExceededError');
    real(k, v);
  };
  const store = createStore(storage);
  assert.equal(store.available, true);
  store.save({ ...sample(), theme: 'light' });
  full = true;
  assert.equal(store.save(sample()), true);
  assert.equal(store.available, false, '쓰기에 실패하면 available 이 false 가 된다');
  assert.deepEqual(store.load(), sample(), '방금 저장한 값을 돌려준다');
});

test('load still reads when writes fail', () => {
  // 용량 초과·읽기 전용: setItem 은 던지지만 이미 저장된 진도는 getItem 으로 읽을 수 있다
  const stored = { ...sample(), theme: 'light' };
  const storage = memoryStorage({ [STORAGE_KEY]: JSON.stringify(stored) });
  storage.setItem = () => {
    throw new Error('QuotaExceededError');
  };
  const store = createStore(storage);
  assert.equal(store.available, false, '쓸 수 없으니 배너용 available 은 false');
  assert.deepEqual(store.load(), stored, '저장된 진도는 읽는다');

  // 이 세션에서 새로 저장한 값은 영구 저장소에 못 썼으니 메모리의 최신 값을 돌려준다
  assert.equal(store.save(sample()), true);
  assert.deepEqual(store.load(), sample());
  assert.deepEqual(JSON.parse(storage.map.get(STORAGE_KEY)), stored, '영구 저장소에는 예전 값이 그대로');
  assert.equal(store.available, false);
});

test('writes that start failing mid-session keep older stored data readable until a newer save', () => {
  const stored = sample();
  const storage = memoryStorage({ [STORAGE_KEY]: JSON.stringify(stored) });
  const store = createStore(storage);
  assert.equal(store.available, true);
  const real = storage.setItem;
  storage.setItem = () => {
    throw new Error('QuotaExceededError');
  };
  assert.deepEqual(store.load(), stored, '아직 새로 저장한 것이 없으면 저장소 값');
  assert.equal(store.save({ ...stored, theme: 'dark' }), true);
  assert.equal(store.available, false);
  assert.equal(store.load().theme, 'dark');
  storage.setItem = real; // 다시 쓸 수 있게 돼도 이번 세션은 메모리 기준으로 계속 동작한다
  assert.equal(store.load().theme, 'dark');
});

test('storage whose getItem throws after startup does not break load', () => {
  const storage = memoryStorage({ [STORAGE_KEY]: JSON.stringify(sample()) });
  const store = createStore(storage);
  storage.getItem = () => {
    throw new Error('SecurityError');
  };
  assert.equal(store.load(), null);
  assert.equal(store.available, false);
});

test('storage without removeItem is still usable', () => {
  const map = new Map();
  const store = createStore({ getItem: (k) => map.get(k) ?? null, setItem: (k, v) => void map.set(k, v) });
  assert.equal(store.available, true);
  assert.equal(store.save(sample()), true);
  assert.deepEqual(store.load(), sample());
});

test('save returns false for a value that cannot be serialized', () => {
  const store = createStore(memoryStorage());
  const circular = {};
  circular.self = circular;
  assert.equal(store.save(circular), false);
  assert.equal(store.save(undefined), false);
});

test('default storage is resolved lazily and reading localStorage may throw', () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  try {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      get() {
        throw new Error('SecurityError: access denied');
      },
    });
    const blocked = createStore();
    assert.equal(blocked.available, false);
    assert.equal(blocked.save(sample()), true);
    assert.deepEqual(blocked.load(), sample());

    const fake = memoryStorage();
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: fake });
    const ok = createStore();
    assert.equal(ok.available, true);
    ok.save(sample());
    assert.ok(fake.map.has(STORAGE_KEY));

    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: undefined });
    assert.equal(createStore().available, false, 'localStorage 가 없는 환경');
  } finally {
    if (original) Object.defineProperty(globalThis, 'localStorage', original);
    else delete globalThis.localStorage;
  }
});
