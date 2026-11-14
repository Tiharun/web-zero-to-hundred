// Day 10 그림: CSS 박스 모델 네 겹 (3D 층 그림, DESIGN.md "그림 틀" 3D 그림(G4)).
// 바깥부터 margin ⊃ border ⊃ padding ⊃ content. margin 은 화면에 칠해지지 않아 면 없는 점선(ghost)이다.
import { layerFigure } from '../app/views/figure3d.js';

/** 평면 320×240 위의 층. 안쪽 간격: margin→border 24, border→padding 24, padding→content 28 (375px 에서도 이름표가 겹치지 않는 간격) */
export const BOX_LAYERS = Object.freeze([
  { id: 'margin', label: 'margin (바깥 여백)', depth: 0, parent: null, x: 0, y: 0, w: 320, h: 240, code: true, ghost: true },
  { id: 'border', label: 'border (테두리)', depth: 1, parent: 'margin', x: 24, y: 24, w: 272, h: 192, code: true },
  { id: 'padding', label: 'padding (안쪽 여백)', depth: 2, parent: 'border', x: 48, y: 48, w: 224, h: 144, code: true },
  { id: 'content', label: '내용 (content)', depth: 3, parent: 'padding', x: 76, y: 76, w: 168, h: 88, code: true },
]);

export const mount = (fig, opts) => layerFigure(fig, { layers: BOX_LAYERS, ...opts });
