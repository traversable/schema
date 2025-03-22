export * as Recursive from './recursive.js'

export type {
  bottom,
  Entry,
  F,
  Fixpoint,
  Free,
  FullSchema,
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
  Functor,
  fold,
  foldWithIndex,
  unfold,
  tags,
} from './schema.js'

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
  inline,
  bigint,
  number,
  string,
  nonnullable,
  eq,
  optional,
  array,
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
