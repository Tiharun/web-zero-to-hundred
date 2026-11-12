// 진도·해금 순수 로직. DOM·저장소를 만지지 않고, 받은 객체를 바꾸지 않는다(항상 새 객체를 돌려준다).
// cur = 빌드가 임베드한 data ({ projects: [{ id, order, track, requires, days: [...] }], pages: [{ id, requires }] })
// prog = Progress ({ version, completed, checks, lastDay, theme })

export const STORAGE_KEY = 'wzh:v1:progress';

const BACKUP_APP = 'web-zero-to-hundred';
const BACKUP_SCHEMA = 1;
const THEMES = ['system', 'light', 'dark'];

// ───────── 작은 도우미 ─────────

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const projectsOf = (cur) => (Array.isArray(cur?.projects) ? cur.projects : []);
const pagesOf = (cur) => (Array.isArray(cur?.pages) ? cur.pages : []);
const getProject = (cur, pid) => projectsOf(cur).find((p) => p.id === pid);
const isDone = (prog, dayId) => Object.hasOwn(prog.completed, dayId);

/** dayId 가 속한 프로젝트와 그 안에서의 위치. 모르는 Day 면 null */
function locateDay(cur, dayId) {
  for (const project of projectsOf(cur)) {
    const index = project.days.findIndex((d) => d.id === dayId);
    if (index >= 0) return { project, index };
  }
  return null;
}

/** 프로젝트에서 가장 앞의 미완료 Day 의 위치. 모두 끝났으면 -1 */
const firstIncompleteIndex = (project, prog) => project.days.findIndex((d) => !isDone(prog, d.id));

// ───────── 진도 객체 ─────────

export function emptyProgress() {
  return { version: 1, completed: {}, checks: {}, lastDay: null, theme: 'system' };
}

/**
 * normalizeProgress 와 importBackup 이 같이 쓴다. dropped = 버려진 서로 다른 모르는 Day 수.
 * 값이 이상한 것은 버리지만, cur 가 깨져서 읽을 수 없는 경우에는 던진다 — 부르는 쪽이 정한다
 */
function normalizeWithStats(raw, cur) {
  if (!isPlainObject(raw)) return { progress: emptyProgress(), dropped: 0 };

  const checkCounts = new Map(); // dayId → checkCount
  for (const project of projectsOf(cur)) for (const day of project.days) checkCounts.set(day.id, day.checkCount);

  const unknown = new Set();
  const progress = emptyProgress();

  if (isPlainObject(raw.completed)) {
    for (const [id, at] of Object.entries(raw.completed)) {
      if (!checkCounts.has(id)) {
        unknown.add(id);
      } else if (typeof at === 'string' && !Number.isNaN(Date.parse(at))) {
        progress.completed[id] = at;
      }
    }
  }

  if (isPlainObject(raw.checks)) {
    for (const [id, list] of Object.entries(raw.checks)) {
      if (!checkCounts.has(id)) {
        unknown.add(id);
        continue;
      }
      if (!Array.isArray(list)) continue;
      const count = checkCounts.get(id);
      const kept = [...new Set(list.filter((i) => Number.isInteger(i) && i >= 0 && i < count))].sort((a, b) => a - b);
      if (kept.length > 0) progress.checks[id] = kept;
    }
  }

  if (typeof raw.lastDay === 'string' && checkCounts.has(raw.lastDay)) progress.lastDay = raw.lastDay;
  if (THEMES.includes(raw.theme)) progress.theme = raw.theme;

  return { progress, dropped: unknown.size };
}

/** 저장소·백업에서 읽은 값을 믿을 수 있는 Progress 로 바꾼다. 실패하면 빈 진도 */
export function normalizeProgress(raw, cur) {
  try {
    return normalizeWithStats(raw, cur).progress;
  } catch {
    return emptyProgress();
  }
}

// ───────── 해금·상태 ─────────

export function isProjectComplete(cur, prog, pid) {
  const project = getProject(cur, pid);
  return Boolean(project) && project.days.length > 0 && project.days.every((d) => isDone(prog, d.id));
}

/** requires(프로젝트 id 목록)를 모두 완료했는가. requires 가 없으면 열려 있다. 프로젝트와 페이지가 같이 쓴다 */
export function isUnlocked(cur, prog, requires) {
  if (requires == null) return true;
  return Array.isArray(requires) && requires.every((pid) => isProjectComplete(cur, prog, pid));
}

export function projectState(cur, prog, pid) {
  const project = getProject(cur, pid);
  if (!project || !isUnlocked(cur, prog, project.requires)) return 'locked';
  return isProjectComplete(cur, prog, pid) ? 'complete' : 'active';
}

export function dayState(cur, prog, dayId) {
  const loc = locateDay(cur, dayId);
  if (!loc || !isUnlocked(cur, prog, loc.project.requires)) return 'locked';
  if (isDone(prog, dayId)) return 'done';
  return firstIncompleteIndex(loc.project, prog) === loc.index ? 'next' : 'open';
}

/**
 * 사이드바 Day 행의 상태. 오늘은 continueTarget 하나뿐이다 (분홍 네모는 하나).
 * 우선순위: 잠김 > 완료 > 오늘 > 준비 중(ready === false) > 남음
 * @returns {'locked' | 'done' | 'today' | 'draft' | 'open'}
 */
export function navDayState(cur, prog, dayId, todayId = continueTarget(cur, prog)) {
  const loc = locateDay(cur, dayId);
  if (!loc || !isUnlocked(cur, prog, loc.project.requires)) return 'locked';
  if (isDone(prog, dayId)) return 'done';
  if (dayId === todayId) return 'today';
  return loc.project.days[loc.index].ready === false ? 'draft' : 'open';
}

export function canComplete(cur, prog, dayId) {
  const loc = locateDay(cur, dayId);
  if (!loc || !isUnlocked(cur, prog, loc.project.requires)) return false;
  if (isDone(prog, dayId)) return false;
  return loc.index === 0 || isDone(prog, loc.project.days[loc.index - 1].id);
}

export function canUncomplete(cur, prog, dayId) {
  const loc = locateDay(cur, dayId);
  if (!loc || !isDone(prog, dayId)) return false;
  const following = loc.project.days[loc.index + 1];
  if (following && isDone(prog, following.id)) return false;
  // 이 프로젝트를 필요로 하는 프로젝트에 이미 진도가 있으면 되돌릴 수 없다
  const dependents = projectsOf(cur).filter((p) => Array.isArray(p.requires) && p.requires.includes(loc.project.id));
  return !dependents.some((p) => p.days.some((d) => isDone(prog, d.id)));
}

// ───────── 변경 (새 Progress 를 돌려준다) ─────────

export function completeDay(cur, prog, dayId, nowIso) {
  if (!canComplete(cur, prog, dayId)) throw new Error('cannot-complete');
  return { ...prog, completed: { ...prog.completed, [dayId]: nowIso }, lastDay: dayId };
}

export function uncompleteDay(cur, prog, dayId) {
  if (!canUncomplete(cur, prog, dayId)) throw new Error('cannot-uncomplete');
  const { [dayId]: _removed, ...rest } = prog.completed;
  return { ...prog, completed: rest };
}

export function toggleCheck(prog, dayId, index) {
  if (!Number.isInteger(index) || index < 0) return { ...prog };
  const current = Object.hasOwn(prog.checks, dayId) ? prog.checks[dayId] : [];
  const next = current.includes(index) ? current.filter((i) => i !== index) : [...current, index].sort((a, b) => a - b);
  const { [dayId]: _replaced, ...others } = prog.checks;
  return { ...prog, checks: next.length > 0 ? { ...others, [dayId]: next } : others };
}

// ───────── 안내 ─────────

/** before → after 사이에 새로 열린 프로젝트·페이지 id (프로젝트 먼저). 축하 배너에 쓴다 */
export function newlyUnlocked(cur, before, after) {
  return [...projectsOf(cur), ...pagesOf(cur)]
    .filter((item) => !isUnlocked(cur, before, item.requires) && isUnlocked(cur, after, item.requires))
    .map((item) => item.id);
}

/** main 먼저, 트랙 안에서는 order 순으로 정렬한 프로젝트 (continueTarget 과 같은 순서) */
const orderedProjects = (cur) =>
  ['main', 'special'].flatMap((track) =>
    projectsOf(cur)
      .filter((p) => p.track === track)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
  );

/** "이어서 하기" 대상. main 트랙을 order 순으로 보고 첫 next, main 이 끝났으면 special 의 첫 next */
export function continueTarget(cur, prog) {
  for (const project of orderedProjects(cur)) {
    if (!isUnlocked(cur, prog, project.requires)) continue;
    const index = firstIncompleteIndex(project, prog);
    if (index >= 0) return project.days[index].id;
  }
  return null;
}

/**
 * 홈 퀘스트 카드의 상태. 저장하지 않고 prog 에서 매번 계산한다.
 * 우선순위: 모두 완료(done) > 준비 중(pending) > 월드 클리어(clear) > 처음(start) > 공부 중(continue)
 * worldId 는 "지금 월드": clear 면 끝낸 프로젝트, done 이면 lastDay 의 프로젝트(없으면 마지막 프로젝트), 그 밖에는 dayId 의 프로젝트
 * @returns {{ kind: 'start' | 'continue' | 'clear' | 'pending' | 'done', dayId: string | null, clearedId: string | null, reviewId: string | null, worldId: string | null }}
 */
export function questState(cur, prog) {
  const dayId = continueTarget(cur, prog);
  const last = typeof prog.lastDay === 'string' && isDone(prog, prog.lastDay) ? locateDay(cur, prog.lastDay) : null;
  const base = { dayId, clearedId: null, reviewId: null };

  if (dayId === null) {
    const world = last?.project ?? orderedProjects(cur).at(-1);
    return { kind: 'done', ...base, worldId: world?.id ?? null };
  }

  const target = locateDay(cur, dayId);
  const worldId = target.project.id;
  if (target.project.days[target.index].ready === false) {
    return { kind: 'pending', ...base, reviewId: last ? prog.lastDay : null, worldId };
  }
  if (
    last &&
    last.project.id !== worldId &&
    isProjectComplete(cur, prog, last.project.id) &&
    !target.project.days.some((d) => isDone(prog, d.id))
  ) {
    return { kind: 'clear', ...base, clearedId: last.project.id, worldId: last.project.id };
  }
  const anyDone = Object.keys(prog.completed).length > 0;
  return { kind: anyDone ? 'continue' : 'start', ...base, worldId };
}

/** 트랙의 완료 Day 비율(내림, 0..100). Day 가 없는 트랙은 0 */
export function percent(cur, prog, track) {
  const days = projectsOf(cur)
    .filter((p) => p.track === track)
    .flatMap((p) => p.days);
  if (days.length === 0) return 0;
  const done = days.filter((d) => isDone(prog, d.id)).length;
  return Math.floor((done * 100) / days.length);
}

// ───────── 백업 ─────────

export function exportBackup(prog, nowIso) {
  return JSON.stringify({ app: BACKUP_APP, schema: BACKUP_SCHEMA, exportedAt: nowIso, progress: prog }, null, 2);
}

/** 백업 파일 글자를 검증해서 읽는다. 실패하면 한국어 오류를 돌려주고, 호출하는 쪽은 기존 진도를 그대로 둔다 */
export function importBackup(text, cur) {
  let data;
  try {
    if (typeof text !== 'string') throw new TypeError('not text');
    data = JSON.parse(text.replace(/^\uFEFF/, '')); // 메모장이 붙이는 BOM 은 무시
  } catch {
    return { ok: false, error: 'JSON 파일이 아니에요. 이 교재에서 내보낸 백업 파일(.json)을 골라 주세요.' };
  }
  if (!isPlainObject(data) || data.app !== BACKUP_APP) {
    return { ok: false, error: '이 교재의 백업 파일이 아니에요. 이 교재에서 내보낸 백업 파일을 골라 주세요.' };
  }
  if (data.schema !== BACKUP_SCHEMA) {
    const shown = typeof data.schema === 'number' || typeof data.schema === 'string' ? String(data.schema).slice(0, 20) : '없음';
    return { ok: false, error: `지원하지 않는 백업 형식이에요(schema ${shown}). 이 교재에서 다시 내보낸 파일을 골라 주세요.` };
  }
  if (!isPlainObject(data.progress)) {
    return { ok: false, error: '백업 파일 안에 진도 정보가 없거나 형식이 잘못됐어요.' };
  }
  let result;
  try {
    result = normalizeWithStats(data.progress, cur);
  } catch {
    // 빈 진도로 "성공"시키면 기존 진도를 지워 버린다. 실패로 알리고 기존 진도는 그대로 둔다
    return { ok: false, error: '백업 파일을 읽는 중에 문제가 생겼어요. 파일이 손상됐을 수 있어요. 지금 진도는 그대로 두었어요.' };
  }
  const { progress, dropped } = result;
  if (dropped > 0 && Object.keys(progress.completed).length === 0 && Object.keys(progress.checks).length === 0) {
    return {
      ok: false,
      error: `백업 파일의 Day ${dropped}개가 모두 이 교재에 없어요. 다른 교재나 다른 버전에서 내보낸 파일일 수 있어요. 가져올 진도가 없어서 지금 진도는 그대로 두었어요.`,
    };
  }
  return { ok: true, progress, dropped };
}
