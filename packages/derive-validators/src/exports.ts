export { fromSchema, fromSchemaWithOptions } from './recursive.js'

export { VERSION } from './version.js'

export type {
  ValidationFn,
  Validate,
  Options,
} from './shared.js'
export { hasOptionalSymbol } from './shared.js'

export type {
  ValidationError,
} from './errors.js'

export {
  NULLARY as NullaryErrors,
  UNARY as UnaryErrors,
  ERROR as Errors,
  ErrorType,
  dataPath as dataPathFromSchemaPath,
} from './errors.js'
