import type * as T from '@traversable/registry'
import type { newtype } from '@traversable/registry'
import { fn, Object_keys } from '@traversable/registry'

import * as Bounds from './generator-bounds.js'
import { TypeName } from '@traversable/json-schema-types'
import { Json } from '@traversable/json'

export type Tag = byTag[keyof byTag]
export type byTag = typeof byTag
export const byTag = {
  boolean: 15 as const,
  never: 35 as const,
  null: 40 as const,
  unknown: 55 as const,
  integer: 100 as const,
  number: 200 as const,
  string: 250 as const,
  enum: 350 as const,
  const: 550 as const,
  array: 1000 as const,
  intersection: 6000 as const,
  record: 7000 as const,
  object: 7500 as const,
  tuple: 8000 as const,
  union: 8500 as const,
} as const satisfies Record<TypeName, number>

export function invert<T extends Record<keyof any, keyof any>>(x: { [K in keyof T]: T[K] }): { [K in keyof T as T[K]]: K }
export function invert(x: {}) {
  return Object_keys(x).reduce((acc, k) => (acc[x[k]] = k, acc), {})
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
    bounds?:
    | Seed.Array<never>[2]
    | Seed.Object<never>[2]
    | Seed.Record<unknown>[2]
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
    | Seed.Intersection<T>

  interface Free extends T.HKT { [-1]: Seed.F<this[0]> }
  ////////////////
  /// nullary
  interface Boolean extends newtype<[byTag['boolean']]> {}
  interface Never extends newtype<[byTag['never']]> {}
  interface Null extends newtype<[byTag['null']]> {}
  interface Unknown extends newtype<[byTag['unknown']]> {}
  type Terminal = TerminalMap[keyof TerminalMap]
  type TerminalMap = {
    boolean: Boolean
    never: Never
    null: Null
    unknown: Unknown
  }
  ////////////////
  /// boundable
  interface Integer extends newtype<[seed: byTag['integer'], bounds?: Bounds.int]> {}
  interface Number extends newtype<[seed: byTag['number'], bounds?: Bounds.number]> {}
  interface String extends newtype<[seed: byTag['string'], bounds?: Bounds.string]> {}
  type Boundable = BoundableMap[keyof BoundableMap]
  type BoundableMap = {
    integer: Integer
    number: Number
    string: String
  }
  ////////////////
  /// value
  interface Const extends newtype<[seed: byTag['const'], value: Json]> {}
  interface Enum extends newtype<[seed: byTag['enum'], value: Exclude<Json.Scalar, undefined>[]]> {}
  type Value = ValueMap[keyof ValueMap]
  type ValueMap = {
    const: Const
    enum: Enum
  }
  ////////////////
  /// unary
  interface Array<T = unknown> extends newtype<[seed: byTag['array'], def: T, bounds?: Bounds.array]> {}
  type UnaryMap<T = unknown> = {
    array: Seed.Array<T>
    record: Seed.Record<T>
    object: Seed.Object<T>
    tuple: Seed.Tuple<T>
    union: Seed.Union<T>
    intersection: Seed.Intersection<T>
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
  ////////////////
  /// applicative
  interface Union<T = unknown> extends newtype<[seed: byTag['union'], def: T[]]> {}
  interface Tuple<T = unknown> extends newtype<[seed: byTag['tuple'], def: T[]]> {}
  interface Object<T = unknown> extends newtype<[seed: byTag['object'], def: [K: string, V: T][], req: string[]]> {}
  ////////////////
  /// binary
  interface Record<T = unknown> extends newtype<[seed: byTag['record'], additionalProperties?: T, patternProperties?: [K: string, V: T]]> {}
  interface Intersection<T = unknown> extends newtype<[seed: byTag['intersection'], def: T[]]> {}
}

export const Functor: T.Functor.Ix<boolean, Seed.Free, Seed.F<unknown>> = {
  map(f) {
    return (x) => {
      switch (true) {
        default: return x satisfies never
        case x[0] === byTag.boolean: return x
        case x[0] === byTag.never: return x
        case x[0] === byTag.null: return x
        case x[0] === byTag.unknown: return x
        case x[0] === byTag.integer: return x
        case x[0] === byTag.number: return x
        case x[0] === byTag.string: return x
        case x[0] === byTag.enum: return x
        case x[0] === byTag.const: return x
        case x[0] === byTag.array: return [x[0], f(x[1]), x[2]]
        case x[0] === byTag.intersection: return [x[0], x[1].map(f)]
        case x[0] === byTag.tuple: return [x[0], x[1].map(f)]
        case x[0] === byTag.union: return [x[0], x[1].map(f)]
        case x[0] === byTag.object: return [x[0], x[1].map(([k, v]) => [k, f(v)] satisfies [any, any]), x[2]]
        case x[0] === byTag.record: {
          return x[1] && x[2]
            ? [x[0], f(x[1]), [x[2][0], f(x[2][1])] satisfies [any, any]]
            : x[2] ? [x[0], undefined, [x[2][0], f(x[2][1])] satisfies [any, any]]
              : x[1]
                ? [x[0], f(x[1])] satisfies [any, any]
                : [x[0]] satisfies [any]
        }
      }
    }
  },
  mapWithIndex(f) {
    return (x, isProperty) => {
      switch (true) {
        default: return x satisfies never
        case x[0] === byTag.boolean: return x
        case x[0] === byTag.never: return x
        case x[0] === byTag.null: return x
        case x[0] === byTag.unknown: return x
        case x[0] === byTag.integer: return x
        case x[0] === byTag.number: return x
        case x[0] === byTag.string: return x
        case x[0] === byTag.enum: return x
        case x[0] === byTag.const: return x
        case x[0] === byTag.array: return [x[0], f(x[1], false, x), x[2]]
        case x[0] === byTag.tuple: return [x[0], x[1].map((_) => f(_, false, x))]
        case x[0] === byTag.union: return [x[0], x[1].map((_) => f(_, isProperty, x))]
        case x[0] === byTag.intersection: return [x[0], x[1].map((_) => f(_, isProperty, x))]
        case x[0] === byTag.record: return x[1] && x[2]
          ? [x[0], f(x[1], false, x), [x[2][0], f(x[2][1], false, x)] satisfies [any, any]]
          : x[2] ? [x[0], undefined, [x[2][0], f(x[2][1], false, x)] satisfies [any, any]]
            : x[1]
              ? [x[0], f(x[1], false, x)]
              : [x[0]]
        case x[0] === byTag.object: {
          // console.log('x in Functor', x)
          return [x[0], x[1].map(([k, v]) => [k, f(v, true, x)] satisfies [any, any]), x[2]]
        }
      }
    }
  }
}

export const fold
  : <T>(g: (src: Seed.F<T>, ix: boolean, x: Seed.Fixpoint) => T) => (src: Seed.F<T>, isProperty?: boolean) => T
  = (g) => (src, isProperty = false) => fn.catamorphism(Functor, false)(g)(src, isProperty)
