import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Soul Garden — deployed at https://khaldiaarab02-a11y.github.io/soul-garden/
// Every asset reference in the app MUST be relative to this base path.
export default defineConfig({
  plugins: [react()],
  base: '/soul-garden/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
})
