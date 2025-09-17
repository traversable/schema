import * as vi from 'vitest'
import prettier from '@prettier/sync'
import { parseKey } from '@traversable/registry'
import type { AST } from '@traversable/graphql-types'
import {
  fold,
  isBooleanNode,
  isDocumentNode,
  isEnumNode,
  isFieldNode,
  isFloatNode,
  isIDNode,
  isInputObjectNode,
  isInputValueNode,
  isIntNode,
  isInterfaceNode,
  isListNode,
  isNamedNode,
  isNonNullNode,
  isNumberNode,
  isObjectNode,
  isRefNode,
  isScalarNode,
  isStringNode,
  isUnionNode,
} from '@traversable/graphql-types'

const format = (src: string) => prettier.format(
  src,
  { parser: 'typescript', semi: false, printWidth: 60 }
)

const test = {
  "kind": "Document",
  "definitions": [
    {
      "kind": "ObjectTypeDefinition",
      "name": {
        "kind": "Name",
        "value": "Pet",
        "loc": {
          "start": 133,
          "end": 136
        }
      },
      "interfaces": [],
      "directives": [],
      "fields": [
        {
          "kind": "FieldDefinition",
          "name": {
            "kind": "Name",
            "value": "name",
            "loc": {
              "start": 141,
              "end": 145
            }
          },
          "arguments": [],
          "type": {
            "kind": "NamedType",
            "name": {
              "kind": "Name",
              "value": "String",
              "loc": {
                "start": 147,
                "end": 153
              }
            },
            "loc": {
              "start": 147,
              "end": 153
            }
          },
          "directives": [],
          "loc": {
            "start": 141,
            "end": 153
          }
        }
      ],
      "loc": {
        "start": 128,
        "end": 155
      }
    }
  ],
  "loc": {
    "start": 0,
    "end": 156
  }
} as const

const algebra = fold<string>((x, ix, original) => {
  switch (true) {
    default: return x satisfies never
    case isDocumentNode(x): throw Error('Nesting documents is not allowed')
    case isInputValueNode(x): throw Error('Input values cannot be converted to a type')
    case isInputObjectNode(x): throw Error('Input objects cannot be converted to a type')
    case isRefNode(x): return x.name.value
    case isScalarNode(x): return x.name.value
    case isBooleanNode(x): return 'boolean'
    case isIntNode(x): return 'number'
    case isNumberNode(x): return 'number'
    case isFloatNode(x): return 'number'
    case isStringNode(x): return 'string'
    case isIDNode(x): return 'string'
    case isEnumNode(x): return (
      x.values.length === 0 ? 'never'
        : x.values.length === 1 ? JSON.stringify(x.values[0])
          : `(${x.values.map((v) => JSON.stringify(v)).join(' | ')})`
    )
    case isNonNullNode(x): return `${x.type}!`
    case isUnionNode(x): return (
      x.types.length === 0 ? 'never'
        : x.types.length === 1 ? JSON.stringify(x.types[0])
          : `(${x.types.map((v) => JSON.stringify(v)).join(' | ')})`
    )
    case isListNode(x): {
      if (!isListNode(original)) throw Error('Illegal state')
      const isNonNull = x.type.endsWith('!')
      const TYPE = isNonNull ? x.type.slice(0, -1) : `${x.type} | null`
      return `Array<${TYPE}>`
    }
    case isFieldNode(x): {
      const isNonNull = x.type.endsWith('!')
      const VALUE = isNonNull ? x.type.slice(0, -1) : x.type
      return `${parseKey(x.name.value)}${isNonNull ? '' : '?'}: ${VALUE}`
    }
    case isObjectNode(x): { return x.fields.length === 0 ? `{}` : `{ ${x.fields.join(', ')} }` }
    case isInterfaceNode(x): { return x.fields.length === 0 ? `{}` : `{ ${x.fields.join(', ')} }` }
  }
})

function toType(doc: AST.Document<AST.Fixpoint>) {
  const types = doc.definitions.map((def, i) => `type ${isNamedNode(def) ? def.name.value : `Type${i}`} = ${fold(algebra)(def)}`)
  return types.join('\n')
}

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/graphql-types❳', () => {
  vi.test('〖⛳️〗› ❲Functor❳', () => {
    vi.expect.soft(format(
      toType({
        kind: 'Document',
        definitions: []
      })
    )).toMatchInlineSnapshot
      (`""`)
  })
})
