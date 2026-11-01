// ==========================================================
// contact.js - 문의 폼 검증
// 보내기를 누르면 각 칸을 검사해서, 틀린 칸 아래에 안내 문장을 보여 줘요.
// ==========================================================

const form = document.querySelector('#contact-form');
const statusElement = document.querySelector('#form-status');

// 검사할 칸의 id 목록 (화면에 보이는 순서대로)
const fieldIds = ['name', 'email', 'nickname', 'message'];

// 칸마다 검사 규칙을 정해 둬요. 입력칸을 받아서, 문제가 있으면 안내 문장을, 괜찮으면 ''(빈 글자)를 돌려줘요 (Day 24)
const validators = {
  name: (input) => {
    const value = input.value.trim();
    if (value === '') {
      return '이름을 입력해 주세요.';
    }
    if (value.length < 2) {
      return '이름은 2글자 이상으로 적어 주세요.';
    }
    return '';
  },

  email: (input) => {
    const value = input.value.trim();
    if (value === '') {
      return '이메일을 입력해 주세요.';
    }
    // 정규식: 글자@글자.글자 모양인지 확인해요
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      return '이메일 형식을 확인해 주세요. 예: name@example.com';
    }
    return '';
  },

  // 닉네임은 선택 입력이에요. 적었을 때만 HTML의 pattern 속성(한글·영문·숫자·_ 2~20글자)에 맞는지 검사해요
  nickname: (input) => {
    if (input.value === '') {
      return ''; // 비워 둬도 괜찮아요
    }
    if (input.validity.patternMismatch) {
      // validity.patternMismatch: 입력한 글자가 pattern 속성과 다르면 true
      return '닉네임은 한글·영문·숫자·밑줄(_)로 공백 없이 2~20글자로 적어 주세요.';
    }
    return '';
  },

  message: (input) => {
    const value = input.value.trim();
    if (value === '') {
      return '문의 내용을 입력해 주세요.';
    }
    if (value.length < 10) {
      return '내용은 10글자 이상으로 적어 주세요.';
    }
    return '';
  },
};

// 입력칸 아래에 오류 문장을 보여 주거나(문장이 있을 때) 지워요(빈 글자일 때)
function showFieldError(input, message) {
  const errorElement = document.querySelector(`#${input.id}-error`);
  errorElement.textContent = message;

  if (message === '') {
    input.removeAttribute('aria-invalid');
  } else {
    input.setAttribute('aria-invalid', 'true'); // 스크린 리더에게 "이 칸에 문제가 있어요"라고 알려 줘요
  }
}

// 칸 하나를 검사하고 결과(true/false)를 돌려줘요
function validateField(input) {
  const message = validators[input.id](input);
  showFieldError(input, message);
  return message === '';
}

// 맨 아래 상태 메시지: role="status"는 "바뀌면 스크린 리더가 읽어 주는 영역"이에요
function showStatus(message, type) {
  // 같은 문장이면 다시 쓰지 않아요 (스크린 리더가 같은 말을 또 읽지 않게요)
  if (statusElement.textContent !== message) {
    statusElement.textContent = message;
  }
  statusElement.className = `form-status is-${type}`; // is-error 또는 is-success
}

function clearStatus() {
  statusElement.textContent = '';
  statusElement.className = 'form-status';
}

function makeErrorSummary(count) {
  return `입력 내용을 확인해 주세요. 고칠 곳이 ${count}군데 있어요.`;
}

// 오류 안내가 떠 있을 때, 남은 오류 개수에 맞게 맨 아래 메시지를 고치거나 지워요
function updateErrorSummary() {
  if (!statusElement.classList.contains('is-error')) {
    return;
  }
  const count = form.querySelectorAll('[aria-invalid="true"]').length;
  if (count === 0) {
    clearStatus(); // 다 고쳤으면 안내를 지워요
  } else {
    showStatus(makeErrorSummary(count), 'error');
  }
}

// 보내기 버튼을 눌렀을 때
form.addEventListener('submit', (event) => {
  event.preventDefault(); // 페이지가 새로고침되는 기본 동작을 막아요

  const invalidInputs = []; // 검사에 실패한 칸들
  for (const id of fieldIds) {
    const input = document.querySelector(`#${id}`);
    if (!validateField(input)) {
      invalidInputs.push(input);
    }
  }

  if (invalidInputs.length > 0) {
    showStatus(makeErrorSummary(invalidInputs.length), 'error');
    invalidInputs[0].focus(); // 첫 번째 오류 칸으로 커서를 옮겨요
    return;
  }

  // 모두 통과! (진짜 서버는 없어서 실제로 보내지는 않아요)
  showStatus('문의가 접수됐어요. 감사합니다! (연습용 사이트라 실제로 전송되지는 않아요.)', 'success');
  form.reset();
});

// 오류가 났던 칸은 고치는 동안 바로 다시 검사해서 오류를 지워 줘요 (이벤트 위임)
form.addEventListener('input', (event) => {
  const input = event.target;
  if (input.getAttribute('aria-invalid') === 'true') {
    validateField(input);
    updateErrorSummary();
  }
});
