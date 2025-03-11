export * as Seed from './seed.js'
export type Seed<T = never> = [T] extends [never]
  ? import('./seed.js').Fixpoint
  : import('./seed.js').Seed<T>

export * as t from './namespace.js'
export * as Rec from './recursive.js'

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
  Print,
  escape,
  fn,
  has,
  isQuoted,
  isValidIdentifier,
  parseArgs,
  parseKey,
  typeName,
} from './registry.js'

export * as Sym from './symbol.js'
export * as URI from './uri.js'
export { NS, SCOPE } from './uri.js'


export * as Equal from './equals.js'
export type Equal<T = never> = import('./registry-types.js').Equal<T>

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

export {
  clone,
  extend,
} from './extend.js'

export type {
  AnySchema,
  Entry,
  F,
  Fixpoint,
  Free,
  Leaf,
  Schema,
  Unspecified,
} from './core.js'

export * as core from './core.js'
export * as AST from './ast.js'

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

export * as toString from './toString.js'

export * as Predicate from './predicates.js'
export type Predicate<T = never> = [T] extends [never]
  ? import('./core.js').Predicate
  : import('./types.js').Predicate<T>

export * as Json from './json.js'
export type Json<T = never> = [T] extends [never]
  ? import('./json.js').Json
  : import('./json.js').Unary<T>

export * as JsonSchema from './jsonSchema.js'
export type JsonSchema<T = never> = [T] extends [never]
  ? import('./jsonSchema.js').JsonSchema
  : import('./jsonSchema.js').Unary<T>

export { get, get$ } from './utils.js'

export { VERSION } from './version.js'

// export {
//   AST,
//   clone,
//   configure,
//   core,
//   defaults,
//   extend,
//   getConfig,
//   // t as c,
// } from '@traversable/schema-core'

// export type {
//   MinItems,
// } from '@traversable/schema-to-json-schema'

// export {
//   Cache,
//   Json,
//   VERSION as TRAVERSABLE_JSON_VERSION,
//   json,
// } from '@traversable/json'

// export {
//   JsonSchema,
//   fold,
//   fromJsonSchema,
//   minItems,
//   // t,
//   toJsonSchema,
//   unfold,
//   VERSION as TRAVERSABLE_TO_JSON_SCHEMA_VERSION,
// } from '@traversable/schema-to-json-schema'

// export {
//   ErrorType,
//   Errors,
//   Validator,
//   dataPathFromSchemaPath,
//   v,
//   validatorFromSchema,
//   VERSION as TRAVERSABLE_VALIDATORS_VERSIOc,
// } from '@traversable/derive-validators'

// export type {
//   ValidationError,
//   ValidationFn,
// } from '@traversable/derive-validators'
