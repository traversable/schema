import * as vi from 'vitest'
import { fc } from '@fast-check/vitest'
import * as path from 'node:path'
import * as fs from 'node:fs'

import { recurse } from '@traversable/schema'
import { Seed } from '@traversable/schema-seed'
import '@traversable/schema-to-string/install'

const NUM_RUNS = 1000
const OPTIONS = {
  exclude: ['eq'],
  object: {
    max: 10,
    min: 5,
  },
  tuple: {
    minLength: 5,
    maxLength: 10,
  },
  sortBias: {
    string: 9,
    object: 8,
    optional: 1,
  }
} satisfies Seed.Constraints<'eq'>

export const DIR = path.join(path.resolve(), 'packages', 'schema-to-string', 'test', '__generated__')
export const PATH = {
  dir: DIR,
  target: {
    schemas: path.join(DIR, 'schemas.gen.ts'),
    toString: path.join(DIR, 'toString.gen.ts'),
  }
} as const

if (!fs.existsSync(PATH.dir)) fs.mkdirSync(PATH.dir)
if (!fs.existsSync(PATH.target.schemas)) fs.writeFileSync(PATH.target.schemas, '')
if (!fs.existsSync(PATH.target.toString)) fs.writeFileSync(PATH.target.toString, '')

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema❳: integration tests', () => {
  // void bindToStrings()

  const imports = [
    `import * as vi from 'vitest'`,
    `import { t } from '@traversable/schema'`
  ] as const satisfies string[]
  const gen = fc.sample(Seed.schema(OPTIONS), NUM_RUNS)

  const deps = [
    'type Equals<S, T> =',
    '  (<F>() => F extends S ? true : false) extends',
    '  (<F>() => F extends T ? true : false) ? true : false',
    '\n',
    'declare function equals<S>(): <const T>(x: T) => Equals<S, T>',
  ] as const satisfies string[]

  const schemas = gen.map((schema, ix) => {
    const string = recurse.toString(schema as never);
    const typeString = recurse.toTypeString(schema as never);
    return [
      `const _${ix + 1} = ${string}`,
      `//    ^?`,
      `type _${ix + 1} = ${typeString}`,
      `vi.assertType<true>(equals<_${ix + 1}>()(_${ix + 1}._type))`,
    ].join('\n') + '\n'
  })

  const toStrings = gen.map((schema, ix) => {
    const string = recurse.toString(schema);
    return [
      `const schema_${ix + 1} = ${string}._type`,
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
