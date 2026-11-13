// SP 레퍼런스(이미지 후원 서비스) e2e 테스트
// 실행: node --test tests/reference/sp.e2e.test.mjs
// 준비물: .NET 10 SDK, Node, psql, PostgreSQL(TEST_DATABASE_URL, 기본 image_donation_test)
//
// 흐름: React 빌드 → API 빌드 → 빈 포트로 API 실행(빌드된 React를 API가 함께 제공) → 개발 로그인 → 온보딩
//      → 치즈 모드 설정 → 후원 페이지에서 이미지 업로드 → 코드 표시 → 대시보드에서 테스트 후원(코드 포함)
//      → 대기열에 나타남 → 승인 → overlay.html?token= 에 이미지 표시 → 긴급 정지 → 사라짐 → 콘솔 오류 0
// 테스트 전용 스키마를 만들어 쓰고, 끝나면 스키마와 임시 폴더를 지우고 API는 PID로 끈다.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

import { launch, collectConsoleErrors } from '../helpers/browser.mjs';
import { freePort } from '../helpers/static-server.mjs'; // 브라우저가 거절하는 포트(예: 4045)는 건너뛴다

const ROOT = fileURLToPath(new URL('../../reference/sp-image-donation/', import.meta.url));
const CLIENT = path.join(ROOT, 'client');
const API = path.join(ROOT, 'server', 'ImageDonation.Api');
const DB_URL =
  process.env.TEST_DATABASE_URL ?? 'Host=127.0.0.1;Port=5432;Database=image_donation_test;Username=wzh;Password=wzh';
const SCHEMA = `e2e_${process.pid}_${Date.now().toString(36)}`;

let apiProcess;
let apiLog = '';
let baseUrl;
let browser;
let tempDir;

// ---------- 도우미 ----------

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', shell: process.platform === 'win32' });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} 실패\n${result.stdout}\n${result.stderr}`);
  }
}

// "Host=...;Port=...;Database=...;Username=...;Password=..." → psql 환경 변수
function psqlEnv() {
  const parts = Object.fromEntries(
    DB_URL.split(';').filter(Boolean).map((pair) => {
      const [key, ...rest] = pair.split('=');
      return [key.trim().toLowerCase(), rest.join('=').trim()];
    }),
  );
  return {
    ...process.env,
    PGHOST: parts.host ?? '127.0.0.1',
    PGPORT: parts.port ?? '5432',
    PGDATABASE: parts.database,
    PGUSER: parts.username ?? parts['user id'],
    PGPASSWORD: parts.password,
  };
}

function psql(sql) {
  const result = spawnSync('psql', ['-v', 'ON_ERROR_STOP=1', '-qAtc', sql], { env: psqlEnv(), encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`psql 실패: ${result.stderr}`);
}

async function waitForHealthy(url, timeoutMs = 90_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (apiProcess.exitCode !== null) throw new Error(`API가 바로 종료됐어요.\n${apiLog}`);
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // 아직 시작 중
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(`API가 ${timeoutMs}ms 안에 준비되지 않았어요.\n${apiLog}`);
}

// 테스트 이미지는 파일로 두지 않고 코드로 만든다: 단색 PNG
function makePng(width, height, [r, g, b]) {
  const rowLength = width * 3 + 1;
  const raw = Buffer.alloc(rowLength * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      raw.set([r, g, b], y * rowLength + 1 + x * 3); // 각 줄 맨 앞 1바이트는 필터 종류(0)
    }
  }
  const chunk = (type, data) => {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(zlib.crc32(body));
    return Buffer.concat([length, body, crc]);
  };
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8; // 비트 깊이
  header[9] = 2; // 색 형식: RGB
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', zlib.deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---------- 준비·정리 ----------

before(async () => {
  // 1) React 빌드 → server/ImageDonation.Api/wwwroot, 2) API 빌드
  if (!existsSync(path.join(CLIENT, 'node_modules'))) run('npm', ['ci', '--no-audit', '--no-fund'], CLIENT);
  run('npm', ['run', 'build'], CLIENT);
  run('dotnet', ['build', '--nologo', '-v', 'q'], API);

  // 3) 테스트 전용 스키마와 임시 폴더(이미지·암호화 키)
  psql(`CREATE SCHEMA "${SCHEMA}"`);
  tempDir = mkdtempSync(path.join(tmpdir(), 'sp-e2e-'));

  // 4) 빈 포트로 API 실행 (dotnet run 대신 빌드된 dll을 직접 실행 → PID가 곧 서버 프로세스)
  const port = await freePort();
  baseUrl = `http://127.0.0.1:${port}`;
  apiProcess = spawn('dotnet', [path.join('bin', 'Debug', 'net10.0', 'ImageDonation.Api.dll'), '--urls', baseUrl], {
    cwd: API, // 콘텐츠 루트 = 프로젝트 폴더 → wwwroot를 찾는다
    env: {
      ...process.env,
      ASPNETCORE_ENVIRONMENT: 'Production',
      ConnectionStrings__Default: `${DB_URL};Search Path=${SCHEMA}`,
      Security__IpHashKey: 'e2e-only-ip-hash-key',
      Storage__MediaPath: path.join(tempDir, 'media'),
      DataProtection__KeysPath: path.join(tempDir, 'keys'),
      RateLimit__DonationsPerMinute: '100',
      Retention__IntervalSeconds: '3600',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  apiProcess.stdout.on('data', (d) => (apiLog += d));
  apiProcess.stderr.on('data', (d) => (apiLog += d));
  await waitForHealthy(`${baseUrl}/healthz`);

  browser = await launch();
});

after(async () => {
  await browser?.close();
  if (apiProcess && apiProcess.exitCode === null) {
    const exited = new Promise((resolve) => apiProcess.once('exit', resolve));
    process.kill(apiProcess.pid, 'SIGTERM'); // 우리가 띄운 프로세스만 PID로 끈다
    const timer = setTimeout(() => apiProcess.exitCode === null && process.kill(apiProcess.pid, 'SIGKILL'), 10_000);
    await exited;
    clearTimeout(timer);
  }
  try {
    psql(`DROP SCHEMA IF EXISTS "${SCHEMA}" CASCADE`);
  } finally {
    if (tempDir) rmSync(tempDir, { recursive: true, force: true });
  }
});

// ---------- 시나리오 ----------

test('스트리머 온보딩 → 치즈 모드 → 이미지 후원 → 테스트 후원 매칭 → 승인 → 오버레이 → 긴급 정지', { timeout: 180_000 }, async () => {
  const streamerContext = await browser.newContext({ locale: 'ko-KR' });
  const viewerContext = await browser.newContext({ locale: 'ko-KR' }); // 로그인 쿠키 없는 시청자
  const overlayContext = await browser.newContext({ viewport: { width: 1920, height: 1080 } }); // OBS 역할
  try {
    const streamer = await streamerContext.newPage();
    const viewer = await viewerContext.newPage();
    const overlay = await overlayContext.newPage();
    const errors = { streamer: collectConsoleErrors(streamer), viewer: collectConsoleErrors(viewer), overlay: collectConsoleErrors(overlay) };
    const menu = (name) => streamer.locator('.topbar').getByRole('link', { name }); // 위쪽 메뉴의 링크

    // 1) 개발용 로컬 계정으로 가입·로그인 → 온보딩으로 이동
    await streamer.goto(`${baseUrl}/login`);
    await streamer.getByLabel('이메일').fill('e2e@test.local');
    await streamer.getByLabel('비밀번호').fill('E2e-Passw0rd!');
    await streamer.getByRole('button', { name: /처음이에요/ }).click();
    await streamer.waitForURL('**/onboarding');

    // 2) 후원 페이지 만들기 → 시작 가이드
    await streamer.getByLabel('후원 페이지 주소').fill('e2e-streamer');
    await streamer.getByLabel('방송 이름').fill('E2E 방송');
    await streamer.getByRole('button', { name: '만들기' }).click();
    await streamer.getByRole('heading', { name: '시작 가이드' }).waitFor();

    // 3) 설정: 치즈 모드, 최소 1000치즈, 표시 30초(확인할 시간을 넉넉히)
    await menu('설정').click();
    await streamer.getByLabel(/치즈 후원 연동/).check();
    await streamer.getByLabel('최소 치즈').fill('1000');
    await streamer.getByLabel(/표시 시간/).fill('30');
    await streamer.getByRole('button', { name: '저장' }).click();
    await streamer.getByText('저장했어요.').waitFor();
    const overlayUrl = await streamer.getByLabel(/OBS 오버레이 주소/).inputValue();
    assert.match(overlayUrl, /\/overlay\.html\?token=[A-Za-z0-9_-]{43}$/); // 256비트 토큰

    // 4) OBS 오버레이를 먼저 열어 둔다 (승인된 이미지는 그때 연결된 오버레이로 간다)
    await overlay.goto(overlayUrl);
    await overlay.locator('.overlay[data-status="connected"]').waitFor();

    // 5) 대시보드를 연다 (실시간 연결)
    await menu('대시보드').click();
    await streamer.getByText('실시간 연결됨').waitFor();

    // 6) 시청자: 후원 페이지에서 이미지 업로드 → 코드 표시
    await viewer.goto(`${baseUrl}/d/e2e-streamer`);
    await viewer.getByRole('heading', { name: /E2E 방송/ }).waitFor();
    await viewer.getByLabel('이미지', { exact: true }).setInputFiles({ name: 'cat.png', mimeType: 'image/png', buffer: makePng(64, 48, [255, 140, 0]) });
    await viewer.getByAltText('보낼 이미지 미리보기').waitFor();
    await viewer.getByLabel('닉네임').fill('고양이집사');
    await viewer.getByLabel(/메시지/).fill('<script>alert(1)</script> 귀여운 고양이');
    await viewer.getByRole('button', { name: '보내기' }).click();
    const code = (await viewer.getByLabel('후원 코드').textContent()).trim();
    assert.match(code, /^#[A-Z0-9]{4}$/);
    await viewer.getByText('1,000치즈 이상').waitFor();

    // 7) 대시보드: 새 후원이 실시간으로 "치즈 대기"로 나타난다
    const card = streamer.locator('article.card', { hasText: '고양이집사' });
    await card.getByText('치즈 대기').waitFor();
    await card.getByText(code).waitFor();
    await card.getByText('<script>alert(1)</script> 귀여운 고양이').waitFor(); // 글자로 보인다(실행되지 않음)

    // 8) 테스트 모드: 코드를 넣은 가짜 치즈 후원 → "검수 대기"로 바뀐다
    await streamer.getByLabel('치즈', { exact: true }).fill('1000');
    await streamer.getByLabel('후원 메시지').fill(`이미지 부탁해요 ${code.toLowerCase()}`);
    await streamer.getByRole('button', { name: '가짜 치즈 후원 보내기' }).click();
    await card.getByText('검수 대기').waitFor();
    await card.getByText('치즈 1,000개 확인').waitFor();

    // 대기열(검수 대기 탭)에 나타난다
    await streamer.getByRole('button', { name: '검수 대기', exact: true }).click();
    await card.waitFor();
    await streamer.getByRole('button', { name: '전체', exact: true }).click(); // 승인 뒤에도 카드가 보이도록

    // 9) 승인 → 오버레이에 이미지 표시
    await card.getByRole('button', { name: '승인' }).click();
    await card.getByText('승인됨').waitFor();

    const shown = overlay.locator('figure.donation');
    await shown.waitFor();
    await shown.getByText('고양이집사').waitFor();
    const naturalWidth = await shown.locator('img').evaluate(async (img) => {
      await img.decode(); // 이미지 파일을 실제로 받아 그렸는지 확인
      return img.naturalWidth;
    });
    assert.equal(naturalWidth, 64); // 작은 이미지는 키우지 않는다

    // 10) 긴급 정지 → 오버레이에서 사라진다
    await streamer.getByRole('button', { name: /긴급 정지/ }).click();
    await streamer.getByText('오버레이 화면을 비웠어요.').waitFor();
    await shown.waitFor({ state: 'detached' });
    assert.equal(await overlay.locator('figure.donation').count(), 0);
    await card.getByText('긴급 정지됨').waitFor(); // DB에도 남는다: 다시 연결해도 또 나오지 않는다

    // 11) 콘솔 오류 0건 (세 화면 모두)
    assert.deepEqual(errors, { streamer: [], viewer: [], overlay: [] });
  } finally {
    await streamerContext.close();
    await viewerContext.close();
    await overlayContext.close();
  }
});
