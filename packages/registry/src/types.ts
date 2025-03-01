export type * from './types/functor.js'
export type * from './types/hkt.js'
export type * from './types/newtype.js'

export interface Eq<in T> { (left: T, right: T): boolean }

// data types
export type Primitive = null | undefined | symbol | boolean | number | bigint | string
export type Entry<T> = readonly [k: string, v: T]
export type Entries<T = unknown> = readonly Entry<T>[]

// transforms
export type Force<T> = never | { -readonly [K in keyof T]: T[K] }
export type Intersect<X, _ = unknown> = X extends readonly [infer H, ...infer T] ? Intersect<T, _ & H> : _

// infererence
export type Param<T> = T extends (_: infer I) => unknown ? I : never
