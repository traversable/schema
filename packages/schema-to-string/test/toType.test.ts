import * as vi from 'vitest'

import { t, configure } from '@traversable/schema'
import '@traversable/schema-to-string/install'

configure({
  schema: {
    optionalTreatment: 'treatUndefinedAndOptionalAsTheSame',
  }
})

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema❳: t.recurse.schemaToString', () => {
  vi.it('〖⛳️〗‹ ❲t.recurse.schemaToString(t.void)❳', () => vi.expect(t.recurse.schemaToString(t.void)).toMatchInlineSnapshot(`"t.void"`))
  vi.it('〖⛳️〗‹ ❲t.recurse.schemaToString(t.any)❳', () => vi.expect(t.recurse.schemaToString(t.any)).toMatchInlineSnapshot(`"t.any"`))
  vi.it('〖⛳️〗‹ ❲t.recurse.schemaToString(t.unknown)❳', () => vi.expect(t.recurse.schemaToString(t.unknown)).toMatchInlineSnapshot(`"t.unknown"`))
  vi.it('〖⛳️〗‹ ❲t.recurse.schemaToString(t.null)❳', () => vi.expect(t.recurse.schemaToString(t.null)).toMatchInlineSnapshot(`"t.null"`))
  vi.it('〖⛳️〗‹ ❲t.recurse.schemaToString(t.undefined)❳', () => vi.expect(t.recurse.schemaToString(t.undefined)).toMatchInlineSnapshot(`"t.undefined"`))
  vi.it('〖⛳️〗‹ ❲t.recurse.schemaToString(t.symbol)❳', () => vi.expect(t.recurse.schemaToString(t.symbol)).toMatchInlineSnapshot(`"t.symbol"`))
  vi.it('〖⛳️〗‹ ❲t.recurse.schemaToString(t.boolean)❳', () => vi.expect(t.recurse.schemaToString(t.boolean)).toMatchInlineSnapshot(`"t.boolean"`))
  vi.it('〖⛳️〗‹ ❲t.recurse.schemaToString(t.bigint)❳', () => vi.expect(t.recurse.schemaToString(t.bigint)).toMatchInlineSnapshot(`"t.bigint"`))
  vi.it('〖⛳️〗‹ ❲t.recurse.schemaToString(t.number)❳', () => vi.expect(t.recurse.schemaToString(t.number)).toMatchInlineSnapshot(`"t.number"`))
  vi.it('〖⛳️〗‹ ❲t.recurse.schemaToString(t.string)❳', () => vi.expect(t.recurse.schemaToString(t.string)).toMatchInlineSnapshot(`"t.string"`))

  vi.it('〖⛳️〗‹ ❲t.recurse.schemaToString(t.optional(...))❳', () => {
    vi.expect(t.recurse.schemaToString(t.optional(t.void))).toMatchInlineSnapshot(`"t.optional(t.void)"`)
    vi.expect(t.recurse.schemaToString(t.optional(t.never))).toMatchInlineSnapshot(`"t.optional(t.never)"`)
    vi.expect(t.recurse.schemaToString(t.optional(t.any))).toMatchInlineSnapshot(`"t.optional(t.any)"`)
    vi.expect(t.recurse.schemaToString(t.optional(t.unknown))).toMatchInlineSnapshot(`"t.optional(t.unknown)"`)
    vi.expect(t.recurse.schemaToString(t.optional(t.null))).toMatchInlineSnapshot(`"t.optional(t.null)"`)
    vi.expect(t.recurse.schemaToString(t.optional(t.undefined))).toMatchInlineSnapshot(`"t.optional(t.undefined)"`)
    vi.expect(t.recurse.schemaToString(t.optional(t.symbol))).toMatchInlineSnapshot(`"t.optional(t.symbol)"`)
    vi.expect(t.recurse.schemaToString(t.optional(t.boolean))).toMatchInlineSnapshot(`"t.optional(t.boolean)"`)
    vi.expect(t.recurse.schemaToString(t.optional(t.bigint))).toMatchInlineSnapshot(`"t.optional(t.bigint)"`)
    vi.expect(t.recurse.schemaToString(t.optional(t.number))).toMatchInlineSnapshot(`"t.optional(t.number)"`)
    vi.expect(t.recurse.schemaToString(t.optional(t.string))).toMatchInlineSnapshot(`"t.optional(t.string)"`)
  })

  vi.it('〖⛳️〗‹ ❲t.recurse.schemaToString(t.array(...))❳', () => {
    vi.expect(t.recurse.schemaToString(t.array(t.void))).toMatchInlineSnapshot(`"t.array(t.void)"`)
    vi.expect(t.recurse.schemaToString(t.array(t.never))).toMatchInlineSnapshot(`"t.array(t.never)"`)
    vi.expect(t.recurse.schemaToString(t.array(t.any))).toMatchInlineSnapshot(`"t.array(t.any)"`)
    vi.expect(t.recurse.schemaToString(t.array(t.unknown))).toMatchInlineSnapshot(`"t.array(t.unknown)"`)
    vi.expect(t.recurse.schemaToString(t.array(t.null))).toMatchInlineSnapshot(`"t.array(t.null)"`)
    vi.expect(t.recurse.schemaToString(t.array(t.undefined))).toMatchInlineSnapshot(`"t.array(t.undefined)"`)
    vi.expect(t.recurse.schemaToString(t.array(t.symbol))).toMatchInlineSnapshot(`"t.array(t.symbol)"`)
    vi.expect(t.recurse.schemaToString(t.array(t.boolean))).toMatchInlineSnapshot(`"t.array(t.boolean)"`)
    vi.expect(t.recurse.schemaToString(t.array(t.bigint))).toMatchInlineSnapshot(`"t.array(t.bigint)"`)
    vi.expect(t.recurse.schemaToString(t.array(t.number))).toMatchInlineSnapshot(`"t.array(t.number)"`)
    vi.expect(t.recurse.schemaToString(t.array(t.string))).toMatchInlineSnapshot(`"t.array(t.string)"`)
  })

  vi.it('〖⛳️〗‹ ❲t.recurse.schemaToString(t.record(...))❳', () => {
    vi.expect(t.recurse.schemaToString(t.record(t.void))).toMatchInlineSnapshot(`"t.record(t.void)"`)
    vi.expect(t.recurse.schemaToString(t.record(t.never))).toMatchInlineSnapshot(`"t.record(t.never)"`)
    vi.expect(t.recurse.schemaToString(t.record(t.any))).toMatchInlineSnapshot(`"t.record(t.any)"`)
    vi.expect(t.recurse.schemaToString(t.record(t.unknown))).toMatchInlineSnapshot(`"t.record(t.unknown)"`)
    vi.expect(t.recurse.schemaToString(t.record(t.null))).toMatchInlineSnapshot(`"t.record(t.null)"`)
    vi.expect(t.recurse.schemaToString(t.record(t.undefined))).toMatchInlineSnapshot(`"t.record(t.undefined)"`)
    vi.expect(t.recurse.schemaToString(t.record(t.symbol))).toMatchInlineSnapshot(`"t.record(t.symbol)"`)
    vi.expect(t.recurse.schemaToString(t.record(t.boolean))).toMatchInlineSnapshot(`"t.record(t.boolean)"`)
    vi.expect(t.recurse.schemaToString(t.record(t.bigint))).toMatchInlineSnapshot(`"t.record(t.bigint)"`)
    vi.expect(t.recurse.schemaToString(t.record(t.number))).toMatchInlineSnapshot(`"t.record(t.number)"`)
    vi.expect(t.recurse.schemaToString(t.record(t.string))).toMatchInlineSnapshot(`"t.record(t.string)"`)
  })

  vi.it('〖⛳️〗‹ ❲t.recurse.schemaToString(t.union(...))❳', () => {
    vi.expect(t.recurse.schemaToString(t.union(t.void))).toMatchInlineSnapshot(`"t.union(t.void)"`)
    vi.expect(t.recurse.schemaToString(t.union(t.never))).toMatchInlineSnapshot(`"t.union(t.never)"`)
    vi.expect(t.recurse.schemaToString(t.union(t.any))).toMatchInlineSnapshot(`"t.union(t.any)"`)
    vi.expect(t.recurse.schemaToString(t.union(t.unknown))).toMatchInlineSnapshot(`"t.union(t.unknown)"`)
    vi.expect(t.recurse.schemaToString(t.union(t.null))).toMatchInlineSnapshot(`"t.union(t.null)"`)
    vi.expect(t.recurse.schemaToString(t.union(t.undefined))).toMatchInlineSnapshot(`"t.union(t.undefined)"`)
    vi.expect(t.recurse.schemaToString(t.union(t.symbol))).toMatchInlineSnapshot(`"t.union(t.symbol)"`)
    vi.expect(t.recurse.schemaToString(t.union(t.boolean))).toMatchInlineSnapshot(`"t.union(t.boolean)"`)
    vi.expect(t.recurse.schemaToString(t.union(t.bigint))).toMatchInlineSnapshot(`"t.union(t.bigint)"`)
    vi.expect(t.recurse.schemaToString(t.union(t.number))).toMatchInlineSnapshot(`"t.union(t.number)"`)
    vi.expect(t.recurse.schemaToString(t.union(t.string))).toMatchInlineSnapshot(`"t.union(t.string)"`)
    //
    vi.expect(t.recurse.schemaToString(t.union(t.void, t.never))).toMatchInlineSnapshot(`"t.union(t.void, t.never)"`)
    vi.expect(t.recurse.schemaToString(t.union(t.never, t.never))).toMatchInlineSnapshot(`"t.union(t.never, t.never)"`)
    vi.expect(t.recurse.schemaToString(t.union(t.any, t.never))).toMatchInlineSnapshot(`"t.union(t.any, t.never)"`)
    vi.expect(t.recurse.schemaToString(t.union(t.unknown, t.never))).toMatchInlineSnapshot(`"t.union(t.unknown, t.never)"`)
    vi.expect(t.recurse.schemaToString(t.union(t.null, t.never))).toMatchInlineSnapshot(`"t.union(t.null, t.never)"`)
    vi.expect(t.recurse.schemaToString(t.union(t.undefined, t.never))).toMatchInlineSnapshot(`"t.union(t.undefined, t.never)"`)
    vi.expect(t.recurse.schemaToString(t.union(t.symbol, t.never))).toMatchInlineSnapshot(`"t.union(t.symbol, t.never)"`)
    vi.expect(t.recurse.schemaToString(t.union(t.boolean, t.never))).toMatchInlineSnapshot(`"t.union(t.boolean, t.never)"`)
    vi.expect(t.recurse.schemaToString(t.union(t.bigint, t.never))).toMatchInlineSnapshot(`"t.union(t.bigint, t.never)"`)
    vi.expect(t.recurse.schemaToString(t.union(t.number, t.never))).toMatchInlineSnapshot(`"t.union(t.number, t.never)"`)
    vi.expect(t.recurse.schemaToString(t.union(t.string, t.never))).toMatchInlineSnapshot(`"t.union(t.string, t.never)"`)
  })


  vi.it('〖⛳️〗‹ ❲t.recurse.schemaToString(t.intersect(...))❳', () => {
    vi.expect(t.recurse.schemaToString(t.intersect(t.void))).toMatchInlineSnapshot(`"t.intersect(t.void)"`)
    vi.expect(t.recurse.schemaToString(t.intersect(t.never))).toMatchInlineSnapshot(`"t.intersect(t.never)"`)
    vi.expect(t.recurse.schemaToString(t.intersect(t.any))).toMatchInlineSnapshot(`"t.intersect(t.any)"`)
    vi.expect(t.recurse.schemaToString(t.intersect(t.unknown))).toMatchInlineSnapshot(`"t.intersect(t.unknown)"`)
    vi.expect(t.recurse.schemaToString(t.intersect(t.null))).toMatchInlineSnapshot(`"t.intersect(t.null)"`)
    vi.expect(t.recurse.schemaToString(t.intersect(t.undefined))).toMatchInlineSnapshot(`"t.intersect(t.undefined)"`)
    vi.expect(t.recurse.schemaToString(t.intersect(t.symbol))).toMatchInlineSnapshot(`"t.intersect(t.symbol)"`)
    vi.expect(t.recurse.schemaToString(t.intersect(t.boolean))).toMatchInlineSnapshot(`"t.intersect(t.boolean)"`)
    vi.expect(t.recurse.schemaToString(t.intersect(t.bigint))).toMatchInlineSnapshot(`"t.intersect(t.bigint)"`)
    vi.expect(t.recurse.schemaToString(t.intersect(t.number))).toMatchInlineSnapshot(`"t.intersect(t.number)"`)
    vi.expect(t.recurse.schemaToString(t.intersect(t.string))).toMatchInlineSnapshot(`"t.intersect(t.string)"`)
    //
    vi.expect(t.recurse.schemaToString(t.intersect(t.void, t.never))).toMatchInlineSnapshot(`"t.intersect(t.void, t.never)"`)
    vi.expect(t.recurse.schemaToString(t.intersect(t.never, t.never))).toMatchInlineSnapshot(`"t.intersect(t.never, t.never)"`)
    vi.expect(t.recurse.schemaToString(t.intersect(t.any, t.never))).toMatchInlineSnapshot(`"t.intersect(t.any, t.never)"`)
    vi.expect(t.recurse.schemaToString(t.intersect(t.unknown, t.never))).toMatchInlineSnapshot(`"t.intersect(t.unknown, t.never)"`)
    vi.expect(t.recurse.schemaToString(t.intersect(t.null, t.never))).toMatchInlineSnapshot(`"t.intersect(t.null, t.never)"`)
    vi.expect(t.recurse.schemaToString(t.intersect(t.undefined, t.never))).toMatchInlineSnapshot(`"t.intersect(t.undefined, t.never)"`)
    vi.expect(t.recurse.schemaToString(t.intersect(t.symbol, t.never))).toMatchInlineSnapshot(`"t.intersect(t.symbol, t.never)"`)
    vi.expect(t.recurse.schemaToString(t.intersect(t.boolean, t.never))).toMatchInlineSnapshot(`"t.intersect(t.boolean, t.never)"`)
    vi.expect(t.recurse.schemaToString(t.intersect(t.bigint, t.never))).toMatchInlineSnapshot(`"t.intersect(t.bigint, t.never)"`)
    vi.expect(t.recurse.schemaToString(t.intersect(t.number, t.never))).toMatchInlineSnapshot(`"t.intersect(t.number, t.never)"`)
    vi.expect(t.recurse.schemaToString(t.intersect(t.string, t.never))).toMatchInlineSnapshot(`"t.intersect(t.string, t.never)"`)
  })

  vi.it('〖⛳️〗‹ ❲t.recurse.schemaToString(t.tuple(...))❳', () => {
    vi.expect(t.recurse.schemaToString(t.tuple(t.void))).toMatchInlineSnapshot(`"t.tuple(t.void)"`)
    vi.expect(t.recurse.schemaToString(t.tuple(t.never))).toMatchInlineSnapshot(`"t.tuple(t.never)"`)
    vi.expect(t.recurse.schemaToString(t.tuple(t.any))).toMatchInlineSnapshot(`"t.tuple(t.any)"`)
    vi.expect(t.recurse.schemaToString(t.tuple(t.unknown))).toMatchInlineSnapshot(`"t.tuple(t.unknown)"`)
    vi.expect(t.recurse.schemaToString(t.tuple(t.null))).toMatchInlineSnapshot(`"t.tuple(t.null)"`)
    vi.expect(t.recurse.schemaToString(t.tuple(t.undefined))).toMatchInlineSnapshot(`"t.tuple(t.undefined)"`)
    vi.expect(t.recurse.schemaToString(t.tuple(t.symbol))).toMatchInlineSnapshot(`"t.tuple(t.symbol)"`)
    vi.expect(t.recurse.schemaToString(t.tuple(t.boolean))).toMatchInlineSnapshot(`"t.tuple(t.boolean)"`)
    vi.expect(t.recurse.schemaToString(t.tuple(t.bigint))).toMatchInlineSnapshot(`"t.tuple(t.bigint)"`)
    vi.expect(t.recurse.schemaToString(t.tuple(t.number))).toMatchInlineSnapshot(`"t.tuple(t.number)"`)
    vi.expect(t.recurse.schemaToString(t.tuple(t.string))).toMatchInlineSnapshot(`"t.tuple(t.string)"`)
    //
    vi.expect(t.recurse.schemaToString(t.tuple(t.void, t.never))).toMatchInlineSnapshot(`"t.tuple(t.void, t.never)"`)
    vi.expect(t.recurse.schemaToString(t.tuple(t.never, t.never))).toMatchInlineSnapshot(`"t.tuple(t.never, t.never)"`)
    vi.expect(t.recurse.schemaToString(t.tuple(t.any, t.never))).toMatchInlineSnapshot(`"t.tuple(t.any, t.never)"`)
    vi.expect(t.recurse.schemaToString(t.tuple(t.unknown, t.never))).toMatchInlineSnapshot(`"t.tuple(t.unknown, t.never)"`)
    vi.expect(t.recurse.schemaToString(t.tuple(t.null, t.never))).toMatchInlineSnapshot(`"t.tuple(t.null, t.never)"`)
    vi.expect(t.recurse.schemaToString(t.tuple(t.undefined, t.never))).toMatchInlineSnapshot(`"t.tuple(t.undefined, t.never)"`)
    vi.expect(t.recurse.schemaToString(t.tuple(t.symbol, t.never))).toMatchInlineSnapshot(`"t.tuple(t.symbol, t.never)"`)
    vi.expect(t.recurse.schemaToString(t.tuple(t.boolean, t.never))).toMatchInlineSnapshot(`"t.tuple(t.boolean, t.never)"`)
    vi.expect(t.recurse.schemaToString(t.tuple(t.bigint, t.never))).toMatchInlineSnapshot(`"t.tuple(t.bigint, t.never)"`)
    vi.expect(t.recurse.schemaToString(t.tuple(t.number, t.never))).toMatchInlineSnapshot(`"t.tuple(t.number, t.never)"`)
    vi.expect(t.recurse.schemaToString(t.tuple(t.string, t.never))).toMatchInlineSnapshot(`"t.tuple(t.string, t.never)"`)
  })

  vi.it('〖⛳️〗‹ ❲t.recurse.schemaToString(t.object(...))❳', () => {
    vi.expect(t.recurse.schemaToString(t.object({ a: t.void }))).toMatchInlineSnapshot(`"t.object({ a: t.void })"`)
    vi.expect(t.recurse.schemaToString(t.object({ a: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.never })"`)
    vi.expect(t.recurse.schemaToString(t.object({ a: t.any }))).toMatchInlineSnapshot(`"t.object({ a: t.any })"`)
    vi.expect(t.recurse.schemaToString(t.object({ a: t.unknown }))).toMatchInlineSnapshot(`"t.object({ a: t.unknown })"`)
    vi.expect(t.recurse.schemaToString(t.object({ a: t.null }))).toMatchInlineSnapshot(`"t.object({ a: t.null })"`)
    vi.expect(t.recurse.schemaToString(t.object({ a: t.undefined }))).toMatchInlineSnapshot(`"t.object({ a: t.undefined })"`)
    vi.expect(t.recurse.schemaToString(t.object({ a: t.symbol }))).toMatchInlineSnapshot(`"t.object({ a: t.symbol })"`)
    vi.expect(t.recurse.schemaToString(t.object({ a: t.boolean }))).toMatchInlineSnapshot(`"t.object({ a: t.boolean })"`)
    vi.expect(t.recurse.schemaToString(t.object({ a: t.bigint }))).toMatchInlineSnapshot(`"t.object({ a: t.bigint })"`)
    vi.expect(t.recurse.schemaToString(t.object({ a: t.number }))).toMatchInlineSnapshot(`"t.object({ a: t.number })"`)
    vi.expect(t.recurse.schemaToString(t.object({ a: t.string }))).toMatchInlineSnapshot(`"t.object({ a: t.string })"`)
    //
    vi.expect(t.recurse.schemaToString(t.object({ a: t.void, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.void, b: t.never })"`)
    vi.expect(t.recurse.schemaToString(t.object({ a: t.never, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.never, b: t.never })"`)
    vi.expect(t.recurse.schemaToString(t.object({ a: t.any, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.any, b: t.never })"`)
    vi.expect(t.recurse.schemaToString(t.object({ a: t.unknown, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.unknown, b: t.never })"`)
    vi.expect(t.recurse.schemaToString(t.object({ a: t.null, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.null, b: t.never })"`)
    vi.expect(t.recurse.schemaToString(t.object({ a: t.undefined, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.undefined, b: t.never })"`)
    vi.expect(t.recurse.schemaToString(t.object({ a: t.symbol, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.symbol, b: t.never })"`)
    vi.expect(t.recurse.schemaToString(t.object({ a: t.boolean, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.boolean, b: t.never })"`)
    vi.expect(t.recurse.schemaToString(t.object({ a: t.bigint, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.bigint, b: t.never })"`)
    vi.expect(t.recurse.schemaToString(t.object({ a: t.number, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.number, b: t.never })"`)
    vi.expect(t.recurse.schemaToString(t.object({ a: t.string, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.string, b: t.never })"`)
  })

  vi.it('〖⛳️〗‹ ❲t.recurse.schemaToString(t.eq(...))❳', () => {
    vi.expect(t.recurse.schemaToString(t.eq(null))).toMatchInlineSnapshot(`"t.eq(null)"`)
    vi.expect(t.recurse.schemaToString(t.eq(0))).toMatchInlineSnapshot(`"t.eq(0)"`)
    vi.expect(t.recurse.schemaToString(t.eq(1e+29))).toMatchInlineSnapshot(`"t.eq(1e+29)"`)
    vi.expect(t.recurse.schemaToString(t.eq("1.0"))).toMatchInlineSnapshot(`"t.eq("1.0")"`)
    vi.expect(t.recurse.schemaToString(t.eq({ _: undefined }))).toMatchInlineSnapshot(`"t.eq({ _: undefined })"`)
    vi.expect(t.recurse.schemaToString(t.eq({ _: null }))).toMatchInlineSnapshot(`"t.eq({ _: null })"`)
    vi.expect(t.recurse.schemaToString(t.eq(null))).toMatchInlineSnapshot(`"t.eq(null)"`)
    vi.expect(t.recurse.schemaToString(t.eq(0))).toMatchInlineSnapshot(`"t.eq(0)"`)
    vi.expect(t.recurse.schemaToString(t.eq(1e+29))).toMatchInlineSnapshot(`"t.eq(1e+29)"`)
    vi.expect(t.recurse.schemaToString(t.eq("1.0"))).toMatchInlineSnapshot(`"t.eq("1.0")"`)
    vi.expect(t.recurse.schemaToString(t.eq([]))).toMatchInlineSnapshot(`"t.eq([])"`)
    vi.expect(t.recurse.schemaToString(t.eq([undefined]))).toMatchInlineSnapshot(`"t.eq([undefined])"`)
    vi.expect(t.recurse.schemaToString(t.eq([null]))).toMatchInlineSnapshot(`"t.eq([null])"`)
    vi.expect(t.recurse.schemaToString(t.eq([[[]]]))).toMatchInlineSnapshot(`"t.eq([[[]]])"`)
    vi
      .expect(t.recurse.schemaToString(t.eq({ '': undefined, _: undefined, '\\': undefined, ['__proto__']: undefined, ['schemaToString']: undefined })))
      .toMatchInlineSnapshot(`"t.eq({ "": undefined, _: undefined, "\\\\": undefined, __proto__: undefined, schemaToString: undefined })"`)
    vi
      .expect(t.recurse.schemaToString(t.eq({ '': undefined, _: undefined, '\\': undefined, '__proto__': undefined, 'schemaToString': undefined })))
      .toMatchInlineSnapshot(`"t.eq({ "": undefined, _: undefined, "\\\\": undefined, schemaToString: undefined })"`)
  })
})


vi.it('〖⛳️〗› ❲t.never.toType❳', () => vi.expect(t.never.toType()).toMatchInlineSnapshot(`"never"`))
vi.it('〖⛳️〗› ❲t.any.toType❳', () => vi.expect(t.any.toType()).toMatchInlineSnapshot(`"any"`))
vi.it('〖⛳️〗› ❲t.unknown.toType❳', () => vi.expect(t.unknown.toType()).toMatchInlineSnapshot(`"unknown"`))
vi.it('〖⛳️〗› ❲t.void.toType❳', () => vi.expect(t.void.toType()).toMatchInlineSnapshot(`"void"`))
vi.it('〖⛳️〗› ❲t.null.toType❳', () => vi.expect(t.null.toType()).toMatchInlineSnapshot(`"null"`))
vi.it('〖⛳️〗› ❲t.undefined.toType❳', () => vi.expect(t.undefined.toType()).toMatchInlineSnapshot(`"undefined"`))
vi.it('〖⛳️〗› ❲t.symbol.toType❳', () => vi.expect(t.symbol.toType()).toMatchInlineSnapshot(`"symbol"`))
vi.it('〖⛳️〗› ❲t.boolean.toType❳', () => vi.expect(t.boolean.toType()).toMatchInlineSnapshot(`"boolean"`))
vi.it('〖⛳️〗› ❲t.integer.toType❳', () => vi.expect(t.integer.toType()).toMatchInlineSnapshot(`"number"`))
vi.it('〖⛳️〗› ❲t.bigint.toType❳', () => vi.expect(t.bigint.toType()).toMatchInlineSnapshot(`"bigint"`))
vi.it('〖⛳️〗› ❲t.number.toType❳', () => vi.expect(t.number.toType()).toMatchInlineSnapshot(`"number"`))
vi.it('〖⛳️〗› ❲t.string.toType❳', () => vi.expect(t.string.toType()).toMatchInlineSnapshot(`"string"`))

vi.it('〖⛳️〗› ❲t.eq(...).toType❳', () => (
  vi.expect(t.eq(9000).toType()).toMatchInlineSnapshot(`"9000"`),
  vi.assertType<'9000'>(t.eq(9000).toType()),
  vi.expect(t.eq("Jesters do oft prove prophets").toType()).toMatchInlineSnapshot(`"'Jesters do oft prove prophets'"`),
  vi.assertType<"'Jesters do oft prove prophets'">(t.eq("Jesters do oft prove prophets").toType()),
  vi.expect(t.eq(["Jesters do oft prove prophets"]).toType()).toMatchInlineSnapshot(`"string"`),
  vi.assertType<string>(t.eq([]).toType()),
  vi.expect(t.eq(["Jesters do oft prove prophets"]).toType()).toMatchInlineSnapshot(`"string"`),
  vi.assertType<string>(t.eq({}).toType())
))

vi.it('〖⛳️〗› ❲t.optional(...).toType❳', () => (
  vi.expect(t.optional(t.string).toType()).toMatchInlineSnapshot(`"(string | undefined)"`),
  vi.expect(t.optional(t.optional(t.string)).toType()).toMatchInlineSnapshot(`"((string | undefined) | undefined)"`),
  vi.expect(t.optional(t.object({ a: t.optional(t.null) })).toType()).toMatchInlineSnapshot(`"({ 'a'?: (null | undefined) } | undefined)"`)
))

vi.it('〖⛳️〗› ❲t.array(...).toType❳', () => (
  vi.expect(t.array(t.null).toType()).toMatchInlineSnapshot(`"(null)[]"`),
  vi.assertType<'(null)[]'>(t.array(t.null).toType()),
  vi.expect(t.array(t.array(t.null)).toType()).toMatchInlineSnapshot(`"((null)[])[]"`),
  vi.assertType<'((null)[])[]'>(t.array(t.array(t.null)).toType()),
  vi.expect(t.array(t.array(t.array(t.number))).toType()).toMatchInlineSnapshot(`"(((number)[])[])[]"`),
  vi.assertType<'(((number)[])[])[]'>(t.array(t.array(t.array(t.number))).toType())
))

vi.it('〖⛳️〗› ❲t.record(...).toType❳', () => (
  vi.expect(t.record(t.null).toType()).toMatchInlineSnapshot(`"Record<string, null>"`),
  vi.assertType(t.record(t.null).toType()),
  vi.expect(t.record(t.record(t.null)).toType()).toMatchInlineSnapshot(`"Record<string, Record<string, null>>"`),
  vi.assertType<"Record<string, null>">(t.record(t.null).toType()),
  vi.expect(t.record(t.record(t.number)).toType()).toMatchInlineSnapshot(`"Record<string, Record<string, number>>"`),
  vi.assertType<"Record<string, Record<string, null>>">(t.record(t.record((t.null))).toType()),
  vi.expect(t.record(t.record(t.record(t.number))).toType()).toMatchInlineSnapshot(`"Record<string, Record<string, Record<string, number>>>"`),
  vi.assertType<"Record<string, Record<string, Record<string, null>>>">(t.record(t.record(t.record((t.null)))).toType())
))

vi.it('〖⛳️〗› ❲t.union(...).toType❳', () => (
  vi.expect(t.union().toType()).toMatchInlineSnapshot(`"never"`),
  vi.assertType<'never'>(t.union().toType()),
  vi.expect(t.union(t.number).toType()).toMatchInlineSnapshot(`"(number)"`),
  vi.assertType<'(number)'>(t.union(t.number).toType()),
  vi.expect(t.union(t.number, t.string).toType()).toMatchInlineSnapshot(`"(number | string)"`),
  vi.assertType<'(number | string)'>(t.union(t.number, t.string).toType()),
  vi.expect(t.union(t.union()).toType()).toMatchInlineSnapshot(`"(never)"`),
  vi.assertType<'(never)'>(t.union(t.union()).toType()),
  vi.expect(t.union(t.union(t.number, t.string), t.union()).toType()).toMatchInlineSnapshot(`"((number | string) | never)"`),
  vi.assertType<'((number | string) | never)'>(t.union(t.union(t.number, t.string), t.union()).toType()),
  vi.expect(t.union(t.union(t.eq(0), t.eq(1)), t.union(t.eq(2), t.eq(3))).toType()).toMatchInlineSnapshot(`"((0 | 1) | (2 | 3))"`),
  vi.assertType<'((0 | 1) | (2 | 3))'>(t.union(t.union(t.eq(0), t.eq(1)), t.union(t.eq(2), t.eq(3))).toType()),
  vi.expect(t.union(t.union(t.eq(0), t.eq(1)), t.union(t.eq(2), t.eq(3)), t.union(t.union(t.eq(4), t.eq(5), t.union(t.eq(6), t.eq(7))))).toType())
    .toMatchInlineSnapshot(`"((0 | 1) | (2 | 3) | ((4 | 5 | (6 | 7))))"`),
  vi.assertType<'((0 | 1) | (2 | 3) | ((4 | 5 | (6 | 7))))'>(
    t.union(t.union(t.eq(0), t.eq(1)), t.union(t.eq(2), t.eq(3)), t.union(t.union(t.eq(4), t.eq(5), t.union(t.eq(6), t.eq(7))))).toType()
  )
))

vi.it('〖⛳️〗› ❲t.intersect(...).toType❳', () => (
  vi.expect(t.intersect().toType()).toMatchInlineSnapshot(`"unknown"`),
  vi.assertType<'unknown'>(t.intersect().toType()),
  vi.expect(t.intersect(t.number).toType()).toMatchInlineSnapshot(`"(number)"`),
  vi.assertType<'(number)'>(t.intersect(t.number).toType()),
  vi.expect(t.intersect(t.number, t.string).toType()).toMatchInlineSnapshot(`"(number & string)"`),
  vi.assertType<'(number & string)'>(t.intersect(t.number, t.string).toType()),
  vi.expect(t.intersect(t.intersect()).toType()).toMatchInlineSnapshot(`"(unknown)"`),
  vi.assertType<'(unknown)'>(t.intersect(t.intersect()).toType()),
  vi.expect(t.intersect(t.intersect(t.number, t.string), t.intersect()).toType()).toMatchInlineSnapshot(`"((number & string) & unknown)"`),
  vi.assertType<'((number & string) & unknown)'>(t.intersect(t.intersect(t.number, t.string), t.intersect()).toType()),
  vi.expect(t.intersect(t.intersect(t.eq(0), t.eq(1)), t.intersect(t.eq(2), t.eq(3))).toType()).toMatchInlineSnapshot(`"((0 & 1) & (2 & 3))"`),
  vi.assertType<'((0 & 1) & (2 & 3))'>(t.intersect(t.intersect(t.eq(0), t.eq(1)), t.intersect(t.eq(2), t.eq(3))).toType()),
  vi.expect(t.intersect(t.intersect(t.eq(0), t.eq(1)), t.intersect(t.eq(2), t.eq(3)), t.intersect(t.intersect(t.eq(4), t.eq(5), t.intersect(t.eq(6), t.eq(7))))).toType())
    .toMatchInlineSnapshot(`"((0 & 1) & (2 & 3) & ((4 & 5 & (6 & 7))))"`),
  vi.assertType<'((0 & 1) & (2 & 3) & ((4 & 5 & (6 & 7))))'>(
    t.intersect(t.intersect(t.eq(0), t.eq(1)), t.intersect(t.eq(2), t.eq(3)), t.intersect(t.intersect(t.eq(4), t.eq(5), t.intersect(t.eq(6), t.eq(7))))).toType()
  )
))

vi.it('〖⛳️〗› ❲t.enum(...)❳', () => {
  const ex_01 = t.enum(
    void 0,
    null,
    false,
    Symbol(),
    0,
    0n,
    ''
  ).toType()
  const ex_02 = t.enum({
    undefined: void 0,
    null: null,
    symbol: Symbol.for(''),
    boolean: true,
    bigint: 1n,
    number: 1,
    string: '\\'
  }).toType()
  vi.expect(ex_01).toMatchInlineSnapshot(`"undefined | null | false | symbol | 0 | 0n | ''"`)
  vi.expect(ex_02).toMatchInlineSnapshot(`"undefined | null | symbol | true | 1n | 1 | '\\'"`)
  vi.assertType<`undefined | null | false | symbol | 0 | 0n | ''`>(ex_01)
  vi.assertType<`undefined | null | true | symbol | 1 | 1n | '\\'`>(ex_02)
})


vi.it('〖⛳️〗› ❲t.tuple(...).toType❳', () => {
  vi.expect(t.tuple().toType()).toMatchInlineSnapshot(`"[]"`)
  vi.assertType<'[]'>(t.tuple().toType())
  vi.expect(t.tuple(t.eq(1), t.eq(2), t.eq(3)).toType()).toMatchInlineSnapshot(`"[1, 2, 3]"`)
  // vi.assertType<'[1, 2, 3]'>(t.tuple(t.eq(1), t.eq(2), t.eq(3)).toType())
  vi.expect(t.tuple(t.boolean, t.integer, t.tuple(t.undefined, t.void)).toType()).toMatchInlineSnapshot(`"[boolean, number, [undefined, void]]"`)
  vi.assertType<'[boolean, number, [undefined, void]]'>(t.tuple(t.boolean, t.integer, t.tuple(t.undefined, t.void)).toType())
  vi.expect(t.tuple(t.tuple(t.tuple(), t.tuple()), t.tuple(t.tuple(), t.tuple())).toType()).toMatchInlineSnapshot(`"[[[], []], [[], []]]"`)
  vi.assertType<'[[[], []], [[], []]]'>(t.tuple(t.tuple(t.tuple(), t.tuple()), t.tuple(t.tuple(), t.tuple())).toType())

  vi.expect(t.tuple(t.tuple(), t.tuple(t.tuple(), t.optional(t.tuple())), t.optional(t.tuple(t.optional(t.tuple()), t.optional(t.tuple())))).toType())
    .toMatchInlineSnapshot(`"[[], [[], _?: ([] | undefined)], _?: ([_?: ([] | undefined), _?: ([] | undefined)] | undefined)]"`)

  vi.assertType<"[[], [[], _?: ([] | undefined)], _?: ([_?: ([] | undefined), _?: ([] | undefined)] | undefined)]">(
    t.tuple(t.tuple(), t.tuple(t.tuple(), t.optional(t.tuple())), t.optional(t.tuple(t.optional(t.tuple()), t.optional(t.tuple())))).toType()
  )

  vi.assertType<[ᵃ: [], ᵇ: [ᵃ: [], ᵇ?: []], ᶜ?: [ᵃ?: [], ᵇ?: []]]>(
    t.tuple(t.tuple(), t.tuple(t.tuple(), t.optional(t.tuple())), t.optional(t.tuple(t.optional(t.tuple()), t.optional(t.tuple()))))._type
  )
})

vi.it('〖⛳️〗› ❲t.object(...).toType❳', () => (
  vi.expect(t.object({}).toType()).toMatchInlineSnapshot(`"{}"`),
  vi.assertType<'{}'>(t.object({}).toType()),
  vi.expect(t.object({ a: t.eq('a'), b: t.eq('b'), c: t.eq('c'), d: t.eq('d'), e: t.eq('e') }).toType()).toMatchInlineSnapshot(`"{ 'a': 'a', 'b': 'b', 'c': 'c', 'd': 'd', 'e': 'e' }"`),

  vi.assertType<
    | `{ 'a': 'a', 'b': 'b', 'c': 'c', 'd': 'd', 'e': 'e' }`
    | `{ 'a': 'a', 'b': 'b', 'c': 'c', 'e': 'e', 'd': 'd' }`
    | `{ 'a': 'a', 'b': 'b', 'd': 'd', 'c': 'c', 'e': 'e' }`
    | `{ 'a': 'a', 'd': 'd', 'e': 'e', 'b': 'b', 'c': 'c' }`
    | `{ 'b': 'b', 'a': 'a', 'c': 'c', 'd': 'd', 'e': 'e' }`
    | `{ 'b': 'b', 'c': 'c', 'a': 'a', 'd': 'd', 'e': 'e' }`
    | `{ 'b': 'b', 'c': 'c', 'a': 'a', 'e': 'e', 'd': 'd' }`
    | `{ 'b': 'b', 'c': 'c', 'd': 'd', 'e': 'e', 'a': 'a' }`
    | `{ 'b': 'b', 'c': 'c', 'd': 'd', 'e': 'e', 'a': 'a' }`
    | `{ 'b': 'b', 'e': 'e', 'a': 'a', 'c': 'c', 'd': 'd' }`
    | `{ 'b': 'b', 'e': 'e', 'd': 'd', 'a': 'a', 'c': 'c' }`
    | `{ 'c': 'c', 'a': 'a', 'b': 'b', 'd': 'd', 'e': 'e' }`
    | `{ 'c': 'c', 'a': 'a', 'e': 'e', 'b': 'b', 'd': 'd' }`
    | `{ 'c': 'c', 'd': 'd', 'a': 'a', 'b': 'b', 'e': 'e' }`
    | `{ 'c': 'c', 'd': 'd', 'e': 'e', 'a': 'a', 'b': 'b' }`
    | `{ 'd': 'd', 'a': 'a', 'b': 'b', 'c': 'c', 'e': 'e' }`
    | `{ 'd': 'd', 'b': 'b', 'a': 'a', 'c': 'c', 'e': 'e' }`
    | `{ 'd': 'd', 'c': 'c', 'b': 'b', 'a': 'a', 'e': 'e' }`
    | `{ 'd': 'd', 'e': 'e', 'a': 'a', 'b': 'b', 'c': 'c' }`
    | `{ 'd': 'd', 'e': 'e', 'a': 'a', 'b': 'b', 'c': 'c' }`
    | `{ 'e': 'e', 'a': 'a', 'b': 'b', 'c': 'c', 'd': 'd' }`
    | `{ 'e': 'e', 'a': 'a', 'b': 'b', 'd': 'd', 'c': 'c' }`
    | `{ 'e': 'e', 'a': 'a', 'c': 'c', 'b': 'b', 'd': 'd' }`
    | `{ 'e': 'e', 'a': 'a', 'c': 'c', 'd': 'd', 'b': 'b' }`
    | `{ 'e': 'e', 'a': 'a', 'd': 'd', 'b': 'b', 'c': 'c' }`
    | `{ 'e': 'e', 'a': 'a', 'd': 'd', 'c': 'c', 'b': 'b' }`
    | `{ 'e': 'e', 'b': 'b', 'a': 'a', 'c': 'c', 'd': 'd' }`
    | `{ 'e': 'e', 'b': 'b', 'c': 'c', 'd': 'd', 'a': 'a' }`
    | `{ 'e': 'e', 'c': 'c', 'a': 'a', 'b': 'b', 'd': 'd' }`
    | `{ 'e': 'e', 'c': 'c', 'd': 'd', 'a': 'a', 'b': 'b' }`
    | `{ 'e': 'e', 'd': 'd', 'a': 'a', 'b': 'b', 'c': 'c' }`
    | `{ 'e': 'e', 'd': 'd', 'c': 'c', 'a': 'a', 'b': 'b' }`
  >(
    t.object({
      a: t.eq('a'),
      b: t.eq('b'),
      c: t.eq('c'),
      d: t.eq('d'),
      e: t.eq('e'),
    }).toType()
  ),

  /* 
  //     vi.assertType<
//     >(
//       t.object({
//         a: t.object({
//           b: t.object({
//             c: t.eq('a.b.c'),
//             d: t.eq('a.b.d')
//           }),
//           e: t.object({
//             f: t.eq('a.e.f'),
//             g: t.eq('a.e.g')
//           }),
//         }),
//         h: t.object({
//           i: t.object({
//             j: t.eq('h.i.j'),
//             k: t.eq('h.i.k'),
//           }),
//           l: t.object({
//             m: t.eq('h.l.m'),
//             n: t.eq('h.l.n'),
//           })
//         })
//       }).toType()
//     ),

  */

  vi.expect(
    t.object({
      a: t.object({
        b: t.object({
          c: t.eq('a.b.c'),
          d: t.eq('a.b.d')
        }),
        e: t.object({
          f: t.eq('a.e.f'),
          g: t.eq('a.e.g')
        }),
      }),
      h: t.object({
        i: t.object({
          j: t.eq('h.i.j'),
          k: t.eq('h.i.k'),
        }),
        l: t.object({
          m: t.eq('h.l.m'),
          n: t.eq('h.l.n'),
        })
      })
    }).toType()
  ).toMatchInlineSnapshot(`"{ 'a': { 'b': { 'c': 'a.b.c', 'd': 'a.b.d' }, 'e': { 'f': 'a.e.f', 'g': 'a.e.g' } }, 'h': { 'i': { 'j': 'h.i.j', 'k': 'h.i.k' }, 'l': { 'm': 'h.l.m', 'n': 'h.l.n' } } }"`),

  vi.assertType<
    `{ 'a': { 'b': { 'c': 'a.b.c', 'd': 'a.b.d' }, 'e': { 'f': 'a.e.f', 'g': 'a.e.g' } }, 'h': { 'i': { 'j': 'h.i.j', 'k': 'h.i.k' }, 'l': { 'm': 'h.l.m', 'n': 'h.l.n' } } }`
  >(
    t.object({
      a: t.object({
        b: t.object({
          c: t.eq('a.b.c'),
          d: t.eq('a.b.d')
        }),
        e: t.object({
          f: t.eq('a.e.f'),
          g: t.eq('a.e.g')
        }),
      }),
      h: t.object({
        i: t.object({
          j: t.eq('h.i.j'),
          k: t.eq('h.i.k'),
        }),
        l: t.object({
          m: t.eq('h.l.m'),
          n: t.eq('h.l.n'),
        })
      })
    }).toType()
  ),

  vi.expect(
    t.object({
      a: t.object({
        b: t.object({
          c: t.optional(t.eq('a.b.c')),
          d: t.eq('a.b.d')
        }),
        e: t.optional(t.object({
          f: t.eq('a.e.f'),
          g: t.optional(t.eq('a.e.g'))
        })),
      }),
      h: t.optional(t.object({
        i: t.optional(t.object({
          j: t.eq('h.i.j'),
          k: t.optional(t.eq('h.i.k')),
        })),
        l: t.object({
          m: t.optional(t.eq('h.l.m')),
          n: t.eq('h.l.n'),
        })
      }))
    }).toType()
  ).toMatchInlineSnapshot(`"{ 'a': { 'b': { 'c'?: ('a.b.c' | undefined), 'd': 'a.b.d' }, 'e'?: ({ 'f': 'a.e.f', 'g'?: ('a.e.g' | undefined) } | undefined) }, 'h'?: ({ 'i'?: ({ 'j': 'h.i.j', 'k'?: ('h.i.k' | undefined) } | undefined), 'l': { 'm'?: ('h.l.m' | undefined), 'n': 'h.l.n' } } | undefined) }"`),

  vi.assertType<
    "{ 'a': { 'b': { 'c'?: ('a.b.c' | undefined), 'd': 'a.b.d' }, 'e'?: ({ 'f': 'a.e.f', 'g'?: ('a.e.g' | undefined) } | undefined) }, 'h'?: ({ 'i'?: ({ 'j': 'h.i.j', 'k'?: ('h.i.k' | undefined) } | undefined), 'l': { 'm'?: ('h.l.m' | undefined), 'n': 'h.l.n' } } | undefined) }"
  >(
    t.object({
      a: t.object({
        b: t.object({
          c: t.optional(t.eq('a.b.c')),
          d: t.eq('a.b.d')
        }),
        e: t.optional(t.object({
          f: t.eq('a.e.f'),
          g: t.optional(t.eq('a.e.g'))
        })),
      }),
      h: t.optional(t.object({
        i: t.optional(t.object({
          j: t.eq('h.i.j'),
          k: t.optional(t.eq('h.i.k')),
        })),
        l: t.object({
          m: t.optional(t.eq('h.l.m')),
          n: t.eq('h.l.n'),
        })
      }))
    }).toType()
  )
))

vi.it('〖⛳️〗› ❲t.object.toType❳: stress tests', () => {
  vi.assertType<

    `{ 'one': { 'one': 1, 'two': { 'one': 1, 'two': 2, 'three': { 'one': 1, 'two': 2, 'three': 3, 'four': { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10, 'eleven': { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10, 'eleven': 11, 'twelve': { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10, 'eleven': 11, 'twelve': 12, 'thirteen': { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10, 'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10, 'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': {} }, 'one_hundred': 100, 'two_hundred': 200, 'three_hundred': 300, 'four_hundred': 400, 'five_hundred': 500, 'six_hundred': 600, 'seven_hundred': 700, 'eight_hundred': 800, 'nine_hundred': 900, 'one_thousand': 1000, 'eleven_hundred': 1100, 'twelve_hundred': 1200, 'thirteen_hundred': 1300, 'fourteen_hundred': 1400 }, 'one_hundred': 100, 'two_hundred': 200, 'three_hundred': 300, 'four_hundred': 400, 'five_hundred': 500, 'six_hundred': 600, 'seven_hundred': 700, 'eight_hundred': 800, 'nine_hundred': 900, 'one_thousand': 1000, 'eleven_hundred': 1100, 'twelve_hundred': 1200, 'thirteen_hundred': 1300 }, 'one_hundred': 100, 'two_hundred': 200, 'three_hundred': 300, 'four_hundred': 400, 'five_hundred': 500, 'six_hundred': 600, 'seven_hundred': 700, 'eight_hundred': 800, 'nine_hundred': 900, 'one_thousand': 1000, 'eleven_hundred': 1100, 'twelve_hundred': 1200 }, 'one_hundred': 100, 'two_hundred': 200, 'three_hundred': 300, 'four_hundred': 400, 'five_hundred': 500, 'six_hundred': 600, 'seven_hundred': 700, 'eight_hundred': 800, 'nine_hundred': 900, 'one_thousand': 1000, 'eleven_hundred': 1100 }, 'one_hundred': 100, 'two_hundred': 200, 'three_hundred': 300, 'four_hundred': 400, 'five_hundred': 500, 'six_hundred': 600, 'seven_hundred': 700, 'eight_hundred': 800, 'nine_hundred': 900, 'one_thousand': 1000 }, 'one_hundred': 100, 'two_hundred': 200, 'three_hundred': 300, 'four_hundred': 400, 'five_hundred': 500, 'six_hundred': 600, 'seven_hundred': 700, 'eight_hundred': 800, 'nine_hundred': 900 }, 'one_hundred': 100, 'two_hundred': 200, 'three_hundred': 300, 'four_hundred': 400, 'five_hundred': 500, 'six_hundred': 600, 'seven_hundred': 700, 'eight_hundred': 800 }, 'one_hundred': 100, 'two_hundred': 200, 'three_hundred': 300, 'four_hundred': 400, 'five_hundred': 500, 'six_hundred': 600, 'seven_hundred': 700 }, 'one_hundred': 100, 'two_hundred': 200, 'three_hundred': 300, 'four_hundred': 400, 'five_hundred': 500, 'six_hundred': 600 }, 'one_hundred': 100, 'two_hundred': 200, 'three_hundred': 300, 'four_hundred': 400, 'five_hundred': 500 }, 'one_hundred': 100, 'two_hundred': 200, 'three_hundred': 300, 'four_hundred': 400 }, 'one_hundred': 100, 'two_hundred': 200, 'three_hundred': 300 }, 'one_hundred': 100, 'two_hundred': 200 }, 'one_hundred': 100 }`>(

      t.object({
        one: t.object({
          one: t.eq(1),
          two: t.object({
            one: t.eq(1),
            two: t.eq(2),
            three: t.object({
              one: t.eq(1),
              two: t.eq(2),
              three: t.eq(3),
              four: t.object({
                one: t.eq(1),
                two: t.eq(2),
                three: t.eq(3),
                four: t.eq(4),
                five: t.object({
                  one: t.eq(1),
                  two: t.eq(2),
                  three: t.eq(3),
                  four: t.eq(4),
                  five: t.eq(5),
                  six: t.object({
                    one: t.eq(1),
                    two: t.eq(2),
                    three: t.eq(3),
                    four: t.eq(4),
                    five: t.eq(5),
                    six: t.eq(6),
                    seven: t.object({
                      one: t.eq(1),
                      two: t.eq(2),
                      three: t.eq(3),
                      four: t.eq(4),
                      five: t.eq(5),
                      six: t.eq(6),
                      seven: t.eq(7),
                      eight: t.object({
                        one: t.eq(1),
                        two: t.eq(2),
                        three: t.eq(3),
                        four: t.eq(4),
                        five: t.eq(5),
                        six: t.eq(6),
                        seven: t.eq(7),
                        eight: t.eq(8),
                        nine: t.object({
                          one: t.eq(1),
                          two: t.eq(2),
                          three: t.eq(3),
                          four: t.eq(4),
                          five: t.eq(5),
                          six: t.eq(6),
                          seven: t.eq(7),
                          eight: t.eq(8),
                          nine: t.eq(9),
                          ten: t.object({
                            one: t.eq(1),
                            two: t.eq(2),
                            three: t.eq(3),
                            four: t.eq(4),
                            five: t.eq(5),
                            six: t.eq(6),
                            seven: t.eq(7),
                            eight: t.eq(8),
                            nine: t.eq(9),
                            ten: t.eq(10),
                            eleven: t.object({
                              one: t.eq(1),
                              two: t.eq(2),
                              three: t.eq(3),
                              four: t.eq(4),
                              five: t.eq(5),
                              six: t.eq(6),
                              seven: t.eq(7),
                              eight: t.eq(8),
                              nine: t.eq(9),
                              ten: t.eq(10),
                              eleven: t.eq(11),
                              twelve: t.object({
                                one: t.eq(1),
                                two: t.eq(2),
                                three: t.eq(3),
                                four: t.eq(4),
                                five: t.eq(5),
                                six: t.eq(6),
                                seven: t.eq(7),
                                eight: t.eq(8),
                                nine: t.eq(9),
                                ten: t.eq(10),
                                eleven: t.eq(11),
                                twelve: t.eq(12),
                                thirteen: t.object({
                                  one: t.eq(1),
                                  two: t.eq(2),
                                  three: t.eq(3),
                                  four: t.eq(4),
                                  five: t.eq(5),
                                  six: t.eq(6),
                                  seven: t.eq(7),
                                  eight: t.eq(8),
                                  nine: t.eq(9),
                                  ten: t.eq(10),
                                  eleven: t.eq(11),
                                  twelve: t.eq(12),
                                  thirteen: t.eq(13),
                                  fourteen: t.object({
                                    one: t.eq(1),
                                    two: t.eq(2),
                                    three: t.eq(3),
                                    four: t.eq(4),
                                    five: t.eq(5),
                                    six: t.eq(6),
                                    seven: t.eq(7),
                                    eight: t.eq(8),
                                    nine: t.eq(9),
                                    ten: t.eq(10),
                                    eleven: t.eq(11),
                                    twelve: t.eq(12),
                                    thirteen: t.eq(13),
                                    fourteen: t.eq(14),
                                    fifteen: t.object({}),
                                  }),
                                  one_hundred: t.eq(100),
                                  two_hundred: t.eq(200),
                                  three_hundred: t.eq(300),
                                  four_hundred: t.eq(400),
                                  five_hundred: t.eq(500),
                                  six_hundred: t.eq(600),
                                  seven_hundred: t.eq(700),
                                  eight_hundred: t.eq(800),
                                  nine_hundred: t.eq(900),
                                  one_thousand: t.eq(1000),
                                  eleven_hundred: t.eq(1100),
                                  twelve_hundred: t.eq(1200),
                                  thirteen_hundred: t.eq(1300),
                                  fourteen_hundred: t.eq(1400),
                                }),
                                one_hundred: t.eq(100),
                                two_hundred: t.eq(200),
                                three_hundred: t.eq(300),
                                four_hundred: t.eq(400),
                                five_hundred: t.eq(500),
                                six_hundred: t.eq(600),
                                seven_hundred: t.eq(700),
                                eight_hundred: t.eq(800),
                                nine_hundred: t.eq(900),
                                one_thousand: t.eq(1000),
                                eleven_hundred: t.eq(1100),
                                twelve_hundred: t.eq(1200),
                                thirteen_hundred: t.eq(1300),
                              }),
                              one_hundred: t.eq(100),
                              two_hundred: t.eq(200),
                              three_hundred: t.eq(300),
                              four_hundred: t.eq(400),
                              five_hundred: t.eq(500),
                              six_hundred: t.eq(600),
                              seven_hundred: t.eq(700),
                              eight_hundred: t.eq(800),
                              nine_hundred: t.eq(900),
                              one_thousand: t.eq(1000),
                              eleven_hundred: t.eq(1100),
                              twelve_hundred: t.eq(1200),
                            }),
                            one_hundred: t.eq(100),
                            two_hundred: t.eq(200),
                            three_hundred: t.eq(300),
                            four_hundred: t.eq(400),
                            five_hundred: t.eq(500),
                            six_hundred: t.eq(600),
                            seven_hundred: t.eq(700),
                            eight_hundred: t.eq(800),
                            nine_hundred: t.eq(900),
                            one_thousand: t.eq(1000),
                            eleven_hundred: t.eq(1100),
                          }),
                          one_hundred: t.eq(100),
                          two_hundred: t.eq(200),
                          three_hundred: t.eq(300),
                          four_hundred: t.eq(400),
                          five_hundred: t.eq(500),
                          six_hundred: t.eq(600),
                          seven_hundred: t.eq(700),
                          eight_hundred: t.eq(800),
                          nine_hundred: t.eq(900),
                          one_thousand: t.eq(1000),
                        }),
                        one_hundred: t.eq(100),
                        two_hundred: t.eq(200),
                        three_hundred: t.eq(300),
                        four_hundred: t.eq(400),
                        five_hundred: t.eq(500),
                        six_hundred: t.eq(600),
                        seven_hundred: t.eq(700),
                        eight_hundred: t.eq(800),
                        nine_hundred: t.eq(900),
                      }),
                      one_hundred: t.eq(100),
                      two_hundred: t.eq(200),
                      three_hundred: t.eq(300),
                      four_hundred: t.eq(400),
                      five_hundred: t.eq(500),
                      six_hundred: t.eq(600),
                      seven_hundred: t.eq(700),
                      eight_hundred: t.eq(800),
                    }),
                    one_hundred: t.eq(100),
                    two_hundred: t.eq(200),
                    three_hundred: t.eq(300),
                    four_hundred: t.eq(400),
                    five_hundred: t.eq(500),
                    six_hundred: t.eq(600),
                    seven_hundred: t.eq(700),
                  }),
                  one_hundred: t.eq(100),
                  two_hundred: t.eq(200),
                  three_hundred: t.eq(300),
                  four_hundred: t.eq(400),
                  five_hundred: t.eq(500),
                  six_hundred: t.eq(600),
                }),
                one_hundred: t.eq(100),
                two_hundred: t.eq(200),
                three_hundred: t.eq(300),
                four_hundred: t.eq(400),
                five_hundred: t.eq(500),
              }),
              one_hundred: t.eq(100),
              two_hundred: t.eq(200),
              three_hundred: t.eq(300),
              four_hundred: t.eq(400),
            }),
            one_hundred: t.eq(100),
            two_hundred: t.eq(200),
            three_hundred: t.eq(300),
          }),
          one_hundred: t.eq(100),
          two_hundred: t.eq(200),
        }),
        one_hundred: t.eq(100),
      })

        .toType()
    )

  vi.expect(

    t.object({
      one: t.object({
        one: t.eq(1),
        two: t.object({
          one: t.eq(1),
          two: t.eq(2),
          three: t.object({
            one: t.eq(1),
            two: t.eq(2),
            three: t.eq(3),
            four: t.object({
              one: t.eq(1),
              two: t.eq(2),
              three: t.eq(3),
              four: t.eq(4),
              five: t.object({
                one: t.eq(1),
                two: t.eq(2),
                three: t.eq(3),
                four: t.eq(4),
                five: t.eq(5),
                six: t.object({
                  one: t.eq(1),
                  two: t.eq(2),
                  three: t.eq(3),
                  four: t.eq(4),
                  five: t.eq(5),
                  six: t.eq(6),
                  seven: t.object({
                    one: t.eq(1),
                    two: t.eq(2),
                    three: t.eq(3),
                    four: t.eq(4),
                    five: t.eq(5),
                    six: t.eq(6),
                    seven: t.eq(7),
                    eight: t.object({
                      one: t.eq(1),
                      two: t.eq(2),
                      three: t.eq(3),
                      four: t.eq(4),
                      five: t.eq(5),
                      six: t.eq(6),
                      seven: t.eq(7),
                      eight: t.eq(8),
                      nine: t.object({
                        one: t.eq(1),
                        two: t.eq(2),
                        three: t.eq(3),
                        four: t.eq(4),
                        five: t.eq(5),
                        six: t.eq(6),
                        seven: t.eq(7),
                        eight: t.eq(8),
                        nine: t.eq(9),
                        ten: t.object({
                          one: t.eq(1),
                          two: t.eq(2),
                          three: t.eq(3),
                          four: t.eq(4),
                          five: t.eq(5),
                          six: t.eq(6),
                          seven: t.eq(7),
                          eight: t.eq(8),
                          nine: t.eq(9),
                          ten: t.eq(10),
                          eleven: t.object({
                            one: t.eq(1),
                            two: t.eq(2),
                            three: t.eq(3),
                            four: t.eq(4),
                            five: t.eq(5),
                            six: t.eq(6),
                            seven: t.eq(7),
                            eight: t.eq(8),
                            nine: t.eq(9),
                            ten: t.eq(10),
                            eleven: t.eq(11),
                            twelve: t.object({
                              one: t.eq(1),
                              two: t.eq(2),
                              three: t.eq(3),
                              four: t.eq(4),
                              five: t.eq(5),
                              six: t.eq(6),
                              seven: t.eq(7),
                              eight: t.eq(8),
                              nine: t.eq(9),
                              ten: t.eq(10),
                              eleven: t.eq(11),
                              twelve: t.eq(12),
                              thirteen: t.object({
                                one: t.eq(1),
                                two: t.eq(2),
                                three: t.eq(3),
                                four: t.eq(4),
                                five: t.eq(5),
                                six: t.eq(6),
                                seven: t.eq(7),
                                eight: t.eq(8),
                                nine: t.eq(9),
                                ten: t.eq(10),
                                eleven: t.eq(11),
                                twelve: t.eq(12),
                                thirteen: t.eq(13),
                                fourteen: t.object({
                                  one: t.eq(1),
                                  two: t.eq(2),
                                  three: t.eq(3),
                                  four: t.eq(4),
                                  five: t.eq(5),
                                  six: t.eq(6),
                                  seven: t.eq(7),
                                  eight: t.eq(8),
                                  nine: t.eq(9),
                                  ten: t.eq(10),
                                  eleven: t.eq(11),
                                  twelve: t.eq(12),
                                  thirteen: t.eq(13),
                                  fourteen: t.eq(14),
                                  fifteen: t.object({}),
                                }),
                                one_hundred: t.eq(100),
                                two_hundred: t.eq(200),
                                three_hundred: t.eq(300),
                                four_hundred: t.eq(400),
                                five_hundred: t.eq(500),
                                six_hundred: t.eq(600),
                                seven_hundred: t.eq(700),
                                eight_hundred: t.eq(800),
                                nine_hundred: t.eq(900),
                                one_thousand: t.eq(1000),
                                eleven_hundred: t.eq(1100),
                                twelve_hundred: t.eq(1200),
                                thirteen_hundred: t.eq(1300),
                                fourteen_hundred: t.eq(1400),
                              }),
                              one_hundred: t.eq(100),
                              two_hundred: t.eq(200),
                              three_hundred: t.eq(300),
                              four_hundred: t.eq(400),
                              five_hundred: t.eq(500),
                              six_hundred: t.eq(600),
                              seven_hundred: t.eq(700),
                              eight_hundred: t.eq(800),
                              nine_hundred: t.eq(900),
                              one_thousand: t.eq(1000),
                              eleven_hundred: t.eq(1100),
                              twelve_hundred: t.eq(1200),
                              thirteen_hundred: t.eq(1300),
                            }),
                            one_hundred: t.eq(100),
                            two_hundred: t.eq(200),
                            three_hundred: t.eq(300),
                            four_hundred: t.eq(400),
                            five_hundred: t.eq(500),
                            six_hundred: t.eq(600),
                            seven_hundred: t.eq(700),
                            eight_hundred: t.eq(800),
                            nine_hundred: t.eq(900),
                            one_thousand: t.eq(1000),
                            eleven_hundred: t.eq(1100),
                            twelve_hundred: t.eq(1200),
                          }),
                          one_hundred: t.eq(100),
                          two_hundred: t.eq(200),
                          three_hundred: t.eq(300),
                          four_hundred: t.eq(400),
                          five_hundred: t.eq(500),
                          six_hundred: t.eq(600),
                          seven_hundred: t.eq(700),
                          eight_hundred: t.eq(800),
                          nine_hundred: t.eq(900),
                          one_thousand: t.eq(1000),
                          eleven_hundred: t.eq(1100),
                        }),
                        one_hundred: t.eq(100),
                        two_hundred: t.eq(200),
                        three_hundred: t.eq(300),
                        four_hundred: t.eq(400),
                        five_hundred: t.eq(500),
                        six_hundred: t.eq(600),
                        seven_hundred: t.eq(700),
                        eight_hundred: t.eq(800),
                        nine_hundred: t.eq(900),
                        one_thousand: t.eq(1000),
                      }),
                      one_hundred: t.eq(100),
                      two_hundred: t.eq(200),
                      three_hundred: t.eq(300),
                      four_hundred: t.eq(400),
                      five_hundred: t.eq(500),
                      six_hundred: t.eq(600),
                      seven_hundred: t.eq(700),
                      eight_hundred: t.eq(800),
                      nine_hundred: t.eq(900),
                    }),
                    one_hundred: t.eq(100),
                    two_hundred: t.eq(200),
                    three_hundred: t.eq(300),
                    four_hundred: t.eq(400),
                    five_hundred: t.eq(500),
                    six_hundred: t.eq(600),
                    seven_hundred: t.eq(700),
                    eight_hundred: t.eq(800),
                  }),
                  one_hundred: t.eq(100),
                  two_hundred: t.eq(200),
                  three_hundred: t.eq(300),
                  four_hundred: t.eq(400),
                  five_hundred: t.eq(500),
                  six_hundred: t.eq(600),
                  seven_hundred: t.eq(700),
                }),
                one_hundred: t.eq(100),
                two_hundred: t.eq(200),
                three_hundred: t.eq(300),
                four_hundred: t.eq(400),
                five_hundred: t.eq(500),
                six_hundred: t.eq(600),
              }),
              one_hundred: t.eq(100),
              two_hundred: t.eq(200),
              three_hundred: t.eq(300),
              four_hundred: t.eq(400),
              five_hundred: t.eq(500),
            }),
            one_hundred: t.eq(100),
            two_hundred: t.eq(200),
            three_hundred: t.eq(300),
            four_hundred: t.eq(400),
          }),
          one_hundred: t.eq(100),
          two_hundred: t.eq(200),
          three_hundred: t.eq(300),
        }),
        one_hundred: t.eq(100),
        two_hundred: t.eq(200),
      }),
      one_hundred: t.eq(100),
    })
      .toType()

  ).toMatchInlineSnapshot(`"{ 'one': { 'one': 1, 'two': { 'one': 1, 'two': 2, 'three': { 'one': 1, 'two': 2, 'three': 3, 'four': { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10, 'eleven': { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10, 'eleven': 11, 'twelve': { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10, 'eleven': 11, 'twelve': 12, 'thirteen': { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10, 'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10, 'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': {} }, 'one_hundred': 100, 'two_hundred': 200, 'three_hundred': 300, 'four_hundred': 400, 'five_hundred': 500, 'six_hundred': 600, 'seven_hundred': 700, 'eight_hundred': 800, 'nine_hundred': 900, 'one_thousand': 1000, 'eleven_hundred': 1100, 'twelve_hundred': 1200, 'thirteen_hundred': 1300, 'fourteen_hundred': 1400 }, 'one_hundred': 100, 'two_hundred': 200, 'three_hundred': 300, 'four_hundred': 400, 'five_hundred': 500, 'six_hundred': 600, 'seven_hundred': 700, 'eight_hundred': 800, 'nine_hundred': 900, 'one_thousand': 1000, 'eleven_hundred': 1100, 'twelve_hundred': 1200, 'thirteen_hundred': 1300 }, 'one_hundred': 100, 'two_hundred': 200, 'three_hundred': 300, 'four_hundred': 400, 'five_hundred': 500, 'six_hundred': 600, 'seven_hundred': 700, 'eight_hundred': 800, 'nine_hundred': 900, 'one_thousand': 1000, 'eleven_hundred': 1100, 'twelve_hundred': 1200 }, 'one_hundred': 100, 'two_hundred': 200, 'three_hundred': 300, 'four_hundred': 400, 'five_hundred': 500, 'six_hundred': 600, 'seven_hundred': 700, 'eight_hundred': 800, 'nine_hundred': 900, 'one_thousand': 1000, 'eleven_hundred': 1100 }, 'one_hundred': 100, 'two_hundred': 200, 'three_hundred': 300, 'four_hundred': 400, 'five_hundred': 500, 'six_hundred': 600, 'seven_hundred': 700, 'eight_hundred': 800, 'nine_hundred': 900, 'one_thousand': 1000 }, 'one_hundred': 100, 'two_hundred': 200, 'three_hundred': 300, 'four_hundred': 400, 'five_hundred': 500, 'six_hundred': 600, 'seven_hundred': 700, 'eight_hundred': 800, 'nine_hundred': 900 }, 'one_hundred': 100, 'two_hundred': 200, 'three_hundred': 300, 'four_hundred': 400, 'five_hundred': 500, 'six_hundred': 600, 'seven_hundred': 700, 'eight_hundred': 800 }, 'one_hundred': 100, 'two_hundred': 200, 'three_hundred': 300, 'four_hundred': 400, 'five_hundred': 500, 'six_hundred': 600, 'seven_hundred': 700 }, 'one_hundred': 100, 'two_hundred': 200, 'three_hundred': 300, 'four_hundred': 400, 'five_hundred': 500, 'six_hundred': 600 }, 'one_hundred': 100, 'two_hundred': 200, 'three_hundred': 300, 'four_hundred': 400, 'five_hundred': 500 }, 'one_hundred': 100, 'two_hundred': 200, 'three_hundred': 300, 'four_hundred': 400 }, 'one_hundred': 100, 'two_hundred': 200, 'three_hundred': 300 }, 'one_hundred': 100, 'two_hundred': 200 }, 'one_hundred': 100 }"`)

  vi.assertType<t.object<{ 1: t.tuple<[t.eq<"3">]>; 2: t.tuple<[t.eq<"3">]>; 0.2: t.object<{ 22: t.tuple<[t.eq<"3">, t.eq<"+">, t.eq<"30">]> }>; 3: t.tuple<[t.eq<"3">]>; 0.3: t.object<{ 33: t.tuple<[t.eq<"3">, t.eq<"+">, t.eq<"30">]>; 0.33: t.object<{ 333: t.tuple<[t.eq<"3">, t.eq<"+">, t.eq<"30">, t.eq<"300">]> }> }>; 4: t.tuple<[t.eq<"4">]>; 0.4: t.object<{ 44: t.tuple<[t.eq<"4">, t.eq<"+">, t.eq<"40">]>; 0.44: t.object<{ 444: t.tuple<[t.eq<"4">, t.eq<"+">, t.eq<"40">, t.eq<"400">]>; 0.444: t.object<{ 4444: t.tuple<[t.eq<"4">, t.eq<"+">, t.eq<"40">, t.eq<"+">, t.eq<"400">, t.eq<"+">, t.eq<"4000">]> }> }> }>; 5: t.tuple<[t.eq<"5">]>; 0.5: t.object<{ 55: t.tuple<[t.eq<"5">, t.eq<"+">, t.eq<"50">]>; 0.55: t.object<{ 555: t.tuple<[t.eq<"5">, t.eq<"+">, t.eq<"50">, t.eq<"500">]>; 0.555: t.object<{ 5555: t.tuple<[t.eq<"5">, t.eq<"+">, t.eq<"50">, t.eq<"+">, t.eq<"500">, t.eq<"+">, t.eq<"5000">]>; 0.5555: t.object<{ 55555: t.tuple<[t.eq<"5">, t.eq<"+">, t.eq<"50">, t.eq<"+">, t.eq<"500">, t.eq<"+">, t.eq<"5000">, t.eq<"+">, t.eq<"50000">]> }> }> }> }>; 6: t.tuple<[t.eq<"6">]>; 0.6: t.object<{ 66: t.tuple<[t.eq<"6">, t.eq<"+">, t.eq<"60">]>; 0.66: t.object<{ 666: t.tuple<[t.eq<"6">, t.eq<"+">, t.eq<"60">, t.eq<"600">]>; 0.666: t.object<{ 6666: t.tuple<[t.eq<"6">, t.eq<"+">, t.eq<"60">, t.eq<"+">, t.eq<"600">, t.eq<"+">, t.eq<"6000">]>; 0.6666: t.object<{ 66666: t.tuple<[t.eq<"6">, t.eq<"+">, t.eq<"60">, t.eq<"+">, t.eq<"600">, t.eq<"+">, t.eq<"6000">, t.eq<"+">, t.eq<"60000">]>; 0.66666: t.object<{ 666666: t.tuple<[t.eq<"6">, t.eq<"+">, t.eq<"60">, t.eq<"+">, t.eq<"600">, t.eq<"+">, t.eq<"6000">, t.eq<"+">, t.eq<"60000">, t.eq<"+">, t.eq<"600000">]> }> }> }> }> }>; 7: t.tuple<[t.eq<"7">]>; 0.7: t.object<{ 77: t.tuple<[t.eq<"7">, t.eq<"+">, t.eq<"70">]>; 0.77: t.object<{ 777: t.tuple<[t.eq<"7">, t.eq<"+">, t.eq<"70">, t.eq<"700">]>; 0.777: t.object<{ 7777: t.tuple<[t.eq<"7">, t.eq<"+">, t.eq<"70">, t.eq<"+">, t.eq<"700">, t.eq<"+">, t.eq<"7000">]>; 0.7777: t.object<{ 77777: t.tuple<[t.eq<"7">, t.eq<"+">, t.eq<"70">, t.eq<"+">, t.eq<"700">, t.eq<"+">, t.eq<"7000">, t.eq<"+">, t.eq<"70000">]>; 0.77777: t.object<{ 777777: t.tuple<[t.eq<"7">, t.eq<"+">, t.eq<"70">, t.eq<"+">, t.eq<"700">, t.eq<"+">, t.eq<"7000">, t.eq<"+">, t.eq<"70000">, t.eq<"+">, t.eq<"700000">]>; 0.777777: t.object<{ 7777777: t.tuple<[t.eq<"7">, t.eq<"+">, t.eq<"70">, t.eq<"+">, t.eq<"700">, t.eq<"+">, t.eq<"7000">, t.eq<"+">, t.eq<"70000">, t.eq<"+">, t.eq<"700000">, t.eq<"+">, t.eq<"7000000">]> }> }> }> }> }> }>; 8: t.tuple<[t.eq<"8">]>; 0.8: t.object<{ 88: t.tuple<[t.eq<"8">, t.eq<"+">, t.eq<"80">]>; 0.88: t.object<{ 888: t.tuple<[t.eq<"8">, t.eq<"+">, t.eq<"80">, t.eq<"800">]>; 0.888: t.object<{ 8888: t.tuple<[t.eq<"8">, t.eq<"+">, t.eq<"80">, t.eq<"+">, t.eq<"800">, t.eq<"+">, t.eq<"8000">]>; 0.8888: t.object<{ 88888: t.tuple<[t.eq<"8">, t.eq<"+">, t.eq<"80">, t.eq<"+">, t.eq<"800">, t.eq<"+">, t.eq<"8000">, t.eq<"+">, t.eq<"80000">]>; 0.88888: t.object<{ 888888: t.tuple<[t.eq<"8">, t.eq<"+">, t.eq<"80">, t.eq<"+">, t.eq<"800">, t.eq<"+">, t.eq<"8000">, t.eq<"+">, t.eq<"80000">, t.eq<"+">, t.eq<"800000">]>; 0.888888: t.object<{ 8888888: t.tuple<[t.eq<"8">, t.eq<"+">, t.eq<"80">, t.eq<"+">, t.eq<"800">, t.eq<"+">, t.eq<"8000">, t.eq<"+">, t.eq<"80000">, t.eq<"+">, t.eq<"800000">, t.eq<"+">, t.eq<"8000000">]>; 0.8888888: t.object<{ 88888888: t.tuple<[t.eq<"8">, t.eq<"+">, t.eq<"80">, t.eq<"+">, t.eq<"800">, t.eq<"+">, t.eq<"8000">, t.eq<"+">, t.eq<"80000">, t.eq<"+">, t.eq<"800000">, t.eq<"+">, t.eq<"8000000">, t.eq<"+">, t.eq<"80000000">]>; 0.88888888: t.object<{ 888888888: t.tuple<[t.eq<"8">, t.eq<"+">, t.eq<"80">, t.eq<"+">, t.eq<"800">, t.eq<"+">, t.eq<"8000">, t.eq<"+">, t.eq<"80000">, t.eq<"+">, t.eq<"800000">, t.eq<"+">, t.eq<"8000000">, t.eq<"+">, t.eq<"80000000">, t.eq<"+">, t.eq<"800000000">]> }> }> }> }> }> }> }> }>; 9: t.tuple<[t.eq<"9">]>; 0.9: t.object<{ 99: t.tuple<[t.eq<"9">, t.eq<"+">, t.eq<"90">]>; 0.99: t.object<{ 999: t.tuple<[t.eq<"9">, t.eq<"+">, t.eq<"90">, t.eq<"900">]>; 0.999: t.object<{ 9999: t.tuple<[t.eq<"9">, t.eq<"+">, t.eq<"90">, t.eq<"+">, t.eq<"900">, t.eq<"+">, t.eq<"9000">]>; 0.9999: t.object<{ 99999: t.tuple<[t.eq<"9">, t.eq<"+">, t.eq<"90">, t.eq<"+">, t.eq<"900">, t.eq<"+">, t.eq<"9000">, t.eq<"+">, t.eq<"90000">]>; 0.99999: t.object<{ 999999: t.tuple<[t.eq<"9">, t.eq<"+">, t.eq<"90">, t.eq<"+">, t.eq<"900">, t.eq<"+">, t.eq<"9000">, t.eq<"+">, t.eq<"90000">, t.eq<"+">, t.eq<"900000">]>; 0.999999: t.object<{ 9999999: t.tuple<[t.eq<"9">, t.eq<"+">, t.eq<"90">, t.eq<"+">, t.eq<"900">, t.eq<"+">, t.eq<"9000">, t.eq<"+">, t.eq<"90000">, t.eq<"+">, t.eq<"900000">, t.eq<"+">, t.eq<"9000000">]>; 0.9999999: t.object<{ 99999999: t.tuple<[t.eq<"9">, t.eq<"+">, t.eq<"90">, t.eq<"+">, t.eq<"900">, t.eq<"+">, t.eq<"9000">, t.eq<"+">, t.eq<"90000">, t.eq<"+">, t.eq<"900000">, t.eq<"+">, t.eq<"9000000">, t.eq<"+">, t.eq<"90000000">]>; 0.99999999: t.object<{ 999999999: t.tuple<[t.eq<"9">, t.eq<"+">, t.eq<"90">, t.eq<"+">, t.eq<"900">, t.eq<"+">, t.eq<"9000">, t.eq<"+">, t.eq<"90000">, t.eq<"+">, t.eq<"900000">, t.eq<"+">, t.eq<"9000000">, t.eq<"+">, t.eq<"90000000">, t.eq<"+">, t.eq<"900000000">]>; 0.999999999: t.object<{ 9999999999: t.tuple<[t.eq<"9">, t.eq<"+">, t.eq<"90">, t.eq<"+">, t.eq<"900">, t.eq<"+">, t.eq<"9000">, t.eq<"+">, t.eq<"90000">, t.eq<"+">, t.eq<"900000">, t.eq<"+">, t.eq<"9000000">, t.eq<"+">, t.eq<"90000000">, t.eq<"+">, t.eq<"900000000">, t.eq<"+">, t.eq<"9000000000">]> }> }> }> }> }> }> }> }> }> }>>(t.object({
    [1]: t.tuple(t.eq(`${3e+0}`)),
    [2]: t.tuple(t.eq(`${3e+0}`)),
    [0.2]: t.object({
      [22]: t.tuple(t.eq(`${3e+0}`), t.eq('+'), t.eq(`${3e+1}`)),
    }),
    [3]: t.tuple(t.eq(`${3e+0}`)),
    [0.3]: t.object({
      [33]: t.tuple(t.eq(`${3e+0}`), t.eq('+'), t.eq(`${3e+1}`)),
      [0.33]: t.object({
        [333]: t.tuple(t.eq(`${3e+0}`), t.eq('+'), t.eq(`${3e+1}`), t.eq(`${3e+2}`)),
      }),
    }),
    [4]: t.tuple(t.eq(`${4e+0}`)),
    [0.4]: t.object({
      [44]: t.tuple(t.eq(`${4e+0}`), t.eq('+'), t.eq(`${4e+1}`)),
      [0.44]: t.object({
        [444]: t.tuple(t.eq(`${4e+0}`), t.eq('+'), t.eq(`${4e+1}`), t.eq(`${4e+2}`)),
        [0.444]: t.object({
          [4444]: t.tuple(t.eq(`${4e+0}`), t.eq('+'), t.eq(`${4e+1}`), t.eq('+'), t.eq(`${4e+2}`), t.eq('+'), t.eq(`${4e+3}`)),
        }),
      }),
    }),
    [5]: t.tuple(t.eq(`${5e+0}`)),
    [0.5]: t.object({
      [55]: t.tuple(t.eq(`${5e+0}`), t.eq('+'), t.eq(`${5e+1}`)),
      [0.55]: t.object({
        [555]: t.tuple(t.eq(`${5e+0}`), t.eq('+'), t.eq(`${5e+1}`), t.eq(`${5e+2}`)),
        [0.555]: t.object({
          [5555]: t.tuple(t.eq(`${5e+0}`), t.eq('+'), t.eq(`${5e+1}`), t.eq('+'), t.eq(`${5e+2}`), t.eq('+'), t.eq(`${5e+3}`)),
          [0.5555]: t.object({
            [55555]: t.tuple(
              t.eq(`${5e+0}`),
              t.eq('+'),
              t.eq(`${5e+1}`),
              t.eq('+'),
              t.eq(`${5e+2}`),
              t.eq('+'),
              t.eq(`${5e+3}`),
              t.eq('+'),
              t.eq(`${5e+4}`)
            ),
          }),
        }),
      }),
    }),
    [6]: t.tuple(t.eq(`${6e+0}`)),
    [0.6]: t.object({
      [66]: t.tuple(t.eq(`${6e+0}`), t.eq('+'), t.eq(`${6e+1}`)),
      [0.66]: t.object({
        [666]: t.tuple(t.eq(`${6e+0}`), t.eq('+'), t.eq(`${6e+1}`), t.eq(`${6e+2}`)),
        [0.666]: t.object({
          [6666]: t.tuple(t.eq(`${6e+0}`), t.eq('+'), t.eq(`${6e+1}`), t.eq('+'), t.eq(`${6e+2}`), t.eq('+'), t.eq(`${6e+3}`)),
          [0.6666]: t.object({
            [66666]: t.tuple(
              t.eq(`${6e+0}`),
              t.eq('+'),
              t.eq(`${6e+1}`),
              t.eq('+'),
              t.eq(`${6e+2}`),
              t.eq('+'),
              t.eq(`${6e+3}`),
              t.eq('+'),
              t.eq(`${6e+4}`)),
            [0.66666]: t.object({
              [666666]: t.tuple(
                t.eq(`${6e+0}`),
                t.eq('+'),
                t.eq(`${6e+1}`),
                t.eq('+'),
                t.eq(`${6e+2}`),
                t.eq('+'),
                t.eq(`${6e+3}`),
                t.eq('+'),
                t.eq(`${6e+4}`),
                t.eq('+'),
                t.eq(`${6e+5}`)
              ),
            }),
          }),
        }),
      }),
    }),
    [7]: t.tuple(t.eq(`${7e+0}`)),
    [0.7]: t.object({
      [77]: t.tuple(t.eq(`${7e+0}`), t.eq('+'), t.eq(`${7e+1}`)),
      [0.77]: t.object({
        [777]: t.tuple(t.eq(`${7e+0}`), t.eq('+'), t.eq(`${7e+1}`), t.eq(`${7e+2}`)),
        [0.777]: t.object({
          [7777]: t.tuple(t.eq(`${7e+0}`), t.eq('+'), t.eq(`${7e+1}`), t.eq('+'), t.eq(`${7e+2}`), t.eq('+'), t.eq(`${7e+3}`)),
          [0.7777]: t.object({
            [77777]: t.tuple(
              t.eq(`${7e+0}`),
              t.eq('+'),
              t.eq(`${7e+1}`),
              t.eq('+'),
              t.eq(`${7e+2}`),
              t.eq('+'),
              t.eq(`${7e+3}`),
              t.eq('+'),
              t.eq(`${7e+4}`)
            ),
            [0.77777]: t.object({
              [777777]: t.tuple(
                t.eq(`${7e+0}`),
                t.eq('+'),
                t.eq(`${7e+1}`),
                t.eq('+'),
                t.eq(`${7e+2}`),
                t.eq('+'),
                t.eq(`${7e+3}`),
                t.eq('+'),
                t.eq(`${7e+4}`),
                t.eq('+'),
                t.eq(`${7e+5}`)
              ),
              [0.777777]: t.object({
                [7777777]: t.tuple(
                  t.eq(`${7e+0}`),
                  t.eq('+'),
                  t.eq(`${7e+1}`),
                  t.eq('+'),
                  t.eq(`${7e+2}`),
                  t.eq('+'),
                  t.eq(`${7e+3}`),
                  t.eq('+'),
                  t.eq(`${7e+4}`),
                  t.eq('+'),
                  t.eq(`${7e+5}`),
                  t.eq('+'),
                  t.eq(`${7e+6}`)
                ),
              }),
            }),
          }),
        }),
      }),
    }),
    [8]: t.tuple(t.eq(`${8e+0}`)),
    [0.8]: t.object({
      [88]: t.tuple(t.eq(`${8e+0}`), t.eq('+'), t.eq(`${8e+1}`)),
      [0.88]: t.object({
        [888]: t.tuple(t.eq(`${8e+0}`), t.eq('+'), t.eq(`${8e+1}`), t.eq(`${8e+2}`)),
        [0.888]: t.object({
          [8888]: t.tuple(t.eq(`${8e+0}`), t.eq('+'), t.eq(`${8e+1}`), t.eq('+'), t.eq(`${8e+2}`), t.eq('+'), t.eq(`${8e+3}`)),
          [0.8888]: t.object({
            [88888]: t.tuple(
              t.eq(`${8e+0}`),
              t.eq('+'),
              t.eq(`${8e+1}`),
              t.eq('+'),
              t.eq(`${8e+2}`),
              t.eq('+'),
              t.eq(`${8e+3}`),
              t.eq('+'),
              t.eq(`${8e+4}`)
            ),
            [0.88888]: t.object({
              [888888]: t.tuple(
                t.eq(`${8e+0}`),
                t.eq('+'),
                t.eq(`${8e+1}`),
                t.eq('+'),
                t.eq(`${8e+2}`),
                t.eq('+'),
                t.eq(`${8e+3}`),
                t.eq('+'),
                t.eq(`${8e+4}`),
                t.eq('+'),
                t.eq(`${8e+5}`)
              ),
              [0.888888]: t.object({
                [8888888]: t.tuple(
                  t.eq(`${8e+0}`),
                  t.eq('+'),
                  t.eq(`${8e+1}`),
                  t.eq('+'),
                  t.eq(`${8e+2}`),
                  t.eq('+'),
                  t.eq(`${8e+3}`),
                  t.eq('+'),
                  t.eq(`${8e+4}`),
                  t.eq('+'),
                  t.eq(`${8e+5}`),
                  t.eq('+'),
                  t.eq(`${8e+6}`)
                ),
                [0.8888888]: t.object({
                  [88888888]: t.tuple(
                    t.eq(`${8e+0}`),
                    t.eq('+'),
                    t.eq(`${8e+1}`),
                    t.eq('+'),
                    t.eq(`${8e+2}`),
                    t.eq('+'),
                    t.eq(`${8e+3}`),
                    t.eq('+'),
                    t.eq(`${8e+4}`),
                    t.eq('+'),
                    t.eq(`${8e+5}`),
                    t.eq('+'),
                    t.eq(`${8e+6}`),
                    t.eq('+'),
                    t.eq(`${8e+7}`)
                  ),
                  [0.88888888]: t.object({
                    [888888888]: t.tuple(
                      t.eq(`${8e+0}`),
                      t.eq('+'),
                      t.eq(`${8e+1}`),
                      t.eq('+'),
                      t.eq(`${8e+2}`),
                      t.eq('+'),
                      t.eq(`${8e+3}`),
                      t.eq('+'),
                      t.eq(`${8e+4}`),
                      t.eq('+'),
                      t.eq(`${8e+5}`),
                      t.eq('+'),
                      t.eq(`${8e+6}`),
                      t.eq('+'),
                      t.eq(`${8e+7}`),
                      t.eq('+'),
                      t.eq(`${8e+8}`)
                    ),
                  }),
                }),
              }),
            }),
          }),
        }),
      }),
    }),
    [9]: t.tuple(t.eq(`${9e+0}`)),
    [0.9]: t.object({
      [99]: t.tuple(t.eq(`${9e+0}`), t.eq('+'), t.eq(`${9e+1}`)),
      [0.99]: t.object({
        [999]: t.tuple(t.eq(`${9e+0}`), t.eq('+'), t.eq(`${9e+1}`), t.eq(`${9e+2}`)),
        [0.999]: t.object({
          [9999]: t.tuple(t.eq(`${9e+0}`), t.eq('+'), t.eq(`${9e+1}`), t.eq('+'), t.eq(`${9e+2}`), t.eq('+'), t.eq(`${9e+3}`)),
          [0.9999]: t.object({
            [99999]: t.tuple(
              t.eq(`${9e+0}`),
              t.eq('+'),
              t.eq(`${9e+1}`),
              t.eq('+'),
              t.eq(`${9e+2}`),
              t.eq('+'),
              t.eq(`${9e+3}`),
              t.eq('+'),
              t.eq(`${9e+4}`),
            ),
            [0.99999]: t.object({
              [999999]: t.tuple(
                t.eq(`${9e+0}`),
                t.eq('+'),
                t.eq(`${9e+1}`),
                t.eq('+'),
                t.eq(`${9e+2}`),
                t.eq('+'),
                t.eq(`${9e+3}`),
                t.eq('+'),
                t.eq(`${9e+4}`),
                t.eq('+'),
                t.eq(`${9e+5}`)
              ),
              [0.999999]: t.object({
                [9999999]: t.tuple(
                  t.eq(`${9e+0}`),
                  t.eq('+'),
                  t.eq(`${9e+1}`),
                  t.eq('+'),
                  t.eq(`${9e+2}`),
                  t.eq('+'),
                  t.eq(`${9e+3}`),
                  t.eq('+'),
                  t.eq(`${9e+4}`),
                  t.eq('+'),
                  t.eq(`${9e+5}`),
                  t.eq('+'),
                  t.eq(`${9e+6}`)
                ),
                [0.9999999]: t.object({
                  [99999999]: t.tuple(
                    t.eq(`${9e+0}`),
                    t.eq('+'),
                    t.eq(`${9e+1}`),
                    t.eq('+'),
                    t.eq(`${9e+2}`),
                    t.eq('+'),
                    t.eq(`${9e+3}`),
                    t.eq('+'),
                    t.eq(`${9e+4}`),
                    t.eq('+'),
                    t.eq(`${9e+5}`),
                    t.eq('+'),
                    t.eq(`${9e+6}`),
                    t.eq('+'),
                    t.eq(`${9e+7}`)
                  ),
                  [0.99999999]: t.object({
                    [999999999]: t.tuple(
                      t.eq(`${9e+0}`),
                      t.eq('+'),
                      t.eq(`${9e+1}`),
                      t.eq('+'),
                      t.eq(`${9e+2}`),
                      t.eq('+'),
                      t.eq(`${9e+3}`),
                      t.eq('+'),
                      t.eq(`${9e+4}`),
                      t.eq('+'),
                      t.eq(`${9e+5}`),
                      t.eq('+'),
                      t.eq(`${9e+6}`),
                      t.eq('+'),
                      t.eq(`${9e+7}`),
                      t.eq('+'),
                      t.eq(`${9e+8}`)
                    ),
                    [0.999999999]: t.object({
                      [9999999999]: t.tuple(
                        t.eq(`${9e+0}`),
                        t.eq('+'),
                        t.eq(`${9e+1}`),
                        t.eq('+'),
                        t.eq(`${9e+2}`),
                        t.eq('+'),
                        t.eq(`${9e+3}`),
                        t.eq('+'),
                        t.eq(`${9e+4}`),
                        t.eq('+'),
                        t.eq(`${9e+5}`),
                        t.eq('+'),
                        t.eq(`${9e+6}`),
                        t.eq('+'),
                        t.eq(`${9e+7}`),
                        t.eq('+'),
                        t.eq(`${9e+8}`),
                        t.eq('+'),
                        t.eq(`${9e+9}`)
                      ),
                    }),
                  }),
                }),
              }),
            }),
          }),
        }),
      }),
    }),
  }))

  vi.expect(t.object({
    [1]: t.tuple(t.eq(`${3e+0}`)),
    [2]: t.tuple(t.eq(`${3e+0}`)),
    [0.2]: t.object({
      [22]: t.tuple(t.eq(`${3e+0}`), t.eq('+'), t.eq(`${3e+1}`)),
    }),
    [3]: t.tuple(t.eq(`${3e+0}`)),
    [0.3]: t.object({
      [33]: t.tuple(t.eq(`${3e+0}`), t.eq('+'), t.eq(`${3e+1}`)),
      [0.33]: t.object({
        [333]: t.tuple(t.eq(`${3e+0}`), t.eq('+'), t.eq(`${3e+1}`), t.eq(`${3e+2}`)),
      }),
    }),
    [4]: t.tuple(t.eq(`${4e+0}`)),
    [0.4]: t.object({
      [44]: t.tuple(t.eq(`${4e+0}`), t.eq('+'), t.eq(`${4e+1}`)),
      [0.44]: t.object({
        [444]: t.tuple(t.eq(`${4e+0}`), t.eq('+'), t.eq(`${4e+1}`), t.eq(`${4e+2}`)),
        [0.444]: t.object({
          [4444]: t.tuple(t.eq(`${4e+0}`), t.eq('+'), t.eq(`${4e+1}`), t.eq('+'), t.eq(`${4e+2}`), t.eq('+'), t.eq(`${4e+3}`)),
        }),
      }),
    }),
    [5]: t.tuple(t.eq(`${5e+0}`)),
    [0.5]: t.object({
      [55]: t.tuple(t.eq(`${5e+0}`), t.eq('+'), t.eq(`${5e+1}`)),
      [0.55]: t.object({
        [555]: t.tuple(t.eq(`${5e+0}`), t.eq('+'), t.eq(`${5e+1}`), t.eq(`${5e+2}`)),
        [0.555]: t.object({
          [5555]: t.tuple(t.eq(`${5e+0}`), t.eq('+'), t.eq(`${5e+1}`), t.eq('+'), t.eq(`${5e+2}`), t.eq('+'), t.eq(`${5e+3}`)),
          [0.5555]: t.object({
            [55555]: t.tuple(
              t.eq(`${5e+0}`),
              t.eq('+'),
              t.eq(`${5e+1}`),
              t.eq('+'),
              t.eq(`${5e+2}`),
              t.eq('+'),
              t.eq(`${5e+3}`),
              t.eq('+'),
              t.eq(`${5e+4}`)
            ),
          }),
        }),
      }),
    }),
    [6]: t.tuple(t.eq(`${6e+0}`)),
    [0.6]: t.object({
      [66]: t.tuple(t.eq(`${6e+0}`), t.eq('+'), t.eq(`${6e+1}`)),
      [0.66]: t.object({
        [666]: t.tuple(t.eq(`${6e+0}`), t.eq('+'), t.eq(`${6e+1}`), t.eq(`${6e+2}`)),
        [0.666]: t.object({
          [6666]: t.tuple(t.eq(`${6e+0}`), t.eq('+'), t.eq(`${6e+1}`), t.eq('+'), t.eq(`${6e+2}`), t.eq('+'), t.eq(`${6e+3}`)),
          [0.6666]: t.object({
            [66666]: t.tuple(
              t.eq(`${6e+0}`),
              t.eq('+'),
              t.eq(`${6e+1}`),
              t.eq('+'),
              t.eq(`${6e+2}`),
              t.eq('+'),
              t.eq(`${6e+3}`),
              t.eq('+'),
              t.eq(`${6e+4}`)),
            [0.66666]: t.object({
              [666666]: t.tuple(
                t.eq(`${6e+0}`),
                t.eq('+'),
                t.eq(`${6e+1}`),
                t.eq('+'),
                t.eq(`${6e+2}`),
                t.eq('+'),
                t.eq(`${6e+3}`),
                t.eq('+'),
                t.eq(`${6e+4}`),
                t.eq('+'),
                t.eq(`${6e+5}`)
              ),
            }),
          }),
        }),
      }),
    }),
    [7]: t.tuple(t.eq(`${7e+0}`)),
    [0.7]: t.object({
      [77]: t.tuple(t.eq(`${7e+0}`), t.eq('+'), t.eq(`${7e+1}`)),
      [0.77]: t.object({
        [777]: t.tuple(t.eq(`${7e+0}`), t.eq('+'), t.eq(`${7e+1}`), t.eq(`${7e+2}`)),
        [0.777]: t.object({
          [7777]: t.tuple(t.eq(`${7e+0}`), t.eq('+'), t.eq(`${7e+1}`), t.eq('+'), t.eq(`${7e+2}`), t.eq('+'), t.eq(`${7e+3}`)),
          [0.7777]: t.object({
            [77777]: t.tuple(
              t.eq(`${7e+0}`),
              t.eq('+'),
              t.eq(`${7e+1}`),
              t.eq('+'),
              t.eq(`${7e+2}`),
              t.eq('+'),
              t.eq(`${7e+3}`),
              t.eq('+'),
              t.eq(`${7e+4}`)
            ),
            [0.77777]: t.object({
              [777777]: t.tuple(
                t.eq(`${7e+0}`),
                t.eq('+'),
                t.eq(`${7e+1}`),
                t.eq('+'),
                t.eq(`${7e+2}`),
                t.eq('+'),
                t.eq(`${7e+3}`),
                t.eq('+'),
                t.eq(`${7e+4}`),
                t.eq('+'),
                t.eq(`${7e+5}`)
              ),
              [0.777777]: t.object({
                [7777777]: t.tuple(
                  t.eq(`${7e+0}`),
                  t.eq('+'),
                  t.eq(`${7e+1}`),
                  t.eq('+'),
                  t.eq(`${7e+2}`),
                  t.eq('+'),
                  t.eq(`${7e+3}`),
                  t.eq('+'),
                  t.eq(`${7e+4}`),
                  t.eq('+'),
                  t.eq(`${7e+5}`),
                  t.eq('+'),
                  t.eq(`${7e+6}`)
                ),
              }),
            }),
          }),
        }),
      }),
    }),
    [8]: t.tuple(t.eq(`${8e+0}`)),
    [0.8]: t.object({
      [88]: t.tuple(t.eq(`${8e+0}`), t.eq('+'), t.eq(`${8e+1}`)),
      [0.88]: t.object({
        [888]: t.tuple(t.eq(`${8e+0}`), t.eq('+'), t.eq(`${8e+1}`), t.eq(`${8e+2}`)),
        [0.888]: t.object({
          [8888]: t.tuple(t.eq(`${8e+0}`), t.eq('+'), t.eq(`${8e+1}`), t.eq('+'), t.eq(`${8e+2}`), t.eq('+'), t.eq(`${8e+3}`)),
          [0.8888]: t.object({
            [88888]: t.tuple(
              t.eq(`${8e+0}`),
              t.eq('+'),
              t.eq(`${8e+1}`),
              t.eq('+'),
              t.eq(`${8e+2}`),
              t.eq('+'),
              t.eq(`${8e+3}`),
              t.eq('+'),
              t.eq(`${8e+4}`)
            ),
            [0.88888]: t.object({
              [888888]: t.tuple(
                t.eq(`${8e+0}`),
                t.eq('+'),
                t.eq(`${8e+1}`),
                t.eq('+'),
                t.eq(`${8e+2}`),
                t.eq('+'),
                t.eq(`${8e+3}`),
                t.eq('+'),
                t.eq(`${8e+4}`),
                t.eq('+'),
                t.eq(`${8e+5}`)
              ),
              [0.888888]: t.object({
                [8888888]: t.tuple(
                  t.eq(`${8e+0}`),
                  t.eq('+'),
                  t.eq(`${8e+1}`),
                  t.eq('+'),
                  t.eq(`${8e+2}`),
                  t.eq('+'),
                  t.eq(`${8e+3}`),
                  t.eq('+'),
                  t.eq(`${8e+4}`),
                  t.eq('+'),
                  t.eq(`${8e+5}`),
                  t.eq('+'),
                  t.eq(`${8e+6}`)
                ),
                [0.8888888]: t.object({
                  [88888888]: t.tuple(
                    t.eq(`${8e+0}`),
                    t.eq('+'),
                    t.eq(`${8e+1}`),
                    t.eq('+'),
                    t.eq(`${8e+2}`),
                    t.eq('+'),
                    t.eq(`${8e+3}`),
                    t.eq('+'),
                    t.eq(`${8e+4}`),
                    t.eq('+'),
                    t.eq(`${8e+5}`),
                    t.eq('+'),
                    t.eq(`${8e+6}`),
                    t.eq('+'),
                    t.eq(`${8e+7}`)
                  ),
                  [0.88888888]: t.object({
                    [888888888]: t.tuple(
                      t.eq(`${8e+0}`),
                      t.eq('+'),
                      t.eq(`${8e+1}`),
                      t.eq('+'),
                      t.eq(`${8e+2}`),
                      t.eq('+'),
                      t.eq(`${8e+3}`),
                      t.eq('+'),
                      t.eq(`${8e+4}`),
                      t.eq('+'),
                      t.eq(`${8e+5}`),
                      t.eq('+'),
                      t.eq(`${8e+6}`),
                      t.eq('+'),
                      t.eq(`${8e+7}`),
                      t.eq('+'),
                      t.eq(`${8e+8}`)
                    ),
                  }),
                }),
              }),
            }),
          }),
        }),
      }),
    }),
    [9]: t.tuple(t.eq(`${9e+0}`)),
    [0.9]: t.object({
      [99]: t.tuple(t.eq(`${9e+0}`), t.eq('+'), t.eq(`${9e+1}`)),
      [0.99]: t.object({
        [999]: t.tuple(t.eq(`${9e+0}`), t.eq('+'), t.eq(`${9e+1}`), t.eq(`${9e+2}`)),
        [0.999]: t.object({
          [9999]: t.tuple(t.eq(`${9e+0}`), t.eq('+'), t.eq(`${9e+1}`), t.eq('+'), t.eq(`${9e+2}`), t.eq('+'), t.eq(`${9e+3}`)),
          [0.9999]: t.object({
            [99999]: t.tuple(
              t.eq(`${9e+0}`),
              t.eq('+'),
              t.eq(`${9e+1}`),
              t.eq('+'),
              t.eq(`${9e+2}`),
              t.eq('+'),
              t.eq(`${9e+3}`),
              t.eq('+'),
              t.eq(`${9e+4}`),
            ),
            [0.99999]: t.object({
              [999999]: t.tuple(
                t.eq(`${9e+0}`),
                t.eq('+'),
                t.eq(`${9e+1}`),
                t.eq('+'),
                t.eq(`${9e+2}`),
                t.eq('+'),
                t.eq(`${9e+3}`),
                t.eq('+'),
                t.eq(`${9e+4}`),
                t.eq('+'),
                t.eq(`${9e+5}`)
              ),
              [0.999999]: t.object({
                [9999999]: t.tuple(
                  t.eq(`${9e+0}`),
                  t.eq('+'),
                  t.eq(`${9e+1}`),
                  t.eq('+'),
                  t.eq(`${9e+2}`),
                  t.eq('+'),
                  t.eq(`${9e+3}`),
                  t.eq('+'),
                  t.eq(`${9e+4}`),
                  t.eq('+'),
                  t.eq(`${9e+5}`),
                  t.eq('+'),
                  t.eq(`${9e+6}`)
                ),
                [0.9999999]: t.object({
                  [99999999]: t.tuple(
                    t.eq(`${9e+0}`),
                    t.eq('+'),
                    t.eq(`${9e+1}`),
                    t.eq('+'),
                    t.eq(`${9e+2}`),
                    t.eq('+'),
                    t.eq(`${9e+3}`),
                    t.eq('+'),
                    t.eq(`${9e+4}`),
                    t.eq('+'),
                    t.eq(`${9e+5}`),
                    t.eq('+'),
                    t.eq(`${9e+6}`),
                    t.eq('+'),
                    t.eq(`${9e+7}`)
                  ),
                  [0.99999999]: t.object({
                    [999999999]: t.tuple(
                      t.eq(`${9e+0}`),
                      t.eq('+'),
                      t.eq(`${9e+1}`),
                      t.eq('+'),
                      t.eq(`${9e+2}`),
                      t.eq('+'),
                      t.eq(`${9e+3}`),
                      t.eq('+'),
                      t.eq(`${9e+4}`),
                      t.eq('+'),
                      t.eq(`${9e+5}`),
                      t.eq('+'),
                      t.eq(`${9e+6}`),
                      t.eq('+'),
                      t.eq(`${9e+7}`),
                      t.eq('+'),
                      t.eq(`${9e+8}`)
                    ),
                    [0.999999999]: t.object({
                      [9999999999]: t.tuple(
                        t.eq(`${9e+0}`),
                        t.eq('+'),
                        t.eq(`${9e+1}`),
                        t.eq('+'),
                        t.eq(`${9e+2}`),
                        t.eq('+'),
                        t.eq(`${9e+3}`),
                        t.eq('+'),
                        t.eq(`${9e+4}`),
                        t.eq('+'),
                        t.eq(`${9e+5}`),
                        t.eq('+'),
                        t.eq(`${9e+6}`),
                        t.eq('+'),
                        t.eq(`${9e+7}`),
                        t.eq('+'),
                        t.eq(`${9e+8}`),
                        t.eq('+'),
                        t.eq(`${9e+9}`)
                      ),
                    }),
                  }),
                }),
              }),
            }),
          }),
        }),
      }),
    }),
  }).toType()).toMatchInlineSnapshot(
    `"{ '1': ['3'], '2': ['3'], '3': ['3'], '4': ['4'], '5': ['5'], '6': ['6'], '7': ['7'], '8': ['8'], '9': ['9'], '0.2': { '22': ['3', '+', '30'] }, '0.3': { '33': ['3', '+', '30'], '0.33': { '333': ['3', '+', '30', '300'] } }, '0.4': { '44': ['4', '+', '40'], '0.44': { '444': ['4', '+', '40', '400'], '0.444': { '4444': ['4', '+', '40', '+', '400', '+', '4000'] } } }, '0.5': { '55': ['5', '+', '50'], '0.55': { '555': ['5', '+', '50', '500'], '0.555': { '5555': ['5', '+', '50', '+', '500', '+', '5000'], '0.5555': { '55555': ['5', '+', '50', '+', '500', '+', '5000', '+', '50000'] } } } }, '0.6': { '66': ['6', '+', '60'], '0.66': { '666': ['6', '+', '60', '600'], '0.666': { '6666': ['6', '+', '60', '+', '600', '+', '6000'], '0.6666': { '66666': ['6', '+', '60', '+', '600', '+', '6000', '+', '60000'], '0.66666': { '666666': ['6', '+', '60', '+', '600', '+', '6000', '+', '60000', '+', '600000'] } } } } }, '0.7': { '77': ['7', '+', '70'], '0.77': { '777': ['7', '+', '70', '700'], '0.777': { '7777': ['7', '+', '70', '+', '700', '+', '7000'], '0.7777': { '77777': ['7', '+', '70', '+', '700', '+', '7000', '+', '70000'], '0.77777': { '777777': ['7', '+', '70', '+', '700', '+', '7000', '+', '70000', '+', '700000'], '0.777777': { '7777777': ['7', '+', '70', '+', '700', '+', '7000', '+', '70000', '+', '700000', '+', '7000000'] } } } } } }, '0.8': { '88': ['8', '+', '80'], '0.88': { '888': ['8', '+', '80', '800'], '0.888': { '8888': ['8', '+', '80', '+', '800', '+', '8000'], '0.8888': { '88888': ['8', '+', '80', '+', '800', '+', '8000', '+', '80000'], '0.88888': { '888888': ['8', '+', '80', '+', '800', '+', '8000', '+', '80000', '+', '800000'], '0.888888': { '8888888': ['8', '+', '80', '+', '800', '+', '8000', '+', '80000', '+', '800000', '+', '8000000'], '0.8888888': { '88888888': ['8', '+', '80', '+', '800', '+', '8000', '+', '80000', '+', '800000', '+', '8000000', '+', '80000000'], '0.88888888': { '888888888': ['8', '+', '80', '+', '800', '+', '8000', '+', '80000', '+', '800000', '+', '8000000', '+', '80000000', '+', '800000000'] } } } } } } } }, '0.9': { '99': ['9', '+', '90'], '0.99': { '999': ['9', '+', '90', '900'], '0.999': { '9999': ['9', '+', '90', '+', '900', '+', '9000'], '0.9999': { '99999': ['9', '+', '90', '+', '900', '+', '9000', '+', '90000'], '0.99999': { '999999': ['9', '+', '90', '+', '900', '+', '9000', '+', '90000', '+', '900000'], '0.999999': { '9999999': ['9', '+', '90', '+', '900', '+', '9000', '+', '90000', '+', '900000', '+', '9000000'], '0.9999999': { '99999999': ['9', '+', '90', '+', '900', '+', '9000', '+', '90000', '+', '900000', '+', '9000000', '+', '90000000'], '0.99999999': { '999999999': ['9', '+', '90', '+', '900', '+', '9000', '+', '90000', '+', '900000', '+', '9000000', '+', '90000000', '+', '900000000'], '0.999999999': { '9999999999': ['9', '+', '90', '+', '900', '+', '9000', '+', '90000', '+', '900000', '+', '9000000', '+', '90000000', '+', '900000000', '+', '9000000000'] } } } } } } } } } }"`

  )
})

vi.it('〖⛳️〗› ❲t.toType❳: edge cases that fast-check found', () => {
  const ex_01 = t.intersect(t.any, t.array(t.string)).toType()
  vi.assert.equal(ex_01, "(any & (string)[])")

  vi.assertType<`{ '$1': { '$2': { '$3': { '$4': { '$5': { '$6': { '$7': { '$8': { '$9': { '$10': { '$11A': { '$12A': { '$13A': { '$14A': { '$15A': { '$16A': boolean, '$16B': number, '$16C': number }, '$15B': [null], '$15C': Record<string, (number | undefined)> }, '$14B': (1 | 2 | 3), '$14C': ({ '$15D': unknown, '$15E': void }) }, '$13B': [{ '$14D': 4, '$14E': 5 }], '$13C': ({ '$14F': 6, '$14G': 7 })[] }, '$12B': 8, '$12C': {}, '$12D': [] }, '$11B': 9, '$11C': (10 | (11)[] | Record<string, 12>) }, '$10B': 13, '$10C': 14 }, '$9B': ({ '$10D': 15, '$10E': 16 }), '$9C': 17 }, '$8B': 18 }, '$7B': ((number | bigint))[] }, '$6B': ((number)[])[] }, '$5B': 19 }, '$4B': 20, '$4C': (21 | 22) }, '$3B': 23 }, '$2B': Record<string, (24 | 25)> } }`>(
    t.object({
      $1: t.object({
        $2: t.object({
          $3: t.object({
            $4: t.object({
              $5: t.object({
                $6: t.object({
                  $7: t.object({
                    $8: t.object({
                      $9: t.object({
                        $10: t.object({
                          $11A: t.object({
                            $12A: t.object({
                              $13A: t.object({
                                $14A: t.object({
                                  $15A: t.object({
                                    $16A: t.boolean,
                                    $16B: t.integer,
                                    $16C: t.number,
                                  }),
                                  $15B: t.tuple(t.null),
                                  $15C: t.record(t.optional(t.number)),
                                }),
                                $14B: t.union(t.eq(1), t.eq(2), t.eq(3)),
                                $14C: t.intersect(t.object({ $15D: t.unknown, $15E: t.void }))
                              }),
                              $13B: t.tuple(t.object({ $14D: t.eq(4), $14E: t.eq(5) })),
                              $13C: t.array(t.object({ $14F: t.eq(6), $14G: t.eq(7) })),
                            }),
                            $12B: t.eq(8),
                            $12C: t.object({}),
                            $12D: t.tuple(),
                          }),
                          $11B: t.eq(9),
                          $11C: t.union(t.eq(10), t.array(t.eq(11)), t.record(t.eq(12))),
                        }),
                        $10B: t.eq(13),
                        $10C: t.eq(14),
                      }),
                      $9B: t.intersect(
                        t.object({
                          $10D: t.eq(15),
                          $10E: t.eq(16),
                        })
                      ),
                      $9C: t.eq(17),
                    }),
                    $8B: t.eq(18),
                  }),
                  $7B: t.array(t.union(t.integer, t.bigint)),
                }),
                $6B: t.array(t.array(t.number)),
              }),
              $5B: t.eq(19),
            }),
            $4B: t.eq(20),
            $4C: t.union(t.eq(21), t.eq(22)),
          }),
          $3B: t.eq(23)
        }),
        $2B: t.record(t.union(t.eq(24), t.eq(25))),
      })
    }).toType())
})
