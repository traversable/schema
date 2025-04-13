#!/usr/bin/env pnpm dlx tsx
import * as path from 'node:path'
import * as fs from 'node:fs'
import { fn } from '@traversable/registry'

let SCHEMA_WHITELIST = [
  'of',
  'eq',
  //
  'never',
  'any',
  'unknown',
  'void',
  'null',
  'undefined',
  'symbol',
  'boolean',
  'integer',
  'bigint',
  'number',
  'string',
  //
  'optional',
  'array',
  'record',
  'union',
  'intersect',
  'tuple',
  'object',
]

let FILE_BLACKLIST = [
  'README.md',
] as const satisfies any[]

let LIB_BLACKLIST = [
  'registry',
] satisfies any[]

let LIB_WHITELIST = [
  'derive-equals',
  // 'schema-to-json-schema',
] satisfies any[]

let LIB_NAME_TO_FILENAME = {
  'derive-equals': 'equals.ts',
  'schema-to-json-schema': 'toJsonSchema.ts',
}

let PATH = {
  sourcesDir: path.join(path.resolve(), 'node_modules', '@traversable'),
  target: path.join(path.resolve(), 'src', 'schemas'),
}

let RelativeImport = {
  namespace: {
    /** 
     * @example
     * import { stuff } from '../namespace.js'
     */
    from: /(\.\.\/)namespace.js/g,
    to: '@traversable/schema-core/namespace'
  },
  local: {
    /** 
     * @example
     * import type { of } from './of.js'
     */
    from: /\.\/([^]*?)\.js/g,
    /** 
     * @example
     * import type { of } from '../of/core.js'
     */
    to: (mod: string) => `.${mod.slice(0, -'.js'.length)}/core.js`,
  },
}

let isKeyOf = <T>(k: keyof any, t: T): k is keyof T =>
  !!t && (typeof t === 'object' || typeof t === 'function') && k in t

function buildCoreSchemas() {
  if (!fs.existsSync(PATH.target)) {
    fs.mkdirSync(PATH.target)
  }
  return fs.readdirSync(PATH.sourcesDir, { withFileTypes: true })
    .filter(({ name }) => name === 'schema-core')
    .map(
      ({ name, parentPath }) => fn.pipe(
        path.join(
          parentPath,
          name,
          'src',
          'schemas'
        ),
        (absolutePath) => fs.readdirSync(absolutePath, { withFileTypes: true }),
        (schemaPaths) => {
          schemaPaths.forEach((schemaPath) => {
            let dirName = schemaPath.name.endsWith('.ts')
              ? schemaPath.name.slice(0, -'.ts'.length)
              : schemaPath.name
            let targetDirPath = path.join(
              PATH.target,
              dirName,
            )
            if (!fs.existsSync(targetDirPath)) {
              fs.mkdirSync(targetDirPath)
            }
          })
          return schemaPaths
        },
        (schemaPaths) => schemaPaths.map(({ name, parentPath }) => [
          path.join(
            PATH.target,
            name.slice(0, -'.ts'.length),
            'core.ts',
          ),
          fs.readFileSync(
            path.join(
              parentPath,
              name,
            )
          ).toString('utf8')
        ] satisfies [any, any]),
        fn.map(
          fn.flow(
            ([filePath, content]) => [filePath, content.replaceAll(RelativeImport.namespace.from, RelativeImport.namespace.to)] satisfies [any, any],
            ([filePath, content]) => [filePath, content.replaceAll(RelativeImport.local.from, RelativeImport.local.to)] satisfies [any, any],
            ([filePath, content]) => fs.writeFileSync(filePath, content)
          )
        )
      )
    )
}

function buildSchemaExtensions() {
  return fs.readdirSync(PATH.sourcesDir, { withFileTypes: true })
    .filter(({ name }) => !LIB_BLACKLIST.includes(name) && LIB_WHITELIST.includes(name))
    .map(
      ({ name, parentPath }) => fn.pipe(
        path.join(
          parentPath,
          name,
          'src',
          'schemas',
        ),
        (absolutePath) => fs.readdirSync(absolutePath, { withFileTypes: true }),
        (schemaPaths) => schemaPaths.map(
          ({ name: schemaName, parentPath }) => [
            path.join(
              PATH.target,
              schemaName.slice(0, -'.ts'.length),
              isKeyOf(name, LIB_NAME_TO_FILENAME) ? LIB_NAME_TO_FILENAME[name] : 'BORKED',
            ),
            fs.readFileSync(
              path.join(
                parentPath,
                schemaName,
              )
            ).toString('utf8')
          ] satisfies [any, any]
        ),
        fn.map(
          fn.flow(
            ([filePath, content]) => [filePath, content.replaceAll(RelativeImport.namespace.from, RelativeImport.namespace.to)] satisfies [any, any],
            ([filePath, content]) => [filePath, content.replaceAll(RelativeImport.local.from, RelativeImport.local.to)] satisfies [any, any],
            ([filePath, content]) => fs.writeFileSync(filePath, content)),
        ),
      )
    )
}

function buildSchemas() {
  buildCoreSchemas()
  buildSchemaExtensions()
}

buildSchemas()

/** 
 * ## TODO
 * 
 * - [x] Pull the .ts files out of `@traversable/schema-core`
 * - [x] Pull the .ts files out of `@traversable/derive-equals`
 * - [ ] Pull the .ts files out of `@traversable/schema-to-json-schema`
 */
