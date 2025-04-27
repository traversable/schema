import * as path from 'node:path'
import { defineConfig } from 'vitest/config'
import { PACKAGES } from './config/__generated__/package-list.js'
import { default as REPO } from './config/__generated__/repo.json'
import { fileURLToPath } from 'node:url'

function createAlias(pkgName: string) {
  return {
    [`${REPO.scope}/${pkgName}/test`]: path.join(__dirname, 'packages', pkgName, 'test'),
    [`${REPO.scope}/${pkgName}`]: path.join(__dirname, 'packages', pkgName, 'src'),
  }
}

let ALIASES = [...PACKAGES]
  .map(v => v.slice('packages/'.length))
  .map(createAlias)
  .reduce((acc, cur) => ({ ...acc, ...cur }), {})

export default defineConfig({
  esbuild: {
    target: 'es2022',
  },
  build: {},
  test: {
    alias: ALIASES,
    coverage: {
      include: [
        'packages/schema/src/**.ts',
      ],
      enabled: true,
      reporter: ['html'],
      reportsDirectory: './config/coverage',
      thresholds: { [100]: true },
    },
    disableConsoleIntercept: true,
    fakeTimers: { toFake: undefined },
    /** 
     * To run typelevel benchmarks:
     * 
     * 1. uncomment these lines
     * 2. add back the `include` line in {@link examples/benchmarks/vite.config.ts}
     * 3. run `pnpm test`
     */
    // globalSetup: [fileURLToPath(new URL('./setupVitest.ts', import.meta.url))],
    // include: ['test/**/*.test.ts'],
    printConsoleTrace: true,
    sequence: { concurrent: true },
    workspace: [
      'examples/*',
      'packages/*',
      'bin',
    ],
  },
})

