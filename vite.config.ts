import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Функция для получения переменных окружения
const getApiUrl = () => {
  return process.env.VITE_API_URL;
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic', // Используем современный JSX transform
    }),
  ],
  // resolve: {
  //   alias: [
  //     {
  //       find: '@',
  //       replacement: path.resolve(__dirname, 'src'),
  //     },
  //   ],
  // },
  build: {
    // Оптимизации для продакшена
    target: 'es2015',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: getApiUrl(),
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log(
              'Received Response from the Target:',
              proxyRes.statusCode,
              req.url
            );
          });
        },
      },
    },
  },
});
