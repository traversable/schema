import * as typebox from 'typebox'
import type * as T from '@traversable/registry'
import type { newtype } from '@traversable/registry'
import { fn, Object_keys } from '@traversable/registry'

import * as Bounds from './generator-bounds.js'

export type Tag = byTag[keyof byTag]
export type byTag = typeof byTag
export const byTag = {
  any: 10 as const,
  boolean: 15 as const,
  // date: 20 as const,
  never: 35 as const,
  null: 40 as const,
  symbol: 45 as const,
  undefined: 50 as const,
  unknown: 55 as const,
  void: 60 as const,
  integer: 100 as const,
  bigint: 150 as const,
  number: 200 as const,
  string: 250 as const,
  literal: 550 as const,
  array: 1000 as const,
  optional: 2500 as const,
  intersect: 6000 as const,
  record: 7000 as const,
  object: 7500 as const,
  tuple: 8000 as const,
  union: 8500 as const,
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
  interface Any extends newtype<[byTag['any']]> {}
  interface Boolean extends newtype<[byTag['boolean']]> {}
  // interface Date extends newtype<[byTag['date']]> {}
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
    // date: Date
    never: Never
    null: Null
    symbol: Symbol
    undefined: Undefined
    unknown: Unknown
    void: Void
  }
  ////////////////
  /// boundable
  interface Integer extends newtype<[seed: byTag['integer'], bounds?: Bounds.int]> {}
  interface BigInt extends newtype<[seed: byTag['bigint'], bounds?: Bounds.bigint]> {}
  interface Number extends newtype<[seed: byTag['number'], bounds?: Bounds.number]> {}
  interface String extends newtype<[seed: byTag['string'], bounds?: Bounds.string]> {}
  type Boundable = BoundableMap[keyof BoundableMap]
  type BoundableMap = {
    integer: Integer
    bigint: BigInt
    number: Number
    string: String
  }
  ////////////////
  /// value
  interface Literal extends newtype<[seed: byTag['literal'], value: string | number | boolean]> {}
  type Value = ValueMap[keyof ValueMap]
  type ValueMap = {
    literal: Literal
  }
  ////////////////
  /// unary
  interface Array<T = unknown> extends newtype<[seed: byTag['array'], def: T, bounds?: Bounds.array]> {}
  interface Optional<T = unknown> extends newtype<[seed: byTag['optional'], def: T]> {}
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
  interface Object<T = unknown> extends newtype<[seed: byTag['object'], def: [K: string, V: T][]]> {}
  interface Union<T = unknown> extends newtype<[seed: byTag['union'], def: T[]]> {}
  interface Tuple<T = unknown> extends newtype<[seed: byTag['tuple'], def: T[]]> {}
  ////////////////
  /// binary
  interface Record<T = unknown> extends newtype<[seed: byTag['record'], def: T]> {}
  interface Intersect<T = unknown> extends newtype<[seed: byTag['intersect'], def: [A: T, B: T]]> {}
}

export const Functor: T.Functor.Ix<boolean, Seed.Free, Seed.F<unknown>> = {
  map(f) {
    return (x) => {
      switch (true) {
        default: return x satisfies never
        case x[0] === byTag.any: return x
        case x[0] === byTag.boolean: return x
        // case x[0] === byTag.date: return x
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
        // case x[0] === byTag.date: return x
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

export const fold
  : <T>(g: (src: Seed.F<T>, ix: boolean, x: Seed.Fixpoint) => T) => (src: Seed.F<T>, isProperty?: boolean) => T
  = (g) => (src, isProperty = false) => fn.catamorphism(Functor, false)(g)(src, isProperty)
