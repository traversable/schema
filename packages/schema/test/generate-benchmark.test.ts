import * as vi from 'vitest'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as fc from 'fast-check'

import { recurse as Traversable } from '@traversable/schema'
import * as Zod4 from './to-zod.js'
import * as Typebox from './to-typebox.js'
import * as Ark from './to-arktype.js'
import * as Seed from './seed.js'
import { jsonValue } from './test-utils.js'

type Require<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: T[P] }

type Options =
  & Templates
  & {
    schemaName: string
    benchmarkCount?: number
    skipBaseline?: boolean
  }

type Templates = { -readonly [K in keyof typeof Lib]+?: string }

type Lib = typeof Lib[keyof typeof Lib]

const Lib = {
  t: 't',
  arktype: 'arktype',
  zod4: 'zod4',
  typebox: 'typebox',
} as const satisfies Record<string, string>

const LibConfig = {
  [Lib.t]: {
    namespaceAlias: Lib.t,
    format: true,
    initialOffset: 4,
    maxWidth: 50,
  } satisfies Traversable.Options,
  [Lib.arktype]: {
    namespaceAlias: Lib.arktype,
    format: true,
    initialOffset: 4,
    maxWidth: 50,
  } satisfies Ark.Options,
  [Lib.zod4]: {
    namespaceAlias: Lib.zod4,
    format: true,
    preferInterface: true,
    initialOffset: 4,
    maxWidth: 50,
  } satisfies Zod4.Options,
  [Lib.typebox]: {
    namespaceAlias: Lib.typebox,
    format: true,
    initialOffset: 4,
    maxWidth: 50,
  } satisfies Typebox.Options,
}

interface Config extends Required<Omit<Options, keyof Templates>>, Templates {}

const defaults = {
  benchmarkCount: 1,
  schemaName: '__generated',
  skipBaseline: Boolean(true),
} satisfies Config

const DIR_PATH = path.join(path.resolve(), 'packages', 'schema', 'test')
const PATH = {
  target: path.join(DIR_PATH, 'types'),
} as const satisfies Record<string, string>

const IMPORTS = [
  `import { bench } from "@ark/attest"`,
  `import { t as ${Lib.t} } from "@traversable/schema"`,
  `import { type as ${Lib.arktype} } from "arktype"`,
  `import { z as ${Lib.zod4} } from 'zod'`,
  `import * as ${Lib.typebox} from "@sinclair/typebox"`,
]

const SUFFIX = '.bench.types.ts'
const RET = (numberOfLines = 1) => '\r\n'.repeat(numberOfLines)
const TAB = (numberOfSpaces: number) => (line: string) => ' '.repeat(numberOfSpaces) + line

function makeTemplate<K extends Lib>(lib: K, benchmarkTitle?: string): ($: Require<Config, K>, index: number) => string
function makeTemplate<K extends Lib>(lib: K, TITLE = lib) {
  return ($: Config & Require<Config, K>, index: number) => ``
    + `bench(`
    + `\r\n`
    + `  "${TITLE}: ${$.schemaName.startsWith('__') ? $.schemaName.slice(2) : $.schemaName} #${index + 1}",`
    + `\r\n`
    + `  () => {`
    + `\r\n`
    + `    ${$[lib]!}`
    + `\r\n`
    + `  }`
    + `\r\n`
    + `).types()`
    + `\r\n`
}

const createFileName = ($: Options) => {
  let fileName = ''
    + $.schemaName
    + `__${new Date().toISOString().slice(0, 10)}`
  let index = 1
  while (fs.existsSync(path.join(PATH.target, fileName + SUFFIX))) {
    if (/--\d+$/.test(fileName)) {
      fileName = fileName.slice(0, fileName.lastIndexOf('--') + '--'.length) + `${index++}`
    } else {
      fileName = fileName + `--${index++}`
    }
  }
  return fileName + SUFFIX
}

const jsonArbitrary = jsonValue.tree
const exclude = [
  'never',
  'symbol',
  'any',
  'unknown',
  'intersect',
  'bigint',
] as const satisfies string[]

const SchemaGenerator = Seed.schemaWithMinDepth({
  exclude,
  eq: { jsonArbitrary },
  // TODO: Rip out when this issue is resolved: https://github.com/arktypeio/arktype/issues/1440
  union: { maxLength: 2, minLength: 1 },
}, 4)

function createBenchmarks($: Config) {
  const schemas = fc.sample(SchemaGenerator, $.benchmarkCount)
  const t = (ix: number) => Traversable.schemaToString(schemas[ix], LibConfig[Lib.t])
  const arktype = (ix: number) => Ark.stringFromTraversable(schemas[ix], LibConfig[Lib.arktype])
  const zod4 = (ix: number) => Zod4.stringFromTraversable(schemas[ix], LibConfig[Lib.zod4])
  const typebox = (ix: number) => Typebox.stringFromTraversable(schemas[ix], LibConfig[Lib.typebox])
  const benchmarks = Array.from(
    { length: $.benchmarkCount },
    (_, ix) => ''
      + `\r\n////////////////${'/'.repeat(`#${ix + 1}`.length)}//////`
      + `\r\n///// benchmark #${ix + 1} /////\n`
      + makeTemplate('t', '@traversable/schema')({ ...$, t: t(ix) }, ix)
      + RET(2)
      + makeTemplate('arktype')({ ...$, arktype: arktype(ix) }, ix)
      + RET(2)
      + makeTemplate('zod4', 'zod@4')({ ...$, zod4: zod4(ix) }, ix)
      + RET(2)
      + makeTemplate('typebox')({ ...$, typebox: typebox(ix) }, ix)
      + `\r\n///// benchmark #${ix + 1} /////`
      + `\r\n////////////////${'/'.repeat(`#${ix}`.length)}//////`
      + RET(2)
  )

  return ''
    + IMPORTS.join('\r\n')
    + RET(2)
    + benchmarks.join(RET())
    + RET()
}

function writeBenchmark(options?: Options) {
  const $ = {
    benchmarkCount: options?.benchmarkCount ?? defaults.benchmarkCount,
    schemaName: options?.schemaName ?? defaults.schemaName,
    skipBaseline: options?.skipBaseline ?? defaults.skipBaseline,
  } satisfies typeof defaults
  const fileName = createFileName($)
  const targetPath = path.join(PATH.target, fileName)
  const content = createBenchmarks($)
  /// SIDE-EFFECT
  void fs.writeFileSync(targetPath, content)
}

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema❳', () => {
  // vi.test('〖⛳️〗‹ ❲writeBenchmark❳', () => {
  //   writeBenchmark()
  // })
})
