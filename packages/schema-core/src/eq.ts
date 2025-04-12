import type { Mut, Mutable, SchemaOptions as Options, Unknown } from '@traversable/registry'
import { applyOptions, bindUserExtensions, isPredicate, Object_assign, URI } from '@traversable/registry'

export function eq<const V extends Mut<V>>(value: V, options?: Options<V>): eq<Mutable<V>>
export function eq<const V>(value: V, options?: Options<V>): eq<V>
export function eq<const V>(value: V, options?: Options<V>): eq<V> {
  return eq.def(value, options)
}

export interface eq<V> extends eq.core<V> {
  //<%= Types %>
}

export namespace eq {
  export let userDefinitions: Record<string, any> = {
    //<%= Definitions %>
  }
  export function def<T>(value: T, options?: Options): eq<T>
  /* v8 ignore next 1 */
  export function def<T>(x: T, $?: Options): {} {
    let userExtensions: Record<string, any> = {
      //<%= Extensions %>
    }
    const options = applyOptions($)
    const eqGuard = isPredicate(x) ? x : (y: unknown) => options.eq.equalsFn(x, y)
    function EqSchema(src: unknown) { return eqGuard(src) }
    EqSchema.tag = URI.eq
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
    get def(): V
  }
}
