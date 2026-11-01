// Vite 설정: HTML 페이지 세 개를 빌드하고, 개발 서버에서는 API·WebSocket을 Rust 서버로 넘겨요.
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rolldownOptions: {
      // 여러 페이지(MPA): 각 HTML이 빌드의 시작점이에요.
      input: ['index.html', 'host.html', 'play.html'],
    },
  },
  server: {
    // npm run dev(5173)로 열었을 때 /api와 /ws는 cargo run으로 켠 서버(8080)로 보내요.
    proxy: {
      '/api': 'http://127.0.0.1:8080',
      '/ws': { target: 'ws://127.0.0.1:8080', ws: true },
    },
  },
});
