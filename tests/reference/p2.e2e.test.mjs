// P2 레퍼런스(스트리머 허브) e2e: 빌드한 클라이언트 + 실제 C# 서버 + Chromium
// 실행: node --test tests/reference/p2.e2e.test.mjs
// 필요: .NET 10 SDK(dotnet), Node 22+, 전역 설치된 Playwright
//
// 순서(Day 38의 "단일 앱" 배포와 같아요):
//   1) client에서 npm run build → client/dist (.gitignore 대상)
//   2) dotnet publish → 임시 폴더, 그 안의 wwwroot로 dist를 복사 (저장소 안에는 빌드 결과를 만들지 않아요)
//   3) 임시 SQLite 파일 + 환경 변수 관리자(Admin__Email/Admin__Password)로 서버를 빈 포트에 띄워요
//   4) 브라우저로 사용자 흐름을 확인하고, 끝나면 띄운 서버만 PID로 꺼요
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn, execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { launch, collectConsoleErrors } from '../helpers/browser.mjs';

const ROOT = fileURLToPath(new URL('../../reference/p2-streamer-hub/', import.meta.url));
const CLIENT_DIR = path.join(ROOT, 'client');
const API_PROJECT = path.join(ROOT, 'server', 'StreamerHub.Api', 'StreamerHub.Api.csproj');

// 임시 DB에만 쓰는 테스트 전용 계정
const ADMIN_EMAIL = 'admin@e2e.test';
const ADMIN_PASSWORD = 'E2e-Admin-Passw0rd!';
const FAN_EMAIL = 'fan@e2e.test';
const FAN_PASSWORD = 'E2e-Fan-Passw0rd!';
const FAN_NAME = '이투이팬';

let tempDir;
let server;
let browser;

before(async () => {
  tempDir = mkdtempSync(path.join(os.tmpdir(), 'p2-e2e-'));
  const publishDir = path.join(tempDir, 'publish');

  if (!existsSync(path.join(CLIENT_DIR, 'node_modules'))) {
    run('npm', ['ci'], CLIENT_DIR);
  }
  run('npm', ['run', 'build'], CLIENT_DIR); // tsc(타입 검사) + vite build
  run('dotnet', ['publish', API_PROJECT, '-c', 'Release', '-o', publishDir], ROOT);
  cpSync(path.join(CLIENT_DIR, 'dist'), path.join(publishDir, 'wwwroot'), { recursive: true });

  server = await startServer(publishDir, path.join(tempDir, 'e2e.db'));
  browser = await launch();
});

after(async () => {
  await browser?.close();
  if (server) await stopServer(server.child);
  if (tempDir) rmSync(tempDir, { recursive: true, force: true });
});

// ---------- 도우미 ----------

function run(command, args, cwd) {
  try {
    execFileSync(command, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' });
  } catch (error) {
    throw new Error(`${command} ${args.join(' ')} 실패\n${error.stdout ?? ''}\n${error.stderr ?? ''}`);
  }
}

// 포트 0 = 운영체제가 빈 포트를 골라요. 실제 주소는 서버 로그의 "Now listening on:"에서 읽어요
function startServer(publishDir, dbPath) {
  return new Promise((resolve, reject) => {
    const child = spawn('dotnet', ['StreamerHub.Api.dll', '--urls', 'http://127.0.0.1:0'], {
      cwd: publishDir, // 콘텐츠 루트: 여기의 appsettings.json과 wwwroot를 써요
      env: {
        ...process.env,
        ASPNETCORE_ENVIRONMENT: 'Production',
        ConnectionStrings__Default: `Data Source=${dbPath}`,
        Admin__Email: ADMIN_EMAIL,
        Admin__Password: ADMIN_PASSWORD,
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let output = '';
    let started = false;
    const timer = setTimeout(() => {
      process.kill(child.pid, 'SIGKILL');
      reject(new Error(`서버가 30초 안에 켜지지 않았어요.\n${output}`));
    }, 30_000);

    const onData = (chunk) => {
      output += chunk;
      const match = output.match(/Now listening on: (http:\/\/127\.0\.0\.1:\d+)/);
      if (match && !started) {
        started = true;
        clearTimeout(timer);
        resolve({ child, url: `${match[1]}/`, log: () => output });
      }
    };
    child.stdout.on('data', onData);
    child.stderr.on('data', onData);
    child.on('exit', (code) => {
      if (!started) {
        clearTimeout(timer);
        reject(new Error(`서버가 켜지기 전에 끝났어요(code ${code}).\n${output}`));
      }
    });
  });
}

// 우리가 띄운 서버만 PID로 꺼요. 10초 안에 안 꺼지면 강제로 꺼요
async function stopServer(child) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  const exited = new Promise((resolve) => child.once('exit', resolve));
  process.kill(child.pid, 'SIGTERM');
  const forceTimer = setTimeout(() => process.kill(child.pid, 'SIGKILL'), 10_000);
  await exited;
  clearTimeout(forceTimer);
}

// 테스트마다 새 브라우저 컨텍스트(쿠키가 섞이지 않는 새 창)
async function openPage(t, options = {}) {
  const context = await browser.newContext({ locale: 'ko-KR', timezoneId: 'Asia/Seoul', ...options });
  t.after(() => context.close());
  const page = await context.newPage();
  const errors = collectConsoleErrors(page);
  return { page, errors };
}

async function login(page, email, password, displayName) {
  await page.goto(`${server.url}#/login`);
  await page.fill('#login-email', email);
  await page.fill('#login-password', password);
  await page.click('#login-form button[type="submit"]');
  await page.locator('#auth-menu .user-name', { hasText: `${displayName}님` }).waitFor();
}

// ---------- 테스트 ----------

test('server serves the built client and the overlay page', async () => {
  for (const pagePath of ['', 'overlay.html', 'favicon.svg']) {
    const response = await fetch(server.url + pagePath);
    assert.equal(response.status, 200, `${pagePath || '/'} 응답 코드`);
  }
  const unknownApi = await fetch(`${server.url}api/nothing-here`);
  assert.equal(unknownApi.status, 404);
  assert.equal(unknownApi.headers.get('content-type'), 'application/problem+json');
});

test('fan: register → login → write a post → it shows in the board list', async (t) => {
  const { page, errors } = await openPage(t);

  // 1) 가입하면 바로 로그인 상태가 되고, 위쪽 메뉴에 닉네임이 보여요
  await page.goto(`${server.url}#/register`);
  await page.fill('#register-email', FAN_EMAIL);
  await page.fill('#register-name', FAN_NAME);
  await page.fill('#register-password', FAN_PASSWORD);
  await page.click('#register-form button[type="submit"]');
  await page.locator('#auth-menu .user-name', { hasText: `${FAN_NAME}님` }).waitFor();

  // 2) 로그아웃했다가 다시 로그인
  await page.click('#auth-menu button');
  await page.locator('#auth-menu a[href="#/login"]').waitFor();
  await login(page, FAN_EMAIL, FAN_PASSWORD, FAN_NAME);

  // 3) 게시판 → 글쓰기. 제목에 HTML을 넣어도 글자로만 보여야 해요(XSS 방지)
  const title = '첫 글이에요 <b>굵게?</b>';
  await page.click('.nav-links a[href="#/board"]');
  await page.click('#write-link');
  await page.fill('#post-title', title);
  await page.fill('#post-body', '스트리머 허브 반가워요!\n두 번째 줄');
  await page.click('#post-form button[type="submit"]');
  await page.locator('#post-title', { hasText: title }).waitFor();
  assert.ok((await page.locator('#post-meta').textContent()).startsWith(FAN_NAME), '글쓴이는 내 닉네임');
  assert.equal(await page.locator('#post-actions').isVisible(), true, '내 글에는 수정·삭제 버튼이 보여요');

  // 4) 목록에 보여요
  await page.click('a[href="#/board"]');
  await page.locator('#post-list a', { hasText: title }).waitFor();
  assert.equal(await page.locator('#post-list b').count(), 0, '제목의 <b>가 태그로 해석되면 안 돼요');

  assert.deepEqual(errors, []);
});

test('admin: login → create a streamer → it shows in the streamer list', async (t) => {
  const { page, errors } = await openPage(t);

  await login(page, ADMIN_EMAIL, ADMIN_PASSWORD, '관리자');
  await page.locator('#admin-link').waitFor(); // 관리자에게만 보이는 메뉴

  await page.click('#admin-link a');
  await page.fill('#streamer-name', '이투이곰');
  await page.selectOption('#streamer-platform', 'youtube');
  await page.fill('#streamer-channel', 'https://example.com/e2e-bear');
  await page.fill('#streamer-bio', 'e2e 테스트로 등록한 스트리머예요.');
  await page.click('#streamer-form button[type="submit"]');
  await page.locator('#streamer-form .status', { hasText: '등록했어요' }).waitFor();
  await page.locator('#streamer-admin-list li', { hasText: '이투이곰' }).waitFor();

  await page.click('.nav-links a[href="#/streamers"]');
  const card = page.locator('#streamer-list .card', { hasText: '이투이곰' });
  await card.waitFor();
  assert.match(await card.textContent(), /YouTube/);

  assert.deepEqual(errors, []);
});

test('notice posted by admin appears on overlay.html within 3 seconds', async (t) => {
  const { page: admin, errors: adminErrors } = await openPage(t);
  const { page: overlay, errors: overlayErrors } = await openPage(t); // OBS처럼 로그인하지 않은 창

  await login(admin, ADMIN_EMAIL, ADMIN_PASSWORD, '관리자');
  await admin.goto(`${server.url}#/admin`);

  async function postNotice(message) {
    await admin.fill('#notice-message', message);
    await admin.click('#notice-form button[type="submit"]');
  }

  // 첫 공지 → 오버레이를 열면 연결되자마자 지금 공지를 받아요
  await postNotice('첫 번째 공지');
  await admin.locator('#current-notice', { hasText: '첫 번째 공지' }).waitFor();
  await overlay.goto(`${server.url}overlay.html`);
  await overlay.locator('#notice', { hasText: '첫 번째 공지' }).waitFor();

  // 연결된 채로 새 공지를 올리면 3초 안에 바뀌어야 해요(SSE)
  const message = '10분 뒤 방송 시작해요!';
  const startedAt = Date.now();
  await postNotice(message);
  await overlay.locator('#notice', { hasText: message }).waitFor({ timeout: 3000 });
  assert.ok(Date.now() - startedAt < 3000);

  assert.deepEqual(adminErrors, []);
  assert.deepEqual(overlayErrors, []);
});

test('times are shown in Korean time even when the browser is in another time zone', async (t) => {
  // 브라우저를 미국 시간대로 두어도 화면은 한국 시간이어야 해요 (Day 29)
  const { page, errors } = await openPage(t, { timezoneId: 'America/Los_Angeles' });

  // 예시 데이터: 달빛곰 "저녁 게임 방송"은 UTC 11:00 = 한국 20:00
  await page.goto(`${server.url}#/streamers?q=${encodeURIComponent('달빛곰')}`);
  await page.click('#streamer-list a');
  const item = page.locator('#schedule-list li', { hasText: '저녁 게임 방송' });
  await item.waitFor();
  assert.match(await item.textContent(), /오후 8:00/);

  // 주간 일정은 월~일 7칸
  await page.click('.nav-links a[href="#/schedule"]');
  await page.locator('#week .day').first().waitFor();
  assert.equal(await page.locator('#week .day').count(), 7);

  assert.deepEqual(errors, []);
});
