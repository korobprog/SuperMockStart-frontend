import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';

// Конфигурация для Telegram разработки
export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      config: './tailwind.config.js',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 4042,
    https: {
      key: fs.readFileSync('./ssl/localhost-key.pem'),
      cert: fs.readFileSync('./ssl/localhost.pem'),
    },
    headers: {
      'Content-Security-Policy':
        "frame-ancestors 'self' https://127.0.0.1:4042 https://oauth.telegram.org/; frame-src 'self' https://oauth.telegram.org/ https://telegram.org/;",
    },
  },
});
