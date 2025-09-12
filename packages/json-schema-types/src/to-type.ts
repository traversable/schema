import type { Force } from '@traversable/registry'
import { escape, fn, Object_entries, parseKey, stringifyKey } from '@traversable/registry'
import { Json } from '@traversable/json'

import * as F from './functor.js'
import { canonizeRefName as canonizeRef } from './ref.js'
import * as JsonSchema from './types.js'
type JsonSchema<T = unknown> = import('./types.js').F<T>
import type { Index } from './functor.js'

type FoldIndex =
  & Partial<Index>
  & { canonizeRefName: {} & toType.Options['canonizeRefName'] }

function fold(schema: JsonSchema, index: FoldIndex) {
  return F.fold<string>((x, ix) => {
    switch (true) {
      default: return x satisfies never
      case JsonSchema.isRef(x): return index.canonizeRefName(x.$ref)
      case JsonSchema.isNever(x): return 'never'
      case JsonSchema.isNull(x): return 'null'
      case JsonSchema.isBoolean(x): return 'boolean'
      case JsonSchema.isInteger(x): return 'number'
      case JsonSchema.isNumber(x): return 'number'
      case JsonSchema.isString(x): return 'string'
      case JsonSchema.isConst(x): return Json.toString(x.const)
      case JsonSchema.isAnyOf(x): return x.anyOf.length === 0 ? 'never' : x.anyOf.length === 1 ? x.anyOf[0] : `(${x.anyOf.join(' | ')})`
      case JsonSchema.isOneOf(x): return x.oneOf.length === 0 ? 'never' : x.oneOf.length === 1 ? x.oneOf[0] : `(${x.oneOf.join(' | ')})`
      case JsonSchema.isAllOf(x): return x.allOf.length === 0 ? 'unknown' : x.allOf.length === 1 ? x.allOf[0] : `(${x.allOf.join(' & ')})`
      case JsonSchema.isArray(x): return `Array<${x.items}>`
      case JsonSchema.isEnum(x): return x.enum.map((v) => typeof v === 'string' ? `"${escape(v)}"` : `${v}`).join(' | ')
      case JsonSchema.isTuple(x): {
        if (x.prefixItems.length === 0) {
          return typeof x.items === 'string' ? `Array<${x.items}>` : '[]'
        } else {
          const REST = typeof x.items === 'string' ? `, ...${x.items}[]` : ''
          return `[${x.prefixItems.join(', ')}${REST}]`
        }
      }
      case JsonSchema.isObject(x): {
        const xs = Object_entries(x.properties).map(([k, v]) => `${parseKey(k)}${x.required && x.required.includes(k) ? '' : '?'}: ${v}`)
        return xs.length === 0 ? '{}' : `{ ${xs.join(', ')} }`
      }
      case JsonSchema.isRecord(x): {
        if (!x.patternProperties) return `Record<string, ${x.additionalProperties ?? 'unknown'}>`
        else {
          const patterns = Object_entries(x.patternProperties).map(([k, v]) => `${stringifyKey(k)}: ${v}`).join(', ')
          const patternProperties = patterns.length === 0 ? '{}' : `{ ${patterns} }`
          return x.additionalProperties
            ? `Record<string, ${x.additionalProperties}> & ${patternProperties}`
            : patternProperties
        }
      }
      case JsonSchema.isUnknown(x): return 'unknown'
    }
  })(schema, index)
}

/**
 * ## {@link toType `JsonSchema.toType`}
 * 
 * Convert a [JSON Schema](https://json-schema.org/) document into its corresponding TypeScript type.
 * 
 * @example
 * import { JsonSchema } from '@traversable/json-schema'
 * 
 * const MyJsonSchema = { type: 'boolean' }
 * 
 * console.log(JsonSchema.toType(MyJsonSchema)) 
 * // => "boolean"
 * 
 * // If you'd like to give the generated type a name, use the `typeName` option:
 * 
 * console.log(JsonSchema.toType(MyJsonSchema, { typeName: 'MyType' })) 
 * // => "type MyType = boolean"
 */

export function toType(schema: JsonSchema, options?: toType.Options): { refs: Record<string, string>, result: string } {
  const canonizeRefName = options?.canonizeRefName || canonizeRef
  const TYPE_NAME = typeof options?.typeName === 'string' ? `type ${options.typeName} = ` : ''
  const folded = fold(schema, { ...options, canonizeRefName })
  const refs = fn.map(folded.refs, (thunk, ref) => `type ${canonizeRefName(ref)} = ${thunk()}`)
  return {
    refs,
    result: `${TYPE_NAME}${folded.result}`
  }
}

export declare namespace toType {
  type Options = {
    /**
     * ### {@link Options `toType.Options.typeName`}
     * 
     * By default, {@link toType `JsonSchema.toType`} will generate an "inline" TypeScript type.
     * Use this option to have {@link toType `JsonSchema.toType`} generate a type alias with the
     * name you provide.
     */
    typeName?: string
    /**
     * ### {@link Options `toType.Options.canonizeRefName`}
     * 
     * Allows users to customize how refs are translated into an identifier.
     * 
     * By default, the ref's last segment is taken and converted to pascal case.
     */
    canonizeRefName?: (x: string) => string
  }
}

type Intersect<S, Out = unknown> = S extends [infer H, ...infer T] ? Intersect<T, Out & toType<H>> : Out

export type toType<S>
  = [keyof S] extends [never] ? unknown
  : S extends { anyOf: infer T extends readonly any[] }
  ? T[number] extends infer R ? R extends R ? toType<R> : never : never
  : S extends { oneOf: infer T extends readonly any[] }
  ? T[number] extends infer R ? R extends R ? toType<R> : never : never
  : S extends { allOf: infer T } ? Intersect<T>
  : S extends { type: 'null' } ? null
  : S extends { type: 'boolean' } ? boolean
  : S extends { type: 'integer' } ? number
  : S extends { type: 'number' } ? number
  : S extends { type: 'string' } ? string
  : S extends { const: any } ? S['const']
  : S extends { enum: readonly any[] } ? S['enum'][number]
  : S extends { type: 'array', items: false, prefixItems: infer T } ? { [I in keyof T]: toType<S> }
  : S extends { type: 'array', items: any, prefixItems: readonly any[] }
  ? [...S['prefixItems'], ...S['items'][]] extends infer T
  ? { [I in keyof T]: toType<T[I]> }
  : never
  : S extends { type: 'array', prefixItems: infer T } ? { [I in keyof T]: toType<T[I]> }
  : S extends { type: 'array', items: infer T } ? toType<T>[]
  : S extends { type: 'object', additionalProperties: infer R, patternProperties: infer T } ?
  & Record<string, toType<R>>
  & Record<keyof T, toType<T[keyof T]>>
  : S extends { type: 'object', additionalProperties: infer R } ? Record<string, toType<R>>
  : S extends { type: 'object', patternProperties: infer T } ? Record<keyof T, toType<T[keyof T]>>
  : S extends { type: 'object', properties: infer T, required: infer KS extends readonly string[] } ?
  Force<
    & { [K in keyof T as K extends KS[number] ? K : never]-?: toType<T[K]> }
    & { [K in keyof T as K extends KS[number] ? never : K]+?: toType<T[K]> }
  >
  : never
