// 테스트용 브라우저 도우미: 전역 설치된 Playwright의 Chromium을 연다.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export async function launch() {
  const { chromium } = require('playwright');
  return chromium.launch();
}

// 페이지에서 난 콘솔 오류와 처리되지 않은 예외를 모아 둔 "살아 있는" 배열을 돌려준다.
// 테스트 끝에서 assert.deepEqual(errors, []) 로 확인한다.
export function collectConsoleErrors(page) {
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => {
    errors.push(error.message);
  });
  return errors;
}
