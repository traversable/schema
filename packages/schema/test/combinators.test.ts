import * as vi from 'vitest'
import { t } from '@traversable/schema'
import { fc, test } from '@fast-check/vitest'
import * as Seed from './seed.js'

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema❳', () => {
  const natural = t.filter(t.integer, x => x >= 0)
  const varchar = t.filter(t.string)(x => 0x100 >= x.length)

  const arbitrary = fc.letrec(Seed.seed()).tree.chain((seed) => fc.constant([
    Seed.toSchema(seed),
    fc.constant(Seed.toJson(seed)),
  ] satisfies [any, any]))

  vi.describe('〖⛳️〗‹‹ ❲t.filter❳', () => {
    test.prop([fc.nat()])(
      '〖⛳️〗‹ ❲t.filter(t.integer, q)❳: returns true when `q` is satisied',
      (x) => vi.assert.isTrue(natural(x))
    )
    test.prop([fc.nat().map((x) => -x).filter((x) => x !== 0)])(
      '〖⛳️〗‹ ❲t.filter(t.integer, q)❳: returns false when `q` is not satisfied',
      (x) => vi.assert.isFalse(natural(x))
    )

    test.prop([fc.string({ maxLength: 0x100 })])(
      '〖⛳️〗‹ ❲t.filter(t.string, q)❳: returns true when `q` is satisfied',
      (x) => vi.assert.isTrue(varchar(x))
    )
    test.prop([fc.string({ minLength: 0x101 })], {})(
      '〖⛳️〗‹ ❲t.filter(t.string, q)❳: returns false when `q` is not satisfied',
      (x) => vi.assert.isFalse(varchar(x))
    )

    test.prop([arbitrary, fc.func(fc.boolean())])(
      /** 
       * See also: 
       * https://www.wisdom.weizmann.ac.il/~/oded/VO/mono1.pdf 
       */
      '〖⛳️〗‹ ❲t.filter(s, q)❳: is monotone cf. s ∩ q',
      ([s, x], q) => vi.assert.equal(t.filter(s, q)(x), s(x) && q(x))
    )
  })
})
