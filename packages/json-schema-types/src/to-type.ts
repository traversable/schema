import type { Force } from '@traversable/registry'
import { escape, Object_entries, Object_keys, Object_values, parseKey, stringifyKey } from '@traversable/registry'
import { Json } from '@traversable/json'

import { fold } from './functor.js'
import {} from './utils.js'
import * as JsonSchema from './types.js'
type JsonSchema<T = unknown> = import('./types.js').JsonSchema<T>

const jsonSchemaToType = fold<string>((x) => {
  switch (true) {
    default: return x satisfies never
    case JsonSchema.isNever(x): return 'never'
    case JsonSchema.isNull(x): return 'null'
    case JsonSchema.isBoolean(x): return 'boolean'
    case JsonSchema.isInteger(x): return 'number'
    case JsonSchema.isNumber(x): return 'number'
    case JsonSchema.isString(x): return 'string'
    case JsonSchema.isConst(x): return Json.toString(x.const)
    case JsonSchema.isUnion(x): return x.anyOf.length === 0 ? 'never' : x.anyOf.join(' | ')
    case JsonSchema.isIntersection(x): return x.allOf.length === 0 ? 'unknown' : x.allOf.join(' & ')
    case JsonSchema.isArray(x): return `Array<${x.items}>`
    case JsonSchema.isEnum(x): return x.enum.map((v) => typeof v === 'string' ? `"${escape(v)}"` : `${v}`).join(' | ')
    case JsonSchema.isTuple(x): return `[${x.prefixItems.join(', ')}${typeof x.items === 'string' ? `, ...${x.items}[]` : ''}]`
    case JsonSchema.isObject(x): {
      const xs = Object_entries(x.properties).map(([k, v]) => `${parseKey(k)}${x.required.includes(k) ? '' : '?'}: ${v}`)
      return xs.length === 0 ? '{}' : `{ ${xs.join(', ')} }`
    }
    case JsonSchema.isRecord(x): {
      if (!x.patternProperties) return `Record<string, ${x.additionalProperties ?? 'unknown'}>`
      else {
        const patternKeys = Object_keys(x.patternProperties).map((k) => `${stringifyKey(k)}`).join(' | ')
        const patternValues = Object_values(x.patternProperties).join(' | ')
        return x.additionalProperties
          ? `Record<string, ${x.additionalProperties}> & Record<${patternKeys}, ${patternValues}>`
          : `Record<${patternKeys}, ${patternValues}>`
      }
    }
    case JsonSchema.isUnknown(x): return 'unknown'
  }
})

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
export function toType(schema: JsonSchema, options?: toType.Options): string {
  const TYPE_NAME = typeof options?.typeName === 'string' ? `type ${options.typeName} = ` : ''
  return `${TYPE_NAME}${jsonSchemaToType(schema)}`
}

export declare namespace toType {
  type Options = {
    /**
     * ### {@link Options `JsonSchema.Options.typeName`}
     * 
     * By default, {@link toType `JsonSchema.toType`} will generate an "inline" TypeScript type.
     * Use this option to have {@link toType `JsonSchema.toType`} generate a type alias with the
     * name you provide.
     */
    typeName?: string
  }
}

type Intersect<S, Out = unknown> = S extends [infer H, ...infer T] ? Intersect<T, Out & toType<H>> : Out

export type toType<S>
  = [keyof S] extends [never] ? unknown
  : S extends { anyOf: infer T extends readonly any[] }
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
  : S extends { type: 'object', properties: infer T, required: infer KS extends string[] } ?
  Force<
    & { [K in keyof T as K extends KS[number] ? K : never]-?: toType<T[K]> }
    & { [K in keyof T as K extends KS[number] ? never : K]+?: toType<T[K]> }
  >
  : never
