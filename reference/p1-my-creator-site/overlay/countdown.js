// ==========================================================
// countdown.js - OBS 오버레이: 방송 시작까지 카운트다운
// 주소 예시: countdown.html?title=저녁 방송&start=20:00
//   title : 화면에 보여 줄 방송 제목
//   start : 오늘 방송 시작 시각 (HH:MM)
//
// 이 코드는 컴퓨터 시간이 한국 시간이라고 가정해요. 시간대는 P2에서 제대로 배워요.
// ==========================================================

const titleElement = document.querySelector('#title');
const countdownElement = document.querySelector('#countdown');

// ---------- 1. 주소(URL)에서 값 꺼내기 (Day 27) ----------
// location.search 는 '?title=...&start=...' 부분이에요
const params = new URLSearchParams(location.search);
const title = params.get('title') || '방송 시작까지'; // 없으면 기본 제목
const start = params.get('start') || '';

titleElement.textContent = title;

// ---------- 2. 시작 시각 확인하고 Date로 바꾸기 ----------
// 'HH:MM' 모양이고, 시는 0~23, 분은 0~59 사이인지 확인해요
function isValidStart(text) {
  const parts = text.split(':'); // '20:00' → ['20', '00']
  if (parts.length !== 2 || parts[0] === '' || parts[1] === '') {
    return false; // ':'가 하나가 아니거나 비어 있으면 틀린 값이에요
  }

  const hour = Number(parts[0]); // 글자를 숫자로 바꿔요. 숫자가 아니면 NaN이 되어 아래 비교에서 걸러져요
  const minute = Number(parts[1]);
  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
}

// 오늘 날짜에 시작 시각을 맞춘 Date를 만들어요
function getTargetTime(text) {
  const parts = text.split(':');
  const target = new Date(); // 지금
  target.setHours(Number(parts[0]), Number(parts[1]), 0, 0); // 시, 분, 초, 밀리초
  return target;
}

// 숫자를 두 자리 글자로: 5 → '05'
function pad(number) {
  return String(number).padStart(2, '0');
}

// ---------- 3. 1초마다 화면 갱신 ----------
let timerId = null;   // setInterval이 돌려주는 번호 (멈출 때 필요해요)
let targetTime = null; // 시작 시각 (Date)

function update() {
  const remaining = targetTime - new Date(); // 남은 시간 (밀리초). Date끼리 빼면 숫자가 나와요

  if (remaining <= 0) {
    countdownElement.textContent = '곧 시작해요!';
    clearInterval(timerId); // 더 이상 계산할 필요가 없어요
    return;
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  countdownElement.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

if (!isValidStart(start)) {
  // start가 없거나 모양이 틀리면 사용법을 알려 줘요
  countdownElement.classList.add('hint');
  countdownElement.textContent = '주소 끝에 ?title=방송 제목&start=20:00 을 붙여 주세요 (start는 HH:MM, 예: 20:00)';
} else {
  targetTime = getTargetTime(start);
  timerId = setInterval(update, 1000); // 1초마다 update 실행
  update(); // 1초 기다리지 않고 바로 한 번 보여 줘요
}
