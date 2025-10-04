import type * as GQL from 'graphql'

import type * as T from '@traversable/registry'
import { fn, has, Object_create, Object_values, topologicalSort } from '@traversable/registry'

export type Algebra<T> = {
  (src: AST.DocumentNode<T>, ix?: Index<T>): { order: string[], byName: Record<string, () => T> }
  (src: GQL.DocumentNode, ix?: Index<T>): { order: string[], byName: Record<string, () => T> }
  (src: AST.DocumentNode<T>, ix?: Index<T>): { order: string[], byName: Record<string, () => T> }
}

/**
 * ## {@link Kind `Kind`}
 * 
 * [Reference](https://github.com/graphql/graphql-js/blob/16.x.x/src/language/kinds.ts#L4)
 */

export const Kind = {
  Argument: 'Argument',
  BooleanValue: 'BooleanValue',
  Directive: 'Directive',
  DirectiveDefinition: 'DirectiveDefinition',
  Document: 'Document',
  EnumTypeDefinition: 'EnumTypeDefinition',
  EnumValue: 'EnumValue',
  EnumValueDefinition: 'EnumValueDefinition',
  Field: 'Field',
  FieldDefinition: 'FieldDefinition',
  FloatValue: 'FloatValue',
  FragmentDefinition: 'FragmentDefinition',
  FragmentSpread: 'FragmentSpread',
  InlineFragment: 'InlineFragment',
  InputObjectTypeDefinition: 'InputObjectTypeDefinition',
  InputValueDefinition: 'InputValueDefinition',
  InterfaceTypeDefinition: 'InterfaceTypeDefinition',
  IntValue: 'IntValue',
  ListType: 'ListType',
  ListValue: 'ListValue',
  // Name: 'Name',
  NamedType: 'NamedType',
  NonNullType: 'NonNullType',
  NullValue: 'NullValue',
  ObjectField: 'ObjectField',
  ObjectTypeDefinition: 'ObjectTypeDefinition',
  ObjectValue: 'ObjectValue',
  OperationDefinition: 'OperationDefinition',
  OperationTypeDefinition: 'OperationTypeDefinition',
  ScalarTypeDefinition: 'ScalarTypeDefinition',
  SchemaDefinition: 'SchemaDefinition',
  // SchemaExtension: 'SchemaExtension',
  SelectionSet: 'SelectionSet',
  StringValue: 'StringValue',
  UnionTypeDefinition: 'UnionTypeDefinition',
  Variable: 'Variable',
  VariableDefinition: 'VariableDefinition',
} as const

export type Kind = typeof Kinds[number]
export const Kinds = Object_values(Kind)

export declare namespace Kind {
  type Argument = typeof Kind.Argument
  type BooleanValue = typeof Kind.BooleanValue
  type Directive = typeof Kind.Directive
  type DirectiveDefinition = typeof Kind.DirectiveDefinition
  type Document = typeof Kind.Document
  type EnumTypeDefinition = typeof Kind.EnumTypeDefinition
  type EnumValue = typeof Kind.EnumValue
  type EnumValueDefinition = typeof Kind.EnumValueDefinition
  type Field = typeof Kind.Field
  type FieldDefinition = typeof Kind.FieldDefinition
  type FloatValue = typeof Kind.FloatValue
  type FragmentDefinition = typeof Kind.FragmentDefinition
  type FragmentSpread = typeof Kind.FragmentSpread
  type InlineFragment = typeof Kind.InlineFragment
  type InputObjectTypeDefinition = typeof Kind.InputObjectTypeDefinition
  type InputValueDefinition = typeof Kind.InputValueDefinition
  type InterfaceTypeDefinition = typeof Kind.InterfaceTypeDefinition
  type IntValue = typeof Kind.IntValue
  type ListType = typeof Kind.ListType
  type ListValue = typeof Kind.ListValue
  // type Name = typeof Kind.Name
  type NamedType = typeof Kind.NamedType
  type NonNullType = typeof Kind.NonNullType
  type NullValue = typeof Kind.NullValue
  type ObjectField = typeof Kind.ObjectField
  type ObjectTypeDefinition = typeof Kind.ObjectTypeDefinition
  type ObjectValue = typeof Kind.ObjectValue
  type OperationDefinition = typeof Kind.OperationDefinition
  type OperationTypeDefinition = typeof Kind.OperationTypeDefinition
  type ScalarTypeDefinition = typeof Kind.ScalarTypeDefinition
  type SchemaDefinition = typeof Kind.SchemaDefinition
  // type SchemaExtension = typeof Kind.SchemaExtension
  type SelectionSet = typeof Kind.SelectionSet
  type StringValue = typeof Kind.StringValue
  type UnionTypeDefinition = typeof Kind.UnionTypeDefinition
  type Variable = typeof Kind.Variable
  type VariableDefinition = typeof Kind.VariableDefinition
}

export const NamedType = {
  Null: 'Null',
  Boolean: 'Boolean',
  Float: 'Float',
  ID: 'ID',
  Int: 'Int',
  Number: 'Number',
  String: 'String',
} as const

export type NamedType = typeof NamedTypes[number]
export const NamedTypes = Object_values(NamedType)

export declare namespace NamedType {
  type Null = typeof NamedType.Null
  type Boolean = typeof NamedType.Boolean
  type Float = typeof NamedType.Float
  type ID = typeof NamedType.ID
  type Int = typeof NamedType.Int
  type Number = typeof NamedType.Number
  type String = typeof NamedType.String
}

export const OperationType = {
  Query: 'query',
  Mutation: 'mutation',
  Subscription: 'subscription',
} as const

export type OperationType = typeof OperationTypes[number]
export const OperationTypes = Object_values(OperationType)

export declare namespace OperationType {
  type Query = typeof OperationType.Query
  type Mutation = typeof OperationType.Mutation
  type Subscription = typeof OperationType.Subscription
}

export const Tag = { ...Kind, ...NamedType }
export type Tag = typeof Tags[number]
export const Tags = Object_values(Tag)

export declare namespace Catalog {
  type byKind<T = unknown> = { [Node in F<T> as Node['kind']]: Node }
  type byNamedType = {
    [NamedType.Null]: AST.NullNode
    [NamedType.Int]: AST.IntNode
    [NamedType.Float]: AST.FloatNode
    [NamedType.Number]: AST.NumberNode
    [NamedType.Boolean]: AST.BooleanNode
    [NamedType.String]: AST.StringNode
    [NamedType.ID]: AST.IDNode
  }
}

export interface Location {
  start: number
  end: number
}

export interface SelectionSetNode<T = unknown> {
  kind: Kind.SelectionSet
  selections: readonly T[]
  loc?: Location
}

export interface NameNode<Value = string> {
  kind: 'Name'
  value: Value
  loc?: Location
}

export interface NamedTypeNode {
  kind: Kind.NamedType
  name: NameNode
  loc?: Location
}

/**
 * ## {@link RefNode `RefNode`}
 * 
 * A {@link RefNode `RefNode`} is a named type that is not one of the built-in types.
 */
export interface RefNode {
  kind: Kind.NamedType
  name: NameNode
  loc?: Location
}

export interface ArgumentNode<T = unknown> {
  kind: Kind.Argument
  loc?: Location
  name: NameNode
  value: T
}

export interface DocumentNode<T = unknown> {
  kind: Kind.Document
  definitions: readonly T[]
  loc?: Location
}

export interface InputValueDefinitionNode<T = unknown> {
  kind: Kind.InputValueDefinition
  name: NameNode
  type: T
  defaultValue?: T
  directives?: readonly T[]
  description?: StringValueNode
  loc?: Location
}

export interface InputObjectTypeDefinitionNode<T = unknown> {
  kind: Kind.InputObjectTypeDefinition
  name: NameNode
  fields: readonly T[]
  directives?: readonly T[]
  description?: StringValueNode
  loc?: Location
}

export interface VariableNode {
  kind: Kind.Variable
  name: NameNode
  loc?: Location
}

export interface VariableDefinitionNode<T = unknown> {
  kind: Kind.VariableDefinition
  variable: VariableNode
  type: T
  defaultValue?: T
  directives?: readonly T[]
  loc?: Location
}

export interface ScalarTypeDefinitionNode<T = unknown> {
  kind: Kind.ScalarTypeDefinition
  name: NameNode
  directives?: T[]
  description?: StringValueNode
  loc?: Location
}

export interface NullNode {
  kind: Kind.NamedType
  name: NameNode<NamedType.Null>
  loc?: Location
}

export interface BooleanNode {
  kind: Kind.NamedType
  name: NameNode<NamedType.Boolean>
  loc?: Location
}

export interface IntNode {
  kind: Kind.NamedType
  name: NameNode<NamedType.Int>
  loc?: Location
}

export interface NumberNode {
  kind: Kind.NamedType
  name: NameNode<NamedType.Number>
  loc?: Location
}

export interface FloatNode {
  kind: Kind.NamedType
  name: NameNode<NamedType.Float>
  loc?: Location
}

export interface StringNode {
  kind: Kind.NamedType
  name: NameNode<NamedType.String>
  loc?: Location
}

export interface IDNode {
  kind: Kind.NamedType
  name: NameNode<NamedType.ID>
  loc?: Location
}

export interface EnumValueDefinitionNode {
  kind: Kind.EnumValueDefinition
  name: NameNode
  loc?: Location
}

export interface EnumValueNode {
  kind: Kind.EnumValue
  value: string
  description?: StringValueNode
  loc?: Location
}

export interface EnumTypeDefinitionNode<T = unknown> {
  kind: Kind.EnumTypeDefinition
  name: NameNode
  values: readonly EnumValueDefinitionNode[]
  directives?: readonly T[]
  description?: StringValueNode
  loc?: Location
}

export interface NonNullTypeNode<T = unknown> {
  kind: Kind.NonNullType
  type: T
  loc?: Location
}

export interface ListNode<T = unknown> {
  kind: Kind.ListType
  type: T
  loc?: Location
}

export interface FieldDefinitionNode<T = unknown> {
  kind: Kind.FieldDefinition
  name: NameNode
  type: T
  arguments?: readonly T[]
  directives?: readonly T[]
  description?: StringValueNode
  loc?: Location
}

export interface FieldNode<T = unknown> {
  kind: Kind.Field
  alias: NameNode | undefined
  name: NameNode
  selectionSet?: T
  arguments?: readonly T[]
  directives?: readonly T[]
  description?: StringValueNode
  loc?: Location
}

export interface ObjectTypeDefinitionNode<T = unknown> {
  kind: Kind.ObjectTypeDefinition
  name: NameNode
  fields: readonly T[]
  interfaces: readonly T[]
  directives?: readonly T[]
  description?: StringValueNode
  loc?: Location
}

export interface InterfaceTypeDefinitionNode<T = unknown> {
  kind: Kind.InterfaceTypeDefinition
  name: NameNode
  fields: readonly T[]
  interfaces: readonly T[]
  directives?: readonly T[]
  description?: StringValueNode
  loc?: Location
}

export interface UnionTypeDefinitionNode<T = unknown> {
  kind: Kind.UnionTypeDefinition
  name: NameNode
  types: readonly T[]
  directives?: readonly T[]
  description?: StringValueNode
  loc?: Location
}

export interface FragmentDefinitionNode<T = unknown> {
  kind: Kind.FragmentDefinition
  name: NameNode
  typeCondition: NamedTypeNode
  directives?: readonly T[]
  selectionSet: T
  loc?: Location
}

export interface FragmentSpreadNode<T = unknown> {
  kind: Kind.FragmentSpread
  name: NameNode
  directives?: readonly T[]
  loc?: Location
}

export interface InlineFragmentNode<T = unknown> {
  kind: Kind.InlineFragment
  typeCondition?: NamedTypeNode
  directives?: readonly T[]
  selectionSet: T
  loc?: Location
}

export interface IntValueNode {
  kind: Kind.IntValue
  value: number
  loc?: Location
}

export interface FloatValueNode {
  kind: Kind.FloatValue
  value: number
  loc?: Location
}

export interface StringValueNode {
  kind: Kind.StringValue
  value: string
  block: boolean
  loc?: Location
}

export interface BooleanValueNode {
  kind: Kind.BooleanValue
  value: boolean
  loc?: Location
}

export interface NullValueNode {
  kind: Kind.NullValue
  loc?: Location
}

export interface ListValueNode {
  kind: Kind.ListValue
  values: readonly ValueNode[]
  loc?: Location
}

export interface ObjectValueNode {
  kind: Kind.ObjectValue
  fields: readonly ObjectFieldNode[]
  loc?: Location
}

export interface ObjectFieldNode {
  kind: Kind.ObjectField
  name: NameNode
  value: ValueNode
  loc?: Location
}

export interface DirectiveNode<T = unknown> {
  kind: Kind.Directive
  name: NameNode
  arguments?: readonly T[]
  loc?: Location
}

export interface DirectiveDefinitionNode<T = unknown> {
  kind: Kind.DirectiveDefinition
  name: NameNode
  arguments?: readonly T[]
  repeatable: boolean
  locations: readonly NameNode[]
  description?: StringValueNode
  loc?: Location
}

export interface QueryOperation<T = unknown> {
  kind: Kind.OperationDefinition
  operation: OperationType.Query
  selectionSet: T
  name?: NameNode
  variableDefinitions?: readonly T[]
  directives?: readonly T[]
  loc?: Location
}

export interface MutationOperation<T = unknown> {
  kind: Kind.OperationDefinition
  operation: OperationType.Mutation
  selectionSet: T
  name?: NameNode
  variableDefinitions?: readonly T[]
  directives?: readonly T[]
  loc?: Location
}

export interface SubscriptionOperation<T = unknown> {
  kind: Kind.OperationDefinition
  operation: OperationType.Subscription
  name?: NameNode
  variableDefinitions?: readonly T[]
  directives?: readonly T[]
  selectionSet: T
  loc?: Location
}

export interface OperationTypeDefinitionNode<T = unknown> {
  kind: Kind.OperationTypeDefinition
  type: NamedTypeNode
  operation: T
  loc?: Location
}

export interface SchemaDefinitionNode<T = unknown> {
  kind: Kind.SchemaDefinition
  directives?: readonly T[]
  operationTypes: readonly OperationTypeDefinitionNode<T>[]
  description?: StringValueNode
  loc?: Location
}

export type ValueNode =
  | VariableNode
  | IntValueNode
  | FloatValueNode
  | StringValueNode
  | BooleanValueNode
  | NullValueNode
  | ListValueNode
  | ObjectValueNode
  | EnumValueNode

export type Nullary =
  | NullNode
  | NameNode
  | BooleanNode
  | IntNode
  | NumberNode
  | FloatNode
  | StringNode
  | IDNode
  | EnumValueDefinitionNode
  | ObjectFieldNode

export type OperationDefinitionNode<T = unknown> =
  | QueryOperation<T>
  | MutationOperation<T>
  | SubscriptionOperation<T>

export type Unary<T> =
  | NonNullTypeNode<T>
  | ListNode<T>
  | FieldNode<T>
  | FieldDefinitionNode<T>
  | ScalarTypeDefinitionNode<T>
  | ObjectTypeDefinitionNode<T>
  | InterfaceTypeDefinitionNode<T>
  | UnionTypeDefinitionNode<T>
  | ArgumentNode<T>
  | InputValueDefinitionNode<T>
  | InputObjectTypeDefinitionNode<T>
  | SelectionSetNode<T>
  | FragmentDefinitionNode<T>
  | FragmentSpreadNode<T>
  | InlineFragmentNode<T>
  | DirectiveNode<T>
  | EnumTypeDefinitionNode<T>
  | DirectiveDefinitionNode<T>
  | SchemaDefinitionNode<T>
  | VariableDefinitionNode<T>
  | OperationDefinitionNode<T>
  | OperationTypeDefinitionNode<T>
  | DocumentNode<T>

export type F<T> =
  | Nullary
  | RefNode
  | ValueNode
  | Unary<T>

export type Fixpoint =
  | Nullary
  | RefNode
  | ValueNode
  | NonNullTypeNode
  | ListNode
  | FieldNode
  | FieldDefinitionNode
  | ScalarTypeDefinitionNode
  | ObjectTypeDefinitionNode
  | InterfaceTypeDefinitionNode
  | UnionTypeDefinitionNode
  | ArgumentNode
  | InputValueDefinitionNode
  | InputObjectTypeDefinitionNode
  | SelectionSetNode
  | FragmentDefinitionNode
  | FragmentSpreadNode
  | InlineFragmentNode
  | DirectiveNode
  | EnumTypeDefinitionNode
  | DirectiveDefinitionNode
  | SchemaDefinitionNode
  | VariableDefinitionNode
  | OperationDefinitionNode
  | OperationTypeDefinitionNode
  | DocumentNode

export declare namespace AST {
  export {
    NameNode,
    Nullary,
    Unary,
    F,
    Fixpoint,
    Catalog,
    RefNode,
    // nodes:
    ArgumentNode,
    BooleanNode,
    BooleanValueNode,
    DirectiveDefinitionNode,
    DirectiveNode,
    DocumentNode,
    EnumTypeDefinitionNode,
    EnumValueDefinitionNode,
    EnumValueNode,
    FieldDefinitionNode,
    FieldNode,
    FloatNode,
    FloatValueNode,
    FragmentDefinitionNode,
    FragmentSpreadNode,
    IDNode,
    InlineFragmentNode,
    InputObjectTypeDefinitionNode,
    InputValueDefinitionNode,
    InterfaceTypeDefinitionNode,
    IntNode,
    IntValueNode,
    ListNode,
    ListValueNode,
    MutationOperation,
    NamedTypeNode,
    NonNullTypeNode,
    NullNode,
    NullValueNode,
    NumberNode,
    ObjectTypeDefinitionNode,
    ObjectFieldNode,
    ObjectValueNode,
    OperationDefinitionNode,
    OperationTypeDefinitionNode,
    QueryOperation,
    ScalarTypeDefinitionNode,
    SchemaDefinitionNode,
    SelectionSetNode,
    StringNode,
    StringValueNode,
    SubscriptionOperation,
    UnionTypeDefinitionNode,
    ValueNode,
    VariableNode,
    VariableDefinitionNode,
  }
}

export function isScalarTypeDefinition<T>(x: unknown): x is AST.ScalarTypeDefinitionNode<T> {
  return has('kind', (kind) => kind === Kind.ScalarTypeDefinition)(x)
}

export function isNullNode(x: unknown): x is AST.NullNode {
  return has('kind', (kind) => kind === Kind.NamedType)(x)
    && has('name', 'value', (value) => value === NamedType.Null)(x)
}

export function isBooleanNode(x: unknown): x is AST.BooleanNode {
  return has('kind', (kind) => kind === Kind.NamedType)(x)
    && has('name', 'value', (value) => value === NamedType.Boolean)(x)
}

export function isIntNode(x: unknown): x is AST.IntNode {
  return has('kind', (kind) => kind === Kind.NamedType)(x)
    && has('name', 'value', (value) => value === NamedType.Int)(x)
}

export function isNumberNode(x: unknown): x is AST.NumberNode {
  return has('kind', (kind) => kind === Kind.NamedType)(x)
    && has('name', 'value', (value) => value === NamedType.Number)(x)
}

export function isFloatNode(x: unknown): x is AST.FloatNode {
  return has('kind', (kind) => kind === Kind.NamedType)(x)
    && has('name', 'value', (value) => value === NamedType.Float)(x)
}

export function isStringNode(x: unknown): x is AST.StringNode {
  return has('kind', (kind) => kind === Kind.NamedType)(x)
    && has('name', 'value', (value) => value === NamedType.String)(x)
}

export function isIDNode(x: unknown): x is AST.IDNode {
  return has('kind', (kind) => kind === Kind.NamedType)(x)
    && has('name', 'value', (value) => value === NamedType.ID)(x)
}

export function isObjectFieldNode(x: unknown): x is AST.ObjectFieldNode {
  return has('kind', (kind) => kind === Kind.ObjectField)(x)
}

export function isEnumTypeDefinitionNode<T>(x: unknown): x is AST.EnumTypeDefinitionNode<T> {
  return has('kind', (kind) => kind === Kind.EnumTypeDefinition)(x)
}

export function isEnumValueDefinitionNode(x: unknown): x is AST.EnumValueDefinitionNode {
  return has('kind', (kind) => kind === Kind.EnumValueDefinition)(x)
}

export function isEnumValueNode(x: unknown): x is AST.EnumValueNode {
  return has('kind', (kind) => kind === Kind.EnumValue)(x)
}

export function isVariableNode(x: unknown): x is AST.VariableNode {
  return has('kind', (kind) => kind === Kind.Variable)(x)
}

export function isVariableDefinitionNode<T>(x: unknown): x is AST.VariableDefinitionNode<T> {
  return has('kind', (kind) => kind === Kind.VariableDefinition)(x)
}

export function isBooleanValueNode(x: unknown): x is AST.BooleanValueNode {
  return has('kind', (kind) => kind === Kind.BooleanValue)(x)
}

export function isIntValueNode(x: unknown): x is AST.IntValueNode {
  return has('kind', (kind) => kind === Kind.IntValue)(x)
}

export function isFloatValueNode(x: unknown): x is AST.FloatValueNode {
  return has('kind', (kind) => kind === Kind.FloatValue)(x)
}

export function isStringValueNode(x: unknown): x is AST.StringValueNode {
  return has('kind', (kind) => kind === Kind.StringValue)(x)
}

export function isNullValueNode(x: unknown): x is AST.NullValueNode {
  return has('kind', (kind) => kind === Kind.NullValue)(x)
}

export function isListValueNode(x: unknown): x is AST.ListValueNode {
  return has('kind', (kind) => kind === Kind.ListValue)(x)
}

export function isObjectValueNode(x: unknown): x is AST.ObjectValueNode {
  return has('kind', (kind) => kind === Kind.ObjectValue)(x)
}

export function isNonNullTypeNode<T>(x: unknown): x is AST.NonNullTypeNode<T> {
  return has('kind', (kind) => kind === Kind.NonNullType)(x)
}

export function isListNode<T>(x: unknown): x is AST.ListNode<T> {
  return has('kind', (kind) => kind === Kind.ListType)(x)
}

export function isFieldNode<T>(x: unknown): x is AST.FieldNode<T> {
  return has('kind', (kind) => kind === Kind.Field)(x)
}

export function isFieldDefinitionNode<T>(x: unknown): x is AST.FieldDefinitionNode<T> {
  return has('kind', (kind) => kind === Kind.FieldDefinition)(x)
}

export function isObjectTypeDefinitionNode<T>(x: unknown): x is AST.ObjectTypeDefinitionNode<T> {
  return has('kind', (kind) => kind === Kind.ObjectTypeDefinition)(x)
}

export function isInterfaceTypeDefinitionNode<T>(x: unknown): x is AST.InterfaceTypeDefinitionNode<T> {
  return has('kind', (kind) => kind === Kind.InterfaceTypeDefinition)(x)
}

export function isUnionTypeDefinitionNode<T>(x: unknown): x is AST.UnionTypeDefinitionNode<T> {
  return has('kind', (kind) => kind === Kind.UnionTypeDefinition)(x)
}

export function isArgumentNode<T>(x: unknown): x is AST.ArgumentNode<T> {
  return has('kind', (kind) => kind === Kind.Argument)(x)
}

export function isInputValueDefinitionNode<T>(x: unknown): x is AST.InputValueDefinitionNode<T> {
  return has('kind', (kind) => kind === Kind.InputValueDefinition)(x)
}

export function isInputObjectTypeDefinitionNode<T>(x: unknown): x is AST.InputObjectTypeDefinitionNode<T> {
  return has('kind', (kind) => kind === Kind.InputObjectTypeDefinition)(x)
}

export function isNameNode(x: unknown): x is AST.NameNode {
  return has('kind', (kind) => kind == 'Name')(x)
}

export function isNamedTypeNode(x: unknown): x is AST.NamedTypeNode {
  return has('name', 'value', (value) => typeof value === 'string')(x)
}

export function isSelectionSetNode<T>(x: unknown): x is AST.SelectionSetNode<T> {
  return has('kind', (kind) => kind === Kind.SelectionSet)(x)
}

export function isFragmentDefinitionNode<T>(x: unknown): x is AST.FragmentDefinitionNode<T> {
  return has('kind', (kind) => kind === Kind.FragmentDefinition)(x)
}

export function isFragmentSpreadNode<T>(x: unknown): x is AST.FragmentSpreadNode<T> {
  return has('kind', (kind) => kind === Kind.FragmentSpread)(x)
}

export function isInlineFragmentNode<T>(x: unknown): x is AST.InlineFragmentNode<T> {
  return has('kind', (kind) => kind === Kind.InlineFragment)(x)
}

export function isDirectiveNode<T>(x: unknown): x is AST.DirectiveNode<T> {
  return has('kind', (kind) => kind === Kind.Directive)(x)
}

export function isDirectiveDefinitionNode<T>(x: unknown): x is AST.DirectiveDefinitionNode<T> {
  return has('kind', (kind) => kind === Kind.DirectiveDefinition)(x)
}

export function isQueryOperation<T>(x: unknown): x is AST.QueryOperation<T> {
  return has('operation', (op) => op === OperationType.Query)(x)
}

export function isMutationOperation<T>(x: unknown): x is AST.MutationOperation<T> {
  return has('operation', (op) => op === OperationType.Mutation)(x)
}

export function isSubscriptionOperation<T>(x: unknown): x is AST.SubscriptionOperation<T> {
  return has('operation', (op) => op === OperationType.Subscription)(x)
}

export function isSchemaDefinitionNode<T>(x: unknown): x is AST.SchemaDefinitionNode<T> {
  return has('kind', (kind) => kind === Kind.SchemaDefinition)(x)
}

export function isDocumentNode<T>(x: unknown): x is AST.DocumentNode<T> {
  return has('kind', (kind) => kind === Kind.Document)(x)
}

export function isRefNode(x: unknown): x is AST.RefNode {
  return has('kind', (kind) => kind === Kind.NamedType)(x)
    && has('name', 'value', (value) => typeof value === 'string')(x)
    && !isNullaryNode(x)
}

export function isValueNode(x: unknown): x is AST.ValueNode {
  return isNullValueNode(x)
    || isIntValueNode(x)
    || isFloatValueNode(x)
    || isStringValueNode(x)
    || isBooleanValueNode(x)
    || isEnumValueNode(x)
    || isListValueNode(x)
    || isObjectValueNode(x)
    || isEnumValueNode(x)
    || isEnumValueDefinitionNode(x)
    || isVariableNode(x)
}

export function isNullaryNode(x: unknown): x is AST.Nullary {
  return isNullNode(x)
    || isNameNode(x)
    || isBooleanNode(x)
    || isIntNode(x)
    || isNumberNode(x)
    || isFloatNode(x)
    || isStringNode(x)
    || isIDNode(x)
    || isEnumValueDefinitionNode(x)
  // || isScalarTypeDefinition(x)
}

export function isUnaryNode<T>(x: unknown): x is AST.Unary<T> {
  return isNonNullTypeNode(x)
    || isListNode(x)
    || isFieldNode(x)
    || isFieldDefinitionNode(x)
    || isFieldDefinitionNode(x)
    || isObjectTypeDefinitionNode(x)
    || isInterfaceTypeDefinitionNode(x)
    || isUnionTypeDefinitionNode(x)
    || isArgumentNode(x)
    || isInputValueDefinitionNode(x)
    || isInputObjectTypeDefinitionNode(x)
    || isSelectionSetNode(x)
    || isEnumTypeDefinitionNode(x)
    || isFragmentDefinitionNode(x)
    || isFragmentSpreadNode(x)
    || isInlineFragmentNode(x)
    || isDirectiveNode(x)
    || isDirectiveDefinitionNode(x)
    || isSchemaDefinitionNode(x)
    || isVariableDefinitionNode(x)
    || isOperationDefinitionNode(x)
    || isOperationTypeDefinitionNode(x)
    || isDocumentNode(x)
}

export function isOperationDefinitionNode<T>(x: unknown): x is AST.OperationDefinitionNode<T> {
  return has('kind', (kind) => kind === Kind.OperationDefinition)(x)
}

export function isOperationTypeDefinitionNode<T>(x: unknown): x is AST.OperationTypeDefinitionNode<T> {
  return has('kind', (kind) => kind === Kind.OperationTypeDefinition)(x)
}

export interface Index<T = unknown> {
  namedTypes: Record<string, () => T>
}

export const createIndex: () => Index = () => ({
  namedTypes: Object_create(null),
})

export interface Functor extends T.HKT { [-1]: AST.F<this[0]> }
export declare namespace Functor { export { Index } }

export const Functor: T.Functor.Ix<Functor.Index, Functor, GQL.ASTNode> = {
  map(g) {
    return (x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case isRefNode(x): return x
        case isNullaryNode(x): return x
        case isValueNode(x): return x
        case isListNode(x): return { ...x, type: g(x.type) }
        case isNonNullTypeNode(x): return { ...x, type: g(x.type) }
        case isSelectionSetNode(x): return { ...x, selections: x.selections.map(g) }
        case isDocumentNode(x): return { ...x, definitions: x.definitions.map(g) }
        case isArgumentNode(x): return { ...x, value: g(x.value) }
        case isScalarTypeDefinition(x): {
          const { directives, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map(g) },
          }
        }
        case isEnumTypeDefinitionNode(x): {
          const { directives, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map(g) },
          }
        }
        case isVariableDefinitionNode(x): {
          const { directives, defaultValue, type, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map(g) },
            ...defaultValue && { defaultValue: g(defaultValue) },
            type: g(type),
          }
        }
        case isUnionTypeDefinitionNode(x): {
          const { directives, types, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map(g) },
            types: types.map(g),
          }
        }
        case isFieldNode(x): {
          const { arguments: args, directives, selectionSet, ...xs } = x
          return {
            ...xs,
            ...args && { arguments: args.map(g) },
            ...directives && { directives: directives.map(g) },
            ...selectionSet && { selectionSet: g(selectionSet) },
          }
        }
        case isFieldDefinitionNode(x): {
          const { arguments: args, directives, type, ...xs } = x
          return {
            ...xs,
            ...args && { arguments: args.map(g) },
            ...directives && { directives: directives.map(g) },
            type: g(type),
          }
        }
        case isObjectTypeDefinitionNode(x): {
          const { directives, interfaces, fields, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map(g) },
            interfaces: interfaces.map(g),
            fields: fields.map(g),
          }
        }
        case isInterfaceTypeDefinitionNode(x): {
          const { directives, interfaces, fields, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map(g) },
            interfaces: interfaces.map(g),
            fields: fields.map(g),
          }
        }
        case isInputValueDefinitionNode(x): {
          const { directives, defaultValue, type, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map(g) },
            ...defaultValue && { defaultValue: g(defaultValue) },
            type: g(type),
          }
        }
        case isInputObjectTypeDefinitionNode(x): {
          const { directives, fields, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map(g) },
            fields: fields.map(g),
          }
        }
        case isFragmentDefinitionNode(x): {
          const { directives, selectionSet, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map(g) },
            selectionSet: g(selectionSet),
          }
        }
        case isFragmentSpreadNode(x): {
          const { directives, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map(g) },
          }
        }
        case isInlineFragmentNode(x): {
          const { directives, selectionSet, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map(g) },
            selectionSet: g(selectionSet),
          }
        }
        case isDirectiveNode(x): {
          const { arguments: args, ...xs } = x
          return {
            ...xs,
            ...args && { arguments: args.map(g) },
          }
        }
        case isDirectiveDefinitionNode(x): {
          const { arguments: args, ...xs } = x
          return {
            ...xs,
            ...args && { arguments: args.map(g) },
          }
        }
        case isOperationDefinitionNode(x): {
          const { directives, variableDefinitions: vars, selectionSet, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map(g) },
            ...vars && { variableDefinitions: vars.map(g) },
            selectionSet: g(selectionSet)
          }
        }
        case isOperationTypeDefinitionNode(x): {
          return {
            ...x,
            operation: g(x.operation),
          }
        }
        case isSchemaDefinitionNode(x): {
          const { directives, operationTypes, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map(g) },
            operationTypes: fn.map(operationTypes, (ot) => ({ ...ot, operation: g(ot.operation) })),
          }
        }
      }
    }
  },
  mapWithIndex(g) {
    return (x, ix) => {
      switch (true) {
        // default: return fn.exhaustive(x)
        default: return (console.log('EXHAUSTIVE, x:', x), x) satisfies never
        case isRefNode(x): return x
        case isNullaryNode(x): return x
        case isValueNode(x): return x
        case isArgumentNode(x): return { ...x, value: g(x.value, ix, x) }
        case isListNode(x): return { ...x, type: g(x.type, ix, x) }
        case isNonNullTypeNode(x): return { ...x, type: g(x.type, ix, x) }
        case isDocumentNode(x): return { ...x, definitions: x.definitions.map((_) => g(_, ix, x)) }
        case isScalarTypeDefinition(x): {
          const { directives, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map((_) => g(_, ix, x)) },
          }
        }
        case isEnumTypeDefinitionNode(x): {
          const { directives, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map((_) => g(_, ix, x)) },
          }
        }
        case isVariableDefinitionNode(x): {
          const { directives, defaultValue, type, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map((_) => g(_, ix, x)) },
            ...defaultValue && { defaultValue: g(defaultValue, ix, x) },
            type: g(type, ix, x),
          }
        }
        case isSelectionSetNode(x): {
          return { ...x, selections: x.selections.map((_) => g(_, ix, x)) }
        }
        case isUnionTypeDefinitionNode(x): {
          const { directives, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map((_) => g(_, ix, x)) },
            types: x.types.map((_) => g(_, ix, x)),
          }
        }
        case isFieldNode(x): {
          const { arguments: args, directives, selectionSet, ...xs } = x
          return {
            ...xs,
            ...args && { arguments: args.map((_) => g(_, ix, x)) },
            ...directives && { directives: directives.map((_) => g(_, ix, x)) },
            ...selectionSet && { selectionSet: g(selectionSet, ix, x) },
          }
        }
        case isFieldDefinitionNode(x): {
          const { arguments: args, directives, ...xs } = x
          return {
            ...xs,
            ...args && { arguments: args.map((_) => g(_, ix, x)) },
            ...directives && { directives: directives.map((_) => g(_, ix, x)) },
            type: g(x.type, ix, x),
          }
        }
        case isObjectTypeDefinitionNode(x): {
          const { directives, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map((_) => g(_, ix, x)) },
            fields: x.fields.map((_) => g(_, ix, x)),
            interfaces: x.interfaces.map((_) => g(_, ix, x)),
          }
        }
        case isInterfaceTypeDefinitionNode(x): {
          const { directives, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map((_) => g(_, ix, x)) },
            fields: x.fields.map((_) => g(_, ix, x)),
            interfaces: x.interfaces.map((_) => g(_, ix, x)),
          }
        }
        case isInputValueDefinitionNode(x): {
          const { directives, defaultValue, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map((_) => g(_, ix, x)) },
            ...defaultValue && { defaultValue: g(defaultValue, ix, x) },
            type: g(x.type, ix, x),
          }
        }
        case isInputObjectTypeDefinitionNode(x): {
          const { directives, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map((_) => g(_, ix, x)) },
            fields: x.fields.map((_) => g(_, ix, x)),
          }
        }
        case isFragmentDefinitionNode(x): {
          const { directives, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map((_) => g(_, ix, x)) },
            selectionSet: g(x.selectionSet, ix, x),
          }
        }
        case isFragmentSpreadNode(x): {
          const { directives, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map((_) => g(_, ix, x)) },
          }
        }
        case isInlineFragmentNode(x): {
          const { directives, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map((_) => g(_, ix, x)) },
            selectionSet: g(x.selectionSet, ix, x),
          }
        }
        case isDirectiveNode(x): {
          const { arguments: args, ...xs } = x
          return {
            ...xs,
            ...args && { arguments: args.map((_) => g(_, ix, x)) },
          }
        }
        case isDirectiveDefinitionNode(x): {
          const { arguments: args, ...xs } = x
          return {
            ...xs,
            ...args && { arguments: args.map((_) => g(_, ix, x)) },
          }
        }
        case isOperationDefinitionNode(x): {
          const { directives, variableDefinitions: vars, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map((_) => g(_, ix, x)) },
            ...vars && { variableDefinitions: vars.map((_) => g(_, ix, x)) },
            selectionSet: g(x.selectionSet, ix, x)
          }
        }
        case isOperationTypeDefinitionNode(x): {
          return {
            ...x,
            operation: g(x.operation, ix, x),
          }
        }
        case isSchemaDefinitionNode(x): {
          const { directives, operationTypes, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map((_) => g(_, ix, x)) },
            operationTypes: fn.map(operationTypes, (ot) => ({ ...ot, operation: g(ot.operation, ix, x) })),
          }
        }
      }
    }
  }
}

const fold_ = fn.catamorphism(Functor, createIndex())

function getDependencies(node: GQL.ASTNode, ix: Index): Set<string> {
  const deps = new Set<string>()
  void fold_((x) => isRefNode(x) ? (void deps.add(x.name.value), x) : x)(node, ix)
  return deps
}

function reducer<T>(g: (src: AST.F<T>, ix: Index, x: GQL.ASTNode) => T, ix: Index<T>):
  (acc: Record<string, () => T>, node: T | GQL.ASTNode, i: number) => Record<string, () => T>

function reducer<T>(g: (src: AST.F<T>, ix: Index, x: GQL.ASTNode) => T, ix: Index<T>) {
  return (acc: Record<string, () => T>, node: GQL.ASTNode, i: number) => {
    const key = has('name', 'value', (v) => typeof v === 'string')(node) ? node.name.value : `__${i}`
    acc[key] = () => fold_(g)(node, ix)
    return acc
  }
}

function setGroups<T>(groups: Map<string, string[]>, ix: Index<T>): (node: T | GQL.ASTNode, i: number) => void
function setGroups<T>(groups: Map<string, string[]>, ix: Index<T>): (node: GQL.ASTNode, i: number) => void {
  return (node: GQL.ASTNode, i: number) => {
    if (has('name', 'value', (v) => typeof v === 'string')(node)) {
      groups.set(node.name.value, Array.from(getDependencies(node, ix)))
    } else {
      groups.set(`__${i}`, Array.from(getDependencies(node, ix)))
    }
  }
}

export function fold<T>(g: (src: AST.F<T>, ix: Index, x: GQL.ASTNode) => T): Algebra<T> {
  return (x, ix) => {
    const index = ix ?? createIndex() as Index<T>
    const groups = new Map<string, string[]>()
    const byName = x.definitions.reduce(reducer(g, index), index.namedTypes)
    void x.definitions.forEach(setGroups(groups, index))

    try {
      const graph = topologicalSort(groups)
      const order = graph.chunks.flat()
      return { order, byName }
    } catch (e) {
      throw Error(
        'Dependency graph contains unknown nodes: { '
        + Array.from(groups).map(([k, v]) => `${k}: [${v.join(', ')}]`).join(', ')
        + ' }'
      )
    }
  }
}
