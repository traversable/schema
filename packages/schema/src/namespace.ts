export * as recurse from './recursive.js'

export type {
  bottom,
  Boundable,
  Entry,
  F,
  Fixpoint,
  Free,
  Inline,
  invalid,
  Leaf,
  LowerBound,
  Predicate,
  ReadonlyArray,
  Schema,
  Tag,
  top,
  typeOf as typeof,
  Unspecified,
} from './schema.js'

export {
  isLeaf,
  isNullary,
  isNullaryTag,
  isBoundable,
  isBoundableTag,
  isPredicate,
  isUnary,
  isCore,
  Functor,
  IndexedFunctor,
  fold,
  foldWithIndex,
  unfold,
  tags,
} from './schema.js'

export { key, has } from './has.js'

/* data-types & combinators */
export * from './combinators.js'
export { enum } from './enum.js'
export {
  never,
  unknown,
  any,
  void,
  null,
  undefined,
  symbol,
  boolean,
  integer,
  of,
  bigint,
  number,
  string,
  nonnullable,
  eq,
  optional,
  array,
  readonlyArray,
  record,
  union,
  intersect,
  tuple,
  object,
} from './schema.js'

/** 
 * exported as escape hatches, to prevent collisions with built-in keywords
 */
export type {
  typeOf as typeof_,
  null_,
  void_,
} from './schema.js'
