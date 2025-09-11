import * as vi from 'vitest'
import prettier from '@prettier/sync'
import * as Zod from 'zod'
import * as TypeBox from '@sinclair/typebox'

import { parseKey } from '@traversable/registry'
import { t } from '@traversable/schema'
import { JsonSchema, canonicalizeRefName } from '@traversable/json-schema'
// These packages are only imported for their `.toString` methods:
import { zx } from '@traversable/zod'
import { box, toType } from '@traversable/typebox'

/**
 * Motivating issue:
 * https://github.com/traversable/schema/issues/456
 * 
 * > [!NOTE]:
 * > Blame the sluggish test times on `@prettier/sync`
 */

const format = (src: string) =>
  prettier.format(src, { parser: 'typescript', semi: false, printWidth: 45 })

const isLiteral = (x: unknown) =>
  x == null || typeof x === 'boolean' || typeof x === 'number' || typeof x === 'string'

const schema = {
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

/////////////////////////
///  PRESERVING REFS  ///  
/////////////////////////

vi.describe('[JSON Schema -> TypeScript]: preserving refs', () => {
  const toTypeScript = JsonSchema.fold<string>((x, ix, original) => {
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
      case JsonSchema.isAnyOf(x): return x.anyOf.length === 0 ? 'never' : `(${x.anyOf.join(' | ')})`
      case JsonSchema.isAllOf(x): return x.allOf.length === 0 ? 'unknown' : `(${x.allOf.join(' & ')})`
      case JsonSchema.isTuple(x): return `[${x.prefixItems.join(', ')}]`
      case JsonSchema.isRecord(x): {
        if (x.additionalProperties !== undefined) return `Record<string, ${x.additionalProperties}>`
        else if (x.patternProperties !== undefined) return (
          'Record<'
          + Object.keys(x.patternProperties).map((p) => JSON.stringify(p)).join(' | ')
          + ', '
          + Object.values(x.patternProperties).join(' | ')
          + '>'
        )
        else throw Error('Illegal state')
      }
      case JsonSchema.isObject(x): {
        return `{ ${Object.entries(x.properties)
          .map(([k, v]) => `${parseKey(k)}${x.required.includes(k) ? '' : '?'}: ${v}`)
          .join(', ')
          } }`
      }
      case JsonSchema.isUnknown(x): return 'unknown'
    }
  })

  vi.test('preserves refs', () => {
    const target = toTypeScript(schema)

    const refs = Object.entries(target.refs).map(
      ([ident, thunk]) => `type ${canonicalizeRefName(ident)} = ${thunk()}`
    )

    vi.expect.soft(//format(
      [
        ...refs,
        null,
        'type MyType = ' + target.result
      ].join('\n')
      //)
    ).toMatchInlineSnapshot
      (`
      "type Name = string

      type MyType = { name?: string, children: Array<Name> }"
    `)
  })
})

vi.describe('[JSON Schema -> Zod]: preserving refs', () => {
  const toZod = JsonSchema.fold<Zod.ZodType>((x, ix, original) => {
    switch (true) {
      default: return x satisfies never
      case JsonSchema.isRef(x): return canonicalizeRefName(x.$ref) as never
      case JsonSchema.isNever(x): return Zod.never()
      case JsonSchema.isNull(x): return Zod.null()
      case JsonSchema.isBoolean(x): return Zod.boolean()
      case JsonSchema.isInteger(x): return Zod.int()
      case JsonSchema.isNumber(x): return Zod.number()
      case JsonSchema.isString(x): return Zod.string()
      case JsonSchema.isEnum(x): return Zod.enum(
        x.enum.reduce((acc, cur) => ({ ...acc, [JSON.stringify(cur)]: cur }), {})
      )
      case JsonSchema.isConst(x): {
        if (!(isLiteral(x.const))) throw Error('Illegal state')
        return Zod.literal(x.const)
      }
      case JsonSchema.isArray(x): return Zod.array(x.items)
      case JsonSchema.isRecord(x): {
        if (x.additionalProperties !== undefined) return Zod.record(Zod.string(), x.additionalProperties)
        else if (x.patternProperties !== undefined) return Zod.record(
          Zod.union(Object.keys(x.patternProperties).map((pattern) => Zod.literal(pattern))),
          Zod.union(Object.values(x.patternProperties))
        )
        else throw Error('Illegal state')
      }
      case JsonSchema.isAnyOf(x): return Zod.union(x.anyOf)
      case JsonSchema.isOneOf(x): return Zod.union(x.oneOf)
      case JsonSchema.isAllOf(x): return Zod.union(x.allOf)
      case JsonSchema.isTuple(x): return Zod.tuple(x.prefixItems as [])
      case JsonSchema.isObject(x): return Zod.object(
        Object.fromEntries(
          Object.entries(x.properties).map(
            ([k, v]) => [k, !x.required.includes(k) ? Zod.optional(v) : v]
          )
        )
      )
      case JsonSchema.isUnknown(x): return Zod.unknown()
    }
  })

  vi.test('preserves refs', () => {
    const target = toZod(schema)

    const refs = Object.entries(target.refs).map(
      ([ident, thunk]) => `const ${canonicalizeRefName(ident)} = ${zx.toString(thunk())}`
    )

    vi.expect.soft(format(
      [
        ...refs,
        null,
        'const MySchema = ' + zx.toString(target.result)
      ].join('\n')
    )).toMatchInlineSnapshot
      (`
      "const Name = z.string()

      const MySchema = z.object({
        name: z.string().optional(),
        children: z.array(Name),
      })
      "
    `)
  })
})

vi.describe('[JSON Schema -> ArkType]: preserving refs', () => {
  const toArkType = JsonSchema.fold<string>((x, ix, original) => {
    switch (true) {
      default: return x satisfies never as never
      case JsonSchema.isRef(x): return canonicalizeRefName(x.$ref)
      case JsonSchema.isNever(x): return `'never'`
      case JsonSchema.isNull(x): return `'null'`
      case JsonSchema.isBoolean(x): return `'boolean'`
      case JsonSchema.isInteger(x): return `'number.integer'`
      case JsonSchema.isNumber(x): return `'number'`
      case JsonSchema.isString(x): return `'string'`
      case JsonSchema.isEnum(x): return `type.enumerated(${x.enum.join(', ')})`
      case JsonSchema.isConst(x): return `type(${JSON.stringify(x.const)})`
      case JsonSchema.isAnyOf(x): return x.anyOf.reduce((acc, cur) => `${acc}.or(${cur})`, '')
      case JsonSchema.isOneOf(x): return x.oneOf.reduce((acc, cur) => `${acc}.or(${cur})`, '')
      case JsonSchema.isAllOf(x): return x.allOf.reduce((acc, cur) => `${acc}.and(${cur})`, '')
      case JsonSchema.isArray(x): return `type(${x.items}, '[]')`
      case JsonSchema.isTuple(x): return `type(${x.prefixItems})`
      case JsonSchema.isRecord(x): {
        if (x.additionalProperties !== undefined) return `type.Record('string', ${x.additionalProperties})`
        else if (x.patternProperties !== undefined) return (
          'type.Record('
          + Object.keys(x.patternProperties).reduce((acc, cur) => `${acc}.or(${cur})`, '')
          + ', '
          + Object.values(x.patternProperties).reduce((acc, cur) => `${acc}.or(${cur})`, '')
          + ')'
        )
        else throw Error('Illegal state')
      }
      case JsonSchema.isObject(x): return (
        `type({${Object.entries(x.properties)
          .map(([k, v]) => `${parseKey(x.required.includes(k) ? k : `${k}?`)}: ${v}`)
          .join(', ')
        } })`
      )
      case JsonSchema.isUnknown(x): return 'unknown'
    }
  })

  vi.test('preserves refs', () => {
    const target = toArkType(schema)

    const refs = Object.entries(target.refs).map(
      ([ident, thunk]) => `const ${canonicalizeRefName(ident)} = type(${thunk()})`
    )

    vi.expect.soft(format(
      [
        ...refs,
        null,
        'const MySchema = ' + target.result
      ].join('\n')
    )).toMatchInlineSnapshot
      (`
      "const Name = type("string")

      const MySchema = type({
        "name?": "string",
        children: type(Name, "[]"),
      })
      "
    `)
  })
})

vi.describe('[JSON Schema -> TypeBox]: preserving refs', () => {
  const toTypeBox = JsonSchema.fold<TypeBox.TSchema>((x) => {
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
      case JsonSchema.isAnyOf(x): return TypeBox.Union([...x.anyOf])
      case JsonSchema.isOneOf(x): return TypeBox.Union([...x.oneOf])
      case JsonSchema.isAllOf(x): return TypeBox.Intersect([...x.allOf])
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

  vi.test('preserves refs', () => {
    const target = toTypeBox(schema)

    const refs = Object.entries(target.refs).map(
      ([ident, thunk]) => `const ${canonicalizeRefName(ident)} = ${box.toString(thunk())}`
    )

    vi.expect.soft(format(
      [
        ...refs,
        null,
        'const MySchema = ' + box.toString(target.result)
      ].join('\n')
    )).toMatchInlineSnapshot
      (`
      "const Name = T.String()

      const MySchema = T.Object({
        name: T.Optional(T.String()),
        children: T.Array(Name),
      })
      "
    `)
  })
})

vi.describe('[JSON Schema -> Traversable]: preserving refs', () => {
  const toTraversable = JsonSchema.fold<t.Type>((x, ix, original) => {
    switch (true) {
      default: return x satisfies never
      case JsonSchema.isRef(x): return t.ref.def(ix.refs[x.$ref](), canonicalizeRefName(x.$ref))
      case JsonSchema.isNever(x): return t.never
      case JsonSchema.isNull(x): return t.null
      case JsonSchema.isBoolean(x): return t.boolean
      case JsonSchema.isInteger(x): return t.integer
      case JsonSchema.isNumber(x): return t.number
      case JsonSchema.isString(x): return t.string
      case JsonSchema.isEnum(x): return t.enum(x.enum.reduce((acc, cur) => ({ ...acc, [String(cur)]: cur }), {})) as never
      case JsonSchema.isConst(x): return t.eq(x.const as {})
      case JsonSchema.isArray(x): return t.array(x.items)
      case JsonSchema.isRecord(x): {
        if (x.additionalProperties !== undefined) return t.record(x.additionalProperties)
        else if (x.patternProperties !== undefined) return t.record(t.union(...Object.values(x.patternProperties)))
        else throw Error('Illegal state')
      }
      case JsonSchema.isAnyOf(x): return t.union(...x.anyOf)
      case JsonSchema.isOneOf(x): return t.union(...x.oneOf)
      case JsonSchema.isAllOf(x): return t.intersect(...x.allOf)
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

  vi.test('preserves refs', () => {
    const target = toTraversable(schema)

    const refs = Object.entries(target.refs).map(
      ([ident, thunk]) => `const ${canonicalizeRefName(ident)} = ${thunk()}`
    )

    vi.expect.soft(format(
      [
        ...refs,
        null,
        'const MySchema = ' + target.result.toString()
      ].join('\n')
    )).toMatchInlineSnapshot
      (`
      "const Name = t.string

      const MySchema = t.object({
        name: t.optional(t.string),
        children: t.array(Name),
      })
      "
    `)
  })
})

///////////////////////
///  INLINING REFS  ///  
///////////////////////

vi.describe('[JSON Schema -> TypeScript]: inlining refs', () => {
  const toTypeScript = JsonSchema.fold<string>((x, ix, original) => {
    switch (true) {
      default: return x satisfies never
      // case JsonSchema.isRef(x): return canonicalizeRefName(x.$ref)
      case JsonSchema.isRef(x): return ix.refs[x.$ref]()
      //                                𐙘___________𐙘 lookup ref in ix.refs
      case JsonSchema.isNever(x): return 'never'
      case JsonSchema.isNull(x): return 'null'
      case JsonSchema.isBoolean(x): return 'boolean'
      case JsonSchema.isInteger(x): return 'number'
      case JsonSchema.isNumber(x): return 'number'
      case JsonSchema.isString(x): return 'string'
      case JsonSchema.isEnum(x): return `(${x.enum.join(' | ')})`
      case JsonSchema.isConst(x): return JSON.stringify(x.const)
      case JsonSchema.isArray(x): return `Array<${x.items}>`
      case JsonSchema.isAnyOf(x): return x.anyOf.length === 0 ? 'never' : `(${x.anyOf.join(' | ')})`
      case JsonSchema.isOneOf(x): return x.oneOf.length === 0 ? 'never' : `(${x.oneOf.join(' | ')})`
      case JsonSchema.isAllOf(x): return x.allOf.length === 0 ? 'unknown' : `(${x.allOf.join(' & ')})`
      case JsonSchema.isTuple(x): return `[${x.prefixItems.join(', ')}]`
      case JsonSchema.isRecord(x): {
        if (x.additionalProperties !== undefined) return `Record<string, ${x.additionalProperties}>`
        else if (x.patternProperties !== undefined) return (
          'Record<'
          + Object.keys(x.patternProperties).map((p) => JSON.stringify(p)).join(' | ')
          + ', '
          + Object.values(x.patternProperties).join(' | ')
          + '>'
        )
        else throw Error('Illegal state')
      }
      case JsonSchema.isObject(x): {
        return `{ ${Object.entries(x.properties)
          .map(([k, v]) => `${parseKey(k)}${x.required.includes(k) ? '' : '?'}: ${v}`)
          .join(', ')
          } }`
      }
      case JsonSchema.isUnknown(x): return 'unknown'
    }
  })

  vi.test('inlines refs', () => {
    const target = toTypeScript(
      schema,
      // { canonicalizeRefName }
    )

    vi.expect.soft(
      target.refs
    ).toMatchInlineSnapshot
      (`
      {
        "#/$defs/name": [Function],
      }
    `)

    vi.expect.soft(format(
      'type MyType = ' + target.result
    )).toMatchInlineSnapshot
      (`
      "type MyType = {
        name?: string
        children: Array<string>
      }
      "
    `)
  })
})

vi.describe('[JSON Schema -> Zod]: inlining refs', () => {
  const toZod = JsonSchema.fold<Zod.ZodType>((x, ix, original) => {
    switch (true) {
      default: return x satisfies never
      // case JsonSchema.isRef(x): return canonicalizeRefName(x.$ref) as never
      case JsonSchema.isRef(x): return ix.refs[x.$ref]()
      case JsonSchema.isNever(x): return Zod.never()
      case JsonSchema.isNull(x): return Zod.null()
      case JsonSchema.isBoolean(x): return Zod.boolean()
      case JsonSchema.isInteger(x): return Zod.int()
      case JsonSchema.isNumber(x): return Zod.number()
      case JsonSchema.isString(x): return Zod.string()
      case JsonSchema.isEnum(x): return Zod.enum(
        x.enum.reduce((acc, cur) => ({ ...acc, [JSON.stringify(cur)]: cur }), {})
      )
      case JsonSchema.isConst(x): {
        if (!(isLiteral(x.const))) throw Error('Illegal state')
        return Zod.literal(x.const)
      }
      case JsonSchema.isArray(x): return Zod.array(x.items)
      case JsonSchema.isRecord(x): {
        if (x.additionalProperties !== undefined) return Zod.record(Zod.string(), x.additionalProperties)
        else if (x.patternProperties !== undefined) return Zod.record(
          Zod.union(Object.keys(x.patternProperties).map((pattern) => Zod.literal(pattern))),
          Zod.union(Object.values(x.patternProperties))
        )
        else throw Error('Illegal state')
      }
      case JsonSchema.isAnyOf(x): return Zod.union(x.anyOf)
      case JsonSchema.isOneOf(x): return Zod.union(x.oneOf)
      case JsonSchema.isAllOf(x): return Zod.union(x.allOf)
      case JsonSchema.isTuple(x): return Zod.tuple(x.prefixItems as [])
      case JsonSchema.isObject(x): return Zod.object(
        Object.fromEntries(
          Object.entries(x.properties).map(
            ([k, v]) => [k, !x.required.includes(k) ? Zod.optional(v) : v]
          )
        )
      )
      case JsonSchema.isUnknown(x): return Zod.unknown()
    }
  })

  vi.test('inlines refs', () => {
    const target = toZod(
      schema,
      // { canonicalizeRefName }
    )

    vi.expect.soft(
      target.refs
    ).toMatchInlineSnapshot
      (`
      {
        "#/$defs/name": [Function],
      }
    `)

    vi.expect.soft(format(
      'const MySchema = ' + zx.toString(target.result)
    )).toMatchInlineSnapshot
      (`
      "const MySchema = z.object({
        name: z.string().optional(),
        children: z.array(z.string()),
      })
      "
    `)
  })
})

vi.describe('[JSON Schema -> ArkType]: inlining refs', () => {
  const toArkType = JsonSchema.fold<string>((x, ix, original) => {
    switch (true) {
      default: return x satisfies never as never
      // case JsonSchema.isRef(x): return canonicalizeRefName(x.$ref)
      case JsonSchema.isRef(x): return ix.refs[x.$ref]()
      case JsonSchema.isNever(x): return `'never'`
      case JsonSchema.isNull(x): return `'null'`
      case JsonSchema.isBoolean(x): return `'boolean'`
      case JsonSchema.isInteger(x): return `'number.integer'`
      case JsonSchema.isNumber(x): return `'number'`
      case JsonSchema.isString(x): return `'string'`
      case JsonSchema.isEnum(x): return `type.enumerated(${x.enum.join(', ')})`
      case JsonSchema.isConst(x): return `type(${JSON.stringify(x.const)})`
      case JsonSchema.isAnyOf(x): return x.anyOf.reduce((acc, cur) => `${acc}.or(${cur})`, '')
      case JsonSchema.isOneOf(x): return x.oneOf.reduce((acc, cur) => `${acc}.or(${cur})`, '')
      case JsonSchema.isAllOf(x): return x.allOf.reduce((acc, cur) => `${acc}.and(${cur})`, '')
      case JsonSchema.isArray(x): return `type(${x.items}, '[]')`
      case JsonSchema.isTuple(x): return `type(${x.prefixItems})`
      case JsonSchema.isRecord(x): {
        if (x.additionalProperties !== undefined) return `type.Record('string', ${x.additionalProperties})`
        else if (x.patternProperties !== undefined) return (
          'type.Record('
          + Object.keys(x.patternProperties).reduce((acc, cur) => `${acc}.or(${cur})`, '')
          + ', '
          + Object.values(x.patternProperties).reduce((acc, cur) => `${acc}.or(${cur})`, '')
          + ')'
        )
        else throw Error('Illegal state')
      }
      case JsonSchema.isObject(x): return (
        `type({${Object.entries(x.properties)
          .map(([k, v]) => `${parseKey(x.required.includes(k) ? k : `${k}?`)}: ${v}`)
          .join(', ')
        } })`
      )
      case JsonSchema.isUnknown(x): return 'unknown'
    }
  })

  vi.test('inlines refs', () => {
    const target = toArkType(
      schema,
      // { canonicalizeRefName }
    )

    vi.expect.soft(
      target.refs
    ).toMatchInlineSnapshot
      (`
      {
        "#/$defs/name": [Function],
      }
    `)

    vi.expect.soft(format(
      'const MySchema = ' + target.result
    )).toMatchInlineSnapshot
      (`
      "const MySchema = type({
        "name?": "string",
        children: type("string", "[]"),
      })
      "
    `)
  })
})

vi.describe('[JSON Schema -> TypeBox]: inlining refs', () => {
  const toTypeBox = JsonSchema.fold<TypeBox.TSchema>((x, ix, original) => {
    switch (true) {
      default: return x satisfies never
      // case JsonSchema.isRef(x): return TypeBox.Ref(canonicalizeRefName(x.$ref))
      case JsonSchema.isRef(x): return ix.refs[x.$ref]()
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
      case JsonSchema.isAnyOf(x): return TypeBox.Union([...x.anyOf])
      case JsonSchema.isOneOf(x): return TypeBox.Union([...x.oneOf])
      case JsonSchema.isAllOf(x): return TypeBox.Intersect([...x.allOf])
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

  vi.test('inlines refs', () => {
    const target = toTypeBox(
      schema,
      // { canonicalizeRefName }
    )

    vi.expect.soft(
      target.refs
    ).toMatchInlineSnapshot
      (`
      {
        "#/$defs/name": [Function],
      }
    `)

    vi.expect.soft(format(
      'const MySchema = ' + box.toString(target.result)
    )).toMatchInlineSnapshot
      (`
      "const MySchema = T.Object({
        name: T.Optional(T.String()),
        children: T.Array(T.String()),
      })
      "
    `)
  })
})

vi.describe('[JSON Schema -> Traversable]: inlining refs', () => {
  const toTraversable = JsonSchema.fold<t.Type>((x, ix, original) => {
    switch (true) {
      default: return x satisfies never
      // case JsonSchema.isRef(x): return t.ref.def(ix.refs.get(x.$ref)?.(), canonicalizeRefName(x.$ref))
      case JsonSchema.isRef(x): return ix.refs[x.$ref]()
      case JsonSchema.isNever(x): return t.never
      case JsonSchema.isNull(x): return t.null
      case JsonSchema.isBoolean(x): return t.boolean
      case JsonSchema.isInteger(x): return t.integer
      case JsonSchema.isNumber(x): return t.number
      case JsonSchema.isString(x): return t.string
      case JsonSchema.isEnum(x): return t.enum(
        x.enum.reduce((acc, cur) => ({ ...acc, [String(cur)]: cur }), {})
      ) as never
      case JsonSchema.isConst(x): return t.eq(x.const as {})
      case JsonSchema.isArray(x): return t.array(x.items)
      case JsonSchema.isRecord(x): {
        if (x.additionalProperties !== undefined) return t.record(x.additionalProperties)
        else if (x.patternProperties !== undefined) return t.record(t.union(...Object.values(x.patternProperties)))
        else throw Error('Illegal state')
      }
      case JsonSchema.isAnyOf(x): return t.union(...x.anyOf)
      case JsonSchema.isOneOf(x): return t.union(...x.oneOf)
      case JsonSchema.isAllOf(x): return t.intersect(...x.allOf)
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

  vi.test('inlines refs', () => {
    const target = toTraversable(
      schema,
      // { canonicalizeRefName }
    )

    vi.expect.soft(
      target.refs
    ).toMatchInlineSnapshot
      (`
      {
        "#/$defs/name": [Function],
      }
    `)

    vi.expect.soft(format(
      'const MySchema = ' + target.result.toString()
    )).toMatchInlineSnapshot
      (`
      "const MySchema = t.object({
        name: t.optional(t.string),
        children: t.array(t.string),
      })
      "
    `)
  })
})
