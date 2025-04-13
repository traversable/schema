import * as symbol_ from './symbol.js'
type symbol_ = typeof symbol_[keyof typeof symbol_]
export { symbol_ as symbol }

import * as URI_ from './uri.js'
type URI_ = typeof URI_[keyof typeof URI_]
export { URI_ as URI }
export { NS, SCOPE } from './uri.js'

export * as Equal from './equals.js'
export type Equal<T = any> = import('./types.js').Equal<T>

export type * from './satisfies.js'
export type * from './types.js'

export * from './globalThis.js'
export * as fn from './function.js'
export * as Print from './print.js'
export * from './predicate.js'

export { VERSION } from './version.js'

export type { GlobalOptions, OptionalTreatment, SchemaOptions } from './options.js'
export type { GlobalConfig, SchemaConfig } from './config.js'
export { applyOptions, configure, defaults, eqDefaults, getConfig } from './config.js'
export type { TypeName } from './typeName.js'
export { typeName } from './typeName.js'
export type { Bounds } from './bounded.js'
export { carryover, within, withinBig } from './bounded.js'
export { join } from './join.js'
export { has } from './has.js'
export { parseArgs } from './parseArgs.js'
export { escape, isQuoted, isValidIdentifier, parseKey } from './parse.js'
export { IsStrictlyEqual, SameType, SameValue, SameValueNumber, deep as deepEquals, lax as laxEquals } from './equals.js'
export { unsafeCompact } from './compact.js'
export { bindUserExtensions } from './bindUserExtensions.js'
export { safeCoerce } from './safeCoerce.js'
export { map } from './mapObject.js'
export { objectFromKeys, omit, omit_, omitWhere, omitMethods, pick, pick_, pickWhere } from './pick.js'
export { merge, mut } from './merge.js'
export { ValueSet } from './set.js'
export {
  /** @internal */
  fromPath as __fromPath,
  /** @internal */
  get as __get,
  /** @internal */
  parsePath as __parsePath,
} from './has.js'
