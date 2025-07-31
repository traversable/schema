import { z } from 'zod'
import type { Mut } from '@traversable/registry'
import { fn } from '@traversable/registry'
import { Json } from '@traversable/json'
import { toString } from './to-string.js'

/**
 * ## {@link fromConstant `zx.fromConstant`}
 *
 * Convert a blob of JSON data into a zod schema that represents that blob's least upper bound.
 *
 * @example
 * import { zx } from '@traversable/zod'
 *
 * let schema = zx.fromConstant({ abc: 'ABC', def: [1, 2, 3] })
 * //  ^? let schema: z.core.$ZodType<{ abc: "ABC", def: [1, 2, 3] }>
 *
 * console.log(zx.toString(schema))
 * // => z.object({ abc: z.literal("ABC"), def: z.tuple([ z.literal(1), z.literal(2), z.literal(3) ]) })
 */
export function fromConstant<S extends Mut<S>>(json: S): z.core.$ZodType<S>
export function fromConstant(json: Json): z.ZodUnknown
export function fromConstant(json: Json) {
  return Json.fold<z.ZodType>((x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x === undefined:
      case x === null:
      case x === true:
      case x === false:
      case typeof x === 'symbol':
      case typeof x === 'number':
      case typeof x === 'string': return z.literal(x)
      case Json.isObject(x): return z.strictObject(x)
      case Json.isArray(x): return z.tuple(x as [])
    }
  })(json as Json<z.ZodType>)
}

const fromConstant_writeable
  : (json: Json) => string
  = fn.flow(fromConstant, toString)

export type fromJson<T>
  = [T] extends [readonly []] ? z.ZodArray<z.ZodUnknown>
  : [T] extends [readonly [any]] ? z.ZodArray<fromJson<T[0]>>
  : [T] extends [readonly any[]] ? z.ZodArray<z.ZodUnion<{ [K in keyof T]: fromJson<T[K]> }>>
  : [T] extends [Record<string, any>] ? z.ZodObject<{ [K in keyof T]: fromJson<T[K]> }, z.core.$loose>
  : [T] extends [null | undefined] ? z.ZodNull
  : [T] extends [boolean] ? z.ZodBoolean
  : [T] extends [number] ? z.ZodNumber
  : [T] extends [string] ? z.ZodString
  : never

/**
 * ## {@link fromJson `zx.fromJson`}
 *
 * Convert a blob of JSON data into a zod schema that represents that blob's greatest lower bound.
 *
 * @example
 * import { zx } from '@traversable/zod'
 *
 * let ex_01 = zx.fromJson({ abc: 'ABC', def: [] })
 * //  ^? let ex_01: z.ZodObject<{ abc: z.ZodString, def: z.ZodArray<z.ZodUnknown> }>
 *
 * console.log(zx.toString(ex_01))
 * // => z.object({ abc: z.string(), def: z.array(z.unknown()) })
 *
 * let ex_02 = zx.fromJson({ abc: false, def: [123] })
 * //  ^? let ex_02: z.ZodObject<{ abc: z.ZodBoolean, def: z.ZodArray<z.ZodNumber> }>
 *
 * console.log(zx.toString(ex_02))
 * // => z.object({ abc: z.boolean(), def: z.array(z.number()) })
 *
 * let ex_03 = zx.fromJson({ abc: 123, def: ['ABC', null] })
 * //  ^? let ex_02: z.ZodObject<{ abc: z.ZodNumber, def: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNull]>> }>
 *
 * console.log(zx.toString(ex_03))
 * // => z.object({ abc: z.number(), def: z.array(z.union([z.string(), z.null()])) })
 */
export function fromJson<S extends Mut<S>, T = fromJson<S>>(json: S): T
export function fromJson(json: Json): z.ZodUnknown
export function fromJson(json: Json) {
  return Json.fold<z.ZodType>((x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x == null: return z.null()
      case x === true: return z.boolean()
      case x === false: return z.boolean()
      case typeof x === 'number': return z.number()
      case typeof x === 'string': return z.string()
      case Json.isObject(x): return z.looseObject(x)
      case Json.isArray(x): {
        switch (x.length) {
          case 0: return z.array(z.unknown())
          case 1: return z.array(x[0])
          default: return z.array(z.union(x))
        }
      }
    }
  })(json as Json<z.ZodType>)
}

const fromJson_writeable
  : (json: Json) => string
  = fn.flow(fromJson, toString)

/**
 * ## {@link fromConstant_writeable `zx.fromConstant.writeable`}
 *
 * Convert a blob of JSON data into a _stringified_ zod schema
 * that represents that blob's least upper bound.
 *
 * @example
 * import { zx } from '@traversable/zod'
 *
 * let ex_01 = zx.fromConstant.writeable({ abc: 'ABC', def: [1, 2, 3] })
 *
 * console.log(ex_01)
 * // => z.object({ abc: z.literal("ABC"), def: z.tuple([ z.literal(1), z.literal(2), z.literal(3) ]) })
 */
fromConstant.writeable = fromConstant_writeable

/**
 * ## {@link fromJson_writeable `zx.fromJson.writeable`}
 *
 * Convert a blob of JSON data into a _stringified_ zod schema
 * that represents that blob's greatest lower bound.
 *
 * @example
 * import { zx } from '@traversable/zod'
 *
 * let ex_01 = zx.fromJson.writeable({ abc: 'ABC', def: [] })
 *
 * console.log(ex_01)
 * // => z.object({ abc: z.string(), def: z.array(z.unknown()) })
 *
 * let ex_02 = zx.fromJson.writeable({ abc: false, def: [123] })
 *
 * console.log(ex_02)
 * // => z.object({ abc: z.boolean(), def: z.array(z.number()), })
 *
 * let ex_03 = zx.fromJson.writeable({ abc: 123, def: ['ABC', null] })
 *
 * console.log(ex_03)
 * // => z.object({ abc: z.number(), def: z.array(z.union([z.string(), z.null()])) })
 */
fromJson.writeable = fromJson_writeable
