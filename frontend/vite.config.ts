import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  server: {
    host: true, // 외부 IP에서 접근 가능하도록 설정
    port: 20580, // Vite 서버 포트 설정
    strictPort: true, // 지정한 포트를 강제
    cors: true, // CORS 활성화
  },
});
