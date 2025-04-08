import * as vi from 'vitest'
import * as path from 'node:path'
import * as fs from 'node:fs'

import { fn } from '@traversable/registry'
import { t } from '@traversable/schema'

import { fc, test } from './fast-check.js'
import { default as dependencies } from './test-data/dependencies.json' with { type: 'json' }

import {
  makeImport,
  makeImports,
  makeArraySchema,
  AliasedImport as AliasedImportType,
  DependenciesBySchema as DependenciesBySchemaType,
  NamedImport as NamedImportType,
  Config as ConfigType,
  Import as ImportType,
  Imports as ImportsType,
  SchemaDependencies as SchemaDependenciesType,
  PackageImports as PackageImportsType,
  PackageName as PackageNameEnum,
  MethodName as MethodNameEnum,
  parseFile,
  replaceExtensions,
} from '@traversable/schema-zod-adapter'

let DIR_PATH = path.join(path.resolve(), 'packages', 'schema-zod-adapter', 'test')

let PATH = {
  __generated__: path.join(DIR_PATH, '__generated__'),
  source: {
    core: path.join(DIR_PATH, 'test-data', 'array.core.ts'),
    equals: path.join(DIR_PATH, 'test-data', 'array.equals.ts'),
    toJsonSchema: path.join(DIR_PATH, 'test-data', 'array.toJsonSchema.ts'),
    toString: path.join(DIR_PATH, 'test-data', 'array.toString.ts'),
    validate: path.join(DIR_PATH, 'test-data', 'array.validate.ts'),
  },
  target: {
    array: path.join(DIR_PATH, '__generated__', 'array.gen.ts'),
    string: path.join(DIR_PATH, '__generated__', 'string.gen.ts'),
  }
}

let Config = fc.record({
  toString: fc.optional(fc.true),
  equals: fc.optional(fc.true),
  toJsonSchema: fc.optional(fc.true),
  validate: fc.optional(fc.true),
}, { requiredKeys: [] }) satisfies fc.Arbitrary<ConfigType>

let AliasedImport = fc.tuple(fc.identifier, fc.identifier) satisfies fc.Arbitrary<AliasedImportType>
let NamedImport = fc.oneof(fc.identifier, AliasedImport) satisfies fc.Arbitrary<NamedImportType>

let Import = fc.record({
  named: fc.array(NamedImport),
  namespace: fc.optional(fc.identifier),
}, { requiredKeys: ['named'] }) satisfies fc.Arbitrary<ImportType>

let Imports = fc.record({ type: Import, term: Import }) satisfies fc.Arbitrary<ImportsType>

let PackageImports = fc.record(
  fn.map(PackageNameEnum, () => Imports),
  { requiredKeys: [] }
) satisfies fc.Arbitrary<PackageImportsType>

let SchemaDependencies = fc.record(
  fn.map(MethodNameEnum, () => PackageImports)
) satisfies fc.Arbitrary<SchemaDependenciesType>

let Dependencies = fc.dictionary(fc.identifier, SchemaDependencies)

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
    let deps = {
      array: {
        core: parseFile(PATH.source.core),
        equals: parseFile(PATH.source.equals),
        toJsonSchema: parseFile(PATH.source.toJsonSchema),
        toString: parseFile(PATH.source.toString),
        validate: parseFile(PATH.source.validate),
      }
    }

    let importsRecord = {
      array: {
        core: deps.array.core.imports,
        equals: deps.array.equals.imports,
        toJsonSchema: deps.array.toJsonSchema.imports,
        toString: deps.array.toString.imports,
        validate: deps.array.validate.imports,
      },
    }

    let imports = makeImports(
      fn.map(importsRecord.array, () => true as const),
      importsRecord
    )

    let bodies = {
      array: {
        equals: deps.array.equals.body,
        toJsonSchema: deps.array.toJsonSchema.body,
        toString: deps.array.toString.body,
        validate: deps.array.validate.body,
      }
    }

    let extensions = {
      array: {
        equals: deps.array.equals.extension,
        toJsonSchema: deps.array.toJsonSchema.extension,
        toString: deps.array.toString.extension,
        validate: deps.array.validate.extension,
      }
    }

    console.log('extensions', extensions)

    let makeOpenSeparator = (text: string) => [
      `///////` + '/'.repeat(text.length) + `///////`,
      `///    ` + text + `    ///`,
    ].join('\n')

    let makeCloseSeparator = (text: string) => [
      `///    ` + text + `    ///`,
      `///////` + '/'.repeat(text.length) + `///////`,
    ].join('\n')

    let schemas = {
      array: [
        imports.array,
        '\n',
        ...Object.keys(bodies.array).map((k) => [
          '\r',
          makeOpenSeparator(k),
          bodies.array[k as keyof typeof bodies.array].trim(),
          makeCloseSeparator(k)
        ].join('\n'),
        ),
        replaceExtensions(
          deps.array.core.body, [
            extensions.array.equals,
            extensions.array.toJsonSchema,
            extensions.array.toString,
            extensions.array.validate,
          ].filter((_) => _ !== undefined)
        ),
      ]
    }

    let isKeyOf = <T>(k: keyof any, t: T): k is keyof T => !!t && typeof t === 'object' && k in t

    for (let schemaType in schemas) {
      if (!isKeyOf(schemaType, schemas)) throw Error('Illegal state')
      if (!isKeyOf(schemaType, PATH.target)) throw Error('could not find schema type "' + schemaType + '" in PATH.target')
      else {
        fs.writeFileSync(PATH.target[schemaType], schemas[schemaType].join('\n'))
      }
    }

  })
})
