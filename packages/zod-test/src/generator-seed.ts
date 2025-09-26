import { z } from 'zod'
import type * as T from '@traversable/registry'
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
  type Any = [any: byTag['any']]
  type Boolean = [boolean: byTag['boolean']]
  type Date = [date: byTag['date']]
  type File = [file: byTag['file']]
  type NaN = [NaN: byTag['nan']]
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
  type Integer = [int: byTag['int'], bounds?: Bounds.int]
  type BigInt = [bigint: byTag['bigint'], bounds?: Bounds.bigint]
  type Number = [number: byTag['number'], bounds?: Bounds.number]
  type String = [string: byTag['string'], bounds?: Bounds.string]
  type Boundable = BoundableMap[keyof BoundableMap]
  type BoundableMap = {
    int: Integer
    bigint: BigInt
    number: Number
    string: String
  }
  ////////////////
  /// value
  type Enum = [enum_: byTag['enum'], value: { [x: string]: number | string }]
  type Literal = [literal: byTag['literal'], value: z.core.util.Literal]
  type TemplateLiteral = [templateLiteral: byTag['template_literal'], value: TemplateLiteral.Node[]]
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
  type Array<T = unknown> = [array: byTag['array'], element: T, bounds?: Bounds.array]
  type NonOptional<T = unknown> = [nonOptional: byTag['nonoptional'], innerType: T]
  type Optional<T = unknown> = [optional: byTag['optional'], innerType: T]
  type Nullable<T = unknown> = [nullable: byTag['nullable'], innerType: T]
  type Readonly<T = unknown> = [readonly: byTag['readonly'], innerType: T]
  type Set<T = unknown> = [set: byTag['set'], valueType: T]
  type Success<T = unknown> = [success: byTag['success'], innerType: T]
  type Catch<T = unknown> = [catch_: byTag['catch'], innerType: T]
  type Default<T = unknown> = [default_: byTag['default'], innerType: T]
  type Prefault<T = unknown> = [prefault: byTag['prefault'], innerType: T]
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
  /// composite
  type Object<T = unknown> = [object: byTag['object'], shape: [K: string, V: T][]]
  type Union<T = unknown> = [union: byTag['union'], members: T[]]
  type Tuple<T = unknown> = [tuple: byTag['tuple'], items: T[]]
  ////////////////
  /// binary
  type Map<T = unknown> = [map: byTag['map'], def: [keyType: T, valueType: T]]
  type Record<T = unknown> = [record: byTag['record'], valueType: T]
  type Intersection<T = unknown> = [intersection: byTag['intersection'], def: [left: T, right: T]]
  ////////////////
  /// special
  type Pipe<T = unknown> = [pipe: byTag['pipe'], def: [in_: T, out: T]]
  type Custom<T = unknown> = [custom: byTag['custom'], def: T]
  type Transform<T = unknown> = [transform: byTag['transform'], def: T]
  type Lazy<T = unknown> = [lazy: byTag['lazy'], getter: () => T]
  ////////////////
  /// deprecated
  /** @deprecated */
  type Promise<T = unknown> = [promise: byTag['promise'], innerType: T]
}

export const Functor: T.Functor.Ix<boolean, Seed.Free, Seed.F<any>> = {
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

export const fold = fn.catamorphism(Functor, false)
