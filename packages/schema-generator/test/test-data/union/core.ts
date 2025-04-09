import {
  bindUserDefinitions,
  Object_assign,
  URI
} from '@traversable/registry'

import {
  t,
  Predicate,
} from '@traversable/schema'

export interface union<S> extends union.core<S> {
  //<%= types %>
}

export function union<S extends readonly t.Schema[]>(...schemas: S): union<S>
export function union<S extends readonly Predicate[], T extends { [I in keyof S]: t.Entry<S[I]> }>(...schemas: S): union<T>
export function union<S extends Predicate[]>(...schemas: S): {} { return union.def(schemas) }
export namespace union {
  export let proto = {} as union<unknown>
  export function def<T extends readonly unknown[]>(xs: T): union<T>
  export function def<T extends readonly unknown[]>(xs: T): {} {
    let userDefinitions = {
      //<%= terms %>
    }
    const anyOf = xs.every(t.isPredicate) ? Predicate.is.union(xs) : Predicate.is.unknown
    function UnionSchema(src: unknown) { return anyOf(src) }
    UnionSchema.tag = URI.union
    UnionSchema.def = xs
    Object_assign(UnionSchema, union.proto)
    return Object_assign(UnionSchema, bindUserDefinitions(UnionSchema, userDefinitions))
  }
}
export declare namespace union {
  interface core<S> {
    (u: unknown): u is this['_type']
    tag: URI.union
    def: S
    _type: S[number & keyof S]['_type' & keyof S[number & keyof S]]
  }
  type type<S, T = S[number & keyof S]['_type' & keyof S[number & keyof S]]> = never | T
}
