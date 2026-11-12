// XP·레벨 순수 계산(DESIGN.md HUD "XP 공식(규칙)"). 저장하지 않고 매번 prog 에서 계산한다.
// XP = 완료한 Day 의 minutes 합, 레벨 = floor(XP / LEVEL_XP) + 1

export const LEVEL_XP = 300;

const isDone = (prog, id) => Object.hasOwn(prog.completed, id);

/** cur 에 있는 Day 중 완료한 것의 minutes 합. 숫자가 아닌 minutes 는 0 */
export function totalXp(cur, prog) {
  let xp = 0;
  for (const project of Array.isArray(cur?.projects) ? cur.projects : []) {
    for (const day of project.days) {
      if (isDone(prog, day.id) && Number.isFinite(day.minutes)) xp += day.minutes;
    }
  }
  return xp;
}

/** 누적 XP → 레벨과 이번 레벨 안의 위치 */
export function levelOf(xp) {
  const inLevel = xp % LEVEL_XP;
  return { xp, level: Math.floor(xp / LEVEL_XP) + 1, inLevel, toNext: LEVEL_XP - inLevel, ratio: inLevel / LEVEL_XP };
}
