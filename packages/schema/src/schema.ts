import type * as T from '@traversable/registry'
import type { SchemaOptions as Options, TypeError } from '@traversable/registry'
import { applyOptions, fn, getConfig, has, omitMethods, parseArgs, symbol, URI } from '@traversable/registry'

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

/** @internal */
const Math_max = globalThis.Math.max

/** @internal */
export function replaceBooleanConstructor<T>(fn: T): LowerBound
export function replaceBooleanConstructor<T>(fn: T) {
  return fn === globalThis.Boolean ? nonnullable : fn
}

/** @internal */
export function carryover<T extends {}>(x: T, ...ignoreKeys: (keyof T)[]) {
  let keys = Object.keys(x).filter((k) => !ignoreKeys.includes(k as never) && x[k as keyof typeof x] != null)
  if (keys.length === 0) return {}
  else {
    let out: { [x: string]: unknown } = {}
    for (let k of keys) out[k] = x[k as keyof typeof x]
    return out
  }
}

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
  (u: unknown): u is any
  tag?: string
  def?: unknown
  _type?: T
}

export interface Schema<Fn extends LowerBound = LowerBound>
  extends TypePredicate<Source<Fn>, Fn['_type']> {
  tag?: Fn['tag']
  def?: Fn['def']
  _type?: Fn['_type']
}

export type Unary =
  // | enum_<Unary>
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
  // | enum_<readonly T[]>
  | eq<T>
  | array<T>
  | record<T>
  | optional<T>
  | union<T[]>
  | intersect<readonly T[]>
  | tuple<T[]>
  | object_<{ [x: string]: T }>

export type Fixpoint =
  | Leaf
  | Unary

export interface Free extends T.HKT { [-1]: F<this[0]> }

export function of<S extends Guard>(typeguard: S): of<S>
export function of<S extends Predicate>(typeguard: S): of<Entry<S>>
export function of<S>(typeguard: (Guard<S>) & { tag?: URI.inline, def?: Guard<S> }) {
  typeguard.def = typeguard
  return Object_assign(typeguard, of.prototype)
}
export interface of<S> {
  (u: unknown): u is this['_type']
  _type: Target<S>
  tag: URI.inline
  def: S
}

export namespace of {
  export let prototype = { tag: URI.inline }
  export type type<S, T = Target<S>> = never | T
  export function def<T extends Guard>(guard: T): of<T>
  /* v8 ignore next 6 */
  export function def<T extends Guard>(guard: T) {
    function InlineSchema(src: unknown) { return guard(src) }
    InlineSchema.tag = URI.inline
    InlineSchema.def = guard
    return InlineSchema
  }
}

export interface top { tag: URI.top, readonly _type: unknown, def: this['_type'] }
export interface bottom { tag: URI.bottom, readonly _type: never, def: this['_type'] }
export interface invalid<_Err> extends TypeError<''>, never_ {}

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
interface integer extends Typeguard<number>, integer.methods {
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
    min<Min extends number>(minimum: Min): integer.Min<Min, this>
    max<Max extends number>(maximum: Max): integer.Max<Max, this>
    between<Min extends number, Max extends number>(minimum: Min, maximum: Max): integer.between<[min: Min, max: Max]>
  }
  interface min<Min extends number> extends integer { minimum: Min }
  interface max<Max extends number> extends integer { maximum: Max }
  interface between<Bounds extends [min: number, max: number]> extends integer { minimum: Bounds[0], maximum: Bounds[1] }
}
const integer = <integer>function IntegerSchema(src: unknown) { return Number_isSafeInteger(src) }
integer.tag = URI.integer
integer.def = 0
integer.min = function integerMin(minimum) {
  return Object_assign(
    boundedInteger({ gte: minimum }, carryover(this, 'minimum')),
    { minimum },
  )
}
integer.max = function integerMax(maximum) {
  return Object_assign(
    boundedInteger({ lte: maximum }, carryover(this, 'maximum')),
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
    boundedInteger({ gte: minimum, lte: maximum }),
    { minimum, maximum },
  )
}

export { bigint_ as bigint }
interface bigint_ extends Typeguard<bigint>, bigint_.methods {
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

const bigint_ = <bigint_>function BigIntSchema(src: unknown) { return typeof src === 'bigint' }
bigint_.tag = URI.bigint
bigint_.def = 0n
bigint_.min = function bigIntMin(minimum) {
  return Object_assign(
    boundedBigInt({ gte: minimum }, carryover(this, 'minimum')),
    { minimum },
  )
}
bigint_.max = function bigIntMax(maximum) {
  return Object_assign(
    boundedBigInt({ lte: maximum }, carryover(this, 'maximum')),
    { maximum },
  )
}
bigint_.between = function bigIntBetween(
  min,
  max,
  minimum = <typeof min>(max < min ? max : min),
  maximum = <typeof max>(max < min ? min : max),
) {
  return Object_assign(
    boundedBigInt({ gte: minimum, lte: maximum }),
    { minimum, maximum }
  )
}

export { number_ as number }
interface number_ extends Typeguard<number>, number_.methods {
  tag: URI.number
  def: this['_type']
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

const number_ = <number_>function NumberSchema(src: unknown) { return typeof src === 'number' }
number_.tag = URI.number
number_.def = 0
number_.min = function numberMin(minimum) {
  return Object_assign(
    boundedNumber({ gte: minimum }, carryover(this, 'minimum')),
    { minimum },
  )
}
number_.max = function numberMax(maximum) {
  return Object_assign(
    boundedNumber({ lte: maximum }, carryover(this, 'maximum')),
    { maximum },
  )
}
number_.moreThan = function numberMoreThan(exclusiveMinimum) {
  return Object_assign(
    boundedNumber({ gt: exclusiveMinimum }, carryover(this, 'exclusiveMinimum')),
    { exclusiveMinimum },
  )
}
number_.lessThan = function numberLessThan(exclusiveMaximum) {
  return Object_assign(
    boundedNumber({ lt: exclusiveMaximum }, carryover(this, 'exclusiveMaximum')),
    { exclusiveMaximum },
  )
}
number_.between = function numberBetween(
  min,
  max,
  minimum = <typeof min>Math_min(min, max),
  maximum = <typeof max>Math_max(min, max),
) {
  return Object_assign(
    boundedNumber({ gte: minimum, lte: maximum }),
    { minimum, maximum },
  )
}

export { string_ as string }
interface string_ extends Typeguard<string>, string_.methods {
  tag: URI.string
  def: this['_type']
  minLength?: number
  maxLength?: number
}
declare namespace string_ {
  interface methods {
    min<Min extends number>(minLength: Min): string_.Min<Min, this>
    max<Max extends number>(maxLength: Max): string_.Max<Max, this>
    between<Min extends number, Max extends number>(minLength: Min, maxLength: Max): string_.between<[min: Min, max: Max]>
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
const string_ = <string_>function StringSchema(src: unknown) { return typeof src === 'string' }
string_.tag = URI.string
string_.def = ''
string_.min = function stringMinLength(minLength) {
  return Object_assign(
    boundedString({ gte: minLength }, carryover(this, 'minLength')),
    { minLength },
  )
}
string_.max = function stringMaxLength(maxLength) {
  return Object_assign(
    boundedString({ lte: maxLength }, carryover(this, 'maxLength')),
    { maxLength },
  )
}
string_.between = function stringBetween(
  min,
  max,
  minLength = <typeof min>Math_min(min, max),
  maxLength = <typeof max>Math_max(min, max)) {
  return Object_assign(
    boundedString({ gte: minLength, lte: maxLength }),
    { minLength, maxLength },
  )
}

export { nonnullable }
interface nonnullable extends Typeguard<{}> { tag: URI.nonnullable, def: this['_type'] }
const nonnullable = <nonnullable>function NonNullableSchema(src: unknown) { return src != null }
nonnullable.tag = URI.nonnullable
nonnullable.def = {}

export function eq<const V extends T.Mut<V>>(value: V, options?: Options<V>): eq<T.Mutable<V>>
export function eq<const V>(value: V, options?: Options<V>): eq<V>
export function eq<const V>(value: V, options?: Options<V>): eq<V> { return eq.def(value, options) }
export interface eq<V> { (u: unknown): u is V, tag: URI.eq, def: V, _type: V }
export namespace eq {
  export let prototype = { tag: URI.eq }
  export function def<T>(value: T, options?: Options): eq<T>
  /* v8 ignore next 1 */
  export function def<T>(x: T, $?: Options) {
    const options = applyOptions($)
    const eqGuard = isPredicate(x) ? x : (y: unknown) => options.eq.equalsFn(x, y)
    function EqSchema(src: unknown) { return eqGuard(src) }
    EqSchema.def = x
    return Object_assign(EqSchema, eq.prototype)
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
  export let prototype = { tag: URI.optional }
  export type type<S, T = undefined | S['_type' & keyof S]> = never | T
  export function def<T>(x: T): optional<T>
  export function def<T>(x: T) {
    const optionalGuard = isPredicate(x) ? guard.optional(x) : (_: any) => true
    function OptionalSchema(src: unknown) { return optionalGuard(src) }
    OptionalSchema.tag = URI.optional
    OptionalSchema.def = x
    OptionalSchema[symbol.optional] = 1
    return Object_assign(OptionalSchema, optional.prototype)
  }
  export const is
    : <S extends Schema>(u: unknown) => u is optional<S>
    /* v8 ignore next 1 */
    = has('tag', eq(URI.optional)) as never
}

export function array<S extends Schema>(schema: S, readonly: 'readonly'): ReadonlyArray<S>
export function array<S extends Schema>(schema: S): array<S>
export function array<S extends Predicate>(schema: S): array<Inline<S>>
export function array<S extends Schema>(schema: S): array<S> { return array.def(schema) }
export interface array<S> extends array.methods<S> {
  (u: unknown): u is this['_type']
  tag: URI.array
  def: S
  _type: S['_type' & keyof S][]
  minLength?: number
  maxLength?: number
}
export declare namespace array {
  interface methods<S> {
    min<Min extends number>(minLength: Min): array.Min<Min, this>
    max<Max extends number>(maxLength: Max): array.Max<Max, this>
    between<Min extends number, Max extends number>(minLength: Min, maxLength: Max): array.between<[min: Min, max: Max], S>
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
  type type<S, T = S['_type' & keyof S][]> = never | T
}
export namespace array {
  export let prototype = { tag: URI.array } as array<unknown>
  export function def<S>(x: S, prev?: array<unknown>): array<S>
  export function def<S>(x: S, prev?: unknown): array<S>
  export function def<S>(x: S, prev?: array<unknown>): array<S>
  /* v8 ignore next 1 */
  export function def<S>(x: S, prev?: unknown): {} {
    const arrayGuard = (isPredicate(x) ? guard.array(x) : guard.anyArray) as array<any>
    function ArraySchema(src: unknown): src is array<S>['_type'] { return arrayGuard(src) }
    ArraySchema.min = function arrayMin(minLength: number) {
      return Object_assign(
        boundedArray(x, { gte: minLength }, carryover(this, 'minLength' as never)),
        { minLength },
      )
    }
    ArraySchema.max = function arrayMax(maxLength: number) {
      return Object_assign(
        boundedArray(x, { lte: maxLength }, carryover(this, 'maxLength' as never)),
        { maxLength },
      )
    }
    ArraySchema.between = function arrayBetween(
      min: number,
      max: number,
      minLength = <typeof min>Math_min(min, max),
      maxLength = <typeof max>Math_max(min, max)
    ) {
      return Object_assign(
        boundedArray(x, { gte: minLength, lte: maxLength }),
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
  export let prototype = { tag: URI.record } as record<unknown>
  export type type<S, T = Record<string, S['_type' & keyof S]>> = never | T
  export function def<T>(x: T): record<T>
  /* v8 ignore next 1 */
  export function def<T>(x: T) {
    const recordGuard = isPredicate(x) ? guard.record(x) : guard.anyObject
    function RecordGuard(src: unknown) { return recordGuard(src) }
    RecordGuard.def = x
    return Object.assign(RecordGuard, record.prototype)
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
  export let prototype = { tag: URI.union } as union<unknown>
  export type type<S, T = S[number & keyof S]['_type' & keyof S[number & keyof S]]> = never | T
  export function def<T extends readonly unknown[]>(xs: T): union<T>
  /* v8 ignore next 1 */
  export function def<T extends readonly unknown[]>(xs: T) {
    const anyOf = xs.every(isPredicate) ? guard.union(xs) : guard.unknown
    function UnionSchema(src: unknown) { return anyOf(src) }
    UnionSchema.def = xs
    return Object_assign(UnionSchema, union.prototype)
  }
}

export function intersect<S extends readonly Schema[]>(...schemas: S): intersect<S>
export function intersect<S extends readonly Predicate[], T extends { [I in keyof S]: Entry<S[I]> }>(...schemas: S): intersect<T>
export function intersect<S extends unknown[]>(...schemas: S) { return intersect.def(schemas) }
export interface intersect<S> { (u: unknown): u is this['_type'], tag: URI.intersect, def: S, _type: IntersectType<S> }
export namespace intersect {
  export let prototype = { tag: URI.intersect } as intersect<unknown>
  export type type<S, T = IntersectType<S>> = never | T
  export function def<T extends readonly unknown[]>(xs: readonly [...T]): intersect<T>
  /* v8 ignore next 1 */
  export function def<T extends readonly unknown[]>(xs: readonly [...T]) {
    const allOf = xs.every(isPredicate) ? guard.intersect(xs) : guard.unknown
    function IntersectSchema(src: unknown) { return allOf(src) }
    IntersectSchema.def = xs
    return Object_assign(IntersectSchema, intersect.prototype)
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
interface tuple<S> { (u: unknown): u is this['_type'], tag: URI.tuple, def: S, _type: TupleType<S>, opt: FirstOptionalItem<S> }
namespace tuple {
  export let prototype = { tag: URI.tuple } as tuple<unknown>
  export type type<S, T = TupleType<S>> = never | T
  export function def<T extends readonly unknown[]>(xs: readonly [...T], $?: Options, opt_?: number): tuple<T>
  /* v8 ignore next 1 */
  export function def<T extends readonly unknown[]>(xs: readonly [...T], $: Options = getConfig().schema, opt_?: number) {
    const opt = opt_ || xs.findIndex(optional.is)
    const options = {
      ...$, minLength: $.optionalTreatment === 'treatUndefinedAndOptionalAsTheSame' ? -1 : xs.findIndex(optional.is)
    } satisfies tuple.InternalOptions
    const tupleGuard = xs.every(isPredicate) ? guard.tuple(options)(fn.map(xs, replaceBooleanConstructor)) : guard.anyArray
    function TupleSchema(src: unknown) { return tupleGuard(src) }
    TupleSchema.def = xs
    TupleSchema.opt = opt
    return Object_assign(TupleSchema, tuple.prototype)
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
interface object_<S = { [x: string]: Schema }> {
  tag: URI.object
  def: S
  opt: Optional<S>
  req: Required<S>
  _type: object_.type<S>
  (u: unknown): u is this['_type']
}

namespace object_ {
  export let prototype = { tag: URI.object } as object_<unknown>
  export type type<
    S,
    Opt extends Optional<S> = Optional<S>,
    Req extends Required<S> = Required<S>,
    T = Force<
      & { [K in Req]-?: S[K]['_type' & keyof S[K]] }
      & { [K in Opt]+?: S[K]['_type' & keyof S[K]] }
    >
  > = never | T
  export function def<T extends { [x: string]: unknown }>(xs: T, $?: Options, opt?: string[]): object_<T>
  /* v8 ignore next 1 */
  export function def<T extends { [x: string]: unknown }>(xs: T, $?: Options, opt_?: string[]): {} {
    const keys = Object_keys(xs)
    const opt = Array_isArray(opt_) ? opt_ : keys.filter((k) => optional.is(xs[k]))
    const req = keys.filter((k) => !optional.is(xs[k]))
    const objectGuard = guard.record(isPredicate)(xs)
      ? guard.object(fn.map(xs, replaceBooleanConstructor), applyOptions($))
      : guard.anyObject
    function ObjectSchema(src: unknown) { return objectGuard(src) }
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
export type UnaryTag = typeof unaryTags[number]
const hasTag = has('tag', (tag) => typeof tag === 'string')

export const nullaries = [unknown_, never_, any_, void_, undefined_, null_, symbol_, boolean_]
export const nullaryTags = nullaries.map((x) => x.tag)
export const isNullaryTag = (u: unknown): u is NullaryTag => nullaryTags.includes(u as never)
export const isNullary = (u: unknown): u is Nullary => hasTag(u) && nullaryTags.includes(u.tag as never)

export const boundables = [integer, bigint_, number_, string_]
export const boundableTags = boundables.map((x) => x.tag)
export const isBoundableTag = (u: unknown): u is BoundableTag => boundableTags.includes(u as never)
export const isBoundable = (u: unknown): u is Boundable => hasTag(u) && boundableTags.includes(u.tag as never)

export const leaves = [...nullaries, ...boundables]
export const leafTags = leaves.map((leaf) => leaf.tag)
export const isLeaf = (u: unknown): u is Leaf => hasTag(u) && leafTags.includes(u.tag as never)

export const unaryTags = [URI.optional, URI.eq, URI.array, URI.record, URI.tuple, URI.union, URI.intersect, URI.object]
export const tags = [...leafTags, ...unaryTags]
export const isUnary = (u: unknown): u is Unary => hasTag(u) && unaryTags.includes(u.tag as never)

export const isCore = (u: unknown): u is Schema => hasTag(u) && tags.includes(u.tag as never)

export declare namespace Functor { type Index = (keyof any)[] }
export const Functor: T.Functor<Free, Schema> = {
  map(f) {
    type T = ReturnType<typeof f>
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
    type T = ReturnType<typeof f>
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

function boundedInteger(bounds: Bounds, carry?: Partial<integer>): ((u: unknown) => boolean) & Bounds<number> & integer
function boundedInteger(bounds: Bounds, carry?: { [x: string]: unknown }): ((u: unknown) => boolean) & Bounds<number> & integer
function boundedInteger(bounds: Bounds, carry?: {}): {} {
  return Object_assign(function BoundedIntegerSchema(u: unknown) {
    return integer(u) && within(bounds)(u)
  }, carry, integer)
}

function boundedBigInt(bounds: Bounds<number | bigint>, carry?: Partial<bigint_>): ((u: unknown) => boolean) & Bounds<number | bigint> & bigint_
function boundedBigInt(bounds: Bounds<number | bigint>, carry?: { [x: string]: unknown }): ((u: unknown) => boolean) & Bounds<number | bigint> & bigint_
function boundedBigInt(bounds: Bounds<number | bigint>, carry?: {}): {} {
  return Object_assign(function BoundedBigIntSchema(u: unknown) {
    return bigint_(u) && withinBig(bounds)(u)
  }, carry, bigint_)
}

function boundedNumber(bounds: Bounds, carry?: Partial<number_>): ((u: unknown) => boolean) & Bounds<number> & number_
function boundedNumber(bounds: Bounds, carry?: { [x: string]: unknown }): ((u: unknown) => boolean) & Bounds<number> & number_
function boundedNumber(bounds: Bounds, carry?: {}): {} {
  return Object_assign(function BoundedNumberSchema(u: unknown) {
    return number_(u) && within(bounds)(u)
  }, carry, number_)
}

function boundedString(bounds: Bounds, carry?: Partial<string_>): ((u: unknown) => boolean) & Bounds<number> & string_
function boundedString(bounds: Bounds, carry?: { [x: string]: unknown }): ((u: unknown) => boolean) & Bounds<number> & string_
function boundedString(bounds: Bounds, carry?: {}): {} {
  return Object_assign(function BoundedStringSchema(u: unknown) {
    return string_(u) && within(bounds)(u.length)
  }, carry, string_)
}

function boundedArray<S extends Schema>(schema: S, bounds: Bounds, carry?: Partial<array<S>>): ((u: unknown) => boolean) & Bounds<number> & array<S>
function boundedArray<S>(schema: S, bounds: Bounds, carry?: { [x: string]: unknown }): ((u: unknown) => boolean) & Bounds<number> & array<S>
function boundedArray<S extends Schema>(schema: S, bounds: Bounds, carry?: {}): ((u: unknown) => boolean) & Bounds<number> & array<S> {
  return Object_assign(function BoundedArraySchema(u: unknown) {
    return Array_isArray(u) && within(bounds)(u.length)
  }, carry, array(schema))
}
