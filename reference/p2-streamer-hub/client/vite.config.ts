import { defineConfig } from 'vite';

// Vite 설정 (Day 27, 38)
export default defineConfig({
  server: {
    // 개발 중에는 /api로 시작하는 요청을 C# 서버(dotnet watch, 5250번 포트)로 넘겨요.
    // 브라우저 입장에서는 같은 주소(localhost:5173)라서 CORS 설정이 필요 없고, 로그인 쿠키도 그대로 붙어요.
    proxy: {
      '/api': 'http://localhost:5250',
    },
  },
  build: {
    // 페이지가 두 개라서 둘 다 알려 줘요: 사이트(index.html)와 OBS 오버레이(overlay.html)
    rolldownOptions: {
      input: {
        main: 'index.html',
        overlay: 'overlay.html',
      },
    },
  },
});
