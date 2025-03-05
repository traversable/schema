import type { Intersect } from '@traversable/registry'
import { has, symbol as Symbol, URI } from '@traversable/registry'

import type * as AST from './ast.js'
import type { SchemaOptions } from './options.js'
import type { Predicate } from './types.js'

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
function hasOwn<K extends keyof any>(u: unknown, key: K): u is { [P in K]: unknown } {
  return typeof key === "symbol"
    ? isComposite(u) && key in u
    : Object_hasOwnProperty.call(u, key)
}

export const is = {
  has,
  array,
  record,
  union,
  intersect,
  optional,
  object,
  tuple,
}

function array<T>(guard: (u: unknown) => u is T): (u: unknown) => u is readonly T[] {
  return (u) => Array_isArray(u) && u.every(guard)
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

function optional<T>(guard: (u: unknown) => u is T): (u: unknown) => u is undefined | T {
  return (u: unknown) => u === void 0 || guard(u)
}

function object<T extends { [x: string]: (u: any) => boolean }>(
  qs: T,
  $: Required<SchemaOptions>,
) {
  return (u: unknown): boolean => {
    switch (true) {
      case !u: return false
      case !isComposite(u): return false
      case !$.treatArraysAsObjects && Array_isArray(u): return false
      case $.optionalTreatment === 'exactOptional': return exactOptional(qs, u)
      case $.optionalTreatment === 'presentButUndefinedIsOK': return presentButUndefinedIsOK(qs, u)
      case $.optionalTreatment === 'treatUndefinedAndOptionalAsTheSame': return treatUndefinedAndOptionalAsTheSame(qs, u)
      default: throw globalThis.Error('               \
                                                      \
        ["@traversable/schema/predicates/object$"]    \
                                                      \
          Expected "optionalTreatment" to be one of:  \
                                                      \
            • "exactOptional"                         \
            • "presentButUndefinedIsOK"               \
            • "treatUndefinedAndOptionalAsTheSame"    \
                                                      \
          Got:                                        \
        ' + globalThis.JSON.stringify($.optionalTreatment)
      )
    }
  }
}

function isOptionalSchema<T>(u: unknown): u is ((u: unknown) => u is unknown) & { tag: URI.optional } {
  return !!u && (u as { tag: string }).tag === URI.optional
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

function exactOptional<T extends { [x: string]: (u: any) => boolean }>
  (shape: T, u: globalThis.Record<string, unknown>): boolean
function exactOptional<T extends { [x: number]: (u: any) => boolean }>
  (shape: T, u: globalThis.Record<string, unknown>): boolean
function exactOptional<T extends { [x: string]: (u: any) => boolean }>
  (qs: T, u: globalThis.Record<string, unknown>) {
  for (const k in qs) {
    const q = qs[k]
    switch (true) {
      case isUndefinedSchema(q) && !hasOwn(u, k): return false
      case isOptionalNotUndefinedSchema(q) && hasOwn(u, k) && u[k] === undefined: return false
      case isOptionalSchema(q) && !hasOwn(u, k): continue
      case !q(u[k]): return false
      default: continue
    }
  }
  return true
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

function tuple<Opts extends { minLength?: number } & SchemaOptions>(options: Opts) {
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
