// 로그인 (#/login) (Day 31)
import * as api from '../api.ts';
import { login } from '../auth.ts';
import { errorMessage, setStatus } from '../ui.ts';

export function renderLogin(view: HTMLElement): void {
  view.innerHTML = `
    <h1>로그인</h1>
    <form class="form narrow" id="login-form">
      <label for="login-email">이메일</label>
      <input id="login-email" type="email" required autocomplete="email">
      <label for="login-password">비밀번호</label>
      <input id="login-password" type="password" required autocomplete="current-password">
      <p class="actions"><button type="submit" class="button">로그인</button></p>
      <p class="status" role="status"></p>
    </form>
    <p>아직 계정이 없나요? <a href="#/register">가입하기</a></p>
  `;
  const form = view.querySelector<HTMLFormElement>('#login-form')!;
  const emailInput = view.querySelector<HTMLInputElement>('#login-email')!;
  const passwordInput = view.querySelector<HTMLInputElement>('#login-password')!;
  const submitButton = form.querySelector('button')!;
  const status = form.querySelector<HTMLElement>('.status')!;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    submitButton.disabled = true;
    setStatus(status, '로그인하는 중...');
    try {
      await login(emailInput.value.trim(), passwordInput.value);
      location.hash = '#/';
    } catch (error) {
      // 401 = 이메일이나 비밀번호가 틀림. 어느 쪽이 틀렸는지는 알려 주지 않아요(계정이 있는지 숨기려고)
      if (error instanceof api.ApiError && error.status === 401) {
        setStatus(status, '이메일 또는 비밀번호가 맞지 않아요.', true);
      } else {
        setStatus(status, errorMessage(error), true);
      }
      submitButton.disabled = false;
    }
  });
}
