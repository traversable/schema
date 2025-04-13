/**  
 * of schema
 * made with ᯓᡣ𐭩 by @traversable/schema
 */
import type { Unknown } from '@traversable/registry'
import { Equal, Object_assign, URI } from '@traversable/registry'
import type {
  Entry,
  Guard,
  Guarded,
  SchemaLike
} from '../_namespace.js'
import type { t } from '../_exports.js'
import type { ValidationFn } from '@traversable/derive-validators'
import { NullaryErrors } from '@traversable/derive-validators'
////////////////////
///    equals    ///
export type equals = Equal
export function equals<T>(left: T, right: T): boolean {
  return Equal.lax(left, right)
}
///    equals    ///
////////////////////
//////////////////////////
///    toJsonSchema    ///
export interface toJsonSchema { (): void }
export function toJsonSchema(): toJsonSchema {
  function inlineToJsonSchema(): void {
    return void 0
  }
  return inlineToJsonSchema
}
///    toJsonSchema    ///
//////////////////////////
//////////////////////
///    toString    ///
export interface toString { (): 'unknown' }
export function toString(): 'unknown' { return 'unknown' }
///    toString    ///
//////////////////////
//////////////////////
///    validate    ///
export type validate = ValidationFn<void>
export function validate<T>(inlineSchema: of<T>): validate {
  validateInline.tag = URI.inline
  function validateInline(u: unknown, path = Array.of<keyof any>()) {
    return inlineSchema(u) || [NullaryErrors.inline(u, path)]
  }
  return validateInline
}
///    validate    ///
//////////////////////

export interface of<S> extends of.core<S> {
  equals: equals
  toJsonSchema: toJsonSchema
  toString: toString
  validate: validate
}

export function of<S extends SchemaLike>(typeguard: S): Entry<S>
export function of<S extends Guard>(typeguard: S): of<S>
export function of<S>(typeguard: (Guard<S>) & { tag?: URI.inline, def?: Guard<S> }) {
  typeguard.def = typeguard
  return Object_assign(typeguard, of.prototype)
}

export namespace of {
  export let userDefinitions: Record<string, any> = {
    equals,
    toJsonSchema,
    toString,
  }
  export let userExtensions: Record<string, any> = {
    validate,
  }
  export function def<T extends Guard>(guard: T): of<T>
  export function def<T extends Guard>(guard: T) {
    function InlineSchema(src: unknown) { return guard(src) }
    InlineSchema.tag = URI.inline
    InlineSchema.def = guard
    return InlineSchema
  }
}

export declare namespace of {
  interface core<S> {
    (u: this['_type'] | Unknown): u is this['_type']
    _type: Guarded<S>
    tag: URI.inline
    get def(): S
  }
  type type<S, T = Guarded<S>> = never | T
}
