import type * as T from '@traversable/registry'
import type {
  Integer,
  Label,
  SchemaOptions as Options,
  TypeError,
  Unknown,
} from '@traversable/registry'
import {
  Array_isArray,
  applyOptions,
  fn,
  getConfig,
  has,
  Math_max,
  Math_min,
  Number_isFinite,
  Number_isSafeInteger,
  Object_assign,
  Object_keys,
  parseArgs,
  symbol,
  URI,
} from '@traversable/registry'

import type {
  Guard,
  Predicate as AnyPredicate,
  Typeguard,
  ValidateTuple,
} from './types.js'
import { is as guard } from './predicates.js'

/** @internal */
export function replaceBooleanConstructor<T>(fn: T): LowerBound
export function replaceBooleanConstructor<T>(fn: T) {
  return fn === globalThis.Boolean ? nonnullable : fn
}

export const isPredicate
  : <S, T extends S>(got: unknown) => got is { (): boolean; (x: S): x is T }
  = (got: unknown): got is never => typeof got === 'function'

export type Source<T> = T extends (_: infer S) => unknown ? S : unknown
export type Target<S> = never | S extends (_: any) => _ is infer T ? T : S
export type Inline<S> = never | of<Target<S>>
export type Predicate = AnyPredicate | Schema
export type Force<T> = never | { -readonly [K in keyof T]: T[K] }
export type Optional<S, K extends keyof S = keyof S> = never |
  string extends K ? string : K extends K ? S[K] extends bottom | optional<any> ? K : never : never
export type FirstOptionalItem<S, Offset extends 1[] = []>
  = S extends readonly [infer H, ...infer T] ? optional<any> extends H ? Offset['length'] : FirstOptionalItem<T, [...Offset, 1]> : never

export type Required<S, K extends keyof S = keyof S> = never |
  string extends K ? string : K extends K ? S[K] extends bottom | optional<any> ? never : K : never

export type Entry<S>
  = [Schema] extends [S] ? Schema
  : S extends { def: unknown } ? S
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


export type typeOf<
  T extends { _type?: unknown },
  _ extends
  | T['_type']
  = T['_type']
> = never | _

export interface LowerBound<T = unknown> {
  readonly _type?: T
  (got: Unknown): got is T
  (got: unknown): got is T
  tag?: string
  def?: unknown
}

export interface Schema<Fn extends LowerBound = LowerBound> {
  readonly _type?: Fn['_type']
  (got: Unknown): got is Fn['_type']
  (got: unknown): got is Fn['_type']
  tag?: Fn['tag']
  def?: Fn['def']
}

export type Unary =
  | eq<Unary>
  | array<Unary>
  | record<Unary>
  | optional<Unary>
  | union<Unary[]>
  | intersect<readonly Unary[]>
  | tuple<Unary[]>
  | object_<{ [x: string]: Unary }>

export type F<T> =
  | Leaf
  | eq<T>
  | array<T>
  | record<T>
  | optional<T>
  | union<T[]>
  | intersect<readonly T[]>
  | tuple<T[]>
  | object_<{ [x: string]: T }>

export type Fixpoint = Leaf | Unary
export interface Free extends T.HKT { [-1]: F<this[0]> }

export interface of<S> {
  readonly _type: Target<S>
  (got: this['_type'] | Unknown): got is this['_type']
  (got: unknown): got is this['_type']
  tag: URI.inline
  def: S
}
export function of<S extends Guard>(typeguard: S): Entry<S>
export function of<S extends Predicate>(typeguard: S): of<Entry<S>>
export function of<S>(typeguard: (Guard<S>) & { tag?: URI.inline, def?: Guard<S> }) {
  typeguard.def = typeguard
  return Object_assign(typeguard, of.prototype)
}
export namespace of {
  export let prototype = { tag: URI.inline }
  export type type<S, T = Target<S>> = never | T
  export function def<T extends Guard>(guard: T): of<T>
  /* v8 ignore next 6 */
  export function def<T extends Guard>(guard: T) {
    function InlineSchema(got: unknown) { return guard(got) }
    InlineSchema.tag = URI.inline
    InlineSchema.def = guard
    return InlineSchema
  }
}

export interface top { readonly _type: unknown, tag: URI.top, def: unknown }
export interface bottom { readonly _type: never, tag: URI.bottom, def: never }
export interface invalid<_Err> extends TypeError<''>, never_ {}

export { void_ as void }
interface void_ {
  readonly _type: void
  (got: this['_type'] | Unknown): got is void
  (got: unknown): got is void
  tag: URI.void
  def: void
}
const void_ = <void_>function VoidSchema(got: unknown) { return got === void 0 }
void_.tag = URI.void
void_.def = void 0

export { never_ as never }
interface never_ {
  readonly _type: never
  (got: unknown): got is never
  tag: URI.never
  def: never
}
const never_ = <never_>function NeverSchema(got: unknown) { return false }
never_.tag = URI.never
never_.def = void 0 as never

export { unknown_ as unknown }
interface unknown_ {
  readonly _type: unknown
  (got: unknown): got is unknown
  tag: URI.unknown
  def: unknown
}
const unknown_ = <unknown_>function UnknownSchema(got: unknown) { return true }
unknown_.tag = URI.unknown
unknown_.def = void 0

export { any_ as any }
interface any_ {
  readonly _type: any
  (got: unknown): got is any
  tag: URI.any
  def: any
}
const any_ = <any_>function AnySchema(got: unknown) { return true }
any_.tag = URI.any
any_.def = void 0

export { null_ as null }
interface null_ {
  readonly _type: null
  (got: null | Unknown): got is null
  (got: unknown): got is null
  tag: URI.null
  def: this['_type']
}
const null_ = <null_>function NullSchema(got: unknown) { return got === null }
null_.tag = URI.null
null_.def = null

export { undefined_ as undefined }
interface undefined_ {
  readonly _type: undefined
  (got: undefined | Unknown): got is undefined
  (got: unknown): got is undefined
  tag: URI.undefined
  def: undefined
}
const undefined_ = <undefined_>function UndefinedSchema(got: unknown) { return got === undefined }
undefined_.tag = URI.undefined
undefined_.def = void 0

export { symbol_ as symbol }
interface symbol_ {
  readonly _type: symbol
  (got: symbol | Unknown): got is symbol
  (got: unknown): got is symbol
  tag: URI.symbol
  def: symbol
}
const symbol_ = <symbol_>function SymbolSchema(got: unknown) { return typeof got === 'symbol' }
symbol_.tag = URI.symbol
symbol_.def = Symbol()

export { boolean_ as boolean }
interface boolean_ {
  readonly _type: boolean
  (got: boolean | Unknown): got is boolean
  (got: unknown): got is boolean
  tag: URI.boolean
  def: boolean
}
const boolean_ = <boolean_>function BooleanSchema(got: unknown) { return got === true || got === false }
boolean_.tag = URI.boolean
boolean_.def = false

export { integer }
interface integer extends integer.methods {
  readonly _type: number
  (got: number | Unknown): got is number
  (got: unknown): got is number
  tag: URI.integer
  def: this['_type']
  minimum?: number
  maximum?: number
}

declare namespace integer {
  type Min<X extends number, Self>
    = [Self] extends [{ maximum: number }]
    ? integer.between<[min: X, max: Self['maximum']]>
    : integer.min<X>
  type Max<X extends number, Self>
    = [Self] extends [{ minimum: number }]
    ? integer.between<[min: Self['minimum'], max: X]>
    : integer.max<X>
  interface methods {
    min<Min extends Integer<Min>>(minimum: Min): integer.Min<Min, this>
    max<Max extends Integer<Max>>(maximum: Max): integer.Max<Max, this>
    between<Min extends Integer<Min>, Max extends Integer<Max>>(minimum: Min, maximum: Max): integer.between<[min: Min, max: Max]>
  }
  interface min<Min extends number> extends integer { minimum: Min }
  interface max<Max extends number> extends integer { maximum: Max }
  interface between<Bounds extends [min: number, max: number]> extends integer { minimum: Bounds[0], maximum: Bounds[1] }
}
const integer = <integer>function IntegerSchema(got: unknown) { return Number_isSafeInteger(got) }
integer.tag = URI.integer
integer.def = 0
integer.min = function integer_min(minimum) {
  const MAX = this.maximum
  return Object_assign(
    Number_isSafeInteger(MAX)
      ? function IntegerWithMinimumAndInheritedMax(got: unknown) { return Number_isSafeInteger(got) && minimum <= got && got <= MAX }
      : function IntegerWithMinimum(got: unknown) { return Number_isSafeInteger(got) && minimum <= got },
    this,
    { minimum },
  )
}
integer.max = function integer_max(maximum) {
  const MIN = this.minimum
  return Object_assign(
    Number_isSafeInteger(MIN)
      ? function IntegerWithMaximumAndInheritedMin(got: unknown) { return Number_isSafeInteger(got) && MIN <= got && got <= maximum }
      : function IntegerWithMaximum(got: unknown) { return Number_isSafeInteger(got) && got <= maximum },
    this,
    { maximum },
  )
}
integer.between = function integerBetween(
  min,
  max,
  minimum = <typeof min>Math_min(min, max),
  maximum = <typeof max>Math_max(min, max),
) {
  return Object_assign(
    /* v8 ignore next 1 */
    function IntegerWithMinimumAndMaximum(got: unknown) { return Number_isSafeInteger(got) && minimum <= got && got <= maximum },
    this,
    { minimum, maximum },
  )
}

export { bigint_ as bigint }
interface bigint_ extends bigint_.methods {
  readonly _type: bigint
  (got: bigint | Unknown): got is bigint
  (got: unknown): got is bigint
  tag: URI.bigint
  def: this['_type']
  minimum?: bigint
  maximum?: bigint
}
declare namespace bigint_ {
  type Min<X extends bigint, Self>
    = [Self] extends [{ maximum: bigint }]
    ? bigint_.between<[min: X, max: Self['maximum']]>
    : bigint_.min<X>

  type Max<X extends bigint, Self>
    = [Self] extends [{ minimum: bigint }]
    ? bigint_.between<[min: Self['minimum'], max: X]>
    : bigint_.max<X>

  interface methods extends Typeguard<bigint> {
    min<Min extends bigint>(minimum: Min): bigint_.Min<Min, this>
    max<Max extends bigint>(maximum: Max): bigint_.Max<Max, this>
    between<Min extends bigint, Max extends bigint>(minimum: Min, maximum: Max): bigint_.between<[min: Min, max: Max]>
  }
  interface min<Min extends bigint> extends bigint_ { minimum: Min }
  interface max<Max extends bigint> extends bigint_ { maximum: Max }
  interface between<Bounds extends [min: bigint, max: bigint]> extends bigint_ { minimum: Bounds[0], maximum: Bounds[1] }
}

const bigint_ = <bigint_>function BigIntSchema(got: unknown) { return typeof got === 'bigint' }
bigint_.tag = URI.bigint
bigint_.def = 0n
bigint_.min = function bigint_min(minimum) {
  const MAX = this.maximum
  return Object_assign(
    typeof MAX === 'bigint'
      ? function BigIntWithMinimumAndInheritedMax(got: unknown) { return typeof got === 'bigint' && minimum <= got && got <= MAX }
      : function BigIntWithMinimum(got: unknown) { return typeof got === 'bigint' && minimum <= got },
    this,
    { minimum },
  )
}
bigint_.max = function bigint_max(maximum) {
  const MIN = this.minimum
  return Object_assign(
    typeof MIN === 'bigint'
      ? function BigIntWithMaximumAndInheritedMin(got: unknown) { return typeof got === 'bigint' && MIN <= got && got <= maximum }
      : function BigIntWithMaximum(got: unknown) { return typeof got === 'bigint' && got <= maximum },
    this,
    { maximum },
  )
}
bigint_.between = function bigint_between(
  min,
  max,
  minimum = <typeof min>(max < min ? max : min),
  maximum = <typeof max>(max < min ? min : max),
) {
  return Object_assign(
    /* v8 ignore next 1 */
    function BigIntWithMinimumAndMaximum(got: unknown) { return typeof got === 'bigint' && minimum <= got && got <= maximum },
    this,
    { minimum, maximum },
  )
}

export { number_ as number }
interface number_ extends number_.methods {
  readonly _type: number
  (got: number | Unknown): got is number
  (got: unknown): got is number
  tag: URI.number
  def: number
  minimum?: number
  maximum?: number
  exclusiveMinimum?: number
  exclusiveMaximum?: number
}
declare namespace number_ {
  interface methods {
    min<Min extends number>(minimum: Min): number_.Min<Min, this>
    max<Max extends number>(maximum: Max): number_.Max<Max, this>
    moreThan<Min extends number>(moreThan: Min): ExclusiveMin<Min, this>
    lessThan<Max extends number>(lessThan: Max): ExclusiveMax<Max, this>
    between<Min extends number, Max extends number>(minimum: Min, maximum: Max): number_.between<[min: Min, max: Max]>
  }
  type Min<X extends number, Self>
    = [Self] extends [{ exclusiveMaximum: number }]
    ? number_.minStrictMax<[min: X, max: Self['exclusiveMaximum']]>
    : [Self] extends [{ maximum: number }]
    ? number_.between<[min: X, max: Self['maximum']]>
    : number_.min<X>

  type Max<X extends number, Self>
    = [Self] extends [{ exclusiveMinimum: number }]
    ? number_.maxStrictMin<[Self['exclusiveMinimum'], X]>
    : [Self] extends [{ minimum: number }]
    ? number_.between<[min: Self['minimum'], max: X]>
    : number_.max<X>

  type ExclusiveMin<X extends number, Self>
    = [Self] extends [{ exclusiveMaximum: number }]
    ? number_.strictlyBetween<[X, Self['exclusiveMaximum']]>
    : [Self] extends [{ maximum: number }]
    ? number_.maxStrictMin<[min: X, Self['maximum']]>
    : number_.moreThan<X>

  type ExclusiveMax<X extends number, Self>
    = [Self] extends [{ exclusiveMinimum: number }]
    ? number_.strictlyBetween<[Self['exclusiveMinimum'], X]>
    : [Self] extends [{ minimum: number }]
    ? number_.minStrictMax<[Self['minimum'], min: X]>
    : number_.lessThan<X>

  interface min<Min extends number> extends number_ { minimum: Min }
  interface max<Max extends number> extends number_ { maximum: Max }
  interface moreThan<Min extends number> extends number_ { exclusiveMinimum: Min }
  interface lessThan<Max extends number> extends number_ { exclusiveMaximum: Max }
  interface between<Bounds extends [min: number, max: number]> extends number_ { minimum: Bounds[0], maximum: Bounds[1] }
  interface minStrictMax<Bounds extends [min: number, max: number]> extends number_ { minimum: Bounds[0], exclusiveMaximum: Bounds[1] }
  interface maxStrictMin<Bounds extends [min: number, max: number]> extends number_ { maximum: Bounds[1], exclusiveMinimum: Bounds[0] }
  interface strictlyBetween<Bounds extends [min: number, max: number]> extends number_ { exclusiveMinimum: Bounds[0], exclusiveMaximum: Bounds[1] }
}

const number_ = <number_>function NumberSchema(got: unknown) { return typeof got === 'number' }
// const number_ = <number_>function NumberSchema(got: unknown) { return Number_isFinite(got) }
number_.tag = URI.number
number_.def = 0
number_.min = function number_min(minimum) {
  let checkUpperBound = (got: number) =>
    got <= (this.maximum ?? Number.POSITIVE_INFINITY)
    && got < (this.exclusiveMaximum || Number.POSITIVE_INFINITY)
  return Object_assign(
    /* v8 ignore next 1 */
    function NumberWithMinimum(got: unknown) { return typeof got === 'number' && minimum <= got && checkUpperBound(got) },
    this,
    { minimum }
  )
}
number_.max = function number_max(maximum) {
  let checkLowerBound = (got: number) =>
    (this.minimum ?? Number.NEGATIVE_INFINITY) <= got
    && (this.exclusiveMinimum || Number.NEGATIVE_INFINITY) < got
  return Object_assign(
    /* v8 ignore next 1 */
    function NumberWithMaximum(got: unknown) { return typeof got === 'number' && got <= maximum && checkLowerBound(got) },
    this,
    { maximum }
  )
}
number_.moreThan = function number_moreThan(exclusiveMinimum) {
  let checkUpperBound = (got: number) =>
    got <= (this.maximum ?? Number.POSITIVE_INFINITY)
    && got < (this.exclusiveMaximum || Number.POSITIVE_INFINITY)
  return Object_assign(
    /* v8 ignore next 1 */
    function NumberBoundedFromBelow(got: unknown) { return typeof got === 'number' && exclusiveMinimum < got && checkUpperBound(got) },
    this,
    { exclusiveMinimum }
  )
}
number_.lessThan = function number_lessThan(exclusiveMaximum) {
  let checkLowerBound = (got: number) =>
    (this.minimum ?? Number.NEGATIVE_INFINITY) <= got
    && (this.exclusiveMinimum || Number.NEGATIVE_INFINITY) < got
  return Object_assign(
    /* v8 ignore next 1 */
    function NumberBoundedFromAbove(got: unknown) { return typeof got === 'number' && got < exclusiveMaximum && checkLowerBound(got) },
    this,
    { exclusiveMaximum },
  )
}
number_.between = function number_between(
  min,
  max,
  minimum = <typeof min>Math_min(min, max),
  maximum = <typeof max>Math_max(min, max),
) {
  return Object_assign(
    /* v8 ignore next 1 */
    function NumberWithMinimumAndMaximum(got: unknown) { return typeof got === 'number' && minimum <= got && got <= maximum },
    this,
    { minimum, maximum },
  )
}

export { string_ as string }
interface string_ extends string_.methods {
  _type: string
  (got: string | Unknown): got is string
  (got: unknown): got is string
  tag: URI.string
  def: this['_type']
  minLength?: number
  maxLength?: number
}
declare namespace string_ {
  interface methods {
    min<Min extends Integer<Min>>(minLength: Min): string_.Min<Min, this>
    max<Max extends Integer<Max>>(maxLength: Max): string_.Max<Max, this>
    between<Min extends Integer<Min>, Max extends Integer<Max>>(minLength: Min, maxLength: Max): string_.between<[min: Min, max: Max]>
  }
  type Min<Min extends number, Self>
    = [Self] extends [{ maxLength: number }]
    ? string_.between<[min: Min, max: Self['maxLength']]>
    : string_.min<Min>

  type Max<Max extends number, Self>
    = [Self] extends [{ minLength: number }]
    ? string_.between<[min: Self['minLength'], max: Max]>
    : string_.max<Max>

  interface min<Min extends number> extends string_ { minLength: Min }
  interface max<Max extends number> extends string_ { maxLength: Max }
  interface between<Bounds extends [min: number, max: number]> extends string_ { minLength: Bounds[0], maxLength: Bounds[1] }
}
const string_ = <string_>function StringSchema(got: unknown) { return typeof got === 'string' }
string_.tag = URI.string
string_.def = ''
string_.min = function string_min(minLength) {
  const MAX = this.maxLength
  return Object_assign(
    /* v8 ignore next 1 */
    Number_isSafeInteger(MAX)
      ? function StringWithMinLengthAndInheritedMax(got: unknown) {
        return typeof got === 'string' && minLength <= got.length && got.length <= MAX
      }
      : function StringWithMinLength(got: unknown) {
        return typeof got === 'string' && minLength <= got.length
      },
    this,
    { minLength },
  )
}
string_.max = function string_max(maxLength) {
  const MIN = this.minLength
  return Object_assign(
    /* v8 ignore next 1 */
    Number_isSafeInteger(MIN)
      ? function StringWithMaxLengthAndInheritedMin(got: unknown) {
        return typeof got === 'string' && MIN <= got.length && got.length <= maxLength
      }
      : function StringWithMaxLength(got: unknown) {
        return typeof got === 'string' && got.length <= maxLength
      },
    this,
    { maxLength },
  )
}
string_.between = function string_between(
  min,
  max,
  minLength = <typeof min>Math_min(min, max),
  maxLength = <typeof max>Math_max(min, max)) {
  return Object_assign(
    /* v8 ignore next 1 */
    function StringWithMinAndMaxLength(got: unknown) { return typeof got === 'string' && minLength <= got.length && got.length <= maxLength },
    this,
    { minLength, maxLength },
  )
}

export { nonnullable }
interface nonnullable extends Typeguard<{}> {
  readonly _type: {}
  (got: {} | Unknown): got is {}
  (got: unknown): got is {}
  tag: URI.nonnullable
  def: {}
}
const nonnullable = <nonnullable>function NonNullableSchema(got: unknown) { return got != null }
nonnullable.tag = URI.nonnullable
nonnullable.def = {}

export function eq<const V extends T.Mut<V>>(value: V, options?: Options<V>): eq<T.Mutable<V>>
export function eq<const V>(value: V, options?: Options<V>): eq<V>
export function eq<const V>(value: V, options?: Options<V>): eq<V> { return eq.def(value, options) }
export interface eq<V> {
  readonly _type: V
  (got: V | Unknown): got is V
  (got: unknown): got is V
  tag: URI.eq
  def: V
}
export namespace eq {
  export let prototype = { tag: URI.eq }
  export function def<T>(value: T, options?: Options): eq<T>
  /* v8 ignore next 1 */
  export function def<T>(x: T, $?: Options) {
    const options = applyOptions($)
    const eqGuard = isPredicate(x) ? x : (y: unknown) => options.eq.equalsFn(x, y)
    function EqSchema(got: unknown) { return eqGuard(got) }
    EqSchema.def = x
    return Object_assign(EqSchema, eq.prototype)
  }
}

export function optional<S extends Schema>(schema: S): optional<S>
export function optional<S extends Predicate>(schema: S): optional<Inline<S>>
export function optional<S>(schema: S): optional<S> { return optional.def(schema) }
export interface optional<S> {
  readonly _type: undefined | S['_type' & keyof S]
  (got: this['_type'] | Unknown): got is this['_type']
  (got: unknown): got is this['_type']
  tag: URI.optional
  def: S
  [symbol.optional]: number
}
export namespace optional {
  export let prototype = { tag: URI.optional }
  export type type<S, T = undefined | S['_type' & keyof S]> = never | T
  export function def<T>(x: T): optional<T>
  export function def<T>(x: T) {
    const optionalGuard = isPredicate(x) ? guard.optional(x) : (_: any) => true
    function OptionalSchema(got: unknown) { return optionalGuard(got) }
    OptionalSchema.tag = URI.optional
    OptionalSchema.def = x
    OptionalSchema[symbol.optional] = 1
    return Object_assign(OptionalSchema, optional.prototype)
  }
  export const is
    : <S extends Schema>(got: unknown) => got is optional<S>
    /* v8 ignore next 1 */
    = has('tag', eq(URI.optional)) as never
}

export function array<S extends Schema>(schema: S, readonly: 'readonly'): ReadonlyArray<S>
export function array<S extends Schema>(schema: S): array<S>
export function array<S extends Predicate>(schema: S): array<Inline<S>>
export function array<S extends Schema>(schema: S): array<S> { return array.def(schema) }
export interface array<S> extends array.methods<S> {
  readonly _type: S['_type' & keyof S][]
  (got: this['_type'] | Unknown): got is this['_type']
  (got: unknown): got is this['_type']
  tag: URI.array
  def: S
  minLength?: number
  maxLength?: number
}
export declare namespace array {
  interface methods<S> {
    min<Min extends Integer<Min>>(minLength: Min): array.Min<Min, this>
    max<Max extends Integer<Max>>(maxLength: Max): array.Max<Max, this>
    between<Min extends Integer<Min>, Max extends Integer<Max>>(minLength: Min, maxLength: Max): array.between<[min: Min, max: Max], S>
  }
  type Min<Min extends number, Self>
    = [Self] extends [{ maxLength: number }]
    ? array.between<[min: Min, max: Self['maxLength']], Self['def' & keyof Self]>
    : array.min<Min, Self['def' & keyof Self]>

  type Max<Max extends number, Self>
    = [Self] extends [{ minLength: number }]
    ? array.between<[min: Self['minLength'], max: Max], Self['def' & keyof Self]>
    : array.max<Max, Self['def' & keyof Self]>

  interface min<Min extends number, S> extends array<S> { minLength: Min }
  interface max<Max extends number, S> extends array<S> { maxLength: Max }
  interface between<Bounds extends [min: number, max: number], S> extends array<S> { minLength: Bounds[0], maxLength: Bounds[1] }
  type type<S> = never | S['_type' & keyof S][]
}

export namespace array {
  export let prototype = { tag: URI.array } as array<unknown>
  export function def<S>(x: S, prev?: array<unknown>): array<S>
  export function def<S>(x: S, prev?: unknown): array<S>
  export function def<S>(x: S, prev?: array<unknown>): array<S>
  /* v8 ignore next 1 */
  export function def<S>(x: S, prev?: unknown): {} {
    const predicate = isPredicate(x) ? x : (_?: unknown) => true
    function ArraySchema(got: unknown) { return Array_isArray(got) && got.every(predicate) }
    ArraySchema.min = function array_min(minLength: number) {
      const MAX = this.maxLength
      return Object_assign(
        Number_isSafeInteger(MAX)
          ? function ArrayWithMinLengthAndInheritedMax(got: unknown) {
            return Array_isArray(got) && minLength <= got.length && got.length <= MAX && got.every(predicate)
          }
          : function ArrayWithMinLength(got: unknown) {
            return Array_isArray(got) && minLength <= got.length && got.every(predicate)
          },
        this,
        { minLength },
      )
    }
    ArraySchema.max = function array_max(maxLength: number) {
      const MIN = this.minLength
      return Object_assign(
        Number_isSafeInteger(MIN)
          ? function ArrayWithMaxLengthAndInheritedMin(got: unknown) {
            return Array_isArray(got) && MIN <= got.length && got.length <= maxLength && got.every(predicate)
          }
          : function ArrayWithMaxLength(got: unknown) {
            return Array_isArray(got) && got.length <= maxLength && got.every(predicate)
          },
        this,
        { maxLength },
      )
    }
    ArraySchema.between = function array_between(
      min: number,
      max: number,
      minLength = Math_min(min, max),
      maxLength = Math_max(min, max)
    ) {
      return Object_assign(
        function ArrayWithMinAndMaxLength(got: unknown) {
          return Array_isArray(got) && minLength <= got.length && got.length <= maxLength && got.every(predicate)
        },
        this,
        { minLength, maxLength },
      )
    }
    ArraySchema.def = x
    ArraySchema._type = void 0 as never
    if (has('minLength', integer)(prev)) ArraySchema.minLength = prev.minLength
    if (has('maxLength', integer)(prev)) ArraySchema.maxLength = prev.maxLength
    return Object.assign(ArraySchema, array.prototype)
  }
}

export const readonlyArray: {
  <S extends Schema>(schema: S, readonly: 'readonly'): ReadonlyArray<S>
  <S extends Predicate>(schema: S): ReadonlyArray<Inline<S>>
} = array
export interface ReadonlyArray<S> {
  readonly _type: readonly S['_type' & keyof S][]
  (got: this['_type'] | Unknown): got is this['_type']
  (got: unknown): got is this['_type']
  tag: URI.array
  def: S
}

export function record<S extends Schema>(schema: S): record<S>
export function record<S extends Predicate>(schema: S): record<Inline<S>>
export function record<S extends Schema>(schema: S) { return record.def(schema) }
export interface record<S> {
  readonly _type: Record<string, S['_type' & keyof S]>
  (got: this['_type'] | Unknown): got is this['_type']
  (got: unknown): got is this['_type']
  tag: URI.record
  def: S
}
export namespace record {
  export let prototype = { tag: URI.record } as record<unknown>
  export type type<S, T = Record<string, S['_type' & keyof S]>> = never | T
  export function def<T>(x: T): record<T>
  /* v8 ignore next 1 */
  export function def<T>(x: T) {
    const recordGuard = isPredicate(x) ? guard.record(x) : guard.anyObject
    function RecordGuard(got: unknown) { return recordGuard(got) }
    RecordGuard.def = x
    return Object.assign(RecordGuard, record.prototype)
  }
}

export function union<S extends readonly Schema[]>(...schemas: S): union<S>
export function union<S extends readonly Predicate[], T extends { [I in keyof S]: Entry<S[I]> }>(...schemas: S): union<T>
export function union<S extends Predicate[]>(...schemas: S): {} { return union.def(schemas) }
export interface union<S> {
  readonly _type: S[number & keyof S]['_type' & keyof S[number & keyof S]]
  (got: this['_type'] | Unknown): got is this['_type']
  (got: unknown): got is this['_type']
  tag: URI.union
  def: S
}
export namespace union {
  export let prototype = { tag: URI.union } as union<unknown>
  export type type<S, T = S[number & keyof S]['_type' & keyof S[number & keyof S]]> = never | T
  export function def<T extends readonly unknown[]>(xs: T): union<T>
  /* v8 ignore next 1 */
  export function def<T extends readonly unknown[]>(xs: T) {
    const anyOf = xs.every(isPredicate) ? guard.union(xs) : guard.unknown
    function UnionSchema(got: unknown) { return anyOf(got) }
    UnionSchema.def = xs
    return Object_assign(UnionSchema, union.prototype)
  }
}

export function intersect<S extends readonly Schema[]>(...schemas: S): intersect<S>
export function intersect<S extends readonly Predicate[], T extends { [I in keyof S]: Entry<S[I]> }>(...schemas: S): intersect<T>
export function intersect<S extends unknown[]>(...schemas: S) { return intersect.def(schemas) }
export interface intersect<S> {
  _type: IntersectType<S>
  (got: this['_type'] | Unknown): got is this['_type']
  (got: unknown): got is this['_type']
  tag: URI.intersect
  def: S
}
export namespace intersect {
  export let prototype = { tag: URI.intersect } as intersect<unknown>
  export type type<S, T = IntersectType<S>> = never | T
  export function def<T extends readonly unknown[]>(xs: readonly [...T]): intersect<T>
  /* v8 ignore next 1 */
  export function def<T extends readonly unknown[]>(xs: readonly [...T]) {
    const allOf = xs.every(isPredicate) ? guard.intersect(xs) : guard.unknown
    function IntersectSchema(got: unknown) { return allOf(got) }
    IntersectSchema.def = xs
    return Object_assign(IntersectSchema, intersect.prototype)
  }
}

export { tuple }
function tuple<S extends readonly Predicate[], T extends { [I in keyof S]: Entry<S[I]> }>(...schemas: tuple.validate<S>): tuple<tuple.from<tuple.validate<S>, T>>
function tuple<S extends readonly Schema[]>(...schemas: tuple.validate<S>): tuple<tuple.from<tuple.validate<S>, S>>
function tuple<S extends readonly Predicate[], T extends { [I in keyof S]: Entry<S[I]> }>(...args: [...schemas: tuple.validate<S>, options: Options]): tuple<tuple.from<tuple.validate<S>, T>>
function tuple<S extends readonly Schema[]>(...args: [...schemas: tuple.validate<S>, options: Options]): tuple<tuple.from<tuple.validate<S>, S>>
function tuple<S extends readonly Predicate[], T extends { [I in keyof S]: Entry<S[I]> }>(...schemas: tuple.validate<S>): tuple<tuple.from<tuple.validate<S>, T>>
function tuple<S extends readonly Schema[]>(...schemas: tuple.validate<S>): tuple<tuple.from<tuple.validate<S>, S>>
function tuple<S extends readonly Predicate[]>(...args: | [...S] | [...S, Options]) { return tuple.def(...parseArgs(getConfig().schema, args)) }
interface tuple<S> {
  readonly _type: TupleType<S>
  (got: this['_type'] | Unknown): got is this['_type']
  (got: unknown): got is this['_type']
  tag: URI.tuple
  def: S
  opt: FirstOptionalItem<S>
}
namespace tuple {
  export let prototype = { tag: URI.tuple } as tuple<unknown>
  export function def<T extends readonly unknown[]>(xs: readonly [...T], $?: Options, opt_?: number): tuple<T>
  /* v8 ignore next 1 */
  export function def<T extends readonly unknown[]>(xs: readonly [...T], $: Options = getConfig().schema, opt_?: number) {
    const opt = opt_ || xs.findIndex(optional.is)
    const options = {
      ...$, minLength: $.optionalTreatment === 'treatUndefinedAndOptionalAsTheSame' ? -1 : xs.findIndex(optional.is)
    } satisfies tuple.InternalOptions
    const tupleGuard = xs.every(isPredicate) ? guard.tuple(options)(fn.map(xs, replaceBooleanConstructor)) : guard.anyArray
    function TupleSchema(got: unknown) { return tupleGuard(got) }
    TupleSchema.def = xs
    TupleSchema.opt = opt
    return Object_assign(TupleSchema, tuple.prototype)
  }
}
declare namespace tuple {
  type type<S> = never | TupleType<S>
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
interface object_<S = { [x: string]: Schema }> {
  readonly _type: object_.type<S>
  (got: this['_type'] | Unknown): got is this['_type']
  (got: unknown): got is this['_type']
  tag: URI.object
  def: S
  opt: Optional<S>[]
  req: Required<S>[]
}

namespace object_ {
  export let prototype = { tag: URI.object } as object_<unknown>
  export type Opt<S, K extends keyof S> = symbol.optional extends keyof S[K] ? never : K
  export type Req<S, K extends keyof S> = symbol.optional extends keyof S[K] ? K : never
  export type type<S> = Force<
    & { [K in keyof S as Opt<S, K>]-?: S[K]['_type' & keyof S[K]] }
    & { [K in keyof S as Req<S, K>]+?: S[K]['_type' & keyof S[K]] }
  >
  export function def<T extends { [x: string]: unknown }>(xs: T, $?: Options, opt?: string[]): object_<T>
  /* v8 ignore next 1 */
  export function def<T extends { [x: string]: unknown }>(xs: T, $?: Options, opt_?: string[]): {} {
    const keys = Object_keys(xs)
    const opt = Array_isArray(opt_) ? opt_ : keys.filter((k) => optional.is(xs[k]))
    const req = keys.filter((k) => !optional.is(xs[k]))
    const objectGuard = guard.record(isPredicate)(xs)
      ? guard.object(fn.map(xs, replaceBooleanConstructor), applyOptions($))
      : guard.anyObject
    function ObjectSchema(got: unknown) { return objectGuard(got) }
    ObjectSchema.def = xs
    ObjectSchema.opt = opt
    ObjectSchema.req = req
    return Object_assign(ObjectSchema, object_.prototype)
  }
}

export type Leaf = typeof leaves[number]
export type LeafTag = Leaf['tag']
export type Nullary = typeof nullaries[number]
export type NullaryTag = Nullary['tag']
export type Boundable = typeof boundables[number]
export type BoundableTag = Boundable['tag']
export type Tag = typeof tags[number]
export type TypeName = T.TypeName<Tag>
export type UnaryTag = typeof unaryTags[number]
const hasTag = has('tag', (tag) => typeof tag === 'string')

export const nullaries = [unknown_, never_, any_, void_, undefined_, null_, symbol_, boolean_]
export const nullaryTags = nullaries.map((x) => x.tag)
export const isNullaryTag = (got: unknown): got is NullaryTag => nullaryTags.includes(got as never)
export const isNullary = (got: unknown): got is Nullary => hasTag(got) && nullaryTags.includes(got.tag as never)

export const boundables = [integer, bigint_, number_, string_]
export const boundableTags = boundables.map((x) => x.tag)
export const isBoundableTag = (got: unknown): got is BoundableTag => boundableTags.includes(got as never)
export const isBoundable = (got: unknown): got is Boundable => hasTag(got) && boundableTags.includes(got.tag as never)

export const leaves = [...nullaries, ...boundables]
export const leafTags = leaves.map((leaf) => leaf.tag)
export const isLeaf = (got: unknown): got is Leaf => hasTag(got) && leafTags.includes(got.tag as never)

export const unaryTags = [URI.optional, URI.eq, URI.array, URI.record, URI.tuple, URI.union, URI.intersect, URI.object]
export const tags = [...leafTags, ...unaryTags]
export const isUnary = (got: unknown): got is Unary => hasTag(got) && unaryTags.includes(got.tag as never)

export type AnyCoreSchema =
  | Schema
  | Nullary
  | Boundable

export const isCore = (got: unknown): got is Schema => hasTag(got) && tags.includes(got.tag as never)

export declare namespace Functor { type Index = (keyof any)[] }
export const Functor: T.Functor<Free, Schema> = {
  map(f) {
    return (x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case isLeaf(x): return x
        case x.tag === URI.eq: return eq.def(x.def as never) as never
        case x.tag === URI.array: return array.def(f(x.def), x)
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
        case x.tag === URI.eq: return eq.def(x.def as never) as never
        case x.tag === URI.array: return array.def(f(x.def, ix), x)
        case x.tag === URI.record: return record.def(f(x.def, ix))
        case x.tag === URI.optional: return optional.def(f(x.def, ix))
        case x.tag === URI.tuple: return tuple.def(fn.map(x.def, (y, iy) => f(y, [...ix, iy])), x.opt)
        case x.tag === URI.object: return object_.def(fn.map(x.def, (y, iy) => f(y, [...ix, iy])), {}, x.opt as never)
        case x.tag === URI.union: return union.def(fn.map(x.def, (y, iy) => f(y, [...ix, symbol.union, iy])))
        case x.tag === URI.intersect: return intersect.def(fn.map(x.def, (y, iy) => f(y, [...ix, symbol.intersect, iy])))
      }
    }
  }
}

export const unfold = fn.ana(Functor)
export const fold = fn.cata(Functor)
export const foldWithIndex = fn.cataIx(IndexedFunctor)
