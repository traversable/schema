import * as fc from 'fast-check'

import type * as T from '@traversable/registry'
import { Object_keys, PATTERN } from '@traversable/registry'
import { Json } from '@traversable/json'
import type { OperationType } from '@traversable/graphql-types'
import { Kind, NamedType } from '@traversable/graphql-types'

export function invert<T extends Record<keyof any, keyof any>>(x: T): { [K in keyof T as T[K]]: K }
export function invert(x: Record<keyof any, keyof any>) {
  return Object_keys(x).reduce((acc, k) => (acc[x[k]] = k, acc), {} as typeof x)
}

export type Tag = byTag[keyof byTag]
export type byTag = typeof byTag
export const byTag = {
  Name: 10,
  NamedType: 20,
  /* scalars */
  Boolean: 30,
  Float: 40,
  ID: 50,
  Int: 60,
  Null: 70,
  Number: 80,
  ScalarTypeDefinition: 90,
  String: 100,
  /* values */
  BooleanValue: 110,
  EnumValue: 120,
  FloatValue: 130,
  IntValue: 140,
  ListValue: 150,
  NullValue: 160,
  ObjectValue: 170,
  StringValue: 180,
  /* type definitions */
  EnumTypeDefinition: 190,
  EnumValueDefinition: 200,
  Field: 210,
  FieldDefinition: 220,
  ObjectField: 230,
  ObjectTypeDefinition: 240,
  InterfaceTypeDefinition: 250,
  /* modifiers */
  ListType: 260,
  NonNullType: 270,
  UnionTypeDefinition: 280,
  /* args */
  Argument: 290,
  InputObjectTypeDefinition: 300,
  InputValueDefinition: 310,
  Variable: 320,
  VariableDefinition: 330,
  /* special */
  Directive: 340,
  DirectiveDefinition: 350,
  Document: 360,
  FragmentDefinition: 370,
  FragmentSpread: 380,
  InlineFragment: 390,
  OperationDefinition: 400,
  OperationTypeDefinition: 410,
  SelectionSet: 420,
  SchemaDefinition: 430,
  // SchemaExtension: 440,
} as const satisfies Record<'Name' | Kind | NamedType, number>

export type bySeed = typeof bySeed
export const bySeed = invert(byTag)

export type Seed<T = unknown> = (
  & Seed.TerminalMap
  & Seed.ValueMap
  & Seed.UnaryMap<T>
)

export declare namespace Seed {
  type Name = [
    Name: byTag['Name'],
    value: string,
  ]

  type NamedType = [
    NamedType: byTag['NamedType'],
    name: string,
  ]

  type Description = [description: string, block: boolean]

  ////////////////////////
  ///  Terminal nodes  ///
  type Boolean = [Boolean: byTag['Boolean']]
  type Float = [Float: byTag['Float']]
  type ID = [ID: byTag['ID']]
  type Int = [Int: byTag['Int']]
  type Null = [Null: byTag['Null']]
  type Number = [Number: byTag['Number']]
  type String = [String: byTag['String']]

  type ScalarTypeDefinition = [
    ScalarTypeDefinition: byTag['ScalarTypeDefinition'],
    name: string,
    description: Description,
  ]
  ///  Terminal nodes  ///
  ////////////////////////

  /////////////////////
  ///  Value nodes  ///
  type NullValue = [
    NullValue: byTag['NullValue']
  ]

  type BooleanValue = [
    BooleanValue: byTag['BooleanValue'],
    value: boolean,
  ]

  type EnumValue = [
    EnumValue: byTag['EnumValue'],
    value: string,
  ]

  type FloatValue = [
    FloatValue: byTag['FloatValue'],
    value: number,
  ]

  type IntValue = [
    IntValue: byTag['IntValue'],
    value: number,
  ]

  type StringValue = [
    StringValue: byTag['StringValue'],
    value: string,
    block: boolean,
  ]

  type EnumValueDefinition = [
    EnumValueDefinition: byTag['EnumValueDefinition'],
    value: string,
  ]

  type ListValue = [
    ListValue: byTag['ListValue'],
    value: readonly Json[],
  ]

  type ObjectValue = [
    ObjectValue: byTag['ObjectValue'],
    value: { [x: string]: Json },
  ]
  ///  Value nodes  ///
  /////////////////////

  type ListType<T = unknown> = [
    ListType: byTag['ListType'],
    type: T,
  ]

  type NonNullType<T = unknown> = [
    NonNullType: byTag['NonNullType'],
    type: T,
  ]

  type UnionTypeDefinition<T = unknown> = [
    UnionTypeDefinition: byTag['UnionTypeDefinition'],
    name: string,
    types: readonly T[],
    directives: readonly T[]
  ]

  type Variable<T = unknown> = [
    Variable: byTag['Variable'],
    name: string,
    description: Description,
    directives: readonly T[],
  ]

  type EnumTypeDefinition<T = unknown> = [
    EnumTypeDefinition: byTag['EnumTypeDefinition'],
    name: string,
    description: Description,
    values: readonly string[],
    directives: readonly T[],
  ]

  type Field<T = unknown> = [
    Field: byTag['Field'],
    name: string,
    alias: string,
    selectionSet: T,
    arguments: readonly T[],
    directives: readonly T[],
  ]

  type FieldDefinition<T = unknown> = [
    FieldDefinition: byTag['FieldDefinition'],
    name: string,
    description: Description,
    type: T,
    arguments: readonly T[],
    directives: readonly T[],
  ]

  type ObjectField = [
    ObjectField: byTag['ObjectField'],
    name: string,
    value: Json
  ]

  type ObjectTypeDefinition<T = unknown> = [
    ObjectTypeDefinition: byTag['ObjectTypeDefinition'],
    name: string,
    description: Description,
    fields: readonly T[],
    interfaces: readonly T[],
    directives: readonly T[],
  ]

  type InterfaceTypeDefinition<T = unknown> = [
    InterfaceTypeDefinition: byTag['InterfaceTypeDefinition'],
    name: string,
    description: Description,
    fields: readonly T[],
    interfaces: readonly T[],
    directives: readonly T[],
  ]

  type Argument<T = unknown> = [
    Argument: byTag['Argument'],
    name: string,
    value: T,
  ]

  type InputObjectTypeDefinition<T = unknown> = [
    InputObjectTypeDefinition: byTag['InputObjectTypeDefinition'],
    name: string,
    description: Description,
    fields: readonly T[],
    directives: readonly T[],
  ]

  type InputValueDefinition<T = unknown> = [
    InputValueDefinition: byTag['InputValueDefinition'],
    name: string,
    description: Description,
    type: T,
    defaultValue: T,
    directives: readonly T[],
  ]

  type VariableDefinition<T = unknown> = [
    VariableDefinition: byTag['VariableDefinition'],
    variable: string,
    type: T,
    defaultValue: T,
    directives: readonly T[],
  ]

  type Directive<T = unknown> = [
    Directive: byTag['Directive'],
    name: string,
    arguments: readonly T[],
  ]

  type DirectiveDefinition<T = unknown> = [
    DirectiveDefinition: byTag['DirectiveDefinition'],
    name: string,
    description: Description,
    repeatable: boolean,
    locations: readonly string[],
    arguments: readonly T[],
  ]

  type Document<T = unknown> = [
    Document: byTag['Document'],
    definition: readonly T[],
  ]

  type FragmentDefinition<T = unknown> = [
    FragmentDefinition: byTag['FragmentDefinition'],
    name: string,
    typeCondition: string,
    selectionSet: T,
    directives: readonly T[],
  ]

  type FragmentSpread<T = unknown> = [
    FragmentSpread: byTag['FragmentSpread'],
    name: string,
    directives: readonly T[],
  ]

  type InlineFragment<T = unknown> = [
    InlineFragment: byTag['InlineFragment'],
    selectionSet: string,
    typeCondition: T,
    directives: readonly T[],
  ]

  type OperationDefinition<T = unknown> = [
    OperationDefinition: byTag['OperationDefinition'],
    name: string,
    operation: OperationType,
    selectionSet: T,
    variableDefinitions: readonly T[],
    directives: readonly T[],
  ]

  type OperationTypeDefinition<T = unknown> = [
    OperationTypeDefinition: byTag['OperationTypeDefinition'],
    type: string,
    operation: T,
  ]

  type SelectionSet<T = unknown> = [
    SelectionSet: byTag['SelectionSet'],
    selections: readonly T[],
  ]

  type SchemaDefinition<T = unknown> = [
    SchemaDefinition: byTag['SchemaDefinition'],
    description: Description,
    operationTypes: readonly (readonly [name: string, operation: T])[],
    directives: readonly T[],
  ]

  // type SchemaExtension<T = unknown> = [
  //   SchemaExtension: byTag['SchemaExtension'],
  //   operationTypes: readonly T[],
  //   directives: readonly T[],
  // ]

  type Terminal = TerminalMap[keyof TerminalMap]
  type TerminalMap = {
    Boolean: Boolean
    Float: Float
    ID: ID
    Int: Int
    Name: Name
    NamedType: NamedType
    Null: Null
    Number: Number
    ScalarTypeDefinition: ScalarTypeDefinition
    String: String
  }

  type Value = ValueMap[keyof ValueMap]
  type ValueMap = {
    BooleanValue: BooleanValue
    FloatValue: FloatValue
    IntValue: IntValue
    NullValue: NullValue
    StringValue: StringValue
    EnumValue: EnumValue
    EnumValueDefinition: EnumValueDefinition
    ListValue: ListValue
    ObjectValue: ObjectValue
    ObjectField: ObjectField
  }

  type UnaryMap<T = unknown> = {
    ListType: ListType<T>
    NonNullType: NonNullType<T>
    UnionTypeDefinition: UnionTypeDefinition<T>
    Variable: Variable<T>
    EnumTypeDefinition: EnumTypeDefinition<T>
    Field: Field<T>
    FieldDefinition: FieldDefinition<T>
    ObjectTypeDefinition: ObjectTypeDefinition<T>
    InterfaceTypeDefinition: InterfaceTypeDefinition<T>
    Argument: Argument<T>
    InputObjectTypeDefinition: InputObjectTypeDefinition<T>
    InputValueDefinition: InputValueDefinition<T>
    VariableDefinition: VariableDefinition<T>
    Directive: Directive<T>
    DirectiveDefinition: DirectiveDefinition<T>
    Document: Document<T>
    FragmentDefinition: FragmentDefinition<T>
    FragmentSpread: FragmentSpread<T>
    InlineFragment: InlineFragment<T>
    OperationDefinition: OperationDefinition<T>
    OperationTypeDefinition: OperationTypeDefinition<T>
    SelectionSet: SelectionSet<T>
    SchemaDefinition: SchemaDefinition<T>
    // SchemaExtension: SchemaExtension<T>
  }

  type Nullary =
    | Seed.Terminal
    | Seed.Value
    | Seed.EnumValueDefinition

  type Unary<T> =
    | Seed.ListType<T>
    | Seed.NonNullType<T>
    | Seed.UnionTypeDefinition<T>
    | Seed.Variable<T>
    | Seed.EnumTypeDefinition<T>
    | Seed.Field<T>
    | Seed.FieldDefinition<T>
    | Seed.ObjectTypeDefinition<T>
    | Seed.InterfaceTypeDefinition<T>
    | Seed.Argument<T>
    | Seed.InputObjectTypeDefinition<T>
    | Seed.InputValueDefinition<T>
    | Seed.VariableDefinition<T>
    | Seed.Directive<T>
    | Seed.DirectiveDefinition<T>
    | Seed.Document<T>
    | Seed.FragmentDefinition<T>
    | Seed.FragmentSpread<T>
    | Seed.InlineFragment<T>
    | Seed.OperationDefinition<T>
    | Seed.OperationTypeDefinition<T>
    | Seed.SelectionSet<T>
    | Seed.SchemaDefinition<T>
  // | Seed.SchemaExtension<T>

  type F<T> =
    | Seed.Nullary
    | Seed.Value
    | Seed.Unary<T>

  type Fixpoint =
    | Seed.Nullary
    | Seed.Value
    | Seed.ListType
    | Seed.NonNullType
    | Seed.UnionTypeDefinition
    | Seed.Variable
    | Seed.EnumTypeDefinition
    | Seed.Field
    | Seed.FieldDefinition
    | Seed.ObjectTypeDefinition
    | Seed.InterfaceTypeDefinition
    | Seed.Argument
    | Seed.InputObjectTypeDefinition
    | Seed.InputValueDefinition
    | Seed.VariableDefinition
    | Seed.Directive
    | Seed.DirectiveDefinition
    | Seed.Document
    | Seed.FragmentDefinition
    | Seed.FragmentSpread
    | Seed.InlineFragment
    | Seed.OperationDefinition
    | Seed.OperationTypeDefinition
    | Seed.SelectionSet
    | Seed.SchemaDefinition
  // | Seed.SchemaExtension

  interface Free extends T.HKT { [-1]: Seed.F<this[0]> }
}

export const identifier = fc.stringMatching(new RegExp(PATTERN.identifier, 'u'))
export const name = fc.lorem({ maxCount: 1 })

export const description = fc.tuple(
  fc.string(),
  fc.boolean(),
) satisfies fc.Arbitrary<Seed.Description>

export const operationType = fc.constantFrom(
  'query',
  'mutation',
  'subscription',
) satisfies fc.Arbitrary<OperationType>

export const directives = (model: fc.Arbitrary<Seed.Fixpoint>) => fc.array(model, { maxLength: 2 })

export const Seed = {
  Boolean: () => fc.constant([byTag['Boolean']]),
  Float: () => fc.constant([byTag['Float']]),
  Int: () => fc.constant([byTag['Int']]),
  ID: () => fc.constant([byTag['ID']]),
  Null: () => fc.constant([byTag['Null']]),
  Number: () => fc.constant([byTag['Number']]),
  String: () => fc.constant([byTag['String']]),
  NamedType: () => fc.tuple(
    fc.constant(byTag['NamedType']),
    name,
  ),
  NullValue: () => fc.constant([byTag['NullValue']]),
  BooleanValue: () => fc.tuple(
    fc.constant(byTag['BooleanValue']),
    fc.boolean(),
  ),
  FloatValue: () => fc.tuple(
    fc.constant(byTag['FloatValue']),
    fc.double(),
  ),
  IntValue: () => fc.tuple(
    fc.constant(byTag['IntValue']),
    fc.integer(),
  ),
  StringValue: () => fc.tuple(
    fc.constant(byTag['StringValue']),
    fc.string(),
    fc.boolean(),
  ),
  ScalarTypeDefinition: () => fc.tuple(
    fc.constant(byTag['ScalarTypeDefinition']),
    name,
    description,
  ),
  EnumValue: () => fc.tuple(
    fc.constant(byTag['EnumValue']),
    name,
  ),
  EnumValueDefinition: () => fc.tuple(
    fc.constant(byTag['EnumValueDefinition']),
    name,
  ),
  ListValue: () => fc.tuple(
    fc.constant(byTag['ListValue']),
    fc.array(fc.jsonValue()),
  ),
  ObjectValue: () => fc.tuple(
    fc.constant(byTag['ObjectValue']),
    fc.dictionary(identifier, fc.jsonValue()),
  ),
  ObjectField: () => fc.tuple(
    fc.constant(byTag['ObjectField']),
    name,
    fc.jsonValue(),
  ),
  ListType: (model) => fc.tuple(
    fc.constant(byTag['ListType']),
    model,
  ),
  NonNullType: (model) => fc.tuple(
    fc.constant(byTag['NonNullType']),
    model,
  ),
  UnionTypeDefinition: (model) => fc.tuple(
    fc.constant(byTag['UnionTypeDefinition']),
    name,
    fc.uniqueArray(model),
    directives(model),
  ),
  Variable: (model) => fc.tuple(
    fc.constant(byTag['Variable']),
    name,
    description,
    directives(model)
  ),
  EnumTypeDefinition: (model) => fc.tuple(
    fc.constant(byTag['EnumTypeDefinition']),
    name,
    description,
    fc.uniqueArray(name),
    directives(model),
  ),
  Field: (model) => fc.tuple(
    fc.constant(byTag['Field']),
    name,
    name,
    model,
    fc.uniqueArray(model),
    directives(model),
  ),
  FieldDefinition: (model) => fc.tuple(
    fc.constant(byTag['FieldDefinition']),
    name,
    description,
    model,
    fc.uniqueArray(model),
    directives(model),
  ),
  ObjectTypeDefinition: (model) => fc.tuple(
    fc.constant(byTag['ObjectTypeDefinition']),
    name,
    description,
    fc.uniqueArray(model),
    fc.uniqueArray(model),
    directives(model),
  ),
  InterfaceTypeDefinition: (model) => fc.tuple(
    fc.constant(byTag['InterfaceTypeDefinition']),
    name,
    description,
    fc.uniqueArray(model),
    fc.uniqueArray(model),
    directives(model),
  ),
  Argument: (model) => fc.tuple(
    fc.constant(byTag['Argument']),
    name,
    model,
  ),
  InputObjectTypeDefinition: (model) => fc.tuple(
    fc.constant(byTag['InputObjectTypeDefinition']),
    name,
    description,
    fc.uniqueArray(model),
    directives(model),
  ),
  InputValueDefinition: (model) => fc.tuple(
    fc.constant(byTag['InputValueDefinition']),
    name,
    description,
    model,
    model,
    directives(model),
  ),
  VariableDefinition: (model) => fc.tuple(
    fc.constant(byTag['VariableDefinition']),
    name,
    model,
    model,
    directives(model),
  ),
  Directive: (model) => fc.tuple(
    fc.constant(byTag['Directive']),
    name,
    fc.uniqueArray(model),
  ),
  DirectiveDefinition: (model) => fc.tuple(
    fc.constant(byTag['DirectiveDefinition']),
    name,
    description,
    fc.boolean(),
    fc.uniqueArray(name),
    fc.uniqueArray(model),
  ),
  Document: (model) => fc.tuple(
    fc.constant(byTag['Document']),
    fc.uniqueArray(model),
  ),
  FragmentDefinition: (model) => fc.tuple(
    fc.constant(byTag['FragmentDefinition']),
    name,
    name,
    model,
    directives(model),
  ),
  FragmentSpread: (model) => fc.tuple(
    fc.constant(byTag['FragmentSpread']),
    name,
    directives(model),
  ),
  InlineFragment: (model) => fc.tuple(
    fc.constant(byTag['InlineFragment']),
    name,
    model,
    directives(model),
  ),
  OperationDefinition: (model) => fc.tuple(
    fc.constant(byTag['OperationDefinition']),
    name,
    operationType,
    model,
    fc.uniqueArray(model),
    directives(model),
  ),
  OperationTypeDefinition: (model) => fc.tuple(
    fc.constant(byTag['OperationTypeDefinition']),
    operationType,
    model,
  ),
  SelectionSet: (model) => fc.tuple(
    fc.constant(byTag['SelectionSet']),
    fc.uniqueArray(model),
  ),
  SchemaDefinition: (model) => fc.tuple(
    fc.constant(byTag['SchemaDefinition']),
    description,
    fc.uniqueArray(
      fc.tuple(name, model),
      { selector: ([name]) => name },
    ),
    directives(model),
  ),
  // SchemaExtension: (model: fc.Arbitrary<Seed.Fixpoint>) => fc.tuple(
  //   fc.constant(byTag['SchemaExtension']),
  //   fc.uniqueArray(model),
  //   directives(model),
  // ) satisfies fc.Arbitrary<Seed.SchemaExtension>,
} satisfies { [K in Kind | NamedType]: (model: fc.Arbitrary<Seed.Fixpoint>) => fc.Arbitrary<Seed[K]> }
