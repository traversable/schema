import * as vi from 'vitest'
import { fc, test } from '@fast-check/vitest'
import { z } from 'zod4'
import { v4 } from '@traversable/schema-zod-adapter'

import { t, recurse } from '@traversable/schema'

import * as Seed from './seed.js'
import * as Zod from './to-zod-4.js'
import * as Ark from './to-arktype.js'
import { omit, pick } from '@traversable/registry'

const hasMessage = t.has('message', t.string)
const hasSafeParse = t.has('safeParse', (x) => typeof x === 'function')
const getErrorMessage = (e: unknown) => hasMessage(e) ? e.message : JSON.stringify(e, null, 2)

type LogFailureDeps = {
  zod?: z.ZodType
  t: t.Schema
  validData: unknown
  invalidData: unknown
}

const buildTable = ({ validData, invalidData, zod, t }: LogFailureDeps) => ({
  'Input': JSON.stringify(validData, (k, v) => v === undefined ? 'undefined' : typeof v === 'symbol' ? String(v) : v),
  'Schema (zod@4)': zod ? v4.toString(zod) : 'zod schema is not defined',
  'Schema (traversable)': recurse.toString(t),
  'Result (traversable, validData)': t(validData),
  'Result (traversable, invalidData)': t(invalidData),
  'Result (zod@4, validData)': hasSafeParse(zod) ? JSON.stringify(zod.safeParse(validData).error)
    : !zod ? 'zod schema is not defined'
      : 'zod.safeParse is not a function, got: ' + JSON.stringify(zod),
  'Result (zod@4, invalidData)': hasSafeParse(zod) ? JSON.stringify(zod.safeParse(invalidData).error)
    : !zod ? 'zod schema is not defined'
      : 'zod.safeParse is not a function, got: ' + JSON.stringify(zod),
})

const logFailure = (logHeader: string, deps: LogFailureDeps) => {
  const table = buildTable(deps)
  console.group('\r\n\n\n[schema/test/to-zod-4.test.ts]\nFAILURE: ' + logHeader)
  console.table(table)
  console.groupEnd()
}

const logValidFailure = (logHeader: string, deps: LogFailureDeps) => {
  const { ["Result (traversable, invalidData)"]: _, ["Result (zod@4, invalidData)"]: __, ...table } = buildTable(deps)
  console.group('\r\n\n\n[schema/test/to-zod-4.test.ts]\nFAILURE: ' + logHeader)
  console.table(table)
  console.groupEnd()
}


const logInvalidFailure = (logHeader: string, deps: LogFailureDeps) => {
  const { ["Result (traversable, validData)"]: _, ["Result (zod@4, validData)"]: __, ...table } = buildTable(deps)
  console.group('\r\n\n\n[schema/test/to-zod-4.test.ts]\nFAILURE: ' + logHeader)
  console.table(table)
  console.groupEnd()
}


const exclude = [
  'never',
  'symbol',
  'any',
  'unknown',
  'intersect',
  'bigint',
] as const satisfies string[]

const jsonArbitrary = fc.letrec(
  (go) => ({
    null: fc.constant(null),
    boolean: fc.boolean(),
    number: Ark.arbitrary.int32toFixed,
    // TODO: kinda cheating here, eventually we should dig up arktype's BNF and escape this properly...
    string: Ark.arbitrary.alphanumeric,
    array: fc.array(go('tree')) as fc.Arbitrary<fc.JsonValue[]>,
    object: fc.dictionary(Ark.arbitrary.ident, go('tree')) as fc.Arbitrary<Record<string, fc.JsonValue>>,
    tree: fc.oneof(
      go('null'),
      go('boolean'),
      go('number'),
      go('string'),
      go('array'),
      go('object'),
    ) as fc.Arbitrary<fc.JsonValue>,
  })
).tree


const SchemaGenerator = Seed.schemaWithMinDepth({ exclude, eq: { jsonArbitrary } }, 3)

vi.describe('〖⛳️〗‹‹‹ ❲to-zod-4❳: example-based tests', () => {

  vi.it('〖⛳️〗› ❲Zod.stringFromJson❳: examples', () => {

    vi.expect(Zod.stringFromJson()(
      { a: 1, b: [2, { c: '3' }], d: { e: false, f: true, g: [9000, null] } }
    )).toMatchInlineSnapshot
      (`
      "z.interface({
        a: z.literal(1),
        b: z.tuple([z.literal(2), z.interface({ c: z.literal("3") })]),
        d: z.interface({
          e: z.literal(false),
          f: z.literal(true),
          g: z.tuple([z.literal(9000), z.null()])
        })
      })"
    `)

  })

  vi.it('〖⛳️〗› ❲Zod.stringFromTraversable❳: examples', () => {
    vi.expect(
      Zod.stringFromTraversable()(
        t.never
      )
    ).toMatchInlineSnapshot
      (`"z.never()"`)

    vi.expect(
      Zod.stringFromTraversable()(
        t.any
      )
    ).toMatchInlineSnapshot
      (`"z.any()"`)

    vi.expect(
      Zod.stringFromTraversable()(
        t.unknown
      )
    ).toMatchInlineSnapshot
      (`"z.unknown()"`)

    vi.expect(
      Zod.stringFromTraversable()(
        t.void
      )
    ).toMatchInlineSnapshot
      (`"z.void()"`)

    vi.expect(
      Zod.stringFromTraversable()(
        t.null
      )
    ).toMatchInlineSnapshot
      (`"z.null()"`)

    vi.expect(
      Zod.stringFromTraversable()(
        t.undefined
      )
    ).toMatchInlineSnapshot
      (`"z.undefined()"`)

    vi.expect(
      Zod.stringFromTraversable()(
        t.boolean
      )
    ).toMatchInlineSnapshot
      (`"z.boolean()"`)

    vi.expect(
      Zod.stringFromTraversable()(
        t.integer
      )
    ).toMatchInlineSnapshot
      (`"z.number().int()"`)

    vi.expect(
      Zod.stringFromTraversable()(
        t.integer.max(3)
      )
    ).toMatchInlineSnapshot
      (`"z.number().int().max(3)"`)

    vi.expect(
      Zod.stringFromTraversable()(
        t.integer.min(3)
      )
    ).toMatchInlineSnapshot
      (`"z.number().int().min(3)"`)

    vi.expect(
      Zod.stringFromTraversable()(
        t.integer.between(0, 2)
      )
    ).toMatchInlineSnapshot
      (`"z.number().int().min(0).max(2)"`)

    vi.expect(
      Zod.stringFromTraversable()(
        t.number.between(0, 2)
      )
    ).toMatchInlineSnapshot
      (`"z.number().min(0).max(2)"`)


    vi.expect(
      Zod.stringFromTraversable()(
        t.number.lessThan(0)
      )
    ).toMatchInlineSnapshot
      (`"z.number().lt(0)"`)

    vi.expect(
      Zod.stringFromTraversable()(
        t.number.moreThan(0)
      )
    ).toMatchInlineSnapshot
      (`"z.number().gt(0)"`)

    vi.expect(
      Zod.stringFromTraversable()(
        t.number.max(10).moreThan(0)
      )
    ).toMatchInlineSnapshot
      (`"z.number().gt(0).max(10)"`)

    vi.expect(
      Zod.stringFromTraversable()(
        t.number
      )
    ).toMatchInlineSnapshot
      (`"z.number()"`)

    vi.expect(
      Zod.stringFromTraversable()(
        t.string
      )
    ).toMatchInlineSnapshot
      (`"z.string()"`)

    vi.expect(
      Zod.stringFromTraversable()(
        t.bigint
      )
    ).toMatchInlineSnapshot
      (`"z.bigint()"`)


    vi.expect(
      Zod.stringFromTraversable()(
        t.array(t.boolean)
      )
    ).toMatchInlineSnapshot
      (`"z.array(z.boolean())"`)

    vi.expect(
      Zod.stringFromTraversable()(
        t.tuple(t.null)
      )
    ).toMatchInlineSnapshot
      (`"z.tuple([z.null()])"`)

    vi.expect(
      Zod.stringFromTraversable()(
        t.tuple(t.null, t.boolean)
      )
    ).toMatchInlineSnapshot
      (`"z.tuple([z.null(), z.boolean()])"`)

    vi.expect(
      Zod.stringFromTraversable()(
        t.object({ a: t.null, b: t.boolean, c: t.optional(t.void) })
      )
    ).toMatchInlineSnapshot
      (`"z.interface({ "a": z.null(), "b": z.boolean(), "c": z.optional(z.void()) })"`)

    vi.expect(
      Zod.stringFromTraversable({ object: { preferInterface: false } })(
        t.object({ a: t.null, b: t.boolean, c: t.optional(t.void) })
      )
    ).toMatchInlineSnapshot
      (`"z.object({ "a": z.null(), "b": z.boolean(), "c": z.optional(z.void()) })"`)

  })

  vi.it('〖⛳️〗› ❲Zod.fromTraversable❳: examples', () => {
    vi.expect(
      v4.toString(
        Zod.fromTraversable()(
          t.never
        )
      )
    ).toMatchInlineSnapshot
      (`"z.never()"`)

    vi.expect(
      v4.toString(
        Zod.fromTraversable()(
          t.any
        )
      )
    ).toMatchInlineSnapshot
      (`"z.any()"`)


    vi.expect(
      v4.toString(
        Zod.fromTraversable()(
          t.unknown
        )
      )
    ).toMatchInlineSnapshot
      (`"z.unknown()"`)

    vi.expect(
      v4.toString(
        Zod.fromTraversable()(
          t.void
        )
      )
    ).toMatchInlineSnapshot
      (`"z.void()"`)

    vi.expect(
      v4.toString(
        Zod.fromTraversable()(
          t.null
        )
      )
    ).toMatchInlineSnapshot
      (`"z.null()"`)

    vi.expect(
      v4.toString(
        Zod.fromTraversable()(
          t.undefined
        )
      )
    ).toMatchInlineSnapshot
      (`"z.undefined()"`)

    vi.expect(
      v4.toString(
        Zod.fromTraversable()(
          t.boolean
        )
      )
    ).toMatchInlineSnapshot
      (`"z.boolean()"`)

    vi.expect(
      v4.toString(
        Zod.fromTraversable()(
          t.integer
        )
      )
    ).toMatchInlineSnapshot
      (`"z.number().int()"`)

    vi.expect(
      v4.toString(
        Zod.fromTraversable()(
          t.integer.max(3)
        )
      )
    ).toMatchInlineSnapshot
      (`"z.number().int().max(3)"`)

    vi.expect(
      v4.toString(
        Zod.fromTraversable()(
          t.integer.min(3)
        )
      )
    ).toMatchInlineSnapshot
      (`"z.number().int().min(3)"`)

    vi.expect(
      v4.toString(
        Zod.fromTraversable()(
          t.integer.between(0, 2)
        )
      )
    ).toMatchInlineSnapshot
      (`"z.number().int().min(0).max(2)"`)

    vi.expect(
      v4.toString(
        Zod.fromTraversable()(
          t.number.between(0, 2)
        )
      )
    ).toMatchInlineSnapshot
      (`"z.number().min(0).max(2)"`)


    vi.expect(
      v4.toString(
        Zod.fromTraversable()(
          t.number.lessThan(0)
        )
      )
    ).toMatchInlineSnapshot
      (`"z.number().lt(0)"`)

    vi.expect(
      v4.toString(
        Zod.fromTraversable()(
          t.number.moreThan(0)
        )
      )
    ).toMatchInlineSnapshot
      (`"z.number().gt(0)"`)

    vi.expect(
      v4.toString(
        Zod.fromTraversable()(
          t.number.max(10).moreThan(0)
        )
      )
    ).toMatchInlineSnapshot
      (`"z.number().max(10).gt(0)"`)

    vi.expect(
      v4.toString(
        Zod.fromTraversable()(
          t.number
        )
      )
    ).toMatchInlineSnapshot
      (`"z.number()"`)

    vi.expect(
      v4.toString(
        Zod.fromTraversable()(
          t.string
        )
      )
    ).toMatchInlineSnapshot
      (`"z.string()"`)

    vi.expect(
      v4.toString(
        Zod.fromTraversable()(
          t.bigint
        )
      )
    ).toMatchInlineSnapshot
      (`"z.bigint()"`)

    vi.expect(
      v4.toString(
        Zod.fromTraversable()(
          t.array(t.boolean)
        )
      )
    ).toMatchInlineSnapshot
      (`"z.array(z.boolean())"`)

    vi.expect(
      v4.toString(
        Zod.fromTraversable()(
          t.array(t.string).min(10)
        )
      )
    ).toMatchInlineSnapshot
      (`"z.array(z.string()).min(10)"`)

    vi.expect(
      v4.toString(
        Zod.fromTraversable()(
          t.array(t.string).min(1).max(10)
        )
      )
    ).toMatchInlineSnapshot
      (`"z.array(z.string()).min(1).max(10)"`)

    vi.expect(
      v4.toString(
        Zod.fromTraversable()(
          t.tuple(t.null)
        )
      )
    ).toMatchInlineSnapshot
      (`"z.tuple([z.null()])"`)

    vi.expect(
      v4.toString(
        Zod.fromTraversable()(
          t.tuple(t.null, t.boolean)
        )
      )
    ).toMatchInlineSnapshot
      (`"z.tuple([z.null(), z.boolean()])"`)

    vi.expect(
      v4.toString(
        Zod.fromTraversable()(
          t.object({ a: t.null, b: t.boolean, c: t.optional(t.void) })
        )
      )
    ).toMatchInlineSnapshot
      (`"z.interface({ a: z.null(), b: z.boolean(), c: z.void().optional() })"`)

    vi.expect(
      v4.toString(
        Zod.fromTraversable({ object: { preferInterface: false } })(
          t.object({ a: t.null, b: t.boolean, c: t.optional(t.void) })
        )
      )
    ).toMatchInlineSnapshot
      (`"z.object({ a: z.null(), b: z.boolean(), c: z.void().optional() })"`)
  })

  vi.it('〖⛳️〗› ❲Zod.fromJson❳: examples', () => {
    vi.expect(v4.toString(Zod.fromJson()(
      { a: 1, b: [-2, { c: '3' }], d: { e: false, f: true, g: [9000, null] } }
    ))).toMatchInlineSnapshot
      (`
      "z.interface({
        a: z.literal(1),
        b: z.tuple([z.literal(-2), z.interface({ c: z.literal("3") })]),
        d: z.interface({
          e: z.literal(false),
          f: z.literal(true),
          g: z.tuple([z.literal(9000), z.null()])
        })
      })"
    `)
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲to-zod-4❳: property-based tests', { timeout: 10_000 }, () => {
  test.prop([fc.jsonValue()], {
    endOnFailure: true,
    // numRuns: 5_000,
  })(
    '〖⛳️〗› ❲Zod.fromJson❳: constructs a zod@4 schema from arbitrary JSON input',
    (json) => {
      vi.assert.doesNotThrow(() => Zod.fromJson()(json))
    }
  )

  test.prop([fc.jsonValue()], {
    endOnFailure: true,
    // numRuns: 5_000,
  })(
    '〖⛳️〗› ❲Zod.stringFromJson❳: generates a zod@4 schema from arbitrary JSON input',
    (json) => {
      vi.assert.doesNotThrow(() => Zod.stringFromJson()(json))
    }
  )

  test.prop([SchemaGenerator], {
    endOnFailure: true,
    // numRuns: 5_000,
  })(
    '〖⛳️〗› ❲Zod.fromTraversable❳: constructs a zod@4 schema from arbitrary traversable input',
    (t) => {
      const validArbitrary = Seed.arbitraryFromSchema(t)
      const invalidArbitrary = Seed.invalidArbitraryFromSchema(t)
      const validData = fc.sample(validArbitrary, 1)[0]
      const invalidData = fc.sample(invalidArbitrary, 1)[0]
      let zod: z.ZodType | undefined

      try { zod = Zod.fromTraversable({ object: { preferInterface: false } })(t) }
      catch (e) {
        void logFailure('Zod.fromTraversable: construction', { zod, t, validData, invalidData })
        vi.assert.fail(getErrorMessage(e))
      }

      try { vi.assert.isDefined(zod); vi.assert.doesNotThrow(() => zod.parse(validData)) }
      catch (e) {
        void logValidFailure('Zod.fromTraversable: accepts valid data', { zod, t, validData, invalidData })
        vi.assert.fail(getErrorMessage(e))
      }

      try { vi.assert.isDefined(zod); vi.assert.throws(() => zod.parse(invalidData)) }
      catch (e) {
        void logInvalidFailure('Zod.fromTraversable: rejects invalid data', { zod, t, validData, invalidData })
        vi.assert.fail(getErrorMessage(e))
      }
    }
  )

  test.prop([SchemaGenerator], {
    endOnFailure: true,
    // numRuns: 5_000,
  })(
    '〖⛳️〗› ❲Zod.stringFromTraversable❳: generates a zod@4 schema from arbitrary traversable input',
    (t) => {
      const validData = fc.sample(Seed.arbitraryFromSchema(t), 1)[0]
      const invalidData = fc.sample(Seed.invalidArbitraryFromSchema(t), 1)[0]
      let zod: z.ZodType | undefined
      try { zod = globalThis.Function('z', 'return ' + Zod.stringFromTraversable()(t))(z) }
      catch (e) {
        void logFailure('Zod.stringFromTraversable: construction', { zod, t, validData, invalidData })
        vi.assert.fail(getErrorMessage(e))
      }

      try { vi.assert.isDefined(zod); vi.assert.doesNotThrow(() => zod.parse(validData)) }
      catch (e) {
        void logValidFailure('Zod.stringFromTraversable: accepts valid data', { zod, t, validData, invalidData })
        vi.assert.fail(getErrorMessage(e))
      }

      try { vi.assert.isDefined(zod); vi.assert.throws(() => zod.parse(invalidData)) }
      catch (e) {
        void logInvalidFailure('Zod.stringFromTraversable: rejects invalid data', { zod, t, validData, invalidData })
        vi.assert.fail(getErrorMessage(e))
      }
    }
  )
})
