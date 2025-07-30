import * as fs from 'node:fs'
import * as path from 'node:path'
import * as glob from 'glob'
import type { Repo } from './types.js'

export const PKG_LIST = {
  Start: '<\!-- codegen:start -->',
  End: '<\!-- codegen:end -->',
} as const

export const MARKER = {
  Start: `\`\`\`mermaid`,
  End: `\`\`\``,
} as const

export const PATTERN = {
  ChartReplacement: (chart: string) => `${MARKER.Start}\n${chart}\n${MARKER.End}`,
  DependencyGraph: `${MARKER.Start}([^]*?)${MARKER.End}`,
  FlattenOnce: { open: `(.*)../`, close: `(.*)` },
  ListReplacement: (list: string) => `${PKG_LIST.Start}\n${list}\n${PKG_LIST.End}`,
  NonWhitespace: '\\w',
  PackageList: `${PKG_LIST.Start}([^]*?)${PKG_LIST.End}`,
} as const

export const REG_EXP = {
  DependencyGraph: new globalThis.RegExp(PATTERN.DependencyGraph, 'g'),
  FlattenOnce: (dirPath: string) =>
    new RegExp(`${PATTERN.FlattenOnce.open}${dirPath}${PATTERN.FlattenOnce.close}`, 'gm'),
  NonWhitespace: new globalThis.RegExp(PATTERN.NonWhitespace, 'g'),
  PackageList: new globalThis.RegExp(PATTERN.PackageList, 'g'),
  Semver: /(\d)+\.(\d)+\.(\d)+/g,
  Target: /<>/,
  WordBoundary: /([-_][a-z])/gi,
  PackageNameWithSemver: /\@traversable\/[\w-]+\@[\d]+\.[\d]+\.[\d]+/g,
} as const

export const PATH = {
  readme: path.join(path.resolve(), 'README.md'),
  schemaReadme: path.join(path.resolve(), 'packages', 'schema', 'README.md'),
  generated: path.join(path.resolve(), 'config', '__generated__'),
  generated_repo_metadata: path.join(path.resolve(), 'config', '__generated__', 'repo.json'),
  generated_package_list: path.join(path.resolve(), 'config', '__generated__', 'package-list.ts'),
} as const

export const RELATIVE_PATH = {
  dist: 'dist',
  build: 'build',
  src: 'src',
  readme: 'README.md',
  package_json: 'package.json',
  generated_package_json: 'src/__generated__/__manifest__.ts',
  build_cjs: 'build/cjs',
  build_dts: 'build/dts',
  build_esm: 'build/esm',
  build_cjs_index: 'build/cjs/index.js',
  build_esm_index: 'build/esm/index.js',
  dist_cjs: 'dist/cjs',
  dist_dts: 'dist/dts',
  dist_esm: 'dist/esm',
  dist_src: 'dist/src',
  dist_readme: 'dist/README.md',
  dist_package_json: 'dist/package.json',
  dist_cjs_index: 'dist/cjs/index.js',
  dist_esm_index: 'dist/esm/index.js',
  dist_dts_index: 'dist/dts/index.d.ts',
  proxy__cjs: 'dist/dist/cjs',
  proxy__dts: 'dist/dist/dts',
  proxy__esm: 'dist/dist/esm',
  proxy__esm_packageJson: 'dist/dist/esm/package.json',
  ignoreGlobs: [
    '**/_internal/**',
    '**/__generated__/**',
    '**/index.ts',
  ],
} as const

export const REPO
  : Repo
  = globalThis.JSON.parse(fs.readFileSync(PATH.generated_repo_metadata).toString('utf8'))

export const SCOPE: '@traversable' = REPO.scope as never

export const defaults = {
  config: {
    generateExports: {
      include: ['*.ts'],
      exclude: [],
    },
    generateIndex: {
      include: ['*.ts'],
      exclude: [],
    },
  },
  concurrency: {
    concurrency: 'inherit',
    discard: true,
  },
} as const

const JSON_LIB = 'packages/json'
const REGISTRY_LIB = 'packages/registry'
const HARDCODED_LIBS = [JSON_LIB, REGISTRY_LIB]

export const GLOB = {
  all_packages: 'packages/*/',
  all_packages_src: 'packages/*/src/**/*.ts',
  all_libraries: 'packages'
} as const

export const PACKAGES: string[] = glob.sync(GLOB.all_packages)
export const GRAPH = ['.', ...PACKAGES] as const

export const INTEGRATIONS = PACKAGES.filter((pkg) => !HARDCODED_LIBS.includes(pkg) && !pkg.split('packages/')[1].startsWith('schema'))
export const LIBS = [...HARDCODED_LIBS, ...PACKAGES.filter((pkg) => pkg.split('packages/')[1].startsWith('schema'))]

export const BUILD_ARTIFACTS = [
  '.tsbuildinfo',
  'dist',
  'build',
] as const

export const BUILD_DEPS = [
  'node_modules',
] as const

export const EMOJI = {
  ERR: '٩◔̯◔۶',
  HEY: 'ʕ•̫͡•ʔ',
  OOO: '°ﺑ°',
  GUY: '٩(-̮̮̃-̃)۶',
  FACTS: '٩(•̮̮̃•̃)۶',
  WINK: '٩(-̮̮̃•̃)۶',
  WHAT: '٩(●̮̮̃•̃)۶',
  WAT: '٩(●̮̮̃●̃)۶',
  WOW: '٩(ಥ_ಥ)۶',
  WELL: 'ಥ﹏ಥ',
  YAY: 'ლ(´ڡ\'ლ)',
  FAK: '╯‵Д′)╯彡┻━┻',
  HUH: 'Σ(ﾟДﾟ )',
  WHYY: 'щ（ﾟДﾟщ）',
  HUHH: 'Σ (ﾟДﾟ;）',
  WHYYY: 'Σ(||ﾟДﾟ) ',
  O: '१|˚–˚|५',
  CAT: '/ᐠ - ˕ -マ',
  ADMIT_ONE: '🎟',
  FLAG: '🚩',
} as const

export let ALPHABET_MAP = {
  a: '𝗮',
  b: '𝗯',
  c: '𝗰',
  d: '𝗱',
  e: '𝗲',
  f: '𝗳',
  g: '𝗴',
  h: '𝗵',
  i: '𝗶',
  j: '𝗷',
  k: '𝗸',
  l: '𝗹',
  m: '𝗺',
  n: '𝗻',
  o: '𝗼',
  p: '𝗽',
  q: '𝗾',
  r: '𝗿',
  s: '𝘀',
  t: '𝘁',
  u: '𝘂',
  v: '𝘃',
  w: '𝘄',
  x: '𝘅',
  y: '𝘆',
  z: '𝘇',
} as const satisfies Record<string, string>

export let TEMPLATE = {
  Start: '<%= ',
  End: ' =>',
  new: <T extends string>(varName: T) => `<%= ${varName} =>` as const,
} as const
