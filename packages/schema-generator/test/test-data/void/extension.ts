import { toJsonSchema } from './toJsonSchema.js'
import { validate } from './validate.js'
import { toString } from './toString.js'
import { equals } from './equals.js'

export interface Types {
  equals: equals
  toJsonSchema: toJsonSchema
  toString: toString
  validate: validate
}

export let Definitions = {
  equals,
  toJsonSchema,
  toString,
}

export let Extensions = {
  validate,
}
