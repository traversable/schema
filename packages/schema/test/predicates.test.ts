import * as vi from 'vitest'
import { fc, test } from '@fast-check/vitest'

import { symbol } from '@traversable/registry'
import { Predicate, Predicate as q, t } from '@traversable/schema'
import * as Seed from './seed.js'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema❳', () => {
  const arbitrary = Seed.predicateWithData({
    eq: {},
    optionalTreatment: 'exactOptional',
    treatArraysAsObjects: false,
  }, {
    exclude: ['any', 'unknown', 'never', 'intersect']
  })

  test.prop([arbitrary])(
    '〖⛳️〗‹ ❲Predicate❳: combinators return `true` given valid data, `false` given invalid data',
    ({ badData, data, predicate }) => (
      vi.assert.isTrue(predicate(data)),
      vi.assert.isFalse(predicate(badData))
    )
  )

  vi.it('〖⛳️〗‹ ❲Predicate.hasOwn❳', () => {
    function func() { }
    func.ABC = 'ABC'
    func[0] = 0
    func[symbol.tag] = symbol.tag

    // SUCCESS
    vi.assert.isTrue(Predicate.hasOwn(func, 'ABC'))
    vi.assert.isTrue(Predicate.hasOwn(func, 0))
    vi.assert.isTrue(Predicate.hasOwn(func, symbol.tag))
    vi.assert.isTrue(Predicate.hasOwn([100, 200, 300], 1))
    vi.assert.isTrue(Predicate.hasOwn({ 'GHI': null, [-1]: void 0, [symbol.tag]: void 0 }, 'GHI'))
    vi.assert.isTrue(Predicate.hasOwn({ 'GHI': null, [-1]: void 0, [symbol.tag]: void 0 }, -1))
    vi.assert.isTrue(Predicate.hasOwn({ 'GHI': null, [-1]: void 0, [symbol.tag]: void 0 }, symbol.tag))
    // FAILURE
    vi.assert.isFalse(Predicate.hasOwn(func, 'DEF'))
    vi.assert.isFalse(Predicate.hasOwn(func, 1))
    vi.assert.isFalse(Predicate.hasOwn(func, symbol.bad_data))
    vi.assert.isFalse(Predicate.hasOwn([100, 200, 300], 4))
    vi.assert.isFalse(Predicate.hasOwn([100, 200, 300], 'concat'))
    vi.assert.isFalse(Predicate.hasOwn({ 'GHI': null, [-1]: void 0, [symbol.tag]: void 0 }, 'JKL'))
    vi.assert.isFalse(Predicate.hasOwn({ 'GHI': null, [-1]: void 0, [symbol.tag]: void 0 }, -2))
    vi.assert.isFalse(Predicate.hasOwn({ 'GHI': null, [-1]: void 0, [symbol.tag]: void 0 }, symbol.bad_data))
  })

  vi.it('〖⛳️〗‹ ❲Predicate.never❳', () => {
    vi.assert.isFalse(q.never(1))
  })

  vi.it('〖⛳️〗‹ ❲Predicate.object❳', () => {
    vi.assert.isTrue(q.object({}))
    vi.assert.isFalse(q.object([]))
  })

  vi.it('〖⛳️〗‹ ❲Predicate.literally❳', () => {
    const ex_01 = {}
    const ex_02: unknown[] = []
    // SUCCESS
    vi.assert.isTrue(q.literally(0)(0))
    vi.assert.isTrue(q.literally(0, 1)(0))
    vi.assert.isTrue(q.literally(ex_01, ex_02)(ex_02))
    // FAILURE
    vi.assert.isFalse(q.literally('')('a'))
    vi.assert.isFalse(q.literally(false, null)(void 0))
    vi.assert.isFalse(q.literally({})({}))
    vi.assert.isFalse(q.literally([])([]))
  })

  vi.it('〖⛳️〗‹ ❲Predicate.key❳', () => {
    vi.assert.isTrue(q.key(1))
    vi.assert.isTrue(q.key(''))
    vi.assert.isTrue(q.key(Symbol()))
    vi.assert.isFalse(q.key(null))
    vi.assert.isFalse(q.key([]))
  })

  vi.it('〖⛳️〗‹ ❲Predicate.nonnullable❳', () => {
    vi.assert.isTrue(q.nonnullable(1))
    vi.assert.isTrue(q.nonnullable(''))
    vi.assert.isFalse(q.nonnullable(null))
    vi.assert.isFalse(q.nonnullable(void 0))
  })

  vi.it('〖⛳️〗‹ ❲Predicate.showable❳', () => {
    vi.assert.isTrue(q.showable(1))
    vi.assert.isTrue(q.showable(''))
    vi.assert.isTrue(q.showable(false))
    vi.assert.isTrue(q.showable(null))
    vi.assert.isTrue(q.showable(void 0))
    vi.assert.isTrue(q.showable(true))
    vi.assert.isTrue(q.showable(0n))
    vi.assert.isFalse(q.showable([]))
    vi.assert.isFalse(q.showable(Symbol()))
    vi.assert.isFalse(q.showable({}))
  })

  vi.it('〖⛳️〗‹ ❲Predicate.scalar❳', () => {
    vi.assert.isTrue(q.scalar(1))
    vi.assert.isTrue(q.scalar(''))
    vi.assert.isTrue(q.scalar(false))
    vi.assert.isTrue(q.scalar(null))
    vi.assert.isFalse(q.showable([]))
    vi.assert.isFalse(q.showable(Symbol()))
    vi.assert.isFalse(q.showable({}))
  })

  vi.it('〖⛳️〗‹ ❲Predicate.primitive❳', () => {
    vi.assert.isTrue(q.primitive(1))
    vi.assert.isTrue(q.primitive(''))
    vi.assert.isTrue(q.primitive(false))
    vi.assert.isTrue(q.primitive(null))
    vi.assert.isTrue(q.primitive(Symbol()))
    vi.assert.isTrue(q.primitive(0n))
    vi.assert.isFalse(q.primitive([]))
    vi.assert.isFalse(q.primitive(() => { }))
    vi.assert.isFalse(q.primitive({}))
  })

  vi.it('〖⛳️〗‹ ❲Predicate.true❳', () => {
    vi.assert.isTrue(q.true(true))
    vi.assert.isFalse(q.true(false))
    vi.assert.isFalse(q.true({}))
  })

  vi.it('〖⛳️〗‹ ❲Predicate.false❳', () => {
    vi.assert.isTrue(q.false(false))
    vi.assert.isFalse(q.false(true))
    vi.assert.isFalse(q.false({}))
  })

  vi.it('〖⛳️〗‹ ❲Predicate.defined❳', () => {
    vi.assert.isTrue(q.defined(false))
    vi.assert.isFalse(q.defined(undefined))
  })

  vi.it('〖⛳️〗‹ ❲Predicate.notnull❳', () => {
    vi.assert.isTrue(q.notnull(undefined))
    vi.assert.isFalse(q.notnull(null))
  })

  vi.it('〖⛳️〗‹ ❲Predicate.nullable❳', () => {
    vi.assert.isTrue(q.nullable(undefined))
    vi.assert.isTrue(q.nullable(null))
    vi.assert.isFalse(q.nullable(0))
    vi.assert.isFalse(q.nullable(''))
  })

  vi.it('〖⛳️〗‹ ❲Predicate.nullable❳', () => {
    vi.assert.isTrue(q.nonempty.array([1]))
    vi.assert.isFalse(q.nonempty.array([]))
  })

  vi.it('〖⛳️〗‹ ❲Predicate.exactOptional❳', () => {
    vi.assert.isFalse(q.exactOptional({ a: Boolean }, { a: null }))
    vi.assert.isFalse(q.exactOptional({ a: Boolean }, {}))
    vi.assert.isFalse(q.exactOptional({ a: t.undefined }, {}))
  })

  vi.it('〖⛳️〗‹ ❲Predicate.presentButUndefinedIsOK❳', () => {
    vi.assert.isTrue(q.presentButUndefinedIsOK({ a: t.number, b: t.string }, { a: 1, b: '2' }))
    vi.assert.isFalse(q.presentButUndefinedIsOK({ a: Boolean }, { a: null }))
    vi.assert.isFalse(q.presentButUndefinedIsOK({ a: Boolean }, {}))
  })

  vi.it('〖⛳️〗‹ ❲Predicate.object$❳', () => {
    /* @ts-expect-error */
    vi.assert.throws(() => q.object$({}, { optionalTreatment: '' })({}))
  })

  vi.it('〖⛳️〗‹ ❲Predicate.isUndefinedSchema❳', () => {
    vi.assert.isTrue(q['~!isUndefinedSchema'](t.undefined))
    vi.assert.isFalse(q['~!isUndefinedSchema'](undefined))
    vi.assert.isFalse(q['~!isUndefinedSchema'](t.null))
  })

  vi.it('〖⛳️〗‹ ❲Predicate.isOptionalSchema❳', () => {
    vi.assert.isTrue(q['~!isOptionalSchema'](t.optional(t.number)))
    vi.assert.isTrue(q['~!isOptionalSchema'](t.optional(t.undefined)))
    vi.assert.isFalse(q['~!isOptionalSchema'](t.undefined))
    vi.assert.isFalse(q['~!isOptionalSchema'](undefined))
  })

  vi.it('〖⛳️〗‹ ❲Predicate.isOptionalNotUndefinedSchema❳', () => {
    vi.assert.isTrue(q['~!isOptionalNotUndefinedSchema'](t.optional(t.number)))
    vi.assert.isFalse(q['~!isOptionalNotUndefinedSchema'](t.optional(t.undefined)))
    vi.assert.isFalse(q['~!isOptionalNotUndefinedSchema'](t.undefined))
    vi.assert.isFalse(q['~!isOptionalNotUndefinedSchema'](undefined))
  })

  vi.it('〖⛳️〗‹ ❲Predicate.record$❳', () => {
    vi.assert.isTrue(q.record$(t.number)({}))
    vi.assert.isTrue(q.record$(t.number)({ a: 1 }))
    vi.assert.isTrue(q.record$(t.string, t.number)({}))
    vi.assert.isTrue(q.record$(t.string, t.number)({ a: 1 }))
    vi.assert.isFalse(q.record$(t.string, t.number)({ a: true }))
    vi.assert.isFalse(q.record$(t.string, t.number)({ a: void 0 }))
  })

  vi.it('〖⛳️〗‹ ❲Predicate.record❳', () => {
    vi.assert.isTrue(q.record(t.number)({}))
    vi.assert.isTrue(q.record(t.number)({ a: 1 }))
    vi.assert.isTrue(q.record(t.string, t.number)({}))
    vi.assert.isTrue(q.record(t.string, t.number)({ a: 1 }))
    vi.assert.isFalse(q.record(t.string, t.number)({ a: true }))
    vi.assert.isFalse(q.record(t.string, t.number)({ a: void 0 }))
  })

  vi.it('〖⛳️〗‹ ❲Predicate.intersect$❳', () => {
    vi.assert.isTrue(q.intersect$(t.object({ a: t.string }), t.object({ b: t.boolean }))({ a: '', b: false }))
    vi.assert.isFalse(q.intersect$(t.object({ a: t.string }), t.object({ c: t.boolean }))({ a: '', b: false }))
  })

  vi.it('〖⛳️〗‹ ❲Predicate.union$❳', () => {
    vi.assert.isTrue(q.union$(t.object({ a: t.string }), t.object({ b: t.boolean }))({ a: '' }))
    vi.assert.isTrue(q.union$(t.object({ a: t.string }), t.object({ b: t.boolean }))({ b: false }))
    vi.assert.isFalse(q.union$(t.object({ a: t.string }), t.object({ b: t.boolean }))({}))
  })
})
