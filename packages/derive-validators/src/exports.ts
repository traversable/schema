export { fromSchema, fromSchemaWithOptions } from './recursive.js'

export { VERSION } from './version.js'

export type {
  ValidationFn,
  Validate,
  Options,
} from './shared.js'
export { isOptional } from './shared.js'

export type {
  ValidationError,
} from './errors.js'

export {
  ERROR as Errors,
  NULLARY as NullaryErrors,
  ErrorType,
  dataPath as dataPathFromSchemaPath,
} from './errors.js'
