import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node',
    include: ['apps/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['apps/api/src/server/**/*.ts'],
      exclude: ['node_modules/**', 'dist/**']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './apps/web/src')
    }
  }
});
