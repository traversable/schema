import { Object_keys } from '@traversable/registry'

export type TypeName = typeof TypeName[keyof typeof TypeName]
export const TypeName = {
  never: 'Never',
  any: 'Any',
  unknown: 'Unknown',
  void: 'Void',
  null: 'Null',
  undefined: 'Undefined',
  symbol: 'Symbol',
  boolean: 'Boolean',
  integer: 'Integer',
  bigInt: 'BigInt',
  number: 'Number',
  string: 'String',
  literal: 'Literal',
  anyOf: 'anyOf',
  allOf: 'allOf',
  optional: 'Optional',
  array: 'Array',
  record: 'Record',
  tuple: 'Tuple',
  object: 'Object',
  date: 'Date',
} as const

export const TypeNames = Object_keys(TypeName)

