import * as vi from 'vitest'
import { fc, test } from '@fast-check/vitest'
import { recurse, t, __trim as trim } from '@traversable/schema'
import { fn } from '@traversable/registry'

vi.describe(
  '〖⛳️〗‹‹‹ ❲@traverable/schema❳: recurse.schemaToString',
  () => {
    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: throws when given a non-schema', () => {
      /* @ts-expect-error - bad input raises a TypeError */
      vi.assert.throws(() => recurse.schemaToString(Symbol.for('BAD DATA')))
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.never', () => {
      vi.expect.soft(''
        + '   '
        + recurse.schemaToString(
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

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.never', () => {
      vi.expect.soft(recurse.schemaToString(
        t.never,
      )).toMatchInlineSnapshot
        (`"t.never"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.never (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.never,
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.never"`)
    })


    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.unknown', () => {
      vi.expect.soft(recurse.schemaToString(
        t.unknown,
      )).toMatchInlineSnapshot
        (`"t.unknown"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.unknown (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.unknown,
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.unknown"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.any', () => {
      vi.expect.soft(recurse.schemaToString(
        t.any,
      )).toMatchInlineSnapshot
        (`"t.any"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.any (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.any,
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.any"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.void', () => {
      vi.expect.soft(recurse.schemaToString(
        t.void,
      )).toMatchInlineSnapshot
        (`"t.void"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.void (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.void,
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.void"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.null', () => {
      vi.expect.soft(recurse.schemaToString(
        t.null,
      )).toMatchInlineSnapshot
        (`"t.null"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.null (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.null,
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.null"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.undefined', () => {
      vi.expect.soft(recurse.schemaToString(
        t.undefined,
      )).toMatchInlineSnapshot
        (`"t.undefined"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.undefined (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.undefined,
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.undefined"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.symbol', () => {
      vi.expect.soft(recurse.schemaToString(
        t.symbol,
      )).toMatchInlineSnapshot
        (`"t.symbol"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.symbol (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.symbol,
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.symbol"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.boolean', () => {
      vi.expect.soft(recurse.schemaToString(
        t.boolean,
      )).toMatchInlineSnapshot
        (`"t.boolean"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.boolean (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.boolean,
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.boolean"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.integer', () => {
      vi.expect.soft(recurse.schemaToString(
        t.integer,
      )).toMatchInlineSnapshot
        (`"t.integer"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.integer (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.integer,
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.integer"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.bigint', () => {
      vi.expect.soft(recurse.schemaToString(
        t.bigint,
      )).toMatchInlineSnapshot
        (`"t.bigint"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.bigint (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.bigint,
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.bigint"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.number', () => {
      vi.expect.soft(recurse.schemaToString(
        t.number,
      )).toMatchInlineSnapshot
        (`"t.number"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.number (bounds)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.number.min(0),
      )).toMatchInlineSnapshot
        (`"t.number.min(0)"`)

      vi.expect.soft(recurse.schemaToString(
        t.number.max(0),
      )).toMatchInlineSnapshot
        (`"t.number.max(0)"`)

      vi.expect.soft(recurse.schemaToString(
        t.number.min(0).max(1),
      )).toMatchInlineSnapshot
        (`"t.number.min(0).max(1)"`)

      vi.expect.soft(recurse.schemaToString(
        t.number.lessThan(1).min(0),
      )).toMatchInlineSnapshot
        (`"t.number.lessThan(1).min(0)"`)

      vi.expect.soft(recurse.schemaToString(
        t.number.min(0).lessThan(1),
      )).toMatchInlineSnapshot
        (`"t.number.lessThan(1).min(0)"`)

      vi.expect.soft(recurse.schemaToString(
        t.number.max(1).moreThan(0),
      )).toMatchInlineSnapshot
        (`"t.number.moreThan(0).max(1)"`)

      vi.expect.soft(recurse.schemaToString(
        t.number.moreThan(0).max(1),
      )).toMatchInlineSnapshot
        (`"t.number.moreThan(0).max(1)"`)

      vi.expect.soft(recurse.schemaToString(
        t.number.between(0, 1),
      )).toMatchInlineSnapshot
        (`"t.number.min(0).max(1)"`)

      vi.expect.soft(recurse.schemaToString(
        t.number.between(1, 0),
      )).toMatchInlineSnapshot
        (`"t.number.min(0).max(1)"`)
    })


    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.number (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.number,
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.number"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.string', () => {
      vi.expect.soft(recurse.schemaToString(
        t.string,
      )).toMatchInlineSnapshot
        (`"t.string"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.string (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.string,
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.string"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.array', () => {
      vi.expect.soft(recurse.schemaToString(
        t.array(t.string),
      )).toMatchInlineSnapshot
        (`"t.array(t.string)"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.array (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.array(t.string),
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.array(t.string)"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.record', () => {
      vi.expect.soft(recurse.schemaToString(
        t.record(t.string),
      )).toMatchInlineSnapshot
        (`"t.record(t.string)"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.record (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.record(t.string),
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.record(t.string)"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.optional', () => {
      vi.expect.soft(recurse.schemaToString(
        t.optional(t.string),
      )).toMatchInlineSnapshot
        (`"t.optional(t.string)"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.optional (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.optional(t.string),
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.optional(t.string)"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.optional (formatted w/ break)', () => {
      vi.expect.soft(recurse.schemaToString(
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

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.eq', () => {
      vi.expect.soft(recurse.schemaToString(
        t.eq(100),
      )).toMatchInlineSnapshot
        (`"t.eq(100)"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.eq (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.eq(100),
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.eq(100)"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.union', () => {
      vi.expect.soft(recurse.schemaToString(
        t.union(t.string, t.boolean),
      )).toMatchInlineSnapshot
        (`"t.union(t.string, t.boolean)"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.union (empty)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.union(),
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.union()"`)
    })


    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.union (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.union(t.string, t.boolean),
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.union(t.string, t.boolean)"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.union (formatted w/ break)', () => {
      vi.expect.soft(recurse.schemaToString(
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

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.array (formatted w/ break)', () => {
      vi.expect.soft(recurse.schemaToString(
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

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.intersect', () => {
      vi.expect.soft(recurse.schemaToString(
        t.intersect(t.object({ a: t.string }), t.object({ b: t.boolean })),
      )).toMatchInlineSnapshot
        (`"t.intersect(t.object({ a: t.string }), t.object({ b: t.boolean }))"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.intersect (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.intersect(t.object({ a: t.string }), t.object({ b: t.boolean })),
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.intersect(t.object({ a: t.string }), t.object({ b: t.boolean }))"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.intersect (formatted w/ break)', () => {
      vi.expect.soft(recurse.schemaToString(
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

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.tuple', () => {
      vi.expect.soft(recurse.schemaToString(
        t.tuple(t.object({ a: t.string }), t.object({ b: t.boolean })),
      )).toMatchInlineSnapshot
        (`"t.tuple(t.object({ a: t.string }), t.object({ b: t.boolean }))"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.tuple (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.tuple(t.object({ a: t.string }), t.object({ b: t.boolean })),
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.tuple(t.object({ a: t.string }), t.object({ b: t.boolean }))"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.tuple (formatted w/ break)', () => {
      vi.expect.soft(recurse.schemaToString(
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

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.object', () => {
      vi.expect.soft(recurse.schemaToString(
        t.object({ a: t.string, b: t.optional(t.number) }),
      )).toMatchInlineSnapshot
        (`"t.object({ a: t.string, b: t.optional(t.number) })"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.object (empty)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.object({}),
        { format: true },
      )).toMatchInlineSnapshot
        (`"t.object({})"`)
    })


    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: t.object (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.object({ a: t.string, b: t.optional(t.number) }),
        { format: true }
      )).toMatchInlineSnapshot
        (`"t.object({ a: t.string, b: t.optional(t.number) })"`)
    })

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: nested object', () => {
      vi.expect.soft(recurse.schemaToString(
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

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: nested object (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
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

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: nested array', () => {
      vi.expect.soft(recurse.schemaToString(
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

    vi.it('〖⛳️〗› ❲recurse.schemaToString❳: nested array (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
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
  '〖⛳️〗‹‹‹ ❲@traverable/schema❳: recurse.toType',
  () => {
    vi.it('〖⛳️〗› ❲recurse.toType❳: throws when given a non-schema', () => {
      /* @ts-expect-error - bad input raises a TypeError */
      vi.assert.throws(() => recurse.schemaToString(Symbol.for('BAD DATA')))
    })

    /////////////////////////
    /////    t.never    /////
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.never', () => {
      vi.expect.soft(recurse.toType(
        t.never,
      )).toMatchInlineSnapshot
        (`"never"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.never (formatted)', () => {
      vi.expect.soft(recurse.toType(
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
      vi.expect.soft(recurse.toType(
        t.unknown,
      )).toMatchInlineSnapshot
        (`"unknown"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.unknown (formatted)', () => {
      vi.expect.soft(recurse.toType(
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
      vi.expect.soft(recurse.toType(
        t.any,
      )).toMatchInlineSnapshot
        (`"any"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.any (formatted)', () => {
      vi.expect.soft(recurse.toType(
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
      vi.expect.soft(recurse.toType(
        t.void,
      )).toMatchInlineSnapshot
        (`"void"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.void (formatted)', () => {
      vi.expect.soft(recurse.toType(
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
      vi.expect.soft(recurse.toType(
        t.null,
      )).toMatchInlineSnapshot
        (`"null"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.null (formatted)', () => {
      vi.expect.soft(recurse.toType(
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
      vi.expect.soft(recurse.toType(
        t.undefined,
      )).toMatchInlineSnapshot
        (`"undefined"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.undefined (formatted)', () => {
      vi.expect.soft(recurse.toType(
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
      vi.expect.soft(recurse.toType(
        t.symbol,
      )).toMatchInlineSnapshot
        (`"symbol"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.symbol (formatted)', () => {
      vi.expect.soft(recurse.toType(
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
      vi.expect.soft(recurse.toType(
        t.boolean,
      )).toMatchInlineSnapshot
        (`"boolean"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.boolean (formatted)', () => {
      vi.expect.soft(recurse.toType(
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
      vi.expect.soft(recurse.toType(
        t.integer,
      )).toMatchInlineSnapshot
        (`"number"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.integer (formatted)', () => {
      vi.expect.soft(recurse.toType(
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
      vi.expect.soft(recurse.toType(
        t.bigint,
      )).toMatchInlineSnapshot
        (`"bigint"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.bigint (formatted)', () => {
      vi.expect.soft(recurse.toType(
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
      vi.expect.soft(recurse.toType(
        t.number,
      )).toMatchInlineSnapshot
        (`"number"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.number (bounds)', () => {
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
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.number (formatted)', () => {
      vi.expect.soft(recurse.toType(
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
      vi.expect.soft(recurse.toType(
        t.string,
      )).toMatchInlineSnapshot
        (`"string"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.string (formatted)', () => {
      vi.expect.soft(recurse.toType(
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
      vi.expect.soft(recurse.toType(
        t.array(t.string),
      )).toMatchInlineSnapshot
        (`"(string)[]"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.array (formatted)', () => {
      vi.expect.soft(recurse.toType(
        t.array(t.string),
        { format: true }
      )).toMatchInlineSnapshot
        (`"(string)[]"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.array (nested)', () => {
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
        (`"({ a: string, b: number, c: boolean, d: symbol, e: { f: null } })[]"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.array (formatted, nested)', () => {
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
        { format: true }
      )).toMatchInlineSnapshot
        (`"({ a: string, b: number, c: boolean, d: symbol, e: { f: null } })[]"`)
    })
    /////    t.array    /////
    /////////////////////////


    //////////////////////////
    /////    t.record    /////
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.record', () => {
      vi.expect.soft(recurse.toType(
        t.record(t.string),
      )).toMatchInlineSnapshot
        (`"Record<string, string>"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.record (formatted)', () => {
      vi.expect.soft(recurse.toType(
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
      vi.expect.soft(recurse.toType(
        t.optional(t.string),
      )).toMatchInlineSnapshot
        (`"(string | undefined)"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.optional (formatted)', () => {
      vi.expect.soft(recurse.toType(
        t.optional(t.string),
        { format: true }
      )).toMatchInlineSnapshot
        (`"(string | undefined)"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.optional (formatted w/ break)', () => {
      vi.expect.soft(recurse.toType(
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
      vi.expect.soft(recurse.toType(
        t.eq(100),
      )).toMatchInlineSnapshot
        (`"100"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.eq (formatted)', () => {
      vi.expect.soft(recurse.toType(
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
      vi.expect.soft(recurse.toType(
        t.union(t.string, t.boolean),
      )).toMatchInlineSnapshot
        (`"(string | boolean)"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.union (empty)', () => {
      vi.expect.soft(recurse.toType(
        t.union(),
        { format: true }
      )).toMatchInlineSnapshot
        (`"()"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.union (formatted)', () => {
      vi.expect.soft(recurse.toType(
        t.union(t.string, t.boolean),
        { format: true }
      )).toMatchInlineSnapshot
        (`"(string | boolean)"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.union (formatted w/ break)', () => {
      vi.expect.soft(recurse.toType(
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
      vi.expect.soft(recurse.toType(
        t.intersect(t.object({ a: t.string }), t.object({ b: t.boolean })),
      )).toMatchInlineSnapshot
        (`"({ a: string } & { b: boolean })"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.intersect (formatted)', () => {
      vi.expect.soft(recurse.toType(
        t.intersect(t.object({ a: t.string }), t.object({ b: t.boolean })),
        { format: true }
      )).toMatchInlineSnapshot
        (`"({ a: string } & { b: boolean })"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.intersect (formatted w/ break)', () => {
      vi.expect.soft(recurse.toType(
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
      vi.expect.soft(recurse.toType(
        t.tuple(t.object({ a: t.string }), t.object({ b: t.boolean })),
      )).toMatchInlineSnapshot
        (`"[{ a: string }, { b: boolean }]"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.tuple (formatted)', () => {
      vi.expect.soft(recurse.toType(
        t.tuple(t.object({ a: t.string }), t.object({ b: t.boolean })),
        { format: true }
      )).toMatchInlineSnapshot
        (`"[{ a: string }, { b: boolean }]"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.tuple (formatted)', () => {
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
      vi.expect.soft(recurse.toType(
        t.object({ a: t.string, b: t.optional(t.number) }),
      )).toMatchInlineSnapshot
        (`"{ a: string, b?: (number | undefined) }"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.object (empty)', () => {
      vi.expect.soft(recurse.toType(
        t.object({}),
        { format: true },
      )).toMatchInlineSnapshot
        (`"{}"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.object (formatted)', () => {
      vi.expect.soft(recurse.toType(
        t.object({ a: t.string, b: t.optional(t.number) }),
        { format: true }
      )).toMatchInlineSnapshot
        (`"{ a: string, b?: (number | undefined) }"`)
    })
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.object (nested) object', () => {
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
    vi.it('〖⛳️〗› ❲recurse.toType❳: t.object (nested + formatted)', () => {
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
      vi.assert.throws(() => recurse.schemaToString(Symbol.for('BAD DATA')))
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: null', () => {
      vi.expect.soft(recurse.jsonToString(
        null,
      )).toMatchInlineSnapshot
        (`"null"`)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: null (formatted)', () => {
      vi.expect.soft(recurse.jsonToString(
        null,
        { format: true }
      )).toMatchInlineSnapshot
        (`"null"`)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: boolean', () => {
      vi.expect.soft(recurse.jsonToString(
        true,
      )).toMatchInlineSnapshot
        (`"true"`)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: boolean (formatted)', () => {
      vi.expect.soft(recurse.jsonToString(
        true,
        { format: true }
      )).toMatchInlineSnapshot
        (`"true"`)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: boolean', () => {
      vi.expect.soft(recurse.jsonToString(
        false,
      )).toMatchInlineSnapshot
        (`"false"`)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: boolean (formatted)', () => {
      vi.expect.soft(recurse.jsonToString(
        false,
        { format: true }
      )).toMatchInlineSnapshot
        (`"false"`)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: number', () => {
      vi.expect.soft(recurse.jsonToString(
        0,
      )).toMatchInlineSnapshot
        (`"0"`)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: number', () => {
      vi.expect.soft(recurse.jsonToString(
        -0,
      )).toMatchInlineSnapshot
        (`"0"`)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: number (formatted)', () => {
      vi.expect.soft(recurse.jsonToString(
        0,
        { format: true }
      )).toMatchInlineSnapshot
        (`"0"`)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: string', () => {
      vi.expect.soft(recurse.jsonToString(
        '',
      )).toMatchInlineSnapshot
        (`""""`)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: string', () => {
      vi.expect.soft(recurse.jsonToString(
        '\\',
      )).toMatchInlineSnapshot
        (`""\\\\""`)
    })


    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: string', () => {
      vi.expect.soft(recurse.jsonToString(
        '""',
      )).toMatchInlineSnapshot
        (`""\\"\\"""`)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: string (formatted)', () => {
      vi.expect.soft(recurse.jsonToString(
        '',
        { format: true }
      )).toMatchInlineSnapshot
        (`""""`)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: array', () => {
      vi.expect.soft(recurse.jsonToString(
        [null],
      )).toMatchInlineSnapshot
        (`"[null]"`)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: array (empty)', () => {
      vi.expect.soft(recurse.jsonToString(
        [],
      )).toMatchInlineSnapshot
        (`"[]"`)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: array (formatted)', () => {
      vi.expect.soft(recurse.jsonToString(
        [''],
        { format: true }
      )).toMatchInlineSnapshot
        (`"[""]"`)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: array (formatted w/ break)', () => {
      vi.expect.soft(recurse.jsonToString(
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
      vi.expect.soft(recurse.jsonToString(
        { a: null },
      )).toMatchInlineSnapshot
        (`"{ a: null }"`)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: object (empty)', () => {
      vi.expect.soft(recurse.jsonToString(
        {},
      )).toMatchInlineSnapshot
        (`"{}"`)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: object (formatted)', () => {
      vi.expect.soft(recurse.jsonToString(
        [''],
        { format: true }
      )).toMatchInlineSnapshot
        (`"[""]"`)
    })

    vi.it('〖⛳️〗› ❲recurse.jsonToString❳: object (formatted w/ break)', () => {
      vi.expect.soft(recurse.jsonToString(
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
