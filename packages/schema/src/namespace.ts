export * from './combinators.js'
export * as Recursive from './recursive.js'
export { enum } from './enum.js'

export type {
  typeOf as typeof,
  // Unspecified,
  // invalid,
  // Predicate,
} from './core.js'
export {
  // isLeaf,
} from './core.js'

export type {
  Unspecified,
  invalid,
  Predicate,
  LowerBound,
  F,
  Fixpoint,
  Free,
  FullSchema,
  Schema,
  ReadonlyArray,
  Tag,
  top,
  bottom,
} from './schema.js'
export {
  isLeaf,
  Functor,
  fold,
  foldWithIndex,
  unfold,
  tags,
} from './schema.js'

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
  // nonnullable,
  eq,
  optional,
  array,
  record,
  union,
  intersect,
  tuple,
  object,
} from './schema.js'
