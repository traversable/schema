import type { Returns } from '@traversable/registry'
import { fn, Object_keys } from '@traversable/registry'
import type { RequiredKeys } from '@traversable/schema-to-json-schema'
import { isRequired, property } from '@traversable/schema-to-json-schema'
import { t } from '@traversable/schema'

export interface toJsonSchema<T, KS extends RequiredKeys<T> = RequiredKeys<T>> {
  (): {
    type: 'object'
    required: { [I in keyof KS]: KS[I] & string }
    properties: { [K in keyof T]: Returns<T[K]['toJsonSchema' & keyof T[K]]> }
  }
}

export function toJsonSchema<S extends { [x: string]: t.Schema }, KS extends RequiredKeys<S>>(objectSchema: t.object<S>): toJsonSchema<S, KS>
export function toJsonSchema<S extends { def: { [x: string]: unknown } }, KS extends RequiredKeys<S>>(objectSchema: t.object<S>): toJsonSchema<S, KS>
export function toJsonSchema({ def }: { def: { [x: string]: unknown } }): () => { type: 'object', required: string[], properties: {} } {
  const required = Object_keys(def).filter(isRequired(def))
  function objectToJsonSchema() {
    return {
      type: 'object' as const,
      required,
      properties: fn.map(def, (v, k) => property(required)(v, k as number | string)),
    }
  }
  return objectToJsonSchema
}
