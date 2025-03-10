import * as vi from 'vitest'

import { t } from '@traversable/schema-to-string'
import { configure } from '@traversable/schema-core'

const rec = t.Recursive

configure({
  schema: {
    optionalTreatment: 'treatUndefinedAndOptionalAsTheSame',
  }
})

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema❳: t.Recursive.toString', () => {
  vi.it('〖⛳️〗‹ ❲t.Recursive.toString(t.void)❳', () => vi.expect(rec.toString(t.void)).toMatchInlineSnapshot(`"t.void"`))
  vi.it('〖⛳️〗‹ ❲t.Recursive.toString(t.any)❳', () => vi.expect(rec.toString(t.any)).toMatchInlineSnapshot(`"t.any"`))
  vi.it('〖⛳️〗‹ ❲t.Recursive.toString(t.unknown)❳', () => vi.expect(rec.toString(t.unknown)).toMatchInlineSnapshot(`"t.unknown"`))
  vi.it('〖⛳️〗‹ ❲t.Recursive.toString(t.null)❳', () => vi.expect(rec.toString(t.null)).toMatchInlineSnapshot(`"t.null"`))
  vi.it('〖⛳️〗‹ ❲t.Recursive.toString(t.undefined)❳', () => vi.expect(rec.toString(t.undefined)).toMatchInlineSnapshot(`"t.undefined"`))
  vi.it('〖⛳️〗‹ ❲t.Recursive.toString(t.symbol)❳', () => vi.expect(rec.toString(t.symbol)).toMatchInlineSnapshot(`"t.symbol"`))
  vi.it('〖⛳️〗‹ ❲t.Recursive.toString(t.boolean)❳', () => vi.expect(rec.toString(t.boolean)).toMatchInlineSnapshot(`"t.boolean"`))
  vi.it('〖⛳️〗‹ ❲t.Recursive.toString(t.bigint)❳', () => vi.expect(rec.toString(t.bigint)).toMatchInlineSnapshot(`"t.bigint"`))
  vi.it('〖⛳️〗‹ ❲t.Recursive.toString(t.number)❳', () => vi.expect(rec.toString(t.number)).toMatchInlineSnapshot(`"t.number"`))
  vi.it('〖⛳️〗‹ ❲t.Recursive.toString(t.string)❳', () => vi.expect(rec.toString(t.string)).toMatchInlineSnapshot(`"t.string"`))

  vi.it('〖⛳️〗‹ ❲t.Recursive.toString(t.optional(...))❳', () => {
    vi.expect(rec.toString(t.optional(t.void))).toMatchInlineSnapshot(`"t.optional(t.void)"`)
    vi.expect(rec.toString(t.optional(t.never))).toMatchInlineSnapshot(`"t.optional(t.never)"`)
    vi.expect(rec.toString(t.optional(t.any))).toMatchInlineSnapshot(`"t.optional(t.any)"`)
    vi.expect(rec.toString(t.optional(t.unknown))).toMatchInlineSnapshot(`"t.optional(t.unknown)"`)
    vi.expect(rec.toString(t.optional(t.null))).toMatchInlineSnapshot(`"t.optional(t.null)"`)
    vi.expect(rec.toString(t.optional(t.undefined))).toMatchInlineSnapshot(`"t.optional(t.undefined)"`)
    vi.expect(rec.toString(t.optional(t.symbol))).toMatchInlineSnapshot(`"t.optional(t.symbol)"`)
    vi.expect(rec.toString(t.optional(t.boolean))).toMatchInlineSnapshot(`"t.optional(t.boolean)"`)
    vi.expect(rec.toString(t.optional(t.bigint))).toMatchInlineSnapshot(`"t.optional(t.bigint)"`)
    vi.expect(rec.toString(t.optional(t.number))).toMatchInlineSnapshot(`"t.optional(t.number)"`)
    vi.expect(rec.toString(t.optional(t.string))).toMatchInlineSnapshot(`"t.optional(t.string)"`)
  })

  vi.it('〖⛳️〗‹ ❲t.Recursive.toString(t.array(...))❳', () => {
    vi.expect(rec.toString(t.array(t.void))).toMatchInlineSnapshot(`"t.array(t.void)"`)
    vi.expect(rec.toString(t.array(t.never))).toMatchInlineSnapshot(`"t.array(t.never)"`)
    vi.expect(rec.toString(t.array(t.any))).toMatchInlineSnapshot(`"t.array(t.any)"`)
    vi.expect(rec.toString(t.array(t.unknown))).toMatchInlineSnapshot(`"t.array(t.unknown)"`)
    vi.expect(rec.toString(t.array(t.null))).toMatchInlineSnapshot(`"t.array(t.null)"`)
    vi.expect(rec.toString(t.array(t.undefined))).toMatchInlineSnapshot(`"t.array(t.undefined)"`)
    vi.expect(rec.toString(t.array(t.symbol))).toMatchInlineSnapshot(`"t.array(t.symbol)"`)
    vi.expect(rec.toString(t.array(t.boolean))).toMatchInlineSnapshot(`"t.array(t.boolean)"`)
    vi.expect(rec.toString(t.array(t.bigint))).toMatchInlineSnapshot(`"t.array(t.bigint)"`)
    vi.expect(rec.toString(t.array(t.number))).toMatchInlineSnapshot(`"t.array(t.number)"`)
    vi.expect(rec.toString(t.array(t.string))).toMatchInlineSnapshot(`"t.array(t.string)"`)
  })

  vi.it('〖⛳️〗‹ ❲t.Recursive.toString(t.record(...))❳', () => {
    vi.expect(rec.toString(t.record(t.void))).toMatchInlineSnapshot(`"t.record(t.void)"`)
    vi.expect(rec.toString(t.record(t.never))).toMatchInlineSnapshot(`"t.record(t.never)"`)
    vi.expect(rec.toString(t.record(t.any))).toMatchInlineSnapshot(`"t.record(t.any)"`)
    vi.expect(rec.toString(t.record(t.unknown))).toMatchInlineSnapshot(`"t.record(t.unknown)"`)
    vi.expect(rec.toString(t.record(t.null))).toMatchInlineSnapshot(`"t.record(t.null)"`)
    vi.expect(rec.toString(t.record(t.undefined))).toMatchInlineSnapshot(`"t.record(t.undefined)"`)
    vi.expect(rec.toString(t.record(t.symbol))).toMatchInlineSnapshot(`"t.record(t.symbol)"`)
    vi.expect(rec.toString(t.record(t.boolean))).toMatchInlineSnapshot(`"t.record(t.boolean)"`)
    vi.expect(rec.toString(t.record(t.bigint))).toMatchInlineSnapshot(`"t.record(t.bigint)"`)
    vi.expect(rec.toString(t.record(t.number))).toMatchInlineSnapshot(`"t.record(t.number)"`)
    vi.expect(rec.toString(t.record(t.string))).toMatchInlineSnapshot(`"t.record(t.string)"`)
  })

  vi.it('〖⛳️〗‹ ❲t.Recursive.toString(t.union(...))❳', () => {
    vi.expect(rec.toString(t.union(t.void))).toMatchInlineSnapshot(`"t.union(t.void)"`)
    vi.expect(rec.toString(t.union(t.never))).toMatchInlineSnapshot(`"t.union(t.never)"`)
    vi.expect(rec.toString(t.union(t.any))).toMatchInlineSnapshot(`"t.union(t.any)"`)
    vi.expect(rec.toString(t.union(t.unknown))).toMatchInlineSnapshot(`"t.union(t.unknown)"`)
    vi.expect(rec.toString(t.union(t.null))).toMatchInlineSnapshot(`"t.union(t.null)"`)
    vi.expect(rec.toString(t.union(t.undefined))).toMatchInlineSnapshot(`"t.union(t.undefined)"`)
    vi.expect(rec.toString(t.union(t.symbol))).toMatchInlineSnapshot(`"t.union(t.symbol)"`)
    vi.expect(rec.toString(t.union(t.boolean))).toMatchInlineSnapshot(`"t.union(t.boolean)"`)
    vi.expect(rec.toString(t.union(t.bigint))).toMatchInlineSnapshot(`"t.union(t.bigint)"`)
    vi.expect(rec.toString(t.union(t.number))).toMatchInlineSnapshot(`"t.union(t.number)"`)
    vi.expect(rec.toString(t.union(t.string))).toMatchInlineSnapshot(`"t.union(t.string)"`)
    //
    vi.expect(rec.toString(t.union(t.void, t.never))).toMatchInlineSnapshot(`"t.union(t.void, t.never)"`)
    vi.expect(rec.toString(t.union(t.never, t.never))).toMatchInlineSnapshot(`"t.union(t.never, t.never)"`)
    vi.expect(rec.toString(t.union(t.any, t.never))).toMatchInlineSnapshot(`"t.union(t.any, t.never)"`)
    vi.expect(rec.toString(t.union(t.unknown, t.never))).toMatchInlineSnapshot(`"t.union(t.unknown, t.never)"`)
    vi.expect(rec.toString(t.union(t.null, t.never))).toMatchInlineSnapshot(`"t.union(t.null, t.never)"`)
    vi.expect(rec.toString(t.union(t.undefined, t.never))).toMatchInlineSnapshot(`"t.union(t.undefined, t.never)"`)
    vi.expect(rec.toString(t.union(t.symbol, t.never))).toMatchInlineSnapshot(`"t.union(t.symbol, t.never)"`)
    vi.expect(rec.toString(t.union(t.boolean, t.never))).toMatchInlineSnapshot(`"t.union(t.boolean, t.never)"`)
    vi.expect(rec.toString(t.union(t.bigint, t.never))).toMatchInlineSnapshot(`"t.union(t.bigint, t.never)"`)
    vi.expect(rec.toString(t.union(t.number, t.never))).toMatchInlineSnapshot(`"t.union(t.number, t.never)"`)
    vi.expect(rec.toString(t.union(t.string, t.never))).toMatchInlineSnapshot(`"t.union(t.string, t.never)"`)
  })


  vi.it('〖⛳️〗‹ ❲t.Recursive.toString(t.intersect(...))❳', () => {
    vi.expect(rec.toString(t.intersect(t.void))).toMatchInlineSnapshot(`"t.intersect(t.void)"`)
    vi.expect(rec.toString(t.intersect(t.never))).toMatchInlineSnapshot(`"t.intersect(t.never)"`)
    vi.expect(rec.toString(t.intersect(t.any))).toMatchInlineSnapshot(`"t.intersect(t.any)"`)
    vi.expect(rec.toString(t.intersect(t.unknown))).toMatchInlineSnapshot(`"t.intersect(t.unknown)"`)
    vi.expect(rec.toString(t.intersect(t.null))).toMatchInlineSnapshot(`"t.intersect(t.null)"`)
    vi.expect(rec.toString(t.intersect(t.undefined))).toMatchInlineSnapshot(`"t.intersect(t.undefined)"`)
    vi.expect(rec.toString(t.intersect(t.symbol))).toMatchInlineSnapshot(`"t.intersect(t.symbol)"`)
    vi.expect(rec.toString(t.intersect(t.boolean))).toMatchInlineSnapshot(`"t.intersect(t.boolean)"`)
    vi.expect(rec.toString(t.intersect(t.bigint))).toMatchInlineSnapshot(`"t.intersect(t.bigint)"`)
    vi.expect(rec.toString(t.intersect(t.number))).toMatchInlineSnapshot(`"t.intersect(t.number)"`)
    vi.expect(rec.toString(t.intersect(t.string))).toMatchInlineSnapshot(`"t.intersect(t.string)"`)
    //
    vi.expect(rec.toString(t.intersect(t.void, t.never))).toMatchInlineSnapshot(`"t.intersect(t.void, t.never)"`)
    vi.expect(rec.toString(t.intersect(t.never, t.never))).toMatchInlineSnapshot(`"t.intersect(t.never, t.never)"`)
    vi.expect(rec.toString(t.intersect(t.any, t.never))).toMatchInlineSnapshot(`"t.intersect(t.any, t.never)"`)
    vi.expect(rec.toString(t.intersect(t.unknown, t.never))).toMatchInlineSnapshot(`"t.intersect(t.unknown, t.never)"`)
    vi.expect(rec.toString(t.intersect(t.null, t.never))).toMatchInlineSnapshot(`"t.intersect(t.null, t.never)"`)
    vi.expect(rec.toString(t.intersect(t.undefined, t.never))).toMatchInlineSnapshot(`"t.intersect(t.undefined, t.never)"`)
    vi.expect(rec.toString(t.intersect(t.symbol, t.never))).toMatchInlineSnapshot(`"t.intersect(t.symbol, t.never)"`)
    vi.expect(rec.toString(t.intersect(t.boolean, t.never))).toMatchInlineSnapshot(`"t.intersect(t.boolean, t.never)"`)
    vi.expect(rec.toString(t.intersect(t.bigint, t.never))).toMatchInlineSnapshot(`"t.intersect(t.bigint, t.never)"`)
    vi.expect(rec.toString(t.intersect(t.number, t.never))).toMatchInlineSnapshot(`"t.intersect(t.number, t.never)"`)
    vi.expect(rec.toString(t.intersect(t.string, t.never))).toMatchInlineSnapshot(`"t.intersect(t.string, t.never)"`)
  })

  vi.it('〖⛳️〗‹ ❲t.Recursive.toString(t.tuple(...))❳', () => {
    vi.expect(rec.toString(t.tuple(t.void))).toMatchInlineSnapshot(`"t.tuple(t.void)"`)
    vi.expect(rec.toString(t.tuple(t.never))).toMatchInlineSnapshot(`"t.tuple(t.never)"`)
    vi.expect(rec.toString(t.tuple(t.any))).toMatchInlineSnapshot(`"t.tuple(t.any)"`)
    vi.expect(rec.toString(t.tuple(t.unknown))).toMatchInlineSnapshot(`"t.tuple(t.unknown)"`)
    vi.expect(rec.toString(t.tuple(t.null))).toMatchInlineSnapshot(`"t.tuple(t.null)"`)
    vi.expect(rec.toString(t.tuple(t.undefined))).toMatchInlineSnapshot(`"t.tuple(t.undefined)"`)
    vi.expect(rec.toString(t.tuple(t.symbol))).toMatchInlineSnapshot(`"t.tuple(t.symbol)"`)
    vi.expect(rec.toString(t.tuple(t.boolean))).toMatchInlineSnapshot(`"t.tuple(t.boolean)"`)
    vi.expect(rec.toString(t.tuple(t.bigint))).toMatchInlineSnapshot(`"t.tuple(t.bigint)"`)
    vi.expect(rec.toString(t.tuple(t.number))).toMatchInlineSnapshot(`"t.tuple(t.number)"`)
    vi.expect(rec.toString(t.tuple(t.string))).toMatchInlineSnapshot(`"t.tuple(t.string)"`)
    //
    vi.expect(rec.toString(t.tuple(t.void, t.never))).toMatchInlineSnapshot(`"t.tuple(t.void, t.never)"`)
    vi.expect(rec.toString(t.tuple(t.never, t.never))).toMatchInlineSnapshot(`"t.tuple(t.never, t.never)"`)
    vi.expect(rec.toString(t.tuple(t.any, t.never))).toMatchInlineSnapshot(`"t.tuple(t.any, t.never)"`)
    vi.expect(rec.toString(t.tuple(t.unknown, t.never))).toMatchInlineSnapshot(`"t.tuple(t.unknown, t.never)"`)
    vi.expect(rec.toString(t.tuple(t.null, t.never))).toMatchInlineSnapshot(`"t.tuple(t.null, t.never)"`)
    vi.expect(rec.toString(t.tuple(t.undefined, t.never))).toMatchInlineSnapshot(`"t.tuple(t.undefined, t.never)"`)
    vi.expect(rec.toString(t.tuple(t.symbol, t.never))).toMatchInlineSnapshot(`"t.tuple(t.symbol, t.never)"`)
    vi.expect(rec.toString(t.tuple(t.boolean, t.never))).toMatchInlineSnapshot(`"t.tuple(t.boolean, t.never)"`)
    vi.expect(rec.toString(t.tuple(t.bigint, t.never))).toMatchInlineSnapshot(`"t.tuple(t.bigint, t.never)"`)
    vi.expect(rec.toString(t.tuple(t.number, t.never))).toMatchInlineSnapshot(`"t.tuple(t.number, t.never)"`)
    vi.expect(rec.toString(t.tuple(t.string, t.never))).toMatchInlineSnapshot(`"t.tuple(t.string, t.never)"`)
  })

  vi.it('〖⛳️〗‹ ❲t.Recursive.toString(t.object(...))❳', () => {
    vi.expect(rec.toString(t.object({ a: t.void }))).toMatchInlineSnapshot(`"t.object({ a: t.void })"`)
    vi.expect(rec.toString(t.object({ a: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.never })"`)
    vi.expect(rec.toString(t.object({ a: t.any }))).toMatchInlineSnapshot(`"t.object({ a: t.any })"`)
    vi.expect(rec.toString(t.object({ a: t.unknown }))).toMatchInlineSnapshot(`"t.object({ a: t.unknown })"`)
    vi.expect(rec.toString(t.object({ a: t.null }))).toMatchInlineSnapshot(`"t.object({ a: t.null })"`)
    vi.expect(rec.toString(t.object({ a: t.undefined }))).toMatchInlineSnapshot(`"t.object({ a: t.undefined })"`)
    vi.expect(rec.toString(t.object({ a: t.symbol }))).toMatchInlineSnapshot(`"t.object({ a: t.symbol })"`)
    vi.expect(rec.toString(t.object({ a: t.boolean }))).toMatchInlineSnapshot(`"t.object({ a: t.boolean })"`)
    vi.expect(rec.toString(t.object({ a: t.bigint }))).toMatchInlineSnapshot(`"t.object({ a: t.bigint })"`)
    vi.expect(rec.toString(t.object({ a: t.number }))).toMatchInlineSnapshot(`"t.object({ a: t.number })"`)
    vi.expect(rec.toString(t.object({ a: t.string }))).toMatchInlineSnapshot(`"t.object({ a: t.string })"`)
    //
    vi.expect(rec.toString(t.object({ a: t.void, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.void, b: t.never })"`)
    vi.expect(rec.toString(t.object({ a: t.never, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.never, b: t.never })"`)
    vi.expect(rec.toString(t.object({ a: t.any, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.any, b: t.never })"`)
    vi.expect(rec.toString(t.object({ a: t.unknown, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.unknown, b: t.never })"`)
    vi.expect(rec.toString(t.object({ a: t.null, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.null, b: t.never })"`)
    vi.expect(rec.toString(t.object({ a: t.undefined, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.undefined, b: t.never })"`)
    vi.expect(rec.toString(t.object({ a: t.symbol, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.symbol, b: t.never })"`)
    vi.expect(rec.toString(t.object({ a: t.boolean, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.boolean, b: t.never })"`)
    vi.expect(rec.toString(t.object({ a: t.bigint, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.bigint, b: t.never })"`)
    vi.expect(rec.toString(t.object({ a: t.number, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.number, b: t.never })"`)
    vi.expect(rec.toString(t.object({ a: t.string, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.string, b: t.never })"`)
  })

  vi.it('〖⛳️〗‹ ❲t.Recursive.toString(t.eq(...))❳', () => {
    vi.expect(rec.toString(t.eq(null))).toMatchInlineSnapshot(`"t.eq(null)"`)
    vi.expect(rec.toString(t.eq(0))).toMatchInlineSnapshot(`"t.eq(0)"`)
    vi.expect(rec.toString(t.eq(1e+29))).toMatchInlineSnapshot(`"t.eq(1e+29)"`)
    vi.expect(rec.toString(t.eq("1.0"))).toMatchInlineSnapshot(`"t.eq("1.0")"`)
    vi.expect(rec.toString(t.eq({ _: undefined }))).toMatchInlineSnapshot(`"t.eq({ _: undefined })"`)
    vi.expect(rec.toString(t.eq({ _: null }))).toMatchInlineSnapshot(`"t.eq({ _: null })"`)
    vi.expect(rec.toString(t.eq(null))).toMatchInlineSnapshot(`"t.eq(null)"`)
    vi.expect(rec.toString(t.eq(0))).toMatchInlineSnapshot(`"t.eq(0)"`)
    vi.expect(rec.toString(t.eq(1e+29))).toMatchInlineSnapshot(`"t.eq(1e+29)"`)
    vi.expect(rec.toString(t.eq("1.0"))).toMatchInlineSnapshot(`"t.eq("1.0")"`)
    vi.expect(rec.toString(t.eq([]))).toMatchInlineSnapshot(`"t.eq([])"`)
    vi.expect(rec.toString(t.eq([undefined]))).toMatchInlineSnapshot(`"t.eq([undefined])"`)
    vi.expect(rec.toString(t.eq([null]))).toMatchInlineSnapshot(`"t.eq([null])"`)
    vi.expect(rec.toString(t.eq([[[]]]))).toMatchInlineSnapshot(`"t.eq([[[]]])"`)
    vi                                                                         /// TODO: look into missing `__proto__` property
      .expect(rec.toString(t.eq({ '': undefined, _: undefined, '\\': undefined, ['__proto__']: undefined, ['toString']: undefined })))
      .toMatchInlineSnapshot(`"t.eq({ "": undefined, _: undefined, "\\\\": undefined, toString: undefined })"`)
    vi
      .expect(rec.toString(t.eq({ '': null, _: null, '\\': null, ['__proto__']: null, ['toString']: null })))
      .toMatchInlineSnapshot(`"t.eq({ "": null, _: null, "\\\\": null, toString: null })"`)
  })
})


vi.it('〖⛳️〗› ❲t.never.toString❳', () => vi.expect(t.never.toString()).toMatchInlineSnapshot(`"never"`))
vi.it('〖⛳️〗› ❲t.any.toString❳', () => vi.expect(t.any.toString()).toMatchInlineSnapshot(`"any"`))
vi.it('〖⛳️〗› ❲t.unknown.toString❳', () => vi.expect(t.unknown.toString()).toMatchInlineSnapshot(`"unknown"`))
vi.it('〖⛳️〗› ❲t.void.toString❳', () => vi.expect(t.void.toString()).toMatchInlineSnapshot(`"void"`))
vi.it('〖⛳️〗› ❲t.null.toString❳', () => vi.expect(t.null.toString()).toMatchInlineSnapshot(`"null"`))
vi.it('〖⛳️〗› ❲t.undefined.toString❳', () => vi.expect(t.undefined.toString()).toMatchInlineSnapshot(`"undefined"`))
vi.it('〖⛳️〗› ❲t.symbol.toString❳', () => vi.expect(t.symbol.toString()).toMatchInlineSnapshot(`"symbol"`))
vi.it('〖⛳️〗› ❲t.boolean.toString❳', () => vi.expect(t.boolean.toString()).toMatchInlineSnapshot(`"boolean"`))
vi.it('〖⛳️〗› ❲t.integer.toString❳', () => vi.expect(t.integer.toString()).toMatchInlineSnapshot(`"number"`))
vi.it('〖⛳️〗› ❲t.bigint.toString❳', () => vi.expect(t.bigint.toString()).toMatchInlineSnapshot(`"bigint"`))
vi.it('〖⛳️〗› ❲t.number.toString❳', () => vi.expect(t.number.toString()).toMatchInlineSnapshot(`"number"`))
vi.it('〖⛳️〗› ❲t.string.toString❳', () => vi.expect(t.string.toString()).toMatchInlineSnapshot(`"string"`))

vi.it('〖⛳️〗› ❲t.eq(...).toString❳', () => (
  vi.expect(t.eq(9000).toString()).toMatchInlineSnapshot(`"9000"`),
  vi.assertType<'9000'>(t.eq(9000).toString()),
  vi.expect(t.eq("Jesters do oft prove prophets").toString()).toMatchInlineSnapshot(`"'Jesters do oft prove prophets'"`),
  vi.assertType<"'Jesters do oft prove prophets'">(t.eq("Jesters do oft prove prophets").toString()),
  vi.expect(t.eq(["Jesters do oft prove prophets"]).toString()).toMatchInlineSnapshot(`"string"`),
  vi.assertType<string>(t.eq([]).toString()),
  vi.expect(t.eq(["Jesters do oft prove prophets"]).toString()).toMatchInlineSnapshot(`"string"`),
  vi.assertType<string>(t.eq({}).toString())
))

vi.it('〖⛳️〗› ❲t.optional(...).toString❳', () => (
  vi.expect(t.optional(t.string).toString()).toMatchInlineSnapshot(`"(string | undefined)"`),
  vi.expect(t.optional(t.optional(t.string)).toString()).toMatchInlineSnapshot(`"((string | undefined) | undefined)"`),
  vi.expect(t.optional(t.object({ a: t.optional(t.null) })).toString()).toMatchInlineSnapshot(`"({ 'a'?: (null | undefined) } | undefined)"`)
))

vi.it('〖⛳️〗› ❲t.array(...).toString❳', () => (
  vi.expect(t.array(t.null).toString()).toMatchInlineSnapshot(`"(null)[]"`),
  vi.assertType<'(null)[]'>(t.array(t.null).toString()),
  vi.expect(t.array(t.array(t.null)).toString()).toMatchInlineSnapshot(`"((null)[])[]"`),
  vi.assertType<'((null)[])[]'>(t.array(t.array(t.null)).toString()),
  vi.expect(t.array(t.array(t.array(t.number))).toString()).toMatchInlineSnapshot(`"(((number)[])[])[]"`),
  vi.assertType<'(((number)[])[])[]'>(t.array(t.array(t.array(t.number))).toString())
))

vi.it('〖⛳️〗› ❲t.record(...).toString❳', () => (
  vi.expect(t.record(t.null).toString()).toMatchInlineSnapshot(`"Record<string, null>"`),
  vi.assertType(t.record(t.null).toString()),
  vi.expect(t.record(t.record(t.null)).toString()).toMatchInlineSnapshot(`"Record<string, Record<string, null>>"`),
  vi.assertType<"Record<string, null>">(t.record(t.null).toString()),
  vi.expect(t.record(t.record(t.number)).toString()).toMatchInlineSnapshot(`"Record<string, Record<string, number>>"`),
  vi.assertType<"Record<string, Record<string, null>>">(t.record(t.record((t.null))).toString()),
  vi.expect(t.record(t.record(t.record(t.number))).toString()).toMatchInlineSnapshot(`"Record<string, Record<string, Record<string, number>>>"`),
  vi.assertType<"Record<string, Record<string, Record<string, null>>>">(t.record(t.record(t.record((t.null)))).toString())
))

vi.it('〖⛳️〗› ❲t.union(...).toString❳', () => (
  vi.expect(t.union().toString()).toMatchInlineSnapshot(`"never"`),
  vi.assertType<'never'>(t.union().toString()),
  vi.expect(t.union(t.number).toString()).toMatchInlineSnapshot(`"(number)"`),
  vi.assertType<'(number)'>(t.union(t.number).toString()),
  vi.expect(t.union(t.number, t.string).toString()).toMatchInlineSnapshot(`"(number | string)"`),
  vi.assertType<'(number | string)'>(t.union(t.number, t.string).toString()),
  vi.expect(t.union(t.union()).toString()).toMatchInlineSnapshot(`"(never)"`),
  vi.assertType<'(never)'>(t.union(t.union()).toString()),
  vi.expect(t.union(t.union(t.number, t.string), t.union()).toString()).toMatchInlineSnapshot(`"((number | string) | never)"`),
  vi.assertType<'((number | string) | never)'>(t.union(t.union(t.number, t.string), t.union()).toString()),
  vi.expect(t.union(t.union(t.eq(0), t.eq(1)), t.union(t.eq(2), t.eq(3))).toString()).toMatchInlineSnapshot(`"((0 | 1) | (2 | 3))"`),
  vi.assertType<'((0 | 1) | (2 | 3))'>(t.union(t.union(t.eq(0), t.eq(1)), t.union(t.eq(2), t.eq(3))).toString()),
  vi.expect(t.union(t.union(t.eq(0), t.eq(1)), t.union(t.eq(2), t.eq(3)), t.union(t.union(t.eq(4), t.eq(5), t.union(t.eq(6), t.eq(7))))).toString())
    .toMatchInlineSnapshot(`"((0 | 1) | (2 | 3) | ((4 | 5 | (6 | 7))))"`),
  vi.assertType<'((0 | 1) | (2 | 3) | ((4 | 5 | (6 | 7))))'>(
    t.union(t.union(t.eq(0), t.eq(1)), t.union(t.eq(2), t.eq(3)), t.union(t.union(t.eq(4), t.eq(5), t.union(t.eq(6), t.eq(7))))).toString()
  )
))

vi.it('〖⛳️〗› ❲t.intersect(...).toString❳', () => (
  vi.expect(t.intersect().toString()).toMatchInlineSnapshot(`"unknown"`),
  vi.assertType<'unknown'>(t.intersect().toString()),
  vi.expect(t.intersect(t.number).toString()).toMatchInlineSnapshot(`"(number)"`),
  vi.assertType<'(number)'>(t.intersect(t.number).toString()),
  vi.expect(t.intersect(t.number, t.string).toString()).toMatchInlineSnapshot(`"(number & string)"`),
  vi.assertType<'(number & string)'>(t.intersect(t.number, t.string).toString()),
  vi.expect(t.intersect(t.intersect()).toString()).toMatchInlineSnapshot(`"(unknown)"`),
  vi.assertType<'(unknown)'>(t.intersect(t.intersect()).toString()),
  vi.expect(t.intersect(t.intersect(t.number, t.string), t.intersect()).toString()).toMatchInlineSnapshot(`"((number & string) & unknown)"`),
  vi.assertType<'((number & string) & unknown)'>(t.intersect(t.intersect(t.number, t.string), t.intersect()).toString()),
  vi.expect(t.intersect(t.intersect(t.eq(0), t.eq(1)), t.intersect(t.eq(2), t.eq(3))).toString()).toMatchInlineSnapshot(`"((0 & 1) & (2 & 3))"`),
  vi.assertType<'((0 & 1) & (2 & 3))'>(t.intersect(t.intersect(t.eq(0), t.eq(1)), t.intersect(t.eq(2), t.eq(3))).toString()),
  vi.expect(t.intersect(t.intersect(t.eq(0), t.eq(1)), t.intersect(t.eq(2), t.eq(3)), t.intersect(t.intersect(t.eq(4), t.eq(5), t.intersect(t.eq(6), t.eq(7))))).toString())
    .toMatchInlineSnapshot(`"((0 & 1) & (2 & 3) & ((4 & 5 & (6 & 7))))"`),
  vi.assertType<'((0 & 1) & (2 & 3) & ((4 & 5 & (6 & 7))))'>(
    t.intersect(t.intersect(t.eq(0), t.eq(1)), t.intersect(t.eq(2), t.eq(3)), t.intersect(t.intersect(t.eq(4), t.eq(5), t.intersect(t.eq(6), t.eq(7))))).toString()
  )
))

vi.it('〖⛳️〗› ❲t.tuple(...).toString❳', () => {
  vi.expect(t.tuple().toString()).toMatchInlineSnapshot(`"[]"`)
  vi.assertType<'[]'>(t.tuple().toString())
  vi.expect(t.tuple(t.eq(1), t.eq(2), t.eq(3)).toString()).toMatchInlineSnapshot(`"[1, 2, 3]"`)
  // vi.assertType<'[1, 2, 3]'>(t.tuple(t.eq(1), t.eq(2), t.eq(3)).toString())
  vi.expect(t.tuple(t.boolean, t.integer, t.tuple(t.undefined, t.void)).toString()).toMatchInlineSnapshot(`"[boolean, number, [undefined, void]]"`)
  vi.assertType<'[boolean, number, [undefined, void]]'>(t.tuple(t.boolean, t.integer, t.tuple(t.undefined, t.void)).toString())
  vi.expect(t.tuple(t.tuple(t.tuple(), t.tuple()), t.tuple(t.tuple(), t.tuple())).toString()).toMatchInlineSnapshot(`"[[[], []], [[], []]]"`)
  vi.assertType<'[[[], []], [[], []]]'>(t.tuple(t.tuple(t.tuple(), t.tuple()), t.tuple(t.tuple(), t.tuple())).toString())

  vi.expect(t.tuple(t.tuple(), t.tuple(t.tuple(), t.optional(t.tuple())), t.optional(t.tuple(t.optional(t.tuple()), t.optional(t.tuple())))).toString())
    .toMatchInlineSnapshot(`"[[], [[], _?: ([] | undefined)], _?: ([_?: ([] | undefined), _?: ([] | undefined)] | undefined)]"`)

  vi.assertType<"[[], [[], _?: ([] | undefined)], _?: ([_?: ([] | undefined), _?: ([] | undefined)] | undefined)]">(
    t.tuple(t.tuple(), t.tuple(t.tuple(), t.optional(t.tuple())), t.optional(t.tuple(t.optional(t.tuple()), t.optional(t.tuple())))).toString()
  )

  vi.assertType<[ᵃ: [], ᵇ: [ᵃ: [], ᵇ?: []], ᶜ?: [ᵃ?: [], ᵇ?: []]]>(
    t.tuple(t.tuple(), t.tuple(t.tuple(), t.optional(t.tuple())), t.optional(t.tuple(t.optional(t.tuple()), t.optional(t.tuple()))))._type
  )
})

vi.it('〖⛳️〗› ❲t.object(...).toString❳', () => (
  vi.expect(t.object({}).toString()).toMatchInlineSnapshot(`"{}"`),
  vi.assertType<'{}'>(t.object({}).toString()),
  vi.expect(t.object({ a: t.eq('a'), b: t.eq('b'), c: t.eq('c'), d: t.eq('d'), e: t.eq('e') }).toString()).toMatchInlineSnapshot(`"{ 'a': 'a', 'b': 'b', 'c': 'c', 'd': 'd', 'e': 'e' }"`),
  vi.assertType<"{ 'a': 'a', 'b': 'b', 'c': 'c', 'd': 'd', 'e': 'e' }">(t.object({ a: t.eq('a'), b: t.eq('b'), c: t.eq('c'), d: t.eq('d'), e: t.eq('e') }).toString()),

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
    }).toString()
  ).toMatchInlineSnapshot(`"{ 'a': { 'b': { 'c': 'a.b.c', 'd': 'a.b.d' }, 'e': { 'f': 'a.e.f', 'g': 'a.e.g' } }, 'h': { 'i': { 'j': 'h.i.j', 'k': 'h.i.k' }, 'l': { 'm': 'h.l.m', 'n': 'h.l.n' } } }"`),

  vi.assertType<"{ 'a': { 'b': { 'c': 'a.b.c', 'd': 'a.b.d' }, 'e': { 'f': 'a.e.f', 'g': 'a.e.g' } }, 'h': { 'i': { 'j': 'h.i.j', 'k': 'h.i.k' }, 'l': { 'm': 'h.l.m', 'n': 'h.l.n' } } }">(
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
    }).toString()
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
    }).toString()
  ).toMatchInlineSnapshot(`"{ 'a': { 'b': { 'c'?: ('a.b.c' | undefined), 'd': 'a.b.d' }, 'e'?: ({ 'f': 'a.e.f', 'g'?: ('a.e.g' | undefined) } | undefined) }, 'h'?: ({ 'i'?: ({ 'j': 'h.i.j', 'k'?: ('h.i.k' | undefined) } | undefined), 'l': { 'm'?: ('h.l.m' | undefined), 'n': 'h.l.n' } } | undefined) }"`),

  vi.assertType<`{ 'a': { 'b': { 'c'?: ('a.b.c' | undefined), 'd': 'a.b.d' }, 'e'?: ({ 'f': 'a.e.f', 'g'?: ('a.e.g' | undefined) } | undefined) }, 'h'?: ({ 'i'?: ({ 'j': 'h.i.j', 'k'?: ('h.i.k' | undefined) } | undefined), 'l': { 'm'?: ('h.l.m' | undefined), 'n': 'h.l.n' } } | undefined) }`>(
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
    }).toString()
  )
))

vi.it('〖⛳️〗› ❲t.object.toString❳: stress tests', () => {
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

        .toString()
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
      .toString()

  ).toMatchInlineSnapshot(`"{ 'one': { 'one': 1, 'two': { 'one': 1, 'two': 2, 'three': { 'one': 1, 'two': 2, 'three': 3, 'four': { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10, 'eleven': { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10, 'eleven': 11, 'twelve': { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10, 'eleven': 11, 'twelve': 12, 'thirteen': { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10, 'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10, 'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': {} }, 'one_hundred': 100, 'two_hundred': 200, 'three_hundred': 300, 'four_hundred': 400, 'five_hundred': 500, 'six_hundred': 600, 'seven_hundred': 700, 'eight_hundred': 800, 'nine_hundred': 900, 'one_thousand': 1000, 'eleven_hundred': 1100, 'twelve_hundred': 1200, 'thirteen_hundred': 1300, 'fourteen_hundred': 1400 }, 'one_hundred': 100, 'two_hundred': 200, 'three_hundred': 300, 'four_hundred': 400, 'five_hundred': 500, 'six_hundred': 600, 'seven_hundred': 700, 'eight_hundred': 800, 'nine_hundred': 900, 'one_thousand': 1000, 'eleven_hundred': 1100, 'twelve_hundred': 1200, 'thirteen_hundred': 1300 }, 'one_hundred': 100, 'two_hundred': 200, 'three_hundred': 300, 'four_hundred': 400, 'five_hundred': 500, 'six_hundred': 600, 'seven_hundred': 700, 'eight_hundred': 800, 'nine_hundred': 900, 'one_thousand': 1000, 'eleven_hundred': 1100, 'twelve_hundred': 1200 }, 'one_hundred': 100, 'two_hundred': 200, 'three_hundred': 300, 'four_hundred': 400, 'five_hundred': 500, 'six_hundred': 600, 'seven_hundred': 700, 'eight_hundred': 800, 'nine_hundred': 900, 'one_thousand': 1000, 'eleven_hundred': 1100 }, 'one_hundred': 100, 'two_hundred': 200, 'three_hundred': 300, 'four_hundred': 400, 'five_hundred': 500, 'six_hundred': 600, 'seven_hundred': 700, 'eight_hundred': 800, 'nine_hundred': 900, 'one_thousand': 1000 }, 'one_hundred': 100, 'two_hundred': 200, 'three_hundred': 300, 'four_hundred': 400, 'five_hundred': 500, 'six_hundred': 600, 'seven_hundred': 700, 'eight_hundred': 800, 'nine_hundred': 900 }, 'one_hundred': 100, 'two_hundred': 200, 'three_hundred': 300, 'four_hundred': 400, 'five_hundred': 500, 'six_hundred': 600, 'seven_hundred': 700, 'eight_hundred': 800 }, 'one_hundred': 100, 'two_hundred': 200, 'three_hundred': 300, 'four_hundred': 400, 'five_hundred': 500, 'six_hundred': 600, 'seven_hundred': 700 }, 'one_hundred': 100, 'two_hundred': 200, 'three_hundred': 300, 'four_hundred': 400, 'five_hundred': 500, 'six_hundred': 600 }, 'one_hundred': 100, 'two_hundred': 200, 'three_hundred': 300, 'four_hundred': 400, 'five_hundred': 500 }, 'one_hundred': 100, 'two_hundred': 200, 'three_hundred': 300, 'four_hundred': 400 }, 'one_hundred': 100, 'two_hundred': 200, 'three_hundred': 300 }, 'one_hundred': 100, 'two_hundred': 200 }, 'one_hundred': 100 }"`)

  vi.assertType<
    `{ '1': ['3'], '2': ['3'], '3': ['3'], '4': ['4'], '5': ['5'], '6': ['6'], '7': ['7'], '8': ['8'], '9': ['9'], '0.2': { '22': ['3', '+', '30'] }, '0.3': { '33': ['3', '+', '30'], '0.33': { '333': ['3', '+', '30', '300'] } }, '0.4': { '44': ['4', '+', '40'], '0.44': { '444': ['4', '+', '40', '400'], '0.444': { '4444': ['4', '+', '40', '+', '400', '+', '4000'] } } }, '0.5': { '55': ['5', '+', '50'], '0.55': { '555': ['5', '+', '50', '500'], '0.555': { '5555': ['5', '+', '50', '+', '500', '+', '5000'], '0.5555': { '55555': ['5', '+', '50', '+', '500', '+', '5000', '+', '50000'] } } } }, '0.6': { '66': ['6', '+', '60'], '0.66': { '666': ['6', '+', '60', '600'], '0.666': { '6666': ['6', '+', '60', '+', '600', '+', '6000'], '0.6666': { '66666': ['6', '+', '60', '+', '600', '+', '6000', '+', '60000'], '0.66666': { '666666': ['6', '+', '60', '+', '600', '+', '6000', '+', '60000', '+', '600000'] } } } } }, '0.7': { '77': ['7', '+', '70'], '0.77': { '777': ['7', '+', '70', '700'], '0.777': { '7777': ['7', '+', '70', '+', '700', '+', '7000'], '0.7777': { '77777': ['7', '+', '70', '+', '700', '+', '7000', '+', '70000'], '0.77777': { '777777': ['7', '+', '70', '+', '700', '+', '7000', '+', '70000', '+', '700000'], '0.777777': { '7777777': ['7', '+', '70', '+', '700', '+', '7000', '+', '70000', '+', '700000', '+', '7000000'] } } } } } }, '0.8': { '88': ['8', '+', '80'], '0.88': { '888': ['8', '+', '80', '800'], '0.888': { '8888': ['8', '+', '80', '+', '800', '+', '8000'], '0.8888': { '88888': ['8', '+', '80', '+', '800', '+', '8000', '+', '80000'], '0.88888': { '888888': ['8', '+', '80', '+', '800', '+', '8000', '+', '80000', '+', '800000'], '0.888888': { '8888888': ['8', '+', '80', '+', '800', '+', '8000', '+', '80000', '+', '800000', '+', '8000000'], '0.8888888': { '88888888': ['8', '+', '80', '+', '800', '+', '8000', '+', '80000', '+', '800000', '+', '8000000', '+', '80000000'], '0.88888888': { '888888888': ['8', '+', '80', '+', '800', '+', '8000', '+', '80000', '+', '800000', '+', '8000000', '+', '80000000', '+', '800000000'] } } } } } } } }, '0.9': { '99': ['9', '+', '90'], '0.99': { '999': ['9', '+', '90', '900'], '0.999': { '9999': ['9', '+', '90', '+', '900', '+', '9000'], '0.9999': { '99999': ['9', '+', '90', '+', '900', '+', '9000', '+', '90000'], '0.99999': { '999999': ['9', '+', '90', '+', '900', '+', '9000', '+', '90000', '+', '900000'], '0.999999': { '9999999': ['9', '+', '90', '+', '900', '+', '9000', '+', '90000', '+', '900000', '+', '9000000'], '0.9999999': { '99999999': ['9', '+', '90', '+', '900', '+', '9000', '+', '90000', '+', '900000', '+', '9000000', '+', '90000000'], '0.99999999': { '999999999': ['9', '+', '90', '+', '900', '+', '9000', '+', '90000', '+', '900000', '+', '9000000', '+', '90000000', '+', '900000000'], '0.999999999': { '9999999999': ['9', '+', '90', '+', '900', '+', '9000', '+', '90000', '+', '900000', '+', '9000000', '+', '90000000', '+', '900000000', '+', '9000000000'] } } } } } } } } } }`
  >(
    t.object({
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
    })

      .toString()
  )

  vi.assertType<t.object<{ 1: t.tuple<[t.eq<"3">]>; 2: t.tuple<[t.eq<"3">]>; 0.2: t.object<{ 22: t.tuple<[t.eq<"3">, t.eq<"+">, t.eq<"30">]>; }>; 3: t.tuple<[t.eq<"3">]>; 0.3: t.object<{ 33: t.tuple<[t.eq<"3">, t.eq<"+">, t.eq<"30">]>; 0.33: t.object<{ 333: t.tuple<[t.eq<"3">, t.eq<"+">, t.eq<"30">, t.eq<"300">]>; }>; }>; 4: t.tuple<[t.eq<"4">]>; 0.4: t.object<{ 44: t.tuple<[t.eq<"4">, t.eq<"+">, t.eq<"40">]>; 0.44: t.object<{ 444: t.tuple<[t.eq<"4">, t.eq<"+">, t.eq<"40">, t.eq<"400">]>; 0.444: t.object<{ 4444: t.tuple<[t.eq<"4">, t.eq<"+">, t.eq<"40">, t.eq<"+">, t.eq<"400">, t.eq<"+">, t.eq<"4000">]>; }>; }>; }>; 5: t.tuple<[t.eq<"5">]>; 0.5: t.object<{ 55: t.tuple<[t.eq<"5">, t.eq<"+">, t.eq<"50">]>; 0.55: t.object<{ 555: t.tuple<[t.eq<"5">, t.eq<"+">, t.eq<"50">, t.eq<"500">]>; 0.555: t.object<{ 5555: t.tuple<[t.eq<"5">, t.eq<"+">, t.eq<"50">, t.eq<"+">, t.eq<"500">, t.eq<"+">, t.eq<"5000">]>; 0.5555: t.object<{ 55555: t.tuple<[t.eq<"5">, t.eq<"+">, t.eq<"50">, t.eq<"+">, t.eq<"500">, t.eq<"+">, t.eq<"5000">, t.eq<"+">, t.eq<"50000">]>; }>; }>; }>; }>; 6: t.tuple<[t.eq<"6">]>; 0.6: t.object<{ 66: t.tuple<[t.eq<"6">, t.eq<"+">, t.eq<"60">]>; 0.66: t.object<{ 666: t.tuple<[t.eq<"6">, t.eq<"+">, t.eq<"60">, t.eq<"600">]>; 0.666: t.object<{ 6666: t.tuple<[t.eq<"6">, t.eq<"+">, t.eq<"60">, t.eq<"+">, t.eq<"600">, t.eq<"+">, t.eq<"6000">]>; 0.6666: t.object<{ 66666: t.tuple<[t.eq<"6">, t.eq<"+">, t.eq<"60">, t.eq<"+">, t.eq<"600">, t.eq<"+">, t.eq<"6000">, t.eq<"+">, t.eq<"60000">]>; 0.66666: t.object<{ 666666: t.tuple<[t.eq<"6">, t.eq<"+">, t.eq<"60">, t.eq<"+">, t.eq<"600">, t.eq<"+">, t.eq<"6000">, t.eq<"+">, t.eq<"60000">, t.eq<"+">, t.eq<"600000">]>; }>; }>; }>; }>; }>; 7: t.tuple<[t.eq<"7">]>; 0.7: t.object<{ 77: t.tuple<[t.eq<"7">, t.eq<"+">, t.eq<"70">]>; 0.77: t.object<{ 777: t.tuple<[t.eq<"7">, t.eq<"+">, t.eq<"70">, t.eq<"700">]>; 0.777: t.object<{ 7777: t.tuple<[t.eq<"7">, t.eq<"+">, t.eq<"70">, t.eq<"+">, t.eq<"700">, t.eq<"+">, t.eq<"7000">]>; 0.7777: t.object<{ 77777: t.tuple<[t.eq<"7">, t.eq<"+">, t.eq<"70">, t.eq<"+">, t.eq<"700">, t.eq<"+">, t.eq<"7000">, t.eq<"+">, t.eq<"70000">]>; 0.77777: t.object<{ 777777: t.tuple<[t.eq<"7">, t.eq<"+">, t.eq<"70">, t.eq<"+">, t.eq<"700">, t.eq<"+">, t.eq<"7000">, t.eq<"+">, t.eq<"70000">, t.eq<"+">, t.eq<"700000">]>; 0.777777: t.object<{ 7777777: t.tuple<[t.eq<"7">, t.eq<"+">, t.eq<"70">, t.eq<"+">, t.eq<"700">, t.eq<"+">, t.eq<"7000">, t.eq<"+">, t.eq<"70000">, t.eq<"+">, t.eq<"700000">, t.eq<"+">, t.eq<"7000000">]>; }>; }>; }>; }>; }>; }>; 8: t.tuple<[t.eq<"8">]>; 0.8: t.object<{ 88: t.tuple<[t.eq<"8">, t.eq<"+">, t.eq<"80">]>; 0.88: t.object<{ 888: t.tuple<[t.eq<"8">, t.eq<"+">, t.eq<"80">, t.eq<"800">]>; 0.888: t.object<{ 8888: t.tuple<[t.eq<"8">, t.eq<"+">, t.eq<"80">, t.eq<"+">, t.eq<"800">, t.eq<"+">, t.eq<"8000">]>; 0.8888: t.object<{ 88888: t.tuple<[t.eq<"8">, t.eq<"+">, t.eq<"80">, t.eq<"+">, t.eq<"800">, t.eq<"+">, t.eq<"8000">, t.eq<"+">, t.eq<"80000">]>; 0.88888: t.object<{ 888888: t.tuple<[t.eq<"8">, t.eq<"+">, t.eq<"80">, t.eq<"+">, t.eq<"800">, t.eq<"+">, t.eq<"8000">, t.eq<"+">, t.eq<"80000">, t.eq<"+">, t.eq<"800000">]>; 0.888888: t.object<{ 8888888: t.tuple<[t.eq<"8">, t.eq<"+">, t.eq<"80">, t.eq<"+">, t.eq<"800">, t.eq<"+">, t.eq<"8000">, t.eq<"+">, t.eq<"80000">, t.eq<"+">, t.eq<"800000">, t.eq<"+">, t.eq<"8000000">]>; 0.8888888: t.object<{ 88888888: t.tuple<[t.eq<"8">, t.eq<"+">, t.eq<"80">, t.eq<"+">, t.eq<"800">, t.eq<"+">, t.eq<"8000">, t.eq<"+">, t.eq<"80000">, t.eq<"+">, t.eq<"800000">, t.eq<"+">, t.eq<"8000000">, t.eq<"+">, t.eq<"80000000">]>; 0.88888888: t.object<{ 888888888: t.tuple<[t.eq<"8">, t.eq<"+">, t.eq<"80">, t.eq<"+">, t.eq<"800">, t.eq<"+">, t.eq<"8000">, t.eq<"+">, t.eq<"80000">, t.eq<"+">, t.eq<"800000">, t.eq<"+">, t.eq<"8000000">, t.eq<"+">, t.eq<"80000000">, t.eq<"+">, t.eq<"800000000">]>; }>; }>; }>; }>; }>; }>; }>; }>; 9: t.tuple<[t.eq<"9">]>; 0.9: t.object<{ 99: t.tuple<[t.eq<"9">, t.eq<"+">, t.eq<"90">]>; 0.99: t.object<{ 999: t.tuple<[t.eq<"9">, t.eq<"+">, t.eq<"90">, t.eq<"900">]>; 0.999: t.object<{ 9999: t.tuple<[t.eq<"9">, t.eq<"+">, t.eq<"90">, t.eq<"+">, t.eq<"900">, t.eq<"+">, t.eq<"9000">]>; 0.9999: t.object<{ 99999: t.tuple<[t.eq<"9">, t.eq<"+">, t.eq<"90">, t.eq<"+">, t.eq<"900">, t.eq<"+">, t.eq<"9000">, t.eq<"+">, t.eq<"90000">]>; 0.99999: t.object<{ 999999: t.tuple<[t.eq<"9">, t.eq<"+">, t.eq<"90">, t.eq<"+">, t.eq<"900">, t.eq<"+">, t.eq<"9000">, t.eq<"+">, t.eq<"90000">, t.eq<"+">, t.eq<"900000">]>; 0.999999: t.object<{ 9999999: t.tuple<[t.eq<"9">, t.eq<"+">, t.eq<"90">, t.eq<"+">, t.eq<"900">, t.eq<"+">, t.eq<"9000">, t.eq<"+">, t.eq<"90000">, t.eq<"+">, t.eq<"900000">, t.eq<"+">, t.eq<"9000000">]>; 0.9999999: t.object<{ 99999999: t.tuple<[t.eq<"9">, t.eq<"+">, t.eq<"90">, t.eq<"+">, t.eq<"900">, t.eq<"+">, t.eq<"9000">, t.eq<"+">, t.eq<"90000">, t.eq<"+">, t.eq<"900000">, t.eq<"+">, t.eq<"9000000">, t.eq<"+">, t.eq<"90000000">]>; 0.99999999: t.object<{ 999999999: t.tuple<[t.eq<"9">, t.eq<"+">, t.eq<"90">, t.eq<"+">, t.eq<"900">, t.eq<"+">, t.eq<"9000">, t.eq<"+">, t.eq<"90000">, t.eq<"+">, t.eq<"900000">, t.eq<"+">, t.eq<"9000000">, t.eq<"+">, t.eq<"90000000">, t.eq<"+">, t.eq<"900000000">]>; 0.999999999: t.object<{ 9999999999: t.tuple<[t.eq<"9">, t.eq<"+">, t.eq<"90">, t.eq<"+">, t.eq<"900">, t.eq<"+">, t.eq<"9000">, t.eq<"+">, t.eq<"90000">, t.eq<"+">, t.eq<"900000">, t.eq<"+">, t.eq<"9000000">, t.eq<"+">, t.eq<"90000000">, t.eq<"+">, t.eq<"900000000">, t.eq<"+">, t.eq<"9000000000">]>; }>; }>; }>; }>; }>; }>; }>; }>; }>; }>>(t.object({
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
  }).toString()).toMatchInlineSnapshot(
    `"{ '1': ['3'], '2': ['3'], '3': ['3'], '4': ['4'], '5': ['5'], '6': ['6'], '7': ['7'], '8': ['8'], '9': ['9'], '0.2': { '22': ['3', '+', '30'] }, '0.3': { '33': ['3', '+', '30'], '0.33': { '333': ['3', '+', '30', '300'] } }, '0.4': { '44': ['4', '+', '40'], '0.44': { '444': ['4', '+', '40', '400'], '0.444': { '4444': ['4', '+', '40', '+', '400', '+', '4000'] } } }, '0.5': { '55': ['5', '+', '50'], '0.55': { '555': ['5', '+', '50', '500'], '0.555': { '5555': ['5', '+', '50', '+', '500', '+', '5000'], '0.5555': { '55555': ['5', '+', '50', '+', '500', '+', '5000', '+', '50000'] } } } }, '0.6': { '66': ['6', '+', '60'], '0.66': { '666': ['6', '+', '60', '600'], '0.666': { '6666': ['6', '+', '60', '+', '600', '+', '6000'], '0.6666': { '66666': ['6', '+', '60', '+', '600', '+', '6000', '+', '60000'], '0.66666': { '666666': ['6', '+', '60', '+', '600', '+', '6000', '+', '60000', '+', '600000'] } } } } }, '0.7': { '77': ['7', '+', '70'], '0.77': { '777': ['7', '+', '70', '700'], '0.777': { '7777': ['7', '+', '70', '+', '700', '+', '7000'], '0.7777': { '77777': ['7', '+', '70', '+', '700', '+', '7000', '+', '70000'], '0.77777': { '777777': ['7', '+', '70', '+', '700', '+', '7000', '+', '70000', '+', '700000'], '0.777777': { '7777777': ['7', '+', '70', '+', '700', '+', '7000', '+', '70000', '+', '700000', '+', '7000000'] } } } } } }, '0.8': { '88': ['8', '+', '80'], '0.88': { '888': ['8', '+', '80', '800'], '0.888': { '8888': ['8', '+', '80', '+', '800', '+', '8000'], '0.8888': { '88888': ['8', '+', '80', '+', '800', '+', '8000', '+', '80000'], '0.88888': { '888888': ['8', '+', '80', '+', '800', '+', '8000', '+', '80000', '+', '800000'], '0.888888': { '8888888': ['8', '+', '80', '+', '800', '+', '8000', '+', '80000', '+', '800000', '+', '8000000'], '0.8888888': { '88888888': ['8', '+', '80', '+', '800', '+', '8000', '+', '80000', '+', '800000', '+', '8000000', '+', '80000000'], '0.88888888': { '888888888': ['8', '+', '80', '+', '800', '+', '8000', '+', '80000', '+', '800000', '+', '8000000', '+', '80000000', '+', '800000000'] } } } } } } } }, '0.9': { '99': ['9', '+', '90'], '0.99': { '999': ['9', '+', '90', '900'], '0.999': { '9999': ['9', '+', '90', '+', '900', '+', '9000'], '0.9999': { '99999': ['9', '+', '90', '+', '900', '+', '9000', '+', '90000'], '0.99999': { '999999': ['9', '+', '90', '+', '900', '+', '9000', '+', '90000', '+', '900000'], '0.999999': { '9999999': ['9', '+', '90', '+', '900', '+', '9000', '+', '90000', '+', '900000', '+', '9000000'], '0.9999999': { '99999999': ['9', '+', '90', '+', '900', '+', '9000', '+', '90000', '+', '900000', '+', '9000000', '+', '90000000'], '0.99999999': { '999999999': ['9', '+', '90', '+', '900', '+', '9000', '+', '90000', '+', '900000', '+', '9000000', '+', '90000000', '+', '900000000'], '0.999999999': { '9999999999': ['9', '+', '90', '+', '900', '+', '9000', '+', '90000', '+', '900000', '+', '9000000', '+', '90000000', '+', '900000000', '+', '9000000000'] } } } } } } } } } }"`

  )
})
