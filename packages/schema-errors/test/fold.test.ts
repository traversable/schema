import * as vi from 'vitest'
import { t } from '@traversable/schema'
import { fc, test } from '@fast-check/vitest'
import { Seed } from '@traversable/schema-seed'
import { Equal, findPaths } from '@traversable/registry'

import type { ValidationError } from '@traversable/schema-errors'
import { getValidator } from '@traversable/schema-errors'

const exclude = [
  // exclude `never` because a schema containing `never` is impossible to satisfy
  'never',
  // exclude `intersect` because some intersections are impossible to satisfy
  'intersect',
  // exclude `symbol`, otherwise Symbol('invalidValue') won't cause the check to fail
  'symbol',
  // exclude `unknown`, otherwise Symbol('invalidValue') won't cause the check to fail
  'unknown',
  // exclude `any`, otherwise Symbol('invalidValue') won't cause the check to fail
  'any',
] as const satisfies any[]

/** 
 * Implementation is unoptimized 
 */
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

const validationErrorsToPaths = (errors: ValidationError[]) => uniqBy(pathEquals, errors.map((error) => error.path.slice(1).map(String)))
const invalidDataToPaths = (data: unknown) => findPaths(data, (x) => x === Seed.invalidValue).map((xs) => xs.map(String))


vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-errors❳: property-based tests', () => {
  test.prop([Seed.schemaWithMinDepth({ exclude }, 3)], {
    // numRuns: 10_000,
    endOnFailure: true,
  })(
    '〖⛳️〗› ❲getValidator❳: given an arbitrary schema & generated input, validates correctly in every case',
    (schema) => {
      const validator = getValidator(schema)
      const [validData] = fc.sample(Seed.arbitraryFromSchema(schema), 1)
      const [invalidData] = fc.sample(Seed.invalidArbitraryFromSchema(schema), 1)
      const success = validator(validData)
      const failure = validator(invalidData)
      const failurePaths = validationErrorsToPaths(failure)
      const invalidPaths = invalidDataToPaths(invalidData)

      vi.assert.isEmpty(success)
      vi.assert.isNotEmpty(failure)
      vi.assert.deepEqual(failurePaths, invalidPaths)
    }
  )
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-errors❳: examples (happy path)', () => {

  vi.it('〖⛳️〗› ❲getValidator❳: t.integer', () => {
    vi.assert.isEmpty(getValidator(t.integer)(0))
    vi.assert.isEmpty(getValidator(t.integer.min(0))(0))
    vi.assert.isEmpty(getValidator(t.integer.max(0))(0))
    vi.assert.isEmpty(getValidator(t.integer.max(0))(0))
    vi.assert.isEmpty(getValidator(t.integer.between(-1, +1))(0))
    vi.assert.isEmpty(getValidator(t.integer.between(+1, -1))(0))
  })

  vi.it('〖⛳️〗› ❲getValidator❳: t.bigint', () => {
    vi.assert.isEmpty(getValidator(t.bigint)(0n))
    vi.assert.isEmpty(getValidator(t.bigint.min(0n))(0n))
    vi.assert.isEmpty(getValidator(t.bigint.max(0n))(0n))
    vi.assert.isEmpty(getValidator(t.bigint.between(-1n, 1n))(0n))
    vi.assert.isEmpty(getValidator(t.bigint.between(1n, -1n))(0n))
  })

  vi.it('〖⛳️〗› ❲getValidator❳: t.number', () => {
    vi.assert.isEmpty(getValidator(t.number)(+0.01))
    vi.assert.isEmpty(getValidator(t.number.min(+0.1))(+0.1))
    vi.assert.isEmpty(getValidator(t.number.max(+0.1))(+0.1))
    vi.assert.isEmpty(getValidator(t.number.lessThan(+0.1))(+0.01))
    vi.assert.isEmpty(getValidator(t.number.moreThan(+0.01))(+0.1))
    vi.assert.isEmpty(getValidator(t.number.between(-0.1, +0.1))(+0.01))
    vi.assert.isEmpty(getValidator(t.number.between(+0.1, -0.1))(+0.01))
    vi.assert.isEmpty(getValidator(t.number.lessThan(+0.1).min(-0.1))(+0.01))
    vi.assert.isEmpty(getValidator(t.number.moreThan(-0.1).max(+0.1))(+0.01))
    vi.assert.isEmpty(getValidator(t.number.min(-0.1).lessThan(+0.1))(+0.01))
    vi.assert.isEmpty(getValidator(t.number.max(+0.1).moreThan(-0.1))(+0.01))
    vi.assert.isEmpty(getValidator(t.number.moreThan(-0.1).max(+0.1))(+0.01))
  })

  vi.it('〖⛳️〗› ❲getValidator❳: t.string', () => {
    vi.assert.isEmpty(getValidator(t.string)(''))
    vi.assert.isEmpty(getValidator(t.string.min(0))(''))
    vi.assert.isEmpty(getValidator(t.string.min(1))(' '))
    vi.assert.isEmpty(getValidator(t.string.min(1))('  '))
    vi.assert.isEmpty(getValidator(t.string.max(0))(''))
    vi.assert.isEmpty(getValidator(t.string.max(1))(''))
    vi.assert.isEmpty(getValidator(t.string.max(1))(' '))
    vi.assert.isEmpty(getValidator(t.string.between(1, 2))(' '))
    vi.assert.isEmpty(getValidator(t.string.between(2, 1))(' '))
    vi.assert.isEmpty(getValidator(t.string.between(0, 0))(''))
  })

  vi.it('〖⛳️〗› ❲getValidator❳: t.object(...)', () => {
    vi.assert.isEmpty(getValidator(t.object({}))({}))
    vi.assert.isEmpty(getValidator(t.object({ a: t.number }))({ a: 0 }))
    vi.assert.isEmpty(getValidator(t.object({ a: t.number, b: t.object({ c: t.number }) }))({ a: 0, b: { c: 0 } }))

    // TODO: test exact optional
    // optional
    vi.assert.isEmpty(getValidator(t.object({ a: t.number, b: t.optional(t.string) }))({ a: 0 }))
    vi.assert.isEmpty(getValidator(t.object({ a: t.number, b: t.optional(t.string) }))({ a: 0, b: '' }))
    vi.assert.isEmpty(getValidator(t.object({ a: t.number, b: t.object({ c: t.optional(t.number) }) }))({ a: 0, b: { c: 0 } }))
    vi.assert.isEmpty(getValidator(t.object({ a: t.number, b: t.object({ c: t.optional(t.number) }) }))({ a: 0, b: {} }))
    vi.assert.isEmpty(getValidator(t.object({ a: t.number, b: t.optional(t.object({ c: t.number })) }))({ a: 0 }))
    vi.assert.isEmpty(getValidator(t.object({ a: t.number, b: t.optional(t.object({ c: t.number })) }))({ a: 0, b: { c: 0 } }))
    vi.assert.isEmpty(getValidator(t.object({ a: t.number, b: t.optional(t.object({ c: t.optional(t.number) })) }))({ a: 0 }))
    vi.assert.isEmpty(getValidator(t.object({ a: t.number, b: t.optional(t.object({ c: t.optional(t.number) })) }))({ a: 0, b: {} }))
    vi.assert.isEmpty(getValidator(t.object({ a: t.number, b: t.optional(t.object({ c: t.optional(t.number) })) }))({ a: 0, b: { c: 0 } }))
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-errors❳: examples (unhappy path)', () => {
  vi.it('〖⛳️〗› ❲getValidator❳: t.integer', () => {
    vi.expect(getValidator(t.integer)('')).toMatchInlineSnapshot(`
      [
        {
          "got": "",
          "message": "Expected value to be an integer",
          "path": [
            "value",
          ],
        },
      ]
    `)
    vi.expect(getValidator(t.integer.min(0))(-1)).toMatchInlineSnapshot(`
      [
        {
          "got": -1,
          "message": "Expected value to be at least 0",
          "path": [
            "value",
          ],
        },
      ]
    `)
    vi.expect(getValidator(t.integer.max(0))(+1)).toMatchInlineSnapshot(`
      [
        {
          "got": 1,
          "message": "Expected value to be at most 0",
          "path": [
            "value",
          ],
        },
      ]
    `)
  })

  vi.it('〖⛳️〗› ❲getValidator❳: t.bigint', () => {
    vi.expect(getValidator(t.bigint)('')).toMatchInlineSnapshot(`
      [
        {
          "got": "",
          "message": "Expected value to be a bigint",
          "path": [
            "value",
          ],
        },
      ]
    `)
    vi.expect(getValidator(t.bigint.min(0n))(-1n)).toMatchInlineSnapshot(`
      [
        {
          "got": -1n,
          "message": "Expected value to be at least 0n",
          "path": [
            "value",
          ],
        },
      ]
    `)
    vi.expect(getValidator(t.bigint.max(0n))(1n)).toMatchInlineSnapshot(`
      [
        {
          "got": 1n,
          "message": "Expected value to be at most 0n",
          "path": [
            "value",
          ],
        },
      ]
    `)
  })

  vi.it('〖⛳️〗› ❲getValidator❳: t.number', () => {
    vi.expect(getValidator(t.number)('')).toMatchInlineSnapshot(`
      [
        {
          "got": "",
          "message": "Expected value to be a number",
          "path": [
            "value",
          ],
        },
      ]
    `)
    vi.expect(getValidator(t.number.min(0))(-1)).toMatchInlineSnapshot(`
      [
        {
          "got": -1,
          "message": "Expected value to be at least 0",
          "path": [
            "value",
          ],
        },
      ]
    `)
    vi.expect(getValidator(t.number.max(0))(+1)).toMatchInlineSnapshot(`
      [
        {
          "got": 1,
          "message": "Expected value to be at most 0",
          "path": [
            "value",
          ],
        },
      ]
    `)
    vi.expect(getValidator(t.number.moreThan(0))(0)).toMatchInlineSnapshot(`
      [
        {
          "got": 0,
          "message": "Expected value to be greater than 0",
          "path": [
            "value",
          ],
        },
      ]
    `)
    vi.expect(getValidator(t.number.lessThan(0))(0)).toMatchInlineSnapshot(`
      [
        {
          "got": 0,
          "message": "Expected value to be less than 0",
          "path": [
            "value",
          ],
        },
      ]
    `)
  })

  vi.it('〖⛳️〗› ❲getValidator❳: t.string', () => {
    vi.expect(getValidator(t.string)(0)).toMatchInlineSnapshot(`
      [
        {
          "got": 0,
          "message": "Expected value to be a string",
          "path": [
            "value",
          ],
        },
      ]
    `)
    vi.expect(getValidator(t.string.min(1))('')).toMatchInlineSnapshot(`
      [
        {
          "got": "",
          "message": "Expected value to be at least 1 characters long",
          "path": [
            "value",
          ],
        },
      ]
    `)
    vi.expect(getValidator(t.string.max(1))('  ')).toMatchInlineSnapshot(`
      [
        {
          "got": "  ",
          "message": "Expected value to be at most 1 characters long",
          "path": [
            "value",
          ],
        },
      ]
    `)
  })

  vi.it('〖⛳️〗› ❲getValidator❳: t.object(...)', () => {
    vi.expect(getValidator(t.object({ a: t.number }))({})).toMatchInlineSnapshot(`
      [
        {
          "got": {},
          "message": "Expected value to have property 'a'",
          "path": [
            "value",
          ],
        },
      ]
    `)

    vi.expect(getValidator(t.object({ a: t.number, b: t.object({ c: t.boolean }) }))({ a: 0, b: { c: 1 } })).toMatchInlineSnapshot(`
      [
        {
          "got": 1,
          "message": "Expected value.b.c to be a boolean",
          "path": [
            "value",
            "b",
            "c",
          ],
        },
      ]
    `)
  })

  vi.it('〖⛳️〗› ❲getValidator❳: t.union(...)', () => {
    vi.expect(getValidator(t.union(t.string, t.number))({})).toMatchInlineSnapshot(`
      [
        {
          "got": {},
          "message": "Expected value to be a string",
          "path": [
            "value",
          ],
        },
        {
          "got": {},
          "message": "Expected value to be a number",
          "path": [
            "value",
          ],
        },
      ]
    `)

    vi.expect(getValidator(t.object({ a: t.union(t.object({ b: t.string }), t.object({ c: t.number })) }))({ a: { b: false } })).toMatchInlineSnapshot(`
      [
        {
          "got": false,
          "message": "Expected value.a.b to be a string",
          "path": [
            "value",
            "a",
            "b",
          ],
        },
        {
          "got": {
            "b": false,
          },
          "message": "Expected value.a to have property 'c'",
          "path": [
            "value",
            "a",
          ],
        },
      ]
    `)

    vi.expect(getValidator(t.object({ a: t.union(t.object({ b: t.string }), t.object({ c: t.number })) }))({ a: { c: false } })).toMatchInlineSnapshot(`
      [
        {
          "got": {
            "c": false,
          },
          "message": "Expected value.a to have property 'b'",
          "path": [
            "value",
            "a",
          ],
        },
        {
          "got": false,
          "message": "Expected value.a.c to be a number",
          "path": [
            "value",
            "a",
            "c",
          ],
        },
      ]
    `)
  })

  vi.it('〖⛳️〗› ❲getValidator❳: t.optional(...)', () => {
    vi.expect(getValidator(
      t.object({
        a: t.optional(t.string)
      })
    )(
      {
        a: 0
      }
    )).toMatchInlineSnapshot(`
      [
        {
          "got": 0,
          "message": "Expected value.a to be a string",
          "path": [
            "value",
            "a",
          ],
        },
      ]
    `)

    vi.expect(getValidator(
      t.object({
        a: t.optional(
          t.object({
            b: t.string
          })
        )
      })
    )(
      {
        a: {
          b: false
        }
      })
    ).toMatchInlineSnapshot(`
      [
        {
          "got": false,
          "message": "Expected value.a.b to be a string",
          "path": [
            "value",
            "a",
            "b",
          ],
        },
      ]
    `)
  })

  vi.it('〖⛳️〗› ❲getValidator❳: t.optional(...)', () => {
    vi.expect(getValidator(t.optional(t.string))(1)).toMatchInlineSnapshot(`
      [
        {
          "got": 1,
          "message": "Expected value to be a string",
          "path": [
            "value",
          ],
        },
      ]
    `)

    vi.expect(getValidator(
      t.object({
        a: t.optional(
          t.object({
            b: t.optional(
              t.object({
                c: t.optional(t.number),
              })
            )
          })
        )
      })
    )({
      a: {
        b: {
          c: ''
        }
      }
    })
    ).toMatchInlineSnapshot
      (`
      [
        {
          "got": "",
          "message": "Expected value.a.b.c to be a number",
          "path": [
            "value",
            "a",
            "b",
            "c",
          ],
        },
      ]
    `)

    vi.expect(getValidator(
      t.object({
        a: t.optional(
          t.object({
            b: t.optional(
              t.object({
                c: t.optional(t.number),
              })
            )
          })
        )
      })
    )({
      a: {
        b: ''
      }
    })
    ).toMatchInlineSnapshot
      (`
      [
        {
          "got": "",
          "message": "Expacted value.a.b to be an object",
          "path": [
            "value",
            "a",
            "b",
          ],
        },
      ]
    `)
  })
})
