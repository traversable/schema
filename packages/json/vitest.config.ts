import { defineConfig, mergeConfig } from 'vitest/config'
import sharedConfig from '../../vitest.config.js'

const localConfig = defineConfig({})

export default mergeConfig(sharedConfig, localConfig)