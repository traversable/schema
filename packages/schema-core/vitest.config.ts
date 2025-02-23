import { defineConfig, mergeConfig } from 'vitest/config'
import sharedConfig from '../../vitest.config.js'

const localConfig = defineConfig({
  test: {
    includeSource: ['packages/schema-core/src/**/*.ts']
  },
  define: {
    'import.meta.vitest': 'undefined',
  },
})

export default mergeConfig(sharedConfig, localConfig)