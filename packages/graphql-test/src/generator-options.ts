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
  type DirectiveDefinition = fc.UniqueArrayConstraints<any, any>
  type Document = fc.UniqueArrayConstraints<any, any>
  type EnumTypeDefinition = fc.UniqueArrayConstraints<any, any>
  type InputValueDefinition = fc.UniqueArrayConstraints<any, any>
  type FloatValue = fc.DoubleConstraints
  type FieldDefinition = fc.UniqueArrayConstraints<any, any>
  type ListValue = fc.ArrayConstraints
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
  DirectiveDefinition?: Constraints.DirectiveDefinition
  Document?: Constraints.Document
  EnumTypeDefinition?: Constraints.EnumTypeDefinition
  EnumValue?: {}
  EnumValueDefinition?: {}
  Field?: {}
  FieldDefinition?: Constraints.FieldDefinition
  Float?: {}
  FloatValue?: Constraints.FloatValue
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
  ListValue?: Constraints.ListValue
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
    maxLength: 3,
    selector: ([, name]) => name,
    size: 'xsmall',
  },
  Boolean: {},
  BooleanValue: {},
  Directive: {
    minLength: 0,
    maxLength: 2,
    selector: ([, name]) => name,
    size: 'xsmall',
  },
  DirectiveDefinition: {
    minLength: 1,
    maxLength: 3,
  },
  Document: {
    minLength: 1,
    maxLength: 5,
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
    maxLength: 5,
    selector: ([, name]) => name,
    size: 'xsmall',
  },
  Float: {},
  FloatValue: {
    noNaN: true,
    noDefaultInfinity: true,
  },
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
  IntValue: {
  },
  ListType: {},
  ListValue: {
    minLength: 0,
    maxLength: 5,
    size: 'xsmall',
  },
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
    selector: ([key]) => key,
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
