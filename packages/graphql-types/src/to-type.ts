import { fn, has, parseKey } from '@traversable/registry'
import * as F from './functor.js'
import type * as gql from 'graphql'
import type { AST } from './functor.js'
import { Kind } from './functor.js'

const unsupported = [
  'Directive',
  'FragmentDefinition',
  'FragmentSpread',
  'InlineFragment',
  'InputObjectTypeDefinition',
  'InputValueDefinition',
  'SelectionSet',
  'OperationDefinition',
  'Argument',
  'SchemaDefinition',
  'VariableDefinition',
  'DirectiveDefinition',
] as const satisfies Array<typeof F.Kind[keyof typeof F.Kind]>

type UnsupportedNodeMap = Pick<AST.Catalog, typeof unsupported[number]>
type UnsupportedNode = UnsupportedNodeMap[keyof UnsupportedNodeMap]

function isUnsupportedNode(x: unknown): x is UnsupportedNode {
  return unsupported.some(
    (tag) => has('kind', (kind) => kind === tag)(x)
  )
}

function valueNodeToString(x: AST.ValueNode): string {
  switch (x.kind) {
    default: return fn.exhaustive(x)
    case Kind.NullValue: return 'null'
    case Kind.BooleanValue: return `${x.value}`
    case Kind.IntValue: return `${x.value}`
    case Kind.FloatValue: return `${x.value}`
    case Kind.StringValue: return `"${x.value}"`
    case Kind.EnumValue: return `${x.value}`
    case Kind.ListValue: return `[${x.values.map(valueNodeToString).join(', ')}]`
    case Kind.ObjectValue: return ''
      + '{ '
      + x.fields.map((node) => `${parseKey(node.name.value)}: ${valueNodeToString(node.value)}`).join(', ')
      + ' }'
    case Kind.Variable: return `${x.name.value}`
  }
}

const fold = F.fold<string>((x) => {
  switch (true) {
    default: return fn.exhaustive(x)
    case isUnsupportedNode(x): return ''
    case F.isEnumValueDefinitionNode(x): throw Error('Not sure what an enum value definition node is...')
    case F.isRefNode(x): return x.name.value
    case F.isValueNode(x): return valueNodeToString(x)
    case F.isScalarTypeDefinition(x): return x.name.value
    case F.isBooleanNode(x): return 'boolean'
    case F.isIntNode(x): return 'number'
    case F.isNumberNode(x): return 'number'
    case F.isFloatNode(x): return 'number'
    case F.isStringNode(x): return 'string'
    case F.isIDNode(x): return 'string'
    case F.isEnumTypeDefinitionNode(x): return (
      x.values.length === 1 ? JSON.stringify(x.values[0])
        : `(${x.values.map((v) => JSON.stringify(v)).join(' | ')})`
    )
    case F.isNonNullTypeNode(x): return `${x.type}!`
    case F.isUnionTypeDefinitionNode(x): return (
      x.types.length === 1 ? `type ${x.name.value} = ${JSON.stringify(x.types[0])}`
        : `type ${x.name.value} = ${x.types.map((v) => JSON.stringify(v)).join(' | ')}`
    )
    case F.isListNode(x): return `Array<${x.type.endsWith('!') ? x.type.slice(0, -1) : `${x.type} | null`}>`
    case F.isFieldDefinitionNode(x): {
      const isNonNull = x.type.endsWith('!')
      const VALUE = isNonNull ? x.type.slice(0, -1) : x.type
      return `${parseKey(x.name.value)}${isNonNull ? '' : '?'}: ${VALUE}`
    }
    case F.isFieldNode(x): {
      const KEY = x.alias?.value ?? x.name.value
      return x.selectionSet
        ? `${KEY}: ${x.selectionSet}`
        : `${KEY}: ${x.name.value}`
    }
    case F.isObjectTypeDefinitionNode(x): {
      const IMPLEMENTS = !x.interfaces.length ? '' : `${x.interfaces.join(' & ')} & `
      return `type ${x.name.value} = ${IMPLEMENTS}{
        __typename?: ${x.name.value}
        ${x.fields.join('\n')}
      }`
    }
    case F.isInterfaceTypeDefinitionNode(x): {
      const IMPLEMENTS = !x.interfaces.length ? '' : `extends ${x.interfaces.join(', ')} `
      return `interface ${x.name.value} ${IMPLEMENTS}{ 
        __typename?: ${x.name.value}
        ${x.fields.join('\n')}
      }`
    }
    case F.isDocumentNode(x): return x.definitions.join('\n\r')
  }
})

export declare namespace toType {
  export type {
    UnsupportedNode
  }
}

toType.unsupported = unsupported

/**
 * ## {@link toType `toType`}
 * 
 * Convert a GraphQL AST into its corresponding TypeScript type.
 */
export function toType(doc: gql.DocumentNode) {
  return Object.values(fold(doc).byName).map((thunk) => thunk()).join('\n\r')
}
