import * as T from '@sinclair/typebox'
import {
  PatternNeverExact,
  PatternNumberExact,
  PatternStringExact,
} from '@sinclair/typebox/type'
import {
  Number_isFinite,
  Number_isSafeInteger,
  Object_keys,
  Object_values,
  parseKey,
} from '@traversable/registry'
import type { Type } from '@traversable/typebox-types'
import { F } from '@traversable/typebox-types'

export interface Options extends Partial<typeof defaults> {}
export interface Config extends Required<typeof defaults> {}

export const defaults = {
  /**
   * ## {@link defaults.namespaceAlias `box.toString.Options.namespaceAlias`}
   * 
   * By default, {@link toString `box.toString`} will prefix all schemas
   * with `T`.
   * 
   * If you'd like to change this behavior, you can configure this option using
   * the `namespaceAlias` option.
   * 
   * @example
   * import * as typebox from '@sinclair/typebox'
   * import { box } from '@traversable/typebox'
   * 
   * box.toString(typebox.Number())                                // => "T.Number()"
   * box.toString(typebox.Number(), { namespaceAlias: 'typebox' }) // => "typebox.Number()"
   */
  namespaceAlias: 'T' as string,
}

const PatternToType = {
  [PatternNumberExact]: 'T.Number()',
  [PatternStringExact]: 'T.String()',
  [PatternNeverExact]: 'T.Never()',
} as const

const applyIntegerBounds = (x: Type.Integer) => {
  const BOUNDS = [
    Number_isFinite(x.minimum) ? `minimum:${x.minimum}` : null,
    Number_isFinite(x.maximum) ? `maximum:${x.maximum}` : null,
  ].filter((_) => _ !== null)
  return BOUNDS.length === 0 ? '' : `{ ${BOUNDS.join(',')} }`
}

const applyBigIntBounds = (x: Type.BigInt) => {
  const BOUNDS = [
    typeof x.minimum === 'bigint' ? `minimum:${x.minimum}n` : null,
    typeof x.maximum === 'bigint' ? `maximum:${x.maximum}n` : null,
  ].filter((_) => _ !== null)
  return BOUNDS.length === 0 ? '' : `{${BOUNDS.join(',')}}`
}

const applyNumberBounds = (x: Type.Number) => {
  const BOUNDS = [
    Number_isFinite(x.minimum) ? `minimum:${x.minimum}` : null,
    Number_isFinite(x.maximum) ? `maximum:${x.maximum}` : null,
    Number_isFinite(x.exclusiveMinimum) ? `exclusiveMinimum:${x.exclusiveMinimum}` : null,
    Number_isFinite(x.exclusiveMaximum) ? `exclusiveMaximum:${x.exclusiveMaximum}` : null,
  ].filter((_) => _ !== null)
  return BOUNDS.length === 0 ? '' : `{${BOUNDS.join(',')}}`
}

const applyStringBounds = (x: Type.String) => {
  const BOUNDS = [
    Number_isSafeInteger(x.minLength) ? `minLength:${x.minLength}` : null,
    Number_isSafeInteger(x.maxLength) ? `maxLength:${x.maxLength}` : null,
  ].filter((_) => _ !== null)
  return BOUNDS.length === 0 ? '' : `{${BOUNDS.join(',')}}`
}

const applyArrayBounds = (x: Type.Array<string>) => {
  const BOUNDS = [
    Number_isSafeInteger(x.minItems) ? `minItems:${x.minItems}` : null,
    Number_isSafeInteger(x.maxItems) ? `maxItems:${x.maxItems}` : null,
  ].filter((_) => _ !== null)
  return BOUNDS.length === 0 ? '' : `,{${BOUNDS.join(',')}}`
}

const interpret = (options?: toString.Options) => F.fold<string>((x) => {
  const T = options?.namespaceAlias ?? defaults.namespaceAlias
  switch (true) {
    default: return x satisfies never
    case F.tagged('never')(x): return `${T}.Never()`
    case F.tagged('any')(x): return `${T}.Any()`
    case F.tagged('unknown')(x): return `${T}.Unknown()`
    case F.tagged('void')(x): return `${T}.Void()`
    case F.tagged('undefined')(x): return `${T}.Undefined()`
    case F.tagged('null')(x): return `${T}.Null()`
    case F.tagged('symbol')(x): return `${T}.Symbol()`
    case F.tagged('boolean')(x): return `${T}.Boolean()`
    case F.tagged('bigInt')(x): return `${T}.BigInt(${applyBigIntBounds(x)})`
    case F.tagged('integer')(x): return `${T}.Integer(${applyIntegerBounds(x)})`
    case F.tagged('number')(x): return `${T}.Number(${applyNumberBounds(x)})`
    case F.tagged('string')(x): return `${T}.String(${applyStringBounds(x)})`
    case F.tagged('date')(x): return `${T}.Date()`
    case F.tagged('optional')(x): return `${T}.Optional(${x.schema})`
    case F.tagged('literal')(x): return `${T}.Literal(${typeof x.const === 'string' ? `"${x.const}"` : x.const})`
    case F.tagged('array')(x): return `${T}.Array(${x.items}${applyArrayBounds(x)})`
    case F.tagged('allOf')(x): return `${T}.Intersect([${x.allOf.join(',')}])`
    case F.tagged('anyOf')(x): return `${T}.Union([${x.anyOf.join(',')}])`
    case F.tagged('object')(x): return `${T}.Object({${Object.entries(x.properties).map(([k, v]) => `${parseKey(k)}:${v}`)}})`
    case F.tagged('tuple')(x): return `${T}.Tuple([${x.items.join(',')}])`
    case F.tagged('record')(x): {
      const keys = Object_keys(x.patternProperties)
      const KEY = keys.includes(PatternNeverExact) ? 'never' : keys.map((k) => PatternToType[k]).join(' | ')
      return `${T}.Record(${KEY},${Object_values(x.patternProperties).join(' | ')})`
    }
  }
})

/**
 * ## {@link toString `box.toString`}
 *
 * Converts an arbitrary zod schema back into string form. Can be useful for code generation,
 * testing/debugging, and the occasional sanity check.
 *
 * @example
* import * as vi from "vitest"
* import * as T from "@sinclair/typebox"
* import { box } from "@traversable/typebox"
*
* vi.expect.soft(box.toString(
*   
* )).toMatchInlineSnapshot
*   ()
*
* vi.expect.soft(box.toString(
*   
* )).toMatchInlineSnapshot
*   ()
*/
export function toString(schema: T.TSchema, options?: toString.Options): string {
  return interpret(options)(schema as never)
}

export declare namespace toString {
  export { Options, Config }
}

