// 가입 (#/register) (Day 31): 가입하면 바로 로그인 상태가 돼요
import * as api from '../api.ts';
import { register } from '../auth.ts';
import { errorMessage, setStatus } from '../ui.ts';

export function renderRegister(view: HTMLElement): void {
  view.innerHTML = `
    <h1>가입</h1>
    <form class="form narrow" id="register-form">
      <label for="register-email">이메일</label>
      <input id="register-email" type="email" required autocomplete="email">
      <label for="register-name">닉네임 (게시판에 보여요, 2~20자)</label>
      <input id="register-name" required minlength="2" maxlength="20" autocomplete="nickname">
      <label for="register-password">비밀번호</label>
      <input id="register-password" type="password" required minlength="6" autocomplete="new-password" aria-describedby="password-rule">
      <p class="hint" id="password-rule">6자 이상, 영어 대문자·소문자·숫자·기호(! - _ 등)를 하나 이상씩 넣어 주세요.</p>
      <p class="actions"><button type="submit" class="button">가입하기</button></p>
      <p class="status" role="status"></p>
    </form>
    <p>이미 계정이 있나요? <a href="#/login">로그인</a></p>
  `;
  const form = view.querySelector<HTMLFormElement>('#register-form')!;
  const emailInput = view.querySelector<HTMLInputElement>('#register-email')!;
  const nameInput = view.querySelector<HTMLInputElement>('#register-name')!;
  const passwordInput = view.querySelector<HTMLInputElement>('#register-password')!;
  const submitButton = form.querySelector('button')!;
  const status = form.querySelector<HTMLElement>('.status')!;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    submitButton.disabled = true;
    setStatus(status, '가입하는 중...');
    try {
      await register(emailInput.value.trim(), passwordInput.value, nameInput.value.trim());
      location.hash = '#/';
    } catch (error) {
      setStatus(status, registerErrorMessage(error), true);
      submitButton.disabled = false;
    }
  });
}

// Identity는 오류를 영어 코드로 알려 줘요(예: DuplicateUserName, PasswordRequiresUpper). 자주 나오는 것만 한국어로 바꿔요
function registerErrorMessage(error: unknown): string {
  if (error instanceof api.ApiError) {
    const codes = Object.keys(error.errors);
    if (codes.includes('DuplicateUserName')) {
      return '이미 가입한 이메일이에요. 로그인해 주세요.';
    }
    if (codes.some((code) => code.startsWith('Password'))) {
      return '비밀번호 규칙에 맞지 않아요. 6자 이상, 영어 대문자·소문자·숫자·기호를 하나 이상씩 넣어 주세요.';
    }
  }
  return errorMessage(error);
}
