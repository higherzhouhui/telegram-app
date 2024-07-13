import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// 定义一个函数来解析路径
function _resolve(dir: string) {
  return path.resolve(__dirname, dir);
}

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'docs'
  },
  // @ts-ignore
  // base: process.env.GH_PAGES ? '/telegram-mini/' : './',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8085', // 目标服务器地址
        changeOrigin: true, // 是否改变源地址
        rewrite: (path) => path.replace(/^\/api/, '/api/'), // 重写路径
      }
    },
    fs: {
      allow: ['../sdk', './'],
    },
  },
  resolve: {
    alias: {
      '@': _resolve('src'),
    },
  },
})
