import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { defineConfig as defineVitestConfig } from 'vitest/config'; // Import defineConfig from vitest

dotenv.config();

export default defineVitestConfig(({ mode }) => ({
  base: mode === 'production' ? '/Network-Function-Virtualization---NFV--Orchestration-Tool/' : '/',
  plugins: [react()],
  server: {
    proxy: {
      '/api/auth': {
        target: process.env.VITE_API_URL || 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom', // or 'happy-dom', see https://vitest.dev/guide/features.html#dom-environment
    globals: true, // This enables globals like describe, it, expect
    setupFiles: './vitest.setup.ts', // Setup file for @testing-library/jest-dom
  },
}));
