import * as vi from 'vitest'
import * as path from 'node:path'
import * as fs from 'node:fs'

import { writeSchemas } from '@traversable/schema-generator'

/**
 * ## TODO:
 * - [ ] readonlyArray
 * - [x] null
 * - [x] void
 * - [x] never
 * - [x] unknown
 * - [x] any
 * - [x] undefined
 * - [x] symbol
 * - [x] boolean
 * - [x] optional
 * - [x] bigint
 * - [x] eq
 */
let TODOs = void 0

let DIR_PATH = path.join(path.resolve(), 'packages', 'schema-generator', 'test')
let DATA_PATH = path.join(DIR_PATH, 'test-data')

let PATH = {
  __generated__: path.join(DIR_PATH, '__generated__'),
  sources: {
    never: {
      core: path.join(DATA_PATH, 'never', 'core.ts'),
      extension: path.join(DATA_PATH, 'never', 'extension.ts'),
      equals: path.join(DATA_PATH, 'never', 'equals.ts'),
      toJsonSchema: path.join(DATA_PATH, 'never', 'toJsonSchema.ts'),
      toString: path.join(DATA_PATH, 'never', 'toString.ts'),
      validate: path.join(DATA_PATH, 'never', 'validate.ts'),
    },
    unknown: {
      core: path.join(DATA_PATH, 'unknown', 'core.ts'),
      extension: path.join(DATA_PATH, 'unknown', 'extension.ts'),
      equals: path.join(DATA_PATH, 'unknown', 'equals.ts'),
      toJsonSchema: path.join(DATA_PATH, 'unknown', 'toJsonSchema.ts'),
      toString: path.join(DATA_PATH, 'unknown', 'toString.ts'),
      validate: path.join(DATA_PATH, 'unknown', 'validate.ts'),
    },
    any: {
      core: path.join(DATA_PATH, 'any', 'core.ts'),
      extension: path.join(DATA_PATH, 'any', 'extension.ts'),
      equals: path.join(DATA_PATH, 'any', 'equals.ts'),
      toJsonSchema: path.join(DATA_PATH, 'any', 'toJsonSchema.ts'),
      toString: path.join(DATA_PATH, 'any', 'toString.ts'),
      validate: path.join(DATA_PATH, 'any', 'validate.ts'),
    },
    void: {
      core: path.join(DATA_PATH, 'void', 'core.ts'),
      extension: path.join(DATA_PATH, 'void', 'extension.ts'),
      equals: path.join(DATA_PATH, 'void', 'equals.ts'),
      toJsonSchema: path.join(DATA_PATH, 'void', 'toJsonSchema.ts'),
      toString: path.join(DATA_PATH, 'void', 'toString.ts'),
      validate: path.join(DATA_PATH, 'void', 'validate.ts'),
    },
    null: {
      core: path.join(DATA_PATH, 'null', 'core.ts'),
      extension: path.join(DATA_PATH, 'null', 'extension.ts'),
      equals: path.join(DATA_PATH, 'null', 'equals.ts'),
      toJsonSchema: path.join(DATA_PATH, 'null', 'toJsonSchema.ts'),
      toString: path.join(DATA_PATH, 'null', 'toString.ts'),
      validate: path.join(DATA_PATH, 'null', 'validate.ts'),
    },
    undefined: {
      core: path.join(DATA_PATH, 'undefined', 'core.ts'),
      extension: path.join(DATA_PATH, 'undefined', 'extension.ts'),
      equals: path.join(DATA_PATH, 'undefined', 'equals.ts'),
      toJsonSchema: path.join(DATA_PATH, 'undefined', 'toJsonSchema.ts'),
      toString: path.join(DATA_PATH, 'undefined', 'toString.ts'),
      validate: path.join(DATA_PATH, 'undefined', 'validate.ts'),
    },
    boolean: {
      core: path.join(DATA_PATH, 'boolean', 'core.ts'),
      extension: path.join(DATA_PATH, 'boolean', 'extension.ts'),
      equals: path.join(DATA_PATH, 'boolean', 'equals.ts'),
      toJsonSchema: path.join(DATA_PATH, 'boolean', 'toJsonSchema.ts'),
      toString: path.join(DATA_PATH, 'boolean', 'toString.ts'),
      validate: path.join(DATA_PATH, 'boolean', 'validate.ts'),
    },
    symbol: {
      core: path.join(DATA_PATH, 'symbol', 'core.ts'),
      extension: path.join(DATA_PATH, 'symbol', 'extension.ts'),
      equals: path.join(DATA_PATH, 'symbol', 'equals.ts'),
      toJsonSchema: path.join(DATA_PATH, 'symbol', 'toJsonSchema.ts'),
      toString: path.join(DATA_PATH, 'symbol', 'toString.ts'),
      validate: path.join(DATA_PATH, 'symbol', 'validate.ts'),
    },
    integer: {
      core: path.join(DATA_PATH, 'integer', 'core.ts'),
      extension: path.join(DATA_PATH, 'integer', 'extension.ts'),
      equals: path.join(DATA_PATH, 'integer', 'equals.ts'),
      toJsonSchema: path.join(DATA_PATH, 'integer', 'toJsonSchema.ts'),
      toString: path.join(DATA_PATH, 'integer', 'toString.ts'),
      validate: path.join(DATA_PATH, 'integer', 'validate.ts'),
    },
    bigint: {
      core: path.join(DATA_PATH, 'bigint', 'core.ts'),
      extension: path.join(DATA_PATH, 'bigint', 'extension.ts'),
      equals: path.join(DATA_PATH, 'bigint', 'equals.ts'),
      toJsonSchema: path.join(DATA_PATH, 'bigint', 'toJsonSchema.ts'),
      toString: path.join(DATA_PATH, 'bigint', 'toString.ts'),
      validate: path.join(DATA_PATH, 'bigint', 'validate.ts'),
    },
    number: {
      core: path.join(DATA_PATH, 'number', 'core.ts'),
      extension: path.join(DATA_PATH, 'number', 'extension.ts'),
      equals: path.join(DATA_PATH, 'number', 'equals.ts'),
      toJsonSchema: path.join(DATA_PATH, 'number', 'toJsonSchema.ts'),
      toString: path.join(DATA_PATH, 'number', 'toString.ts'),
      validate: path.join(DATA_PATH, 'number', 'validate.ts'),
    },
    string: {
      core: path.join(DATA_PATH, 'string', 'core.ts'),
      extension: path.join(DATA_PATH, 'string', 'extension.ts'),
      equals: path.join(DATA_PATH, 'string', 'equals.ts'),
      toJsonSchema: path.join(DATA_PATH, 'string', 'toJsonSchema.ts'),
      toString: path.join(DATA_PATH, 'string', 'toString.ts'),
      validate: path.join(DATA_PATH, 'string', 'validate.ts'),
    },
    eq: {
      core: path.join(DATA_PATH, 'eq', 'core.ts'),
      extension: path.join(DATA_PATH, 'eq', 'extension.ts'),
      equals: path.join(DATA_PATH, 'eq', 'equals.ts'),
      toJsonSchema: path.join(DATA_PATH, 'eq', 'toJsonSchema.ts'),
      toString: path.join(DATA_PATH, 'eq', 'toString.ts'),
      validate: path.join(DATA_PATH, 'eq', 'validate.ts'),
    },
    optional: {
      core: path.join(DATA_PATH, 'optional', 'core.ts'),
      extension: path.join(DATA_PATH, 'optional', 'extension.ts'),
      equals: path.join(DATA_PATH, 'optional', 'equals.ts'),
      toJsonSchema: path.join(DATA_PATH, 'optional', 'toJsonSchema.ts'),
      toString: path.join(DATA_PATH, 'optional', 'toString.ts'),
      validate: path.join(DATA_PATH, 'optional', 'validate.ts'),
    },
    array: {
      core: path.join(DATA_PATH, 'array', 'core.ts'),
      extension: path.join(DATA_PATH, 'array', 'extension.ts'),
      equals: path.join(DATA_PATH, 'array', 'equals.ts'),
      toJsonSchema: path.join(DATA_PATH, 'array', 'toJsonSchema.ts'),
      toString: path.join(DATA_PATH, 'array', 'toString.ts'),
      validate: path.join(DATA_PATH, 'array', 'validate.ts'),
    },
    record: {
      core: path.join(DATA_PATH, 'record', 'core.ts'),
      extension: path.join(DATA_PATH, 'record', 'extension.ts'),
      equals: path.join(DATA_PATH, 'record', 'equals.ts'),
      toJsonSchema: path.join(DATA_PATH, 'record', 'toJsonSchema.ts'),
      toString: path.join(DATA_PATH, 'record', 'toString.ts'),
      validate: path.join(DATA_PATH, 'record', 'validate.ts'),
    },
    union: {
      core: path.join(DATA_PATH, 'union', 'core.ts'),
      extension: path.join(DATA_PATH, 'union', 'extension.ts'),
      equals: path.join(DATA_PATH, 'union', 'equals.ts'),
      toJsonSchema: path.join(DATA_PATH, 'union', 'toJsonSchema.ts'),
      toString: path.join(DATA_PATH, 'union', 'toString.ts'),
      validate: path.join(DATA_PATH, 'union', 'validate.ts'),
    },
    intersect: {
      core: path.join(DATA_PATH, 'intersect', 'core.ts'),
      extension: path.join(DATA_PATH, 'intersect', 'extension.ts'),
      equals: path.join(DATA_PATH, 'intersect', 'equals.ts'),
      toJsonSchema: path.join(DATA_PATH, 'intersect', 'toJsonSchema.ts'),
      toString: path.join(DATA_PATH, 'intersect', 'toString.ts'),
      validate: path.join(DATA_PATH, 'intersect', 'validate.ts'),
    },
    tuple: {
      core: path.join(DATA_PATH, 'tuple', 'core.ts'),
      extension: path.join(DATA_PATH, 'tuple', 'extension.ts'),
      equals: path.join(DATA_PATH, 'tuple', 'equals.ts'),
      toJsonSchema: path.join(DATA_PATH, 'tuple', 'toJsonSchema.ts'),
      toString: path.join(DATA_PATH, 'tuple', 'toString.ts'),
      validate: path.join(DATA_PATH, 'tuple', 'validate.ts'),
    },
    object: {
      core: path.join(DATA_PATH, 'object', 'core.ts'),
      extension: path.join(DATA_PATH, 'object', 'extension.ts'),
      equals: path.join(DATA_PATH, 'object', 'equals.ts'),
      toJsonSchema: path.join(DATA_PATH, 'object', 'toJsonSchema.ts'),
      toString: path.join(DATA_PATH, 'object', 'toString.ts'),
      validate: path.join(DATA_PATH, 'object', 'validate.ts'),
    },
  },
  targets: {
    never: path.join(DIR_PATH, '__generated__', 'never.gen.ts'),
    unknown: path.join(DIR_PATH, '__generated__', 'unknown.gen.ts'),
    any: path.join(DIR_PATH, '__generated__', 'any.gen.ts'),
    void: path.join(DIR_PATH, '__generated__', 'void.gen.ts'),
    null: path.join(DIR_PATH, '__generated__', 'null.gen.ts'),
    undefined: path.join(DIR_PATH, '__generated__', 'undefined.gen.ts'),
    boolean: path.join(DIR_PATH, '__generated__', 'boolean.gen.ts'),
    symbol: path.join(DIR_PATH, '__generated__', 'symbol.gen.ts'),
    integer: path.join(DIR_PATH, '__generated__', 'integer.gen.ts'),
    bigint: path.join(DIR_PATH, '__generated__', 'bigint.gen.ts'),
    number: path.join(DIR_PATH, '__generated__', 'number.gen.ts'),
    string: path.join(DIR_PATH, '__generated__', 'string.gen.ts'),
    eq: path.join(DIR_PATH, '__generated__', 'eq.gen.ts'),
    optional: path.join(DIR_PATH, '__generated__', 'optional.gen.ts'),
    array: path.join(DIR_PATH, '__generated__', 'array.gen.ts'),
    record: path.join(DIR_PATH, '__generated__', 'record.gen.ts'),
    union: path.join(DIR_PATH, '__generated__', 'union.gen.ts'),
    intersect: path.join(DIR_PATH, '__generated__', 'intersect.gen.ts'),
    tuple: path.join(DIR_PATH, '__generated__', 'tuple.gen.ts'),
    object: path.join(DIR_PATH, '__generated__', 'object.gen.ts'),
  }
}

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/schema-generator❳', () => {
  vi.it('〖️⛳️〗› ❲writeSchemas❳', () => {
    if (!fs.existsSync(DIR_PATH)) fs.mkdirSync(DIR_PATH)
    if (!fs.existsSync(DATA_PATH)) fs.mkdirSync(DATA_PATH)
    if (!fs.existsSync(PATH.__generated__)) fs.mkdirSync(PATH.__generated__)

    writeSchemas(
      PATH.sources,
      PATH.targets,
    )
  })
})
