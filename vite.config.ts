import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carga las variables de entorno para que Vercel las pueda leer
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    base: '/', // En Vercel usamos la raíz '/'
    server: {
      host: true
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false
    },
    define: {
      // Esto asegura que process.env.API_KEY funcione en la app construida
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});