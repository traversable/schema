import * as vi from 'vitest'
import pkg from '../package.json' with { type: 'json' }
import { VERSION } from '@traversable/schema-jit-compiler'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-jit-compiler❳', () => {
  vi.it('〖⛳️〗› ❲schemaJitCompiler#VERSION❳', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(VERSION, expected)
  })
})
