// ==========================================================
// main.js - 모든 페이지에서 쓰는 코드
// 1) 모바일 메뉴 열기/닫기  2) 다크 모드  3) 시간대별 인사말
// (HTML에서 <script src="js/main.js" defer>로 불러와요)
// ==========================================================

// ---------- 1. 모바일 메뉴 (Day 21) ----------
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('#site-nav');

menuToggle.addEventListener('click', () => {
  // classList.toggle: open 클래스가 없으면 붙이고(true), 있으면 떼요(false)
  const isOpen = siteNav.classList.toggle('open');
  // 스크린 리더가 메뉴가 열렸는지 알 수 있게 aria-expanded도 같이 바꿔요
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

// ---------- 2. 다크 모드 (Day 22) ----------
const themeButton = document.querySelector('.theme-toggle');

// 저장된 테마를 꺼내요.
// (try/catch는 Day 25에서 자세히 배워요) 브라우저 설정 때문에 저장소를 못 쓰면 오류가 나서, 사이트가 멈추지 않게 감싸 둬요.
function getSavedTheme() {
  try {
    return localStorage.getItem('theme'); // 'light' 또는 'dark', 없으면 null
  } catch (error) {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem('theme', theme);
  } catch (error) {
    // 저장하지 못해도 사이트는 계속 동작해요
  }
}

// 테마를 화면에 적용해요: <html data-theme="dark"> → style.css의 다크 변수가 켜져요
// 버튼 글자("다크 모드")는 그대로 두고, 켜졌는지는 aria-pressed로 알려 줘요
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
}

// 처음 방문이면 컴퓨터의 다크 모드 설정(prefers-color-scheme)을 따라가요
const savedTheme = getSavedTheme();
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'light' || savedTheme === 'dark') {
  applyTheme(savedTheme);
} else {
  applyTheme(systemPrefersDark ? 'dark' : 'light');
}

themeButton.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
  saveTheme(nextTheme); // 다음에 와도 같은 테마가 되도록 저장해요
});

// ---------- 3. 시간대별 인사말 (Day 16) ----------
const greeting = document.querySelector('#greeting'); // 홈 페이지에만 있어요

if (greeting) {
  const hour = new Date().getHours(); // 0 ~ 23
  let message;

  if (hour < 6) {
    message = '늦은 밤이에요. 올빼미 시청자님, 어서 와요!';
  } else if (hour < 12) {
    message = '좋은 아침이에요! 오늘도 힘차게 시작해요.';
  } else if (hour < 18) {
    message = '즐거운 오후예요! 영상 구경하고 가세요.';
  } else {
    message = '좋은 저녁이에요! 오늘 방송 일정을 확인해 보세요.';
  }

  greeting.textContent = message;
}
