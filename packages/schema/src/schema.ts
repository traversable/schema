import type * as T from '@traversable/registry'
import type {
  HKT,
  Mut,
  Mutable,
  SchemaOptions as Options,
  TypeError,
} from '@traversable/registry'
import {
  applyOptions,
  fn,
  getConfig,
  has,
  parseArgs,
  symbol,
  URI,
} from '@traversable/registry'

import type {
  Guard,
  Label,
  Predicate as AnyPredicate,
  Typeguard,
  TypePredicate,
  ValidateTuple,
} from './types.js'
import { is as guard } from './predicates.js'

import type { Bounds } from './bounded.js'
import { within, withinBig } from './bounded.js'

/** @internal */
const Object_assign = globalThis.Object.assign

/** @internal */
const Object_keys = globalThis.Object.keys

/** @internal */
const Array_isArray = globalThis.Array.isArray

/** @internal */
const Number_isSafeInteger
  : (u: unknown) => u is number
  = globalThis.Number.isSafeInteger as never

/** @internal */
const Math_min = globalThis.Math.min
const Math_max = globalThis.Math.max

export const isPredicate
  : <S, T extends S>(src: unknown) => src is { (): boolean; (x: S): x is T }
  = (src: unknown): src is never => typeof src === 'function'

export type Source<T> = T extends (_: infer S) => unknown ? S : unknown
export type Target<S> = never | S extends (_: any) => _ is infer T ? T : S
export type Inline<S> = never | of<Target<S>>
export type Predicate = AnyPredicate | Schema
export type Force<T> = never | { -readonly [K in keyof T]: T[K] }
export type Optional<S, K extends keyof S = keyof S> = never |
  string extends K ? string : K extends K ? S[K] extends bottom | optional<any> ? K : never : never
export type Required<S, K extends keyof S = keyof S> = never |
  string extends K ? string : K extends K ? S[K] extends bottom | optional<any> ? never : K : never
export type Entry<S>
  = S extends { def: unknown } ? S
  : S extends Guard<infer T> ? of<T>
  : S extends globalThis.BooleanConstructor ? nonnullable
  : S extends (() => infer _ extends boolean)
  ? BoolLookup[`${_}`]
  : S
export type BoolLookup = never | {
  true: top
  false: bottom
  boolean: unknown_
}

export type IntersectType<Todo, Out = unknown>
  = Todo extends readonly [infer H, ...infer T] ? IntersectType<T, Out & H['_type' & keyof H]> : Out
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

export type typeOf<
  T extends { _type?: unknown },
  _ extends
  | T['_type']
  = T['_type']
> = never | _

export interface Unspecified extends LowerBound { }
export interface LowerBound {
  (u: unknown): u is any
  tag?: string
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

export type Unary =
  // | enum_<Unary>
  | eq<Unary>
  | array<Unary>
  | record<Unary>
  | optional<Unary>
  | union<Unary[]>
  | intersect<readonly Unary[]>
  | tuple<readonly Unary[]>
  | object_<{ [x: string]: Unary }>


export type F<T> =
  | Leaf
  // | enum_<readonly T[]>
  | eq<T>
  | array<T>
  | record<T>
  | optional<T>
  | union<T[]>
  | intersect<readonly T[]>
  | tuple<readonly T[]>
  | object_<{ [x: string]: T }>

export type Fixpoint =
  | Leaf
  | Unary

export interface Free extends HKT { [-1]: F<this[0]> }

export function of<S extends Guard>(guard: S): of<S>
export function of<S extends Predicate>(guard: S): of<Entry<S>>
export function of<S>(guard: (Guard<S>) & { tag?: URI.inline, def?: Guard<S> }) {
  guard.tag = URI.inline
  guard.def = guard
  return guard
}
export interface of<S> {
  (u: unknown): u is this['_type']
  _type: Target<S>
  tag: URI.inline
  def: S
}
export namespace of {
  export type type<S, T = Target<S>> = never | T
  export function def<T extends Guard>(guard: T): of<T>
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
interface integer extends Typeguard<number> {
  tag: URI.integer
  def: this['_type']
  min<T extends number>(minimum: T): integer.min<T>
  max<T extends number>(maximum: T): integer.max<T>
  gt<T extends number>(moreThan: T): integer.moreThan<T>
  lt<T extends number>(lessThan: T): integer.lessThan<T>
  btwn<Min extends number, Max extends number>(minimum: Min, maximum: Max): integer.btwn<[min: Min, max: Max]>
}
declare namespace integer {
  interface min<Min extends number> extends Typeguard<number> { tag: URI.integer, def: this['_type'], min: Min }
  interface max<Max extends number> extends Typeguard<number> { tag: URI.integer, def: this['_type'], max: Max }
  interface moreThan<Min extends number> extends Typeguard<number> { tag: URI.integer, def: this['_type'], gt: Min }
  interface lessThan<Max extends number> extends Typeguard<number> { tag: URI.integer, def: this['_type'], lt: Max }
  interface btwn<Bounds extends [min: number, max: number]> extends Typeguard<number> {
    tag: URI.integer
    def: this['_type']
    min: Bounds[0]
    max: Bounds[1]
  }
}
const integer = <integer>function IntegerSchema(src: unknown) { return Number_isSafeInteger(src) }
integer.tag = URI.integer
integer.def = 0
integer.min = (min) => Object_assign(boundedInteger({ gte: min }), { min })
integer.max = (max) => Object_assign(boundedInteger({ lte: max }), { max })
integer.gt = (gt) => Object_assign(boundedInteger({ gt }), { gt })
integer.lt = (lt) => Object_assign(boundedInteger({ lt }), { lt })
integer.btwn = (min, max) => Object_assign(
  boundedInteger({ gte: Math_min(min, max), lte: Math_max(min, max) }),
  { min: Math_min(min, max) as never, max: Math_max(min, max) as never }
)

export { bigint_ as bigint }
interface bigint_ extends Typeguard<bigint> {
  tag: URI.bigint
  def: this['_type']
  min<T extends bigint>(minimum: T): bigint_.min<T>
  max<T extends bigint>(maximum: T): bigint_.max<T>
  gt<T extends bigint>(moreThan: T): bigint_.moreThan<T>
  lt<T extends bigint>(lessThan: T): bigint_.lessThan<T>
  btwn<Min extends bigint, Max extends bigint>(minimum: Min, maximum: Max): bigint_.btwn<[min: Min, max: Max]>
}
declare namespace bigint_ {
  interface min<Min extends bigint> extends Typeguard<bigint> { tag: URI.bigint, def: this['_type'], min: Min }
  interface max<Max extends bigint> extends Typeguard<bigint> { tag: URI.bigint, def: this['_type'], max: Max }
  interface moreThan<Min extends bigint> extends Typeguard<bigint> { tag: URI.bigint, def: this['_type'], gt: Min }
  interface lessThan<Max extends bigint> extends Typeguard<bigint> { tag: URI.bigint, def: this['_type'], lt: Max }
  interface btwn<Bounds extends [min: bigint, max: bigint]> extends Typeguard<bigint> {
    tag: URI.bigint
    def: this['_type']
    min: Bounds[0]
    max: Bounds[1]
  }
}
const bigint_ = <bigint_>function BigIntSchema(src: unknown) { return typeof src === 'bigint' }
bigint_.tag = URI.bigint
bigint_.def = 0n
bigint_.min = (min) => Object_assign(boundedBigInt({ gte: min }), { min })
bigint_.max = (max) => Object_assign(boundedBigInt({ lte: max }), { max })
bigint_.gt = (gt) => Object_assign(boundedBigInt({ gt }), { gt })
bigint_.lt = (lt) => Object_assign(boundedBigInt({ lt }), { lt })
bigint_.btwn = (min, max) => Object_assign(
  boundedBigInt({ gte: max < min ? max : min, lte: max < min ? min : max }),
  { min: (max < min ? max : min) as never, max: (max < min ? min : max) as never }
)

export { number_ as number }
interface number_ extends Typeguard<number> {
  tag: URI.number
  def: this['_type']
  min<T extends number>(minimum: T): number_.min<T>
  max<T extends number>(maximum: T): number_.max<T>
  gt<T extends number>(moreThan: T): number_.moreThan<T>
  lt<T extends number>(lessThan: T): number_.lessThan<T>
  btwn<Min extends number, Max extends number>(minimum: Min, maximum: Max): number_.btwn<[min: Min, max: Max]>
}
declare namespace number_ {
  interface min<Min extends number> extends Typeguard<number> { tag: URI.number, def: this['_type'], min: Min }
  interface max<Max extends number> extends Typeguard<number> { tag: URI.number, def: this['_type'], max: Max }
  interface moreThan<Min extends number> extends Typeguard<number> { tag: URI.number, def: this['_type'], gt: Min }
  interface lessThan<Max extends number> extends Typeguard<number> { tag: URI.number, def: this['_type'], lt: Max }
  interface btwn<Bounds extends [min: number, max: number]> extends Typeguard<number> {
    tag: URI.number
    def: this['_type']
    min: Bounds[0]
    max: Bounds[1]
  }
}
const number_ = <number_>function NumberSchema(src: unknown) { return typeof src === 'number' }
number_.tag = URI.number
number_.def = 0
number_.min = (min) => Object_assign(boundedNumber({ gte: min }), { min })
number_.max = (max) => Object_assign(boundedNumber({ lte: max }), { max })
number_.gt = (gt) => Object_assign(boundedNumber({ gt }), { gt })
number_.lt = (lt) => Object_assign(boundedNumber({ lt }), { lt })
number_.btwn = (min, max) => Object_assign(
  boundedNumber({ gte: Math_min(min, max), lte: Math_max(min, max) }),
  { min: Math_min(min, max) as never, max: Math_max(min, max) as never }
)


export { string_ as string }
interface string_ extends Typeguard<string> {
  tag: URI.string
  def: this['_type']
  min<T extends number>(minLength: T): string_.min<T>
  max<T extends number>(maxLength: T): string_.max<T>
  shorterThan<T extends number>(shorterThan: T): string_.shorterThan<T>
  longerThan<T extends number>(longerThan: T): string_.longerThan<T>
  btwn<Min extends number, Max extends number>(minLength: Min, maxLength: Max): string_.btwn<[min: Min, max: Max]>
}
declare namespace string_ {
  interface min<Min extends number> extends Typeguard<string> { tag: URI.string, def: this['_type'], min: Min }
  interface max<Max extends number> extends Typeguard<string> { tag: URI.string, def: this['_type'], max: Max }
  interface longerThan<Min extends number> extends Typeguard<string> { tag: URI.string, def: this['_type'], gt: Min }
  interface shorterThan<Max extends number> extends Typeguard<string> { tag: URI.string, def: this['_type'], lt: Max }
  interface btwn<Bounds extends [min: number, max: number]> extends Typeguard<string> {
    tag: URI.string
    def: this['_type']
    min: Bounds[0]
    max: Bounds[1]
  }
}
const string_ = <string_>function StringSchema(src: unknown) { return typeof src === 'string' }
string_.tag = URI.string
string_.def = ''
string_.min = (min) => Object_assign(boundedString({ gte: min }), { min })
string_.max = (max) => Object_assign(boundedString({ lte: max }), { max })
string_.shorterThan = (lt) => Object_assign(boundedString({ lt }), { lt })
string_.longerThan = (gt) => Object_assign(boundedString({ gt }), { gt })
string_.btwn = (min, max) => Object_assign(
  boundedString({ gte: Math_min(min, max), lte: Math_max(min, max) }),
  { min: Math_min(min, max) as never, max: Math_max(min, max) as never }
)

export { nonnullable }
interface nonnullable extends Typeguard<{}> { tag: URI.nonnullable, def: this['_type'] }
const nonnullable = <nonnullable>function NonNullableSchema(src: unknown) { return src != null }
nonnullable.tag = URI.nonnullable
nonnullable.def = {}

export function eq<const V extends Mut<V>>(value: V, options?: Options): eq<Mutable<V>>
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
  export type type<S, T = undefined | S['_type' & keyof S]> = never | T
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
export function array<S extends Predicate>(schema: S): array<Inline<S>>
export function array<S extends Schema>(schema: S): array<S> { return array.def(schema) }
export interface array<S> {
  (u: unknown): u is this['_type']
  tag: URI.array
  def: S
  _type: S['_type' & keyof S][]
  min<Min extends number>(minLength: Min): array.min<Min, S>
  max<Max extends number>(maxLength: Max): array.max<Max, S>
  btwn<Min extends number, Max extends number>(minLength: Min, maxLength: Max): array.btwn<[min: Min, max: Max], S>
}
export namespace array {
  export type type<S, T = S['_type' & keyof S][]> = never | T
  export function def<S>(x: S): array<S>
  export function def<S>(x: S): {} {
    const arrayGuard = isPredicate(x) ? guard.array(x) : guard.anyArray
    const arrayMin: array<S>['min'] = (minLength) => Object_assign(boundedArray(x, { gte: minLength }), { min: minLength })
    const arrayMax: array<S>['max'] = (maxLength) => Object_assign(boundedArray(x, { lte: maxLength }), { max: maxLength })
    const arrayBtwn: array<S>['btwn'] = (min, max) => Object_assign(
      boundedArray(x, { gte: Math_min(min, max), lte: Math_max(max, min) }),
      { min: Math_min(min, max) as never, max: Math_max(min, max) as never }
    )
    function ArraySchema(src: unknown): src is array<S>['_type'] { return arrayGuard(src) }
    ArraySchema.tag = URI.array
    ArraySchema.def = x
    ArraySchema.min = arrayMin
    ArraySchema.max = arrayMax
    ArraySchema.btwn = arrayBtwn
    ArraySchema._type = void 0 as never
    return ArraySchema
  }
  export interface min<Min extends number, S> { tag: URI.array, (u: unknown): u is this['_type'], _type: S['_type' & keyof S][], def: S, min: Min }
  export interface max<Max extends number, S> { tag: URI.array, (u: unknown): u is this['_type'], _type: S['_type' & keyof S][], def: S, max: Max }
  export interface btwn<Bounds extends [min: number, max: number], S> { tag: URI.array, (u: unknown): u is this['_type'], _type: S['_type' & keyof S][], def: S, min: Bounds[0], max: Bounds[1] }
}

export const readonlyArray: {
  <S extends Schema>(schema: S, readonly: 'readonly'): ReadonlyArray<S>
  <S extends Predicate>(schema: S): ReadonlyArray<Inline<S>>
} = array
export interface ReadonlyArray<S> {
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
  export type type<S, T = Record<string, S['_type' & keyof S]>> = never | T
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
  export type type<S, T = S[number & keyof S]['_type' & keyof S[number & keyof S]]> = never | T
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
export function intersect<S extends readonly Predicate[], T extends { [I in keyof S]: Entry<S[I]> }>(...schemas: S): intersect<T>
export function intersect<S extends unknown[]>(...schemas: S) { return intersect.def(schemas) }
export interface intersect<S> { (u: unknown): u is this['_type'], tag: URI.intersect, def: S, _type: IntersectType<S> }
export namespace intersect {
  export type type<S, T = IntersectType<S>> = never | T
  export function def<T extends readonly unknown[]>(xs: readonly [...T]): intersect<T>
  export function def<T extends readonly unknown[]>(xs: readonly [...T]) {
    const allOf = xs.every(isPredicate) ? guard.intersect(xs) : guard.unknown
    function IntersectSchema(src: unknown) { return allOf(src) }
    IntersectSchema.tag = URI.intersect
    IntersectSchema.def = xs
    return IntersectSchema
  }
}

export { tuple }
function tuple<S extends readonly Schema[]>(...schemas: tuple.validate<S>): tuple<tuple.from<tuple.validate<S>, S>>
function tuple<S extends readonly Predicate[], T extends { [I in keyof S]: Entry<S[I]> }>(...schemas: tuple.validate<S>): tuple<tuple.from<tuple.validate<S>, T>>
function tuple<S extends readonly Schema[]>(...args: [...schemas: tuple.validate<S>, options: Options]): tuple<tuple.from<tuple.validate<S>, S>>
function tuple<S extends readonly Predicate[], T extends { [I in keyof S]: Entry<S[I]> }>(...args: [...schemas: tuple.validate<S>, options: Options]): tuple<tuple.from<tuple.validate<S>, T>>
function tuple<S extends readonly Schema[]>(...schemas: tuple.validate<S>): tuple<tuple.from<tuple.validate<S>, S>>
function tuple<S extends readonly Predicate[], T extends { [I in keyof S]: Entry<S[I]> }>(...schemas: tuple.validate<S>): tuple<tuple.from<tuple.validate<S>, T>>
function tuple<S extends readonly Predicate[]>(...args: | [...S] | [...S, Options]) { return tuple.def(...parseArgs(getConfig().schema, args)) }
interface tuple<S> { (u: unknown): u is this['_type'], tag: URI.tuple, def: S, _type: TupleType<S> }
namespace tuple {
  export type type<S, T = TupleType<S>> = never | T
  export function def<T extends readonly unknown[]>(xs: readonly [...T], $?: Options): tuple<T>
  export function def<T extends readonly unknown[]>(xs: readonly [...T], $: Options = getConfig().schema) {
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
declare namespace tuple {
  type validate<T extends readonly unknown[]> = ValidateTuple<T, optional<any>>
  type from<V extends readonly unknown[], T extends readonly unknown[]>
    = TypeError extends V[number] ? { [I in keyof V]: V[I] extends TypeError ? invalid<Extract<V[I], TypeError>> : V[I] } : T
  type InternalOptions = { minLength?: number }
}

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
  export type type<
    S,
    Opt extends Optional<S> = Optional<S>,
    Req extends Required<S> = Required<S>,
    T = Force<
      & { [K in Req]-?: S[K]['_type' & keyof S[K]] }
      & { [K in Opt]+?: S[K]['_type' & keyof S[K]] }
    >
  > = never | T
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
export type LeafTag = typeof leaves[number]['tag']
export type UnaryTag = typeof unaryTags[number]
const hasTag = has('tag', (tag) => typeof tag === 'string')
export const leaves = [unknown_, never_, any_, void_, undefined_, null_, symbol_, bigint_, boolean_, integer, number_, string_]
export const isLeaf = (u: unknown): u is Leaf => hasTag(u) && leafTags.includes(u.tag as never)
export const leafTags = leaves.map((leaf) => leaf.tag)
const unaryTags = [URI.optional, URI.eq, URI.array, URI.record, URI.tuple, URI.union, URI.intersect, URI.object]
export const tags = [...leafTags, ...unaryTags]
export const isUnary = (u: unknown): u is Unary => hasTag(u) && unaryTags.includes(u.tag as never)
export const is = (u: unknown): u is Schema => hasTag(u) && tags.includes(u.tag as never)


export declare namespace Functor { type Index = (keyof any)[] }
export const Functor: T.Functor<Free, Fixpoint> = {
  map(f) {
    type T = ReturnType<typeof f>
    return (x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case isLeaf(x): return x
        case x.tag === URI.eq: return eq.def(x.def as never)
        case x.tag === URI.array: return array.def(f(x.def))
        case x.tag === URI.record: return record.def(f(x.def))
        case x.tag === URI.optional: return optional.def(f(x.def))
        case x.tag === URI.tuple: return tuple.def(fn.map(x.def, f)) as F<T> // TODO: Remove type assertion
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
    type T = ReturnType<typeof f>
    return (x, ix) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case isLeaf(x): return x
        case x.tag === URI.eq: return eq.def(x.def as never)
        case x.tag === URI.array: return array.def(f(x.def, ix))
        case x.tag === URI.record: return record.def(f(x.def, ix))
        case x.tag === URI.optional: return optional.def(f(x.def, ix))
        case x.tag === URI.tuple: return tuple.def(fn.map(x.def, (y, iy) => f(y, [...ix, iy]))) as F<T> // TODO: Remove type assertion
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


function boundedInteger(bounds: Bounds): ((u: unknown) => boolean) & Bounds<number> & integer {
  return Object_assign(function BoundedIntegerSchema(u: unknown) {
    return Number_isSafeInteger(u) && within(bounds)(u)
  }, bounds, integer)
}

function boundedBigInt(bounds: Bounds<number | bigint>): ((u: unknown) => boolean) & Bounds<number | bigint> & bigint_ {
  return Object_assign(function BoundedBigIntSchema(u: unknown) {
    return typeof u === 'bigint' && withinBig(bounds)(u)
  }, bounds, bigint_)
}

function boundedNumber(bounds: Bounds): ((u: unknown) => boolean) & Bounds<number> & number_ {
  return Object_assign(function BoundedNumberSchema(u: unknown) {
    return typeof u === 'number' && within(bounds)(u)
  }, bounds, number_)
}

function boundedString(bounds: Bounds): ((u: unknown) => boolean) & Bounds<number> & string_ {
  return Object_assign(function BoundedStringSchema(u: unknown) {
    return typeof u === 'string' && within(bounds)(u.length)
  }, bounds, string_)
}

function boundedArray<S extends Schema>(schema: S, bounds: Bounds): ((u: unknown) => boolean) & Bounds<number> & array<S>
function boundedArray<S>(schema: S, bounds: Bounds): ((u: unknown) => boolean) & Bounds<number> & array<S>
function boundedArray<S extends Schema>(schema: S, bounds: Bounds): ((u: unknown) => boolean) & Bounds<number> & array<S> {
  return Object_assign(function BoundedArraySchema(u: unknown) {
    return Array_isArray(u) && within(bounds)(u.length)
  }, bounds, array(schema))
}
