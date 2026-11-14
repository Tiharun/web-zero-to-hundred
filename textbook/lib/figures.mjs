// 그림 등록표(src/figures/index.js)의 id 를 읽는다. Markdown 렌더가 :::figure <id> 를 검사할 때 쓴다.
import path from 'node:path';
import { pathToFileURL } from 'node:url';

/**
 * @param {string} srcDir 앱 소스 폴더(textbook/src)
 * @returns {Promise<Set<string>>} 등록된 그림 id
 */
export async function loadFigureIds(srcDir) {
  const { FIGURES } = await import(pathToFileURL(path.join(srcDir, 'figures', 'index.js')).href);
  return new Set(Object.keys(FIGURES));
}
