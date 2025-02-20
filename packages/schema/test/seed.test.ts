import * as vi from 'vitest'
import { fc, test } from '@fast-check/vitest'

import { URI } from '@traversable/registry'
import { t, Seed } from '@traversable/schema'

/** @internal */
const builder = fc.letrec(Seed.seed())

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema/seed❳', () => {
  test.prop([builder.tree], { numRuns: 1000 })(
    '〖⛳️〗› ❲Seed#Functor❳: preserves structure',
    (seed) => vi.assert.deepEqual(Seed.identity(seed), seed)
  )

  const tupleLength_13 = fc.letrec(Seed.seed({ tuple: { minLength: 1, maxLength: 3 } })).tuple
  const tupleLength_15 = fc.letrec(Seed.seed({ tuple: { minLength: 1, maxLength: 5 } })).tuple
  const tupleLength_35 = fc.letrec(Seed.seed({ tuple: { minLength: 3, maxLength: 5 } })).tuple
  test.prop([tupleLength_13, tupleLength_15, tupleLength_35], {})(
    '〖⛳️〗› ❲Seed#tuple❳: applies options',
    (_13, _15, _35) => {
      vi.assert.equal(_13[0], URI.tuple)
      vi.assert.equal(_15[0], URI.tuple)
      vi.assert.equal(_35[0], URI.tuple)
      vi.assert.isArray(_13[1])
      vi.assert.isArray(_15[1])
      vi.assert.isArray(_35[1])
      vi.assert.isAtLeast(_13[1].length, 1)
      vi.assert.isAtMost(_13[1].length, 3)
      vi.assert.isAtLeast(_15[1].length, 1)
      vi.assert.isAtMost(_15[1].length, 5)
      vi.assert.isAtLeast(_35[1].length, 3)
      vi.assert.isAtMost(_35[1].length, 5)
    }
  );

  const objectKeys_13 = fc.letrec(Seed.seed({ object: { min: 1, max: 3 } })).object
  const objectKeys_15 = fc.letrec(Seed.seed({ object: { min: 1, max: 5 } })).object
  const objectKeys_35 = fc.letrec(Seed.seed({ object: { min: 3, max: 5 } })).object
  test.prop([objectKeys_13, objectKeys_15, objectKeys_35], {})(
    '〖⛳️〗› ❲Seed#object❳: applies options',
    (_13, _15, _35) => {
      vi.assert.equal(_13[0], URI.object)
      vi.assert.equal(_15[0], URI.object)
      vi.assert.equal(_35[0], URI.object)
      vi.assert.isArray(_13[1])
      vi.assert.isArray(_15[1])
      vi.assert.isArray(_35[1])
      vi.assert.isAtLeast(_13[1].length, 1)
      vi.assert.isAtMost(_13[1].length, 3)
      vi.assert.isAtLeast(_15[1].length, 1)
      vi.assert.isAtMost(_15[1].length, 5)
      vi.assert.isAtLeast(_35[1].length, 3)
      vi.assert.isAtMost(_35[1].length, 5)
    }
  );

  const unionSize_13 = fc.letrec(Seed.seed({ union: { minLength: 1, maxLength: 3 } })).union
  const unionSize_15 = fc.letrec(Seed.seed({ union: { minLength: 1, maxLength: 5 } })).union
  const unionSize_35 = fc.letrec(Seed.seed({ union: { minLength: 3, maxLength: 5 } })).union
  test.prop([unionSize_13, unionSize_15, unionSize_35], {})(
    '〖⛳️〗› ❲Seed#union❳: applies options',
    (_13, _15, _35) => {
      vi.assert.equal(_13[0], URI.union)
      vi.assert.equal(_15[0], URI.union)
      vi.assert.equal(_35[0], URI.union)
      vi.assert.isArray(_13[1])
      vi.assert.isArray(_15[1])
      vi.assert.isArray(_35[1])
      vi.assert.isAtLeast(_13[1].length, 1)
      vi.assert.isAtMost(_13[1].length, 3)
      vi.assert.isAtLeast(_15[1].length, 1)
      vi.assert.isAtMost(_15[1].length, 5)
      vi.assert.isAtLeast(_35[1].length, 3)
      vi.assert.isAtMost(_35[1].length, 5)
    }
  )

  const intersectSize_13 = fc.letrec(Seed.seed({ intersect: { minLength: 1, maxLength: 3 } })).intersect
  const intersectSize_15 = fc.letrec(Seed.seed({ intersect: { minLength: 1, maxLength: 5 } })).intersect
  const intersectSize_35 = fc.letrec(Seed.seed({ intersect: { minLength: 3, maxLength: 5 } })).intersect
  test.prop([intersectSize_13, intersectSize_15, intersectSize_35], {})(
    '〖⛳️〗› ❲Seed#intersect❳: applies options',
    (_13, _15, _35) => {
      vi.assert.equal(_13[0], URI.intersect)
      vi.assert.equal(_15[0], URI.intersect)
      vi.assert.equal(_35[0], URI.intersect)
      vi.assert.isArray(_13[1])
      vi.assert.isArray(_15[1])
      vi.assert.isArray(_35[1])
      vi.assert.isAtLeast(_13[1].length, 1)
      vi.assert.isAtMost(_13[1].length, 3)
      vi.assert.isAtLeast(_15[1].length, 1)
      vi.assert.isAtMost(_15[1].length, 5)
      vi.assert.isAtLeast(_35[1].length, 3)
      vi.assert.isAtMost(_35[1].length, 5)
    }
  )

  vi.it('〖⛳️〗› ❲Seed#sortOptionalsLast❳', () => {
    const ex_01 = ([t.optional(t.boolean), t.string, t.optional(t.null)] as t.Fixpoint[]).sort(Seed.sortOptionalsLast)
    vi.assert.deepEqual(ex_01.map((ex) => ex.tag), [URI.string, URI.optional, URI.optional])
    const ex_02 = ([t.string, t.number] as t.Fixpoint[]).sort(Seed.sortOptionalsLast)
    vi.assert.deepEqual(ex_02.map((ex) => ex.tag), [URI.string, URI.number])
    const ex_03 = ([t.optional(t.never), t.string, t.number] as t.Fixpoint[]).sort(Seed.sortOptionalsLast)
    vi.assert.deepEqual(ex_03.map((ex) => ex.tag), [URI.string, URI.number, URI.optional])
  })

})

vi.describe('eq', () => {
  vi.it('〖⛳️〗› ❲Seed#eqToJson❳', () => {
    vi.assert.isNull(Seed.eqToJson([URI.eq, [URI.null]]))
    vi.assert.isUndefined(Seed.eqToJson([URI.eq, [URI.any]]))
    vi.assert.isUndefined(Seed.eqToJson([URI.eq, [URI.never]]))
    vi.assert.isUndefined(Seed.eqToJson([URI.eq, [URI.unknown]]))
    vi.assert.isUndefined(Seed.eqToJson([URI.eq, [URI.unknown]]))
    vi.assert.isUndefined(Seed.eqToJson([URI.eq, [URI.undefined]]))
    vi.assert.isUndefined(Seed.eqToJson([URI.eq, [URI.undefined]]))
    vi.assert.equal(Seed.eqToJson([URI.eq, [URI.boolean]]), false)
    vi.assert.equal(Seed.eqToJson([URI.eq, [URI.symbol_]]), 'Symbol()')
    vi.assert.equal(Seed.eqToJson([URI.eq, [URI.number]]), 0)
    vi.assert.equal(Seed.eqToJson([URI.eq, [URI.bigint]]), 0)
    vi.assert.equal(Seed.eqToJson([URI.eq, [URI.string]]), '')
    vi.assert.deepEqual(Seed.eqToJson([URI.array, [URI.eq, [URI.null]]]), [])
    vi.assert.deepEqual(Seed.eqToJson([URI.tuple, [[URI.eq, [URI.null]]]]), [null])
    vi.assert.deepEqual(Seed.eqToJson([URI.object, [['abc', [URI.null]]]]), { abc: null })
    vi.assert.deepEqual(Seed.eqToJson([URI.object, [['abc', [URI.eq, [URI.null]]]]]), { abc: null })
    vi.assert.deepEqual(Seed.eqToJson([URI.object, [['abc', [URI.eq, [URI.tuple, [[URI.number]]]]]]]), { abc: [0] })
    vi.assert.deepEqual(Seed.eqToJson([URI.eq, [URI.eq, [URI.object, [['abc', [URI.eq, [URI.tuple, [[URI.number]]]]]]]]]), { abc: [0] })
    vi.assert.deepEqual(Seed.eqToJson([URI.eq, [URI.eq, [URI.object, [['abc', [URI.eq, [URI.tuple, [[URI.number]]]]]]]]]), { abc: [0] })
    vi.assert.deepEqual(Seed.eqToJson([URI.object, [['xyz', [URI.object, [['abc', [URI.eq, [URI.tuple, [[URI.number]]]]]]]]]]), { xyz: { abc: [0] } })
    vi.assert.deepEqual(Seed.eqToJson([URI.intersect, []]), {})
    vi.assert.deepEqual(
      Seed.eqToJson([
        URI.intersect, [
          [URI.object, [['x', [URI.null]]]],
          [URI.object, [['y', [URI.string]]]],
          [URI.object, [['z', [URI.boolean]]]],
        ]
      ]),
      {
        x: null,
        y: '',
        z: false,
      }
    )

    vi.assert.deepEqual(Seed.eqToJson([URI.union, []]), void 0)

    vi.assert.deepEqual(
      Seed.eqToJson([
        URI.union, [
          [URI.object, [['x', [URI.null]]]],
          [URI.object, [['y', [URI.string]]]],
          [URI.object, [['z', [URI.boolean]]]],
        ]
      ]),
      { x: null }
    )

    vi.assert.deepEqual(
      Seed.eqToJson([
        URI.eq, [
          URI.object, [
            [
              'x', [
                URI.eq, [
                  URI.object, [
                    ['a', [URI.eq, [URI.tuple, [[URI.eq, [URI.number]]]]]],
                    ['b', [URI.tuple, [[URI.eq, [URI.string]]]]],
                    ['c', [URI.object, [['d', [URI.tuple, [[URI.eq, [URI.union, [[URI.void]]]]]]]]]],
                  ]
                ]
              ]
            ],
            [
              'y', [
                URI.eq, [
                  URI.object, [
                    ['e', [URI.eq, [URI.intersect, [
                      [URI.eq, [URI.object, [['h', [URI.eq, [URI.string]]]]]],
                      [URI.eq, [URI.object, [['h', [URI.eq, [URI.number]]]]]],
                    ]]]],
                    ['f', [URI.eq, [URI.eq, [URI.eq, [URI.number]]]]],
                    ['g', [URI.eq, [URI.tuple, [[URI.eq, [URI.number]]]]]],
                  ]
                ]
              ]
            ]
          ],
        ]
      ]),
      {
        x: {
          a: [0],
          b: [""],
          c: { d: [undefined] },
        },
        y: {
          e: { h: 0 },
          f: 0,
          g: [0],
        }
      }
    )
  })

})
