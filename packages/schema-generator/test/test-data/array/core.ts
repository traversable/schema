import type { Integer, Unknown } from '@traversable/registry'
import {
  Array_isArray,
  bindUserExtensions,
  isPredicate,
  Math_max,
  Math_min,
  Number_isSafeInteger,
  Object_assign,
  safeCoerce,
  URI,
} from '@traversable/registry'


import type { Bounds } from '@traversable/schema-core'
import { t, __carryover as carryover, __within as within } from '@traversable/schema-core'

export interface array<S> extends array.core<S> {
  //<%= Types %>
}

export function array<S extends t.Schema>(schema: S): array<S>
export function array<S extends t.Predicate>(schema: S): array<t.Inline<S>>
export function array<S>(schema: S): array<S> {
  return array.def(schema)
}

export namespace array {
  export let userDefinitions = {
    //<%= Definitions %>
  } as array<unknown>
  export function def<S>(x: S, prev?: array<unknown>): array<S>
  export function def<S>(x: S, prev?: unknown): array<S>
  export function def<S>(x: S, prev?: array<unknown>): array<S>
  export function def(x: unknown, prev?: unknown): {} {
    let userDefinitions: Record<string, any> = {
      //<%= Extensions %>
    }
    const arrayPredicate = isPredicate(x) ? array$(safeCoerce(x)) : Array_isArray
    function ArraySchema(src: unknown) { return arrayPredicate(src) }
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
    if (t.has('minLength', Number_isSafeInteger)(prev)) ArraySchema.minLength = prev.minLength
    if (t.has('maxLength', Number_isSafeInteger)(prev)) ArraySchema.maxLength = prev.maxLength
    Object_assign(ArraySchema, userDefinitions)
    return Object_assign(ArraySchema, bindUserExtensions(ArraySchema, userDefinitions))
  }
}

export declare namespace array {
  interface core<S> {
    (u: this['_type'] | Unknown): u is this['_type']
    tag: URI.array
    def: S
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

let array$
  : (f: (u: unknown) => u is unknown) => (u: unknown) => u is unknown[]
  = (f: (u: unknown) => u is unknown) => (u: unknown): u is unknown[] => Array_isArray(u) && u.every(f)

function boundedArray<S extends t.Schema>(schema: S, bounds: Bounds, carry?: Partial<array<S>>): ((u: unknown) => boolean) & Bounds<number> & array<S>
function boundedArray<S>(schema: S, bounds: Bounds, carry?: { [x: string]: unknown }): ((u: unknown) => boolean) & Bounds<number> & array<S>
function boundedArray<S extends t.Schema>(schema: S, bounds: Bounds, carry?: {}): ((u: unknown) => boolean) & Bounds<number> & array<S> {
  return Object_assign(function BoundedArraySchema(u: unknown) {
    return Array_isArray(u) && within(bounds)(u.length)
  }, carry, array(schema))
}
