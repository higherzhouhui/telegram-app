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
  resolve: {
    alias: {
      '@': _resolve('src'),
    },
  },
})
