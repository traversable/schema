import { equals } from './equals.js'
import { toJsonSchema } from './toJsonSchema.js'
import { toString } from './toString.js'
import { validate } from './validate.js'

export interface Extension {
  equals: equals<this>
  toJsonSchema: toJsonSchema<this>
  toString: toString<this>
  validate: validate<this>
}

export let extension = {
  equals,
  toJsonSchema,
  toString,
  validate,
}

declare const xs: Extension
