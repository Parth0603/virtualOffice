import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,
    host: '0.0.0.0',
    proxy: {
      '/socket.io': {
        target: 'http://localhost:4001',
        ws: true,
        changeOrigin: true
      },
      '/api': {
        target: 'http://localhost:4001',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1200
  }
});
