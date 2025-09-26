import type * as T from '@traversable/registry'
import { fn, Object_keys } from '@traversable/registry'

import * as Bounds from './generator-bounds.js'
import { TypeName } from '@traversable/json-schema-types'
import { Json } from '@traversable/json'

export type Tag = byTag[keyof byTag]
export type byTag = typeof byTag
export const byTag = {
  boolean: 15,
  never: 35,
  null: 40,
  unknown: 55,
  integer: 100,
  number: 200,
  string: 250,
  enum: 350,
  const: 550,
  array: 1000,
  allOf: 6000,
  record: 7000,
  object: 7500,
  tuple: 8000,
  anyOf: 8500,
  oneOf: 9000,
} as const satisfies Record<TypeName, number>

export function invert<T extends Record<keyof any, keyof any>>(x: { [K in keyof T]: T[K] }): { [K in keyof T as T[K]]: K }
export function invert(x: {}) {
  return Object_keys(x).reduce((acc, k) => (acc[x[k]] = k, acc), {})
}

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
    | Seed.AnyOf<T>
    | Seed.OneOf<T>
    | Seed.AllOf<T>

  interface Free extends T.HKT { [-1]: Seed.F<this[0]> }
  ////////////////
  /// nullary
  type Boolean = [boolean: byTag['boolean']]
  type Never = [never: byTag['never']]
  type Null = [null: byTag['null']]
  type Unknown = [unknown: byTag['unknown']]
  type Terminal = TerminalMap[keyof TerminalMap]
  type TerminalMap = {
    boolean: Boolean
    never: Never
    null: Null
    unknown: Unknown
  }
  ////////////////
  /// boundable
  type Integer = [integer: byTag['integer'], bounds?: Bounds.int]
  type Number = [number: byTag['number'], bounds?: Bounds.number]
  type String = [string: byTag['string'], bounds?: Bounds.string]
  type Boundable = BoundableMap[keyof BoundableMap]
  type BoundableMap = {
    integer: Integer
    number: Number
    string: String
  }
  ////////////////
  /// value
  type Const = [const_: byTag['const'], value: Json]
  type Enum = [enum_: byTag['enum'], value: Exclude<Json.Scalar, undefined>[]]
  type Value = ValueMap[keyof ValueMap]
  type ValueMap = {
    const: Const
    enum: Enum
  }
  ////////////////
  /// unary
  type Array<T = unknown> = [array: byTag['array'], items: T, bounds?: Bounds.array]
  type UnaryMap<T = unknown> = {
    array: Seed.Array<T>
    record: Seed.Record<T>
    object: Seed.Object<T>
    tuple: Seed.Tuple<T>
    anyOf: Seed.AnyOf<T>
    oneOf: Seed.OneOf<T>
    allOf: Seed.AllOf<T>
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
  type AnyOf<T = unknown> = [anyOf: byTag['anyOf'], members: T[]]
  type OneOf<T = unknown> = [oneOf: byTag['oneOf'], members: T[]]
  type Tuple<T = unknown> = [tuple: byTag['tuple'], items: T[]]
  type Object<T = unknown> = [object: byTag['object'], properties: [K: string, V: T][], req: string[]]
  ////////////////
  /// binary
  type Record<T = unknown> = [record: byTag['record'], additionalProperties?: T, patternProperties?: [K: string, V: T]]
  type AllOf<T = unknown> = [allOf: byTag['allOf'], members: T[]]
}

export const Functor: T.Functor.Ix<boolean, Seed.Free, Seed.F<any>> = {
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
        case x[0] === byTag.allOf: return [x[0], x[1].map(f)]
        case x[0] === byTag.tuple: return [x[0], x[1].map(f)]
        case x[0] === byTag.anyOf: return [x[0], x[1].map(f)]
        case x[0] === byTag.oneOf: return [x[0], x[1].map(f)]
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
        case x[0] === byTag.anyOf: return [x[0], x[1].map((_) => f(_, isProperty, x))]
        case x[0] === byTag.oneOf: return [x[0], x[1].map((_) => f(_, isProperty, x))]
        case x[0] === byTag.allOf: return [x[0], x[1].map((_) => f(_, isProperty, x))]
        case x[0] === byTag.record: return x[1] && x[2]
          ? [x[0], f(x[1], false, x), [x[2][0], f(x[2][1], false, x)] satisfies [any, any]]
          : x[2] ? [x[0], undefined, [x[2][0], f(x[2][1], false, x)] satisfies [any, any]]
            : x[1]
              ? [x[0], f(x[1], false, x)]
              : [x[0]]
        case x[0] === byTag.object: return [x[0], x[1].map(([k, v]) => [k, f(v, true, x)] satisfies [any, any]), x[2]]
      }
    }
  }
}

export const fold = fn.catamorphism(Functor, false)
