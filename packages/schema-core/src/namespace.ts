export * as recurse from './recursive.js'

export { never } from './schemas/never.js'
export { any } from './schemas/any.js'
export { unknown } from './schemas/unknown.js'
export { void } from './schemas/void.js'
export { null } from './schemas/null.js'
export { undefined } from './schemas/undefined.js'
export { symbol } from './schemas/symbol.js'
export { boolean } from './schemas/boolean.js'
export { integer } from './schemas/integer.js'
export { bigint } from './schemas/bigint.js'
export { number } from './schemas/number.js'
export { string } from './schemas/string.js'
export { eq } from './schemas/eq.js'
export { optional } from './schemas/optional.js'
export { array, readonlyArray } from './schemas/array.js'
export { record } from './schemas/record.js'
export { union } from './schemas/union.js'
export { intersect } from './schemas/intersect.js'
export { tuple } from './schemas/tuple.js'
export { object } from './schemas/object.js'
export { nonnullable } from './nonnullable.js'
export { of } from './schemas/of.js'

export type {
  Boundable,
  Catalog,
  F,
  Fixpoint,
  Free,
  Inline,
  Leaf,
  Tag,
  TypeName,
  typeOf as typeof,
  Unary,
} from './core.ts'

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
  FirstOptionalItem,
  Guard,
  Guarded,
  IntersectType,
  TupleType,
  LowerBound,
  Optional,
  Predicate,
  Required,
  Schema,
  SchemaLike,
  Typeguard,
  UnknownSchema,
  Unspecified,
  ValidateTuple,
} from './types.js'

export { has } from './has.js'
export { key } from './key.js'

/* data-types & combinators */
export * from './combinators.js'
export { enum } from './enum.js'

/** 
 * exported as escape hatches, to prevent collisions with built-in keywords
 */
export { null as null_ } from './schemas/null.js'
export { undefined as undefined_ } from './schemas/undefined.js'
export { void as void_ } from './schemas/void.js'
