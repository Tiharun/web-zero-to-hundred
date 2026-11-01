// 저장소 래퍼. DOM 을 직접 만지지 않고 Storage 비슷한 객체(getItem/setItem/removeItem)를 받는다.
// localStorage 는 읽기만 해도 던질 수 있고(브라우저 설정·정책), 쓰기도 막히거나 가득 찰 수 있으므로
// 모든 접근을 try/catch 로 감싸고, 못 쓰면 메모리에 보관한 채 계속 동작한다.

import { STORAGE_KEY } from './progress.js';

const PROBE_KEY = 'wzh:v1:probe';

/** 기본 저장소. 모듈을 불러올 때가 아니라 store 를 만들 때 읽는다 (읽기만 해도 SecurityError 가 날 수 있다) */
function defaultStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

/** 실제로 쓸 수 있는지 한 번 써 본다 */
function canWrite(storage) {
  if (storage == null) return false;
  try {
    storage.setItem(PROBE_KEY, '1');
  } catch {
    return false;
  }
  try {
    storage.removeItem(PROBE_KEY);
  } catch {
    // 검사용 키를 못 지워도 저장은 되므로 사용 가능으로 본다
  }
  return true;
}

function parse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/**
 * @param {Storage} [storage] 생략하면 globalThis.localStorage
 * @returns {{ readonly available: boolean, load(): unknown|null, save(p: unknown): boolean }}
 *   available: 영구 저장소를 쓸 수 있는가. 중간에 실패하면 false 로 바뀐다(배너용)
 *   load: 저장된 값(검증 전). 없거나 읽을 수 없으면 null
 *   save: 저장했으면 true. 영구 저장소가 안 돼도 메모리에는 보관하므로 true. 직렬화할 수 없는 값만 false
 */
export function createStore(storage) {
  const backing = storage === undefined ? defaultStorage() : storage;
  let usable = canWrite(backing);
  let memory = null; // 마지막으로 저장한 값의 JSON 글자 (복사본을 돌려주려고 글자로 둔다)

  return {
    get available() {
      return usable;
    },
    load() {
      if (usable) {
        try {
          const text = backing.getItem(STORAGE_KEY);
          return text == null ? null : parse(text);
        } catch {
          usable = false;
        }
      }
      return memory == null ? null : parse(memory);
    },
    save(progress) {
      let text;
      try {
        text = JSON.stringify(progress);
      } catch {
        return false;
      }
      if (typeof text !== 'string') return false; // JSON.stringify(undefined) 등
      memory = text;
      if (usable) {
        try {
          backing.setItem(STORAGE_KEY, text);
        } catch {
          usable = false;
        }
      }
      return true;
    },
  };
}
