import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  build: {
    outDir: 'build',
    rollupOptions: {
      input: {
        main: '/src/index.jsx',
      },
    },
  },

  server: {
    proxy: {
      '/api': 'http://localhost:5001',
    },
  },
});
