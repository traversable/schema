import type { Unknown } from '@traversable/registry'
import { bindUserExtensions, Object_assign, safeCoerce, URI } from '@traversable/registry'
import { t, Predicate } from '@traversable/schema'

export interface record<S> extends record.core<S> {
  //<%= Types %>
}

export function record<S extends t.Schema>(schema: S): record<S>
export function record<S extends t.Predicate>(schema: S): record<t.Entry<S>>
export function record(schema: t.Schema) {
  return record.def(schema)
}

export namespace record {
  export let userDefinitions: Record<string, any> = {
    //<%= Definitions %>
  }
  export function def<T>(x: T): record<T>
  export function def(x: unknown): {} {
    let userExtensions: Record<string, any> = {
      //<%= Extensions %>
    }
    const recordGuard = t.isPredicate(x) ? Predicate.is.record(safeCoerce(x)) : Predicate.is.anyObject
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
    def: S
    _type: Record<string, S['_type' & keyof S]>
  }
  export type type<S, T = Record<string, S['_type' & keyof S]>> = never | T
}
