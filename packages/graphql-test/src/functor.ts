import type * as T from '@traversable/registry'
import { fn } from '@traversable/registry'

import type { Seed } from './generator-seed.js'
import { byTag } from './generator-seed.js'

export interface Index {}

export const defaultIndex = Object.create(null) satisfies Index

export const Functor: T.Functor.Ix<Index, Seed.Free, Seed.Fixpoint> = {
  map(g) {
    return (x) => {
      switch (true) {
        default: return x satisfies never
        case x[0] === byTag.Name: return x
        case x[0] === byTag.Boolean: return x
        case x[0] === byTag.BooleanValue: return x
        case x[0] === byTag.EnumValue: return x
        case x[0] === byTag.EnumValueDefinition: return x
        case x[0] === byTag.Float: return x
        case x[0] === byTag.FloatValue: return x
        case x[0] === byTag.ID: return x
        case x[0] === byTag.Int: return x
        case x[0] === byTag.IntValue: return x
        case x[0] === byTag.NamedType: return x
        case x[0] === byTag.Null: return x
        case x[0] === byTag.NullValue: return x
        case x[0] === byTag.Number: return x
        case x[0] === byTag.ScalarTypeDefinition: return x
        case x[0] === byTag.String: return x
        case x[0] === byTag.StringValue: return x
        case x[0] === byTag.ListValue: return x
        case x[0] === byTag.ObjectValue: return x
        case x[0] === byTag.ObjectField: return x
        case x[0] === byTag.ListType: return [x[0], g(x[1])]
        case x[0] === byTag.NonNullType: return [x[0], g(x[1])]
        case x[0] === byTag.SelectionSet: return [x[0], fn.map(x[1], g)]
        case x[0] === byTag.Argument: return [x[0], x[1], g(x[2])]
        case x[0] === byTag.Directive: return [x[0], x[1], fn.map(x[2], g)]
        case x[0] === byTag.DirectiveDefinition: return [x[0], x[1], x[2], x[3], x[4], fn.map(x[5], g)]
        case x[0] === byTag.Document: return [x[0], fn.map(x[1], g)]
        case x[0] === byTag.EnumTypeDefinition: return [x[0], x[1], x[2], x[3], fn.map(x[4], g)]
        case x[0] === byTag.Field: return [x[0], x[1], x[2], g(x[3]), fn.map(x[4], g), fn.map(x[5], g)]
        case x[0] === byTag.FieldDefinition: return [x[0], x[1], x[2], g(x[3]), fn.map(x[4], g), fn.map(x[5], g)]
        case x[0] === byTag.FragmentDefinition: return [x[0], x[1], x[2], g(x[3]), fn.map(x[4], g)]
        case x[0] === byTag.FragmentSpread: return [x[0], x[1], fn.map(x[2], g)]
        case x[0] === byTag.InlineFragment: return [x[0], x[1], g(x[2]), fn.map(x[3], g)]
        case x[0] === byTag.InputValueDefinition: return [x[0], x[1], x[2], g(x[3]), g(x[4]), fn.map(x[5], g)]
        case x[0] === byTag.InputObjectTypeDefinition: return [x[0], x[1], x[2], fn.map(x[3], g), fn.map(x[4], g)]
        case x[0] === byTag.InterfaceTypeDefinition: return [x[0], x[1], x[2], fn.map(x[3], g), fn.map(x[4], g), fn.map(x[5], g)]
        case x[0] === byTag.ObjectTypeDefinition: return [x[0], x[1], x[2], fn.map(x[3], g), fn.map(x[4], g), fn.map(x[5], g)]
        case x[0] === byTag.OperationDefinition: return [x[0], x[1], x[2], g(x[3]), fn.map(x[4], g), fn.map(x[5], g)]
        case x[0] === byTag.OperationTypeDefinition: return [x[0], x[1], g(x[2])]
        case x[0] === byTag.SchemaDefinition: return [x[0], x[1], fn.map(x[2], ([n, o]) => [n, g(o)] as const), fn.map(x[3], g)]
        case x[0] === byTag.UnionTypeDefinition: return [x[0], x[1], fn.map(x[2], g), fn.map(x[3], g)]
        case x[0] === byTag.Variable: return [x[0], x[1], x[2], fn.map(x[3], g)]
        case x[0] === byTag.VariableDefinition: return [x[0], x[1], g(x[2]), g(x[3]), fn.map(x[4], g)]
        // case x[0] === byTag.SchemaExtension: return [x[0], fn.map(x[1], g), fn.map(x[2], g)]
      }
    }
  },
  mapWithIndex(g) {
    return (x, ix) => {
      switch (true) {
        default: return x satisfies never
        case x[0] === byTag.Name: return x
        case x[0] === byTag.Boolean: return x
        case x[0] === byTag.BooleanValue: return x
        case x[0] === byTag.EnumValue: return x
        case x[0] === byTag.EnumValueDefinition: return x
        case x[0] === byTag.Float: return x
        case x[0] === byTag.FloatValue: return x
        case x[0] === byTag.ID: return x
        case x[0] === byTag.Int: return x
        case x[0] === byTag.IntValue: return x
        case x[0] === byTag.NamedType: return x
        case x[0] === byTag.Null: return x
        case x[0] === byTag.NullValue: return x
        case x[0] === byTag.Number: return x
        case x[0] === byTag.ScalarTypeDefinition: return x
        case x[0] === byTag.String: return x
        case x[0] === byTag.StringValue: return x
        case x[0] === byTag.ListValue: return x
        case x[0] === byTag.ObjectValue: return x
        case x[0] === byTag.ObjectField: return x
        case x[0] === byTag.ListType: return [x[0], g(x[1], ix, x)]
        case x[0] === byTag.NonNullType: return [x[0], g(x[1], ix, x)]
        case x[0] === byTag.SelectionSet: return [x[0], fn.map(x[1], (_) => g(_, ix, x))]
        case x[0] === byTag.Argument: return [x[0], x[1], g(x[2], ix, x)]
        case x[0] === byTag.Directive: return [x[0], x[1], fn.map(x[2], (_) => g(_, ix, x))]
        case x[0] === byTag.DirectiveDefinition: return [x[0], x[1], x[2], x[3], x[4], fn.map(x[5], (_) => g(_, ix, x))]
        case x[0] === byTag.Document: return [x[0], fn.map(x[1], (_) => g(_, ix, x))]
        case x[0] === byTag.EnumTypeDefinition: return [x[0], x[1], x[2], x[3], fn.map(x[4], (_) => g(_, ix, x))]
        case x[0] === byTag.Field: return [x[0], x[1], x[2], g(x[3], ix, x), fn.map(x[4], (_) => g(_, ix, x)), fn.map(x[5], (_) => g(_, ix, x))]
        case x[0] === byTag.FieldDefinition: return [x[0], x[1], x[2], g(x[3], ix, x), fn.map(x[4], (_) => g(_, ix, x)), fn.map(x[5], (_) => g(_, ix, x))]
        case x[0] === byTag.FragmentDefinition: return [x[0], x[1], x[2], g(x[3], ix, x), fn.map(x[4], (_) => g(_, ix, x))]
        case x[0] === byTag.FragmentSpread: return [x[0], x[1], fn.map(x[2], (_) => g(_, ix, x))]
        case x[0] === byTag.InlineFragment: return [x[0], x[1], g(x[2], ix, x), fn.map(x[3], (_) => g(_, ix, x))]
        case x[0] === byTag.InputValueDefinition: return [x[0], x[1], x[2], g(x[3], ix, x), g(x[4], ix, x), fn.map(x[5], (_) => g(_, ix, x))]
        case x[0] === byTag.InputObjectTypeDefinition: return [x[0], x[1], x[2], fn.map(x[3], (_) => g(_, ix, x)), fn.map(x[4], (_) => g(_, ix, x))]
        case x[0] === byTag.InterfaceTypeDefinition: return [x[0], x[1], x[2], fn.map(x[3], (_) => g(_, ix, x)), fn.map(x[4], (_) => g(_, ix, x)), fn.map(x[5], (_) => g(_, ix, x))]
        case x[0] === byTag.ObjectTypeDefinition: return [x[0], x[1], x[2], fn.map(x[3], (_) => g(_, ix, x)), fn.map(x[4], (_) => g(_, ix, x)), fn.map(x[5], (_) => g(_, ix, x))]
        case x[0] === byTag.OperationDefinition: return [x[0], x[1], x[2], g(x[3], ix, x), fn.map(x[4], (_) => g(_, ix, x)), fn.map(x[5], (_) => g(_, ix, x))]
        case x[0] === byTag.OperationTypeDefinition: return [x[0], x[1], g(x[2], ix, x)]
        case x[0] === byTag.SchemaDefinition: return [x[0], x[1], fn.map(x[2], ([n, o]) => [n, g(o, ix, x)] as const), fn.map(x[3], (_) => g(_, ix, x))]
        case x[0] === byTag.UnionTypeDefinition: return [x[0], x[1], fn.map(x[2], (_) => g(_, ix, x)), fn.map(x[3], (_) => g(_, ix, x))]
        case x[0] === byTag.Variable: return [x[0], x[1], x[2], fn.map(x[3], (_) => g(_, ix, x))]
        case x[0] === byTag.VariableDefinition: return [x[0], x[1], g(x[2], ix, x), g(x[3], ix, x), fn.map(x[4], (_) => g(_, ix, x))]
        // case x[0] === byTag.SchemaExtension: return [x[0], fn.map(x[1], (_) => g(_, ix, x)), fn.map(x[2], (_) => g(_, ix, x))]
      }
    }
  }
}

export const fold = fn.catamorphism(Functor, defaultIndex)
