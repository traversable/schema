import { Object_keys } from '@traversable/registry'
import type { z } from 'zod'

export type AnyTypeName = Exclude<z.core.$ZodType['_zod']['def']['type'], 'function'>
export type TypeName = { [K in AnyTypeName]: K }
export const TypeName = {
  any: 'any',
  array: 'array',
  bigint: 'bigint',
  boolean: 'boolean',
  catch: 'catch',
  custom: 'custom',
  date: 'date',
  default: 'default',
  enum: 'enum',
  file: 'file',
  int: 'int',
  intersection: 'intersection',
  lazy: 'lazy',
  literal: 'literal',
  map: 'map',
  nan: 'nan',
  never: 'never',
  nonoptional: 'nonoptional',
  null: 'null',
  nullable: 'nullable',
  number: 'number',
  object: 'object',
  optional: 'optional',
  pipe: 'pipe',
  prefault: 'prefault',
  promise: 'promise',
  readonly: 'readonly',
  record: 'record',
  set: 'set',
  string: 'string',
  success: 'success',
  symbol: 'symbol',
  template_literal: 'template_literal',
  transform: 'transform',
  tuple: 'tuple',
  undefined: 'undefined',
  union: 'union',
  unknown: 'unknown',
  void: 'void',
} satisfies TypeName

export const TypeNames = Object_keys(TypeName)
