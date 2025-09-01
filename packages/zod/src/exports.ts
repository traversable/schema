export { isOptional, isOptionalDeep } from '@traversable/zod-types'

export { RAISE_ISSUE_URL, VERSION, ZOD_CHANGELOG, ZOD_VERSION } from './version.js'
export { check } from './check.js'
export { deepClone } from './deep-clone.js'
export { deepEqual } from './deep-equal.js'
export { deepNonNullable } from './deep-nonnullable.js'
export { deepNullable } from './deep-nullable.js'
export { deepOptional } from './deep-optional.js'
export { deepPartial } from './deep-partial.js'
export { deepReadonly } from './deep-readonly.js'
export { deepRequired } from './deep-required.js'
export { defaultValue } from './default-value.js'
export { fromConstant, fromJson } from './json.js'
export { toPaths } from './to-paths.js'
export { toString } from './to-string.js'
export { toType } from './to-type.js'

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
