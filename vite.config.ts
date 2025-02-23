import * as path from 'node:path'
import { defineConfig } from 'vitest/config'
import { PACKAGES } from './config/__generated__/package-list.js'
import { default as REPO } from './config/__generated__/repo.json'

function createAlias(pkgName: string) {
  return {
    [`${REPO.scope}/${pkgName}/test`]: path.join(__dirname, 'packages', pkgName, 'test'),
    [`${REPO.scope}/${pkgName}`]: path.join(__dirname, 'packages', pkgName, 'src'),
  }
}

export default defineConfig({
  esbuild: {
    target: 'es2020',
  },
  build: {
  },
  test: {
    alias: PACKAGES
      .map(v => v.slice('packages/'.length))
      .map(createAlias)
      .reduce((acc, cur) => ({ ...acc, ...cur }), {}),
    fakeTimers: { toFake: undefined },
    // reporters: [['default', { summary: false }]],
    printConsoleTrace: true,
    disableConsoleIntercept: true,
    sequence: { concurrent: true },
    workspace: [
      'packages/*',
      'bin',
    ],
  },
})

