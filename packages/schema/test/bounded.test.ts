import * as vi from 'vitest'
import { t, __within as within, __withinBig as withinBig } from '@traversable/schema'
import { fc, test } from '@fast-check/vitest'

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema/bounded❳', () => {
  vi.it('〖⛳️〗‹ ❲within❳', () => {
    // SUCCESS
    vi.assert.isTrue(within({ gt: 0 })(1))
    vi.assert.isTrue(within({ gt: 0, lt: 2 })(1))
    vi.assert.isTrue(within({ lt: 2 })(1))
    // FAILURE
    vi.assert.isFalse(within({ gt: 0 })(0))
    vi.assert.isFalse(within({ gt: 0, lt: 0 })(0))
    vi.assert.isFalse(within({ lt: 0 })(0))
    /* @ts-expect-error */
    vi.assert.throws(() => within({ gt: '' })(0.5))
  })

  vi.it('〖⛳️〗‹ ❲withinBig❳', () => {
    // SUCCESS
    vi.assert.isTrue(withinBig({})(1))
    vi.assert.isTrue(withinBig({ lte: 1 })(1))
    vi.assert.isTrue(withinBig({ gte: 1 })(1))
    vi.assert.isTrue(withinBig({ lt: 2 })(1))
    vi.assert.isTrue(withinBig({ gt: 0 })(1))
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
    // FAILURE
    vi.assert.isFalse(withinBig({ lte: 0 })(1))
    vi.assert.isFalse(withinBig({ gte: 1 })(-1))
    vi.assert.isFalse(withinBig({ lt: 0 })(1))
    vi.assert.isFalse(withinBig({ gt: 2 })(-1))
    vi.assert.isFalse(withinBig({ gt: 0, lt: 2 })(-1))
    vi.assert.isFalse(withinBig({ gt: 0, lte: 1 })(-1))
    vi.assert.isFalse(withinBig({ gte: 0, lt: 2 })(-1))
    vi.assert.isFalse(withinBig({ gte: 0, lte: 1 })(-1))
    vi.assert.isFalse(withinBig({ gt: 0, lt: 2, gte: 1 })(-1))
    vi.assert.isFalse(withinBig({ gt: 0, lte: 1, gte: 1 })(-1))
    vi.assert.isFalse(withinBig({ gte: 1, lt: 2, lte: 1 })(-1))
    vi.assert.isFalse(withinBig({ gte: 1, lte: 1, lt: 2 })(-1))
    vi.assert.isFalse(withinBig({ gte: 1, lte: 1, gt: 0 })(-1))
    vi.assert.isFalse(withinBig({ gte: 1, lt: 2, gt: 0 })(-1))
    vi.assert.isFalse(withinBig({ gte: 1, lte: 1, lt: 2, gt: 0 })(-1))
    /* @ts-expect-error */
    vi.assert.throws(() => withinBig({ gt: '' })(0.5))
  })

  vi.describe('〖⛳️〗‹‹ ❲t.integer❳', () => {
    vi.it('〖⛳️〗‹ ❲t.integer.min(x).max(x)❳: property test', () => {
      let ex_01 = t.integer.min(0).max(1)
      vi.assert.equal(ex_01.minimum, 0)
      vi.assert.equal(ex_01.maximum, 1)
    })
    vi.it('〖⛳️〗‹ ❲t.integer.max(x).min(x)❳: property test', () => {
      let ex_01 = t.integer.max(10).min(-10)
      vi.assert.equal(ex_01.maximum, 10)
      vi.assert.equal(ex_01.minimum, -10)
    })
    vi.it('〖⛳️〗‹ ❲t.integer.moreThan(x).lessThan(x)❳: property test', () => {
      let ex_01 = t.integer.moreThan(0).lessThan(1)
      vi.assert.equal(ex_01.exclusiveMinimum, 0)
      vi.assert.equal(ex_01.exclusiveMaximum, 1)
    })
    vi.it('〖⛳️〗‹ ❲t.integer.lessThan(x).moreThan(x)❳: property test', () => {
      let ex_01 = t.integer.lessThan(10).moreThan(1)
      vi.assert.equal(ex_01.exclusiveMinimum, 1)
      vi.assert.equal(ex_01.exclusiveMaximum, 10)
    })
    vi.it('〖⛳️〗‹ ❲t.integer.min(x).lessThan(x)❳: property test', () => {
      let ex_01 = t.integer.min(0).lessThan(2)
      vi.assert.equal(ex_01.minimum, 0)
      vi.assert.equal(ex_01.exclusiveMaximum, 2)
    })
    vi.it('〖⛳️〗‹ ❲t.integer.lessThan(x).min(x)❳: property test', () => {
      let ex_01 = t.integer.lessThan(10).min(2)
      vi.assert.equal(ex_01.minimum, 2)
      vi.assert.equal(ex_01.exclusiveMaximum, 10)
    })
    vi.it('〖⛳️〗‹ ❲t.integer.max(x).moreThan(x)❳: property test', () => {
      let ex_01 = t.integer.max(10).moreThan(2)
      vi.assert.equal(ex_01.maximum, 10)
      vi.assert.equal(ex_01.exclusiveMinimum, 2)
    })
    vi.it('〖⛳️〗‹ ❲t.integer.moreThan(x).max(x)❳: property test', () => {
      let ex_01 = t.integer.moreThan(10).max(100)
      vi.assert.equal(ex_01.maximum, 100)
      vi.assert.equal(ex_01.exclusiveMinimum, 10)
    })

    const anything = fc.anything().filter((_) => !Number.isSafeInteger(_))
    const integer = fc.integer()
    test.prop([integer, integer, anything])(
      '〖⛳️〗‹ ❲.min❳: property test',
      (x, y, _) => {
        let schema = t.integer.min(x)
        vi.assert.equal(schema(y), schema.minimum <= y)
        vi.assert.isFalse(schema(_))
      }
    )
    test.prop([integer, integer, anything])(
      '〖⛳️〗‹ ❲.max❳: property test',
      (x, y, _) => {
        let schema = t.integer.max(x)
        vi.assert.equal(schema(y), y <= schema.maximum)
        vi.assert.isFalse(schema(_))
      }
    )
    test.prop([integer, integer, anything])(
      '〖⛳️〗‹ ❲.moreThan❳: property test',
      (x, y, _) => {
        let schema = t.integer.moreThan(x)
        vi.assert.equal(schema(y), schema.exclusiveMinimum < y)
        vi.assert.isFalse(schema(_))
      }
    )
    test.prop([integer, integer, anything])(
      '〖⛳️〗‹ ❲.lessThan❳: property test',
      (x, y, _) => {
        let schema = t.integer.lessThan(x)
        vi.assert.equal(schema(y), y < schema.exclusiveMaximum)
        vi.assert.isFalse(schema(_))
      }
    )
    test.prop([integer, integer, integer, anything])(
      '〖⛳️〗‹ ❲.between❳: property test',
      (x, y, z, _) => {
        let schema = t.integer.between(x, y)
        vi.assert.equal(schema(z), schema.minimum <= z && z <= schema.maximum)
        vi.assert.isFalse(schema(_))
      }
    )
  })

  vi.describe('〖⛳️〗‹‹ ❲t.number❳', () => {
    vi.it('〖⛳️〗‹ ❲t.number.min(x).max(x)❳: property test', () => {
      let ex_01 = t.number.min(0).max(1)
      vi.assert.equal(ex_01.minimum, 0)
      vi.assert.equal(ex_01.maximum, 1)
    })
    vi.it('〖⛳️〗‹ ❲t.number.max(x).min(x)❳: property test', () => {
      let ex_01 = t.number.max(10).min(-10)
      vi.assert.equal(ex_01.maximum, 10)
      vi.assert.equal(ex_01.minimum, -10)
    })
    vi.it('〖⛳️〗‹ ❲t.number.moreThan(x).lessThan(x)❳: property test', () => {
      let ex_01 = t.number.moreThan(0).lessThan(1)
      vi.assert.equal(ex_01.exclusiveMinimum, 0)
      vi.assert.equal(ex_01.exclusiveMaximum, 1)
    })
    vi.it('〖⛳️〗‹ ❲t.number.lessThan(x).moreThan(x)❳: property test', () => {
      let ex_01 = t.number.lessThan(10).moreThan(1)
      vi.assert.equal(ex_01.exclusiveMinimum, 1)
      vi.assert.equal(ex_01.exclusiveMaximum, 10)
    })
    vi.it('〖⛳️〗‹ ❲t.number.min(x).lessThan(x)❳: property test', () => {
      let ex_01 = t.number.min(0).lessThan(2)
      vi.assert.equal(ex_01.minimum, 0)
      vi.assert.equal(ex_01.exclusiveMaximum, 2)
    })
    vi.it('〖⛳️〗‹ ❲t.number.lessThan(x).min(x)❳: property test', () => {
      let ex_01 = t.number.lessThan(10).min(2)
      vi.assert.equal(ex_01.minimum, 2)
      vi.assert.equal(ex_01.exclusiveMaximum, 10)
    })
    vi.it('〖⛳️〗‹ ❲t.number.max(x).moreThan(x)❳: property test', () => {
      let ex_01 = t.number.max(10).moreThan(2)
      vi.assert.equal(ex_01.maximum, 10)
      vi.assert.equal(ex_01.exclusiveMinimum, 2)
    })
    vi.it('〖⛳️〗‹ ❲t.number.moreThan(x).max(x)❳: property test', () => {
      let ex_01 = t.number.moreThan(10).max(100)
      vi.assert.equal(ex_01.maximum, 100)
      vi.assert.equal(ex_01.exclusiveMinimum, 10)
    })

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
        vi.assert.equal(schema(y), schema.minimum <= y)
        vi.assert.isFalse(schema(_))
      }
    )
    test.prop([number, number, anything])(
      '〖⛳️〗‹ ❲.max❳: property test',
      (x, y, _) => {
        let schema = t.number.max(x)
        vi.assert.equal(schema(y), y <= schema.maximum)
        vi.assert.isFalse(schema(_))
      }
    )
    test.prop([number, number, anything])(
      '〖⛳️〗‹ ❲.moreThan❳: property test',
      (x, y, _) => {
        let schema = t.number.moreThan(x)
        vi.assert.equal(schema(y), schema.exclusiveMinimum < y)
        vi.assert.isFalse(schema(_))
      }
    )
    test.prop([number, number, anything])(
      '〖⛳️〗‹ ❲.lessThan❳: property test',
      (x, y, _) => {
        let schema = t.number.lessThan(x)
        vi.assert.equal(schema(y), y < schema.exclusiveMaximum)
        vi.assert.isFalse(schema(_))
      }
    )
    test.prop([number, number, number, anything])(
      '〖⛳️〗‹ ❲.between❳: property test',
      (x, y, z, _) => {
        let schema = t.number.between(x, y)
        vi.assert.equal(schema(z), schema.minimum <= z && z <= schema.maximum)
        vi.assert.isFalse(schema(_))
      }
    )
  })

  vi.describe('〖⛳️〗‹‹ ❲t.bigint❳', () => {
    vi.it('〖⛳️〗‹ ❲t.bigint.min(x).max(x)❳: property test', () => {
      let ex_01 = t.bigint.min(0n).max(1n)
      vi.assert.equal(ex_01.minimum, 0n)
      vi.assert.equal(ex_01.maximum, 1n)
    })
    vi.it('〖⛳️〗‹ ❲t.bigint.max(x).min(x)❳: property test', () => {
      let ex_01 = t.bigint.max(10n).min(-10n)
      vi.assert.equal(ex_01.maximum, 10n)
      vi.assert.equal(ex_01.minimum, -10n)
    })
    vi.it('〖⛳️〗‹ ❲t.bigint.moreThan(x).lessThan(x)❳: property test', () => {
      let ex_01 = t.bigint.moreThan(0n).lessThan(1n)
      vi.assert.equal(ex_01.exclusiveMinimum, 0n)
      vi.assert.equal(ex_01.exclusiveMaximum, 1n)
    })
    vi.it('〖⛳️〗‹ ❲t.bigint.lessThan(x).moreThan(x)❳: property test', () => {
      let ex_01 = t.bigint.lessThan(10n).moreThan(1n)
      vi.assert.equal(ex_01.exclusiveMinimum, 1n)
      vi.assert.equal(ex_01.exclusiveMaximum, 10n)
    })
    vi.it('〖⛳️〗‹ ❲t.bigint.min(x).lessThan(x)❳: property test', () => {
      let ex_01 = t.bigint.min(0n).lessThan(2n)
      vi.assert.equal(ex_01.minimum, 0n)
      vi.assert.equal(ex_01.exclusiveMaximum, 2n)
    })
    vi.it('〖⛳️〗‹ ❲t.bigint.lessThan(x).min(x)❳: property test', () => {
      let ex_01 = t.bigint.lessThan(10n).min(2n)
      vi.assert.equal(ex_01.minimum, 2n)
      vi.assert.equal(ex_01.exclusiveMaximum, 10n)
    })
    vi.it('〖⛳️〗‹ ❲t.bigint.max(x).moreThan(x)❳: property test', () => {
      let ex_01 = t.bigint.max(10n).moreThan(2n)
      vi.assert.equal(ex_01.maximum, 10n)
      vi.assert.equal(ex_01.exclusiveMinimum, 2n)
    })
    vi.it('〖⛳️〗‹ ❲t.bigint.moreThan(x).max(x)❳: property test', () => {
      let ex_01 = t.bigint.moreThan(10n).max(100n)
      vi.assert.equal(ex_01.maximum, 100n)
      vi.assert.equal(ex_01.exclusiveMinimum, 10n)
    })


    const anything = fc.anything().filter((_) => typeof _ !== 'bigint')
    const bigint = fc.bigInt()
    test.prop([bigint, bigint, anything])(
      '〖⛳️〗‹ ❲.min❳: property test',
      (x, y, _) => {
        let schema = t.bigint.min(x)
        vi.assert.equal(schema(y), schema.minimum <= y)
        vi.assert.isFalse(schema(_))
      }
    )
    test.prop([bigint, bigint, anything])(
      '〖⛳️〗‹ ❲.max❳: property test',
      (x, y, _) => {
        let schema = t.bigint.max(x)
        vi.assert.equal(schema(y), y <= schema.maximum)
        vi.assert.isFalse(schema(_))
      }
    )
    test.prop([bigint, bigint, anything])(
      '〖⛳️〗‹ ❲.moreThan❳: property test',
      (x, y, _) => {
        let schema = t.bigint.moreThan(x)
        vi.assert.equal(schema(y), schema.exclusiveMinimum < y)
        vi.assert.isFalse(schema(_))
      }
    )
    test.prop([bigint, bigint, anything])(
      '〖⛳️〗‹ ❲.lessThan❳: property test',
      (x, y, _) => {
        let schema = t.bigint.lessThan(x)
        vi.assert.equal(schema(y), y < schema.exclusiveMaximum)
        vi.assert.isFalse(schema(_))
      }
    )
    test.prop([bigint, bigint, bigint, anything])(
      '〖⛳️〗‹ ❲.between❳: property test',
      (x, y, z, _) => {
        let schema = t.bigint.between(x, y)
        vi.assert.equal(schema(z), schema.minimum <= z && z <= schema.maximum)
        vi.assert.isFalse(schema(_))
      }
    )
  })

  vi.describe('〖⛳️〗‹‹ ❲t.string❳', () => {
    vi.it('〖⛳️〗‹ ❲t.string.min(x).max(x)❳: property test', () => {
      let ex_01 = t.string.min(0).max(1)
      vi.assert.equal(ex_01.minLength, 0)
      vi.assert.equal(ex_01.maxLength, 1)
    })
    vi.it('〖⛳️〗‹ ❲t.string.max(x).min(x)❳: property test', () => {
      let ex_01 = t.string.max(10).min(-10)
      vi.assert.equal(ex_01.maxLength, 10)
      vi.assert.equal(ex_01.minLength, -10)
    })
    vi.it('〖⛳️〗‹ ❲t.number.moreThan(x).lessThan(x)❳: property test', () => {
      let ex_01 = t.number.moreThan(0).lessThan(1)
      vi.assert.equal(ex_01.exclusiveMinimum, 0)
      vi.assert.equal(ex_01.exclusiveMaximum, 1)
    })
    vi.it('〖⛳️〗‹ ❲t.number.lessThan(x).moreThan(x)❳: property test', () => {
      let ex_01 = t.number.lessThan(10).moreThan(1)
      vi.assert.equal(ex_01.exclusiveMinimum, 1)
      vi.assert.equal(ex_01.exclusiveMaximum, 10)
    })
    vi.it('〖⛳️〗‹ ❲t.number.min(x).lessThan(x)❳: property test', () => {
      let ex_01 = t.number.min(0).lessThan(2)
      vi.assert.equal(ex_01.minimum, 0)
      vi.assert.equal(ex_01.exclusiveMaximum, 2)
    })
    vi.it('〖⛳️〗‹ ❲t.number.lessThan(x).min(x)❳: property test', () => {
      let ex_01 = t.number.lessThan(10).min(2)
      vi.assert.equal(ex_01.minimum, 2)
      vi.assert.equal(ex_01.exclusiveMaximum, 10)
    })
    vi.it('〖⛳️〗‹ ❲t.number.max(x).moreThan(x)❳: property test', () => {
      let ex_01 = t.number.max(10).moreThan(2)
      vi.assert.equal(ex_01.maximum, 10)
      vi.assert.equal(ex_01.exclusiveMinimum, 2)
    })
    vi.it('〖⛳️〗‹ ❲t.number.moreThan(x).max(x)❳: property test', () => {
      let ex_01 = t.number.moreThan(10).max(100)
      vi.assert.equal(ex_01.maximum, 100)
      vi.assert.equal(ex_01.exclusiveMinimum, 10)
    })

    const anything = fc.anything().filter((_) => typeof _ !== 'string')
    const string = fc.string()
    const integer = fc.nat()
    const oneOrMore = fc.integer({ min: 1 })
    test.prop([integer, string, anything])(
      '〖⛳️〗‹ ❲.min❳: property test',
      (x, s, _) => {
        let schema = t.string.min(x)
        vi.assert.equal(schema(s), schema.minLength <= s.length)
        vi.assert.isFalse(schema(_))
      }
    )
    test.prop([integer, string, anything])(
      '〖⛳️〗‹ ❲.max❳: property test',
      (x, s, _) => {
        let schema = t.string.max(x)
        vi.assert.equal(schema(s), s.length <= schema.maxLength)
        vi.assert.isFalse(schema(_))
      }
    )
    test.prop([integer, integer, string, anything])(
      '〖⛳️〗‹ ❲.between❳: property test',
      (x, y, s, _) => {
        let schema = t.string.between(x, y)
        vi.assert.equal(schema(s), schema.minLength <= s.length && s.length <= schema.maxLength)
        vi.assert.isFalse(schema(_))
      }
    )
  })

  vi.describe('〖⛳️〗‹‹ ❲t.array❳', () => {
    const anything = fc.anything().filter((_) => !Array.isArray(_))
    const array = fc.array(fc.anything())
    const integer = fc.nat()
    test.prop([integer, array, anything])(
      '〖⛳️〗‹ ❲.min❳: property test',
      (x, xs, _) => {
        let schema = t.array(t.any).min(x)
        vi.assert.equal(schema(xs), schema.minLength <= xs.length)
        vi.assert.isFalse(schema(_))
      }
    )
    test.prop([integer, array, anything])(
      '〖⛳️〗‹ ❲.max❳: property test',
      (x, xs, _) => {
        let schema = t.array(t.any).max(x)
        vi.assert.equal(schema(xs), xs.length <= schema.maxLength)
        vi.assert.isFalse(schema(_))
      }
    )
    test.prop([integer, integer, array, anything])(
      '〖⛳️〗‹ ❲.between❳: property test',
      (x, y, xs, _) => {
        let schema = t.array(t.any).between(x, y)
        vi.assert.equal(schema(xs), schema.minLength <= xs.length && xs.length <= schema.maxLength)
        vi.assert.isFalse(schema(_))
      }
    )
  })
})

