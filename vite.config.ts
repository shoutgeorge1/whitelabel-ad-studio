import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Serve only production static assets. Inherited internal HTML under public/
  // stays in the repo as source material and is never deployed.
  publicDir: 'static',
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
