// 해시 라우팅. location.hash 글자를 Route 객체로 바꾼다 (순수 함수, DOM 없음).
// id 가 실제로 있는지는 검사하지 않는다 — 화면(view)이 확인해서 notfound 나 잠금 화면을 보여 준다.
//
// Route:
//   { name: 'home' }
//   { name: 'project', pid }
//   { name: 'day', dayId }
//   { name: 'page', id, anchor }      anchor 는 디코딩된 글자, 없으면 null
//   { name: 'settings' }
//   { name: 'search', q }             q 는 디코딩된 검색어, 없으면 ''
//   { name: 'notfound' }

const NOT_FOUND = { name: 'notfound' };

/** 잘못된 % 표기(URIError)는 던지지 않고 받은 그대로 쓴다 */
function decode(part) {
  try {
    return decodeURIComponent(part);
  } catch {
    return part;
  }
}

/** 'a=1&q=%ED%95%9C' 에서 q 를 꺼낸다. + 는 공백으로 바꾸지 않는다 */
function queryParam(query, key) {
  for (const pair of query.split('&')) {
    const eq = pair.indexOf('=');
    const name = decode(eq === -1 ? pair : pair.slice(0, eq));
    if (name === key) return eq === -1 ? '' : decode(pair.slice(eq + 1));
  }
  return '';
}

/** @param {string} hash location.hash 값 ('', '#/', '#/day/p1-d01' …) */
export function parseHash(hash) {
  let rest = typeof hash === 'string' ? hash : '';
  if (rest.startsWith('#')) rest = rest.slice(1);
  const q = rest.indexOf('?');
  const query = q === -1 ? '' : rest.slice(q + 1);
  let path = q === -1 ? rest : rest.slice(0, q);

  if (path === '' || path === '/') return { name: 'home' };
  if (!path.startsWith('/')) return NOT_FOUND;
  path = path.slice(1);
  if (path.endsWith('/')) path = path.slice(0, -1); // 끝의 / 하나는 봐준다

  const [head, first, second, ...extra] = path.split('/');
  if (extra.length > 0) return NOT_FOUND;

  switch (head) {
    case 'settings':
      return first === undefined ? { name: 'settings' } : NOT_FOUND;
    case 'search':
      return first === undefined ? { name: 'search', q: queryParam(query, 'q') } : NOT_FOUND;
    case 'project':
      return first && second === undefined ? { name: 'project', pid: decode(first) } : NOT_FOUND;
    case 'day':
      return first && second === undefined ? { name: 'day', dayId: decode(first) } : NOT_FOUND;
    case 'page':
      if (!first) return NOT_FOUND;
      return { name: 'page', id: decode(first), anchor: second ? decode(second) : null };
    default:
      return NOT_FOUND;
  }
}
