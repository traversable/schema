import type {
  Bounds,
  Integer,
  Unknown,
} from '@traversable/registry'
import {
  Array_isArray,
  array as arrayOf,
  bindUserExtensions,
  carryover,
  within,
  _isPredicate,
  has,
  Math_max,
  Math_min,
  Number_isSafeInteger,
  Object_assign,
  URI,
} from '@traversable/registry'

import type { Guarded, Schema, SchemaLike } from '@traversable/schema-core/namespace'

import type { of } from '../of/index.js'

/** @internal */
function boundedArray<S extends Schema>(schema: S, bounds: Bounds, carry?: Partial<array<S>>): ((u: unknown) => boolean) & Bounds<number> & array<S>
function boundedArray<S>(schema: S, bounds: Bounds, carry?: { [x: string]: unknown }): ((u: unknown) => boolean) & Bounds<number> & array<S>
function boundedArray<S extends Schema>(schema: S, bounds: Bounds, carry?: {}): ((u: unknown) => boolean) & Bounds<number> & array<S> {
  return Object_assign(function BoundedArraySchema(u: unknown) {
    return Array_isArray(u) && within(bounds)(u.length)
  }, carry, array(schema))
}

export interface array<S> extends array.core<S> {
  //<%= Types %>
}

export function array<S extends Schema>(schema: S, readonly: 'readonly'): readonlyArray<S>
export function array<S extends Schema>(schema: S): array<S>
export function array<S extends SchemaLike>(schema: S): array<of<Guarded<S>>>
export function array<S>(schema: S): array<S> {
  return array.def(schema)
}

export namespace array {
  export let userDefinitions: Record<string, any> = {
    //<%= Definitions %>
  } as array<unknown>
  export function def<S>(x: S, prev?: array<unknown>): array<S>
  export function def<S>(x: S, prev?: unknown): array<S>
  export function def<S>(x: S, prev?: array<unknown>): array<S>
  /* v8 ignore next 1 */
  export function def(x: unknown, prev?: unknown): {} {
    let userExtensions: Record<string, any> = {
      //<%= Extensions %>
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
