// WebAssembly 불러오기: Rust game-core의 이동 계산을 브라우저에서 그대로 써요.
//
// ./wasm/ 폴더는 `npm run wasm`이 만들어요(빌드 결과물이라 커밋하지 않아요).
//   cargo build -p game-wasm --target wasm32-unknown-unknown --release
//   wasm-bindgen --target web --out-dir src/wasm ../target/wasm32-unknown-unknown/release/game_wasm.wasm

import init, { predict } from './wasm/game_wasm.js';
import type { Direction } from './input';

export interface BodyState {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

let loading: Promise<unknown> | null = null;

/** .wasm 파일을 내려받아 준비해요. 여러 번 불러도 한 번만 받아요(??= : 비어 있을 때만 넣기). */
export function loadWasm(): Promise<unknown> {
  return (loading ??= init().catch((error: unknown) => {
    loading = null; // 실패했으면 비워 둬요. 그래야 다음에 다시 시도할 수 있어요.
    throw error;
  }));
}

/** dt초 뒤 내 몸 상태(서버와 똑같은 규칙). loadWasm()이 끝난 뒤에 불러요. */
export function predictBody(state: BodyState, input: Direction, dt: number): BodyState {
  const body = { x: state.x, y: state.y, vx: state.vx, vy: state.vy };
  const json = predict(JSON.stringify(body), JSON.stringify(input), dt);
  return JSON.parse(json) as BodyState;
}
