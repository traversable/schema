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
} from '@traversable/schema-generator'
import { fn } from '@traversable/registry'

let DIR_PATH = path.join(path.resolve(), 'packages', 'schema-generator', 'test')
let DATA_PATH = path.join(DIR_PATH, 'test-data')

let PATH = {
  __generated__: path.join(DIR_PATH, '__generated__'),
  sources: {
    array: {
      core: path.join(DATA_PATH, 'array', 'core.ts'),
      extension: path.join(DATA_PATH, 'array', 'extension.ts'),
      equals: path.join(DATA_PATH, 'array', 'equals.ts'),
      toJsonSchema: path.join(DATA_PATH, 'array', 'toJsonSchema.ts'),
      toString: path.join(DATA_PATH, 'array', 'toString.ts'),
      validate: path.join(DATA_PATH, 'array', 'validate.ts'),
    },
    string: {
      core: path.join(DATA_PATH, 'string', 'core.ts'),
      extension: path.join(DATA_PATH, 'string', 'extension.ts'),
      equals: path.join(DATA_PATH, 'string', 'equals.ts'),
      toJsonSchema: path.join(DATA_PATH, 'string', 'toJsonSchema.ts'),
      toString: path.join(DATA_PATH, 'string', 'toString.ts'),
      validate: path.join(DATA_PATH, 'string', 'validate.ts'),
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
    array: path.join(DIR_PATH, '__generated__', 'array.gen.ts'),
    object: path.join(DIR_PATH, '__generated__', 'object.gen.ts'),
    string: path.join(DIR_PATH, '__generated__', 'string.gen.ts'),
  }
}

vi.describe('〖️⛳️〗‹‹‹ ❲make❳', () => {
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

    // makeImports({ string: fn.map(src, (file) => file.imports) })
  })

  // vi.it('〖️⛳️〗› ❲makeImports❳', () => {
  //   vi.expect(makeImports({ equals: true, toJsonSchema: true, toString: true, validate: true }, dependencies)).toMatchInlineSnapshot(`
  //     {
  //       "array": "import type { t, ValidationError, ValidationFn } from '@traversable/derive-validators'
  //     import type * as T from '@traversable/registry'
  //     import {
  //       Array_isArray,
  //       has,
  //       Object_is,
  //       URI
  //     } from '@traversable/registry'
  //     import { t } from '@traversable/schema'
  //     import type { SizeBounds } from '@traversable/schema-to-json-schema'",
  //       "string": "import type * as T from '@traversable/registry'
  //     import type * as U from '@traversable/registry'
  //     import * as V from '@traversable/registry'
  //     import { Object_keys, URL, whose } from '@traversable/registry'
  //     import type { VErr, VFn } from '@traversable/schema'
  //     import { s, stuff } from '@traversable/schema'",
  //     }
  //   `)
  // })
})

vi.describe('〖️⛳️〗‹‹‹ ❲parse❳', () => {
  vi.it('〖️⛳️〗› ❲getFileImports❳', () => {
    if (!fs.existsSync(DIR_PATH)) fs.mkdirSync(DIR_PATH)
    if (!fs.existsSync(DATA_PATH)) fs.mkdirSync(DATA_PATH)
    if (!fs.existsSync(PATH.__generated__)) fs.mkdirSync(PATH.__generated__)

    writeSchemas(
      PATH.sources,
      PATH.targets,
    )
  })
})

