import * as vi from 'vitest'
import { it, test } from '@fast-check/vitest'

import * as fc from './fast-check.js'

import {
  has,
  mut,
  merge,
  omit_ as omit,
  omitWhere,
  pick_ as pick,
  pickWhere,
} from '@traversable/registry'

export let logFailure = (e: unknown, testName: string = '', ...args: any[]) => {
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

  test.prop([fc.pickKeyOf(3)], {
    // endOnFailure: true,
    // numRuns: 10_000,
  })('〖⛳️〗› ❲pick❳: picks single property', ([k, xs]) => {
    // sanity check
    vi.assert.hasAnyKeys(xs, [k])
    // assertions
    vi.assert.deepEqual({ ...pick(xs, k), ...omit(xs, k) }, xs)
  })

  test.prop([fc.pickKeysOf(3)], {
    // endOnFailure: true,
    // numRuns: 10_000,
  })('〖⛳️〗› ❲pick❳: picks multiple properties', ([ks, xs]) => {
    // sanity check
    vi.assert.hasAnyKeys(xs, ks)
    // assertions
    vi.assert.deepEqual({ ...pick(xs, ...ks), ...omit(xs, ...ks) }, xs)
  })

  test.prop([fc.pickIndexOf(3)], {
    // endOnFailure: true,
    // numRuns: 10_000,
  })('〖⛳️〗› ❲pick❳: picks single index', ([ix, xs]) => {
    let expected: { [x: number]: unknown } = Object.assign({}, xs)
    // sanity check
    vi.assert.hasAnyKeys(xs, [ix])
    // assertions
    vi.assert.deepEqual({ ...pick(xs, ix), ...omit(xs, ix) }, expected)
  })

  test.prop([fc.pickIndicesOf(3)], {
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

  test.prop([fc.omitKeyOf(3)], {
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

  test.prop([fc.omitKeysOf(3)], {
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

  test.prop([fc.omitIndexOf(3)], {
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

  test.prop([fc.omitIndicesOf(3)], {
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
    vi.expectTypeOf(omit({ a: 1, b: 2, ...Math.random() > 0.5 && { c: 3 } }, 'a', 'b', 'c')).toEqualTypeOf({})
    vi.expectTypeOf(omit({ a: 1, b: 2, ...Math.random() > 0.5 && { c: 3 } }, 'a', 'b')).toEqualTypeOf(mut({ ...Math.random() > 0.5 && { c: 3 } }))
    vi.expectTypeOf(omit({ a: 1, b: 2, ...Math.random() > 0.5 && { c: 3 } }, 'a')).toEqualTypeOf(mut({ b: 2, ...Math.random() > 0.5 && { c: 3 } }))
    vi.expectTypeOf(omit({ a: 1, b: 2, ...Math.random() > 0.5 && { c: 3 } })).toEqualTypeOf(mut({ a: 1, b: 2, ...Math.random() > 0.5 && { c: 3 } }))

    ///////////////////////////
    ///    both nonfinite   ///
    vi.expectTypeOf(omit(Array(Number() || String()))).toEqualTypeOf(Array(Number() || String()))
    vi.expectTypeOf(omit(Array(Number() || String()), 1)).toEqualTypeOf({ [Number()]: Number() || String() })
    vi.expectTypeOf(omit(Array(Number() || String()), 1, 2)).toEqualTypeOf({ [Number()]: Number() || String() })
    vi.expectTypeOf(omit(Array(Number() || String()), 1, 2, 3)).toEqualTypeOf({ [Number()]: Number() || String() })
    vi.expectTypeOf(omit(Array(Number() || String()), 1)).toEqualTypeOf({ [Number()]: Number() || String() })
    vi.expectTypeOf(omit(Array(Number() || String()), '1')).toEqualTypeOf({ [Number()]: Number() || String() })
    vi.expectTypeOf(omit(Array(Number() || String()), '1', '2')).toEqualTypeOf({ [Number()]: Number() || String() })
    vi.expectTypeOf(omit(Array(Number() || String()), '1', '2', '3')).toEqualTypeOf({ [Number()]: Number() || String() })
    //
    vi.expectTypeOf(omit({ [Number()]: Number() || String() })).toEqualTypeOf({ [Number()]: Number() || String() })
    vi.expectTypeOf(omit({ [Number()]: Number() || String() }, 1)).toEqualTypeOf({ [Number()]: Number() || String() })
    vi.expectTypeOf(omit({ [Number()]: Number() || String() }, 1, 2)).toEqualTypeOf({ [Number()]: Number() || String() })
    vi.expectTypeOf(omit({ [Number()]: Number() || String() }, 1, 2, 3)).toEqualTypeOf({ [Number()]: Number() || String() })
    vi.expectTypeOf(omit({ [Number()]: Number() || String() })).toEqualTypeOf({ [Number()]: Number() || String() })
    vi.expectTypeOf(omit({ [Number()]: Number() || String() }, '1')).toEqualTypeOf({ [Number()]: Number() || String() })
    vi.expectTypeOf(omit({ [Number()]: Number() || String() }, '1', '2')).toEqualTypeOf({ [Number()]: Number() || String() })
    vi.expectTypeOf(omit({ [Number()]: Number() || String() }, '1', '2', '3')).toEqualTypeOf({ [Number()]: Number() || String() })
    ///    both nonfinite   ///
    ///////////////////////////

    /////////////////////////////////////////
    ///    left finite, right nonfinite   ///
    vi.expectTypeOf(omit(merge({ a: 1, b: 2, c: 3 }, { [String()]: Boolean() }))).toEqualTypeOf(merge({ a: 1, b: 2, c: 3 }, { [String('')]: Boolean() }))
    vi.expectTypeOf(omit(merge({ a: 1, b: 2, c: 3 }, { [String()]: Boolean() }), 'a')).toEqualTypeOf(merge({ b: 2, c: 3 }, { [String('')]: Boolean() }))
    vi.expectTypeOf(omit(merge({ a: 1, b: 2, c: 3 }, { [String()]: Boolean() }), 'a', 'b')).toEqualTypeOf(merge({ c: 3 }, { [String('')]: Boolean() }))
    vi.expectTypeOf(omit(merge({ a: 1, b: 2, c: 3 }, { [String()]: Boolean() }), 'a', 'b', 'c')).toEqualTypeOf({ [String('')]: Boolean() })
    vi.expectTypeOf(omit(merge({ a: 1, b: 2, c: 3 }, { [String()]: Boolean() }), 'a', 'b', 'c', 'd')).toEqualTypeOf({ [String('')]: Boolean() })
    //
    vi.expectTypeOf(omit(merge([10, 20, 30], { [String()]: Boolean() }))).toEqualTypeOf(merge({ 0: 10, 1: 20, 2: 30 }, { [String('')]: Boolean() }))
    vi.expectTypeOf(omit(merge([10, 20, 30], { [String()]: Boolean() }), '0')).toEqualTypeOf(merge({ 1: 20, 2: 30 }, { [String('')]: Boolean() }))
    vi.expectTypeOf(omit(merge([10, 20, 30], { [String()]: Boolean() }), '0', '1')).toEqualTypeOf(merge({ 2: 30 }, { [String('')]: Boolean() }))
    vi.expectTypeOf(omit(merge([10, 20, 30], { [String()]: Boolean() }), '0', '1', '2')).toEqualTypeOf({ [String('')]: Boolean() })
    vi.expectTypeOf(omit(merge([10, 20, 30], { [String()]: Boolean() }), '0', '1', '2', '3')).toEqualTypeOf({ [String('')]: Boolean() })
    ///    left finite, right nonfinite   ///
    /////////////////////////////////////////

    /////////////////////////////////////////
    ///    left nonfinite, right finite   ///
    vi.expectTypeOf(omit(merge({ [String()]: Boolean() }, { a: 1, b: 2, c: 3 }))).toEqualTypeOf(merge({ [String('')]: Boolean() }, { a: 1, b: 2, c: 3 }))
    vi.expectTypeOf(omit(merge({ [String()]: Boolean() }, { a: 1, b: 2, c: 3 }), 'a')).toEqualTypeOf(merge({ [String('')]: Boolean() }, { b: 2, c: 3 }))
    vi.expectTypeOf(omit(merge({ [String()]: Boolean() }, { a: 1, b: 2, c: 3 }), 'a', 'b')).toEqualTypeOf(merge({ [String('')]: Boolean() }, { c: 3 }))
    vi.expectTypeOf(omit(merge({ [String()]: Boolean() }, { a: 1, b: 2, c: 3 }), 'a', 'b', 'c')).toEqualTypeOf({ [String('')]: Boolean() })
    vi.expectTypeOf(omit(merge({ [String()]: Boolean() }, { a: 1, b: 2, c: 3 }), 'a', 'b', 'c', 'd')).toEqualTypeOf({ [String('')]: Boolean() })
    ///    left nonfinite, right finite   ///
    /////////////////////////////////////////

    /**
     * Expected errors
     */

    /* @ts-expect-error */
    omit({ a: 1, b: 2, ...Math.random() > 0.5 && { c: 3 } }, 'd')

    /**
     * Pathological cases we don't plan to support
     */

    /* @ts-expect-error */
    omit({ [Number()]: Number() || String() }, '1', 2)

    /* @ts-expect-error */
    omit({ [Number()]: Number() || String() }, 1, '2')
  })
})
