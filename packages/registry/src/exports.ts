export * from './globalThis.js'
export type * from './satisfies.js'
export type * from './types.js'
export * as fn from './function.js'
export * as Print from './print.js'

export { Match } from './types.js'

import * as symbol_ from './symbol.js'
type symbol_ = typeof symbol_[keyof typeof symbol_]
export { symbol_ as symbol }

import * as URI_ from './uri.js'
type URI_ = typeof URI_[keyof typeof URI_]
export { URI_ as URI }

export { NS, SCOPE } from './uri.js'
export { VERSION } from './version.js'
export type { TypeName } from './typeName.js'
export { typeName } from './typeName.js'
export { has } from './has.js'
export { parseArgs } from './parseArgs.js'
export {
  escape,
  isQuoted,
  isValidIdentifier,
  parseKey,
} from './parse.js'
export * as Equal from './equals.js'
export type Equal<T = any> = import('./types.js').Equal<T>

export type { GlobalOptions, OptionalTreatment, SchemaOptions } from './options.js'
export type { GlobalConfig, SchemaConfig } from './config.js'
export { applyOptions, configure, defaults, eqDefaults, getConfig } from './config.js'

export {
  /** @internal */
  fromPath as __fromPath,
  /** @internal */
  get as __get,
  /** @internal */
  parsePath as __parsePath,
} from './has.js'

export { unsafeCompact } from './compact.js'

export {
  omit,
  omit_,
  omitWhere,
  omitMethods,
  pick,
  pick_,
  pickWhere,
} from './pick.js'

export { merge, mut } from './merge.js'

export { } from './set.js'
