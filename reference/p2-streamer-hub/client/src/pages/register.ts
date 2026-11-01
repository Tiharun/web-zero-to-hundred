// 가입 (#/register) (Day 31): 가입하면 바로 로그인 상태가 돼요
import * as api from '../api.ts';
import { registerAndLogin, saveDisplayName } from '../auth.ts';
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

  // 가입은 두 단계예요: ① 가입 + 로그인 → ② 닉네임 저장. ①이 끝났는지 기억해 둬요
  let accountCreated = false;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // 앞뒤 빈칸을 뺀 닉네임으로 길이를 먼저 확인해요. (minlength는 빈칸도 글자로 세요: "a "는 2글자)
    // 서버에 보내기 전에 막아야 "가입은 됐는데 닉네임이 없는" 계정이 생기지 않아요
    const displayName = nameInput.value.trim();
    if (displayName.length < 2 || displayName.length > 20) {
      setStatus(status, '닉네임은 앞뒤 빈칸을 빼고 2~20자로 써 주세요.', true);
      nameInput.focus();
      return;
    }

    submitButton.disabled = true;
    try {
      if (!accountCreated) {
        setStatus(status, '가입하는 중...');
        await registerAndLogin(emailInput.value.trim(), passwordInput.value);
        accountCreated = true;
        // 계정은 이미 만들어졌으니 이메일·비밀번호는 더 바꿀 수 없게 잠가요
        emailInput.disabled = true;
        passwordInput.disabled = true;
      }
      setStatus(status, '닉네임을 저장하는 중...');
      await saveDisplayName(displayName);
      location.hash = '#/';
    } catch (error) {
      if (accountCreated) {
        // ①은 됐고 ②만 실패: 로그인은 된 상태예요. 닉네임만 고쳐서 다시 저장하게 해요
        setStatus(
          status,
          `가입은 됐지만 닉네임을 저장하지 못했어요. ${errorMessage(error)} 닉네임을 확인하고 다시 눌러 주세요.`,
          true,
        );
        submitButton.textContent = '닉네임 다시 저장';
      } else {
        setStatus(status, registerErrorMessage(error), true);
      }
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
