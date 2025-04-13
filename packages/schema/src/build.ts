#!/usr/bin/env pnpm dlx tsx
import * as path from 'node:path'
import * as fs from 'node:fs'
import type { pick, omit, Returns, IfReturns } from '@traversable/registry'
import { fn } from '@traversable/registry'
import { t } from '@traversable/schema-core'

let PATH = {
  sourcesDir: path.join(path.resolve(), 'node_modules', '@traversable'),
  target: path.join(path.resolve(), 'src', 'schemas'),
}

type Library = typeof Library[keyof typeof Library]
let Library = {
  Core: 'schema-core',
  Equals: 'derive-equals',
  ToJsonSchema: 'schema-to-json-schema',
  ToString: 'schema-to-string',
  Validators: 'derive-validators',
} as const

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
] satisfies any[]

let LIB_NAME_TO_TARGET_FILENAME = {
  [Library.Core]: 'core',
  [Library.Equals]: 'equals',
  [Library.ToJsonSchema]: 'toJsonSchema',
  [Library.Validators]: 'validate',
  [Library.ToString]: 'toString',
} as const satisfies Record<Library, string>

let RelativeImport = {
  namespace: {
    /**
     * @example
     * // from:
     * import type { Guarded, Schema, SchemaLike } from '../../_namespace.js'
     * // to:
     * import type { Guarded, Schema, SchemaLike } from '../namespace.js'
     */
    from: /'(\.\.\/)namespace.js'/g,
    to: '\'../../_namespace.js\'',
  },
  local: (libShortName: string) => ({

    from: /'\.\/(.+).js'/g,
    to: (_: string, p1: string, p2: string) => `'../${p1}/${libShortName}'`,

  }),
  parent: {
    from: /'@traversable\/schema-core'/g,
    to: '\'../../_exports.js\'',
  },
}

let isKeyOf = <T>(k: keyof any, t: T): k is keyof T =>
  !!t && (typeof t === 'object' || typeof t === 'function') && k in t


type GetTargetFileName = (libName: string, schemaName: string) => `${string}.ts`
type PostProcessor = (sourceFileContent: string, libConfig: LibOptions & { targetFileName: string }) => string

type LibOptions = t.typeof<typeof LibOptions>
let LibOptions = t.object({
  relativePath: t.string,
  getTargetFileName: (x): x is GetTargetFileName => typeof x === 'function',
  postprocessor: (x): x is PostProcessor => typeof x === 'function',
  // TODO: actually exclude files
  excludeFiles: t.array(t.string),
  includeFiles: t.optional(t.array(t.string)),
})

type BuildOptions = t.typeof<typeof BuildOptions>
let BuildOptions = t.object({
  dryRun: t.optional(t.boolean),
  getSourceDir: t.optional((x): x is (() => string) => typeof x === 'function'),
  getTargetDir: t.optional((x): x is (() => string) => typeof x === 'function'),
})

type LibsOptions<K extends string> = never | { libs: Record<K, Partial<LibOptions>> }
type LibsConfig<K extends string> = never | { libs: Record<K, LibOptions> }
type ParseOptions<T> = never | { [K in keyof T as K extends `get${infer P}` ? Uncapitalize<P> : K]-?: IfReturns<T[K]> }
type BuildConfig = ParseOptions<BuildOptions>

type Options<K extends string = string> =
  & BuildOptions
  & LibsOptions<K>

type Config<K extends string = string> =
  & BuildConfig
  & LibsConfig<K>

let defaultGetTargetFileName = (
  (libName, _schemaName) => isKeyOf(libName, LIB_NAME_TO_TARGET_FILENAME)
    ? `${LIB_NAME_TO_TARGET_FILENAME[libName]}.ts` as const
    : `${libName}.ts`
) satisfies LibOptions['getTargetFileName']

let defaultPostProcessor = (
  (sourceFileContent, { targetFileName }) => {
    let replaceLocalImports = RelativeImport.local(targetFileName)
    return fn.pipe(
      sourceFileContent,
      (_) => _.replaceAll(
        RelativeImport.namespace.from,
        RelativeImport.namespace.to,
      ),
      (_) => _.replaceAll(
        replaceLocalImports.from,
        replaceLocalImports.to,
      ),
      (_) => _.replaceAll(
        RelativeImport.parent.from,
        RelativeImport.parent.to,
      ),
    )
  }
) satisfies PostProcessor

let defaultLibOptions = {
  relativePath: 'src/schemas',
  excludeFiles: [],
  getTargetFileName: defaultGetTargetFileName,
  postprocessor: defaultPostProcessor,
} satisfies LibOptions

let defaultLibs = {
  [Library.Core]: defaultLibOptions,
  [Library.Equals]: defaultLibOptions,
  [Library.ToJsonSchema]: defaultLibOptions,
  [Library.ToString]: defaultLibOptions,
  [Library.Validators]: defaultLibOptions,
} satisfies Record<string, LibOptions>

let defaultOptions = {
  dryRun: false,
  getSourceDir: () => path.join(process.cwd(), 'node_modules', '@traversable'),
  getTargetDir: () => path.join(process.cwd(), 'src', 'schemas'),
  libs: defaultLibs,
} satisfies Required<BuildOptions> & LibsOptions<keyof typeof defaultLibs>

function parseLibOptions({
  excludeFiles = defaultLibOptions.excludeFiles,
  relativePath = defaultLibOptions.relativePath,
  getTargetFileName = defaultLibOptions.getTargetFileName,
  postprocessor = defaultLibOptions.postprocessor,
  includeFiles,
}: Partial<LibOptions>): LibOptions {
  return {
    excludeFiles,
    relativePath,
    getTargetFileName,
    postprocessor,
    ...includeFiles && { includeFiles }
  }
}

function parseOptions<K extends string>(options: Options<K>): Config<K>
function parseOptions({
  getSourceDir = defaultOptions.getSourceDir,
  getTargetDir = defaultOptions.getTargetDir,
  dryRun = defaultOptions.dryRun,
  libs,
}: Options = defaultOptions): Config {
  return {
    dryRun,
    sourceDir: getSourceDir(),
    targetDir: getTargetDir(),
    libs: fn.map(libs, parseLibOptions),
  }
}

let tap
  : (msg?: string, stringify?: (x: unknown) => string) => <T>(x: T,) => T
  = (msg, stringify) => (x) => (
    console.log('\n' + (msg ? `${msg}:\n` : '') + (stringify ? stringify(x) : x) + '\r'),
    x
  )

function ensureDirExists(cache: Set<string>, $: Config) {
  return (schemaFile: fs.Dirent) => {
    let targetDirPath = path.join(
      PATH.target,
      schemaFile.name.slice(0, -'.ts'.length),
    )
    if (!cache.has(targetDirPath) && !$.dryRun) {
      cache.add(targetDirPath)
      if (!fs.existsSync(targetDirPath)) {
        fs.mkdirSync(targetDirPath)
      }
    }
    return schemaFile
  }
}

function buildCoreSchemas(options: Options) {
  let $ = parseOptions(options)
  let cache = new Set<string>()

  return fs.readdirSync(
    path.join($.sourceDir), { withFileTypes: true })
    .filter(({ name }) => Object.keys($.libs).includes(name))
    .map(
      (sourceDir) => {
        let LIB_NAME = sourceDir.name
        let LIB = $.libs[LIB_NAME]
        return fn.pipe(
          path.join(
            sourceDir.parentPath,
            LIB_NAME,
            $.libs[LIB_NAME].relativePath,
          ),
          (schemasDir) => fs.readdirSync(schemasDir, { withFileTypes: true }),
          fn.map(
            (schemaFile) => {
              let sourceFilePath = path.join(schemaFile.parentPath, schemaFile.name)
              let targetFileName = LIB.getTargetFileName(LIB_NAME, schemaFile.name)
              let targetDirName = schemaFile.name.endsWith('.ts') ? schemaFile.name.slice(0, -'.ts'.length) : schemaFile.name
              let targetFilePath = path.join(
                $.targetDir,
                targetDirName,
                targetFileName
              )

              return fn.pipe(
                schemaFile,
                ensureDirExists(cache, $),
                (schemaFile) => {
                  return [
                    targetFilePath,
                    fs.readFileSync(sourceFilePath).toString('utf8'),
                  ] satisfies [any, any]
                },
                ([targetFilePath, sourceFileContent]) => [
                  targetFilePath,
                  LIB.postprocessor(sourceFileContent, { ...LIB, targetFileName })
                ] satisfies [any, any],
                ([targetFilePath, content]) => (
                  void ((!$.dryRun && fs.writeFileSync(targetFilePath, content))),
                  [targetFilePath, content]
                )
              )
            }
          ),
          // fn.map(
          //   fn.flow(
          //     ([filePath, content]) => [filePath, content.replaceAll(RelativeImport.namespace.from, RelativeImport.namespace.to)] satisfies [any, any],
          //     ([filePath, content]) => [filePath, content.replaceAll(RelativeImport.local(LIB_NAME).from, RelativeImport.local(LIB_NAME).to)] satisfies [any, any],
          //     ([filePath, content]) => (void (!$.dryRun && fs.writeFileSync(filePath, content)), [filePath, content]),
          //   )
          // )
          // tap('got em?')
        )
      })
}

// (schemaFiles) => {
//   schemaFiles.forEach((schemaFile) => {
//     let targetDirPath = path.join(
//       PATH.target,
//       schemaFile.name.slice(0, -'.ts'.length),
//     )
//     if (!cache.has(targetDirPath)) {
//       cache.add(targetDirPath)
//       if (!$.dryRun) {
//         if (!fs.existsSync(targetDirPath)) {
//           fs.mkdirSync(targetDirPath)
//         }
//       }
//       else {
//         console.group('\n\r[DRY_RUN]\r')
//         console.log('[DEBUG]: !cache.has("' + targetDirPath + '")')
//         if (!fs.existsSync(targetDirPath))
//           console.log('[DEBUG]: fs.mkdirSync("' + targetDirPath + '")')
//         else
//           console.log('[DEBUG]: fs.existsSync("' + targetDirPath + '")')
//         console.groupEnd()
//       }
//     } else {
//       if ($.dryRun) {
//         console.group('\n\r[DRY_RUN]\r')
//         console.log('[DEBUG]: cache.has("' + targetDirPath + '")')
//         console.groupEnd()
//       }

//     }
//   })
//   return schemaFiles
// },

// (schemaFiles) => schemaFiles.map(({ name: schemaFileName, parentPath }) => {
//   let schemaName = schemaFileName.slice(0, -'.ts'.length)

// if (!sKeyOf(sourceDir.name, LIB_NAME_TO_FILENAME)) throw Error('dirName ' + dirName + ' is not a key of LIB_NAME_TO_FILENAME')
// else {
//   return [
//     path.join(
//       PATH.target,
//       dirName.slice(0, -'.ts'.length),
//       isKeyOf(dirName, LIB_NAME_TO_FILENAME) ? LIB_NAME_TO_FILENAME[dirName] + '.ts' : 'BORKED'
//     ),
//     fs.readFileSync(
//       path.join(
//         parentPath,
//         dirName,
//       )
//     ).toString('utf8')
//   ] satisfies [any, any]
// }

// },
// )

// else {
//   console.group('\n\r[DRY_RUN]\r')
//   console.log('[DEBUG]: !cache.has("' + targetDirPath + '")')
//   if (!fs.existsSync(targetDirPath))
//     console.log('[DEBUG]: fs.mkdirSync("' + targetDirPath + '")')
//   else
//     console.log('[DEBUG]: fs.existsSync("' + targetDirPath + '")')
//   console.groupEnd()
// }
// } else {
// if ($.dryRun) {
//   console.group('\n\r[DRY_RUN]\r')
//   console.log('[DEBUG]: cache.has("' + targetDirPath + '")')
//   console.groupEnd()
// }


//     (schemaPaths) => schemaPaths.map(({ name: schemaFileName, parentPath }) => {
//       let schemaName = schemaFileName.slice(0, -'.ts'.length)
//       if (!isKeyOf(dirName, LIB_NAME_TO_FILENAME)) throw Error('dirName ' + dirName + ' is not a key of LIB_NAME_TO_FILENAME')
//       else {
//         return [
//           path.join(
//             PATH.target,
//             dirName.slice(0, -'.ts'.length),
//             isKeyOf(dirName, LIB_NAME_TO_FILENAME) ? LIB_NAME_TO_FILENAME[dirName] + '.ts' : 'BORKED'
//           ),
//           fs.readFileSync(
//             path.join(
//               parentPath,
//               dirName,
//             )
//           ).toString('utf8')
//         ] satisfies [any, any]
//       }
//     },
//       fn.map(
//         fn.flow(
//           ([filePath, content]) => [filePath, content.replaceAll(RelativeImport.namespace.from, RelativeImport.namespace.to)] satisfies [any, any],
//           ([filePath, content]) => [filePath, content.replaceAll(RelativeImport.local.from, RelativeImport.local.to)] satisfies [any, any],
//           ([filePath, content]) => !$.dryRun ? fs.writeFileSync(filePath, content) : void 0
//         )
//       )
//     )
//   )
// )

// function buildSchemaExtensions() {
//   return fs.readdirSync(PATH.sourcesDir, { withFileTypes: true })
//     .filter(({ name }) => !LIB_BLACKLIST.includes(name) && LIB_WHITELIST.includes(name))
//     .map(
//       ({ name, parentPath }) => fn.pipe(
//         path.join(
//           parentPath,
//           name,
//           'src',
//           'schemas',
//         ),
//         (absolutePath) => fs.readdirSync(absolutePath, { withFileTypes: true }),
//         (schemaPaths) => schemaPaths.map(({ name: schemaName, parentPath }) => [
//           path.join(
//             PATH.target,
//             schemaName.slice(0, -'.ts'.length),
//             isKeyOf(name, LIB_NAME_TO_FILENAME) ? LIB_NAME_TO_FILENAME[name] + '.ts' : 'BORKED',
//           ),
//           fs.readFileSync(
//             path.join(
//               parentPath,
//               schemaName,
//             )
//           ).toString('utf8')
//         ] satisfies [any, any]),
//         fn.map(
//           fn.flow(
//             ([filePath, content]) => [filePath, content.replaceAll(RelativeImport.namespace.from, RelativeImport.namespace.to)] satisfies [any, any],
//             ([filePath, content]) => [filePath, content.replaceAll(RelativeImport.local.from, RelativeImport.local.to)] satisfies [any, any],
//             ([filePath, content]) => fs.writeFileSync(filePath, content)),
//         ),
//       )
//     )
// }

function ensureTargetExists() {
  if (!fs.existsSync(PATH.target)) {
    fs.mkdirSync(PATH.target)
  }
}

function buildSchemas<K extends string>(options: Options<K>) {
  ensureTargetExists()
  return buildCoreSchemas(options)
  // buildSchemaExtensions()
}

let out = buildSchemas(defaultOptions)

// console.log('out', out)

/** 
 * ## TODO
 * 
 * - [x] Pull the .ts files out of `@traversable/schema-core`
 * - [x] Pull the .ts files out of `@traversable/derive-equals`
 * - [x] Pull the .ts files out of `@traversable/schema-to-json-schema`
 * - [ ] Pull the .ts files out of `@traversable/derive-validators`
 * - [ ] Pull the .ts files out of `@traversable/schema-to-string`
 */
