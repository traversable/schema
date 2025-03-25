import * as vi from 'vitest'
import { t, '~within' as within, '~withinBig' as withinBig } from '@traversable/schema'
import { fc, test } from '@fast-check/vitest'

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema/bounded❳', () => {
  vi.it('〖⛳️〗‹ ❲within❳', () => {
    vi.assert.isTrue(within({ gt: 0 })(1))
    vi.assert.isTrue(within({ gt: 0, lt: 1 })(0.5))
    vi.assert.isTrue(within({ lt: 1 })(0.5))
    /* @ts-expect-error */
    vi.assert.throws(() => within({ gt: '' })(0.5))
  })

  vi.it('〖⛳️〗‹ ❲withinBig❳', () => {
    vi.assert.isTrue(withinBig({})(1))
    vi.assert.isTrue(withinBig({ lte: 0 })(0))
    vi.assert.isTrue(withinBig({ gte: 0 })(0))
    vi.assert.isTrue(withinBig({ lt: 0 })(-1))
    vi.assert.isTrue(withinBig({ gt: 0 })(+1))
    vi.assert.isTrue(withinBig({ gt: 0, lt: 2 })(1))
    vi.assert.isTrue(withinBig({ gt: 0, lte: 1 })(1))
    vi.assert.isTrue(withinBig({ gte: 0, lt: 2 })(1))
    vi.assert.isTrue(withinBig({ gte: 0, lte: 1 })(1))

    vi.assert.isTrue(withinBig({ gt: 0, lt: 2, gte: 1 })(1))
    vi.assert.isTrue(withinBig({ gt: 0, lte: 1, gte: 1 })(1))
    vi.assert.isTrue(withinBig({ gte: 1, lt: 2, lte: 1 })(1))
    vi.assert.isTrue(withinBig({ gte: 1, lte: 1, lt: 2 })(1))
    vi.assert.isTrue(withinBig({ gte: 1, lte: 1, gt: 0 })(1))
    vi.assert.isTrue(withinBig({ gte: 1, lt: 2, gt: 0 })(1))

    vi.assert.isTrue(withinBig({ gte: 1, lte: 1, lt: 2, gt: 0 })(1))

    vi.assert.isTrue(withinBig({ lt: 1 })(0.5))
    /* @ts-expect-error */
    vi.assert.throws(() => withinBig({ gt: '' })(0.5))

  })

  vi.describe('〖⛳️〗‹‹ ❲t.integer❳', () => {
    const anything = fc.anything().filter((_) => !Number.isSafeInteger(_))
    const integer = fc.integer()
    test.prop([integer, integer, anything])(
      '〖⛳️〗‹ ❲.min❳: property test',
      (x, y, _) => {
        let schema = t.integer.min(x)
        vi.assert.equal(schema(y), schema.min <= y)
        vi.assert.isFalse(schema(_))
      }
    )
    test.prop([integer, integer, anything])(
      '〖⛳️〗‹ ❲.max❳: property test',
      (x, y, _) => {
        let schema = t.integer.max(x)
        vi.assert.equal(schema(y), y <= schema.max)
        vi.assert.isFalse(schema(_))
      }
    )
    test.prop([integer, integer, anything])(
      '〖⛳️〗‹ ❲.gt❳: property test',
      (x, y, _) => {
        let schema = t.integer.gt(x)
        vi.assert.equal(schema(y), schema.gt < y)
        vi.assert.isFalse(schema(_))
      }
    )
    test.prop([integer, integer, anything])(
      '〖⛳️〗‹ ❲.lt❳: property test',
      (x, y, _) => {
        let schema = t.integer.lt(x)
        vi.assert.equal(schema(y), y < schema.lt)
        vi.assert.isFalse(schema(_))
      }
    )
    test.prop([integer, integer, integer, anything])(
      '〖⛳️〗‹ ❲.btwn❳: property test',
      (x, y, z, _) => {
        let schema = t.integer.btwn(x, y)
        vi.assert.equal(schema(z), schema.min <= z && z <= schema.max)
        vi.assert.isFalse(schema(_))
      }
    )
  })

  vi.describe('〖⛳️〗‹‹ ❲t.number❳', () => {
    const anything = fc.anything().filter((_) => typeof _ !== 'number')
    const number = fc.float({
      max: Math.fround(Number.MAX_SAFE_INTEGER),
      maxExcluded: true,
      min: Math.fround(Number.MIN_SAFE_INTEGER),
      minExcluded: true,
    })
    test.prop([number, number, anything])(
      '〖⛳️〗‹ ❲.min❳: property test',
      (x, y, _) => {
        let schema = t.number.min(x)
        vi.assert.equal(schema(y), schema.min <= y)
        vi.assert.isFalse(schema(_))
      }
    )
    test.prop([number, number, anything])(
      '〖⛳️〗‹ ❲.max❳: property test',
      (x, y, _) => {
        let schema = t.number.max(x)
        vi.assert.equal(schema(y), y <= schema.max)
        vi.assert.isFalse(schema(_))
      }
    )
    test.prop([number, number, anything])(
      '〖⛳️〗‹ ❲.gt❳: property test',
      (x, y, _) => {
        let schema = t.number.gt(x)
        vi.assert.equal(schema(y), schema.gt < y)
        vi.assert.isFalse(schema(_))
      }
    )
    test.prop([number, number, anything])(
      '〖⛳️〗‹ ❲.lt❳: property test',
      (x, y, _) => {
        let schema = t.number.lt(x)
        vi.assert.equal(schema(y), y < schema.lt)
        vi.assert.isFalse(schema(_))
      }
    )
    test.prop([number, number, number, anything])(
      '〖⛳️〗‹ ❲.btwn❳: property test',
      (x, y, z, _) => {
        let schema = t.number.btwn(x, y)
        vi.assert.equal(schema(z), schema.min <= z && z <= schema.max)
        vi.assert.isFalse(schema(_))
      }
    )
  })

  vi.describe('〖⛳️〗‹‹ ❲t.bigint❳', () => {
    const anything = fc.anything().filter((_) => typeof _ !== 'bigint')
    const bigint = fc.bigInt()
    test.prop([bigint, bigint, anything])(
      '〖⛳️〗‹ ❲.min❳: property test',
      (x, y, _) => {
        let schema = t.bigint.min(x)
        vi.assert.equal(schema(y), schema.min <= y)
        vi.assert.isFalse(schema(_))
      }
    )
    test.prop([bigint, bigint, anything])(
      '〖⛳️〗‹ ❲.max❳: property test',
      (x, y, _) => {
        let schema = t.bigint.max(x)
        vi.assert.equal(schema(y), y <= schema.max)
        vi.assert.isFalse(schema(_))
      }
    )
    test.prop([bigint, bigint, anything])(
      '〖⛳️〗‹ ❲.gt❳: property test',
      (x, y, _) => {
        let schema = t.bigint.gt(x)
        vi.assert.equal(schema(y), schema.gt < y)
        vi.assert.isFalse(schema(_))
      }
    )
    test.prop([bigint, bigint, anything])(
      '〖⛳️〗‹ ❲.lt❳: property test',
      (x, y, _) => {
        let schema = t.bigint.lt(x)
        vi.assert.equal(schema(y), y < schema.lt)
        vi.assert.isFalse(schema(_))
      }
    )
    test.prop([bigint, bigint, bigint, anything])(
      '〖⛳️〗‹ ❲.btwn❳: property test',
      (x, y, z, _) => {
        let schema = t.bigint.btwn(x, y)
        vi.assert.equal(schema(z), schema.min <= z && z <= schema.max)
        vi.assert.isFalse(schema(_))
      }
    )
  })

  vi.describe('〖⛳️〗‹‹ ❲t.string❳', () => {
    const anything = fc.anything().filter((_) => typeof _ !== 'string')
    const string = fc.string()
    const integer = fc.integer()
    test.prop([integer, string, anything])(
      '〖⛳️〗‹ ❲.min❳: property test',
      (x, s, _) => {
        let schema = t.string.min(x)
        vi.assert.equal(schema(s), schema.min <= s.length)
        vi.assert.isFalse(schema(_))
      }
    )
    test.prop([integer, string, anything])(
      '〖⛳️〗‹ ❲.max❳: property test',
      (x, s, _) => {
        let schema = t.string.max(x)
        vi.assert.equal(schema(s), s.length <= schema.max)
        vi.assert.isFalse(schema(_))
      }
    )
    test.prop([integer, integer, string, anything])(
      '〖⛳️〗‹ ❲.btwn❳: property test',
      (x, y, s, _) => {
        let schema = t.string.btwn(x, y)
        vi.assert.equal(schema(s), schema.min <= s.length && s.length <= schema.max)
        vi.assert.isFalse(schema(_))
      }
    )
  })

  vi.describe('〖⛳️〗‹‹ ❲t.array❳', () => {
    const anything = fc.anything().filter((_) => !Array.isArray(_))
    const array = fc.array(fc.anything())
    const integer = fc.integer()
    test.prop([integer, array, anything])(
      '〖⛳️〗‹ ❲.min❳: property test',
      (x, xs, _) => {
        let schema = t.array(t.any).min(x)
        vi.assert.equal(schema(xs), schema.min <= xs.length)
        vi.assert.isFalse(schema(_))
      }
    )
    test.prop([integer, array, anything])(
      '〖⛳️〗‹ ❲.max❳: property test',
      (x, xs, _) => {
        let schema = t.array(t.any).max(x)
        vi.assert.equal(schema(xs), xs.length <= schema.max)
        vi.assert.isFalse(schema(_))
      }
    )
    test.prop([integer, integer, array, anything])(
      '〖⛳️〗‹ ❲.btwn❳: property test',
      (x, y, xs, _) => {
        let schema = t.array(t.any).btwn(x, y)
        vi.assert.equal(schema(xs), schema.min <= xs.length && xs.length <= schema.max)
        vi.assert.isFalse(schema(_))
      }
    )
  })
})

