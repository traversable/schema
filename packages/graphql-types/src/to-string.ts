import { fn, escape, has, parseKey } from '@traversable/registry'
import * as F from './functor.js'
import type * as gql from 'graphql'
import type { AST } from './functor.js'

function valueNodeToString(x: AST.ValueNode): string {
  switch (x.kind) {
    default: return fn.exhaustive(x)
    case 'NullValue': return 'null'
    case 'BooleanValue': return `${x.value}`
    case 'IntValue': return `${x.value}`
    case 'FloatValue': return `${x.value}`
    case 'StringValue': return `"${escape(x.value)}"`
    case 'EnumValueDefinition': return `"${x.name.value}"`
    case 'ListValue': return `[${x.values.map(valueNodeToString).join(', ')}]`
    case 'ObjectValue': return ''
      + '{ '
      + x.fields.map((node) => `${parseKey(node.name.value)}: ${valueNodeToString(node.value)}`).join(', ')
      + ' }'
    case 'Variable': return `${x.name.value}`
  }
}

const fold = F.fold<string>((x, _, _original) => {
  switch (true) {
    default: return fn.exhaustive(x)
    case F.isRefNode(x): return x.name.value
    case F.isValueNode(x): return valueNodeToString(x)
    case F.isSelectionSetNode(x): return `{ ${x.selections.join('\n')} }`
    case F.isScalarTypeDefinition(x): return `scalar ${x.name.value}`
    case F.isBooleanNode(x): return 'Boolean'
    case F.isIntNode(x): return 'Int'
    case F.isNumberNode(x): return 'Number'
    case F.isFloatNode(x): return 'Float'
    case F.isStringNode(x): return 'String'
    case F.isIDNode(x): return 'ID'
    case F.isEnumNode(x): return `enum ${x.name.value} { ${x.values.map((v) => v.name.value).join('\n')} }`
    case F.isNonNullTypeNode(x): return `${x.type}!`
    case F.isUnionNode(x): return `union ${x.name.value} = ${x.types}`
    case F.isListNode(x): return `[${x.type}]`
    case F.isDirectiveNode(x): return `@${x.name.value}(${(x.arguments ?? []).join(', ')})`
    case F.isFieldNode(x): {
      const KEY = x.alias?.value ?? x.name.value
      const VALUE = !x.alias?.value ? '' : `: ${x.name.value}`
      return x.selectionSet
        ? `${KEY} ${x.selectionSet}`
        : `${KEY}${VALUE}`
    }
    case F.isFieldDefinitionNode(x): return `${parseKey(x.name.value)}: ${x.type} `
    case F.isInputValueNode(x): return `${parseKey(x.name.value)}: ${x.type} `
    case F.isObjectNode(x): {
      const IMPLEMENTS = x.interfaces.length ? ` implements ${x.interfaces.join(' & ')}` : ''
      return `type ${x.name.value}${IMPLEMENTS} { ${x.fields.join('\n')} } `
    }
    case F.isInterfaceNode(x): return `interface ${x.name.value} { ${x.fields.join('\n')} }`
    case F.isInputObjectNode(x): return `input ${x.name.value} { ${x.fields.join('\n')} } `
    case F.isInlineFragmentNode(x): return `...${!x.typeCondition ? '' : ` on ${x.typeCondition.name.value}`} ${x.selectionSet} `
    case F.isFragmentDefinitionNode(x): return `fragment ${x.name.value} on ${x.typeCondition.name.value} ${x.selectionSet} `
    case F.isFragmentSpreadNode(x): return `...${x.name.value} `
    case F.isDocumentNode(x): return x.definitions.join('\n\r')
    case F.isOperationDefinitionNode(x): {
      const NAME = x.name?.value ? ` ${x.name.value} ` : ''
      return `${x.operation}${NAME}${!x.variableDefinitions?.length ? '' : `(${x.variableDefinitions.join(', ')})`} ${x.selectionSet} `
    }
  }
})

export declare namespace toString {}

/**
 * ## {@link toType `toType`}
 * 
 * Convert a GraphQL AST into its corresponding TypeScript type.
 */
export function toString(doc: gql.DocumentNode): string {
  return fold(doc)
}
