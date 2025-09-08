import * as vi from 'vitest'
import prettier from '@prettier/sync'

import { parseKey } from '@traversable/registry'
import { JsonSchema, canonicalizeRefName } from '@traversable/json-schema'
import { t, recurse } from '@traversable/schema'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false, printWidth: 50 })

const schema = {
  $defs: {
    name: { type: 'string' },
  },
  type: "object",
  required: [],
  properties: {
    name: { type: "string" },
    children: {
      type: "array",
      items: { $ref: "#/$defs/name" }
    }
  }
} as const

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/json-schema❳', () => {
  vi.test('[JSON Schema -> TypeScript type]: using index.refHandler', () => {
    const index = {
      // Here I apply the transformation via `index.refHandler`
      // (`index.refHandler` is called _instead_ of the function passed to `JsonSchema.fold`)
      refHandler: (x: JsonSchema.Ref) => canonicalizeRefName(x.$ref)
    }

    vi.expect.soft(
      JsonSchema.fold<string>((x, ix) => {
        switch (true) {
          default: return x satisfies never
          case JsonSchema.isRef(x): {
            const ref = ix.refs.get(x.$ref)?.()
            if (typeof ref !== 'string') throw Error('bad ref')
            return ref
          }
          case JsonSchema.isNever(x): return 'never'
          case JsonSchema.isNull(x): return 'null'
          case JsonSchema.isBoolean(x): return 'boolean'
          case JsonSchema.isInteger(x): return 'number'
          case JsonSchema.isNumber(x): return 'number'
          case JsonSchema.isString(x): return 'string'
          case JsonSchema.isEnum(x): return `(${x.enum.join(' | ')})`
          case JsonSchema.isConst(x): return JSON.stringify(x.const)
          case JsonSchema.isArray(x): return `Array<${x.items}>`
          case JsonSchema.isRecord(x): return ``
          case JsonSchema.isUnion(x): return ``
          case JsonSchema.isIntersection(x): return ``
          case JsonSchema.isTuple(x): return ``
          case JsonSchema.isObject(x): {
            const xs = Object.entries(x.properties).map(([k, v]) => `${parseKey(k)}${x.required.includes(k) ? '' : '?'}: ${v}`)
            return `{ ${xs.join(', ')} }`
          }
          case JsonSchema.isUnknown(x): return 'unknown'
        }
      })(schema, index)
    ).toMatchInlineSnapshot
      (`
      {
        "refs": {
          "#/$defs/name": [Function],
        },
        "result": "{ name?: string, children?: Array<Name> }",
      }
    `)
  })

  vi.test('[JSON Schema -> TypeScript type]: inline ref handler', () => {
    vi.expect.soft(
      JsonSchema.fold<string>((x) => {
        switch (true) {
          default: return x satisfies never
          // Here I apply the transformation inside `JsonSchema.fold`:
          case JsonSchema.isRef(x): return canonicalizeRefName(x.$ref)
          case JsonSchema.isNever(x): return 'never'
          case JsonSchema.isNull(x): return 'null'
          case JsonSchema.isBoolean(x): return 'boolean'
          case JsonSchema.isInteger(x): return 'number'
          case JsonSchema.isNumber(x): return 'number'
          case JsonSchema.isString(x): return 'string'
          case JsonSchema.isEnum(x): return `(${x.enum.join(' | ')})`
          case JsonSchema.isConst(x): return JSON.stringify(x.const)
          case JsonSchema.isArray(x): return `Array<${x.items}>`
          case JsonSchema.isRecord(x): return ``
          case JsonSchema.isUnion(x): return ``
          case JsonSchema.isIntersection(x): return ``
          case JsonSchema.isTuple(x): return ``
          case JsonSchema.isObject(x): {
            return `{ ${Object.entries(x.properties).map(([k, v]) => `${parseKey(k)}${x.required.includes(k) ? '' : '?'}: ${v}`).join(', ')} }`
          }
          case JsonSchema.isUnknown(x): return 'unknown'
        }
      })(schema)
    ).toMatchInlineSnapshot
      (`
      {
        "refs": {
          "#/$defs/name": [Function],
        },
        "result": "{ name?: string, children?: Array<Name> }",
      }
    `)

    vi.expect.soft(
      JsonSchema.fold<string>((x) => {
        switch (true) {
          default: return x satisfies never
          case JsonSchema.isRef(x): return canonicalizeRefName(x.$ref)
          case JsonSchema.isNever(x): return 'never'
          case JsonSchema.isNull(x): return 'null'
          case JsonSchema.isBoolean(x): return 'boolean'
          case JsonSchema.isInteger(x): return 'number'
          case JsonSchema.isNumber(x): return 'number'
          case JsonSchema.isString(x): return 'string'
          case JsonSchema.isEnum(x): return `(${x.enum.join(' | ')})`
          case JsonSchema.isConst(x): return JSON.stringify(x.const)
          case JsonSchema.isArray(x): return `Array<${x.items}>`
          case JsonSchema.isRecord(x): return ``
          case JsonSchema.isUnion(x): return ``
          case JsonSchema.isIntersection(x): return ``
          case JsonSchema.isTuple(x): return ``
          case JsonSchema.isObject(x): {
            return `{ ${Object.entries(x.properties).map(([k, v]) => `${parseKey(k)}${x.required.includes(k) ? '' : '?'}: ${v}`).join(', ')} }`
          }
          case JsonSchema.isUnknown(x): return 'unknown'
        }
      })(schema, { canonicalizeRefName })
    ).toMatchInlineSnapshot
      (`
      {
        "refs": {
          "Name": [Function],
        },
        "result": "{ name?: string, children?: Array<Name> }",
      }
    `)
  })

  vi.test('[JSON Schema -> Traversable]', () => {
    const toTraversable = JsonSchema.fold<t.Type>((x, ix) => {
      switch (true) {
        default: return x satisfies never
        case JsonSchema.isRef(x): {
          const ref = ix.refs.get(x.$ref)?.()
          const id = canonicalizeRefName(x.$ref)
          return t.ref.def(ref, id) satisfies t.Type
        }
        case JsonSchema.isNever(x): return t.never
        case JsonSchema.isNull(x): return t.null
        case JsonSchema.isBoolean(x): return t.boolean
        case JsonSchema.isInteger(x): return t.integer
        case JsonSchema.isNumber(x): return t.number
        case JsonSchema.isString(x): return t.string
        case JsonSchema.isEnum(x): return t.enum(
          x.enum.reduce((acc, cur) => ({ ...acc, [String(cur)]: cur }), {})
        ) as never // <-- TODO: fix typing issue (on my end)
        case JsonSchema.isConst(x): return t.eq(x.const as {})
        case JsonSchema.isArray(x): return t.array(x.items)
        case JsonSchema.isRecord(x): {
          if (x.additionalProperties !== undefined) return t.record(x.additionalProperties)
          else if (x.patternProperties !== undefined) return t.record(t.union(...Object.values(x.patternProperties)))
          else throw Error('Illegal state')
        }
        case JsonSchema.isUnion(x): return t.union(...x.anyOf)
        case JsonSchema.isIntersection(x): return t.intersect(...x.allOf)
        case JsonSchema.isTuple(x): return t.tuple(...x.prefixItems)
        case JsonSchema.isObject(x): return t.object(
          Object.fromEntries(
            Object.entries(x.properties).map(
              ([k, v]) => [k, !x.required.includes(k) ? t.optional(v) : v]
            )
          )
        )
        case JsonSchema.isUnknown(x): return t.unknown
      }
    })

    const { refs, result } = toTraversable(schema, { canonicalizeRefName })

    const references = Object.entries(refs).map(
      ([ident, thunk]) => `const ${ident} = ${recurse.schemaToString(thunk())}`
    )

    vi.expect.soft(format(
      [
        ...references,
        recurse.schemaToString(result),
      ].join('\n')
    )).toMatchInlineSnapshot
      (`
      "const Name = t.string
      t.object({
        name: t.optional(t.string),
        children: t.optional(t.array(Name)),
      })
      "
    `)
  })
})
