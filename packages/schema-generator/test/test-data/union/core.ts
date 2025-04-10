import type { Unknown } from '@traversable/registry'
import { bindUserExtensions, Object_assign, safeCoerce, URI } from '@traversable/registry'
import { t, Predicate } from '@traversable/schema'

export interface union<S> extends union.core<S> {
  //<%= Types %>
}

export function union<S extends readonly t.Schema[]>(...schemas: S): union<S>
export function union<S extends readonly Predicate[], T extends { [I in keyof S]: t.Entry<S[I]> }>(...schemas: S): union<T>
export function union(...schemas: unknown[]) {
  return union.def(schemas)
}

export namespace union {
  export let userDefinitions: Record<string, any> = {
    //<%= Definitions %>
  } as Partial<union<unknown>>
  export function def<T extends readonly unknown[]>(xs: T): union<T>
  export function def(xs: unknown[]) {
    let userExtensions: Record<string, any> = {
      //<%= Extensions %>
    }
    const anyOf = xs.every(t.isPredicate) ? Predicate.is.union(xs.map(safeCoerce)) : Predicate.is.unknown
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
    def: S
    _type: union.type<S>
  }
  type type<S, T = S[number & keyof S]['_type' & keyof S[number & keyof S]]> = never | T
}
