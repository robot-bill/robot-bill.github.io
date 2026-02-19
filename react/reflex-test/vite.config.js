import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/lab/reflex-test/',
  build: {
    outDir: '../../lab/reflex-test'
  }
})
