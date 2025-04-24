import type { TypeError, URI, symbol } from '@traversable/registry'
import type { unknown } from './schemas/unknown.js'
import type { of } from './schemas/of.js'
import type { nonnullable } from './nonnullable.js'
import type { OPT, REQ } from './label.js'
import type { optional } from './schemas/optional.js'

export interface top { tag: URI.top, readonly _type: unknown, def: this['_type'] }
export interface bottom { tag: URI.bottom, readonly _type: never, def: this['_type'], [symbol.optional]: number }
export interface invalid<_Err> extends TypeError<''> { tag: URI.never }
export type InvalidItem = never | TypeError<'A required element cannot follow an optional element.'>
export type $<S> = [keyof S] extends [never] ? unknown : S
export type Entry<S>
  = S extends { def: unknown } ? S
  : S extends Guard<infer T> ? of<T>
  : S extends globalThis.BooleanConstructor ? nonnullable.core
  : S extends (() => infer _ extends boolean)
  ? BoolLookup[`${_}`]
  : S

export type Source<T> = T extends (_: infer S) => unknown ? S : unknown
export type Guarded<S> = never | S extends (_: any) => _ is infer T ? T : S
export type Target<S> = S extends Guard<infer T> ? T : S extends Predicate<infer T> ? T : never
export type SchemaLike = Schema | Predicate
export type Guard<T = unknown> = { (u: unknown): u is T }
export interface Typeguard<T = unknown> { (u: unknown): u is this['_type']; readonly _type: T }
export type { TypePredicate_ as TypePredicate }
type TypePredicate_<I = unknown, O = unknown> = never | TypePredicate<[I, O]>
interface TypePredicate<T extends [unknown, unknown]> {
  (u: T[0]): u is T[1]
}

export interface LowerBound<T = any> {
  (u: unknown): u is any
  tag: string
  def?: unknown
  _type?: T
}

export interface UnknownSchema {
  (u: unknown): u is any
  tag: string
  def: unknown
  _type: unknown
}

export interface Schema<Fn extends LowerBound = LowerBound> {
  tag?: any
  def?: Fn['def']
  _type?: Fn['_type']
  (u: unknown): u is this['_type']
}

export interface Predicate<T = unknown> {
  (value: T): boolean
  (value?: T): boolean
}

export type ValidateTuple<
  T extends readonly unknown[],
  LowerBound = optional<any>,
  V = ValidateOptionals<[...T], LowerBound>,
> = [V] extends [['ok']] ? T : V

export type ValidateOptionals<S extends unknown[], LowerBound = { [symbol.optional]: number }, Acc extends unknown[] = []>
  = LowerBound extends S[number]
  ? S extends [infer H, ...infer T]
  ? LowerBound extends Partial<H>
  ? T[number] extends LowerBound
  ? ['ok']
  : [...Acc, H, ...{ [Ix in keyof T]: T[Ix] extends LowerBound ? T[Ix] : InvalidItem }]
  : ValidateOptionals<T, LowerBound, [...Acc, H]>
  : ['ok']
  : ['ok']


export type Optional<S, K extends keyof S = keyof S> = never |
  string extends K ? string
  : K extends K ? S[K] extends bottom | { [symbol.optional]: any } ? K
  : never
  : never

export type Required<S, K extends keyof S = keyof S> = never |
  string extends K ? string
  : K extends K ? S[K] extends bottom | { [symbol.optional]: any } ? never
  : K
  : never

export type IntersectType<Todo, Out = unknown>
  = Todo extends readonly [infer H, ...infer T]
  ? IntersectType<T, Out & H['_type' & keyof H]>
  : Out

export type TupleType<S, Out extends readonly unknown[] = [], Opt = FirstOptionalItem<S>>
  = [Opt] extends [never] ? { [ix in keyof S]: S[ix]['_type' & keyof S[ix]] }
  : S extends readonly [infer Head, ...infer Tail]
  ? symbol.optional extends keyof Head ? Label<
    { [ix in keyof Out]: Out[ix]['_type' & keyof Out[ix]] },
    { [ix in keyof S]: S[ix]['_type' & keyof S[ix]] }
  >
  : TupleType<Tail, [...Out, Head]>
  : { [ix in keyof S]: S[ix]['_type' & keyof S[ix]] }

export type FirstOptionalItem<S, Offset extends 1[] = []>
  = S extends readonly [infer H, ...infer T]
  ? symbol.optional extends keyof H ? Offset['length']
  : FirstOptionalItem<T, [...Offset, 1]>
  : never

export type BoolLookup = never | {
  true: top
  false: bottom
  boolean: unknown.core
}

export type Label<
  Req extends readonly any[],
  Opt extends readonly any[]
> = [
    ...Label.Required<Req>,
    /* @ts-expect-error */
    ...Label.Optional<Req['length'], Opt>,
  ]

export declare namespace Label {
  type Required<
    S extends readonly unknown[],
    _ = REQ[S['length'] & keyof REQ]
  > = { [I in keyof _]: S[I & keyof S] }

  type Optional<
    Offset extends number,
    Base extends any[],
    /* @ts-expect-error */
    Start = OPT[Offset][Base['length']]
  > = { [I in keyof Start]: Base[I & keyof Base] }
}
