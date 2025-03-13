import type { Force, Intersect } from './registry.js'
import { symbol as Symbol, URI } from './registry.js'

import type * as AST from './ast.js'
import type { Predicate } from './core.js'
import type { SchemaOptions } from './options.js'

export {
  null_ as null,
  undefined_ as undefined,
  true_ as true,
  false_ as false,
  function_ as function,
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
function hasOwn<K extends keyof any>(u: unknown, key: K): u is { [P in K]: unknown }
function hasOwn(u: unknown, key: keyof any): u is { [x: string]: unknown } {
  return typeof key === "symbol"
    ? isComposite(u) && key in u
    : Object_hasOwnProperty.call(u, key)
}

export const is = {
  has,
  array: array$,
  record,
  union,
  intersect,
  optional: optional$,
  object: object$,
  tuple: tuple$,
}


type parseArgs<F extends readonly unknown[], Fallbacks, Options>
  = F extends readonly [...infer Lead, infer Last]
  ? Last extends { [K in keyof Fallbacks | keyof Options]+?: unknown }
  ? [Lead, Force<Omit<Fallbacks, keyof Last> & { [K in keyof Last]-?: Last[K] }>]
  : [F, Fallbacks]
  : never
//

export function parseArgs<
  F extends readonly [...((_: any) => boolean)[]],
  Fallbacks extends Required<SchemaOptions>,
>(
  fallbacks: Fallbacks,
  args: readonly [...F] | readonly [...F, SchemaOptions]
): [[...F], Fallbacks]

export function parseArgs<
  F extends readonly unknown[],
  Fallbacks extends { [x: string]: unknown },
  Options extends { [x: string]: unknown }
>(
  fallbacks: Fallbacks,
  args: readonly [...F] | readonly [...F, $: Options]
) {
  const last = args.at(-1)
  if (typeof last === 'function') return [args, fallbacks]
  else return [args.slice(0, -1), last === undefined ? fallbacks : { ...fallbacks, ...last }]
}


/////////////////////
///    nullary    ///
const function_ = (u: unknown): u is (...args: any) => unknown => typeof u === "function"

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

export function integer(u: unknown): u is number {
  return globalThis.Number.isInteger(u)
}

export const object = (u: unknown): u is { [x: string]: unknown } =>
  u !== null && typeof u === "object" && !Array_isArray(u)

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
  array: <T>(xs: T[] | readonly T[]): xs is { [0]: T } & typeof xs => xs.length > 1
}

const isObject
  : (u: unknown) => u is { [x: string]: unknown }
  = (u): u is never => !!u && typeof u === "object"

function isOptionalSchema(u: unknown): u is ((u: unknown) => u is unknown) & { [Symbol.tag]: URI.optional } {
  return !!u && (typeof u === 'object' || typeof u === 'function') && 'tag' in u && u.tag === URI.optional
}
function isRequiredSchema<T>(u: unknown): u is (_: unknown) => _ is T {
  return !!u && !isOptionalSchema(u)
}
function isOptionalNotUndefinedSchema<T>(u: unknown): u is AST.optional<T> {
  return !!u && isOptionalSchema(u) && u(undefined) === false
}
function isUndefinedSchema(u: unknown): u is AST.undefined {
  return !!u && (u as { [x: symbol]: unknown })[Symbol.tag] === URI.undefined
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

function record<T>(guard: (u: unknown) => u is T): (u: unknown) => u is globalThis.Record<string, T>
function record<T, K extends keyof any>(
  keyGuard: (k: keyof any) => k is K,
  valueGuard: (u: unknown) => u is T
): (u: unknown) => u is globalThis.Record<K, T>
function record<T, K extends keyof any>(
  ...args:
    | [guard: (u: unknown) => u is T]
    | [keyGuard: (k: keyof any) => k is K, valueGuard: (u: unknown) => u is T]
) {
  const [keyGuard, valueGuard] = args.length === 1 ? [() => true, args[0]] : args
  return (u: unknown): u is never => {
    return isComposite(u) && !Array_isArray(u) && Object_entries(u).every(([k, v]) => keyGuard(k) && valueGuard(v))
  }
}

function union<T extends readonly ((u: unknown) => u is unknown)[]>(...guard: [...T]): (u: unknown) => u is T[number]
function union<T extends readonly ((u: unknown) => u is unknown)[]>(...qs: [...T]) {
  return (u: unknown): u is never => qs.some((q) => q(u))
}

function intersect<T extends readonly ((u: unknown) => u is unknown)[]>(...guard: [...T]): (u: unknown) => u is Intersect<T>
function intersect<T extends readonly ((u: unknown) => u is unknown)[]>(...qs: [...T]) {
  return (u: unknown): u is never => qs.every((q) => q(u))
}

function presentButUndefinedIsOK<T extends { [x: number]: (u: any) => boolean }>
  (qs: T, u: { [x: number]: unknown }): boolean
function presentButUndefinedIsOK<T extends { [x: string]: (u: any) => boolean }>
  (qs: T, u: { [x: string]: unknown }): boolean
function presentButUndefinedIsOK<T extends { [x: number]: (u: any) => boolean }>
  (qs: T, u: object): boolean
function presentButUndefinedIsOK<T extends { [x: string]: (u: any) => boolean }>
  (qs: T, u: {} | { [x: string]: unknown }) {
  for (const k in qs) {
    const q = qs[k]
    switch (true) {
      case isOptionalSchema(qs[k]) && !hasOwn(u, k): continue
      case isOptionalSchema(qs[k]) && hasOwn(u, k) && u[k] === undefined: continue
      case isOptionalSchema(qs[k]) && hasOwn(u, k) && q(u[k]): continue
      case isOptionalSchema(qs[k]) && hasOwn(u, k) && !q(u[k]): return false
      case isRequiredSchema(qs[k]) && !hasOwn(u, k): return false
      case isRequiredSchema(qs[k]) && hasOwn(u, k) && q(u[k]) === true: continue
      case hasOwn(u, k) && q(u[k]) === true: continue
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

export { object$ }
function object$<T extends { [x: string]: (u: any) => boolean }>(
  qs: T,
  $: Required<SchemaOptions>,
) {
  return (u: unknown): boolean => {
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
  const [keyGuard, valueGuard] = args.length === 1 ? [() => true, args[0]] : args
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

export function tuple$<Opts extends { minLength?: number } & SchemaOptions>(options: Opts) {
  return <T extends readonly Predicate[]>(...qs: T): Predicate => {
    const checkLength = (xs: readonly unknown[]) =>
      options?.minLength === void 0
        ? (xs.length === qs.length)
        : options.minLength === -1
          ? (xs.length === qs.length)
          : (xs.length >= options.minLength && qs.length >= xs.length)

    return (u: unknown) =>
      Array_isArray(u) &&
      checkLength(u) &&
      qs.every((q, ix) => q(u[ix]))
  }
}

export type has<KS extends readonly (keyof any)[], T = {}> = has.loop<KS, T>

export declare namespace has {
  export type loop<KS extends readonly unknown[], T>
    = KS extends readonly [...infer Todo, infer K extends keyof any]
    ? has.loop<Todo, { [P in K]: T }>
    : T extends infer U extends {} ? U : never
}

/** 
 * ## {@link has `tree.has`}
 * 
 * The {@link has `tree.has`} utility accepts a path
 * into a tree and an optional type-guard, and returns 
 * a predicate that returns true if its argument
 * "has" the specified path.
 * 
 * If the optional type-guard is provided, {@link has `tree.has`}
 * will also apply the type-guard to the value it finds at
 * the provided path.
 */
export function has<KS extends readonly (keyof any)[]>(...params: [...KS]): (u: unknown) => u is has<KS>
export function has<const KS extends readonly (keyof any)[], T>(...params: [...KS, (u: unknown) => u is T]): (u: unknown) => u is has<KS, T>
/// impl.
export function has
  (...args: [...(keyof any)[]] | [...(keyof any)[], (u: any) => u is any]) {
  return (u: unknown) => {
    const [path, check] = parsePath(args)
    const got = get_(u, path)
    return got !== Symbol.notfound && check(got)
  }
}

/** @internal */
function get_(x: unknown, ks: (keyof any)[]) {
  let out = x
  let k: keyof any | undefined
  while ((k = ks.shift()) !== undefined) {
    if (hasOwn(out, k)) void (out = out[k])
    else if (k === "") continue
    else return Symbol.notfound
  }
  return out
}

/** @internal */
function parsePath(xs: (keyof any)[] | [...(keyof any)[], (u: unknown) => boolean]):
  [path: (keyof any)[], check: (u: any) => u is any]
function parsePath(xs: (keyof any)[] | [...(keyof any)[], (u: unknown) => boolean]) {
  return array$(key)(xs)
    ? [xs, () => true]
    : [xs.slice(0, -1), xs[xs.length - 1]]
}

declare namespace object$ {
  type Options = SchemaOptions
}
