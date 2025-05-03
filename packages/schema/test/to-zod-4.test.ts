import * as vi from 'vitest'
import { fc, test } from '@fast-check/vitest'
import { z } from 'zod4'
import { t, recurse } from '@traversable/schema'
import { Seed } from '@traversable/schema-seed'
import { v4 } from '@traversable/schema-zod-adapter'
import * as Zod from './to-zod-4.js'
import { SchemaGenerator, getErrorMessage, invalidDataToPaths } from './test-utils.js'


type ParseResult = { error?: { issues: { path: (keyof any)[] }[] } }
const EMPTY = { error: { issues: Array.of<{ path: (keyof any)[] }>() } } satisfies ParseResult
const safeParseResultToPaths = ({ error: { issues } = EMPTY.error }) => issues.map((iss) => iss.path.map(String))
const hasSafeParse = t.has('safeParse', (x) => typeof x === 'function')


test.prop([SchemaGenerator()], {
  endOnFailure: true,
  // numRuns: 10_000,
})(
  `〖⛳️〗› 
    
  ❲Zod.fromTraversable❳:

  Given a randomly generated @traversable schema, derives the corresponding zod@4 schema (in-memory).
        
  What we'd like to verify is that two schemas are isomorphic with respect to each other.

  To test that, we also generate the following artifacts:

    - valid data (using fast-check)
    - invalid data (using fast-check + a clever trick inspired by 'type-predicate-generator')
    - the list of paths to everywhere we planted invalid data
        
  Then, we use the derived zod schema to test that:

    1. the schema successfully parses the valid data
    2. the schema fails to parse the invalid data
    3. the errors that zod returns form a kind of "treasure map" to everywhere we planted invalid data

  Because this it generates its inputs randomly, running this test suite 10_000 times is enough to make us feel confident
  that the two are in fact isomorphic, at least for the schemas that this library has implemented.
  
  Prior art:
  
    - [type-predicate-generator](https://github.com/peter-leonov/type-predicate-generator)

  `
    .trim() + '\r\n\n',
  (seed) => {
    const parser = Zod.fromTraversable(seed).safeParse
    const validData = fc.sample(Seed.arbitraryFromSchema(seed), 1)[0]
    const invalidData = fc.sample(Seed.invalidArbitraryFromSchema(seed), 1)[0]
    const success = parser(validData)
    const failure = parser(invalidData)
    const failurePaths = safeParseResultToPaths(failure)
    const invalidPaths = invalidDataToPaths(invalidData)

    vi.assert.isUndefined(success.error?.issues)
    vi.assert.isNotEmpty(failure.error?.issues)
    /**
     * This test gives us a lot of confidence, since if the set of errors
     * paths exactly matches the set of paths pointing to everywhere we
     * planted invalid data, then we can rule out an entire
     * class of bugs related to false positives/false negatives
     */
    vi.assert.deepEqual(failurePaths, invalidPaths)
  }
)

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

vi.describe('〖⛳️〗‹‹‹ ❲to-zod-4❳: property-based tests', { timeout: 10_000 }, () => {
  test.prop([fc.jsonValue()], {
    endOnFailure: true,
    // numRuns: 5_000,
  })(
    '〖⛳️〗› ❲Zod.fromJson❳: constructs a zod@4 schema from arbitrary JSON input',
    (json) => {
      vi.assert.doesNotThrow(() => Zod.fromJson(json))
    }
  )

  test.prop([fc.jsonValue()], {
    endOnFailure: true,
    // numRuns: 5_000,
  })(
    '〖⛳️〗› ❲Zod.stringFromJson❳: generates a zod@4 schema from arbitrary JSON input',
    (json) => {
      vi.assert.doesNotThrow(() => Zod.stringFromJson(json))
    }
  )

  test.prop([SchemaGenerator()], {
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

      try { zod = Zod.fromTraversable(t, { preferInterface: false }) }
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

  test.prop([SchemaGenerator()], {
    endOnFailure: true,
    // numRuns: 5_000,
  })(
    '〖⛳️〗› ❲Zod.stringFromTraversable❳: generates a zod@4 schema from arbitrary traversable input',
    (t) => {
      const validData = fc.sample(Seed.arbitraryFromSchema(t), 1)[0]
      const invalidData = fc.sample(Seed.invalidArbitraryFromSchema(t), 1)[0]
      let zod: z.ZodType | undefined
      try { zod = globalThis.Function('z', 'return ' + Zod.stringFromTraversable(t))(z) }
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

vi.describe('〖⛳️〗‹‹‹ ❲to-zod-4❳: example-based tests', () => {

  vi.it('〖⛳️〗› ❲Zod.stringFromJson❳: examples (with formatting)', () => {
    vi.expect(Zod.stringFromJson(
      { a: 1, b: [2, { c: '3' }], d: { e: false, f: true, g: [9000, null] } },
      { format: true }
    )).toMatchInlineSnapshot
      (`
      "z.interface({
        a: z.literal(1),
        b: z.tuple([z.literal(2), z.interface({ c: z.literal("3") })]),
        d: z.interface({ e: z.literal(false), f: z.literal(true), g: z.tuple([z.literal(9000), z.null()]) })
      })"
    `)

    vi.expect(Zod.stringFromJson(
      [1_000_000, [2_000_000, { a: 1, b: [2, { c: '3' }], d: { e: false, f: true, g: [9000, null] } }]],
      { format: true }
    )).toMatchInlineSnapshot
      (`
      "z.tuple([
        z.literal(1000000),
        z.tuple([
          z.literal(2000000),
          z.interface({
            a: z.literal(1),
            b: z.tuple([z.literal(2), z.interface({ c: z.literal("3") })]),
            d: z.interface({
              e: z.literal(false),
              f: z.literal(true),
              g: z.tuple([z.literal(9000), z.null()])
            })
          })
        ])
      ])"
    `)
  })

  vi.it('〖⛳️〗› ❲Zod.stringFromTraversable❳: examples', () => {
    vi.expect(Zod.stringFromTraversable(
      t.never
    )).toMatchInlineSnapshot
      (`"z.never()"`)

    vi.expect(Zod.stringFromTraversable(
      t.any
    )).toMatchInlineSnapshot
      (`"z.any()"`)

    vi.expect(Zod.stringFromTraversable(
      t.unknown
    )).toMatchInlineSnapshot
      (`"z.unknown()"`)

    vi.expect(Zod.stringFromTraversable(
      t.void
    )).toMatchInlineSnapshot
      (`"z.void()"`)

    vi.expect(Zod.stringFromTraversable(
      t.null
    )).toMatchInlineSnapshot
      (`"z.null()"`)

    vi.expect(Zod.stringFromTraversable(
      t.undefined
    )).toMatchInlineSnapshot
      (`"z.undefined()"`)

    vi.expect(Zod.stringFromTraversable(
      t.boolean
    )).toMatchInlineSnapshot
      (`"z.boolean()"`)

    vi.expect(Zod.stringFromTraversable(
      t.integer
    )).toMatchInlineSnapshot
      (`"z.number().int()"`)

    vi.expect(Zod.stringFromTraversable(
      t.integer.max(3)
    )).toMatchInlineSnapshot
      (`"z.number().int().max(3)"`)

    vi.expect(Zod.stringFromTraversable(
      t.integer.min(3)
    )).toMatchInlineSnapshot
      (`"z.number().int().min(3)"`)

    vi.expect(Zod.stringFromTraversable(
      t.integer.between(0, 2)
    )).toMatchInlineSnapshot
      (`"z.number().int().min(0).max(2)"`)

    vi.expect(Zod.stringFromTraversable(
      t.number.between(0, 2)
    )).toMatchInlineSnapshot
      (`"z.number().min(0).max(2)"`)

    vi.expect(Zod.stringFromTraversable(
      t.number.lessThan(0)
    )).toMatchInlineSnapshot
      (`"z.number().lt(0)"`)

    vi.expect(Zod.stringFromTraversable(
      t.number.moreThan(0)
    )).toMatchInlineSnapshot
      (`"z.number().gt(0)"`)

    vi.expect(Zod.stringFromTraversable(
      t.number.max(10).moreThan(0)
    )).toMatchInlineSnapshot
      (`"z.number().gt(0).max(10)"`)

    vi.expect(Zod.stringFromTraversable(
      t.number
    )).toMatchInlineSnapshot
      (`"z.number()"`)

    vi.expect(Zod.stringFromTraversable(
      t.string
    )).toMatchInlineSnapshot
      (`"z.string()"`)

    vi.expect(Zod.stringFromTraversable(
      t.bigint
    )).toMatchInlineSnapshot
      (`"z.bigint()"`)


    vi.expect(Zod.stringFromTraversable(
      t.array(t.boolean)
    )).toMatchInlineSnapshot
      (`"z.array(z.boolean())"`)

    vi.expect(Zod.stringFromTraversable(
      t.array(t.boolean)
    )).toMatchInlineSnapshot
      (`"z.array(z.boolean())"`)

    vi.expect(Zod.stringFromTraversable(
      t.tuple(t.null)
    )).toMatchInlineSnapshot
      (`"z.tuple([z.null()])"`)

    vi.expect(Zod.stringFromTraversable(
      t.tuple(t.null, t.boolean),
    )).toMatchInlineSnapshot
      (`"z.tuple([z.null(), z.boolean()])"`)

    vi.expect(Zod.stringFromTraversable(
      t.object({ a: t.null, b: t.boolean, c: t.optional(t.void) }),
    )).toMatchInlineSnapshot
      (`"z.interface({ a: z.null(), b: z.boolean(), c: z.optional(z.void()) })"`)

    vi.expect(Zod.stringFromTraversable(
      t.object({ a: t.null, b: t.boolean, c: t.optional(t.void) }),
      { preferInterface: false },
    )).toMatchInlineSnapshot
      (`"z.object({ a: z.null(), b: z.boolean(), c: z.optional(z.void()) })"`)

    vi.expect(Zod.stringFromTraversable(
      t.tuple(
        t.object({ a: t.null, b: t.boolean, c: t.optional(t.void) }),
        t.object({ d: t.null, e: t.boolean, f: t.optional(t.void) }),
      ),
      { format: true, preferInterface: false }
    )).toMatchInlineSnapshot
      (`
      "z.tuple([
        z.object({ a: z.null(), b: z.boolean(), c: z.optional(z.void()) }),
        z.object({ d: z.null(), e: z.boolean(), f: z.optional(z.void()) })
      ])"
    `)

    vi.expect(Zod.stringFromTraversable(
      t.union(
        t.union(t.array(t.object({ a: t.null, b: t.boolean, c: t.optional(t.void) })), t.array(t.boolean)),
        t.union(t.object({ d: t.null, e: t.boolean, f: t.optional(t.void) })),
        t.union(t.object({ d: t.null, e: t.boolean, f: t.optional(t.void) })),
      ),
      { format: true, preferInterface: false }
    )).toMatchInlineSnapshot
      (`
      "z.union([
        z.union([
          z.array(z.object({ a: z.null(), b: z.boolean(), c: z.optional(z.void()) })),
          z.array(z.boolean())
        ]),
        z.union([z.object({ d: z.null(), e: z.boolean(), f: z.optional(z.void()) })]),
        z.union([z.object({ d: z.null(), e: z.boolean(), f: z.optional(z.void()) })])
      ])"
    `)


    vi.expect(Zod.stringFromTraversable(
      t.record(
        t.tuple(
          t.record(
            t.union(t.array(t.object({ a: t.null, b: t.boolean, c: t.optional(t.void) })), t.array(t.boolean)),
          ),
          t.union(t.object({ d: t.null, e: t.boolean, f: t.optional(t.void) })),
          t.union(t.object({ d: t.null, e: t.boolean, f: t.optional(t.void) })),
        )
      ),
      { format: true, preferInterface: false }
    )).toMatchInlineSnapshot
      (`
      "z.record(
        z.string(),
        z.tuple([
          z.record(
            z.string(),
            z.union([
              z.array(z.object({ a: z.null(), b: z.boolean(), c: z.optional(z.void()) })),
              z.array(z.boolean())
            ])
          ),
          z.union([z.object({ d: z.null(), e: z.boolean(), f: z.optional(z.void()) })]),
          z.union([z.object({ d: z.null(), e: z.boolean(), f: z.optional(z.void()) })])
        ])
      )"
    `)

    vi.expect(Zod.stringFromTraversable(
      t.intersect(
        t.record(
          t.tuple(
            t.record(
              t.union(t.array(t.object({ a: t.null, b: t.boolean, c: t.optional(t.void) })), t.array(t.boolean)),
            ),
            t.union(t.object({ d: t.null, e: t.boolean, f: t.optional(t.void) })),
            t.union(t.object({ d: t.null, e: t.boolean, f: t.optional(t.void) })),
          )
        ),
        t.record(
          t.tuple(
            t.record(
              t.union(t.array(t.object({ a: t.null, b: t.boolean, c: t.optional(t.void) })), t.array(t.boolean)),
            ),
            t.union(t.object({ d: t.null, e: t.boolean, f: t.optional(t.void) })),
            t.union(t.object({ g: t.optional(t.void), h: t.boolean, i: t.null })),
          )
        ),
      ),
      { format: true, preferInterface: false }
    )).toMatchInlineSnapshot
      (`
      "z.intersection(
        z.record(
          z.string(),
          z.tuple([
            z.record(
              z.string(),
              z.union([
                z.array(z.object({ a: z.null(), b: z.boolean(), c: z.optional(z.void()) })),
                z.array(z.boolean())
              ])
            ),
            z.union([z.object({ d: z.null(), e: z.boolean(), f: z.optional(z.void()) })]),
            z.union([z.object({ d: z.null(), e: z.boolean(), f: z.optional(z.void()) })])
          ])
        )
      ).and(
        z.record(
          z.string(),
          z.tuple([
            z.record(
              z.string(),
              z.union([
                z.array(z.object({ a: z.null(), b: z.boolean(), c: z.optional(z.void()) })),
                z.array(z.boolean())
              ])
            ),
            z.union([z.object({ d: z.null(), e: z.boolean(), f: z.optional(z.void()) })]),
            z.union([z.object({ g: z.optional(z.void()), h: z.boolean(), i: z.null() })])
          ])
        )
      )"
    `)


    vi.expect(Zod.stringFromTraversable(
      t.object({
        a: t.optional(t.null),
        b: t.optional(
          t.object({
            c: t.boolean
          })
        ),
        d: t.optional(
          t.array(
            t.object({
              e: t.string,
              f: t.bigint,
              g: t.undefined,
              h: t.optional(t.array(t.any))
            })
          )
        )
      }),
      { format: true, preferInterface: false },
    )).toMatchInlineSnapshot
      (`
      "z.object({
        a: z.optional(z.null()),
        b: z.optional(z.object({ c: z.boolean() })),
        d: z.optional(
          z.array(
            z.object({ e: z.string(), f: z.bigint(), g: z.undefined(), h: z.optional(z.array(z.any())) })
          )
        )
      })"
    `)

    vi.expect(''
      + '   '
      + Zod.stringFromTraversable(
        t.union(
          t.union(),
          t.union(t.number, t.string),
        ),
        { format: true, maxWidth: 40, preferInterface: false, initialOffset: 4 }
      )).toMatchInlineSnapshot
      (`
      "   z.union([
            z.union([]),
            z.union([z.number(), z.string()])
          ])"
    `)

    vi.expect(
      Zod.stringFromTraversable(
        t.tuple(
          t.object({
            a: t.eq([
              1,
              [2],
              { [3]: 4 }
            ]),
            b: t.optional(
              t.record(
                t.array(
                  t.union(
                    t.number,
                    t.eq(1),
                  )
                )
              )
            )
          })
        ),
        { format: true }
      )
    ).toMatchInlineSnapshot(`
      "z.tuple([
        z.interface({
          a: z.tuple([z.literal(1), z.tuple([z.literal(2)]), z.interface({ "3": z.literal(4) })]),
          b: z.optional(z.record(z.string(), z.array(z.union([z.number(), z.literal(1)]))))
        })
      ])"
    `)

    vi.expect(''
      + '   '
      + Zod.stringFromTraversable(
        t.array(t.eq(["-3", "le", null])),
        { format: true, maxWidth: 40, initialOffset: 4 }
      )
    ).toMatchInlineSnapshot
      (`
      "   z.array(
            z.tuple([
              z.literal("-3"),
              z.literal("le"),
              z.null()
            ])
          )"
    `)
  })

  vi.it('〖⛳️〗› ❲Zod.fromTraversable❳: examples', () => {
    vi.expect(v4.toString(Zod.fromTraversable(
      t.never
    ))).toMatchInlineSnapshot
      (`"z.never()"`)

    vi.expect(v4.toString(Zod.fromTraversable(
      t.any
    ))).toMatchInlineSnapshot
      (`"z.any()"`)

    vi.expect(v4.toString(Zod.fromTraversable(
      t.unknown
    ))).toMatchInlineSnapshot
      (`"z.unknown()"`)

    vi.expect(v4.toString(Zod.fromTraversable(
      t.void
    ))).toMatchInlineSnapshot
      (`"z.void()"`)

    vi.expect(v4.toString(Zod.fromTraversable(
      t.null
    ))).toMatchInlineSnapshot
      (`"z.null()"`)

    vi.expect(v4.toString(Zod.fromTraversable(
      t.undefined
    ))).toMatchInlineSnapshot
      (`"z.undefined()"`)

    vi.expect(v4.toString(Zod.fromTraversable(
      t.boolean
    ))).toMatchInlineSnapshot
      (`"z.boolean()"`)

    vi.expect(v4.toString(Zod.fromTraversable(
      t.integer
    ))).toMatchInlineSnapshot
      (`"z.number().int()"`)

    vi.expect(v4.toString(Zod.fromTraversable(
      t.integer.max(3)
    ))).toMatchInlineSnapshot
      (`"z.number().int().max(3)"`)

    vi.expect(v4.toString(Zod.fromTraversable(
      t.integer.min(3)
    ))).toMatchInlineSnapshot
      (`"z.number().int().min(3)"`)

    vi.expect(v4.toString(Zod.fromTraversable(
      t.integer.between(0, 2)
    ))).toMatchInlineSnapshot
      (`"z.number().int().min(0).max(2)"`)

    vi.expect(v4.toString(Zod.fromTraversable(
      t.number.between(0, 2)
    ))).toMatchInlineSnapshot
      (`"z.number().min(0).max(2)"`)

    vi.expect(v4.toString(Zod.fromTraversable(
      t.number.lessThan(0)
    ))).toMatchInlineSnapshot
      (`"z.number().lt(0)"`)

    vi.expect(v4.toString(Zod.fromTraversable(
      t.number.moreThan(0)
    ))).toMatchInlineSnapshot
      (`"z.number().gt(0)"`)

    vi.expect(v4.toString(Zod.fromTraversable(
      t.number.max(10).moreThan(0)
    ))).toMatchInlineSnapshot
      (`"z.number().max(10).gt(0)"`)

    vi.expect(v4.toString(Zod.fromTraversable(
      t.number
    ))).toMatchInlineSnapshot
      (`"z.number()"`)

    vi.expect(v4.toString(Zod.fromTraversable(
      t.string
    ))).toMatchInlineSnapshot
      (`"z.string()"`)

    vi.expect(v4.toString(Zod.fromTraversable(
      t.bigint
    ))).toMatchInlineSnapshot
      (`"z.bigint()"`)

    vi.expect(v4.toString(Zod.fromTraversable(
      t.array(t.boolean)
    ))).toMatchInlineSnapshot
      (`"z.array(z.boolean())"`)

    vi.expect(v4.toString(Zod.fromTraversable(
      t.array(t.string).min(10)
    ))).toMatchInlineSnapshot
      (`"z.array(z.string()).min(10)"`)

    vi.expect(v4.toString(Zod.fromTraversable(
      t.array(t.string).min(1).max(10)
    ))).toMatchInlineSnapshot
      (`"z.array(z.string()).min(1).max(10)"`)

    vi.expect(v4.toString(Zod.fromTraversable(
      t.tuple(t.null)
    ))).toMatchInlineSnapshot
      (`"z.tuple([z.null()])"`)

    vi.expect(v4.toString(Zod.fromTraversable(
      t.tuple(t.null, t.boolean)
    ))).toMatchInlineSnapshot
      (`"z.tuple([z.null(), z.boolean()])"`)

    vi.expect(v4.toString(Zod.fromTraversable(
      t.object({ a: t.null, b: t.boolean, c: t.optional(t.void) })
    ))).toMatchInlineSnapshot
      (`"z.interface({ a: z.null(), b: z.boolean(), c: z.void().optional() })"`)

    vi.expect(v4.toString(Zod.fromTraversable(
      t.object({ a: t.null, b: t.boolean, c: t.optional(t.void) }),
      { preferInterface: false })
    )).toMatchInlineSnapshot
      (`"z.object({ a: z.null(), b: z.boolean(), c: z.void().optional() })"`)
  })

  vi.it('〖⛳️〗› ❲Zod.fromJson❳: examples', () => {
    const source = Zod.fromJson({
      a: 1,
      b: [
        -2,
        {
          c: '3',
          d: 'four',
        }
      ],
      e: {
        f: false,
        g: true,
        h: [
          'power-level',
          +9000,
          null
        ]
      }
    })

    const target = z.interface({
      a: z.literal(1),
      b: z.tuple([
        z.literal(-2),
        z.interface({
          c: z.literal('3'),
          d: z.literal('four'),
        })
      ]),
      e: z.interface({
        f: z.literal(false),
        g: z.literal(true),
        h: z.tuple([
          z.literal('power-level'),
          z.literal(+9000),
          z.null(),
        ]),
      }),
    })

    vi
      .expectTypeOf(source._zod.output)
      .toEqualTypeOf(target._zod.output)

    vi.expect(v4.toString(source)).toMatchInlineSnapshot
      (`
      "z.interface({
        a: z.literal(1),
        b: z.tuple([z.literal(-2), z.interface({ c: z.literal("3"), d: z.literal("four") })]),
        e: z.interface({
          f: z.literal(false),
          g: z.literal(true),
          h: z.tuple([z.literal("power-level"), z.literal(9000), z.null()])
        })
      })"
    `)
  })
})
