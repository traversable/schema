import { z } from 'zod'
import type * as T from '@traversable/registry'
import type { newtype } from '@traversable/registry'
import { fn, Object_keys } from '@traversable/registry'

import * as Bounds from './generator-bounds.js'
import { PromiseSchemaIsUnsupported } from './utils.js'
import type { AnyTypeName } from './typename.js'

export type Tag = byTag[keyof byTag]
export type byTag = typeof byTag
export const byTag = {
  any: 10,
  boolean: 15,
  date: 20,
  file: 25,
  nan: 30,
  never: 35,
  null: 40,
  symbol: 45,
  undefined: 50,
  unknown: 55,
  void: 60,
  int: 100,
  bigint: 150,
  number: 200,
  string: 250,
  enum: 500,
  literal: 550,
  template_literal: 600,
  array: 1000,
  nonoptional: 1500,
  nullable: 2000,
  optional: 2500,
  readonly: 3000,
  set: 3500,
  success: 4000,
  catch: 5000,
  default: 5500,
  prefault: 5600,
  intersection: 6000,
  map: 6500,
  record: 7000,
  object: 7500,
  tuple: 8000,
  union: 8500,
  pipe: 9000,
  custom: 9500,
  transform: 10_000,
  lazy: 10_500,
  //  deprecated
  /** @deprecated */
  promise: 100_000,
} as const satisfies Record<AnyTypeName, number>

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
    | Seed.NonOptional<T>
    | Seed.Optional<T>
    | Seed.Nullable<T>
    | Seed.Readonly<T>
    | Seed.Set<T>
    | Seed.Success<T>
    | Seed.Catch<T>
    | Seed.Default<T>
    | Seed.Prefault<T>
    | Seed.Map<T>
    | Seed.Pipe<T>
    | Seed.Custom<T>
    | Seed.Transform<T>
    | Seed.Lazy<T>
    | Seed.Intersection<T>
    | Seed.Promise<T>

  interface Free extends T.HKT { [-1]: Seed.F<this[0]> }
  ////////////////
  /// nullary
  interface Any extends newtype<[byTag['any']]> {}
  interface Boolean extends newtype<[byTag['boolean']]> {}
  interface Date extends newtype<[byTag['date']]> {}
  interface File extends newtype<[byTag['file']]> {}
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
  interface Integer extends newtype<[seed: byTag['int'], bounds?: Bounds.int]> {}
  interface BigInt extends newtype<[seed: byTag['bigint'], bounds?: Bounds.bigint]> {}
  interface Number extends newtype<[seed: byTag['number'], bounds?: Bounds.number]> {}
  interface String extends newtype<[seed: byTag['string'], bounds?: Bounds.string]> {}
  type Boundable = BoundableMap[keyof BoundableMap]
  type BoundableMap = {
    int: Integer
    bigint: BigInt
    number: Number
    string: String
  }
  ////////////////
  /// value
  interface Enum extends newtype<[seed: byTag['enum'], value: { [x: string]: number | string }]> {}
  interface Literal extends newtype<[seed: byTag['literal'], value: z.core.util.Literal]> {}
  interface TemplateLiteral extends newtype<[seed: byTag['template_literal'], value: TemplateLiteral.Node[]]> {}
  namespace TemplateLiteral {
    type Node =
      | T.Showable
      | Seed.Boolean
      | Seed.Null
      | Seed.Undefined
      | Seed.Integer
      | Seed.Number
      | Seed.BigInt
      | Seed.String
      | Seed.Literal
      | Seed.Nullable
      | Seed.Optional
  }
  type Value = ValueMap[keyof ValueMap]
  type ValueMap = {
    enum: Enum
    literal: Literal
    template_literal: TemplateLiteral
  }
  ////////////////
  /// unary
  interface Array<T = unknown> extends newtype<[seed: byTag['array'], def: T, bounds?: Bounds.array]> {}
  interface NonOptional<T = unknown> extends newtype<[seed: byTag['nonoptional'], def: T]> {}
  interface Optional<T = unknown> extends newtype<[seed: byTag['optional'], def: T]> {}
  interface Nullable<T = unknown> extends newtype<[seed: byTag['nullable'], def: T]> {}
  interface Readonly<T = unknown> extends newtype<[seed: byTag['readonly'], def: T]> {}
  interface Set<T = unknown> extends newtype<[seed: byTag['set'], def: T]> {}
  interface Success<T = unknown> extends newtype<[seed: byTag['success'], def: T]> {}
  interface Catch<T = unknown> extends newtype<[seed: byTag['catch'], def: T]> {}
  interface Default<T = unknown> extends newtype<[seed: byTag['default'], def: T]> {}
  interface Prefault<T = unknown> extends newtype<[seed: byTag['prefault'], def: T]> {}
  type UnaryMap<T = unknown> = {
    array: Seed.Array<T>
    record: Seed.Record<T>
    object: Seed.Object<T>
    tuple: Seed.Tuple<T>
    union: Seed.Union<T>
    nonoptional: Seed.NonOptional<T>
    optional: Seed.Optional<T>
    nullable: Seed.Nullable<T>
    readonly: Seed.Readonly<T>
    set: Seed.Set<T>
    success: Seed.Success<T>
    catch: Seed.Catch<T>
    default: Seed.Default<T>
    prefault: Seed.Prefault<T>
    map: Seed.Map<T>
    pipe: Seed.Pipe<T>
    custom: Seed.Custom<T>
    transform: Seed.Transform<T>
    lazy: Seed.Lazy<T>
    intersection: Seed.Intersection<T>
    promise: Seed.Promise<T>
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
    [byTag.array]: z.ZodArray
    [byTag.record]: z.ZodRecord
    [byTag.object]: z.ZodObject
    [byTag.tuple]: z.ZodTuple
  }
  ////////////////
  /// applicative
  interface Object<T = unknown> extends newtype<[seed: byTag['object'], def: [K: string, V: T][]]> {}
  interface Union<T = unknown> extends newtype<[seed: byTag['union'], def: T[]]> {}
  interface Tuple<T = unknown> extends newtype<[seed: byTag['tuple'], def: T[]]> {}
  ////////////////
  /// binary
  interface Map<T = unknown> extends newtype<[seed: byTag['map'], def: [K: T, V: T]]> {}
  interface Record<T = unknown> extends newtype<[seed: byTag['record'], def: T]> {}
  interface Intersection<T = unknown> extends newtype<[seed: byTag['intersection'], def: [A: T, B: T]]> {}
  ////////////////
  /// special
  interface Pipe<T = unknown> extends newtype<[seed: byTag['pipe'], def: [I: T, O: T]]> {}
  interface Custom<T = unknown> extends newtype<[seed: byTag['custom'], def: T]> {}
  interface Transform<T = unknown> extends newtype<[seed: byTag['transform'], def: T]> {}
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
        case x[0] === byTag.int: return x
        case x[0] === byTag.bigint: return x
        case x[0] === byTag.number: return x
        case x[0] === byTag.string: return x
        case x[0] === byTag.enum: return x
        case x[0] === byTag.literal: return x
        case x[0] === byTag.template_literal: return x
        case x[0] === byTag.array: return [x[0], f(x[1]), x[2]]
        case x[0] === byTag.nonoptional: return [x[0], f(x[1])]
        case x[0] === byTag.nullable: return [x[0], f(x[1])]
        case x[0] === byTag.optional: return [x[0], f(x[1])]
        case x[0] === byTag.readonly: return [x[0], f(x[1])]
        case x[0] === byTag.set: return [x[0], f(x[1])]
        case x[0] === byTag.success: return [x[0], f(x[1])]
        case x[0] === byTag.catch: return [x[0], f(x[1])]
        case x[0] === byTag.default: return [x[0], f(x[1])]
        case x[0] === byTag.prefault: return [x[0], f(x[1])]
        case x[0] === byTag.intersection: return [x[0], [f(x[1][0]), f(x[1][1])]]
        case x[0] === byTag.map: return [x[0], [f(x[1][0]), f(x[1][1])]]
        case x[0] === byTag.record: return [x[0], f(x[1])]
        case x[0] === byTag.object: return [x[0], x[1].map(([k, v]) => [k, f(v)] satisfies [any, any])]
        case x[0] === byTag.tuple: return [x[0], x[1].map(f)]
        case x[0] === byTag.union: return [x[0], x[1].map(f)]
        case x[0] === byTag.pipe: return [x[0], [f(x[1][0]), f(x[1][1])]]
        case x[0] === byTag.custom: return [x[0], f(x[1])]
        case x[0] === byTag.transform: return [x[0], f(x[1])]
        case x[0] === byTag.lazy: return [x[0], () => f(x[1]())]
        case x[0] === byTag.promise: {
          return PromiseSchemaIsUnsupported('Functor')
        }
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
        case x[0] === byTag.int: return x
        case x[0] === byTag.bigint: return x
        case x[0] === byTag.number: return x
        case x[0] === byTag.string: return x
        case x[0] === byTag.enum: return x
        case x[0] === byTag.literal: return x
        case x[0] === byTag.template_literal: return x
        case x[0] === byTag.array: return [x[0], f(x[1], false, x), x[2]]
        case x[0] === byTag.nonoptional: return [x[0], f(x[1], false, x)]
        case x[0] === byTag.nullable: return [x[0], f(x[1], false, x)]
        case x[0] === byTag.optional: return [x[0], f(x[1], isProperty, x)]
        case x[0] === byTag.readonly: return [x[0], f(x[1], false, x)]
        case x[0] === byTag.set: return [x[0], f(x[1], false, x)]
        case x[0] === byTag.success: return [x[0], f(x[1], false, x)]
        case x[0] === byTag.catch: return [x[0], f(x[1], false, x)]
        case x[0] === byTag.default: return [x[0], f(x[1], false, x)]
        case x[0] === byTag.prefault: return [x[0], f(x[1], false, x)]
        case x[0] === byTag.intersection: return [x[0], [f(x[1][0], false, x), f(x[1][1], false, x)]]
        case x[0] === byTag.map: return [x[0], [f(x[1][0], false, x), f(x[1][1], false, x)]]
        case x[0] === byTag.record: return [x[0], f(x[1], false, x)]
        case x[0] === byTag.tuple: return [x[0], x[1].map((_) => f(_, false, x))]
        case x[0] === byTag.union: return [x[0], x[1].map((_) => f(_, false, x))]
        case x[0] === byTag.pipe: return [x[0], [f(x[1][0], false, x), f(x[1][1], false, x)]]
        case x[0] === byTag.custom: return [x[0], f(x[1], false, x)]
        case x[0] === byTag.transform: return [x[0], f(x[1], false, x)]
        case x[0] === byTag.lazy: return [x[0], () => f(x[1](), false, x)]
        case x[0] === byTag.object: return [x[0], x[1].map(([k, v]) => [k, f(v, true, x)] satisfies [any, any])]
        case x[0] === byTag.promise: return PromiseSchemaIsUnsupported('Functor')
      }
    }
  }
}

export const fold
  : <T>(g: (src: Seed.F<T>, ix: boolean, x: Seed.Fixpoint) => T) => (src: Seed.F<T>, isProperty?: boolean) => T
  = (g) => (src, isProperty = false) => fn.catamorphism(Functor, false)(g)(src, isProperty)

