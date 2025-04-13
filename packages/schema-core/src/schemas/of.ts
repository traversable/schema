import type { Unknown } from '@traversable/registry'
import { Object_assign, URI } from '@traversable/registry'

import type {
  Entry,
  Guard,
  Guarded,
  SchemaLike,
} from '../namespace.js'

export interface of<S> extends of.core<S> {
  //<%= Types %>
}

export function of<S extends SchemaLike>(typeguard: S): Entry<S>
export function of<S extends Guard>(typeguard: S): of<S>
export function of<S>(typeguard: (Guard<S>) & { tag?: URI.inline, def?: Guard<S> }) {
  typeguard.def = typeguard
  return Object_assign(typeguard, of.prototype)
}

export namespace of {
  export let userDefinitions: Record<string, any> = {
    //<%= Definitions %>
  }
  export function def<T extends Guard>(guard: T): of<T>
  /* v8 ignore next 6 */
  export function def<T extends Guard>(guard: T) {
    function InlineSchema(src: unknown) { return guard(src) }
    InlineSchema.tag = URI.inline
    InlineSchema.def = guard
    return InlineSchema
  }
}

export declare namespace of {
  interface core<S> {
    (u: this['_type'] | Unknown): u is this['_type']
    _type: Guarded<S>
    tag: URI.inline
    get def(): S
  }
  type type<S, T = Guarded<S>> = never | T
}
