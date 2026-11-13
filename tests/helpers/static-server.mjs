// 테스트용 정적 파일 서버: 폴더 하나를 http://127.0.0.1:<빈 포트>/ 로 제공한다.
// 사용: const server = await startStaticServer(rootDir); ... await server.close();
import http from 'node:http';
import net from 'node:net';
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

// 브라우저가 ERR_UNSAFE_PORT 로 거절하는 포트(Fetch 표준 2.9 "bad port", https://fetch.spec.whatwg.org/#port-blocking).
// 운영체제가 빈 포트로 이 중 하나(예: 4045)를 주면 e2e 가 한꺼번에 깨진다(M9에서 실제로 겪음)
const BAD_PORTS = new Set([
  0, 1, 7, 9, 11, 13, 15, 17, 19, 20, 21, 22, 23, 25, 37, 42, 43, 53, 69, 77, 79, 87, 95, 101, 102, 103, 104, 109, 110,
  111, 113, 115, 117, 119, 123, 135, 137, 139, 143, 161, 179, 389, 427, 465, 512, 513, 514, 515, 526, 530, 531, 532, 540,
  548, 554, 556, 563, 587, 601, 636, 989, 990, 993, 995, 1719, 1720, 1723, 2049, 3659, 4045, 4190, 5060, 5061, 6000, 6566,
  6665, 6666, 6667, 6668, 6669, 6679, 6697, 10080,
]);

export const isBadPort = (port) => BAD_PORTS.has(port);

const listen = (server) =>
  new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve(server.address().port)); // 0 = 비어 있는 포트를 운영체제가 골라 준다
  });

/** 막힌 포트를 받으면 그 서버를 잡아 둔 채(같은 포트를 다시 받지 않게) 새로 받고, 끝나면 건너뛴 서버를 닫는다 */
async function listenSafe(create, isBad) {
  const skipped = [];
  try {
    for (;;) {
      const server = create();
      const port = await listen(server);
      if (!isBad(port)) return { server, port };
      skipped.push(server);
    }
  } finally {
    await Promise.all(skipped.map((s) => new Promise((resolve) => s.close(() => resolve()))));
  }
}

/** 브라우저가 열 수 있는 빈 포트 번호(열었다가 바로 닫는다). 다른 프로그램(완성본 서버)에 넘길 때 쓴다 */
export async function freePort({ isBad = isBadPort } = {}) {
  const { server, port } = await listenSafe(() => net.createServer(), isBad);
  await new Promise((resolve) => server.close(() => resolve()));
  return port;
}

/** isBad: 쓰지 않을 포트인지(테스트에서 바꿔 끼운다) */
export async function startStaticServer(rootDir, { isBad = isBadPort } = {}) {
  const root = path.resolve(rootDir);

  const handler = async (req, res) => {
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
  };

  const { server, port } = await listenSafe(() => http.createServer(handler), isBad);

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
