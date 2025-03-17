export * from './combinators.js'
export * as Recursive from './recursive.js'
export { enum } from './enum.js'

export type {
  typeOf as typeof,
  Unspecified,
  invalid,
  top,
  bottom,
  Predicate,
} from './core.js'
export {
  isLeaf,
} from './core.js'

export type {
  LowerBound,
  F,
  Fixpoint,
  Free,
  FullSchema,
  Schema,
  ReadonlyArray,
} from './schema.js'
export {
  Functor,
  fold,
  unfold,
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
  eq,
  optional,
  array,
  record,
  union,
  intersect,
  tuple,
  object,
} from './schema.js'
