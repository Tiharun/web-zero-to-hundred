// ==========================================================
// schedule.js - 방송 일정 페이지
// 1) 오늘 요일 행 강조  2) 다음 방송까지 남은 시간 카운트다운
// 방송 시간은 "한국 시간" 기준이라, 컴퓨터가 어느 나라 시간이든 똑같이 동작해요.
// ==========================================================

const KST_OFFSET = 9 * 60 * 60 * 1000; // 한국은 UTC보다 9시간 빨라요 (밀리초)
const DAY = 24 * 60 * 60 * 1000;       // 하루 (밀리초)
const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

const nextInfo = document.querySelector('#next-info');
const nextRemaining = document.querySelector('#next-remaining');

let schedule = []; // data/schedule.json 내용이 들어와요

// 숫자를 두 자리 글자로: 5 → '05' (Day 15~18)
function pad(number) {
  return String(number).padStart(2, '0');
}

// 지금 한국 시각을 알려 주는 Date를 돌려줘요.
// 지금 시각에 9시간을 더한 뒤 getUTC...()로 읽으면 한국 시각이 나와요.
function getKstNow() {
  return new Date(Date.now() + KST_OFFSET);
}

// ---------- 1. 오늘 요일 강조 (Day 26) ----------
function highlightToday() {
  const today = getKstNow().getUTCDay(); // 일요일 0 ~ 토요일 6
  const row = document.querySelector('tr[data-day="' + today + '"]');
  if (row) {
    row.classList.add('today'); // style.css의 .today 스타일이 적용돼요
    row.setAttribute('aria-current', 'date');
  }
}

// ---------- 2. 다음 방송 찾기 ----------
// 방송 하나가 "다음에 시작하는 시각"을 밀리초로 구해요
function getNextStartTime(item, now) {
  const parts = item.start.split(':'); // '20:00' → ['20', '00']
  const hour = Number(parts[0]);
  const minute = Number(parts[1]);

  const kst = new Date(now + KST_OFFSET); // 한국 시각으로 읽기 위한 Date
  // 오늘 날짜의 방송 시각 (한국 시간)을 진짜 밀리초로 바꿔요
  const todayStart =
    Date.UTC(kst.getUTCFullYear(), kst.getUTCMonth(), kst.getUTCDate(), hour, minute) - KST_OFFSET;

  const daysLater = (item.day - kst.getUTCDay() + 7) % 7; // 며칠 뒤 요일인지 (0 ~ 6)
  let time = todayStart + daysLater * DAY;

  if (time <= now) {
    time = time + 7 * DAY; // 이미 지났다면 다음 주예요
  }
  return time;
}

// 모든 방송 중에서 가장 가까운 것을 찾아요 (Day 17: 반복문)
function findNextBroadcast(now) {
  let next = null;
  for (const item of schedule) {
    const time = getNextStartTime(item, now);
    if (next === null || time < next.time) {
      next = { item: item, time: time };
    }
  }
  return next;
}

// 남은 시간(밀리초)을 '1일 02:03:04' 모양의 글자로 바꿔요
function formatRemaining(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const clock = pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
  return days > 0 ? days + '일 ' + clock : clock;
}

function updateCountdown() {
  const now = Date.now();
  const next = findNextBroadcast(now);
  if (next === null) {
    nextInfo.textContent = '예정된 방송이 없어요.';
    return;
  }
  nextInfo.textContent = dayNames[next.item.day] + ' ' + next.item.start + ' · ' + next.item.title + ' · 시작까지';
  nextRemaining.textContent = formatRemaining(next.time - now);
}

// ---------- 시작: 일정 불러오기 → 카운트다운 시작 (Day 25, 26) ----------
async function start() {
  highlightToday();
  try {
    const response = await fetch('data/schedule.json');
    if (!response.ok) {
      throw new Error('서버 응답 코드: ' + response.status);
    }
    schedule = await response.json();
    updateCountdown();
    setInterval(updateCountdown, 1000); // 1초(1000ms)마다 다시 계산해요
  } catch (error) {
    console.error('schedule.json을 불러오지 못했어요:', error);
    nextInfo.textContent = '방송 일정을 불러오지 못했어요. 아래 표를 확인해 주세요.';
  }
}

start();
