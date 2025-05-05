import * as vi from 'vitest'
import { fc, test } from '@fast-check/vitest'
import { recurse, t, __trim as trim } from '@traversable/schema'
import { fn } from '@traversable/registry'

vi.describe(
  '〖⛳️〗‹‹‹ ❲@traverable/schema❳: recurse.toString',
  () => {
    vi.it('〖⛳️〗› ❲recurse.toString❳: throws when given a non-schema', () => {
      /* @ts-expect-error - bad input raises a TypeError */
      vi.assert.throws(() => recurse.toString(Symbol.for('BAD DATA')))
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.never', () => {
      vi.expect(''
        + '   '
        + recurse.toString(
          t.tuple(
            t.object({
              a: t.eq([
                1,
                [2],
                { [3]: 4 }
              ]),
              b: t.optional(
                t.record(
                  t.array(
                    t.union(
                      t.number,
                      t.eq(1),
                    )
                  )
                )
              )
            })
          ),
          { format: true, maxWidth: 50, initialOffset: 4 }
        )).toMatchInlineSnapshot
        (`
          "   t.tuple(
                t.object({
                  a: t.eq([1, [2], { "3": 4 }]),
                  b: t.optional(
                    t.record(
                      t.array(t.union(t.number, t.eq(1)))
                    )
                  )
                })
              )"
        `)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.never', () => {
      vi.expect(recurse.toString(
        t.never,
      )).toMatchInlineSnapshot
        (`"t.never"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.never (formatted)', () => {
      vi.expect(recurse.toString(
        t.never,
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.never"`)
    })


    vi.it('〖⛳️〗› ❲recurse.toString❳: t.unknown', () => {
      vi.expect(recurse.toString(
        t.unknown,
      )).toMatchInlineSnapshot
        (`"t.unknown"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.unknown (formatted)', () => {
      vi.expect(recurse.toString(
        t.unknown,
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.unknown"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.any', () => {
      vi.expect(recurse.toString(
        t.any,
      )).toMatchInlineSnapshot
        (`"t.any"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.any (formatted)', () => {
      vi.expect(recurse.toString(
        t.any,
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.any"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.void', () => {
      vi.expect(recurse.toString(
        t.void,
      )).toMatchInlineSnapshot
        (`"t.void"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.void (formatted)', () => {
      vi.expect(recurse.toString(
        t.void,
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.void"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.null', () => {
      vi.expect(recurse.toString(
        t.null,
      )).toMatchInlineSnapshot
        (`"t.null"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.null (formatted)', () => {
      vi.expect(recurse.toString(
        t.null,
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.null"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.undefined', () => {
      vi.expect(recurse.toString(
        t.undefined,
      )).toMatchInlineSnapshot
        (`"t.undefined"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.undefined (formatted)', () => {
      vi.expect(recurse.toString(
        t.undefined,
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.undefined"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.symbol', () => {
      vi.expect(recurse.toString(
        t.symbol,
      )).toMatchInlineSnapshot
        (`"t.symbol"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.symbol (formatted)', () => {
      vi.expect(recurse.toString(
        t.symbol,
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.symbol"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.boolean', () => {
      vi.expect(recurse.toString(
        t.boolean,
      )).toMatchInlineSnapshot
        (`"t.boolean"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.boolean (formatted)', () => {
      vi.expect(recurse.toString(
        t.boolean,
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.boolean"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.integer', () => {
      vi.expect(recurse.toString(
        t.integer,
      )).toMatchInlineSnapshot
        (`"t.integer"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.integer (formatted)', () => {
      vi.expect(recurse.toString(
        t.integer,
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.integer"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.bigint', () => {
      vi.expect(recurse.toString(
        t.bigint,
      )).toMatchInlineSnapshot
        (`"t.bigint"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.bigint (formatted)', () => {
      vi.expect(recurse.toString(
        t.bigint,
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.bigint"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.number', () => {
      vi.expect(recurse.toString(
        t.number,
      )).toMatchInlineSnapshot
        (`"t.number"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.number (bounds)', () => {
      vi.expect(recurse.toString(
        t.number.min(0),
      )).toMatchInlineSnapshot
        (`"t.number.min(0)"`)

      vi.expect(recurse.toString(
        t.number.max(0),
      )).toMatchInlineSnapshot
        (`"t.number.max(0)"`)

      vi.expect(recurse.toString(
        t.number.min(0).max(1),
      )).toMatchInlineSnapshot
        (`"t.number.min(0).max(1)"`)

      vi.expect(recurse.toString(
        t.number.lessThan(1).min(0),
      )).toMatchInlineSnapshot
        (`"t.number.lessThan(1).min(0)"`)

      vi.expect(recurse.toString(
        t.number.min(0).lessThan(1),
      )).toMatchInlineSnapshot
        (`"t.number.lessThan(1).min(0)"`)

      vi.expect(recurse.toString(
        t.number.max(1).moreThan(0),
      )).toMatchInlineSnapshot
        (`"t.number.moreThan(0).max(1)"`)

      vi.expect(recurse.toString(
        t.number.moreThan(0).max(1),
      )).toMatchInlineSnapshot
        (`"t.number.moreThan(0).max(1)"`)

      vi.expect(recurse.toString(
        t.number.between(0, 1),
      )).toMatchInlineSnapshot
        (`"t.number.min(0).max(1)"`)

      vi.expect(recurse.toString(
        t.number.between(1, 0),
      )).toMatchInlineSnapshot
        (`"t.number.min(0).max(1)"`)
    })


    vi.it('〖⛳️〗› ❲recurse.toString❳: t.number (formatted)', () => {
      vi.expect(recurse.toString(
        t.number,
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.number"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.string', () => {
      vi.expect(recurse.toString(
        t.string,
      )).toMatchInlineSnapshot
        (`"t.string"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.string (formatted)', () => {
      vi.expect(recurse.toString(
        t.string,
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.string"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.array', () => {
      vi.expect(recurse.toString(
        t.array(t.string),
      )).toMatchInlineSnapshot
        (`"t.array(t.string)"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.array (formatted)', () => {
      vi.expect(recurse.toString(
        t.array(t.string),
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.array(t.string)"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.record', () => {
      vi.expect(recurse.toString(
        t.record(t.string),
      )).toMatchInlineSnapshot
        (`"t.record(t.string)"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.record (formatted)', () => {
      vi.expect(recurse.toString(
        t.record(t.string),
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.record(t.string)"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.optional', () => {
      vi.expect(recurse.toString(
        t.optional(t.string),
      )).toMatchInlineSnapshot
        (`"t.optional(t.string)"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.optional (formatted)', () => {
      vi.expect(recurse.toString(
        t.optional(t.string),
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.optional(t.string)"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.optional (formatted w/ break)', () => {
      vi.expect(recurse.toString(
        t.optional(t.optional(t.optional(t.optional(t.optional(t.optional(t.optional(t.optional(t.optional(t.string))))))))),
        { format: true }
      )).toMatchInlineSnapshot
        (`
      "t.optional(
        t.optional(
          t.optional(t.optional(t.optional(t.optional(t.optional(t.optional(t.optional(t.string)))))))
        )
      )"
    `)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.eq', () => {
      vi.expect(recurse.toString(
        t.eq(100),
      )).toMatchInlineSnapshot
        (`"t.eq(100)"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.eq (formatted)', () => {
      vi.expect(recurse.toString(
        t.eq(100),
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.eq(100)"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.union', () => {
      vi.expect(recurse.toString(
        t.union(t.string, t.boolean),
      )).toMatchInlineSnapshot
        (`"t.union(t.string, t.boolean)"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.union (empty)', () => {
      vi.expect(recurse.toString(
        t.union(),
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.union()"`)
    })


    vi.it('〖⛳️〗› ❲recurse.toString❳: t.union (formatted)', () => {
      vi.expect(recurse.toString(
        t.union(t.string, t.boolean),
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.union(t.string, t.boolean)"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.union (formatted w/ break)', () => {
      vi.expect(recurse.toString(
        t.union(
          t.union(
            t.union(
              t.union(
                t.union(
                  t.union(
                    t.union(
                      t.union(
                        t.union(
                          t.union(
                            t.union(
                              t.union(
                                t.string,
                                t.boolean
                              ),
                              t.eq(1),
                            ),
                            t.eq(2),
                          ),
                          t.eq(3),
                        ),
                        t.eq(4),
                      ),
                      t.eq(5),
                    ),
                    t.eq(6),
                  ),
                  t.eq(7),
                ),
                t.eq(8),
              ),
              t.eq(9),
            ),
            t.eq(10),
          ),
          t.eq(11),
        ),
        { format: true }
      )).toMatchInlineSnapshot
        (`
      "t.union(
        t.union(
          t.union(
            t.union(
              t.union(
                t.union(
                  t.union(
                    t.union(
                      t.union(t.union(t.union(t.union(t.string, t.boolean), t.eq(1)), t.eq(2)), t.eq(3)),
                      t.eq(4)
                    ),
                    t.eq(5)
                  ),
                  t.eq(6)
                ),
                t.eq(7)
              ),
              t.eq(8)
            ),
            t.eq(9)
          ),
          t.eq(10)
        ),
        t.eq(11)
      )"
    `)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.array (formatted w/ break)', () => {
      vi.expect(recurse.toString(
        t.array(
          t.array(
            t.union(
              t.array(
                t.array(
                  t.union(
                    t.array(
                      t.array(
                        t.union(
                          t.array(
                            t.array(
                              t.union(
                                t.string,
                                t.boolean
                              ),
                            ),
                          ),
                          t.eq(1),
                        ),
                      ),
                    ),
                    t.eq(2),
                  ),
                ),
              ),
              t.eq(3),
            ),
          ),
        ),
        { format: true }
      )).toMatchInlineSnapshot
        (`
      "t.array(
        t.array(
          t.union(
            t.array(
              t.array(
                t.union(
                  t.array(t.array(t.union(t.array(t.array(t.union(t.string, t.boolean))), t.eq(1)))),
                  t.eq(2)
                )
              )
            ),
            t.eq(3)
          )
        )
      )"
    `)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.intersect', () => {
      vi.expect(recurse.toString(
        t.intersect(t.object({ a: t.string }), t.object({ b: t.boolean })),
      )).toMatchInlineSnapshot
        (`"t.intersect(t.object({ a: t.string }), t.object({ b: t.boolean }))"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.intersect (formatted)', () => {
      vi.expect(recurse.toString(
        t.intersect(t.object({ a: t.string }), t.object({ b: t.boolean })),
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.intersect(t.object({ a: t.string }), t.object({ b: t.boolean }))"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.intersect (formatted w/ break)', () => {
      vi.expect(recurse.toString(
        t.intersect(t.intersect(t.intersect(t.intersect(t.intersect(t.object({ a: t.string }), t.object({ b: t.boolean })))))),
        { format: true }
      )).toMatchInlineSnapshot
        (`
      "t.intersect(
        t.intersect(
          t.intersect(t.intersect(t.intersect(t.object({ a: t.string }), t.object({ b: t.boolean }))))
        )
      )"
    `)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.tuple', () => {
      vi.expect(recurse.toString(
        t.tuple(t.object({ a: t.string }), t.object({ b: t.boolean })),
      )).toMatchInlineSnapshot
        (`"t.tuple(t.object({ a: t.string }), t.object({ b: t.boolean }))"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.tuple (formatted)', () => {
      vi.expect(recurse.toString(
        t.tuple(t.object({ a: t.string }), t.object({ b: t.boolean })),
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.tuple(t.object({ a: t.string }), t.object({ b: t.boolean }))"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.tuple (formatted w/ break)', () => {
      vi.expect(recurse.toString(
        t.tuple(t.array(t.tuple(t.array(t.array(t.tuple(t.tuple(t.tuple(t.tuple(t.object({ a: t.string }), t.array(t.object({ b: t.array(t.boolean) }))))))))))),
        { format: true }
      )).toMatchInlineSnapshot
        (`
      "t.tuple(
        t.array(
          t.tuple(
            t.array(
              t.array(
                t.tuple(
                  t.tuple(
                    t.tuple(
                      t.tuple(t.object({ a: t.string }), t.array(t.object({ b: t.array(t.boolean) })))
                    )
                  )
                )
              )
            )
          )
        )
      )"
    `)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.object', () => {
      vi.expect(recurse.toString(
        t.object({ a: t.string, b: t.optional(t.number) }),
      )).toMatchInlineSnapshot
        (`"t.object({ a: t.string, b: t.optional(t.number) })"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: t.object (empty)', () => {
      vi.expect(recurse.toString(
        t.object({}),
        { format: true },
      )).toMatchInlineSnapshot
        (`"t.object({})"`)
    })


    vi.it('〖⛳️〗› ❲recurse.toString❳: t.object (formatted)', () => {
      vi.expect(recurse.toString(
        t.object({ a: t.string, b: t.optional(t.number) }),
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.object({ a: t.string, b: t.optional(t.number) })"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: nested object', () => {
      vi.expect(recurse.toString(
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
        (`"t.record(t.object({ a: t.string, b: t.object({ c: t.object({ d: t.boolean, e: t.integer, f: t.number, g: t.void }) }) }))"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: nested object (formatted)', () => {
      vi.expect(recurse.toString(
        t.record(
          t.object({
            a: t.string,
            b: t.object({
              c: t.object({
                d: t.boolean,
                e: t.integer,
                f: t.number,
                g: t.void,
                h: t.eq(1000000),
                i: t.undefined,
              })
            })
          })
        ),
        { format: true }
      )).toMatchInlineSnapshot
        (`
      "t.record(
        t.object({
          a: t.string,
          b: t.object({
            c: t.object({
              d: t.boolean,
              e: t.integer,
              f: t.number,
              g: t.void,
              h: t.eq(1000000),
              i: t.undefined
            })
          })
        })
      )"
    `)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: nested array', () => {
      vi.expect(recurse.toString(
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
        (`"t.array(t.object({ a: t.string, b: t.integer, c: t.boolean, d: t.symbol, e: t.object({ f: t.null }) }))"`)
    })

    vi.it('〖⛳️〗› ❲recurse.toString❳: nested array (formatted)', () => {
      vi.expect(recurse.toString(
        t.array(
          t.object({
            a: t.string,
            b: t.integer,
            c: t.boolean,
            d: t.symbol,
            e: t.object({
              f: t.null,
            }),
            f: t.undefined,
          })
        ),
        { format: true }
      )).toMatchInlineSnapshot
        (`
        "t.array(
          t.object({
            a: t.string,
            b: t.integer,
            c: t.boolean,
            d: t.symbol,
            e: t.object({ f: t.null }),
            f: t.undefined
          })
        )"
      `)
    })
  }
)

vi.describe(
  '〖⛳️〗‹‹‹ ❲@traverable/schema❳: recurse.toTypeString',
  () => {
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: throws when given a non-schema', () => {
      /* @ts-expect-error - bad input raises a TypeError */
      vi.assert.throws(() => recurse.toString(Symbol.for('BAD DATA')))
    })

    /////////////////////////
    /////    t.never    /////
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.never', () => {
      vi.expect(recurse.toTypeString(
        t.never,
      )).toMatchInlineSnapshot
        (`"never"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.never (formatted)', () => {
      vi.expect(recurse.toTypeString(
        t.never,
        { format: true }
      )).toMatchInlineSnapshot
        (`"never"`)
    })
    /////    t.never    /////
    /////////////////////////


    ///////////////////////////
    /////    t.unknown    /////
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.unknown', () => {
      vi.expect(recurse.toTypeString(
        t.unknown,
      )).toMatchInlineSnapshot
        (`"unknown"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.unknown (formatted)', () => {
      vi.expect(recurse.toTypeString(
        t.unknown,
        { format: true }
      )).toMatchInlineSnapshot
        (`"unknown"`)
    })
    /////    t.unknown    /////
    ///////////////////////////


    ///////////////////////
    /////    t.any    /////
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.any', () => {
      vi.expect(recurse.toTypeString(
        t.any,
      )).toMatchInlineSnapshot
        (`"any"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.any (formatted)', () => {
      vi.expect(recurse.toTypeString(
        t.any,
        { format: true }
      )).toMatchInlineSnapshot
        (`"any"`)
    })
    /////    t.any    /////
    ///////////////////////


    ////////////////////////
    /////    t.void    /////
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.void', () => {
      vi.expect(recurse.toTypeString(
        t.void,
      )).toMatchInlineSnapshot
        (`"void"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.void (formatted)', () => {
      vi.expect(recurse.toTypeString(
        t.void,
        { format: true }
      )).toMatchInlineSnapshot
        (`"void"`)
    })
    /////    t.void    /////
    ////////////////////////


    ////////////////////////
    /////    t.null    /////
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.null', () => {
      vi.expect(recurse.toTypeString(
        t.null,
      )).toMatchInlineSnapshot
        (`"null"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.null (formatted)', () => {
      vi.expect(recurse.toTypeString(
        t.null,
        { format: true }
      )).toMatchInlineSnapshot
        (`"null"`)
    })
    /////    t.null    /////
    ////////////////////////


    /////////////////////////////
    /////    t.undefined    /////
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.undefined', () => {
      vi.expect(recurse.toTypeString(
        t.undefined,
      )).toMatchInlineSnapshot
        (`"undefined"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.undefined (formatted)', () => {
      vi.expect(recurse.toTypeString(
        t.undefined,
        { format: true }
      )).toMatchInlineSnapshot
        (`"undefined"`)
    })
    /////    t.undefined    /////
    /////////////////////////////


    //////////////////////////
    /////    t.symbol    /////
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.symbol', () => {
      vi.expect(recurse.toTypeString(
        t.symbol,
      )).toMatchInlineSnapshot
        (`"symbol"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.symbol (formatted)', () => {
      vi.expect(recurse.toTypeString(
        t.symbol,
        { format: true }
      )).toMatchInlineSnapshot
        (`"symbol"`)
    })
    /////    t.symbol    /////
    //////////////////////////


    ///////////////////////////
    /////    t.boolean    /////
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.boolean', () => {
      vi.expect(recurse.toTypeString(
        t.boolean,
      )).toMatchInlineSnapshot
        (`"boolean"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.boolean (formatted)', () => {
      vi.expect(recurse.toTypeString(
        t.boolean,
        { format: true }
      )).toMatchInlineSnapshot
        (`"boolean"`)
    })
    /////    t.boolean    /////
    ///////////////////////////


    ///////////////////////////
    /////    t.integer    /////
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.integer', () => {
      vi.expect(recurse.toTypeString(
        t.integer,
      )).toMatchInlineSnapshot
        (`"number"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.integer (formatted)', () => {
      vi.expect(recurse.toTypeString(
        t.integer,
        { format: true }
      )).toMatchInlineSnapshot
        (`"number"`)
    })
    /////    t.integer    /////
    ///////////////////////////


    //////////////////////////
    /////    t.bigint    /////
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.bigint', () => {
      vi.expect(recurse.toTypeString(
        t.bigint,
      )).toMatchInlineSnapshot
        (`"bigint"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.bigint (formatted)', () => {
      vi.expect(recurse.toTypeString(
        t.bigint,
        { format: true }
      )).toMatchInlineSnapshot
        (`"bigint"`)
    })
    /////    t.bigint    /////
    //////////////////////////


    //////////////////////////
    /////    t.number    /////
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.number', () => {
      vi.expect(recurse.toTypeString(
        t.number,
      )).toMatchInlineSnapshot
        (`"number"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.number (bounds)', () => {
      vi.expect(recurse.toTypeString(
        t.number.min(0),
      )).toMatchInlineSnapshot
        (`"number"`)
      vi.expect(recurse.toTypeString(
        t.number.max(0),
      )).toMatchInlineSnapshot
        (`"number"`)
      vi.expect(recurse.toTypeString(
        t.number.min(0).max(1),
      )).toMatchInlineSnapshot
        (`"number"`)
      vi.expect(recurse.toTypeString(
        t.number.lessThan(1).min(0),
      )).toMatchInlineSnapshot
        (`"number"`)
      vi.expect(recurse.toTypeString(
        t.number.min(0).lessThan(1),
      )).toMatchInlineSnapshot
        (`"number"`)
      vi.expect(recurse.toTypeString(
        t.number.max(1).moreThan(0),
      )).toMatchInlineSnapshot
        (`"number"`)
      vi.expect(recurse.toTypeString(
        t.number.moreThan(0).max(1),
      )).toMatchInlineSnapshot
        (`"number"`)
      vi.expect(recurse.toTypeString(
        t.number.between(0, 1),
      )).toMatchInlineSnapshot
        (`"number"`)
      vi.expect(recurse.toTypeString(
        t.number.between(1, 0),
      )).toMatchInlineSnapshot
        (`"number"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.number (formatted)', () => {
      vi.expect(recurse.toTypeString(
        t.number,
        { format: true }
      )).toMatchInlineSnapshot
        (`"number"`)
    })
    /////    t.number    /////
    //////////////////////////


    //////////////////////////
    /////    t.string    /////
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.string', () => {
      vi.expect(recurse.toTypeString(
        t.string,
      )).toMatchInlineSnapshot
        (`"string"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.string (formatted)', () => {
      vi.expect(recurse.toTypeString(
        t.string,
        { format: true }
      )).toMatchInlineSnapshot
        (`"string"`)
    })
    /////    t.string    /////
    //////////////////////////


    /////////////////////////
    /////    t.array    /////
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.array', () => {
      vi.expect(recurse.toTypeString(
        t.array(t.string),
      )).toMatchInlineSnapshot
        (`"(string)[]"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.array (formatted)', () => {
      vi.expect(recurse.toTypeString(
        t.array(t.string),
        { format: true }
      )).toMatchInlineSnapshot
        (`"(string)[]"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.array (nested)', () => {
      vi.expect(recurse.toTypeString(
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
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.array (formatted, nested)', () => {
      vi.expect(recurse.toTypeString(
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
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.record', () => {
      vi.expect(recurse.toTypeString(
        t.record(t.string),
      )).toMatchInlineSnapshot
        (`"Record<string, string>"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.record (formatted)', () => {
      vi.expect(recurse.toTypeString(
        t.record(t.string),
        { format: true }
      )).toMatchInlineSnapshot
        (`"Record<string, string>"`)
    })
    /////    t.record    /////
    //////////////////////////


    ////////////////////////////
    /////    t.optional    /////
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.optional', () => {
      vi.expect(recurse.toTypeString(
        t.optional(t.string),
      )).toMatchInlineSnapshot
        (`"(string | undefined)"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.optional (formatted)', () => {
      vi.expect(recurse.toTypeString(
        t.optional(t.string),
        { format: true }
      )).toMatchInlineSnapshot
        (`"(string | undefined)"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.optional (formatted w/ break)', () => {
      vi.expect(recurse.toTypeString(
        t.optional(t.optional(t.optional(t.optional(t.optional(t.optional(t.optional(t.optional(t.optional(t.string))))))))),
        { format: true }
      )).toMatchInlineSnapshot
        (`"(((((((((string | undefined) | undefined) | undefined) | undefined) | undefined) | undefined) | undefined) | undefined) | undefined)"`)
    })
    /////    t.optional    /////
    ////////////////////////////


    //////////////////////
    /////    t.eq    /////
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.eq', () => {
      vi.expect(recurse.toTypeString(
        t.eq(100),
      )).toMatchInlineSnapshot
        (`"100"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.eq (formatted)', () => {
      vi.expect(recurse.toTypeString(
        t.eq(100),
        { format: true }
      )).toMatchInlineSnapshot
        (`"100"`)
    })
    /////    t.eq    /////
    //////////////////////


    /////////////////////////
    /////    t.union    /////
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.union', () => {
      vi.expect(recurse.toTypeString(
        t.union(t.string, t.boolean),
      )).toMatchInlineSnapshot
        (`"(string | boolean)"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.union (empty)', () => {
      vi.expect(recurse.toTypeString(
        t.union(),
        { format: true }
      )).toMatchInlineSnapshot
        (`"()"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.union (formatted)', () => {
      vi.expect(recurse.toTypeString(
        t.union(t.string, t.boolean),
        { format: true }
      )).toMatchInlineSnapshot
        (`"(string | boolean)"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.union (formatted w/ break)', () => {
      vi.expect(recurse.toTypeString(
        t.union(t.union(t.union(t.union(t.union(t.union(t.union(t.union(t.union(t.union(t.string, t.boolean)))))))))),
        { format: true }
      )).toMatchInlineSnapshot
        (`"((((((((((string | boolean))))))))))"`)
    })
    /////    t.union    /////
    /////////////////////////


    /////////////////////////////
    /////    t.intersect    /////
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.intersect', () => {
      vi.expect(recurse.toTypeString(
        t.intersect(t.object({ a: t.string }), t.object({ b: t.boolean })),
      )).toMatchInlineSnapshot
        (`"({ a: string } & { b: boolean })"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.intersect (formatted)', () => {
      vi.expect(recurse.toTypeString(
        t.intersect(t.object({ a: t.string }), t.object({ b: t.boolean })),
        { format: true }
      )).toMatchInlineSnapshot
        (`"({ a: string } & { b: boolean })"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.intersect (formatted w/ break)', () => {
      vi.expect(recurse.toTypeString(
        t.intersect(t.intersect(t.intersect(t.intersect(t.intersect(t.object({ a: t.string }), t.object({ b: t.boolean })))))),
        { format: true }
      )).toMatchInlineSnapshot
        (`"((((({ a: string } & { b: boolean })))))"`)
    })
    /////    t.intersect    /////
    /////////////////////////////


    /////////////////////////
    /////    t.tuple    /////
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.tuple', () => {
      vi.expect(recurse.toTypeString(
        t.tuple(t.object({ a: t.string }), t.object({ b: t.boolean })),
      )).toMatchInlineSnapshot
        (`"[{ a: string }, { b: boolean }]"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.tuple (formatted)', () => {
      vi.expect(recurse.toTypeString(
        t.tuple(t.object({ a: t.string }), t.object({ b: t.boolean })),
        { format: true }
      )).toMatchInlineSnapshot
        (`"[{ a: string }, { b: boolean }]"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.tuple (formatted)', () => {
      vi.expect(recurse.toTypeString(
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
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.object', () => {
      vi.expect(recurse.toTypeString(
        t.object({ a: t.string, b: t.optional(t.number) }),
      )).toMatchInlineSnapshot
        (`"{ a: string, b?: (number | undefined) }"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.object (empty)', () => {
      vi.expect(recurse.toTypeString(
        t.object({}),
        { format: true },
      )).toMatchInlineSnapshot
        (`"{}"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.object (formatted)', () => {
      vi.expect(recurse.toTypeString(
        t.object({ a: t.string, b: t.optional(t.number) }),
        { format: true }
      )).toMatchInlineSnapshot
        (`"{ a: string, b?: (number | undefined) }"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.object (nested) object', () => {
      vi.expect(recurse.toTypeString(
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
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.object (nested + formatted)', () => {
      vi.expect(recurse.toTypeString(
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
    vi.it('〖⛳️〗› ❲recurse.toTypeString❳: t.object (formatted w/ break)', () => {
      vi.expect(recurse.toTypeString(
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

vi.describe(
  '〖⛳️〗‹‹‹ ❲@traverable/schema❳: recurse.jsonToString',
  () => {
    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: throws when given bad input', () => {
      /* @ts-expect-error - bad input raises a TypeError */
      vi.assert.throws(() => recurse.toString(Symbol.for('BAD DATA')))
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: null', () => {
      vi.expect(recurse.jsonToString(
        null,
      )).toMatchInlineSnapshot
        (`"null"`)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: null (formatted)', () => {
      vi.expect(recurse.jsonToString(
        null,
        { format: true }
      )).toMatchInlineSnapshot
        (`"null"`)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: boolean', () => {
      vi.expect(recurse.jsonToString(
        true,
      )).toMatchInlineSnapshot
        (`"true"`)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: boolean (formatted)', () => {
      vi.expect(recurse.jsonToString(
        true,
        { format: true }
      )).toMatchInlineSnapshot
        (`"true"`)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: boolean', () => {
      vi.expect(recurse.jsonToString(
        false,
      )).toMatchInlineSnapshot
        (`"false"`)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: boolean (formatted)', () => {
      vi.expect(recurse.jsonToString(
        false,
        { format: true }
      )).toMatchInlineSnapshot
        (`"false"`)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: number', () => {
      vi.expect(recurse.jsonToString(
        0,
      )).toMatchInlineSnapshot
        (`"0"`)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: number', () => {
      vi.expect(recurse.jsonToString(
        -0,
      )).toMatchInlineSnapshot
        (`"0"`)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: number (formatted)', () => {
      vi.expect(recurse.jsonToString(
        0,
        { format: true }
      )).toMatchInlineSnapshot
        (`"0"`)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: string', () => {
      vi.expect(recurse.jsonToString(
        '',
      )).toMatchInlineSnapshot
        (`""""`)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: string', () => {
      vi.expect(recurse.jsonToString(
        '\\',
      )).toMatchInlineSnapshot
        (`""\\\\""`)
    })


    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: string', () => {
      vi.expect(recurse.jsonToString(
        '""',
      )).toMatchInlineSnapshot
        (`""\\"\\"""`)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: string (formatted)', () => {
      vi.expect(recurse.jsonToString(
        '',
        { format: true }
      )).toMatchInlineSnapshot
        (`""""`)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: array', () => {
      vi.expect(recurse.jsonToString(
        [null],
      )).toMatchInlineSnapshot
        (`"[null]"`)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: array (empty)', () => {
      vi.expect(recurse.jsonToString(
        [],
      )).toMatchInlineSnapshot
        (`"[]"`)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: array (formatted)', () => {
      vi.expect(recurse.jsonToString(
        [''],
        { format: true }
      )).toMatchInlineSnapshot
        (`"[""]"`)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: array (formatted w/ break)', () => {
      vi.expect(recurse.jsonToString(
        [1_000, [2_000, [3_000, [4_000, [5_000, [6_000, [7_000, [8_000, [9_000, [10_000, [11_000, [12_000, [13_000]]]]]]]]]]]]],
        { format: true }
      )).toMatchInlineSnapshot
        (`
      "[
        1000,
        [
          2000,
          [3000, [4000, [5000, [6000, [7000, [8000, [9000, [10000, [11000, [12000, [13000]]]]]]]]]]]
        ]
      ]"
    `)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: object', () => {
      vi.expect(recurse.jsonToString(
        { a: null },
      )).toMatchInlineSnapshot
        (`"{ a: null }"`)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: object (empty)', () => {
      vi.expect(recurse.jsonToString(
        {},
      )).toMatchInlineSnapshot
        (`"{}"`)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: object (formatted)', () => {
      vi.expect(recurse.jsonToString(
        [''],
        { format: true }
      )).toMatchInlineSnapshot
        (`"[""]"`)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: object (formatted w/ break)', () => {
      vi.expect(recurse.jsonToString(
        {
          abc: [
            1,
            {
              ABC: [
                2,
                {
                  def: [
                    2,
                    {
                      DEF: [
                        3, {
                          ghi: [
                            3,
                            {
                              GHI: [
                                4, {
                                  jkl: [
                                    4,
                                    {
                                      JKL: [
                                        5, {
                                          mno: [6,
                                            {
                                              MNO: [
                                                6,
                                                {
                                                  pqr: [
                                                    7,
                                                    {
                                                      PQR: [
                                                        8,
                                                        {
                                                          stu: [
                                                            9,
                                                            {
                                                              STU: [
                                                                10,
                                                                {
                                                                  vwx: [
                                                                    11,
                                                                    {
                                                                      VWX: [
                                                                        12,
                                                                        {
                                                                          yz: [
                                                                            13,
                                                                            {
                                                                              YZ: 14,
                                                                            }
                                                                          ]
                                                                        }
                                                                      ]
                                                                    }
                                                                  ]
                                                                }
                                                              ]
                                                            }
                                                          ]
                                                        }
                                                      ]
                                                    }
                                                  ]
                                                },
                                              ]
                                            }
                                          ]
                                        }
                                      ]
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        { format: true }
      )).toMatchInlineSnapshot
        (`
        "{
          abc: [
            1,
            {
              ABC: [
                2,
                {
                  def: [
                    2,
                    {
                      DEF: [
                        3,
                        {
                          ghi: [
                            3,
                            {
                              GHI: [
                                4,
                                {
                                  jkl: [
                                    4,
                                    {
                                      JKL: [
                                        5,
                                        {
                                          mno: [
                                            6,
                                            {
                                              MNO: [
                                                6,
                                                {
                                                  pqr: [
                                                    7,
                                                    {
                                                      PQR: [
                                                        8,
                                                        {
                                                          stu: [
                                                            9,
                                                            {
                                                              STU: [
                                                                10,
                                                                {
                                                                  vwx: [
                                                                    11,
                                                                    { VWX: [12, { yz: [13, { YZ: 14 }] }] }
                                                                  ]
                                                                }
                                                              ]
                                                            }
                                                          ]
                                                        }
                                                      ]
                                                    }
                                                  ]
                                                }
                                              ]
                                            }
                                          ]
                                        }
                                      ]
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }"
      `)
    })
  }
)

/** 
 * See also:
 * - [Functor laws](https://wiki.haskell.org/index.php?title=Functor)
 */
vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema❳: Functor laws', () => {
  const identity
    : <T>(x: recurse.Json<T>) => recurse.Json<T>
    = fn.identity

  vi.it('〖⛳️〗› ❲JsonFunctor❳: preserves identity morphism (examples)', () => {
    vi.assert.deepEqual(recurse.JsonFunctor.map(identity)(null), null)
    vi.assert.deepEqual(recurse.JsonFunctor.map(identity)(true), true)
    vi.assert.deepEqual(recurse.JsonFunctor.map(identity)(false), false)
    vi.assert.deepEqual(recurse.JsonFunctor.map(identity)(0), 0)
    vi.assert.deepEqual(recurse.JsonFunctor.map(identity)(-1), -1)
    vi.assert.deepEqual(recurse.JsonFunctor.map(identity)(''), '')
    vi.assert.deepEqual(recurse.JsonFunctor.map(identity)('""'), '""')
    vi.assert.deepEqual(recurse.JsonFunctor.map(identity)('\\'), '\\')
    vi.assert.deepEqual(recurse.JsonFunctor.map(identity)([]), [])
    vi.assert.deepEqual(recurse.JsonFunctor.map(identity)([[]]), [[]])
    vi.assert.deepEqual(recurse.JsonFunctor.map(identity)({}), {})
    vi.assert.deepEqual(recurse.JsonFunctor.map(identity)({ '': null }), { '': null })
  })

  vi.it('〖⛳️〗› ❲JsonFunctor❳: composition is associative (examples)', () => {
    const input = [
      10, 100, 1000, 10000,
      1_00000, 10_00000, 100_00000
    ]

    vi.assert.deepEqual(
      recurse.JsonFunctor.map(fn.flow(String, (x) => x.length > 5))(input),
      recurse.JsonFunctor.map((x: string) => x.length > 5)(recurse.JsonFunctor.map(String)(input)),
    )
  })

  const { map } = recurse.JsonFunctor
  test.prop([fc.jsonValue()], {
    endOnFailure: true,
    // numRuns: 10_000,
    examples: [[{ ['__proto__']: null }]],
  })(
    '〖⛳️〗› ❲JsonFunctor❳: preserves identity morphism (property)',
    (json) => vi.assert.deepEqual(map(identity)(json), json)
  )

  test.prop([fc.jsonValue()], {
    endOnFailure: true,
    // numRuns: 10_000,
  })(
    '〖⛳️〗› ❲JsonFunctor❳: composition is associative (property)',
    (json) => vi.assert.deepEqual(
      map(fn.flow(JSON.stringify, (x) => x.length > 5))(json),
      map((x: string) => x.length > 5)(map(JSON.stringify)(json)),
    )
  )
})

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema❳: misc', () => {
  vi.it('〖⛳️〗› ❲recurse.trim❳', () => {
    vi.assert.equal(trim(), 'undefined')
  })
})
