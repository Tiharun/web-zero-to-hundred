// 보상 사건 순수 계산(통합 로드맵 6장 5번). Day 완료 전후의 prog 를 비교해 토스트·보상 Modal 에 넘길 사건을 만든다.
// DOM·저장소를 만지지 않는다. 모양과 "세션에 한 번"은 화면 쪽(views/rewardmodal.js, day.js)이 맡는다.
import { levelOf, totalXp } from './level.js';
import { isProjectComplete, newlyUnlocked } from './progress.js';

/** dayId 가 든 프로젝트와 Day. 모르는 Day 면 null */
function locate(cur, dayId) {
  for (const project of Array.isArray(cur?.projects) ? cur.projects : []) {
    const day = project.days.find((d) => d.id === dayId);
    if (day) return { project, day };
  }
  return null;
}

/**
 * before → after 사이에 dayId 를 완료해서 생긴 보상 사건.
 * @returns {{ day: { id: string, num: number, minutes: number | null }, levelUp: { from: number, to: number, toNext: number } | null, worldClear: string | null, unlocked: string[] }}
 */
export function rewardEvents(cur, before, after, dayId) {
  const found = locate(cur, dayId);
  const was = levelOf(totalXp(cur, before));
  const now = levelOf(totalXp(cur, after));
  const pid = found?.project.id;
  return {
    day: { id: dayId, num: found?.day.num ?? null, minutes: Number.isFinite(found?.day.minutes) ? found.day.minutes : null },
    levelUp: now.level > was.level ? { from: was.level, to: now.level, toNext: now.toNext } : null,
    worldClear: pid && !isProjectComplete(cur, before, pid) && isProjectComplete(cur, after, pid) ? pid : null,
    unlocked: newlyUnlocked(cur, before, after),
  };
}

/** 띄울 보상 Modal 하나. 월드 클리어가 레벨업보다 앞이고, 같이 나면 레벨을 함께 싣는다. 없으면 null */
export function rewardModal(events) {
  if (events.worldClear) return { kind: 'world', pid: events.worldClear, level: events.levelUp?.to ?? null };
  if (events.levelUp) return { kind: 'level', level: events.levelUp.to, toNext: events.levelUp.toNext };
  return null;
}

/** "세션에 한 번" 기록 키. 월드 클리어는 홈 축하 조각(home.js)과 같은 키다 */
export function rewardKey(modal) {
  return modal.kind === 'world' ? `celebrate:${modal.pid}` : `levelup:${modal.level}`;
}

/** 업적 토스트 문장 (DESIGN.md "업적 토스트") */
export function rewardToast(events) {
  const { num, minutes } = events.day;
  let text = minutes === null ? `Day ${num} 완료!` : `Day ${num} 완료! 보상 +${minutes} XP`;
  if (events.unlocked.length > 0) text += ' · 새로 열린 곳이 있어요';
  return text;
}
