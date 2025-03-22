/** TODO: extract `Seed` package */
export type {
  Algebra,
  Atoms,
  Coalgebra,
  Comparator,
  Conform,
  Const,
  Dictionary,
  Either,
  Entries,
  Force,
  Functor,
  HKT,
  Identity,
  IndexedAlgebra,
  IndexedRAlgebra,
  Intersect,
  Join,
  Kind,
  Mut,
  Mutable,
  NonUnion,
  Param,
  Primitive,
  RAlgebra,
  Returns,
  Showable,
  Tuple,
  Type,
  TypeConstructor,
  TypeError,
  TypeName,
  UnionToIntersection,
  UnionToTuple,
  inline,
  newtype,
  GlobalConfig,
  SchemaConfig,
  SchemaOptions,
} from '@traversable/registry'
export {
  configure,
  defaults,
  getConfig,
  applyOptions,
} from '@traversable/registry'

export * as t from './namespace.js'
export type { FullSchema } from './namespace.js'

export * as recurse from './recursive.js'

export * as Equal from './equals.js'
export type Equal<T = never> = import('@traversable/registry').Equal<T>

export * as Predicate from './predicates.js'
export type Predicate<T = never> = [T] extends [never]
  ? import('./schema.js').Predicate
  : import('./types.js').Predicate<T>

export * as Json from './json.js'
export type Json<T = never> = [T] extends [never]
  ? import('./json.js').Json
  : import('./json.js').Unary<T>

export {
} from './config.js'
export type {
} from './options.js'

export {
  clone,
  extend,
} from './extend.js'

export * from './extensions.js'

export {
  ErrorType,
} from './errors.js'

export type {
  Guard,
  Typeguard,
} from './types.js'

export { get, get$ } from './utils.js'

export { VERSION } from './version.js'
