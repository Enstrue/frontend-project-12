import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',  // Измените папку сборки на `build`
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5001', // Прокси для запросов API
    },
  },
});
