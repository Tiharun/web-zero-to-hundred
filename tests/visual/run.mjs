// 시각 테스트 실행기. --update 면 기준 이미지를 새로 저장한다(WZH_VISUAL_UPDATE=1).
// 운영체제와 상관없이 환경 변수를 세우려고 node --test 를 자식 프로세스로 띄운다.
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const update = process.argv.includes('--update');
const testFile = fileURLToPath(new URL('./visual.test.mjs', import.meta.url));
const r = spawnSync(process.execPath, ['--test', testFile], {
  stdio: 'inherit',
  env: { ...process.env, ...(update ? { WZH_VISUAL_UPDATE: '1' } : {}) },
});
process.exit(r.status ?? 1);
