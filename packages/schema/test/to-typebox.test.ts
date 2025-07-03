import * as vi from 'vitest'
import { fc, test } from '@fast-check/vitest'
import * as typebox from '@sinclair/typebox'
import type { Equal } from '@traversable/registry'
import { t, recurse } from '@traversable/schema'

import { Decode } from '@sinclair/typebox/value'
import type { ValueError } from '@sinclair/typebox/errors'
import { Errors } from '@sinclair/typebox/errors'
import * as Seed from './seed.js'
import * as Typebox from './to-typebox.js'
import { getErrorMessage, SchemaGenerator, invalidDataToPaths } from './test-utils.js'


type LogFailureDeps = {
  Type?: typebox.TAnySchema
  t: t.Schema
  validData: unknown
  invalidData: unknown
}

const buildTable = ({ validData, invalidData, Type, t }: LogFailureDeps) => {
  return {
    'Input': JSON.stringify(validData, (_, v) => v === undefined ? 'undefined' : typeof v === 'symbol' ? String(v) : v),
    'Schema (typebox)': Type ? Typebox.stringFromTypebox(Type) : 'typebox schema is not defined',
    'Schema (typebox), stringified': JSON.stringify(Type, null, 2),
    'Schema (traversable)': recurse.schemaToString(t),
    'Result (traversable, validData)': t(validData),
    'Result (traversable, invalidData)': t(invalidData),
    'Result (typebox, validData)': Type ? JSON.stringify([...Errors(Type, validData)]) : 'typebox schema is not defined',
    'Result (typebox, invalidData)': Type ? JSON.stringify([...Errors(Type, invalidData)]) : 'typebox schema is not defined',
  }
}

const logFailure = (logHeader: string, deps: LogFailureDeps) => {
  const table = buildTable(deps)
  console.group('\r\n\n\n[schema/test/to-typebox.test.ts]\nFAILURE: ' + logHeader)
  console.table(table)
  console.groupEnd()
}

const logValidFailure = (logHeader: string, deps: LogFailureDeps) => {
  const { ["Result (traversable, invalidData)"]: _, ["Result (typebox, invalidData)"]: __, ...table } = buildTable(deps)
  console.group('\r\n\n\n[schema/test/to-typebox.test.ts]\nFAILURE: ' + logHeader)
  console.table(table)
  console.groupEnd()
}

const logInvalidFailure = (logHeader: string, deps: LogFailureDeps) => {
  const { ["Result (traversable, validData)"]: _, ["Result (typebox, validData)"]: __, ...table } = buildTable(deps)
  console.group('\r\n\n\n[schema/test/to-typebox.test.ts]\nFAILURE: ' + logHeader)
  console.table(table)
  console.groupEnd()
}


const jsonPointerToPath = (jsonPointer: string) => jsonPointer === '' ? []
  : (jsonPointer.startsWith('/') ? jsonPointer.slice(1) : jsonPointer).replace('~1', '/').replace('~0', '~').split('/')

const parseResultToPaths = <T>(result: ParseResult<T>) => uniqBy(pathEquals, getErrorPaths(result))

const uniqBy = <T>(equalsFn: Equal<T>, xs: T[]) => {
  let out = Array.of<T>()
  for (let ix = 0, len = xs.length; ix < len; ix++) {
    const x = xs[ix]
    if (out.findIndex((y) => equalsFn(x, y)) === -1) out.push(x)
  }
  return out
}

const pathEquals: Equal<string[]> = (xs, ys) => {
  if (xs.length !== ys.length) return false
  else return xs.reduce((acc, x, i) => acc && x === ys[i], true)
}

/** hacky af */
const getErrorPaths = <T>(result: ParseResult<T>) => {
  let paths = Array.of<string[]>()
  if (result.success) return paths
  let todo = [result.errors]
  let next: ValueError[] | undefined
  while ((next = todo.shift()) !== undefined) {
    next.forEach((valueError) => {
      if (valueError.value !== Seed.invalidValue) {
        if (Array.isArray(valueError.value) && valueError.value.find((v) => v === Seed.invalidValue)) {
          return todo.push(...valueError.errors.map((_) => Array.from(_)))
        }
        else if (!!valueError.value && typeof valueError.value === 'object' && Object.values(valueError.value).find((v) => v === Seed.invalidValue)) {
          return todo.push(...valueError.errors.map((_) => Array.from(_)))
        }
        else {
          throw Error('Illegal state')
        }
      } else {
        paths.push(jsonPointerToPath(valueError.path))
        if (valueError.errors.length > 0) {
          todo.push(...valueError.errors.map((_) => Array.from(_)))
        }
      }
    })
  }
  return paths
}

type TypeOf<S extends typebox.TSchema, T = typebox.Static<S>> = 0 extends 1 & T ? unknown : T
interface ParseSuccess<T> { success: true, value: T }
interface ParseFailure { success: false, errors: ValueError[] }
type ParseResult<T> = ParseSuccess<T> | ParseFailure

function safeParse<S extends typebox.TSchema>(schema: S): (got: unknown) => ParseResult<TypeOf<S>> {
  return (got) => {
    try { return { success: true as const, value: Decode(schema, [], got) } }
    catch (e) { return { success: false as const, errors: Array.from(Errors(schema, got)) } }
  }
}

vi.describe(
  '〖⛳️〗‹‹‹ ❲to-typebox❳: property-based tests',
  { timeout: 10_000 },
  () => {
    test.prop([fc.jsonValue()], {
      endOnFailure: true,
      // numRuns: 5_000,
    })(
      '〖⛳️〗› ❲Typebox.fromJson❳: constructs a typebox schema from arbitrary JSON input',
      (json) => vi.assert.doesNotThrow(() => Typebox.fromJson(json))
    )

    test.prop([fc.jsonValue()], {
      endOnFailure: true,
      // numRuns: 5_000,
    })(
      '〖⛳️〗› ❲Typebox.stringFromJson❳: generates a typebox schema from arbitrary JSON input',
      (json) => vi.assert.doesNotThrow(() => Typebox.stringFromJson(json))
    )

    test.prop([SchemaGenerator()], {
      endOnFailure: true,
      // numRuns: 5_000,
    })(
      '〖⛳️〗› ❲Typebox.fromTraversable❳: constructs a typebox schema from arbitrary traversable input',
      (seed) => {
        const validData = fc.sample(Seed.arbitraryFromSchema(seed), 1)[0]
        const invalidData = fc.sample(Seed.invalidArbitraryFromSchema(seed), 1)[0]
        let Type: typebox.TAnySchema | undefined

        try { Type = Typebox.fromTraversable(seed) }
        catch (e) {
          void logFailure('Typebox.fromTraversable: construction', { Type, validData, invalidData, t: seed })
          vi.assert.fail(getErrorMessage(e))
        }

        try { vi.assert.isDefined(Type); vi.assert.doesNotThrow(() => Decode(Type, validData)) }
        catch (e) {
          void logValidFailure('Typebox.fromTraversable: accepts valid data', { Type, validData, invalidData, t: seed })
          vi.assert.fail(getErrorMessage(e))
        }

        try { vi.assert.isDefined(Type); vi.assert.throws(() => Decode(Type, invalidData)) }
        catch (e) {
          void logInvalidFailure('Typebox.fromTraversable: rejects invalid data', { Type, validData, invalidData, t: seed })
          vi.assert.fail(getErrorMessage(e))
        }
      }
    )

    test.prop([SchemaGenerator()], {
      endOnFailure: true,
      // numRuns: 5_000,
    })(
      '〖⛳️〗› ❲Typebox.stringFromTraversable❳: generates a typebox schema from arbitrary traversable input',
      (seed) => {
        const validData = fc.sample(Seed.arbitraryFromSchema(seed), 1)[0]
        const invalidData = fc.sample(Seed.invalidArbitraryFromSchema(seed), 1)[0]
        let Type: typebox.TAnySchema | undefined

        try { Type = globalThis.Function('typebox', 'return ' + Typebox.stringFromTraversable(seed))(typebox) }
        catch (e) {
          void logFailure('Typebox.stringFromTraversable: construction', { Type, validData, invalidData, t: seed })
          vi.assert.fail(getErrorMessage(e))
        }

        try {
          vi.assert.isDefined(Type); vi.assert.doesNotThrow(() => Decode(Type, validData))
        }
        catch (e) {
          void logValidFailure('Typebox.stringFromTraversable: accepts valid data', { Type, validData, invalidData, t: seed })
          vi.assert.fail(getErrorMessage(e))
        }

        try { vi.assert.isDefined(Type); vi.assert.throws(() => Decode(Type, invalidData)) }
        catch (e) {
          void logInvalidFailure('Typebox.stringFromTraversable: rejects invalid data', { Type, validData, invalidData, t: seed })
          vi.assert.fail(getErrorMessage(e))
        }
      }
    )

    test.prop([SchemaGenerator()], {
      endOnFailure: true,
      // numRuns: 5_000,
    })(`〖⛳️〗› 
    
  ❲Typebox.fromTraversable❳:

  Given a randomly generated @traversable schema, derives the corresponding TypeBox schema (in-memory).
        
  What we'd like to verify is that two schemas are isomorphic with respect to each other.

  To test that, we also generate the following artifacts:

    - valid data (using fast-check)
    - invalid data (using fast-check + a clever trick inspired by 'type-predicate-generator')
    - the list of paths to everywhere we planted invalid data
        
  Then, we use the derived TypeBox schema to test that:

    1. the schema successfully parses the valid data
    2. the schema fails to parse the invalid data
    3. the errors that TypeBox returns form a kind of "treasure map" to everywhere we planted invalid data

  Because this it generates its inputs randomly, running this test suite 10_000 times is enough to make us feel confident
  that the two are in fact isomorphic, at least for the schemas that this library has implemented.
  
  Prior art:
  
    - [type-predicate-generator](https://github.com/peter-leonov/type-predicate-generator)

  `
      .trim() + '\r\n\n',
      (seed) => {
        const schema = Typebox.fromTraversable(seed)
        const parser = safeParse(schema)
        const validData = fc.sample(Seed.arbitraryFromSchema(seed), 1)[0]
        const invalidData = fc.sample(Seed.invalidArbitraryFromSchema(seed), 1)[0]
        const success = parser(validData)
        const failure = parser(invalidData)
        const failurePaths = parseResultToPaths(failure).sort()
        const invalidPaths = invalidDataToPaths(invalidData).sort()

        vi.assert.isTrue(success.success)
        vi.assert.isFalse(failure.success)
        vi.assert.deepEqual(failurePaths, invalidPaths)
      }
    )

  }
)

vi.describe('〖⛳️〗‹‹‹ ❲to-typebox❳: Typebox.stringFromJson (examples)', () => {

  vi.it('〖⛳️〗› ❲Typebox.stringFromJson❳: JSON object (example w/o formatting)', () => {
    vi.expect.soft(Typebox.stringFromJson(
      { a: 1, b: [2, { c: '3' }], d: { e: false, f: true, g: [9000, null] } },
    )).toMatchInlineSnapshot
      (`"typebox.Object({ a: typebox.Literal(1), b: typebox.Tuple([typebox.Literal(2), typebox.Object({ c: typebox.Literal("3") })]), d: typebox.Object({ e: typebox.Literal(false), f: typebox.Literal(true), g: typebox.Tuple([typebox.Literal(9000), typebox.Null()]) }) })"`)
  })

  vi.it('〖⛳️〗› ❲Typebox.stringFromJson❳: JSON object (example w/ formatting)', () => {
    vi.expect.soft(Typebox.stringFromJson(
      { a: 1, b: [2, { c: '3' }], d: { e: false, f: true, g: [9000, null] } },
      { format: true }
    )).toMatchInlineSnapshot
      (`
      "typebox.Object({
        a: typebox.Literal(1),
        b: typebox.Tuple([typebox.Literal(2), typebox.Object({ c: typebox.Literal("3") })]),
        d: typebox.Object({
          e: typebox.Literal(false),
          f: typebox.Literal(true),
          g: typebox.Tuple([typebox.Literal(9000), typebox.Null()])
        })
      })"
    `)
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲Typebox.stringFromTraversable❳: (examples)', () => {
  vi.it('〖⛳️〗› ❲Typebox.stringFromTraversable❳: t.never example', () => {
    vi.expect.soft(Typebox.stringFromTraversable(
      t.never
    )).toMatchInlineSnapshot
      (`"typebox.Never()"`)
  })

  vi.it('〖⛳️〗› ❲Typebox.stringFromTraversable❳: t.any example', () => {
    vi.expect.soft(Typebox.stringFromTraversable(
      t.any
    )).toMatchInlineSnapshot
      (`"typebox.Any()"`)
  })


  vi.it('〖⛳️〗› ❲Typebox.stringFromTraversable❳: t.unknown example', () => {
    vi.expect.soft(Typebox.stringFromTraversable(
      t.unknown
    )).toMatchInlineSnapshot
      (`"typebox.Unknown()"`)
  })


  vi.it('〖⛳️〗› ❲Typebox.stringFromTraversable❳: t.void example', () => {
    vi.expect.soft(Typebox.stringFromTraversable(
      t.void
    )).toMatchInlineSnapshot
      (`"typebox.Void()"`)
  })

  vi.it('〖⛳️〗› ❲Typebox.stringFromTraversable❳: t.null example', () => {
    vi.expect.soft(Typebox.stringFromTraversable(
      t.null
    )).toMatchInlineSnapshot
      (`"typebox.Null()"`)
  })

  vi.it('〖⛳️〗› ❲Typebox.stringFromTraversable❳: t.undefined example', () => {
    vi.expect.soft(Typebox.stringFromTraversable(
      t.undefined
    )).toMatchInlineSnapshot
      (`"typebox.Undefined()"`)
  })

  vi.it('〖⛳️〗› ❲Typebox.stringFromTraversable❳: t.boolean example', () => {
    vi.expect.soft(Typebox.stringFromTraversable(
      t.boolean
    )).toMatchInlineSnapshot
      (`"typebox.Boolean()"`)
  })

  vi.it('〖⛳️〗› ❲Typebox.stringFromTraversable❳: t.integer example', () => {
    vi.expect.soft(Typebox.stringFromTraversable(
      t.integer
    )).toMatchInlineSnapshot
      (`"typebox.Integer()"`)

    vi.expect.soft(Typebox.stringFromTraversable(
      t.integer.max(3)
    )).toMatchInlineSnapshot
      (`"typebox.Integer({ maximum: 3 })"`)

    vi.expect.soft(Typebox.stringFromTraversable(
      t.integer.min(3)
    )).toMatchInlineSnapshot
      (`"typebox.Integer({ minimum: 3 })"`)

    vi.expect.soft(Typebox.stringFromTraversable(
      t.integer.between(0, 2)
    )).toMatchInlineSnapshot
      (`"typebox.Integer({ minimum: 0, maximum: 2 })"`)
  })


  vi.it('〖⛳️〗› ❲Typebox.stringFromTraversable❳: t.bigint example', () => {
    vi.expect.soft(Typebox.stringFromTraversable(
      t.bigint
    )).toMatchInlineSnapshot
      (`"typebox.BigInt()"`)

    vi.expect.soft(Typebox.stringFromTraversable(
      t.bigint.max(3n)
    )).toMatchInlineSnapshot
      (`"typebox.BigInt({ maximum: 3 })"`)

    vi.expect.soft(Typebox.stringFromTraversable(
      t.bigint.min(3n)
    )).toMatchInlineSnapshot
      (`"typebox.BigInt({ minimum: 3 })"`)

    vi.expect.soft(Typebox.stringFromTraversable(
      t.bigint.between(0n, 2n)
    )).toMatchInlineSnapshot
      (`"typebox.BigInt({ minimum: 0, maximum: 2 })"`)
  })

  vi.it('〖⛳️〗› ❲Typebox.stringFromTraversable❳: t.number example', () => {
    vi.expect.soft(Typebox.stringFromTraversable(
      t.number.between(0, 2)
    )).toMatchInlineSnapshot
      (`"typebox.Number({ minimum: 0, maximum: 2 })"`)

    vi.expect.soft(Typebox.stringFromTraversable(
      t.number.lessThan(0)
    )).toMatchInlineSnapshot
      (`"typebox.Number({ exclusiveMaximum: 0 })"`)

    vi.expect.soft(Typebox.stringFromTraversable(
      t.number.moreThan(0)
    )).toMatchInlineSnapshot
      (`"typebox.Number({ exclusiveMinimum: 0 })"`)

    vi.expect.soft(Typebox.stringFromTraversable(
      t.number.max(10).moreThan(0)
    )).toMatchInlineSnapshot
      (`"typebox.Number({ exclusiveMinimum: 0, maximum: 10 })"`)

    vi.expect.soft(Typebox.stringFromTraversable(
      t.number
    )).toMatchInlineSnapshot
      (`"typebox.Number()"`)

  })

  vi.it('〖⛳️〗› ❲Typebox.stringFromTraversable❳: t.string example', () => {

    vi.expect.soft(Typebox.stringFromTraversable(
      t.string
    )).toMatchInlineSnapshot
      (`"typebox.String()"`)

    vi.expect.soft(Typebox.stringFromTraversable(
      t.string.max(0)
    )).toMatchInlineSnapshot
      (`"typebox.String({ maxLength: 0 })"`)

    vi.expect.soft(Typebox.stringFromTraversable(
      t.string.between(0, 1)
    )).toMatchInlineSnapshot
      (`"typebox.String({ minLength: 0, maxLength: 1 })"`)
  })

  vi.it('〖⛳️〗› ❲Typebox.stringFromTraversable❳: t.eq example', () => {
    vi.expect.soft(Typebox.stringFromTraversable(
      t.eq([1, 2, { a: 3, b: 4, c: [{ d: 5 }] }]),
      { format: true }
    )).toMatchInlineSnapshot
      (`
      "typebox.Tuple([
        typebox.Literal(1),
        typebox.Literal(2),
        typebox.Object({
          a: typebox.Literal(3),
          b: typebox.Literal(4),
          c: typebox.Tuple([typebox.Object({ d: typebox.Literal(5) })])
        })
      ])"
    `)
  })

  vi.it('〖⛳️〗› ❲Typebox.stringFromTraversable❳: t.optional example', () => {
    vi.expect.soft(Typebox.stringFromTraversable(
      t.object({ a: t.optional(t.eq({ a: 1, b: [2, { c: 3 }] })) }),
      { format: true }
    )).toMatchInlineSnapshot
      (`
      "typebox.Object({
        a: typebox.Optional(
          typebox.Object({
            a: typebox.Literal(1),
            b: typebox.Tuple([typebox.Literal(2), typebox.Object({ c: typebox.Literal(3) })])
          })
        )
      })"
    `)
  })

  vi.it('〖⛳️〗› ❲Typebox.stringFromTraversable❳: t.array example', () => {
    vi.expect.soft(Typebox.stringFromTraversable(
      t.array(t.boolean)
    )).toMatchInlineSnapshot
      (`"typebox.Array(typebox.Boolean())"`)

    vi.expect.soft(Typebox.stringFromTraversable(
      t.array(t.string).min(10).max(100),
    )).toMatchInlineSnapshot
      (`"typebox.Array(typebox.String(), { minItems: 10, maxItems: 100 })"`)
  })


  vi.it('〖⛳️〗› ❲Typebox.stringFromTraversable❳: t.tuple example', () => {
    vi.expect.soft(Typebox.stringFromTraversable(
      t.tuple(t.null)
    )).toMatchInlineSnapshot
      (`"typebox.Tuple([typebox.Null()])"`)

    vi.expect.soft(Typebox.stringFromTraversable(
      t.tuple(t.null, t.boolean)
    )).toMatchInlineSnapshot
      (`"typebox.Tuple([typebox.Null(), typebox.Boolean()])"`)
  })

  vi.it('〖⛳️〗› ❲Typebox.stringFromTraversable❳: t.object example', () => {
    vi.expect.soft(Typebox.stringFromTraversable(
      t.object({ a: t.null, b: t.boolean, c: t.optional(t.void) })
    )).toMatchInlineSnapshot
      (`"typebox.Object({ a: typebox.Null(), b: typebox.Boolean(), c: typebox.Optional(typebox.Void()) })"`)

    vi.expect.soft(Typebox.stringFromTraversable(
      t.object({ a: t.null, b: t.boolean, c: t.optional(t.void) }),
    )).toMatchInlineSnapshot
      (`"typebox.Object({ a: typebox.Null(), b: typebox.Boolean(), c: typebox.Optional(typebox.Void()) })"`)

    vi.expect.soft(Typebox.stringFromTraversable(
      t.object({ a: t.null, b: t.boolean, c: t.optional(t.void) }),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Object({ a: typebox.Null(), b: typebox.Boolean(), c: typebox.Optional(typebox.Void()) })"`)


    vi.expect.soft(Typebox.stringFromTraversable(
      t.object({
        a: t.null,
        b: t.boolean,
        c: t.optional(
          t.object({
            d: t.void,
            e: t.tuple(
              t.union(
                t.object({
                  f: t.unknown,
                  g: t.null,
                  h: t.never,
                }),
                t.object({
                  i: t.boolean,
                  j: t.symbol,
                  k: t.array(
                    t.record(
                      t.any,
                    )
                  )
                })
              ),
              t.array(
                t.intersect(
                  t.object({
                    l: t.eq({
                      r: [{
                        s: 123,
                        t: [{
                          u: 456,
                        }],
                        v: 789,
                      }]
                    }),
                    m: t.null,
                    n: t.never,
                  }),
                  t.object({
                    o: t.boolean,
                    p: t.symbol,
                    q: t.array(
                      t.record(
                        t.any,
                      )
                    )
                  })
                )
              )
            )
          })
        )
      }),
      { format: true }
    )).toMatchInlineSnapshot
      (`
        "typebox.Object({
          a: typebox.Null(),
          b: typebox.Boolean(),
          c: typebox.Optional(
            typebox.Object({
              d: typebox.Void(),
              e: typebox.Tuple([
                typebox.Union([
                  typebox.Object({ f: typebox.Unknown(), g: typebox.Null(), h: typebox.Never() }),
                  typebox.Object({
                    i: typebox.Boolean(),
                    j: typebox.Symbol(),
                    k: typebox.Array(typebox.Record(typebox.String(), typebox.Any()))
                  })
                ]),
                typebox.Array(
                  typebox.Intersect([
                    typebox.Object({
                      l: typebox.Object({
                        r: typebox.Tuple([
                          typebox.Object({
                            s: typebox.Literal(123),
                            t: typebox.Tuple([typebox.Object({ u: typebox.Literal(456) })]),
                            v: typebox.Literal(789)
                          })
                        ])
                      }),
                      m: typebox.Null(),
                      n: typebox.Never()
                    }),
                    typebox.Object({
                      o: typebox.Boolean(),
                      p: typebox.Symbol(),
                      q: typebox.Array(typebox.Record(typebox.String(), typebox.Any()))
                    })
                  ])
                )
              ])
            })
          )
        })"
      `)
  })

})


vi.describe('〖⛳️〗‹‹‹ ❲Typebox.stringFromTypebox❳: (examples)', () => {
  vi.it('〖⛳️〗› ❲Typebox.stringFromTypebox❳: typebox.Never example', () => {
    vi.expect.soft(Typebox.stringFromTypebox(
      typebox.Never(),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Never()"`)
  })

  vi.it('〖⛳️〗› ❲Typebox.stringFromTypebox❳: typebox.Any example', () => {
    vi.expect.soft(Typebox.stringFromTypebox(
      typebox.Any(),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Any()"`)
  })

  vi.it('〖⛳️〗› ❲Typebox.stringFromTypebox❳: typebox.Unknown example', () => {
    vi.expect.soft(Typebox.stringFromTypebox(
      typebox.Unknown(),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Unknown()"`)
  })

  vi.it('〖⛳️〗› ❲Typebox.stringFromTypebox❳: typebox.Void example', () => {
    vi.expect.soft(Typebox.stringFromTypebox(
      typebox.Void(),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Void()"`)
  })

  vi.it('〖⛳️〗› ❲Typebox.stringFromTypebox❳: typebox.Null example', () => {
    vi.expect.soft(Typebox.stringFromTypebox(
      typebox.Null(),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Null()"`)
  })

  vi.it('〖⛳️〗› ❲Typebox.stringFromTypebox❳: typebox.Undefined example', () => {
    vi.expect.soft(Typebox.stringFromTypebox(
      typebox.Undefined(),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Undefined()"`)
  })

  vi.it('〖⛳️〗› ❲Typebox.stringFromTypebox❳: typebox.Symbol example', () => {
    vi.expect.soft(Typebox.stringFromTypebox(
      typebox.Symbol(),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Symbol()"`)
  })

  vi.it('〖⛳️〗› ❲Typebox.stringFromTypebox❳: typebox.Boolean example', () => {
    vi.expect.soft(Typebox.stringFromTypebox(
      typebox.Boolean(),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Boolean()"`)
  })

  vi.it('〖⛳️〗› ❲Typebox.stringFromTypebox❳: typebox.Integer example', () => {
    vi.expect.soft(Typebox.stringFromTypebox(
      typebox.Integer(),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Integer()"`)

    vi.expect.soft(Typebox.stringFromTypebox(
      typebox.Integer({ maximum: 3 }),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Integer({ maximum: 3 })"`)

    vi.expect.soft(Typebox.stringFromTypebox(
      typebox.Integer({ minimum: 3 }),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Integer({ minimum: 3 })"`)

    vi.expect.soft(Typebox.stringFromTypebox(
      typebox.Integer({ minimum: 0, maximum: 2 }),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Integer({ minimum: 0, maximum: 2 })"`)
  })

  vi.it('〖⛳️〗› ❲Typebox.stringFromTypebox❳: typebox.BigInt example', () => {
    vi.expect.soft(Typebox.stringFromTypebox(
      typebox.BigInt(),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.BigInt()"`)

    vi.expect.soft(Typebox.stringFromTypebox(
      typebox.BigInt({ minimum: 0n }),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.BigInt({ minimum: 0 })"`)

    vi.expect.soft(Typebox.stringFromTypebox(
      typebox.BigInt({ maximum: 0n }),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.BigInt({ maximum: 0 })"`)

    vi.expect.soft(Typebox.stringFromTypebox(
      typebox.BigInt({ minimum: -1n, maximum: 1n }),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.BigInt({ minimum: -1, maximum: 1 })"`)
  })

  vi.it('〖⛳️〗› ❲Typebox.stringFromTypebox❳: typebox.Number example', () => {
    vi.expect.soft(Typebox.stringFromTypebox(
      typebox.Number({ minimum: 0, maximum: 2 }),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Number({ minimum: 0, maximum: 2 })"`)

    vi.expect.soft(Typebox.stringFromTypebox(
      typebox.Number({ exclusiveMaximum: 0 }),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Number({ exclusiveMaximum: 0 })"`)

    vi.expect.soft(Typebox.stringFromTypebox(
      typebox.Number({ exclusiveMinimum: 0 }),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Number({ exclusiveMinimum: 0 })"`)

    vi.expect.soft(Typebox.stringFromTypebox(
      typebox.Number({ exclusiveMinimum: 0, maximum: 10 }),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Number({ exclusiveMinimum: 0, maximum: 10 })"`)

    vi.expect.soft(Typebox.stringFromTypebox(
      typebox.Number(),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Number()"`)
  })


  vi.it('〖⛳️〗› ❲Typebox.stringFromTypebox❳: typebox.String example', () => {
    vi.expect.soft(Typebox.stringFromTypebox(
      typebox.String(),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.String()"`)
  })

  vi.it('〖⛳️〗› ❲Typebox.stringFromTypebox❳: typebox.Array example', () => {

    vi.expect.soft(Typebox.stringFromTypebox(
      typebox.Array(typebox.Boolean()),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Array(typebox.Boolean())"`)

    vi.expect.soft(Typebox.stringFromTypebox(
      typebox.Array(typebox.String(), { minItems: 10 }),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Array(typebox.String(), { minItems: 10 })"`)

    vi.expect.soft(Typebox.stringFromTypebox(
      typebox.Array(typebox.String(), { minimum: 1, maximum: 10 }),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Array(typebox.String())"`)
  })


  vi.it('〖⛳️〗› ❲Typebox.stringFromTypebox❳: typebox.Record example', () => {
    vi.expect.soft(Typebox.stringFromTypebox(
      typebox.Record(typebox.String(), typebox.Null()),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Record(typebox.String(), typebox.Null())"`)
  })

  vi.it('〖⛳️〗› ❲Typebox.stringFromTypebox❳: typebox.Union example', () => {
    vi.expect.soft(Typebox.stringFromTypebox(
      typebox.Union([typebox.String(), typebox.Number()]),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Union([typebox.String(), typebox.Number()])"`)
  })

  vi.it('〖⛳️〗› ❲Typebox.stringFromTypebox❳: typebox.Intersect example', () => {
    vi.expect.soft(Typebox.stringFromTypebox(
      typebox.Intersect([typebox.Object({ a: typebox.Boolean() }), typebox.Object({ b: typebox.Number() })]),
      { format: true }
    )).toMatchInlineSnapshot
      (`
      "typebox.Intersect([
        typebox.Object({ a: typebox.Boolean() }),
        typebox.Object({ b: typebox.Number() })
      ])"
    `)
  })

  vi.it('〖⛳️〗› ❲Typebox.stringFromTypebox❳: typebox.Tuple example', () => {
    vi.expect.soft(Typebox.stringFromTypebox(
      typebox.Tuple([typebox.Null()]),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Tuple([typebox.Null()])"`)

    vi.expect.soft(Typebox.stringFromTypebox(
      typebox.Tuple([typebox.Null(), typebox.Boolean()]),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Tuple([typebox.Null(), typebox.Boolean()])"`)
  })

  vi.it('〖⛳️〗› ❲Typebox.stringFromTypebox❳: typebox.Object example', () => {

    vi.expect.soft(Typebox.stringFromTypebox(
      typebox.Object({
        a: typebox.Null(),
        b: typebox.Boolean(),
        c: typebox.Optional(typebox.Union([typebox.Literal(1), typebox.Literal(2), typebox.Literal(3)]))
      }),
      { format: true }
    )).toMatchInlineSnapshot
      (`
        "typebox.Object({
          a: typebox.Null(),
          b: typebox.Boolean(),
          c: typebox.Optional(typebox.Union([typebox.Literal(1), typebox.Literal(2), typebox.Literal(3)]))
        })"
      `)

    vi.expect.soft(Typebox.stringFromTypebox(
      typebox.Object({
        a: typebox.Null(),
        b: typebox.Boolean(),
        c: typebox.Optional(
          typebox.Object({
            d: typebox.Void(),
            e: typebox.Tuple([
              typebox.Union([
                typebox.Object({ f: typebox.Unknown(), g: typebox.Null(), h: typebox.Never() }),
                typebox.Object({
                  i: typebox.Boolean(),
                  j: typebox.Symbol(),
                  k: typebox.Array(typebox.Record(typebox.String(), typebox.Any()))
                })
              ]),
              typebox.Array(
                typebox.Intersect([
                  typebox.Object({
                    l: typebox.Object({
                      r: typebox.Tuple([
                        typebox.Object({
                          s: typebox.Literal(123),
                          t: typebox.Tuple([typebox.Object({ u: typebox.Literal(456) })]),
                          v: typebox.Literal(789)
                        })
                      ])
                    }),
                    m: typebox.Null(),
                    n: typebox.Never()
                  }),
                  typebox.Object({
                    o: typebox.Boolean(),
                    p: typebox.Symbol(),
                    q: typebox.Array(typebox.Record(typebox.String(), typebox.Any()))
                  })
                ])
              )
            ])
          })
        )
      }),
      { format: true }
    )).toMatchInlineSnapshot
      (`
        "typebox.Object({
          a: typebox.Null(),
          b: typebox.Boolean(),
          c: typebox.Optional(
            typebox.Object({
              d: typebox.Void(),
              e: typebox.Tuple([
                typebox.Union([
                  typebox.Object({ f: typebox.Unknown(), g: typebox.Null(), h: typebox.Never() }),
                  typebox.Object({
                    i: typebox.Boolean(),
                    j: typebox.Symbol(),
                    k: typebox.Array(typebox.Record(typebox.String(), typebox.Any()))
                  })
                ]),
                typebox.Array(
                  typebox.Intersect([
                    typebox.Object({
                      l: typebox.Object({
                        r: typebox.Tuple([
                          typebox.Object({
                            s: typebox.Literal(123),
                            t: typebox.Tuple([typebox.Object({ u: typebox.Literal(456) })]),
                            v: typebox.Literal(789)
                          })
                        ])
                      }),
                      m: typebox.Null(),
                      n: typebox.Never()
                    }),
                    typebox.Object({
                      o: typebox.Boolean(),
                      p: typebox.Symbol(),
                      q: typebox.Array(typebox.Record(typebox.String(), typebox.Any()))
                    })
                  ])
                )
              ])
            })
          )
        })"
      `)
  })
})

vi.it('〖⛳️〗› ❲Typebox.fromJson❳: examples', () => {
  vi.expect.soft(Typebox.fromJson(
    { a: 1, b: [-2, { c: '3' }], d: { e: false, f: true, g: [9000, null] } }
  )).toMatchInlineSnapshot
    (`
      {
        "properties": {
          "a": {
            "const": 1,
            "type": "number",
            Symbol(TypeBox.Kind): "Literal",
          },
          "b": {
            "additionalItems": false,
            "items": [
              {
                "const": -2,
                "type": "number",
                Symbol(TypeBox.Kind): "Literal",
              },
              {
                "properties": {
                  "c": {
                    "const": "3",
                    "type": "string",
                    Symbol(TypeBox.Kind): "Literal",
                  },
                },
                "required": [
                  "c",
                ],
                "type": "object",
                Symbol(TypeBox.Kind): "Object",
              },
            ],
            "maxItems": 2,
            "minItems": 2,
            "type": "array",
            Symbol(TypeBox.Kind): "Tuple",
          },
          "d": {
            "properties": {
              "e": {
                "const": false,
                "type": "boolean",
                Symbol(TypeBox.Kind): "Literal",
              },
              "f": {
                "const": true,
                "type": "boolean",
                Symbol(TypeBox.Kind): "Literal",
              },
              "g": {
                "additionalItems": false,
                "items": [
                  {
                    "const": 9000,
                    "type": "number",
                    Symbol(TypeBox.Kind): "Literal",
                  },
                  {
                    "type": "null",
                    Symbol(TypeBox.Kind): "Null",
                  },
                ],
                "maxItems": 2,
                "minItems": 2,
                "type": "array",
                Symbol(TypeBox.Kind): "Tuple",
              },
            },
            "required": [
              "e",
              "f",
              "g",
            ],
            "type": "object",
            Symbol(TypeBox.Kind): "Object",
          },
        },
        "required": [
          "a",
          "b",
          "d",
        ],
        "type": "object",
        Symbol(TypeBox.Kind): "Object",
      }
    `)
})
