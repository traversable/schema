import * as vi from 'vitest'
import { z } from 'zod'
import { fc, test } from '@fast-check/vitest'

import type { Functor, TypeError } from '@traversable/registry'
import { fn, URI, Equal, omitMethods } from '@traversable/registry'
import { zod } from '@traversable/schema-zod-adapter'

import {
  configure,
  getConfig,
  recurse,
  t,
  clone,
  __replaceBooleanConstructor as replaceBooleanConstructor,
  __carryover as carryover,
} from '@traversable/schema'
import * as Seed from './seed.js'

configure({
  schema: {
    optionalTreatment: 'treatUndefinedAndOptionalAsTheSame',
    eq: {
      equalsFn: Equal.IsStrictlyEqual
    }
  }
})

/** @internal */
const stringify = (x: unknown) =>
  JSON.stringify(x, (_, v) => typeof v === 'symbol'
    ? 'Sym(' + v.description + ')'
    : v === void 0 ? 'undefined'
      : v, 2
  )

/** @internal */
const logFailure = (
  schema: t.LowerBound,
  zodSchema: z.ZodTypeAny,
  input: fc.JsonValue,
  parsed: z.SafeParseReturnType<any, any>,
  seed: Seed.Fixpoint,
) => {
  console.group('\n\n\r'
    + ' \
╭ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   \n\r\
╷                               \n\r\
╷        ~ THAT SHIT ~        ╵ \n\r\
╷       FAILED TO PARSE       ╵ \n\r\
╷                             ╵ \n\r\
    ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ╯ \n\r\
    '.trim()
  )
  console.debug('\n\n\r', '**SEED**')
  console.debug('\n\n\r', seed)
  console.debug('\n\n\r', '**INPUT**')
  console.debug('\n\r', stringify(input))
  console.debug('\n')
  console.debug('\r', '**PARSE RESULT**')
  console.debug('\n')
  console.debug('\r', '[@traversable]:')
  console.debug('\r', schema(input))
  console.debug('\n')
  console.debug('\r', '[zod]:')
  console.debug('\r', stringify(parsed.error))
  console.debug('\r', stringify(parsed))
  console.debug('\n')
  console.debug('\r', '**RECONSTRUCTED SCHEMAS**')
  console.debug('\n')
  console.debug('\r', '[@traversable]:')
  console.debug('\r', recurse.toString(schema))
  console.debug('\r', stringify(schema))
  console.debug('\n')
  console.debug('\r', '[zod]:')
  console.debug('\r', zod.toString(zodSchema))
  console.debug('\n')
  console.groupEnd()
}

const ZodNullaryMap = {
  [URI.never]: z.never(),
  [URI.unknown]: z.unknown(),
  [URI.any]: z.any(),
  [URI.void]: z.void(),
  [URI.null]: z.null(),
  [URI.undefined]: z.undefined(),
  [URI.symbol]: z.symbol(),
  [URI.boolean]: z.boolean(),
  [URI.integer]: z.number(),
  [URI.number]: z.number(),
  [URI.bigint]: z.bigint(),
  [URI.string]: z.string(),
}

const zodAlgebra: Functor.Algebra<Seed.Free, z.ZodTypeAny> = (x) => {
  if (x == null) return x
  switch (true) {
    default: return fn.exhaustive(x)
    case typeof x === 'string': return ZodNullaryMap[x]
    case x[0] === URI.optional: return z.optional(x[1])
    case x[0] === URI.array: return z.array(x[1])
    case x[0] === URI.record: return z.record(x[1])
    case x[0] === URI.eq: return zod.fromConstant(x[1] as never)
    case x[0] === URI.tuple: return z.tuple([x[1][0], ...x[1].slice(1)])
    case x[0] === URI.union: return z.union([x[1][0], x[1][1], ...x[1].slice(2)])
    case x[0] === URI.intersect: return x[1].slice(1).reduce((acc, y) => acc.and(y), x[1][0])
    case x[0] === URI.object: return z.object(globalThis.Object.fromEntries(x[1]))
  }
}

/** @internal */
const arbitraryZodSchema = fn.cata(Seed.Functor)(zodAlgebra)
//    ^?

const builder
  = (constraints?: Seed.Constraints) => fc
    .letrec(Seed.seed(constraints))

/**
 * This test generates a seed value, then uses the seed value to generate:
 *
 *   1. a random schema
 *   2. the corresponding zod schema
 *
 * Along with the seed + schemas, the test also generates 1,000 random JSON
 * values, which are given to each schema for parsing.
 *
 * If the schemas ever disagree, the test fails.
 *
 * When you have an "oracle" (in this case the zod schema is our oracle),
 * the tests basically write themselves.
 *
 * Just to give you an idea just how useful this is in practice, when this test
 * first ran, it found _dozens_ of discrepancies.
 *
 * In some cases, it uncovered undocumented/unspecified behavior on zod's part,
 * and in other cases I needed to dip into zod's source code to figure out why
 * things were behaving like they did.
 *
 * One example that stands out: `z.unknown` and `z.any` schemas, when they appear
 * as properties in an object schema, can be omitted from the object altogether.
 * This is due to a design limitation on `zod`'s part, since AFAICT they don't
 * validate property-keys -- only property-values.
 */

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema❳: property-based test suite', () => {
  test.prop(
    [builder().tree, fc.jsonValue()], {
    // numRuns: 10_000,
    endOnFailure: true,
    examples: [
      [["@traversable/schema/URI::eq", { "_": undefined }], {}],
      // For parity with zod, which does not differentiate between 0 and -0,
      // we added a configuration option that allows users to pass a custom
      // "equalsFn", which defaults to IsStrictlyEqual ('===')
      [["@traversable/schema/URI::eq", 0], -0],
      [
        [
          "@traversable/schema/URI::union",
          [
            "@traversable/schema/URI::string",
            ["@traversable/schema/URI::eq", { "_O_$M$": "" }]
          ]
        ],
        {}
      ],
    ],
  })(
    '〖⛳️〗› ❲t.schema❳: parity with oracle (zod)',
    (seed, json) => {
      const schema = Seed.toSchema(seed)
      const zodSchema = arbitraryZodSchema(seed)
      const parsed = zodSchema.safeParse(json)
      if (schema(json) !== parsed.success)
        logFailure(schema, zodSchema, json, parsed, seed)
      vi.assert.equal(schema(json), parsed.success)
    }
  )
})

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema❳', () => {
  vi.it('〖⛳️〗› ❲t.array❳', () => {
    const schema_01 = t.array(t.string)
    vi.assert.isFunction(schema_01)
    vi.assert.equal(schema_01.tag, URI.array)
    vi.assert.isFunction(schema_01.def)
    vi.assert.equal(schema_01.def.tag, URI.string)
    vi.assert.equal(schema_01.def.def, '')
    vi.assert.isFalse(schema_01(''))
    vi.assert.isTrue(schema_01([]))
    vi.assert.isTrue(schema_01(['']))

    vi.assert.isTrue(t.array.def({})([]))
    vi.assert.isTrue(t.array.def(t.string)([]))
  })

  vi.it('〖⛳️〗› ❲t.record❳', () => {
    const schema_01 = t.record(t.bigint)
    vi.assert.isFunction(schema_01)
    vi.assert.equal(schema_01.tag, URI.record)
    vi.assert.isFunction(schema_01.def)
    vi.assert.equal(schema_01.def.tag, URI.bigint)
    vi.assert.equal(schema_01.def.def, 0n)
    vi.assert.isFalse(schema_01(''))
    vi.assert.isFalse(schema_01([]))
    vi.assert.isFalse(schema_01({ a: 0 }))
    vi.assert.isTrue(schema_01({}))
    vi.assert.isTrue(schema_01({ a: 1n }))
  })

  vi.it('〖⛳️〗› ❲t.optional❳', () => {
    const schema_01 = t.optional(t.any)
    vi.assert.isTrue(t.optional.is(schema_01))
    vi.assert.isFalse(t.optional.is(t.string))
    vi.assert.isFalse(t.optional.is({}))

    const schema_02 = t.optional(t.number)
    vi.assert.isFunction(schema_02)
    vi.assert.equal(schema_02.tag, URI.optional)
    vi.assert.isFunction(schema_02.def)
    vi.assert.equal(schema_02.def.tag, URI.number)
    vi.assert.equal(schema_02.def.def, 0)
    vi.assert.isFalse(schema_02(''))
    vi.assert.isFalse(schema_02([]))
    vi.assert.isTrue(schema_02(void 0))
    vi.assert.isTrue(schema_02(0))
    vi.assert.isTrue(t.object({ a: t.optional(t.string) })({}))

    const schema_03 = t.optional.def({})
    vi.assert.isTrue(schema_03(1))

  })


  vi.it('〖⛳️〗› ❲t.nonnullable❳', () => {
    const schema_01 = t.nonnullable
    vi.assert.isTrue(schema_01({}))
    vi.assert.isFalse(schema_01(null))
    vi.assert.isFalse(schema_01(undefined))
  })

  vi.it('〖⛳️〗› ❲t.eq❳', () => {
    const schema_01 = t.eq({ abc: 123 })
    vi.assert.isFunction(schema_01)
    vi.assert.equal(schema_01.tag, URI.eq)
    vi.assert.deepEqual(schema_01.def, { abc: 123 })
    vi.assert.isFalse(schema_01(''))
    vi.assert.isFalse(schema_01({ abc: 124 }))
    vi.assert.isFalse(schema_01({ abc: 123, def: 0 }))
    vi.assert.isTrue(schema_01({ abc: 123 }))

    const schema_02 = t.eq({ def: 456 }, { eq: { equalsFn: (x, y) => typeof x.def === typeof y.def } })
    vi.assert.isFunction(schema_02)
    vi.assert.equal(schema_02.tag, URI.eq)
    vi.assert.deepEqual(schema_02.def, { def: 456 })
    vi.assert.isFalse(schema_02(''))
    vi.assert.isFalse(schema_02({ def: '' }))
    vi.assert.isTrue(schema_02({ def: 456 }))
    vi.assert.isTrue(schema_02({ def: 123 }))

    const predicate = () => true
    const schema_03 = t.eq(predicate)
    vi.assert.isFunction(schema_03)
    vi.assert.equal(schema_03.tag, URI.eq)
    vi.assert.equal(schema_03.def, predicate)
  })


  vi.it('〖⛳️〗› ❲t.intersect❳', () => {
    const schema_09 = t.intersect(t.object({ a: t.number }), t.object({ b: t.string }))
    vi.assert.isFunction(schema_09)
    vi.assert.equal(schema_09.tag, URI.intersect)
    vi.assert.isArray(schema_09.def)
    vi.assert.isFunction(schema_09.def[0])
    vi.assert.equal(schema_09.def[0].tag, URI.object)
    vi.assert.equal(schema_09.def[0].def.a.tag, URI.number)
    vi.assert.isFunction(schema_09.def[1])
    vi.assert.equal(schema_09.def[1].tag, URI.object)
    vi.assert.equal(schema_09.def[1].def.b.tag, URI.string)
    vi.assert.isFalse(schema_09([]))
    vi.assert.isFalse(schema_09({}))
    vi.assert.isFalse(schema_09({ a: 0 }))
    vi.assert.isFalse(schema_09({ b: '' }))
    vi.assert.isFalse(schema_09({ b: 0 }))
    vi.assert.isFalse(schema_09({ a: '' }))
    vi.assert.isFalse(schema_09({ a: 0, b: 0 }))
    vi.assert.isFalse(schema_09({ a: '', b: '' }))
    vi.assert.isFalse(schema_09({ a: '', b: 0 }))
    vi.assert.isTrue(schema_09({ a: 0, b: '' }))
    vi.assert.isTrue(schema_09({ a: 0, b: '', c: 'excess is ok' }))
  })

  vi.it('〖⛳️〗› ❲t.object❳', () => {
    const schema_03 = t.object({})
    vi.assert.isFunction(schema_03)
    vi.assert.equal(schema_03.tag, URI.object)
    vi.assert.isObject(schema_03.def)
    vi.assert.lengthOf(Object.keys(schema_03.def), 0)
    const schema_04 = t.object({ a: t.number, b: t.optional(t.string) })
    vi.assert.isFunction(schema_04)
    vi.assert.equal(schema_04.tag, URI.object)
    vi.assert.isObject(schema_04.def)
    vi.assert.equal(schema_04.def.a.tag, URI.number)
    vi.assert.equal(schema_04.def.b.tag, URI.optional)
    vi.assert.isFalse(schema_04(''))
    vi.assert.isFalse(schema_04([]))
    vi.assert.isFalse(schema_04({}))
    vi.assert.isFalse(schema_04({ b: void 0 }))
    vi.assert.isFalse(schema_04({ a: 0, b: false }))
    vi.assert.isTrue(schema_04({ a: 1, b: void 0 }))
    vi.assert.isTrue(schema_04({ a: 1, b: 'hi' }))
  })

  vi.it('〖⛳️〗› ❲t.union❳', () => {
    /*********************/
    /** CASE: PRIMITIVES */
    const schema_01 = t.union(t.symbol, t.null)
    vi.assert.equal(schema_01.tag, URI.union)
    vi.assert.isArray(schema_01.def)
    vi.assert.isFunction(schema_01.def[0])
    vi.assert.equal(schema_01.def[0].tag, URI.symbol)
    vi.assert.equal(schema_01.def[0].def.toString(), 'Symbol()')
    vi.assert.isFunction(schema_01.def[1])
    vi.assert.equal(schema_01.def[1].tag, URI.null)
    vi.assert.isNull(schema_01.def[1].def)
    vi.assert.isFalse(schema_01('hi'))
    vi.assert.isFalse(schema_01(undefined))
    vi.assert.isTrue(schema_01(globalThis.Symbol()))
    vi.assert.isTrue(schema_01(null))
    /*********************/
    /** CASE: COMPOSITES */
    const schema_02 = t.union(t.object({ a: t.number }), t.object({ b: t.string }))
    vi.assert.isFunction(schema_02)
    vi.assert.equal(schema_02.tag, URI.union)
    vi.assert.isArray(schema_02.def)
    vi.assert.isFunction(schema_02.def[0])
    vi.assert.equal(schema_02.def[0].tag, URI.object)
    vi.assert.equal(schema_02.def[0].def.a.tag, URI.number)
    vi.assert.isFunction(schema_02.def[1])
    vi.assert.equal(schema_02.def[1].tag, URI.object)
    vi.assert.equal(schema_02.def[1].def.b.tag, URI.string)
    vi.assert.isFalse(schema_02([]))
    vi.assert.isFalse(schema_02({}))
    vi.assert.isFalse(schema_02({ b: 0 }))
    vi.assert.isFalse(schema_02({ a: '' }))
    vi.assert.isFalse(schema_02({ a: '', b: 0 }))
    vi.assert.isTrue(schema_02({ a: 0 }))
    vi.assert.isTrue(schema_02({ b: '' }))
    vi.assert.isTrue(schema_02({ a: 0, b: 0 }))
    vi.assert.isTrue(schema_02({ a: '', b: '' }))

    vi.assert.isTrue(t.union.def([1, 2, 3])(1))
  })

  const ex_01 = t.tuple(
    t.any,
    t.optional(t.number),
    /* @ts-expect-error */
    t.number
  )

  vi.it('〖⛳️〗› ❲t.tuple❳', () => {
    vi.assertType<t.tuple<[]>>(t.tuple())
    vi.assertType<t.typeof<t.tuple<[]>>>(t.tuple()._type)
    vi.assertType<t.tuple<[t.never]>>(t.tuple(t.never))
    vi.assertType<t.tuple<[t.unknown]>>(t.tuple(t.unknown))
    vi.assertType<t.tuple<[t.string]>>(t.tuple(t.string))
    vi.assertType<t.typeof<t.tuple<[t.string]>>>(t.tuple(t.string)._type)
    vi.assertType<t.object<{ a: t.tuple<[t.string]> }>>(t.object({ a: t.tuple(t.string) }))
    vi.assertType<
      t.tuple<[
        t.any,
        t.optional<t.any>,
        t.invalid<TypeError<"A required element cannot follow an optional element.">>
      ]>
    >(
      t.tuple(
        t.any,
        t.optional(t.any),
        /* @ts-expect-error */
        t.number
      )
    )
    vi.assertType<
      t.object<{
        x: t.tuple<[
          t.any,
          t.optional<t.any>,
          t.invalid<TypeError<"A required element cannot follow an optional element.">>
        ]>
      }>
    >(
      t.object({
        x: t.tuple(
          t.any,
          t.optional(t.any),
          /* @ts-expect-error */
          t.number
        ),
      })
    )

    /****************/
    /** CASE: EMPTY */
    const schema_05 = t.tuple()
    vi.assert.isFunction(schema_05)
    vi.assert.equal(schema_05.tag, URI.tuple)
    vi.assert.isArray(schema_05.def)
    vi.assert.lengthOf(schema_05.def, 0)
    vi.assert.isFalse(schema_05({}))
    vi.assert.isFalse(schema_05([void 0]))
    vi.assert.isTrue(schema_05([]))
    /*********************/
    /** CASE: 1 REQUIRED */
    const schema_06 = t.tuple(t.string)
    vi.assert.isFunction(schema_06)
    vi.assert.equal(schema_06.tag, URI.tuple)
    vi.assert.isArray(schema_06.def)
    vi.assert.lengthOf(schema_06.def, 1)
    vi.assert.equal(schema_06.def[0].tag, URI.string)
    vi.assert.equal(schema_06.def[0].def, '')
    vi.assert.isFalse(schema_06({}))
    vi.assert.isFalse(schema_06([]))
    vi.assert.isFalse(schema_06([void 0]))
    vi.assert.isTrue(schema_06(['hi']))
    /*********************/
    /** CASE: 1 OPTIONAL */
    const schema_10 = t.tuple(
      t.optional(t.string),
      { optionalTreatment: 'treatUndefinedAndOptionalAsTheSame' }
    )
    vi.assert.isFalse(schema_10([]))
    vi.assert.isTrue(schema_10(['hi']))
    vi.assert.isTrue(schema_10([undefined]))
    /*********************************/
    /** CASE: 1 REQUIRED, 2 OPTIONAL */
    const schema_07 = t.tuple(t.any, t.optional(t.boolean), t.optional(t.number), { optionalTreatment: 'exactOptional' })
    vi.assert.isFunction(schema_07)
    vi.assert.equal(schema_07.tag, URI.tuple)
    vi.assert.isArray(schema_07.def)
    vi.assert.lengthOf(schema_07.def, 3)
    vi.assert.equal(schema_07.def[0].tag, URI.any)
    vi.assert.equal(schema_07.def[0].def, void 0)
    vi.assert.equal(schema_07.def[1].tag, URI.optional)
    vi.assert.equal(schema_07.def[1].def.tag, URI.boolean)
    vi.assert.equal(schema_07.def[1].def.def, false)
    vi.assert.equal(schema_07.def[2].tag, URI.optional)
    vi.assert.equal(schema_07.def[2].def.tag, URI.number)
    vi.assert.equal(schema_07.def[2].def.def, 0)
    vi.assert.isFalse(schema_07({}))
    vi.assert.isFalse(schema_07([]))
    vi.assert.isFalse(schema_07([void 0, void 0, void 0, void 0]))
    vi.assert.isFalse(schema_07([1, 'true', 0]))
    vi.assert.isFalse(schema_07([1, false, '0']))
    vi.assert.isTrue(schema_07([void 0]))
    vi.assert.isTrue(schema_07([1]))
    vi.assert.isTrue(schema_07([1, false, 0]))
    /*********************************/
    /** CASE: 2 REQUIRED, 1 OPTIONAL */
    const schema_08 = t.tuple(
      t.boolean,
      t.string,
      t.optional(t.number),
      { optionalTreatment: 'treatUndefinedAndOptionalAsTheSame' }
    )
    vi.assert.isFalse(schema_08([true, 0, 'hi']))
    vi.assert.isTrue(schema_08([true, 'hi', 0]))
    /******************************************/
    /** CASE: ALL REQUIRED, LAST IS UNDEFINED */
    const schema_09 = t.tuple(
      t.boolean,
      t.string,
      t.undefined,
      { optionalTreatment: 'treatUndefinedAndOptionalAsTheSame' }
    )
    vi.assert.isFalse(schema_09([true, 'hi']))
    vi.assert.isFalse(schema_09([true, 0, 'hi']))
    vi.assert.isTrue(schema_09([true, 'hi', undefined]))
  })

  vi.it('〖⛳️〗› ❲t.all❳: misc', () => {
    ///////////////////////////////////////////////////////////
    /// below: a buncha edge cases that fast-check found    ///
    /// - [ ] TODO: move each of these into the `examples`  ///
    ///       block of the property test that found it      ///
    ///////////////////////////////////////////////////////////
    const optionsForParityWithZod = {
      optionalTreatment: 'treatUndefinedAndOptionalAsTheSame'
    } as const

    const t_00 = t.object({ "aK/s_O'\\": t.union(t.any, t.string) }, optionsForParityWithZod)
    const z_00 = z.object({ "aK/s_O'\\": z.union([z.unknown(), z.string()]) })
    const i_00 = { "?^u+0\\o=9": [], "\"o'P,u=.": true, "h;u": {}, "P\"!YCfyj<U": "=V}QuN3J" }
    vi.assert.equal(t_00(i_00), z_00.safeParse(i_00).success)

    const t_01 = t.object({ "\\": t.optional(t.string) }, optionsForParityWithZod);
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

  vi.it('〖⛳️〗› ❲t.toString❳', () => {
    vi.expect(recurse.toString(t.never)).toMatchInlineSnapshot(`"t.never"`)
    vi.expect(recurse.toString(t.unknown)).toMatchInlineSnapshot(`"t.unknown"`)
    vi.expect(recurse.toString(t.any)).toMatchInlineSnapshot(`"t.any"`)
    vi.expect(recurse.toString(t.void)).toMatchInlineSnapshot(`"t.void"`)
    vi.expect(recurse.toString(t.null)).toMatchInlineSnapshot(`"t.null"`)
    vi.expect(recurse.toString(t.undefined)).toMatchInlineSnapshot(`"t.undefined"`)
    vi.expect(recurse.toString(t.symbol)).toMatchInlineSnapshot(`"t.symbol"`)
    vi.expect(recurse.toString(t.boolean)).toMatchInlineSnapshot(`"t.boolean"`)
    vi.expect(recurse.toString(t.bigint)).toMatchInlineSnapshot(`"t.bigint"`)
    vi.expect(recurse.toString(t.number)).toMatchInlineSnapshot(`"t.number"`)
    vi.expect(recurse.toString(t.string)).toMatchInlineSnapshot(`"t.string"`)
    vi.expect(recurse.toString(t.array(t.never))).toMatchInlineSnapshot(`"t.array(t.never)"`)
    vi.expect(recurse.toString(t.array(t.array(t.void)))).toMatchInlineSnapshot(`"t.array(t.array(t.void))"`)
    vi.expect(recurse.toString(t.array(t.array(t.array(t.symbol))))).toMatchInlineSnapshot(`"t.array(t.array(t.array(t.symbol)))"`)
    vi.expect(recurse.toString(t.record(t.unknown))).toMatchInlineSnapshot(`"t.record(t.unknown)"`)
    vi.expect(recurse.toString(t.record(t.record(t.unknown)))).toMatchInlineSnapshot(`"t.record(t.record(t.unknown))"`)
    vi.expect(recurse.toString(t.optional(t.any))).toMatchInlineSnapshot(`"t.optional(t.any)"`)
    vi.expect(recurse.toString(t.tuple())).toMatchInlineSnapshot(`"t.tuple()"`)
    vi.expect(recurse.toString(t.tuple(t.void))).toMatchInlineSnapshot(`"t.tuple(t.void)"`)
    vi.expect(recurse.toString(t.tuple(t.null))).toMatchInlineSnapshot(`"t.tuple(t.null)"`)
    vi.expect(recurse.toString(t.tuple(t.tuple()))).toMatchInlineSnapshot(`"t.tuple(t.tuple())"`)
    vi.expect(recurse.toString(t.object({}))).toMatchInlineSnapshot(`"t.object({})"`)

    vi.expect(recurse.toString(t.object({ a: t.string })))
      .toMatchInlineSnapshot(`"t.object({ a: t.string })"`)

    vi.expect(recurse.toString(t.object({ a: t.object({ b: t.string }) })))
      .toMatchInlineSnapshot(`"t.object({ a: t.object({ b: t.string }) })"`)

    vi.expect(recurse.toString(t.union())).toMatchInlineSnapshot(`"t.union()"`)
    vi.expect(recurse.toString(t.union(t.void))).toMatchInlineSnapshot(`"t.union(t.void)"`)
    vi.expect(recurse.toString(t.union(t.number, t.string))).toMatchInlineSnapshot(`"t.union(t.number, t.string)"`)
    vi.expect(recurse.toString(t.union(t.union(), t.union()))).toMatchInlineSnapshot(`"t.union(t.union(), t.union())"`)

    vi.expect(recurse.toString(t.union(t.tuple(t.union(), t.tuple(t.union())), t.string, t.union())))
      .toMatchInlineSnapshot(`"t.union(t.tuple(t.union(), t.tuple(t.union())), t.string, t.union())"`)

    vi.expect(recurse.toString(t.intersect())).toMatchInlineSnapshot(`"t.intersect()"`)
    vi.expect(recurse.toString(t.intersect(t.void))).toMatchInlineSnapshot(`"t.intersect(t.void)"`)
    vi.expect(recurse.toString(t.intersect(t.number, t.string))).toMatchInlineSnapshot(`"t.intersect(t.number, t.string)"`)
    vi.expect(recurse.toString(t.intersect(t.intersect(), t.intersect()))).toMatchInlineSnapshot(`"t.intersect(t.intersect(), t.intersect())"`)

    vi.expect(recurse.toString(t.intersect(t.tuple(t.intersect(), t.tuple(t.intersect())), t.string, t.union())))
      .toMatchInlineSnapshot(`"t.intersect(t.tuple(t.intersect(), t.tuple(t.intersect())), t.string, t.union())"`)

    vi.expect(recurse.toString(t.intersect(t.object({ a: t.string }), t.object({ b: t.number }))))
      .toMatchInlineSnapshot(`"t.intersect(t.object({ a: t.string }), t.object({ b: t.number }))"`)

    vi.expect(recurse.toString(t.intersect(t.object({ a: t.string }), t.object({ a: t.number }))))
      .toMatchInlineSnapshot(`"t.intersect(t.object({ a: t.string }), t.object({ a: t.number }))"`)
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema#config❳', () => {
  vi.it('〖⛳️〗› ❲t.configure(...)❳', () => {
    configure({ schema: { optionalTreatment: 'exactOptional' } })
    vi.expect(getConfig()).toMatchInlineSnapshot(`
      {
        "schema": {
          "eq": {
            "equalsFn": [Function],
          },
          "optionalTreatment": "exactOptional",
          "treatArraysAsObjects": false,
        },
      }
    `)
    configure({ schema: { optionalTreatment: 'presentButUndefinedIsOK' } })
    vi.expect(getConfig()).toMatchInlineSnapshot(`
      {
        "schema": {
          "eq": {
            "equalsFn": [Function],
          },
          "optionalTreatment": "presentButUndefinedIsOK",
          "treatArraysAsObjects": false,
        },
      }
    `)
    configure({ schema: { optionalTreatment: 'treatUndefinedAndOptionalAsTheSame' } })
    vi.expect(getConfig()).toMatchInlineSnapshot(`
      {
        "schema": {
          "eq": {
            "equalsFn": [Function],
          },
          "optionalTreatment": "treatUndefinedAndOptionalAsTheSame",
          "treatArraysAsObjects": false,
        },
      }
    `)
  })

  vi.it('〖⛳️〗› ❲{ optionalTreatment: "exactOptional" }❳', () => {
    configure({ schema: { optionalTreatment: 'exactOptional' } })
    vi.expect(getConfig()).toMatchInlineSnapshot(`
      {
        "schema": {
          "eq": {
            "equalsFn": [Function],
          },
          "optionalTreatment": "exactOptional",
          "treatArraysAsObjects": false,
        },
      }
    `)
    vi.assert.isTrue(t.object({ a: t.optional(t.string), b: t.string })({ b: '' }))
    vi.assert.isFalse(t.object({ a: t.optional(t.string), b: t.string })({}))
    vi.assert.isFalse(t.object({ a: t.optional(t.string), b: t.string })({ a: void 0 }))
    vi.assert.isFalse(t.object({ a: t.unknown })({}))
  })

  vi.it('〖⛳️〗› ❲{ optionalTreatment: "presentButUndefinedIsOk" }❳', () => {
    configure({ schema: { optionalTreatment: 'presentButUndefinedIsOK' } })
    vi.assert.isTrue(t.object({ a: t.optional(t.string), b: t.string })({ b: '' }))
    vi.assert.isFalse(t.object({ a: t.optional(t.string), b: t.string })({}))
    vi.assert.isFalse(t.object({ a: t.optional(t.string), b: t.string })({ a: '' }))
    vi.assert.isFalse(t.object({ a: t.optional(t.string), b: t.string })({ a: void 0 }))
    vi.assert.isTrue(t.object({ a: t.optional(t.string), b: t.string })({ a: void 0, b: '' }))
    vi.assert.isTrue(t.object({ a: t.optional(t.string), b: t.string })({ a: '', b: '' }))
  })

  vi.it('〖⛳️〗› ❲{ optionalTreatment: "treatUndefinedAndOptionalAsTheSame" }❳', () => {
    configure({ schema: { optionalTreatment: 'treatUndefinedAndOptionalAsTheSame' } })
    vi.assert.isTrue(t.object({ a: t.optional(t.string), b: t.string })({ b: '' }))
    vi.assert.isFalse(t.object({ a: t.optional(t.string), b: t.string })({}))
    vi.assert.isTrue(t.object({ a: t.optional(t.string), b: t.string })({ a: void 0, b: '' }))
  })

  vi.it('〖⛳️〗› ❲t.is❳', () => {
    vi.assert.isTrue(t.isCore(t.never))
    vi.assert.isTrue(t.isCore(t.any))
    vi.assert.isTrue(t.isCore(t.unknown))
    vi.assert.isTrue(t.isCore(t.void))
    vi.assert.isTrue(t.isCore(t.null))
    vi.assert.isTrue(t.isCore(t.undefined))
    vi.assert.isTrue(t.isCore(t.symbol))
    vi.assert.isTrue(t.isCore(t.boolean))
    vi.assert.isTrue(t.isCore(t.integer))
    vi.assert.isTrue(t.isCore(t.bigint))
    vi.assert.isTrue(t.isCore(t.number))
    vi.assert.isTrue(t.isCore(t.string))
    vi.assert.isTrue(t.isCore(t.array(t.any)))
    vi.assert.isTrue(t.isCore(t.eq(void 0)))
    vi.assert.isTrue(t.isCore(t.optional(t.any)))
    vi.assert.isTrue(t.isCore(t.array(t.any)))
    vi.assert.isTrue(t.isCore(t.record(t.any)))
    vi.assert.isTrue(t.isCore(t.tuple()))
    vi.assert.isTrue(t.isCore(t.union()))
    vi.assert.isTrue(t.isCore(t.intersect()))
    vi.assert.isTrue(t.isCore(t.tuple()))
    vi.assert.isTrue(t.isCore(t.object({})))

    vi.assert.isFalse(t.isCore(t.enum(1, 2, 3)))
    vi.assert.isFalse(t.isCore({}))
  })

  //////////////////////
  ///    coverage    ///
  vi.it('〖⛳️〗› ❲{ optionalTreatment: "treatUndefinedAndOptionalAsTheSame" }❳', () => {
    configure({ schema: { optionalTreatment: 'treatUndefinedAndOptionalAsTheSame' } })
    vi.assert.isTrue(t.object({ a: t.optional(t.string), b: t.string })({ b: '' }))
    vi.assert.isFalse(t.object({ a: t.optional(t.string), b: t.string })({}))
    vi.assert.isTrue(t.object({ a: t.optional(t.string), b: t.string })({ a: void 0, b: '' }))
  })

  vi.it('〖⛳️〗› ❲t.Functor❳', () => {
    vi.assert.throws(() => t.Functor.map(() => true)(false as never))
  })

  vi.it('〖⛳️〗› ❲t.IndexedFunctor❳', () => {
    vi.assert.throws(() => t.IndexedFunctor.mapWithIndex(() => true)(false as never, []))

    let ex_01 = t.foldWithIndex((x): any => x)(t.array(t.string) as never, [])
    let ex_02 = t.foldWithIndex((x): any => x)(t.array(t.string).min(3) as never, [])
    let ex_03 = t.foldWithIndex((x): any => x)(t.array(t.string).max(3) as never, [])
    let ex_04 = t.foldWithIndex((x): any => x)(t.array(t.string).min(1).max(3) as never, [])
    let ex_05 = t.foldWithIndex((x): any => x)(t.array(t.string).max(3).max(1) as never, [])
    let ex_06 = t.foldWithIndex((x): any => x)(t.array(t.string).between(1, 3) as never, [])
    let ex_07 = t.foldWithIndex((x): any => x)(t.array(t.string).between(3, 1) as never, [])

    vi.assert.deepEqual(omitMethods(ex_01 as {}), omitMethods(t.array(t.string)))
    vi.assert.deepEqual(omitMethods(ex_02 as {}), omitMethods(t.array(t.string).min(3)))
    vi.assert.deepEqual(omitMethods(ex_03 as {}), omitMethods(t.array(t.string).max(3)))
    vi.assert.deepEqual(omitMethods(ex_04 as {}), omitMethods(t.array(t.string).min(1).max(3)))
    vi.assert.deepEqual(omitMethods(ex_05 as {}), omitMethods(t.array(t.string).max(3).max(1)))
    vi.assert.deepEqual(omitMethods(ex_06 as {}), omitMethods(t.array(t.string).between(1, 3)))
    vi.assert.deepEqual(omitMethods(ex_07 as {}), omitMethods(t.array(t.string).between(3, 1)))
  })

  vi.it('〖⛳️〗› ❲t.isUnary❳', () => {
    vi.assert.isTrue(t.isUnary(t.array(t.string)))
    vi.assert.isFalse(t.isUnary(t.string))
    vi.assert.isFalse(t.isUnary({}))
  })

  vi.it('〖⛳️〗› ❲~replaceBooleanConstructor❳', () => {
    vi.assert.equal(replaceBooleanConstructor(globalThis.Boolean), t.nonnullable)
    vi.assert.equal(replaceBooleanConstructor(t.string), t.string)
  })

  vi.it('〖⛳️〗› ❲clone❳', () => {
    vi.assert.isFunction(clone(t.number))
    vi.assert.isTrue(clone(t.number)(2))
  })

  vi.it('〖⛳️〗› ❲t.isNullaryTag❳', () => {
    vi.assert.isTrue(t.isNullaryTag(URI.null))
    vi.assert.isFalse(t.isNullaryTag(URI.array))
  })

  vi.it('〖⛳️〗› ❲t.isBoundableTag❳', () => {
    vi.assert.isTrue(t.isBoundableTag(URI.string))
    vi.assert.isFalse(t.isBoundableTag(URI.null))
  })

  vi.it('〖⛳️〗› ❲~carryover❳', () => {
    vi.assert.deepEqual(carryover({}), {})
  })
  ///    coverage    ///
  //////////////////////
})
