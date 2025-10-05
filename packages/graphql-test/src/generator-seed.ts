import * as fc from 'fast-check'
import type * as T from '@traversable/registry'
import { Object_keys, PATTERN } from '@traversable/registry'
import type { Json } from '@traversable/json'
import type { OperationType } from '@traversable/graphql-types'
import * as F from '@traversable/graphql-types'

import { Config } from './generator-options.js'

type Constraints = Config.Options

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
} as const satisfies Record<'Name' | F.Kind | F.NamedType, number>

export type bySeed = typeof bySeed
export const bySeed = invert(byTag)

export const identifier = fc.stringMatching(new RegExp(PATTERN.identifierNoDollar, 'u')).map((x) => `${x.charAt(0).toUpperCase()}${x.slice(1)}`)
// export const name = fc.lorem({ maxCount: 1 })
export const alias = identifier
export const target = fc.constantFrom(...F.DirectiveTargets)

export const description = ($: Constraints) => $.noDescriptions ? fc.constant(null) : fc.oneof(
  fc.constant(null),
  fc.constant(null),
  fc.tuple(
    fc.lorem(),
    fc.boolean(),
  )
) satisfies fc.Arbitrary<Seed.Description>

export const operationType = fc.constantFrom(
  'query',
  'mutation',
  'subscription',
) satisfies fc.Arbitrary<OperationType>

export declare namespace Seed {
  type Name = [
    Name: byTag['Name'],
    value: string,
  ]

  type NamedType = [
    NamedType: byTag['NamedType'],
    name: string,
  ]

  type Description = null | [description: string, block: boolean]

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
    value: readonly (readonly [k: string, v: Json])[],
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

  type Variable = [
    Variable: byTag['Variable'],
    name: string,
    description: Description,
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
    selectionSet: T | null,
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

  type ObjectField<T = unknown> = [
    ObjectField: byTag['ObjectField'],
    name: string,
    value: T
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
    locations: readonly F.DirectiveTarget[],
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
    typeCondition: string,
    selectionSet: T,
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

  type OperationTypeDefinition = [
    OperationTypeDefinition: byTag['OperationTypeDefinition'],
    type: string,
    operation: F.OperationType,
  ]

  type SelectionSet<T = unknown> = [
    SelectionSet: byTag['SelectionSet'],
    selections: readonly T[],
  ]

  type SchemaDefinition<T = unknown> = [
    SchemaDefinition: byTag['SchemaDefinition'],
    _unused: string,
    description: Description,
    operationTypes: readonly Seed.OperationTypeDefinition[],
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
    Variable: Variable
    OperationTypeDefinition: OperationTypeDefinition
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

export type Seed<T = unknown> = (
  & Seed.TerminalMap
  & Seed.ValueMap
  & Seed.UnaryMap<T>
)

const NamedType = (_tie: fc.LetrecTypedTie<Seed>, _$: Constraints): fc.Arbitrary<Seed.NamedType> => fc.tuple(
  fc.constant(byTag['NamedType']),
  identifier,
)

const jsonScalar = fc.oneof(
  fc.constant(null),
  fc.integer(),
  fc.double({ noNaN: true, noDefaultInfinity: true }),
  identifier,
)

type JsonValue = {
  null: null
  number: number
  string: string
  array: readonly JsonValue[]
  object: { [x: string]: JsonValue }
  "*": JsonValue
}

const jsonValue = fc.letrec((tie: fc.LetrecTypedTie<JsonValue>) => {
  return {
    null: fc.constant(null),
    number: fc.integer(),
    // fc.double({ noNaN: true, noDefaultInfinity: true }),
    string: identifier,
    array: fc.array(tie('*')),
    object: fc.uniqueArray(
      fc.tuple(
        identifier,
        tie('*'),
      ),
      { selector: ([k]) => k }
    ).map((xs) => Object.fromEntries(xs)),
    ['*']: fc.oneof(
      tie('null'),
      tie('number'),
      tie('string'),
      tie('array'),
      tie('object'),
    )
  }
})

const Boolean = (_tie: fc.LetrecTypedTie<Seed>, _$: Constraints): fc.Arbitrary<Seed.Boolean> => fc.constant([byTag['Boolean']])
const Float = (_tie: fc.LetrecTypedTie<Seed>, _$: Constraints): fc.Arbitrary<Seed.Float> => fc.constant([byTag['Float']])
const Int = (_tie: fc.LetrecTypedTie<Seed>, _$: Constraints): fc.Arbitrary<Seed.Int> => fc.constant([byTag['Int']])
const ID = (_tie: fc.LetrecTypedTie<Seed>, _$: Constraints): fc.Arbitrary<Seed.ID> => fc.constant([byTag['ID']])
const Null = (_tie: fc.LetrecTypedTie<Seed>, _$: Constraints): fc.Arbitrary<Seed.Null> => fc.constant([byTag['Null']])
const Number = (_tie: fc.LetrecTypedTie<Seed>, _$: Constraints): fc.Arbitrary<Seed.Number> => fc.constant([byTag['Number']])
const String = (_tie: fc.LetrecTypedTie<Seed>, _$: Constraints): fc.Arbitrary<Seed.String> => fc.constant([byTag['String']])

const NullValue = (_tie: fc.LetrecTypedTie<Seed>, _$: Constraints): fc.Arbitrary<Seed.NullValue> => fc.constant([byTag['NullValue']])
const BooleanValue = (_tie: fc.LetrecTypedTie<Seed>, _$: Constraints): fc.Arbitrary<Seed.BooleanValue> => fc.tuple(fc.constant(byTag['BooleanValue']), fc.boolean())
const FloatValue = (_tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.FloatValue> => fc.tuple(
  fc.constant(byTag['FloatValue']), fc.double($.FloatValue)
)

const IntValue = (_tie: fc.LetrecTypedTie<Seed>, _$: Constraints): fc.Arbitrary<Seed.IntValue> => fc.tuple(fc.constant(byTag['IntValue']), fc.integer())
const StringValue = (_tie: fc.LetrecTypedTie<Seed>, _$: Constraints): fc.Arbitrary<Seed.StringValue> => fc.tuple(
  fc.constant(byTag['StringValue']),
  fc.string(),
  fc.boolean(),
)

const ScalarTypeDefinition = (_tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.ScalarTypeDefinition> => fc.tuple(
  fc.constant(byTag['ScalarTypeDefinition']),
  identifier,
  description($),
)

const EnumValue = (_tie: fc.LetrecTypedTie<Seed>, _$: Constraints): fc.Arbitrary<Seed.EnumValue> => fc.tuple(
  fc.constant(byTag['EnumValue']),
  identifier,
)

const EnumValueDefinition = (_tie: fc.LetrecTypedTie<Seed>, _$: Constraints): fc.Arbitrary<Seed.EnumValueDefinition> => fc.tuple(
  fc.constant(byTag['EnumValueDefinition']),
  identifier,
)

const ListValue = (_tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.ListValue> => fc.tuple(
  fc.constant(byTag['ListValue']),
  fc.array(
    jsonValue['*'],
    $.ListValue
  ),
)

const ListType = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.ListType> => fc.tuple(
  fc.constant(byTag['ListType']),
  TypeNode(tie, $),
)

const NonNullType = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.NonNullType> => fc.tuple(
  fc.constant(byTag['NonNullType']),
  fc.oneof(
    NamedType(tie, $),
    ListType(tie, $),
  )
)

const UnionTypeDefinition = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.UnionTypeDefinition> => fc.tuple(
  fc.constant(byTag['UnionTypeDefinition']),
  identifier,
  fc.uniqueArray(
    NamedType(tie, $),
    $.NamedType!
  ),
  fc.uniqueArray(
    ConstDirective(tie, $),
    $.Directive!,
  )
)

const Variable = (_tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.Variable> => fc.tuple(
  fc.constant(byTag['Variable']),
  identifier,
  description($),
)

const EnumTypeDefinition = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.EnumTypeDefinition> => fc.tuple(
  fc.constant(byTag['EnumTypeDefinition']),
  identifier,
  description($),
  fc.uniqueArray(
    identifier,
    $.EnumTypeDefinition!
  ),
  fc.uniqueArray(
    ConstDirective(tie, $),
    $.Directive!
  ),
)

const Field = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.Field> => fc.tuple(
  fc.constant(byTag['Field']),
  identifier,
  alias,
  fc.oneof(
    fc.constant(null), NonEmptySelectionSet(tie, $)
  ),
  fc.uniqueArray(
    Argument(tie, $),
    $.Argument!
  ),
  fc.uniqueArray(
    Directive(tie, $),
    $.Directive!
  ),
)

const FieldDefinition = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.FieldDefinition> => fc.tuple(
  fc.constant(byTag['FieldDefinition']),
  identifier,
  description($),
  TypeNode(tie, $),
  fc.uniqueArray(
    InputValueDefinition(tie, $),
    $.InputValueDefinition!
  ),
  fc.uniqueArray(
    ConstDirective(tie, $),
    $.Directive!
  )
)

const ObjectTypeDefinition = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.ObjectTypeDefinition> => fc.tuple(
  fc.constant(byTag['ObjectTypeDefinition']),
  identifier,
  description($),
  fc.uniqueArray(
    FieldDefinition(tie, $),
    $.FieldDefinition!
  ),
  fc.uniqueArray(
    NamedType(tie, $),
    $.NamedType!
  ),
  fc.uniqueArray(
    ConstDirective(tie, $),
    $.Directive!
  )
)

const InterfaceTypeDefinition = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.InterfaceTypeDefinition> => fc.tuple(
  fc.constant(byTag['InterfaceTypeDefinition']),
  identifier,
  description($),
  fc.uniqueArray(
    FieldDefinition(tie, $),
    $.FieldDefinition!
  ),
  fc.uniqueArray(
    NamedType(tie, $),
    $.NamedType!
  ),
  fc.uniqueArray(
    ConstDirective(tie, $),
    $.Directive!
  )
)

const Argument = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.Argument> => fc.tuple(
  fc.constant(byTag['Argument']),
  identifier,
  ValueNode(tie, $),
)

const InputObjectTypeDefinition = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.InputObjectTypeDefinition> => fc.tuple(
  fc.constant(byTag['InputObjectTypeDefinition']),
  identifier,
  description($),
  fc.uniqueArray(
    InputValueDefinition(tie, $),
    $.InputValueDefinition!
  ),
  fc.uniqueArray(
    ConstDirective(tie, $),
    $.Directive!
  ),
)

const InputValueDefinition = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.InputValueDefinition> => fc.tuple(
  fc.constant(byTag['InputValueDefinition']),
  identifier,
  description($),
  TypeNode(tie, $),
  ConstValueNode(tie, $),
  fc.uniqueArray(
    ConstDirective(tie, $),
    $.Directive!
  ),
)

const VariableDefinition = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.VariableDefinition> => fc.tuple(
  fc.constant(byTag['VariableDefinition']),
  identifier,
  TypeNode(tie, $),
  ConstValueNode(tie, $),
  fc.uniqueArray(
    ConstDirective(tie, $),
    $.Directive!
  ),
)

const Directive = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.Directive> => {
  return fc.tuple(
    fc.constant(byTag['Directive']),
    identifier,
    fc.uniqueArray(
      Argument(tie, $),
      $.Argument!
    ),
  )
}

const DirectiveDefinition = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.DirectiveDefinition> => fc.tuple(
  fc.constant(byTag['DirectiveDefinition']),
  identifier,
  description($),
  fc.boolean(),
  fc.uniqueArray(
    target,
    { minLength: 1, maxLength: 3 },
  ),
  fc.uniqueArray(
    InputValueDefinition(tie, $),
    $.InputValueDefinition!
  ),
)

const FragmentDefinition = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.FragmentDefinition> => fc.tuple(
  fc.constant(byTag['FragmentDefinition']),
  identifier,
  identifier,
  NonEmptySelectionSet(tie, $),
  fc.uniqueArray(
    Directive(tie, $),
    $.Directive!
  ),
)

const FragmentSpread = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.FragmentSpread> => fc.tuple(
  fc.constant(byTag['FragmentSpread']),
  identifier,
  fc.uniqueArray(
    Directive(tie, $),
    $.Directive!
  ),
)

const InlineFragment = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.InlineFragment> => fc.tuple(
  fc.constant(byTag['InlineFragment']),
  identifier,
  NonEmptySelectionSet(tie, $),
  fc.uniqueArray(
    Directive(tie, $),
    $.Directive!
  ),
)

const NonEmptySelectionSet = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.SelectionSet> => fc.tuple(
  fc.constant(byTag['SelectionSet']),
  fc.uniqueArray(
    Selection(tie, $),
    { ...$.SelectionSet, minLength: 1 },
  ),
)

const OperationDefinition = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.OperationDefinition> => fc.tuple(
  fc.constant(byTag['OperationDefinition']),
  identifier,
  operationType,
  NonEmptySelectionSet(tie, $),
  fc.uniqueArray(
    VariableDefinition(tie, $),
    $.VariableDefinition!
  ),
  fc.uniqueArray(
    Directive(tie, $),
    $.Directive!
  ),
)

const OperationTypeDefinition = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.OperationTypeDefinition> => fc.tuple(
  fc.constant(byTag['OperationTypeDefinition']),
  identifier,
  operationType,
)

const SelectionSet = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.SelectionSet> => fc.tuple(
  fc.constant(byTag['SelectionSet']),
  fc.uniqueArray(
    Selection(tie, $),
    $.SelectionSet!
  ),
)

const SchemaDefinition = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.SchemaDefinition> => fc.tuple(
  fc.constant(byTag['SchemaDefinition']),
  identifier,
  description($),
  fc.uniqueArray(
    OperationTypeDefinition(tie, $),
    $.SchemaDefinition!,
  ),
  fc.uniqueArray(
    ConstDirective(tie, $),
    $.Directive!
  )
)

const Document = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.Document> => {
  return fc.tuple(
    fc.constant(byTag['Document']),
    fc.uniqueArray(
      Definition(tie, $),
      $.Document!
    ),
  )
}

/////////////////
///  DERIVED  ///

const ConstArgument = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.Argument> => fc.tuple(
  fc.constant(byTag['Argument']),
  identifier,
  ConstValueNode(tie, $),
)

const ConstDirective = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.Directive> => fc.tuple(
  fc.constant(byTag['Directive']),
  identifier,
  fc.uniqueArray(
    ConstArgument(tie, $),
    $.Argument!
  ),
)

const TypeNode = (tie: fc.LetrecTypedTie<Seed>, $: Constraints) => fc.oneof(
  NamedType(tie, $),
  tie('ListType'),
  tie('NonNullType'),
)

/**
 * ## {@link Selection `Selection`}
 * See also:
 * - https://github.com/graphql/graphql-js/blob/16.x.x/src/language/ast.ts#L355
 */
const Selection = (tie: fc.LetrecTypedTie<Seed>, $: Constraints) => fc.oneof(
  tie('Field'),
  tie('FragmentSpread'),
  tie('InlineFragment'),
)

const ObjectValue = (_tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.ObjectValue> => fc.tuple(
  fc.constant(byTag['ObjectValue']),
  fc.uniqueArray(
    fc.tuple(
      identifier,
      jsonValue['*'],
    ),
    $.ObjectValue!
  ),
)

/**
 * ## {@link ValueNode `ValueNode`}
 * See also:
 * - https://github.com/graphql/graphql-js/blob/16.x.x/src/language/ast.ts#L411-L420
 */
const ValueNode = (tie: fc.LetrecTypedTie<Seed>, $: Constraints) => fc.oneof(
  IntValue(tie, $),
  FloatValue(tie, $),
  StringValue(tie, $),
  BooleanValue(tie, $),
  NullValue(tie, $),
  EnumValue(tie, $),
  ListValue(tie, $),
  ObjectValue(tie, $),
)

const ObjectField = (tie: fc.LetrecTypedTie<Seed>, $: Constraints): fc.Arbitrary<Seed.ObjectField> => fc.tuple(
  fc.constant(byTag['ObjectField']),
  identifier,
  ValueNode(tie, $),
)

const ConstListValue = (tie: fc.LetrecTypedTie<Seed>, $: Constraints) => fc.tuple(
  fc.constant(byTag['ListValue']),
  fc.array(ConstValueNode(tie, $)),
)

/**
 * ## {@link ConstValueNode `ConstValueNode`}
 * See also:
 * - https://github.com/graphql/graphql-js/blob/16.x.x/src/language/ast.ts#L422
 */
const ConstValueNode = (tie: fc.LetrecTypedTie<Seed>, $: Constraints) => fc.oneof(
  IntValue(tie, $),
  FloatValue(tie, $),
  StringValue(tie, $),
  BooleanValue(tie, $),
  NullValue(tie, $),
  EnumValue(tie, $),
  // TODO:
  // tie('ConstListValue'),
  // tie('ConstObjectValue'),
)

/**
 * ## {@link ExecutableDefinition `ExecutableDefinition`}
 * See also:
 * - https://github.com/graphql/graphql-js/blob/16.x.x/src/language/ast.ts#L313-L315
 */
const ExecutableDefinition = (tie: fc.LetrecTypedTie<Seed>, $: Constraints) => fc.oneof(
  tie('OperationDefinition'),
  tie('FragmentDefinition'),
)

/**
 * ## {@link TypeDefinition `TypeDefinition`}
 * See also:
 * -   https://github.com/graphql/graphql-js/blob/16.x.x/src/language/ast.ts#L568-L574
 */
const TypeDefinition = (tie: fc.LetrecTypedTie<Seed>, $: Constraints) => fc.oneof(
  tie('ScalarTypeDefinition'),
  tie('ObjectTypeDefinition'),
  tie('InterfaceTypeDefinition'),
  tie('UnionTypeDefinition'),
  tie('EnumTypeDefinition'),
  tie('InputObjectTypeDefinition'),
)

/**
 * ## {@link TypeSystemDefinition `TypeSystemDefinition`}
 * See also:
 * - https://github.com/graphql/graphql-js/blob/16.x.x/src/language/ast.ts#L546-L549
 */
const TypeSystemDefinition = (tie: fc.LetrecTypedTie<Seed>, $: Constraints) => fc.oneof(
  TypeDefinition(tie, $),
  tie('SchemaDefinition'),
  tie('DirectiveDefinition'),
  // TypeSystemExtension(tie),
)

/**
 * ## {@link Definition `Definition`}
 * See also:
 * - https://github.com/graphql/graphql-js/blob/16.x.x/src/language/ast.ts#L308-L311
 */
const Definition = (tie: fc.LetrecTypedTie<Seed>, $: Constraints) => fc.oneof(
  ExecutableDefinition(tie, $),
  TypeSystemDefinition(tie, $),
)

export const Seed = {
  Boolean,
  Float,
  Int,
  ID,
  Null,
  Number,
  String,
  NamedType,
  NullValue,
  BooleanValue,
  FloatValue,
  IntValue,
  StringValue,
  ScalarTypeDefinition,
  EnumValue,
  Variable,
  EnumValueDefinition,
  ObjectValue,
  ObjectField,
  ListValue,
  ListType,
  NonNullType,
  UnionTypeDefinition,
  EnumTypeDefinition,
  Field,
  FieldDefinition,
  ObjectTypeDefinition,
  InterfaceTypeDefinition,
  Argument,
  InputObjectTypeDefinition,
  InputValueDefinition,
  VariableDefinition,
  Directive,
  DirectiveDefinition,
  Document,
  FragmentDefinition,
  FragmentSpread,
  InlineFragment,
  OperationDefinition,
  OperationTypeDefinition,
  SelectionSet,
  SchemaDefinition,
  // SchemaExtension,
} satisfies { [K in F.Kind | F.NamedType]: (tie: fc.LetrecTypedTie<Seed>, $: Constraints) => fc.Arbitrary<Seed[K]> }

// const SchemaExtension = (tie: fc.LetrecTypedTie<Seed>) => fc.tuple(
//   fc.constant(byTag['SchemaExtension']),
//   fc.uniqueArray(tie('*')),
//   directives(tie('*')),
// )
