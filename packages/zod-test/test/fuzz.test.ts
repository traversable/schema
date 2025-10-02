import * as vi from 'vitest'
import * as fc from 'fast-check'
import * as z from 'zod'
import { zxTest } from '@traversable/zod-test'

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/zod-test❳', () => {
  vi.test('〖️⛳️〗› ❲zxTest.fuzz❳: z.any override', () => {
    const [any] = fc.sample(fc.nat(), 1)
    const [data] = fc.sample(zxTest.fuzz(z.any(), void 0, { any: () => fc.constant(any) }), 1)
    vi.assert.strictEqual(data, any)
  })

  vi.test('〖️⛳️〗› ❲zxTest.fuzz❳: z.unknown override', () => {
    const [unknown] = fc.sample(fc.nat(), 1)
    const [data] = fc.sample(zxTest.fuzz(z.unknown(), void 0, { unknown: () => fc.constant(unknown) }), 1)
    vi.assert.strictEqual(data, unknown)
  })

  vi.test('〖️⛳️〗› ❲zxTest.fuzz❳: z.never override', () => {
    const [never] = fc.sample(fc.constant(void 0 as never), 1)
    const [data] = fc.sample(zxTest.fuzz(z.never(), void 0, { never: () => fc.constant(never) }), 1)
    vi.assert.strictEqual(data, never)
  })

  vi.test('〖️⛳️〗› ❲zxTest.fuzz❳: z.void override', () => {
    const [void_] = fc.sample(fc.constant(void 0), 1)
    const [data] = fc.sample(zxTest.fuzz(z.void(), void 0, { void: () => fc.constant(void_) }), 1)
    vi.assert.strictEqual(data, void_)
  })

  vi.test('〖️⛳️〗› ❲zxTest.fuzz❳: z.undefined override', () => {
    const [undefined_] = fc.sample(fc.constant(void 0), 1)
    const [data] = fc.sample(zxTest.fuzz(z.undefined(), void 0, { undefined: () => fc.constant(undefined_) }), 1)
    vi.assert.strictEqual(data, undefined_)
  })

  vi.test('〖️⛳️〗› ❲zxTest.fuzz❳: z.null override', () => {
    const [null_] = fc.sample(fc.constant(null), 1)
    const [data] = fc.sample(zxTest.fuzz(z.null(), void 0, { null: () => fc.constant(null_) }), 1)
    vi.assert.strictEqual(data, null_)
  })

  vi.test('〖️⛳️〗› ❲zxTest.fuzz❳: z.boolean override', () => {
    const [boolean] = fc.sample(fc.boolean(), 1)
    const [data] = fc.sample(zxTest.fuzz(z.boolean(), void 0, { boolean: () => fc.constant(boolean) }), 1)
    vi.assert.strictEqual(data, boolean)
  })

  vi.test('〖️⛳️〗› ❲zxTest.fuzz❳: z.symbol override', () => {
    const [symbol] = fc.sample(fc.string().map(Symbol.for), 1)
    const [data] = fc.sample(zxTest.fuzz(z.symbol(), void 0, { symbol: () => fc.constant(symbol) }), 1)
    vi.assert.strictEqual(data, symbol)
  })

  vi.test('〖️⛳️〗› ❲zxTest.fuzz❳: z.nan override', () => {
    const [nan] = fc.sample(fc.constant(Infinity), 1)
    const [data] = fc.sample(zxTest.fuzz(z.nan(), void 0, { nan: () => fc.constant(nan) }), 1)
    vi.assert.strictEqual(data, nan)
  })

  vi.test('〖️⛳️〗› ❲zxTest.fuzz❳: z.int override', () => {
    const [int] = fc.sample(fc.integer(), 1)
    const [data] = fc.sample(zxTest.fuzz(z.int(), void 0, { int: () => fc.constant(int) }), 1)
    vi.assert.strictEqual(data, int)
  })

  vi.test('〖️⛳️〗› ❲zxTest.fuzz❳: z.number override', () => {
    const [double] = fc.sample(fc.double({ noNaN: true }), 1)
    const [data] = fc.sample(zxTest.fuzz(z.number(), void 0, { number: () => fc.constant(double) }), 1)
    vi.assert.strictEqual(data, double)
  })

  vi.test('〖️⛳️〗› ❲zxTest.fuzz❳: z.string override', () => {
    const [string] = fc.sample(fc.string(), 1)
    const [data] = fc.sample(zxTest.fuzz(z.string(), void 0, { string: () => fc.constant(string) }), 1)
    vi.assert.strictEqual(data, string)
  })

  vi.test('〖️⛳️〗› ❲zxTest.fuzz❳: z.date override', () => {
    const [date] = fc.sample(fc.date(), 1)
    const [data] = fc.sample(zxTest.fuzz(z.date(), void 0, { date: () => fc.constant(date) }), 1)
    vi.assert.strictEqual(data, date)
  })

  vi.test('〖️⛳️〗› ❲zxTest.fuzz❳: z.file override', () => {
    const [file] = fc.sample(fc.constant(new File([], '')), 1)
    const [data] = fc.sample(zxTest.fuzz(z.file(), void 0, { file: () => fc.constant(file) }), 1)
    vi.assert.strictEqual(data, file)
  })

  vi.test('〖️⛳️〗› ❲zxTest.fuzz❳: z.literal override', () => {
    const [literal] = fc.sample(fc.constant('hey'), 1)
    const [data] = fc.sample(zxTest.fuzz(z.literal('blah'), void 0, { literal: () => fc.constant(literal) }), 1)
    vi.assert.strictEqual(data, literal)
  })

  vi.test('〖️⛳️〗› ❲zxTest.fuzz❳: z.templateLiteral override', () => {
    const [templateLiteral] = fc.sample(fc.constant('hey'), 1)
    const [data] = fc.sample(zxTest.fuzz(z.templateLiteral(['blah']), void 0, { template_literal: () => fc.constant(templateLiteral) }), 1)
    vi.assert.strictEqual(data, templateLiteral)
  })

  vi.test('〖️⛳️〗› ❲zxTest.fuzz❳: z.enum override', () => {
    const [enum_] = fc.sample(fc.constant('hey'), 1)
    const [data] = fc.sample(zxTest.fuzz(z.enum(['blah']), void 0, { enum: () => fc.constant(enum_) }), 1)
    vi.assert.strictEqual(data, enum_)
  })

  vi.test('〖️⛳️〗› ❲zxTest.fuzz❳: z.array override', () => {
    const [array] = fc.sample(fc.constant(['hey'] satisfies string[]), 1)
    const [data] = fc.sample(zxTest.fuzz(z.array(z.string()), void 0, { array: () => fc.constant(array) }), 1)
    vi.assert.strictEqual(data, array)
  })

  vi.test('〖️⛳️〗› ❲zxTest.fuzz❳: z.lazy override', () => {
    const [lazy] = fc.sample(fc.constant('hey'), 1)
    const [data] = fc.sample(zxTest.fuzz(z.lazy(() => z.string()), void 0, { lazy: () => fc.constant(lazy) }), 1)
    vi.assert.strictEqual(data, lazy)
  })

  vi.test('〖️⛳️〗› ❲zxTest.fuzz❳: z.optional override', () => {
    const [optional] = fc.sample(fc.constant(undefined), 1)
    const [data] = fc.sample(zxTest.fuzz(z.optional(z.string()), void 0, { optional: () => fc.constant(optional) }), 1)
    vi.assert.strictEqual(data, optional)
  })

  vi.test('〖️⛳️〗› ❲zxTest.fuzz❳: z.nonoptional override', () => {
    const [nonoptional] = fc.sample(fc.constant(undefined), 1)
    const [data] = fc.sample(zxTest.fuzz(z.nonoptional(z.string()), void 0, { nonoptional: () => fc.constant(nonoptional) }), 1)
    vi.assert.strictEqual(data, nonoptional)
  })

  vi.test('〖️⛳️〗› ❲zxTest.fuzz❳: z.nullable override', () => {
    const [nullable] = fc.sample(fc.constant(undefined), 1)
    const [data] = fc.sample(zxTest.fuzz(z.nullable(z.string()), void 0, { nullable: () => fc.constant(nullable) }), 1)
    vi.assert.strictEqual(data, nullable)
  })

  vi.test('〖️⛳️〗› ❲zxTest.fuzz❳: z.set override', () => {
    const [set] = fc.sample(fc.constant(new Set), 1)
    const [data] = fc.sample(zxTest.fuzz(z.set(z.string()), void 0, { set: () => fc.constant(set) }), 1)
    vi.assert.strictEqual(data, set)
  })

  vi.test('〖️⛳️〗› ❲zxTest.fuzz❳: z.map override', () => {
    const staticMap = new Map()
    const [map] = fc.sample(fc.constant(staticMap), 1)
    const [data] = fc.sample(zxTest.fuzz(z.map(z.string(), z.string()), void 0, { map: () => fc.constant(map) }), 1)
    vi.assert.strictEqual(data, map)
  })

  vi.test('〖️⛳️〗› ❲zxTest.fuzz❳: z.record override', () => {
    const [record] = fc.sample(fc.constant({}), 1)
    const [data] = fc.sample(zxTest.fuzz(z.record(z.string(), z.string()), void 0, { record: () => fc.constant(record) }), 1)
    vi.assert.strictEqual(data, record)
  })

  vi.test('〖️⛳️〗› ❲zxTest.fuzz❳: z.object override', () => {
    const [object] = fc.sample(fc.constant({}), 1)
    const [data] = fc.sample(zxTest.fuzz(z.object({}), void 0, { object: () => fc.constant(object) }), 1)
    vi.assert.strictEqual(data, object)
  })

  vi.test('〖️⛳️〗› ❲zxTest.fuzz❳: z.tuple override', () => {
    const [tuple] = fc.sample(fc.constant([] satisfies []), 1)
    const [data] = fc.sample(zxTest.fuzz(z.tuple([]), void 0, { tuple: () => fc.constant(tuple) }), 1)
    vi.assert.strictEqual(data, tuple)
  })

  vi.test('〖️⛳️〗› ❲zxTest.fuzz❳: z.union override', () => {
    const [union] = fc.sample(fc.constant('hello'), 1)
    const [data] = fc.sample(zxTest.fuzz(z.union([z.string()]), void 0, { union: () => fc.constant(union) }), 1)
    vi.assert.strictEqual(data, union)
  })

  vi.test('〖️⛳️〗› ❲zxTest.fuzz❳: z.intersection override', () => {
    const [intersection] = fc.sample(fc.constant({}), 1)
    const [data] = fc.sample(zxTest.fuzz(z.intersection(z.object({}), z.object({})), void 0, { intersection: () => fc.constant(intersection) }), 1)
    vi.assert.strictEqual(data, intersection)
  })

  vi.test('〖️⛳️〗› ❲zxTest.fuzz❳: z.catch override', () => {
    const [catch_] = fc.sample(fc.constant({}), 1)
    const [data] = fc.sample(zxTest.fuzz(z.catch(z.object({}), {}), void 0, { catch: () => fc.constant(catch_) }), 1)
    vi.assert.strictEqual(data, catch_)
  })

  vi.test('〖️⛳️〗› ❲zxTest.fuzz❳: z.default override', () => {
    const [default_] = fc.sample(fc.constant({}), 1)
    const [data] = fc.sample(zxTest.fuzz(z.object({}).default({}), void 0, { default: () => fc.constant(default_) }), 1)
    vi.assert.strictEqual(data, default_)
  })

  vi.test('〖️⛳️〗› ❲zxTest.fuzz❳: z.prefault override', () => {
    const [prefault] = fc.sample(fc.constant({}), 1)
    const [data] = fc.sample(zxTest.fuzz(z.object({}).prefault({}), void 0, { prefault: () => fc.constant(prefault) }), 1)
    vi.assert.strictEqual(data, prefault)
  })

  vi.test('〖️⛳️〗› ❲zxTest.fuzz❳: z.transform override', () => {
    const [transform] = fc.sample(fc.constant(z.any()), 1)
    const [data] = fc.sample(zxTest.fuzz(z.transform(() => ({})), void 0, { transform: () => fc.constant(transform) }), 1)
    vi.assert.strictEqual(data, transform)
  })

  vi.test('〖️⛳️〗› ❲zxTest.fuzz❳: z.pipe override', () => {
    const [pipe] = fc.sample(fc.constant({}), 1)
    const [data] = fc.sample(zxTest.fuzz(z.pipe(z.object({}), z.object({})), void 0, { pipe: () => fc.constant(pipe) }), 1)
    vi.assert.strictEqual(data, pipe)
  })

  vi.test('〖️⛳️〗› ❲zxTest.fuzz❳: z.promise override', async () => {
    const promises = fc.sample(fc.constant(Promise.resolve(42)), 1)
    const [promise] = await Promise.all(promises)
    const [data] = fc.sample(zxTest.fuzz(z.promise(z.number()), void 0, { promise: () => fc.constant(promise) }), 1)
    vi.assert.strictEqual(data, promise)
  })
})
