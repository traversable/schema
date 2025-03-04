import * as vi from 'vitest'
import { Eq } from '@traversable/derive-equals'
import { Seed } from '@traversable/schema-seed'
import { fc, test } from '@fast-check/vitest'
import * as NodeAssert from 'node:assert'

const seed = fc.letrec(Seed.seed({
  exclude: ['never'],
}))

const deepStrictEqual = <T>(l: T, r: T): boolean => {
  try { NodeAssert.deepStrictEqual(l, r); return true }
  catch (e) { return false }
}

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/derive-equals❳', () => {
  test.prop([seed.tree], {
    // numRuns: 10_000,
  })('〖⛳️〗› ❲Eq#fromSchema❳', (seed) => {
    const schema = Seed.toSchema(seed)
    const eqFromSchema = Eq.fromSchema(schema)
    const eqFromSeed = Eq.fromSeed(seed)
    const arbitrary = Seed.toArbitrary(seed)
    const [l, r] = fc.sample(arbitrary, 2)

    /**
     * Test for parity between the different ways to derive an `Eq` function
     * 
     * See also:
     * - {@link Eq.fromSchema `Eq.fromSchema`}
     * - {@link Eq.fromSeed `Eq.fromSeed`}
     */
    vi.assert.equal(eqFromSeed(l, l), eqFromSchema(l, l))
    vi.assert.equal(eqFromSeed(r, r), eqFromSchema(r, r))
    vi.assert.equal(eqFromSeed(l, r), eqFromSchema(l, r))

    /**
     * Test for parity between `Eq` functions generated by this library, and the built-in 
     * `deepStrictEqual` function from `'node:assert'`.
     * 
     * See also:
     * - the docs for 
     * [`deepStrictEqual`](https://nodejs.org/api/assert.html#assertdeepstrictequalactual-expected-message)
     */
    vi.assert.equal(eqFromSchema(l, l), deepStrictEqual(l, l))
    vi.assert.equal(eqFromSchema(r, r), deepStrictEqual(r, r))
    vi.assert.equal(eqFromSchema(l, r), deepStrictEqual(l, r))
  })
})
