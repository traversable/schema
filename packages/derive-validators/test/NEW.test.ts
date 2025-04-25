import * as vi from 'vitest'
import { foldSchema } from '@traversable/derive-validators'
import { t } from '@traversable/schema'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/derive-validators❳: happy path', () => {
  vi.it('〖⛳️〗› ❲foldSchema❳: t.integer', () => {
    vi.assert.isEmpty(foldSchema(t.integer)(0))
    vi.assert.isEmpty(foldSchema(t.integer.min(0))(0))
    vi.assert.isEmpty(foldSchema(t.integer.max(0))(0))
    vi.assert.isEmpty(foldSchema(t.integer.max(0))(0))
    vi.assert.isEmpty(foldSchema(t.integer.between(-1, +1))(0))
    vi.assert.isEmpty(foldSchema(t.integer.between(+1, -1))(0))
  })

  vi.it('〖⛳️〗› ❲foldSchema❳: t.bigint', () => {
    vi.assert.isEmpty(foldSchema(t.bigint)(0n))
    vi.assert.isEmpty(foldSchema(t.bigint.min(0n))(0n))
    vi.assert.isEmpty(foldSchema(t.bigint.max(0n))(0n))
    vi.assert.isEmpty(foldSchema(t.bigint.between(-1n, 1n))(0n))
    vi.assert.isEmpty(foldSchema(t.bigint.between(1n, -1n))(0n))
  })

  vi.it('〖⛳️〗› ❲foldSchema❳: t.number', () => {
    vi.assert.isEmpty(foldSchema(t.number)(+0.01))
    vi.assert.isEmpty(foldSchema(t.number.min(+0.1))(+0.1))
    vi.assert.isEmpty(foldSchema(t.number.max(+0.1))(+0.1))
    vi.assert.isEmpty(foldSchema(t.number.lessThan(+0.1))(+0.01))
    vi.assert.isEmpty(foldSchema(t.number.moreThan(+0.01))(+0.1))
    vi.assert.isEmpty(foldSchema(t.number.between(-0.1, +0.1))(+0.01))
    vi.assert.isEmpty(foldSchema(t.number.between(+0.1, -0.1))(+0.01))
    vi.assert.isEmpty(foldSchema(t.number.lessThan(+0.1).min(-0.1))(+0.01))
    vi.assert.isEmpty(foldSchema(t.number.moreThan(-0.1).max(+0.1))(+0.01))
    vi.assert.isEmpty(foldSchema(t.number.min(-0.1).lessThan(+0.1))(+0.01))
    vi.assert.isEmpty(foldSchema(t.number.max(+0.1).moreThan(-0.1))(+0.01))
    vi.assert.isEmpty(foldSchema(t.number.moreThan(-0.1).max(+0.1))(+0.01))
  })

  vi.it('〖⛳️〗› ❲foldSchema❳: t.string', () => {
    vi.assert.isEmpty(foldSchema(t.string)(''))
    vi.assert.isEmpty(foldSchema(t.string.min(0))(''))
    vi.assert.isEmpty(foldSchema(t.string.min(1))(' '))
    vi.assert.isEmpty(foldSchema(t.string.min(1))('  '))
    vi.assert.isEmpty(foldSchema(t.string.max(0))(''))
    vi.assert.isEmpty(foldSchema(t.string.max(1))(''))
    vi.assert.isEmpty(foldSchema(t.string.max(1))(' '))
    vi.assert.isEmpty(foldSchema(t.string.between(1, 2))(' '))
    vi.assert.isEmpty(foldSchema(t.string.between(2, 1))(' '))
    vi.assert.isEmpty(foldSchema(t.string.between(0, 0))(''))
  })

  vi.it('〖⛳️〗› ❲foldSchema❳: t.object(...)', () => {
    vi.assert.isEmpty(foldSchema(t.object({}))({}))
    vi.assert.isEmpty(foldSchema(t.object({ a: t.number }))({ a: 0 }))
    vi.assert.isEmpty(foldSchema(t.object({ a: t.number, b: t.object({ c: t.number }) }))({ a: 0, b: { c: 0 } }))

    // TODO: test exact optional
    // optional
    vi.assert.isEmpty(foldSchema(t.object({ a: t.number, b: t.optional(t.string) }))({ a: 0 }))
    vi.assert.isEmpty(foldSchema(t.object({ a: t.number, b: t.optional(t.string) }))({ a: 0, b: '' }))
    vi.assert.isEmpty(foldSchema(t.object({ a: t.number, b: t.object({ c: t.optional(t.number) }) }))({ a: 0, b: { c: 0 } }))
    vi.assert.isEmpty(foldSchema(t.object({ a: t.number, b: t.object({ c: t.optional(t.number) }) }))({ a: 0, b: {} }))
    vi.assert.isEmpty(foldSchema(t.object({ a: t.number, b: t.optional(t.object({ c: t.number })) }))({ a: 0 }))
    vi.assert.isEmpty(foldSchema(t.object({ a: t.number, b: t.optional(t.object({ c: t.number })) }))({ a: 0, b: { c: 0 } }))
    vi.assert.isEmpty(foldSchema(t.object({ a: t.number, b: t.optional(t.object({ c: t.optional(t.number) })) }))({ a: 0 }))
    vi.assert.isEmpty(foldSchema(t.object({ a: t.number, b: t.optional(t.object({ c: t.optional(t.number) })) }))({ a: 0, b: {} }))
    vi.assert.isEmpty(foldSchema(t.object({ a: t.number, b: t.optional(t.object({ c: t.optional(t.number) })) }))({ a: 0, b: { c: 0 } }))
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/derive-validators❳: unhappy path', () => {
  vi.it('〖⛳️〗› ❲foldSchema❳: t.integer', () => {
    vi.expect(foldSchema(t.integer)('')).toMatchInlineSnapshot(`
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
    vi.expect(foldSchema(t.integer.min(0))(-1)).toMatchInlineSnapshot(`
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
    vi.expect(foldSchema(t.integer.max(0))(+1)).toMatchInlineSnapshot(`
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

  vi.it('〖⛳️〗› ❲foldSchema❳: t.bigint', () => {
    vi.expect(foldSchema(t.bigint)('')).toMatchInlineSnapshot(`
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
    vi.expect(foldSchema(t.bigint.min(0n))(-1n)).toMatchInlineSnapshot(`
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
    vi.expect(foldSchema(t.bigint.max(0n))(1n)).toMatchInlineSnapshot(`
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

  vi.it('〖⛳️〗› ❲foldSchema❳: t.number', () => {
    vi.expect(foldSchema(t.number)('')).toMatchInlineSnapshot(`
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
    vi.expect(foldSchema(t.number.min(0))(-1)).toMatchInlineSnapshot(`
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
    vi.expect(foldSchema(t.number.max(0))(+1)).toMatchInlineSnapshot(`
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
    vi.expect(foldSchema(t.number.moreThan(0))(0)).toMatchInlineSnapshot(`
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
    vi.expect(foldSchema(t.number.lessThan(0))(0)).toMatchInlineSnapshot(`
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

  vi.it('〖⛳️〗› ❲foldSchema❳: t.string', () => {
    vi.expect(foldSchema(t.string)(0)).toMatchInlineSnapshot(`
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
    vi.expect(foldSchema(t.string.min(1))('')).toMatchInlineSnapshot(`
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
    vi.expect(foldSchema(t.string.max(1))('  ')).toMatchInlineSnapshot(`
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

  vi.it('〖⛳️〗› ❲foldSchema❳: t.object(...)', () => {
    vi.expect(foldSchema(t.object({ a: t.number }))({})).toMatchInlineSnapshot(`
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

    vi.expect(foldSchema(t.object({ a: t.number, b: t.object({ c: t.boolean }) }))({ a: 0, b: { c: 1 } })).toMatchInlineSnapshot(`
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

  vi.it('〖⛳️〗› ❲foldSchema❳: t.union(...)', () => {
    vi.expect(foldSchema(t.union(t.string, t.number))({})).toMatchInlineSnapshot(`
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

    vi.expect(foldSchema(t.object({ a: t.union(t.object({ b: t.string }), t.object({ c: t.number })) }))({ a: { b: false } })).toMatchInlineSnapshot(`
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

    vi.expect(foldSchema(t.object({ a: t.union(t.object({ b: t.string }), t.object({ c: t.number })) }))({ a: { c: false } })).toMatchInlineSnapshot(`
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

  vi.it('〖⛳️〗› ❲foldSchema❳: t.optional(...)', () => {
    vi.expect(foldSchema(
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

    vi.expect(foldSchema(
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

  vi.it('〖⛳️〗› ❲foldSchema❳: t.optional(...)', () => {
    vi.expect(foldSchema(t.optional(t.string))(1)).toMatchInlineSnapshot(`
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

    vi.expect(foldSchema(
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

    vi.expect(foldSchema(
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
