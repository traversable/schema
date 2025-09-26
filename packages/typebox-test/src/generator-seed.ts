import * as typebox from '@sinclair/typebox'
import type * as T from '@traversable/registry'
import { fn, Object_keys } from '@traversable/registry'

import * as Bounds from './generator-bounds.js'

export type Tag = byTag[keyof byTag]
export type byTag = typeof byTag
export const byTag = {
  any: 10,
  boolean: 15,
  date: 20,
  never: 35,
  null: 40,
  symbol: 45,
  undefined: 50,
  unknown: 55,
  void: 60,
  integer: 100,
  bigint: 150,
  number: 200,
  string: 250,
  literal: 550,
  array: 1000,
  optional: 2500,
  intersect: 6000,
  record: 7000,
  object: 7500,
  tuple: 8000,
  union: 8500,
} as const

export function invert<T extends Record<keyof any, keyof any>>(x: T): { [K in keyof T as T[K]]: K }
export function invert(x: Record<keyof any, keyof any>) {
  return Object_keys(x).reduce((acc, k) => (acc[x[k]] = k, acc), {} as typeof x)
}

export type bySeed = typeof bySeed
export const bySeed = invert(byTag)
//           ^?

export type Seed<T = unknown> =
  & Seed.TerminalMap
  & Seed.BoundableMap
  & Seed.ValueMap
  & Seed.UnaryMap<T>

export declare namespace Seed {
  type Fixpoint = [
    tag: Tag, children?:
    unknown,
    bounds?: Seed.Array<never>[2]
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
    | Seed.Tuple<T>
    | Seed.Union<T>
    | Seed.Optional<T>
    | Seed.Intersect<T>

  interface Free extends T.HKT { [-1]: Seed.F<this[0]> }
  ////////////////
  /// nullary
  type Any = [any: byTag['any']]
  type Boolean = [boolean: byTag['boolean']]
  type Date = [date: byTag['date']]
  type Never = [never: byTag['never']]
  type Null = [null: byTag['null']]
  type Symbol = [symbol: byTag['symbol']]
  type Undefined = [undefined: byTag['undefined']]
  type Unknown = [unknown: byTag['unknown']]
  type Void = [void: byTag['void']]
  type Terminal = TerminalMap[keyof TerminalMap]
  type TerminalMap = {
    any: Any
    boolean: Boolean
    date: Date
    never: Never
    null: Null
    symbol: Symbol
    undefined: Undefined
    unknown: Unknown
    void: Void
  }
  ////////////////
  /// boundable
  type Integer = [integer: byTag['integer'], bounds?: Bounds.int]
  type BigInt = [bigint: byTag['bigint'], bounds?: Bounds.bigint]
  type Number = [number: byTag['number'], bounds?: Bounds.number]
  type String = [string: byTag['string'], bounds?: Bounds.string]
  type Boundable = BoundableMap[keyof BoundableMap]
  type BoundableMap = {
    integer: Integer
    bigint: BigInt
    number: Number
    string: String
  }
  ////////////////
  /// value
  type Literal = [literal: byTag['literal'], value: string | number | boolean]
  type Value = ValueMap[keyof ValueMap]
  type ValueMap = {
    literal: Literal
  }
  ////////////////
  /// unary
  type Array<T = unknown> = [array: byTag['array'], items: T, bounds?: Bounds.array]
  type Optional<T = unknown> = [optional: byTag['optional'], schema: T]
  type UnaryMap<T = unknown> = {
    array: Seed.Array<T>
    record: Seed.Record<T>
    object: Seed.Object<T>
    tuple: Seed.Tuple<T>
    union: Seed.Union<T>
    optional: Seed.Optional<T>
    intersect: Seed.Intersect<T>
  }
  type Composite =
    | Seed.Array
    | Seed.Record
    | Seed.Object
    | Seed.Tuple
  type fromComposite = {
    [byTag.array]: unknown[]
    [byTag.record]: globalThis.Record<string, unknown>
    [byTag.object]: { [x: string]: unknown }
    [byTag.tuple]: unknown[]
  }
  type schemaFromComposite = {
    [byTag.array]: typebox.TArray
    [byTag.record]: typebox.TRecord
    [byTag.object]: typebox.TObject
    [byTag.tuple]: typebox.TTuple
  }
  ////////////////
  /// applicative
  type Object<T = unknown> = [object: byTag['object'], properties: [K: string, V: T][]]
  type Union<T = unknown> = [union: byTag['union'], anyOf: T[]]
  type Tuple<T = unknown> = [tuple: byTag['tuple'], items: T[]]
  ////////////////
  /// binary
  type Record<T = unknown> = [record: byTag['record'], additionalProperties: T]
  type Intersect<T = unknown> = [intersect: byTag['intersect'], allOf: [A: T, B: T]]
}

export const Functor: T.Functor.Ix<boolean, Seed.Free, Seed.F<any>> = {
  map(f) {
    return (x) => {
      switch (true) {
        default: return x satisfies never
        case x[0] === byTag.any: return x
        case x[0] === byTag.boolean: return x
        case x[0] === byTag.date: return x
        case x[0] === byTag.never: return x
        case x[0] === byTag.null: return x
        case x[0] === byTag.symbol: return x
        case x[0] === byTag.undefined: return x
        case x[0] === byTag.unknown: return x
        case x[0] === byTag.void: return x
        case x[0] === byTag.integer: return x
        case x[0] === byTag.bigint: return x
        case x[0] === byTag.number: return x
        case x[0] === byTag.string: return x
        case x[0] === byTag.literal: return x
        case x[0] === byTag.array: return [x[0], f(x[1]), x[2]]
        case x[0] === byTag.optional: return [x[0], f(x[1])]
        case x[0] === byTag.intersect: return [x[0], [f(x[1][0]), f(x[1][1])]]
        case x[0] === byTag.record: return [x[0], f(x[1])]
        case x[0] === byTag.object: return [x[0], x[1].map(([k, v]) => [k, f(v)] satisfies [any, any])]
        case x[0] === byTag.tuple: return [x[0], x[1].map(f)]
        case x[0] === byTag.union: return [x[0], x[1].map(f)]
      }
    }
  },
  mapWithIndex(f) {
    return (x, isProperty) => {
      switch (true) {
        default: return x satisfies never
        case x[0] === byTag.any: return x
        case x[0] === byTag.boolean: return x
        case x[0] === byTag.date: return x
        case x[0] === byTag.never: return x
        case x[0] === byTag.null: return x
        case x[0] === byTag.symbol: return x
        case x[0] === byTag.undefined: return x
        case x[0] === byTag.unknown: return x
        case x[0] === byTag.void: return x
        case x[0] === byTag.integer: return x
        case x[0] === byTag.bigint: return x
        case x[0] === byTag.number: return x
        case x[0] === byTag.string: return x
        case x[0] === byTag.literal: return x
        case x[0] === byTag.array: return [x[0], f(x[1], false, x), x[2]]
        case x[0] === byTag.optional: return [x[0], f(x[1], false, x)]
        case x[0] === byTag.intersect: return [x[0], [f(x[1][0], false, x), f(x[1][1], false, x)]]
        case x[0] === byTag.record: return [x[0], f(x[1], false, x)]
        case x[0] === byTag.tuple: return [x[0], x[1].map((_) => f(_, false, x))]
        case x[0] === byTag.union: return [x[0], x[1].map((_) => f(_, false, x))]
        case x[0] === byTag.object: return [x[0], x[1].map(([k, v]) => [k, f(v, true, x)] satisfies [any, any])]
      }
    }
  }
}

export const fold = fn.catamorphism(Functor, false)
