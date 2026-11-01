// 네트워크: HTTP API 호출과 WebSocket 연결.
// 주소는 지금 페이지와 같은 서버(location.host)를 써요. 그래서 개발 서버(vite)는 프록시가 필요해요.

import type { ClientMsg, Leaderboard, Role, RoomInfo, ServerMsg } from './protocol';

/** 방 코드 정리: 앞뒤 공백 제거 + 대문자 */
export function normalizeCode(raw: string): string {
  return raw.trim().toUpperCase();
}

/** 주소의 ?room=ABCD 를 읽어요. 없으면 null */
export function roomFromUrl(): string | null {
  const code = new URLSearchParams(location.search).get('room');
  return code ? normalizeCode(code) : null;
}

/** 이 PC에서만 열리는 주소(127.0.0.1, localhost)로 페이지를 열었나요? 그러면 휴대폰은 같은 주소로 못 들어와요. */
export function isLocalOnlyAddress(): boolean {
  return ['127.0.0.1', 'localhost', '[::1]'].includes(location.hostname);
}

export async function createRoom(): Promise<string> {
  const response = await fetch('/api/rooms', { method: 'POST' });
  if (!response.ok) {
    throw new Error(`방을 만들지 못했어요 (${response.status})`);
  }
  const body = (await response.json()) as { code: string };
  return body.code;
}

/** 방 상태. 방이 없으면(404) null, 서버에 닿지 못하면 예외가 나요. */
export async function fetchRoom(code: string): Promise<RoomInfo | null> {
  const response = await fetch(`/api/rooms/${encodeURIComponent(code)}`);
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`방 정보를 불러오지 못했어요 (${response.status})`);
  }
  return (await response.json()) as RoomInfo;
}

export async function fetchLeaderboard(period: 'day' | 'all'): Promise<Leaderboard> {
  const response = await fetch(`/api/leaderboard?period=${period}`);
  if (!response.ok) {
    throw new Error(`랭킹을 불러오지 못했어요 (${response.status})`);
  }
  return (await response.json()) as Leaderboard;
}

export interface Connection {
  send(msg: ClientMsg): void;
  close(): void;
  /** 마지막으로 잰 왕복 지연(ms). 아직 모르면 0 */
  rttMs(): number;
}

export interface Handlers {
  onOpen?(): void;
  onMessage(msg: ServerMsg): void;
  onClose?(event: CloseEvent): void;
}

const PING_INTERVAL_MS = 2000;

/** WebSocket으로 방에 연결해요. ping/pong으로 지연(RTT)도 재요. */
export function connect(room: string, role: Role, handlers: Handlers): Connection {
  const scheme = location.protocol === 'https:' ? 'wss:' : 'ws:'; // https 페이지는 wss만 쓸 수 있어요
  const socket = new WebSocket(`${scheme}//${location.host}/ws/${encodeURIComponent(room)}?role=${role}`);
  let rtt = 0;
  let pingTimer: number | undefined;

  function send(msg: ClientMsg): void {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(msg));
    }
  }

  socket.addEventListener('open', () => {
    pingTimer = window.setInterval(() => send({ t: 'ping', ts: performance.now() }), PING_INTERVAL_MS);
    handlers.onOpen?.();
  });

  socket.addEventListener('message', (event) => {
    const msg = JSON.parse(String(event.data)) as ServerMsg;
    if (msg.t === 'pong') {
      rtt = performance.now() - msg.ts; // 보낸 시각을 돌려받았으니 빼면 왕복 시간
      return;
    }
    handlers.onMessage(msg);
  });

  socket.addEventListener('close', (event) => {
    window.clearInterval(pingTimer);
    handlers.onClose?.(event);
  });

  return { send, close: () => socket.close(), rttMs: () => rtt };
}
