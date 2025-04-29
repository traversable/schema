import * as vi from 'vitest'
import { fc, test } from '@fast-check/vitest'
import { type as arktype } from 'arktype'

import { t, recurse } from '@traversable/schema'

import * as Seed from './seed.js'
import * as Ark from './to-arktype.js'

const hasMessage = t.has('message', t.string)
const getErrorMessage = (e: unknown) => hasMessage(e) ? e.message : JSON.stringify(e, null, 2)

type LogFailureDeps = {
  ark?: arktype.Any
  t: t.Schema
  validData: unknown
  invalidData: unknown
}

const buildTable = ({ validData, invalidData, ark, t }: LogFailureDeps) => ({
  'Input': JSON.stringify(validData, null, 2),
  'Result (traversable)': t(invalidData),
  'Schema (arktype)': ark ? ark.toString() : 'ArkType schema is not defined',
  'Schema (traversable)': recurse.toString(t),
  'Result (arktype)': typeof ark === 'function' ? JSON.stringify(ark(validData), null, 2)
    : !ark ? 'ArkType schema is not defined'
      : 'ark is not a function, ark: ' + JSON.stringify(ark),
})

const logFailure = (logHeader: string, deps: LogFailureDeps) => {
  const table = buildTable(deps)
  console.group('\r\n\n\n[schema/test/to-arktype.test.ts]\nFAILURE: ' + logHeader)
  console.table(table)
  console.groupEnd()
}

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

const exclude = [
  'never',
  'symbol',
  'any',
  'unknown',
  'intersect',
] as const satisfies string[]

const SchemaGenerator = Seed.schemaWithMinDepth({
  exclude,
  eq: { jsonArbitrary },
  // TODO: Rip out when this issue is resolved: https://github.com/arktypeio/arktype/issues/1440
  union: { maxLength: 2, minLength: 1 }
}, 3)

vi.describe('〖⛳️〗‹‹‹ ❲to-arktype❳', () => {
  test.prop([jsonArbitrary], {
    endOnFailure: true,
    // numRuns: 5_000,
  })(
    '〖⛳️〗› ❲Ark.stringFromJson❳: code-generates an ArkType schema from arbitrary JSON input',
    (json) => {
      vi.assert.doesNotThrow(() => Ark.stringFromJson()(json))
    }
  )

  test.prop([jsonArbitrary], {
    endOnFailure: true,
    // numRuns: 5_000,
  })(
    '〖⛳️〗› ❲Ark.fromJson❳: constructs an ArkType schema from arbitrary JSON input',
    (json) => {
      vi.assert.doesNotThrow(() => arktype(Ark.fromJson()(json) as []))
    }
  )

  test.prop([SchemaGenerator], {
    endOnFailure: true,
    // numRuns: 5_000 
  })(
    '〖⛳️〗› ❲Ark.stringFromTraversable❳: code-generates a ArkType schema from arbitrary traversable input',
    (t) => {
      const validData = fc.sample(Seed.arbitraryFromSchema(t), 1)[0]
      const invalidData = fc.sample(Seed.invalidArbitraryFromSchema(t), 1)[0]
      let ark: arktype.Any | undefined

      try { ark = globalThis.Function('arktype', 'return ' + Ark.stringFromTraversable()(t))(arktype) }
      catch (e) {
        void logFailure('Ark.stringFromTraversable: construction', { ark, t, validData, invalidData })
        vi.assert.fail(getErrorMessage(e))
      }

      try { vi.assert.notInstanceOf(ark!(validData), arktype.errors) }
      catch (e) {
        void logFailure('Ark.stringFromTraversable: accepts valid data', { ark, t, validData, invalidData })
        vi.assert.fail(getErrorMessage(e))
      }

      try { vi.assert.instanceOf(ark!(invalidData), arktype.errors) }
      catch (e) {
        void logFailure('Ark.stringFromTraversable: rejects invalid data', { ark, t, validData, invalidData })
        vi.assert.fail(getErrorMessage(e))
      }
    }
  )

  test.prop([SchemaGenerator], {
    endOnFailure: true,
    // numRuns: 5_000,
  })(
    '〖⛳️〗› ❲Ark.fromTraversable❳: constructs an ArkType schema from arbitrary traversable input',
    (t) => {
      const validArbitrary = Seed.arbitraryFromSchema(t)
      const invalidArbitrary = Seed.invalidArbitraryFromSchema(t)
      const validData = fc.sample(validArbitrary, 1)[0]
      const invalidData = fc.sample(invalidArbitrary, 1)[0]
      let ark: arktype.Any | undefined

      try { ark = Ark.fromTraversable()(t) }
      catch (e) {
        void logFailure('Ark.fromTraversable: construction', { ark, t, validData, invalidData })
        vi.assert.fail(getErrorMessage(e))
      }

      try { vi.assert.notInstanceOf(ark(validData), arktype.errors) }
      catch (e) {
        void logFailure('Ark.fromTraversable: accepts valid data', { ark, t, validData, invalidData })
        vi.assert.fail(getErrorMessage(e))
      }

      try { vi.assert.instanceOf(ark(invalidData), arktype.errors) }
      catch (e) {
        void logFailure('Ark.fromTraversable: rejects invalid data', { ark, t, validData, invalidData })
        vi.assert.fail(getErrorMessage(e))
      }
    }
  )
})

vi.it('〖⛳️〗› ❲Ark.stringFromJson❳', () => {
  vi.expect(Ark.stringFromJson()(
    { a: 1, b: [2, { c: '3' }], d: { e: false, f: true, g: [-0, null] } }
  )).toMatchInlineSnapshot
    (`"{ a: '1', b: ['2', { c: '"3"' }], d: { e: 'false', f: 'true', g: ['0', 'null'] } }"`)
})

vi.it('〖⛳️〗› ❲Ark.fromJson❳: code-generates an ArkType schema from arbitrary JSON input', () => {
  vi.expect(Ark.fromJson()(
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
