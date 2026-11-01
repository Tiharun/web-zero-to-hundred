// P3 레퍼런스(시청자 참여 아레나) e2e 테스트
//
// 준비(한 번, reference/p3-viewer-arena 폴더에서):
//   cargo build -p server --release
//   cd client && npm ci && npm run wasm && npm run build
// 실행(저장소 루트): node --test tests/reference/p3.e2e.test.mjs
//
// 빌드된 서버를 빈 포트에 띄우고(DB 없이), Chromium으로 관전 화면 1개 + 휴대폰 화면 2개를 열어
// 실제로 참가·조작해 본다. 서버는 PID로 띄우고 PID로 끈다.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import net from 'node:net';
import { fileURLToPath } from 'node:url';

import { launch, collectConsoleErrors } from '../helpers/browser.mjs';

const ROOT = fileURLToPath(new URL('../../reference/p3-viewer-arena/', import.meta.url));
const DIST = `${ROOT}client/dist`;
const EXE = process.platform === 'win32' ? 'server.exe' : 'server';
const BINARY = ['release', 'debug'].map((profile) => `${ROOT}target/${profile}/${EXE}`).find((p) => existsSync(p));

let server;
let serverLog = '';
let port;
let baseUrl;
let browser;

// ---------- 도우미 ----------

// 운영체제에게 빈 포트를 받아 온다(0번 포트로 열었다가 바로 닫는다).
function freePort() {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.once('error', reject);
    probe.listen(0, '127.0.0.1', () => {
      const { port: free } = probe.address();
      probe.close(() => resolve(free));
    });
  });
}

async function waitForHealth(timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) break;
    try {
      const response = await fetch(`${baseUrl}healthz`);
      if (response.ok) return;
    } catch {
      // 아직 안 떴다
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`서버가 뜨지 않았어요.\n${serverLog}`);
}

async function createRoom() {
  const response = await fetch(`${baseUrl}api/rooms`, { method: 'POST' });
  assert.equal(response.status, 201);
  const { code } = await response.json();
  assert.match(code, /^[A-Z]{4}$/);
  return code;
}

// 테스트도 관전자(role=host)로 붙어서, 조건에 맞는 스냅샷 하나를 받아 온다.
function waitForSnapshot(code, wanted, timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(`ws://127.0.0.1:${port}/ws/${code}?role=host`);
    const timer = setTimeout(() => {
      socket.close();
      reject(new Error('조건에 맞는 스냅샷이 오지 않았어요'));
    }, timeoutMs);
    socket.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.t === 'snapshot' && wanted(msg)) {
        clearTimeout(timer);
        socket.close();
        resolve(msg);
      }
    });
    socket.addEventListener('error', () => reject(new Error('WebSocket 오류')));
  });
}

const byName = (snapshot, name) => snapshot.players.find((p) => p.name === name);

async function openPhone(t, code, name) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  t.after(() => context.close());
  const page = await context.newPage();
  const errors = collectConsoleErrors(page);
  await page.goto(`${baseUrl}play.html?room=${code}`);
  await page.fill('#name', name);
  await page.click('#join');
  return { page, errors };
}

// ---------- 준비·정리 ----------

before(async () => {
  assert.ok(BINARY, `서버 실행 파일이 없어요. ${ROOT}에서 cargo build -p server --release`);
  assert.ok(existsSync(`${DIST}/host.html`), `client/dist가 없어요. ${ROOT}client에서 npm ci && npm run wasm && npm run build`);

  port = await freePort();
  baseUrl = `http://127.0.0.1:${port}/`;
  // DATABASE_URL을 빈 값으로 둔다 → 랭킹 꺼짐(.env 파일이 있어도 덮어쓰지 않는다)
  const env = { ...process.env, HOST: '127.0.0.1', PORT: String(port), STATIC_DIR: DIST, DATABASE_URL: '', RUST_LOG: 'info' };
  server = spawn(BINARY, [], { cwd: ROOT, env, stdio: ['ignore', 'pipe', 'pipe'] });
  server.stdout.on('data', (chunk) => (serverLog += chunk));
  server.stderr.on('data', (chunk) => (serverLog += chunk));
  await waitForHealth();

  browser = await launch();
});

after(async () => {
  await browser?.close();
  if (server && server.exitCode === null) {
    const exited = new Promise((resolve) => server.once('exit', resolve));
    process.kill(server.pid, 'SIGTERM'); // 우리가 띄운 PID만 끈다
    const timer = setTimeout(() => process.kill(server.pid, 'SIGKILL'), 5000);
    await exited;
    clearTimeout(timer);
  }
});

// ---------- 테스트 ----------

test('two phones join, move, and appear on the transparent host canvas', { timeout: 60000 }, async (t) => {
  const code = await createRoom();

  const hostContext = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  t.after(() => hostContext.close());
  const host = await hostContext.newPage();
  const hostErrors = collectConsoleErrors(host);
  await host.goto(`${baseUrl}host.html?room=${code}`);
  await host.waitForFunction(() => document.querySelector('#count')?.textContent === '참가 0명');

  // OBS 브라우저 소스용: 배경이 투명하고, 참가 QR과 주소가 보인다
  const backgrounds = await host.evaluate(() => [
    getComputedStyle(document.documentElement).backgroundColor,
    getComputedStyle(document.body).backgroundColor,
  ]);
  assert.deepEqual(backgrounds, ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)']);
  assert.equal(await host.textContent('#join-url'), `${baseUrl}play.html?room=${code}`);
  assert.ok((await host.$eval('#qr', (canvas) => canvas.width)) >= 100, 'QR 캔버스가 그려져야 해요');
  assert.equal(await host.getAttribute('#arena', 'data-players'), '0');

  const phoneA = await openPhone(t, code, '철수');
  const phoneB = await openPhone(t, code, '영희');
  for (const phone of [phoneA, phoneB]) {
    await phone.page.waitForSelector('body[data-state="joined"]');
    assert.equal(await phone.page.isVisible('#join-form'), false, '참가하면 닉네임 폼이 사라져요');
    assert.equal(await phone.page.isVisible('#stick'), true, '조이스틱이 보여요');
  }

  // 관전 화면 캔버스에 2명
  await host.waitForFunction(() => document.querySelector('#arena')?.dataset.players === '2');
  await host.waitForFunction(() => document.querySelector('#count')?.textContent === '참가 2명');

  // 조작: 철수는 키보드로, 영희는 조이스틱(포인터 끌기)으로 아레나 가운데 쪽으로 움직인다
  const start = await waitForSnapshot(code, (s) => s.players.length === 2);
  const a0 = byName(start, '철수');
  const b0 = byName(start, '영희');
  const key = a0.x > 0 ? 'ArrowLeft' : 'ArrowRight';
  const dragUp = b0.y > 0;

  const stick = await phoneB.page.locator('#stick').boundingBox();
  const cx = stick.x + stick.width / 2;
  const cy = stick.y + stick.height / 2;
  await phoneB.page.mouse.move(cx, cy);
  await phoneB.page.mouse.down();
  await phoneB.page.mouse.move(cx, dragUp ? cy - stick.height / 2 : cy + stick.height / 2, { steps: 5 });
  await phoneA.page.keyboard.down(key);
  await new Promise((resolve) => setTimeout(resolve, 700));
  await phoneA.page.keyboard.up(key);
  await phoneB.page.mouse.up();

  const moved = await waitForSnapshot(
    code,
    (s) => {
      const a = byName(s, '철수');
      const b = byName(s, '영희');
      const dx = a.x - a0.x;
      const dy = b.y - b0.y;
      return (key === 'ArrowRight' ? dx : -dx) > 40 && (dragUp ? -dy : dy) > 40;
    },
    3000,
  );
  assert.equal(moved.players.length, 2);

  assert.deepEqual(hostErrors, []);
  assert.deepEqual(phoneA.errors, []);
  assert.deepEqual(phoneB.errors, []);
});

test('home page creates a room and links to the host and play pages', async (t) => {
  const context = await browser.newContext();
  t.after(() => context.close());
  const page = await context.newPage();
  const errors = collectConsoleErrors(page);

  await page.goto(baseUrl);
  await page.click('#create');
  await page.waitForSelector('#created:not([hidden])');
  const code = await page.textContent('#room-code');
  assert.match(code, /^[A-Z]{4}$/);
  assert.equal(await page.getAttribute('#host-link', 'href'), `${baseUrl}host.html?room=${code}`);
  assert.equal(await page.getAttribute('#play-link', 'href'), `${baseUrl}play.html?room=${code}`);
  assert.equal(await page.isVisible('#lan-tip'), true, '127.0.0.1로 열면 LAN 안내가 보여요');

  // 소문자로 넣어도 참가 화면으로 간다
  await page.fill('#code', code.toLowerCase());
  await page.click('#join-form button');
  await page.waitForURL(`${baseUrl}play.html?room=${code}`);
  assert.equal(await page.textContent('#room-label'), `방 ${code}`);

  const info = await (await fetch(`${baseUrl}api/rooms/${code}`)).json();
  assert.deepEqual(info, { code, players: 0, phase: 'waiting' });
  assert.deepEqual(errors, []);
});

test('a banned nickname is rejected and the player can try again', async (t) => {
  const code = await createRoom();
  const phone = await openPhone(t, code, 'admin');
  await phone.page.waitForFunction(() => document.querySelector('#status')?.textContent === '쓸 수 없는 닉네임이에요.');
  await phone.page.waitForSelector('#join:not([disabled])');

  await phone.page.fill('#name', '착한닉네임');
  await phone.page.click('#join');
  await phone.page.waitForSelector('body[data-state="joined"]');
  assert.deepEqual(phone.errors, []);
});
