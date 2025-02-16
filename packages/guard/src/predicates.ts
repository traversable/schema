import { symbol as Symbol, URI } from './uri.js'
import type { type } from './type.js'
import type { Predicate } from './types.js'
import type * as AST from './ast.js'

/** @internal */
const Array_isArray = globalThis.Array.isArray

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

/////////////////////
///    nullary    ///
export const function_ = (u: unknown): u is (...args: any) => unknown => typeof u === "function"
function_[Symbol.tag] = URI.tag

export const null_ = (u: unknown): u is null => u === null
null_[Symbol.tag] = URI.null

export const undefined_ = (u: unknown): u is undefined => u === undefined
undefined_[Symbol.tag] = URI.undefined

export const any = (u: unknown): u is unknown => true
any[Symbol.tag] = URI.any

export const never = (u: unknown): u is never => false
never[Symbol.tag] = URI.never

array[Symbol.tag] = URI.array
export function array(u: unknown): u is readonly unknown[] {
  return Array_isArray(u)
}

// export const bigint = (u: unknown): u is bigint => typeof u === "bigint"
// bigint[Symbol.tag] = URI.bigint

export { bigint$ as bigint }
const bigint$: bigint$ = <never>((u: unknown) => typeof u === "bigint")
interface bigint$ { (u: unknown): u is bigint, [Symbol.tag]: URI.bigint, [Symbol.def]: type.bigint, [Symbol.type]: bigint }
bigint$[Symbol.tag] = URI.bigint

export { boolean$ as boolean }
const boolean$: boolean$ = <never>((u: unknown) => typeof u === "boolean")
interface boolean$ { (u: unknown): u is boolean, [Symbol.tag]: URI.boolean, [Symbol.def]: type.boolean, [Symbol.type]: boolean }
boolean$[Symbol.tag] = URI.boolean

export { number$ as number }
const number$: number$ = <never>((u: unknown) => typeof u === "number")
interface number$ { (u: unknown): u is number, [Symbol.tag]: URI.number, [Symbol.def]: type.number, [Symbol.type]: number }
number$[Symbol.tag] = URI.number

export { string$ as string }
const string$: string$ = <never>((u: unknown) => typeof u === "string")
interface string$ { (u: unknown): u is string, [Symbol.tag]: URI.string, [Symbol.def]: type.string, [Symbol.type]: string }
string$[Symbol.tag] = URI.string

export { symbol$ as symbol }
const symbol$: symbol$ = <never>((u: unknown) => typeof u === "symbol")
interface symbol$ { (u: unknown): u is symbol, [Symbol.tag]: URI.symbol_, [Symbol.def]: type.symbol, [Symbol.type]: symbol }
symbol$[Symbol.tag] = URI.symbol_


// integer[Symbol.tag] = URI.integer
export function integer(u: unknown): u is number {
  return globalThis.Number.isInteger(u)
}


export const object = (u: unknown): u is { [x: string]: unknown } =>
  u !== null && typeof u === "object" && !Array_isArray(u)

object[Symbol.tag] = URI.object


///    type-guards    ///
/////////////////////////

///////////////////////
///    composite    ///
literally[Symbol.tag] = URI.const
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

key[Symbol.tag] = URI.key

export const nonnullable = (u: {} | null | undefined): u is {} => u != null
nonnullable[Symbol.key] = URI.nonnullable

export const showable = (u: unknown): u is boolean | number | bigint | string => u == null
  || typeof u === "boolean"
  || typeof u === "number"
  || typeof u === "bigint"
  || typeof u === "string"
export const scalar = (u: unknown): u is undefined | null | boolean | number | string => u == null
  || typeof u === "boolean"
  || typeof u === "number"
  || typeof u === "string"
export const primitive = (u: unknown) => u == null
  || typeof u === "boolean"
  || typeof u === "number"
  || typeof u === "bigint"
  || typeof u === "string"
  || typeof u === "symbol"

export const true_ = (u: unknown): u is true => u === true
export const false_ = (u: unknown): u is false => u === false

export const defined = (u: {} | null | undefined): u is {} | null => u !== undefined
export const notnull = (u: {} | null | undefined): u is {} | undefined => u !== null
export const nullable = (u: {} | null | undefined): u is null | undefined => u == null

export const nonempty = {
  array: <T>(xs: T[] | readonly T[]): xs is { [0]: T } & typeof xs => xs.length > 1
}

const isObject
  : (u: unknown) => u is { [x: string]: unknown }
  = (u): u is never => !!u && typeof u === "object"

function isOptionalSchema<T>(u: unknown): u is AST.optional<T> {
  return !!u && (u as { [x: symbol]: unknown })[Symbol.tag] === URI.optional
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
function isAnySchema(u: unknown): u is AST.any {
  return !!u && (u as { [x: symbol]: unknown })[Symbol.tag] === URI.any
}
function isUnknownSchema(u: unknown): u is AST.any {
  return !!u && (u as { [x: symbol]: unknown })[Symbol.tag] === URI.any
}

export function exactOptional<T extends { [x: string]: (u: any) => boolean }>
  (shape: T, u: Record<string, unknown>): boolean
export function exactOptional<T extends { [x: number]: (u: any) => boolean }>
  (shape: T, u: Record<string, unknown>): boolean
export function exactOptional<T extends { [x: string]: (u: any) => boolean }>
  (qs: T, u: Record<string, unknown>) {
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

function treatUndefinedAndOptionalAsTheSame<T extends { [x: number]: (u: any) => boolean }>(qs: T, u: { [x: string]: unknown }) {
  for (const k in qs) {
    const q = qs[k]
    if (!q(u[k])) return false
  }
  return true
}

export { object$ }
function object$<T extends { [x: string]: (u: any) => boolean }>(
  qs: T,
  $: Required<object$.Options>,
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

        '(["@traversable/guard/predicates/object$"]   \
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

export function parseArgs<
  F extends readonly unknown[],
  Opts extends { [x: string]: unknown }
>(
  fallbacks: Opts,
  args: [...F] | [...F, $: Opts]
): [F, Opts]
//
export function parseArgs<
  F extends readonly unknown[],
  Opts extends { [x: string]: unknown }
>(
  fallbacks: Opts,
  args: [...F] | [...F, $: Opts]
) {
  const last = args.at(-1)
  if (typeof last === 'function') return [args, fallbacks]
  else return [args.slice(1), last ?? fallbacks]
}

// function tuple$<Opts extends { [x: string]: unknown }>(fallbacks: Opts): 
//   <T extends readonly unknown[]>(...qs: { [Ix in keyof T]: Predicate<T[Ix]> }) => Predicate<T>

// function tuple$<Opts extends { [x: string]: unknown }>(fallbacks: Opts): 
//   <T extends readonly unknown[]>(...args: [...qs: { [Ix in keyof T]: Predicate<T[Ix]> }, $: Partial<Opts>]) => Predicate<T>

function tuple$<Opts extends { [x: string]: unknown }>(fallbacks: Opts) {
  return <T extends readonly unknown[]>(
    ...args:
      | [...qs: { [Ix in keyof T]: Predicate<T[Ix]> }]
      | [...qs: { [Ix in keyof T]: Predicate<T[Ix]> }, $: Partial<Opts>]
  ): Predicate<T> => {
    const [qs, $] = parseArgs(fallbacks, args)
    return (u: unknown) => array(u) && qs.every((q, ix) => q(u[ix]))
  }
}

declare namespace object$ {
  type Options = AST.Schema.Options
}
