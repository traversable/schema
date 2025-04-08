import type * as T from '@traversable/registry'
import {
  Array_isArray,
  has,
  Math_max,
  Math_min,
  Object_assign,
  Object_is,
  URI,
} from '@traversable/registry'
import type { Bounds } from '@traversable/schema'
import {
  t,
  __carryover as carryover,
  __within as within,
} from '@traversable/schema'

import type { ValidationError, ValidationFn } from '@traversable/derive-validators'
import { Errors, NullaryErrors } from '@traversable/derive-validators'
import type { SizeBounds } from '@traversable/schema-to-json-schema'

//////////////////
///    temp    ///
import '@traversable/schema-to-string/install'
import '@traversable/schema-to-json-schema/install'
import '@traversable/derive-validators/install'
///    temp    ///
//////////////////


////////////////////
///    equals    ///
export type equals<T> = never | T.Equal<T>
///
export function equals<S extends t.Schema>(schema: S): equals<S['_type'][]>
export function equals<S>(schema: S): equals<S['_type' & keyof S][]>
export function equals({ def }: { def: unknown }): T.Equal {
  let equals = has('equals', (x): x is T.Equal => typeof x === 'function')(def) ? def.equals : Object_is
  return (l, r) => {
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
}
///    equals    ///
////////////////////

//////////////////////////
///    toJsonSchema    ///
export type toJsonSchema<S, T> = never | T.Force<
  & { type: 'array', items: T.Returns<S['toJsonSchema' & keyof S]> }
  & T.PickIfDefined<T, keyof SizeBounds>
>
export function toJsonSchema<T extends t.array<t.Schema>>(self: T): () => toJsonSchema<T['def'], T>
export function toJsonSchema<T extends { def: unknown, minLength?: number, maxLength?: number }>(self: T): () => toJsonSchema<T['def'], T>
export function toJsonSchema(
  { def, minLength, maxLength }: { def: unknown, minLength?: number, maxLength?: number },
): () => {
  type: 'array'
  items: unknown
  minLength?: number
  maxLength?: number
} {
  return () => {
    let items = has('toJsonSchema', (x) => typeof x === 'function')(def) ? def.toJsonSchema() : def
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
}
///    toJsonSchema    ///
//////////////////////////

//////////////////////
///    toString    ///
/* @ts-expect-error */
export type toString<S> = never | `(${ReturnType<S['toString']>})[]`
///
export function toString<S>(x: { def: S }): () => toString<S>
export function toString<S>(x: S): () => toString<S>
export function toString({ def }: { def: unknown }) {
  return () => {
    let body = (
      !!def
      && typeof def === 'object'
      && 'toString' in def
      && typeof def.toString === 'function'
    ) ? def.toString()
      : '${string}'
    return ('(' + body + ')[]')
  }
}
///    toString    ///
//////////////////////

//////////////////////
///    validate    ///
export type validate<S> = never | ValidationFn<S['_type' & keyof S]>;
///
export function validate<S extends t.Schema>(
  itemsSchema: S,
  bounds?: { minLength?: number, maxLength?: number }
): validate<S>
export function validate<S>(
  itemsSchema: S,
  bounds?: { minLength?: number, maxLength?: number }
): validate<S>
//
export function validate(
  { def }: { def: unknown },
  { minLength, maxLength }: { minLength?: number, maxLength?: number } = {}
): ValidationFn {
  let validate = <ValidationFn>((
    !!def
    && typeof def === 'object'
    && 'validate' in def
    && typeof def.validate === 'function'
  ) ? def.validate
    : () => true)
  validateArray.tag = URI.array
  function validateArray(u: unknown, path: (keyof any)[] = []) {
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

//////////////////
///    core    ///
export interface array<S> extends array.core<S> {
  //////////////////////////////
  ///    user definitions    ///
  toString(): toString<S>
  equals: equals<this['_type']>
  toJsonSchema(): toJsonSchema<S, this>
  validate(u: this['_type'] | T.Unknown): true | ValidationError[]
  ///    user definitions    ///
  //////////////////////////////
}

export function array<S extends t.Schema>(schema: S): array<S>
export function array<S extends t.Predicate>(schema: S): array<t.Inline<S>>
export function array<S extends t.Schema>(schema: S): array<S> { return array.def(schema) }

export namespace array {
  export function def<S>(x: S, prev?: array<unknown>): array<S>
  export function def<S>(x: S, prev?: unknown): array<S>
  export function def<S>(x: S, prev?: array<unknown>): array<S>
  export function def<S>(x: S, prev?: unknown): array<S> {
    let proto = {
      tag: URI.array,
    } as { tag: URI.array, _type: S['_type' & keyof S][] }
    let userDefinitions = {
      //////////////////////////////
      ///    user-definitions    ///
      equals: equals(x),
      toJsonSchema: toJsonSchema(self),
      validate: validate(x),
      toString: toString(x),
      ///    user-definitions    ///
      //////////////////////////////
    }
    const arrayPredicate = t.isPredicate(x) ? array$(x) : Array_isArray
    function self(src: unknown): src is array<S>['_type'] { return arrayPredicate(src) }
    self.min = function arrayMin<Min extends number>(minLength: Min) {
      return Object_assign(
        boundedArray(x, { gte: minLength }, carryover(this, 'minLength' as never)),
        { minLength },
      )
    }
    self.max = function arrayMax<Max extends number>(maxLength: Max) {
      return Object_assign(
        boundedArray(x, { lte: maxLength }, carryover(this, 'maxLength' as never)),
        { maxLength },
      )
    }
    self.between = function arrayBetween<Min extends number, Max extends number>(
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
    self.def = x
    if (t.has('minLength', t.integer)(prev)) self.minLength = prev.minLength
    if (t.has('maxLength', t.integer)(prev)) self.maxLength = prev.maxLength
    return Object.assign(self, { ...proto, ...userDefinitions })
  }
}

export declare namespace array {
  interface core<S> {
    (u: unknown): u is this['_type']
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
///    core    ///
//////////////////
