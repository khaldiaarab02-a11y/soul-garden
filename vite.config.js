import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Soul Garden — Vite configuration.
// GitHub Pages serves this project from /soul-garden/,
// therefore Vite must generate asset URLs relative to that base.
export default defineConfig({
  base: '/soul-garden/',

  plugins: [react()],

  server: {
    port: 5173,
    open: false,
  },
});
