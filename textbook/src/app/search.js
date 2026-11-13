// 전체 텍스트 검색. 색인은 빌드가 임베드한 data.search ([{ id, kind, project, title, text }]).
// 질의와 색인을 같은 방식(NFC 정규화 + 소문자)으로 맞춰서 비교한다. snippet 은 일반 글자라서 화면에 넣을 때 이스케이프해야 한다.

const CONTEXT = 40; // snippet: 첫 일치 앞뒤로 보여 줄 글자 수
const TITLE_WEIGHT = 10;

const fold = (s) => String(s ?? '').normalize('NFC').toLowerCase();

/** needle(빈 글자 아님)이 겹치지 않게 몇 번 나오는가 */
function countOccurrences(haystack, needle) {
  let count = 0;
  for (let at = haystack.indexOf(needle); at !== -1; at = haystack.indexOf(needle, at + needle.length)) count++;
  return count;
}

const isHighSurrogate = (code) => code >= 0xd800 && code <= 0xdbff;
const isLowSurrogate = (code) => code >= 0xdc00 && code <= 0xdfff;

/** [start, end) 를 자르되 이모지 같은 서로게이트 쌍을 반으로 가르지 않는다 */
function cut(text, start, end) {
  if (start > 0 && isLowSurrogate(text.charCodeAt(start))) start++;
  if (end < text.length && isHighSurrogate(text.charCodeAt(end - 1))) end--;
  return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
}

/** 본문에서 가장 앞선 일치 앞뒤 CONTEXT 글자. 본문에는 일치가 없고 제목에만 있으면 본문 첫머리 */
function makeSnippet(text, terms) {
  const nfc = String(text ?? '').normalize('NFC');
  const lower = nfc.toLowerCase();
  const shown = lower.length === nfc.length ? nfc : lower; // 소문자로 길이가 달라지는 드문 글자는 위치를 맞추려고 소문자 쪽을 쓴다
  let first = -1;
  let length = 0;
  for (const term of terms) {
    const at = lower.indexOf(term);
    if (at !== -1 && (first === -1 || at < first)) {
      first = at;
      length = term.length;
    }
  }
  if (first === -1) return cut(shown, 0, Math.min(shown.length, CONTEXT * 2));
  return cut(shown, Math.max(0, first - CONTEXT), Math.min(shown.length, first + length + CONTEXT));
}

// 항목마다 한 번만 접어 둔다. 색인은 빌드가 넣은 뒤 바뀌지 않는다
const folded = new WeakMap();
function foldOf(item) {
  let f = folded.get(item);
  if (!f) {
    f = { title: fold(item.title), text: fold(item.text) };
    folded.set(item, f);
  }
  return f;
}

const termsOf = (query) => fold(query).split(/\s+/).filter(Boolean);

/** 모든 단어가 제목이나 본문에 있으면 점수, 하나라도 없으면 null */
function scoreItem(item, terms) {
  const { title, text } = foldOf(item);
  let score = 0;
  for (const term of terms) {
    const inTitle = countOccurrences(title, term);
    const inText = countOccurrences(text, term);
    if (inTitle + inText === 0) return null;
    score += inTitle * TITLE_WEIGHT + inText;
  }
  return score;
}

function finish(hits, terms, isItemLocked, limit) {
  hits.sort((a, b) => b.score - a.score); // 안정 정렬: 같은 점수는 색인 순서 그대로
  return hits.slice(0, limit).map(({ item }) => ({
    id: item.id,
    kind: item.kind,
    project: item.project,
    title: item.title,
    snippet: isItemLocked(item) ? null : makeSnippet(item.text, terms),
  }));
}

/**
 * @param {{ id: string, kind: string, project: string|null, title: string, text: string }[]} index
 * @param {string} query 공백으로 나눈 모든 단어가 제목이나 본문에 있어야 한다
 * @param {(item: { id: string, kind: string, project: string|null, title: string, text: string }) => boolean} [isItemLocked]
 *   색인 항목이 잠겨 있으면 true. 잠긴 항목(잠긴 프로젝트의 Day, 잠긴 페이지)은 제목·본문으로 찾아지지만
 *   snippet 을 null 로 한다. 잠금 여부는 부르는 쪽이 progress.isUnlocked 로 계산한다
 * @param {number} [limit]
 * @returns {{ id: string, kind: string, project: string|null, title: string, snippet: string|null }[]}
 *   점수 = 제목에 나온 횟수 × 10 + 본문에 나온 횟수 (단어별 합). 점수가 같으면 색인 순서
 */
export function search(index, query, isItemLocked = () => false, limit = 30) {
  if (!Array.isArray(index) || typeof query !== 'string') return [];
  const terms = termsOf(query);
  if (terms.length === 0) return [];
  const hits = [];
  for (const item of index) {
    const score = scoreItem(item, terms);
    if (score !== null) hits.push({ item, score });
  }
  return finish(hits, terms, isItemLocked, limit);
}

/**
 * search 와 같은 결과를 내되, budget(ms)만큼 계산하면 pause() 로 쉬어 가며 화면이 그려질 틈을 준다
 * (느린 기기에서 입력과 Skeleton 이 멈추지 않게). signal 이 멈춤을 알리면 다음 쉼에서 null 로 끝난다.
 * @returns {Promise<ReturnType<typeof search> | null>}
 */
export async function searchAsync(
  index,
  query,
  isItemLocked = () => false,
  { limit = 30, signal, budget = 8, now = () => performance.now(), pause = () => new Promise((resolve) => setTimeout(resolve, 0)) } = {},
) {
  if (signal?.aborted) return null;
  if (!Array.isArray(index) || typeof query !== 'string') return [];
  const terms = termsOf(query);
  if (terms.length === 0) return [];
  const hits = [];
  let started = now();
  for (const item of index) {
    if (now() - started >= budget) {
      await pause();
      if (signal?.aborted) return null;
      started = now();
    }
    const score = scoreItem(item, terms);
    if (score !== null) hits.push({ item, score });
  }
  if (signal?.aborted) return null;
  return finish(hits, terms, isItemLocked, limit);
}
