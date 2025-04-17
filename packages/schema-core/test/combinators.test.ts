import * as vi from 'vitest'
import { t } from '@traversable/schema-core'
import { fc, test } from '@fast-check/vitest'
import * as Seed from './seed.js'

/**
 * (go: fc.LetrecTypedTie<Builder>) => { 
 * 
 *   never: Arbitrary<"@traversable/schema-core/URI::never">; 
 *   any: Arbitrary<"@traversable/schema-core/URI::any">; 
 *   unknown: Arbitrary<"@traversable/schema-core/URI::unknown">; 
 *   void: Arbitrary<"@traversable/schema-core/URI::void">; 
 *   null: Arbitrary<"@traversable/schema-core/URI::null">; 
 *   undefined: Arbitrary<"@traversable/schema-core/URI::undefined">; 
 *   symbol: Arbitrary<"@traversable/schema-core/URI::symbol">; 
 *   boolean: Arbitrary<"@traversable/schema-core/URI::boolean">; 
 *   bigint: Arbitrary<"@traversable/schema-core/URI::bigint">; 
 *   number: Arbitrary<"@traversable/schema-core/URI::number">; 
 *   string: Arbitrary<"@traversable/schema-core/URI::string">; 
 *   eq: Arbitrary<["@traversable/schema-core/URI::eq", Fixpoint]>; 
 *   optional: Arbitrary<["@traversable/schema-core/URI::optional", "@traversable/schema-core/URI::never" | "@traversable/schema-core/URI::any" | "@traversable/schema-core/URI::unknown" | "@traversable/schema-core/URI::void" | "@traversable/schema-core/URI::null" | "@traversable/schema-core/URI::undefined" | "@traversable/schema-core/URI::symbol" | "@traversable/schema-core/URI::boolean" | "@traversable/schema-core/URI::bigint" | "@traversable/schema-core/URI::number" | "@traversable/schema-core/URI::string" | [tag: "@traversable/schema-core/URI::object", seed: [k: string, Fixpoint][]] | [tag: "@traversable/schema-core/URI::eq", seed: Fixpoint] | [tag: "@traversable/schema-core/URI::array", seed: Fixpoint] | [tag: "@traversable/schema-core/URI::record", seed: Fixpoint] | [tag: "@traversable/schema-core/URI::optional", seed: Fixpoint] | [tag: "@traversable/schema-core/URI::tuple", seed: readonly Fixpoint[]] | [tag: "@traversable/schema-core/URI::union", seed: readonly Fixpoint[]] | [tag: "@traversable/schema-core/URI::intersect", seed: readonly Fixpoint[]]]>; 
 *   array: Arbitrary<["@traversable/schema-core/URI::array", "@traversable/schema-core/URI::never" | "@traversable/schema-core/URI::any" | "@traversable/schema-core/URI::unknown" | "@traversable/schema-core/URI::void" | "@traversable/schema-core/URI::null" | "@traversable/schema-core/URI::undefined" | "@traversable/schema-core/URI::symbol" | "@traversable/schema-core/URI::boolean" | "@traversable/schema-core/URI::bigint" | "@traversable/schema-core/URI::number" | "@traversable/schema-core/URI::string" | [tag: "@traversable/schema-core/URI::object", seed: [k: string, Fixpoint][]] | [tag: "@traversable/schema-core/URI::eq", seed: Fixpoint] | [tag: "@traversable/schema-core/URI::array", seed: Fixpoint] | [tag: "@traversable/schema-core/URI::record", seed: Fixpoint] | [tag: "@traversable/schema-core/URI::optional", seed: Fixpoint] | [tag: "@traversable/schema-core/URI::tuple", seed: readonly Fixpoint[]] | [tag: "@traversable/schema-core/URI::union", seed: readonly Fixpoint[]] | [tag: "@traversable/schema-core/URI::intersect", seed: readonly Fixpoint[]]]>; 
 *   record: Arbitrary<["@traversable/schema-core/URI::record", "@traversable/schema-core/URI::never" | "@traversable/schema-core/URI::any" | "@traversable/schema-core/URI::unknown" | "@traversable/schema-core/URI::void" | "@traversable/schema-core/URI::null" | "@traversable/schema-core/URI::undefined" | "@traversable/schema-core/URI::symbol" | "@traversable/schema-core/URI::boolean" | "@traversable/schema-core/URI::bigint" | "@traversable/schema-core/URI::number" | "@traversable/schema-core/URI::string" | [tag: "@traversable/schema-core/URI::object", seed: [k: string, Fixpoint][]] | [tag: "@traversable/schema-core/URI::eq", seed: Fixpoint] | [tag: "@traversable/schema-core/URI::array", seed: Fixpoint] | [tag: "@traversable/schema-core/URI::record", seed: Fixpoint] | [tag: "@traversable/schema-core/URI::optional", seed: Fixpoint] | [tag: "@traversable/schema-core/URI::tuple", seed: readonly Fixpoint[]] | [tag: "@traversable/schema-core/URI::union", seed: readonly Fixpoint[]] | [tag: "@traversable/schema-core/URI::intersect", seed: readonly Fixpoint[]]]>; 
 *   tuple: Arbitrary<["@traversable/schema-core/URI::tuple", ("@traversable/schema-core/URI::never" | "@traversable/schema-core/URI::any" | "@traversable/schema-core/URI::unknown" | "@traversable/schema-core/URI::void" | "@traversable/schema-core/URI::null" | "@traversable/schema-core/URI::undefined" | "@traversable/schema-core/URI::symbol" | "@traversable/schema-core/URI::boolean" | "@traversable/schema-core/URI::bigint" | "@traversable/schema-core/URI::number" | "@traversable/schema-core/URI::string" | [tag: "@traversable/schema-core/URI::object", seed: [k: string, Fixpoint][]] | [tag: "@traversable/schema-core/URI::eq", seed: Fixpoint] | [tag: "@traversable/schema-core/URI::array", seed: Fixpoint] | [tag: "@traversable/schema-core/URI::record", seed: Fixpoint] | [tag: "@traversable/schema-core/URI::optional", seed: Fixpoint] | [tag: "@traversable/schema-core/URI::tuple", seed: readonly Fixpoint[]] | [tag: "@traversable/schema-core/URI::union", seed: readonly Fixpoint[]] | [tag: "@traversable/schema-core/URI::intersect", seed: readonly Fixpoint[]])[]]>; 
 *   object: Arbitrary<["@traversable/schema-core/URI::object", [k: string, v: "@traversable/schema-core/URI::never" | "@traversable/schema-core/URI::any" | "@traversable/schema-core/URI::unknown" | "@traversable/schema-core/URI::void" | "@traversable/schema-core/URI::null" | "@traversable/schema-core/URI::undefined" | "@traversable/schema-core/URI::symbol" | "@traversable/schema-core/URI::boolean" | "@traversable/schema-core/URI::bigint" | "@traversable/schema-core/URI::number" | "@traversable/schema-core/URI::string" | [tag: "@traversable/schema-core/URI::object", seed: [k: string, Fixpoint][]] | [tag: "@traversable/schema-core/URI::eq", seed: Fixpoint] | [tag: "@traversable/schema-core/URI::array", seed: Fixpoint] | [tag: "@traversable/schema-core/URI::record", seed: Fixpoint] | [tag: "@traversable/schema-core/URI::optional", seed: Fixpoint] | [tag: "@traversable/schema-core/URI::tuple", seed: readonly Fixpoint[]] | [tag: "@traversable/schema-core/URI::union", seed: readonly Fixpoint[]] | [tag: "@traversable/schema-core/URI::intersect", seed: readonly Fixpoint[]]][]]>; 
 *   union: Arbitrary<["@traversable/schema-core/URI::union", ("@traversable/schema-core/URI::never" | "@traversable/schema-core/URI::any" | "@traversable/schema-core/URI::unknown" | "@traversable/schema-core/URI::void" | "@traversable/schema-core/URI::null" | "@traversable/schema-core/URI::undefined" | "@traversable/schema-core/URI::symbol" | "@traversable/schema-core/URI::boolean" | "@traversable/schema-core/URI::bigint" | "@traversable/schema-core/URI::number" | "@traversable/schema-core/URI::string" | [tag: "@traversable/schema-core/URI::object", seed: [k: string, Fixpoint][]] | [tag: "@traversable/schema-core/URI::eq", seed: Fixpoint] | [tag: "@traversable/schema-core/URI::array", seed: Fixpoint] | [tag: "@traversable/schema-core/URI::record", seed: Fixpoint] | [tag: "@traversable/schema-core/URI::optional", seed: Fixpoint] | [tag: "@traversable/schema-core/URI::tuple", seed: readonly Fixpoint[]] | [tag: "@traversable/schema-core/URI::union", seed: readonly Fixpoint[]] | [tag: "@traversable/schema-core/URI::intersect", seed: readonly Fixpoint[]])[]]>; 
 *   intersect: Arbitrary<["@traversable/schema-core/URI::intersect", ("@traversable/schema-core/URI::never" | "@traversable/schema-core/URI::any" | "@traversable/schema-core/URI::unknown" | "@traversable/schema-core/URI::void" | "@traversable/schema-core/URI::null" | "@traversable/schema-core/URI::undefined" | "@traversable/schema-core/URI::symbol" | "@traversable/schema-core/URI::boolean" | "@traversable/schema-core/URI::bigint" | "@traversable/schema-core/URI::number" | "@traversable/schema-core/URI::string" | [tag: "@traversable/schema-core/URI::object", seed: [k: string, Fixpoint][]] | [tag: "@traversable/schema-core/URI::eq", seed: Fixpoint] | [tag: "@traversable/schema-core/URI::array", seed: Fixpoint] | [tag: "@traversable/schema-core/URI::record", seed: Fixpoint] | [tag: "@traversable/schema-core/URI::optional", seed: Fixpoint] | [tag: "@traversable/schema-core/URI::tuple", seed: readonly Fixpoint[]] | [tag: "@traversable/schema-core/URI::union", seed: readonly Fixpoint[]] | [tag: "@traversable/schema-core/URI::intersect", seed: readonly Fixpoint[]])[]]>; 
 *   tree: Arbitrary<"@traversable/schema-core/URI::never" | "@traversable/schema-core/URI::any" | "@traversable/schema-core/URI::unknown" | "@traversable/schema-core/URI::void" | "@traversable/schema-core/URI::null" | "@traversable/schema-core/URI::undefined" | "@traversable/schema-core/URI::symbol" | "@traversable/schema-core/URI::boolean" | "@traversable/schema-core/URI::bigint" | "@traversable/schema-core/URI::number" | "@traversable/schema-core/URI::string" | [tag: "@traversable/schema-core/URI::object", seed: [k: string, Fixpoint][]] | [tag: "@traversable/schema-core/URI::eq", seed: Fixpoint] | [tag: "@traversable/schema-core/URI::array", seed: Fixpoint] | [tag: "@traversable/schema-core/URI::record", seed: Fixpoint] | [tag: "@traversable/schema-core/URI::optional", seed: Fixpoint] | [tag: "@traversable/schema-core/URI::tuple", seed: readonly Fixpoint[]] | [tag: "@traversable/schema-core/URI::union", * seed: readonly Fixpoint[]] | [tag: "@traversable/schema-core/URI::intersect", seed: readonly Fixpoint[]]>; 
 * }
 */

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-core❳', () => {
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
