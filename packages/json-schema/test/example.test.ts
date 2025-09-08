import * as vi from 'vitest'
import prettier from '@prettier/sync'

import { parseKey } from '@traversable/registry'
import { JsonSchema, canonicalizeRefName } from '@traversable/json-schema'
import { box } from '@traversable/typebox'
import * as TypeBox from '@sinclair/typebox'
import * as z from 'zod'
import { zx } from '@traversable/zod'
import { t, recurse } from '@traversable/schema'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false, printWidth: 50 })

const schemaWithRef = {
  $defs: {
    name: { type: 'string' },
  },
  type: "object",
  required: ['children'],
  properties: {
    name: { type: "string" },
    children: {
      type: "array",
      items: { $ref: "#/$defs/name" }
    }
  }
} as const

const schemaWithoutRef = {
  type: "object",
  required: ['children'],
  properties: {
    name: { type: "string" },
    children: {
      type: "array",
      items: { type: "string" }
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
      })(schemaWithRef, index)
    ).toMatchInlineSnapshot
      (`
      {
        "refs": {
          "#/$defs/name": [Function],
        },
        "result": "{ name?: string, children: Array<Name> }",
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
      })(schemaWithRef)
    ).toMatchInlineSnapshot
      (`
      {
        "refs": {
          "#/$defs/name": [Function],
        },
        "result": "{ name?: string, children: Array<Name> }",
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
      })(schemaWithRef, { canonicalizeRefName })
    ).toMatchInlineSnapshot
      (`
      {
        "refs": {
          "Name": [Function],
        },
        "result": "{ name?: string, children: Array<Name> }",
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
          return t.ref.def(ref, id)
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

    const { refs, result } = toTraversable(schemaWithRef, { canonicalizeRefName })

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
        children: t.array(Name),
      })
      "
    `)
  })

  vi.test('[JSON Schema -> TypeBox]', () => {
    const toTypeBox = JsonSchema.fold<TypeBox.TSchema>((x, ix) => {
      switch (true) {
        default: return x satisfies never
        case JsonSchema.isRef(x): return TypeBox.Ref(canonicalizeRefName(x.$ref))
        case JsonSchema.isNever(x): return TypeBox.Never()
        case JsonSchema.isNull(x): return TypeBox.Null()
        case JsonSchema.isBoolean(x): return TypeBox.Boolean()
        case JsonSchema.isInteger(x): return TypeBox.Integer()
        case JsonSchema.isNumber(x): return TypeBox.Number()
        case JsonSchema.isString(x): return TypeBox.String()
        case JsonSchema.isEnum(x): return TypeBox.Enum(x.enum.reduce((acc, cur) => ({ ...acc, [String(cur)]: cur }), {}))
        case JsonSchema.isConst(x): return TypeBox.Const(x.const)
        case JsonSchema.isArray(x): return TypeBox.Array(x.items)
        case JsonSchema.isRecord(x): {
          if (x.additionalProperties !== undefined) return TypeBox.Record(TypeBox.String(), x.additionalProperties)
          else if (x.patternProperties !== undefined) return TypeBox.Record(
            TypeBox.Union(Object.keys(x.patternProperties).map((pattern) => TypeBox.Const(pattern))),
            TypeBox.Union(Object.values(x.patternProperties))
          )
          else throw Error('Illegal state')
        }
        case JsonSchema.isUnion(x): return TypeBox.Union([...x.anyOf])
        case JsonSchema.isIntersection(x): return TypeBox.Intersect([...x.allOf])
        case JsonSchema.isTuple(x): return TypeBox.Tuple([...x.prefixItems])
        case JsonSchema.isObject(x): return TypeBox.Object(
          Object.fromEntries(
            Object.entries(x.properties).map(
              ([k, v]) => [k, !x.required.includes(k) ? TypeBox.Optional(v) : v]
            )
          )
        )
        case JsonSchema.isUnknown(x): return TypeBox.Unknown()
      }
    })

    vi.expect.soft(format(
      box.toString(
        toTypeBox(schemaWithoutRef).result
      )
    )).toMatchInlineSnapshot
      (`
      "T.Object({
        name: T.Optional(T.String()),
        children: T.Array(T.String()),
      })
      "
    `)

    const { refs, result } = toTypeBox(schemaWithRef, { canonicalizeRefName })
    const references = Object.entries(refs).map(
      ([ident, thunk]) => `const ${ident} = ${box.toString(thunk())}`
    )

    vi.expect.soft(format(
      [
        ...references,
        box.toString(
          result
        )
      ].join('\n')
    )).toMatchInlineSnapshot
      (`
      "const Name = T.String()
      T.Object({
        name: T.Optional(T.String()),
        children: T.Array(Name),
      })
      "
    `)
  })


  const isLiteral = (x: unknown) =>
    x == null || typeof x === 'boolean' || typeof x === 'number' || typeof x === 'string'

  vi.test('[JSON Schema -> zod]', () => {
    const toZod = JsonSchema.fold<z.ZodType>((x, ix) => {
      switch (true) {
        default: return x satisfies never
        case JsonSchema.isRef(x): return canonicalizeRefName(x.$ref) as never
        case JsonSchema.isNever(x): return z.never()
        case JsonSchema.isNull(x): return z.null()
        case JsonSchema.isBoolean(x): return z.boolean()
        case JsonSchema.isInteger(x): return z.int()
        case JsonSchema.isNumber(x): return z.number()
        case JsonSchema.isString(x): return z.string()
        case JsonSchema.isEnum(x): return z.enum(x.enum.reduce((acc, cur) => ({ ...acc, [String(cur)]: cur }), {}))
        case JsonSchema.isConst(x): {
          if (!(isLiteral(x.const))) throw Error('Illegal state')
          return z.literal(x.const)
        }
        case JsonSchema.isArray(x): return z.array(x.items)
        case JsonSchema.isRecord(x): {
          if (x.additionalProperties !== undefined) return z.record(z.string(), x.additionalProperties)
          else if (x.patternProperties !== undefined) return z.record(
            z.union(Object.keys(x.patternProperties).map((pattern) => z.literal(pattern))),
            z.union(Object.values(x.patternProperties))
          )
          else throw Error('Illegal state')
        }
        case JsonSchema.isUnion(x): return z.union(x.anyOf)
        case JsonSchema.isIntersection(x): return z.union(x.allOf)
        case JsonSchema.isTuple(x): return z.tuple(x.prefixItems as [])
        case JsonSchema.isObject(x): return z.object(
          Object.fromEntries(
            Object.entries(x.properties).map(
              ([k, v]) => [k, !x.required.includes(k) ? z.optional(v) : v]
            )
          )
        )
        case JsonSchema.isUnknown(x): return z.unknown()
      }
    })

    vi.expect.soft(format(
      zx.toString(
        toZod(schemaWithoutRef).result
      )
    )).toMatchInlineSnapshot
      (`
      "z.object({
        name: z.string().optional(),
        children: z.array(z.string()),
      })
      "
    `)

    const { refs, result } = toZod(schemaWithRef, { canonicalizeRefName })
    const references = Object.entries(refs).map(
      ([ident, thunk]) => `const ${ident} = ${zx.toString(thunk())}`
    )

    vi.expect.soft(format(
      [
        ...references,
        zx.toString(
          result
        )
      ].join('\n')
    )).toMatchInlineSnapshot
      (`
      "const Name = z.string()
      z.object({
        name: z.string().optional(),
        children: z.array(Name),
      })
      "
    `)

  })
})
