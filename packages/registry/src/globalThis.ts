import type {
  EmptyObject,
  FiniteArray,
  FiniteObject,
  NonFiniteArray,
  NonFiniteRecord,
  StringIndexed,
  NumberIndexed,
  PlainObject,
  SymbolIndexed,
  ObjectAsTypeAlias,
  MixedNonFinite,
  Entry,
} from './satisfies.js'
import { Force, newtype } from './types.js'

export const Array_isArray
  : <T>(u: unknown) => u is T[]
  = globalThis.Array.isArray

export const Math_max = globalThis.Math.max
export const Math_min = globalThis.Math.min

export const Number_isInteger
  : (x: unknown) => x is number
  = <never>globalThis.Number.isInteger

export const Number_isSafeInteger
  : (x: unknown) => x is number
  = <never>globalThis.Number.isSafeInteger

export const Object_assign = globalThis.Object.assign
export const Object_defineProperty = globalThis.Object.defineProperty
export const Object_is = globalThis.Object.is
export const Object_values = globalThis.Object.values

export const Object_hasOwn
  : <K extends keyof any>(u: unknown, k: K) => u is Record<K, unknown>
  = (u, k): u is never => !!u
    && (typeof u === 'object' || typeof u === 'function')
    && globalThis.Object.prototype.hasOwnProperty.call(u, k)

export const Object_keys
  : <K extends keyof T & string, T extends {}>(x: T) => (K)[]
  = globalThis.Object.keys

export const Object_getOwnPropertySymbols: {
  <K extends keyof T & symbol, T extends {}>(x: T): (K)[]
  (x: {}): symbol[]
  <K extends keyof T & symbol, T extends {}>(x: T): (K)[]
} = globalThis.Object.getOwnPropertySymbols

export type Object_fromEntries<T extends Entry.Any> = never | Force<
  & { [E in Entry.Optional<T> as E[0]]+?: E[1] }
  & { [E in Entry.Required<T> as E[0]]-?: E[1] }
>

export const Object_fromEntries: {
  <T extends Entry<T>>(entries: T[]): Object_fromEntries<T>
  <T extends Entry<T>>(entries: readonly T[]): Object_fromEntries<T>
} = globalThis.Object.fromEntries

export type Object_entries<T, K> = never | (K extends K ? [k: K, v: T[K & keyof T]] : never)[]
export const Object_entries: {
  <T extends MixedNonFinite<T>>(x: T): MixedNonFiniteEntries<T>
  <T extends EmptyObject<T>>(x: T): [k: string, v?: unknown][]
  <T extends PlainObject<T>>(x: T): [k: string, v: unknown][]
  <T extends FiniteArray<T>, K extends Extract<keyof T, `${number}`>>(x: T): Object_entries<T, K>
  <T extends FiniteObject<T>, K extends keyof T>(x: T): Object_entries<T, K>
  <T extends NonFiniteRecord<T>>(x: T): [k: keyof T, v: T[keyof T]][]
  <T extends StringIndexed<T>>(x: T): [k: keyof T, v: T[keyof T]][]
  <T extends NonFiniteArray<T>, K extends Extract<keyof T, `${number}`>>(x: T): [k: `${number}`, v: T[number]][]
  <T extends NumberIndexed<T>>(x: T): [k: string | number, v: T[keyof T]][]
  <T extends SymbolIndexed<T>>(x: T): [k: symbol, v: T[keyof T]][]
  <T extends ObjectAsTypeAlias<T>>(x: T): [k: string, v: T[keyof T]][]
} = globalThis.Object.entries as never

export type MixedNonFiniteEntries<
  T,
  O = [T] extends [T[number & keyof T][] & infer U] ? U : never,
  A = [T] extends [O & infer U] ? U : never
> = never | ([k: keyof O, v: O[keyof O]] | [k: `${number}`, v: A[number & keyof A]])[]
