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
interface Ref {
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

export function isScalar(x: unknown): x is Scalar {
  return has('kind', (kind) => kind === 'ScalarTypeDefinition')(x)
}

export function isBoolean(x: unknown): x is Boolean {
  return has('name', 'value', (value) => value === 'Boolean')(x)
}

export function isInt(x: unknown): x is Int {
  return has('name', 'value', (value) => value === 'Int')(x)
}

export function isNumber(x: unknown): x is Number {
  return has('name', 'value', (value) => value === 'Number')(x)
}

export function isFloat(x: unknown): x is Float {
  return has('name', 'value', (value) => value === 'Float')(x)
}

export function isString(x: unknown): x is String {
  return has('name', 'value', (value) => value === 'String')(x)
}

export function isID(x: unknown): x is ID {
  return has('name', 'value', (value) => value === 'ID')(x)
}

export function isEnum(x: unknown): x is Enum {
  return has('name', 'value', (value) => value === 'ID')(x)
}

export function isNonNull<T>(x: unknown): x is NonNull<T> {
  return has('kind', (kind) => kind === 'NonNullType')(x)
}

export function isList<T>(x: unknown): x is List<T> {
  return has('kind', (kind) => kind === 'ListType')(x)
}

export function isField<T>(x: unknown): x is Field<T> {
  return has('kind', (kind) => kind === 'FieldDefinition')(x)
}

export function isObject<T>(x: unknown): x is Object<T> {
  return has('kind', (kind) => kind === 'ObjectTypeDefinition')(x)
}

export function isInterface<T>(x: unknown): x is Interface<T> {
  return has('kind', (kind) => kind === 'InterfaceTypeDefinition')(x)
}

export function isUnion<T>(x: unknown): x is Union<T> {
  return has('kind', (kind) => kind === 'UnionTypeDefinition')(x)
}

export function isInputValue<T>(x: unknown): x is InputValue<T> {
  return has('kind', (kind) => kind === 'InputValueDefinition')(x)
}

export function isInputObject<T>(x: unknown): x is InputObject<T> {
  return has('kind', (kind) => kind === 'InputObjectTypeDefinition')(x)
}

export function isDocument<T>(x: unknown): x is Document<T> {
  return has('kind', (kind) => kind === 'Document')(x)
}

export function isNullary(x: unknown): x is Nullary {
  return isScalar(x)
    || isBoolean(x)
    || isInt(x)
    || isNumber(x)
    || isFloat(x)
    || isString(x)
    || isID(x)
    || isEnum(x)
}

export function isNamed(x: unknown): x is Named {
  return has('name', 'value', (value) => typeof value === 'string')(x)
}

export function isRef(x: unknown): x is Ref {
  return has('kind', (kind) => kind === 'NamedType')(x)
    && has('name', 'value', (value) => typeof value === 'string')(x)
    && !isNullary(x)
}

export function isUnary<T>(x: unknown): x is Unary<T> {
  return isNonNull(x)
    || isList(x)
    || isObject(x)
    || isInterface(x)
    || isUnion(x)
    || isInputObject(x)
}

export const defaultIndex = { isNonNull: false } satisfies Index

export interface Index {
  isNonNull: boolean
}

export type Algebra<T> = {
  (src: F<T>, ix?: Index): T
  (src: Fixpoint, ix?: Index): T
  (src: F<T>, ix?: Index): T
}

export type Fold = <T>(g: (src: F<T>, ix: Index, x: Fixpoint) => T) => Algebra<T>

export interface Functor extends T.HKT { [-1]: F<this[0]> }

export declare namespace Functor {
  export { Index }
}

export const Functor: T.Functor.Ix<Functor.Index, Functor> = {
  map(g) {
    return (x) => {
      switch (true) {
        default: return x
        case isRef(x): return x
        case isNullary(x): return x
        case isNonNull(x): return { ...x, type: g(x.type) }
        case isList(x): return { ...x, type: g(x.type) }
        case isUnion(x): return { ...x, directives: x.directives.map(g), types: x.types.map(g) }
        case isField(x): return { ...x, type: g(x.type), arguments: x.arguments.map(g), directives: x.directives.map(g) }
        case isObject(x): return { ...x, directives: x.directives.map(g), interfaces: x.interfaces.map(g), fields: x.fields.map(g) }
        case isInterface(x): return { ...x, directives: x.directives.map(g), interfaces: x.interfaces.map(g), fields: x.fields.map(g) }
        case isInputValue(x): return { ...x, type: g(x.type), directives: x.directives.map(g) }
        case isInputObject(x): return { ...x, directives: x.directives.map(g), fields: x.fields.map(g) }
        case isDocument(x): return { ...x, definitions: x.definitions.map(g) }
      }
    }
  },
  mapWithIndex(g) {
    return (x, _ix) => {
      const ix = isNonNull(x) ? { isNonNull: true } satisfies Index : defaultIndex
      switch (true) {
        default: return x
        case isRef(x): return x
        case isNullary(x): return x
        case isNonNull(x): return { ...x, type: g(x.type, ix, x) }
        case isList(x): return { ...x, type: g(x.type, ix, x) }
        case isUnion(x): return {
          ...x,
          directives: x.directives.map((_) => g(_, ix, x)),
          types: x.types.map((_) => g(_, ix, x))
        }
        case isField(x): {
          return {
            ...x,
            type: g(x.type, isNonNull(x.type) ? { isNonNull: true } : ix, x),
            arguments: x.arguments.map((_) => g(_, ix, x)),
            directives: x.directives.map((_) => g(_, ix, x)),
          }
        }
        case isObject(x): return {
          ...x,
          directives: x.directives.map((_) => g(_, ix, x)),
          fields: x.fields.map((_) => g(_, ix, x)),
          interfaces: x.interfaces.map((_) => g(_, ix, x)),
        }
        case isInterface(x): return {
          ...x,
          directives: x.directives.map((_) => g(_, ix, x)),
          fields: x.fields.map((_) => g(_, ix, x)),
          interfaces: x.interfaces.map((_) => g(_, ix, x)),
        }
        case isInputValue(x): return {
          ...x,
          type: g(x.type, ix, x),
          directives: x.directives.map((_) => g(_, ix, x)),
        }
        case isInputObject(x): return {
          ...x,
          directives: x.directives.map((_) => g(_, ix, x)),
          fields: x.fields.map((_) => g(_, ix, x)),
        }
        case isDocument(x): return {
          ...x,
          definitions: x.definitions.map((_) => g(_, ix, x)),
        }
      }
    }
  }
}

export const fold: Fold = fn.catamorphism(Functor, defaultIndex) as never
