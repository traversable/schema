import type { Unknown } from '@traversable/registry'
import { bindUserExtensions, isPredicate, Object_assign, safeCoerce, URI } from '@traversable/registry'

import type { Entry, Schema, SchemaLike } from './types.js'
import { is } from './predicates.js'

export function union<S extends readonly Schema[]>(...schemas: S): union<S>
export function union<S extends readonly SchemaLike[], T extends { [I in keyof S]: Entry<S[I]> }>(...schemas: S): union<T>
export function union(...schemas: unknown[]) {
  return union.def(schemas)
}

export interface union<S> extends union.core<S> {
  //<%= Types %>
}

export namespace union {
  export let userDefinitions: Record<string, any> = {
    //<%= Definitions %>
  } as Partial<union<unknown>>
  export function def<T extends readonly unknown[]>(xs: T): union<T>
  /* v8 ignore next 1 */
  export function def(xs: unknown[]) {
    let userExtensions: Record<string, any> = {
      //<%= Extensions %>
    }
    const anyOf = xs.every(isPredicate) ? is.union(xs.map(safeCoerce)) : is.unknown
    function UnionSchema(src: unknown): src is unknown { return anyOf(src) }
    UnionSchema.tag = URI.union
    UnionSchema.def = xs
    Object_assign(UnionSchema, union.userDefinitions)
    return Object_assign(UnionSchema, bindUserExtensions(UnionSchema, userExtensions))
  }
}

export declare namespace union {
  interface core<S> {
    (u: this['_type'] | Unknown): u is this['_type']
    tag: URI.union
    _type: union.type<S>
    get def(): S
  }
  type type<S, T = S[number & keyof S]['_type' & keyof S[number & keyof S]]> = never | T
}
