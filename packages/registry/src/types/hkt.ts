import type { newtype } from './newtype.js'

export interface HKT<I = unknown, O = unknown> extends newtype<{ [0]: I, [-1]: O }> { _applied?: unknown }

export type Kind<F extends HKT, T extends F[0] = F[0]> = (F & { [0]: T })[-1]

export declare namespace Kind {
  export type infer<G extends HKT> = G extends
    & { [0]: G[0 & keyof G]; _applied: G["_applied" & keyof G] }
    & (infer F extends HKT)
    ? F
    : never
}

export interface Comparator<in T> { (left: T, right: T): number }
export interface Eq<in T> { (left: T, right: T): boolean }
export interface Dictionary<T = unknown> { [x: string]: T }

interface Record<K extends keyof any = string, V = unknown> extends newtype<globalThis.Record<K, V>> { }
interface Array<T = unknown> extends newtype<T[]> { }
interface ReadonlyArray<T = unknown> extends newtype<readonly T[]> { }

export declare namespace Type {
  export {
    Comparator,
    Eq,
    Dictionary,
    Array,
    Record,
    ReadonlyArray,
  }
}

export interface Const<T = unknown> extends HKT { [-1]: T }
export interface Identity extends HKT { [-1]: this[0] }

export declare namespace TypeConstructor { export { Const, Identity } }
export declare namespace TypeConstructor {
  interface Eq extends HKT { [-1]: Type.Eq<this[0]> }
  interface Comparator extends HKT { [-1]: Type.Comparator<this[0]> }
  interface Duplicate extends HKT { [-1]: [this[0], this[0]] }
  interface Array extends HKT { [-1]: Type.Array<this[0]> }
  interface ReadonlyArray extends HKT { [-1]: Type.ReadonlyArray<this[0]> }
  interface Record extends HKT<[keyof any, unknown]> { [-1]: Type.Record<this[0][0], this[0][1]> }
  interface Dictionary extends HKT { [-1]: Type.Dictionary<this[0]> }
}
