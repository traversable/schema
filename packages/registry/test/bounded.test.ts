import * as vi from 'vitest'
import { carryover, within, withinBig } from '@traversable/registry'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-core/bounded❳', () => {
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

  vi.it('〖⛳️〗› ❲~carryover❳', () => {
    vi.assert.deepEqual(carryover({}), {})
  })
})

