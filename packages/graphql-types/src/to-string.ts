import { escape, has } from '@traversable/registry'
import * as F from './functor.js'
import * as gql from 'graphql'

function directives(x: { directives?: readonly string[] }): string {
  return !x.directives ? '' : ` ${x.directives.join(' ')} `
}

function defaultValue(x: { defaultValue?: F.ValueNode | string }): string {
  return x.defaultValue ? ` = ${serializeValueNode(x.defaultValue)}` : ''
}

function description(x: { description?: F.StringValueNode }): string {
  return !x.description ? ''
    : x.description.block ?
      `\n"""\n${x.description.value}\n"""\n`
      : `"${x.description.value}"\n`
}

function serializeValueNode(x?: F.ValueNode | string): string {
  if (!x) return ''
  else if (typeof x === 'string') return x
  else {
    switch (true) {
      default: return x satisfies never
      case F.isNullValueNode(x): return 'Null'
      case F.isBooleanValueNode(x): return `${x.value}`
      case F.isIntValueNode(x): return `${x.value}`
      case F.isFloatValueNode(x): return `${x.value}`
      case F.isStringValueNode(x): return `"${escape(x.value)}"`
      case F.isEnumValueNode(x): return `${x.value}`
      case F.isListValueNode(x): return `[${x.values.map(serializeValueNode).join(', ')}]`
      case F.isVariableNode(x): return `$${x.name.value}`
      case F.isObjectValueNode(x): return `{ ${x.fields.map((n) => `${n.name.value}: ${serializeValueNode(n.value)}`).join(', ')} }`
    }
  }
}

const fold = F.fold<string>((x) => {
  switch (true) {
    // default: return fn.exhaustive(x)
    default: return x satisfies never
    case F.isEnumValueDefinitionNode(x): throw Error('Not sure what an `EnumValueDefinitionNode` is...')
    case F.isObjectFieldNode(x): throw Error('Not sure what an `ObjectFieldNode` is...')
    case F.isOperationTypeDefinitionNode(x): return `${x.operation}: ${x.type.name.value}`
    // return `OperationTypeDefinition: ${x.operation}` //  throw Error('Not sure what an `OperationTypeDefinitionNode` is...')
    case F.isValueNode(x): return serializeValueNode(x)
    case F.isSelectionSetNode(x): return `{ ${x.selections.join('\n')} }`
    case F.isScalarTypeDefinition(x): return `scalar ${directives(x)}${x.name.value}`
    case F.isBooleanNode(x): return 'Boolean'
    case F.isIntNode(x): return 'Int'
    case F.isNumberNode(x): return 'Number'
    case F.isFloatNode(x): return 'Float'
    case F.isStringNode(x): return 'String'
    case F.isIDNode(x): return 'ID'
    case F.isNullNode(x): return 'Null'
    case F.isListNode(x): return `[${x.type}]`
    case F.isNonNullTypeNode(x): return `${x.type}!`
    case F.isArgumentNode(x): return `${x.name.value}: ${x.value}`
    case F.isDirectiveNode(x): return `@${x.name.value}${(!x.arguments?.length ? '' : `(${x.arguments.join(', ')})`)}`
    case F.isInputObjectTypeDefinitionNode(x): {
      return `${description(x)}input ${x.name.value} { ${x.fields.join('\n')} } `
    }
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
        ? `${description(x)}${KEY}${ARGS}${directives(x)}${x.selectionSet}`
        : `${description(x)}${KEY}${ARGS}${directives(x)}`
    }
    case F.isFieldDefinitionNode(x): {
      const ARGS = !x.arguments?.length ? '' : `(${x.arguments.join(', ')})`
      return `${description(x)}${x.name.value}${ARGS}: ${x.type}${directives(x)}`
    }
    case F.isInputValueDefinitionNode(x): {
      return `${description(x)}${x.name.value}: ${x.type}${defaultValue(x)}${directives(x)}`
    }
    case F.isObjectTypeDefinitionNode(x): {
      const IMPLEMENTS = x.interfaces.length ? ` implements ${x.interfaces.join(' & ')}` : ''
      return `${description(x)}type ${x.name.value}${IMPLEMENTS}${directives(x)} { ${x.fields.join('\n')} } `
    }
    case F.isInterfaceTypeDefinitionNode(x): {
      const IMPLEMENTS = x.interfaces.length ? ` implements ${x.interfaces.join(' & ')}` : ''
      return `${description(x)}interface ${x.name.value}${IMPLEMENTS}${directives(x)} { ${x.fields.join('\n')} } `
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
    case F.isNameNode(x): return x.value
  }
})

export declare namespace toString {}

/**
 * ## {@link toType `toType`}
 * 
 * Convert a GraphQL AST into its corresponding TypeScript type.
 */
export function toString(doc: gql.DocumentNode): string
export function toString(doc: F.AST.Fixpoint): string
export function toString(doc: F.AST.Fixpoint | gql.DocumentNode): string {
  const ast: F.AST.DocumentNode
    = has('kind', (kind) => kind === gql.Kind.DOCUMENT)(doc)
      ? doc
      : { kind: 'Document', definitions: [doc as F.F<string>] }

  return Object
    .values(fold(ast as F.AST.DocumentNode<string>).byName)
    .map((thunk) => thunk()).join('\n\r')
}
