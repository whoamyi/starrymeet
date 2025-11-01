import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: process.env.VERCEL ? 'dist' : '../public/react',
    emptyOutDir: true,
  },
  base: process.env.VERCEL ? '/' : '/react/',
  server: {
    proxy: {
      '/api': {
        target: 'https://starrymeet-backend.onrender.com',
        changeOrigin: true,
      }
    }
  }
})
