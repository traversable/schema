import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // '@traversable/registry': fileURLToPath(new URL('../../packages/registry/src', import.meta.url)),
      // '@traversable/schema': fileURLToPath(new URL('../../packages/schema/src', import.meta.url)),
    }
  },
})
