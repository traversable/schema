export { VERSION } from './version.js'

export type {
  ValidationFn,
} from './validators.js'

export {
  fromSchema,
} from './validators.js'

export type {
  ValidationError,
} from './errors.js'

export * as v from './validators.js'

export {
  ERROR as Errors,
  ErrorType,
  dataPath as dataPathFromSchemaPath,
} from './errors.js'
