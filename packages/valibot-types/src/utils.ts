import type { V } from './functor.js'
import { has } from '@traversable/registry'
import { Tag } from './typename.js'

export function tagged<K extends keyof Tag>(tag: K): <S>(u: unknown) => u is V.lookup<K, S>
export function tagged<K extends keyof Tag>(tag: K) {
  return has('type', (type): type is unknown => type === Tag[tag])
}

export const nullaryTags = [
  'any',
  'bigint',
  'boolean',
  'blob',
  'boolean',
  'custom',
  'date',
  'enum',
  'file',
  'function',
  'instance',
  'literal',
  'nan',
  'never',
  'null',
  'number',
  'picklist',
  'promise',
  'string',
  'symbol',
  'undefined',
  'unknown',
  'void',
] as const satisfies V.Nullary['type'][]

export function isNullary(x: unknown): x is V.Nullary
export function isNullary(x: unknown) {
  return has('type', (type): type is unknown => nullaryTags.includes(type as never))(x)
}
