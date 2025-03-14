export type * from './satisfies.js'
export type * from './types.js'

export * as fn from './function.js'
export * as symbol from './symbol.js'
export * as Print from './print.js'
export * as URI from './uri.js'
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
