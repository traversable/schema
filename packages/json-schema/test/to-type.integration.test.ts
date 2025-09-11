import * as vi from 'vitest'
import * as fc from 'fast-check'
import * as path from 'node:path'
import * as fs from 'node:fs'
import { JsonSchema } from '@traversable/json-schema'
import * as JsonSchemaTest from '@traversable/json-schema-test'
import prettier from '@prettier/sync'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

const NUM_RUNS = 100
export const DIR = path.join(path.resolve(), 'packages', 'json-schema', 'test', '__generated__')
export const PATH = {
  dir: DIR,
  target: path.join(DIR, 'to-type.generated.ts'),
} as const

if (!fs.existsSync(PATH.dir)) fs.mkdirSync(PATH.dir)
if (!fs.existsSync(PATH.target)) fs.writeFileSync(PATH.target, '')

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/json-schema❳: integration tests', () => {
  const seeds = fc.sample(JsonSchemaTest.SeedGenerator()['*'], NUM_RUNS)
  const schemas = seeds.map((seed) => JsonSchemaTest.seedToSchema(seed))
  const types = schemas.flatMap((schema, ix) => {
    return [
      `declare const test_${ix}: toType<${JSON.stringify(schema, null, 2)}>`,
      null,
      `assertType(equals<${JsonSchema.toType(schema).result}>()(test_${ix}))`,
      null,
    ]
  })

  const content = [
    `import * as vi from 'vitest'`,
    `import { toType } from '@traversable/json-schema-types'`,
    null,
    'const assertType = vi.assertType<true>',
    'declare function equals<S>(): <const T>(x: T) => Equals<S, T>',
    'type Equals<S, T> =',
    '  (<F>() => F extends S ? true : false) extends',
    '  (<F>() => F extends T ? true : false) ? true : false',
    null,
    ...types,
  ].join('\n')

  vi.test('〖⛳️〗› ❲@traverable/zod❳: it writes', () => {
    vi.assert.isTrue(fs.existsSync(PATH.target))
    fs.writeFileSync(PATH.target, format(content))
    vi.assert.isTrue(fs.existsSync(PATH.target))
  })
})
