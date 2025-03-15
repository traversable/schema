import * as vi from 'vitest'
import { fc, test } from '@fast-check/vitest'

import { symbol } from '@traversable/registry'
import { Predicate, Predicate as q } from '@traversable/schema'
import * as Seed from './seed.js'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema❳', () => {
  const arbitrary = Seed.predicateWithData({
    eq: {},
    optionalTreatment: 'exactOptional',
    treatArraysAsObjects: false,
  }, {
    exclude: ['any', 'unknown', 'never', 'intersect']
  })

  test.prop([arbitrary])(
    '〖⛳️〗‹ ❲Predicate❳: combinators return `true` given valid data, `false` given invalid data',
    ({ badData, data, predicate }) => (
      vi.assert.isTrue(predicate(data)),
      vi.assert.isFalse(predicate(badData))
    )
  )

  vi.it('〖⛳️〗‹ ❲Predicate.hasOwn❳', () => {
    function func() { }
    func.ABC = 'ABC'
    func[0] = 0
    func[symbol.tag] = symbol.tag

    vi.assert.isTrue(Predicate.hasOwn(func, 'ABC'))
    vi.assert.isTrue(Predicate.hasOwn(func, 0))
    vi.assert.isTrue(Predicate.hasOwn(func, symbol.tag))
    vi.assert.isFalse(Predicate.hasOwn(func, 'DEF'))
    vi.assert.isFalse(Predicate.hasOwn(func, 1))
    vi.assert.isFalse(Predicate.hasOwn(func, symbol.bad_data))

    vi.assert.isTrue(Predicate.hasOwn([100, 200, 300], 1))
    vi.assert.isFalse(Predicate.hasOwn([100, 200, 300], 4))
    vi.assert.isFalse(Predicate.hasOwn([100, 200, 300], 'concat'))

    vi.assert.isTrue(Predicate.hasOwn({ 'GHI': null, [-1]: void 0, [symbol.tag]: void 0 }, 'GHI'))
    vi.assert.isTrue(Predicate.hasOwn({ 'GHI': null, [-1]: void 0, [symbol.tag]: void 0 }, -1))
    vi.assert.isTrue(Predicate.hasOwn({ 'GHI': null, [-1]: void 0, [symbol.tag]: void 0 }, symbol.tag))
    vi.assert.isFalse(Predicate.hasOwn({ 'GHI': null, [-1]: void 0, [symbol.tag]: void 0 }, 'JKL'))
    vi.assert.isFalse(Predicate.hasOwn({ 'GHI': null, [-1]: void 0, [symbol.tag]: void 0 }, -2))
    vi.assert.isFalse(Predicate.hasOwn({ 'GHI': null, [-1]: void 0, [symbol.tag]: void 0 }, symbol.bad_data))

  })
})
