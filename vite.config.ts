import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // CRITICAL: Makes paths relative so it works on any hosting (Netlify/Vercel)
  server: {
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  },
  define: {
    'process.env': process.env
  }
});