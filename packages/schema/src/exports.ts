export type {
  OptionalTreatment,
  SchemaOptions,
  GlobalConfig,
  SchemaConfig,
} from '@traversable/schema-core'
export {
  AST,
  defaults,
  getConfig,
  configure,
} from '@traversable/schema-core'

export * as Seed from './seed.js'
export type Seed<T = never> = [T] extends [never]
  ? import('./seed.js').Fixpoint
  : import('./seed.js').Seed<T>

export * from './types.js'
export * as Predicate from './predicates.js'
export { get, get$ } from './utils.js'

export { VERSION } from './version.js'
export { t } from './namespace.js'
