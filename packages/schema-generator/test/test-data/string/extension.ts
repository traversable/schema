import { toJsonSchema } from './toJsonSchema.js'
import { validate } from './validate.js'
import { toString } from './toString.js'
import { equals } from './equals.js'

export interface Types {
  equals: equals
  toJsonSchema: toJsonSchema<this>
  toString: toString
  validate: validate
}

export let Definitions = {
  toString,
  equals,
}

export let Extensions = {
  toJsonSchema,
  validate,
}
