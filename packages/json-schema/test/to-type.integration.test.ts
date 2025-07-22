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

const TYPELEVEL = [
  `type Intersect<S, Out = unknown> = S extends [infer H, ...infer T] ? Intersect<T, Out & ToType<H>> : Out`,
  ``,
  `type ToType<S>`,
  `  = [keyof S] extends [never] ? unknown`,
  `  : S extends { anyOf: infer T extends readonly any[] }`,
  `  ? T[number] extends infer R ? R extends R ? ToType<R> : never : never`,
  `  : S extends { allOf: infer T } ? Intersect<T>`,
  `  : S extends { type: 'null' } ? null`,
  `  : S extends { type: 'boolean' } ? boolean`,
  `  : S extends { type: 'integer' } ? number`,
  `  : S extends { type: 'number' } ? number`,
  `  : S extends { type: 'string' } ? string`,
  `  : S extends { const: any } ? S['const']`,
  `  : S extends { enum: readonly any[] } ? S['enum'][number]`,
  `  : S extends { type: 'array', items: false, prefixItems: infer T } ? { [I in keyof T]: ToType<S> }`,
  `  : S extends { type: 'array', items: any, prefixItems: readonly any[] }`,
  `  ? [...S['prefixItems'], ...S['items'][]] extends infer T`,
  `  ? { [I in keyof T]: ToType<T[I]> }`,
  `  : never`,
  `  : S extends { type: 'array', prefixItems: infer T } ? { [I in keyof T]: ToType<T[I]> }`,
  `  : S extends { type: 'array', items: infer T } ? ToType<T>[]`,
  `  : S extends { type: 'object', additionalProperties: infer R, patternProperties: infer T } ?`,
  `  & Record<string, ToType<R>>`,
  `  & Record<keyof T, ToType<T[keyof T]>>`,
  `  : S extends { type: 'object', additionalProperties: infer R } ? Record<string, ToType<R>>`,
  `  : S extends { type: 'object', patternProperties: infer T } ? Record<keyof T, ToType<T[keyof T]>>`,
  `  : S extends { type: 'object', properties: infer T, required: infer KS extends string[] } ?`,
  `  Force<`,
  `    & { [K in keyof T as K extends KS[number] ? K : never]-?: ToType<T[K]> }`,
  `    & { [K in keyof T as K extends KS[number] ? never : K]+?: ToType<T[K]> }`,
  `  >`,
  `  : never`,
].join('\n')

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/json-schema❳: integration tests', () => {
  const seeds = fc.sample(JsonSchemaTest.SeedGenerator()['*'], NUM_RUNS)
  const schemas = seeds.map((seed) => JsonSchemaTest.seedToSchema(seed))
  const types = schemas.map((schema, ix) => {
    return [
      `type Type_${ix} = ${JsonSchema.toType(schema)}`,
      `declare const term_${ix}: ${JSON.stringify(schema, null, 2)}`,
      `declare const test_${ix}: ToType<typeof term_${ix}>`,
      ``,
      `vi.assertType<true>(equals<Type_${ix}>()(test_${ix}))`,
    ].filter((_) => _ !== null).join('\n')
  }).join('\n\n')

  const content = [
    `import * as vi from 'vitest'`,
    `import type { Force } from '@traversable/registry'`,
    ``,
    TYPELEVEL,
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
