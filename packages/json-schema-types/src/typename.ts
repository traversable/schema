import { Object_keys } from '@traversable/registry'

export type TypeName = typeof TypeName[keyof typeof TypeName]
export const TypeName = {
  never: 'never',
  unknown: 'unknown',
  null: 'null',
  boolean: 'boolean',
  integer: 'integer',
  number: 'number',
  string: 'string',
  enum: 'enum',
  const: 'const',
  array: 'array',
  tuple: 'tuple',
  object: 'object',
  record: 'record',
  union: 'union',
  intersection: 'intersection',
} as const

export const TypeNames = Object_keys(TypeName)
