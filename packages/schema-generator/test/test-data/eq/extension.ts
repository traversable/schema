import { equals } from './equals.js'
import { toJsonSchema } from './toJsonSchema.js'
import { toString } from './toString.js'
import { validate } from './validate.js'

export interface Types {
  equals: equals<this>
  toJsonSchema: toJsonSchema<this>
  toString: toString<this>
  validate: validate<this>
}

export let Definitions = {}

export let Extensions = {
  toString,
  equals,
  toJsonSchema,
  validate,
}

