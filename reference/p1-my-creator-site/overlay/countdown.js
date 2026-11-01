// ==========================================================
// countdown.js - OBS 오버레이: 방송 시작까지 카운트다운
// 주소 예시: countdown.html?title=저녁 방송&start=20:00
//   title : 화면에 보여 줄 방송 제목
//   start : 오늘 방송 시작 시각 (한국 시간, HH:MM)
// ==========================================================

const KST_OFFSET = 9 * 60 * 60 * 1000; // 한국은 UTC보다 9시간 빨라요 (밀리초)

const titleElement = document.querySelector('#title');
const countdownElement = document.querySelector('#countdown');

// ---------- 1. 주소(URL)에서 값 꺼내기 (Day 27) ----------
// location.search 는 '?title=...&start=...' 부분이에요
const params = new URLSearchParams(location.search);
const title = params.get('title') || '방송 시작까지'; // 없으면 기본 제목
const start = params.get('start') || '';

titleElement.textContent = title;

// ---------- 2. 시작 시각을 밀리초로 바꾸기 ----------
// 'HH:MM' 모양이 맞는지 정규식으로 확인해요 (00:00 ~ 23:59)
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

function getTargetTime(startText) {
  const parts = startText.split(':'); // '20:00' → ['20', '00']
  const hour = Number(parts[0]);
  const minute = Number(parts[1]);

  // 한국 시각으로 "오늘 날짜"를 알아내요 (schedule.js의 getKstNow와 같은 방법이에요)
  const kst = new Date(Date.now() + KST_OFFSET);
  // 오늘 날짜 + 시작 시각(한국 시간)을 진짜 밀리초로 바꿔요
  return Date.UTC(kst.getUTCFullYear(), kst.getUTCMonth(), kst.getUTCDate(), hour, minute) - KST_OFFSET;
}

// 숫자를 두 자리 글자로: 5 → '05'
function pad(number) {
  return String(number).padStart(2, '0');
}

// ---------- 3. 1초마다 화면 갱신 ----------
let timerId = null; // setInterval이 돌려주는 번호 (멈출 때 필요해요)

function update() {
  const remaining = targetTime - Date.now(); // 남은 시간 (밀리초)

  if (remaining <= 0) {
    countdownElement.textContent = '곧 시작해요!';
    clearInterval(timerId); // 더 이상 계산할 필요가 없어요
    return;
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  countdownElement.textContent = pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
}

let targetTime = 0;

if (!timePattern.test(start)) {
  // start가 없거나 모양이 틀리면 사용법을 알려 줘요
  countdownElement.classList.add('hint');
  countdownElement.textContent = '주소 끝에 ?title=방송 제목&start=20:00 을 붙여 주세요 (start는 한국 시간 HH:MM)';
} else {
  targetTime = getTargetTime(start);
  timerId = setInterval(update, 1000); // 1초마다 update 실행
  update(); // 1초 기다리지 않고 바로 한 번 보여 줘요
}
