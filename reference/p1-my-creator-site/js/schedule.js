// ==========================================================
// schedule.js - 방송 일정 페이지
// 1) 오늘 요일 행 강조  2) 다음 방송까지 남은 시간 카운트다운
//
// 이 코드는 컴퓨터 시간이 한국 시간이라고 가정해요. 시간대는 P2에서 제대로 배워요.
// ==========================================================

const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

const nextInfo = document.querySelector('#next-info');
const nextRemaining = document.querySelector('#next-remaining');

let schedule = []; // data/schedule.json 내용이 들어와요

// 숫자를 두 자리 글자로: 5 → '05' (Day 15~18)
function pad(number) {
  return String(number).padStart(2, '0');
}

// ---------- 1. 오늘 요일 강조 (Day 26) ----------
function highlightToday() {
  const today = new Date().getDay(); // 일요일 0 ~ 토요일 6
  const row = document.querySelector(`tr[data-day="${today}"]`);
  if (row) {
    row.classList.add('today'); // style.css의 .today 스타일이 적용돼요
    row.setAttribute('aria-current', 'date');
  }
}

// ---------- 2. 다음 방송 찾기 ----------
// 방송 하나가 "다음에 시작하는 시각"을 Date로 구해요
function getNextStartTime(item, now) {
  const parts = item.start.split(':'); // '20:00' → ['20', '00']

  const next = new Date(now); // 지금 시각을 복사해요 (now 자체는 바꾸지 않으려고요)
  next.setHours(Number(parts[0]), Number(parts[1]), 0, 0); // 오늘의 방송 시각 (시, 분, 초, 밀리초)

  const daysLater = (item.day - now.getDay() + 7) % 7; // 며칠 뒤 요일인지 (0 ~ 6)
  next.setDate(next.getDate() + daysLater);

  if (next <= now) {
    // Date끼리는 크기를 비교할 수 있어요. 이미 지났다면 다음 주예요
    next.setDate(next.getDate() + 7);
  }
  return next;
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

  const clock = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return days > 0 ? `${days}일 ${clock}` : clock;
}

function updateCountdown() {
  const now = new Date();
  const next = findNextBroadcast(now);
  if (next === null) {
    nextInfo.textContent = '예정된 방송이 없어요.';
    return;
  }
  nextInfo.textContent = `${dayNames[next.item.day]} ${next.item.start} · ${next.item.title} · 시작까지`;
  nextRemaining.textContent = formatRemaining(next.time - now); // Date끼리 빼면 밀리초 숫자가 나와요
}

// ---------- 시작: 일정 불러오기 → 카운트다운 시작 (Day 25, 26) ----------
async function start() {
  highlightToday();
  try {
    const response = await fetch('data/schedule.json');
    if (!response.ok) {
      throw new Error(`서버 응답 코드: ${response.status}`);
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
