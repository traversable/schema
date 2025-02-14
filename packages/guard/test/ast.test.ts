import { fn, t, symbol as Symbol, URI, type, Seed } from '@traversable/guard'
import type { Functor } from '@traversable/guard'
import * as vi from 'vitest'
import { z } from 'zod'

import { fc, test } from '@fast-check/vitest'

const stringify = (x: unknown) => JSON.stringify(x, (_, v) => typeof v === 'symbol' ? 'Sym(' + v.description + ')' : v, 2)

type ZodInterface = {
  never: z.ZodNever
  unknown: z.ZodUnknown
  any: z.ZodAny
  void: z.ZodVoid
  null: z.ZodNull
  undefined: z.ZodUndefined
  symbol: z.ZodSymbol
  boolean: z.ZodBoolean
  number: z.ZodNumber
  bigint: z.ZodBigInt
  string: z.ZodString,
  object: z.ZodObject<z.ZodRawShape>
  record: z.ZodRecord,
  array: z.ZodArray<z.ZodTypeAny>
  tuple: z.ZodTuple,
  union: z.ZodUnion<z.ZodUnionOptions>,
  intersect: z.ZodIntersection<z.ZodTypeAny, z.ZodTypeAny>,
}

const ZodNullaryMap = {
  [Symbol.never]: z.never(),
  [Symbol.unknown]: z.unknown(),
  [Symbol.any]: z.any(),
  [Symbol.void]: z.void(),
  [Symbol.null]: z.null(),
  [Symbol.undefined]: z.void(),
  [Symbol.symbol_]: z.symbol(),
  [Symbol.boolean]: z.boolean(),
  [Symbol.number]: z.number(),
  [Symbol.bigint]: z.bigint(),
  [Symbol.string]: z.string(),
}

const zodAlgebra: Functor.Algebra<Seed.F, z.ZodTypeAny> = (x) => {
  switch (true) {
    default: return fn.exhaustive(x)
    case Seed.isNullary(x): return ZodNullaryMap[x[0]]
    case x[0] === Symbol.optional: return z.optional(x[1])
    case x[0] === Symbol.array: return z.array(x[1])
    case x[0] === Symbol.tuple: return z.tuple([x[1][0], ...x[1].slice(1)])
    case x[0] === Symbol.object: return z.object(Object.fromEntries(x[1]))
    case x[0] === Symbol.record: return z.record(x[1])
    case x[0] === Symbol.union: return z.union([x[1][0], x[1][1], ...x[1].slice(2)])
    case x[0] === Symbol.intersect: return x[1].slice(1).reduce((acc, y) => acc.and(y), x[1][0])
  }
}

const arbitraryZodSchema = fn.cata(Seed.Functor)(zodAlgebra)
//    ^?


// const FunctorPreservesStructure = <T>(seed: Seed.Fixpoint) => 

const builder = fc.letrec(Seed.seed())
const builderWithData = Seed.schemaWithData()

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/guard❳', () => {
  test.prop([builder.tree], { numRuns: 1 })(
    '〖⛳️〗› ❲Seed.Functor❳: Functor preserves structure',
    (seed) => vi.assert.deepEqual(Seed.identity(seed), seed)
  )

  test.prop(
    [builderWithData, fc.jsonValue()],
    { numRuns: 1000 }
  )(
    '〖⛳️〗› ❲t.schema❳: parity with oracle (zod)',
    ({ schema, seed, string }, json) => {
      const zodSchema = arbitraryZodSchema(seed)
      const parsed = zodSchema.safeParse(json)
      if (schema(json) !== parsed.success) {
        console.group('Parse failure')
        console.debug('internal result:', schema(json))
        console.debug('\n\n\r', 'JSON:', '\n\r', stringify(json))
        console.debug('\n\n\r', 'Error:', '\n\r', stringify(parsed.error))
        console.debug('\n\n\r', 'String:', '\n\r', stringify(string))
        console.groupEnd()
      }
      vi.assert.equal(schema(json), parsed.success)
    }
  )

  test.prop(
    [builderWithData],
    { numRuns: 1 },
  )(
    '〖⛳️〗› ❲seed.Functor❳: Seed.show',
    ({ schema, data }) => {
      vi.assert.isTrue(schema(data))
    }
  )

  // vi.it('', () => {
  //   const { seed } = Seed.schemaWithData()
  //   // const { data, schema, seed, string } = Seed.schemaWithData()
  //   console.group('seedWithData')
  //   // console.debug('\n\rdata:\n\r', data)
  //   // console.debug('\n\rtoString:\n\r', string)
  //   console.debug('\n\rtype:\n\r', seed)
  //   // console.debug('\n\rvalid?\n\r', schema(data))
  //   // console.log('\n\rschema\n\r', schema)
  //   // console.log('\n\rseed\n\r', seed)
  //   console.groupEnd()
  // })
  // test.prop([Seed.schemaWithData], { numRuns: 10_000 })('', ({ schema, data, string }) => {
  //   if (!schema(data)) {
  //     console.group('===============================\n===    ASSERTION FAILURE    ===\n===============================')
  //     console.log('\n\nschema: \n', schema, '\n\n')
  //     console.log('\n\ndata: \n', data, '\n\n')
  //     console.log('\n\nseed (as string): \n', string, '\n\n')
  //     console.log(string)
  //     console.groupEnd()
  //   }
  //   vi.assert.isTrue(schema(data))
  // })
})

vi.describe(`〖⛳️〗‹‹‹ ❲@traverable/guard❳`, () => {
  // [t.object({ x: t.object({ y: t.object({ z: t.null }) }) }), URI.object, { [symbol.tag]: URI.object, x: { y: { z: URI.null } } }],

  test.each([
    [t.boolean, URI.boolean, type('boolean')],
    [t.number, URI.number, type('number')],
    [t.string, URI.string, type('string')],
    [t.tuple(), URI.tuple, { [Symbol.tag]: URI.tuple, def: [] }],
    [t.object({}), URI.object, { [Symbol.tag]: URI.object, def: {} }],
    [t.union(), URI.union, { [Symbol.tag]: URI.union, def: [] }],
    [t.intersect(), URI.intersect, { [Symbol.tag]: URI.intersect, def: [] }],
    [t.array(t.never), URI.array, { [Symbol.tag]: URI.array, def: type('never') }],

    // [t.tuple(t.boolean), URI.tuple, [type('boolean', URI.boolean)]],
    // [t.record(t.boolean), URI.record, [t.boolean]],
  ])(
    '〖⛳️〗› ❲guard.t❳',
    (f, id, refl) => {
      vi.assert.equal(t.identify(f), id)
      // vi.assert.deepEqual(t.reflect(f), refl)
      const z = t.reflect(f)

    }
  )

  // test.prop([fc.array(fc.string())], {})(
  //   '〖⛳️〗› ❲guard.t.array❳', (xs) => {
  //     vi.assert.isTrue(t.array(t.string)(xs))
  //     // console.log(Object.getOwnPropertySymbols(t.array(t.string)))
  //   }
  // )
  // test.prop([fc.oneof(fc.float(), fc.string())], {})(
  //   '〖⛳️〗› ❲guard.t.union❳', (xs) => {
  //     type t = t.typeof<typeof guard>
  //     type d = t.identify<typeof guard>
  //     type r = t.reflect<typeof guard>
  //     const guard = t.union(t.string, t.number)
  //     const tag = t.identify(guard)
  //     const r = t.reflect(guard)
  //     const ty = t.typeof(guard)
  //     // const type = guard[symbol.type]
  //     // const tag = guard[symbol.tag]
  //     // console.log(type)
  //     // console.log(tag)
  //     // vi.assert.equal(guard[Symbol.tag], URI.union)
  //     // vi.assert.isTrue(guard(xs))
  //     // ys[symbol.type].forEach((y) => vi.assert.isTrue(typeof y === 'string'));
  //   })
})
