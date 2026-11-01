// ==========================================================
// contact.js - 문의 폼 검증
// 보내기를 누르면 각 칸을 검사해서, 틀린 칸 아래에 안내 문장을 보여 줘요.
// ==========================================================

const form = document.querySelector('#contact-form');
const statusElement = document.querySelector('#form-status');

// 검사할 칸의 id 목록
const fieldIds = ['name', 'email', 'message'];

// 칸마다 검사 규칙을 정해 둬요. 문제가 있으면 안내 문장을, 괜찮으면 ''(빈 글자)를 돌려줘요 (Day 24)
const validators = {
  name: function (value) {
    if (value.trim() === '') {
      return '이름을 입력해 주세요.';
    }
    if (value.trim().length < 2) {
      return '이름은 2글자 이상으로 적어 주세요.';
    }
    return '';
  },

  email: function (value) {
    if (value.trim() === '') {
      return '이메일을 입력해 주세요.';
    }
    // 정규식: 글자@글자.글자 모양인지 확인해요
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value.trim())) {
      return '이메일 형식을 확인해 주세요. 예: name@example.com';
    }
    return '';
  },

  message: function (value) {
    if (value.trim() === '') {
      return '문의 내용을 입력해 주세요.';
    }
    if (value.trim().length < 10) {
      return '내용은 10글자 이상으로 적어 주세요.';
    }
    return '';
  },
};

// 입력칸 아래에 오류 문장을 보여 주거나(문장이 있을 때) 지워요(빈 글자일 때)
function showFieldError(input, message) {
  const errorElement = document.querySelector('#' + input.id + '-error');
  errorElement.textContent = message;

  if (message === '') {
    input.removeAttribute('aria-invalid');
  } else {
    input.setAttribute('aria-invalid', 'true'); // 스크린 리더에게 "이 칸에 문제가 있어요"라고 알려 줘요
  }
}

// 칸 하나를 검사하고 결과(true/false)를 돌려줘요
function validateField(input) {
  const message = validators[input.id](input.value);
  showFieldError(input, message);
  return message === '';
}

// 맨 아래 상태 메시지 (aria-live 영역이라 바뀌면 스크린 리더가 읽어 줘요)
function showStatus(message, type) {
  statusElement.textContent = message;
  statusElement.className = 'form-status is-' + type; // is-error 또는 is-success
}

// 보내기 버튼을 눌렀을 때
form.addEventListener('submit', function (event) {
  event.preventDefault(); // 페이지가 새로고침되는 기본 동작을 막아요

  let firstInvalidInput = null;
  let invalidCount = 0;

  for (const id of fieldIds) {
    const input = document.querySelector('#' + id);
    if (!validateField(input)) {
      invalidCount = invalidCount + 1;
      if (firstInvalidInput === null) {
        firstInvalidInput = input;
      }
    }
  }

  if (firstInvalidInput !== null) {
    showStatus('입력 내용을 확인해 주세요. 고칠 곳이 ' + invalidCount + '군데 있어요.', 'error');
    firstInvalidInput.focus(); // 첫 번째 오류 칸으로 커서를 옮겨요
    return;
  }

  // 모두 통과! (진짜 서버는 없어서 실제로 보내지는 않아요)
  showStatus('문의가 접수됐어요. 감사합니다! (연습용 사이트라 실제로 전송되지는 않아요.)', 'success');
  form.reset();
});

// 오류가 났던 칸은 고치는 동안 바로 다시 검사해서 오류를 지워 줘요 (이벤트 위임)
form.addEventListener('input', function (event) {
  const input = event.target;
  if (input.getAttribute('aria-invalid') === 'true') {
    validateField(input);
  }
});
