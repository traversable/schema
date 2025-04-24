/**  
 * array schema
 * made with ᯓᡣ𐭩 by @traversable/schema@0.0.35
 */
import type * as T from '@traversable/registry'
import type {
  Bounds,
  Equal,
  Integer,
  Unknown
} from '@traversable/registry'
import {
  _isPredicate,
  array as arrayOf,
  Array_isArray,
  bindUserExtensions,
  carryover,
  has,
  Math_max,
  Math_min,
  Number_isSafeInteger,
  Object_assign,
  Object_is,
  URI,
  within
} from '@traversable/registry'
import type { Guarded, Schema, SchemaLike } from '../_namespace.js'
import type { of } from './of.js'
import type { t } from '../_exports.js'
import type { SizeBounds } from '@traversable/schema-to-json-schema'
import { hasSchema } from '@traversable/schema-to-json-schema'
import type { ValidationError, ValidationFn, Validator } from '@traversable/derive-validators'
import { Errors, NullaryErrors } from '@traversable/derive-validators'
////////////////////
///    equals    ///
export type equals<T> = never | Equal<T['_type' & keyof T]>

export function equals<S extends { equals: Equal }>(arraySchema: array<S>): equals<typeof arraySchema>
export function equals<S extends t.Schema>(arraySchema: array<S>): equals<typeof arraySchema>
export function equals({ def }: array<{ equals: Equal }>): Equal<unknown[]> {
  let equals = has('equals', (x): x is Equal => typeof x === 'function')(def) ? def.equals : Object_is
  function arrayEquals(l: unknown[], r: unknown[]): boolean {
    if (Object_is(l, r)) return true
    if (Array_isArray(l)) {
      if (!Array_isArray(r)) return false
      let len = l.length
      if (len !== r.length) return false
      for (let ix = len; ix-- !== 0;)
        if (!equals(l[ix], r[ix])) return false
      return true
    } else return false
  }
  return arrayEquals
}
///    equals    ///
////////////////////
//////////////////////////
///    toJsonSchema    ///
export interface toJsonSchema<T> {
  (): never | T.Force<
    & { type: 'array', items: T.Returns<T['def' & keyof T]['toJsonSchema' & keyof T['def' & keyof T]]> }
    & T.PickIfDefined<T, keyof SizeBounds>
  >
}

export function toJsonSchema<T extends array<t.Schema>>(arraySchema: T): toJsonSchema<typeof arraySchema>
export function toJsonSchema<T extends { def: unknown }>(arraySchema: T): toJsonSchema<typeof arraySchema>
export function toJsonSchema(
  { def, minLength, maxLength }: { def: unknown, minLength?: number, maxLength?: number },
): () => {
  type: 'array'
  items: unknown
  minLength?: number
  maxLength?: number
} {
  function arrayToJsonSchema() {
    let items = hasSchema(def) ? def.toJsonSchema() : def
    let out = {
      type: 'array' as const,
      items,
      minLength,
      maxLength,
    }
    if (typeof minLength !== 'number') delete out.minLength
    if (typeof maxLength !== 'number') delete out.maxLength
    return out
  }
  return arrayToJsonSchema
}
///    toJsonSchema    ///
//////////////////////////
//////////////////////
///    toString    ///
export interface toString<T> {
  /* @ts-expect-error */
  (): never | `(${ReturnType<T['def']['toString']>})[]`
}

export function toString<S extends t.Schema>(arraySchema: array<S>): toString<typeof arraySchema>
export function toString<S>(arraySchema: array<S>): toString<typeof arraySchema>
export function toString({ def }: { def: unknown }) {
  function arrayToString() {
    let body = (
      !!def
      && typeof def === 'object'
      && 'toString' in def
      && typeof def.toString === 'function'
    ) ? def.toString()
      : '${string}'
    return ('(' + body + ')[]')
  }
  return arrayToString
}
///    toString    ///
//////////////////////
//////////////////////
///    validate    ///
export type validate<S> = never | ValidationFn<S['_type' & keyof S]>
export function validate<S extends Validator>(arraySchema: array<S>): validate<typeof arraySchema>
export function validate<S extends t.Schema>(arraySchema: array<S>): validate<typeof arraySchema>
export function validate(
  { def: { validate = () => true }, minLength, maxLength }: array<Validator>
) {
  validateArray.tag = URI.array
  function validateArray(u: unknown, path = Array.of<keyof any>()) {
    if (!Array.isArray(u)) return [NullaryErrors.array(u, path)]
    let errors = Array.of<ValidationError>()
    if (typeof minLength === 'number' && u.length < minLength) errors.push(Errors.arrayMinLength(u, path, minLength))
    if (typeof maxLength === 'number' && u.length > maxLength) errors.push(Errors.arrayMaxLength(u, path, maxLength))
    for (let i = 0, len = u.length; i < len; i++) {
      let y = u[i]
      let results = validate(y, [...path, i])
      if (results === true) continue
      else errors.push(...results)
    }
    return errors.length === 0 || errors
  }
  return validateArray
}
///    validate    ///
//////////////////////

/** @internal */
function boundedArray<S extends Schema>(schema: S, bounds: Bounds, carry?: Partial<array<S>>): ((u: unknown) => boolean) & Bounds<number> & array<S>
function boundedArray<S>(schema: S, bounds: Bounds, carry?: { [x: string]: unknown }): ((u: unknown) => boolean) & Bounds<number> & array<S>
function boundedArray<S extends Schema>(schema: S, bounds: Bounds, carry?: {}): ((u: unknown) => boolean) & Bounds<number> & array<S> {
  return Object_assign(function BoundedArraySchema(u: unknown) {
    return Array_isArray(u) && within(bounds)(u.length)
  }, carry, array(schema))
}

export interface array<S> extends array.core<S> {
  toString: toString<this>
  equals: equals<this>
  toJsonSchema: toJsonSchema<this>
  validate: validate<this>
}

export function array<S extends Schema>(schema: S, readonly: 'readonly'): readonlyArray<S>
export function array<S extends Schema>(schema: S): array<S>
export function array<S extends SchemaLike>(schema: S): array<of<Guarded<S>>>
export function array<S>(schema: S): array<S> {
  return array.def(schema)
}

export namespace array {
  export let userDefinitions: Record<string, any> = {
    } as array<unknown>
  export function def<S>(x: S, prev?: array<unknown>): array<S>
  export function def<S>(x: S, prev?: unknown): array<S>
  export function def<S>(x: S, prev?: array<unknown>): array<S>
  export function def(x: unknown, prev?: unknown): {} {
    let userExtensions: Record<string, any> = {
      toJsonSchema,
      validate,
      toString,
      equals,
    }
    const predicate = _isPredicate(x) ? arrayOf(x) : Array_isArray
    function ArraySchema(src: unknown) { return predicate(src) }
    ArraySchema.tag = URI.array
    ArraySchema.def = x
    ArraySchema.min = function arrayMin<Min extends number>(minLength: Min) {
      return Object_assign(
        boundedArray(x, { gte: minLength }, carryover(this, 'minLength' as never)),
        { minLength },
      )
    }
    ArraySchema.max = function arrayMax<Max extends number>(maxLength: Max) {
      return Object_assign(
        boundedArray(x, { lte: maxLength }, carryover(this, 'maxLength' as never)),
        { maxLength },
      )
    }
    ArraySchema.between = function arrayBetween<Min extends number, Max extends number>(
      min: Min,
      max: Max,
      minLength = <typeof min>Math_min(min, max),
      maxLength = <typeof max>Math_max(min, max)
    ) {
      return Object_assign(
        boundedArray(x, { gte: minLength, lte: maxLength }),
        { minLength, maxLength },
      )
    }
    if (has('minLength', Number_isSafeInteger)(prev)) ArraySchema.minLength = prev.minLength
    if (has('maxLength', Number_isSafeInteger)(prev)) ArraySchema.maxLength = prev.maxLength
    Object_assign(ArraySchema, userDefinitions)
    return Object_assign(ArraySchema, bindUserExtensions(ArraySchema, userExtensions))
  }
}

export declare namespace array {
  interface core<S> {
    (u: this['_type'] | Unknown): u is this['_type']
    tag: URI.array
    get def(): S
    _type: S['_type' & keyof S][]
    minLength?: number
    maxLength?: number
    min<Min extends Integer<Min>>(minLength: Min): array.Min<Min, this>
    max<Max extends Integer<Max>>(maxLength: Max): array.Max<Max, this>
    between<Min extends Integer<Min>, Max extends Integer<Max>>(minLength: Min, maxLength: Max): array.between<[min: Min, max: Max], S>
  }
  type Min<Min extends number, Self>
    = [Self] extends [{ maxLength: number }]
    ? array.between<[min: Min, max: Self['maxLength']], Self['def' & keyof Self]>
    : array.min<Min, Self['def' & keyof Self]>
    ;
  type Max<Max extends number, Self>
    = [Self] extends [{ minLength: number }]
    ? array.between<[min: Self['minLength'], max: Max], Self['def' & keyof Self]>
    : array.max<Max, Self['def' & keyof Self]>
    ;
  interface min<Min extends number, S> extends array<S> { minLength: Min }
  interface max<Max extends number, S> extends array<S> { maxLength: Max }
  interface between<Bounds extends [min: number, max: number], S> extends array<S> { minLength: Bounds[0], maxLength: Bounds[1] }
  type type<S, T = S['_type' & keyof S][]> = never | T
}

export const readonlyArray: {
  <S extends Schema>(schema: S): readonlyArray<S>
  <S extends SchemaLike>(schema: S): readonlyArray<Guarded<S>>
} = array
export interface readonlyArray<S> {
  (u: unknown): u is this['_type']
  tag: URI.array
  def: S
  _type: ReadonlyArray<S['_type' & keyof S]>
}
