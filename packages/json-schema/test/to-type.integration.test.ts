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
  const types = schemas.map((schema, ix) => {
    return [
      `type Type_${ix} = ${JsonSchema.toType(schema)}`,
      `declare const term_${ix}: ${JSON.stringify(schema, null, 2)}`,
      `declare const test_${ix}: JsonSchema.toType<typeof term_${ix}>`,
      ``,
      `vi.assertType<true>(equals<Type_${ix}>()(test_${ix}))`,
    ].filter((_) => _ !== null).join('\n')
  }).join('\n\n\n')

  const content = [
    `import * as vi from 'vitest'`,
    `import { JsonSchema } from '@traversable/json-schema'`,
    ``,
    'type Equals<S, T> =',
    '  (<F>() => F extends S ? true : false) extends',
    '  (<F>() => F extends T ? true : false) ? true : false',
    'declare function equals<S>(): <const T>(x: T) => Equals<S, T>',
    '',
    types,
  ].join('\n')

  vi.it('〖⛳️〗› ❲@traverable/zod❳: it writes', () => {
    vi.assert.isTrue(fs.existsSync(PATH.target))
    fs.writeFileSync(PATH.target, format(content))
  })
})
