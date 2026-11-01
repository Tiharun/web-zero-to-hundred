// 사이트의 시작점: 주소와 화면을 연결하고, 위쪽 메뉴를 로그인 상태에 맞게 그려요
import './style.css';
import { getCurrentUser, isAdmin, loadCurrentUser, logout, onAuthChange } from './auth.ts';
import { addRoute, startRouter } from './router.ts';
import { renderAdmin } from './pages/admin.ts';
import { renderBoard } from './pages/board.ts';
import { renderHome } from './pages/home.ts';
import { renderLogin } from './pages/login.ts';
import { renderPostDetail } from './pages/postDetail.ts';
import { renderPostForm } from './pages/postForm.ts';
import { renderRegister } from './pages/register.ts';
import { renderSchedule } from './pages/schedule.ts';
import { renderStreamerDetail } from './pages/streamerDetail.ts';
import { renderStreamers } from './pages/streamers.ts';

// 주소 → 화면 (Day 28). 위에서부터 비교하니까 /board/new를 /board/:id보다 먼저 써요
addRoute('/', renderHome);
addRoute('/streamers', renderStreamers);
addRoute('/streamers/:id', renderStreamerDetail);
addRoute('/schedule', renderSchedule);
addRoute('/board', renderBoard);
addRoute('/board/new', renderPostForm);
addRoute('/board/:id', renderPostDetail);
addRoute('/board/:id/edit', renderPostForm);
addRoute('/login', renderLogin);
addRoute('/register', renderRegister);
addRoute('/admin', renderAdmin);

// index.html에 처음부터 있는 요소들이라 반드시 있어요(!)
const app = document.querySelector<HTMLElement>('#app')!;
const authMenu = document.querySelector<HTMLElement>('#auth-menu')!;
const adminLink = document.querySelector<HTMLElement>('#admin-link')!;
const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-links a');

// 오른쪽 위 메뉴: 로그인 전에는 로그인·가입, 로그인 뒤에는 "닉네임님"과 로그아웃
function renderAuthMenu(): void {
  adminLink.hidden = !isAdmin(); // 역할에 따라 메뉴를 보이거나 숨겨요 (Day 32)

  const user = getCurrentUser();
  if (user === null) {
    authMenu.innerHTML = '<a href="#/login">로그인</a> <a class="button" href="#/register">가입</a>';
    return;
  }

  // 틀(innerHTML)에는 우리가 쓴 글자만 넣고, 사용자가 정한 닉네임은 textContent로 넣어요 (XSS 방지)
  authMenu.innerHTML =
    '<span class="user-name"></span> <button type="button" class="button secondary">로그아웃</button>';
  authMenu.querySelector('.user-name')!.textContent = `${user.displayName}님`;
  authMenu.querySelector('button')!.addEventListener('click', async () => {
    try {
      await logout();
      location.hash = '#/';
    } catch {
      alert('로그아웃하지 못했어요. 잠시 뒤에 다시 해 주세요.');
    }
  });
}

// 지금 보고 있는 메뉴에 aria-current="page"를 붙여요 (CSS로 밑줄)
function markCurrentLink(): void {
  const section = (location.hash || '#/').split('?')[0].split('/')[1]; // "#/board/3" → "board"
  for (const link of navLinks) {
    const linkSection = link.getAttribute('href')!.split('/')[1];
    if (linkSection === section) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  }
}

async function start(): Promise<void> {
  onAuthChange(renderAuthMenu);
  window.addEventListener('hashchange', markCurrentLink);

  try {
    await loadCurrentUser(); // 쿠키가 있으면 로그인 상태로 시작해요
  } catch {
    // 서버가 꺼져 있어도 화면은 그려요. 각 화면이 오류 문장을 보여 줘요
  }
  renderAuthMenu();
  markCurrentLink();
  startRouter(app);
}

start();
