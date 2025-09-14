import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Sandbox } from './sandbox.tsx'
import { has, parseKey } from '@traversable/registry'

import * as AST from './graphql.ts'

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

const algebra = AST.fold<string>((x, ix, original) => {
  switch (true) {
    default: return x satisfies never
    case AST.isDocument(x): throw Error('Nesting documents is not allowed')
    case AST.isInputValue(x): throw Error('Input values cannot be converted to a type')
    case AST.isInputObject(x): throw Error('Input objects cannot be converted to a type')
    case AST.isRef(x): return x.name.value
    case AST.isScalar(x): return x.name.value
    case AST.isBoolean(x): return 'boolean'
    case AST.isInt(x): return 'number'
    case AST.isNumber(x): return 'number'
    case AST.isFloat(x): return 'number'
    case AST.isString(x): return 'string'
    case AST.isID(x): return 'string'
    case AST.isEnum(x): return (
      x.values.length === 0 ? 'never'
        : x.values.length === 1 ? JSON.stringify(x.values[0])
          : `(${x.values.map((v) => JSON.stringify(v)).join(' | ')})`
    )
    case AST.isNonNull(x): return `${x.type}!`
    case AST.isUnion(x): return (
      x.types.length === 0 ? 'never'
        : x.types.length === 1 ? JSON.stringify(x.types[0])
          : `(${x.types.map((v) => JSON.stringify(v)).join(' | ')})`
    )
    case AST.isList(x): {
      if (!AST.isList(original)) throw Error('Illegal state')
      const isNonNull = x.type.endsWith('!')
      const TYPE = isNonNull ? x.type.slice(0, -1) : `${x.type} | null`
      return `Array<${TYPE}>`
    }
    case AST.isField(x): {
      const isNonNull = x.type.endsWith('!')
      const VALUE = isNonNull ? x.type.slice(0, -1) : x.type
      return `${parseKey(x.name.value)}${isNonNull ? '' : '?'}: ${VALUE}`
    }
    case AST.isObject(x): { return x.fields.length === 0 ? `{}` : `{ ${x.fields.join(', ')} }` }
    case AST.isInterface(x): { return x.fields.length === 0 ? `{}` : `{ ${x.fields.join(', ')} }` }
  }
})

function toType(doc: AST.Document<AST.Fixpoint>) {
  const types = doc.definitions.map((def, i) => `type ${AST.isNamed(def) ? def.name.value : `Type${i}`} = ${AST.fold(algebra)(def)}`)
  return types.join('\n')
}

console.log('\n\n')
console.log(toType(test))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Sandbox />
  </StrictMode>,
)
