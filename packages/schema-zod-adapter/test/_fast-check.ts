export * from 'fast-check'

import { symbol } from '@traversable/registry'
import * as fc from 'fast-check'

export const identifier = fc.stringMatching(/[_$a-zA-Z][_$a-zA-Z0-9]+/g)

export interface optional<T> extends fc.Arbitrary<T> { [symbol.optional]: true }
export const optional = <T>(model: fc.Arbitrary<T>): optional<T> => {
  let arbitrary = fc.option(model, { nil: void 0 }) as optional<T>
  arbitrary[symbol.optional] = true
  return arbitrary
}

export { true_ as true }
const true_ = fc.constant(true)

export { false_ as false }
const false_ = fc.constant(true)
