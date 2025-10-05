import type * as fc from 'fast-check'
import {
  Object_assign,
  Object_create,
  Object_keys,
} from '@traversable/registry'

import type { Seed } from './generator-seed.js'
import { byTag } from './generator-seed.js'

export interface Options<T = never> extends Partial<OptionsBase<T>>, Constraints {}

export interface Config<T = never> extends OptionsBase<T>, Constraints {}

export declare namespace Config {
  export {
    Options,
    Constraints,
  }
}

export type InferConfigType<S> = S extends Options<infer T> ? T : never

export interface OptionsBase<
  T = never,
  K extends
  | string & keyof T
  = string & keyof T
> {
  include: readonly K[]
  exclude: readonly K[]
  root: '*' | K
  sortBias: { [K in keyof Seed]+?: number }
  forceInvalid: boolean
  noDescriptions: boolean
}

export declare namespace Constraints {
  type Argument = fc.UniqueArrayConstraints<any, any>
  type Directive = fc.UniqueArrayConstraints<any, any>
  type Document = fc.UniqueArrayConstraints<any, any>
  type EnumTypeDefinition = fc.UniqueArrayConstraints<any, any>
  type InputValueDefinition = fc.UniqueArrayConstraints<any, any>
  type FieldDefinition = fc.UniqueArrayConstraints<any, any>
  type NamedType = fc.UniqueArrayConstraints<any, any>
  type ObjectValue = fc.UniqueArrayConstraints<any, any>
  type SchemaDefinition = fc.UniqueArrayConstraints<any, any>
  type SelectionSet = fc.UniqueArrayConstraints<any, any>
  type VariableDefinition = fc.UniqueArrayConstraints<any, any>
}

export type Constraints = {
  Argument?: Constraints.Argument
  Boolean?: {}
  BooleanValue?: {}
  Directive?: Constraints.Directive
  DirectiveDefinition?: {}
  Document?: Constraints.Document
  EnumTypeDefinition?: Constraints.EnumTypeDefinition
  EnumValue?: {}
  EnumValueDefinition?: {}
  Field?: {}
  FieldDefinition?: Constraints.FieldDefinition
  Float?: {}
  FloatValue?: {}
  FragmentDefinition?: {}
  FragmentSpread?: {}
  ID?: {}
  InlineFragment?: {}
  InputObjectTypeDefinition?: {}
  InputValueDefinition?: Constraints.InputValueDefinition
  Int?: {}
  InterfaceTypeDefinition?: {}
  IntValue?: {}
  ListType?: {}
  ListValue?: {}
  Name?: {}
  NamedType?: Constraints.NamedType
  NonNullType?: {}
  Null?: {}
  NullValue?: {}
  Number?: {}
  ObjectField?: {}
  ObjectTypeDefinition?: {}
  ObjectValue?: Constraints.ObjectValue
  OperationDefinition?: {}
  OperationTypeDefinition?: {}
  ScalarTypeDefinition?: {}
  SchemaDefinition?: Constraints.SchemaDefinition
  SelectionSet?: Constraints.SelectionSet
  String?: {}
  StringValue?: {}
  UnionTypeDefinition?: {}
  Variable?: {}
  VariableDefinition?: Constraints.VariableDefinition
}

export const defaultConstraints = {
  Argument: {
    minLength: 0,
    maxLength: 2,
    selector: ([, name]) => name,
    size: 'xsmall',
  },
  Boolean: {},
  BooleanValue: {},
  Directive: {
    minLength: 0,
    maxLength: 1,
    selector: ([, name]) => name,
    size: 'xsmall',
  },
  DirectiveDefinition: {},
  Document: {
    minLength: 1,
    maxLength: 1,
    selector: ([, name]) => name,
    size: 'xsmall',
  },
  EnumTypeDefinition: {
    minLength: 1,
    maxLength: 3,
  },
  EnumValue: {},
  EnumValueDefinition: {},
  Field: {},
  FieldDefinition: {
    minLength: 1,
    maxLength: 3,
    selector: ([, name]) => name,
    size: 'xsmall',
  },
  Float: {},
  FloatValue: {},
  FragmentDefinition: {},
  FragmentSpread: {},
  ID: {},
  InlineFragment: {},
  InputObjectTypeDefinition: {},
  InputValueDefinition: {
    minLength: 1,
    maxLength: 3,
    selector: ([, name]) => name,
    size: 'xsmall',
  },
  Int: {},
  InterfaceTypeDefinition: {},
  IntValue: {},
  ListType: {},
  ListValue: {},
  Name: {},
  NamedType: {
    minLength: 1,
    maxLength: 3,
    selector: ([, name]) => name,
    size: 'xsmall',
  },
  NonNullType: {},
  Null: {},
  NullValue: {},
  Number: {},
  ObjectField: {},
  ObjectTypeDefinition: {},
  ObjectValue: {
    minLength: 1,
    maxLength: 3,
    selector: ([, name]) => name,
    size: 'xsmall',
  },
  OperationDefinition: {
  },
  OperationTypeDefinition: {},
  ScalarTypeDefinition: {},
  SchemaDefinition: {
    minLength: 1,
    maxLength: 3,
    selector: ([, , operationType]) => operationType,
    size: 'xsmall',
  },
  SelectionSet: {
    minLength: 0,
    maxLength: 3,
    selector: ([, name]) => name,
    size: 'xsmall',
  },
  String: {},
  StringValue: {},
  UnionTypeDefinition: {},
  Variable: {},
  VariableDefinition: {
    minLength: 0,
    maxLength: 2,
    selector: ([, name]) => name,
    size: 'xsmall',
  },
} satisfies Required<Constraints>

export const defaultOptions: OptionsBase<Constraints> = {
  include: Object_keys(defaultConstraints),
  exclude: [],
  root: '*',
  sortBias: byTag,
  forceInvalid: false,
  noDescriptions: false,
}

export const defaults = Object_assign(
  Object_create(null),
  defaultConstraints,
  defaultOptions,
) satisfies Config<Constraints>

export function parseOptions<Opts extends Options>(options?: Opts): Config<InferConfigType<Opts>>
export function parseOptions(options: Options<Seed> = defaults): Config<Seed> {
  const {
    // options:
    exclude = defaults.exclude,
    forceInvalid = defaults.forceInvalid,
    include = defaults.include,
    root = defaults.root,
    sortBias = defaults.sortBias,
    noDescriptions = defaults.noDescriptions,
    // constraints:
    Argument = defaults.Argument,
    Boolean = defaults.Boolean,
    BooleanValue = defaults.BooleanValue,
    Directive = defaults.Directive,
    DirectiveDefinition = defaults.DirectiveDefinition,
    Document = defaults.Document,
    EnumTypeDefinition = defaults.EnumTypeDefinition,
    EnumValue = defaults.EnumValue,
    EnumValueDefinition = defaults.EnumValueDefinition,
    Field = defaults.Field,
    FieldDefinition = defaults.FieldDefinition,
    Float = defaults.Float,
    FloatValue = defaults.FloatValue,
    FragmentDefinition = defaults.FragmentDefinition,
    FragmentSpread = defaults.FragmentSpread,
    ID = defaults.ID,
    InlineFragment = defaults.InlineFragment,
    InputObjectTypeDefinition = defaults.InputObjectTypeDefinition,
    InputValueDefinition = defaults.InputValueDefinition,
    Int = defaults.Int,
    IntValue = defaults.IntValue,
    InterfaceTypeDefinition = defaults.InterfaceTypeDefinition,
    ListType = defaults.ListType,
    ListValue = defaults.ListValue,
    Name = defaults.Name,
    NamedType = defaults.NamedType,
    NonNullType = defaults.NonNullType,
    Null = defaults.Null,
    NullValue = defaults.NullValue,
    Number = defaults.Number,
    ObjectField = defaults.ObjectField,
    ObjectTypeDefinition = defaults.ObjectTypeDefinition,
    ObjectValue = defaults.ObjectValue,
    OperationDefinition = defaults.OperationDefinition,
    OperationTypeDefinition = defaults.OperationTypeDefinition,
    ScalarTypeDefinition = defaults.ScalarTypeDefinition,
    SchemaDefinition = defaults.SchemaDefinition,
    SelectionSet = defaults.SelectionSet,
    String = defaults.String,
    StringValue = defaults.StringValue,
    UnionTypeDefinition = defaults.UnionTypeDefinition,
    Variable = defaults.Variable,
    VariableDefinition = defaults.VariableDefinition,
  } = options

  return {
    include: include.length === 0 || include[0] === ('*' as never)
      ? defaults.include
      : include,
    exclude,
    root,
    sortBias,
    forceInvalid,
    noDescriptions,
    // nodes:
    Argument,
    Boolean,
    BooleanValue,
    Directive,
    DirectiveDefinition,
    Document,
    EnumTypeDefinition,
    EnumValue,
    EnumValueDefinition,
    Field,
    FieldDefinition,
    Float,
    FloatValue,
    FragmentDefinition,
    FragmentSpread,
    ID,
    InlineFragment,
    InputObjectTypeDefinition,
    InputValueDefinition,
    Int,
    IntValue,
    InterfaceTypeDefinition,
    ListType,
    ListValue,
    Name,
    NamedType,
    NonNullType,
    Null,
    NullValue,
    Number,
    ObjectField,
    ObjectTypeDefinition,
    ObjectValue,
    OperationDefinition,
    OperationTypeDefinition,
    ScalarTypeDefinition,
    SchemaDefinition,
    SelectionSet,
    String,
    StringValue,
    UnionTypeDefinition,
    Variable,
    VariableDefinition,
  }
}

export function Config() {}
Config.defaults = defaults
Config.parseOptions = parseOptions

// export type ObjectConstraints =
//   & Omit<fc.UniqueArrayConstraintsRecommended<[k: string, v: unknown], string>, 'minLength' | 'maxLength'>
//   & {
//     minKeys?: number
//     maxKeys?: number
//     size?: fc.SizeForArbitrary
//   }

// const objectDefaults = {
//   minKeys: 1,
//   maxKeys: 3,
//   size: 'xsmall',
//   selector: ([k]) => k,
//   comparator: 'SameValueZero',
//   depthIdentifier: fc.createDepthIdentifier(),
// } satisfies ObjectConstraints

// export const defaultConstraints = {
//   object: objectDefaults,
//   loose_object: objectDefaults,
//   strict_object: objectDefaults,
//   object_with_rest: objectDefaults,
//   any: {},
//   array: {
//     minLength: 0,
//     maxLength: 0x10
//   },
//   bigint: {
//     unbounded: false,
//     min: undefined,
//     max: undefined,
//     multipleOf: null,
//   },
//   boolean: {},
//   custom: {},
//   date: {},
//   enum: {},
//   file: {},
//   blob: {},
//   intersect: {},
//   lazy: {},
//   literal: {},
//   map: {},
//   nan: {},
//   never: {},
//   null: {},
//   number: {
//     unbounded: false,
//     min: -0x10000,
//     max: 0x10000,
//     multipleOf: Number.NaN,
//     noNaN: true,
//     noDefaultInfinity: true,
//     minExcluded: false,
//     maxExcluded: false,
//     noInteger: false,
//   },
//   optional: {},
//   non_optional: {},
//   undefinedable: {},
//   nullish: {},
//   non_nullish: {},
//   nullable: {},
//   non_nullable: {},
//   record: {
//     depthIdentifier: fc.createDepthIdentifier(),
//     maxKeys: 3,
//     minKeys: 1,
//     noNullPrototype: false,
//     size: 'xsmall',
//   } satisfies fc.DictionaryConstraints,
//   set: {},
//   string: {
//     unbounded: false,
//     minLength: 0,
//     maxLength: 0x100,
//     size: 'xsmall',
//     unit: 'grapheme-ascii',
//   },
//   symbol: {},
//   tuple: {
//     minLength: 1,
//     maxLength: 3,
//     size: 'xsmall',
//     depthIdentifier: fc.createDepthIdentifier(),
//   } satisfies fc.ArrayConstraints,
//   tuple_with_rest: {
//     minLength: 1,
//     maxLength: 3,
//     size: 'xsmall',
//     depthIdentifier: fc.createDepthIdentifier(),
//   } satisfies fc.ArrayConstraints,
//   strict_tuple: {
//     minLength: 1,
//     maxLength: 3,
//     size: 'xsmall',
//     depthIdentifier: fc.createDepthIdentifier(),
//   } satisfies fc.ArrayConstraints,
//   loose_tuple: {
//     minLength: 1,
//     maxLength: 3,
//     size: 'xsmall',
//     depthIdentifier: fc.createDepthIdentifier(),
//   } satisfies fc.ArrayConstraints,
//   undefined: {},
//   union: {
//     depthIdentifier: fc.createDepthIdentifier(),
//     minLength: 1,
//     maxLength: 3,
//     size: 'xsmall',
//   } satisfies fc.ArrayConstraints,
//   variant: {
//     depthIdentifier: fc.createDepthIdentifier(),
//     minLength: 1,
//     maxLength: 3,
//     size: 'xsmall',
//   } satisfies fc.ArrayConstraints,
//   unknown: {},
//   void: {},
//   promise: {},
//   ['*']: {
//     maxDepth: 3,
//     depthIdentifier: fc.createDepthIdentifier(),
//     depthSize: 'xsmall',
//     withCrossShrink: true,
//   } satisfies fc.OneOfConstraints,
// } as const satisfies { [K in keyof Constraints]-?: Constraints[K] }

// export const unsupportedSchemas = ['promise'] satisfies (keyof SeedMap)[]

// export const defaults = {
//   exclude: unsupportedSchemas,
//   forceInvalid: false,
//   include: Tags,
//   root: '*',
//   sortBias: byTag,
// } as const satisfies OptionsBase<any>

// export function parseOptions<Opts extends Options>(options?: Opts): Config<InferConfigType<Opts>>
// export function parseOptions(options?: Options<any>): Config<any>
// export function parseOptions(options: Options<any> = defaults as never): Config {
//   const {
//     exclude = defaults.exclude,
//     forceInvalid = defaults.forceInvalid,
//     include = defaults.include,
//     root = defaults.root,
//     sortBias = defaults.sortBias,
//     ['*']: {
//       maxDepth: starMaxDepth = defaultConstraints['*'].maxDepth,
//       depthSize: starDepthSize = defaultConstraints['*'].depthSize,
//       ...STAR
//     } = defaultConstraints['*'],
//     any = defaultConstraints.any,
//     array: {
//       maxLength: arrayMax = defaultConstraints.array.maxLength,
//       minLength: arrayMin = defaultConstraints.array.minLength,
//       ...ARRAY
//     } = defaultConstraints.array,
//     bigint: {
//       unbounded: bigIntUnbounded,
//       max: bigIntMax,
//       min: bigIntMin,
//       ...BIGINT
//     } = defaultConstraints.bigint,
//     boolean = defaultConstraints.boolean,
//     custom = defaultConstraints.custom,
//     date = defaultConstraints.date,
//     enum: enum_ = defaultConstraints.enum,
//     file = defaultConstraints.file,
//     intersect = defaultConstraints.intersect,
//     lazy = defaultConstraints.lazy,
//     literal = defaultConstraints.literal,
//     map = defaultConstraints.map,
//     nan = defaultConstraints.nan,
//     never = defaultConstraints.never,
//     non_optional = defaultConstraints.non_optional,
//     non_nullable = defaultConstraints.non_nullable,
//     non_nullish = defaultConstraints.non_nullable,
//     undefinedable = defaultConstraints.undefinedable,
//     nullish = defaultConstraints.nullish,
//     null: null_ = defaultConstraints.null,
//     nullable = defaultConstraints.nullable,
//     number: {
//       unbounded: numberUnbounded,
//       max: numberMax,
//       maxExcluded: numberMaxExcluded,
//       min: numberMin,
//       minExcluded: numberMinExcluded,
//       // ...NUMBER
//     } = defaultConstraints.number,
//     optional = defaultConstraints.optional,
//     record: {
//       maxKeys: recordMaxKeys = defaultConstraints.record.maxKeys,
//       minKeys: recordMinKeys = defaultConstraints.record.minKeys,
//       size: recordSize = defaultConstraints.record.size,
//       ...RECORD
//     } = defaultConstraints.record,
//     set = defaultConstraints.set,
//     string: {
//       unbounded: stringUnbounded,
//       minLength: stringMinLength,
//       maxLength: stringMaxLength,
//       size: stringSize = defaultConstraints.string.size,
//       // ...STRING
//     } = defaultConstraints.string,
//     symbol = defaultConstraints.symbol,
//     undefined: undefined_ = defaultConstraints.undefined,
//     union: {
//       minLength: unionMinLength = defaultConstraints.union.minLength,
//       maxLength: unionMaxLength = defaultConstraints.union.maxLength,
//       size: unionSize = defaultConstraints.union.size,
//       ...UNION
//     } = defaultConstraints.union,
//     variant: {
//       minLength: variantMinLength = defaultConstraints.variant.minLength,
//       maxLength: variantMaxLength = defaultConstraints.variant.maxLength,
//       size: variantSize = defaultConstraints.variant.size,
//       ...VARIANT
//     } = defaultConstraints.variant,
//     unknown = defaultConstraints.unknown,
//     void: void_ = defaultConstraints.void,
//     promise = defaultConstraints.promise,
//     object: {
//       maxKeys: objectMaxKeys = defaultConstraints.object.maxKeys,
//       minKeys: objectMinKeys = defaultConstraints.object.minKeys,
//       size: objectSize = defaultConstraints.object.size,
//       ...OBJECT
//     } = defaultConstraints.object,
//     blob = defaultConstraints.blob,
//     strict_object: {
//       maxKeys: strictObjectMaxKeys = defaultConstraints.strict_object.maxKeys,
//       minKeys: strictObjectMinKeys = defaultConstraints.strict_object.minKeys,
//       size: strictObjectSize = defaultConstraints.strict_object.size,
//       ...STRICT_OBJECT
//     } = defaultConstraints.strict_object,
//     loose_object: {
//       maxKeys: looseObjectMaxKeys = defaultConstraints.loose_object.maxKeys,
//       minKeys: looseObjectMinKeys = defaultConstraints.loose_object.minKeys,
//       size: looseObjectSize = defaultConstraints.loose_object.size,
//       ...LOOSE_OBJECT
//     } = defaultConstraints.loose_object,
//     object_with_rest: {
//       maxKeys: objectWithRestMaxKeys = defaultConstraints.object_with_rest.maxKeys,
//       minKeys: objectWithRestMinKeys = defaultConstraints.object_with_rest.minKeys,
//       size: objectWithRestSize = defaultConstraints.object_with_rest.size,
//       ...OBJECT_WITH_REST
//     } = defaultConstraints.object_with_rest,
//     tuple: {
//       maxLength: tupleMaxLength = defaultConstraints.tuple.maxLength,
//       minLength: tupleMinLength = defaultConstraints.tuple.minLength,
//       ...TUPLE
//     } = defaultConstraints.tuple,
//     strict_tuple: {
//       maxLength: strictTupleMaxLength = defaultConstraints.strict_tuple.maxLength,
//       minLength: strictTupleMinLength = defaultConstraints.strict_tuple.minLength,
//       ...STRICT_TUPLE
//     } = defaultConstraints.strict_tuple,
//     loose_tuple: {
//       maxLength: looseTupleMaxLength = defaultConstraints.loose_tuple.maxLength,
//       minLength: looseTupleMinLength = defaultConstraints.loose_tuple.minLength,
//       ...LOOSE_TUPLE
//     } = defaultConstraints.loose_tuple,
//     tuple_with_rest: {
//       maxLength: tupleWithRestMaxLength = defaultConstraints.tuple_with_rest.maxLength,
//       minLength: tupleWithRestMinLength = defaultConstraints.tuple_with_rest.minLength,
//       ...TUPLE_WITH_REST
//     } = defaultConstraints.tuple_with_rest,
//   } = options
//   return {
//     exclude,
//     forceInvalid,
//     include: include.length === 0 || include[0] === '*' ? defaults.include : include,
//     root,
//     sortBias: { ...defaults.sortBias, ...sortBias },
//     ['*']: {
//       ...STAR,
//       depthSize: starDepthSize,
//       maxDepth: starMaxDepth,
//     },
//     object: {
//       ...OBJECT,
//       minLength: objectMinKeys,
//       maxLength: objectMaxKeys,
//       size: objectSize,
//     },
//     strict_object: {
//       ...STRICT_OBJECT,
//       maxKeys: strictObjectMaxKeys,
//       minKeys: strictObjectMinKeys,
//       size: strictObjectSize,
//     },
//     loose_object: {
//       ...LOOSE_OBJECT,
//       maxKeys: looseObjectMaxKeys,
//       minKeys: looseObjectMinKeys,
//       size: looseObjectSize,
//     },
//     object_with_rest: {
//       ...OBJECT_WITH_REST,
//       maxKeys: objectWithRestMaxKeys,
//       minKeys: objectWithRestMinKeys,
//       size: objectWithRestSize,
//     },
//     any,
//     array: {
//       ...ARRAY,
//       min: arrayMin,
//       max: arrayMax,
//     },
//     bigint: {
//       ...BIGINT,
//       unbounded: bigIntUnbounded,
//       max: bigIntMax,
//       min: bigIntMin,
//     },
//     boolean,
//     date,
//     enum: enum_,
//     file,
//     intersect,
//     lazy,
//     literal,
//     map,
//     nan,
//     never,
//     non_optional,
//     null: null_,
//     nullable,
//     number: {
//       unbounded: numberUnbounded,
//       max: numberMax,
//       min: numberMin,
//       maxExcluded: numberMaxExcluded,
//       minExcluded: numberMinExcluded,
//     },
//     optional,
//     record: {
//       ...RECORD,
//       maxKeys: recordMaxKeys,
//       minKeys: recordMinKeys,
//       size: recordSize,
//     },
//     set,
//     string: {
//       // ...STRING,
//       unbounded: stringUnbounded,
//       minLength: stringMinLength,
//       maxLength: stringMaxLength,
//       size: stringSize,
//     },
//     symbol,
//     tuple: {
//       ...TUPLE,
//       minLength: tupleMinLength,
//       maxLength: tupleMaxLength,
//     },
//     loose_tuple: {
//       ...LOOSE_TUPLE,
//       minLength: looseTupleMinLength,
//       maxLength: looseTupleMaxLength,
//     },
//     strict_tuple: {
//       ...STRICT_TUPLE,
//       minLength: strictTupleMinLength,
//       maxLength: strictTupleMaxLength,
//     },
//     tuple_with_rest: {
//       ...TUPLE_WITH_REST,
//       minLength: tupleWithRestMinLength,
//       maxLength: tupleWithRestMaxLength,
//     },
//     blob,
//     custom,
//     non_nullable,
//     nullish,
//     non_nullish,
//     undefinedable,
//     variant: {
//       ...VARIANT,
//       minLength: variantMinLength,
//       maxLength: variantMaxLength,
//       size: variantSize,
//     },
//     undefined: undefined_,
//     union: {
//       ...UNION,
//       minLength: unionMinLength,
//       maxLength: unionMaxLength,
//       size: unionSize,
//     },
//     unknown,
//     void: void_,
//     promise,
//   }
// }
