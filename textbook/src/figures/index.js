// 그림 등록표: Markdown 의 :::figure <id> 와 그림 모듈을 잇는다.
// 값은 mount(fig, { reducedMotion }) → dispose 함수다(fig 는 <figure class="figure"> 요소).
// 빌드가 Node 에서 이 파일을 import 해 id 를 검사하므로, 그림 모듈은 최상위에서 document·window 를 쓰지 않는다.
import { mount as gitFlow } from './git-flow.js';
import { mount as requestResponse } from './request-response.js';

export const FIGURES = {
  'request-response': requestResponse, // Day 1
  'git-flow': gitFlow, // Day 7
};
