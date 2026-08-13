import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Soul Garden — Vite configuration.
// Kept intentionally minimal for TASK 001. Future tasks may add
// asset-handling plugins (audio, image optimization) as the
// audio/ and data/ systems grow.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
  },
});
