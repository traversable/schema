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
export { Seed } from '@traversable/schema-seed'

export * from './types.js'
export * as Predicate from './predicates.js'
export { get, get$ } from './utils.js'

export { VERSION } from './version.js'
export { t } from './schema.js'
