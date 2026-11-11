// 시각 테스트의 의존성(pixelmatch, pngjs)은 textbook/package.json 에 있다.
// tests/ 는 textbook/ 밖이라 이름으로는 찾지 못하므로 textbook 기준으로 찾아 불러온다.
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const require = createRequire(new URL('../../textbook/package.json', import.meta.url));

export const { PNG } = require('pngjs');
export const pixelmatch = (await import(pathToFileURL(require.resolve('pixelmatch')).href)).default;
