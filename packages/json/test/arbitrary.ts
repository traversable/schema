import { Json } from '@traversable/json'
import * as fc from 'fast-check'

/** @internal */
const depthIdentifier = fc.createDepthIdentifier()

/** @internal */
const identifier = fc.stringMatching(/[_$a-zA-Z][_$a-zA-Z0-9]+/g)

/** @internal */
const scalars = [
  fc.constant(null),
  fc.constant(undefined),
  fc.boolean(),
  fc.integer(),
  fc.float(),
  fc.string(),
]

/** @internal */
const seed: fc.LetrecTypedBuilder<Seed> = (LOOP) => {
  return {
    scalar: fc.oneof(...scalars),
    array: fc.array(LOOP('any')),
    object: fc.dictionary(identifier, LOOP('any')),
    any: fc.oneof(
      { depthIdentifier, maxDepth: 2, depthSize: 'xsmall', withCrossShrink: true },
      ...scalars,
      LOOP('scalar'),
      LOOP('array'),
      LOOP('object'),
    )
  }
}

/**
 * ## {@link Seed `Json.Seed`}
 * 
 * This type describes an object whose values are [fast-check](https://github.com/dubzzz/fast-check)
 * arbitraries that are capable of generating arbitrary, valid JSON values.
 * 
 * See also:
 * - {@link Arbitrary `Json.Arbitrary`}
 */
export interface Seed {
  any: Json
  scalar: Json.Scalar
  array: readonly this['any'][]
  object: Record<string, this['any']>
}

/**
 * ## {@link Arbitrary `Json.Arbitrary`}
 * 
 * An object whose values are [fast-check](https://github.com/dubzzz/fast-check)
 * arbitraries that are capable of generating arbitrary, valid JSON values.
 * 
 * See also:
 * - {@link Seed `Json.Seed`}
 */
export const Arbitrary = fc.letrec(seed)
