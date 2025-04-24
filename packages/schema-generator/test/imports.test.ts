import * as vi from 'vitest'
import { deduplicateImports, makeImport } from '@traversable/schema-generator'

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/schema-generator❳', () => {
  vi.it('〖️⛳️〗› ❲makeImport❳', () => {
    vi.expect(
      makeImport('@traversable/schema-core', { term: { named: ['t'], namespace: [] }, type: { named: ['Predicate'], namespace: ['T'] } }).join('\n'),
    ).toMatchInlineSnapshot(`
      "import type * as T from '@traversable/schema-core'
      import type { Predicate } from '@traversable/schema-core'
      import { t } from '@traversable/schema-core'"
    `)

    vi.expect(
      makeImport('@traversable/schema-core', { term: { named: ['t', 'getConfig'], namespace: [] }, type: { named: ['Predicate'], namespace: ['T'] } }).join('\n'),
    ).toMatchInlineSnapshot(`
      "import type * as T from '@traversable/schema-core'
      import type { Predicate } from '@traversable/schema-core'
      import { t, getConfig } from '@traversable/schema-core'"
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
          "@traversable/schema-core": {
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
          "@traversable/schema-core": {
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
          "@traversable/schema-core": {
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
})
