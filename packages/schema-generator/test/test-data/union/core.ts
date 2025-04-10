import { bindUserDefinitions, Object_assign, URI } from '@traversable/registry'
import type { IntersectType } from '@traversable/schema'
import { t, Predicate } from '@traversable/schema'

export interface intersect<S> extends intersect.core<S> {
  //<%= types %>
}

export function intersect<S extends readonly t.Schema[]>(...schemas: S): intersect<S>
export function intersect<S extends readonly Predicate[], T extends { [I in keyof S]: t.Entry<S[I]> }>(...schemas: S): intersect<T>
export function intersect<S extends unknown[]>(...schemas: S) {
  return intersect.def(schemas)
}

export namespace intersect {
  export let proto = {} as intersect<unknown>
  export function def<T extends readonly unknown[]>(xs: readonly [...T]): intersect<T>
  export function def<T extends readonly unknown[]>(xs: readonly [...T]): {} {
    let userDefinitions = {
      //<%= terms %>
    }
    const allOf = xs.every(t.isPredicate) ? Predicate.is.intersect(xs) : Predicate.is.unknown
    function IntersectSchema(src: unknown) { return allOf(src) }
    IntersectSchema.tag = URI.intersect
    IntersectSchema.def = xs
    Object_assign(IntersectSchema, intersect.proto)
    return Object_assign(IntersectSchema, bindUserDefinitions(IntersectSchema, userDefinitions))
  }
}

export declare namespace intersect {
  interface core<S> {
    (u: unknown): u is this['_type']
    tag: URI.intersect
    def: S
    _type: IntersectType<S>
  }
  type type<S, T = IntersectType<S>> = never | T
}
