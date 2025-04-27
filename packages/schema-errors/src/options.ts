import type { GlobalConfig } from '@traversable/schema'
import { defaults as schemaDefaults } from '@traversable/schema'
import type { Errors } from './errors.js'
import { defaults as errorsDefaults } from './errors.js'

export type Options = GlobalConfig & {
  errors?: Partial<Errors>
  failFast?: boolean
}

export const defaults = {
  ...schemaDefaults,
  errors: errorsDefaults,
  failFast: false,
} satisfies Required<Options>
