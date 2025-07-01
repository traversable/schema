import * as vi from 'vitest'
import { fc, test } from '@fast-check/vitest'

import { Cache, Json } from '@traversable/json'
import { symbol } from '@traversable/registry'

import { Arbitrary } from './arbitrary.js'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/json❳', () => {
  const createBadCache = Cache.new as any
  const index = { depth: 0, path: [] }

  vi.it('〖⛳️〗› ❲Json#Functor❳: Functor.map preserves structure', () => {
    type Root = { a: 1, b?: { c: Root } }
    let root: Root = { a: 1 }
    root.b = { c: root }
    const cache = Cache.new(root)
    vi.assert.equal(cache(root, index), symbol.cache_hit)
    vi.assert.equal(cache(root.b, index), symbol.cache_hit)
    vi.assert.equal(cache(root.b.c, index), root)
    vi.assert.throws(() => createBadCache(root, ['BAD_PATH'])(root, index), `'#/BAD_PATH'`)
  })

  test.prop(
    [fc.dictionary(fc.string(), Arbitrary.object)], {
    // numRuns: 10_000,
    examples: [
      [{ "toString": {} }]
    ]
  })(
    '〖⛳️〗› ❲Json#Functor❳: Functor.map preserves structure',
    (json) => {
      const CACHE_KEY = 'cyclical__'
      const cachedKeys = Object.keys(json).map((k) => CACHE_KEY + k)
      const cached = Cache.new(json)
      for (let key of cachedKeys)
        void (json[key] = json);

      cached(json, index)

      for (let key in json) {
        const value = cached(json[key], index)

        if (cachedKeys.includes(key))
          vi.assert.notStrictEqual(symbol.cache_hit, value)

        else vi.assert.equal(value, symbol.cache_hit)
      }
    }
  );
})
