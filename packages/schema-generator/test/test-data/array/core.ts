import type { Unknown } from '@traversable/registry'
import {
  Array_isArray,
  bindUserDefinitions,
  Math_max,
  Math_min,
  Object_assign,
  URI,
} from '@traversable/registry'


import type { Bounds } from '@traversable/schema'
import { t, __carryover as carryover, __within as within } from '@traversable/schema'

export interface array<S> extends array.core<S> {
  //<%= types %>
}

export function array<S extends t.Schema>(schema: S): array<S>
export function array<S extends t.Predicate>(schema: S): array<t.Inline<S>>
export function array<S extends t.Schema>(schema: S): array<S> { return array.def(schema) }

export namespace array {
  export let proto = {}
  export function def<S>(x: S, prev?: array<unknown>): array<S>
  export function def<S>(x: S, prev?: unknown): array<S>
  export function def<S>(x: S, prev?: array<unknown>): array<S>
  export function def<S>(x: S, prev?: unknown): {} {
    let userDefinitions: Record<string, any> = {
      //<%= terms %>
    }
    const arrayPredicate = t.isPredicate(x) ? array$(x) : Array_isArray
    function ArraySchema(src: unknown): src is array<S>['_type'] { return arrayPredicate(src) }
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
    if (t.has('minLength', t.integer)(prev)) ArraySchema.minLength = prev.minLength
    if (t.has('maxLength', t.integer)(prev)) ArraySchema.maxLength = prev.maxLength
    Object_assign(ArraySchema, proto)
    return Object_assign(ArraySchema, bindUserDefinitions(ArraySchema, userDefinitions))
  }
}

export declare namespace array {
  interface core<S> {
    (u: S[] | Unknown): u is this['_type']
    tag: URI.array
    def: S
    _type: S['_type' & keyof S][]
    minLength?: number
    maxLength?: number
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

let array$ = <T>(fn: (u: unknown) => u is T) => (u: unknown): u is T[] => Array_isArray(u) && u.every(fn)

function boundedArray<S extends t.Schema>(schema: S, bounds: Bounds, carry?: Partial<array<S>>): ((u: unknown) => boolean) & Bounds<number> & array<S>
function boundedArray<S>(schema: S, bounds: Bounds, carry?: { [x: string]: unknown }): ((u: unknown) => boolean) & Bounds<number> & array<S>
function boundedArray<S extends t.Schema>(schema: S, bounds: Bounds, carry?: {}): ((u: unknown) => boolean) & Bounds<number> & array<S> {
  return Object_assign(function BoundedArraySchema(u: unknown) {
    return Array_isArray(u) && within(bounds)(u.length)
  }, carry, array(schema))
}
