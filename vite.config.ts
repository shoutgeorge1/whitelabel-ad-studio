import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
        // Ad Production site is static HTML under public/ + root motion lab.
        // Root index.html redirects to /studio.html.
        motionLab: resolve(__dirname, 'motion-concept-lab.html'),
      },
    },
  },
})
