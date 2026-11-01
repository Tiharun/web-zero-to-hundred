// 테스트용 정적 파일 서버: 폴더 하나를 http://127.0.0.1:<빈 포트>/ 로 제공한다.
// 사용: const server = await startStaticServer(rootDir); ... await server.close();
import http from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

export async function startStaticServer(rootDir) {
  const root = path.resolve(rootDir);

  const server = http.createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
      let filePath = path.resolve(root, '.' + pathname);

      // 폴더 밖으로 나가는 경로(../ 등)는 막는다.
      if (filePath !== root && !filePath.startsWith(root + path.sep)) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Forbidden');
        return;
      }

      let stat = await fs.stat(filePath);
      if (stat.isDirectory()) {
        filePath = path.join(filePath, 'index.html');
        stat = await fs.stat(filePath);
      }

      const body = await fs.readFile(filePath);
      const type = MIME_TYPES[path.extname(filePath).toLowerCase()] ?? 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': type, 'Content-Length': body.length, 'Cache-Control': 'no-store' });
      res.end(body);
    } catch {
      // 없는 파일, 잘못된 인코딩 등은 모두 404
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
    }
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve); // 0 = 비어 있는 포트를 운영체제가 골라 준다
  });

  const { port } = server.address();
  return {
    url: `http://127.0.0.1:${port}/`,
    close() {
      return new Promise((resolve) => {
        server.close(() => resolve());
        server.closeAllConnections(); // 열려 있는 연결 때문에 닫기가 멈추지 않도록
      });
    },
  };
}
