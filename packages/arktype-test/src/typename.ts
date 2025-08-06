import { Object_keys } from '@traversable/registry'

export type AnyTypeName = TypeName[keyof TypeName]
export type TypeName = typeof TypeName
export const TypeName = {
  string: 'string',
  number: 'number',
  null: 'null',
  boolean: 'boolean',
  object: 'object',
  optional: 'optional',
  array: 'array',
  tuple: 'tuple',
  record: 'record',
  unknown: 'unknown',
  never: 'never',
  intersection: 'intersection',
  union: 'union',
  enum: 'enum',
  literal: 'literal',
  // bigint: 'bigint',
  // date: 'date',
  // symbol: 'symbol',
  // undefined: 'undefined',
} as const

export const TypeNames = Object_keys(TypeName)
