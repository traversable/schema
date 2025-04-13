#!/usr/bin/env pnpm dlx tsx
import type { IfUnaryReturns } from '@traversable/registry'
import * as path from 'node:path'
import * as fs from 'node:fs'
import { fn } from '@traversable/registry'
import { t } from '@traversable/schema-core'
import { generateSchemas } from '@traversable/schema-generator'

/** 
 * ## TODO
 * 
 * - [x] Pull the .ts files out of `@traversable/schema-core`
 * - [x] Pull the .ts files out of `@traversable/derive-equals`
 * - [x] Pull the .ts files out of `@traversable/schema-to-json-schema`
 * - [x] Pull the .ts files out of `@traversable/derive-validators`
 * - [x] Pull the .ts files out of `@traversable/schema-to-string`
 * - [x] Read extension config files from `extensions` dir
 * - [x] Allow local imports to pass through the parser
 * - [x] Write generated schemas to namespace file so they can be used by other schemas
 * - [x] Clean up the temp dir
 * - [x] Configure the package.json file to export from `__schemas__`
 */

let CWD = process.cwd()

let PATH = {
  libsDir: path.join(CWD, 'node_modules', '@traversable'),
  tempDir: path.join(CWD, 'src', 'temp'),
  extensionsDir: path.join(CWD, 'src', 'extensions'),
  targetDir: path.join(CWD, 'src', '__schemas__'),
  namespaceFile: path.join(CWD, 'src', '_namespace.ts'),
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

let localSchemaNames = {
  any: 'any_',
  bigint: 'bigint_',
  boolean: 'boolean_',
  never: 'never_',
  null: 'null_',
  number: 'number_',
  object: 'object_',
  string: 'string_',
  symbol: 'symbol_',
  undefined: 'undefined_',
  unknown: 'unknown_',
  void: 'void_',
  array: 'array',
  eq: 'eq',
  integer: 'integer',
  intersect: 'intersect',
  of: 'of',
  optional: 'optional',
  record: 'record',
  tuple: 'tuple',
  union: 'union',
} as Record<string, string>

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
  },
  selfReference: (schemaName: string) => {
    let localSchemaName = localSchemaNames[schemaName]
    return {
      from: `t.${schemaName}`,
      to: localSchemaName,
    }
  },
}

type Rewrite = (x: string) => string
let rewriteCoreInternalImport: Rewrite = (_) => _.replaceAll(TargetReplace.internal.from, TargetReplace.internal.to)
let rewriteCoreNamespaceImport: Rewrite = (_) => _.replaceAll(TargetReplace.namespace.from, TargetReplace.namespace.to)
let removeCoverageDirectives: Rewrite = (_) => _.replaceAll(TargetReplace.coverageDirective.from, TargetReplace.coverageDirective.to)
let rewriteSelfReferences: (schemaName: string) => Rewrite = (schemaName) => {
  let { from, to } = TargetReplace.selfReference(schemaName)
  return (_) => _.replaceAll(from, to)
}

let isKeyOf = <T>(k: keyof any, t: T): k is keyof T =>
  !!t && (typeof t === 'object' || typeof t === 'function') && k in t

type GetTargetFileName = (libName: string, schemaName: string) => `${string}.ts`
type PostProcessor = (sourceFileContent: string, schemaName: string) => string

type LibOptions = t.typeof<typeof LibOptions>
let LibOptions = t.object({
  relativePath: t.string,
  getTargetFileName: (x): x is GetTargetFileName => typeof x === 'function',
  // TODO: actually exclude files
  excludeFiles: t.array(t.string),
  includeFiles: t.optional(t.array(t.string)),
})

type BuildOptions = t.typeof<typeof BuildOptions>
let BuildOptions = t.object({
  dryRun: t.optional(t.boolean),
  postProcessor: (x): x is PostProcessor => typeof x === 'function',
  excludeSchemas: t.optional(t.union(t.array(t.string), t.null)),
  getSourceDir: t.optional((x): x is (() => string) => typeof x === 'function'),
  getNamespaceFile: t.optional((x): x is (() => string) => typeof x === 'function'),
  getTempDir: t.optional((x): x is (() => string) => typeof x === 'function'),
  getTargetDir: t.optional((x): x is (() => string) => typeof x === 'function'),
  getExtensionFilesDir: t.optional((x): x is (() => string) => typeof x === 'function'),
})

type LibsOptions<K extends string> = never | { libs: Record<K, Partial<LibOptions>> }
type LibsConfig<K extends string> = never | { libs: Record<K, LibOptions> }
type ParseOptions<T> = never | { [K in keyof T as K extends `get${infer P}` ? Uncapitalize<P> : K]-?: IfUnaryReturns<T[K]> }
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

let defaultPostProcessor = (content: string, schemaName: string) => fn.pipe(
  content,
  rewriteCoreInternalImport,
  rewriteCoreNamespaceImport,
  removeCoverageDirectives,
  removeIgnoredImports,
  rewriteSelfReferences(schemaName),
)

let defaultLibOptions = {
  relativePath: 'src/schemas',
  excludeFiles: [],
  getTargetFileName: defaultGetTargetFileName,
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
  postProcessor: defaultPostProcessor,
  excludeSchemas: null,
  getExtensionFilesDir: () => PATH.extensionsDir,
  getNamespaceFile: () => PATH.namespaceFile,
  getSourceDir: () => PATH.libsDir,
  getTempDir: () => PATH.tempDir,
  getTargetDir: () => PATH.targetDir,
  libs: defaultLibs,
} satisfies Required<BuildOptions> & LibsOptions<keyof typeof defaultLibs>

function parseLibOptions({
  excludeFiles = defaultLibOptions.excludeFiles,
  relativePath = defaultLibOptions.relativePath,
  getTargetFileName = defaultLibOptions.getTargetFileName,
  includeFiles,
}: Partial<LibOptions>): LibOptions {
  return {
    excludeFiles,
    relativePath,
    getTargetFileName,
    ...includeFiles && { includeFiles }
  }
}

function parseOptions<K extends string>(options: Options<K>): Config<K>
function parseOptions({
  dryRun = defaultOptions.dryRun,
  excludeSchemas = null,
  getExtensionFilesDir = defaultOptions.getExtensionFilesDir,
  getNamespaceFile = defaultOptions.getNamespaceFile,
  getSourceDir = defaultOptions.getSourceDir,
  getTargetDir = defaultOptions.getTargetDir,
  getTempDir = defaultOptions.getTempDir,
  libs,
  postProcessor = defaultOptions.postProcessor,
}: Options = defaultOptions): Config {
  return {
    dryRun,
    excludeSchemas,
    extensionFilesDir: getExtensionFilesDir(),
    libs: fn.map(libs, parseLibOptions),
    namespaceFile: getNamespaceFile(),
    postProcessor,
    sourceDir: getSourceDir(),
    targetDir: getTargetDir(),
    tempDir: getTempDir(),
  }
}

let tap
  : <S, T>(effect: (s: S) => T) => (x: S) => S
  = (effect) => (x) => (effect(x), x)

let ensureDir
  : (dirpath: string, $: Config) => void
  = (dirpath, $) => !$.dryRun
    ? void (!fs.existsSync(dirpath) && fs.mkdirSync(dirpath))
    : void (
      console.group('[[DRY_RUN]]: `ensureDir`'),
      console.debug('mkDir:', dirpath),
      console.groupEnd()
    )

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
    ensureDir(tempDirPath, $)
    if ($.dryRun) {
      console.group('\n\n[[DRY_RUN]]:: `copyExtensionFiles`')
      console.debug('\ntempPath:\n', tempPath)
      console.debug('\ncontent:\n', content)
      console.groupEnd()
    } else {
      fs.writeFileSync(tempPath, content)
    }
  })
}

function buildSchemas($: Config): void {
  let cache = new Set<string>()

  return void fs.readdirSync(
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
              let sourceFileContent = fs.readFileSync(sourceFilePath).toString('utf8')
              let targetFileName = LIB.getTargetFileName(LIB_NAME, schemaFile.name)
              let schemaName = schemaFile.name.endsWith('.ts')
                ? schemaFile.name.slice(0, -'.ts'.length)
                : schemaFile.name

              console.log('schemaName', schemaName)

              let targetFilePath = path.join(
                $.tempDir,
                schemaName,
                targetFileName
              )

              let tempDirPath = path.join(
                $.tempDir,
                schemaFile.name.slice(0, -'.ts'.length),
              )

              if (!cache.has(tempDirPath) && !$.dryRun) {
                cache.add(tempDirPath)
                ensureDir(tempDirPath, $)
              }

              if (!$.dryRun) {
                fs.writeFileSync(
                  targetFilePath,
                  sourceFileContent,
                )
              } else {
                console.group('\n\n[[DRY_RUN]]:: `buildSchemas`')
                console.debug('\ntargetFilePath:\n', targetFilePath)
                console.debug('\nsourceFileContent:\n', sourceFileContent)
                console.groupEnd()
              }
            }
          ),
        )
      }
    )
}

function getSourcePaths($: Config): Record<string, Record<string, string>> {
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
  for (let [target, generatedContent] of schemas) {
    let pathSegments = target.split('/')
    let fileName = pathSegments[pathSegments.length - 1]
    let schemaName = fileName.endsWith('.ts') ? fileName.slice(0, -'.ts'.length) : fileName
    let content = $.postProcessor(generatedContent, schemaName)
    if ($.dryRun) {
      console.group('\n\n[[DRY_RUN]]:: `writeSchemas`')
      console.debug('\ntarget:\n', target)
      console.debug('\ncontent after post-processing:\n', content)
      console.groupEnd()
    } else {
      fs.writeFileSync(target, content)
    }
  }
}

function getNamespaceFileContent(previousContent: string, $: Config, sources: Record<string, Record<string, string>>) {
  let targetDirNames = $.targetDir.split('/')
  let targetDirName = targetDirNames[targetDirNames.length - 1]
  let lines = Object.keys(sources).map((schemaName) => `export { ${schemaName} } from './${targetDirName}/${schemaName}.js'`)
  return previousContent + '\r\n' + lines.join('\n') + '\r\n'
}

export function writeNamespaceFile($: Config, sources: Record<string, Record<string, string>>) {
  let content = getNamespaceFileContent(fs.readFileSync($.namespaceFile).toString('utf8'), $, sources)
  if (content.includes('export {')) {
    if ($.dryRun) {
      console.group('\n\n[[DRY_RUN]]:: `writeNamespaceFile`')
      console.debug('\ntarget file already have term-level exports:\n', content)
      console.groupEnd()
    } else {
      return void 0
    }
  }
  else if ($.dryRun) {
    console.group('\n\n[[DRY_RUN]]:: `writeNamespaceFile`')
    console.debug('\nnamespace file path:\n', $.namespaceFile)
    console.debug('\nnamespace file content:\n', content)
    console.groupEnd()
  } else {
    fs.writeFileSync($.namespaceFile, content)
  }
}

export function cleanupTempDir($: Config) {
  if ($.dryRun) {
    console.group('\n\n[[DRY_RUN]]:: `cleanupTempDir`')
    console.debug('\ntemp dir path:\n', $.tempDir)
    console.groupEnd()
  }
  else {
    void fs.rmSync($.tempDir, { force: true, recursive: true })
  }
}

function build<K extends string>(options: Options<K>) {
  let $ = parseOptions(options)
  void ensureDir($.tempDir, $)
  void copyExtensionFiles($)
  buildSchemas($)

  let sources = getSourcePaths($)
  let targets = createTargetPaths($, sources)

  if ($.dryRun) {
    console.group('\n\n[[DRY_RUN]]:: `build`')
    console.debug('\nsources:\n', sources)
    console.debug('\ntargets:\n', targets)
    console.groupEnd()
  }

  void ensureDir($.targetDir, $)
  void writeSchemas($, sources, targets)
  void writeNamespaceFile($, sources)
  void cleanupTempDir($)
}

build(defaultOptions)
