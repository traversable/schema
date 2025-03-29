import type { Intersect, SchemaOptions } from '@traversable/registry'
import { symbol as Symbol, URI } from '@traversable/registry'

import type * as t from './schema.js'

export {
  null_ as null,
  undefined_ as undefined,
  true_ as true,
  false_ as false,
  isComposite as composite,
}

/** @internal */
const Array_isArray = globalThis.Array.isArray

/** @internal */
const Object_keys = globalThis.Object.keys

/** @internal */
const Object_entries = globalThis.Object.entries

/** @internal */
const Object_hasOwnProperty = globalThis.Object.prototype.hasOwnProperty

/** @internal */
const isComposite = <T>(u: unknown): u is { [x: string]: T } => !!u && typeof u === "object"

/** @internal */
export function hasOwn<K extends keyof any>(u: unknown, key: K): u is { [P in K]: unknown }
export function hasOwn(u: unknown, key: keyof any): u is { [x: string]: unknown } {
  return typeof u === 'function' ? Object_hasOwnProperty.call(u, key)
    : typeof key === "symbol"
      ? isComposite(u) && key in u
      : Object_hasOwnProperty.call(u, key)
}

/////////////////////
///    nullary    ///

const null_ = (u: unknown): u is null => u === null

const undefined_ = (u: unknown): u is undefined => u === undefined

export const any = (_: unknown): _ is unknown => true

export const never = (_: unknown): _ is never => false

export function array(u: unknown): u is readonly unknown[] {
  return Array_isArray(u)
}

export function array$<T>(guard: (u: unknown) => u is T): (u: unknown) => u is readonly T[] {
  return (u: unknown) => array(u) && u.every(guard)
}

export function optional$<T>(guard: (u: unknown) => u is T): (u: unknown) => u is undefined | T {
  return (u: unknown) => u === void 0 || guard(u)
}

export const bigint = (u: unknown) => typeof u === "bigint"

export const boolean = (u: unknown) => typeof u === "boolean"

export const number = (u: unknown) => typeof u === "number"

export const string = (u: unknown) => typeof u === "string"

export const symbol = (u: unknown) => typeof u === "symbol"

export const object = (u: unknown): u is { [x: string]: unknown } =>
  ((v) => v !== null && typeof v === "object" && !Array_isArray(v))(u)

export const is = {
  array: array$,
  record,
  union,
  intersect,
  optional: optional$,
  object: object$,
  anyObject: object,
  anyArray: array,
  tuple: tuple$,
  unknown: any,
}

///    type-guards    ///
/////////////////////////

///////////////////////
///    composite    ///
export function literally<T extends {} | null | undefined>(value: T): (u: unknown) => u is T
export function literally<T extends {} | null | undefined>(...values: readonly T[]): (u: unknown) => u is T
export function literally(...values: readonly ({} | null | undefined)[]): (u: unknown) => u is never {
  return (u): u is never => values.includes(u)
}

///////////////////
///    misc.    ///
export const key = (u: unknown): u is keyof any =>
  typeof u === "string"
  || typeof u === "number"
  || typeof u === "symbol"
  ;

export const nonnullable = (u: {} | null | undefined): u is {} => u != null

export const showable = (u: unknown): u is boolean | number | bigint | string => u == null
  || typeof u === "boolean"
  || typeof u === "number"
  || typeof u === "bigint"
  || typeof u === "string"
export const scalar = (u: unknown): u is undefined | null | boolean | number | string => u == null
  || typeof u === "boolean"
  || typeof u === "number"
  || typeof u === "string"
export const primitive = (u: unknown) => !u || (typeof u !== 'object' && typeof u !== 'function')

const true_ = (u: unknown): u is true => u === true
const false_ = (u: unknown): u is false => u === false

export const defined = (u: {} | null | undefined): u is {} | null => u !== undefined
export const notnull = (u: {} | null | undefined): u is {} | undefined => u !== null
export const nullable = (u: {} | null | undefined): u is null | undefined => u == null

export const nonempty = {
  array: <T>(xs: T[] | readonly T[]): xs is { [0]: NonNullable<T> } & typeof xs =>
    xs.length > 0
}

const isObject
  : (u: unknown) => u is { [x: string]: unknown }
  = (u): u is never => !!u && typeof u === "object"

export { isOptionalSchema as __isOptionalSchema }
function isOptionalSchema(u: unknown): u is ((u: unknown) => u is unknown) & { [Symbol.tag]: URI.optional, def: (u: unknown) => u is unknown } {
  return !!u && (typeof u === 'object' || typeof u === 'function') && 'tag' in u && u.tag === URI.optional && 'def' in u && typeof u.def === 'function'
}
function isRequiredSchema<T>(u: unknown): u is (_: unknown) => _ is T {
  return !!u && !isOptionalSchema(u)
}
export { isOptionalNotUndefinedSchema as __isOptionalNotUndefinedSchema }
function isOptionalNotUndefinedSchema<T>(u: unknown): u is t.optional<T> {
  return !!u && isOptionalSchema(u) && u.def(undefined) === false
}

export { isUndefinedSchema as __isUndefinedSchema }
function isUndefinedSchema(u: unknown): u is t.undefined {
  return !!u && typeof u === 'function' && 'tag' in u && u.tag === URI.undefined
}

export function exactOptional<T extends { [x: string]: (u: any) => boolean }>
  (shape: T, u: globalThis.Record<string, unknown>): boolean
export function exactOptional<T extends { [x: number]: (u: any) => boolean }>
  (shape: T, u: globalThis.Record<string, unknown>): boolean
export function exactOptional<T extends { [x: string]: (u: any) => boolean }>
  (qs: T, u: globalThis.Record<string, unknown>) {
  for (const k in qs) {
    const q = qs[k]
    switch (true) {
      case q === (globalThis.Boolean as never): { if (hasOwn(u, k)) return u[k] != null; else return false }
      case isUndefinedSchema(q) && !hasOwn(u, k): return false
      case isOptionalNotUndefinedSchema(q) && hasOwn(u, k) && u[k] === undefined: return false
      case isOptionalSchema(q) && !hasOwn(u, k): continue
      case isRequiredSchema(q) && !hasOwn(u, k): return false
      case !q(u[k]): return false
      default: continue
    }
  }
  return true
}

export function record<T>(guard: (u: unknown) => u is T): (u: unknown) => u is globalThis.Record<string, T>
export function record<T, K extends keyof any>(
  keyGuard: (k: keyof any) => k is K,
  valueGuard: (u: unknown) => u is T
): (u: unknown) => u is globalThis.Record<K, T>
export function record<T, K extends keyof any>(
  ...args:
    | [guard: (u: unknown) => u is T]
    | [keyGuard: (k: keyof any) => k is K, valueGuard: (u: unknown) => u is T]
) {
  const [keyGuard, valueGuard] = args.length === 1 ? [() => true, args[0]] : args
  return (u: unknown): u is never => {
    return isComposite(u) && !Array_isArray(u) && Object_entries(u).every(([k, v]) => keyGuard(k) && valueGuard(v))
  }
}

function union<T extends readonly ((u: unknown) => u is unknown)[]>(guard: readonly [...T]): (u: unknown) => u is T[number]
function union<T extends readonly ((u: unknown) => u is unknown)[]>(qs: readonly [...T]) {
  return (u: unknown): u is never => qs.some((q) => q(u))
}

function intersect<T extends readonly ((u: unknown) => u is unknown)[]>(guard: readonly [...T]): (u: unknown) => u is Intersect<T>
function intersect<T extends readonly ((u: unknown) => u is unknown)[]>(qs: readonly [...T]) {
  return (u: unknown): u is never => qs.every((q) => q(u))
}

export function presentButUndefinedIsOK<T extends { [x: number]: (u: any) => boolean }>
  (qs: T, u: { [x: number]: unknown }): boolean
export function presentButUndefinedIsOK<T extends { [x: string]: (u: any) => boolean }>
  (qs: T, u: { [x: string]: unknown }): boolean
export function presentButUndefinedIsOK<T extends { [x: number]: (u: any) => boolean }>
  (qs: T, u: object): boolean
export function presentButUndefinedIsOK<T extends { [x: string]: (u: any) => boolean }>
  (qs: T, u: {} | { [x: string]: unknown }) {
  for (const k in qs) {
    const q = qs[k]
    switch (true) {
      case q === (globalThis.Boolean as never): { if (hasOwn(u, k)) return u[k] != null; else return false }
      case isOptionalSchema(qs[k]) && !hasOwn(u, k): continue
      case isOptionalSchema(qs[k]) && hasOwn(u, k) && u[k] === undefined: continue
      case isOptionalSchema(qs[k]) && hasOwn(u, k) && q(u[k]): continue
      case isOptionalSchema(qs[k]) && hasOwn(u, k) && !q(u[k]): return false
      case isRequiredSchema(qs[k]) && !hasOwn(u, k): return false
      case isRequiredSchema(qs[k]) && hasOwn(u, k) && q(u[k]) === true: continue
      default: return false
    }
  }
  return true
}

function treatUndefinedAndOptionalAsTheSame<T extends { [x: number]: (u: any) => boolean }>(qs: T, u: { [x: number]: unknown }) {
  const ixs = Object_keys(qs)
  for (const ix of ixs) {
    const q = qs[ix as never]
    const v = u[ix as never]
    if (!q(v)) return false
  }
  return true
}


type Target<S> = S extends { (_: any): _ is infer T } ? T : S extends { (u: infer T): boolean } ? T : never
type Object$<T extends { [x: string]: { (u: any): boolean } | { (u: any): u is unknown } }> = (u: unknown) => u is { [K in keyof T]: Target<T[K]> }

declare namespace object$ {
  type Options = SchemaOptions
}

export { object$ }
function object$<T extends { [x: string]: { (u: any): boolean } | { (u: any): u is unknown } }>(
  qs: T,
  $: Required<SchemaOptions>,
): Object$<T> {
  return (u: unknown): u is never => {
    switch (true) {
      case !u: return false
      case !isObject(u): return false
      case !$.treatArraysAsObjects && Array_isArray(u): return false
      case $.optionalTreatment === 'exactOptional': return exactOptional(qs, u)
      case $.optionalTreatment === 'presentButUndefinedIsOK': return presentButUndefinedIsOK(qs, u)
      case $.optionalTreatment === 'treatUndefinedAndOptionalAsTheSame': return treatUndefinedAndOptionalAsTheSame(qs, u)
      default: throw globalThis.Error(

        '(["@traversable/schema/predicates/object$"]  \
                                                      \
          Expected "optionalTreatment" to be one of:  \
                                                      \
            - "exactOptional"                         \
            - "presentButUndefinedIsOK"               \
            - "treatUndefinedAndOptionalAsTheSame"    \
                                                      \
          Got: ' + globalThis.JSON.stringify($.optionalTreatment)
      )
    }
  }
}

export function record$<T>(guard: (u: unknown) => u is T): (u: unknown) => u is globalThis.Record<string, T>
export function record$<T, K extends keyof any>(
  keyGuard: (k: keyof any) => k is K,
  valueGuard: (u: unknown) => u is T
): (u: unknown) => u is globalThis.Record<K, T>
export function record$<T, K extends keyof any>(
  ...args:
    | [guard: (u: unknown) => u is T]
    | [keyGuard: (k: keyof any) => k is K, valueGuard: (u: unknown) => u is T]
) {
  const [keyGuard, valueGuard] = args.length === 1
    ? [() => true, args[0]]
    : args
  return (u: unknown): u is never => {
    return object(u) && Object_entries(u).every(([k, v]) => keyGuard(k) && valueGuard(v))
  }
}

export function intersect$<T extends readonly ((u: unknown) => u is unknown)[]>(...guard: [...T]): (u: unknown) => u is Intersect<T>
export function intersect$<T extends readonly ((u: unknown) => u is unknown)[]>(...qs: [...T]) {
  return (u: unknown): u is never => qs.every((q) => q(u))
}

export function union$<T extends readonly ((u: unknown) => u is unknown)[]>(...guard: [...T]): (u: unknown) => u is T[number]
export function union$<T extends readonly ((u: unknown) => u is unknown)[]>(...qs: [...T]) {
  return (u: unknown): u is never => qs.some((q) => q(u))
}

export function tuple$<Opts extends { minLength?: number } & SchemaOptions>(options: Opts):
  <T extends readonly t.Predicate[]>(qs: T)
    => (u: unknown)
      => u is { [I in keyof T]: Target<T[I]>; } {
  return <T extends readonly t.Predicate[]>(qs: T): (u: unknown) => u is { [I in keyof T]: Target<T[I]> } => {
    const checkLength = (xs: readonly unknown[]) =>
      options?.minLength === void 0
        ? (xs.length === qs.length)
        : options.minLength === -1
          ? (xs.length === qs.length)
          : (xs.length >= options.minLength && qs.length >= xs.length)

    return (u: unknown): u is never =>
      Array_isArray(u) &&
      checkLength(u) &&
      qs.every((q, ix) => q(u[ix]))
  }
}
