import type { Intersect, Unknown } from './types.js'
import type { SchemaOptions } from './options.js'
import * as URI from './uri.js'
import * as symbol from './symbol.js'
import {
  Array_isArray,
  Number_isInteger,
  Object_hasOwn,
  Object_keys,
  Object_values,
} from './globalThis.js'

export function isNonNullable(x: {} | Unknown) { return x != null }

/** @internal */
function coerce<S, T>(f: (x: S) => T): ((x: S) => T)
function coerce(f: (x: never) => unknown): {} {
  return f === globalThis.Boolean ? isNonNullable : f
}

/** @internal */
let apply
  : <S, T>(x: S) => (f: (x: S) => T) => T
  = (x) => <never>((f: Function) => {
    if ((f) === globalThis.Boolean) return (x != null)
    else return f(x)
  })

/** @internal */
let bind
  : <S, T>(f: (x: S) => T) => ((x: S) => T)
  = (f) => {
    let g = coerce(f)
    return (x) => g(x)
  }

/** @internal */
export let _isPredicate
  : <S, T extends S>(x: unknown) => x is { (): boolean; (x: S): x is T }
  = ((x: any) => typeof x === 'function') as never

/** Nullary */
export function isNever(_: unknown): _ is never { return false }
export function isAny(_: unknown): _ is any { return true }
export function isUnknown(_: unknown): _ is unknown { return true }
export function isVoid(x: void | Unknown): x is void { return x === void 0 }
export function isNull(x: null | Unknown) { return x === null }
export function isUndefined(x: undefined | Unknown) { return x === undefined }
export function isSymbol(x: symbol | Unknown) { return typeof x === 'symbol' }
export function isBoolean(x: boolean | Unknown) { return typeof x === 'boolean' }
export function isInteger(x: number | Unknown) { return Number_isInteger(x) }
export function isNumber(x: number | Unknown) { return typeof x === 'number' }
export function isBigInt(x: bigint | Unknown) { return typeof x === 'bigint' }
export function isString(x: string | Unknown) { return typeof x === 'string' }
export function isAnyArray(x: unknown[] | Unknown) { return Array_isArray(x) }
export function isAnyObject(x: { [x: string]: unknown } | Unknown): x is { [x: string]: unknown } {
  return !!x && typeof x === 'object' && !Array_isArray(x)
}

export function isFunction(x: Function | unknown) { return typeof x === 'function' }
export function isComposite<T>(x: { [x: string]: T } | T[] | Unknown): x is { [x: string]: T } | T[] { return !!x && typeof x === 'object' }

/** Unary+ */
export let array
  : <T>(fn: (x: unknown) => x is T) => ((x: T[] | Unknown) => x is T[])
  = (fn) => function isArrayOf(x): x is never { return Array_isArray(x) && x.every(bind(fn)) }

export let record
  : <T>(fn: (x: unknown) => x is T) => ((x: Record<string, T> | Unknown) => x is Record<string, T>)
  = (fn) => function isRecordOf(x): x is never { return isAnyObject(x) && Object_values(x).every(bind(fn)) }

export let union
  : <T extends readonly unknown[]>(fns: { [I in keyof T]: (x: unknown) => x is T[I] }) => ((x: T[number] | Unknown) => x is T[number])
  = (fns) => function isAnyOf(x): x is never { return fns.some(apply(x)) }

export let intersect
  : <T extends readonly unknown[]>(fns: { [I in keyof T]: (x: unknown) => x is T[I] }) => ((x: Intersect<T> | Unknown) => x is Intersect<T>)
  = (fns) => function isAllOf(x): x is never { return fns.every(apply(x)) }

export let optional
  : <T>(fn: (x: unknown) => x is T) => (x: undefined | T | Unknown) => x is undefined | T
  = (fn) => function isOptionally(u): u is never { return u === void 0 || coerce(fn)(u) }

/** Composites */
export function isNumeric(x: number | bigint | Unknown) { return typeof x === 'number' || typeof x === 'bigint' }
export function isNullable(x: null | undefined | Unknown) { return x == null }


type Target<S> = S extends { (_: any): _ is infer T } ? T : S extends { (x: infer T): boolean } ? T : never
type Object$<T extends { [x: string]: { (x: any): boolean } | { (x: any): x is unknown } }> = (x: unknown) => x is { [K in keyof T]: Target<T[K]> }

function isOptionalSchema(x: unknown): x is ((x: unknown) => x is unknown) & { [symbol.tag]: URI.optional, def: (x: unknown) => x is unknown } {
  return !!x && (typeof x === 'object' || typeof x === 'function') && 'tag' in x && x.tag === URI.optional && 'def' in x && typeof x.def === 'function'
}
function isRequiredSchema<T>(x: unknown): x is (_: unknown) => _ is T {
  return !!x && !isOptionalSchema(x)
}
function isOptionalNotUndefinedSchema<T>(x: unknown): x is {} {
  return !!x && isOptionalSchema(x) && x.def(undefined) === false
}
function isUndefinedSchema(x: unknown): x is { tag: URI.undefined } {
  return !!x && typeof x === 'function' && 'tag' in x && x.tag === URI.undefined
}

function hasOwn<K extends keyof any>(x: unknown, key: K): x is { [P in K]: unknown }
function hasOwn(x: unknown, key: keyof any): x is { [x: string]: unknown } {
  return typeof x === 'function' ? Object_hasOwn(x, key)
    : typeof key === "symbol"
      ? isComposite(x) && key in x
      : Object_hasOwn(x, key)
}

export function exactOptional(
  fns: Record<string, (x: unknown) => boolean>,
  xs: Record<string, unknown>
): boolean {
  for (const k in fns) {
    const fn = coerce(fns[k])
    switch (true) {
      // case q === (globalThis.Boolean as never): { if (Object_hasOwn(x, k)) return x[k] != null; else return false }
      case isUndefinedSchema(fn) && !Object_hasOwn(xs, k): return false
      case isOptionalNotUndefinedSchema(fn) && Object_hasOwn(xs, k) && xs[k] === undefined: return false
      case isOptionalSchema(fn) && !Object_hasOwn(xs, k): continue
      case isRequiredSchema(fn) && !Object_hasOwn(xs, k): return false
      case !fn(xs[k]): return false
      default: continue
    }
  }
  return true
}

export function presentButUndefinedIsOK(
  fns: Record<string, (x: unknown) => boolean>,
  x: Record<string, unknown>
): boolean {
  for (const k in fns) {
    const fn = coerce(fns[k])
    switch (true) {
      // case fn === (globalThis.Boolean as never): { if (hasOwn(x, k)) return x[k] != null; else return false }
      case isOptionalSchema(fn) && !hasOwn(x, k): continue
      case isOptionalSchema(fn) && hasOwn(x, k) && x[k] === undefined: continue
      case isOptionalSchema(fn) && hasOwn(x, k) && fn(x[k]): continue
      case isOptionalSchema(fn) && hasOwn(x, k) && !fn(x[k]): return false
      case isRequiredSchema(fn) && !hasOwn(x, k): return false
      case isRequiredSchema(fn) && hasOwn(x, k) && fn(x[k]) === true: continue
      default: return false
    }
  }
  return true
}

export function treatUndefinedAndOptionalAsTheSame(
  fns: Record<string, (x: unknown) => boolean>,
  x: Record<string, unknown>
) {
  const ks = Object_keys(fns)
  for (const k of ks) {
    const fn = coerce(fns[k])
    const y = x[k]
    if (!fn(y)) return false
  }
  return true
}

export function object<T>(
  fns: { [K in keyof T]: (x: unknown) => x is T[K] },
  config?: Required<SchemaOptions>,
): (x: T | Unknown) => x is T {
  return function isFiniteObject(x: unknown): x is never {
    switch (true) {
      case !x: return false
      case !isAnyObject(x): return false
      case !config?.treatArraysAsObjects && Array_isArray(x): return false
      case config?.optionalTreatment === 'exactOptional': return exactOptional(fns, x)
      case config?.optionalTreatment === 'presentButUndefinedIsOK': return presentButUndefinedIsOK(fns, x)
      case config?.optionalTreatment === 'treatUndefinedAndOptionalAsTheSame': return treatUndefinedAndOptionalAsTheSame(fns, x)
      default: throw globalThis.Error(

        '(["@traversable/schema-core/predicates/object$"]  \
                                                      \
          Expected "optionalTreatment" to be one of:  \
                                                      \
            - "exactOptional"                         \
            - "presentButUndefinedIsOK"               \
            - "treatUndefinedAndOptionalAsTheSame"    \
                                                      \
          Got: ' + globalThis.JSON.stringify(config?.optionalTreatment)
      )
    }
  }
}

export type TupleOptions = { minLength?: number; } & SchemaOptions

export let tuple
  : <
    T extends readonly unknown[],
    Opts extends TupleOptions
  >(
    fns: { [I in keyof T]: (u: unknown) => u is T[I] },
    options: Opts
  ) => ((u: unknown) => u is T)

  = (fns, options) => {
    const checkLength = (xs: readonly unknown[]) =>
      options?.minLength === void 0
        ? (xs.length === fns.length)
        : options.minLength === -1
          ? (xs.length === fns.length)
          : (xs.length >= options.minLength && fns.length >= xs.length)

    function isFiniteArray(u: unknown): u is never {
      return Array_isArray(u)
        && checkLength(u)
        && fns.every((fn, ix) => coerce(fn)(u[ix]))
    }

    return isFiniteArray
  }

