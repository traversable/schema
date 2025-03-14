import * as fc from 'fast-check'
import * as vi from 'vitest'
import lodashIsEqual from 'lodash.isequal'
import { Equal } from '@traversable/schema'

const isEqual = Equal.deep

const [x, y] = fc.sample(fc.dictionary(fc.string(), fc.jsonValue()), 2)

vi.describe('〖🏁️〗‹‹‹ ❲deepEquals❳: same value', () => {
  // baseline
  vi.bench('❲lodash.isEqual❳', () => {
    lodashIsEqual(x, x)
    lodashIsEqual(y, y)
  })
  // our implementation
  vi.bench('❲isEqual❳', () => {
    isEqual(x, x)
    isEqual(y, y)
  })
})

vi.describe('〖🏁️〗‹‹‹ ❲deepEquals❳: different values', () => {
  // baseline
  vi.bench('❲lodash.isEqual❳', () => {
    lodashIsEqual(x, y)
    lodashIsEqual(y, x)
  })

  // our implementation
  vi.bench('❲isEqual❳', () => {
    isEqual(x, y)
    isEqual(y, x)
  })
})
