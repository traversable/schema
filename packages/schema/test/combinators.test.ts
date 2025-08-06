import * as vi from 'vitest'
import { t } from '@traversable/schema'
import * as fc from 'fast-check'
import * as Seed from './seed.js'

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema❳', () => {
  const natural = t.filter(t.integer, x => x >= 0)
  const varchar = t.filter(t.string)(x => 0x100 >= x.length)

  const arbitrary = fc.letrec(Seed.seed()).tree.chain((seed) => fc.constant([
    Seed.toSchema(seed),
    fc.constant(Seed.toJson(seed)),
  ] satisfies [any, any]))

  vi.describe('〖⛳️〗‹‹ ❲t.filter❳', () => {
    vi.test('〖⛳️〗‹ ❲t.filter(t.integer, q)❳: returns true when `q` is satisied', () => {
      fc.check(
        fc.property(
          fc.nat(),
          (x) => vi.assert.isTrue(natural(x))
        )
      )
    })

    vi.test('〖⛳️〗‹ ❲t.filter(t.integer, q)❳: returns false when `q` is not satisfied', () => {
      fc.check(
        fc.property(
          fc.nat().map((x) => -x).filter((x) => x !== 0),
          (x) => vi.assert.isFalse(natural(x))
        )
      )
    })

    vi.test('〖⛳️〗‹ ❲t.filter(t.string, q)❳: returns true when `q` is satisfied', () => {
      fc.check(
        fc.property(
          fc.string({ maxLength: 0x100 }),
          (x) => vi.assert.isTrue(varchar(x))
        )
      )
    })

    vi.test('〖⛳️〗‹ ❲t.filter(t.string, q)❳: returns false when `q` is not satisfied', () => {
      fc.check(
        fc.property(
          fc.string({ minLength: 0x101 }),
          (x) => vi.assert.isFalse(varchar(x))
        )
      )
    })

    /** 
     * See also: 
     * https://www.wisdom.weizmann.ac.il/~/oded/VO/mono1.pdf 
     */
    vi.test('〖⛳️〗‹ ❲t.filter(s, q)❳: is monotone cf. s ∩ q', () => {
      fc.check(
        fc.property(
          arbitrary, fc.func(fc.boolean()),
          ([s, x], q) => vi.assert.equal(t.filter(s, q)(x), s(x) && q(x))
        )
      )
    })
  })
})
