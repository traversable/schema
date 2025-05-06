import * as vi from 'vitest'
import { recurse, t } from '@traversable/schema'

vi.describe(
  '〖⛳️〗‹‹‹ ❲@traverable/schema❳: recurse.toType',
  () => {
    vi.it('〖⛳️〗› ❲recurse.toType❳: throws when given a non-schema', () => {
      /* @ts-expect-error - bad input raises a TypeError */
      vi.assert.throws(() => recurse.toType(Symbol.for('BAD DATA')))
    })

    /////////////////////////
    /////    t.never    /////
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.never', () => {
      vi.expect(recurse.toType(
        t.never,
      )).toMatchInlineSnapshot
        (`"never"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.never (formatted)', () => {
      vi.expect(recurse.toType(
        t.never,
        { format: true }
      )).toMatchInlineSnapshot
        (`"never"`)
    })
    /////    t.never    /////
    /////////////////////////


    ///////////////////////////
    /////    t.unknown    /////
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.unknown', () => {
      vi.expect(recurse.toType(
        t.unknown,
      )).toMatchInlineSnapshot
        (`"unknown"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.unknown (formatted)', () => {
      vi.expect(recurse.toType(
        t.unknown,
        { format: true }
      )).toMatchInlineSnapshot
        (`"unknown"`)
    })
    /////    t.unknown    /////
    ///////////////////////////


    ///////////////////////
    /////    t.any    /////
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.any', () => {
      vi.expect(recurse.toType(
        t.any,
      )).toMatchInlineSnapshot
        (`"any"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.any (formatted)', () => {
      vi.expect(recurse.toType(
        t.any,
        { format: true }
      )).toMatchInlineSnapshot
        (`"any"`)
    })
    /////    t.any    /////
    ///////////////////////


    ////////////////////////
    /////    t.void    /////
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.void', () => {
      vi.expect(recurse.toType(
        t.void,
      )).toMatchInlineSnapshot
        (`"void"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.void (formatted)', () => {
      vi.expect(recurse.toType(
        t.void,
        { format: true }
      )).toMatchInlineSnapshot
        (`"void"`)
    })
    /////    t.void    /////
    ////////////////////////


    ////////////////////////
    /////    t.null    /////
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.null', () => {
      vi.expect(recurse.toType(
        t.null,
      )).toMatchInlineSnapshot
        (`"null"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.null (formatted)', () => {
      vi.expect(recurse.toType(
        t.null,
        { format: true }
      )).toMatchInlineSnapshot
        (`"null"`)
    })
    /////    t.null    /////
    ////////////////////////


    /////////////////////////////
    /////    t.undefined    /////
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.undefined', () => {
      vi.expect(recurse.toType(
        t.undefined,
      )).toMatchInlineSnapshot
        (`"undefined"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.undefined (formatted)', () => {
      vi.expect(recurse.toType(
        t.undefined,
        { format: true }
      )).toMatchInlineSnapshot
        (`"undefined"`)
    })
    /////    t.undefined    /////
    /////////////////////////////


    //////////////////////////
    /////    t.symbol    /////
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.symbol', () => {
      vi.expect(recurse.toType(
        t.symbol,
      )).toMatchInlineSnapshot
        (`"symbol"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.symbol (formatted)', () => {
      vi.expect(recurse.toType(
        t.symbol,
        { format: true }
      )).toMatchInlineSnapshot
        (`"symbol"`)
    })
    /////    t.symbol    /////
    //////////////////////////


    ///////////////////////////
    /////    t.boolean    /////
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.boolean', () => {
      vi.expect(recurse.toType(
        t.boolean,
      )).toMatchInlineSnapshot
        (`"boolean"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.boolean (formatted)', () => {
      vi.expect(recurse.toType(
        t.boolean,
        { format: true }
      )).toMatchInlineSnapshot
        (`"boolean"`)
    })
    /////    t.boolean    /////
    ///////////////////////////


    ///////////////////////////
    /////    t.integer    /////
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.integer', () => {
      vi.expect(recurse.toType(
        t.integer,
      )).toMatchInlineSnapshot
        (`"number"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.integer (formatted)', () => {
      vi.expect(recurse.toType(
        t.integer,
        { format: true }
      )).toMatchInlineSnapshot
        (`"number"`)
    })
    /////    t.integer    /////
    ///////////////////////////


    //////////////////////////
    /////    t.bigint    /////
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.bigint', () => {
      vi.expect(recurse.toType(
        t.bigint,
      )).toMatchInlineSnapshot
        (`"bigint"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.bigint (formatted)', () => {
      vi.expect(recurse.toType(
        t.bigint,
        { format: true }
      )).toMatchInlineSnapshot
        (`"bigint"`)
    })
    /////    t.bigint    /////
    //////////////////////////


    //////////////////////////
    /////    t.number    /////
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.number', () => {
      vi.expect(recurse.toType(
        t.number,
      )).toMatchInlineSnapshot
        (`"number"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.number (bounds)', () => {
      vi.expect(recurse.toType(
        t.number.min(0),
      )).toMatchInlineSnapshot
        (`"number"`)
      vi.expect(recurse.toType(
        t.number.max(0),
      )).toMatchInlineSnapshot
        (`"number"`)
      vi.expect(recurse.toType(
        t.number.min(0).max(1),
      )).toMatchInlineSnapshot
        (`"number"`)
      vi.expect(recurse.toType(
        t.number.lessThan(1).min(0),
      )).toMatchInlineSnapshot
        (`"number"`)
      vi.expect(recurse.toType(
        t.number.min(0).lessThan(1),
      )).toMatchInlineSnapshot
        (`"number"`)
      vi.expect(recurse.toType(
        t.number.max(1).moreThan(0),
      )).toMatchInlineSnapshot
        (`"number"`)
      vi.expect(recurse.toType(
        t.number.moreThan(0).max(1),
      )).toMatchInlineSnapshot
        (`"number"`)
      vi.expect(recurse.toType(
        t.number.between(0, 1),
      )).toMatchInlineSnapshot
        (`"number"`)
      vi.expect(recurse.toType(
        t.number.between(1, 0),
      )).toMatchInlineSnapshot
        (`"number"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.number (formatted)', () => {
      vi.expect(recurse.toType(
        t.number,
        { format: true }
      )).toMatchInlineSnapshot
        (`"number"`)
    })
    /////    t.number    /////
    //////////////////////////


    //////////////////////////
    /////    t.string    /////
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.string', () => {
      vi.expect(recurse.toType(
        t.string,
      )).toMatchInlineSnapshot
        (`"string"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.string (formatted)', () => {
      vi.expect(recurse.toType(
        t.string,
        { format: true }
      )).toMatchInlineSnapshot
        (`"string"`)
    })
    /////    t.string    /////
    //////////////////////////


    /////////////////////////
    /////    t.array    /////
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.array', () => {
      vi.expect(recurse.toType(
        t.array(t.string),
      )).toMatchInlineSnapshot
        (`"(string)[]"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.array (formatted)', () => {
      vi.expect(recurse.toType(
        t.array(t.string),
        { format: true }
      )).toMatchInlineSnapshot
        (`"(string)[]"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.array (nested)', () => {
      vi.expect(recurse.toType(
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
        (`"({ a: string, b: number, c: boolean, d: symbol, e: { f: null } })[]"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.array (formatted, nested)', () => {
      vi.expect(recurse.toType(
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
        { format: true }
      )).toMatchInlineSnapshot
        (`"({ a: string, b: number, c: boolean, d: symbol, e: { f: null } })[]"`)
    })
    /////    t.array    /////
    /////////////////////////


    //////////////////////////
    /////    t.record    /////
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.record', () => {
      vi.expect(recurse.toType(
        t.record(t.string),
      )).toMatchInlineSnapshot
        (`"Record<string, string>"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.record (formatted)', () => {
      vi.expect(recurse.toType(
        t.record(t.string),
        { format: true }
      )).toMatchInlineSnapshot
        (`"Record<string, string>"`)
    })
    /////    t.record    /////
    //////////////////////////


    ////////////////////////////
    /////    t.optional    /////
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.optional', () => {
      vi.expect(recurse.toType(
        t.optional(t.string),
      )).toMatchInlineSnapshot
        (`"(string | undefined)"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.optional (formatted)', () => {
      vi.expect(recurse.toType(
        t.optional(t.string),
        { format: true }
      )).toMatchInlineSnapshot
        (`"(string | undefined)"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.optional (formatted w/ break)', () => {
      vi.expect(recurse.toType(
        t.optional(t.optional(t.optional(t.optional(t.optional(t.optional(t.optional(t.optional(t.optional(t.string))))))))),
        { format: true }
      )).toMatchInlineSnapshot
        (`"(((((((((string | undefined) | undefined) | undefined) | undefined) | undefined) | undefined) | undefined) | undefined) | undefined)"`)
    })
    /////    t.optional    /////
    ////////////////////////////


    //////////////////////
    /////    t.eq    /////
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.eq', () => {
      vi.expect(recurse.toType(
        t.eq(100),
      )).toMatchInlineSnapshot
        (`"100"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.eq (formatted)', () => {
      vi.expect(recurse.toType(
        t.eq(100),
        { format: true }
      )).toMatchInlineSnapshot
        (`"100"`)
    })
    /////    t.eq    /////
    //////////////////////


    /////////////////////////
    /////    t.union    /////
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.union', () => {
      vi.expect(recurse.toType(
        t.union(t.string, t.boolean),
      )).toMatchInlineSnapshot
        (`"(string | boolean)"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.union (empty)', () => {
      vi.expect(recurse.toType(
        t.union(),
        { format: true }
      )).toMatchInlineSnapshot
        (`"()"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.union (formatted)', () => {
      vi.expect(recurse.toType(
        t.union(t.string, t.boolean),
        { format: true }
      )).toMatchInlineSnapshot
        (`"(string | boolean)"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.union (formatted w/ break)', () => {
      vi.expect(recurse.toType(
        t.union(t.union(t.union(t.union(t.union(t.union(t.union(t.union(t.union(t.union(t.string, t.boolean)))))))))),
        { format: true }
      )).toMatchInlineSnapshot
        (`"((((((((((string | boolean))))))))))"`)
    })
    /////    t.union    /////
    /////////////////////////


    /////////////////////////////
    /////    t.intersect    /////
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.intersect', () => {
      vi.expect(recurse.toType(
        t.intersect(t.object({ a: t.string }), t.object({ b: t.boolean })),
      )).toMatchInlineSnapshot
        (`"({ a: string } & { b: boolean })"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.intersect (formatted)', () => {
      vi.expect(recurse.toType(
        t.intersect(t.object({ a: t.string }), t.object({ b: t.boolean })),
        { format: true }
      )).toMatchInlineSnapshot
        (`"({ a: string } & { b: boolean })"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.intersect (formatted w/ break)', () => {
      vi.expect(recurse.toType(
        t.intersect(t.intersect(t.intersect(t.intersect(t.intersect(t.object({ a: t.string }), t.object({ b: t.boolean })))))),
        { format: true }
      )).toMatchInlineSnapshot
        (`"((((({ a: string } & { b: boolean })))))"`)
    })
    /////    t.intersect    /////
    /////////////////////////////


    /////////////////////////
    /////    t.tuple    /////
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.tuple', () => {
      vi.expect(recurse.toType(
        t.tuple(t.object({ a: t.string }), t.object({ b: t.boolean })),
      )).toMatchInlineSnapshot
        (`"[{ a: string }, { b: boolean }]"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.tuple (formatted)', () => {
      vi.expect(recurse.toType(
        t.tuple(t.object({ a: t.string }), t.object({ b: t.boolean })),
        { format: true }
      )).toMatchInlineSnapshot
        (`"[{ a: string }, { b: boolean }]"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.tuple (formatted)', () => {
      vi.expect(recurse.toType(
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
        { format: true }
      )).toMatchInlineSnapshot
        (`
        "[
          ([
              _?: (({ a: string } | { b: boolean }) | undefined),
              _?: ({ z: { c: { d: boolean, e: number, f: number, g: void } } } | undefined)
            ])[]
        ]"
      `)
    })
    /////    t.tuple    /////
    /////////////////////////


    //////////////////////////
    /////    t.object    /////
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.object', () => {
      vi.expect(recurse.toType(
        t.object({ a: t.string, b: t.optional(t.number) }),
      )).toMatchInlineSnapshot
        (`"{ a: string, b?: (number | undefined) }"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.object (empty)', () => {
      vi.expect(recurse.toType(
        t.object({}),
        { format: true },
      )).toMatchInlineSnapshot
        (`"{}"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.object (formatted)', () => {
      vi.expect(recurse.toType(
        t.object({ a: t.string, b: t.optional(t.number) }),
        { format: true }
      )).toMatchInlineSnapshot
        (`"{ a: string, b?: (number | undefined) }"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.object (nested) object', () => {
      vi.expect(recurse.toType(
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
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.object (nested + formatted)', () => {
      vi.expect(recurse.toType(
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
        { format: true }
      )).toMatchInlineSnapshot
        (`
        "{
          ROOT_A: Record<string, { a: string, b: { c: { d: boolean, e: number, f: number, g: void } } }>,
          ROOT_B?: (unknown | undefined)
        }"
      `)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.object (formatted w/ break)', () => {
      vi.expect(recurse.toType(
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
        { format: true },
      )).toMatchInlineSnapshot
        (`
        "{
          a: {
            b: 10000,
            c: {
              d: 9000,
              e: {
                f: 8000,
                g: {
                  h: 7000,
                  i: {
                    j: 6000,
                    k: { l: 5000, m: { n: 4000, o: { p: 3000, q: { r: 2000, s: { t: 1000 } } } } }
                  }
                }
              }
            }
          }
        }"
      `)
    })
    /////    t.object    /////
    //////////////////////////
  }
)