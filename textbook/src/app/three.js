// 3D 엔진 불러오기. 빌드가 <script type="text/plain" id="three-src"> 에 넣어 둔 three.js 를 처음 필요할 때 한 번 실행한다.
// 이 파일은 맨 위에서 document 를 읽지 않는다 (node 단위 테스트가 그림 모듈을 import 한다).

let loaded; // 한 번 실행한 결과(엔진 객체, 실패면 null)를 기억한다

/**
 * @param {Document} doc
 * @returns {Promise<object|null>} window.WZH_THREE. 블록이 없거나 실행에 실패하면 null
 */
export async function loadThree(doc = document) {
  if (loaded !== undefined) return loaded;
  const win = doc.defaultView;
  if (!win.WZH_THREE) {
    const src = doc.getElementById('three-src');
    if (src) {
      const script = doc.createElement('script');
      script.textContent = src.textContent;
      doc.head.append(script); // 붙이는 순간 동기로 실행된다
    }
  }
  loaded = win.WZH_THREE ?? null;
  return loaded;
}

/**
 * three.js r163 부터 WebGLRenderer 는 WebGL 2 만 쓴다(external-facts.md 14.2). 그래서 webgl2 만 본다.
 * @param {HTMLCanvasElement} canvas
 * @returns {WebGL2RenderingContext|null}
 */
export function webgl2Context(canvas) {
  try {
    return canvas.getContext('webgl2', { antialias: true, alpha: false }) ?? null;
  } catch {
    return null;
  }
}
