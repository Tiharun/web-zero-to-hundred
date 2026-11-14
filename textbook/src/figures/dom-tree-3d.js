// Day 6·20 그림: 겹쳐 놓인 HTML 상자를 옆에서 보면 DOM 나무가 된다 (3D 층 그림, DESIGN.md "그림 틀" 3D 그림(G4)).
// 정면에서는 페이지 모양(상자 안의 상자), 돌리면 안쪽 요소일수록 한 층씩 떠서 깊이 = 나무의 층이 된다.
// 배열은 깊이 오름차순, 같은 깊이는 위에서 아래(왼쪽에서 오른쪽) 순서다. 이름표는 태그 글자 그대로(code).
// 자식은 부모 왼쪽 위에서 24 이상 떨어뜨린다: 375px 에서도 부모와 자식의 이름표가 겹치지 않는 간격이다.
import { layerFigure } from '../app/views/figure3d.js';

const tag = (id, label, depth, parent, x, y, w, h, extra = {}) => ({ id, label, depth, parent, x, y, w, h, code: true, ...extra });

/** Day 6: 사이트 한 페이지(body > header·main·footer, header > a·nav, main > section) */
export const SITE_LAYERS = Object.freeze([
  tag('body', 'body', 0, null, 0, 0, 320, 240),
  tag('header', 'header', 1, 'body', 24, 24, 272, 56),
  tag('main', 'main', 1, 'body', 24, 92, 272, 84),
  tag('footer', 'footer', 1, 'body', 24, 188, 272, 40),
  tag('a', 'a', 2, 'header', 40, 48, 80, 24),
  tag('nav', 'nav', 2, 'header', 160, 48, 120, 24),
  tag('section', 'section', 2, 'main', 40, 116, 240, 48),
]);

/** Day 20: 영상 페이지(html > head·body, body > header·main, main > h1·div#video-list, 목록 > article.card ×2). head 는 화면에 그려지지 않아 점선 */
export const CARD_LAYERS = Object.freeze([
  tag('html', 'html', 0, null, 0, 0, 320, 240),
  tag('head', 'head', 1, 'html', 24, 24, 64, 192, { ghost: true }),
  tag('body', 'body', 1, 'html', 100, 24, 196, 192),
  tag('header', 'header', 2, 'body', 112, 48, 172, 28),
  tag('main', 'main', 2, 'body', 112, 88, 172, 120),
  tag('h1', 'h1', 3, 'main', 124, 112, 48, 24),
  tag('video-list', 'div#video-list', 3, 'main', 180, 112, 96, 88),
  tag('card-1', 'article.card', 4, 'video-list', 192, 136, 76, 24),
  tag('card-2', 'article.card', 4, 'video-list', 192, 168, 76, 24),
]);

export const mountSite = (fig, opts) => layerFigure(fig, { layers: SITE_LAYERS, ...opts });
export const mountCards = (fig, opts) => layerFigure(fig, { layers: CARD_LAYERS, ...opts });
