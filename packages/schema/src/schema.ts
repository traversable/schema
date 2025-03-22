import type * as T from './registry.js'
import type { TypeError } from '@traversable/registry'
import {
  fn,
  has,
  parseArgs,
  symbol,
  URI,
} from './registry.js'

import type {
  SchemaOptions as Options,
} from './options.js'
import type {
  Guard,
  Label,
  Predicate as AnyPredicate,
  Typeguard,
  TypePredicate,
  ValidateTuple,
} from './types.js'
import { is as guard } from './predicates.js'
import {
  applyOptions,
  getConfig,
} from './config.js'

/** @internal */
const Object_keys = globalThis.Object.keys

/** @internal */
const Number_isInteger = globalThis.Number.isInteger

/** @internal */
const isPredicate
  : <S, T extends S>(src: unknown) => src is { (): boolean; (x: S): x is T }
  = (src: unknown): src is never => typeof src === 'function'

export type Source<T> = T extends (_: infer S) => unknown ? S : unknown
export type Target<S> = never | S extends (_: any) => _ is infer T ? T : S
export type Inline<S> = never | inline<Target<S>>
export type Predicate = AnyPredicate | Schema
export type Force<T> = never | { -readonly [K in keyof T]: T[K] }
export type Optional<S, K extends keyof S = keyof S> = never |
  string extends K ? string : K extends K ? S[K] extends bottom | optional<any> ? K : never : never
export type Required<S, K extends keyof S = keyof S> = never |
  string extends K ? string : K extends K ? S[K] extends bottom | optional<any> ? never : K : never
export type Entry<S>
  = S extends { def: unknown } ? S
  : S extends Guard<infer T> ? inline<T>
  : S extends globalThis.BooleanConstructor ? nonnullable
  : S extends (() => infer _ extends boolean)
  ? BoolLookup[`${_}`]
  : S
export type BoolLookup = never | {
  true: top
  false: bottom
  boolean: unknown_
}

export type typeOf<
  T extends { _type?: unknown },
  _ extends
  | T['_type']
  = T['_type']
> = never | _

export interface Unspecified extends LowerBound { }
export interface LowerBound {
  (u: unknown): u is any
  tag?: Tag
  def?: unknown
  _type?: unknown
}

export interface Schema<Fn extends LowerBound = Unspecified>
  extends TypePredicate<Source<Fn>, Fn['_type']> {
  tag?: Fn['tag']
  def?: Fn['def']
  _type?: Fn['_type']
}

export interface FullSchema<T = unknown> {
  (u: unknown): u is T
  tag: typeof tags[number]
  def?: unknown
  _type: T
}

export type F<T> =
  | Leaf
  | eq<T>
  | array<T>
  | record<T>
  | optional<T>
  | union<readonly T[]>
  | intersect<readonly T[]>
  | tuple<readonly T[]>
  | object_<{ [x: string]: T }>

export type Fixpoint =
  | Leaf
  | eq<Fixpoint>
  | intersect<readonly Fixpoint[]>
  | array<Fixpoint>
  | record<Fixpoint>
  | optional<Fixpoint>
  | union<readonly Fixpoint[]>
  | tuple<readonly Fixpoint[]>
  | object_<{ [x: string]: Fixpoint }>

export interface Free extends T.HKT { [-1]: F<this[0]> }

export function inline<S extends Guard>(guard: S): inline<S>
export function inline<S extends Predicate>(guard: S): inline<Entry<S>>
export function inline<S>(guard: (Guard<S>) & { tag?: URI.inline, def?: Guard<S> }) {
  guard.tag = URI.inline
  guard.def = guard
  return guard
}
export interface inline<S> extends inline.def<S> { }
export namespace inline {
  export interface def<T> extends Typeguard<Target<T>> { tag: URI.inline, def: T }
  export function def<T extends Guard>(guard: T): inline.def<T>
  export function def<T extends Guard>(guard: T) {
    function InlineSchema(src: unknown) { return guard(src) }
    InlineSchema.tag = URI.inline
    InlineSchema.def = guard
    return InlineSchema
  }
}

export interface top { tag: URI.top, readonly _type: unknown, def: this['_type'] }
export interface bottom { tag: URI.bottom, readonly _type: never, def: this['_type'] }
export interface invalid<_Err> extends TypeError<''>, never_ { }

export { void_ as void, void_ }
interface void_ extends Typeguard<void> { tag: URI.void, def: this['_type'] }
const void_ = <void_>function VoidSchema(src: unknown) { return src === void 0 }
void_.tag = URI.void
void_.def = void 0

export { null_ as null, null_ }
interface null_ extends Typeguard<null> { tag: URI.null, def: this['_type'] }
const null_ = <null_>function NullSchema(src: unknown) { return src === null }
null_.tag = URI.null
null_.def = null

export { never_ as never }
interface never_ extends Typeguard<never> { tag: URI.never, def: this['_type'] }
const never_ = <never_>function NeverSchema(src: unknown) { return false }
never_.tag = URI.never
never_.def = void 0 as never

export { unknown_ as unknown }
interface unknown_ extends Typeguard<unknown> { tag: URI.unknown, def: this['_type'] }
const unknown_ = <unknown_>function UnknownSchema(src: unknown) { return true }
unknown_.tag = URI.unknown
unknown_.def = void 0

export { any_ as any }
interface any_ extends Typeguard<any> { tag: URI.any, def: this['_type'] }
const any_ = <any_>function AnySchema(src: unknown) { return true }
any_.tag = URI.any
any_.def = void 0

export { undefined_ as undefined }
interface undefined_ extends Typeguard<undefined> { tag: URI.undefined, def: this['_type'] }
const undefined_ = <undefined_>function UndefinedSchema(src: unknown) { return src === void 0 }
undefined_.tag = URI.undefined
undefined_.def = void 0

export { symbol_ as symbol }
interface symbol_ extends Typeguard<symbol> { tag: URI.symbol, def: this['_type'] }
const symbol_ = <symbol_>function SymbolSchema(src: unknown) { return typeof src === 'symbol' }
symbol_.tag = URI.symbol
symbol_.def = Symbol()

export { boolean_ as boolean }
interface boolean_ extends Typeguard<boolean> { tag: URI.boolean, def: this['_type'] }
const boolean_ = <boolean_>function BooleanSchema(src: unknown) { return src === true || src === false }
boolean_.tag = URI.boolean
boolean_.def = false

export { integer }
interface integer extends Typeguard<number> { tag: URI.integer, def: this['_type'] }
const integer = <integer>function IntegerSchema(src: unknown) { return Number_isInteger(src) }
integer.tag = URI.integer
integer.def = 0

export { bigint_ as bigint }
interface bigint_ extends Typeguard<bigint> { tag: URI.bigint, def: this['_type'] }
const bigint_ = <bigint_>function BigIntSchema(src: unknown) { return typeof src === 'bigint' }
bigint_.tag = URI.bigint
bigint_.def = 0n

export { number_ as number }
interface number_ extends Typeguard<number> { tag: URI.number, def: this['_type'] }
const number_ = <number_>function NumberSchema(src: unknown) { return typeof src === 'number' }
number_.tag = URI.number
number_.def = 0

export { string_ as string }
interface string_ extends Typeguard<string> { tag: URI.string, def: this['_type'] }
const string_ = <string_>function StringSchema(src: unknown) { return typeof src === 'string' }
string_.tag = URI.string
string_.def = ''

export { nonnullable }
interface nonnullable extends Typeguard<{}> { tag: URI.nonnullable, def: this['_type'] }
const nonnullable = <nonnullable>function NonNullableSchema(src: unknown) { return src != null }
nonnullable.tag = URI.nonnullable
nonnullable.def = {}

export function eq<const V extends T.Mut<V>>(value: V, options?: Options): eq<T.Mutable<V>>
export function eq<const V>(value: V, options?: Options): eq<V>
export function eq<const V>(value: V, options?: Options): eq<V> { return eq.def(value, options) }
export interface eq<V> { (u: unknown): u is V, tag: URI.eq, def: V, _type: V }
export namespace eq {
  export function def<T>(value: T, options?: Options): eq<T>
  export function def<T>(x: T, $: Options = getConfig().schema) {
    const eqGuard = isPredicate(x) ? x : (y: unknown) => applyOptions($).eq.equalsFn(y, x)
    function EqSchema(src: unknown) { return eqGuard(src) }
    EqSchema.tag = URI.eq
    EqSchema.def = x
    return EqSchema
  }
}

export function optional<S extends Schema>(schema: S): optional<S>
export function optional<S extends Predicate>(schema: S): optional<Inline<S>>
export function optional<S>(schema: S): optional<S> { return optional.def(schema) }
export interface optional<S> {
  tag: URI.optional
  def: S
  [symbol.optional]: number
  _type: undefined | S['_type' & keyof S]
  (u: unknown): u is this['_type']
}
export namespace optional {
  export function def<T>(x: T): optional<T>
  export function def<T>(x: T) {
    const optionalGuard = isPredicate(x) ? guard.optional(x) : (_: any) => true
    function OptionalSchema(src: unknown) { return optionalGuard(src) }
    OptionalSchema.tag = URI.optional
    OptionalSchema.def = x
    OptionalSchema[symbol.optional] = 1
    return OptionalSchema
  }
  export const is
    : <S extends Schema>(u: unknown) => u is optional<S>
    = (u): u is never => has('tag', (tag) => tag === URI.optional)(u)
}

export function array<S extends Schema>(schema: S, readonly: 'readonly'): ReadonlyArray<S>
export function array<S extends Schema>(schema: S): array<S>
export function array<S extends { (u: unknown): boolean } | Predicate>(schema: S): array<Inline<S>>
export function array<S extends Schema>(schema: S): array<S> { return array.def(schema) }
export interface array<S> {
  (u: unknown): u is this['_type']
  tag: URI.array
  def: S
  _type: S['_type' & keyof S][]
}
export namespace array {
  export function def<T>(x: T): array<T>
  export function def<T>(x: T) {
    const arrayGuard = isPredicate(x) ? guard.array(x) : guard.anyArray
    function ArraySchema(src: unknown) { return arrayGuard(src) }
    ArraySchema.tag = URI.array
    ArraySchema.def = x
    return ArraySchema
  }
}
export interface ReadonlyArray<S extends Schema = Unspecified> {
  (u: unknown): u is this['_type']
  tag: URI.array
  def: S
  _type: readonly S['_type' & keyof S][]
}

export function record<S extends Schema>(schema: S): record<S>
export function record<S extends Predicate>(schema: S): record<Inline<S>>
export function record<S extends Schema>(schema: S) { return record.def(schema) }
export interface record<S> { (u: unknown): u is this['_type'], tag: URI.record, def: S, _type: Record<string, S['_type' & keyof S]> }
export namespace record {
  export function def<T>(x: T): record<T>
  export function def<T>(x: T) {
    const recordGuard = isPredicate(x) ? guard.record(x) : guard.anyObject
    function RecordGuard(src: unknown) { return recordGuard(src) }
    RecordGuard.tag = URI.record
    RecordGuard.def = x
    return RecordGuard
  }
}

export function union<S extends readonly Schema[]>(...schemas: S): union<S>
export function union<S extends readonly Predicate[], T extends { [I in keyof S]: Entry<S[I]> }>(...schemas: S): union<T>
export function union<S extends Predicate[]>(...schemas: S): {} { return union.def(schemas) }
export interface union<S> {
  (u: unknown): u is this['_type']
  tag: URI.union
  def: S
  _type: S[number & keyof S]['_type' & keyof S[number & keyof S]]
}
export namespace union {
  export function def<T extends readonly unknown[]>(xs: T): union<T>
  export function def<T extends readonly unknown[]>(xs: T) {
    const anyOf = xs.every(isPredicate) ? guard.union(xs) : guard.unknown
    function UnionSchema(src: unknown) { return anyOf(src) }
    UnionSchema.tag = URI.union
    UnionSchema.def = xs
    return UnionSchema
  }
}

export function intersect<S extends readonly Schema[]>(...schemas: S): intersect<S>
export function intersect<
  S extends readonly Predicate[],
  T extends { [I in keyof S]: Entry<S[I]> } = { [I in keyof S]: Entry<S[I]> }
>(...schemas: S): intersect<T>
export function intersect<S extends unknown[]>(...schemas: S): intersect<S> { return intersect.def(schemas) }
export interface intersect<S> { (u: unknown): u is this['_type'], tag: URI.intersect, def: S, _type: intersect._type<S> }
export namespace intersect {
  export type _type<Todo, Out = unknown>
    = Todo extends readonly [infer H, ...infer T]
    ? intersect._type<T, Out & H['_type' & keyof H]>
    : Out
  export function def<T extends readonly unknown[]>(xs: T): intersect<T>
  export function def<T extends readonly unknown[]>(xs: T) {
    const allOf = xs.every(isPredicate) ? guard.intersect(xs) : guard.unknown
    function IntersectSchema(src: unknown) { return allOf(src) }
    IntersectSchema.tag = URI.intersect
    IntersectSchema.def = xs
    return IntersectSchema
  }
}

export function tuple<S extends readonly Schema[]>(...schemas: tuple.validate<S>):
  tuple<tuple.from<tuple.validate<S>, S>>
export function tuple<
  S extends readonly AnyPredicate[],
  T extends { [I in keyof S]: Entry<S[I]> }
>(...schemas: tuple.validate<S>):
  tuple<tuple.from<tuple.validate<S>, T>>
export function tuple<S extends readonly Schema[]>(...args: [...schemas: tuple.validate<S>, options: Options]):
  tuple<tuple.from<tuple.validate<S>, S>>
export function tuple<
  S extends readonly Predicate[],
  T extends { [I in keyof S]: Entry<S[I]> }
>(...args: [...schemas: tuple.validate<S>, options: Options]):
  tuple<tuple.from<tuple.validate<S>, T>>
//
export function tuple<S extends readonly Predicate[]>(...args: | [...S] | [...S, Options]) {
  return tuple.def(...parseArgs(getConfig().schema, args))
}
export interface tuple<S> { (u: unknown): u is this['_type'], tag: URI.tuple, def: S, _type: TupleType<S> }
export namespace tuple {
  export function def<T extends readonly unknown[]>(xs: T, $?: Options): tuple<T>
  export function def<T extends readonly unknown[]>(xs: T, $: Options = getConfig().schema) {
    const options = {
      ...$, minLength: $.optionalTreatment === 'treatUndefinedAndOptionalAsTheSame' ? -1 : xs.findIndex(optional.is)
    } satisfies tuple.InternalOptions
    const tupleGuard = xs.every(isPredicate) ? guard.tuple(options)(xs) : guard.anyArray
    function TupleSchema(src: unknown) { return tupleGuard(src) }
    TupleSchema.tag = URI.tuple
    TupleSchema.def = xs
    return TupleSchema
  }
}
export declare namespace tuple {
  type validate<T extends readonly unknown[]> = ValidateTuple<T, optional<any>>
  type from<V extends readonly unknown[], T extends readonly unknown[]>
    = TypeError extends V[number] ? { [I in keyof V]: V[I] extends TypeError ? invalid<Extract<V[I], TypeError>> : V[I] } : T
  type _type<T> = never | TupleType<T>
  type InternalOptions = { minLength?: number }
}
export type TupleType<T, Out extends readonly unknown[] = []> = never
  | optional<any> extends T[number & keyof T]
  ? T extends readonly [infer Head, ...infer Tail]
  ? [Head] extends [optional<any>] ? Label<
    { [ix in keyof Out]: Out[ix]['_type' & keyof Out[ix]] },
    { [ix in keyof T]: T[ix]['_type' & keyof T[ix]] }
  >
  : TupleType<Tail, [...Out, Head]>
  : never
  : { [ix in keyof T]: T[ix]['_type' & keyof T[ix]] }
  ;

export { object_ as object }
function object_<
  S extends { [x: string]: Schema },
  T extends { [K in keyof S]: Entry<S[K]> }
>(schemas: S, options?: Options): object_<T>
function object_<
  S extends { [x: string]: Predicate },
  T extends { [K in keyof S]: Entry<S[K]> }
>(schemas: S, options?: Options): object_<T>
//
function object_<S extends { [x: string]: Schema }>(schemas: S, options?: Options) { return object_.def(schemas, options) }
interface object_<S> {
  tag: URI.object
  def: S
  _opt: Optional<S>
  _req: Required<S>
  _type: Force<
    & { [K in this['_req']]-?: S[K]['_type' & keyof S[K]] }
    & { [K in this['_opt']]+?: S[K]['_type' & keyof S[K]] }
  >
  (u: unknown): u is this['_type']
}

namespace object_ {
  export function def<T extends { [x: string]: unknown }>(xs: T, $?: Options): object_<T>
  export function def<T extends { [x: string]: unknown }>(xs: T, $?: Options): {} {
    const opt = Object_keys(xs).filter((k) => optional.is(xs[k]))
    const objectGuard = guard.record(isPredicate)(xs)
      ? guard.object(fn.map(xs, (x) => x === globalThis.Boolean ? nonnullable : x), applyOptions($))
      : guard.anyObject
    function ObjectSchema(src: unknown) { return objectGuard(src) }
    ObjectSchema.tag = URI.object
    ObjectSchema.def = xs
    ObjectSchema.opt = opt
    return ObjectSchema
  }
}

export type Leaf = typeof leaves[number]
export type Tag = typeof tags[number]
export const leaves = [unknown_, never_, any_, void_, undefined_, null_, symbol_, bigint_, boolean_, integer, number_, string_]
export const isLeaf = (u: unknown): u is Leaf => has('tag', (tag) => typeof tag === 'string')(u) && (<string[]>leafTags).includes(u.tag)
export const leafTags = leaves.map((leaf) => leaf.tag)
export const tags = [...leafTags, URI.optional, URI.eq, URI.array, URI.record, URI.tuple, URI.union, URI.intersect, URI.object]

export declare namespace Functor { type Index = (keyof any)[] }
export const Functor: T.Functor<Free, Fixpoint> = {
  map(f) {
    return (x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case isLeaf(x): return x
        case x.tag === URI.eq: return eq.def(x.def as never)
        case x.tag === URI.array: return array.def(f(x.def))
        case x.tag === URI.record: return record.def(f(x.def))
        case x.tag === URI.optional: return optional.def(f(x.def))
        case x.tag === URI.tuple: return tuple.def(fn.map(x.def, f))
        case x.tag === URI.object: return object_.def(fn.map(x.def, f))
        case x.tag === URI.union: return union.def(fn.map(x.def, f))
        case x.tag === URI.intersect: return intersect.def(fn.map(x.def, f))
      }
    }
  }
}

export const IndexedFunctor: T.Functor.Ix<Functor.Index, Free, Fixpoint> = {
  ...Functor,
  mapWithIndex(f) {
    return (x, ix) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case isLeaf(x): return x
        case x.tag === URI.eq: return eq.def(x.def as never)
        case x.tag === URI.array: return array.def(f(x.def, ix))
        case x.tag === URI.record: return record.def(f(x.def, ix))
        case x.tag === URI.optional: return optional.def(f(x.def, ix))
        case x.tag === URI.tuple: return tuple.def(fn.map(x.def, (y, iy) => f(y, [...ix, iy])))
        case x.tag === URI.object: return object_.def(fn.map(x.def, (y, iy) => f(y, [...ix, iy])))
        case x.tag === URI.union: return union.def(fn.map(x.def, (y, iy) => f(y, [...ix, symbol.union, iy])))
        case x.tag === URI.intersect: return intersect.def(fn.map(x.def, (y, iy) => f(y, [...ix, symbol.intersect, iy])))
      }
    }
  }
}

export const unfold = fn.ana(Functor)
export const fold = fn.cata(Functor)
export const foldWithIndex = fn.cataIx(IndexedFunctor)
