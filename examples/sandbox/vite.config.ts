import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@traversable/schema-to-validator': fileURLToPath(new URL('../../packages/schema-to-validator/src', import.meta.url)),
      '@traversable/json': fileURLToPath(new URL('../../packages/json/src', import.meta.url)),
      '@traversable/registry': fileURLToPath(new URL('../../packages/registry/src', import.meta.url)),
      '@traversable/schema': fileURLToPath(new URL('../../packages/schema/src', import.meta.url)),
      '@traversable/schema-codec': fileURLToPath(new URL('../../packages/schema-codec/src', import.meta.url)),
      '@traversable/schema-deep-equal': fileURLToPath(new URL('../../packages/schema-deep-equal/src', import.meta.url)),
      '@traversable/schema-seed': fileURLToPath(new URL('../../packages/schema-seed/src', import.meta.url)),
      '@traversable/schema-to-json-schema': fileURLToPath(new URL('../../packages/schema-to-json-schema/src', import.meta.url)),
      '@traversable/schema-to-string': fileURLToPath(new URL('../../packages/schema-to-string/src', import.meta.url)),
    }
  },
})
