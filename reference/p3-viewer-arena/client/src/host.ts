// host.html: OBS 브라우저 소스로 띄우는 관전 화면(배경이 투명해요).
// 스냅샷을 받아 보간해서 그리고, 참가용 QR 코드와 랭킹·라운드 결과를 보여 줘요.

import './style.css';
import { SnapshotBuffer } from './interp';
import { connect, fetchLeaderboard, fetchRoom, isLocalOnlyAddress, roomFromUrl } from './net';
import { PHASE_LABEL, formatTime, type RankEntry, type RoomInfo, type Snapshot } from './protocol';
import { drawQr } from './qr';
import { drawScene, fitCanvas } from './render';

const canvas = document.querySelector<HTMLCanvasElement>('#arena')!;
const phaseText = document.querySelector<HTMLElement>('#phase')!;
const timeText = document.querySelector<HTMLElement>('#time')!;
const countText = document.querySelector<HTMLElement>('#count')!;
const codeText = document.querySelector<HTMLElement>('#code')!;
const joinUrlText = document.querySelector<HTMLElement>('#join-url')!;
const qrCanvas = document.querySelector<HTMLCanvasElement>('#qr')!;
const board = document.querySelector<HTMLElement>('#board')!;
const boardList = document.querySelector<HTMLOListElement>('#board-list')!;
const result = document.querySelector<HTMLElement>('#result')!;
const resultList = document.querySelector<HTMLOListElement>('#result-list')!;
const statusText = document.querySelector<HTMLElement>('#status')!;

/** 목록 한 줄. 닉네임은 시청자가 쓴 글자라서 innerHTML이 아니라 textContent로 넣어요. */
function listItem(text: string): HTMLLIElement {
  const li = document.createElement('li');
  li.textContent = text;
  return li;
}

function showHud(snapshot: Snapshot): void {
  phaseText.textContent = PHASE_LABEL[snapshot.phase];
  const waitingForPlayers = snapshot.phase === 'waiting' && snapshot.players.length === 0;
  timeText.textContent = waitingForPlayers ? '참가자를 기다려요' : formatTime(snapshot.timeLeft);
  countText.textContent = `참가 ${snapshot.players.length}명`;
  if (snapshot.phase !== 'ended') result.hidden = true;
}

function showResult(ranking: RankEntry[]): void {
  const top = ranking.slice(0, 5).map((entry, i) => listItem(`${i + 1}. ${entry.name} · ${entry.score}점`));
  resultList.replaceChildren(...(top.length > 0 ? top : [listItem('참가자가 없었어요')]));
  result.hidden = false;
}

async function refreshBoard(): Promise<void> {
  try {
    const leaderboard = await fetchLeaderboard('day');
    board.hidden = !leaderboard.enabled; // DB가 없으면 랭킹 칸을 숨겨요
    boardList.replaceChildren(...leaderboard.entries.slice(0, 5).map((e) => listItem(`${e.name} · ${e.score}점`)));
  } catch {
    board.hidden = true; // 랭킹이 안 되어도 게임은 계속돼요
  }
}

const RECONNECT_MS = 3000;
const snapshots = new SnapshotBuffer();

/** 평소 상태 줄: 127.0.0.1로 열었으면 휴대폰이 못 들어온다는 경고, 아니면 빈칸 */
function normalStatus(): string {
  return isLocalOnlyAddress()
    ? '⚠️ 127.0.0.1 주소라서 휴대폰이 QR로 들어올 수 없어요. PC의 IP 주소로 이 페이지를 열어 주세요.'
    : '';
}

/**
 * 방이 있는지 확인하고 관전자로 연결해요.
 * OBS 화면은 방송 내내 켜 두니까, 연결이 끊기면 3초 뒤 스스로 다시 붙어요.
 */
async function watch(room: string): Promise<void> {
  let info: RoomInfo | null;
  try {
    info = await fetchRoom(room);
  } catch {
    statusText.textContent = '서버에 연결하지 못했어요. 서버를 켜면 자동으로 다시 붙어요.';
    window.setTimeout(() => void watch(room), RECONNECT_MS);
    return;
  }
  if (!info) {
    statusText.textContent = '방을 찾을 수 없어요. 방 코드를 확인하거나 첫 화면에서 새 방을 만들어 주세요.';
    phaseText.textContent = '방 없음';
    return;
  }

  connect(room, 'host', {
    onOpen() {
      statusText.textContent = normalStatus();
    },
    onMessage(msg) {
      if (msg.t === 'snapshot') {
        snapshots.push(msg, performance.now());
        canvas.dataset.players = String(msg.players.length); // 디버그·테스트용
        showHud(msg);
      } else if (msg.t === 'result') {
        showResult(msg.ranking);
        void refreshBoard(); // 방금 끝난 판이 랭킹에 반영됐을 거예요
      } else if (msg.t === 'error') {
        statusText.textContent = msg.message;
      }
    },
    onClose() {
      statusText.textContent = '서버와 연결이 끊겼어요. 3초 뒤 다시 연결해요…';
      window.setTimeout(() => void watch(room), RECONNECT_MS);
    },
  });
}

function start(room: string): void {
  const joinUrl = `${location.origin}/play.html?room=${room}`;
  codeText.textContent = room;
  joinUrlText.textContent = joinUrl;
  drawQr(qrCanvas, joinUrl, 200);
  statusText.textContent = normalStatus();

  void watch(room);
  void refreshBoard();

  // 화면 주사율(보통 60Hz)마다 그려요. 스냅샷은 10Hz라서 그 사이는 보간으로 채워요.
  const frame = (now: number) => {
    drawScene(canvas, fitCanvas(canvas), {
      players: snapshots.playersAt(now),
      items: snapshots.latest()?.items ?? [],
    });
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

const room = roomFromUrl();
if (room) {
  start(room);
} else {
  statusText.textContent = '주소 끝에 ?room=방코드 를 붙여 주세요. 예) host.html?room=ABCD';
}
