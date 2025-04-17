import type { Unknown } from '@traversable/registry'
import {
  _isPredicate,
  bindUserExtensions,
  intersect as intersect$,
  isUnknown as isAny,
  Object_assign,
  URI,
} from '@traversable/registry'

import type { Entry, IntersectType, Schema, SchemaLike } from '../namespace.js'

export function intersect<S extends readonly Schema[]>(...schemas: S): intersect<S>
export function intersect<S extends readonly SchemaLike[], T extends { [I in keyof S]: Entry<S[I]> }>(...schemas: S): intersect<T>
export function intersect(...schemas: readonly unknown[]) {
  return intersect.def(schemas)
}

export interface intersect<S> extends intersect.core<S> {
  //<%= Types %>
}

export namespace intersect {
  export let userDefinitions: Record<string, any> = {
    //<%= Definitions %>
  } as intersect<unknown>
  export function def<T extends readonly unknown[]>(xs: readonly [...T]): intersect<T>
  /* v8 ignore next 1 */
  export function def(xs: readonly unknown[]): {} {
    let userExtensions: Record<string, any> = {
      //<%= Extensions %>
    }
    const predicate = xs.every(_isPredicate) ? intersect$(xs) : isAny
    function IntersectSchema(src: unknown) { return predicate(src) }
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
    get def(): S
    _type: IntersectType<S>
  }
  type type<S, T = IntersectType<S>> = never | T
}
