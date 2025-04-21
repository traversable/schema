/**  
 * undefined_ schema
 * made with ᯓᡣ𐭩 by @traversable/schema@0.0.35
 */
import type { Equal, Unknown } from '@traversable/registry'
import { Object_assign, Object_is, URI } from '@traversable/registry'
import type { t } from '../index.js'
import type { ValidationFn } from '@traversable/derive-validators'
import { NullaryErrors } from '@traversable/derive-validators'
////////////////////
///    equals    ///
export type equals = Equal<undefined>
export function equals(left: undefined, right: undefined): boolean {
  return Object_is(left, right)
}
///    equals    ///
////////////////////
//////////////////////////
///    toJsonSchema    ///
export interface toJsonSchema { (): void }
export function toJsonSchema(): toJsonSchema {
  function undefinedToJsonSchema(): void { return void 0 }
  return undefinedToJsonSchema
}
///    toJsonSchema    ///
//////////////////////////
//////////////////////
///    toString    ///
export interface toString { (): 'undefined' }
export function toString(): 'undefined' { return 'undefined' }
///    toString    ///
//////////////////////
//////////////////////
///    validate    ///
export type validate = ValidationFn<undefined>
export function validate(undefinedSchema: undefined_): validate {
  validateUndefined.tag = URI.undefined
  function validateUndefined(u: unknown, path = Array.of<keyof any>()) {
    return undefinedSchema(u) || [NullaryErrors.undefined(u, path)]
  }
  return validateUndefined
}
///    validate    ///
//////////////////////

export { undefined_ as undefined }

export let userDefinitions: Record<string, any> = {
  equals,
  toJsonSchema,
  toString,
}

export let userExtensions: Record<string, any> = {
  validate,
}

interface undefined_ extends undefined_.core {
  equals: equals
  toJsonSchema: toJsonSchema
  toString: toString
  validate: validate
}

function UndefinedSchema(src: unknown): src is undefined { return src === void 0 }
UndefinedSchema.tag = URI.undefined
UndefinedSchema.def = void 0 as undefined

const undefined_ = <undefined_>Object_assign(
  UndefinedSchema,
  userDefinitions,
) as undefined_

Object_assign(undefined_, userExtensions)

declare namespace undefined_ {
  interface core {
    (u: this['_type'] | Unknown): u is this['_type']
    tag: URI.undefined
    _type: undefined
    get def(): this['_type']
  }
}
