import * as vi from 'vitest'
import { Eq } from '@traversable/derive-equals'
import { Seed } from '@traversable/schema-seed'
import { fc, test } from '@fast-check/vitest'
import { Equal, fn, URI } from '@traversable/registry'
import type { Algebra, Kind } from '@traversable/registry'


const seed = fc.letrec(Seed.seed({
  // exclude: ['never', 'object', 'tuple', 'union', 'intersect'],
}))

namespace Recursive {
  const fromSeed_ = <T>(x: Kind<Seed.Free, Equal<T>>): Equal<never> => {
    switch (true) {
      default: return (console.log('exhaustive', x), fn.exhaustive(x))
      case Seed.isNullary(x): return Eq.defaults[x]
      case Seed.isBoundable(x): return Eq.defaults[x[0]]
      case x[0] === URI.eq: return Eq.defaults[URI.eq]
      case x[0] === URI.array: return Eq.array(x[1])
      case x[0] === URI.record: return Eq.record(x[1])
      case x[0] === URI.optional: return Eq.optional(x[1])
      case x[0] === URI.tuple: return Eq.tuple(x[1])
      case x[0] === URI.union: return Eq.union(x[1])
      case x[0] === URI.intersect: return Eq.intersect(x[1])
      case x[0] === URI.object: return Eq.object(Object.fromEntries(x[1]))
    }
  }

  export const fromSeed: Algebra<Seed.Free, Equal<never>> = fromSeed_
}
export const fromSeed
  : (seed: Seed) => Equal<unknown>
  = fn.cata(Seed.Functor)(Recursive.fromSeed) as never

vi.describe.only('〖⛳️〗‹‹‹ ❲@traversable/derive-equals❳', () => {
  test.prop([seed.tree], {
    // numRuns: 10_000,
    examples: [
      [["@traversable/schema/URI::eq", {}]],
    ],
    endOnFailure: true,
  })('〖⛳️〗› ❲Eq#fromSchema❳', (seed) => {
    const schema = Seed.toSchema(seed)
    const eqFromSchema = Eq.fromSchema(schema)
    const eqFromSeed = fromSeed(seed)
    const arbitrary = Seed.toArbitrary(seed)

    vi.assert.isTrue(true)
    // const [l, r] = fc.sample(arbitrary, 2)

    // // parity
    // vi.assert.equal(eqFromSeed(l, l), eqFromSchema(l, l))
    // vi.assert.equal(eqFromSeed(r, r), eqFromSchema(r, r))

    // // reflexivity
    // vi.assert.equal(eqFromSeed(l, r), eqFromSeed(r, l))
    // vi.assert.equal(eqFromSchema(l, r), eqFromSchema(r, l))

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
