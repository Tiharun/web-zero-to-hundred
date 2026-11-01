// 주간 방송 일정 (#/schedule, #/schedule?week=2026-11-09) (Day 29)
// 서버에는 "한국 시간으로 이번 주 월요일 0시 ~ 다음 주 월요일 0시"를 UTC로 바꿔서 물어봐요.
import * as api from '../api.ts';
import type { Params } from '../router.ts';
import type { Schedule } from '../types.ts';
import {
  KST_OFFSET_MS,
  createElementWithText,
  createLink,
  errorMessage,
  formatKstTime,
  setStatus,
  toKstDateString,
} from '../ui.ts';

const DAY_MS = 24 * 60 * 60 * 1000;

const dayTitleFormat = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
});

const shortDateFormat = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  month: 'long',
  day: 'numeric',
});

// date가 들어 있는 주의 "한국 시간 월요일 0시"가 UTC로 언제인지 계산해요
export function startOfKstWeek(date: Date): Date {
  const kst = new Date(date.getTime() + KST_OFFSET_MS); // 한국 시각을 UTC 칸에 옮겨 담아요
  const daysSinceMonday = (kst.getUTCDay() + 6) % 7; // 월 0, 화 1, … 일 6
  const mondayAsUtc = Date.UTC(kst.getUTCFullYear(), kst.getUTCMonth(), kst.getUTCDate() - daysSinceMonday);
  return new Date(mondayAsUtc - KST_OFFSET_MS); // 9시간을 빼서 진짜 UTC 순간으로 돌려놔요
}

export async function renderSchedule(view: HTMLElement, _params: Params, query: URLSearchParams): Promise<void> {
  // ?week=2026-11-09 가 있으면 그날이 들어 있는 주, 없거나 잘못 쓰면 이번 주
  let base = new Date();
  const weekParam = query.get('week');
  if (weekParam !== null) {
    const parsed = new Date(`${weekParam}T00:00:00+09:00`); // 그 날짜의 한국 시간 0시
    if (!Number.isNaN(parsed.getTime())) {
      base = parsed;
    }
  }
  const weekStart = startOfKstWeek(base);
  const weekEnd = new Date(weekStart.getTime() + 7 * DAY_MS);

  view.innerHTML = `
    <h1>방송 일정</h1>
    <div class="week-nav">
      <a class="button secondary" id="prev-week">← 지난주</a>
      <strong id="week-label"></strong>
      <a class="button secondary" id="next-week">다음 주 →</a>
    </div>
    <p class="filter">
      <label for="streamer-filter">스트리머</label>
      <select id="streamer-filter"><option value="">전체</option></select>
    </p>
    <p class="status" role="status">불러오는 중...</p>
    <div class="week" id="week"></div>
  `;
  const prevWeek = new Date(weekStart.getTime() - 7 * DAY_MS);
  view.querySelector<HTMLAnchorElement>('#prev-week')!.href = `#/schedule?week=${toKstDateString(prevWeek)}`;
  view.querySelector<HTMLAnchorElement>('#next-week')!.href = `#/schedule?week=${toKstDateString(weekEnd)}`;
  const lastDay = new Date(weekEnd.getTime() - DAY_MS);
  view.querySelector('#week-label')!.textContent =
    `${shortDateFormat.format(weekStart)} ~ ${shortDateFormat.format(lastDay)}`;

  const filter = view.querySelector<HTMLSelectElement>('#streamer-filter')!;
  const status = view.querySelector<HTMLElement>('.status')!;
  const week = view.querySelector<HTMLElement>('#week')!;

  try {
    const schedules = await api.getSchedules(weekStart, weekEnd);

    // 이번 주에 방송하는 스트리머만 골라서 선택 상자에 넣어요 (Map: 같은 id는 한 번만)
    const streamerNames = new Map<number, string>();
    for (const schedule of schedules) {
      streamerNames.set(schedule.streamerId, schedule.streamerName);
    }
    for (const [id, name] of streamerNames) {
      const option = document.createElement('option');
      option.value = String(id);
      option.textContent = name;
      filter.append(option);
    }

    // 필터: 서버에 다시 묻지 않고, 이미 받은 목록에서 골라요
    const draw = () => {
      const selected = filter.value;
      const visible = selected === '' ? schedules : schedules.filter((s) => String(s.streamerId) === selected);
      drawWeek(week, weekStart, visible);
    };
    filter.addEventListener('change', draw);
    draw();
    setStatus(status, `방송 ${schedules.length}개`);
  } catch (error) {
    setStatus(status, errorMessage(error), true);
  }
}

// 월요일부터 일요일까지 하루에 한 칸씩 그려요
function drawWeek(container: HTMLElement, weekStart: Date, schedules: Schedule[]): void {
  container.replaceChildren();
  const today = toKstDateString(new Date());

  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart.getTime() + i * DAY_MS);
    const dayKey = toKstDateString(day); // 예: "2026-11-02"

    const section = document.createElement('section');
    section.className = dayKey === today ? 'day today' : 'day';
    section.append(createElementWithText('h2', '', dayTitleFormat.format(day)));

    // UTC로 받은 시작 시각을 한국 날짜로 바꿔서 이 날의 방송만 골라요
    const daySchedules = schedules.filter((s) => toKstDateString(new Date(s.startsAt)) === dayKey);
    if (daySchedules.length === 0) {
      section.append(createElementWithText('p', 'muted', '방송 없음'));
    }
    for (const schedule of daySchedules) {
      const item = document.createElement('p');
      item.className = 'slot';
      const link = createLink(`#/streamers/${schedule.streamerId}`, schedule.streamerName);
      item.append(
        createElementWithText('time', 'slot-time', formatKstTime(schedule.startsAt)),
        ' ',
        link,
        createElementWithText('span', 'slot-title', `${schedule.title} (${schedule.durationMinutes}분)`),
      );
      section.append(item);
    }
    container.append(section);
  }
}
