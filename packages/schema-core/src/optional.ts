import type { Unknown } from '@traversable/registry'
import { bindUserExtensions, has, isPredicate, Object_assign, safeCoerce, symbol, URI } from '@traversable/registry'

import type { Entry, Schema, SchemaLike } from './types.js'
import { optional$ } from './predicates.js'

export function optional<S extends Schema>(schema: S): optional<S>
export function optional<S extends SchemaLike>(schema: S): optional<Entry<S>>
export function optional<S>(schema: S): optional<S> { return optional.def(schema) }

export interface optional<S> extends optional.core<S> {
  //<%= Types %>
}

export namespace optional {
  export let userDefinitions: Record<string, any> = {
    //<%= Definitions %>
  }
  export function def<T>(x: T): optional<T>
  export function def<T>(x: T) {
    let userExtensions: Record<string, any> = {
      //<%= Extensions %>
    }
    const optionalGuard = isPredicate(x) ? optional$(safeCoerce(x)) : (_: unknown) => true
    function OptionalSchema(src: unknown) { return optionalGuard(src) }
    OptionalSchema.tag = URI.optional
    OptionalSchema.def = x
    OptionalSchema[symbol.optional] = 1
    Object_assign(OptionalSchema, { ...optional.userDefinitions, get def() { return x } })
    return Object_assign(OptionalSchema, bindUserExtensions(OptionalSchema, userExtensions))
  }
  export const is
    : <S extends Schema>(u: unknown) => u is optional<S>
    /* v8 ignore next 1 */
    = <never>has('tag', (u) => u === URI.optional)
}

export declare namespace optional {
  interface core<S> {
    (u: this['_type'] | Unknown): u is this['_type']
    tag: URI.optional
    _type: undefined | S['_type' & keyof S]
    def: S
    [symbol.optional]: number
  }
  export type type<S, T = undefined | S['_type' & keyof S]> = never | T
}

