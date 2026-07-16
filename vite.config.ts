import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Keep inherited internal HTML/assets in the repository as source material,
  // but never copy them into the customer-facing production deployment.
  publicDir: false,
  server: {
    watch: {
      // Large import dumps can lock files and crash Vite's watcher on Windows
      ignored: [
        '**/.tmp-*/**',
        '**/.local-masters/**',
        '**/_private/**',
      ],
    },
    proxy: {
      '/api/asset-foundry': {
        target: 'http://localhost:3456',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        // Customer product only. Internal generators are not public routes.
        app: resolve(__dirname, 'index.html'),
      },
    },
  },
})
