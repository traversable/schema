import * as vi from 'vitest'
import { fc, test } from '@fast-check/vitest'

import { URI } from '@traversable/registry'
import { t } from '@traversable/schema'
import { Seed } from '@traversable/schema-seed'

/** @internal */
const builder = fc.letrec(Seed.seed())

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema-seed❳', () => {
  vi.it('〖⛳️〗› ❲Seed.laxMin❳', () => {
    vi.assert.equal(Seed.laxMin(), void 0)
    vi.assert.equal(Seed.laxMin(1), 1)
    vi.assert.equal(Seed.laxMin(1, 2), 1)
    vi.assert.equal(Seed.laxMin(2, 1), 1)
    vi.assert.equal(Seed.laxMin(1.0000000692397184e-21, 1.401298464324817e-45), 1.401298464324817e-45)
    vi.assert.equal(Seed.laxMin(1.401298464324817e-45, 1.0000000692397184e-21), 1.401298464324817e-45)
    vi.assert.equal(Seed.laxMin(1, 1.401298464324817e-45), 1.401298464324817e-45)
    vi.assert.equal(Seed.laxMin(1.401298464324817e-45, 1), 1.401298464324817e-45)
  })

  vi.it('〖⛳️〗› ❲Seed.laxMax❳', () => {
    vi.assert.equal(Seed.laxMax(), void 0)
    vi.assert.equal(Seed.laxMax(1), 1)
    vi.assert.equal(Seed.laxMax(1, 2), 2)
    vi.assert.equal(Seed.laxMax(2, 1), 2)
    vi.assert.equal(Seed.laxMax(1.0000000692397184e-21, 1.401298464324817e-45), 1.0000000692397184e-21)
    vi.assert.equal(Seed.laxMax(1.401298464324817e-45, 1.0000000692397184e-21), 1.0000000692397184e-21)
    vi.assert.equal(Seed.laxMax(1, 1.401298464324817e-45), 1)
    vi.assert.equal(Seed.laxMax(1.401298464324817e-45, 1), 1)
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema-seed❳: property tests', () => {
  vi.it('〖⛳️〗› ❲Seed.isBoundable❳', () => {
    vi.assert.isTrue(Seed.isBoundable([URI.integer]))
    vi.assert.isTrue(Seed.isBoundable([URI.bigint]))
    vi.assert.isTrue(Seed.isBoundable([URI.number]))
    vi.assert.isTrue(Seed.isBoundable([URI.string]))
    vi.assert.isFalse(Seed.isBoundable(URI.integer))
    vi.assert.isFalse(Seed.isBoundable(URI.bigint))
    vi.assert.isFalse(Seed.isBoundable(URI.number))
    vi.assert.isFalse(Seed.isBoundable(URI.string))
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema-seed❳', () => {
  vi.it('〖⛳️〗› ❲Seed.stringContraintsFromBounds❳', () => {
    vi.assert.deepEqual(
      Seed.stringConstraintsFromBounds({ minimum: 250, maximum: 250 }),
      { minLength: 250, maxLength: 250 }
    )
  })

  vi.it('〖⛳️〗› ❲Seed.numberContraintsFromBounds❳', () => {
    vi.assert.deepEqual(
      Seed.numberConstraintsFromBounds({ minimum: 250, maximum: 250 }),
      { min: 250, max: 250, minExcluded: false, maxExcluded: false }
    )
    vi.assert.deepEqual(
      Seed.numberConstraintsFromBounds({ maximum: 50, exclusiveMinimum: 100 }),
      { max: 100, maxExcluded: false, min: 50, minExcluded: true }
    )
    vi.assert.deepEqual(
      Seed.numberConstraintsFromBounds({ minimum: 1, maximum: 10, exclusiveMinimum: 5, exclusiveMaximum: 20 }),
      { max: 10, maxExcluded: false, min: 5, minExcluded: true }
    )
    vi.assert.deepEqual(
      Seed.numberConstraintsFromBounds({ minimum: 10, maximum: 0 }),
      { max: 10, maxExcluded: false, min: 0, minExcluded: false }
    )
  })

  vi.it('〖⛳️〗› ❲Seed.getBounds❳', () => {
    vi.assert.deepEqual(Seed.getBounds(t.bigint), void 0)
    vi.assert.deepEqual(Seed.getBounds(t.integer), void 0)
    vi.assert.deepEqual(Seed.getBounds(t.number), void 0)
    vi.assert.deepEqual(Seed.getBounds(t.string), void 0)
    vi.assert.deepEqual(Seed.getBounds(t.array(t.string)), void 0)
    vi.assert.deepEqual(Seed.getBounds(t.array(t.string).min(1)), { minimum: 1 })
    vi.assert.deepEqual(Seed.getBounds(t.array(t.string).max(2)), { maximum: 2 })
    vi.assert.deepEqual(Seed.getBounds(t.array(t.string).min(1).max(2)), { minimum: 1, maximum: 2 })
    vi.assert.deepEqual(Seed.getBounds(t.array(t.string).max(1).min(2)), { minimum: 1, maximum: 2 })
    vi.assert.deepEqual(Seed.getBounds(t.array(t.string).between(1, 2)), { minimum: 1, maximum: 2 })

    vi.expect(Seed.getBounds(t.bigint.min(0n))).toMatchInlineSnapshot(`
      {
        "minimum": 0n,
      }
    `)
    vi.expect(Seed.getBounds(t.integer.min(0))).toMatchInlineSnapshot(`
      {
        "minimum": 0,
      }
    `)
    vi.expect(Seed.getBounds(t.number.min(0))).toMatchInlineSnapshot(`
      {
        "minimum": 0,
      }
    `)
    vi.expect(Seed.getBounds(t.string.min(0))).toMatchInlineSnapshot(`
      {
        "minimum": 0,
      }
    `)
    vi.expect(Seed.getBounds(t.bigint.max(0n))).toMatchInlineSnapshot(`
      {
        "maximum": 0n,
      }
    `)
    vi.expect(Seed.getBounds(t.integer.max(0))).toMatchInlineSnapshot(`
      {
        "maximum": 0,
      }
    `)
    vi.expect(Seed.getBounds(t.number.max(0))).toMatchInlineSnapshot(`
      {
        "maximum": 0,
      }
    `)
    vi.expect(Seed.getBounds(t.string.max(0))).toMatchInlineSnapshot(`
      {
        "maximum": 0,
      }
    `)
    vi.expect(Seed.getBounds(t.bigint.between(0n, 10n).max(10n))).toMatchInlineSnapshot(`
      {
        "maximum": 10n,
        "minimum": 0n,
      }
    `)
    vi.expect(Seed.getBounds(t.integer.between(0, 10).max(10))).toMatchInlineSnapshot(`
      {
        "maximum": 10,
        "minimum": 0,
      }
    `)
    vi.expect(Seed.getBounds(t.number.between(0, 10).max(10))).toMatchInlineSnapshot(`
      {
        "maximum": 10,
        "minimum": 0,
      }
    `)
    vi.expect(Seed.getBounds(t.string.between(0, 10).max(10))).toMatchInlineSnapshot(`
      {
        "maximum": 10,
        "minimum": 0,
      }
    `)
    vi.expect(Seed.getBounds(t.bigint.between(10n, 0n).max(10n))).toMatchInlineSnapshot(`
      {
        "maximum": 10n,
        "minimum": 0n,
      }
    `)
    vi.expect(Seed.getBounds(t.integer.between(10, 0).max(10))).toMatchInlineSnapshot(`
      {
        "maximum": 10,
        "minimum": 0,
      }
    `)
    vi.expect(Seed.getBounds(t.number.between(10, 0).max(10))).toMatchInlineSnapshot(`
      {
        "maximum": 10,
        "minimum": 0,
      }
    `)
    vi.expect(Seed.getBounds(t.string.between(10, 0).max(10))).toMatchInlineSnapshot(`
      {
        "maximum": 10,
        "minimum": 0,
      }
    `)
    vi.expect(Seed.getBounds(t.bigint.min(0n).max(10n))).toMatchInlineSnapshot(`
      {
        "maximum": 10n,
        "minimum": 0n,
      }
    `)
    vi.expect(Seed.getBounds(t.integer.min(0).max(10))).toMatchInlineSnapshot(`
      {
        "maximum": 10,
        "minimum": 0,
      }
    `)
    vi.expect(Seed.getBounds(t.number.min(0).max(10))).toMatchInlineSnapshot(`
      {
        "maximum": 10,
        "minimum": 0,
      }
    `)
    vi.expect(Seed.getBounds(t.string.min(0).max(10))).toMatchInlineSnapshot(`
      {
        "maximum": 10,
        "minimum": 0,
      }
    `)
    vi.expect(Seed.getBounds(t.number.moreThan(0))).toMatchInlineSnapshot(`
      {
        "exclusiveMinimum": 0,
      }
    `)
    vi.expect(Seed.getBounds(t.number.moreThan(0).max(10))).toMatchInlineSnapshot(`
      {
        "exclusiveMinimum": 0,
        "maximum": 10,
      }
    `)
    vi.expect(Seed.getBounds(t.number.moreThan(0).lessThan(10))).toMatchInlineSnapshot(`
      {
        "exclusiveMaximum": 10,
        "exclusiveMinimum": 0,
      }
    `)
    vi.expect(Seed.getBounds(t.number.lessThan(0))).toMatchInlineSnapshot(`
      {
        "exclusiveMaximum": 0,
      }
    `)
    vi.expect(Seed.getBounds(t.number.lessThan(0).min(-10))).toMatchInlineSnapshot(`
      {
        "exclusiveMaximum": 0,
        "minimum": -10,
      }
    `)
    vi.expect(Seed.getBounds(t.number.lessThan(10).moreThan(0))).toMatchInlineSnapshot(`
      {
        "exclusiveMaximum": 10,
        "exclusiveMinimum": 0,
      }
    `)
  })

  vi.it('〖⛳️〗› ❲Seed.preprocessNumberBounds❳', () => {
    vi.expect(Seed.preprocessNumberBounds({ minimum: -8.66486914219422e-7, exclusiveMaximum: -65535.9453125 })).toMatchInlineSnapshot(`{}`)
    vi.expect(Seed.preprocessNumberBounds({ maximum: 0, minimum: 1 })).toMatchInlineSnapshot(`
      {
        "maximum": 1,
        "minimum": 0,
      }
    `)
    vi.expect(Seed.preprocessNumberBounds({ exclusiveMinimum: 10, exclusiveMaximum: 1 })).toMatchInlineSnapshot(`
      {
        "exclusiveMaximum": 10,
        "exclusiveMinimum": 1,
      }
    `)
    vi.expect(Seed.preprocessNumberBounds({ minimum: 100, maximum: 101, exclusiveMinimum: 10, exclusiveMaximum: 1 })).toMatchInlineSnapshot(`
      {
        "exclusiveMaximum": 10,
        "exclusiveMinimum": 1,
      }
    `)
    vi.expect(Seed.preprocessNumberBounds({ minimum: 10, maximum: 12, exclusiveMinimum: 100, exclusiveMaximum: 102 })).toMatchInlineSnapshot(`
      {
        "exclusiveMaximum": 102,
        "exclusiveMinimum": 100,
      }
    `)
  })
})


vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema-seed❳: property tests', () => {
  test.prop([builder.number], {
    // numRuns: 10_000,
    endOnFailure: true,
  })('〖⛳️〗› ❲Seed.seed❳: cannot produce an invalid "number" seed', ([, bounds]) => {
    if (t.number(bounds?.exclusiveMinimum) && t.number(bounds.exclusiveMaximum))
      vi.assert.isBelow(bounds.exclusiveMinimum, bounds.exclusiveMaximum)
    if (t.number(bounds?.minimum) && t.number(bounds?.maximum))
      vi.assert.isAtMost(bounds.minimum, bounds.maximum)
    if (t.number(bounds?.minimum) && t.number(bounds.exclusiveMaximum))
      vi.assert.isBelow(bounds.minimum, bounds.exclusiveMaximum)
    if (t.number(bounds?.maximum) && t.number(bounds.exclusiveMinimum))
      vi.assert.isAbove(bounds.maximum, bounds.exclusiveMinimum)
  })

  test.prop([builder.tree], { /* numRuns: 10_000 */ })(
    '〖⛳️〗› ❲Seed.Functor❳: preserves structure',
    (seed) => vi.assert.deepEqual(Seed.identity(seed), seed)
  )

  test.prop([builder.tree], {
    endOnFailure: true,
    // numRuns: 10_000,
  })('〖⛳️〗› ❲Seed.toSchema❳: Seed.toSchema • Seed.fromSchema roundtrips without loss of structure', (seed) => {
    const schema = Seed.toSchema(seed)
    const roundtrip = Seed.fromSchema(schema)
    try {
      vi.assert.deepEqual(roundtrip, seed)
    } catch (e) {
      console.group('\n\n\r ============== ROUNDTRIP FAILED ==============\n\r')
      console.debug('schema:\n', schema + '\n\r')
      console.debug('Object.entries(schema):\n', Object.entries(schema) + '\n\r')
      console.debug('roundtrip:\n', JSON.stringify(roundtrip, (_, v) => typeof v === 'symbol' ? String(v) : v, 2) + '\n\r')
      console.debug('seed:\n', JSON.stringify(seed, (_, v) => typeof v === 'symbol' ? String(v) : v, 2) + '\n\r')
      console.groupEnd()
      vi.assert.fail(t.has('message', t.string)(e) ? e.message : JSON.stringify(e))
    }
  })

  const tupleLength_13 = fc.letrec(Seed.seed({ tuple: { minLength: 1, maxLength: 3 } })).tuple
  const tupleLength_15 = fc.letrec(Seed.seed({ tuple: { minLength: 1, maxLength: 5 } })).tuple
  const tupleLength_35 = fc.letrec(Seed.seed({ tuple: { minLength: 3, maxLength: 5 } })).tuple

  test.prop([tupleLength_13, tupleLength_15, tupleLength_35], {})(
    '〖⛳️〗› ❲Seed.tuple❳: applies options',
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
    '〖⛳️〗› ❲Seed.object❳: applies options',
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
    '〖⛳️〗› ❲Seed.union❳: applies options',
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
    '〖⛳️〗› ❲Seed.intersect❳: applies options',
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
})

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema/seed❳: Seed.toSchema', () => {
  vi.it('〖⛳️〗› ❲t.never❳', () => {
    vi.assert.deepEqual(Seed.toSchema(URI.never), t.never)
  })
  vi.it('〖⛳️〗› ❲t.any❳', () => {
    vi.assert.deepEqual(Seed.toSchema(URI.any), t.any)
  })
  vi.it('〖⛳️〗› ❲t.unknown❳', () => {
    vi.assert.deepEqual(Seed.toSchema(URI.unknown), t.unknown)
  })
  vi.it('〖⛳️〗› ❲t.void❳', () => {
    vi.assert.deepEqual(Seed.toSchema(URI.void), t.void)
  })
  vi.it('〖⛳️〗› ❲t.null❳', () => {
    vi.assert.deepEqual(Seed.toSchema(URI.null), t.null)
  })
  vi.it('〖⛳️〗› ❲t.undefined❳', () => {
    vi.assert.deepEqual(Seed.toSchema(URI.undefined), t.undefined)
  })
  vi.it('〖⛳️〗› ❲t.symbol❳', () => {
    vi.assert.deepEqual(Seed.toSchema(URI.symbol), t.symbol)
  })
  vi.it('〖⛳️〗› ❲t.boolean❳', () => {
    vi.assert.deepEqual(Seed.toSchema(URI.boolean), t.boolean)
  })
  vi.it('〖⛳️〗› ❲t.integer❳', () => {
    vi.assert.deepEqual(Seed.toSchema([URI.integer]), t.integer)
    vi.assert.equal((Seed.toSchema([URI.integer, { minimum: 1 }]) as t.integer).minimum, 1)
    vi.assert.equal((Seed.toSchema([URI.integer, { maximum: 2 }]) as t.integer).maximum, 2)
    vi.assert.equal((Seed.toSchema([URI.integer, { minimum: 1, maximum: 2 }]) as t.integer).minimum, 1)
    vi.assert.equal((Seed.toSchema([URI.integer, { minimum: 1, maximum: 2 }]) as t.integer).maximum, 2)
  })
  vi.it('〖⛳️〗› ❲t.number❳', () => {
    vi.assert.equal((Seed.toSchema([URI.number, { minimum: 1 }]) as t.number).minimum, 1)
    vi.assert.equal((Seed.toSchema([URI.number, { maximum: 2 }]) as t.number).maximum, 2)
    vi.assert.equal((Seed.toSchema([URI.number, { minimum: 1, maximum: 2 }]) as t.number).minimum, 1)
    vi.assert.equal((Seed.toSchema([URI.number, { minimum: 1, maximum: 2 }]) as t.number).maximum, 2)
    vi.assert.equal((Seed.toSchema([URI.number, { exclusiveMinimum: 1 }]) as t.number).exclusiveMinimum, 1)
    vi.assert.equal((Seed.toSchema([URI.number, { exclusiveMaximum: 2 }]) as t.number).exclusiveMaximum, 2)
    vi.assert.equal((Seed.toSchema([URI.number, { exclusiveMinimum: 1, maximum: 2 }]) as t.number).exclusiveMinimum, 1)
    vi.assert.equal((Seed.toSchema([URI.number, { exclusiveMinimum: 1, maximum: 2 }]) as t.number).maximum, 2)
  })
  vi.it('〖⛳️〗› ❲t.bigint❳', () => {
    vi.assert.equal((Seed.toSchema([URI.bigint, { minimum: 1n }]) as t.bigint).minimum, 1n)
    vi.assert.equal((Seed.toSchema([URI.bigint, { maximum: 2n }]) as t.bigint).maximum, 2n)
    vi.assert.equal((Seed.toSchema([URI.bigint, { minimum: 1n, maximum: 2n }]) as t.bigint).minimum, 1n)
    vi.assert.equal((Seed.toSchema([URI.bigint, { minimum: 1n, maximum: 2n }]) as t.bigint).maximum, 2n)
  })
  vi.it('〖⛳️〗› ❲t.string❳', () => {
    vi.assert.equal((Seed.toSchema([URI.string, { minimum: 1 }]) as t.string).minLength, 1)
    vi.assert.equal((Seed.toSchema([URI.string, { maximum: 2 }]) as t.string).maxLength, 2)
    vi.assert.equal((Seed.toSchema([URI.string, { minimum: 1, maximum: 2 }]) as t.string).minLength, 1)
    vi.assert.equal((Seed.toSchema([URI.string, { minimum: 1, maximum: 2 }]) as t.string).maxLength, 2)
  })
  vi.it('〖⛳️〗› ❲t.optional(...)❳', () => {
    vi.assert.equal(Seed.toSchema([URI.optional, URI.any]).tag, URI.optional)
    vi.assert.equal((Seed.toSchema([URI.optional, URI.any]).def as t.any).tag, URI.any)
  })
  vi.it('〖⛳️〗› ❲t.eq(...)❳', () => {
    vi.assert.equal(Seed.toSchema([URI.eq, {}]).tag, URI.eq)
    vi.assert.equal(Seed.toSchema([URI.eq, void 0]).def, void 0)
    vi.assert.equal(Seed.toSchema([URI.eq, null]).def, null)
    vi.assert.equal(Seed.toSchema([URI.eq, false]).def, false)
    vi.assert.equal(Seed.toSchema([URI.eq, 0]).def, 0)
    vi.assert.equal(Seed.toSchema([URI.eq, '']).def, '')
    vi.assert.deepEqual(Seed.toSchema([URI.eq, {}]).def, {})
    vi.assert.deepEqual(Seed.toSchema([URI.eq, { '': 0 }]).def, { '': 0 })
    vi.assert.deepEqual(Seed.toSchema([URI.eq, []]).def, [])
    vi.assert.deepEqual(Seed.toSchema([URI.eq, [0]]).def, [0])
  })
  vi.it('〖⛳️〗› ❲t.array(...)❳', () => {
    vi.assert.equal((Seed.toSchema([URI.array, URI.any, { minimum: 1 }]) as t.array<t.any>).minLength, 1)
    vi.assert.equal((Seed.toSchema([URI.array, URI.any, { maximum: 2 }]) as t.array<t.any>).maxLength, 2)
    vi.assert.equal((Seed.toSchema([URI.array, URI.any, { minimum: 1, maximum: 2 }]) as t.array<t.any>).minLength, 1)
    vi.assert.equal((Seed.toSchema([URI.array, URI.any, { minimum: 1, maximum: 2 }]) as t.array<t.any>).maxLength, 2)
  })
  vi.it('〖⛳️〗› ❲t.record(...)❳', () => {
    vi.assert.equal(Seed.toSchema([URI.record, URI.any]).tag, URI.record)
    vi.assert.equal((Seed.toSchema([URI.record, URI.any]).def as t.any).tag, URI.any)
  })
  vi.it('〖⛳️〗› ❲t.union(...)❳', () => {
    vi.assert.equal(Seed.toSchema([URI.union, []]).tag, URI.union)
    vi.assert.equal(Seed.toSchema([URI.union, [URI.any]]).tag, URI.union)
    vi.assert.deepEqual(Seed.toSchema([URI.union, []]).def, [])
    vi.assert.equal((Seed.toSchema([URI.union, [URI.any]]).def as [t.any])[0].tag, URI.any)
  })
  vi.it('〖⛳️〗› ❲t.intersect(...)❳', () => {
    vi.assert.equal(Seed.toSchema([URI.intersect, []]).tag, URI.intersect)
    vi.assert.equal(Seed.toSchema([URI.intersect, [URI.any]]).tag, URI.intersect)
    vi.assert.deepEqual(Seed.toSchema([URI.intersect, []]).def, [])
    vi.assert.equal((Seed.toSchema([URI.intersect, [URI.any]]).def as [t.any])[0].tag, URI.any)
  })
  vi.it('〖⛳️〗› ❲t.tuple(...)❳', () => {
    vi.assert.equal(Seed.toSchema([URI.tuple, []]).tag, URI.tuple)
    vi.assert.equal(Seed.toSchema([URI.tuple, [URI.any]]).tag, URI.tuple)
    vi.assert.deepEqual(Seed.toSchema([URI.tuple, []]).def, [])
    vi.assert.equal((Seed.toSchema([URI.tuple, [URI.any]]).def as [t.any])[0].tag, URI.any)
  })
  vi.it('〖⛳️〗› ❲t.object(...)❳', () => {
    vi.assert.equal(Seed.toSchema([URI.object, []]).tag, URI.object)
    vi.assert.equal(Seed.toSchema([URI.object, [['', URI.any]]]).tag, URI.object)
    vi.assert.deepEqual((Seed.toSchema([URI.object, [['abc', URI.any]]]).def as { abc: t.any }).abc.tag, URI.any)
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema/seed❳: Seed.fromSchema', () => {
  vi.it('〖⛳️〗› ❲t.never❳', () => {
    vi.assert.deepEqual(Seed.fromSchema(t.never), URI.never)
  })
  vi.it('〖⛳️〗› ❲t.any❳', () => {
    vi.assert.deepEqual(Seed.fromSchema(t.any), URI.any)
  })
  vi.it('〖⛳️〗› ❲t.unknown❳', () => {
    vi.assert.deepEqual(Seed.fromSchema(t.unknown), URI.unknown)
  })
  vi.it('〖⛳️〗› ❲t.void❳', () => {
    vi.assert.deepEqual(Seed.fromSchema(t.void), URI.void)
  })
  vi.it('〖⛳️〗› ❲t.null❳', () => {
    vi.assert.deepEqual(Seed.fromSchema(t.null), URI.null)
  })
  vi.it('〖⛳️〗› ❲t.undefined❳', () => {
    vi.assert.deepEqual(Seed.fromSchema(t.undefined), URI.undefined)
  })
  vi.it('〖⛳️〗› ❲t.symbol❳', () => {
    vi.assert.deepEqual(Seed.fromSchema(t.symbol), URI.symbol)
  })
  vi.it('〖⛳️〗› ❲t.boolean❳', () => {
    vi.assert.deepEqual(Seed.fromSchema(t.boolean), URI.boolean)
  })
  vi.it('〖⛳️〗› ❲t.bigint❳', () => {
    vi.assert.deepEqual(Seed.fromSchema(t.bigint), [URI.bigint])
  })
  vi.it('〖⛳️〗› ❲t.number❳', () => {
    vi.assert.deepEqual(Seed.fromSchema(t.number), [URI.number])
  })
  vi.it('〖⛳️〗› ❲t.string❳', () => {
    vi.assert.deepEqual(Seed.fromSchema(t.string), [URI.string])
  })
  vi.it('〖⛳️〗› ❲t.eq(...)❳', () => {
    vi.assert.deepEqual(Seed.fromSchema(t.eq(9000)), [URI.eq, 9000])
  })
  vi.it('〖⛳️〗› ❲t.array(...)❳', () => {
    vi.assert.deepEqual(Seed.fromSchema(t.array(t.string)), [URI.array, [URI.string]])
    vi.assert.deepEqual(Seed.fromSchema(t.array(t.array(t.string))), [URI.array, [URI.array, [URI.string]]])
    vi.assert.deepEqual(Seed.fromSchema(t.array(t.string).min(1)), [URI.array, [URI.string], { minimum: 1 }])
    vi.assert.deepEqual(Seed.fromSchema(t.array(t.string).max(10)), [URI.array, [URI.string], { maximum: 10 }])
    vi.assert.deepEqual(Seed.fromSchema(t.array(t.string).min(1).max(10)), [URI.array, [URI.string], { minimum: 1, maximum: 10 }])
    vi.assert.deepEqual(Seed.fromSchema(t.array(t.string).max(10).min(1)), [URI.array, [URI.string], { minimum: 1, maximum: 10 }])
    vi.assert.deepEqual(Seed.fromSchema(t.array(t.string).between(1, 10)), [URI.array, [URI.string], { minimum: 1, maximum: 10 }])
    vi.assert.deepEqual(Seed.fromSchema(t.array(t.string).between(10, 1)), [URI.array, [URI.string], { minimum: 1, maximum: 10 }])
  })

  vi.it('〖⛳️〗› ❲t.record(...)❳', () => {
    vi.assert.deepEqual(Seed.fromSchema(t.record(t.string)), [URI.record, [URI.string]])
    vi.assert.deepEqual(Seed.fromSchema(t.record(t.optional(t.boolean))), [URI.record, [URI.optional, URI.boolean]])
    vi.assert.deepEqual(
      Seed.fromSchema(t.record(t.optional(t.record(t.null)))),
      [URI.record, [URI.optional, [URI.record, URI.null]]]
    )
  })

  vi.it('〖⛳️〗› ❲t.union(...)❳', () => {
    vi.assert.deepEqual(Seed.fromSchema(t.union()), [URI.union, []])
    vi.assert.deepEqual(Seed.fromSchema(t.union(t.boolean, t.number, t.string)), [URI.union, [URI.boolean, [URI.number], [URI.string]]])
    vi.assert.deepEqual(
      Seed.fromSchema(t.union(t.null, t.array(t.union(t.undefined, t.eq(0))))),
      [URI.union, [URI.null, [URI.array, [URI.union, [URI.undefined, [URI.eq, 0]]]]]]
    )
  })

  vi.it('〖⛳️〗› ❲t.intersect(...)❳', () => {
    vi.assert.deepEqual(Seed.fromSchema(t.intersect()), [URI.intersect, []])
    vi.assert.deepEqual(
      Seed.fromSchema(t.intersect(t.boolean, t.number, t.string)),
      [URI.intersect, [URI.boolean, [URI.number], [URI.string]]]
    )
    vi.assert.deepEqual(
      Seed.fromSchema(t.intersect(t.null, t.array(t.intersect(t.undefined, t.eq(0))))),
      [URI.intersect, [URI.null, [URI.array, [URI.intersect, [URI.undefined, [URI.eq, 0]]]]]]
    )
  })

  vi.it('〖⛳️〗› ❲t.tuple(...)❳', () => {
    vi.assert.deepEqual(Seed.fromSchema(t.tuple()), [URI.tuple, []])
    vi.assert.deepEqual(Seed.fromSchema(t.tuple(t.optional(t.tuple()))), [URI.tuple, [[URI.optional, [URI.tuple, []]]]])
  })

  vi.it('〖⛳️〗› ❲t.object(...)❳', () => {
    vi.assert.deepEqual(Seed.fromSchema(t.object({})), [URI.object, []])
    vi.assert.deepEqual(Seed.fromSchema(t.object({ a: t.boolean })), [URI.object, [['a', URI.boolean]]])
    vi.assert.deepEqual(
      Seed.fromSchema(t.object({
        a: t.boolean,
        b: t.optional(
          t.object({ c: t.optional(t.void) }))
      }
      )),
      [URI.object, [
        ['a', URI.boolean],
        ['b', [URI.optional, [URI.object, [['c', [URI.optional, URI.void]]]]]],
      ]]
    )
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema/seed❳: example-based tests', () => {
  vi.it('〖⛳️〗› ❲Seed.toJson❳', () => {
    vi.assert.isNull(Seed.toJson([URI.eq, URI.null]), URI.null)
    vi.assert.isUndefined(Seed.toJson([URI.eq, URI.any]))
    vi.assert.isUndefined(Seed.toJson([URI.eq, URI.never]))
    vi.assert.isUndefined(Seed.toJson([URI.eq, URI.unknown]))
    vi.assert.isUndefined(Seed.toJson([URI.eq, URI.undefined]))
    vi.assert.equal(Seed.toJson([URI.eq, URI.boolean]), false)
    vi.assert.equal(Seed.toJson([URI.eq, URI.symbol]), 'Symbol()')
    vi.assert.equal(Seed.toJson([URI.eq, [URI.number]]), 0)
    vi.assert.equal(Seed.toJson([URI.eq, [URI.bigint]]), 0)
    vi.assert.equal(Seed.toJson([URI.eq, [URI.string]]), '')
    vi.assert.deepEqual(Seed.toJson([URI.array, [URI.eq, URI.null]]), [])
    vi.assert.deepEqual(Seed.toJson([URI.tuple, [[URI.eq, URI.null]]]), [null])
    vi.assert.deepEqual(Seed.toJson([URI.object, [['abc', URI.null]]]), { abc: null })
    vi.assert.deepEqual(Seed.toJson([URI.object, [['abc', [URI.eq, URI.null]]]]), { abc: null })
    // vi.assert.deepEqual(Seed.toJson([URI.object, [['abc', [URI.eq, [URI.tuple, [URI.number]]]]]]), { abc: [0] })
    vi.assert.deepEqual(Seed.toJson([URI.eq, [URI.eq, [URI.object, [['abc', [URI.eq, [URI.tuple, [URI.number]]]]]]]]), { abc: [0] })
    vi.assert.deepEqual(Seed.toJson([URI.eq, [URI.eq, [URI.object, [['abc', [URI.eq, [URI.tuple, [URI.number]]]]]]]]), { abc: [0] })
    vi.assert.deepEqual(Seed.toJson([URI.object, [['xyz', [URI.object, [['abc', [URI.eq, [URI.tuple, [URI.number]]]]]]]]]), { xyz: { abc: [0] } })
    vi.assert.deepEqual(Seed.toJson([URI.union, []]), void 0)
    vi.assert.deepEqual(Seed.toJson([URI.intersect, []]), {})
    vi.assert.deepEqual(
      Seed.toJson([
        URI.intersect, [
          [URI.object, [['x', URI.null]]],
          [URI.object, [['y', [URI.string]]]],
          [URI.object, [['z', URI.boolean]]],
        ]
      ]),
      { x: null, y: '', z: false }
    )
    vi.assert.deepEqual(
      Seed.toJson([
        URI.union, [
          [URI.object, [['x', URI.null]]],
          [URI.object, [['y', [URI.string]]]],
          [URI.object, [['z', URI.boolean]]],
        ]
      ]),
      { x: null }
    )

    vi.assert.deepEqual(
      Seed.toJson([
        URI.eq, [
          URI.object, [
            [
              'x', [
                URI.eq, [
                  URI.object, [
                    ['a', [URI.eq, [URI.tuple, [[URI.eq, URI.number]]]]],
                    ['b', [URI.tuple, [[URI.eq, URI.string]]]],
                    ['c', [URI.object, [['d', [URI.tuple, [[URI.eq, [URI.union, [URI.void]]]]]]]]],
                  ]
                ]
              ]
            ],
            [
              'y', [
                URI.eq, [
                  URI.object, [
                    ['e', [URI.eq, [URI.intersect, [
                      [URI.eq, [URI.object, [['h', [URI.eq, URI.string]]]]],
                      [URI.eq, [URI.object, [['h', [URI.eq, URI.number]]]]],
                    ]]]],
                    ['f', [URI.eq, [URI.eq, [URI.eq, URI.number]]]],
                    ['g', [URI.eq, [URI.tuple, [[URI.eq, URI.number]]]]],
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
          b: [''],
          c: { d: [undefined] }
        },
        y: {
          e: { h: 0 },
          f: 0,
          g: [0]
        }
      }
    )
  })

  vi.it('〖⛳️〗› ❲Seed.sortOptionalsLast❳', () => {
    const ex_01 = [t.optional(t.boolean), t.string, t.optional(t.null)].sort(Seed.sortOptionalsLast)
    vi.assert.deepEqual(ex_01.map((ex) => ex.tag), [URI.string, URI.optional, URI.optional])
    const ex_02 = [t.string, t.number].sort(Seed.sortOptionalsLast)
    vi.assert.deepEqual(ex_02.map((ex) => ex.tag), [URI.string, URI.number])
    const ex_03 = [t.optional(t.never), t.string, t.number].sort(Seed.sortOptionalsLast)
    vi.assert.deepEqual(ex_03.map((ex) => ex.tag), [URI.string, URI.number, URI.optional])
  })

  vi.it('〖⛳️〗› ❲Seed.pick❳', () => {
    vi.expect(Seed.pickAndSortNodes(Seed.initialOrder)({
      sortBias: {
        any: 10,
        array: 9,
        bigint: 8,
        boolean: 7,
        eq: 6,
        intersect: 5,
        never: 4,
        null: 3,
        number: 2,
        object: 1,
        optional: 0,
        record: -1,
        string: -2,
        symbol: -3,
        tree: -4,
        tuple: -5,
        undefined: -6,
        union: -7,
        unknown: -8,
        void: -9,
      }
    })).toMatchInlineSnapshot(`
      [
        "any",
        "array",
        "bigint",
        "boolean",
        "eq",
        "intersect",
        "never",
        "null",
        "number",
        "object",
        "integer",
        "optional",
        "record",
        "string",
        "symbol",
        "tuple",
        "undefined",
        "union",
        "unknown",
        "void",
      ]
    `)

    vi.expect(Seed.pickAndSortNodes(Seed.initialOrder)({
      sortBias: {
        symbol: -1,
        tree: 0,
        tuple: 1,
      }
    })).toMatchInlineSnapshot(`
      [
        "tuple",
        "string",
        "number",
        "object",
        "boolean",
        "undefined",
        "integer",
        "bigint",
        "null",
        "eq",
        "array",
        "record",
        "optional",
        "intersect",
        "union",
        "any",
        "unknown",
        "void",
        "never",
        "symbol",
      ]
    `)

    vi.expect(
      Seed.pickAndSortNodes(Seed.initialOrder)({
        sortBias: { boolean: 0, number: 1, string: 2 },
        exclude: ['string'],
        include: ['number', 'boolean'],
      })
    ).toMatchInlineSnapshot(`
        [
          "number",
          "boolean",
        ]
      `)
  })
})
