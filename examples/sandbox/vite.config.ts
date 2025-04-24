import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@traversable/derive-codec': fileURLToPath(new URL('../../packages/derive-codec/src', import.meta.url)),
      '@traversable/derive-equals': fileURLToPath(new URL('../../packages/derive-equals/src', import.meta.url)),
      '@traversable/derive-validators': fileURLToPath(new URL('../../packages/derive-validators/src', import.meta.url)),
      '@traversable/json': fileURLToPath(new URL('../../packages/json/src', import.meta.url)),
      '@traversable/registry': fileURLToPath(new URL('../../packages/registry/src', import.meta.url)),
      '@traversable/schema-core': fileURLToPath(new URL('../../packages/schema-core/src', import.meta.url)),
      '@traversable/schema-seed': fileURLToPath(new URL('../../packages/schema-seed/src', import.meta.url)),
      '@traversable/schema-to-json-schema': fileURLToPath(new URL('../../packages/schema-to-json-schema/src', import.meta.url)),
      '@traversable/schema-to-string': fileURLToPath(new URL('../../packages/schema-to-string/src', import.meta.url)),
    }
  },
})
