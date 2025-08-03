import { Object_keys } from '@traversable/registry'

export type AnyTag = Tag[keyof Tag]
export type Tag = typeof Tag
export const Tag = {
  /// nullary
  any: 'any',
  bigint: 'bigint',
  blob: 'blob',
  boolean: 'boolean',
  custom: 'custom',
  date: 'date',
  file: 'file',
  function: 'function',
  NaN: 'nan',
  never: 'never',
  null: 'null',
  number: 'number',
  promise: 'promise',
  string: 'string',
  symbol: 'symbol',
  undefined: 'undefined',
  unknown: 'unknown',
  void: 'void',
  /// special cases
  enum: 'enum',
  instance: 'instance',
  literal: 'literal',
  picklist: 'picklist',
  lazy: 'lazy',
  /// unary
  array: 'array',
  exactOptional: 'exact_optional',
  nonNullable: 'non_nullable',
  nonNullish: 'non_nullish',
  nonOptional: 'non_optional',
  nullable: 'nullable',
  nullish: 'nullish',
  optional: 'optional',
  set: 'set',
  undefinedable: 'undefinedable',
  /// positional
  strictTuple: 'strict_tuple',
  tuple: 'tuple',
  union: 'union',
  variant: 'variant',
  looseTuple: 'loose_tuple',
  intersect: 'intersect',
  /// applicative
  strictObject: 'strict_object',
  object: 'object',
  looseObject: 'loose_object',
  /// binary
  record: 'record',
  map: 'map',
  tupleWithRest: 'tuple_with_rest',
  objectWithRest: 'object_with_rest',
} as const

export const Tags = Object_keys(Tag)
