import type * as gql from 'graphql'
import * as fc from 'fast-check'

import type { inline } from '@traversable/registry'
import {
  Array_isArray,
  fn,
  has,
  isKeyOf,
  Number_isFinite,
  Number_isSafeInteger,
  Object_assign,
  Object_entries,
  omit,
  PATTERN,
  pick,
} from '@traversable/registry'
import { Json } from '@traversable/json'

import { Config } from './generator-options.js'
import * as Bounds from './generator-bounds.js'

import { AST, Kind, NamedType, OperationType } from '@traversable/graphql-types'

import type { Tag } from './generator-seed.js'
import { bySeed, Seed } from './generator-seed.js'
import { fold } from './functor.js'

const identifier = fc.stringMatching(new RegExp(PATTERN.identifier, 'u'))

const nameNode = <T extends string>(name: T): AST.NameNode<T> => ({
  kind: 'Name',
  value: name,
})

const namedTypeNode = <T extends string>(name: T) => ({
  kind: Kind.NamedType,
  name: nameNode(name),
}) satisfies AST.NamedTypeNode

const nullValueNode = () => ({
  kind: Kind.NullValue,
}) satisfies AST.NullValueNode

const booleanValueNode = (value: boolean) => ({
  kind: Kind.BooleanValue,
  value,
}) satisfies AST.BooleanValueNode

const intValueNode = (value: number) => ({
  kind: Kind.IntValue,
  value,
}) satisfies AST.IntValueNode

const floatValueNode = (value: number) => ({
  kind: Kind.FloatValue,
  value,
}) satisfies AST.FloatValueNode

const stringValueNode = (value: string, block?: boolean) => ({
  kind: Kind.StringValue,
  value,
  block: block ?? new RegExp(PATTERN.newline).test(value),
}) satisfies AST.StringValueNode

const listValueNode = (values: readonly AST.ValueNode[]) => ({
  kind: Kind.ListValue,
  values,
}) satisfies AST.ListValueNode

const objectFieldNodes = (fields: { [x: string]: Json }) => Object_entries(fields).map(
  ([k, json]) => ({
    kind: Kind.ObjectField,
    name: nameNode(k),
    value: valueNodeFromJson(json),
  })
) satisfies AST.ObjectFieldNode[]

const variableNode = (name: string): AST.VariableNode => ({
  kind: Kind.Variable,
  name: nameNode(name),
})

const enumValueDefinition = (name: string): AST.EnumValueDefinitionNode => ({
  kind: Kind.EnumValueDefinition,
  name: nameNode(name),
})

const operationTypeDefinition = (name: string, operation: OperationType): AST.OperationTypeDefinitionNode => ({
  kind: Kind.OperationTypeDefinition,
  type: namedTypeNode(name),
  operation,
})

const valueNodeFromJson = Json.fold<AST.ValueNode>((x) => {
  switch (true) {
    default: return x satisfies never
    case x == null: return nullValueNode()
    case x === true:
    case x === false: return booleanValueNode(x)
    case Number_isSafeInteger(x): return intValueNode(x)
    case Number_isFinite(x): return floatValueNode(x)
    case typeof x === 'string': return stringValueNode(x)
    case Array_isArray(x): return listValueNode(x)
    case !!x && typeof x === 'object': return {
      kind: Kind.ObjectValue,
      fields: Object_entries(x).map(([k, v]) => ({
        kind: Kind.ObjectField,
        name: nameNode(k),
        value: v,
      }))
    }
  }
})

export function pickAndSortNodes<K extends keyof any>(nodes: readonly ([K, fc.Arbitrary<unknown>])[]): <T>($: Config<T>) => K[] {
  return ({ include, exclude, sortBias }) => nodes
    .map(([k]) => k)
    .filter((x) =>
      (include ? include.includes(x as never) : true) &&
      (exclude ? !exclude.includes(x as never) : true)
    )
    .sort((lk, rk) => {
      if (
        has(lk, (bias) => typeof bias === 'number')(sortBias) &&
        has(rk, (bias) => typeof bias === 'number')(sortBias)
      ) {
        return sortBias[lk] < sortBias[rk] ? -1 : sortBias[lk] > sortBias[rk] ? 1 : 0
      } else {
        return 0
      }
    })
}

export declare namespace Gen {
  type Base<T, $> = { [K in keyof T]: (tie: fc.LetrecLooselyTypedTie, constraints: $) => fc.Arbitrary<T[K]> }
  type Values<T, OmitKeys extends keyof any = never> = never | T[Exclude<keyof T, OmitKeys>]
  type InferArb<S> = S extends fc.Arbitrary<infer T> ? T : never
  type Builder<T extends {}> = T & BuilderStar
  interface BuilderStar { ['*']: fc.Arbitrary<InferArb<Values<this, '*' | 'root'>>> }
  type BuildBuilder<T, Options extends Config.Options<T>, Out extends {} = BuilderBase<T, Options>> = never | Builder<Out>
  type BuilderBase<T, Options extends Config.Options<T>, $ extends ParseOptions<T, Options> = ParseOptions<T, Options>> = never |
    & ([$['root']] extends [never] ? unknown : { root: fc.Arbitrary<$['root']> })
    & { [K in Exclude<$['include'], $['exclude']>]: fc.Arbitrary<T[K]> }
  type ParseOptions<T, Options extends Config.Options<T>> = never | {
    include: Options['include'] extends readonly unknown[] ? Options['include'][number] : keyof T
    exclude: Options['exclude'] extends readonly unknown[] ? Options['exclude'][number] : never
    root: Options['root'] extends keyof T ? T[Options['root']] : never
  }
}

export function Gen<T>(base: Gen.Base<T, Config<Seed>>):
  <Options extends Config.Options<T>>(
    options?: Options,
    overrides?: Partial<Gen.Base<T, Config<Seed>>>
  ) => Gen.BuildBuilder<T, Options>

export function Gen<T>(base: Gen.Base<T, Config<Seed>>) {
  return <Options extends Config.Options<T>>(
    options?: Options,
    overrides?: Partial<Gen.Base<T, Config<Seed>>>
  ): Builder => {
    return fc.letrec(Builder(base)(options, overrides))
  }
}

export interface Builder extends inline<{ [K in Tag]+?: fc.Arbitrary<unknown> }> {
  root?: fc.Arbitrary<unknown>
  ['*']: fc.Arbitrary<unknown>
}

export function Builder<T>(base: Gen.Base<T, Config<Seed>>):
  <Options extends Config.Options<T>>(
    options?: Options,
    overrides?: Partial<Gen.Base<T, Config<Seed>>>
  ) => (tie: fc.LetrecLooselyTypedTie) => Builder

export function Builder<T>(base: Gen.Base<Seed, Config<Seed>>) {
  return (options?: Config.Options<Seed>, overrides?: Partial<Gen.Base<object, object>>) => {
    const $ = Config.parseOptions(options)
    return (tie: fc.LetrecLooselyTypedTie) => {
      const builder = fn.pipe(
        { ...base, ...overrides },
        (x) => pick(x, $.include),
        (x) => omit(x, $.exclude as []),
        (x) => fn.map(x, (f) => f(tie, $)),
      )
      const nodes = pickAndSortNodes(Object_entries(builder))($)
      const star = fc.oneof(...fn.map(nodes, (k) => builder[k]))

      return Object_assign(
        builder,
        { ['*']: star }
      )
    }
  }
}

const SchemaMap = {
  Name: ([, name]) => nameNode(name),
  Null: (_) => namedTypeNode(NamedType.Null),
  Boolean: (_) => namedTypeNode(NamedType.Boolean),
  Int: (_) => namedTypeNode(NamedType.Int),
  Float: (_) => namedTypeNode(NamedType.Float),
  Number: (_) => namedTypeNode(NamedType.Number),
  String: (_) => namedTypeNode(NamedType.String),
  ID: (_) => namedTypeNode(NamedType.ID),
  NullValue: (_) => ({ kind: Kind.NullValue }),
  BooleanValue: ([, value]) => ({
    kind: Kind.BooleanValue,
    value,
  }),
  FloatValue: ([, value]) => ({
    kind: Kind.FloatValue,
    value,
  }),
  IntValue: ([, value]) => ({
    kind: Kind.IntValue,
    value,
  }),
  StringValue: ([, value, block]) => ({
    kind: Kind.StringValue,
    value,
    block,
  }),
  ScalarTypeDefinition: ([, name, description]) => ({
    kind: Kind.ScalarTypeDefinition,
    name: nameNode(name),
    ...description && { description: stringValueNode(...description) },
  }),
  EnumValue: ([, value]) => ({
    kind: Kind.EnumValue,
    value,
  }),
  EnumValueDefinition: ([, name]) => ({
    kind: Kind.EnumValueDefinition,
    name: nameNode(name),
  }),
  ListValue: ([, values]) => ({
    kind: Kind.ListValue,
    values: values.map((value) => valueNodeFromJson(value)),
  }),
  ObjectValue: ([, fields]) => ({
    kind: Kind.ObjectValue,
    fields: fields.map(([name, value]) => ({
      kind: Kind.ObjectField,
      name: nameNode(name),
      value: valueNodeFromJson(value),
    }))
  }),
  Argument: ([, name, value]) => ({
    kind: Kind.Argument,
    name: nameNode(name),
    value,
  }),
  Document: ([, definitions]) => ({
    kind: Kind.Document,
    definitions
  }),
  Directive: ([__kind, name, args]) => ({
    kind: Kind.Directive,
    name: nameNode(name),
    arguments: args,
  }),
  DirectiveDefinition: ([, name, description, repeatable, locations, args]) => ({
    kind: Kind.DirectiveDefinition,
    name: nameNode(name),
    repeatable,
    locations: locations.map((location) => nameNode(location)),
    ...description && { description: stringValueNode(...description) },
    ...args.length && { arguments: args },
  }),
  EnumTypeDefinition: ([, name, description, values]) => ({
    kind: Kind.EnumTypeDefinition,
    name: nameNode(name),
    values: values.map(enumValueDefinition),
    ...description && { description: stringValueNode(...description) },
  }),
  Field: ([, name, alias, selectionSet, args, directives]) => ({
    kind: Kind.Field,
    name: nameNode(name),
    alias: nameNode(alias),
    ...selectionSet !== null && { selectionSet },
    ...args.length && { arguments: args },
    ...directives.length && { directives },
  }),
  FieldDefinition: ([, name, description, type, args, directives]) => ({
    kind: Kind.FieldDefinition,
    name: nameNode(name),
    type,
    ...description && { description: stringValueNode(...description) },
    ...args.length && { arguments: args },
    ...directives.length && { directives },
  }),
  FragmentDefinition: ([, name, typeCondition, selectionSet, directives]) => ({
    kind: Kind.FragmentDefinition,
    name: nameNode(name),
    typeCondition: namedTypeNode(typeCondition),
    selectionSet,
    ...directives.length && { directives },
  }),
  FragmentSpread: ([, name, directives]) => ({
    kind: Kind.FragmentSpread,
    name: nameNode(name),
    ...directives.length && { directives },
  }),
  InlineFragment: ([, typeCondition, selectionSet, directives]) => ({
    kind: Kind.InlineFragment,
    selectionSet,
    typeCondition: namedTypeNode(typeCondition),
    ...directives.length && { directives },
  }),
  InputObjectTypeDefinition: ([, name, description, fields, directives]) => ({
    kind: Kind.InputObjectTypeDefinition,
    name: nameNode(name),
    fields,
    ...description && { description: stringValueNode(...description) },
    ...directives.length && { directives },
  }),
  InputValueDefinition: ([, name, description, type, defaultValue, directives]) => ({
    kind: Kind.InputValueDefinition,
    name: nameNode(name),
    type,
    ...defaultValue != null && { defaultValue },
    ...description && { description: stringValueNode(...description) },
    ...directives.length && { directives },
  }),
  InterfaceTypeDefinition: ([, name, description, fields, interfaces, directives]) => ({
    kind: Kind.InterfaceTypeDefinition,
    name: nameNode(name),
    fields,
    interfaces,
    ...description && { description: stringValueNode(...description) },
    ...directives.length && { directives },
  }),
  ListType: ([, type]) => ({
    kind: Kind.ListType,
    type,
  }),
  NamedType: ([, name]) => ({
    kind: Kind.NamedType,
    name: nameNode(name as never), // <-- TODO
  }),
  NonNullType: ([, type]) => ({
    kind: Kind.NonNullType,
    type,
  }),
  ObjectField: ([, name, value]) => ({
    kind: Kind.ObjectField,
    name: nameNode(name),
    value: value as AST.ValueNode, // <-- TODO
    // value: valueNodeFromJson(value),
  }),
  ObjectTypeDefinition: ([, name, description, fields, interfaces, directives]) => ({
    kind: Kind.ObjectTypeDefinition,
    name: nameNode(name),
    fields,
    interfaces,
    ...description && { description: stringValueNode(...description) },
    ...directives.length && { directives },
  }),
  OperationDefinition: ([, name, operationType, selectionSet, variableDefinitions, directives]) => ({
    kind: Kind.OperationDefinition,
    name: nameNode(name), // <-- TODO: optional?
    operation: operationType,
    selectionSet,
    ...variableDefinitions.length && { variableDefinitions },
    ...directives.length && { directives },
  }),
  OperationTypeDefinition: ([, type, operation]) => ({
    kind: Kind.OperationTypeDefinition,
    type: namedTypeNode(type),
    operation,
  }),
  SchemaDefinition: ([, _, description, operationTypes, directives]) => ({
    kind: Kind.SchemaDefinition,
    operationTypes: operationTypes.map(([, name, operationType]) => operationTypeDefinition(name, operationType)),
    ...description && { description: stringValueNode(...description) },
    ...directives.length && { directives },
  }),
  SelectionSet: ([, selections]) => ({
    kind: Kind.SelectionSet,
    selections,
  }),
  UnionTypeDefinition: ([, name, types, directives]) => ({
    kind: Kind.UnionTypeDefinition,
    name: nameNode(name),
    types,
    ...directives.length && { directives },
  }),
  Variable: ([, name, description]) => ({
    kind: Kind.Variable,
    name: nameNode(name),
    ...description && { description: stringValueNode(...description) },
  }),
  VariableDefinition: ([, name, type, defaultValue, directives]) => ({
    kind: Kind.VariableDefinition,
    variable: variableNode(name),
    type,
    ...defaultValue != null && { defaultValue },
    ...directives.length && { directives },
  }),
} satisfies (
    & { [K in keyof AST.Catalog.byKind]: (x: Seed[K]) => AST.Catalog.byKind[K] }
    & { [K in keyof AST.Catalog.byNamedType]: (x: Seed[K]) => AST.Catalog.byNamedType[K] }
  )

export const SeedGenerator = Gen(Seed)

export const seedToSchema = fold<AST.Fixpoint>((x) => SchemaMap[bySeed[x[0]]](x as never))

