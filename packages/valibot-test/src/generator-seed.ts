import * as v from 'valibot'
import type * as T from '@traversable/registry'
import type { newtype } from '@traversable/registry'
import { fn, Object_keys } from '@traversable/registry'
import type { AnyTag } from '@traversable/valibot-types'

import * as Bounds from './generator-bounds.js'
import { PromiseSchemaIsUnsupported } from './utils.js'

export function invert<T extends Record<keyof any, keyof any>>(x: T): { [K in keyof T as T[K]]: K }
export function invert(x: Record<keyof any, keyof any>) {
  return Object_keys(x).reduce((acc, k) => (acc[x[k]] = k, acc), {} as typeof x)
}

export type Tag = byTag[keyof byTag]
export type byTag = typeof byTag
export const byTag = {
  any: 10,
  boolean: 15,
  date: 20,
  file: 25,
  blob: 27,
  nan: 30,
  never: 35,
  null: 40,
  symbol: 45,
  undefined: 50,
  unknown: 55,
  void: 60,
  function: 70,
  instance: 80,
  bigint: 150,
  number: 200,
  string: 250,
  enum: 500,
  literal: 550,
  array: 1000,
  non_optional: 1500,
  nullable: 2000,
  non_nullable: 2100,
  nullish: 2200,
  non_nullish: 2300,
  optional: 2500,
  exact_optional: 2600,
  undefinedable: 2700,
  set: 3500,
  intersect: 6000,
  map: 6500,
  record: 7000,
  object: 7500,
  loose_object: 7600,
  strict_object: 7700,
  object_with_rest: 7800,
  tuple: 8000,
  loose_tuple: 8100,
  strict_tuple: 8200,
  tuple_with_rest: 8300,
  union: 8500,
  variant: 8600,
  custom: 9500,
  lazy: 10_500,
  picklist: 11_000,
  /** @deprecated */
  promise: -1000,
} as const satisfies Record<AnyTag, number>

export type bySeed = typeof bySeed
export const bySeed = invert(byTag)

export type Seed<T = unknown> =
  & Seed.TerminalMap
  & Seed.BoundableMap
  & Seed.ValueMap
  & Seed.UnaryMap<T>

export declare namespace Seed {
  type Fixpoint = [
    tag: Tag, children?:
    unknown,
    bounds?: unknown
  ]
  type F<T> =
    | Seed.Nullary
    | Seed.Unary<T>
  type Nullary =
    | Seed.Terminal
    | Seed.Boundable
    | Seed.Value
  type Unary<T> =
    | Seed.Array<T>
    | Seed.Record<T>
    | Seed.Object<T>
    | Seed.LooseObject<T>
    | Seed.StrictObject<T>
    | Seed.ObjectWithRest<T>
    | Seed.Tuple<T>
    | Seed.TupleWithRest<T>
    | Seed.LooseTuple<T>
    | Seed.StrictTuple<T>
    | Seed.Union<T>
    | Seed.Variant<T>
    | Seed.Optional<T>
    | Seed.NonOptional<T>
    | Seed.Undefinedable<T>
    | Seed.Nullable<T>
    | Seed.NonNullable<T>
    | Seed.Nullish<T>
    | Seed.NonNullish<T>
    | Seed.Set<T>
    | Seed.Map<T>
    | Seed.Custom<T>
    | Seed.Lazy<T>
    | Seed.Intersect<T>
    | Seed.Promise<T>

  interface Free extends T.HKT { [-1]: Seed.F<this[0]> }
  ////////////////
  /// nullary
  interface Any extends newtype<[byTag['any']]> {}
  interface Boolean extends newtype<[byTag['boolean']]> {}
  interface Date extends newtype<[byTag['date']]> {}
  interface File extends newtype<[byTag['file']]> {}
  interface Blob extends newtype<[byTag['blob']]> {}
  interface NaN extends newtype<[byTag['nan']]> {}
  interface Never extends newtype<[byTag['never']]> {}
  interface Null extends newtype<[byTag['null']]> {}
  interface Symbol extends newtype<[byTag['symbol']]> {}
  interface Undefined extends newtype<[byTag['undefined']]> {}
  interface Unknown extends newtype<[byTag['unknown']]> {}
  interface Void extends newtype<[byTag['void']]> {}
  type Terminal = TerminalMap[keyof TerminalMap]
  type TerminalMap = {
    any: Any
    boolean: Boolean
    date: Date
    file: File
    blob: Blob
    nan: NaN
    never: Never
    null: Null
    symbol: Symbol
    undefined: Undefined
    unknown: Unknown
    void: Void
  }
  ////////////////
  /// boundable
  interface BigInt extends newtype<[seed: byTag['bigint'], bounds?: Bounds.bigint]> {}
  interface Number extends newtype<[seed: byTag['number'], bounds?: Bounds.number]> {}
  interface String extends newtype<[seed: byTag['string'], bounds?: Bounds.string]> {}
  type Boundable = BoundableMap[keyof BoundableMap]
  type BoundableMap = {
    bigint: BigInt
    number: Number
    string: String
  }
  ////////////////
  /// value
  interface Enum extends newtype<[seed: byTag['enum'], value: { [x: string]: number | string }]> {}
  interface Literal extends newtype<[seed: byTag['literal'], value: boolean | number | string]> {}
  namespace TemplateLiteral {
    type Node = T.Showable | Seed.Boolean | Seed.Null | Seed.Undefined | Seed.Number | Seed.BigInt | Seed.String | Seed.Literal
  }
  type Value = ValueMap[keyof ValueMap]
  type ValueMap = {
    enum: Enum
    literal: Literal
  }
  ////////////////
  /// unary
  interface Array<T = unknown> extends newtype<[seed: byTag['array'], def: T, bounds?: Bounds.array]> {}
  interface Optional<T = unknown> extends newtype<[seed: byTag['optional'], def: T]> {}
  interface NonOptional<T = unknown> extends newtype<[seed: byTag['non_optional'], def: T]> {}
  interface Undefinedable<T = unknown> extends newtype<[seed: byTag['undefinedable'], def: T]> {}
  interface Nullish<T = unknown> extends newtype<[seed: byTag['nullish'], def: T]> {}
  interface NonNullish<T = unknown> extends newtype<[seed: byTag['non_nullish'], def: T]> {}
  interface Nullable<T = unknown> extends newtype<[seed: byTag['nullable'], def: T]> {}
  interface NonNullable<T = unknown> extends newtype<[seed: byTag['non_nullable'], def: T]> {}
  interface Set<T = unknown> extends newtype<[seed: byTag['set'], def: T]> {}

  type UnaryMap<T = unknown> = {
    array: Seed.Array<T>
    record: Seed.Record<T>
    object: Seed.Object<T>
    strict_object: Seed.StrictObject<T>
    loose_object: Seed.LooseObject<T>
    object_with_rest: Seed.ObjectWithRest<T>
    tuple: Seed.Tuple<T>
    loose_tuple: Seed.LooseTuple<T>
    strict_tuple: Seed.StrictTuple<T>
    tuple_with_rest: Seed.TupleWithRest<T>
    union: Seed.Union<T>
    variant: Seed.Variant<T>
    optional: Seed.Optional<T>
    non_optional: Seed.NonOptional<T>
    undefinedable: Seed.Undefinedable<T>
    nullable: Seed.Nullable<T>
    non_nullable: Seed.NonNullable<T>
    nullish: Seed.Nullish<T>
    non_nullish: Seed.NonNullish<T>
    set: Seed.Set<T>
    map: Seed.Map<T>
    custom: Seed.Custom<T>
    lazy: Seed.Lazy<T>
    intersect: Seed.Intersect<T>
    promise: Seed.Promise<T>
  }
  type Composite =
    | Seed.Array
    | Seed.Record
    | Seed.Tuple
    | Seed.TupleWithRest
    | Seed.LooseTuple
    | Seed.StrictTuple
    | Seed.Object
    | Seed.ObjectWithRest
    | Seed.LooseObject
    | Seed.StrictObject
  type fromComposite = {
    [byTag.array]: unknown[]
    [byTag.tuple]: unknown[]
    [byTag.loose_tuple]: unknown[]
    [byTag.strict_tuple]: unknown[]
    [byTag.tuple_with_rest]: unknown[]
    [byTag.record]: globalThis.Record<string, unknown>
    [byTag.object]: { [x: string]: unknown }
    [byTag.loose_object]: { [x: string]: unknown }
    [byTag.strict_object]: { [x: string]: unknown }
    [byTag.object_with_rest]: { [x: string]: unknown }
  }
  type schemaFromComposite = {
    [byTag.array]: v.ArraySchema<any, any>
    [byTag.tuple]: v.TupleSchema<any, any>
    [byTag.loose_tuple]: v.LooseTupleSchema<any, any>
    [byTag.strict_tuple]: v.StrictTupleSchema<any, any>
    [byTag.tuple_with_rest]: v.TupleWithRestSchema<any, any, any>
    [byTag.record]: v.RecordSchema<any, any, any>
    [byTag.object]: v.ObjectSchema<any, any>
    [byTag.loose_object]: v.LooseObjectSchema<any, any>
    [byTag.strict_object]: v.StrictObjectSchema<any, any>
    [byTag.object_with_rest]: v.ObjectWithRestSchema<any, any, any>
  }
  ////////////////
  /// applicative
  interface Object<T = unknown> extends newtype<[seed: byTag['object'], def: [K: string, V: T][]]> {}
  interface LooseObject<T = unknown> extends newtype<[seed: byTag['loose_object'], def: [K: string, V: T][]]> {}
  interface StrictObject<T = unknown> extends newtype<[seed: byTag['strict_object'], def: [K: string, V: T][]]> {}
  interface ObjectWithRest<T = unknown> extends newtype<[seed: byTag['object_with_rest'], def: [K: string, V: T][], rest: T]> {}
  interface Union<T = unknown> extends newtype<[seed: byTag['union'], def: T[]]> {}
  interface Variant<T = unknown> extends newtype<[seed: byTag['variant'], [tag: string, [k: string, v: T][]][], discriminator: string]> {}
  interface Tuple<T = unknown> extends newtype<[seed: byTag['tuple'], def: T[]]> {}
  interface LooseTuple<T = unknown> extends newtype<[seed: byTag['loose_tuple'], def: T[]]> {}
  interface StrictTuple<T = unknown> extends newtype<[seed: byTag['strict_tuple'], def: T[]]> {}
  interface TupleWithRest<T = unknown> extends newtype<[seed: byTag['tuple_with_rest'], def: T[], rest: T]> {}
  ////////////////
  /// binary
  interface Map<T = unknown> extends newtype<[seed: byTag['map'], def: [K: T, V: T]]> {}
  interface Record<T = unknown> extends newtype<[seed: byTag['record'], def: T]> {}
  interface Intersect<T = unknown> extends newtype<[seed: byTag['intersect'], def: [A: T, B: T]]> {}
  ////////////////
  /// special
  interface Custom<T = unknown> extends newtype<[seed: byTag['custom'], def: T]> {}
  interface Lazy<T = unknown> extends newtype<[seed: byTag['lazy'], def: () => T]> {}
  ////////////////
  /// deprecated
  /** @deprecated */
  interface Promise<T = unknown> extends newtype<[seed: byTag['promise'], def: T]> {}
}

export const Functor: T.Functor.Ix<boolean, Seed.Free, Seed.F<unknown>> = {
  map(f) {
    return (x) => {
      switch (true) {
        default: return x
        case x[0] === byTag.any: return x
        case x[0] === byTag.boolean: return x
        case x[0] === byTag.date: return x
        case x[0] === byTag.file: return x
        case x[0] === byTag.nan: return x
        case x[0] === byTag.never: return x
        case x[0] === byTag.null: return x
        case x[0] === byTag.symbol: return x
        case x[0] === byTag.undefined: return x
        case x[0] === byTag.unknown: return x
        case x[0] === byTag.void: return x
        case x[0] === byTag.bigint: return x
        case x[0] === byTag.number: return x
        case x[0] === byTag.string: return x
        case x[0] === byTag.enum: return x
        case x[0] === byTag.literal: return x
        case x[0] === byTag.array: return [x[0], f(x[1]), x[2]]
        case x[0] === byTag.optional: return [x[0], f(x[1])]
        case x[0] === byTag.non_optional: return [x[0], f(x[1])]
        case x[0] === byTag.undefinedable: return [x[0], f(x[1])]
        case x[0] === byTag.nullable: return [x[0], f(x[1])]
        case x[0] === byTag.non_nullable: return [x[0], f(x[1])]
        case x[0] === byTag.nullish: return [x[0], f(x[1])]
        case x[0] === byTag.non_nullish: return [x[0], f(x[1])]
        case x[0] === byTag.set: return [x[0], f(x[1])]
        case x[0] === byTag.intersect: return [x[0], [f(x[1][0]), f(x[1][1])]]
        case x[0] === byTag.map: return [x[0], [f(x[1][0]), f(x[1][1])]]
        case x[0] === byTag.record: return [x[0], f(x[1])]
        case x[0] === byTag.object: return [x[0], x[1].map(([k, v]) => [k, f(v)] satisfies [any, any])]
        case x[0] === byTag.loose_object: return [x[0], x[1].map(([k, v]) => [k, f(v)] satisfies [any, any])]
        case x[0] === byTag.strict_object: return [x[0], x[1].map(([k, v]) => [k, f(v)] satisfies [any, any])]
        case x[0] === byTag.object_with_rest: return [x[0], x[1].map(([k, v]) => [k, f(v)] satisfies [any, any]), f(x[2])]
        case x[0] === byTag.tuple: return [x[0], x[1].map(f)]
        case x[0] === byTag.loose_tuple: return [x[0], x[1].map(f)]
        case x[0] === byTag.strict_tuple: return [x[0], x[1].map(f)]
        case x[0] === byTag.tuple_with_rest: return [x[0], x[1].map(f), f(x[2])]
        case x[0] === byTag.union: return [x[0], x[1].map(f)]
        case x[0] === byTag.custom: return [x[0], f(x[1])]
        case x[0] === byTag.lazy: return [x[0], () => f(x[1]())]
        case x[0] === byTag.variant: return [x[0], x[1].map(([tag, ys]) => [tag, ys.map(([k, v]) => [k, f(v)] satisfies [any, any])] satisfies [any, any]), x[2]]
        case x[0] === byTag.promise: return PromiseSchemaIsUnsupported('Functor')
      }
    }
  },
  mapWithIndex(f) {
    return (x, isProperty) => {
      switch (true) {
        default: return x
        case x[0] === byTag.any: return x
        case x[0] === byTag.boolean: return x
        case x[0] === byTag.date: return x
        case x[0] === byTag.file: return x
        case x[0] === byTag.nan: return x
        case x[0] === byTag.never: return x
        case x[0] === byTag.null: return x
        case x[0] === byTag.symbol: return x
        case x[0] === byTag.undefined: return x
        case x[0] === byTag.unknown: return x
        case x[0] === byTag.void: return x
        case x[0] === byTag.bigint: return x
        case x[0] === byTag.number: return x
        case x[0] === byTag.string: return x
        case x[0] === byTag.enum: return x
        case x[0] === byTag.literal: return x
        case x[0] === byTag.array: return [x[0], f(x[1], false, x), x[2]]
        case x[0] === byTag.optional: return [x[0], f(x[1], isProperty, x)]
        case x[0] === byTag.non_optional: return [x[0], f(x[1], false, x)]
        case x[0] === byTag.undefinedable: return [x[0], f(x[1], false, x)]
        case x[0] === byTag.nullable: return [x[0], f(x[1], false, x)]
        case x[0] === byTag.non_nullable: return [x[0], f(x[1], false, x)]
        case x[0] === byTag.nullish: return [x[0], f(x[1], false, x)]
        case x[0] === byTag.non_nullish: return [x[0], f(x[1], false, x)]
        case x[0] === byTag.set: return [x[0], f(x[1], false, x)]
        case x[0] === byTag.intersect: return [x[0], [f(x[1][0], false, x), f(x[1][1], false, x)]]
        case x[0] === byTag.map: return [x[0], [f(x[1][0], false, x), f(x[1][1], false, x)]]
        case x[0] === byTag.record: return [x[0], f(x[1], false, x)]
        case x[0] === byTag.tuple: return [x[0], x[1].map((_) => f(_, false, x))]
        case x[0] === byTag.loose_tuple: return [x[0], x[1].map((_) => f(_, false, x))]
        case x[0] === byTag.strict_tuple: return [x[0], x[1].map((_) => f(_, false, x))]
        case x[0] === byTag.tuple_with_rest: return [x[0], x[1].map((_) => f(_, false, x)), f(x[2], false, x)]
        case x[0] === byTag.union: return [x[0], x[1].map((_) => f(_, false, x))]
        case x[0] === byTag.custom: return [x[0], f(x[1], false, x)]
        case x[0] === byTag.lazy: return [x[0], () => f(x[1](), false, x)]
        case x[0] === byTag.object: return [x[0], x[1].map(([k, v]) => [k, f(v, true, x)] satisfies [any, any])]
        case x[0] === byTag.loose_object: return [x[0], x[1].map(([k, v]) => [k, f(v, true, x)] satisfies [any, any])]
        case x[0] === byTag.strict_object: return [x[0], x[1].map(([k, v]) => [k, f(v, true, x)] satisfies [any, any])]
        case x[0] === byTag.object_with_rest: return [x[0], x[1].map(([k, v]) => [k, f(v, true, x)] satisfies [any, any]), f(x[2], true, x)]
        case x[0] === byTag.variant: return [x[0], x[1].map(([tag, ys]) => [tag, ys.map(([k, v]) => [k, f(v, false, x)] satisfies [any, any])] satisfies [any, any]), x[2]]
        case x[0] === byTag.promise: return PromiseSchemaIsUnsupported('Functor')
      }
    }
  }
}

export function fold<T>(g: (src: Seed.F<T>, ix: boolean, x: Seed.Fixpoint) => T): (src: Seed.F<T>, isProperty?: boolean) => T
export function fold<T>(g: (src: Seed.F<T>, ix: boolean, x: Seed.Fixpoint) => T) {
  return (src: Seed.F<T>, isProperty?: boolean) => fn.catamorphism(Functor, false)(g as never)(src, isProperty)
}
