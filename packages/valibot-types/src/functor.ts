import type { StandardProps } from 'valibot'
import type * as T from '@traversable/registry'
import { fn } from '@traversable/registry'

import { Tag } from './typename.js'
import { isNullary, tagged } from './utils.js'

export declare namespace V {
  type lookup<K extends keyof Tag, S = unknown> = V.Catalog<S>[Tag[K]]
  type Catalog<S> = {
    [Tag.any]: V.Any
    [Tag.bigint]: V.BigInt
    [Tag.blob]: V.Blob
    [Tag.boolean]: V.Boolean
    [Tag.date]: V.Date
    [Tag.enum]: V.Enum
    [Tag.file]: V.File
    [Tag.function]: V.Function
    [Tag.NaN]: V.NaN
    [Tag.never]: V.Never
    [Tag.null]: V.Null
    [Tag.number]: V.Number
    [Tag.promise]: V.Promise
    [Tag.string]: V.String
    [Tag.symbol]: V.Symbol
    [Tag.undefined]: V.Undefined
    [Tag.unknown]: V.Unknown
    [Tag.void]: V.Void
    [Tag.custom]: V.Custom
    [Tag.instance]: V.Instance
    [Tag.lazy]: V.Lazy<S>
    [Tag.literal]: V.Literal<S>
    [Tag.picklist]: V.PickList
    [Tag.array]: V.Array<S>
    [Tag.exactOptional]: V.ExactOptional<S>
    [Tag.nonNullable]: V.NonNullable<S>
    [Tag.nonNullish]: V.NonNullish<S>
    [Tag.nonOptional]: V.NonOptional<S>
    [Tag.nullable]: V.Nullable<S>
    [Tag.nullish]: V.Nullish<S>
    [Tag.optional]: V.Optional<S>
    [Tag.set]: V.Set<S>
    [Tag.undefinedable]: V.Undefinedable<S>
    [Tag.intersect]: V.Intersect<S>
    [Tag.union]: V.Union<S>
    [Tag.variant]: V.Variant<S>
    [Tag.map]: V.Map<S>
    [Tag.record]: V.Record<S>
    [Tag.object]: V.Object<S>
    [Tag.looseObject]: V.LooseObject<S>
    [Tag.objectWithRest]: V.ObjectWithRest<S>
    [Tag.strictObject]: V.StrictObject<S>
    [Tag.tuple]: V.Tuple<S>
    [Tag.looseTuple]: V.LooseTuple<S>
    [Tag.strictTuple]: V.StrictTuple<S>
    [Tag.tupleWithRest]: V.TupleWithRest<S>
  }
  interface Free extends T.HKT { [-1]: V.Hole<this[0]> }
  type Hole<_> = Nullary | Unary<_>
  type Nullary =
    | V.Any
    | V.BigInt
    | V.Blob
    | V.Boolean
    | V.Custom
    | V.Date
    | V.Enum
    | V.File
    | V.Function
    | V.Instance
    | V.Literal
    | V.NaN
    | V.Never
    | V.Null
    | V.Number
    | V.PickList
    | V.String
    | V.Symbol
    | V.Undefined
    | V.Unknown
    | V.Void
    /** @deprecated */
    | V.Promise
  type Unary<T> =
    | V.Array<T>
    | V.ExactOptional<T>
    | V.Lazy<T>
    | V.NonNullable<T>
    | V.NonNullish<T>
    | V.NonOptional<T>
    | V.Nullable<T>
    | V.Nullish<T>
    | V.Optional<T>
    | V.Set<T>
    | V.Undefinedable<T>
    | V.Intersect<T>
    | V.Union<T>
    | V.Variant<T>
    | V.Map<T>
    | V.Record<T>
    | V.Tuple<T>
    | V.LooseTuple<T>
    | V.StrictTuple<T>
    | V.TupleWithRest<T>
    | V.Object<T>
    | V.LooseObject<T>
    | V.ObjectWithRest<T>
    | V.StrictObject<T>
  type Fixpoint =
    | Nullary
    | V.Array<Fixpoint>
    | V.ExactOptional<Fixpoint>
    | V.Lazy<Fixpoint>
    | V.NonNullable<Fixpoint>
    | V.NonNullish<Fixpoint>
    | V.NonOptional<Fixpoint>
    | V.Nullable<Fixpoint>
    | V.Nullish<Fixpoint>
    | V.Optional<Fixpoint>
    | V.Set<Fixpoint>
    | V.Undefinedable<Fixpoint>
    | V.Map<Fixpoint>
    | V.Record<Fixpoint>
    | V.Intersect<Fixpoint>
    | V.Union<Fixpoint>
    | V.Variant<Fixpoint>
    | V.Tuple<Fixpoint>
    | V.LooseTuple<Fixpoint>
    | V.TupleWithRest<Fixpoint>
    | V.StrictTuple<Fixpoint>
    | V.Object<Fixpoint>
    | V.LooseObject<Fixpoint>
    | V.ObjectWithRest<Fixpoint>
    | V.StrictObject<Fixpoint>
  interface Any { type: Tag['any'] }
  interface BigInt { type: Tag['bigint'] }
  interface Blob { type: Tag['blob'] }
  interface Boolean { type: Tag['boolean'] }
  interface Date { type: Tag['date'] }
  interface File { type: Tag['file'] }
  interface Function { type: Tag['function'] }
  interface NaN { type: Tag['NaN'] }
  interface Never { type: Tag['never'] }
  interface Null { type: Tag['null'] }
  interface Number { type: Tag['number'] }
  interface String { type: Tag['string'] }
  interface Symbol { type: Tag['symbol'] }
  interface Undefined { type: Tag['undefined'] }
  interface Unknown { type: Tag['unknown'] }
  interface Void { type: Tag['void'] }
  interface Custom { type: Tag['custom'] /* TODO: check:  */ }
  interface Enum<N = unknown> { type: Tag['enum'], enum: { [x: string]: N }, options: readonly N[] }
  interface Instance<T extends { new(...args: never): unknown } = { new(...args: never): unknown }> { type: Tag['instance'], class: T }
  interface Lazy<S = unknown> { type: Tag['lazy'], getter(): S }
  interface Literal<N = unknown> { type: Tag['literal'], literal: N }
  interface PickList<T extends readonly (boolean | number | bigint | string)[] = readonly (boolean | number | bigint | string)[]> { type: Tag['picklist'], options: T }
  interface Array<S = unknown> { type: Tag['array'], item: S } /* TODO: & Array.Check */
  interface ExactOptional<S = unknown> { type: Tag['exactOptional'], wrapped: S }
  interface NonNullable<S = unknown> { type: Tag['nonNullable'], wrapped: S }
  interface NonNullish<S = unknown> { type: Tag['nonNullish'], wrapped: S }
  interface NonOptional<S = unknown> { type: Tag['nonOptional'], wrapped: S }
  interface Nullable<S = unknown> { type: Tag['nullable'], wrapped: S }
  interface Nullish<S = unknown> { type: Tag['nullish'], wrapped: S }
  interface Optional<S = unknown> { type: Tag['optional'], wrapped: S }
  interface Set<S = unknown> { type: Tag['set'], value: S }
  interface Undefinedable<S = unknown> { type: Tag['undefinedable'], wrapped: S }
  interface Map<S = unknown> { type: Tag['map'], key: S, value: S }
  interface Record<S = unknown> { type: Tag['record'], key: S, value: S }
  interface Intersect<S = unknown> { type: Tag['intersect'], options: readonly S[] }
  interface Union<S = unknown> { type: Tag['union'], options: readonly S[] }
  interface Variant<S = unknown, K extends keyof any = keyof any> { type: Tag['variant'], key: K, options: readonly (V.Object<S>)[] }
  interface Tuple<S = unknown> { type: Tag['tuple'], items: readonly S[] }
  interface StrictTuple<S = unknown> { type: Tag['strictTuple'], items: readonly S[] }
  interface LooseTuple<S = unknown> { type: Tag['looseTuple'], items: readonly S[] }
  interface TupleWithRest<S = unknown> { type: Tag['tupleWithRest'], items: readonly S[], rest: S }
  interface Object<S = unknown> { type: Tag['object'], entries: { [x: string]: S } }
  interface LooseObject<S = unknown> { type: Tag['looseObject'], entries: { [x: string]: S } }
  interface ObjectWithRest<S = unknown> { type: Tag['objectWithRest'], entries: { [x: string]: S }, rest: S }
  interface StrictObject<S = unknown> { type: Tag['strictObject'], entries: { [x: string]: S } }
  /** @deprecated */
  interface Promise { type: Tag['promise'] }
}

export interface LowerBound<Type extends string = string> {
  kind: 'schema'
  type: Type
  async: false
  reference: any
  expects: string
  "~standard": StandardProps<any, any>
  "~run": any
}

const defaultIndex = {
  depth: 0,
  path: [],
} satisfies Required<Functor.Index>

export declare namespace Functor {
  interface Index {
    depth: number
    path: (string | number)[]
  }
}

export const Functor: T.Functor.Ix<Functor.Index, V.Free, LowerBound> = {
  map(g) {
    return (x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case isNullary(x): return x
        case tagged('array')(x): return { type: x.type, item: g(x.item) }
        case tagged('optional')(x): return { type: x.type, wrapped: g(x.wrapped) }
        case tagged('exactOptional')(x): return { type: x.type, wrapped: g(x.wrapped) }
        case tagged('nullable')(x): return { type: x.type, wrapped: g(x.wrapped) }
        case tagged('nullish')(x): return { type: x.type, wrapped: g(x.wrapped) }
        case tagged('nonNullable')(x): return { type: x.type, wrapped: g(x.wrapped) }
        case tagged('nonNullish')(x): return { type: x.type, wrapped: g(x.wrapped) }
        case tagged('nonOptional')(x): return { type: x.type, wrapped: g(x.wrapped) }
        case tagged('undefinedable')(x): return { type: x.type, wrapped: g(x.wrapped) }
        case tagged('set')(x): return { type: x.type, value: g(x.value) }
        case tagged('lazy')(x): return { type: x.type, getter: () => g(x.getter()) }
        case tagged('map')(x): return { type: x.type, key: g(x.key), value: g(x.value) }
        case tagged('record')(x): return { type: x.type, key: g(x.key), value: g(x.value) }
        case tagged('union')(x): return { type: x.type, options: fn.map(x.options, g) }
        case tagged('intersect')(x): return { type: x.type, options: fn.map(x.options, g) }
        case tagged('object')(x): return { type: x.type, entries: fn.map(x.entries, g) }
        case tagged('looseObject')(x): return { type: x.type, entries: fn.map(x.entries, g) }
        case tagged('strictObject')(x): return { type: x.type, entries: fn.map(x.entries, g) }
        case tagged('objectWithRest')(x): return { type: x.type, entries: fn.map(x.entries, g), rest: g(x.rest) }
        case tagged('tuple')(x): return { type: x.type, items: fn.map(x.items, g) }
        case tagged('looseTuple')(x): return { type: x.type, items: fn.map(x.items, g) }
        case tagged('strictTuple')(x): return { type: x.type, items: fn.map(x.items, g) }
        case tagged('tupleWithRest')(x): return { type: x.type, items: fn.map(x.items, g), rest: g(x.rest) }
        case tagged('variant')(x): return { type: x.type, key: x.key, options: fn.map(x.options, (y) => ({ type: y.type, entries: fn.map(y.entries, g) })) }
      }
    }
  },
  mapWithIndex(g) {
    return (x, ix) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case isNullary(x): return x
        case tagged('array')(x): return { type: x.type, item: g(x.item, ix, x) }
        case tagged('optional')(x): return { type: x.type, wrapped: g(x.wrapped, ix, x) }
        case tagged('exactOptional')(x): return { type: x.type, wrapped: g(x.wrapped, ix, x) }
        case tagged('nullable')(x): return { type: x.type, wrapped: g(x.wrapped, ix, x) }
        case tagged('nullish')(x): return { type: x.type, wrapped: g(x.wrapped, ix, x) }
        case tagged('nonNullable')(x): return { type: x.type, wrapped: g(x.wrapped, ix, x) }
        case tagged('nonNullish')(x): return { type: x.type, wrapped: g(x.wrapped, ix, x) }
        case tagged('nonOptional')(x): return { type: x.type, wrapped: g(x.wrapped, ix, x) }
        case tagged('undefinedable')(x): return { type: x.type, wrapped: g(x.wrapped, ix, x) }
        case tagged('set')(x): return { type: x.type, value: g(x.value, ix, x) }
        case tagged('lazy')(x): return { type: x.type, getter: () => g(x.getter(), ix, x) }
        case tagged('map')(x): return { type: x.type, key: g(x.key, ix, x), value: g(x.value, ix, x) }
        case tagged('record')(x): return { type: x.type, key: g(x.key, ix, x), value: g(x.value, ix, x) }
        case tagged('union')(x): return { type: x.type, options: fn.map(x.options, (y) => g(y, ix, x)) }
        case tagged('intersect')(x): return { type: x.type, options: fn.map(x.options, (y) => g(y, ix, x)) }
        case tagged('object')(x): return { type: x.type, entries: fn.map(x.entries, (y) => g(y, ix, x)) }
        case tagged('looseObject')(x): return { type: x.type, entries: fn.map(x.entries, (y) => g(y, ix, x)) }
        case tagged('strictObject')(x): return { type: x.type, entries: fn.map(x.entries, (y) => g(y, ix, x)) }
        case tagged('objectWithRest')(x): return { type: x.type, entries: fn.map(x.entries, (y) => g(y, ix, x)), rest: g(x.rest, ix, x) }
        case tagged('tuple')(x): return { type: x.type, items: fn.map(x.items, (y) => g(y, ix, x)) }
        case tagged('looseTuple')(x): return { type: x.type, items: fn.map(x.items, (y) => g(y, ix, x)) }
        case tagged('strictTuple')(x): return { type: x.type, items: fn.map(x.items, (y) => g(y, ix, x)) }
        case tagged('tupleWithRest')(x): return { type: x.type, items: fn.map(x.items, (y) => g(y, ix, x)), rest: g(x.rest, ix, x) }
        case tagged('variant')(x): return { type: x.type, key: x.key, options: fn.map(x.options, (y) => ({ type: y.type, entries: fn.map(y.entries, (z) => g(z, ix, x)) })) }
      }
    }
  }
}

export const fold = fn.catamorphism(Functor, defaultIndex)
