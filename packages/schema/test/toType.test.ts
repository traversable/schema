import * as vi from 'vitest'
import { recurse, t } from '@traversable/schema'

const defaultOptions = { typeName: 'Type' }

vi.describe(
  '〖⛳️〗‹‹‹ ❲@traverable/schema❳: recurse.toType',
  () => {
    vi.test('〖⛳️〗› ❲recurse.toType❳: throws when given a non-schema', () => {
      /* @ts-expect-error - bad input raises a TypeError */
      vi.assert.throws(() => recurse.toType(Symbol.for('BAD DATA')))
    })

    /////////////////////////
    /////    t.never    /////
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.never', () => {
      vi.expect.soft(recurse.toType(
        t.never,
        defaultOptions
      )).toMatchInlineSnapshot
        (`"type Type = never"`)
    })
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.never (w/ typeName)', () => {
      vi.expect.soft(recurse.toType(
        t.never,
        defaultOptions
      )).toMatchInlineSnapshot
        (`"type Type = never"`)
    })
    /////    t.never    /////
    /////////////////////////


    ///////////////////////////
    /////    t.unknown    /////
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.unknown', () => {
      vi.expect.soft(recurse.toType(
        t.unknown,
        defaultOptions
      )).toMatchInlineSnapshot
        (`"type Type = unknown"`)
    })
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.unknown (w/ typeName)', () => {
      vi.expect.soft(recurse.toType(
        t.unknown,
        defaultOptions
      )).toMatchInlineSnapshot
        (`"type Type = unknown"`)
    })
    /////    t.unknown    /////
    ///////////////////////////


    ///////////////////////
    /////    t.any    /////
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.any', () => {
      vi.expect.soft(recurse.toType(
        t.any,
        defaultOptions
      )).toMatchInlineSnapshot
        (`"type Type = any"`)
    })
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.any (w/ typeName)', () => {
      vi.expect.soft(recurse.toType(
        t.any,
        defaultOptions
      )).toMatchInlineSnapshot
        (`"type Type = any"`)
    })
    /////    t.any    /////
    ///////////////////////


    ////////////////////////
    /////    t.void    /////
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.void', () => {
      vi.expect.soft(recurse.toType(
        t.void,
      )).toMatchInlineSnapshot
        (`"void"`)
    })
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.void (w/ typeName)', () => {
      vi.expect.soft(recurse.toType(
        t.void,
        defaultOptions
      )).toMatchInlineSnapshot
        (`"type Type = void"`)
    })
    /////    t.void    /////
    ////////////////////////


    ////////////////////////
    /////    t.null    /////
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.null', () => {
      vi.expect.soft(recurse.toType(
        t.null,
      )).toMatchInlineSnapshot
        (`"null"`)
    })
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.null (w/ typeName)', () => {
      vi.expect.soft(recurse.toType(
        t.null,
        defaultOptions
      )).toMatchInlineSnapshot
        (`"type Type = null"`)
    })
    /////    t.null    /////
    ////////////////////////


    /////////////////////////////
    /////    t.undefined    /////
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.undefined', () => {
      vi.expect.soft(recurse.toType(
        t.undefined,
      )).toMatchInlineSnapshot
        (`"undefined"`)
    })
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.undefined (w/ typeName)', () => {
      vi.expect.soft(recurse.toType(
        t.undefined,
        defaultOptions
      )).toMatchInlineSnapshot
        (`"type Type = undefined"`)
    })
    /////    t.undefined    /////
    /////////////////////////////


    //////////////////////////
    /////    t.symbol    /////
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.symbol', () => {
      vi.expect.soft(recurse.toType(
        t.symbol,
      )).toMatchInlineSnapshot
        (`"symbol"`)
    })
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.symbol (w/ typeName)', () => {
      vi.expect.soft(recurse.toType(
        t.symbol,
        defaultOptions
      )).toMatchInlineSnapshot
        (`"type Type = symbol"`)
    })
    /////    t.symbol    /////
    //////////////////////////


    ///////////////////////////
    /////    t.boolean    /////
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.boolean', () => {
      vi.expect.soft(recurse.toType(
        t.boolean,
      )).toMatchInlineSnapshot
        (`"boolean"`)
    })
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.boolean (w/ typeName)', () => {
      vi.expect.soft(recurse.toType(
        t.boolean,
        defaultOptions
      )).toMatchInlineSnapshot
        (`"type Type = boolean"`)
    })
    /////    t.boolean    /////
    ///////////////////////////


    ///////////////////////////
    /////    t.integer    /////
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.integer', () => {
      vi.expect.soft(recurse.toType(
        t.integer,
      )).toMatchInlineSnapshot
        (`"number"`)
    })
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.integer (w/ typeName)', () => {
      vi.expect.soft(recurse.toType(
        t.integer,
        defaultOptions
      )).toMatchInlineSnapshot
        (`"type Type = number"`)
    })
    /////    t.integer    /////
    ///////////////////////////


    //////////////////////////
    /////    t.bigint    /////
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.bigint', () => {
      vi.expect.soft(recurse.toType(
        t.bigint,
      )).toMatchInlineSnapshot
        (`"bigint"`)
    })
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.bigint (w/ typeName)', () => {
      vi.expect.soft(recurse.toType(
        t.bigint,
        defaultOptions
      )).toMatchInlineSnapshot
        (`"type Type = bigint"`)
    })
    /////    t.bigint    /////
    //////////////////////////


    //////////////////////////
    /////    t.number    /////
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.number', () => {
      vi.expect.soft(recurse.toType(
        t.number,
      )).toMatchInlineSnapshot
        (`"number"`)
    })
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.number (bounds)', () => {
      vi.expect.soft(recurse.toType(
        t.number.min(0),
      )).toMatchInlineSnapshot
        (`"number"`)
      vi.expect.soft(recurse.toType(
        t.number.max(0),
      )).toMatchInlineSnapshot
        (`"number"`)
      vi.expect.soft(recurse.toType(
        t.number.min(0).max(1),
      )).toMatchInlineSnapshot
        (`"number"`)
      vi.expect.soft(recurse.toType(
        t.number.lessThan(1).min(0),
      )).toMatchInlineSnapshot
        (`"number"`)
      vi.expect.soft(recurse.toType(
        t.number.min(0).lessThan(1),
      )).toMatchInlineSnapshot
        (`"number"`)
      vi.expect.soft(recurse.toType(
        t.number.max(1).moreThan(0),
      )).toMatchInlineSnapshot
        (`"number"`)
      vi.expect.soft(recurse.toType(
        t.number.moreThan(0).max(1),
      )).toMatchInlineSnapshot
        (`"number"`)
      vi.expect.soft(recurse.toType(
        t.number.between(0, 1),
      )).toMatchInlineSnapshot
        (`"number"`)
      vi.expect.soft(recurse.toType(
        t.number.between(1, 0),
      )).toMatchInlineSnapshot
        (`"number"`)
    })
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.number (w/ typeName)', () => {
      vi.expect.soft(recurse.toType(
        t.number,
        defaultOptions
      )).toMatchInlineSnapshot
        (`"type Type = number"`)
    })
    /////    t.number    /////
    //////////////////////////


    //////////////////////////
    /////    t.string    /////
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.string', () => {
      vi.expect.soft(recurse.toType(
        t.string,
      )).toMatchInlineSnapshot
        (`"string"`)
    })
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.string (w/ typeName)', () => {
      vi.expect.soft(recurse.toType(
        t.string,
        defaultOptions
      )).toMatchInlineSnapshot
        (`"type Type = string"`)
    })
    /////    t.string    /////
    //////////////////////////


    /////////////////////////
    /////    t.array    /////
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.array', () => {
      vi.expect.soft(recurse.toType(
        t.array(t.string),
      )).toMatchInlineSnapshot
        (`"Array<string>"`)
    })
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.array (w/ typeName)', () => {
      vi.expect.soft(recurse.toType(
        t.array(t.string),
        defaultOptions
      )).toMatchInlineSnapshot
        (`"type Type = Array<string>"`)
    })
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.array (nested)', () => {
      vi.expect.soft(recurse.toType(
        t.array(
          t.object({
            a: t.string,
            b: t.integer,
            c: t.boolean,
            d: t.symbol,
            e: t.object({
              f: t.null,
            })
          })
        )
      )).toMatchInlineSnapshot
        (`"Array<{ a: string, b: number, c: boolean, d: symbol, e: { f: null } }>"`)
    })
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.array (w/ typeName, nested)', () => {
      vi.expect.soft(recurse.toType(
        t.array(
          t.object({
            a: t.string,
            b: t.integer,
            c: t.boolean,
            d: t.symbol,
            e: t.object({
              f: t.null,
            })
          })
        ),
        defaultOptions
      )).toMatchInlineSnapshot
        (`"type Type = Array<{ a: string, b: number, c: boolean, d: symbol, e: { f: null } }>"`)
    })
    /////    t.array    /////
    /////////////////////////


    //////////////////////////
    /////    t.record    /////
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.record', () => {
      vi.expect.soft(recurse.toType(
        t.record(t.string),
      )).toMatchInlineSnapshot
        (`"Record<string, string>"`)
    })
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.record (w/ typeName)', () => {
      vi.expect.soft(recurse.toType(
        t.record(t.string),
        defaultOptions
      )).toMatchInlineSnapshot
        (`"type Type = Record<string, string>"`)
    })
    /////    t.record    /////
    //////////////////////////


    ////////////////////////////
    /////    t.optional    /////
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.optional', () => {
      vi.expect.soft(recurse.toType(
        t.optional(t.string),
      )).toMatchInlineSnapshot
        (`"(undefined | string)"`)
    })
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.optional (w/ typeName)', () => {
      vi.expect.soft(recurse.toType(
        t.optional(t.string),
        defaultOptions
      )).toMatchInlineSnapshot
        (`"type Type = (undefined | string)"`)
    })
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.optional (w/ typeName)', () => {
      vi.expect.soft(recurse.toType(
        t.optional(t.optional(t.optional(t.optional(t.optional(t.optional(t.optional(t.optional(t.optional(t.string))))))))),
        defaultOptions
      )).toMatchInlineSnapshot
        (`"type Type = (undefined | (undefined | (undefined | (undefined | (undefined | (undefined | (undefined | (undefined | (undefined | string)))))))))"`)
    })
    /////    t.optional    /////
    ////////////////////////////


    //////////////////////
    /////    t.eq    /////
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.eq', () => {
      vi.expect.soft(recurse.toType(
        t.eq(100),
      )).toMatchInlineSnapshot
        (`"100"`)
    })
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.eq (w/ typeName)', () => {
      vi.expect.soft(recurse.toType(
        t.eq(100),
        defaultOptions
      )).toMatchInlineSnapshot
        (`"type Type = 100"`)
    })
    /////    t.eq    /////
    //////////////////////


    /////////////////////////
    /////    t.union    /////
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.union', () => {
      vi.expect.soft(recurse.toType(
        t.union(t.string, t.boolean),
      )).toMatchInlineSnapshot
        (`"(string | boolean)"`)
    })
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.union (empty)', () => {
      vi.expect.soft(recurse.toType(
        t.union(),
        defaultOptions
      )).toMatchInlineSnapshot
        (`"type Type = never"`)
    })
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.union (w/ typeName)', () => {
      vi.expect.soft(recurse.toType(
        t.union(t.string, t.boolean),
        defaultOptions
      )).toMatchInlineSnapshot
        (`"type Type = (string | boolean)"`)
    })
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.union (w/ typeName)', () => {
      vi.expect.soft(recurse.toType(
        t.union(t.union(t.union(t.union(t.union(t.union(t.union(t.union(t.union(t.union(t.string, t.boolean)))))))))),
        defaultOptions
      )).toMatchInlineSnapshot
        (`"type Type = ((((((((((string | boolean))))))))))"`)
    })
    /////    t.union    /////
    /////////////////////////


    /////////////////////////////
    /////    t.intersect    /////
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.intersect', () => {
      vi.expect.soft(recurse.toType(
        t.intersect(t.object({ a: t.string }), t.object({ b: t.boolean })),
      )).toMatchInlineSnapshot
        (`"({ a: string } & { b: boolean })"`)
    })
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.intersect (w/ typeName)', () => {
      vi.expect.soft(recurse.toType(
        t.intersect(t.object({ a: t.string }), t.object({ b: t.boolean })),
        defaultOptions
      )).toMatchInlineSnapshot
        (`"type Type = ({ a: string } & { b: boolean })"`)
    })
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.intersect (w/ typeName)', () => {
      vi.expect.soft(recurse.toType(
        t.intersect(t.intersect(t.intersect(t.intersect(t.intersect(t.object({ a: t.string }), t.object({ b: t.boolean })))))),
        defaultOptions
      )).toMatchInlineSnapshot
        (`"type Type = ((((({ a: string } & { b: boolean })))))"`)
    })
    /////    t.intersect    /////
    /////////////////////////////


    /////////////////////////
    /////    t.tuple    /////
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.tuple', () => {
      vi.expect.soft(recurse.toType(
        t.tuple(t.object({ a: t.string }), t.object({ b: t.boolean })),
      )).toMatchInlineSnapshot
        (`"[{ a: string }, { b: boolean }]"`)
    })
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.tuple (w/ typeName)', () => {
      vi.expect.soft(recurse.toType(
        t.tuple(t.object({ a: t.string }), t.object({ b: t.boolean })),
        defaultOptions
      )).toMatchInlineSnapshot
        (`"type Type = [{ a: string }, { b: boolean }]"`)
    })
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.tuple (w/ typeName)', () => {
      vi.expect.soft(recurse.toType(
        t.tuple(
          t.array(
            t.tuple(
              t.optional(
                t.union(
                  t.object({
                    a: t.string
                  }),
                  t.object({
                    b: t.boolean
                  }),
                )
              ),
              t.optional(
                t.object({
                  z: t.object({
                    c: t.object({
                      d: t.boolean,
                      e: t.integer,
                      f: t.number,
                      g: t.void,
                    })
                  })
                })
              )
            )
          ),
        ),
        defaultOptions
      )).toMatchInlineSnapshot
        (`"type Type = [Array<[({ a: string } | { b: boolean })?, { z: { c: { d: boolean, e: number, f: number, g: void } } }?]>]"`)
    })
    /////    t.tuple    /////
    /////////////////////////


    //////////////////////////
    /////    t.object    /////
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.object', () => {
      vi.expect.soft(recurse.toType(
        t.object({ a: t.string, b: t.optional(t.number) }),
      )).toMatchInlineSnapshot
        (`"{ a: string, b?: number }"`)
    })
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.object (empty)', () => {
      vi.expect.soft(recurse.toType(
        t.object({}),
      )).toMatchInlineSnapshot
        (`"{}"`)
    })
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.object (w/ typeName)', () => {
      vi.expect.soft(recurse.toType(
        t.object({ a: t.string, b: t.optional(t.number) }),

      )).toMatchInlineSnapshot
        (`"{ a: string, b?: number }"`)
    })
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.object (nested) object', () => {
      vi.expect.soft(recurse.toType(
        t.record(
          t.object({
            a: t.string,
            b: t.object({
              c: t.object({
                d: t.boolean,
                e: t.integer,
                f: t.number,
                g: t.void,
              })
            })
          })
        )
      )).toMatchInlineSnapshot
        (`"Record<string, { a: string, b: { c: { d: boolean, e: number, f: number, g: void } } }>"`)
    })
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.object (nested + w/ typeName)', () => {
      vi.expect.soft(recurse.toType(
        t.object({
          ROOT_A: t.record(
            t.object({
              a: t.string,
              b: t.object({
                c: t.object({
                  d: t.boolean,
                  e: t.integer,
                  f: t.number,
                  g: t.void,
                })
              })
            })
          ),
          ROOT_B: t.optional(t.unknown),
        }),
        defaultOptions
      )).toMatchInlineSnapshot
        (`"type Type = { ROOT_A: Record<string, { a: string, b: { c: { d: boolean, e: number, f: number, g: void } } }>, ROOT_B?: unknown }"`)
    })
    vi.test('〖⛳️〗› ❲recurse.toType❳: t.object (w/ typeName)', () => {
      vi.expect.soft(recurse.toType(
        t.object({
          a: t.object({
            b: t.eq(10_000),
            c: t.object({
              d: t.eq(9_000),
              e: t.object({
                f: t.eq(8_000),
                g: t.object({
                  h: t.eq(7_000),
                  i: t.object({
                    j: t.eq(6_000),
                    k: t.object({
                      l: t.eq(5_000),
                      m: t.object({
                        n: t.eq(4_000),
                        o: t.object({
                          p: t.eq(3_000),
                          q: t.object({
                            r: t.eq(2_000),
                            s: t.object({
                              t: t.eq(1_000),
                            })
                          })
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        }),
        defaultOptions,
      )).toMatchInlineSnapshot
        (`"type Type = { a: { b: 10000, c: { d: 9000, e: { f: 8000, g: { h: 7000, i: { j: 6000, k: { l: 5000, m: { n: 4000, o: { p: 3000, q: { r: 2000, s: { t: 1000 } } } } } } } } } } }"`)
    })
    /////    t.object    /////
    //////////////////////////
  }
)