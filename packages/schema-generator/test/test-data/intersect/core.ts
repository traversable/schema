import type { Unknown } from '@traversable/registry'
import { bindUserExtensions, isPredicate, Object_assign, safeCoerce, URI } from '@traversable/registry'
import type { IntersectType } from '@traversable/schema-core'
import { t, Predicate } from '@traversable/schema-core'

export interface intersect<S> extends intersect.core<S> {
  //<%= Types %>
}

export function intersect<S extends readonly t.Schema[]>(...schemas: S): intersect<S>
export function intersect<S extends readonly Predicate[], T extends { [I in keyof S]: t.Entry<S[I]> }>(...schemas: S): intersect<T>
export function intersect(...schemas: readonly unknown[]) {
  return intersect.def(schemas)
}

export namespace intersect {
  export let userDefinitions: Record<string, any> = {
    //<%= Definitions %>
  } as intersect<unknown>
  export function def<T extends readonly unknown[]>(xs: readonly [...T]): intersect<T>
  export function def(xs: readonly unknown[]): {} {
    let userExtensions: Record<string, any> = {
      //<%= Extensions %>
    }
    const allOf = xs.every(isPredicate) ? Predicate.is.intersect(xs.map(safeCoerce)) : Predicate.is.unknown
    function IntersectSchema(src: unknown) { return allOf(src) }
    IntersectSchema.tag = URI.intersect
    IntersectSchema.def = xs
    Object_assign(IntersectSchema, intersect.userDefinitions)
    return Object_assign(IntersectSchema, bindUserExtensions(IntersectSchema, userExtensions))
  }
}

export declare namespace intersect {
  interface core<S> {
    (u: this['_type'] | Unknown): u is this['_type']
    tag: URI.intersect
    def: S
    _type: IntersectType<S>
  }
  type type<S, T = IntersectType<S>> = never | T
}
