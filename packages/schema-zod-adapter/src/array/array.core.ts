import {
  Array_isArray,
  has,
  Math_max,
  Math_min,
  Object_assign,
  URI,
} from '@traversable/registry'

import type { Bounds } from '@traversable/schema'
import { t, Predicate, __carryover as carryover, __within as within } from '@traversable/schema'

export function array<S extends t.Schema>(schema: S): array<S>
export function array<S extends t.Predicate>(schema: S): array<t.Inline<S>>
export function array<S extends t.Schema>(schema: S): array<S> { return array.def(schema) }
export interface array<S> extends array.methods<S> {
  (u: unknown): u is this['_type']
  tag: URI.array
  def: S
  _type: S['_type' & keyof S][]
  minLength?: number
  maxLength?: number
}

export declare namespace array {
  interface methods<S> {
    min<Min extends number>(minLength: Min): array.Min<Min, this>
    max<Max extends number>(maxLength: Max): array.Max<Max, this>
    between<Min extends number, Max extends number>(minLength: Min, maxLength: Max): array.between<[min: Min, max: Max], S>
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
export namespace array {
  export let prototype = { tag: URI.array } as array<unknown>
  export function def<S>(x: S, prev?: array<unknown>): array<S>
  export function def<S>(x: S, prev?: unknown): array<S>
  export function def<S>(x: S, prev?: array<unknown>): array<S>
  /* v8 ignore next 1 */
  export function def<S>(x: S, prev?: unknown): {} {
    const arrayPredicate = (t.isPredicate(x) ? Predicate.array$(x) : Array_isArray)
    function ArraySchema(src: unknown): src is array<S>['_type'] { return arrayPredicate(src) }
    ArraySchema.min = function arrayMin(minLength: number) {
      return Object_assign(
        boundedArray(x, { gte: minLength }, carryover(this, 'minLength' as never)),
        { minLength },
      )
    }
    ArraySchema.max = function arrayMax(maxLength: number) {
      return Object_assign(
        boundedArray(x, { lte: maxLength }, carryover(this, 'maxLength' as never)),
        { maxLength },
      )
    }
    ArraySchema.between = function arrayBetween(
      min: number,
      max: number,
      minLength = <typeof min>Math_min(min, max),
      maxLength = <typeof max>Math_max(min, max)
    ) {
      return Object_assign(
        boundedArray(x, { gte: minLength, lte: maxLength }),
        { minLength, maxLength },
      )
    }
    ArraySchema.def = x
    ArraySchema._type = void 0 as never
    if (has('minLength', t.integer)(prev)) ArraySchema.minLength = prev.minLength
    if (has('maxLength', t.integer)(prev)) ArraySchema.maxLength = prev.maxLength
    return Object.assign(ArraySchema, array.prototype)
  }
}

export function boundedArray<S extends t.Schema>(schema: S, bounds: Bounds, carry?: Partial<array<S>>): ((u: unknown) => boolean) & Bounds<number> & array<S>
export function boundedArray<S>(schema: S, bounds: Bounds, carry?: { [x: string]: unknown }): ((u: unknown) => boolean) & Bounds<number> & array<S>
export function boundedArray<S extends t.Schema>(schema: S, bounds: Bounds, carry?: {}): ((u: unknown) => boolean) & Bounds<number> & array<S> {
  return Object_assign(function BoundedArraySchema(u: unknown) {
    return Array_isArray(u) && within(bounds)(u.length)
  }, carry, array(schema))
}
