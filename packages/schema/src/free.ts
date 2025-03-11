import type { Force, HKT } from './registry-types.js'
import type { Label } from './types.js'
import type { bottom, optional } from './core.js'

export interface Array extends HKT { [-1]: this[0]['_type' & keyof this[0]][] }
export interface ReadonlyArray extends HKT { [-1]: readonly this[0]['_type' & keyof this[0]][] }
export interface Record extends HKT { [-1]: globalThis.Record<string, this[0]['_type' & keyof this[0]]> }
export interface Optional extends HKT { [-1]: undefined | this[0]['_type' & keyof this[0]] }
export interface Object extends HKT { [-1]: Properties<this[0]> }
export interface Tuple<LowerBound = optional<any>> extends HKT { [-1]: Items<this[0], LowerBound> }
export interface Intersect extends HKT { [-1]: Intersection<this[0]> }
export interface Union extends HKT { [-1]: Unify<this[0]> }
/** @internal */
export type Unify<T> = never | T[number & keyof T]['_type' & keyof T[number & keyof T]]
/** @internal */
export type Intersection<Todo, Out = unknown>
  = Todo extends readonly [infer H, ...infer T]
  ? Intersection<T, Out & H['_type' & keyof H]>
  : Out
/** @internal */
export type Optionals<S, K extends keyof S = keyof S> =
  string extends K ? string : K extends K ? S[K] extends bottom | optional<any> ? K : never : never
/** @internal */
export type Properties<
  F,
  Opt extends Optionals<F> = Optionals<F>,
  Req extends globalThis.Exclude<keyof F, Opt> = globalThis.Exclude<keyof F, Opt>
> = Force<
  & { [K in Req]-?: F[K]['_type' & keyof F[K]] }
  & { [K in Opt]+?: F[K]['_type' & keyof F[K]] }
>
/** @internal */
export type Items<T, LowerBound = optional<any>, Out extends readonly unknown[] = []>
  = LowerBound extends T[number & keyof T]
  ? T extends readonly [infer Head, ...infer Tail]
  ? [Head] extends [LowerBound] ? Label<
    { [ix in keyof Out]: Out[ix]['_type' & keyof Out[ix]] },
    { [ix in keyof T]: T[ix]['_type' & keyof T[ix]] }
  >
  : Items<Tail, LowerBound, [...Out, Head]>
  : never
  : { [ix in keyof T]: T[ix]['_type' & keyof T[ix]] }
