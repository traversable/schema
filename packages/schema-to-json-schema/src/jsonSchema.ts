import type { Force, PickIfDefined, Returns } from '@traversable/registry'
import { fn, has, symbol as Sym } from '@traversable/registry'

import type { MinItems } from './items.js'
import { minItems } from './items.js'
import type { RequiredKeys } from './properties.js'
import { getSchema, isRequired, property, wrapOptional } from './properties.js'
import * as Spec from './specification.js'
import { t } from '@traversable/schema'

export type {
  Unary,
  Free,
  Nullary,
  NumericBounds,
} from './specification.js'
export {
  is,
  RAW,
} from './specification.js'
export {
  Functor,
  fold,
  unfold,
} from './functor.js'
export type { RequiredKeys } from './properties.js'
export {
  isRequired,
  property,
  wrapOptional,
} from './properties.js'
export type { MinItems } from './items.js'
export { minItems } from './items.js'


export type {
  JsonSchema,
  LowerBound,
  Schema,
}

/** @internal */
const Object_keys = globalThis.Object.keys

/** @internal */
const isNumber = (u: unknown): u is number => typeof u === 'number'

type Nullable<T> = Force<T & { nullable: true }>

const getNumericBounds = (u: unknown): Spec.NumericBounds => ({
  ...has('minimum', t.number)(u) && { minimum: u.minimum },
  ...has('maximum', t.number)(u) && { maximum: u.maximum },
  ...has('exclusiveMinimum', t.number)(u) && { exclusiveMinimum: u.exclusiveMinimum },
  ...has('exclusiveMaximum', t.number)(u) && { exclusiveMaximum: u.exclusiveMaximum },
})

type JsonSchema<T = never> = [T] extends [never] ? Spec.JsonSchema : Spec.Unary<T>
type StringBounds<T> = Force<{ type: 'string' } & PickIfDefined<T, keyof Spec.SizeBounds>>
type NumberBounds<T> = Force<{ type: 'number' } & PickIfDefined<T, keyof Spec.NumericBounds>>
type IntegerBounds<T> = Force<{ type: 'integer' } & PickIfDefined<T, keyof Spec.NumericBounds>>
type ArrayBounds<S, T> = Force<{ type: 'array', items: Returns<S['toJsonSchema' & keyof S]> } & PickIfDefined<T, keyof Spec.SizeBounds>>

export function applyTupleOptionality(xs: readonly unknown[], { min, max }: { min: number, max: number }): readonly unknown[] {
  return min === max ? xs.map(getSchema) : [
    ...xs.slice(0, min).map(getSchema),
    ...xs.slice(min).map(getSchema),
  ]
}

interface LowerBound { toJsonSchema(): JsonSchema | undefined }
interface Schema { toJsonSchema?(): any }

/* * * * * * * * * * * * * * * * * * *
 *                                   *
 *   no JSON Schema representation   *
 *                                   *
 * * * * * * * * * * * * * * * * * * */

export {
  Empty as never,
  Empty as void,
  Empty as symbol,
  Empty as undefined,
  Empty as bigint,
}

export function empty() {
  return void 0 as never
}

const Empty = { toJsonSchema: empty }

interface Empty { toJsonSchema(): undefined }

export interface inline<S> { toJsonSchema: () => void }
export function inline<S>(_: S): inline<S> { return Empty }

/* * * * * * * * *
 *                *
 *   data types   *
 *                *
  * * * * * * * * */

export type { any_ as any }
interface any_ { toJsonSchema(): typeof Spec.RAW.any }

export type { unknown_ as unknown }
interface unknown_ { toJsonSchema(): typeof Spec.RAW.any }

export type { null_ as null }
interface null_ { toJsonSchema(): typeof Spec.RAW.null }

export { boolean_ as boolean }
interface boolean_ { toJsonSchema(): typeof Spec.RAW.boolean }
const boolean_ = () => Spec.RAW.boolean

export interface integer { toJsonSchema(): IntegerBounds<this> }
export function integer(schema: t.integer) {
  const { exclusiveMaximum, exclusiveMinimum, maximum, minimum } = getNumericBounds(schema)
  let bounds: Spec.NumericBounds = {}
  if (typeof exclusiveMinimum === 'number') bounds.exclusiveMinimum = exclusiveMinimum
  if (typeof exclusiveMaximum === 'number') bounds.exclusiveMaximum = exclusiveMaximum
  if (typeof minimum === 'number') bounds.minimum = minimum
  if (typeof maximum === 'number') bounds.maximum = maximum
  return {
    ...Spec.RAW.integer,
    ...bounds,
  }
}

export { number_ as number }
interface number_ { toJsonSchema(): NumberBounds<this> }
function number_(schema: t.number) {
  const { exclusiveMaximum, exclusiveMinimum, maximum, minimum } = getNumericBounds(schema)
  let bounds: Spec.NumericBounds = {}
  if (typeof exclusiveMinimum === 'number') bounds.exclusiveMinimum = exclusiveMinimum
  if (typeof exclusiveMaximum === 'number') bounds.exclusiveMaximum = exclusiveMaximum
  if (typeof minimum === 'number') bounds.minimum = minimum
  if (typeof maximum === 'number') bounds.maximum = maximum
  return {
    ...Spec.RAW.number,
    ...bounds,
  }
}

export { string_ as string }
interface string_ { toJsonSchema(): StringBounds<this> }
function string_(schema: t.string) {
  const minLength = has('minLength', isNumber)(schema) ? schema.minLength : null
  const maxLength = has('maxLength', isNumber)(schema) ? schema.maxLength : null
  let out: Partial<Spec.SizeBounds & { type: 'string' }> = { ...Spec.RAW.string }
  minLength && void (out.minLength = minLength)
  maxLength && void (out.maxLength = maxLength)
  return out as never
}

export interface eq<S> { toJsonSchema(): { const: S } }
export function eq<V>(value: V) { return { const: value } }

export interface optional<S> {
  toJsonSchema: {
    [Sym.optional]: number
    (): Nullable<Returns<S['toJsonSchema' & keyof S]>>
  }
}

export function optional<T>(x: T): optional<T>
export function optional(x: unknown) {
  function toJsonSchema() { return getSchema(x) }
  toJsonSchema[Sym.optional] = wrapOptional(x)
  return {
    toJsonSchema,
  }
}

export function optionalProto<T>(child: T) {
  (optionalProto as any)[Sym.optional] = wrapOptional(child)
  return {
    ...getSchema(child),
    nullable: true
  }
}

export interface array<S> { toJsonSchema(): ArrayBounds<S, this> }

export function array<T, Min extends number, Max extends number>(
  itemsType: T,
  bounds?: { minLength?: Min, maxLength?: Max }
): ArrayBounds<T, { minLength: Min, maxLength: Max }>
//
export function array(child: unknown, { minLength, maxLength }: { minLength?: number, maxLength?: number } = {}) {
  return {
    type: 'array',
    items: getSchema(child),
    ...typeof minLength === 'number' && { minLength },
    ...typeof maxLength === 'number' && { maxLength },
  }
}

export interface record<S> {
  toJsonSchema(): {
    type: 'object'
    additionalProperties: Returns<S['toJsonSchema' & keyof S]>
  }
}

export function record<T>(additionalProperties: T): { type: 'object', additionalProperties: T }
export function record<T>(child: T) {
  return {
    type: 'object',
    additionalProperties: getSchema(child),
  }
}

export interface union<S> {
  toJsonSchema(): {
    anyOf: { [I in keyof S]: Returns<S[I]['toJsonSchema' & keyof S[I]]> }
  }
}

export function union<T extends readonly unknown[]>(children: T) {
  return {
    anyOf: children.map(getSchema)
  }
}

export interface intersect<T> {
  toJsonSchema(): {
    allOf: { [I in keyof T]: Returns<T[I]['toJsonSchema' & keyof T[I]]> }
  }
}

export function intersect<T extends readonly unknown[]>(children: T) {
  return {
    allOf: children.map(getSchema)
  }
}

export interface tuple<S> {
  toJsonSchema(): {
    type: 'array',
    items: { [I in keyof S]: Returns<S[I]['toJsonSchema' & keyof S[I]]> }
    additionalItems: false
    minItems: MinItems<S>
    maxItems: S['length' & keyof S]
  }
}

export function tuple<T extends readonly unknown[]>(children: T) {
  const min = minItems(children)
  const max = children.length
  return {
    type: 'array' as const,
    additionalItems: false as const,
    items: applyTupleOptionality(children, { min, max }) as never,
    minItems: min as never,
    maxItems: max,
  }
}

export { object_ as object }
interface object_<T, KS extends RequiredKeys<T> = RequiredKeys<T>> {
  toJsonSchema(): {
    type: 'object'
    required: { [I in keyof KS]: KS[I] & string }
    properties: { [K in keyof T]: Returns<T[K]['toJsonSchema' & keyof T[K]]> }
  }
}

function object_<T extends { [x: string]: unknown }, KS extends RequiredKeys<T>>(children: T): {
  type: 'object'
  required: { [I in keyof KS]: KS[I] & string }
  properties: { [K in keyof T]: Returns<T[K]['toJsonSchema' & keyof T[K]]> }
} {
  const required = Object_keys(children).filter(isRequired(children))
  return {
    type: 'object',
    required,
    properties: fn.map(children, (v, k) => property(required)(v, k as number | string)),
  } as never
}
