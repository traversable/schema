import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const _a = fileURLToPath(new URL('../../packages/json/src', import.meta.url))
const _b = fileURLToPath(new URL('../../packages/registry/src', import.meta.url))

console.log('_a', _a)
console.log('_b', _b)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@traversable/json': fileURLToPath(new URL('../../packages/json/src', import.meta.url)),
      '@traversable/registry': fileURLToPath(new URL('../../packages/registry/src', import.meta.url)),
      // "@traversable/json": ["packages/json/src/index.js"],
    }
  },
})
