import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: '[name]-[hash].js',
        chunkFileNames: '[name]-[hash].js',
        format: 'iife',
      },
    },
  },
  optimizeDeps: {
    include: ['../../serviceWorker'], // Include the Web Worker for optimization
  },
})
