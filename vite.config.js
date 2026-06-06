import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// All /api and /uploads requests are proxied to the backend, so the
// browser only ever talks to ONE origin (localhost:5173). This removes
// CORS and cross-port connection issues entirely — and mirrors the
// production setup, where nginx does the same job.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
      },
    },
  },
})