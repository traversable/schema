import * as gql from 'graphql'
import type * as T from '@traversable/registry'
import { fn, Object_keys } from '@traversable/registry'
import type { AnyTag } from '@traversable/graphql-types'

import * as Bounds from './generator-bounds.js'

export function invert<T extends Record<keyof any, keyof any>>(x: T): { [K in keyof T as T[K]]: K }
export function invert(x: Record<keyof any, keyof any>) {
  return Object_keys(x).reduce((acc, k) => (acc[x[k]] = k, acc), {} as typeof x)
}

export type Tag = byTag[keyof byTag]
export type byTag = typeof byTag
export const byTag = {
  // any: 10,
  Boolean: 15,
  // date: 20,
  // file: 25,
  // blob: 27,
  // nan: 30,
  // never: 35,
  NullValue: 40,
  // symbol: 45,
  // undefined: 50,
  // unknown: 55,
  // void: 60,
  // function: 70,
  // instance: 80,
  // bigint: 150,
  Number: 200,
  String: 250,
  EnumValue: 500,
  EnumValueDefinition: 550,
  ListType: 1000,
  // non_optional: 1500,
  // nullable: 2000,
  NonNullType: 2100,
  // nullish: 2200,
  // non_nullish: 2300,
  // optional: 2500,
  // exact_optional: 2600,
  // undefinedable: 2700,
  // set: 3500,
  // intersect: 6000,
  // map: 6500,
  // record: 7000,
  // object: 7500,
  // loose_object: 7600,
  // strict_object: 7700,
  // object_with_rest: 7800,
  // tuple: 8000,
  // loose_tuple: 8100,
  // strict_tuple: 8200,
  // tuple_with_rest: 8300,
  // union: 8500,
  // variant: 8600,
  // custom: 9500,
  // lazy: 10_500,
  // picklist: 11_000,
  // /** @deprecated */
  // promise: -1000,
} as const // satisfies Record<AnyTag, number>

/**
 * @example
 * {
 *   Document: 'Document',
 *   EnumTypeDefinition: 'EnumTypeDefinition',
 *   EnumValueDefinition: 'EnumValueDefinition',
 *   FieldDefinition: 'FieldDefinition',
 *   InputObjectTypeDefinition: 'InputObjectTypeDefinition',
 *   InputValueDefinition: 'InputValueDefinition',
 *   InterfaceTypeDefinition: 'InterfaceTypeDefinition',
 *   ListType: 'ListType',
 *   Name: 'Name',
 *   NamedType: 'NamedType',
 *   NonNullType: 'NonNullType',
 *   ObjectTypeDefinition: 'ObjectTypeDefinition',
 *   OperationDefinition: 'OperationDefinition',
 *   ScalarTypeDefinition: 'ScalarTypeDefinition',
 *   SelectionSet: 'SelectionSet',
 *   UnionTypeDefinition: 'UnionTypeDefinition',
 *   Variable: 'Variable',
 *   VariableDefinition: 'VariableDefinition',
 *   //
 *   FragmentSpread: 'FragmentSpread',
 *   InlineFragment: 'InlineFragment',
 *   FragmentDefinition: 'FragmentDefinition',
 *   //
 *   Argument: 'Argument',
 *   Directive: 'Directive',
 *   DirectiveDefinition: 'DirectiveDefinition',
 *   EnumValue: 'EnumValue',
 *   Field: 'Field',
 *   FloatValue: 'FloatValue',
 *   StringValue: 'StringValue',
 *   BooleanValue: 'BooleanValue',
 *   IntValue: 'IntValue',
 *   ListValue: 'ListValue',
 *   NullValue: 'NullValue',
 *   ObjectValue: 'ObjectValue',
 *   ObjectField: 'ObjectField',
 *   SchemaDefinition: 'SchemaDefinition',
 *   SchemaExtension: 'SchemaExtension',
 *   OperationTypeDefinition: 'OperationTypeDefinition',
 * }
 */

export type bySeed = typeof bySeed
export const bySeed = invert(byTag)

// export type Seed<T = unknown> =
//   & Seed.TerminalMap
//   & Seed.BoundableMap
//   & Seed.ValueMap
//   & Seed.UnaryMap<T>

// export declare namespace Seed {
//   type Fixpoint = [
//     tag: Tag, children?:
//     unknown,
//     bounds?: unknown
//   ]
//   type F<T> =
//     | Seed.Nullary
//     | Seed.Unary<T>
//   type Nullary =
//     | Seed.Terminal
//     | Seed.Boundable
//     | Seed.Value
//   type Unary<T> =
//     | Seed.Array<T>
//     | Seed.Record<T>
//     | Seed.Object<T>
//     | Seed.LooseObject<T>
//     | Seed.StrictObject<T>
//     | Seed.ObjectWithRest<T>
//     | Seed.Tuple<T>
//     | Seed.TupleWithRest<T>
//     | Seed.LooseTuple<T>
//     | Seed.StrictTuple<T>
//     | Seed.Union<T>
//     | Seed.Variant<T>
//     | Seed.Optional<T>
//     | Seed.NonOptional<T>
//     | Seed.Undefinedable<T>
//     | Seed.Nullable<T>
//     | Seed.NonNullable<T>
//     | Seed.Nullish<T>
//     | Seed.NonNullish<T>
//     | Seed.Set<T>
//     | Seed.Map<T>
//     | Seed.Custom<T>
//     | Seed.Lazy<T>
//     | Seed.Intersect<T>
//     | Seed.Promise<T>

//   interface Free extends T.HKT { [-1]: Seed.F<this[0]> }
//   ////////////////
//   /// nullary
//   type Any = [any: byTag['any']]
//   type Boolean = [boolean: byTag['boolean']]
//   type Date = [date: byTag['date']]
//   type File = [file: byTag['file']]
//   type Blob = [blob: byTag['blob']]
//   type NaN = [NaN: byTag['nan']]
//   type Never = [never: byTag['never']]
//   type Null = [null: byTag['null']]
//   type Symbol = [symbol: byTag['symbol']]
//   type Undefined = [undefined: byTag['undefined']]
//   type Unknown = [unknown: byTag['unknown']]
//   type Void = [void: byTag['void']]
//   type Terminal = TerminalMap[keyof TerminalMap]
//   type TerminalMap = {
//     any: Any
//     boolean: Boolean
//     date: Date
//     file: File
//     blob: Blob
//     nan: NaN
//     never: Never
//     null: Null
//     symbol: Symbol
//     undefined: Undefined
//     unknown: Unknown
//     void: Void
//   }
//   ////////////////
//   /// boundable
//   type BigInt = [bigint: byTag['bigint'], bounds?: Bounds.bigint]
//   type Number = [number: byTag['number'], bounds?: Bounds.number]
//   type String = [string: byTag['string'], bounds?: Bounds.string]
//   type Boundable = BoundableMap[keyof BoundableMap]
//   type BoundableMap = {
//     bigint: BigInt
//     number: Number
//     string: String
//   }
//   ////////////////
//   /// value
//   type Enum = [enum_: byTag['enum'], value: { [x: string]: number | string }]
//   type Literal = [literal: byTag['literal'], value: boolean | number | string]
//   namespace TemplateLiteral {
//     type Node = T.Showable | Seed.Boolean | Seed.Null | Seed.Undefined | Seed.Number | Seed.BigInt | Seed.String | Seed.Literal
//   }
//   type Value = ValueMap[keyof ValueMap]
//   type ValueMap = {
//     enum: Enum
//     literal: Literal
//   }
//   ////////////////
//   /// unary
//   type Array<T = unknown> = [array: byTag['array'], item: T, bounds?: Bounds.array]
//   type Optional<T = unknown> = [optional: byTag['optional'], wrapped: T]
//   type NonOptional<T = unknown> = [nonOptional: byTag['non_optional'], wrapped: T]
//   type Undefinedable<T = unknown> = [undefinedable: byTag['undefinedable'], wrapped: T]
//   type Nullish<T = unknown> = [nullish: byTag['nullish'], wrapped: T]
//   type NonNullish<T = unknown> = [nonNullish: byTag['non_nullish'], wrapped: T]
//   type Nullable<T = unknown> = [nullable: byTag['nullable'], wrapped: T]
//   type NonNullable<T = unknown> = [nonNullable: byTag['non_nullable'], wrapped: T]
//   type Set<T = unknown> = [set: byTag['set'], value: T]

//   type UnaryMap<T = unknown> = {
//     array: Seed.Array<T>
//     record: Seed.Record<T>
//     object: Seed.Object<T>
//     strict_object: Seed.StrictObject<T>
//     loose_object: Seed.LooseObject<T>
//     object_with_rest: Seed.ObjectWithRest<T>
//     tuple: Seed.Tuple<T>
//     loose_tuple: Seed.LooseTuple<T>
//     strict_tuple: Seed.StrictTuple<T>
//     tuple_with_rest: Seed.TupleWithRest<T>
//     union: Seed.Union<T>
//     variant: Seed.Variant<T>
//     optional: Seed.Optional<T>
//     non_optional: Seed.NonOptional<T>
//     undefinedable: Seed.Undefinedable<T>
//     nullable: Seed.Nullable<T>
//     non_nullable: Seed.NonNullable<T>
//     nullish: Seed.Nullish<T>
//     non_nullish: Seed.NonNullish<T>
//     set: Seed.Set<T>
//     map: Seed.Map<T>
//     custom: Seed.Custom<T>
//     lazy: Seed.Lazy<T>
//     intersect: Seed.Intersect<T>
//     promise: Seed.Promise<T>
//   }
//   type Composite =
//     | Seed.Array
//     | Seed.Record
//     | Seed.Tuple
//     | Seed.TupleWithRest
//     | Seed.LooseTuple
//     | Seed.StrictTuple
//     | Seed.Object
//     | Seed.ObjectWithRest
//     | Seed.LooseObject
//     | Seed.StrictObject
//   type fromComposite = {
//     [byTag.array]: unknown[]
//     [byTag.tuple]: unknown[]
//     [byTag.loose_tuple]: unknown[]
//     [byTag.strict_tuple]: unknown[]
//     [byTag.tuple_with_rest]: unknown[]
//     [byTag.record]: globalThis.Record<string, unknown>
//     [byTag.object]: { [x: string]: unknown }
//     [byTag.loose_object]: { [x: string]: unknown }
//     [byTag.strict_object]: { [x: string]: unknown }
//     [byTag.object_with_rest]: { [x: string]: unknown }
//   }
//   type schemaFromComposite = {
//     [byTag.array]: v.ArraySchema<any, any>
//     [byTag.tuple]: v.TupleSchema<any, any>
//     [byTag.loose_tuple]: v.LooseTupleSchema<any, any>
//     [byTag.strict_tuple]: v.StrictTupleSchema<any, any>
//     [byTag.tuple_with_rest]: v.TupleWithRestSchema<any, any, any>
//     [byTag.record]: v.RecordSchema<any, any, any>
//     [byTag.object]: v.ObjectSchema<any, any>
//     [byTag.loose_object]: v.LooseObjectSchema<any, any>
//     [byTag.strict_object]: v.StrictObjectSchema<any, any>
//     [byTag.object_with_rest]: v.ObjectWithRestSchema<any, any, any>
//   }
//   ////////////////
//   /// applicative
//   type Object<T = unknown> = [object: byTag['object'], entries: [k: string, v: T][]]
//   type LooseObject<T = unknown> = [looseObject: byTag['loose_object'], entries: [k: string, v: T][]]
//   type StrictObject<T = unknown> = [strictObject: byTag['strict_object'], entries: [k: string, v: T][]]
//   type ObjectWithRest<T = unknown> = [objectWithRest: byTag['object_with_rest'], entries: [k: string, v: T][], rest: T]
//   type Union<T = unknown> = [union: byTag['union'], options: T[]]
//   type Variant<T = unknown> = [variant: byTag['variant'], [tag: string, options: [k: string, v: T][]][], discriminator: string]
//   type Tuple<T = unknown> = [tuple: byTag['tuple'], items: T[]]
//   type LooseTuple<T = unknown> = [looseTuple: byTag['loose_tuple'], items: T[]]
//   type StrictTuple<T = unknown> = [strictTuple: byTag['strict_tuple'], items: T[]]
//   type TupleWithRest<T = unknown> = [tupleWithRest: byTag['tuple_with_rest'], items: T[], rest: T]
//   ////////////////
//   /// binary
//   type Map<T = unknown> = [seed: byTag['map'], def: [key: T, value: T]]
//   type Record<T = unknown> = [seed: byTag['record'], value: T]
//   type Intersect<T = unknown> = [seed: byTag['intersect'], def: [left: T, right: T]]
//   ////////////////
//   /// special
//   type Custom<T = unknown> = [seed: byTag['custom'], def: T]
//   type Lazy<T = unknown> = [seed: byTag['lazy'], getter: () => T]
//   ////////////////
//   /// deprecated
//   /** @deprecated */
//   type Promise<T = unknown> = [seed: byTag['promise'], wrapped: T]
// }

// export const Functor: T.Functor.Ix<boolean, Seed.Free, Seed.F<any>> = {
//   map(f) {
//     return (x) => {
//       switch (true) {
//         default: return x
//         case x[0] === byTag.any: return x
//         case x[0] === byTag.boolean: return x
//         case x[0] === byTag.date: return x
//         case x[0] === byTag.file: return x
//         case x[0] === byTag.nan: return x
//         case x[0] === byTag.never: return x
//         case x[0] === byTag.null: return x
//         case x[0] === byTag.symbol: return x
//         case x[0] === byTag.undefined: return x
//         case x[0] === byTag.unknown: return x
//         case x[0] === byTag.void: return x
//         case x[0] === byTag.bigint: return x
//         case x[0] === byTag.number: return x
//         case x[0] === byTag.string: return x
//         case x[0] === byTag.enum: return x
//         case x[0] === byTag.literal: return x
//         case x[0] === byTag.array: return [x[0], f(x[1]), x[2]]
//         case x[0] === byTag.optional: return [x[0], f(x[1])]
//         case x[0] === byTag.non_optional: return [x[0], f(x[1])]
//         case x[0] === byTag.undefinedable: return [x[0], f(x[1])]
//         case x[0] === byTag.nullable: return [x[0], f(x[1])]
//         case x[0] === byTag.non_nullable: return [x[0], f(x[1])]
//         case x[0] === byTag.nullish: return [x[0], f(x[1])]
//         case x[0] === byTag.non_nullish: return [x[0], f(x[1])]
//         case x[0] === byTag.set: return [x[0], f(x[1])]
//         case x[0] === byTag.intersect: return [x[0], [f(x[1][0]), f(x[1][1])]]
//         case x[0] === byTag.map: return [x[0], [f(x[1][0]), f(x[1][1])]]
//         case x[0] === byTag.record: return [x[0], f(x[1])]
//         case x[0] === byTag.object: return [x[0], x[1].map(([k, v]) => [k, f(v)] satisfies [any, any])]
//         case x[0] === byTag.loose_object: return [x[0], x[1].map(([k, v]) => [k, f(v)] satisfies [any, any])]
//         case x[0] === byTag.strict_object: return [x[0], x[1].map(([k, v]) => [k, f(v)] satisfies [any, any])]
//         case x[0] === byTag.object_with_rest: return [x[0], x[1].map(([k, v]) => [k, f(v)] satisfies [any, any]), f(x[2])]
//         case x[0] === byTag.tuple: return [x[0], x[1].map(f)]
//         case x[0] === byTag.loose_tuple: return [x[0], x[1].map(f)]
//         case x[0] === byTag.strict_tuple: return [x[0], x[1].map(f)]
//         case x[0] === byTag.tuple_with_rest: return [x[0], x[1].map(f), f(x[2])]
//         case x[0] === byTag.union: return [x[0], x[1].map(f)]
//         case x[0] === byTag.custom: return [x[0], f(x[1])]
//         case x[0] === byTag.lazy: return [x[0], () => f(x[1]())]
//         case x[0] === byTag.variant: return [x[0], x[1].map(([tag, ys]) => [tag, ys.map(([k, v]) => [k, f(v)] satisfies [any, any])] satisfies [any, any]), x[2]]
//         case x[0] === byTag.promise: return PromiseSchemaIsUnsupported('Functor')
//       }
//     }
//   },
//   mapWithIndex(f) {
//     return (x, isProperty) => {
//       switch (true) {
//         default: return x
//         case x[0] === byTag.any: return x
//         case x[0] === byTag.boolean: return x
//         case x[0] === byTag.date: return x
//         case x[0] === byTag.file: return x
//         case x[0] === byTag.nan: return x
//         case x[0] === byTag.never: return x
//         case x[0] === byTag.null: return x
//         case x[0] === byTag.symbol: return x
//         case x[0] === byTag.undefined: return x
//         case x[0] === byTag.unknown: return x
//         case x[0] === byTag.void: return x
//         case x[0] === byTag.bigint: return x
//         case x[0] === byTag.number: return x
//         case x[0] === byTag.string: return x
//         case x[0] === byTag.enum: return x
//         case x[0] === byTag.literal: return x
//         case x[0] === byTag.array: return [x[0], f(x[1], false, x), x[2]]
//         case x[0] === byTag.optional: return [x[0], f(x[1], isProperty, x)]
//         case x[0] === byTag.non_optional: return [x[0], f(x[1], false, x)]
//         case x[0] === byTag.undefinedable: return [x[0], f(x[1], false, x)]
//         case x[0] === byTag.nullable: return [x[0], f(x[1], false, x)]
//         case x[0] === byTag.non_nullable: return [x[0], f(x[1], false, x)]
//         case x[0] === byTag.nullish: return [x[0], f(x[1], false, x)]
//         case x[0] === byTag.non_nullish: return [x[0], f(x[1], false, x)]
//         case x[0] === byTag.set: return [x[0], f(x[1], false, x)]
//         case x[0] === byTag.intersect: return [x[0], [f(x[1][0], false, x), f(x[1][1], false, x)]]
//         case x[0] === byTag.map: return [x[0], [f(x[1][0], false, x), f(x[1][1], false, x)]]
//         case x[0] === byTag.record: return [x[0], f(x[1], false, x)]
//         case x[0] === byTag.tuple: return [x[0], x[1].map((_) => f(_, false, x))]
//         case x[0] === byTag.loose_tuple: return [x[0], x[1].map((_) => f(_, false, x))]
//         case x[0] === byTag.strict_tuple: return [x[0], x[1].map((_) => f(_, false, x))]
//         case x[0] === byTag.tuple_with_rest: return [x[0], x[1].map((_) => f(_, false, x)), f(x[2], false, x)]
//         case x[0] === byTag.union: return [x[0], x[1].map((_) => f(_, false, x))]
//         case x[0] === byTag.custom: return [x[0], f(x[1], false, x)]
//         case x[0] === byTag.lazy: return [x[0], () => f(x[1](), false, x)]
//         case x[0] === byTag.object: return [x[0], x[1].map(([k, v]) => [k, f(v, true, x)] satisfies [any, any])]
//         case x[0] === byTag.loose_object: return [x[0], x[1].map(([k, v]) => [k, f(v, true, x)] satisfies [any, any])]
//         case x[0] === byTag.strict_object: return [x[0], x[1].map(([k, v]) => [k, f(v, true, x)] satisfies [any, any])]
//         case x[0] === byTag.object_with_rest: return [x[0], x[1].map(([k, v]) => [k, f(v, true, x)] satisfies [any, any]), f(x[2], true, x)]
//         case x[0] === byTag.variant: return [x[0], x[1].map(([tag, ys]) => [tag, ys.map(([k, v]) => [k, f(v, false, x)] satisfies [any, any])] satisfies [any, any]), x[2]]
//         case x[0] === byTag.promise: return PromiseSchemaIsUnsupported('Functor')
//       }
//     }
//   }
// }

// export const fold = fn.catamorphism(Functor, false)
