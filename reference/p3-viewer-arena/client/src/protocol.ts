// 서버와 주고받는 메시지 타입.
// Rust 쪽 crates/game-core/src/protocol.rs와 모양이 같아야 해요. 한쪽을 바꾸면 다른 쪽도 바꿔요.
// 숫자 상수는 crates/game-core/src/rules.rs와 같은 값이에요(화면 그리기용).

export const PROTOCOL_VERSION = 1;
export const TICK_HZ = 20;
export const SNAPSHOT_HZ = 10;
export const ARENA_RADIUS = 600;
export const PLAYER_RADIUS = 20;
export const ITEM_RADIUS = 12;

// enum 대신 문자열 유니온 타입을 써요(Vite 템플릿의 erasableSyntaxOnly 설정).
export type Phase = 'waiting' | 'playing' | 'ended';
export type Role = 'host' | 'player';
export type ErrorCode = 'bad_message' | 'bad_name' | 'room_full' | 'room_closed' | 'rate_limited';

export interface PlayerState {
  id: number;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  score: number;
  color: string;
}

export interface ItemState {
  id: number;
  x: number;
  y: number;
}

export interface RankEntry {
  name: string;
  score: number;
}

export interface Snapshot {
  t: 'snapshot';
  tick: number;
  phase: Phase;
  timeLeft: number;
  players: PlayerState[];
  items: ItemState[];
}

// 서버 → 브라우저. `t`를 보고 어떤 메시지인지 구분해요(구별된 유니온).
export type ServerMsg =
  | { t: 'welcome'; id: number; room: string; protocol: number }
  | Snapshot
  | { t: 'result'; ranking: RankEntry[] }
  | { t: 'error'; code: ErrorCode; message: string }
  | { t: 'pong'; ts: number };

// 브라우저 → 서버
export type ClientMsg =
  | { t: 'join'; name: string }
  | { t: 'input'; seq: number; dx: number; dy: number }
  | { t: 'ping'; ts: number };

// HTTP 응답
export interface RoomInfo {
  code: string;
  players: number;
  phase: Phase;
}

export interface Leaderboard {
  enabled: boolean;
  period: 'day' | 'all';
  entries: RankEntry[];
}

export const PHASE_LABEL: Record<Phase, string> = {
  waiting: '대기 중',
  playing: '게임 중',
  ended: '라운드 결과',
};

/** 남은 시간(초) → "1:05" */
export function formatTime(seconds: number): string {
  const whole = Math.ceil(seconds);
  const m = Math.floor(whole / 60);
  const s = String(whole % 60).padStart(2, '0');
  return `${m}:${s}`;
}
