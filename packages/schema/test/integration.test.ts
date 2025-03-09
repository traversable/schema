import * as vi from 'vitest'
import { fc } from '@fast-check/vitest'
import * as path from 'node:path'
import * as fs from 'node:fs'

import { t, Seed } from '@traversable/schema'

const NUM_RUNS = 1000
const OPTIONS = {
  exclude: ['eq'],
  object: {
    max: 10,
  }
} satisfies Seed.Constraints

export const DIR = path.join(path.resolve(), 'packages', 'schema', 'test', '__generated__')
export const PATH = {
  dir: DIR,
  target: {
    schemas: path.join(DIR, 'schemas.ts'),
    toString: path.join(DIR, 'toString.ts'),
  }
} as const

if (!fs.existsSync(PATH.dir)) fs.mkdirSync(PATH.dir)
if (!fs.existsSync(PATH.target.schemas)) fs.writeFileSync(PATH.target.schemas, '')
if (!fs.existsSync(PATH.target.toString)) fs.writeFileSync(PATH.target.toString, '')

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema❳: integration tests', () => {
  const imports = [
    `import * as vi from 'vitest'`,
    `import { t } from '@traversable/schema'`
  ] as const satisfies string[]
  const gen = fc.sample(Seed.schema<t.Fixpoint>(OPTIONS), NUM_RUNS)

  const deps = [
    'type Equals<S, T> =',
    '  (<F>() => F extends S ? true : false) extends',
    '  (<F>() => F extends T ? true : false) ? true : false',
    '\n',
    'declare function equals<S>(): <const T>(x: T) => Equals<S, T>',
  ] as const satisfies string[]

  const schemas = gen.map((schema, ix) => [
    `const _${ix + 1} = ${t.toString(schema)}`,
    `//    ^?`,
    `type _${ix + 1} = ${t.toTypeString(schema)}`,
    `vi.assertType<true>(equals<_${ix + 1}>()(_${ix + 1}._type))`,
  ].join('\n') + '\n')

  const toStrings = gen.map((schema, ix) => {
    return [
      `const schema_${ix + 1} = ${t.toString(schema)}._type`,
      `//    ^?`,
      `type toString_${ix + 1} = ${schema.toString()}`,
      `vi.assertType<true>(equals<toString_${ix + 1}>()(schema_${ix + 1}))`,
    ].join('\n') + '\n'
  })

  const schemasOut = [
    ...imports,
    '\n',
    ...deps,
    '\n',
    ...schemas,
  ].join('\r')

  const toStringsOut = [
    ...imports,
    '\n',
    ...deps,
    '\n',
    ...toStrings,
  ].join('\r')

  fs.writeFileSync(PATH.target.schemas, schemasOut)
  fs.writeFileSync(PATH.target.toString, toStringsOut)

  vi.it('〖⛳️〗› ❲@traverable/schema❳: it writes', () => {
    vi.assert.isTrue(fs.existsSync(PATH.target.schemas))
    vi.assert.isTrue(fs.existsSync(PATH.target.toString))
  })
})
