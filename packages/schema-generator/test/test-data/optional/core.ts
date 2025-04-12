import type { Unknown } from '@traversable/registry'
import { bindUserExtensions, has, isPredicate, Object_assign, safeCoerce, symbol, URI } from '@traversable/registry'
import { t, Predicate } from '@traversable/schema-core'

export interface optional<S> extends optional.core<S> {
  //<%= Types %>
}

export function optional<S extends t.Schema>(schema: S): optional<S>
export function optional<S extends Predicate>(schema: S): optional<t.Entry<S>>
export function optional<S>(schema: S): optional<S> { return optional.def(schema) }
export namespace optional {
  export let userDefinitions: Record<string, any> = {
    //<%= Definitions %>
  }
  export function def<T>(x: T): optional<T>
  export function def<T>(x: T) {
    let userExtensions: Record<string, any> = {
      //<%= Extensions %>
    }
    const optionalGuard = isPredicate(x) ? Predicate.is.optional(safeCoerce(x)) : (_: unknown) => true
    function OptionalSchema(src: unknown) { return optionalGuard(src) }
    OptionalSchema.tag = URI.optional
    OptionalSchema.def = x
    OptionalSchema[symbol.optional] = 1
    Object_assign(OptionalSchema, optional.userDefinitions)
    return Object_assign(OptionalSchema, bindUserExtensions(OptionalSchema, userExtensions))
  }
  export const is
    : <S extends t.Schema>(u: unknown) => u is optional<S>
    = has('tag', (u) => u === URI.optional) as never
}

export declare namespace optional {
  interface core<S> {
    (u: this['_type'] | Unknown): u is this['_type']
    tag: URI.optional
    def: S
    [symbol.optional]: number
    _type: undefined | S['_type' & keyof S]
  }
  export type type<S, T = undefined | S['_type' & keyof S]> = never | T
}
