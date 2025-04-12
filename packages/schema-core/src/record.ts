import type { Unknown } from '@traversable/registry'
import { bindUserExtensions, isPredicate, Object_assign, safeCoerce, URI } from '@traversable/registry'

import type { Entry, Schema, SchemaLike } from './types.js'
import { object as anyObject, record$ } from './predicates.js'

export function record<S extends Schema>(schema: S): record<S>
export function record<S extends SchemaLike>(schema: S): record<Entry<S>>
export function record(schema: Schema) {
  return record.def(schema)
}

export interface record<S> extends record.core<S> {
  //<%= Types %>
}

export namespace record {
  export let userDefinitions: Record<string, any> = {
    //<%= Definitions %>
  }
  export function def<T>(x: T): record<T>
  /* v8 ignore next 1 */
  export function def(x: unknown): {} {
    let userExtensions: Record<string, any> = {
      //<%= Extensions %>
    }
    const recordGuard = isPredicate(x) ? record$(safeCoerce(x)) : anyObject
    function RecordSchema(src: unknown) { return recordGuard(src) }
    RecordSchema.tag = URI.record
    RecordSchema.def = x
    Object_assign(RecordSchema, record.userDefinitions)
    return Object_assign(RecordSchema, bindUserExtensions(RecordSchema, userExtensions))
  }
}

export declare namespace record {
  interface core<S> {
    (u: this['_type'] | Unknown): u is this['_type']
    tag: URI.record
    get def(): S
    _type: Record<string, S['_type' & keyof S]>
  }
  export type type<S, T = Record<string, S['_type' & keyof S]>> = never | T
}
