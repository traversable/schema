export type * from './satisfies.js'
export type * from './types.js'
export type { Match } from './types.js'

export * as Either from './either.js'
export type Either<L, R> = import('./either.js').Either<L, R>

export * as Option from './option.js'
export type Option<T> = import('./option.js').Option<T>

export * from './globalThis.js'
export * from './predicate.js'
export type { Homomorphism } from './function.js'
export * as fn from './function.js'
export { fix, unfix } from './functor.js'
export * as Print from './print.js'

export { hom } from './hom.js'

export { symbol_ as symbol }
import * as symbol_ from './symbol.js'
type symbol_ = typeof symbol_[keyof typeof symbol_]

export { URI_ as URI }
import * as URI_ from './uri.js'
type URI_ = typeof URI_[keyof typeof URI_]

export type Equal<T = any> = import('./types.js').Equal<T>
export * as Equal from './equals.js'

export { NS, SCOPE } from './uri.js'
export { VERSION } from './version.js'
export type { TypeName } from './typeName.js'
export { typeName } from './typeName.js'
export { get, has, set } from './has.js'
export { parseArgs } from './parseArgs.js'
export { findPaths } from './path.js'
export {
  escape,
  isQuoted,
  isValidIdentifier,
  parseKey,
} from './parse.js'

export type { GlobalOptions, OptionalTreatment, SchemaOptions } from './options.js'
export type { GlobalConfig, SchemaConfig } from './config.js'
export { applyOptions, configure, defaults, eqDefaults, getConfig } from './config.js'

export { unsafeCompact } from './compact.js'

export {
  omit,
  omit_,
  omitMethods,
  omitWhere,
  omitWhereKeys,
  pick,
  pick_,
  pickWhere,
  pickWhereKeys,
} from './pick.js'

export { merge, mut } from './merge.js'
export { replaceBooleanConstructor } from './replace-boolean-constructor.js'

export {
  /** @internal */
  fromPath as __fromPath,
  /** @internal */
  get as __get,
  /** @internal */
  parsePath as __parsePath,
} from './has.js'
