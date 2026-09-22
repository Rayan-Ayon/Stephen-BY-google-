import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');

    // When building the secondary coaching-dashboard zone, assets must be
    // served under /workspace so that Vercel multi-zone rewrites work correctly.
    const isWorkspaceBuild = env.VITE_BUILD_MODE === 'workspace';

    return {
      // Base path: '/workspace/' for the secondary zone build, '/' for primary.
      base: isWorkspaceBuild ? '/workspace/' : '/',

      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api/ielts/ws': {
            target: 'ws://localhost:8000',
            ws: true,
          },
          '/api': {
            target: 'http://localhost:8000',
            changeOrigin: true,
          }
        }
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
