import * as vi from 'vitest'
import * as fc from 'fast-check'

import { Cache } from '@traversable/json'
import { symbol } from '@traversable/registry'

import { Arbitrary } from './arbitrary.js'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/json❳', () => {
  const createBadCache = Cache.new as any
  const index = { depth: 0, path: [] }

  vi.test('〖⛳️〗› ❲Json#Functor❳: Functor.map preserves structure', () => {
    type Root = { a: 1, b?: { c: Root } }
    let root: Root = { a: 1 }
    root.b = { c: root }
    const cache = Cache.new(root)
    vi.assert.equal(cache(root, index), symbol.cache_hit)
    vi.assert.equal(cache(root.b, index), symbol.cache_hit)
    vi.assert.equal(cache(root.b.c, index), root)
    vi.assert.throws(() => createBadCache(root, ['BAD_PATH'])(root, index), `'#/BAD_PATH'`)
  })

  vi.test('〖⛳️〗› ❲Json#Functor❳: Functor.map preserves structure', () => {
    fc.check(
      fc.property(
        fc.dictionary(fc.string(), Arbitrary.object), (json) => {
          const CACHE_KEY = 'cyclical__'
          const cachedKeys = Object.keys(json).map((k) => CACHE_KEY + k)
          const cached = Cache.new(json)
          for (let key of cachedKeys)
            void (json[key] = json)

          cached(json, index)

          for (let key in json) {
            const value = cached(json[key], index)

            if (cachedKeys.includes(key))
              vi.assert.notStrictEqual(symbol.cache_hit, value)

            else vi.assert.equal(value, symbol.cache_hit)
          }
        }
      ), {
      examples: [
        [{ "toString": {} }]
      ],
      // numRuns: 10_000,
    }
    )
  })
})
