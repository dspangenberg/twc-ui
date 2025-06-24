import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./resources/js/tests/setup.ts'],
    globals: true,
    // Isoliere Tests von der Hauptanwendung
    isolate: true,
    // Nur Test-Dateien einschließen
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/vendor/**',
      '**/bootstrap/**',
      '**/public/**'
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './resources/js'),
    },
  },
  // Separate von Vite dev server
  server: {
    port: 5174, // Anderer Port als Vite dev server
  }
})
