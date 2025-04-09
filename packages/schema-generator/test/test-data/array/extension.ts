import { toJsonSchema } from './toJsonSchema.js'
import { validate } from './validate.js'
import { toString } from './toString.js'
import { equals } from './equals.js'

export let extension = {
  toString,
  equals,
  toJsonSchema,
  validate,
}

export interface Extension {
  toString(): toString<this>
  equals: equals<this>
  toJsonSchema(): toJsonSchema<this>
  validate: validate<this>
}
