import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    svgr({ include: '**/*.svg' }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  // server: { 추후 백엔드 설정에 따라 변경
  //   port: 3000,
  // },
});
