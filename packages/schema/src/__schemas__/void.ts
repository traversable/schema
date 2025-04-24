/**  
 * void_ schema
 * made with ᯓᡣ𐭩 by @traversable/schema@0.0.35
 */
import type { Equal, Unknown } from '@traversable/registry'
import { Object_assign, Object_is, URI } from '@traversable/registry'
import type { t } from '../_exports.js'
import type { ValidationFn } from '@traversable/derive-validators'
import { NullaryErrors } from '@traversable/derive-validators'
////////////////////
///    equals    ///
export type equals = Equal<void>
export function equals(left: void, right: void): boolean {
  return Object_is(left, right)
}
///    equals    ///
////////////////////
//////////////////////////
///    toJsonSchema    ///
export interface toJsonSchema { (): void }
export function toJsonSchema(): toJsonSchema {
  function voidToJsonSchema(): void {
    return void 0
  }
  return voidToJsonSchema
}
///    toJsonSchema    ///
//////////////////////////
//////////////////////
///    toString    ///
export interface toString { (): 'void' }
export function toString(): 'void' { return 'void' }
///    toString    ///
//////////////////////
//////////////////////
///    validate    ///
export type validate = ValidationFn<void>
export function validate(voidSchema: void_): validate {
  validateVoid.tag = URI.void
  function validateVoid(u: unknown, path = Array.of<keyof any>()) {
    return voidSchema(u) || [NullaryErrors.void(u, path)]
  }
  return validateVoid
}
///    validate    ///
//////////////////////

export { void_ as void, void_ }

export let userDefinitions: Record<string, any> = {
  equals,
  toJsonSchema,
  toString,
}

export let userExtensions: Record<string, any> = {
  validate,
}

interface void_ extends void_.core {
  equals: equals
  toJsonSchema: toJsonSchema
  toString: toString
  validate: validate
}

function VoidSchema(src: unknown): src is void { return src === void 0 }
VoidSchema.tag = URI.void
VoidSchema.def = void 0 as void

const void_ = <void_>Object_assign(
  VoidSchema,
  userDefinitions,
) as void_

Object_assign(void_, userExtensions)

declare namespace void_ {
  interface core {
    (u: this['_type'] | Unknown): u is this['_type']
    tag: URI.void
    _type: void
    get def(): this['_type']
  }
}
