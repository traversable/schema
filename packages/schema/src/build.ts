#!/usr/bin/env pnpm dlx tsx
import * as path from 'node:path'
import * as fs from 'node:fs'
import { fn } from '@traversable/registry'

let LIBS = path.join(path.resolve(), 'node_modules', '@traversable')

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

let LIB_BLACKLIST = [
  'registry',
] as const satisfies any[]

let LIB_WHITELIST = [
  'schema-core',
] as const satisfies any[]

let FILE_BLACKLIST = [
  'README.md',
] as const satisfies any[]

let SCHEMAS_DIR

let PATH = {
  sourcesDir: path.join(path.resolve(), 'node_modules', '@traversable'),
  target: path.join(path.resolve(), 'src', 'schemas'),
}

// FROM:
// import type { Guarded, Schema, SchemaLike } from '../namespace.js'

// TO:
// import type { Guarded, Schema, SchemaLike } from '@traversable/schema-core/namespace'

let RelativeImport = {
  from: /(\.\.\/)namespace.js/g,
  to: '@traversable/schema-core/namespace'
}

console.log(`'../namespace.js'`.replace(RelativeImport.from, RelativeImport.to))

function buildSchemas() {
  if (!fs.existsSync(PATH.target)) { fs.mkdirSync(PATH.target) }

  return fs.readdirSync(PATH.sourcesDir, { withFileTypes: true })
    .filter(({ name }) => !LIB_BLACKLIST.includes(name as never) && LIB_WHITELIST.includes(name as never))
    .map(
      ({ name, parentPath }) => fn.pipe(
        path.join(parentPath, name, 'src', 'schemas'),
        (absolutePath) => fs.readdirSync(absolutePath, { withFileTypes: true }),
        (schemaPaths) => schemaPaths.map(({ name, parentPath }) => [
          // name.endsWith('.ts') ? name.slice(0, -'.ts'.length) : name,
          path.join(PATH.target, name),
          fs.readFileSync(path.join(parentPath, name)).toString('utf8')
        ] satisfies [any, any]),
        fn.map(
          fn.flow(
            ([filePath, content]) => [filePath, content.replaceAll(RelativeImport.from, RelativeImport.to)] satisfies [any, any],
            ([filePath, content]) => fs.writeFileSync(filePath, content)),
        )

        // xs => Object.fromEntries(xs),

        // (dirPaths) => dirPaths.filter((dirPath) => dirPath.endsWith('.ts')),
        // (path, { withFileTypes: true }),
        // fn.map(({ name, parentPath, isFile }) => name + parentPath)

      )
    )




}

console.log('OUT', buildSchemas())


/** 
 * ## TODO
 * 
 * - [ ] Pull the .ts files out of `@traversable/schema-core`
 */

export const TEST: 1 = 1
