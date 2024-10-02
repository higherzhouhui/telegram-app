import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react-swc';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { nodePolyfills } from "vite-plugin-node-polyfills";
// import compression from 'vite-plugin-compression';

import path from 'path';

// Define a function to parse the path
function _resolve(dir: string) {
  return path.resolve(__dirname, dir);
}

const phaserMsg = () => {
  return {
    name: 'phaserMsg',
    buildStart() {
      process.stdout.write(`Building for production...\n`);
    },
    buildEnd() {
      const line = "---------------------------------------------------------";
      const msg = `❤️❤️❤️ Tell us about your game! - games@phaser.io ❤️❤️❤️`;
      process.stdout.write(`${line}\n${msg}\n${line}\n`);

      process.stdout.write(`✨ Done ✨\n`);
    }
  }
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
    phaserMsg(),
    nodePolyfills(),
    // compression({
    //   verbose: true, // Whether to output compression results in the console
    //   disable: false, // Whether to disable compression
    //   threshold: 10240, // Size threshold for compressed files (in bytes)
    //   algorithm: 'gzip', // Compression algorithm
    //   ext: '.gz', // Suffix name of the compressed file
    //   deleteOriginFile: true, // Whether to delete the original file
    // })
  ],
  build: {
    outDir: 'docs',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'],
          aelfSdk: ['aelf-sdk'],
          antd: ['antd'],
          login: ['@aelf-web-login/utils'],
          loginbase: ['@aelf-web-login/wallet-adapter-base'],
          loginbridge: ['@aelf-web-login/wallet-adapter-bridge'],
          loginelf: ['@aelf-web-login/wallet-adapter-night-elf'],
          loginaa: ['@aelf-web-login/wallet-adapter-portkey-aa'],
          logindiscover: ['@aelf-web-login/wallet-adapter-portkey-discover'],
          loginreact: ['@aelf-web-login/wallet-adapter-react'],
        },
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        passes: 2,
      },
      mangle: true,
      format: {
        comments: false
      }
    },
  },
  server: {
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