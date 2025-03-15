import * as vi from 'vitest'
import { Eq } from '@traversable/derive-equals'
import { Seed } from '@traversable/schema-seed'
import { fc, test } from '@fast-check/vitest'
import * as NodeJSUtil from 'node:util'

const seed = fc.letrec(Seed.seed({
  exclude: ['never'],
}))

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/derive-equals❳', () => {
  test.prop([seed.tree], {
    // numRuns: 10_000,
  })('〖⛳️〗› ❲Eq#fromSchema❳', (seed) => {
    const schema = Seed.toSchema(seed)
    const eqFromSchema = Eq.fromSchema(schema)
    const eqFromSeed = Eq.fromSeed(seed)
    const arbitrary = Seed.toArbitrary(seed)
    const [l, r] = fc.sample(arbitrary, 2)

    // parity
    vi.assert.equal(eqFromSeed(l, l), eqFromSchema(l, l))
    vi.assert.equal(eqFromSeed(r, r), eqFromSchema(r, r))

    // reflexivity
    vi.assert.equal(eqFromSeed(l, r), eqFromSeed(r, l))
    vi.assert.equal(eqFromSchema(l, r), eqFromSchema(r, l))

    /**
     * See also:
     * - the NodeJS docs for 
     * [`isDeepStrictEqual`](https://nodejs.org/api/util.html#utilisdeepstrictequalval1-val2)
     */

    // oracle
    // 
    // the reason we don't test against NodeJS's implementation when the result it `true`
    // is because `Eq.fromSeed` and `Eq.fromSchema` are optimized to only compare the set
    // of _known values_. When using these, it would be confusing if these equals functions
    // were identical for all of the specified values, but returned false because a property
    // we don't care about was different between the two objects.
    //
    // try {
    //   if (eqFromSeed(l, r) === false) vi.assert.isFalse(NodeJSUtil.isDeepStrictEqual(l, r))
    // } catch (e) {
    //   vi.assert.fail('\n\n'
    //     + 'FAILURE\n\n'
    //     + 'l: ' + JSON.stringify(l) + '\n\n'
    //     + 'r: ' + JSON.stringify(r) + '\n\n'
    //     + 'eqFromSeed(l, r): ' + eqFromSchema(l, r) + '\n\n'
    //     + 'NodeJSUtil.isDeepStrictEqual(l, r): ' + NodeJSUtil.isDeepStrictEqual(l, r)) + '\n\n'
    // }
  })
})
