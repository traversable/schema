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
  Entry,
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
} from '@traversable/registry'
export {
  Equal,
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
} from '@traversable/registry'

export {
  Cache,
  Json,
  VERSION as TRAVERSABLE_JSON_VERSION,
  json,
} from '@traversable/json'

export type {
  AnySchema,
  GlobalConfig,
  GlobalOptions,
  Guard,
  InvalidItem,
  Label,
  OptionalTreatment,
  Schema,
  SchemaConfig,
  SchemaOptions,
  T,
  TypePredicate,
  Unspecified,
  VERSION as TRAVERSABLE_CORE_VERSION,
  ValidateTuple,
} from '@traversable/schema-core'

export {
  AST,
  clone,
  configure,
  core,
  defaults,
  extend,
  getConfig,
  // t as c,
} from '@traversable/schema-core'

export {
  Eq,
  deep,
  fromSchema as equalsFnFromSchema,
  fromSeed,
  lax,
  VERSION as TRAVERSABLE_EQUALS_VERSION,
} from '@traversable/derive-equals'

export type {
  ValidationError,
  ValidationFn,
} from '@traversable/derive-validators'
export {
  ErrorType,
  Errors,
  Validator,
  dataPathFromSchemaPath,
  v,
  validatorFromSchema,
  VERSION as TRAVERSABLE_VALIDATORS_VERSIOc,
} from '@traversable/derive-validators'

export type {
  Extend,
  Pipe,
} from '@traversable/schema-codec'
export {
  Codec,
  pipe,
  VERSION as TRAVERSABLE_CODEC_VERSION,
} from '@traversable/schema-codec'

export {
  // t as show,
  toString,
  VERSION as TRAVERSABLE_TO_STRING_VERSION,
} from '@traversable/schema-to-string'


export type {
  MinItems,
} from '@traversable/schema-to-json-schema'

export {
  JsonSchema,
  fold,
  fromJsonSchema,
  minItems,
  // t,
  toJsonSchema,
  unfold,
  VERSION as TRAVERSABLE_TO_JSON_SCHEMA_VERSION,
} from '@traversable/schema-to-json-schema'

export * as Seed from './seed.js'
export type Seed<T = never> = [T] extends [never]
  ? import('./seed.js').Fixpoint
  : import('./seed.js').Seed<T>

export * as Predicate from './predicates.js'
export type Predicate<T = any> = import('@traversable/schema-core').Predicate<T>

export { get, get$ } from './utils.js'

export { VERSION } from './version.js'
export { t } from './namespace.js'
