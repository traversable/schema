export * from './version.js'

export { check } from './check.js'
export { clone } from './clone.js'
export { deepNonNullable } from './deep-nonnullable.js'
export { deepNullable } from './deep-nullable.js'
export { deepOptional } from './deep-optional.js'
export { deepPartial } from './deep-partial.js'
export { deepReadonly } from './deep-readonly.js'
export { deepRequired } from './deep-required.js'
export { defaultValue } from './default-value.js'
export { equals } from './equals.js'
export { fold, IndexedFunctor as Functor } from './functor.js'
export { fromConstant } from './json.js'
export { toPaths } from './to-paths.js'
export { toString } from './to-string.js'
export { toType } from './to-type.js'
export { tagged, typeof } from './typename.js'
export { isOptional, isOptionalDeep } from './utils.js'

export {
  /** @experimental */
  makeLens,
  /** @internal */
  getFallback,
  /** @internal */
  getSubSchema,
  /** @internal */
  parsePath,
} from './lens.js'
