import * as vi from 'vitest'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fc } from '@fast-check/vitest'
import { recurse } from '@traversable/schema'

import * as Ark from './to-arktype.js'
import * as Zod4 from './to-zod-4.js'
import * as Typebox from './to-typebox.js'
import * as Seed from './seed.js'

type Options = {
  schemaName: string
  benchmarkCount?: number
  skipBaseline?: boolean
  t?: string
  ark?: string
  zod4?: string
  typebox?: string
}

type Lib =
  | 't'
  | 'ark'
  | 'zod4'
  | 'typebox'

interface Config extends Required<Omit<Options, Lib>>, Pick<Options, Lib> {}

const defaults = {
  benchmarkCount: 10,
  schemaName: '__generated',
  skipBaseline: Boolean(true),
} satisfies Config

const DIR_PATH = path.join(path.resolve(), 'packages', 'schema', 'test')
const PATH = {
  target: path.join(DIR_PATH, 'types'),
} as const satisfies Record<string, string>

const IMPORTS = [
  `import { bench } from "@ark/attest"`,
  `import { t } from "@traversable/schema"`,
  `import { type as arktype } from "arktype"`,
  `import { z } from 'zod4'`,
  `import * as typebox from "@sinclair/typebox"`,
]

const SUFFIX = '.bench.types.ts'
const RET = (numberOfLines = 1) => '\r\n'.repeat(numberOfLines)
const TAB = (numberOfSpaces: number) => (line: string) => ' '.repeat(numberOfSpaces) + line

const traversableTemplate = ($: Config & { t: string }, index: number) => ''
  + `bench("@traversable/schema: ${$.schemaName.startsWith('__') ? $.schemaName.slice(2) : $.schemaName} #${index + 1}}", () => `
  + RET()
  + TAB(2)($.t)
  + RET()
  + `).types`
  + RET()
  + TAB(2)(`()`)

const arktypeTemplate = ($: Config & { ark: string }, index: number) => ''
  + `bench("arktype: ${$.schemaName.startsWith('__') ? $.schemaName.slice(2) : $.schemaName} #${index + 1}}", () =>`
  + RET()
  + TAB(2)($.ark)
  + RET()
  + `).types`
  + RET()
  + TAB(2)(`()`)

const zod4Template = ($: Config & { zod4: string }, index: number) => ''
  + `bench("zod@4: ${$.schemaName.startsWith('__') ? $.schemaName.slice(2) : $.schemaName} #${index + 1}}", () =>`
  + RET()
  + TAB(2)($.zod4)
  + RET()
  + `).types`
  + RET()
  + TAB(2)(`()`)

const typeboxTemplate = ($: Config & { typebox: string }, index: number) => ''
  + `bench("typebox: ${$.schemaName.startsWith('__') ? $.schemaName.slice(2) : $.schemaName} #${index + 1}}", () =>`
  + RET()
  + TAB(2)($.typebox)
  + RET()
  + `).types`
  + RET()
  + TAB(2)(`()`)


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

const jsonValue = fc.letrec((go) => {
  return {
    null: fc.constant(null),
    boolean: fc.boolean(),
    number: Ark.arbitrary.int32toFixed,
    // TODO: kinda cheating here, eventually we should dig up the rules and escape this properly...
    string: Ark.arbitrary.alphanumeric,
    array: fc.array(go('tree')) as fc.Arbitrary<fc.JsonValue[]>,
    object: fc.dictionary(Ark.arbitrary.ident, go('tree')) as fc.Arbitrary<Record<string, fc.JsonValue>>,
    tree: fc.oneof(
      go('null'),
      go('boolean'),
      go('number'),
      go('string'),
      go('array'),
      go('object'),
    ) as fc.Arbitrary<fc.JsonValue>,
  }
})

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
  const t = (ix: number) => recurse.toString(schemas[ix], { initialOffset: 2 })
  const ark = (ix: number) => Ark.stringFromTraversable({ namespaceAlias: 'arktype' })(schemas[ix])
  const zod4 = (ix: number) => Zod4.stringFromTraversable({ namespaceAlias: 'z', object: { preferInterface: true } })(schemas[ix])
  const typebox = (ix: number) => Typebox.stringFromTraversable({ namespaceAlias: 'typebox' })(schemas[ix])
  const benchmarks = Array.from(
    { length: $.benchmarkCount },
    (_, ix) => ''
      + `\r\n////////////////${'/'.repeat(`#${ix + 1}`.length)}//////`
      + `\r\n///// benchmark #${ix + 1} /////\n`
      + traversableTemplate({ ...$, t: t(ix) }, ix)
      + RET(2)
      + arktypeTemplate({ ...$, ark: ark(ix) }, ix)
      + RET(2)
      + zod4Template({ ...$, zod4: zod4(ix) }, ix)
      + RET(2)
      + typeboxTemplate({ ...$, typebox: typebox(ix) }, ix)
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
  // SIDE-EFFECT
  void fs.writeFileSync(targetPath, content)
}

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema❳', () => {
  vi.it('〖⛳️〗‹ ❲writeBenchmark❳', () => {
    writeBenchmark()
  })
})
