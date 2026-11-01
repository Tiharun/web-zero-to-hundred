// Canvas 2D 그리기
//
// 월드 좌표: 아레나 중심이 (0, 0), 반지름 600. x는 오른쪽이 +, y는 아래쪽이 +(캔버스와 같아요).
// 화면 크기에 맞춰 확대·축소(scale)한 뒤 월드 좌표 그대로 그려요.

import type { ItemState, PlayerState } from './protocol';
import { ARENA_RADIUS, ITEM_RADIUS, PLAYER_RADIUS } from './protocol';

/**
 * 캔버스 해상도를 "CSS 크기 × 기기 픽셀 비율(DPR)"로 맞춰요.
 * 휴대폰은 DPR이 2~3이라서 이렇게 해야 흐릿하지 않아요.
 */
export function fitCanvas(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const dpr = window.devicePixelRatio || 1;
  const { width, height } = canvas.getBoundingClientRect();
  const pixelWidth = Math.round(width * dpr);
  const pixelHeight = Math.round(height * dpr);
  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D를 쓸 수 없어요');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // 이제부터 CSS 픽셀 단위로 그려요
  return ctx;
}

export interface Scene {
  players: PlayerState[];
  items: ItemState[];
  /** 내 플레이어(휴대폰 화면에서 테두리로 강조) */
  meId?: number;
}

export function drawScene(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scene: Scene): void {
  const { width, height } = canvas.getBoundingClientRect();
  if (width === 0 || height === 0) return; // 숨겨진 캔버스는 그리지 않아요
  // 투명하게 지워요. OBS에서는 아레나 바깥으로 방송 화면이 비쳐요.
  ctx.clearRect(0, 0, width, height);

  const scale = Math.max(1, Math.min(width, height) / 2 - 6) / ARENA_RADIUS; // 아레나가 화면에 꽉 차게
  const px = (cssPixels: number) => cssPixels / scale; // 화면에서 늘 같은 굵기·크기로 보이게

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.scale(scale, scale);

  // 아레나
  ctx.beginPath();
  ctx.arc(0, 0, ARENA_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
  ctx.fill();
  ctx.lineWidth = px(3);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.stroke();

  // 아이템
  ctx.fillStyle = '#ffd43b';
  for (const item of scene.items) {
    ctx.beginPath();
    ctx.arc(item.x, item.y, ITEM_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  }

  // 플레이어 + 이름표
  ctx.font = `bold ${px(14)}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  for (const player of scene.players) {
    ctx.beginPath();
    ctx.arc(player.x, player.y, PLAYER_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
    if (player.id === scene.meId) {
      ctx.lineWidth = px(3);
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
    }
    const labelY = player.y - PLAYER_RADIUS - px(6);
    ctx.lineWidth = px(4);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.75)'; // 어떤 배경에서도 읽히게 검은 테두리
    ctx.strokeText(player.name, player.x, labelY);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(player.name, player.x, labelY);
  }

  ctx.restore();
}
