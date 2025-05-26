import { z } from 'zod/v4'
import { has, Object_keys } from '@traversable/registry'

import type { Z } from './functor.js'

export type HasTypeName<T = unknown> = { _zod: { def: { type: T } } }

export { typeOf as typeof }
/** 
 * ## {@link typeOf `v4.typeof`}
 * 
 * Extract the type (previously called 'typeName') from a zod@4 schema.
 */
const typeOf
  : <T>(hasType: HasTypeName<T>) => T
  = (x) => x._zod.def.type

const hasTypeName = (typeName: AnyTypeName) => has('_zod', 'def', 'type', (type): type is never => type === typeName)

export type AnyTypeName = Exclude<z.ZodType['_zod']['def']['type'], 'interface'>
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

export const tagged: {
  <K extends AnyTypeName>(tag: K): <S>(x: unknown) => x is Z.Lookup<K, S>
  <K extends AnyTypeName>(tag: K, x: unknown): x is Z.ZodLookup<K, z.ZodType>
} = <never>((tag: AnyTypeName, x?: unknown) => x === undefined ? hasTypeName(tag) : hasTypeName(tag)(x))

export const TypeNames = Object_keys(TypeName)

export const NS = '@traversable/schema-zod-adapter::' as const

export type Sym = typeof Sym
export const Sym = {
  array: Symbol.for(`${NS}array`),
  catch: Symbol.for(`${NS}catch`),
  custom: Symbol.for(`${NS}custom`),
  default: Symbol.for(`${NS}default`),
  intersectionLeft: Symbol.for(`${NS}intersectionLeft`),
  intersectionRight: Symbol.for(`${NS}intersectionRight`),
  lazy: Symbol.for(`${NS}lazy`),
  literal: Symbol.for(`${NS}literal`),
  // map: Symbol.for(`${NS}map`),
  mapKey: Symbol.for(`${NS}mapKey`),
  mapValue: Symbol.for(`${NS}mapValue`),
  nonoptional: Symbol.for(`${NS}nonoptional`),
  null: Symbol.for(`${NS}null`),
  nullable: Symbol.for(`${NS}nullable`),
  object: Symbol.for(`${NS}object`),
  optional: Symbol.for(`${NS}optional`),
  pipe: Symbol.for(`${NS}pipe`),
  prefault: Symbol.for(`${NS}prefault`),
  promise: Symbol.for(`${NS}promise`),
  readonly: Symbol.for(`${NS}readonly`),
  // record: Symbol.for(`${NS}record`),
  recordKey: Symbol.for(`${NS}recordKey`),
  recordValue: Symbol.for(`${NS}recordValue`),
  set: Symbol.for(`${NS}set`),
  success: Symbol.for(`${NS}success`),
  transform: Symbol.for(`${NS}transform`),
  tuple: Symbol.for(`${NS}tuple`),
  union: Symbol.for(`${NS}union`),
}
