import * as vi from 'vitest'
import * as fc from 'fast-check'
import { recurse, t } from '@traversable/schema'
import { fn } from '@traversable/registry'

const defaultOptions = { typeName: 'Type' }

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema❳: recurse.schemaToString', () => {
  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: throws when given a non-schema', () => {
    /* @ts-expect-error - bad input raises a TypeError */
    vi.assert.throws(() => recurse.schemaToString(Symbol.for('BAD DATA')))
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.never', () => {
    vi.expect.soft(
      recurse.schemaToString(
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
        )
      )).toMatchInlineSnapshot
      (`"t.tuple(t.object({a: t.eq([1,[2],{"3":4}]),b: t.optional(t.record(t.array(t.union(t.number,t.eq(1)))))}))"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.never', () => {
    vi.expect.soft(recurse.schemaToString(
      t.never,
    )).toMatchInlineSnapshot
      (`"t.never"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.never (formatted)', () => {
    vi.expect.soft(recurse.schemaToString(
      t.never
    )).toMatchInlineSnapshot
      (`"t.never"`)
  })


  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.unknown', () => {
    vi.expect.soft(recurse.schemaToString(
      t.unknown,
    )).toMatchInlineSnapshot
      (`"t.unknown"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.unknown (formatted)', () => {
    vi.expect.soft(recurse.schemaToString(
      t.unknown
    )).toMatchInlineSnapshot
      (`"t.unknown"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.any', () => {
    vi.expect.soft(recurse.schemaToString(
      t.any,
    )).toMatchInlineSnapshot
      (`"t.any"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.any (formatted)', () => {
    vi.expect.soft(recurse.schemaToString(
      t.any
    )).toMatchInlineSnapshot
      (`"t.any"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.void', () => {
    vi.expect.soft(recurse.schemaToString(
      t.void,
    )).toMatchInlineSnapshot
      (`"t.void"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.void (formatted)', () => {
    vi.expect.soft(recurse.schemaToString(
      t.void
    )).toMatchInlineSnapshot
      (`"t.void"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.null', () => {
    vi.expect.soft(recurse.schemaToString(
      t.null,
    )).toMatchInlineSnapshot
      (`"t.null"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.null (formatted)', () => {
    vi.expect.soft(recurse.schemaToString(
      t.null
    )).toMatchInlineSnapshot
      (`"t.null"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.undefined', () => {
    vi.expect.soft(recurse.schemaToString(
      t.undefined,
    )).toMatchInlineSnapshot
      (`"t.undefined"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.undefined (formatted)', () => {
    vi.expect.soft(recurse.schemaToString(
      t.undefined
    )).toMatchInlineSnapshot
      (`"t.undefined"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.symbol', () => {
    vi.expect.soft(recurse.schemaToString(
      t.symbol,
    )).toMatchInlineSnapshot
      (`"t.symbol"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.symbol (formatted)', () => {
    vi.expect.soft(recurse.schemaToString(
      t.symbol
    )).toMatchInlineSnapshot
      (`"t.symbol"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.boolean', () => {
    vi.expect.soft(recurse.schemaToString(
      t.boolean,
    )).toMatchInlineSnapshot
      (`"t.boolean"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.boolean (formatted)', () => {
    vi.expect.soft(recurse.schemaToString(
      t.boolean,
    )).toMatchInlineSnapshot
      (`"t.boolean"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.integer', () => {
    vi.expect.soft(recurse.schemaToString(
      t.integer,
    )).toMatchInlineSnapshot
      (`"t.integer"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.integer (formatted)', () => {
    vi.expect.soft(recurse.schemaToString(
      t.integer,
    )).toMatchInlineSnapshot
      (`"t.integer"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.bigint', () => {
    vi.expect.soft(recurse.schemaToString(
      t.bigint,
    )).toMatchInlineSnapshot
      (`"t.bigint"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.bigint (formatted)', () => {
    vi.expect.soft(recurse.schemaToString(
      t.bigint,
    )).toMatchInlineSnapshot
      (`"t.bigint"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.number', () => {
    vi.expect.soft(recurse.schemaToString(
      t.number,
    )).toMatchInlineSnapshot
      (`"t.number"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.number (bounds)', () => {
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


  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.number (formatted)', () => {
    vi.expect.soft(recurse.schemaToString(
      t.number,
    )).toMatchInlineSnapshot
      (`"t.number"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.string', () => {
    vi.expect.soft(recurse.schemaToString(
      t.string,
    )).toMatchInlineSnapshot
      (`"t.string"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.string (formatted)', () => {
    vi.expect.soft(recurse.schemaToString(
      t.string,
    )).toMatchInlineSnapshot
      (`"t.string"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.array', () => {
    vi.expect.soft(recurse.schemaToString(
      t.array(t.string),
    )).toMatchInlineSnapshot
      (`"t.array(t.string)"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.array (formatted)', () => {
    vi.expect.soft(recurse.schemaToString(
      t.array(t.string),
    )).toMatchInlineSnapshot
      (`"t.array(t.string)"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.record', () => {
    vi.expect.soft(recurse.schemaToString(
      t.record(t.string),
    )).toMatchInlineSnapshot
      (`"t.record(t.string)"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.record (formatted)', () => {
    vi.expect.soft(recurse.schemaToString(
      t.record(t.string),
    )).toMatchInlineSnapshot
      (`"t.record(t.string)"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.optional', () => {
    vi.expect.soft(recurse.schemaToString(
      t.optional(t.string),
    )).toMatchInlineSnapshot
      (`"t.optional(t.string)"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.optional (formatted)', () => {
    vi.expect.soft(recurse.schemaToString(
      t.optional(t.string),
    )).toMatchInlineSnapshot
      (`"t.optional(t.string)"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.optional (formatted w/ break)', () => {
    vi.expect.soft(recurse.schemaToString(
      t.optional(t.optional(t.optional(t.optional(t.optional(t.optional(t.optional(t.optional(t.optional(t.string))))))))),
    )).toMatchInlineSnapshot
      (`"t.optional(t.optional(t.optional(t.optional(t.optional(t.optional(t.optional(t.optional(t.optional(t.string)))))))))"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.eq', () => {
    vi.expect.soft(recurse.schemaToString(
      t.eq(100),
    )).toMatchInlineSnapshot
      (`"t.eq(100)"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.eq (formatted)', () => {
    vi.expect.soft(recurse.schemaToString(
      t.eq(100),
    )).toMatchInlineSnapshot
      (`"t.eq(100)"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.union', () => {
    vi.expect.soft(recurse.schemaToString(
      t.union(t.string, t.boolean),
    )).toMatchInlineSnapshot
      (`"t.union(t.string,t.boolean)"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.union (empty)', () => {
    vi.expect.soft(recurse.schemaToString(
      t.union(),
    )).toMatchInlineSnapshot
      (`"t.union()"`)
  })


  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.union (formatted)', () => {
    vi.expect.soft(recurse.schemaToString(
      t.union(t.string, t.boolean),
    )).toMatchInlineSnapshot
      (`"t.union(t.string,t.boolean)"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.union (formatted w/ break)', () => {
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
    )).toMatchInlineSnapshot
      (`"t.union(t.union(t.union(t.union(t.union(t.union(t.union(t.union(t.union(t.union(t.union(t.union(t.string,t.boolean),t.eq(1)),t.eq(2)),t.eq(3)),t.eq(4)),t.eq(5)),t.eq(6)),t.eq(7)),t.eq(8)),t.eq(9)),t.eq(10)),t.eq(11))"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.array (formatted w/ break)', () => {
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
    )).toMatchInlineSnapshot
      (`"t.array(t.array(t.union(t.array(t.array(t.union(t.array(t.array(t.union(t.array(t.array(t.union(t.string,t.boolean))),t.eq(1)))),t.eq(2)))),t.eq(3))))"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.intersect', () => {
    vi.expect.soft(recurse.schemaToString(
      t.intersect(t.object({ a: t.string }), t.object({ b: t.boolean })),
    )).toMatchInlineSnapshot
      (`"t.intersect(t.object({a: t.string}),t.object({b: t.boolean}))"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.intersect (formatted)', () => {
    vi.expect.soft(recurse.schemaToString(
      t.intersect(t.object({ a: t.string }), t.object({ b: t.boolean })),
    )).toMatchInlineSnapshot
      (`"t.intersect(t.object({a: t.string}),t.object({b: t.boolean}))"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.intersect (formatted w/ break)', () => {
    vi.expect.soft(recurse.schemaToString(
      t.intersect(t.intersect(t.intersect(t.intersect(t.intersect(t.object({ a: t.string }), t.object({ b: t.boolean })))))),
    )).toMatchInlineSnapshot
      (`"t.intersect(t.intersect(t.intersect(t.intersect(t.intersect(t.object({a: t.string}),t.object({b: t.boolean}))))))"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.tuple', () => {
    vi.expect.soft(recurse.schemaToString(
      t.tuple(t.object({ a: t.string }), t.object({ b: t.boolean })),
    )).toMatchInlineSnapshot
      (`"t.tuple(t.object({a: t.string}),t.object({b: t.boolean}))"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.tuple (formatted)', () => {
    vi.expect.soft(recurse.schemaToString(
      t.tuple(t.object({ a: t.string }), t.object({ b: t.boolean })),
    )).toMatchInlineSnapshot
      (`"t.tuple(t.object({a: t.string}),t.object({b: t.boolean}))"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.tuple (formatted w/ break)', () => {
    vi.expect.soft(recurse.schemaToString(
      t.tuple(t.array(t.tuple(t.array(t.array(t.tuple(t.tuple(t.tuple(t.tuple(t.object({ a: t.string }), t.array(t.object({ b: t.array(t.boolean) }))))))))))),
    )).toMatchInlineSnapshot
      (`"t.tuple(t.array(t.tuple(t.array(t.array(t.tuple(t.tuple(t.tuple(t.tuple(t.object({a: t.string}),t.array(t.object({b: t.array(t.boolean)})))))))))))"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.object', () => {
    vi.expect.soft(recurse.schemaToString(
      t.object({ a: t.string, b: t.optional(t.number) }),
    )).toMatchInlineSnapshot
      (`"t.object({a: t.string,b: t.optional(t.number)})"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.object (empty)', () => {
    vi.expect.soft(recurse.schemaToString(
      t.object({}),
    )).toMatchInlineSnapshot
      (`"t.object({})"`)
  })


  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.object (formatted)', () => {
    vi.expect.soft(recurse.schemaToString(
      t.object({ a: t.string, b: t.optional(t.number) }),
    )).toMatchInlineSnapshot
      (`"t.object({a: t.string,b: t.optional(t.number)})"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: nested object', () => {
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
      (`"t.record(t.object({a: t.string,b: t.object({c: t.object({d: t.boolean,e: t.integer,f: t.number,g: t.void})})}))"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: nested object (formatted)', () => {
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
    )).toMatchInlineSnapshot
      (`"t.record(t.object({a: t.string,b: t.object({c: t.object({d: t.boolean,e: t.integer,f: t.number,g: t.void,h: t.eq(1000000),i: t.undefined})})}))"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: nested array', () => {
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
      (`"t.array(t.object({a: t.string,b: t.integer,c: t.boolean,d: t.symbol,e: t.object({f: t.null})}))"`)
  })

  vi.test('〖⛳️〗› ❲recurse.schemaToString❳: nested array (formatted)', () => {
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
    )).toMatchInlineSnapshot
      (`"t.array(t.object({a: t.string,b: t.integer,c: t.boolean,d: t.symbol,e: t.object({f: t.null}),f: t.undefined}))"`)
  })
}
)

vi.describe(
  '〖⛳️〗‹‹‹ ❲@traverable/schema❳: recurse.schemaToString',
  () => {
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: throws when given a non-schema', () => {
      /* @ts-expect-error - bad input raises a TypeError */
      vi.assert.throws(() => recurse.schemaToString(Symbol.for('BAD DATA')))
    })

    /////////////////////////
    /////    t.never    /////
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.never', () => {
      vi.expect.soft(recurse.schemaToString(
        t.never,
      )).toMatchInlineSnapshot
        (`"t.never"`)
    })
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.never (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.never,
      )).toMatchInlineSnapshot
        (`"t.never"`)
    })
    /////    t.never    /////
    /////////////////////////


    ///////////////////////////
    /////    t.unknown    /////
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.unknown', () => {
      vi.expect.soft(recurse.schemaToString(
        t.unknown,
      )).toMatchInlineSnapshot
        (`"t.unknown"`)
    })
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.unknown (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.unknown,
      )).toMatchInlineSnapshot
        (`"t.unknown"`)
    })
    /////    t.unknown    /////
    ///////////////////////////


    ///////////////////////
    /////    t.any    /////
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.any', () => {
      vi.expect.soft(recurse.schemaToString(
        t.any,
      )).toMatchInlineSnapshot
        (`"t.any"`)
    })
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.any (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.any,
      )).toMatchInlineSnapshot
        (`"t.any"`)
    })
    /////    t.any    /////
    ///////////////////////


    ////////////////////////
    /////    t.void    /////
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.void', () => {
      vi.expect.soft(recurse.schemaToString(
        t.void,
      )).toMatchInlineSnapshot
        (`"t.void"`)
    })
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.void (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.void,
      )).toMatchInlineSnapshot
        (`"t.void"`)
    })
    /////    t.void    /////
    ////////////////////////


    ////////////////////////
    /////    t.null    /////
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.null', () => {
      vi.expect.soft(recurse.schemaToString(
        t.null,
      )).toMatchInlineSnapshot
        (`"t.null"`)
    })
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.null (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.null,
      )).toMatchInlineSnapshot
        (`"t.null"`)
    })
    /////    t.null    /////
    ////////////////////////


    /////////////////////////////
    /////    t.undefined    /////
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.undefined', () => {
      vi.expect.soft(recurse.schemaToString(
        t.undefined,
      )).toMatchInlineSnapshot
        (`"t.undefined"`)
    })
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.undefined (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.undefined,
      )).toMatchInlineSnapshot
        (`"t.undefined"`)
    })
    /////    t.undefined    /////
    /////////////////////////////


    //////////////////////////
    /////    t.symbol    /////
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.symbol', () => {
      vi.expect.soft(recurse.schemaToString(
        t.symbol,
      )).toMatchInlineSnapshot
        (`"t.symbol"`)
    })
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.symbol (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.symbol,
      )).toMatchInlineSnapshot
        (`"t.symbol"`)
    })
    /////    t.symbol    /////
    //////////////////////////


    ///////////////////////////
    /////    t.boolean    /////
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.boolean', () => {
      vi.expect.soft(recurse.schemaToString(
        t.boolean,
      )).toMatchInlineSnapshot
        (`"t.boolean"`)
    })
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.boolean (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.boolean,
      )).toMatchInlineSnapshot
        (`"t.boolean"`)
    })
    /////    t.boolean    /////
    ///////////////////////////


    ///////////////////////////
    /////    t.integer    /////
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.integer', () => {
      vi.expect.soft(recurse.schemaToString(
        t.integer,
      )).toMatchInlineSnapshot
        (`"t.integer"`)
    })
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.integer (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.integer,
      )).toMatchInlineSnapshot
        (`"t.integer"`)
    })
    /////    t.integer    /////
    ///////////////////////////


    //////////////////////////
    /////    t.bigint    /////
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.bigint', () => {
      vi.expect.soft(recurse.schemaToString(
        t.bigint,
      )).toMatchInlineSnapshot
        (`"t.bigint"`)
    })
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.bigint (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.bigint,
      )).toMatchInlineSnapshot
        (`"t.bigint"`)
    })
    /////    t.bigint    /////
    //////////////////////////


    //////////////////////////
    /////    t.number    /////
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.number', () => {
      vi.expect.soft(recurse.schemaToString(
        t.number,
      )).toMatchInlineSnapshot
        (`"t.number"`)
    })
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.number (bounds)', () => {
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
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.number (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.number,
      )).toMatchInlineSnapshot
        (`"t.number"`)
    })
    /////    t.number    /////
    //////////////////////////


    //////////////////////////
    /////    t.string    /////
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.string', () => {
      vi.expect.soft(recurse.schemaToString(
        t.string,
      )).toMatchInlineSnapshot
        (`"t.string"`)
    })
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.string (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.string,
      )).toMatchInlineSnapshot
        (`"t.string"`)
    })
    /////    t.string    /////
    //////////////////////////


    /////////////////////////
    /////    t.array    /////
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.array', () => {
      vi.expect.soft(recurse.schemaToString(
        t.array(t.string),
      )).toMatchInlineSnapshot
        (`"t.array(t.string)"`)
    })
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.array (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.array(t.string),
      )).toMatchInlineSnapshot
        (`"t.array(t.string)"`)
    })
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.array (nested)', () => {
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
        (`"t.array(t.object({a: t.string,b: t.integer,c: t.boolean,d: t.symbol,e: t.object({f: t.null})}))"`)
    })
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.array (formatted, nested)', () => {
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
        ),
      )).toMatchInlineSnapshot
        (`"t.array(t.object({a: t.string,b: t.integer,c: t.boolean,d: t.symbol,e: t.object({f: t.null})}))"`)
    })
    /////    t.array    /////
    /////////////////////////


    //////////////////////////
    /////    t.record    /////
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.record', () => {
      vi.expect.soft(recurse.schemaToString(
        t.record(t.string),
      )).toMatchInlineSnapshot
        (`"t.record(t.string)"`)
    })
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.record (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.record(t.string),
      )).toMatchInlineSnapshot
        (`"t.record(t.string)"`)
    })
    /////    t.record    /////
    //////////////////////////


    ////////////////////////////
    /////    t.optional    /////
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.optional', () => {
      vi.expect.soft(recurse.schemaToString(
        t.optional(t.string),
      )).toMatchInlineSnapshot
        (`"t.optional(t.string)"`)
    })
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.optional (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.optional(t.string),
      )).toMatchInlineSnapshot
        (`"t.optional(t.string)"`)
    })
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.optional (formatted w/ break)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.optional(t.optional(t.optional(t.optional(t.optional(t.optional(t.optional(t.optional(t.optional(t.string))))))))),
      )).toMatchInlineSnapshot
        (`"t.optional(t.optional(t.optional(t.optional(t.optional(t.optional(t.optional(t.optional(t.optional(t.string)))))))))"`)
    })
    /////    t.optional    /////
    ////////////////////////////


    //////////////////////
    /////    t.eq    /////
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.eq', () => {
      vi.expect.soft(recurse.schemaToString(
        t.eq(100),
      )).toMatchInlineSnapshot
        (`"t.eq(100)"`)
    })
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.eq (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.eq(100),
      )).toMatchInlineSnapshot
        (`"t.eq(100)"`)
    })
    /////    t.eq    /////
    //////////////////////


    /////////////////////////
    /////    t.union    /////
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.union', () => {
      vi.expect.soft(recurse.schemaToString(
        t.union(t.string, t.boolean),
      )).toMatchInlineSnapshot
        (`"t.union(t.string,t.boolean)"`)
    })
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.union (empty)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.union(),
      )).toMatchInlineSnapshot
        (`"t.union()"`)
    })
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.union (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.union(t.string, t.boolean),
      )).toMatchInlineSnapshot
        (`"t.union(t.string,t.boolean)"`)
    })
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.union (formatted w/ break)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.union(t.union(t.union(t.union(t.union(t.union(t.union(t.union(t.union(t.union(t.string, t.boolean)))))))))),
      )).toMatchInlineSnapshot
        (`"t.union(t.union(t.union(t.union(t.union(t.union(t.union(t.union(t.union(t.union(t.string,t.boolean))))))))))"`)
    })
    /////    t.union    /////
    /////////////////////////


    /////////////////////////////
    /////    t.intersect    /////
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.intersect', () => {
      vi.expect.soft(recurse.schemaToString(
        t.intersect(t.object({ a: t.string }), t.object({ b: t.boolean })),
      )).toMatchInlineSnapshot
        (`"t.intersect(t.object({a: t.string}),t.object({b: t.boolean}))"`)
    })
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.intersect (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.intersect(t.object({ a: t.string }), t.object({ b: t.boolean })),
      )).toMatchInlineSnapshot
        (`"t.intersect(t.object({a: t.string}),t.object({b: t.boolean}))"`)
    })
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.intersect (formatted w/ break)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.intersect(t.intersect(t.intersect(t.intersect(t.intersect(t.object({ a: t.string }), t.object({ b: t.boolean })))))),
      )).toMatchInlineSnapshot
        (`"t.intersect(t.intersect(t.intersect(t.intersect(t.intersect(t.object({a: t.string}),t.object({b: t.boolean}))))))"`)
    })
    /////    t.intersect    /////
    /////////////////////////////


    /////////////////////////
    /////    t.tuple    /////
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.tuple', () => {
      vi.expect.soft(recurse.schemaToString(
        t.tuple(t.object({ a: t.string }), t.object({ b: t.boolean })),
      )).toMatchInlineSnapshot
        (`"t.tuple(t.object({a: t.string}),t.object({b: t.boolean}))"`)
    })
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.tuple (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.tuple(t.object({ a: t.string }), t.object({ b: t.boolean })),
      )).toMatchInlineSnapshot
        (`"t.tuple(t.object({a: t.string}),t.object({b: t.boolean}))"`)
    })
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.tuple (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
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
      )).toMatchInlineSnapshot
        (`"t.tuple(t.array(t.tuple(t.optional(t.union(t.object({a: t.string}),t.object({b: t.boolean}))),t.optional(t.object({z: t.object({c: t.object({d: t.boolean,e: t.integer,f: t.number,g: t.void})})})))))"`)
    })
    /////    t.tuple    /////
    /////////////////////////


    //////////////////////////
    /////    t.object    /////
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.object', () => {
      vi.expect.soft(recurse.schemaToString(
        t.object({ a: t.string, b: t.optional(t.number) }),
      )).toMatchInlineSnapshot
        (`"t.object({a: t.string,b: t.optional(t.number)})"`)
    })
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.object (empty)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.object({}),
      )).toMatchInlineSnapshot
        (`"t.object({})"`)
    })
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.object (formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
        t.object({ a: t.string, b: t.optional(t.number) }),
      )).toMatchInlineSnapshot
        (`"t.object({a: t.string,b: t.optional(t.number)})"`)
    })
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.object (nested) object', () => {
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
        (`"t.record(t.object({a: t.string,b: t.object({c: t.object({d: t.boolean,e: t.integer,f: t.number,g: t.void})})}))"`)
    })
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.object (nested + formatted)', () => {
      vi.expect.soft(recurse.schemaToString(
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
      )).toMatchInlineSnapshot
        (`"t.object({ROOT_A: t.record(t.object({a: t.string,b: t.object({c: t.object({d: t.boolean,e: t.integer,f: t.number,g: t.void})})})),ROOT_B: t.optional(t.unknown)})"`)
    })
    vi.test('〖⛳️〗› ❲recurse.schemaToString❳: t.object (formatted w/ break)', () => {
      vi.expect.soft(recurse.schemaToString(
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
      )).toMatchInlineSnapshot
        (`"t.object({a: t.object({b: t.eq(10000),c: t.object({d: t.eq(9000),e: t.object({f: t.eq(8000),g: t.object({h: t.eq(7000),i: t.object({j: t.eq(6000),k: t.object({l: t.eq(5000),m: t.object({n: t.eq(4000),o: t.object({p: t.eq(3000),q: t.object({r: t.eq(2000),s: t.object({t: t.eq(1000)})})})})})})})})})})})"`)
    })
    /////    t.object    /////
    //////////////////////////
  }
)

vi.describe(
  '〖⛳️〗‹‹‹ ❲@traverable/schema❳: recurse.jsonToType',
  () => {
    vi.test('〖⛳️〗› ❲recurse.jsonToType❳: throws when given bad input', () => {
      /* @ts-expect-error - bad input raises a TypeError */
      vi.assert.throws(() => recurse.schemaToString(Symbol.for('BAD DATA')))
    })

    vi.test('〖⛳️〗› ❲recurse.jsonToType❳: null', () => {
      vi.expect.soft(recurse.jsonToType(
        null,
      )).toMatchInlineSnapshot
        (`"null"`)
    })

    vi.test('〖⛳️〗› ❲recurse.jsonToType❳: null (formatted)', () => {
      vi.expect.soft(recurse.jsonToType(
        null,
      )).toMatchInlineSnapshot
        (`"null"`)
    })

    vi.test('〖⛳️〗› ❲recurse.jsonToType❳: boolean', () => {
      vi.expect.soft(recurse.jsonToType(
        true,
      )).toMatchInlineSnapshot
        (`"true"`)
    })

    vi.test('〖⛳️〗› ❲recurse.jsonToType❳: boolean (formatted)', () => {
      vi.expect.soft(recurse.jsonToType(
        true,
      )).toMatchInlineSnapshot
        (`"true"`)
    })

    vi.test('〖⛳️〗› ❲recurse.jsonToType❳: boolean', () => {
      vi.expect.soft(recurse.jsonToType(
        false,
      )).toMatchInlineSnapshot
        (`"false"`)
    })

    vi.test('〖⛳️〗› ❲recurse.jsonToType❳: boolean (formatted)', () => {
      vi.expect.soft(recurse.jsonToType(
        false,
      )).toMatchInlineSnapshot
        (`"false"`)
    })

    vi.test('〖⛳️〗› ❲recurse.jsonToType❳: number', () => {
      vi.expect.soft(recurse.jsonToType(
        0,
      )).toMatchInlineSnapshot
        (`"0"`)
    })

    vi.test('〖⛳️〗› ❲recurse.jsonToType❳: number', () => {
      vi.expect.soft(recurse.jsonToType(
        -0,
      )).toMatchInlineSnapshot
        (`"0"`)
    })

    vi.test('〖⛳️〗› ❲recurse.jsonToType❳: number (formatted)', () => {
      vi.expect.soft(recurse.jsonToType(
        0,
      )).toMatchInlineSnapshot
        (`"0"`)
    })

    vi.test('〖⛳️〗› ❲recurse.jsonToType❳: string', () => {
      vi.expect.soft(recurse.jsonToType(
        '',
      )).toMatchInlineSnapshot
        (`""""`)
    })

    vi.test('〖⛳️〗› ❲recurse.jsonToType❳: string', () => {
      vi.expect.soft(recurse.jsonToType(
        '\\',
      )).toMatchInlineSnapshot
        (`""\\\\""`)
    })

    vi.test('〖⛳️〗› ❲recurse.jsonToType❳: string', () => {
      vi.expect.soft(recurse.jsonToType(
        '""',
      )).toMatchInlineSnapshot
        (`""\\"\\"""`)
    })

    vi.test('〖⛳️〗› ❲recurse.jsonToType❳: string (formatted)', () => {
      vi.expect.soft(recurse.jsonToType(
        '',
      )).toMatchInlineSnapshot
        (`""""`)
    })

    vi.test('〖⛳️〗› ❲recurse.jsonToType❳: array', () => {
      vi.expect.soft(recurse.jsonToType(
        [null],
      )).toMatchInlineSnapshot
        (`"[null]"`)
    })

    vi.test('〖⛳️〗› ❲recurse.jsonToType❳: array (empty)', () => {
      vi.expect.soft(recurse.jsonToType(
        [],
      )).toMatchInlineSnapshot
        (`"[]"`)
    })

    vi.test('〖⛳️〗› ❲recurse.jsonToType❳: array (formatted)', () => {
      vi.expect.soft(recurse.jsonToType(
        [''],
      )).toMatchInlineSnapshot
        (`"[""]"`)
    })

    vi.test('〖⛳️〗› ❲recurse.jsonToType❳: array (formatted w/ break)', () => {
      vi.expect.soft(recurse.jsonToType(
        [1_000, [2_000, [3_000, [4_000, [5_000, [6_000, [7_000, [8_000, [9_000, [10_000, [11_000, [12_000, [13_000]]]]]]]]]]]]],
      )).toMatchInlineSnapshot
        (`"[1000, [2000, [3000, [4000, [5000, [6000, [7000, [8000, [9000, [10000, [11000, [12000, [13000]]]]]]]]]]]]]"`)
    })

    vi.test('〖⛳️〗› ❲recurse.jsonToType❳: object', () => {
      vi.expect.soft(recurse.jsonToType(
        { a: null },
      )).toMatchInlineSnapshot
        (`"{ a: null }"`)
    })

    vi.test('〖⛳️〗› ❲recurse.jsonToType❳: object (empty)', () => {
      vi.expect.soft(recurse.jsonToType(
        {},
      )).toMatchInlineSnapshot
        (`"{}"`)
    })

    vi.test('〖⛳️〗› ❲recurse.jsonToType❳: object (formatted)', () => {
      vi.expect.soft(recurse.jsonToType(
        [''],
      )).toMatchInlineSnapshot
        (`"[""]"`)
    })

    vi.test('〖⛳️〗› ❲recurse.jsonToType❳: object (formatted w/ break)', () => {
      vi.expect.soft(recurse.jsonToType(
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
      )).toMatchInlineSnapshot
        (`"{ abc: [1, { ABC: [2, { def: [2, { DEF: [3, { ghi: [3, { GHI: [4, { jkl: [4, { JKL: [5, { mno: [6, { MNO: [6, { pqr: [7, { PQR: [8, { stu: [9, { STU: [10, { vwx: [11, { VWX: [12, { yz: [13, { YZ: 14 }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }] }"`)
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

  vi.test('〖⛳️〗› ❲JsonFunctor❳: preserves identity morphism (examples)', () => {
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

  vi.test('〖⛳️〗› ❲JsonFunctor❳: composition is associative (examples)', () => {
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

  vi.test('〖⛳️〗› ❲JsonFunctor❳: preserves identity morphism (property)', () => {
    fc.check(
      fc.property(
        fc.jsonValue(),
        (json) => vi.assert.deepEqual(map(identity)(json), json)
      ), {
      endOnFailure: true,
      // numRuns: 10_000,
      examples: [[{ ['__proto__']: null }]],
    })
  })

  vi.test('〖⛳️〗› ❲JsonFunctor❳: composition is associative (property)', () => {
    fc.check(
      fc.property(fc.jsonValue(), (json) => vi.assert.deepEqual(
        map(fn.flow(JSON.stringify, (x) => x.length > 5))(json),
        map((x: string) => x.length > 5)(map(JSON.stringify)(json)),
      )), {
      endOnFailure: true,
      // numRuns: 10_000,
    })
  })
})
