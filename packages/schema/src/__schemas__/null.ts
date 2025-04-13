/**  
 * null_ schema
 * made with ᯓᡣ𐭩 by @traversable/schema
 */
import type { Equal, Unknown } from '@traversable/registry'
import { Object_assign, Object_is, URI } from '@traversable/registry'
import type { t } from '../_exports.js'
import type { ValidationFn } from '@traversable/derive-validators'
import { NullaryErrors } from '@traversable/derive-validators'
////////////////////
///    equals    ///
export type equals = Equal<null>
export function equals(left: null, right: null): boolean {
  return Object_is(left, right)
}
///    equals    ///
////////////////////
//////////////////////////
///    toJsonSchema    ///
export interface toJsonSchema { (): { type: 'null', enum: [null] } }
export function toJsonSchema(): toJsonSchema {
  function nullToJsonSchema() { return { type: 'null' as const, enum: [null] satisfies [any] } }
  return nullToJsonSchema
}
///    toJsonSchema    ///
//////////////////////////
//////////////////////
///    toString    ///
export interface toString { (): 'null' }
export function toString(): 'null' { return 'null' }
///    toString    ///
//////////////////////
//////////////////////
///    validate    ///
export type validate = ValidationFn<null>
export function validate(nullSchema: null_): validate {
  validateNull.tag = URI.null
  function validateNull(u: unknown, path = Array.of<keyof any>()) {
    return nullSchema(u) || [NullaryErrors.null(u, path)]
  }
  return validateNull
}
///    validate    ///
//////////////////////

export { null_ as null, null_ }

export let userDefinitions: Record<string, any> = {
  equals,
  toJsonSchema,
  toString,
}

export let userExtensions: Record<string, any> = {
  validate,
}

interface null_ extends null_.core {
  equals: equals
  toJsonSchema: toJsonSchema
  toString: toString
  validate: validate
}

function NullSchema(src: unknown): src is null { return src === null }
NullSchema.def = null
NullSchema.tag = URI.null

const null_ = <null_>Object_assign(
  NullSchema,
  userDefinitions,
) as null_

Object_assign(
  null_,
  userExtensions,
)

declare namespace null_ {
  interface core {
    (u: this['_type'] | Unknown): u is this['_type']
    tag: URI.null
    _type: null
    get def(): this['_type']
  }
}
