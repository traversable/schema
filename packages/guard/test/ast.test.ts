import * as vi from 'vitest'
import { z } from 'zod'
import { fc, test } from '@fast-check/vitest'

import type { Functor } from '@traversable/guard'
import { fn, t, symbol as Symbol, Seed } from '@traversable/guard'

/** @internal */
const stringify = (x: unknown) => JSON.stringify(
  x,
  (_, v) => typeof v === 'symbol' ? 'Sym(' + v.description + ')' : v,
  2
)

/** @internal */
const logFailure = (
  schema: t.Tree.Fixpoint,
  zodSchema: z.ZodTypeAny,
  stringifiedSchema: string,
  input: fc.JsonValue,
  parsed: z.SafeParseReturnType<any, any>,
) => {
  console.group('\n\n\n\n\n\r\
╥┬┬╥┬┬╥┬┬╥┬┬╥┬┬╥┬┬╥┬┬╥┬┬╥\n\r\
╟     PARSE FAILURE     ╢\n\r\
╨┴┴╨┴┴╨┴┴╨┴┴╨┴┴╨┴┴╨┴┴╨┴┴╨\n\r\
  '.trim())
  console.debug('\n\n\r', 'Input:', '\n\r', stringify(input))
  console.debug('\n\n\r', 'Internal result:', '\n\r', schema(input))
  console.debug('\n\n\r', 'Internal schema tag:', '\n\r', stringify(schema[Symbol.def]))
  console.debug('\n\n\r', 'Internal schema body:', '\n\r', stringify(schema[Symbol.def]))
  console.debug('\n\n\r', 'Zod Schema:', '\n\r', zodSchema)
  console.debug('\n\n\r', 'Error:', '\n\r', stringify(parsed.error))
  console.debug('\n\n\r', 'String:', '\n\r', stringify(stringifiedSchema))
  console.groupEnd()
}

// TODO: move this to lib proper?
const ZodNullaryMap = {
  [Symbol.never]: z.never(),
  [Symbol.unknown]: z.unknown(),
  [Symbol.any]: z.any(),
  [Symbol.void]: z.void(),
  [Symbol.null]: z.null(),
  [Symbol.undefined]: z.undefined(),
  [Symbol.symbol_]: z.symbol(),
  [Symbol.boolean]: z.boolean(),
  [Symbol.number]: z.number(),
  [Symbol.bigint]: z.bigint(),
  [Symbol.string]: z.string(),
}

// TODO: move this to lib proper?
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

/** @internal */
const builderWithData = Seed.schemaWithData({})

/** @internal */
const arbitraryZodSchema = fn.cata(Seed.Functor)(zodAlgebra)
//    ^?

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/guard❳: property-based test suite', () => {

  test.prop([builderWithData], { numRuns: 1 })(
    '〖⛳️〗› ❲Seed.Functor❳: Seed Functor preserves structure',
    ({ seed }) => vi.assert.deepEqual(Seed.identity(seed), seed)
  )

  test.prop([builderWithData, fc.jsonValue()])(
    '〖⛳️〗› ❲t.schema❳: parity with oracle (zod)',
    ({ schema, seed, string }, json) => {
      const zodSchema = arbitraryZodSchema(seed)
      const parsed = zodSchema.safeParse(json)
      if (schema(json) !== parsed.success)
        logFailure(schema, zodSchema, string, json, parsed)
      vi.assert.equal(schema(json), parsed.success)
    }
  )

  const tupleLength_1_3 = fc.letrec(Seed.seed({ tuple: { minLength: 1, maxLength: 3 } })).tuple
  const tupleLength_1_5 = fc.letrec(Seed.seed({ tuple: { minLength: 1, maxLength: 5 } })).tuple
  const tupleLength_3_5 = fc.letrec(Seed.seed({ tuple: { minLength: 3, maxLength: 5 } })).tuple
  test.prop([tupleLength_1_3, tupleLength_1_5, tupleLength_3_5], {})('no options',
    (_1_3, _1_5, _3_5) => {
      vi.assert.equal(_1_3[0], Symbol.tuple)
      vi.assert.equal(_1_5[0], Symbol.tuple)
      vi.assert.equal(_3_5[0], Symbol.tuple)
      vi.assert.isArray(_1_3[1])
      vi.assert.isArray(_1_5[1])
      vi.assert.isArray(_3_5[1])
      vi.assert.isAtLeast(_1_3[1].length, 1)
      vi.assert.isAtMost(_1_3[1].length, 3)
      vi.assert.isAtLeast(_1_5[1].length, 1)
      vi.assert.isAtMost(_1_5[1].length, 5)
      vi.assert.isAtLeast(_3_5[1].length, 3)
      vi.assert.isAtMost(_3_5[1].length, 5)
    }
  );

  const objectKeys_1_3 = fc.letrec(Seed.seed({ object: { minLength: 1, maxLength: 3 } })).object
  const objectKeys_1_5 = fc.letrec(Seed.seed({ object: { minLength: 1, maxLength: 5 } })).object
  const objectKeys_3_5 = fc.letrec(Seed.seed({ object: { minLength: 3, maxLength: 5 } })).object
  test.prop([objectKeys_1_3, objectKeys_1_5, objectKeys_3_5], {})('no options',
    (_1_3, _1_5, _3_5) => {
      vi.assert.equal(_1_3[0], Symbol.object)
      vi.assert.equal(_1_5[0], Symbol.object)
      vi.assert.equal(_3_5[0], Symbol.object)
      vi.assert.isArray(_1_3[1])
      vi.assert.isArray(_1_5[1])
      vi.assert.isArray(_3_5[1])
      vi.assert.isAtLeast(_1_3[1].length, 1)
      vi.assert.isAtMost(_1_3[1].length, 3)
      vi.assert.isAtLeast(_1_5[1].length, 1)
      vi.assert.isAtMost(_1_5[1].length, 5)
      vi.assert.isAtLeast(_3_5[1].length, 3)
      vi.assert.isAtMost(_3_5[1].length, 5)
    }
  );

  const unionSize_1_3 = fc.letrec(Seed.seed({ union: { minLength: 1, maxLength: 3 } })).union
  const unionSize_1_5 = fc.letrec(Seed.seed({ union: { minLength: 1, maxLength: 5 } })).union
  const unionSize_3_5 = fc.letrec(Seed.seed({ union: { minLength: 3, maxLength: 5 } })).union
  test.prop([unionSize_1_3, unionSize_1_5, unionSize_3_5], {})('no options',
    (_1_3, _1_5, _3_5) => {
      vi.assert.equal(_1_3[0], Symbol.union)
      vi.assert.equal(_1_5[0], Symbol.union)
      vi.assert.equal(_3_5[0], Symbol.union)
      vi.assert.isArray(_1_3[1])
      vi.assert.isArray(_1_5[1])
      vi.assert.isArray(_3_5[1])
      vi.assert.isAtLeast(_1_3[1].length, 1)
      vi.assert.isAtMost(_1_3[1].length, 3)
      vi.assert.isAtLeast(_1_5[1].length, 1)
      vi.assert.isAtMost(_1_5[1].length, 5)
      vi.assert.isAtLeast(_3_5[1].length, 3)
      vi.assert.isAtMost(_3_5[1].length, 5)
    }
  )

  const intersectSize_1_3 = fc.letrec(Seed.seed({ intersect: { minLength: 1, maxLength: 3 } })).intersect
  const intersectSize_1_5 = fc.letrec(Seed.seed({ intersect: { minLength: 1, maxLength: 5 } })).intersect
  const intersectSize_3_5 = fc.letrec(Seed.seed({ intersect: { minLength: 3, maxLength: 5 } })).intersect
  test.prop([intersectSize_1_3, intersectSize_1_5, intersectSize_3_5], {})('no options',
    (_1_3, _1_5, _3_5) => {
      vi.assert.equal(_1_3[0], Symbol.intersect)
      vi.assert.equal(_1_5[0], Symbol.intersect)
      vi.assert.equal(_3_5[0], Symbol.intersect)
      vi.assert.isArray(_1_3[1])
      vi.assert.isArray(_1_5[1])
      vi.assert.isArray(_3_5[1])
      vi.assert.isAtLeast(_1_3[1].length, 1)
      vi.assert.isAtMost(_1_3[1].length, 3)
      vi.assert.isAtLeast(_1_5[1].length, 1)
      vi.assert.isAtMost(_1_5[1].length, 5)
      vi.assert.isAtLeast(_3_5[1].length, 3)
      vi.assert.isAtMost(_3_5[1].length, 5)
    }
  )
})

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/guard❳: example-based test suite', () => {
  const optionsForParityWithZod = {
    optionalTreatment: 'treatUndefinedAndOptionalAsTheSame'
  } as const

  vi.it('〖⛳️〗› ❲t.guard❳: it guards', () => {
    vi.assert.isTrue(t.unknown(void 0))
    vi.assert.isTrue(t.object({ a: t.unknown })({ a: undefined }))
    vi.assert.isTrue(t.any(void 0))
    vi.assert.isTrue(t.any(void 0))
    vi.assert.isTrue(t.void(void 0))
    vi.assert.isTrue(t.object({ a: t.any })({ a: undefined }))

    vi.assert.isFalse(t.never(void 0))
    vi.assert.isFalse(t.never(1))
    vi.assert.isFalse(t.object({ a: t.never })({ a: 0 }))
    vi.assert.isTrue(t.object({ a: t.optional(t.never) })({}))

    const object_00 = t.object({})
    // FAILURE
    vi.assert.isFalse(object_00([]))
    // SUCCESS
    vi.assert.isTrue(object_00({}))

    const object_01 = t.object({}, { treatArraysAsObjects: true })
    // FAILURE
    vi.assert.isFalse(object_01('hi'))
    // SUCCESS
    vi.assert.isTrue(object_01({}))
    vi.assert.isTrue(object_01([]))

    const object_02 = t.object({ a: t.number })
    // FAILURE
    vi.assert.isFalse(object_02("hey"))
    vi.assert.isFalse(object_02({}))
    vi.assert.isFalse(object_02({ a: 'hey' }))
    vi.assert.isFalse(object_02([]))
    // SUCCESS
    vi.assert.isTrue(object_02({ a: 1 }))

    const object_03 = t.object({ a: t.optional(t.number) }, { optionalTreatment: 'presentButUndefinedIsOK' })
    // FAILURE
    vi.assert.isFalse(object_03("hey"))
    vi.assert.isFalse(object_03({ a: 'hey' }))
    vi.assert.isFalse(object_03([]))
    // SUCCESS
    vi.assert.isTrue(object_03({}))
    vi.assert.isTrue(object_03({ a: 1 }))

    const object_04 = t.object({ a: t.optional(t.number), b: t.undefined }, { optionalTreatment: 'exactOptional' })
    // FAILURE
    vi.assert.isFalse(object_04({ a: undefined }))
    vi.assert.isFalse(object_04("hey"))
    vi.assert.isFalse(object_04({ a: 'hey' }))
    vi.assert.isFalse(object_04([]))
    vi.assert.isFalse(object_04({}))
    vi.assert.isFalse(object_04({ a: undefined, b: undefined }))
    // SUCCESS
    vi.assert.isTrue(object_04({ a: 1, b: undefined }))
    vi.assert.isTrue(object_04({ b: undefined }))

    const object_05 = t.object({ a: t.optional(t.number), b: t.undefined }, { optionalTreatment: 'presentButUndefinedIsOK' })
    vi.assert.isFalse(object_05("hey"))
    vi.assert.isFalse(object_05({ a: 'hey' }))
    vi.assert.isFalse(object_05({}))
    vi.assert.isFalse(object_05([]))
    // SUCCESS
    vi.assert.isTrue(object_05({ b: undefined }))
    vi.assert.isTrue(object_05({ a: undefined, b: undefined }))
    vi.assert.isTrue(object_05({ a: 1, b: undefined }))

    const object_06 = t.object({ a: t.undefined, b: t.optional(t.number, optionsForParityWithZod) }, optionsForParityWithZod)
    // FAILURE
    vi.assert.isFalse(object_06({ a: 0 }))
    vi.assert.isFalse(object_06({ b: 'string' }))
    // SUCCESS
    vi.assert.isTrue(object_06({}))
    vi.assert.isTrue(object_06({ a: undefined }))
    vi.assert.isTrue(object_06({ b: 0 }))
    vi.assert.isTrue(object_06({ b: undefined }))
    vi.assert.isTrue(object_06({ a: undefined, b: 0 }))
    vi.assert.isTrue(object_06({ a: undefined, b: undefined }))

    const intersect = t.intersect(t.object({ a: t.string }), t.object({ c: t.boolean }))
    // FAILURE
    vi.assert.isFalse(intersect({}))
    vi.assert.isFalse(intersect({ a: 'hey', c: null }))
    vi.assert.isFalse(intersect({ a: 'hey' }))
    // SUCCESS
    vi.assert.isTrue(intersect({ a: 'hey', c: false }))
    vi.assert.isTrue(intersect({ a: 'hey', c: false, d: null }))

    const union = t.union(t.object({ a: t.string }), t.object({ b: t.number }))
    // FAILURE
    vi.assert.isFalse(union({}))
    vi.assert.isFalse(union({ a: 1 }))
    vi.assert.isFalse(union({ b: 'hey' }))
    // SUCCESS
    vi.assert.isTrue(union({ a: 'hey' }))
    vi.assert.isTrue(union({ b: 1 }))
    vi.assert.isTrue(union({ a: null, b: 1 }))

    const tuple = t.tuple(t.null, t.object({ a: t.null }))
    // FAILURE
    vi.assert.isFalse(tuple(void 0))
    vi.assert.isFalse(tuple([]))
    vi.assert.isFalse(tuple([void 0]))
    vi.assert.isFalse(tuple([null]))
    vi.assert.isFalse(tuple([null, {}]))
    vi.assert.isFalse(tuple([null, { a: true }]))
    vi.assert.isFalse(tuple([null, { a: null }, 10]))
    // SUCCESS
    vi.assert.isTrue(tuple([null, { a: null }]))

    const record = t.record(t.union(t.undefined, t.string))
    // FAILURE
    vi.assert.isFalse(record(void 0))
    vi.assert.isFalse(record({ a: 1 }))
    vi.assert.isFalse(record({ a: 'hey', b: 2 }))
    vi.assert.isFalse(record([]))
    // SUCCESS
    vi.assert.isTrue(record({}))
    vi.assert.isTrue(record({ a: 'hey', b: 'ho' }))
    vi.assert.isTrue(record({ a: void 0, b: 'ho' }))

    const array = t.array(t.union(t.number, t.boolean))
    // FAILURE
    vi.assert.isFalse(array({}))
    vi.assert.isFalse(array(void 0))
    vi.assert.isFalse(array(['hey']))
    vi.assert.isFalse(array([1, 2, 'hey', 3]))
    // SUCCESS
    vi.assert.isTrue(array([]))
    vi.assert.isTrue(array([1]))
    vi.assert.isTrue(array([true, 1]))
    vi.assert.isTrue(array([1, true]))

    const optional = t.object({ b: t.optional(t.string) })
    // FAILURE
    vi.assert.isFalse(optional({ b: 1 }))
    // SUCCESS
    vi.assert.isTrue(optional({}))
    vi.assert.isTrue(optional({ b: 'hey' }))


    ///////////////////////////////////////////////////////////
    /// below: a buncha edge cases that fast-check found    ///
    /// - [ ] TODO: move each of these into the `examples`  ///
    ///       block of the property test that found it      ///
    ///////////////////////////////////////////////////////////

    const t_00 = t.object({ "aK/s_O'\\": t.union(t.any, t.string) }, optionsForParityWithZod)
    const z_00 = z.object({ "aK/s_O'\\": z.union([z.unknown(), z.string()]) })
    const i_00 = { "?^u+0\\o=9": [], "\"o'P,u=.": true, "h;u": {}, "P\"!YCfyj<U": "=V}QuN3J" }
    vi.assert.equal(t_00(i_00), z_00.safeParse(i_00).success)

    const t_01 = t.object({ "\\": t.optional(t.string, optionsForParityWithZod) }, optionsForParityWithZod);
    const z_01 = z.object({ "\\": z.optional(z.string()) });
    const i_01 = { ";": false, "\"9%J": null, "8K}\\<~sDX;": "u%]{)", "/).qZmK": "\"ANKq", "": "cow<R>26" }
    vi.assert.equal(t_01(i_01), z_01.safeParse(i_01).success)

    const t_02 = t.object({ "k)nQ.CvM\\": t.any, "\\": t.string }, optionsForParityWithZod)
    const z_02 = z.object({ "k)nQ.CvM\\": z.any(), "\\": z.string() })
    const i_02 = { "{F5eNZA\"r": false, ">": [true, true, null, -9.509435933095172e+225, null], "": "M{OhLJ5\\" }
    vi.assert.equal(t_02(i_02), z_02.safeParse(i_02).success)

    const t_03 = t.object({ "\\": t.null }, optionsForParityWithZod)
    const z_03 = z.object({ "\\": z.null() })
    const i_03 = { ":5g_[g": null, "T": true, "Nz": [false], "DCSWP": true, "+$#": null, "": null, "zdq<RkQD": true }
    vi.assert.equal(t_03(i_03), z_03.safeParse(i_03).success)

    const t_04 = t.object({ "": t.undefined }, optionsForParityWithZod)
    const z_04 = z.object({ "": z.undefined() })
    const i_04 = { "": false }
    vi.assert.equal(t_04(i_04), z_04.safeParse(i_04).success)

    const t_05 = t.object({ "": t.string }, optionsForParityWithZod)
    const z_05 = z.object({ "": z.string() })
    const i_05 = { "": "" }
    vi.assert.equal(t_05(i_05), z_05.safeParse(i_05).success)
  })
})

// vi.test.each([
//   // [t.boolean, URI.boolean, type('boolean')[Symbol.def]],
//   [t.number, URI.number, type('number')],
//   [t.string, URI.string, type('string')],
//   [t.tuple(), URI.tuple, type('tuple', [])],
//   [t.object({}), URI.object, type('object', {})],
//   [t.union(), URI.union, type('union', [])],
//   [t.intersect(), URI.intersect, type('intersect', [])],
//   [t.array(t.never), URI.array, type('never')],
//   // [t.tuple(t.boolean), URI.tuple, [type('boolean', URI.boolean)]],
//   // [t.record(t.boolean), URI.record, [t.boolean]],
// ])(
//   '〖⛳️〗› ❲guard.t❳',
//   (f, id, refl) => {
//     vi.assert.equal(t.identify(f), id)
//     vi.assert.deepEqual(t.reflect(f), refl)
//     const z = t.reflect(f)
//   }
// )
