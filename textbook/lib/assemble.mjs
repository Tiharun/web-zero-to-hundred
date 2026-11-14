// template.html 의 자리표시자 다섯 개에 HEAD·CSS·데이터·템플릿·JS 를 채워 파일 하나로 만든다.
// {{WZH_TITLE}} 는 몇 번이든 이스케이프한 사이트 이름으로 바꾼다.
// 각 자리는 들어가는 문맥(style / script / JSON / template)에 맞게 안전하게 만든다.

import { escapeHtml } from './site.mjs';

const PLACEHOLDERS = ['HEAD', 'CSS', 'DATA', 'TEMPLATES', 'JS'];
const TEMPLATE_ID = /^t-(?:day|page)-[a-z0-9][a-z0-9-]*$/;

/** <script type="application/json"> 안에 넣어도 태그가 닫히거나 주석이 열리지 않는 JSON */
export function jsonForScript(data) {
  return JSON.stringify(data)
    .replace(/<\//g, '<\\/') // </script> 로 닫히지 않게 (JSON 에서 \/ 는 /)
    .replace(/<!--/g, '\\u003c!--') // 스크립트 안의 주석 열기 방지
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

function styleBlock(css) {
  if (/<\/style/i.test(css)) throw new Error('CSS 에 </style 이 들어 있어요. <style> 요소가 중간에 닫혀요.');
  return `<style>${css}</style>`;
}

function scriptBlock(js, attrs = '') {
  // 문자열·정규식 안의 </script 와 <!-- 는 같은 값을 내는 다른 표기로 바꾼다
  const safe = js.replace(/<\/(script)/gi, '<\\/$1').replace(/<!--/g, '\\x3C!--');
  return `<script${attrs}>${safe}</script>`;
}

/** 늦게 실행할 스크립트: 앱이 필요할 때 글을 꺼내 실행한다. 라이선스 문구는 바로 앞 HTML 주석으로 남긴다 */
function lazyBlock({ id, js, notice }) {
  const comment = notice ? `<!--\n${notice.trim().replace(/--/g, '- -')}\n-->\n` : '';
  return `${comment}${scriptBlock(js, ` type="text/plain" id="${escapeHtml(id)}"`)}\n`;
}

function templateBlocks(templates) {
  const seen = new Set();
  return templates
    .map(({ id, html }) => {
      if (!TEMPLATE_ID.test(id)) throw new Error(`템플릿 id 는 t-day-<id> 또는 t-page-<id> 형식이어야 해요: ${JSON.stringify(id)}`);
      if (seen.has(id)) throw new Error(`템플릿 id 가 겹쳐요: ${id}`);
      seen.add(id);
      if (/<\/template/i.test(html)) throw new Error(`템플릿 ${id} 본문에 </template 이 들어 있어요.`);
      return `<template id="${id}">${html}</template>`;
    })
    .join('\n');
}

/**
 * @param {{ templateHtml: string, css: string, js: string, data: object, templates: {id: string, html: string}[], head: string, title: string, lazyScripts?: {id: string, js: string, notice?: string}[] }} parts
 * @returns {string} 완성된 index.html
 */
export function assemble({ templateHtml, css, js, data, templates, head, title, lazyScripts = [] }) {
  for (const name of PLACEHOLDERS) {
    const marker = `<!--WZH:${name}-->`;
    const count = templateHtml.split(marker).length - 1;
    if (count !== 1) throw new Error(`template.html 에 ${marker} 가 정확히 하나 있어야 해요 (현재 ${count}개)`);
  }

  // 이름은 채워 넣기 전의 틀에서만 바꾼다: 본문·데이터 안의 같은 글자는 건드리지 않는다
  const frame = templateHtml.split('{{WZH_TITLE}}').join(escapeHtml(title));
  const fill = {
    HEAD: head,
    CSS: styleBlock(css),
    DATA: `<script id="wzh-data" type="application/json">${jsonForScript(data)}</script>`,
    TEMPLATES: templateBlocks(templates),
    JS: lazyScripts.map(lazyBlock).join('') + scriptBlock(js),
  };
  // 한 번에 바꾼다: 채워 넣은 내용 안의 글자는 다시 해석하지 않는다. 함수를 써서 $& 같은 패턴도 글자 그대로 넣는다
  return frame.replace(/<!--WZH:(HEAD|CSS|DATA|TEMPLATES|JS)-->/g, (_, name) => fill[name]);
}
