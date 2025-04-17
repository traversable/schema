import * as vi from 'vitest'
import { fc, test } from '@fast-check/vitest'
import { Seed } from '@traversable/schema-seed'
import { t, configure } from '@traversable/schema-core'

import { Jit } from '@traversable/schema-jit-compiler'

import * as Arbitrary from './TODO.js'


vi.describe.skip('〖⛳️〗‹‹‹ ❲@traversable/schema-jit-compiler❳: Jit.compile w/ randomly generated data', () => {
  let hardcodedSchema = t.object({
    "#1C": t.object({
      twoC: t.intersect(
        t.object({
          '\\3A': t.optional(t.symbol),
          '\\3B': t.optional(t.array(t.union(t.eq({ tag: 'left' }), t.eq({ tag: 'right' })))),
        }),
        t.object({
          g: t.tuple(
            t.object({ h: t.any })
          ),
          h: t.optional(t.object({ i: t.optional(t.boolean), j: t.union(t.number, t.bigint) })),
        })
      ),
      twoB: t.eq({
        "#3B": [
          1,
          [2],
          [[3]],
        ],
        "#3A": {
          n: 'over 9000',
          o: [
            { p: false },
          ],
        }
      }),
      twoA: t.integer,
    }),
    "#1A": t.union(t.integer),
    "#1B": t.tuple(
      t.record(t.any),
    ),
  })

  let check = Jit.compile(hardcodedSchema)

  test.prop([Arbitrary.fromSchema(hardcodedSchema)], {
    // numRuns: 10_000,
    endOnFailure: true,
  })('〖⛳️〗› ❲Jit.compile❳: randomly generated data', (_) => {
    try { vi.assert.isTrue(check(_)) }
    catch (e) {
      let generated = Jit.generate(hardcodedSchema)
      console.group('\r\n  =====    Jit.compile property test failed    =====  \r\n')
      console.error()
      console.error('Check for valid, randomly generated data failed')
      console.error('Schema:\r\n\n' + generated + '\r\n\n')
      console.error('Input:\r\n\n' + JSON.stringify(_, null, 2) + '\r\n\n')
      console.groupEnd()
      vi.assert.fail(t.has('message', t.string)(e) ? e.message : JSON.stringify(e, null, 2))
    }
  })
})


vi.describe.skip('〖⛳️〗‹‹‹ ❲@traversable/schema-jit-compiler❳: Jit.compile w/ randomly generated schemas', () => {
  test.prop([fc.letrec(Seed.seed()).tree], {
    endOnFailure: true,
    numRuns: 10,
    // numRuns: 10_000,
  })(
    '〖⛳️〗› ❲Jit.compile❳: randomly generated schema', (seed) => {
      let schema = Seed.toSchema(seed)
      let check = Jit.compile(schema)
      let arbitrary = Arbitrary.fromSchema(schema)
      let inputs = fc.sample(arbitrary, 100)

      for (let input of inputs) {
        try { vi.assert.isTrue(check(input)) }
        catch (e) {
          let generated = Jit.generate(schema)
          console.group('\r\n  =====    Jit.compile property test failed    =====  \r\n')
          console.error()
          console.error('Check for valid, randomly generated data failed')
          console.error('Schema:\r\n\n' + generated + '\r\n\n')
          console.error('Input:\r\n\n' + JSON.stringify(input, null, 2) + '\r\n\n')
          console.groupEnd()
          vi.assert.fail(t.has('message', t.string)(e) ? e.message : JSON.stringify(e, null, 2))
        }
      }
    }
  )
})


vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-jit-compiler❳: Jit.compile', () => {
  vi.describe('〖⛳️〗‹‹ ❲Jit.compile❳: eq', () => {
    let check = Jit.compile(
      t.eq({
        a: false,
      })
    )

    vi.test.concurrent.for([
      {},
      { a: true },
    ])(
      '〖⛳️〗› ❲t.eq❳: check fails with bad input (index %#)',
      (_) => vi.assert.isFalse(check(_))
    )

    vi.test.concurrent.for([
      { a: false },
    ])(
      '〖⛳️〗› ❲t.eq❳: check succeeds with valid input (index %#)',
      (_) => vi.assert.isTrue(check(_))
    )
  })


  vi.describe('〖⛳️〗‹‹ ❲Jit.compile❳: array', () => {
    let check = Jit.compile(
      t.array(t.boolean)
    )

    vi.test.concurrent.for([
      [1],
    ])(
      '〖⛳️〗› ❲t.array❳: check fails with bad input (index %#)',
      (_) => vi.assert.isFalse(check(_))
    )

    vi.test.concurrent.for([
      [],
      [Math.random() > 0.5],
    ])(
      '〖⛳️〗› ❲t.array❳: check succeeds with valid input (index %#)',
      (_) => vi.assert.isTrue(check(_))
    )
  })


  vi.describe('〖⛳️〗‹‹ ❲Jit.compile❳: record', () => {
    let check = Jit.compile(
      t.record(t.boolean)
    )

    vi.test.concurrent.for([
      [],
      { a: 0 },
    ])(
      '〖⛳️〗› ❲t.record❳: check fails with bad input (index %#)',
      (_) => vi.assert.isFalse(check(_))
    )

    vi.test.concurrent.for([
      {},
      { a: false },
    ])(
      '〖⛳️〗› ❲t.record❳: check succeeds with valid input (index %#)',
      (_) => vi.assert.isTrue(check(_))
    )
  })


  vi.describe('〖⛳️〗‹‹ ❲Jit.compile❳: optional', () => {
    let check = Jit.compile(
      t.object({
        a: t.optional(t.boolean),
      })
    )

    vi.test.concurrent.for([
      { a: 0 },
    ])(
      '〖⛳️〗› ❲t.optional❳: check fails with bad input (index %#)',
      (_) => vi.assert.isFalse(check(_))
    )

    vi.test.concurrent.for([
      {},
      { a: false },
    ])(
      '〖⛳️〗› ❲t.optional❳: check succeeds with valid input (index %#)',
      (_) => vi.assert.isTrue(check(_))
    )
  })


  vi.describe('〖⛳️〗‹‹ ❲Jit.compile❳: tuple', () => {
    let check = Jit.compile(
      t.tuple(
        t.string,
        t.number,
      )
    )

    vi.test.concurrent.for([
      [],
      [0, ''],
    ])(
      '〖⛳️〗› ❲t.tuple❳: check fails with bad input (index %#)',
      (_) => vi.assert.isFalse(check(_))
    )

    vi.test.concurrent.for([
      ['', 0],
    ])(
      '〖⛳️〗› ❲t.tuple❳: check succeeds with valid input (index %#)',
      (_) => vi.assert.isTrue(check(_))
    )
  })


  vi.describe('〖⛳️〗‹‹ ❲Jit.compile❳: union', () => {
    let check = Jit.compile(
      t.union(
        t.string,
        t.number,
      )
    )

    vi.test.concurrent.for([
      false,
    ])(
      '〖⛳️〗› ❲t.union❳: check fails with bad input (index %#)',
      (_) => vi.assert.isFalse(check(_))
    )

    vi.test.concurrent.for([
      '',
      0,
    ])(
      '〖⛳️〗› ❲t.union❳: check succeeds with valid input (index %#)',
      (_) => vi.assert.isTrue(check(_))
    )
  })


  vi.describe('〖⛳️〗‹‹ ❲Jit.compile❳: intersect', () => {
    let check = Jit.compile(
      t.intersect(
        t.object({
          a: t.boolean,
        }),
        t.object({
          b: t.integer,
        })
      )
    )

    vi.test.concurrent.for([
      {},
      { a: false },
      { b: 0 },
      { a: false, b: '' },
      { a: '', b: 0 },
    ])(
      '〖⛳️〗› ❲t.intersect❳: check fails with bad input (index %#)',
      (_) => vi.assert.isFalse(check(_))
    )

    vi.test.concurrent.for([
      { a: false, b: 0 },
    ])(
      '〖⛳️〗› ❲t.intersect❳: check succeeds with valid input (index %#)',
      (_) => vi.assert.isTrue(check(_))
    )
  })


  vi.describe('〖⛳️〗‹‹ ❲Jit.compile❳: object', () => {
    let check = Jit.compile(
      t.object({
        a: t.boolean,
      })
    )

    vi.test.concurrent.for([
      {},
      { a: 0 },
      { b: false },
    ])(
      '〖⛳️〗› ❲t.object❳: check fails with bad input (index %#)',
      (_) => vi.assert.isFalse(check(_))
    )

    vi.test.concurrent.for([
      { a: false },
    ])(
      '〖⛳️〗› ❲t.object❳: check succeeds with valid input (index %#)',
      (_) => vi.assert.isTrue(check(_))
    )
  })

})


vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-jit-compiler❳: nullary', () => {

  vi.it('〖⛳️〗› ❲jit❳: t.never', () => {
    vi.expect(Jit.generate(
      t.never
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return false
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.any', () => {
    vi.expect(Jit.generate(
      t.any
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return true
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.unknown', () => {
    vi.expect(Jit.generate(
      t.unknown
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return true
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.void', () => {
    vi.expect(Jit.generate(
      t.void
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === void 0
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.null', () => {
    vi.expect(Jit.generate(
      t.null
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === null
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.undefined', () => {
    vi.expect(Jit.generate(
      t.undefined
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === undefined
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.symbol', () => {
    vi.expect(Jit.generate(
      t.symbol
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "symbol"
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.boolean', () => {
    vi.expect(Jit.generate(
      t.boolean
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "boolean"
      }"
    `)
  })
})


vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-jit-compiler❳: boundable', () => {

  vi.it('〖⛳️〗› ❲jit❳: t.integer', () => {
    vi.expect(Jit.generate(
      t.integer
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value)
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.integer.min(x)', () => {
    vi.expect(Jit.generate(
      t.integer.min(0)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value) && 0 <= value
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.integer.max(x)', () => {
    vi.expect(Jit.generate(
      t.integer.max(1)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value) && value <= 1
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.integer.min(x).max(y)', () => {
    vi.expect(Jit.generate(
      t.integer
        .min(0)
        .max(1)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value) && 0 <= value && value <= 1
      }"
    `)

    vi.expect(Jit.generate(
      t.integer
        .max(1)
        .min(0)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value) && 0 <= value && value <= 1
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.integer.between(x, y)', () => {
    vi.expect(Jit.generate(
      t.integer.between(0, 1)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value) && 0 <= value && value <= 1
      }"
    `)

    vi.expect(Jit.generate(
      t.integer.between(1, 0)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value) && 0 <= value && value <= 1
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.bigint', () => {
    vi.expect(Jit.generate(
      t.bigint
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "bigint"
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.bigint.min(x)', () => {
    vi.expect(Jit.generate(
      t.bigint.min(0n)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "bigint" && 0n <= value
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.bigint.max(x)', () => {
    vi.expect(Jit.generate(
      t.bigint.max(1n)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "bigint" && value <= 1n
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.bigint.min(x).max(y)', () => {
    vi.expect(Jit.generate(
      t.bigint
        .min(0n)
        .max(1n)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "bigint" && 0n <= value && value <= 1n
      }"
    `)

    vi.expect(Jit.generate(
      t.bigint
        .max(1n)
        .min(0n)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "bigint" && 0n <= value && value <= 1n
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.bigint.between(x, y)', () => {
    vi.expect(Jit.generate(
      t.bigint.between(0n, 1n)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "bigint" && 0n <= value && value <= 1n
      }"
    `)

    vi.expect(Jit.generate(
      t.bigint.between(1n, 0n)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "bigint" && 0n <= value && value <= 1n
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.number', () => {
    vi.expect(Jit.generate(
      t.number
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value)
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.number.min(x)', () => {
    vi.expect(Jit.generate(
      t.number.min(0)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && 0 <= value
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.number.max(x)', () => {
    vi.expect(Jit.generate(
      t.number.max(1)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && value <= 1
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.number.min(x).max(y)', () => {
    vi.expect(Jit.generate(
      t.number
        .min(0)
        .max(1)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && 0 <= value && value <= 1
      }"
    `)

    vi.expect(Jit.generate(
      t.number
        .max(1)
        .min(0)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && 0 <= value && value <= 1
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.number.between(x, y)', () => {
    vi.expect(Jit.generate(
      t.number.between(0, 1)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && 0 <= value && value <= 1
      }"
    `)

    vi.expect(Jit.generate(
      t.number.between(1, 0)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && 0 <= value && value <= 1
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.number.moreThan(x)', () => {
    vi.expect(Jit.generate(
      t.number.moreThan(0)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && 0 < value
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.number.lessThan(x)', () => {
    vi.expect(Jit.generate(
      t.number.lessThan(1)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && value < 1
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.number.moreThan(x).lessThan(y)', () => {
    vi.expect(Jit.generate(
      t.number
        .moreThan(0)
        .lessThan(1)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && 0 < value && value < 1
      }"
    `)

    vi.expect(Jit.generate(
      t.number
        .lessThan(1)
        .moreThan(0)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && 0 < value && value < 1
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.number.min(x).lessThan(y)', () => {
    vi.expect(Jit.generate(
      t.number
        .min(0)
        .lessThan(1)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && 0 <= value && value < 1
      }"
    `)

    vi.expect(Jit.generate(
      t.number
        .lessThan(1)
        .min(0)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && 0 <= value && value < 1
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.number.moreThan(x).max(y)', () => {
    vi.expect(Jit.generate(
      t.number
        .moreThan(0)
        .max(1)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && 0 < value && value <= 1
      }"
    `)

    vi.expect(Jit.generate(
      t.number
        .max(1)
        .moreThan(0)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && 0 < value && value <= 1
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.string', () => {
    vi.expect(Jit.generate(
      t.string
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string"
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.string.min(x)', () => {
    vi.expect(Jit.generate(
      t.string.min(0)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string" && 0 <= value.length
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.string.max(x)', () => {
    vi.expect(Jit.generate(
      t.string.max(1)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string" && value.length <= 1
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.string.min(x).max(y)', () => {
    vi.expect(Jit.generate(
      t.string
        .min(0)
        .max(1)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string" && 0 <= value.length && value.length <= 1
      }"
    `)

    vi.expect(Jit.generate(
      t.string
        .max(1)
        .min(0)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string" && 0 <= value.length && value.length <= 1
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.string.between(x, y)', () => {
    vi.expect(Jit.generate(
      t.string.between(0, 1)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string" && 0 <= value.length && value.length <= 1
      }"
    `)

    vi.expect(Jit.generate(
      t.string.between(1, 0)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string" && 0 <= value.length && value.length <= 1
      }"
    `)
  })
})


vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-jit-compiler❳: unary', () => {

  vi.it('〖⛳️〗› ❲jit❳: t.eq(...)', () => {
    vi.expect(Jit.generate(
      t.eq({
        l: 'L',
        m: 'M'
      })
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return !!value && typeof value === "object" && !Array.isArray(value)
          && value.l === "L"
          && value.m === "M"
      }"
    `)

    vi.expect(Jit.generate(
      t.eq(
        [
          {
            a: 3,
            b: 3,
            c: [5, 6],
          },
          { z: 2 },
          1
        ]
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          Array.isArray(value) && value.length === 3
          && value[0] === 1
          && !!value[1] && typeof value[1] === "object" && !Array.isArray(value[1])
            && value[1].z === 2
          && !!value[2] && typeof value[2] === "object" && !Array.isArray(value[2])
            && value[2].a === 3
            && value[2].b === 3
            && Array.isArray(value[2].c) && value[2].c.length === 2
              && value[2].c[0] === 5
              && value[2].c[1] === 6
        )
      }"
    `)

    vi.expect(Jit.generate(
      t.eq(
        [
          1,
          { z: 2 },
          {
            a: 3,
            b: 3,
            c: [5, 6],
          }
        ]
      ))).toMatchInlineSnapshot
      (`
        "function check(value) {
          return (
            Array.isArray(value) && value.length === 3
            && value[0] === 1
            && !!value[1] && typeof value[1] === "object" && !Array.isArray(value[1])
              && value[1].z === 2
            && !!value[2] && typeof value[2] === "object" && !Array.isArray(value[2])
              && value[2].a === 3
              && value[2].b === 3
              && Array.isArray(value[2].c) && value[2].c.length === 2
                && value[2].c[0] === 5
                && value[2].c[1] === 6
          )
        }"
      `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.optional(...)', () => {
    vi.expect(Jit.generate(
      t.optional(t.eq(1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === undefined || value === 1
      }"
    `)

    vi.expect(Jit.generate(
      t.optional(t.optional(t.eq(1)))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === undefined || (value === undefined || value === 1)
      }"
    `)

    vi.expect(Jit.generate(
      t.optional(
        t.union(
          t.eq(1000),
          t.eq(2000),
          t.eq(3000),
          t.eq(4000),
          t.eq(5000),
          t.eq(6000),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          
          value === undefined
          || ((value === 1000) || (value === 2000) || (value === 3000) || (value === 4000) || (value === 5000) || (value === 6000))
        
        )
      }"
    `)

    vi.expect(Jit.generate(
      t.optional(
        t.union(
          t.eq(1000),
          t.eq(2000),
          t.eq(3000),
          t.eq(4000),
          t.eq(5000),
          t.eq(6000),
          t.eq(9000),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          
          value === undefined
          || (
            (value === 1000)
            || (value === 2000)
            || (value === 3000)
            || (value === 4000)
            || (value === 5000)
            || (value === 6000)
            || (value === 9000)
          )
        
        )
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.array(...)', () => {
    vi.expect(Jit.generate(
      t.array(t.eq(1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Array.isArray(value) && value.every((value) => value === 1)
      }"
    `)

    vi.expect(Jit.generate(
      t.array(t.array(t.eq(2)))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Array.isArray(value) && value.every((value) => Array.isArray(value) && value.every((value) => value === 2))
      }"
    `)

    vi.expect(Jit.generate(
      t.array(t.array(t.array(t.array(t.array(t.array(t.eq(3)))))))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          Array.isArray(value) && value.every((value) => 
            Array.isArray(value) && value.every((value) => 
              Array.isArray(value) && value.every((value) => 
                Array.isArray(value) && value.every((value) => 
                  Array.isArray(value) && value.every((value) => Array.isArray(value) && value.every((value) => value === 3))
                )
              )
            )
          )
        )
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.record(...)', () => {
    vi.expect(Jit.generate(
      t.record(t.eq(1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          !!value && typeof value === "object" && !Array.isArray(value) 
          && !(value instanceof Date) && !(value instanceof Uint8Array) 
          && Object.entries(value).every(([key, value]) => 
            typeof key === "string" && value === 1
          )
        )
      }"
    `)

    vi.expect(Jit.generate(
      t.record(t.record(t.eq(2)))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          !!value && typeof value === "object" && !Array.isArray(value) 
          && !(value instanceof Date) && !(value instanceof Uint8Array) 
          && Object.entries(value).every(([key, value]) => 
            typeof key === "string" && !!value && typeof value === "object" && !Array.isArray(value) 
            && !(value instanceof Date) && !(value instanceof Uint8Array) 
            && Object.entries(value).every(([key, value]) => 
              typeof key === "string" && value === 2
            )
          )
        )
      }"
    `)

  })

  vi.it('〖⛳️〗› ❲jit❳: t.union(...)', () => {

    vi.expect(Jit.generate(
      t.union()
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return false
      }"
    `)

    vi.expect(Jit.generate(
      t.union(t.never)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (false)
      }"
    `)

    vi.expect(Jit.generate(
      t.union(t.unknown)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (true)
      }"
    `)

    vi.expect(Jit.generate(
      t.union(t.union())
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return ((false))
      }"
    `)

    vi.expect(Jit.generate(
      t.union(
        t.integer,
        t.bigint,
      )
    )).toMatchInlineSnapshot

      (`
      "function check(value) {
        return (Number.isSafeInteger(value)) || (typeof value === "bigint")
      }"
    `)

    vi.expect(Jit.generate(
      t.union(
        t.boolean,
        t.symbol,
        t.integer,
        t.bigint,
        t.number,
        t.string,
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          (typeof value === "symbol")
          || (typeof value === "boolean")
          || (Number.isSafeInteger(value))
          || (typeof value === "bigint")
          || (Number.isFinite(value))
          || (typeof value === "string")
        )
      }"
    `)

    vi.expect(Jit.generate(
      t.union(
        t.object({
          a: t.eq(1),
        }),
        t.object({
          b: t.eq(2),
        }),
        t.object({
          c: t.eq(3)
        })
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          (!!value && typeof value === "object" && !Array.isArray(value) && value.a === 1)
          || (!!value && typeof value === "object" && !Array.isArray(value) && value.b === 2)
          || (!!value && typeof value === "object" && !Array.isArray(value) && value.c === 3)
        )
      }"
    `)

    vi.expect(Jit.generate(
      t.union(
        t.eq(9000),
        t.union(
          t.object({
            a: t.eq(1),
          }),
          t.object({
            b: t.eq(2),
          }),
          t.object({
            c: t.eq(3)
          })
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          (value === 9000)
          || ((
            (!!value && typeof value === "object" && !Array.isArray(value) && value.a === 1)
            || (!!value && typeof value === "object" && !Array.isArray(value) && value.b === 2)
            || (!!value && typeof value === "object" && !Array.isArray(value) && value.c === 3)
          ))
        )
      }"
    `)

  })

  vi.it('〖⛳️〗› ❲jit❳: t.intersect(...)', () => {
    vi.expect(Jit.generate(
      t.intersect(t.unknown)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return true
      }"
    `)

    vi.expect(Jit.generate(
      t.intersect(
        t.object({
          a: t.eq(1),
        }),
        t.object({
          b: t.eq(2),
        }),
        t.object({
          c: t.eq(3)
        })
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          !!value && typeof value === "object" && !Array.isArray(value) && value.a === 1
          && !!value && typeof value === "object" && !Array.isArray(value) && value.b === 2
          && !!value && typeof value === "object" && !Array.isArray(value) && value.c === 3
        )
      }"
    `)

    vi.expect(Jit.generate(
      t.intersect(
        t.eq(9000),
        t.intersect(
          t.object({
            a: t.eq(1),
          }),
          t.object({
            b: t.eq(2),
          }),
          t.object({
            c: t.eq(3)
          }),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          value === 9000
          && (
            !!value && typeof value === "object" && !Array.isArray(value) && value.a === 1
            && !!value && typeof value === "object" && !Array.isArray(value) && value.b === 2
            && !!value && typeof value === "object" && !Array.isArray(value) && value.c === 3
          )
        )
      }"
    `)

  })

  vi.it('〖⛳️〗› ❲jit❳: t.tuple(...)', () => {
    vi.expect(Jit.generate(
      t.tuple()
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Array.isArray(value) && value.length === 0
      }"
    `)

    vi.expect(Jit.generate(
      t.tuple(t.unknown)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Array.isArray(value) && value.length === 1 && true
      }"
    `)

    vi.expect(Jit.generate(
      t.tuple(
        t.tuple(),
        t.tuple(),
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          Array.isArray(value) && value.length === 2
          && Array.isArray(value[0]) && value[0].length === 0
          && Array.isArray(value[1]) && value[1].length === 0
        )
      }"
    `)

    vi.expect(Jit.generate(
      t.tuple(
        t.tuple(
          t.eq('[0][0]'),
        ),
        t.tuple(
          t.eq('[1][0]'),
        ),
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          Array.isArray(value) && value.length === 2
          && Array.isArray(value[0]) && value[0].length === 1 && value[0][0] === "[0][0]"
          && Array.isArray(value[1]) && value[1].length === 1 && value[1][0] === "[1][0]"
        )
      }"
    `)

    vi.expect(Jit.generate(
      t.tuple(
        t.tuple(
          t.eq('[0][0]'),
          t.eq('[0][1]'),
        ),
        t.tuple(
          t.eq('[1][0]'),
          t.eq('[1][1]'),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          Array.isArray(value) && value.length === 2
          && Array.isArray(value[0]) && value[0].length === 2 && value[0][0] === "[0][0]" && value[0][1] === "[0][1]"
          && Array.isArray(value[1]) && value[1].length === 2 && value[1][0] === "[1][0]" && value[1][1] === "[1][1]"
        )
      }"
    `)

    vi.expect(Jit.generate(
      t.tuple(
        t.tuple(
          t.tuple(
            t.eq('[0][0][0]'),
            t.eq('[0][0][1]'),
            t.eq('[0][0][2]'),
          ),
          t.tuple(
            t.eq('[0][1][0]'),
            t.eq('[0][1][1]'),
            t.eq('[0][1][2]'),
          ),
          t.tuple(
            t.eq('[0][2][0]'),
            t.eq('[0][2][1]'),
            t.eq('[0][2][2]'),
          ),
        ),
        t.tuple(
          t.tuple(
            t.eq('[1][0][0]'),
            t.eq('[1][0][1]'),
            t.eq('[1][0][2]'),
          ),
          t.tuple(
            t.eq('[1][1][0]'),
            t.eq('[1][1][1]'),
            t.eq('[1][1][2]'),
          ),
          t.tuple(
            t.eq('[1][2][0]'),
            t.eq('[1][2][1]'),
            t.eq('[1][2][2]'),
          ),
        ),
        t.tuple(
          t.tuple(
            t.eq('[2][0][0]'),
            t.eq('[2][0][1]'),
            t.eq('[2][0][2]'),
          ),
          t.tuple(
            t.eq('[2][1][0]'),
            t.eq('[2][1][1]'),
            t.eq('[2][1][2]'),
          ),
          t.tuple(
            t.eq('[2][2][0]'),
            t.eq('[2][2][1]'),
            t.eq('[2][2][2]'),
          ),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          Array.isArray(value) && value.length === 3
          && Array.isArray(value[0]) && value[0].length === 3
            && Array.isArray(value[0][0]) && value[0][0].length === 3
              && value[0][0][0] === "[0][0][0]"
              && value[0][0][1] === "[0][0][1]"
              && value[0][0][2] === "[0][0][2]"
            && Array.isArray(value[0][1]) && value[0][1].length === 3
              && value[0][1][0] === "[0][1][0]"
              && value[0][1][1] === "[0][1][1]"
              && value[0][1][2] === "[0][1][2]"
            && Array.isArray(value[0][2]) && value[0][2].length === 3
              && value[0][2][0] === "[0][2][0]"
              && value[0][2][1] === "[0][2][1]"
              && value[0][2][2] === "[0][2][2]"
          && Array.isArray(value[1]) && value[1].length === 3
            && Array.isArray(value[1][0]) && value[1][0].length === 3
              && value[1][0][0] === "[1][0][0]"
              && value[1][0][1] === "[1][0][1]"
              && value[1][0][2] === "[1][0][2]"
            && Array.isArray(value[1][1]) && value[1][1].length === 3
              && value[1][1][0] === "[1][1][0]"
              && value[1][1][1] === "[1][1][1]"
              && value[1][1][2] === "[1][1][2]"
            && Array.isArray(value[1][2]) && value[1][2].length === 3
              && value[1][2][0] === "[1][2][0]"
              && value[1][2][1] === "[1][2][1]"
              && value[1][2][2] === "[1][2][2]"
          && Array.isArray(value[2]) && value[2].length === 3
            && Array.isArray(value[2][0]) && value[2][0].length === 3
              && value[2][0][0] === "[2][0][0]"
              && value[2][0][1] === "[2][0][1]"
              && value[2][0][2] === "[2][0][2]"
            && Array.isArray(value[2][1]) && value[2][1].length === 3
              && value[2][1][0] === "[2][1][0]"
              && value[2][1][1] === "[2][1][1]"
              && value[2][1][2] === "[2][1][2]"
            && Array.isArray(value[2][2]) && value[2][2].length === 3
              && value[2][2][0] === "[2][2][0]"
              && value[2][2][1] === "[2][2][1]"
              && value[2][2][2] === "[2][2][2]"
        )
      }"
    `)

  })

  vi.it('〖⛳️〗› ❲jit❳: object(...)', () => {

    vi.expect(Jit.generate(
      t.object({})
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return !!value && typeof value === "object" && !Array.isArray(value)
      }"
    `)

    vi.expect(Jit.generate(
      t.object({
        A: t.optional(t.number.min(1)),
      })
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          !!value && typeof value === "object" && !Array.isArray(value)
          && (value.A === undefined || (Number.isFinite(value.A) && 1 <= value.A))
        )
      }"
    `)

    vi.expect(Jit.generate(
      t.object({
        A: t.optional(t.number),
        B: t.array(t.integer)
      })
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          !!value && typeof value === "object" && !Array.isArray(value)
          && (value.A === undefined || Number.isFinite(value.A))
          && Array.isArray(value.B) && value.B.every((value) => Number.isSafeInteger(value))
        )
      }"
    `)

    vi.expect(Jit.generate(
      t.object({
        B: t.array(t.integer),
        A: t.object({
          C: t.optional(t.number)
        }),
      })
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          !!value && typeof value === "object" && !Array.isArray(value)
          && Array.isArray(value.B) && value.B.every((value) => Number.isSafeInteger(value))
          && !!value.A && typeof value.A === "object" && !Array.isArray(value.A)
            && (value.A.C === undefined || Number.isFinite(value.A.C))
        )
      }"
    `)

    vi.expect(Jit.generate(
      t.object({
        A: t.union(
          t.object({
            B: t.optional(t.eq(1)),
            C: t.eq(2),
          }),
          t.object({
            D: t.optional(t.eq(3)),
            E: t.eq(4),
          })
        )
      })
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          !!value && typeof value === "object" && !Array.isArray(value)
          && (
            (!!value.A && typeof value.A === "object" && !Array.isArray(value.A)
              && value.A.C === 2
              && (value.A.B === undefined || value.A.B === 1))
            || (!!value.A && typeof value.A === "object" && !Array.isArray(value.A)
              && value.A.E === 4
              && (value.A.D === undefined || value.A.D === 3))
          )
        )
      }"
    `)

    vi.expect(Jit.generate(
      t.object({
        a: t.record(t.object({
          b: t.string,
          c: t.tuple()
        }))
      })
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          !!value && typeof value === "object" && !Array.isArray(value)
          && !!value.a && typeof value.a === "object" && !Array.isArray(value.a) 
            && !(value.a instanceof Date) && !(value.a instanceof Uint8Array) 
            && Object.entries(value.a).every(([key, value]) => 
              typeof key === "string" && !!value && typeof value === "object" && !Array.isArray(value)
              && typeof value.b === "string"
              && Array.isArray(value.c) && value.c.length === 0
            )
        )
      }"
    `)

    vi.expect(Jit.generate(
      t.object({
        F: t.union(
          t.object({ F: t.number }),
          t.object({ G: t.any })
        ),
      })
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          !!value && typeof value === "object" && !Array.isArray(value)
          && (
            (!!value.F && typeof value.F === "object" && !Array.isArray(value.F) && true)
            || (!!value.F && typeof value.F === "object" && !Array.isArray(value.F) && Number.isFinite(value.F.F))
          )
        )
      }"
    `)

    vi.expect(Jit.generate(
      t.object({
        "#1C": t.object({
          twoC: t.intersect(
            t.object({
              '\\3A': t.optional(t.symbol),
              '\\3B': t.optional(
                t.array(
                  t.union(
                    t.eq({ tag: 'left' }),
                    t.eq({ tag: 'right' }),
                  )
                )
              ),
            }),
            t.object({
              g: t.tuple(
                t.object({ h: t.any }),
              ),
              h: t.optional(
                t.object({
                  i: t.optional(t.boolean),
                  j: t.union(
                    t.number.moreThan(0).max(128),
                    t.bigint,
                  ),
                })
              ),
            })
          ),
          twoB: t.eq({
            "#3B": [
              1,
              [2],
              [[3]],
            ],
            "#3A": {
              n: 'over 9000',
              o: [
                { p: false },
              ],
            }
          }),
          twoA: t.integer.between(-10, 10),
        }),
        "#1A": t.integer.min(3),
        "#1B": t.tuple(
          t.record(t.any),
        ),
      })
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          !!value && typeof value === "object" && !Array.isArray(value)
          && (Number.isSafeInteger(value["#1A"]) && 3 <= value["#1A"])
          && Array.isArray(value["#1B"]) && value["#1B"].length === 1
            && !!value["#1B"][0] && typeof value["#1B"][0] === "object" && !Array.isArray(value["#1B"][0]) 
              && !(value["#1B"][0] instanceof Date) && !(value["#1B"][0] instanceof Uint8Array) 
              && Object.entries(value["#1B"][0]).every(([key, value]) => 
                typeof key === "string" && true
              )
          && !!value["#1C"] && typeof value["#1C"] === "object" && !Array.isArray(value["#1C"])
            && (Number.isSafeInteger(value["#1C"].twoA) && -10 <= value["#1C"].twoA && value["#1C"].twoA <= 10)
            && !!value["#1C"].twoB && typeof value["#1C"].twoB === "object" && !Array.isArray(value["#1C"].twoB)
              && !!value["#1C"].twoB["#3A"] && typeof value["#1C"].twoB["#3A"] === "object" && !Array.isArray(value["#1C"].twoB["#3A"])
                && value["#1C"].twoB["#3A"].n === "over 9000"
                && Array.isArray(value["#1C"].twoB["#3A"].o) && value["#1C"].twoB["#3A"].o.length === 1
                  && !!value["#1C"].twoB["#3A"].o[0] && typeof value["#1C"].twoB["#3A"].o[0] === "object" && !Array.isArray(value["#1C"].twoB["#3A"].o[0])
                    && value["#1C"].twoB["#3A"].o[0].p === false
              && Array.isArray(value["#1C"].twoB["#3B"]) && value["#1C"].twoB["#3B"].length === 3
                && value["#1C"].twoB["#3B"][0] === 1
                && Array.isArray(value["#1C"].twoB["#3B"][1]) && value["#1C"].twoB["#3B"][1].length === 1
                  && value["#1C"].twoB["#3B"][1][0] === 2
                && Array.isArray(value["#1C"].twoB["#3B"][2]) && value["#1C"].twoB["#3B"][2].length === 1
                  && Array.isArray(value["#1C"].twoB["#3B"][2][0]) && value["#1C"].twoB["#3B"][2][0].length === 1
                    && value["#1C"].twoB["#3B"][2][0][0] === 3
            && (
              !!value["#1C"].twoC && typeof value["#1C"].twoC === "object" && !Array.isArray(value["#1C"].twoC)
                && Array.isArray(value["#1C"].twoC.g) && value["#1C"].twoC.g.length === 1
                  && !!value["#1C"].twoC.g[0] && typeof value["#1C"].twoC.g[0] === "object" && !Array.isArray(value["#1C"].twoC.g[0])
                    && true
                && (
                  value["#1C"].twoC.h === undefined
                  || !!value["#1C"].twoC.h && typeof value["#1C"].twoC.h === "object" && !Array.isArray(value["#1C"].twoC.h)
                    && (value["#1C"].twoC.h?.i === undefined || typeof value["#1C"].twoC.h?.i === "boolean")
                    && (
                      (typeof value["#1C"].twoC.h?.j === "bigint")
                      || ((Number.isFinite(value["#1C"].twoC.h?.j) && 0 < value["#1C"].twoC.h?.j && value["#1C"].twoC.h?.j <= 128))
                    )
                )
              && !!value["#1C"].twoC && typeof value["#1C"].twoC === "object" && !Array.isArray(value["#1C"].twoC)
                && (value["#1C"].twoC["\\\\3A"] === undefined || typeof value["#1C"].twoC["\\\\3A"] === "symbol")
                && (
                  value["#1C"].twoC["\\\\3B"] === undefined
                  || Array.isArray(value["#1C"].twoC["\\\\3B"]) && value["#1C"].twoC["\\\\3B"].every((value) => 
                      (
                      (!!value && typeof value === "object" && !Array.isArray(value)
                        && value.tag === "left")
                      || (!!value && typeof value === "object" && !Array.isArray(value)
                        && value.tag === "right")
                    )
                    )
                )
            )
        )
      }"
    `)

  })
})


vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-jit-compiler❳: configure', () => {
  vi.it('〖⛳️〗› ❲jit❳: treatArraysAsObjects', () => {
    let schema = t.object({
      F: t.union(
        t.object({ F: t.number }),
        t.object({ G: t.any })
      ),
    })

    configure({
      schema: {
        treatArraysAsObjects: false,
      }
    }) && vi.expect(Jit.generate(schema)).toMatchInlineSnapshot
        (`
      "function check(value) {
        return (
          !!value && typeof value === "object" && !Array.isArray(value)
          && (
            (!!value.F && typeof value.F === "object" && !Array.isArray(value.F) && true)
            || (!!value.F && typeof value.F === "object" && !Array.isArray(value.F) && Number.isFinite(value.F.F))
          )
        )
      }"
    `)

    configure({
      schema: {
        treatArraysAsObjects: true
      }
    }) && vi.expect(Jit.generate(schema)).toMatchInlineSnapshot
        (`
      "function check(value) {
        return (
          !!value && typeof value === "object"
          && (
            (!!value.F && typeof value.F === "object" && true)
            || (!!value.F && typeof value.F === "object" && Number.isFinite(value.F.F))
          )
        )
      }"
    `)

    // Cleanup
    configure({ schema: { treatArraysAsObjects: false } })
  })

  vi.it('〖⛳️〗› ❲jit❳: exactOptional', () => {

    let schema = t.object({
      a: t.number,
      b: t.optional(t.string),
      c: t.optional(t.number.min(8)),
    })

    configure({
      schema: {
        optionalTreatment: 'exactOptional',
      }
    }) && vi.expect(Jit.generate(schema)).toMatchInlineSnapshot
        (`
      "function check(value) {
        return (
          !!value && typeof value === "object" && !Array.isArray(value)
          && Number.isFinite(value.a)
          && (!Object.hasOwn(value, "c") || (Number.isFinite(value.c) && 8 <= value.c))
          && (!Object.hasOwn(value, "b") || typeof value.b === "string")
        )
      }"
    `)

    configure({
      schema: {
        optionalTreatment: 'presentButUndefinedIsOK',
      }
    }) && vi.expect(Jit.generate(schema)).toMatchInlineSnapshot
        (`
      "function check(value) {
        return (
          !!value && typeof value === "object" && !Array.isArray(value)
          && Number.isFinite(value.a)
          && (value.c === undefined || (Number.isFinite(value.c) && 8 <= value.c))
          && (value.b === undefined || typeof value.b === "string")
        )
      }"
    `)
  })
})

