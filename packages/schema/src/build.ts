#!/usr/bin/env pnpm dlx tsx
import * as path from 'node:path'
import * as fs from 'node:fs'
import type { IfReturns } from '@traversable/registry'
import { fn } from '@traversable/registry'
import { t } from '@traversable/schema-core'
import { generateSchemas } from '@traversable/schema-generator'

/** 
 * ## TODO
 * 
 * - [x] Pull the .ts files out of `@traversable/schema-core`
 * - [x] Pull the .ts files out of `@traversable/derive-equals`
 * - [x] Pull the .ts files out of `@traversable/schema-to-json-schema`
 * - [ ] Pull the .ts files out of `@traversable/derive-validators`
 * - [ ] Pull the .ts files out of `@traversable/schema-to-string`
 */

let CWD = process.cwd()

let PATH = {
  libsDir: path.join(CWD, 'node_modules', '@traversable'),
  tempDir: path.join(CWD, 'src', 'temp'),
  extensionsDir: path.join(CWD, 'src', 'extensions'),
  targetDir: path.join(CWD, 'src', 'schemas'),
}

let EXTENSION_FILES_IGNORE_LIST = [
  'equals.ts',
  'toJsonSchema.ts',
  'toString.ts',
  'validate.ts',
]

/** 
 * TODO: Derive this list from the {@link EXTENSION_FILES_IGNORE_LIST ignore list}
 */
let REMOVE_IMPORTS_LIST = [
  /.*equals.js'\n/,
  /.*toJsonSchema.js'\n/,
  /.*toString.js'\n/,
  /.*validate.js'\n/,
]

type Library = typeof Library[keyof typeof Library]
let Library = {
  Core: 'schema-core',
  Equals: 'derive-equals',
  ToJsonSchema: 'schema-to-json-schema',
  ToString: 'schema-to-string',
  Validators: 'derive-validators',
} as const

let LIB_NAME_TO_TARGET_FILENAME = {
  [Library.Core]: 'core',
  [Library.Equals]: 'equals',
  [Library.ToJsonSchema]: 'toJsonSchema',
  [Library.Validators]: 'validate',
  [Library.ToString]: 'toString',
} as const satisfies Record<Library, string>

let removeIgnoredImports = (content: string) => {
  for (let ignore of REMOVE_IMPORTS_LIST)
    content = content.replace(ignore, '')
  return content
}

let TargetReplace = {
  internal: {
    /**
     * @example
     * // from:
     * import type { Guarded, Schema, SchemaLike } from '../../_namespace.js'
     * // to:
     * import type { Guarded, Schema, SchemaLike } from '../namespace.js'
     */
    from: /'(\.\.\/)namespace.js'/g,
    to: '\'../_namespace.js\'',
  },
  namespace: {
    from: /'@traversable\/schema-core'/g,
    to: '\'../_exports.js\'',
  },
  coverageDirective: {
    from: /\s*\/\* v8 ignore .+ \*\//g,
    to: '',
  }
}

type Rewrite = (x: string) => string
let rewriteCoreInternalImport: Rewrite = (_) => _.replaceAll(TargetReplace.internal.from, TargetReplace.internal.to)
let rewriteCoreNamespaceImport: Rewrite = (_) => _.replaceAll(TargetReplace.namespace.from, TargetReplace.namespace.to)
let removeCoverageDirectives: Rewrite = (_) => _.replaceAll(TargetReplace.coverageDirective.from, TargetReplace.coverageDirective.to)

let isKeyOf = <T>(k: keyof any, t: T): k is keyof T =>
  !!t && (typeof t === 'object' || typeof t === 'function') && k in t

type GetTargetFileName = (libName: string, schemaName: string) => `${string}.ts`
type PostProcessor = (sourceFileContent: string) => string

type LibOptions = t.typeof<typeof LibOptions>
let LibOptions = t.object({
  relativePath: t.string,
  getTargetFileName: (x): x is GetTargetFileName => typeof x === 'function',
  // tempPostProcessor: (x): x is PostProcessor => typeof x === 'function',
  postProcessor: (x): x is PostProcessor => typeof x === 'function',
  // TODO: actually exclude files
  excludeFiles: t.array(t.string),
  includeFiles: t.optional(t.array(t.string)),
})

type BuildOptions = t.typeof<typeof BuildOptions>
let BuildOptions = t.object({
  dryRun: t.optional(t.boolean),
  getSourceDir: t.optional((x): x is (() => string) => typeof x === 'function'),
  getTempDir: t.optional((x): x is (() => string) => typeof x === 'function'),
  getTargetDir: t.optional((x): x is (() => string) => typeof x === 'function'),
  getExtensionFilesDir: t.optional((x): x is (() => string) => typeof x === 'function'),
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

let defaultPostProcessor = (_: string) => fn.pipe(
  _,
  rewriteCoreInternalImport,
  rewriteCoreNamespaceImport,
  removeCoverageDirectives,
  removeIgnoredImports,
)

let defaultLibOptions = {
  relativePath: 'src/schemas',
  excludeFiles: [],
  getTargetFileName: defaultGetTargetFileName,
  postProcessor: defaultPostProcessor,
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
  getSourceDir: () => PATH.libsDir,
  getTempDir: () => PATH.tempDir,
  getTargetDir: () => PATH.targetDir,
  getExtensionFilesDir: () => PATH.extensionsDir,
  libs: defaultLibs,
} satisfies Required<BuildOptions> & LibsOptions<keyof typeof defaultLibs>

function parseLibOptions({
  excludeFiles = defaultLibOptions.excludeFiles,
  relativePath = defaultLibOptions.relativePath,
  getTargetFileName = defaultLibOptions.getTargetFileName,
  postProcessor = defaultLibOptions.postProcessor,
  includeFiles,
}: Partial<LibOptions>): LibOptions {
  return {
    excludeFiles,
    relativePath,
    getTargetFileName,
    postProcessor,
    ...includeFiles && { includeFiles }
  }
}

function parseOptions<K extends string>(options: Options<K>): Config<K>
function parseOptions({
  getSourceDir = defaultOptions.getSourceDir,
  getTempDir = defaultOptions.getTempDir,
  getTargetDir = defaultOptions.getTargetDir,
  getExtensionFilesDir = defaultOptions.getExtensionFilesDir,
  dryRun = defaultOptions.dryRun,
  libs,
}: Options = defaultOptions): Config {
  return {
    dryRun,
    tempDir: getTempDir(),
    sourceDir: getSourceDir(),
    targetDir: getTargetDir(),
    extensionFilesDir: getExtensionFilesDir(),
    libs: fn.map(libs, parseLibOptions),
  }
}

let tap
  : <S, T>(effect: (s: S) => T) => (x: S) => S
  = (effect) => (x) => (effect(x), x)

let ensureDir
  : (dirpath: string) => void
  = (dirpath) => !fs.existsSync(dirpath) && fs.mkdirSync(dirpath)

function copyExtensionFiles($: Config) {
  if (!fs.existsSync($.extensionFilesDir)) {
    throw Error('Could not find extensions dir: ' + $.extensionFilesDir)
  }
  let filenames = fs
    .readdirSync($.extensionFilesDir)
    .filter((filename) => !EXTENSION_FILES_IGNORE_LIST.includes(filename))

  filenames.forEach((filename) => {
    let tempDirName = filename.slice(0, -'.ts'.length)
    let tempDirPath = path.join($.tempDir, tempDirName)
    let tempPath = path.join(tempDirPath, 'extension.ts')
    let sourcePath = path.join($.extensionFilesDir, filename)
    let content = fs.readFileSync(sourcePath).toString('utf8')
    ensureDir(tempDirPath)
    fs.writeFileSync(tempPath, content)
  })
}

function buildSchemas($: Config) {
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
              let tempDirName = schemaFile.name.endsWith('.ts')
                ? schemaFile.name.slice(0, -'.ts'.length)
                : schemaFile.name

              let targetFilePath = path.join(
                $.tempDir,
                tempDirName,
                targetFileName
              )

              let tempDirPath = path.join(
                $.tempDir,
                schemaFile.name.slice(0, -'.ts'.length),
              )

              if (!cache.has(tempDirPath) && !$.dryRun) {
                cache.add(tempDirPath)
                ensureDir(tempDirPath)
              }

              return fn.pipe(
                [
                  targetFilePath,
                  fs.readFileSync(sourceFilePath).toString('utf8')
                ] satisfies [any, any],
                tap(([targetFilePath, content]) => fs.writeFileSync(
                  targetFilePath,
                  content,
                )),
              )
            }
          ),
        )
      }
    )
}

function getSourcePaths($: Config) {
  if (!fs.existsSync($.tempDir)) {
    throw Error('[getSourcePaths] Expected temp directory to exist: ' + $.tempDir)
  }

  return fs.readdirSync($.tempDir, { withFileTypes: true })
    .reduce(
      (acc, { name, parentPath }) => ({
        ...acc,
        [name]: fs
          .readdirSync(path.join(parentPath, name), { withFileTypes: true })
          .reduce(
            (acc, { name, parentPath }) => ({
              ...acc,
              [name.slice(0, -'.ts'.length)]: path.join(parentPath, name)
            }),
            {}
          )
      }),
      {}
    )
}

function createTargetPaths($: Config, sourcePaths: Record<string, Record<string, string>>) {
  return fn.map(sourcePaths, (_, schemaName) => path.join($.targetDir, `${schemaName}.ts`))
}

export function writeSchemas($: Config, sources: Record<string, Record<string, string>>, targets: Record<string, string>): void {
  let schemas = generateSchemas(sources, targets)
  for (let [target, content] of schemas) {
    void fs.writeFileSync(target, defaultPostProcessor(content))
  }
}

function build<K extends string>(options: Options<K>) {
  let $ = parseOptions(options)
  void ensureDir($.tempDir)
  void copyExtensionFiles($)
  buildSchemas($)

  let sources = getSourcePaths($)
  let targets = createTargetPaths($, sources)

  if ($.dryRun) return {
    sources,
    targets,
  }
  else {
    void ensureDir($.targetDir)
    void writeSchemas($, sources, targets)
    void fs.rmSync($.tempDir, { force: true, recursive: true })
  }
}

build(defaultOptions)
