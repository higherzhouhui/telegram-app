import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths';
import react from "@vitejs/plugin-react";
import basicSsl from '@vitejs/plugin-basic-ssl';
import { nodePolyfills } from "vite-plugin-node-polyfills";

import path from 'path';

// Define a function to parse the path
function _resolve(dir: string) {
  return path.resolve(__dirname, dir);
}

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [
    // https://npmjs.com/package/@vitejs/plugin-react-swc
    react(),
    // Allows using the compilerOptions.paths property in tsconfig.json.
    // https://www.npmjs.com/package/vite-tsconfig-paths
    tsconfigPaths(),
    // Allows using self-signed certificates to run the dev server using HTTPS.
    // https://www.npmjs.com/package/@vitejs/plugin-basic-ssl
    basicSsl(),
    nodePolyfills(),
  ],
  build: {
    outDir: 'docs'
  },
  // @ts-ignore
  // base: process.env.GH_PAGES ? '/telegram-mini/' : './',
  server: {
    port: 6699,
    proxy: {
      '/api': {
        target: 'http://localhost:5174', // Target server address
        // target: 'https://test.forkfrenpet.com', // Target server address
        changeOrigin: true, // Whether to change the source address
        rewrite: (path) => path.replace(/^\/api/, '/api/'), // Rewrite the path
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
  publicDir: './public',
})