import * as vi from 'vitest'
import { fc, test } from '@fast-check/vitest'
import * as NodeJSUtil from 'node:util'

import type { Algebra, Kind } from '@traversable/registry'
import { Equal, fn, omitMethods, URI } from '@traversable/registry'
import { t } from '@traversable/schema'
import { Seed } from '@traversable/schema-seed'

import { Eq } from '@traversable/derive-equals'
// import '@traversable/schema-to-string/install'
import '@traversable/derive-equals/install'

const seed = fc.letrec(Seed.seed())
const seed2 = fc.letrec(Seed.seed({ exclude: ['never', 'intersect', 'any', 'unknown'] }))

namespace Recursive {
  const fromSeed_ = <T>(x: Kind<Seed.Free, Equal<T>>): Equal<never> => {
    switch (true) {
      default: return fn.exhaustive(x)
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

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/derive-equals❳', () => {
  test.prop([seed.tree], {
    // numRuns: 10_000,
    examples: [
      // [["@traversable/schema/URI::eq", {}]],
    ],
    endOnFailure: true,
  })('〖⛳️〗› ❲Eq.fromSchema❳', (seed) => {
    const schema = Seed.toSchema(seed)
    const eqFromSchema = Eq.fromSchema(schema)
    const eqFromSeed = fromSeed(seed)
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

// test.prop([fc.array(fc.string())], {})('[property test]: arrow, arrow', () => {
//   vi.assert.isTrue()

// })

let moduleStringArray = t.array(t.string)
let moduleStringStringArray = t.array(t.array(t.string))

moduleStringArray.equals([''], ['a'])
moduleStringStringArray.equals([['']], [['a']])

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/derive-equals❳', () => {
  let stringArray = t.array(t.string)
  let stringStringArray = t.array(t.array(t.string))

  vi.it('arrow, arrow', () => {

    vi.assert.isTrue(t.array(t.string).equals([], []))
    vi.assert.isTrue(t.array(t.string).equals([''], ['']))
    vi.assert.isFalse(t.array(t.string).equals([], ['']))
    vi.assert.isFalse(t.array(t.string).equals([''], []))

    vi.assert.isTrue(stringArray.equals([], []))
    vi.assert.isTrue(stringArray.equals([''], ['']))
    vi.assert.isFalse(stringArray.equals([], ['']))
    vi.assert.isFalse(stringArray.equals([''], []))

    vi.assert.isTrue(moduleStringArray.equals([], []))
    vi.assert.isTrue(moduleStringArray.equals([''], ['']))
    vi.assert.isFalse(moduleStringArray.equals([], ['']))
    vi.assert.isFalse(moduleStringArray.equals([''], []))

    vi.assert.isTrue(t.array(t.array(t.string)).equals([[]], [[]]))
    vi.assert.isTrue(t.array(t.array(t.string)).equals([['']], [['']]))
    vi.assert.isTrue(t.array(t.array(t.string)).equals([[''], []], [[''], []]))
    vi.assert.isTrue(t.array(t.array(t.string)).equals([[], ['']], [[], ['']]))
    vi.assert.isFalse(t.array(t.array(t.string)).equals([['']], [['a']]))
    vi.assert.isFalse(t.array(t.array(t.string)).equals([['']], [[''], []]))
    vi.assert.isFalse(t.array(t.array(t.string)).equals([[''], []], [[''], ['']]))

    vi.assert.isTrue(stringStringArray.equals([[]], [[]]))
    vi.assert.isTrue(stringStringArray.equals([['']], [['']]))
    vi.assert.isTrue(stringStringArray.equals([[''], []], [[''], []]))
    vi.assert.isTrue(stringStringArray.equals([[], ['']], [[], ['']]))
    vi.assert.isFalse(stringStringArray.equals([['']], [['a']]))
    vi.assert.isFalse(stringStringArray.equals([['']], [[''], []]))
    vi.assert.isFalse(stringStringArray.equals([[''], []], [[''], ['']]))

    vi.assert.isTrue(moduleStringStringArray.equals([[]], [[]]))
    vi.assert.isTrue(moduleStringStringArray.equals([['']], [['']]))
    vi.assert.isTrue(moduleStringStringArray.equals([[''], []], [[''], []]))
    vi.assert.isTrue(moduleStringStringArray.equals([[], ['']], [[], ['']]))
    vi.assert.isFalse(moduleStringStringArray.equals([['']], [['a']]))
    vi.assert.isFalse(moduleStringStringArray.equals([['']], [[''], []]))
    vi.assert.isFalse(moduleStringStringArray.equals([[''], []], [[''], ['']]))

  })

  vi.it('arrow, function expression', function () {

    vi.assert.isTrue(t.array(t.string).equals([], []))
    vi.assert.isTrue(t.array(t.string).equals([''], ['']))
    vi.assert.isFalse(t.array(t.string).equals([], ['']))
    vi.assert.isFalse(t.array(t.string).equals([''], []))

    vi.assert.isTrue(stringArray.equals([], []))
    vi.assert.isTrue(stringArray.equals([''], ['']))
    vi.assert.isFalse(stringArray.equals([], ['']))
    vi.assert.isFalse(stringArray.equals([''], []))

    vi.assert.isTrue(moduleStringArray.equals([], []))
    vi.assert.isTrue(moduleStringArray.equals([''], ['']))
    vi.assert.isFalse(moduleStringArray.equals([], ['']))
    vi.assert.isFalse(moduleStringArray.equals([''], []))

    vi.assert.isTrue(t.array(t.array(t.string)).equals([[]], [[]]))
    vi.assert.isTrue(t.array(t.array(t.string)).equals([['']], [['']]))
    vi.assert.isTrue(t.array(t.array(t.string)).equals([[''], []], [[''], []]))
    vi.assert.isTrue(t.array(t.array(t.string)).equals([[], ['']], [[], ['']]))
    vi.assert.isFalse(t.array(t.array(t.string)).equals([['']], [['a']]))
    vi.assert.isFalse(t.array(t.array(t.string)).equals([['']], [[''], []]))
    vi.assert.isFalse(t.array(t.array(t.string)).equals([[''], []], [[''], ['']]))

    vi.assert.isTrue(stringStringArray.equals([[]], [[]]))
    vi.assert.isTrue(stringStringArray.equals([['']], [['']]))
    vi.assert.isTrue(stringStringArray.equals([[''], []], [[''], []]))
    vi.assert.isTrue(stringStringArray.equals([[], ['']], [[], ['']]))
    vi.assert.isFalse(stringStringArray.equals([['']], [['a']]))
    vi.assert.isFalse(stringStringArray.equals([['']], [[''], []]))
    vi.assert.isFalse(stringStringArray.equals([[''], []], [[''], ['']]))

    vi.assert.isTrue(moduleStringStringArray.equals([[]], [[]]))
    vi.assert.isTrue(moduleStringStringArray.equals([['']], [['']]))
    vi.assert.isTrue(moduleStringStringArray.equals([[''], []], [[''], []]))
    vi.assert.isTrue(moduleStringStringArray.equals([[], ['']], [[], ['']]))
    vi.assert.isFalse(moduleStringStringArray.equals([['']], [['a']]))
    vi.assert.isFalse(moduleStringStringArray.equals([['']], [[''], []]))
    vi.assert.isFalse(moduleStringStringArray.equals([[''], []], [[''], ['']]))


  })

})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/derive-equals❳', function () {
  let stringArray = t.array(t.string)
  let stringStringArray = t.array(t.array(t.string))

  vi.it('function expression, arrow', () => {
    vi.assert.isTrue(t.array(t.string).equals([], []))
    vi.assert.isTrue(t.array(t.string).equals([''], ['']))
    vi.assert.isFalse(t.array(t.string).equals([], ['']))
    vi.assert.isFalse(t.array(t.string).equals([''], []))

    vi.assert.isTrue(stringArray.equals([], []))
    vi.assert.isTrue(stringArray.equals([''], ['']))
    vi.assert.isFalse(stringArray.equals([], ['']))
    vi.assert.isFalse(stringArray.equals([''], []))

    vi.assert.isTrue(moduleStringArray.equals([], []))
    vi.assert.isTrue(moduleStringArray.equals([''], ['']))
    vi.assert.isFalse(moduleStringArray.equals([], ['']))
    vi.assert.isFalse(moduleStringArray.equals([''], []))

    vi.assert.isTrue(t.array(t.array(t.string)).equals([[]], [[]]))
    vi.assert.isTrue(t.array(t.array(t.string)).equals([['']], [['']]))
    vi.assert.isTrue(t.array(t.array(t.string)).equals([[''], []], [[''], []]))
    vi.assert.isTrue(t.array(t.array(t.string)).equals([[], ['']], [[], ['']]))
    vi.assert.isFalse(t.array(t.array(t.string)).equals([['']], [['a']]))
    vi.assert.isFalse(t.array(t.array(t.string)).equals([['']], [[''], []]))
    vi.assert.isFalse(t.array(t.array(t.string)).equals([[''], []], [[''], ['']]))

    vi.assert.isTrue(stringStringArray.equals([[]], [[]]))
    vi.assert.isTrue(stringStringArray.equals([['']], [['']]))
    vi.assert.isTrue(stringStringArray.equals([[''], []], [[''], []]))
    vi.assert.isTrue(stringStringArray.equals([[], ['']], [[], ['']]))
    vi.assert.isFalse(stringStringArray.equals([['']], [['a']]))
    vi.assert.isFalse(stringStringArray.equals([['']], [[''], []]))
    vi.assert.isFalse(stringStringArray.equals([[''], []], [[''], ['']]))

    vi.assert.isTrue(moduleStringStringArray.equals([[]], [[]]))
    vi.assert.isTrue(moduleStringStringArray.equals([['']], [['']]))
    vi.assert.isTrue(moduleStringStringArray.equals([[''], []], [[''], []]))
    vi.assert.isTrue(moduleStringStringArray.equals([[], ['']], [[], ['']]))
    vi.assert.isFalse(moduleStringStringArray.equals([['']], [['a']]))
    vi.assert.isFalse(moduleStringStringArray.equals([['']], [[''], []]))
    vi.assert.isFalse(moduleStringStringArray.equals([[''], []], [[''], ['']]))
  })

  vi.it('function expression, function expression', function () {

    vi.assert.isTrue(t.array(t.string).equals([], []))
    vi.assert.isTrue(t.array(t.string).equals([''], ['']))
    vi.assert.isFalse(t.array(t.string).equals([], ['']))
    vi.assert.isFalse(t.array(t.string).equals([''], []))

    vi.assert.isTrue(stringArray.equals([], []))
    vi.assert.isTrue(stringArray.equals([''], ['']))
    vi.assert.isFalse(stringArray.equals([], ['']))
    vi.assert.isFalse(stringArray.equals([''], []))

    vi.assert.isTrue(moduleStringArray.equals([], []))
    vi.assert.isTrue(moduleStringArray.equals([''], ['']))
    vi.assert.isFalse(moduleStringArray.equals([], ['']))
    vi.assert.isFalse(moduleStringArray.equals([''], []))

    vi.assert.isTrue(t.array(t.array(t.string)).equals([[]], [[]]))
    vi.assert.isTrue(t.array(t.array(t.string)).equals([['']], [['']]))
    vi.assert.isTrue(t.array(t.array(t.string)).equals([[''], []], [[''], []]))
    vi.assert.isTrue(t.array(t.array(t.string)).equals([[], ['']], [[], ['']]))
    vi.assert.isFalse(t.array(t.array(t.string)).equals([['']], [['a']]))
    vi.assert.isFalse(t.array(t.array(t.string)).equals([['']], [[''], []]))
    vi.assert.isFalse(t.array(t.array(t.string)).equals([[''], []], [[''], ['']]))

    vi.assert.isTrue(stringStringArray.equals([[]], [[]]))
    vi.assert.isTrue(stringStringArray.equals([['']], [['']]))
    vi.assert.isTrue(stringStringArray.equals([[''], []], [[''], []]))
    vi.assert.isTrue(stringStringArray.equals([[], ['']], [[], ['']]))
    vi.assert.isFalse(stringStringArray.equals([['']], [['a']]))
    vi.assert.isFalse(stringStringArray.equals([['']], [[''], []]))
    vi.assert.isFalse(stringStringArray.equals([[''], []], [[''], ['']]))

    vi.assert.isTrue(moduleStringStringArray.equals([[]], [[]]))
    vi.assert.isTrue(moduleStringStringArray.equals([['']], [['']]))
    vi.assert.isTrue(moduleStringStringArray.equals([[''], []], [[''], []]))
    vi.assert.isTrue(moduleStringStringArray.equals([[], ['']], [[], ['']]))
    vi.assert.isFalse(moduleStringStringArray.equals([['']], [['a']]))
    vi.assert.isFalse(moduleStringStringArray.equals([['']], [[''], []]))
    vi.assert.isFalse(moduleStringStringArray.equals([[''], []], [[''], ['']]))

  })
})


vi.describe('〖⛳️〗‹‹‹ ❲@traversable/derive-equals❳', () => {
  let schemas = [
    t.never,
    t.unknown,
    t.any,
    t.void,
    t.null,
    t.undefined,
    t.symbol,
    t.boolean,
    t.integer,
    t.bigint,
    t.number,
    t.string,
    t.eq(1),
    t.optional(t.string),
    t.array(t.string),
    t.array(t.array(t.string)),
    t.record(t.string),
    t.record(t.record(t.string)),
    t.union(),
    t.union(t.string, t.number),
    t.intersect(t.object({ a: t.string }), t.object({ b: t.string })),
    t.intersect(t.object({ a: t.optional(t.string) }), t.object({ a: t.optional(t.string) })),
    t.tuple(),
    t.tuple(t.string),
    t.tuple(t.tuple()),
    t.tuple(t.tuple(t.string)),
    t.object({ a: t.string }),
    t.object({ a: t.optional(t.string) }),
    t.object({ a: t.object({ b: t.string }) }),
    t.object({ a: t.optional(t.object({ b: t.string })) }),
    t.object({ a: t.object({ b: t.optional(t.string) }) }),
    t.object({ a: t.optional(t.object({ b: t.optional(t.string) })) }),
    t.object({ a: t.string, c: t.array(t.boolean) }),
    t.object({ a: t.optional(t.string), c: t.array(t.boolean) }),
    t.object({ a: t.object({ b: t.string }), c: t.array(t.boolean) }),
    t.object({ a: t.optional(t.object({ b: t.string })), c: t.array(t.boolean) }),
    t.object({ a: t.object({ b: t.optional(t.string) }), c: t.array(t.boolean) }),
    t.object({ a: t.optional(t.object({ b: t.optional(t.string) })), c: t.array(t.boolean) }),
    t.object({ a: t.string, c: t.array(t.optional(t.boolean)) }),
    t.object({ a: t.optional(t.string), c: t.array(t.optional(t.boolean)) }),
    t.object({ a: t.object({ b: t.string }), c: t.array(t.optional(t.boolean)) }),
    t.object({ a: t.optional(t.object({ b: t.string })), c: t.array(t.optional(t.boolean)) }),
    t.object({ a: t.object({ b: t.optional(t.string) }), c: t.array(t.optional(t.boolean)) }),
    t.object({ a: t.optional(t.object({ b: t.optional(t.string) })), c: t.array(t.optional(t.boolean)) }),
  ] as t.LowerBound[]

  test.prop(
    [seed.tree, fc.jsonValue(), fc.jsonValue()], {
    endOnFailure: true,
    examples: [
    ]
    // numRuns: 10_000,
  })('', (seed, l, r) => {
    schemas.forEach((schema) => {
      // let schema = Seed.toSchema(seed)
      // let derivedEquals = Eq.fromSchema(schema)
      try {
        vi.assert.isTrue(schema.equals(l, l))
        vi.assert.isTrue(schema.equals(r, r))
        schema.equals(l, r)
        // vi.assert.equal(equals(l, r), NodeJSUtil.isDeepStrictEqual(l, r))
        // vi.assert.equal(equals(l, r), derivedEquals(l, r))
      } catch (e) {
        console.group(`\n\n\r ============== !EQ ============== \n\r`)
        console.debug(`equals:`, schema.equals, `\n\n\r`)
        console.debug(`l:`, l, `\n\n\r`)
        console.debug(`r:`, r, `\n\n\r`)
        // console.debug(`schema (for derivedEquals):`, omitMethods(schema), `\n\n\r`)
        // console.debug(`schema.toString()`, schema.toString(), `\n\n\r`)
        console.debug(`equals(l, r):`, schema.equals(l, r), `\n\n\r`)
        // console.debug(`derivedEquals(l, r):`, derivedEquals(l, r), `\n\n\r`)
        console.groupEnd()
        vi.assert.fail(t.has('message', t.string)(e) ? e.message : JSON.stringify(e, null, 2))
      }
    })
  })

})
