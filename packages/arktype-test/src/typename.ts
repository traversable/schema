import { Object_keys } from '@traversable/registry'

export type AnyTypeName = TypeName[keyof TypeName]
export type TypeName = typeof TypeName
export const TypeName = {
  string: 'string',
  number: 'number',
  bigint: 'bigint',
  symbol: 'symbol',
  null: 'null',
  undefined: 'undefined',
  boolean: 'boolean',
  object: 'object',
  optional: 'optional',
  array: 'array',
  tuple: 'tuple',
  record: 'record',
  date: 'date',
  unknown: 'unknown',
  never: 'never',
  intersection: 'intersection',
  union: 'union',
  enum: 'enum',
  literal: 'literal',
} as const

export const TypeNames = Object_keys(TypeName)
