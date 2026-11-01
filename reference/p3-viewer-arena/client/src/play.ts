// play.html: 휴대폰 컨트롤러. 닉네임을 넣고 참가한 뒤 조이스틱(또는 키보드)으로 움직여요.
//
// 클라이언트 예측: 서버 스냅샷(초당 10번)을 기다리면 손가락보다 화면이 늦게 움직여요.
// 그래서 내 플레이어만은 WASM(서버와 같은 Rust 코드)으로 매 프레임 미리 움직이고,
// 스냅샷이 오면 서버 위치 쪽으로 보정해요. 다른 플레이어는 보간으로 그려요.

import './style.css';
import { SnapshotBuffer } from './interp';
import { STILL, firstActive, joystick, keyboard, round2, type Direction } from './input';
import { connect, roomFromUrl, type Connection } from './net';
import { PHASE_LABEL, TICK_HZ, formatTime, type Snapshot } from './protocol';
import { drawScene, fitCanvas } from './render';
import { loadWasm, predictBody, type BodyState } from './wasm';

const form = document.querySelector<HTMLFormElement>('#join-form')!;
const nameInput = document.querySelector<HTMLInputElement>('#name')!;
const joinButton = document.querySelector<HTMLButtonElement>('#join')!;
const roomText = document.querySelector<HTMLElement>('#room-label')!;
const statusText = document.querySelector<HTMLElement>('#status')!;
const game = document.querySelector<HTMLElement>('#game')!;
const canvas = document.querySelector<HTMLCanvasElement>('#arena')!;
const phaseText = document.querySelector<HTMLElement>('#phase')!;
const scoreText = document.querySelector<HTMLElement>('#score')!;
const stick = document.querySelector<HTMLElement>('#stick')!;
const knob = document.querySelector<HTMLElement>('#knob')!;

const SNAP_DISTANCE = 80; // 예측이 서버와 이만큼(월드 단위) 넘게 다르면 바로 서버 위치로
const CORRECTION = 0.3; // 그보다 작으면 스냅샷마다 차이의 30%씩 서버 쪽으로

// 조이스틱을 먼저 보고, 안 쓰고 있으면 키보드를 봐요. 소수 둘째 자리까지만 써요.
const readStick = firstActive(joystick(stick, knob), keyboard());
const readInput = (): Direction => round2(readStick());

/**
 * 스냅샷이 오면 예측을 보정해요.
 * 서버 위치는 지연(RTT의 절반)만큼 과거라서, 그만큼 앞으로 계산한 위치와 비교해요.
 */
function correct(me: BodyState | null, snapshot: Snapshot, myId: number, connection: Connection): BodyState | null {
  const server = snapshot.players.find((p) => p.id === myId);
  if (!server) return me;
  const caughtUp = predictBody(server, readInput(), connection.rttMs() / 2000);
  if (!me) return caughtUp;
  const gap = Math.hypot(caughtUp.x - me.x, caughtUp.y - me.y);
  if (gap > SNAP_DISTANCE) return caughtUp;
  return {
    x: me.x + (caughtUp.x - me.x) * CORRECTION,
    y: me.y + (caughtUp.y - me.y) * CORRECTION,
    vx: caughtUp.vx,
    vy: caughtUp.vy,
  };
}

function showHud(snapshot: Snapshot, myId: number): void {
  const me = snapshot.players.find((p) => p.id === myId);
  phaseText.textContent = `${PHASE_LABEL[snapshot.phase]} ${formatTime(snapshot.timeLeft)}`;
  scoreText.textContent = `${me?.score ?? 0}점`;
}

/** 입력을 1초에 20번(TICK_HZ) 살펴보고, 바뀌었을 때만 서버로 보내요. */
function startSending(connection: Connection, isOpen: () => boolean): void {
  let seq = 0;
  let sent = STILL;
  const timer = window.setInterval(() => {
    if (!isOpen()) {
      window.clearInterval(timer);
      return;
    }
    const dir = readInput();
    if (dir.dx === sent.dx && dir.dy === sent.dy) return;
    seq += 1;
    connection.send({ t: 'input', seq, dx: dir.dx, dy: dir.dy });
    sent = dir;
  }, 1000 / TICK_HZ);
}

async function join(room: string, name: string): Promise<void> {
  joinButton.disabled = true;
  statusText.textContent = '연결 중…';
  await loadWasm(); // 예측에 쓸 Rust 코드를 먼저 준비해요

  let myId = 0; // 0 = 아직 참가 전
  let open = true;
  let me: BodyState | null = null; // 예측한 내 몸 상태
  const snapshots = new SnapshotBuffer();

  const connection = connect(room, 'player', {
    onOpen: () => connection.send({ t: 'join', name }),
    onMessage(msg) {
      switch (msg.t) {
        case 'welcome':
          myId = msg.id;
          form.hidden = true;
          game.hidden = false;
          statusText.textContent = '';
          document.body.dataset.state = 'joined'; // 디버그·테스트용
          startSending(connection, () => open);
          requestAnimationFrame(frame);
          break;
        case 'snapshot':
          snapshots.push(msg, performance.now());
          me = correct(me, msg, myId, connection);
          showHud(msg, myId);
          break;
        case 'result': {
          const place = msg.ranking.findIndex((entry) => entry.name === name);
          const mine = msg.ranking[place];
          statusText.textContent = mine ? `라운드 끝! ${place + 1}등 (${mine.score}점)` : '라운드 끝!';
          break;
        }
        case 'error':
          statusText.textContent = msg.message;
          break;
      }
    },
    onClose() {
      open = false;
      if (myId === 0) {
        joinButton.disabled = false; // 참가 전에 끊김(닉네임 거절 등): 고쳐서 다시 시도할 수 있어요
        return;
      }
      statusText.textContent = '연결이 끊겼어요. 새로 고침해서 다시 참가해 주세요.';
      document.body.dataset.state = 'closed';
    },
  });

  let last = performance.now();
  function frame(now: number): void {
    const dt = Math.min((now - last) / 1000, 0.1); // 탭이 멈췄다 돌아와도 한 번에 크게 움직이지 않게
    last = now;
    if (me) me = predictBody(me, readInput(), dt);
    const players = snapshots
      .playersAt(now)
      .map((p) => (p.id === myId && me ? { ...p, x: me.x, y: me.y } : p));
    drawScene(canvas, fitCanvas(canvas), { players, items: snapshots.latest()?.items ?? [], meId: myId });
    if (open) requestAnimationFrame(frame);
  }
}

const room = roomFromUrl();
if (room) {
  roomText.textContent = `방 ${room}`;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    void join(room, nameInput.value.trim());
  });
} else {
  form.hidden = true;
  statusText.textContent = '방 코드가 없어요. 첫 화면에서 방 코드를 넣어 주세요.';
}
