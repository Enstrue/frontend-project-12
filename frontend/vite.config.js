import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5002,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true, // Это поможет проксировать запросы через origin.
        rewrite: (path) => path.replace(/^\/api/, '/api/v1'), // Прокси запросы перенаправляются на `/api/v1`.
      },
      '/socket.io': {
        target: 'ws://localhost:5001',
        ws: true,
        rewriteWsOrigin: true,
      },
    },
  },
});
