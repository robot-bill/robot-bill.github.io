import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/lab/memory-vault/',
  build: {
    outDir: '../../lab/memory-vault'
  }
})
