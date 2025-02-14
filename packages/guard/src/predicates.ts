import { symbol as Symbol, URI } from './uri.js'
import type { type } from './type.js'

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
  return globalThis.Array.isArray(u)
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


export const object = (u: unknown): u is { [x: string]: unknown } => u !== null && typeof u === "object"
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
