import { defineConfig, mergeConfig } from 'vitest/config'
import sharedConfig from '../../vite.config.js'

const localConfig = defineConfig({})

export default mergeConfig(sharedConfig, localConfig)