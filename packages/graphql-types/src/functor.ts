import type * as T from '@traversable/registry'
import { fn, has } from '@traversable/registry'

// interface Query<T> {
//   kind: 'OperationDefinition'
//   operation: 'query'
//   name: Name
//   variableDefinitions: readonly VariableDefinition<T>[],
//   directives: readonly T[]
//   selectionSet: {
//     kind: 'SelectionSet'
//     selections: [
//     ],
//   }
// }

export declare namespace AST {
  export interface Name<Value = string> {
    kind: 'Name'
    value: Value
  }

  export interface Named {
    name: Name
  }

  /**
   * ## {@link Ref `Ref`}
   * 
   * A {@link Ref `Ref`} is a named type that is not one of the built-in types.
   */
  export interface Ref {
    kind: 'NamedType'
    name: Name
  }

  export interface Document<T> {
    kind: 'Document'
    definitions: readonly T[]
  }

  export interface InputValue<T> {
    kind: 'InputValueDefinition'
    name: Name
    type: T
    directives: readonly T[]
  }

  export interface InputObject<T> {
    kind: 'InputObjectTypeDefinition'
    name: Name
    fields: readonly T[]
    directives: readonly T[]
  }

  export interface Variable {
    kind: 'Variable'
    name: Name
  }

  export interface VariableDefinition<T> {
    kind: 'VariableDefinition'
    variable: Variable
    type: T
    directives: readonly T[]
  }

  export type Nullary =
    | Boolean
    | Int
    | Number
    | Float
    | String
    | ID
    | Scalar
    | Enum

  export interface Scalar {
    kind: 'ScalarTypeDefinition'
    name: Name
  }


  export interface Boolean {
    kind: 'NamedType'
    name: Name<'Boolean'>
  }

  export interface Int {
    kind: 'NamedType'
    name: Name<'Int'>
  }

  export interface Number {
    kind: 'NamedType'
    name: Name<'Number'>
  }

  export interface Float {
    kind: 'NamedType'
    name: Name<'Float'>
  }

  export interface String {
    kind: 'NamedType'
    name: Name<'String'>
  }

  export interface ID {
    kind: 'NamedType'
    name: Name<'ID'>
  }

  export interface EnumValue {
    kind: 'EnumValueDefinition'
    name: Name
  }

  export interface Enum {
    kind: 'EnumTypeDefinition'
    name: Name
    values: readonly EnumValue[]
  }

  export interface NonNull<T> {
    kind: 'NonNullType'
    type: T
  }

  export interface List<T> {
    kind: 'ListType'
    type: T
  }

  export interface Field<T> {
    kind: 'FieldDefinition'
    name: Name
    type: T
    defaultValue?: unknown
    arguments: readonly T[]
    directives: readonly T[]
  }

  export interface Object<T> {
    kind: 'ObjectTypeDefinition'
    name: Name
    fields: readonly T[]
    interfaces: readonly T[]
    directives: readonly T[]
  }

  export interface Interface<T> {
    kind: 'InterfaceTypeDefinition'
    name: Name
    fields: readonly T[]
    interfaces: readonly T[]
    directives: readonly T[]
  }

  export interface Union<T> {
    kind: 'UnionTypeDefinition'
    name: Name
    types: readonly T[]
    directives: readonly T[]
  }

  export type Unary<T> =
    | NonNull<T>
    | List<T>
    | Field<T>
    | Object<T>
    | Interface<T>
    | Union<T>
    | InputValue<T>
    | InputObject<T>
    | Document<T>

  export type Fixpoint =
    | Nullary
    | Ref
    | NonNull<Fixpoint>
    | List<Fixpoint>
    | Field<Fixpoint>
    | Object<Fixpoint>
    | Interface<Fixpoint>
    | Union<Fixpoint>
    | InputValue<Fixpoint>
    | InputObject<Fixpoint>
    | Document<Fixpoint>

  export type F<T> =
    | Nullary
    | Ref
    | Unary<T>
}

export function isScalarNode(x: unknown): x is AST.Scalar {
  return has('kind', (kind) => kind === 'ScalarTypeDefinition')(x)
}

export function isBooleanNode(x: unknown): x is AST.Boolean {
  return has('name', 'value', (value) => value === 'Boolean')(x)
}

export function isIntNode(x: unknown): x is AST.Int {
  return has('name', 'value', (value) => value === 'Int')(x)
}

export function isNumberNode(x: unknown): x is AST.Number {
  return has('name', 'value', (value) => value === 'Number')(x)
}

export function isFloatNode(x: unknown): x is AST.Float {
  return has('name', 'value', (value) => value === 'Float')(x)
}

export function isStringNode(x: unknown): x is AST.String {
  return has('name', 'value', (value) => value === 'String')(x)
}

export function isIDNode(x: unknown): x is AST.ID {
  return has('name', 'value', (value) => value === 'ID')(x)
}

export function isEnumNode(x: unknown): x is AST.Enum {
  return has('name', 'value', (value) => value === 'ID')(x)
}

export function isNonNullNode<T>(x: unknown): x is AST.NonNull<T> {
  return has('kind', (kind) => kind === 'NonNullType')(x)
}

export function isListNode<T>(x: unknown): x is AST.List<T> {
  return has('kind', (kind) => kind === 'ListType')(x)
}

export function isFieldNode<T>(x: unknown): x is AST.Field<T> {
  return has('kind', (kind) => kind === 'FieldDefinition')(x)
}

export function isObjectNode<T>(x: unknown): x is AST.Object<T> {
  return has('kind', (kind) => kind === 'ObjectTypeDefinition')(x)
}

export function isInterfaceNode<T>(x: unknown): x is AST.Interface<T> {
  return has('kind', (kind) => kind === 'InterfaceTypeDefinition')(x)
}

export function isUnionNode<T>(x: unknown): x is AST.Union<T> {
  return has('kind', (kind) => kind === 'UnionTypeDefinition')(x)
}

export function isInputValueNode<T>(x: unknown): x is AST.InputValue<T> {
  return has('kind', (kind) => kind === 'InputValueDefinition')(x)
}

export function isInputObjectNode<T>(x: unknown): x is AST.InputObject<T> {
  return has('kind', (kind) => kind === 'InputObjectTypeDefinition')(x)
}

export function isDocumentNode<T>(x: unknown): x is AST.Document<T> {
  return has('kind', (kind) => kind === 'Document')(x)
}

export function isNullaryNode(x: unknown): x is AST.Nullary {
  return isScalarNode(x)
    || isBooleanNode(x)
    || isIntNode(x)
    || isNumberNode(x)
    || isFloatNode(x)
    || isStringNode(x)
    || isIDNode(x)
    || isEnumNode(x)
}

export function isNamedNode(x: unknown): x is AST.Named {
  return has('name', 'value', (value) => typeof value === 'string')(x)
}

export function isRefNode(x: unknown): x is AST.Ref {
  return has('kind', (kind) => kind === 'NamedType')(x)
    && has('name', 'value', (value) => typeof value === 'string')(x)
    && !isNullaryNode(x)
}

export function isUnaryNode<T>(x: unknown): x is AST.Unary<T> {
  return isNonNullNode(x)
    || isListNode(x)
    || isObjectNode(x)
    || isInterfaceNode(x)
    || isUnionNode(x)
    || isInputObjectNode(x)
}

export const defaultIndex = { isNonNull: false } satisfies Index

export interface Index {
  isNonNull: boolean
}

export type Algebra<T> = {
  (src: AST.F<T>, ix?: Index): T
  (src: AST.Fixpoint, ix?: Index): T
  (src: AST.F<T>, ix?: Index): T
}

export type Fold = <T>(g: (src: AST.F<T>, ix: Index, x: AST.Fixpoint) => T) => Algebra<T>

export interface Functor extends T.HKT { [-1]: AST.F<this[0]> }

export declare namespace Functor {
  export { Index }
}

export const Functor: T.Functor.Ix<Functor.Index, Functor> = {
  map(g) {
    return (x) => {
      switch (true) {
        default: return x
        case isRefNode(x): return x
        case isNullaryNode(x): return x
        case isNonNullNode(x): return { ...x, type: g(x.type) }
        case isListNode(x): return { ...x, type: g(x.type) }
        case isUnionNode(x): return { ...x, directives: x.directives.map(g), types: x.types.map(g) }
        case isFieldNode(x): return { ...x, type: g(x.type), arguments: x.arguments.map(g), directives: x.directives.map(g) }
        case isObjectNode(x): return { ...x, directives: x.directives.map(g), interfaces: x.interfaces.map(g), fields: x.fields.map(g) }
        case isInterfaceNode(x): return { ...x, directives: x.directives.map(g), interfaces: x.interfaces.map(g), fields: x.fields.map(g) }
        case isInputValueNode(x): return { ...x, type: g(x.type), directives: x.directives.map(g) }
        case isInputObjectNode(x): return { ...x, directives: x.directives.map(g), fields: x.fields.map(g) }
        case isDocumentNode(x): return { ...x, definitions: x.definitions.map(g) }
      }
    }
  },
  mapWithIndex(g) {
    return (x, _ix) => {
      const ix = isNonNullNode(x) ? { isNonNull: true } satisfies Index : defaultIndex
      switch (true) {
        default: return x
        case isRefNode(x): return x
        case isNullaryNode(x): return x
        case isNonNullNode(x): return { ...x, type: g(x.type, ix, x) }
        case isListNode(x): return { ...x, type: g(x.type, ix, x) }
        case isUnionNode(x): return {
          ...x,
          directives: x.directives.map((_) => g(_, ix, x)),
          types: x.types.map((_) => g(_, ix, x))
        }
        case isFieldNode(x): {
          return {
            ...x,
            type: g(x.type, isNonNullNode(x.type) ? { isNonNull: true } : ix, x),
            arguments: x.arguments.map((_) => g(_, ix, x)),
            directives: x.directives.map((_) => g(_, ix, x)),
          }
        }
        case isObjectNode(x): return {
          ...x,
          directives: x.directives.map((_) => g(_, ix, x)),
          fields: x.fields.map((_) => g(_, ix, x)),
          interfaces: x.interfaces.map((_) => g(_, ix, x)),
        }
        case isInterfaceNode(x): return {
          ...x,
          directives: x.directives.map((_) => g(_, ix, x)),
          fields: x.fields.map((_) => g(_, ix, x)),
          interfaces: x.interfaces.map((_) => g(_, ix, x)),
        }
        case isInputValueNode(x): return {
          ...x,
          type: g(x.type, ix, x),
          directives: x.directives.map((_) => g(_, ix, x)),
        }
        case isInputObjectNode(x): return {
          ...x,
          directives: x.directives.map((_) => g(_, ix, x)),
          fields: x.fields.map((_) => g(_, ix, x)),
        }
        case isDocumentNode(x): return {
          ...x,
          definitions: x.definitions.map((_) => g(_, ix, x)),
        }
      }
    }
  }
}

export const fold: Fold = fn.catamorphism(Functor, defaultIndex) as never
