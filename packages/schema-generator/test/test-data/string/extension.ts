import type { t } from '@traversable/schema'
import type { Equal, Unknown } from '@traversable/registry'
import type { ValidationError } from '@traversable/derive-validators'

import { toJsonSchema } from './toJsonSchema.js'
import { validate } from './validate.js'

export let extension = {
  toString(): 'string' { return 'string' },
  equals(left: string, right: string): boolean { return left === right },
  toJsonSchema<S extends t.string>(this: S): toJsonSchema<S> { return toJsonSchema(this) },
  validate,
}

export interface Extension {
  toString(): 'string'
  equals: Equal<string>
  toJsonSchema(): toJsonSchema<this>
  validate(u: string | Unknown): true | ValidationError[]
}
