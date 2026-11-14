// 그림 등록표: Markdown 의 :::figure <id> 와 그림 모듈을 잇는다.
// 값은 mount(fig, { reducedMotion }) → dispose 함수다(fig 는 <figure class="figure"> 요소).
// 빌드가 Node 에서 이 파일을 import 해 id 를 검사하므로, 그림 모듈은 최상위에서 document·window 를 쓰지 않는다.
import { mount as boxModel3d } from './box-model-3d.js';
import { mountCards as domTreeCards, mountSite as domTreeSite } from './dom-tree-3d.js';
import { mount as flexAxes } from './flex-axes.js';
import { mount as gitFlow } from './git-flow.js';
import { mountDev as pathsDev, mountSite as pathsSite } from './paths.js';
import { mount as requestResponse } from './request-response.js';

export const FIGURES = {
  'request-response': requestResponse, // Day 1
  'paths-site': pathsSite, // Day 4
  'paths-dev': pathsDev, // Day 5
  'dom-tree-site': domTreeSite, // Day 6 (3D)
  'git-flow': gitFlow, // Day 7
  'box-model-3d': boxModel3d, // Day 10 (3D)
  'flex-axes': flexAxes, // Day 11
  'dom-tree-cards': domTreeCards, // Day 20 (3D)
};

/** 3D 그림(엔진을 쓰는 그림) id. 한 문서에 하나만 둔다(WebGL 컨텍스트와 메모리를 아끼려고) */
export const THREE_D = new Set(['box-model-3d', 'dom-tree-site', 'dom-tree-cards']);
