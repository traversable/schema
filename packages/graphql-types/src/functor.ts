import type * as T from '@traversable/registry'
import { fn, has } from '@traversable/registry'
import type * as gql from 'graphql'

/**
 * ## {@link Kind `Kind`}
 * 
 * [Reference](https://github.com/graphql/graphql-js/blob/16.x.x/src/language/kinds.ts#L4)
 */
export const Kind = {
  Document: 'Document',
  EnumTypeDefinition: 'EnumTypeDefinition',
  EnumValueDefinition: 'EnumValueDefinition',
  FieldDefinition: 'FieldDefinition',
  InputObjectTypeDefinition: 'InputObjectTypeDefinition',
  InputValueDefinition: 'InputValueDefinition',
  InterfaceTypeDefinition: 'InterfaceTypeDefinition',
  ListType: 'ListType',
  Name: 'Name',
  NamedType: 'NamedType',
  NonNullType: 'NonNullType',
  ObjectTypeDefinition: 'ObjectTypeDefinition',
  OperationDefinition: 'OperationDefinition',
  ScalarTypeDefinition: 'ScalarTypeDefinition',
  SelectionSet: 'SelectionSet',
  UnionTypeDefinition: 'UnionTypeDefinition',
  Variable: 'Variable',
  VariableDefinition: 'VariableDefinition',
  //
  FragmentSpread: 'FragmentSpread',
  InlineFragment: 'InlineFragment',
  FragmentDefinition: 'FragmentDefinition',
  //
  Argument: 'Argument',
  Directive: 'Directive',
  DirectiveDefinition: 'DirectiveDefinition',
  EnumValue: 'EnumValue',
  Field: 'Field',
  FloatValue: 'FloatValue',
  StringValue: 'StringValue',
  BooleanValue: 'BooleanValue',
  IntValue: 'IntValue',
  ListValue: 'ListValue',
  NullValue: 'NullValue',
  ObjectValue: 'ObjectValue',
  ObjectField: 'ObjectField',
  SchemaDefinition: 'SchemaDefinition',
  SchemaExtension: 'SchemaExtension',
  OperationTypeDefinition: 'OperationTypeDefinition',
} as const

export declare namespace Kind {
  type Document = typeof Kind.Document
  type EnumTypeDefinition = typeof Kind.EnumTypeDefinition
  type EnumValueDefinition = typeof Kind.EnumValueDefinition
  type FieldDefinition = typeof Kind.FieldDefinition
  type InputObjectTypeDefinition = typeof Kind.InputObjectTypeDefinition
  type InputValueDefinition = typeof Kind.InputValueDefinition
  type InterfaceTypeDefinition = typeof Kind.InterfaceTypeDefinition
  type ListType = typeof Kind.ListType
  type Name = typeof Kind.Name
  type NamedType = typeof Kind.NamedType
  type NonNullType = typeof Kind.NonNullType
  type ObjectTypeDefinition = typeof Kind.ObjectTypeDefinition
  type OperationDefinition = typeof Kind.OperationDefinition
  type ScalarTypeDefinition = typeof Kind.ScalarTypeDefinition
  type SelectionSet = typeof Kind.SelectionSet
  type UnionTypeDefinition = typeof Kind.UnionTypeDefinition
  type Variable = typeof Kind.Variable
  type VariableDefinition = typeof Kind.VariableDefinition
  //
  type FragmentSpread = typeof Kind.FragmentSpread
  type InlineFragment = typeof Kind.InlineFragment
  type FragmentDefinition = typeof Kind.FragmentDefinition
  //
  type Argument = typeof Kind.Argument
  type Directive = typeof Kind.Directive
  type DirectiveDefinition = typeof Kind.DirectiveDefinition
  type EnumValue = typeof Kind.EnumValue
  type Field = typeof Kind.Field
  type FloatValue = typeof Kind.FloatValue
  type StringValue = typeof Kind.StringValue
  type BooleanValue = typeof Kind.BooleanValue
  type IntValue = typeof Kind.IntValue
  type ListValue = typeof Kind.ListValue
  type NullValue = typeof Kind.NullValue
  type ObjectValue = typeof Kind.ObjectValue
  type ObjectField = typeof Kind.ObjectField
  type SchemaDefinition = typeof Kind.SchemaDefinition
  type SchemaExtension = typeof Kind.SchemaExtension
  type OperationTypeDefinition = typeof Kind.OperationTypeDefinition
}

/**
 * ## {@link NamedType `NamedType`}
 */
export const NamedType = {
  Boolean: 'Boolean',
  Float: 'Float',
  ID: 'ID',
  Int: 'Int',
  Number: 'Number',
  String: 'String',
} as const

export declare namespace NamedType {
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

export declare namespace OperationType {
  type Query = typeof OperationType.Query
  type Mutation = typeof OperationType.Mutation
  type Subscription = typeof OperationType.Subscription
}

/**
 * ## {@link AST `AST`}
 */
export declare namespace AST {
  type Catalog<T = unknown> = { [Node in F<T> as Node['kind']]: Node }

  interface Location {
    start: number
    end: number
  }

  interface SelectionSetNode<T> {
    kind: Kind.SelectionSet
    selections: readonly T[]
    loc?: Location
  }

  interface NameNode<Value = string> {
    kind: Kind.Name
    value: Value
    loc?: Location
  }

  interface NamedTypeNode {
    name: NameNode
    loc?: Location
  }

  /**
   * ## {@link RefNode `RefNode`}
   * 
   * A {@link RefNode `RefNode`} is a named type that is not one of the built-in types.
   */
  interface RefNode {
    kind: Kind.NamedType
    name: NameNode
    loc?: Location
  }

  interface DocumentNode<T> {
    kind: Kind.Document
    definitions: readonly T[]
    loc?: Location
  }

  interface InputValueNode<T> {
    kind: Kind.InputValueDefinition
    name: NameNode
    type: T
    directives?: readonly T[]
    loc?: Location
  }

  interface InputObjectNode<T> {
    kind: Kind.InputObjectTypeDefinition
    name: NameNode
    fields: readonly T[]
    directives?: readonly T[]
    loc?: Location
  }

  interface VariableNode {
    kind: Kind.Variable
    name: NameNode
    loc?: Location
  }

  interface VariableDefinitionNode<T> {
    kind: Kind.VariableDefinition
    variable: VariableNode
    type: T
    directives?: readonly T[]
    loc?: Location
  }

  interface ScalarTypeDefinition {
    kind: Kind.ScalarTypeDefinition
    name: NameNode
    loc?: Location
  }

  interface Boolean {
    kind: Kind.NamedType
    name: NameNode<NamedType.Boolean>
    loc?: Location
  }

  interface Int {
    kind: Kind.NamedType
    name: NameNode<NamedType.Int>
    loc?: Location
  }

  interface Number {
    kind: Kind.NamedType
    name: NameNode<NamedType.Number>
    loc?: Location
  }

  interface Float {
    kind: Kind.NamedType
    name: NameNode<NamedType.Float>
    loc?: Location
  }

  interface String {
    kind: Kind.NamedType
    name: NameNode<NamedType.String>
    loc?: Location
  }

  interface ID {
    kind: Kind.NamedType
    name: NameNode<NamedType.ID>
    loc?: Location
  }

  interface EnumValueNode {
    kind: Kind.EnumValueDefinition
    name: NameNode
    loc?: Location
  }

  interface EnumNode {
    kind: Kind.EnumTypeDefinition
    name: NameNode
    values: readonly EnumValueNode[]
    loc?: Location
  }

  interface NonNullTypeNode<T> {
    kind: Kind.NonNullType
    type: T
    loc?: Location
  }

  interface ListNode<T> {
    kind: Kind.ListType
    type: T
    loc?: Location
  }

  interface FieldNode<T> {
    kind: Kind.FieldDefinition
    name: NameNode
    type: T
    defaultValue?: unknown
    arguments?: readonly T[]
    directives?: readonly T[]
    loc?: Location
  }

  interface ObjectNode<T> {
    kind: Kind.ObjectTypeDefinition
    name: NameNode
    fields: readonly T[]
    interfaces: readonly T[]
    directives?: readonly T[]
    loc?: Location
  }

  interface InterfaceNode<T> {
    kind: Kind.InterfaceTypeDefinition
    name: NameNode
    fields: readonly T[]
    interfaces: readonly T[]
    directives?: readonly T[]
    loc?: Location
  }

  interface UnionNode<T> {
    kind: Kind.UnionTypeDefinition
    name: NameNode
    types: readonly T[]
    directives?: readonly T[]
    loc?: Location
  }

  interface FragmentDefinitionNode<T> {
    kind: Kind.FragmentDefinition
    name: NameNode
    typeCondition: NamedTypeNode
    directives?: readonly T[]
    selectionSet: T
    loc?: Location
  }

  interface FragmentSpreadNode<T> {
    kind: Kind.FragmentSpread
    name: NameNode
    directives?: readonly T[]
    loc?: Location
  }

  interface InlineFragmentNode<T> {
    kind: Kind.InlineFragment
    typeCondition?: NamedTypeNode
    directives?: readonly T[]
    selectionSet: T
    loc?: Location
  }

  interface IntValueNode {
    kind: Kind.IntValue
    value: string
    loc?: Location
  }

  interface FloatValueNode {
    kind: Kind.FloatValue
    value: string
    loc?: Location
  }

  interface StringValueNode {
    kind: Kind.StringValue
    value: string
    loc?: Location
  }

  interface BooleanValueNode {
    kind: Kind.BooleanValue
    value: boolean
    loc?: Location
  }

  interface NullValueNode {
    kind: Kind.NullValue
    loc?: Location
  }

  interface ListValueNode {
    kind: Kind.ListValue
    values: readonly ValueNode[]
    loc?: Location
  }

  interface ObjectValueNode {
    kind: Kind.ObjectValue
    fields: readonly ObjectFieldNode[]
    loc?: Location
  }

  interface ObjectFieldNode {
    kind: Kind.ObjectField
    name: NameNode
    value: ValueNode
    loc?: Location
  }

  interface DirectiveNode<T> {
    kind: Kind.Directive
    name: NameNode
    arguments?: readonly T[]
    loc?: Location
  }

  interface QueryOperation<T> {
    kind: Kind.OperationDefinition
    operation: OperationType.Query
    name?: NameNode
    variableDefinitions?: readonly T[]
    directives?: readonly T[]
    selectionSet: T
    loc?: Location
  }

  interface MutationOperation<T> {
    kind: Kind.OperationDefinition
    operation: OperationType.Mutation
    name?: NameNode
    variableDefinitions?: readonly T[]
    directives?: readonly T[]
    selectionSet: T
    loc?: Location
  }

  interface SubscriptionOperation<T> {
    kind: Kind.OperationDefinition
    operation: OperationType.Subscription
    name?: NameNode
    variableDefinitions?: readonly T[]
    directives?: readonly T[]
    selectionSet: T
    loc?: Location
  }

  type ValueNode =
    | VariableNode
    | IntValueNode
    | FloatValueNode
    | StringValueNode
    | BooleanValueNode
    | NullValueNode
    | EnumValueNode
    | ListValueNode
    | ObjectValueNode

  type Nullary =
    | Boolean
    | Int
    | Number
    | Float
    | String
    | ID
    | ScalarTypeDefinition
    | EnumNode
    | ValueNode

  type OperationDefinitionNode<T> =
    | QueryOperation<T>
    | MutationOperation<T>
    | SubscriptionOperation<T>

  type Unary<T> =
    | NonNullTypeNode<T>
    | ListNode<T>
    | FieldNode<T>
    | ObjectNode<T>
    | InterfaceNode<T>
    | UnionNode<T>
    | InputValueNode<T>
    | InputObjectNode<T>
    | SelectionSetNode<T>
    | FragmentDefinitionNode<T>
    | FragmentSpreadNode<T>
    | InlineFragmentNode<T>
    | DirectiveNode<T>

  type F<T> =
    | RefNode
    | Nullary
    | Unary<T>
    | OperationDefinitionNode<T>
    | DocumentNode<T>
}

export function isScalarTypeDefinition(x: unknown): x is AST.ScalarTypeDefinition {
  return has('kind', (kind) => kind === Kind.ScalarTypeDefinition)(x)
}

export function isBooleanNode(x: unknown): x is AST.Boolean {
  return has('name', 'value', (value) => value === NamedType.Boolean)(x)
}

export function isIntNode(x: unknown): x is AST.Int {
  return has('name', 'value', (value) => value === NamedType.Int)(x)
}

export function isNumberNode(x: unknown): x is AST.Number {
  return has('name', 'value', (value) => value === NamedType.Number)(x)
}

export function isFloatNode(x: unknown): x is AST.Float {
  return has('name', 'value', (value) => value === NamedType.Float)(x)
}

export function isStringNode(x: unknown): x is AST.String {
  return has('name', 'value', (value) => value === NamedType.String)(x)
}

export function isIDNode(x: unknown): x is AST.ID {
  return has('name', 'value', (value) => value === NamedType.ID)(x)
}

export function isEnumNode(x: unknown): x is AST.EnumNode {
  return has('kind', (kind) => kind === Kind.EnumTypeDefinition)(x)
}

export function isVariableNode(x: unknown): x is AST.VariableNode {
  return has('kind', (kind) => kind === Kind.Variable)(x)
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

export function isEnumValueNode(x: unknown): x is AST.EnumValueNode {
  return has('kind', (kind) => kind === Kind.EnumValue)(x)
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
  return has('kind', (kind) => kind === Kind.FieldDefinition)(x)
}

export function isObjectNode<T>(x: unknown): x is AST.ObjectNode<T> {
  return has('kind', (kind) => kind === Kind.ObjectTypeDefinition)(x)
}

export function isInterfaceNode<T>(x: unknown): x is AST.InterfaceNode<T> {
  return has('kind', (kind) => kind === Kind.InterfaceTypeDefinition)(x)
}

export function isUnionNode<T>(x: unknown): x is AST.UnionNode<T> {
  return has('kind', (kind) => kind === Kind.UnionTypeDefinition)(x)
}

export function isInputValueNode<T>(x: unknown): x is AST.InputValueNode<T> {
  return has('kind', (kind) => kind === Kind.InputValueDefinition)(x)
}

export function isInputObjectNode<T>(x: unknown): x is AST.InputObjectNode<T> {
  return has('kind', (kind) => kind === Kind.InputObjectTypeDefinition)(x)
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

export function isQueryOperation<T>(x: unknown): x is AST.QueryOperation<T> {
  return has('kind', (kind) => kind === OperationType.Query)(x)
}

export function isMutationOperation<T>(x: unknown): x is AST.MutationOperation<T> {
  return has('kind', (kind) => kind === OperationType.Mutation)(x)
}

export function isSubscriptionOperation<T>(x: unknown): x is AST.SubscriptionOperation<T> {
  return has('kind', (kind) => kind === OperationType.Subscription)(x)
}

export function isOperationDefinitionNode<T>(x: unknown): x is AST.OperationDefinitionNode<T> {
  return isQueryOperation(x)
    || isMutationOperation(x)
    || isSubscriptionOperation(x)
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
  return isVariableNode(x)
    || isIntValueNode(x)
    || isFloatValueNode(x)
    || isStringValueNode(x)
    || isBooleanValueNode(x)
    || isNullValueNode(x)
    || isEnumValueNode(x)
    || isListValueNode(x)
    || isObjectValueNode(x)
}

export function isNullaryNode(x: unknown): x is AST.Nullary {
  return isScalarTypeDefinition(x)
    || isBooleanNode(x)
    || isIntNode(x)
    || isNumberNode(x)
    || isFloatNode(x)
    || isStringNode(x)
    || isIDNode(x)
    || isEnumNode(x)
}

export function isUnaryNode<T>(x: unknown): x is AST.Unary<T> {
  return isNonNullTypeNode(x)
    || isListNode(x)
    || isObjectNode(x)
    || isInterfaceNode(x)
    || isUnionNode(x)
    || isInputObjectNode(x)
}

export interface Index {
  isNonNull: boolean
}

export const defaultIndex = {
  isNonNull: false,
} satisfies Index

export type Algebra<T> = {
  (src: AST.F<T>, ix?: Index): T
  (src: gql.ASTNode, ix?: Index): T
  (src: AST.F<T>, ix?: Index): T
}

export type Fold = <T>(g: (src: AST.F<T>, ix: Index, x: gql.ASTNode) => T) => Algebra<T>

export interface Functor extends T.HKT { [-1]: AST.F<this[0]> }

export declare namespace Functor {
  export {
    Index,
  }
}

export const Functor: T.Functor.Ix<Functor.Index, Functor, gql.ASTNode> = {
  map(g) {
    return (x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case isRefNode(x): return x
        case isNullaryNode(x): return x
        case isListNode(x): return { ...x, type: g(x.type) }
        case isNonNullTypeNode(x): return { ...x, type: g(x.type) }
        case isSelectionSetNode(x): return { ...x, selections: x.selections.map(g) }
        case isDocumentNode(x): return { ...x, definitions: x.definitions.map(g) }
        case isUnionNode(x): {
          const { directives, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map(g) },
            types: x.types.map(g),
          }
        }
        case isFieldNode(x): {
          const { arguments: args, directives, ...xs } = x
          return {
            ...xs,
            ...args && { arguments: args.map(g) },
            ...directives && { directives: directives.map(g) },
            type: g(x.type),
          }
        }
        case isObjectNode(x): {
          const { directives, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map(g) },
            interfaces: x.interfaces.map(g),
            fields: x.fields.map(g),
          }
        }
        case isInterfaceNode(x): {
          const { directives, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map(g) },
            interfaces: x.interfaces.map(g),
            fields: x.fields.map(g),
          }
        }
        case isInputValueNode(x): {
          const { directives, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map(g) },
            type: g(x.type),
          }
        }
        case isInputObjectNode(x): {
          const { directives, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map(g) },
            fields: x.fields.map(g),
          }
        }
        case isFragmentDefinitionNode(x): {
          const { directives, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map(g) },
            selectionSet: g(x.selectionSet),
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
          const { directives, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map(g) },
            selectionSet: g(x.selectionSet),
          }
        }
        case isDirectiveNode(x): {
          const { arguments: args, ...xs } = x
          return {
            ...xs,
            ...args && { arguments: args.map(g) },
          }
        }

        case isOperationDefinitionNode(x): {
          const { directives, variableDefinitions: vars, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map(g) },
            ...vars && { variableDefinitions: vars.map(g) },
            selectionSet: g(x.selectionSet)
          }
        }
      }
    }
  },
  mapWithIndex(g) {
    return (x, _ix) => {
      const ix = isNonNullTypeNode(x) ? { isNonNull: true } satisfies Index : defaultIndex
      switch (true) {
        default: return fn.exhaustive(x)
        case isRefNode(x): return x
        case isNullaryNode(x): return x
        case isListNode(x): return { ...x, type: g(x.type, ix, x) }
        case isNonNullTypeNode(x): return { ...x, type: g(x.type, ix, x) }
        case isSelectionSetNode(x): return { ...x, selections: x.selections.map((_) => g(_, ix, x)) }
        case isDocumentNode(x): return { ...x, definitions: x.definitions.map((_) => g(_, ix, x)) }
        case isUnionNode(x): {
          const { directives, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map((_) => g(_, ix, x)) },
            types: x.types.map((_) => g(_, ix, x)),
          }
        }
        case isFieldNode(x): {
          const { arguments: args, directives, ...xs } = x
          return {
            ...xs,
            ...args && { arguments: args.map((_) => g(_, ix, x)) },
            ...directives && { directives: directives.map((_) => g(_, ix, x)) },
            type: g(x.type, isNonNullTypeNode(x.type) ? { isNonNull: true } : ix, x),
          }
        }
        case isObjectNode(x): {
          const { directives, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map((_) => g(_, ix, x)) },
            fields: x.fields.map((_) => g(_, ix, x)),
            interfaces: x.interfaces.map((_) => g(_, ix, x)),
          }
        }
        case isInterfaceNode(x): {
          const { directives, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map((_) => g(_, ix, x)) },
            fields: x.fields.map((_) => g(_, ix, x)),
            interfaces: x.interfaces.map((_) => g(_, ix, x)),
          }
        }
        case isInputValueNode(x): {
          const { directives, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map((_) => g(_, ix, x)) },
            type: g(x.type, ix, x),
          }
        }
        case isInputObjectNode(x): {
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
        case isOperationDefinitionNode(x): {
          const { directives, variableDefinitions: vars, ...xs } = x
          return {
            ...xs,
            ...directives && { directives: directives.map((_) => g(_, ix, x)) },
            ...vars && { variableDefinitions: vars.map((_) => g(_, ix, x)) },
            selectionSet: g(x.selectionSet, ix, x)
          }
        }
      }
    }
  }
}

export const fold: Fold = fn.catamorphism(Functor, defaultIndex) as never
