import * as vi from 'vitest'
import * as path from 'node:path'
import * as fs from 'node:fs'

import type {
  ParsedSourceFile,
} from '@traversable/schema-zod-adapter'

import {
  makeImport,
  makeImports,
  makeArraySchema,
  parseFile,
  replaceExtensions,
  writeSchemas,
} from '@traversable/schema-zod-adapter'

let DIR_PATH = path.join(path.resolve(), 'packages', 'schema-zod-adapter', 'test')

let PATH = {
  __generated__: path.join(DIR_PATH, '__generated__'),
  sources: {
    array: {
      core: path.join(DIR_PATH, 'test-data', 'array.core.ts'),
      equals: path.join(DIR_PATH, 'test-data', 'array.equals.ts'),
      toJsonSchema: path.join(DIR_PATH, 'test-data', 'array.toJsonSchema.ts'),
      toString: path.join(DIR_PATH, 'test-data', 'array.toString.ts'),
      validate: path.join(DIR_PATH, 'test-data', 'array.validate.ts'),
    },
  },
  targets: {
    array: path.join(DIR_PATH, '__generated__', 'array.gen.ts'),
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

  vi.it('〖️⛳️〗› ❲makeArraySchema❳', () => {
    if (!fs.existsSync(PATH.__generated__)) fs.mkdirSync(PATH.__generated__)
    let out = makeArraySchema({ equals: true, toJsonSchema: true, toString: true, validate: true })
    vi.assert.isUndefined(out)
  })
})

vi.describe('〖️⛳️〗‹‹‹ ❲parse❳', () => {
  vi.it('〖️⛳️〗› ❲getFileImports❳', () => {
    writeSchemas({ equals: true, toJsonSchema: true, toString: true, validate: true }, PATH.sources, PATH.targets)
  })
})
