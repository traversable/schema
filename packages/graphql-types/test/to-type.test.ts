import * as vi from 'vitest'
import { toType } from '@traversable/graphql-types'
import prettier from '@prettier/sync'

const format = (src: string) => prettier.format(
  src,
  { parser: 'typescript', semi: false, printWidth: 50 }
)

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/graphql-types❳', () => {
  vi.test('〖⛳️〗› ❲toType❳', () => {
    vi.expect.soft(format(
      toType({
        "kind": "Document",
        "definitions": [
          {
            "kind": "ObjectTypeDefinition",
            "name": {
              "kind": "Name",
              "value": "Pet",
            },
            "interfaces": [],
            "directives": [],
            "fields": [
              {
                "kind": "FieldDefinition",
                "name": {
                  "kind": "Name",
                  "value": "petName",
                },
                "arguments": [],
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "String",
                  },
                },
                "directives": [],
              }
            ],
          },
          {
            "kind": "ObjectTypeDefinition",
            "name": {
              "kind": "Name",
              "value": "Human",
            },
            "interfaces": [],
            "directives": [],
            "fields": [
              {
                "kind": "FieldDefinition",
                "name": {
                  "kind": "Name",
                  "value": "humanName",
                },
                "arguments": [],
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "String",
                  },
                },
                "directives": [],
              },
              {
                "kind": "FieldDefinition",
                "name": {
                  "kind": "Name",
                  "value": "pet",
                },
                "arguments": [],
                "type": {
                  "kind": "NamedType",
                  "name": {
                    "kind": "Name",
                    "value": "Pet",
                  },
                },
                "directives": [],
              }
            ],
          }
        ],
      })
    )
    ).toMatchInlineSnapshot
      (`
      "type Pet = { petName?: string }
      type Human = { humanName?: string; pet?: Pet }
      "
    `)
  })
})