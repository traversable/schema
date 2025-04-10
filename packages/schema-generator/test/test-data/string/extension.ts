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
  toString: toString
  equals: equals
  toJsonSchema: toJsonSchema
  validate: validate
}
