/** TODO: extract `Seed` package */

export * as t from './namespace.js'
export type { FullSchema } from './namespace.js'

export * as recurse from './recursive.js'

export * as Equal from './equals.js'
export type Equal<T = never> = import('./registry.js').Equal<T>

export * as Predicate from './predicates.js'
export type Predicate<T = never> = [T] extends [never]
  ? import('./schema.js').Predicate
  : import('./types.js').Predicate<T>

export * as Json from './json.js'
export type Json<T = never> = [T] extends [never]
  ? import('./json.js').Json
  : import('./json.js').Unary<T>

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
} from './registry.js'

export {
  NS,
  Print,
  SCOPE,
  URI,
  escape,
  fn,
  has,
  isQuoted,
  isValidIdentifier,
  parseArgs,
  parseKey,
  registry,
  symbol,
  typeName,
  VERSION as TRAVERSABLE_REGISTRY_VERSION,
} from './registry.js'

export type {
  GlobalConfig,
  SchemaConfig,
} from './config.js'
export {
  configure,
  defaults,
  getConfig,
  applyOptions,
} from './config.js'
export type {
  SchemaOptions,
} from './options.js'

export {
  clone,
  extend,
} from './extend.js'

export * from './extensions.js'
export {
  bindPipes,
} from './bind.js'

export {
  ErrorType,
} from './errors.js'

export type {
  Extend,
  Pipe,
} from './codec.js'
export {
  Codec,
  pipe,
} from './codec.js'

export type {
  Guard,
  Typeguard,
} from './types.js'

export { get, get$ } from './utils.js'

export { VERSION } from './version.js'
