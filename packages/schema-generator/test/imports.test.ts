import * as vi from 'vitest'
import { deduplicateImports, makeImport } from '@traversable/schema-generator'

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
})
