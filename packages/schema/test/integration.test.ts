import * as vi from 'vitest'
import { fc } from '@fast-check/vitest'
import * as path from 'node:path'
import * as fs from 'node:fs'

import { t, Seed } from '@traversable/schema'

const NUM_RUNS = 1000
const OPTIONS = {
  sortBias: {
    any: -1,
    array: 0,
    bigint: 0,
    boolean: 0,
    intersect: 0,
    never: -1,
    null: 0,
    number: 0,
    object: 1,
    optional: 1,
    record: 0,
    string: 0,
    symbol: 0,
    tree: 0,
    tuple: 1,
    undefined: 0,
    union: 0,
    unknown: -1,
    void: -1,
  },
  object: {
    max: 10,
  }
} satisfies Seed.Constraints

export const DIR = path.join(path.resolve(), 'packages', 'schema', 'test', '__generated__')
export const PATH = {
  dir: DIR,
  target: {
    schemas: path.join(DIR, 'schemas.ts'),
  }
} as const

if (!fs.existsSync(PATH.dir)) fs.mkdirSync(PATH.dir)

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/guard❳: integration tests', () => {
  const imports = [
    `import * as vi from 'vitest'`,
    `import { t } from '@traversable/schema'`
  ] as const satisfies string[]
  const gen = fc.sample(Seed.schema(), NUM_RUNS)

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
  ].join('\n') + '\n'
  )

  // const types = gen.map((schema) => t.toTypeString(schema))
  const out = [
    ...imports,
    '\n',
    ...deps,
    '\n',
    ...schemas
  ].join('\r')
  fs.writeFileSync(PATH.target.schemas, out)

  vi.it('〖⛳️〗› ❲@traverable/guard❳: it writes', () => {
    vi.assert.isTrue(fs.existsSync(PATH.target.schemas))
  })
})
