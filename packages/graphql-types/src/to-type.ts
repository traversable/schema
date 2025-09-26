import { fn, has, parseKey } from '@traversable/registry'
import * as F from './functor.js'
import type * as gql from 'graphql'
import type { AST } from './functor.js'

const unsupported = [
  'Directive',
  'FragmentDefinition',
  'FragmentSpread',
  'InlineFragment',
  'InputObjectTypeDefinition',
  'InputValueDefinition',
  'SelectionSet',
  'OperationDefinition'
] as const satisfies Array<typeof F.Kind[keyof typeof F.Kind]>

type UnsupportedNodeMap = Pick<AST.Catalog, typeof unsupported[number]>
type UnsupportedNode = UnsupportedNodeMap[keyof UnsupportedNodeMap]

function isUnsupportedNode(x: unknown): x is UnsupportedNode {
  return unsupported.some(
    (nope) => has('kind', (kind): kind is never => kind === nope)(x)
  )
}

function valueNodeToString(x: AST.ValueNode): string {
  switch (x.kind) {
    default: return fn.exhaustive(x)
    case 'NullValue': return 'null'
    case 'BooleanValue': return `${x.value}`
    case 'IntValue': return `${x.value}`
    case 'FloatValue': return `${x.value}`
    case 'StringValue': return `"${x.value}"`
    case 'EnumValueDefinition': return `"${x.name.value}"`
    case 'ListValue': return `[${x.values.map(valueNodeToString).join(', ')}]`
    case 'ObjectValue': return ''
      + '{ '
      + x.fields.map((node) => `${parseKey(node.name.value)}: ${valueNodeToString(node.value)}`).join(', ')
      + ' }'
    case 'Variable': return `${x.name.value}`
  }
}

const fold = F.fold<string>((x, _, original) => {
  switch (true) {
    default: return fn.exhaustive(x)
    case F.isRefNode(x): return x.name.value
    case F.isValueNode(x): return valueNodeToString(x)
    case F.isScalarTypeDefinition(x): return x.name.value
    case F.isBooleanNode(x): return 'boolean'
    case F.isIntNode(x): return 'number'
    case F.isNumberNode(x): return 'number'
    case F.isFloatNode(x): return 'number'
    case F.isStringNode(x): return 'string'
    case F.isIDNode(x): return 'string'
    case F.isEnumNode(x): return (
      x.values.length === 0 ? 'never'
        : x.values.length === 1 ? JSON.stringify(x.values[0])
          : `(${x.values.map((v) => JSON.stringify(v)).join(' | ')})`
    )
    case F.isNonNullTypeNode(x): return `${x.type}!`
    case F.isUnionNode(x): return (
      x.types.length === 0 ? 'never'
        : x.types.length === 1 ? JSON.stringify(x.types[0])
          : `(${x.types.map((v) => JSON.stringify(v)).join(' | ')})`
    )
    case F.isListNode(x): return `Array<${x.type.endsWith('!') ? x.type.slice(0, -1) : `${x.type} | null`}>`
    case F.isFieldNode(x): {
      const isNonNull = x.type.endsWith('!')
      const VALUE = isNonNull ? x.type.slice(0, -1) : x.type
      return `${parseKey(x.name.value)}${isNonNull ? '' : '?'}: ${VALUE}`
    }
    case F.isObjectNode(x): { return `{ ${x.fields.join(', ')} }` }
    case F.isInterfaceNode(x): { return `{ ${x.fields.join(', ')} }` }
    case F.isDocumentNode(x): throw Error('[@traversable/graphql-types/to-type.js]: Nesting documents is not allowed')
    case isUnsupportedNode(x): throw Error(`[@traversable/graphql-types/to-type.js]: Unsupported node: ${x.kind}`)
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
  const types = doc.definitions.map(
    (x, i) => `type ${F.isNamedTypeNode(x) ? x.name.value : `Type${i}`} = ${fold(x)}`
  )
  return types.join('\n')
}
