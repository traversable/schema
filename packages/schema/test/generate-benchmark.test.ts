import * as vi from 'vitest'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fc } from '@fast-check/vitest'
import { recurse } from '@traversable/schema'

import * as Ark from './to-arktype.js'
import * as Zod4 from './to-zod-4.js'
import * as Seed from './seed.js'

type Options = {
  schemaName: string
  benchmarkCount?: number
  skipBaseline?: boolean
  t?: string
  ark?: string
  zod4?: string
}

interface Config extends Required<Omit<Options, 't' | 'ark' | 'zod4'>>, Pick<Options, 't' | 'ark' | 'zod4'> {}

const defaults = {
  benchmarkCount: 10,
  schemaName: 'TMP',
  skipBaseline: Boolean(true),
} satisfies Config

const DIR_PATH = path.join(path.resolve(), 'packages', 'schema', 'test')
const PATH = {
  target: path.join(DIR_PATH, 'types'),
} as const satisfies Record<string, string>

const SKIP_BASELINE = [
  `bench.baseline(() => void {})`,
]
const BASELINE = [
  ``
]

const IMPORTS = [
  `import { bench } from "@ark/attest"`,
  `import { t } from "@traversable/schema"`,
  `import { type as arktype } from "arktype"`,
  `import { z } from 'zod4'`
]

const RET = (numberOfLines = 1) => '\r\n'.repeat(numberOfLines)
const TAB = (numberOfSpaces: number) => (line: string) => ' '.repeat(numberOfSpaces) + line
const createFileName = ($: Options) => ''
  + $.schemaName
  + ($.skipBaseline ? '--no-baseline' : '')
  + `${$.schemaName}${$.skipBaseline ? '--no-baseline' : ''}--${new Date().toISOString()}.bench.types.ts`

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
}, 3, 'tuple')

const traversableTemplate = ($: Config & { t: string }, index: number) => ''
  + `bench("@traversable/schema: ${$.schemaName} #${index + 1} ${SKIP_BASELINE ? '(no baseline)' : ''}", () =>`
  + RET()
  + TAB(2)($.t)
  + RET()
  + `).types`
  + RET()
  + TAB(2)(`()`)

const arktypeTemplate = ($: Config & { ark: string }, index: number) => ''
  + `bench("arktype: ${$.schemaName} #${index + 1} ${SKIP_BASELINE ? '(no baseline)' : ''}", () =>`
  + RET()
  + TAB(2)($.ark)
  + RET()
  + `).types`
  + RET()
  + TAB(2)(`()`)

const zod4Template = ($: Config & { zod4: string }, index: number) => ''
  + `bench("zod@4: ${$.schemaName} #${index + 1} ${SKIP_BASELINE ? '(no baseline)' : ''}", () =>`
  + RET()
  + TAB(2)($.zod4)
  + RET()
  + `).types`
  + RET()
  + TAB(2)(`()`)

function createBenchmarks($: Config) {
  const schemas = fc.sample(SchemaGenerator, $.benchmarkCount)
  const t = (ix: number) => recurse.toString(schemas[ix])
  const ark = (ix: number) => Ark.stringFromTraversable({ namespaceAlias: 'arktype' })(schemas[ix])
  const zod4 = (ix: number) => Zod4.stringFromTraversable({ namespaceAlias: 'z', object: { preferInterface: true } })(schemas[ix])
  const benchmarks = Array.from(
    { length: $.benchmarkCount },
    (_, ix) => ''
      + `\r\n////////////////${'/'.repeat(`#${ix + 1}`.length)}//////`
      + `\r\n///// benchmark #${ix + 1} /////\r\n`
      + traversableTemplate({ ...$, t: t(ix) }, ix)
      + RET(2)
      + arktypeTemplate({ ...$, ark: ark(ix) }, ix)
      + RET(2)
      + zod4Template({ ...$, zod4: zod4(ix) }, ix)
      + `\r\n///// benchmark #${ix + 1} /////`
      + `\r\n////////////////${'/'.repeat(`#${ix}`.length)}//////`
      + RET(2)
  )

  return ''
    + IMPORTS.join('\r\n')
    + RET(2)
    + ($.skipBaseline ? SKIP_BASELINE.join('\n') : BASELINE.join('\n'))
    + RET(2)
    + benchmarks.join(RET())
    + RET()
}

// function generateBenchmark($?: Options) {
//   const schema = fc.sample(SchemaGenerator, 1)[0]
//   const t = typeof $?.t === 'string' ? $.t : recurse.toString(schema)
//   const ark = typeof $?.ark === 'string' ? $.ark : Ark.schemaToArkString(schema)
//   const schemaName = typeof $?.schemaName === 'string' ? $.schemaName : 'TMP'
//   const skipBaseline = typeof $?.skipBaseline === 'boolean' ? $.skipBaseline : true
//   return createBenchmark({
//     t,
//     ark,
//     schemaName,
//     skipBaseline
//   })
// }

function writeBenchmark(options?: Options) {
  console.log('RUNNING')
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
  // vi.it('〖⛳️〗‹ ❲createBenchmark❳', () => {
  //   vi.expect(createBenchmark({
  //     ark: `arktype({ a: "boolean", "b?": "number" })`,
  //     t: `t.object({ a: t.boolean, b: t.optional(t.number) })`,
  //     schemaName: 'TMP',
  //     skipBaseline: true,
  //   })).toMatchInlineSnapshot
  //     (`
  //     "import { bench } from "@ark/attest"
  //     import { t } from "@traversable/schema"
  //     import { type as arktype } from "arktype"

  //     bench.baseline(() => void {})

  //     bench("@traversable/schema: TMP (no baseline)", () =>
  //       t.object({ a: t.boolean, b: t.optional(t.number) })
  //     ).types
  //       ()

  //     bench("arktype: TMP (no baseline)", () =>
  //       arktype({ a: "boolean", "b?": "number" })
  //     ).types
  //       ()
  //     "
  //   `)
  // })

  // vi.it('〖⛳️〗‹ ❲generateBenchmark❳', () => {
  //   vi.expect(generateBenchmark()).toMatchInlineSnapshot
  //     (`
  //     "import { bench } from "@ark/attest"
  //     import { t } from "@traversable/schema"
  //     import { type as arktype } from "arktype"

  //     bench.baseline(() => void {})

  //     bench("@traversable/schema: tmp (no baseline)", () =>
  //       t.tuple(t.record(t.record(t.object({ $$j$$KH: t.void }))), t.tuple(t.boolean))
  //     ).types
  //       ()

  //     bench("arktype: tmp (no baseline)", () =>
  //       arktype([arktype.Record("string", arktype.Record("string", arktype({ "$$j$$KH": arktype.undefined }))), arktype([arktype.boolean])])
  //     ).types
  //       ()
  //     "
  //   `)
  // })

  vi.it('〖⛳️〗‹ ❲writeBenchmark❳', () => {
    writeBenchmark()
  })
})

