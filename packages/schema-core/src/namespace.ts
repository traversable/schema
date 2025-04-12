export * as recurse from './recursive.js'

export type {
  Boundable,
  F,
  Fixpoint,
  Free,
  Inline,
  Leaf,
  Tag,
  typeOf as typeof,
} from './core.ts'

export { never } from './never.js'
export { any } from './any.js'
export { unknown } from './unknown.js'
export { void } from './void.js'
export { null } from './null.js'
export { undefined } from './undefined.js'
export { symbol } from './symbol.js'
export { boolean } from './boolean.js'
export { integer } from './integer.js'
export { bigint } from './bigint.js'
export { number } from './number.js'
export { string } from './string.js'
export { eq } from './eq.js'
export { optional } from './optional.js'
export { array } from './array.js'
export { record } from './record.js'
export { union } from './union.js'
export { intersect } from './intersect.js'
export { tuple } from './tuple.js'
export { object } from './object.js'
export { nonnullable } from './nonnullable.js'
export { of } from './of.js'
export { readonlyArray } from './readonlyArray.js'

export {
  isLeaf,
  isNullary,
  isNullaryTag,
  isBoundable,
  isBoundableTag,
  isUnary,
  isCore,
  Functor,
  IndexedFunctor,
  fold,
  foldWithIndex,
  unfold,
  tags,
} from './core.js'

export type {
  bottom,
  invalid,
  top,
  Entry,
  LowerBound,
  Optional,
  Predicate,
  Required,
  Schema,
  Typeguard,
  UnknownSchema,
  Unspecified,
} from './types.js'

export { has } from './has.js'
export { key } from './key.js'

/* data-types & combinators */
export * from './combinators.js'
export { enum } from './enum.js'

/** 
 * exported as escape hatches, to prevent collisions with built-in keywords
 */
export { null as null_ } from './null.js'
export { undefined as undefined_ } from './undefined.js'
export { void as void_ } from './void.js'
