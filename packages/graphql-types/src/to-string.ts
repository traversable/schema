import { escape, fn } from '@traversable/registry'
import * as F from './functor.js'
import type * as gql from 'graphql'
import type { AST } from './functor.js'
import { Kind } from './functor.js'

function directives(x: { directives?: readonly string[] }): string {
  return !x.directives ? '' : ` ${x.directives.join(' ')} `
}

function defaultValue(x: { defaultValue?: AST.ValueNode | string }): string {
  return x.defaultValue ? ` = ${serializeValueNode(x.defaultValue)}` : ''
}

function description(x: { description?: AST.StringValueNode }): string {
  return !x.description ? ''
    : x.description.block ?
      `"""\n${x.description.value}\n"""`
      : ` "${x.description.value}" `
}

function serializeValueNode(x?: AST.ValueNode | string): string {
  if (!x) return ''
  else if (typeof x === 'string') return x
  else {
    switch (x.kind) {
      default: return x satisfies never
      case Kind.NullValue: return 'null'
      case Kind.BooleanValue: return `${x.value}`
      case Kind.IntValue: return `${x.value}`
      case Kind.FloatValue: return `${x.value}`
      case Kind.StringValue: return `"${escape(x.value)}"`
      case Kind.EnumValue: return `${x.value}`
      case Kind.ListValue: return `[${x.values.map(serializeValueNode).join(', ')}]`
      case Kind.Variable: return `$${x.name.value}`
      case Kind.ObjectValue: return `{ ${x.fields.map((n) => `${n.name.value}: ${serializeValueNode(n.value)}`).join(', ')} }`
    }
  }
}

const fold = F.fold<string>((x) => {
  switch (true) {
    default: return fn.exhaustive(x)
    case F.isEnumValueDefinitionNode(x): throw Error('Not sure what an enum value definition node is...')
    case F.isValueNode(x): return serializeValueNode(x)
    case F.isSelectionSetNode(x): return `{ ${x.selections.join('\n')} }`
    case F.isScalarTypeDefinition(x): return `scalar ${directives(x)}${x.name.value}`
    case F.isBooleanNode(x): return 'Boolean'
    case F.isIntNode(x): return 'Int'
    case F.isNumberNode(x): return 'Number'
    case F.isFloatNode(x): return 'Float'
    case F.isStringNode(x): return 'String'
    case F.isIDNode(x): return 'ID'
    case F.isListNode(x): return `[${x.type}]`
    case F.isNonNullTypeNode(x): return `${x.type}!`
    case F.isArgumentNode(x): return `${x.name.value}: ${x.value}`
    case F.isDirectiveNode(x): return `@${x.name.value}(${(x.arguments ?? []).join(', ')})`
    case F.isInputObjectTypeDefinitionNode(x): return `${description(x)}input ${x.name.value} { ${x.fields.join('\n')} } `
    case F.isUnionTypeDefinitionNode(x): return `${description(x)}union ${x.name.value}${directives(x)} = ${x.types.join(' | ')}`
    case F.isEnumTypeDefinitionNode(x): return `enum ${x.name.value}${directives(x)} { ${x.values.map((v) => v.name.value).join('\n')} }`
    case F.isDirectiveDefinitionNode(x): {
      const ARGS = x.arguments?.length ? `(${x.arguments.join(', ')})` : ''
      return `${description(x)}directive @${x.name.value}${ARGS} on ${x.locations.map((loc) => loc.value).join(' | ')}`
    }
    case F.isInlineFragmentNode(x): return `...${!x.typeCondition ? '' : ` on ${x.typeCondition.name.value}`} ${x.selectionSet} `
    case F.isFragmentDefinitionNode(x): {
      return `fragment ${x.name.value} on ${x.typeCondition.name.value}${directives(x)}${x.selectionSet}`
    }
    case F.isFragmentSpreadNode(x): return `...${x.name.value}${directives(x)}`
    case F.isVariableDefinitionNode(x): return `$${x.variable.name.value}: ${x.type}${defaultValue(x)}${directives(x)}`
    case F.isDocumentNode(x): return x.definitions.join('\n\r')
    case F.isFieldNode(x): {
      const KEY = !x.alias?.value ? `${x.name.value} ` : `${x.alias.value}: ${x.name.value}`
      const ARGS = !x.arguments?.length ? '' : `(${x.arguments.join(', ')})`
      return x.selectionSet
        ? `${description(x)}${KEY}${directives(x)}${ARGS}${x.selectionSet}`
        : `${description(x)}${KEY}${directives(x)}${ARGS}`
    }
    case F.isFieldDefinitionNode(x): {
      const ARGS = !x.arguments?.length ? '' : `(${x.arguments.join(', ')})`
      return `${description(x)}${x.name.value}${directives(x)}${ARGS}: ${x.type}`
    }
    case F.isInputValueDefinitionNode(x): {
      return `${description(x)}${x.name.value}${directives(x)}: ${x.type}${defaultValue(x)}`
    }
    case F.isObjectTypeDefinitionNode(x): {
      const IMPLEMENTS = x.interfaces.length ? ` implements ${x.interfaces.join(' & ')}` : ''
      return `${description(x)}type ${x.name.value}${directives(x)}${IMPLEMENTS} { ${x.fields.join('\n')} } `
    }
    case F.isInterfaceTypeDefinitionNode(x): {
      const IMPLEMENTS = x.interfaces.length ? ` implements ${x.interfaces.join(' & ')}` : ''
      return `${description(x)}interface ${x.name.value}${directives(x)}${IMPLEMENTS} { ${x.fields.join('\n')} } `
    }
    case F.isOperationDefinitionNode(x): {
      const NAME = x.name?.value ? ` ${x.name.value} ` : ''
      const VARS = !x.variableDefinitions?.length ? '' : `(${x.variableDefinitions.join(', ')})`
      return `${x.operation}${NAME}${VARS}${directives(x)} ${x.selectionSet} `
    }
    case F.isSchemaDefinitionNode(x): {
      return `${description(x)}schema ${directives(x)}{ ${x.operationTypes.map((op) => `${op.operation}: ${op.type.name.value}`).join('\n')} }`
    }
    case F.isRefNode(x): return x.name.value
  }
})

export declare namespace toString {}

/**
 * ## {@link toType `toType`}
 * 
 * Convert a GraphQL AST into its corresponding TypeScript type.
 */
export function toString(doc: gql.DocumentNode): string {
  return Object.values(fold(doc).byName).map((thunk) => thunk()).join('\n\r')
}
