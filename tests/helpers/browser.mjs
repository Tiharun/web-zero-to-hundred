// 테스트용 브라우저 도우미: 전역 설치된 Playwright의 Chromium을 연다.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// --enable-unsafe-swiftshader: GPU 없는 헤드리스(CI)에서도 WebGL(소프트웨어 렌더)을 켠다. 이 저장소의 로컬 페이지만 연다(external-facts.md 14.2)
export async function launch({ args = ['--enable-unsafe-swiftshader'] } = {}) {
  const { chromium } = require('playwright');
  return chromium.launch({ args });
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
