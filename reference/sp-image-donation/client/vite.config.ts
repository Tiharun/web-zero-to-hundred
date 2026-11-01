/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// 개발 서버(npm run dev)에서 API·이미지·SignalR 요청을 ASP.NET Core 서버로 넘긴다
const apiServer = 'http://localhost:5080'

export default defineConfig({
  plugins: [react()],
  build: {
    // 빌드 결과를 서버의 wwwroot에 바로 넣는다 → 서버 하나가 화면과 API를 같은 주소로 제공
    outDir: '../server/ImageDonation.Api/wwwroot',
    emptyOutDir: true,
    rolldownOptions: {
      // 페이지 두 개: React 앱(index.html)과 OBS 오버레이(overlay.html)
      input: { main: 'index.html', overlay: 'overlay.html' },
    },
  },
  server: {
    proxy: {
      '/api': apiServer,
      '/media': apiServer,
      '/hubs': { target: apiServer, ws: true }, // ws: SignalR의 웹소켓도 넘긴다
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
