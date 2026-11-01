// 스냅샷 보간(interpolation)
//
// 서버는 위치를 1초에 10번만 보내요. 받은 위치를 그대로 그리면 뚝뚝 끊겨 보여요.
// 그래서 화면은 "조금 과거"(INTERP_DELAY_MS 전)를 그리고, 그 시각을 사이에 둔
// 두 스냅샷 사이를 선형 보간(lerp)해서 부드럽게 채워요.
//
//   스냅샷:   A ─────────── B ─────────── C        (100ms 간격)
//   화면 시각:          ▲ (지금 - 150ms) → A와 B 사이 60% 지점을 그린다

import type { PlayerState, Snapshot } from './protocol';
import { SNAPSHOT_HZ } from './protocol';

/** 스냅샷 한 간격(100ms) + 네트워크 흔들림 여유(50ms) */
export const INTERP_DELAY_MS = 1000 / SNAPSHOT_HZ + 50;
const KEEP = 30; // 최근 30개(3초)만 기억해요

interface Received {
  at: number; // 받은 시각(performance.now())
  snapshot: Snapshot;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** 같은 id끼리 위치를 보간해요. 새로 들어온 플레이어는 그대로 그려요. */
export function interpolatePlayers(from: PlayerState[], to: PlayerState[], t: number): PlayerState[] {
  const before = new Map(from.map((p) => [p.id, p]));
  return to.map((p) => {
    const old = before.get(p.id);
    if (!old) return p;
    return { ...p, x: lerp(old.x, p.x, t), y: lerp(old.y, p.y, t) };
  });
}

export class SnapshotBuffer {
  private received: Received[] = [];

  push(snapshot: Snapshot, at: number): void {
    this.received.push({ at, snapshot });
    if (this.received.length > KEEP) this.received.shift();
  }

  latest(): Snapshot | null {
    return this.received.at(-1)?.snapshot ?? null;
  }

  /** now 시각에 화면에 그릴 플레이어들 */
  playersAt(now: number): PlayerState[] {
    const renderAt = now - INTERP_DELAY_MS;
    // 뒤에서부터 "renderAt 이전에 받은 스냅샷 a"를 찾고, 그 다음 것 b와 보간해요.
    for (let i = this.received.length - 2; i >= 0; i--) {
      const a = this.received[i];
      const b = this.received[i + 1];
      if (a && b && a.at <= renderAt) {
        const t = Math.min(1, (renderAt - a.at) / Math.max(1, b.at - a.at));
        return interpolatePlayers(a.snapshot.players, b.snapshot.players, t);
      }
    }
    // 아직 스냅샷이 하나뿐이거나 너무 이르면 가장 최근 것을 그대로 그려요.
    return this.latest()?.players ?? [];
  }
}
