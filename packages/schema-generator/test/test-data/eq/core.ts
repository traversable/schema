import type { Mut, Mutable, SchemaOptions as Options, Unknown } from '@traversable/registry'
import { applyOptions, bindUserExtensions, isPredicate, Object_assign, URI } from '@traversable/registry'
import { t } from '@traversable/schema-core'

export interface eq<S> extends eq.core<S> {
  //<%= Types %>
}

export function eq<const V extends Mut<V>>(value: V, options?: Options<V>): eq<Mutable<V>>
export function eq<const V>(value: V, options?: Options<V>): eq<V>
export function eq<const V>(value: V, options?: Options<V>): eq<V> {
  return eq.def(value, options)
}
export namespace eq {
  export let userDefinitions: Record<string, any> = {
    //<%= Definitions %>
  }
  export function def<T>(value: T, options?: Options): eq<T>
  export function def<T>(x: T, $?: Options): {} {
    let userExtensions: Record<string, any> = {
      //<%= Extensions %>
    }
    const options = applyOptions($)
    const eqGuard = isPredicate(x) ? x : (y: unknown) => options.eq.equalsFn(x, y)
    function EqSchema(src: unknown) { return eqGuard(src) }
    EqSchema.tag = URI.tag
    EqSchema.def = x
    Object_assign(EqSchema, eq.userDefinitions)
    return Object_assign(EqSchema, bindUserExtensions(EqSchema, userExtensions))
  }
}

export declare namespace eq {
  interface core<V> {
    (u: this['_type'] | Unknown): u is this['_type']
    tag: URI.eq
    _type: V
    def: V
  }
}
