import * as vi from 'vitest'
import * as path from 'node:path'
import * as fs from 'node:fs'

import {
  deduplicateImports,
  makeImport,
  makeImports,
  parseFile,
  replaceExtensions,
  writeSchemas,
  parseSourceFile,
} from '@traversable/schema-generator'
import { fn } from '@traversable/registry'

let DIR_PATH = path.join(path.resolve(), 'packages', 'schema-generator', 'test')
let DATA_PATH = path.join(DIR_PATH, 'test-data')

/**
 * ## TODO:
 * - [ ] null
 * - [ ] void
 * - [ ] never
 * - [ ] unknown
 * - [ ] any
 * - [ ] undefined
 * - [ ] symbol
 * - [ ] boolean
 * - [ ] readonlyArray
 * - [x] optional
 * - [x] bigint
 * - [x] eq
 */
let TODOs = void 0

let PATH = {
  __generated__: path.join(DIR_PATH, '__generated__'),
  sources: {
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
  vi.it('〖️⛳️〗› ❲makeImport❳', () => {
    vi.expect(
      makeImport('@traversable/schema', { term: { named: ['t'], namespace: [] }, type: { named: ['Predicate'], namespace: ['T'] } }).join('\n'),
    ).toMatchInlineSnapshot(`
      "import type * as T from '@traversable/schema'
      import type { Predicate } from '@traversable/schema'
      import { t } from '@traversable/schema'"
    `)

    vi.expect(
      makeImport('@traversable/schema', { term: { named: ['t', 'getConfig'], namespace: [] }, type: { named: ['Predicate'], namespace: ['T'] } }).join('\n'),
    ).toMatchInlineSnapshot(`
      "import type * as T from '@traversable/schema'
      import type { Predicate } from '@traversable/schema'
      import { t, getConfig } from '@traversable/schema'"
    `)
  })

  vi.it('〖️⛳️〗› ❲deduplicateImports❳', () => {
    vi.expect(deduplicateImports({
      array: {
        core: {
          "@traversable/registry": {
            type: {
              named: ['PickIfDefined as Pick'],
              namespace: 'T'
            },
            term: {
              named: ['pick']
            }
          },
          "@traversable/schema": {
            type: {
              named: ['t', 'TypeGuard as Guard', 'Bounds'],
            },
            term: {
              named: [],
            },
          }
        },
        toString: {
          "@traversable/registry": {
            type: {
              named: ['Record', 'PickIfDefined'],
            },
            term: {
              named: ['omit'],
              namespace: 'T',
            }
          },
          "@traversable/schema": {
            type: {
              named: [],
            },
            term: {
              named: ['t']
            }
          }
        }
      },
      string: {
        core: {
          "@traversable/registry": {
            type: {
              named: ['PickIfDefined as Pick'],
              namespace: 'T'
            },
            term: {
              named: ['pick']
            }
          },
        },
        equals: {},
        toJsonSchema: {
          '@traversable/schema-to-json-schema': {
            type: {
              named: [],
              namespace: 'JsonSchema',
            },
            term: {
              named: ['stringToJsonSchema']
            }
          }
        }
      }
    })).toMatchInlineSnapshot(`
      {
        "array": {
          "@traversable/registry": {
            "term": {
              "named": Set {
                "pick",
                "omit",
              },
              "namespace": Set {
                "T",
              },
            },
            "type": {
              "named": Set {
                "PickIfDefined as Pick",
                "Record",
                "PickIfDefined",
              },
              "namespace": Set {},
            },
          },
          "@traversable/schema": {
            "term": {
              "named": Set {
                "t",
              },
              "namespace": Set {},
            },
            "type": {
              "named": Set {
                "TypeGuard as Guard",
                "Bounds",
              },
              "namespace": Set {},
            },
          },
        },
        "string": {
          "@traversable/registry": {
            "term": {
              "named": Set {
                "pick",
              },
              "namespace": Set {},
            },
            "type": {
              "named": Set {
                "PickIfDefined as Pick",
              },
              "namespace": Set {
                "T",
              },
            },
          },
          "@traversable/schema-to-json-schema": {
            "term": {
              "named": Set {
                "stringToJsonSchema",
              },
              "namespace": Set {},
            },
            "type": {
              "named": Set {},
              "namespace": Set {
                "JsonSchema",
              },
            },
          },
        },
      }
    `)
  })


  vi.it('〖️⛳️〗› ❲makeImports❳', () => {
    // let src = {
    //   core: parseFile(PATH.sources.string.core),
    //   extension: parseFile(PATH.sources.string.extension),
    //   equals: parseFile(PATH.sources.string.equals),
    //   toJsonSchema: parseFile(PATH.sources.string.toJsonSchema),
    //   toString: parseFile(PATH.sources.string.toString),
    //   validate: parseFile(PATH.sources.string.validate),
    // }

    // vi.expect(makeImports({ string: fn.map(src, (file) => file.imports) })).toMatchInlineSnapshot(`
    //   {
    //     "string": "import type {
    //     Equal,
    //     Force,
    //     Integer,
    //     PickIfDefined,
    //     Unknown
    //   } from '@traversable/registry'
    //   import {
    //     has,
    //     Math_max,
    //     Math_min,
    //     Object_assign,
    //     URI
    //   } from '@traversable/registry'
    //   import type { Bounds, t } from '@traversable/schema'
    //   import { __carryover as carryover, __within as within } from '@traversable/schema'
    //   import type { SizeBounds } from '@traversable/schema-to-json-schema'
    //   import type { ValidationError, ValidationFn } from '@traversable/derive-validators'
    //   import { NullaryErrors } from '@traversable/derive-validators'",
    //   }
    // `)
  })
})

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

