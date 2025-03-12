import * as vi from 'vitest'

import { configure, Rec, t } from '@traversable/schema'

configure({
  schema: {
    optionalTreatment: 'treatUndefinedAndOptionalAsTheSame',
  }
})

const toString = Rec.toString

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema❳', () => {
  vi.it('〖⛳️〗› ❲t.toString❳', () => {
    vi.expect(toString(t.void)).toMatchInlineSnapshot(`"t.void"`)
    vi.expect(toString(t.never)).toMatchInlineSnapshot(`"t.never"`)
    vi.expect(toString(t.any)).toMatchInlineSnapshot(`"t.any"`)
    vi.expect(toString(t.unknown)).toMatchInlineSnapshot(`"t.unknown"`)
    vi.expect(toString(t.null)).toMatchInlineSnapshot(`"t.null"`)
    vi.expect(toString(t.undefined)).toMatchInlineSnapshot(`"t.undefined"`)
    vi.expect(toString(t.symbol)).toMatchInlineSnapshot(`"t.symbol"`)
    vi.expect(toString(t.boolean)).toMatchInlineSnapshot(`"t.boolean"`)
    vi.expect(toString(t.bigint)).toMatchInlineSnapshot(`"t.bigint"`)
    vi.expect(toString(t.number)).toMatchInlineSnapshot(`"t.number"`)
    vi.expect(toString(t.string)).toMatchInlineSnapshot(`"t.string"`)

    vi.expect(toString(t.optional(t.void))).toMatchInlineSnapshot(`"t.optional(t.void)"`)
    vi.expect(toString(t.optional(t.never))).toMatchInlineSnapshot(`"t.optional(t.never)"`)
    vi.expect(toString(t.optional(t.any))).toMatchInlineSnapshot(`"t.optional(t.any)"`)
    vi.expect(toString(t.optional(t.unknown))).toMatchInlineSnapshot(`"t.optional(t.unknown)"`)
    vi.expect(toString(t.optional(t.null))).toMatchInlineSnapshot(`"t.optional(t.null)"`)
    vi.expect(toString(t.optional(t.undefined))).toMatchInlineSnapshot(`"t.optional(t.undefined)"`)
    vi.expect(toString(t.optional(t.symbol))).toMatchInlineSnapshot(`"t.optional(t.symbol)"`)
    vi.expect(toString(t.optional(t.boolean))).toMatchInlineSnapshot(`"t.optional(t.boolean)"`)
    vi.expect(toString(t.optional(t.bigint))).toMatchInlineSnapshot(`"t.optional(t.bigint)"`)
    vi.expect(toString(t.optional(t.number))).toMatchInlineSnapshot(`"t.optional(t.number)"`)
    vi.expect(toString(t.optional(t.string))).toMatchInlineSnapshot(`"t.optional(t.string)"`)

    vi.expect(toString(t.array(t.void))).toMatchInlineSnapshot(`"t.array(t.void)"`)
    vi.expect(toString(t.array(t.never))).toMatchInlineSnapshot(`"t.array(t.never)"`)
    vi.expect(toString(t.array(t.any))).toMatchInlineSnapshot(`"t.array(t.any)"`)
    vi.expect(toString(t.array(t.unknown))).toMatchInlineSnapshot(`"t.array(t.unknown)"`)
    vi.expect(toString(t.array(t.null))).toMatchInlineSnapshot(`"t.array(t.null)"`)
    vi.expect(toString(t.array(t.undefined))).toMatchInlineSnapshot(`"t.array(t.undefined)"`)
    vi.expect(toString(t.array(t.symbol))).toMatchInlineSnapshot(`"t.array(t.symbol)"`)
    vi.expect(toString(t.array(t.boolean))).toMatchInlineSnapshot(`"t.array(t.boolean)"`)
    vi.expect(toString(t.array(t.bigint))).toMatchInlineSnapshot(`"t.array(t.bigint)"`)
    vi.expect(toString(t.array(t.number))).toMatchInlineSnapshot(`"t.array(t.number)"`)
    vi.expect(toString(t.array(t.string))).toMatchInlineSnapshot(`"t.array(t.string)"`)

    vi.expect(toString(t.record(t.void))).toMatchInlineSnapshot(`"t.record(t.void)"`)
    vi.expect(toString(t.record(t.never))).toMatchInlineSnapshot(`"t.record(t.never)"`)
    vi.expect(toString(t.record(t.any))).toMatchInlineSnapshot(`"t.record(t.any)"`)
    vi.expect(toString(t.record(t.unknown))).toMatchInlineSnapshot(`"t.record(t.unknown)"`)
    vi.expect(toString(t.record(t.null))).toMatchInlineSnapshot(`"t.record(t.null)"`)
    vi.expect(toString(t.record(t.undefined))).toMatchInlineSnapshot(`"t.record(t.undefined)"`)
    vi.expect(toString(t.record(t.symbol))).toMatchInlineSnapshot(`"t.record(t.symbol)"`)
    vi.expect(toString(t.record(t.boolean))).toMatchInlineSnapshot(`"t.record(t.boolean)"`)
    vi.expect(toString(t.record(t.bigint))).toMatchInlineSnapshot(`"t.record(t.bigint)"`)
    vi.expect(toString(t.record(t.number))).toMatchInlineSnapshot(`"t.record(t.number)"`)
    vi.expect(toString(t.record(t.string))).toMatchInlineSnapshot(`"t.record(t.string)"`)

    vi.expect(toString(t.union(t.void))).toMatchInlineSnapshot(`"t.union(t.void)"`)
    vi.expect(toString(t.union(t.never))).toMatchInlineSnapshot(`"t.union(t.never)"`)
    vi.expect(toString(t.union(t.any))).toMatchInlineSnapshot(`"t.union(t.any)"`)
    vi.expect(toString(t.union(t.unknown))).toMatchInlineSnapshot(`"t.union(t.unknown)"`)
    vi.expect(toString(t.union(t.null))).toMatchInlineSnapshot(`"t.union(t.null)"`)
    vi.expect(toString(t.union(t.undefined))).toMatchInlineSnapshot(`"t.union(t.undefined)"`)
    vi.expect(toString(t.union(t.symbol))).toMatchInlineSnapshot(`"t.union(t.symbol)"`)
    vi.expect(toString(t.union(t.boolean))).toMatchInlineSnapshot(`"t.union(t.boolean)"`)
    vi.expect(toString(t.union(t.bigint))).toMatchInlineSnapshot(`"t.union(t.bigint)"`)
    vi.expect(toString(t.union(t.number))).toMatchInlineSnapshot(`"t.union(t.number)"`)
    vi.expect(toString(t.union(t.string))).toMatchInlineSnapshot(`"t.union(t.string)"`)

    vi.expect(toString(t.union(t.void, t.never))).toMatchInlineSnapshot(`"t.union(t.void, t.never)"`)
    vi.expect(toString(t.union(t.never, t.never))).toMatchInlineSnapshot(`"t.union(t.never, t.never)"`)
    vi.expect(toString(t.union(t.any, t.never))).toMatchInlineSnapshot(`"t.union(t.any, t.never)"`)
    vi.expect(toString(t.union(t.unknown, t.never))).toMatchInlineSnapshot(`"t.union(t.unknown, t.never)"`)
    vi.expect(toString(t.union(t.null, t.never))).toMatchInlineSnapshot(`"t.union(t.null, t.never)"`)
    vi.expect(toString(t.union(t.undefined, t.never))).toMatchInlineSnapshot(`"t.union(t.undefined, t.never)"`)
    vi.expect(toString(t.union(t.symbol, t.never))).toMatchInlineSnapshot(`"t.union(t.symbol, t.never)"`)
    vi.expect(toString(t.union(t.boolean, t.never))).toMatchInlineSnapshot(`"t.union(t.boolean, t.never)"`)
    vi.expect(toString(t.union(t.bigint, t.never))).toMatchInlineSnapshot(`"t.union(t.bigint, t.never)"`)
    vi.expect(toString(t.union(t.number, t.never))).toMatchInlineSnapshot(`"t.union(t.number, t.never)"`)
    vi.expect(toString(t.union(t.string, t.never))).toMatchInlineSnapshot(`"t.union(t.string, t.never)"`)

    vi.expect(toString(t.intersect(t.void))).toMatchInlineSnapshot(`"t.intersect(t.void)"`)
    vi.expect(toString(t.intersect(t.never))).toMatchInlineSnapshot(`"t.intersect(t.never)"`)
    vi.expect(toString(t.intersect(t.any))).toMatchInlineSnapshot(`"t.intersect(t.any)"`)
    vi.expect(toString(t.intersect(t.unknown))).toMatchInlineSnapshot(`"t.intersect(t.unknown)"`)
    vi.expect(toString(t.intersect(t.null))).toMatchInlineSnapshot(`"t.intersect(t.null)"`)
    vi.expect(toString(t.intersect(t.undefined))).toMatchInlineSnapshot(`"t.intersect(t.undefined)"`)
    vi.expect(toString(t.intersect(t.symbol))).toMatchInlineSnapshot(`"t.intersect(t.symbol)"`)
    vi.expect(toString(t.intersect(t.boolean))).toMatchInlineSnapshot(`"t.intersect(t.boolean)"`)
    vi.expect(toString(t.intersect(t.bigint))).toMatchInlineSnapshot(`"t.intersect(t.bigint)"`)
    vi.expect(toString(t.intersect(t.number))).toMatchInlineSnapshot(`"t.intersect(t.number)"`)
    vi.expect(toString(t.intersect(t.string))).toMatchInlineSnapshot(`"t.intersect(t.string)"`)

    vi.expect(toString(t.intersect(t.void, t.never))).toMatchInlineSnapshot(`"t.intersect(t.void, t.never)"`)
    vi.expect(toString(t.intersect(t.never, t.never))).toMatchInlineSnapshot(`"t.intersect(t.never, t.never)"`)
    vi.expect(toString(t.intersect(t.any, t.never))).toMatchInlineSnapshot(`"t.intersect(t.any, t.never)"`)
    vi.expect(toString(t.intersect(t.unknown, t.never))).toMatchInlineSnapshot(`"t.intersect(t.unknown, t.never)"`)
    vi.expect(toString(t.intersect(t.null, t.never))).toMatchInlineSnapshot(`"t.intersect(t.null, t.never)"`)
    vi.expect(toString(t.intersect(t.undefined, t.never))).toMatchInlineSnapshot(`"t.intersect(t.undefined, t.never)"`)
    vi.expect(toString(t.intersect(t.symbol, t.never))).toMatchInlineSnapshot(`"t.intersect(t.symbol, t.never)"`)
    vi.expect(toString(t.intersect(t.boolean, t.never))).toMatchInlineSnapshot(`"t.intersect(t.boolean, t.never)"`)
    vi.expect(toString(t.intersect(t.bigint, t.never))).toMatchInlineSnapshot(`"t.intersect(t.bigint, t.never)"`)
    vi.expect(toString(t.intersect(t.number, t.never))).toMatchInlineSnapshot(`"t.intersect(t.number, t.never)"`)
    vi.expect(toString(t.intersect(t.string, t.never))).toMatchInlineSnapshot(`"t.intersect(t.string, t.never)"`)

    vi.expect(toString(t.tuple(t.void))).toMatchInlineSnapshot(`"t.tuple(t.void)"`)
    vi.expect(toString(t.tuple(t.never))).toMatchInlineSnapshot(`"t.tuple(t.never)"`)
    vi.expect(toString(t.tuple(t.any))).toMatchInlineSnapshot(`"t.tuple(t.any)"`)
    vi.expect(toString(t.tuple(t.unknown))).toMatchInlineSnapshot(`"t.tuple(t.unknown)"`)
    vi.expect(toString(t.tuple(t.null))).toMatchInlineSnapshot(`"t.tuple(t.null)"`)
    vi.expect(toString(t.tuple(t.undefined))).toMatchInlineSnapshot(`"t.tuple(t.undefined)"`)
    vi.expect(toString(t.tuple(t.symbol))).toMatchInlineSnapshot(`"t.tuple(t.symbol)"`)
    vi.expect(toString(t.tuple(t.boolean))).toMatchInlineSnapshot(`"t.tuple(t.boolean)"`)
    vi.expect(toString(t.tuple(t.bigint))).toMatchInlineSnapshot(`"t.tuple(t.bigint)"`)
    vi.expect(toString(t.tuple(t.number))).toMatchInlineSnapshot(`"t.tuple(t.number)"`)
    vi.expect(toString(t.tuple(t.string))).toMatchInlineSnapshot(`"t.tuple(t.string)"`)

    vi.expect(toString(t.tuple(t.void, t.never))).toMatchInlineSnapshot(`"t.tuple(t.void, t.never)"`)
    vi.expect(toString(t.tuple(t.never, t.never))).toMatchInlineSnapshot(`"t.tuple(t.never, t.never)"`)
    vi.expect(toString(t.tuple(t.any, t.never))).toMatchInlineSnapshot(`"t.tuple(t.any, t.never)"`)
    vi.expect(toString(t.tuple(t.unknown, t.never))).toMatchInlineSnapshot(`"t.tuple(t.unknown, t.never)"`)
    vi.expect(toString(t.tuple(t.null, t.never))).toMatchInlineSnapshot(`"t.tuple(t.null, t.never)"`)
    vi.expect(toString(t.tuple(t.undefined, t.never))).toMatchInlineSnapshot(`"t.tuple(t.undefined, t.never)"`)
    vi.expect(toString(t.tuple(t.symbol, t.never))).toMatchInlineSnapshot(`"t.tuple(t.symbol, t.never)"`)
    vi.expect(toString(t.tuple(t.boolean, t.never))).toMatchInlineSnapshot(`"t.tuple(t.boolean, t.never)"`)
    vi.expect(toString(t.tuple(t.bigint, t.never))).toMatchInlineSnapshot(`"t.tuple(t.bigint, t.never)"`)
    vi.expect(toString(t.tuple(t.number, t.never))).toMatchInlineSnapshot(`"t.tuple(t.number, t.never)"`)
    vi.expect(toString(t.tuple(t.string, t.never))).toMatchInlineSnapshot(`"t.tuple(t.string, t.never)"`)

    vi.expect(toString(t.object({ a: t.void }))).toMatchInlineSnapshot(`"t.object({ a: t.void })"`)
    vi.expect(toString(t.object({ a: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.never })"`)
    vi.expect(toString(t.object({ a: t.any }))).toMatchInlineSnapshot(`"t.object({ a: t.any })"`)
    vi.expect(toString(t.object({ a: t.unknown }))).toMatchInlineSnapshot(`"t.object({ a: t.unknown })"`)
    vi.expect(toString(t.object({ a: t.null }))).toMatchInlineSnapshot(`"t.object({ a: t.null })"`)
    vi.expect(toString(t.object({ a: t.undefined }))).toMatchInlineSnapshot(`"t.object({ a: t.undefined })"`)
    vi.expect(toString(t.object({ a: t.symbol }))).toMatchInlineSnapshot(`"t.object({ a: t.symbol })"`)
    vi.expect(toString(t.object({ a: t.boolean }))).toMatchInlineSnapshot(`"t.object({ a: t.boolean })"`)
    vi.expect(toString(t.object({ a: t.bigint }))).toMatchInlineSnapshot(`"t.object({ a: t.bigint })"`)
    vi.expect(toString(t.object({ a: t.number }))).toMatchInlineSnapshot(`"t.object({ a: t.number })"`)
    vi.expect(toString(t.object({ a: t.string }))).toMatchInlineSnapshot(`"t.object({ a: t.string })"`)

    vi.expect(toString(t.object({ a: t.void, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.void, b: t.never })"`)
    vi.expect(toString(t.object({ a: t.never, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.never, b: t.never })"`)
    vi.expect(toString(t.object({ a: t.any, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.any, b: t.never })"`)
    vi.expect(toString(t.object({ a: t.unknown, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.unknown, b: t.never })"`)
    vi.expect(toString(t.object({ a: t.null, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.null, b: t.never })"`)
    vi.expect(toString(t.object({ a: t.undefined, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.undefined, b: t.never })"`)
    vi.expect(toString(t.object({ a: t.symbol, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.symbol, b: t.never })"`)
    vi.expect(toString(t.object({ a: t.boolean, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.boolean, b: t.never })"`)
    vi.expect(toString(t.object({ a: t.bigint, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.bigint, b: t.never })"`)
    vi.expect(toString(t.object({ a: t.number, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.number, b: t.never })"`)
    vi.expect(toString(t.object({ a: t.string, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.string, b: t.never })"`)

    vi.expect(toString(t.eq(null))).toMatchInlineSnapshot(`"t.eq(null)"`)
    vi.expect(toString(t.eq(0))).toMatchInlineSnapshot(`"t.eq(0)"`)
    vi.expect(toString(t.eq(1e+29))).toMatchInlineSnapshot(`"t.eq(1e+29)"`)
    vi.expect(toString(t.eq("1.0"))).toMatchInlineSnapshot(`"t.eq("1.0")"`)
    vi.expect(toString(t.eq({ _: undefined }))).toMatchInlineSnapshot(`"t.eq({ _: undefined })"`)
    vi.expect(toString(t.eq({ _: null }))).toMatchInlineSnapshot(`"t.eq({ _: null })"`)
    vi.expect(toString(t.eq(null))).toMatchInlineSnapshot(`"t.eq(null)"`)
    vi.expect(toString(t.eq(0))).toMatchInlineSnapshot(`"t.eq(0)"`)
    vi.expect(toString(t.eq(1e+29))).toMatchInlineSnapshot(`"t.eq(1e+29)"`)
    vi.expect(toString(t.eq("1.0"))).toMatchInlineSnapshot(`"t.eq("1.0")"`)
    vi.expect(toString(t.eq([]))).toMatchInlineSnapshot(`"t.eq([])"`)
    vi.expect(toString(t.eq([undefined]))).toMatchInlineSnapshot(`"t.eq([undefined])"`)
    vi.expect(toString(t.eq([null]))).toMatchInlineSnapshot(`"t.eq([null])"`)
    vi.expect(toString(t.eq([[[]]]))).toMatchInlineSnapshot(`"t.eq([[[]]])"`)
    vi                                                                         /// TODO: look into missing `__proto__` property
      .expect(toString(t.eq({ '': undefined, _: undefined, '\\': undefined, ['__proto__']: undefined, ['toString']: undefined })))
      .toMatchInlineSnapshot(`"t.eq({ "": undefined, _: undefined, "\\\\": undefined, toString: undefined })"`)
    vi
      .expect(toString(t.eq({ '': null, _: null, '\\': null, ['__proto__']: null, ['toString']: null })))
      .toMatchInlineSnapshot(`"t.eq({ "": null, _: null, "\\\\": null, toString: null })"`)
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
    vi.assertType<
      | `{ 'a': 'a', 'b': 'b', 'c': 'c', 'd': 'd', 'e': 'e' }`
      | `{ 'd': 'd', 'e': 'e', 'a': 'a', 'b': 'b', 'c': 'c' }`
      | `{ 'c': 'c', 'd': 'd', 'e': 'e', 'a': 'a', 'b': 'b' }`
      | `{ 'b': 'b', 'c': 'c', 'd': 'd', 'e': 'e', 'a': 'a' }`
      | `{ 'e': 'e', 'a': 'a', 'b': 'b', 'c': 'c', 'd': 'd' }`
      | `{ 'e': 'e', 'a': 'a', 'b': 'b', 'd': 'd', 'c': 'c' }`
      | `{ 'e': 'e', 'a': 'a', 'c': 'c', 'b': 'b', 'd': 'd' }`
      | `{ 'e': 'e', 'a': 'a', 'c': 'c', 'd': 'd', 'b': 'b' }`
      | `{ 'e': 'e', 'a': 'a', 'd': 'd', 'b': 'b', 'c': 'c' }`
      | `{ 'e': 'e', 'a': 'a', 'd': 'd', 'c': 'c', 'b': 'b' }`
      | `{ 'e': 'e', 'b': 'b', 'a': 'a', 'c': 'c', 'd': 'd' }`
      | `{ 'e': 'e', 'b': 'b', 'c': 'c', 'd': 'd', 'a': 'a' }`
      | `{ 'e': 'e', 'd': 'd', 'a': 'a', 'b': 'b', 'c': 'c' }`
      | `{ 'e': 'e', 'c': 'c', 'd': 'd', 'a': 'a', 'b': 'b' }`
      | `{ 'd': 'd', 'e': 'e', 'a': 'a', 'b': 'b', 'c': 'c' }`
      | `{ 'c': 'c', 'd': 'd', 'e': 'e', 'a': 'a', 'b': 'b' }`
      | `{ 'b': 'b', 'c': 'c', 'd': 'd', 'e': 'e', 'a': 'a' }`
      | `{ 'b': 'b', 'c': 'c', 'a': 'a', 'e': 'e', 'd': 'd' }`
    >(
      t.object({
        a: t.eq('a'),
        b: t.eq('b'),
        c: t.eq('c'),
        d: t.eq('d'),
        e: t.eq('e'),
      }).toString()
    ),

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

    vi.assertType<

      | `{ 'a': { 'b': { 'c': 'a.b.c', 'd': 'a.b.d' }, 'e': { 'f': 'a.e.f', 'g': 'a.e.g' } }, 'h': { 'i': { 'j': 'h.i.j', 'k': 'h.i.k' }, 'l': { 'm': 'h.l.m', 'n': 'h.l.n' } } }`
      | `{ 'a': { 'b': { 'c': 'a.b.c', 'd': 'a.b.d' }, 'e': { 'f': 'a.e.f', 'g': 'a.e.g' } }, 'h': { 'l': { 'm': 'h.l.m', 'n': 'h.l.n' }, 'i': { 'k': 'h.i.k', 'j': 'h.i.j' } } }`

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

    vi.assertType<
      | `{ 'a': { 'b': { 'c'?: ('a.b.c' | undefined), 'd': 'a.b.d' }, 'e'?: ({ 'f': 'a.e.f', 'g'?: ('a.e.g' | undefined) } | undefined) }, 'h'?: ({ 'i'?: ({ 'j': 'h.i.j', 'k'?: ('h.i.k' | undefined) } | undefined), 'l': { 'm'?: ('h.l.m' | undefined), 'n': 'h.l.n' } } | undefined) }`
      | `{ 'a': { 'b': { 'c'?: ('a.b.c' | undefined), 'd': 'a.b.d' }, 'e'?: ({ 'f': 'a.e.f', 'g'?: ('a.e.g' | undefined) } | undefined) }, 'h'?: ({ 'l': { 'm'?: ('h.l.m' | undefined), 'n': 'h.l.n' }, 'i'?: ({ 'k'?: ('h.i.k' | undefined), 'j': 'h.i.j' } | undefined) } | undefined) }`
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
      }).toString()
    )
  ))

  vi.it('〖⛳️〗› ❲t.toString❳: edge cases that fast-check found', () => {
    const ex_01 = t.intersect(t.any, t.array(t.string)).toString()
    vi.assert.equal(ex_01, "(any & (string)[])");

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
      }).toString())
  })
})
