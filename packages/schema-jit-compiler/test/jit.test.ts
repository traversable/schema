import * as vi from 'vitest'

import { t, configure } from '@traversable/schema-core'
import { compile, jit, jitJson } from '@traversable/schema-jit-compiler'

import { Seed } from '@traversable/schema-seed'
import { fc, test } from '@fast-check/vitest'
import * as Arbitrary from './TODO.js'


vi.describe.skip('〖⛳️〗‹‹‹ ❲@traversable/schema-jit-compiler❳: property tests', () => {

  vi.describe.skip('〖⛳️〗‹‹ ❲compile❳: object', () => {
    let schema = t.object({
      a: t.record(t.object({
        b: t.string,
        c: t.tuple()
      }))
    })

    let arbitrary = Arbitrary.fromSchema(schema)
    // let check = compile(schema)

    test.prop([arbitrary], {})('〖⛳️〗› ❲compile❳: object', (data) => {
      // vi.assert.isTrue(check(data))
    })

  })

  vi.it('〖⛳️〗› ❲jit❳', () => {

    let s = t.object({

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
            // h: t.optional(t.object({ i: t.optional(t.boolean), j: t.union(t.number.moreThan(0).max(128), t.bigint) })),
          })
        ),

        // twoB: t.eq({
        //   "#3B": [
        //     1,
        //     [2],
        //     [[3]],
        //   ],
        //   "#3A": {
        //     n: 'over 9000',
        //     o: [
        //       { p: false },
        //     ],
        //   }
        // }),

        // twoA: t.integer.between(-10, 10),

      }),

      // "#1A": t.union(t.integer.min(3)),

      // "#1B": t.tuple(
      //   t.record(t.any),
      // ),

    })

    let j = jit(s)

    try {
      let c = compile(s)
      let a = Arbitrary.fromSchema(s)
      let m = fc.sample(a, 1)[0]

      console.log(JSON.stringify(m, null, 2))
      console.log('test', c(m))

    } catch (e) {
      vi.assert.fail(''
        + '\r\n\n'
        + (
          t.has('message', t.string)(e)
            ? e.message
            : JSON.stringify(e, null, 2)
        )
        + '\r\n\n'
        + '\t'
        + 'Function body:'
        + '\r\n\n'
        + j
        + '\r\n'
      )
    }
  })
})


vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-jit-compiler❳: compile(...)', () => {



  // vi.it('〖⛳️〗› ❲compile❳: object', () => {


  //   // vi.assert.isTrue(
  //   //   check({ a: {} })
  //   // )


  // })

  let schema = t.object({
    a: t.record(t.object({
      b: t.string,
      c: t.tuple()
    }))
  })

  // let jitted = jit(schema)

  // let check = compile(schema)

  // vi.it('TMP', () => {
  //   vi.expect(jitted).toMatchInlineSnapshot(`
  //     "function check(value) {
  //       return (
  //         !!value && typeof value === 'object' && !Array.isArray(value)
  //         && !!value.a && typeof value.a === 'object' && !Array.isArray(value.a) 
  //           && !(value.a instanceof Date) && !(value.a instanceof Uint8Array) 
  //           && Object.entries(value.a).every(
  //           ([key, value]) => typeof key === 'string' ? !!value && typeof value === 'object' && !Array.isArray(value)
  //             && typeof value.b === 'string'
  //             && Array.isArray(value.c) && value.c.length === 0 : true
  //             )
  //       )
  //     }"
  //   `)
  // })

  // vi.test.concurrent.for([
  //   // FAILURE
  //   {},
  //   { a: [] },
  //   { a: { record: { b: '' } } },
  //   { a: { record: { b: '', c: [1] } } },
  // ])('Validation fails with bad input (index %#)', (input) => vi.assert.isFalse(check(input)))

  // vi.test.concurrent.for([
  //   // SUCCESS
  //   { a: {} },
  //   { a: { record: { b: '', c: [] } } },
  // ])('Validation succeeds with valid input (index %#)', (input) => vi.assert.isTrue(check(input)))

})


vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-jit-compiler❳: jitJson', () => {

  vi.it('〖⛳️〗› ❲jitJson❳: bad input', () => {
    /* @ts-expect-error */
    vi.assert.throws(() => jitJson(Symbol()))

    /* @ts-expect-error */
    vi.assert.throws(() => jitJson(1n))
  })

  vi.it('〖⛳️〗› ❲jitJson❳: null', () => {
    vi.expect(jitJson(
      null
    )).toMatchInlineSnapshot

      (`"value === null"`)
  })

  vi.it('〖⛳️〗› ❲jitJson❳: undefined', () => {
    vi.expect(jitJson(
      undefined
    )).toMatchInlineSnapshot
      (`"value === undefined"`)
  })

  vi.it('〖⛳️〗› ❲jitJson❳: booleans', () => {
    vi.expect(jitJson(
      false
    )).toMatchInlineSnapshot
      (`"value === false"`)

    vi.expect(jitJson(
      true
    )).toMatchInlineSnapshot
      (`"value === true"`)
  })

  vi.it('〖⛳️〗› ❲jitJson❳: numbers', () => {
    vi.expect(jitJson(
      Number.MIN_SAFE_INTEGER
    )).toMatchInlineSnapshot
      (`"value === -9007199254740991"`)

    vi.expect(jitJson(
      Number.MAX_SAFE_INTEGER
    )).toMatchInlineSnapshot
      (`"value === 9007199254740991"`)

    vi.expect(jitJson(
      +0
    )).toMatchInlineSnapshot
      (`"value === +0"`)

    vi.expect(jitJson(
      -0
    )).toMatchInlineSnapshot
      (`"value === -0"`)

    vi.expect(jitJson(
      1 / 3
    )).toMatchInlineSnapshot
      (`"value === 0.3333333333333333"`)

    vi.expect(jitJson(
      -1 / 3
    )).toMatchInlineSnapshot
      (`"value === -0.3333333333333333"`)

    vi.expect(jitJson(
      1e+21
    )).toMatchInlineSnapshot
      (`"value === 1e+21"`)

    vi.expect(jitJson(
      -1e+21
    )).toMatchInlineSnapshot
      (`"value === -1e+21"`)

    vi.expect(jitJson(
      1e-21
    )).toMatchInlineSnapshot
      (`"value === 1e-21"`)

    vi.expect(jitJson(
      -1e-21
    )).toMatchInlineSnapshot
      (`"value === -1e-21"`)
  })

  vi.it('〖⛳️〗› ❲jitJson❳: strings', () => {
    vi.expect(jitJson(
      ''
    )).toMatchInlineSnapshot
      (`"value === ''"`)

    vi.expect(jitJson(
      '\\'
    )).toMatchInlineSnapshot
      (`"value === '\\\\'"`)
  })

  vi.it('〖⛳️〗› ❲jitJson❳: objects', () => {
    vi.expect(jitJson(
      {}
    )).toMatchInlineSnapshot
      (`"!!value && typeof value === 'object' && !Array.isArray(value)"`)

    vi.expect(jitJson(
      {
        m: { o: 'O' },
        l: ['L']
      }
    )).toMatchInlineSnapshot
      (`
      "!!value && typeof value === 'object' && !Array.isArray(value)
        && Array.isArray(value.l) && value.l.length === 1
          && value.l[0] === 'L'
        && !!value.m && typeof value.m === 'object' && !Array.isArray(value.m)
          && value.m.o === 'O'"
    `)

  })

  vi.it('〖⛳️〗› ❲jitJson❳: arrays', () => {
    vi.expect(jitJson(
      []
    )).toMatchInlineSnapshot
      (`"Array.isArray(value) && value.length === 0"`)

    vi.expect(jitJson(
      [1, 2, 3]
    )).toMatchInlineSnapshot
      (`
      "Array.isArray(value) && value.length === 3
        && value[0] === 1
        && value[1] === 2
        && value[2] === 3"
    `)

    vi.expect(jitJson(
      [[11], [22], [33]]
    )).toMatchInlineSnapshot
      (`
      "Array.isArray(value) && value.length === 3
        && Array.isArray(value[0]) && value[0].length === 1
          && value[0][0] === 11
        && Array.isArray(value[1]) && value[1].length === 1
          && value[1][0] === 22
        && Array.isArray(value[2]) && value[2].length === 1
          && value[2][0] === 33"
    `)

    vi.expect(jitJson(
      [
        {
          a: 3,
          b: 3,
          c: [5, 6]
        },
        { z: 2 },
        1,
      ]
    )).toMatchInlineSnapshot
      (`
      "Array.isArray(value) && value.length === 3
        && value[0] === 1
        && !!value[1] && typeof value[1] === 'object' && !Array.isArray(value[1])
          && value[1].z === 2
        && !!value[2] && typeof value[2] === 'object' && !Array.isArray(value[2])
          && value[2].a === 3
          && value[2].b === 3
          && Array.isArray(value[2].c) && value[2].c.length === 2
            && value[2].c[0] === 5
            && value[2].c[1] === 6"
    `)

    vi.expect(jitJson(
      [
        { THREE: [{ A: null, B: false }] },
        { FOUR: [{ A: 1, B: false }], C: '' },
        { TWO: [{ A: null, B: undefined }] },
        { ONE: [true] }
      ]
    )).toMatchInlineSnapshot
      (`
      "Array.isArray(value) && value.length === 4
        && !!value[0] && typeof value[0] === 'object' && !Array.isArray(value[0])
          && Array.isArray(value[0].ONE) && value[0].ONE.length === 1
            && value[0].ONE[0] === true
        && !!value[1] && typeof value[1] === 'object' && !Array.isArray(value[1])
          && Array.isArray(value[1].TWO) && value[1].TWO.length === 1
            && !!value[1].TWO[0] && typeof value[1].TWO[0] === 'object' && !Array.isArray(value[1].TWO[0])
              && value[1].TWO[0].B === undefined
              && value[1].TWO[0].A === null
        && !!value[2] && typeof value[2] === 'object' && !Array.isArray(value[2])
          && Array.isArray(value[2].THREE) && value[2].THREE.length === 1
            && !!value[2].THREE[0] && typeof value[2].THREE[0] === 'object' && !Array.isArray(value[2].THREE[0])
              && value[2].THREE[0].A === null
              && value[2].THREE[0].B === false
        && !!value[3] && typeof value[3] === 'object' && !Array.isArray(value[3])
          && value[3].C === ''
          && Array.isArray(value[3].FOUR) && value[3].FOUR.length === 1
            && !!value[3].FOUR[0] && typeof value[3].FOUR[0] === 'object' && !Array.isArray(value[3].FOUR[0])
              && value[3].FOUR[0].B === false
              && value[3].FOUR[0].A === 1"
    `)

    let modularArithmetic = (mod: number, operator: '+' | '*') => {
      let index = mod,
        row = Array.of<number>(),
        col = Array.of<number>(),
        matrix = Array.of<number[]>()
      while (index-- !== 0) void (
        row.push(index),
        col.push(index),
        matrix.push(Array.from({ length: mod }))
      )
      for (let i = 0; i < row.length; i++)
        for (let j = 0; j < col.length; j++)
          matrix[i][j] = (operator === '+' ? i + j : i * j) % mod
      //
      return matrix
    }

    let table = modularArithmetic(5, '*')

    vi.expect(table).toMatchInlineSnapshot
      (`
      [
        [
          0,
          0,
          0,
          0,
          0,
        ],
        [
          0,
          1,
          2,
          3,
          4,
        ],
        [
          0,
          2,
          4,
          1,
          3,
        ],
        [
          0,
          3,
          1,
          4,
          2,
        ],
        [
          0,
          4,
          3,
          2,
          1,
        ],
      ]
    `)

    vi.expect(jitJson(table)).toMatchInlineSnapshot
      (`
      "Array.isArray(value) && value.length === 5
        && Array.isArray(value[0]) && value[0].length === 5
          && value[0][0] === +0
          && value[0][1] === +0
          && value[0][2] === +0
          && value[0][3] === +0
          && value[0][4] === +0
        && Array.isArray(value[1]) && value[1].length === 5
          && value[1][0] === +0
          && value[1][1] === 1
          && value[1][2] === 2
          && value[1][3] === 3
          && value[1][4] === 4
        && Array.isArray(value[2]) && value[2].length === 5
          && value[2][0] === +0
          && value[2][1] === 2
          && value[2][2] === 4
          && value[2][3] === 1
          && value[2][4] === 3
        && Array.isArray(value[3]) && value[3].length === 5
          && value[3][0] === +0
          && value[3][1] === 3
          && value[3][2] === 1
          && value[3][3] === 4
          && value[3][4] === 2
        && Array.isArray(value[4]) && value[4].length === 5
          && value[4][0] === +0
          && value[4][1] === 4
          && value[4][2] === 3
          && value[4][3] === 2
          && value[4][4] === 1"
    `)

  })
})


vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-jit-compiler❳: nullary', () => {

  vi.it('〖⛳️〗› ❲jit❳: t.never', () => {
    vi.expect(jit(
      t.never
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          false
        )
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.any', () => {
    vi.expect(jit(
      t.any
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          true
        )
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.unknown', () => {
    vi.expect(jit(
      t.unknown
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          true
        )
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.void', () => {
    vi.expect(jit(
      t.void
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          value === void 0
        )
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.null', () => {
    vi.expect(jit(
      t.null
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          value === null
        )
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.undefined', () => {
    vi.expect(jit(
      t.undefined
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          value === undefined
        )
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.symbol', () => {
    vi.expect(jit(
      t.symbol
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          typeof value === 'symbol'
        )
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.boolean', () => {
    vi.expect(jit(
      t.boolean
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          typeof value === 'boolean'
        )
      }"
    `)
  })

})


vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-jit-compiler❳: boundable', () => {

  vi.it('〖⛳️〗› ❲jit❳: t.integer', () => {
    vi.expect(jit(
      t.integer
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          Number.isSafeInteger(value)
        )
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.integer.min(x)', () => {
    vi.expect(jit(
      t.integer.min(0)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          (Number.isSafeInteger(value) && 0 <= value)
        )
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.integer.max(x)', () => {
    vi.expect(jit(
      t.integer.max(1)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          (Number.isSafeInteger(value) && value <= 1)
        )
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.integer.min(x).max(y)', () => {
    vi.expect(jit(
      t.integer
        .min(0)
        .max(1)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          (Number.isSafeInteger(value) && 0 <= value && value <= 1)
        )
      }"
    `)

    vi.expect(jit(
      t.integer
        .max(1)
        .min(0)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          (Number.isSafeInteger(value) && 0 <= value && value <= 1)
        )
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.integer.between(x, y)', () => {
    vi.expect(jit(
      t.integer.between(0, 1)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          (Number.isSafeInteger(value) && 0 <= value && value <= 1)
        )
      }"
    `)

    vi.expect(jit(
      t.integer.between(1, 0)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          (Number.isSafeInteger(value) && 0 <= value && value <= 1)
        )
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.bigint', () => {
    vi.expect(jit(
      t.bigint
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          typeof value === 'bigint'
        )
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.bigint.min(x)', () => {
    vi.expect(jit(
      t.bigint.min(0n)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          (typeof value === 'bigint' && 0n <= value)
        )
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.bigint.max(x)', () => {
    vi.expect(jit(
      t.bigint.max(1n)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          (typeof value === 'bigint' && value <= 1n)
        )
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.bigint.min(x).max(y)', () => {
    vi.expect(jit(
      t.bigint
        .min(0n)
        .max(1n)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          (typeof value === 'bigint' && 0n <= value && value <= 1n)
        )
      }"
    `)

    vi.expect(jit(
      t.bigint
        .max(1n)
        .min(0n)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          (typeof value === 'bigint' && 0n <= value && value <= 1n)
        )
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.bigint.between(x, y)', () => {
    vi.expect(jit(
      t.bigint.between(0n, 1n)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          (typeof value === 'bigint' && 0n <= value && value <= 1n)
        )
      }"
    `)

    vi.expect(jit(
      t.bigint.between(1n, 0n)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          (typeof value === 'bigint' && 0n <= value && value <= 1n)
        )
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.number', () => {
    vi.expect(jit(
      t.number
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          Number.isFinite(value)
        )
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.number.min(x)', () => {
    vi.expect(jit(
      t.number.min(0)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          (Number.isFinite(value) && 0 <= value)
        )
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.number.max(x)', () => {
    vi.expect(jit(
      t.number.max(1)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          (Number.isFinite(value) && value <= 1)
        )
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.number.min(x).max(y)', () => {
    vi.expect(jit(
      t.number
        .min(0)
        .max(1)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          (Number.isFinite(value) && 0 <= value && value <= 1)
        )
      }"
    `)

    vi.expect(jit(
      t.number
        .max(1)
        .min(0)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          (Number.isFinite(value) && 0 <= value && value <= 1)
        )
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.number.between(x, y)', () => {
    vi.expect(jit(
      t.number.between(0, 1)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          (Number.isFinite(value) && 0 <= value && value <= 1)
        )
      }"
    `)

    vi.expect(jit(
      t.number.between(1, 0)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          (Number.isFinite(value) && 0 <= value && value <= 1)
        )
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.number.moreThan(x)', () => {
    vi.expect(jit(
      t.number.moreThan(0)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          (Number.isFinite(value) && 0 < value)
        )
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.number.lessThan(x)', () => {
    vi.expect(jit(
      t.number.lessThan(1)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          (Number.isFinite(value) && value < 1)
        )
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.number.moreThan(x).lessThan(y)', () => {
    vi.expect(jit(
      t.number
        .moreThan(0)
        .lessThan(1)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          (Number.isFinite(value) && 0 < value && value < 1)
        )
      }"
    `)

    vi.expect(jit(
      t.number
        .lessThan(1)
        .moreThan(0)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          (Number.isFinite(value) && 0 < value && value < 1)
        )
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.number.min(x).lessThan(y)', () => {
    vi.expect(jit(
      t.number
        .min(0)
        .lessThan(1)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          (Number.isFinite(value) && 0 <= value && value < 1)
        )
      }"
    `)

    vi.expect(jit(
      t.number
        .lessThan(1)
        .min(0)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          (Number.isFinite(value) && 0 <= value && value < 1)
        )
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.number.moreThan(x).max(y)', () => {
    vi.expect(jit(
      t.number
        .moreThan(0)
        .max(1)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          (Number.isFinite(value) && 0 < value && value <= 1)
        )
      }"
    `)

    vi.expect(jit(
      t.number
        .max(1)
        .moreThan(0)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          (Number.isFinite(value) && 0 < value && value <= 1)
        )
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.string', () => {
    vi.expect(jit(
      t.string
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          typeof value === 'string'
        )
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.string.min(x)', () => {
    vi.expect(jit(
      t.string.min(0)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          (typeof value === 'string' && 0 <= value.length)
        )
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.string.max(x)', () => {
    vi.expect(jit(
      t.string.max(1)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          (typeof value === 'string' && value.length <= 1)
        )
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.string.min(x).max(y)', () => {
    vi.expect(jit(
      t.string
        .min(0)
        .max(1)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          (typeof value === 'string' && 0 <= value.length && value.length <= 1)
        )
      }"
    `)

    vi.expect(jit(
      t.string
        .max(1)
        .min(0)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          (typeof value === 'string' && 0 <= value.length && value.length <= 1)
        )
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.string.between(x, y)', () => {
    vi.expect(jit(
      t.string.between(0, 1)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          (typeof value === 'string' && 0 <= value.length && value.length <= 1)
        )
      }"
    `)

    vi.expect(jit(
      t.string.between(1, 0)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          (typeof value === 'string' && 0 <= value.length && value.length <= 1)
        )
      }"
    `)
  })
})


vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-jit-compiler❳: unary', () => {

  vi.it('〖⛳️〗› ❲jit❳: t.eq(...)', () => {
    vi.expect(jit(
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

    vi.expect(jit(
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

    vi.expect(jit(
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
    vi.expect(jit(
      t.optional(t.eq(1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === undefined || value === 1
      }"
    `)

    vi.expect(jit(
      t.optional(t.optional(t.eq(1)))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === undefined || (value === undefined || value === 1)
      }"
    `)

    vi.expect(jit(
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
          || (value === 1000 || value === 2000 || value === 3000 || value === 4000 || value === 5000 || value === 6000)
        )
      }"
    `)

    vi.expect(jit(
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
            value === 1000
            || value === 2000
            || value === 3000
            || value === 4000
            || value === 5000
            || value === 6000
            || value === 9000
          )
        )
      }"
    `)
  })

  vi.it('〖⛳️〗› ❲jit❳: t.array(...)', () => {
    vi.expect(jit(
      t.array(t.eq(1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Array.isArray(value) && value.every((value) => value === 1)
      }"
    `)

    vi.expect(jit(
      t.array(t.array(t.eq(2)))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Array.isArray(value) && value.every((value) => Array.isArray(value) && value.every((value) => value === 2))
      }"
    `)

    vi.expect(jit(
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
    vi.expect(jit(
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

    vi.expect(jit(
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

  vi.it.only('〖⛳️〗› ❲jit❳: t.union(...)', () => {

    vi.expect(jit(
      t.union()
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return false
      }"
    `)

    vi.expect(jit(
      t.union(t.never)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (false)
      }"
    `)

    vi.expect(jit(
      t.union(t.unknown)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (true)
      }"
    `)

    vi.expect(jit(
      t.union(t.union())
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return ((false))
      }"
    `)

    vi.expect(jit(
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

    vi.expect(jit(
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

    vi.expect(jit(
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

    vi.expect(jit(
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
    vi.expect(jit(
      t.intersect(t.unknown)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return true
      }"
    `)

    vi.expect(jit(
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

    vi.expect(jit(
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
          && (!!value && typeof value === "object" && !Array.isArray(value) && value.a === 1
            && !!value && typeof value === "object" && !Array.isArray(value) && value.b === 2
            && !!value && typeof value === "object" && !Array.isArray(value) && value.c === 3)
        )
      }"
    `)

  })

  vi.it('〖⛳️〗› ❲jit❳: t.tuple(...)', () => {
    vi.expect(jit(
      t.tuple()
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Array.isArray(value) && value.length === 0
      }"
    `)

    vi.expect(jit(
      t.tuple(t.unknown)
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Array.isArray(value) && value.length === 1 && true
      }"
    `)

    vi.expect(jit(
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

    vi.expect(jit(
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

    vi.expect(jit(
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

    vi.expect(jit(
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

  vi.it.only('〖⛳️〗› ❲jit❳: object(...)', () => {

    vi.expect(jit(
      t.object({})
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return !!value && typeof value === "object" && !Array.isArray(value)
      }"
    `)

    vi.expect(jit(
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

    vi.expect(jit(
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

    vi.expect(jit(
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

    vi.expect(jit(
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

    vi.expect(jit(
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

    vi.expect(jit(
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

    vi.expect(jit(
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
    }) && vi.expect(jit(schema)).toMatchInlineSnapshot
        (`
      "function check(value) {
        return (
          !!value && typeof value === 'object' && !Array.isArray(value)
          && 
            !!value.F && typeof value.F === 'object' && !Array.isArray(value.F)
              && true
            || !!value.F && typeof value.F === 'object' && !Array.isArray(value.F)
              && Number.isFinite(value.F.F)
        )
      }"
    `)

    configure({
      schema: {
        treatArraysAsObjects: true,
      }
    }) && vi.expect(jit(schema)).toMatchInlineSnapshot
        (`
      "function check(value) {
        return (
          !!value && typeof value === 'object'
          && 
            !!value.F && typeof value.F === 'object'
              && true
            || !!value.F && typeof value.F === 'object'
              && Number.isFinite(value.F.F)
        )
      }"
    `)
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
        treatArraysAsObjects: false,
      }
    }) && vi.expect(jit(schema)).toMatchInlineSnapshot
        (`
      "function check(value) {
        return (
          !!value && typeof value === 'object' && !Array.isArray(value)
          && Number.isFinite(value.a)
          && (!Object.hasOwn(value, 'c') || (Number.isFinite(value.c) && 8 <= value.c))
          && (!Object.hasOwn(value, 'b') || typeof value.b === 'string')
        )
      }"
    `)

    configure({
      schema: {
        optionalTreatment: 'presentButUndefinedIsOK',
        treatArraysAsObjects: false,
      }
    }) && vi.expect(jit(schema)).toMatchInlineSnapshot
        (`
      "function check(value) {
        return (
          !!value && typeof value === 'object' && !Array.isArray(value)
          && Number.isFinite(value.a)
          && value.c === undefined || (Number.isFinite(value.c) && 8 <= value.c)
          && (value.b === undefined || typeof value.b === 'string')
        )
      }"
    `)
  })
})

