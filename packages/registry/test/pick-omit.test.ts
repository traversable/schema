import * as vi from 'vitest'

import { has, omit_ as omit, omitWhere, pick_ as pick, pickWhere } from '@traversable/registry'
import {
  omitKeyOf,
  omitKeysOf,
  omitIndexOf,
  omitIndicesOf,
  pickIndexOf,
  pickIndicesOf,
  pickKeyOf,
  pickKeysOf,
} from './fast-check.js'

import { it, test } from '@fast-check/vitest'

export let logFailure = (e: unknown, testName: string = '', ...args: readonly unknown[]) => {
  let message = has('message', (u) => typeof u === 'string')(e) ? e.message : JSON.stringify(e, null, 2)
  console.group('\n\n' + (testName === void 0 ? 'FAILURE:' : testName) + '\n\n')
  console.debug('\n' + 'Message: ' + message + '\n\n')
  for (let arg of args) console.debug('\n' + JSON.stringify(arg, null, 2) + '\n')
  console.groupEnd()
  vi.assert.fail(message)
}

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/registry❳: pick (runtime tests)', () => {
  it('〖⛳️〗› ❲pickWhere❳', () => {
    let ex_01 = { a: 1, b: 2, c: () => false } as const
    vi.assert.hasAllKeys(pickWhere(ex_01, (x) => typeof x === 'function'), ['c'])
    vi.assert.doesNotHaveAnyKeys(pickWhere(ex_01, (x) => typeof x === 'function'), ['a', 'b'])
    vi.assert.hasAllKeys(pickWhere(ex_01, (x) => typeof x === 'number'), ['a', 'b'])
    vi.assert.doesNotHaveAnyKeys(pickWhere(ex_01, (x) => typeof x === 'number'), ['c'])
  })

  it('〖⛳️〗› ❲pick❳: preserves original reference when all keys are picked', () => {
    let ex_01 = {}
    vi.assert.equal(pick(ex_01), ex_01)
    let ex_02 = { a: 1 }
    vi.assert.equal(pick(ex_02, 'a'), ex_02)
    vi.assert.notEqual(pick(ex_02, 'a'), { ...ex_02 })
  })

  test.prop([pickKeyOf(3)], {
    // endOnFailure: true,
    // numRuns: 10_000,
  })('〖⛳️〗› ❲pick❳: picks single property', ([k, xs]) => {
    // sanity check
    vi.assert.hasAnyKeys(xs, [k])
    // assertions
    vi.assert.deepEqual({ ...pick(xs, k), ...omit(xs, k) }, xs)
  })

  test.prop([pickKeysOf(3)], {
    // endOnFailure: true,
    // numRuns: 10_000,
  })('〖⛳️〗› ❲pick❳: picks multiple properties', ([ks, xs]) => {
    // sanity check
    vi.assert.hasAnyKeys(xs, ks)
    // assertions
    vi.assert.deepEqual({ ...pick(xs, ...ks), ...omit(xs, ...ks) }, xs)
  })

  test.prop([pickIndexOf(3)], {
    // endOnFailure: true,
    // numRuns: 10_000,
  })('〖⛳️〗› ❲pick❳: picks single index', ([ix, xs]) => {
    let expected: { [x: number]: unknown } = Object.assign({}, xs)
    // sanity check
    vi.assert.hasAnyKeys(xs, [ix])
    // assertions
    vi.assert.deepEqual({ ...pick(xs, ix), ...omit(xs, ix) }, expected)
  })

  test.prop([pickIndicesOf(3)], {
    // endOnFailure: true,
    // numRuns: 10_000,
  })('〖⛳️〗› ❲pick❳: picks multiple indices', ([ixs, xs]) => {
    let expected: { [x: number]: unknown } = Object.assign({}, xs)
    // sanity check
    vi.assert.hasAnyKeys(xs, ixs)
    // assertions
    vi.assert.deepEqual({ ...pick(xs, ...ixs), ...omit(xs, ...ixs) }, expected)
  })

})

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/registry❳: omit (runtime tests)', () => {
  it('〖⛳️〗› ❲omitWhere❳', () => {
    let ex_01 = { a: 1, b: 2, c: () => false } as const
    vi.assert.hasAllKeys(omitWhere(ex_01, (x) => typeof x === 'function'), ['a', 'b'])
    vi.assert.doesNotHaveAnyKeys(omitWhere(ex_01, (x) => typeof x === 'function'), ['c'])
    vi.assert.hasAllKeys(omitWhere(ex_01, (x) => typeof x === 'number'), ['c'])
    vi.assert.doesNotHaveAnyKeys(omitWhere(ex_01, (x) => typeof x === 'number'), ['a', 'b'])
  })

  it('〖⛳️〗› ❲omit❳: preserves original reference when zero keys are picked', () => {
    let ex_01 = {}
    vi.assert.equal(omit(ex_01), ex_01)
    let ex_02 = { a: 1 }
    vi.assert.equal(omit(ex_02), ex_02)
    vi.assert.notEqual(pick(ex_02), { ...ex_02 })
  })

  test.prop([omitKeyOf(3)], {
    // endOnFailure: true,
    // numRuns: 10_000,
  })('〖⛳️〗› ❲omit❳: omits single property', ([k, xs, ys]) => {
    // sanity check
    vi.assert.hasAnyKeys(ys, [k])
    vi.assert.doesNotHaveAnyKeys(xs, [k])
    // assertions
    vi.assert.deepEqual(omit(ys, k), xs)
    vi.assert.deepEqual({ ...omit(ys, k), ...pick(ys, k) }, ys)
  })

  test.prop([omitKeysOf(3)], {
    // endOnFailure: true,
    // numRuns: 10_000,
  })('〖⛳️〗› ❲omit❳: omits multiple properties', ([ks, xs, ys]) => {
    // sanity check
    vi.assert.hasAnyKeys(ys, ks)
    vi.assert.doesNotHaveAnyKeys(xs, ks)
    // assertions
    vi.assert.deepEqual(omit(ys, ...ks), xs)
    vi.assert.deepEqual({ ...omit(ys, ...ks), ...pick(ys, ...ks) }, ys)
  })

  test.prop([omitIndexOf(3)], {
    // endOnFailure: true,
    // numRuns: 10_000,
  })('〖⛳️〗› ❲pick❳: omits single index', ([ix, xs, ys]) => {
    let expected_01: { [x: number]: unknown } = Object.assign({}, xs)
    let expected_02: { [x: number]: unknown } = Object.assign({}, ys)
    // sanity check
    vi.assert.hasAnyKeys(ys, [ix])
    vi.assert.doesNotHaveAnyKeys(xs, [ix])
    // assertions
    vi.assert.deepEqual(omit(ys, ix), expected_01)
    vi.assert.deepEqual({ ...omit(ys, ix), ...pick(ys, ix) }, expected_02)
  })

  test.prop([omitIndicesOf(3)], {
    // endOnFailure: true,
    // numRuns: 10_000,
  })('〖⛳️〗› ❲pick❳: omits multiple indices', ([ixs, xs, ys]) => {
    let expected_01: { [x: number]: unknown } = Object.assign({}, xs)
    let expected_02: { [x: number]: unknown } = Object.assign({}, ys)
    // sanity check
    vi.assert.hasAnyKeys(ys, ixs)
    vi.assert.doesNotHaveAnyKeys(xs, ixs)
    // assertions
    vi.assert.deepEqual(omit(ys, ...ixs), expected_01)
    vi.assert.deepEqual({ ...omit(ys, ...ixs), ...pick(ys, ...ixs) }, expected_02)
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/registry❳: omit (typelevel)', () => {
  vi.it('〖⛳️〗‹‹‹ ❲@traverable/registry❳: omit, nonfinite input (typelevel)', () => {
    let array: (number | string)[] = []
    let record: Record<string, number | string> = {}

    let arrayExpected = omit(array)
    //  ^?
    let recordExpected = omit(record)
    //  ^?

    vi.expectTypeOf(omit(array)).toEqualTypeOf(array)
    vi.expectTypeOf(omit(record)).toEqualTypeOf(record)
    vi.expectTypeOf(omit(arrayExpected)).toEqualTypeOf(arrayExpected)

    // vi.expectTypeOf(1 as const).toEqualTypeOf(2 as const)

    vi.assertType<readonly [typeof arrayExpected, typeof array]>([omit(array), arrayExpected] as const)
    vi.assertType<readonly [typeof array, typeof arrayExpected]>([omit(array), arrayExpected] as const)
    vi.assertType<readonly [typeof record, typeof recordExpected]>([omit(record), recordExpected] as const)
    vi.assertType<readonly [typeof recordExpected, typeof record]>([omit(record), recordExpected] as const)

    let ex_01 = omit([] as (number | string)[], 1)

    // vi.assertType


    vi.assertType<{ [x: number]: string | number }>(omit([] as (number | string)[], 1, 2))
    vi.assertType<{ [x: number]: string | number }>(omit([] as (number | string)[], 1, 2, 3))
    vi.assertType<{ [x: number]: string | number }>(omit([] as (number | string)[], '1'))
    vi.assertType<{ [x: number]: string | number }>(omit([] as (number | string)[], '1', '2'))
    vi.assertType<{ [x: number]: string | number }>(omit([] as (number | string)[], '1', '2', '3'))

    vi.assertType<typeof record>(omit(record))
    vi.assertType<typeof arrayWithFiniteIndex>(omit(arrayWithFiniteIndex))
    vi.assertType<typeof recordWithFiniteIndex>(omit(recordWithFiniteIndex))

    vi.assertType<typeof arrayExpected>(array)
    vi.assertType<typeof recordExpected>(record)
    // vi.assertType([omit(array), arrayExpected] as const)
    // vi.assertType([omit(record), recordExpected] as const)
    // vi.assertType([omit(record), recordExpected] as const)
  })
  vi.it('〖⛳️〗‹‹‹ ❲@traverable/registry❳: omit, mixed input (typelevel)', () => {
  })

  vi.it('〖⛳️〗‹‹‹ ❲@traverable/registry❳: omit, finite input (typelevel)', () => {

  })


  let arrayWithFiniteIndex
    : (true | 1)[] & ['A', 'B', 'C', 'D']
    = Object.assign(['A', 'B', 'C', 'D'])
  let recordWithFiniteIndex
    : Record<string, number | false> & { a: 9, b: 90, c: 900, d: 9000 }
    = { a: 9, b: 90, c: 900, d: 9000, e: false }

  let arrayWithFiniteIndexExpected = omit(arrayWithFiniteIndex)
  //  ^?
  let recordWithFiniteIndexExpected = omit(recordWithFiniteIndex)
  //  ^?

  vi.assertType<readonly [typeof arrayWithFiniteIndex, typeof arrayWithFiniteIndexExpected]>([omit(arrayWithFiniteIndex), arrayWithFiniteIndexExpected] as const)
  vi.assertType<readonly [typeof arrayWithFiniteIndexExpected, typeof arrayWithFiniteIndex]>([omit(arrayWithFiniteIndex), arrayWithFiniteIndexExpected] as const)

  vi.assertType<readonly [typeof recordWithFiniteIndex, typeof recordWithFiniteIndexExpected]>([omit(recordWithFiniteIndex), recordWithFiniteIndexExpected] as const)
  vi.assertType<readonly [typeof recordWithFiniteIndexExpected, typeof recordWithFiniteIndex]>([omit(recordWithFiniteIndex), recordWithFiniteIndexExpected] as const)

  vi.assertType<typeof arrayWithFiniteIndex>(arrayWithFiniteIndex)
  vi.assertType<typeof recordWithFiniteIndex>(recordWithFiniteIndex)

  //   vi.assertType()
})

///// TYPE TESTS /////


// vi.describe('type tests', () => {
//   vi.assertType()
// })
// declare const xs: (number | string)[]
// declare const arrayWithFiniteIndex: (true | 1)[] & ['A', 'B', 'C', 'D']
// declare const recordWithFiniteIndex: Record<string, 1 | false> & { a: 9, b: 90, c: 900, d: 9000 }
// let a = omit([0, 10, 200, 3000], '0', '1', '2')
// //  ^?
// let b = omit(xs, 1)
// //  ^?
// let c = omit({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7 }, 'a', 'b', 'c', 'd', 'e', 'f')
// //  ^?
// let d = omit(arrayWithFiniteIndex, '0', '2', 9)
// //  ^?
// let e = omit([1, 2, 3], 0)
// //  ^?



// // test.prop([fc.omitIndexOf(3)], {})('〖⛳️〗› ❲omit❳: property test (arrays)', ([ix, xs, ys]) => {
// //   vi.assert.hasAnyKeys(ys, [ix])
// //   vi.assert.doesNotHaveAnyKeys(xs, [ix])
// // })

// })
