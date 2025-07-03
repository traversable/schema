import * as vi from 'vitest'
import { fc, test } from '@fast-check/vitest'
import { type as arktype } from 'arktype'
import { t, recurse, configure } from '@traversable/schema'

import * as Seed from './seed.js'
import * as Ark from './to-arktype.js'
import { arbitrary, SchemaGenerator } from './test-utils.js'

const hasMessage = t.has('message', t.string)
const getErrorMessage = (e: unknown) => hasMessage(e) ? e.message : JSON.stringify(e, null, 2)

type LogFailureDeps = {
  ark?: arktype.Any
  t: t.Schema
  validData: unknown
  invalidData: unknown
}

configure({ schema: { optionalTreatment: 'exactOptional' } })

const buildTable = ({ validData, invalidData, ark, t }: LogFailureDeps) => ({
  'Input': JSON.stringify(validData, null, 2),
  'Schema (traversable)': recurse.schemaToString(t),
  'Result (traversable, validData)': t(validData),
  'Result (traversable, invalidData)': t(invalidData),
  'Schema (arktype)': ark ? ark.toString() : 'ArkType schema is not defined',
  'Result (arktype, validData)': typeof ark === 'function' ? JSON.stringify(ark(validData), null, 2)
    : !ark ? 'ArkType schema is not defined'
      : 'ark is not a function, ark: ' + JSON.stringify(ark),
  'Result (arktype, invalidData)': typeof ark === 'function' ? JSON.stringify(ark(invalidData), null, 2)
    : !ark ? 'ArkType schema is not defined'
      : 'ark is not a function, ark: ' + JSON.stringify(ark),
})

const logFailure = (logHeader: string, deps: LogFailureDeps) => {
  const table = buildTable(deps)
  console.group('\r\n\n\n[schema/test/to-arktype.test.ts]\nFAILURE: ' + logHeader)
  console.table(table)
  console.groupEnd()
}

const logFailureValidData = (logHeader: string, deps: LogFailureDeps) => {
  const { ["Result (traversable, invalidData)"]: _, ["Result (arktype, invalidData)"]: __, ...table } = buildTable(deps)
  console.group('\r\n\n\n[schema/test/to-arktype.test.ts]\nFAILURE: ' + logHeader)
  console.table(table)
  console.groupEnd()
}


const logFailureInvalidData = (logHeader: string, deps: LogFailureDeps) => {
  const { ["Result (traversable, validData)"]: _, ["Result (arktype, validData)"]: __, ...table } = buildTable(deps)
  console.group('\r\n\n\n[schema/test/to-arktype.test.ts]\nFAILURE: ' + logHeader)
  console.table(table)
  console.groupEnd()
}

vi.describe(
  '〖⛳️〗‹‹‹ ❲to-arktype❳: property-based tests',
  { timeout: 10_000 },
  () => {
    test.prop([arbitrary.jsonValue], {
      endOnFailure: true,
      // numRuns: 5_000,
    })(
      '〖⛳️〗› ❲Ark.fromJson❳: generates an ArkType schema from arbitrary JSON input',
      (json) => vi.assert.doesNotThrow(() => arktype(Ark.fromJson(json) as []))
    )

    test.prop([arbitrary.jsonValue], {
      endOnFailure: true,
      // numRuns: 5_000,
    })(
      '〖⛳️〗› ❲Ark.stringFromJson❳: constructs an ArkType schema from arbitrary JSON input',
      (json) => vi.assert.doesNotThrow(() => Ark.stringFromJson(json))
    )

    test.prop([SchemaGenerator()], {
      endOnFailure: true,
      // numRuns: 5_000,
    })(
      '〖⛳️〗› ❲Ark.fromTraversable❳: constructs an ArkType schema from arbitrary traversable input',
      (seed) => {
        const validData = fc.sample(Seed.arbitraryFromSchema(seed), 1)[0]
        const invalidData = fc.sample(Seed.invalidArbitraryFromSchema(seed), 1)[0]
        let ark: arktype.Any | undefined

        try { ark = Ark.fromTraversable(seed) }
        catch (e) {
          void logFailure('Ark.fromTraversable: construction', { ark, validData, invalidData, t: seed })
          vi.assert.fail(getErrorMessage(e))
        }

        try { vi.assert.notInstanceOf(ark(validData), arktype.errors) }
        catch (e) {
          void logFailureValidData('Ark.fromTraversable: accepts valid data', { ark, validData, invalidData, t: seed })
          vi.assert.fail(getErrorMessage(e))
        }

        try { vi.assert.instanceOf(ark(invalidData), arktype.errors) }
        catch (e) {
          void logFailureInvalidData('Ark.fromTraversable: rejects invalid data', { ark, validData, invalidData, t: seed })
          vi.assert.fail(getErrorMessage(e))
        }
      }
    )

    test.prop([SchemaGenerator()], {
      endOnFailure: true,
      // numRuns: 5_000,
    })(
      '〖⛳️〗› ❲Ark.stringFromTraversable❳: generates a ArkType schema from arbitrary traversable input',
      (seed) => {
        const validData = fc.sample(Seed.arbitraryFromSchema(seed), 1)[0]
        const invalidData = fc.sample(Seed.invalidArbitraryFromSchema(seed), 1)[0]
        let ark: arktype.Any | undefined

        try { ark = globalThis.Function('arktype', 'return ' + Ark.stringFromTraversable(seed))(arktype) }
        catch (e) {
          void logFailure('Ark.stringFromTraversable: construction', { ark, validData, invalidData, t: seed })
          vi.assert.fail(getErrorMessage(e))
        }

        try { vi.assert.notInstanceOf(ark!(validData), arktype.errors) }
        catch (e) {
          void logFailureValidData('Ark.stringFromTraversable: accepts valid data', { ark, validData, invalidData, t: seed })
          vi.assert.fail(getErrorMessage(e))
        }

        try { vi.assert.instanceOf(ark!(invalidData), arktype.errors) }
        catch (e) {
          void logFailureInvalidData('Ark.stringFromTraversable: rejects invalid data', { ark, validData, invalidData, t: seed })
          vi.assert.fail(getErrorMessage(e))
        }
      }
    )
  }
)

vi.it('〖⛳️〗› ❲Ark.stringFromJson❳', () => {
  vi.expect.soft(Ark.stringFromJson(
    { a: 1, b: [2, { c: '3' }], d: { e: false, f: true, g: [-0, null] } }
  )).toMatchInlineSnapshot
    (`"{ a: '1', b: ['2', { c: '"3"' }], d: { e: 'false', f: 'true', g: ['0', 'null'] } }"`)
})

vi.it('〖⛳️〗› ❲Ark.fromJson❳: constructs an ArkType schema from arbitrary JSON input', () => {
  vi.expect.soft(Ark.fromJson(
    { a: 1, b: [2, { c: '3' }], d: { e: false, f: true, g: [-0, null] } }
  )).toMatchInlineSnapshot
    (`
      {
        "a": "1",
        "b": [
          "2",
          {
            "c": ""3"",
          },
        ],
        "d": {
          "e": "false",
          "f": "true",
          "g": [
            "0",
            "null",
          ],
        },
      }
    `)
})

vi.it('〖⛳️〗› ❲Ark.stringFromTraversable❳: ', () => {
  vi.expect.soft(Ark.stringFromTraversable(
    t.record(t.optional(t.string)),
  )).toMatchInlineSnapshot
    (`"arktype.Record("string", arktype.string.or(arktype.undefined))"`)

  vi.expect.soft(Ark.stringFromTraversable(
    t.record(t.optional(t.union(t.string, t.number, t.boolean, t.null, t.undefined))),
    { format: true }
  )).toMatchInlineSnapshot
    (`
    "arktype.Record(
      "string",
      arktype(
      arktype.string
      ).or(
        arktype.number
      ).or(
        arktype.boolean
      ).or(
        arktype.null
      ).or(
        arktype.undefined
      ).or(
        arktype.undefined
      )
    )"
  `)

  vi.expect.soft(Ark.stringFromTraversable(
    t.record(t.string),
    { format: true },
  )).toMatchInlineSnapshot
    (`"arktype.Record("string", arktype.string)"`)

  vi.expect.soft(Ark.stringFromTraversable(
    t.object({ a: t.string, b: t.optional(t.boolean) }),
    { format: true },
  )).toMatchInlineSnapshot
    (`"arktype({ a: arktype.string, "b?": arktype.boolean.or(arktype.undefined) })"`)

  vi.expect.soft(Ark.stringFromTraversable(
    t.object({ a: t.string, b: t.optional(t.boolean) }),
    { exactOptional: true, format: true },
  )).toMatchInlineSnapshot
    (`"arktype({ a: arktype.string, "b?": arktype.boolean })"`)

  vi.expect.soft(Ark.stringFromTraversable(
    t.object({
      a: t.object({
        b: t.object({
          c: t.object({
            d: t.object({
              e: t.record(
                t.union(
                  t.object({
                    f: t.null,
                    g: t.optional(t.object({ h: t.string, i: t.boolean, }))
                  }),
                  t.object({
                    j: t.optional(t.union(t.string, t.integer))
                  })
                )
              )
            })
          })
        })
      })
    }),
    { format: true },
  )).toMatchInlineSnapshot
    (`
    "arktype({
      a: arktype({
        b: arktype({
          c: arktype({
            d: arktype({
              e: arktype.Record(
                "string",
                arktype(
                arktype({
                    f: arktype.null,
                    "g?": arktype({ h: arktype.string, i: arktype.boolean }).or(arktype.undefined)
                  })
                ).or(
                  arktype({
                    "j?": arktype(arktype.string).or(arktype.keywords.number.integer).or(arktype.undefined)
                  })
                )
              )
            })
          })
        })
      })
    })"
  `)

  vi.expect.soft(Ark.stringFromTraversable(
    t.object({
      _Y: t.union(t.undefined),
      Dud_UX9_$r: t.null,
      E_$: t.eq([
        [null, null, null, null, null, null],
        "q09edO28g",
        [[null, null, null, true, null, "-19884398"], false, null, null],
        "5aE6h01",
        null,
        {
          ze$H$_$__: null,
          $m___: null,
          Z: null,
          $_1$c: null,
          $T0$$: "6mQ47h7TA",
          _d_f$_: false,
          $PP: [],
          _$_3__: [null, null, null, null, null, null],
          x: null,
          m$60Q_3: null
        }
      ])
    }),
    { format: true }
  )).toMatchInlineSnapshot(`
    "arktype({
      _Y: arktype(arktype.undefined),
      Dud_UX9_$r: arktype.null,
      E_$: arktype([
        ['null', 'null', 'null', 'null', 'null', 'null'],
        '"q09edO28g"',
        [['null', 'null', 'null', 'true', 'null', '"-19884398"'], 'false', 'null', 'null'],
        '"5aE6h01"',
        'null',
        {
          ze$H$_$__: 'null',
          $m___: 'null',
          Z: 'null',
          $_1$c: 'null',
          $T0$$: '"6mQ47h7TA"',
          _d_f$_: 'false',
          $PP: [],
          _$_3__: ['null', 'null', 'null', 'null', 'null', 'null'],
          x: 'null',
          m$60Q_3: 'null'
        }
      ])
    })"
  `)

  vi.expect.soft(''
    + '   '
    + Ark.stringFromTraversable(
      t.union(
        t.union(t.integer),
        t.union(t.number, t.string),
      ),
      { format: true, maxWidth: 40, initialOffset: 4 }
    )).toMatchInlineSnapshot
    (`
      "   arktype(
          arktype(
            arktype.keywords.number.integer
            )
          ).or(
            arktype(
            arktype.number
            ).or(
              arktype.string
            )
          )"
    `)

  vi.expect.soft(''
    + '   '
    + Ark.stringFromTraversable(
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
      { format: true, initialOffset: 4 }
    )
  ).toMatchInlineSnapshot(`
    "   arktype([
          arktype({
            a: arktype(['1', ['2'], { "3": '4' }]),
            "b?": arktype.Record("string", arktype(arktype.number).or(arktype('1')).array()).or(
              arktype.undefined
            )
          })
        ])"
  `)

})
