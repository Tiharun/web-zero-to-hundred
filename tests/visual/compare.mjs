// PNG 두 장을 픽셀 단위로 비교한다. 다른 픽셀이 전체의 0.1%를 넘거나 크기가 다르면 실패
import { PNG, pixelmatch } from './deps.mjs';

export const MAX_DIFF_RATIO = 0.001;
// pixelmatch 8 의 문턱값은 OKLab HyAB 거리(검정↔흰색 = 1)다. 기본값 0.1 은 paper 토큰 변경(0.033)이나
// accent↔accent-hover(0.0996)도 놓치므로 0.02 로 둔다. 글자 가장자리의 안티에일리어싱은 pixelmatch 가 따로 거른다
export const COLOR_THRESHOLD = 0.02;

/**
 * @param {Buffer} aBuffer 기준 PNG
 * @param {Buffer} bBuffer 새로 찍은 PNG
 * @returns {{ ok: boolean, diffRatio: number, diffPng: Buffer | null, reason: string }}
 */
export function compare(aBuffer, bBuffer) {
  const a = PNG.sync.read(aBuffer);
  const b = PNG.sync.read(bBuffer);
  if (a.width !== b.width || a.height !== b.height) {
    return { ok: false, diffRatio: 1, diffPng: null, reason: `크기가 달라요: 기준 ${a.width}×${a.height}, 새 이미지 ${b.width}×${b.height}` };
  }
  const diff = new PNG({ width: a.width, height: a.height });
  const changed = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: COLOR_THRESHOLD });
  const diffRatio = changed / (a.width * a.height);
  const ok = diffRatio <= MAX_DIFF_RATIO;
  return { ok, diffRatio, diffPng: PNG.sync.write(diff), reason: ok ? '' : `다른 픽셀 ${changed}개 (${(diffRatio * 100).toFixed(3)}%)` };
}
