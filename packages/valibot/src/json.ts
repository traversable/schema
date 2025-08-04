import * as v from 'valibot'
import { Array_isArray, fn } from '@traversable/registry'
import { Json } from '@traversable/json'
import type { AnyValibotSchema } from '@traversable/valibot-types'
import { toString } from '@traversable/valibot-types'

/**
 * ## {@link fromConstant `vx.fromConstant`}
 *
 * Convert a blob of JSON data into a valibot schema that represents that blob's least upper bound.
 *
 * @example
 * import { vx } from '@traversable/valibot'
 *
 * let schema = vx.fromConstant({ abc: 'ABC', def: [1, 2, 3] })
 * //  ^? let schema: v.BaseSchema<
 * //       { readonly abc: "ABC", readonly def: readonly [1, 2, 3] },
 * //       { readonly abc: "ABC", readonly def: readonly [1, 2, 3] },
 * //       v.BaseIssue<unknown>
 * //     >
 *
 * console.log(vx.toString(schema))
 * // => 
 * // v.object({
 * //   abc: v.literal("ABC"),
 * //   def: v.tuple([
 * //     v.literal(1),
 * //     v.literal(2),
 * //     v.literal(3)
 * //   ]) 
 * // })
 */

export function fromConstant<const S>(json: S): v.BaseSchema<S, S, v.BaseIssue<unknown>>
export function fromConstant(json: Json): AnyValibotSchema
export function fromConstant(json: Json) {
  return Json.fold<AnyValibotSchema>((x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x === null: return v.null()
      case x === undefined: return v.undefined()
      case typeof x === 'symbol':
      case typeof x === 'boolean':
      case typeof x === 'number':
      case typeof x === 'bigint':
      case typeof x === 'string': return v.literal(x)
      case Array_isArray(x): return x.length === 0 ? v.strictTuple([]) : v.strictTuple(x)
      case !!x && typeof x === 'object': return v.strictObject(x)
    }
  })(json as Json<AnyValibotSchema>)
}

const fromConstant_writeable
  : (json: Json) => string
  = fn.flow(fromConstant, toString)

/**
 * ## {@link fromJson `vx.fromJson`}
 *
 * Convert a blob of JSON data into a valibot schema that represents that blob's greatest lower bound.
 *
 * @example
 * import { vx } from '@traversable/valibot'
 *
 * let ex_01 = vx.fromJson({ abc: 'ABC', def: [] })
 * 
 * console.log(vx.toString(ex_01))
 * // => v.object({ abc: v.string(), def: v.array(v.unknown()) })
 *
 * let ex_02 = vx.fromJson({ abc: false, def: [123] })
 *
 * console.log(vx.toString(ex_02))
 * // => v.object({ abc: v.boolean(), def: v.array(v.number()) })
 *
 * let ex_03 = vx.fromJson({ abc: 123, def: ['ABC', null] })
 *
 * console.log(vx.toString(ex_03))
 * // => v.object({ abc: v.number(), def: v.array(v.union([v.string(), v.null()])) })
 */

export function fromJson(json: Json): AnyValibotSchema
export function fromJson(json: Json): AnyValibotSchema
export function fromJson(json: Json) {
  return Json.fold<AnyValibotSchema>((x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x == null: return v.null()
      case x === true: return v.boolean()
      case x === false: return v.boolean()
      case typeof x === 'number': return v.number()
      case typeof x === 'string': return v.string()
      case Json.isObject(x): return v.looseObject(x)
      case Json.isArray(x): {
        switch (x.length) {
          case 0: return v.array(v.unknown())
          case 1: return v.array(x[0])
          default: return v.array(v.union(x))
        }
      }
    }
  })(json as Json<AnyValibotSchema>)
}

const fromJson_writeable
  : (json: Json) => string
  = fn.flow(fromJson, toString)

/**
 * ## {@link fromConstant_writeable `vx.fromConstant.writeable`}
 *
 * Convert a blob of JSON data into a _stringified_ valibot schema
 * that represents that blob's least upper bound.
 *
 * @example
* import { vx } from '@traversable/valibot'
*
* let ex_01 = vx.fromConstant.writeable({ abc: 'ABC', def: [1, 2, 3] })
*
* console.log(ex_01)
* // => v.object({ abc: v.literal("ABC"), def: v.tuple([v.literal(1), v.literal(2), v.literal(3)]) })
*/
fromConstant.writeable = fromConstant_writeable

/**
 * ## {@link fromJson_writeable `vx.fromJson.writeable`}
 *
 * Convert a blob of JSON data into a _stringified_ valibot schema
 * that represents that blob's greatest lower bound.
 *
 * @example
 * import { vx } from '@traversable/valibot'
 *
 * let ex_01 = vx.fromJson.writeable({ abc: 'ABC', def: [] })
 *
 * console.log(ex_01)
 * // => v.object({ abc: v.string(), def: v.array(v.unknown()) })
 *
 * let ex_02 = vx.fromJson.writeable({ abc: false, def: [123] })
 *
 * console.log(ex_02)
 * // => v.object({ abc: v.boolean(), def: v.array(v.number()) })
 *
 * let ex_03 = vx.fromJson.writeable({ abc: 123, def: ['ABC', null] })
 *
 * console.log(ex_03)
 * // => v.object({ abc: v.number(), def: v.array(v.union([v.string(), v.null()])) })
 */
fromJson.writeable = fromJson_writeable
