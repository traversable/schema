import * as vi from 'vitest'
import { fc } from '@fast-check/vitest'
import * as path from 'node:path'
import * as fs from 'node:fs'
import { vx } from '@traversable/valibot'
import { vxTest } from '@traversable/valibot-test'

const NUM_RUNS = 100
// const NUM_RUNS = 10_000

const EXCLUDE = [
  ...vx.toType.unsupported,
] satisfies vxTest.GeneratorOptions['exclude']
const OPTIONS = { exclude: EXCLUDE } satisfies vxTest.GeneratorOptions

export const DIR = path.join(path.resolve(), 'packages', 'valibot', 'test', '__generated__')
export const PATH = {
  dir: DIR,
  target: {
    types: path.join(DIR, 'to-type.generated.ts'),
    interfaces: path.join(DIR, 'to-interface.generated.ts')
  }
} as const

if (!fs.existsSync(PATH.dir)) fs.mkdirSync(PATH.dir)
if (!fs.existsSync(PATH.target.types)) fs.writeFileSync(PATH.target.types, '')
if (!fs.existsSync(PATH.target.interfaces)) fs.writeFileSync(PATH.target.interfaces, '')

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/valibot❳: vx.toType fuzz tests', () => {
  const imports = [
    `import * as vi from 'vitest'`,
    `import * as v from 'valibot'`
  ] as const satisfies string[]
  const seeds = fc.sample(vxTest.SeedGenerator(OPTIONS)['*'] as never, NUM_RUNS)
  const gen = seeds.map((seed) => vxTest.seedToSchema(seed as never))

  const typeDeps = [
    'type Equals<S, T> =',
    '  (<F>() => F extends S ? true : false) extends',
    '  (<F>() => F extends T ? true : false) ? true : false',
    '\n',
    'declare function equals<S>(): <const T>(x: T) => Equals<S, T>',
  ] as const satisfies string[]

  const interfaceDeps = [
    'type Equals<S, T> = [S, T] extends [T, S] ? true : false',
    'declare function equals<S>(): <const T>(x: T) => Equals<S, T>',
  ] as const satisfies string[]

  const types = gen.map((schema, ix) => {
    const string = vx.toString(schema as never)
    const TYPE = vx.toType(schema as never, { typeName: `_${ix + 1}` })
    return [
      `const _${ix + 1} = ${string}`,
      `//    ^?`,
      TYPE,
      `vi.assertType<true>(equals<_${ix + 1}>()(_${ix + 1}['~types']!.output))`,
    ].join('\n') + '\n'
  })

  const interfaces = gen.map((schema, ix) => {
    const string = vx.toString(schema as never)
    const INTERFACE = vx.toType(schema as never, { typeName: `_${ix + 1}`, preferInterface: true, includeNewtypeDeclaration: false })
    return [
      `const _${ix + 1} = ${string}`,
      `//    ^?`,
      INTERFACE,
      `vi.assertType<true>(equals<_${ix + 1}>()(_${ix + 1}['~types']!.output))`,
    ].join('\n') + '\n'
  })

  const typesOut = [
    ...imports,
    '\n',
    ...typeDeps,
    '\n',
    ...types,
  ].join('\r')

  const interfacesOut = [
    ...imports,
    `import type { newtype } from '@traversable/registry'`,
    '\n',
    ...interfaceDeps,
    '\n',
    ...interfaces,
  ].join('\r')

  vi.it('〖⛳️〗› ❲@traverable/valibot❳: it writes', () => {
    vi.assert.isTrue(fs.existsSync(PATH.target.types))
    fs.writeFileSync(PATH.target.types, typesOut)
    vi.assert.isTrue(fs.existsSync(PATH.target.interfaces))
    fs.writeFileSync(PATH.target.interfaces, interfacesOut)
  })
})


