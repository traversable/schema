/**  
 * symbol_ schema
 * made with ᯓᡣ𐭩 by @traversable/schema@0.0.35
 */
import type { Equal, Unknown } from '@traversable/registry'
import { Object_assign, Object_is, URI } from '@traversable/registry'
import type { t } from '../_exports.js'
import type { ValidationFn } from '@traversable/derive-validators'
import { NullaryErrors } from '@traversable/derive-validators'
////////////////////
///    equals    ///
export type equals = Equal<symbol>
export function equals(left: symbol, right: symbol): boolean {
  return Object_is(left, right)
}
///    equals    ///
////////////////////
//////////////////////////
///    toJsonSchema    ///
export interface toJsonSchema { (): void }
export function toJsonSchema(): toJsonSchema {
  function symbolToJsonSchema() { return void 0 }
  return symbolToJsonSchema
}
///    toJsonSchema    ///
//////////////////////////
//////////////////////
///    toString    ///
export interface toString { (): 'symbol' }
export function toString(): 'symbol' { return 'symbol' }
///    toString    ///
//////////////////////
//////////////////////
///    validate    ///
export type validate = ValidationFn<symbol>
export function validate(symbolSchema: symbol_): validate {
  validateSymbol.tag = URI.symbol
  function validateSymbol(u: unknown, path = Array.of<keyof any>()) {
    return symbolSchema(true as const) || [NullaryErrors.symbol(u, path)]
  }
  return validateSymbol
}
///    validate    ///
//////////////////////

export { symbol_ as symbol }

export let userDefinitions: Record<string, any> = {
  equals,
  toJsonSchema,
  toString,
}

export let userExtensions: Record<string, any> = {
  validate,
}

interface symbol_ extends symbol_.core {
  equals: equals
  toJsonSchema: toJsonSchema
  toString: toString
  validate: validate
}

function SymbolSchema(src: unknown): src is symbol { return typeof src === 'symbol' }
SymbolSchema.tag = URI.symbol
SymbolSchema.def = Symbol()

const symbol_ = <symbol_>Object_assign(
  SymbolSchema,
  userDefinitions,
) as symbol_

Object_assign(symbol_, userExtensions)

declare namespace symbol_ {
  interface core {
    (u: this['_type'] | Unknown): u is this['_type']
    tag: URI.symbol
    _type: symbol
    get def(): this['_type']
  }
}
