import { toJsonSchema } from './toJsonSchema.js'
import { validate } from './validate.js'
import { toString } from './toString.js'
import { equals } from './equals.js'

export interface Types {
  toString: toString<this>
  equals: equals<this>
  toJsonSchema: toJsonSchema<this>
  validate: validate<this>
}

export let Definitions = {}

export let Extensions = {
  toJsonSchema,
  validate,
  toString,
  equals,
}
